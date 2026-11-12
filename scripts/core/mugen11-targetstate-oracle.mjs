#!/usr/bin/env node
/**
 * Generate a deterministic Kenjatime TargetState / ChangeAnim2 / SelfState
 * candidate timeline, then (optionally) compare it with an independently
 * captured Elecbyte M.U.G.E.N 1.1 Beta 1 P1 reference.
 *
 * Generates NO fabricated native data. No proprietary executable is shipped.
 *
 * node scripts/core/mugen11-targetstate-oracle.mjs --candidate /tmp/candidate.json
 * node scripts/core/mugen11-targetstate-oracle.mjs --candidate /tmp/candidate.json --native /local/mugen11-native.json
 *
 * Missing native reference is explicitly UNVERIFIED, not a passing parity test.
 */
import {readFileSync,writeFileSync} from "node:fs";
import {runMugen11TargetStateScenario} from "../../test/core/fixtures/mugen11-targetstate-scenario.js";
import {validateMugen11NativeOracleEvidence} from "../../src/core/mugen11-native-evidence.js";

function argument(flag,argv){
  const i=argv.indexOf(flag);
  if(i<0)return null;
  if(i===argv.length-1 || argv[i+1].startsWith("--"))
    throw Error(flag+" requires a value");
  return argv[i+1];
}
try{
  const argv=process.argv.slice(2);
  if(argv.includes("--help")){
    console.log("Usage: --candidate <path> [--native <native.json>] [--ticks <1..120>]");
    process.exit(0);
  }
  const candidateFile=argument("--candidate",argv);
  const nativeFile=argument("--native",argv);
  const tickString=argument("--ticks",argv);
  const ticks=tickString===null?5:Number(tickString);
  if(!Number.isInteger(ticks)||ticks<1||ticks>120)throw Error("ticks must be 1..120");
  const candidate=runMugen11TargetStateScenario({ticks});
  if(candidateFile)writeFileSync(candidateFile,JSON.stringify(candidate,null,2)+"\n");
  if(!nativeFile){
    console.log(JSON.stringify({
      scenario:candidate.scenario,
      candidateFile:candidateFile||null,
      observations:candidate.ticks.length,
      nativeParityStatus:"UNVERIFIED: no native M.U.G.E.N 1.1 trace was supplied",
      fullMugen11Certified:false,
    },null,2));
  }else{
    const reference=JSON.parse(readFileSync(nativeFile,"utf8"));
    const result=validateMugen11NativeOracleEvidence(reference,candidate);
    console.log(JSON.stringify(result,null,2));
    if(!result.equal)process.exitCode=1;
  }
}catch(error){
  console.error("MUGEN 1.1 native-oracle check could not complete: "+String(error?.message||error));
  process.exitCode=2;
}
