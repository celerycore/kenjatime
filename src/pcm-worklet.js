// Fixed PCM pool shared by transferable ownership, without SharedArrayBuffer.
// This module also supplies the ScriptProcessor fallback and deterministic tests.
export class PCMQueue{
 constructor(request,sourceRate,outputRate,{poolSize=3,maxBlocks=8,adaptive=true,recoverySeconds=30}={}){
  if(!Number.isFinite(sourceRate)||!Number.isFinite(outputRate)||!(sourceRate>0&&outputRate>0)||!Number.isInteger(poolSize)||!Number.isInteger(maxBlocks)||poolSize<2||poolSize>maxBlocks||maxBlocks>8)throw Error('Invalid PCM settings');
  this.request=request;this.sourceRate=sourceRate;this.step=sourceRate/outputRate;this.queue=[];this.offset=0;this.primed=false;this.frames=0;this.underruns=0;this.peak=0;this.blocks=0;
  this.initialPool=poolSize;this.poolSize=poolSize;this.maxBlocks=maxBlocks;this.adaptive=adaptive;this.healthyFrames=0;this.recoveryFrames=recoverySeconds*outputRate;
 }
 start(){for(let i=0;i<this.poolSize;i++)this.request(new ArrayBuffer(1024*2*4));}
 push(buffer){if(buffer.byteLength!==8192)throw Error('Invalid PCM block');this.queue.push(new Float32Array(buffer));}
 recycle(){
  this.offset-=1024;const used=this.queue.shift();
  // Retire only fully played buffers; lowering latency never skips samples.
  if(this.adaptive&&this.poolSize>this.initialPool&&this.healthyFrames>=this.recoveryFrames){this.poolSize--;this.healthyFrames=0;}
  else this.request(used.buffer);
 }
 render(left,right){
  left.fill(0);right.fill(0);let played=false,missed=false;
  if(!this.primed&&this.queue.length>=2)this.primed=true;
  if(!this.primed)return;
  for(let i=0;i<left.length;){
   while(this.queue.length&&this.offset>=1024)this.recycle();
   if(!this.queue.length){missed=true;this.primed=false;this.offset=0;break;}
   const a=this.queue[0];
   if(this.step===1){
    const n=Math.min(left.length-i,1024-this.offset);let at=this.offset*2;
    for(let end=i+n;i<end;i++,at+=2){left[i]=a[at];right[i]=a[at+1];this.peak=Math.max(this.peak,Math.abs(left[i]),Math.abs(right[i]));}
    this.offset+=n;this.frames+=n;this.healthyFrames+=n;played=true;
   }else{
    const index=Math.floor(this.offset),fraction=this.offset-index,next=index===1023?(this.queue[1]||a):a,nextIndex=index===1023?(this.queue[1]?0:1023):index+1;
    left[i]=a[index*2]+(next[nextIndex*2]-a[index*2])*fraction;
    right[i]=a[index*2+1]+(next[nextIndex*2+1]-a[index*2+1])*fraction;
    this.peak=Math.max(this.peak,Math.abs(left[i]),Math.abs(right[i]));this.offset+=this.step;this.frames++;this.healthyFrames++;i++;played=true;
   }
  }
  if(played)this.blocks++;
  if(missed){this.underruns++;this.healthyFrames=0;if(this.adaptive&&this.poolSize<this.maxBlocks){this.poolSize++;this.request(new ArrayBuffer(8192));}}
 }
 stats(){return{buffers:this.blocks,frames:this.frames,peak:this.peak,underruns:this.underruns,queuedBlocks:this.queue.length,poolBlocks:this.poolSize,bufferedMs:Math.max(0,this.queue.length*1024-this.offset)*1000/this.sourceRate,bufferLimitMs:this.maxBlocks*1024*1000/this.sourceRate,resampling:this.step!==1};}
}
if(typeof registerProcessor==='function'){
 class KenjatimePCM extends AudioWorkletProcessor{
  constructor(options){
   super();this.quantum=0;this.rate=options.processorOptions.sourceRate;this.settings=options.processorOptions.queue;
   this.port.onmessage=({data})=>{
    if(data.port){this.source=data.port;this.queue=new PCMQueue(buffer=>this.source.postMessage({buffer},[buffer]),this.rate,sampleRate,this.settings);this.source.onmessage=event=>this.queue.push(event.data.buffer);this.source.start();this.queue.start();}
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
