const MiB=1024*1024;
const tag=(bytes,offset,text)=>offset+text.length<=bytes.length&&[...text].every((c,i)=>bytes[offset+i]===c.charCodeAt(0));

/** Header-only asset IO. No voice/channel/pan decisions live in this adapter. */
export function pcmMetadata(bytes){
  if(bytes.length<44||!tag(bytes,0,'RIFF')||!tag(bytes,8,'WAVE'))throw Error('Expected a RIFF/WAVE sample');
  const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),end=view.getUint32(4,true)+8;
  if(end>bytes.length||end<12)throw Error('Truncated WAVE container');
  let format=null,data=null;
  for(let p=12;p<end;){
    if(p+8>end)throw Error('Truncated WAVE chunk');
    const size=view.getUint32(p+4,true),start=p+8,next=start+size+(size&1);
    if(start+size>end)throw Error('Truncated WAVE payload');
    if(tag(bytes,p,'fmt ')){
      if(format||size<16)throw Error('Invalid WAVE format chunk');
      const codec=view.getUint16(start,true),channels=view.getUint16(start+2,true),rate=view.getUint32(start+4,true),
        align=view.getUint16(start+12,true),bits=view.getUint16(start+14,true);
      if(![1,3].includes(codec)||![1,2].includes(channels)||rate<1000||rate>384000||
        !(codec===3?bits===32:[8,16,24,32].includes(bits))||align!==channels*bits/8||view.getUint32(start+8,true)!==rate*align)
        throw Error('Unsupported PCM/float WAVE format');
      format={codec,channels,rate,align,bits};
    }else if(tag(bytes,p,'data')){
      if(data!==null)throw Error('Multiple WAVE data chunks are unsupported');
      data=size;
    }
    p=Math.min(next,end); // Older SND WAVs can omit padding after their final odd data chunk.
  }
  if(!format||!data||data%format.align)throw Error('Missing or incomplete WAVE frames');
  const frames=data/format.align;
  if(frames>2147483647||frames/format.rate>3600)throw Error('WAVE duration exceeds the sample limit');
  return {...format,frames};
}

export function readSoundBank(bytes){
  const samples=new Map(),warnings=[];
  if(!bytes)return {samples,catalog:'',warnings};
  if(!(bytes instanceof Uint8Array)||bytes.length<24||bytes.length>32*MiB||!tag(bytes,0,'ElecbyteSnd'))throw Error('Unsupported SND bank');
  const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),count=view.getUint32(16,true);
  if(count>4096)throw Error('SND sample count exceeds 4096');
  let offset=view.getUint32(20,true);const visited=new Set();
  for(let index=0;index<count;index++){
    if(offset<24||offset+16>bytes.length||visited.has(offset))throw Error('Invalid SND linked sample header');
    visited.add(offset);
    const next=view.getUint32(offset,true),size=view.getUint32(offset+4,true),group=view.getInt32(offset+8,true),number=view.getInt32(offset+12,true);
    if(!size||size>16*MiB||offset+16+size>bytes.length)throw Error('Invalid SND sample length');
    const key=group+':'+number,wav=bytes.subarray(offset+16,offset+16+size);
    if(!samples.has(key))try{
      if(group<0||number<0)throw Error('Negative sample IDs are unsupported');
      samples.set(key,{group,number,wav,...pcmMetadata(wav)});
    }catch(error){if(warnings.length<10)warnings.push(key+': '+error.message)}
    offset=next;
  }
  // Original KFM uses EOF as the final pointer; other SND writers use zero.
  if(offset!==0&&offset!==bytes.length)throw Error('SND sample count does not match linked headers');
  const catalog=[...samples.values()].map(s=>[s.group,s.number,s.frames,s.rate].join(',')).join(';');
  return {samples,catalog,warnings};
}
