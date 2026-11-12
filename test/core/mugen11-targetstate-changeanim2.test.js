import {test} from "node:test";
import assert from "node:assert/strict";
import {
  makeMugen11CustomStateScenario,
  executeMugen11TargetState,
  captureMugen11TargetStateProjection,
  runMugen11TargetStateScenario,
  MUGEN11_TARGETSTATE_SCENARIO,
} from "./fixtures/mugen11-targetstate-scenario.js";

test("TargetState filters by hit ID and ignores undocumented ctrl parameter (MUGEN 1.1)",()=>{
  const {match,attacker,victim,helper}=makeMugen11CustomStateScenario();
  assert.equal(victim.ctrl,1);
  assert.equal(helper.ctrl,1);
  executeMugen11TargetState(attacker,{id:71,value:910,ctrl:0});
  assert.equal(victim.stateNo,910);
  assert.equal(victim.stateOwner,attacker);
  assert.equal(victim.ctrl,1,
    "TargetState has no ctrl parameter: it must not override the victim control");
  assert.equal(helper.stateNo,0,"unmatched P2 helper is not a target");
  assert.equal(helper.stateOwner,helper);
  assert.ok(attacker.diagnostics.some(d=>d.type==="mugen11-targetstate-parameter"));
  const projection=captureMugen11TargetStateProjection(match,"after_controller");
  assert.equal(projection.actors.find(a=>a.role==="p2").stateOwner,"p1");
  assert.equal(projection.actors.find(a=>a.role==="p2-helper-72").stateNo,0);
});

test("ChangeAnim2 resolves P1 AIR action and element, not P2 AIR, inside borrowed state",()=>{
  const {match,attacker,victim,helper}=makeMugen11CustomStateScenario();
  assert.equal(victim.animations.has(9100),false,
    "P2 deliberately lacks the P1-only action in this fixture");
  executeMugen11TargetState(attacker,{id:71,value:910});
  match.tick();
  assert.equal(victim.stateOwner,attacker);
  assert.equal(victim.anim,9100);
  assert.equal(victim.animationOwner,attacker,
    "ChangeAnim2 must use the custom-state owner's AIR action");
  assert.equal(victim.frameIndex,1,"Elem=2 selects the second AIR element");
  assert.equal(victim.animation.frames.length,2);
  assert.equal(victim.animation.frames[1].ticks,5);
  assert.equal(victim.vars[42],73,"borrowed CNS controller executes on victim variables");
  assert.equal(helper.anim,0,"unmatched helper animation remains unchanged");
  assert.equal(helper.animationOwner,helper);
  assert.ok(!victim.diagnostics.some(d=>d.type==="missing-animation"));
});

test("ChangeState stays in borrowed CNS; SelfState restores P2 own CNS and AIR",()=>{
  const {match,attacker,victim}=makeMugen11CustomStateScenario();
  executeMugen11TargetState(attacker,{id:71,value:910});
  match.tick();
  assert.equal(victim.stateNo,910);
  assert.equal(victim.stateOwner,attacker);
  assert.equal(victim.animationOwner,attacker);
  match.tick();
  assert.equal(victim.stateNo,911,"borrowed ChangeState follows P1 program");
  assert.equal(victim.stateOwner,attacker);
  assert.equal(victim.animationOwner,attacker,
    "changing borrowed states without new anim preserves current animation");
  match.tick();
  assert.equal(victim.stateNo,0,"SelfState returns to own state 0");
  assert.equal(victim.stateOwner,victim);
  assert.equal(victim.animationOwner,victim,
    "own StateDef 0 anim=0 restores the victim's native AIR");
  assert.equal(victim.anim,0);
  assert.equal(victim.vars[42],73,
    "victim's conflicting native StateDef 910 was never entered");
});

test("ChangeAnim always uses own AIR even while StateDef is borrowed",()=>{
  const {match,attacker,victim}=makeMugen11CustomStateScenario();
  executeMugen11TargetState(attacker,{id:71,value:910});
  match.tick();
  assert.equal(victim.animationOwner,attacker);
  assert.equal(victim.changeAnimation(0),true);
  assert.equal(victim.animationOwner,victim);
  assert.equal(victim.anim,0);
  assert.equal(victim.stateOwner,attacker,
    "changing animation bank must not prematurely restore custom state ownership");
});

test("TargetState with no ID applies to all live targets including P2 helpers",()=>{
  const {match,attacker,victim,helper}=makeMugen11CustomStateScenario();
  executeMugen11TargetState(attacker,{id:-1,value:910});
  assert.equal(victim.stateNo,910);
  assert.equal(helper.stateNo,910);
  assert.equal(helper.stateOwner,attacker);
  match.tick();
  assert.equal(helper.animationOwner,attacker);
  assert.equal(helper.anim,9100);
});

test("TargetState excludes destroyed captured helpers from state mutation",()=>{
  const {match,attacker,victim,helper}=makeMugen11CustomStateScenario();
  helper.destroyed=true;
  executeMugen11TargetState(attacker,{id:-1,value:910});
  assert.equal(victim.stateNo,910);
  assert.equal(helper.stateNo,0,
    "stale destroyed target must not enter custom state");
});

test("candidate trace is deterministic, has role/phase labels, and never claims native verification",()=>{
  const a=runMugen11TargetStateScenario({ticks:5,ctrl:0});
  const b=runMugen11TargetStateScenario({ticks:5,ctrl:0});
  assert.deepEqual(a,b);
  assert.equal(a.scenario,MUGEN11_TARGETSTATE_SCENARIO);
  assert.equal(a.nativeMugen11Verified,false);
  assert.equal(a.source,"kenjatime-synthetic");
  assert.equal(a.ticks[0].phase,"before_controller");
  assert.equal(a.ticks[1].phase,"after_controller");
  assert.ok(a.ticks.some(t=>t.actors.find(actor=>actor.role==="p2")?.animationOwner==="p1"));
  assert.ok(a.ticks.some(t=>t.actors.find(actor=>actor.role==="p2")?.stateOwner==="p2"));
});
