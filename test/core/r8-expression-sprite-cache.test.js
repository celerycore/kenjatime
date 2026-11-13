import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {packageFiles} from '../../src/formats.js';
import {CoreSession} from '../../src/core/session.js';
import {
  compileExpression, evaluateExpression, evaluateTypedExpression,
  expressionCacheStats,EXPRESSION_CACHE_CAPACITY,
} from '../../src/expressions.js';
import {SpriteRestoreCache} from '../../src/core/sprite-restore-cache.js';

test('Bounded CNS AST cache avoids recompiling a 1024-expression AI working set',()=>{
  assert.equal(EXPRESSION_CACHE_CAPACITY,8192);
  const before=expressionCacheStats();
  for(let i=0;i<1024;i++){
    const src=`var(0) + ${i}`;
    assert.equal(evaluateExpression(src,{resolve:()=>2}),i+2);
  }
  const afterMiss=expressionCacheStats();
  assert.ok(afterMiss.misses-before.misses>=1024);
  for(let i=0;i<1024;i++)
    assert.equal(evaluateExpression(`var(0) + ${i}`,{resolve:()=>2}),i+2);
  const afterHit=expressionCacheStats();
  assert.ok(afterHit.hits-afterMiss.hits>=1024,'reuses original parsed program');
  assert.ok(afterHit.size<=EXPRESSION_CACHE_CAPACITY);
});

test('Typed JS fallback preserves context identity when already marked typed',()=>{
  let called=0;const context={
    typedResult:true,
    resolve(name){called++;assert.equal(this,context);return 6;},
  };
  const typed=evaluateTypedExpression('var(0) + 4',context);
  assert.equal(typed.value,10);
  assert.equal(typed.float,false);
  assert.equal(called,1);
  assert.deepEqual(evaluateTypedExpression('1.5 + 2.0').value,Math.fround(3.5));
});

test('CPU sprite restoration cache retains immutable pixels with bounded memory',()=>{
  const cache=new SpriteRestoreCache({maxBytes:32});
  const a=new Uint8Array([1,2,3,4]),b=new Uint8Array(20).fill(7);
  assert.equal(cache.put('sprite-a',a),true);
  a[0]=99;
  assert.deepEqual([...cache.get('sprite-a')],[1,2,3,4]);
  assert.equal(cache.put('sprite-b',b),true);
  assert.equal(cache.bytes,24);
  // Touch A after B was inserted to explicitly test LRU recency.
  assert.deepEqual([...cache.get('sprite-a')],[1,2,3,4]);
  assert.equal(cache.put('sprite-c',new Uint8Array(16).fill(9)),true);
  assert.equal(cache.bytes,16+4); // cached a was recently touched, b evicted
  assert.equal(cache.get('sprite-b'),null);
  assert.deepEqual([...cache.get('sprite-a')],[1,2,3,4]);
  assert.equal(cache.put('oversize',new Uint8Array(33)),false);
  assert.equal(cache.put('invalid',new Uint8Array()),false);
  assert.equal(cache.stats.hits,3);
  assert.equal(cache.stats.evictions,1);
  assert.ok(cache.bytes<=cache.limit);
  cache.clear();
  assert.equal(cache.bytes,0);
  assert.equal(cache.entries.size,0);
});

test('KFM sprites restored after GPU eviction use exact same indexed pixels',()=>{
  const files=packageFiles(readFileSync(new URL('../../public/kfm.zip',import.meta.url)));
  const session=new CoreSession(files,{mode:'cpu',level:5,endless:true});
  try{
    session.tick();
    const frame=session.frame();
    const image=frame.assets.find(a=>a.id.includes(':')&&!a.id.includes(':pal:'));
    assert.ok(image,'KFM draws at least one sprite');
    const first=session.restoreAssets([image.id]);
    assert.equal(first.length,1);
    assert.deepEqual([...first[0].pixels],[...image.pixels]);
    assert.equal(session.spriteRestoreCache.stats.misses,1);
    // First restoration is probation only: one-off images are never copied
    // into the 16 MiB cache. On the second restoration this sprite is
    // promoted, and on the third the original decoded bytes are reused.
    assert.equal(session.spriteRestoreCache.stats.bytes,0);
    assert.equal(session.spriteRestoreCache.stats.deferredAdmissions,1);
    const second=session.restoreAssets([image.id]);
    assert.equal(second.length,1);
    assert.deepEqual([...second[0].pixels],[...first[0].pixels]);
    assert.equal(session.spriteRestoreCache.stats.promotions,1);
    const third=session.restoreAssets([image.id]);
    assert.equal(third.length,1);
    assert.deepEqual([...third[0].pixels],[...first[0].pixels]);
    assert.equal(session.spriteRestoreCache.stats.hits,1);
    assert.ok(session.spriteRestoreCache.stats.bytes>0);
    assert.ok(session.snapshot().interpreterCache);
    assert.ok(session.snapshot().spriteRestoreCache);
  }finally{session.close();}
  assert.equal(session.spriteRestoreCache.stats.bytes,0);
});

test('Expression executor cache remains bounded on excess unique authored strings',()=>{
  // Always bounded even for pathological imported 20k-line CNS scripts.
  for(let i=0;i<EXPRESSION_CACHE_CAPACITY+3;i++)
    compileExpression(`time=${i+100000}`);
  assert.ok(expressionCacheStats().size<=EXPRESSION_CACHE_CAPACITY);
});
