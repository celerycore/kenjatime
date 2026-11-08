/** Host trigger-read benchmark, not graphics or phone FPS. */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { performance } from "node:perf_hooks";
import { createHash } from "node:crypto";

const root = fileURLToPath(new URL("../../", import.meta.url));
const source = resolve(process.env.CORE_BENCH_SOURCE || root);
const { FighterRuntime } = await import(
  pathToFileURL(resolve(source, "src/runtime.js"))
);
const samples = 5,
  evaluations = 20000,
  workloads = [];
for (const frameCount of [24, 1024]) {
  const frames = Array.from({ length: frameCount }, (_, index) => ({
    ticks: (index % 5) + 1,
  }));
  const actor = new FighterRuntime({
    path: "animation-bench.def",
    def: {
      info: { name: "Animation benchmark" },
      files: { cns: "animation-bench.cns" },
    },
    files: {
      "animation-bench.cns": new TextEncoder().encode(
        "[Statedef 0]\ntype=S\nphysics=N\nctrl=0\nanim=0\n",
      ),
    },
    animations: [{ id: 0, loopStart: 1, frames }],
  });
  const duration = frames.reduce((sum, frame) => sum + frame.ticks, 0);
  actor.frameIndex = 1;
  actor.animationLooped = true;
  const run = (count) => {
    let checksum = 2166136261;
    for (let i = 0; i < count; i++) {
      actor.animationTime = i & 1023;
      actor.animationCycleTime = i % duration;
      const value =
        actor.resolveTrigger("animelemtime", [(i % frameCount) + 1]) +
        actor.resolveTrigger("animelemno", [(i % 9) - 4]) +
        actor.resolveTrigger("animtime");
      checksum = Math.imul(checksum ^ value, 16777619) >>> 0;
    }
    return checksum;
  };
  run(5000);
  const timesMs = [],
    checksums = [];
  for (let sample = 0; sample < samples; sample++) {
    const start = performance.now();
    checksums.push(run(evaluations));
    timesMs.push(performance.now() - start);
  }
  if (new Set(checksums).size !== 1)
    throw Error("Animation read checksum changed.");
  workloads.push({
    frameCount,
    evaluations,
    readsPerSample: evaluations * 3,
    samples,
    medianMs: [...timesMs].sort((a, b) => a - b)[2],
    timesMs,
    checksum: checksums[0],
  });
}
const sources = Object.fromEntries(
  ["runtime", "animation-clock"].map((name) => {
    const path = resolve(source, "src/" + name + ".js");
    return [
      "src/" + name + ".js",
      existsSync(path)
        ? createHash("sha256").update(readFileSync(path)).digest("hex")
        : null,
    ];
  }),
);
const report = {
  engine: "Kenjatime Core",
  version: JSON.parse(readFileSync(resolve(source, "package.json"))).version,
  node: process.version,
  platform: process.platform,
  arch: process.arch,
  sources,
  workloads,
  scope:
    "Authored headless animation trigger reads through the shared independent JS interpreter. Includes finite loop offsets and changing queried elements. Excludes match simulation, rendering, audio and loading; not browser or phone FPS.",
};
const output = resolve(
  process.env.CORE_ANIMATION_BENCH_OUTPUT ||
    resolve(root, "work/core/animation-benchmark.json"),
);
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
