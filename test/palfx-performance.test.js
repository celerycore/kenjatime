import {test} from 'node:test';
import assert from 'node:assert/strict';
import {transformRgba} from '../src/effects.js';

import {referencePalFx} from './fixtures/palfx-reference.js';

test('Prepared PalFX preserves layered fractional color, sine, inversion, clamping and alpha exactly',()=>{
  const input=Uint8Array.from({length:4096},(_,i)=>(i*73+31)%256);
  for(const age of [0,1,17,37,89])for(const color of [0,91,256]){
    const palette={layers:[{color,age,add:[-71,8,91],mul:[512,255,63],sinadd:[23,-71,2,-60],postadd:[1.25,-3.75,2.125],invertall:age%2},{color:183,age:age+5,add:[17,-31,8],mul:[192,320,256],sinadd:[9,7,-8,37]}]};
    assert.deepEqual(transformRgba(input,palette),referencePalFx(input,palette));
  }
});

test('Transparent pixels, empty effects and legacy partial parameter arrays retain their existing output',()=>{
  const input=new Uint8Array([255,0,255,0,40,80,120,128,255,255,255,255]);
  for(const palette of [null,{layers:[]},{add:[2],mul:[128]},{layers:[{invertall:1},{sinadd:[30,20,10,0]}]}])assert.deepEqual(transformRgba(input,palette),referencePalFx(input,palette));
});
