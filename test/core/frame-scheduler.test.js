import { test } from "node:test";
import assert from "node:assert/strict";
import { FrameScheduler } from "../../src/core/frame-scheduler.js";
import { FrameClock } from "../../src/frame-clock.js";

test("focus/visibility scheduling leaves simulation running when animation frames stop, with one cancellable callback", () => {
  let time = 0,
    serial = 0;
  const tasks = new Map(),
    clock = new FrameClock(),
    delays = [];
  const host = {
    performance: { now: () => time },
    requestAnimationFrame: (fn) => {
      tasks.set(serial, { fn, raf: true });
      return serial++;
    },
    cancelAnimationFrame: (id) => tasks.delete(id),
    setTimeout: (fn, ms) => {
      delays.push(ms);
      tasks.set(serial, { fn, raf: false });
      return serial++;
    },
    clearTimeout: (id) => tasks.delete(id),
  };
  let ticks = 0,
    paused = false;
  const scheduler = new FrameScheduler(
    (t) => clock.advance(t, { running: !paused }, () => ticks++),
    host,
  );
  const run = () => {
    assert.equal(tasks.size, 1);
    const [id, task] = tasks.entries().next().value;
    tasks.delete(id);
    task.raf ? task.fn(time) : task.fn();
  };
  scheduler.schedule();
  assert.equal(tasks.get(0).raf, true);
  // A pending animation frame is cancelled on focus loss; no rAF is delivered.
  scheduler.schedule({ timer: true });
  assert.equal(tasks.size, 1);
  assert.equal(tasks.has(0), false);
  run();
  for (let i = 1; i <= 60; i++) {
    time = (i * 1000) / 60;
    scheduler.schedule({ timer: true });
    run();
  }
  assert.equal(ticks, 60);
  // Delayed delivery retains debt and catches up in bounded batches.
  time += 1000;
  scheduler.schedule({ timer: true });
  run();
  assert.equal(ticks, 72);
  assert.ok(clock.debt >= 47);
  while (clock.debt >= 1) {
    scheduler.schedule({ timer: true, catchUp: true });
    run();
  }
  assert.equal(ticks, 120);
  assert.equal(delays.at(-1), 0);
  paused = true;
  time += 500;
  scheduler.schedule({ idle: true });
  run();
  assert.equal(ticks, 120);
  assert.equal(delays.at(-1), 100);
  scheduler.schedule();
  assert.equal(tasks.size, 1);
  scheduler.cancel();
  assert.equal(tasks.size, 0);
});
