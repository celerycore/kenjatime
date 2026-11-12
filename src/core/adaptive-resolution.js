/**
 * Resolution scaling from observed render cadence, not CPU GL-submission
 * latency alone. A GPU-bound phone can submit in 5 ms yet render at 40 FPS.
 * This controller leaves the authoritative 60 Hz simulation untouched.
 */
export class AdaptiveResolution {
  constructor({minScale=0.5,maxScale=1,windowMs=1500}={}) {
    this.minScale=minScale;this.maxScale=maxScale;this.windowMs=windowMs;
    this.reset();
  }
  reset(){this.scale=this.maxScale;this.suspend();}
  suspend(){this.first=null;this.frames=0;this.cpuMs=0;this.lastFps=null;}
  observe(now,cpuMs,{eligible=true}={}) {
    if(!eligible||!Number.isFinite(now)||!Number.isFinite(cpuMs)){
      this.suspend();return this.scale;
    }
    if(this.first===null){
      this.first=now;this.frames=1;this.cpuMs=cpuMs;return this.scale;
    }
    this.frames++;this.cpuMs+=cpuMs;
    const elapsed=now-this.first;
    if(elapsed<this.windowMs)return this.scale;
    const fps=(this.frames-1)*1000/Math.max(elapsed,1);
    const avgCpu=this.cpuMs/this.frames;
    this.lastFps=fps;
    // Large reductions below 42 FPS, gentle recovery once stable at 60.
    if(fps<42||avgCpu>18)this.scale=Math.max(this.minScale,this.scale-0.1);
    else if(fps<53||avgCpu>15)this.scale=Math.max(this.minScale,this.scale-0.07);
    else if(fps<57)this.scale=Math.max(this.minScale,this.scale-0.03);
    else if(fps>=59.2&&avgCpu<11)this.scale=Math.min(this.maxScale,this.scale+0.02);
    this.scale=Math.round(this.scale*100)/100;
    this.first=null;this.frames=0;this.cpuMs=0;
    return this.scale;
  }
}
