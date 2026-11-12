/** Authoritative 60 Hz simulation clock.
 *
 * Browser animation frames are presentation only: the same microsecond input
 * timeline always yields the same numbered simulation ticks regardless of
 * render cadence (30, 60, 120 FPS, uneven frames or bounded catch-up).
 *
 * Quantize absolute performance.now()/rAF timestamps ONCE to integer
 * microseconds. This avoids accumulating a different floating-point fraction
 * for each browser callback partition. Tick boundaries are exact rational
 * n * (1_000_000 / 60) microseconds, never "time since last render".
 */
export const SIMULATION_HZ = 60;
export const TICK_MS = 1000 / SIMULATION_HZ;
const MICROSECONDS_PER_SECOND = 1_000_000;

export class FrameClock {
  constructor({maxTicks = 12} = {}) {
    if (!Number.isInteger(maxTicks) || maxTicks < 1 || maxTicks > 1024)
      throw Error("Invalid maximum simulation ticks per callback.");
    this.maxTicks = maxTicks;
    this.reset();
  }
  reset() {
    this.tickCount = 0;
    this.lastRender = null;
    this.suspend();
  }
  /** Drop time debt when explicitly pausing, without resetting completed ticks. */
  suspend() {
    this.last = null;
    this.lastUs = null;
    this.epochUs = null;
    this.elapsedUs = 0;
    this.epochTicks = 0;
    this.speed = null;
    this.debt = 0;
    this.lastRender = null;
  }
  /** Advance gameplay, at most maxTicks times, never skipping any owed tick. */
  advance(time, {running = true, speed = 1} = {}, tick = () => {}) {
    if (!Number.isFinite(time) || !Number.isFinite(speed) || speed <= 0)
      throw Error("Invalid frame clock time or speed.");
    const roundedUs = Math.round(time * 1000);
    if (!Number.isSafeInteger(roundedUs))
      throw Error("Frame clock timestamp is out of range.");
    const nowUs = this.lastUs === null ? roundedUs : Math.max(this.lastUs, roundedUs);
    if (!running) {
      this.suspend();
      this.lastUs = nowUs;
      this.epochUs = nowUs;
      this.speed = speed;
      this.last = nowUs / 1000;
      return 0;
    }
    if (this.lastUs === null || this.speed !== speed) {
      // A speed change begins a new input time segment. Real Core uses 1x;
      // this avoids inventing timestamps for ticks from mixed clock speeds.
      this.suspend();
      this.lastUs = nowUs;
      this.epochUs = nowUs;
      this.speed = speed;
      this.last = nowUs / 1000;
      return 0;
    }

    const deltaUs = nowUs - this.lastUs;
    this.lastUs = nowUs;
    this.last = nowUs / 1000;
    this.elapsedUs += deltaUs * speed;
    const dueTicks = Math.floor(this.elapsedUs * SIMULATION_HZ / MICROSECONDS_PER_SECOND);
    const batch = Math.min(this.maxTicks, Math.max(0, dueTicks - this.epochTicks));
    for (let n = 0; n < batch; n++) {
      const tickNumber = this.epochTicks + 1;
      // ceil() gives each input a stable, inclusive sample boundary.
      // Older pressed events therefore remain consumable on the first tick.
      const tickUs = this.epochUs +
        Math.ceil(tickNumber * MICROSECONDS_PER_SECOND / (SIMULATION_HZ * speed));
      tick(tickUs / 1000);
      this.epochTicks++;
      this.tickCount++;
    }
    this.debt = Math.max(0,
      this.elapsedUs * SIMULATION_HZ / MICROSECONDS_PER_SECOND - this.epochTicks);
    return batch;
  }
  /** Render cadence never changes the simulation's 60 Hz step count. */
  renderDue(time, fps = 60) {
    if (this.lastRender === null || time - this.lastRender >= 1000 / fps - 0.25) {
      this.lastRender = time;
      return true;
    }
    return false;
  }
}
