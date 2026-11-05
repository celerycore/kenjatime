const percentile=(values,fraction)=>values.length?[...values].sort((a,b)=>a-b)[Math.min(values.length-1,Math.floor(values.length*fraction))]:0;
const average=values=>values.length?values.reduce((a,b)=>a+b,0)/values.length:0;

/** Opt-in instrumentation. Canvas methods are restored when measurement is off. */
export class PerformanceMonitor {
  constructor({enabled=false,limit=600}={}){this.enabled=enabled;this.limit=limit;this.contexts=[];this.reset();}
  reset(){this.frames=[];this.current=null;this.lastTime=null;}
  track(context){
    const originals={};for(const name of ['drawImage','getImageData','putImageData'])originals[name]=context[name];
    const entry={context,originals};this.contexts.push(entry);if(this.enabled)this.wrap(entry);return context;
  }
  wrap({context,originals}){
    const monitor=this;
    for(const [name,method]of Object.entries(originals))context[name]=function(...args){
      const frame=monitor.current;
      if(frame){if(name==='drawImage')frame.drawCalls++;else if(name==='getImageData'){frame.readbacks++;frame.readbackPixels+=Math.max(0,args[2])*Math.max(0,args[3]);}else frame.pixelWrites++;}
      return method.apply(this,args);
    };
  }
  setEnabled(value){if(this.enabled===value)return;this.enabled=value;for(const entry of this.contexts){if(value)this.wrap(entry);else Object.assign(entry.context,entry.originals);}this.reset();}
  begin(time){if(!this.enabled)return;this.current={time,interval:this.lastTime===null?0:time-this.lastTime,simulation:0,render:0,ticks:0,drawCalls:0,readbacks:0,readbackPixels:0,pixelWrites:0};this.lastTime=time;}
  simulation(duration,ticks=1){if(this.current){this.current.simulation+=duration;this.current.ticks+=ticks;}}
  end(render,counts={},rendered=true){if(!this.current)return;this.current.render=render;this.current.rendered=rendered;this.current.counts=counts;this.frames.push(this.current);if(this.frames.length>this.limit)this.frames.shift();this.current=null;}
  snapshot(){
    const frames=this.frames,presented=frames.filter(f=>f.rendered!==false),intervals=presented.slice(1).map((f,index)=>f.time-presented[index].time).filter(n=>n>0),render=presented.map(f=>f.render),simulation=frames.map(f=>f.simulation),ticks=frames.reduce((sum,f)=>sum+f.ticks,0),sum=key=>frames.reduce((total,f)=>total+f[key],0);
    return{samples:frames.length,fps:1000/(average(intervals)||Infinity),slowFrameRate:intervals.filter(n=>n>25).length/(intervals.length||1),frameAverageMs:average(intervals),frameP95Ms:percentile(intervals,.95),renderAverageMs:average(render),renderP50Ms:percentile(render,.5),renderP95Ms:percentile(render,.95),simulationAverageMs:average(simulation),simulationP95Ms:percentile(simulation,.95),simulationTickMs:sum('simulation')/(ticks||1),ticks,drawCalls:sum('drawCalls'),readbacks:sum('readbacks'),readbackPixels:sum('readbackPixels'),pixelWrites:sum('pixelWrites'),counts:frames.at(-1)?.counts||{}};
  }
}
