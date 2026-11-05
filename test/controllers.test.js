import {test} from 'node:test';
import assert from 'node:assert/strict';
import {FighterRuntime,parseSections,supportedControllers} from '../src/runtime.js';
import {TrainingMatch} from '../src/combat.js';
import {clipboardFormat,formatClipboard} from '../src/debug.js';
import {evaluateTypedExpression} from '../src/expressions.js';

const frame={group:0,number:0,x:0,y:0,ticks:2,flip:'',clsn1:[],clsn2:[]};
function character(script='',info={}){return{path:'c.def',def:{info:{name:'Fighter',...info},files:{cns:'c.cns'}},files:{'c.cns':new TextEncoder().encode('[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nctrl=0\nanim=0\n'+script)},animations:[{id:0,frames:[{...frame,ticks:-1}]}]};}
const common=new Map([0,120].map(id=>[id,{id,frames:[frame,{...frame,number:1}]}]));

test('MakeDust emits spaced, facing-relative common effects at both requested positions',()=>{
  const f=new FighterRuntime(character('[State Dust]\ntype=MakeDust\ntrigger1=1\npos=8,-4\npos2=-8,0\nspacing=3',{localcoord:'1280,720'}),{commonAnimations:common,position:{x:10,y:0},facing:-1});
  const counts=[];for(let i=0;i<7;i++)counts.push(f.tick().filter(e=>e.type==='gameanim').length);
  assert.deepEqual(counts,[2,0,0,2,0,0,2]);
  const events=f.events.filter(e=>e.type==='gameanim');assert.deepEqual(events[0].pos,{x:8,y:-1});assert.deepEqual(events[1].pos,{x:12,y:0});
  assert.equal(events[0].anim,120);assert.equal(events[0].under,true);assert.equal(events[0].common,true);assert.equal(events[0].facing,-1);
  f.changeState(0);assert.equal(f.tick().filter(e=>e.type==='gameanim').length,2);
});

test('GameMakeAnim uses fightfx and bounds each independent random displacement',()=>{
  const f=new FighterRuntime(character('[State FX]\ntype=GameMakeAnim\ntrigger1=1\nvalue=0\npos=20,-10\nrandom=40\nunder=1'),{commonAnimations:common});
  for(let i=0;i<20;i++){
    const e=f.tick().find(e=>e.type==='gameanim');assert.equal(e.anim,0);assert.equal(e.under,true);
    assert.ok(e.pos.x>=0&&e.pos.x<=40);assert.ok(e.pos.y>=-30&&e.pos.y<=10);
  }
  assert.equal(f.diagnostics.length,0);
});

test('Legacy effects report missing fightfx and invalid spacing without spawning placeholders',()=>{
  const f=new FighterRuntime(character('[State Dust]\ntype=MakeDust\ntrigger1=1'));
  f.tick();assert.ok(f.diagnostics.some(d=>d.type==='missing-animation'&&d.message.includes('120')));assert.ok(!f.events.some(e=>e.type==='gameanim'));
  const invalid=new FighterRuntime(character('[State Dust]\ntype=MakeDust\ntrigger1=1\nspacing=0'),{commonAnimations:common});invalid.tick();assert.ok(invalid.diagnostics.some(d=>d.message.includes('spacing')));
});

test('Clipboard formatting preserves numeric types, escapes, printf precision and assignment order',()=>{
  const f=new FighterRuntime(character(String.raw`[State Display]
type=DisplayToClipboard
trigger1=time=0
text="The value of var(17) is %d, which is %f%% of 23.\n\t--Kiwi."
params=var(17):=1,var(17)/.230
[State Append]
type=AppendToClipboard
trigger1=time=1
text="quote: \"a;b\" \\ %d %f"
params=1.0,2
[State Clear]
type=ClearClipboard
trigger1=time=2`));
  f.tick();assert.equal(f.clipboard,'The value of var(17) is 1, which is 4.347826% of 23.\n    --Kiwi.');assert.equal(f.vars[17],1);
  f.tick();assert.ok(f.clipboard.endsWith('\nquote: "a;b" \\ 1.000000 2'));f.tick();assert.equal(f.clipboard,'');assert.equal(f.diagnostics.length,0);
  assert.deepEqual(evaluateTypedExpression('1.0'),{value:1,float:true});assert.deepEqual(evaluateTypedExpression('2/2'),{value:1,float:false});
});

test('Clipboard printf supports signed widths, scientific notation and significant digits',()=>{
  const output=formatClipboard(clipboardFormat('"%+06d | %-5d | %.2f | %.2E | %.3g | %#.3g"'),[
    {value:12,float:false},{value:-3,float:false},{value:1.25,float:true},{value:.002,float:true},{value:1.2,float:true},{value:1.2,float:true}]);
  assert.equal(output,'+00012 | -3    | 1.25 | 2.00E-03 | 1.2 | 1.20');
});

test('Clipboard validation rejects unsafe formats and parameter counts before evaluating side effects',()=>{
  for(const format of ['"%s"','"%n"','"%lld"','"%999999d"','"%.99f"'])assert.throws(()=>clipboardFormat(format));
  const f=new FighterRuntime(character('[State Bad]\ntype=DisplayToClipboard\ntrigger1=1\ntext="%d"\nparams=var(0):=3,var(1):=4'));
  f.tick();assert.equal(f.clipboard,'');assert.equal(f.vars[0],0);assert.equal(f.vars[1],0);assert.ok(f.diagnostics.some(d=>d.message.includes('requires 1 parameters')));
  const sections=parseSections(String.raw`[State Text]
text="escaped quote \"; still text" ; comment
params=1`);assert.equal(sections[0].values.text,String.raw`"escaped quote \"; still text"`);
});

test('VictoryQuote selects the winning root quote, ignores helpers and preserves the request across rounds',()=>{
  const c=character('[Quotes]\nvictory2="Keep training."\nvictory7="Try again."\n[Statedef 700]\n[State Quote]\ntype=VictoryQuote\ntrigger1=1\nvalue=2');
  const world=new TrainingMatch(c,{initialize:false,rules:{preIntro:0,introHold:0,overTime:0,resultTime:0,roundsToWin:2}});
  world.player.victoryQuoteIndex=7;const helper=world.spawnHelper(world.player,{stateno:700});world.tick();assert.equal(helper.victoryQuoteIndex,-1);assert.equal(world.player.victoryQuoteIndex,7);
  world.tick();world.opponent.life=0;world.tick();world.tick();world.tick();assert.equal(world.roundFlow.roundNo,2);assert.equal(world.player.victoryQuoteIndex,7);
  world.tick();world.tick();world.opponent.life=0;world.tick();world.tick();assert.equal(world.matchOver,true);assert.equal(world.player.victoryQuote,'Try again.');
  world.reset();assert.equal(world.player.victoryQuoteIndex,-1);assert.equal(world.player.victoryQuote,null);
});

test('VictoryQuote controllers can override a previously chosen quote and invalid requests select an existing quote',()=>{
  const f=new FighterRuntime(character('[Quotes]\nvictory0="A"\nvictory99="B"\n[Statedef 8]\n[State Quote]\ntype=VictoryQuote\ntrigger1=1\nvalue=99'));
  f.victoryQuoteIndex=1000;const fallback=f.selectVictoryQuote();assert.ok(['A','B'].includes(fallback));assert.equal(f.selectVictoryQuote(),fallback);
  f.changeState(8);f.tick();assert.equal(f.selectVictoryQuote(),'B');
});

test('Repeated random VictoryQuote requests retain one quote on the victory screen',()=>{
  const f=new FighterRuntime(character('[Quotes]\nvictory0="A"\nvictory1="B"\n[State Quote]\ntype=VictoryQuote\ntrigger1=1\nvalue=-1'));
  f.tick();const quote=f.selectVictoryQuote(),seed=f._seed;f.tick();assert.equal(f.selectVictoryQuote(),quote);assert.equal(f._seed,seed);
});

test('Every newly supported native controller has a registered executable path',()=>{
  for(const name of ['makedust','gamemakeanim','forcefeedback','displaytoclipboard','appendtoclipboard','clearclipboard','victoryquote'])assert.ok(supportedControllers.has(name));
});
