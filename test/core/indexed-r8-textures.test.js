import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {RedFormat, RGBAFormat, NearestFilter, NoColorSpace} from 'three';
import {CoreThreeRenderer} from '../../src/core/three-renderer.js';

function graphics(limit = 128 * 1024) {
  // Exercise real Three DataTexture properties without requiring a GPU.
  const renderer = Object.create(CoreThreeRenderer.prototype);
  renderer.renderer = {capabilities: {maxTextureSize: 4096}};
  renderer.limit = limit;
  renderer.textureBytes = 0;
  renderer.textures = new Map();
  renderer.evictedTextures = 0;
  renderer.deferredTextures = 0;
  return renderer;
}
function asset(id, width, height, indexed = false, role = undefined) {
  return {id, width, height, indexed, role,
    pixels: new Uint8Array(width * height * (indexed ? 1 : 4))};
}
function close(g) { for (const texture of g.textures.values()) texture.dispose(); }

test('R8 indexed pixels are explicit, unfiltered, and row-aligned for widths not divisible by four', () => {
  const g = graphics();
  try {
    const indexed = asset('fighter-odd-width', 7, 9, true);
    assert.equal(g.upload(indexed), true);
    const texture = g.textures.get(indexed.id);
    assert.equal(texture.format, RedFormat);
    assert.equal(texture.internalFormat, 'R8');
    assert.equal(texture.colorSpace, NoColorSpace);
    assert.equal(texture.minFilter, NearestFilter);
    assert.equal(texture.magFilter, NearestFilter);
    assert.equal(texture.unpackAlignment, 1);
    assert.equal(texture.generateMipmaps, false);
    assert.equal(texture.userData.kind, 'indexed8');
    assert.equal(texture.userData.residentBytes, 63);
    assert.equal(g.textureBreakdown.indexed, 63);
    assert.equal(g.textureBytes, 63);
  } finally { close(g); }
});

test('palette assets remain exact 256x1 RGBA8 and are separate from indices', () => {
  const g = graphics();
  try {
    const palette = asset('1:pal:1,1', 256, 1, false, 'palette');
    const truecolor = asset('stage-rgba', 5, 4);
    assert.equal(g.upload(palette), true);
    assert.equal(g.upload(truecolor), true);
    const pal = g.textures.get(palette.id);
    assert.equal(pal.format, RGBAFormat);
    assert.equal(pal.internalFormat, 'RGBA8');
    assert.equal(pal.colorSpace, NoColorSpace);
    assert.equal(pal.userData.kind, 'palette');
    assert.equal(g.textures.get(truecolor.id).userData.kind, 'rgba8');
    assert.equal(g.textureBreakdown.palette, 1024);
    assert.equal(g.textureBreakdown.rgba, 80);
    assert.throws(() => g.upload(asset('bad-palette', 256, 2, false, 'palette')),
      /256x1 RGBA8/);
    assert.throws(() => g.upload(asset('bad-indexed-palette', 256, 1, true, 'palette')),
      /Invalid GPU asset dimensions|256x1 RGBA8/);
  } finally { close(g); }
});

test('indexed draws require their matching palette; never sample white or wrong texture format', () => {
  const g = graphics();
  try {
    g.upload(asset('@white', 1, 1));
    g.upload(asset('fighter', 16, 16, true));
    g.upload(asset('wrong-format', 256, 1));
    const draw = {texture: 'fighter', indexed: true, palette: 'missing'};
    assert.equal(g.resolveDrawTextures(draw), null);
    assert.equal(g.resolveDrawTextures({...draw, palette: '@white'}), null);
    assert.equal(g.resolveDrawTextures({...draw, palette: 'wrong-format'}), null);
    g.upload(asset('fighter-palette', 256, 1, false, 'palette'));
    const binding = g.resolveDrawTextures({...draw, palette: 'fighter-palette'});
    assert.equal(binding?.image, g.textures.get('fighter'));
    assert.equal(binding?.palette, g.textures.get('fighter-palette'));
    assert.equal(g.resolveDrawTextures({texture:'fighter',indexed:false}), null);
    assert.equal(g.resolveDrawTextures({texture:'@white',indexed:false})?.image,
      g.textures.get('@white'));
  } finally { close(g); }
});

test('R8 residency accounting survives LRU eviction without charging RGBA expansion', () => {
  const g = graphics(2048);
  try {
    assert.equal(g.upload(asset('old-indexed', 32, 32, true)), true);
    assert.equal(g.upload(asset('active-indexed', 32, 32, true),
      new Set(['active-indexed'])), true);
    assert.equal(g.textureBreakdown.indexed, 2048);
    assert.equal(g.upload(asset('new-indexed', 32, 32, true),
      new Set(['active-indexed','new-indexed'])), true);
    assert.equal(g.textures.has('old-indexed'), false);
    assert.equal(g.textures.has('active-indexed'), true);
    assert.equal(g.textureBreakdown.indexed, 2048);
    assert.equal(g.textureBytes, 2048);
    assert.equal(g.evictedTextures, 1);
  } finally { close(g); }
});

test('the indexed shader performs exact integer palette fetch with mask-zero support', () => {
  const source = readFileSync(new URL('../../src/core/three-renderer.js', import.meta.url), 'utf8');
  assert.match(source, /texelFetch\(palette,ivec2\(i,0\),0\)/);
  assert.match(source, /if\(i==0&&maskZero\)discard/);
  assert.match(source, /if\(i==0\)color\.a=1\./);
});
