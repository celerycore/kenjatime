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
  if(override!==undefined)return Math.max(0,Number(override)||0)*(actor.coordinateScale||baseScale(actor));
  const value=actor.program?.constants?.get(`size.${actor.stateType==='A'?'air':'ground'}.${side}`)??15;
  return Math.max(0,Number(value)||0)*baseScale(actor);
}

export function spatialConstant(name){
  if(name.startsWith('velocity.'))return true;
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
