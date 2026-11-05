import {test} from 'node:test';
import assert from 'node:assert/strict';
import {TrainingMatch} from '../src/combat.js';
import {evaluateExpression} from '../src/expressions.js';

const idle = '[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nctrl=0\nanim=0\n';
const frame = (attack = false,ticks = -1,number = 0) => ({group:0,number,x:0,y:0,ticks,flip:'',clsn1:attack?[[0,-40,40,0]]:[],clsn2:[[-10,-40,10,0]]});
function character(script = '', name = 'source', extra = []) {
  return {path:`${name}.def`,def:{info:{name},files:{cns:`${name}.cns`}},files:{[`${name}.cns`]:new TextEncoder().encode(idle+script)},animations:[{id:0,frames:[frame()]},{id:100,frames:[frame(true)]},{id:101,frames:[frame(false,2),frame(false,2,1)]},...extra]};
}
function world(script = '',options = {}) { return new TrainingMatch(character(script),{pushboxes:false,...options}); }
function run(match,ticks) { for (let i=0;i<ticks;i++) match.tick(); }
const helper = `
[State 0, helper]
type=Helper
trigger1=time=0
id=77
stateno=500
pos=20,0
[Statedef 500]
type=S
physics=N
anim=100
[State 500, parent]
type=ParentVarAdd
trigger1=time=0
v=0
value=3
[State 500, own]
type=VarSet
trigger1=time=0
v=0
value=9
[State 500, gone]
type=DestroySelf
trigger1=time=3
`;

test('Helper has independent variables, live parent/root redirection and a unique player identity',()=>{
  const match=world(helper,{opponentCharacter:character()}); match.tick();
  const child=match.player.helpers[0]; assert.ok(child);
  assert.equal(match.entities.length,3); assert.equal(child.parent,match.player); assert.equal(child.root,match.player);
  assert.equal(child.pos.x,-50); assert.equal(child.vars[0],9); assert.equal(match.player.vars[0],3);
  assert.equal(match.player.resolveTrigger('numhelper',[77]),1); assert.equal(child.resolveTrigger('ishelper',[77]),1);
  assert.equal(child.evaluate('parent, var(0)'),3); assert.equal(child.evaluate('root, var(0)'),3);
  assert.equal(match.player.evaluate(`playerid(${child.id}), ishelper(77)`),1);
  assert.equal(match.player.evaluate('helper(77), var(0)'),9);
  assert.equal(child.evaluate('parentdist x'),-20);
  run(match,3); assert.equal(match.player.resolveTrigger('numhelper'),0); assert.equal(match.findPlayer(child.id),undefined);
  assert.equal(match.entities.length,2); assert.equal(match.player.vars[0],3);
});

test('Helper attacks enter ordinary collision combat once per target without inheriting root negative states',()=>{
  const script=helper.replace('pos=20,0','pos=0,0').replace('[State 500, parent]',`movetype=A
[State 500, attack]
type=HitDef
trigger1=time=0
attr=S,NA
damage=25
[State 500, parent]`)+`
[Statedef -2]
[State -2, root only]
type=VarAdd
trigger1=1
v=1
value=1
`;
  const match=world(script,{opponentCharacter:character()}); match.player.pos.x=-15; match.opponent.pos.x=15;
  assert.equal(match.tick().length,1); assert.equal(match.opponent.life,975);
  assert.equal(match.player.vars[1],1); assert.equal(match.player.helpers[0].vars[1],0);
  run(match,3); assert.equal(match.opponent.life,975);
});

test('Helper resource limits stop recursive creation and leave actionable diagnostics',()=>{
  const script=`[State 0, child]\ntype=Helper\ntrigger1=time=0\nstateno=500\n[Statedef 500]\n[State 500, child]\ntype=Helper\ntrigger1=time=0\nstateno=500`;
  const match=world(script,{maxHelpers:4,opponentCharacter:character()}); match.tick();
  assert.equal(match.entities.length,6); assert.ok(match.diagnostics.some(d=>d.type==='resource-limit'));
  match.reset(); assert.equal(match.entities.length,2);
});

test('TargetState executes the attacker CNS and AIR, then SelfState restores the victim own state program',()=>{
  const source=character(`
[State 0, take target]
type=TargetState
trigger1=time=0
value=900
[Statedef 900]
type=A
movetype=H
physics=N
[State 900, anim]
type=ChangeAnim2
trigger1=time=0
value=900
[State 900, own variable]
type=VarSet
trigger1=time=0
v=5
value=42
[State 900, restore]
type=SelfState
trigger1=time=2
value=0
`, 'thrower',[{id:900,frames:[frame(false,-1,8)]}]);
  const victim=character('','victim'); const match=new TrainingMatch(source,{opponentCharacter:victim,pushboxes:false});
  match.player.targets.push(match.opponent); match.tick();
  assert.equal(match.opponent.stateNo,900); assert.equal(match.opponent.stateOwner,match.player);
  assert.equal(match.opponent.animationOwner,match.player); assert.equal(match.opponent.currentFrame.number,8);
  assert.equal(match.opponent.character,victim); assert.equal(match.opponent.vars[5],42); assert.equal(match.player.vars[5],0);
  run(match,2); assert.equal(match.opponent.stateNo,0); assert.equal(match.opponent.stateOwner,match.opponent);
  assert.equal(match.opponent.animationOwner,match.opponent);
});

test('HitDef throw transfers the target to foreign states instead of inflicting an ordinary substitute hit',()=>{
  const source=character(`
[Statedef 200]
type=S
movetype=A
physics=N
anim=100
[State 200, throw]
type=HitDef
trigger1=time=0
attr=S,NT
damage=0
p1stateno=810
p2stateno=820
[Statedef 810]
type=S
physics=N
[State 810, damage]
type=TargetLifeAdd
trigger1=time=1
value=-70
[Statedef 820]
type=A
physics=N
movetype=H
`, 'thrower');
  const match=new TrainingMatch(source,{opponentCharacter:character(),pushboxes:false}); match.player.pos.x=-15;match.opponent.pos.x=15;
  match.player.changeState(200); assert.equal(match.tick().length,1);
  assert.equal(match.player.stateNo,810); assert.equal(match.opponent.stateNo,820); assert.equal(match.opponent.stateOwner,match.player);
  run(match,2); assert.equal(match.opponent.life,930);
});

const projectile = `
[Statedef 200]
type=S
physics=N
movetype=A
[State 200, projectile]
type=Projectile
trigger1=time=0
projid=123
projanim=100
offset=20,0
velocity=5,0
attr=S,NP
damage=40,5
guardflag=MA
ground.hittime=0
`;

test('Projectile moves, hits through its AIR boxes, removes and retains native contact-time history',()=>{
  const match=world(projectile,{opponentCharacter:character()});match.player.pos.x=-30;match.opponent.pos.x=50;match.player.changeState(200);
  match.tick(); assert.equal(match.player.resolveTrigger('numprojid',[123]),1);
  const p=match.projectiles[0];assert.equal(p.pos.x,-5);assert.equal(p.owner,match.player);
  let contacts=[];for(let i=0;i<15;i++){contacts=match.tick();if(contacts.length)break;}
  assert.equal(contacts.length,1);assert.equal(match.opponent.life,960);assert.equal(match.player.resolveTrigger('numproj'),0);
  assert.equal(match.player.resolveTrigger('projhittime',[123]),1);assert.equal(match.player.evaluate('ProjHit123 = 1'),1);
  assert.equal(match.player.evaluate('ProjContact123 = 1, < 15'),1);assert.equal(match.player.evaluate('ProjGuarded123 = 1'),0);
  match.tick();assert.equal(match.player.evaluate('ProjHit123 = 1'),0);assert.equal(match.player.evaluate('ProjHit123 = 1, < 15'),1);
  assert.equal(match.player.moveHit,0);assert.ok(match.player.power>0);
});

test('Projectile lifetime, removal animation and high-resolution/facing movement are deterministic',()=>{
  const match=world('',{opponentCharacter:character()});const owner=match.player;owner.facing=-1;owner.coordinateScale=.5;
  const p=match.spawnProjectile(owner,{projid:9,projanim:100,projremanim:101,projremovetime:2,velocity:[4,0],hitDef:null});
  const start=p.pos.x; run(match,2);assert.equal(p.pos.x,start-4);assert.equal(p.removing,false);
  match.tick();assert.equal(p.removing,true);assert.equal(p.anim,101);run(match,4);assert.ok(p.removed);assert.equal(match.projectiles.length,0);
});

test('Opposing projectile priorities cancel lower projectiles and preserve cancellation-time queries',()=>{
  const match=world('',{opponentCharacter:character()});
  const a=match.spawnProjectile(match.player,{projid:1,projanim:100,projpriority:2,offset:[70,0],hitDef:null});
  const b=match.spawnProjectile(match.opponent,{projid:2,projanim:100,projpriority:1,offset:[70,0],hitDef:null});
  match.tick();assert.equal(b.removed,true);assert.equal(a.removed,false);assert.equal(a.priority,1);
  assert.equal(match.opponent.resolveTrigger('projcanceltime',[2]),1);
});

test('Pause freezes both fighters for its duration, honoring owner movetime and end command buffering',()=>{
  const script=`
[Statedef 200]
physics=N
[State 200, pause]
type=Pause
trigger1=time=0
time=3
movetime=1
endcmdbuftime=1
[Statedef -1]
[State -1, input]
type=VarAdd
trigger1=command="test"
v=3
value=1
`;
  const match=world(script,{opponentCharacter:character(script)});match.player.changeState(200);match.tick();
  assert.equal(match.pause.remaining,3);run(match,2);
  assert.equal(match.player.time,2);assert.equal(match.opponent.time,1);
  match.tick(new Set(),new Set(['test']));assert.equal(match.opponent.vars[3],0);
  match.tick();assert.equal(match.opponent.time,2);assert.equal(match.opponent.vars[3],1);
});

test('SuperPause preempts Pause, preserves its remaining time and grants explicit helper movement allowances',()=>{
  const match=world('',{opponentCharacter:character()});
  const child=match.spawnHelper(match.player,{stateno:0,supermovetime:1,id:5});
  match.requestPause(match.player,{type:'pause',time:4,movetime:0});match.tick();
  match.requestPause(match.player,{type:'superpause',time:2,movetime:0,unhittable:1});match.tick();
  const parentTime=match.player.time,childTime=child.time;
  assert.equal(match.pause.remaining,3);assert.equal(match.isSuperUnhittable(match.player),true);
  run(match,2);assert.equal(match.player.time,parentTime);assert.equal(child.time,childTime+1);assert.equal(match.pause.remaining,3);
  match.tick();assert.equal(match.pause.remaining,2);assert.equal(match.player.time,parentTime);
});

test('Legacy projectile expressions distinguish single-tick contact, windows, zero and missing histories',()=>{
  const context={resolve:(name,args)=>name==='projhittime'&&args[0]===5?3:-1};
  assert.equal(evaluateExpression('ProjHit5 = 1',context),0);
  assert.equal(evaluateExpression('ProjHit5 = 1, < 5',context),1);
  assert.equal(evaluateExpression('ProjHit9 = 0, < 5',context),1);
});

test('Helpers share root power without resetting it on creation and recursive DestroySelf removes descendants',()=>{
  const match=world('',{opponentCharacter:character()});match.player.power=900;
  const parent=match.spawnHelper(match.player,{stateno:0,id:1}),child=match.spawnHelper(parent,{stateno:0,id:2});
  assert.equal(parent.power,900);child.power+=100;assert.equal(match.player.power,1000);
  parent.execute({type:'destroyself',values:{recursive:'1'},entries:[]});match.tick();
  assert.equal(match.entities.length,2);assert.equal(match.findPlayer(child.id),undefined);
});

test('ReversalDef intercepts matching attack boxes and executes counter/foreign target states',()=>{
  const source=character(`
[Statedef 200]
type=S
movetype=A
anim=100
[State 200, normal]
type=HitDef
trigger1=time=0
attr=S,NA
damage=60
[Statedef 300]
type=S
movetype=A
anim=100
[State 300, counter]
type=ReversalDef
trigger1=time=0
reversal.attr=SCA,NA,SA
p1stateno=310
p2stateno=320
[Statedef 310]
type=S
movetype=A
[Statedef 320]
type=S
movetype=H
`);
  const match=new TrainingMatch(source,{pushboxes:false});match.player.pos.x=-15;match.opponent.pos.x=15;
  match.player.changeState(200);match.opponent.changeState(300);
  assert.equal(match.tick()[0].type,'reversal');assert.equal(match.opponent.life,1000);
  assert.equal(match.opponent.stateNo,310);assert.equal(match.player.stateNo,320);assert.equal(match.player.stateOwner,match.opponent);
  assert.equal(match.player.moveReversed,1);
});

test('SuperPause applies target defence temporarily and a helper created mid-pause receives its own move allowance',()=>{
  const match=world('',{opponentCharacter:character()});match.player.targets.push(match.opponent);
  match.requestPause(match.player,{type:'superpause',time:5,movetime:5,p2defmul:2,poweradd:50});match.tick();
  assert.equal(match.opponent.defenceMultiplier,.5);assert.equal(match.player.power,50);
  run(match,2);const helper=match.spawnHelper(match.player,{stateno:0,supermovetime:1});
  match.tick();assert.equal(helper.time,1);match.tick();assert.equal(helper.time,1);match.tick();
  assert.equal(match.opponent.defenceMultiplier,1);
});

test('RemapPal source mapping follows shared helper palettes while ownpal keeps its creation snapshot',()=>{
  const match=world('',{opponentCharacter:character()});
  match.player.execute({type:'remappal',values:{source:'1,1',dest:'1,2'},entries:[]});
  const shared=match.spawnHelper(match.player,{stateno:0}),independent=match.spawnHelper(match.player,{stateno:0,ownpal:1});
  match.player.execute({type:'remappal',values:{source:'1,1',dest:'1,3'},entries:[]});
  assert.deepEqual(shared.paletteRemaps.get('1,1'),[1,3]);assert.deepEqual(independent.paletteRemaps.get('1,1'),[1,2]);
  match.player.execute({type:'remappal',values:{source:'1,1',dest:'1,1'},entries:[]});assert.equal(shared.paletteRemaps.size,0);
});

test('Round initialization runs state5900 before inputs and skips only the standard intro in training',()=>{
  const source=character(`
[Statedef 5900]
type=S
[State 5900, initialize]
type=VarSet
trigger1=time=0
v=4
value=123
[State 5900, intro]
type=ChangeState
trigger1=1
value=190
[Statedef 190]
type=S
ctrl=0
[State 190, intro marker]
type=VarSet
trigger1=time=0
v=5
value=1
[Statedef -2]
[State -2, global setup]
type=VarSet
trigger1=gametime=0
v=6
value=88
`);
  const match=new TrainingMatch(source);assert.equal(match.player.stateNo,5900);match.tick();
  assert.equal(match.player.vars[4],123);assert.equal(match.player.vars[5],0);assert.equal(match.player.vars[6],88);assert.equal(match.player.stateNo,0);assert.equal(match.player.ctrl,1);
  const intro=new TrainingMatch(source,{skipIntro:false});intro.tick();assert.equal(intro.player.vars[5],1);assert.equal(intro.player.stateNo,190);
});

test('Projectile targets remain attached to root ownership and TargetDrop honors excludeID/keepone',()=>{
  const match=world(projectile,{opponentCharacter:character()});match.player.pos.x=-30;match.opponent.pos.x=50;match.player.changeState(200);
  run(match,12);assert.ok(match.player.targets.includes(match.opponent));
  const child=match.spawnHelper(match.opponent,{stateno:0,id:8});match.player.targets.push(child);
  match.player.targetHitIds.set(match.opponent.id,5);match.player.targetHitIds.set(child.id,6);
  assert.equal(match.player.resolveTrigger('numtarget',[5]),1);
  match.player.execute({type:'targetdrop',values:{excludeid:'6',keepone:'0'},entries:[]});
  assert.deepEqual(match.player.targets,[child]);assert.equal(match.player.resolveTrigger('numtarget',[5]),0);
});
