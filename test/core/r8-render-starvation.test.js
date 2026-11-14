import test from 'node:test';
import assert from 'node:assert/strict';
import {FrameClock} from '../../src/frame-clock.js';
import {
  framePacing,
  nextTickEstimate,
  presentationDue,
  NORMAL_PRESENTATION_FPS,
  BACKLOG_PRESENTATION_FPS,
} from '../../src/core/frame-pacing.js';

test('R8 presents under simulated 524-tick debt instead of starving WebGL indefinitely',()=>{
  const clock = new FrameClock({maxTicks:4});
  clock.advance(0);
  clock.advance(9000);
  assert.ok(clock.debt>=500, 'test creates the reported Nu-13-sized backlog');
  const pacing=framePacing(clock.debt,7);
  assert.equal(pacing.renderFps,BACKLOG_PRESENTATION_FPS);
  assert.equal(pacing.batchLimit,2,'severe backlog batches two moderate-cost ticks');
  let visible=0;
  for(let i=0;i<20;i++){
    const time=9000+i*40;
    if(presentationDue(clock,time,{renderFps:pacing.renderFps}))visible++;
    clock.maxTicks=pacing.batchLimit;
    clock.advance(time);
  }
  assert.ok(clock.debt>=1, 'backlog still exists, no simulation was discarded');
  assert.ok(visible>=15,'frames must be presented even when simulation is behind');
});

test('Presentation remains 60 Hz when caught up; pause, hidden and idle gates are unchanged',()=>{
  const clock=new FrameClock();
  assert.equal(framePacing(0,2).renderFps,NORMAL_PRESENTATION_FPS);
  assert.equal(framePacing(0.5,2).batchLimit,4);
  assert.equal(presentationDue(clock,0,{hidden:true}),false);
  assert.equal(presentationDue(clock,0,{paused:true,dirty:false}),false);
  assert.equal(presentationDue(clock,0,{paused:true,dirty:true}),true);
  assert.equal(presentationDue(clock,2,{renderFps:60}),false);
  assert.equal(presentationDue(clock,20,{renderFps:60}),true);
});

test('Per-callback simulation batch limits respond to measured expensive ticks',()=>{
  assert.equal(framePacing(100,2).batchLimit,4);
  assert.equal(framePacing(100,5).batchLimit,2);
  assert.equal(framePacing(100,10).batchLimit,2);
  assert.equal(framePacing(100,25).batchLimit,1);
  assert.equal(framePacing(0,Number.NaN).batchLimit,4);
  assert.equal(nextTickEstimate(2,10),4);
  assert.equal(nextTickEstimate(4,Number.NaN),4);
});

test('Rendering decision does not advance, skip, or clear deterministic simulation ticks',()=>{
  const clock=new FrameClock({maxTicks:1});
  let actualTicks=0;
  clock.advance(0);
  clock.advance(1000,{},()=>actualTicks++);
  assert.equal(actualTicks,1);
  const debt=clock.debt;
  for(let i=0;i<12;i++)
    presentationDue(clock,i*40,{renderFps:framePacing(debt).renderFps});
  assert.equal(clock.tickCount,actualTicks);
  assert.equal(clock.debt,debt);
  while(clock.debt>=1)clock.advance(1000,{},()=>actualTicks++);
  assert.equal(actualTicks,60);
  assert.equal(clock.tickCount,60);
});
