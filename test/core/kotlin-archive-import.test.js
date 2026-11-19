import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {packageFiles,sff} from "../../src/formats.js";
import {joinImportedResources,availableKotlinFighters,availableKotlinSharedAssets} from "../../src/kotlin/archive-import.js";
import {paletteCatalog} from "../../src/kotlin/sprite-palette.js";

test("palette metadata respects linked SFF v2 palettes and excludes true-color and cyclic sprites",()=>{
 const palettes=[
   {group:1,number:1,colors:256},
   {group:1,number:2,colors:32},
 ];
 const sprites=[
   {group:0,number:0,length:12,format:2,depth:8,palette:0},
   {group:0,number:1,length:0,link:0,palette:1},
   {group:0,number:2,length:32,format:12,depth:32,palette:1},
   {group:0,number:3,length:0,link:2,palette:0},
   {group:0,number:4,length:0,link:4,palette:0},
 ];
 assert.deepEqual(paletteCatalog({version:2,palettes,sprites}),{
   palettes:"1,1,8;1,2,5",sprites:"0,0,1,1;0,1,1,2",
 });
});

const kfm=packageFiles(new Uint8Array(readFileSync("public/kfm.zip")));
test("SFF v1 shared palette lengths can count omitted RGB bytes",()=>{
 const pcx=new Uint8Array(128+2+769);
 pcx.set([10,5,1,8]);
 pcx[8]=1;
 pcx[65]=1;
 pcx[66]=2;
 pcx.set([1,2,12],128);
 pcx.set([240,50,80,130,200,90],134);
 const first=512,second=first+32+pcx.length;
 const sffBytes=new Uint8Array(second+32+pcx.length-768);
 sffBytes.set(new TextEncoder().encode("ElecbyteSpr"));
 sffBytes[15]=1;
 const header=new DataView(sffBytes.buffer);
 header.setUint32(20,2,true);
 header.setUint32(24,first,true);
 for(const [index,entry] of [first,second].entries()){
  header.setUint32(entry,index===0?second:sffBytes.length,true);
  header.setUint32(entry+4,pcx.length,true);
  header.setUint16(entry+14,index,true);
  sffBytes[entry+18]=index;
  sffBytes.set(index===0?pcx:pcx.subarray(0,pcx.length-768),entry+32);
 }
 const bank=sff(sffBytes);
 assert.deepEqual(bank.decode(1).rgba,bank.decode(0).rgba);
 assert.deepEqual([...bank.decodeIndexOnly(1).indices],[1,2]);
 sffBytes[sffBytes.length-1]=0;
 assert.throws(()=>sff(sffBytes),/Truncated SFF v1 sprite/);
});

test("a full installation supplies common states before the character's own overrides",()=>{
 const encoder=new TextEncoder(),decoder=new TextDecoder("windows-1252");
 const files=Object.fromEntries(Object.entries(kfm).map(([file,data])=>[`reference/chars/${file}`,data]));
 const cns=Object.keys(files).find(file=>file.endsWith("/kfm.cns"));
 const def=Object.keys(files).find(file=>file.endsWith("/kfm.def"));
 const text=decoder.decode(files[def]);
 if(!/^stcommon\s*=/mi.test(text))files[def]=encoder.encode(text.replace("[Files]","[Files]\nstcommon=common1.cns"));
 files[cns]=encoder.encode(decoder.decode(files[cns])+"\n[Statedef 170]\n; character override\n");
 files["reference/data/common1.cns"]=encoder.encode("[Statedef 170]\n; shared default\n");
 const item=availableKotlinFighters(files,"reference").ready.find(f=>f.definitionName==="kfm");
 assert.ok(item);
 assert.ok(item.cns.includes("; shared default"));
 assert.ok(item.cns.indexOf("; shared default") < item.cns.indexOf("; character override"));
});

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
 assert.ok(availableKotlinFighters(left,"script-only").missing.some(x=>/Kung Fu Man/i.test(x.name)));
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
 assert.ok(availableKotlinFighters(broken,"ambiguous").missing.some(x=>/Kung Fu Man/i.test(x.name)));
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


test("shared banks resolve a wrapped sound-only archive and keep optional sounds scoped to the selected art",()=>{
 const encode=text=>new TextEncoder().encode(text);
 const sound=kfm["kfm/kfm.snd"],sprite=kfm["kfm/kfm.sff"];
 const audioOnly=availableKotlinSharedAssets({"wrap/data/common.snd":sound});
 assert.equal(audioOnly.fightFx,null);
 assert.strictEqual(audioOnly.soundBytes,sound);
 const combined={
  "other/data/common.snd":sound,
  "wrap/data/fightfx.air":encode("[Begin Action 30]\n0,0,0,0,-1"),
  "wrap/data/fightfx.sff":sprite,
  "wrap/data/fight.def":encode("[Info]\nlocalcoord=640,480\n[Files]\ncommon.snd=custom.snd"),
 };
 const alone=availableKotlinSharedAssets(combined);
 assert.strictEqual(alone.fightFx.spriteBytes,sprite);
 assert.equal(alone.fightFx.scale,0.5);
 assert.equal(alone.soundBytes,null);
 const withSound=availableKotlinSharedAssets({...combined,"wrap/data/custom.snd":sound});
 assert.strictEqual(withSound.soundBytes,sound);
});
