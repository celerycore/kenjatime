import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sff,decodeAct,archive} from '../src/formats.js';
import {characterSpriteBank} from '../src/palettes.js';
import {zipSync,strToU8} from 'fflate';

function colors(color){const rgb=new Uint8Array(768);rgb.set([255,0,255],0);rgb.set(color,3);return rgb;}
function pcx(palette,{withPalette=true,pixels=[0,1],stride=2}={}){
  const values=[...pixels,...Array(stride-pixels.length).fill(3)],encoded=values.flatMap(c=>c>=192?[193,c]:[c]);
  const b=new Uint8Array(128+encoded.length+(withPalette?769:0)),v=new DataView(b.buffer);b.set([10,5,1,8]);v.setUint16(8,pixels.length-1,true);b[65]=1;v.setUint16(66,stride,true);b.set(encoded,128);
  if(withPalette){b[b.length-769]=12;b.set(palette,b.length-768);}return b;
}
function sff1(specs){
  const data=specs.map(s=>s.link===undefined?pcx(s.palette||colors([255,0,0]),s):new Uint8Array()),size=512+data.reduce((n,b)=>n+32+b.length,0),bytes=new Uint8Array(size),view=new DataView(bytes.buffer);
  bytes.set(strToU8('ElecbyteSpr\0'));bytes[15]=1;view.setUint32(20,specs.length,true);view.setUint32(24,512,true);view.setUint32(28,32,true);let offset=512;
  for(const [i,s]of specs.entries()){
    const next=offset+32+data[i].length;view.setUint32(offset,i+1<specs.length?next:0,true);view.setUint32(offset+4,data[i].length,true);view.setInt16(offset+8,s.x||0,true);view.setInt16(offset+10,s.y||0,true);
    view.setUint16(offset+12,s.group||0,true);view.setUint16(offset+14,s.number||0,true);view.setUint16(offset+16,s.link||0,true);bytes[offset+18]=s.shared||0;bytes.set(data[i],offset+32);offset=next;
  }return bytes;
}
function act(color){const bytes=new Uint8Array(768);bytes.set(color,254*3);bytes.set([255,0,255],255*3);return bytes;}

test('ACT palettes reverse RGB entries into indexed colors and keep index zero transparent',()=>{
  const palette=decodeAct(act([10,20,30]));assert.deepEqual([...palette.slice(0,8)],[255,0,255,0,10,20,30,255]);
  const extended=new Uint8Array(772);extended.set(act([3,2,1]));assert.equal(decodeAct(extended)[4],3);assert.throws(()=>decodeAct(new Uint8Array(767)),/768/);
});

test('SFF v1 exposes indices and honors shared palettes even when a shared PCX includes its own colors',()=>{
  const pack=sff(sff1([{palette:colors([255,0,0]),stride:4},{number:1,palette:colors([0,255,0]),shared:1}]));
  assert.deepEqual([...pack.decode(0).indices],[0,1]);assert.deepEqual([...pack.decode(1).rgba.slice(4)],[255,0,0,255]);assert.equal(pack.decode(0).rgba[3],0);
});

test('External ACT remaps the character base while private palettes and linked sprite metadata remain intact',()=>{
  const bytes=sff1([{group:9000,palette:colors([0,0,255])},{group:0,palette:colors([255,0,0])},{number:1,shared:1,withPalette:false},{group:10,number:5,link:1,x:-3,y:8}]);
  const pack=sff(bytes,{externalPalettes:new Map([[1,decodeAct(act([20,30,40]))],[2,decodeAct(act([0,255,0]))]])});
  assert.deepEqual([...pack.decode(1).rgba.slice(4)],[20,30,40,255]);assert.deepEqual([...pack.decode(2).rgba.slice(4)],[20,30,40,255]);assert.deepEqual([...pack.decode(0).rgba.slice(4)],[0,0,255,255]);
  const remapped=pack.decodeWithPalette(3,1,2);assert.deepEqual([...remapped.rgba.slice(4)],[0,255,0,255]);assert.equal(remapped.group,10);assert.equal(remapped.number,5);assert.equal(remapped.x,-3);assert.equal(remapped.y,8);
  assert.deepEqual([...pack.decode(1).rgba.slice(4)],[20,30,40,255]);assert.throws(()=>pack.decodeWithPalette(0,1,9),/does not exist/);
});

test('SFF v1 rejects cyclic tables, invalid links and PCX runs that would read into the palette',()=>{
  const cyclic=sff1([{},{number:1}]),view=new DataView(cyclic.buffer);view.setUint32(512,512,true);assert.throws(()=>sff(cyclic),/table link/);
  const linked=sff(sff1([{link:0}]));assert.throws(()=>linked.decode(0),/link/);
  const truncated=sff1([{pixels:[0,1]}]);truncated[512+32+128]=255;assert.throws(()=>sff(truncated).decode(0),/PCX run/);
  assert.throws(()=>sff(truncated.subarray(0,520)),/sprite/);
});

test('Archive palette references use safe case-insensitive paths and malformed ACT files remain visible diagnostics',()=>{
  const [character]=archive(zipSync({
    'hero/Hero.DEF':strToU8('[Info]\nname=Palettes\npal.defaults=3,2,1\n[Files]\nsprite=hero.sff\npal1=C:\\original\\red.act\npal2=..\\Palettes\\Green.ACT\npal3=broken.act\npal4=../../external.act'),
    'hero/hero.sff':sff1([{}]),'hero/red.act':act([255,0,0]),'palettes/green.act':act([0,255,0]),'hero/broken.act':new Uint8Array(1),
  }));
  assert.equal(character.palettes.length,4);assert.ok(character.palettes.slice(0,3).every(p=>p.ok));const bank=characterSpriteBank(character);
  assert.deepEqual(bank.selectablePalettes,[1,2]);assert.equal(bank.defaultPalette,2);assert.equal(bank.diagnostics.length,2);assert.match(bank.diagnostics[1].message,/missing from the ZIP/);assert.deepEqual([...bank.decodeWithPalette(0,1,2).rgba.slice(4)],[0,255,0,255]);
});

test('SFF v2.1 palette alpha survives decoding and remapping while SFF v2.0 retains index-zero masking',()=>{
  const bytes=new Uint8Array(146),v=new DataView(bytes.buffer),u=(p,n)=>v.setUint32(p,n,true),h=(p,n)=>v.setUint16(p,n,true);
  bytes.set(strToU8('ElecbyteSpr\0'));bytes[15]=2;bytes[14]=1;u(36,68);u(40,1);u(44,96);u(48,2);u(52,128);h(72,2);h(74,1);bytes[83]=8;u(88,2);
  for(let i=0;i<2;i++){const p=96+i*16;h(p,1);h(p+2,i+1);h(p+4,2);u(p+8,2+i*8);u(p+12,8);}
  bytes.set([1,0,10,20,30,0,100,110,120,77,1,2,3,0,4,5,6,123],128);
  const pack=sff(bytes);assert.equal(pack.decode(0).rgba[3],77);assert.equal(pack.decodeWithPalette(0,1,2).rgba[3],123);
  bytes[14]=0;const legacy=sff(bytes);assert.equal(legacy.decode(0).rgba[3],255);assert.equal(legacy.decode(0).rgba[7],0);
});

test('Palette remapping leaves indexed sprites with a different color depth unchanged',()=>{
  const bytes=new Uint8Array(322),v=new DataView(bytes.buffer),u=(p,n)=>v.setUint32(p,n,true),h=(p,n)=>v.setUint16(p,n,true);
  bytes.set(strToU8('ElecbyteSpr\0'));bytes[15]=2;u(36,68);u(40,1);u(44,96);u(48,2);u(52,128);h(72,2);h(74,1);bytes[83]=5;u(88,2);
  for(const [i,count]of [32,16].entries()){const p=96+i*16;h(p,1);h(p+2,i+1);h(p+4,count);u(p+8,i===0?2:130);u(p+12,count*4);}
  bytes.set([1,0],128);bytes.set([255,0,0,255],134);bytes.set([0,255,0,255],262);
  const bank=sff(bytes),original=bank.decode(0);assert.equal(original.rgba[0],255);assert.equal(bank.decodeWithPalette(0,1,2),original);
});
