import {createEngineAudio} from './engine-audio.js';
const send=(type,data={})=>parent.postMessage({kenjatimeEngine:true,type,...data},location.origin);
const asset=name=>new URL(name+'?v='+__KENJATIME_ENGINE_REVISION__,location.href).href;
let started=false,stopped=false,worker,runtime,state=null,backend='pending',gamepadRAF,lastPads='[]',qualityValue='auto';
const audio=createEngineAudio(status=>send('audio',status));
function control(message,transfer=[]){if(stopped)return;if(worker)worker.postMessage(message,transfer);else runtime?.control(message);}
function receive(data){
 if(stopped)return;
 if(data.type==='state'){state=data.state;window.__kenjatimeGPU=data.gpu;}
 if(data.type==='audio-init'){audio.init(data.sampleRate,port=>control({type:'audio-port',port},[port])).catch(error=>send('error',{message:error.message}));return;}
 if(data.type==='rumble'){navigator.getGamepads?.()[data.index]?.vibrationActuator?.playEffect?.(data.kind,data.options)?.catch(()=>{});return;}
 if(data.type==='end'||data.type==='error'){worker?.terminate();runtime?.stop();audio.close();stopped=true;}
 send(data.type,data.type==='state'?{state}:data);
}
window.__kenjatimeFrame={snapshot:()=>state,audioStatus:audio.status,backend:()=>backend,audioProbeReset:audio.resetProbe,audio:audio.audio,quality:value=>{qualityValue=value;control({type:'quality',value});},pause:value=>{control({type:'pause',value});audio.pause(value);},key:(code,down,mods=0,text='')=>{if(down)audio.gesture();control({type:'key',code,down,mods,text});},dispose:()=>{stopped=true;worker?.terminate();runtime?.stop();audio.close();cancelAnimationFrame(gamepadRAF);state=null;}};
const held=new Set();
for(const type of ['keydown','keyup'])window.addEventListener(type,event=>{
 if(event.repeat)return;const down=type==='keydown';down?held.add(event.code):held.delete(event.code);
 const mods=(event.ctrlKey?1:0)|(event.altKey?2:0)|(event.shiftKey?4:0)|(event.metaKey?8:0);
 window.__kenjatimeFrame.key(event.code,down,mods,down&&event.key.length===1?event.key:'');event.preventDefault();
});
window.addEventListener('blur',()=>{for(const code of held)control({type:'key',code,down:false});held.clear();});
window.addEventListener('pointerdown',audio.gesture);
function gamepads(){
 if(stopped)return;
 const pads=Array.from(navigator.getGamepads?.()||[],p=>p?{index:p.index,id:p.id,mapping:p.mapping,rumble:typeof p.vibrationActuator?.playEffect==='function',axes:Array.from(p.axes),buttons:Array.from(p.buttons,b=>({pressed:b.pressed,value:b.value}))}:null),serialized=JSON.stringify(pads);
 if(serialized!==lastPads){lastPads=serialized;control({type:'pads',pads});}
 gamepadRAF=requestAnimationFrame(gamepads);
}
async function workerSupported(){
 if(!HTMLCanvasElement.prototype.transferControlToOffscreen||typeof Worker!=='function')return false;
 try{
  worker=new Worker(new URL('./engine-worker.js',import.meta.url),{type:'module'});
  const supported=await new Promise(resolve=>{const timeout=setTimeout(()=>resolve(false),5000);worker.onmessage=({data})=>{if(data.type==='capabilities'){clearTimeout(timeout);resolve(data.supported);}};worker.onerror=event=>{event.preventDefault();clearTimeout(timeout);resolve(false);};worker.postMessage({type:'probe'});});
  if(!supported){worker.terminate();worker=null;}return supported;
 }catch{worker?.terminate();worker=null;return false;}
}
async function start(data){
 try{data.sampleRate=audio.prepare();}catch(error){console.warn('Audio device unavailable:',error.message);}
 qualityValue=data.quality||'auto';const canvas=document.querySelector('canvas'),urls={runtime:asset('wasm_exec.js'),wasm:asset('ikemen.wasm.bin')};
 if(await workerSupported()){
  if(stopped){worker.terminate();return;}
  backend='worker-three';worker.onmessage=event=>receive(event.data);worker.onerror=event=>receive({type:'error',message:event.message||'The game engine worker stopped.'});
  const offscreen=canvas.transferControlToOffscreen();worker.postMessage({...data,type:'start',canvas:offscreen,urls,quality:qualityValue},[offscreen,...new Set(Object.values(data.files).map(b=>b.buffer))]);gamepads();
 }else{
  if(stopped)return;backend='main-three';const {createEngineRuntime}=await import('./engine-runtime.js');runtime=createEngineRuntime(receive);await runtime.start({...data,canvas,urls,quality:qualityValue});
 }
}
window.addEventListener('message',event=>{if(event.source!==parent||event.origin!==location.origin||event.data?.type!=='kenjatime-start'||started)return;started=true;start(event.data).catch(error=>receive({type:'error',message:error.message}));});
send('frame-ready');
