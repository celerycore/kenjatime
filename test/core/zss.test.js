import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { unzipSync } from "fflate";
import { CoreSession } from "../../src/core/session.js";
import { parseZss } from "../../src/zss.js";
import { parseProgram } from "../../src/runtime.js";
const encode = (text) => new TextEncoder().encode(text);
const decode = (bytes) => new TextDecoder().decode(bytes);
function session(source, extraAIR = "", suffix = ".zss") {
  const files = unzipSync(
    readFileSync(new URL("../../public/kfm.zip", import.meta.url)),
  );
  files["kfm/victim.def"] = files["kfm/kfm.def"];
  files["kfm/kfm.def"] = encode(
    decode(files["kfm/kfm.def"]).replace(
      "[Files]",
      "[Files]\nst88=probe.cns\n",
    ),
  );
  files["kfm/probe.cns" + suffix] = encode(source);
  files["kfm/kfm.air"] = encode(decode(files["kfm/kfm.air"]) + extraAIR);
  return new CoreSession(files, {
    mode: "training",
    character: "kfm/kfm.def",
    opponent: "kfm/victim.def",
  });
}
const fixture = JSON.parse(
  readFileSync(new URL("../fixtures/core/zss.json", import.meta.url)),
);
for (const run of fixture.runs)
  test(`ZSS ${run.id} matches unchanged native observations through compiled and interpreted execution`, () => {
    assert.equal(
      createHash("sha256").update(run.source).digest("hex"),
      run.sourceSha256,
    );
    for (const interpreted of [false, true]) {
      const s = session(run.source, run.extraAIR),
        a = s.match.player;
      if (interpreted)
        for (const entity of s.match.entities)
          entity.options.expressionEvaluator = null;
      a.pos.x = -16;
      s.match.opponent.pos.x = 16;
      for (const expected of run.samples) {
        s.tick();
        assert.deepEqual(
          {
            tick: expected.tick,
            time: a.time,
            variables: [...a.vars.slice(8, 14)],
            fvars: [...a.fvars.slice(0, 3)],
            map: a.vars[14],
            conditional: a.vars[15],
          },
          expected,
          `${run.id}/${expected.tick}/${interpreted}`,
        );
      }
      assert.deepEqual(a.diagnostics, []);
      if (!interpreted) assert.ok(s.expressions.stats.wasm > 0);
      s.close();
    }
  });
test("ZSS transitions stop nested loops, function controllers use local arguments, and variable indices evaluate before values", () => {
  const s = session(`[Function SetSpeed(x)]
velSet { x:$x; }
[StateDef 0;type:S;physics:N;ctrl:0;]
let speed=3.5;
call SetSpeed($speed);
var(0):=1;
var(var(0):=2):=(var(0):=3);
for i=0;10 {changeState{value:2000;}var(8):=99;}
var(9):=99;
[StateDef 2000;type:S;physics:N;ctrl:0;]
var(10):=var(10)+1;
`);
  s.tick();
  const a = s.match.player;
  assert.equal(a.stateNo, 2000);
  assert.equal(a.vel.x, 3.5);
  assert.equal(a.vars[0], 3);
  assert.equal(a.vars[2], 3);
  assert.equal(a.vars[8], 0);
  assert.equal(a.vars[9], 0);
  assert.equal(a.vars[10], 1);
  assert.deepEqual(a.diagnostics, []);
  s.close();
});
test("ZSS named maps are independent per actor and support CNS MapSet/MapAdd", () => {
  const s = session(`[StateDef 0;type:S;physics:N;ctrl:0;]
map(counter):=map(counter)+1;
mapSet{map:"fraction";value:0.25;}
mapAdd{map:"fraction";value:0.5;}
fvar(0):=map(fraction);
`);
  s.tick();
  const a = s.match.player,
    b = s.match.opponent;
  assert.equal(a.fvars[0], 0.75);
  assert.equal(a.evaluate("map(counter)/2"), 0.5);
  assert.equal(b.evaluate("map(counter)"), 0);
  a.setMap("__proto__", 7);
  assert.equal(a.evaluate('map("__proto__")'), 7);
  s.close();
});
test("DEF map defaults and custom numeric state constants link across mixed CNS/ZSS files", () => {
  const program = parseProgram({
    path: "test.def",
    def: {
      map: { Tokens: "2.5" },
      files: { cns: "constants.cns", st: "states.zss" },
    },
    files: {
      "constants.cns": encode("[Constants]\naction.id=2000\n"),
      "states.zss": encode(
        "[StateDef const(action.id);type:S;physics:N;ctrl:0;]\nvar(0):=map(tokens);",
      ),
    },
  });
  assert.ok(program.states.get(2000)?.zssNodes);
  assert.equal(program.initialMaps.get("tokens"), 2.5);
  assert.deepEqual(program.diagnostics, []);
});
test("ZSS loops and function nesting are bounded and failed compilation cannot silently run an idle fallback", () => {
  const s = session(
    "[StateDef 0;type:S;physics:N;ctrl:0;]\nwhile 1 {var(8):=var(8)+1;}",
  );
  s.tick();
  assert.equal(s.match.player.vars[8], 2500);
  assert.ok(
    s.match.player.diagnostics.some((d) => d.type === "resource-limit"),
  );
  s.tick();
  assert.equal(s.match.player.vars[8], 5000);
  s.close();
  for (const source of [
    "[StateDef 0]\nif (1+ {var(0):=1;}",
    "[StateDef 0]\ncall Missing();",
    "[StateDef 0]\nlet n=$missing;",
    "[Function Recursive()]\ncall Recursive();",
  ])
    assert.throws(() => session(source), /probe.cns.zss:/);
  assert.throws(
    () =>
      parseZss(
        "[StateDef 0]\n" +
          "switch 0 {case 0:".repeat(100) +
          "var(0):=1;" +
          "}".repeat(100),
      ),
    /nesting limit/,
  );
  assert.throws(
    () => parseZss("[StateDef 0]\n" + "if 0 {} else ".repeat(100) + "{}"),
    /nesting limit/,
  );
  assert.throws(() => parseZss("[StateDef 0]\nbreak;"), /inside a loop/);
  const program = parseProgram({
    path: "test.def",
    def: { files: { st: "test.lua" } },
    files: { "test.lua": encode("anything") },
  });
  assert.ok(
    program.diagnostics.some((d) => d.fatal && d.type === "script-language"),
  );
});
