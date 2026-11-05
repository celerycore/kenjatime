import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sourceSampleRate,musicLoopPoints} from '../src/audio.js';

function wave(rate,{junk=false}={}){
  const bytes=new Uint8Array(junk?54:44),view=new DataView(bytes.buffer),write=(offset,s)=>bytes.set(new TextEncoder().encode(s),offset);
  write(0,'RIFF');view.setUint32(4,bytes.length-8,true);write(8,'WAVE');let offset=12;
  if(junk){write(offset,'JUNK');view.setUint32(offset+4,1,true);offset+=10;}
  write(offset,'fmt ');view.setUint32(offset+4,16,true);view.setUint32(offset+12,rate,true);return bytes;
}

test('Music loop points use the original WAV rate after Web Audio resampling',()=>{
  const bytes=wave(22050,{junk:true});assert.equal(sourceSampleRate(bytes),22050);
  const loop=musicLoopPoints(bytes,{loopStart:11025,loopEnd:22050},2);
  assert.deepEqual(loop,{start:.5,end:1,exact:true});
  assert.equal(sourceSampleRate(bytes.subarray(0,20)),null);
});

test('Source sample rates include Ogg Vorbis, Opus and FLAC headers',()=>{
  const vorbis=new Uint8Array(100),view=new DataView(vorbis.buffer);vorbis.set(new TextEncoder().encode('OggS'));vorbis[30]=1;vorbis.set(new TextEncoder().encode('vorbis'),31);view.setUint32(42,32000,true);
  assert.equal(sourceSampleRate(vorbis),32000);vorbis.fill(0,30);vorbis.set(new TextEncoder().encode('OpusHead'),30);assert.equal(sourceSampleRate(vorbis),48000);
  const flac=new Uint8Array(42);flac.set(new TextEncoder().encode('fLaC'));flac[18]=44100>>12;flac[19]=44100>>4&255;flac[20]=(44100&15)<<4;
  assert.equal(sourceSampleRate(flac),44100);
});

test('MPEG and ADTS rates are read past ID3 metadata without using the browser output rate',()=>{
  assert.equal(sourceSampleRate(new Uint8Array([255,251,144,0,0])),44100);
  assert.equal(sourceSampleRate(new Uint8Array([255,243,144,0,0])),22050);
  assert.equal(sourceSampleRate(new Uint8Array([255,241,84,0,0])),32000);
  const mp3=new Uint8Array(20);mp3.set(new TextEncoder().encode('ID3'));mp3[9]=4;mp3.set([255,251,148,0],14);assert.equal(sourceSampleRate(mp3),48000);
});

test('Unknown metadata and invalid loop ranges fall back to a complete track with an explicit result',()=>{
  assert.deepEqual(musicLoopPoints(new Uint8Array(),{loopStart:0,loopEnd:0},3),{start:0,end:3,exact:true});
  assert.deepEqual(musicLoopPoints(new Uint8Array(),{loopStart:2,loopEnd:3},3),{start:0,end:3,exact:false});
  assert.deepEqual(musicLoopPoints(wave(22050),{loopStart:22050,loopEnd:11025},3),{start:0,end:3,exact:false});
});
