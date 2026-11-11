import {test} from 'node:test';
import assert from 'node:assert/strict';
import {FighterRuntime,parseProgram,parseSections} from '../../src/runtime.js';
import {hitAttribute,attributeMatches} from '../../src/hit-filters.js';

const bytes=text=>new TextEncoder().encode(text);
const cns=`[Statedef 0]
type=S
movetype=I
physics=N
anim=0
[Statedef 2050]
type=A
physics=N
movetype=A
anim=0
ownpal=1
[State 0, persistent]
type=defencemulset
trigger1=1
value=1.6
persistent=999999999999
`;
function actor(){
 return new FighterRuntime({
   path:'donald.def',def:{files:{cns:'donald.cns'}},
   files:{'donald.cns':bytes(cns)},
   animations:[{id:0,frames:[{group:0,number:0,ticks:-1}]}]
 });
}
test('Dark Donald concatenated legacy HitBy mask parses exact complete tokens',()=>{
 const mask=hitAttribute('SCA,NASAHANPSPHPNTSTHT');
 assert.deepEqual([...mask.attacks].sort(),['HA','HP','HT','NA','NP','NT','SA','SP','ST']);
 assert.deepEqual([...mask.states].sort(),['A','C','S']);
 assert.equal(attributeMatches('SCA,NASAHANPSPHPNTSTHT','S,SA'),true);
 assert.throws(()=>hitAttribute('SCA,NASAHANPSPHPNTSTHTX'),/Invalid hit attack/);
});
test('large literal persistent is usable while dynamic persistent remains invalid',()=>{
 const f=actor();
 assert.ok(!f.program.diagnostics.some(d=>d.type==='controller-parameter'&&/persistent/.test(d.message)));
 f.changeState(2050);f.tick();
 const broken=parseProgram({path:'bad.def',def:{files:{cns:'bad.cns'}},files:{'bad.cns':bytes(cns.replace('999999999999','var(3)'))}});
 assert.ok(broken.diagnostics.some(d=>d.type==='controller-parameter'&&/persistent/.test(d.message)));
});
test('StateDef ownpal gives helpers independent remap snapshot',()=>{
 const root=actor();
 assert.equal(root.program.diagnostics.filter(d=>d.type==='unsupported-state-parameter').length,0);
 const helper=root.createHelper({stateno:0,id:9});
 assert.ok(helper&&!helper.destroyed);
 assert.equal(helper.ownPal,false);
 helper.changeState(2050);
 assert.equal(helper.ownPal,true);
 assert.notEqual(helper.paletteRemaps,root.paletteRemaps);
});
test('authored gurad.pausetime typo is ignored instead of silently altering hitpause',()=>{
 const f=actor();
 const section=parseSections('[State 1]\ntype=HitDef\ntrigger1=1\nattr=S,SA\npausetime=20,20\ngurad.pausetime=12,12')[0];
 const hit=f.parseHitDef({...section,type:'hitdef',values:{...section.values}});
 assert.deepEqual(hit.guardPauseTime,[20,20]);
 assert.ok(f.diagnostics.some(d=>d.type==='ignored-author-typo'));
 assert.ok(!f.diagnostics.some(d=>d.type==='unsupported-hitdef-parameter'));
});
test('legacy parenthesized ProjHit(id) checks recent actual projectile history',()=>{
 const f=actor();f.gameTime=100;
 assert.equal(f.evaluate('projhit(1200)=0'),1);
 f.projectileHistory.push({type:'hit',projId:1200,tick:100});
 assert.equal(f.evaluate('projhit(1200)=1'),1);
 assert.equal(f.evaluate('projhit(7)=0'),1);
 f.gameTime=104;
 assert.equal(f.evaluate('projhit(1200)=1'),0);
});
