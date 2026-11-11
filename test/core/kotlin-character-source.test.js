import { test } from "node:test";
import assert from "node:assert/strict";
import { kotlinFighterFromImportedCharacter } from "../../src/core/kotlin-character-source.js";
import { createKotlinFightFromImported } from "../../src/core/kotlin-wasm-backend.js";

const bytes = text => new TextEncoder().encode(text);
function legacyPackage() {
  const files = Object.create(null);
  files["dark/constant.cns"] = bytes("[Data]\nlife = 1000\n[Statedef 0]\n");
  files["dark/normal.cns"] = bytes("[Statedef 190]\n[State 190, Intro]\ntype = ChangeState\ntrigger1 = 1\nvalue = 191\n");
  files["dark/option.txt"] = bytes("[Statedef -3]\n[State -3, Config]\ntype = VarSet\ntrigger1 = 1\nv=1\nvalue=1\n");
  files["dark/moves.cmd"] = bytes("[Command]\nname=\"jab\"\ncommand=a\n[Statedef -1]\n");
  files["dark/anim.air"] = bytes("[Begin Action 0]\n0,0,0,0,1\n");
  const checks = [
    {key:"cns",value:"constant.cns",path:"dark/constant.cns",ok:true},
    {key:"st",value:"normal.cns",path:"dark/normal.cns",ok:true},
    {key:"st2",value:"normal.cns",path:"dark/normal.cns",ok:true},
    {key:"st7",value:"option.txt",path:"dark/option.txt",ok:true},
    {key:"stcommon",value:"common1.cns",path:"dark/common1.cns",ok:false},
    {key:"cmd",value:"moves.cmd",path:"dark/moves.cmd",ok:true},
    {key:"anim",value:"anim.air",path:"dark/anim.air",ok:true},
  ];
  return {
    path:"dark/fighter.def",
    def:{info:{name:"Dark Donald"},files:{cns:"constant.cns",cmd:"moves.cmd"}},
    files,checks,
  };
}

test("legacy Donald source assembly preserves intro/OPTION and de-duplicates repeated states", () => {
  const character=kotlinFighterFromImportedCharacter(legacyPackage());
  assert.equal(character.name,"Dark Donald");
  assert.equal(character.cns.match(/\[Statedef 190\]/g)?.length,1);
  assert.match(character.cns,/\[Statedef -3\]/);
  assert.match(character.cmd,/\[Statedef -1\]/);
  assert.deepEqual(character.sourceFiles,[
    "dark/constant.cns","dark/normal.cns","dark/normal.cns","dark/option.txt"
  ]);
  assert.ok(character.warnings.some(x=>x.includes("Repeated state reference")));
  assert.ok(character.warnings.some(x=>x.includes("common1.cns")));
  assert.equal(character.requiresNativeParity,true);
});

test("modern RareAkuma ZSS is rejected explicitly, never converted to an idle CNS fighter", () => {
  const c=legacyPackage();
  c.checks[1]={key:"st0",value:"states/command.zss",path:"dark/command.zss",ok:true};
  c.files["dark/command.zss"]=bytes("[StateDef -1]\nif command = \"a\" {changestate{value:200}}\n");
  assert.throws(()=>kotlinFighterFromImportedCharacter(c),/ZSS script requires/);
  const d=legacyPackage();
  d.files["dark/normal.cns"]=bytes("[StateDef 100;type: S;anim:100;]\n");
  assert.throws(()=>kotlinFighterFromImportedCharacter(d),/Structured ZSS declaration/);
});

test("missing assets are never silently replaced with fake script content", () => {
  const c=legacyPackage();
  delete c.files["dark/anim.air"];
  assert.throws(()=>kotlinFighterFromImportedCharacter(c),/Missing authored anim/);
});

test("character package preflight validates shape before allocating Wasm handles", () => {
  assert.throws(()=>kotlinFighterFromImportedCharacter({}),/parsed Kenjatime character/);
  const c=legacyPackage();
  c.checks[4].value="required-custom-common.cns";
  assert.throws(()=>kotlinFighterFromImportedCharacter(c),/Missing required shared state/);
});


test("optional create-from-imported API preserves compatibility diagnostics", () => {
  let passed=null;
  const core={create(options) {passed=options;return {checksum:()=>"experimental",close(){}};}};
  const fight=createKotlinFightFromImported(core,{
    player1:legacyPackage(),player2:legacyPackage(),
    arena:{left:-150,right:150}
  });
  assert.equal(passed.player1.name,"Dark Donald");
  assert.equal(passed.player2.name,"Dark Donald");
  assert.equal(fight.checksum(),"experimental");
  assert.equal(fight.productionReady,false);
  assert.deepEqual(passed.arena,{left:-150,right:150});
  assert.ok(fight.sourceWarnings.some(x=>x.warning.includes("common1.cns")));
  assert.throws(()=>createKotlinFightFromImported(null,{player1:legacyPackage(),player2:legacyPackage()}),/initialized/);
});


test("Shift-JIS legacy character comments survive source assembly", () => {
  const character=legacyPackage();
  character.files["dark/option.txt"]=Uint8Array.from([
    ...new TextEncoder().encode("[Statedef -3]\n; "),
    0x83,0x65,0x83,0x58,0x83,0x67,10
  ]); // Windows-31J/Shift-JIS: テスト (synthetic comment, not original source)
  const payload=kotlinFighterFromImportedCharacter(character);
  assert.ok(payload.cns.includes("テスト"));
});
