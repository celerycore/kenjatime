import {test} from 'node:test';
import assert from 'node:assert/strict';
import {TrainingMatch} from '../../src/combat.js';
import {adaptKotlinWasmCombatModule} from '../../src/core/kotlin-wasm-combat.js';

const encode=s=>new TextEncoder().encode(s);
const boxes=[[-12,-30,12,0],[-6,-45,6,-30]];
const character={
  path:'kotlin-bridge.def',
  def:{info:{name:'Kotlin bridge fixture'},files:{cns:'fixture.cns'}},
  files:{'fixture.cns':encode('[Data]\nlife=2000\npower=3000\n[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nctrl=0\nanim=0\n')},
  animations:[0,200].map(id=>({id,frames:[{group:0,number:0,ticks:-1,clsn2:boxes,clsn1:id===200?boxes:[]}]})),
};
const spec={projanim:200,velocity:[0,0],projremovetime:-1,
  projremove:0,projhits:1000,projpriority:4,hitDef:{
    attr:'S,NP',serial:1,damage:[1,0],pauseTime:[0,0],groundVelocity:[0,0],hitFlag:'MAF'
  }};

// This mock verifies *host integration*. Independently, commonTest verifies
// the Kotlin implementation on JVM/Wasm; it is not an actual Wasm binary.
class ReferenceKotlinKernel {
  constructor(limit) {this.limit=limit;this.items=[];this.pairs=[];this.examined=0;}
  clear(){this.items=[];this.pairs=[];this.examined=0;}
  add(x0,y0,x1,y1,team,frozen,removing){
    if(this.items.length===this.limit)throw Error('overflow');
    this.items.push({x0,y0,x1,y1,team,frozen,removing});
  }
  collect(inclusive){
    this.pairs=[];this.examined=0;
    for(let i=0;i<this.items.length;i++){
      const a=this.items[i];if(a.removing||!Number.isFinite(a.x0)||!Number.isFinite(a.y0)||!Number.isFinite(a.x1)||!Number.isFinite(a.y1)||a.x0>a.x1||a.y0>a.y1)continue;
      for(let j=i+1;j<this.items.length;j++){
        const b=this.items[j];
        if(a.team===b.team||b.removing||a.frozen&&b.frozen||!Number.isFinite(b.x0)||!Number.isFinite(b.y0)||!Number.isFinite(b.x1)||!Number.isFinite(b.y1)||b.x0>b.x1||b.y0>b.y1)continue;
        this.examined++;
        const x=inclusive?a.x0<=b.x1&&a.x1>=b.x0:a.x0<b.x1&&a.x1>b.x0;
        const y=inclusive?a.y0<=b.y1&&a.y1>=b.y0:a.y0<b.y1&&a.y1>b.y0;
        if(x&&y)this.pairs.push([i,j]);
      }
    }
    return this.pairs.length;
  }
  left(i){return this.pairs[i][0];}
  right(i){return this.pairs[i][1];}
  examinedPairs(){return this.examined;}
  phaseMask(root,keyCtrl,ownsState,worldPaused,initializing,destroyed){
    if(destroyed)return 0;
    let mask=1|32;
    if(worldPaused)return mask;
    mask|=16;
    if(root){if(ownsState)mask|=2;mask|=4;}
    if(keyCtrl&&ownsState&&!initializing)mask|=8;
    return mask;
  }
}
const backend=adaptKotlinWasmCombatModule({KenjatimeCombatKernel:ReferenceKotlinKernel});
function match(enable,positions){
  const m=new TrainingMatch(character,{orderedPhases:true,initialize:false,pushboxes:false,
    kotlinCombatBackend:enable?backend:null,maxProjectiles:256});
  m.player.pos.x=-70;m.opponent.pos.x=70;
  for(let i=0;i<positions.length;i++){
    const p=m.spawnProjectile(i%2?m.opponent:m.player,{...spec,projid:i+1});
    p.pos.x=positions[i];p.pos.y=i%3;
  }
  return m;
}
function snapshot(m) {
  return JSON.stringify({
    tick:m.ticks,life:[m.player.life,m.opponent.life],
    projectiles:m.projectiles.map(p=>[p.id,p.pos.x,p.pos.y,p.time,p.remainingHits,p.priority,p.removing,p.removed]),
    diagnostics:m.diagnostics.filter(d=>d.type==='kotlin-wasm-fallback')
  });
}
for(const [name,positions] of [
  ['spread',Array.from({length:60},(_,i)=>(i-30)*40)],
  ['dense',Array.from({length:60},(_,i)=>(i%6)*3)],
  ['edge',Array.from({length:60},(_,i)=>(i%2)*24)]
]){
  test('Kotlin combat adapter matches JS phases and collision resolution: '+name,()=>{
    const js=match(false,positions),wasm=match(true,positions);
    assert.ok(wasm.kotlinCombatKernel);
    for(let frame=0;frame<65;frame++){
      js.tick();wasm.tick();
      assert.equal(snapshot(wasm),snapshot(js),'first divergence at tick '+frame);
    }
    assert.equal(wasm.diagnostics.filter(d=>d.type==='kotlin-wasm-fallback').length,0);
  });
}
test('broken Wasm ABI is rejected before integration',()=>{
  assert.throws(()=>adaptKotlinWasmCombatModule({}),/export/);
  assert.throws(()=>new TrainingMatch(character,{kotlinCombatBackend:adaptKotlinWasmCombatModule({
    KenjatimeCombatKernel:class {clear(){}}
  })}),/Missing Kotlin/);
});
test('invalid pair result triggers JS fallback, not a broken match',()=>{
  class FailingKernel extends ReferenceKotlinKernel {collect(){throw Error('simulated Wasm fault');}}
  const fail=adaptKotlinWasmCombatModule({KenjatimeCombatKernel:FailingKernel});
  const js=match(false,Array.from({length:12},(_,i)=>i*4));
  const wasm=match(false,Array.from({length:12},(_,i)=>i*4));
  wasm.kotlinCombatKernel=fail.createProjectileKernel(256);
  js.tick();wasm.tick();
  assert.equal(wasm.kotlinCombatKernel,null);
  assert.ok(wasm.diagnostics.some(d=>d.type==='kotlin-wasm-fallback'));
  assert.deepEqual(wasm.projectiles.map(p=>[p.time,p.priority]),js.projectiles.map(p=>[p.time,p.priority]));
});
