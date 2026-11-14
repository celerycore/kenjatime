import "./app.css";
import {unpackArchiveBytes} from "../archive-reader.js";
import {sff} from "../formats.js";
import {readInstalledArchive,joinImportedResources,availableKotlinFighters}
  from "./archive-import.js";
import {archiveAccept} from "../uploads.js";
import {ArchiveLibrary} from "../mobile-library.js";
import {collectBenchmarkDeviceInfo,describeBenchmarkDevice} from "../core/benchmark-device.js";
import {findBenchmarkFighters} from "../core/benchmark-roster.js";

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
const status=message=>{byId("setup-status").textContent=message};
const library=new ArchiveLibrary();
const fighters=new Map();
const installedTables=new Map();
let importInProgress=false,paintedSpriteCount=0,placeholderCount=0;
const debugWarning=new Set();
const initialArchiveStatus="";
const inputs={pressed:new Set(),directions:0,buttons:""};
const worker=new Worker(new URL("./worker.js",import.meta.url),{type:"module"});
let backend="",running=false,paused=false,latest=null,lastDraw=0;
let frameSamples=0,drawn=0,measureStart=performance.now(),renderFps=0;
let startedAt=0,recording=false,rows=[],lastSample=0,previousTick=0,previousTime=0;
let workerStats=null,deviceInfo=null,images=[null,null],activeNames=["",""];
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
    const stableId="installed:"+fighter.name.toLowerCase().replace(/\\s+/g,"-");
    const previous=fighters.get(stableId);
    if(previous?.spriteBytes===fighter.spriteBytes)continue;
    fighter.id=stableId;
    fighters.set(stableId,fighter);
  }
  refreshRoster();
  if(result.ready.length){
    status("Installed "+result.ready.map(f=>f.name).join(", ")+
      " with actual AIR/CNS and SFF sprites. Kotlin MUGEN 1.1 parity is still incomplete.");
  }else if(result.missing.length){
    const pending=result.missing[0];
    status(pending.name+" is incomplete. Required resource(s): "+
      pending.files.slice(0,5).join(", ")+
      ". Select its companion RAR/SFF archive; already extracted files are retained.");
  }else{
    status("Archive extracted, but no complete MUGEN character DEF was found. Add the character archive.");
  }
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
  const candidates=Array.from(fighters.values()).map(x=>({
    id:x.id,name:x.name,sprite:x.spriteBytes,anim:x.air
  }));
  const found=findBenchmarkFighters(candidates);
  byId("preset").disabled=!found.ready;
  byId("preset").textContent=found.ready?
    "Select Tomoka vs Nu-13 · CPU level 4":
    "Tomoka vs Nu-13 preset · import missing archives";
  byId("start").disabled=!backend||fighters.size===0;
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
    item.bank=sff(item.spriteBytes,{cacheBytes:8*MB});
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
function spriteImage(item,group,number){
  if(!item||group<0||number<0)return null;
  initialiseSpriteArt(item);
  if(item.unavailable||!item.bank)return null;
  const key=group+":"+number;
  const existing=item.imageCache.get(key);
  if(existing){
    item.imageCache.delete(key);item.imageCache.set(key,existing);
    return existing;
  }
  const index=item.index.get(key);
  if(index===undefined)return null;
  try{
    // The original code passed only two arguments to decodeWithPalette,
    // always threw "Palette 1,undefined does not exist" and silently
    // rendered every fighter as a rectangle. Use the SFF's real palette.
    let sprite=item.bank.decode(index);
    if(item.bank.palettes.some(p=>p.group===1&&p.number===1)){
      try{sprite=item.bank.decodeWithPalette(index,1,1)}
      catch{/* A character may use its authored embedded palette. */}
    }
    if(!sprite||sprite.w<=0||sprite.h<=0||sprite.w*sprite.h>2*1024*1024)return null;
    const image=document.createElement("canvas");
    image.width=sprite.w;image.height=sprite.h;
    image.getContext("2d").putImageData(
      new ImageData(new Uint8ClampedArray(sprite.rgba),sprite.w,sprite.h),0,0);
    const bytes=sprite.w*sprite.h*4;
    // 32 MiB visual hot cache. Kotlin simulation does not depend on this.
    const limit=32*MB;
    while(item.decodedBytes+bytes>limit&&item.imageCache.size){
      const oldest=item.imageCache.keys().next().value;
      item.decodedBytes-=item.imageCache.get(oldest).bytes;
      item.imageCache.delete(oldest);
    }
    const entry={image,bytes,w:sprite.w,h:sprite.h,
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
function render(){
  requestAnimationFrame(render);
  const now=performance.now();
  if(!latest)return;
  const debt=workerStats?.backlog||0;
  const targetFps=debt>=12?12:debt>=5?20:debt>1?30:60;
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
  ctx.fillStyle="#102338";ctx.fillRect(0,0,960,540);
  ctx.fillStyle="#183e4b";ctx.fillRect(0,405,960,135);
  ctx.strokeStyle="#467077";ctx.lineWidth=2;
  for(let x=0;x<960;x+=64){ctx.beginPath();ctx.moveTo(x,405);ctx.lineTo(x+60,540);ctx.stroke();}
  ctx.fillStyle="#537b75";ctx.fillRect(0,437,960,3);
  const draws=latest.draws||[];
  for(const fighter of draws){
    const item=images[fighter.side]||images[0];
    const x=480+fighter.x*1.4;
    const y=435+fighter.y*1.1;
    const img=spriteImage(item,fighter.group,fighter.number);
    if(img){
      const renderedScale=Math.min(1.8,360/img.w,340/img.h);
      ctx.save();ctx.translate(x,y);
      ctx.scale(fighter.facing<0?-renderedScale:renderedScale,renderedScale);
      ctx.imageSmoothingEnabled=false;
      // Sprite X/Y originate in authored SFF axes, not image center.
      ctx.drawImage(img.image,-img.x,-img.y);
      ctx.restore();
      paintedSpriteCount++;
    }else{
      // When huge SFF sprites cannot be decoded on this phone, show a
      // visible placeholder without inventing artwork or blocking combat.
      ctx.fillStyle=fighter.side?"#8cc4ea":"#a6dd84";
      const size=fighter.kind==="fighter"?17:8;
      ctx.fillRect(x-size,y-size*3,size*2,size*3);
      placeholderCount++;
    }
  }
  const life=[...draws].filter(d=>d.kind==="fighter");
  const l1=life.find(d=>d.side===0)?.life||0,l2=life.find(d=>d.side===1)?.life||0;
  ctx.fillStyle="#0b1521";ctx.fillRect(22,20,382,31);ctx.fillRect(556,20,382,31);
  ctx.fillStyle="#95d78f";ctx.fillRect(25,23,Math.max(0,Math.min(376,l1/1000*376)),25);
  ctx.fillStyle="#80bbf0";ctx.fillRect(559,23,Math.max(0,Math.min(376,l2/1000*376)),25);
  ctx.fillStyle="#e9f2fa";ctx.font="14px system-ui";
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
  if(!KB_KEYS.has(event.code)||document.activeElement?.tagName==="INPUT")return;
  inputs.pressed.add(event.code);
  if(running&&!byId("cpu").checked)event.preventDefault();
  updateInput();
});
window.addEventListener("keyup",event=>{
  if(!KB_KEYS.has(event.code))return;
  inputs.pressed.delete(event.code);updateInput();
});
window.addEventListener("blur",()=>{inputs.pressed.clear();updateInput();});
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
  const entries=Array.from(fighters.values());
  const found=findBenchmarkFighters(entries.map(x=>({
    id:x.id,name:x.name,sprite:x.spriteBytes,anim:x.air
  })));
  if(!found.ready)return;
  byId("p1-select").value=found.tomoka.id;
  byId("p2-select").value=found.nu13.id;
  byId("ai-level").value="4";byId("cpu").checked=true;byId("endless").checked=true;
  byId("quality").value="performance";
  status("Kotlin CPU-versus-CPU benchmark preset selected. Imported character scripts will run with Kotlin's currently supported controller subset.");
};
function begin(){
  const p1=fighters.get(byId("p1-select").value),p2=fighters.get(byId("p2-select").value);
  if(!p1||!p2||!backend){status("Kotlin runtime or fighter missing.");return}
  setQuality();
  images=[p1,p2];activeNames=[p1.name,p2.name];
  startedAt=performance.now();previousTime=0;previousTick=0;workerStats=null;latest=null;
  worker.postMessage({type:"start",
    p1:{name:p1.name,air:p1.air,cns:p1.cns,cmd:p1.cmd},
    p2:{name:p2.name,air:p2.air,cns:p2.cns,cmd:p2.cmd},
    cpu:byId("cpu").checked,endless:byId("endless").checked,
    level:+byId("ai-level").value
  });
  byId("banner").textContent="Kotlin/WASM · Preparing authored scripts";
}
byId("start").onclick=()=>{if(running)worker.postMessage({type:"stop"});begin()};
byId("pause").onclick=()=>{
  paused=!paused;worker.postMessage({type:"pause",value:paused});
  byId("pause").textContent=paused?"Resume":"Pause";
};
byId("reset").onclick=()=>{
  worker.postMessage({type:"stop"});
  running=false;paused=false;latest=null;workerStats=null;
  byId("pause").disabled=true;
  byId("pause").textContent="Pause";
  byId("reset").disabled=true;
  byId("record").disabled=true;
  byId("banner").textContent="Kotlin/WASM · Ready";
  status("Match stopped. Kotlin engine resources released; imported fighters remain installed.");
};
function rowToCsv(data){
  return data.map(cell=>'"'+String(cell??"").replaceAll('"','""')+'"').join(",");
}
const fields=[
  "timestamp","elapsed_seconds","engine_backend","engine_version",
  "p1_character","p2_character","cpu_mode","cpu_level","endless_mode",
  "rendered_fps","simulation_ticks","effective_simulation_hz",
  "simulation_backlog_ticks","worker_tick_cpu_ms","helpers_alive",
  "projectiles_alive","worker_callbacks",
  "device_model","device_os","device_os_version","browser_name",
  "browser_version","browser_user_agent","device_memory_gib",
  "device_cpu_logical_cores","screen_width_px","screen_height_px","device_pixel_ratio"
];
function record(stats){
  if(!recording)return;
  const dev=deviceInfo||{};
  const elapsed=(performance.now()-startedAt)/1000;
  rows.push([
    new Date().toISOString(),elapsed.toFixed(3),"Kotlin/WASM",backend,
    activeNames[0],activeNames[1],byId("cpu").checked?1:0,
    byId("ai-level").value,byId("endless").checked?1:0,
    renderFps.toFixed(2),stats.completed,
    stats.windowMs? (stats.ticks*1000/stats.windowMs).toFixed(3):"",
    stats.backlog,stats.averageTickCpuMs.toFixed(3),
    latest?.helpers||0,latest?.projectiles||0,stats.callbacks,
    dev.deviceModel||"Unknown",dev.osName||"Unknown",dev.osVersion||"",
    dev.browserName||"Unknown",dev.browserVersion||"",dev.userAgent||"",
    dev.deviceMemoryGiB??"",dev.hardwareConcurrency??"",
    dev.screenWidth??"",dev.screenHeight??"",dev.pixelRatio??""
  ]);
  byId("record-status").textContent="Recording "+rows.length+" samples • "+elapsed.toFixed(0)+" seconds. No data sent to a server.";
}
byId("record").onclick=()=>{
  rows=[];recording=true;byId("record").disabled=true;
  byId("stop-record").disabled=false;byId("csv").disabled=true;
  byId("record-status").textContent="Recording Kotlin engine and device information every 500 ms.";
};
byId("stop-record").onclick=()=>{
  recording=false;byId("record").disabled=!running;
  byId("stop-record").disabled=true;byId("csv").disabled=rows.length===0;
  byId("record-status").textContent="Stopped: "+rows.length+" samples ready to export.";
};
byId("csv").onclick=()=>{
  const csv=[fields,...rows].map(rowToCsv).join("\r\n")+"\r\n";
  const url=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
  const link=document.createElement("a");
  link.href=url;link.download="kenjatime-kotlin-wasm-"+new Date().toISOString().replaceAll(":","-")+".csv";
  document.body.append(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),10000);
};
worker.onmessage=({data})=>{
  if(data.type==="ready"){
    backend=data.version;byId("version").textContent=backend;refreshRoster();
  }else if(data.type==="started"){
    running=true;paused=false;byId("pause").disabled=false;byId("record").disabled=false;
    byId("reset").disabled=false;
    byId("pause").textContent="Pause";byId("banner").textContent="Kotlin/WASM · 60 Hz combat";
    status("Kotlin/WASM fight running. Special move frames can be skipped, but Kotlin simulation continues.");
  }else if(data.type==="frame"){
    latest=data.visuals;
    byId("entities").textContent=latest.helpers+" / "+latest.projectiles;
    byId("debt").textContent=Number(data.debt).toFixed(0)+" ticks";
  }else if(data.type==="stats"){
    workerStats=data;
    byId("hz").textContent=(data.windowMs?data.ticks*1000/data.windowMs:0).toFixed(1)+" Hz";
    byId("tickcpu").textContent=data.averageTickCpuMs.toFixed(2)+" ms";
    record(data);
  }else if(data.type==="paused"){
    byId("banner").textContent=data.value?"Paused · Kotlin fight frozen":"Kotlin/WASM · 60 Hz combat";
  }else if(data.type==="complete"){
    running=false;paused=false;byId("pause").disabled=true;
    byId("reset").disabled=true;byId("record").disabled=true;
    byId("banner").textContent="Match complete";
  }else if(data.type==="error"){
    running=false;paused=false;byId("pause").disabled=true;byId("record").disabled=true;
    byId("reset").disabled=true;
    byId("banner").textContent="Kotlin/WASM ERROR";
    status("Kotlin runtime error: "+data.message+". The engine will not silently switch to JavaScript.");
  }else if(data.type==="stopped"){
    running=false;byId("pause").disabled=true;
    byId("reset").disabled=true;
  }
};
worker.onerror=event=>{running=false;status("Kotlin worker could not start: "+event.message)};
window.__kenjatimeKotlinQA=Object.freeze({
  get spritePaints(){return paintedSpriteCount},
  get placeholderPaints(){return placeholderCount},
  get importedCount(){return fighters.size-1},
  get sources(){return [...installedTables.values()].map(x=>x.name)},
  get lastVisualFrame(){return latest?.frame??0},
  get warning(){return images.find(x=>x?.warning)?.warning||""}
});
async function initialize(){
  setQuality();
  requestAnimationFrame(render);
  collectBenchmarkDeviceInfo().then(info=>{
    deviceInfo=info;byId("device").textContent=describeBenchmarkDevice(info);
  }).catch(()=>{byId("device").textContent="Device/browser metadata unavailable."});
  const response=await fetch(KFM_URL);
  if(!response.ok)throw Error("Included KFM asset missing: "+response.status);
  const sample=await readFighter(new Uint8Array(await response.arrayBuffer()),"Bundled Kung Fu Man");
  sample.id="kfm";fighters.set("kfm",sample);refreshRoster();
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
  status("Bundled Kung Fu Man ready. Waiting for the Kotlin/WASM module...");
}
initialize().catch(error=>{
  status(error.message);byId("banner").textContent="Kotlin/WASM unavailable";
});
