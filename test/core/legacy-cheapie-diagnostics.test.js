import {test} from 'node:test';
import assert from 'node:assert/strict';
import {hitAttribute,attributeMatches} from '../../src/hit-filters.js';
import {TrainingMatch} from '../../src/combat.js';
import {parseProgram,parseSections} from '../../src/runtime.js';

const encode=s=>new TextEncoder().encode(s);
const frame={group:0,number:0,ticks:-1,clsn1:[],clsn2:[[-10,-20,10,0]]};
function character(script){return {path:'legacy.def',def:{info:{name:'Legacy fixture'},files:{cns:'legacy.cns'}}, files:{'legacy.cns':encode('[Statedef 0]\ntype=S\nphysics=N\nanim=0\nctrl=0\n'+script)},animations:[{id:0,frames:[frame]}]};}
function match(script){return new TrainingMatch(character(script),{orderedPhases:true,initialize:false,pushboxes:false});}

test('dense legacy HitBy masks decode to exactly the explicit comma-token mask',()=>{
  const packed=hitAttribute('SCA,NASAHANPSPHPNTSTHT');
  const expanded=hitAttribute('SCA,NA,SA,HA,NP,SP,HP,NT,ST,HT');
  assert.deepEqual([...packed.attacks],[...expanded.attacks]);
  assert.deepEqual([...packed.states],[...expanded.states]);
  assert.equal(attributeMatches('SCA,NASAHANPSPHPNTSTHT','A,HP'),true);
  assert.equal(attributeMatches('SCA,NASAHANPSPHPNTSTHT','S,NP'),true);
  assert.throws(()=>hitAttribute('SCA,NASAHANPSPHPNTSTHTQ'),/Invalid hit attack/);
  assert.throws(()=>hitAttribute('SCA,NASX'),/Invalid hit attack/);
});

test('legacy NotHitBy packed mask is applied through actual state-controller interpreter',()=>{
  const m=match('[State filter]\ntype=NotHitBy\ntrigger1=1\nvalue=SCA,NASAHANPSPHPNTSTHT\ntime=3\n');
  m.tick();
  assert.equal(m.player.hitFilters[0].exclude,true);
  assert.equal(m.player.hitFilters[0].attribute.attacks.size,9);
  assert.ok(!m.player.diagnostics.some(d=>d.type==='controller'&&/Invalid hit attack/.test(d.message)));
});

test('safe oversized positive persistent remains executable but explicitly nonportable',()=>{
  const s='[State large]\ntype=VarAdd\ntrigger1=1\nv=1\nvalue=7\npersistent=999999999999\n';
  const c=character(s),program=parseProgram(c);
  assert.equal(program.diagnostics.filter(d=>d.type==='controller-parameter').length,0);
  assert.equal(program.diagnostics.filter(d=>d.type==='nonportable-persistent').length,1);
  const m=match(s);
  for(let i=0;i<8;i++)m.tick();
  assert.equal(m.player.vars[1],7);
  assert.equal(m.opponent.vars[1],7);
});

test('guard pause typo is an explicit nonportable compatibility alias',()=>{
  const m=match('');
  const source=parseSections('[State 20]\ntype=HitDef\ntrigger1=1\nattr=S,SA\npausetime=30,30\ngurad.pausetime=12,12\n')[0];
  m.player.execute({...source,type:'hitdef'});
  assert.deepEqual(m.player.hitDef.guardPauseTime,[12,12]);
  assert.ok(m.player.diagnostics.some(d=>d.type==='nonportable-hitdef-typo'));
  assert.ok(!m.player.diagnostics.some(d=>d.type==='unsupported-hitdef-parameter'&&/gurad/.test(d.message)));
  const valid=parseSections('[State 20]\ntype=HitDef\ntrigger1=1\nattr=S,SA\ngurad.pausetime=12,12\nguard.pausetime=5,6\n')[0];
  m.player.execute({...valid,type:'hitdef'});
  assert.deepEqual(m.player.hitDef.guardPauseTime,[5,6]);
});

test('nonstandard StateDef ownpal and missing required HitDef attr remain diagnosed',()=>{
  const c=character('[Statedef 20]\ntype=A\nanim=0\nownpal=1\n[State noattr]\ntype=HitDef\ntrigger1=1\nreversal.attr=SCA,AA,AP,AT\n');
  const diags=parseProgram(c).diagnostics;
  assert.ok(diags.some(d=>d.type==='unsupported-state-parameter'&&/ownpal/.test(d.message)));
  assert.ok(diags.some(d=>d.type==='controller-parameter'&&/hitdef requires attr/.test(d.message)));
});

test('parenthesized ProjHit alias respects one-tick contact history and projectile IDs',()=>{
  const m=match(''),a=m.player;
  assert.equal(a.evaluate('projhit(1200)=0'),1);
  assert.equal(a.evaluate('projhit(1200)=1'),0);
  a.projectileHistory.push({type:'hit',projId:1200,tick:m.ticks});
  assert.equal(a.evaluate('projhit(1200)'),1);
  assert.equal(a.evaluate('projhit(1600)'),0);
  assert.equal(a.evaluate('projcontact(1200)'),1);
  assert.equal(a.evaluate('projguarded(1200)'),0);
  m.ticks++;
  assert.equal(a.evaluate('projhit(1200)'),1);
  m.ticks++;
  assert.equal(a.evaluate('projhit(1200)'),0);
});
