import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { unzipSync } from "fflate";
import { CoreSession } from "../../src/core/session.js";
import { sampleFighterAnimation } from "../../src/rendering.js";
import {
  animationTiming,
  animationElementTime,
  animationElementAt,
  animationRemaining,
} from "../../src/animation-clock.js";

test("cached action timing handles boundaries, loop offsets, infinite frames and invalid elements", () => {
  const animation = {
    loopStart: 1,
    frames: [2, 3, 4].map((ticks) => ({ ticks })),
  };
  const clock = {
    frameIndex: 1,
    animationCycleTime: 3,
    animationTime: 33,
    animationLooped: false,
  };
  assert.equal(animationTiming(animation), animationTiming(animation));
  assert.deepEqual(
    [1, 2, 3].map((i) => animationElementTime(animation, clock, i)),
    [33, 31, 28],
  );
  assert.deepEqual(
    [0, 2, 6, -5].map((t) => animationElementAt(animation, clock, t)),
    [2, 3, 2, 3],
  );
  assert.equal(animationRemaining(animation, clock), -6);
  assert.equal(
    animationRemaining(animation, { ...clock, animationEnded: true }),
    0,
  );
  for (const element of [0, 4])
    assert.throws(
      () => animationElementTime(animation, clock, element),
      (error) => error.bottom === true,
    );
  const infinite = { frames: [{ ticks: 2 }, { ticks: -1 }, { ticks: 3 }] };
  assert.equal(animationRemaining(infinite, clock), -1);
  assert.equal(animationElementAt(infinite, clock, 1e6), 2);
  assert.equal(
    animationElementTime(infinite, { ...clock, animationTime: 3 }, 3),
    0,
  );
  assert.throws(
    () => animationElementAt(infinite, clock, -4),
    (error) => error.bottom === true,
  );
  const previous = animationTiming(animation);
  animation.frames = [{ ticks: 7 }];
  assert.notEqual(animationTiming(animation), previous);
  assert.equal(animationTiming(animation).duration, 7);
});

test("CNS pause reads and visible animation clocks match independent native observations", () => {
  const fixture = JSON.parse(
    readFileSync(
      new URL("../fixtures/core/animation-pause.json", import.meta.url),
    ),
  );
  for (const run of fixture.runs) {
    const files = unzipSync(
      readFileSync(new URL("../../public/kfm.zip", import.meta.url)),
    );
    if (run.extraAIR)
      files["kfm/kfm.air"] = new TextEncoder().encode(
        new TextDecoder().decode(files["kfm/kfm.air"]) + run.extraAIR,
      );
    let controllers = "";
    for (const [slot, expression] of ["0", "0", ...run.expressions].entries())
      controllers += `[State Authored observation]\ntype=VarSet\ntrigger1=1\nignorehitpause=1\nv=${slot}\nvalue=floor((${expression})*10000)\n`;
    const source = new TextDecoder().decode(files["kfm/kfm.cns"]);
    files["kfm/kfm.cns"] = new TextEncoder().encode(
      source.replace(
        "[Statedef -3]",
        "[Statedef -3]\n" + controllers + run.extraControllers,
      ),
    );
    const session = new CoreSession(files, { mode: "training" }),
      a = session.match.player;
    session.match.player.pos.x = -16;
    session.match.opponent.pos.x = 16;
    session.tick();
    a.changeState(run.action);
    for (let tick = 2; tick <= 24; tick++) {
      session.tick();
      const expected = run.samples.find((sample) => sample.tick === tick);
      if (!expected) continue;
      const sprite = session.asset(
        a.character,
        sampleFighterAnimation(a),
        a.paletteRemaps,
      );
      assert.deepEqual(
        {
          tick,
          state: a.stateNo,
          time: a.time,
          anim: a.anim,
          element: a.frameIndex + 1,
          elementTime: a.frameTime,
          hitPause: a.hitPauseTime,
          probes: Array.from(a.vars.slice(2, 6)),
          sprite: [sprite.w, sprite.h, sprite.x, sprite.y],
        },
        expected,
        run.id + "/" + tick,
      );
      if (a._pausedAnimation?.logic)
        assert.equal(a.resolveTrigger("anim"), a._pausedAnimation.logic.anim);
      if (run.id === "kfm-210-0-1-near-replace" && tick === 11) {
        assert.equal(a.resolveTrigger("animelemno", [0]), 2);
        assert.equal(
          session.match.opponent.resolveTrigger("anim", [], {
            name: "enemy",
            args: [],
          }),
          200,
        );
        assert.equal(
          session.match.opponent.resolveTrigger("animelemno", [0], {
            name: "enemy",
            args: [],
          }),
          2,
        );
      }
    }
    session.close();
  }
});

test("world pause preserves both animation phases and resuming consumes the queued clock once", () => {
  const files = unzipSync(
    readFileSync(new URL("../../public/kfm.zip", import.meta.url)),
  );
  const s = new CoreSession(files, { mode: "training" }),
    a = s.match.player,
    b = s.match.opponent;
  a.pos.x = -16;
  b.pos.x = 16;
  s.tick();
  a.changeState(210);
  for (let tick = 2; tick <= 11; tick++) s.tick();
  assert.equal(a.frameIndex + 1, 5);
  assert.equal(a.frameTime, 1);
  assert.equal(a.resolveTrigger("animelemno", [0]), 6);
  const before = a.hitPauseTime;
  s.match.pause = {
    owner: b,
    remaining: 2,
    movetime: 0,
    moved: new Map(),
    elapsed: 0,
  };
  s.tick();
  s.tick();
  assert.equal(a.hitPauseTime, before);
  assert.equal(a.frameIndex + 1, 5);
  assert.equal(a.frameTime, 1);
  assert.equal(a.resolveTrigger("animelemno", [0]), 6);
  for (let i = 0; i < before; i++) s.tick();
  assert.equal(a.hitPauseTime, 0);
  s.tick();
  assert.equal(a.frameIndex + 1, 6);
  assert.equal(a.frameTime, 0);
  assert.equal(a._pausedAnimation, null);
  s.tick();
  assert.equal(a.frameTime, 1);
  s.close();
});
