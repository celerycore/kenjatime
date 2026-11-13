import {test} from 'node:test';
import assert from 'node:assert/strict';
import {decodeAct,detectActPaletteOrder,embeddedSffV1RgbPalette} from '../../src/formats.js';
import {characterSpriteBank} from '../../src/palettes.js';

// Compact authentic SFF v1 + 8-bit PCX fixture with one linked sprite.
// The embedded VGA palette is authoritative for the indexed pixel order.
const colors=()=>{
 const rgb=new Uint8Array(768);
 for(let i=0;i<256;i++)rgb.set([(i*53)%255,(i*113)%255,(i*79)%255],i*3);
 rgb.set([255,0,255],0);rgb.set([248,230,220],3);rgb.set([153,23,31],6);
 return rgb;
};
const reverse=(rgb)=>{
 const out=new Uint8Array(768);
 for(let i=0;i<256;i++)out.set(rgb.subarray(i*3,i*3+3),(255-i)*3);
 return out;
};
function sffV1Fixture(rgb){
 const pcx=new Uint8Array(128+2+769);
 pcx[0]=10;pcx[1]=5;pcx[2]=1;pcx[3]=8;pcx[8]=1;pcx[65]=1;pcx[66]=2;
 pcx[128]=1;pcx[129]=2;pcx[130]=12;pcx.set(rgb,131);
 const first=512,second=first+32+pcx.length,buf=new Uint8Array(second+32),v=new DataView(buf.buffer);
 buf.set(new TextEncoder().encode('ElecbyteSpr'),0);buf[11]=0;buf[12]=1;buf[15]=1;
 v.setUint32(16,1,true);v.setUint32(20,2,true);v.setUint32(24,first,true);v.setUint32(28,32,true);buf[32]=1;
 v.setUint32(first,second,true);v.setUint32(first+4,pcx.length,true);
 v.setUint16(first+12,0,true);v.setUint16(first+14,0,true);
 buf.set(pcx,first+32);
 // Linked 0,1 reuses sprite indices and palette from 0,0.
 v.setUint32(second,0,true);v.setUint32(second+4,0,true);
 v.setUint16(second+12,0,true);v.setUint16(second+14,1,true);
 v.setUint16(second+16,0,true);buf[second+18]=1;
 return buf;
}
function characterFixture(rgb,act1,act2){
 const root='chars/maidforblood/';
 const files={
  [root+'maidforblood.sff']:sffV1Fixture(rgb),
  [root+'maidforblood.act']:act1,
  [root+'alternate.act']:act2,
 };
 return {
  path:root+'maidforblood.def',
  sprite:{path:root+'maidforblood.sff'},
  def:{
   info:{name:'MaidForBlood','pal.defaults':'1,2'},
   files:{sprite:'maidforblood.sff',pal1:'maidforblood.act',pal2:'alternate.act'},
  },
  files,
 };
}
function pixel(bank,pair){
 return [...bank.decodeWithPalette(0,...pair).rgba.subarray(0,8)];
}
function expected(rgb){
 return [...rgb.subarray(3,6),255,...rgb.subarray(6,9),255];
}
test('MaidForBlood forward-index ACT matches PCX instead of getting inverted',()=>{
 const rgb=colors(),bank=characterSpriteBank(characterFixture(rgb,rgb,rgb));
 assert.equal(detectActPaletteOrder(rgb,rgb),'forward');
 assert.deepEqual([...embeddedSffV1RgbPalette(sffV1Fixture(rgb))], [...rgb]);
 assert.deepEqual(pixel(bank,[1,1]),expected(rgb));
 assert.deepEqual(pixel(bank,[1,2]),expected(rgb));
 assert.deepEqual([...bank.decode(0).rgba.subarray(0,8)],expected(rgb));
 assert.deepEqual([...bank.decodeIndexed(1).indices],[1,2]);
 assert.equal(bank.decodeIndexed(1).colors[0+3],0); // index zero transparent
 assert.deepEqual(bank.selectablePalettes,[1,2]);
});
test('legacy reverse-index ACT palette still resolves the same colors',()=>{
 const rgb=colors(),reversed=reverse(rgb),bank=characterSpriteBank(characterFixture(rgb,reversed,reversed));
 assert.equal(detectActPaletteOrder(reversed,rgb),'reversed');
 assert.deepEqual(pixel(bank,[1,1]),expected(rgb));
 assert.deepEqual(pixel(bank,[1,2]),expected(rgb));
 assert.deepEqual([...decodeAct(reversed).subarray(4,8)],[...rgb.subarray(3,6),255]);
});
test('alternate recolor is decoded with pal1 orientation, not its own colors',()=>{
 const rgb=colors(),alt=new Uint8Array(rgb);
 for(let i=0;i<256;i++)alt.set([22,45,125],i*3);
 const bank=characterSpriteBank(characterFixture(rgb,rgb,alt));
 assert.deepEqual(pixel(bank,[1,1]),expected(rgb));
 assert.deepEqual(pixel(bank,[1,2]),[22,45,125,255,22,45,125,255]);
});
test('no embedded reference preserves the historical reversed ACT rule',()=>{
 const rgb=colors();
 assert.equal(detectActPaletteOrder(rgb,null),'reversed');
 assert.deepEqual([...decodeAct(reverse(rgb)).subarray(4,8)],[...rgb.subarray(3,6),255]);
});
