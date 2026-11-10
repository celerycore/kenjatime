import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => JSON.parse(readFileSync(new URL(path, import.meta.url)));
const manifest = read("../../kotlin-core/compatibility.json");
const rare = read("../fixtures/core/rare-akuma-inventory.json");
const kfm = read("../fixtures/core/verified-movesets.json");
const combat = readFileSync(new URL("../../kotlin-core/src/commonMain/kotlin/moe/celery/kenjatime/Combat.kt", import.meta.url),"utf8");

test("Kotlin engine preserves production isolation and labels real asset gaps", () => {
  assert.equal(manifest.productionSwitched, false);
  assert.equal(manifest.characterEvidence.kfm.kotlinNativeParity, false);
  assert.equal(manifest.characterEvidence.rareAkuma.kotlinNativeParity, false);
  assert.equal(manifest.characterEvidence.darkDonald.kotlinNativeParity, false);
  assert.equal(manifest.characterEvidence.darkDonald.archiveInRepository, false);
  assert.equal(manifest.characterEvidence.rareAkuma.archiveInRepository, false);
});

test("Rare Akuma 60-controller inventory exposes unsupported Kotlin gap", () => {
  assert.equal(rare.controllerTypes.length, 60);
  const vocabulary = new Set(rare.controllerTypes);
  assert.equal(new Set(manifest.controllerSubset).size, manifest.controllerSubset.length);
  for (const type of manifest.controllerSubset) {
    assert.ok(vocabulary.has(type), type + " absent from original Rare Akuma vocabulary");
    assert.ok(combat.includes('"' + type + '"'), type + " absent from Kotlin controller execution");
  }
  const missing = rare.controllerTypes.filter(type=>!manifest.controllerSubset.includes(type));
  assert.ok(missing.length>0, "A partial interpreter must not claim 100% controller support");
  console.log("Rare Akuma Kotlin basic controller subset: " + manifest.controllerSubset.length +
    "/60; " + missing.length + " missing controllers, plus partial supported semantics.");
});

test("native KFM regression corpus remains immutable, Kotlin parity stays explicitly unverified", () => {
  assert.equal(kfm.group, "kfm-classic");
  assert.equal(kfm.cases.length, 147);
  assert.equal(manifest.characterEvidence.kfm.nativeScenariosInJsBaseline, kfm.cases.length);
  assert.equal(manifest.characterEvidence.kfm.kotlinNativeParity, false);
});
