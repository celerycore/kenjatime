import test from 'node:test';
import assert from 'node:assert/strict';
import {FrameClock} from '../../src/frame-clock.js';
import {FrameScheduler} from '../../src/core/frame-scheduler.js';
import {SimulationDebtTrend, gameplayFirstRenderFps, framePacing} from '../../src/core/frame-pacing.js';
import {SpriteRestoreCache} from '../../src/core/sprite-restore-cache.js';
import {planTextureEvictions} from '../../src/core/texture-residency.js';
import {WasmExpressions} from '../../src/core/wasm-expressions.js';
import {evaluateExpression, evaluateTypedExpression} from '../../src/expressions.js';

test('gameplay-first reduces only presentation when simulation debt grows',()=>{
 assert.equal(gameplayFirstRenderFps({debt:0,debtRate:20,tickCpuMs:20}),60);
 assert.equal(gameplayFirstRenderFps({debt:100,debtRate:11,tickCpuMs:11}),12);
 assert.equal(gameplayFirstRenderFps({debt:100,debtRate:5,tickCpuMs:11}),15);
 assert.equal(gameplayFirstRenderFps({debt:100,debtRate:2,tickCpuMs:11}),20);
 assert.equal(gameplayFirstRenderFps({debt:100,debtRate:-7,tickCpuMs:11}),24);
 assert.equal(gameplayFirstRenderFps({debt:20,debtRate:-7,tickCpuMs:11}),30);
 assert.equal(gameplayFirstRenderFps({debt:100,debtRate:-10,tickCpuMs:16}),12);
 assert.equal(framePacing(100,11).renderFps,30,'Balanced baseline remains available');
});

test('simulation debt trend samples only full windows and handles resets',()=>{
 const t=new SimulationDebtTrend({windowMs:1000});
 assert.equal(t.observe(1000,50),0);
 assert.equal(t.observe(1400,99),0);
 assert.equal(t.observe(2000,62),12);
 assert.equal(t.observe(2900,42),12);
 assert.equal(t.observe(3000,42),-20);
 assert.equal(t.observe(1500,2),0,'backwards time reinitializes trend');
 assert.equal(t.observe(2500,2),0);
});

test('every fixed 60 Hz combat tick executes despite fewer renderDue submissions',()=>{
 const normal=new FrameClock({maxTicks:12});
 const reduced=new FrameClock({maxTicks:12});
 const normalSamples=[],reducedSamples=[];
 let framesNormal=0,framesSkipped=0;
 for(let frame=0;frame<=600;frame++){
   const t=frame*1000/60;
   normal.advance(t,{running:true},tick=>normalSamples.push(tick));
   reduced.advance(t,{running:true},tick=>reducedSamples.push(tick));
   if(normal.renderDue(t,30))framesNormal++;
   if(reduced.renderDue(t,12))framesSkipped++;
 }
 assert.equal(normal.tickCount,600);
 assert.equal(reduced.tickCount,600);
 assert.deepEqual(reducedSamples,normalSamples);
 assert.ok(framesSkipped<framesNormal/2);
 assert.equal(reduced.debt,normal.debt);
});

test('hot probation avoids retaining one-shot effects; promotes repeat-use R8 only',()=>{
 const cache=new SpriteRestoreCache({maxBytes:256*1024,hotBytes:16*1024,
   hotMaxSpriteBytes:4096,requireRepeat:false});
 const bytes=new Uint8Array(2048);
 for(let i=0;i<bytes.length;i+=31)bytes[i]=60;
 for(let i=0;i<30;i++){
   const id='effect'+i;
   cache.put(id,bytes,{indexed:true});
   assert.deepEqual(cache.get(id),bytes);
 }
 assert.equal(cache.stats.hotStores,0);
 assert.equal(cache.stats.hotBytes,0);
 assert.equal(cache.stats.hotDeferredAdmissions,30);
 // An authored idle frame that is reused earns admission into the decoded tier.
 cache.get('effect1');
 assert.equal(cache.stats.hotPromotions,1);
 assert.equal(cache.stats.hotStores,1);
 assert.equal(cache.stats.hotBytes,2048);
 for(let i=30;i<70;i++){
   const id='effect'+i;
   cache.put(id,bytes,{indexed:true});
   cache.get(id);
 }
 assert.equal(cache.stats.hotHits,0);
 assert.deepEqual(cache.get('effect1'),bytes);
 assert.equal(cache.stats.hotHits,1,'one-offs have not displaced the reusable idle');
 assert.equal(cache.stats.hotEvictions,0);
});

test('GPU cold-first eviction preserves reused art and current frame pins',()=>{
 const texture=(bytes,visibleFrames=0)=>({userData:{residentBytes:bytes,visibleFrames}});
 const textures=new Map([
   ['stage',texture(50,2)],
   ['one-shot',texture(40,1)],
   ['fighter',texture(70,2)],
   ['other',texture(30,0)],
 ]);
 assert.deepEqual(planTextureEvictions(textures,190,40,190,new Set(),{coldFirst:true}),['one-shot']);
 assert.deepEqual(planTextureEvictions(textures,190,75,190,new Set(['one-shot']),{coldFirst:true}),['other','stage']);
 assert.deepEqual(planTextureEvictions(textures,190,40,190,new Set(),{coldFirst:false}),['stage']);
 assert.deepEqual(planTextureEvictions(textures,190,150,190,
   new Set(['stage','one-shot','fighter','other']),{coldFirst:true}),null);
});

test('interpreted CNS executors reuse the same parsed AST without changing typed results',()=>{
 const engine=new WasmExpressions([], {maxFunctions:0,maxBytes:0});
 for(const expression of ['1 + 2 * 3','(15 - 4) * 2','0']){
   const context={};
   for(let i=0;i<5;i++)
     assert.deepEqual(engine.evaluate(expression,context),
       evaluateExpression(expression,context));
   const typed={typedResult:true};
   for(let i=0;i<5;i++)
     assert.deepEqual(engine.evaluate(expression,typed),
       evaluateTypedExpression(expression,typed));
 }
 assert.ok(engine.stats.fallbackCacheHits>=20);
 assert.ok(engine.stats.fallbackExecutors>=3);
});
