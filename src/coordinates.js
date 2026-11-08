/** Engine vectors stay in the shared 320-wide world; scripts use the active state width. */
export function baseScale(actor){
  if(actor?.baseCoordinateScale>0)return actor.baseCoordinateScale;
  const width=Number(String(actor?.character?.def?.info?.localcoord||'320,240').split(',')[0]);
  return width>0?320/width:1;
}

/** Body/edge widths in the shared world, independent of current state ownership. */
export function bodyWidthWorld(actor,direction,{edge=false}={}){
  const front=actor.facing===direction,side=front?'front':'back';
  const override=edge?actor.width?.edge?.[front?0:1]:actor.width?.[side];
  const value=actor.program?.constants?.get(`size.${actor.stateType==='A'?'air':'ground'}.${side}`)??15;
  if(override!==undefined){
    const offset=(Number(override)||0)*(actor.coordinateScale||baseScale(actor));
    return Math.max(0,offset+(actor.world?.orderedPhases?Math.max(0,Number(value)||0)*baseScale(actor):0));
  }
  return Math.max(0,Number(value)||0)*baseScale(actor);
}

/** Edge triggers use their own width bar and quantize in script coordinates. */
export function edgeTriggerDistance(actor,direction,{body=false,scale=actor.coordinateScale}={}){
  const view=actor.world?.view;
  const boundary=direction>0?(view?.right??actor.options?.rightBound??160):(view?.left??actor.options?.leftBound??-160);
  let distance=direction>0?boundary-actor.pos.x:actor.pos.x-boundary;
  if(body){
    const width=actor.width??actor._previousWidth;
    const offset=Number(width?.edge?.[actor.facing===direction?0:1])||0;
    distance-=offset*actor.coordinateScale+(actor.stateType==='A'?.5:0);
  }
  return Math.trunc(distance/scale);
}

export function spatialConstant(name){
  if(name.startsWith('velocity.'))return !/\.mul(?:\.|$)/.test(name);
  if(name.startsWith('size.'))return !['size.xscale','size.yscale','size.proj.doscale'].includes(name);
  return name.startsWith('movement.')&&!/(?:\.friction$|\.num$|\.time$|\.mul(?:\.|$))/.test(name);
}

export const spatialHitVars=new Set(['xoff','yoff','zoff','xvel','yvel','xveladd','yveladd','yaccel','fall.xvel','fall.yvel','fall.envshake.ampl']);

export function changeCoordinateScale(actor,next){
  const previous=actor.coordinateScale,ratio=previous/next;actor.coordinateScale=next;
  if(ratio===1)return;
  for(const key of spatialHitVars)if(typeof actor.getHitVars[key]==='number')actor.getHitVars[key]*=ratio;
  if(actor.width){for(const key of ['front','back'])if(typeof actor.width[key]==='number')actor.width[key]*=ratio;if(actor.width.edge)actor.width.edge=actor.width.edge.map(value=>value*ratio);}
  if(actor.attackDist!==undefined)actor.attackDist*=ratio;
}

export function animationSource(actor){return actor.collisionFrame?actor.collisionAnimationOwner||actor.animationOwner||actor:actor.animationOwner||actor;}
