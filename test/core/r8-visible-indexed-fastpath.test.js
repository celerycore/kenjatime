import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sff,packageFiles} from '../../src/formats.js';
import {CoreSession} from '../../src/core/session.js';
import {visibleArenaDraws} from '../../src/core/quad-visibility.js';

function sffV1Fixture({truncate=false}={}){
  const stride=4,width=3,height=2;
  const data=new Uint8Array(128+(truncate?3:8)+(truncate?0:769));
  data[0]=10;data[1]=5;data[2]=1;data[3]=8;data[65]=1;
  const head=new DataView(data.buffer);
  head.setUint16(8,width-1,true);head.setUint16(10,height-1,true);
  head.setUint16(66,stride,true);
  data.set(truncate?[1,2,3]:[1,2,3,0,2,1,0,0],128);
  if(!truncate){
    data[136]=12;
    for(let i=0;i<256;i++){
      data[137+3*i]=(i*3)%256;
      data[138+3*i]=(i*7)%256;
      data[139+3*i]=(i*11)%256;
    }
  }
  const first=512,second=first+32+data.length;
  const out=new Uint8Array(second+32),v=new DataView(out.buffer);
  out.set(new TextEncoder().encode('ElecbyteSpr'),0);
  out[11]=0;out[12]=1;out[15]=1;
  v.setUint32(16,1,true);v.setUint32(20,2,true);v.setUint32(24,first,true);
  v.setUint32(28,32,true);out[32]=1;
  v.setUint32(first,second,true);v.setUint32(first+4,data.length,true);
  v.setUint16(first+12,0,true);v.setUint16(first+14,0,true);
  out.set(data,first+32);
  v.setUint32(second,0,true);v.setUint32(second+4,0,true);
  v.setUint16(second+12,0,true);v.setUint16(second+14,1,true);
  v.setUint16(second+16,0,true);out[second+18]=1;
  return out;
}

test('SFFv1 PCX R8 direct decoder preserves pixel indices, linked geometry and palettes without RGBA expansion',()=>{
  const bank=sff(sffV1Fixture());
  for(const index of [0,1]){
    const traditional=bank.decode(index);
    const direct=bank.decodeIndexOnly(index);
    const metrics=bank.spriteMetrics(index);
    assert.deepEqual([...direct.indices],[...traditional.indices]);
    assert.equal(direct.rgba,undefined,'R8 presentation never creates an RGBA plane');
    assert.equal(metrics.indices,undefined,'geometry extraction does not decode pixels');
    assert.equal(direct.w,traditional.w);
    assert.equal(direct.h,traditional.h);
    assert.equal(direct.x,traditional.x);
    assert.equal(direct.y,traditional.y);
    assert.equal(direct.palette,traditional.palette);
    assert.deepEqual([...direct.colors],[...bank.paletteColors(1,1)]);
    assert.equal(metrics.indexed,true);
    assert.equal(metrics.w,3);assert.equal(metrics.h,2);
    assert.equal(direct.indices.length,6,'strided PCX rows are cropped precisely');
  }
});

test('SFFv1 PCX missing source suffix remains transparent in direct renderer-only path',()=>{
  const palette=new Uint8Array(1024);
  for(let i=0;i<256;i++){palette[i*4]=i;palette[i*4+3]=i?255:0;}
  const bank=sff(sffV1Fixture({truncate:true}),{
    externalPalettes:new Map([[1,palette]]),
  });
  assert.throws(()=>bank.decode(0),/Truncated PCX/);
  const original=bank.decodeForDisplay(0);
  const direct=bank.decodeIndexOnly(0);
  assert.deepEqual([...direct.indices],[...original.indices]);
  assert.equal(direct.rgba,undefined);
  assert.equal(direct.sourceIncomplete,true);
  assert.equal(direct.decodedPrefixPixels,3);
  assert.equal(direct.totalSourcePixels,8);
  assert.deepEqual([...direct.indices],[1,2,3,0,0,0]);
});

test('lazy Core frame keeps exactly the same quad identities and pixel bytes as eager reference',()=>{
  const files=packageFiles(readFileSync(new URL('../../public/kfm.zip',import.meta.url)));
  const session=new CoreSession(files,{mode:'cpu',level:5,endless:true});
  try{
    session.tick();
    const lazy=session.frame({lazySpriteUploads:true});
    const lazyBytes=lazy.assets.reduce((n,a)=>n+a.pixels.byteLength,0);
    const eager=session.frame();
    assert.deepEqual(lazy.draws,eager.draws,
      'visibility-first optimization must not alter ordering, transforms, or palettes');
    const eagerBytes=eager.assets.reduce((n,a)=>n+a.pixels.byteLength,0);
    assert.ok(eagerBytes>lazyBytes,
      'unneeded first-frame sprite pixel data is deferred while building draws');
    const visible=visibleArenaDraws(lazy.draws).visible;
    const required=new Set(visible.flatMap(q=>q.indexed?[q.texture,q.palette]:[q.texture]));
    const delivered=session.restoreAssets([...required].filter(id=>id&&!id.startsWith('@')));
    const eagerById=new Map(eager.assets.map(a=>[a.id,a]));
    for(const asset of delivered){
      const original=eagerById.get(asset.id);
      if(!original)continue; // palette already sent in the lazy frame
      assert.deepEqual([...asset.pixels],[...original.pixels],asset.id);
    }
    assert.ok(delivered.some(a=>a.indexed),'visible R8 art is decoded when requested');
  }finally{session.close();}
});
