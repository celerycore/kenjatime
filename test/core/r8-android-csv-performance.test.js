import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SpriteRestoreCache,packSparseR8,unpackSparseR8,
} from '../../src/core/sprite-restore-cache.js';
import {framePacing} from '../../src/core/frame-pacing.js';
import {FrameClock} from '../../src/frame-clock.js';

function deterministicBytes(length, seed=0x12345678) {
  const bytes=new Uint8Array(length);
  let state=seed>>>0;
  for(let i=0;i<length;i++){
    state=(Math.imul(state,1664525)+1013904223)>>>0;
    bytes[i]=state>>>24;
  }
  return bytes;
}

test('lossless R8 zero-run encoder preserves arbitrary indexed colors and trailing runs',()=>{
  const cases=[
    Uint8Array.from([]),Uint8Array.from([0]),Uint8Array.from([0,0]),
    Uint8Array.from([0,0,0]),Uint8Array.from([0,0,0,0,255,0,0]),
    new Uint8Array(512),new Uint8Array(513),
    Uint8Array.from({length:512},(_,i)=>i%256),
    deterministicBytes(4097),
  ];
  for(const input of cases){
    const packed=packSparseR8(input);
    const unpacked=unpackSparseR8(packed,input.length);
    assert.deepEqual(unpacked,input,'all index bytes including index-zero must match');
  }
  assert.throws(()=>unpackSparseR8(Uint8Array.of(0xFF),5),/Corrupt/);
  assert.throws(()=>unpackSparseR8(Uint8Array.of(0x01,3),2),/Corrupt/);
});

test('sparse R8 restore cache retains more art within its fixed 16MiB style budget',()=>{
  const raw=deterministicBytes(128*1024);
  for(let i=0;i<raw.length;i++)if((i%16)!==0)raw[i]=0;
  const cache=new SpriteRestoreCache({maxBytes:128*1024,requireRepeat:true});
  for(let index=0;index<4;index++){
    const id='fighter:'+index;
    assert.equal(cache.put(id,raw,{indexed:true}),false,'probation first');
    assert.equal(cache.put(id,raw,{indexed:true}),true,'second chance');
  }
  assert.ok(cache.stats.compressedEntries>=3,cache.stats);
  assert.ok(cache.stats.rawBytesSaved>250000,cache.stats);
  assert.ok(cache.stats.bytes<=128*1024,cache.stats);
  const output=cache.get('fighter:0');
  assert.deepEqual(output,raw);
  assert.equal(cache.stats.decompressions,1);
  output[0]^=255;
  assert.deepEqual(cache.get('fighter:0'),raw,'cache remains immutable after consumer mutations');
  cache.clear();
  assert.equal(cache.stats.bytes,0);
  assert.equal(cache.stats.compressedEntries,0);
  assert.equal(cache.stats.rawBytesSaved,0);
});

test('high-entropy or true-color images retain their original lossless raw representation',()=>{
  const data=deterministicBytes(8192,0xdeadbeef);
  const cache=new SpriteRestoreCache({maxBytes:16*1024});
  assert.equal(cache.put('indexed',data,{indexed:true}),true);
  assert.equal(cache.put('rgba',data,{indexed:false}),true);
  assert.equal(cache.stats.compressedEntries,0);
  assert.equal(cache.stats.bytes,16384);
  assert.deepEqual(cache.get('indexed'),data);
  assert.deepEqual(cache.get('rgba'),data);
});

test('serious Android backlog amortizes worker scheduling without dropping fixed 60Hz ticks',()=>{
  assert.equal(framePacing(100,13).batchLimit,1);
  assert.equal(framePacing(1957,13).batchLimit,2);
  assert.equal(framePacing(1957,9).batchLimit,2);
  assert.equal(framePacing(1957,16).batchLimit,1);
  assert.equal(framePacing(1957,25).batchLimit,1);
  assert.equal(framePacing(1957,13).renderFps,30);

  const a=new FrameClock({maxTicks:1});
  const b=new FrameClock({maxTicks:2});
  const run=clock=>{
    let count=0;clock.advance(0);
    clock.advance(2000,{},()=>count++);
    let iterations=0;
    while(clock.debt>=1 && iterations++<300)
      clock.advance(2000,{},()=>count++);
    return {count,ticks:clock.tickCount,debt:clock.debt};
  };
  assert.deepEqual(run(a),run(b),'batching changes callbacks, not the simulation history');
});
