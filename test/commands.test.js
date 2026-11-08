import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { unzipSync } from 'fflate';
import { parseCommands, CommandBuffer } from '../src/commands.js';

function buffer(command, options = '') {
  return new CommandBuffer(parseCommands(`[Command]\nname = "move"\ncommand = ${command}\n${options}`));
}
const input = (engine, keys = [], facing = 1) => engine.update(new Set(keys), facing);

test('preserves duplicate alternatives, case-sensitive names, defaults, comments and BOM', () => {
  const parsed = parseCommands('\uFEFF[Defaults]\ncommand.time = 20\ncommand.buffer.time = 4\n[Command]\nname="Move;One" ; comment\ncommand=x\n[Command]\nname="move;one"\ncommand=y\ntime=5');
  assert.equal(parsed.commands.length, 2);
  assert.equal(parsed.commands[0].name, 'Move;One');
  assert.equal(parsed.commands[0].time, 20);
  assert.equal(parsed.commands[0].bufferTime, 4);
  assert.equal(parsed.commands[1].time, 5);
  assert.deepEqual(parsed.diagnostics, []);
});

test('bundled KFM command definitions all parse without unsupported input forms', () => {
  const zip = unzipSync(new Uint8Array(readFileSync(new URL('../public/kfm.zip', import.meta.url))));
  const parsed = parseCommands(new TextDecoder().decode(zip['kfm/kfm.cmd']));
  assert.ok(parsed.commands.length > 30);
  assert.deepEqual(parsed.diagnostics, []);
});

test('single button commands trigger on presses and respect exact buffer duration', () => {
  const engine = buffer('x', 'buffer.time = 3');
  assert.ok(input(engine, ['x']).has('move'));
  assert.ok(input(engine, ['x']).has('move'));
  assert.ok(input(engine, []).has('move'));
  assert.ok(!input(engine, []).has('move'));
  assert.ok(input(engine, ['x']).has('move'));
});

test('hold-only commands ignore buffering and tolerate diagonal directions only with $', () => {
  const held = buffer('/$D', 'buffer.time = 30');
  assert.ok(input(held, ['D', 'R']).has('move'));
  assert.ok(input(held, ['D']).has('move'));
  assert.ok(!input(held, []).has('move'));
  const exact = buffer('/D');
  assert.ok(!input(exact, ['D', 'R']).has('move'));
  assert.ok(input(exact, ['D']).has('move'));
});

test('quarter circle sequence recognizes release and next direction on the same tick', () => {
  const engine = buffer('~D, DF, F, x');
  input(engine, ['D']);
  input(engine, ['D', 'R']);
  input(engine, ['R']);
  assert.ok(input(engine, ['R', 'x']).has('move'));
  assert.ok(!input(engine, ['R', 'x']).has('move'));
  const absent = buffer('~D, DF, F, x');
  input(absent, ['R']);
  assert.ok(!input(absent, ['R', 'x']).has('move'));
});

test('relative directions use player facing and reject opposite motions', () => {
  const engine = buffer('D, DF, F, x');
  input(engine, ['D'], -1);
  input(engine, ['D', 'L'], -1);
  input(engine, ['L'], -1);
  assert.ok(input(engine, ['L', 'x'], -1).has('move'));
  const wrong = buffer('D, DF, F, x');
  input(wrong, ['D']);
  input(wrong, ['D', 'L']);
  input(wrong, ['L']);
  assert.ok(!input(wrong, ['L', 'x']).has('move'));
});

test('simultaneous button combinations require all button edges on the same tick', () => {
  const engine = buffer('x+y');
  input(engine, ['x']);
  assert.ok(!input(engine, ['x', 'y']).has('move'));
  input(engine, []);
  assert.ok(input(engine, ['x', 'y']).has('move'));
});

test('direction and button chords accept a held direction and a fresh button press', () => {
  const engine = buffer('F+x');
  input(engine, ['R']);
  assert.ok(input(engine, ['R', 'x']).has('move'));
  assert.ok(!input(engine, ['R', 'x']).has('move'));
  input(engine, ['R']);
  assert.ok(input(engine, ['R', 'x']).has('move'));
  const wrong = buffer('F+x');
  assert.ok(!input(wrong, ['L', 'x']).has('move'));
  const heldButton = buffer('F+x');
  input(heldButton, ['x']);
  assert.ok(!input(heldButton, ['R', 'x']).has('move'));
});

test('chords respect facing, tolerant directions, holds, remapping and strict sequences', () => {
  const mirrored = buffer('x+F');
  input(mirrored, ['L'], -1);
  assert.ok(input(mirrored, ['L', 'x'], -1).has('move'));
  assert.ok(!input(buffer('F+x'), ['D', 'R', 'x']).has('move'));
  assert.ok(input(buffer('$F+x'), ['D', 'R', 'x']).has('move'));
  const held = buffer('/$F+x');
  assert.ok(input(held, ['D', 'R', 'x']).has('move'));
  assert.ok(input(held, ['R', 'x']).has('move'));
  assert.ok(!input(held, ['R']).has('move'));
  const mapped = new CommandBuffer(parseCommands('[Remap]\na=x\nx=\n[Command]\nname="move"\ncommand=F+x'));
  assert.ok(!input(mapped, ['R', 'x']).has('move'));
  assert.ok(input(mapped, ['R', 'a']).has('move'));
  const clean = buffer('a, >F+x');
  input(clean, ['a']);
  assert.ok(input(clean, ['a', 'R', 'x']).has('move'));
  const dirty = buffer('a, >F+x');
  input(dirty, ['a']);
  assert.ok(!input(dirty, ['a', 'R', 'x', 'y']).has('move'));
});

test('a hold prefix must still be held when the final button is pressed', () => {
  const engine = buffer('/$D, a');
  input(engine, ['D']);
  assert.ok(input(engine, ['D', 'R', 'a']).has('move'));
  input(engine, ['D']);
  input(engine, []);
  assert.ok(!input(engine, ['a']).has('move'));
});

test('charged releases count held ticks and exclude charge from command completion window', () => {
  const engine = buffer('~30$B, F, z', 'time = 3');
  for (let i = 0; i < 30; i++) input(engine, ['L']);
  input(engine, ['R']);
  assert.ok(input(engine, ['R', 'z']).has('move'));
  const short = buffer('~30$B, F, z', 'time = 3');
  for (let i = 0; i < 29; i++) input(short, ['L']);
  input(short, ['R']);
  assert.ok(!input(short, ['R', 'z']).has('move'));
});

test('tolerant charge continues through diagonal changes without an early release', () => {
  const engine = buffer('~4$B, F, z');
  input(engine, ['L']);
  input(engine, ['L', 'D']);
  input(engine, ['L', 'U']);
  input(engine, ['L']);
  input(engine, ['R']);
  assert.ok(input(engine, ['R', 'z']).has('move'));
});

test('strict steps reject unrelated presses and releases between symbols', () => {
  const clean = buffer('a, >~a');
  input(clean, ['a']);
  input(clean, ['a']);
  assert.ok(input(clean, []).has('move'));
  const dirty = buffer('a, >~a');
  input(dirty, ['a']);
  input(dirty, ['a', 'x']);
  input(dirty, ['a']);
  assert.ok(!input(dirty, []).has('move'));
});

test('double tap direction is expanded to require a strict release then repress', () => {
  const engine = buffer('F, F');
  assert.ok(!input(engine, ['R']).has('move'));
  assert.ok(!input(engine, ['R']).has('move'));
  input(engine, []);
  assert.ok(input(engine, ['R']).has('move'));
  const dirty = buffer('F, F');
  input(dirty, ['R']);
  input(dirty, ['R', 'D']);
  input(dirty, []);
  assert.ok(!input(dirty, ['R']).has('move'));
});

test('repeated button symbols cannot consume the same edge and expire by total time', () => {
  const engine = buffer('a, a', 'time=4');
  assert.ok(!input(engine, ['a']).has('move'));
  input(engine, []);
  assert.ok(input(engine, ['a']).has('move'));
  const boundary = buffer('a, a', 'time=3');
  input(boundary, ['a']);
  input(boundary, []);
  input(boundary, []);
  assert.ok(input(boundary, ['a']).has('move'));
  const expired = buffer('a, a', 'time=3');
  input(expired, ['a']);
  input(expired, []);
  input(expired, []);
  input(expired, []);
  assert.ok(!input(expired, ['a']).has('move'));
});

test('same-name alternatives are ORed and button remapping preserves physical semantics', () => {
  const engine = new CommandBuffer(parseCommands('[Remap]\nx=a\na=\n[Command]\nname="move"\ncommand=a\n[Command]\nname="move"\ncommand=b'));
  assert.ok(!input(engine, ['a']).has('move'));
  assert.ok(input(engine, ['x']).has('move'));
  input(engine, []);
  assert.ok(input(engine, ['b']).has('move'));
});

test('reset clears charge, sequence history and buffered commands', () => {
  const engine = buffer('~2B, F, x', 'buffer.time=10');
  input(engine, ['L']);
  input(engine, ['L']);
  input(engine, ['R']);
  assert.ok(input(engine, ['R', 'x']).has('move'));
  engine.reset();
  assert.ok(!input(engine, []).has('move'));
  input(engine, ['R']);
  assert.ok(!input(engine, ['R', 'x']).has('move'));
});

test('malformed and unsupported commands are diagnosed and never reduced to a partial motion', () => {
  const parsed = parseCommands('[Command]\nname=unknown\ncommand=D, foo, x\n[Command]\nname=long\ncommand=x\ntime=9000\n[Command]\nname=badcombo\ncommand=D+F+x\n[Command]\nname=charge\ncommand=~9000B\n[Command]\nname=badmod\ncommand=/$x');
  assert.equal(parsed.commands.length, 0);
  assert.equal(parsed.diagnostics.length, 5);
  const engine = new CommandBuffer(parsed);
  assert.deepEqual([...input(engine, ['x'])], []);
});
