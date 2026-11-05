const tag=(bytes,start,value)=>start+value.length<=bytes.length&&[...value].every((c,i)=>bytes[start+i]===c.charCodeAt(0));

/** decodeAudioData resamples to the AudioContext rate; stage loop offsets use source samples. */
export function sourceSampleRate(bytes){
  const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
  if(tag(bytes,0,'RIFF')&&tag(bytes,8,'WAVE')){
    for(let offset=12;offset+8<=bytes.length;){
      const size=view.getUint32(offset+4,true),next=offset+8+size+(size&1);
      if(next>bytes.length)return null;
      if(tag(bytes,offset,'fmt ')&&size>=16)return view.getUint32(offset+12,true)||null;
      offset=next;
    }
    return null;
  }
  if(tag(bytes,0,'fLaC')&&bytes.length>=26&&(bytes[4]&127)===0)return(bytes[18]*4096+bytes[19]*16+(bytes[20]>>4))||null;
  if(tag(bytes,0,'OggS')){
    for(let offset=0;offset<Math.min(bytes.length,65536);offset++){
      if(bytes[offset]===1&&tag(bytes,offset+1,'vorbis')&&offset+16<=bytes.length)return view.getUint32(offset+12,true)||null;
      if(tag(bytes,offset,'OpusHead'))return 48000;
    }
    return null;
  }
  let offset=0;
  if(tag(bytes,0,'ID3')&&bytes.length>=10)offset=10+bytes.slice(6,10).reduce((size,n)=>size*128+(n&127),0)+(bytes[5]&16?10:0);
  for(let end=Math.min(bytes.length-3,offset+65536);offset<end;offset++){
    if(bytes[offset]!==255||(bytes[offset+1]&224)!==224)continue;
    const second=bytes[offset+1],third=bytes[offset+2];
    if((second&246)===240){const index=third>>2&15;return[96000,88200,64000,48000,44100,32000,24000,22050,16000,12000,11025,8000,7350][index]||null;}
    const version=second>>3&3,index=third>>2&3,bitrate=third>>4;
    if(version===1||!(second&6)||index===3||!bitrate||bitrate===15)continue;
    return[44100,48000,32000][index]/(version===3?1:version===2?2:4);
  }
  return null;
}

export function musicLoopPoints(bytes,music,duration){
  const custom=music.loopStart>0||music.loopEnd>0,rate=custom?sourceSampleRate(bytes):null;
  if(custom&&!rate)return{start:0,end:duration,exact:false};
  const start=rate?Math.min(duration,Math.max(0,music.loopStart/rate)):0;
  const end=rate&&music.loopEnd>0?Math.min(duration,music.loopEnd/rate):duration;
  return end>start?{start,end,exact:true}:{start:0,end:duration,exact:false};
}
