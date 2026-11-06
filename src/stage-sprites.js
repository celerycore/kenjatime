import {sff,expandIndexedRgba} from './formats.js';
import {MemoryLRU} from './memory-cache.js';

export const STAGE_INDEX_BUDGET=8*1024*1024,STAGE_CANVAS_BUDGET=8*1024*1024;

/** Keep a transparent guard texel so trimming does not create a new visible
 * raster edge. Axes and original dimensions retain the authored coordinates. */
export function trimIndexedSprite(sprite){
 const {w,h,indices,colors}=sprite;if(indices.length!==w*h)throw Error('Invalid indexed stage sprite');
 let left=w,top=h,right=-1,bottom=-1;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const c=indices[y*w+x]*4;if(c+3>=colors.length)throw Error('SFF palette index out of range');
  if(colors[c+3]){if(x<left)left=x;if(x>right)right=x;if(y<top)top=y;if(y>bottom)bottom=y;}
 }
 if(right<left)return{group:sprite.group,number:sprite.number,w:0,h:0,sourceW:w,sourceH:h,sourceX:sprite.x,sourceY:sprite.y,x:sprite.x,y:sprite.y,indices:new Uint8Array(),colors,empty:true};
 left=Math.max(0,left-1);top=Math.max(0,top-1);right=Math.min(w-1,right+1);bottom=Math.min(h-1,bottom+1);
 const width=right-left+1,height=bottom-top+1,cropped=new Uint8Array(width*height);
 for(let row=0;row<height;row++)cropped.set(indices.subarray((top+row)*w+left,(top+row)*w+left+width),row*width);
 const palette=new Uint8Array(1024);palette.set(colors.subarray(0,1024));
 return{group:sprite.group,number:sprite.number,w:width,h:height,x:sprite.x-left,y:sprite.y-top,sourceW:w,sourceH:h,sourceX:sprite.x,sourceY:sprite.y,indices:cropped,colors:palette,trimLeft:left,trimTop:top};
}

/** Runs in the disposable import worker. Unusual/unsupported assets retain the
 * regular decoder path; preparing an optimization must not reject an import. */
export function prepareStageSprites(stages,{maxBytes=STAGE_INDEX_BUDGET,maxPixels=32*1024*1024,onProgress=()=>{}}={}){
 let bytes=0,pixels=0;const buffers=[];
 for(const stage of stages){
  if(!stage.sprite?.path)continue;
  try{
   const bank=sff(stage.files[stage.sprite.path]);if(!bank.decodeIndexed)continue;
   const frames=new Map(),palettes=new Map();
   for(const element of stage.elements){
    if(!element.animated||!element.mask||element.type==='parallax'||element.tile?.some(Boolean))continue;
    const animation=stage.animations.find(a=>a.id===element.anim);for(const frame of animation?.frames||[])frames.set(`${frame.group},${frame.number}`,frame);
   }
   const prepared={};let stageBytes=0;const lookup=new Map(bank.sprites.map((sp,index)=>[`${sp.group},${sp.number}`,index]));
   for(const [key,frame]of frames){
    const index=lookup.get(key);let meta=bank.sprites[index];const seen=new Set();
    while(meta&&!meta.length&&!seen.has(meta)){seen.add(meta);meta=bank.sprites[meta.link];}
    if(!meta||!meta.length||meta.w*meta.h<65536)continue;
    if(pixels+meta.w*meta.h>maxPixels||bytes>=maxBytes)break;pixels+=meta.w*meta.h;
    onProgress('Preparing stage animation…');
    try{
     const decoded=bank.decodeIndexed(index);if(!decoded)continue;const cropped=trimIndexedSprite(decoded);
     let colors=palettes.get(decoded.colors);const paletteBytes=colors?0:cropped.colors.byteLength;
     if(bytes+cropped.indices.byteLength+paletteBytes>maxBytes)continue;
     if(!colors){colors=cropped.colors;palettes.set(decoded.colors,colors);buffers.push(colors.buffer);}
     cropped.colors=colors;prepared[key]=cropped;bytes+=cropped.indices.byteLength+paletteBytes;stageBytes+=cropped.indices.byteLength+paletteBytes;buffers.push(cropped.indices.buffer);
    }catch{/* The regular renderer will report a bad/unsupported sprite. */}
   }
   if(Object.keys(prepared).length)stage.preparedSprites={frames:prepared,bytes:stageBytes};
  }catch{/* Preserve the existing stage import and diagnostics behavior. */}
 }
 return buffers;
}

/** Canvas expands only the cropped, active image. Its animation cache is
 * separate from static stage tiles and fighter textures. WebGL uses the indices. */
export class StageSpriteSurfaces{
 constructor({maxBytes=STAGE_CANVAS_BUDGET,createCanvas=()=>document.createElement('canvas'),createImageData=(rgba,w,h)=>new ImageData(rgba,w,h)}={}){
  this.cache=new MemoryLRU({maxBytes,sizeOf:c=>c.width*c.height*4});this.createCanvas=createCanvas;this.createImageData=createImageData;this.surfaces=new WeakMap();
 }
 get(data,key){
  if(this.surfaces.has(data))return this.surfaces.get(data);
  const result={...data,key,width:data.w,height:data.h,stageIndexed:true},self=this;
  Object.defineProperties(result,{
   rgba:{get:()=>expandIndexedRgba(data.indices,data.colors)},
   canvas:{get:()=>{let canvas=self.cache.get(key);if(!canvas){canvas=self.createCanvas();canvas.width=data.w;canvas.height=data.h;if(data.w&&data.h)canvas.getContext('2d').putImageData(self.createImageData(expandIndexedRgba(data.indices,data.colors),data.w,data.h),0,0);self.cache.set(key,canvas);}return canvas;}}
  });this.surfaces.set(data,result);return result;
 }
 clear(){this.cache.clear();this.surfaces=new WeakMap();}
}
