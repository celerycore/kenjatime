/**
 * Build a bounded SFF v1 menu-preview bank from a huge original sprite Blob.
 * Only a prefix through the first group 0/image 0 sprite is copied, preserving
 * preceding palette carriers. The original installed sprite bank is unchanged.
 */
export async function compactSffV1Preview(blob,{maxBytes=16*1024*1024}={}) {
  if (!blob || typeof blob.slice !== 'function' ||
      !Number.isSafeInteger(blob.size) || blob.size<544) return null;
  const maximum=Math.min(maxBytes,blob.size);
  let cap=Math.min(256*1024,maximum);
  while(cap>=544) {
    const prefix=new Uint8Array(await blob.slice(0,cap).arrayBuffer());
    if(prefix.length<544 ||
      String.fromCharCode(...prefix.subarray(0,12))!=='ElecbyteSpr\u0000' ||
      prefix[15]!==1) return null;
    const v=new DataView(prefix.buffer,prefix.byteOffset,prefix.byteLength);
    const count=v.getUint32(20,true);
    if(!count||count>20000)return null;
    let offset=v.getUint32(24,true),more=false;
    const visited=new Set();
    for(let i=0;i<count;i++){
      if(offset<512||offset+32>blob.size||visited.has(offset))return null;
      if(offset+32>prefix.length){more=true;break;}
      visited.add(offset);
      const size=v.getUint32(offset+4,true),end=offset+32+size;
      if(end>blob.size)return null;
      if(end>prefix.length){more=true;break;}
      const group=v.getUint16(offset+12,true),number=v.getUint16(offset+14,true);
      if(group===0&&number===0){
        const compact=prefix.slice(0,end),patch=new DataView(compact.buffer);
        patch.setUint32(20,i+1,true);
        patch.setUint32(offset,0,true);
        return compact;
      }
      offset=v.getUint32(offset,true);
      if(!offset)return null;
    }
    if(!more||cap>=maximum)return null;
    cap=Math.min(maximum,cap*2);
  }
  return null;
}
