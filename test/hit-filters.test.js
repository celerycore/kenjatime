import {test} from 'node:test';
import assert from 'node:assert/strict';
import {FighterRuntime,parseSections} from '../src/runtime.js';
import {hitAttribute,attributeMatches} from '../src/hit-filters.js';
import {COMMON_STATES} from '../src/common.js';

const encode=text=>new TextEncoder().encode(text);
const idle='[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nctrl=1\nanim=0\n';
function fighter(extra=''){
  return new FighterRuntime({path:'test.def',def:{files:{cns:'test.cns'}},files:{'test.cns':encode(idle+extra)},animations:[0,1,2].map(id=>({id,frames:[{group:0,number:id,ticks:-1}]}))},{commonText:COMMON_STATES});
}
function execute(actor,type,params){const controller=parseSections(`[State 0, test]\ntype=${type}\n${params}`)[0];controller.type=type.toLowerCase();actor.execute(controller);}
const hit=attr=>({attr,damage:[10,0],groundVelocity:[-1,0],airVelocity:[-3,-5],groundHitTime:8,airHitTime:19,pauseTime:[0,0],fall:0,'air.fall':1,'air.animtype':'up'});

test('HitBy and NotHitBy share two slots, intersect active masks and replace only the selected slot',()=>{
  const actor=fighter();
  execute(actor,'HitBy','value=SCA,AA,AP\ntime=-1');
  execute(actor,'NotHitBy','value2=,NA,AP\ntime=-1');
  assert.equal(actor.canBeHit(hit('S,SA')),true);
  for(const attr of ['S,NA','C,NP','A,HT'])assert.equal(actor.canBeHit(hit(attr)),false,attr);
  execute(actor,'HitBy','value2=S,SA\ntime=-1');
  assert.equal(actor.canBeHit(hit('S,SA')),true);assert.equal(actor.canBeHit(hit('C,SA')),false);
  execute(actor,'NotHitBy','value=SCA\ntime=-1');
  assert.equal(actor.canBeHit(hit('S,SA')),false);
  execute(actor,'HitBy','value=\ntime=0');
  assert.equal(actor.canBeHit(hit('S,SA')),true);assert.equal(actor.canBeHit(hit('C,SA')),false);
  execute(actor,'NotHitBy','value2=\ntime=0');
  assert.equal(actor.canBeHit(hit('C,NT')),true);
});

test('native hit filters treat state and attack-class masks independently, including empty masks',()=>{
  const actor=fighter();execute(actor,'NotHitBy','value=S,NA\ntime=-1');
  for(const attr of ['S,SA','C,NA','A,NA'])assert.equal(actor.canBeHit(hit(attr)),false,attr);
  assert.equal(actor.canBeHit(hit('C,SA')),true);
  execute(actor,'HitBy','value=SCA\ntime=-1');assert.equal(actor.canBeHit(hit('A,HA')),false);
  execute(actor,'HitBy','value=,AA\ntime=-1');assert.equal(actor.canBeHit(hit('A,HA')),false);
  execute(actor,'NotHitBy','value=,AP\ntime=-1');
  for(const attr of ['S,NP','C,SP','A,HP'])assert.equal(actor.canBeHit(hit(attr)),false);
  assert.equal(actor.canBeHit(hit('A,HA')),true);
  assert.equal(attributeMatches('SCA,AT','C,HT'),true);
  for(const invalid of ['S,XA','L,NA','S,AB','S,NN'])assert.throws(()=>hitAttribute(invalid));
});

test('hit filters expire during hitpause, freeze during global pause, and accept explicit clearing',()=>{
  const actor=fighter();execute(actor,'NotHitBy','value=SCA\ntime=3');actor.hitPauseTime=6;
  actor.tick({paused:true});assert.equal(actor.hitFilters[0].time,3);
  actor.tick();assert.equal(actor.hitFilters[0].time,2);assert.equal(actor.canBeHit(hit('S,NA')),false);
  actor.tick();actor.tick();assert.equal(actor.canBeHit(hit('S,NA')),true);
  execute(actor,'HitOverride','attr=SCA,AA\nstateno=0\ntime=-1');
  for(let i=0;i<30;i++)actor.tick();assert.equal(actor.hitOverrides.get(0).time,-1);
  execute(actor,'HitOverride','attr=SCA,AA\nstateno=0\ntime=0');assert.equal(actor.hitOverrides.size,0);
});

test('HitOverride selects the lowest matching slot and forceair supplies airborne gethit variables',()=>{
  const actor=fighter('[Statedef 700]\ntype=A\nphysics=N\n[Statedef 701]\ntype=S\nphysics=N');
  execute(actor,'HitOverride','attr=SCA,AA\nstateno=701\nslot=7\ntime=-1');
  execute(actor,'HitOverride','attr=SCA,AA\nstateno=700\nslot=0\ntime=-1\nforceair=1');
  assert.equal(actor.receiveHit(hit('S,NA'),null).damage,10);assert.equal(actor.stateNo,700);
  assert.deepEqual([actor.getHitVars.xvel,actor.getHitVars.yvel,actor.getHitVars.hittime,actor.getHitVars.animtype,actor.getHitVars.fall],[-3,-5,19,4,1]);
  actor.changeState(0);execute(actor,'HitOverride','attr=SCA,AA\nstateno=0\nslot=0\ntime=0');
  actor.receiveHit(hit('S,NA'),null);assert.equal(actor.stateNo,701);
});

test('matching overrides reject foreign state-stealing hits before damage, but guards use guard states',()=>{
  const actor=fighter('[Statedef 700]\ntype=S\nphysics=N');execute(actor,'HitOverride','attr=SCA,AA,AT\nstateno=700\ntime=-1');
  for(const fields of [{p1stateno:800},{p2getp1state:1},{p2stateno:900}]){
    assert.equal(actor.receiveHit({...hit('S,NT'),...fields},null).rejected,true);assert.equal(actor.life,1000);
  }
  const guarded={...hit('S,NA'),guardVelocity:[-2,0],guardHitTime:10,guardPauseTime:[0,0]};
  actor.receiveHit(guarded,null,{guarded:true});assert.equal(actor.stateNo,150);
  actor.changeState(0);actor.receiveHit({...hit('S,NA'),p2stateno:900,p2getp1state:0},null);assert.equal(actor.stateNo,700);
});

test('invalid filter parameters fail before replacing existing slots',()=>{
  const actor=fighter();execute(actor,'NotHitBy','value=SCA\ntime=-1');
  for(const [type,params]of [['HitBy','value=S,NA\nvalue2=A,SA'],['HitBy','time=3'],['HitBy','value=S,XA'],['HitOverride','attr=SCA,AA\nstateno=0\nslot=8'],['HitOverride','attr=SCA,AA']])assert.throws(()=>execute(actor,type,params));
  assert.equal(actor.canBeHit(hit('S,NA')),false);
});

test('ChangeState and SelfState anim evaluate before transition; destination Statedef anim takes precedence',()=>{
  for(const type of ['ChangeState','SelfState']){
    const actor=fighter('[Statedef 200]\ntype=S\nphysics=N\n[Statedef 201]\ntype=S\nphysics=N\nanim=1');
    execute(actor,type,'value=200\nanim=ifelse(stateno=0,2,1)');assert.equal(actor.stateNo,200);assert.equal(actor.anim,2);
    execute(actor,type,'value=201\nanim=2');assert.equal(actor.anim,1);
    execute(actor,type,'value=200\nanim=-1');assert.equal(actor.anim,1);
  }
});
