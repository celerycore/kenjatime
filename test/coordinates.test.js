import {test} from 'node:test';
import assert from 'node:assert/strict';
import {FighterRuntime,parseSections} from '../src/runtime.js';
import {TrainingMatch,transformedBoxes} from '../src/combat.js';
import {sampleFighterAnimation} from '../src/rendering.js';
import {EffectsState} from '../src/effects.js';
import {COMMON_STATES} from '../src/common.js';
import {readFileSync} from 'node:fs';
import {archive,animations,decodeText} from '../src/formats.js';

const encode=text=>new TextEncoder().encode(text);
const frame=(extra={})=>({group:0,number:0,x:0,y:0,ticks:-1,clsn1:[[0,-10,20,0]],clsn2:[[-10,-20,10,0]],...extra});
function character(width=320,script='',extra={}){
  const path=`c${width}`;
  return {path:path+'.def',def:{info:{name:path,localcoord:`${width},${width===1280?720:width*.75}`},files:{cns:path+'.cns'}},files:{[path+'.cns']:encode(`[Data]\nlife=1000\n[Size]\nground.front=16\nground.back=12\n[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nctrl=1\nanim=0\n${script}`)},animations:[{id:0,frames:[frame()]},{id:700,frames:[frame({x:8,y:-6})]}],...extra};
}
function match(a=320,b=1280,script='[Statedef 700]\ntype=U\nphysics=N\n'){
  return new TrainingMatch(character(a,script),{opponentCharacter:character(b),commonText:COMMON_STATES,pushboxes:false,initialize:false});
}
function execute(actor,type,params=''){const controller=parseSections(`[State Test]\ntype=${type}\n${params}`)[0];controller.type=type.toLowerCase();actor.execute(controller);}
const close=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-9,`${actual} != ${expected}`);

test('mixed-coordinate state entry, chained owners and SelfState preserve world vectors and bindings',()=>{
  for(const [a,b]of [[320,1280],[1280,320],[640,1280]]){
    const world=match(a,b),actor=world.opponent,original=actor.coordinateScale,next=world.player.baseCoordinateScale;
    actor.pos={x:37,y:-20};actor.vel={x:3,y:-2};actor.vars[0]=55;actor.fvars[0]=7.5;
    actor.getHitVars={xvel:-8,yvel:4,yaccel:.6,'fall.xvel':-12,'fall.yvel':-16,'fall.envshake.ampl':-20,damage:70,hittime:15,fall:1};
    actor.width={front:20,back:12,edge:[24,8]};actor.attackDist=160;actor.cornerPush=-2;
    const binding={target:world.player,x:14,y:-7,time:5};actor.bound=binding;
    actor.changeState(700,undefined,world.player);
    assert.equal(actor.coordinateScale,next);assert.deepEqual(actor.pos,{x:37,y:-20});assert.deepEqual(actor.vel,{x:3,y:-2});assert.equal(actor.bound,binding);
    close(actor.getHitVars.xvel*next,-8*original);close(actor.getHitVars['fall.envshake.ampl']*next,-20*original);
    close(actor.width.front*next,20*original);close(actor.attackDist*next,160*original);
    assert.equal(actor.getHitVars.damage,70);assert.equal(actor.getHitVars.hittime,15);assert.equal(actor.vars[0],55);assert.equal(actor.fvars[0],7.5);
    const third=new FighterRuntime(character(640,'[Statedef 701]\ntype=U\nphysics=N'));world.player.changeState(701,undefined,third);
    actor.changeState(700,undefined,world.player);assert.equal(actor.coordinateScale,next,'owner base coordinates, even while owner is in a foreign state');
    actor.changeState(701,undefined,third);assert.equal(actor.coordinateScale,.5);
    execute(actor,'SelfState','value=0');assert.equal(actor.coordinateScale,original);close(actor.getHitVars.xvel,-8);assert.equal(actor.bound,binding);
    const before=actor.coordinateScale;assert.equal(actor.changeState(999,undefined,world.player),false);assert.equal(actor.coordinateScale,before);
    actor.reset();assert.equal(actor.coordinateScale,original);assert.equal(actor.stateOwner,actor);assert.equal(actor.attackDist,undefined);
  }
});

test('Statedef and motion controllers consume foreign units in both facing directions',()=>{
  for(const facing of [1,-1]){
    const world=match(320,1280,'[Statedef 700]\ntype=A\nphysics=N\nvelset=8,-4');const actor=world.opponent;
    actor.facing=facing;actor.pos={x:0,y:-30};world.player.targets.push(actor);
    execute(world.player,'TargetState','value=700');assert.deepEqual(actor.vel,{x:8,y:-4});
    actor.tick({opponent:world.player});close(actor.pos.x,8*facing);close(actor.pos.y,-34);
    actor.cameraPos={x:30,y:0};execute(actor,'PosSet','x=50\ny=-20');execute(actor,'PosAdd','x=5\ny=-3');
    close(actor.pos.x,80+5*facing);close(actor.pos.y,-23);
    execute(actor,'VelSet','x=4\ny=-2');execute(actor,'VelAdd','x=2');execute(actor,'VelMul','x=.5');close(actor.vel.x,3);close(actor.vel.y,-2);
    execute(actor,'Offset','x=7\ny=8');assert.deepEqual(actor.drawOffset,{x:7,y:8});
    execute(actor,'SelfState','value=0');execute(actor,'VelAdd','x=4');close(actor.vel.x,4);
  }
});

test('redirected spatial triggers convert to caller units without changing scalar state or variables',()=>{
  const world=match(),a=world.player,b=world.opponent;
  a.pos={x:60,y:-8};a.facing=-1;a.vel={x:4,y:-2};a.cameraPos=b.cameraPos={x:10,y:-20};a.getHitVars={xvel:-3,yaccel:.5,damage:90};a.vars[0]=7;
  b.pos={x:-20,y:-4};b.facing=1;
  close(b.evaluate('enemynear, pos x'),200);close(b.evaluate('enemynear, vel x'),16);
  close(b.evaluate('enemynear, const(size.ground.front)'),64);close(b.evaluate('enemynear, gethitvar(xvel)'),-12);
  close(b.evaluate('enemynear, gethitvar(yaccel)'),2);assert.equal(b.evaluate('enemynear, gethitvar(damage)'),90);assert.equal(b.evaluate('enemynear, var(0)'),7);
  close(b.evaluate('P2BodyDist X'),(80-16-4)/.25);close(b.evaluate('P2Dist Y'),-16);
  close(b.evaluate('CameraPos X'),40);close(b.evaluate('ScreenWidth'),1280);
  b.changeState(700,undefined,a);close(b.evaluate('enemynear, pos x'),50);close(b.evaluate('enemynear, vel x'),4);close(b.evaluate('P2BodyDist X'),60);
  const helper=world.spawnHelper(b,{stateno:0,id:9,pos:[10,0]});
  close(helper.evaluate('parentdist x'),-40*helper.facing);close(helper.evaluate('rootdist x'),-40*helper.facing);
});

test('dimensional constants and Const*p use widths while scalar constants remain unchanged',()=>{
  const world=match(),actor=world.opponent;
  actor.program.constants.set('size.height',240);actor.program.constants.set('velocity.jump.y',-32);
  actor.program.constants.set('movement.yaccel',1.6);actor.program.constants.set('movement.stand.friction',.8);
  actor.program.constants.set('size.xscale',2);actor.program.constants.set('movement.airjump.num',2);
  actor.changeState(700,undefined,world.player);
  for(const [name,value]of [['size.height',60],['velocity.jump.y',-8],['movement.yaccel',.4],['movement.stand.friction',.8],['size.xscale',2],['movement.airjump.num',2],['data.life',1000]])close(actor.evaluate(`const(${name})`),Math.fround(value));
  close(actor.evaluate('Const240p(3)'),3);execute(actor,'Gravity');close(actor.vel.y,.4);
  execute(actor,'SelfState','value=0');close(actor.evaluate('Const240p(3)'),12);close(actor.evaluate('Const480p(3)'),6);close(actor.evaluate('Const720p(3)'),3);
  close(actor.evaluate('const(size.height)'),240);execute(actor,'Gravity');close(actor.vel.y,.8);
});

test('incoming hit vectors, fall velocity and hitpause survive foreign entry and own-state restoration',()=>{
  const world=match(),actor=world.opponent,attacker=world.player;
  const hit={attr:'S,NA',damage:[70,0],coordinateScale:.5,groundVelocity:[-4,-2],groundHitTime:20,pauseTime:[0,5],fall:1,yaccel:.6,'fall.xvelocity':-6,'fall.yvelocity':-8,'fall.envshake.ampl':-10,p2stateno:700,stateOwner:attacker};
  actor.receiveHit(hit,attacker);assert.equal(actor.stateOwner,attacker);close(actor.getHitVars.xvel,-2);close(actor.getHitVars.yaccel,.3);
  assert.equal(actor.getHitVars.damage,70);assert.equal(actor.hitPauseTime,5);assert.equal(actor.hitTime,20);
  execute(actor,'HitVelSet','x=1\ny=1');assert.deepEqual(actor.vel,{x:-2,y:-1});
  execute(actor,'HitFallVel');assert.deepEqual(actor.vel,{x:-3,y:-4});
  execute(actor,'SelfState','value=0');close(actor.getHitVars.xvel,-8);close(actor.getHitVars['fall.yvel'],-16);close(actor.getHitVars['fall.envshake.ampl'],-20);
  execute(actor,'HitVelSet','x=1\ny=1');assert.deepEqual(actor.vel,{x:-2,y:-1});
  actor.moveType='H';execute(actor,'HitFallSet','xvel=12\nyvel=-8');execute(actor,'HitFallVel');assert.deepEqual(actor.vel,{x:3,y:-2});
});

test('body widths stay in victim units; Width overrides and target bindings use caller units',()=>{
  const world=match(),a=world.player,b=world.opponent;
  a.targets.push(b);b.changeState(700,undefined,a);close(world.bodyWidth(b,b.facing),4);
  execute(b,'Width','player=20,12\nedge=25,10');close(world.bodyWidth(b,b.facing),20);close(world.bodyWidth(b,b.facing,true),25);
  execute(b,'SelfState','value=0');close(world.bodyWidth(b,b.facing),20);close(world.bodyWidth(b,b.facing,true),25);
  execute(a,'TargetBind','time=3\npos=20,-12');b.updateBinding();close(b.pos.x,a.pos.x+20*a.facing);close(b.pos.y,a.pos.y-12);
  b.changeState(700,undefined,a);a.pos.x+=10;b.updateBinding();close(b.pos.x,a.pos.x+20*a.facing);
  execute(a,'TargetVelSet','x=6\ny=-4');assert.deepEqual(b.vel,{x:6,y:-4});
  execute(b,'SelfState','value=0');assert.deepEqual(b.vel,{x:6,y:-4});
});

test('ChangeAnim2 scales foreign AIR offsets and collision boxes independently of victim sprite size',()=>{
  const world=match(320,640),a=world.player,b=world.opponent;a.program.constants.set('size.xscale',1.5);a.program.constants.set('size.yscale',2);
  b.program.constants.set('size.xscale',.75);b.program.constants.set('size.yscale',.5);b.pos={x:20,y:-10};b.facing=1;
  b.changeState(700,undefined,a);execute(b,'ChangeAnim2','value=700');
  const pose=sampleFighterAnimation(b);close(pose.x*.5*.75,12);close(pose.y*.5*.5,-12);
  assert.deepEqual(transformedBoxes(b),[[20,-30,50,-10]]);assert.equal(b.character,world.opponentCharacter);
  b.tick({opponent:a});const captured=sampleFighterAnimation(b);close(captured.x,32);
  execute(b,'SelfState','value=0');assert.equal(b.animationOwner,b);
  assert.deepEqual(transformedBoxes(b),[[20,-30,50,-10]],'collision snapshot keeps its animation author until the next tick');
  b.tick({opponent:a});assert.equal(b.facing,-1);assert.deepEqual(transformedBoxes(b),[[12.5,-12.5,20,-10]]);
});

test('foreign-state helpers, projectiles, Explods and shakes retain converted world motion after SelfState',()=>{
  const world=match(),actor=world.opponent;actor.changeState(700,undefined,world.player);
  const helper=world.spawnHelper(actor,{id:9,stateno:0,pos:[12,-8],'size.ground.front':10});
  close(helper.pos.x,actor.pos.x+12*actor.facing);close(helper.pos.y,actor.pos.y-8);close(world.bodyWidth(helper,helper.facing),10);assert.equal(helper.coordinateScale,.25);
  execute(actor,'Projectile','projanim=0\nvelocity=4,-2\noffset=8,-4\nattr=S,NP\ndamage=0');const projectile=world.projectiles[0];
  assert.deepEqual(projectile.vel,{x:4,y:-2});assert.equal(projectile.coordinateScale,1);
  execute(actor,'Explod','anim=0\nid=7\npostype=none\npos=30,-20\nvelocity=4,0\nremovetime=-1');const effect=actor.explods[0];
  assert.equal(effect.coordinateScale,1);assert.deepEqual(effect.pos,{x:30,y:-20});
  execute(actor,'EnvShake','time=3\nampl=6\nfreq=90\nphase=0');const events=actor.events.filter(event=>event.type==='envshake');
  execute(actor,'SelfState','value=0');actor.updateExplods();actor.updateExplods();close(effect.pos.x,34);
  const presentation=new EffectsState();presentation.consume(events,{entity:actor});presentation.advance();close(presentation.cameraOffset.y,-6);
  execute(actor,'ModifyExplod','id=7\nvelocity=4,0');assert.equal(effect.coordinateScale,1);assert.deepEqual(effect.velocity,[1,0]);
  const start=projectile.pos.x;projectile.tick();close(projectile.pos.x,start+4*projectile.facing);
});

test('AfterImages capture normalized foreign AIR offsets with the victim sprite scale',()=>{
  const world=match(),actor=world.opponent;actor.changeState(700,undefined,world.player);execute(actor,'ChangeAnim2','value=700');
  const effects=new EffectsState();effects.consume([{type:'afterimage',time:-1,framegap:1}],{entity:actor});effects.capture([actor]);
  const [trail]=effects.trailsFor(actor);assert.equal(trail.coordinateScale,.25);close(trail.frame.x*.25,8);
  execute(actor,'SelfState','value=0');assert.equal(trail.coordinateScale,.25);close(trail.frame.x*.25,8);
});

test('HitDefs and TargetState retain the defining foreign state bank and scale after the attacker restores itself',()=>{
  const world=match(320,1280,'[Statedef 700]\ntype=U\nphysics=N\n[Statedef 710]\ntype=A\nphysics=N');const a=world.player,b=world.opponent;
  b.changeState(700,undefined,a);execute(b,'HitDef','attr=S,NA\ndamage=10\nground.velocity=6,-2\nsnap=20,-5\np2stateno=710');const hit=b.hitDef;
  b.targets.push(a);execute(b,'TargetState','value=710');assert.equal(a.stateOwner,a);assert.equal(a.stateNo,710);
  a.changeState(0);
  b.pos={x:50,y:0};b.facing=-1;execute(b,'SelfState','value=0');
  assert.equal(a.receiveHit(hit,b).rejected,undefined);assert.equal(a.stateOwner,a);assert.equal(a.stateNo,710);assert.equal(a.life,990);
  close(a.getHitVars.xvel,6);close(a.pos.x,30);close(a.pos.y,-5);assert.equal(b.coordinateScale,.25);
});

test('own negative states keep the active foreign units and use their own state bank for TargetState and HitDef',()=>{
  const victim=character(1280,`[Statedef 900]\ntype=U\nphysics=N\n[Statedef -2]\n[State Read active units]\ntype=VarSet\ntrigger1=stateno=700\nfv=0\nvalue=pos x\n[State Transfer own bank]\ntype=TargetState\ntrigger1=stateno=700\nvalue=900\n[State Define own hit bank]\ntype=HitDef\ntrigger1=stateno=700\nattr=S,NA\ndamage=0\np2stateno=900`);
  const world=new TrainingMatch(character(320,'[Statedef 700]\ntype=U\nphysics=N'),{opponentCharacter:victim,commonText:COMMON_STATES,initialize:false,pushboxes:false});
  const a=world.player,b=world.opponent;a.opponent=b;b.opponent=a;b.targets.push(a);b.changeState(700,undefined,a);world.tick();
  assert.equal(b.fvars[0],70);assert.equal(a.stateOwner,b);assert.equal(a.coordinateScale,.25);
  assert.equal(b.hitDef.stateOwner,b);assert.equal(b.hitDef.coordinateScale,1);assert.equal(b._scriptOwner,null);
});

test('BindToTarget selects a target ID and converts head/mid anchors separately from script offsets',()=>{
  const w=match(),a=w.player,b=w.opponent,other=w.spawnHelper(b,{id:12,stateno:0});a.targets.push(other,b);a.targetHitIds.set(other.id,7);a.targetHitIds.set(b.id,9);
  b.program.constants.set('size.head.pos.x',16);b.program.constants.set('size.head.pos.y',-240);b.program.constants.set('size.mid.pos.x',8);b.program.constants.set('size.mid.pos.y',-120);
  b.pos={x:40,y:-10};b.facing=-1;
  execute(a,'BindToTarget','id=9\ntime=3\npos=5,-6,Head');a.updateBinding();assert.equal(a.bound.target,b);close(a.pos.x,31);close(a.pos.y,-76);
  execute(a,'BindToTarget','id=9\ntime=3\npos=5,-6,Mid');a.updateBinding();close(a.pos.x,33);close(a.pos.y,-46);
  assert.throws(()=>execute(a,'BindToTarget','id=9\npos=0,0,Unknown'),/Foot, Head or Mid/);
  close(a.evaluate('e'),Math.fround(Math.E));assert.equal(a.evaluate('IsHomeTeam'),1);assert.equal(b.evaluate('IsHomeTeam'),0);
});

test('native classic/720p KFM throws cross localcoords in both facings and restore own state units',{skip:!process.env.MUGEN_TEST_ARCHIVE},()=>{
  const characters=archive(new Uint8Array(readFileSync(process.env.MUGEN_TEST_ARCHIVE)));
  const classic=characters.find(c=>c.def.info.localcoord==='320,240'),hd=characters.find(c=>c.def.info.localcoord==='1280,720');assert.ok(classic&&hd);
  for(const [attacker,victim]of [[classic,hd],[hd,classic]])for(const facing of [1,-1]){
    const air=Object.keys(attacker.files).find(path=>path.endsWith('/data/fightfx.air'));
    const world=new TrainingMatch(attacker,{opponentCharacter:victim,commonText:COMMON_STATES,commonAnimations:new Map(animations(decodeText(attacker.files[air])).map(a=>[a.id,a])),initialize:false,pushboxes:false});
    world.player.pos.x=-8*facing;world.player.facing=facing;world.opponent.pos.x=8*facing;world.opponent.facing=-facing;world.player.changeState(800);
    const states=new Set();let foreign=false;
    for(let i=0;i<180;i++){world.tick();states.add(world.opponent.stateNo);if(world.opponent.stateOwner===world.player){foreign=true;assert.equal(world.opponent.coordinateScale,world.player.baseCoordinateScale);}}
    assert.ok(foreign);assert.ok(states.has(820)&&states.has(821));assert.equal(world.opponent.life,922);
    assert.equal(world.opponent.stateOwner,world.opponent);assert.equal(world.opponent.coordinateScale,world.opponent.baseCoordinateScale);assert.deepEqual(world.diagnostics,[]);
  }
});
