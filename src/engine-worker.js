import {createEngineRuntime} from './engine-runtime.js';
let runtime;
self.onmessage=async({data})=>{
 try{
  if(data.type==='probe'){
   let supported=false;
   if(typeof OffscreenCanvas==='function'&&typeof requestAnimationFrame==='function'){
    const canvas=new OffscreenCanvas(1,1),gl=canvas.getContext('webgl2',{antialias:false});supported=!!gl;gl?.getExtension('WEBGL_lose_context')?.loseContext();
   }
   self.postMessage({type:'capabilities',supported});return;
  }
  if(data.type==='start'){
   runtime=createEngineRuntime(message=>self.postMessage(message));await runtime.start(data);return;
  }
  runtime?.control(data);
 }catch(error){self.postMessage({type:'error',message:error.message});}
};
