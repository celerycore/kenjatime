import {test} from 'node:test';
import assert from 'node:assert/strict';
import {TrainingMatch} from '../src/combat.js';
import {parseSections} from '../src/runtime.js';
import {COMMON_STATES} from '../src/common.js';

function character(attack=false,localcoord='320,240'){
  const script=`[Statedef 0]\ntype=S\nmovetype=${attack?'A':'I'}\nphysics=N\nctrl=0\nanim=0`;
  return{path:'c.def',def:{info:{name:'Fighter',localcoord},files:{cns:'c.cns'}},files:{'c.cns':new TextEncoder().encode(script)},animations:[{id:0,frames:[{group:0,number:0,x:0,y:0,ticks:-1,clsn1:attack?[[0,-50,60,0]]:[],clsn2:[[-10,-40,10,0]]}]}]};
}
function setup(extra='',options={}){
  const world=new TrainingMatch(character(true,options.localcoord),{commonText:COMMON_STATES,opponentCharacter:character(),pushboxes:false,initialize:false});
  const controller={...parseSections('[State Hit]\ntype=HitDef\nattr=S,NA\ndamage=1\nground.velocity=-4,0\nground.hittime=10\n'+extra)[0],type:'hitdef'};
  const hit=world.player.parseHitDef(controller);world.player.hitDef=hit;world.player.pos.x=-20;world.opponent.pos.x=20;return{world,hit};
}

test('Corner push waits through hitpause, moves away from the wall and decays independently of scripted velocity',()=>{
  const {world}=setup('ground.cornerpush.veloff=-12\npausetime=2,2');world.player.pos.x=90;world.opponent.pos.x=world.horizontalLimits(world.opponent).max;
  world.tick();assert.equal(world.player.cornerPush,-12);assert.equal(world.player.pos.x,90);world.tick();world.tick();assert.equal(world.player.pos.x,90);
  world.tick();assert.equal(world.player.pos.x,78);assert.ok(Math.abs(world.player.cornerPush+10.2)<1e-9);
});

test('Corner push mirrors and remains inactive away from boundaries or with ScreenBound disabled',()=>{
  const {world}=setup('ground.cornerpush.veloff=-12');world.player.facing=-1;world.opponent.facing=1;world.player.pos.x=-90;world.opponent.pos.x=world.horizontalLimits(world.opponent).min;
  world.tick();assert.equal(world.player.cornerPush,12);world.tick();assert.ok(world.player.pos.x>-90);
  const middle=setup('ground.cornerpush.veloff=-12').world;middle.tick();assert.equal(middle.player.cornerPush,0);
  const free=setup('ground.cornerpush.veloff=-12').world;free.opponent.pos.x=free.horizontalLimits(free.opponent).max;free.opponent.screenBound=false;free.applyCornerPush(free.player,free.opponent,-12);assert.equal(free.player.cornerPush,0);
});

test('Native corner-push defaults inherit ground/guard offsets and aerial attacks default to zero',()=>{
  const {world,hit}=setup('guard.velocity=-5\nguard.cornerpush.veloff=-9');assert.equal(hit['ground.cornerpush.veloff'],-6.5);assert.equal(hit['air.cornerpush.veloff'],-6.5);assert.equal(hit['down.cornerpush.veloff'],-6.5);assert.equal(hit['airguard.cornerpush.veloff'],-9);
  const controller={...parseSections('[State Hit]\nattr=A,NA\nguard.velocity=-5')[0],type:'hitdef'};assert.equal(world.player.parseHitDef(controller)['ground.cornerpush.veloff'],0);
});

test('Hit positioning clamps signed offsets in the attacker coordinates and mirrors both faces',()=>{
  for(const facing of [1,-1]){
    const {world,hit}=setup('mindist=50,-100\nmaxdist=100,-10',{localcoord:'1280,720'});world.player.facing=facing;world.player.pos={x:10,y:5};world.opponent.pos={x:10,y:-100};
    world.opponent.receiveHit(hit,world.player);assert.deepEqual(world.opponent.pos,{x:10+12.5*facing,y:-20});
    assert.ok(!world.player.diagnostics.some(d=>d.type==='unsupported-hitdef-parameter'));
  }
});

test('Snap overrides distance limits on an unguarded hit, while guarding preserves the defender position',()=>{
  const {world,hit}=setup('mindist=50,-100\nsnap=30,-20');world.player.pos={x:10,y:5};world.opponent.pos={x:20,y:0};
  world.opponent.receiveHit(hit,world.player);assert.deepEqual(world.opponent.pos,{x:40,y:-15});
  const guarded=setup('snap=30,-20');guarded.world.opponent.receiveHit(guarded.hit,guarded.world.player,{guarded:true});assert.deepEqual(guarded.world.opponent.pos,{x:20,y:0});
});

test('Fall animation type uses the previous falling state and accepts the native Med spelling',()=>{
  const {world,hit}=setup('animtype=Hard\nair.animtype=Hard\nfall.animtype=Med');world.opponent.stateType='A';world.opponent.getHitVars.fall=1;
  world.opponent.receiveHit(hit,world.player);assert.equal(world.opponent.getHitVars.animtype,1);
  const air=setup('animtype=Light\nair.animtype=Hard\nfall.animtype=Med');air.world.opponent.stateType='A';air.world.opponent.receiveHit(air.hit,air.world.player);assert.equal(air.world.opponent.getHitVars.animtype,2);
  const fallback=setup('animtype=Light');fallback.world.opponent.stateType='A';fallback.world.opponent.getHitVars.fall=1;fallback.world.opponent.receiveHit(fallback.hit,fallback.world.player);assert.equal(fallback.world.opponent.getHitVars.animtype,3);
  const up=setup('animtype=Up');up.world.opponent.stateType='A';up.world.opponent.getHitVars.fall=1;up.world.opponent.receiveHit(up.hit,up.world.player);assert.equal(up.world.opponent.getHitVars.animtype,4);
});

test('HitFallDamage respects fall.kill and applies only during an active falling hit reaction',()=>{
  const {world}=setup(),f=world.opponent,controller={type:'hitfalldamage',values:{},entries:[]};
  f.life=10;f.getHitVars={'fall.damage':20,'fall.kill':0,fall:1};f.moveType='H';f.execute(controller);assert.equal(f.life,1);
  f.getHitVars['fall.kill']=1;f.getHitVars['fall.damage']=20;f.execute(controller);assert.equal(f.life,0);assert.equal(f.getHitVars['fall.damage'],0);f.life=10;f.moveType='I';f.execute(controller);assert.equal(f.life,10);
});
