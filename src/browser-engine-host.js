import {unzipSync} from 'fflate';
import {charactersFromFiles} from './formats.js';
import {stageDefinitions} from './stages.js';
import {readArchiveFile,unpackArchive} from './uploads.js';
import {ArchiveLibrary} from './mobile-library.js';
import {openGoBattle} from './go-battle.js';

const legacy=new ArchiveLibrary();
const base=new URL('../',import.meta.url);let corePromise,dbPromise;
const request=r=>new Promise((resolve,reject)=>{r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
function open(){return dbPromise??=new Promise((resolve,reject)=>{const r=indexedDB.open('kenjatime.engine.library',1);r.onupgradeneeded=()=>{r.result.createObjectStore('packages',{keyPath:'id'});r.result.createObjectStore('files',{keyPath:'path'}).createIndex('packageId','packageId');};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.onblocked=()=>reject(Error('Close other Kenjatime windows and try again.'));});}
function done(tx){return new Promise((resolve,reject)=>{tx.oncomplete=resolve;tx.onabort=tx.onerror=()=>reject(tx.error||Error('The library could not be saved.'));});}
async function core(){return corePromise??=fetch(new URL('engine/core.zip',base)).then(async r=>{if(!r.ok)throw Error('The included game resources could not load.');return unzipSync(new Uint8Array(await r.arrayBuffer()));}).catch(e=>{corePromise=null;throw e;});}
function entries(files,prefix='',packageId=null,packageName='Included sample'){
 const characters=charactersFromFiles(files).map(c=>{const anim=c.checks.find(x=>x.key==='anim'&&x.ok)?.path;return{id:prefix+c.path,name:c.def.info?.displayname||c.def.info?.name||c.path,author:c.def.info?.author||'',fileName:c.path.split('/').at(-1),packageName,...(packageId?{packageId}:{}),...(c.sprite?.ok?{sprite:prefix+c.sprite.path,spriteBytes:files[c.sprite.path].length}:{}),...(anim?{anim:prefix+anim}:{})};});
 const stages=stageDefinitions(files).map(s=>({id:prefix+s.path,name:s.name,author:s.author||'',fileName:s.path.split('/').at(-1),packageName,...(packageId?{packageId}:{})}));return{characters,stages};
}
async function packages(){const db=await open();return request(db.transaction('packages').objectStore('packages').getAll());}
async function catalog(){const builtin=entries(await core()),saved=await packages(),old=(await legacy.list().catch(()=>[])).filter(row=>!saved.some(p=>p.legacyId===row.id));return{characters:[...builtin.characters,...saved.flatMap(p=>p.characters)],stages:[...builtin.stages,...saved.flatMap(p=>p.stages)],packages:[...saved.map(p=>({id:p.id,name:p.name})),...old.map(p=>({id:'legacy:'+p.id,name:p.name,legacy:true}))]};}
async function pickFile(){return new Promise(resolve=>{const input=document.createElement('input');input.type='file';input.accept='*/*';input.hidden=true;input.id='engine-archive-file';input.onchange=()=>{const file=input.files?.[0];input.remove();resolve(file);};input.oncancel=()=>{input.remove();resolve(null);};document.body.append(input);input.click();});}
async function resource(path){const builtin=await core();if(builtin[path])return new Blob([builtin[path]]);const db=await open(),row=await request(db.transaction('files').objectStore('files').get(path));if(!row)throw Error('The installed resource is missing.');return row.blob;}
async function install(file,data,legacyId){
 window.__kenjatimeNativeProgress?.(`Reading ${file.name}…`);
   const {files,characters,stages}=await unpackArchive(await readArchiveFile(file),{password:data.password,prepareStageData:false,onProgress:m=>window.__kenjatimeNativeProgress?.(m)});
   if(data.kind==='stage'&&!stages.length)throw Error('No stage DEF found. Choose a stage archive.');if(!characters.length&&!stages.length)throw Error('No character or stage DEF found.');
   const id=crypto.randomUUID(),prefix=`imports/${id}/`,meta={id,name:file.name,...(legacyId?{legacyId}:{}),...entries(files,prefix,id,file.name)};
   const db=await open(),tx=db.transaction(['packages','files'],'readwrite'),finished=done(tx);tx.objectStore('packages').put(meta);
   for(const [path,bytes]of Object.entries(files))tx.objectStore('files').put({path:prefix+path,packageId:id,blob:new Blob([bytes])});await finished;return catalog();
}
export function createBrowserEngineHost(){return{
 resource,importFile:(file,data={})=>install(file,data),
 async request(action,data={}){
  if(action==='catalog')return catalog();
  if(action==='pickArchive'){
   const file=await pickFile();if(!file)return{cancelled:true};return install(file,data);
  }
  if(action==='openLegacy'){const saved=await legacy.read(data.id.slice(7));return install(saved.file,{...data,kind:saved.stageOnly?'stage':'any'},saved.id);}
  if(action==='remove'){
   if(data.packageId.startsWith('legacy:')){await legacy.remove(data.packageId.slice(7));return catalog();}
   if(!/^[a-f0-9-]{36}$/.test(data.packageId))throw Error('Unknown installed package.');
   const db=await open(),tx=db.transaction(['packages','files'],'readwrite'),finished=done(tx);tx.objectStore('packages').delete(data.packageId);
   const r=tx.objectStore('files').index('packageId').openCursor(IDBKeyRange.only(data.packageId));r.onsuccess=()=>{const c=r.result;if(c){c.delete();c.continue();}};await finished;return catalog();
  }
  if(action==='launch'){
   const list=await catalog(),p1=list.characters.find(c=>c.id===data.character),p2=list.characters.find(c=>c.id===data.opponent),stage=list.stages.find(s=>s.id===data.stage);
   if(!p1||!p2||!stage)throw Error('Select installed fighters and a stage.');if(!['solo','versus','cpu','training'].includes(data.mode))throw Error('Unknown play mode.');
   const files=Object.fromEntries(Object.entries(await core()).map(([p,b])=>[p,b.slice()])),ids=[...new Set([p1.packageId,p2.packageId,stage.packageId].filter(Boolean))],db=await open();
   for(const id of ids){const rows=await request(db.transaction('files').objectStore('files').index('packageId').getAll(id));for(const row of rows)files[row.path]=new Uint8Array(await row.blob.arrayBuffer());}
   const level=Math.max(1,Math.min(8,data.level||4)),pal=n=>String(Math.max(1,Math.min(12,n||1)));
   const args=['-config','data/kenjatime/config.ini','-p1',p1.id,'-p2',p2.id,'-s',stage.id,'-p1.ai',data.mode==='cpu'?String(level):'0','-p2.ai',['solo','cpu'].includes(data.mode)?String(level):'0','-p1.color',pal(data.palette),'-p2.color',pal(data.opponentPalette),'-kenjatime-mode',data.mode,'-rounds',data.mode==='training'?'9999':'2','-time',data.mode==='training'?'-1':'99'];
   // Go gets its own transferable copy of package bytes; the preview/library stays intact.
   await openGoBattle({files,args,onProgress:m=>window.__kenjatimeNativeProgress?.(m)});return{launching:true};
  }
  if(action==='credits'){window.open(new URL('engine/LICENSE.txt',base),'_blank','noopener');return{};}
  throw Error('Unknown app action.');
 }
};}
