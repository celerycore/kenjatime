import {test} from 'node:test';
import assert from 'node:assert/strict';
import {RoundFlow} from '../src/rounds.js';
import {TrainingMatch} from '../src/combat.js';

const players=(a=100,b=100)=>[{life:a,maxLife:100},{life:b,maxLife:100}];
function fight(flow){flow.step({players:players()});flow.step({players:players()});assert.equal(flow.roundState,2);}
function character(extra=''){
  const script=`[Data]\nlife=100\nintpersistindex=10\nfloatpersistindex=3\n[Statedef 0]\ntype=S\nphysics=N\nctrl=1\nanim=0\n${extra}`;
  return{path:'c.def',def:{info:{name:'Fighter'},files:{cns:'c.cns'}},files:{'c.cns':new TextEncoder().encode(script)},animations:[{id:0,frames:[{group:0,number:0,x:0,y:0,ticks:-1,clsn1:[],clsn2:[]}]}]};
}

test('Round phases wait for intro and freeze the timer during pause or TimerFreeze',()=>{
  const flow=new RoundFlow({preIntro:0,introHold:0,roundTime:1});flow.step({players:players(),intro:true});
  flow.step({players:players(),intro:true});assert.equal(flow.roundState,1);
  flow.step({players:players(),intro:false});assert.equal(flow.roundState,2);assert.equal(flow.timeLeft,60);
  flow.step({players:players(),paused:true});assert.equal(flow.timeLeft,60);
  flow.step({players:players(),timerFreeze:true});assert.equal(flow.timeLeft,60);
  flow.step({players:players()});assert.equal(flow.timeLeft,59);
});

test('KO awards one win, holds RoundNotOver, then advances without losing score',()=>{
  const flow=new RoundFlow({preIntro:0,introHold:0,overTime:1,resultTime:1,roundsToWin:2});fight(flow);
  assert.equal(flow.step({players:players(100,0)})[0].winner,'player');assert.equal(flow.roundState,3);
  flow.step({players:players(100,0),roundNotOver:true});assert.equal(flow.roundState,3);assert.equal(flow.wins.player,0);
  flow.step({players:players(100,0)});assert.equal(flow.wins.player,1);assert.equal(flow.matchOver,false);
  flow.step({players:players(100,0),roundNotOver:true});assert.equal(flow.roundState,4);assert.equal(flow.roundNo,1);
  assert.equal(flow.step({players:players(100,0)})[0].type,'next-round');assert.equal(flow.roundNo,2);assert.equal(flow.wins.player,1);
  fight(flow);flow.step({players:players(100,0)});flow.step({players:players(100,0)});assert.equal(flow.matchOver,true);
  assert.deepEqual(flow.step({players:players(100,0)}),[]);assert.equal(flow.wins.player,2);
});

test('Character intro assertions hold the round until the scripted transition releases them',()=>{
  const c=character(`[Statedef 5900]
[State Init]
type=ChangeState
trigger1=1
value=190
[Statedef 190]
ctrl=0
[State Intro]
type=AssertSpecial
trigger1=time<5
flag=intro
[State Ready]
type=ChangeState
trigger1=time>=5
value=0
ctrl=0`);
  const world=new TrainingMatch(c,{rules:{preIntro:0,introHold:0},skipIntro:false});
  for(let i=0;i<5;i++){world.tick();assert.notEqual(world.roundFlow.roundState,2);assert.equal(world.player.ctrl,0);}
  world.tick();assert.equal(world.roundFlow.roundState,2);assert.equal(world.player.stateNo,0);assert.equal(world.player.ctrl,1);
});

test('Timeout compares life percentage and double KO draws do not award wins',()=>{
  const timed=new RoundFlow({preIntro:0,introHold:0,roundTime:1/60});fight(timed);
  timed.step({players:[{life:90,maxLife:100},{life:100,maxLife:200}]});assert.equal(timed.roundWinner,'player');assert.equal(timed.reason,'time');
  const draw=new RoundFlow({preIntro:0,introHold:0,overTime:0});fight(draw);draw.step({players:players(0,0)});assert.equal(draw.roundWinner,'draw');assert.equal(draw.reason,'double-ko');
  draw.step({players:players(0,0)});assert.deepEqual(draw.wins,{player:0,opponent:0});
});

test('Match round reset preserves configured variables and power, while destroying helpers/projectiles',()=>{
  const world=new TrainingMatch(character(),{rules:{preIntro:0,introHold:0,overTime:0,resultTime:0,roundsToWin:2},initialize:false});world.tick();world.tick();
  world.player.vars[2]=3;world.player.vars[12]=8;world.player.fvars[1]=1.5;world.player.fvars[4]=2.5;world.player.power=123;
  world.spawnHelper(world.player,{stateno:0,id:77});world.opponent.life=0;world.tick();assert.equal(world.winner,'player');world.tick();assert.equal(world.roundFlow.wins.player,1);
  const generation=world.roundGeneration;world.tick();assert.ok(world.roundGeneration>generation);assert.equal(world.roundFlow.roundNo,2);
  assert.equal(world.player.life,100);assert.equal(world.player.power,123);assert.equal(world.player.vars[2],0);assert.equal(world.player.vars[12],8);
  assert.equal(world.player.fvars[1],0);assert.equal(world.player.fvars[4],2.5);assert.equal(world.entities.length,2);assert.equal(world.winner,null);
  assert.equal(world.player.evaluate('RoundNo'),2);assert.equal(world.player.evaluate('RoundsExisted'),1);
});

test('Native result triggers distinguish time wins, perfect wins, losses and match end',()=>{
  const world=new TrainingMatch(character(),{rules:{preIntro:0,introHold:0,overTime:0,roundTime:1/60,roundsToWin:1},initialize:false});
  world.tick();world.tick();world.opponent.life=50;world.tick();world.tick();
  assert.equal(world.player.evaluate('Win'),1);assert.equal(world.player.evaluate('WinTime'),1);assert.equal(world.player.evaluate('WinKO'),0);assert.equal(world.player.evaluate('WinPerfect'),1);
  assert.equal(world.opponent.evaluate('LoseTime'),1);assert.equal(world.player.evaluate('MatchOver'),1);
});

test('NoKO can hold a scripted death while the match clock remains active',()=>{
  const flow=new RoundFlow({preIntro:0,introHold:0});fight(flow);flow.step({players:players(0,100),noKO:[true,false]});assert.equal(flow.roundState,2);
  flow.step({players:players(0,100)});assert.equal(flow.roundWinner,'opponent');
});

test('Helper assertions affect the shared round timer and global KO check',()=>{
  const c=character(`[Statedef 700]
physics=N
[State Hold]
type=AssertSpecial
trigger1=1
flag=timerfreeze
flag2=noko`);
  const world=new TrainingMatch(c,{rules:{preIntro:0,introHold:0},initialize:false});world.tick();world.tick();
  const helper=world.spawnHelper(world.player,{stateno:700,id:70}),remaining=world.roundFlow.timeLeft;
  world.opponent.life=0;world.tick();assert.equal(world.roundFlow.roundState,2);assert.equal(world.roundFlow.timeLeft,remaining);
  helper.destroyed=true;world.tick();assert.equal(world.roundFlow.roundState,3);assert.equal(world.roundFlow.roundWinner,'player');
});

test('Match rules reject invalid timer and score settings',()=>{
  assert.throws(()=>new RoundFlow({roundsToWin:0}),/bounds/);assert.throws(()=>new RoundFlow({roundTime:NaN}),/Invalid/);
});
