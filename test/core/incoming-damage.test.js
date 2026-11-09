import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CoreSession } from "../../src/core/session.js";
import { FighterRuntime } from "../../src/runtime.js";

test("incoming damage is readable once by controllers and then clears, matching native observations", () => {
  const fixture = JSON.parse(
    readFileSync(
      new URL("../fixtures/core/incoming-damage.json", import.meta.url),
    ),
  );
  for (const interpreted of [false, true]) {
    const files = Object.fromEntries(
      Object.entries(fixture.files).map(([p, b]) => [
        p,
        new Uint8Array(Buffer.from(b, "base64")),
      ]),
    );
    const s = new CoreSession(files, {
      mode: "training",
      character: "chars/verification-actor/fighter.def",
      opponent: "chars/verification-victim/fighter.def",
    });
    if (interpreted)
      for (const a of s.match.entities) a.options.expressionEvaluator = null;
    s.match.leftBound = -160;
    s.match.rightBound = 160;
    for (const a of [s.match.player, s.match.opponent]) {
      a.life = 1000;
      a.power = 1500;
      a.changeState(fixture.case.setupState);
    }
    const rows = [];
    for (
      let guard = 0;
      rows.length < fixture.samples.length && guard < 120;
      guard++
    ) {
      s.tick();
      const tick =
        s.match.ticks - s.match.player.vars[fixture.driver.originVar];
      if (tick < 1) continue;
      const a = s.match.opponent;
      rows.push({
        tick,
        life: a.life,
        damage: a.evaluate("gethitvar(damage)"),
        scriptDamage: a.vars[4],
      });
    }
    assert.deepEqual(rows, fixture.samples);
    assert.equal(rows.filter((s) => s.scriptDamage > 0).length, 1);
    s.close();
  }
});

test("duplicate controller and value parameters preserve the first occurrence as in native MUGEN", () => {
  const fixture = JSON.parse(
    readFileSync(
      new URL("../fixtures/core/duplicate-parameters.json", import.meta.url),
    ),
  );
  const actor = new FighterRuntime({
    path: "probe.def",
    def: { files: { cns: "probe.cns" } },
    files: { "probe.cns": new TextEncoder().encode(fixture.source) },
    animations: [{ id: 0, frames: [{ ticks: -1 }] }],
  });
  for (const expected of fixture.samples) {
    actor.tick();
    assert.deepEqual(
      {
        tick: actor.gameTime,
        stateType: actor.stateType,
        physics: actor.physics,
        life: actor.life,
      },
      expected,
    );
  }
  assert.ok(
    !actor.diagnostics.some((d) => d.type === "unsupported-controller"),
  );
});
