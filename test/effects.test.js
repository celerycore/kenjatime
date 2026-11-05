import {test} from 'node:test';
import assert from 'node:assert/strict';
import {EffectsState,transformRgba} from '../src/effects.js';
import {blendPixels,sampleAnimation,tileOffsets,backgroundTileStep,parallaxScale} from '../src/rendering.js';

test('PalFX applies color, inversion, sinusoidal add and multiply while preserving transparency',()=>{
  const rgba=new Uint8ClampedArray([100,120,140,255,10,20,30,0]);
  assert.deepEqual([...transformRgba(rgba,{add:[20,0,-20],mul:[128,256,512]})],[60,120,240,255,10,20,30,0]);
  assert.deepEqual([...transformRgba(rgba,{invertall:1})],[155,135,115,255,10,20,30,0]);
  assert.equal(transformRgba(rgba,{sinadd:[40,0,0,4],age:1})[0],140);
  const gray=transformRgba(rgba,{color:0});assert.equal(gray[0],gray[1]);assert.equal(gray[1],gray[2]);
  assert.equal(rgba[0],100);
});

test('Palette lifetimes include the activation frame; children inherit unless ownpal is enabled',()=>{
  const effects=new EffectsState(),parent={},child={parent},independent={parent,ownPal:true};
  effects.consume([{type:'palfx',time:2,add:[10,0,0]}],{entity:parent});
  assert.equal(effects.paletteFor(child).layers.length,1);assert.equal(effects.paletteFor(independent).layers.length,0);
  effects.advance();assert.equal(effects.paletteFor(parent).layers.length,1);
  effects.advance();assert.equal(effects.paletteFor(parent).layers.length,0);
  effects.consume([{type:'palfx',time:-1,invertall:1}],{entity:parent});effects.advance();assert.equal(effects.paletteFor(child).layers.length,1);
  effects.consume([{type:'palfx',time:0}],{entity:parent});assert.equal(effects.paletteFor(child).layers.length,0);
});

test('AllPalFX and BGPalFX compose independently of a character own palette',()=>{
  const effects=new EffectsState(),player={ownPal:true};
  effects.consume([{type:'allpalfx',time:3,add:[20,0,0]},{type:'bgpalfx',time:3,mul:[128,256,256]}]);
  assert.equal(effects.paletteFor(player).layers.length,1);assert.equal(effects.backgroundPalette.layers.length,2);
  assert.equal(transformRgba(new Uint8ClampedArray([100,0,0,255]),effects.backgroundPalette)[0],70);
});

test('EnvShake uses degrees per tick, native default phase and baseline amplitude at high resolution',()=>{
  const effects=new EffectsState();effects.consume([{type:'envshake',time:3}],{entity:{coordinateScale:.25}});
  assert.equal(effects.cameraOffset.y,0);effects.advance();assert.ok(Math.abs(effects.cameraOffset.y-4*Math.sin(Math.PI/3))<1e-8);
  effects.advance();effects.advance();assert.deepEqual(effects.cameraOffset,{x:0,y:0});
  effects.consume([{type:'envshake',time:2,freq:90}],{entity:{coordinateScale:1}});assert.equal(effects.cameraOffset.y,4);
});

test('AfterImage snapshots are independent, bounded, sampled by tick and stopped by AfterImageTime',()=>{
  const effects=new EffectsState(),player={pos:{x:0,y:0},facing:1,coordinateScale:1,currentFrame:{group:0,number:0},constant:()=>1,drawScale:{x:1,y:1}};
  effects.consume([{type:'afterimage',time:-1,length:3,timegap:1,framegap:1}],{entity:player});
  for(let i=0;i<5;i++){player.pos.x=i;effects.capture([player]);effects.advance();}
  const trails=effects.trailsFor(player);assert.equal(trails.length,3);assert.deepEqual(trails.map(t=>t.pos.x),[2,3,4]);
  player.pos.x=99;assert.equal(trails[0].pos.x,2);
  effects.consume([{type:'afterimagetime',time:0}],{entity:player});assert.equal(effects.trailsFor(player).length,0);
});

test('AIR A1 and AS coefficients darken destination correctly; subtraction clamps and skips transparent source',()=>{
  const dst=new Uint8ClampedArray([100,120,140,255]),src=new Uint8ClampedArray([80,40,200,255]);
  assert.deepEqual([...blendPixels(dst,src,'A1')],[130,100,255,255]);
  assert.deepEqual([...blendPixels(dst,src,'AS128D128')],[90,80,170,255]);
  assert.deepEqual([...blendPixels(dst,src,'S')],[20,80,0,255]);
  src[3]=0;assert.deepEqual(blendPixels(dst,src,'S'),dst);
});

test('AIR interpolation samples offset, scale, angle and additive coefficients without moving collision boxes',()=>{
  const a={x:0,y:0,ticks:4,scaleX:1,scaleY:1,angle:0,blend:'AS256D0',clsn1:[[0,0,1,1]],interpolate:['offset','scale','angle','blend']};
  const b={x:100,y:-20,ticks:4,scaleX:2,scaleY:3,angle:90,blend:'AS128D256'};
  const sampled=sampleAnimation({frames:[a,b],loopStart:0},0,2);
  assert.equal(sampled.x,50);assert.equal(sampled.y,-10);assert.equal(sampled.scaleX,1.5);assert.equal(sampled.angle,45);
  assert.equal(sampled.blend,'AS192D128');assert.deepEqual(sampled.clsn1,a.clsn1);assert.equal(a.x,0);
});

test('Stage tiling covers negative origins, finite repeats and bounded tiny tiles without infinite loops',()=>{
  const offsets=tileOffsets(-20,100,100,1,0,320);assert.ok(offsets.includes(0)&&offsets.includes(3));
  assert.deepEqual(tileOffsets(0,100,100,3,0,320),[0,1,2]);assert.deepEqual(tileOffsets(0,100,0,1,0,320),[]);
  assert.equal(tileOffsets(0,1,1,1,0,10000).length,256);
});

test('Parallax rows interpolate the documented top and bottom widths and vertical camera scaling',()=>{
  const element={xscale:[1,1.75],yScaleStart:1,yScaleDelta:.012};
  assert.equal(parallaxScale(element,100,100,101,0).x,1);assert.equal(parallaxScale(element,100,100,101,0).delta,1.75);
  assert.equal(parallaxScale({...element,width:[200,300]},100,50,101,0).x,2.5);
  assert.equal(parallaxScale({...element,width:[200,300]},100,50,101,0).delta,1.25);
  assert.ok(Math.abs(parallaxScale(element,100,0,101,-10).y-1/.88)<1e-9);
  assert.equal(parallaxScale(element,100,0,101,-100).y,0);
});

test('Animated tiles keep constant spacing when the frame size changes',()=>{
  const element={animated:true,spacing:[60,30]};
  assert.equal(backgroundTileStep(element,20),60);assert.equal(backgroundTileStep(element,40),60);
  assert.equal(backgroundTileStep({...element,animated:false},20),80);assert.equal(backgroundTileStep(element,20,1),30);
});
