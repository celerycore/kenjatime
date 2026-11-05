import {test} from 'node:test';
import assert from 'node:assert/strict';
import {TrainingMatch} from '../src/combat.js';
import {parseSections} from '../src/runtime.js';
import {COMMON_STATES} from '../src/common.js';

const encode=text=>new TextEncoder().encode(text);
function character(){return{path:'c.def',def:{info:{name:'Chain fixture'},files:{cns:'c.cns'}},files:{'c.cns':encode('[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nctrl=0\nanim=0\n[Statedef 200]\ntype=S\nmovetype=A\nphysics=N\nctrl=0\nanim=0\n[Statedef 201]\ntype=S\nmovetype=A\nphysics=N\nhitdefpersist=1')},animations:[{id:0,frames:[{group:0,number:0,x:0,y:0,ticks:-1,clsn1:[[0,-30,100,0]],clsn2:[[-10,-30,10,0]]}]}]};}
function world(){return new TrainingMatch(character(),{commonText:COMMON_STATES,initialize:false,pushboxes:false});}
function hit(actor,extra=''){
  const controller={...parseSections('[State Test]\ntype=HitDef\nattr=S,NA\ndamage=100,10\nguardflag=MA\nground.hittime=10\n'+extra)[0],type:'hitdef'};
  return actor.parseHitDef(controller);
}
function multi(extra=''){
  const w=world();w.player.pos.x=0;w.opponent.pos.x=60;
  const near=w.spawnHelper(w.opponent,{id:9,stateno:0});near.pos={x:20,y:0};
  const previous=w.spawnHelper(w.opponent,{id:10,stateno:0});previous.pos={x:130,y:0};
  w.player.changeState(200);w.player.hitDef=hit(w.player,extra);return{w,near,previous};
}

test('chainID requires the previous incoming hit ID, including a third party matching hit',()=>{
  const w=world(),follow=hit(w.player,'chainID=11');
  assert.equal(w.opponent.receiveHit(follow,w.player).rejected,true);assert.equal(w.opponent.life,1000);
  w.opponent.receiveHit(hit(w.player,'id=7'),w.player);assert.equal(w.opponent.receiveHit(follow,w.player).rejected,true);
  const third=w.spawnHelper(w.player,{id:9,stateno:0});w.opponent.receiveHit(hit(third,'id=11'),third);
  assert.equal(w.opponent.receiveHit(follow,w.player).damage,100);assert.equal(w.opponent.life,700);
});

test('nochainID accepts two IDs and ignores the old restriction after a third party intervenes',()=>{
  const w=world(),blocked=hit(w.player,'nochainID=7,11');
  for(const id of [7,11]){w.opponent.receiveHit(hit(w.player,`id=${id}`),w.player);assert.equal(w.opponent.receiveHit(blocked,w.player).rejected,true);}
  const third=w.spawnHelper(w.player,{id:9,stateno:0});w.opponent.receiveHit(hit(third,'id=11'),third);
  assert.equal(w.opponent.receiveHit(blocked,w.player).damage,100);
  w.opponent.receiveHit(hit(w.player,'id=13'),w.player);assert.equal(w.opponent.receiveHit(blocked,w.player).damage,100);
  assert.throws(()=>hit(w.player,'nochainID=1,2,3'),/at most two/);assert.deepEqual(w.player.diagnostics,[]);
});

test('rejected chain contacts leave their activation available for a later eligible hit',()=>{
  const w=world();w.player.pos.x=0;w.opponent.pos.x=30;w.player.changeState(200);w.player.hitDef=hit(w.player,'chainID=9');
  assert.equal(w.tick().length,0);assert.equal(w.opponent.life,1000);
  const third=w.spawnHelper(w.player,{id:8,stateno:0});w.opponent.receiveHit(hit(third,'id=9\ndamage=0'),third);
  assert.equal(w.tick().length,1);assert.equal(w.opponent.life,900);
});

test('hitonce selects the nearest colliding target and drops other targets and target IDs',()=>{
  const {w,near,previous}=multi('hitonce=1\nid=42');w.player.targets.push(previous,w.opponent);w.player.targetHitIds.set(previous.id,1);w.player.targetHitIds.set(w.opponent.id,2);
  const events=w.tick();assert.equal(events.length,1);assert.equal(events[0].defender,near);assert.equal(near.life,900);assert.equal(w.opponent.life,1000);
  assert.deepEqual(w.player.targets,[near]);assert.deepEqual([...w.player.targetHitIds],[[near.id,42]]);
  assert.equal(w.tick().length,0);assert.equal(w.opponent.life,1000);
});

test('throws default to hitonce while ordinary hits and explicit hitonce=0 can hit multiple targets',()=>{
  const thrown=multi('attr=S,NT');assert.equal(thrown.w.player.hitDef.hitonce,1);assert.equal(thrown.w.tick().length,1);
  for(const extra of ['', 'attr=S,NT\nhitonce=0']){
    const {w,near}=multi(extra);assert.equal(w.player.hitDef.hitonce,0);assert.equal(w.tick().length,2);assert.equal(near.life,900);assert.equal(w.opponent.life,900);
  }
});

test('hitonce stays consumed through hitdefpersist and a new HitDef starts a fresh activation',()=>{
  const {w,near}=multi('hitonce=1');assert.equal(w.tick().length,1);const original=w.player.hitDef;
  near.pos.x=180;w.player.changeState(201);assert.equal(w.player.hitDef,original);assert.equal(w.tick().length,0);
  w.player.hitDef=hit(w.player,'hitonce=1');const [contact]=w.tick();assert.equal(contact.defender,w.opponent);assert.equal(w.opponent.life,900);
});

test('guarded hitonce contacts consume the activation without damaging another overlapping defender',()=>{
  const {w,near}=multi('hitonce=1');near.pos.x=130;w.opponent.pos.x=20;w.opponent.ctrl=1;
  const [contact]=w.tick(new Set(),new Set(['holdback']));assert.equal(contact.guarded,true);assert.equal(w.opponent.life,990);
  near.pos.x=30;assert.equal(w.tick().length,0);assert.equal(near.life,1000);
});

test('projectile chains use their owner identity while projectile hits follow projhits and miss-time limits',()=>{
  const {w,near}=multi();w.player.hitDef=null;
  const projectile=w.spawnProjectile(w.player,{projanim:0,projhits:2,projremove:0,velocity:[0,0],hitDef:hit(w.player,'id=41\nhitonce=1')});projectile.pos={x:0,y:0};
  // Native projectile lifetime is controlled by projhits; hitonce does not drop the owner's other targets.
  w.player.targets.push(w.opponent);w.player.targetHitIds.set(w.opponent.id,10);
  assert.equal(w.tick().length,1);assert.equal(near.life,900);assert.equal(w.opponent.life,1000);
  assert.equal(near.receiveHit(hit(w.player,'nochainID=41'),w.player).rejected,true);
  assert.ok(w.player.targets.includes(w.opponent));
  near.pos.x=180;assert.equal(w.tick().length,1);assert.equal(w.opponent.life,900);
});
