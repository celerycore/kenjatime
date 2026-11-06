export function archiveKind(bytes){
  if(bytes?.[0]===0x50&&bytes[1]===0x4b&&[[3,4],[5,6],[7,8]].some(([a,b])=>bytes[2]===a&&bytes[3]===b))return 'zip';
  if(bytes?.length>=7&&[0x52,0x61,0x72,0x21,0x1a,0x07].every((value,i)=>bytes[i]===value)){
    if(bytes[6]===0)return 'rar';
    if(bytes[6]===1&&bytes.length>=8&&bytes[7]===0)return 'rar';
  }
  if([0x37,0x7a,0xbc,0xaf,0x27,0x1c].every((v,i)=>bytes?.[i]===v))return '7z';
  if(bytes?.[0]===0x1f&&[0x8b,0x9d].includes(bytes[1]))return 'compressed';
  if([0x42,0x5a,0x68].every((v,i)=>bytes?.[i]===v)||[0xfd,0x37,0x7a,0x58,0x5a,0].every((v,i)=>bytes?.[i]===v))return 'compressed';
  if([0x28,0xb5,0x2f,0xfd].every((v,i)=>bytes?.[i]===v))return 'zstd';
  const ascii=(offset,text)=>[...text].every((c,i)=>bytes?.[offset+i]===c.charCodeAt(0));
  if(ascii(0,'MSCF')||ascii(0,'!<arch>')||ascii(0,'070701')||ascii(0,'070702')||ascii(0,'070707')||ascii(32769,'CD001')||ascii(0,'xar!'))return 'other';
  if(ascii(0,'MZ'))for(let offset=2;offset<Math.min(bytes.length-8,1024*1024);offset++)if(ascii(offset,'PK\x03\x04')||ascii(offset,'Rar!\x1a\x07'))return 'self-extracting';
  if(bytes?.length>=512){
    const raw=String.fromCharCode(...bytes.subarray(148,156)).replace(/\0/g,'').trim();
    const checksum=/^[0-7]+$/.test(raw)?parseInt(raw,8):-1;
    let sum=0;for(let i=0;i<512;i++)sum+=i>=148&&i<156?32:bytes[i];
    if(checksum>=0&&sum===checksum)return 'tar';
  }
  return null;
}
