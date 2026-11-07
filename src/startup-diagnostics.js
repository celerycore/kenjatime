const key='kenjatime.startup.report.v1',maxPhases=48;
const labels={
 'core-download':'Loading included resources','core-unpack':'Unpacking included resources','core-catalog':'Checking the included fighter',
 'library-open':'Opening the installed library','library-read':'Reading library metadata','legacy-read':'Checking older saved imports',
 'library-reset':'Resetting saved imports','catalog-render':'Preparing your roster','preview':'Preparing the fighter preview',
 'native-info':'Checking Android startup','storage-estimate':'Checking available storage'
};
const numericData=data=>Object.fromEntries(Object.entries(data||{}).filter(([k,v])=>/^[a-zA-Z][a-zA-Z0-9]{0,40}$/.test(k)&&(typeof v==='boolean'||typeof v==='number'&&Number.isFinite(v))));

export function createStartupDiagnostics({storage,now=()=>performance.now(),wall=()=>Date.now(),environment={}}={}){
 if(storage===undefined)try{storage=globalThis.localStorage;}catch{storage=null;}
 const start=now(),listeners=new Set();let timer,observer,ended=false,previous=[];
 try{const raw=storage?.getItem(key);if(raw&&raw.length<49152){const saved=JSON.parse(raw);if(saved.format==='kenjatime-startup-v1'&&Array.isArray(saved.sessions))previous=saved.sessions.slice(0,2).map(s=>({...s,status:s.status==='loading'?'interrupted':s.status}));}}catch{}
 const current={startedAt:new Date(wall()).toISOString(),status:'loading',elapsedMs:0,build:{version:typeof __KENJATIME_APP_VERSION__==='undefined'?'development':__KENJATIME_APP_VERSION__,startupRevision:typeof __KENJATIME_STARTUP_REVISION__==='undefined'?'development':__KENJATIME_STARTUP_REVISION__,engineRevision:typeof __KENJATIME_ENGINE_REVISION__==='undefined'?'development':__KENJATIME_ENGINE_REVISION__},environment,metrics:{},phases:[],persistenceAvailable:true};
 const snapshot=()=>({format:'kenjatime-startup-v1',sessions:[{...current,elapsedMs:ended?current.elapsedMs:Math.round(now()-start),phases:current.phases.map(p=>({...p,durationMs:p.status==='pending'?Math.round(now()-start-p.startedMs):p.durationMs}))},...previous]});
 function persist(){clearTimeout(timer);timer=undefined;try{const data=JSON.stringify(snapshot());if(data.length<=49152&&storage)storage.setItem(key,data);else current.persistenceAvailable=false;}catch{current.persistenceAvailable=false;}}
 const hidden=()=>{if(globalThis.document?.visibilityState==='hidden')persist();};
 globalThis.addEventListener?.('pagehide',persist);globalThis.document?.addEventListener('visibilitychange',hidden);
 function update(){for(const listener of listeners)listener();if(!timer)timer=setTimeout(persist,150);}
 function begin(code,{critical=true}={}){
  if(ended||current.phases.length>=maxPhases)return{end(){},fail(){},note(){}};
  if(!Object.hasOwn(labels,code))throw Error('Unknown startup phase');
  const p={code,label:labels[code],status:'pending',critical,startedMs:Math.round(now()-start),durationMs:0,data:{}};current.phases.push(p);update();
  const end=(status='ok',data={})=>{if(p.status!=='pending')return;p.status=status;p.durationMs=Math.round(now()-start-p.startedMs);p.data={...p.data,...numericData(data)};update();};
  return{end,fail(error){p.error={name:String(error?.name||'Error').slice(0,60),...(typeof error?.code==='string'?{code:error.code.slice(0,60)}:{})};end(error?.name==='TimeoutError'?'timed-out':error?.code==='library-blocked'?'blocked':'failed');},note(data){p.data={...p.data,...numericData(data)};update();}};
 }
 function measure(code,work,options){const step=begin(code,options);try{const value=work(step);if(value&&typeof value.then==='function')return value.then(v=>{step.end();return v;},error=>{step.fail(error);throw error;});step.end();return value;}catch(error){step.fail(error);throw error;}}
 function finish(status='ready'){if(ended)return;ended=true;current.status=status;current.elapsedMs=Math.round(now()-start);update();setTimeout(()=>observer?.disconnect(),500);}
 function metrics(data){if(ended)return;current.metrics={...current.metrics,...numericData(data)};update();}
 function platform(data){const allowed=['platform','manufacturer','model','androidApi','appVersion','versionCode','webViewVersion','nativeCreateToBridgeMs','nativeElapsedMs','restoredActivity','availableMemoryBytes','lowMemory','availableDiskBytes'];current.native=Object.fromEntries(allowed.filter(k=>['string','number','boolean'].includes(typeof data?.[k])).map(k=>[k,typeof data[k]==='string'?data[k].slice(0,160):data[k]]));update();}
 try{if(typeof PerformanceObserver==='function'&&PerformanceObserver.supportedEntryTypes?.includes('longtask')){observer=new PerformanceObserver(list=>{for(const e of list.getEntries()){current.metrics.longTasks=(current.metrics.longTasks||0)+1;current.metrics.longestTaskMs=Math.round(Math.max(current.metrics.longestTaskMs||0,e.duration));}update();});observer.observe({type:'longtask'});}}catch{}
 update();
 return{begin,measure,finish,metrics,platform,snapshot,persist,subscribe(listener){listeners.add(listener);return()=>listeners.delete(listener);},dispose(){clearTimeout(timer);observer?.disconnect();globalThis.removeEventListener?.('pagehide',persist);globalThis.document?.removeEventListener('visibilitychange',hidden);persist();listeners.clear();}};
}

export function browserStartupEnvironment(){
 let navigation='unknown';try{navigation=performance.getEntriesByType('navigation')[0]?.type||navigation;}catch{}
 return{navigation,userAgent:globalThis.navigator?.userAgent||'unknown',viewport:{width:globalThis.innerWidth||0,height:globalThis.innerHeight||0},online:globalThis.navigator?.onLine??null};
}
