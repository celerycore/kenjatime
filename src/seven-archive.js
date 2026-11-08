import SevenZip from '7z-wasm';
import {archiveVolumePlan} from './archive-volumes.js';
import {normalizedPackageFiles,packageEntryPath,packagePath} from './formats.js';
import {MAX_EXPANDED_BYTES,MAX_ARCHIVE_FILES} from './archive-limits.js';

function entriesFromListing(lines){
 const entries=[];let entry={};
 const flush=()=>{if(!Object.keys(entry).length)return;if(typeof entry.Path!=='string'||!/^\d+$/.test(entry.Size||''))throw Error('Invalid archive entry metadata.');entries.push(entry);entry={};};
 for(const line of lines.join('\n').split(/\r?\n/)){
  if(!line){flush();continue;}
  const m=line.match(/^([^=]+?) = (.*)$/);if(!m)throw Error('Invalid archive entry metadata.');
  if(Object.hasOwn(entry,m[1]))throw Error('Ambiguous archive entry metadata.');entry[m[1]]=m[2];
 }
 flush();return entries;
}

/** Full 7-Zip decoding stays in a disposable worker. Passwords are never
 * persisted. Listing and actual writes both enforce the shared import limits. */
export async function unpackSevenArchive(parts,{wasmBinary,password='',onProgress=()=>{}}={}){
 const plan=archiveVolumePlan(parts),lines=[];let logBytes=0;
 const output=s=>{if((logBytes+=s.length)>8*1024*1024)throw Error('Archive metadata exceeds the supported limit.');lines.push(s);};
 const seven=await SevenZip({wasmBinary,noInitialRun:true,print:output,printErr:output,stdin:()=>null});
 const fs=seven.FS;fs.mkdir('/input');fs.mkdir('/output');fs.chdir('/input');
 for(const p of plan.parts)fs.writeFile(p.name.normalize('NFC').toLowerCase(),p.bytes);
 const name=plan.first.normalize('NFC').toLowerCase();
 const run=args=>{lines.length=0;logBytes=0;let code;try{code=seven.callMain(args);}catch(e){if(typeof e==='number')throw Error('The archive could not be decrypted or is damaged. Check its password and every volume.');if(e.status!==undefined)code=e.status;else throw e;}
  if(code!==0){const message=lines.join('\n');if(/password|encrypted|Wrong password|Data Error/i.test(message))throw Error('The archive password is missing or incorrect. Enter it and try again.');if(/volume|Unexpected end|Missing volume/i.test(message))throw Error('An archive volume is missing or damaged. Select every part and try again.');throw Error('Archive extraction failed: '+message.slice(-1000));}
 };
 onProgress('Checking archive volumes and encryption…');
 const secret='-p'+password;
 run(['l','-slt','-ba','-bd','-bsp0','-bse1',secret,'--',name]);
 const listing=entriesFromListing(lines);if(listing.length>MAX_ARCHIVE_FILES)throw Error('Archive exceeds 5,000 files.');
 let declared=0;const expected=new Map();
 for(const e of listing){
  const size=Number(e.Size);if(!Number.isSafeInteger(size)||(declared+=size)>MAX_EXPANDED_BYTES)throw Error('Archive exceeds 512 MB expanded.');
  if(e['Symbolic Link']||e['Hard Link']||/^\s*l/.test(e.Attributes||''))throw Error('Archive links are not supported.');
  const path=packageEntryPath(e.Path),key=packagePath(e.Path.replace(/^[/\\]+/,''),'',true);
  if(e.Folder!=='+'){if(expected.has(key))throw Error('Duplicate archive path: '+key);expected.set(key,{size,path});}
  if(e.Encrypted==='+'&&!password)throw Error('This archive needs a password. Enter it and try again.');
 }
 // Stop a dishonest decoder/header from allocating beyond the declared budget.
 const write=fs.write;let actual=0;const sizes=new Map();
 fs.write=function(stream,buffer,offset,length,position,...rest){
  if(stream.path.startsWith('/output/')){
   const end=(position??stream.position)+length,old=sizes.get(stream.path)||0,extra=Math.max(0,end-old);
   if(actual+extra>MAX_EXPANDED_BYTES)throw Error('Archive exceeds 512 MB expanded.');actual+=extra;sizes.set(stream.path,Math.max(old,end));
  }return write.call(this,stream,buffer,offset,length,position,...rest);
 };
 fs.symlink=()=>{throw Error('Archive links are not supported.');};
 onProgress(`Extracting archive (${listing.length} entries)…`);
 run(['x','-y','-bd','-bsp0','-bse1',secret,'-o/output','--',name]);
 const extracted=[];let count=0;
 function walk(directory){for(const name of fs.readdir(directory)){if(name==='.'||name==='..')continue;const path=directory+'/'+name,stat=fs.lstat(path);if(fs.isDir(stat.mode)){walk(path);continue;}if(!fs.isFile(stat.mode))throw Error('Archive links and special files are not supported.');if(++count>MAX_ARCHIVE_FILES)throw Error('Archive exceeds 5,000 files.');const relative=path.slice(8),key=packagePath(relative),meta=expected.get(key);if(!meta||meta.size!==stat.size)throw Error('Archive entry size or name does not match its header.');expected.delete(key);extracted.push([relative,fs.readFile(path)]);}}
 walk('/output');if(expected.size)throw Error('Archive extraction was incomplete.');
 return normalizedPackageFiles(extracted);
}
