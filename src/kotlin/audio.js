const MiB=1024*1024;

/** Paint Kotlin's resolved voice events onto Web Audio; no CNS/channel allocation here. */
export class KotlinAudio {
  constructor({contextFactory=()=>new (globalThis.AudioContext||globalThis.webkitAudioContext)(),cacheLimit=32*MiB}={}){
    this.contextFactory=contextFactory;this.cacheLimit=cacheLimit;this.context=null;this.master=null;
    this.banks=[];this.voices=new Map();this.buffers=new Map();this.loading=new Map();this.queue=[];
    this.bytes=0;this.decoders=0;this.generation=0;this.enabled=true;this.paused=false;this.warnings=[];
    this.counts={started:0,stopped:0,panned:0,ended:0};
  }
  warn(error){if(this.warnings.length<10)this.warnings.push(String(error?.message||error))}
  prepare(){
    try{
      if(!this.context){
        this.context=this.contextFactory();this.master=this.context.createGain();
        this.master.gain.value=this.enabled?1:0;
        // The actual stereo output is inspectable without routing extra audible copies.
        const split=this.context.createChannelSplitter?.(2),merge=this.context.createChannelMerger?.(2);
        if(split&&merge&&this.context.createAnalyser){
          this.analysers=[this.context.createAnalyser(),this.context.createAnalyser()];
          this.master.connect(split);
          this.analysers.forEach((node,i)=>{node.fftSize=256;split.connect(node,i);node.connect(merge,0,i)});
          merge.connect(this.context.destination);
        }else this.master.connect(this.context.destination);
      }
      if(!this.paused)this.context.resume?.().catch(error=>this.warn(error));
    }catch(error){this.warn(error)}
  }
  setEnabled(value){this.enabled=!!value;if(this.master)this.master.gain.value=this.enabled?1:0}
  setPaused(value){
    this.paused=!!value;
    if(this.context)(this.paused?this.context.suspend():this.context.resume()).catch(error=>this.warn(error));
  }
  configure(banks){this.reset();this.banks=banks;for(const bank of banks)for(const warning of bank.warnings||[])this.warn(warning)}
  release(voice){
    if(voice.source){voice.source.onended=null;try{voice.source.stop()}catch{};voice.source.disconnect()}
    voice.gainNode?.disconnect();voice.panNode?.disconnect();
    if(voice.entry){voice.entry.refs--;voice.entry=null}
  }
  stop(id){const voice=this.voices.get(id);if(!voice)return;this.voices.delete(id);this.release(voice);this.counts.stopped++}
  reset(){
    this.generation++;
    for(const id of [...this.voices.keys()])this.stop(id);
    for(const task of this.queue.splice(0))task.reject(Error('Match stopped'));
    this.loading.clear();this.buffers.clear();this.bytes=0;this.warnings=[];
  }
  dispose(){this.reset();this.context?.close?.().catch(()=>{});this.context=null;this.master=null;this.analysers=null}
  admit(entry){
    if(entry.bytes>this.cacheLimit)throw Error('Decoded sample exceeds the audio cache');
    while(this.bytes+entry.bytes>this.cacheLimit||this.buffers.size>=256){
      const oldest=[...this.buffers.values()].find(e=>!e.refs);
      if(!oldest)throw Error('Active voices fill the audio cache');
      this.buffers.delete(oldest.key);this.bytes-=oldest.bytes;
    }
    this.buffers.set(entry.key,entry);this.bytes+=entry.bytes;
  }
  retain(entry){
    entry=this.buffers.get(entry.key)||entry;
    if(!this.buffers.has(entry.key))this.admit(entry);
    this.buffers.delete(entry.key);this.buffers.set(entry.key,entry);entry.refs++;return entry;
  }
  buffer(voice){
    const key=[this.generation,voice.side,voice.group,voice.number].join(':');
    const cached=this.buffers.get(key);if(cached)return Promise.resolve(cached);
    if(this.loading.has(key))return this.loading.get(key);
    if(this.queue.length>=32)return Promise.reject(Error('Too many pending audio decodes'));
    const sample=this.banks[voice.side]?.samples.get(voice.group+':'+voice.number);
    if(!sample)return Promise.reject(Error('Sound sample is unavailable'));
    const decodedBytes=Math.ceil(sample.frames*this.context.sampleRate/sample.rate)*sample.channels*4;
    if(decodedBytes>16*MiB)return Promise.reject(Error('Decoded sample exceeds 16 MiB'));
    let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b});
    this.loading.set(key,promise);this.queue.push({key,sample,generation:this.generation,resolve,reject});this.pump();return promise;
  }
  pump(){
    while(this.decoders<2&&this.queue.length){
      const task=this.queue.shift();this.decoders++;
      const wav=task.sample.wav;
      Promise.resolve().then(()=>{
        if(task.generation!==this.generation)throw Error('Match stopped');
        return this.context.decodeAudioData(wav.buffer.slice(wav.byteOffset,wav.byteOffset+wav.byteLength));
      }).then(buffer=>{
        if(task.generation!==this.generation)throw Error('Match stopped');
        const entry={key:task.key,buffer,bytes:buffer.length*buffer.numberOfChannels*4,refs:0};
        this.admit(entry);task.resolve(entry);
      }).catch(task.reject).finally(()=>{this.loading.delete(task.key);this.decoders--;this.pump()});
    }
  }
  handle(events){
    for(const event of events){
      if(event.type==='stop'){this.stop(event.voice);continue}
      if(event.type==='pan'){
        const voice=this.voices.get(event.voice);if(!voice)continue;
        voice.pan=event.pan;if(voice.panNode)voice.panNode.pan.value=event.pan;this.counts.panned++;continue;
      }
      if(event.type!=='play'||!this.context)continue;
      const data=event.data;if(this.voices.size>=128){this.warn('Too many hardware voices');continue}
      this.stop(data.voice);const voice={...data,generation:this.generation,started:false};this.voices.set(data.voice,voice);
      this.buffer(voice).then(entry=>{
        if(this.voices.get(data.voice)!==voice||voice.generation!==this.generation)return;
        voice.entry=this.retain(entry);
        const source=this.context.createBufferSource(),gain=this.context.createGain(),pan=this.context.createStereoPanner();
        voice.source=source;voice.gainNode=gain;voice.panNode=pan;
        source.buffer=voice.entry.buffer;source.loop=voice.loop;source.playbackRate.value=voice.frequency;
        gain.gain.value=voice.gain;pan.pan.value=voice.pan;
        source.connect(gain);gain.connect(pan);pan.connect(this.master);
        source.onended=()=>{if(this.voices.get(data.voice)===voice){this.voices.delete(data.voice);this.release(voice);this.counts.ended++}};
        source.start();voice.started=true;this.counts.started++;
      }).catch(error=>{
        if(this.voices.get(data.voice)===voice){this.voices.delete(data.voice);this.release(voice);this.warn(error)}
      });
    }
  }
  snapshot(){
    const rms=this.analysers?.map(node=>{const data=new Float32Array(node.fftSize);node.getFloatTimeDomainData(data);return Math.sqrt(data.reduce((sum,n)=>sum+n*n,0)/data.length)})||[0,0];
    return {state:this.context?.state||'unavailable',enabled:this.enabled,paused:this.paused,rms,bytes:this.bytes,entries:this.buffers.size,
      decoding:this.decoders,pending:this.queue.length,counts:{...this.counts},warnings:[...this.warnings],
      voices:[...this.voices.values()].map(v=>({voice:v.voice,actor:v.actor,side:v.side,channel:v.channel,group:v.group,number:v.number,
        gain:v.gain,frequency:v.frequency,pan:v.pan,loop:v.loop,started:v.started,
        nodeGain:v.gainNode?.gain.value??null,nodePan:v.panNode?.pan.value??null,nodeFrequency:v.source?.playbackRate.value??null}))};
  }
}
