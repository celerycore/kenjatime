/** Opt-in Kenjatime Core CPU benchmark for unmodified character packages.
 * node scripts/core/benchmark-character-packages.mjs <ZIP-or-extracted-directory> [ticks=120] [runs=3]
 * For RAR, extract the contents locally first (preserve directory structure).
 * Headless fixed-tick measurement: NOT browser FPS / native MUGEN parity.
 */
import { readFileSync, readdirSync, lstatSync, statSync } from 'node:fs';
import { resolve, relative, join, extname } from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import { packageFiles, normalizedPackageFiles, charactersFromFiles } from '../../src/formats.js';
import { CoreSession } from '../../src/core/session.js';
const root=fileURLToPath(new URL('../../',import.meta.url));
if (!process.argv[2]) throw Error('Supply a character ZIP or extracted directory');
const input=resolve(process.argv[2]),ticks=Number(process.argv[3]||120),runs=Number(process.argv[4]||3);
if (!Number.isSafeInteger(ticks)||ticks<1||ticks>1200||!Number.isSafeInteger(runs)||runs<1||runs>10)
  throw Error('ticks 1..1200 and runs 1..10 are required');
function load(input) {
  if (statSync(input).isFile()) {
    if(extname(input).toLowerCase()!=='.zip') throw Error('Extract RAR locally and pass its directory');
    return packageFiles(readFileSync(input));
  }
  const entries=[];let bytes=0;
  function walk(dir) {
    for(const name of readdirSync(dir)) {
      const p=join(dir,name),s=lstatSync(p);
      if(s.isSymbolicLink()) throw Error('Unsafe symlink: '+p);
      if(s.isDirectory()){walk(p);continue;}
      if(!s.isFile())continue;
      if(entries.length>=5000) throw Error('Archive file limit exceeded');
      bytes+=s.size;
      if(bytes>512*1024*1024) throw Error('Expanded input exceeds 512 MiB');
      entries.push([relative(input,p).replaceAll('\\','/'),readFileSync(p)]);
    }
  }
  walk(input);
  return normalizedPackageFiles(entries);
}
const loadStart=performance.now(),imported=load(input),loadMs=performance.now()-loadStart;
const candidates=charactersFromFiles(imported);
const character=candidates.find(c=>/rare\s*akuma|dark\s*donald|donald/i.test(c.def.info?.displayname||c.def.info?.name||''))||candidates[0];
if(!character) throw Error('No playable character DEF');
const missing=character.checks.filter(c=>!c.ok&&c.key!=='stcommon').map(c=>c.key+': '+c.value);
if(missing.length) throw Error('Missing local resource: '+missing.join(', '));
const files={...packageFiles(readFileSync(resolve(root,'public/kfm.zip'))),...imported};
const samples=[],errors=[];
for(let run=0;run<runs;run++){
  let session;
  try {
    const t0=performance.now();
    session=new CoreSession(files,{character:character.path,opponent:'kfm/kfm.def',mode:'training'});
    const setupMs=performance.now()-t0;
    session.match.player.changeState(0,1,session.match.player);
    session.match.opponent.changeState(0,1,session.match.opponent);
    let totalMs=0,maxTickMs=0,peakActors=0,peakProjectiles=0;
    for(let i=0;i<ticks;i++){
      const start=performance.now();
      session.tick();
      const duration=performance.now()-start;
      totalMs+=duration;maxTickMs=Math.max(maxTickMs,duration);
      peakActors=Math.max(peakActors,session.match.entities.length);
      peakProjectiles=Math.max(peakProjectiles,session.match.projectiles.length);
    }
    let hash=2166136261;
    for(const entity of [...session.match.entities,...session.match.projectiles])
      for(const v of [entity.id,entity.stateNo,entity.time,entity.life,entity.pos?.x,entity.pos?.y])
        hash=Math.imul(hash^Math.round(Number(v||0)*1024),16777619)>>>0;
    samples.push({run:run+1,setupMs:+setupMs.toFixed(2),totalTickMs:+totalMs.toFixed(2),
      meanTickMs:+(totalMs/ticks).toFixed(4),worstTickMs:+maxTickMs.toFixed(2),
      peakActors,peakProjectiles,checksum:hash,heapMiB:+(process.memoryUsage().heapUsed/1048576).toFixed(2)});
  }catch(error){errors.push({run:run+1,error:String(error?.stack||error)});break;}
  finally {session?.close();}
}
const means=samples.map(s=>s.meanTickMs).sort((a,b)=>a-b);
console.log(JSON.stringify({kind:'Kenjatime Core headless CPU tick benchmark',source:input,
  character:character.def.info?.displayname||character.def.info?.name,
  loadMs:+loadMs.toFixed(2),ticks,runs,medianTickMs:means.length?means[Math.floor(means.length/2)]:null,
  stableChecksums:samples.length===runs&&new Set(samples.map(s=>s.checksum)).size===1,
  samples,errors,limits:'No GPU FPS, audio, natural AI matchup, Android performance, or native parity'},null,2));
if(errors.length)process.exitCode=1;
