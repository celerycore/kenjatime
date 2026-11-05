import {test} from 'node:test';
import assert from 'node:assert/strict';
import {expandIndexedRgba} from '../src/formats.js';

test('Packed palette expansion preserves every byte for all 256 indices and alpha values',()=>{
  const colors=Uint8Array.from({length:1024},(_,i)=>(i*73+19)%256),indices=Uint8Array.from({length:4096},(_,i)=>(i*31)%256),expected=new Uint8ClampedArray(indices.length*4);
  for(let i=0;i<indices.length;i++)for(let c=0;c<4;c++)expected[i*4+c]=colors[indices[i]*4+c];
  assert.deepEqual(expandIndexedRgba(indices,colors),expected);
});

test('Unaligned palettes and sliced index buffers retain RGB order and transparent entries',()=>{
  const bytes=new Uint8Array([9,255,0,255,0,20,40,80,127,8]),colors=bytes.subarray(1,9),indices=new Uint8Array([99,1,0,99]).subarray(1,3);
  assert.deepEqual([...expandIndexedRgba(indices,colors)],[20,40,80,127,255,0,255,0]);
});

test('Invalid palette indices preserve their diagnostic and do not silently wrap colors',()=>{
  assert.throws(()=>expandIndexedRgba(new Uint8Array([2]),new Uint8Array(8),'Palette depth mismatch'),/Palette depth mismatch/);
  assert.equal(expandIndexedRgba(new Uint8Array(),new Uint8Array()).length,0);
});
