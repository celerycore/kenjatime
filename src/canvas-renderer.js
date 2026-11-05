import {blendCoefficients} from './rendering.js';

/** A native Canvas factorization of the RGB formula, on an opaque target. */
export function compositePlan(blend){
  const c=typeof blend==='string'?blendCoefficients(blend):blend;
  if(c.mode==='normal')return{mode:'normal',opacity:1,add:0,brightness:1};
  if(c.mode==='subtract')return{mode:'subtract',opacity:0,add:0,brightness:1};
  const opacity=1-c.destination;
  return{mode:'add',opacity,add:Math.max(0,c.source-opacity),brightness:c.source<opacity?c.source/opacity:1};
}

export function spriteBounds(matrix,x,y,width,height,targetWidth,targetHeight){
  const x0=matrix.a*x+matrix.c*y+matrix.e,y0=matrix.b*x+matrix.d*y+matrix.f;
  const dx=matrix.a*width,dy=matrix.b*width,ex=matrix.c*height,ey=matrix.d*height;
  const left=Math.max(0,Math.floor(Math.min(x0,x0+dx,x0+ex,x0+dx+ex)));
  const top=Math.max(0,Math.floor(Math.min(y0,y0+dy,y0+ey,y0+dy+ey)));
  const right=Math.min(targetWidth,Math.ceil(Math.max(x0,x0+dx,x0+ex,x0+dx+ex)));
  const bottom=Math.min(targetHeight,Math.ceil(Math.max(y0,y0+dy,y0+ey,y0+dy+ey)));
  return{left,top,width:Math.max(0,right-left),height:Math.max(0,bottom-top)};
}

/** The app paints an opaque background before sprites. No GPU readback is needed.
 * Subtraction: D-S*a = 1-min(1, (1-D)+S*a). The two white inversions
 * operate in device space and retain the existing mask/viewport clip.
 * For custom alpha, pre-tint the source by plan.brightness before calling draw.
 */
export class CanvasRenderer {
  constructor(context,{createCanvas=()=>document.createElement('canvas'),track=context=>context}={}){this.context=context;this.createCanvas=createCanvas;this.track=track;}
  draw(surface,x,y,plan,bounds,width=surface.width,height=surface.height){
    const ctx=this.context;if(!bounds.width||!bounds.height)return false;
    if(plan.mode==='normal'){ctx.drawImage(surface,x,y,width,height);return true;}
    // Compose offscreen, then apply the destination clip once. Direct multi-pass
    // blending would change partially covered mask/window edges.
    if(!this.surface){this.surface=this.createCanvas();this.scratch=this.track(this.surface.getContext('2d'));}
    // Retain destination device coordinates. Translating the scratch origin to
    // a cropped ROI can move nearest-neighbour edges at floating-point ties.
    if(this.surface.width!==ctx.canvas.width)this.surface.width=ctx.canvas.width;
    if(this.surface.height!==ctx.canvas.height)this.surface.height=ctx.canvas.height;
    const target=this.scratch,matrix=ctx.getTransform();
    target.resetTransform();target.globalCompositeOperation='source-over';target.globalAlpha=1;target.imageSmoothingEnabled=false;
    target.drawImage(ctx.canvas,bounds.left,bounds.top,bounds.width,bounds.height,bounds.left,bounds.top,bounds.width,bounds.height);
    target.setTransform(matrix);
    const alpha=ctx.globalAlpha;target.globalAlpha=alpha;
    if(plan.mode==='subtract'){
      const invert=()=>{target.save();target.resetTransform();target.globalAlpha=1;target.globalCompositeOperation='difference';target.fillStyle='#fff';target.fillRect(bounds.left,bounds.top,bounds.width,bounds.height);target.restore();};
      invert();target.globalCompositeOperation='lighter';target.drawImage(surface,x,y,width,height);invert();
    }else{
      if(plan.opacity){target.globalCompositeOperation='source-over';target.globalAlpha=alpha*plan.opacity;target.drawImage(surface,x,y,width,height);}
      if(plan.add){target.globalCompositeOperation='lighter';target.globalAlpha=alpha*plan.add;target.drawImage(surface,x,y,width,height);}
    }
    ctx.save();ctx.resetTransform();ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.drawImage(this.surface,bounds.left,bounds.top,bounds.width,bounds.height,bounds.left,bounds.top,bounds.width,bounds.height);ctx.restore();return true;
  }
}
