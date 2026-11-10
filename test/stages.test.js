import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {packageFiles,charactersFromFiles,sff} from '../src/formats.js';
import {parseStage,stageDefinitions,StageRuntime} from '../src/stages.js';
import {TrainingMatch} from '../src/combat.js';

const encode=s=>new TextEncoder().encode(s);
function definition(extra='',overrides=''){
  const text=`[Info]\nname=Test stage\n[Camera]\nboundleft=-100\nboundright=100\nboundhigh=-50\nverticalfollow=.5\ntension=50\n${overrides}\n[PlayerInfo]\nleftbound=-1000\nrightbound=1000\np1startx=-80\np2startx=80\n[StageInfo]\nlocalcoord=320,240\nzoffset=200\n[BGDef]\nspr=stage.sff\n${extra}`;
  const files={'stages/test.def':encode(text),'stages/stage.sff':new Uint8Array()};return parseStage('stages/test.def',files);
}
function fighter(){return{path:'c.def',def:{info:{name:'Fighter'},files:{cns:'c.cns'}},files:{'c.cns':encode('[Statedef 0]\ntype=S\nphysics=N\nctrl=1\nanim=0')},animations:[{id:0,frames:[{group:0,number:0,x:0,y:0,ticks:-1,clsn1:[],clsn2:[]}]}]};}

test('Native engine package discovers stage assets independently from character definitions',{skip:!process.env.MUGEN_TEST_ARCHIVE||!existsSync(process.env.MUGEN_TEST_ARCHIVE)},()=>{
  const files=packageFiles(new Uint8Array(readFileSync(process.env.MUGEN_TEST_ARCHIVE)));
  const stages=stageDefinitions(files);assert.ok(stages.length>=3);assert.equal(charactersFromFiles(files).length,2);
  for(const stage of stages){
    assert.equal(stage.invalid,undefined);assert.ok(stage.sprite,stage.path);assert.ok(stage.elements.length>0);
    const sprites=sff(files[stage.sprite.path]);
    for(const e of stage.elements.filter(e=>e.type==='normal'||e.type==='parallax')){const index=sprites.sprites.findIndex(s=>s.group===e.spriteno[0]&&s.number===e.spriteno[1]);assert.ok(index>=0);assert.ok(sprites.decode(index).rgba.length);}
  }
});

test('Stage-only packages, nested paths and missing assets produce useful metadata and diagnostics',()=>{
  const text='[Info]\nname=Only stage\n[BGDef]\nspr=..\\Sprites\\ARENA.SFF\n[BG 0]\nspriteno=0,0';
  const files={'nested/stages/a.def':encode(text),'nested/sprites/arena.sff':new Uint8Array()};
  assert.equal(charactersFromFiles(files).length,0);assert.equal(stageDefinitions(files)[0].sprite.path,'nested/sprites/arena.sff');
  delete files['nested/sprites/arena.sff'];assert.match(stageDefinitions(files)[0].diagnostics[0].message,/missing/);
});

test('Camera follows eligible players within native bounds, and preserves the viewport when helpers opt out',()=>{
  const stage=new StageRuntime(definition()),players=[{pos:{x:190,y:-100},moveCamera:{x:true,y:true}},{pos:{x:210,y:0},moveCamera:{x:true,y:true}},{pos:{x:-900,y:-900},moveCamera:{x:false,y:false}}];
  stage.updateCamera(players);assert.equal(stage.camera.x,100);assert.equal(stage.camera.y,-50);
  assert.equal(stage.view().left,-60);assert.equal(stage.view().right,260);
  assert.equal(stage.view().groundY,200);assert.equal(stage.view().displayHeight,240);
});

test('Local coordinates normalize stage starts, floor and camera; zoom remains within configured limits',()=>{
  const stage=definition('','zoomout=.5\nzoomin=1');stage.localcoord=[1280,720];stage.coordinateScale=.25;
  const camera=new StageRuntime(stage);camera.updateCamera([{pos:{x:-250,y:0}},{pos:{x:250,y:0}}]);
  assert.ok(camera.camera.zoom>=.5&&camera.camera.zoom<1);assert.ok(camera.view().width>320);
  const text='[Camera]\nboundleft=-400\nboundright=400\n[StageInfo]\nlocalcoord=1280,720\nzoffset=660\n[PlayerInfo]\np1startx=-280\np2startx=280\n[BGDef]\nspr=x.sff';
  const def=parseStage('x.def',{'x.def':encode(text),'x.sff':new Uint8Array()});assert.equal(def.starts[0].x,-70);assert.equal(def.zoffset,165);assert.equal(def.camera.right,100);
});

test('Background controllers preserve order, ID filtering, inclusive times, loop reset and enable/visible distinction',()=>{
  const stage=new StageRuntime(definition(`
[BG Moving]
id=7
start=5,0
spriteno=0,0
[BG Other]
id=8
start=0,0
spriteno=0,0
[BGCtrlDef Group]
ctrlid=7
looptime=4
[BGCtrl Start]
type=Enable
time=0
value=1
[BGCtrl Velocity]
type=VelSet
time=0
x=2
[BGCtrl Position]
type=PosSet
time=1
x=10
[BGCtrl Hide]
type=Visible
time=2
value=0
[BGCtrl Stop]
type=Enable
time=3
value=0`));
  stage.tick();assert.equal(stage.position(0).x,7);assert.equal(stage.position(1).x,0);
  stage.tick();assert.equal(stage.position(0).x,12);
  stage.tick();assert.equal(stage.elements[0].visible,false);assert.equal(stage.position(0).x,14);
  stage.tick();assert.equal(stage.position(0).x,14);stage.tick();assert.equal(stage.position(0).x,16);
});

test('Stage motion, animation, position links and background freeze use simulation ticks',()=>{
  const stage=new StageRuntime(definition(`
[BG Parent]
id=9
start=10,20
velocity=2,0
delta=.5,.5
spriteno=0,0
[BG Child]
positionlink=1
start=5,5
delta=9,9
type=anim
actionno=12
[Begin Action 12]
0,0,0,0,2
0,1,0,0,2`));
  stage.tick();assert.deepEqual(stage.position(1),{x:17,y:25,delta:[.5,.5]});
  stage.tick({paused:true});assert.equal(stage.time,1);assert.equal(stage.elements[1].frameIndex,0);
  stage.tick();assert.equal(stage.elements[1].frameIndex,1);
  stage.reset({backgrounds:false});assert.equal(stage.time,2);assert.equal(stage.position(0).x,14);
  stage.reset();assert.equal(stage.time,0);assert.equal(stage.position(0).x,10);
});

test('World stage spawns, camera triggers, body bounds and projectile screen removal use one coordinate system',()=>{
  const world=new TrainingMatch(fighter(),{stage:definition(),pushboxes:false});assert.equal(world.player.pos.x,-80);assert.equal(world.opponent.pos.x,80);
  world.player.pos.x=220;world.opponent.pos.x=240;world.tick();
  assert.equal(world.player.evaluate('CameraPos X'),100);assert.equal(world.player.evaluate('RightEdge'),260);
  assert.equal(world.player.evaluate('FrontEdgeDist'),40);assert.equal(world.player.evaluate('ScreenPos X'),280);
  assert.equal(world.player.evaluate('StageVar(info.name)'),'Test stage');
  world.player.pos.x=900;world.tick();assert.ok(world.player.pos.x<=world.view.right-world.player.constant(`size.ground.${world.player.facing>0?'front':'back'}`));
  const p=world.spawnProjectile(world.player,{projanim:0,offset:[400,0],hitDef:null});world.tick();assert.equal(p.removed,true);
});

test('Screen dimensions stay fixed while zoom expands game space in character coordinates',()=>{
  const character=fighter();character.def.info.localcoord='1280,720';
  const world=new TrainingMatch(character,{stage:definition('','zoomout=.5\nzoomin=.5'),pushboxes:false});
  assert.equal(world.player.evaluate('CameraZoom'),.5);assert.equal(world.player.evaluate('ScreenWidth'),1280);
  assert.equal(world.player.evaluate('GameWidth'),2560);assert.equal(world.player.evaluate('ScreenHeight'),960);
  assert.equal(world.player.evaluate('GameHeight'),1920);
});

test('Animated parallax uses AIR frames and masking while additive backgrounds respect native defaults',()=>{
  const stage=new StageRuntime(definition(`[BG Light]
trans=add
spriteno=0,0
[BG Floor]
type=parallax
actionno=3
width=100,200
mask=0
[Begin Action 3]
0,0,0,0,1
0,1,0,0,1`));
  assert.equal(stage.elements[0].mask,true);assert.deepEqual(stage.elements[0].alpha,[256,256]);
  assert.equal(stage.elements[1].mask,true);stage.tick();assert.equal(stage.frame(stage.elements[1]).number,0);
  stage.tick();assert.equal(stage.frame(stage.elements[1]).number,1);
});

test('Background resetbg controls motion persistence between scored rounds',()=>{
  for(const resetBG of [false,true]){
    const stage=definition('[BG Moving]\nvelocity=1,0\nspriteno=0,0');stage.resetBG=resetBG;
    const world=new TrainingMatch(fighter(),{stage,rules:{preIntro:0,introHold:0,overTime:0,resultTime:0},initialize:false});
    world.tick();world.tick();world.opponent.life=0;world.tick();world.tick();const elapsed=world.stage.time;world.tick();
    assert.equal(world.roundFlow.roundNo,2);assert.equal(world.stage.time,resetBG?0:elapsed+1);
    assert.equal(world.stage.position(0).x,resetBG?0:elapsed+1);
  }
});

test('Pause pausebg=0 permits backgrounds to move while the players stay frozen',()=>{
  const world=new TrainingMatch(fighter(),{stage:definition('[BG Moving]\nvelocity=1,0\nspriteno=0,0')});
  world.requestPause(world.player,{type:'pause',time:3,pausebg:0});world.tick();const t=world.player.time,bg=world.stage.time;
  world.tick();assert.equal(world.player.time,t);assert.equal(world.stage.time,bg+1);
});

test('Invalid stage definitions and unsupported elements fail visibly instead of generating NaN positions',()=>{
  assert.throws(()=>definition('','zoomin=0\nzoomout=1'),/bounds/);
  assert.throws(()=>definition('[BG Invalid]\nstart=oops,0'),/Invalid/);
  const unsupported=definition('[BG Bad]\ntype=mystery');assert.equal(unsupported.elements.length,0);assert.ok(unsupported.diagnostics.some(d=>d.type==='unsupported-stage'));
});

test('Built-in grid camera tracks airborne fighters and ignores excluded helpers',()=>{
  const world=new TrainingMatch(fighter(),{initialize:false,cameraFollow:true});
  assert.equal(world.stage,null);
  assert.equal(world.cameraRuntime.camera.y,0);
  world.player.pos.y=-200;
  world.tick();
  assert.ok(world.cameraRuntime.camera.y<0,'camera did not pan upward with jumping player');
  assert.ok(world.view.top<-200);
  assert.equal(world.player.cameraPos,world.cameraRuntime.camera);
  assert.ok(Math.abs(world.player.evaluate('CameraPos Y')-world.cameraRuntime.camera.y)<1e-4,'camera trigger must track the same position within f32 precision');
  const above=world.cameraRuntime.camera.y;
  world.player.pos.y=0;
  for(let i=0;i<20;i++)world.tick();
  assert.ok(world.cameraRuntime.camera.y>above,'camera did not ease back toward the ground');
  const helper=world.spawnHelper(world.player,{stateno:0,id:800});
  helper.pos.y=-500;
  const before=world.cameraRuntime.camera.y;
  world.tick();
  assert.ok(world.cameraRuntime.camera.y>=before,'non-following helper must not pull camera upward');
});
