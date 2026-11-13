import { test } from "node:test";
import assert from "node:assert/strict";
import { hasExternalEngineReference, isExternalEnginePayloadPath } from "../../scripts/core/build-audit-policy.mjs";

test("independent Core can describe MUGEN 1.1 and IKEMEN dialects", () => {
  for (const value of [
    'extendedDialect: "ikemen-go"',
    'IKEMEN GO-specific ZSS/Lua triggers are optional extensions',
    'The target is native MUGEN 1.1 Beta 1 P1',
    'const legacy = "ikemen";',
    'nativeMugen11Certified:false',
  ]) assert.equal(hasExternalEngineReference(value), false, value);
});

test("reject external engine executables and adapters from bundled sources", () => {
  for (const value of [
    'fetch("/kenjatime/engine/ikemen.wasm.bin")',
    'load("/engine/ikemen.js")',
    'importScripts("/engine/wasm_exec.js")',
    'load("/engine/core.zip")',
    'kenjatimeEngineSnapshot',
    'kenjatimeAudioPull',
    'go.importObject',
    'GOGC',
  ]) assert.equal(hasExternalEngineReference(value), true, value);
});

test("reject external engine payload paths but not compatibility docs", () => {
  for (const file of [
    "dist-core/engine/core.zip", "dist-core/engine/ikemen.wasm.bin",
    "dist-core/engine/wasm_exec.js", "dist-core/ikemen.js",
  ]) assert.equal(isExternalEnginePayloadPath(file), true, file);
  for (const file of ["dist-core/assets/runtime.js", "dist-core/compatibility-ikemen-go.json"])
    assert.equal(isExternalEnginePayloadPath(file), false, file);
});
