/**
 * Real-asset, opt-in Kenjatime Core marathon for the three supplied characters.
 *
 * Usage:
 * node scripts/core/verify-character-trio.mjs \
 *   '/local/RareAkuma(1).zip' '/local/Rare Akuma(1).zip' \
 *   '/local/Dark-Donald-extracted' [--ticks=240] [--runs=2] \
 *   [--states] [--render] [--wasm=/absolute/build-output.mjs] [--strict]
 *   [--fightfx-dir=/local/verified/engine/data]
 *
 * This script intentionally requires all three *real* assets. It never
 * substitutes KFM and labels it "Dark Donald" or "Rare Akuma". Original
 * archives remain local: no uploads, check-ins, or remote API requests.
 */
import {readFileSync,readdirSync,statSync,lstatSync,mkdirSync,writeFileSync,existsSync} from 'node:fs';
import {resolve,relative,join,extname,dirname} from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {performance} from 'node:perf_hooks';
import {packageFiles,normalizedPackageFiles,charactersFromFiles} from '../../src/formats.js';
import {CoreSession} from '../../src/core/session.js';
import {importKotlinWasmCombatBackend} from '../../src/core/kotlin-wasm-combat.js';

const root=fileURLToPath(new URL('../../',import.meta.url));
const input=process.argv.slice(2),options=input.filter(a=>a.startsWith('--'));
const paths=input.filter(a=>!a.startsWith('--'));
if(paths.length!==3)throw Error('Required: 2026 RareAkuma ZIP, 2007 Rare Akuma ZIP, extracted Dark Donald directory');
const get=(key,fallback)=>options.find(o=>o.startsWith('--'+key+'='))?.slice(key.length+3)??fallback;
const ticks=Number(get('ticks','240')),runs=Number(get('runs','2'));
if(!Number.isSafeInteger(ticks)||ticks<1||ticks>1800||!Number.isSafeInteger(runs)||runs<1||runs>6)
  throw Error('--ticks must be 1..1800 and --runs 1..6');
const includeStates=options.includes('--states'),render=options.includes('--render'),strict=options.includes('--strict');
const fightfxDir=get('fightfx-dir',null);
const fxFiles={};
const fxSha={};
if(fightfxDir){
  // Load ONLY a matched genuine AIR/SFF pair. Never invent F2/F60 frames,
  // combine incompatible installations, or commit redistributable assets.
  for(const name of ['fightfx.air','fightfx.sff','fight.def']){
    const disk=resolve(fightfxDir,name);
    if(existsSync(disk)&&statSync(disk).isFile()){
      const bytes=readFileSync(disk);
      fxFiles['data/'+name]=bytes;
      fxSha[name]=createHash('sha256').update(bytes).digest('hex');
    }
  }
  if(!fxFiles['data/fightfx.air']||!fxFiles['data/fightfx.sff'])
    throw Error('--fightfx-dir must contain fightfx.air and fightfx.sff from one engine installation');
}
const wasmPath=get('wasm',null);
const backend=wasmPath?await importKotlinWasmCombatBackend(pathToFileURL(resolve(wasmPath)).href):null;
const kfmArchive=readFileSync(resolve(root,'public/kfm.zip'));
const kfmFiles=packageFiles(kfmArchive);
if(!charactersFromFiles(kfmFiles).some(c=>c.path==='kfm/kfm.def'))
  throw Error('Bundled KFM regression opponent is missing');

function load(path){
  const absolute=resolve(path),stat=statSync(absolute);
  if(stat.isFile()){
    if(extname(path).toLowerCase()!=='.zip')throw Error('RAR must first be extracted into a directory: '+path);
    const buf=readFileSync(absolute);
    return {files:packageFiles(buf),sha256:createHash('sha256').update(buf).digest('hex'),bytes:buf.length};
  }
  if(!stat.isDirectory())throw Error('Not a directory: '+path);
  const entries=[];let size=0,hash=createHash('sha256');
  const walk=dir=>{
    for(const name of readdirSync(dir).sort()){
      const abs=join(dir,name),stat=lstatSync(abs);
      if(stat.isSymbolicLink())throw Error('Archive symlink rejected: '+abs);
      if(stat.isDirectory()){walk(abs);continue;}
      if(!stat.isFile())continue;
      if(entries.length>=5000)throw Error('Archive has too many entries');
      size+=stat.size;if(size>512*1048576)throw Error('Expanded character exceeds 512 MiB');
      const rel=relative(absolute,abs).replaceAll('\\','/');
      const data=readFileSync(abs);
      entries.push([rel,data]);
      hash.update(rel);hash.update(data);
    }
  };
  walk(absolute);
  return {files:normalizedPackageFiles(entries),sha256:hash.digest('hex'),bytes:size};
}
function chosenCharacter(files,required){
  const candidates=charactersFromFiles(files);
  const names=candidates.map(c=>c.def.info?.name||'');
  const filtered=candidates.filter(c=>required.test((c.def.info?.name||'')+' '+(c.def.info?.displayname||'')+' '+c.path));
  if(filtered.length!==1)throw Error('Expected one '+required+' character, found '+filtered.length+': '+JSON.stringify(names));
  return filtered[0];
}
function stateRecord(match) {
  const actors=match.entities.map(p=>({
    id:p.id,owner:p.root?.id,st:p.stateNo,time:p.time,anim:p.anim,frame:p.frameIndex,
    x:p.pos.x,y:p.pos.y,vx:p.vel.x,vy:p.vel.y,life:p.life,power:p.power,
    vars:[...p.vars],fvars:[...p.fvars],hitPause:p.hitPauseTime,ai:p.aiLevel
  }));
  const shots=match.projectiles.map(p=>({
    id:p.id,owner:p.owner?.id,anim:p.anim,frame:p.frameIndex,
    x:p.pos.x,y:p.pos.y,vx:p.vel.x,vy:p.vel.y,time:p.time,
    hits:p.remainingHits,priority:p.priority,removing:p.removing
  }));
  return {ticks:match.ticks,round:match.roundFlow?.roundState??2,actors,shots};
}
function checkFinite(match){
  for(const actor of [...match.entities,...match.projectiles])
    for(const v of [actor.pos.x,actor.pos.y,actor.vel.x,actor.vel.y,actor.life,actor.power])
      if(!Number.isFinite(v))throw Error('Non-finite match state in entity '+actor.id);
}
async function runOne(asset,character,index,useBackend){
  const files={...kfmFiles,...asset.files,...fxFiles};
  let session,hash=createHash('sha256'),samples=[],firstIssue=null,peakEntities=0,peakShots=0,frameMs=0,tickMs=0,setupMs=0,renderedFrames=0;
  let probe={attempted:0,accepted:0,failures:[]};
  try{
    const started=performance.now();
    session=new CoreSession(files,{
      character:character.path,opponent:'kfm/kfm.def',
      mode:'cpu',level:5,kotlinCombatBackend:useBackend?backend:null
    });
    await session.initializeScripts();
    setupMs=performance.now()-started;
    for(let i=0;i<ticks;i++){
      const t0=performance.now();
      session.tick();
      tickMs+=performance.now()-t0;
      checkFinite(session.match);
      if(render&&i%10===0){
        const rt=performance.now(),packet=session.frame();
        frameMs+=performance.now()-rt;
        if(!packet||!Array.isArray(packet.draws))throw Error('Malformed frame packet');
        renderedFrames++;
      }
      peakEntities=Math.max(peakEntities,session.match.entities.length);
      peakShots=Math.max(peakShots,session.match.projectiles.length);
      const snapshot=stateRecord(session.match);
      hash.update(JSON.stringify(snapshot));hash.update('\n');
      if(i===0||i===59||i===ticks-1)
        samples.push({tick:i+1,state:session.match.player.stateNo,
          helpers:session.match.entities.length-2,shots:session.match.projectiles.length,
          life:session.match.player.life,round:session.match.roundFlow?.roundState??2});
    }
    firstIssue=session.match.diagnostics.slice(0,15);
    // Never silently report a JavaScript fallback as successful Wasm replay.
    if(useBackend&&!session.match.kotlinCombatKernel)
      throw Error('Kotlin/Wasm backend fell back during live combat');
    if(includeStates){
      // Forced entry is a crash/finite smoke probe, NOT natural state
      // reachability or authoritative native IKEMEN/MUGEN parity.
      const probeHash=createHash('sha256');
      const ids=[...session.match.player.program.states.keys()].filter(Number.isInteger).filter(id=>id>=0).sort((a,b)=>a-b);
      for(const id of ids){
        probe.attempted++;
        try{
          session.match.reset();
          const actor=session.match.player;
          if(!actor.changeState(id,0,actor))throw Error('State entry rejected');
          session.tick();checkFinite(session.match);
          probeHash.update(JSON.stringify(stateRecord(session.match))+'\n');
          probe.accepted++;
        }catch(e){if(probe.failures.length<30)probe.failures.push({state:id,error:String(e?.message||e)});}
      }
      probe.sha256=probeHash.digest('hex');
    }
    return {pass:true,backend:useBackend?'kotlin-wasm':'javascript',
      activeKotlinKernel:!!session.match.kotlinCombatKernel,
      sha256:hash.digest('hex'),setupMs:+setupMs.toFixed(2),
      cpuTickMs:+tickMs.toFixed(2),avgTickMs:+(tickMs/ticks).toFixed(4),
      renderMs:+frameMs.toFixed(2),renderedFrames,peakEntities,peakShots,
      memoryHeapMiB:+(process.memoryUsage().heapUsed/1048576).toFixed(2),
      samples,issues:firstIssue,probe};
  }catch(error){
    return {pass:false,backend:useBackend?'kotlin-wasm':'javascript',
      error:String(error?.stack||error).slice(0,2500),samples,probe};
  }finally{session?.close();}
}
const report={kind:'Kenjatime Core real three-package runtime benchmark',
  date:'2026-11-11',notes:[
    'Headless AI-driven script simulation, selected render-packet checks, optional forced-state smoke probes',
    'Not native MUGEN/IKEMEN parity, GPU frame-rate, Android, human gameplay or exhaustive combo verification',
    'No source asset uploaded; results are from the supplied local packages only'
  ],ticks,runs,render,includeStates,compiledWasmProvided:!!backend,
  matchedFightFx: fightfxDir?{directory:fightfxDir,sha256:fxSha}:null,results:[]};
for(const [i,path] of paths.entries()){
  const label=['Rare Akuma 2026 ZSS','Rare Akuma 2007 legacy','Dark Donald 2011'][i];
  const asset=load(path);
  const character=chosenCharacter(asset.files,i===2?/donald/i:/rare\s*akuma/i);
  const entry={label,source:path,archiveSha256:asset.sha256,archiveBytes:asset.bytes,
    character:character.path,resources:character.checks,
    animationActions:character.animations.length,runs:[]};
  for(let run=0;run<runs;run++){
    entry.runs.push(await runOne(asset,character,run,false));
    if(backend)entry.runs.push(await runOne(asset,character,run,true));
  }
  const js=entry.runs.filter(r=>r.backend==='javascript'),wasm=entry.runs.filter(r=>r.backend==='kotlin-wasm');
  entry.deterministic=js.every(r=>r.pass)&&new Set(js.map(r=>r.sha256)).size===1;
  entry.wasmParity=backend?wasm.every(r=>r.pass)&&wasm.every((r,j)=>r.sha256===js[j]?.sha256&&(!includeStates||r.probe.sha256===js[j]?.probe.sha256)):null;
  report.results.push(entry);
  console.log(label,JSON.stringify({deterministic:entry.deterministic,
    wasmParity:entry.wasmParity,runs:entry.runs.map(r=>({
      pass:r.pass,backend:r.backend,avgTickMs:r.avgTickMs,peakShots:r.peakShots,error:r.error
    }))}));
}
const dest=resolve(get('output','work/core/character-trio-runtime.json'));
mkdirSync(dirname(dest),{recursive:true});writeFileSync(dest,JSON.stringify(report,null,2)+'\n');
console.log('Report:',dest);
if(strict&&report.results.some(r=>!r.deterministic||r.wasmParity===false||
  r.runs.some(run=>!run.pass||includeStates&&run.probe.accepted!==run.probe.attempted)))process.exitCode=1;
