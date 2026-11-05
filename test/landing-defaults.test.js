import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {archive} from '../src/formats.js';
import {TrainingMatch} from '../src/combat.js';
import {FighterRuntime} from '../src/runtime.js';
import {COMMON_STATES} from '../src/common.js';

const bytes=s=>new TextEncoder().encode(s);
function character(script='',width=320){return{path:'c.def',def:{info:{name:'Landing defaults fixture',localcoord:`${width},240`},files:{cns:'c.cns'}},files:{'c.cns':bytes(`[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nctrl=1\nanim=0\n${script}`)},animations:[{id:0,frames:[{group:0,number:0,x:0,y:0,ticks:-1,clsn1:[],clsn2:[]}]}]};}
const defaults={
  'movement.air.gethit.groundlevel':25,'movement.air.gethit.groundrecover.ground.threshold':-20,'movement.air.gethit.groundrecover.groundlevel':10,'movement.air.gethit.airrecover.threshold':-1,'movement.air.gethit.airrecover.yaccel':.35,
  'velocity.air.gethit.groundrecover.x':-.15,'velocity.air.gethit.groundrecover.y':-3.5,'velocity.air.gethit.airrecover.mul.x':.5,'velocity.air.gethit.airrecover.mul.y':.2,'velocity.air.gethit.airrecover.add.x':0,'velocity.air.gethit.airrecover.add.y':-4.5,'velocity.air.gethit.airrecover.back':-1,'velocity.air.gethit.airrecover.fwd':0,'velocity.air.gethit.airrecover.up':-2,'velocity.air.gethit.airrecover.down':1.5,
};

test('legacy characters omitting modern recovery constants receive native stock defaults',()=>{
  const p=new FighterRuntime(character());for(const [name,value]of Object.entries(defaults))assert.equal(p.constant(name),value,name);assert.throws(()=>p.constant('movement.not.a.real.constant'),/Unknown character constant/);
});

test('explicit movement/velocity definitions override recovery defaults component by component',()=>{
  const p=new FighterRuntime(character('[Movement]\nair.gethit.groundlevel=8\nair.gethit.airrecover.yaccel=.7\n[Velocity]\nair.gethit.airrecover.mul=.75,.4\nair.gethit.airrecover.add=2,-6'));assert.equal(p.constant('movement.air.gethit.groundlevel'),8);assert.equal(p.constant('movement.air.gethit.airrecover.yaccel'),.7);assert.equal(p.constant('velocity.air.gethit.airrecover.mul.x'),.75);assert.equal(p.constant('velocity.air.gethit.airrecover.mul.y'),.4);assert.equal(p.constant('velocity.air.gethit.airrecover.add.y'),-6);assert.equal(p.constant('movement.air.gethit.groundrecover.groundlevel'),10);
});

for(const width of [320,640,1280])test(`recovery distances/velocities convert in foreign states while multipliers stay dimensionless (${width})`,()=>{
  const owner=new FighterRuntime(character('[Statedef 6000]\ntype=U\nphysics=N')),p=new FighterRuntime(character('',width));p.changeState(6000,undefined,owner);const scale=320/width;assert.equal(p.constant('movement.air.gethit.groundlevel'),25*scale);assert.equal(p.constant('velocity.air.gethit.airrecover.add.y'),-4.5*scale);assert.equal(p.constant('velocity.air.gethit.airrecover.mul.x'),.5);assert.equal(p.constant('velocity.air.gethit.airrecover.mul.y'),.2);
});

test('a foreign falling state can land through native Const thresholds after a combo',()=>{
  const foreign='[Statedef 6050]\ntype=A\nmovetype=H\nphysics=N\n[State Gravity]\ntype=VelAdd\ntrigger1=1\ny=.35\n[State Land]\ntype=SelfState\ntrigger1=Pos Y >= Const(movement.air.gethit.groundlevel)\ntrigger1=Vel Y>0\nvalue=5100';
  const w=new TrainingMatch(character(),{opponentCharacter:character(foreign),initialize:false,commonText:COMMON_STATES,pushboxes:false});w.player.changeState(6050,undefined,w.opponent);w.player.pos.y=-80;w.player.vel.y=2;w.player.getHitVars.fall=1;
  let deepest=0;for(let i=0;i<180;i++){w.tick();deepest=Math.max(deepest,w.player.pos.y);}assert.ok(deepest<40);assert.equal(w.player.pos.y,0);assert.equal(w.player.stateOwner,w.player);assert.equal(w.player.stateNo,0);assert.ok(!w.diagnostics.some(d=>d.message.includes('Unknown character constant')));
});

test('a reported far-below-floor position returns through landing states instead of accumulating gravity forever',()=>{
  const w=new TrainingMatch(character(),{initialize:false,commonText:COMMON_STATES,pushboxes:false});w.player.changeState(5050);w.player.pos.y=22019.649592906237;w.player.vel.y=124.14999780058861;w.player.getHitVars={...w.player.getHitVars,fall:1,yaccel:.35};w.tick();assert.equal(w.player.pos.y,0);for(let i=0;i<180;i++)w.tick();assert.equal(w.player.pos.y,0);assert.equal(w.player.stateNo,0);
});

test('supplied Shiki common fall scripts land and recover from the captured post-combo values',{skip:!process.env.MUGEN_SHIKI_SCRIPTS||!process.env.MUGEN_SHIKI_REPORT||!existsSync(process.env.MUGEN_SHIKI_SCRIPTS)||!existsSync(process.env.MUGEN_SHIKI_REPORT)},()=>{
  const [c]=archive(new Uint8Array(readFileSync(process.env.MUGEN_SHIKI_SCRIPTS))),report=JSON.parse(readFileSync(process.env.MUGEN_SHIKI_REPORT)),w=new TrainingMatch(c,{initialize:false,commonText:COMMON_STATES,pushboxes:false}),p=w.player;p.changeState(5050);p.pos={...report.player.pos};p.vel={...report.player.vel};p.getHitVars={...report.player.getHitVars};p.hitTime=-1;
  w.tick();assert.equal(p.stateNo,5100);assert.equal(p.pos.y,0);for(let i=0;i<179;i++)w.tick();assert.equal(p.stateNo,0);assert.equal(p.pos.y,0);assert.equal(p.ctrl,1);assert.ok(!w.diagnostics.some(d=>d.message.includes('Unknown character constant')));
});
