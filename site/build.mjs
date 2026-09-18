import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import assert from 'node:assert/strict';
import {readRelease,availableEntries,sha256} from './catalog-lib.mjs';
import {escapeHtml as e,starter,interactiveScript,promptBox,codeBox,card,layout} from './render.mjs';
const root=process.env.REINVENTIT_BUILD_ROOT || fileURLToPath(new URL('../',import.meta.url));
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(read(p));
const write=(p,body)=>{fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),body);};
const registry=json('catalog/registry.json');
const statuses=json('catalog/status.json');
const gm=json('catalog/gm-fingerprints.json');
assert.equal(registry.schema_version,1); assert.equal(statuses.schema_version,1);
assert(/^[1-9][0-9]*$/.test(registry.catalog_version));
assert.equal(registry.official_origin,'https://reinventit.org');
assert.equal(registry.official_repository,'https://github.com/Ryan-M-Frank/recreate-it');
assert.equal(gm.contains_spoilers,true);
const seen=new Set(), entries=[], releases=new Map();
for(const entry of registry.releases) {
  assert(!seen.has(entry.code),'Duplicate code');seen.add(entry.code);
  assert(['available','withdrawn'].includes(statuses.runs[entry.code]?.status),'Missing current eligibility');
  if(statuses.runs[entry.code].status==='withdrawn')assert(statuses.runs[entry.code].reason?.trim(),'Withdrawal needs a reason');
  const release=readRelease(root,entry);releases.set(entry.code,release);
  const pub={};
  for(const key of ['id','version','code','title','description','area','difficulty','duration_minutes','measurement_note','status','modes','source_commit','protocol_version','original_playtest'])pub[key]=entry[key];
  pub.run_url=registry.official_origin+'/runs/'+entry.code+'.json';
  pub.play_url=registry.official_origin+'/play/'+entry.code;
  pub.player_url=release.files.get(entry.packet_path+'/player.md').mirror_url;
  entries.push(pub);
}
assert.equal(Object.keys(statuses.runs).length,seen.size,'Status entries must match registered releases');
assert.equal(gm.entries.length,seen.size,'GM index must match registered releases');
for(const f of gm.entries)assert(seen.has(f.code)&&f.core_concepts?.length&&f.mechanisms?.length,'Incomplete GM fingerprint');
assert.equal(new Set(gm.entries.map(f=>f.code)).size,seen.size,'Duplicate GM fingerprint');
const catalog={schema_version:1,catalog_version:registry.catalog_version,released_at:registry.released_at,official_origin:registry.official_origin,official_repository:registry.official_repository,status_url:registry.official_origin+'/catalog/status.json',entries};
const serialized=JSON.stringify(catalog,null,2)+'\n';
const archive='catalog/v'+registry.catalog_version+'.json';
if(fs.existsSync(path.join(root,archive)))assert.equal(read(archive),serialized,'Published catalog snapshot would change; allocate a new catalog version');
else write(archive,serialized);
write('catalog.json',serialized);
write('gm/catalog.json',JSON.stringify({...gm,catalog_version:registry.catalog_version},null,2)+'\n');
const assets={};
function add(route,body,type,options={}) {
  assert(!Object.hasOwn(assets,route),'Duplicate public route: '+route);
  const csp=["default-src 'none'","base-uri 'none'","form-action 'none'","frame-ancestors 'none'","object-src 'none'","script-src-attr 'none'","style-src-attr 'none'","img-src data:"];
  for(const tag of ['script','style']) {
    const matches=type.startsWith('text/html')?[...body.matchAll(new RegExp('<'+tag+'>([\\s\\S]*?)</'+tag+'>','g'))]:[];
    csp.push(tag+'-src '+(matches.length?matches.map(m=>"'sha256-"+createHash('sha256').update(m[1].replace(/\r\n?/g,'\n')).digest('base64')+"'").join(' '):"'none'"));
  }
  assets[route]={body,type,csp:csp.join('; '),etag:'"'+sha256(body)+'"',...options};
}
add('/catalog.json',serialized,'application/json; charset=utf-8');
for(const name of fs.readdirSync(path.join(root,'catalog')).filter(n=>/^v[1-9][0-9]*\.json$/.test(n)))add('/catalog/'+name,read('catalog/'+name),'application/json; charset=utf-8',{immutable:true});
add('/catalog/status.json',read('catalog/status.json'),'application/json; charset=utf-8',{maxAge:60});
add('/catalog/catalog.schema.json',read('catalog/catalog.schema.json'),'application/schema+json; charset=utf-8');
add('/gm/catalog.json',read('gm/catalog.json'),'application/json; charset=utf-8',{spoilers:true});
add('/start.md',read('start.md'),'text/plain; charset=utf-8');
add('/docs/catalog-and-run-codes.md',read('docs/catalog-and-run-codes.md'),'text/plain; charset=utf-8');
add('/docs/challenge-collection.md',read('docs/challenge-collection.md'),'text/plain; charset=utf-8');
for(const [code,{run,files}]of releases) {
  add('/runs/'+code+'.json',read('runs/'+code+'.json'),'application/json; charset=utf-8',{immutable:true,noindex:true});
  for(const [p,file]of files) {
    const route='/releases/'+run.source_commit+'/'+p;
    if(Object.hasOwn(assets,route)){assert.equal(assets[route].body,file.body);continue;}
    add(route,file.body,'text/plain; charset=utf-8',{immutable:true,noindex:true,spoilers:file.contains_spoilers});
  }
}
const home=read('site/index.html');
const css=home.match(/<style>([\s\S]*?)<\/style>/)?.[1];assert(css,'Missing home styles');
const active=availableEntries(entries,statuses), codes=entries.map(x=>x.code);
const countText=active.length+' released '+(active.length===1?'challenge':'challenges');
const availability='<p class="catalog-note">'+countText+' available for solo play. Our collection is growing toward 100 reviewed challenges. If your history covers everything here, your GM will offer an intentional repeat. Difficulty and timing are unmeasured unless noted.</p>';
const list='<div class="catalog-list">'+active.map(card).join('')+'</div>';
const playBody='<section class="catalog-head"><p class="eyebrow">Bring your curiosity. Bring your AI.</p><h1>Your next <span>what if?</span></h1><p>Let your GM find a fresh problem, or join a friend on the exact same challenge.</p></section><div class="split">'+promptBox(null)+codeBox(codes[0])+'</div><section><h2>Ready to play</h2>'+availability+list+'</section>';
add('/play/',layout({title:'Choose your next challenge',description:'Let your AI select a computational challenge or enter a permanent run code to play the same version as a friend.',path:'/play/',body:playBody,css,script:interactiveScript(codes)}),'text/html; charset=utf-8');
const catalogBody='<section class="catalog-head"><p class="eyebrow">The challenge library</p><h1>Problems worth <span>thinking about.</span></h1><p>Invent algorithms and data structures from a fixed problem. Your AI helps you test your ideas; the reveal comes later.</p><div class="actions"><a class="textlink" href="/play/">Let my AI choose</a><a href="/play/#run-code">I have a run code</a></div></section>'+availability+list+'<p class="catalog-note">Each code fixes the challenge and rule version. Drafts become playable only after review and playtesting. <a href="/docs/challenge-collection.md">How the collection grows</a>.</p>';
add('/challenges/',layout({title:'Challenge library',description:'Browse the released Reinvent It challenges. Explore computer science problems with your own AI Game Master.',path:'/challenges/',body:catalogBody,css}),'text/html; charset=utf-8');
for(const entry of entries) {
  const raw=releases.get(entry.code).files.get('challenges/'+entry.id+'/player.md').body;
  const status=statuses.runs[entry.code];
  const body='<section class="catalog-head"><p class="eyebrow">'+e(entry.area)+' &middot; Solo challenge</p><h1>'+e(entry.title)+'</h1><p>'+e(entry.description)+'</p><p class="run-code">'+e(entry.code)+'</p></section>'+
    (status.status==='available'?'<div class="split">'+promptBox(entry.code)+'<section class="panel"><h2>Same code. Same problem.</h2><p>Share this page with a friend. You will get the same challenge version and fixed rules, even as the collection grows.</p><p>Your conversations and solutions can take different paths.</p><p class="note">'+e(entry.measurement_note)+'</p><a href="'+e(entry.player_url)+'">Read the plain-text player packet</a></section></div>':'<section class="panel"><h2>This run has been withdrawn.</h2><p>'+e(status.reason)+'</p><p>The original version is preserved for reference. Your GM must not silently substitute another challenge.</p></section>')+
    '<section class="run-info"><h2>The player packet</h2><p>Safe to read. These are the fixed requirements your GM will present.</p><details><summary>Read the complete setup and rules</summary><pre class="packet">'+e(raw)+'</pre></details><div class="actions"><a href="/challenges/">Browse challenges</a><a href="https://github.com/Ryan-M-Frank/recreate-it/blob/'+entry.source_commit+'/challenges/'+entry.id+'/player.md">View this version on GitHub</a></div></section>';
  add('/play/'+entry.code,layout({title:entry.title,description:entry.description,path:'/play/'+entry.code,body,css,script:status.status==='available'?interactiveScript(codes):''}),'text/html; charset=utf-8',{status:status.status==='available'?200:410});
}
add('/',home,'text/html; charset=utf-8');
const sitemap='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+['/','/challenges/','/play/',...active.map(x=>'/play/'+x.code)].map(p=>'<url><loc>https://reinventit.org'+e(p)+'</loc></url>').join('')+'</urlset>\n';
add('/sitemap.xml',sitemap,'application/xml; charset=utf-8');
add('/robots.txt','User-agent: *\nAllow: /\n\nSitemap: https://reinventit.org/sitemap.xml\n','text/plain; charset=utf-8');
const bundled='// Generated by build.mjs. Server-side only: contains spoiler-bearing GM files.\nexport default '+JSON.stringify(assets)+';\n';
assert(gzipSync(bundled).length<2500000,'Asset module outgrew the conservative bundle budget; migrate to Workers Static Assets');
write('site/generated-assets.mjs',bundled);
console.log('Built '+entries.length+' permanent run(s), '+active.length+' available, '+Object.keys(assets).length+' public routes; '+gzipSync(bundled).length+' compressed asset bytes.');
