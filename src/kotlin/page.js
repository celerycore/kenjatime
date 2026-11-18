import "./app.css";
import {unpackArchiveBytes} from "../archive-reader.js";
import {sff} from "../formats.js";
import {readInstalledArchive,joinImportedResources,availableKotlinFighters,availableKotlinSharedAssets}
  from "./archive-import.js";
import {archiveAccept} from "../uploads.js";
import {ArchiveLibrary} from "../mobile-library.js";
import {collectBenchmarkDeviceInfo,describeBenchmarkDevice} from "../core/benchmark-device.js";
import {findBenchmarkFighters} from "../core/benchmark-roster.js";
import {paintBlendedSprite} from "./sprite-blend.js";
import {paletteCatalog,paletteRgba} from "./sprite-palette.js";
import {readSoundBank} from "./sound-assets.js";
import {KotlinAudio} from "./audio.js";
import {GamepadRumble} from "../haptics.js";
import {ControllerManager} from "../gamepads.js";

/** Browser/Capacitor adapter only: input, archive IO, sprite decoding, display.
 * Simulation and deterministic CPU behavior are compiled Kotlin/WASM.
 */
const root=document.querySelector("#app"),byId=id=>root.querySelector("#"+id);
const isAndroidShell=/Android/i.test(navigator.userAgent||"") &&
  (/;\s*wv[;)]/i.test(navigator.userAgent||"")||
    window.Capacitor?.isNativePlatform?.()===true||
    matchMedia("(display-mode: standalone)").matches);
if(isAndroidShell)document.body.classList.add("android-shell");
const canvas=byId("arena"),ctx=canvas.getContext("2d",{alpha:false});
const arenaBox=byId("arena-box"),banner=byId("banner");
function setBanner(phase,message){
  banner.dataset.phase=phase;
  banner.textContent=message;
}
const status=message=>{byId("setup-status").textContent=message};
const library=new ArchiveLibrary();
const audio=new KotlinAudio();
const controllers=new ControllerManager();
const rumble=new GamepadRumble({getGamepads:()=>controllers.poll()});
byId("sound").onchange=()=>audio.setEnabled(byId("sound").checked);
window.addEventListener("pagehide",()=>{audio.dispose();rumble.stop();});
const fighters=new Map();
const installedTables=new Map();
let importedFightFx=null,matchFightFx=null,importedCommonSound=null;
let importInProgress=false,paintedSpriteCount=0,placeholderCount=0,paintedExplodCount=0,paintedProjectileCount=0;
let lastExplodPaint=null,lastProjectilePaint=null;
let lastSpritePaintOrder=null,lastActorTransformPaint=null;
let lastEnvironmentPaint=null;
let lastPaintedRenderPlan=null;
const debugWarning=new Set();
const initialArchiveStatus="";
const inputs={pressed:new Set(),directions:0,buttons:""};
const worker=new Worker(new URL("./worker.js",import.meta.url),{type:"module"});
let lastClipboards=null;
let matchToken=0;
byId("cns-debug").addEventListener("toggle",()=>{
  worker.postMessage({type:"debug",enabled:byId("cns-debug").open});
});
let sourceCommit="";
let backend="",running=false,paused=false,latest=null,lastDraw=0;
let frameSamples=0,drawn=0,measureStart=performance.now(),renderFps=0;
let startedAt=0,recording=false,rows=[],previousTick=0,previousTime=0;
let workerStats=null,deviceInfo=null,images=[null,null],activeNames=["",""];
let activeOptions={cpu:true,endless:true,level:"4"};
const KB_KEYS=new Set(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","KeyZ","KeyX","KeyC","KeyA","KeyS","KeyD"]);
const inputKeys={KeyZ:"a",KeyX:"b",KeyC:"c",KeyA:"x",KeyS:"y",KeyD:"z"};
const KFM_URL=new URL("../../public/kfm.zip",import.meta.url);
const MB=1024*1024;
function normalize(value){return String(value||"").normalize("NFKC").toLowerCase().replace(/[^a-z0-9]/g,"")}
function chooseFighter(candidates,name){
  const n=normalize(name);
  return candidates.find(c=>normalize(c.name)===n)||
    candidates.find(c=>normalize(c.name).includes(n))||candidates[0];
}
function safeName(fighter){
  return fighter.def.info?.displayname||fighter.def.info?.name||fighter.path.split("/").at(-1);
}
async function readFighter(bytes,archiveName){
  // Bundled sample is a small trusted ZIP: keep lightweight synchronous ZIP
  // decompression; imported RAR/7z are handled by the dedicated decoder worker.
  const {unpackArchiveBytes}=await import("../archive-reader.js");
  const files=await unpackArchiveBytes(bytes,{filename:archiveName});
  const parsed=availableKotlinFighters(files,archiveName);
  if(!parsed.ready.length)throw Error("Included fighter is missing SFF, AIR or CNS files");
  return parsed.ready[0];
}
function installedStatus(){
  const pieces=[...installedTables.values()];
  if(!pieces.length)return;
  const combined=joinImportedResources(pieces);
  const result=availableKotlinFighters(combined,
    pieces.length>1?"Imported combined character archives":pieces[0].name);
  for(const fighter of result.ready){
    const stableId="installed:"+fighter.definitionPath;
    const previous=fighters.get(stableId);
    if(previous?.spriteBytes===fighter.spriteBytes)continue;
    fighter.id=stableId;
    fighters.set(stableId,fighter);
  }
  refreshRoster();
  const effectsStatus=(importedFightFx?" Common fightfx artwork is available.":"")+
    (importedCommonSound?" Common sound is available.":"");
  const messages=[];
  if(result.ready.length)messages.push("Installed: "+result.ready.map(f=>f.name).join(", ")+".");
  for(const pending of result.missing){
    const files=pending.files.slice(0,5).join(", ");
    messages.push(pending.name+" is incomplete. Required: "+files+".");
  }
  if(messages.length){
    status(messages.join(" ")+effectsStatus);
  }else if(importedFightFx||importedCommonSound){
    const label=[importedFightFx&&"fightfx artwork",importedCommonSound&&"sound"].filter(Boolean).join(" and ");
    status("Installed common "+label+" for the next fight.");
  }else{
    status("Archive extracted, but no complete MUGEN character DEF was found. Add the character archive.");
  }
}

function benchmarkFighters(){
  return findBenchmarkFighters([...fighters.values()].map(fighter=>({
    ...fighter,sprite:fighter.spriteBytes,anim:fighter.air
  })));
}

function refreshRoster(){
  for(const side of [0,1]){
    const selector=byId(side?"p2-select":"p1-select"),old=selector.value;
    selector.replaceChildren();
    for(const item of fighters.values()){
      const option=document.createElement("option");
      option.value=item.id;option.textContent=item.name+" · "+item.source;
      selector.append(option);
    }
    selector.value=fighters.has(old)?old:"kfm";
  }
  const found=benchmarkFighters();
  byId("preset").disabled=!found.ready;
  const hint=byId("preset-status");
  const message=found.ready?
    "Ready to select. Uses CPU level 4 and Endless mode.":
    "Import "+found.missing.join(" and ")+" to enable this preset.";
  if(hint.textContent!==message)hint.textContent=message;
  byId("start").disabled=!backend||fighters.size===0;
  previewMatchup();
}
function initialiseSpriteArt(item){
  if(item.bank||item.unavailable)return;
  // Nu-13's original SFF can exceed 280 MiB: parse its header once and
  // decode only visible sprite frames. Never reject a real fighter merely
  // because its archive contains a large SFF.
  if(item.spriteBytes?.byteLength>480*MB){
    item.unavailable=true;item.warning="SFF exceeds supported 480 MiB decoded limit";return;
  }
  try{
    item.bank=sff(item.spriteBytes,{externalPalettes:item.externalPalettes,cacheBytes:8*MB});
    item.index=new Map();
    for(let i=0;i<item.bank.sprites.length;i++){
      const sp=item.bank.sprites[i];
      const key=sp.group+":"+sp.number;
      if(!item.index.has(key))item.index.set(key,i);
    }
  }catch(error){
    item.unavailable=true;
    item.warning="SFF parse failed: "+error.message;
    console.warn("Visual-only SFF preview unavailable",error.message);
  }
}
function spriteImage(item,group,number,remapPalette){
  if(!item||group<0||number<0)return null;
  initialiseSpriteArt(item);
  if(item.unavailable||!item.bank)return null;
  const spriteKey=group+":"+number;
  const key=spriteKey+(remapPalette?"@pal:"+remapPalette.join(":"):"");
  const existing=item.imageCache.get(key);
  if(existing){
    item.imageCache.delete(key);item.imageCache.set(key,existing);
    return existing;
  }
  const index=item.index.get(spriteKey);
  if(index===undefined)return null;
  try{
    let sprite=item.bank.decode(index);
    if(remapPalette){
      try{sprite=item.bank.decodeWithPalette(index,...remapPalette)}
      catch{/* Preserve authored art if the target palette data is corrupt. */}
    }
    if(!sprite||sprite.w<=0||sprite.h<=0||sprite.w*sprite.h>2*1024*1024)return null;
    const image=document.createElement("canvas");
    image.width=sprite.w;image.height=sprite.h;
    image.getContext("2d").putImageData(
      new ImageData(new Uint8ClampedArray(sprite.rgba),sprite.w,sprite.h),0,0);
    const bytes=sprite.w*sprite.h*8; // decoded RGBA plus its Canvas copy
    // 32 MiB visual hot cache. Kotlin simulation does not depend on this.
    const limit=32*MB;
    while((item.decodedBytes+bytes>limit||item.imageCache.size>=256)&&item.imageCache.size){
      const oldest=item.imageCache.keys().next().value;
      item.decodedBytes-=item.imageCache.get(oldest).bytes;
      item.imageCache.delete(oldest);
    }
    const entry={key,image,rgba:sprite.rgba,bytes,w:sprite.w,h:sprite.h,
      x:sprite.x||0,y:sprite.y||0};
    if(bytes<=limit){item.imageCache.set(key,entry);item.decodedBytes+=bytes;}
    return entry;
  }catch(error){
    if(!debugWarning.has(item.id+":"+key)){
      debugWarning.add(item.id+":"+key);
      item.warning="Sprite "+key+": "+error.message;
      console.warn("Cannot decode authored SFF sprite",item.name,key,error.message);
    }
    return null;
  }
}
function previewMatchup(){
  if(running)return;
  for(const side of [1,2]){
    const fighter=fighters.get(byId("p"+side+"-select").value);
    const preview=byId("preview-p"+side),previewCtx=preview.getContext("2d");
    previewCtx.clearRect(0,0,preview.width,preview.height);
    byId("preview-name-"+side).textContent=fighter?.name||"";
    const sprite=spriteImage(fighter,0,0)||spriteImage(fighter,9000,0);
    if(!sprite)continue;
    const scale=Math.min(2.5,preview.width/sprite.w,(preview.height-10)/sprite.h);
    const width=Math.round(sprite.w*scale),height=Math.round(sprite.h*scale);
    previewCtx.imageSmoothingEnabled=false;
    previewCtx.drawImage(sprite.image,Math.round((preview.width-width)/2),preview.height-height,width,height);
  }
}
for(const id of ["p1-select","p2-select"])byId(id).addEventListener("change",previewMatchup);

function paletteSpriteImage(item,base,layers){
  if(!layers?.length)return base;
  const key=base.key+"@fx:"+JSON.stringify(layers),existing=item.imageCache.get(key);
  if(existing){item.imageCache.delete(key);item.imageCache.set(key,existing);return existing}
  const image=document.createElement("canvas");image.width=base.w;image.height=base.h;
  image.getContext("2d").putImageData(new ImageData(paletteRgba(base.rgba,layers),base.w,base.h),0,0);
  const bytes=base.w*base.h*4,limit=32*MB;
  while((item.decodedBytes+bytes>limit||item.imageCache.size>=256)&&item.imageCache.size){
    const oldest=item.imageCache.keys().next().value;
    item.decodedBytes-=item.imageCache.get(oldest).bytes;item.imageCache.delete(oldest);
  }
  const entry={image,bytes,w:base.w,h:base.h,x:base.x,y:base.y};
  item.imageCache.set(key,entry);item.decodedBytes+=bytes;return entry;
}
function whiteSpriteMask(item,img){
  if(img.whiteMask)return img.whiteMask;
  const mask=document.createElement("canvas");mask.width=img.w;mask.height=img.h;
  const mc=mask.getContext("2d");mc.drawImage(img.image,0,0);
  mc.globalCompositeOperation="source-in";mc.fillStyle="#fff";mc.fillRect(0,0,img.w,img.h);
  const bytes=img.w*img.h*4,limit=32*MB;
  while(item.decodedBytes+bytes>limit&&item.imageCache.size){
    const oldest=item.imageCache.keys().next().value;
    item.decodedBytes-=item.imageCache.get(oldest).bytes;item.imageCache.delete(oldest);
  }
  img.bytes+=bytes;item.decodedBytes+=bytes;img.whiteMask=mask;return mask;
}
function render(){
  requestAnimationFrame(render);
  if(!latest||latest.frame===lastPaintedRenderPlan?.frame)return;
  const now=performance.now();
  const targetFps=latest.targetFps||60; // authoritative Kotlin plan
  const interval=1000/targetFps;
  if(now-lastDraw<interval-1.5)return;
  lastDraw=now;drawn++;frameSamples++;
  if(now-measureStart>=500){
    renderFps=frameSamples*1000/(now-measureStart);
    byId("fps").textContent=renderFps.toFixed(1)+" FPS";
    frameSamples=0;measureStart=now;
  }
  const scale=canvas.width/960;
  ctx.setTransform(scale,0,0,scale,0,0);
  const paletteColors=latest.paletteColors||{},color=(key,fallback)=>paletteColors[key]?`rgb(${paletteColors[key].join(",")})`:fallback;
  ctx.fillStyle=color("backdrop","#102338");ctx.fillRect(0,0,960,540);
  ctx.save();ctx.translate(0,latest.stageOffsetY??0);
  ctx.fillStyle=color("ground","#183e4b");ctx.fillRect(0,405,960,135);
  ctx.strokeStyle=color("grid","#467077");ctx.lineWidth=2;
  for(let x=0;x<960;x+=64){ctx.beginPath();ctx.moveTo(x,405);ctx.lineTo(x+60,540);ctx.stroke();}
  ctx.fillStyle=color("floor","#537b75");ctx.fillRect(0,437,960,3);
  ctx.restore();
  const environmentColor=latest.environment?.color;
  if(environmentColor){
    ctx.fillStyle=color("environment",`rgb(${environmentColor.red},${environmentColor.green},${environmentColor.blue})`);
    ctx.fillRect(0,0,960,540);
  }
  const draws=latest.draws||[];
  const paintedDraws=[];
  let darkened=false;
  function darkenArena(){
    if(darkened||!latest.pause?.darken)return;
    ctx.fillStyle="#0008";
    ctx.fillRect(0,0,960,540);
    darkened=true;
  }
  for(const fighter of draws){
    if(fighter.kind==="superpause")darkenArena();
    const common=fighter.common===true;
    const item=common?matchFightFx:images[fighter.side]||images[0];
    const x=fighter.x;
    const y=fighter.y; // both projected by Kotlin's deterministic camera
    const img=spriteImage(item,fighter.group,fighter.number,fighter.remapPalette);
    if(img){
      // Authored localcoord comes from Kotlin's DEF parser (Nu-13 1008x756,
      // standard MUGEN 320x240). Avoid hard-coding a 1:1 character scale.
      const sx=fighter.pixelScaleX??((fighter.spriteScaleX??1)*(fighter.scale??1));
      const sy=fighter.pixelScaleY??((fighter.spriteScaleY??1)*(fighter.scale??1));
      ctx.save();ctx.translate(x,y);
      if([fighter.transformA,fighter.transformB,fighter.transformC,fighter.transformD].every(Number.isFinite)){
        ctx.transform(fighter.transformA,fighter.transformB,fighter.transformC,fighter.transformD,0,0);
      }else{
        ctx.scale((fighter.facing<0?-1:1)*(fighter.flipX||1)*sx,(fighter.flipY||1)*sy);
      }
      if(fighter.kind==="fighter"&&fighter.side===0){
        const transform=ctx.getTransform();
        lastActorTransformPaint=Object.freeze({frame:latest.frame,facing:fighter.facing,
          rotationDegrees:fighter.rotationDegrees??0,angleDraw:!!fighter.angleDraw,
          cameraZoom:fighter.scale??1,
          a:transform.a/scale,b:transform.b/scale,c:transform.c/scale,d:transform.d/scale,
          x:transform.e/scale,y:transform.f/scale,
          plannedA:fighter.transformA,plannedB:fighter.transformB,
          plannedC:fighter.transformC,plannedD:fighter.transformD,plannedX:x,plannedY:y});
      }
      ctx.imageSmoothingEnabled=false;
      // Sprite X/Y originate in authored SFF axes, not image center.
      if(fighter.kind==="explod"){
        const transform=ctx.getTransform();
        lastExplodPaint=Object.freeze({scaleX:Math.abs(transform.a/scale),
          scaleY:Math.abs(transform.d/scale),cameraZoom:fighter.scale??1,
          plannedScaleX:sx,plannedScaleY:sy});
      }
      if(fighter.kind==="projectile"){
        const transform=ctx.getTransform();
        lastProjectilePaint=Object.freeze({scaleX:transform.a/scale,
          scaleY:transform.d/scale,plannedScaleX:sx,plannedScaleY:sy,
          facing:fighter.facing,flipX:fighter.flipX||1,flipY:fighter.flipY||1});
      }
      const paintedImage=paletteSpriteImage(item,img,fighter.palFX);
      const blendPasses=paintBlendedSprite(ctx,paintedImage.image,-img.x,-img.y,fighter.blend,()=>whiteSpriteMask(item,img));
      paintedDraws.push(Object.freeze({side:fighter.side,kind:fighter.kind,priority:fighter.sprpriority??0,
        blend:fighter.blend,palFX:fighter.palFX,blendPasses}));
      ctx.restore();
      paintedSpriteCount++;
      if(fighter.kind==="explod"&&sx!==0&&sy!==0)paintedExplodCount++;
      if(fighter.kind==="projectile"&&sx!==0&&sy!==0)paintedProjectileCount++;
    }else if(!common){
      // When huge SFF sprites cannot be decoded on this phone, show a
      // visible placeholder without inventing artwork or blocking combat.
      ctx.fillStyle=fighter.side?"#8cc4ea":"#a6dd84";
      const size=fighter.kind==="fighter"?17:8;
      ctx.fillRect(x-size,y-size*3,size*2,size*3);
      placeholderCount++;
    }
  }
  darkenArena();
  lastSpritePaintOrder=Object.freeze({frame:latest.frame,draws:Object.freeze(paintedDraws)});
  lastEnvironmentPaint=Object.freeze({frame:latest.frame,stageOffsetY:latest.stageOffsetY??0,
    color:environmentColor?Object.freeze({...environmentColor}):null});
  lastPaintedRenderPlan=latest;
  if(!arenaBox.classList.contains("has-frame"))arenaBox.classList.add("has-frame");
  const life=latest.health||[0,0]; // correct authored maxLife from Kotlin
  ctx.fillStyle=color("hud","#0b1521");ctx.fillRect(22,20,382,31);ctx.fillRect(556,20,382,31);
  ctx.fillStyle=color("life1","#95d78f");ctx.fillRect(25,23,life[0],25);
  ctx.fillStyle=color("life2","#80bbf0");ctx.fillRect(559,23,life[1],25);
  ctx.fillStyle=color("names","#e9f2fa");ctx.font="14px system-ui";
  ctx.fillText(activeNames[0],26,69);ctx.textAlign="right";ctx.fillText(activeNames[1],934,69);ctx.textAlign="left";
}
function setQuality(){
  const mode=byId("quality").value;
  const factor=mode==="performance"?.7:mode==="balanced"?.85:1;
  canvas.width=Math.round(960*factor);
  canvas.height=Math.round(540*factor);
}
function updateInput(){
  const keys=inputs.pressed;
  const dir=(keys.has("ArrowUp")?1:0)|(keys.has("ArrowDown")?2:0)|
    (keys.has("ArrowLeft")?4:0)|(keys.has("ArrowRight")?8:0);
  const buttons=Object.keys(inputKeys).filter(k=>keys.has(k)).map(k=>inputKeys[k]).join("");
  worker.postMessage({type:"input",side:0,directions:dir,buttons});
}
window.addEventListener("keydown",event=>{
  if(!running||paused||activeOptions.cpu||!KB_KEYS.has(event.code)||
     event.target.closest?.("input,select,textarea,button,a,summary,[contenteditable]"))return;
  event.preventDefault();
  inputs.pressed.add(event.code);
  updateInput();
});
window.addEventListener("keyup",event=>{
  if(!KB_KEYS.has(event.code))return;
  inputs.pressed.delete(event.code);updateInput();
});
window.addEventListener("blur",()=>{inputs.pressed.clear();updateInput();rumble.stop();});
document.addEventListener("visibilitychange",()=>{
  if(running&&document.hidden&&!paused)byId("pause").click();
});
async function importFiles(files,{save=true}={}){
  const list=Array.from(files||[]);
  if(!list.length||importInProgress)return;
  importInProgress=true;
  byId("archive").disabled=true;
  try{
    const installed=[];
    for(const file of list){
      if(!file)continue;
      const id=file.name+":"+file.size+":"+(file.lastModified||0);
      if(installedTables.has(id))continue;
      status("Extracting "+file.name+" with the bundled RAR/7z Wasm decoder…");
      const files=await readInstalledArchive(file,message=>
        status(file.name+": "+message));
      const {fightFx,soundBytes}=availableKotlinSharedAssets(files);
      if(fightFx)importedFightFx=fightFx;
      if(soundBytes)importedCommonSound=soundBytes;
      installedTables.set(id,{name:file.name,files});
      installed.push(file);
    }
    installedStatus();
    // Save even if the first imported archive is only the Nu-13 scripts;
    // the second SFF archive will complete its real resource references.
    if(save)for(const file of installed){
      try{await library.save(file)}
      catch(error){status("Installed for this session; unable to save "+
        file.name+" for next launch: "+error.message);}
    }
  }catch(error){
    status("Import failed: "+error.message+
      ". The previous installed characters were not removed.");
  }finally{
    importInProgress=false;
    byId("archive").disabled=false;
    byId("archive").value="";
  }
}
byId("archive").accept=archiveAccept;
byId("archive").multiple=true;
byId("archive").onchange=async()=>importFiles(byId("archive").files);

byId("preset").onclick=()=>{
  const found=benchmarkFighters();
  if(!found.ready)return;
  byId("p1-select").value=found.tomoka.id;
  byId("p2-select").value=found.nu13.id;
  byId("ai-level").value="4";byId("cpu").checked=true;byId("endless").checked=true;
  byId("quality").value="performance";
  previewMatchup();
  status("Benchmark preset selected. Choose Start match to run it.");
};
function setVictoryQuote(text = ""){
  const quote=byId("victory-quote");
  quote.textContent=text;
  quote.hidden=!text;
}
function begin(){
  const p1=fighters.get(byId("p1-select").value),p2=fighters.get(byId("p2-select").value);
  if(!p1||!p2||!backend){status("Kotlin runtime or fighter missing.");return}
  finishRecording();
  running=false;paused=false;
  showHelperLimit(null);
  byId("pause").disabled=true;
  byId("reset").disabled=true;
  byId("record").disabled=true;
  previewMatchup();
  arenaBox.classList.remove("has-frame");
  activeOptions={cpu:byId("cpu").checked,endless:byId("endless").checked,level:byId("ai-level").value};
  inputs.pressed.clear();
  updateInput();
  if(!activeOptions.cpu)canvas.focus({preventScroll:true});
  setQuality();
  setVictoryQuote();
  const soundBanks=[p1,p2,{soundBytes:importedCommonSound}].map(item=>{
    try{return item.soundBank??=(readSoundBank(item.soundBytes))}
    catch(error){return {samples:new Map(),catalog:"",warnings:[error.message]}}
  });
  const paletteBanks=[p1,p2].map(item=>{
    initialiseSpriteArt(item);
    if(!item.bank)return {palettes:"",sprites:""};
    return item.paletteCatalog??=(paletteCatalog(item.bank));
  });
  rumble.stop();
  matchFightFx=importedFightFx;
  audio.configure(soundBanks);audio.setEnabled(byId("sound").checked);audio.setPaused(false);audio.prepare();
  images=[p1,p2];activeNames=[p1.name,p2.name];
  startedAt=performance.now();previousTime=0;previousTick=0;workerStats=null;latest=null;
  lastPaintedRenderPlan=null;
  frameSamples=0;renderFps=0;measureStart=startedAt;
  lastClipboards=null;byId("clipboard-output").textContent="Waiting for authored debug messages…";
  worker.postMessage({type:"start",
    matchToken:++matchToken,
    p1:{name:p1.name,air:p1.air,cns:p1.cns,cmd:p1.cmd,defText:p1.defText||"",soundCatalog:soundBanks[0].catalog,paletteCatalog:paletteBanks[0]},
    p2:{name:p2.name,air:p2.air,cns:p2.cns,cmd:p2.cmd,defText:p2.defText||"",soundCatalog:soundBanks[1].catalog,paletteCatalog:paletteBanks[1]},
    commonSoundCatalog:soundBanks[2].catalog,
    fightFx:matchFightFx&&{air:matchFightFx.air,scale:matchFightFx.scale},
    cpu:activeOptions.cpu,endless:activeOptions.endless,level:+activeOptions.level
  });
  setBanner("loading","Preparing match…");
}
byId("start").onclick=begin;
byId("pause").onclick=()=>{
  paused=!paused;
  if(paused){inputs.pressed.clear();updateInput();}
  else if(!activeOptions.cpu)canvas.focus({preventScroll:true});
  worker.postMessage({type:"pause",value:paused});
  audio.setPaused(paused);
  if(paused)rumble.stop();
  byId("pause").textContent=paused?"Resume":"Pause";
};
byId("reset").onclick=()=>{
  matchToken++;
  setVictoryQuote();
  worker.postMessage({type:"stop",matchToken});
  audio.reset();audio.setPaused(false);rumble.stop();
  running=false;paused=false;latest=null;workerStats=null;
  showHelperLimit(null);
  lastPaintedRenderPlan=null;
  inputs.pressed.clear();
  updateInput();
  finishRecording();
  previewMatchup();
  arenaBox.classList.remove("has-frame");
  lastClipboards=null;byId("clipboard-output").textContent="Match stopped.";
  byId("pause").disabled=true;
  byId("pause").textContent="Pause";
  byId("reset").disabled=true;
  byId("record").disabled=true;
  byId("start").textContent="Start match";
  setBanner("ready","Ready to fight");
  status("Match stopped. Kotlin engine resources released; imported fighters remain installed.");
};
function rowToCsv(data){
  return data.map(cell=>'"'+String(cell??"").replaceAll('"','""')+'"').join(",");
}
function showHelperLimit(diagnostics){
  const message=byId("helper-status");
  const blocked=diagnostics?.lastBlocked;
  message.hidden=!blocked;
  if(blocked){
    const text=`Helper limit hit (${diagnostics.limit}). Player ${blocked.side}, state ${blocked.controllerState}, tried to spawn helper ${blocked.id} in state ${blocked.startState}.`;
    if(message.textContent!==text)message.textContent=text;
  }
}
const fields=[
  "timestamp","elapsed_seconds","engine_backend","engine_version",
  "p1_character","p2_character","cpu_mode","cpu_level","endless_mode",
  "rendered_fps","simulation_ticks","effective_simulation_hz",
  "simulation_backlog_ticks","worker_tick_cpu_ms","helpers_alive",
  "projectiles_alive","worker_callbacks",
  "device_model","device_os","device_os_version","browser_name",
  "browser_version","browser_user_agent","device_memory_gib",
  "device_cpu_logical_cores","screen_width_px","screen_height_px","device_pixel_ratio",
  "source_commit","helper_diagnostics","engine_issues"
];
function record(stats){
  if(!recording)return;
  const dev=deviceInfo||{};
  const elapsed=(performance.now()-startedAt)/1000;
  rows.push([
    new Date().toISOString(),elapsed.toFixed(3),"Kotlin/WASM",backend,
    activeNames[0],activeNames[1],activeOptions.cpu?1:0,
    activeOptions.level,activeOptions.endless?1:0,
    renderFps.toFixed(2),stats.completed,
    stats.windowMs? (stats.ticks*1000/stats.windowMs).toFixed(3):"",
    stats.backlog,stats.averageTickCpuMs.toFixed(3),
    latest?.helpers||0,latest?.projectiles||0,stats.callbacks,
    dev.deviceModel||"Unknown",dev.osName||"Unknown",dev.osVersion||"",
    dev.browserName||"Unknown",dev.browserVersion||"",dev.userAgent||"",
    dev.deviceMemoryGiB??"",dev.hardwareConcurrency??"",
    dev.screenWidth??"",dev.screenHeight??"",dev.pixelRatio??"",
    sourceCommit,stats.helperDiagnostics?JSON.stringify(stats.helperDiagnostics):"",JSON.stringify(stats.issues)
  ]);
  byId("record-status").textContent="Recording "+rows.length+" samples • "+elapsed.toFixed(0)+" seconds. No data sent to a server.";
}
byId("record").onclick=()=>{
  rows=[];recording=true;byId("record").disabled=true;
  byId("stop-record").disabled=false;byId("csv").disabled=true;
  byId("record-status").textContent="Recording Kotlin engine and device information every 500 ms.";
};
function finishRecording(){
  if(!recording)return;
  recording=false;byId("record").disabled=!running;
  byId("stop-record").disabled=true;byId("csv").disabled=rows.length===0;
  byId("record-status").textContent="Stopped: "+rows.length+" samples ready to export.";
}
byId("stop-record").onclick=finishRecording;
byId("csv").onclick=()=>{
  const csv=[fields,...rows].map(rowToCsv).join("\r\n")+"\r\n";
  const url=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
  const link=document.createElement("a");
  link.href=url;link.download="kenjatime-kotlin-wasm-"+new Date().toISOString().replaceAll(":","-")+".csv";
  document.body.append(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),10000);
};
worker.onmessage=({data})=>{
  if(data.matchToken!==matchToken)return;
  if(data.type==="ready"){
    backend=data.version;
    byId("version").textContent=backend;
    byId("runtime-indicator").classList.add("ready");
    setBanner("ready","Ready to fight");
    refreshRoster();
  }else if(data.type==="started"){
    running=true;paused=false;byId("pause").disabled=false;byId("record").disabled=false;
    byId("reset").disabled=false;
    byId("pause").textContent="Pause";
    byId("start").textContent="Restart match";
    setBanner("running",activeOptions.endless?"Endless · 60 Hz combat":"60 Hz combat");
    status(activeOptions.endless?"Endless match running.":"Match running.");
  }else if(data.type==="frame"){
    latest=data.visuals;
    byId("entities").textContent=latest.helpers+" / "+latest.projectiles;
    byId("debt").textContent=Number(data.debt).toFixed(0)+" ticks";
  }else if(data.type==="audio"){
    if(running)audio.handle(data.events);
  }else if(data.type==="rumble"){
    if(running&&!paused&&!document.hidden&&document.hasFocus()){
      for(const motor of data.motors){
        if(motor.reset)rumble.reset(motor.side);
        else rumble.writeMotors(motor.side,motor);
      }
    }
  }else if(data.type==="clipboards"){
    if(running&&byId("cns-debug").open){
      lastClipboards=data;
      byId("clipboard-output").textContent=data.rows.map(r=>
        (r.id===r.rootId?"Player "+r.id:"Helper "+r.id+" · Player "+r.rootId)+"\n"+(r.text||"(empty)")).join("\n\n");
    }
  }else if(data.type==="stats"){
    workerStats=data;
    showHelperLimit(data.helperDiagnostics);
    byId("hz").textContent=(data.windowMs?data.ticks*1000/data.windowMs:0).toFixed(1)+" Hz";
    byId("tickcpu").textContent=data.averageTickCpuMs.toFixed(2)+" ms";
    record(data);
  }else if(data.type==="paused"){
    if(!data.value){frameSamples=0;measureStart=performance.now();}
    setBanner(data.value?"paused":"running",data.value?"Paused":
      activeOptions.endless?"Endless · 60 Hz combat":"60 Hz combat");
  }else if(data.type==="complete"){
    audio.reset();rumble.stop();
    running=false;paused=false;byId("pause").disabled=true;
    byId("reset").disabled=true;byId("record").disabled=true;
    finishRecording();
    byId("start").textContent="Start match";
    const winner=data.round.winner;
    setBanner("complete",winner===0?"Match drawn":`${activeNames[winner-1]} wins · Player ${winner}`);
    setVictoryQuote(data.round.victoryQuote??"");
  }else if(data.type==="error"){
    audio.reset();rumble.stop();
    running=false;paused=false;byId("pause").disabled=true;byId("record").disabled=true;
    byId("reset").disabled=true;
    finishRecording();
    byId("start").textContent="Start match";
    setBanner("error","Kotlin/WASM error");
    status("Kotlin runtime error: "+data.message+". The engine will not silently switch to JavaScript.");
  }else if(data.type==="stopped"){
    running=false;byId("pause").disabled=true;
    lastClipboards=null;byId("clipboard-output").textContent="Match stopped.";
    byId("reset").disabled=true;
  }
};
worker.onerror=event=>{audio.reset();rumble.stop();running=false;status("Kotlin worker could not start: "+event.message)};
window.__kenjatimeKotlinQA=Object.freeze({
  get explodPaints(){return paintedExplodCount},
  get lastExplodPaint(){return lastExplodPaint},
  get projectilePaints(){return paintedProjectileCount},
  get lastProjectilePaint(){return lastProjectilePaint},
  get lastSpritePaintOrder(){return lastSpritePaintOrder},
  get lastActorTransformPaint(){return lastActorTransformPaint},
  get lastEnvironmentPaint(){return lastEnvironmentPaint},
  get spritePaints(){return paintedSpriteCount},
  get placeholderPaints(){return placeholderCount},
  get importedCount(){return fighters.size-1},
  get sources(){return [...installedTables.values()].map(x=>x.name)},
  get lastVisualFrame(){return latest?.frame??0},
  get renderPlan(){return latest},
  get clipboards(){return lastClipboards},
  get audio(){return audio.snapshot()},
  get paintedRenderPlan(){return lastPaintedRenderPlan},
  get spriteCaches(){return images.map(item=>({bytes:item?.decodedBytes||0,entries:item?.imageCache?.size||0}))},
  get warning(){return images.find(x=>x?.warning)?.warning||""}
});
async function initialize(){
  setQuality();
  if(!import.meta.env.DEV){
    void fetch(new URL("../build-info.json",location.href),{cache:"no-cache"})
      .then(response=>response.ok?response.json():null)
      .then(info=>{sourceCommit=info?.sourceCommit||"";}).catch(()=>{});
  }
  requestAnimationFrame(render);
  collectBenchmarkDeviceInfo().then(info=>{
    deviceInfo=info;byId("device").textContent=describeBenchmarkDevice(info);
  }).catch(()=>{byId("device").textContent="Device/browser metadata unavailable."});
  const response=await fetch(KFM_URL);
  if(!response.ok)throw Error("Included KFM asset missing: "+response.status);
  const sample=await readFighter(new Uint8Array(await response.arrayBuffer()),"Bundled Kung Fu Man");
  sample.id="kfm";sample.source="Included";fighters.set("kfm",sample);refreshRoster();
  worker.postMessage({type:"init"});
  // Local-only archive library: on another device archives must be reimported.
  try{
    const saved=await library.list();
    for(const entry of saved.slice(0,8)){
      if(entry.size>200*MB)continue;
      try{
        const row=await library.read(entry.id);
        await importFiles([row.file],{save:false});
      }catch(error){console.warn("Skipping incompatible installed archive",error.message)}
    }
  }catch{}
  if(!installedTables.size)status("Kung Fu Man is included. Import archives for more fighters.");
}
initialize().catch(error=>{
  status(error.message);setBanner("error","Kotlin/WASM unavailable");
});
