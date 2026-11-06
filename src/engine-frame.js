import {createEngineFS} from './engine-fs.js';
import {gunzipSync} from 'fflate';
const send=(type,data={})=>parent.postMessage({kenjatimeEngine:true,type,...data},location.origin);
let started=false,stopped=false,contexts=[];
for(const name of ['AudioContext','webkitAudioContext'])if(window[name]){const Original=window[name];window[name]=class extends Original{constructor(...args){super(...args);contexts.push(this);}};}
window.alert=message=>send('error',{message:String(message).replace(/^I\.K\.E\.M\.E\.N Error\s*/,'')});
window.__kenjatimeFrame={snapshot:()=>stopped?null:window.kenjatimeEngineSnapshot?.(),pause:value=>{if(!stopped)window.kenjatimeEnginePause?.(value);for(const c of contexts)(value?c.suspend():c.resume()).catch(()=>{});},key:(code,down)=>{if(!stopped)window.kenjatimeEngineKey?.(code,down);},dispose:()=>{for(const c of contexts)c.close().catch(()=>{});}};
async function start({files,args}){
 files['save/config.ini']=files['data/kenjatime/config.ini'].slice();
 files['save/kenjatime-match.json']=new TextEncoder().encode(JSON.stringify(Object.fromEntries(Array.from({length:args.length/2},(_,i)=>[args[i*2],args[i*2+1]]))));
 const mounted=createEngineFS(files,{onOutput:line=>{console.log(line);if(/panic:|Error executing|LUA OPEN FAILED/i.test(line))send('error',{message:line});}});window.fs=mounted.fs;window.process=mounted.process;
 await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=new URL('wasm_exec.js',location.href).href;script.onload=resolve;script.onerror=()=>reject(Error('The game runtime could not load.'));document.head.append(script);});
 send('progress',{message:'Loading the game engine…'});
 const response=await fetch(new URL('ikemen.wasm.bin',location.href));if(!response.ok)throw Error('The game engine could not load.');
 const compressed=new Uint8Array(await response.arrayBuffer()),bytes=compressed[0]===0x1f&&compressed[1]===0x8b?(typeof DecompressionStream==='function'?await new Response(new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer():gunzipSync(compressed)):compressed;
 const go=new window.Go();go.argv=['kenjatime'];go.env={GOGC:'200'};go.exit=code=>{stopped=true;send(code?'error':'end',{message:code?'The game engine stopped.':''});};
 const {instance}=await WebAssembly.instantiate(bytes,go.importObject);send('progress',{message:'Preparing fighters and stage…'});
 let ready=false;const timer=setInterval(()=>{const state=window.kenjatimeEngineSnapshot?.();if(!ready&&state?.players.length===2){ready=true;send('ready');}if(ready)send('state',{state});},250);
 go.run(instance).then(()=>{clearInterval(timer);send('end');}).catch(error=>{clearInterval(timer);send('error',{message:error.message});});
}
window.addEventListener('message',event=>{if(event.source!==parent||event.origin!==location.origin||event.data?.type!=='kenjatime-start'||started)return;started=true;start(event.data).catch(error=>send('error',{message:error.message}));});
send('frame-ready');
