import {test} from "node:test";
import assert from "node:assert/strict";
import {TrainingMatch} from "../../src/combat.js";
import {parseSections} from "../../src/runtime.js";

const encode=value=>new TextEncoder().encode(value);
const character=(name)=>({
  path:name+".def",
  def:{info:{name,mugenversion:"1.1"},files:{cns:name+".cns"}},
  files:{[name+".cns"]:encode(`[Statedef 0]
type = S
movetype = I
physics = N
anim = 0
ctrl = 0
`)},
  animations:[{id:0,frames:[{group:0,number:0,x:0,y:0,ticks:-1,clsn1:[],clsn2:[]}]}],
});
function scenario(seed=1){
  const match=new TrainingMatch(character("selector"),{
    opponentCharacter:character("target"),initialize:false,
    orderedPhases:false,pushboxes:false,
  });
  const root=match.player;
  root._seed=seed;
  const a=match.spawnHelper(match.opponent,{id:201,stateno:0});
  const b=match.spawnHelper(match.opponent,{id:202,stateno:0});
  const c=match.spawnHelper(match.opponent,{id:203,stateno:0});
  assert.ok(a&&!a.destroyed&&b&&!b.destroyed&&c&&!c.destroyed);
  root.targets=[a,b,c];
  root.targetHitIds.set(a.id,99);
  root.targetHitIds.set(b.id,99);
  root.targetHitIds.set(c.id,44);
  return {match,root,a,b,c};
}
function drop(root,properties=""){
  const section=parseSections(`[State 0, MUGEN 1.1 TargetDrop]
type = TargetDrop
trigger1 = 1
${properties}
`)[0];
  root.execute({...section,type:"targetdrop"});
}
test("MUGEN 1.1 TargetDrop keepone=1 selects one matching live target, not always first",()=>{
  const choices=new Set();
  for(let seed=1;seed<=40;seed++){
    const {root,a,b}=scenario(seed);
    const oldSeed=root._seed;
    drop(root,"excludeid=99\nkeepone=1");
    assert.equal(root.targets.length,1);
    assert.ok(root.targets[0]===a||root.targets[0]===b);
    assert.notEqual(root._seed,oldSeed,"the multi-candidate choice consumes a deterministic random value");
    assert.equal(root.resolveTrigger("numtarget"),1);
    assert.equal(root.targetHitIds.size,1,"dropped target hit-ID records are cleared");
    choices.add(root.targets[0]===a?"first":"second");
  }
  assert.deepEqual([...choices].sort(),["first","second"],
    "legacy selection must not systematically choose the first matching target");
});

test("TargetDrop random choice is reproducible for the same seed and target set",()=>{
  const first=scenario(0x12345678),second=scenario(0x12345678);
  drop(first.root,"excludeid=99\nkeepone=1");
  drop(second.root,"excludeid=99\nkeepone=1");
  assert.equal(first.root.targets[0].helperId,second.root.targets[0].helperId);
  assert.equal(first.root._seed,second.root._seed);
});

test("TargetDrop keepone=0 retains all matching live targets without consuming RNG",()=>{
  const {root,a,b}=scenario(0x1213);
  const initialSeed=root._seed;
  drop(root,"excludeid=99\nkeepone=0");
  assert.deepEqual(root.targets,[a,b]);
  assert.equal(root._seed,initialSeed);
  assert.equal(root.resolveTrigger("numtarget",[99]),2);
});

test("TargetDrop keepone=1 with one candidate does not require a random draw",()=>{
  const {root,a,b}=scenario(0x1617);
  b.destroyed=true;
  const initialSeed=root._seed;
  drop(root,"excludeid=99\nkeepone=1");
  assert.deepEqual(root.targets,[a]);
  assert.equal(root._seed,initialSeed);
});

test("TargetDrop default excludeID=-1 drops all targets, clears hit-ID map, and needs no draw",()=>{
  const {root}=scenario(0x2122);
  const initialSeed=root._seed;
  drop(root);
  assert.equal(root.targets.length,0);
  assert.equal(root.targetHitIds.size,0);
  assert.equal(root._seed,initialSeed);
});
