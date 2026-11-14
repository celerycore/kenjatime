import test from 'node:test';
import assert from 'node:assert/strict';
import {CoreThreeRenderer} from '../../src/core/three-renderer.js';

function graphics(limit) {
  // Exercise the production texture lifecycle with real Three Texture and
  // DataTexture objects. No device WebGL context is required for these cases.
  const g = Object.create(CoreThreeRenderer.prototype);
  g.renderer = {
    capabilities: {maxTextureSize: 4096},
    initTexture() {},
  };
  g.limit = limit;
  g.textureBytes = 0;
  g.textureBreakdown = {indexed: 0, palette: 0, rgba: 0, video: 0};
  g.textures = new Map();
  g.evictedTextures = 0;
  g.deferredTextures = 0;
  return g;
}

function indexed(id, width=32, height=32) {
  return {id, width, height, indexed: true,
    pixels: new Uint8Array(width*height)};
}

function bitmap(width=16, height=16) {
  const result = {width, height, closes: 0, close() { this.closes++; }};
  return result;
}

function dispose(g) {
  for (const texture of g.textures.values()) texture.dispose();
}

test('a stage-video frame reclaims inactive R8 sprites without evicting visible art', () => {
  const g=graphics(2048);
  try {
    assert.equal(g.upload(indexed('old-fighter')),true);
    assert.equal(g.upload(indexed('visible-fighter')),true);
    g.activeTextureIds=new Set(['visible-fighter']);
    const frame=bitmap();
    assert.equal(g.updateVideo({id:'stage:video',bitmap:frame,filter:'linear'}),true);
    assert.equal(frame.closes,1,'transferred frame must be closed after upload');
    assert.equal(g.textures.has('old-fighter'),false);
    assert.equal(g.textures.has('visible-fighter'),true);
    assert.equal(g.textures.get('stage:video').userData.kind,'video');
    assert.equal(g.evictedTextures,1);
    assert.equal(g.textureBytes,2048);
    assert.equal(g.textureBreakdown.indexed,1024);
    assert.equal(g.textureBreakdown.video,1024);
  } finally {dispose(g);}
});

test('replacing a video texture charges only the size delta, not a second frame', () => {
  const g=graphics(4096);
  try {
    for (const [width,height,bytes] of [
      [16,16,1024], [16,32,2048], [8,8,256], [8,8,256],
    ]) {
      const frame=bitmap(width,height);
      assert.equal(g.updateVideo({id:'stage:video',bitmap:frame}),true);
      assert.equal(frame.closes,1);
      assert.equal(g.textureBytes,bytes);
      assert.equal(g.textureBreakdown.video,bytes);
    }
    assert.equal(g.textures.size,1);
    assert.equal(g.videoUploads,4);
    assert.equal(g.evictedTextures,0);
  } finally {dispose(g);}
});

test('over-budget video frame is deferred without deleting visible sprites or throwing', () => {
  const g=graphics(1536);
  try {
    assert.equal(g.upload(indexed('visible-fighter')),true);
    g.activeTextureIds=new Set(['visible-fighter']);
    const frame=bitmap();
    assert.equal(g.updateVideo({id:'stage:video',bitmap:frame}),false);
    assert.equal(frame.closes,1);
    assert.equal(g.deferredVideoFrames,1);
    assert.equal(g.textureBytes,1024);
    assert.equal(g.textureBreakdown.video,0);
    assert.equal(g.textures.has('visible-fighter'),true);
    assert.equal(g.textures.has('stage:video'),false);
    assert.equal(g.evictedTextures,0);
    // As soon as the fighter is no longer visible, a later video frame
    // succeeds without restarting combat or permanently failing that source.
    g.activeTextureIds = new Set();
    const retry=bitmap();
    assert.equal(g.updateVideo({id:'stage:video',bitmap:retry}),true);
    assert.equal(retry.closes,1);
    assert.equal(g.textures.has('visible-fighter'),false);
    assert.equal(g.textures.has('stage:video'),true);
    assert.equal(g.deferredVideoFrames,1);
  } finally {dispose(g);}
});

test('a new sprite may evict an inactive video, with both GPU counters reconciled', () => {
  const g=graphics(2048);
  try {
    assert.equal(g.updateVideo({id:'unused-video',bitmap:bitmap()}),true);
    assert.equal(g.upload(indexed('visible-fighter')),true);
    assert.equal(g.upload(indexed('next-fighter'),
      new Set(['visible-fighter','next-fighter'])),true);
    assert.equal(g.textures.has('unused-video'),false);
    assert.equal(g.textures.has('visible-fighter'),true);
    assert.equal(g.textureBreakdown.video,0);
    assert.equal(g.textureBreakdown.indexed,2048);
    assert.equal(g.textureBytes,2048);
  } finally {dispose(g);}
});

test('video frames cannot overwrite indexed sprite identity; invalid frames still close', () => {
  const g=graphics(4096);
  try {
    assert.equal(g.upload(indexed('collision')),true);
    const collision=bitmap();
    assert.throws(()=>g.updateVideo({id:'collision',bitmap:collision}),
      /conflicts with an existing sprite/);
    assert.equal(collision.closes,1);
    const malformed=bitmap(1281,720);
    assert.throws(()=>g.updateVideo({id:'large',bitmap:malformed}),
      /Invalid stage video frame dimensions/);
    assert.equal(malformed.closes,1);
    assert.equal(g.textureBytes,1024);
  } finally {dispose(g);}
});
