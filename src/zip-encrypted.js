import {ZipReader,Uint8ArrayReader,configure} from '@zip.js/zip.js/lib/zip-core-custom.js';
import {Inflate} from 'fflate';
import {normalizedPackageFiles,packageEntryPath} from './formats.js';
import {MAX_ARCHIVE_BYTES,MAX_EXPANDED_BYTES,MAX_ARCHIVE_FILES} from './archive-limits.js';

// Reuse the already bundled raw-deflate decoder. No nested workers, codec
// downloads or browser-specific DecompressionStream support are required.
class RawInflateStream extends TransformStream{
 constructor(format){
  if(format!=='deflate-raw')throw Error('Unsupported ZIP compression method.');let decoder;
  super({start(controller){decoder=new Inflate(chunk=>{if(chunk.length)controller.enqueue(chunk);});},transform(chunk){decoder.push(chunk);},flush(){decoder.push(new Uint8Array(),true);}});
 }
}
configure({useWebWorkers:false,useCompressionStream:false,DecompressionStreamFallback:RawInflateStream,chunkSize:8192});

export async function unpackEncryptedZip(bytes,{password='',onProgress=()=>{}}={}){
 if(bytes.length>MAX_ARCHIVE_BYTES)throw Error('Archive exceeds the 128 MB limit.');
 const reader=new ZipReader(new Uint8ArrayReader(bytes),{password,useWebWorkers:false,useCompressionStream:false,checkSignature:true});
 let count=0,declared=0,total=0,activeEncrypted=false;const files=[];
 try{
  for await(const entry of reader.getEntriesGenerator()){
   if(++count>MAX_ARCHIVE_FILES)throw Error('Archive exceeds 5,000 files.');
   const size=entry.uncompressedSize;if(!Number.isSafeInteger(size)||size<0||(declared+=size)>MAX_EXPANDED_BYTES)throw Error('Archive exceeds 512 MB expanded.');
   const mode=(entry.unixMode||0)&0o170000;if(entry.symlink||(mode&&mode!==0o100000&&mode!==0o040000))throw Error('Archive links and special files are not supported.');
   const path=packageEntryPath(entry.filename);if(entry.directory)continue;
   if(entry.encrypted&&!password)throw Error('This ZIP archive needs a password. Enter it and try again.');
   if(![0,8].includes(entry.compressionMethod))throw Error('Unsupported ZIP compression method.');
   let actual=0;const chunks=[];
   activeEncrypted=!!entry.encrypted;
   await entry.getData({writable:new WritableStream({write(chunk){actual+=chunk.length;total+=chunk.length;if(total>MAX_EXPANDED_BYTES||actual>size)throw Error('Archive exceeds its declared size or 512 MB expanded.');if(path)chunks.push(chunk.slice());}})},{password,checkSignature:true,useWebWorkers:false,useCompressionStream:false});
   activeEncrypted=false;
   if(actual!==size)throw Error('The ZIP archive is truncated or has an invalid size.');
   if(path){const data=new Uint8Array(actual);let at=0;for(const chunk of chunks){data.set(chunk,at);at+=chunk.length;}files.push([entry.filename,data]);}
   if(count%24===0)onProgress(`Decrypting ZIP (${count} entries)…`);
  }
  return normalizedPackageFiles(files);
 }catch(error){if(/password|authentication|signature|decrypt/i.test(error.message)||activeEncrypted&&/\bcrc(?:32)?\b/i.test(error.message))throw Error('The ZIP password is incorrect or its encrypted data is damaged.');throw error;}
 finally{await reader.close();}
}
