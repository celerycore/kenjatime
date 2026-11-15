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
  assert.deepEqual(JSON.parse(api.ktCoreProjectiles(handle)),[]);
  assert.deepEqual(JSON.parse(api.ktCoreProjectileClashes(handle)),[]);
  assert.deepEqual(JSON.parse(api.ktCoreProjectileHistory(handle,0)),[]);
  assert.deepEqual(JSON.parse(api.ktCoreProjectileHistory(handle,1)),[]);
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

const projectileFacingAir=`${air}
[Begin Action 200]
Clsn1Default:1
Clsn1[0]=0,-40,10,0
200,0,0,0,-1`;
const projectileFacingCns=`[Statedef 0]
type=S
physics=N
anim=0
[State 0, fire before turning]
type=Projectile
trigger1=Time=0
projid=171
projanim=200
offset=10,0
velocity=2,0
projdamage=10
projground.velocity=3,0
[State 0, turn creator]
type=Turn
trigger1=Time=0`;
const projectileFacing=api.ktCoreCreate("shooter","victim",projectileFacingAir,air,
  projectileFacingCns,"[Statedef 0]\nanim=0\nphysics=N");
try {
  api.ktCoreSetup(projectileFacing,0,0,35*256,0);
  api.ktCoreAdvance(projectileFacing,0,"",0,"");
  assert.equal(JSON.parse(api.ktCoreSnapshot(projectileFacing,0)).facing,-1);
  const shot=JSON.parse(api.ktCoreRenderPlan(projectileFacing,0)).draws.find(d=>d.kind==="projectile");
  assert.equal(shot.facing,1,"Launch controller captures facing before a later Turn controller");
  assert.equal(shot.x,480+10*1.4);
  let contacted=false;
  for(let i=0;i<15;i++) {
    api.ktCoreAdvance(projectileFacing,0,"",0,"");
    if(JSON.parse(api.ktCoreContacts(projectileFacing)).length){contacted=true;break;}
  }
  assert.ok(contacted,"Projectile must keep its forward hitboxes after the creator turns");
  const victim=JSON.parse(api.ktCoreSnapshot(projectileFacing,1));
  assert.equal(victim.life,990);
  assert.equal(victim.vx256,3*256,"Knockback follows projectile, not creator facing");
  assert.equal(JSON.parse(api.ktCoreEntities(projectileFacing)).projectiles,0);
  assert.equal(api.ktCoreIssues(projectileFacing),"");
  console.log("Native Wasm projectile launch / same-tick creator Turn / forward contact / knockback: OK (synthetic)");
} finally { api.ktCoreRelease(projectileFacing); }

// Inspect trajectory/lifetime through the actual JS-facing Wasm exports.
const motionAir=`${air}
[Begin Action 200]
200,0,0,0,1
200,1,0,0,-1`;
const motionIdle="[Statedef 0]\ntype=S\nphysics=N\nanim=0";
function projectileScript(parameters,turn=false) {
  return `${motionIdle}
[State 0, fire]
type=Projectile
trigger1=Time=0
projid=172
projanim=200
${parameters}${turn ? "\n[State 0, turn]\ntype=Turn\ntrigger1=Time=0" : ""}`;
}
const motion=api.ktCoreCreate("motion","target",motionAir,air,
  projectileScript("velocity=ifelse(1,4,8),0\naccel=2,0\nvelmul=.5,1",true),motionIdle);
try {
  api.ktCoreSetup(motion,0,0,200*256,0);
  api.ktCoreAdvance(motion,0,"",0,"");
  const [birth]=JSON.parse(api.ktCoreProjectiles(motion));
  assert.equal(birth.owner,1);assert.equal(birth.id,172);
  assert.equal(birth.x256,0);assert.equal(birth.vx256,4*256);
  assert.equal(birth.ax256,2*256);assert.equal(birth.mulX,.5);
  assert.equal(birth.ticksLeft,-1);assert.equal(birth.facing,1);assert.equal(birth.elem,1);
  assert.equal(JSON.parse(api.ktCoreSnapshot(motion,0)).facing,-1);
  for(let i=0;i<5;i++) {
    api.ktCoreRenderPlan(motion,12);api.ktCoreCamera(motion);
    assert.deepEqual(JSON.parse(api.ktCoreProjectiles(motion)),[birth]);
  }
  api.ktCoreAdvance(motion,0,"",0,"");
  let [shot]=JSON.parse(api.ktCoreProjectiles(motion));
  assert.equal(shot.x256,4*256);assert.equal(shot.vx256,3*256);assert.equal(shot.elem,2);
  api.ktCoreAdvance(motion,0,"",0,"");
  [shot]=JSON.parse(api.ktCoreProjectiles(motion));
  assert.equal(shot.x256,7*256);assert.equal(shot.vx256,2.5*256);
  for(let i=0;i<120;i++)api.ktCoreAdvance(motion,0,"",0,"");
  [shot]=JSON.parse(api.ktCoreProjectiles(motion));
  assert.equal(shot.ticksLeft,-1);assert.equal(shot.facing,1);
  assert.equal(api.ktCoreIssues(motion),"");
  console.log("Native Wasm Projectile acceleration / multiplier / launch-facing / indefinite life / pure snapshots: OK (synthetic)");
} finally { api.ktCoreRelease(motion); }

for(const lifetime of [0,2]) {
  const finite=api.ktCoreCreate("finite","target",motionAir,air,
    projectileScript(`velocity=2,0\nprojremovetime=${lifetime}`),motionIdle);
  try {
    api.ktCoreAdvance(finite,0,"",0,"");
    if(lifetime===0)assert.deepEqual(JSON.parse(api.ktCoreProjectiles(finite)),[]);
    else {
      assert.equal(JSON.parse(api.ktCoreProjectiles(finite))[0].ticksLeft,2);
      api.ktCoreAdvance(finite,0,"",0,"");
      const [shot]=JSON.parse(api.ktCoreProjectiles(finite));
      assert.equal(shot.x256,2*256);assert.equal(shot.ticksLeft,1);
      api.ktCoreAdvance(finite,0,"",0,"");
      assert.deepEqual(JSON.parse(api.ktCoreProjectiles(finite)),[]);
    }
    assert.equal(api.ktCoreIssues(finite),"");
  } finally { api.ktCoreRelease(finite); }
}

for(const returning of [false,true]) {
  const bounded=api.ktCoreCreateWithDefinitions("high-coordinate","target",motionAir,air,
    projectileScript(`offset=282,0\nvelocity=${returning ? -2 : 2},0\nprojstagebound=80`),
    motionIdle,"","","[Info]\nlocalcoord=640,480","");
  try {
    api.ktCoreSetup(bounded,0,0,50*256,0);
    api.ktCoreConfigureArena(bounded,-100,100,0,false,false);
    api.ktCoreAdvance(bounded,0,"",0,"");
    assert.equal(JSON.parse(api.ktCoreProjectiles(bounded))[0].x256,141*256);
    api.ktCoreAdvance(bounded,0,"",0,"");
    const shots=JSON.parse(api.ktCoreProjectiles(bounded));
    if(returning) {
      assert.equal(shots.length,1);assert.equal(shots[0].x256,140*256);
    } else assert.deepEqual(shots,[]);
    assert.equal(api.ktCoreIssues(bounded),"");
  } finally { api.ktCoreRelease(bounded); }
}
console.log("Native Wasm Projectile zero / finite lifetime / mixed-coordinate stage bounds / returning shots: OK (synthetic)");

const multiHitAir=`${air}
[Begin Action 210]
Clsn1Default:1
Clsn1[0]=0,-40,80,0
210,0,0,0,2
210,1,0,0,3`;
function multiHitScript(parameters) {
  return `${motionIdle}
[State 0, multi-hit shot]
type=Projectile
trigger1=Time=0
projid=173
projanim=210
damage=10,2
${parameters}`;
}
const multiHit=api.ktCoreCreate("multi-hit","target",multiHitAir,air,
  multiHitScript("projhits=3\nprojmisstime=2\nprojremove=0\npausetime=2,0\nprojremovetime=12\nvelocity=1,0"),motionIdle);
try {
  api.ktCoreSetup(multiHit,0,0,20*256,0);
  const advance=()=>api.ktCoreAdvance(multiHit,0,"",0,"");
  const shots=()=>JSON.parse(api.ktCoreProjectiles(multiHit));
  const victim=()=>JSON.parse(api.ktCoreSnapshot(multiHit,1));
  advance();assert.equal(shots()[0].hitsLeft,3);
  for(let contact=1;contact<=3;contact++) {
    advance();const shot=shots()[0];
    assert.equal(victim().life,1000-10*contact);
    assert.equal(shot.hitsLeft,3-contact);assert.equal(shot.hitPause,2);
    assert.equal(shot.missTimeLeft,2);assert.equal(shot.removeOnHit,false);
    assert.equal(JSON.parse(api.ktCoreSnapshot(multiHit,0)).hitPause,0);
    assert.equal(victim().hitPause,0);
    for(let left=1;left>=0;left--) {
      advance();
      const frozen=shots()[0];
      assert.deepEqual(frozen,{...shot,hitPause:left});
      assert.deepEqual(JSON.parse(api.ktCoreContacts(multiHit)),[]);
      api.ktCoreRenderPlan(multiHit,12);api.ktCoreCamera(multiHit);
      assert.deepEqual(shots(),[frozen]);
    }
    if(contact<3) {
      advance();assert.equal(shots()[0].missTimeLeft,1);
      assert.equal(victim().life,1000-10*contact);
      assert.deepEqual(JSON.parse(api.ktCoreContacts(multiHit)),[]);
    }
  }
  assert.equal(shots().length,1,"Spent projremove=0 shot remains visible");
  for(let i=0;i<10;i++) {advance();assert.deepEqual(JSON.parse(api.ktCoreContacts(multiHit)),[]);}
  assert.equal(victim().life,970,"Exhausted shot cannot rearm itself");
  assert.deepEqual(shots(),[],"Finite lifetime still retires an exhausted shot");
  assert.equal(api.ktCoreIssues(multiHit),"");
} finally { api.ktCoreRelease(multiHit); }

const multiRetire=api.ktCoreCreate("two hits","target",multiHitAir,air,
  multiHitScript("projhits=2\nprojmisstime=3"),motionIdle);
try {
  api.ktCoreSetup(multiRetire,0,0,20*256,0);
  for(let i=0;i<5;i++)api.ktCoreAdvance(multiRetire,0,"",0,"");
  assert.equal(JSON.parse(api.ktCoreSnapshot(multiRetire,1)).life,980);
  assert.deepEqual(JSON.parse(api.ktCoreProjectiles(multiRetire)),[]);
  assert.equal(api.ktCoreIssues(multiRetire),"");
} finally { api.ktCoreRelease(multiRetire); }
console.log("Native Wasm Projectile multi-hit / miss delay / own hitpause / finite allowance / optional hit removal: OK (synthetic)");

const clashAir=`${air}
[Begin Action 220]
Clsn1Default:1
Clsn1[0]=-10,-20,10,0
Clsn2Default:1
Clsn2[0]=-10,-20,10,0
220,0,0,0,2
220,1,0,0,3`;
function clashController(parameters) {
  return `[State 0, clash shot]
type=Projectile
trigger1=Time=0
projanim=220
damage=10
${parameters}`;
}
for(const priority of [1,3]) {
  const clash=api.ktCoreCreate("left shot","right shot",clashAir,clashAir,
    `${motionIdle}\n${clashController(`offset=25,0\nprojpriority=${priority}`)}`,
    `${motionIdle}\n${clashController("offset=25,0")}`);
  try {
    api.ktCoreSetup(clash,-30*256,0,30*256,0);
    api.ktCoreAdvance(clash,0,"",0,"");
    const birth=JSON.parse(api.ktCoreProjectiles(clash));
    assert.equal(birth.length,2);assert.equal(birth[0].priority,priority);assert.equal(birth[1].priority,1);
    assert.deepEqual(JSON.parse(api.ktCoreProjectileClashes(clash)),[],"Birth does not run a clash phase");
    api.ktCoreAdvance(clash,0,"",0,"");
    const events=JSON.parse(api.ktCoreProjectileClashes(clash));
    assert.deepEqual(events,[{first:birth[0].entityId,second:birth[1].entityId,
      firstCancelled:priority===1,secondCancelled:true}]);
    assert.deepEqual(JSON.parse(api.ktCoreContacts(clash)),[],"Cancelled shot cannot damage a fighter");
    assert.equal(JSON.parse(api.ktCoreSnapshot(clash,0)).life,1000);
    assert.equal(JSON.parse(api.ktCoreSnapshot(clash,1)).life,1000);
    const survivors=JSON.parse(api.ktCoreProjectiles(clash));
    if(priority===1)assert.deepEqual(survivors,[]);
    else {
      assert.equal(survivors.length,1);assert.equal(survivors[0].priority,2);
      assert.equal(survivors[0].hitsLeft,1);
    }
    for(let i=0;i<4;i++) {
      api.ktCoreRenderPlan(clash,12);api.ktCoreCamera(clash);
      assert.deepEqual(JSON.parse(api.ktCoreProjectileClashes(clash)),events);
      assert.deepEqual(JSON.parse(api.ktCoreProjectiles(clash)),survivors);
    }
    if(priority===3)api.ktCoreSetup(clash,-30*256,0,-5*256,0);
    api.ktCoreAdvance(clash,0,"",0,"");
    assert.deepEqual(JSON.parse(api.ktCoreProjectileClashes(clash)),[],"Clash events last one simulation tick");
    assert.equal(JSON.parse(api.ktCoreSnapshot(clash,1)).life,priority===3 ? 990 : 1000);
    assert.deepEqual(JSON.parse(api.ktCoreProjectiles(clash)),[]);
    assert.equal(api.ktCoreIssues(clash),"");
  } finally { api.ktCoreRelease(clash); }
}

const chain=api.ktCoreCreate("strong shot","nearest pair",clashAir,clashAir,
  `${motionIdle}\n${clashController("offset=30,0\nprojpriority=1+1")}`,
  `${motionIdle}\n${clashController("offset=15,0")}\n${clashController("offset=29,0")}`);
try {
  api.ktCoreSetup(chain,-30*256,0,30*256,0);
  api.ktCoreAdvance(chain,0,"",0,"");
  const birth=JSON.parse(api.ktCoreProjectiles(chain));assert.equal(birth.length,3);
  api.ktCoreAdvance(chain,0,"",0,"");
  assert.deepEqual(JSON.parse(api.ktCoreProjectileClashes(chain)),[
    {first:birth[0].entityId,second:birth[2].entityId,firstCancelled:false,secondCancelled:true},
    {first:birth[0].entityId,second:birth[1].entityId,firstCancelled:true,secondCancelled:true}
  ]);
  assert.deepEqual(JSON.parse(api.ktCoreProjectiles(chain)),[]);
  assert.deepEqual(JSON.parse(api.ktCoreContacts(chain)),[]);
  assert.equal(api.ktCoreIssues(chain),"");
} finally { api.ktCoreRelease(chain); }
console.log("Native Wasm Projectile mutual cancellation / priority spending / nearest-pair chain / fighter contact / pure events: OK (synthetic)");

const feedbackCns=`${motionIdle}
[State 0, fire]
type=Projectile
trigger1=Time=0
projid=174
projanim=210
damage=10,2
[State 0, one contact bonus]
type=PowerAdd
trigger1=ProjContact174 = 1
value=7
[State 0, follow after retirement]
type=ChangeState
triggerall=NumProjID(174)=0
triggerall=ProjContactTime(-1)=1
trigger1=ifelse((ProjContact174 = 1),1,0)
value=ifelse(ProjGuardedTime(174)=1,811,810)
[Statedef 810]
type=S
physics=N
anim=0
[Statedef 811]
type=S
physics=N
anim=0`;
for(const guarded of [false,true]) {
  const feedback=api.ktCoreCreate("feedback","target",multiHitAir,air,feedbackCns,`${motionIdle}\nctrl=1`);
  try {
    api.ktCoreSetup(feedback,0,0,20*256,0);
    const advance=()=>api.ktCoreAdvance(feedback,0,"",guarded ? 8 : 0,"");
    advance();assert.deepEqual(JSON.parse(api.ktCoreProjectileHistory(feedback,0)),[]);
    advance();
    assert.deepEqual(JSON.parse(api.ktCoreProjectiles(feedback)),[]);
    const history=[{id:174,kind:guarded ? "guarded" : "hit",tick:1,age:1}];
    assert.deepEqual(JSON.parse(api.ktCoreProjectileHistory(feedback,0)),history);
    assert.deepEqual(JSON.parse(api.ktCoreProjectileHistory(feedback,1)),[]);
    assert.equal(JSON.parse(api.ktCoreSnapshot(feedback,1)).life,guarded ? 998 : 990);
    for(let i=0;i<4;i++) {
      api.ktCoreRenderPlan(feedback,12);api.ktCoreCamera(feedback);
      assert.deepEqual(JSON.parse(api.ktCoreProjectileHistory(feedback,0)),history);
    }
    advance();
    const followed=JSON.parse(api.ktCoreSnapshot(feedback,0));
    assert.equal(followed.state,guarded ? 811 : 810);assert.equal(followed.power,7);
    assert.deepEqual(JSON.parse(api.ktCoreProjectileHistory(feedback,0)),[{...history[0],age:2}]);
    advance();advance();
    assert.equal(JSON.parse(api.ktCoreSnapshot(feedback,0)).power,7,"One-tick feedback cannot keep firing");
    assert.equal(api.ktCoreIssues(feedback),"");
  } finally { api.ktCoreRelease(feedback); }
}

const cancelFeedbackCns=`${motionIdle}
${clashController("offset=25,0\nprojid=175")}
[State 0, react to cancellation]
type=ChangeState
triggerall=ProjContact175 = 0
trigger1=ProjCancelTime(175)=1
value=812
[Statedef 812]
type=S
physics=N
anim=0`;
const cancelFeedback=api.ktCoreCreate("left feedback","right feedback",clashAir,clashAir,
  cancelFeedbackCns,cancelFeedbackCns);
try {
  api.ktCoreSetup(cancelFeedback,-30*256,0,30*256,0);
  api.ktCoreAdvance(cancelFeedback,0,"",0,"");api.ktCoreAdvance(cancelFeedback,0,"",0,"");
  for(const side of [0,1])assert.deepEqual(JSON.parse(api.ktCoreProjectileHistory(cancelFeedback,side)),
    [{id:175,kind:"cancel",tick:1,age:1}]);
  api.ktCoreAdvance(cancelFeedback,0,"",0,"");
  assert.equal(JSON.parse(api.ktCoreSnapshot(cancelFeedback,0)).state,812);
  assert.equal(JSON.parse(api.ktCoreSnapshot(cancelFeedback,1)).state,812);
  assert.equal(api.ktCoreIssues(cancelFeedback),"");
} finally { api.ktCoreRelease(cancelFeedback); }

const latestFeedback=api.ktCoreCreate("latest feedback","target",multiHitAir,air,`${motionIdle}
[State 0, first hit]
type=Projectile
trigger1=Time=0
projid=176
projanim=210
damage=10,2
[State 0, later guard]
type=Projectile
trigger1=Time=2
projid=177
projanim=210
damage=10,2
[State 0, compare latest contact with remembered hit]
type=PowerAdd
triggerall=ProjGuardedTime(177)=1
triggerall=ProjHitTime(176)=-1
triggerall=ProjContactTime(176)=-1
trigger1=ProjHit176 = 1, < 5
value=11`,`${motionIdle}\nctrl=1`);
try {
  api.ktCoreSetup(latestFeedback,0,0,20*256,0);
  for(let i=0;i<3;i++)api.ktCoreAdvance(latestFeedback,0,"",0,"");
  api.ktCoreDebugForceState(latestFeedback,1,0);
  api.ktCoreAdvance(latestFeedback,0,"",8,"");
  assert.deepEqual(JSON.parse(api.ktCoreProjectileHistory(latestFeedback,0)),[
    {id:176,kind:"hit",tick:1,age:3},{id:177,kind:"guarded",tick:3,age:1}
  ]);
  api.ktCoreAdvance(latestFeedback,0,"",8,"");
  assert.equal(JSON.parse(api.ktCoreSnapshot(latestFeedback,0)).power,11);
  assert.equal(api.ktCoreIssues(latestFeedback),"");
} finally { api.ktCoreRelease(latestFeedback); }
console.log("Native Wasm Projectile hit/guard/cancel history / CNS follow-ups after retirement / latest-event times / legacy ID windows: OK (synthetic)");

const scaleAir=`${air}
[Begin Action 230]
Clsn1Default:1
Clsn1[0]=0,-20,10,0
Clsn2Default:1
Clsn2[0]=0,-20,10,0
230,0,8,-4,-1`;
function scaleCns(doScale,offset=0) {
  return `[Size]
xscale=2
yscale=.5
proj.doscale=${doScale}
${motionIdle}
[State 0, scaled shot]
type=Projectile
trigger1=Time=0
projid=178
projanim=230
projscale=ifelse(1,1.5,1),.5
offset=${offset},0
damage=10`;
}
for(const doScale of [0,1]) {
  const scaled=api.ktCoreCreateWithDefinitions("scaled shot","target",scaleAir,air,
    scaleCns(doScale),motionIdle,"","","[Info]\nlocalcoord=640,480","");
  try {
    api.ktCoreSetup(scaled,0,0,20*256,0);
    api.ktCoreAdvance(scaled,0,"",0,"");
    const [shot]=JSON.parse(api.ktCoreProjectiles(scaled));
    assert.equal(shot.scaleX,doScale ? 3 : 1.5);assert.equal(shot.scaleY,doScale ? .25 : .5);
    const draw=JSON.parse(api.ktCoreRenderPlan(scaled,0)).draws.find(d=>d.kind==="projectile");
    assert.equal(draw.spriteScaleX,doScale ? 1.5 : .75);
    assert.equal(draw.spriteScaleY,doScale ? .125 : .25);
    assert.ok(Math.abs(draw.x-(480+8*draw.pixelScaleX))<1e-9);
    assert.ok(Math.abs(draw.y-(435-4*draw.pixelScaleY))<1e-9);
    for(let i=0;i<4;i++) {
      api.ktCoreRenderPlan(scaled,12);api.ktCoreCamera(scaled);
      assert.deepEqual(JSON.parse(api.ktCoreProjectiles(scaled)),[shot]);
    }
    api.ktCoreAdvance(scaled,0,"",0,"");
    assert.equal(JSON.parse(api.ktCoreSnapshot(scaled,1)).life,doScale ? 990 : 1000,
      "Body Size must affect projectile hit reach only when opted in");
    assert.equal(JSON.parse(api.ktCoreProjectiles(scaled)).length,doScale ? 0 : 1);
    assert.equal(api.ktCoreIssues(scaled),"");
  } finally { api.ktCoreRelease(scaled); }
  const clash=api.ktCoreCreateWithDefinitions("scaled clash","opposing shot",scaleAir,scaleAir,
    scaleCns(doScale,60),`${motionIdle}\n[State 0, opposing]\ntype=Projectile\ntrigger1=Time=0\nprojanim=230\noffset=10,0`,
    "","","[Info]\nlocalcoord=640,480","");
  try {
    api.ktCoreSetup(clash,-30*256,0,30*256,0);
    api.ktCoreAdvance(clash,0,"",0,"");api.ktCoreAdvance(clash,0,"",0,"");
    assert.equal(JSON.parse(api.ktCoreProjectileClashes(clash)).length,doScale ? 1 : 0);
    assert.equal(JSON.parse(api.ktCoreProjectiles(clash)).length,doScale ? 0 : 2);
    assert.equal(api.ktCoreIssues(clash),"");
  } finally { api.ktCoreRelease(clash); }
}
console.log("Native Wasm Projectile scale / opt-in body Size / mixed coordinates / AIR offsets / hit and clash reach: OK (synthetic)");

const filterAttack=`[Statedef 0]
anim=0
type=S
physics=N
[State 0, attack]
type=HitDef
trigger1=Time=0
attr=S,NA
damage=10,3
guardflag=HL
id=71`;
const filterDefense=`[Statedef 0]
anim=0
type=S
physics=N
ctrl=1
[State 0, timed invulnerability]
type=NotHitBy
trigger1=Time=0
value=SCA
time=3`;
const filtered=api.ktCoreCreate("attacker","filtered",bindAir,air,filterAttack,filterDefense);
try {
  api.ktCoreSetup(filtered,0,0,20*256,0);
  for(let left=3;left>=1;left--) {
    api.ktCoreAdvance(filtered,0,"",8,"");
    const snapshot=JSON.parse(api.ktCoreSnapshot(filtered,1));
    assert.equal(snapshot.hitFilter1Time,left);
    assert.equal(snapshot.life,1000);
    assert.deepEqual(JSON.parse(api.ktCoreContacts(filtered)),[]);
    for(let i=0;i<3;i++)api.ktCoreRenderPlan(filtered,12);
    assert.deepEqual(JSON.parse(api.ktCoreSnapshot(filtered,1)),snapshot);
  }
  api.ktCoreAdvance(filtered,0,"",8,"");
  const recovered=JSON.parse(api.ktCoreSnapshot(filtered,1));
  assert.equal(recovered.hitFilter1Time,0);
  assert.equal(recovered.life,997,"Standard HitDef damage pair supplies guard chip");
  assert.equal(JSON.parse(api.ktCoreContacts(filtered))[0].guarded,true);
  assert.equal(JSON.parse(api.ktCoreSnapshot(filtered,0)).numTargets,0);
  assert.equal(api.ktCoreIssues(filtered),"");
  console.log("Native Wasm NotHitBy / exact lifetime / deferred contact / guard chip / read-only snapshots: OK (synthetic)");
} finally { api.ktCoreRelease(filtered); }

const clearDefense=filterDefense.replace("time=3","time=-1")+`
[State 0, clear slot]
type=HitBy
trigger1=Time=2
value=
time=0`;
const cleared=api.ktCoreCreate("attacker","clear filter",bindAir,air,filterAttack,clearDefense);
try {
  api.ktCoreSetup(cleared,0,0,20*256,0);
  for(let i=0;i<2;i++) {
    api.ktCoreAdvance(cleared,0,"",0,"");
    assert.equal(JSON.parse(api.ktCoreSnapshot(cleared,1)).hitFilter1Time,-1);
    assert.equal(JSON.parse(api.ktCoreSnapshot(cleared,1)).life,1000);
  }
  api.ktCoreAdvance(cleared,0,"",0,"");
  assert.equal(JSON.parse(api.ktCoreSnapshot(cleared,1)).life,990);
  assert.equal(JSON.parse(api.ktCoreSnapshot(cleared,1)).hitFilter1Time,0);
  assert.equal(api.ktCoreIssues(cleared),"");
  console.log("Native Wasm HitBy / indefinite NotHitBy / explicit slot clearing / hit capture: OK (synthetic)");
} finally { api.ktCoreRelease(cleared); }

const helperPauseCns=`[Statedef 0]
anim=0
[State 0, helper]
type=Helper
trigger1=Time=0
stateno=300
[Statedef 300]
type=S
anim=0
[State 300, maintain HitDef during hitpause]
type=HitDef
trigger1=1
ignorehitpause=1
attr=S,NA
damage=1
pausetime=3,0
[State 300, rearm through state entry on first paused tick]
type=ChangeState
trigger1=Time=1
ignorehitpause=1
value=300`;
const helperPaused=api.ktCoreCreate("parent","victim",bindAir,air,helperPauseCns,"[Statedef 0]\nanim=0");
try {
  api.ktCoreSetup(helperPaused,0,0,20*256,0);
  const contactTicks=[];
  for(let tick=0;tick<10;tick++) {
    api.ktCoreAdvance(helperPaused,0,"",0,"");
    if(JSON.parse(api.ktCoreContacts(helperPaused)).length)contactTicks.push(tick);
  }
  assert.deepEqual(contactTicks,[1,5,9],"All three paused ticks must block helper contact, including counter=0");
  assert.equal(JSON.parse(api.ktCoreSnapshot(helperPaused,1)).life,997);
  assert.equal(api.ktCoreIssues(helperPaused),"");
  console.log("Native Wasm helper / ignorehitpause HitDef / final frozen contact tick: OK (synthetic)");
} finally { api.ktCoreRelease(helperPaused); }

const overrideDefense=`[Statedef 0]
anim=0
type=S
physics=N
ctrl=1
[State 0, own reaction]
type=HitOverride
trigger1=Time=0
attr=SCA,AA,AP
stateno=700
time=-1
forceair=1
[Statedef 700]
type=S
movetype=H
physics=N
anim=0
velset=0,0
[State 700, armor]
type=LifeAdd
trigger1=Time=0
value=GetHitVar(damage)
[State 700, observe incoming velocity]
type=VarSet
trigger1=Time=0
fv=0
value=GetHitVar(xvel)
[State 700, recover]
type=SelfState
trigger1=GetHitVar(hittime)<0
value=0`;
const overrideAttack=filterAttack+`
air.velocity=4,-6
air.hittime=2
air.fall=1
pausetime=0,2`;
const overridden=api.ktCoreCreate("attacker","armor",bindAir,air,overrideAttack,overrideDefense);
try {
  api.ktCoreSetup(overridden,0,0,20*256,0);
  api.ktCoreAdvance(overridden,0,"",0,"");
  const hit=JSON.parse(api.ktCoreSnapshot(overridden,1));
  assert.equal(hit.state,700);
  assert.equal(hit.stateOwner,2);
  assert.equal(hit.life,990);
  assert.equal(hit.vx256,0,"Override StateDef velset must take precedence over physical knockback");
  assert.equal(hit.getHitX256,4*256);
  assert.equal(hit.getHitY256,-6*256);
  assert.equal(hit.getHitTime,2);
  assert.equal(hit.getHitFall,true);
  assert.deepEqual(hit.hitOverrideTimes,[-1,0,0,0,0,0,0,0]);
  for(let i=0;i<3;i++)api.ktCoreRenderPlan(overridden,12);
  assert.deepEqual(JSON.parse(api.ktCoreSnapshot(overridden,1)),hit);
  for(let i=0;i<2;i++) {
    api.ktCoreAdvance(overridden,0,"",0,"");
    const frozen=JSON.parse(api.ktCoreSnapshot(overridden,1));
    assert.equal(frozen.life,990);
    assert.equal(frozen.getHitTime,2);
    assert.equal(frozen.hitPauseThisTick,true);
  }
  api.ktCoreAdvance(overridden,0,"",0,"");
  assert.equal(JSON.parse(api.ktCoreSnapshot(overridden,1)).life,1000,"Armor reads GetHitVar(damage)");
  api.ktCoreAdvance(overridden,0,"",0,"");
  api.ktCoreAdvance(overridden,0,"",0,"");
  const recovered=JSON.parse(api.ktCoreSnapshot(overridden,1));
  assert.equal(recovered.state,0);
  assert.equal(recovered.getHitTime,-1);
  assert.equal(api.ktCoreIssues(overridden),"");
  console.log("Native Wasm HitOverride / forceair / own-bank reaction / GetHitVar armor / pause and recovery: OK (synthetic)");
} finally { api.ktCoreRelease(overridden); }

const transferAttack=filterAttack+`
p2stateno=900
[Statedef 900]
type=S
movetype=H
anim=0`;
const clearOverrideDefense=overrideDefense+`
[State 0, release route]
type=HitOverride
trigger1=Time=2
time=0`;
const protectedTransfer=api.ktCoreCreate("attacker","protected",bindAir,air,transferAttack,clearOverrideDefense);
try {
  api.ktCoreSetup(protectedTransfer,0,0,20*256,0);
  for(let i=0;i<2;i++) {
    api.ktCoreAdvance(protectedTransfer,0,"",0,"");
    assert.equal(JSON.parse(api.ktCoreSnapshot(protectedTransfer,1)).life,1000);
    assert.deepEqual(JSON.parse(api.ktCoreContacts(protectedTransfer)),[]);
    assert.equal(JSON.parse(api.ktCoreSnapshot(protectedTransfer,0)).numTargets,0);
  }
  api.ktCoreAdvance(protectedTransfer,0,"",0,"");
  const transferred=JSON.parse(api.ktCoreSnapshot(protectedTransfer,1));
  assert.equal(transferred.life,990);
  assert.equal(transferred.state,900);
  assert.equal(transferred.stateOwner,1);
  assert.equal(api.ktCoreIssues(protectedTransfer),"");
  console.log("Native Wasm matching override / rejected foreign-state hit / explicit clear / deferred capture: OK (synthetic)");
} finally { api.ktCoreRelease(protectedTransfer); }

const canonicalProjectile=`[Statedef 0]
anim=0
[State 0, projectile]
type=Projectile
trigger1=Time=0
projanim=0
velocity=1,0
attr=S,SP
damage=17,3
air.velocity=4,-6
air.hittime=7
air.fall=1`;
const projectileOverride=api.ktCoreCreate("projectile","armor",bindAir,air,canonicalProjectile,overrideDefense);
try {
  api.ktCoreSetup(projectileOverride,0,0,20*256,0);
  api.ktCoreAdvance(projectileOverride,0,"",0,"");
  api.ktCoreAdvance(projectileOverride,0,"",0,"");
  const snapshot=JSON.parse(api.ktCoreSnapshot(projectileOverride,1));
  assert.equal(snapshot.state,700);
  assert.equal(snapshot.life,983);
  assert.equal(snapshot.getHitX256,4*256);
  assert.equal(snapshot.getHitY256,-6*256);
  assert.equal(snapshot.getHitTime,7);
  assert.equal(JSON.parse(api.ktCoreEntities(projectileOverride)).projectiles,0);
  assert.equal(api.ktCoreIssues(projectileOverride),"");
  console.log("Native Wasm canonical Projectile HitDef fields / forceair override / incoming data: OK (synthetic)");
} finally { api.ktCoreRelease(projectileOverride); }

const fallbackAttack=filterAttack+`
ground.velocity=2,-4
ground.hittime=1
pausetime=0,3`;
const fallbackIdle=`[Statedef 0]
type=S
physics=N
ctrl=1
anim=0
[Statedef 52]
type=S
ctrl=0
anim=0`;
const fallback=api.ktCoreCreate("attacker","missing common states",bindAir,air,fallbackAttack,fallbackIdle);
try {
  api.ktCoreConfigureArena(fallback,-250,250,30,false,false);
  api.ktCoreSetup(fallback,0,30*256,20*256,30*256);
  api.ktCoreAdvance(fallback,0,"",0,"");
  const hit=JSON.parse(api.ktCoreSnapshot(fallback,1));
  assert.equal(hit.state,5000);
  assert.equal(hit.stateType,"A");
  assert.equal(hit.fallbackHitReaction,true);
  for(let i=0;i<3;i++) {
    api.ktCoreAdvance(fallback,0,"",0,"");
    const frozen=JSON.parse(api.ktCoreSnapshot(fallback,1));
    assert.equal(frozen.y256,30*256);
    assert.equal(frozen.vy256,-4*256);
    assert.equal(frozen.hitPauseThisTick,true);
  }
  api.ktCoreAdvance(fallback,0,"",0,"");
  const launched=JSON.parse(api.ktCoreSnapshot(fallback,1));
  assert.equal(launched.state,5000,"Expired stun must not return an airborne fallback to standing idle");
  assert.ok(launched.y256<30*256);
  for(let i=0;i<3;i++)api.ktCoreRenderPlan(fallback,12);
  assert.deepEqual(JSON.parse(api.ktCoreSnapshot(fallback,1)),launched);
  for(let i=0;i<100;i++)api.ktCoreAdvance(fallback,0,"",0,"");
  const landed=JSON.parse(api.ktCoreSnapshot(fallback,1));
  assert.equal(landed.state,0);
  assert.equal(landed.y256,30*256);
  assert.equal(landed.vx256,0);
  assert.equal(landed.vy256,0);
  assert.equal(landed.ctrl,1);
  assert.equal(landed.fallbackHitReaction,false);
  for(let i=0;i<100;i++)api.ktCoreAdvance(fallback,0,"",0,"");
  assert.equal(JSON.parse(api.ktCoreSnapshot(fallback,1)).x256,landed.x256);
  assert.equal(api.ktCoreIssues(fallback),"");
  console.log("Native Wasm missing common states / hitpause / launch / nonzero floor / stable recovery: OK (synthetic)");
} finally { api.ktCoreRelease(fallback); }

const fallbackKo=api.ktCoreCreate("attacker","KO fallback",bindAir,air,
  fallbackAttack.replace("damage=10,3","damage=1000,3"),fallbackIdle);
try {
  api.ktCoreConfigureArena(fallbackKo,-250,250,0,false,false);
  api.ktCoreSetup(fallbackKo,0,0,20*256,0);
  for(let i=0;i<120;i++)api.ktCoreAdvance(fallbackKo,0,"",0,"");
  const ko=JSON.parse(api.ktCoreSnapshot(fallbackKo,1));
  assert.equal(ko.life,0);
  assert.equal(ko.state,5150);
  assert.equal(ko.y256,0);
  assert.equal(ko.vx256,0);
  assert.equal(ko.vy256,0);
  assert.equal(ko.ctrl,0);
  assert.equal(api.ktCoreIssues(fallbackKo),"");
  console.log("Native Wasm missing KO state / gravity / landing / motion stop: OK (synthetic)");
} finally { api.ktCoreRelease(fallbackKo); }

const fallbackProjectileCns=canonicalProjectile.replace("air.velocity=4,-6",`ground.velocity=3,-5
ground.hittime=1
pausetime=0,1
air.velocity=4,-6`);
const fallbackProjectile=api.ktCoreCreate("projectile","fallback target",bindAir,air,fallbackProjectileCns,fallbackIdle);
try {
  api.ktCoreConfigureArena(fallbackProjectile,-250,250,0,false,false);
  api.ktCoreSetup(fallbackProjectile,0,0,20*256,0);
  api.ktCoreAdvance(fallbackProjectile,0,"",0,"");
  api.ktCoreAdvance(fallbackProjectile,0,"",0,"");
  assert.equal(JSON.parse(api.ktCoreSnapshot(fallbackProjectile,1)).fallbackHitReaction,true);
  for(let i=0;i<120;i++)api.ktCoreAdvance(fallbackProjectile,0,"",0,"");
  const recovered=JSON.parse(api.ktCoreSnapshot(fallbackProjectile,1));
  assert.equal(recovered.life,983);
  assert.equal(recovered.state,0);
  assert.equal(recovered.y256,0);
  assert.equal(recovered.vx256,0);
  assert.equal(recovered.vy256,0);
  assert.equal(api.ktCoreIssues(fallbackProjectile),"");
  console.log("Native Wasm projectile knockback / missing-state fallback / landing and recovery: OK (synthetic)");
} finally { api.ktCoreRelease(fallbackProjectile); }

const pairedThrowCns=`[Statedef 0]
type=S
movetype=A
physics=N
anim=0
ctrl=1
[State 0, paired throw]
type=HitDef
trigger1=Time=0
attr=S,NT
damage=10,3
guardflag=HL
id=71
p1stateno=811
p2stateno=820
[Statedef 811]
type=S
movetype=A
physics=N
anim=0
ctrl=0
[State 811, attach captured target]
type=TargetBind
trigger1=Time=0
id=71
pos=20,-5
time=2
[Statedef 820]
type=S
movetype=H
physics=N
anim=0
[State 820, recover]
type=SelfState
trigger1=Time=2
value=0`;
const pairedThrow=api.ktCoreCreate("thrower","victim",bindAir,air,pairedThrowCns,fallbackIdle);
try {
  api.ktCoreSetup(pairedThrow,0,0,20*256,0);
  api.ktCoreAdvance(pairedThrow,0,"",0,"");
  const attacker=JSON.parse(api.ktCoreSnapshot(pairedThrow,0));
  const victim=JSON.parse(api.ktCoreSnapshot(pairedThrow,1));
  assert.equal(attacker.state,811);
  assert.equal(attacker.moveType,"A");
  assert.equal(attacker.stateTime,0,"Follow-up controllers start on the next actor phase");
  assert.equal(attacker.numTargets,1);
  assert.equal(victim.state,820);
  assert.equal(victim.stateOwner,1);
  assert.equal(victim.life,990);
  for(let i=0;i<3;i++)api.ktCoreRenderPlan(pairedThrow,12);
  assert.deepEqual(JSON.parse(api.ktCoreSnapshot(pairedThrow,0)),attacker);
  api.ktCoreAdvance(pairedThrow,0,"",0,"");
  const bound=JSON.parse(api.ktCoreSnapshot(pairedThrow,1));
  assert.equal(bound.boundTo,1);
  assert.equal(bound.x256,20*256);
  assert.equal(bound.y256,-5*256);
  api.ktCoreAdvance(pairedThrow,0,"",0,"");
  api.ktCoreAdvance(pairedThrow,0,"",0,"");
  assert.equal(JSON.parse(api.ktCoreSnapshot(pairedThrow,1)).stateOwner,2);
  assert.equal(JSON.parse(api.ktCoreSnapshot(pairedThrow,0)).numTargets,0);
  assert.equal(api.ktCoreIssues(pairedThrow),"");
  console.log("Native Wasm HitDef p1stateno / paired P2 state / capture / bind / SelfState release: OK (synthetic)");
} finally { api.ktCoreRelease(pairedThrow); }

const guardedFollow=api.ktCoreCreate("attacker","guard",bindAir,air,pairedThrowCns,fallbackIdle);
try {
  api.ktCoreSetup(guardedFollow,0,0,20*256,0);
  api.ktCoreAdvance(guardedFollow,0,"",8,"");
  assert.equal(JSON.parse(api.ktCoreSnapshot(guardedFollow,0)).state,0);
  assert.equal(JSON.parse(api.ktCoreSnapshot(guardedFollow,1)).life,997);
  assert.equal(JSON.parse(api.ktCoreContacts(guardedFollow))[0].guarded,true);
  assert.equal(api.ktCoreIssues(guardedFollow),"");
  console.log("Native Wasm guarded contact leaves p1stateno unapplied: OK (synthetic)");
} finally { api.ktCoreRelease(guardedFollow); }

const tradedFollow=api.ktCoreCreate("trade A","trade B",bindAir,bindAir,pairedThrowCns,pairedThrowCns);
try {
  api.ktCoreSetup(tradedFollow,0,0,20*256,0);
  api.ktCoreAdvance(tradedFollow,0,"",0,"");
  assert.equal(JSON.parse(api.ktCoreContacts(tradedFollow)).length,2);
  const a=JSON.parse(api.ktCoreSnapshot(tradedFollow,0));
  const b=JSON.parse(api.ktCoreSnapshot(tradedFollow,1));
  assert.equal(a.life,990);assert.equal(b.life,990);
  assert.equal(a.state,820);assert.equal(b.state,820);
  assert.equal(a.stateOwner,2);assert.equal(b.stateOwner,1);
  assert.equal(api.ktCoreIssues(tradedFollow),"");
  console.log("Native Wasm paired throw trade preserves both incoming reactions: OK (synthetic policy)");
} finally { api.ktCoreRelease(tradedFollow); }

const projectileFollowCns=`[Statedef 0]
anim=0
[State 0, projectile]
type=Projectile
trigger1=Time=0
projanim=0
velocity=1,0
attr=S,SP
damage=17
id=71
p1stateno=811
p2stateno=820
${pairedThrowCns.slice(pairedThrowCns.indexOf('[Statedef 811]'))}`;
const projectileFollow=api.ktCoreCreate("projectile owner","victim",bindAir,air,projectileFollowCns,fallbackIdle);
try {
  api.ktCoreSetup(projectileFollow,0,0,20*256,0);
  api.ktCoreAdvance(projectileFollow,0,"",0,"");
  api.ktCoreAdvance(projectileFollow,0,"",0,"");
  assert.equal(JSON.parse(api.ktCoreSnapshot(projectileFollow,0)).state,811);
  assert.equal(JSON.parse(api.ktCoreSnapshot(projectileFollow,1)).life,983);
  api.ktCoreAdvance(projectileFollow,0,"",0,"");
  assert.equal(JSON.parse(api.ktCoreSnapshot(projectileFollow,1)).boundTo,1,"Projectile HitDef id must drive TargetBind");
  assert.equal(api.ktCoreIssues(projectileFollow),"");
  console.log("Native Wasm Projectile p1stateno / canonical hit ID / captured-target binding: OK (synthetic)");
} finally { api.ktCoreRelease(projectileFollow); }
