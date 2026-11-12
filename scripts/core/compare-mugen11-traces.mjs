#!/usr/bin/env node
/**
 * Compare an independently captured M.U.G.E.N 1.1 reference trace against
 * Kenjatime's equivalent trace. Does NOT run or redistribute MUGEN binaries.
 *
 * Usage: node scripts/core/compare-mugen11-traces.mjs reference.json candidate.json
 *
 * Expected input shape: { "ticks": [ { "tick": 1, "roundNo": 1, ... }, ...] }
 * Both traces should be produced using the same character assets, seed,
 * stage, inputs, and exact reference engine version.
 */
import {readFileSync} from "node:fs";
import {compareLegacyTraces} from "../../src/core/legacy-compatibility.js";

const args=process.argv.slice(2);
if(args.length!==2){
  console.error("Usage: node scripts/core/compare-mugen11-traces.mjs native-mugen11.json kenjatime.json");
  process.exitCode=2;
}else{
  try{
    const load=path=>{
      const content=readFileSync(path,"utf8");
      const data=JSON.parse(content);
      if(!data || !Array.isArray(data.ticks))throw Error(path+" has no ticks array");
      return data;
    };
    const native=load(args[0]),candidate=load(args[1]);
    const result=compareLegacyTraces(native,candidate);
    if(!result.equal){
      console.error("MUGEN 1.1 CONFORMANCE TRACE MISMATCH");
      console.error(JSON.stringify(result,null,2));
      process.exitCode=1;
    }else{
      console.log("TRACE MATCH: "+result.comparedTicks+" supplied ticks have identical captured fields.");
      console.log("Note: a matching supplied trace alone does not certify native MUGEN 1.1 parity or authenticate the reference source.");
    }
  }catch(error){
    console.error("Invalid trace comparison: "+String(error?.message||error));
    process.exitCode=2;
  }
}
