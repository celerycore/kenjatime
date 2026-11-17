import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {packageFiles} from '../../src/formats.js';
import {pcmMetadata,readSoundBank} from '../../src/kotlin/sound-assets.js';
import {KotlinAudio} from '../../src/kotlin/audio.js';

function wave({frames=800,rate=8000,channels=1,bits=8,codec=1,pad=false}={}){
  const size=frames*channels*bits/8,bytes=new Uint8Array(44+size+(pad?(size&1):0)),v=new DataView(bytes.buffer),text=(p,s)=>[...s].forEach((c,i)=>bytes[p+i]=c.charCodeAt(0));
  text(0,'RIFF');v.setUint32(4,bytes.length-8,true);text(8,'WAVE');text(12,'fmt ');v.setUint32(16,16,true);
  v.setUint16(20,codec,true);v.setUint16(22,channels,true);v.setUint32(24,rate,true);v.setUint32(28,rate*channels*bits/8,true);
  v.setUint16(32,channels*bits/8,true);v.setUint16(34,bits,true);text(36,'data');v.setUint32(40,size,true);return bytes;
}
function snd(waves=[wave()],eof=false){
  const bytes=new Uint8Array(24+waves.reduce((n,w)=>n+16+w.length,0)),v=new DataView(bytes.buffer);
  [...'ElecbyteSnd'].forEach((c,i)=>bytes[i]=c.charCodeAt(0));v.setUint32(16,waves.length,true);v.setUint32(20,waves.length?24:0,true);
  let p=24;waves.forEach((w,i)=>{const next=p+16+w.length;v.setUint32(p,i===waves.length-1&&!eof?0:next,true);v.setUint32(p+4,w.length,true);
    v.setUint32(p+8,i,true);bytes.set(w,p+16);p=next});return bytes;
}
test('actual KFM SND exposes twelve authored PCM samples with original frame/rate metadata',()=>{
  const files=packageFiles(new Uint8Array(readFileSync('public/kfm.zip'))),bank=readSoundBank(files['kfm/kfm.snd']);
  assert.equal(bank.samples.size,12);assert.deepEqual(bank.warnings,[]);assert.equal(bank.samples.get('0:0').frames,998);assert.equal(bank.samples.get('0:0').rate,8000);
  assert.ok(bank.catalog.includes('0,0,998,8000'));
});
test('WAVE metadata supports mono/stereo integer PCM and IEEE float without sample decoding',()=>{
  for(const bits of [8,16,24,32])for(const channels of [1,2])assert.equal(pcmMetadata(wave({bits,channels,frames:1234,rate:22050})).frames,1234);
  assert.equal(pcmMetadata(wave({codec:3,bits:32})).codec,3);
});
test('odd final PCM bytes work with both original unpadded and padded WAVE writers',()=>{
  for(const pad of [false,true])assert.equal(pcmMetadata(wave({frames:801,pad})).frames,801);
});
test('SND accepts zero and original KFM EOF final pointers',()=>{
  for(const eof of [false,true])assert.equal(readSoundBank(snd([wave(),wave()],eof)).samples.size,2);
});
test('SND rejects cyclic links, truncated declared samples and oversized payloads',()=>{
  const cyclic=snd([wave(),wave()]);new DataView(cyclic.buffer).setUint32(24,24,true);assert.throws(()=>readSoundBank(cyclic),/linked/);
  const bytes=snd();assert.throws(()=>readSoundBank(bytes.subarray(0,bytes.length-1)),/length/);
  new DataView(bytes.buffer).setUint32(28,0xffffffff,true);assert.throws(()=>readSoundBank(bytes),/length/);
});
test('WAVE rejects forged chunk lengths, inconsistent block alignment and unsupported codecs',()=>{
  const a=wave();new DataView(a.buffer).setUint32(40,0xffffffff,true);assert.throws(()=>pcmMetadata(a),/payload/);
  const b=wave();new DataView(b.buffer).setUint16(32,17,true);assert.throws(()=>pcmMetadata(b),/format/);
  assert.throws(()=>pcmMetadata(wave({codec:6})),/format/);
});
test('unsupported samples are diagnosed while valid entries remain available',()=>{
  const bank=readSoundBank(snd([wave(),wave({codec:6})]));assert.equal(bank.samples.size,1);assert.equal(bank.warnings.length,1);
  assert.equal(readSoundBank(null).catalog,'');assert.throws(()=>readSoundBank(new Uint8Array(24)),/SND/);
});
test('asset scanning handles byte views without copying or mutating authored WAV data',()=>{
  const bytes=snd(),padded=new Uint8Array(bytes.length+13);padded.set(bytes,7);const view=padded.subarray(7,7+bytes.length),before=view.slice();
  const bank=readSoundBank(view);assert.deepEqual(view,before);assert.equal(bank.samples.get('0:0').wav.buffer,padded.buffer);
});

class Node {
  constructor(){this.gain={value:1};this.pan={value:0};this.playbackRate={value:1};this.starts=0;this.stops=0}
  connect(){return this}disconnect(){this.disconnected=true}start(){this.starts++}stop(){this.stops++}
}
class Context {
  constructor(){this.state='suspended';this.sampleRate=8000;this.destination=new Node();this.pending=[];this.sources=[]}
  resume(){this.state='running';return Promise.resolve()}suspend(){this.state='suspended';return Promise.resolve()}close(){this.state='closed';return Promise.resolve()}
  createGain(){return new Node()}createStereoPanner(){return new Node()}createBufferSource(){const n=new Node();this.sources.push(n);return n}
  decodeAudioData(bytes){return new Promise((resolve,reject)=>this.pending.push({bytes,resolve,reject,done:false}))}
  finish(index){const p=this.pending[index];assert.ok(!p.done);p.done=true;p.resolve({length:800,numberOfChannels:1})}
}
const flush=async()=>{for(let i=0;i<12;i++)await Promise.resolve()};
function platform(limit){const context=new Context(),audio=new KotlinAudio({contextFactory:()=>context,cacheLimit:limit}),bank=readSoundBank(snd(Array.from({length:6},()=>wave())));
  audio.prepare();audio.configure([bank,bank]);return {audio,context,bank}}
const play=(voice,group=0,actor=1)=>({type:'play',data:{voice,actor,side:0,channel:3,group,number:0,gain:1,frequency:1,pan:-1,loop:true}});
test('stop before decode completion cannot start a late hardware voice',async()=>{
  const {audio,context}=platform();audio.handle([play(1)]);await flush();assert.equal(context.pending.length,1);
  audio.handle([{type:'stop',voice:1}]);context.finish(0);await flush();assert.equal(context.sources.length,0);assert.equal(audio.snapshot().voices.length,0);
});
test('pan changes arriving during decode are applied to the eventual StereoPanner node',async()=>{
  const {audio,context}=platform();audio.handle([play(1),{type:'pan',voice:1,pan:.75}]);await flush();context.finish(0);await flush();
  assert.equal(audio.voices.get(1).panNode.pan.value,.75);assert.equal(context.sources[0].starts,1);
});
test('hardware voices use Kotlin voice IDs and keep equal helper/root channel numbers separate',async()=>{
  const {audio,context}=platform();audio.handle([play(1,0,1),play(2,0,3)]);await flush();assert.equal(context.pending.length,1);
  context.finish(0);await flush();assert.equal(context.sources.length,2);audio.handle([{type:'stop',voice:1}]);assert.equal(audio.voices.get(2).actor,3);
});
test('a reset generation discards old decode completions without deleting a new reused voice ID',async()=>{
  const {audio,context,bank}=platform();audio.handle([play(1)]);await flush();audio.configure([bank,bank]);audio.handle([play(1,1)]);await flush();
  context.finish(1);await flush();context.finish(0);await flush();assert.equal(context.sources.length,1);assert.equal(audio.voices.get(1).group,1);
});
test('sample decoding is limited to two concurrent requests',async()=>{
  const {audio,context}=platform();audio.handle([play(1,0),play(2,1),play(3,2),play(4,3)]);await flush();assert.equal(context.pending.length,2);
  context.finish(0);await flush();assert.equal(context.pending.length,3);assert.equal(audio.snapshot().decoding,2);
  context.finish(1);await flush();context.finish(2);await flush();context.finish(3);await flush();assert.equal(audio.snapshot().decoding,0);
});
test('active decoded buffers stay pinned within the cache budget and can be evicted after stop',async()=>{
  const {audio,context}=platform(6400);audio.handle([play(1,0),play(2,1)]);await flush();context.finish(0);context.finish(1);await flush();
  audio.handle([play(3,2)]);await flush();context.finish(2);await flush();assert.equal(audio.snapshot().voices.length,2);assert.equal(audio.snapshot().bytes,6400);
  audio.handle([{type:'stop',voice:1},play(4,2)]);await flush();context.finish(3);await flush();assert.equal(audio.snapshot().bytes,6400);assert.equal(audio.snapshot().entries,2);
});
test('large decoded metadata is rejected before allocating a decoder buffer',async()=>{
  const {audio,context,bank}=platform();bank.samples.set('0:0',{...bank.samples.get('0:0'),frames:5000000});audio.handle([play(1)]);await flush();
  assert.equal(context.pending.length,0);assert.equal(audio.snapshot().voices.length,0);assert.match(audio.snapshot().warnings[0],/16 MiB/);
});
test('mute/pause and natural hardware completion preserve lifecycle accounting',async()=>{
  const {audio,context}=platform();audio.handle([play(1)]);await flush();context.finish(0);await flush();audio.setEnabled(false);assert.equal(audio.master.gain.value,0);
  audio.setPaused(true);assert.equal(context.state,'suspended');assert.equal(audio.snapshot().voices.length,1);audio.setPaused(false);audio.setEnabled(true);
  context.sources[0].onended();assert.equal(audio.snapshot().voices.length,0);assert.equal(audio.snapshot().counts.ended,1);assert.equal(audio.buffers.values().next().value.refs,0);
});
