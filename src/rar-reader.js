import {createExtractorFromData} from 'node-unrar-js';
import {normalizedPackageFiles,packageEntryPath} from './formats.js';
import {MAX_ARCHIVE_BYTES,MAX_EXPANDED_BYTES,MAX_ARCHIVE_FILES,ARCHIVE_LIMIT_MB} from './archive-limits.js';

// The decoder uses a shared WASM callback target. Serialize calls in Node/API
// usage; browser imports each run in their own disposable worker.
let queue=Promise.resolve();
export function unpackRar(bytes,options={}){
  const result=queue.then(()=>extractRar(bytes,options));queue=result.catch(()=>{});return result;
}

function rarError(error){
  if(['ERAR_MISSING_PASSWORD','ERAR_BAD_PASSWORD'].includes(error.reason))return Error('Password-protected RAR files are not supported. Extract the character and create an unencrypted ZIP or RAR.');
  if(error.reason==='ERAR_NO_MEMORY')return Error('The RAR decoder ran out of memory. Close other tabs or use a smaller character archive.');
  if(error.reason)return Error(`The RAR archive is damaged, incomplete or unsupported (${error.reason})${error.file?`: ${error.file}`:'.'}`);
  return error;
}

function checkInitialHeader(bytes){
  let end;
  if(bytes[6]===0){
    if(bytes.length<14)throw Error('The RAR archive has a damaged or incomplete header.');
    const size=bytes[12]+bytes[13]*256;end=7+size;
    if(size<7)end=Infinity;
  }else{
    let offset=12,size=0,shift=0,done=false;
    while(offset<bytes.length&&shift<=49){const part=bytes[offset++];size+=(part&127)*2**shift;if(!(part&128)){done=true;break;}shift+=7;}
    end=done&&size>=2?offset+size:Infinity;
  }
  if(end>bytes.length)throw Error('The RAR archive has a damaged or incomplete header.');
}

async function extractRar(bytes,{wasmBinary,onProgress=()=>{}}){
  if(bytes.byteLength>MAX_ARCHIVE_BYTES)throw Error(`Archive exceeds the ${ARCHIVE_LIMIT_MB} MB limit.`);
  checkInitialHeader(bytes);
  let extractor;
  try{
    const data=bytes.byteOffset===0&&bytes.byteLength===bytes.buffer.byteLength?bytes.buffer:bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength);
    extractor=await createExtractorFromData({data,wasmBinary});
    const listing=extractor.getFileList();
    if(listing.arcHeader.flags.volume)throw Error('Multi-part RAR archives are not supported. Combine/extract the parts and create one ZIP or RAR file.');
    if(listing.arcHeader.flags.headerEncrypted)throw Object.assign(Error('Encrypted RAR.'),{reason:'ERAR_MISSING_PASSWORD'});
    let count=0,total=0;const names=new Set();
    for(const file of listing.fileHeaders){
      if(++count>MAX_ARCHIVE_FILES||!Number.isSafeInteger(file.unpSize)||file.unpSize<0||(total+=file.unpSize)>MAX_EXPANDED_BYTES)throw Error('Archive exceeds 512 MB expanded or 5,000 files.');
      if(file.flags.encrypted)throw Object.assign(Error('Encrypted RAR.'),{reason:'ERAR_MISSING_PASSWORD'});
      if(!file.flags.directory&&packageEntryPath(file.name))names.add(file.name);
    }
    onProgress(`Extracting RAR (${count} entries)…`);
    const entries=[];let extracted=0,actualBytes=0;
    let currentName;const create=extractor.create;
    extractor.create=function(name){
      const fd=create.call(this,name);
      // The native callback sanitizes separators/dot components, but the JS
      // wrapper retrieves the original header name. Alias the in-memory file.
      if(currentName)this.dataFiles[this.getExtractedFileName(currentName)]=this.dataFiles[this.getExtractedFileName(name)];
      return fd;
    };
    for(const file of extractor.extract({files:header=>{const selected=names.has(header.name)&&!header.flags.directory;if(selected)currentName=header.name;return selected;}}).files){
      const data=file.extraction;if(!(data instanceof Uint8Array))throw Error('The RAR file entry could not be extracted.');
      actualBytes+=data.byteLength;if(actualBytes>MAX_EXPANDED_BYTES||++extracted>MAX_ARCHIVE_FILES)throw Error('Archive exceeds 512 MB expanded or 5,000 files.');
      entries.push([file.fileHeader.name,data]);
      if(extracted%32===0)onProgress(`Extracting RAR (${extracted} files)…`);
    }
    return normalizedPackageFiles(entries);
  }catch(error){throw rarError(error);}
  finally{
    // Early validation failures must also release the lazy native archive.
    if(extractor?._archive)extractor.closeArc();
    if(extractor){if(extractor.unrar.extractor===extractor)extractor.unrar.extractor=null;extractor.dataFiles={};extractor.dataFileMap={};}
  }
}
