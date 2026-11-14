import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {packageFiles} from '../../src/formats.js';
import {CoreSession} from '../../src/core/session.js';
import {CoreThreeRenderer} from '../../src/core/three-renderer.js';
import {SpriteRestoreCache} from '../../src/core/sprite-restore-cache.js';
const MB=1024*1024;
const kfm=()=>packageFiles(readFileSync(new URL('../../public/kfm.zip',import.meta.url)));

test('48 MiB decoded hot tier avoids repeated PCX-index zero-run decompression',()=>{
 const cache=new SpriteRestoreCache({maxBytes:8192,hotBytes:8192,hotMaxSpriteBytes:4096});
 const pixels=new Uint8Array(4096);
 for(let i=0;i<pixels.length;i+=17)pixels[i]=(i%255)+1;
 assert.equal(cache.put('sprite-a',pixels,{indexed:true}),true);
 assert.equal(cache.stats.compressedEntries,1);
 assert.equal(cache.stats.hotEntries,0);
 assert.deepEqual(cache.get('sprite-a'),pixels);
 assert.equal(cache.stats.decompressions,1);
 assert.equal(cache.stats.hotStores,1);
 assert.equal(cache.stats.hotBytes,4096);
 assert.deepEqual(cache.get('sprite-a'),pixels);
 assert.deepEqual(cache.get('sprite-a'),pixels);
 assert.equal(cache.stats.decompressions,1,'repeated hot reads bypass decoding');
 assert.equal(cache.stats.hotHits,2);
 // GPU initialization reads must not be counted as combat cache hits.
 assert.deepEqual(cache.peek('sprite-a'),pixels);
 assert.equal(cache.stats.hits,3);
 assert.equal(cache.stats.decompressions,1);
 const other=new Uint8Array(4096);
 for(let i=0;i<other.length;i+=17)other[i]=((i+1)%255)+1;
 cache.put('sprite-b',other,{indexed:true});
 cache.get('sprite-b');
 assert.equal(cache.stats.hotBytes,8192);
 cache.put('sprite-c',other,{indexed:true});
 cache.get('sprite-c');
 assert.ok(cache.stats.hotBytes<=8192);
 assert.ok(cache.stats.hotEvictions>=1);
 cache.clear();
 assert.equal(cache.stats.hotBytes,0);
 assert.equal(cache.stats.hotEntries,0);
});

test('hot decoded cache refuses oversized sprites and never expands raw cache cap',()=>{
 const cache=new SpriteRestoreCache({
   maxBytes:16384,hotBytes:512,hotMaxSpriteBytes:512
 });
 const pixels=new Uint8Array(8192);
 pixels[1]=123;
 cache.put('large',pixels,{indexed:true});
 assert.deepEqual(cache.get('large'),pixels);
 assert.equal(cache.stats.hotBytes,0);
 assert.equal(cache.stats.hotHits,0);
 assert.ok(cache.stats.bytes<=cache.stats.budgetBytes);
 assert.equal(cache.stats.hotBudgetBytes,512);
});

test('128 MiB warm cache has a separately bounded 48 MiB decoded hot tier',()=>{
 const session=new CoreSession(kfm(),{mode:'cpu',level:5,spriteCacheMode:'extended'});
 try{
   const stats=session.spriteRestoreCache.stats;
   assert.equal(stats.budgetBytes,128*MB);
   assert.equal(stats.hotBudgetBytes,48*MB);
 }finally{session.close();}
});

test('preloading GPU art balances banks without advancing simulation or inflating CPU hit counters',async()=>{
 const session=new CoreSession(kfm(),{mode:'cpu',level:5,spriteCacheMode:'extended'});
 const record=[];
 try{
  await session.preloadSprites();
  const ticks=session.match.ticks;
  const hits=session.spriteRestoreCache.stats.hits;
  const renderer={
   limit:128*MB,
   calls:[],
   preloadIndexedTexture(sprite){
    this.calls.push(sprite);
    assert.ok(sprite.pixels instanceof Uint8Array);
    assert.equal(sprite.pixels.length,sprite.width*sprite.height);
    return true;
   }
  };
  const info=await session.preloadGpuSprites(renderer,{
   onProgress:p=>record.push(p)
  });
  assert.equal(session.match.ticks,ticks);
  assert.ok(info.loaded>0);
  assert.equal(info.loaded,renderer.calls.length);
  assert.ok(info.bytes>0&&info.bytes<=48*MB);
  assert.equal(session.preloadStats.gpuLoaded,info.loaded);
  assert.equal(session.preloadStats.gpuBytes,info.bytes);
  assert.equal(session.spriteRestoreCache.stats.hits,hits);
  assert.ok(record.length>=2);
  assert.equal(record.at(-1).progress,1);
 }finally{session.close();}
});

test('true WebGL GPU preload allocates once and preserves original R8 byte accounting',()=>{
 const renderer=Object.create(CoreThreeRenderer.prototype);
 let actualUploads=0;
 renderer.renderer={capabilities:{maxTextureSize:4096},initTexture(texture){
   actualUploads++;
   assert.equal(texture.internalFormat,'R8');
 }};
 renderer.textures=new Map();
 renderer.textureBytes=0;renderer.limit=8192;
 renderer.textureBreakdown={indexed:0,palette:0,rgba:0,video:0};
 renderer.evictedTextures=0;renderer.deferredTextures=0;
 const pixels=new Uint8Array(64*64).fill(47);
 assert.equal(renderer.preloadIndexedTexture({id:'p1',width:64,height:64,
   indexed:true,pixels}),true);
 assert.equal(renderer.preloadIndexedTexture({id:'p1',width:64,height:64,
   indexed:true,pixels}),true);
 assert.equal(actualUploads,1);
 assert.equal(renderer.gpuPreloadUploads,1);
 assert.equal(renderer.gpuPreloadBytes,4096);
 assert.equal(renderer.textureBytes,4096);
 assert.equal(renderer.textureBreakdown.indexed,4096);
 assert.equal(renderer.preloadIndexedTexture({id:'bad',width:64,height:64,
   indexed:false,pixels}),false);
 for(const texture of renderer.textures.values())texture.dispose();
});

test('adaptive GPU budget grows only on measured churn and remains hard capped',()=>{
 const renderer=Object.create(CoreThreeRenderer.prototype);
 renderer.textureBytes=0;renderer.limit=64*MB;
 assert.equal(renderer.configureSpriteMemory('extended'),128*MB);
 assert.equal(renderer.textureBudgetGovernor.maxBytes,160*MB);
 const governor=renderer.textureBudgetGovernor;
 assert.equal(governor.observe({frames:45,evictions:5,residentBytes:125*MB}),128*MB);
 assert.equal(governor.observe({frames:90,evictions:65,residentBytes:126*MB}),144*MB);
 assert.equal(governor.observe({frames:135,evictions:115,residentBytes:142*MB}),160*MB);
 assert.equal(governor.observe({frames:180,evictions:180,residentBytes:159*MB}),160*MB);
 assert.equal(renderer.configureSpriteMemory('maximum'),160*MB);
 assert.equal(renderer.textureBudgetGovernor.maxBytes,192*MB);
 assert.equal(renderer.configureSpriteMemory('balanced'),96*MB);
 assert.equal(renderer.textureBudgetGovernor.maxBytes,96*MB);
});
