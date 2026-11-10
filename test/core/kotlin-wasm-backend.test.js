import { test } from "node:test";
import assert from "node:assert/strict";
import { loadKotlinCore } from "../../src/core/kotlin-wasm-backend.js";

function mockModule() {
  const source = [
    "const fights = new Map(); let next = 1;",
    "export function ktCoreVersion() { return '0.2.0-probe'; }",
    "export function ktCoreCreate() { throw Error('Old entrypoint used'); }",
    "export function ktCoreCreateWithCommands(...args) { const n=next++; fights.set(n,{args,tick:0,positions:[]}); return n; }",
    "export function ktCoreSetup(n,...positions) { fights.get(n).positions=positions; }",
    "export function ktCoreStep(n,...raw) { const f=fights.get(n); f.tick++; return f.tick+':'+raw.join(','); }",
    "export function ktCoreSnapshot(n,side) { const f=fights.get(n); return JSON.stringify({frame:f.tick,side,positions:f.positions,cmd1:f.args[6],cmd2:f.args[7]}); }",
    "export function ktCoreContacts() { return '[{\"attacker\":1,\"defender\":2,\"guarded\":true,\"damage\":3}]'; }",
    "export function ktCoreIssues() { return 'Unsupported controller: Explod\\n'; }",
    "export function ktCoreRelease(n) { fights.delete(n); }"
  ].join("\n");
  return "data:text/javascript," + encodeURIComponent(source);
}
const characters = {
  player1: { name: "KFM", air: "[Begin Action 0]", cns: "[Statedef 0]", cmd: "[Command]" },
  player2: { name: "Rare Akuma", air: "[Begin Action 0]", cns: "[Statedef 0]", cmd: "[Command]" }
};

test("opt-in Wasm adapter passes CMD data and fixed-point stage positions", async () => {
  const loaded = await loadKotlinCore(mockModule());
  assert.equal(loaded.version, "0.2.0-probe");
  const fight = loaded.create({ ...characters, positions: { p1: {x:-20.5,y:0}, p2:{x:70,y:-4} } });
  assert.deepEqual(fight.snapshot(0).positions, [-5248, 0, 17920, -1024]);
  assert.equal(fight.snapshot(0).cmd1, "[Command]");
  assert.equal(fight.snapshot(1).cmd2, "[Command]");
  assert.equal(fight.step({directions:8,buttons:"a"}), "1:8,a,0,");
  assert.deepEqual(fight.contacts(), [{attacker:1,defender:2,guarded:true,damage:3}]);
  assert.deepEqual(fight.issues(), ["Unsupported controller: Explod"]);
  fight.close();
  fight.close();
  assert.throws(()=>fight.step(),/released/);
  assert.throws(()=>fight.snapshot(),/released/);
  assert.throws(()=>fight.contacts(),/released/);
});

test("invalid fighters and nonfinite positions cannot leak a Wasm match", async () => {
  const loaded = await loadKotlinCore(mockModule());
  assert.throws(()=>loaded.create({player1:{name:"KFM"}}),/Both fighters/);
  assert.throws(()=>loaded.create({...characters,positions:{p1:{x:Infinity,y:0}}}),/finite/);
  const fight = loaded.create(characters);
  fight.setup({p1:{x:-100,y:0},p2:{x:100,y:0}});
  assert.equal(fight.snapshot().positions[0],-25600);
  fight.close();
});

test("missing native exports fail closed instead of switching production backend", async () => {
  const bogus = "data:text/javascript," + encodeURIComponent("export const placeholder = true");
  await assert.rejects(loadKotlinCore(bogus),/not exported/);
  await assert.rejects(loadKotlinCore(""),/required/);
});
