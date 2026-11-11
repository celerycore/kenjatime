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
    "export function ktCoreConfigureArena(n,...arena) { fights.get(n).arena=arena; }",
    "export function ktCoreCamera(n) { return JSON.stringify({ enabled: true, x: 0, y: -40, zoom: 0.9, arena: fights.get(n).arena }); }",
    "export function ktCoreEnableRoundFlow(n,...frames) { fights.get(n).round=frames; }",
    "export function ktCoreRoundState(n) { return JSON.stringify({ phase:'INTRO',round:fights.get(n).round }); }",
    "export function ktCoreStep(n,...raw) { const f=fights.get(n); f.tick++; return f.tick+':'+raw.join(','); }",
    "export function ktCoreAdvance(n) { fights.get(n).tick++; }",
    "export function ktCoreChecksum(n) { return fights.get(n).tick+':checksum'; }",
    "export function ktCoreSnapshot(n,side) { const f=fights.get(n); return JSON.stringify({frame:f.tick,side,positions:f.positions,cmd1:f.args[6],cmd2:f.args[7]}); }",
    "export function ktCoreContacts() { return '[{\"attacker\":1,\"defender\":2,\"guarded\":true,\"damage\":3}]'; }",
    "export function ktCoreEvents() { return '[{\"type\":\"playsnd\",\"group\":0,\"number\":1,\"channel\":2}]'; }",
    "export function ktCoreEntities() { return '{\"helpers\":1,\"projectiles\":0}'; }",
    "export function ktCoreIssues() { return 'Unsupported controller: Explod\\n'; }",
    "export function ktCoreExportMacro(n,side,name) { return '[Command]\\nname = '+name+'\\ncommand = a\\n'; }",
    "export function ktCoreAssetRegistrySize() { return fights.size; }",
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
  fight.advance();
  assert.equal(fight.checksum(),"2:checksum");
  assert.deepEqual(fight.contacts(), [{attacker:1,defender:2,guarded:true,damage:3}]);
  assert.deepEqual(fight.presentationEvents(), [{type:"playsnd",group:0,number:1,channel:2}]);
  assert.deepEqual(fight.entities(), {helpers:1,projectiles:0});
  assert.deepEqual(fight.issues(), ["Unsupported controller: Explod"]);
  assert.match(fight.exportMacro(0,"trace"), /name = trace/);
  assert.equal(fight.sharedAssetCount(),1);
  fight.close();
  fight.close();
  assert.throws(()=>fight.step(),/released/);
  assert.throws(()=>fight.snapshot(),/released/);
  assert.throws(()=>fight.contacts(),/released/);
});

test("optional arena is passed to the Wasm module without altering JS production", async () => {
  const engine = await loadKotlinCore(mockModule());
  const fight = engine.create({
    ...characters,
    arena: {left:-180,right:180,ground:0,pushPlayers:true,autoFaceIdle:false}
  });
  assert.deepEqual(fight.camera().arena,[-180,180,0,true,false]);
  assert.equal(fight.camera().y,-40);
  assert.throws(()=>fight.configureArena({left:5,right:-5}),/ordered/);
  fight.close();
});

test("optional round sequence is explicit and isolated from live runtime", async () => {
  const engine=await loadKotlinCore(mockModule());
  const fight=engine.create({...characters,round:{introFrames:2,roundFrames:3,fightFrames:4,koFrames:5,outroFrames:6,timerSeconds:99}});
  assert.equal(fight.roundState().phase,"INTRO");
  assert.deepEqual(fight.roundState().round,[2,3,4,5,6,99]);
  assert.throws(()=>fight.enableRoundFlow({introFrames:-1}),/bounded/);
  fight.close();
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
