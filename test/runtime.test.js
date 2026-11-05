import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {archive} from '../src/formats.js';
import {parseSections,parseProgram,FighterRuntime} from '../src/runtime.js';
import {COMMON_STATES} from '../src/common.js';

const encode = source => new TextEncoder().encode(source);
function fixture(cns, cmd = '', animations = null, info = {}) {
  return {
    path:'hero/hero.def', def:{info:{name:'Test fighter',...info}, files:{cns:'hero.cns',cmd:'hero.cmd'}},
    files:{'hero/hero.cns':encode(cns),'hero/hero.cmd':encode(cmd)},
    animations:animations || [{id:0,frames:[{group:0,number:0,x:0,y:0,ticks:-1,flip:''}]},{id:200,frames:[{group:200,number:0,x:0,y:0,ticks:2,flip:''},{group:200,number:1,x:0,y:0,ticks:2,flip:''}]}],
  };
}
const idle = '[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nctrl=1\nanim=0\n';

test('ordered CNS sections preserve duplicate numbered triggers and comments in strings',()=>{
  const sections=parseSections('[State 0, foo]\ntype=VarSet\ntrigger1=1\ntrigger1=0\nvalue="a;b" ; comment','example.cns');
  assert.deepEqual(sections[0].entries.filter(e=>e.key==='trigger1').map(e=>e.value),['1','0']);
  assert.equal(sections[0].values.value,'"a;b"'); assert.equal(sections[0].source,'example.cns');
});

test('triggerall is AND, same numbered triggers are AND, numbered groups are OR',()=>{
  const character=fixture(idle+`
[State 0, rejected group]
type=VarSet
triggerall=1
trigger1=1
trigger1=0
trigger2=1
trigger2=1
v=0
value=7
[State 0, rejected all]
type=VarSet
triggerall=0
trigger1=1
v=1
value=9
`);
  const fighter=new FighterRuntime(character); fighter.tick();
  assert.equal(fighter.vars[0],7);assert.equal(fighter.vars[1],0); assert.equal(fighter.diagnostics.length,0);
});

test('negative states execute in order and ChangeState executes destination time=0 immediately',()=>{
  const character=fixture(idle+`
[Statedef 200]
type=S
movetype=A
physics=N
ctrl=0
anim=200
[State 200, velocity]
type=VelSet
trigger1=time=0
x=3
[State 200, count]
type=VarAdd
trigger1=time=0
v=3
value=1
[Statedef -3]
[State -3, value]
type=VarSet
trigger1=1
v=0
value=3
[Statedef -2]
[State -2, value]
type=VarAdd
trigger1=1
v=0
value=2
`, `[Statedef -1]
[State -1, value]
type=VarAdd
trigger1=1
v=0
value=1
[State -1, attack]
type=ChangeState
trigger1=command="punch"
value=200
`);
  const fighter=new FighterRuntime(character);fighter.tick({commands:new Set(['punch'])});
  assert.equal(fighter.stateNo,200);assert.equal(fighter.vars[0],6);assert.equal(fighter.vars[3],1);
  assert.equal(fighter.pos.x,3); assert.equal(fighter.ctrl,0);
});

test('persistent0 fires once per state entry and persistent2 every second matching execution',()=>{
  const fighter=new FighterRuntime(fixture(idle+`
[State 0, once]
type=VarAdd
trigger1=1
persistent=0
v=0
value=1
[State 0, every other]
type=VarAdd
trigger1=1
persistent=2
v=1
value=1
`));
  for(let i=0;i<5;i++) fighter.tick();
  assert.equal(fighter.vars[0],1);assert.equal(fighter.vars[1],3);
  fighter.changeState(0);fighter.tick();assert.equal(fighter.vars[0],2);
});

test('unknown controllers and triggers produce source diagnostics and do not enable attacks',()=>{
  const fighter=new FighterRuntime(fixture(idle+`
[State 0, unknown controller]
type=ImpossibleController
trigger1=1
[State 0, unknown trigger]
type=LifeSet
trigger1=unsupportedtrigger=0
value=0
`));
  assert.ok(fighter.diagnostics.some(d=>d.type==='unsupported-controller'&&d.source==='hero/hero.cns'));
  fighter.tick();assert.equal(fighter.life,fighter.maxLife);
  assert.ok(fighter.diagnostics.some(d=>d.type==='expression'&&d.message.includes('unsupportedtrigger')));
});

test('integer/float/system variables and constants preserve independent storage',()=>{
  const fighter=new FighterRuntime(fixture(`[Data]\nlife=1234\n[Velocity]\njump.neu=0,-9.25\n`+idle+`
[State 0, integer]
type=VarSet
trigger1=time=0
var(2)=3.9
[State 0, float]
type=VarAdd
trigger1=1
fvar(2)=0.25
[State 0, system]
type=VarSet
trigger1=1
sysvar(1)=9
`));
  fighter.tick();fighter.tick();assert.equal(fighter.maxLife,1234);assert.equal(fighter.vars[2],3);
  assert.equal(fighter.fvars[2],.5);assert.equal(fighter.sysvars[1],9);assert.equal(fighter.constant('velocity.jump.y'),-9.25);
  assert.throws(()=>fighter.assignVariable('var',[60],1),/out of range/);
});

test('animation advances on CNS ticks and AnimTime=0 exits a completed attack',()=>{
  const fighter=new FighterRuntime(fixture(idle+`
[Statedef 200]
type=S
physics=N
movetype=A
ctrl=0
anim=200
[State 200, end]
type=ChangeState
trigger1=animtime=0
value=0
ctrl=1
`));
  fighter.changeState(200);
  assert.equal(fighter.animTime,-4);
  fighter.tick();assert.equal(fighter.frameIndex,0);fighter.tick();assert.equal(fighter.frameIndex,1);
  fighter.tick();fighter.tick();assert.equal(fighter.animTime,0);
  fighter.tick();assert.equal(fighter.stateNo,0);assert.equal(fighter.ctrl,1);
});

test('hitpause freezes physics and time while ignorehitpause controllers still execute',()=>{
  const fighter=new FighterRuntime(fixture(idle+`
[State 0, pause count]
type=VarAdd
trigger1=1
ignorehitpause=1
v=0
value=1
[State 0, normal count]
type=VarAdd
trigger1=1
v=1
value=1
`));
  fighter.vel.x=3;fighter.hitPauseTime=2;fighter.tick();fighter.tick();
  assert.equal(fighter.time,0);assert.equal(fighter.pos.x,0);assert.equal(fighter.vars[0],2);assert.equal(fighter.vars[1],0);
  fighter.tick();assert.equal(fighter.time,1);assert.equal(fighter.pos.x,3);assert.equal(fighter.vars[1],1);
});

test('high-resolution coordinates convert physics and pos/vel triggers consistently',()=>{
  const fighter=new FighterRuntime(fixture(idle+`
[State 0, velocity]
type=VelSet
trigger1=time=0
x=6
[State 0, position]
type=PosSet
trigger1=time=0
y=-40
`, '', null, {localcoord:'640,480'}));
  fighter.tick();assert.equal(fighter.pos.x,3);assert.equal(fighter.pos.y,-20);
  assert.equal(fighter.resolveTrigger('vel x'),6);assert.equal(fighter.resolveTrigger('pos y'),-40);
});

test('HitDef evaluates damage, pause and velocity and receiveHit applies them once per contact',()=>{
  const fighter=new FighterRuntime(fixture(idle+`
[Statedef 200]
type=S
physics=N
movetype=A
anim=200
[State 200, hit]
type=HitDef
trigger1=time=0
attr=S,NA
damage=50,5
pausetime=4,6
ground.velocity=-3,0
guardflag=MA
ground.hittime=12
`), {position:{x:-10,y:0}});
  const victim=new FighterRuntime(fixture(idle),{position:{x:10,y:0},facing:-1,commonText:COMMON_STATES});
  fighter.changeState(200);fighter.tick({opponent:victim});
  const hit=fighter.hitDef;assert.equal(hit.damage[0],50);assert.equal(hit.serial,1);
  const result=victim.receiveHit(hit,fighter);assert.equal(result.damage,50);assert.equal(victim.life,950);
  assert.equal(victim.hitPauseTime,6);assert.equal(fighter.hitPauseTime,4);assert.equal(fighter.moveHit,1);
  assert.equal(victim.getHitVars.xvel,-3);assert.ok(fighter.targets.includes(victim));
});

test('NotHitBy blocks an actual matching attack and allows unmatched attributes',()=>{
  const fighter=new FighterRuntime(fixture(idle+`
[State 0, immunity]
type=NotHitBy
trigger1=1
value=,NA
time=1
`));
  fighter.tick();assert.equal(fighter.canBeHit({attr:'S,NA'}),false);assert.equal(fighter.canBeHit({attr:'S,SA'}),true);
  assert.equal(fighter.receiveHit({attr:'S,NA'},null).rejected,true);
});

test('state-change loops terminate with an actionable diagnostic',()=>{
  const fighter=new FighterRuntime(fixture(idle+`
[State 0, loop]
type=ChangeState
trigger1=1
value=0
`));
  fighter.tick();assert.ok(fighter.diagnostics.some(d=>d.type==='state-loop'));
});

test('character-supplied stcommon overrides fallback and character states override both',()=>{
  const character=fixture(idle);character.def.files.stcommon='custom.cns';
  character.files['hero/custom.cns']=encode('[Statedef 0]\ntype=C\nctrl=0\n[Statedef 777]\ntype=A');
  const program=parseProgram(character,{commonText:'[Statedef 0]\ntype=A'});
  assert.equal(program.states.get(0).values.type,'S');assert.equal(program.states.get(777).values.type,'A');
});

test('bundled KFM executes scripted punch, recovers, walks and jumps via common states',()=>{
  const [character]=archive(new Uint8Array(readFileSync(new URL('../public/kfm.zip',import.meta.url))));
  const fighter=new FighterRuntime(character,{commonText:COMMON_STATES});
  fighter.tick({commands:new Set(['x'])});
  // KFM command names, rather than physical keyboard symbols, reach the CNS.
  if(fighter.stateNo===0)fighter.tick({commands:new Set(['x','a'])});
  assert.equal(fighter.stateNo,200);
  for(let i=0;i<80;i++)fighter.tick();assert.equal(fighter.stateNo,0);
  const x=fighter.pos.x;fighter.tick({commands:new Set(['holdfwd'])});assert.equal(fighter.stateNo,20);assert.ok(fighter.pos.x>x);
  fighter.tick();fighter.tick({commands:new Set(['holdup'])});
  for(let i=0;i<12;i++)fighter.tick();assert.equal(fighter.stateType,'A');assert.ok(fighter.pos.y<0);
});

test('invalid animation-element bottom is false and does not block alternate trigger groups',()=>{
  const fighter=new FighterRuntime(fixture(idle+`
[State 0, alternative]
type=VarSet
trigger1=animelemtime(999)=0
trigger2=1
v=0
value=42
`));
  fighter.tick();assert.equal(fighter.vars[0],42);
  assert.equal(fighter.diagnostics.filter(d=>d.type==='expression').length,0);
});

test('finite animation loops keep AnimElemTime monotonic and honor LoopStart for relative lookup',()=>{
  const animations=[{id:0,loopStart:1,frames:[{ticks:2},{ticks:2},{ticks:2}]}];
  const fighter=new FighterRuntime(fixture(idle,'',animations));
  for(let i=0;i<7;i++)fighter.tick();
  assert.equal(fighter.resolveTrigger('animelemtime',[1]),7);
  assert.equal(fighter.frameIndex,1);
  assert.equal(fighter.resolveTrigger('animelemno',[0]),2);
  assert.equal(fighter.resolveTrigger('animelemno',[-10]),3);
});

test('default-common lookup honors an engine ZIP root prefix',()=>{
  const character=fixture(idle);character.path='mugen/chars/hero/hero.def';
  character.files={'mugen/chars/hero/hero.cns':encode(idle),'mugen/data/common1.cns':encode('[Statedef 999]\ntype=S')};
  character.def.files={cns:'hero.cns',stcommon:'common1.cns'};
  assert.ok(parseProgram(character).states.has(999));
});

test('native guard entry executes common guard state without resetting its time each tick',()=>{
  const character=fixture(idle);const fighter=new FighterRuntime(character,{commonText:COMMON_STATES});
  const opponent=new FighterRuntime(character,{commonText:COMMON_STATES,position:{x:50,y:0},facing:-1});
  opponent.hitDef={attr:'S,NA'};opponent.moveType='A';
  fighter.tick({commands:new Set(['holdback']),opponent});assert.equal(fighter.stateNo,120);
  fighter.tick({commands:new Set(['holdback']),opponent});assert.ok(fighter.time>=2);
});

test('DefenceMulSet scales incoming damage in the native direction',()=>{
  const attacker=new FighterRuntime(fixture(idle));
  const defender=new FighterRuntime(fixture(idle),{commonText:COMMON_STATES});
  defender.defenceMultiplier=.5;
  const hit={attr:'S,NA',damage:[100,0],groundVelocity:[0,0],pauseTime:[0,0],groundHitTime:2,kill:1};
  assert.equal(defender.receiveHit(hit,attacker).damage,50);
  defender.defenceMultiplier=0;assert.equal(defender.receiveHit(hit,attacker).damage,0);
});

test('failed HitDef replacement clears the previous attack and missing throw destinations fail closed on contact',()=>{
  const fighter=new FighterRuntime(fixture(idle+`
[State 0, original]
type=HitDef
trigger1=time=0
attr=S,NA
damage=10
[State 0, failed replacement]
type=HitDef
trigger1=time=1
attr=S,NA
damage=unknowntrigger
[State 0, foreign throw]
type=HitDef
trigger1=time=2
attr=S,NT
p1stateno=810
p2stateno=820
damage=100
`));
  fighter.tick();assert.equal(fighter.hitDef.damage[0],10);
  fighter.tick();assert.equal(fighter.hitDef,null);
  fighter.tick();assert.equal(fighter.hitDef.p2stateno,820);
  const victim=new FighterRuntime(fixture(idle));
  assert.equal(victim.receiveHit(fighter.hitDef,fighter).rejected,true);assert.equal(victim.life,victim.maxLife);
});

test('Width front/back and shared value follow native parameter order',()=>{
  const fighter=new FighterRuntime(fixture(idle+`
[State 0, width]
type=Width
trigger1=1
value=7,11
player=13,17
`));fighter.tick();
  assert.deepEqual(fighter.width,{front:13,back:17,edge:[7,11]});
});
