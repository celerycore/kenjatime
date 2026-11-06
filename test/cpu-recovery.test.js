import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {archive} from '../src/formats.js';
import {TrainingMatch} from '../src/combat.js';
import {COMMON_STATES} from '../src/common.js';
import {CommandBuffer} from '../src/commands.js';
import {characterCommands} from '../src/cpu.js';

const enc=s=>new TextEncoder().encode(s);
function character({cmd='[Command]\nname="recovery"\ncommand=x+y\ntime=5',name='recovery',gate='1',extra=''}={}){
  return{path:'c.def',def:{info:{name:'CPU recovery fixture'},files:{cns:'c.cns',cmd:'c.cmd'}},files:{'c.cmd':enc(cmd),'c.cns':enc(`[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nctrl=1\nanim=0\n[Statedef 5050]\ntype=A\nmovetype=H\nphysics=N\nctrl=0\nanim=0\n[State Tech]\ntype=SelfState\ntriggerall=CanRecover\ntriggerall=${gate}\ntrigger1=command="${name}"\nvalue=5210\n${extra}`)},animations:[{id:0,frames:[{group:-1,number:0,x:0,y:0,ticks:-1,clsn1:[],clsn2:[]}]}]};
}
function setup(source=character(),options={}){
  const w=new TrainingMatch(source,{opponentCharacter:character(),commonText:COMMON_STATES,initialize:false,pushboxes:false,playerAILevel:8,...options}),p=w.player;
  p.changeState(5050);p.pos.y=-150;p.vel={x:0,y:0};p.hitTime=100;p.getHitVars={...p.getHitVars,fall:1,'fall.time':0,'fall.recover':1,'fall.recovertime':12};
  return w;
}

test('CPU air tech uses a real CMD chord while ctrl=0 and never presses before CanRecover',()=>{
  const w=setup(),p=w.player;for(let i=0;i<12;i++){w.tick();assert.equal(p.stateNo,5050);assert.equal(p.rawInput.size,0);}
  let tech=false;for(let i=0;i<30;i++){w.tick();if(p.stateNo===5210){assert.ok(p.commands.has('recovery'));assert.deepEqual([...p.rawInput].sort(),['x','y']);tech=true;break;}}
  assert.ok(tech);assert.equal(p.stateOwner,p);assert.equal(w.diagnostics.length,0);
});

test('Unrecoverable falls, KO and disabled CPU do not manufacture recovery input or escape states',()=>{
  for(const mode of ['unrecoverable','ko','human']){
    const w=setup(character(),{playerAILevel:mode==='human'?0:8}),p=w.player;
    if(mode==='unrecoverable')p.getHitVars['fall.recover']=0;if(mode==='ko')p.life=0;
    for(let i=0;i<80;i++){w.tick();assert.equal(p.stateNo,5050);assert.equal(p.rawInput.size,0);}
  }
});

test('CPU retries late authored recovery windows and discovers custom names beyond attack selection limits',()=>{
  const prefix=Array.from({length:600},(_,i)=>`[Command]\nname="ordinary${i}"\ncommand=a\ntime=1`).join('\n');
  const w=setup(character({cmd:prefix+'\n[Command]\nname="ukemi"\ncommand=x+y\ntime=1',name:'ukemi',gate:'Time>=50'})),p=w.player;let attempts=0;
  for(let i=0;i<90;i++){
    const time=p.time;w.tick();if(p.commands.has('ukemi'))attempts++;
    if(p.stateNo===5210){assert.ok(time>=50);break;}
  }
  assert.ok(attempts>=2);assert.equal(p.stateNo,5210);assert.equal(w.diagnostics.length,0);
});

test('Recovery follows physical button remaps and facing-relative charged motion inputs',()=>{
  for(const facing of [-1,1]){
    const w=setup(character({cmd:'[Remap]\na=x\nx=\n[Command]\nname="recovery"\ncommand=~2B,F,x\ntime=12'})),p=w.player;p.facing=facing;
    const inputs=[];for(let i=0;i<60&&p.stateNo!==5210;i++){w.tick();inputs.push([...p.rawInput]);}
    assert.equal(p.stateNo,5210);assert.ok(inputs.some(keys=>keys.includes('a')));assert.ok(inputs.some(keys=>keys.includes(facing===1?'L':'R')));assert.ok(!inputs.some(keys=>keys.includes('x')));
  }
});

test('Ground tech stays behind the authored position and velocity conditions',()=>{
  const source=character(),text=new TextDecoder().decode(source.files['c.cns']).replace('triggerall=1','triggerall=Pos Y>=-20\ntriggerall=Vel Y>0').replace('value=5210','value=5200');
  source.files['c.cns']=enc(text+'\n[Statedef 5200]\ntype=S\nmovetype=I\nphysics=N\nctrl=1\nanim=0');
  const w=setup(source),p=w.player;p.pos.y=-100;p.vel.y=1;
  for(let i=0;i<100;i++){const y=p.pos.y;w.tick();if(p.stateNo===5200){assert.ok(y>=-20);break;}}
  assert.equal(p.stateNo,5200);assert.equal(p.stateOwner,p);
});

test('Non-falling guard stun keeps its existing queued defensive input',()=>{
  const w=setup(),p=w.player,cpu=w.cpus.get(p);p.getHitVars.fall=0;p.getHitVars.guarded=1;cpu.queue(['B'],5);
  w.tick();assert.ok(p.rawInput.has('L'));assert.equal(cpu.recovering,false);
});

test('Foreign fall-state recovery requests restore the victim program through its authored SelfState',()=>{
  const owner=character({cmd:'',extra:'[Statedef 6050]\ntype=A\nmovetype=H\nphysics=N\nctrl=0\n[State Escape]\ntype=SelfState\ntriggerall=CanRecover\ntrigger1=command="recovery"\nvalue=5210'});
  const w=setup(character(),{opponentCharacter:owner}),p=w.player;p.changeState(6050,undefined,w.opponent);p.pos.y=-150;
  for(let i=0;i<50&&p.stateNo!==5210;i++)w.tick();assert.equal(p.stateNo,5210);assert.equal(p.stateOwner,p);assert.equal(p.animationOwner,p);
});

test('A new hit closes the recovery window and cancels an unfinished recovery motion',()=>{
  const w=setup(character({cmd:'[Command]\nname="recovery"\ncommand=~20B,F,x\ntime=30'})),p=w.player,cpu=w.cpus.get(p);
  for(let i=0;i<20;i++)w.tick();assert.ok(cpu.plan.length);assert.ok(p.rawInput.size);
  p.getHitVars['fall.time']=0;p.getHitVars['fall.recovertime']=40;
  for(let i=0;i<12;i++){w.tick();assert.equal(p.rawInput.size,0);assert.equal(p.stateNo,5050);}assert.equal(cpu.plan.length,0);
});

test('Global pause freezes CPU recovery plans and elapsed fall time, then recovery resumes',()=>{
  const w=setup(),p=w.player;p.getHitVars['fall.time']=20;w.tick();w.requestPause(w.opponent,{type:'pause',time:12,pausebg:1});w.tick();
  const cpu=w.cpus.get(p),before={time:p.getHitVars['fall.time'],index:cpu.index,remaining:cpu.remaining,cooldown:cpu.cooldown};
  for(let i=0;i<8;i++)w.tick();assert.deepEqual({time:p.getHitVars['fall.time'],index:cpu.index,remaining:cpu.remaining,cooldown:cpu.cooldown},before);
  for(let i=0;i<30&&p.stateNo!==5210;i++)w.tick();assert.equal(p.stateNo,5210);
});

test('Human recovery remains driven by the supplied button input',()=>{
  const w=setup(character(),{playerAILevel:0}),p=w.player,buffer=new CommandBuffer(characterCommands(p.character));
  for(let i=0;i<25;i++)w.tick();assert.equal(p.stateNo,5050);
  const raw=new Set(['x','y']);w.tick(buffer.update(raw,p.facing),new Set(),{playerInput:raw});assert.equal(p.stateNo,5210);
});

const scripts=process.env.MUGEN_ES_SCRIPTS,report=process.env.MUGEN_ES_REPORT;
test('Supplied Es scripts air-tech from the reported state after the opponent stops hitting',{skip:!scripts||!report||!existsSync(scripts)||!existsSync(report)},()=>{
  const [source]=archive(new Uint8Array(readFileSync(scripts))),snapshot=JSON.parse(readFileSync(report)).player,w=setup(source,{playerAILevel:7}),p=w.player;
  p.changeState(snapshot.stateNo);Object.assign(p,{time:snapshot.time,ctrl:snapshot.ctrl,stateType:snapshot.stateType,moveType:snapshot.moveType,physics:snapshot.physics,life:snapshot.life,hitTime:snapshot.hitTime,hitPauseTime:snapshot.hitPauseTime});
  p.pos={...snapshot.pos};p.vel={...snapshot.vel};p.getHitVars={...snapshot.getHitVars};p.vars.set(snapshot.variables.int);p.fvars.set(snapshot.variables.float);p.sysvars.set(snapshot.variables.systemInt);p.sysfvars.set(snapshot.variables.systemFloat);p.changeAnimation(snapshot.anim);
  let tech=false;for(let i=0;i<80;i++){w.tick();if(p.stateNo===5210){tech=true;assert.ok(p.commands.has('recovery'));assert.equal(p.stateOwner,p);break;}}
  assert.ok(tech,'CPU must request an authored air tech before landing');assert.ok(p.pos.y<0);assert.equal(p.moveType,'I');
});
