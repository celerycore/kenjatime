import {test} from "node:test";
import assert from "node:assert/strict";
import {TrainingMatch} from "../../src/combat.js";
import {parseSections} from "../../src/runtime.js";
import {captureLegacyTraceTick} from "../../src/core/legacy-compatibility.js";

// Entirely original synthetic actors, AIR and CNS: NO native executable or
// real KFM/Tomoka assets are embedded in these regression fixtures.
const encode=t=>new TextEncoder().encode(t);
const fighter=(name,attackOwner)=>({
  path:name+".def",
  def:{info:{name,mugenversion:"1.1"},files:{cns:name+".cns"}},
  files:{[name+".cns"]:encode(`[Statedef 0]
type=S
movetype=I
physics=N
ctrl=0
anim=0
[Statedef 800]
type=S
movetype=A
physics=N
ctrl=0
anim=0
[Statedef 810]
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
[State 820, CustomStateOwnerMarker]
type=VarSet
trigger1=Time=0
v=42
value=${attackOwner?73:999}
[Statedef 880]
type=S
movetype=H
physics=N
anim=0
ctrl=0
[State 880, OwnHitOverride]
type=VarSet
trigger1=Time=0
v=43
value=88
`)},
  animations:[{id:0,frames:[{group:0,number:0,x:0,y:0,ticks:-1,clsn1:[],clsn2:[]}]}],
});
function scenario(){
  return new TrainingMatch(fighter("borrowed-attacker",true),{
    opponentCharacter:fighter("victim-local",false),
    initialize:false,orderedPhases:false,pushboxes:false
  });
}
function execute(actor,type,params=""){
  const section=parseSections(`[State 0, MUGEN11 custom HitDef probe]
type=${type}
trigger1=1
${params}
`)[0];
  actor.execute({...section,type:type.toLowerCase()});
}
function hit(actor,extra=""){
  execute(actor,"HitDef",`attr=S, NA
hitflag=MAF
guardflag=
damage=0,0
pausetime=0,0
ground.type=high
ground.velocity=0,0
p1stateno=-1
sparkno=-1
${extra}`);
  return actor.hitDef;
}

test("HitDef p2stateno without p2getp1state borrows the attacker's CNS by default",()=>{
  const m=scenario(),a=m.player,v=m.opponent;
  const h=hit(a,"p2stateno=820");
  assert.equal(v.canBeHit(h,a),true);
  const result=v.receiveHit(h,a);
  assert.equal(result.rejected,undefined);
  assert.equal(v.stateNo,820);
  assert.equal(v.stateOwner,a);
  assert.equal(v.resolveTrigger("incustomstate"),1);
  m.tick();
  assert.equal(v.vars[42],73,"borrowed attacker CNS executes on victim's data");
  assert.equal(v.animationOwner,v);
  const record=captureLegacyTraceTick(m).actors.find(p=>p.id===v.id);
  assert.equal(record.stateOwnerId,a.id);
});

test("HitDef p2getp1state=0 uses the victim's own StateDef even when P1 defines it too",()=>{
  const m=scenario(),a=m.player,v=m.opponent;
  const h=hit(a,"p2stateno=820\np2getp1state=0");
  assert.equal(v.canBeHit(h,a),true);
  v.receiveHit(h,a);
  assert.equal(v.stateNo,820);
  assert.equal(v.stateOwner,v);
  assert.equal(v.resolveTrigger("incustomstate"),0);
  m.tick();
  assert.equal(v.vars[42],999,"local victim CNS wins when p2getp1state=0");
  assert.equal(a.vars[42],0);
});

test("Helper-owned HitDef with p2stateno uses helper CNS as custom state owner",()=>{
  const m=scenario(),a=m.player,v=m.opponent;
  const helper=m.spawnHelper(a,{stateno:800,id:72,keyctrl:0});
  assert.ok(helper&&!helper.destroyed);
  const h=hit(helper,"p2stateno=820");
  v.receiveHit(h,helper);
  assert.equal(v.stateNo,820);
  assert.equal(v.stateOwner,helper);
  m.tick();
  assert.equal(v.vars[42],73);
  const record=captureLegacyTraceTick(m).actors.find(p=>p.id===v.id);
  assert.equal(record.stateOwnerId,helper.id);
});

test("Orphan p2getp1state=1 does not disable active HitOverride without p2stateno",()=>{
  const m=scenario(),a=m.player,v=m.opponent;
  execute(v,"HitOverride","attr=S, NA\nstateno=880\ntime=-1");
  assert.ok(v.hitOverrides.size>0);
  const h=hit(a,"p2getp1state=1");
  assert.equal(h.p2stateno,undefined);
  assert.equal(v.canBeHit(h,a),true,
    "p2getp1state without p2stateno is ignored by MUGEN 1.1");
  const result=v.receiveHit(h,a);
  assert.notEqual(result.rejected,true);
  assert.equal(v.stateNo,880);
  assert.equal(v.stateOwner,v);
  m.tick();
  assert.equal(v.vars[43],88);
});

test("Active HitOverride blocks a foreign p2stateno but permits self-owned P2 state",()=>{
  const foreign=scenario();
  execute(foreign.opponent,"HitOverride","attr=S, NA\nstateno=880\ntime=-1");
  const foreignHit=hit(foreign.player,"p2stateno=820");
  assert.equal(foreign.opponent.canBeHit(foreignHit,foreign.player),false);
  const rejected=foreign.opponent.receiveHit(foreignHit,foreign.player);
  assert.equal(rejected.rejected,true);

  const own=scenario();
  execute(own.opponent,"HitOverride","attr=S, NA\nstateno=880\ntime=-1");
  const localHit=hit(own.player,"p2stateno=820\np2getp1state=0");
  assert.equal(own.opponent.canBeHit(localHit,own.player),true);
  own.opponent.receiveHit(localHit,own.player);
  assert.equal(own.opponent.stateNo,880,
    "HitOverride takes precedence over a hit that does not borrow P1's states");
});

test("HitDef with p2stateno=820 cannot silently use wrong owner's missing state bank",()=>{
  const m=scenario(),a=m.player,v=m.opponent;
  const h=hit(a,"p2stateno=831\np2getp1state=0");
  assert.equal(v.canBeHit(h,a),true);
  const before={life:v.life,state:v.stateNo};
  const received=v.receiveHit(h,a);
  assert.equal(received.rejected,true);
  assert.equal(v.stateNo,before.state);
  assert.equal(v.life,before.life);
  assert.ok(v.diagnostics.some(d=>d.type==="missing-state"));
});
