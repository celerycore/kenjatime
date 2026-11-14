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
  // The Android Nu-13/Tomoka trace showed 1 tick per callback for 92 s,
  // with an eventual 1,957-tick backlog. In sustained severe debt, two
  // moderately expensive ticks in one worker callback amortize browser timer
  // wakeup/clamping overhead. Cap the simulation slice to ~28 ms: never
  // drop ticks, run incomplete controller phases, or alter render visibility.
  if (debt >= 120 && tickMs > 5 && tickMs <= 14)
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
