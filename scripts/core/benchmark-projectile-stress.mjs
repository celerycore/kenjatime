/** Opt-in synthetic CPU stress workload, for Dark Donald-class projectile volume.
 * No imported character assets, browser frames, GPU, audio or real-device FPS.
 */
import {performance} from 'node:perf_hooks';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const root=fileURLToPath(new URL('../../',import.meta.url));
const source=resolve(process.env.CORE_BENCH_SOURCE||root);
const {TrainingMatch}=await import(pathToFileURL(resolve(source,'src/combat.js')));
const encode=text=>new TextEncoder().encode(text);
const boxes=[[-8,-16,8,0]];
const character={
  path:'load.def',def:{info:{name:'Projectile stress'},files:{cns:'load.cns'}},
  files:{'load.cns':encode('[Data]\nlife=1000000\npower=3000\n[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nctrl=0\nanim=0\n')},
  animations:[0,200].map(id=>({id,frames:[{group:0,number:0,ticks:-1,clsn1:id===200?boxes:[],clsn2:boxes}]})),
};
const spec={projanim:200,projremove:0,projhits:100000,projpriority:100,
  projedgebound:1000000,projstagebound:1000000,projremovetime:-1,
  velocity:[0,0],hitDef:{attr:'S,NP',damage:[1,0],pauseTime:[0,0],groundVelocity:[0,0],hitFlag:'MAF'}};
function setup(count,layout){
  const match=new TrainingMatch(character,{orderedPhases:true,initialize:false,pushboxes:false,maxProjectiles:512});
  match.player.pos.x=-70;match.opponent.pos.x=70;
  for(let i=0;i<count;i++){
    const owner=i%2?match.opponent:match.player;
    const shot=match.spawnProjectile(owner,{...spec,projid:i+1});
    if(!shot||shot.removed)throw Error('Projectile capacity or animation error');
    shot.pos.x=layout==='spread'?i*50:0;
    shot.pos.y=0;
  }
  return match;
}
function digest(match){
  let value=2166136261;
  for(const p of match.projectiles)
    for(const n of [p.id,p.time,p.remainingHits,p.pos.x,p.pos.y,p.priority])
      value=Math.imul(value^Math.trunc((n||0)*1024),16777619)>>>0;
  return value;
}
const workloads=[
  {count:64,layout:'spread',ticks:180},
  {count:256,layout:'spread',ticks:120},
  {count:64,layout:'dense',ticks:80},
];
const results=[];
for(const task of workloads){
  const trials=[];
  for(let sample=0;sample<3;sample++){
    global.gc?.();
    const baseHeap=process.memoryUsage().heapUsed, t0=performance.now();
    const match=setup(task.count,task.layout);
    const buildMs=performance.now()-t0;
    const heapAfterSpawn=process.memoryUsage().heapUsed;
    let rawConstantEntries=0;
    for(const p of match.projectiles) rawConstantEntries+=p.program.constants.size;
    let narrowphase=0;
    const start=performance.now();
    for(let i=0;i<task.ticks;i++){
      match.tick();
      narrowphase+=match.projectileClashStats?.narrowphaseCalls||0;
    }
    const totalMs=performance.now()-start;
    if(match.projectiles.length!==task.count)throw Error('Unexpected projectile retirement');
    trials.push({sample:sample+1,buildMs:+buildMs.toFixed(3),
      totalMs:+totalMs.toFixed(3),meanTickMs:+(totalMs/task.ticks).toFixed(4),
      rawConstantEntries,heapAfterSpawnDeltaKiB:+((heapAfterSpawn-baseHeap)/1024).toFixed(1),
      narrowphaseCalls:narrowphase,digest:digest(match)});
  }
  if(new Set(trials.map(t=>t.digest)).size!==1)throw Error('Nondeterministic projectile result');
  const sorted=trials.map(t=>t.meanTickMs).sort((a,b)=>a-b);
  results.push({...task,medianTickMs:sorted[1],trials});
}
console.log(JSON.stringify({scope:'Headless JS Core synthetic projectile stress, not Dark Donald matchup or browser FPS',
  source,version:JSON.parse(readFileSync(resolve(source,'package.json'))).version,
  node:process.version,arch:process.arch,results},null,2));
