import {test} from 'node:test';
import assert from 'node:assert/strict';
import {TrainingMatch} from '../src/combat.js';
import {COMMON_STATES} from '../src/common.js';
import {parseSections} from '../src/runtime.js';
import {parseStage} from '../src/stages.js';
import {sampleFighterAnimation} from '../src/rendering.js';

const bytes=s=>new TextEncoder().encode(s);
const frame=(number,ticks=-1)=>({group:0,number,x:0,y:0,ticks,clsn1:[[-20,-40,20,0]],clsn2:[[-20,-40,20,0]]});
function character(script='',width=320){
  return {path:'c.def',def:{info:{name:'Interaction fixture',localcoord:`${width},240`},files:{cns:'c.cns'}},files:{'c.cns':bytes(`[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nctrl=0\nanim=0\n[Statedef 300]\ntype=S\nmovetype=A\nphysics=N\nctrl=0\nanim=0\n[Statedef 310]\ntype=S\nmovetype=I\nphysics=N\nctrl=0\nanim=0\n${script}`)},animations:[{id:0,frames:[frame(0)]},{id:100,frames:[frame(10,1),frame(11,1)]},{id:101,frames:[frame(20,1),frame(21,1)]},{id:102,frames:[frame(30,1)]},{id:103,frames:[frame(40)]}]};
}
function world(script='',options={}){return new TrainingMatch(character(script),{initialize:false,commonText:COMMON_STATES,pushboxes:false,...options});}
function execute(actor,type,params=''){actor.execute({...parseSections(`[State Test]\ntype=${type}\n${params}`)[0],type:type.toLowerCase()});}
function hit(actor,params=''){execute(actor,'HitDef',`attr=S,NA\ndamage=10,1\nguardflag=MA\nground.hittime=0\nground.velocity=0,0\nsparkno=-1\n${params}`);return actor.hitDef;}
function shot(w,params='',owner=w.player){execute(owner,'Projectile',`projanim=0\nattr=S,NP\ndamage=10,1\nguardflag=MA\nground.hittime=0\nground.velocity=0,0\nsparkno=-1\n${params}`);return w.projectiles.at(-1);}
function stage(){return parseStage('s.def',{'s.def':bytes('[Info]\nname=Camera fixture\n[Camera]\nboundleft=-300\nboundright=300\nboundhigh=-100\nverticalfollow=1\nfloortension=0\ntension=50\n[PlayerInfo]\nleftbound=-1000\nrightbound=1000\np1startx=-70\np2startx=70\n[BGDef]\nspr=s.sff'),'s.sff':new Uint8Array()});}

test('helper attacks set InGuardDist for roots and helpers during the collision pass',()=>{
  const w=world(),h=w.spawnHelper(w.player,{stateno:300}),target=w.spawnHelper(w.opponent,{stateno:310});h.pos.x=-100;w.opponent.pos.x=0;target.pos.x=10;hit(h);
  assert.equal(w.opponent.resolveTrigger('inguarddist'),0);w.tick();
  assert.equal(w.opponent.resolveTrigger('inguarddist'),1);assert.equal(target.resolveTrigger('inguarddist'),1);assert.equal(w.player.resolveTrigger('inguarddist'),0);
  execute(h,'DestroySelf');w.tick();assert.equal(w.opponent.resolveTrigger('inguarddist'),0);
});

test('CNS sees the preceding guard-distance pass regardless of player execution order',()=>{
  const c=character('[Statedef -2]\n[State Observe]\ntype=VarSet\ntrigger1=1\nv=0\nvalue=InGuardDist'),w=new TrainingMatch(c,{initialize:false,pushboxes:false});
  w.player.moveType='A';w.player.pos.x=-100;w.opponent.pos.x=0;hit(w.player);w.tick();assert.equal(w.opponent.vars[0],0);w.tick();assert.equal(w.opponent.vars[0],1);
  w.player.moveType='I';w.tick();assert.equal(w.opponent.vars[0],1);w.tick();assert.equal(w.opponent.vars[0],0);
});

for(const facing of [1,-1])test(`guard proximity uses the attack facing ${facing}, strict distance and attack MoveType`,()=>{
  const w=world();w.player.pos.x=0;w.player.facing=facing;w.player.moveType='A';hit(w.player,'guard.dist=60');
  for(const [x,expected] of [[59,1],[60,0],[0,0],[-1,0]]){w.opponent.pos.x=x*facing;w.tick();assert.equal(w.opponent.resolveTrigger('inguarddist'),expected);}
  w.opponent.pos.x=50*facing;w.player.moveType='I';w.tick();assert.equal(w.opponent.resolveTrigger('inguarddist'),0);
});

test('AttackDist and a persisted HitDef retain the correct mixed-coordinate distance',()=>{
  const w=world('',{opponentCharacter:character('',640)}),h=w.spawnHelper(w.player,{stateno:300});h.pos.x=-100;w.opponent.pos.x=0;
  h.coordinateScale=.5;hit(h,'guard.dist=220');w.tick();assert.equal(w.opponent.resolveTrigger('inguarddist'),1);
  execute(h,'AttackDist','value=200');w.tick();assert.equal(w.opponent.resolveTrigger('inguarddist'),0);execute(h,'AttackDist','value=202');w.tick();assert.equal(w.opponent.resolveTrigger('inguarddist'),1);
});

test('projectile default proximity uses proj.attack.dist and survives miss-time and creator destruction',()=>{
  const w=world(),h=w.spawnHelper(w.player,{stateno:300});h.pos.x=-100;w.opponent.pos.x=-11;
  const p=shot(w,'projhits=2\nprojremove=0',h);p.nextHitAge=100;execute(h,'DestroySelf');w.tick();assert.equal(w.opponent.resolveTrigger('inguarddist'),1);
  w.opponent.pos.x=-10;w.tick();assert.equal(w.opponent.resolveTrigger('inguarddist'),0);p.remainingHits=0;w.opponent.pos.x=-11;w.tick();assert.equal(w.opponent.resolveTrigger('inguarddist'),0);
});

test('projectile default proximity converts creator constants once in a foreign coordinate system',()=>{
  const w=world();w.player.coordinateScale=.5;w.player.pos.x=-100;w.opponent.pos.x=-11;shot(w);w.tick();assert.equal(w.opponent.resolveTrigger('inguarddist'),1);
  w.opponent.pos.x=-10;w.tick();assert.equal(w.opponent.resolveTrigger('inguarddist'),0);
});

test('friendly attacks honor affectteam, and a projectile never threatens or hits its root',()=>{
  const w=world(),h=w.spawnHelper(w.player,{stateno:300});h.pos.x=-100;w.player.pos.x=0;w.opponent.pos.x=0;
  hit(h,'affectteam=F');w.tick();assert.equal(w.player.resolveTrigger('inguarddist'),1);assert.equal(w.opponent.resolveTrigger('inguarddist'),0);
  h.hitDef=null;const p=shot(w,'affectteam=B\noffset=-10,0\nprojhits=5');w.tick();assert.equal(w.player.resolveTrigger('inguarddist'),0);assert.equal(w.player.life,1000);assert.equal(w.opponent.life,990);assert.equal(p.remainingHits,4);
});

test('invalid, removing and exhausted projectiles do not set guard proximity',()=>{
  for(const params of ['attr=invalid','projhits=0','projremovetime=0\nprojremanim=101','guard.dist=0','guard.dist=-1']){
    const w=world();w.player.pos.x=-80;w.opponent.pos.x=0;shot(w,params);w.tick();assert.equal(w.opponent.resolveTrigger('inguarddist'),0,params);
  }
});

test('normal helpers opt into body pushing with PlayerPush and only push enemies',()=>{
  const w=world('',{pushboxes:true}),h=w.spawnHelper(w.player,{stateno:310});w.player.pos.x=-100;h.pos.x=0;w.opponent.pos.x=5;
  w.constrainPositions();assert.equal(h.pos.x,0);execute(h,'PlayerPush','value=1');w.constrainPositions();assert.equal(w.opponent.pos.x-h.pos.x,32);
  w.opponent.pos.x=100;w.player.pos.x=0;h.pos.x=5;w.constrainPositions();assert.equal(h.pos.x,5);assert.equal(w.player.pos.x,0);
});

test('helper-vs-helper pushing respects both PlayerPush values, Clsn2 and vertical size boxes',()=>{
  const w=world('',{pushboxes:true}),a=w.spawnHelper(w.player,{stateno:310}),b=w.spawnHelper(w.opponent,{stateno:310});w.player.pos.x=-100;w.opponent.pos.x=100;
  a.pos.x=0;b.pos.x=5;execute(a,'PlayerPush','value=1');w.constrainPositions();assert.equal(a.pos.x,0);
  execute(b,'PlayerPush','value=1');b.pos.y=-80;w.constrainPositions();assert.equal(a.pos.x,0);b.pos.y=-10;b.stateType='A';w.constrainPositions();assert.equal(b.pos.x-a.pos.x,28);
  a.pos.x=0;b.pos.x=5;b.pos.y=0;b.collisionFrame={...frame(0),clsn2:[]};w.constrainPositions();assert.equal(a.pos.x,0);
});

test('helper push widths convert mixed coordinates and transfer wall-blocked displacement',()=>{
  const w=world('',{pushboxes:true}),h=w.spawnHelper(w.player,{stateno:310});w.player.pos.x=-100;w.opponent.pos.x=135;h.pos.x=130;h.playerPush=true;h.width={front:40,back:10};h.coordinateScale=.5;
  w.constrainPositions();assert.equal(w.opponent.pos.x,135);assert.equal(h.pos.x,99);assert.equal(w.opponent.pos.x-h.pos.x,36);
});

test('helper pushing is deterministic with several overlapping enemies',()=>{
  const positions=()=>{const w=world('',{pushboxes:true});w.player.pos.x=-100;w.opponent.pos.x=100;const a=w.spawnHelper(w.player,{stateno:310}),b=w.spawnHelper(w.opponent,{stateno:310}),c=w.spawnHelper(w.opponent,{stateno:310});for(const h of [a,b,c]){h.pos.x=0;h.playerPush=true;}w.constrainPositions();return [a.pos.x,b.pos.x,c.pos.x];};
  assert.deepEqual(positions(),positions());assert.notDeepEqual(positions(),[0,0,0]);
});

test('normal helpers and projectiles do not move the camera; ScreenBound can opt a helper into either axis',()=>{
  const script='[State Camera]\ntype=ScreenBound\ntrigger1=1\nvalue=0\nmovecamera=1,0',w=world(script,{stage:stage()}),h=w.spawnHelper(w.player,{stateno:310});h.pos={x:250,y:-90};w.tick();assert.equal(w.stage.camera.x,90);assert.equal(w.stage.camera.y,0);assert.equal(h.pos.x,250);
  execute(h,'DestroySelf');shot(w,'offset=200,0');w.tick();assert.equal(w.stage.camera.x,55); // root tension reclaims the camera after the helper disappears
  const free=world('',{stage:stage()}),normal=free.spawnHelper(free.player,{stateno:310});normal.pos={x:250,y:-90};free.tick();assert.equal(free.stage.camera.x,0);assert.equal(free.stage.camera.y,0);
});

test('ScreenBound value and horizontal/vertical camera participation are independent',()=>{
  for(const bound of [0,1]){const w=world(`[State Camera]\ntype=ScreenBound\ntrigger1=1\nvalue=${bound}\nmovecamera=0,1`,{stage:stage()}),h=w.spawnHelper(w.player,{stateno:310});h.pos={x:250,y:-90};w.tick();assert.equal(w.stage.camera.x,0);assert.equal(w.stage.camera.y,-90);assert.equal(h.pos.x,bound?w.horizontalLimits(h).max:250);}
});

test('helper camera opt-in expires on the next active tick and dead helpers cannot affect StageRuntime directly',()=>{
  const w=world('[State Camera]\ntype=ScreenBound\ntrigger1=Time=0\nvalue=0\nmovecamera=0,1',{stage:stage()}),h=w.spawnHelper(w.player,{stateno:310});h.pos.y=-90;w.tick();assert.equal(w.stage.camera.y,-90);w.tick();assert.equal(w.stage.camera.y,0);
  h.destroyed=true;h.moveCamera={x:true,y:true};w.stage.updateCamera([h]);assert.equal(w.stage.camera.y,0);
});

test('a projectile contacts a root and multiple helpers together and consumes one hit quota',()=>{
  const w=world();w.player.pos.x=0;w.opponent.pos.x=10;const a=w.spawnHelper(w.opponent,{stateno:310}),b=w.spawnHelper(w.opponent,{stateno:310});a.pos.x=5;b.pos.x=15;
  const p=shot(w,'projhits=1\nprojhitanim=102');assert.equal(w.tick().length,3);for(const target of [w.opponent,a,b])assert.equal(target.life,990);assert.equal(p.remainingHits,0);assert.equal(w.projectiles.length,0);assert.equal(w.tick().length,0);
});

test('mixed guarded and unguarded projectile contacts share one cooldown, preserving latest contact history',()=>{
  const w=world();w.player.pos.x=0;w.opponent.pos.x=5;w.opponent.ctrl=1;const h=w.spawnHelper(w.opponent,{stateno:310});h.pos.x=10;const p=shot(w,'projhits=2\nprojremove=0\nprojmisstime=2');
  const contacts=w.tick(new Set(),new Set(['holdback']));assert.deepEqual(contacts.map(c=>c.guarded),[true,false]);assert.equal(w.opponent.life,999);assert.equal(h.life,990);assert.equal(p.remainingHits,1);assert.equal(w.player.resolveTrigger('projhittime',[0]),1);
  assert.equal(w.tick().length,0);assert.equal(w.tick().length,0);assert.equal(w.tick().length,2);assert.equal(p.remainingHits,0);
});

test('rejected projectile contacts neither consume hits nor prevent another eligible simultaneous victim',()=>{
  const w=world();w.player.pos.x=0;w.opponent.pos.x=5;const h=w.spawnHelper(w.opponent,{stateno:310});h.pos.x=10;h.receiveHit(hit(w.player,'id=7\ndamage=0\nground.hittime=10'),w.player);
  const p=shot(w,'chainID=7\nprojhits=2\nprojremove=0');assert.equal(w.tick().length,1);assert.equal(w.opponent.life,1000);assert.equal(h.life,990);assert.equal(p.remainingHits,1);
});

test('simultaneous lethal root/helper attacks trade from their shared collision snapshot',()=>{
  const w=world(),h=w.spawnHelper(w.player,{stateno:300});w.player.pos.x=-100;h.pos.x=0;w.opponent.pos.x=5;w.opponent.moveType='A';hit(h,'damage=1000');hit(w.opponent,'damage=1000');const contacts=w.tick();assert.equal(contacts.length,2);assert.equal(h.life,0);assert.equal(w.opponent.life,0);
});

test('exhausted hit removal preserves attacker pause and starts its action and remvelocity after the final paused tick',()=>{
  const w=world();w.player.pos.x=0;w.opponent.pos.x=10;const p=shot(w,'projanim=100\nprojhitanim=101\npausetime=2,2\nremvelocity=3,-1');w.tick();const x=p.pos.x,age=p.time;assert.equal(p.removing,true);assert.equal(p.anim,100);assert.equal(p.hitPauseTime,2);assert.equal(sampleFighterAnimation(p).number,10);
  for(let n=1;n>=0;n--){assert.equal(w.tick().length,0);assert.equal(p.hitPauseTime,n);assert.equal(p.time,age);assert.equal(p.pos.x,x);assert.equal(sampleFighterAnimation(p).number,10);}
  w.tick();assert.equal(p.anim,101);assert.equal(p.pos.x,x+3);assert.equal(p.pos.y,-1);assert.equal(sampleFighterAnimation(p).number,20);w.tick();assert.equal(sampleFighterAnimation(p).number,21);assert.equal(p.removed,true);w.tick();assert.equal(w.drawProjectiles.length,0);
});

test('pending hit removal and its last visible frame remain frozen through a global Pause',()=>{
  const w=world();w.player.pos.x=0;w.opponent.pos.x=10;const p=shot(w,'projhitanim=102\npausetime=1,1');w.tick();w.requestPause(w.player,{type:'pause',time:2});w.tick();assert.equal(p.hitPauseTime,0);assert.equal(p.removalStarted,undefined);
  w.tick();w.tick();assert.equal(p.anim,0);assert.equal(p.removed,false);w.tick();assert.equal(p.removed,true);assert.equal(sampleFighterAnimation(p).number,30);assert.ok(w.drawProjectiles.includes(p));w.tick();assert.equal(w.drawProjectiles.length,0);
});

for(const type of ['pause','superpause'])test(`projectile ${type} movement allowance is not consumed by overlapping hitpause`,()=>{
  const w=world(),p=shot(w,'projhits=5\nprojremove=0\npausemovetime=1\nsupermovetime=1');p.hitPauseTime=3;w.requestPause(w.player,{type,time:4,movetime:0});w.tick();const age=p.activeTicks;
  w.tick();w.tick();assert.equal(p.activeTicks,age);assert.equal(w.isFrozen(p),false);w.tick();assert.equal(p.activeTicks,age+1);assert.equal(w.isFrozen(p),true);w.tick();assert.equal(p.activeTicks,age+1);w.tick();assert.equal(p.activeTicks,age+2);
});

test('lifetime zero switches to removal velocity before movement, and lifetime freezes during hitpause',()=>{
  const w=world(),p=shot(w,'projremovetime=0\nprojremanim=101\nvelocity=20,0\nremvelocity=3,0');const x=p.pos.x;w.tick();assert.equal(p.pos.x,x+3);assert.equal(p.anim,101);
  const q=shot(w,'projremovetime=1\nprojremanim=101');q.hitPauseTime=2;w.tick();w.tick();assert.equal(q.time,0);w.tick();assert.equal(q.removing,false);w.tick();assert.equal(q.removing,true);
});

test('stage and height removal bounds allow inward movement and retire outward travel before the next move',()=>{
  const w=world();w.opponent.pos.x=140;
  const inside=shot(w,'offset=0,-250\nvelocity=0,2\nprojedgebound=1000');w.tick();assert.equal(inside.removing,false);assert.equal(inside.pos.y,-248);
  const outward=shot(w,'offset=0,-250\nvelocity=0,-2\nprojedgebound=1000');w.tick();assert.equal(outward.removed,true);assert.equal(outward.pos.y,-250);
  const returning=shot(w,'postype=right\noffset=50,0\nvelocity=-2,0\nprojedgebound=1000');w.tick();assert.equal(returning.removed,false);assert.equal(returning.pos.x,208);
  const leaving=shot(w,'postype=right\noffset=50,0\nvelocity=2,0\nprojedgebound=1000');w.tick();assert.equal(leaving.removed,true);assert.equal(leaving.pos.x,210);
});

test('negative loop-removal expires after the first action cycle, while -1 keeps looping',()=>{
  const w=world(),p=shot(w,'projanim=100\nprojremovetime=-2\nprojremanim=101'),q=shot(w,'projanim=100\nprojremovetime=-1');w.opponent.pos.x=140;
  w.tick();w.tick();assert.equal(p.removing,false);w.tick();assert.equal(p.anim,101);assert.equal(q.removing,false);
});

test('infinite removal actions release the projectile rather than leaking a permanent effect',()=>{
  const w=world(),p=shot(w,'projremovetime=0\nprojremanim=103');w.tick();assert.equal(p.removed,true);assert.equal(w.projectiles.length,0);assert.equal(w.drawProjectiles.length,0);
});

test('same-action removal on the final frame does not replay after positive hitpause',()=>{
  const w=world();w.player.pos.x=0;w.opponent.pos.x=140;const p=shot(w,'projanim=100\nprojhitanim=100\npausetime=2,0');w.tick();w.opponent.pos.x=10;w.tick();assert.equal(sampleFighterAnimation(p).number,11);w.tick();w.tick();w.tick();assert.equal(p.removed,true);assert.equal(w.projectiles.length,0);
});

test('cancellation clears survivor hitpause only on the projectile being cancelled',()=>{
  const w=world();w.player.pos.x=0;w.opponent.pos.x=0;const a=shot(w,'projhits=2\npausetime=3,0'),b=shot(w,'projhits=1\nprojcancelanim=101',w.opponent);a.hitPauseTime=2;b.hitPauseTime=2;w.tick();assert.equal(a.remainingHits,1);assert.equal(a.hitPauseTime,3);assert.equal(b.hitPauseTime,0);assert.equal(b.anim,101);
});

test('simultaneous projectiles do not stack on one defender, and blocked shots keep their hit quota',()=>{
  const w=world();w.player.pos.x=0;w.opponent.pos.x=10;const first=shot(w),second=shot(w);assert.equal(w.tick().length,1);assert.equal(w.opponent.life,990);assert.equal(first.remainingHits,0);assert.equal(second.remainingHits,1);
  assert.equal(w.tick().length,1);assert.equal(w.opponent.life,980);assert.equal(second.remainingHits,0);
});

test('a rejected first projectile leaves the simultaneous projectile contact available',()=>{
  const w=world();w.player.pos.x=0;w.opponent.pos.x=10;const rejected=shot(w,'chainID=99'),accepted=shot(w);assert.equal(w.tick().length,1);assert.equal(w.opponent.life,990);assert.equal(rejected.remainingHits,1);assert.equal(accepted.remainingHits,0);
});

test('projectile contact immunity survives a Pause until the defender gets an active update',()=>{
  const w=world();w.player.pos.x=0;w.opponent.pos.x=10;shot(w);w.requestPause(w.player,{type:'pause',time:3,movetime:3});w.tick();const second=shot(w,'pausemovetime=10');
  for(let i=0;i<3;i++){assert.equal(w.tick().length,0);assert.equal(second.remainingHits,1);assert.equal(w.opponent.life,990);}
  assert.equal(w.tick().length,1);assert.equal(w.opponent.life,980);
});

test('zero-total-time removal actions release their projectile immediately',()=>{
  const c=character();c.animations.push({id:104,frames:[frame(50,0),frame(51,0)]});const w=new TrainingMatch(c,{initialize:false,pushboxes:false});const p=shot(w,'projremovetime=0\nprojremanim=104');w.tick();assert.equal(p.removed,true);assert.equal(w.drawProjectiles.length,0);
});

test('a helper moving during Pause can body-push a frozen opponent',()=>{
  const w=world('[State Push]\ntype=PlayerPush\ntrigger1=1\nvalue=1',{pushboxes:true}),h=w.spawnHelper(w.player,{stateno:310,pausemovetime:2});w.player.pos.x=-100;h.pos.x=0;w.opponent.pos.x=35;w.requestPause(w.player,{type:'pause',time:2});w.tick();h.vel.x=10;const time=w.opponent.time;w.tick();assert.equal(w.opponent.time,time);assert.equal(w.opponent.pos.x,38.5);assert.equal(h.pos.x,6.5);
});

test('camera participation follows helper pushing during the same simulation tick',()=>{
  const w=world('[State Push]\ntype=PlayerPush\ntrigger1=1\nvalue=1',{pushboxes:true,stage:stage()});w.player.pos.x=10;w.opponent.pos.x=120;const h=w.spawnHelper(w.player,{stateno:310});h.pos.x=115;w.tick();assert.equal(w.opponent.pos.x,133.5);assert.equal(w.stage.camera.x,23.5);
});

test('helper PlayerPush, ScreenBound, camera flags and Width persist through hitpause, then reset on an active tick',()=>{
  const w=world('[State Push]\ntype=PlayerPush\ntrigger1=Time=0\nvalue=1\n[State Camera]\ntype=ScreenBound\ntrigger1=Time=0\nvalue=1\nmovecamera=0,1\n[State Width]\ntype=Width\ntrigger1=Time=0\nvalue=25,9',{stage:stage()}),h=w.spawnHelper(w.player,{stateno:310});h.pos={x:0,y:-60};w.tick();h.hitPauseTime=2;
  for(let i=0;i<2;i++){w.tick();assert.equal(h.playerPush,true);assert.equal(h.screenBound,true);assert.deepEqual(h.moveCamera,{x:false,y:true});assert.equal(h.width.front,25);assert.equal(w.stage.camera.y,-60);}
  w.tick();assert.equal(h.playerPush,false);assert.equal(h.screenBound,false);assert.deepEqual(h.moveCamera,{x:false,y:false});assert.equal(h.width,null);assert.equal(w.stage.camera.y,0);
});

for(const type of ['pause','superpause'])test(`projectile ${type} allowance ages before a later pause and cannot be replenished`,()=>{
  const w=world();w.player.pos.x=0;w.opponent.pos.x=140;const p=shot(w,'pausemovetime=2\nsupermovetime=2\nvelocity=1,0');w.tick();assert.equal(p.pauseMoveTime,1);assert.equal(p.superMoveTime,1);
  w.requestPause(w.player,{type,time:2});w.tick();assert.equal(p.pauseMoveTime,0);assert.equal(p.superMoveTime,0);const x=p.pos.x;w.tick();w.tick();assert.equal(p.pos.x,x);w.tick();assert.equal(p.pos.x,x+1);
  w.requestPause(w.player,{type,time:1});w.tick();const next=p.pos.x;w.tick();assert.equal(p.pos.x,next);
});

test('projectile pause allowances do not age on a newly applied attacker hitpause',()=>{
  const w=world();w.player.pos.x=0;w.opponent.pos.x=10;const p=shot(w,'projhits=2\nprojremove=0\npausetime=2,0\npausemovetime=3\nsupermovetime=4');w.tick();assert.equal(p.pauseMoveTime,3);assert.equal(p.superMoveTime,4);w.tick();w.tick();assert.equal(p.pauseMoveTime,3);assert.equal(p.superMoveTime,4);
  w.opponent.pos.x=140;w.tick();assert.equal(p.pauseMoveTime,2);assert.equal(p.superMoveTime,3);
});

test('simultaneous projectile clashes resolve the nearest overlap before a farther higher-priority shot',()=>{
  for(const nearFirst of [true,false]){
    const w=world(),a=shot(w,'projpriority=2');a.pos.x=0;a.hitDef=null;
    const enemy=(x,priority)=>{const p=shot(w,`projpriority=${priority}`,w.opponent);p.pos.x=x;p.hitDef=null;return p;};
    let near,far;if(nearFirst){near=enemy(5,1);far=enemy(15,2);}else{far=enemy(15,2);near=enemy(5,1);}
    w.tick();assert.equal(near.removed,true);assert.equal(a.removed,true);assert.equal(far.removed,false);assert.equal(far.priority,1);
  }
});
