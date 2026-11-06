import {libarchiveWasm} from 'libarchive-wasm';
import {Decompress} from 'fzstd';
import {archiveKind} from './archive-kind.js';
import {normalizedPackageFiles,packageEntryPath} from './formats.js';
import {MAX_ARCHIVE_BYTES,MAX_EXPANDED_BYTES,MAX_ARCHIVE_FILES} from './archive-limits.js';

/** Runs inside the disposable archive worker. Reads fixed-size blocks before
 * accepting data; archive header sizes alone never authorize an allocation. */
export async function unpackMultiArchive(bytes,{wasmBinary,password='',onProgress=()=>{}}={}){
 if(bytes.byteLength>MAX_ARCHIVE_BYTES)throw Error('Archive exceeds the 128 MB limit.');
 if(archiveKind(bytes)==='zstd'){
  let size=0;const chunks=[],decoder=new Decompress(chunk=>{size+=chunk.length;if(size>MAX_EXPANDED_BYTES)throw Error('Archive exceeds 512 MB expanded.');chunks.push(chunk);});
  decoder.push(bytes,true);bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
 }
 const lib=await libarchiveWasm({wasmBinary}),m=lib.module,archive=lib.read_new(),input=m._malloc(bytes.length),block=m._malloc(65536),files=[];
 let total=0,count=0;
 try{
  m.HEAP8.set(bytes,input);lib.read_support_filter_all(archive);lib.read_support_format_all(archive);
  if(password)lib.read_add_passphrase(archive,password);
  lib.read_open_memory(archive,input,bytes.length);
  for(;;){
   const entry=lib.read_next_entry(archive);
   if(!entry){const error=lib.error_string(archive);if(error)throw Error(error);break;}
   if(++count>MAX_ARCHIVE_FILES)throw Error('Archive exceeds 5,000 files.');
   const name=lib.entry_pathname(entry),type=lib.entry_filetype(entry),size=lib.entry_size(entry);
   if(type===16384){lib.read_data_skip(archive);continue;}
   if(type!==32768||lib.entry_symlink(entry)||lib.entry_hardlink(entry))throw Error('Archive links and special files are not supported.');
   if(!Number.isSafeInteger(size)||size<0||size>MAX_EXPANDED_BYTES-total)throw Error('Archive exceeds 512 MB expanded.');
   const path=packageEntryPath(name);
   if(lib.entry_is_encrypted(entry)&&!password)throw Error('This archive needs a password. Use the archive password field and import it again.');
   const chunks=[];let actual=0;
   for(;;){const n=lib.read_data(archive,block,65536);if(!n)break;actual+=n;total+=n;if(total>MAX_EXPANDED_BYTES)throw Error('Archive exceeds 512 MB expanded.');if(path)chunks.push(new Uint8Array(m.HEAP8.buffer,block,n).slice());}
   if(actual!==size)throw Error('The archive is truncated or an entry has an invalid size.');
   if(!path)continue;
   const data=new Uint8Array(actual);let offset=0;for(const chunk of chunks){data.set(chunk,offset);offset+=chunk.length;}files.push([name,data]);
   if(count%24===0)onProgress(`Extracting archive (${count} files)…`);
  }
  return normalizedPackageFiles(files);
 }catch(error){throw Error(`Archive could not be extracted: ${error.message||error}`);}
 finally{try{lib.read_free(archive);}catch{}m._free(input);m._free(block);}
}
