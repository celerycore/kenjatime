import { test } from "node:test";
import assert from "node:assert/strict";
import { GraphicsQuality } from "../../src/graphics.js";

test("Core presentation starts handheld devices at the pre-rewrite balanced preset",()=>{
  const phone=new GraphicsQuality({mode:"auto",mobile:true});
  const desktop=new GraphicsQuality({mode:"auto",mobile:false});
  assert.deepEqual(phone.settings,{scale:.75,fps:60});
  assert.deepEqual(desktop.settings,{scale:1,fps:60});
});

test("Auto degrades slow phone rendering to 30 fps presentation without changing simulation policy",()=>{
  const phone=new GraphicsQuality({mode:"auto",mobile:true});
  for(let i=0;i<200;i++)phone.observeFrame(30,33);
  assert.equal(phone.preset,"low");
  assert.deepEqual(phone.settings,{scale:.6,fps:30});
  // The manual Sharp override stays deterministic and opts out of adaptation.
  phone.setMode("high");
  for(let i=0;i<220;i++)phone.observeFrame(80,50);
  assert.deepEqual(phone.settings,{scale:1,fps:60});
  phone.setMode("auto");
  assert.deepEqual(phone.settings,{scale:.6,fps:30});
});
