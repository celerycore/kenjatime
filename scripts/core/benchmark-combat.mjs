/** Reproducible CPU simulation workload; this does not measure browser/phone FPS. */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { performance } from "node:perf_hooks";
import { createHash } from "node:crypto";

const root = fileURLToPath(new URL("../../", import.meta.url));
const source = resolve(process.env.CORE_BENCH_SOURCE || root);
const { TrainingMatch } = await import(
  pathToFileURL(resolve(source, "src/combat.js"))
);
const version = JSON.parse(
  readFileSync(resolve(source, "package.json")),
).version;
const encode = (text) => new TextEncoder().encode(text);
const boxes = [
  [-8, -40, 8, 0],
  [-6, -48, 6, -40],
  [-12, -32, 12, -16],
  [-10, -16, 10, 0],
];
const character = {
  path: "bench.def",
  def: { info: { name: "Combat benchmark" }, files: { cns: "bench.cns" } },
  files: {
    "bench.cns": encode(
      "[Data]\nlife=1000000000\n[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nctrl=0\nanim=0\n" +
        "[Statedef 200]\ntype=S\nmovetype=A\nphysics=N\nctrl=0\nanim=200\n" +
        "[State Hit]\ntype=HitDef\ntrigger1=Time=0\nattr=S,NA\ndamage=1\npausetime=0,0\nground.hittime=1\nground.velocity=0\nguard.dist=0\n",
    ),
  },
  animations: [0, 200].map((id) => ({
    id,
    frames: [
      {
        group: 0,
        number: 0,
        ticks: -1,
        clsn2: boxes,
        clsn1: id === 200 ? boxes : [],
      },
    ],
  })),
};
function setup(helpers, attacking, projectiles) {
  const match = new TrainingMatch(character, {
    initialize: false,
    orderedPhases: true,
    pushboxes: false,
  });
  match.player.pos.x = -80;
  match.opponent.pos.x = 80;
  for (let i = 0; i < helpers; i++) {
    const owner = i % 2 ? match.opponent : match.player;
    match.spawnHelper(owner, { stateno: attacking ? 200 : 0, keyctrl: 0 });
  }
  if (attacking)
    for (const a of [match.player, match.opponent]) a.changeState(200);
  for (let i = 0; i < projectiles; i++) {
    const owner = i % 2 ? match.opponent : match.player;
    match.spawnProjectile(owner, {
      projanim: 200,
      velocity: [0, 0],
      projremovetime: -1,
      hitDef: {
        attr: "S,NP",
        serial: i + 1,
        damage: [1, 0],
        pauseTime: [0, 0],
        groundVelocity: [0, 0],
        hitFlag: "MAF",
      },
    });
  }
  return match;
}
function checksum(match) {
  let hash = 2166136261;
  for (const a of [...match.entities, ...match.projectiles])
    for (const n of [
      a.id,
      a.stateNo,
      a.time,
      a.life,
      a.power,
      a.pos.x,
      a.pos.y,
      a.vel.x,
      a.vel.y,
      a.facing,
      a.hitCount || 0,
    ])
      hash = Math.imul(hash ^ Math.round((n || 0) * 1024), 16777619) >>> 0;
  return hash;
}
const samples = 5,
  ticks = 2000;
const workloads = [
  { name: "two-fighters", helpers: 0, attacking: true, projectiles: 0 },
  { name: "idle-helpers", helpers: 40, attacking: false, projectiles: 0 },
  { name: "attacking-helpers", helpers: 40, attacking: true, projectiles: 0 },
  { name: "projectile-load", helpers: 16, attacking: true, projectiles: 32 },
];
const results = [];
for (const workload of workloads) {
  const measured = [],
    checksums = [];
  for (let s = -1; s < samples; s++) {
    const match = setup(
      workload.helpers,
      workload.attacking,
      workload.projectiles,
    );
    for (let i = 0; i < 200; i++) match.tick();
    const start = performance.now();
    for (let i = 0; i < ticks; i++) match.tick();
    if (
      match.entities.length !== workload.helpers + 2 ||
      match.projectiles.length !== workload.projectiles
    )
      throw Error("Workload entity count changed: " + workload.name);
    if (s >= 0) {
      measured.push(performance.now() - start);
      checksums.push(checksum(match));
    }
  }
  if (new Set(checksums).size !== 1)
    throw Error("Nondeterministic workload: " + workload.name);
  results.push({
    ...workload,
    ticks,
    samples,
    medianMs: [...measured].sort((a, b) => a - b)[2],
    timesMs: measured,
    checksum: checksums[0],
  });
}
const report = {
  engine: "Kenjatime Core",
  version,
  node: process.version,
  platform: process.platform,
  arch: process.arch,
  combatSourceSha256: createHash("sha256")
    .update(readFileSync(resolve(source, "src/combat.js")))
    .digest("hex"),
  simulationSources: Object.fromEntries(
    [
      "combat",
      "runtime",
      "common",
      "coordinates",
      "commands",
      "expressions",
      "hit-state",
      "projectiles",
      "guard-distance",
      "cpu",
      "rounds",
      "animation-clock",
      "zss",
      "zss-executor",
    ].map((name) => [
      "src/" + name + ".js",
      existsSync(resolve(source, "src/" + name + ".js"))
        ? createHash("sha256")
            .update(readFileSync(resolve(source, "src/" + name + ".js")))
            .digest("hex")
        : null,
    ]),
  ),
  expressionBackend:
    "Independent JS interpreter, identical for baseline and optimized runs",
  scope:
    "Headless fixed-tick CPU simulation of authored synthetic loads, including CNS, contact scanning and cleanup. No graphics, archive loading or audio; no browser or phone FPS claim.",
  workloads: results,
};
const output = resolve(
  process.env.CORE_BENCH_OUTPUT ||
    resolve(root, "work/core/combat-benchmark.json"),
);
mkdirSync(resolve(output, ".."), { recursive: true });
writeFileSync(output, JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
