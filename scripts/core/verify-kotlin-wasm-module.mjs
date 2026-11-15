import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.argv[2] || "kotlin-core/build";
function locate(directory, depth = 0) {
  if (depth > 12) return [];
  const items = readdirSync(directory, { withFileTypes: true });
  const found = [];
  for (const item of items) {
    const next = join(directory, item.name);
    if (item.isDirectory()) {
      if (item.name === "node_modules") continue;
      found.push(...locate(next, depth + 1));
    } else if (item.name === "kenjatime-kotlin-core.mjs") {
      found.push(next);
    }
  }
  return found;
}
const files = locate(root);
assert.ok(files.length, "Kotlin ESM runtime was not generated");
const filename = files.find(f => f.includes("productionExecutable")) ?? files[0];
const imported = await import(pathToFileURL(resolve(filename)).href);
const initialized = typeof imported.default === "function"
  ? await imported.default() : imported.default;
const api = [imported, initialized, initialized?.exports]
  .find(x => x && typeof x.ktCoreCreate === "function");
assert.ok(api, "Kotlin/Wasm runtime does not export the expected JS combat API");
console.log("Kotlin/Wasm import module: " + filename);
console.log("Kotlin/Wasm export keys: " + Object.keys(api).filter(k => k.startsWith("ktCore")).join(", "));

const air = "[Begin Action 0]\nClsn2:1\nClsn2[0]=-10,-70,10,0\n0,0,0,0,-1";
const cns = "[Statedef 0]\ntype=S\nanim=0\nctrl=1\n[Statedef 200]\ntype=A\nanim=0\nctrl=0";
const handle = api.ktCoreCreateWithCommands
  ? api.ktCoreCreateWithCommands("KFM","Dark Donald",air,air,cns,cns,"","")
  : api.ktCoreCreate("KFM","Dark Donald",air,air,cns,cns);
try {
  assert.equal(typeof handle,"number");
  if (typeof api.ktCoreSetup === "function") api.ktCoreSetup(handle,-70*256,0,70*256,0);
  const before = JSON.parse(api.ktCoreSnapshot(handle,0));
  assert.equal(before.life,1000);
  if (typeof api.ktCoreDebugForceState === "function") {
    api.ktCoreDebugForceState(handle, 0, 200);
    assert.equal(JSON.parse(api.ktCoreSnapshot(handle,0)).state,200);
    api.ktCoreDebugForceState(handle, 0, 0);
    if (typeof api.ktCoreDebugSetFacing === "function")
      api.ktCoreDebugSetFacing(handle,0,true);
  }
  const checksum = api.ktCoreStep(handle,0,"",0,"");
  assert.ok(checksum.startsWith("1:"));
  assert.equal(JSON.parse(api.ktCoreSnapshot(handle,1)).frame,1);
  if (typeof api.ktCoreAdvance === "function") {
    api.ktCoreAdvance(handle,0,"",0,"");
    assert.equal(JSON.parse(api.ktCoreSnapshot(handle,1)).frame,2);
    assert.equal(typeof api.ktCoreChecksum(handle),"string");
  }
  if (api.ktCoreContacts)
    assert.deepEqual(JSON.parse(api.ktCoreContacts(handle)),[]);
  if (api.ktCoreEntities)
    assert.deepEqual(JSON.parse(api.ktCoreEntities(handle)),{helpers:0,projectiles:0});
  if (api.ktCoreEvents)
    assert.deepEqual(JSON.parse(api.ktCoreEvents(handle)),[]);
  console.log("Native Wasm import/step/snapshot/release: OK");
} finally {
  api.ktCoreRelease(handle);
}

// Exercise the new custom-state path through the actual exported Wasm ABI.
// P2 intentionally has a conflicting state 910 and lacks P1's action 9100.
const throwAir = `${air}\n[Begin Action 200]\nClsn1:1\nClsn1[0]=0,-60,50,0\n200,0,0,0,-1
[Begin Action 9100]
5000,0,0,0,3
5000,1,0,0,5`;
const throwCns = `${cns}
[Statedef 200]
type=S
movetype=A
anim=200
ctrl=0
[State 200, HitDef]
type=HitDef
trigger1=Time=0
damage=30
id=71
ground.hittime=60
[State 200, TargetState]
type=TargetState
trigger1=NumTarget(71)>0
persistent=0
id=71
value=910
[Statedef 910]
type=S
movetype=H
[State 910, ChangeAnim2]
type=ChangeAnim2
trigger1=Time=0
value=9100
elem=2
[State 910, ChangeState]
type=ChangeState
trigger1=Time=1
value=911
[Statedef 911]
type=S
movetype=H
[State 911, SelfState]
type=SelfState
trigger1=Time=1
value=0`;
const custom = api.ktCoreCreate("thrower","victim",throwAir,air,throwCns,
  `${cns}\n[Statedef 910]\ntype=S\nmovetype=I\nanim=0`);
try {
  api.ktCoreSetup(custom,0,0,20*256,0);
  api.ktCoreDebugForceState(custom,0,200);
  api.ktCoreAdvance(custom,0,"",0,"");
  assert.equal(JSON.parse(api.ktCoreSnapshot(custom,0)).numTargets,1);
  api.ktCoreAdvance(custom,0,"",0,"");
  const borrowed = JSON.parse(api.ktCoreSnapshot(custom,1));
  assert.equal(borrowed.state,910);
  assert.equal(borrowed.stateOwner,1);
  assert.equal(borrowed.animationOwner,1);
  const draws = JSON.parse(api.ktCoreRenderPlan(custom,0)).draws;
  assert.equal(draws[1].side,1,"Borrowed AIR must keep the victim's SFF resource bank");
  assert.equal(draws[1].group,5000);
  assert.equal(draws[1].number,1);
  api.ktCoreAdvance(custom,0,"",0,"");
  assert.equal(JSON.parse(api.ktCoreSnapshot(custom,1)).state,911);
  api.ktCoreAdvance(custom,0,"",0,"");
  api.ktCoreAdvance(custom,0,"",0,"");
  const restored = JSON.parse(api.ktCoreSnapshot(custom,1));
  assert.equal(restored.state,0);
  assert.equal(restored.stateOwner,2);
  assert.equal(restored.animationOwner,2);
  assert.equal(api.ktCoreIssues(custom),"");
  console.log("Native Wasm HitDef -> TargetState -> ChangeAnim2 -> SelfState: OK (synthetic, not native MUGEN parity)");
} finally {
  api.ktCoreRelease(custom);
}

const timingAir = `[Begin Action 0]
0,0,0,0,2
0,1,0,0,3
0,2,0,0,4`;
const timingCns = `[Statedef 0]
anim=0
[State 0, move once at element start]
type=PosAdd
trigger1=AnimElem = 2
x=7
[State 0, sound before element three]
type=PlaySnd
trigger1=AnimElem = 3, -1
value=5,0
[State 0, exit at action end]
type=ChangeState
trigger1=AnimTime = 0
value=10
[Statedef 10]`;
const timing = api.ktCoreCreate("clock","neutral",timingAir,timingAir,timingCns,"[Statedef 0]\nanim=0");
try {
  const soundTicks=[];
  for(let tick=0;tick<9;tick++) {
    const state=JSON.parse(api.ktCoreSnapshot(timing,0));
    assert.equal(state.animationTime,tick);
    assert.equal(state.animTime,tick-9);
    const draw=JSON.parse(api.ktCoreRenderPlan(timing,0)).draws[0];
    assert.equal(draw.elemTime,state.animElemTime);
    assert.equal(draw.animTime,state.animTime);
    api.ktCoreAdvance(timing,0,"",0,"");
    if(JSON.parse(api.ktCoreEvents(timing)).some(e=>e.type==="playsnd"&&e.group===5))soundTicks.push(tick);
  }
  const seam=JSON.parse(api.ktCoreSnapshot(timing,0));
  assert.equal(seam.animTime,0);
  assert.equal(seam.animElem,1,"Finite AIR loops to element one by default");
  assert.equal(seam.x256,7*256,"AnimElem=2 is a single-tick event");
  assert.deepEqual(soundTicks,[4],"Negative element offset must fire one tick before element 3");
  api.ktCoreAdvance(timing,0,"",0,"");
  assert.equal(JSON.parse(api.ktCoreSnapshot(timing,0)).state,10);
  assert.equal(api.ktCoreIssues(timing),"");
  console.log("Native Wasm AIR timing / negative AnimElem offset / signed AnimTime recovery: OK (synthetic)");
} finally {
  api.ktCoreRelease(timing);
}

const bindAir=`[Begin Action 0]
Clsn1Default:1
Clsn1[0]=0,-60,40,0
Clsn2Default:1
Clsn2[0]=-10,-60,10,0
0,0,0,0,-1`;
const bindCns=`[Statedef 0]
anim=0
[State 0, movement]
type=VelSet
trigger1=Time=0
x=1
[State 0, capture]
type=HitDef
trigger1=Time=0
damage=1
id=7
[State 0, attach target]
type=TargetBind
trigger1=Time=1 && NumTarget(7)>0
id=7
time=2
pos=20,-5`;
const bound=api.ktCoreCreate("anchor","victim",bindAir,air,bindCns,"[Statedef 0]\nanim=0");
try {
  api.ktCoreSetup(bound,0,0,20*256,0);
  api.ktCoreAdvance(bound,0,"",0,"");
  assert.equal(JSON.parse(api.ktCoreSnapshot(bound,0)).numTargets,1);
  api.ktCoreAdvance(bound,0,"",0,"");
  const attached=JSON.parse(api.ktCoreSnapshot(bound,1));
  assert.equal(attached.boundTo,1);
  assert.equal(attached.bindTime,1);
  assert.equal(attached.x256,22*256);
  assert.equal(attached.y256,-5*256);
  for(let i=0;i<3;i++)api.ktCoreRenderPlan(bound,12);
  assert.deepEqual(JSON.parse(api.ktCoreSnapshot(bound,1)),attached,"Presentation cannot consume binding time");
  api.ktCoreAdvance(bound,0,"",0,"");
  const expired=JSON.parse(api.ktCoreSnapshot(bound,1));
  assert.equal(expired.boundTo,0);
  assert.equal(expired.bindTime,0);
  assert.equal(expired.x256,23*256);
  api.ktCoreAdvance(bound,0,"",0,"");
  assert.equal(JSON.parse(api.ktCoreSnapshot(bound,1)).x256,23*256);
  assert.equal(api.ktCoreIssues(bound),"");
  console.log("Native Wasm HitDef capture / TargetBind / finite release / read-only snapshots: OK (synthetic)");
} finally {
  api.ktCoreRelease(bound);
}

const helperCns=`[Statedef 0]
anim=0
[State 0, movement]
type=VelSet
trigger1=Time=0
x=1
[State 0, helper]
type=Helper
trigger1=Time=0
stateno=200
pos=12,-4
[Statedef 200]
anim=0
[State 200, follow parent]
type=BindToParent
trigger1=Time=0
time=2
pos=20,-6`;
const helperBind=api.ktCoreCreate("parent","neutral",air,air,helperCns,"[Statedef 0]\nanim=0");
try {
  api.ktCoreAdvance(helperBind,0,"",0,"");
  assert.equal(JSON.parse(api.ktCoreEntities(helperBind)).helpers,1);
  api.ktCoreAdvance(helperBind,0,"",0,"");
  const helper=JSON.parse(api.ktCoreRenderPlan(helperBind,0)).draws.find(d=>d.kind==="helper");
  assert.equal(helper.side,0);
  assert.equal(helper.x,480+22*1.4);
  assert.equal(helper.y,435-6*1.1);
  api.ktCoreAdvance(helperBind,0,"",0,"");
  api.ktCoreAdvance(helperBind,0,"",0,"");
  const released=JSON.parse(api.ktCoreRenderPlan(helperBind,0)).draws.find(d=>d.kind==="helper");
  assert.equal(released.x,480+23*1.4);
  assert.equal(api.ktCoreIssues(helperBind),"");
  console.log("Native Wasm helper / BindToParent / projected sprite / finite release: OK (synthetic)");
} finally {
  api.ktCoreRelease(helperBind);
}

const effectAir=`${air}
[Begin Action 9]
9,0,0,0,1
9,1,0,0,2`;
const effectCns=`[Statedef 0]
anim=0
[State 0, move]
type=VelSet
trigger1=Time=0
x=1
[State 0, effect]
type=Explod
trigger1=Time=0
id=77
anim=9
pos=10,-5
velocity=2,0
removetime=3
scale=.5,2
sprpriority=-1`;
const effectFight=api.ktCoreCreate("effect","neutral",effectAir,air,effectCns,"[Statedef 0]\nanim=0");
try {
  api.ktCoreAdvance(effectFight,0,"",0,"");
  const birth=JSON.parse(api.ktCoreExplods(effectFight));
  assert.equal(birth.length,1);
  assert.equal(birth[0].id,77);
  assert.equal(birth[0].x256,11*256);
  assert.equal(birth[0].age,0);
  assert.equal(birth[0].elem,1);
  assert.equal(JSON.parse(api.ktCoreSnapshot(effectFight,0)).numExplods,1);
  const effectPlan=JSON.parse(api.ktCoreRenderPlan(effectFight,0));
  assert.equal(effectPlan.draws[0].kind,"explod","Negative priority belongs behind fighters");
  assert.equal(effectPlan.draws[0].side,0);
  assert.equal(effectPlan.draws[0].spriteScaleX,.5);
  assert.equal(effectPlan.draws[0].spriteScaleY,2);
  for(let i=0;i<3;i++)api.ktCoreRenderPlan(effectFight,12);
  assert.deepEqual(JSON.parse(api.ktCoreExplods(effectFight)),birth);
  api.ktCoreAdvance(effectFight,0,"",0,"");
  const moved=JSON.parse(api.ktCoreExplods(effectFight))[0];
  assert.equal(moved.x256,13*256);
  assert.equal(moved.elem,2);
  api.ktCoreAdvance(effectFight,0,"",0,"");
  assert.equal(JSON.parse(api.ktCoreExplods(effectFight)).length,1);
  api.ktCoreAdvance(effectFight,0,"",0,"");
  assert.deepEqual(JSON.parse(api.ktCoreExplods(effectFight)),[]);
  assert.equal(api.ktCoreIssues(effectFight),"");
  console.log("Native Wasm Explod / birth frame / motion / render layer / lifetime / read-only snapshots: OK (synthetic)");
} finally { api.ktCoreRelease(effectFight); }

const modifyCns=`${effectCns.replace("removetime=3","removetime=-1\nbindtime=-1")}
[State 0, modify]
type=ModifyExplod
trigger1=Time=1
id=77
scale=0,2
velocity=3,0
[State 0, release]
type=ExplodBindTime
trigger1=Time=2
id=77
time=0
[State 0, remove]
type=RemoveExplod
trigger1=Time=3
id=77`;
const modified=api.ktCoreCreate("modify","neutral",effectAir,air,modifyCns,"[Statedef 0]\nanim=0");
try {
  api.ktCoreAdvance(modified,0,"",0,"");
  api.ktCoreAdvance(modified,0,"",0,"");
  const draw=JSON.parse(api.ktCoreRenderPlan(modified,0)).draws.find(d=>d.kind==="explod");
  assert.equal(draw.spriteScaleX,0,"Zero scale must remain zero");
  assert.equal(JSON.parse(api.ktCoreExplods(modified))[0].age,1,"Modify cannot reset effect age");
  api.ktCoreAdvance(modified,0,"",0,"");
  assert.equal(JSON.parse(api.ktCoreExplods(modified))[0].x256,15*256);
  api.ktCoreAdvance(modified,0,"",0,"");
  assert.deepEqual(JSON.parse(api.ktCoreExplods(modified)),[]);
  assert.equal(api.ktCoreIssues(modified),"");
  console.log("Native Wasm ModifyExplod / zero scale / ExplodBindTime / RemoveExplod: OK (synthetic)");
} finally { api.ktCoreRelease(modified); }

// Different script units must not rescale stored physical vectors when a
// victim borrows a state. Exercise the exported ABI, not a JavaScript model.
const highAir=`[Begin Action 0]
Clsn1Default:1
Clsn1[0]=0,-189,126,0
0,0,0,0,-1`;
const highCns=`[Statedef 0]
type=S
movetype=A
physics=N
anim=0
[State 0, hit]
type=HitDef
trigger1=Time=0
id=7
damage=10
ground.velocity=6.3,-3.15
p2stateno=910
[State 0, attach]
type=TargetBind
trigger1=Time=1
id=7
time=2
pos=31.5,-15.75
[Statedef 910]
type=S
movetype=H
physics=N
[State 910, return]
type=SelfState
trigger1=Time=1
value=0`;
const mixed=api.ktCoreCreateWithDefinitions("1008 owner","320 victim",highAir,air,
  highCns,"[Statedef 0]\ntype=S\nphysics=N\nanim=0","","",
  "[Info]\nlocalcoord=1008,756","[Info]\nlocalcoord=320,240");
try {
  api.ktCoreSetup(mixed,0,0,20*256,0);
  api.ktCoreAdvance(mixed,0,"",0,"");
  const borrowed=JSON.parse(api.ktCoreSnapshot(mixed,1));
  assert.equal(borrowed.life,990);
  assert.equal(borrowed.stateOwner,1);
  assert.equal(borrowed.localCoordWidth,1008);
  assert.equal(borrowed.ownLocalCoordWidth,320);
  assert.equal(borrowed.x256,20*256);
  assert.equal(borrowed.vx256,2*256);
  assert.equal(borrowed.vy256,-256);
  api.ktCoreAdvance(mixed,0,"",0,"");
  const attached=JSON.parse(api.ktCoreSnapshot(mixed,1));
  assert.equal(attached.x256,10*256);
  assert.equal(attached.y256,-5*256);
  assert.equal(attached.bindTime,1);
  const plan=JSON.parse(api.ktCoreRenderPlan(mixed,0));
  const draw=plan.draws.find(d=>d.kind==="fighter"&&d.side===0);
  assert.ok(Math.abs(draw.pixelScaleX-1.4*320/1008)<1e-9);
  assert.ok(Math.abs(draw.pixelScaleY-1.1*320/1008)<1e-9);
  for(let i=0;i<3;i++)api.ktCoreRenderPlan(mixed,12);
  assert.deepEqual(JSON.parse(api.ktCoreSnapshot(mixed,1)),attached);
  api.ktCoreAdvance(mixed,0,"",0,"");
  const recovered=JSON.parse(api.ktCoreSnapshot(mixed,1));
  assert.equal(recovered.stateOwner,2);
  assert.equal(recovered.localCoordWidth,320);
  assert.equal(recovered.boundTo,0);
  api.ktCoreAdvance(mixed,0,"",0,"");
  assert.equal(JSON.parse(api.ktCoreSnapshot(mixed,1)).x256,12*256);
  assert.equal(api.ktCoreIssues(mixed),"");
  console.log("Native Wasm mixed-coordinate HitDef / borrowed state / TargetBind / SelfState / pixel projection: OK (synthetic)");
} finally { api.ktCoreRelease(mixed); }
