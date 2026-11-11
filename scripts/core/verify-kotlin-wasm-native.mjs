/**
 * Loads the actual Kotlin/Wasm executable module, not the JS reference shim.
 * Invoked only after Gradle wasmJsNodeDevelopmentRun has compiled build output.
 */
import {readFileSync,readdirSync,statSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {unzipSync} from 'fflate';
import {TrainingMatch} from '../../src/combat.js';
import {CoreSession} from '../../src/core/session.js';
import {adaptKotlinWasmCombatModule} from '../../src/core/kotlin-wasm-combat.js';

const base=resolve(process.argv[2]||'kotlin-engine/build');
const matches=[];
function walk(dir,depth=0){
  if(depth>12)return;
  for(const item of readdirSync(dir)){
    const name=join(dir,item),info=statSync(name);
    if(info.isDirectory())walk(name,depth+1);
    else if(item.endsWith('.mjs')&&!item.includes('.test.'))matches.push(name);
  }
}
walk(base);
if(!matches.length)throw Error('Gradle produced no importable .mjs files in '+base);
const reports=[];
let found=null;
for(const filename of matches.sort()){
  try{
    const module=await import(pathToFileURL(filename).href);
    const raw=module?.default&&typeof module.default.createCombatKernel==='function'?module.default:module;
    reports.push({filename,exports:Object.keys(raw||{}).slice(0,30)});
    if(typeof raw?.createCombatKernel==='function'){found=module;break;}
  }catch(error){reports.push({filename,error:String(error?.message||error)});}
}
if(!found)throw Error('Kotlin/Wasm build did not expose combat ABI: '+JSON.stringify(reports).slice(0,6000));

const backend=adaptKotlinWasmCombatModule(found);
assert.equal(backend.kind,'kotlin-wasm-combat-v2');
const kernel=backend.createProjectileKernel(10);
kernel.clear();
kernel.add(0,0,10,10,1,false,false);
kernel.add(9,2,20,7,2,false,false);
kernel.add(30,0,40,10,2,false,false);
kernel.add(10,0,15,10,2,false,false);
assert.equal(kernel.collect(false),1);
assert.deepEqual([kernel.left(0),kernel.right(0)],[0,1]);
assert.equal(kernel.collect(true),2);
assert.deepEqual([kernel.left(0),kernel.right(0)],[0,1]);
assert.deepEqual([kernel.left(1),kernel.right(1)],[0,3]);
assert.equal(kernel.phaseMask(true,true,true,false,false,false),63);
assert.equal(kernel.phaseMask(false,false,false,true,false,false),33);
assert.equal(kernel.dispose(),true);
assert.equal(kernel.dispose(),false);
assert.throws(()=>kernel.collect(false),/disposed/);
// Exercise the real compiled module from the live TrainingMatch pipeline,
// not just the primitive ABI. JavaScript keeps HitDef/narrowphase authoritative.
const encode=text=>new TextEncoder().encode(text);
const box=[[-10,-28,10,0]];
const fighter={
  path:'wasm-real.def',
  def:{info:{name:'Wasm runtime fixture'},files:{cns:'fixture.cns'}},
  files:{'fixture.cns':encode('[Data]\nlife=10000\npower=3000\n[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nctrl=0\nanim=0\n')},
  animations:[0,200].map(id=>({id,frames:[{group:0,number:0,ticks:-1,clsn1:id===200?box:[],clsn2:box}]})),
};
const shotSpec={projanim:200,projremove:0,projhits:10000,
  projpriority:8,projremovetime:-1,velocity:[0,0],
  hitDef:{attr:'S,NP',damage:[1,0],pauseTime:[0,0],groundVelocity:[0,0],hitFlag:'MAF'}};
const mk=wasm=>{
  const match=new TrainingMatch(fighter,{
    initialize:false,pushboxes:false,orderedPhases:true,maxProjectiles:128,
    kotlinCombatBackend:wasm?backend:null
  });
  match.player.pos.x=-60;match.opponent.pos.x=60;
  for(let i=0;i<96;i++){
    const projectile=match.spawnProjectile(i%2?match.opponent:match.player,{...shotSpec,projid:i+1});
    if(!projectile)throw Error('Projectile spawn failed');
    projectile.pos.x=((i*17)%17)*8-64;
    projectile.pos.y=i%5;
  }
  return match;
};
const baseline=mk(false),live=mk(true);
for(let tick=0;tick<90;tick++){
  baseline.tick();live.tick();
  const state=m=>JSON.stringify({
    frame:m.ticks,life:[m.player.life,m.opponent.life],
    shots:m.projectiles.map(p=>[p.id,p.pos.x,p.pos.y,p.time,p.remainingHits,p.priority,p.removing])
  });
  assert.equal(state(live),state(baseline),'Kotlin/Wasm live match divergence at frame '+tick);
  assert.ok(live.kotlinCombatKernel,'Wasm backend unexpectedly fell back at frame '+tick);
}
live.kotlinCombatKernel.dispose();

// Validate the compiled scheduler through CoreSession and authored ZSS.
const baseFiles=unzipSync(readFileSync(new URL('../../public/kfm.zip',import.meta.url)));
const text=new TextDecoder().decode(baseFiles['kfm/kfm.def']);
baseFiles['kfm/kfm.def']=encode(text.replace('[Files]','[Files]\nst88=wasm-globals.zss\n'));
baseFiles['kfm/wasm-globals.zss']=encode(
  '[StateDef -4]\nvar(50):=var(50)+1;\n[StateDef +1]\nvar(51):=var(51)+2;\n'
);
const jsSession=new CoreSession(baseFiles,{mode:'training',character:'kfm/kfm.def'});
const wasmSession=new CoreSession(baseFiles,{mode:'training',character:'kfm/kfm.def',kotlinCombatBackend:backend});
try{
  for(let tick=0;tick<60;tick++){
    jsSession.tick();wasmSession.tick();
    const pick=s=>JSON.stringify({
      ticks:s.match.ticks,state:s.match.player.stateNo,
      a:s.match.player.vars[50],b:s.match.player.vars[51],
      x:s.match.player.pos.x,life:s.match.player.life
    });
    assert.equal(pick(wasmSession),pick(jsSession),'Kotlin/Wasm ZSS divergence at frame '+tick);
    assert.ok(wasmSession.match.kotlinCombatKernel,'Unexpected ZSS backend fallback');
  }
}finally{jsSession.close();wasmSession.close();}
console.log(JSON.stringify({status:'pass',kind:backend.kind,module:reports.at(-1).filename,
  liveMatchFrames:90,projectiles:96,liveZssFrames:60,
  checks:['narrowphase candidate ABI','strict/inclusive edges','global schedule',
    'handle cleanup','real compiled Wasm TrainingMatch parity','real compiled Wasm CoreSession ZSS parity']},null,2));
