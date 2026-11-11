import {test} from "node:test";
import assert from "node:assert/strict";
import {planSpriteEvictions} from "../../src/core/gpu-sprite-budget.js";
import {CoreSession} from "../../src/core/session.js";
import {readFileSync} from "node:fs";
import {unzipSync} from "fflate";

const MiB=1024*1024;
test("Nu-13-size GPU texture pool evicts old effects, not currently visible fighter sprites",()=>{
  const sprites=[
    {id:"@white",bytes:4,lastUsedFrame:0},
    {id:"@spark",bytes:256,lastUsedFrame:0},
    {id:"fighter:idle",bytes:4*MiB,lastUsedFrame:201},
    {id:"fighter:palette",bytes:1024,lastUsedFrame:201},
    {id:"old:ice-a",bytes:24*MiB,lastUsedFrame:12},
    {id:"old:ice-b",bytes:24*MiB,lastUsedFrame:29},
    {id:"old:ice-c",bytes:8*MiB,lastUsedFrame:47}
  ];
  const resident=sprites.reduce((n,s)=>n+s.bytes,0);
  const current=new Set(["@white","@spark","fighter:idle","fighter:palette"]);
  const plan=planSpriteEvictions(sprites,{requiredBytes:12*MiB,residentBytes:resident,maxBytes:64*MiB,pinned:current});
  assert.equal(plan.fits,true);
  assert.equal(plan.oversized,false);
  assert.ok(plan.evictions.includes("old:ice-a"));
  assert.ok(!plan.evictions.includes("fighter:idle"));
  assert.ok(!plan.evictions.includes("fighter:palette"));
  assert.ok(!plan.evictions.includes("@spark"));
  const after=resident+12*MiB-sprites.filter(x=>plan.evictions.includes(x.id)).reduce((n,s)=>n+s.bytes,0);
  assert.ok(after<=64*MiB);
});
test("GPU planner refuses a sprite larger than cache without evicting all visible sprites",()=>{
  const entries=[{id:"P1",bytes:40*MiB,lastUsedFrame:2},{id:"P2",bytes:22*MiB,lastUsedFrame:2}];
  const plan=planSpriteEvictions(entries,{requiredBytes:80*MiB,residentBytes:62*MiB,maxBytes:64*MiB,pinned:new Set(["P1","P2"])});
  assert.deepEqual(plan,{fits:false,oversized:true,evictions:[]});
});
test("GPU planner does not destructively evict if all visible sprites must remain pinned",()=>{
  const entries=[{id:"P1",bytes:34*MiB,lastUsedFrame:8},{id:"P2",bytes:30*MiB,lastUsedFrame:8}];
  const plan=planSpriteEvictions(entries,{requiredBytes:1*MiB,residentBytes:64*MiB,maxBytes:64*MiB,pinned:new Set(["P1","P2"])});
  assert.deepEqual(plan,{fits:false,oversized:false,evictions:[]});
});
test("CoreSession resends an evicted idle sprite and palette without changing fight state",()=>{
  const files=unzipSync(readFileSync(new URL("../../public/kfm.zip",import.meta.url)));
  const core=new CoreSession(files,{mode:"training",opponentPalette:1});
  try {
    const first=core.frame();
    assert.ok(first.assets.length>=2);
    assert.equal(core.frame().assets.length,0,"unchanged sprites should not upload twice");
    const original=first.assets.map(a=>a.id);
    const before=core.snapshot().players;
    core.invalidateGpuAssets({evicted:original});
    const recovered=core.frame();
    assert.deepEqual(new Set(recovered.assets.map(a=>a.id)),new Set(original));
    assert.deepEqual(core.snapshot().players,before);
    assert.equal(core.frame().assets.length,0);
    core.invalidateGpuAssets({deferred:original,missing:[]});
    assert.equal(core.frame().assets.length,original.length);
    assert.ok(core.snapshot().diagnostics.some(d=>d.type==="texture-budget"));
  } finally { core.close(); }
});
test("Nu-13 long-fight texture sequence stays beneath 64 MiB without changing sprite dimensions",()=>{
  const max=64*MiB,states=new Map(),frames=1250;
  let total=0,evictions=0;
  const originalDimensions=new Map();
  for(let frame=0;frame<frames;frame++) {
    const id="ice:"+frame,bytes=(250000+(frame%5)*55000);
    originalDimensions.set(id,bytes);
    const essential=new Set(["@white","@spark","fighter"]);
    if(!states.has("fighter")){states.set("fighter",{bytes:650000,lastUsedFrame:0});total+=650000;}
    const list=[...states].map(([key,data])=>({id:key,...data}));
    const plan=planSpriteEvictions(list,{requiredBytes:bytes,residentBytes:total,maxBytes:max,pinned:essential});
    assert.equal(plan.fits,true,"frame "+frame);
    for(const gone of plan.evictions){total-=states.get(gone).bytes;states.delete(gone);evictions++;}
    states.set(id,{bytes,lastUsedFrame:frame});
    total+=bytes;
    assert.ok(total<=max);
  }
  assert.ok(evictions>500,"cache must recycle hundreds of old Nu-13 frames");
  assert.equal(originalDimensions.get("ice:999"),(250000+(999%5)*55000));
  assert.ok(!states.has("ice:0"));
});
