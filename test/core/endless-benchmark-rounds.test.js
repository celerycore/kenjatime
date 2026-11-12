import {test} from 'node:test';
import assert from 'node:assert/strict';
import {RoundFlow} from '../../src/rounds.js';

const rules = {roundsToWin:1, roundTime:1, preIntro:1, introHold:1,
  overTime:1, resultTime:1, maxIntroTime:1, maxOutroTime:1};
function setup(flow) {
  const players=[{life:100,maxLife:100},{life:100,maxLife:100}];
  assert.equal(flow.roundState,0);
  flow.step({players}); // intro -> ROUND
  assert.equal(flow.roundState,1);
  flow.step({players}); // ROUND -> FIGHT
  assert.equal(flow.roundState,2);
  return players;
}
function advanceAfterKO(flow,players) {
  players[1].life=0;
  const over=flow.step({players});
  assert.equal(flow.roundState,3);
  assert.equal(over[0]?.type,'round-over');
  assert.equal(over[0]?.reason,'ko');
  const result=flow.step({players});
  assert.equal(result[0]?.type,'result');
  assert.equal(flow.roundState,4);
  return result[0];
}

test('endless disables round timer and never reaches match-over even after 20 knockouts', () => {
  const flow=new RoundFlow({...rules,endless:true});
  let players=setup(flow);
  assert.equal(flow.timeLeft,-1);
  for(let n=0;n<80;n++)flow.step({players});
  assert.equal(flow.roundState,2,'no timed expiry');
  for(let n=1;n<=20;n++){
    const result=advanceAfterKO(flow,players);
    assert.equal(result.matchOver,false);
    assert.equal(flow.matchOver,false);
    assert.equal(flow.wins.player,n);
    const next=flow.step({players});
    assert.equal(next[0]?.type,'next-round');
    assert.equal(flow.roundNo,n+1);
    assert.equal(flow.roundsExisted,n);
    players=setup(flow);
    assert.equal(flow.timeLeft,-1);
  }
});

test('ordinary one-win match still ends on a KO', () => {
  const flow=new RoundFlow({...rules,endless:false});
  const players=setup(flow);
  assert.ok(flow.timeLeft>0);
  const result=advanceAfterKO(flow,players);
  assert.equal(result.matchOver,true);
  assert.equal(flow.matchOver,true);
  for(let i=0;i<50;i++)assert.deepEqual(flow.step({players}),[]);
  assert.equal(flow.roundNo,1);
});

test('normal timed matches still expire at zero; endless matches do not',()=>{
  const timed=new RoundFlow({...rules,roundTime:0.05});
  const players=setup(timed);
  let result=[];
  for(let i=0;i<4;i++)result.push(...timed.step({players}));
  assert.ok(result.some(e=>e.reason==='time'));
  const endless=new RoundFlow({...rules,endless:true,roundTime:0.05});
  setup(endless);
  for(let i=0;i<1000;i++)endless.step({players});
  assert.equal(endless.roundState,2);
  assert.equal(endless.timeLeft,-1);
});

test('endless keeps draw and pause semantics',()=>{
  const flow=new RoundFlow({...rules,endless:true});
  const players=setup(flow);
  const before=flow.phaseTime;
  flow.step({players,paused:true});
  assert.equal(flow.phaseTime,before);
  players[0].life=0;
  players[1].life=0;
  flow.step({players});
  flow.step({players});
  assert.equal(flow.matchOver,false);
  assert.equal(flow.wins.player,0);
  assert.equal(flow.wins.opponent,0);
  const next=flow.step({players});
  assert.equal(next[0]?.type,'next-round');
});
