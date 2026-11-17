import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
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

// Keep CNS feedback bonuses observable independently of ordinary contact power.
const feedbackCns=`${motionIdle}
[State 0, fire]
type=Projectile
trigger1=Time=0
projid=174
projanim=210
damage=10,2
getpower=0
givepower=0
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
getpower=0
givepower=0
[State 0, later guard]
type=Projectile
trigger1=Time=2
projid=177
projanim=210
damage=10,2
getpower=0
givepower=0
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

for(const projectile of [false,true])for(const guarded of [false,true]) {
  const controller=`type=${projectile ? "Projectile" : "HitDef"}
trigger1=Time=0
projanim=200
projhits=2
projmisstime=20
damage=10,2
guardflag=HL
pausetime=7,9
guard.pausetime=ifelse(1,2,4),max(3,5)`;
  const script=projectile ? `${motionIdle}\n[State 0, shot]\n${controller}` :
    `${motionIdle}\n[Statedef 200]\ntype=S\nphysics=N\nanim=200\n[State 200, hit]\n${controller}`;
  const pauses=api.ktCoreCreate("independent pauses","target",projectileFacingAir,air,script,`${motionIdle}\nctrl=1`);
  try {
    api.ktCoreSetup(pauses,0,0,5*256,0);
    if(projectile)api.ktCoreAdvance(pauses,0,"",guarded ? 8 : 0,"");
    else api.ktCoreDebugForceState(pauses,0,200);
    api.ktCoreAdvance(pauses,0,"",guarded ? 8 : 0,"");
    const expectedAttacker=guarded ? 2 : 7,expectedDefender=guarded ? 5 : 9;
    assert.equal(JSON.parse(api.ktCoreSnapshot(pauses,1)).hitPause,expectedDefender);
    assert.equal(JSON.parse(api.ktCoreSnapshot(pauses,1)).life,guarded ? 998 : 990);
    if(projectile) {
      assert.equal(JSON.parse(api.ktCoreProjectiles(pauses))[0].hitPause,expectedAttacker);
      assert.equal(JSON.parse(api.ktCoreSnapshot(pauses,0)).hitPause,0);
    } else assert.equal(JSON.parse(api.ktCoreSnapshot(pauses,0)).hitPause,expectedAttacker);
    for(let i=0;i<4;i++)api.ktCoreRenderPlan(pauses,12);
    assert.equal(JSON.parse(api.ktCoreSnapshot(pauses,1)).hitPause,expectedDefender);
    api.ktCoreAdvance(pauses,0,"",0,"");
    assert.equal(JSON.parse(api.ktCoreSnapshot(pauses,1)).hitPause,expectedDefender-1);
    assert.equal(api.ktCoreIssues(pauses),"");
  } finally { api.ktCoreRelease(pauses); }
}
console.log("Native Wasm independent attacker/defender hit and guard pause / nested expressions / projectile clocks: OK (synthetic)");

for(const projectile of [false,true])for(const guarded of [false,true])for(const lethal of [false,true]) {
  const controller=`type=${projectile ? "Projectile" : "HitDef"}
trigger1=Time=0
projanim=200
damage=50,50
guardflag=HL
kill=${lethal ? 1 : 0}
guard.kill=${lethal ? 1 : 0}`;
  const script=projectile ? `${motionIdle}\n[State 0, shot]\n${controller}` :
    `${motionIdle}\n[Statedef 200]\ntype=S\nphysics=N\nanim=200\n[State 200, hit]\n${controller}`;
  const kills=api.ktCoreCreate("lethality","target",projectileFacingAir,air,script,`${motionIdle}\nctrl=1`);
  try {
    api.ktCoreSetup(kills,0,0,5*256,0);api.ktCoreDebugSetStats(kills,1,10,0);
    if(projectile)api.ktCoreAdvance(kills,0,"",guarded ? 8 : 0,"");
    else api.ktCoreDebugForceState(kills,0,200);
    api.ktCoreAdvance(kills,0,"",guarded ? 8 : 0,"");
    const victim=JSON.parse(api.ktCoreSnapshot(kills,1));
    assert.equal(victim.life,lethal ? 0 : 1);
    assert.equal(victim.state,lethal ? 5150 : guarded ? 150 : 5000);
    assert.equal(victim.getHitDamage,50,"Incoming damage metadata remains independent of the life floor");
    assert.equal(JSON.parse(api.ktCoreContacts(kills))[0].damage,50);
    if(projectile)assert.deepEqual(JSON.parse(api.ktCoreProjectiles(kills)),[]);
    for(let i=0;i<4;i++)api.ktCoreRenderPlan(kills,12);
    assert.deepEqual(JSON.parse(api.ktCoreSnapshot(kills,1)),victim);
    assert.equal(api.ktCoreIssues(kills),"");
  } finally { api.ktCoreRelease(kills); }
}
console.log("Native Wasm root/projectile hit and guard lethality flags / one-life floor / KO states / pure snapshots: OK (synthetic)");

const hitFlagStates=`${motionIdle}
movetype=I
ctrl=1
[Statedef 700]
type=S
movetype=H
physics=N
anim=0
[Statedef 701]
type=C
movetype=I
physics=N
anim=0
[Statedef 702]
type=A
movetype=I
physics=N
anim=0
[Statedef 703]
type=A
movetype=H
physics=N
anim=0
[Statedef 704]
type=L
movetype=H
physics=N
anim=0
[Statedef 150]
type=S
movetype=H
physics=N
anim=0
[Statedef 5000]
type=S
movetype=H
physics=N
anim=0`;
for(const projectile of [false,true])for(const [flags,state,accepted] of [
  ["H",0,true],["H",701,false],["L",0,false],["L",701,true],
  ["M",0,true],["M",701,true],["M+",0,false],["M+",700,true],["M+",150,false],
  ["M-",0,true],["M-",700,false],["M-",150,false],
  ["MA",702,true],["MF",702,false],["MA+",703,true],["MD+",704,true],["MAF",704,false]
]) {
  const controller=`type=${projectile ? "Projectile" : "HitDef"}
trigger1=Time=0
projanim=200
projid=182
projhits=2
damage=10
hitflag=${flags}`;
  const script=projectile ? `${hitFlagStates}\n[State 0, shot]\n${controller}` :
    `${hitFlagStates}\n[Statedef 200]\ntype=S\nphysics=N\nanim=200\n[State 200, hit]\n${controller}`;
  const eligibility=api.ktCoreCreate("hit flags","target",projectileFacingAir,air,script,hitFlagStates);
  try {
    api.ktCoreSetup(eligibility,0,0,5*256,0);api.ktCoreDebugForceState(eligibility,1,state);
    if(projectile)api.ktCoreAdvance(eligibility,0,"",0,"");
    else api.ktCoreDebugForceState(eligibility,0,200);
    api.ktCoreAdvance(eligibility,0,"",0,"");
    const victim=JSON.parse(api.ktCoreSnapshot(eligibility,1));
    assert.equal(victim.life,accepted ? 990 : 1000,`${projectile ? "projectile" : "root"}/${flags}/${state}`);
    assert.equal(JSON.parse(api.ktCoreContacts(eligibility)).length,accepted ? 1 : 0);
    assert.equal(victim.getHitDamage,accepted ? 10 : 0);
    if(projectile) {
      assert.equal(JSON.parse(api.ktCoreProjectiles(eligibility))[0].hitsLeft,accepted ? 1 : 2);
      assert.equal(JSON.parse(api.ktCoreProjectileHistory(eligibility,0)).length,accepted ? 1 : 0);
    }
    for(let i=0;i<3;i++)api.ktCoreRenderPlan(eligibility,12);
    assert.deepEqual(JSON.parse(api.ktCoreSnapshot(eligibility,1)),victim);
    assert.equal(api.ktCoreIssues(eligibility),"");
  } finally { api.ktCoreRelease(eligibility); }
}
for(const flags of ["MA","MAF"]) {
  const script=`${hitFlagStates}
[Statedef 200]
type=S
physics=N
anim=200
[State 200, seed fall]
type=HitDef
trigger1=Time=0
damage=10
fall=1
[Statedef 201]
type=S
physics=N
anim=200
[State 201, follow-up]
type=HitDef
trigger1=Time=0
damage=10
hitflag=${flags}`;
  const falling=api.ktCoreCreate("fall eligibility","target",projectileFacingAir,air,script,hitFlagStates);
  try {
    api.ktCoreSetup(falling,0,0,5*256,0);api.ktCoreDebugForceState(falling,0,200);
    api.ktCoreAdvance(falling,0,"",0,"");api.ktCoreDebugForceState(falling,1,703);
    assert.equal(JSON.parse(api.ktCoreSnapshot(falling,1)).getHitFall,true);
    api.ktCoreDebugForceState(falling,0,201);api.ktCoreAdvance(falling,0,"",0,"");
    assert.equal(JSON.parse(api.ktCoreSnapshot(falling,1)).life,flags==="MAF" ? 980 : 990);
    assert.equal(api.ktCoreIssues(falling),"");
  } finally { api.ktCoreRelease(falling); }
}
console.log("Native Wasm hitflag posture / combo-only and non-combo restrictions / guard exclusion / falling eligibility / rejected projectile allowance and history: OK (synthetic)");

const targetMotion=api.ktCoreCreateWithDefinitions("target controls","victim",projectileFacingAir,air,
  `${motionIdle}
[Statedef 200]
type=S
physics=N
anim=200
[State 200, capture]
type=HitDef
trigger1=Time=0
id=181
damage=10
getpower=0
givepower=0
ground.hittime=60
[State 200, turn victim]
type=TargetFacing
trigger1=Time=1
id=181
value=-1
[State 200, set velocity in captor direction]
type=TargetVelSet
trigger1=Time=1
id=181
x=8
y=-4
[State 200, add in target direction]
type=TargetVelAdd
trigger1=Time=1
id=181
x=2
y=-2
[State 200, release captured list]
type=TargetDrop
trigger1=Time=2
[State 200, cannot move a dropped target]
type=TargetVelSet
trigger1=Time=2
x=50
[State 200, observe cleared targets immediately]
type=PowerAdd
trigger1=Time=2 && NumTarget=0
value=7`,motionIdle,"","","[Info]\nlocalcoord=640,480","");
try {
  api.ktCoreSetup(targetMotion,0,0,5*256,0);
  api.ktCoreDebugForceState(targetMotion,0,200);
  api.ktCoreAdvance(targetMotion,0,"",0,"");
  assert.equal(JSON.parse(api.ktCoreSnapshot(targetMotion,0)).numTargets,1);
  api.ktCoreAdvance(targetMotion,0,"",0,"");
  const victim=JSON.parse(api.ktCoreSnapshot(targetMotion,1));
  assert.equal(victim.facing,-1);assert.equal(victim.vx256,3*256);assert.equal(victim.vy256,-3*256);
  assert.equal(victim.life,990);
  for(let i=0;i<4;i++)api.ktCoreRenderPlan(targetMotion,12);
  assert.deepEqual(JSON.parse(api.ktCoreSnapshot(targetMotion,1)),victim);
  api.ktCoreAdvance(targetMotion,0,"",0,"");
  assert.equal(JSON.parse(api.ktCoreSnapshot(targetMotion,0)).numTargets,0);
  assert.equal(JSON.parse(api.ktCoreSnapshot(targetMotion,0)).power,7);
  assert.equal(JSON.parse(api.ktCoreSnapshot(targetMotion,1)).vx256,3*256);
  assert.equal(JSON.parse(api.ktCoreSnapshot(targetMotion,1)).state,5000,"Dropping capture must not change victim state");
  assert.equal(api.ktCoreIssues(targetMotion),"");
} finally { api.ktCoreRelease(targetMotion); }
console.log("Native Wasm captured target facing / velocity / mixed coordinates / TargetDrop / immediate NumTarget update: OK (synthetic)");

for(const cap of [0,5000,2147483647]) {
  const meter=api.ktCoreCreate("power meter","opponent",air,air,`[Data]
power=${cap}
${motionIdle}
[State 0, fill]
type=PowerSet
trigger1=Time=0
value=PowerMax
[State 0, add without overflow]
type=PowerAdd
trigger1=Time=1
value=2147483647
[State 0, drain]
type=PowerAdd
trigger1=Time=2
value=-2147483648`,motionIdle);
  try {
    api.ktCoreDebugSetStats(meter,0,1000,2147483647);
    assert.equal(JSON.parse(api.ktCoreSnapshot(meter,0)).power,cap);
    for(let tick=0;tick<3;tick++) {
      api.ktCoreAdvance(meter,0,"",0,"");
      const snapshot=JSON.parse(api.ktCoreSnapshot(meter,0));
      assert.equal(snapshot.powerMax,cap);assert.equal(snapshot.power,tick<2 ? cap : 0);
      for(let i=0;i<3;i++)api.ktCoreRenderPlan(meter,12);
      assert.deepEqual(JSON.parse(api.ktCoreSnapshot(meter,0)),snapshot);
    }
    assert.equal(api.ktCoreIssues(meter),"");
  } finally { api.ktCoreRelease(meter); }
}
const targetPower=api.ktCoreCreateWithDefinitions("power capture","victim",projectileFacingAir,air,
  `[Data]
power=6000
${motionIdle}
[Statedef 200]
type=S
physics=N
anim=200
[State 200, capture]
type=HitDef
trigger1=Time=0
id=183
damage=10
getpower=0
givepower=0
ground.hittime=60
[State 200, missing ID]
type=TargetPowerAdd
trigger1=Time=1
id=999
value=1000
[State 200, capped credit]
type=TargetPowerAdd
trigger1=Time=2
id=180+3
value=ifelse(PowerMax=6000,2147483647,0)
[State 200, drain]
type=TargetPowerAdd
trigger1=Time=3
value=-300
[State 200, release]
type=TargetDrop
trigger1=Time=4
[State 200, released targets cannot receive power]
type=TargetPowerAdd
trigger1=Time=4
value=-2147483648`,
  `[Data]\npower=1500\n${hitFlagStates}`,"","","[Info]\nlocalcoord=640,480","");
try {
  api.ktCoreSetup(targetPower,0,0,5*256,0);api.ktCoreDebugSetStats(targetPower,0,1000,700);
  api.ktCoreDebugSetStats(targetPower,1,1000,200);api.ktCoreDebugForceState(targetPower,0,200);
  for(const expected of [200,200,1500,1200,1200]) {
    api.ktCoreAdvance(targetPower,0,"",0,"");
    const victim=JSON.parse(api.ktCoreSnapshot(targetPower,1));
    assert.equal(victim.power,expected);assert.equal(victim.powerMax,1500);
    assert.equal(victim.life,990);assert.equal(victim.state,5000);
    assert.equal(JSON.parse(api.ktCoreSnapshot(targetPower,0)).power,700);
  }
  assert.equal(JSON.parse(api.ktCoreSnapshot(targetPower,0)).numTargets,0);
  assert.equal(api.ktCoreIssues(targetPower),"");
} finally { api.ktCoreRelease(targetPower); }
const helperPower=api.ktCoreCreate("shared helper power","victim",air,air,
  `[Data]
power=5000
${motionIdle}
[State 0, helper]
type=Helper
trigger1=Time=0
stateno=800
[Statedef 800]
type=S
physics=N
anim=0
[State 800, root meter]
type=PowerSet
trigger1=Time=0
value=PowerMax-100
[State 800, add]
type=PowerAdd
trigger1=Time=1
value=50`,motionIdle);
try {
  for(const expected of [0,4900,4950]) {
    api.ktCoreAdvance(helperPower,0,"",0,"");assert.equal(JSON.parse(api.ktCoreSnapshot(helperPower,0)).power,expected);
  }
  assert.equal(JSON.parse(api.ktCoreSnapshot(helperPower,1)).power,0);
  assert.equal(JSON.parse(api.ktCoreEntities(helperPower)).helpers,1);
  assert.equal(api.ktCoreIssues(helperPower),"");
} finally { api.ktCoreRelease(helperPower); }
console.log("Native Wasm configured PowerMax / PowerSet and overflow-safe PowerAdd / filtered TargetPowerAdd / root-shared helper meter / pure presentation: OK (synthetic)");

for(const projectile of [false,true])for(const guarded of [false,true])for(const mode of [
  "defaults","explicit","singleton","configured","disabled","drain","capped"
]) {
  const parameters={defaults:"",explicit:"getpower=81,13\ngivepower=57,19",singleton:"getpower=81\ngivepower=57",
    configured:"",disabled:"getpower=0\ngivepower=0",drain:"getpower=-200,-300\ngivepower=-400,-500",
    capped:"getpower=2147483647,2147483647\ngivepower=2147483647,2147483647"}[mode];
  const controller=`type=${projectile ? "Projectile" : "HitDef"}
trigger1=Time=0
projanim=200
damage=90,2
guardflag=HL
${parameters}`;
  const script=projectile ? `${motionIdle}\n[State 0, shot]\n${controller}` :
    `${motionIdle}\n[Statedef 200]\ntype=S\nphysics=N\nanim=200\n[State 200, hit]\n${controller}`;
  const contactPower=api.ktCoreCreate("contact power","recipient",projectileFacingAir,air,
    `[Data]\npower=5000\n${script}`,`[Data]\npower=1500\n${hitFlagStates}`);
  try {
    api.ktCoreSetup(contactPower,0,0,5*256,0);
    if(mode==="configured")api.ktCoreConfigureHitPower(contactPower,.5,.25);
    const initial=mode==="drain" || mode==="capped" ? 100 : 0;
    api.ktCoreDebugSetStats(contactPower,0,1000,initial);api.ktCoreDebugSetStats(contactPower,1,1000,initial);
    if(projectile)api.ktCoreAdvance(contactPower,0,"",guarded ? 8 : 0,"");
    else api.ktCoreDebugForceState(contactPower,0,200);
    api.ktCoreAdvance(contactPower,0,"",guarded ? 8 : 0,"");
    const expected={defaults:guarded ? [31,27] : [63,54],explicit:guarded ? [13,19] : [81,57],
      singleton:guarded ? [40,28] : [81,57],configured:guarded ? [22,11] : [45,22],disabled:[0,0],
      drain:[0,0],capped:[5000,1500]}[mode];
    const snapshots=[0,1].map(side=>JSON.parse(api.ktCoreSnapshot(contactPower,side)));
    assert.deepEqual(snapshots.map(p=>p.power),expected,`${projectile ? "projectile" : "root"}/${guarded}/${mode}`);
    assert.equal(snapshots[1].life,guarded ? 998 : 910);
    for(let i=0;i<4;i++)api.ktCoreRenderPlan(contactPower,12);
    assert.deepEqual([0,1].map(side=>JSON.parse(api.ktCoreSnapshot(contactPower,side))),snapshots);
    assert.equal(api.ktCoreIssues(contactPower),"");
  } finally { api.ktCoreRelease(contactPower); }
}
const capturedPower=api.ktCoreCreate("captured rules","recipient",projectileFacingAir,air,
  `${motionIdle}
[Statedef 200]
type=S
physics=N
anim=200
[State 200, hit]
type=HitDef
trigger1=Time=0
damage=90`,hitFlagStates);
try {
  api.ktCoreConfigureHitPower(capturedPower,.5,.25);
  for(const invalid of [-1,NaN,Infinity,Number.MAX_VALUE])
    assert.throws(()=>api.ktCoreConfigureHitPower(capturedPower,invalid,.6));
  api.ktCoreSetup(capturedPower,0,0,1000*256,0);api.ktCoreDebugForceState(capturedPower,0,200);
  api.ktCoreAdvance(capturedPower,0,"",0,"");api.ktCoreConfigureHitPower(capturedPower,0,0);
  api.ktCoreSetup(capturedPower,0,0,5*256,0);api.ktCoreAdvance(capturedPower,0,"",0,"");
  assert.deepEqual([0,1].map(side=>JSON.parse(api.ktCoreSnapshot(capturedPower,side)).power),[45,22]);
  api.ktCoreDebugForceState(capturedPower,0,200);api.ktCoreAdvance(capturedPower,0,"",0,"");
  assert.deepEqual([0,1].map(side=>JSON.parse(api.ktCoreSnapshot(capturedPower,side)).power),[45,22]);
  assert.equal(JSON.parse(api.ktCoreSnapshot(capturedPower,1)).life,820);
  assert.equal(api.ktCoreIssues(capturedPower),"");
} finally { api.ktCoreRelease(capturedPower); }
console.log("Native Wasm HitDef/Projectile getpower and givepower / hit and guard pairs / configured and captured defaults / bounds / pure reads: OK (synthetic)");

for(const width of [320,640])for(const defence of [100,200])for(const absolute of [0,1])for(const kill of [0,1]) {
  const scriptedThrow=api.ktCoreCreateWithDefinitions("scripted throw","victim",projectileFacingAir,air,
    `${motionIdle}
[Statedef 200]
type=S
movetype=A
physics=N
anim=200
[State 200, capture]
type=HitDef
trigger1=Time=0
attr=S,NT
hitflag=M-
damage=0
id=184
p1stateno=211
p2stateno=700
[Statedef 211]
type=S
movetype=A
physics=N
anim=0
velset=2,0
[State 211, bind]
type=TargetBind
trigger1=Time<6
time=1
pos=20,0
[State 211, missing ID]
type=TargetLifeAdd
trigger1=Time=1
id=999
value=-1000
[State 211, timed damage]
type=TargetLifeAdd
trigger1=Time=3
id=184
value=-60
kill=${kill}
absolute=${absolute}
[Statedef 700]
type=S
movetype=H
physics=N
anim=0`,
    `[Data]\ndefence=${defence}\n${hitFlagStates}`,"","",`[Info]\nlocalcoord=${width},${width*3/4}`,"");
  try {
    api.ktCoreSetup(scriptedThrow,0,0,5*256,0);api.ktCoreDebugSetStats(scriptedThrow,1,50,0);
    api.ktCoreDebugForceState(scriptedThrow,0,200);api.ktCoreAdvance(scriptedThrow,0,"",0,"");
    assert.equal(JSON.parse(api.ktCoreSnapshot(scriptedThrow,0)).state,211);
    const expected=Math.max(kill ? 0 : 1,50-(absolute ? 60 : 60*100/defence));
    for(let tick=0;tick<4;tick++) {
      api.ktCoreAdvance(scriptedThrow,0,"",0,"");
      const captor=JSON.parse(api.ktCoreSnapshot(scriptedThrow,0));
      const victim=JSON.parse(api.ktCoreSnapshot(scriptedThrow,1));
      assert.equal(victim.life,tick<3 ? 50 : expected);
      assert.equal(victim.x256,captor.x256+20*320/width*256,"Finite binding must still apply on the damage tick");
      assert.equal(victim.state,700);assert.equal(victim.stateOwner,1);
      assert.equal(victim.getHitDamage,0,"Scripted health changes do not create a new incoming hit");
      assert.equal(victim.power,0);assert.equal(captor.power,0);
      assert.deepEqual(JSON.parse(api.ktCoreContacts(scriptedThrow)),[]);
      for(let i=0;i<3;i++)api.ktCoreRenderPlan(scriptedThrow,12);
      assert.deepEqual(JSON.parse(api.ktCoreSnapshot(scriptedThrow,1)),victim);
    }
    api.ktCoreAdvance(scriptedThrow,0,"",0,"");
    assert.equal(JSON.parse(api.ktCoreSnapshot(scriptedThrow,1)).life,expected,"Time=3 damage must execute only once");
    assert.equal(JSON.parse(api.ktCoreSnapshot(scriptedThrow,0)).numTargets,expected>0 ? 1 : 0);
    assert.equal(api.ktCoreIssues(scriptedThrow),"");
  } finally { api.ktCoreRelease(scriptedThrow); }
}
for(const [type,params,expected,invalid] of [
  ["LifeAdd","value=-60",470,false],["LifeAdd","value=60",530,false],
  ["LifeAdd","value=-60\nabsolute=1",440,false],["LifeAdd","value=-2147483648\nkill=0",1,false],
  ["LifeAdd","value=2147483647",1000,false],["LifeAdd","value=unknown",500,true],
  ["LifeSet","value=123.9",123,false],["LifeSet","value=2147483647",1000,false],
  ["LifeSet","value=-1",0,false],["LifeSet","value=unknown",500,true]
]) {
  const health=api.ktCoreCreate("health controller","opponent",air,air,
    `[Data]\ndefence=200\n${motionIdle}\n[State 0, health]\ntype=${type}\ntrigger1=Time=0\n${params}`,motionIdle);
  try {
    api.ktCoreDebugSetStats(health,0,500,0);api.ktCoreAdvance(health,0,"",0,"");
    const snapshot=JSON.parse(api.ktCoreSnapshot(health,0));assert.equal(snapshot.life,expected,`${type}/${params}`);
    for(let i=0;i<3;i++)api.ktCoreRenderPlan(health,12);
    assert.deepEqual(JSON.parse(api.ktCoreSnapshot(health,0)),snapshot);
    assert.equal(api.ktCoreIssues(health).includes(`Invalid ${type}:`),invalid);
  } finally { api.ktCoreRelease(health); }
}
console.log("Native Wasm TargetLifeAdd timed throw / captured IDs / base defence and absolute mode / kill flags / mixed coordinates / LifeAdd and LifeSet bounds / pure reads: OK (synthetic)");

for(const kind of ["root","helper","projectile"])for(const guarded of [false,true])for(const config of [
  {attack:100,defence:100,base:90,chip:20,hit:90,guard:20,power:[63,54,31,27]},
  {attack:150,defence:200,base:90,chip:20,hit:68,guard:15,power:[63,54,31,27]},
  {attack:0,defence:200,base:90,chip:20,hit:0,guard:0,power:[63,54,31,27]},
  {attack:1,defence:100000,base:1,chip:1,hit:1,guard:1,power:[0,0,0,0]},
  {attack:100000,defence:1,base:2147483647,chip:2147483647,hit:2147483647,guard:2147483647,power:[3000,3000,3000,3000]},
  {attack:100,defence:200,base:3,chip:3,hit:2,guard:2,power:[2,1,1,0]}
]) {
  const controller=`type=${kind==="projectile" ? "Projectile" : "HitDef"}
trigger1=Time=0
projanim=200
damage=${config.base},${config.chip}
guardflag=HL`;
  const script=kind==="projectile" ? `${motionIdle}\n[State 0, shot]\n${controller}` :
    `${motionIdle}\n[Statedef 200]\ntype=S\nmovetype=A\nphysics=N\nanim=200\n[State 200, hit]\n${controller}`+
    (kind==="helper" ? "\n[State 0, helper]\ntype=Helper\ntrigger1=Time=0\nstateno=200" : "");
  const scaledDamage=api.ktCoreCreateWithDefinitions("base attack","base defence",projectileFacingAir,air,
    `[Data]\nattack=${config.attack}\n${script}`,`[Data]\ndefence=${config.defence}\n${hitFlagStates}`,
    "","","[Info]\nlocalcoord=640,480","");
  try {
    api.ktCoreSetup(scaledDamage,0,0,5*256,0);
    if(kind==="root")api.ktCoreDebugForceState(scaledDamage,0,200);
    else api.ktCoreAdvance(scaledDamage,0,"",guarded ? 8 : 0,"");
    api.ktCoreAdvance(scaledDamage,0,"",guarded ? 8 : 0,"");
    const expected=guarded ? config.guard : config.hit;
    const victim=JSON.parse(api.ktCoreSnapshot(scaledDamage,1));
    const label=`${kind}/${guarded}/${config.attack}/${config.defence}/${config.base}`;
    assert.equal(victim.life,Math.max(0,1000-expected),label);
    assert.equal(victim.getHitDamage,expected,label);
    const [contact]=JSON.parse(api.ktCoreContacts(scaledDamage));
    assert.equal(contact.damage,expected,label);assert.equal(contact.guarded,guarded);
    const offset=guarded ? 2 : 0;
    assert.equal(JSON.parse(api.ktCoreSnapshot(scaledDamage,0)).power,config.power[offset],label);
    assert.equal(victim.power,config.power[offset+1],label);
    for(let i=0;i<3;i++)api.ktCoreRenderPlan(scaledDamage,12);
    assert.deepEqual(JSON.parse(api.ktCoreSnapshot(scaledDamage,1)),victim);
    assert.equal(api.ktCoreIssues(scaledDamage),"");
  } finally { api.ktCoreRelease(scaledDamage); }
}
const borrowedDamageAir=`${air}
[Begin Action 200]
Clsn1Default:1
Clsn1[0]=0,-40,10,0
Clsn2Default:1
Clsn2[0]=-10,-40,10,0
200,0,0,0,-1`;
const borrowedDamage=api.ktCoreCreate("actual attacker","state lender",borrowedDamageAir,borrowedDamageAir,
  `[Data]\nattack=150\n${hitFlagStates}`,
  `[Data]
attack=800
defence=200
${hitFlagStates}
[Statedef 300]
type=S
movetype=A
physics=N
anim=200
[State 300, lend attack state]
type=HitDef
trigger1=Time=0
damage=0
p2stateno=200
[Statedef 200]
type=S
movetype=A
physics=N
anim=200
[State 200, attack in borrowed bank]
type=HitDef
trigger1=Time=0
damage=90`);
try {
  api.ktCoreSetup(borrowedDamage,0,0,5*256,0);api.ktCoreDebugForceState(borrowedDamage,1,300);
  api.ktCoreAdvance(borrowedDamage,0,"",0,"");
  assert.equal(JSON.parse(api.ktCoreSnapshot(borrowedDamage,0)).stateOwner,2);
  api.ktCoreAdvance(borrowedDamage,0,"",0,"");
  const victim=JSON.parse(api.ktCoreSnapshot(borrowedDamage,1));
  assert.equal(victim.life,932);assert.equal(victim.getHitDamage,68);
  assert.equal(JSON.parse(api.ktCoreContacts(borrowedDamage))[0].damage,68);
  assert.equal(api.ktCoreIssues(borrowedDamage),"");
} finally { api.ktCoreRelease(borrowedDamage); }
console.log("Native Wasm base attack/defence scaling / root-helper-projectile hits and guards / zero and tiny damage / overflow / authored power / borrowed attacker banks / pure reads: OK (synthetic)");

for(const kind of ["root","helper","projectile"])for(const guarded of [false,true])for(const config of [
  {attack:"1",defence:"1",hit:68,guard:15},
  {attack:"2",defence:".25",hit:34,guard:8},
  {attack:"0",defence:"1",hit:0,guard:0},
  {attack:"1",defence:"0",hit:0,guard:0},
  {attack:".0000001",defence:"1",hit:1,guard:1},
  {attack:"2147483647",defence:"2147483647",hit:2147483647,guard:2147483647}
]) {
  const controller=`type=${kind==="projectile" ? "Projectile" : "HitDef"}
trigger1=Time=0
projanim=200
damage=90,20
guardflag=HL`;
  const attackSetter=`type=AttackMulSet\ntrigger1=Time=0\nvalue=${config.attack}`;
  const script=kind==="projectile" ? `${motionIdle}\n[State 0, attack factor]\n${attackSetter}\n[State 0, shot]\n${controller}` :
    `${motionIdle}\n[Statedef 200]\ntype=S\nmovetype=A\nphysics=N\nanim=200\n[State 200, hit]\n${controller}\n[State 200, attack factor]\n${attackSetter}`+
    (kind==="helper" ? "\n[State 0, helper]\ntype=Helper\ntrigger1=Time=0\nstateno=200" : "");
  const multipliers=api.ktCoreCreateWithDefinitions("runtime attack","runtime defence",projectileFacingAir,air,
    `[Data]\nattack=150\n${script}`,`[Data]\ndefence=200\n${hitFlagStates}\n[State 0, defence factor]\ntype=DefenceMulSet\ntrigger1=Time=0\nvalue=${config.defence}`,
    "","","[Info]\nlocalcoord=640,480","");
  try {
    api.ktCoreSetup(multipliers,0,0,5*256,0);
    if(kind==="root")api.ktCoreDebugForceState(multipliers,0,200);
    else api.ktCoreAdvance(multipliers,0,"",guarded ? 8 : 0,"");
    if(kind==="projectile")assert.equal(JSON.parse(api.ktCoreProjectiles(multipliers))[0].attackMultiplier,Number(config.attack));
    api.ktCoreAdvance(multipliers,0,"",guarded ? 8 : 0,"");
    const expected=guarded ? config.guard : config.hit;
    const source=JSON.parse(api.ktCoreSnapshot(multipliers,0)),victim=JSON.parse(api.ktCoreSnapshot(multipliers,1));
    const label=`${kind}/${guarded}/${config.attack}/${config.defence}`;
    assert.equal(victim.life,Math.max(0,1000-expected),label);assert.equal(victim.getHitDamage,expected,label);
    assert.equal(JSON.parse(api.ktCoreContacts(multipliers))[0].damage,expected,label);
    assert.equal(source.attackMultiplier,kind==="helper" ? 1 : Number(config.attack));
    assert.equal(victim.defenceMultiplier,Number(config.defence));
    assert.equal(source.power,guarded ? 31 : 63);assert.equal(victim.power,guarded ? 27 : 54);
    for(let i=0;i<3;i++)api.ktCoreRenderPlan(multipliers,12);
    assert.deepEqual(JSON.parse(api.ktCoreSnapshot(multipliers,1)),victim);
    assert.equal(api.ktCoreIssues(multipliers),"");
  } finally { api.ktCoreRelease(multipliers); }
}
const capturedMultiplier=api.ktCoreCreate("captured projectile factor","live victim factor",projectileFacingAir,air,
  `[Data]\nattack=150\n${motionIdle}
[State 0, capture two]
type=AttackMulSet
trigger1=Time=0
value=2
[State 0, shot]
type=Projectile
trigger1=Time=0
projanim=200
projhits=2
damage=90
[State 0, change to seven after queuing]
type=AttackMulSet
trigger1=Time=0
value=7`,
  `[Data]\ndefence=200\n${motionIdle}
[State 0, defend first contact]
type=DefenceMulSet
trigger1=Time=1
value=.5
[Statedef 5000]
type=S
movetype=H
physics=N
anim=0
[State 5000, defend second contact differently]
type=DefenceMulSet
trigger1=Time=0
value=2`);
try {
  api.ktCoreSetup(capturedMultiplier,0,0,5*256,0);api.ktCoreAdvance(capturedMultiplier,0,"",0,"");
  assert.equal(JSON.parse(api.ktCoreSnapshot(capturedMultiplier,0)).attackMultiplier,7);
  assert.equal(JSON.parse(api.ktCoreProjectiles(capturedMultiplier))[0].attackMultiplier,2);
  for(const [amount,life] of [[68,932],[270,662]]) {
    api.ktCoreAdvance(capturedMultiplier,0,"",0,"");
    assert.equal(JSON.parse(api.ktCoreContacts(capturedMultiplier))[0].damage,amount);
    assert.equal(JSON.parse(api.ktCoreSnapshot(capturedMultiplier,1)).life,life);
  }
  assert.deepEqual(JSON.parse(api.ktCoreProjectiles(capturedMultiplier)),[]);
  assert.equal(JSON.parse(api.ktCoreSnapshot(capturedMultiplier,0)).power,126);
  assert.equal(api.ktCoreIssues(capturedMultiplier),"");
} finally { api.ktCoreRelease(capturedMultiplier); }
const liveMultiplier=api.ktCoreCreate("live body factor","victim",projectileFacingAir,air,
  `[Data]\nattack=150\n${motionIdle}
[Statedef 200]
type=S
movetype=A
physics=N
anim=200
[State 200, install first]
type=HitDef
trigger1=Time=0
damage=90
[State 200, change before contact]
type=AttackMulSet
trigger1=Time=1
value=2`,`[Data]\ndefence=200\n${hitFlagStates}`);
try {
  api.ktCoreSetup(liveMultiplier,0,0,1000*256,0);api.ktCoreDebugForceState(liveMultiplier,0,200);
  api.ktCoreAdvance(liveMultiplier,0,"",0,"");api.ktCoreSetup(liveMultiplier,0,0,5*256,0);
  api.ktCoreAdvance(liveMultiplier,0,"",0,"");
  assert.equal(JSON.parse(api.ktCoreSnapshot(liveMultiplier,1)).getHitDamage,135);
  assert.equal(JSON.parse(api.ktCoreContacts(liveMultiplier))[0].damage,135);
  assert.equal(api.ktCoreIssues(liveMultiplier),"");
} finally { api.ktCoreRelease(liveMultiplier); }
for(const [factor,value,absolute,expected] of [
  [".5",-60,0,485],[".5",60,0,515],["0",-60,0,500],["0",60,0,500],
  ["2147483647*2147483647",2147483647,0,1000],["2147483647*2147483647",-2147483648,0,0],
  [".5",-60,1,440],[".5",60,1,560]
]) {
  const targetFactor=api.ktCoreCreate("scripted runtime defence","victim",projectileFacingAir,air,
    `${motionIdle}
[Statedef 200]
type=S
physics=N
anim=200
[State 200, attack factor does not affect scripted damage]
type=AttackMulSet
trigger1=Time=0
value=7
[State 200, capture]
type=HitDef
trigger1=Time=0
damage=0
p1stateno=211
p2stateno=700
[Statedef 211]
type=S
physics=N
anim=0
[State 211, life]
type=TargetLifeAdd
trigger1=Time=0
value=${value}
absolute=${absolute}
[Statedef 700]
type=S
movetype=H
physics=N
anim=0`,
    `[Data]\ndefence=200\n${hitFlagStates}\n[State 0, defence]\ntype=DefenceMulSet\ntrigger1=Time=0\nvalue=${factor}`);
  try {
    api.ktCoreSetup(targetFactor,0,0,5*256,0);api.ktCoreDebugSetStats(targetFactor,1,500,0);
    api.ktCoreDebugForceState(targetFactor,0,200);
    api.ktCoreAdvance(targetFactor,0,"",0,"");api.ktCoreAdvance(targetFactor,0,"",0,"");
    assert.equal(JSON.parse(api.ktCoreSnapshot(targetFactor,1)).life,expected,`${factor}/${value}/${absolute}`);
    assert.deepEqual(JSON.parse(api.ktCoreContacts(targetFactor)),[]);
    assert.equal(api.ktCoreIssues(targetFactor),"");
  } finally { api.ktCoreRelease(targetFactor); }
}
console.log("Native Wasm runtime attack/defence factors / body and helper contacts / projectile request capture / live target defence / bounded scripted health / pure reads: OK (synthetic)");

function persistenceScript(hit,move,count,replacement="") {
  return `${motionIdle}
[Statedef 200]
type=S
movetype=A
physics=N
anim=200
[State 200, manual counter]
type=HitAdd
trigger1=Time=0
value=7
[State 200, hit]
type=HitDef
trigger1=Time=0
damage=90,20
guardflag=HL
[State 200, handoff]
type=ChangeState
trigger1=Time=1
value=300
[Statedef 300]
type=S
movetype=A
physics=N
anim=200
hitdefpersist=${hit}
movehitpersist=${move}
hitcountpersist=${count}
[State 300, observe preserved data]
type=PowerAdd
trigger1=Time=0 && MoveContact && HitCount=7
value=1
${replacement}`;
}
for(const hit of [0,1])for(const move of [0,1])for(const count of [0,1])for(const guarded of [false,true]) {
  const preserved=api.ktCoreCreate("state persistence","victim",projectileFacingAir,air,
    persistenceScript(hit,move,count),hitFlagStates);
  try {
    api.ktCoreSetup(preserved,0,0,5*256,0);api.ktCoreDebugForceState(preserved,0,200);
    api.ktCoreAdvance(preserved,0,"",guarded ? 8 : 0,"");
    assert.equal(JSON.parse(api.ktCoreSnapshot(preserved,0)).hitCount,7);
    api.ktCoreAdvance(preserved,0,"",guarded ? 8 : 0,"");
    const entered=JSON.parse(api.ktCoreSnapshot(preserved,0));
    assert.equal(entered.state,300);assert.equal(entered.stateTime,0);
    assert.equal(entered.hitCount,count ? 7 : 0);assert.equal(entered.moveContact,!!move);
    assert.equal(entered.moveHit,!!move && !guarded);assert.equal(entered.moveGuarded,!!move && guarded);
    assert.deepEqual(JSON.parse(api.ktCoreContacts(preserved)),[]);
    api.ktCoreAdvance(preserved,0,"",guarded ? 8 : 0,"");
    assert.equal(JSON.parse(api.ktCoreSnapshot(preserved,1)).life,guarded ? 980 : 910);
    const snapshot=JSON.parse(api.ktCoreSnapshot(preserved,0));
    assert.equal(snapshot.power,(guarded ? 31 : 63)+(move && count ? 1 : 0));
    assert.deepEqual(JSON.parse(api.ktCoreContacts(preserved)),[],"A preserved spent attack cannot hit again");
    for(let i=0;i<3;i++)api.ktCoreRenderPlan(preserved,12);
    assert.deepEqual(JSON.parse(api.ktCoreSnapshot(preserved,0)),snapshot);
    assert.equal(api.ktCoreIssues(preserved),"");
  } finally { api.ktCoreRelease(preserved); }
}
for(const keep of [0,1]) {
  const unspent=api.ktCoreCreate("unspent carry","victim",projectileFacingAir,air,persistenceScript(keep,0,0),hitFlagStates);
  try {
    api.ktCoreSetup(unspent,0,0,1000*256,0);api.ktCoreDebugForceState(unspent,0,200);
    api.ktCoreAdvance(unspent,0,"",0,"");api.ktCoreAdvance(unspent,0,"",0,"");
    api.ktCoreSetup(unspent,0,0,5*256,0);api.ktCoreAdvance(unspent,0,"",0,"");
    assert.equal(JSON.parse(api.ktCoreSnapshot(unspent,1)).life,keep ? 910 : 1000);
    assert.equal(JSON.parse(api.ktCoreContacts(unspent)).length,keep ? 1 : 0);
    assert.equal(api.ktCoreIssues(unspent),"");
  } finally { api.ktCoreRelease(unspent); }
}
const replacement=api.ktCoreCreate("replace carried attack","victim",projectileFacingAir,air,
  persistenceScript(1,1,1,"[State 300, replacement]\ntype=HitDef\ntrigger1=1\ndamage=5"),hitFlagStates);
try {
  api.ktCoreSetup(replacement,0,0,5*256,0);api.ktCoreDebugForceState(replacement,0,200);
  for(let i=0;i<3;i++)api.ktCoreAdvance(replacement,0,"",0,"");
  assert.equal(JSON.parse(api.ktCoreSnapshot(replacement,1)).life,905);
  assert.equal(JSON.parse(api.ktCoreContacts(replacement))[0].damage,5);
  api.ktCoreAdvance(replacement,0,"",0,"");
  assert.equal(JSON.parse(api.ktCoreSnapshot(replacement,1)).life,905);
  assert.deepEqual(JSON.parse(api.ktCoreContacts(replacement)),[]);
  assert.equal(api.ktCoreIssues(replacement),"");
} finally { api.ktCoreRelease(replacement); }
const boundedCount=api.ktCoreCreate("bounded manual count","victim",air,air,
  `${motionIdle}
[State 0, add maximum]
type=HitAdd
trigger1=Time=0
value=2147483647
[State 0, saturate]
type=HitAdd
trigger1=Time=0
value=2147483647
[State 0, invalid value preserves count]
type=HitAdd
trigger1=Time=0
value=2147483648
[State 0, handoff]
type=ChangeState
trigger1=Time=1
value=300
[Statedef 300]
type=S
physics=N
anim=0
hitcountpersist=1
[State 300, drain]
type=HitAdd
trigger1=Time=0
value=-2147483648`,motionIdle);
try {
  api.ktCoreAdvance(boundedCount,0,"",0,"");
  assert.equal(JSON.parse(api.ktCoreSnapshot(boundedCount,0)).hitCount,2147483647);
  api.ktCoreAdvance(boundedCount,0,"",0,"");
  assert.equal(JSON.parse(api.ktCoreSnapshot(boundedCount,0)).hitCount,2147483647);
  api.ktCoreAdvance(boundedCount,0,"",0,"");
  assert.equal(JSON.parse(api.ktCoreSnapshot(boundedCount,0)).hitCount,0);
  assert.match(api.ktCoreIssues(boundedCount),/Invalid HitAdd:/);
} finally { api.ktCoreRelease(boundedCount); }
const invalidInitialPersistence=api.ktCoreCreate("invalid initial flag","victim",air,air,
  `${motionIdle}\nhitdefpersist=unknown`,motionIdle);
try {
  assert.match(api.ktCoreIssues(invalidInitialPersistence),/Invalid StateDef persistence:/);
  assert.equal(JSON.parse(api.ktCoreSnapshot(invalidInitialPersistence,0)).hitCount,0);
} finally { api.ktCoreRelease(invalidInitialPersistence); }
console.log("Native Wasm StateDef hit/contact/manual-count persistence / spent windows / first valid replacement / entry diagnostics / bounded HitAdd / pure reads: OK (synthetic)");

for(const kind of ["root","projectile"])for(const guarded of [false,true])for(const face of [false,true])for(const x of [0,1])for(const y of [0,1]) {
  const controller=`type=${kind==="projectile" ? "Projectile" : "HitDef"}
trigger1=Time=0
projanim=200
damage=10,2
guardflag=HL
ground.velocity=8,-4
guard.velocity=6,-2`;
  const source=kind==="projectile" ? `${motionIdle}\n[State 0, shot]\n${controller}` :
    `${motionIdle}\n[Statedef 200]\ntype=S\nphysics=N\nanim=200\n[State 200, hit]\n${controller}`;
  const reaction=state=>`[Statedef ${state}]
type=S
movetype=H
physics=N
anim=0
[State ${state}, clobber]
type=VelSet
trigger1=Time=0
x=99
y=88
[State ${state}, restore captured axes]
type=HitVelSet
trigger1=Time=0
x=${x}
y=${y}`;
  const restore=api.ktCoreCreateWithDefinitions("captured knockback","reaction",projectileFacingAir,air,
    source,`${motionIdle}\nctrl=1\n${reaction(5000)}\n${reaction(150)}`,"","","[Info]\nlocalcoord=640,480","");
  try {
    api.ktCoreSetup(restore,0,0,(face ? 5 : -5)*256,0);
    api.ktCoreDebugSetFacing(restore,0,face);api.ktCoreDebugSetFacing(restore,1,!face);
    assert.equal(JSON.parse(api.ktCoreSnapshot(restore,1)).getHitReceived,false);
    const input=guarded ? (face ? 8 : 4) : 0;
    if(kind==="root")api.ktCoreDebugForceState(restore,0,200);
    else api.ktCoreAdvance(restore,0,"",input,"");
    api.ktCoreAdvance(restore,0,"",input,"");
    api.ktCoreDebugSetFacing(restore,1,face);api.ktCoreAdvance(restore,0,"",0,"");
    const victim=JSON.parse(api.ktCoreSnapshot(restore,1));
    const incomingX=(face ? 1 : -1)*(guarded ? 3 : 4)*256,incomingY=(guarded ? -1 : -2)*256;
    assert.equal(victim.vx256,x ? incomingX : 99*256);assert.equal(victim.vy256,y ? incomingY : 88*256);
    assert.equal(victim.getHitX256,incomingX);assert.equal(victim.getHitY256,incomingY);
    assert.equal(victim.getHitReceived,true);assert.equal(victim.life,guarded ? 998 : 990);
    assert.deepEqual(JSON.parse(api.ktCoreContacts(restore)),[]);
    for(let i=0;i<3;i++)api.ktCoreRenderPlan(restore,12);
    assert.deepEqual(JSON.parse(api.ktCoreSnapshot(restore,1)),victim);
    assert.equal(api.ktCoreIssues(restore),"");
  } finally { api.ktCoreRelease(restore); }
}
for(const kind of ["root","projectile"])for(const width of [320,640])for(const mode of ["unset","zero","custom","disabled"]) {
  const fall=mode==="disabled" ? 0 : 1;
  const params=mode==="unset" ? "" : mode==="zero" ? "fall.xvelocity=0" : "fall.xvelocity=8\nfall.yvelocity=-10";
  const controller=`type=${kind==="projectile" ? "Projectile" : "HitDef"}\ntrigger1=Time=0\nprojanim=200\ndamage=10\nfall=${fall}\n${params}`;
  const source=kind==="projectile" ? `${motionIdle}\n[State 0, shot]\n${controller}` :
    `${motionIdle}\n[Statedef 200]\ntype=S\nphysics=N\nanim=200\n[State 200, hit]\n${controller}`;
  const bounce=api.ktCoreCreateWithDefinitions("fall metadata","bounce",projectileFacingAir,air,source,
    `${motionIdle}
[Statedef 5000]
type=S
movetype=H
physics=N
anim=0
[State 5000, current velocity]
type=VelSet
trigger1=Time=0
x=99
y=88
[State 5000, bounce]
type=HitFallVel
trigger1=Time=0
[State 5000, observe local fall queries]
type=PowerSet
trigger1=Time=0
value=abs(GetHitVar(fall.yvel))*10+abs(GetHitVar(fall.xvel))`,
    "","",`[Info]\nlocalcoord=${width},${width*3/4}`,"[Info]\nlocalcoord=640,480");
  try {
    api.ktCoreSetup(bounce,0,0,5*256,0);
    if(kind==="root")api.ktCoreDebugForceState(bounce,0,200);else api.ktCoreAdvance(bounce,0,"",0,"");
    api.ktCoreAdvance(bounce,0,"",0,"");api.ktCoreAdvance(bounce,0,"",0,"");
    const victim=JSON.parse(api.ktCoreSnapshot(bounce,1));
    const fallX=mode==="unset" ? null : mode==="zero" ? 0 : 8*320/width*256;
    const fallY=mode==="custom" || mode==="disabled" ? -10*320/width*256 : -4.5*256;
    assert.equal(victim.getHitFallX256,fallX);assert.equal(victim.getHitFallY256,fallY);
    assert.equal(victim.getHitFall,!!fall);
    assert.equal(victim.vx256,fall && fallX!==null ? fallX : 99/2*256);
    assert.equal(victim.vy256,fall ? fallY : 88/2*256);
    assert.equal(victim.power,Math.abs(fallY)/256*2*10+Math.abs(fallX ?? 0)/256*2);
    assert.equal(victim.life,990);assert.equal(api.ktCoreIssues(bounce),"");
    for(let i=0;i<3;i++)api.ktCoreRenderPlan(bounce,12);
    assert.deepEqual(JSON.parse(api.ktCoreSnapshot(bounce,1)),victim);
  } finally { api.ktCoreRelease(bounce); }
}
for(const [initialFall,flag] of [[0,1],[1,0],[1,-1]]) {
  const fallSet=api.ktCoreCreateWithDefinitions("fall editing bank","borrowed reaction",projectileFacingAir,air,
    `${motionIdle}
[Statedef 200]
type=S
physics=N
anim=200
[State 200, hit]
type=HitDef
trigger1=Time=0
damage=10
ground.velocity=8,-4
fall=${initialFall}
p2stateno=700
[Statedef 700]
type=S
movetype=H
physics=N
anim=0
[State 700, restore original]
type=HitVelSet
trigger1=Time=0
x=1
y=1
[State 700, edit fall data in active bank units]
type=HitFallSet
trigger1=Time=0
value=${flag}
xvel=6
yvel=-10
[State 700, apply fall data]
type=HitFallVel
trigger1=Time=0
[State 700, observe local data]
type=PowerSet
trigger1=Time=0
value=abs(GetHitVar(fall.xvel))*100+abs(GetHitVar(fall.yvel))`,motionIdle,
    "","","[Info]\nlocalcoord=640,480","");
  try {
    api.ktCoreSetup(fallSet,0,0,5*256,0);api.ktCoreDebugForceState(fallSet,0,200);
    api.ktCoreAdvance(fallSet,0,"",0,"");api.ktCoreAdvance(fallSet,0,"",0,"");
    const victim=JSON.parse(api.ktCoreSnapshot(fallSet,1));
    const falling=flag===-1 ? !!initialFall : !!flag;
    assert.equal(victim.stateOwner,1);assert.equal(victim.localCoordWidth,640);assert.equal(victim.ownLocalCoordWidth,320);
    assert.equal(victim.getHitFall,falling);assert.equal(victim.getHitFallX256,3*256);assert.equal(victim.getHitFallY256,-5*256);
    assert.equal(victim.vx256,(falling ? 3 : 4)*256);assert.equal(victim.vy256,(falling ? -5 : -2)*256);
    assert.equal(victim.getHitX256,4*256);assert.equal(victim.getHitY256,-2*256);
    assert.equal(victim.power,610);assert.equal(victim.life,990);assert.equal(api.ktCoreIssues(fallSet),"");
  } finally { api.ktCoreRelease(fallSet); }
}
console.log("Native Wasm HitVelSet sparse axes / hit-guard-projectile capture / HitFallSet and HitFallVel / omitted X and canonical bounce / mixed and borrowed units / pure reads: OK (synthetic)");

// Fall damage is a health scalar captured per contact and spent by an authored controller.
for(const kind of ["root","helper","projectile"])for(const width of [320,640])for(const kill of [0,1])for(const factor of ["1","0.5","0","2147483647*2147483647"]) {
  const attack=`type=${kind==="projectile" ? "Projectile" : "HitDef"}
trigger1=Time=0
projanim=200
damage=0
kill=0
guard.kill=0
fall=1
fall.damage=100
fall.kill=${kill}`;
  const source=`[Data]
attack=800
defence=400
${motionIdle}`+
    (kind==="helper" ? "\n[State 0, helper]\ntype=Helper\ntrigger1=Time=0\nstateno=200" : "")+
    (kind==="projectile" ? "" : "\n[Statedef 200]\ntype=S\nphysics=N\nanim=200")+
    `\n[State ${kind==="projectile" ? 0 : 200}, attacker factor]
type=AttackMulSet
trigger1=Time=0
value=7
[State ${kind==="projectile" ? 0 : 200}, contact]
${attack}`;
  const victim=`[Data]
defence=200
${motionIdle}
[State 0, live defence]
type=DefenceMulSet
trigger1=Time=0
value=${factor}
[Statedef 5000]
type=S
movetype=H
physics=N
anim=0
[State 5000, observe pending scalar]
type=PowerAdd
trigger1=Time=0 && GetHitVar(fall.damage)=100
value=1
[State 5000, spend]
type=HitFallDamage
trigger1=1
[State 5000, observe consumed scalar]
type=PowerAdd
trigger1=Time=0 && GetHitVar(fall.damage)=0
value=2`;
  const fallDamage=api.ktCoreCreateWithDefinitions("fall scalar source","fall recipient",projectileFacingAir,air,source,victim,
    "","",`[Info]\nlocalcoord=${width},${width*3/4}`,"");
  try {
    api.ktCoreSetup(fallDamage,0,0,5*256,0);api.ktCoreDebugSetStats(fallDamage,1,80,0);
    if(kind==="root")api.ktCoreDebugForceState(fallDamage,0,200);else api.ktCoreAdvance(fallDamage,0,"",0,"");
    api.ktCoreAdvance(fallDamage,0,"",0,"");
    const pending=JSON.parse(api.ktCoreSnapshot(fallDamage,1));
    assert.equal(pending.getHitFallDamage,100);assert.equal(pending.getHitFallKill,!!kill);assert.equal(pending.life,80);
    api.ktCoreAdvance(fallDamage,0,"",0,"");
    const spent=JSON.parse(api.ktCoreSnapshot(fallDamage,1));
    assert.equal(spent.life,factor==="1" ? 30 : factor==="0.5" ? 55 : factor==="0" ? 80 : kill ? 0 : 1);
    assert.equal(spent.getHitFallDamage,0);assert.equal(spent.getHitDamage,0);assert.equal(spent.power,3);
    assert.equal(spent.state,5000);assert.equal(JSON.parse(api.ktCoreSnapshot(fallDamage,0)).power,0);
    assert.deepEqual(JSON.parse(api.ktCoreContacts(fallDamage)),[]);
    for(let i=0;i<3;i++)api.ktCoreRenderPlan(fallDamage,12);
    assert.deepEqual(JSON.parse(api.ktCoreSnapshot(fallDamage,1)),spent);
    api.ktCoreAdvance(fallDamage,0,"",0,"");
    assert.equal(JSON.parse(api.ktCoreSnapshot(fallDamage,1)).life,spent.life);
    assert.equal(api.ktCoreIssues(fallDamage),"");
  } finally { api.ktCoreRelease(fallDamage); }
}
for(const [amount,defence,factor,kill,expected] of [[-100,200,"0.5",1,525],[-2147483648,1,"2147483647*2147483647",1,1000],
  [2147483647,1,"2147483647*2147483647",0,1],[1,100000,"1",1,499]]) {
  const signedFall=api.ktCoreCreate("signed fall source","signed fall victim",projectileFacingAir,air,
    `${motionIdle}
[Statedef 200]
type=S
physics=N
anim=200
[State 200, hit]
type=HitDef
trigger1=Time=0
damage=0
fall=1
fall.damage=${amount}
fall.kill=${kill}`,
    `[Data]
defence=${defence}
${motionIdle}
[State 0, factor]
type=DefenceMulSet
trigger1=Time=0
value=${factor}
[Statedef 5000]
type=S
movetype=H
physics=N
anim=0
[State 5000, spend]
type=HitFallDamage
trigger1=1`);
  try {
    api.ktCoreSetup(signedFall,0,0,5*256,0);api.ktCoreDebugSetStats(signedFall,1,500,0);api.ktCoreDebugForceState(signedFall,0,200);
    api.ktCoreAdvance(signedFall,0,"",0,"");api.ktCoreAdvance(signedFall,0,"",0,"");
    const victim=JSON.parse(api.ktCoreSnapshot(signedFall,1));
    assert.equal(victim.life,expected);assert.equal(victim.getHitFallDamage,0);assert.equal(api.ktCoreIssues(signedFall),"");
  } finally { api.ktCoreRelease(signedFall); }
}
const guardedFall=api.ktCoreCreate("guarded fall source","guarded fall victim",projectileFacingAir,air,
  `${motionIdle}
[Statedef 200]
type=S
physics=N
anim=200
[State 200, hit]
type=HitDef
trigger1=Time=0
damage=0
guardflag=HL
kill=0
guard.kill=0
fall=1
fall.damage=100`,
  `[Data]
defence=200
${motionIdle}
ctrl=1
[Statedef 150]
type=S
movetype=H
physics=N
anim=0
[State 150, enable deferred fall]
type=HitFallSet
trigger1=Time=1
value=1
[State 150, spend when falling]
type=HitFallDamage
trigger1=1`);
try {
  api.ktCoreSetup(guardedFall,0,0,5*256,0);api.ktCoreDebugSetStats(guardedFall,1,20,0);api.ktCoreDebugForceState(guardedFall,0,200);
  api.ktCoreAdvance(guardedFall,0,"",8,"");api.ktCoreAdvance(guardedFall,0,"",0,"");
  const deferred=JSON.parse(api.ktCoreSnapshot(guardedFall,1));
  assert.equal(deferred.life,20);assert.equal(deferred.getHitFall,false);assert.equal(deferred.getHitFallDamage,100);
  assert.equal(deferred.getHitFallKill,true);assert.equal(deferred.getHitGuarded,true);
  api.ktCoreAdvance(guardedFall,0,"",0,"");
  const spent=JSON.parse(api.ktCoreSnapshot(guardedFall,1));
  assert.equal(spent.life,0);assert.equal(spent.getHitFallDamage,0);assert.equal(spent.getHitFall,true);
  assert.deepEqual(JSON.parse(api.ktCoreContacts(guardedFall)),[]);assert.equal(api.ktCoreIssues(guardedFall),"");
} finally { api.ktCoreRelease(guardedFall); }
const borrowedFall=api.ktCoreCreateWithDefinitions("fall bank","own defence",projectileFacingAir,air,
  `[Data]
defence=400
${motionIdle}
[Statedef 200]
type=S
physics=N
anim=200
[State 200, hit]
type=HitDef
trigger1=Time=0
damage=0
fall=1
fall.damage=100
p2stateno=700
[Statedef 700]
type=S
movetype=H
physics=N
anim=0
[State 700, observe scalar]
type=PowerSet
trigger1=Time=0
value=GetHitVar(fall.damage)
[State 700, spend]
type=HitFallDamage
trigger1=1`, `[Data]
defence=200
${motionIdle}`,"","","[Info]\nlocalcoord=640,480","");
try {
  api.ktCoreSetup(borrowedFall,0,0,5*256,0);api.ktCoreDebugForceState(borrowedFall,0,200);
  api.ktCoreAdvance(borrowedFall,0,"",0,"");api.ktCoreAdvance(borrowedFall,0,"",0,"");
  const victim=JSON.parse(api.ktCoreSnapshot(borrowedFall,1));
  assert.equal(victim.life,950);assert.equal(victim.getHitFallDamage,0);assert.equal(victim.power,100);
  assert.equal(victim.stateOwner,1);assert.equal(victim.localCoordWidth,640);assert.equal(victim.ownLocalCoordWidth,320);
  assert.equal(api.ktCoreIssues(borrowedFall),"");
} finally { api.ktCoreRelease(borrowedFall); }
console.log("Native Wasm HitFallDamage / independent fall.kill / root-helper-projectile scalar capture / live defence / consume once / signed bounds / pure reads: OK (synthetic)");

// Recovery clocks are actor-owned ticks, not active-bank spatial coordinates or state Time.
for(const kind of ["root","helper","projectile"])for(const width of [320,640])for(const enabled of [0,1])for(const delay of [0,4])for(const pause of [0,2]) {
  const controller=`type=${kind==="projectile" ? "Projectile" : "HitDef"}
trigger1=Time=0
projanim=200
damage=0
fall=1
fall.damage=30
fall.recover=${enabled}
fall.recovertime=${delay}
pausetime=0,${pause}`;
  const source=motionIdle+
    (kind==="helper" ? "\n[State 0, helper]\ntype=Helper\ntrigger1=Time=0\nstateno=200" : "")+
    (kind==="projectile" ? "" : "\n[Statedef 200]\ntype=S\nphysics=N\nanim=200")+
    `\n[State ${kind==="projectile" ? 0 : 200}, contact]\n${controller}`;
  const recovery=api.ktCoreCreateWithDefinitions("recovery source","recovery queries",projectileFacingAir,air,source,
    `${motionIdle}
[Statedef 5000]
type=A
movetype=H
physics=N
anim=0
[State 5000, observe native triggers and scalar fields]
type=PowerSet
trigger1=1
ignorehitpause=1
value=HitFall*1000+CanRecover*500+GetHitVar(fall.recover)*100+GetHitVar(fall.recovertime)*10+GetHitVar(fall.time)`,
    "","",`[Info]\nlocalcoord=${width},${width*3/4}`,"");
  try {
    api.ktCoreSetup(recovery,0,0,5*256,0);
    if(kind==="root")api.ktCoreDebugForceState(recovery,0,200);else api.ktCoreAdvance(recovery,0,"",0,"");
    api.ktCoreAdvance(recovery,0,"",0,"");
    const captured=JSON.parse(api.ktCoreSnapshot(recovery,1));
    assert.equal(captured.getHitFallTime,0);assert.equal(captured.getHitFallRecover,!!enabled);
    assert.equal(captured.getHitFallRecoverTime,delay);assert.equal(captured.canRecover,!!enabled && delay===0);
    for(let tick=1;tick<=pause+delay+2;tick++) {
      api.ktCoreAdvance(recovery,0,"",0,"");
      const victim=JSON.parse(api.ktCoreSnapshot(recovery,1)),elapsed=Math.max(0,tick-pause),ready=!!enabled && elapsed>=delay;
      assert.equal(victim.getHitFallTime,elapsed);assert.equal(victim.canRecover,ready);
      assert.equal(victim.power,1000+Number(ready)*500+enabled*100+delay*10+elapsed);
      assert.equal(victim.state,5000);assert.equal(victim.life,1000);assert.equal(victim.getHitFallDamage,30);
      assert.equal(JSON.parse(api.ktCoreSnapshot(recovery,0)).power,0);assert.deepEqual(JSON.parse(api.ktCoreContacts(recovery)),[]);
      for(let i=0;i<3;i++)api.ktCoreRenderPlan(recovery,12);
      assert.deepEqual(JSON.parse(api.ktCoreSnapshot(recovery,1)),victim);
    }
    assert.equal(api.ktCoreIssues(recovery),"");
  } finally { api.ktCoreRelease(recovery); }
}
const borrowedRecovery=api.ktCoreCreateWithDefinitions("recovery bank","own recovery",projectileFacingAir,air,
  `${motionIdle}
[Statedef 200]
type=S
physics=N
anim=200
[State 200, hit]
type=HitDef
trigger1=Time=0
damage=0
fall=1
fall.recovertime=3
p2stateno=700
[Statedef 700]
type=A
movetype=H
physics=N
anim=0
[State 700, recovery]
type=SelfState
trigger1=HitFall && CanRecover
value=5200`,
  `${motionIdle}
[Statedef 5200]
type=A
movetype=I
physics=N
anim=0
ctrl=1`,"","","[Info]\nlocalcoord=640,480","");
try {
  api.ktCoreSetup(borrowedRecovery,0,0,5*256,0);api.ktCoreDebugForceState(borrowedRecovery,0,200);
  api.ktCoreAdvance(borrowedRecovery,0,"",0,"");
  for(let tick=1;tick<=2;tick++) {
    api.ktCoreAdvance(borrowedRecovery,0,"",0,"");const victim=JSON.parse(api.ktCoreSnapshot(borrowedRecovery,1));
    assert.equal(victim.state,700);assert.equal(victim.stateOwner,1);assert.equal(victim.getHitFallTime,tick);
    assert.equal(victim.localCoordWidth,640);assert.equal(victim.getHitFallRecoverTime,3);assert.equal(victim.canRecover,false);
  }
  api.ktCoreAdvance(borrowedRecovery,0,"",0,"");
  const recovered=JSON.parse(api.ktCoreSnapshot(borrowedRecovery,1));
  assert.equal(recovered.state,5200);assert.equal(recovered.stateOwner,2);assert.equal(recovered.localCoordWidth,320);
  assert.equal(recovered.getHitFallTime,3);assert.equal(recovered.canRecover,false);
  api.ktCoreAdvance(borrowedRecovery,0,"",0,"");
  assert.equal(JSON.parse(api.ktCoreSnapshot(borrowedRecovery,1)).getHitFallTime,3);
  assert.equal(api.ktCoreIssues(borrowedRecovery),"");
} finally { api.ktCoreRelease(borrowedRecovery); }
const guardRecovery=api.ktCoreCreate("guard recovery source","deferred guard recovery",projectileFacingAir,air,
  `${motionIdle}
[Statedef 200]
type=S
physics=N
anim=200
[State 200, hit]
type=HitDef
trigger1=Time=0
damage=0
guardflag=HL
fall=1
fall.recovertime=2`,
  `${motionIdle}
ctrl=1
[Statedef 150]
type=S
movetype=H
physics=N
anim=0
[State 150, enable deferred recovery clock]
type=HitFallSet
trigger1=Time=1
value=1`);
try {
  api.ktCoreSetup(guardRecovery,0,0,5*256,0);api.ktCoreDebugForceState(guardRecovery,0,200);
  api.ktCoreAdvance(guardRecovery,0,"",8,"");
  for(const expected of [0,0,1,2]) {
    api.ktCoreAdvance(guardRecovery,0,"",0,"");const victim=JSON.parse(api.ktCoreSnapshot(guardRecovery,1));
    assert.equal(victim.getHitGuarded,true);assert.equal(victim.getHitFallTime,expected);assert.equal(victim.canRecover,expected>=2);
    assert.equal(victim.life,1000);
  }
  assert.equal(api.ktCoreIssues(guardRecovery),"");
} finally { api.ktCoreRelease(guardRecovery); }
console.log("Native Wasm fall recovery permission / thresholds / hitpause clocks / root-helper-projectile capture / CanRecover and HitFall / borrowed SelfState recovery / deferred guard / pure reads: OK (synthetic)");

// CNS owns recoil integration; the incoming acceleration stays canonical across banks.
for(const kind of ["root","helper","projectile"])for(const width of [320,640])for(const mode of ["default","zero","positive","negative"])for(const pause of [0,2]) {
  const params=mode==="default" ? "" : `yaccel=${(mode==="zero" ? 0 : mode==="positive" ? .5 : -.5)*width/320}`;
  const controller=`type=${kind==="projectile" ? "Projectile" : "HitDef"}
trigger1=Time=0
projanim=200
damage=0
pausetime=0,${pause}
ground.hittime=2
${params}`;
  const source=motionIdle+
    (kind==="helper" ? "\n[State 0, helper]\ntype=Helper\ntrigger1=Time=0\nstateno=200" : "")+
    (kind==="projectile" ? "" : "\n[Statedef 200]\ntype=S\nphysics=N\nanim=200")+
    `\n[State ${kind==="projectile" ? 0 : 200}, hit]\n${controller}`;
  const recoil=api.ktCoreCreateWithDefinitions("captured acceleration","authored recoil",projectileFacingAir,air,source,
    `${motionIdle}
[Statedef 5000]
type=A
movetype=H
physics=N
anim=0
[State 5000, observe capture and clock boundaries]
type=PowerSet
trigger1=1
ignorehitpause=1
value=1024+GetHitVar(yaccel)*256+HitShakeOver*10+HitOver*100
[State 5000, authored gravity]
type=VelAdd
trigger1=HitShakeOver
y=GetHitVar(yaccel)`,
    "","",`[Info]\nlocalcoord=${width},${width*3/4}`,"[Info]\nlocalcoord=640,480");
  try {
    api.ktCoreSetup(recoil,0,0,5*256,0);
    if(kind==="root")api.ktCoreDebugForceState(recoil,0,200);else api.ktCoreAdvance(recoil,0,"",0,"");
    api.ktCoreAdvance(recoil,0,"",0,"");
    const amount=mode==="default" ? 89 : mode==="zero" ? 0 : mode==="positive" ? 128 : -128;
    const captured=JSON.parse(api.ktCoreSnapshot(recoil,1));
    assert.equal(captured.getHitAccelerationY256,amount);assert.equal(captured.hitOver,false);assert.equal(captured.hitShakeOver,pause===0);
    for(let tick=1;tick<=pause+4;tick++) {
      api.ktCoreAdvance(recoil,0,"",0,"");
      const victim=JSON.parse(api.ktCoreSnapshot(recoil,1)),active=Math.max(0,tick-pause),shake=tick>=pause,over=active>2;
      assert.equal(victim.getHitAccelerationY256,amount);assert.equal(victim.vy256,active*amount || 0);
      assert.equal(victim.y256,active*(active+1)/2*amount || 0);assert.equal(victim.hitShakeOver,shake);assert.equal(victim.hitOver,over);
      assert.equal(victim.getHitTime,Math.max(-1,2-active));assert.equal(victim.power,1024+amount*2+Number(shake)*10+Number(over)*100);
      assert.equal(victim.life,1000);assert.equal(victim.state,5000);assert.deepEqual(JSON.parse(api.ktCoreContacts(recoil)),[]);
      for(let i=0;i<3;i++)api.ktCoreRenderPlan(recoil,12);
      assert.deepEqual(JSON.parse(api.ktCoreSnapshot(recoil,1)),victim);
    }
    assert.equal(api.ktCoreIssues(recoil),"");
  } finally { api.ktCoreRelease(recoil); }
}
for(const kind of ["root","projectile"])for(const airborne of [false,true])for(const guarded of [false,true]) {
  const controller=`type=${kind==="projectile" ? "Projectile" : "HitDef"}
trigger1=Time=0
projanim=200
damage=0
guardflag=HLA
yaccel=.5
pausetime=0,2
ground.hittime=2
air.hittime=4
guard.hittime=3`;
  const source=kind==="projectile" ? `${motionIdle}
[State 0, shot]
${controller}` :
    `${motionIdle}
[Statedef 200]
type=S
physics=N
anim=200
[State 200, hit]
${controller}`;
  const reactions=[5000,150,152].map(state=>`[Statedef ${state}]
type=${airborne ? "A" : "S"}
movetype=H
physics=N
anim=0`).join("\n");
  const clocks=api.ktCoreCreate("hit clocks","selected duration",projectileFacingAir,air,source,
    `${motionIdle}
ctrl=1
[Statedef 400]
type=A
physics=N
anim=0
ctrl=1
${reactions}`);
  try {
    api.ktCoreSetup(clocks,0,0,5*256,0);if(airborne)api.ktCoreDebugForceState(clocks,1,400);
    if(kind==="root")api.ktCoreDebugForceState(clocks,0,200);else api.ktCoreAdvance(clocks,0,"",guarded ? 8 : 0,"");
    api.ktCoreAdvance(clocks,0,"",guarded ? 8 : 0,"");
    const duration=guarded ? 3 : airborne ? 4 : 2;
    for(let tick=0;tick<=duration+3;tick++) {
      const victim=JSON.parse(api.ktCoreSnapshot(clocks,1)),elapsed=Math.max(0,tick-2);
      assert.equal(victim.getHitGuarded,guarded);assert.equal(victim.getHitTime,Math.max(-1,duration-elapsed));
      assert.equal(victim.hitOver,elapsed>duration);assert.equal(victim.hitShakeOver,tick>=2);
      assert.equal(victim.getHitAccelerationY256,128);
      if(tick<duration+3)api.ktCoreAdvance(clocks,0,"",0,"");
    }
    assert.equal(api.ktCoreIssues(clocks),"");
  } finally { api.ktCoreRelease(clocks); }
}
const borrowedRecoil=api.ktCoreCreateWithDefinitions("recoil bank","own recovery bank",projectileFacingAir,air,
  `${motionIdle}
[Statedef 200]
type=S
physics=N
anim=200
[State 200, hit]
type=HitDef
trigger1=Time=0
damage=0
yaccel=1
ground.hittime=2
p2stateno=700
[Statedef 700]
type=A
movetype=H
physics=N
anim=0
[State 700, authored gravity]
type=VelAdd
trigger1=HitShakeOver
y=GetHitVar(yaccel)
[State 700, own recovery]
type=SelfState
trigger1=HitOver
value=5200`,
  `${motionIdle}
[Statedef 5200]
type=A
movetype=I
physics=N
anim=0
velset=0,0`,"","","[Info]\nlocalcoord=640,480","");
try {
  api.ktCoreSetup(borrowedRecoil,0,0,5*256,0);api.ktCoreDebugForceState(borrowedRecoil,0,200);
  api.ktCoreAdvance(borrowedRecoil,0,"",0,"");
  for(let tick=1;tick<=2;tick++) {
    api.ktCoreAdvance(borrowedRecoil,0,"",0,"");const victim=JSON.parse(api.ktCoreSnapshot(borrowedRecoil,1));
    assert.equal(victim.state,700);assert.equal(victim.stateOwner,1);assert.equal(victim.getHitAccelerationY256,128);
    assert.equal(victim.vy256,tick*128);assert.equal(victim.y256,tick*(tick+1)/2*128);assert.equal(victim.hitOver,false);
  }
  api.ktCoreAdvance(borrowedRecoil,0,"",0,"");const recovered=JSON.parse(api.ktCoreSnapshot(borrowedRecoil,1));
  assert.equal(recovered.state,5200);assert.equal(recovered.stateOwner,2);assert.equal(recovered.vy256,0);
  assert.equal(recovered.localCoordWidth,320);assert.equal(recovered.getHitAccelerationY256,128);assert.equal(recovered.hitOver,true);
  assert.equal(api.ktCoreIssues(borrowedRecoil),"");
} finally { api.ktCoreRelease(borrowedRecoil); }
console.log("Native Wasm captured HitDef yaccel / authored recoil / HitOver and HitShakeOver / root-helper-projectile / selected hit-guard-air clocks / pause boundaries / borrowed SelfState recovery / pure reads: OK (synthetic)");

const reactionTypeAir=`${air}\n`+[0,1,2,3,4,5].map(code=>`[Begin Action ${5000+code}]\n${5000+code},0,0,0,-1`).join("\n");
const animationCases=[
  ...["light","medium","hard","back","up","diagup"].flatMap((name,code)=>[
    {params:`animtype=${name}`,airborne:false,guarded:false,expected:Math.min(code,2)},
    {params:`animtype=${name}\nground.velocity=0,-2`,airborne:false,guarded:false,expected:code},
    {params:`animtype=hard\nair.animtype=${name}`,airborne:true,guarded:false,expected:code},
    {params:`fall=1\nair.animtype=up\nfall.animtype=${name}`,airborne:false,guarded:false,expected:code},
    {params:`fall=0\nair.fall=1\nfall.animtype=${name}`,airborne:true,guarded:false,expected:code}
  ]),
  {params:"fall=1\nanimtype=medium\nair.animtype=up\nfall.animtype=diagup",airborne:false,guarded:true,expected:1},
  {params:"fall=1\nanimtype=medium\nair.animtype=up\nfall.animtype=diagup",airborne:true,guarded:true,expected:4},
  {params:"fall=1\nair.animtype=up",airborne:false,guarded:false,expected:4},
  {params:"fall=1\nair.animtype=diagup",airborne:false,guarded:false,expected:3},
  {params:"",airborne:false,guarded:false,expected:0}
];
for(const kind of ["root","helper","projectile"])for(const width of [320,640])for(const test of animationCases) {
  const hit=`type=${kind==="projectile" ? "Projectile" : "HitDef"}
trigger1=Time=0
projanim=200
damage=0
guardflag=HLA
${test.params}`;
  const source=motionIdle+
    (kind==="helper" ? "\n[State 0, helper]\ntype=Helper\ntrigger1=Time=0\nstateno=200" : "")+
    (kind==="projectile" ? "" : "\n[Statedef 200]\ntype=S\nphysics=N\nanim=200")+
    `\n[State ${kind==="projectile" ? 0 : 200}, hit]\n${hit}`;
  const reactions=[5000,150,152].map(state=>`[Statedef ${state}]
type=S
movetype=H
physics=N
anim=0
[State ${state}, authored hit animation]
type=ChangeAnim
trigger1=Time=0
value=5000+GetHitVar(animtype)`).join("\n");
  const hitAnimation=api.ktCoreCreateWithDefinitions("animation capture","authored reaction",projectileFacingAir,reactionTypeAir,
    source,`${motionIdle}\nctrl=1\n[Statedef 400]\ntype=A\nphysics=N\nanim=0\nctrl=1\n${reactions}`,
    "","",`[Info]\nlocalcoord=${width},${width*3/4}`,"[Info]\nlocalcoord=640,480");
  try {
    api.ktCoreSetup(hitAnimation,0,0,5*256,0);if(test.airborne)api.ktCoreDebugForceState(hitAnimation,1,400);
    if(kind==="root")api.ktCoreDebugForceState(hitAnimation,0,200);else api.ktCoreAdvance(hitAnimation,0,"",test.guarded ? 8 : 0,"");
    api.ktCoreAdvance(hitAnimation,0,"",test.guarded ? 8 : 0,"");
    const captured=JSON.parse(api.ktCoreSnapshot(hitAnimation,1));
    assert.equal(captured.getHitAnimType,test.expected);assert.equal(captured.anim,0);assert.equal(captured.getHitGuarded,test.guarded);
    api.ktCoreAdvance(hitAnimation,0,"",0,"");
    const reacted=JSON.parse(api.ktCoreSnapshot(hitAnimation,1));
    assert.equal(reacted.getHitAnimType,test.expected);assert.equal(reacted.anim,5000+test.expected);
    assert.equal(reacted.life,1000);assert.equal(reacted.power,0);assert.equal(JSON.parse(api.ktCoreSnapshot(hitAnimation,0)).power,0);
    assert.deepEqual(JSON.parse(api.ktCoreContacts(hitAnimation)),[]);
    for(let i=0;i<3;i++)api.ktCoreRenderPlan(hitAnimation,12);
    assert.deepEqual(JSON.parse(api.ktCoreSnapshot(hitAnimation,1)),reacted);assert.equal(api.ktCoreIssues(hitAnimation),"");
  } finally { api.ktCoreRelease(hitAnimation); }
}
const borrowedHitAnimation=api.ktCoreCreateWithDefinitions("borrowed reaction bank","own actor",`${projectileFacingAir}\n${reactionTypeAir}`,air,
  `${motionIdle}
[Statedef 200]
type=S
physics=N
anim=200
[State 200, hit]
type=HitDef
trigger1=Time=0
damage=0
fall=1
fall.animtype=diagup
p2stateno=700
[Statedef 700]
type=A
movetype=H
physics=N
anim=0
[State 700, choose animation in borrowed bank]
type=ChangeAnim2
trigger1=Time=0
value=5000+GetHitVar(animtype)
[State 700, return]
type=SelfState
trigger1=Time=1
value=0`,motionIdle,"","","[Info]\nlocalcoord=640,480","");
try {
  api.ktCoreSetup(borrowedHitAnimation,0,0,5*256,0);api.ktCoreDebugForceState(borrowedHitAnimation,0,200);
  api.ktCoreAdvance(borrowedHitAnimation,0,"",0,"");api.ktCoreAdvance(borrowedHitAnimation,0,"",0,"");
  const borrowed=JSON.parse(api.ktCoreSnapshot(borrowedHitAnimation,1));
  assert.equal(borrowed.stateOwner,1);assert.equal(borrowed.animationOwner,1);assert.equal(borrowed.localCoordWidth,640);
  assert.equal(borrowed.getHitAnimType,5);assert.equal(borrowed.anim,5005);
  api.ktCoreAdvance(borrowedHitAnimation,0,"",0,"");
  const own=JSON.parse(api.ktCoreSnapshot(borrowedHitAnimation,1));
  assert.equal(own.stateOwner,2);assert.equal(own.animationOwner,2);assert.equal(own.localCoordWidth,320);
  assert.equal(own.getHitAnimType,5);assert.equal(own.anim,0);assert.equal(api.ktCoreIssues(borrowedHitAnimation),"");
} finally { api.ktCoreRelease(borrowedHitAnimation); }
console.log("Native Wasm hit animation strings / ground-air-fall selection / inherited defaults / guards / root-helper-projectile / authored ChangeAnim / borrowed banks and SelfState / pure reads: OK (synthetic)");

for(const kind of ["root","helper","projectile"])for(const width of [320,640])for(const face of [false,true])for(const airborne of [false,true])for(const mode of ["default","explicit","zero"])for(const pause of [0,2]) {
  const units=width/320;
  const overrides=mode==="default" ? "" : mode==="zero" ? "guard.velocity=0\nairguard.velocity=0,0" :
    `guard.velocity=${3*units},${-units}\nairguard.velocity=${6*units},${-4*units}`;
  const hit=`type=${kind==="projectile" ? "Projectile" : "HitDef"}
trigger1=Time=0
projanim=200
damage=10,2
guardflag=HLA
ground.velocity=${8*units},${-6*units}
air.velocity=${4*units},${-8*units}
guard.pausetime=0,${pause}
${overrides}`;
  const source=motionIdle+
    (kind==="helper" ? "\n[State 0, helper]\ntype=Helper\ntrigger1=Time=0\nstateno=200" : "")+
    (kind==="projectile" ? "" : "\n[Statedef 200]\ntype=S\nphysics=N\nanim=200")+
    `\n[State ${kind==="projectile" ? 0 : 200}, hit]\n${hit}`;
  const restore=[150,152].map(state=>`[Statedef ${state}]
type=S
movetype=H
physics=N
anim=0
[State ${state}, clobber]
type=VelSet
trigger1=Time=0
ignorehitpause=1
x=99
y=88
[State ${state}, restore captured guard vector]
type=HitVelSet
trigger1=Time=0
ignorehitpause=1
x=1
y=1`).join("\n");
  const guardMotion=api.ktCoreCreateWithDefinitions("guard vector source","guard recipient",projectileFacingAir,air,
    source,`${motionIdle}\nctrl=1\n[Statedef 400]\ntype=A\nphysics=N\nanim=0\nctrl=1\n${restore}`,
    "","",`[Info]\nlocalcoord=${width},${width*3/4}`,"[Info]\nlocalcoord=640,480");
  try {
    api.ktCoreSetup(guardMotion,0,0,(face ? 5 : -5)*256,0);
    api.ktCoreDebugSetFacing(guardMotion,0,face);api.ktCoreDebugSetFacing(guardMotion,1,!face);
    if(airborne)api.ktCoreDebugForceState(guardMotion,1,400);
    const input=face ? 8 : 4;
    if(kind==="root")api.ktCoreDebugForceState(guardMotion,0,200);else api.ktCoreAdvance(guardMotion,0,"",input,"");
    api.ktCoreAdvance(guardMotion,0,"",input,"");
    const expectedX=(face ? 1 : -1)*(mode==="zero" ? 0 : airborne ? 6 : mode==="default" ? 8 : 3)*256 || 0;
    const expectedY=(mode==="zero" ? 0 : airborne ? -4 : mode==="default" ? 0 : -1)*256 || 0;
    const captured=JSON.parse(api.ktCoreSnapshot(guardMotion,1));
    assert.equal(captured.state,airborne ? 152 : 150);assert.equal(captured.getHitGuarded,true);
    assert.equal(captured.getHitX256,expectedX);assert.equal(captured.getHitY256,expectedY);
    assert.equal(captured.getHitDamage,2);assert.equal(captured.life,998);assert.equal(captured.hitPause,pause);
    api.ktCoreDebugSetFacing(guardMotion,1,face);
    for(let tick=1;tick<=pause+2;tick++) {
      api.ktCoreAdvance(guardMotion,0,"",0,"");const victim=JSON.parse(api.ktCoreSnapshot(guardMotion,1));
      const active=Math.max(0,tick-pause);
      assert.equal(victim.vx256,expectedX);assert.equal(victim.vy256,expectedY);
      assert.equal(victim.x256,(face ? 5 : -5)*256+active*expectedX);assert.equal(victim.y256,active*expectedY || 0);
      assert.equal(victim.getHitX256,expectedX);assert.equal(victim.getHitY256,expectedY);
      assert.equal(victim.life,998);assert.equal(victim.power,3);assert.equal(JSON.parse(api.ktCoreSnapshot(guardMotion,0)).power,3);
      assert.deepEqual(JSON.parse(api.ktCoreContacts(guardMotion)),[]);
      for(let i=0;i<3;i++)api.ktCoreRenderPlan(guardMotion,12);
      assert.deepEqual(JSON.parse(api.ktCoreSnapshot(guardMotion,1)),victim);
    }
    assert.equal(api.ktCoreIssues(guardMotion),"");
  } finally { api.ktCoreRelease(guardMotion); }
}
console.log("Native Wasm ground and aerial guard vectors / pre-quantization defaults / root-helper-projectile capture / mixed units / impact facing / HitVelSet restore / pause / chip and power / pure reads: OK (synthetic)");

const guardTimingCases=[
  {params:"",slide:4,ground:4,air:4},
  {params:"guard.slidetime=3",slide:3,ground:3,air:3},
  {params:"guard.slidetime=2\nguard.ctrltime=3\nairguard.ctrltime=1",slide:2,ground:3,air:1},
  {params:"guard.slidetime=0\nguard.ctrltime=-1\nairguard.ctrltime=0",slide:0,ground:-1,air:0},
  {params:"guard.slidetime=2147483647\nguard.ctrltime=2147483647",slide:2147483647,ground:2147483647,air:2147483647}
];
for(const kind of ["root","helper","projectile"])for(const width of [320,640])for(const airborne of [false,true])for(const test of guardTimingCases)for(const pause of [0,2]) {
  const hit=`type=${kind==="projectile" ? "Projectile" : "HitDef"}
trigger1=Time=0
projanim=200
damage=0
guardflag=HLA
guard.velocity=${width/320}
airguard.velocity=${width/320},0
ground.hittime=2
guard.hittime=4
guard.pausetime=0,${pause}
${test.params}`;
  const source=motionIdle+
    (kind==="helper" ? "\n[State 0, helper]\ntype=Helper\ntrigger1=Time=0\nstateno=200" : "")+
    (kind==="projectile" ? "" : "\n[Statedef 200]\ntype=S\nphysics=N\nanim=200")+
    `\n[State ${kind==="projectile" ? 0 : 200}, hit]\n${hit}`;
  const reaction=[150,152].map(state=>`[Statedef ${state}]
type=S
movetype=H
physics=N
anim=0
ctrl=0
[State ${state}, stop sliding]
type=VelSet
trigger1=Time>=GetHitVar(slidetime)
x=0
[State ${state}, restore control]
type=CtrlSet
trigger1=Time>=GetHitVar(ctrltime)
value=1`).join("\n");
  const timing=api.ktCoreCreateWithDefinitions("guard thresholds","authored guard decisions",projectileFacingAir,air,source,
    `${motionIdle}\nctrl=1\n[Statedef 400]\ntype=A\nphysics=N\nanim=0\nctrl=1\n${reaction}`,
    "","",`[Info]\nlocalcoord=${width},${width*3/4}`,"[Info]\nlocalcoord=640,480");
  try {
    api.ktCoreSetup(timing,0,0,5*256,0);if(airborne)api.ktCoreDebugForceState(timing,1,400);
    if(kind==="root")api.ktCoreDebugForceState(timing,0,200);else api.ktCoreAdvance(timing,0,"",8,"");
    api.ktCoreAdvance(timing,0,"",8,"");
    const control=airborne ? test.air : test.ground,captured=JSON.parse(api.ktCoreSnapshot(timing,1));
    assert.equal(captured.getHitSlideTime,test.slide);assert.equal(captured.getHitControlTime,control);assert.equal(captured.ctrl,0);
    for(let tick=1;tick<=pause+6;tick++) {
      api.ktCoreAdvance(timing,0,"",0,"");const victim=JSON.parse(api.ktCoreSnapshot(timing,1));
      const active=Math.max(0,tick-pause),stopped=active>0 && active-1>=test.slide,ready=active>0 && active-1>=control;
      assert.equal(victim.getHitSlideTime,test.slide);assert.equal(victim.getHitControlTime,control);
      assert.equal(victim.getHitTime,Math.max(-1,4-active));assert.equal(victim.ctrl,Number(ready));
      assert.equal(victim.vx256,stopped ? 0 : 256);assert.equal(victim.x256,(5+Math.min(active,Math.max(0,test.slide)))*256);
      assert.equal(victim.state,airborne ? 152 : 150);assert.equal(victim.life,1000);assert.equal(victim.power,0);
      assert.deepEqual(JSON.parse(api.ktCoreContacts(timing)),[]);
      for(let i=0;i<3;i++)api.ktCoreRenderPlan(timing,12);
      assert.deepEqual(JSON.parse(api.ktCoreSnapshot(timing,1)),victim);
    }
    assert.equal(api.ktCoreIssues(timing),"");
  } finally { api.ktCoreRelease(timing); }
}
const borrowedSlide=api.ktCoreCreateWithDefinitions("slide timing bank","own actor",projectileFacingAir,air,
  `${motionIdle}
[Statedef 200]
type=S
physics=N
anim=200
[State 200, hit]
type=HitDef
trigger1=Time=0
damage=0
ground.velocity=2,0
ground.slidetime=2
guard.slidetime=9
guard.ctrltime=6
p2stateno=700
[Statedef 700]
type=S
movetype=H
physics=N
anim=0
[State 700, stop slide]
type=VelSet
trigger1=Time>=GetHitVar(slidetime)
x=0
[State 700, own state]
type=SelfState
trigger1=Time=3
value=0`,motionIdle,"","","[Info]\nlocalcoord=640,480","");
try {
  api.ktCoreSetup(borrowedSlide,0,0,5*256,0);api.ktCoreDebugForceState(borrowedSlide,0,200);
  api.ktCoreAdvance(borrowedSlide,0,"",0,"");
  for(let tick=1;tick<=3;tick++) {
    api.ktCoreAdvance(borrowedSlide,0,"",0,"");const victim=JSON.parse(api.ktCoreSnapshot(borrowedSlide,1));
    assert.equal(victim.stateOwner,1);assert.equal(victim.localCoordWidth,640);
    assert.equal(victim.getHitSlideTime,2);assert.equal(victim.getHitControlTime,0);
    assert.equal(victim.x256,(5+Math.min(tick,2))*256);assert.equal(victim.vx256,tick<=2 ? 256 : 0);
  }
  api.ktCoreAdvance(borrowedSlide,0,"",0,"");const own=JSON.parse(api.ktCoreSnapshot(borrowedSlide,1));
  assert.equal(own.stateOwner,2);assert.equal(own.localCoordWidth,320);assert.equal(own.getHitSlideTime,2);
  assert.equal(own.x256,7*256);assert.equal(own.vx256,0);assert.equal(api.ktCoreIssues(borrowedSlide),"");
} finally { api.ktCoreRelease(borrowedSlide); }
console.log("Native Wasm slide and guard control thresholds / inherited defaults / ground-air selection / authored VelSet and CtrlSet / root-helper-projectile / signed bounds / pause / borrowed state units / pure reads: OK (synthetic)");

const fallCarryCases=[
  {params:"",ground:true,air:true},
  {params:"forcenofall=1",ground:false,air:false},
  {params:"fall=1\nforcenofall=1",ground:true,air:true},
  {params:"air.fall=1\nforcenofall=1",ground:false,air:true},
  {params:"fall=1\nair.fall=0\nforcenofall=1",ground:true,air:true},
  {params:"fall=0\nair.fall=0",ground:true,air:true},
  {params:"",ground:false,air:false,recovered:true}
];
for(const kind of ["root","helper","projectile"])for(const width of [320,640])for(const airborne of [false,true])for(const guarded of [false,true])for(const test of fallCarryCases) {
  const follow=`type=${kind==="projectile" ? "Projectile" : "HitDef"}
trigger1=Time=0
projanim=200
damage=0
guardflag=HLA
fall.damage=30
fall.recovertime=0
animtype=medium
air.animtype=diagup
fall.animtype=up
${test.params}`;
  const source=`${motionIdle}
[Statedef 200]
type=S
physics=N
anim=200
[State 200, initial knockdown]
type=HitDef
trigger1=Time=0
damage=0
fall=1
[Statedef 300]
type=S
physics=N
anim=${kind==="root" ? 200 : 0}`+
    (kind==="helper" ? "\n[State 300, helper]\ntype=Helper\ntrigger1=Time=0\nstateno=400\n[Statedef 400]\ntype=S\nphysics=N\nanim=200" : "")+
    `\n[State ${kind==="helper" ? 400 : 300}, follow-up]\n${follow}`;
  const victim=`${motionIdle}
ctrl=1
[Statedef 5000]
type=${airborne ? "A" : "S"}
movetype=H
physics=N
anim=0
ctrl=1
[Statedef 150]
type=S
movetype=H
physics=N
anim=0
ctrl=1
[Statedef 152]
type=A
movetype=H
physics=N
anim=0
ctrl=1`;
  const carry=api.ktCoreCreateWithDefinitions("fall follow-up","fall recipient",projectileFacingAir,air,source,victim,
    "","",`[Info]\nlocalcoord=${width},${width*3/4}`,"");
  try {
    api.ktCoreSetup(carry,0,0,5*256,0);api.ktCoreDebugForceState(carry,0,200);api.ktCoreAdvance(carry,0,"",0,"");
    assert.equal(JSON.parse(api.ktCoreSnapshot(carry,1)).getHitFall,true);
    if(test.recovered)api.ktCoreDebugForceState(carry,1,0);
    api.ktCoreDebugForceState(carry,0,300);
    if(kind!=="root")api.ktCoreAdvance(carry,0,"",guarded ? 8 : 0,"");
    api.ktCoreAdvance(carry,0,"",guarded ? 8 : 0,"");
    const expected=!guarded && (airborne && !test.recovered ? test.air : test.ground);
    const captured=JSON.parse(api.ktCoreSnapshot(carry,1));
    assert.equal(JSON.parse(api.ktCoreContacts(carry)).length,1);assert.equal(captured.getHitGuarded,guarded);
    assert.equal(captured.getHitFall,expected);assert.equal(captured.canRecover,expected);assert.equal(captured.getHitFallTime,0);
    assert.equal(captured.getHitFallDamage,30);assert.equal(captured.getHitAnimType,expected ? 4 : airborne && !test.recovered ? 5 : 1);
    assert.equal(captured.life,1000);assert.equal(captured.power,0);
    for(let i=0;i<3;i++)api.ktCoreRenderPlan(carry,12);
    assert.deepEqual(JSON.parse(api.ktCoreSnapshot(carry,1)),captured);
    api.ktCoreAdvance(carry,0,"",0,"");const next=JSON.parse(api.ktCoreSnapshot(carry,1));
    assert.equal(next.getHitFall,expected);assert.equal(next.getHitFallTime,expected ? 1 : 0);
    assert.equal(next.getHitFallDamage,30);assert.equal(next.life,1000);assert.deepEqual(JSON.parse(api.ktCoreContacts(carry)),[]);
    assert.equal(api.ktCoreIssues(carry),"");
  } finally { api.ktCoreRelease(carry); }
}
console.log("Native Wasm active fall carry / forcenofall priority / air.fall overrides / root-helper-projectile follow-ups / guard and recovery gates / new metadata and animation / pure reads: OK (synthetic)");

for(const kind of ["root","helper"])for(const guarded of [false,true])for(const pause of [0,2])for(const mode of ["keep","normal-reset","pause-reset"]) {
  const reset=mode==="keep" ? "" : `\n[State 200, reset move result]\ntype=MoveHitReset\ntrigger1=${mode==="normal-reset" ? "MoveContact>=3" : "MoveContact"}\nignorehitpause=${mode==="pause-reset" ? 1 : 0}`;
  const attack=`[Statedef 200]
type=S
movetype=A
physics=N
anim=200
[State 200, manual count]
type=HitAdd
trigger1=Time=0
value=7
[State 200, observe elapsed result before increment]
type=PowerSet
trigger1=1
ignorehitpause=1
value=MoveContact*100+MoveHit*10+MoveGuarded+HitCount
[State 200, hit]
type=HitDef
trigger1=Time=0
damage=10,2
guardflag=HL
getpower=0,0
givepower=0,0
pausetime=${pause},0
guard.pausetime=${pause},0
${reset}`;
  const source=`${motionIdle}`+(kind==="helper" ? "\n[State 0, helper]\ntype=Helper\ntrigger1=Time=0\nstateno=200" : "")+`\n${attack}`;
  const contact=api.ktCoreCreate("elapsed contact","victim",projectileFacingAir,air,source,hitFlagStates);
  try {
    api.ktCoreSetup(contact,0,0,5*256,0);
    if(kind==="root")api.ktCoreDebugForceState(contact,0,200);else api.ktCoreAdvance(contact,0,"",guarded ? 8 : 0,"");
    api.ktCoreAdvance(contact,0,"",guarded ? 8 : 0,"");
    let age=1;
    assert.equal(JSON.parse(api.ktCoreSnapshot(contact,0)).moveContactTime,kind==="root" ? 1 : 0);
    for(let tick=1;tick<=pause+5;tick++) {
      const observed=age,frozen=tick<=pause;
      if(mode==="pause-reset" && age>0 || mode==="normal-reset" && !frozen && age>=3)age=0;
      else if(!frozen && age>0)age++;
      api.ktCoreAdvance(contact,0,"",0,"");const actor=JSON.parse(api.ktCoreSnapshot(contact,0));
      assert.equal(actor.power,observed*(guarded ? 101 : 110)+7);
      assert.equal(actor.hitCount,kind==="root" ? 7 : 0);
      assert.equal(actor.moveContactTime,kind==="root" ? age : 0);
      assert.equal(actor.moveHitTime,kind==="root" && !guarded ? age : 0);
      assert.equal(actor.moveGuardedTime,kind==="root" && guarded ? age : 0);
      assert.equal(actor.moveContact,kind==="root" && age>0);assert.equal(actor.moveHit,kind==="root" && !guarded && age>0);
      assert.equal(JSON.parse(api.ktCoreSnapshot(contact,1)).life,guarded ? 998 : 990);
      assert.deepEqual(JSON.parse(api.ktCoreContacts(contact)),[]);
      for(let i=0;i<3;i++)api.ktCoreRenderPlan(contact,12);
      assert.deepEqual(JSON.parse(api.ktCoreSnapshot(contact,0)),actor);
    }
    assert.equal(api.ktCoreIssues(contact),"");
  } finally { api.ktCoreRelease(contact); }
}
for(const persist of [0,1]) {
  const carriedClock=api.ktCoreCreate("persisted clock","victim",projectileFacingAir,air,
    `${motionIdle}
[Statedef 200]
type=S
movetype=A
physics=N
anim=200
[State 200, hit]
type=HitDef
trigger1=Time=0
damage=0
[Statedef 300]
type=S
movetype=A
physics=N
anim=0
movehitpersist=${persist}
[State 300, observe carried elapsed time]
type=PowerSet
trigger1=Time=0
value=MoveContact
[State 300, explicit clear]
type=MoveHitReset
trigger1=Time=1`,motionIdle);
  try {
    api.ktCoreSetup(carriedClock,0,0,5*256,0);api.ktCoreDebugForceState(carriedClock,0,200);
    for(let i=0;i<3;i++)api.ktCoreAdvance(carriedClock,0,"",0,"");
    assert.equal(JSON.parse(api.ktCoreSnapshot(carriedClock,0)).moveHitTime,3);
    api.ktCoreDebugForceState(carriedClock,0,300);
    assert.equal(JSON.parse(api.ktCoreSnapshot(carriedClock,0)).moveHitTime,persist ? 3 : 0);
    api.ktCoreAdvance(carriedClock,0,"",0,"");const state=JSON.parse(api.ktCoreSnapshot(carriedClock,0));
    assert.equal(state.power,persist ? 3 : 0);assert.equal(state.moveHitTime,persist ? 4 : 0);
    api.ktCoreAdvance(carriedClock,0,"",0,"");assert.equal(JSON.parse(api.ktCoreSnapshot(carriedClock,0)).moveHitTime,0);
    assert.equal(api.ktCoreIssues(carriedClock),"");
  } finally { api.ktCoreRelease(carriedClock); }
}
const resetShotHistory=api.ktCoreCreate("independent projectile history","victim",projectileFacingAir,air,
  `${motionIdle}
[State 0, projectile]
type=Projectile
trigger1=Time=0
projanim=200
projid=7
damage=10
getpower=0,0
givepower=0,0
[State 0, observe shot history]
type=PowerSet
trigger1=Time=2
value=ProjHitTime(7)
[State 0, clear body result]
type=MoveHitReset
trigger1=Time>=1`,motionIdle);
try {
  api.ktCoreSetup(resetShotHistory,0,0,5*256,0);
  for(let i=0;i<3;i++)api.ktCoreAdvance(resetShotHistory,0,"",0,"");
  const actor=JSON.parse(api.ktCoreSnapshot(resetShotHistory,0));
  assert.equal(actor.moveContactTime,0);assert.equal(actor.power,1);
  assert.equal(JSON.parse(api.ktCoreSnapshot(resetShotHistory,1)).life,990);assert.equal(api.ktCoreIssues(resetShotHistory),"");
} finally { api.ktCoreRelease(resetShotHistory); }
console.log("Native Wasm elapsed MoveContact/MoveHit/MoveGuarded / MoveHitReset / root-helper clocks / hitpause / StateDef persistence / spent HitDef and manual count preservation / independent projectile history / pure reads: OK (synthetic)");

const positionFreezeCases=[
  {name:"default",params:"",trigger:"1"},
  {name:"zero",params:"value=0",trigger:"1"},
  {name:"negative",params:"value=-.5",trigger:"1"},
  {name:"first-tick",params:"",trigger:"Time=0"},
  {name:"persistent-zero",params:"persistent=0",trigger:"1"},
  {name:"expression",params:"value=ifelse(Time<2,max(0,.5),0)",trigger:"1"}
];
for(const width of [320,640])for(const pause of [0,2])for(const test of positionFreezeCases) {
  const held=api.ktCoreCreateWithDefinitions("position hold","incoming hit",air,projectileFacingAir,
    `${motionIdle}
[Statedef 5000]
type=A
movetype=H
physics=N
anim=0
[State 5000, accelerate while held]
type=VelAdd
trigger1=1
y=${.5*width/320}
[State 5000, position freeze]
type=PosFreeze
trigger1=${test.trigger}
${test.params}`,
    `${motionIdle}
[Statedef 200]
type=S
movetype=A
physics=N
anim=200
[State 200, create incoming motion and pause]
type=HitDef
trigger1=Time=0
damage=0
getpower=0,0
givepower=0,0
ground.velocity=4,-2
ground.hittime=20
pausetime=0,${pause}`,"","",`[Info]\nlocalcoord=${width},${width*3/4}`,"");
  try {
    api.ktCoreSetup(held,0,0,-5*256,0);api.ktCoreDebugSetFacing(held,1,true);api.ktCoreDebugForceState(held,1,200);
    api.ktCoreAdvance(held,0,"",0,"");
    let x=0,y=0;
    for(let tick=1;tick<=pause+5;tick++) {
      const active=Math.max(0,tick-pause),running=active>0;
      const freeze=running && (test.name==="default" || test.name==="negative" ||
        (test.name==="first-tick" || test.name==="persistent-zero") && active===1 || test.name==="expression" && active<=2);
      if(running && !freeze){x+=4*256;y+=-2*256+active*128;}
      api.ktCoreAdvance(held,0,"",0,"");const actor=JSON.parse(api.ktCoreSnapshot(held,0));
      assert.equal(actor.positionFrozen,freeze);assert.equal(actor.x256,x);assert.equal(actor.y256,y);
      assert.equal(actor.vx256,4*256);assert.equal(actor.vy256,-2*256+active*128);
      assert.equal(actor.stateTime,active);assert.equal(actor.animationTime,active);
      assert.equal(actor.life,1000);assert.equal(actor.power,0);assert.deepEqual(JSON.parse(api.ktCoreContacts(held)),[]);
      for(let i=0;i<3;i++)api.ktCoreRenderPlan(held,12);
      assert.deepEqual(JSON.parse(api.ktCoreSnapshot(held,0)),actor);
    }
    assert.equal(api.ktCoreIssues(held),"");
  } finally { api.ktCoreRelease(held); }
}
for(const frozen of [0,1,2,3]) {
  const pushFreeze=api.ktCoreCreate("push left","push right",air,air,
    motionIdle+(frozen&1 ? "\n[State 0, hold]\ntype=PosFreeze\ntrigger1=1" : ""),
    motionIdle+(frozen&2 ? "\n[State 0, hold]\ntype=PosFreeze\ntrigger1=1" : ""));
  try {
    api.ktCoreSetup(pushFreeze,-5*256,0,5*256,0);api.ktCoreConfigureArena(pushFreeze,-100,100,0,true,false);
    api.ktCoreAdvance(pushFreeze,0,"",0,"");
    const left=JSON.parse(api.ktCoreSnapshot(pushFreeze,0)),right=JSON.parse(api.ktCoreSnapshot(pushFreeze,1));
    assert.equal(left.x256,(frozen===0 ? -15 : frozen===2 ? -25 : -5)*256);
    assert.equal(right.x256,(frozen===0 ? 15 : frozen===1 ? 25 : 5)*256);
    assert.equal(left.positionFrozen,!!(frozen&1));assert.equal(right.positionFrozen,!!(frozen&2));
    assert.equal(api.ktCoreIssues(pushFreeze),"");
  } finally { api.ktCoreRelease(pushFreeze); }
}
for(const width of [320,640]) {
  const helperFreeze=api.ktCoreCreateWithDefinitions("moving root","victim",air,air,
    `${motionIdle}
[State 0, root motion]
type=VelSet
trigger1=Time=0
x=${width/320}
[State 0, helper]
type=Helper
trigger1=Time=0
stateno=200
[Statedef 200]
type=S
physics=N
anim=0
[State 200, helper motion]
type=VelSet
trigger1=Time=0
x=${2*width/320}
[State 200, temporary hold]
type=PosFreeze
trigger1=Time<2`,motionIdle,"","",`[Info]\nlocalcoord=${width},${width*3/4}`,"");
  try {
    api.ktCoreSetup(helperFreeze,0,0,100*256,0);api.ktCoreAdvance(helperFreeze,0,"",0,"");
    for(let tick=1;tick<=4;tick++) {
      api.ktCoreAdvance(helperFreeze,0,"",0,"");const actor=JSON.parse(api.ktCoreSnapshot(helperFreeze,0));
      assert.equal(actor.positionFrozen,false);assert.equal(actor.x256,(tick+1)*256);
      const helper=JSON.parse(api.ktCoreRenderPlan(helperFreeze,12)).draws.find(draw=>draw.kind==="helper");
      assert.ok(Math.abs(helper.x-(480+(1+Math.max(0,tick-2)*2)*1.4))<1e-9);
      assert.equal(helper.elemTime,tick);
    }
    assert.equal(api.ktCoreIssues(helperFreeze),"");
  } finally { api.ktCoreRelease(helperFreeze); }
}
console.log("Native Wasm PosFreeze / active tick lifetime / signed and expression flags / velocity and animation clocks / incoming hitpause / mixed units / arena push anchoring / helper motion / pure reads: OK (synthetic)");

const prioritySignature=draws=>draws.map(d=>`${d.kind}:${d.side}:${d.sprpriority}`);
for(const width of [320,640])for(const actorPriority of [-5,0,5])for(const helperPriority of [-3,3])for(const shotPriority of [-4,4])for(const effectPriority of [-2,2]) {
  const layering=api.ktCoreCreateWithDefinitions("actor layering","other actor",air,air,
    `${motionIdle}
[State 0, actor priority]
type=SprPriority
trigger1=1
value=ifelse(Time=0,${actorPriority},${-actorPriority})
[State 0, read priority]
type=PowerSet
trigger1=1
value=SprPriority+5
[State 0, helper]
type=Helper
trigger1=Time=0
stateno=7100
[State 0, projectile]
type=Projectile
trigger1=Time=0
projanim=0
projhits=0
projremovetime=-1
projsprpriority=${shotPriority}
[State 0, effect]
type=Explod
trigger1=Time=0
anim=0
id=7
removetime=-1
sprpriority=${effectPriority}
[Statedef 7100]
type=S
physics=N
anim=0
sprpriority=${helperPriority}`,`${motionIdle}\nsprpriority=0`,"","",`[Info]\nlocalcoord=${width},${width*3/4}`,"");
  try {
    api.ktCoreSetup(layering,0,0,100*256,0);
    for(const selected of [actorPriority,-actorPriority || 0]) {
      api.ktCoreAdvance(layering,0,"",0,"");const actor=JSON.parse(api.ktCoreSnapshot(layering,0));
      assert.equal(actor.spritePriority,selected);assert.equal(actor.power,selected+5);
      const expected=[{kind:"fighter",side:0,sprpriority:selected},{kind:"fighter",side:1,sprpriority:0},
        {kind:"helper",side:0,sprpriority:helperPriority},{kind:"projectile",side:0,sprpriority:shotPriority},
        {kind:"explod",side:0,sprpriority:effectPriority}].sort((a,b)=>a.sprpriority-b.sprpriority);
      const before=api.ktCoreChecksum(layering);
      for(const debt of [0,12,0]) {
        const plan=JSON.parse(api.ktCoreRenderPlan(layering,debt));
        assert.deepEqual(prioritySignature(plan.draws),prioritySignature(expected));
        assert.equal(api.ktCoreChecksum(layering),before);
      }
      assert.deepEqual(JSON.parse(api.ktCoreContacts(layering)),[]);
    }
    assert.equal(api.ktCoreIssues(layering),"");
  } finally { api.ktCoreRelease(layering); }
}
for(const value of [-2147483648,2147483647]) {
  const extremeLayer=api.ktCoreCreate("extreme draw order","victim",air,air,
    `${motionIdle}
[State 0, projectile]
type=Projectile
trigger1=Time=0
projanim=0
projhits=0
projsprpriority=${value}
[State 0, top effect]
type=Explod
trigger1=Time=0
anim=0
id=9
removetime=-1
ontop=1`,motionIdle);
  try {
    api.ktCoreAdvance(extremeLayer,0,"",0,"");const plan=JSON.parse(api.ktCoreRenderPlan(extremeLayer,0));
    assert.equal(plan.draws.find(d=>d.kind==="projectile").sprpriority,value);
    assert.equal(plan.draws.at(-1).effectId,9);assert.equal(plan.draws.at(-1).sprpriority,2147483648);
    assert.equal(api.ktCoreIssues(extremeLayer),"");
  } finally { api.ktCoreRelease(extremeLayer); }
}
const borrowedPriority=api.ktCoreCreateWithDefinitions("priority bank","own actor",projectileFacingAir,air,
  `${motionIdle}
[Statedef 200]
type=S
physics=N
anim=200
sprpriority=-2
[State 200, hit]
type=HitDef
trigger1=Time=0
damage=0
p2stateno=700
[Statedef 700]
type=S
movetype=H
physics=N
anim=0
sprpriority=4
[State 700, actor-owned controller]
type=SprPriority
trigger1=Time=0
value=-3
[State 700, return]
type=SelfState
trigger1=Time=1
value=0`,motionIdle,"","","[Info]\nlocalcoord=640,480","");
try {
  api.ktCoreSetup(borrowedPriority,0,0,5*256,0);api.ktCoreDebugForceState(borrowedPriority,0,200);
  api.ktCoreAdvance(borrowedPriority,0,"",0,"");assert.equal(JSON.parse(api.ktCoreSnapshot(borrowedPriority,1)).spritePriority,4);
  api.ktCoreAdvance(borrowedPriority,0,"",0,"");const borrowed=JSON.parse(api.ktCoreSnapshot(borrowedPriority,1));
  assert.equal(borrowed.stateOwner,1);assert.equal(borrowed.spritePriority,-3);assert.equal(borrowed.localCoordWidth,640);
  assert.equal(JSON.parse(api.ktCoreSnapshot(borrowedPriority,0)).spritePriority,-2);
  api.ktCoreAdvance(borrowedPriority,0,"",0,"");const own=JSON.parse(api.ktCoreSnapshot(borrowedPriority,1));
  assert.equal(own.stateOwner,2);assert.equal(own.spritePriority,-3);assert.equal(own.localCoordWidth,320);
  assert.equal(api.ktCoreIssues(borrowedPriority),"");
} finally { api.ktCoreRelease(borrowedPriority); }
console.log("Native Wasm SprPriority and StateDef persistence / actor-owned borrowed banks / mixed helper-projectile-Explod painter order / projectile draw priority bounds / onTop / stable ties / pure reads: OK (synthetic)");

// Full affine transforms must come from compiled Kotlin, including AIR flips
// and offsets. Size and localcoord are intentionally independent of draw scale.
const angleScaleCases=[{x:1,y:1,flip:""},{x:2,y:.5,flip:"H"},
  {x:-1,y:1,flip:"V"},{x:0,y:-2,flip:"HV"}];
for(const width of [320,640])for(const facing of [false,true])
for(const initialAngle of [15,75])for(const scale of angleScaleCases) {
  const angleAir=`${air}\n[Begin Action 100]\n0,0,8,-4,-1,${scale.flip}`;
  const drawing=api.ktCoreCreateWithDefinitions("angle transforms","target",angleAir,air,
    `[Size]
xscale=2
yscale=.5
${motionIdle.replace("anim=0","anim=100")}
[State 0, set angle]
type=AngleSet
trigger1=Time=0
value=${initialAngle}
[State 0, add angle]
type=AngleAdd
trigger1=Time=0
value=max(30,15)
[State 0, multiply angle]
type=AngleMul
trigger1=Time=0
value=2
[State 0, draw angle]
type=AngleDraw
trigger1=Time<2
scale=ifelse(1,${scale.x},1),min(${scale.y},2)`,motionIdle,"","",
    `[Info]\nlocalcoord=${width},${width*3/4}`,"");
  try {
    api.ktCoreSetup(drawing,0,0,100*256,0);api.ktCoreDebugSetFacing(drawing,0,facing);
    for(let tick=0;tick<3;tick++) {
      api.ktCoreAdvance(drawing,0,"",0,"");
      const actor=JSON.parse(api.ktCoreSnapshot(drawing,0));
      const angle=(initialAngle+30)*2,enabled=tick<2,face=facing?1:-1;
      assert.equal(actor.drawAngleDegrees,angle);assert.equal(actor.angleDraw,enabled);
      assert.equal(actor.drawScaleX,enabled?scale.x:1);assert.equal(actor.drawScaleY,enabled?scale.y:1);
      assert.equal(actor.x256,0);assert.equal(actor.y256,0);assert.equal(actor.life,1000);assert.equal(actor.power,0);
      const before=api.ktCoreChecksum(drawing),plan=JSON.parse(api.ktCoreRenderPlan(drawing,0));
      const draw=plan.draws.find(d=>d.kind==="fighter"&&d.side===0);
      const rotation=enabled?angle*face:0,radians=rotation*Math.PI/180,c=Math.cos(radians),s=Math.sin(radians);
      const sx=320/width*2*(enabled?scale.x:1),sy=320/width*.5*(enabled?scale.y:1);
      const hx=scale.flip.includes("H")?-1:1,vy=scale.flip.includes("V")?-1:1;
      const expected={transformA:c*sx*1.4*face*hx,transformB:-s*sx*1.1*face*hx,
        transformC:s*sy*1.4*vy,transformD:c*sy*1.1*vy,
        x:480+(c*8*sx*face+s*(-4)*sy)*1.4,
        y:435+(-s*8*sx*face+c*(-4)*sy)*1.1};
      assert.equal(draw.rotationDegrees,rotation||0);assert.equal(draw.angleDraw,enabled);
      for(const [field,value]of Object.entries(expected))
        assert.ok(Math.abs(draw[field]-value)<1e-8,`${field}: ${draw[field]} != ${value}`);
      for(let i=0;i<3;i++)api.ktCoreRenderPlan(drawing,12);
      assert.equal(api.ktCoreChecksum(drawing),before);
      assert.deepEqual(JSON.parse(api.ktCoreSnapshot(drawing,0)),actor);
    }
    assert.equal(api.ktCoreIssues(drawing),"");
  } finally { api.ktCoreRelease(drawing); }
}
for(const ignore of [0,1]) {
  const pausedAngle=api.ktCoreCreate("paused drawing","attacker",air,projectileFacingAir,
    `${motionIdle}
[State 0, initial draw]
type=AngleDraw
trigger1=1
value=30
scale=2,.5
[Statedef 5000]
type=S
movetype=H
physics=N
anim=0
[State 5000, add during pause]
type=AngleAdd
trigger1=1
ignorehitpause=${ignore}
value=15
[State 5000, draw during pause]
type=AngleDraw
trigger1=1
ignorehitpause=${ignore}`,`${motionIdle}
[Statedef 200]
type=S
movetype=A
physics=N
anim=200
[State 200, pause defender]
type=HitDef
trigger1=Time=0
damage=0
getpower=0,0
givepower=0,0
ground.velocity=0,0
pausetime=0,2`);
  try {
    api.ktCoreSetup(pausedAngle,0,0,-5*256,0);api.ktCoreDebugSetFacing(pausedAngle,1,true);
    api.ktCoreDebugForceState(pausedAngle,1,200);api.ktCoreAdvance(pausedAngle,0,"",0,"");
    for(let tick=1;tick<=3;tick++) {
      api.ktCoreAdvance(pausedAngle,0,"",0,"");const actor=JSON.parse(api.ktCoreSnapshot(pausedAngle,0));
      assert.equal(actor.drawAngleDegrees,30+15*(ignore?tick:Math.max(0,tick-2)));
      assert.equal(actor.angleDraw,ignore===1||tick===3);
      assert.equal(actor.drawScaleX,1);assert.equal(actor.drawScaleY,1);
      assert.equal(actor.stateTime,Math.max(0,tick-2));assert.equal(actor.hitPauseThisTick,tick<=2);
    }
    assert.equal(api.ktCoreIssues(pausedAngle),"");
  } finally { api.ktCoreRelease(pausedAngle); }
}
const helperAngle=api.ktCoreCreate("independent helper angle","target",air,air,`${motionIdle}
[State 0, root draw]
type=AngleDraw
trigger1=1
value=30
scale=2,2
[State 0, helper]
type=Helper
trigger1=Time=0
stateno=700
[Statedef 700]
type=S
physics=N
anim=0
[State 700, helper draw]
type=AngleDraw
trigger1=1
value=-45
scale=.5,1`,motionIdle);
try {
  for(let i=0;i<2;i++)api.ktCoreAdvance(helperAngle,0,"",0,"");
  const draws=JSON.parse(api.ktCoreRenderPlan(helperAngle,0)).draws;
  const root=draws.find(d=>d.kind==="fighter"&&d.side===0),helper=draws.find(d=>d.kind==="helper");
  assert.equal(root.rotationDegrees,30);assert.equal(root.spriteScaleX,2);
  assert.equal(helper.rotationDegrees,-45);assert.equal(helper.spriteScaleX,.5);
  assert.equal(api.ktCoreIssues(helperAngle),"");
} finally { api.ktCoreRelease(helperAngle); }
const borrowedAngle=api.ktCoreCreateWithDefinitions("angle bank","executing actor",projectileFacingAir,air,
  `${motionIdle}
[Statedef 200]
type=S
physics=N
anim=200
[State 200, bank variable]
type=VarSet
trigger1=1
v=0
value=60
[State 200, transfer]
type=HitDef
trigger1=Time=0
damage=0
p2stateno=700
[Statedef 700]
type=S
movetype=H
physics=N
anim=0
[State 700, actor angle]
type=AngleDraw
trigger1=Time=0
value=var(0)+10
scale=2,.5
[State 700, release]
type=SelfState
trigger1=Time=1
value=0`,`${motionIdle}
[State 0, own variable]
type=VarSet
trigger1=1
v=0
value=35`,"","","[Info]\nlocalcoord=640,480","");
try {
  api.ktCoreSetup(borrowedAngle,0,0,5*256,0);api.ktCoreDebugForceState(borrowedAngle,0,200);
  api.ktCoreAdvance(borrowedAngle,0,"",0,"");api.ktCoreAdvance(borrowedAngle,0,"",0,"");
  const borrowed=JSON.parse(api.ktCoreSnapshot(borrowedAngle,1));
  assert.equal(borrowed.stateOwner,1);assert.equal(borrowed.localCoordWidth,640);
  assert.equal(borrowed.drawAngleDegrees,45);assert.equal(borrowed.angleDraw,true);assert.equal(borrowed.drawScaleX,2);
  assert.equal(JSON.parse(api.ktCoreSnapshot(borrowedAngle,0)).drawAngleDegrees,0);
  api.ktCoreAdvance(borrowedAngle,0,"",0,"");const own=JSON.parse(api.ktCoreSnapshot(borrowedAngle,1));
  assert.equal(own.stateOwner,2);assert.equal(own.localCoordWidth,320);
  assert.equal(own.drawAngleDegrees,45);assert.equal(own.angleDraw,false);assert.equal(own.drawScaleX,1);
  assert.equal(api.ktCoreIssues(borrowedAngle),"");
} finally { api.ktCoreRelease(borrowedAngle); }
console.log("Native Wasm AngleSet/Add/Mul/Draw / 64 localcoord-facing-scale-flip-offset transforms / per-tick expiry / hitpause / independent helpers / actor-owned borrowed banks / pure reads: OK (synthetic)");

const bodyWidthCases=[{front:0,back:0},{front:20,back:-5},{front:-100,back:-100},{front:10,back:5}];
for(const width of [320,640])for(const face of [false,true])
for(const push of [0,1])for(const offsets of bodyWidthCases) {
  const factor=width/320;
  const body=api.ktCoreCreateWithDefinitions("body-space actor","opponent",air,air,
    `[Size]\nground.front=${15*factor}\nground.back=${15*factor}\n${motionIdle}
[State 0, body widths]
type=Width
trigger1=Time<2
player=ifelse(1,${offsets.front*factor},0),min(${offsets.back*factor},100)
[State 0, push checking]
type=PlayerPush
trigger1=Time<2
value=${push}`,motionIdle,"","",`[Info]\nlocalcoord=${width},${width*3/4}`,"");
  try {
    api.ktCoreConfigureArena(body,-100,100,0,true,false);api.ktCoreDebugSetFacing(body,0,face);
    for(let tick=0;tick<3;tick++) {
      api.ktCoreSetup(body,-5*256,0,5*256,0);api.ktCoreAdvance(body,0,"",0,"");
      const a=JSON.parse(api.ktCoreSnapshot(body,0)),b=JSON.parse(api.ktCoreSnapshot(body,1));
      const enabled=tick<2?!!push:true,front=tick<2?offsets.front:0,back=tick<2?offsets.back:0;
      const distance=Math.max(0,15+(face?front:back))+15;
      const penetration=enabled?Math.max(0,distance-10)*256:0;
      assert.equal(a.playerPush,enabled);assert.equal(a.widthPlayerFront256,front*256||0);
      assert.equal(a.widthPlayerBack256,back*256||0);assert.equal(a.widthEdgeFront256,0);assert.equal(a.widthEdgeBack256,0);
      assert.equal(a.x256,-5*256-Math.floor(penetration/2));assert.equal(b.x256,5*256+Math.ceil(penetration/2));
      assert.equal(a.stateTime,tick+1);assert.equal(a.life,1000);assert.equal(b.life,1000);
      assert.equal(a.power,0);assert.equal(b.power,0);assert.deepEqual(JSON.parse(api.ktCoreContacts(body)),[]);
      const checksum=api.ktCoreChecksum(body);
      for(let i=0;i<3;i++)api.ktCoreRenderPlan(body,12);
      assert.equal(api.ktCoreChecksum(body),checksum);assert.deepEqual(JSON.parse(api.ktCoreSnapshot(body,0)),a);
    }
    assert.equal(api.ktCoreIssues(body),"");
  } finally { api.ktCoreRelease(body); }
}
for(const width of [320,640])for(const face of [false,true])for(const shorthand of [false,true]) {
  const f=width/320;
  const edge=api.ktCoreCreateWithDefinitions("edge-width actor","opponent",air,air,
    `${motionIdle}\n[State 0, edge widths]\ntype=Width\ntrigger1=1\n`+
    (shorthand?`value=${20*f},${5*f}`:`edge=${20*f},${5*f}`),motionIdle,"","",
    `[Info]\nlocalcoord=${width},${width*3/4}`,"");
  try {
    api.ktCoreConfigureArena(edge,-100,100,0,true,false);api.ktCoreDebugSetFacing(edge,0,face);
    for(const direction of [-1,1]) {
      api.ktCoreSetup(edge,direction*120*256,0,-direction*120*256,0);api.ktCoreAdvance(edge,0,"",0,"");
      const a=JSON.parse(api.ktCoreSnapshot(edge,0));
      const inset=(face===(direction>0))?20:5;
      assert.equal(a.x256,direction*(100-inset)*256);
      assert.equal(a.widthEdgeFront256,20*256);assert.equal(a.widthEdgeBack256,5*256);
      assert.equal(a.widthPlayerFront256,shorthand?20*256:0);
    }
    assert.equal(api.ktCoreIssues(edge),"");
  } finally { api.ktCoreRelease(edge); }
}
for(const ignore of [0,1]) {
  const pausedBody=api.ktCoreCreate("paused body assertions","attacker",air,projectileFacingAir,
    `${motionIdle}
[State 0, width before hit]
type=Width
trigger1=1
player=10,5
[State 0, overlap before hit]
type=PlayerPush
trigger1=1
value=0
[Statedef 5000]
type=S
movetype=H
physics=N
anim=0
[State 5000, replacement width]
type=Width
trigger1=Time=0
ignorehitpause=${ignore}
player=20,-5
[State 5000, replacement push]
type=PlayerPush
trigger1=Time=0
ignorehitpause=${ignore}
value=1`,`${motionIdle}
[Statedef 200]
type=S
movetype=A
physics=N
anim=200
[State 200, pause defender]
type=HitDef
trigger1=Time=0
damage=0
getpower=0,0
givepower=0,0
ground.velocity=0,0
pausetime=0,2`);
  try {
    api.ktCoreConfigureArena(pausedBody,-100,100,0,true,false);api.ktCoreSetup(pausedBody,0,0,-5*256,0);
    api.ktCoreDebugSetFacing(pausedBody,1,true);api.ktCoreDebugForceState(pausedBody,1,200);
    api.ktCoreAdvance(pausedBody,0,"",0,"");
    for(let tick=1;tick<=4;tick++) {
      api.ktCoreAdvance(pausedBody,0,"",0,"");const a=JSON.parse(api.ktCoreSnapshot(pausedBody,0));
      assert.equal(a.widthPlayerFront256,tick===4?0:(ignore||tick===3?20:10)*256);
      assert.equal(a.playerPush,ignore===1||tick>=3);assert.equal(a.hitPauseThisTick,tick<=2);
      assert.equal(a.stateTime,Math.max(0,tick-2));assert.equal(a.life,1000);assert.equal(a.power,0);
    }
    assert.equal(api.ktCoreIssues(pausedBody),"");
  } finally { api.ktCoreRelease(pausedBody); }
}
for(const enabled of [0,1])for(const frozen of [0,1]) {
  const helperBody=api.ktCoreCreate("helper body owner","opponent",air,air,`${motionIdle}
[State 0, helper]
type=Helper
trigger1=Time=0
stateno=700
pos=70,0
[Statedef 700]
type=S
physics=N
anim=0
[State 700, opt into push]
type=PlayerPush
trigger1=1
value=${enabled}
[State 700, helper width]
type=Width
trigger1=1
player=10,0
[State 700, helper hold]
type=PosFreeze
trigger1=1
value=${frozen}`,motionIdle);
  try {
    api.ktCoreConfigureArena(helperBody,-100,100,0,true,false);api.ktCoreSetup(helperBody,-70*256,0,5*256,0);
    for(let i=0;i<2;i++)api.ktCoreAdvance(helperBody,0,"",0,"");
    const a=JSON.parse(api.ktCoreSnapshot(helperBody,0)),b=JSON.parse(api.ktCoreSnapshot(helperBody,1));
    const plan=JSON.parse(api.ktCoreRenderPlan(helperBody,0)),h=plan.draws.find(d=>d.kind==="helper");
    const root=plan.draws.find(d=>d.kind==="fighter"&&d.side===0);
    const worldX=(h.x-root.x)/(1.4*plan.cameraZoom)+a.x256/256;
    assert.ok(Math.abs(worldX-(enabled?(frozen?0:-17.5):0))<1e-8);
    assert.equal(a.x256,-70*256);assert.equal(b.x256,(enabled?(frozen?40:22.5):5)*256);
    assert.equal(api.ktCoreIssues(helperBody),"");
  } finally { api.ktCoreRelease(helperBody); }
}
const borrowedWidth=api.ktCoreCreateWithDefinitions("width bank","own actor",projectileFacingAir,air,
  `[Size]\nground.front=80\n${motionIdle}
[Statedef 200]
type=S
physics=N
anim=200
[State 200, transfer]
type=HitDef
trigger1=Time=0
damage=0
p2stateno=700
[Statedef 700]
type=S
movetype=H
physics=N
anim=0
[State 700, actor width]
type=Width
trigger1=Time=0
player=var(0),0
edge=4,6
[State 700, actor push]
type=PlayerPush
trigger1=Time=0
value=0
[State 700, release]
type=SelfState
trigger1=Time=1
value=0`,`${motionIdle}
[State 0, own variable]
type=VarSet
trigger1=1
v=0
value=20`,"","","[Info]\nlocalcoord=640,480","");
try {
  api.ktCoreSetup(borrowedWidth,0,0,5*256,0);api.ktCoreDebugForceState(borrowedWidth,0,200);
  api.ktCoreAdvance(borrowedWidth,0,"",0,"");api.ktCoreAdvance(borrowedWidth,0,"",0,"");
  const actor=JSON.parse(api.ktCoreSnapshot(borrowedWidth,1));
  assert.equal(actor.stateOwner,1);assert.equal(actor.widthPlayerFront256,10*256);
  assert.equal(actor.widthEdgeFront256,2*256);assert.equal(actor.widthEdgeBack256,3*256);assert.equal(actor.playerPush,false);
  api.ktCoreAdvance(borrowedWidth,0,"",0,"");const own=JSON.parse(api.ktCoreSnapshot(borrowedWidth,1));
  assert.equal(own.stateOwner,2);assert.equal(own.widthPlayerFront256,0);assert.equal(own.playerPush,true);
  assert.equal(api.ktCoreIssues(borrowedWidth),"");
} finally { api.ktCoreRelease(borrowedWidth); }
console.log("Native Wasm PlayerPush/Width / 32 localcoord-facing-width-push combinations / 8 edge-inset sequences / hitpause retention / helper opt-in and anchors / borrowed banks / active-tick expiry / pure reads: OK (synthetic)");

const displayProfiles=[{x:0,y:0},{x:7.25,y:-3.5},{x:-12.5,y:6.25}];
for(const width of [320,640,1008])for(const face of [false,true])
for(const angle of [0,90])for(const offset of displayProfiles) {
  const factor=width/320,sign=face?1:-1;
  const offsetAir=`${air}\n[Begin Action 100]\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,8,-4,-1,HV`;
  const display=api.ktCoreCreateWithDefinitions("display translation","opponent",offsetAir,air,
    `[Size]\ndraw.offset=${20*factor},${-10*factor}\nxscale=1.5\nyscale=.5\n`+
    `${motionIdle.replace("anim=0","anim=100")}
[State 0, display translation]
type=Offset
trigger1=Time<2
x=ifelse(1,${offset.x*factor},0)
y=${offset.y*factor}
[State 0, sparse replacement]
type=Offset
trigger1=Time=1
y=${2.25*factor}
[State 0, empty assertion]
type=Offset
trigger1=1
[State 0, rotate independently]
type=AngleDraw
trigger1=1
value=${angle}
scale=2,-.5
[State 0, attached display effect]
type=Explod
trigger1=Time=0
id=991
anim=0
postype=p1
pos=${2*factor},${3*factor}
bindtime=-1
removetime=-1`,motionIdle,"","",`[Info]\nlocalcoord=${width},${width*3/4}`,"");
  try {
    api.ktCoreSetup(display,0,0,100*256,0);api.ktCoreDebugSetFacing(display,0,face);
    for(let tick=0;tick<3;tick++) {
      api.ktCoreAdvance(display,0,"",0,"");const actor=JSON.parse(api.ktCoreSnapshot(display,0));
      const dx=tick<2?offset.x:0,dy=tick===0?offset.y:tick===1?2.25:0;
      assert.equal(actor.drawOffsetX256,dx*256||0);assert.equal(actor.drawOffsetY256,dy*256||0);
      assert.equal(actor.displayOffsetX256,(20*sign+dx)*256);assert.equal(actor.displayOffsetY256,(-10+dy)*256);
      assert.equal(actor.x256,0);assert.equal(actor.y256,0);assert.equal(actor.vx256,0);assert.equal(actor.vy256,0);
      assert.equal(actor.life,1000);assert.equal(actor.power,0);assert.equal(actor.stateTime,tick+1);
      const plan=JSON.parse(api.ktCoreRenderPlan(display,0)),d=plan.draws.find(d=>d.kind==="fighter"&&d.side===0);
      const radians=angle*sign*Math.PI/180,c=Math.cos(radians),s=Math.sin(radians);
      const sx=320/width*3,sy=320/width*(-.25),fx=8*sx*sign,fy=-4*sy;
      const x=480+(20*sign+dx+c*fx+s*fy)*1.4,y=435+(-10+dy-s*fx+c*fy)*1.1;
      assert.ok(Math.abs(d.x-x)<1e-8);assert.ok(Math.abs(d.y-y)<1e-8);
      assert.equal(d.axisX,480);assert.equal(d.axisY,435);assert.equal(d.displayOffsetX256,actor.displayOffsetX256);
      const effect=JSON.parse(api.ktCoreExplods(display)).find(e=>e.id===991);
      assert.equal(effect.x256,actor.displayOffsetX256+2*sign*256);assert.equal(effect.y256,actor.displayOffsetY256+3*256);
      assert.equal(plan.draws.find(d=>d.kind==="explod").displayOffsetX256,0);
      const checksum=api.ktCoreChecksum(display);for(let i=0;i<3;i++)api.ktCoreRenderPlan(display,12);
      assert.equal(api.ktCoreChecksum(display),checksum);assert.deepEqual(JSON.parse(api.ktCoreSnapshot(display,0)),actor);
    }
    assert.equal(api.ktCoreIssues(display),"");
  } finally { api.ktCoreRelease(display); }
}
function translatedContactAir(width) {
  const f=width/320;
  return `[Begin Action 0]\nClsn2Default:1\nClsn2[0]=${-10*f},${-40*f},${10*f},0\n0,0,0,0,-1\n`+
    `[Begin Action 200]\nClsn1Default:1\nClsn1[0]=0,${-40*f},${20*f},0\n0,0,0,0,-1`;
}
for(const kind of ["body","size","helper","victim","projectile"])for(const width of [320,640])for(const face of [false,true]) {
  const f=width/320,sign=face?1:-1;
  const hit=`[State 200, hit]\ntype=HitDef\ntrigger1=Time=0\ndamage=10\nground.velocity=0,0\ngetpower=0,0\ngivepower=0,0`;
  const translated=`[State 200, translate]\ntype=Offset\ntrigger1=1\nx=${20*f*sign}`;
  const source=kind==="projectile" ? `${motionIdle}
[State 0, owner display only]
type=Offset
trigger1=1
x=${100*f*sign}
[State 0, shot]
type=Projectile
trigger1=Time=0
projanim=200
damage=10
ground.velocity=0,0
velocity=0,0
getpower=0,0
givepower=0,0` : `${kind==="size"?`[Size]\ndraw.offset=${20*f},0\n`:""}${motionIdle}`+
    (kind==="helper"?`\n[State 0, independent root display]\ntype=Offset\ntrigger1=1\nx=${100*f*sign}\n`+
      "[State 0, helper]\ntype=Helper\ntrigger1=Time=0\nstateno=200":"")+
    `\n[Statedef 200]\ntype=S\nmovetype=A\nphysics=N\nanim=200\n`+
    (["body","helper"].includes(kind)?translated+"\n":"")+hit;
  const victim=motionIdle+(["victim","projectile"].includes(kind)?
    `\n[State 0, translated hurtbox]\ntype=Offset\ntrigger1=1\nx=${-20*sign}`:"");
  const contact=api.ktCoreCreateWithDefinitions("translated attack","translated target",translatedContactAir(width),translatedContactAir(320),
    source,victim,"","",`[Info]\nlocalcoord=${width},${width*3/4}`,"");
  try {
    api.ktCoreSetup(contact,0,0,30*sign*256,0);api.ktCoreDebugSetFacing(contact,0,face);
    if(!["helper","projectile"].includes(kind))api.ktCoreDebugForceState(contact,0,200);
    let count=0;for(let tick=0;tick<2;tick++) { api.ktCoreAdvance(contact,0,"",0,"");count+=JSON.parse(api.ktCoreContacts(contact)).length; }
    const a=JSON.parse(api.ktCoreSnapshot(contact,0)),b=JSON.parse(api.ktCoreSnapshot(contact,1));
    assert.equal(count,1,kind);assert.equal(b.life,990,kind);assert.equal(a.x256,0);assert.equal(b.x256,30*sign*256);
    assert.equal(a.power,0);assert.equal(b.power,0);assert.equal(api.ktCoreIssues(contact),"");
  } finally { api.ktCoreRelease(contact); }
}
for(const ignore of [0,1]) {
  const pausedDisplay=api.ktCoreCreate("paused display","attacker",air,projectileFacingAir,
    `[Size]\ndraw.offset=4,-3\n${motionIdle}
[State 0, display before hit]
type=Offset
trigger1=1
x=30
y=10
[Statedef 5000]
type=S
movetype=H
physics=N
anim=0
[State 5000, opted in display]
type=Offset
trigger1=1
ignorehitpause=${ignore}
x=15
y=2`,`${motionIdle}
[Statedef 200]
type=S
movetype=A
physics=N
anim=200
[State 200, pause defender]
type=HitDef
trigger1=Time=0
damage=0
getpower=0,0
givepower=0,0
ground.velocity=0,0
pausetime=0,2`);
  try {
    api.ktCoreSetup(pausedDisplay,0,0,20*256,0);api.ktCoreDebugSetFacing(pausedDisplay,1,true);
    api.ktCoreDebugForceState(pausedDisplay,1,200);api.ktCoreAdvance(pausedDisplay,0,"",0,"");
    assert.equal(JSON.parse(api.ktCoreSnapshot(pausedDisplay,0)).state,5000);
    for(let tick=1;tick<=3;tick++) {
      api.ktCoreAdvance(pausedDisplay,0,"",0,"");const actor=JSON.parse(api.ktCoreSnapshot(pausedDisplay,0));
      const active=ignore===1||tick===3;
      assert.equal(actor.drawOffsetX256,active?15*256:0);assert.equal(actor.drawOffsetY256,active?2*256:0);
      assert.equal(actor.displayOffsetX256,(active?19:4)*256);assert.equal(actor.displayOffsetY256,(active?-1:-3)*256);
      assert.equal(actor.x256,0);assert.equal(actor.y256,0);assert.equal(actor.stateTime,Math.max(0,tick-2));
      assert.equal(actor.hitPauseThisTick,tick<=2);
    }
    assert.equal(api.ktCoreIssues(pausedDisplay),"");
  } finally { api.ktCoreRelease(pausedDisplay); }
}
const displayBankAir=`${translatedContactAir(640)}\n[Begin Action 100]\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,8,-4,-1`;
const borrowedDisplay=api.ktCoreCreateWithDefinitions("display bank","own display metadata",displayBankAir,translatedContactAir(320),
  `[Size]\ndraw.offset=80,0\n${motionIdle}
[Statedef 200]
type=S
physics=N
anim=200
[State 200, transfer]
type=HitDef
trigger1=Time=0
damage=0
p2stateno=700
[Statedef 700]
type=S
movetype=H
physics=N
anim=0
[State 700, actor display]
type=Offset
trigger1=Time=0
x=var(0)
y=10
[State 700, bank animation]
type=ChangeAnim2
trigger1=Time=0
value=100
[State 700, return]
type=SelfState
trigger1=Time=1
value=0`,`[Size]\ndraw.offset=4,-3\n${motionIdle}
[State 0, own variable]
type=VarSet
trigger1=1
v=0
value=20`,"","","[Info]\nlocalcoord=640,480","");
try {
  api.ktCoreSetup(borrowedDisplay,-40*256,0,5*256,0);api.ktCoreDebugSetFacing(borrowedDisplay,1,true);
  api.ktCoreDebugForceState(borrowedDisplay,0,200);api.ktCoreAdvance(borrowedDisplay,0,"",0,"");
  api.ktCoreAdvance(borrowedDisplay,0,"",0,"");const bank=JSON.parse(api.ktCoreSnapshot(borrowedDisplay,1));
  assert.equal(bank.stateOwner,1);assert.equal(bank.animationOwner,1);assert.equal(bank.drawOffsetX256,10*256);
  assert.equal(bank.displayOffsetX256,14*256);assert.equal(bank.displayOffsetY256,2*256);
  const d=JSON.parse(api.ktCoreRenderPlan(borrowedDisplay,0)).draws.find(d=>d.kind==="fighter"&&d.side===1);
  assert.ok(Math.abs(d.x-512.2)<1e-8);assert.equal(d.y,435);
  api.ktCoreAdvance(borrowedDisplay,0,"",0,"");const own=JSON.parse(api.ktCoreSnapshot(borrowedDisplay,1));
  assert.equal(own.stateOwner,2);assert.equal(own.animationOwner,2);assert.equal(own.drawOffsetX256,0);
  assert.equal(own.displayOffsetX256,4*256);assert.equal(own.displayOffsetY256,-3*256);
  assert.equal(api.ktCoreIssues(borrowedDisplay),"");
} finally { api.ktCoreRelease(borrowedDisplay); }
console.log("Native Wasm Offset / 36 coordinate-facing-angle-offset combinations / attached Explods / 20 translated body-helper-projectile contacts / hitpause / independent metadata and borrowed animation banks / expiry / pure reads: OK (synthetic)");

// Guard proximity is a controller-phase latch with strict directional bounds.
for(const width of [320,640,1008])for(const side of [0,1])for(const range of [0,100,101,160]) {
  const f=width/320;
  const source=`[Size]\nattack.dist=${160*f}\n${motionIdle}
[Statedef 200]
type=S
movetype=A
physics=N
anim=0
[State 200, range]
type=AttackDist
trigger1=Time=0
value=ifelse(1,${range*f},0)`;
  const observer=`${motionIdle}
[State 0, observed proximity]
type=VarSet
trigger1=1
v=0
value=InGuardDist
[State 0, show controller read]
type=ChangeAnim
trigger1=1
value=ifelse(var(0),1,0)`;
  const observeAir=`${air}\n[Begin Action 1]\n0,1,0,0,-1`;
  const guard=api.ktCoreCreateWithDefinitions("guard left","guard right",observeAir,observeAir,
    side===0?source:observer,side===1?source:observer,"","",
    side===0?`[Info]\nlocalcoord=${width},${width*3/4}`:"",
    side===1?`[Info]\nlocalcoord=${width},${width*3/4}`:"");
  try {
    api.ktCoreSetup(guard,0,0,100*256,0);api.ktCoreDebugForceState(guard,side,200);
    api.ktCoreAdvance(guard,0,"",0,"");let target=JSON.parse(api.ktCoreSnapshot(guard,1-side));
    assert.equal(target.inGuardDist,range>100);assert.equal(target.anim,0);
    assert.equal(JSON.parse(api.ktCoreSnapshot(guard,side)).guardDistance256,Math.trunc(Math.trunc(range*f)*81920/width));
    api.ktCoreAdvance(guard,0,"",0,"");target=JSON.parse(api.ktCoreSnapshot(guard,1-side));
    assert.equal(target.anim,range>100?1:0);assert.equal(target.life,1000);assert.equal(target.power,0);
    api.ktCoreDebugForceState(guard,side,0);api.ktCoreAdvance(guard,0,"",0,"");
    assert.equal(JSON.parse(api.ktCoreSnapshot(guard,1-side)).inGuardDist,false);
    assert.equal(JSON.parse(api.ktCoreSnapshot(guard,1-side)).anim,range>100?1:0);
    api.ktCoreAdvance(guard,0,"",0,"");assert.equal(JSON.parse(api.ktCoreSnapshot(guard,1-side)).anim,0);
    const before=api.ktCoreSnapshot(guard,1-side);for(let i=0;i<3;i++)api.ktCoreRenderPlan(guard,12);
    assert.equal(api.ktCoreSnapshot(guard,1-side),before);assert.equal(api.ktCoreIssues(guard),"");
  } finally {api.ktCoreRelease(guard);}
}
for(const width of [320,640])for(const kind of ["helper","projectile"])for(const range of [100,101]) {
  const f=width/320;
  const source=`[Size]\nattack.dist=${range*f}\nproj.attack.dist=${range*f}\n${motionIdle}
[State 0, entity]
type=${kind==="helper"?"Helper":"Projectile"}
trigger1=Time=0
${kind==="helper"?"stateno=200":"projanim=0\nvelocity=0,0\nprojremovetime=-1"}
[Statedef 200]
type=S
movetype=A
physics=N
anim=0`;
  const guard=api.ktCoreCreateWithDefinitions("entity threat","defender",air,air,source,motionIdle,"","",
    `[Info]\nlocalcoord=${width},${width*3/4}`,"");
  try {
    api.ktCoreSetup(guard,0,0,100*256,0);api.ktCoreAdvance(guard,0,"",0,"");api.ktCoreAdvance(guard,0,"",0,"");
    const defender=JSON.parse(api.ktCoreSnapshot(guard,1));assert.equal(defender.inGuardDist,range>100);
    assert.equal(defender.life,1000);assert.equal(JSON.parse(api.ktCoreSnapshot(guard,0)).inGuardDist,false);
    if(kind==="projectile")assert.equal(JSON.parse(api.ktCoreProjectiles(guard))[0].guardDistance256,range*256);
    assert.equal(api.ktCoreIssues(guard),"");
  } finally {api.ktCoreRelease(guard);}
}
const guardBank=api.ktCoreCreateWithDefinitions("guard bank","own metadata",projectileFacingAir,air,
  `${motionIdle}
[Statedef 200]
type=S
movetype=A
physics=N
anim=200
[State 200, borrow]
type=HitDef
trigger1=Time=0
damage=0
p2stateno=700
[Statedef 700]
type=S
movetype=A
physics=N
anim=0
[State 700, range]
type=AttackDist
trigger1=Time=0
value=var(0)
[State 700, return]
type=SelfState
trigger1=Time=1
value=0`,`[Size]\nattack.dist=80\n${motionIdle}
[State 0, own variable]
type=VarSet
trigger1=1
v=0
value=202`,"","","[Info]\nlocalcoord=640,480","");
try {
  api.ktCoreSetup(guardBank,0,0,4*256,0);api.ktCoreDebugForceState(guardBank,0,200);
  api.ktCoreAdvance(guardBank,0,"",0,"");api.ktCoreAdvance(guardBank,0,"",0,"");
  const borrowed=JSON.parse(api.ktCoreSnapshot(guardBank,1));assert.equal(borrowed.stateOwner,1);
  assert.equal(borrowed.guardDistance256,101*256);
  api.ktCoreAdvance(guardBank,0,"",0,"");const own=JSON.parse(api.ktCoreSnapshot(guardBank,1));
  assert.equal(own.stateOwner,2);assert.equal(own.guardDistance256,80*256);assert.equal(api.ktCoreIssues(guardBank),"");
} finally {api.ktCoreRelease(guardBank);}
console.log("Native Wasm AttackDist / 24 coordinate-side-range latch sequences / 8 helper-projectile range captures / previous controller reads / strict bounds / borrowed bank reset / pure reads: OK (synthetic)");

const mapsOf=handle=>JSON.parse(api.ktCoreNamedMaps(handle));
for(const width of [320,640,1008])for(const side of [0,1])for(const operation of ["MapSet","MapAdd"])
for(const seed of [-2.5,0,1.25]) {
  const source=`[Map]\nScore=${seed}\nconstant=max(2,3)*2\n${motionIdle}
[State 0, write]
type=${operation}
trigger1=Time<2
map="SCORE"
value=ifelse(Time=0,2.5,map(score)*.5)
[State 0, root controllers are not self writes]
type=RootMapSet
trigger1=1
map=score
value=999
[State 0, unusual literal key]
type=MapSet
trigger1=Time=0
map='quoted"key\\suffix'
value=-.1`;
  const other=`[Map]\nscore=7\n${motionIdle}`;
  const handle=api.ktCoreCreateWithDefinitions("maps left","maps right",air,air,side===0?source:other,side===1?source:other,
    "","",side===0?`[Info]\nlocalcoord=${width},${width*3/4}`:"",side===1?`[Info]\nlocalcoord=${width},${width*3/4}`:"");
  try {
    let expected=Math.fround(seed);
    for(let tick=0;tick<3;tick++) {
      api.ktCoreAdvance(handle,0,"",0,"");
      if(tick<2)expected=Math.fround((operation==="MapAdd"?expected:0)+(tick===0?2.5:expected*.5));
      const values=mapsOf(handle);assert.equal(values[side].values.score,expected);
      assert.equal(values[1-side].values.score,7);assert.equal(values[side].values.constant,6);
      assert.equal(values[side].values['quoted"key\\suffix'],Math.fround(-.1));
      const actor=JSON.parse(api.ktCoreSnapshot(handle,side));assert.equal(actor.namedMapCount,3);
      const snapshot=api.ktCoreNamedMaps(handle),checksum=api.ktCoreChecksum(handle);
      for(let i=0;i<3;i++)api.ktCoreRenderPlan(handle,12);
      assert.equal(api.ktCoreNamedMaps(handle),snapshot);assert.equal(api.ktCoreChecksum(handle),checksum);
    }
    assert.equal(api.ktCoreIssues(handle),"");
  } finally {api.ktCoreRelease(handle);}
}
for(const width of [320,640])for(const side of [0,1]) {
  const source=`[Map]\ncounter=1\nown=2\n${motionIdle}
[State 0, root local addition]
type=MapAdd
trigger1=1
map=counter
value=.25
[State 0, helper]
type=Helper
trigger1=Time=0
stateno=700
[Statedef 700]
type=S
physics=N
anim=0
[State 700, local state]
type=MapSet
trigger1=Time=0
map=own
value=3.25
[State 700, root set]
type=RootMapSet
trigger1=Time=0
map=counter
value=map(own)
[State 700, root add]
type=RootMapAdd
trigger1=1
map=counter
value=1.5
[State 700, nested helper]
type=Helper
trigger1=Time=0
stateno=800
[Statedef 800]
type=S
physics=N
anim=0
[State 800, topmost root add]
type=RootMapAdd
trigger1=1
map=counter
value=map(own)`;
  const handle=api.ktCoreCreateWithDefinitions("maps root","maps opponent",air,air,side===0?source:motionIdle,side===1?source:motionIdle,
    "","",side===0?`[Info]\nlocalcoord=${width},${width*3/4}`:"",side===1?`[Info]\nlocalcoord=${width},${width*3/4}`:"");
  try {
    for(const expected of [1.25,4.75,8.5,12.25]) {
      api.ktCoreAdvance(handle,0,"",0,"");const maps=mapsOf(handle);
      assert.equal(maps[side].values.counter,expected);assert.deepEqual(maps[1-side].values,{});
      for(const h of maps.slice(2))assert.equal(h.values.counter,1);
    }
    const maps=mapsOf(handle);assert.equal(maps.length,4);assert.equal(maps[2].values.own,3.25);assert.equal(maps[3].values.own,2);
    assert.equal(api.ktCoreIssues(handle),"");
  } finally {api.ktCoreRelease(handle);}
}
const borrowedMaps=api.ktCoreCreateWithDefinitions("map bank","executing store",projectileFacingAir,air,
  `[Map]\nscore=99\n${motionIdle}
[Statedef 200]
type=S
physics=N
anim=200
[State 200, transfer]
type=HitDef
trigger1=Time=0
damage=0
p2stateno=700
[Statedef 700]
type=S
movetype=H
physics=N
anim=0
[State 700, executing store]
type=MapSet
trigger1=Time=0
map=score
value=var(0)+map(score)
[State 700, add]
type=MapAdd
trigger1=Time=0
map=score
value=.5
[State 700, root is not bank owner]
type=RootMapSet
trigger1=1
map=score
value=999
[State 700, return]
type=SelfState
trigger1=Time=1
value=0`,`[Map]\nscore=2\n${motionIdle}
[State 0, own variable]
type=VarSet
trigger1=1
v=0
value=4`,"","","[Info]\nlocalcoord=640,480","");
try {
  api.ktCoreSetup(borrowedMaps,0,0,4*256,0);api.ktCoreDebugForceState(borrowedMaps,0,200);
  api.ktCoreAdvance(borrowedMaps,0,"",0,"");api.ktCoreAdvance(borrowedMaps,0,"",0,"");
  assert.equal(mapsOf(borrowedMaps)[1].values.score,6.5);assert.equal(mapsOf(borrowedMaps)[0].values.score,99);
  assert.equal(JSON.parse(api.ktCoreSnapshot(borrowedMaps,1)).stateOwner,1);
  api.ktCoreAdvance(borrowedMaps,0,"",0,"");assert.equal(mapsOf(borrowedMaps)[1].values.score,6.5);
  assert.equal(JSON.parse(api.ktCoreSnapshot(borrowedMaps,1)).stateOwner,2);assert.equal(api.ktCoreIssues(borrowedMaps),"");
} finally {api.ktCoreRelease(borrowedMaps);}
console.log("Native Wasm MapSet/MapAdd/RootMapSet/RootMapAdd / 36 coordinate-side-operation-default sequences / four nested-root sequences / float32 state / escaped JSON / borrowed banks and SelfState / pure reads: OK (synthetic)");

for(const width of [320,640,1008])for(const frequency of [60,90])for(const duration of [0,1,3])for(const explicit of [false,true]) {
  const f=width/320;
  const handle=api.ktCoreCreateWithDefinitions("shake","opponent",air,air,`${motionIdle}
[State 0, shake]
type=EnvShake
trigger1=Time=0
time=${duration}
freq=${frequency}
${explicit?`ampl=${-20*f}`:""}`,motionIdle,"","",`[Info]\nlocalcoord=${width},${width*3/4}`,"");
  try {
    api.ktCoreSetup(handle,0,0,100*256,0);
    for(let age=0;age<5;age++) {
      api.ktCoreAdvance(handle,0,"",0,"");const effect=JSON.parse(api.ktCoreEnvironment(handle));
      const active=age<duration,phase=frequency>=90?90:0,amplitude=explicit?-20:-4;
      const expected=active?-amplitude*Math.sin((phase+frequency*age)*Math.PI/180):0;
      assert.ok(Math.abs(effect.offsetY-expected)<1e-8);
      if(active) {assert.equal(effect.shake.age,age);assert.equal(effect.shake.remaining,duration-age);}
      else assert.equal(effect.shake,null);
      const actor=JSON.parse(api.ktCoreSnapshot(handle,0));assert.equal(actor.x256,0);assert.equal(actor.y256,0);
      assert.equal(actor.life,1000);assert.equal(actor.power,0);assert.equal(actor.stateTime,age+1);
      const plan=JSON.parse(api.ktCoreRenderPlan(handle,0));assert.ok(Math.abs(plan.stageOffsetY-expected*1.1)<1e-8);
      for(const draw of plan.draws)assert.ok(Math.abs(draw.axisY-435-expected*1.1)<1e-8);
      const before=api.ktCoreEnvironment(handle),checksum=api.ktCoreChecksum(handle);
      for(let i=0;i<3;i++)api.ktCoreRenderPlan(handle,12);
      assert.equal(api.ktCoreEnvironment(handle),before);assert.equal(api.ktCoreChecksum(handle),checksum);
    }
    assert.equal(api.ktCoreIssues(handle),"");
  } finally {api.ktCoreRelease(handle);}
}
for(const width of [320,640,1008])for(const under of [0,1])for(const duration of [-1,1,3]) {
  const handle=api.ktCoreCreateWithDefinitions("environment layers","opponent",air,air,`${motionIdle}
[State 0, color]
type=EnvColor
trigger1=Time=0
value=max(12,2),34,56
time=${duration}
under=${under}
[State 0, helper]
type=Helper
trigger1=Time=0
stateno=700
[State 0, projectile]
type=Projectile
trigger1=Time=0
projanim=0
projhits=0
velocity=0,0
projremovetime=-1
[State 0, ordinary effect]
type=Explod
trigger1=Time=0
id=1
anim=0
sprpriority=5
removetime=-1
[State 0, foreground effect]
type=Explod
trigger1=Time=0
id=2
anim=0
ontop=1
removetime=-1
[Statedef 700]
type=S
physics=N
anim=0`,motionIdle,"","",`[Info]\nlocalcoord=${width},${width*3/4}`,"");
  try {
    api.ktCoreSetup(handle,0,0,100*256,0);
    for(let age=0;age<5;age++) {
      api.ktCoreAdvance(handle,0,"",0,"");const plan=JSON.parse(api.ktCoreRenderPlan(handle,0));
      const active=duration<0||age<duration;
      if(active)assert.deepEqual(plan.environment.color,{red:12,green:34,blue:56,remaining:duration<0?-1:duration-age,under:!!under});
      else assert.equal(plan.environment.color,null);
      assert.equal(plan.draws.length,active&&!under?1:6);
      if(active&&!under) {assert.equal(plan.draws[0].kind,"explod");assert.equal(plan.draws[0].effectId,2);}
      assert.deepEqual(JSON.parse(api.ktCoreEntities(handle)),{helpers:1,projectiles:1});
      assert.equal(JSON.parse(api.ktCoreExplods(handle)).length,2);assert.deepEqual(plan.health,[376,376]);
      assert.equal(JSON.parse(api.ktCoreSnapshot(handle,0)).stateTime,age+1);
    }
    assert.equal(api.ktCoreIssues(handle),"");
  } finally {api.ktCoreRelease(handle);}
}
const environmentBank=api.ktCoreCreateWithDefinitions("environment bank","executing actor",projectileFacingAir,air,
  `${motionIdle}
[Statedef 200]
type=S
physics=N
anim=200
[State 200, transfer]
type=HitDef
trigger1=Time=0
damage=0
p2stateno=700
[Statedef 700]
type=S
movetype=H
physics=N
anim=0
[State 700, shake]
type=EnvShake
trigger1=Time=0
time=3
freq=0
phase=90
ampl=var(0)
[State 700, color]
type=EnvColor
trigger1=Time=0
value=12,34,56
time=2
under=1
[State 700, return]
type=SelfState
trigger1=Time=1
value=0`,`${motionIdle}
[State 0, own variable]
type=VarSet
trigger1=1
v=0
value=-8`,"","","[Info]\nlocalcoord=640,480","");
try {
  api.ktCoreSetup(environmentBank,0,0,4*256,0);api.ktCoreDebugForceState(environmentBank,0,200);
  api.ktCoreAdvance(environmentBank,0,"",0,"");api.ktCoreAdvance(environmentBank,0,"",0,"");
  const effect=JSON.parse(api.ktCoreEnvironment(environmentBank));assert.equal(effect.offsetY,4);
  assert.equal(effect.shake.amplitude256,-4*256);assert.equal(effect.color.remaining,2);
  api.ktCoreAdvance(environmentBank,0,"",0,"");assert.equal(JSON.parse(api.ktCoreSnapshot(environmentBank,1)).stateOwner,2);
  assert.equal(JSON.parse(api.ktCoreEnvironment(environmentBank)).offsetY,4);
  api.ktCoreAdvance(environmentBank,0,"",0,"");assert.equal(JSON.parse(api.ktCoreEnvironment(environmentBank)).color,null);
  api.ktCoreAdvance(environmentBank,0,"",0,"");assert.equal(JSON.parse(api.ktCoreEnvironment(environmentBank)).shake,null);
  assert.equal(api.ktCoreIssues(environmentBank),"");
} finally {api.ktCoreRelease(environmentBank);}
console.log("Native Wasm EnvShake/EnvColor / 36 coordinate-frequency-duration-amplitude sequences / 18 color layer sequences / OnTop visibility / independent physical state / borrowed bank and global lifetime / pure reads: OK (synthetic)");

// Impact capture and deferred consumption execute in the actual compiled module.
for(const width of [320,640,1008])for(const projectile of [false,true])for(const facing of [-1,1])for(const guarded of [false,true])for(const explicit of [false,true]) {
  const f=width/320,parameters=`damage=0\nguardflag=HL\nenvshake.time=5\nenvshake.freq=90\nfall.envshake.time=3\nfall.envshake.freq=0\nfall.envshake.phase=90\n${explicit?`envshake.ampl=${-20*f}\nfall.envshake.ampl=${-40*f}`:""}`;
  const attack=`${motionIdle}
[Statedef 200]
type=S
physics=N
anim=${projectile?0:200}
[State 200, captured shake]
type=${projectile?"Projectile":"HitDef"}
trigger1=Time=0
projanim=200
${parameters}`;
  const defense=`${motionIdle}
ctrl=1
[Statedef 5000]
type=S
movetype=H
physics=N
anim=0
[State 5000, capture query]
type=LifeSet
trigger1=Time=0
value=GetHitVar(fall.envshake.time)
[State 5000, consume]
type=FallEnvShake
trigger1=1`;
  const handle=api.ktCoreCreateWithDefinitions("captured shake","victim",translatedContactAir(width),air,attack,defense,"","",`[Info]\nlocalcoord=${width},${width*3/4}`,"");
  try {
    api.ktCoreSetup(handle,0,0,facing*4*256,0);api.ktCoreDebugSetFacing(handle,0,facing===1);
    api.ktCoreDebugSetFacing(handle,1,facing!==1);api.ktCoreDebugForceState(handle,0,200);
    const buttons=guarded?(facing===1?8:4):0;
    api.ktCoreAdvance(handle,0,"",buttons,"");
    if(projectile)api.ktCoreAdvance(handle,0,"",buttons,"");
    assert.equal(JSON.parse(api.ktCoreContacts(handle)).length,1);
    const victim=JSON.parse(api.ktCoreSnapshot(handle,1)),amplitude=explicit?-20:-4;
    assert.equal(victim.getHitGuarded,guarded);assert.equal(victim.getHitFallShakeTime,guarded?0:3);
    assert.equal(JSON.parse(api.ktCoreEnvironment(handle)).offsetY,-amplitude);
    if(!guarded) {
      api.ktCoreAdvance(handle,0,"",0,"");
      const consumed=JSON.parse(api.ktCoreSnapshot(handle,1));assert.equal(consumed.getHitFallShakeTime,0);
      assert.equal(consumed.life,3);assert.equal(consumed.getHitFallShakeAmplitude256,(explicit?-40:-4)*256);
      const effect=JSON.parse(api.ktCoreEnvironment(handle));assert.equal(effect.offsetY,explicit?40:4);
      assert.equal(effect.shake.age,0);assert.equal(effect.shake.remaining,3);
      const before=api.ktCoreEnvironment(handle),checksum=api.ktCoreChecksum(handle);
      for(let i=0;i<4;i++)api.ktCoreRenderPlan(handle,12);
      assert.equal(api.ktCoreEnvironment(handle),before);assert.equal(api.ktCoreChecksum(handle),checksum);
      for(let i=0;i<3;i++)api.ktCoreAdvance(handle,0,"",0,"");
      assert.equal(JSON.parse(api.ktCoreEnvironment(handle)).shake,null);
    }
    assert.equal(api.ktCoreIssues(handle),"");
  } finally {api.ktCoreRelease(handle);}
}
// Delayed authored consumption still uses canonical captured units after SelfState.
const fallShakeBank=api.ktCoreCreateWithDefinitions("fall shake bank","recipient",projectileFacingAir,air,
`${motionIdle}
[Statedef 200]
type=S
physics=N
anim=200
[State 200, transfer]
type=HitDef
trigger1=Time=0
p2stateno=700
fall.envshake.time=4
fall.envshake.freq=0
fall.envshake.phase=90
fall.envshake.ampl=-16
[Statedef 700]
type=S
movetype=H
physics=N
anim=0
[State 700, query borrowed units]
type=VarSet
trigger1=Time=0
v=0
value=GetHitVar(fall.envshake.ampl)
[State 700, return]
type=SelfState
trigger1=Time=0
value=0`,`${motionIdle}
[State 0, query own units]
type=VarSet
trigger1=GetHitVar(fall.envshake.time)>0
v=1
value=GetHitVar(fall.envshake.ampl)
[State 0, encode captured queries]
type=LifeSet
trigger1=GetHitVar(fall.envshake.time)>0
value=1000+var(0)*10+var(1)
[State 0, consume after return]
type=FallEnvShake
trigger1=GetHitVar(fall.envshake.time)>0`,"","","[Info]\nlocalcoord=640,480","");
try {
  api.ktCoreSetup(fallShakeBank,0,0,4*256,0);api.ktCoreDebugForceState(fallShakeBank,0,200);
  for(let i=0;i<3;i++)api.ktCoreAdvance(fallShakeBank,0,"",0,"");
  const victim=JSON.parse(api.ktCoreSnapshot(fallShakeBank,1));
  assert.equal(victim.stateOwner,2);assert.equal(victim.life,832);
  assert.equal(victim.getHitFallShakeTime,0);assert.equal(JSON.parse(api.ktCoreEnvironment(fallShakeBank)).offsetY,8);
  assert.equal(api.ktCoreIssues(fallShakeBank),"");
} finally {api.ktCoreRelease(fallShakeBank);}
console.log("Native Wasm HitDef/Projectile impact shake + FallEnvShake / 48 coordinate-source-facing-guard-default sequences / borrowed queries and SelfState consumption / pure reads: OK (synthetic)");

for(const width of [320,640,1008])for(const facing of [-1,1])for(const bounded of [false,true])for(const moveX of [false,true])for(const moveY of [false,true]) {
  const f=width/320;
  const script=`${motionIdle}
[State 0, place]
type=PosSet
trigger1=Time=0
x=${facing*3000*f}
y=${-1000*f}
[State 0, bounds and independent axes]
type=ScreenBound
trigger1=Time=0
value=${bounded?1:0}
movecamera=${moveX?1:0},${moveY?1:0}`;
  const handle=api.ktCoreCreateWithDefinitions("bounds","untracked opponent",air,air,script,`${motionIdle}
[State 0, exclude]
type=ScreenBound
trigger1=1`,"","",`[Info]\nlocalcoord=${width},${width*3/4}`,"");
  try {
    api.ktCoreConfigureArena(handle,-2000,2000,0,false,false);api.ktCoreSetup(handle,0,0,0,0);
    api.ktCoreDebugSetFacing(handle,0,facing===1);api.ktCoreAdvance(handle,0,"",0,"");
    const actor=JSON.parse(api.ktCoreSnapshot(handle,0)),plan=JSON.parse(api.ktCoreRenderPlan(handle,0));
    assert.equal(actor.screenBound,bounded);assert.equal(actor.moveCameraX,moveX);assert.equal(actor.moveCameraY,moveY);
    assert.equal(actor.x256,facing*(bounded?2000:3000)*256);assert.equal(actor.y256,-1000*256);
    assert.equal(plan.cameraX,moveX?facing*204:0);assert.equal(plan.cameraY,moveY?-45:0);assert.equal(plan.cameraZoom,1);
    const before=api.ktCoreChecksum(handle),snapshot=api.ktCoreSnapshot(handle,0);
    for(let i=0;i<3;i++)assert.deepEqual(JSON.parse(api.ktCoreRenderPlan(handle,0)),plan);
    assert.equal(api.ktCoreChecksum(handle),before);assert.equal(api.ktCoreSnapshot(handle,0),snapshot);
    api.ktCoreAdvance(handle,0,"",0,"");const expired=JSON.parse(api.ktCoreSnapshot(handle,0));
    assert.equal(expired.screenBound,true);assert.equal(expired.moveCameraX,true);assert.equal(expired.moveCameraY,true);
    assert.equal(expired.x256,facing*2000*256);assert.equal(api.ktCoreIssues(handle),"");
  } finally {api.ktCoreRelease(handle);}
}
for(const width of [320,640,1008]) {
  const f=width/320;
  const script=`${motionIdle}
[State 0, untracked root]
type=ScreenBound
trigger1=1
[State 0, helper]
type=Helper
trigger1=Time=0
stateno=700
pos=${2500*f},0
[Statedef 700]
type=S
physics=N
anim=200
velset=${10*f},0
[State 700, helper opt-in]
type=ScreenBound
trigger1=Time=0
value=1
movecamera=1,0`;
  const handle=api.ktCoreCreateWithDefinitions("helper camera","untracked root",projectileFacingAir,air,script,`${motionIdle}
[State 0, untracked]
type=ScreenBound
trigger1=1`,"","",`[Info]\nlocalcoord=${width},${width*3/4}`,"");
  try {
    api.ktCoreSetup(handle,0,0,100*256,0);api.ktCoreConfigureArena(handle,-2000,2000,0,false,false);
    api.ktCoreAdvance(handle,0,"",0,"");assert.equal(JSON.parse(api.ktCoreRenderPlan(handle,0)).cameraX,0);
    api.ktCoreAdvance(handle,0,"",0,"");const tracked=JSON.parse(api.ktCoreRenderPlan(handle,0));
    assert.equal(tracked.cameraX,204);assert.equal(tracked.cameraY,0);
    const helper=tracked.draws.find(d=>d.kind==="helper");assert.ok(helper);
    assert.ok(Math.abs((helper.axisX-480)/1.4+tracked.cameraX-2000)<1e-8);
    assert.equal(JSON.parse(api.ktCoreSnapshot(handle,0)).screenBound,false);
    api.ktCoreAdvance(handle,0,"",0,"");const expired=JSON.parse(api.ktCoreRenderPlan(handle,0));
    assert.equal(expired.cameraX,204);assert.equal(expired.cameraZoom,tracked.cameraZoom);
    assert.ok(Math.abs((expired.draws.find(d=>d.kind==="helper").axisX-480)/1.4+expired.cameraX-2010)<1e-8);
    assert.equal(api.ktCoreIssues(handle),"");
  } finally {api.ktCoreRelease(handle);}
}
console.log("Native Wasm ScreenBound / 48 coordinate-facing-bound-camera-axis sequences / three helper opt-in and expiry sequences / canonical edge clamps and frozen camera / pure reads: OK (synthetic)");

const assertedCommands=[['poke','a'],['held','/a'],['release','~a'],['motion','D,DF,F,a'],['held_c','/c'],['held_x','/x']]
  .map(([name,command])=>`[Command]\nname="${name}"\ncommand=${command}`).join('\n');
for(const width of [320,640,1008])for(const face of [false,true])for(const side of [0,1])for(const mode of ['press','hold','motion','mix']) {
  const requests=mode==='motion'?[['D','Time=0'],['D+F','Time=1'],['F+a','Time=2']]:
    [[mode==='mix'?'F':mode==='hold'?'F+a':'a',mode==='hold'?'Time<3':'Time=0']];
  const script=`${motionIdle}\n`+requests.map(([flag,trigger])=>`[State 0, assert]\ntype=AssertInput\ntrigger1=${trigger}\nflag=${flag}`).join('\n')+
    '\n'+['poke','held','release','motion'].map((name,index)=>`[State 0, count]\ntype=VarAdd\ntrigger1=command="${name}"\nv=${index}\nvalue=1`).join('\n')+
    '\n[State 0, encode command counts]\ntype=LifeSet\ntrigger1=1\nvalue=1000-var(0)*100-var(1)*10-var(2)-var(3)*400';
  const def=`[Info]\nlocalcoord=${width},${width*3/4}`;
  const handle=api.ktCoreCreateWithDefinitions('asserted first','asserted second',air,air,
    side===0?script:motionIdle,side===1?script:motionIdle,assertedCommands,assertedCommands,side===0?def:'',side===1?def:'');
  try {
    api.ktCoreSetup(handle,-100*256,0,100*256,0);api.ktCoreDebugSetFacing(handle,side,face);
    const forward=face?8:4;
    const samples=mode==='motion'?[[0,0,2,0],[2,0,2|forward,0],[2|forward,0,forward,1],[forward,1,0,0],[0,0,0,0],[0,0,0,0]]:
      mode==='hold'?[[0,0,forward,1],[forward,1,forward,1],[forward,1,forward,1],[forward,1,0,0],[0,0,0,0],[0,0,0,0]]:
      mode==='mix'?[[0,0,forward,0],[forward,1,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]:
      [[0,0,0,1],[0,1,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    for(let tick=0;tick<samples.length;tick++) {
      const physical=mode==='mix'&&tick===1?'a':'';
      api.ktCoreAdvance(handle,side===0?0:1,side===0?physical:'b',side===1?0:1,side===1?physical:'b');
      const inputs=JSON.parse(api.ktCoreInputs(handle)),current=inputs[side],other=inputs[1-side];
      assert.deepEqual([current.directions,current.buttons,current.pendingDirections,current.pendingButtons],samples[tick]);
      assert.equal(current.rootId,side+1);assert.equal(other.directions,1);assert.equal(other.buttons,2);assert.equal(other.pendingButtons,0);
      if(tick===0)assert.equal(JSON.parse(api.ktCoreSnapshot(handle,side)).life,1000);
      const before=api.ktCoreInputs(handle),checksum=api.ktCoreChecksum(handle);
      for(let i=0;i<3;i++){assert.equal(api.ktCoreInputs(handle),before);api.ktCoreRenderPlan(handle,12);}
      assert.equal(api.ktCoreChecksum(handle),checksum);
    }
    assert.equal(JSON.parse(api.ktCoreSnapshot(handle,side)).life,mode==='hold'?869:mode==='motion'?489:889);
    assert.equal(api.ktCoreIssues(handle),'');
  } finally {api.ktCoreRelease(handle);}
}
for(const width of [320,640,1008])for(const side of [0,1]) {
  const script=`${motionIdle}
[State 0, root assertion]
type=AssertInput
trigger1=1
flag=a
[State 0, non-keyctrl parent]
type=Helper
trigger1=Time=0
stateno=700
keyctrl=0
[Statedef 700]
type=S
physics=N
anim=0
[State 700, own assertion]
type=AssertInput
trigger1=1
flag=b
[State 700, nested keyctrl helper]
type=Helper
trigger1=Time=0
stateno=701
keyctrl=1
[Statedef 701]
type=S
physics=N
anim=0
[State 701, own assertion]
type=AssertInput
trigger1=1
flag=c
[State 701, root command definitions and isolated input]
type=LifeSet
trigger1=1
value=ifelse(command="held_c" && command="held_x" && command="held"=0,777,666)`;
  const def=`[Info]\nlocalcoord=${width},${width*3/4}`;
  const handle=api.ktCoreCreateWithDefinitions('input root','input rival',air,air,side===0?script:motionIdle,
    side===1?script:motionIdle,assertedCommands,assertedCommands,side===0?def:'',side===1?def:'');
  try {
    api.ktCoreSetup(handle,-100*256,0,100*256,0);
    for(let i=0;i<4;i++)api.ktCoreAdvance(handle,0,side===0?'x':'y',0,side===1?'x':'y');
    const inputs=JSON.parse(api.ktCoreInputs(handle));assert.equal(inputs.length,4);
    assert.equal(inputs[side].buttons,9);assert.equal(inputs[2].buttons,2);assert.equal(inputs[3].buttons,12);
    assert.equal(inputs[2].rootId,side+1);assert.equal(inputs[3].rootId,side+1);
    const plan=JSON.parse(api.ktCoreRenderPlan(handle,0));assert.equal(plan.draws.filter(d=>d.kind==='helper').at(-1).life,777);
    assert.equal(api.ktCoreIssues(handle),'');
  } finally {api.ktCoreRelease(handle);}
}
const assertedBank=api.ktCoreCreateWithDefinitions('assertion bank','own commands',projectileFacingAir,air,
`${motionIdle}
[Statedef 200]
type=S
physics=N
anim=200
[State 200, transfer]
type=HitDef
trigger1=Time=0
p2stateno=700
[Statedef 700]
type=S
physics=N
anim=0
[State 700, queue for executing actor]
type=AssertInput
trigger1=Time=0
flag=F+a
[State 700, return]
type=SelfState
trigger1=Time=0
value=0`,`${motionIdle}
[State 0, consume own command]
type=LifeSet
trigger1=command="own"
value=888`,"",'[Command]\nname="own"\ncommand=F+a','[Info]\nlocalcoord=1008,756','');
try {
  api.ktCoreSetup(assertedBank,0,0,4*256,0);api.ktCoreDebugForceState(assertedBank,0,200);
  for(let i=0;i<3;i++)api.ktCoreAdvance(assertedBank,0,'',0,'');
  assert.equal(JSON.parse(api.ktCoreSnapshot(assertedBank,1)).life,888);
  assert.equal(JSON.parse(api.ktCoreSnapshot(assertedBank,1)).stateOwner,2);
  assert.equal(JSON.parse(api.ktCoreInputs(assertedBank))[0].buttons,0);assert.equal(api.ktCoreIssues(assertedBank),'');
} finally {api.ktCoreRelease(assertedBank);}
console.log('Native Wasm AssertInput / 48 coordinate-facing-side-press-hold-motion-physical sequences / six nested-helper routing sequences / borrowed bank and SelfState / isolated queues and pure reads: OK (synthetic)');

const weightedAir=air.replace(/^(0,0,0,0,-1).*$/m,'$1,,AS32D192');
for(const width of [320,640,1008])for(const face of [false,true])for(const mode of ['default','none','add','addalpha','add1','sub'])for(const explicit of [false,true]) {
  const handle=api.ktCoreCreateWithDefinitions('sprite blend','opponent',weightedAir,air,`${motionIdle}
[State 0, blend]
type=Trans
trigger1=Time=0
trans=${mode}
${explicit?'alpha=128,64':''}`,motionIdle,'','',`[Info]\nlocalcoord=${width},${width*3/4}`,'');
  try {
    api.ktCoreSetup(handle,0,0,100*256,0);api.ktCoreDebugSetFacing(handle,0,face);api.ktCoreAdvance(handle,0,'',0,'');
    const inherited={mode:'add',source:32,destination:192};
    const expected=mode==='default'?inherited:mode==='none'?{mode:'normal',source:256,destination:0}:
      mode==='sub'?{mode:'sub',source:256,destination:256}:{mode:'add',source:explicit?128:256,
        destination:explicit?64:mode==='addalpha'?0:mode==='add1'?128:256};
    const snapshot=JSON.parse(api.ktCoreSnapshot(handle,0)),plan=JSON.parse(api.ktCoreRenderPlan(handle,0));
    assert.deepEqual(plan.draws[0].blend,expected);assert.deepEqual(snapshot.blendOverride,mode==='default'?null:expected);
    assert.equal(snapshot.x256,0);assert.equal(snapshot.y256,0);assert.equal(snapshot.life,1000);assert.equal(snapshot.power,0);
    const checksum=api.ktCoreChecksum(handle),before=api.ktCoreSnapshot(handle,0);
    for(let i=0;i<4;i++)assert.deepEqual(JSON.parse(api.ktCoreRenderPlan(handle,0)),plan);
    assert.equal(api.ktCoreChecksum(handle),checksum);assert.equal(api.ktCoreSnapshot(handle,0),before);
    api.ktCoreAdvance(handle,0,'',0,'');assert.equal(JSON.parse(api.ktCoreSnapshot(handle,0)).blendOverride,null);
    assert.deepEqual(JSON.parse(api.ktCoreRenderPlan(handle,0)).draws[0].blend,inherited);assert.equal(api.ktCoreIssues(handle),'');
  } finally {api.ktCoreRelease(handle);}
}
for(const [flag,expected] of [['',{mode:'normal',source:256,destination:0}],['A',{mode:'add',source:256,destination:256}],
  ['a1',{mode:'add',source:256,destination:128}],['s',{mode:'sub',source:256,destination:256}],
  ['AS000D256',{mode:'add',source:0,destination:256}],['AS128D064',{mode:'add',source:128,destination:64}]]) {
  const handle=api.ktCoreCreate('AIR blend','opponent',air.replace(/^(0,0,0,0,-1).*$/m,`$1,,${flag}`),air,motionIdle,motionIdle);
  try {assert.deepEqual(JSON.parse(api.ktCoreRenderPlan(handle,0)).draws[0].blend,expected);assert.equal(api.ktCoreIssues(handle),'');}
  finally {api.ktCoreRelease(handle);}
}
const blendEntitiesAir=projectileFacingAir.replace(/^(0,0,0,0,-1).*$/m,'$1,,S').replace(/^(200,0,0,0,-1).*$/m,'$1,,AS32D96');
const blendEntities=api.ktCoreCreate('isolated blends','opponent',blendEntitiesAir,air,`${motionIdle}
[State 0, root override]
type=Trans
trigger1=1
trans=none
[State 0, helper]
type=Helper
trigger1=Time=0
stateno=700
[State 0, projectile]
type=Projectile
trigger1=Time=0
projanim=200
projremovetime=20
[State 0, effect]
type=Explod
trigger1=Time=0
anim=200
removetime=-1
[Statedef 700]
type=S
physics=N
anim=0
[State 700, helper override]
type=Trans
trigger1=1
trans=addalpha
alpha=128,128`,motionIdle);
try {
  api.ktCoreSetup(blendEntities,0,0,100*256,0);for(let i=0;i<2;i++)api.ktCoreAdvance(blendEntities,0,'',0,'');
  const draws=JSON.parse(api.ktCoreRenderPlan(blendEntities,0)).draws;
  assert.deepEqual(draws.find(d=>d.kind==='fighter').blend,{mode:'normal',source:256,destination:0});
  assert.deepEqual(draws.find(d=>d.kind==='helper').blend,{mode:'add',source:128,destination:128});
  for(const kind of ['projectile','explod'])assert.deepEqual(draws.find(d=>d.kind===kind).blend,{mode:'add',source:32,destination:96});
  assert.equal(api.ktCoreIssues(blendEntities),'');
} finally {api.ktCoreRelease(blendEntities);}
console.log('Native Wasm Trans / 72 coordinate-facing-mode-alpha sequences / six AIR flag cases / independent helper-projectile-Explod blends / expiry and pure reads: OK (synthetic)');

const clipboardOracle=JSON.parse(readFileSync('test/fixtures/kotlin-clipboard-printf.json','utf8'));
for(const row of clipboardOracle.cases) {
  const handle=api.ktCoreCreate('printf oracle','opponent',air,air,`${motionIdle}
[State 0, format]
type=DisplayToClipboard
trigger1=Time=0
text="${row.format}"
params=${row.param}`,motionIdle);
  try {
    api.ktCoreAdvance(handle,0,'',0,'');const rows=JSON.parse(api.ktCoreClipboards(handle));
    assert.equal(rows[0].text,row.expected,JSON.stringify(row));assert.equal(rows[1].text,'');
    const before=api.ktCoreClipboards(handle),checksum=api.ktCoreChecksum(handle);
    for(let i=0;i<3;i++){assert.equal(api.ktCoreClipboards(handle),before);api.ktCoreRenderPlan(handle,12);}
    assert.equal(api.ktCoreChecksum(handle),checksum);api.ktCoreAdvance(handle,0,'',0,'');
    assert.equal(api.ktCoreClipboards(handle),before);assert.equal(api.ktCoreIssues(handle),'');
  } finally {api.ktCoreRelease(handle);}
}
for(const width of [320,640,1008])for(const side of [0,1]) {
  const source=`${motionIdle}
[State 0, integer]
type=VarSet
trigger1=Time=0
v=0
value=42
[State 0, float]
type=VarSet
trigger1=Time=0
fv=0
value=1.25
[State 0, display]
type=DisplayToClipboard
trigger1=Time=0
text="root=%d f=%.2f"
params=var(0),fvar(0)
[State 0, append escaped text]
type=AppendToClipboard
trigger1=Time=0
text="line\\t\\\"猫\\\";100%%"
[State 0, clear]
type=ClearClipboard
trigger1=Time=1
[State 0, append after clear]
type=AppendToClipboard
trigger1=Time=2
text="after"
[State 0, helper]
type=Helper
trigger1=Time=0
stateno=700
[Statedef 700]
type=S
physics=N
anim=0
[State 700, own clipboard]
type=DisplayToClipboard
trigger1=Time=0
text="helper=%d"
params=var(0)`;
  const other=`${motionIdle}\n[State 0, rival]\ntype=DisplayToClipboard\ntrigger1=Time=0\ntext="rival"`;
  const def=`[Info]\nlocalcoord=${width},${width*3/4}`;
  const handle=api.ktCoreCreateWithDefinitions('debug first','debug second',air,air,side===0?source:other,
    side===1?source:other,'','',side===0?def:'',side===1?def:'');
  try {
    api.ktCoreSetup(handle,-100*256,0,100*256,0);api.ktCoreAdvance(handle,0,'',0,'');
    let rows=JSON.parse(api.ktCoreClipboards(handle));
    assert.equal(rows[side].text,'root=42 f=1.25\nline    "猫";100%');assert.equal(rows[1-side].text,'rival');assert.equal(rows[2].text,'');
    api.ktCoreAdvance(handle,0,'',0,'');rows=JSON.parse(api.ktCoreClipboards(handle));
    assert.equal(rows[side].text,'');assert.equal(rows[2].text,'helper=0');assert.equal(rows[2].rootId,side+1);
    api.ktCoreAdvance(handle,0,'',0,'');rows=JSON.parse(api.ktCoreClipboards(handle));
    assert.equal(rows[side].text,'after');assert.equal(rows[2].text,'helper=0');assert.equal(api.ktCoreIssues(handle),'');
  } finally {api.ktCoreRelease(handle);}
}
const clipboardBank=api.ktCoreCreateWithDefinitions('debug bank','executing victim',projectileFacingAir,air,
`${motionIdle}
[Statedef 200]
type=S
physics=N
anim=200
[State 200, transfer]
type=HitDef
trigger1=Time=0
p2stateno=700
[Statedef 700]
type=S
physics=N
anim=0
[State 700, executing variables]
type=DisplayToClipboard
trigger1=Time=0
text="victim=%d state=%d"
params=var(0),StateNo
[State 700, return]
type=SelfState
trigger1=Time=1
value=0`,`${motionIdle}\n[State 0, own variable]\ntype=VarSet\ntrigger1=1\nv=0\nvalue=17`,
  '','','[Info]\nlocalcoord=640,480','');
try {
  api.ktCoreSetup(clipboardBank,0,0,4*256,0);api.ktCoreDebugForceState(clipboardBank,0,200);
  for(let i=0;i<4;i++)api.ktCoreAdvance(clipboardBank,0,'',0,'');
  const rows=JSON.parse(api.ktCoreClipboards(clipboardBank));assert.equal(rows[0].text,'');assert.equal(rows[1].text,'victim=17 state=700');
  assert.equal(JSON.parse(api.ktCoreSnapshot(clipboardBank,1)).stateOwner,2);assert.equal(api.ktCoreIssues(clipboardBank),'');
} finally {api.ktCoreRelease(clipboardBank);}
console.log('Native Wasm DisplayToClipboard/AppendToClipboard/ClearClipboard / 140 C printf numeric oracle cases / six coordinate-side actor-helper lifecycles / borrowed banks and SelfState / JSON escaping and pure reads: OK (synthetic; not native game parity)');

const paletteRgb=(source,fx)=>{
  const grey=(source[0]*299+source[1]*587+source[2]*114)/1000;
  return source.map((v,i)=>{
    const desaturated=v*fx.color/256+grey*(256-fx.color)/256;
    const inverted=fx.invert?255-desaturated:desaturated;
    return Math.max(0,Math.min(255,Math.floor((inverted+fx.add[i])*fx.mul[i]/256+1e-9)));
  });
};
for(const width of [320,640,1008])for(const side of [0,1])for(const type of ['PalFX','AllPalFX','BGPalFX'])for(const duration of [0,1,3])for(const wave of [false,true]) {
  const source=`${motionIdle}\n[State 0, palette]\ntype=${type}\ntrigger1=Time=0\ntime=${duration}\nadd=10,-20,30\nmul=128,256,512\ncolor=128\ninvertall=${side}\n${wave?'sinadd=20,0,-10,4':''}`;
  const def=`[Info]\nlocalcoord=${width},${width*3/4}`;
  const handle=api.ktCoreCreateWithDefinitions('palette first','palette second',air,air,side===0?source:motionIdle,
    side===1?source:motionIdle,'','',side===0?def:'',side===1?def:'');
  try {
    api.ktCoreSetup(handle,-100*256,0,100*256,0);
    for(let age=0;age<5;age++) {
      api.ktCoreAdvance(handle,0,'',0,'');const state=JSON.parse(api.ktCorePalettes(handle)),plan=JSON.parse(api.ktCoreRenderPlan(handle,0));
      const active=age<duration,s=wave?Math.sin(2*Math.PI*age/4):0;
      const layer={add:[10+Math.trunc(20*s),-20,30+Math.trunc(-10*s)],mul:[128,256,512],color:128,invert:!!side};
      for(const d of plan.draws)assert.deepEqual(d.palFX,active&&(type==='AllPalFX'||type==='PalFX'&&d.side===side)?[layer]:[]);
      const effect=type==='AllPalFX'?state.all:type==='BGPalFX'?state.background:state.groups[state.actors[side].group];
      if(active){assert.equal(effect.remaining,duration-age);assert.equal(effect.age,age);assert.deepEqual(effect.layer,layer)}else assert.equal(effect,null);
      const stage=active&&type!=='PalFX';
      assert.deepEqual(plan.paletteColors.backdrop,stage?paletteRgb([16,35,56],layer):[16,35,56]);
      assert.deepEqual(plan.paletteColors.life1,stage?paletteRgb([149,215,143],layer):[149,215,143]);
      const before=api.ktCorePalettes(handle),checksum=api.ktCoreChecksum(handle);
      for(let i=0;i<3;i++){assert.equal(api.ktCorePalettes(handle),before);api.ktCoreRenderPlan(handle,12)}
      assert.equal(api.ktCoreChecksum(handle),checksum);assert.equal(api.ktCoreIssues(handle),'');
    }
  } finally {api.ktCoreRelease(handle);}
}
for(const width of [320,640,1008]) {
  const source=`${motionIdle}
[State 0, local]
type=PalFX
trigger1=Time=0
time=10
add=10,0,0
[State 0, all]
type=AllPalFX
trigger1=Time=0
time=10
mul=128,128,128
`+[0,1].map(own=>`[State 0, helper ${own}]
type=Helper
trigger1=Time=0
stateno=${700+own}
ownpal=${own}
[State 0, shot ${own}]
type=Projectile
trigger1=Time=0
projanim=200
projremovetime=20
ownpal=${own}
[State 0, effect ${own}]
type=Explod
trigger1=Time=0
anim=0
removetime=-1
ownpal=${own}`).join('\n')+`
[Statedef 700]
type=S
physics=N
anim=0
[State 700, ignored without ownpal]
type=PalFX
trigger1=Time=0
time=10
add=99,0,0
[Statedef 701]
type=S
physics=N
anim=0
[State 701, independent palette]
type=PalFX
trigger1=Time=0
time=10
add=0,20,0
[State 701, retained family]
type=Helper
trigger1=Time=0
stateno=702
[State 701, retained projectile]
type=Projectile
trigger1=Time=0
projanim=200
projremovetime=20
[State 701, destroy creator]
type=DestroySelf
trigger1=Time=1
[Statedef 702]
type=S
physics=N
anim=0`;
  const handle=api.ktCoreCreateWithDefinitions('palette family','opponent',projectileFacingAir,air,source,motionIdle,'','',`[Info]\nlocalcoord=${width},${width*3/4}`,'');
  try {
    api.ktCoreSetup(handle,-100*256,0,100*256,0);for(let i=0;i<4;i++)api.ktCoreAdvance(handle,0,'',0,'');
    const state=JSON.parse(api.ktCorePalettes(handle)),root=state.actors[0],shared=state.actors[2],nested=state.actors[3];
    assert.equal(state.actors.length,4);assert.equal(shared.group,root.group);assert.notEqual(nested.group,root.group);assert.equal(nested.ownPalette,false);
    assert.deepEqual(state.groups[root.group].layer.add,[10,0,0]);assert.equal(state.groups[root.group].age,3);
    assert.deepEqual(state.groups[nested.group].layer.add,[0,20,0]);assert.equal(state.groups[nested.group].age,2);
    assert.equal(state.projectiles[0].group,root.group);assert.notEqual(state.projectiles[1].group,root.group);assert.equal(state.groups[state.projectiles[1].group],null);
    assert.equal(state.projectiles[2].group,nested.group);assert.equal(state.explods[0].group,root.group);assert.equal(state.groups[state.explods[1].group],null);
    const plan=JSON.parse(api.ktCoreRenderPlan(handle,0));
    assert.deepEqual(plan.draws.find(d=>d.kind==='helper'&&d.palFX[0]?.add[1]===20).palFX.map(x=>x.add),[[0,20,0],[0,0,0]]);
    assert.equal(api.ktCoreIssues(handle),'');
  } finally {api.ktCoreRelease(handle);}
}
console.log('Native Wasm PalFX/AllPalFX/BGPalFX / 108 coordinate-side-scope-duration-wave sequences / three retained helper-projectile-Explod palette families / ownpal isolation / resolved stage-HUD colors and pure reads: OK (synthetic)');

const afterimageAir='[Begin Action 0]\n0,0,0,0,2\n0,1,3,-5,2,H';
const afterimageBase={add:[10,20,30],mul:[128,256,512],color:128,invert:true,post:[5,0,10]};
const afterimageGlobal={add:[3,0,0],mul:[256,256,256],color:256,invert:false};
const afterimageTransforms=['x','y','axisX','axisY','displayOffsetX256','displayOffsetY256','transformA','transformB','transformC','transformD',
  'rotationDegrees','angleDraw','flipX','flipY','spriteScaleX','spriteScaleY','pixelScaleX','pixelScaleY','facing','action','elem','elemTime','animTime','group','number'];
for(const width of [320,640,1008])for(const side of [0,1])for(const timegap of [1,3])for(const framegap of [1,3,4])for(const duration of [3,-1])for(const trans of ['none','add','add1','sub']) {
  const source=`${motionIdle}
[State 0, history]
type=AfterImage
trigger1=Time=0
time=${duration}
length=12
timegap=${timegap}
framegap=${framegap}
trans=${trans}
palbright=10,20,30
palcontrast=128,256,512
palpostbright=5,0,10
palcolor=128
palinvertall=1
paladd=2,4,6
palmul=.5,1,2
[State 0, movement]
type=VelSet
trigger1=Time=0
x=${width/40}
[State 0, turn]
type=Turn
trigger1=Time=8
trigger2=Time=16
[State 0, angle]
type=AngleSet
trigger1=1
value=Time*7
[State 0, draw]
type=AngleDraw
trigger1=1
scale=ifelse(Time%2,-1.5,1),.5
[State 0, offset]
type=Offset
trigger1=1
x=Time*${width/320}
y=-${width/320}
[State 0, priority]
type=SprPriority
trigger1=1
value=ifelse(Time%2,4,1)
[State 0, local excluded from trails]
type=PalFX
trigger1=Time=0
time=-1
invertall=1
[State 0, global included in trails]
type=AllPalFX
trigger1=Time=0
time=-1
add=3,0,0`;
  const def=`[Info]\nlocalcoord=${width},${width*3/4}`;
  const handle=api.ktCoreCreateWithDefinitions('trail first','trail second',afterimageAir,afterimageAir,
    side===0?source:motionIdle,side===1?source:motionIdle,'','',side===0?def:'',side===1?def:'');
  try {
    api.ktCoreSetup(handle,-100*256,0,100*256,0);api.ktCoreDebugSetFacing(handle,side,side===0);
    const poses=new Map();
    for(let tick=1;tick<=42;tick++) {
      api.ktCoreAdvance(handle,0,'',0,'');const plan=JSON.parse(api.ktCoreRenderPlan(handle,0));
      const current=plan.draws.find(d=>d.kind==='fighter'&&d.side===side);poses.set(tick,current);
      const expected=[],records=Math.floor((tick-1)/timegap)+1,alive=duration<0||tick<timegap*12+duration-1;
      if(alive)for(let rank=0;rank<Math.floor(Math.min(records,11)/framegap);rank++) {
        const distance=(rank+1)*framegap;
        if(duration>0&&Math.floor(tick/timegap)-distance>=Math.trunc((duration-2)/timegap)+1)continue;
        const captureFrame=1+(records-distance)*timegap,pose=poses.get(captureFrame);
        const layers=[afterimageBase];
        if(rank)layers.push({add:[2,4,6],mul:[128,256,512],color:256,invert:false,...(rank!==1?{repeat:rank}:{})});
        layers.push(afterimageGlobal);
        expected.push({captureFrame,rank,pose,layers,priority:Math.min(pose.sprpriority-2,current.sprpriority-2)-rank});
      }
      expected.sort((a,b)=>a.priority-b.priority||b.rank-a.rank);
      const ghosts=plan.draws.filter(d=>d.kind==='afterimage');assert.equal(ghosts.length,expected.length,JSON.stringify({width,side,timegap,framegap,duration,trans,tick}));
      for(const [index,ghost]of ghosts.entries()) {
        const e=expected[index];assert.equal(ghost.side,side);assert.equal(ghost.captureFrame,e.captureFrame);assert.equal(ghost.historyIndex,e.rank);
        assert.equal(ghost.afterimageOwnerId,side+1);assert.equal(ghost.sprpriority,e.priority);assert.deepEqual(ghost.palFX,e.layers);
        assert.deepEqual(ghost.blend,trans==='none'?{mode:'normal',source:256,destination:0}:trans==='sub'?{mode:'sub',source:256,destination:256}:{mode:'add',source:256,destination:trans==='add1'?128:256});
        for(const key of afterimageTransforms)assert.equal(ghost[key],e.pose[key],key);
      }
      const state=api.ktCoreAfterImages(handle),checksum=api.ktCoreChecksum(handle);
      for(let read=0;read<3;read++){assert.equal(api.ktCoreAfterImages(handle),state);api.ktCoreRenderPlan(handle,12);}
      assert.equal(api.ktCoreChecksum(handle),checksum);assert.equal(api.ktCoreIssues(handle),'');
    }
  } finally {api.ktCoreRelease(handle);}
}
for(const width of [320,640,1008])for(const side of [0,1]) {
  const source=`${motionIdle}
[State 0, root trail]
type=AfterImage
trigger1=Time=0
time=5
length=12
timegap=3
framegap=1
[State 0, extend]
type=AfterImageTime
trigger1=Time=4
value=-1
[State 0, stop]
type=AfterImageTime
trigger1=Time=8
time=0
[State 0, helper]
type=Helper
trigger1=Time=0
stateno=700
[Statedef 700]
type=S
physics=N
anim=0
[State 700, own trail]
type=AfterImage
trigger1=Time=0
time=-1
framegap=1
[State 700, own stop]
type=AfterImageTime
trigger1=Time=3
time=1`;
  const def=`[Info]\nlocalcoord=${width},${width*3/4}`;
  const handle=api.ktCoreCreateWithDefinitions('retime first','retime second',afterimageAir,afterimageAir,
    side===0?source:motionIdle,side===1?source:motionIdle,'','',side===0?def:'',side===1?def:'');
  try {
    api.ktCoreSetup(handle,-100*256,0,100*256,0);
    for(let tick=1;tick<=12;tick++) {
      api.ktCoreAdvance(handle,0,'',0,'');const rows=JSON.parse(api.ktCoreAfterImages(handle)),root=rows[side].trail,helper=rows[2].trail;
      assert.equal(rows[1-side].trail,null);
      if(tick>=9)assert.equal(root,null);else {
        assert.equal(root.time,tick<5?5:-1);assert.equal(root.elapsed,tick<5?tick:tick-4);
        assert.equal(root.records,Math.floor((tick-1)/3)+1);assert.equal(root.stored,root.records);
      }
      if(tick===1||tick>=5)assert.equal(helper,null);else {assert.equal(helper.time,-1);assert.equal(helper.records,tick-1);}
      assert.equal(api.ktCoreIssues(handle),'');
    }
  } finally {api.ktCoreRelease(handle);}
}
console.log('Native Wasm AfterImage/AfterImageTime / 288 coordinate-side-gap-duration-blend histories / immutable transforms and AIR poses / six independent root-helper retimings / pure reads: OK (synthetic; native rendering parity unverified)');

const reversalAir=(width,attack=true)=>{
  const f=width/320;
  return `[Begin Action 0]\nClsn2Default:1\nClsn2[0]=${-20*f},${-40*f},${20*f},0\n0,0,0,0,-1\n`+
    `[Begin Action 200]\n${attack?`Clsn1Default:1\nClsn1[0]=0,${-40*f},${100*f},0\n`:''}Clsn2Default:1\nClsn2[0]=${-20*f},${-40*f},${20*f},0\n200,0,0,0,-1`;
};
for(const [width,enemyWidth]of [[320,1008],[640,320],[1008,640]])for(const side of [0,1])for(const attr of ['S,NA','C,SP','A,HT'])for(const match of [false,true])for(const geometry of ['attack','hurt','miss'])for(const route of ['none','borrowed','own']) {
  const r=width/320,a=enemyWidth/320;
  const source=`[Statedef 0]\ntype=S\nmovetype=A\nphysics=N\nctrl=0\nanim=200
[State 0, reversal]
type=ReversalDef
trigger1=1
reversal.attr=${match?attr:'S,ST'}
id=76+ID
pausetime=2,4
${route==='none'?'':`p1stateno=910\np2stateno=${route==='own'?912:911}\np2getp1state=${route==='own'?0:1}`}
[Statedef 910]
type=S
movetype=A
physics=N
anim=0
movehitpersist=1
velset=${-2*r},0
[Statedef 911]
type=S
movetype=H
physics=N
anim=0
movehitpersist=1
velset=${5*r},${-2*r}`;
  const enemy=`[Statedef 0]\ntype=S\nmovetype=A\nphysics=N\nctrl=0\nanim=200
[State 0, attacking]
type=HitDef
trigger1=1
attr=${attr}
damage=123
[Statedef 912]
type=S
movetype=H
physics=N
anim=0
movehitpersist=1
velset=${7*a},${-3*a}`;
  const defs=[`[Info]\nlocalcoord=${width},${width*3/4}`,`[Info]\nlocalcoord=${enemyWidth},${enemyWidth*3/4}`];
  const arts=[reversalAir(width,geometry!=='hurt'),reversalAir(enemyWidth)],scripts=[source,enemy];
  if(side===1){defs.reverse();arts.reverse();scripts.reverse();}
  const handle=api.ktCoreCreateWithDefinitions('counter first','counter second',...arts,...scripts,'','',...defs);
  try {
    api.ktCoreSetup(handle,-10*256,0,(geometry==='miss'?220:10)*256,0);
    api.ktCoreAdvance(handle,0,'',0,'');
    const result=JSON.parse(api.ktCoreReversals(handle)),hero=JSON.parse(api.ktCoreSnapshot(handle,side)),victim=JSON.parse(api.ktCoreSnapshot(handle,1-side));
    const reversed=match&&geometry==='attack';
    assert.deepEqual(result.contacts,reversed?[{reverser:side+1,attacker:2-side,id:77+side}]:[]);
    assert.equal(hero.life,!reversed&&geometry!=='miss'?877:1000);assert.equal(victim.life,1000);
    if(reversed){
      assert.equal(hero.moveHitTime,1);assert.equal(victim.moveReversedTime,1);assert.equal(victim.moveContactTime,0);assert.equal(victim.moveHitTime,0);assert.equal(victim.moveGuardedTime,0);
      assert.equal(hero.numTargets,1);assert.equal(hero.hitPause,2);assert.equal(victim.hitPause,4);assert.equal(hero.power,0);assert.equal(victim.power,0);
      assert.equal(hero.state,route==='none'?0:910);assert.equal(victim.state,route==='none'?0:route==='own'?912:911);
      assert.equal(victim.stateOwner,route==='borrowed'?side+1:2-side);
      if(route!=='none'){
        assert.equal(hero.vx256,-2*256);assert.equal(victim.vx256,(route==='own'?7:5)*256);assert.equal(victim.vy256,(route==='own'?-3:-2)*256);
        assert.equal(victim.localCoordWidth,route==='own'?enemyWidth:width);
      }
      assert.deepEqual(JSON.parse(api.ktCoreContacts(handle)),[]);
    }else assert.equal(JSON.parse(api.ktCoreContacts(handle)).length,geometry==='miss'?0:1);
    const checksum=api.ktCoreChecksum(handle),inspection=api.ktCoreReversals(handle);
    for(let read=0;read<4;read++){api.ktCoreRenderPlan(handle,read*4);assert.equal(api.ktCoreReversals(handle),inspection);}
    assert.equal(api.ktCoreChecksum(handle),checksum);assert.equal(api.ktCoreIssues(handle),'');
    if(reversed)for(let tick=0;tick<6;tick++){
      api.ktCoreAdvance(handle,0,'',0,'');assert.deepEqual(JSON.parse(api.ktCoreReversals(handle)).contacts,[]);
      assert.equal(JSON.parse(api.ktCoreSnapshot(handle,side)).life,1000);
    }
  } finally {api.ktCoreRelease(handle);}
}
for(const width of [320,640,1008])for(const side of [0,1])for(const role of ['reverser','attacker']) {
  const head='[Statedef 0]\ntype=S\nmovetype=A\nphysics=N\nctrl=0\nanim=200';
  const reverse='type=ReversalDef\ntrigger1=1\nreversal.attr=SCA,AA,AP,AT\npausetime=2,3\nid=9';
  const hit='type=HitDef\ntrigger1=Time>=1\nattr=S,NA\ndamage=200';
  const spawn='type=Helper\ntrigger1=Time=0\nstateno=700';
  const helper='[Statedef 700]\ntype=S\nmovetype=A\nphysics=N\nctrl=0\nanim=200';
  const hero=head+'\n[State 0, counter]\n'+(role==='reverser'?spawn:reverse)+(role==='reverser'?'\n'+helper+'\n[State 700, counter]\n'+reverse:'');
  const enemy=head+'\n[State 0, attack]\n'+(role==='attacker'?spawn:hit)+(role==='attacker'?'\n'+helper+'\n[State 700, attack]\n'+hit.replace('Time>=1','1'):'');
  const scripts=side===0?[hero,enemy]:[enemy,hero],def=`[Info]\nlocalcoord=${width},${width*3/4}`;
  const handle=api.ktCoreCreateWithDefinitions('helper counter','helper attack',reversalAir(width),reversalAir(width),...scripts,'','',def,def);
  try {
    api.ktCoreSetup(handle,-10*256,0,10*256,0);api.ktCoreAdvance(handle,0,'',0,'');api.ktCoreAdvance(handle,0,'',0,'');
    const result=JSON.parse(api.ktCoreReversals(handle));
    assert.deepEqual(result.contacts,[{reverser:role==='reverser'?3:side+1,attacker:role==='attacker'?3:2-side,id:9}]);
    assert.equal(JSON.parse(api.ktCoreSnapshot(handle,0)).life,1000);assert.equal(JSON.parse(api.ktCoreSnapshot(handle,1)).life,1000);
    assert.equal(api.ktCoreIssues(handle),'');
  } finally {api.ktCoreRelease(handle);}
}
console.log('Native Wasm ReversalDef / 324 mixed-coordinate-side-attribute-geometry-state routes / 12 root-helper contacts / attack neutralization / no damage or power / pure reads: OK (synthetic; native contact parity unverified)');

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
