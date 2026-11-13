import {inGuardDistance} from './guard-distance.js';
import {FighterRuntime} from './runtime.js';
import {ProjectileRuntime} from './projectiles.js';
import {StageRuntime,ArenaCamera} from './stages.js';
import {RoundFlow} from './rounds.js';
import {fightStartLocked} from './core/fight-start.js';
import {CpuController,characterCommands,normalizeAILevel,legacyAIActivationVariable,nativeCnsAIActivationVariable,nativeCnsAIActivationValue,authoredAIProgram} from './cpu.js';
import {baseScale,bodyWidthWorld,animationSource} from './coordinates.js';
import {combatRules as readCombatRules} from './combat-rules.js';
import {CommandBuffer} from './commands.js';
import {unbindExplods} from './explods.js';

const finite = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const flagText = value => String(value ?? '').toUpperCase().replace(/\s/g, '');

function constant(fighter, name, fallback) {
  const values = fighter.program?.constants;
  const value = values instanceof Map ? values.get(name) : values?.[name];
  return value === undefined ? fallback : finite(value, fallback);
}

/** AIR boxes in the match's 320-wide coordinate system; each result is [left, top, right, bottom].
 * AIR element offsets/flips are sprite controls: collision rectangles remain relative to the fighter axis.
 */
export function transformedBoxes(fighter, kind = 'clsn1', frame = fighter.collisionFrame ?? fighter.currentFrame) {
  if (!frame || !Array.isArray(frame[kind])) return [];
  const animationOwner=animationSource(fighter),coordinate=baseScale(animationOwner);
  const facing = fighter.facing < 0 ? -1 : 1;
  const sx = constant(animationOwner, 'size.xscale', 1) * coordinate * facing;
  const sy = constant(animationOwner, 'size.yscale', 1) * coordinate;
  const originX = finite(fighter.pos?.x) + constant(fighter, 'size.draw.offset.x', 0) * baseScale(fighter) * facing + finite(fighter.drawOffset?.x);
  const originY = finite(fighter.pos?.y) + constant(fighter, 'size.draw.offset.y', 0) * baseScale(fighter) + finite(fighter.drawOffset?.y);
  return frame[kind].filter(box => Array.isArray(box) && box.length >= 4 && box.slice(0, 4).every(value => Number.isFinite(Number(value)))).map(box => {
    const x1 = originX + Number(box[0]) * sx;
    const x2 = originX + Number(box[2]) * sx;
    const y1 = originY + Number(box[1]) * sy;
    const y2 = originY + Number(box[3]) * sy;
    return [Math.min(x1, x2), Math.min(y1, y2), Math.max(x1, x2), Math.max(y1, y2)];
  });
}

export function boxesOverlap(a, b, inclusive=false) {
  return inclusive?a[0]<=b[2]&&a[2]>=b[0]&&a[1]<=b[3]&&a[3]>=b[1]:a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1];
}

function contactArea(attackBoxes, hurtBoxes, inclusive=false) {
  for (const a of attackBoxes) for (const b of hurtBoxes) {
    if (boxesOverlap(a, b,inclusive)) return [Math.max(a[0], b[0]), Math.max(a[1], b[1]), Math.min(a[2], b[2]), Math.min(a[3], b[3])];
  }
  return null;
}

function allowsState(flags, defender) {
  const inHit = defender.moveType === 'H';
  if (flags.includes('+') && !inHit || flags.includes('-') && inHit) return false;
  if (defender.stateType === 'L') return flags.includes('D');
  if (defender.stateType === 'A') return flags.includes(defender.moveType==='H'&&defender.getHitVars?.fall?'F':'A');
  return flags.includes('M')||flags.includes(defender.stateType==='C'?'L':'H');
}

function canGuard(hit, attacker, defender, commands) {
  const guardStun=defender.moveType==='H'&&!!defender.getHitVars?.guarded;
  if ((!defender.ctrl&&!guardStun) || defender.moveType === 'H'&&!guardStun || !['S', 'C', 'A'].includes(defender.stateType)) return false;
  if (attacker.asserted?.has('unguardable')) return false;
  const forbiddenGuard = defender.stateType === 'A' ? 'noairguard' : defender.stateType === 'C' ? 'nocrouchguard' : 'nostandguard';
  if (defender.asserted?.has(forbiddenGuard)) return false;
  const normalized = new Set([...commands].map(command => String(command).toLowerCase()));
  if (!(defender.world?.manageInputs?defender.movementHeld('holdback'):normalized.has('holdback'))) return false;
  const flags = flagText(hit.guardFlag ?? hit.guardflag);
  return defender.stateType === 'A' ? flags.includes('A') : defender.stateType === 'C' ? /[LM]/.test(flags) : /[HM]/.test(flags);
}

function priority(hit) {
  const parts = Array.isArray(hit.priority) ? hit.priority : String(hit.priority ?? '4,Hit').split(',');
  const type = String(parts[1] ?? 'Hit').trim().toLowerCase();
  return {level: Math.max(1, Math.min(7, finite(parts[0], 4))), type: ['hit', 'miss', 'dodge'].includes(type) ? type : 'hit'};
}

function chooseContacts(contacts) {
  if (contacts.length < 2) return contacts;
  const a = priority(contacts[0].hit), b = priority(contacts[1].hit);
  if (a.level !== b.level) return [contacts[a.level > b.level ? 0 : 1]];
  if (a.type === 'dodge' || b.type === 'dodge') return [];
  if (a.type === 'miss' && b.type === 'miss') return [];
  return contacts.filter((_, index) => (index ? b : a).type === 'hit');
}

/** Deterministic, two-fighter training. Stage bounds and ground push separation are intentionally simple. */
export class TrainingMatch {
  constructor(character, {commonText = '', commonAnimations = new Map(), opponentCharacter = character, leftBound = -150, rightBound = 150, pushboxes = true, maxHelpers = 56, maxProjectiles = 256,initialize=true,skipIntro=true,stage=null,rules=null,combatRules={},playerPalette=1,opponentPalette=1,playerAILevel=0,opponentAILevel=0,expressionEvaluator=null,programs=null,manageInputs=false,orderedPhases=false,cameraFollow=false,kotlinCombatBackend=null} = {}) {
    this.expressionEvaluator=expressionEvaluator;
    this.programs=programs;
    this.manageInputs=manageInputs;
    this.orderedPhases=orderedPhases;
    this.combatRules=readCombatRules(character.files,combatRules);
    if (!Number.isFinite(leftBound) || !Number.isFinite(rightBound) || leftBound >= rightBound) throw Error('Invalid training stage bounds.');
    this.character = character;
    this.opponentCharacter = opponentCharacter;
    this.commonText = commonText;
    this.leftBound = leftBound;
    this.rightBound = rightBound;
    this.pushboxes = pushboxes;
    this.commonAnimations = commonAnimations; this.maxHelpers = Math.min(256,Math.max(0,maxHelpers)); this.maxProjectiles = Math.min(1024,Math.max(0,maxProjectiles));
    // Opt-in Kotlin/Wasm host bridge. The same JS hit logic remains authoritative.
    this.kotlinCombatKernel=kotlinCombatBackend?.createProjectileKernel(this.maxProjectiles)??null;
    this.initialize=initialize;this.skipIntro=skipIntro;
    this.playerPalette=playerPalette;this.opponentPalette=opponentPalette;
    this.playerAILevel=normalizeAILevel(playerAILevel);this.opponentAILevel=normalizeAILevel(opponentAILevel);
    this.stage=stage?new StageRuntime(stage):null;this.cameraRuntime=this.stage||new ArenaCamera();this.cameraFollow=!!cameraFollow;this.rules=rules;this.gameMode=rules?'versus':'training';
    if(this.stage){this.leftBound=stage.leftBound;this.rightBound=stage.rightBound;}
    this.reset();
  }

  reset({preserveMatch=false}={}) {
    const prior=preserveMatch?{players:[this.player,this.opponent],flow:this.roundFlow,ticks:this.ticks,diagnostics:this.diagnostics}:null;
    this.roundFlow=prior?.flow||(this.rules?new RoundFlow(this.rules):null);this._benchmarkStartHeld=false;this.roundGeneration=(this.roundGeneration||0)+1;
    if(this.stage)this.stage.reset({backgrounds:!preserveMatch||this.stage.definition.resetBG});
    else this.cameraRuntime.reset();
    const starts=this.stage?.definition.starts||[{x:-70,y:0,facing:1},{x:70,y:0,facing:-1}];
    this.player = new FighterRuntime(this.character, {world:this,program:this.programs?.get(this.character),expressionEvaluator:this.expressionEvaluator,commonAnimations:this.commonAnimations,commonText: this.commonText, position:starts[0], facing:starts[0].facing, id: 1, teamSide: 1,paletteNo:this.playerPalette,aiLevel:this.playerAILevel});
    this.opponent = new FighterRuntime(this.opponentCharacter, {world:this,program:this.programs?.get(this.opponentCharacter),expressionEvaluator:this.expressionEvaluator,commonAnimations:this.commonAnimations,commonText: this.commonText, position:starts[1], facing:starts[1].facing, id: 2, teamSide: 2,paletteNo:this.opponentPalette,aiLevel:this.opponentAILevel});
    // Native setCom() exposed CPU identity to original Winane-style AI
    // branches; Core's synthetic keypresses otherwise trigger human mode.
    // Detect the variable from the character's own StateDef -1 controllers.
    for (const actor of [this.player,this.opponent]) if (actor.aiLevel>0) {
      const flag=legacyAIActivationVariable(actor.program);
      if(flag!==null){actor.legacyAIFlag=flag;actor.legacyAIValue=nativeCnsAIActivationValue(actor.program,nativeCnsAIActivationVariable(actor.program));actor.vars[flag]=actor.legacyAIValue;}
    }
    this.player.teamSide = 1;
    this.opponent.teamSide = 2;
    this.player.opponent=this.opponent;this.opponent.opponent=this.player;
    this._entities = [this.player,this.opponent]; this.projectiles = []; this.nextEntityId = 3;
    // Reused broadphase storage: minX,minY,maxX,maxY for every active projectile.
    // Typed-array capacity is fixed by the existing bounded projectile limit.
    this._projectileClashBounds ||= new Float64Array(this.maxProjectiles * 4);
    this.projectileClashStats = {pairsVisited:0, narrowphaseCalls:0};
    this.orphanEffectOwners=[];this.renderEntities=[...this._entities];this.drawProjectiles=[];this.helperCommands=new Map();
    // Round-scoped helper lifecycle counters for MUGEN parity diagnostics.
    // Constant-time on helper creation/destruction; never enumerate assets.
    this.helperStats={attempted:0,created:0,rejected:0,missingState:0,destroyed:0,peak:0};
    this.usedHits = new Map();this.juggles=new Map();this.cornerPushActors=new Set(); this.archivedDiagnostics = [];this.archivedDiagnosticKeys=new Set(); this.pendingPauses = []; this.pause = null; this.superPause = null;
    this.commandBuffers = new Map(); this.presentationEvents = [];this.eventEntities=[];
    this.pendingCombatEffects=[];this.activeActor=null;this.contactPhase=false;
    this.inputBuffers=new Map();this.inputProfiles=new Map();if(this.manageInputs)for(const actor of this._entities){if(!this.inputProfiles.has(actor.character))this.inputProfiles.set(actor.character,characterCommands(actor.character));this.inputBuffers.set(actor,new CommandBuffer(this.inputProfiles.get(actor.character)));}
    this.events = [];
    this.cpus=new Map();
    for(const actor of this._entities)if(actor.aiLevel){const parsed=characterCommands(actor.character);this.cpus.set(actor,new CpuController(parsed,{level:actor.aiLevel,authoredAI:authoredAIProgram(actor.program),nativeAI:nativeCnsAIActivationVariable(actor.program)!==null,seed:0x6d2b79f5^(actor.id*0x9e3779b9)^(this.roundFlow?.roundNo||1)}));for(const issue of parsed.diagnostics)actor.diagnostic('command',issue.message,{source:actor.character.def.files.cmd,line:issue.line});}
    this.ticks = prior?.ticks||0;
    this.winner = null;
    if(prior){
      this.archiveDiagnostics(prior.diagnostics);
      for(const [i,fighter]of[this.player,this.opponent].entries()){
        const old=prior.players[i];fighter.power=old.power;fighter.victoryQuoteIndex=old.victoryQuoteIndex;
        const ints=Math.max(0,Math.min(60,Math.trunc(fighter.program.constants.get('data.intpersistindex')??60))),floats=Math.max(0,Math.min(40,Math.trunc(fighter.program.constants.get('data.floatpersistindex')??40)));
        fighter.vars.set(old.vars.subarray(ints),ints);fighter.fvars.set(old.fvars.subarray(floats),floats);
      }
    }
    this.syncEnvironment();
    if(this.initialize)for(const fighter of this._entities){
      if(fighter.program.states.has(5900)){
        fighter._initializing=true;
        fighter.options.skipIntro=this.skipIntro;
        fighter.changeState(5900);
      }else if(this.roundFlow&&!this.skipIntro){
        // Do not skip an authored intro just because StateDef 5900 is absent.
        const intro=fighter.program.states.has(190)?190:fighter.program.states.has(191)?191:null;
        if(intro!==null)fighter.changeState(intro,0,fighter);
      }
    }
    return this;
  }

  get diagnostics() {
    const diagnostics = [...this.archivedDiagnostics,...(this.stage?.diagnostics||[]),...this.entities.flatMap(p=>p.diagnostics || []),...this.orphanEffectOwners.flatMap(p=>p.diagnostics||[]),...this.projectiles.flatMap(p=>p.diagnostics || []),...[...(this.cpus||new Map())].flatMap(([actor,cpu])=>cpu.buffer.diagnostics.map(issue=>({...issue,source:actor.character.def.files.cmd})))];
    const seen = new Set();
    return diagnostics.filter(item => {
      const key = typeof item === 'string' ? item : JSON.stringify(item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  get entities() { return this._entities.filter(p=>!p.destroyed); }
  get view(){return this.cameraRuntime.view();}
  get matchOver(){return this.roundFlow?.matchOver||false;}
  syncEnvironment(){for(const actor of this._entities||[]){
    actor.cameraPos=this.cameraRuntime.camera;actor.cameraZoom=this.cameraRuntime.camera.zoom;
    if(this.roundFlow){actor.roundState=this.roundFlow.roundState;actor.roundNo=this.roundFlow.roundNo;actor.roundsExisted=this.roundFlow.roundsExisted;}
  }}
  findPlayer(id) { return this.entities.find(p=>p.id === id); }
  spawnHelper(owner,spec) {
    this.helperStats.attempted++;
    const active=this.entities.filter(p=>p.parent).length;
    if (active >= this.maxHelpers) {
      this.helperStats.rejected++;
      owner.diagnostic('resource-limit',`Helper limit (${this.maxHelpers}) reached.`);
      return null;
    }
    const helper = owner.createHelper(spec,{id:this.nextEntityId++});
    if (!helper.destroyed) {
      this._entities.push(helper);
      this.helperStats.created++;
      this.helperStats.peak=Math.max(this.helperStats.peak,active+1);
      if(helper.keyCtrl)this.helperCommands.set(helper,new CommandBuffer(characterCommands(helper.root.character)));
      this.syncEnvironment();
    }else{
      this.helperStats.rejected++;
      if(helper.diagnostics.some(d=>d.type==='missing-state'))this.helperStats.missingState++;
      this.archiveDiagnostics(helper.diagnostics);
    }
    return helper;
  }
  spawnProjectile(owner,spec) {
    if (this.projectiles.length >= this.maxProjectiles) { owner.diagnostic('resource-limit',`Projectile limit (${this.maxProjectiles}) reached.`); return null; }
    const projectile = new ProjectileRuntime(owner,spec,{id:this.nextEntityId++});
    if(projectile.removed){this.archiveDiagnostics(projectile.diagnostics);return projectile;}
    const afterimage=Object.fromEntries(Object.entries(spec).filter(([k])=>k.startsWith('afterimage.')).map(([k,v])=>[k.slice(11),v]));
    if(Object.keys(afterimage).length)this.presentationEvents.push({...afterimage,type:'afterimage',entity:projectile});
    this.projectiles.push(projectile); return projectile;
  }
  retireEffects(actor,{removeExplods=false}={}){
    if(actor._effectsDetached)return;actor._effectsDetached=true;
    if(removeExplods){actor.explods=[];actor.drawExplods=[];}
    else{actor.drawExplods=[];if(actor.explods.length){for(const effect of actor.explods)effect.orphaned=true;this.orphanEffectOwners.push(actor);}}
    for(const owner of new Set([...this._entities,...this.orphanEffectOwners])){
      if(owner.bound?.target===actor)owner.bound=null;unbindExplods(owner,actor);
    }
  }
  destroyHelper(actor,{recursive=false,removeExplods=false}={}){
    const victims=[actor];if(recursive)for(const entity of this._entities){let parent=entity.parent,depth=0;while(parent&&depth++<256){if(parent===actor){victims.push(entity);break;}parent=parent.parent;}}
    for(const victim of victims)victim.destroyed=true;
    for(const victim of victims)this.retireEffects(victim,{removeExplods});
  }
  requestPause(owner,spec) {
    const time = Math.max(0,Math.trunc(spec.time)); if (!Number.isFinite(time) || time > 360000) { owner.diagnostic('resource-limit','Pause time must be between 0 and 360000 ticks.'); return; }
    const pause = {...spec,owner,time,remaining:time,elapsed:0,moved:new Map(),movetime:Math.max(0,Math.min(time,spec.movetime || 0)),endcmdbuftime:Math.max(0,Math.min(time,spec.endcmdbuftime || 0))};
    this.pendingPauses.push(pause);
    if (spec.type === 'superpause') {
      owner.power = Math.max(0,Math.min(owner.maxPower,owner.power+(spec.poweradd || 0)));
      this.presentationEvents.push({...pause,type:'superpause'});
    }
  }
  isFrozen(actor) {
    const pause = this.superPause?.remaining > 0 ? this.superPause : this.pause?.remaining > 0 ? this.pause : null;
    if (!pause) return false;
    const allowance = actor === pause.owner ? pause.movetime : pause.type === 'superpause' ? actor.superMoveTime || 0 : actor.pauseMoveTime || 0;
    return actor.isProjectile?allowance<=0:(pause.moved.get(actor)||0)>=allowance;
  }
  isSuperUnhittable(actor) { return !!(this.superPause?.remaining > 0 && this.superPause.owner === actor && this.superPause.unhittable !== 0); }
  advancePause() {
    const active = this.superPause?.remaining > 0 ? this.superPause : this.pause?.remaining > 0 ? this.pause : null;
    const restore=pause=>{for(const [target,{before,applied}]of pause?.defence||[])if(target.defenceMultiplier===applied)target.defenceMultiplier=before;};
    if (active) {
      for(const actor of [...this.entities,...this.projectiles])if(!this.isFrozen(actor)&&!actor._hitPausedThisTick)active.moved.set(actor,(active.moved.get(actor)||0)+1);
      active.remaining--; active.elapsed++;if(!active.remaining)restore(active);
    }
    for (const pause of this.pendingPauses) {
      const key=pause.type === 'superpause'?'superPause':'pause';restore(this[key]);this[key]=pause;
      if(key==='superPause'&&pause.remaining>0){
        const factor=pause.p2defmul>0?pause.p2defmul:this.combatRules.superTargetDefence||1.5;pause.defence=new Map();
        for(const target of pause.owner.targets){const before=target.defenceMultiplier,applied=before/factor;pause.defence.set(target,{before,applied});target.defenceMultiplier=applied;}
      }
    }
    this.pendingPauses = [];
  }

  tick(commands = new Set(), opponentCommands = new Set(),{playerInput=null,opponentInput=null}={}) {
    if(this.orderedPhases){for(const effect of this.pendingCombatEffects){const{defender,attacker,damage,minimum,get,give}=effect;defender.life=Math.max(minimum,Math.min(defender.maxLife,defender.life-damage));if(attacker){attacker.power=Math.max(0,Math.min(attacker.maxPower,attacker.power+get));defender.power=Math.max(0,Math.min(defender.maxPower,defender.power+give));}}this.pendingCombatEffects=[];for(const actor of this._entities)actor._projectedLife=undefined;}
    this.events = []; this.presentationEvents = [];
    commands = commands instanceof Set ? commands : new Set(commands);
    opponentCommands = opponentCommands instanceof Set ? opponentCommands : new Set(opponentCommands);
    const backgroundPaused=!!(this.superPause?.remaining>0||this.pause?.remaining>0&&this.pause.pausebg!==0);
    const globallyPaused=!!(this.superPause?.remaining>0||this.pause?.remaining>0);
    const effectPause=this.pause?.remaining>0?this.pause:null,effectSuperPause=this.superPause?.remaining>0?this.superPause:null;
    this.syncEnvironment();
    const roundStartHeld=fightStartLocked(this.roundFlow);
    // Input-gating alone is insufficient: imported CNS and AI controllers
    // can advance or attack without keys. Keep all fighter states idle here.
    if(!roundStartHeld&&this._benchmarkStartHeld){
      this._benchmarkStartHeld=false;
      for(const root of [this.player,this.opponent])
        if(root.stateNo===0 && root.program.states.get(0)?.values?.ctrl===undefined)
          root.ctrl=1;
      this.commandBuffers.clear();
    }
    // R8-only recovery for legacy CPU actors stranded in a neutral idle
    // state after the benchmark's synthetic round-start lock. Unlike real
    // authored cutscenes, StateDef 0 normally has no CtrlSet and expects
    // control to be supplied by the transition into that state.
    // Do not touch humans, non-idle states, authored explicit control locks,
    // or matches without this R8 timing rule. Report every recovery because
    // it is a compatibility fallback, not a MUGEN 1.1 parity claim.
    if(this.roundFlow?.rules?.fightStartLockTicks > 0 &&
        this.roundFlow.roundState===2 && !roundStartHeld){
      for(const root of [this.player,this.opponent]){
        if(root.aiLevel<=0||root.stateNo!==0||root.ctrl||root.moveType!=='I'||
            root.stateType!=='S'||root._initializing||root.hitPauseTime>0||
            root.stateOwner!==root){
          root._r8IdleControlWait=0;
          continue;
        }
        const idle=root.program.states.get(0);
        const authoredLock=idle?.values?.ctrl !== undefined ||
          (idle?.controllers||[]).some(s=>s.type==='ctrlset' &&
            /^0(?:\.0+)?$/.test(String(s.values?.value||'').trim()));
        if(authoredLock){
          root._r8IdleControlWait=0;
          continue;
        }
        root._r8IdleControlWait=(root._r8IdleControlWait||0)+1;
        if(root._r8IdleControlWait>=30){
          root._r8IdleControlWait=0;
          root.ctrl=1;
          root.r8IdleControlRecoveries=(root.r8IdleControlRecoveries||0)+1;
          root.diagnostic('r8-control-recovery',
            'Idle CPU control restored after 30 active frames in StateDef 0; ' +
            'verify native MUGEN 1.1 behavior before production.');
        }
      }
    }
    // Pre-fight StateDef -2 scripts may reset the AI variable during intros.
    // Reactivate CPU-owned legacy AI for every fighting tick, including the
    // first frame after a round transition and after authored command input.
    if(!roundStartHeld&&(!this.roundFlow || this.roundFlow.roundState===2))
      for(const actor of [this.player,this.opponent])
        if(actor.aiLevel>0 && actor.legacyAIFlag!==undefined)
          if(actor.vars[actor.legacyAIFlag]<=0)actor.vars[actor.legacyAIFlag]=actor.legacyAIValue||1;
    if(this.cpus.has(this.player))commands=this.cpus.get(this.player).tick(this.player,this.opponent,{paused:this.isFrozen(this.player)||this.player.hitPauseTime>0,enabled:!roundStartHeld&&(!this.roundFlow||this.roundFlow.roundState===2)});
    if(this.cpus.has(this.opponent))opponentCommands=this.cpus.get(this.opponent).tick(this.opponent,this.player,{paused:this.isFrozen(this.opponent)||this.opponent.hitPauseTime>0,enabled:!roundStartHeld&&(!this.roundFlow||this.roundFlow.roundState===2)});
    if(this.cpus.has(this.player))playerInput=this.cpus.get(this.player).raw;
    if(this.cpus.has(this.opponent))opponentInput=this.cpus.get(this.opponent).raw;
    if(roundStartHeld){
      commands=new Set();opponentCommands=new Set();
      playerInput=new Set();opponentInput=new Set();
      this.commandBuffers.clear();
    }
    const paused = new Set([...this.entities,...this.projectiles].filter(fighter => fighter.hitPauseTime > 0));
    const frozen = new Set();
    // Newly spawned helpers join later in this pass, with a bounded entity count.
    const updatedActors=[];
    for (let index=0;index<this._entities.length;index++) {
      const fighter = this._entities[index]; if (fighter.destroyed) continue;
      updatedActors.push(fighter);
      if(roundStartHeld){
        // Do not run AI/CNS/ZSS/physics or consume queued commands while
        // waiting for the banner plus the post-banner one-second delay.
        fighter.events=[];
        fighter.commands=new Set();
        fighter.asserted.clear();
        fighter.pendingAssertedInputs?.clear();
        fighter.vel.x=0;fighter.vel.y=0;
        if(!fighter.parent){
          // R8 already skips AI, CNS, movement and physical inputs during
          // the hold. Do not mutate Ctrl: older imported common1.cns idle
          // states have no Ctrl=1 to recover from a synthetic control loss.
          if(fighter.currentFrame)fighter.advanceAnimation();
          fighter.collisionFrame=fighter.currentFrame;
          fighter.collisionAnimationOwner=fighter.animationOwner;
        }
        fighter.time++;fighter.gameTime++;
        continue;
      }
      let input = fighter.root === this.player ? commands : opponentCommands;
      let physical=fighter.root===this.player?playerInput:opponentInput;
      if(this.manageInputs&&fighter.keyCtrl){
        physical=new Set(physical||[]);for(const flag of fighter.pendingAssertedInputs){physical.add(flag==='F'?(fighter.facing===1?'R':'L'):flag==='B'?(fighter.facing===1?'L':'R'):flag);}if(!this.isFrozen(fighter))fighter.pendingAssertedInputs.clear();
        if(!this.inputBuffers.has(fighter))this.inputBuffers.set(fighter,new CommandBuffer(this.inputProfiles.get(fighter.root.character)));
        input=this.inputBuffers.get(fighter).update(physical,fighter.facing);
      }else if(fighter.parent&&fighter.keyCtrl&&physical!==null)input=this.helperCommands.get(fighter).update(physical,fighter.facing);
      if (!fighter.keyCtrl||this.roundFlow&&this.roundFlow.roundState!==2) input = new Set();
      const other = fighter.teamSide === this.player.teamSide ? this.opponent : this.player;
      const stopped = this.isFrozen(fighter);fighter._hitPausedThisTick=fighter.hitPauseTime>0;
      if(!stopped&&!fighter._hitPausedThisTick)fighter._projectileContactShield=false;
      if (stopped) {
        frozen.add(fighter);
        const pause = this.superPause?.remaining > 0 ? this.superPause : this.pause;
        if (pause && pause.remaining <= pause.endcmdbuftime) {
          if (!this.commandBuffers.has(fighter)) this.commandBuffers.set(fighter,new Set());
          for (const command of input) this.commandBuffers.get(fighter).add(command);
        }
      } else if (this.commandBuffers.has(fighter)) { input = new Set([...input,...this.commandBuffers.get(fighter)]); this.commandBuffers.delete(fighter); }
      this.activeActor=fighter;try{fighter.tick({commands:input,opponent:other,paused:stopped,input:fighter.keyCtrl?physical:new Set()});}finally{this.activeActor=null;}
    }
    for (const projectile of this.projectiles) { const stopped = this.isFrozen(projectile); if (stopped) frozen.add(projectile); projectile._hitPausedThisTick=projectile.hitPauseTime>0;projectile.tick({paused:stopped}); }
    if(this.stage)for(const fighter of this.entities)if(fighter.screenBound!==false)fighter.pos.x=Math.max(this.leftBound,Math.min(this.rightBound,fighter.pos.x));
    if(this.stage||this.cameraFollow)this.cameraRuntime.updateCamera(this.entities,{advance:!globallyPaused});this.syncEnvironment();
    if(this.stage)this.stage.tick({paused:backgroundPaused});
    if(this.orderedPhases)this.advanceCornerPush(frozen);
    const pushed=this.constrainPositions();
    if(pushed){if(this.stage||this.cameraFollow)this.cameraRuntime.updateCamera(this.entities,{advance:false});this.syncEnvironment();this.constrainPositions({push:false});}
    const fighters = this.entities;
    for(const defender of fighters)if(defender.moveType!=='H'&&defender.stateType!=='L')for(const records of this.juggles.values())records.delete(defender.id);
    const projectiles = this.projectiles.filter(p=>!p.removed && !p.removing);
    // Cache projectile hurt boxes for this collision pass. Resolve overlapping
    // cancellation candidates by distance, then stable creation ID.
    const clashBoxes=projectiles.map(p=>transformedBoxes(p,'clsn2'));
    const clashBounds=this._projectileClashBounds;
    this.projectileClashStats.pairsVisited=0;
    this.projectileClashStats.narrowphaseCalls=0;
    for(let i=0;i<clashBoxes.length;i++){
      const o=i*4,boxes=clashBoxes[i];
      let x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;
      for(const box of boxes){
        if(box[0]<x0)x0=box[0];if(box[1]<y0)y0=box[1];
        if(box[2]>x1)x1=box[2];if(box[3]>y1)y1=box[3];
      }
      clashBounds[o]=x0;clashBounds[o+1]=y0;
      clashBounds[o+2]=x1;clashBounds[o+3]=y1;
    }
    // Experimental Kotlin/Wasm path: hand off pair generation using only
    // primitive data. Keep both the JS narrowphase and deterministic clash
    // resolution order unchanged. Feature disabled unless explicitly injected.
    const combatKernel=this.kotlinCombatKernel;
    let wasmPairs=-1,wasmCursor=0;
    if(combatKernel){
      try{
        combatKernel.clear();
        for(let i=0;i<projectiles.length;i++){
          const o=i*4,p=projectiles[i];
          combatKernel.add(clashBounds[o],clashBounds[o+1],clashBounds[o+2],
            clashBounds[o+3],p.teamSide,frozen.has(p),p.removing);
        }
        wasmPairs=combatKernel.collect(this.orderedPhases);
        if(!Number.isInteger(wasmPairs)||wasmPairs<0)throw Error('Invalid projectile pair count');
        this.projectileClashStats.pairsVisited=combatKernel.examinedPairs();
      }catch(error){
        // Native fallback is essential: a missing/invalid Wasm module must
        // never prevent a match from progressing.
        this.kotlinCombatKernel=null;
        try{combatKernel.dispose?.();}catch{/* Preserve JS fallback */}
        this.player.diagnostic('kotlin-wasm-fallback',String(error?.message||error));
        wasmPairs=-1;
        this.projectileClashStats.pairsVisited=0;
      }
    }
    for(let i=0;i<projectiles.length;i++){
      const a=projectiles[i];
      if(a.removing||!clashBoxes[i].length){
        if(wasmPairs>=0)while(wasmCursor<wasmPairs&&combatKernel.left(wasmCursor)===i)wasmCursor++;
        continue;
      }
      const candidates=[];
      if(wasmPairs>=0){
        // Kotlin emits pairs in the same (i,j) creation order as the original
        // nested loops. Recheck mutable removal, because prior clashes can
        // retire shots after the primitive candidate list was built.
        while(wasmCursor<wasmPairs&&combatKernel.left(wasmCursor)===i){
          const j=combatKernel.right(wasmCursor++),b=projectiles[j];
          if(!b||b.removing||a.teamSide===b.teamSide||frozen.has(a)&&frozen.has(b))continue;
          this.projectileClashStats.narrowphaseCalls++;
          if(contactArea(clashBoxes[i],clashBoxes[j],this.orderedPhases))candidates.push(b);
        }
      }else for(let j=i+1;j<projectiles.length;j++){
        const b=projectiles[j];
        if(a.teamSide===b.teamSide||b.removing||frozen.has(a)&&frozen.has(b))continue;
        this.projectileClashStats.pairsVisited++;
        const ai=i*4,bj=j*4,inclusive=this.orderedPhases;
        const overlapX=inclusive?clashBounds[ai]<=clashBounds[bj+2]&&clashBounds[ai+2]>=clashBounds[bj]:clashBounds[ai]<clashBounds[bj+2]&&clashBounds[ai+2]>clashBounds[bj];
        if(!overlapX)continue;
        const overlapY=inclusive?clashBounds[ai+1]<=clashBounds[bj+3]&&clashBounds[ai+3]>=clashBounds[bj+1]:clashBounds[ai+1]<clashBounds[bj+3]&&clashBounds[ai+3]>clashBounds[bj+1];
        if(!overlapY)continue;
        this.projectileClashStats.narrowphaseCalls++;
        if(!contactArea(clashBoxes[i],clashBoxes[j],inclusive))continue;
        candidates.push(b);
      }
      const distance=p=>(p.pos.x-a.pos.x)**2+(p.pos.y-a.pos.y)**2;
      candidates.sort((b,c)=>distance(b)-distance(c)||b.id-c.id);
      for(const b of candidates){if(a.removing)break;if(!b.removing){a.clash(b);b.clash(a);}}
    }
    // The proximity flag belongs to collision detection. CNS reads the preceding
    // collision pass, so creation/destruction order cannot change another CNS pass.
    const guardProjectiles=this.orderedPhases?this.projectiles.filter(p=>!p.removed||p.drawVisible):projectiles;
    const threats=[...fighters,...guardProjectiles];
    for(const fighter of fighters)fighter.inGuardDistance=inGuardDistance(fighter,threats);
    const contacts = [];
    const reversed = new Set();
    for (const defender of fighters) {
      if (!defender.reversalDef || frozen.has(defender) || paused.has(defender) || this.roundFlow&&this.roundFlow.roundState!==2) continue;
      for (const attacker of fighters) {
        const reversal=defender.reversalDef;
        if (!reversal) break;
        const hit=attacker.hitDef;
        if (!hit || attacker === defender || attacker.teamSide === defender.teamSide || paused.has(attacker) || reversed.has(attacker)) continue;
        if (!defender.attributeMatches(reversal['reversal.attr'],hit.attr) || this.usedHits.get(defender)?.get(attacker.id) === reversal.serial) continue;
        const overlap = contactArea(transformedBoxes(defender),transformedBoxes(attacker),this.orderedPhases); if (!overlap) continue;
        const result = attacker.receiveHit(reversal,defender); if (result.rejected) continue;
        this.applyCornerPush(defender,attacker,result.cornerPush,reversal.coordinateScale);
        attacker.moveContact=attacker.moveHit=attacker.moveGuarded=0;attacker.moveReversed = 1; attacker.hitDef = null; reversed.add(attacker);
        if (!this.usedHits.has(defender)) this.usedHits.set(defender,new Map()); this.usedHits.get(defender).set(attacker.id,reversal.serial);
        this.events.push({type:'reversal',attacker:defender,defender:attacker,hitDef:reversal,damage:result.damage,guarded:false,x:(overlap[0]+overlap[2])/2,y:(overlap[1]+overlap[3])/2,tick:this.ticks});
      }
    }
    // Geometry is immutable while candidates are collected. Keep this cache
    // local to this pass: state changes, facing and positions may differ next tick.
    const hurtGeometry=fighters.length>2?new Map():null;
    for (const attacker of [...fighters,...projectiles]) {
      if (this.winner || this.roundFlow&&this.roundFlow.roundState!==2 || attacker.destroyed || frozen.has(attacker) || reversed.has(attacker) || paused.has(attacker) || attacker.life<=0 || attacker.moveType!=='A') continue;
      const hit=attacker.hitDef;
      if (!hit || !/^[SCA]\s*,\s*[NSH][ATP]$/i.test(String(hit.attr??'').trim())) continue;
      const hitFlags=flagText(hit.hitFlag??hit.hitflag??'MAF');
      if(!/[HLAMFD]/.test(hitFlags)||hitFlags.includes('+')&&hitFlags.includes('-'))continue;
      const team=flagText(hit.affectteam??'E'),activation=hit.serial??hit,used=this.usedHits.get(attacker);
      let attackGeometry;
      for (const defender of [...fighters].sort((a,b)=>Math.abs(a.pos.x-attacker.pos.x)-Math.abs(b.pos.x-attacker.pos.x))) {
        if (attacker===defender || attacker.isProjectile&&attacker.owner===defender || defender.life<=0 || paused.has(defender)) continue;
        const friend=attacker.teamSide===defender.teamSide;
        if (team==='E'&&friend || team==='F'&&!friend) continue;
        if(!allowsState(hitFlags,defender))continue;
        if (attacker instanceof ProjectileRuntime?!attacker.canHit(defender,this.ticks):used?.get(defender.id)===activation) continue;
        attackGeometry??=transformedBoxes(attacker);
        if (!attackGeometry.length) break;
        let hurt=hurtGeometry?.get(defender);
        if (!hurt) { hurt=transformedBoxes(defender,'clsn2');hurtGeometry?.set(defender,hurt); }
        const overlap=contactArea(attackGeometry,hurt,this.orderedPhases);
        if (!overlap) continue;
        // Expensive pure eligibility checks only matter for overlapping boxes.
        // Hit flags are normalized once per immutable attack in this pass.
        if (typeof defender.canBeHit==='function'&&!defender.canBeHit(hit,attacker)) continue;
        if (String(hit[defender.stateType==='A'?'air.type':'ground.type']??hit['ground.type']??'high').toLowerCase()!=='none'&&!this.canJuggle(attacker,defender,hit)) continue;
        const guardCommands=this.manageInputs?defender.commands:defender.parent?defender.commands:defender===this.player?commands:opponentCommands;
        contacts.push({attacker,defender,hit,activation,overlap,wasFalling:defender.stateType==='L'||defender.stateType==='A'&&defender.moveType==='H'&&!!defender.getHitVars?.fall,guarded:canGuard(hit,attacker,defender,guardCommands)});
      }
    }
    // Resolve from a shared snapshot so a simultaneous normal hit can trade.
    const accepted = contacts.filter(contact => {
      const reverse = contacts.find(c=>c.attacker === contact.defender && c.defender === contact.attacker);
      return !reverse || chooseContacts([contact,reverse]).includes(contact);
    });
    const contactedProjectiles=new Set();
    for (const contact of accepted) {
      if (contact.attacker instanceof ProjectileRuntime && (contact.defender._projectileContactShield||!contact.attacker.canHit())) continue;
      let result;this.contactPhase=true;try{result=contact.defender.receiveHit(contact.hit, contact.attacker, {guarded: contact.guarded});}finally{this.contactPhase=false;}
      if (result?.rejected) continue;
      this.applyCornerPush(contact.attacker,contact.defender,result.cornerPush,contact.hit.coordinateScale);
      if(!contact.guarded&&!result.typeNone)this.recordJuggle(contact.attacker,contact.defender,contact.hit,{wasFalling:contact.wasFalling});
      if (!this.usedHits.has(contact.attacker)) this.usedHits.set(contact.attacker,new Map());
      this.usedHits.get(contact.attacker).set(contact.defender.id,contact.activation);
      if (contact.attacker instanceof ProjectileRuntime) {contact.defender._projectileContactShield=true;contact.attacker.onContact({guarded:contact.guarded,defer:true});contactedProjectiles.add(contact.attacker);}
      this.events.push({type: contact.guarded ? 'guard' : 'hit', attacker: contact.attacker, defender: contact.defender, hitDef: contact.hit, damage: result?.damage ?? 0, guarded: contact.guarded,typeNone:!!result.typeNone, x: (contact.overlap[0] + contact.overlap[2]) / 2, y: (contact.overlap[1] + contact.overlap[3]) / 2, tick: this.ticks});
    }
    for(const projectile of contactedProjectiles)projectile.finishContacts();
    for(const projectile of this.projectiles)projectile.finishMovementAllowance({paused:frozen.has(projectile)});
    for(const fighter of this.entities)fighter.updateExplods({hitPaused:paused.has(fighter),pause:effectPause,superPause:effectSuperPause});
    for(const actor of this._entities)if(actor.destroyed&&!actor._effectsDetached)this.retireEffects(actor);
    for(const owner of this.orphanEffectOwners)owner.updateExplods({pause:effectPause,superPause:effectSuperPause});
    this.orphanEffectOwners=this.orphanEffectOwners.filter(owner=>owner.explods.length||owner.drawExplods.length);
    this.drawProjectiles=this.projectiles.filter(projectile=>projectile.drawVisible);
    this.eventEntities=[...updatedActors,...this.projectiles];this.cleanupEntities(); this.advancePause(); this.ticks++;
    const asserted=flag=>this.entities.some(p=>p.asserted.has(flag));
    if (!this.roundFlow&&!asserted('noko')&&(this.player.life<=0||this.opponent.life<=0)) this.winner = this.player.life <= 0 && this.opponent.life <= 0 ? 'draw' : this.player.life <= 0 ? 'opponent' : 'player';
    if(this.roundFlow){
      const flow=this.roundFlow,players=[this.player,this.opponent];
      const intro=asserted('intro');
      const inIntro=p=>p.stateNo===5900||(p.stateNo>=190&&p.stateNo<=199)||p.asserted.has('intro');
      // Old common1.cns intros can deliberately hold/restart their animation
      // while RoundState=0, then play it when the round announcer starts.
      // Wait while any intro makes progress; release only when every active
      // intro is parked on the same first animation tick for one second.
      const waitingForAnnouncer=flow.roundState===0&&flow.phaseTime>=60
        &&players.every(p=>!inIntro(p)||
          (p.stateNo>=190&&p.stateNo<=199&&p.animationTime===0));
      const introPending=players.some(inIntro)&&!waitingForAnnouncer;
      const winningActor=flow.roundWinner==='player'?this.player:flow.roundWinner==='opponent'?this.opponent:null;
      const victoryPending=!!winningActor&&winningActor.stateNo>=180&&winningActor.stateNo<=189
        &&!winningActor.animationEnded;
      const events=flow.step({players,paused:globallyPaused,intro,introPending,victoryPending,
        roundNotOver:asserted('roundnotover'),timerFreeze:asserted('timerfreeze'),
        noKO:players.map(()=>asserted('noko'))});
      this.syncEnvironment();
      for(const event of events){
        if(event.type==='round'&&flow.rules.fightStartLockTicks>0){
          this._benchmarkStartHeld=true;
          for(const actor of [this.player,this.opponent]){
            // Standard MUGEN State 0 / AIR action 0 is the fighter's idle pose.
            if(actor.program.states.has(0))actor.changeState(0,1,actor);
            if(actor.animations.has(0))actor.changeAnimation(0);
            // StateDef 0 may explicitly request Ctrl=0; honor that rather
            // than overriding authored CNS. The lock itself prevents all
            // execution and movement until the 102-tick hold expires.
            actor.vel.x=0;actor.vel.y=0;actor.pos.y=0;
            actor.asserted.clear();
          }
          this.commandBuffers.clear();
        }
        if(event.type==='fight'&&!flow.rules.fightStartLockTicks)for(const p of players)if(p.stateNo===0)p.ctrl=1;
        if(event.type==='round-over')this.winner=event.winner;
        if(event.type==='result')for(const p of players){
          const won=event.winner===(p===this.player?'player':'opponent');
          // Dispatch to the fighter's own win/timeout state and any chained pose.
          const state=won?180:event.reason==='time'?170:null;
          if(state!==null&&p.program.states.has(state))p.changeState(state,0,p);
        }
        if(event.type==='next-round')this.reset({preserveMatch:true});
        this.presentationEvents.push({...event,type:'round',event:event.type});
      }
      if(flow.matchOver&&flow.roundWinner!=='draw')this[flow.roundWinner]?.selectVictoryQuote();
    }
    return this.events;
  }

  cleanupEntities() {
    const dead = this._entities.filter(p=>p.destroyed);
    this.helperStats.destroyed+=dead.filter(p=>p.parent).length;
    for(const actor of dead)if(!actor._effectsDetached)this.retireEffects(actor);
    for (const actor of [...dead,...this.projectiles.filter(p=>p.removed)]) { this.archiveDiagnostics(actor.diagnostics); this.usedHits.delete(actor);this.cornerPushActors.delete(actor); this.commandBuffers.delete(actor);this.inputBuffers.delete(actor);this.helperCommands.delete(actor);this.juggles.delete(actor);for(const records of this.juggles.values())records.delete(actor.id); }
    this._entities = this._entities.filter(p=>!p.destroyed);
    this.projectiles = this.projectiles.filter(p=>!p.removed);
    for (const fighter of this._entities) {
      fighter.helpers = fighter.helpers.filter(h=>!h.destroyed);
      fighter.targets = fighter.targets.filter(t=>!t.destroyed&&(!this.orderedPhases||t.moveType==='H'));
      for(const id of fighter.targetHitIds.keys())if(!fighter.targets.some(t=>t.id===id))fighter.targetHitIds.delete(id);
      if (fighter.bound?.target.destroyed) fighter.bound = null;
    }
    this.renderEntities=[...this._entities,...this.orphanEffectOwners].sort((a,b)=>a.id-b.id);
  }

  archiveDiagnostics(items){for(const item of items){const key=JSON.stringify(item);if(!this.archivedDiagnosticKeys.has(key)){this.archivedDiagnosticKeys.add(key);this.archivedDiagnostics.push(item);}}}

  canJuggle(attacker,defender,hit){
    if((attacker.isProjectile?attacker.creator:attacker).asserted?.has('nojugglecheck'))return true;
    const falling=defender.stateType==='L'||defender.stateType==='A'&&defender.moveType==='H'&&defender.getHitVars?.fall;
    if(!falling)return true;
    const owner=attacker.isProjectile?attacker.owner:attacker,record=this.juggles.get(owner)?.get(defender.id),remaining=record?.remaining??owner.constant('data.airjuggle');
    const cost=attacker.isProjectile?hit['air.juggle']||0:record?.group===hit.juggleGroup?0:hit.juggleCost||0;
    return remaining>=cost;
  }
  recordJuggle(attacker,defender,hit,{wasFalling=false}={}){
    if(!wasFalling&&!defender.getHitVars?.fall&&defender.stateType!=='L')return;
    const owner=attacker.isProjectile?attacker.owner:attacker;if(!this.juggles.has(owner))this.juggles.set(owner,new Map());
    const records=this.juggles.get(owner),old=records.get(defender.id),skip=(attacker.isProjectile?attacker.creator:attacker).asserted?.has('nojugglecheck'),cost=skip?0:attacker.isProjectile?hit['air.juggle']||0:old?.group===hit.juggleGroup?0:hit.juggleCost||0;
    records.set(defender.id,{remaining:Math.max(0,(old?.remaining??owner.constant('data.airjuggle'))-cost),group:hit.juggleGroup});
  }

  bodyWidth(fighter,direction,edge=false){
      return bodyWidthWorld(fighter,direction,{edge});
  }
  horizontalLimits(fighter){
      const edge=direction=>finite(fighter.width?.edge?.[fighter.facing===direction?0:1]) * fighter.coordinateScale;
      const view=this.view;
      let min=this.orderedPhases?Math.max(this.leftBound,view.left+(this.stage?.definition.screenLeft||0)+edge(-1)):
        this.stage?Math.max(this.leftBound,view.left+Math.max(this.stage.definition.screenLeft,this.bodyWidth(fighter,-1,true))):this.leftBound+this.bodyWidth(fighter,-1,true);
      let max=this.orderedPhases?Math.min(this.rightBound,view.right-(this.stage?.definition.screenRight||0)-edge(1)):
        this.stage?Math.min(this.rightBound,view.right-Math.max(this.stage.definition.screenRight,this.bodyWidth(fighter,1,true))):this.rightBound-this.bodyWidth(fighter,1,true);
      if (min > max) min = max = (this.leftBound + this.rightBound) / 2;
      return{min,max};
  }
  applyCornerPush(attacker,defender,velocity=0,scale=attacker.coordinateScale){
    if(attacker instanceof ProjectileRuntime)return;
    if(this.orderedPhases){
      const direction=defender.pos.x===attacker.pos.x?attacker.facing:Math.sign(defender.pos.x-attacker.pos.x);
      attacker.cornerPush=Math.fround(velocity*scale*direction);
      attacker.cornerPushTarget=attacker.cornerPush?defender:null;
      attacker.cornerPushSide=direction;
      if(attacker.cornerPush)this.cornerPushActors.add(attacker);else this.cornerPushActors.delete(attacker);
      return;
    }
    if(!velocity||defender.screenBound===false)return;
    const {min,max}=this.horizontalLimits(defender),direction=defender.pos.x===attacker.pos.x?attacker.facing:Math.sign(defender.pos.x-attacker.pos.x);
    if(direction>0?defender.pos.x<max-.01:defender.pos.x>min+.01)return;
    attacker.cornerPush=velocity*scale*direction;
  }
  advanceCornerPush(frozen){
    for(const attacker of this.cornerPushActors){
      if(!attacker.cornerPush||attacker.destroyed){this.cornerPushActors.delete(attacker);attacker.cornerPushTarget=null;continue;}
      if(frozen.has(attacker)||attacker._hitPausedThisTick)continue;
      const defender=attacker.cornerPushTarget;
      if(defender&&!defender.destroyed&&defender.screenBound!==false){
        const {min,max}=this.horizontalLimits(defender);
        if(attacker.cornerPushSide>0?defender.pos.x>=max:defender.pos.x<=min)
          attacker.pos.x=Math.fround(attacker.pos.x+attacker.cornerPush);
      }
      attacker.cornerPush=Math.fround(attacker.cornerPush*Math.fround(.7));
      if(Math.abs(attacker.cornerPush)<attacker.coordinateScale)attacker.cornerPush=0;
      if(!attacker.cornerPush){attacker.cornerPushTarget=null;this.cornerPushActors.delete(attacker);}
    }
  }
  constrainPositions({push=true}={}) {
    const fighters=this.entities,limits=new Map(fighters.map(p=>[p,this.horizontalLimits(p)]));
    const clamp=p=>{if(p.screenBound!==false){const {min,max}=limits.get(p);p.pos.x=Math.max(min,Math.min(max,p.pos.x));}};
    fighters.forEach(clamp);
    if(!this.pushboxes||!push)return false;
    let pushed=false;
    // Helpers opt in with PlayerPush. Native pushing requires both size-box and
    // Clsn2 overlap; being airborne or lying down alone does not disable it.
    const pushers=fighters.filter(p=>p.playerPush!==false).sort((a,b)=>a.id-b.id);
    for(let i=0;i<pushers.length;i++)for(let j=i+1;j<pushers.length;j++){
      const a=pushers[i],b=pushers[j];if(a.teamSide===b.teamSide)continue;
      const aTop=a.pos.y-constant(a,'size.height',60)*baseScale(a),bTop=b.pos.y-constant(b,'size.height',60)*baseScale(b);
      if(aTop>=b.pos.y||bTop>=a.pos.y||!contactArea(transformedBoxes(a,'clsn2'),transformedBoxes(b,'clsn2')))continue;
      const [left,right]=a.pos.x<=b.pos.x?[a,b]:[b,a];
      const leftWidth=this.bodyWidth(left,1),rightWidth=this.bodyWidth(right,-1);
      // Projected float32 edges may retain a tiny penetration after rounding
      // the first displacement. Recheck the reciprocal contact once, including
      // Clsn2: a wider ground body can already have separated its hurt boxes.
      for(let pass=0;pass<(this.orderedPhases?2:1);pass++){
        const leftEdge=left.pos.x+leftWidth,rightEdge=right.pos.x-rightWidth;
        const overlap=this.orderedPhases?Math.fround(Math.fround(leftEdge)-Math.fround(rightEdge)):left.pos.x+leftWidth-right.pos.x+rightWidth;
        if(overlap<=0||pass&&!contactArea(transformedBoxes(a,'clsn2'),transformedBoxes(b,'clsn2')))break;
        const leftAvailable=left.screenBound===false?Infinity:Math.max(0,left.pos.x-limits.get(left).min);
        const rightAvailable=right.screenBound===false?Infinity:Math.max(0,limits.get(right).max-right.pos.x);
        const leftTravel=Math.min(overlap/2,leftAvailable),rightTravel=Math.min(overlap-leftTravel,rightAvailable);
        const oldLeft=left.pos.x,oldRight=right.pos.x;
        left.pos.x-=Math.min(overlap-rightTravel,leftAvailable);right.pos.x+=rightTravel;
        if(this.orderedPhases){left.pos.x=Math.fround(left.pos.x);right.pos.x=Math.fround(right.pos.x);}
        clamp(left);clamp(right);pushed=true;
        if(left.pos.x===oldLeft&&right.pos.x===oldRight)break;
      }
    }
    return pushed;
  }
}
