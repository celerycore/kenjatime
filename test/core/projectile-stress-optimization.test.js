import {test} from 'node:test';
import assert from 'node:assert/strict';
import {TrainingMatch} from '../../src/combat.js';
import {ProjectileConstants} from '../../src/projectiles.js';

const encode=s=>new TextEncoder().encode(s);
const boxes=[[-8,-24,8,0]];
const character={
  path:'projectile-stress.def',
  def:{info:{name:'Projectile stress'},files:{cns:'projectile-stress.cns'}},
  files:{'projectile-stress.cns':encode('[Data]\nlife=2000\npower=3000\n[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nctrl=0\nanim=0\n')},
  animations:[0,200].map(id=>({id,frames:[{group:0,number:0,ticks:-1,clsn2:boxes,clsn1:id===200?boxes:[]}]})),
};
const spec={projanim:200,velocity:[0,0],projremovetime:-1,
  projheightbound:[-20,10],projedgebound:20,projstagebound:30,
  hitDef:{attr:'S,NP',serial:1,damage:[1,0],pauseTime:[0,0],groundVelocity:[0,0],hitFlag:'MAF'}};
function match(){const m=new TrainingMatch(character,{initialize:false,orderedPhases:true,pushboxes:false});m.player.pos.x=-60;m.opponent.pos.x=60;return m;}

test('projectile constants inherit source values without cloning the full program',()=>{
  const m=match(),a=m.spawnProjectile(m.player,spec),b=m.spawnProjectile(m.player,spec);
  assert.ok(a.program.constants instanceof ProjectileConstants);
  assert.notEqual(a.program.constants,b.program.constants);
  assert.equal(a.program.constants.base,m.player.program.constants);
  assert.equal(a.program.constants.size,4,'only projectile-specific overrides should be allocated');
  assert.equal(a.program.constants.get('data.life'),m.player.program.constants.get('data.life'));
  a.program.constants.set('data.life',77);
  assert.equal(a.program.constants.get('data.life'),77);
  assert.equal(b.program.constants.get('data.life'),m.player.program.constants.get('data.life'));
  assert.equal(m.player.program.constants.get('data.life'),2000);
  assert.deepEqual(a.heightBounds,[-20,10]);
  assert.equal(a.edgeBound,20);
  assert.equal(a.stageBound,30);
  assert.equal(a.removeTime,-1);
});

test('projectile broadphase skips detailed box comparisons for separated shots',()=>{
  const m=match(),a=m.spawnProjectile(m.player,spec),b=m.spawnProjectile(m.opponent,spec);
  a.pos.x=-60;b.pos.x=60;
  m.tick();
  assert.ok(m.projectileClashStats.pairsVisited>=1);
  assert.equal(m.projectileClashStats.narrowphaseCalls,0);
});

test('projectile broadphase still detects overlapping opposing shots',()=>{
  const m=match(),a=m.spawnProjectile(m.player,spec),b=m.spawnProjectile(m.opponent,spec);
  a.pos.x=0;b.pos.x=0;
  m.tick();
  assert.ok(m.projectileClashStats.narrowphaseCalls>0);
});

test('the projectile broadphase buffer remains bounded under the configured capacity',()=>{
  const m=match();
  assert.equal(m._projectileClashBounds.length,m.maxProjectiles*4);
  for(let i=0;i<24;i++){
    const projectile=m.spawnProjectile(i%2?m.opponent:m.player,spec);
    projectile.pos.x=(i%2?1:-1)*Math.floor(i/2)*5;
  }
  m.tick();
  assert.ok(m.projectileClashStats.narrowphaseCalls<=m.projectileClashStats.pairsVisited);
});
