import test from "node:test";
import assert from "node:assert/strict";
import { RoundFlow } from "../../src/rounds.js";
import { AdaptiveResolution } from "../../src/core/adaptive-resolution.js";
import { readFileSync } from "node:fs";

const healthy=[{life:100,maxLife:100},{life:100,maxLife:100}];
const oneDead=[{life:100,maxLife:100},{life:0,maxLife:100}];

test("permanent NoKO cannot trap endless mode after zero health",()=>{
  const f=new RoundFlow({endless:true,preIntro:0,introHold:0,maxNoKOTime:6,
    overTime:1,resultTime:1,maxOutroTime:1});
  f.step({players:healthy});
  f.step({players:healthy});
  assert.equal(f.roundState,2);
  for(let i=1;i<6;i++){
    f.step({players:oneDead,noKO:[true,true],timerFreeze:true});
    assert.equal(f.roundState,2);
    assert.deepEqual(f.zeroLifeNoKOTicks,[0,i]);
  }
  const events=f.step({players:oneDead,noKO:[true,true],timerFreeze:true});
  assert.equal(f.roundState,3);
  assert.equal(events[0].type,"round-over");
  assert.equal(f.roundWinner,"player");
  f.step({players:oneDead,roundNotOver:true});
  assert.equal(f.roundState,4);
  f.step({players:oneDead,victoryPending:true});
  assert.equal(f.roundNo,2);
  assert.equal(f.matchOver,false);
  assert.deepEqual(f.zeroLifeNoKOTicks,[0,0]);
});

test("temporary NoKO still protects scripted KO and then releases",()=>{
  const f=new RoundFlow({preIntro:0,introHold:0,maxNoKOTime:180});
  f.step({players:healthy});f.step({players:healthy});
  for(let i=0;i<90;i++)f.step({players:oneDead,noKO:[true,true]});
  assert.equal(f.roundState,2);
  f.step({players:oneDead,noKO:[false,false]});
  assert.equal(f.roundState,3);
});

test("GPU-limited 40 FPS reduces framebuffer even when CPU submission is 5 ms",()=>{
  const q=new AdaptiveResolution();
  for(let n=0;n<=90;n++)q.observe(n*25,5);
  assert.ok(q.scale<.95,"40 FPS must lower Auto resolution");
  assert.ok(q.scale>=.5);
});

test("stable near-60 FPS recovers slowly without exceeding native scale",()=>{
  const q=new AdaptiveResolution();
  q.scale=.6;
  for(let n=0;n<=180;n++)q.observe(n*(1000/60),5);
  assert.ok(q.scale>.6&&q.scale<=.72);
  q.reset();
  assert.equal(q.scale,1);
});

test("future CSVs record actual health, round phase, NoKO hold and framebuffer scale",()=>{
  const source=readFileSync(new URL("../../src/core/r8-benchmark.js",import.meta.url),"utf8");
  for(const field of ["p1_life","p2_life","round_phase","ko_hold_p1_ticks","ko_hold_p2_ticks","resolution_scale"])
    assert.ok(source.includes('"' + field + '"'),field);
});
