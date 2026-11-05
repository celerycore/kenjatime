import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {zipSync,strToU8,zlibSync} from 'fflate';import {archive,sff,decodePixels,ini} from '../src/formats.js';
test('included real Kung Fu Man package resolves all files and decodes every sprite',()=>{let [c]=archive(new Uint8Array(readFileSync(new URL('../public/kfm.zip',import.meta.url))));assert.equal(c.def.info.name,'Kung Fu Man');assert.ok(c.checks.filter(x=>x.key!=='stcommon').every(x=>x.ok));assert.equal(c.checks.find(x=>x.key==='stcommon').ok,false);assert.ok(c.animations.length>50);const p=sff(c.files[c.sprite.path]);assert.equal(p.sprites.length,281);for(let i=0;i<p.sprites.length;i++){const s=p.decode(i);assert.equal(s.rgba.length,s.w*s.h*4);}for(const a of c.animations)for(const f of a.frames)assert.ok(f.group===-1||p.sprites.some(s=>s.group===f.group&&s.number===f.number),`Action ${a.id} missing sprite`);});
test('nested mixed-case paths and missing files are reported',()=>{let [c]=archive(zipSync({'Nested/Hero.DEF':strToU8('[Info]\nname="Test"\n[Files]\nsprite=Hero.SFF\nanim=missing.air'),'Nested/Hero.SFF':new Uint8Array([0])}));assert.equal(c.checks[0].ok,true);assert.equal(c.checks[1].ok,false);});
test('rejects non character and traversal archives',()=>{assert.throws(()=>archive(zipSync({'hello.txt':strToU8('hi')})),/No character/);assert.throws(()=>archive(zipSync({'../bad':new Uint8Array()})),/Unsafe/);});
test('malformed sprite runs terminate with errors',()=>{assert.throws(()=>decodePixels(new Uint8Array([64,3]),5,2));assert.throws(()=>decodePixels(new Uint8Array([255]),5,4));});
test('comments preserve semicolons in quoted names',()=>assert.equal(ini('[Info]\nname="Test; Hero" ; comment').info.name,'Test; Hero'));

test('AIR preserves loop starts, defaults and one-frame collision overrides',async()=>{
 const {animations}=await import('../src/formats.js');
 const [a]=animations(`[Begin Action 10]
Clsn1Default: 1
Clsn1[0] = 1, -20, 8, 0
Clsn2Default: 1
Clsn2[0] = -5,-30,5,0
0,0,0,0,2
LoopStart
Clsn1: 0
Clsn2: 2
Clsn2[0] = -10,-30,0,0
Clsn2[1] = 0,-40,10,0
0,1,2,-3,3,HV,AS128D256,1.5,2,45
0,2,0,0,-1
[Begin Action 11]
0,0,0,0,1`);
 assert.equal(a.loopStart,1);
 assert.deepEqual(a.frames[0].clsn1,[[1,-20,8,0]]);
 assert.deepEqual(a.frames[1].clsn1,[]);
 assert.equal(a.frames[1].clsn2.length,2);
 assert.deepEqual(a.frames[2].clsn1,[[1,-20,8,0]]);
 assert.deepEqual(a.frames[2].clsn2,[[-5,-30,5,0]]);
 assert.equal(a.frames[1].flip,'HV');assert.equal(a.frames[1].blend,'AS128D256');
 assert.equal(a.frames[1].scaleX,1.5);assert.equal(a.frames[1].scaleY,2);assert.equal(a.frames[1].angle,45);
 assert.notEqual(a.frames[0].clsn2,a.frames[2].clsn2);
});

test('AIR records malformed boxes and interpolation metadata without inventing boxes',async()=>{
 const {animations}=await import('../src/formats.js');
 const [a,b]=animations(`[Begin Action 1]
Interpolate Angle
0,0,0,0,3
Interpolate Offset
Clsn1: 1
Clsn1[3] = 0,0,5,5
0,1,10,0,3
[Begin Action 2]
0,0,0,0,1`);
 assert.deepEqual(a.frames[0].interpolate,['offset']);assert.deepEqual(a.frames[1].interpolate,['angle']);
 assert.deepEqual(a.frames[1].clsn1,[]);assert.equal(a.diagnostics.length,2);
 assert.deepEqual(b.frames[0].clsn1,[]);assert.deepEqual(b.frames[0].clsn2,[]);
 assert.throws(()=>animations('[Begin Action 1]\nClsn1: 1000000\n0,0,0,0,1'),/limit/);
});

test('text decoding supports UTF-8 BOM, UTF-8 names, and legacy ANSI',async()=>{
 const {decodeText}=await import('../src/formats.js');
 assert.equal(decodeText(new Uint8Array([0xef,0xbb,0xbf,...strToU8('Kung Fu Man')])),'Kung Fu Man');
 assert.equal(decodeText(strToU8('拳\nJosé')),'拳\nJosé');
 assert.equal(decodeText(new Uint8Array([0x63,0x61,0x66,0xe9])),'café');
});

test('archive resolves dot segments in references while keeping paths inside the package',()=>{
 const [c]=archive(zipSync({'char/Hero.DEF':strToU8('[Info]\nname=Test\n[Files]\nsprite=./gfx/../hero.sff\nanim=../shared/hero.air'),'char/hero.sff':new Uint8Array([0]),'shared/hero.air':strToU8('[Begin Action 0]\n0,0,0,0,1')}));
 assert.ok(c.checks.every(x=>x.ok));assert.equal(c.animations.length,1);
 const [external]=archive(zipSync({'char/Hero.DEF':strToU8('[Info]\nname=Test\n[Files]\nsprite=../../escape.sff')}));assert.equal(external.checks[0].ok,false);assert.equal(external.checks[0].path,null);
 assert.throws(()=>archive(zipSync({'C:\\bad.def':strToU8('x')})),/Unsafe/);
});

test('real SND samples resolve by group and index; bad links and truncated samples fail',async()=>{
 const {soundArchive}=await import('../src/formats.js');
 const [c]=archive(new Uint8Array(readFileSync(new URL('../public/kfm.zip',import.meta.url))));
 const bytes=c.files[c.checks.find(x=>x.key==='sound').path],snd=soundArchive(bytes);
 assert.equal(snd.samples.length,12);assert.equal(new TextDecoder().decode(snd.get(0,0).subarray(0,4)),'RIFF');assert.equal(snd.get(999,999),undefined);
 const cyclic=bytes.slice();const off=new DataView(cyclic.buffer).getUint32(20,true);new DataView(cyclic.buffer).setUint32(off,off,true);
 assert.throws(()=>soundArchive(cyclic),/link/);assert.throws(()=>soundArchive(bytes.subarray(0,700)),/length/);
});

function pngFixture(width,height,colorType,filtered,palette,alpha){
 const signature=new Uint8Array([137,80,78,71,13,10,26,10]);
 const chunk=(name,data)=>{const b=new Uint8Array(data.length+12),v=new DataView(b.buffer);v.setUint32(0,data.length);b.set(strToU8(name),4);b.set(data,8);return b;};
 const ihdr=new Uint8Array(13),v=new DataView(ihdr.buffer);v.setUint32(0,width);v.setUint32(4,height);ihdr[8]=8;ihdr[9]=colorType;
 const chunks=[signature,chunk('IHDR',ihdr)];if(palette)chunks.push(chunk('PLTE',palette));if(alpha)chunks.push(chunk('tRNS',alpha));
 chunks.push(chunk('IDAT',zlibSync(filtered)),chunk('IEND',new Uint8Array()));
 const result=new Uint8Array(chunks.reduce((n,b)=>n+b.length,0));let offset=0;for(const b of chunks){result.set(b,offset);offset+=b.length;}return result;
}

test('PNG24, PNG32, indexed palettes, scanline filters, and transparency decode synchronously',async()=>{
 const {decodePng}=await import('../src/formats.js');
 const rgb=decodePng(pngFixture(1,1,2,new Uint8Array([0,10,20,30])),1,1);assert.deepEqual([...rgb.rgba],[10,20,30,255]);
 const rgba=decodePng(pngFixture(1,1,6,new Uint8Array([0,1,2,3,70])),1,1);assert.deepEqual([...rgba.rgba],[1,2,3,70]);
 const indexed=decodePng(pngFixture(2,1,3,new Uint8Array([0,0,1]),new Uint8Array([255,0,0,0,255,0]),new Uint8Array([0,123])),2,1);assert.deepEqual([...indexed.rgba],[255,0,0,0,0,255,0,123]);
 const filtered=decodePng(pngFixture(2,2,2,new Uint8Array([1,10,20,30,2,2,2,2,1,1,1,1,1,1])),2,2);assert.deepEqual([...filtered.rgba],[10,20,30,255,12,22,32,255,11,21,31,255,13,23,33,255]);
 assert.throws(()=>decodePng(pngFixture(1,1,2,new Uint8Array([0,10,20,30])),3,1),/dimensions/);
 assert.throws(()=>decodePng(pngFixture(1,1,2,new Uint8Array([0,10,20]))),/length/);
 assert.throws(()=>decodePng(pngFixture(1,1,2,new Uint8Array([5,10,20,30]))),/filter/);
});

test('SFF v2 PNG sprites retain their own metadata through linked images',()=>{
 const png=pngFixture(1,1,2,new Uint8Array([0,10,20,30]));
 const dataOffset=68+2*28,bytes=new Uint8Array(dataOffset+4+png.length),view=new DataView(bytes.buffer);
 bytes.set(strToU8('ElecbyteSpr\0'));bytes[15]=2;view.setUint32(36,68,true);view.setUint32(40,2,true);view.setUint32(44,dataOffset,true);view.setUint32(52,dataOffset,true);
 view.setUint16(68,3,true);view.setUint16(70,4,true);view.setUint16(72,1,true);view.setUint16(74,1,true);bytes[82]=11;bytes[83]=24;view.setUint32(88,png.length+4,true);
 view.setUint16(96,5,true);view.setUint16(98,7,true);view.setInt16(104,-3,true);view.setInt16(106,8,true);view.setUint16(108,0,true);
 bytes.set(png,dataOffset+4);
 const pack=sff(bytes),sprite=pack.decode(0),linked=pack.decode(1);
 assert.deepEqual([...sprite.rgba],[10,20,30,255]);assert.equal(linked.group,5);assert.equal(linked.number,7);assert.equal(linked.x,-3);assert.equal(linked.y,8);assert.equal(linked.w,1);assert.equal(linked.h,1);assert.equal(linked.rgba,sprite.rgba);
 assert.throws(()=>sff(bytes.subarray(0,70)),/table/);
});

test('engine distributions resolve stcommon from their data directory',()=>{
 const definition='[Info]\nname=Test\n[Files]\nsprite=hero.sff\nstcommon=common1.cns';
 const [c]=archive(zipSync({'engine/chars/hero/hero.def':strToU8(definition),'engine/chars/hero/hero.sff':new Uint8Array([0]),'engine/data/common1.cns':strToU8('[Statedef 0]\ntype=S')}));
 assert.equal(c.checks.find(x=>x.key==='stcommon').path,'engine/data/common1.cns');
 assert.equal(c.checks.find(x=>x.key==='stcommon').ok,true);
 const [local]=archive(zipSync({'engine/chars/hero/hero.def':strToU8(definition),'engine/chars/hero/hero.sff':new Uint8Array([0]),'engine/chars/hero/common1.cns':strToU8('[Statedef 0]\ntype=C'),'engine/data/common1.cns':strToU8('[Statedef 0]\ntype=S')}));
 assert.equal(local.checks.find(x=>x.key==='stcommon').path,'engine/chars/hero/common1.cns');
});

test('SFF v2 palette remapping changes indexed colors without modifying the original sprite',()=>{
 const bytes=new Uint8Array(146),v=new DataView(bytes.buffer),u=(p,n)=>v.setUint32(p,n,true),h=(p,n)=>v.setUint16(p,n,true);
 bytes.set(new TextEncoder().encode('ElecbyteSpr\0'));bytes[15]=2;u(36,68);u(40,1);u(44,96);u(48,2);u(52,128);
 h(72,2);h(74,1);bytes[83]=8;u(88,2);
 for(let i=0;i<2;i++){const p=96+i*16;h(p,1);h(p+2,i+1);h(p+4,2);u(p+8,2+i*8);u(p+12,8);}
 bytes.set([1,0,0,0,0,0,255,0,0,255,0,0,0,0,0,255,0,255],128);
 const pack=sff(bytes);assert.deepEqual([...pack.decode(0).rgba.slice(0,4)],[255,0,0,255]);
 assert.deepEqual([...pack.decodeWithPalette(0,1,2).rgba.slice(0,4)],[0,255,0,255]);
 assert.equal(pack.decodeWithPalette(0,1,2).rgba[7],0);assert.equal(pack.decode(0).rgba[0],255);
 assert.throws(()=>pack.decodeWithPalette(0,1,9),/does not exist/);
});

test('Linked SFF v2 sprite data retains the linked sprite own palette selection',()=>{
 const bytes=new Uint8Array(174),v=new DataView(bytes.buffer),u=(p,n)=>v.setUint32(p,n,true),h=(p,n)=>v.setUint16(p,n,true);
 bytes.set(new TextEncoder().encode('ElecbyteSpr\0'));bytes[15]=2;u(36,68);u(40,2);u(44,124);u(48,2);u(52,156);
 h(72,2);h(74,1);bytes[83]=8;u(88,2);h(98,1);h(120,1);
 for(let i=0;i<2;i++){const p=124+i*16;h(p,1);h(p+2,i+1);h(p+4,2);u(p+8,2+i*8);u(p+12,8);}
 bytes.set([1,0,0,0,0,0,255,0,0,255,0,0,0,0,0,255,0,255],156);
 const pack=sff(bytes);assert.equal(pack.decode(0).rgba[0],255);assert.equal(pack.decode(1).rgba[1],255);assert.equal(pack.decode(1).number,1);
});
