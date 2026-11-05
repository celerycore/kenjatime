import {test} from 'node:test';
import assert from 'node:assert/strict';
import {TrainingMatch} from '../src/combat.js';
import {COMMON_STATES} from '../src/common.js';
import {parseSections} from '../src/runtime.js';
import {CommandBuffer} from '../src/commands.js';
import {characterCommands} from '../src/cpu.js';
import {EffectsState,transformRgba} from '../src/effects.js';
import {sampleFighterAnimation} from '../src/rendering.js';

const bytes=text=>new TextEncoder().encode(text);
const frame=(number=0,ticks=-1,attack=false,hurt=true)=>({group:0,number,x:0,y:0,ticks,clsn1:attack?[[-12,-40,12,0]]:[],clsn2:hurt?[[-10,-40,10,0]]:[]});
function character(script='',cmd=''){
  return{path:'c.def',def:{info:{name:'Entity edge fixture'},files:{cns:'c.cns',cmd:'c.cmd'}},files:{'c.cns':bytes(`[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nctrl=0\nanim=0\n${script}`),'c.cmd':bytes(cmd)},animations:[{id:0,frames:[frame()]},{id:100,frames:[frame(10,-1,true)]},{id:101,frames:[frame(31,1,true),frame(32,1,true)]},{id:102,frames:[frame(40,1)]},{id:103,frames:[frame(50,2)]}]};
}
function world(script='',options={}){return new TrainingMatch(character(script),{commonText:COMMON_STATES,pushboxes:false,...options});}
function execute(actor,type,parameters=''){actor.execute({...parseSections(`[State Test]\ntype=${type}\n${parameters}`)[0],type:type.toLowerCase()});}
function shot(w,extra=''){
  w.player.pos.x=-20;w.opponent.pos.x=20;
  execute(w.player,'Projectile',`projanim=100\noffset=40,0\nattr=S,NP\ndamage=10\nground.hittime=0\nground.velocity=0,0\nsparkno=-1\n${extra}`);return w.projectiles.at(-1);
}
const helperState='[Statedef 300]\ntype=S\nmovetype=I\nphysics=N\nctrl=0\nanim=0\n';

test('DestroySelf stops the remaining controllers and movement in the same activation',()=>{
  const w=world(helperState+'[State Die]\ntype=DestroySelf\ntrigger1=1\n[State Must not execute]\ntype=VarSet\ntrigger1=1\nv=0\nvalue=99\n');
  const h=w.spawnHelper(w.player,{stateno:300});h.vel.x=4;const x=h.pos.x;w.tick();assert.equal(h.vars[0],0);assert.equal(h.pos.x,x);assert.equal(w.findPlayer(h.id),undefined);
});

test('default DestroySelf orphans Explods, detaches their anchor and preserves every last animation frame',()=>{
  const script=helperState+'[State Visual]\ntype=Explod\ntrigger1=Time=0\nanim=101\nid=7\npos=12,-8\nbindtime=-1\n[State Die]\ntype=DestroySelf\ntrigger1=Time=0\n';
  const w=world(script),h=w.spawnHelper(w.player,{stateno:300,pos:[20,0]});w.tick();
  assert.equal(w.player.resolveTrigger('numhelper'),0);assert.equal(w.player.resolveTrigger('numexplod'),0);assert.equal(w.orphanEffectOwners.length,1);
  const e=w.orphanEffectOwners[0].drawExplods[0];assert.deepEqual(e.pos,{x:h.pos.x+12,y:-8});assert.equal(e.bindtime,0);assert.equal(e.frameIndex,0);assert.equal(e.orphaned,true);
  w.player.pos.x+=100;w.tick();assert.equal(w.orphanEffectOwners[0].drawExplods[0].frameIndex,1);assert.deepEqual(w.orphanEffectOwners[0].drawExplods[0].pos,e.pos);
  w.tick();assert.equal(w.orphanEffectOwners.length,0);assert.equal(w.renderEntities.length,2);
});

test('DestroySelf removeexplods removes both current and staged effects',()=>{
  const w=world(helperState),h=w.spawnHelper(w.player,{stateno:300});execute(h,'Explod','anim=0\nbindtime=-1\nremovetime=-1');w.tick();assert.equal(h.drawExplods.length,1);
  execute(h,'DestroySelf','removeexplods=1');w.tick();assert.equal(h.explods.length,0);assert.equal(h.drawExplods.length,0);assert.equal(w.orphanEffectOwners.length,0);
});

test('recursive destruction respects removeexplods and does not destroy unrelated helpers',()=>{
  for(const remove of [0,1]){const w=world(helperState),a=w.spawnHelper(w.player,{stateno:300}),b=w.spawnHelper(a,{stateno:300}),other=w.spawnHelper(w.player,{stateno:300});
    for(const actor of [a,b,other])execute(actor,'Explod','anim=0\nremovetime=10');
    execute(a,'DestroySelf',`recursive=1\nremoveexplods=${remove}`);w.tick();assert.deepEqual(w.entities.map(p=>p.id),[1,2,other.id]);assert.equal(w.orphanEffectOwners.length,remove?0:2);assert.equal(other.explods.length,1);
  }
});

test('orphan Explods have independent global-pause allowances and release their holders after reset',()=>{
  const w=world(helperState),h=w.spawnHelper(w.player,{stateno:300});execute(h,'Explod','anim=0\nremovetime=6\npausemovetime=1');execute(h,'DestroySelf');
  w.requestPause(w.player,{type:'pause',time:3,movetime:0});w.tick();const e=h.explods[0],before=e.time;w.tick();assert.equal(e.time,before+1);w.tick();assert.equal(e.time,before+1);w.tick();assert.equal(e.time,before+1);w.tick();assert.equal(e.time,before+2);
  w.reset();assert.equal(w.orphanEffectOwners.length,0);assert.equal(w.drawProjectiles.length,0);
});

test('DestroySelf unbinds another player and another owner Explod immediately',()=>{
  const w=world(helperState),h=w.spawnHelper(w.player,{stateno:300}),child=w.spawnHelper(h,{stateno:300});execute(child,'BindToParent','time=-1\npos=10,-4');
  execute(w.player,'Explod',`space=stage\nbindid=${h.id}\nbindtime=-1\npos=8,-6\nanim=0\nremovetime=-1`);w.tick();const e=w.player.explods[0],pos={...e.pos};
  execute(h,'DestroySelf');assert.equal(child.bound,null);assert.equal(e.bindtime,0);assert.equal(e.bindingTarget,null);w.tick();assert.deepEqual(e.pos,pos);assert.equal(w.player.resolveTrigger('numhelper'),1);
  execute(child,'BindToParent','time=-1');assert.equal(child.bound,null);assert.deepEqual(w.diagnostics,[]);
});

test('BindToParent and BindToRoot are no-ops for root players, as documented',()=>{
  const w=world(),pos={...w.player.pos};for(const type of ['BindToParent','BindToRoot'])execute(w.player,type,'time=-1\npos=100,20');w.tick();assert.deepEqual(w.player.pos,pos);assert.equal(w.player.bound,null);assert.deepEqual(w.diagnostics,[]);
});

test('an orphan helper cannot read a destroyed parent or change its variables, but retains its live root',()=>{
  const w=world(helperState),a=w.spawnHelper(w.player,{stateno:300}),b=w.spawnHelper(a,{stateno:300});a.vars[0]=7;execute(a,'DestroySelf');w.tick();
  assert.throws(()=>b.resolveTrigger('parentdist x'),e=>e.bottom);assert.throws(()=>b.evaluate('parent,var(0)'),e=>e.bottom);execute(b,'ParentVarAdd','v=0\nvalue=9');assert.equal(a.vars[0],7);
  assert.equal(b.evaluate('root,id'),1);assert.ok(Number.isFinite(b.resolveTrigger('rootdist x')));assert.throws(()=>w.player.resolveTrigger('rootdist x'),e=>e.bottom);
  w.player.life=0;assert.throws(()=>{const child=w.spawnHelper(w.player,{stateno:300});child.resolveTrigger('parentdist x');},e=>e.bottom);
});

test('shared parent palette effects survive destruction while independent children release unused parents',()=>{
  const fx=new EffectsState(),parent={ownPal:true},child={parent},independent={parent,ownPal:true};fx.consume([{type:'palfx',time:5,add:[40,0,0]}],{entity:parent});
  fx.cleanup([child]);assert.equal(fx.paletteFor(child).layers.length,1);assert.equal(transformRgba(new Uint8ClampedArray([10,20,30,255]),fx.paletteFor(child))[0],50);
  fx.cleanup([independent]);assert.equal(fx.palettes.has(parent),false);
});

test('helper keyctrl reads physical input in its own facing and inherits the root State -1 only when enabled',()=>{
  const commands='[Command]\nname="holdfwd"\ncommand=/F\n[Command]\nname="holdback"\ncommand=/B\n';
  const c=character(helperState+'[Statedef -1]\n[State Forward]\ntype=VarAdd\ntrigger1=command="holdfwd"\nv=0\nvalue=1\n[State Back]\ntype=VarAdd\ntrigger1=command="holdback"\nv=1\nvalue=1',commands),w=new TrainingMatch(c,{commonText:COMMON_STATES,pushboxes:false});
  const on=w.spawnHelper(w.player,{stateno:300,facing:-1,keyctrl:1}),off=w.spawnHelper(w.player,{stateno:300,facing:-1,keyctrl:0}),raw=new Set(['R']),buffer=new CommandBuffer(characterCommands(c));
  w.tick(buffer.update(raw,w.player.facing),new Set(),{playerInput:raw});assert.equal(w.player.vars[0],1);assert.equal(on.vars[0],0);assert.equal(on.vars[1],1);assert.equal(off.vars[1],0);assert.deepEqual([...on.commands],['holdback']);
  execute(on,'DestroySelf');w.tick();assert.equal(w.helperCommands.size,0);
});

test('a controlled helper can guard using its own facing when its root sees forward input',()=>{
  const c=character(helperState.replace('ctrl=0','ctrl=1'),'[Command]\nname="holdfwd"\ncommand=/F\n[Command]\nname="holdback"\ncommand=/B'),w=new TrainingMatch(c,{commonText:COMMON_STATES,pushboxes:false});
  const h=w.spawnHelper(w.player,{stateno:300,facing:-1,keyctrl:1});h.pos.x=0;w.opponent.pos.x=-10;w.opponent.facing=1;w.opponent.moveType='A';w.opponent.changeAnimation(100);
  execute(w.opponent,'HitDef','attr=S,NA\ndamage=10,1\nguardflag=MA\nground.velocity=0,0\nsparkno=-1');const raw=new Set(['R']),buffer=new CommandBuffer(characterCommands(c));const contacts=w.tick(buffer.update(raw,w.player.facing),new Set(),{playerInput:raw});assert.equal(contacts.length,1);assert.equal(contacts[0].guarded,true);assert.equal(h.life,999);
});

test('normal helpers can leave the screen, while explicit ScreenBound constrains them by their size',()=>{
  const w=world(helperState+'[State Bound]\ntype=ScreenBound\ntrigger1=1\nvalue=1'),bounded=w.spawnHelper(w.player,{stateno:300}),free=w.spawnHelper(w.player,{stateno:0});bounded.pos.x=1000;free.pos.x=1000;w.tick();assert.equal(free.pos.x,1000);assert.equal(bounded.pos.x,w.horizontalLimits(bounded).max);
});

test('default projectile removal waits for the complete hit quota',()=>{
  const w=world(),p=shot(w,'projhits=3');for(let i=0;i<3;i++){assert.equal(w.tick().length,1);assert.equal(w.opponent.life,990-i*10);assert.equal(p.remainingHits,2-i);if(i<2)assert.equal(w.projectiles.length,1);}
  assert.equal(w.projectiles.length,0);assert.equal(w.player.resolveTrigger('numproj'),0);
});

test('projremove=0 retains an exhausted projectile without allowing additional damage',()=>{
  const w=world(),p=shot(w,'projhits=2\nprojremove=0\nprojremovetime=12');w.tick();w.tick();for(let i=0;i<6;i++)assert.equal(w.tick().length,0);assert.equal(w.opponent.life,980);assert.equal(p.remainingHits,0);assert.equal(w.player.resolveTrigger('numproj'),1);
  for(let i=0;i<8;i++)w.tick();assert.equal(w.player.resolveTrigger('numproj'),0);
});

test('a zero-hit projectile is visible and can cancel a projectile without attacking a player',()=>{
  const w=world(),p=shot(w,'projhits=0\nprojremove=0');assert.equal(w.tick().length,0);assert.equal(w.opponent.life,1000);assert.ok(w.drawProjectiles.includes(p));
  const other=w.spawnProjectile(w.opponent,{projanim:100,offset:[0,0],hitDef:null});w.tick();assert.equal(p.removed,true);assert.equal(other.removed,true);
});

test('projectile hit spacing freezes during attacker hitpause',()=>{
  const w=world(),p=shot(w,'projhits=3\nprojremove=0\nprojmisstime=2\npausetime=2,2');assert.equal(w.tick().length,1);const age=p.activeTicks;
  for(let i=0;i<2;i++){assert.equal(w.tick().length,0);assert.equal(p.activeTicks,age);}
  assert.equal(w.tick().length,0);assert.equal(w.tick().length,0);assert.equal(w.tick().length,1);assert.equal(w.opponent.life,980);
});

test('projectile hit spacing also freezes during a global Pause',()=>{
  const w=world(),p=shot(w,'projhits=3\nprojremove=0\nprojmisstime=2');w.tick();w.requestPause(w.player,{type:'pause',time:3,movetime:0});w.tick();const age=p.activeTicks;
  for(let i=0;i<3;i++){assert.equal(w.tick().length,0);assert.equal(p.activeTicks,age);}
  assert.equal(w.tick().length,0);assert.equal(w.tick().length,1);
});

test('projectile cancellation uses Clsn2 even if the attack boxes do not overlap',()=>{
  const c=character();c.animations.push({id:200,frames:[{...frame(0,-1,true),clsn1:[[40,-40,50,0]]}]});const w=new TrainingMatch(c,{pushboxes:false});
  const a=w.spawnProjectile(w.player,{projanim:200,offset:[70,0],hitDef:null}),b=w.spawnProjectile(w.opponent,{projanim:200,offset:[70,0],hitDef:null});w.tick();assert.equal(a.removed,true);assert.equal(b.removed,true);
});

test('projectiles without Clsn2 do not cancel despite overlapping attack boxes',()=>{
  const c=character();c.animations.push({id:200,frames:[frame(0,-1,true,false)]});const w=new TrainingMatch(c,{pushboxes:false});
  w.spawnProjectile(w.player,{projanim:200,offset:[70,0],hitDef:null});w.spawnProjectile(w.opponent,{projanim:200,offset:[70,0],hitDef:null});w.tick();assert.equal(w.projectiles.length,2);
});

test('multi-hit projectiles spend hits in equal-priority clashes and a stronger projectile spends priority',()=>{
  const w=world(),a=w.spawnProjectile(w.player,{projanim:100,offset:[70,0],projhits:2,hitDef:null}),b=w.spawnProjectile(w.opponent,{projanim:100,offset:[70,0],projhits:2,hitDef:null});w.tick();assert.equal(a.remainingHits,1);assert.equal(b.remainingHits,1);assert.equal(w.projectiles.length,2);w.tick();assert.equal(w.projectiles.length,0);
  const p=w.spawnProjectile(w.player,{projanim:100,offset:[70,0],projhits:2,projpriority:2,hitDef:null}),q=w.spawnProjectile(w.opponent,{projanim:100,offset:[70,0],hitDef:null});w.tick();assert.equal(p.priority,1);assert.equal(p.remainingHits,2);assert.equal(q.removed,true);
});

test('a one-tick hit removal action is drawn once and never collides again',()=>{
  const w=world(),p=shot(w,'projhitanim=102');assert.equal(w.tick().length,1);assert.equal(w.projectiles.length,0);assert.ok(w.drawProjectiles.includes(p));assert.equal(sampleFighterAnimation(p).number,40);assert.equal(w.player.resolveTrigger('numproj'),0);
  w.tick();assert.equal(w.drawProjectiles.length,0);assert.equal(w.opponent.life,990);
});

test('time-removal animations show their final frame before all projectile references are released',()=>{
  const w=world(),p=w.spawnProjectile(w.player,{projanim:100,projremovetime:0,projremanim:101,hitDef:null});w.tick();assert.equal(sampleFighterAnimation(p).number,31);assert.equal(w.projectiles.length,1);
  w.tick();assert.equal(w.projectiles.length,0);assert.ok(w.drawProjectiles.includes(p));assert.equal(sampleFighterAnimation(p).number,32);w.tick();assert.equal(w.drawProjectiles.length,0);
});

test('selecting the current projectile action for hit removal continues its existing animation clock',()=>{
  const w=world(),p=shot(w,'projanim=101\nprojhitanim=101');assert.equal(w.tick().length,1);assert.equal(sampleFighterAnimation(p).number,31);assert.equal(p.frameIndex,1);
  w.tick();assert.equal(sampleFighterAnimation(p).number,32);assert.equal(w.projectiles.length,0);w.tick();assert.equal(w.drawProjectiles.length,0);
});

test('a hit on the last frame of an unchanged removal action does not start another animation cycle',()=>{
  const w=world(),p=shot(w,'projanim=101\nprojhitanim=101');w.opponent.pos.x=120;w.tick();w.opponent.pos.x=20;assert.equal(w.tick().length,1);assert.equal(p.removed,true);assert.equal(sampleFighterAnimation(p).number,32);w.tick();assert.equal(w.drawProjectiles.length,0);
});

test('projectile cancellation/removal animations and removal velocity use creation units and facing',()=>{
  const w=world();w.player.coordinateScale=.5;w.player.facing=-1;const p=w.spawnProjectile(w.player,{projanim:100,projcancelanim:101,remvelocity:[6,-2],hitDef:null});const x=p.pos.x;p.cancel();assert.equal(sampleFighterAnimation(p).number,31);p.tick();assert.equal(p.pos.x,x-3);assert.equal(p.pos.y,-1);assert.equal(sampleFighterAnimation(p).number,32);
});

test('missing removal animations retain the current finite action and are reported',()=>{
  const w=world(),p=w.spawnProjectile(w.player,{projanim:103,projremanim:999,projremovetime:0,hitDef:null});w.tick();assert.equal(p.anim,103);assert.ok(w.diagnostics.some(d=>d.message.includes('retaining action')));w.tick();assert.equal(w.projectiles.length,0);
});

test('invalid projectile creation does not occupy a resource slot needed by a later valid projectile',()=>{
  const w=world('',{maxProjectiles:1});w.spawnProjectile(w.player,{projanim:999});const p=w.spawnProjectile(w.player,{projanim:100});assert.equal(w.projectiles.length,1);assert.equal(w.projectiles[0],p);assert.ok(w.diagnostics.some(d=>d.type==='missing-animation'));assert.ok(!w.diagnostics.some(d=>d.type==='resource-limit'));
});

test('projectile IDs and NumProjID normalize negative IDs to zero and truncate integer arguments',()=>{
  const w=world(),p=w.spawnProjectile(w.player,{projanim:100,projid:-7});w.spawnProjectile(w.player,{projanim:100,projid:5});assert.equal(p.projId,0);assert.equal(w.player.resolveTrigger('numprojid',[-99]),1);assert.equal(w.player.resolveTrigger('numprojid',[5.9]),1);assert.ok(w.diagnostics.some(d=>d.type==='projectile-id'));
});

test('a helper rejected for a missing initial state does not block a later valid helper',()=>{
  const w=world(helperState,{maxHelpers:1});w.spawnHelper(w.player,{stateno:999});const h=w.spawnHelper(w.player,{stateno:300});assert.equal(w.player.resolveTrigger('numhelper'),1);assert.ok(w.entities.includes(h));assert.ok(!w.diagnostics.some(d=>d.type==='resource-limit'));
});

test('helper-created projectiles keep root ownership, history and palettes after their creator is destroyed',()=>{
  const w=world(helperState),h=w.spawnHelper(w.player,{stateno:300});h.pos.x=20;w.opponent.pos.x=20;execute(h,'Projectile','projanim=100\nattr=S,NP\ndamage=10\nground.velocity=0,0\nsparkno=-1');const p=w.projectiles[0];execute(h,'DestroySelf');w.tick();assert.equal(w.opponent.life,990);assert.equal(p.owner,w.player);assert.equal(w.player.resolveTrigger('projhittime',[0]),1);assert.ok(w.player.targets.includes(w.opponent));
});

test('projectile shadows are accepted without the previous false unsupported diagnostic',()=>{
  const w=world(),p=shot(w,'projshadow=1');assert.equal(p.spec.projshadow,1);assert.deepEqual(w.diagnostics,[]);
});
