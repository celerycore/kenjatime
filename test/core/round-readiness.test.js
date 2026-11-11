import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { unzipSync } from "fflate";
import { TrainingMatch } from "../../src/combat.js";
import { RoundFlow } from "../../src/rounds.js";
import { CoreSession } from "../../src/core/session.js";

function character() {
  const script = [
    "[Data]","life=1000","[Statedef 0]","type=S","movetype=I",
    "physics=N","ctrl=1","anim=0",
    "[Statedef -3]","[State -3, AI without input]",
    "type=ChangeState","trigger1=1","value=200",
    "[Statedef 200]","type=S","movetype=A","physics=N",
    "ctrl=0","anim=200","[State 200, move]",
    "type=VelSet","trigger1=1","x=11",
  ].join("\n");
  return {
    path:"ai.def",
    def:{info:{name:"Aggressive script"},files:{cns:"ai.cns",cmd:"ai.cmd"}},
    files:{"ai.cns":new TextEncoder().encode(script),
           "ai.cmd":new TextEncoder().encode("[Command]\nname=\"jab\"\ncommand=a\n")},
    animations:[
      {id:0,frames:[{group:0,number:0,x:0,y:0,ticks:2,clsn1:[],clsn2:[]}]},
      {id:200,frames:[{group:200,number:0,x:0,y:0,ticks:2,clsn1:[],clsn2:[]}]}
    ],
  };
}

test("PR12 strict round lock keeps both aggressive scripted AI fighters neutral and in idle until FIGHT",()=>{
  const spec=character();
  const m=new TrainingMatch(spec,{
    opponentCharacter:spec,rules:{preIntro:0,introHold:5,roundsToWin:1,roundTime:99},
    orderedPhases:true,manageInputs:true,initialize:false,strictPrefightIdle:true,
    playerAILevel:4,opponentAILevel:4, pushboxes:false
  });
  const x=[m.player.pos.x,m.opponent.pos.x];
  for(let tick=0;tick<6;tick++){
    const before=m.roundFlow.roundState;
    assert.notEqual(before,2);
    m.tick(new Set(["jab"]),new Set(["jab"]),{
      playerInput:new Set(["a","R"]),opponentInput:new Set(["a","L"])
    });
    assert.equal(m.player.stateNo,0);
    assert.equal(m.opponent.stateNo,0);
    assert.equal(m.player.anim,0);
    assert.equal(m.opponent.anim,0);
    assert.equal(m.player.life,1000);
    assert.equal(m.opponent.life,1000);
    assert.deepEqual([m.player.pos.x,m.opponent.pos.x],x);
    assert.equal(m.projectiles.length,0);
    assert.equal(m.player.commands.size,0);
    assert.equal(m.opponent.commands.size,0);
  }
  assert.equal(m.roundFlow.roundState,2,"announcer must transition to FIGHT");
  m.tick();
  assert.equal(m.player.stateNo,200,"authored AI resumes after fight");
  assert.equal(m.opponent.stateNo,200);
});

test("actual bundled KFM CoreSession CPU round stays idle through Round 1 announcement",()=>{
  const files=unzipSync(readFileSync(new URL("../../public/kfm.zip",import.meta.url)));
  const session=new CoreSession(files,{mode:"cpu",level:6});
  const m=session.match;
  const left=m.player.pos.x,right=m.opponent.pos.x;
  const lives=[m.player.life,m.opponent.life];
  assert.equal(m.player.stateNo,0);
  assert.equal(m.opponent.stateNo,0);
  for(let tick=0;tick<70;tick++){
    if(m.roundFlow.roundState===2)break;
    session.tick(new Set(["a","R"]),new Set(["b","L"]));
    assert.equal(m.player.stateNo,0);
    assert.equal(m.opponent.stateNo,0);
    assert.equal(m.player.anim,0);
    assert.equal(m.opponent.anim,0);
    assert.deepEqual([m.player.life,m.opponent.life],lives);
    assert.equal(m.player.pos.x,left);
    assert.equal(m.opponent.pos.x,right);
  }
  assert.equal(m.roundFlow.roundState,2);
  assert.equal(m.roundFlow.timeLeft,99*60,"timer must not count during ROUND 1");
  session.close();
});

test("permanently asserted NoKO and TimerFreeze cannot softlock a mirror KO",()=>{
  const flow=new RoundFlow({preIntro:0,introHold:0,overTime:1,
    resultTime:1,roundsToWin:1,roundTime:99});
  const healthy=[{life:1000,maxLife:1000},{life:1000,maxLife:1000}];
  flow.step({players:healthy});flow.step({players:healthy});
  assert.equal(flow.roundState,2);
  const fighters=[{life:0,maxLife:1000},{life:1000,maxLife:1000}];
  for(let tick=1;tick<90;tick++){
    flow.step({players:fighters,noKO:[true,true],timerFreeze:true});
    assert.equal(flow.roundState,2,"NoKO should delay a scripted KO briefly");
  }
  const result=flow.step({players:fighters,noKO:[true,true],timerFreeze:true});
  assert.equal(result[0]?.type,"round-over");
  assert.equal(flow.roundWinner,"opponent");
  assert.equal(flow.reason,"ko");
  flow.step({players:fighters,noKO:[true,true],timerFreeze:true});
  assert.equal(flow.matchOver,true);
});

test("mirror double KO resolves as draw after bounded NoKO grace",()=>{
  const flow=new RoundFlow({preIntro:0,introHold:0,roundTime:99});
  const both=[{life:0,maxLife:1000},{life:0,maxLife:1000}];
  flow.step({players:both});flow.step({players:both});
  for(let i=0;i<90;i++)flow.step({players:both,noKO:[true,true],timerFreeze:true});
  assert.equal(flow.roundState,3);
  assert.equal(flow.roundWinner,"draw");
  assert.equal(flow.reason,"double-ko");
});
