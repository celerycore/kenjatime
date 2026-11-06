import {unzipSync,strFromU8} from 'fflate';
import codec from 'lzma/src/lzma-d.js';
import {normalizedPackageFiles,packageEntryPath} from './formats.js';
import {MAX_ARCHIVE_FILES,MAX_EXPANDED_BYTES} from './archive-limits.js';

const crcTable=Uint32Array.from({length:256},(_,v)=>{for(let i=0;i<8;i++)v=v&1?0xedb88320^(v>>>1):v>>>1;return v;});
function crc(bytes){let v=0xffffffff;for(const b of bytes)v=crcTable[(v^b)&255]^(v>>>8);return (v^0xffffffff)>>>0;}

/** Some WinRAR/Python ZIPs use method 14, which the compact WASM liblzma build
 * cannot decode. Decode that method locally, with ZIP sizes, dictionary bounds
 * and CRC verification; all other methods stay with the existing ZIP decoder. */
export function unpackLzmaZip(bytes){
 const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),u32=p=>view.getUint32(p,true),u16=p=>view.getUint16(p,true);
 let end=bytes.length-22;for(;end>=Math.max(0,bytes.length-65557);end--)if(u32(end)===0x06054b50&&end+22+u16(end+20)===bytes.length)break;
 if(end<Math.max(0,bytes.length-65557))throw Error('Invalid ZIP directory.');
 const count=u16(end+10),size=u32(end+12);if(count>MAX_ARCHIVE_FILES||size>bytes.length)throw Error('Archive exceeds 5,000 files or has an invalid directory.');
 let offset=end-size,total=0;const entries=[],plain=unzipSync(bytes,{filter:file=>{
  total+=file.originalSize;if(total>MAX_EXPANDED_BYTES)throw Error('Archive exceeds 512 MB expanded.');return file.compression!==14;
 }});entries.push(...Object.entries(plain));let decoded=0;
 for(let i=0;i<count;i++){
  if(offset<0||offset+46>bytes.length||u32(offset)!==0x02014b50)throw Error('Invalid ZIP directory.');
  const method=u16(offset+10),flags=u16(offset+8),nameLength=u16(offset+28),extraLength=u16(offset+30),commentLength=u16(offset+32);
  const name=strFromU8(bytes.subarray(offset+46,offset+46+nameLength));
  let expanded=u32(offset+24),compressed=u32(offset+20),local=u32(offset+42);
  if(method===14){
   if(flags&1)throw Error('Encrypted LZMA ZIP entries are not supported by this decoder.');
   if([expanded,compressed,local].includes(0xffffffff)){
    let extra=offset+46+nameLength,stop=extra+extraLength;
    for(;extra+4<=stop;){const type=u16(extra),length=u16(extra+2);if(type===1){let p=extra+4;const take=()=>{if(p+8>extra+4+length)throw Error('Invalid ZIP64 entry.');const value=Number(view.getBigUint64(p,true));p+=8;if(!Number.isSafeInteger(value))throw Error('Invalid ZIP64 size.');return value;};if(expanded===0xffffffff)expanded=take();if(compressed===0xffffffff)compressed=take();if(local===0xffffffff)local=take();break;}extra+=4+length;}
   }
   if(expanded>MAX_EXPANDED_BYTES||compressed>bytes.length||local+30>bytes.length||u32(local)!==0x04034b50)throw Error('Invalid or oversized LZMA ZIP entry.');
   packageEntryPath(name);
   const start=local+30+u16(local+26)+u16(local+28),stop=start+compressed;if(stop>bytes.length||compressed<9)throw Error('Truncated LZMA ZIP entry.');
   const properties=u16(start+2);if(properties!==5||start+4+properties>stop)throw Error('Unsupported ZIP LZMA properties.');
   const dictionary=u32(start+5);if(dictionary>64*1024*1024)throw Error('ZIP LZMA dictionary exceeds the mobile memory limit.');
   const input=new Uint8Array(13+compressed-9);input.set(bytes.subarray(start+4,start+9));new DataView(input.buffer).setBigUint64(5,BigInt(expanded),true);input.set(bytes.subarray(start+9,stop),13);
   const result=codec.LZMA_WORKER.decompress(input),data=typeof result==='string'?new TextEncoder().encode(result):Uint8Array.from(result);
   if(data.length!==expanded||crc(data)!==u32(offset+16))throw Error('The LZMA ZIP entry failed its size or CRC check.');
   entries.push([name,data]);decoded++;
  }
  offset+=46+nameLength+extraLength+commentLength;
 }
 if(!decoded)throw Error('No ZIP LZMA entries found.');return normalizedPackageFiles(entries);
}
