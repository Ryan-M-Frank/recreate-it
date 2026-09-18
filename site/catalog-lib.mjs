import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const codePattern=/^RI-[0-9]{4}@(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$/;
export function normalizeCode(input) {
  if(typeof input!=='string'||input.length>64)return null;
  const code=input.trim().replace(/^ri-/i,'RI-');
  return codePattern.test(code)?code:null;
}
export function resolveCode(runs,input) {
  const code=normalizeCode(input);
  return code&&Object.hasOwn(runs,code)?runs[code]:null;
}
export function availableEntries(entries,statuses,mode='solo') {
  return entries.filter(e=>['active','archived'].includes(e.status)&&e.modes.includes(mode)&&statuses.runs[e.code]?.status==='available'&&(mode!=='weekly'||e.status==='active'));
}
export function sha256(bytes) { return createHash('sha256').update(bytes).digest('hex'); }
export function readRelease(root,entry) {
  assert(codePattern.test(entry.code)&&entry.code===entry.id+'@'+entry.version,'Invalid run code');
  assert(/^[a-f0-9]{40}$/.test(entry.source_commit),'Invalid source commit');
  assert.equal(entry.packet_path,'challenges/'+entry.id);
  assert(['active','archived'].includes(entry.status),'Draft or invalid status cannot be published');
  // The first discovery implementation deliberately releases solo runs only.
  assert.deepEqual(entry.modes,['solo'],'Weekly intake/schedule is not implemented here');
  assert([null,'introductory','intermediate','advanced'].includes(entry.difficulty));
  assert(entry.duration_minutes===null||(Number.isInteger(entry.duration_minutes)&&entry.duration_minutes>0));
  for(const k of ['title','description','area','measurement_note']) assert(typeof entry[k]==='string'&&entry[k].length>0,k);
  const run=JSON.parse(fs.readFileSync(path.join(root,'runs',entry.code+'.json'),'utf8'));
  for(const [k,v] of Object.entries({schema_version:1,code:entry.code,challenge_id:entry.id,challenge_version:entry.version,protocol_version:entry.protocol_version,source_commit:entry.source_commit,mode:'solo',status_at_release:entry.status,status_url:'https://reinventit.org/catalog/status.json'})) assert.equal(run[k],v,'Run record mismatch: '+k);
  const files=new Map();
  const allowedSupport=new Set(['GAME.md','GM_PROTOCOL.md','SECURITY.md','HISTORY_TEMPLATE.md','SUBMISSION_TEMPLATE.md','NOVELTY_PROTOCOL.md','LICENSE','LICENSE-CODE','LICENSE-CONTENT','docs/weekly-challenges.md','site/README.md']);
  for(const file of run.files) {
    assert(allowedSupport.has(file.path)||['player.md','gm.md','manifest.yaml'].some(n=>file.path===entry.packet_path+'/'+n),'Unapproved release path: '+file.path);
    assert(!files.has(file.path),'Duplicate file');
    const bytes=fs.readFileSync(path.join(root,'releases',run.source_commit,file.path));
    assert.equal(sha256(bytes),file.sha256,'Immutable snapshot changed: '+file.path);
    assert.equal(createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex'),file.source_blob,'Original Git blob mismatch');
    assert.equal(file.source_url,'https://raw.githubusercontent.com/Ryan-M-Frank/recreate-it/'+run.source_commit+'/'+file.path);
    assert.equal(file.mirror_url,'https://reinventit.org/releases/'+run.source_commit+'/'+file.path);
    assert.equal(file.contains_spoilers,file.path===entry.packet_path+'/gm.md');
    files.set(file.path,{...file,body:bytes.toString('utf8')});
  }
  for(const p of ['GAME.md','GM_PROTOCOL.md','SECURITY.md','HISTORY_TEMPLATE.md','SUBMISSION_TEMPLATE.md','NOVELTY_PROTOCOL.md','docs/weekly-challenges.md','LICENSE','LICENSE-CODE','LICENSE-CONTENT',...['player.md','gm.md','manifest.yaml'].map(f=>entry.packet_path+'/'+f)])assert(files.has(p),'Missing required release file: '+p);
  const manifest=files.get(entry.packet_path+'/manifest.yaml').body;
  const value=key=>manifest.match(new RegExp('^'+key+':\\s*"?([^"\\r\\n]+)"?\\s*$','m'))?.[1].trim();
  for(const [k,v]of Object.entries({id:entry.id,version:entry.version,protocol_version:entry.protocol_version,status:entry.status,type:'solo',player_file:'player.md',gm_file:'gm.md'}))assert.equal(value(k),v,'Packet manifest disagreement: '+k);
  return {run,files};
}
