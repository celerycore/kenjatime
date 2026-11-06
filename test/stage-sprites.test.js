import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {sff,expandIndexedRgba} from '../src/formats.js';
import {trimIndexedSprite,prepareStageSprites,StageSpriteSurfaces} from '../src/stage-sprites.js';
import {unpackArchiveBytes} from '../src/archive-reader.js';
import {stageDefinitions} from '../src/stages.js';

function fixture(){
 const w=257,h=256,table=68,pal=table+56,data=pal+32,bytes=new Uint8Array(data+w*h+16),v=new DataView(bytes.buffer);
 const u=(p,n)=>v.setUint32(p,n,true),s=(p,n)=>v.setUint16(p,n,true);
 bytes.set(new TextEncoder().encode('ElecbyteSpr\0'));bytes[15]=2;u(36,table);u(40,2);u(44,pal);u(48,2);u(52,data);
 s(table+4,w);s(table+6,h);bytes[table+15]=8;u(table+20,w*h);s(table+28+2,1);s(table+28+24,1);
 for(let i=0;i<2;i++){s(pal+i*16,1);s(pal+i*16+2,i+1);s(pal+i*16+4,2);u(pal+i*16+8,w*h+i*8);u(pal+i*16+12,8);}
 bytes[data+100*w+100]=1;bytes.set([0,0,0,0,255,20,10,0,0,0,0,0,10,255,20,0],data+w*h);
 return bytes;
}

test('Indexed SFF decoding preserves linked palettes and leaves the RGBA cache empty',()=>{
 const bank=sff(fixture());
 for(let i=0;i<2;i++){const indexed=bank.decodeIndexed(i);assert.equal(indexed.w,257);assert.equal(indexed.h,256);assert.equal(indexed.number,i);assert.equal(bank.cacheStats().bytes,0);assert.deepEqual(expandIndexedRgba(indexed.indices,indexed.colors),bank.decode(i).rgba);bank.clearDecodedCache();}
 assert.throws(()=>bank.decodeIndexed(3),/link/);const cyclic=fixture();new DataView(cyclic.buffer).setUint16(68+28+12,1,true);assert.throws(()=>sff(cyclic).decodeIndexed(1),/link/);
 const truncated=fixture();new DataView(truncated.buffer).setUint32(68+20,truncated.length,true);assert.throws(()=>sff(truncated).decodeIndexed(0),/Truncated/);
 const png=fixture();png[68+14]=11;assert.equal(sff(png).decodeIndexed(0),null);
});

test('Trimming uses alpha, keeps partial alpha and guard pixels, and preserves sprite axes',()=>{
 const colors=new Uint8Array(1024);colors.set([255,200,100,0]);colors.set([20,40,60,128],4);
 const indices=new Uint8Array(9*7);indices[3*9+4]=1;
 const sp={w:9,h:7,x:-10,y:8,group:1,number:2,indices,colors},trim=trimIndexedSprite(sp);
 assert.deepEqual([trim.w,trim.h,trim.x,trim.y,trim.trimLeft,trim.trimTop],[3,3,-13,6,3,2]);
 assert.deepEqual([trim.sourceW,trim.sourceH,trim.sourceX,trim.sourceY],[9,7,-10,8]);assert.equal(trim.indices[4],1);
 const restored=new Uint8Array(indices.length);for(let y=0;y<trim.h;y++)restored.set(trim.indices.subarray(y*trim.w,(y+1)*trim.w),(y+trim.trimTop)*sp.w+trim.trimLeft);
 assert.deepEqual(expandIndexedRgba(restored,trim.colors),expandIndexedRgba(indices,colors));
 indices.fill(1);assert.deepEqual([trimIndexedSprite(sp).w,trimIndexedSprite(sp).h],[9,7]);indices.fill(0);assert.equal(trimIndexedSprite(sp).empty,true);
 assert.throws(()=>trimIndexedSprite({...sp,indices:new Uint8Array(1)}),/Invalid/);assert.throws(()=>trimIndexedSprite({...sp,colors:new Uint8Array(0)}),/palette/);
});

test('Stage preparation deduplicates animation frames and palettes and respects memory and eligibility limits',()=>{
 const make=()=>({sprite:{path:'stage.sff'},files:{'stage.sff':fixture()},elements:[{animated:true,mask:true,type:'anim',anim:1,tile:[0,0]}],animations:[{id:1,frames:[{group:0,number:0},{group:0,number:0},{group:0,number:1}]}]});
 const stage=make(),buffers=prepareStageSprites([stage]);assert.equal(Object.keys(stage.preparedSprites.frames).length,2);assert.equal(buffers.length,4);assert.equal(stage.preparedSprites.bytes,2066);
 assert.equal(prepareStageSprites([make()],{maxBytes:1}).length,0);assert.equal(prepareStageSprites([make()],{maxPixels:1}).length,0);
 for(const patch of [{mask:false},{tile:[1,0]},{type:'parallax'},{animated:false}]){const s=make();Object.assign(s.elements[0],patch);assert.deepEqual(prepareStageSprites([s]),[]);assert.equal(s.preparedSprites,undefined);}
 const bad=make();bad.files['stage.sff']=new Uint8Array();assert.doesNotThrow(()=>prepareStageSprites([bad]));
});

test('Prepared surfaces allocate Canvas pixels lazily and recreate evicted frames',()=>{
 let allocations=0,writes=0;const surfaces=new StageSpriteSurfaces({maxBytes:36,createCanvas:()=>{allocations++;return{getContext:()=>({putImageData:()=>writes++})};},createImageData:(rgba,w,h)=>({rgba,w,h})});
 const data=trimIndexedSprite(sff(fixture()).decodeIndexed(0)),sp=surfaces.get(data,'fire');assert.equal(allocations,0);assert.equal(sp.indices.length,9);assert.equal(sp.width,3);assert.equal(surfaces.get(data,'fire'),sp);
 assert.equal(sp.canvas,sp.canvas);assert.equal(allocations,1);assert.equal(writes,1);assert.equal(surfaces.cache.bytes,36);
 surfaces.cache.clear();void sp.canvas;assert.equal(allocations,2);surfaces.clear();assert.equal(surfaces.cache.bytes,0);
});

const forest=process.env.MUGEN_FOREST_RAR;
test('Actual Forest fire animation fits the indexed budget and retains every visible original pixel',{skip:!forest||!existsSync(forest)},async()=>{
 const files=await unpackArchiveBytes(new Uint8Array(readFileSync(forest))),[stage]=stageDefinitions(files),buffers=prepareStageSprites([stage]);
 assert.equal(Object.keys(stage.preparedSprites.frames).length,20);assert.equal(stage.preparedSprites.bytes,7113650);assert.equal(new Set(buffers).size,buffers.length);
 const bank=sff(files[stage.sprite.path]);for(const [key,trim]of Object.entries(stage.preparedSprites.frames)){
  const index=bank.sprites.findIndex(s=>`${s.group},${s.number}`===key),original=bank.decodeIndexed(index);
  for(let y=0;y<original.h;y++)for(let x=0;x<original.w;x++){
   const tx=x-trim.trimLeft,ty=y-trim.trimTop,index=original.indices[y*original.w+x];
   if(tx>=0&&ty>=0&&tx<trim.w&&ty<trim.h)assert.equal(trim.indices[ty*trim.w+tx],index);else assert.equal(original.colors[index*4+3],0);
  }
 }
 assert.equal(bank.cacheStats().bytes,0);
});
