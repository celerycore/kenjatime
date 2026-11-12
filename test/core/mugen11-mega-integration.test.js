import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {parseSections} from "../../src/runtime.js";
import {captureLegacyTraceTick} from "../../src/core/legacy-compatibility.js";
import {
  makeMugen11CustomStateScenario,
  executeMugen11TargetState
} from "./fixtures/mugen11-targetstate-scenario.js";

const sourcePath=new URL("../../releases/kenjatime-mega-2026-11-13.json",import.meta.url);
const bundle=JSON.parse(readFileSync(sourcePath,"utf8"));

function controller(actor,type,params=""){
  const c=parseSections(`[State Mega, ${type}]
type=${type}
trigger1=1
${params}
`)[0];
  actor.execute({...c,type:type.toLowerCase()});
}

test("Mega release manifest consolidates R8 and MUGEN compatibility without claiming native parity",()=>{
  assert.equal(bundle.id,"kenjatime-mega-2026-11-13");
  assert.equal(bundle.nativeMugen11Certified,false);
  assert.equal(bundle.productionArcadeUpdated,false);
  assert.equal(bundle.target,"Elecbyte M.U.G.E.N 1.1 Beta 1 P1 (2013)");
  assert.ok(bundle.priorMergedPRs.includes(22)&&bundle.priorMergedPRs.includes(43));
  assert.equal(new Set(bundle.features).size,bundle.features.length);
  for(const name of [
    "mugen11-mega-parity-bundle","r8-mega-release-gate","gpu-texture-residency",
    "deterministic-60hz-clock","mugen11-hitdef-authored-movetype",
    "mugen11-targetdrop-random-keepone","mugen11-changeanim2-selfstate"])
    assert.ok(bundle.features.includes(name),name);
  assert.ok(bundle.knownGaps.some(x=>x.includes("native MUGEN 1.1")));
});

test("Integrated TargetState -> ChangeAnim2 -> borrowed ChangeState -> SelfState keeps P2 helper independent",()=>{
  const {match,attacker,victim,helper}=makeMugen11CustomStateScenario();
  executeMugen11TargetState(attacker,{id:71,value:910});
  match.tick();
  assert.equal(victim.stateOwner,attacker);
  assert.equal(victim.anim,9100);
  assert.equal(victim.frameIndex,1);
  assert.equal(victim.animationOwner,attacker);
  assert.equal(victim.vars[42],73);
  assert.equal(helper.stateOwner,helper);
  assert.equal(helper.anim,0);
  match.tick();
  assert.equal(victim.stateNo,911);
  assert.equal(victim.stateOwner,attacker);
  match.tick();
  assert.equal(victim.stateNo,0);
  assert.equal(victim.stateOwner,victim);
  assert.equal(victim.animationOwner,victim);
  assert.equal(victim.vars[42],73);
  const trace=captureLegacyTraceTick(match);
  assert.equal(trace.actors.find(a=>a.id===victim.id).stateOwnerId,victim.id);
  assert.equal(trace.actors.find(a=>a.id===helper.id).parentId,victim.id);
});

test("Helper-owned HitDef integrates ParentVarSet, binding, foreign AIR and ordered 60 Hz state entry",()=>{
  const {match,attacker,victim}=makeMugen11CustomStateScenario();
  const helper=match.spawnHelper(attacker,{id:820,stateno:0,keyctrl:0});
  assert.ok(helper&&!helper.destroyed);
  controller(helper,"ParentVarSet","v=5\nvalue=19");
  assert.equal(attacker.vars[5],19);
  assert.equal(victim.vars[5],0);
  controller(helper,"BindToParent","time=2\npos=5,-3");
  assert.equal(helper.bound?.target,attacker);
  helper.updateBinding();
  assert.equal(helper.bound?.time,1);
  helper.updateBinding();
  assert.equal(helper.bound,null);

  controller(helper,"HitDef",`attr=S, NA
hitflag=MAF
damage=0,0
pausetime=0,0
ground.velocity=0,0
ground.type=high
p2stateno=910
p1stateno=0`);
  const hit=helper.hitDef;
  assert.ok(hit);
  const contact=victim.receiveHit(hit,helper);
  assert.notEqual(contact.rejected,true);
  assert.equal(victim.stateOwner,helper);
  assert.equal(victim._pendingStateEntry?.owner,helper);
  assert.equal(victim.moveType,"H");
  match.tick();
  assert.equal(victim.stateOwner,helper);
  assert.equal(victim.anim,9100);
  assert.equal(victim.animationOwner,helper);
  assert.equal(victim.vars[42],73);
  const trace=captureLegacyTraceTick(match).actors.find(a=>a.id===victim.id);
  assert.equal(trace.stateOwnerId,helper.id);
  assert.equal(trace.animationOwnerId,helper.id);
});

test("Same-ID TargetDrop and live NumTarget integrate with helper destruction and deterministic replay",()=>{
  function scenario(){
    const {match,attacker,victim,helper}=makeMugen11CustomStateScenario();
    attacker.targets=[victim,helper];
    attacker.targetHitIds.set(victim.id,91);
    attacker.targetHitIds.set(helper.id,91);
    attacker._seed=0x12345678;
    controller(attacker,"TargetDrop","excludeid=91\nkeepone=1");
    const survivor=attacker.targets[0];
    assert.ok(survivor===victim||survivor===helper);
    assert.equal(attacker.resolveTrigger("numtarget",[91]),1);
    assert.equal(attacker.targetHitIds.size,1);
    survivor.destroyed=true;
    assert.equal(attacker.resolveTrigger("numtarget"),0);
    return {survivor:survivor.id,seed:attacker._seed};
  }
  assert.deepEqual(scenario(),scenario());
});

test("Mega release keeps isolated GPU, Android archive import and round start protections in place",()=>{
  const read=path=>readFileSync(new URL("../../"+path,import.meta.url),"utf8");
  const renderer=read("src/core/r8-benchmark.js");
  const session=read("src/core/session.js");
  const core=read("src/combat.js");
  const picker=read("test/core/archive-file-picker.test.js");
  assert.ok(renderer.includes("gpu_resident_mib")&&renderer.includes("helper_state_map"));
  assert.ok(renderer.includes("p1_pending_state_owner_id"));
  assert.ok(session.includes("pendingStateOwnerId"));
  assert.ok(core.includes("fightStartLocked(this.roundFlow)"));
  assert.ok(picker.includes("test("));
  assert.ok(!bundle.nativeMugen11Certified);
});
