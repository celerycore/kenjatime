import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {packageFiles} from "../../src/formats.js";
import {CoreSession} from "../../src/core/session.js";
import {
  LEGACY_COMPATIBILITY_TARGET,
  declaredMugenVersion,
  legacyCompatibilityReport,
  captureLegacyTraceTick,
  compareLegacyTraces,
} from "../../src/core/legacy-compatibility.js";

test("MUGEN 1.1 is a target, not a false compliance certification",()=>{
  assert.equal(LEGACY_COMPATIBILITY_TARGET.id,"mugen-1.1");
  assert.match(LEGACY_COMPATIBILITY_TARGET.reference,/Beta 1 P1/);
  assert.equal(LEGACY_COMPATIBILITY_TARGET.certified,false);
  assert.equal(LEGACY_COMPATIBILITY_TARGET.status,"target-unverified");
  assert.equal(LEGACY_COMPATIBILITY_TARGET.extendedDialect,"ikemen-go");
});

test("MUGEN 1.0 and MUGEN 1.1 declarations retain the same 1.1 target",()=>{
  const c0={path:"legacy.def",def:{info:{mugenversion:"1.0"}}};
  const c1={path:"modern.def",def:{info:{mugenversion:"1.1"}}};
  const no={path:"older.def",def:{info:{}}};
  assert.equal(declaredMugenVersion(c0),"1.0");
  assert.equal(declaredMugenVersion(c1),"1.1");
  assert.equal(declaredMugenVersion(no),null);
  const programs=new Map([
    [c0,{sources:["legacy.cns","legacy.cmd","helper.cns"],diagnostics:[]}],
    [c1,{sources:["modern.cns","extensions.zss"],diagnostics:[
      {type:"unsupported-controller",message:"fixture"},
      {type:"missing-file",message:"fixture"}]}],
    [no,{sources:[],diagnostics:[]}],
  ]);
  const result=legacyCompatibilityReport([c0,c1,no],programs);
  assert.equal(result.id,"mugen-1.1");
  assert.equal(result.certified,false);
  assert.deepEqual(result.characters.map(c=>c.declaredMugenVersion),["1.0","1.1",null]);
  assert.equal(result.characters[0].cnsStateFiles,3);
  assert.equal(result.characters[1].ikemenZssFiles,1);
  assert.equal(result.characters[1].unsupportedDiagnostics,2);
  assert.ok(result.characters.every(c=>!c.traceVerified));
});

test("exact conformance comparison catches first diverging helper state without tolerance",()=>{
  const native={ticks:[{tick:1,actors:[{id:3,helperId:1801,x:1.5,stateNo:1801}]}]};
  const same={ticks:structuredClone(native.ticks)};
  assert.deepEqual(compareLegacyTraces(native,same),{equal:true,comparedTicks:1});
  const wrong={ticks:[{tick:1,actors:[{id:3,helperId:1801,x:1.500001,stateNo:1801}]}]};
  const mismatch=compareLegacyTraces(native,wrong);
  assert.equal(mismatch.equal,false);
  assert.equal(mismatch.path,"ticks[0].actors[0].x");
  assert.equal(mismatch.expected,1.5);
  assert.equal(mismatch.actual,1.500001);
  assert.throws(()=>compareLegacyTraces({ticks:[]},native),/nonempty/);
});

test("KFM helper spawns, survives into the draw list, and appears in legacy trace",async()=>{
  const files=packageFiles(readFileSync(new URL("../../public/kfm.zip",import.meta.url)));
  const session=new CoreSession(files,{
    character:"kfm/kfm.def",opponent:"kfm/kfm.def",mode:"training",
  });
  try{
    await session.initializeScripts();
    assert.equal(session.capabilities.legacyCompatibilityTarget,"mugen-1.1");
    assert.equal(session.capabilities.nativeMugen11Certified,false);
    assert.equal(session.snapshot().compatibility.certified,false);
    const baseline=session.frame();
    const helper=session.match.spawnHelper(session.match.player,{
      id:1801,name:"MUGEN 1.1 helper smoke test",stateno:0,
      postype:"p1",pos:[75,0],
    });
    assert.ok(helper&&!helper.destroyed);
    assert.equal(helper.helperId,1801);
    assert.equal(helper.parent,session.match.player);
    session.match.tick();
    assert.ok(session.match.renderEntities.includes(helper),"helper must join the render entity list");
    const frame=session.frame();
    assert.ok(frame.draws.length>baseline.draws.length,
      "the visible helper must contribute a sprite draw");
    const trace=captureLegacyTraceTick(session.match);
    assert.equal(trace.tick,session.match.ticks);
    const captured=trace.actors.find(a=>a.id===helper.id);
    assert.equal(captured?.helperId,1801);
    assert.equal(captured?.parentId,session.match.player.id);
    assert.equal(captured?.stateNo,0);
  }finally{
    session.close();
  }
});
