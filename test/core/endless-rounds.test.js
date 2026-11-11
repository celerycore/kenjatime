import test from "node:test";
import assert from "node:assert/strict";
import { RoundFlow } from "../../src/rounds.js";
import { appendBenchmarkSample } from "../../src/core/endless-benchmark.js";

const players = [{ life: 1000, maxLife: 1000 }, { life: 0, maxLife: 1000 }];
function runRound(flow, limit=20) {
  const events = [];
  for (let i=0; i<limit; i++) {
    events.push(...flow.step({players}));
    if (events.some(e=>e.type==="next-round") || (flow.matchOver && flow.roundState===4)) break;
  }
  return events;
}
test("endless round mode advances across 120 KOs without ending",()=>{
  const flow = new RoundFlow({
    roundsToWin:1, endlessRounds:true, preIntro:0, introHold:0,
    overTime:0, resultTime:0, maxOutroTime:0,
  });
  for(let i=1;i<=120;i++){
    const events=runRound(flow);
    assert.ok(events.some(e=>e.type==="result"));
    assert.ok(events.some(e=>e.type==="next-round"));
    assert.equal(flow.roundNo,i+1);
    assert.equal(flow.wins.player,i);
    assert.equal(flow.matchOver,false);
    assert.equal(flow.roundState,0);
  }
});
test("regular mode still ends when roundsToWin is reached",()=>{
  const flow = new RoundFlow({
    roundsToWin:1, preIntro:0, introHold:0, overTime:0,
    resultTime:0, maxOutroTime:0,
  });
  const events=runRound(flow);
  assert.ok(events.some(e=>e.type==="result"));
  assert.equal(flow.matchOver,true);
  assert.equal(flow.roundNo,1);
  assert.equal(events.some(e=>e.type==="next-round"),false);
});
test("benchmark samples remain bounded over a long simulation",()=>{
  const samples=[];
  for(let i=0;i<10000;i++)appendBenchmarkSample(samples,{elapsed_s:i},12);
  assert.equal(samples.length,12);
  assert.equal(samples[0].elapsed_s,9988);
  assert.equal(samples.at(-1).elapsed_s,9999);
});
