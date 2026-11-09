import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {supportedControllers} from '../../src/runtime.js';

const snapshot=JSON.parse(readFileSync(new URL('../fixtures/core/rare-akuma-inventory.json',import.meta.url)));
test('Rare Akuma controller vocabulary remains supported by independent Core',()=>{
  assert.equal(snapshot.controllerTypes.length,60);
  assert.deepEqual(snapshot.controllerTypes.filter(type=>!supportedControllers.has(type)),[]);
});
test('Rare Akuma asset-free inventory explicitly separates authored data from engine parity',()=>{
  assert.equal(snapshot.authoredStates,137);
  assert.equal(snapshot.helperStateIds.length,24);
  assert.equal(snapshot.helperSpawnControllers,45);
  assert.equal(snapshot.airActionDefinitions,309);
  assert.equal(snapshot.uniqueAirActionIds,307);
  assert.equal(snapshot.sffSpriteEntries,872);
  assert.equal(snapshot.sourceAssetNotRedistributed,true);
});
