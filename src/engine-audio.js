import {PCMQueue} from './pcm-worklet.js';
const moduleURL=new URL('./pcm-worklet.js',import.meta.url);
export function createEngineAudio(notify){
 let context,node,port,enabled=true,paused=false,closed=false,pcm={buffers:0,frames:0,peak:0,underruns:0},sink='pending';
 const status=()=>({enabled,paused,running:context?.state==='running',contexts:context?[context.state]:[],sink,pcm});
 function sync(){if(context&&context.state!=='closed')(enabled&&!paused?context.resume():context.suspend()).catch(()=>{});notify(status());}
 async function init(sampleRate,connect){
  if(closed)return;
  const Audio=globalThis.AudioContext||globalThis.webkitAudioContext;if(!Audio)return;
  context=new Audio({sampleRate,latencyHint:'interactive'});context.addEventListener('statechange',()=>notify(status()));sync();
  const channel=new MessageChannel();port=channel.port1;
  if(context.audioWorklet){
   try{
    await context.audioWorklet.addModule(moduleURL);
    if(closed)return;
    node=new AudioWorkletNode(context,'kenjatime-pcm',{numberOfInputs:0,numberOfOutputs:1,outputChannelCount:[2],processorOptions:{sourceRate:sampleRate}});
    node.port.onmessage=({data})=>{pcm=data;};node.port.postMessage({port},[port]);sink='audio-worklet';
   }catch(error){console.warn('AudioWorklet unavailable, using browser audio fallback:',error.message);}
  }
  if(closed)return;
  if(!node){
   const queue=new PCMQueue(buffer=>port.postMessage({buffer},[buffer]),sampleRate,context.sampleRate);
   port.onmessage=event=>queue.push(event.data.buffer);port.start();queue.start();
   node=context.createScriptProcessor(1024,0,2);node.onaudioprocess=event=>{queue.render(event.outputBuffer.getChannelData(0),event.outputBuffer.getChannelData(1));pcm=queue.stats();};sink='script-processor';
  }
  node.connect(context.destination);connect(channel.port2);sync();
 }
 return{init,status,gesture:sync,audio(value){enabled=value;sync();},pause(value){paused=value;sync();},resetProbe(){pcm={buffers:0,frames:0,peak:0,underruns:0};node?.port?.postMessage({reset:true});},close(){closed=true;node?.disconnect();port?.close();context?.close().catch(()=>{});}};
}
