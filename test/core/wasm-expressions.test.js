import { test } from "node:test";
import assert from "node:assert/strict";
import { WasmExpressions } from "../../src/core/wasm-expressions.js";
import {
  evaluateExpression,
  evaluateTypedExpression,
  BottomError,
} from "../../src/expressions.js";
const expressions = [
  "0",
  "2147483647+1",
  "-2147483648/-1",
  "-2147483648%-1",
  "-5/2",
  "-5%2",
  "(2147483647*17)-8",
  "time=[2,12]",
  "time!=(2,12]",
  "time>=2 && time<20",
  "ctrl || life<100",
  "ctrl ^^ (time>3)",
  "var(1) & ~3",
  "abs(-2147483648)",
  "abs(vel y)",
  "min(var(0),life)",
  "max(vel y,life)",
  "ceil(2147483647)",
  "floor(-1.5)",
  "sin(pi/2)",
  "cos(e)",
  "tan(.2)",
  "acos(.5)",
  "asin(.5)",
  "atan(8)",
  "exp(.25)",
  "ln(2)",
  "log(2,16)",
  "sqrt(2)",
  "vel y*1.25+.44",
  "vel y=3",
  "var(fvar(0))",
  "animelem=2,>=0",
  "timemod=3,0",
  "cond(ctrl,time,stateno)",
  "cond(ctrl,vel x,vel y)",
];
const engine = new WasmExpressions(expressions);
const values = {
  time: 8,
  ctrl: 1,
  stateno: 200,
  life: 900,
  "vel x": 2.5,
  "vel y": -3.2,
};
const context = {
  resolve: (name, args) =>
    name === "var"
      ? [2147483647, -17, 8][Math.trunc(args[0]) % 3]
      : name === "fvar"
        ? 0.9
        : name === "animelemtime"
          ? values.time - 4
          : values[name],
};
test("numeric expressions compile to independent valid Wasm and preserve integer/f32 semantics", () => {
  assert.equal(engine.stats.compiled, expressions.length);
  assert.ok(WebAssembly.validate(engine.binary));
  assert.deepEqual(
    WebAssembly.Module.imports(new WebAssembly.Module(engine.binary)).map(
      (i) => i.module,
    ),
    new Array(13).fill("host"),
  );
  for (let i = 0; i < 250; i++) {
    values.time = (i % 23) - 5;
    values.ctrl = i & 1;
    values.life = 1000 - i * 4;
    values["vel y"] = Math.fround((i - 100) / 7);
    for (const source of expressions)
      assert.deepEqual(
        engine.evaluate(source, { ...context, typedResult: true }),
        evaluateTypedExpression(source, context),
        source + " tick " + i,
      );
  }
});
test("bottom remains bottom for division, overflow, invalid square root and modulo", () => {
  for (const source of [
    "time/0",
    "time%0",
    "(1e38*1e38)>0",
    "sqrt(-1)",
    "ln(0)",
  ]) {
    const kernel = new WasmExpressions([source]);
    assert.equal(kernel.stats.compiled, 1);
    assert.throws(
      () => kernel.evaluate(source, context),
      (e) => e instanceof BottomError,
    );
  }
});
test("integer/float branch types, eager IfElse, RNG, assignments and redirects use the independent interpreter", () => {
  const sources = [
    "cond(ctrl,1,1.0)",
    "ifelse(ctrl,2,1/0)",
    "random",
    "var(1):=3",
    "parent,time",
  ];
  const kernel = new WasmExpressions(sources);
  assert.equal(kernel.stats.compiled, 0);
  const ctx = {
    resolve: (name, args, redirect) =>
      name === "random" ? 123 : name === "name" ? "Fighter" : redirect ? 5 : 1,
    assign: () => 3,
  };
  for (const source of sources)
    assert.equal(kernel.evaluate(source, ctx), evaluateExpression(source, ctx));
});
test("literal command, string, attribute and constant reads preserve their declared types", () => {
  const sources = [
    'name="Fighter"',
    "statetype!=A",
    'command="a" && time>0',
    "const(velocity.walk.fwd.x)/2",
    "const(size.xscale)",
    "gethitvar(xvel)",
    "hitdefattr=S,NA",
  ];
  const kernel = new WasmExpressions(sources);
  assert.equal(kernel.stats.compiled, sources.length);
  const ctx = {
    resolve: (n, args) =>
      ({
        name: "Fighter",
        statetype: "S",
        command: 1,
        time: 10,
        const: 2,
        gethitvar: 4,
        hitdefattr: 1,
      })[n],
  };
  for (const source of sources)
    assert.deepEqual(
      kernel.evaluate(source, { ...ctx, typedResult: true }),
      evaluateTypedExpression(source, ctx),
      source,
    );
});
test("typed import changes deoptimize instead of truncating a fractional value", () => {
  const kernel = new WasmExpressions(["life/2"]);
  const ctx = { resolve: () => 1.5 };
  assert.equal(kernel.evaluate("life/2", ctx), 0.75);
  assert.equal(kernel.stats.deoptimized, 1);
  assert.equal(kernel.stats.activeFunctions, 0);
});
test("Cond stays lazy and active contexts are restored after a nested evaluation", () => {
  const kernel = new WasmExpressions(["cond(ctrl,life,var(99))", "time+1"]);
  let reads = [];
  const ctx = {
    resolve(name) {
      reads.push(name);
      if (name === "ctrl") return 1;
      if (name === "life")
        return kernel.evaluate("time+1", { resolve: () => 7 });
      throw new BottomError("Invalid read");
    },
  };
  assert.equal(kernel.evaluate("cond(ctrl,life,var(99))", ctx), 8);
  assert.deepEqual(reads, ["ctrl", "life"]);
  assert.equal(kernel.context, null);
});
test("compilation budgets keep uncommon expressions in the original data interpreter", () => {
  const kernel = new WasmExpressions(["1+2", "2+3", "3+4"], {
    maxFunctions: 1,
  });
  assert.equal(kernel.stats.compiled, 1);
  assert.equal(kernel.evaluate("3+4"), 7);
  assert.equal(kernel.stats.interpreted, 1);
});
