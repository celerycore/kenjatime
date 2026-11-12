import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {FrameClock, SIMULATION_HZ} from "../../src/frame-clock.js";
import {TickInputBuffer} from "../../src/input-buffer.js";
import {packageFiles} from "../../src/formats.js";
import {CoreSession} from "../../src/core/session.js";

const DURATION_MS = 3000;
const fpsTimes = fps => Array.from({length: DURATION_MS * fps / 1000 + 1},
  (_, n) => n * 1000 / fps);
const irregular = [0, 7, 27, 84, 91, 203, 479, 530, 1000, 1011,
  1540, 1700, 2210, 2680, DURATION_MS];

function driveClock(times, tick, {maxTicks=12, render=()=>{}}={}) {
  const clock = new FrameClock({maxTicks});
  const samples = [];
  for(const time of times){
    clock.advance(time, {}, sampleTime => {
      samples.push(sampleTime);
      tick(sampleTime);
    });
    // A callback may draw 0 or 1 presentation frames; never affects ticks.
    render(time);
    let count=0;
    while(clock.debt >= 1 && count++ < 1000)
      clock.advance(time, {}, sampleTime => {
        samples.push(sampleTime);
        tick(sampleTime);
      });
    assert.ok(count<1000,'bounded catch-up eventually drains without dropping ticks');
  }
  return {clock, samples};
}

test("authoritative 60 Hz fixed tick boundaries are identical at 30/60/120 FPS and irregular frame pacing",()=>{
  assert.equal(SIMULATION_HZ,60);
  const paths = [fpsTimes(30),fpsTimes(60),fpsTimes(120),irregular];
  const results=paths.map(times=>driveClock(times,()=>{}));
  for(const {clock,samples} of results){
    assert.equal(clock.tickCount,180);
    assert.equal(samples.length,180);
    assert.ok(clock.debt<1);
    for(let i=0;i<samples.length;i++)
      assert.equal(samples[i],Math.ceil((i+1)*1e6/60)/1000,
        'input sample at the exact rational tick boundary');
  }
});

test("long stalls retain all simulation debt; each catch-up callback is bounded",()=>{
  const c=new FrameClock({maxTicks:12}), samples=[];
  c.advance(0);
  assert.equal(c.advance(1000,{},s=>samples.push(s)),12);
  assert.equal(c.tickCount,12);
  assert.ok(c.debt>=47);
  while(c.debt>=1)c.advance(1000,{},s=>samples.push(s));
  assert.equal(c.tickCount,60);
  assert.equal(samples.length,60);
  assert.equal(samples.at(-1),1000);
  for(let i=1;i<samples.length;i++)assert.ok(samples[i]>samples[i-1]);
});

test("pausing discards accumulated wall-time debt without resetting lifetime simulation ticks",()=>{
  const c=new FrameClock();
  c.advance(0);
  c.advance(1000/60);
  assert.equal(c.tickCount,1);
  c.suspend();
  assert.equal(c.debt,0);
  c.advance(100000);
  c.advance(100000+1000/60);
  assert.equal(c.tickCount,2);
  assert.equal(c.debt<1,true);
  assert.equal(c.advance(200000,{running:false}),0);
  assert.equal(c.debt,0);
});

test("recorded keyboard input events yield identical tick-state hashes across render cadences",()=>{
  const inputEvents = [
    ['keyboard', ['R'], 120], ['keyboard', ['R','a'], 295],
    ['keyboard', ['R'], 336], ['keyboard', [], 400],
    ['touch', ['L'], 650], ['touch', ['L','b'], 730],
    ['touch', [], 761], ['keyboard', ['U'], 1030],
    ['keyboard', [], 1060], ['gamepad', ['D','c'], 1920],
    ['gamepad', [], 1933]
  ];
  function run(times) {
    const inputs=new TickInputBuffer();
    for(const [source,keys,time] of inputEvents)inputs.record(source,keys,time);
    let state=0x12345678, ticks=0;
    driveClock(times,time=>{
      const pressed=inputs.sample(time);
      // An integer-only replay stand-in isolates input/tick scheduling.
      let bits=0;
      for(const [key,i] of [['R',0],['L',1],['U',2],['D',3],['a',4],['b',5],['c',6]])
        if(pressed.has(key))bits|=1<<i;
      state=Math.imul(state^(bits+ticks),1664525)+1013904223|0;
      ticks++;
    });
    return {ticks,state};
  }
  const baseline=run(fpsTimes(30));
  assert.equal(baseline.ticks,180);
  for(const schedule of [fpsTimes(60),fpsTimes(120),irregular])
    assert.deepEqual(run(schedule),baseline);
});

test("bundled KFM CPU fight has identical full per-tick combat hashes with 30/60/120/irregular rendering",async()=>{
  const files=packageFiles(readFileSync(new URL("../../public/kfm.zip",import.meta.url)));
  async function run(times){
    const session=new CoreSession(files,{
      character:"kfm/kfm.def",opponent:"kfm/kfm.def",
      mode:"cpu",level:5,endless:true
    });
    const hash=createHash("sha256");
    try{
      await session.initializeScripts();
      const {clock}=driveClock(times,()=>{
        session.tick();
        const m=session.match;
        hash.update(JSON.stringify({
          tick:m.ticks,round:m.roundFlow?.roundNo,
          phase:m.roundFlow?.roundState,
          actors:m.entities.map(a=>({
            id:a.id,state:a.stateNo,time:a.time,anim:a.anim,
            x:a.pos.x,y:a.pos.y,vx:a.vel.x,vy:a.vel.y,
            life:a.life,power:a.power,seed:a._seed
          })),
          projectiles:m.projectiles.map(p=>({
            id:p.id,x:p.pos.x,y:p.pos.y,anim:p.anim,time:p.time
          }))
        })+"\n");
      },{render:()=>session.frame()});
      return {ticks:clock.tickCount,combatTicks:session.match.ticks,
        digest:hash.digest("hex")};
    }finally{session.close();}
  }
  const baseline=await run(fpsTimes(30));
  assert.equal(baseline.ticks,180);
  assert.equal(baseline.combatTicks,180);
  for(const schedule of [fpsTimes(60),fpsTimes(120),irregular])
    assert.deepEqual(await run(schedule),baseline);
});
