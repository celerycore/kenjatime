import {archiveKind} from './archive-kind.js';
import {packageFiles} from './formats.js';

export async function unpackArchiveBytes(bytes,{loadWasm,loadMultiWasm,password='',onProgress=()=>{}}={}){
  const kind=archiveKind(bytes);
  const general=async()=>{
    onProgress('Loading archive decoder…');
    const [{unpackMultiArchive},wasmBinary]=await Promise.all([import('./multi-archive.js'),loadMultiWasm?.()]);
    return unpackMultiArchive(bytes,{wasmBinary,password,onProgress});
  };
  if(kind==='zip'&&!password&&!(bytes[6]&1)){
    try{return packageFiles(bytes);}catch(error){
      if(/exceeds|unsafe|duplicate/i.test(error.message))throw error;
      try{return await general();}catch{
        try{const {unpackLzmaZip}=await import('./zip-lzma.js');return unpackLzmaZip(bytes);}catch{throw error;}
      }
    }
  }
  if(!kind)throw Error('Choose a ZIP or RAR archive, 7z, TAR, or a compressed TAR archive.');
  if(kind!=='rar'){
    return general();
  }
  onProgress('Loading RAR decoder…');
  const [{unpackRar},wasmBinary]=await Promise.all([import('./rar-reader.js'),loadWasm?.()]);
  try{return await unpackRar(bytes,{wasmBinary,password,onProgress});}catch(error){
    if(!/ERAR_UNKNOWN_FORMAT/.test(error.message))throw error;
    try{return await general();}catch{throw error;}
  }
}
