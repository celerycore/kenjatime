import {test} from 'node:test';
import assert from 'node:assert/strict';
import {FrameClock} from '../src/frame-clock.js';
import {TickInputBuffer,gamepadKeys} from '../src/input-buffer.js';
import {GraphicsQuality} from '../src/graphics.js';
import {MemoryLRU} from '../src/memory-cache.js';
import {PerformanceMonitor} from '../src/performance.js';
import {compositePlan,spriteBounds} from '../src/canvas-renderer.js';
import {TrainingMatch} from '../src/combat.js';
import {COMMON_STATES} from '../src/common.js';
import {CommandBuffer} from '../src/commands.js';
import {archive,decodeText} from '../src/formats.js';
import {readFileSync} from 'node:fs';

test('30/60/120 Hz callbacks produce identical KFM commands, attacks, hitpause and states',()=>{
  const c=archive(new Uint8Array(readFileSync(new URL('../public/kfm.zip',import.meta.url))))[0];
  const traces=[];
  for(const hz of [30,60,120]){
    const match=new TrainingMatch(c,{commonText:COMMON_STATES}),buffer=new CommandBuffer(decodeText(c.files[c.checks.find(check=>check.key==='cmd').path])),input=new TickInputBuffer(),clock=new FrameClock(),trace=[];
    for(const [time,keys]of [[0,['R']],[833.4,[]],[850,['x']],[856,[]],[1400,['D']],[1450,[]]])input.record('keyboard',keys,time);
    for(let frame=0;frame<=hz*2;frame++)clock.advance(frame*1000/hz,{},time=>{const physical=input.sample(time);match.tick(buffer.update(physical,match.player.facing),new Set(),{playerInput:physical});trace.push([match.player.stateNo,match.player.time,match.player.hitPauseTime,match.player.pos.x,match.opponent.life,match.opponent.stateNo,match.opponent.hitPauseTime,[...match.player.commands]]);});
    assert.equal(clock.tickCount,120);assert.ok(trace.some(row=>row[4]===977));traces.push(trace);
  }
  assert.deepEqual(traces[0],traces[1]);assert.deepEqual(traces[1],traces[2]);
});
test('catch-up preserves all required ticks and exposes debt; explicit background suspension discards wall time only',()=>{
  const clock=new FrameClock({maxTicks:4});clock.advance(0);assert.equal(clock.advance(1000),4);assert.ok(clock.debt>55);
  for(let i=0;i<14;i++)clock.advance(1000);assert.equal(clock.tickCount,60);assert.equal(clock.debt,0);
  clock.suspend();clock.advance(60000);clock.advance(60000+1000/60);assert.equal(clock.tickCount,61);
});
test('30 FPS presentation still samples 60 simulation ticks and short keyboard/touch presses',()=>{
  const clock=new FrameClock(),input=new TickInputBuffer();let ticks=0,draws=0,presses=0;
  input.record('touch',['a'],20);input.record('touch',[],24);
  input.record('keyboard',['x'],71);input.record('keyboard',[],74);
  for(let frame=0;frame<=120;frame++){const t=frame*1000/120;clock.advance(t,{},sample=>{ticks++;if(input.sample(sample).size)presses++;});if(clock.renderDue(t,30))draws++;}
  assert.equal(ticks,60);assert.equal(draws,31);assert.equal(presses,2);
});
test('physical sources can share a held key and standard gamepads retain diagonals/buttons',()=>{
  const input=new TickInputBuffer();input.record('touch',['a'],0);input.record('keyboard',['a'],1);input.record('touch',[],2);assert.deepEqual([...input.sample(3)],['a']);input.record('keyboard',[],4);assert.equal(input.sample(5).size,0);
  const pad={connected:true,mapping:'standard',axes:[.5,-.5],buttons:Array.from({length:16},(_,i)=>({pressed:i===0||i===3}))};assert.deepEqual([...gamepadKeys(pad)],['R','U','a','y']);assert.equal(gamepadKeys({...pad,connected:false}).size,0);
});
test('input snapshots remain ordered when a gamepad poll timestamp precedes a queued keyboard event',()=>{
  const input=new TickInputBuffer();input.record('keyboard',['a'],20);input.record('gamepad',['x'],19);assert.deepEqual([...input.sample(19)],['x']);assert.deepEqual([...input.sample(20)].sort(),['a','x']);
});
test('memory LRU promotes hot assets, obeys byte/entry limits and refuses oversized retention',()=>{
  const cache=new MemoryLRU({maxBytes:10,maxEntries:3,sizeOf:value=>value});cache.set('hot',4);cache.set('old',4);cache.get('hot');cache.set('new',4);assert.equal(cache.has('old'),false);assert.equal(cache.bytes,8);cache.set('giant',11);assert.equal(cache.has('giant'),false);cache.set('hot',2);assert.equal(cache.bytes,6);cache.clear();assert.equal(cache.bytes,0);
});
test('SFF cache eviction preserves complete decoded sprite and palette results',()=>{
  const c=archive(new Uint8Array(readFileSync(new URL('../public/kfm.zip',import.meta.url))))[0];
  // Parsing a tiny cache must not truncate frames or change any sprite pixels.
  return import('../src/formats.js').then(({sff})=>{const bytes=c.files[c.sprite.path],full=sff(bytes),small=sff(bytes,{cacheBytes:16000});for(let i=0;i<12;i++){assert.deepEqual(small.decode(i).rgba,full.decode(i).rgba);assert.ok(small.cacheStats().bytes<=16000);}assert.deepEqual(small.decode(0).rgba,full.decode(0).rgba);small.clearDecodedCache();assert.equal(small.cacheStats().bytes,0);});
});
test('Auto requires sustained load/headroom, manual graphics remain fixed, and all modes retain 60 Hz simulation',()=>{
  const q=new GraphicsQuality();for(let i=0;i<359;i++)q.observe(25);assert.equal(q.preset,'high');q.observe(25);assert.equal(q.preset,'balanced');for(let i=0;i<360;i++)q.observe(25);assert.equal(q.preset,'low');for(let i=0;i<899;i++)q.observe(2);assert.equal(q.preset,'low');q.observe(2);assert.equal(q.preset,'balanced');q.setMode('high');for(let i=0;i<1000;i++)q.observe(100);assert.equal(q.preset,'high');
});
test('Auto observes delayed presentation and adapts by elapsed time even at ten displayed frames per second',()=>{
  const q=new GraphicsQuality();for(let i=0;i<59;i++)q.observeFrame(2,100);assert.equal(q.preset,'high');q.observeFrame(2,100);assert.equal(q.preset,'balanced');
  const smooth=new GraphicsQuality();for(let i=0;i<1000;i++)smooth.observeFrame(2,1000/60);assert.equal(smooth.preset,'high');
});
test('telemetry is transparent when enabled and restores untouched Canvas methods when disabled',()=>{
  const context={drawImage:()=>7,getImageData:()=>9,putImageData:()=>11},original=context.drawImage,monitor=new PerformanceMonitor();monitor.track(context);assert.equal(context.drawImage,original);monitor.setEnabled(true);monitor.begin(0);assert.equal(context.drawImage(),7);context.getImageData(0,0,20,30);monitor.simulation(2,2);monitor.end(4);assert.equal(monitor.snapshot().readbackPixels,600);assert.equal(monitor.snapshot().simulationTickMs,1);monitor.setEnabled(false);assert.equal(context.drawImage,original);
});
test('telemetry measures presentation cadence and uses the selected 30 FPS budget for slow frames',()=>{
  const monitor=new PerformanceMonitor({enabled:true});for(const time of [0,1000/30,2000/30]){monitor.begin(time);monitor.end(2,{targetFPS:30});}assert.equal(monitor.snapshot().slowFrameRate,0);assert.equal(monitor.snapshot().renderedFrames,3);assert.ok(Math.abs(monitor.snapshot().fps-30)<1e-8);
});
test('compositor bounds respect rotation/mirroring and plans preserve exact algebraic coefficients',()=>{
  assert.deepEqual(spriteBounds({a:-2,b:0,c:0,d:3,e:30,f:20},-5,-5,10,10,100,100),{left:20,top:5,width:20,height:30});
  for(const s of [0,.1,.5,1])for(const d of [0,.25,.75,1]){const plan=compositePlan({mode:'add',source:s,destination:d});assert.ok(Math.abs(plan.opacity*plan.brightness+plan.add-s)<1e-10);assert.equal(1-plan.opacity,d);}
});
