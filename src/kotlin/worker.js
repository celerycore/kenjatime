/** Thin browser/Android platform scheduler for the Kotlin-owned fight.
 * No JS combat, physics, CNS triggers, AI, hitboxes, round or timer semantics.
 * This worker never discards Kotlin ticks in order to improve visual FPS.
 */
let api=null,handle=0,clock=0,channel=null,working=false,paused=false;
let gameMode="cpu",level=4,endless=true,controls=[{directions:0,buttons:""},{directions:0,buttons:""}];
let lastSnapshot=-Infinity,lastStats=-Infinity,elapsedCpuMs=0,completedInWindow=0,
  lastBatchCpu=0,callbacks=0,backendVersion="";
const emit=(type,data={})=>self.postMessage({type,...data});
function release() {
  working=false;
  if(handle && api){try{api.ktCoreRelease(handle)}catch{}}
  if(clock && api){try{api.ktCoreClockRelease(clock)}catch{}}
  handle=0;clock=0;callbacks=0;
  channel?.port1.close();channel?.port2.close();channel=null;
}
function failure(error) {
  release();
  emit("error",{message:String(error?.message||error)});
}
function schedule(delay=0) {
  if(!working||paused)return;
  if(delay>0){setTimeout(pump,delay);return}
  if(!channel && typeof MessageChannel==="function") {
    channel=new MessageChannel();
    channel.port1.onmessage=pump;
    channel.port1.start?.();
  }
  if(channel)channel.port2.postMessage(0);
  else setTimeout(pump,0);
}
function pump(){
  if(!working||paused)return;
  try{
    const now=performance.now();
    const count=api.ktCoreClockClaim(clock,now);
    let cpu=0;
    for(let i=0;i<count;i++){
      const start=performance.now();
      if(gameMode==="cpu")api.ktCoreAdvanceCpu(handle,level);
      else api.ktCoreAdvance(handle,controls[0].directions,controls[0].buttons,
        controls[1].directions,controls[1].buttons);
      api.ktCoreClockCompletedOne(clock);
      cpu+=performance.now()-start;
    }
    callbacks++;
    completedInWindow+=count;
    elapsedCpuMs+=cpu;
    lastBatchCpu=count?cpu/count:0;
    const debt=api.ktCoreClockDebt(clock);
    const interval=debt>12?48:debt>3?40:33;
    if(now-lastSnapshot>=interval){
      // Kotlin generates all fighter/helper/projectile render information.
      emit("frame",{visuals:JSON.parse(api.ktCoreVisuals(handle)),debt,backend:backendVersion});
      lastSnapshot=now;
    }
    if(now-lastStats>=500){
      emit("stats",{completed:api.ktCoreClockTicks(clock),backlog:debt,
        ticks:completedInWindow,windowMs:lastStats===-Infinity?500:now-lastStats,
        cpuMs:elapsedCpuMs,averageTickCpuMs:completedInWindow?
          elapsedCpuMs/completedInWindow:0,
        lastTickCpuMs:lastBatchCpu,callbacks,
        helperIssues:api.ktCoreIssues(handle).split("\n").filter(Boolean).length,
        backend:backendVersion});
      lastStats=now;completedInWindow=0;elapsedCpuMs=0;
    }
    if(!endless && typeof api.ktCoreRoundState==="function"){
      const round=JSON.parse(api.ktCoreRoundState(handle));
      if(round?.finished){working=false;emit("complete",{round});return}
    }
    // Kotlin's clock is the only authority on owed 60Hz ticks. Present fewer
    // snapshots when behind, but always process the same input/time sequence.
    schedule(debt>0?0:Math.max(1,Math.min(5,16.667-count*lastBatchCpu)));
  }catch(error){failure(error)}
}
async function load(){
  if(api)return api;
  // The Kotlin .mjs and its .wasm companion are copied into dist-kotlin/wasm
  // by the single-source Kotlin Gradle build. No JS simulation fallback.
  const wasmDirectory=new URL("../wasm/",import.meta.url);
  const moduleName="kenjatime-kotlin-core.mjs";
  const imported=await import(/* @vite-ignore */ new URL(moduleName,wasmDirectory).href);
  const produced=typeof imported.default==="function"?
    await imported.default():imported.default;
  const found=[produced,imported,produced?.exports].find(v=>
    v&&typeof v.ktCoreCreateWithCommands==="function"&&
    typeof v.ktCoreAdvanceCpu==="function"&&
    typeof v.ktCoreClockClaim==="function"&&
    typeof v.ktCoreVisuals==="function");
  if(!found)throw Error("Compiled Kotlin/WASM standard API unavailable: no JavaScript combat fallback.");
  api=found;
  backendVersion=api.ktCoreVersion();
  return api;
}
self.onmessage=async({data})=>{
  try{
    if(data.type==="init"){
      await load();
      emit("ready",{version:backendVersion});
    }else if(data.type==="start"){
      await load();
      release();
      const a=data.p1,b=data.p2;
      handle=api.ktCoreCreateWithCommands(a.name,b.name,
        a.air,b.air,a.cns,b.cns,a.cmd,b.cmd);
      api.ktCoreSetup(handle,-70*256,0,70*256,0);
      api.ktCoreConfigureArena(handle,-250,250,0,true,true);
      endless=data.endless!==false;
      if(!endless)api.ktCoreEnableRoundFlow(handle,45,30,30,55,60,99);
      clock=api.ktCoreClockCreate(6);
      api.ktCoreClockReset(clock,performance.now());
      level=data.level||4;
      gameMode=data.cpu?"cpu":"manual";
      paused=false;working=true;
      lastSnapshot=-Infinity;lastStats=-Infinity;
      elapsedCpuMs=0;completedInWindow=0;lastBatchCpu=0;
      emit("started",{version:backendVersion});
      schedule(0);
    }else if(data.type==="input"){
      controls[data.side?1:0]={
        directions:Number(data.directions)||0,
        buttons:String(data.buttons||"").slice(0,9)
      };
    }else if(data.type==="pause"){
      paused=!!data.value;
      if(!paused&&working){
        // Paused wall time is never converted to gameplay ticks.
        const tickCount=api.ktCoreClockTicks(clock);
        // Rather than reset the gameplay frame, preserve the match and
        // start a new wall-clock epoch for the Kotlin budget.
        api.ktCoreClockReset(clock,performance.now());
        emit("resumed",{matchFrame:tickCount});
        schedule(0);
      }
      emit("paused",{value:paused});
    }else if(data.type==="stop"){
      release();emit("stopped");
    }
  }catch(error){failure(error)}
};
