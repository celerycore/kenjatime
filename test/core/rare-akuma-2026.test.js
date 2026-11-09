import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {packageFiles} from '../../src/formats.js';
import {CoreSession} from '../../src/core/session.js';
import {FighterRuntime,parseProgram,parseSections} from '../../src/runtime.js';
import {parseZss} from '../../src/zss.js';
const encode=s=>new TextEncoder().encode(s);
function fighter(){
  return new FighterRuntime({path:'fixture.def',def:{info:{name:'Fixture'},files:{cns:'fixture.cns'}},
    files:{'fixture.cns':encode('[Statedef 0]\ntype=S\nphysics=N')},
    animations:[{id:0,frames:[{group:0,number:0,x:0,y:0,ticks:-1}]}]});
}
function execute(a,type,values=''){
 const section=parseSections('[State Probe]\ntype='+type+'\ntrigger1=1\n'+values)[0];
 return a.execute({...section,type:type.toLowerCase()});
}
test('ZSS permits deliberately empty HitOverride attr parameters',()=>{
 const z='[StateDef 10;type:S;physics:N;ctrl:0;]\nHitOverride {attr: ; slot:0; time:1;}';
 assert.equal(parseZss(z).states.length,1);
 const p=parseProgram({path:'fixture.def',def:{files:{st:'states.zss'}},files:{'states.zss':encode(z)}});
 assert.ok(p.states.has(10));assert.equal(p.diagnostics.filter(x=>x.fatal).length,0);
});
test('ZSS global state -4 is scheduled while the match is paused',()=>{
 const files=packageFiles(readFileSync(new URL('../../public/kfm.zip',import.meta.url)));
 files['kfm/kfm.def']=encode(new TextDecoder().decode(files['kfm/kfm.def']).replace('[Files]','[Files]\nst88=global4.zss\n'));
 files['kfm/global4.zss']=encode('[StateDef -4;type:U;]\nvar(18):=var(18)+1;\n[StateDef 0;type:S;physics:N;ctrl:0;]');
 const session=new CoreSession(files,{character:'kfm/kfm.def',opponent:'kfm/kfm.def',mode:'training'});
 try{const a=session.match.player;session.tick();assert.equal(a.vars[18],1);
 session.match.pause={type:'pause',owner:a,remaining:5,movetime:0,moved:new Map(),pausebg:1};
 session.tick();assert.equal(a.vars[18],2);}finally{session.close();}
});
test('RootMapSet and RootMapAdd modify root maps; ModifyPlayer changes pause windows',()=>{
 const root=fighter(),helper=root.createHelper({stateno:0,id:7},{id:3});
 execute(helper,'RootMapSet','map="counter"\nvalue=3.25');
 execute(helper,'RootMapAdd','map="counter"\nvalue=1.5');
 assert.equal(root.evaluate('map(counter)'),4.75);
 assert.equal(helper.evaluate('map(counter)'),0);
 execute(helper,'ModifyPlayer','pausemovetime=7\nsupermovetime=11');
 assert.equal(helper.pauseMoveTime,7);assert.equal(helper.superMoveTime,11);
});
test('VarSet sysv and sysfv destinations are evaluated correctly',()=>{
 const a=fighter();execute(a,'VarSet','sysv=1\nvalue=9');execute(a,'VarSet','sysfv=2\nvalue=1.25');
 assert.equal(a.sysvars[1],9);assert.equal(a.sysfvars[2],1.25);
});
test('InputTime accepts case-folded F/B symbols and counts release ticks',()=>{
 const a=fighter();a.tick({input:new Set(['R','a'])});assert.equal(a.evaluate('inputtime(F)'),1);
 a.tick({input:new Set(['R'])});assert.equal(a.evaluate('inputtime(f)'),2);assert.equal(a.evaluate('inputtime(a)'),-1);
 a.facing=-1;assert.equal(a.evaluate('inputtime(B)'),2);
});
test('ReversalDefAttr and IKEMEN FIfElse execute without unsupported-trigger errors',()=>{
 const a=fighter();execute(a,'ReversalDef','reversal.attr=S,NA\npausetime=0,0');
 assert.equal(a.evaluate('reversaldefattr = S, NA'),1);
 assert.equal(a.evaluate('fifelse(1,40,2)'),40);
 assert.equal(a.evaluate('fifelse(0,40,2.5)'),2.5);
});
test('RedirectId evaluates p2, ID as an expression, not two scalar parameters',()=>{
 const a=fighter(),b=fighter();a.opponent=b;b.teamSide=2;b.id=27;
 const c=parseSections('[State Probe]\ntype=PalFX\ntrigger1=1\nredirectid=p2, ID\ntime=3')[0];
 assert.equal(a.effectParameters(c).redirectid,27);
});

test('IKEMEN GO builtin tag state constants resolve without inventing tag-team gameplay',()=>{
 const a=fighter('[Statedef 0]\ntype=S\nphysics=N\n');
 assert.equal(a.evaluate('const(StateTagEnteringScreen)'),6565600);
 assert.equal(a.evaluate('const(StateTagLeavingScreen)'),6565610);
 assert.equal(a.evaluate('const(StateTagWaitingOutside)'),6565611);
 assert.equal(a.evaluate('const(StateTagJumpingIn)'),6565620);
 assert.equal(a.evaluate('const(StateTagLanding)'),6565621);
});

test('Shared ground fall-recovery states 5200 and 5201 enter safely and return to landing',()=>{
 const bytes=packageFiles(readFileSync(new URL('../../public/kfm.zip',import.meta.url)));
 const session=new CoreSession(bytes,{character:'kfm/kfm.def',opponent:'kfm/kfm.def',mode:'training'});
 try{
  const player=session.match.player;
  assert.ok(player.program.states.has(5200));
  assert.ok(player.program.states.has(5201));
  player.pos.y=11;player.vel.y=2;
  player.changeState(5200);
  for(let tick=0;tick<3;tick++)session.tick();
  assert.ok([5201,52,0].includes(player.stateNo),`unexpected ground recovery state: ${player.stateNo}`);
  for(let tick=0;tick<30;tick++){
   session.tick();
   assert.ok([player.pos.x,player.pos.y,player.vel.x,player.vel.y,player.life].every(Number.isFinite));
  }
  assert.ok([0,52,5201].includes(player.stateNo));
 }finally{session.close();}
});
