import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {unzipSync} from 'fflate';
import {parseProgram} from '../../src/runtime.js';
import {CoreSession} from '../../src/core/session.js';

const encode=text=>new TextEncoder().encode(text);
const decode=bytes=>new TextDecoder().decode(bytes);
const globalA=`[StateDef -4]
var(50):=var(50)+1;
[StateDef +1]
var(51):=var(51)+1;
[StateDef 0;type:S;physics:N;ctrl:0;]
var(52):=var(50)*100+var(51);
[StateDef 1;type:S;physics:N;ctrl:0;]
var(53):=777;
`;
const globalB=`[StateDef -4]
var(50):=var(50)+10;
[StateDef +1]
var(51):=var(51)+10;
`;
function create() {
  const files=unzipSync(readFileSync(new URL('../../public/kfm.zip',import.meta.url)));
  files['kfm/victim.def']=files['kfm/kfm.def'];
  files['kfm/kfm.def']=encode(decode(files['kfm/kfm.def']).replace('[Files]','[Files]\nst88=global-a.zss\nst89=global-b.zss\n'));
  files['kfm/global-a.zss']=encode(globalA);
  files['kfm/global-b.zss']=encode(globalB);
  return new CoreSession(files,{mode:'training',character:'kfm/kfm.def',opponent:'kfm/victim.def'});
}
test('IKEMEN globals -4 and +1 append in source order, while StateDef 1 stays distinct',()=>{
  const s=create();
  try{
    const p=s.match.player.program;
    assert.equal(p.states.get(-4)?.globalParts?.length,2);
    assert.equal(p.states.get('global+1')?.globalParts?.length,2);
    assert.ok(p.states.has(1));
    assert.equal(p.states.get(1).id,1);
    assert.ok(p.states.has(0));
    assert.equal(p.diagnostics.some(issue=>issue.fatal),false);
    s.tick();
    const a=s.match.player;
    assert.equal(a.vars[50],11,'both -4 parts execute first');
    assert.equal(a.vars[51],11,'both +1 parts execute after state');
    assert.equal(a.vars[52],1100,'normal state observes -4 before +1');
    a.changeState(1);
    s.tick();
    assert.equal(a.vars[53],777,'numeric state 1 remains accessible');
  }finally{s.close();}
});
test('IKEMEN -4/+1 execute under world pause, before and after main state only',()=>{
  const s=create();
  try{
    const a=s.match.player;
    s.tick();
    const before=[a.vars[50],a.vars[51],a.vars[52]];
    a.tick({paused:true,opponent:s.match.opponent});
    assert.equal(a.vars[50],before[0]+11);
    assert.equal(a.vars[51],before[1]+11);
    assert.equal(a.vars[52],before[2]);
  }finally{s.close();}
});
test('IKEMEN global state execution includes keyctrl=0 helpers',()=>{
  const s=create();
  try{
    const helper=s.match.spawnHelper(s.match.player,{id:801,stateno:0,keyctrl:0});
    assert.ok(helper&&!helper.destroyed);
    const before=[helper.vars[50],helper.vars[51]];
    s.tick();
    assert.equal(helper.vars[50],before[0]+11);
    assert.equal(helper.vars[51],before[1]+11);
  }finally{s.close();}
});
test('CNS extended +1 parses separately from ordinary numeric StateDef 1',()=>{
  const source=`[Statedef +1]\n[State post]\ntype=VarAdd\ntrigger1=1\nv=51\nvalue=1\n[Statedef 1]\n[State normal]\ntype=VarAdd\ntrigger1=1\nv=53\nvalue=1\n`;
  const p=parseProgram({path:'cns.def',def:{files:{st:'global.cns'}},files:{'global.cns':encode(source)}});
  assert.equal(p.states.get('global+1')?.controllers?.length,1);
  assert.equal(p.states.get(1)?.controllers?.length,1);
});
