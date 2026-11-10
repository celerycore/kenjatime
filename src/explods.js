import {copyPaletteRemaps,remapAllPalettes} from './palettes.js';
const pair=(value,fallback=[0,0])=>value===undefined?[...fallback]:Array.isArray(value)?[value[0]??fallback[0],value[1]??fallback[1]]:[value,fallback[1]];
const direction=value=>value<0?-1:1;
const integer=value=>Math.trunc(Number(value));
const commonAnim=raw=>/^\s*f(?=\s|[\d(+.-])/i.test(raw||'');
export const explodDrawPriority = effect => effect.ontop ? 1000 : effect.under ? -1000 : effect.sprpriority || 0;
const options=new Set(['anim','id','space','pos','facing','vfacing','bindid','bindtime','vel','velocity','accel','removetime','supermovetime','pausemovetime','scale','angle','xangle','yangle','sprpriority','under','ontop','shadow','ownpal','remappal','removeongethit','ignorehitpause','trans','alpha','postype','random','supermove']);

function setPalette(owner,e,data,creating=false){
  const ownpal=data.ownpal===undefined?(creating?e.common:e.ownpal):!!data.ownpal;
  if(ownpal&&(creating||!e.ownpal)){
    e.paletteRemaps=e.common?new Map():copyPaletteRemaps(owner.paletteRemaps);
    owner.events.push({type:'palettesnapshot',target:e,common:e.common});
  }
  if(!ownpal){e.paletteRemaps=null;e.paletteSnapshot=null;}
  e.ownpal=ownpal;
  if(ownpal&&!e.common&&data.remappal!==undefined)try{remapAllPalettes(e.paletteRemaps,owner.character,data.remappal);}catch(error){owner.diagnostic('palette',error.message);}
}

function position(owner,e,data,creating){
  const config=e.config,view=owner.world?.view||{displayHeight:240};
  if(creating||data.random!==undefined){const range=pair(config.random);e.randomOffset=range.map(n=>n>0?Math.floor(owner.resolveTrigger('random')/1000*n)-Math.floor(n/2):0);}
  const offsets=pair(config.pos).map((n,i)=>(n+e.randomOffset[i])*owner.coordinateScale);
  e.bindOffset=offsets;e.relativeFacing=direction(config.facing??1);e.vfacing=direction(config.vfacing??1);
  const modern=config.space!==undefined||config.bindid!==undefined,version=/^1\.(\d+)/.exec(owner.character.def?.info?.mugenversion||'');
  e.postype=modern?null:String(config.postype??(version&&Number(version[1])>=1?'none':'p1')).toLowerCase();
  e.bindID=integer(config.bindid??-2);e.bindingTarget=null;
  if(modern){
    e.space=String(config.space||'stage').toLowerCase();if(!['stage','screen'].includes(e.space))throw Error(`Unsupported Explod space ${e.space}.`);
    if(e.space==='screen'&&e.bindID!==-2)throw Error('Screen-space Explods cannot be bound.');
    if(e.bindID!==-2&&config.bindtime===undefined)throw Error('Explod bindID requires bindtime.');
    e.pos={x:offsets[0],y:offsets[1]};e.facing=e.relativeFacing;
  }else if(['p1','p2'].includes(e.postype)){
    e.space='stage';e.bindingTarget=e.postype==='p2'?owner.opponent:owner;
    e.pos={x:e.bindingTarget?.pos.x??owner.pos.x,y:e.bindingTarget?.pos.y??owner.pos.y};e.facing=e.relativeFacing*(e.bindingTarget?.facing??owner.facing);
  }else if(['front','back','left','right'].includes(e.postype)){
    e.space='screen';const right=e.postype==='right'||e.postype==='front'&&owner.facing>0||e.postype==='back'&&owner.facing<0;
    const sign=e.postype==='back'?owner.facing:1;e.pos={x:(right?320:0)+offsets[0]*sign,y:offsets[1]};e.facing=e.relativeFacing*sign;
  }else if(e.postype==='none'){e.space='stage';e.pos={x:offsets[0],y:offsets[1]};e.facing=e.relativeFacing;}
  else throw Error(`Unsupported Explod postype ${e.postype}.`);
  const binding=e.postype==='p1'||e.postype==='p2'||e.bindID!==-2;
  e.bindtime=e.space==='stage'&&binding?integer(config.bindtime??1):0;
  e.initialBinding=binding;e.positioned=!e.initialBinding;
  if(!Number.isFinite(view.displayHeight))throw Error('Invalid Explod viewport.');
}

function apply(owner,e,data,creating,controller){
  for(const key of ['angle','xangle','yangle'])if(data[key]!==undefined&&(typeof data[key]!=='number'||!Number.isFinite(data[key])))throw Error(`Explod ${key} must be a finite number.`);
  e.config={...e.config,...data};
  if(data.anim!==undefined||creating){
    const common=data.anim===undefined?e.common:commonAnim(controller.values.anim),anim=integer(data.anim??e.anim);
    const bank=common?owner.commonAnimations:owner.animations;
    if(!bank.has(anim)||!bank.get(anim).frames?.length)throw Error(`Explod ${common?'common ':''}animation ${anim} does not exist or has no frames.`);
    e.anim=anim;e.common=common;e.animation=bank.get(anim);e.frameIndex=0;e.frameTime=0;
  }
  for(const key of ['removetime','supermovetime','pausemovetime','sprpriority','under','angle','xangle','yangle','ontop','shadow','removeongethit','ignorehitpause','supermove'])if(data[key]!==undefined)e[key]=data[key];
  for(const key of ['removetime','supermovetime','pausemovetime','sprpriority'])e[key]=integer(e[key]??0);
  if(e.removetime< -2||integer(e.config.bindtime??0)< -1)throw Error('Invalid Explod removal or binding time.');
  // Older custom characters sometimes apply GameMakeAnim's 'under' syntax
  // to Explod. Support it as a layering hint, not as an animation offset.
  if(data.under!==undefined)e.under=+!!Number(data.under);
  if(data.scale!==undefined)e.scale=pair(data.scale,[1,1]);
  if(data.trans!==undefined||data.alpha!==undefined)e.trans={mode:String(e.config.trans||'default').toLowerCase(),alpha:pair(e.config.alpha,[256,0])};
  if(data.vel!==undefined||data.velocity!==undefined||creating)e.velocity=pair(e.config.vel??e.config.velocity).map(v=>v*owner.coordinateScale);
  if(data.accel!==undefined||creating)e.accel=pair(e.config.accel).map(v=>v*owner.coordinateScale);
  setPalette(owner,e,data,creating);
  if(creating||['space','postype','pos','bindid','random'].some(key=>data[key]!==undefined))position(owner,e,data,creating);
  else{
    if(data.facing!==undefined){e.relativeFacing=direction(data.facing);e.facing=e.relativeFacing*(e.bindingTarget?.facing??(e.postype==='back'?owner.facing:1));}
    if(data.vfacing!==undefined)e.vfacing=direction(data.vfacing);
    if(data.bindtime!==undefined)e.bindtime=integer(data.bindtime);
  }
}

export function executeExplod(owner,controller){
  const id=integer(owner.value(controller,'id',-1)),matches=owner.explods.filter(e=>id===-1||e.id===id);
  if(controller.type==='removeexplod'){owner.explods=owner.explods.filter(e=>!matches.includes(e));owner.drawExplods=owner.drawExplods.filter(e=>id!==-1&&e.id!==id);return;}
  if(controller.type==='explodbindtime'){
    const time=integer(owner.value(controller,controller.values.time===undefined?'value':'time',1));
    if(time< -1)throw Error('ExplodBindTime must be -1 or greater.');for(const e of matches)e.bindtime=time;return;
  }
  const entries=commonAnim(controller.values.anim)?controller.entries.map(entry=>entry.key==='anim'?{...entry,value:entry.value.replace(/^\s*f\s*/i,'')}:entry):controller.entries;
  const data=owner.effectParameters({...controller,entries});
  if(controller.values.ignorehitpause!==undefined)data.ignorehitpause=owner.value(controller,'ignorehitpause',1);
  // Historic source archives sometimes reference AIR actions that they do
  // not contain. Classify this as missing original artwork, not a failed
  // controller execution; never attach an unrenderable Explod.
  if(data.anim!==undefined){
    const common=commonAnim(controller.values.anim),number=integer(data.anim);
    const bank=common?owner.commonAnimations:owner.animations;
    if(!bank.has(number)||!bank.get(number).frames?.length){
      owner.diagnostic('missing-animation',
        `Explod ${common?'F':''}${number} has no original AIR frames.`,controller);
      return;
    }
  }
  for(const key of Object.keys(data))if(!options.has(key))owner.diagnostic('unsupported-explod-parameter',`Explod parameter ${key} is not implemented.`,controller);
  for(const key of ['pos','vel','velocity','accel','scale','random','remappal','alpha'])if(Array.isArray(data[key])&&data[key].length>2)throw Error(`Explod ${key} takes at most two components.`);
  if(controller.type==='modifyexplod'){
    for(const e of matches){
      const start=owner.events.length,candidate={...e,config:{...e.config},paletteRemaps:e.paletteRemaps?new Map(e.paletteRemaps):null};
      try{apply(owner,candidate,data,false,controller);}catch(error){owner.events.length=start;throw error;}
      Object.assign(e,candidate);for(const event of owner.events.slice(start))if(event.target===candidate)event.target=e;
    }return;
  }
  if(controller.values.anim===undefined)throw Error('Explod requires anim.');
  if(owner.explods.length>=512){owner.diagnostic('resource-limit','Explod limit (512 per entity) reached.',controller);return;}
  const e={owner,creator:owner,id,coordinateScale:owner.coordinateScale,time:0,frameIndex:0,frameTime:0,config:{},removetime:-2,bindtime:0,ignorehitpause:1,supermovetime:0,pausemovetime:0,scale:[1,1],angle:0,xangle:0,yangle:0,vfacing:1};
  apply(owner,e,data,true,controller);owner.explods.push(e);
}

function pauseAllows(e,pause,key){
  if(!pause?.remaining)return true;
  if(e[key]!==pause){e[key]=pause;e[key+'Moved']=0;}
  if(key==='superPause'&&e.supermove)return true;
  const field=key==='superPause'?'supermovetime':'pausemovetime';
  if(e[key+'Moved']>=Math.max(0,e[field]||0))return false;e[key+'Moved']++;return true;
}

/** DestroySelf unbinds effects immediately, retaining their last world position. */
export function unbindExplods(owner,target){
  for(const e of owner.explods){
    const bound=e.bindingTarget===target||!e.bindingTarget&&(e.postype==='p1'&&owner===target||e.postype==='p2'&&owner.opponent===target||e.bindID===target.id||e.bindID===-1&&owner.root===target);
    if(!bound||!e.initialBinding&&e.bindtime===0)continue;
    if(e.initialBinding||!e.positioned){e.pos={x:target.pos.x+e.bindOffset[0]*target.facing,y:target.pos.y+e.bindOffset[1]};e.facing=e.relativeFacing*target.facing;}
    e.bindingTarget=null;e.bindtime=0;e.initialBinding=false;e.positioned=true;
  }
}

export function updateExplods(owner,{hitPaused=false,pause=null,superPause=null,forceFrozen=false}={}){
  const rendered=[];
  for(const e of owner.explods){
    if(e.removetime===0||e.pendingRemoval&&!superPause?.remaining){e.removed=true;continue;}
    if(!e.bindingTarget&&(e.bindtime||e.initialBinding)){
      if(e.postype==='p2')e.bindingTarget=owner.opponent;
      else if(e.postype==='p1')e.bindingTarget=owner;
      else if(e.bindID!==-2)e.bindingTarget=e.bindID===-1?owner.root:e.bindID===owner.id?owner:owner.world?.findPlayer(e.bindID);
    }
    if(e.bindingTarget?.destroyed){e.bindingTarget=null;e.bindtime=0;e.initialBinding=false;}
    const bound=e.space==='stage'&&!!e.bindingTarget&&(e.initialBinding||e.bindtime!==0);
    if(e.initialBinding&&!e.bindingTarget){owner.diagnostic('missing-player',`Explod binding player ${e.bindID} is unavailable.`);e.removed=true;continue;}
    let frozen=forceFrozen||hitPaused&&!e.ignorehitpause;
    if(!frozen)frozen=superPause?.remaining?!pauseAllows(e,superPause,'superPause'):!pauseAllows(e,pause,'pause');
    if(bound){e.facing=e.relativeFacing*e.bindingTarget.facing;e.pos={x:e.bindingTarget.pos.x+e.bindOffset[0]*e.bindingTarget.facing,y:e.bindingTarget.pos.y+e.bindOffset[1]};e.positioned=true;}
    else if(!frozen&&e.time>0){e.pos.x+=e.velocity[0]*e.facing;e.pos.y+=e.velocity[1];}
    rendered.push({...e,pos:{...e.pos},source:e});
    if(frozen)continue;
    if(e.time>0){e.velocity[0]+=e.accel[0];e.velocity[1]+=e.accel[1];}
    e.initialBinding=false;if(e.bindtime>0)e.bindtime--;
    const frame=e.animation.frames[e.frameIndex];
    if(frame&&frame.ticks>=0&&++e.frameTime>=Math.max(1,frame.ticks)){
      e.frameTime=0;if(++e.frameIndex>=e.animation.frames.length){if(e.removetime===-2)e.removed=true;e.frameIndex=e.animation.loopStart||0;}
    }
    e.time++;if(e.removetime>0&&e.time>=e.removetime)e.removed=true;
    if(e.removed&&e.supermove&&superPause?.remaining){e.removed=false;e.pendingRemoval=true;}
  }
  owner.drawExplods=rendered;owner.explods=owner.explods.filter(e=>!e.removed);
}
