import {MAX_ZIP_BYTES,ZIP_LIMIT_MB} from './archive-limits.js';

export const zipAccept='.zip,application/zip,application/x-zip,application/x-zip-compressed,application/octet-stream';

export async function readZipFile(file){
  if(!file)return null;
  if(file.size>MAX_ZIP_BYTES)throw Error(`ZIP exceeds the ${ZIP_LIMIT_MB} MB limit.`);
  let buffer;
  try{
    buffer=typeof file.arrayBuffer==='function'?await file.arrayBuffer():await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(reader.error);reader.readAsArrayBuffer(file);});
  }catch{throw Error('The file could not be read. Download the ZIP to your device in Files, then select it again.');}
  const bytes=new Uint8Array(buffer);
  if(bytes[0]!==0x50||bytes[1]!==0x4b||![[3,4],[5,6],[7,8]].some(([a,b])=>bytes[2]===a&&bytes[3]===b))throw Error('Choose a ZIP archive. RAR, 7z and other file types cannot be imported.');
  return bytes;
}

/** Transfer the ZIP and unpacked buffers instead of copying large character banks. */
export function unpackZip(bytes,{onProgress=()=>{}}={}){
  return new Promise((resolve,reject)=>{
    let worker;
    try{worker=new Worker(new URL('./archive-worker.js',import.meta.url),{type:'module'});}
    catch{reject(Error('The ZIP reader could not start. Refresh the page in your browser and try again.'));return;}
    const finish=(error,result)=>{clearTimeout(timer);worker.terminate();if(error)reject(error);else resolve(result);};
    const timer=setTimeout(()=>finish(Error('This ZIP took too long to read. Try importing the character folder without unrelated files.')),120000);
    worker.onmessage=({data})=>{if(data.progress){onProgress(data.progress);return;}finish(data.error?Error(data.error):null,data.result);};
    worker.onerror=()=>finish(Error('The ZIP reader stopped. Close other browser tabs and try again, or import a smaller character package.'));
    worker.onmessageerror=()=>finish(Error('The browser could not receive the character package. Try again with fewer files.'));
    try{worker.postMessage(bytes,[bytes.buffer]);}catch(error){finish(error);}
  });
}
