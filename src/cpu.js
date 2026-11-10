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

/**
 * Classic Winane-style AI activation is encoded in the character's own
 * StateDef -1 branches rather than in the AILevel trigger. The old native
 * engine's setCom() activated these authored branches, whereas generic Core
 * key simulation could incorrectly select the character's human branch.
 *
 * Detect the exact paired CPU/human variable without hard-coding a fighter
 * name or mutating any unrelated character variables.
 */
export function legacyAIActivationVariable(program) {
  const state = program?.states?.get(-1);
  if (!state?.controllers?.length) return null;
  const text = state.controllers.flatMap(controller => (controller.entries || [])
    .filter(entry => /^trigger(?:all|[1-9]\d*)$/.test(entry.key))
    .map(entry => entry.value)).join('\n');
  const cpu = [...text.matchAll(/\bvar\s*\(\s*(\d{1,2})\s*\)\s*(?:>=|>)\s*1\b/gi)]
    .map(match => +match[1]);
  const human = new Set([...text.matchAll(/\bvar\s*\(\s*(\d{1,2})\s*\)\s*<=\s*0\b/gi)]
    .map(match => +match[1]));
  return cpu.find(index => index < 60 && human.has(index)) ?? null;
}

/** Generic CPU input planning. Character-authored AI still runs in CNS using AILevel. */
export class CpuController{
  constructor(parsed,{level=4,seed=0x6d2b79f5}={}){
    this.level=normalizeAILevel(level);this.seed=(seed>>>0)||1;this.buffer=new CommandBuffer(parsed);
    this.inverse=new Map();for(const physical of buttons){const logical=parsed.remap?.[physical]??physical;if(logical&&!this.inverse.has(logical))this.inverse.set(logical,physical);}
    const reachable=parsed.commands.filter(command=>command.sequence.every(symbol=>symbol.kind!=='button'||symbol.keys.every(key=>this.inverse.has(key))));
    this.attacks=reachable.filter(command=>!command.holdOnly&&command.sequence.some(symbol=>symbol.kind==='button'&&symbol.keys.some(key=>key!=='s'))).slice(0,512);
    this.byName=new Map();for(const command of reachable){if(!this.byName.has(command.name))this.byName.set(command.name,[]);this.byName.get(command.name).push(command);}
    this.recoveries=reachable.filter(command=>command.name.toLowerCase()==='recovery');this.recoveryNames=new WeakMap();this.recoveryButton=0;this.recovering=false;
    this.normal=this.attacks.filter(command=>command.sequence.length===1&&!command.sequence[0].release);
    this.special=this.attacks.filter(command=>!this.normal.includes(command));
    this.plan=[];this.index=0;this.remaining=0;this.cooldown=0;this.raw=new Set();this.lastCommand=null;
    // A separate, deterministic cadence permits ordinary jumps between
    // attacks without replacing character-authored CPU or movement scripts.
    this.jumpWait=18+(this.seed%31);
  }
  random(){let value=this.seed;value^=value<<13;value^=value>>>17;value^=value<<5;this.seed=value>>>0;return this.seed/4294967296;}
  physical(relative,facing){return new Set([...relative].map(key=>key==='F'?(facing<0?'L':'R'):key==='B'?(facing<0?'R':'L'):this.inverse.get(key)||key));}
  queue(keys,duration){this.plan=[{keys:new Set(keys),duration}];this.index=0;this.remaining=0;}
  chooseRecovery(fighter){
    const state=fighter.stateOwner?.program.states.get(fighter.stateNo);let names=state&&this.recoveryNames.get(state);
    if(state&&!names){
      names=new Set();
      for(const controller of state.controllers){
        if(!['changestate','selfstate'].includes(controller.type))continue;
        const triggers=controller.entries.filter(entry=>/^trigger(?:all|[1-9]\d*)$/.test(entry.key)).map(entry=>entry.value).join('\n');
        if(/\bcanrecover\b/i.test(triggers))for(const match of triggers.matchAll(/\bcommand\s*=\s*"([^"\\]*)"/gi))names.add(match[1]);
      }
      this.recoveryNames.set(state,names);
    }
    const authored=[...(names||[])].flatMap(name=>this.byName.get(name)||[]),choices=authored.length?authored:this.recoveries;
    if(choices.length){
      const command=choices[Math.floor(this.random()*choices.length)];this.lastCommand=command.name;this.plan=commandInputPlan(command);this.index=0;this.remaining=0;
    }else{
      // A single-button fallback still passes through the character's CMD.
      // It cannot manufacture an absent command or force a recovery state.
      const available=buttons.filter(key=>key!=='s'&&this.inverse.has(key));
      if(available.length)this.queue([available[this.recoveryButton++%available.length]],1);
    }
  }
  /** Let physical Up movement compete before generic command cooldown,
   * never force an authored jump state or interrupt an active command. */
  canJump(fighter) {
    return fighter.ctrl && fighter.moveType !== 'H' &&
      fighter.stateType === 'S' && fighter.pos.y >= -0.01 &&
      fighter.program?.states.has(40) && !fighter.asserted?.has('nojump');
  }
  chooseJump(fighter,opponent) {
    const distance=Math.abs(opponent.pos.x-fighter.pos.x);
    const scale=fighter.coordinateScale||1;
    const range=fighter.constant('size.ground.front')*scale+
      opponent.constant('size.ground.front')*(opponent.coordinateScale||1)+20*scale;
    const advance=distance>range||this.random()<.65;
    const retreat=!advance&&this.random()<.25;
    this.queue(advance?['U','F']:retreat?['U','B']:['U'],3+Math.floor(this.random()*3));
    this.lastCommand=advance?'jump-forward':retreat?'jump-back':'jump-neutral';
    this.jumpWait=Math.max(40,115-this.level*10)+Math.floor(this.random()*35);
    return true;
  }
  choose(fighter,opponent) {
    if(!fighter.ctrl||fighter.moveType==='H')return;
    const distance=Math.abs(opponent.pos.x-fighter.pos.x),scale=fighter.coordinateScale||1;
    const range=fighter.constant('size.ground.front')*scale+opponent.constant('size.ground.front')*(opponent.coordinateScale||1)+20*scale;
    if(this.canJump(fighter)&&this.jumpWait<=0){this.chooseJump(fighter,opponent);return;}
    if(distance>range){this.queue(['F'],4+Math.floor(this.random()*9));return;}
    if(opponent.moveType==='A'&&this.random()<.12+.07*this.level){this.queue(this.random()<.3?['D','B']:['B'],4+this.level);return;}
    if(this.attacks.length){
      const group=this.special.length&&this.random()<.08+.055*this.level?this.special:this.normal.length?this.normal:this.attacks;
      const command=group[Math.floor(this.random()*group.length)];this.lastCommand=command.name;
      this.plan=commandInputPlan(command);this.index=0;this.remaining=0;
    }else this.queue([],2);
  }
  tick(fighter,opponent,{paused=false,enabled=true}={}){
    if(!this.level||!enabled||!fighter.alive||!opponent?.alive){this.plan=[];this.index=0;this.remaining=0;this.cooldown=0;this.raw=new Set();this.recovering=false;}
    else if(!paused){
      if(this.jumpWait>0)this.jumpWait--;
      const recovering=fighter.moveType==='H'&&!!fighter.getHitVars?.fall;
      if(recovering!==this.recovering){this.plan=[];this.index=0;this.remaining=0;this.cooldown=recovering?10-this.level:0;this.raw=new Set();this.recovering=recovering;}
      const eligible=recovering&&['A','L'].includes(fighter.stateType)&&!!fighter.resolveTrigger?.('canrecover');
      if(recovering&&!eligible){this.plan=[];this.index=0;this.remaining=0;this.cooldown=10-this.level;this.raw=new Set();}
      if(!recovering && this.jumpWait<=0 && this.canJump(fighter) &&
          this.index>=this.plan.length) {
        // Native-style Up input is eligible as soon as a completed command
        // releases control, rather than waiting on its generic cooldown.
        this.chooseJump(fighter,opponent);
        this.cooldown=0;
      }
      if(this.index>=this.plan.length){
        if(this.cooldown>0)this.cooldown--;
        else if(recovering){if(eligible)this.chooseRecovery(fighter);this.cooldown=14-this.level;}
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
