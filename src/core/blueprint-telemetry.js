/**
 * O(1) phase timing telemetry. The ring is always reused and averages do not
 * scan past samples. Arrays can be consumed directly by an optional debug UI.
 */
export class PhaseTelemetry {
  constructor({phases=["input","collision","physics","netcode","render"],frames=120,
      clock=()=>performance.now()}={}){
    if(!Number.isSafeInteger(frames)||frames<2||frames>3600)throw RangeError("Invalid telemetry ring size");
    if(!Array.isArray(phases)||!phases.length||new Set(phases).size!==phases.length)
      throw TypeError("Telemetry phases must be unique");
    this.clock=clock;this.capacity=frames;
    this.series=new Map(phases.map(name=>[name,{samples:new Float64Array(frames),
      total:0,count:0,index:0,start:null}]));
  }
  begin(name){
    const s=this.series.get(name);if(!s)throw Error("Unknown telemetry phase: "+name);
    if(s.start!==null)throw Error("Telemetry phase already started");
    s.start=this.clock();
  }
  end(name){
    const s=this.series.get(name);if(!s||s.start===null)throw Error("Telemetry phase never started");
    const elapsed=Math.max(0,this.clock()-s.start);
    s.start=null;
    if(!Number.isFinite(elapsed))throw RangeError("Nonfinite timing result");
    if(s.count===this.capacity)s.total-=s.samples[s.index];
    else s.count++;
    s.samples[s.index]=elapsed;s.total+=elapsed;s.index=(s.index+1)%this.capacity;
    return elapsed;
  }
  average(name){
    const s=this.series.get(name);if(!s)throw Error("Unknown telemetry phase");
    return s.count?s.total/s.count:0;
  }
  getSampleBuffer(name){const s=this.series.get(name);if(!s)throw Error("Unknown telemetry phase");return s.samples;}
  snapshot(){return Object.fromEntries([...this.series].map(([k,v])=>
    [k,{samples:v.count,meanMs:v.count?v.total/v.count:0,lastMs:v.count?
      v.samples[(v.index-1+this.capacity)%this.capacity]:0}]))}
}
