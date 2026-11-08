import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { unzipSync } from "fflate";
import { CoreSession } from "../../src/core/session.js";
import { TrainingMatch } from "../../src/combat.js";
import { commonStates } from "../../src/common.js";
import { bodyWidthWorld } from "../../src/coordinates.js";

const encode = (text) => new TextEncoder().encode(text);
const sampleFiles = () =>
  unzipSync(readFileSync(new URL("../../public/kfm.zip", import.meta.url)));
function actor(script = "", name = "actor") {
  return {
    path: name + ".def",
    def: { info: { name }, files: { cns: name + ".cns" } },
    files: {
      [name + ".cns"]: encode(
        "[Size]\nground.front=16\nground.back=15\n[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nctrl=0\nanim=0\n" +
          script,
      ),
    },
    animations: [0, 200].map((id) => ({
      id,
      frames: [
        {
          group: 0,
          number: 0,
          ticks: -1,
          clsn2: [[-30, -40, 30, 0]],
          clsn1: id === 200 ? [[0, -30, 40, 0]] : [],
        },
      ],
    })),
  };
}
function match(script) {
  return new TrainingMatch(actor(script), {
    opponentCharacter: actor("", "victim"),
    initialize: false,
    orderedPhases: true,
    manageInputs: true,
    commonText: commonStates({ orderedPhases: true }),
  });
}

test("Core loads constants from the designated CNS while retaining states from other files", () => {
  const files = sampleFiles();
  files["kfm/kfm.def"] = encode(
    new TextDecoder()
      .decode(files["kfm/kfm.def"])
      .replace(/^(\s*cns\s*=)[^;\r\n]+/im, "$1constants.cns"),
  );
  files["kfm/constants.cns"] = encode(
    "[Data]\nlife=1234\n[Velocity]\nwalk.back=0\n",
  );
  const s = new CoreSession(files, { mode: "training" });
  assert.equal(s.match.player.maxLife, 1234);
  assert.equal(s.match.player.constant("velocity.walk.back.x"), 0);
  assert.ok(s.match.player.program.states.has(200));
  assert.ok(s.match.player.program.states.has(3050));
  s.close();
});

test("crouch entry stops walking immediately, without positional drift", () => {
  const s = new CoreSession(sampleFiles(), { mode: "training" });
  for (let i = 0; i < 8; i++) s.tick(new Set(["L"]));
  const player = s.match.player,
    x = player.pos.x;
  assert.ok(player.vel.x < 0);
  for (let i = 0; i < 4; i++) {
    s.tick(new Set(["D"]));
    assert.equal(player.pos.x, x);
    assert.equal(player.vel.x, 0);
  }
  s.close();
});

test("Width offsets extend the authored body and edge widths, including negative offsets", () => {
  const m = match("[State Wider]\ntype=Width\ntrigger1=1\nvalue=15,0\n");
  m.player.pos.x = -16;
  m.opponent.pos.x = 16;
  m.tick();
  assert.equal(bodyWidthWorld(m.player, 1), 31);
  assert.equal(m.player.pos.x, -23.5);
  assert.equal(m.opponent.pos.x, 23.5);
  m.player.width = { front: -8, back: -30, edge: [-16, 0] };
  assert.equal(bodyWidthWorld(m.player, 1), 8);
  assert.equal(bodyWidthWorld(m.player, -1), 0);
  assert.equal(bodyWidthWorld(m.player, 1, { edge: true }), 0);
});

test("hit snap and facing are deferred together, while velocity uses the eventual facing", () => {
  const m = match(
    "[Statedef 200]\ntype=S\nmovetype=A\nphysics=N\nanim=200\nctrl=0\n" +
      "[State Hit]\ntype=HitDef\ntrigger1=Time=0\nattr=S,NA\ndamage=10\npausetime=0,2\nground.velocity=-2,0\nground.hittime=10\nsnap=50,-10\np2facing=-1\nfall.xvelocity=-3\n",
  );
  m.player.pos.x = -16;
  m.opponent.pos.x = 16;
  m.player.changeState(200);
  m.tick();
  assert.deepEqual(m.opponent.pos, { x: 16, y: 0 });
  assert.equal(m.opponent.facing, -1);
  assert.equal(m.opponent.getHitVars.xvel, 2);
  assert.equal(m.opponent.getHitVars["fall.xvel"], 3);
  m.tick();
  assert.deepEqual(m.opponent.pos, { x: 34, y: -10 });
  assert.equal(m.opponent.facing, 1);
});

test("air-hit to fall transition applies gravity once and preserves the launch animation", () => {
  const s = new CoreSession(sampleFiles(), { mode: "training" }),
    a = s.match.player;
  Object.assign(a.getHitVars, {
    fall: 1,
    animtype: 4,
    xvel: -1.3,
    yvel: -25,
    yaccel: Math.fround(0.8),
  });
  a.hitTime = 20;
  a.changeAnimation(5051);
  a.changeState(5030);
  let velocity = -25;
  for (let i = 0; i < 7; i++) {
    if (i) velocity = Math.fround(velocity + Math.fround(0.8));
    s.tick();
    assert.equal(a.vel.y, velocity, "gravity on tick " + (i + 1));
  }
  assert.equal(a.stateNo, 5050);
  assert.equal(a.time, 1);
  assert.equal(a.anim, 5051);
  s.close();
});

test("scripted inputs survive frozen ticks and are consumed on the first active tick", () => {
  const s = new CoreSession(sampleFiles(), { mode: "training" }),
    m = s.match,
    a = m.player;
  a.pendingAssertedInputs.add("B");
  m.requestPause(m.opponent, { type: "superpause", time: 3 });
  m.advancePause();
  for (let i = 0; i < 3; i++) {
    s.tick();
    assert.ok(a.movementHeld("holdback"));
    assert.ok(a.pendingAssertedInputs.has("B"));
  }
  s.tick();
  assert.ok(a.movementHeld("holdback"));
  assert.equal(a.pendingAssertedInputs.size, 0);
  s.tick();
  assert.ok(!a.movementHeld("holdback"));
  s.close();
});

test("a guarded hit applies horizontal distance constraints without lifting the defender", () => {
  const m = match(
    "[Statedef 200]\ntype=S\nmovetype=A\nphysics=N\nanim=200\nctrl=0\n" +
      "[State Hit]\ntype=HitDef\ntrigger1=Time=0\nattr=S,NA\nguardflag=M\ndamage=10,1\npausetime=0,2\n" +
      "ground.hittime=10\nguard.velocity=-2\nmindist=50,-100\nmaxdist=100,-10\n",
  );
  m.player.pos.x = -16;
  m.opponent.pos.x = 16;
  m.opponent.getHitVars["fall.time"] = 123;
  m.opponent.ctrl = 1;
  m.player.changeState(200);
  m.tick(new Set(), new Set(), { opponentInput: new Set(["R"]) });
  assert.equal(m.opponent.getHitVars.guarded, 1);
  assert.equal(m.opponent.getHitVars["fall.time"], 123);
  assert.deepEqual(m.opponent.pos, { x: 16, y: 0 });
  m.tick();
  assert.deepEqual(m.opponent.pos, { x: 34, y: 0 });
});
