import {test} from 'node:test';
import assert from 'node:assert/strict';
import {PCMQueue} from '../src/pcm-worklet.js';

test('PCM pool reuses three stereo blocks through many output quanta',()=>{
 const owned=new Set();let sequence=0;
 const q=new PCMQueue(buffer=>{owned.add(buffer);const pcm=new Float32Array(buffer);for(let i=0;i<1024;i++){pcm[i*2]=.25;pcm[i*2+1]=-.5;}sequence++;q.push(buffer);},48000,48000);
 q.start();const left=new Float32Array(128),right=new Float32Array(128);
 for(let i=0;i<200;i++){q.render(left,right);assert.equal(left[127],.25);assert.equal(right[127],-.5);}
 assert.equal(owned.size,3);assert.ok(sequence>20);assert.equal(q.underruns,0);assert.equal(q.frames,25600);assert.equal(q.queue.length,3);
});
test('PCM resampling keeps fractional position across block boundaries',()=>{
 let frame=0;const q=new PCMQueue(buffer=>{const a=new Float32Array(buffer);for(let i=0;i<1024;i++){a[i*2]=frame/10000;a[i*2+1]=-frame/10000;frame++;}q.push(buffer);},44100,48000);
 q.start();const left=new Float32Array(128),right=new Float32Array(128);let sample=0;
 for(let n=0;n<30;n++){q.render(left,right);for(let i=0;i<128;i++,sample++){assert.ok(Math.abs(left[i]-sample*44100/48000/10000)<1e-6);assert.equal(right[i],-left[i]);}}
});
test('PCM underflow emits silence and waits for enough data before restarting',()=>{
 const requests=[],q=new PCMQueue(buffer=>requests.push(buffer),48000,48000);q.start();
 const left=new Float32Array(128),right=new Float32Array(128);q.render(left,right);assert.equal(q.frames,0);
 for(let n=0;n<2;n++){const b=requests.shift();new Float32Array(b).fill(.5);q.push(b);}
 for(let n=0;n<17;n++)q.render(left,right);assert.equal(q.underruns,1);assert.ok(left.every(x=>x===0));
 for(let n=0;n<2;n++){const b=requests.shift();new Float32Array(b).fill(.25);q.push(b);}
 q.render(left,right);assert.ok(left.every(x=>x===.25));assert.equal(q.underruns,1);
});
test('PCM rejects a malformed source block',()=>{
 const q=new PCMQueue(()=>{},48000,48000);assert.throws(()=>q.push(new ArrayBuffer(4)),/Invalid PCM/);
});
