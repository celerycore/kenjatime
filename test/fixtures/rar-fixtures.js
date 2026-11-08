// Independently written stored-only headers for archive-decoder regressions.
// These fixtures do not implement compression or use UnRAR source code.
const encode=s=>new TextEncoder().encode(s);
const join=parts=>{const out=new Uint8Array(parts.reduce((n,p)=>n+p.length,0));let offset=0;for(const p of parts){out.set(p,offset);offset+=p.length;}return out;};
const le=(n,length=4)=>{const out=new Uint8Array(length);for(let i=0;i<length;i++){out[i]=n&255;n=Math.floor(n/256);}return out;};
export function crc32(bytes){let crc=0xffffffff;for(const b of bytes){crc^=b;for(let bit=0;bit<8;bit++)crc=crc>>>1^(crc&1?0xedb88320:0);}return (crc^0xffffffff)>>>0;}
const vint=n=>{const bytes=[];do{const part=n%128;n=Math.floor(n/128);bytes.push(part|(n?128:0));}while(n);return new Uint8Array(bytes);};

export function rar4(entries,{volume=false}={}){
  const block=(type,flags,body)=>{const header=join([new Uint8Array([type]),le(flags,2),le(7+body.length,2),body]);return join([le(crc32(header)&0xffff,2),header]);};
  const parts=[new Uint8Array([0x52,0x61,0x72,0x21,0x1a,0x07,0]),block(0x73,volume?1:0,new Uint8Array(6))];
  for(const [name,raw,options={}]of entries){
    const data=typeof raw==='string'?encode(raw):raw??new Uint8Array(),filename=encode(name);
    const body=join([le(data.length),le(options.declaredSize??data.length),new Uint8Array([0]),le(crc32(data)),le(0),new Uint8Array([20,0x30]),le(filename.length,2),le(options.directory?0x10:0x20),filename]);
    parts.push(block(0x74,0x8000|(options.encrypted?4:0)|(options.directory?0xe0:0),body),data);
  }
  parts.push(block(0x7b,0,new Uint8Array()));return join(parts);
}

export function rar5(entries){
  const block=(type,body,data)=>{
    const head=join([vint(type),vint(data?2:0),...(data?[vint(data.length)]:[]),body]),length=vint(head.length),crc=crc32(join([length,head]));
    return join([le(crc),length,head,...(data?[data]:[])]);
  };
  const parts=[new Uint8Array([0x52,0x61,0x72,0x21,0x1a,0x07,1,0]),block(1,vint(0))];
  for(const [name,raw,options={}]of entries){
    const data=typeof raw==='string'?encode(raw):raw??new Uint8Array(),filename=encode(name);
    const body=join([vint(4|(options.directory?1:0)),vint(options.declaredSize??data.length),vint(options.directory?0x10:0x20),le(crc32(data)),vint(0),vint(0),vint(filename.length),filename]);
    parts.push(block(2,body,data));
  }
  parts.push(block(5,vint(0)));return join(parts);
}

// A stored RAR4 file split across actual native volume headers, followed by
// any remaining ordinary entries on the final volume. No encoder executable.
export function rar4Volumes(entries,pieces=3){
 const [[name,raw],...rest]=entries,data=typeof raw==='string'?encode(raw):raw,filename=encode(name);
 const block=(type,flags,body)=>{const header=join([new Uint8Array([type]),le(flags,2),le(7+body.length,2),body]);return join([le(crc32(header)&65535,2),header]);};
 return Array.from({length:pieces},(_,i)=>{
  const chunk=data.slice(Math.floor(data.length*i/pieces),Math.floor(data.length*(i+1)/pieces));
  const head=join([le(chunk.length),le(data.length),new Uint8Array([0]),le(crc32(i===pieces-1?data:chunk)),le(0),new Uint8Array([20,0x30]),le(filename.length,2),le(0x20),filename]);
  return{name:`fighter.part${i+1}.rar`,bytes:join([new Uint8Array([82,97,114,33,26,7,0]),block(0x73,1|16|(i===0?256:0),new Uint8Array(6)),block(0x74,0x8000|(i?1:0)|(i<pieces-1?2:0),head),chunk,...(i===pieces-1?[rar4(rest).subarray(20,-7)]:[]),block(0x7b,i<pieces-1?1:0,new Uint8Array())])};
 });
}
