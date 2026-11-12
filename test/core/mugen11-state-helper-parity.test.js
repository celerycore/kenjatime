import {test} from "node:test";
import assert from "node:assert/strict";
import {parseProgram} from "../../src/runtime.js";
import {TrainingMatch} from "../../src/combat.js";
import {spawnPosition} from "../../src/entities.js";

const encode = text => new TextEncoder().encode(text);
const cns = `
[Statedef -3]
[State -3, RootOnly]
type = VarAdd
trigger1 = 1
v = 20
value = 1

[Statedef -2]
[State -2, RootOnly]
type = VarAdd
trigger1 = 1
v = 21
value = 1

[Statedef -1]
[State -1, RootInput]
type = VarAdd
trigger1 = 1
v = 22
value = 1

[Statedef 0]
type = S
movetype = I
physics = N
anim = 0
ctrl = 0

[Statedef 1801]
type = S
movetype = I
physics = N
anim = 0
ctrl = 0

[Statedef 1802]
type = S
physics = N
anim = 0
ctrl = 0
[State 1802, Transition]
type = ChangeState
trigger1 = Time = 0
value = 1803
[State 1802, ShouldNotExecute]
type = VarSet
trigger1 = 1
v = 31
value = 999

[Statedef 1803]
type = S
physics = N
anim = 0
ctrl = 0
[State 1803, OnEntry]
type = VarSet
trigger1 = Time = 0
v = 32
value = 123

[Statedef 1804]
type = S
physics = N
anim = 0
ctrl = 0
[State 1804, OnceOnly]
type = VarAdd
trigger1 = 1
persistent = 0
v = 33
value = 1

[Statedef 1805]
type = S
physics = N
anim = 0
ctrl = 0
[State 1805, EveryTwoTrue]
type = VarAdd
trigger1 = Var(40) = 1
persistent = 2
v = 35
value = 1
[State 1805, EveryThreeTrue]
type = VarAdd
trigger1 = Var(40) = 1
persistent = 3
v = 36
value = 1
[State 1805, EveryOneTrue]
type = VarAdd
trigger1 = Var(40) = 1
persistent = 1
v = 37
value = 1
`;
function fixture(){
  const character={
    path:"mugen11-helper-fixture.def",
    def:{info:{name:"MUGEN 1.1 helper fixture",mugenversion:"1.1"},files:{cns:"fixture.cns"}},
    files:{"fixture.cns":encode(cns)},
    animations:[{id:0,frames:[{
      group:0,number:0,x:0,y:0,ticks:-1,clsn1:[],clsn2:[]
    }]}],
  };
  const program=parseProgram(character);
  assert.equal(program.diagnostics.some(d=>d.fatal),false);
  const m=new TrainingMatch(character,{
    initialize:false,manageInputs:false,orderedPhases:true,
    programs:new Map([[character,program]]),
  });
  return m;
}

test("MUGEN 1.1 normal helpers skip -3/-2, and keyctrl determines inherited root -1",()=>{
  const m=fixture();
  const noKeys=m.spawnHelper(m.player,{id:1801,stateno:1801,keyctrl:0});
  const keys=m.spawnHelper(m.player,{id:1802,stateno:1801,keyctrl:1});
  assert.ok(noKeys&&!noKeys.destroyed&&keys&&!keys.destroyed);
  for(let i=0;i<3;i++)m.tick();
  assert.equal(m.player.vars[20],3);
  assert.equal(m.player.vars[21],3);
  assert.equal(m.player.vars[22],3);
  for(const helper of [noKeys,keys]){
    assert.equal(helper.vars[20],0,"normal helpers must not inherit -3");
    assert.equal(helper.vars[21],0,"normal helpers must not inherit -2");
  }
  assert.equal(noKeys.vars[22],0,"keyctrl=0 must skip root -1");
  assert.equal(keys.vars[22],3,"keyctrl=1 inherits root -1");
  assert.equal(noKeys.parent,m.player);
  assert.equal(keys.root,m.player);
});

test("a helper ChangeState aborts subsequent old controllers and immediately enters the new state",()=>{
  const m=fixture();
  const helper=m.spawnHelper(m.player,{id:1802,stateno:1802,keyctrl:0});
  assert.ok(helper&&!helper.destroyed);
  m.tick();
  assert.equal(helper.stateNo,1803);
  assert.equal(helper.vars[31],0,"controllers after ChangeState must not execute");
  assert.equal(helper.vars[32],123,"new state executes in same fixed simulation tick");
});

test("persistent=0 on a helper state fires once until state re-entry",()=>{
  const m=fixture();
  const helper=m.spawnHelper(m.player,{id:1804,stateno:1804,keyctrl:0});
  for(let i=0;i<6;i++)m.tick();
  assert.equal(helper.vars[33],1);
  assert.ok(helper.changeState(0));
  assert.ok(helper.changeState(1804));
  m.tick();
  assert.equal(helper.vars[33],2);
});

test("helper identity, nested NumHelper, and missing-state rejection stay observable",()=>{
  const m=fixture();
  const p=m.spawnHelper(m.player,{id:1801,stateno:1801});
  const nested=m.spawnHelper(p,{id:1802,stateno:1801});
  assert.equal(m.player.resolveTrigger("numhelper"),2);
  assert.equal(m.player.resolveTrigger("numhelper",[1801]),1);
  assert.equal(m.player.resolveTrigger("numhelper",[1802]),1);
  assert.equal(p.resolveTrigger("numhelper"),1);
  assert.equal(nested.parent.id,p.id);
  assert.equal(nested.root.id,m.player.id);
  assert.equal(m.helperStats.attempted,2);
  assert.equal(m.helperStats.created,2);
  const bad=m.spawnHelper(m.player,{id:3000,stateno:999999});
  assert.equal(bad.destroyed,true);
  assert.equal(m.helperStats.missingState,1);
  assert.equal(m.helperStats.rejected,1);
  assert.ok(m.diagnostics.some(d=>d.type==="missing-state"));
  nested.destroyed=true;
  m.cleanupEntities();
  assert.equal(m.helperStats.destroyed,1);
});

test("MUGEN 1.1 Helper postype=p2 uses enemy X/facing but spawner Y",()=>{
  const parent={pos:{x:10,y:-60},facing:1,
    opponent:{pos:{x:120,y:-180},facing:-1},
    coordinateScale:1,world:{view:{left:-160,right:160}}};
  const helper=spawnPosition(parent,{postype:"p2",pos:[20,25],facing:-1});
  assert.deepEqual(helper,{pos:{x:100,y:-35},facing:1});
  const single=spawnPosition(parent,{postype:"p1",pos:15});
  assert.deepEqual(single,{pos:{x:25,y:-60},facing:1});
  const projectile=spawnPosition(parent,{postype:"p2",offset:[20,25]},true);
  assert.equal(projectile.pos.y,-155,"projectile legacy placement is unaffected by helper correction");
});

test("MUGEN 1.1 persistent=N counts only true evaluations: every 2nd/3rd trigger, not first",()=>{
  const m=fixture();
  const h=m.spawnHelper(m.player,{id:1805,stateno:1805,keyctrl:0});
  assert.ok(h&&!h.destroyed);
  // A false trigger evaluation must never advance any persistence counter.
  m.tick();m.tick();m.tick();
  assert.deepEqual([h.vars[35],h.vars[36],h.vars[37]],[0,0,0]);
  h.vars[40]=1;
  m.tick();
  assert.deepEqual([h.vars[35],h.vars[36],h.vars[37]],[0,0,1],"first true evaluation");
  h.vars[40]=0;m.tick();m.tick();
  h.vars[40]=1;
  m.tick();
  assert.deepEqual([h.vars[35],h.vars[36],h.vars[37]],[1,0,2],"second true evaluation");
  m.tick();
  assert.deepEqual([h.vars[35],h.vars[36],h.vars[37]],[1,1,3],"third true evaluation");
  for(let n=0;n<3;n++)m.tick();
  assert.deepEqual([h.vars[35],h.vars[36],h.vars[37]],[3,2,6],"six true evaluations");
  h.changeState(0);h.changeState(1805);
  m.tick();
  assert.deepEqual([h.vars[35],h.vars[36],h.vars[37]],[3,2,7],"state re-entry resets only persistence counters");
  m.tick();
  assert.deepEqual([h.vars[35],h.vars[36],h.vars[37]],[4,2,8]);
});

test("MUGEN 1.1 missing or destroyed P2 falls back to the spawning player's axis",()=>{
  const owner={pos:{x:12,y:-20},facing:-1,
    opponent:{pos:{x:200,y:-80},facing:1,destroyed:true},
    coordinateScale:1,world:{view:{left:-160,right:160}}};
  const pose=spawnPosition(owner,{postype:"p2",pos:[15,5],facing:1});
  assert.deepEqual(pose,{pos:{x:-3,y:-15},facing:-1});
  owner.opponent=null;
  assert.deepEqual(spawnPosition(owner,{postype:"p2",pos:[15,5],facing:1}),pose);

  const match=fixture();
  match.player.opponent=null;
  const helper=match.spawnHelper(match.player,{id:802,stateno:1801,postype:"p2",pos:[10,2]});
  assert.ok(helper&&!helper.destroyed);
  assert.equal(helper.pos.x,match.player.pos.x+10*match.player.facing);
  assert.equal(helper.pos.y,match.player.pos.y+2);
  assert.ok(match.player.diagnostics.some(d=>d.type==="missing-player"&&d.message.includes("postype=p2")));
});

test("duplicate MUGEN 1.1 global states are reported, never silently considered native parity",()=>{
  const first=`[Statedef -3]
[State -3, First]
type=Null
trigger1=1
[Statedef -2]
[State -2, First]
type=Null
trigger1=1
`;
  const second=`[Statedef -2]
[State -2, Second]
type=Null
trigger1=1
[Statedef -1]
[State -1, New]
type=Null
trigger1=1
`;
  const character={
    path:"global-duplicates.def",
    def:{info:{mugenversion:"1.1"},files:{st:"first.cns",st1:"second.cns"}},
    files:{"first.cns":encode(first),"second.cns":encode(second)},
  };
  const program=parseProgram(character);
  const warnings=program.diagnostics.filter(d=>d.type==="mugen11-duplicate-global");
  assert.equal(warnings.length,1);
  assert.equal(warnings[0].state,-2);
  assert.equal(warnings[0].source,"second.cns");
  assert.match(warnings[0].message,/native verification/);
  assert.ok(!warnings.some(w=>w.state===-1 || w.state===-3));
  assert.equal(program.diagnostics.some(d=>d.fatal),false);
  assert.equal(program.states.get(-2).source,"second.cns",
    "diagnostic-only change does not silently alter existing state precedence");
});
