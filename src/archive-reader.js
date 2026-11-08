import {archiveKind} from './archive-kind.js';
import {packageFiles} from './formats.js';
import {bundledVolumes} from './archive-volumes.js';

export async function unpackArchiveBytes(bytes,{loadWasm,loadMultiWasm,loadSevenWasm,password='',onProgress=()=>{},filename}={}){
  const kind=archiveKind(bytes);
  const seven=async parts=>{onProgress('Loading encrypted/multipart archive decoder…');const [{unpackSevenArchive},wasmBinary]=await Promise.all([import('./seven-archive.js'),loadSevenWasm?.()]);return unpackSevenArchive(parts,{wasmBinary,password,onProgress});};
  const finish=async files=>{const parts=bundledVolumes(files);return parts?seven(parts):files;};
  const general=async()=>{
    onProgress('Loading archive decoder…');
    const [{unpackMultiArchive},wasmBinary]=await Promise.all([import('./multi-archive.js'),loadMultiWasm?.()]);
    return finish(await unpackMultiArchive(bytes,{wasmBinary,password,onProgress}));
  };
  if(kind==='zip'&&(password||bytes[6]&1)){
    try{const {unpackEncryptedZip}=await import('./zip-encrypted.js');return await finish(await unpackEncryptedZip(bytes,{password,onProgress}));}
    catch(error){if(!/Unsupported ZIP compression/.test(error.message))throw error;}
  }
  if(kind==='zip'&&!password&&!(bytes[6]&1)){
    try{const files=packageFiles(bytes),parts=bundledVolumes(files);return parts?await seven(parts):files;}catch(error){
      if(/exceeds|unsafe|duplicate/i.test(error.message))throw error;
      try{return await general();}catch{
        try{const {unpackLzmaZip}=await import('./zip-lzma.js');return unpackLzmaZip(bytes);}catch{throw error;}
      }
    }
  }
  if(!kind)throw Error('Choose a ZIP or RAR archive, 7z, TAR, or a compressed TAR archive.');
  if(kind!=='rar'){
    try{return await general();}catch(error){
      if(!['zip','7z'].includes(kind)||/exceeds|unsafe|duplicate|links|special files/i.test(error.message))throw error;
      return seven([{name:filename||'archive.'+kind,bytes}]);
    }
  }
  onProgress('Loading RAR decoder…');
  const [{unpackRar},wasmBinary]=await Promise.all([import('./rar-reader.js'),loadWasm?.()]);
  try{return await unpackRar(bytes,{wasmBinary,password,onProgress});}catch(error){
    if(/Multi-part/.test(error.message))return seven([{name:filename||'archive.rar',bytes}]);
    if(!/ERAR_UNKNOWN_FORMAT/.test(error.message))throw error;
    try{return await general();}catch{throw error;}
  }
}
