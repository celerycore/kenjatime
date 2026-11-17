/** Paint a resolved Kotlin blend descriptor on an opaque Canvas; no simulation state. */
export function paintBlendedSprite(ctx,image,x,y,blend,whiteMask){
  let passes=0;
  const draw=img=>{ctx.drawImage(img,x,y);passes++};
  ctx.save();
  try{
    ctx.globalAlpha=1;
    if(blend?.mode==="sub"){
      const mask=whiteMask();
      // 1 - min(1, (1 - destination) + source) = max(destination - source, 0).
      ctx.globalCompositeOperation="difference";draw(mask);
      ctx.globalCompositeOperation="lighter";draw(image);
      ctx.globalCompositeOperation="difference";draw(mask);
    }else if(blend?.mode==="add"){
      if(blend.destination<256){
        ctx.globalCompositeOperation="destination-out";ctx.globalAlpha=1-blend.destination/256;draw(image);
      }
      if(blend.source>0){
        ctx.globalCompositeOperation="lighter";ctx.globalAlpha=blend.source/256;draw(image);
      }
    }else{
      ctx.globalCompositeOperation="source-over";draw(image);
    }
  }finally{ctx.restore()}
  return passes;
}
