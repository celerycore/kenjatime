import test from 'node:test';
import assert from 'node:assert/strict';
import {TrainingMatch} from '../../src/combat.js';
import {BENCHMARK_START_LOCK_TICKS,fightStartLocked} from '../../src/core/fight-start.js';

const rules={endless:true,preIntro:0,introHold:1,overTime:1,resultTime:1,
  fightStartLockTicks:BENCHMARK_START_LOCK_TICKS};

function legacyIdle({explicitLock=false}={}){
  // Tomoka and Nu-13 both import stand StateDef 0 without an explicit
  // Ctrl=1. This makes them unlike the original benchmark's KFM-like stub.
  const script=`[Statedef 0]
type=S
movetype=I
physics=N
anim=0
${explicitLock?'ctrl=0':''}
[State 0, idle]
type=Null
trigger1=1
`;
  return {
    path:'legacy-idle.def',
    def:{info:{name:'Legacy Idle'},files:{cns:'legacy-idle.cns'}},
    files:{'legacy-idle.cns':new TextEncoder().encode(script)},
    animations:[{id:0,loopStart:0,frames:[{group:0,number:0,x:0,y:0,ticks:5,clsn1:[],clsn2:[]}]}],
  };
}

function unlock(match){
  match.tick(); match.tick();
  assert.equal(match.roundFlow.roundState,2);
  for(let i=0;i<BENCHMARK_START_LOCK_TICKS;i++){
    assert.equal(fightStartLocked(match.roundFlow),true);
    match.tick();
  }
  assert.equal(fightStartLocked(match.roundFlow),false);
  match.tick();
}

test('R8 does not strand imported-style CPU StateDef 0 at the end of FIGHT hold',()=>{
  const match=new TrainingMatch(legacyIdle(),{rules,initialize:false,playerAILevel:6});
  unlock(match);
  assert.equal(match.player.stateNo,0);
  assert.equal(match.player.ctrl,1);
  assert.equal(match.player.r8IdleControlRecoveries||0,0);
});

test('R8 recovers a CPU stranded in unowned idle control after 30 live ticks',()=>{
  const match=new TrainingMatch(legacyIdle(),{rules,initialize:false,
    playerAILevel:6,opponentAILevel:0});
  unlock(match);
  match.player.ctrl=0;
  match.opponent.ctrl=0; // Human control must NEVER be synthesized.
  for(let i=0;i<29;i++)match.tick();
  assert.equal(match.player.ctrl,0);
  match.tick();
  assert.equal(match.player.ctrl,1);
  assert.equal(match.player.r8IdleControlRecoveries,1);
  assert.equal(match.opponent.ctrl,0);
  assert.ok(match.player.diagnostics.some(d=>d.type==='r8-control-recovery'));
});

test('R8 respects an explicitly authored StateDef 0 Ctrl=0',()=>{
  const match=new TrainingMatch(legacyIdle({explicitLock:true}),{rules,
    initialize:false,playerAILevel:6});
  unlock(match);
  assert.equal(match.player.ctrl,0);
  for(let i=0;i<120;i++)match.tick();
  assert.equal(match.player.ctrl,0);
  assert.equal(match.player.r8IdleControlRecoveries||0,0);
});

test('No benchmark timing rule means no synthetic idle control recovery',()=>{
  const match=new TrainingMatch(legacyIdle(),{initialize:false,
    playerAILevel:6,rules:{preIntro:0,introHold:0}});
  match.tick(); match.tick();
  assert.equal(match.roundFlow.roundState,2);
  match.player.ctrl=0;
  for(let i=0;i<120;i++)match.tick();
  assert.equal(match.player.ctrl,0);
});
