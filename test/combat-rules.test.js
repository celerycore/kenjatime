import {test} from 'node:test';
import assert from 'node:assert/strict';
import {TrainingMatch} from '../src/combat.js';
import {FighterRuntime,parseSections} from '../src/runtime.js';
import {COMMON_STATES} from '../src/common.js';
import {combatRules} from '../src/combat-rules.js';
import {readFileSync} from 'node:fs';
import {archive,animations,decodeText} from '../src/formats.js';

const encode=text=>new TextEncoder().encode(text),close=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-6,`${actual} != ${expected}`);
function character({attack=false,width=320,script=''}={}){return {path:'c.def',def:{info:{name:'Combat',localcoord:`${width},${width*.75}`},files:{cns:'c.cns'}},files:{'c.cns':encode(`[Statedef 0]\ntype=S\nmovetype=${attack?'A':'I'}\nphysics=N\nctrl=${attack?0:1}\nanim=0\n${script}`)},animations:[{id:0,frames:[{group:0,number:0,x:0,y:0,ticks:-1,clsn1:attack?[[0,-60,360,0]]:[],clsn2:[[-20,-50,20,0]]}]}]};}
function world(options={}){const w=new TrainingMatch(character({attack:true,...options}),{opponentCharacter:character({width:options.defenderWidth||320}),commonText:COMMON_STATES,initialize:false,pushboxes:false,...options.match});w.player.pos.x=-20;w.opponent.pos.x=20;return w;}
function execute(actor,type,params=''){const c={...parseSections(`[State Test]\ntype=${type}\n${params}`)[0],type:type.toLowerCase()};actor.execute(c);return c;}
function arm(actor,params=''){execute(actor,'HitDef','attr=S,NA\ndamage=10,1\nground.hittime=8\nsparkno=-1\n'+params);return actor.hitDef;}

test('hit-to-guard and guard-to-hit contacts replace stale Move flags',()=>{
  const w=world();arm(w.player,'guardflag=MA');w.tick();assert.equal(w.player.moveHit,1);
  w.opponent.changeState(0,1);arm(w.player,'guardflag=MA');w.tick(new Set(),new Set(['holdback']));assert.equal(w.player.moveGuarded,1);assert.equal(w.player.moveHit,0);assert.equal(w.player.moveReversed,0);assert.equal(w.player.moveContact,1);
  w.opponent.changeState(0,1);arm(w.player);w.tick();assert.equal(w.player.moveGuarded,0);assert.equal(w.player.moveHit,1);
});

test('holding guard continues to block during guard stun while ordinary hitstun cannot guard',()=>{
  const w=world();arm(w.player,'guardflag=MA\nguard.hittime=20');w.tick(new Set(),new Set(['holdback']));assert.equal(w.opponent.moveType,'H');assert.equal(w.opponent.ctrl,0);
  arm(w.player,'guardflag=MA');const guarded=w.tick(new Set(),new Set(['holdback']));assert.equal(guarded[0].guarded,true);assert.equal(w.opponent.life,998);
  w.opponent.getHitVars.guarded=0;w.opponent.ctrl=0;arm(w.player,'guardflag=MA');assert.equal(w.tick(new Set(),new Set(['holdback']))[0].guarded,false);
});

test('guard-stun scripts permit changing from standing to crouching guard',()=>{
  const w=world();arm(w.player,'guardflag=MA\nguard.hittime=20');w.tick(new Set(),new Set(['holdback']));
  arm(w.player,'guardflag=L');const events=w.tick(new Set(),new Set(['holdback','holddown']));assert.equal(w.opponent.stateType,'C');assert.equal(events[0].guarded,true);
});

test('launch hits use air hit time while a downed slide uses down hit time',()=>{
  for(const posture of ['S','L']){const w=world();w.opponent.stateType=posture;w.opponent.ctrl=0;arm(w.player,'hitflag=MD\nground.velocity=-2,-3\ndown.velocity=-2,-3\nground.hittime=7\nair.hittime=25\ndown.hittime=99');w.tick();assert.equal(w.opponent.hitTime,25);}
});

test('AttackDist overrides an explicit current guard distance in the HitDef creation units',()=>{
  const w=world();arm(w.player,'guard.dist=1');execute(w.player,'AttackDist','value=100');assert.equal(w.player.hitDef['guard.dist'],100);w.tick();assert.equal(w.opponent.evaluate('InGuardDist'),1);
  w.player.coordinateScale=.25;execute(w.player,'AttackDist','value=40');assert.equal(w.player.hitDef['guard.dist'],10);w.tick();assert.equal(w.opponent.evaluate('InGuardDist'),0);
});

test('HitDef inherits air type, down vectors, forced standing and guard clock defaults',()=>{
  const w=world(),hit=arm(w.player,'ground.type=Low\nground.velocity=-2,-3\nair.velocity=-4,-5\nguard.hittime=12\nguard.slidetime=9\nguard.velocity=-3,99');
  assert.equal(hit['air.type'],'Low');assert.deepEqual(hit['down.velocity'],[-4,-5]);assert.equal(hit.forcestand,1);assert.equal(hit['ground.slidetime'],0);assert.equal(hit['guard.ctrltime'],9);assert.equal(hit['airguard.ctrltime'],9);assert.deepEqual(hit.guardVelocity,[-3,0]);
  const crouch=world();crouch.opponent.stateType='C';crouch.opponent.ctrl=0;arm(crouch.player,'ground.velocity=-2,-3');crouch.tick();assert.equal(crouch.opponent.stateNo,5000);assert.equal(crouch.opponent.stateType,'S');
});

test('air type defaults inherit Low but explicit air overrides remain independent',()=>{
  for(const [params,type]of [['ground.type=Low',2],['ground.type=Low\nair.type=High',1]]){const w=world();w.opponent.stateType='A';w.opponent.ctrl=0;w.opponent.pos.y=-10;arm(w.player,params);w.tick();assert.equal(w.opponent.getHitVars.type,type);}
});

test('forcenofall clears an inherited fall but explicit fall takes precedence',()=>{
  for(const [fall,expected]of [[0,0],[1,1]]){const w=world();w.opponent.stateType='A';w.opponent.ctrl=0;w.opponent.getHitVars.fall=1;arm(w.player,`fall=${fall}\nforcenofall=1`);w.tick();assert.equal(w.opponent.getHitVars.fall,expected);}
});

test('positive sub-point damage has a one-point minimum while zero attack/defence multipliers remain zero',()=>{
  for(const [scale,expected]of [[.001,1],[0,0],[.25,3]]){const w=world();w.player.attackMultiplier=scale;arm(w.player);w.tick();assert.equal(w.opponent.life,1000-expected);assert.equal(w.opponent.getHitVars.damage,expected);}
  const w=world();w.opponent.defenceMultiplier=0;arm(w.player);w.tick();assert.equal(w.opponent.life,1000);
});

test('default hit power uses unscaled HitDef damage and guard power defaults to half the hit award',()=>{
  const hit=world();hit.player.attackMultiplier=.5;arm(hit.player,'damage=100,10\nguardflag=MA');hit.tick();assert.equal(hit.opponent.life,950);assert.equal(hit.player.power,70);assert.equal(hit.opponent.power,60);
  const guard=world();arm(guard.player,'damage=100,10\nguardflag=MA');guard.tick(new Set(),new Set(['holdback']));assert.equal(guard.opponent.life,990);assert.equal(guard.player.power,35);assert.equal(guard.opponent.power,30);
  const single=world();arm(single.player,'guardflag=MA\ngetpower=21\ngivepower=19');single.tick(new Set(),new Set(['holdback']));assert.equal(single.player.power,10);assert.equal(single.opponent.power,9);
  const precision=world();arm(precision.player,'damage=90');precision.tick();assert.equal(precision.player.power,63);assert.equal(precision.opponent.power,54);
});

test('engine CFG supplies life-to-power and super target defence rules with explicit overrides',()=>{
  const source=character({attack:true});source.files['engine/data/mugen.cfg']=encode('[Rules]\nDefault.Attack.LifeToPowerMul=.9\nDefault.GetHit.LifeToPowerMul=.8\nSuper.TargetDefenceMul=3');
  const w=new TrainingMatch(source,{opponentCharacter:character(),commonText:COMMON_STATES,pushboxes:false,initialize:false});w.player.pos.x=-20;w.opponent.pos.x=20;arm(w.player,'damage=100');w.tick();assert.equal(w.player.power,90);assert.equal(w.opponent.power,80);
  w.player.targets=[w.opponent];w.requestPause(w.player,{type:'superpause',time:2});w.advancePause();close(w.opponent.defenceMultiplier,1/3);w.tick();w.tick();assert.equal(w.opponent.defenceMultiplier,1);
  assert.equal(combatRules(source.files,{attackLifeToPower:.5}).attackLifeToPower,.5);
  assert.throws(()=>combatRules(source.files,{getHitLifeToPower:-1}),/Invalid combat rule/);
});

test('knockback points along the attack direction for both victim facings and coordinate widths',()=>{
  for(const facing of [1,-1])for(const victimFacing of [1,-1])for(const width of [320,1280]){
    const w=world({width,defenderWidth:width});w.player.facing=facing;w.player.pos.x=-20*facing;w.opponent.pos.x=20*facing;w.opponent.facing=victimFacing;w.opponent.ctrl=0;
    arm(w.player,`ground.velocity=${-4/(320/width)},0\nground.slidetime=10`);w.tick();const before=w.opponent.pos.x;w.tick();close(w.opponent.pos.x-before,4*facing);
  }
});

test('a hit from behind swaps High and Low reaction types without changing Trip',()=>{
  for(const [type,expected]of [['High',2],['Low',1],['Trip',3]]){const w=world();w.opponent.facing=1;w.opponent.ctrl=0;arm(w.player,`ground.type=${type}\nfall=1\nground.velocity=-2,-3`);w.tick();assert.equal(w.opponent.getHitVars.groundtype,expected);}
});

test('legacy type None leaves life, hitpause, control, velocity, position and target state unchanged',()=>{
  const w=world();arm(w.player,'ground.type=None\ndamage=999\npausetime=2,3\np1stateno=888\np2stateno=999\nsnap=40,-50\ngetpower=500\ngivepower=500');
  const events=w.tick();assert.equal(events.length,1);assert.equal(events[0].typeNone,true);assert.equal(events[0].damage,0);assert.equal(w.opponent.life,1000);assert.equal(w.opponent.stateNo,0);assert.equal(w.opponent.ctrl,1);assert.deepEqual(w.opponent.pos,{x:20,y:0});assert.equal(w.player.power,0);assert.equal(w.opponent.power,0);assert.equal(w.player.hitPauseTime,0);assert.equal(w.opponent.hitPauseTime,0);
});

test('one HitDef counts one attack and two unique targets while numhits updates both victim combo counters',()=>{
  const w=world(),helper=w.spawnHelper(w.opponent,{id:9,stateno:0});helper.pos.x=30;arm(w.player,'numhits=3');const events=w.tick();assert.equal(events.length,2);assert.equal(w.player.hitCount,1);assert.equal(w.player.uniqHitCount,2);assert.equal(w.opponent.getHitVars.hitcount,1);assert.equal(helper.getHitVars.hitcount,1);assert.equal(w.opponent.comboHits,3);assert.equal(helper.comboHits,3);
  execute(w.player,'HitAdd','value=2');assert.equal(w.opponent.comboHits,3);assert.equal(helper.comboHits,5);assert.equal(w.player.hitCount,3);assert.equal(w.player.uniqHitCount,4);assert.equal(helper.getHitVars.hitcount,1);
});

test('KO hits force falling, disable recovery and impart ground launch velocity in both coordinate systems',()=>{
  for(const width of [320,1280]){const scale=320/width,w=world({width,defenderWidth:width});w.opponent.life=5;arm(w.player,`ground.velocity=${-4/scale},0`);w.tick();assert.equal(w.opponent.life,0);assert.equal(w.opponent.getHitVars.fall,1);assert.equal(w.opponent.getHitVars['fall.recover'],0);close(w.opponent.getHitVars.xvel*scale,-5.14);close(w.opponent.getHitVars.yvel*scale,-6);
    assert.equal(w.opponent.getHitVars.xveladd,0);assert.equal(w.opponent.getHitVars.yveladd,0);
    const y=w.opponent.pos.y;w.tick();assert.ok(w.opponent.pos.y<y);assert.notEqual(w.opponent.stateNo,5150);
  }
});

test('air KO velocity preserves downward motion and handles zero horizontal velocity',()=>{
  for(const [x,y,wantedX,wantedY]of [[-3,-1,-5.5,-3],[0,4,0,4]]){const w=world();w.opponent.life=5;w.opponent.stateType='A';w.opponent.ctrl=0;w.opponent.pos.y=-20;arm(w.player,`air.velocity=${x},${y}`);w.tick();close(w.opponent.getHitVars.xvel,wantedX);close(w.opponent.getHitVars.yvel,wantedY);}
});

test('guard KO becomes a falling hit reaction while nonlethal kill flags prevent KO boosts',()=>{
  const guard=world();guard.opponent.life=1;arm(guard.player,'guardflag=MA\ndamage=10,2');guard.tick(new Set(),new Set(['holdback']));assert.equal(guard.opponent.life,0);assert.equal(guard.opponent.getHitVars.fall,1);assert.ok(guard.opponent.getHitVars.yvel<0);assert.equal(guard.opponent.stateNo,5000);
  const safe=world();safe.opponent.life=1;arm(safe.player,'kill=0\nground.velocity=-2,0');safe.tick();assert.equal(safe.opponent.life,1);assert.equal(safe.opponent.getHitVars.fall,0);assert.equal(safe.opponent.getHitVars.yvel,0);
});

test('downed hits use down-state dispatch and down.velocity inherits the air vector',()=>{
  const w=world();w.opponent.changeState(5110);arm(w.player,'hitflag=D\nair.velocity=-2,0\ndown.hittime=15');w.tick();assert.equal(w.opponent.stateNo,5080);assert.equal(w.opponent.hitTime,15);assert.equal(w.opponent.getHitVars.xvel,-2);w.tick();assert.equal(w.opponent.stateNo,5081);
});

test('down.bounce controls whether an airborne down-hit gets a ground bounce',()=>{
  for(const bounce of [0,1]){const w=world();w.opponent.changeState(5110);arm(w.player,`hitflag=D\ndown.velocity=-2,-3\ndown.bounce=${bounce}\nfall=1`);w.tick();assert.equal(w.opponent.stateNo,5080);assert.equal(w.opponent.getHitVars['fall.yvel'],bounce?-4.5:0);
    const states=new Set();for(let i=0;i<100;i++){w.tick();states.add(w.opponent.stateNo);}assert.equal(states.has(5101),!!bounce);assert.ok(states.has(5110));assert.ok(!w.diagnostics.some(d=>/5080|5081/.test(d.message)));
  }
});

test('trip reactions follow 5070/5071 to lying down without a bounce state',()=>{
  const w=world();arm(w.player,'ground.type=Trip\nground.velocity=-2,-4\nfall=1\npausetime=0,2');w.tick();assert.equal(w.opponent.stateNo,5070);const states=new Set();for(let i=0;i<80;i++){w.tick();states.add(w.opponent.stateNo);}assert.ok(states.has(5071));assert.ok(states.has(5110));assert.ok(!states.has(5101));
});

test('fall damage consumes its amount once, respects defence and cannot revive a KO',()=>{
  const f=new FighterRuntime(character(),{commonText:COMMON_STATES});f.moveType='H';f.getHitVars.fall=1;f.getHitVars['fall.damage']=20;f.defenceMultiplier=.5;execute(f,'HitFallDamage');assert.equal(f.life,990);assert.equal(f.getHitVars['fall.damage'],0);execute(f,'HitFallDamage');assert.equal(f.life,990);
  f.life=0;f.getHitVars['fall.damage']=20;f.getHitVars['fall.kill']=0;execute(f,'HitFallDamage');assert.equal(f.life,0);
});

test('HitFallVel preserves current horizontal motion when fall.xvelocity was omitted and idle states do not apply it',()=>{
  const w=world(),hit=arm(w.player,'fall=1\nfall.yvelocity=-6');w.opponent.receiveHit(hit,w.player);w.opponent.vel.x=7;execute(w.opponent,'HitFallVel');assert.equal(w.opponent.vel.x,7);assert.equal(w.opponent.vel.y,-6);
  w.opponent.moveType='I';w.opponent.vel.y=2;execute(w.opponent,'HitFallVel');assert.equal(w.opponent.vel.y,2);
});

test('each ground impact applies fall defence once and normal control resets the modifier',()=>{
  const w=world();w.opponent.moveType='H';w.opponent.getHitVars.fall=1;w.opponent.changeState(5100);w.tick();close(w.opponent._fallDefenceMultiplier,2/3);w.tick();close(w.opponent._fallDefenceMultiplier,2/3);
  w.opponent.changeState(5100);w.tick();close(w.opponent._fallDefenceMultiplier,4/9);w.opponent.changeState(0);w.tick();assert.equal(w.opponent._fallDefenceMultiplier,1);
});

test('helper juggle budgets are independent and an ordinary HitDef ignores projectile air.juggle',()=>{
  const w=world(),helper=w.spawnHelper(w.player,{id:9,stateno:0}),target=w.opponent;target.stateType='A';target.moveType='H';target.getHitVars.fall=1;
  const hit={juggleCost:7,juggleGroup:'first','air.juggle':99};assert.equal(w.canJuggle(w.player,target,hit),true);w.recordJuggle(w.player,target,hit);assert.equal(w.juggles.get(w.player).get(target.id).remaining,8);
  assert.equal(w.canJuggle(helper,target,{...hit,juggleCost:10,juggleGroup:'helper'}),true);w.recordJuggle(helper,target,{...hit,juggleCost:10,juggleGroup:'helper'});assert.equal(w.juggles.get(helper).get(target.id).remaining,5);assert.equal(w.juggles.get(w.player).get(target.id).remaining,8);
});

test('projectiles debit air.juggle per contact and do not debit the creator state cost',()=>{
  const w=world(),target=w.opponent;target.stateType='A';target.moveType='H';target.getHitVars.fall=1;
  const projectile={isProjectile:true,owner:w.player,creator:w.player},hit={juggleCost:99,juggleGroup:'projectile','air.juggle':2};
  assert.equal(w.canJuggle(projectile,target,hit),true);w.recordJuggle(projectile,target,hit);w.recordJuggle(projectile,target,hit);assert.equal(w.juggles.get(w.player).get(target.id).remaining,11);
});

test('juggle debit uses the pre-hit falling snapshot and NoJuggleCheck consumes a move without spending points',()=>{
  const w=world(),p=w.player,d=w.opponent,hit={juggleCost:7,juggleGroup:'move'};d.moveType='H';d.stateType='A';d.getHitVars.fall=0;
  w.recordJuggle(p,d,hit,{wasFalling:true});assert.equal(w.juggles.get(p).get(d.id).remaining,8);
  p.asserted.add('nojugglecheck');w.recordJuggle(p,d,{...hit,juggleGroup:'second'},{wasFalling:true});p.asserted.clear();d.getHitVars.fall=1;
  w.recordJuggle(p,d,{...hit,juggleGroup:'second'});assert.equal(w.juggles.get(p).get(d.id).remaining,8);
});

test('priority expressions evaluate once and use the resulting native priority class',()=>{
  const w=world();w.player.vars[0]=6;const hit=arm(w.player,'priority=var(0):=var(0)+1,Miss');assert.deepEqual(hit.priority,[7,'Miss']);assert.equal(w.player.vars[0],7);
});

test('a later target contacted by the same active HitDef increments HitCount on its own tick',()=>{
  const w=world(),helper=w.spawnHelper(w.opponent,{id:9,stateno:0});helper.pos.x=1000;arm(w.player);w.tick();assert.equal(w.player.hitCount,1);assert.equal(w.player.uniqHitCount,1);
  helper.pos.x=30;w.tick();assert.equal(w.player.hitCount,2);assert.equal(w.player.uniqHitCount,2);
});

test('the full Hit/Miss/Dodge priority matrix and lethal equal-priority trades resolve from actual contacts',()=>{
  for(const a of ['Hit','Miss','Dodge'])for(const b of ['Hit','Miss','Dodge']){
    const w=world({match:{opponentCharacter:character({attack:true})}});arm(w.player,`priority=4,${a}`);arm(w.opponent,`priority=4,${b}`);w.tick();
    const aHits=a==='Hit'&&b!=='Dodge',bHits=b==='Hit'&&a!=='Dodge';assert.equal(w.opponent.life,aHits?990:1000,`${a}/${b}`);assert.equal(w.player.life,bHits?990:1000,`${a}/${b}`);
  }
  const w=world({match:{opponentCharacter:character({attack:true})}});w.player.life=w.opponent.life=5;arm(w.player);arm(w.opponent);assert.equal(w.tick().length,2);assert.equal(w.winner,'draw');
});

test('destroying an actor releases its juggle records and victim entries',()=>{
  const w=world(),helper=w.spawnHelper(w.player,{id:9,stateno:0});w.juggles.set(helper,new Map([[w.opponent.id,{remaining:1}]]));w.juggles.set(w.player,new Map([[helper.id,{remaining:3}]]));helper.destroyed=true;w.cleanupEntities();assert.equal(w.juggles.has(helper),false);assert.equal(w.juggles.get(w.player).has(helper.id),false);
});

test('both supplied full-engine KFM variants complete CPU rounds with all common resources and no runtime diagnostics',{skip:!process.env.MUGEN_TEST_ARCHIVE},()=>{
  const characters=archive(new Uint8Array(readFileSync(process.env.MUGEN_TEST_ARCHIVE)));
  for(const c of characters){const air=Object.keys(c.files).find(path=>path.endsWith('/data/fightfx.air'));const commonAnimations=new Map(animations(decodeText(c.files[air])).map(a=>[a.id,a]));
    const w=new TrainingMatch(c,{commonText:COMMON_STATES,commonAnimations,playerAILevel:8,opponentAILevel:8,rules:{preIntro:0,introHold:0,overTime:10,resultTime:10,roundTime:15,roundsToWin:2}});let hits=0,guards=0;
    for(let tick=0;tick<4000;tick++)for(const event of w.tick()){if(event.type==='hit')hits++;if(event.type==='guard')guards++;}
    assert.ok(hits>2,`${c.path}: ${hits} hits`);assert.ok(guards>0,`${c.path}: ${guards} guards`);assert.ok(w.roundFlow.roundNo>=2);assert.deepEqual(w.diagnostics,[]);
  }
});
