// Independently generated archives for the real uploader integration checks.
import SevenZip from '7z-wasm';
import {unzipSync} from 'fflate';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {rar4Volumes} from '../test/fixtures/rar-fixtures.js';
const dir=new URL('../work/support-archives/',import.meta.url);mkdirSync(dir,{recursive:true});
const files=unzipSync(readFileSync(new URL('../test/fixtures/multi-archive/fighter.zip',import.meta.url))),cases=[];
files['padding.bin']=Uint8Array.from({length:8192},(_,i)=>(i*73+(i>>>4)*37)&255);
for(const [type,options,label] of [['zip',['-mem=AES128'],'zip-aes128'],['zip',['-mem=AES192'],'zip-aes192'],['zip',['-mem=AES256'],'zip-aes256'],['7z',['-mhe=on','-v1k'],'split-7z'],['zip',['-mem=AES256','-v1k'],'split-zip']]){
 const z=await SevenZip({print:()=>{},printErr:()=>{}});for(const [path,bytes] of Object.entries(files)){const parent=path.split('/').slice(0,-1).join('/');if(parent)z.FS.mkdirTree(parent);z.FS.writeFile(path,bytes);}
 const filename=label+'.'+type;const code=z.callMain(['a','-t'+type,'-mx=0','-psecret','-bd','-bsp0',...options,filename,...Object.keys(files)]);if(code)throw Error('Archive creation failed: '+code);
 const parts=z.FS.readdir('/').filter(n=>n.startsWith(filename)).sort();for(const part of parts)writeFileSync(new URL(part,dir),z.FS.readFile(part));cases.push({label,password:'secret',parts});
}
const parts=rar4Volumes(Object.entries(files));for(const p of parts){p.name=p.name.replace(/^archive/,'split-rar');writeFileSync(new URL(p.name,dir),p.bytes);}cases.push({label:'split-rar',password:'',parts:parts.map(p=>p.name)});
writeFileSync(new URL('manifest.json',dir),JSON.stringify(cases,null,2)+'\n');console.log('Generated',cases.length,'archive imports');
