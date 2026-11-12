import test from "node:test";
import assert from "node:assert/strict";
import {TrainingMatch} from "../../src/combat.js";
import {RoundFlow} from "../../src/rounds.js";
import {FIGHT_BANNER_TICKS,POST_FIGHT_IDLE_TICKS,BENCHMARK_START_LOCK_TICKS,fightStartLocked} from "../../src/core/fight-start.js";

function movingFighter(){
 const script=`[Data]
life=100
[Statedef 0]
type=S
movetype=I
physics=N
ctrl=1
anim=0
[State 0, auto movement]
type=VelSet
trigger1=1
x=6
`;
 return{
  path:"bench.def",
  def:{info:{name:"Moving Fighter"},files:{cns:"bench.cns"}},
  files:{"bench.cns":new TextEncoder().encode(script)},
  animations:[{id:0,loopStart:0,frames:[{group:0,number:0,x:0,y:0,ticks:5,clsn1:[],clsn2:[]}]}],
 };
}

const settings={endless:true,preIntro:0,introHold:1,
 overTime:1,resultTime:1,maxOutroTime:1,
 fightStartLockTicks:BENCHMARK_START_LOCK_TICKS};

test("42-tick banner plus 60-tick delay release exactly 102 ticks after FIGHT begins",()=>{
 assert.equal(FIGHT_BANNER_TICKS,42);
 assert.equal(POST_FIGHT_IDLE_TICKS,60);
 assert.equal(BENCHMARK_START_LOCK_TICKS,102);
 const match=new TrainingMatch(movingFighter(),{rules:settings,initialize:false});
 match.tick();assert.equal(match.roundFlow.roundState,1);
 assert.equal(match.player.stateNo,0);
 assert.equal(match.player.ctrl,0);
 const startX=match.player.pos.x, otherX=match.opponent.pos.x;
 match.tick();assert.equal(match.roundFlow.roundState,2);
 assert.equal(match.roundFlow.phaseTime,0);
 assert.equal(match.player.ctrl,0);
 const roundTimer=match.roundFlow.timeLeft;
 for(let i=1;i<=BENCHMARK_START_LOCK_TICKS;i++){
   assert.equal(fightStartLocked(match.roundFlow),true);
   match.tick(new Set(["R","a"]),new Set(["L","a"]));
   assert.equal(match.player.pos.x,startX,`player moved on held tick ${i}`);
   assert.equal(match.opponent.pos.x,otherX,`opponent moved on held tick ${i}`);
   assert.equal(match.player.stateNo,0);
   assert.equal(match.opponent.stateNo,0);
   assert.equal(match.player.ctrl,0);
   assert.equal(match.roundFlow.timeLeft,roundTimer);
 }
 assert.equal(match.roundFlow.phaseTime,BENCHMARK_START_LOCK_TICKS);
 assert.equal(fightStartLocked(match.roundFlow),false);
 match.tick();
 assert.equal(match.player.ctrl,1);
 assert.notEqual(match.player.pos.x,startX,"fighter movement begins after hold");
 assert.equal(match.roundFlow.timeLeft,roundTimer-1);
});

test("round-start idle lock is re-armed on every Endless Round reset",()=>{
 const match=new TrainingMatch(movingFighter(),{rules:settings,initialize:false});
 match.tick();match.tick();
 for(let i=0;i<=BENCHMARK_START_LOCK_TICKS;i++)match.tick();
 const round=match.roundFlow.roundNo;
 match.opponent.life=0;
 match.tick();
 assert.equal(match.roundFlow.roundState,3);
 match.tick();assert.equal(match.roundFlow.roundState,4);
 match.tick();assert.equal(match.roundFlow.roundNo,round+1);
 assert.equal(match.roundFlow.roundState,0);
 match.tick();assert.equal(match.roundFlow.roundState,1);
 assert.equal(match.player.ctrl,0);
 const nextX=match.player.pos.x;
 match.tick();assert.equal(match.roundFlow.roundState,2);
 for(let i=0;i<BENCHMARK_START_LOCK_TICKS;i++)match.tick();
 assert.equal(match.player.pos.x,nextX);
 assert.equal(match.roundFlow.matchOver,false);
});

test("legacy/training rules without lock still enter combat immediately",()=>{
 const flow=new RoundFlow({preIntro:0,introHold:0});
 flow.step({players:[{life:100,maxLife:100},{life:100,maxLife:100}]});
 flow.step({players:[{life:100,maxLife:100},{life:100,maxLife:100}]});
 assert.equal(flow.roundState,2);
 assert.equal(flow.rules.fightStartLockTicks,0);
 assert.equal(fightStartLocked(flow),false);
});
