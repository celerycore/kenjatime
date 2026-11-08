import { readFileSync, writeFileSync } from "node:fs";
import { CoreSession } from "../../src/core/session.js";
const plan = JSON.parse(readFileSync(process.argv[2])),
  files = Object.fromEntries(
    Object.entries(plan.files).map(([p, b]) => [
      p,
      new Uint8Array(Buffer.from(b, "base64")),
    ]),
  );
const core = new CoreSession(files, {
  character: plan.character,
  opponent: plan.opponent,
  mode: "training",
  palette: 1,
  opponentPalette: 2,
});
core.match.leftBound = -160;
core.match.rightBound = 160;
const sample = (a) => ({
  state: a.stateNo,
  time: a.time,
  anim: a.anim,
  element: a.frameIndex + 1,
  elementTime: a.frameTime,
  life: a.life,
  power: a.power,
  x: a.pos.x,
  y: a.pos.y,
  vx: a.vel.x,
  vy: a.vel.y,
  facing: a.facing,
  ctrl: !!a.ctrl,
  stateType: a.stateType,
  moveType: a.moveType,
  physics: a.physics,
  hitCount: a.hitCount,
  moveHit: a.moveHit,
  moveContact: a.moveContact,
  moveGuarded: a.moveGuarded,
  hitPause: a.hitPauseTime,
  hitShake: a.getHitVars.hitshaketime || 0,
  hitTime: a.hitTime,
  fall: !!a.getHitVars.fall,
  fallTime: a.getHitVars["fall.time"] || 0,
  recover: !!a.getHitVars["fall.recover"],
  guardDistance: !!a.inGuardDistance,
  helperCount: a.ownedHelpers().length,
  projectileCount: a.resolveTrigger("numproj"),
  targets: a.targets.length,
});
const totals = {},
  first = [],
  cases = [];
let ticks = 0,
  different = 0,
  comparedFields = 0;
for (let index = 0; index < plan.cases.length; index++) {
  const c = plan.cases[index],
    reference = plan.native.cases[index],
    m = core.match;
  for (const [side, a] of [m.player, m.opponent].entries()) {
    a.life = 1000;
    a.power = c.power ?? 1500;
    core.commands[side].reset();
    a.changeState(c.setupState);
  }
  const rows = [],
    localFirst = [];
  let localDifferences = 0,
    guard = 0;
  while (rows.length < reference.samples.length && guard++ < 1000) {
    core.tick();
    const tick = m.ticks - m.player.vars[plan.driver.originVar];
    if (tick < 1) continue;
    if (tick !== rows.length + 1)
      throw Error("Independent capture missed a tick: " + c.id + " " + tick);
    const row = {
      tick,
      player: sample(m.player),
      opponent: sample(m.opponent),
    };
    rows.push(row);
    const expected = reference.samples[tick - 1];
    ticks++;
    for (const side of ["player", "opponent"])
      for (const [field, value] of Object.entries(row[side])) {
        if(!(field in expected[side]))throw Error('Native capture is missing '+side+'.'+field);
        comparedFields++;
        const native = expected[side][field],
          equal =
            typeof value === "number" && typeof native === "number"
              ? Math.abs(value - native) <=
                (["x", "y", "vx", "vy"].includes(field) ? 1e-5 : 0)
              : value === native;
        if (!equal) {
          different++;
          localDifferences++;
          totals[field] = (totals[field] || 0) + 1;
          const diff = { case: c.id, tick, side, field, native, core: value };
          if (first.length < 30) first.push(diff);
          if (localFirst.length < 12) localFirst.push(diff);
        }
      }
  }
  if(rows.length!==reference.samples.length)throw Error('Independent capture ended early: '+c.id);
  if (process.env.CORE_TRACE)
    writeFileSync("work/core/" + c.id + "-trace.json", JSON.stringify(rows));
  cases.push({
    id: c.id,
    ticks: rows.length,
    differences: localDifferences,
    firstDifferences: localFirst,
  });
}
const report = {
  engine: "Kenjatime Core",
  group: plan.group,
  matched: different === 0,
  scenarios: cases.length,
  comparedTicks: ticks,
  comparedFields,
  differentFields: different,
  fieldCounts: totals,
  firstDifferences: first,
  cases,
  nativeCaptureSha256: plan.nativeCaptureSha256,
  referenceProvenance: plan.native.provenance,
  scope:
    "Identical authored neutral setup and AssertInput CNS recipes; primary state/motion/contact fields only. Native common-state implementation is not loaded. Palette pixels, full helper/projectile field traces, and full native resource identity are not compared. Differences remain explicit; no certification is claimed.",
};
writeFileSync(
  "work/core/" + plan.group + "-native-comparison.json",
  JSON.stringify(report, null, 2) + "\n",
);
core.close();
