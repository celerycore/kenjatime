import {test} from 'node:test';
import assert from 'node:assert/strict';
import {FighterRuntime,parseSections} from '../src/runtime.js';
import {TrainingMatch} from '../src/combat.js';
import {EffectsState,transformRgba} from '../src/effects.js';
import {parseStage} from '../src/stages.js';

const encode=s=>new TextEncoder().encode(s),frame=(number,ticks)=>({group:10,number,x:0,y:0,ticks,flip:'',clsn1:[],clsn2:[]});
function character(script='',info={}){return{path:'c.def',def:{info:{name:'Fighter',...info},files:{cns:'c.cns'}},files:{'c.cns':encode('[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nctrl=0\nanim=0\n'+script)},animations:[{id:0,frames:[frame(0,-1)]},{id:10,frames:[frame(0,1),frame(1,1)]},{id:11,frames:[frame(0,-1)]}]};}
function control(f,type,params=''){const controller={...parseSections('[State FX]\ntype='+type+'\n'+params)[0],type:type.toLowerCase()};f.execute(controller);return controller;}
function world(script='',options={}){return new TrainingMatch(character(script),{initialize:false,pushboxes:false,opponentCharacter:character(),...options});}
function run(w,n){for(let i=0;i<n;i++)w.tick();}

test('Legacy Explods bind after both players finish movement, using the creator coordinate scale',()=>{
  const w=world('',{opponentCharacter:character('[State Move]\ntype=VelSet\ntrigger1=1\nx=3')});
  control(w.player,'Explod','anim=11\npostype=p2\npos=10,-20\nbindtime=-1');w.tick();
  assert.deepEqual(w.player.drawExplods[0].pos,{x:57,y:-20});assert.equal(w.player.drawExplods[0].facing,-1);
  const c=character('[State Move]\ntype=VelSet\ntrigger1=1\nx=4',{localcoord:'1280,720'});
  const actor=new FighterRuntime(c,{position:{x:10,y:0}});control(actor,'Explod','anim=11\npos=20,0');actor.tick();assert.equal(actor.drawExplods[0].pos.x,16);
});

test('A bindID can resolve a helper created later during the same world tick',()=>{
  const other=character('[State Spawn]\ntype=Helper\ntrigger1=time=0\nstateno=500\n[Statedef 500]\nphysics=N\nvelset=2,0');
  const w=world('',{opponentCharacter:other});control(w.player,'Explod','anim=11\nspace=stage\nbindID=3\nbindtime=-1\npos=8,-4');w.tick();
  const target=w.findPlayer(3);assert.ok(target);assert.equal(w.player.explods[0].bindingTarget,target);assert.equal(w.player.drawExplods[0].pos.x,target.pos.x+8*target.facing);assert.equal(w.diagnostics.length,0);
});

test('1.1 stage-space defaults use absolute positions; legacy characters default to p1',()=>{
  for(const [version,expected]of [['1.1',40],['1.0',-30],['2002.04.14',-30]]){
    const f=new FighterRuntime(character('',{mugenversion:version}),{position:{x:-70,y:0}});control(f,'Explod','anim=11\npos=40,-5');f.tick();assert.equal(f.drawExplods[0].pos.x,expected);
  }
  const f=new FighterRuntime(character(),{position:{x:50,y:0}});f.cameraPos={x:100};assert.equal(f.evaluate('Pos X'),-50);assert.equal(f.evaluate('Pos X + CameraPos X'),50);
  control(f,'Explod','anim=11\nspace=stage\npos=Pos X+CameraPos X,-5');f.tick();assert.equal(f.drawExplods[0].pos.x,50);
  control(f,'PosSet','x=0');assert.equal(f.pos.x,100);
});

test('Legacy screen postypes preserve their native facing and signed offsets',()=>{
  for(const facing of [1,-1])for(const postype of ['front','back','left','right']){
    const f=new FighterRuntime(character(),{facing});control(f,'Explod',`anim=11\npostype=${postype}\npos=10,20`);f.tick();const e=f.drawExplods[0];
    const right=postype==='right'||postype==='front'&&facing>0||postype==='back'&&facing<0;
    assert.equal(e.space,'screen');assert.deepEqual(e.pos,{x:(right?320:0)+10*(postype==='back'?facing:1),y:20});assert.equal(e.facing,postype==='back'?facing:1);
  }
});

test('Screen effects ignore camera/zoom and reject binding rather than becoming stage effects',()=>{
  const text='[Camera]\nboundleft=-200\nboundright=200\nzoomout=.5\nzoomin=1\n[BGDef]\nspr=s.sff';
  const stage=parseStage('s.def',{'s.def':encode(text),'s.sff':new Uint8Array()}),w=world('',{stage});
  control(w.player,'Explod','anim=11\nspace=screen\npos=50,30');w.tick();w.stage.camera.x=100;w.stage.camera.zoom=.5;w.player.updateExplods();assert.deepEqual(w.player.drawExplods[0].pos,{x:50,y:30});
  assert.throws(()=>control(w.player,'Explod','anim=11\nspace=screen\nbindID=ID\nbindtime=-1'),/cannot be bound/);
  assert.throws(()=>control(w.player,'Explod','anim=11\nbindID=ID'),/requires bindtime/);
});

test('ExplodBindTime restarts binding regardless of effect age and accepts the value alias',()=>{
  const w=world();control(w.player,'Explod','anim=11\nid=7\nbindtime=1\nvel=2,0');run(w,5);const e=w.player.explods[0];assert.equal(e.bindtime,0);assert.ok(e.pos.x>w.player.pos.x);
  control(w.player,'ExplodBindTime','id=7\nvalue=2');w.player.pos.x=-40;w.tick();assert.equal(w.player.drawExplods[0].pos.x,-40);assert.equal(e.bindtime,1);w.tick();assert.equal(e.bindtime,0);
  control(w.player,'ExplodBindTime','id=7\ntime=-1');w.player.facing=-1;w.tick();assert.equal(w.player.drawExplods[0].facing,-1);
});

test('One-tick animation frames and finite removetime display their last frame before removal',()=>{
  const w=world();control(w.player,'Explod','anim=10');w.tick();assert.equal(w.player.drawExplods[0].frameIndex,0);assert.equal(w.player.explods.length,1);
  w.tick();assert.equal(w.player.drawExplods[0].frameIndex,1);assert.equal(w.player.explods.length,0);w.tick();assert.equal(w.player.drawExplods.length,0);
  control(w.player,'Explod','anim=11\nremovetime=1');w.tick();assert.equal(w.player.explods.length,0);assert.equal(w.player.drawExplods.length,1);
  control(w.player,'Explod','anim=11\nremovetime=0');w.tick();assert.equal(w.player.drawExplods.length,0);
  control(w.player,'Explod','anim=10\nremovetime=-1');run(w,5);assert.equal(w.player.explods.length,1);
});

test('Native vel/accel, vertical facing, angle and transparency survive partial ModifyExplod updates',()=>{
  const w=world();control(w.player,'Explod','anim=11\nspace=stage\npos=0,0\nvel=2,3\naccel=1,-1\nvfacing=-1\nangle=30\ntrans=addalpha\nalpha=128,256');
  w.tick();assert.deepEqual(w.player.drawExplods[0].pos,{x:0,y:0});w.tick();assert.deepEqual(w.player.drawExplods[0].pos,{x:2,y:3});
  control(w.player,'ModifyExplod','scale=2,3');w.tick();const e=w.player.drawExplods[0];assert.deepEqual(e.pos,{x:5,y:5});assert.equal(e.vfacing,-1);assert.equal(e.angle,30);assert.deepEqual(e.trans.alpha,[128,256]);assert.deepEqual(e.scale,[2,3]);
  const before={...w.player.explods[0].pos};assert.throws(()=>control(w.player,'ModifyExplod','space=invalid\npos=9,9'),/space/);assert.deepEqual(w.player.explods[0].pos,before);
});

test('Explods update independently of owner hitpause by default, while ignorehitpause=0 freezes them',()=>{
  const w=world();control(w.player,'Explod','anim=11\nid=1');control(w.player,'Explod','anim=11\nid=2\nignorehitpause=0');w.tick();const actorTime=w.player.time;
  w.player.hitPauseTime=2;run(w,2);assert.equal(w.player.time,actorTime);assert.equal(w.player.explods.find(e=>e.id===1).time,3);assert.equal(w.player.explods.find(e=>e.id===2).time,1);
});

test('Explod Pause and SuperPause movement allowances are independent of owner allowances',()=>{
  for(const kind of ['pause','superpause']){
    const w=world();control(w.player,'Explod',`anim=11\nid=1\n${kind==='pause'?'pausemovetime':'supermovetime'}=2`);control(w.player,'Explod','anim=11\nid=2');w.tick();
    w.requestPause(w.player,{type:kind,time:3,movetime:0});w.tick();const start=w.player.explods[0].time,time=w.player.time;
    run(w,3);assert.equal(w.player.time,time);assert.equal(w.player.explods[0].time,start+2);assert.equal(w.player.explods[1].time,start);w.tick();assert.equal(w.player.explods[0].time,start+3);
  }
});

test('Legacy supermove keeps an expired effect visible until SuperPause ends',()=>{
  const w=world();w.requestPause(w.player,{type:'superpause',time:3,movetime:0});w.tick();
  control(w.player,'Explod','anim=11\nspace=stage\nremovetime=1\nsupermove=1');run(w,3);assert.equal(w.player.explods.length,1);w.tick();assert.equal(w.player.explods.length,0);assert.equal(w.player.drawExplods.length,0);
});

test('Destroyed binding targets release effects, while invalid targets are reported',()=>{
  const w=world(),h=w.spawnHelper(w.player,{stateno:0});control(w.player,'Explod',`anim=11\nbindID=${h.id}\nbindtime=-1\npos=4,0`);w.tick();const e=w.player.explods[0],before={...e.pos};
  h.destroyed=true;w.tick();assert.equal(e.bindtime,0);assert.deepEqual(e.pos,before);
  control(w.player,'Explod','anim=11\nbindID=999\nbindtime=1');w.tick();assert.ok(w.player.diagnostics.some(d=>d.type==='missing-player'));
  assert.throws(()=>control(w.player,'Explod','anim=11\nbindtime=-2'),/binding time/);
});

test('Explod and ModifyExplod preserve 3D angles in current draw snapshots without unsupported diagnostics',()=>{
  const w=world();control(w.player,'Explod','anim=11\nid=7\nangle=30\nxangle=40\nyangle=-50\nscale=2,3\nvfacing=-1');w.tick();
  let e=w.player.drawExplods[0];assert.equal(e.angle,30);assert.equal(e.xangle,40);assert.equal(e.yangle,-50);assert.equal(e.vfacing,-1);
  control(w.player,'ModifyExplod','id=7\nxangle=0\nyangle=180');w.tick();e=w.player.drawExplods[0];assert.equal(e.xangle,0);assert.equal(e.yangle,180);assert.equal(e.angle,30);assert.deepEqual(e.scale,[2,3]);assert.equal(w.player.diagnostics.length,0);
});

test('Invalid 3D angle parameters leave an existing Explod unchanged',()=>{
  const w=world();control(w.player,'Explod','anim=11\nid=7\nxangle=45');
  for(const parameter of ['xangle=1,2','yangle="text"','angle=1,2'])assert.throws(()=>control(w.player,'ModifyExplod','id=7\n'+parameter),/finite number/);
  assert.equal(w.player.explods[0].xangle,45);assert.equal(w.player.explods[0].yangle,0);
});

test('removeongethit removes only flagged effects after a real accepted hit',()=>{
  const w=world();control(w.player,'Explod','anim=11\nid=1\nremoveongethit=1');control(w.player,'Explod','anim=11\nid=2');w.tick();
  const controller={...parseSections('[State Hit]\nattr=S,NA\ndamage=1')[0],type:'hitdef'},hit=w.opponent.parseHitDef(controller);w.player.receiveHit(hit,w.opponent);w.tick();assert.deepEqual(w.player.explods.map(e=>e.id),[2]);assert.deepEqual(w.player.drawExplods.map(e=>e.id),[2]);
});

test('Animation expressions using fvar are character-bank effects, while F-prefixed animations use fightfx',()=>{
  const f=new FighterRuntime(character(),{commonAnimations:new Map([[11,{id:11,frames:[frame(3,-1)]}]])});f.fvars[0]=11;
  control(f,'Explod','anim=fvar(0)');control(f,'Explod','anim=F 11');f.tick();assert.equal(f.drawExplods[0].common,false);assert.equal(f.drawExplods[1].common,true);assert.equal(f.drawExplods[1].ownpal,true);
});

test('ownpal copies remaps with fresh local PalFX while global PalFX remains live',()=>{
  const w=world(),p=w.player,fx=new EffectsState(),pixel=new Uint8ClampedArray([1,2,3,255]);
  control(p,'PalFX','time=1\nadd=100,0,0');control(p,'RemapPal','source=1,1\ndest=1,2');control(p,'Explod','anim=11\nid=1\nownpal=1\npostype=p2');
  control(p,'PalFX','time=1\nadd=0,0,100');control(p,'RemapPal','source=1,1\ndest=1,3');control(p,'Explod','anim=11\nid=2');control(p,'AllPalFX','time=20\nadd=0,10,0');
  fx.consume(p.events,{entity:p});const own=p.explods[0],shared=p.explods[1];
  assert.deepEqual([...transformRgba(pixel,fx.paletteFor(own))],[1,12,3,255]);assert.deepEqual([...transformRgba(pixel,fx.paletteFor(shared))],[1,12,103,255]);
  assert.deepEqual(own.paletteRemaps.get('1,1'),[1,2]);assert.deepEqual(p.paletteRemaps.get('1,1'),[1,3]);fx.advance();assert.deepEqual([...transformRgba(pixel,fx.paletteFor(own))],[1,12,3,255]);
  control(p,'Explod','anim=11\nownpal=1\nremappal=1,4');assert.deepEqual([...p.explods.at(-1).paletteRemaps],[['*',[1,4]]]);
});

test('Own-palette helpers start fresh PalFX and afterimages retain palette remaps',()=>{
  const w=world(),p=w.player,fx=new EffectsState();control(p,'PalFX','time=10\nadd=100,0,0');const h=w.spawnHelper(p,{stateno:0,ownpal:1});control(p,'PalFX','time=10\nadd=0,0,100');
  fx.consume(p.events,{entity:p});assert.equal(fx.paletteFor(h).layers.length,0);
  control(p,'RemapPal','source=1,1\ndest=1,2');fx.consume([{type:'afterimage',time:10,length:2,timegap:1,framegap:1}],{entity:p});fx.capture([p]);control(p,'RemapPal','source=1,1\ndest=1,3');assert.deepEqual(fx.trailsFor(p)[0].paletteRemaps.get('1,1'),[1,2]);
});

test('RemapPal enforces eight active mappings and selected palettes survive round resets',()=>{
  const w=world('',{playerPalette:3,opponentPalette:2}),p=w.player;assert.equal(p.evaluate('PalNo'),3);assert.equal(w.opponent.evaluate('PalNo'),2);assert.deepEqual(p.paletteRemaps.get('1,1'),[1,3]);
  control(p,'RemapPal','source=-1,0\ndest=-1,0');for(let i=0;i<8;i++)control(p,'RemapPal',`source=2,${i}\ndest=3,1`);
  control(p,'RemapPal','source=2,8\ndest=3,1');assert.equal(p.paletteRemaps.size,8);assert.ok(p.diagnostics.some(d=>d.type==='resource-limit'));
  control(p,'RemapPal','source=2,0\ndest=3,2');assert.deepEqual(p.paletteRemaps.get('2,0'),[3,2]);w.reset();assert.equal(w.player.paletteNo,3);
});
