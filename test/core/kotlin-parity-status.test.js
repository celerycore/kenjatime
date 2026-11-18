import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { supportedControllers } from "../../src/runtime.js";

const read = path => JSON.parse(readFileSync(new URL(path, import.meta.url)));
const manifest = read("../../kotlin-core/compatibility.json");
const rare = read("../fixtures/core/rare-akuma-inventory.json");
const kfm = read("../fixtures/core/verified-movesets.json");
const combat = readFileSync(new URL("../../kotlin-core/src/commonMain/kotlin/moe/celery/kenjatime/Combat.kt", import.meta.url),"utf8");

test("Kotlin main source keeps deployed-site status and native parity evidence separate", () => {
  assert.equal(manifest.defaultSourceBranch, "main");
  assert.equal(manifest.defaultApplication, "Kotlin/WASM");
  assert.equal(manifest.productionSwitched, false);
  assert.equal(manifest.characterEvidence.kfm.kotlinNativeParity, false);
  assert.equal(manifest.characterEvidence.rareAkuma.kotlinNativeParity, false);
  assert.equal(manifest.characterEvidence.darkDonald.kotlinNativeParity, false);
  assert.equal(manifest.characterEvidence.darkDonald.archiveInRepository, false);
  assert.equal(manifest.characterEvidence.rareAkuma.archiveInRepository, false);
});

test("Kotlin registers every legacy controller name and covers the Rare Akuma inventory", () => {
  assert.equal(rare.controllerTypes.length, 60);
  const kotlinControllers = new Set(manifest.controllerSubset);
  assert.equal(kotlinControllers.size, manifest.controllerSubset.length);
  assert.deepEqual([...supportedControllers].filter(type => !kotlinControllers.has(type)), []);
  assert.deepEqual(rare.controllerTypes.filter(type => !kotlinControllers.has(type)), []);
  for (const type of manifest.controllerSubset) {
    assert.ok(combat.includes('"' + type + '"'), type + " absent from Kotlin controller execution");
  }

});

test("native KFM regression corpus remains immutable, Kotlin parity stays explicitly unverified", () => {
  assert.equal(kfm.group, "kfm-classic");
  assert.equal(kfm.cases.length, 147);
  assert.equal(manifest.characterEvidence.kfm.nativeScenariosInJsBaseline, kfm.cases.length);
  assert.equal(manifest.characterEvidence.kfm.kotlinNativeParity, false);
});
