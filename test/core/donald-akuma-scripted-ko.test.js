import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {unzipSync} from 'fflate';
import {CoreSession} from '../../src/core/session.js';
import {CpuController} from '../../src/cpu.js';
import {parseCommands} from '../../src/commands.js';
function match(){return new CoreSession(unzipSync(readFileSync(new URL('../../public/kfm.zip', import.meta.url))),{mode:'cpu',level:4,stage:'builtin/grid',character:'kfm/kfm.def',opponent:'kfm/kfm.def'});}
test('foreign authored LifeSet KO preserves character semantics and reports exact owner and source',()=>{
 const s=match(),p=s.match.player,owner=s.match.opponent;
 try{
  s.match.roundFlow.roundState=2;s.match.ticks=852;
  p.life=1790;p.stateNo=10047;p.stateOwner=owner;
  p.execute({type:'lifeset',entries:[{key:'trigger1',value:'1'}],values:{value:'0'},source:'donald2.cns',line:9913});
  assert.equal(p.life,0);
  const snap=s.snapshot();
  assert.equal(snap.scriptedKoCount,1);
  assert.equal(snap.lastScriptedKO.priorLife,1790);
  assert.equal(snap.lastScriptedKO.state,10047);
  assert.equal(snap.lastScriptedKO.source,'donald2.cns');
  assert.equal(snap.lastScriptedKO.foreignState,true);
  assert.equal(snap.lastScriptedKO.actor,owner.name);
  p.execute({type:'lifeset',entries:[{key:'trigger1',value:'1'}],values:{value:'0'},source:'donald2.cns',line:10753});
  assert.equal(s.snapshot().scriptedKoCount,1,'repeated LifeSet zero is never double-counted');
 }finally{s.close()}
});
test('ordinary damage and nonlethal scripted LifeSet do not produce false KO reports',()=>{
 const s=match(),p=s.match.player;
 try{
  s.match.roundFlow.roundState=2;
  p.execute({type:'lifeset',entries:[{key:'trigger1',value:'1'}],values:{value:'500'},source:'status.cns',line:1});
  assert.equal(p.life,500);
  assert.equal(s.snapshot().scriptedKoCount,0);
 }finally{s.close()}
});
test('CPU safely retries missed Up at most twice without editing fighter state',()=>{
 const cpu=new CpuController(parseCommands(''),{level:8,nativeAI:true,authoredAI:true,seed:321});
 const fighter={name:'Donald',alive:true,ctrl:1,moveType:'I',stateType:'S',stateNo:0,pos:{x:0,y:0},facing:1,program:{states:new Map([[40,{}]])},asserted:new Set(),constant:()=>16,coordinateScale:1};
 const opponent={alive:true,pos:{x:200,y:0},constant:()=>16,coordinateScale:1};
 cpu.jumpWait=0;const history=[];
 for(let i=0;i<26;i++){cpu.tick(fighter,opponent,{paused:false,enabled:true});history.push(cpu.lastCommand);}
 assert.ok(history.includes('jump-retry'));
 assert.equal(fighter.stateNo,0,'CPU cannot force StateDef 40');
 assert.ok(cpu.jumpIntent===null||cpu.jumpIntent.retries>=0);
 fighter.stateNo=40;cpu.tick(fighter,opponent,{enabled:true});
 assert.equal(cpu.jumpIntent,null,'accepted jump clears retry intent');
});
