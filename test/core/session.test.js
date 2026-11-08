import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { unzipSync } from "fflate";
import { CoreSession } from "../../src/core/session.js";
const files = unzipSync(
  readFileSync(new URL("../../public/kfm.zip", import.meta.url)),
);
const state = (s) =>
  [s.match.player, s.match.opponent].map((a) => ({
    state: a.stateNo,
    prev: a.prevStateNo,
    time: a.time,
    life: a.life,
    power: a.power,
    pos: { ...a.pos },
    vel: { ...a.vel },
    vars: [...a.vars],
    fvars: [...a.fvars],
    anim: a.anim,
    frame: a.frameIndex,
  }));
test("compiled independent match agrees with its interpreter across motion, attacks and rounds", () => {
  const compiled = new CoreSession(files, {
      mode: "training",
      opponentPalette: 1,
    }),
    reference = new CoreSession(files, {
      mode: "training",
      opponentPalette: 1,
    });
  for (const actor of reference.match.entities)
    actor.options.expressionEvaluator = null;
  for (let tick = 0; tick < 1200; tick++) {
    const keys = new Set(
      tick < 32
        ? ["R"]
        : tick % 90 === 5
          ? ["x"]
          : tick % 170 === 4
            ? ["U", "R"]
            : tick % 90 > 55 && tick % 90 < 65
              ? ["D"]
              : [],
    );
    compiled.tick(keys);
    reference.tick(keys);
    assert.deepEqual(state(compiled), state(reference), "tick " + tick);
  }
  assert.ok(compiled.expressions.stats.wasm > 10000);
  assert.ok(compiled.match.opponent.life < 1000);
  compiled.close();
  reference.close();
});
test("snapshot never consumes texture delivery and unchanged frames need zero uploads", () => {
  const s = new CoreSession(files, { mode: "training", opponentPalette: 1 });
  s.snapshot();
  const first = s.frame();
  assert.ok(first.assets.length >= 2);
  assert.equal(first.draws.length, 2);
  assert.equal(s.frame().assets.length, 0);
  assert.equal(s.snapshot().capabilities.universalCompatibility, false);
  s.close();
  assert.throws(() => s.tick(), /closed/);
});
test("actor programs are shared safely while variables and palettes remain independent", () => {
  const s = new CoreSession(files, { mode: "training", opponentPalette: 1 });
  assert.equal(s.match.player.program, s.match.opponent.program);
  s.match.player.vars[2] = 71;
  assert.equal(s.match.opponent.vars[2], 0);
  s.match.player.paletteRemaps.set("1,1", [1, 3]);
  assert.deepEqual(s.match.opponent.paletteRemaps.get("1,1"), undefined);
  s.close();
});
