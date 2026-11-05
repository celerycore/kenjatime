import {baseScale} from './coordinates.js';
import {sampleFighterAnimation} from './rendering.js';

const triple = (value,fallback) => Array.isArray(value) ? value.slice(0,3).map((v,i)=>Number(v ?? fallback[i])) : [...fallback];
const clamp = (value,lo=0,hi=255) => Math.max(lo,Math.min(hi,value));

export function transformRgba(rgba,palette) {
  const layers = palette?.layers || (palette ? [palette] : []), out = new Uint8ClampedArray(rgba);
  if (!layers.length) return out;
  for (let pixel=0;pixel<out.length;pixel+=4) {
    if (!out[pixel+3]) continue;
    let rgb = [out[pixel],out[pixel+1],out[pixel+2]];
    for (const fx of layers) {
      const color = clamp(fx.color ?? 256,0,256)/256, grey = rgb[0]*.299+rgb[1]*.587+rgb[2]*.114;
      const add = triple(fx.add,[0,0,0]), mul = triple(fx.mul,[256,256,256]), sin = fx.sinadd || [0,0,0,0];
      const wave = sin[3] > 0 ? Math.sin(2*Math.PI*(fx.age||0)/sin[3]) : 0;
      rgb = rgb.map((v,i)=>{
        v = grey+(v-grey)*color; if (fx.invertall) v=255-v;
        return clamp((v+add[i]+Number(sin[i]||0)*wave)*mul[i]/256+Number(fx.postadd?.[i]||0));
      });
    }
    for(let i=0;i<3;i++)out[pixel+i]=Math.trunc(rgb[i]+1e-8);
  }
  return out;
}

const descriptor = (event,defaults={}) => ({...defaults,...event,age:0,remaining:event.time ?? defaults.time ?? 1});
const live = effect => effect && (effect.remaining < 0 || effect.remaining > 0);
function advance(effect) { if (effect) { effect.age++; if(effect.remaining>0)effect.remaining--; } }

/** Stateful presentation effects. Advance once per simulation tick, never per browser frame. */
export class EffectsState {
  constructor() { this.palettes=new Map();this.afterimages=new Map();this.all=null;this.background=null;this.shake=null;this.environment=null;this.diagnostics=[]; }
  advance({paused=()=>false,backgroundPaused=false}={}) {
    for(const [entity,fx]of this.palettes){if(!paused(entity))advance(fx);if(!live(fx))this.palettes.delete(entity);}
    for(const [entity,trail]of this.afterimages){if(!paused(entity))advance(trail);if(!live(trail))this.afterimages.delete(entity);}
    if(!backgroundPaused){for(const effect of [this.all,this.background,this.shake,this.environment])advance(effect);}
  }
  consume(events,{entity}={}) {
    for(const event of events||[]){
      const type=String(event.type).toLowerCase();
      if(type==='palfx'&&entity){const fx=descriptor(event);if(live(fx))this.palettes.set(entity,fx);else this.palettes.delete(entity);}
      else if(type==='allpalfx')this.all=descriptor(event);
      else if(type==='bgpalfx')this.background=descriptor(event);
      else if(type==='envshake'){const scale=event.coordinateScale??entity?.coordinateScale??1;this.shake=descriptor(event,{time:0,freq:60,ampl:-4/scale,phase:event.freq>=90?90:0,coordinateScale:scale});}
      else if(type==='envcolor')this.environment=descriptor(event,{value:[255,255,255],under:0});
      else if(type==='palettesnapshot'&&event.target)event.target.paletteSnapshot=event.common?{layers:[],key:'[]'}:this.paletteFor(entity,{includeAll:false});
      else if(type==='afterimage'&&entity){
        const trail=descriptor(event,{time:1,length:20,timegap:1,framegap:4,palcolor:256,palbright:[30,30,30],palcontrast:[120,120,220],palpostbright:[0,0,0],paladd:[10,10,25],palmul:[.65,.65,.75],trans:'none'});
        trail.length=clamp(Math.trunc(trail.length),0,60);trail.timegap=Math.max(1,Math.trunc(trail.timegap));trail.framegap=Math.max(1,Math.trunc(trail.framegap));trail.frames=[];
        if(live(trail)&&trail.length)this.afterimages.set(entity,trail);else this.afterimages.delete(entity);
      }else if(type==='afterimagetime'&&this.afterimages.has(entity)){
        const trail=this.afterimages.get(entity);trail.remaining=event.time??event.value??0;if(!live(trail))this.afterimages.delete(entity);
      }
    }
  }
  capture(entities,{paused=()=>false}={}) {
    for(const entity of entities){
      const trail=this.afterimages.get(entity);if(!live(trail)||paused(entity)||trail.age%trail.timegap!==0||trail.lastAge===trail.age)continue;
      const frame=sampleFighterAnimation(entity);if(!frame)continue;
      trail.lastAge=trail.age;
      trail.frames.unshift({entity,frame:{...frame},pos:{...entity.pos},facing:entity.facing,coordinateScale:baseScale(entity),
        character:entity.character,drawScale:{...entity.drawScale},drawOffset:{...entity.drawOffset},angle:entity.angleDraw?entity.angle:0,
        sizeX:entity.constant('size.xscale'),sizeY:entity.constant('size.yscale'),paletteRemaps:new Map(entity.paletteRemaps)});
      trail.frames.length=Math.min(trail.frames.length,trail.length);
    }
  }
  paletteFor(entity,{ownpal=entity?.ownPal??entity?.ownpal,ignoreLocal=false,includeAll=true}={}) {
    let current=ignoreLocal?null:entity,depth=0,layers=[];
    while(current&&depth++<64){
      const fx=this.palettes.get(current);
      if(live(fx)){layers=[fx];break;}
      if(current.paletteSnapshot){layers=current.paletteSnapshot.layers;break;}
      if(current===entity?ownpal:current.ownPal??current.ownpal)break;
      current=current.parent||current.owner;
    }
    layers=[...layers,...(includeAll&&live(this.all)?[this.all]:[])].map(effect=>Object.fromEntries(Object.entries(effect).map(([key,value])=>[key,Array.isArray(value)?[...value]:value])));
    return{layers,key:JSON.stringify(layers.map(({add,mul,sinadd,color,invertall,age})=>({add,mul,sinadd,color,invertall,age:sinadd?age:0})))};
  }
  get backgroundPalette(){const layers=[this.background,this.all].filter(live);return{layers,key:JSON.stringify(layers)};}
  get cameraOffset(){if(!live(this.shake))return{x:0,y:0};const s=this.shake;return{x:0,y:-Number(s.ampl)*s.coordinateScale*Math.sin((Number(s.phase)+s.age*Number(s.freq))*Math.PI/180)};}
  get environmentColor(){return live(this.environment)?this.environment:null;}
  trailsFor(entity){
    const trail=this.afterimages.get(entity);if(!live(trail))return[];
    const snapshots=[];
    for(let i=0;i<trail.frames.length;i+=trail.framegap){
      const layers=[{color:trail.palcolor,invertall:trail.palinvertall,add:trail.palbright,mul:trail.palcontrast,postadd:trail.palpostbright}];
      for(let n=0;n<i;n++)layers.push({add:trail.paladd,mul:triple(trail.palmul,[1,1,1]).map(v=>v*256)});
      if(live(this.all))layers.push(this.all);
      snapshots.push({...trail.frames[i],palette:{layers,key:JSON.stringify(layers)},trans:trail.trans});
    }
    return snapshots.reverse();
  }
  cleanup(entities,{paletteOwners=entities}={}){
    const live=new Set(entities),paletteLive=new Set();
    for(let entity of paletteOwners){let depth=0;while(entity&&depth++<256&&!paletteLive.has(entity)){paletteLive.add(entity);if(entity.ownPal||entity.ownpal||entity.paletteSnapshot)break;entity=entity.parent||entity.owner;}}
    for(const entity of this.palettes.keys())if(!paletteLive.has(entity))this.palettes.delete(entity);
    for(const entity of this.afterimages.keys())if(!live.has(entity))this.afterimages.delete(entity);
  }
}
