import test from 'node:test';
import assert from 'node:assert/strict';
import {FrameClock} from '../../src/frame-clock.js';
import {
  normalizeQuality,nextQuality,qualityLabel,qualityStartingScale,
  R8_PERFORMANCE_SCALE,
} from '../../src/core/render-quality.js';

test('Visual presets cycle Auto / Performance / Sharp and normalize unknown values',()=>{
  assert.equal(nextQuality('auto'),'performance');
  assert.equal(nextQuality('performance'),'sharp');
  assert.equal(nextQuality('sharp'),'auto');
  assert.equal(nextQuality('garbage'),'performance');
  assert.equal(qualityLabel('performance'),'Performance');
  assert.equal(normalizeQuality('garbage'),'auto');
});
test('R8 Performance reduces framebuffer pixels without changing game input/timing',()=>{
  assert.equal(R8_PERFORMANCE_SCALE,0.7);
  assert.equal(qualityStartingScale('auto'),1);
  assert.equal(qualityStartingScale('sharp'),1);
  assert.equal(qualityStartingScale('performance'),0.7);
  assert.equal(Math.round(960*qualityStartingScale('performance')),672);
  assert.equal(Math.round(540*qualityStartingScale('performance')),378);
  for(const preset of ['auto','sharp','performance']){
    const clock=new FrameClock();let ticks=0;
    for(let n=0;n<=60;n++)
      clock.advance(n*1000/60,{},()=>ticks++);
    assert.equal(ticks,60,`${preset} must retain 60 deterministic ticks`);
  }
});
