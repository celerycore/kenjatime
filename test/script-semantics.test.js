import {test} from 'node:test';
import assert from 'node:assert/strict';
import {evaluateExpression as evaluate,evaluateTypedExpression as typed,BottomError} from '../src/expressions.js';
import {FighterRuntime,parseSections} from '../src/runtime.js';
import {TrainingMatch} from '../src/combat.js';

const idle='[Statedef 0]\ntype=S\nphysics=N\nmovetype=I\nctrl=0\nanim=0\n';
function character(script='',info={}){return {path:'test.def',def:{info:{name:'Semantics',...info},files:{cns:'test.cns'}},files:{'test.cns':new TextEncoder().encode(idle+script)},animations:[{id:0,frames:[{group:0,number:0,x:0,y:0,ticks:-1,clsn1:[],clsn2:[]}]}]};}
function execute(actor,type,params=''){const c=parseSections(`[State Test]\ntype=${type}\n${params}`)[0];c.type=type.toLowerCase();actor.execute(c);return c;}

test('integer arithmetic wraps in 32 bits and multiplies without losing low bits to double precision',()=>{
  for(const [source,result]of [['2147483647+1',-2147483648],['-2147483648-1',2147483647],['2147483647*2147483647',1],['2147483648',-2147483648],['-2147483648/-1',-2147483648],['2**31',2147483647]])assert.equal(evaluate(source),result,source);
});

test('float literals and every intermediate result use single precision with mixed comparison promotion',()=>{
  assert.equal(evaluate('16777216.0 + 1.0 - 16777216.0'),0);
  assert.equal(evaluate('16777217 = 16777216.0'),1);
  assert.equal(evaluate('16777217 = [16777216,16777216.0]'),1);
  assert.equal(evaluate('16777217 > 16777216'),1);
  assert.equal(evaluate('0.1+0.2'),0.30000001192092896);
  assert.deepEqual(typed('ceil(1.2)'),{value:2,float:false});
  assert.deepEqual(typed('sin(0)'),{value:0,float:true});
  assert.deepEqual(typed('Const240p(3)',{resolve:()=>3}),{value:3,float:true});
  assert.deepEqual(typed('Const(velocity.walk.fwd.x)',{resolve:()=>2}),{value:2,float:true});
});

test('bottom propagates through eager operands and arguments while retaining later assignment side effects',()=>{
  const values=new Map(),context={assign:(name,[index],value)=>{values.set(index,value);return value;},resolve:(name,[index])=>values.get(index)||0};
  for(const source of ['1/0 + (var(0):=5)','min(1/0,var(0):=5)','(1/0) = [var(0):=5,6]']){
    values.clear();assert.throws(()=>evaluate(source,context),error=>error instanceof BottomError);assert.equal(values.get(0),5,source);
  }
  values.clear();assert.throws(()=>evaluate('IfElse(1/0,var(0):=6,var(1):=7)',context),BottomError);assert.equal(values.get(0),6);assert.equal(values.get(1),7);
  values.clear();assert.throws(()=>evaluate('Cond(1/0,var(0):=6,var(1):=7)',context),BottomError);assert.equal(values.size,0);
  assert.throws(()=>evaluate('IfElse(1,2,unknownTrigger)',{resolve:()=>{throw Error('Unknown trigger');}}),/Unknown trigger/);
});

test('native trigger arities reject missing and extra arguments before evaluating side effects',()=>{
  let count=0;const context={assign:()=>{count++;return 1;},resolve:()=>0};
  for(const source of ['var()','var(0,1)','GetHitVar()','AnimElemTime','Const','Const240p(1,2)','NumHelper()','NumTarget(1,2)','Var(var(0):=1,2)','Cond(1,0,abs(1,2))','IfElse(0,var(0):=1)','log(2)','Cond(1,0,Time(var(0):=1))','Life(1)'])assert.throws(()=>evaluate(source,context),/requires/,source);
  assert.equal(count,0);
});

test('legacy name and type comparisons are boolean atoms and absent team names never match even empty strings',()=>{
  const f=new FighterRuntime(character());
  assert.equal(f.evaluate('3 + P1Name = "Semantics"'),4);
  assert.equal(f.evaluate('1 + StateType = S'),2);
  assert.equal(f.evaluate('1 + MoveType = I'),2);
  assert.equal(f.evaluate('P3Name = ""'),0);assert.equal(f.evaluate('P3Name != ""'),1);
  assert.equal(f.evaluate('P4Name = ""'),0);assert.equal(f.evaluate('P2Name = ""'),0);
  assert.throws(()=>f.evaluate('P2StateNo'),BottomError);
  f.facing=-1;assert.equal(f.evaluate('FrontEdge'),-160);assert.equal(f.evaluate('BackEdge'),160);
});

test('trigger groups stop at the first missing number and never evaluate skipped side effects',()=>{
  const f=new FighterRuntime(character('[State Gap]\ntype=VarSet\ntrigger1=0\ntrigger3=var(0):=9\nv=1\nvalue=8\n[State No first]\ntype=VarSet\ntriggerall=var(2):=4\ntrigger2=1\nv=3\nvalue=7'));
  f.tick();assert.deepEqual([...f.vars.slice(0,4)],[0,0,0,0]);assert.ok(f.diagnostics.some(d=>d.type==='trigger-numbering'));assert.ok(f.diagnostics.some(d=>/requires at least one trigger1/.test(d.message)));
});

test('controller flags require constants and invalid flags never execute assignments or bodies during hitpause',()=>{
  const f=new FighterRuntime(character('[State Invalid ignore]\ntype=VarSet\ntrigger1=1\nignorehitpause=var(0):=1\nv=1\nvalue=5\n[State Invalid persistence]\ntype=VarSet\ntrigger1=1\npersistent=1.0\nv=2\nvalue=6\n[State Valid]\ntype=VarAdd\ntrigger1=1\nignorehitpause=1\npersistent=0\nv=3\nvalue=1'));
  f.hitPauseTime=2;f.tick();f.tick();f.tick();assert.deepEqual([...f.vars.slice(0,4)],[0,0,0,1]);assert.equal(f.time,1);assert.equal(f.diagnostics.filter(d=>/integer constant/.test(d.message)).length,2);
  f.changeState(0);f.tick();assert.equal(f.vars[3],2);
});

test('bottom disables trigger groups but numeric controller parameters receive zero and subsequent controllers continue',()=>{
  const f=new FighterRuntime(character('[State Invalid trigger]\ntype=VarSet\ntrigger1=1/0\nv=0\nvalue=9\n[State Bottom parameter]\ntype=VelSet\ntrigger1=1\nx=1/0\ny=var(1):=4\n[State Continued]\ntype=VarSet\ntrigger1=1\nv=2\nvalue=8\n[State Invalid syntax]\ntype=VarSet\ntrigger1=1\nv=3\nvalue=unknownTrigger'));
  f.tick();assert.equal(f.vel.x,0);assert.equal(f.vel.y,4);assert.deepEqual([...f.vars.slice(0,4)],[0,4,8,0]);assert.ok(f.diagnostics.some(d=>d.type==='parameter-bottom'));assert.ok(f.diagnostics.some(d=>d.type==='expression'&&/unknowntrigger/.test(d.message)));
  execute(f,'HitDef','attr=S,NA\ndamage=1/0,7');assert.deepEqual(f.hitDef.damage,[0,7]);
  execute(f,'DisplayToClipboard','text="bottom=%d later=%d"\nparams=1/0,var(4):=12');assert.equal(f.clipboard,'bottom=0 later=12');assert.equal(f.vars[4],12);
});

test('VarRangeSet evaluates its expression once, float storage rounds, and int VarAdd casts its operand before addition',()=>{
  const f=new FighterRuntime(character());
  execute(f,'VarRangeSet','first=0\nlast=4\nvalue=var(10):=var(10)+1');assert.deepEqual([...f.vars.slice(0,5)],[1,1,1,1,1]);assert.equal(f.vars[10],1);
  execute(f,'VarSet','v=0\nvalue=-1');execute(f,'VarAdd','v=0\nvalue=.9');assert.equal(f.vars[0],-1);
  const add=parseSections('[State Float]\nfv=0\nvalue=.1')[0];add.type='varadd';for(let i=0;i<10;i++)f.execute(add);assert.equal(f.fvars[0],1.0000001192092896);
  execute(f,'VarSet','sysfvar(0)=.1');assert.equal(f.sysfvars[0],0.10000000149011612);
});

test('alternate variable targets retain comparisons and assignments inside the index expression',()=>{
  const f=new FighterRuntime(character('[State Dynamic target]\ntype=VarSet\ntrigger1=1\nvar(IfElse(time=0,0,1))=7\n[State Side effect target]\ntype=VarAdd\ntrigger1=1\nvar(var(2):=3)=var(2)'));
  f.tick();assert.deepEqual([...f.vars.slice(0,4)],[7,0,3,3]);f.tick();assert.deepEqual([...f.vars.slice(0,4)],[7,7,3,6]);assert.deepEqual(f.diagnostics,[]);
});

test('VarRandom single ranges mean zero through maximum and two-value bounds are inclusive',()=>{
  const f=new FighterRuntime(character()),single=parseSections('[State Single]\nv=0\nrange=5')[0],pair=parseSections('[State Pair]\nv=1\nrange=0,1000')[0];single.type=pair.type='varrandom';const seen=new Set(),large=new Set();
  for(let i=0;i<12000;i++){f.execute(single);seen.add(f.vars[0]);f.execute(pair);large.add(f.vars[1]);}
  assert.deepEqual([...seen].sort(),[0,1,2,3,4,5]);assert.ok(large.has(0)&&large.has(1000));assert.equal(Math.max(...large),1000);assert.equal(Math.min(...large),0);
});

test('target parameters evaluate once per activation, including when there are no matching targets',()=>{
  const f=new FighterRuntime(character()),a=new FighterRuntime(character()),b=new FighterRuntime(character());f.targets=[a,b];
  execute(f,'TargetLifeAdd','value=-(var(0):=var(0)+10)\nabsolute=1');assert.equal(f.vars[0],10);assert.equal(a.life,990);assert.equal(b.life,990);
  execute(f,'TargetBind','pos=var(1):=var(1)+1,var(1):=var(1)+1\ntime=var(2):=var(2)+1');assert.equal(f.vars[1],2);assert.equal(f.vars[2],1);assert.deepEqual([a.bound.x,a.bound.y,a.bound.time],[1,2,1]);assert.deepEqual([b.bound.x,b.bound.y,b.bound.time],[1,2,1]);
  f.targets=[];execute(f,'TargetPowerAdd','value=var(3):=5');assert.equal(f.vars[3],5);
});

test('statedef persistence flags accept expressions evaluated before clearing prior hit information',()=>{
  const f=new FighterRuntime(character('[Statedef 1]\ntype=U\nmovetype=U\nphysics=U\nhitdefpersist=var(0):=1\nmovehitpersist=MoveHit!=0\nhitcountpersist=var(0)'));
  const hit={attr:'S,NA'};f.hitDef=hit;f.moveHit=3;f.moveContact=5;f.hitCount=2;f.stateType='A';f.moveType='A';f.physics='A';f.changeState(1);
  assert.equal(f.hitDef,hit);assert.equal(f.moveHit,3);assert.equal(f.moveContact,5);assert.equal(f.hitCount,2);assert.equal(f.vars[0],1);assert.equal(f.stateType,'A');assert.equal(f.moveType,'A');assert.equal(f.physics,'A');
  f.changeState(0);assert.equal(f.hitDef,null);assert.equal(f.moveHit,0);assert.equal(f.hitCount,0);
});

test('life and power controllers coerce integer amounts and honor absolute damage and kill defaults',()=>{
  const f=new FighterRuntime(character()),target=new FighterRuntime(character());f.defenceMultiplier=.5;
  execute(f,'LifeAdd','value=-100');assert.equal(f.life,950);
  execute(f,'LifeAdd','value=-100\nabsolute=1');assert.equal(f.life,850);
  execute(f,'LifeAdd','value=10.9');assert.equal(f.life,855);
  execute(f,'LifeAdd','value=-5000\nkill=0\nabsolute=1');assert.equal(f.life,1);
  execute(f,'LifeSet','value=1000.9');assert.equal(f.life,1000);
  execute(f,'PowerSet','value=100.9');assert.equal(f.power,100);execute(f,'PowerAdd','value=-.9');assert.equal(f.power,100);
  f.targets=[target];f.attackMultiplier=2;target.defenceMultiplier=.25;
  execute(f,'TargetLifeAdd','value=-100');assert.equal(target.life,950);
  execute(f,'TargetLifeAdd','value=-100\nabsolute=1');assert.equal(target.life,850);
  execute(f,'TargetFacing','value=0');assert.equal(target.facing,1);
});

test('HitOverride cancellation accepts an omitted destination and skips unused destination expressions',()=>{
  const f=new FighterRuntime(character());execute(f,'HitOverride','attr=S,NA\nstateno=0\ntime=-1');assert.equal(f.hitOverrides.size,1);
  execute(f,'HitOverride','attr=\ntime=0');assert.equal(f.hitOverrides.size,0);
  execute(f,'HitOverride','attr=S,NA\nstateno=0\ntime=-1');
  execute(f,'HitOverride','time=var(0):=0\nstateno=var(1):=99');assert.equal(f.hitOverrides.size,0);assert.equal(f.vars[1],0);
});

test('missing required controller parameters are reported without invoking default state changes or attacks',()=>{
  const f=new FighterRuntime(character('[State Missing value]\ntype=ChangeState\ntrigger1=1\n[State Missing attr]\ntype=HitDef\ntrigger1=1\ndamage=10\n[State Continue]\ntype=VarSet\ntrigger1=1\nv=0\nvalue=7'));
  f.tick();assert.equal(f.time,1);assert.equal(f.hitDef,null);assert.equal(f.vars[0],7);assert.ok(f.diagnostics.some(d=>/changestate requires value/.test(d.message)));assert.ok(f.diagnostics.some(d=>/hitdef requires attr/.test(d.message)));
});

test('ignorehitpause does not bypass global Pause and does not consume persistence while frozen',()=>{
  const c=character('[State Count]\ntype=VarAdd\ntrigger1=1\nignorehitpause=1\npersistent=0\nv=0\nvalue=1'),world=new TrainingMatch(c,{initialize:false,pushboxes:false});
  world.player.hitPauseTime=2;world.requestPause(world.opponent,{type:'pause',time:2,movetime:0});world.advancePause();world.tick();world.tick();assert.equal(world.player.vars[0],0);assert.equal(world.player.hitPauseTime,2);
  world.tick();assert.equal(world.player.vars[0],1);world.tick();assert.equal(world.player.vars[0],1);assert.equal(world.player.time,0);world.tick();assert.equal(world.player.time,1);
});
