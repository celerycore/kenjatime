import {createEngineFS} from './engine-fs.js';
import {gunzipSync} from 'fflate';
import {createThreeSubmitter} from '../engine/three/submit.js';

// One owner for the Go VM, resource filesystem, input state and GPU context.
// This runs in a dedicated worker where OffscreenCanvas/WebGL2 is available.
export function createEngineRuntime(emit){
 let stopped=false,audioPort,pendingAudio,ready=false,videoSerial=0;
 const videoFrames=new Map(),videoStates=new Map(),videoSources=new Set();
 const dropVideo=id=>{const frame=videoFrames.get(id);frame?.bitmap?.close();videoFrames.delete(id);if(frame?.bitmap)emit({type:'video-ack',id});};
 globalThis.__kenjatimeCreateGPU=(...args)=>{const gpu=createThreeSubmitter(...args);globalThis.__kenjatimeGPUControl=gpu;return gpu;};
 globalThis.alert=message=>emit({type:'error',message:String(message).replace(/^I\.K\.E\.M\.E\.N Error\s*/,'')});
 globalThis.__kenjatimePublish=state=>{
  if(stopped||state.matchTime<=0)return;
  if(!ready&&state.players.length===2){ready=true;emit({type:'ready'});}
  emit({type:'state',state,gpu:globalThis.__kenjatimeGPU?{...globalThis.__kenjatimeGPU}:null});
 };
 globalThis.__kenjatimeAudioInit=sampleRate=>emit({type:'audio-init',sampleRate});
 globalThis.__kenjatimeWriteAudio=(ptr,n)=>{
  if(!pendingAudio||stopped)return;
  const data=new Float32Array(pendingAudio);data.set(new Float32Array(globalThis.__kenjatimeWasmMemory.buffer,ptr,n));
  audioPort.postMessage({buffer:pendingAudio},[pendingAudio]);pendingAudio=null;
 };
 function control(data){
  if(stopped)return;
  if(data.type==='video-frame'){dropVideo(data.id);videoFrames.set(data.id,{bitmap:data.bitmap,width:data.bitmap.width,height:data.bitmap.height});return;}
  if(data.type==='video-ended'){dropVideo(data.id);videoFrames.set(data.id,{ended:true});return;}
  if(data.type==='quality')globalThis.__kenjatimeCreateGPUControl?.(data.value);
  if(data.type==='key')globalThis.kenjatimeEngineKey?.(data.code,data.down,data.mods||0,data.text||'');
  if(data.type==='pause')globalThis.kenjatimeEnginePause?.(data.value);
  if(data.type==='pads'){
   globalThis.__kenjatimeGamepads=data.pads.map(p=>p&&({...p,vibrationActuator:p.rumble?{playEffect:(kind,options)=>{emit({type:'rumble',index:p.index,kind,options});return Promise.resolve();}}:null}));
  }
  if(data.type==='audio-port'){
   audioPort=data.port;audioPort.onmessage=event=>{if(stopped)return;pendingAudio=event.data.buffer;globalThis.kenjatimeAudioPull?.();};audioPort.start();
  }
 }
 async function start({files,args,canvas,urls,quality,sampleRate}){
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();if(!stopped)emit({type:'error',message:'The graphics device reset. Start the match again.'});},{once:true});
  globalThis.__kenjatimeCanvas=canvas;globalThis.__kenjatimeQuality=quality;
  globalThis.__kenjatimeCreateGPUControl=value=>{globalThis.__kenjatimeQuality=value;globalThis.__kenjatimeGPUControl?.quality(value);};
  const videoControl=(id,action,value)=>{const key=id+':'+action;if(videoStates.get(key)===value)return;videoStates.set(key,value);if(action==='visible'&&!value)dropVideo(id);emit({type:'video-control',id,action,value});};
  globalThis.__kenjatimeVideo={open(path,loop,scale,filter,width,height){
   const normalized=[];for(const part of path.replaceAll('\\','/').split('/')){if(part==='..')normalized.pop();else if(part&&part!=='.')normalized.push(part);}
   path=normalized.join('/').normalize('NFC').toLowerCase();const bytes=files[path];if(!bytes){emit({type:'progress',message:'A stage video file is missing.'});return 0;}
   const id=++videoSerial;emit({type:'video-open',id,path,loop,scale,filter,width,height,...(!videoSources.has(path)?{bytes}: {})});videoSources.add(path);return id;
  },frame:id=>videoFrames.get(id)||null,consume:dropVideo,playing:(id,value)=>videoControl(id,'playing',value),visible:(id,value)=>videoControl(id,'visible',value),volume:(id,value)=>videoControl(id,'volume',value),reset:id=>{dropVideo(id);emit({type:'video-control',id,action:'reset'});},close:id=>{dropVideo(id);emit({type:'video-control',id,action:'close'});}};
  if(Object.keys(files).some(p=>/\.(mod|xm|it|s3m)$/i.test(p))){emit({type:'progress',message:'Preparing module music…'});const {createModuleMusic}=await import('./module-music.js');globalThis.__kenjatimeModuleMusic=await createModuleMusic();}
  files['save/config.ini']=files['data/kenjatime/config.ini'].slice();
  // Mix directly at the AudioContext's native rate; Android need not resample
  // a forced 44.1 kHz context into its usual 48 kHz output device.
  if(Number.isInteger(sampleRate)&&sampleRate>=8000&&sampleRate<=192000){
   const config=files['save/config.ini'],sound=new TextEncoder().encode('\n[Sound]\nSampleRate = '+sampleRate+'\n'),merged=new Uint8Array(config.length+sound.length);merged.set(config);merged.set(sound,config.length);files['save/config.ini']=merged;
  }
  files['save/kenjatime-match.json']=new TextEncoder().encode(JSON.stringify(Object.fromEntries(Array.from({length:args.length/2},(_,i)=>[args[i*2],args[i*2+1]]))));
  const mounted=createEngineFS(files,{onOutput:line=>{console.log(line);if(/panic:|Error executing|LUA OPEN FAILED/i.test(line))emit({type:'error',message:line});}});
  globalThis.fs=mounted.fs;globalThis.process=mounted.process;
  await import(/* @vite-ignore */ urls.runtime);
  emit({type:'progress',message:'Loading the game engine…'});
  const response=await fetch(urls.wasm);if(!response.ok)throw Error('The game engine could not load.');
  const compressed=new Uint8Array(await response.arrayBuffer());
  const bytes=compressed[0]===0x1f&&compressed[1]===0x8b?(typeof DecompressionStream==='function'?await new Response(new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer():gunzipSync(compressed)):compressed;
  if(stopped)return;
  const go=new globalThis.Go();go.argv=['kenjatime'];go.env={GOGC:'200'};
  go.exit=code=>{if(stopped)return;stopped=true;emit(code?{type:'error',message:'The game engine stopped.'}:{type:'end'});};
  const {instance}=await WebAssembly.instantiate(bytes,go.importObject);
  globalThis.__kenjatimeWasmMemory=instance.exports.mem;
  emit({type:'progress',message:'Preparing fighters and stage…'});
  go.run(instance).then(()=>{if(!stopped)emit({type:'end'});}).catch(error=>{if(!stopped)emit({type:'error',message:error.message});});
 }
 return{start,control,stop(){stopped=true;audioPort?.close();globalThis.__kenjatimeModuleMusic?.close();for(const id of videoFrames.keys())dropVideo(id);}};
}
