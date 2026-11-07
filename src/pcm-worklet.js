// Fixed PCM pool shared by transferable ownership, without SharedArrayBuffer.
// This module also supplies the ScriptProcessor fallback and deterministic tests.
export class PCMQueue{
 constructor(request,sourceRate,outputRate){
  this.request=request;this.step=sourceRate/outputRate;this.queue=[];this.offset=0;this.primed=false;this.frames=0;this.underruns=0;this.peak=0;this.blocks=0;
 }
 start(){for(let i=0;i<3;i++)this.request(new ArrayBuffer(1024*2*4));}
 push(buffer){if(buffer.byteLength!==8192)throw Error('Invalid PCM block');this.queue.push(new Float32Array(buffer));}
 render(left,right){
  left.fill(0);right.fill(0);let played=false,missed=false;
  if(!this.primed&&this.queue.length>=2)this.primed=true;
  if(!this.primed)return;
  for(let i=0;i<left.length;i++){
   while(this.queue.length&&this.offset>=1024){this.offset-=1024;const used=this.queue.shift();this.request(used.buffer);}
   if(!this.queue.length){missed=true;this.primed=false;this.offset=0;break;}
   const a=this.queue[0],index=Math.floor(this.offset),fraction=this.offset-index,next=index===1023?(this.queue[1]||a):a,nextIndex=index===1023?(this.queue[1]?0:1023):index+1;
   left[i]=a[index*2]+(next[nextIndex*2]-a[index*2])*fraction;
   right[i]=a[index*2+1]+(next[nextIndex*2+1]-a[index*2+1])*fraction;
   this.peak=Math.max(this.peak,Math.abs(left[i]),Math.abs(right[i]));this.offset+=this.step;this.frames++;played=true;
  }
  if(played)this.blocks++;if(missed)this.underruns++;
 }
 stats(){return{buffers:this.blocks,frames:this.frames,peak:this.peak,underruns:this.underruns,queuedBlocks:this.queue.length};}
}
if(typeof registerProcessor==='function'){
 class KenjatimePCM extends AudioWorkletProcessor{
  constructor(options){
   super();this.quantum=0;this.rate=options.processorOptions.sourceRate;
   this.port.onmessage=({data})=>{
    if(data.port){this.source=data.port;this.queue=new PCMQueue(buffer=>this.source.postMessage({buffer},[buffer]),this.rate,sampleRate);this.source.onmessage=event=>this.queue.push(event.data.buffer);this.source.start();this.queue.start();}
    if(data.reset&&this.queue){this.queue.peak=0;this.queue.blocks=0;}
   };
  }
  process(inputs,outputs){
   const [left,right]=outputs[0];if(this.queue)this.queue.render(left,right);
   if(++this.quantum%64===0&&this.queue)this.port.postMessage(this.queue.stats());return true;
  }
 }
 registerProcessor('kenjatime-pcm',KenjatimePCM);
}
