import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {CoreSession} from '../../src/core/session.js';
import {CoreThreeRenderer} from '../../src/core/three-renderer.js';
import {packageFiles} from '../../src/formats.js';
import {SpriteRestoreCache} from '../../src/core/sprite-restore-cache.js';

const MB=1024*1024;
const files=()=>packageFiles(
  readFileSync(new URL('../../public/kfm.zip',import.meta.url)),
);

test('extended and maximum sprite cache presets stay bounded and opt-in',()=>{
  for(const [mode,budget] of Object.entries({
    legacy:16,balanced:64,extended:128,maximum:192,
  })){
    const session=new CoreSession(files(),{mode:'cpu',level:5,spriteCacheMode:mode});
    try{
      assert.equal(session.spriteCacheMode,mode);
      assert.equal(session.spriteRestoreCache.limit,budget*MB);
    }finally{session.close();}
  }
});

test('loading warmup caches indexed KFM fighter art before simulation starts',async()=>{
  const session=new CoreSession(files(),{mode:'cpu',level:5,
    endless:true,spriteCacheMode:'extended'});
  const records=[];
  try{
    const before=session.match.ticks;
    const result=await session.preloadSprites({onProgress:p=>records.push(p)});
    assert.equal(session.match.ticks,before,'no combat simulation happens under NOW LOADING');
    assert.ok(result.candidates>0,'reads authored fighter AIR references');
    assert.ok(result.loaded>0,'actually warms pixels, not just a placeholder timer');
    assert.equal(result.attempted,result.candidates);
    assert.ok(result.bytes>0 && result.bytes<=128*MB);
    assert.equal(result.mode,'extended');
    assert.ok(records.length>=2,'loading status updates while work progresses');
    assert.equal(records[0].progress,0);
    assert.equal(records.at(-1).progress,1);
    for(let i=1;i<records.length;i++)
      assert.ok(records[i].progress>=records[i-1].progress);
    assert.ok(session.spriteRestoreCache.stats.entries>0);
    const [id,entry]=session.spriteRestoreCache.entries.entries().next().value;
    const snapshot=new Uint8Array(session.spriteRestoreCache.get(id));
    assert.equal(snapshot.length,entry.originalBytes);
    assert.equal(session.spriteRestoreCache.get(id).length,snapshot.length);
    assert.equal(session.spriteRestoreCache.stats.hits,2,
      'cache hits avoid an additional source PCX decompression');
    assert.equal(session.snapshot().spritePreload.mode,'extended');
    // Gameplay remains deterministic after a long initial asset preparation.
    session.tick();
    assert.equal(session.match.ticks,before+1);
  }finally{session.close();}
  assert.equal(session.spriteRestoreCache.stats.bytes,0);
});

test('legacy mode skips prewarm and preserves the original 16 MiB cache',async()=>{
  const session=new CoreSession(files(),{mode:'cpu',spriteCacheMode:'legacy'});
  const progress=[];
  try{
    const result=await session.preloadSprites({onProgress:p=>progress.push(p)});
    assert.equal(result.candidates,0);
    assert.equal(session.spriteRestoreCache.stats.bytes,0);
    assert.equal(session.spriteRestoreCache.limit,16*MB);
    assert.deepEqual(progress.map(p=>p.progress),[1]);
  }finally{session.close();}
});

test('explicit prewarm stores once without weakening normal second-chance admissions',()=>{
  const bytes=Uint8Array.from([1,2,3,4]);
  const cache=new SpriteRestoreCache({maxBytes:16,requireRepeat:true});
  assert.equal(cache.put('cold',bytes,{indexed:true}),false);
  assert.equal(cache.put('hot',bytes,{indexed:true,preload:true}),true);
  assert.deepEqual([...cache.get('hot')],[1,2,3,4]);
  assert.equal(cache.stats.deferredAdmissions,1);
  assert.equal(cache.put('cold',bytes,{indexed:true}),true);
  assert.ok(cache.bytes<=16);
});

test('graphics budget presets use exact raw caps without lifting legacy governor',()=>{
  const renderer=Object.create(CoreThreeRenderer.prototype);
  renderer.textureBytes=0;
  renderer.limit=64*MB;
  assert.equal(renderer.configureSpriteMemory('legacy'),64*MB);
  for(const [mode,size] of [['balanced',96],['extended',128],['maximum',160]]){
    assert.equal(renderer.configureSpriteMemory(mode),size*MB);
    assert.equal(renderer.textureBudgetGovernor.currentBytes,size*MB);
    assert.equal(renderer.textureBudgetGovernor.maxBytes,size*MB);
    assert.equal(renderer.textureBudgetGovernor.upgrades,0);
  }
  renderer.textureBytes=161*MB;
  assert.throws(()=>renderer.configureSpriteMemory('extended'),/exceeds/);
});
