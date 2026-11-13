import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {packageFiles} from '../../src/formats.js';
import {CoreSession} from '../../src/core/session.js';

const kfm = () => packageFiles(readFileSync(new URL('../../public/kfm.zip', import.meta.url)));

test('R8 player snapshots expose CPU mode and control without changing AI semantics', () => {
  const session = new CoreSession(kfm(), {mode: 'cpu', level: 6});
  try {
    const first = session.snapshot().players;
    assert.equal(first.length, 2);
    assert.deepEqual(first.map(p => p.aiLevel), [6, 6]);
    assert.deepEqual(first.map(p => p.cpuMode), ['generic', 'generic']);
    for (const p of first) {
      assert.equal(typeof p.ctrl, 'number');
      assert.equal(typeof p.stateTime, 'number');
      assert.equal(typeof p.velX, 'number');
      assert.equal(typeof p.velY, 'number');
      assert.equal(typeof p.cpuRawInput, 'string');
      assert.equal(typeof p.cpuMatchedCommands, 'number');
      assert.equal(typeof p.controllerDiagnostics, 'number');
      assert.equal(p.legacyAIFlag, null);
      assert.equal(p.legacyAIValue, null);
    }
    for (let i = 0; i < 330; i++) session.tick();
    const late = session.snapshot().players;
    assert.ok(late.some(p => p.cpuLastCommand.length > 0), 'CPU command planner should be observable');
    assert.ok(late.every(p => p.cpuMode === 'generic'));
  } finally { session.close(); }
});

test('R8 snapshot distinguishes Player vs CPU from CPU vs CPU for idle-character reports', () => {
  const session = new CoreSession(kfm(), {mode: 'solo', level: 5});
  try {
    const [player, opponent] = session.snapshot().players;
    assert.equal(player.aiLevel, 0);
    assert.equal(player.cpuMode, 'human');
    assert.equal(player.cpuLastCommand, '');
    assert.equal(opponent.aiLevel, 5);
    assert.equal(opponent.cpuMode, 'generic');
  } finally { session.close(); }
});
