import {test} from 'node:test';
import assert from 'node:assert/strict';
import {inventoryFiles} from '../scripts/character-inventory.mjs';
const bytes=s=>new TextEncoder().encode(s);
function files(script){return{'fighter.def':bytes('[Info]\nname=Inventory fixture\n[Files]\ncmd=f.cmd\ncns=f.cns\nst=f.cns\nsprite=f.sff\nanim=f.air'),'f.cmd':bytes('[Command]\nname="hit"\ncommand=x\n[Command]\nname="hit"\ncommand=y\n[Statedef -1]\n[State -1, hit]\ntype=ChangeState\ntrigger1=command="hit"\nvalue=200'),'f.cns':bytes(script),'f.sff':new Uint8Array(0),'f.air':bytes('[Begin Action 0]\n0,0,0,0,-1')};}
test('character inventory retains duplicate bindings and literal command-entry provenance',()=>{
 const [result]=inventoryFiles(files('[Statedef 0]\n[Statedef 200]'));
 assert.equal(result.commandBindings,2);assert.equal(result.moveEntries,1);assert.equal(result.moves[0].target,200);assert.deepEqual(result.moves[0].commands,['hit']);assert.ok(result.moves[0].line>0);assert.equal(result.scripts.length,2);
});
test('helper/projectile/palette inventory is source coverage and never runtime certification',()=>{
 const [result]=inventoryFiles(files('[Statedef -2]\n[State helper]\ntype=Helper\n[State shot]\ntype=Projectile\n[State palette]\ntype=RemapPal'));
 assert.equal(result.helperControllers,1);assert.equal(result.projectileControllers,1);assert.equal(result.paletteControllers,1);assert.equal(result.requiresGlobalStateAdapter,true);assert.equal(result.completeCompatibility,false);assert.match(result.nativeMovesetVerification,/pending/);
});
test('expression-valued state entry targets remain explicit coverage gaps',()=>{
 const data=files('[Statedef 0]');data['f.cmd']=bytes('[Statedef -1]\n[State dynamic]\ntype=ChangeState\nvalue=200+var(1)\ntrigger1=1');
 const [result]=inventoryFiles(data);assert.equal(result.moves[0].target,null);assert.equal(result.moves[0].expression,'200+var(1)');
});
