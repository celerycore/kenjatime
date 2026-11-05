import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseCommands} from '../src/commands.js';
import {CpuController,commandInputPlan,characterCommands,normalizeAILevel} from '../src/cpu.js';
import {TrainingMatch} from '../src/combat.js';
import {archive} from '../src/formats.js';
import {COMMON_STATES} from '../src/common.js';

const encode=text=>new TextEncoder().encode(text);
const idle='[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nctrl=1\nanim=0\n';
function character(script='',cmd=''){
  return {path:'hero/hero.def',def:{files:{cns:'hero.cns',cmd:'hero.cmd'}},files:{'hero/hero.cns':encode(idle+script),'hero/hero.cmd':encode(cmd)},animations:[{id:0,frames:[{group:0,number:0,ticks:-1}]}]};
}
const stub={alive:true,ctrl:0,moveType:'I',coordinateScale:1,pos:{x:0,y:0},facing:1,constant:()=>10};
function commandTest(input,{remap='',time=15,facing=1}={}){
  const parsed=parseCommands(`${remap}\n[Command]\nname="move"\ncommand=${input}\ntime=${time}`),cpu=new CpuController(parsed);
  assert.equal(parsed.diagnostics.length,0);
  cpu.plan=commandInputPlan(parsed.commands[0]);
  let found=false;const actor={...stub,facing};
  const duration=cpu.plan.reduce((sum,segment)=>sum+segment.duration,0);
  for(let i=0;i<duration;i++)if(cpu.tick(actor,stub).has('move'))found=true;
  assert.ok(found,`${input}, facing=${facing}`);return cpu;
}

test('CPU inputs pass real CMD recognition for motions, charges, holds, taps and remapped buttons on either side',()=>{
  for(const facing of [1,-1]){
    for(const input of ['x','x+y','D,DF,F,x','D,DB,B,y','F,F,x','x,x','/D,x','/x,y','x,>~x,y','~30B,F,x','~25x,y','~10a+b,x'])commandTest(input,{facing});
    commandTest('D,DF,F,x',{remap:'[Remap]\na=x\nx=',facing});
  }
});

test('CPU plans use bounded segments and exclude unreachable button remaps',()=>{
  const parsed=parseCommands('[Remap]\nx=\n[Command]\nname="disabled"\ncommand=x\n[Command]\nname="charge"\ncommand=~3600B,a');
  const cpu=new CpuController(parsed);assert.deepEqual(cpu.attacks.map(command=>command.name),['charge']);
  const plan=commandInputPlan(parsed.commands[1]);assert.ok(plan.length<10);assert.ok(plan.some(segment=>segment.duration===3600));
  for(const [source,expected]of [[-1,0],[0,0],[3.8,3],[99,8],[NaN,0],[Infinity,0],['5',5]])assert.equal(normalizeAILevel(source),expected);
});

test('CPU planning is reproducible and pauses freeze the queued motion without losing input sampling',()=>{
  const parsed=parseCommands('[Command]\nname="motion"\ncommand=D,DF,F,x'),one=new CpuController(parsed,{seed:123}),two=new CpuController(parsed,{seed:123});
  const actor={...stub,ctrl:1},opponent={...stub,pos:{x:35,y:0}};
  for(let i=0;i<200;i++)assert.deepEqual(one.tick(actor,opponent),two.tick(actor,opponent));
  one.plan=commandInputPlan(parsed.commands[0]);one.index=0;one.remaining=0;
  one.tick(actor,opponent);one.tick(actor,opponent);
  const before={index:one.index,remaining:one.remaining,raw:[...one.raw]},tick=one.buffer.tick;
  for(let i=0;i<20;i++)one.tick(actor,opponent,{paused:true});
  assert.deepEqual({index:one.index,remaining:one.remaining,raw:[...one.raw]},before);assert.equal(one.buffer.tick,tick+20);
  one.tick(actor,opponent,{enabled:false});assert.equal(one.raw.size,0);assert.equal(one.plan.length,0);
});

test('CPU difficulty activates character CNS AI, survives resets, and reaches helpers; humans stay at zero',()=>{
  const source=character(`[Statedef -1]\n[State -1, native AI]\ntype=ChangeState\ntriggerall=AILevel>0\ntrigger1=stateno=0\nvalue=700\n[Statedef 700]\ntype=S\nphysics=N\n[State 700, level]\ntype=VarSet\ntrigger1=1\nv=0\nvalue=AILevel`);
  const match=new TrainingMatch(source,{playerAILevel:6});match.tick();
  assert.equal(match.player.stateNo,700);assert.equal(match.player.vars[0],6);assert.equal(match.opponent.stateNo,0);assert.equal(match.opponent.evaluate('AILevel'),0);
  const helper=match.spawnHelper(match.player,{stateno:700,id:7});assert.equal(helper.evaluate('AILevel'),6);
  for(const preserveMatch of [false,true]){match.reset({preserveMatch});match.tick();assert.equal(match.player.vars[0],6);assert.equal(match.cpus.size,1);}
  assert.equal(match.diagnostics.length,0);
});

test('TeamMode uses native bare comparisons in the supported Single mode and missing partners yield bottom',()=>{
  const match=new TrainingMatch(character());
  for(const actor of [match.player,match.opponent]){
    assert.equal(actor.evaluate('TeamMode = Single'),1);assert.equal(actor.evaluate('TeamMode != Simul'),1);
    assert.equal(actor.evaluate('TeamMode = Turns'),0);assert.equal(actor.evaluate('enemynear, TeamMode = Single'),1);
    assert.throws(()=>actor.evaluate('partner, life'),error=>error.bottom);assert.equal(actor.diagnostics.length,0);
    assert.throws(()=>actor.evaluate('TeamMode = Unknown'));
  }
});

test('CPU round transitions clear input plans and preserve difficulty through scored round resets',()=>{
  const parsed='[Command]\nname="jab"\ncommand=x',source=character('',parsed);
  const match=new TrainingMatch(source,{playerAILevel:7,opponentAILevel:3,rules:{preIntro:0,introHold:0,roundTime:1/60,overTime:0,resultTime:0}});
  match.tick();assert.equal(match.player.commands.size,0);match.tick();assert.equal(match.opponent.commands.size,0);
  const original=match.player,originalCPU=match.cpus.get(original);match.opponent.life=500;
  match.tick();match.tick();match.tick();
  assert.equal(match.roundFlow.roundNo,2);assert.equal(match.roundFlow.wins.player,1);
  assert.notEqual(match.player,original);assert.notEqual(match.cpus.get(match.player),originalCPU);
  assert.equal(match.player.aiLevel,7);assert.equal(match.opponent.aiLevel,3);
  assert.equal(match.cpus.get(match.player).plan.length,0);
});

test('both sample KFM CPUs walk, recognize native commands and deal actual collision damage',()=>{
  const [sample]=archive(new Uint8Array(readFileSync(new URL('../public/kfm.zip',import.meta.url))));
  assert.ok(characterCommands(sample).commands.length>10);
  const match=new TrainingMatch(sample,{commonText:COMMON_STATES,playerAILevel:8,opponentAILevel:8});
  const commands=new Set(),states=new Set();let hits=0;
  for(let i=0;i<1800;i++){hits+=match.tick().filter(event=>event.type==='hit').length;for(const actor of [match.player,match.opponent]){states.add(actor.stateNo);for(const command of actor.commands)commands.add(command);}}
  assert.ok(states.has(20));assert.ok(commands.has('holdfwd'));assert.ok(commands.has('x')||commands.has('a'));
  assert.ok(hits>=5,`only ${hits} contacts`);assert.ok(match.player.life<1000);assert.ok(match.opponent.life<1000);
  // Correct power awards can reach KFM's recoil spark; the standalone ZIP omits fightfx.air.
  assert.deepEqual(match.diagnostics.filter(issue=>!(issue.controller==='explod'&&issue.state===1027&&issue.message==='Explod common animation 72 does not exist or has no frames.')),[]);
});
