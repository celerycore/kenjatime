import {baseScale,animationSource} from './coordinates.js';

export function blendCoefficients(blend='') {
  blend=String(blend).toUpperCase();
  if(blend==='S'||blend==='SUB')return{mode:'subtract',source:1,destination:1};
  if(blend==='A'||blend==='ADD')return{mode:'add',source:1,destination:1};
  if(blend==='A1'||blend==='ADD1')return{mode:'add',source:1,destination:.5};
  const match=/^AS([\d.]+)D([\d.]+)$/.exec(blend);
  if(match)return{mode:'add',source:Math.max(0,Math.min(256,+match[1]))/256,destination:Math.max(0,Math.min(256,+match[2]))/256};
  return{mode:'normal',source:1,destination:0};
}

/** Project a sprite's Z, then Y, then X rotation onto MUGEN's orthographic screen.
 * Canvas Y points down. The resulting 2D affine transform retains the cross-axis
 * term, sprite-axis pivot, and back-facing texture flips of the 3D rotation.
 */
export function spriteRotation(angle=0,xangle=0,yangle=0){
  const trig=value=>{
    if(typeof value!=='number'||!Number.isFinite(value))throw Error('Sprite angles must be finite numbers.');
    const radians=(value%360)*Math.PI/180;
    const snap=n=>Math.abs(n)<1e-12?0:Math.abs(1-Math.abs(n))<1e-12?Math.sign(n):n;
    return[snap(Math.cos(radians)),snap(Math.sin(radians))];
  };
  const [cz,sz]=trig(angle),[cx,sx]=trig(xangle),[cy,sy]=trig(yangle);
  return{a:cy*cz,b:sx*sy*cz-cx*sz,c:cy*sz,d:cx*cz+sx*sy*sz};
}

/** Exact source/destination RGB coefficients, with sprite transparency as coverage. */
export function blendPixels(destination,source,blend) {
  if(destination.length!==source.length)throw Error('Blend buffers must have equal sizes.');
  const coefficients=typeof blend==='string'?blendCoefficients(blend):blend;
  const out=new Uint8ClampedArray(destination);
  for(let i=0;i<out.length;i+=4){
    const alpha=source[i+3]/255;if(!alpha)continue;
    for(let c=0;c<3;c++){
      const color=coefficients.mode==='subtract'?destination[i+c]-source[i+c]:source[i+c]*coefficients.source+destination[i+c]*coefficients.destination;
      out[i+c]=Math.max(0,Math.min(255,Math.round(destination[i+c]*(1-alpha)+color*alpha)));
    }
    out[i+3]=Math.round(255*(alpha+destination[i+3]/255*(1-alpha)));
  }
  return out;
}

export function sampleAnimation(animation,index,time=0) {
  const frame=animation?.frames[index];if(!frame)return null;
  if(!frame.interpolate?.length||frame.ticks<=0)return frame;
  const next=animation.frames[index+1]||animation.frames[animation.loopStart||0];if(!next)return frame;
  const t=Math.max(0,Math.min(1,time/frame.ticks)),out={...frame};
  const mix=(a,b)=>a+(b-a)*t;
  for(const kind of frame.interpolate){
    if(kind==='offset'){out.x=mix(frame.x,next.x);out.y=mix(frame.y,next.y);}
    if(kind==='scale'){out.scaleX=mix(frame.scaleX??1,next.scaleX??1);out.scaleY=mix(frame.scaleY??1,next.scaleY??1);}
    if(kind==='angle')out.angle=mix(frame.angle||0,next.angle||0);
    if(kind==='blend'){
      const a=blendCoefficients(frame.blend),b=blendCoefficients(next.blend);
      if(a.mode==='add'&&b.mode==='add')out.blend=`AS${mix(a.source,b.source)*256}D${mix(a.destination,b.destination)*256}`;
    }
  }
  return out;
}

/** AIR offsets use the animation author's units; sprite pixels keep the victim's units. */
export function sampleFighterAnimation(fighter){
  const frame=sampleAnimation(fighter.collisionAnimation??fighter.animation??fighter.animations?.get(fighter.anim),fighter.collisionFrameIndex??fighter.frameIndex,fighter.collisionFrameTime??fighter.frameTime)??fighter.collisionFrame??fighter.currentFrame;
  if(!frame)return null;
  const owner=animationSource(fighter);if(owner===fighter)return frame;
  const raw=(actor,key)=>actor.program?.constants?.get(key)??1;
  const offset=(axis,key)=>{const spriteScale=baseScale(fighter)*raw(fighter,key);return spriteScale?(frame[axis]||0)*baseScale(owner)*raw(owner,key)/spriteScale:0;};
  return {...frame,x:offset('x','size.xscale'),y:offset('y','size.yscale')};
}

export function tileOffsets(origin,extent,step,mode,min,max,limit=256){
  if(!mode)return[0];if(!Number.isFinite(step)||step<=0||!Number.isFinite(extent)||extent<=0)return[];
  let first=mode===1?Math.floor((min-origin-extent)/step):0,last=mode===1?Math.ceil((max-origin)/step):Math.max(0,Math.trunc(mode)-1);
  const count=Math.max(0,last-first+1);if(count>limit)last=first+limit-1;
  return Array.from({length:Math.max(0,last-first+1)},(_,i)=>first+i);
}

export function backgroundTileStep(element,size,axis=0){return element.animated?element.spacing[axis]:size+element.spacing[axis];}

export function parallaxScale(element,width,row,height,cameraY=0){
  const fraction=height>1?row/(height-1):0;
  const top=element.width?element.width[0]/width:element.xscale[0],bottom=element.width?element.width[1]/width:element.xscale[1];
  const perspective=top+(bottom-top)*fraction,denominator=element.yScaleStart+cameraY*element.yScaleDelta;
  // Legacy xscale shears a preprocessed sprite; width resizes a trapezoid around its center.
  return{x:element.width?perspective:1,delta:element.width?(top?perspective/top:1):perspective,y:denominator>0?1/denominator:0};
}
