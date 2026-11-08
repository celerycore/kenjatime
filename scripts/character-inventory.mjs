import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {packageFiles,charactersFromFiles,decodeText} from '../src/formats.js';
import {archiveKind} from '../src/archive-kind.js';
import {unpackRar} from '../src/rar-reader.js';

const sha=b=>createHash('sha256').update(b).digest('hex');
function sections(text){
 const result=[];let current;
 for(const [index,raw] of text.split(/\r?\n/).entries()){
  const line=raw.replace(/;(?=(?:[^"']*["'][^"']*["'])*[^"']*$).*$/,'').trim(),m=line.match(/^\[([^\]]+)\]$/);
  if(m){current={header:m[1],line:index+1,params:[]};result.push(current);}
  else if(current&&line.includes('=')){const at=line.indexOf('=');current.params.push([line.slice(0,at).trim().toLowerCase(),line.slice(at+1).trim()]);}
 }
 return result;
}
export function inventoryFiles(files){
 return charactersFromFiles(files).map(character=>{
  const references=[...new Set(character.checks.filter(c=>c.ok&&/^(cmd|cns|st\d*)$/.test(c.key)).map(c=>c.path))];
  const scripts=[],stateNumbers=new Set(),bindings=[],moves=[],controllers={};let hasGlobal2=false;
  for(const path of references){
   const text=decodeText(files[path]);scripts.push({path,sha256:sha(files[path]),language:path.endsWith('.zss')?'zss':'cns'});
   if(path.endsWith('.zss')){
    for(const match of text.matchAll(/\[statedef\s+(-?\d+)/gi))stateNumbers.add(Number(match[1]));
    continue;
   }
   let state=null;
   for(const section of sections(text)){
    const p=Object.fromEntries(section.params),m=section.header.match(/^statedef\s+(-?\d+)/i);
    if(m){state=Number(m[1]);stateNumbers.add(state);hasGlobal2||=state===-2;}
    if(section.header.toLowerCase()==='command'&&p.name&&p.command)bindings.push({name:p.name.replace(/^"|"$/g,''),command:p.command,path,line:section.line});
    if(p.type){const type=p.type.toLowerCase();controllers[type]=(controllers[type]||0)+1;
     if(type==='changestate'&&(state===-1||/^state\s+-1\b/i.test(section.header))){
      moves.push({path,line:section.line,label:section.header,target:/^\d+$/.test(p.value||'')?Number(p.value):null,expression:p.value||'',commands:[...new Set(section.params.filter(([k])=>k.startsWith('trigger')).flatMap(([,v])=>[...v.matchAll(/\bcommand\s*=\s*"([^"]+)"/gi)].map(m=>m[1])))]});
     }
    }
   }
  }
  return{path:character.path,name:character.def.info?.displayname||character.def.info?.name,scripts,commandBindings:bindings.length,moveEntries:moves.length,positiveStates:[...stateNumbers].filter(n=>n>=0).length,negativeStates:[...stateNumbers].filter(n=>n<0).sort((a,b)=>a-b),controllers,
   helperControllers:controllers.helper||0,projectileControllers:controllers.projectile||0,paletteControllers:(controllers.palfx||0)+(controllers.remappal||0)+(controllers.allpalfx||0),declaredActPalettes:character.palettes.length,embeddedPaletteVerification:'requires-SFF-decode-and-native-capture',
   missingResources:character.checks.filter(c=>!c.ok).map(c=>({key:c.key,path:c.path})),requiresGlobalStateAdapter:hasGlobal2,bindings,moves,nativeMovesetVerification:'pending-curated-inputs-and-native-capture',completeCompatibility:false};
 });
}
export async function inventoryArchive(path){
 const bytes=new Uint8Array(readFileSync(path)),kind=archiveKind(bytes);
 const files=kind==='rar'?await unpackRar(bytes,{wasmBinary:readFileSync(new URL('../node_modules/node-unrar-js/dist/js/unrar.wasm',import.meta.url))}):kind==='zip'?packageFiles(bytes):null;
 if(!files)throw Error('Inventory accepts ZIP/RAR character archives; it never executes their files.');
 return{archiveSha256:sha(bytes),format:kind,compressedBytes:bytes.length,files:Object.keys(files).length,characters:inventoryFiles(files),runtimeExecution:false};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const archives=[];let output=resolve('work/character-verification/corpus-inventory.json');
  for(let i=2;i<process.argv.length;i+=2){if(process.argv[i]==='--archive'&&process.argv[i+1])archives.push(process.argv[i+1]);else if(process.argv[i]==='--output'&&process.argv[i+1])output=resolve(process.argv[i+1]);else throw Error('Use --archive FILE [--archive FILE] [--output JSON].');}
  if(!archives.length)throw Error('Select at least one archive.');
  const report={format:'kenjatime-character-inventory-v1',completeCompatibility:false,archives:[]};
  for(const path of archives)report.archives.push(await inventoryArchive(path));
  mkdirSync(dirname(output),{recursive:true});writeFileSync(output,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({output,archives:report.archives.length,characters:report.archives.reduce((n,a)=>n+a.characters.length,0)}));
 }catch(error){console.error(error.message);process.exitCode=2;}
}
