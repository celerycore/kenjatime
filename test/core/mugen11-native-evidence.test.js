import {test} from "node:test";
import assert from "node:assert/strict";
import {runMugen11TargetStateScenario} from "./fixtures/mugen11-targetstate-scenario.js";
import {
  validateMugen11NativeOracleEvidence,
  MUGEN11_ORACLE_ENGINE,
  MUGEN11_ORACLE_RELEASE,
} from "../../src/core/mugen11-native-evidence.js";

// IMPORTANT: referenceFromCandidate produces MOCK DATA for validator tests.
// It is NOT a native capture and must never be checked in as a real oracle.
const referenceFromCandidate = candidate => ({
  source:"native-mugen11",
  scenario:candidate.scenario,
  provenance:{
    engine:MUGEN11_ORACLE_ENGINE,release:MUGEN11_ORACLE_RELEASE,
    executableSha256:"a".repeat(64),
    attackerAssetsSha256:"b".repeat(64),
    victimAssetsSha256:"c".repeat(64),
    captureMethod:"mock-native-validator-unit-test-only",
    stage:"synthetic-probe-stage",
    inputSequence:"no buttons; mocked first controller; deterministic frames",
  },
  ticks:structuredClone(candidate.ticks),
});

test("candidate data is always marked Kenjatime synthetic, not native",()=>{
  const candidate=runMugen11TargetStateScenario({ticks:4});
  assert.equal(candidate.source,"kenjatime-synthetic");
  assert.equal(candidate.nativeMugen11Verified,false);
});

test("native evidence gate checks exact projected fields but NEVER certifies MUGEN parity",()=>{
  const candidate=runMugen11TargetStateScenario({ticks:4});
  const ref=referenceFromCandidate(candidate);
  const result=validateMugen11NativeOracleEvidence(ref,candidate);
  assert.equal(result.equal,true);
  assert.equal(result.comparedTicks,candidate.ticks.length);
  assert.equal(result.nativeReferenceAuthenticated,false);
  assert.equal(result.fullMugen11Certified,false);
  // Even a byte-for-byte match from mock data is not native evidence.
});

test("native evidence gate reports first character state, owner or animation mismatch",()=>{
  const candidate=runMugen11TargetStateScenario({ticks:4});
  const ref=referenceFromCandidate(candidate);
  const target=ref.ticks[2].actors.find(a=>a.role==="p2");
  assert.ok(target);
  const old=target.anim;
  target.anim=old+1;
  const result=validateMugen11NativeOracleEvidence(ref,candidate);
  assert.equal(result.equal,false);
  assert.ok(result.path.includes(".anim"));
  assert.equal(result.expected,old+1);
  assert.equal(result.actual,old);
});

test("native gate rejects mislabeled engine, missing asset hashes and mismatched scenarios",()=>{
  const candidate=runMugen11TargetStateScenario({ticks:3});
  const reference=referenceFromCandidate(candidate);
  for(const [field,value] of [
    ["engine","IKEMEN GO"],
    ["release","1.0"],
    ["executableSha256","unknown"],
    ["attackerAssetsSha256",""],
    ["victimAssetsSha256","c".repeat(63)],
    ["captureMethod",""],
  ]){
    const copied=structuredClone(reference);
    copied.provenance[field]=value;
    assert.throws(()=>validateMugen11NativeOracleEvidence(copied,candidate));
  }
  const mislabeled=structuredClone(reference);
  mislabeled.source="kenjatime-synthetic";
  assert.throws(()=>validateMugen11NativeOracleEvidence(mislabeled,candidate),/independently captured/);
  const otherScenario=structuredClone(reference);
  otherScenario.scenario="another-test";
  assert.throws(()=>validateMugen11NativeOracleEvidence(otherScenario,candidate),/IDs differ/);
  const noTicks=structuredClone(reference);
  noTicks.ticks=[];
  assert.throws(()=>validateMugen11NativeOracleEvidence(noTicks,candidate),/nonempty/);
});
