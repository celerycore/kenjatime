import {test} from 'node:test';
import assert from 'node:assert/strict';
import {FighterRuntime,parseSections} from '../src/runtime.js';
import {TrainingMatch} from '../src/combat.js';
import {COMMON_STATES} from '../src/common.js';

const encode=text=>new TextEncoder().encode(text);
function character(script='',coord='320,240'){
  return {path:'r.def',def:{info:{localcoord:coord},files:{cns:'r.cns'}},files:{'r.cns':encode(`[Data]\nliedown.time=12\n[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nctrl=1\nanim=0\n[Statedef 700]\ntype=A\nmovetype=H\nphysics=N\nctrl=0\n${script}`)},animations:[{id:0,frames:[{group:0,number:0,x:0,y:0,ticks:-1}]}]};
}
function fighter(script='',options={}){return new FighterRuntime(character(script),{commonText:COMMON_STATES,...options});}
function execute(f,type,params){const c=parseSections(`[State Test]\ntype=${type}\n${params}`)[0];c.type=type.toLowerCase();f.execute(c);}
const hit=(extra={})=>({attr:'S,NA',id:11,damage:[10,0],groundVelocity:[-3,0],airVelocity:[-3,-4],groundHitTime:2,airHitTime:20,pauseTime:[0,3],fall:1,'fall.recovertime':2,p2stateno:700,p2getp1state:0,...extra});

test('fall recovery uses its own elapsed clock through hitshake and freezes in global pause',()=>{
  const f=fighter();f.receiveHit(hit(),null);assert.equal(f.evaluate('CanRecover'),0);assert.equal(f.hitTime,2);
  f.tick({paused:true});assert.equal(f.evaluate('gethitvar(fall.time)'),0);
  f.tick();assert.equal(f.evaluate('gethitvar(fall.time)'),1);assert.equal(f.hitTime,2);assert.equal(f.evaluate('CanRecover'),0);
  f.tick();assert.equal(f.evaluate('gethitvar(fall.time)'),2);assert.equal(f.evaluate('CanRecover'),1);assert.equal(f.hitTime,2);
  execute(f,'HitFallSet','value=0');assert.equal(f.evaluate('CanRecover'),0);
  execute(f,'HitFallSet','value=1');f.getHitVars['fall.recover']=0;assert.equal(f.evaluate('CanRecover'),0);
});

test('HitOver and GetHitVar(hittime) agree at the zero to minus-one boundary',()=>{
  const f=fighter();f.receiveHit(hit({fall:0,groundHitTime:1,pauseTime:[0,1]}),null);
  f.tick();assert.equal(f.hitTime,1);assert.equal(f.evaluate('HitOver'),0);
  f.tick();assert.equal(f.hitTime,0);assert.equal(f.evaluate('HitOver'),0);
  f.tick();assert.equal(f.hitTime,-1);assert.equal(f.evaluate('HitOver'),1);assert.equal(f.evaluate('gethitvar(hittime)<0'),1);
  f.tick();assert.equal(f.hitTime,-1);
});

test('GetHitVar exposes the received ID, actual posture type and combo hit count independently of chainID',()=>{
  const f=fighter(),a=fighter();f.receiveHit(hit({id:17,chainid:-1,'ground.type':'low',fall:0,pauseTime:[0,0]}),a);
  assert.equal(f.evaluate('gethitvar(hitid)'),17);assert.equal(f.evaluate('gethitvar(chainid)'),17);assert.equal(f.evaluate('gethitvar(type)'),2);assert.equal(f.evaluate('gethitvar(hitcount)'),1);
  f.receiveHit(hit({id:18,chainid:17,'air.type':'high',fall:0,pauseTime:[0,0]}),a);assert.equal(f.evaluate('gethitvar(hitcount)'),2);assert.equal(f.evaluate('gethitvar(type)'),1);
  execute(f,'SelfState','value=0');f.tick();assert.equal(f.evaluate('gethitvar(chainid)'),0);
  assert.equal(f.receiveHit(hit({chainid:18}),a).rejected,true);
  f.receiveHit(hit({id:19}),a);assert.equal(f.evaluate('gethitvar(hitcount)'),1);
});

test('ground impacts increment fallcount once per entry rather than counting falling hits',()=>{
  const f=fighter();f.receiveHit(hit({pauseTime:[0,0]}),null);assert.equal(f.evaluate('gethitvar(fallcount)'),0);
  f.changeState(5100);f.tick();assert.equal(f.evaluate('gethitvar(fallcount)'),1);
  f.tick();assert.equal(f.evaluate('gethitvar(fallcount)'),1);
  f.receiveHit(hit({pauseTime:[0,0]}),null);assert.equal(f.evaluate('gethitvar(fallcount)'),1);
  f.changeState(5100);f.tick();assert.equal(f.evaluate('gethitvar(fallcount)'),2);
});

test('liedown countdown forces get-up even without a scripted transition, but never revives a KO',()=>{
  const script='[Statedef 5110]\ntype=L\nmovetype=H\nphysics=N\nctrl=0\n[Statedef 5120]\ntype=S\nmovetype=I\nphysics=N\nctrl=1';
  const f=fighter(script);f.changeState(5110);f.getHitVars.recovertime=2;
  f.tick();assert.equal(f.stateNo,5110);assert.equal(f.evaluate('gethitvar(recovertime)'),1);
  f.tick();assert.equal(f.stateNo,5110);assert.equal(f.evaluate('gethitvar(recovertime)'),0);
  f.tick();assert.equal(f.stateNo,5120);
  f.changeState(5110);f.life=0;f.getHitVars.recovertime=0;f.tick();f.tick();assert.equal(f.stateNo,5110);
});

test('fresh raw inputs accelerate liedown recovery; held keys and global pause do not repeat presses',()=>{
  const f=fighter('[Statedef 5110]\ntype=L\nmovetype=H\nphysics=N\nctrl=0');f.changeState(5110);f.getHitVars.recovertime=100;
  f.tick({input:new Set(['x'])});const first=f.getHitVars.recovertime;assert.ok(first<99);
  f.tick({input:new Set(['x'])});assert.equal(f.getHitVars.recovertime,first-1);
  f.tick({paused:true,input:new Set(['y'])});assert.equal(f.getHitVars.recovertime,first-1);
  f.tick({input:new Set(['y'])});assert.equal(f.getHitVars.recovertime,first-2);
  f.tick({input:new Set()});const before=f.getHitVars.recovertime;f.tick({input:new Set(['L'])});assert.ok(f.getHitVars.recovertime<before-1);
});

test('world forwards raw controls even when a CMD file has no named button commands',()=>{
  const w=new TrainingMatch(character('[Statedef 5110]\ntype=L\nmovetype=H\nphysics=N\nctrl=0'),{initialize:false,pushboxes:false});w.player.changeState(5110);w.player.getHitVars.recovertime=100;
  w.tick(new Set(),new Set(),{playerInput:new Set(['a'])});assert.ok(w.player.getHitVars.recovertime<99);
});

test('basic fallback air recovery executes an own-state recovery and returns to controllable air movement',()=>{
  const f=fighter();f.receiveHit(hit({p2stateno:undefined,pauseTime:[0,0],airVelocity:[-3,-4]}),null);f.pos.y=-80;f.changeState(5050);
  f.tick();f.tick();assert.equal(f.evaluate('CanRecover'),1);
  f.tick({commands:new Set(['recovery'])});assert.equal(f.stateNo,5210);assert.equal(f.stateOwner,f);
  for(let i=0;i<5;i++)f.tick();assert.equal(f.stateNo,50);assert.equal(f.ctrl,1);assert.equal(f.getHitVars.fall,0);
});

test('GetHitVar spatial fields retain float arithmetic and convert across caller coordinate systems',()=>{
  const w=new TrainingMatch(character(),{opponentCharacter:character('','1280,720'),initialize:false});w.player.getHitVars={xvel:3,xveladd:2,yveladd:4,zoff:6};
  assert.equal(w.player.evaluate('gethitvar(xvel)/2'),1.5);assert.equal(w.player.evaluate('gethitvar(xveladd)/4'),.5);
  assert.equal(w.opponent.evaluate('enemynear,gethitvar(yveladd)'),16);assert.equal(w.opponent.evaluate('enemynear,gethitvar(zoff)'),24);
  for(const key of ['type','hitid','chainid','recovertime','fall.time','xveladd','yveladd','zoff'])assert.doesNotThrow(()=>w.opponent.evaluate(`gethitvar(${key})`));
});
