import test from 'node:test';
import assert from 'node:assert/strict';
import {CoreThreeRenderer} from '../../src/core/three-renderer.js';

const asset=(id,w=32,h=32,indexed=true,role=null)=>({
  id,width:w,height:h,indexed,role,
  pixels:new Uint8Array(w*h*(indexed?1:4)).fill((id.length*13)%256),
});
function graphics(limit=1024) {
  const g=Object.create(CoreThreeRenderer.prototype);
  g.renderer={capabilities:{maxTextureSize:4096}};
  g.limit=limit;
  g.textureBytes=0;
  g.textureBreakdown={indexed:0,palette:0,rgba:0,video:0};
  g.textures=new Map();
  g.evictedTextures=0;
  g.deferredTextures=0;
  g.recycledTextures=0;
  return g;
}
function close(g){for(const t of g.textures.values())t.dispose();}

test('R8 replaces an inactive same-shape GPU texture object without allocating a new one',()=>{
  const g=graphics();
  try {
    const a=asset('old');
    const b=asset('fresh');
    assert.equal(g.upload(a),true);
    const previous=g.textures.get('old');
    assert.equal(g.upload(b,new Set(['fresh'])),true);
    assert.equal(g.textures.get('fresh'),previous,'GPU texture object is retained');
    assert.equal(g.textures.has('old'),false);
    assert.strictEqual(previous.image.data,b.pixels,'new source pixels reach the same GL allocation');
    assert.equal(g.recycledTextures,1);
    assert.equal(g.evictedTextures,1);
    assert.equal(g.textureBytes,1024);
    assert.equal(g.textureBreakdown.indexed,1024);
    assert.equal(previous.internalFormat,'R8');
  }finally{close(g);}
});

test('never reuse a visible texture or a wrong-sized or wrong-format resource',()=>{
  const g=graphics(2048);
  try {
    assert.equal(g.upload(asset('visible')),true);
    assert.equal(g.upload(asset('palette',256,1,false,'palette')),true);
    const visible=g.textures.get('visible'),palette=g.textures.get('palette');
    assert.equal(g.upload(asset('large',64,64,true),new Set(['visible','palette','large'])),false);
    assert.equal(g.textures.get('visible'),visible);
    assert.equal(g.textures.get('palette'),palette);
    assert.equal(g.recycledTextures,0);
    assert.equal(g.deferredTextures,1);
    assert.equal(g.upload(asset('fresh-32'),new Set(['visible','fresh-32'])),false,
      'same-sized pinned sprite cannot be substituted');
    assert.equal(g.upload(asset('new-pal',256,1,false,'palette'),new Set(['visible','new-pal'])),true,
      'inactive palette can be reused only as a palette');
    assert.equal(g.textures.get('new-pal'),palette);
    assert.equal(g.textures.get('visible'),visible);
    assert.equal(g.recycledTextures,1);
    assert.equal(g.textureBytes,2048);
  }finally{close(g);}
});

test('nonmatching R8 dimensions fall back to bounded eviction, never drawing different-sized art',()=>{
  const g=graphics(1024);
  try {
    assert.equal(g.upload(asset('old',32,32)),true);
    assert.equal(g.upload(asset('incoming',16,64)),true);
    assert.equal(g.textures.get('incoming').image.width,16);
    assert.equal(g.textures.get('incoming').image.height,64);
    assert.equal(g.recycledTextures,0);
    assert.equal(g.evictedTextures,1);
    assert.equal(g.textureBytes,1024);
  }finally{close(g);}
});
