import {zipSync,strToU8} from 'fflate';
import {MAX_ARCHIVE_BYTES,ARCHIVE_LIMIT_MB} from './archive-limits.js';

export const VOLUME_MANIFEST='kenjatime-volumes.json';
export function archiveVolumePlan(parts){
 if(!parts.length||parts.length>512)throw Error('Select all parts of one archive (up to 512 parts).');
 const names=new Set();let total=0;
 for(const part of parts){
  const name=part.name?.normalize('NFC');
  if(!name||name.length>255||/[\\/\x00-\x1f\x7f]/.test(name)||name==='.'||name==='..')throw Error('Invalid archive part name.');
  if(names.has(name.toLowerCase()))throw Error('Duplicate archive part name.');names.add(name.toLowerCase());
  const size=part.size??part.bytes?.length;if(!Number.isSafeInteger(size)||size<0||(total+=size)>MAX_ARCHIVE_BYTES)throw Error(`Archive parts together exceed the ${ARCHIVE_LIMIT_MB} MiB limit.`);
 }
 const sorted=[...parts].sort((a,b)=>a.name.localeCompare(b.name,'en',{numeric:true}));
 const lower=sorted.map(p=>p.name.normalize('NFC').toLowerCase());let first;
 if(parts.length===1)return{parts:sorted,first:sorted[0].name,total};
 const numbered=lower.map(n=>n.match(/^(.*)\.(\d{3,})$/));
 const rar=lower.map(n=>n.match(/^(.*)\.part(\d+)\.rar$/));
 const legacy=lower.map(n=>n.match(/^(.*)\.(rar|r\d{2,})$/));
 const spanned=lower.map(n=>n.match(/^(.*)\.(zip|z\d{2,})$/));
 function series(matches,base,index,start){
  if(!matches.every(Boolean)||new Set(matches.map(m=>m[base])).size!==1)return false;
  const nums=matches.map(m=>index(m)).sort((a,b)=>a-b);
  if(nums.some((n,i)=>n!==i+start))throw Error('An archive part is missing. Select every volume, starting with the first.');
  first=sorted[matches.findIndex(m=>index(m)===start)].name;return true;
 }
 if(!series(numbered,1,m=>Number(m[2]),1)&&!series(rar,1,m=>Number(m[2]),1)&&!series(legacy,1,m=>m[2]==='rar'?0:Number(m[2].slice(1))+1,0)&&!series(spanned,1,m=>m[2]==='zip'?0:Number(m[2].slice(1)),0))throw Error('Select the parts of one multipart RAR, 7z or ZIP archive together.');
 return{parts:sorted,first,total};
}

// A portable, lossless download: originals remain byte-for-byte intact, and
// our importer recognizes this explicitly labelled bundle on re-import.
export async function bundleArchiveVolumes(parts){
 const plan=archiveVolumePlan(parts),files={},manifest={format:'kenjatime-archive-volumes-v1',parts:[]};
 for(const p of plan.parts){const bytes=p.bytes||new Uint8Array(await p.blob.arrayBuffer());files[p.name]=[bytes,{level:0}];manifest.parts.push(p.name);}
 files[VOLUME_MANIFEST]=strToU8(JSON.stringify(manifest));return zipSync(files,{level:0});
}

export function bundledVolumes(files){
 if(!files[VOLUME_MANIFEST])return null;
 if(files[VOLUME_MANIFEST].length>150000)throw Error('Invalid archive volume manifest.');
 let manifest;try{manifest=JSON.parse(new TextDecoder().decode(files[VOLUME_MANIFEST]));}catch{throw Error('Invalid archive volume manifest.');}
 if(manifest.format!=='kenjatime-archive-volumes-v1')return null;
 if(!Array.isArray(manifest.parts)||manifest.parts.length<2||Object.keys(files).length!==manifest.parts.length+1)throw Error('Incomplete archive volume bundle.');
 const parts=manifest.parts.map(name=>({name,bytes:typeof name==='string'?files[name.normalize('NFC').toLowerCase()]:null}));if(parts.some(p=>!(p.bytes instanceof Uint8Array)))throw Error('An archive part is missing from the bundle.');
 archiveVolumePlan(parts);return parts;
}
