// Browser-native video decoding stays on the page. Only one decoded bitmap per
// layer may be in flight to the Go worker; acknowledgements provide backpressure.
export function createVideoBackgrounds({deliver,audio,warn=()=>{}}){
 const layers=new Map(),sources=new Map();let closed=false;
 function close(id){const s=layers.get(id);if(!s)return;s.closed=true;s.video.pause();if(s.callback)s.video.cancelVideoFrameCallback?.(s.callback);cancelAnimationFrame(s.raf);s.audio?.disconnect();s.video.removeAttribute('src');s.video.load();s.video.remove();layers.delete(id);const source=sources.get(s.path);if(source)source.refs--;}
 function schedule(s){
  if(s.closed||s.scheduled||s.pending||!s.playing||!s.visible)return;s.scheduled=true;
  if(s.video.requestVideoFrameCallback)s.callback=s.video.requestVideoFrameCallback(()=>capture(s));
  else s.raf=requestAnimationFrame(()=>{s.scheduled=false;if(s.video.currentTime!==s.time)capture(s);else schedule(s);});
 }
 async function capture(s){
  s.scheduled=false;if(s.closed||s.pending||!s.playing||!s.visible)return;s.pending=true;s.time=s.video.currentTime;
  try{
   const video=s.video,w=video.videoWidth,h=video.videoHeight;if(!w||!h){s.pending=false;schedule(s);return;}
   let source=video;
   if(s.scale!==0){
    const canvas=s.canvas??=document.createElement('canvas');canvas.width=s.width;canvas.height=s.height;const ctx=canvas.getContext('2d',{alpha:false});
    ctx.fillStyle='#000';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.imageSmoothingEnabled=s.filter!==4;ctx.imageSmoothingQuality='high';
    const scale=s.scale===2?Math.min(s.width/w,s.height/h):s.scale===3?s.width/w:s.scale===4?s.height/h:Math.max(s.width/w,s.height/h);
    const dw=s.scale===1?s.width:w*scale,dh=s.scale===1?s.height:h*scale;ctx.drawImage(video,(s.width-dw)/2,(s.height-dh)/2,dw,dh);source=canvas;
   }
   const bitmap=await createImageBitmap(source);if(s.closed||closed){bitmap.close();return;}
   s.frames++;deliver({type:'video-frame',id:s.id,bitmap,time:s.time},[bitmap]);
  }catch(error){s.pending=false;warn('Stage video could not decode a frame: '+error.message);}
 }
 function play(s){if(s.closed)return;if(s.playing&&s.visible){s.video.play().then(()=>schedule(s)).catch(error=>{if(error.name==='NotAllowedError'&&!s.video.muted){s.blocked=true;s.video.muted=true;s.video.play().then(()=>schedule(s)).catch(()=>{});warn('Tap the arena or Enable sound to hear stage video audio.');}});}else s.video.pause();}
 return{open(data){
  if(closed)return;close(data.id);if(layers.size>=16){warn('This stage exceeds the 16 video-layer limit.');return;}
  let source=sources.get(data.path);if(!source){if(!(data.bytes instanceof Uint8Array)){warn('A stage video resource is missing.');return;}const bytes=data.bytes,mime=bytes[0]===0x1a&&bytes[1]===0x45?'video/webm':String.fromCharCode(...bytes.subarray(4,8))==='ftyp'?'video/mp4':'';source={url:URL.createObjectURL(new Blob([bytes],{type:mime})),refs:0};sources.set(data.path,source);}source.refs++;
  const video=document.createElement('video');video.playsInline=true;video.preload='auto';video.loop=data.loop;video.style.display='none';video.setAttribute('aria-hidden','true');document.body.append(video);
  const s={...data,video,playing:false,visible:true,pending:false,closed:false,frames:0,time:-1};layers.set(data.id,s);s.audio=audio?.media(video);
  video.onloadeddata=()=>play(s);video.onended=()=>{if(!s.closed&&!video.loop)deliver({type:'video-ended',id:s.id});};
  video.onerror=()=>{s.error=video.error?.code||'decode';warn('Stage video format cannot be decoded by this browser. Other stage layers remain available.');};video.src=source.url;
 },control({id,action,value}){const s=layers.get(id);if(!s)return;if(action==='close'){close(id);return;}if(action==='playing')s.playing=!!value;if(action==='visible')s.visible=!!value;if(action==='volume')s.audio?.volume(value);if(action==='reset'){s.video.currentTime=0;s.time=-1;s.ended=false;}play(s);},ack(id){const s=layers.get(id);if(s){s.pending=false;schedule(s);}},gesture(){for(const s of layers.values()){s.video.muted=false;play(s);}},status(){return{layers:layers.size,sources:sources.size,inFlight:[...layers.values()].filter(s=>s.pending).length,frames:[...layers.values()].reduce((n,s)=>n+s.frames,0),videos:[...layers.values()].map(s=>({id:s.id,time:s.video.currentTime,paused:s.video.paused,playing:s.playing,visible:s.visible,frames:s.frames,error:s.error||null}))};},close(){closed=true;for(const id of [...layers.keys()])close(id);for(const source of sources.values())URL.revokeObjectURL(source.url);sources.clear();}};
}
