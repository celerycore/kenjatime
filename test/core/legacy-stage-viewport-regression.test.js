import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseStage,StageRuntime} from '../../src/stages.js';

const encode=text=>new TextEncoder().encode(text);
const create=text=>{
 const files={'stages/forest.def':encode(text),'stages/forest.sff':new Uint8Array([0])};
 return new StageRuntime(parseStage('stages/forest.def',files));
};
const forest=`[Info]
name = Forest of King Cruel
[StageInfo]
HIres=1
zoffset=220
[Camera]
boundleft=-140
boundright=140
boundhigh=-170
boundlow=0
verticalfollow=.95
tension=40
floortension=62
[PlayerInfo]
p1startx=-80
p2startx=80
[BGDef]
spr=forest.sff
[BG 01]
type=normal
spriteno=0,0
start=-600,-404
delta=2,2
`;

test('legacy Forest of King Cruel preserves 240-unit height in widescreen and expands x',()=>{
 const stage=create(forest);stage.viewportAspect=16/9;
 const view=stage.view();
 assert.equal(stage.definition.localcoord[0],320);
 assert.equal(stage.definition.backgroundScale,0.5);
 assert.equal(view.displayHeight,240);
 assert.ok(Math.abs(view.displayWidth-426.6666666666667)<0.001);
 assert.ok(Math.abs(view.width-426.6666666666667)<0.001);
 assert.equal(view.groundY,220);
 assert.equal(view.cropTop,0);
 assert.deepEqual(stage.definition.starts.map(p=>p.x),[-80,80]);
});
test('widescreen stage camera follows jumps but does not alter authored physics',()=>{
 const stage=create(forest);stage.viewportAspect=16/9;
 const fighters=[{pos:{x:-80,y:-80}},{pos:{x:80,y:0}}];
 stage.updateCamera(fighters);
 assert.equal(stage.camera.zoom,1);
 assert.ok(stage.camera.y<0);
 assert.ok(stage.camera.y>=stage.definition.camera.high);
 assert.ok(stage.view().left< -160);
});
test('explicit MUGEN stage crop guidelines retain cropped 320x180 layout',()=>{
 const stage=create(forest.replace('tension=40','tension=40\ncuthigh=30\ncutlow=30'));
 stage.viewportAspect=16/9;
 const view=stage.view();
 assert.ok(Math.abs(view.displayHeight-180)<0.001);
 assert.equal(view.displayWidth,320);
 assert.equal(view.cropTop,30);
});
test('native 16:9 authored localcoord does not expand beyond 320 units',()=>{
 const stage=create(forest.replace('HIres=1','localcoord=1280,720'));
 stage.viewportAspect=16/9;
 assert.equal(stage.view().displayHeight,180);
 assert.equal(stage.view().displayWidth,320);
});
