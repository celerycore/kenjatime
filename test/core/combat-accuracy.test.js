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

test("deferred state entry keeps an existing animation running and respects explicit restarts", () => {
  const m = match(
    "[Statedef 201]\ntype=S\nphysics=N\nctrl=0\nanim=200\n[Statedef 202]\ntype=S\nphysics=N\nctrl=0\n",
  );
  m.player.changeState(201);
  m.tick();
  assert.equal(m.player.frameTime, 0);
  m.tick();
  assert.equal(m.player.frameTime, 1);
  m.player.changeState(202);
  m.tick();
  assert.equal(m.player.frameTime, 2);
  m.player.changeState(201);
  m.tick();
  assert.equal(m.player.frameTime, 0);
});

test("a queued safe state recovers after a previous tick exhausts its state-change budget", () => {
  const m = match(
    "[Statedef 201]\ntype=S\nphysics=N\nctrl=0\n[State Loop]\ntype=ChangeState\ntrigger1=1\nvalue=201\n",
  );
  m.player.changeState(201);
  m.tick();
  assert.ok(m.player.diagnostics.some((d) => d.type === "state-loop"));
  m.player.changeState(0);
  m.tick();
  assert.equal(m.player.stateNo, 0);
  assert.equal(m.player.time, 1);
  m.tick();
  assert.equal(m.player.time, 2);
});

test("scalar and argument triggers stay live across helper and target redirects", () => {
  const m = match(),
    a = m.player,
    b = m.opponent,
    helper = m.spawnHelper(a, { stateno: 0, keyctrl: 0 });
  a.time = 17;
  b.time = 29;
  a.power = 300;
  helper.time = 5;
  a.targets = [b];
  assert.equal(a.resolveTrigger("time"), 17);
  assert.equal(a.resolveTrigger("time", [], { name: "target", args: [] }), 29);
  assert.equal(helper.resolveTrigger("time"), 5);
  assert.equal(helper.resolveTrigger("power"), 300);
  a.power = 701;
  assert.equal(helper.resolveTrigger("power"), 701);
  b.getHitVars.xvel = 3;
  assert.equal(
    a.resolveTrigger("gethitvar", ["xvel"], { name: "target", args: [] }, 0.5),
    6,
  );
  assert.equal(a.resolveTrigger("const", ["size.ground.front"]), 16);
  a.commands.add("move");
  assert.equal(a.resolveTrigger("command", ["move"]), 1);
  assert.throws(() => a.resolveTrigger("__proto__"), /Unsupported trigger/);
});

test("edge triggers match captured fractional positions, both facings, air insets and coordinate widths", () => {
  const observations = JSON.parse(
    readFileSync(
      new URL("../fixtures/core/edge-triggers.json", import.meta.url),
    ),
  );
  for (const run of observations.runs) {
    const a = match().player,
      scale = 320 / run.coordinateWidth;
    a.coordinateScale = a.baseCoordinateScale = scale;
    a.stateType = run.stateType;
    for (const [index, sample] of run.samples.entries()) {
      a.pos.x = sample.x * scale;
      a.facing = sample.facing;
      a.width = { edge: sample.edges };
      for (const [i, trigger] of observations.triggers.entries())
        assert.equal(
          a.resolveTrigger(trigger),
          sample.expected[i],
          `${run.coordinateWidth}/${run.stateType}/${index}/${trigger}`,
        );
    }
  }
});

test("edge trigger reads retain the previous Width for one tick while collision width resets", () => {
  const m = match("[State Width]\ntype=Width\ntrigger1=Time=0\nedge=7,11\n");
  m.player.pos.x = 132.625;
  m.tick();
  assert.equal(m.player.resolveTrigger("frontedgebodydist"), 20);
  m.tick();
  assert.equal(m.player.width, null);
  assert.equal(m.player.resolveTrigger("frontedgebodydist"), 20);
  m.tick();
  assert.equal(m.player.resolveTrigger("frontedgebodydist"), 27);
});

test("Turn preserves physical horizontal motion during a scripted facing change", () => {
  const m = match(
    "[Statedef 201]\ntype=S\nphysics=N\nctrl=0\nvelset=3,0\n[State Turn]\ntype=Turn\ntrigger1=Time=0\n",
  );
  const x = m.player.pos.x;
  m.player.changeState(201);
  m.tick();
  assert.equal(m.player.facing, -1);
  assert.equal(m.player.vel.x, -3);
  assert.equal(m.player.pos.x, x + 3);
});

test("fall reaction defaults and explicit animation types select the captured hit-shake poses", () => {
  for (const [type, fallType, expectedType, expectedAnim] of [
    ["Hard", "", 3, 5030],
    ["Hard", "Hard", 2, 5012],
    ["Up", "", 4, 5051],
  ]) {
    const m = match(
      "[Statedef 201]\ntype=S\nmovetype=A\nphysics=N\nctrl=0\nanim=200\n" +
        "[State Hit]\ntype=HitDef\ntrigger1=Time=0\nattr=S,NA\npausetime=0,2\nfall=1\nground.type=Low\nground.velocity=-2,-4\nanimtype=" +
        type +
        "\n" +
        (fallType ? "fall.animtype=" + fallType + "\n" : ""),
    );
    for (const id of [5012, 5030, 5051])
      m.opponent.animations.set(id, {
        id,
        frames: m.opponent.animations.get(0).frames,
      });
    m.player.pos.x = -16;
    m.opponent.pos.x = 16;
    m.player.changeState(201);
    m.tick();
    assert.equal(m.opponent.getHitVars.animtype, expectedType);
    m.tick();
    assert.equal(m.opponent.anim, expectedAnim);
  }
});

test("crouching guard enters its startup pose before the held guard state", () => {
  const s = new CoreSession(sampleFiles(), { mode: "training" }),
    a = s.match.player;
  s.tick();
  a.changeState(11);
  a.inGuardDistance = true;
  s.tick(new Set(["D", "L"]));
  assert.equal(a.stateNo, 120);
  assert.equal(a.stateType, "C");
  assert.equal(a.anim, 121);
  a.inGuardDistance = true;
  s.tick(new Set(["D", "L"]));
  assert.equal(a.stateNo, 131);
  assert.equal(a.anim, 131);
  s.close();
});

test("held crouching guard retires through guard end when the threat disappears", () => {
  const s = new CoreSession(sampleFiles(), { mode: "training" }),
    a = s.match.player;
  s.tick();
  a.changeState(131);
  a.inGuardDistance = true;
  s.tick(new Set(["D", "L"]));
  assert.equal(a.stateNo, 131);
  a.inGuardDistance = false;
  s.tick(new Set(["D", "L"]));
  assert.equal(a.stateNo, 140);
  assert.equal(a.stateType, "C");
  s.tick(new Set(["D", "L"]));
  assert.equal(a.stateNo, 11);
  s.close();
});

test("default idle stops residual run speed at the native four-tick limit", () => {
  const fixture = JSON.parse(
    readFileSync(new URL("../fixtures/core/idle-stop.json", import.meta.url)),
  );
  for (const run of fixture.runs) {
    const s = new CoreSession(sampleFiles(), { mode: "training" }),
      a = s.match.player;
    s.tick();
    a.changeState(0);
    // Capture starts immediately after idle time zero has executed.
    s.tick();
    a.vel.x = run.samples[0].velocity;
    for (const expected of run.samples.slice(1)) {
      if (run.injectedVelocity !== null && a.time === 1)
        a.vel.x = run.injectedVelocity;
      s.tick();
      assert.equal(a.time, expected.time);
      assert.equal(a.vel.x, expected.velocity);
    }
    s.close();
  }
});

test("forcestand changes an unguarded crouching hit but preserves a crouching block", () => {
  for (const guarded of [false, true]) {
    const m = match(
      "[Statedef 201]\ntype=S\nmovetype=A\nphysics=N\nctrl=0\nanim=200\n" +
        "[State Hit]\ntype=HitDef\ntrigger1=Time=0\nattr=S,NA\nforcestand=1\npausetime=0,0\nguardflag=L\nground.hittime=10\n",
    );
    m.player.changeState(201);
    m.tick();
    m.opponent.stateType = "C";
    m.opponent.receiveHit(m.player.hitDef, m.player, { guarded });
    assert.equal(m.opponent.stateNo, guarded ? 152 : 5000);
    assert.equal(m.opponent.stateType, guarded ? "C" : "S");
  }
});

test("wall recoil waits for the target boundary and freezes with hitpause or world pause", () => {
  for (const facing of [1, -1]) {
    const m = match(),
      a = m.player,
      b = m.opponent;
    a.pos.x = 0;
    b.pos.x = 150 * facing;
    b.facing = facing;
    b.vel.x = 5;
    m.applyCornerPush(a, b, -10);
    a.hitPauseTime = 1;
    m.tick();
    assert.equal(a.pos.x, 0);
    assert.equal(a.cornerPush, -10 * facing);
    m.tick();
    assert.equal(a.pos.x, -10 * facing);
    assert.equal(a.cornerPush, -7 * facing);
    m.pause = { remaining: 1, movetime: 0, moved: new Map(), elapsed: 0 };
    m.tick();
    assert.equal(a.pos.x, -10 * facing);
    assert.equal(a.cornerPush, -7 * facing);
    m.tick();
    assert.equal(a.pos.x, -17 * facing);
    m.applyCornerPush(a, b, 0);
    assert.equal(m.cornerPushActors.size, 0);
    assert.equal(a.cornerPushTarget, null);
    m.tick();
    assert.equal(a.pos.x, -17 * facing);
  }
});

test("positive wall velocity offsets use the target boundary and retire with destroyed helpers", () => {
  for (const facing of [1, -1]) {
    const m = match(),
      a = m.player,
      b = m.opponent;
    a.pos.x = 0;
    b.pos.x = 160 * facing;
    m.applyCornerPush(a, b, 5);
    m.tick();
    assert.equal(a.pos.x, 5 * facing);
    const helper = m.spawnHelper(a, { stateno: 0 });
    m.applyCornerPush(helper, b, -5);
    assert.ok(m.cornerPushActors.has(helper));
    m.destroyHelper(helper);
    m.tick();
    assert.ok(!m.cornerPushActors.has(helper));
    m.reset();
    assert.equal(m.cornerPushActors.size, 0);
  }
});

test("trip motion starts without an extra gravity step and resets the hit-shake animation clock", () => {
  const s = new CoreSession(sampleFiles(), { mode: "training" }),
    a = s.match.player;
  Object.assign(a.getHitVars, {
    fall: 1,
    xvel: -1.5,
    yvel: -2,
    yaccel: Math.fround(0.35),
  });
  a.hitTime = 20;
  a.changeAnimation(5070);
  a.frameTime = 3;
  a.changeState(5071);
  s.tick();
  assert.equal(a.vel.y, -2);
  assert.equal(a.pos.y, -2);
  assert.equal(a.frameTime, 0);
  s.tick();
  assert.equal(a.vel.y, Math.fround(-1.65));
  assert.equal(a.frameTime, 1);
  s.close();
});

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
