/** One cancellable callback. Timers keep simulation independent of suspended
 * animation frames; the browser/OS still controls background timer delivery. */
export class FrameScheduler {
  constructor(callback, host = globalThis) {
    this.callback = callback;
    this.host = host;
    this.handle = null;
    this.timer = false;
  }
  schedule({ timer = false, catchUp = false, idle = false } = {}) {
    this.cancel();
    this.timer =
      timer ||
      catchUp ||
      idle ||
      typeof this.host.requestAnimationFrame !== "function";
    const invoke = (time) => {
      this.handle = null;
      this.callback(time);
    };
    this.handle = this.timer
      ? this.host.setTimeout(
          () => invoke(this.host.performance.now()),
          catchUp ? 0 : idle ? 100 : 1000 / 60,
        )
      : this.host.requestAnimationFrame(invoke);
  }
  cancel() {
    if (this.handle === null) return;
    if (this.timer) this.host.clearTimeout(this.handle);
    else this.host.cancelAnimationFrame(this.handle);
    this.handle = null;
  }
}
