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
    assert.ok(combat.includes('"' + type + '"'), type + " absent from Kotlin controller execution");
  }
  const matching = manifest.controllerSubset.filter(type => vocabulary.has(type));
  const missing = rare.controllerTypes.filter(type => !matching.includes(type));
  assert.ok(matching.length > 0 && missing.length > 0,
    "The interpreter must identify its real Rare Akuma overlap and gap");
  console.log("Rare Akuma Kotlin basic controller vocabulary overlap: " + matching.length +
    "/60; " + missing.length + " absent, plus partial semantics on some overlaps.");
});

test("native KFM regression corpus remains immutable, Kotlin parity stays explicitly unverified", () => {
  assert.equal(kfm.group, "kfm-classic");
  assert.equal(kfm.cases.length, 147);
  assert.equal(manifest.characterEvidence.kfm.nativeScenariosInJsBaseline, kfm.cases.length);
  assert.equal(manifest.characterEvidence.kfm.kotlinNativeParity, false);
});
