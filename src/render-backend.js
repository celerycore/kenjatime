import {CanvasRenderer} from './canvas-renderer.js';

const fields=['fillStyle','strokeStyle','lineWidth','globalAlpha','globalCompositeOperation','imageSmoothingEnabled','lineCap','lineJoin'];
const paints=new Set(['fillRect','strokeRect','fill','stroke','drawImage','putImageData','fillText','strokeText']);
const matrixKey=m=>[m.a,m.b,m.c,m.d,m.e,m.f];
const canvas=()=>document.createElement('canvas');

/** Canvas primitives are staged between GPU sprite batches, in original painter order.
 * This is deliberately a hybrid prototype: complete-frame Canvas texture uploads
 * are never used as a substitute for GPU sprite rendering.
 */
export class RenderBackend{
 constructor(context,{track=c=>c,onChange=()=>{}}={}){
  this.raw=context;this.canvas=context.canvas;this.fallback=new CanvasRenderer(context,{track});this.onChange=onChange;this.requested='canvas';this.active='canvas';this.reason='';this.stack=[];this.clip=null;this.pathRect=null;this.slots=[];this.mutable=new WeakSet();this.bound=new Map();this.serial=0;
  this.context=new Proxy(context,{get:(target,key)=>{
   if(typeof target[key]!=='function')return target[key];if(!this.bound.has(key))this.bound.set(key,(...args)=>this.call(key,args));return this.bound.get(key);
  },set:(target,key,value)=>{target[key]=value;return true;}});
 }
 state(){return{matrix:this.raw.getTransform(),clip:this.clip&&[...this.clip],values:Object.fromEntries(fields.map(f=>[f,this.raw[f]]))};}
 call(name,args){
  if(this.active!=='pixi')return this.raw[name](...args);
  if(name==='save')this.stack.push(this.state());
  else if(name==='restore'){const state=this.stack.pop();if(state)this.clip=state.clip;}
  else if(name==='beginPath'){this.pathRect=null;this.pathKey='';}
  else if(name==='rect'){
   const [x,y,w,h]=args,m=this.raw.getTransform();if(Math.abs(m.b)>1e-10||Math.abs(m.c)>1e-10)throw Error('Rotated clip paths need Canvas');
   const x1=m.a*x+m.e,x2=m.a*(x+w)+m.e,y1=m.d*y+m.f,y2=m.d*(y+h)+m.f;this.pathRect=[Math.min(x1,x2),Math.min(y1,y2),Math.max(x1,x2),Math.max(y1,y2)];
  }else if(name==='clip'){
   if(!this.pathRect)throw Error('Non-rectangular clipping needs Canvas');
   const r=this.pathRect,c=this.clip;this.clip=c?[Math.max(c[0],r[0]),Math.max(c[1],r[1]),Math.min(c[2],r[2]),Math.min(c[3],r[3])]:[...r];
  }
  if(['moveTo','lineTo','rect','ellipse','arc','bezierCurveTo','quadraticCurveTo','closePath'].includes(name))this.pathKey=(this.pathKey||'')+name+args.join(',');
  if(paints.has(name)){
   this.dirty=true;
   // Drawn image buffers can change in place; never cache them by object ID.
   if(name==='drawImage'||name==='putImageData')this.dynamic=true;
   else this.keyParts.push([name,args,this.raw.fillStyle,this.raw.strokeStyle,this.raw.lineWidth,this.raw.globalAlpha,matrixKey(this.raw.getTransform()),this.clip,this.pathKey]);
  }
  return this.raw[name](...args);
 }
 async select(mode){
  const serial=++this.serial;this.requested=mode;this.reason='';
  if(mode!=='pixi'){this.useCanvas();this.releaseGpu();return;}
  if(!this.gpu){
   const output=canvas();output.className='gpu-canvas';output.setAttribute('aria-hidden','true');output.width=this.canvas.width;output.height=this.canvas.height;
   Object.assign(output.style,{position:'absolute',inset:'0',width:'100%',height:'100%',pointerEvents:'none',display:'none'});this.canvas.parentElement.append(output);
   let gpu;
   try{const {PixiSpriteRenderer}=await import('./pixi-renderer.js');gpu=new PixiSpriteRenderer();await gpu.init({canvas:output,onLost:message=>this.fail(message)});if(serial!==this.serial){gpu.destroy();output.remove();return;}this.gpu=gpu;}
   catch(error){try{gpu?.destroy();}catch{}output.remove();this.fail(`WebGL unavailable: ${error.message}`);return;}
  }
  this.active='pixi';this.stack=[];this.clip=null;this.raw.reset();this.raw.imageSmoothingEnabled=false;this.onChange();
 }
 useCanvas(){this.active='canvas';this.canvas.style.opacity='';if(this.gpu)this.gpu.canvas.style.display='none';this.raw.reset();this.raw.imageSmoothingEnabled=false;this.stack=[];this.clip=null;this.onChange();}
 releaseGpu(){const gpu=this.gpu;this.gpu=null;if(gpu)queueMicrotask(()=>{try{gpu.destroy();}catch{}gpu.canvas.remove();});}
 fail(message){this.reason=message;this.useCanvas();this.releaseGpu();}
 beginFrame(){
  if(this.active!=='pixi')return;this.stack=[];this.clip=null;this.pathRect=null;this.keyParts=[];this.pathKey='';this.dirty=false;this.dynamic=false;this.slot=0;
  this.gpu.beginFrame(this.canvas.width,this.canvas.height);
 }
 restoreCanvasState(state){
  const ctx=this.raw;if(state.clip){ctx.resetTransform();ctx.beginPath();ctx.rect(state.clip[0],state.clip[1],Math.max(0,state.clip[2]-state.clip[0]),Math.max(0,state.clip[3]-state.clip[1]));ctx.clip();}
  ctx.setTransform(state.matrix);Object.assign(ctx,state.values);
 }
 clearStaging(){
  const current=this.state();this.raw.reset();for(const state of this.stack){this.restoreCanvasState(state);this.raw.save();}this.restoreCanvasState(current);
  this.dirty=false;this.dynamic=false;this.keyParts=[];
 }
 flushCanvas(){
  if(!this.dirty)return;
  if(this.gpu.frameBytes+this.canvas.width*this.canvas.height*4>this.gpu.limit)throw Error('This frame exceeds the GPU staging budget');
  const index=this.slot++,key=this.dynamic?null:JSON.stringify(this.keyParts),w=this.canvas.width,h=this.canvas.height;
  let slot=this.slots[index];
  if(!slot){slot={canvas:canvas(),key:null};this.slots[index]=slot;}
  const surface=slot.canvas,changed=!key||key!==slot.key||surface.width!==w||surface.height!==h;
  if(changed){surface.width=w;surface.height=h;surface.getContext('2d').drawImage(this.canvas,0,0);slot.key=key;}
  this.gpu.draw({surface,key:surface,matrix:{a:1,b:0,c:0,d:1,e:0,f:0},mutable:changed});this.clearStaging();
 }
 drawSprite(sp,x,y,blend,palette){
  this.flushCanvas();this.gpu.draw({surface:sp.stageIndexed?sp:sp.canvas,key:'sprite:'+sp.key,pixels:()=>sp.stageIndexed?sp.indices:sp.rgba,indexPalette:sp.stageIndexed?sp.colors:null,matrix:this.raw.getTransform(),x,y,clip:this.clip,alpha:this.raw.globalAlpha,blend,palette});
 }
 markMutable(surface){this.mutable.add(surface);}
 draw(surface,x,y,plan,bounds,width=surface.width,height=surface.height){
  if(this.active!=='pixi')return this.fallback.draw(surface,x,y,plan,bounds,width,height);
  this.flushCanvas();
  if(this.mutable.has(surface)){
   if(this.gpu.frameBytes+surface.width*surface.height*4>this.gpu.limit)throw Error('This frame exceeds the GPU staging budget');
   const index=this.slot++,slot=this.slots[index]||={canvas:canvas(),key:null},copy=slot.canvas;
   copy.width=surface.width;copy.height=surface.height;copy.getContext('2d').drawImage(surface,0,0);surface=copy;slot.key=null;
  }
  const blend={mode:plan.mode,source:plan.mode==='add'?plan.opacity+plan.add:1,destination:plan.mode==='add'?1-plan.opacity:plan.mode==='normal'?0:1};
  this.gpu.draw({surface,matrix:this.raw.getTransform(),x,y,width,height,clip:this.clip,alpha:this.raw.globalAlpha,blend,mutable:this.slots.some(slot=>slot.canvas===surface&&slot.key===null)});return true;
 }
 endFrame(){
  if(this.active!=='pixi')return;this.flushCanvas();this.gpu.endFrame();this.gpu.canvas.style.display='';this.canvas.style.opacity='0';
 }
 clear(){if(this.gpu){this.gpu.clearTextures();this.slots=[];}}
 get stats(){return{renderer:this.active,rendererRequested:this.requested,rendererFallback:this.reason,gpuSprites:this.active==='pixi'?this.gpu.stats.sprites:0,gpuBatches:this.active==='pixi'?this.gpu.stats.batches:0,gpuUploads:this.active==='pixi'?this.gpu.stats.uploads:0,gpuUploadBytes:this.active==='pixi'?this.gpu.stats.uploadBytes:0,gpuTextureBytes:this.gpu?.textureBytes||0};}
}
