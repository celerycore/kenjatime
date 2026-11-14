/** Exactly one cancellable simulation callback.
 *
 * During sustained debt, repeated setTimeout(0) often incurs browser nested
 * timer clamping (~4ms per callback), significant beside a 10–12ms CNS tick.
 * On a dedicated worker, MessageChannel posts a task without relying on that
 * timer mechanism. No simulation step is dropped and no animation frame is
 * fabricated. Foreground presentation still uses worker rAF when available.
 *
 * The channel is deliberately OFF on main-thread fallback and when hidden:
 * keep input/paint responsive and honor background timer throttling.
 */
export class FrameScheduler {
  constructor(callback, host = globalThis) {
    this.callback = callback;
    this.host = host;
    this.handle = null;
    this.backend = "none";
    this.timer = false;
    this.channel = null;
    this.sequence = 0;
    this.metrics = {
      channelCallbacks:0,timerCallbacks:0,animationCallbacks:0,
      staleChannelMessages:0,channelUnavailable:0,
    };
  }
  messagePort() {
    if (this.channel) return this.channel;
    if (typeof this.host.MessageChannel !== "function" ||
        typeof this.host.document !== "undefined") return null;
    try {
      this.channel = new this.host.MessageChannel();
      this.channel.port1.onmessage = (event) => {
        // A previously cancelled posted message must never run the NEXT
        // callback. Each scheduling attempt uses a unique sequence number.
        if (this.backend !== "channel" || this.handle !== event.data) {
          this.metrics.staleChannelMessages++;
          return;
        }
        this.handle = null;
        this.backend = "none";
        this.metrics.channelCallbacks++;
        this.callback(this.host.performance.now());
      };
      this.channel.port1.start?.();
      return this.channel;
    } catch {
      this.channel = null;
      this.metrics.channelUnavailable++;
      return null;
    }
  }
  schedule({ timer = false, catchUp = false, idle = false } = {}) {
    this.cancel();
    this.timer = timer || catchUp || idle ||
      typeof this.host.requestAnimationFrame !== "function";
    // The fast catch-up queue is only used on a visible focused worker.
    // Main-thread fallback, pause, and background delivery remain unchanged.
    const channel = catchUp && !timer && !idle ? this.messagePort() : null;
    if (channel) {
      this.backend = "channel";
      this.handle = ++this.sequence;
      try {
        channel.port2.postMessage(this.handle);
        return;
      } catch {
        this.backend = "none";
        this.handle = null;
        this.metrics.channelUnavailable++;
      }
    }
    if (this.timer) {
      this.backend = "timer";
      this.handle = this.host.setTimeout(() => {
        this.handle = null;
        this.backend = "none";
        this.metrics.timerCallbacks++;
        this.callback(this.host.performance.now());
      }, catchUp ? 0 : idle ? 100 : 1000 / 60);
      return;
    }
    this.backend = "raf";
    this.handle = this.host.requestAnimationFrame(time => {
      this.handle = null;
      this.backend = "none";
      this.metrics.animationCallbacks++;
      this.callback(time);
    });
  }
  cancel() {
    if (this.handle === null) return;
    if (this.backend === "timer") this.host.clearTimeout(this.handle);
    else if (this.backend === "raf")
      this.host.cancelAnimationFrame(this.handle);
    // No MessageChannel cancellation primitive exists. Sequence tokens
    // invalidate posted work without letting stale callbacks run.
    this.handle = null;
    this.backend = "none";
  }
  close() {
    this.cancel();
    this.channel?.port1.close?.();
    this.channel?.port2.close?.();
    this.channel = null;
  }
  get stats() {
    return {...this.metrics,
      available:typeof this.host.MessageChannel === "function" &&
        typeof this.host.document === "undefined",
      active:this.backend === "channel"};
  }
}
