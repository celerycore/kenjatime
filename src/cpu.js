import {CommandBuffer,parseCommands} from './commands.js';
import {decodeText,packagePath} from './formats.js';

const buttons=['a','b','c','x','y','z','s'];
export function normalizeAILevel(value){return Number.isFinite(Number(value))?Math.max(0,Math.min(8,Math.trunc(Number(value)))):0;}

export function characterCommands(character){
  let path=character.checks?.find(check=>check.key==='cmd'&&check.ok)?.path;
  if(!path&&character.def?.files?.cmd){try{path=packagePath(character.def.files.cmd,character.path?.slice(0,character.path.lastIndexOf('/')+1)||'',true);}catch{/* External CMD files stay unavailable; the import report lists missing resources. */}}
  return parseCommands(path&&character.files?.[path]?decodeText(character.files[path]):'');
}

/** A bounded sequence of relative held-key segments, sampled by the ordinary CMD buffer. */
export function commandInputPlan(command){
  const segments=[];let direction=new Set(),held=new Set(),previous=new Set();
  const emit=(duration=1,pressed=[])=>{
    const keys=new Set([...direction,...held,...pressed]);
    const last=segments.at(-1);
    if(last&&keys.size===last.keys.size&&[...keys].every(key=>last.keys.has(key)))last.duration+=duration;
    else segments.push({keys,duration});
    previous=keys;
  };
  emit();
  for(const symbol of command.sequence){
    if(symbol.kind==='direction'){
      const next=new Set(symbol.keys[0]);
      if(symbol.release){direction=next;emit(Math.max(1,symbol.charge));direction=new Set();emit();}
      else{
        if(!symbol.hold&&next.size===direction.size&&[...next].every(key=>direction.has(key))){direction=new Set();emit();}
        direction=next;emit();
      }
    }else if(symbol.release){
      emit(Math.max(1,symbol.charge),symbol.keys);
      for(const key of symbol.keys)held.delete(key);
      emit();
    }else{
      if(symbol.keys.some(key=>previous.has(key))&&!symbol.hold)emit();
      if(symbol.hold)for(const key of symbol.keys)held.add(key);
      emit(1,symbol.keys);
    }
  }
  direction=new Set();held=new Set();emit();
  return segments;
}

/** Generic CPU input planning. Character-authored AI still runs in CNS using AILevel. */
export class CpuController{
  constructor(parsed,{level=4,seed=0x6d2b79f5}={}){
    this.level=normalizeAILevel(level);this.seed=(seed>>>0)||1;this.buffer=new CommandBuffer(parsed);
    this.inverse=new Map();for(const physical of buttons){const logical=parsed.remap?.[physical]??physical;if(logical&&!this.inverse.has(logical))this.inverse.set(logical,physical);}
    this.attacks=parsed.commands.filter(command=>!command.holdOnly&&command.sequence.some(symbol=>symbol.kind==='button'&&symbol.keys.some(key=>key!=='s'))
      &&command.sequence.every(symbol=>symbol.kind!=='button'||symbol.keys.every(key=>this.inverse.has(key)))).slice(0,512);
    this.normal=this.attacks.filter(command=>command.sequence.length===1&&!command.sequence[0].release);
    this.special=this.attacks.filter(command=>!this.normal.includes(command));
    this.plan=[];this.index=0;this.remaining=0;this.cooldown=0;this.raw=new Set();this.lastCommand=null;
  }
  random(){let value=this.seed;value^=value<<13;value^=value>>>17;value^=value<<5;this.seed=value>>>0;return this.seed/4294967296;}
  physical(relative,facing){return new Set([...relative].map(key=>key==='F'?(facing<0?'L':'R'):key==='B'?(facing<0?'R':'L'):this.inverse.get(key)||key));}
  queue(keys,duration){this.plan=[{keys:new Set(keys),duration}];this.index=0;this.remaining=0;}
  choose(fighter,opponent){
    if(!fighter.ctrl||fighter.moveType==='H')return;
    const distance=Math.abs(opponent.pos.x-fighter.pos.x),scale=fighter.coordinateScale||1;
    const range=fighter.constant('size.ground.front')*scale+opponent.constant('size.ground.front')*(opponent.coordinateScale||1)+20*scale;
    if(distance>range){this.queue(['F'],4+Math.floor(this.random()*9));return;}
    if(opponent.moveType==='A'&&this.random()<.12+.07*this.level){this.queue(this.random()<.3?['D','B']:['B'],4+this.level);return;}
    if(this.attacks.length){
      const group=this.special.length&&this.random()<.08+.055*this.level?this.special:this.normal.length?this.normal:this.attacks;
      const command=group[Math.floor(this.random()*group.length)];this.lastCommand=command.name;
      this.plan=commandInputPlan(command);this.index=0;this.remaining=0;
    }else this.queue([],2);
  }
  tick(fighter,opponent,{paused=false,enabled=true}={}){
    if(!this.level||!enabled||!fighter.alive||!opponent?.alive){this.plan=[];this.index=0;this.remaining=0;this.cooldown=0;this.raw=new Set();}
    else if(!paused){
      if(this.index>=this.plan.length){
        if(this.cooldown>0)this.cooldown--;
        else{this.choose(fighter,opponent);this.cooldown=Math.max(1,15-this.level*1.5);}
      }
      const segment=this.plan[this.index];
      if(segment){
        if(this.remaining<=0)this.remaining=segment.duration;
        this.raw=this.physical(segment.keys,fighter.facing);
        if(--this.remaining<=0)this.index++;
      }else this.raw=new Set();
    }
    return this.buffer.update(this.raw,fighter.facing);
  }
}
