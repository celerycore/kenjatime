export function archiveKind(bytes){
  if(bytes?.[0]===0x50&&bytes[1]===0x4b&&[[3,4],[5,6],[7,8]].some(([a,b])=>bytes[2]===a&&bytes[3]===b))return 'zip';
  if(bytes?.length>=7&&[0x52,0x61,0x72,0x21,0x1a,0x07].every((value,i)=>bytes[i]===value)){
    if(bytes[6]===0)return 'rar';
    if(bytes[6]===1&&bytes.length>=8&&bytes[7]===0)return 'rar';
  }
  return null;
}
