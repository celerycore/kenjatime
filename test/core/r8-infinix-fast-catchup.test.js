import test from 'node:test';
import assert from 'node:assert/strict';
import {FrameScheduler} from '../../src/core/frame-scheduler.js';
import {framePacing} from '../../src/core/frame-pacing.js';
import {FrameClock} from '../../src/frame-clock.js';

function workerHarness(){
  let time=0;
  const messages=[],timers=new Map();
  let nextTimer=1,callbacks=0,closedPorts=0;
  class MockMessageChannel{
    constructor(){
      this.port1={onmessage:null,start(){},close(){closedPorts++}};
      this.port2={
        postMessage:payload=>messages.push(()=>{
          this.port1.onmessage?.({data:payload});
        }),
        close(){closedPorts++},
      };
    }
  }
  const host={
    performance:{now:()=>time},
    MessageChannel:MockMessageChannel,
    setTimeout(fn,delay){const id=nextTimer++;timers.set(id,{fn,delay});return id},
    clearTimeout(id){timers.delete(id)},
  };
  const scheduler=new FrameScheduler(()=>{callbacks++},host);
  return {
    scheduler,host,messages,timers,
    time:value=>{time=value},
    invoke:()=>{const f=messages.shift();assert.ok(f);f()},
    count:()=>callbacks,
    portsClosed:()=>closedPorts,
  };
}

test('dedicated worker uses MessageChannel rather than clamped nested setTimeout(0)',()=>{
  const w=workerHarness();
  w.scheduler.schedule({catchUp:true});
  assert.equal(w.messages.length,1);
  assert.equal(w.timers.size,0,'fast catch-up bypasses timer clamping');
  assert.equal(w.scheduler.stats.available,true);
  w.invoke();
  assert.equal(w.count(),1);
  assert.equal(w.scheduler.stats.channelCallbacks,1);
  w.scheduler.schedule({catchUp:true});
  w.invoke();
  assert.equal(w.count(),2);
  w.scheduler.close();
  assert.equal(w.portsClosed(),2);
});

test('cancelled old message cannot execute newer catch-up callback',()=>{
  const w=workerHarness();
  w.scheduler.schedule({catchUp:true});
  w.scheduler.cancel();
  w.scheduler.schedule({catchUp:true});
  assert.equal(w.messages.length,2);
  w.invoke();
  assert.equal(w.count(),0,'stale message is ignored');
  assert.equal(w.scheduler.stats.staleChannelMessages,1);
  w.invoke();
  assert.equal(w.count(),1);
  w.scheduler.close();
});

test('background, idle, and main-thread fallback retain original timer/rAF behavior',()=>{
  const w=workerHarness();
  w.scheduler.schedule({timer:true,catchUp:true});
  assert.equal(w.messages.length,0);
  assert.equal([...w.timers.values()][0].delay,0);
  w.scheduler.schedule({idle:true});
  assert.equal([...w.timers.values()][0].delay,100);
  assert.equal(w.timers.size,1);
  w.scheduler.close();
  const main=workerHarness();
  main.host.document={};
  main.scheduler.schedule({catchUp:true});
  assert.equal(main.messages.length,0);
  assert.equal([...main.timers.values()][0].delay,0);
  main.scheduler.close();
});

test('moderate backlog runs 2 fixed ticks per wakeup, without changing clock timeline',()=>{
  assert.equal(framePacing(0,10.9).batchLimit,1);
  assert.equal(framePacing(4,10.9).batchLimit,1);
  assert.equal(framePacing(8,10.9).batchLimit,2);
  assert.equal(framePacing(100,13.5).batchLimit,2);
  assert.equal(framePacing(8,14).batchLimit,1);
  assert.equal(framePacing(80,7.5).batchLimit,2);
  assert.equal(framePacing(80,10.9).renderFps,30);
  const a=new FrameClock({maxTicks:1});
  const b=new FrameClock({maxTicks:1});
  const traceA=[],traceB=[];
  a.advance(0,{},t=>traceA.push(t));
  b.advance(0,{},t=>traceB.push(t));
  for(let i=1;i<=100;i++){
    const time=1000+i*100;
    a.maxTicks=1;
    b.maxTicks=framePacing(b.debt,10.9).batchLimit;
    a.advance(time,{},t=>traceA.push(t));
    b.advance(time,{},t=>traceB.push(t));
  }
  // The faster scheduler may execute more ticks per callback but its exact
  // first N tick times and event ordering remain identical.
  assert.ok(traceB.length>=traceA.length);
  assert.deepEqual(traceB.slice(0,traceA.length),traceA);
  assert.ok(b.debt<a.debt);
});
