import {archiveKind} from './archive-kind.js';
import {packageFiles} from './formats.js';

export async function unpackArchiveBytes(bytes,{loadWasm,onProgress=()=>{}}={}){
  const kind=archiveKind(bytes);
  if(kind==='zip')return packageFiles(bytes);
  if(kind!=='rar')throw Error('Choose a ZIP or RAR archive. Other formats cannot be imported.');
  onProgress('Loading RAR decoder…');
  const [{unpackRar},wasmBinary]=await Promise.all([import('./rar-reader.js'),loadWasm?.()]);
  return unpackRar(bytes,{wasmBinary,onProgress});
}
