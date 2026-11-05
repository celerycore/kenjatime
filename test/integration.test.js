import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {archive, decodeText} from '../src/formats.js';
import {CommandBuffer, parseCommands} from '../src/commands.js';
import {COMMON_STATES} from '../src/common.js';
import {TrainingMatch} from '../src/combat.js';

// Exercise the supplied, unmodified character through the actual import,
// command, script, animation and collision pipeline used by the browser.
const [kfm] = archive(new Uint8Array(readFileSync(new URL('../public/kfm.zip', import.meta.url))));
const cmdPath = kfm.checks.find(check => check.key === 'cmd' && check.ok).path;
const commands = parseCommands(decodeText(kfm.files[cmdPath]));

function training(options = {}) {
  const match = new TrainingMatch(kfm, {commonText: COMMON_STATES, ...options});
  const input = new CommandBuffer(commands);
  return {
    match,
    input,
    step(keys = []) { return match.tick(input.update(new Set(keys), match.player.facing)); },
  };
}

function unexpectedDiagnostics(match) {
  return match.diagnostics.filter(item => ['missing-state', 'missing-animation', 'state-loop', 'controller'].includes(item.type));
}

test('real KFM walks through common state20 and returns to idle when input is released', () => {
  const {match, step} = training();
  const start = match.player.pos.x;
  step(['R']);
  assert.equal(match.player.stateNo, 20);
  assert.equal(match.player.anim, 20);
  assert.ok(match.player.pos.x > start);
  for (let i = 0; i < 14; i++) step(['R']);
  assert.equal(match.player.vel.x, Math.fround(match.player.constant('velocity.walk.fwd.x')));
  step();
  assert.equal(match.player.stateNo, 0);
  assert.equal(match.player.anim, 0);
  for (let i = 0; i < 120; i++) step();
  assert.equal(match.player.stateNo, 0);
  assert.ok(Math.abs(match.player.vel.x) < 1e-6);
  assert.equal(match.player.pos.y, 0);
  assert.equal(match.opponent.life, match.opponent.maxLife);
  assert.deepEqual(unexpectedDiagnostics(match), []);
});

test('real KFM jump executes startup, airborne and landing states before regaining control', () => {
  const {match, step} = training();
  step(['U']);
  assert.equal(match.player.stateNo, 40);
  const visited = new Set([match.player.stateNo]);
  let highest = match.player.pos.y;
  for (let i = 0; i < 120; i++) {
    step();
    visited.add(match.player.stateNo);
    highest = Math.min(highest, match.player.pos.y);
    assert.ok(Number.isFinite(match.player.pos.y));
  }
  for (const state of [40, 50, 52, 0]) assert.ok(visited.has(state), `Jump never reached state ${state}`);
  assert.ok(highest < -50, `Jump only reached y=${highest}`);
  assert.equal(match.player.stateNo, 0);
  assert.equal(match.player.pos.y, 0);
  assert.equal(match.player.vel.y, 0);
  assert.equal(match.player.ctrl, 1);
  assert.deepEqual(unexpectedDiagnostics(match), []);
});

test('real KFM x input executes state200 HitDef and AIR collision for one 23-damage punch', () => {
  const {match, step} = training();
  match.player.pos.x = -15;
  match.opponent.pos.x = 15;
  const initialLife = match.opponent.life;
  const contacts = [];
  const activations = [];
  contacts.push(...step(['x']));
  assert.equal(match.player.stateNo, 200);
  assert.equal(match.player.anim, 200);
  assert.equal(match.opponent.life, initialLife, 'Punch dealt damage before its active animation element');
  for (let i = 0; i < 90; i++) {
    contacts.push(...step());
    activations.push(...match.player.events.filter(event => event.type === 'hitdef'));
  }
  assert.equal(activations.length, 1);
  assert.deepEqual(activations[0].hitDef.damage, [23, 0]);
  assert.equal(contacts.length, 1);
  assert.equal(contacts[0].type, 'hit');
  assert.equal(contacts[0].damage, 23);
  assert.equal(contacts[0].hitDef.source, 'kfm/kfm.cns');
  assert.equal(match.opponent.life, initialLife - 23);
  assert.equal(match.player.stateNo, 0);
  assert.equal(match.opponent.stateNo, 0);
  assert.equal(match.opponent.ctrl, 1);
  assert.deepEqual(unexpectedDiagnostics(match), []);
});

test('a distant real KFM punch executes its HitDef without proximity-based damage', () => {
  const {match, step} = training();
  const initialLife = match.opponent.life;
  step(['x']);
  let activated = false;
  for (let i = 0; i < 50; i++) {
    assert.deepEqual(step(), []);
    activated ||= match.player.events.some(event => event.type === 'hitdef');
  }
  assert.ok(activated);
  assert.equal(match.opponent.life, initialLife);
});

test('real KFM quarter-circle motion enters special state1000 ahead of its single x command', () => {
  const {match, input, step} = training();
  for (const keys of [['D'], ['D', 'R'], ['R']]) step(keys);
  step(['R', 'x']);
  assert.ok(input.active.has('QCF_x'));
  assert.ok(input.active.has('x'));
  assert.equal(match.player.stateNo, 1000);
  assert.equal(match.player.anim, 1000);
  assert.equal(match.player.ctrl, 0);
  for (let i = 0; i < 90; i++) step();
  assert.equal(match.player.stateNo, 0);
  assert.equal(match.player.ctrl, 1);
  assert.deepEqual(unexpectedDiagnostics(match), []);
});

test('real KFM quarter-circle motion mirrors through CMD and script execution while facing left', () => {
  const {match, input, step} = training();
  match.player.pos.x = 70;
  match.opponent.pos.x = -70;
  match.player.facing = -1;
  match.opponent.facing = 1;
  for (const keys of [['D'], ['D', 'L'], ['L'], ['L', 'x']]) step(keys);
  assert.ok(input.active.has('QCF_x'));
  assert.equal(match.player.stateNo, 1000);
  assert.equal(match.player.facing, -1);
});

test('real KFM no longer reports implemented controller families as unsupported', () => {
  const {match} = training();
  assert.equal(match.ticks, 0);
  assert.equal(match.player.stateNo, 0);
  assert.equal(match.player.time, 0);
  for (const type of ['helper','projectile','pause','superpause','afterimage','reversaldef','targetstate','changeanim2']) {
    const diagnostic = match.diagnostics.find(item => item.type === 'unsupported-controller' && item.name === type);
    assert.equal(diagnostic,undefined,`${type} is implemented`);
  }
});

test('real KFM throw binds, deals scripted throw damage and restores victim state ownership',()=>{
  const {match}=training();match.player.pos.x=-15;match.opponent.pos.x=15;
  const visited=new Set();match.tick(new Set(['y','holdfwd']));
  for(let i=0;i<240;i++){match.tick();visited.add(match.opponent.stateNo);}
  assert.ok(visited.has(820),'Victim did not reach thrown state820');
  assert.ok(visited.has(821),'Victim did not reach throw-release state821');
  assert.equal(match.opponent.life,922);assert.equal(match.opponent.stateOwner,match.opponent);
  assert.equal(match.player.stateNo,0);assert.equal(match.opponent.stateNo,0);
});
