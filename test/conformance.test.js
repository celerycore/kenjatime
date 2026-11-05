import {test} from 'node:test';
import assert from 'node:assert/strict';
import {compareTrace} from '../src/conformance.js';

test('trace comparison accepts explicit captured fields and floating-point tolerance',()=>{
  const actual=[{tick:1,player:{life:1000,pos:{x:1.0000001,y:0},stateNo:20},contacts:[]}];
  assert.equal(compareTrace(actual,[{tick:1,player:{pos:{x:1}}}]).matched,true);
  assert.equal(compareTrace(actual,[{tick:1,contacts:[]}]).matched,true);
});
test('trace comparison identifies timing, numeric and missing-field mismatches',()=>{
  const result=compareTrace([{tick:1,player:{life:900}}],[{tick:1,player:{life:1000,stateNo:0}},{tick:2,contacts:[]}]);
  assert.equal(result.matched,false);assert.deepEqual(result.differences.map(item=>item.path),['player.life','player.stateNo','tick']);assert.equal(result.comparedSamples,2);
});
test('trace comparison rejects empty, duplicate, invalid and non-finite reference captures',()=>{
  for(const baseline of [[],[{tick:1}],[{tick:1,player:{}}],[{tick:1,player:{life:NaN}}],[{tick:1,player:{}},{tick:1,player:{}}],[{tick:-1,player:{}}]])assert.throws(()=>compareTrace([{tick:1,player:{}}],baseline));
  assert.throws(()=>compareTrace([{tick:1},{tick:1}],[{tick:1,contacts:[]}]))
  assert.equal(compareTrace([{tick:1,player:{life:NaN}}],[{tick:1,player:{life:1000}}]).matched,false);
});
