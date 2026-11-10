/**
 * Runtime smoke/benchmark against the REAL bundled KFM archive.
 * It never claims native MUGEN tick parity. CLI: node scripts/core/benchmark-kotlin-wasm.mjs
 */
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { performance } from 'node:perf_hooks';
import { pathToFileURL } from 'node:url';
import { unzipSync } from 'fflate';

function modulePath(directory, depth=0) {
  if (depth > 12) return null;
  for (const entry of readdirSync(directory,{withFileTypes:true})) {
    const full=join(directory,entry.name);
    if (entry.isDirectory() && entry.name!=='node_modules') {
      const child=modulePath(full,depth+1);if(child)return child;
    } else if (entry.name==='kenjatime-kotlin-core.mjs') return full;
  }
  return null;
}
const raw=modulePath('kotlin-core/build');
assert.ok(raw,'Compile Kotlin/Wasm first');
const imported=await import(pathToFileURL(resolve(raw)).href);
const init=typeof imported.default==='function'?await imported.default():imported.default;
const api=[init,imported,init?.exports].find(x=>typeof x?.ktCoreCreate==='function');
assert.ok(api,'Wasm export ABI unavailable');

const archive=unzipSync(readFileSync('public/kfm.zip'));
const decoder=new TextDecoder('iso-8859-1');
function scripts(...extensions) {
  const parts=Object.entries(archive).filter(([name])=>
    extensions.some(extension=>name.toLowerCase().endsWith(extension)));
  const text=parts.map(([,bytes])=>decoder.decode(bytes)).join('\n');
  return { files:parts.map(([name])=>name), text };
}
const air=scripts('.air'), cmd=scripts('.cmd'), state=scripts('.cns','.st');
assert.ok(air.files.length && cmd.files.length && state.files.length,'Real KFM source scripts missing');
const handle=api.ktCoreCreateWithCommands('KFM','KFM',air.text,air.text,state.text,state.text,cmd.text,cmd.text);
try {
  api.ktCoreSetup(handle,-70*256,0,70*256,0);
  if(api.ktCoreConfigureArena)api.ktCoreConfigureArena(handle,-150,150,0,true,false);
  const before=JSON.parse(api.ktCoreSnapshot(handle,0));
  const t0=performance.now();
  let checksum='';
  const stateHistogram=new Map();
  let nonIdleTicks=0, contactCount=0;
  const ticks=600;
  for(let i=0;i<ticks;i++){
    const mod=i%48;
    const dir=mod===0?2:mod===1?10:8;
    const keys=mod===2?'a':mod===10?'b':mod===20?'x':'';
    if(i===120 && api.ktCoreDebugForceState) {
      api.ktCoreSetup(handle,-20*256,0,20*256,0);
      api.ktCoreDebugForceState(handle,0,200);
    }
    checksum=api.ktCoreStep(handle,dir,keys,0,'');
    const snapshot=JSON.parse(api.ktCoreSnapshot(handle,0));
    stateHistogram.set(snapshot.state,(stateHistogram.get(snapshot.state)||0)+1);
    if(snapshot.state!==0)nonIdleTicks++;
    if(api.ktCoreContacts) contactCount+=JSON.parse(api.ktCoreContacts(handle)).length;
  }
  const elapsedMs=performance.now()-t0;
  const a=JSON.parse(api.ktCoreSnapshot(handle,0));
  const b=JSON.parse(api.ktCoreSnapshot(handle,1));
  const issues=api.ktCoreIssues(handle).split('\n').filter(Boolean);
  const entities=api.ktCoreEntities?JSON.parse(api.ktCoreEntities(handle)):{};
  // Re-import the same real character in a second isolated fight and verify a
  // bit-exact 600-tick replay. Compiler caches and fighter handles must not leak state.
  const second=api.ktCoreCreateWithCommands('KFM','KFM',
    air.text,air.text,state.text,state.text,cmd.text,cmd.text);
  let repeatChecksum='';
  try {
    api.ktCoreSetup(second,-70*256,0,70*256,0);
    if(api.ktCoreConfigureArena)api.ktCoreConfigureArena(second,-150,150,0,true,false);
    for(let i=0;i<ticks;i++) {
      const mod=i%48;
      const dir=mod===0?2:mod===1?10:8;
      const keys=mod===2?'a':mod===10?'b':mod===20?'x':'';
      if(i===120 && api.ktCoreDebugForceState) {
        api.ktCoreSetup(second,-20*256,0,20*256,0);
        api.ktCoreDebugForceState(second,0,200);
      }
      repeatChecksum=api.ktCoreStep(second,dir,keys,0,'');
    }
  }finally{api.ktCoreRelease(second);}
  assert.equal(repeatChecksum,checksum,'Kotlin/Wasm actual KFM replay diverged across separate fights');
  const result={
    context:'Kotlin/Wasm 600-tick structural real-KFM smoke, NOT native or JS parity',
    ticks,elapsedMs:Number(elapsedMs.toFixed(3)),
    millisecondsPerTick:Number((elapsedMs/ticks).toFixed(4)),
    archive:{air:air.files.length,cmd:cmd.files.length,state:state.files.length},
    before,after:{p1:a,p2:b},entities,
    issueCount:issues.length,sampleIssues:issues.slice(0,12),
    distinctStates:[...stateHistogram.entries()],
    nonIdleTicks,contactCount,checksum,deterministicReplay:true
  };
  assert.equal(a.frame,ticks);
  assert.ok(Number.isFinite(a.x256) && Number.isFinite(a.y256));
  console.log(JSON.stringify(result,null,2));
}finally{api.ktCoreRelease(handle);}
