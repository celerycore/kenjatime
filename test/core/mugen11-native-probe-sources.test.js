import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {parseSections} from "../../src/runtime.js";

const read=filename=>readFileSync(new URL("../native-mugen11-targetstate/"+filename,import.meta.url),"utf8");
const sourceActions=source=>[...source.matchAll(/\[Begin Action (\d+)\]/g)].map(m=>Number(m[1]));
const statedefs=source=>parseSections(source).filter(section=>/^statedef\s/i.test(section.name));
const hasController=(source,type)=>parseSections(source).some(section=>
  /^state\s/i.test(section.name) && section.values.type?.toLowerCase()===type.toLowerCase());

test("native MUGEN 1.1 probe contains separate original P1 AIR and borrowed CNS actions",()=>{
  const p1=read("append-p1.cns"),air=read("append-p1.air");
  const defs=statedefs(p1).map(section=>Number(section.name.split(/\s+/)[1]));
  assert.deepEqual(defs,[900,910,911]);
  assert.deepEqual(sourceActions(air),[900,9100]);
  assert.match(air,/5000,0,0,0,3/);
  assert.match(air,/5000,1,0,0,5/);
  for(const controller of ["hitdef","targetstate","changeanim2","changestate","selfstate"])
    assert.ok(hasController(p1,controller),controller+" must be in native P1 probe");
  assert.match(p1,/id = 71/);
  assert.match(p1,/elem = 2/);
  assert.match(p1,/value = 73/);
});

test("native P2 probe defines a different state 910 and P2-owned helper",()=>{
  const p2=read("append-p2.cns"),p1=read("append-p1.cns");
  const defs=statedefs(p2).map(section=>Number(section.name.split(/\s+/)[1]));
  assert.deepEqual(defs,[901,910]);
  assert.ok(hasController(p2,"helper"));
  assert.match(p2,/id = 72/);
  assert.match(p2,/value = 999/);
  assert.match(p1,/value = 73/);
  assert.ok(!p2.includes("ChangeAnim2"),
    "victim's own StateDef 910 must never borrow its own animation");
});
