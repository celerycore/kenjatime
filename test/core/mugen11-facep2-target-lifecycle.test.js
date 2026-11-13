import {test} from "node:test";
import assert from "node:assert/strict";
import {TrainingMatch} from "../../src/combat.js";
import {parseSections} from "../../src/runtime.js";

const encoder=new TextEncoder();
const faceStates=`
[Statedef 0]
type=S
movetype=I
physics=N
anim=0
ctrl=0

[Statedef 200]
type=S
movetype=I
physics=N
anim=0
ctrl=0
facep2=1

[Statedef 201]
type=S
movetype=I
physics=N
anim=0
ctrl=0
facep2=0

[Statedef 202]
type=S
movetype=I
physics=N
anim=0
ctrl=0
facep2=1
`;
function character(name,extra=""){
  return {
    path:name+".def",
    def:{info:{name,mugenversion:"1.1"},files:{cns:name+".cns"}},
    files:{[name+".cns"]:encoder.encode(faceStates+extra)},
    animations:[{id:0,frames:[{group:0,number:0,x:0,y:0,ticks:-1,clsn1:[],clsn2:[]}]}],
  };
}
const match=()=>new TrainingMatch(character("one"),{
  opponentCharacter:character("two"),initialize:false,
  // Direct state-entry tests run without the scheduled-phase deferral.
  // Ordered-phase pending transitions have separate regression coverage.
  orderedPhases:false,pushboxes:false,
});
function execute(actor,type,params){
  const section=parseSections(`[State 0, MUGEN1.1 probe]
type=${type}
trigger1=1
${params}
`)[0];
  actor.execute({...section,type:type.toLowerCase()});
}

test("MUGEN 1.1 StateDef facep2=1 turns toward live opponent at state entry",()=>{
  const m=match(),p1=m.player,p2=m.opponent;
  p1.pos.x=-30;p2.pos.x=80;
  p1.facing=-1;
  assert.equal(p1.changeState(200),true);
  assert.equal(p1.facing,1);
  p1.pos.x=120;p2.pos.x=-10;p1.facing=1;
  assert.equal(p1.changeState(200),true);
  assert.equal(p1.facing,-1);
  // facep2 only acts on entry: it does not continuously track movement.
  p1.pos.x=-100;p1.ctrl=0;
  m.tick();
  assert.equal(p1.facing,-1);
});

test("StateDef facep2=0, absent/destroyed P2, or coincident axes preserve facing",()=>{
  const m=match(),p=m.player,o=m.opponent;
  p.pos.x=0;o.pos.x=80;p.facing=-1;
  p.changeState(201);
  assert.equal(p.facing,-1,"facep2=0 must not turn");
  o.pos.x=p.pos.x;
  p.changeState(200);
  assert.equal(p.facing,-1,"overlapping axes do not force an arbitrary turn");
  o.pos.x=80;o.destroyed=true;
  p.changeState(200);
  assert.equal(p.facing,-1,"destroyed opponent cannot anchor a turn");
  p.opponent=null;
  p.changeState(200);
  assert.equal(p.facing,-1,"absent P2 leaves facing unchanged");
});

test("P2 borrowed StateDef uses victim opponent coordinates, not attacker direction",()=>{
  const m=match(),a=m.player,v=m.opponent;
  a.pos.x=100;a.facing=1;
  v.pos.x=0;v.facing=-1;
  assert.equal(v.changeState(200,0,a),true);
  assert.equal(v.stateOwner,a);
  assert.equal(v.facing,1,"victim faces its own opponent when executing borrowed StateDef");
  assert.equal(a.facing,1,"attacker facing must remain unchanged");
});

test("helper starting in a facep2 StateDef turns toward the opposite root",()=>{
  const m=match();
  m.player.pos.x=-70;m.opponent.pos.x=70;
  const helper=m.spawnHelper(m.player,{id:810,stateno:200,postype:"p1",pos:[0,0],facing:-1});
  assert.ok(helper&&!helper.destroyed);
  assert.equal(helper.opponent,m.opponent);
  assert.equal(helper.facing,1);
  assert.equal(helper.stateNo,200);
});

test("NumTarget and Target(id) redirection skip dead targets before end-of-frame cleanup",()=>{
  const m=match(),a=m.player;
  const h1=m.spawnHelper(m.opponent,{id:71,stateno:0});
  const h2=m.spawnHelper(m.opponent,{id:72,stateno:0});
  a.targets=[h1,h2];
  a.targetHitIds.set(h1.id,990);
  a.targetHitIds.set(h2.id,990);
  assert.equal(a.resolveTrigger("numtarget"),2);
  h1.destroyed=true; // midway through a tick; cleanup hasn't run yet
  assert.equal(a.resolveTrigger("numtarget"),1);
  assert.equal(a.resolveTrigger("numtarget",[990]),1);
  assert.equal(a.resolveTrigger("stateno",[],{name:"target",args:[990]}),0,
    "a dead first match must not block redirection to the live second target");
  assert.equal(a.resolveTrigger("id",[],{name:"target",args:[990]}),h2.id);
  execute(a,"TargetDrop","excludeid=990\nkeepone=1");
  assert.deepEqual(a.targets,[h2],"TargetDrop cannot keep a destroyed target");
});

test("BindToTarget with an ID skips an already-destroyed matching target",()=>{
  const m=match(),a=m.player;
  const dead=m.spawnHelper(m.opponent,{id:811,stateno:0});
  const live=m.spawnHelper(m.opponent,{id:812,stateno:0});
  a.targets=[dead,live];
  a.targetHitIds.set(dead.id,33);
  a.targetHitIds.set(live.id,33);
  dead.destroyed=true;
  execute(a,"BindToTarget","id=33\ntime=4\npos=1,2,Foot");
  assert.equal(a.bound?.target,live);
  assert.equal(a.bound.time,4);
});
