import {MAX_ARCHIVE_BYTES,ARCHIVE_LIMIT_MB} from './archive-limits.js';
import {archiveKind} from './archive-kind.js';

export const archiveAccept='.zip,.rar,.7z,.tar,.tgz,.tar.gz,.tbz,.tbz2,.tar.bz2,.txz,.tar.xz,.tzst,.tar.zst,.cab,.cpio,.iso,.ar,.xar,application/zip,application/x-zip,application/x-zip-compressed,application/vnd.rar,application/x-rar,application/rar,application/x-rar-compressed,application/x-7z-compressed,application/x-tar,application/gzip,application/x-bzip2,application/x-xz,application/zstd,application/octet-stream';

export async function readArchiveFile(file){
  if(!file)return null;
  if(file.size>MAX_ARCHIVE_BYTES)throw Error(`Archive exceeds the ${ARCHIVE_LIMIT_MB} MB limit.`);
  let buffer;
  try{
    buffer=typeof file.arrayBuffer==='function'?await file.arrayBuffer():await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(reader.error);reader.readAsArrayBuffer(file);});
  }catch{throw Error('The file could not be read. Download the archive to your device in Files, then select it again.');}
  const bytes=new Uint8Array(buffer);
  if(!archiveKind(bytes))throw Error('Choose a ZIP or RAR archive, 7z, TAR, or a compressed TAR archive.');
  return bytes;
}

/** Transfer archive buffers; load RAR decoding only inside the disposable worker. */
export function unpackArchive(bytes,{onProgress=()=>{},password=''}={}){
  return new Promise((resolve,reject)=>{
    let worker;
    try{worker=new Worker(new URL('./archive-worker.js',import.meta.url),{type:'module'});}
    catch{reject(Error('The archive reader could not start. Refresh the page in your browser and try again.'));return;}
    const finish=(error,result)=>{clearTimeout(timer);worker.terminate();if(error)reject(error);else resolve(result);};
    const timer=setTimeout(()=>finish(Error('This archive took too long to read. Try importing the character folder without unrelated files.')),120000);
    worker.onmessage=({data})=>{if(data.progress){onProgress(data.progress);return;}finish(data.error?Error(data.error):null,data.result);};
    worker.onerror=()=>finish(Error('The archive reader stopped. Close other browser tabs and try again, or import a smaller character package.'));
    worker.onmessageerror=()=>finish(Error('The browser could not receive the character package. Try again with fewer files.'));
    try{worker.postMessage({bytes,password},[bytes.buffer]);}catch(error){finish(error);}
  });
}

// Preserve the existing JS API names for callers upgrading from ZIP-only builds.
export const zipAccept=archiveAccept,readZipFile=readArchiveFile,unpackZip=unpackArchive;
