import { test } from "node:test";
import assert from "node:assert/strict";
import { TrainingMatch } from "../../src/combat.js";

const frame = { group: 0, number: 0, ticks: -1, clsn1: [], clsn2: [] };
function character(script = "", cmd = "") {
  return {
    path: "actor.def",
    def: {
      info: { name: "Input fixture" },
      files: { cns: "actor.cns", cmd: "actor.cmd" },
    },
    files: {
      "actor.cns": new TextEncoder().encode(
        "[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nanim=0\nctrl=0\n" +
          script,
      ),
      "actor.cmd": new TextEncoder().encode(cmd),
    },
    animations: [{ id: 0, frames: [frame] }],
  };
}
const commands =
  '[Command]\nname="held"\ncommand=/x\ntime=1\n[Command]\nname="forward"\ncommand=/F\ntime=1\n';
function match(script = "", extra = "") {
  return new TrainingMatch(character(script, commands + extra), {
    opponentCharacter: character(),
    manageInputs: true,
    orderedPhases: true,
    pushboxes: false,
    initialize: false,
  });
}
const force = (flag) =>
  `[State Input]\ntype=AssertInput\ntrigger1=Time=0\nflag=${flag}\nignorehitpause=1\n`;

test("AssertInput is sampled on the next tick and combines with physical input", () => {
  const m = match(force("x"));
  m.tick();
  assert.equal(m.player.commands.has("held"), false);
  m.tick(new Set(), new Set(), { playerInput: new Set(["R"]) });
  assert.equal(m.player.commands.has("held"), true);
  assert.equal(m.player.commands.has("forward"), true);
  m.tick();
  assert.equal(m.player.commands.has("held"), false);
  assert.deepEqual(m.diagnostics, []);
});

test("asserted F/B follows facing at sampling time and reset clears old buffers", () => {
  const m = match(force("F"));
  m.tick();
  m.player.facing = -1;
  m.tick();
  assert.ok(m.player.rawInput.has("L"));
  assert.ok(m.player.commands.has("forward"));
  m.reset();
  assert.equal(m.player.commands.size, 0);
  assert.equal(m.inputBuffers.size, 2);
  m.tick();
  assert.equal(m.player.commands.has("forward"), false);
});

test("forced input remains available through hitpause; disabled helper controls stay isolated", () => {
  const m = match(force("x"));
  m.player.hitPauseTime = 2;
  m.tick();
  m.tick();
  assert.ok(m.player.commands.has("held"));
  const child = m.spawnHelper(m.player, { stateno: 0, keyctrl: 0 });
  child.pendingAssertedInputs.add("x");
  m.tick(new Set(), new Set(), { playerInput: new Set(["x"]) });
  assert.equal(child.commands.size, 0);
  assert.equal(child.rawInput.size, 0);
});

test("external state entry waits for the actor turn and begins at animation time zero", () => {
  const m = match("[Statedef 100]\ntype=A\nphysics=N\nanim=0\nctrl=0\n");
  m.tick();
  m.player.changeState(100);
  assert.equal(m.player.stateNo, 100);
  assert.equal(m.player.stateType, "S");
  m.tick();
  assert.equal(m.player.stateType, "A");
  assert.equal(m.player.time, 1);
  assert.equal(m.player.frameTime, 0);
});
