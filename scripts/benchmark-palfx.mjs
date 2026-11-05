import {performance} from 'node:perf_hooks';
import {writeFileSync} from 'node:fs';
import {transformRgba} from '../src/effects.js';
import {referencePalFx} from '../test/fixtures/palfx-reference.js';

const pixels=Uint8Array.from({length:1024*512*4},(_,i)=>(i*73+31)%256);
const palette={layers:[{color:160,age:17,add:[20,-10,5],mul:[200,240,256],sinadd:[30,20,10,60],invertall:1},{color:213,age:23,add:[-12,8,30],mul:[256,160,288],postadd:[1.5,-2,3]}]};
const expected=referencePalFx(pixels,palette),actual=transformRgba(pixels,palette);
if(expected.some((v,i)=>v!==actual[i]))throw Error('Palette pixels differ.');
const before=[],after=[];
for(let i=0;i<5;i++)for(const [fn,samples]of [[referencePalFx,before],[transformRgba,after]]){const start=performance.now();fn(pixels,palette);samples.push(performance.now()-start);}
const median=v=>[...v].sort((a,b)=>a-b)[Math.floor(v.length/2)];
const result={scope:'Node/V8 CPU transform of 524,288 RGBA pixels with two PalFX layers; not browser/physical FPS.',beforeMs:median(before),afterMs:median(after),speedup:median(before)/median(after),maxChannelDifference:0,samples:{before,after}};
writeFileSync('work/palfx-performance21.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
