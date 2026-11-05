const TICK_MS=1000/60;
/** Retains simulation debt. Presentation can skip frames; simulation never does. */
export class FrameClock {
  constructor({maxTicks=12}={}){this.maxTicks=maxTicks;this.reset();}
  reset(){this.last=null;this.debt=0;this.tickCount=0;this.lastRender=null;}
  suspend(){this.last=null;this.debt=0;this.lastRender=null;}
  advance(time,{running=true,speed=1}={},tick=()=>{}){
    if(!Number.isFinite(time)||!Number.isFinite(speed)||speed<=0)throw Error('Invalid frame clock time or speed.');
    const elapsed=this.last===null?0:Math.max(0,time-this.last);this.last=time;
    if(!running){this.debt=0;return 0;}this.debt+=elapsed*speed/TICK_MS;
    let count=0;while(this.debt>=1-1e-9&&count<this.maxTicks){const sampleTime=time-Math.max(0,this.debt-1)*TICK_MS/speed;tick(sampleTime);this.debt=Math.max(0,this.debt-1);count++;this.tickCount++;}return count;
  }
  renderDue(time,fps=60){if(this.lastRender===null||time-this.lastRender>=1000/fps-.25){this.lastRender=time;return true;}return false;}
}
