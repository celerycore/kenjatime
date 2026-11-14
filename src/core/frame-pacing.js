/**
 * Frame fairness for heavy imported MUGEN characters.
 *
 * A backlog is evidence that the worker cannot keep up with wall time; it is
 * NOT a reason to suppress all presentation. Keep deterministic simulation
 * ticks in order without dropping debt, but yield to WebGL between short
 * batches so the display remains responsive during overload.
 */
export const NORMAL_PRESENTATION_FPS = 60;
export const BACKLOG_PRESENTATION_FPS = 30;

export function framePacing(debt, estimatedTickMs = 2) {
  const backlog = Number.isFinite(debt) && debt >= 1;
  // Cap each worker callback's simulation workload. The first estimate uses
  // a conservative 2ms; subsequent batches use measured CPU wall duration.
  // This is a soft budget, because a single expensive state tick cannot be
  // interrupted without breaking original MUGEN controller order.
  const tickMs = Number.isFinite(estimatedTickMs) && estimatedTickMs > 0
    ? estimatedTickMs : 2;
  let batchLimit = Math.max(1, Math.min(4, Math.floor(10 / Math.max(0.5, tickMs))));
  // In the Nov 14 Infinix trace, debt remained above 8 for most of the
  // 90s while 1-tick callbacks repeatedly entered catch-up scheduling.
  // Amortize queue wakeups with 2 ticks at ~10–13 ms/tick, but cap this
  // *estimated* simulation slice at ~28 ms to retain render/input fairness.
  // NEVER alter the fixed 60 Hz tick boundaries or discard accumulated debt.
  if (debt >= 8 && tickMs >= 5 && tickMs <= 13.5)
    batchLimit = Math.max(batchLimit,2);
  return {
    backlog,
    batchLimit,
    renderFps: backlog ? BACKLOG_PRESENTATION_FPS : NORMAL_PRESENTATION_FPS,
  };
}

export function nextTickEstimate(previousMs, observedMs) {
  if (!Number.isFinite(observedMs) || observedMs <= 0)
    return Number.isFinite(previousMs) && previousMs > 0 ? previousMs : 2;
  const baseline = Number.isFinite(previousMs) && previousMs > 0 ? previousMs : observedMs;
  return baseline * 0.75 + observedMs * 0.25;
}

/** Backlog must never be part of the visibility gate. The cadence is
 * intentionally separate from deterministic tick completion. */
export function presentationDue(clock, time, {hidden=false, paused=false, dirty=false, renderFps=60}={}) {
  return !hidden && (!paused || dirty) && clock.renderDue(time, renderFps);
}


/** Measure the rate of *change* in clock debt, not its absolute size.
 * Clock debt is never discarded: this signal only governs how often pixels
 * are submitted. A slow phone can recover 60 Hz gameplay by presenting fewer
 * visual snapshots while every MUGEN/IKEMEN tick continues in order.
 */
export class SimulationDebtTrend {
  constructor({windowMs=1000}={}) {
    this.windowMs=windowMs;
    this.lastTime=null;
    this.lastDebt=0;
    this.rate=0;
  }
  observe(time,debt) {
    if(!Number.isFinite(time)||!Number.isFinite(debt))return this.rate;
    if(this.lastTime===null || time<this.lastTime) {
      this.lastTime=time;this.lastDebt=Math.max(0,debt);this.rate=0;
      return this.rate;
    }
    const elapsed=time-this.lastTime;
    if(elapsed<this.windowMs)return this.rate;
    this.rate=(Math.max(0,debt)-this.lastDebt)*1000/elapsed;
    this.lastTime=time;
    this.lastDebt=Math.max(0,debt);
    return this.rate;
  }
}

/** Optional gameplay-first frame skipping. A draw is NEVER substituted for a
 * deterministic tick, and no fighter's AIR animation frames are skipped.
 * The UI sees fewer world snapshots, but tick-based gameplay stays unchanged.
 * The stable 12/15/20/24/30 FPS tiers avoid browser timer churn and let us
 * observe whether CPU time is better spent on simulation than rendering.
 */
export function gameplayFirstRenderFps({
  debt=0,debtRate=0,tickCpuMs=0,
}={}) {
  if(!Number.isFinite(debt)||debt<1)return NORMAL_PRESENTATION_FPS;
  if(debtRate>=10 || tickCpuMs>=16)return 12;
  if(debtRate>=4 || tickCpuMs>=14)return 15;
  if(debtRate>=1 || tickCpuMs>=12)return 20;
  if(debt>=60)return 24;
  return BACKLOG_PRESENTATION_FPS;
}
