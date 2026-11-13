import {test} from "node:test";
import assert from "node:assert/strict";
import {TrainingMatch} from "../../src/combat.js";
import {parseSections} from "../../src/runtime.js";
import {captureLegacyTraceTick} from "../../src/core/legacy-compatibility.js";

// Original synthetic MUGEN 1.1 fixtures: no native binary/character assets.
const encode=t=>new TextEncoder().encode(t);
const stateText=`
[Statedef 0]
type=S
movetype=I
physics=N
anim=0
ctrl=0

[Statedef 810]
type=S
movetype=A
physics=N
anim=0
ctrl=0

[Statedef 811]
type=S
movetype=A
physics=N
anim=0
ctrl=0

[Statedef 820]
type=S
movetype=H
physics=N
anim=0
ctrl=0
[State 820, Foreign helper AIR]
type=ChangeAnim2
trigger1=Time=0
value=8400

[Statedef 821]
type=S
movetype=I
physics=N
anim=0
ctrl=0

[Statedef 822]
type=S
movetype=A
physics=N
anim=0
ctrl=0

[Statedef 880]
type=S
movetype=I
physics=N
anim=0
ctrl=0
[State 880, Armor marker]
type=VarSet
trigger1=Time=0
v=45
value=88
`;
const animation=(id,group)=>({id,frames:[{group,number:0,x:0,y:0,ticks:-1,clsn1:[],clsn2:[]}]});
function character(name,attacker=false){
  return {path:name+".def",
    def:{info:{name,mugenversion:"1.1"},files:{cns:name+".cns"}},
    files:{[name+".cns"]:encode(stateText)},
    animations:attacker?[animation(0,0),animation(8400,8400)]:[animation(0,0)],
  };
}
function fixture(orderedPhases=false){
  return new TrainingMatch(character("owner",true),{
    opponentCharacter:character("victim",false),
    initialize:false,orderedPhases,pushboxes:false
  });
}
function execute(actor,type,params){
  const section=parseSections(`[State 0, HitDef probe]
type=${type}
trigger1=1
${params}
`)[0];
  actor.execute({...section,type:type.toLowerCase()});
}
function hit(actor,extra=""){
  execute(actor,"HitDef",`attr=S, NT
hitflag=MAF
damage=0,0
pausetime=0,0
ground.type=high
ground.velocity=0,0
sparkno=-1
${extra}`);
  assert.ok(actor.hitDef);
  return actor.hitDef;
}

test("successful throw applies p1stateno attack StateDef and p2stateno hit StateDef",()=>{
  const m=fixture(),p1=m.player,p2=m.opponent;
  const h=hit(p1,"p1stateno=811\np2stateno=820");
  const result=p2.receiveHit(h,p1);
  assert.notEqual(result.rejected,true);
  assert.equal(p1.stateNo,811);
  assert.equal(p1.moveType,"A");
  assert.equal(p1.stateOwner,p1);
  assert.equal(p2.stateNo,820);
  assert.equal(p2.moveType,"H");
  assert.equal(p2.stateOwner,p1);
  assert.equal(p1.targets.includes(p2),true);
});

test("custom HitDef destination movetype I/A remains authored, not forcibly replaced with H",()=>{
  for(const [state,moveType] of [[821,"I"],[822,"A"]]){
    const m=fixture(),p1=m.player,p2=m.opponent;
    const h=hit(p1,`p2stateno=${state}`);
    const result=p2.receiveHit(h,p1);
    assert.notEqual(result.rejected,true);
    assert.equal(p2.stateNo,state);
    assert.equal(p2.stateOwner,p1);
    assert.equal(p2.moveType,moveType,
      `StateDef ${state} authored movetype ${moveType} must win after hit`);
  }
});

test("HitOverride armor StateDef explicitly movetype I survives hit resolution",()=>{
  const m=fixture(),p1=m.player,p2=m.opponent;
  execute(p2,"HitOverride","attr=S, NT\nstateno=880\ntime=-1");
  const h=hit(p1);
  const received=p2.receiveHit(h,p1);
  assert.notEqual(received.rejected,true);
  assert.equal(p2.stateNo,880);
  assert.equal(p2.stateOwner,p2);
  assert.equal(p2.moveType,"I");
  m.tick();
  assert.equal(p2.vars[45],88);
});

test("successful helper-owned throw keeps helper as P2 owner, uses helper AIR via ChangeAnim2",()=>{
  const m=fixture(),root=m.player,p2=m.opponent;
  const helper=m.spawnHelper(root,{stateno:810,id:72});
  assert.ok(helper&&!helper.destroyed);
  const h=hit(helper,"p1stateno=811\np2stateno=820");
  p2.receiveHit(h,helper);
  assert.equal(helper.stateNo,811);
  assert.equal(helper.moveType,"A");
  assert.equal(p2.stateOwner,helper);
  assert.equal(p2.moveType,"H");
  m.tick();
  assert.equal(p2.anim,8400);
  assert.equal(p2.animationOwner,helper);
  assert.equal(p2.currentFrame.group,8400);
  assert.equal(p2.stateOwner,helper);
  const trace=captureLegacyTraceTick(m);
  assert.equal(trace.actors.find(a=>a.id===p2.id).animationOwnerId,helper.id);
});

test("HitDef p1stateno does not change P1 state on a guarded contact",()=>{
  const m=fixture(),p1=m.player,p2=m.opponent;
  const h=hit(p1,"p1stateno=811");
  p2.receiveHit(h,p1,{guarded:true});
  assert.equal(p1.stateNo,0);
  assert.equal(p1.moveType,"I");
});

test("ordered 60 Hz contact defers StateDef entry while maintaining temporary hit state",()=>{
  const m=fixture(true),p1=m.player,p2=m.opponent;
  const h=hit(p1,"p1stateno=811\np2stateno=821");
  p2.receiveHit(h,p1);
  assert.equal(p2.stateNo,821);
  assert.equal(p2.moveType,"H","pending state entry must remain in hit status");
  assert.ok(p2._pendingStateEntry);
  assert.equal(p1.stateNo,811);
  m.tick();
  assert.equal(p2.stateNo,821);
  assert.equal(p2.moveType,"I","deferred entry applies StateDef movetype");
  assert.equal(p2.stateOwner,p1);
  assert.equal(p1.moveType,"A");
});

test("optional 1.1 trace separates pending throw entry from observable hitshake and HitID",()=>{
  const m=fixture(true),p1=m.player,p2=m.opponent;
  const h=hit(p1,"p1stateno=811\np2stateno=821\nid=73");
  h.pauseTime=[0,2];
  const outcome=p2.receiveHit(h,p1);
  assert.notEqual(outcome.rejected,true);
  const first=captureLegacyTraceTick(m).actors.find(a=>a.id===p2.id);
  assert.equal(first.stateNo,821);
  assert.equal(first.stateOwnerId,p1.id);
  assert.equal(first.pendingStateNo,821);
  assert.equal(first.pendingStateOwnerId,p1.id);
  assert.equal(first.hitId,73);
  assert.equal(first.hitShakeTime,2);
  assert.ok(first.hitTime>=0);
  assert.equal(first.moveType,"H");
  m.tick();
  const after=captureLegacyTraceTick(m).actors.find(a=>a.id===p2.id);
  assert.equal(after.pendingStateNo,null);
  assert.equal(after.pendingStateOwnerId,null);
  assert.equal(after.stateOwnerId,p1.id);
  assert.equal(after.moveType,"I");
  assert.ok(after.hitShakeTime<=2);
});

test("optional trace distinguishes helper-owned pending custom state from root ID",()=>{
  const m=fixture(true),root=m.player,victim=m.opponent;
  const helper=m.spawnHelper(root,{stateno:810,id:72});
  const h=hit(helper,"p2stateno=820\nid=74");
  const outcome=victim.receiveHit(h,helper);
  assert.notEqual(outcome.rejected,true);
  const trace=captureLegacyTraceTick(m).actors.find(a=>a.id===victim.id);
  assert.equal(trace.pendingStateNo,820);
  assert.equal(trace.pendingStateOwnerId,helper.id);
  assert.equal(trace.stateOwnerId,helper.id);
  assert.notEqual(trace.stateOwnerId,root.id);
  assert.equal(trace.hitId,74);
});
