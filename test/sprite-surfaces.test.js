import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createSpriteSurface,spritePalette} from '../src/sprite-surfaces.js';
import {transformRgba} from '../src/effects.js';

function fixture({indexed=true}={}){
  const pixels=[255,0,255,0,40,100,200,128],remapped=[255,0,255,0,200,100,40,128];
  const bank={version:2,sprites:[{palette:0,length:8}],palettes:[{group:1,number:1}],reads:0,
    decode(){this.reads++;return{w:2,h:1,x:1,y:1,palette:0,rgba:new Uint8ClampedArray(pixels),...(indexed?{indices:new Uint8Array([0,1])}:{})};},
    decodeWithPalette(index,g,n){if(g!==1||n!==2)throw Error('Missing palette');return{...this.decode(index),rgba:new Uint8ClampedArray(remapped)};}};
  const createCanvas=()=>({width:0,height:0,getContext(){return{putImageData:image=>{this.uploaded=new Uint8ClampedArray(image.data);}};}});
  const options={key:'sprite',createCanvas,createImageData:(data,width,height)=>({data,width,height})};return{bank,options,pixels,remapped};
}

test('Surface pixels remain correct when the decoded bank cache is rebuilt between reads',()=>{
  const {bank,options,pixels}=fixture(),sp=createSpriteSurface(bank,0,options);
  assert.deepEqual([...sp.canvas.uploaded],pixels);assert.deepEqual([...sp.rgba],pixels);
  assert.deepEqual([...transformRgba(sp.rgba,{layers:[{mul:[256,0,256]}]})],[255,0,255,0,40,0,200,128]);
  assert.deepEqual([...sp.canvas.uploaded],pixels);
});

test('Opaque indexed backgrounds restore palette-zero coverage without changing other alpha values',()=>{
  const {bank,options}=fixture(),sp=createSpriteSurface(bank,0,{...options,opaque:true});
  assert.deepEqual([...sp.canvas.uploaded],[255,0,255,255,40,100,200,128]);assert.deepEqual([...sp.rgba],[255,0,255,255,40,100,200,128]);
  const masked=createSpriteSurface(bank,0,options);assert.equal(masked.canvas.uploaded[3],0);
});

test('True-color backgrounds preserve their original alpha when opaque indexed mode is requested',()=>{
  const {bank,options,pixels}=fixture({indexed:false}),sp=createSpriteSurface(bank,0,{...options,opaque:true});assert.deepEqual([...sp.canvas.uploaded],pixels);
});

test('Surface palette selection remains independent of later bank decode-cache eviction',()=>{
  const {bank,options,remapped}=fixture(),sp=createSpriteSurface(bank,0,{...options,remap:[1,2]});
  bank.decode(0);assert.deepEqual([...sp.canvas.uploaded],remapped);assert.deepEqual([...sp.rgba],remapped);
});

test('An unavailable remapped palette reports once and retains the original colors for later PalFX',()=>{
  const {bank,options,pixels}=fixture(),errors=[],sp=createSpriteSurface(bank,0,{...options,remap:[1,99],onPaletteError:e=>errors.push(e.message)});
  assert.deepEqual([...sp.rgba],pixels);assert.deepEqual([...sp.rgba],pixels);assert.equal(errors.length,1);
});

test('Linked legacy sprites resolve their source palette before any pixel decompression',()=>{
  const bank={sprites:[{length:0,link:1},{length:10,palette:0}],palettes:[{group:1,number:1}]};
  assert.deepEqual(spritePalette(bank,0),{group:1,number:1});bank.sprites[1]={length:0,link:0};assert.equal(spritePalette(bank,0),undefined);
});
