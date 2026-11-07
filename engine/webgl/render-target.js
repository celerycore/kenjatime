// Resolution changes apply only to render targets. Go keeps its authored space.
export function createRenderTarget(gl,stats,clock=()=>performance.now()){
 let canvas,scene,color,depth,grab,width=0,height=0,scale=1,mode='auto',allowed=true,windowStart=0,frames=0,recover=0,nextRecovery=0,initialized=false;
 const now=clock;
 function resize(next){
  if(!initialized||scale===next)return;scale=next;
  const w=Math.max(1,Math.round(width*scale)),h=Math.max(1,Math.round(height*scale));
  // Cold path only: preserve the bindings mirrored by the Go renderer.
  const unit=gl.getParameter(gl.ACTIVE_TEXTURE);gl.activeTexture(gl.TEXTURE0);
  const texture=gl.getParameter(gl.TEXTURE_BINDING_2D),renderbuffer=gl.getParameter(gl.RENDERBUFFER_BINDING);
  for(const target of [color,grab]){gl.bindTexture(gl.TEXTURE_2D,target);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,null);}
  gl.bindRenderbuffer(gl.RENDERBUFFER,depth);gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT24,w,h);
  gl.bindRenderbuffer(gl.RENDERBUFFER,renderbuffer);gl.bindTexture(gl.TEXTURE_2D,texture);gl.activeTexture(unit);
  canvas.width=w;canvas.height=h;stats.renderWidth=w;stats.renderHeight=h;stats.renderScale=scale;
 }
 function begin(canScale){
  if(!initialized)return;allowed=!!canScale;
  if(mode==='sharp'||!allowed){resize(1);return;}
  const t=now();if(!windowStart){windowStart=t;return;}
  if(t-windowStart<2000||frames<10)return;
  const interval=(t-windowStart)/frames;windowStart=t;frames=0;
  if(interval>23&&scale>.5){resize(scale===1?.75:.5);recover=0;nextRecovery=t+30000;}
  else if(interval<17.5&&scale<1&&t>nextRecovery){if(++recover>=5){resize(scale===.5?.75:1);recover=0;}}
  else recover=0;
 }
 return{
  configure(c,fbo,texture,rbo,grabTexture,w,h,quality){canvas=c;scene=fbo;color=texture;depth=rbo;grab=grabTexture;width=w;height=h;mode=quality==='sharp'?'sharp':'auto';initialized=true;Object.assign(stats,{renderWidth:w,renderHeight:h,renderScale:1,quality:mode});},
  begin,end(){frames++;},
  quality(value){mode=value==='sharp'?'sharp':'auto';stats.quality=mode;windowStart=0;frames=0;recover=0;},
  viewport(target,x,y,w,h){if(initialized&&(target===scene||target===null)){const sx=canvas.width/width,sy=canvas.height/height;gl.viewport(Math.round(x*sx),Math.round(y*sy),Math.round(w*sx),Math.round(h*sy));}else gl.viewport(x,y,w,h);},
  scissor(target,x,y,w,h){if(initialized&&target===scene){const sx=canvas.width/width,sy=canvas.height/height,left=Math.floor(x*sx),bottom=Math.floor(y*sy);gl.scissor(left,bottom,Math.ceil((x+w)*sx)-left,Math.ceil((y+h)*sy)-bottom);}else gl.scissor(x,y,w,h);},
  // Screenshot readback is cold. Upsample to Go's requested output dimensions.
  readPixels(x,y,w,h,format,type,destination){
   if(!initialized||scale===1){gl.readPixels(x,y,w,h,format,type,destination);return;}
   const rw=canvas.width,rh=canvas.height,pixels=new Uint8Array(rw*rh*4);gl.readPixels(0,0,rw,rh,format,type,pixels);
   for(let py=0;py<h;py++)for(let px=0;px<w;px++){const src=(Math.min(rh-1,Math.floor((py+y)*rh/height))*rw+Math.min(rw-1,Math.floor((px+x)*rw/width)))*4,dst=(py*w+px)*4;destination[dst]=pixels[src];destination[dst+1]=pixels[src+1];destination[dst+2]=pixels[src+2];destination[dst+3]=pixels[src+3];}
  }
 };
}
