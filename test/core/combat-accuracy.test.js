import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { unzipSync } from "fflate";
import { CoreSession } from "../../src/core/session.js";
import { TrainingMatch } from "../../src/combat.js";
import { commonStates } from "../../src/common.js";
import { bodyWidthWorld } from "../../src/coordinates.js";
import { parseStage, StageRuntime } from "../../src/stages.js";

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
function match(script, victimScript = "") {
  return new TrainingMatch(actor(script), {
    opponentCharacter: actor(victimScript, "victim"),
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

test("Core screen limits use stage margins and Width edge offsets independently of body size", () => {
  const m = match(),
    a = m.player;
  m.leftBound = -160;
  m.rightBound = 160;
  a.pos.x = 1000;
  m.constrainPositions({ push: false });
  assert.equal(a.pos.x, 160);
  a.width = { edge: [20, 5] };
  a.coordinateScale = 0.5;
  assert.deepEqual(m.horizontalLimits(a), { min: -157.5, max: 150 });
  a.facing = -1;
  assert.deepEqual(m.horizontalLimits(a), { min: -150, max: 157.5 });
  const text =
    "[Info]\nname=Margins\n[Camera]\nboundleft=0\nboundright=0\n[Bound]\nscreenleft=12\nscreenright=8\n[PlayerInfo]\nleftbound=-1000\nrightbound=1000\n[BGDef]\n";
  m.stage = new StageRuntime(
    parseStage("stage.def", { "stage.def": encode(text) }),
  );
  m.leftBound = -1000;
  m.rightBound = 1000;
  assert.deepEqual(m.horizontalLimits(a), { min: -138, max: 149.5 });
});

test("contact geometry refreshes after movement, facing and animation changes", () => {
  const m = match(
    "[Statedef 200]\ntype=S\nmovetype=A\nphysics=N\nanim=200\nctrl=0\n" +
      "[State Hit]\ntype=HitDef\ntrigger1=1\nattr=S,NA\ndamage=10\npausetime=0,0\nground.hittime=1\nground.velocity=0\n",
    "[Statedef 900]\ntype=S\nmovetype=I\nphysics=N\nctrl=0\nanim=201\n",
  );
  m.pushboxes = false;
  m.player.pos.x = -16;
  m.opponent.pos.x = 16;
  m.player.changeState(200);
  const helper = m.spawnHelper(m.player, { stateno: 200, keyctrl: 0 });
  m.tick();
  assert.equal(m.events.filter((e) => e.type === "hit").length, 2);
  m.opponent.pos.x = 140;
  m.tick();
  assert.equal(m.events.length, 0);
  m.opponent.pos.x = 16;
  m.player.facing = helper.facing = -1;
  m.tick();
  assert.equal(m.events.length, 0);
  m.player.facing = helper.facing = 1;
  m.opponent.animations.set(201, {
    id: 201,
    frames: [{ group: 0, number: 0, ticks: -1, clsn2: [], clsn1: [] }],
  });
  m.opponent.changeState(900);
  m.tick();
  assert.equal(m.events.length, 0);
});

test("a reversal success state stops further reversals with immediate state entry", () => {
  const attacker = actor(
    "[Statedef 200]\ntype=S\nmovetype=A\nphysics=N\nctrl=0\nanim=200\n" +
      "[State Hit]\ntype=HitDef\ntrigger1=Time=0\nattr=S,NA\ndamage=10\npausetime=0,0\nground.hittime=10\nground.velocity=0\n",
  );
  const defender = actor(
    "[Statedef 200]\ntype=S\nmovetype=I\nphysics=N\nctrl=0\nanim=200\n" +
      "[State Counter]\ntype=ReversalDef\ntrigger1=Time=0\nreversal.attr=S,NA\ndamage=5\npausetime=0,0\np1stateno=0\n",
    "counter",
  );
  const m = new TrainingMatch(attacker, {
    opponentCharacter: defender,
    initialize: false,
    pushboxes: false,
    commonText: commonStates(),
  });
  m.player.pos.x = -16;
  m.opponent.pos.x = 16;
  m.player.changeState(200);
  m.opponent.changeState(200);
  const helper = m.spawnHelper(m.player, { stateno: 200, keyctrl: 0 });
  m.tick();
  assert.equal(m.events.filter((e) => e.type === "reversal").length, 1);
  assert.equal(m.events.filter((e) => e.type === "hit").length, 1);
  assert.equal(helper.life, 1000);
  assert.equal(m.opponent.life, 990);
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

test("the hit-up animation handoff accelerates once on the transition tick", () => {
  const s = new CoreSession(sampleFiles(), { mode: "training" }),
    a = s.match.player;
  Object.assign(a.getHitVars, {
    fall: 1,
    animtype: 2,
    xvel: -1,
    yvel: -4,
    yaccel: Math.fround(0.35),
  });
  a.pos.y = -100;
  a.hitTime = 100;
  a.changeAnimation(5012);
  a.changeState(5030);
  let velocity = -4,
    entered = false;
  for (let i = 0; i < 30; i++) {
    if (i) velocity = Math.fround(velocity + Math.fround(0.35));
    s.tick();
    assert.equal(a.vel.y, velocity, "gravity on tick " + (i + 1));
    if (a.stateNo === 5035) {
      entered = true;
      break;
    }
  }
  assert.ok(entered);
  assert.equal(a.anim, 5035);
  s.close();
});

test("a hit preserves contact-frame velocity until the deferred hit-state header runs", () => {
  const m = match(
    "[Statedef 200]\ntype=S\nmovetype=A\nphysics=N\nanim=200\nctrl=0\n" +
      "[State Hit]\ntype=HitDef\ntrigger1=Time=0\nattr=S,NA\ndamage=10\npausetime=0,2\nground.hittime=10\nground.velocity=-2\n",
  );
  m.player.pos.x = -16;
  m.opponent.pos.x = 16;
  m.opponent.vel.x = -3;
  m.player.changeState(200);
  m.tick();
  assert.equal(m.opponent.stateNo, 5000);
  assert.equal(m.opponent.vel.x, -3);
  m.tick();
  assert.equal(m.opponent.vel.x, 0);
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
