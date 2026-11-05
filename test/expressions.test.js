import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateExpression as evaluate, compileExpression, splitArguments, ExpressionError, BottomError } from '../src/expressions.js';

function fixture(extra = {}) {
  const vars = new Map([[0, 0], [1, 3]]), fvars = new Map([[0, 1]]);
  const calls = [];
  const context = {
    resolve(name, args, redirect) {
      calls.push({ name, args, redirect });
      if (redirect) {
        if (redirect.name === 'enemynear') return name === 'life' ? 725 : 9;
        if (redirect.name === 'helper' && redirect.args[0] === 42) return 6;
        throw new Error('Redirect target does not exist.');
      }
      if (name === 'time') return 11;
      if (name === 'statetype') return 'S';
      if (name === 'pos x') return 6;
      if (name === 'vel y') return -3;
      if (name === 'p2dist x') return 40;
      if (name === 'camerapos x') return 20;
      if (name === 'camerapos y') return -10;
      if (name === 'camerazoom') return 1;
      if (name === 'var') return vars.get(args[0]) || 0;
      if (name === 'fvar') return fvars.get(args[0]) || 0;
      if (name === 'animelemtime') return 5 - args[0];
      if (name === 'const' && args[0] === 'size.xscale') return { value: 1, type: 'float' };
      if (name === 'gethitvar' && args[0] === 'xvel') return -4;
      if (name === 'command') return args[0] === 'QCF_a';
      if (name === 'hitdefattr') return args[0].includes('S') && args.slice(1).includes('NA');
      throw new Error(`Unsupported trigger: ${name}`);
    },
    assign(name, [index], value) { (name === 'var' ? vars : fvars).set(index, value); },
    ...extra,
  };
  return { context, vars, fvars, calls };
}

test('MUGEN precedence, associativity and numeric types match the CNS reference', () => {
  assert.equal(evaluate('3 + 2 * 5'), 13);
  assert.equal(evaluate('2 ** 3 ** 2'), 64); // MUGEN exponentiation is left associative.
  assert.equal(evaluate('-2 ** 2'), 4); // Unary operators bind before exponentiation.
  assert.equal(evaluate('5 / 6 * 5.0'), 0);
  assert.equal(evaluate('5.0 * 5 / 6'), Math.fround(25 / 6));
  assert.equal(evaluate('-7 / 2'), -3);
  assert.equal(evaluate('1.0 / 2'), 0.5);
  assert.equal(evaluate('0 ** 0'), 1);
  assert.equal(evaluate('!0 + ~0'), 0);
  assert.equal(evaluate('1 + 2 > 2 = 1'), 1);
  assert.equal(evaluate('7 & 3 ^ 1 | 8'), 10);
  assert.equal(evaluate('1 ^^ 2'), 0);
  assert.equal(evaluate('0 || 3 && 1'), 1);
});

test('quoted strings preserve case while trigger names and enum constants ignore case', () => {
  const { context } = fixture();
  assert.equal(evaluate('STATEtype = s', context), 1);
  assert.equal(evaluate('command = "QCF_a"', context), 1);
  assert.equal(evaluate('command != "qcf_a"', context), 1);
  assert.equal(evaluate('"Case" = "case"'), 0);
  assert.equal(evaluate('"A;B" = "A;B"'), 1);
  assert.equal(evaluate('pos x / 4 + vel Y + p2dist X', context), 38.5);
  assert.equal(evaluate('pos x + CameraPos X', context), 26);
  assert.equal(evaluate('CameraPos Y + CameraZoom / 2', context), -9.5);
});

test('Command comparisons are legacy boolean atoms before surrounding arithmetic/comparisons', () => {
  const { context } = fixture();
  assert.equal(evaluate('11 = Command = "QCF_a"', context), 0);
  assert.equal(evaluate('1 = Command = "QCF_a"', context), 1);
  assert.equal(evaluate('Time = command = "QCF_a"', context), 0);
  assert.equal(evaluate('3 + Command = "QCF_a"', context), 4);
  assert.equal(evaluate('0 = Command != "QCF_a"', context), 1);
  assert.equal(evaluate('Command = "QCF_a" = 1', context), 1);
  assert.throws(() => evaluate('Command = 1', context), /quoted name/);
  assert.throws(() => evaluate('Command = Cond(1, "QCF_a", "other")', context), /quoted name/);
});

test('interval operators respect each inclusive and exclusive boundary', () => {
  for (const [source, result] of [
    ['2 = [2,4]', 1], ['2 = (2,4]', 0], ['4 = [2,4)', 0],
    ['3 = (2,4)', 1], ['4 != [2,4]', 0], ['4 != [2,4)', 1],
    ['-2 = [-2,-1]', 1], ['2 = (1 + 1, 2 * 2)', 0],
    ['(2 = [1,3]) && 1', 1],
  ]) assert.equal(evaluate(source), result, source);
});

test('variables assign right to left, truncate int values and preserve float values', () => {
  const { context, vars, fvars } = fixture();
  assert.equal(evaluate('var(0) := var(1) := 6.8', context), 6);
  assert.equal(vars.get(0), 6);
  assert.equal(vars.get(1), 6);
  assert.equal(evaluate('fvar(0) := 1.0 / 2', context), 0.5);
  assert.equal(fvars.get(0), 0.5);
  assert.equal(evaluate('fvar(0) / 2', context), 0.25);
  assert.throws(() => evaluate('life := 3', context), /Assignment requires/);
  const nativeVars = new Int32Array(1);
  assert.equal(evaluate('var(0) := 2147483648', { assign(name, [index], value) { nativeVars[index] = value; return nativeVars[index]; } }), -2147483648);
});

test('Cond isolates errors and unused assignments, while IfElse evaluates both branches', () => {
  const warnings = [];
  const { context, vars } = fixture({ onWarning: error => warnings.push(error.message) });
  assert.equal(evaluate('Cond(0, 1 / 0, 2)', context), 2);
  assert.equal(warnings.length, 0);
  assert.equal(evaluate('IfElse(0, 1 / 0, 2)', context), 2);
  assert.equal(warnings.length, 1);
  assert.equal(evaluate('Cond(1, 5, var(0) := 7)', context), 5);
  assert.equal(vars.get(0), 0);
  assert.equal(evaluate('IfElse(1, 5, var(0) := 7)', context), 5);
  assert.equal(vars.get(0), 7);
  assert.throws(() => evaluate('Cond(1, 1/0, 2)', context), /Division by zero/);
  assert.equal(evaluate('0 && (var(0) := 9)', context), 0);
  assert.equal(vars.get(0), 9); // Short circuiting belongs to trigger lines, not &&.
  assert.throws(() => evaluate('0 && 1/0', context), /Division by zero/);
});

test('symbolic native function arguments and standard math functions are safe', () => {
  const { context } = fixture();
  assert.equal(evaluate('const(size.xscale) / 2', context), 0.5);
  assert.equal(evaluate('gethitvar(xvel)', context), -4);
  assert.equal(evaluate('floor(2.9) + ceil(2.1) + abs(-4)'), 9);
  assert.equal(evaluate('sin(pi / 2)'), 1);
  assert.equal(evaluate('max(3, min(5,4))'), 4);
  assert.ok(Math.abs(evaluate('ln(exp(1))')-1)<1e-6);
  assert.equal(evaluate('log(2, 64)'), 6);
  assert.equal(evaluate('log(10, 100)'), 2);
  assert.throws(() => evaluate('sqrt(-1)'), /non-finite/);
  assert.throws(() => evaluate('abs(1,2)'), /requires 1/);
  assert.throws(() => evaluate('1.0 % 2'), /Remainder requires integers/);
  assert.throws(() => evaluate('1.0 & 2'), /Bitwise operators require integers/);
});

test('old AnimElem and TimeMod clauses retain their literal argument syntax', () => {
  const { context } = fixture();
  assert.equal(evaluate('AnimElem = 5', context), 1);
  assert.equal(evaluate('AnimElem = 2, >= 2', context), 1);
  assert.equal(evaluate('AnimElem = 5 + 4', context), 5);
  assert.equal(evaluate('AnimElem = 2, 3', context), 1);
  assert.equal(evaluate('TimeMod = 4, 3', context), 1);
  assert.equal(evaluate('TimeMod != 4, 3', context), 0);
  assert.throws(() => evaluate('TimeMod = 0, 0', context), /positive/);
  assert.throws(() => evaluate('AnimElem = (1+1)', context), /integer literal/);
  assert.equal(evaluate('HitDefAttr = SC, NA, SA, HA', context), 1);
  assert.equal(evaluate('HitDefAttr != A, AA', context), 1);
  assert.equal(evaluate('HitDefAttr = S, NA && Time > 5', context), 1);
  assert.throws(() => evaluate('HitDefAttr = S, MADEUP', context), /attack attributes/);
});

test('redirection sends entity selectors to the runtime and only redirects one trigger', () => {
  const { context, calls } = fixture();
  assert.equal(evaluate('enemyNear, life', context), 725);
  assert.equal(evaluate('helper(42), var(0)', context), 6);
  assert.equal(evaluate('5 + (enemynear, time)', context), 14);
  assert.equal(evaluate('(enemynear, time) + time', context), 20);
  assert.equal(evaluate('time = (enemynear, time)', context), 0);
  assert.equal(evaluate('enemynear, stateno = 9 && time = 11', context), 1);
  assert.deepEqual(calls.find(call => call.name === 'var')?.redirect, { name: 'helper', args: [42] });
  assert.throws(() => evaluate('helper(99), life', context), /does not exist/);
  assert.throws(() => evaluate('root, helper, life', context), /Recursive/);
});

test('controller argument lists preserve strings and nested expressions', () => {
  assert.deepEqual(splitArguments('1, IfElse(time = [0,4], 2, 3), "a,b", var(0)'), ['1', 'IfElse(time = [0,4], 2, 3)', '"a,b"', 'var(0)']);
  assert.deepEqual(splitArguments('5 = (2,8], 7'), ['5 = (2,8]', '7']);
  assert.throws(() => splitArguments('1, (2,3'), /Unbalanced/);
});

test('malformed, unsupported and oversized character expressions fail closed', () => {
  const { context } = fixture();
  for (const source of ['', '1 +', '"unfinished', '1; process.exit()', '1 = [0,2', 'var(0))', 'Math.random()', 'constructor.constructor("return globalThis")()']) {
    assert.throws(() => evaluate(source, context), ExpressionError, source);
  }
  assert.throws(() => evaluate('notImplemented', context), /Unsupported trigger/);
  assert.throws(() => evaluate('('.repeat(150) + '1' + ')'.repeat(150)), /nesting exceeds/);
  assert.throws(() => evaluate('1+'.repeat(5000) + '1'), /exceeds/);
  const compiled = compileExpression('time + 1');
  assert.equal(compiled(context), 12);
  assert.equal(compiled({ resolve: () => 20 }), 21);
});

test('native bottom remains distinct from unsupported syntax and propagates through comparisons', () => {
  const context = { resolve: () => { throw new BottomError('Element does not exist.'); } };
  for (const source of ['animelemtime(99)', '!animelemtime(99)', 'animelemtime(99) != 0', '1 || animelemtime(99)']) {
    assert.throws(() => evaluate(source, context), error => error instanceof BottomError && error.bottom === true, source);
  }
  assert.equal(evaluate('cond(0, animelemtime(99), 7)', context), 7);
  assert.equal(evaluate('ifelse(0, animelemtime(99), 7)', context), 7);
});
