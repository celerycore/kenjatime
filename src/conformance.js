/** Compare only explicitly captured baseline fields, preserving frame and numeric differences. */
export function compareTrace(actual,baseline,{tolerance=1e-6}={}){
  if(!Number.isFinite(tolerance)||tolerance<0)throw Error('Trace tolerance must be finite and non-negative.');
  if(!Array.isArray(actual)||!Array.isArray(baseline)||!baseline.length)throw Error('A baseline must contain captured samples.');
  const byTick=new Map(),seen=new Set(),differences=[];
  const captured=value=>Array.isArray(value)||value===null||typeof value!=='object'||Object.values(value).some(captured);
  for(const sample of actual){if(!Number.isSafeInteger(sample.tick)||sample.tick<0||byTick.has(sample.tick))throw Error('Actual trace has invalid or duplicate ticks.');byTick.set(sample.tick,sample);}
  const compare=(expected,observed,path,tick)=>{
    if(typeof expected==='number'&&!Number.isFinite(expected))throw Error('Baseline numbers must be finite.');
    if(expected!==null&&typeof expected==='object'){
      if(Array.isArray(expected)&&(!Array.isArray(observed)||expected.length!==observed.length)){differences.push({tick,path,expected,actual:observed??null});return;}
      for(const [key,value]of Object.entries(expected))compare(value,observed?.[key],path?path+'.'+key:key,tick);
    }else if(typeof expected==='number'&&typeof observed==='number'?!Number.isFinite(observed)||Math.abs(expected-observed)>tolerance:expected!==observed)differences.push({tick,path,expected,actual:observed??null});
  };
  for(const sample of baseline){
    if(!Number.isSafeInteger(sample.tick)||sample.tick<0||seen.has(sample.tick)||!['player','opponent','contacts','round'].some(key=>Object.hasOwn(sample,key)&&captured(sample[key])))throw Error('Baseline samples need unique ticks and captured fighter, contact or round fields.');
    seen.add(sample.tick);if(!byTick.has(sample.tick))differences.push({tick:sample.tick,path:'tick',expected:sample.tick,actual:null});else compare(sample,byTick.get(sample.tick),'',sample.tick);
  }
  return {matched:!differences.length,comparedSamples:baseline.length,differences};
}
