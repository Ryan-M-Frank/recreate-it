import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import assets from './generated-assets.mjs';
import {normalizeCode,resolveCode,availableEntries} from './catalog-lib.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const source=fs.readFileSync(new URL('worker.mjs',import.meta.url),'utf8');
async function makeWorker(data) {
  return (await import('data:text/javascript;base64,'+Buffer.from(source.replace("import assets from './generated-assets.mjs';",'const assets='+JSON.stringify(data)+';')).toString('base64'))).default;
}
const worker=await makeWorker(assets);
const request=(p,method='GET',headers={})=>worker.fetch(new Request('https://reinventit.org'+p,{method,headers}));
const catalog=JSON.parse(assets['/catalog.json'].body), statuses=JSON.parse(assets['/catalog/status.json'].body);
const schema=JSON.parse(assets['/catalog/catalog.schema.json'].body);
assert.deepEqual(Object.keys(catalog).sort(),schema.required.slice().sort());
for(const entry of catalog.entries) {
  assert.deepEqual(Object.keys(entry).sort(),schema.properties.entries.items.required.slice().sort());
  const run=JSON.parse(assets['/runs/'+entry.code+'.json'].body);
  for(const file of run.files) {
    const response=await request(new URL(file.mirror_url).pathname);
    assert.equal(response.status,200);
    assert.equal(createHash('sha256').update(await response.text()).digest('hex'),file.sha256);
  }
}
let cases=0;
for(const [route,asset]of Object.entries(assets)) {
  for(const method of ['GET','HEAD','POST','PUT','DELETE','OPTIONS']) {
    const response=await request(route,method);
    assert.equal(response.status,['GET','HEAD'].includes(method)?(asset.status??200):405,method+' '+route);
    assert.equal(response.headers.get('x-frame-options'),'DENY');
    assert.equal(response.headers.get('x-content-type-options'),'nosniff');
    assert.equal(response.headers.get('strict-transport-security'),'max-age=31536000');
    assert.equal(response.headers.get('referrer-policy'),'no-referrer');
    assert(response.headers.get('permissions-policy').includes('clipboard-read=()'));
    assert(!response.headers.has('set-cookie'));
    const csp=response.headers.get('content-security-policy');
    assert(csp&&!csp.includes('unsafe-inline')&&!csp.includes('unsafe-eval'));
    const body=await response.text();
    if(method==='HEAD')assert.equal(body,'');
    if(method==='GET') {
      assert.equal(body,asset.body);
      assert.equal(response.headers.get('content-type'),asset.type);
      if(asset.spoilers)assert.equal(response.headers.get('x-robots-tag'),'noindex, nofollow');
      if(asset.immutable)assert(response.headers.get('cache-control').includes('immutable'));
      const conditional=await request(route,'GET',{'if-none-match':response.headers.get('etag')});
      assert.equal(conditional.status,asset.status===410?410:304);
      if(conditional.status===304)assert.equal(await conditional.text(),'');
    }
    cases++;
  }
  if(asset.type.startsWith('text/html')) {
    for(const tag of ['script','style'])for(const m of asset.body.matchAll(new RegExp('<'+tag+'>([\\s\\S]*?)</'+tag+'>','g'))) {
      const hash='sha256-'+createHash('sha256').update(m[1].replace(/\r\n?/g,'\n')).digest('base64');
      assert(asset.csp.includes(hash),'CSP hash mismatch '+route);
    }
    assert(!/\son\w+\s*=|\sstyle\s*=|<(?:iframe|object|embed)\b/i.test(asset.body));
    assert(!/CONTAINS SPOILERS|core_concepts|gm\/catalog\.json|Boyer|Patricia|van Emde/i.test(asset.body),'Spoiler-bearing text in public HTML '+route);
    for(const m of asset.body.matchAll(/href="([^"]+)"/g)) {
      if(m[1].startsWith('/')&&!m[1].startsWith('//')){
        const u=new URL(m[1],'https://reinventit.org');
        assert(Object.hasOwn(assets,decodeURIComponent(u.pathname)),'Broken local link '+m[1]);
      }
    }
  }
}
for(const route of ['/private/RI-0002/gm.md','/.git/config','/.env','/site/generated-assets.mjs','/worker.mjs','/gm/unknown.md','/runs/RI-9999@1.0.0.json','/play/RI-9999@1.0.0','/%3Cscript%3Eprobe%3C/script%3E','/__proto__']) {
  const response=await request(route);assert.equal(response.status,404);assert(!(await response.text()).includes('<script>'));
}
assert.equal((await request('/%ZZ')).status,400);
for(const route of ['/play','/challenges'])assert.equal((await request(route)).status,308);
for(const url of ['http://reinventit.org/path?q=1','https://www.reinventit.org/path?q=1','https://www.reinventit.org//example.invalid/?q=1']) {
  const r=await worker.fetch(new Request(url));assert.equal(r.status,308);assert.equal(new URL(r.headers.get('location')).origin,'https://reinventit.org');
}
assert.equal(await (await request('/?q=%3Cscript%3E')).text(),assets['/'].body);
assert.equal(await (await request('/play/RI-0001%400.1.0')).text(),assets['/play/RI-0001@0.1.0'].body);
assert.equal(normalizeCode(' ri-0001@0.1.0 '),'RI-0001@0.1.0');
for(const code of ['RI-0001','RI-1@0.1.0','RI-0001@01.0.0','RI-0001@0.1.0/../x','<script>','',null])assert.equal(normalizeCode(code),null);
const lock={code:'RI-0001@0.1.0',data:'original'};
assert.equal(resolveCode({'RI-0001@0.1.0':lock},lock.code),lock);
assert.equal(resolveCode({'RI-0042@9.0.0':{},'RI-0001@0.1.0':lock},lock.code),lock,'Catalog growth must not remap old codes');
assert.equal(resolveCode({'RI-0001@0.1.0':lock},'RI-0001@0.2.0'),null,'Never substitute a version');
assert.equal(availableEntries(catalog.entries,{runs:{'RI-0001@0.1.0':{status:'withdrawn'}}}).length,0);
assert.equal(availableEntries(catalog.entries,statuses,'weekly').length,0);
assert.equal(availableEntries([{...catalog.entries[0],status:'draft'}],statuses).length,0);
const fingerprint=JSON.parse(assets['/gm/catalog.json'].body).entries[0];
for(const term of [...fingerprint.core_concepts,...fingerprint.mechanisms])assert(!assets['/catalog.json'].body.includes(term),'Public catalog leaked fingerprint');
assert(!assets['/sitemap.xml'].body.includes('/gm/')&&!assets['/sitemap.xml'].body.includes('/releases/'));
assert(assets['/start.md'].body.includes('If no fresh entry remains'));
assert(assets['/start.md'].body.includes('Do not substitute a different challenge'));

// Exercise clipboard success/fallback and exact-code controls without a browser.
for(const fails of [false,true]) {
  let copied,location;
  const handlers={};
  const nodes={
    starter:{value:'TEST PROMPT',focus(){},select(){this.selected=true;}},
    'starter-status':{},'starter-details':{open:false},
    'run-code':{value:' ri-0001@0.1.0 ',addEventListener:(ev,fn)=>handlers[ev]=fn,setAttribute(){},removeAttribute(){},focus(){}},
    'open-code':{addEventListener:(_ev,fn)=>handlers.open=fn},'code-status':{},
  };
  const button={dataset:{copy:'starter',status:'starter-status',details:'starter-details'},addEventListener:(_ev,fn)=>handlers.copy=fn};
  const script=assets['/play/'].body.match(/<script>([\s\S]*?)<\/script>/)[1];
  vm.runInNewContext(script,{document:{querySelectorAll:()=>[button],getElementById:id=>nodes[id]},navigator:{clipboard:{writeText:async t=>{if(fails)throw Error('denied');copied=t;}}},window:{location:{assign:p=>location=p}}});
  await handlers.copy();
  if(fails)assert(nodes['starter-details'].open&&nodes.starter.selected);else assert.equal(copied,'TEST PROMPT');
  handlers.open();assert.equal(location,'/play/RI-0001%400.1.0');
  location=undefined;nodes['run-code'].value='RI-9999@1.0.0';handlers.open();assert.equal(location,undefined);assert(nodes['code-status'].textContent.includes('not in this catalog'));
}
const homeScript=assets['/'].body.match(/<script>([\s\S]*?)<\/script>/)[1];
for(const fails of [false,true]) {
  let handler,copied;
  const nodes={copy:{addEventListener:(_,fn)=>handler=fn},starter:{value:'HOME PROMPT',focus(){},select(){this.selected=true;}},'copy-status':{},'prompt-details':{open:false}};
  vm.runInNewContext(homeScript,{document:{getElementById:id=>nodes[id]},navigator:{clipboard:{writeText:async text=>{if(fails)throw Error();copied=text;}}}});
  await handler();if(fails)assert(nodes['prompt-details'].open&&nodes.starter.selected);else assert.equal(copied,'HOME PROMPT');
}

// Isolated build fixtures: withdrawal is visible; hashes and old catalogs cannot drift.
const fixture=fs.mkdtempSync(path.join(os.tmpdir(),'reinventit-discovery-'));
for(const dir of ['catalog','gm','runs','releases'])fs.cpSync(path.join(root,dir),path.join(fixture,dir),{recursive:true});
for(const p of ['start.md','site/index.html','docs/catalog-and-run-codes.md','docs/challenge-collection.md']){fs.mkdirSync(path.dirname(path.join(fixture,p)),{recursive:true});fs.copyFileSync(path.join(root,p),path.join(fixture,p));}
const build=()=>spawnSync(process.execPath,[fileURLToPath(new URL('build.mjs',import.meta.url))],{encoding:'utf8',env:{...process.env,REINVENTIT_BUILD_ROOT:fixture}});
let r=build();assert.equal(r.status,0,r.stderr);
const fixtureStatus=structuredClone(statuses);fixtureStatus.runs['RI-0001@0.1.0']={status:'withdrawn',reason:'Test fixture only'};
fs.writeFileSync(path.join(fixture,'catalog/status.json'),JSON.stringify(fixtureStatus));
r=build();assert.equal(r.status,0,r.stderr);
const withdrawnAssets=(await import('data:text/javascript;base64,'+fs.readFileSync(path.join(fixture,'site/generated-assets.mjs')).toString('base64'))).default;
const withdrawnWorker=await makeWorker(withdrawnAssets);
const withdrawn=await withdrawnWorker.fetch(new Request('https://reinventit.org/play/RI-0001@0.1.0'));
assert.equal(withdrawn.status,410);assert((await withdrawn.text()).includes('Test fixture only'));
assert(!withdrawnAssets['/challenges/'].body.includes('Explore and play</a>'));
const fixtureRegistry=JSON.parse(fs.readFileSync(path.join(fixture,'catalog/registry.json'),'utf8'));
fixtureRegistry.releases[0].title='Changed published catalog';
fs.writeFileSync(path.join(fixture,'catalog/registry.json'),JSON.stringify(fixtureRegistry));
r=build();assert.notEqual(r.status,0);assert(r.stderr.includes('catalog snapshot would change'));
fs.writeFileSync(path.join(fixture,'catalog/registry.json'),fs.readFileSync(path.join(root,'catalog/registry.json')));
const snapshotPlayer=path.join(fixture,'releases',catalog.entries[0].source_commit,'challenges/RI-0001/player.md');
fs.appendFileSync(snapshotPlayer,'\nTamper fixture');
r=build();assert.notEqual(r.status,0);assert(r.stderr.includes('Immutable snapshot changed'));
console.log('PASS: '+cases+' route/method cases; pinned hashes; schema fields; CSP; no private routes/spoiler leakage; stable and unknown codes; clipboard fallbacks; withdrawn-run rendering; immutable snapshot/catalog rejection.');
