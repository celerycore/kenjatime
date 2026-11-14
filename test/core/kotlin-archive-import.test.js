import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {packageFiles,sff} from "../../src/formats.js";
import {joinImportedResources,availableKotlinFighters} from "../../src/kotlin/archive-import.js";

const kfm=packageFiles(new Uint8Array(readFileSync("public/kfm.zip")));
test("bundled KFM has a complete playable SFF/AIR/CNS source",()=>{
 const parsed=availableKotlinFighters(kfm,"builtin");
 const item=parsed.ready.find(x=>/Kung Fu Man/i.test(x.name));
 assert.ok(item,JSON.stringify(parsed.missing));
 assert.ok(item.air.includes("Begin Action"));
 assert.ok(item.cns.includes("Statedef"));
 const bank=sff(item.spriteBytes);
 const idx=bank.sprites.findIndex(s=>s.group===0&&s.number===0);
 assert.ok(idx>=0,"KFM requires authored sprite 0,0");
 const frame=bank.decode(idx);
 assert.ok(frame.w>0&&frame.h>0);
 assert.equal(frame.rgba.length,frame.w*frame.h*4);
 assert.ok(frame.rgba.some((c,i)=>i%4!==3&&c>0),
   "real PCX/SFF art contains nonzero color pixels, not placeholders");
 assert.ok(frame.rgba.some((c,i)=>i%4===3&&c>0),
   "real PCX/SFF art contains visible alpha pixels");
 assert.ok(Number.isInteger(frame.x)&&Number.isInteger(frame.y),
   "preserve authored sprite pivot offsets");
});

test("split script RAR plus root SFF RAR reference resolves one real bytes asset",()=>{
 const left=Object.fromEntries(Object.entries(kfm).filter(([p])=>p!=="kfm/kfm.sff"));
 const right={"kfm.sff":kfm["kfm/kfm.sff"]};
 assert.ok(availableKotlinFighters(left,"script-only").missing.some(x=>/kfm/i.test(x.name)));
 assert.equal(availableKotlinFighters(right,"sprite-only").ready.length,0);
 const combined=joinImportedResources([{files:left},{files:right}]);
 assert.strictEqual(combined["kfm/kfm.sff"],kfm["kfm/kfm.sff"]);
 assert.ok(availableKotlinFighters(combined,"combined").ready.some(x=>/Kung Fu Man/i.test(x.name)));
});

test("nonunique SFF basename is not guessed or silently chosen",()=>{
 const left=Object.fromEntries(Object.entries(kfm).filter(([p])=>p!=="kfm/kfm.sff"));
 const broken=joinImportedResources([{files:left},
   {files:{"first/kfm.sff":kfm["kfm/kfm.sff"],"second/kfm.sff":kfm["kfm/kfm.sff"]}}]);
 assert.equal(broken["kfm/kfm.sff"],undefined);
 assert.ok(availableKotlinFighters(broken,"ambiguous").missing.some(x=>/kfm/i.test(x.name)));
});

test("corrupt sprite source never appears fully installed",()=>{
 const files={...kfm, "kfm/kfm.sff":new Uint8Array([1,2,3])};
 const parsed=availableKotlinFighters(files,"broken");
 assert.ok(!parsed.ready.some(x=>/Kung Fu Man/i.test(x.name)));
 assert.ok(parsed.missing.some(x=>x.files.some(v=>v.includes("SFF sprite bank"))));
});

test("identical source paths are deduplicated but conflicting archive entries rejected",()=>{
 const files=joinImportedResources([{files:{"same.sff":new Uint8Array([5])}},
   {files:{"same.sff":new Uint8Array([5])}}]);
 assert.deepEqual([...files["same.sff"]],[5]);
 assert.throws(()=>joinImportedResources([{files:{"same.sff":new Uint8Array([5])}},
   {files:{"same.sff":new Uint8Array([9])}}]),/Conflicting/);
});
