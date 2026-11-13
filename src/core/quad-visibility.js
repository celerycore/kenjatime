/**
 * Conservative CPU visibility test for 2D MUGEN quads in the logical
 * 960x540 arena. A sprite wholly outside both the stage view and its
 * optional authored Window has no visible fragments, so it must not
 * allocate/upload a GPU texture, submit a draw, or consume a sprite slot.
 *
 * Uses the exact 2x3 affine transform consumed by Three's shader, including
 * facing flips, rotation, scale and frame axes. Perspective-warped quads are
 * always retained because their shader changes bounds non-affinely.
 * The logical viewport is independent of performance framebuffer scaling.
 */
export function quadVisibleInArena(draw, screenWidth=960, screenHeight=540){
  if(!draw || draw.warp) return true;
  const m=draw.matrix;
  if(!Array.isArray(m)||m.length!==6 ||
     !m.every(Number.isFinite) ||
     !Number.isFinite(draw.width)||!Number.isFinite(draw.height) ||
     draw.width<=0||draw.height<=0) return true;
  const [a,b,c,d,x,y]=m,w=draw.width,h=draw.height;
  const pX=a*w,pY=b*w,qX=c*h,qY=d*h;
  const minX=x+Math.min(0,pX)+Math.min(0,qX);
  const maxX=x+Math.max(0,pX)+Math.max(0,qX);
  const minY=y+Math.min(0,pY)+Math.min(0,qY);
  const maxY=y+Math.max(0,pY)+Math.max(0,qY);
  // Small guard band prevents floating-point edge misses at high zoom.
  if(maxX< -1||minX>screenWidth+1||
     maxY< -1||minY>screenHeight+1) return false;
  if(Array.isArray(draw.clip)&&draw.clip.length===4){
    const [left,top,width,height]=draw.clip;
    if([left,top,width,height].every(Number.isFinite)){
      if(width<=0||height<=0)return false;
      if(maxX<left-1||minX>left+width+1||
         maxY<top-1||minY>top+height+1)return false;
    }
  }
  return true;
}
export function visibleArenaDraws(draws,screenWidth=960,screenHeight=540){
  const visible=[];let culled=0;
  for(const draw of draws||[]){
    if(quadVisibleInArena(draw,screenWidth,screenHeight))visible.push(draw);
    else culled++;
  }
  return {visible,culled};
}
