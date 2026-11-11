import {test} from "node:test";
import assert from "node:assert/strict";
import {Blob} from "node:buffer";
import {INDEXED_FRAGMENT,INDEXED_VERTEX,PredictionSmoother,createBlueprintWebGL2}
  from "../../src/core/blueprint-presentation.js";
import {PhaseTelemetry} from "../../src/core/blueprint-telemetry.js";
import {readArchiveBlob} from "../../src/core/blueprint-archive-stream.js";
import {unpackArchive} from "../../src/uploads.js";

test("R8 sprite shader keeps indexed sampling, pixel centers, and transparency",()=>{
  assert.match(INDEXED_FRAGMENT,/floor\(texture\(u_index, v_uv\)\.r \* 255\.0 \+ 0\.5\)/);
  assert.match(INDEXED_FRAGMENT,/if \(idx < 0\.5\) discard/);
  assert.match(INDEXED_FRAGMENT,/\(idx \+ 0\.5\) \/ 256\.0/);
  assert.match(INDEXED_VERTEX,/u_parallax/);
  assert.match(INDEXED_VERTEX,/u_shadow/);
  assert.throws(()=>createBlueprintWebGL2(null),/WebGL2/);
});
test("visual prediction smoother only changes render presentation",()=>{
  const p=new PredictionSmoother({blend:0.25,hardPop:15});
  assert.deepEqual(p.update(0,0),{x:0,y:0});
  assert.deepEqual(p.update(4,0),{x:1,y:0});
  assert.deepEqual(p.update(40,0),{x:13,y:0});
  assert.deepEqual(p.update(40,0),{x:19.75,y:0});
  p.reset();assert.deepEqual(p.update(100,50),{x:100,y:50});
});
test("telemetry ring uses O(1) rolling sum",()=>{
  let now=0;const t=new PhaseTelemetry({phases:["physics"],frames:3,clock:()=>now});
  for(const ms of [1,2,3,4]){
    t.begin("physics");now+=ms;t.end("physics");
  }
  assert.equal(t.average("physics"),3);
  assert.equal(t.snapshot().physics.lastMs,4);
  assert.equal(t.getSampleBuffer("physics").length,3);
  assert.throws(()=>t.end("physics"),/never started/);
});
test("archive Blob stream remains inside size budget",async()=>{
  const blob=new Blob([Uint8Array.from([1,2,3]),Uint8Array.from([4,5])]);
  const progress=[];
  assert.deepEqual([...await readArchiveBlob(blob,{onProgress:x=>progress.push(x)})],[1,2,3,4,5]);
  assert.equal(progress.at(-1).bytes,5);
  await assert.rejects(readArchiveBlob(blob,{maxBytes:4}),/limit/);
  await assert.rejects(readArchiveBlob(blob,{signal:{aborted:true}}),/aborted/);
});

test("archive upload uses worker Blob streaming without main thread buffer copy", async()=>{
  const previousWorker=globalThis.Worker;
  let sent;
  globalThis.Worker=class {
    constructor(){this.terminated=false;}
    postMessage(message,transfer){
      sent={message,transfer};
      queueMicrotask(()=>this.onmessage({data:{result:{ok:true}}}));
    }
    terminate(){this.terminated=true;}
  };
  try{
    const blob=new Blob([Uint8Array.from([1,2,3,4])]);
    assert.deepEqual(await unpackArchive(blob),{ok:true});
    assert.strictEqual(sent.message.blob,blob);
    assert.deepEqual(sent.transfer,[]);
    await assert.rejects(unpackArchive({size:129*1024*1024,stream(){}}),/limit/);
  }finally{globalThis.Worker=previousWorker;}
});
