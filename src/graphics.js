export const GRAPHICS_MODES=Object.freeze({high:{scale:1,fps:60},balanced:{scale:.75,fps:60},low:{scale:.6,fps:30}});
/** Quality changes presentation only. No MUGEN entity/effect is removed or changed. */
export class GraphicsQuality {
  constructor({mode='auto',mobile=false}={}){this.mode=['auto',...Object.keys(GRAPHICS_MODES)].includes(mode)?mode:'auto';this.level=mobile?1:0;this.samples=[];this.elapsedMs=0;this.slowWindows=0;this.fastWindows=0;}
  get preset(){return this.mode==='auto'?['high','balanced','low'][this.level]:this.mode;}
  get settings(){return GRAPHICS_MODES[this.preset];}
  setMode(mode){if(!['auto',...Object.keys(GRAPHICS_MODES)].includes(mode))throw Error('Unknown graphics mode.');this.mode=mode;this.samples=[];this.elapsedMs=0;this.slowWindows=this.fastWindows=0;}
  observeFrame(milliseconds,interval=1000/60){const expected=1000/this.settings.fps,cost=interval>expected*1.5?Math.max(milliseconds,interval*this.settings.fps/60):milliseconds;return this.observe(cost,interval);}
  observe(milliseconds,elapsed=1000/60){
    if(this.mode!=='auto'||!Number.isFinite(milliseconds))return false;this.samples.push(milliseconds);this.elapsedMs+=Math.min(1000,Math.max(0,elapsed));if(this.elapsedMs<3000-1e-6||this.samples.length<8)return false;
    const sorted=this.samples.sort((a,b)=>a-b),p95=sorted[Math.floor(sorted.length*.95)];this.samples=[];this.elapsedMs=0;
    if(p95>20){this.slowWindows++;this.fastWindows=0;}else if(p95<8){this.fastWindows++;this.slowWindows=0;}else this.slowWindows=this.fastWindows=0;
    if(this.slowWindows>=2&&this.level<2){this.level++;this.slowWindows=this.fastWindows=0;return true;}
    if(this.fastWindows>=5&&this.level>0){this.level--;this.slowWindows=this.fastWindows=0;return true;}return false;
  }
}
