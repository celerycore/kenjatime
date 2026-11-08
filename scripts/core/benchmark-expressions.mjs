import { WasmExpressions } from "../../src/core/wasm-expressions.js";
import { evaluateExpression } from "../../src/expressions.js";
import { mkdirSync, writeFileSync } from "node:fs";
const sources = [
  "time >= 3 && time < 24",
  "var(2) * 3 + stateno / 2",
  "ctrl && life < lifemax / 2",
  "vel y + .44",
  "time = [3,40]",
  "abs(var(1))",
  "min(time,20)",
  "cond(ctrl,10,20)",
];
const kernel = new WasmExpressions(sources),
  state = {
    time: 7,
    ctrl: 1,
    life: 450,
    lifemax: 1000,
    stateno: 200,
    "vel y": -2.5,
  };
const context = {
  resolve: (name, args) =>
    name === "var" ? [0, -13, 17][args[0]] : state[name],
};
const compiled = (s, c) => kernel.evaluate(s, c),
  reference = evaluateExpression,
  run = (evaluate, count) => {
    let checksum = 0;
    const start = performance.now();
    for (let i = 0; i < count; i++) {
      state.time = i % 60;
      for (const s of sources) checksum += evaluate(s, context);
    }
    return { ms: performance.now() - start, checksum };
  };
run(reference, 10000);
run(compiled, 10000);
const old = [],
  next = [];
for (let round = 0; round < 5; round++) {
  const order =
    round & 1
      ? [
          [compiled, next],
          [reference, old],
        ]
      : [
          [reference, old],
          [compiled, next],
        ];
  for (const [fn, out] of order) out.push(run(fn, 50000));
}
const median = (a) => [...a].sort((a, b) => a - b)[a.length >> 1];
const a = median(old.map((r) => r.ms)),
  b = median(next.map((r) => r.ms));
if (
  old.some((r) => r.checksum !== next[0].checksum) ||
  next.some((r) => r.checksum !== old[0].checksum)
)
  throw Error("Benchmark results differ");
const evidence = {
  engine: "Kenjatime Core",
  node: process.version,
  platform: process.platform,
  arch: process.arch,
  expressions: sources.length,
  evaluationsPerSample: 400000,
  samples: 5,
  interpreterMedianMs: a,
  compiledMedianMs: b,
  speedup: a / b,
  identicalChecksums: true,
  moduleBytes: kernel.binary.length,
  compiledFunctions: kernel.stats.compiled,
  interpreterSamples: old,
  compiledSamples: next,
  scope:
    "Host numeric expression microbenchmark, not phone FPS or complete engine parity.",
};
mkdirSync("work/core", { recursive: true });
writeFileSync(
  "work/core/expression-benchmark.json",
  JSON.stringify(evidence, null, 2) + "\n",
);
console.log(JSON.stringify(evidence, null, 2));
