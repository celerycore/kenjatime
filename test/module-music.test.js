import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createModuleMusic} from '../src/module-music.js';
const decoder=await createModuleMusic();
for(const format of ['mod','xm','it','s3m'])test(format+' streams nonzero PCM with sample-accurate seek, rewind and idempotent close',()=>{
 const stream=decoder.open(readFileSync(new URL('./fixtures/media/tone.'+format,import.meta.url)),48000);
 assert.equal(decoder.active,1);assert.equal(stream.length,368640);
 assert.equal(stream.read(2048),2048);const first=new Float32Array(stream.pcm.buffer,stream.pcm.byteOffset,4096).slice();
 assert.ok(first.every(Number.isFinite));assert.ok(first.some(n=>Math.abs(n)>.01));assert.equal(stream.seek(48000),48000);assert.equal(stream.position,48000);
 assert.equal(stream.seek(0),0);assert.equal(stream.read(2048),2048);assert.deepEqual(new Float32Array(stream.pcm.buffer,stream.pcm.byteOffset,4096),first);
 assert.throws(()=>stream.seek(-1),/Invalid/);stream.close();stream.close();assert.equal(decoder.active,0);assert.equal(stream.read(1),0);
});
test('damaged module data fails without leaking an active stream',()=>{assert.throws(()=>decoder.open(new Uint8Array([1,2,3]),48000),/damaged|unsupported/);assert.equal(decoder.active,0);});
test('session cleanup releases every module voice without decoding full songs',()=>{const bytes=readFileSync(new URL('./fixtures/media/tone.mod',import.meta.url));decoder.open(bytes,48000);decoder.open(bytes,48000);assert.equal(decoder.active,2);decoder.close();assert.equal(decoder.active,0);});
