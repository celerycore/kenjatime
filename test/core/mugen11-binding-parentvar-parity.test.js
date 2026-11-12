import {test} from 'node:test';
import assert from 'node:assert/strict';
import {TrainingMatch} from '../../src/combat.js';
import {parseSections} from '../../src/runtime.js';
import {captureLegacyTraceTick} from '../../src/core/legacy-compatibility.js';

const encode=s=>new TextEncoder().encode(s);
const animation={id:0,frames:[{group:0,number:0,x:0,y:0,ticks:-1,clsn1:[],clsn2:[]}]};
function character(name,extra=''){
  const source=`[Statedef 0]
type=S
movetype=I
physics=N
anim=0
ctrl=0
[Statedef 1800]
type=S
movetype=I
physics=N
anim=0
ctrl=0
${extra}`;
  return {path:name+'.def',def:{info:{name,mugenversion:'1.1'},files:{cns:name+'.cns'}},
    files:{[name+'.cns']:encode(source)},animations:[animation]};
}
function fixture(){
  const a=character('attacker'),b=character('victim');
  return new TrainingMatch(a,{opponentCharacter:b,initialize:false,orderedPhases:true,pushboxes:false});
}
function execute(actor,type,parameters=''){
  const section=parseSections(`[State Test]
type = ${type}
trigger1 = 1
${parameters}
`)[0];
  actor.execute({...section,type:type.toLowerCase()});
}

test('MUGEN 1.1 BindToParent time=0 releases an existing helper binding',()=>{
  const m=fixture(),parent=m.spawnHelper(m.player,{id:100,stateno:1800});
  const child=m.spawnHelper(parent,{id:101,stateno:1800});
  assert.ok(parent&&!parent.destroyed&&child&&!child.destroyed);
  execute(child,'BindToParent','time=-1\nface=1\npos=12,-8');
  assert.equal(child.bound?.target,parent);
  parent.pos.x=45;parent.pos.y=-25;child.updateBinding();
  assert.equal(child.pos.x,45+12*parent.facing);
  assert.equal(child.pos.y,-33);
  assert.equal(child.bound.time,-1);
  execute(child,'BindToParent','time=0');
  assert.equal(child.bound,null,'zero duration cannot become permanent');
  const before={...child.pos};
  parent.pos.x+=55;parent.pos.y+=10;child.updateBinding();
  assert.deepEqual(child.pos,before,'released helper must not follow parent');
});

test('BindToRoot and BindToTarget support zero-time release without continuing to follow',()=>{
  const m=fixture();
  const p=m.spawnHelper(m.player,{id:110,stateno:1800});
  const child=m.spawnHelper(p,{id:111,stateno:1800});
  execute(child,'BindToRoot','time=2\npos=5,-3\nfacing=-1');
  assert.equal(child.bound?.target,m.player);
  m.player.pos.x=10;m.player.pos.y=-20;child.updateBinding();
  assert.equal(child.bound?.time,1);
  assert.equal(child.pos.x,10+5*m.player.facing);
  child.updateBinding();
  assert.equal(child.bound,null,'two-tick binding expires precisely');

  // BindToTarget uses the executing helper's target list and matching hit ID.
  child.targets=[m.opponent];child.targetHitIds.set(m.opponent.id,55);
  execute(child,'BindToTarget','time=-1\nid=55\npos=2,4,Foot');
  assert.equal(child.bound?.target,m.opponent);
  execute(child,'BindToTarget','time=0\nid=55');
  assert.equal(child.bound,null);
});

test('TargetBind time=0 releases previous victim binding',()=>{
  const m=fixture(),a=m.player,b=m.opponent;
  a.targets=[b];a.targetHitIds.set(b.id,7);
  execute(a,'TargetBind','id=7\ntime=10\npos=20,-15');
  assert.equal(b.bound?.target,a);
  execute(a,'TargetBind','id=7\ntime=0');
  assert.equal(b.bound,null);
});

test('ParentVarSet and ParentVarAdd use immediate parent, never root, for nested helpers',()=>{
  const m=fixture();
  const p=m.spawnHelper(m.player,{id:401,stateno:1800});
  const c=m.spawnHelper(p,{id:402,stateno:1800});
  execute(c,'ParentVarSet','v=6\nvalue=11');
  assert.equal(p.vars[6],11);
  assert.equal(m.player.vars[6],0);
  execute(c,'ParentVarAdd','v=6\nvalue=4');
  assert.equal(p.vars[6],15);
  execute(c,'ParentVarSet','fv=1\nvalue=1.25');
  assert.equal(p.fvars[1],Math.fround(1.25));
});

test('ParentVarSet/Add rejects system-variable writes without partially applying other assignments',()=>{
  const m=fixture();
  const p=m.spawnHelper(m.player,{id:501,stateno:1800});
  const c=m.spawnHelper(p,{id:502,stateno:1800});
  p.vars[2]=30;p.sysvars[0]=123;p.sysfvars[0]=3.5;
  execute(c,'ParentVarSet','sysv=0\nvalue=88');
  execute(c,'ParentVarAdd','sysfv=0\nvalue=7');
  assert.equal(p.sysvars[0],123);
  assert.equal(p.sysfvars[0],Math.fround(3.5));
  const mixed=parseSections(`[State Test]
type=ParentVarSet
trigger1=1
var(2)=99
sysvar(0)=55`)[0];
  c.execute({...mixed,type:'parentvarset'});
  assert.equal(p.vars[2],30,'mixed forbidden controller must not partially overwrite parent vars');
  assert.equal(p.sysvars[0],123);
  assert.ok(c.diagnostics.some(d=>d.type==='mugen11-parentvar-system'));
  // Root characters cannot use the parent-only controller.
  execute(m.player,'ParentVarSet','v=2\nvalue=9');
  assert.equal(m.player.vars[2],0);
});

test('DestroySelf recursive=0 preserves nested helper but unbinds it; recursive=1 destroys descendants',()=>{
  const m=fixture(),a=m.spawnHelper(m.player,{id:601,stateno:1800});
  const b=m.spawnHelper(a,{id:602,stateno:1800});
  execute(b,'BindToParent','time=-1');
  assert.equal(b.bound?.target,a);
  execute(a,'DestroySelf','recursive=0');
  assert.equal(a.destroyed,true);
  assert.equal(b.destroyed,false);
  assert.equal(b.bound,null,'all bound children must be detached immediately');
  assert.equal(m.player.resolveTrigger('numhelper',[602]),1);
  const c=m.spawnHelper(m.player,{id:603,stateno:1800});
  const d=m.spawnHelper(c,{id:604,stateno:1800});
  execute(c,'DestroySelf','recursive=1');
  assert.equal(c.destroyed,true);
  assert.equal(d.destroyed,true);
  m.cleanupEntities();
  assert.equal(m.helperStats.destroyed,3);
  const trace=captureLegacyTraceTick(m);
  assert.ok(trace.actors.some(x=>x.id===b.id&&x.parentId===a.id),
    'surviving nested helper retains identity of removed parent');
});
