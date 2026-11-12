# Kenjatime Core — deterministic fixed 60 Hz simulation (2026-11-12)

## Scope

This change updates the **authoritative JavaScript Core simulation clock**. It does
not replace character CNS/ZSS semantics, rendering, audio, stage assets or the
experimental Kotlin/Wasm backend. It does **not** claim bit-exact native MUGEN /
IKEMEN GO parity or cross-device floating-point reproducibility.

## Contract

- The simulation advances at **60 logical ticks per second**, independent of
  rendering. 30, 60 and 120 FPS presentations must give the same tick sequence.
- `FrameClock` quantizes each absolute monotonic callback timestamp to a
  **single integer microsecond**. A cumulative virtual microsecond counter
  determines tick numbers using `floor(total_us * 60 / 1_000_000)`.
- Every input tick is sampled at a stable rational deadline:
  `ceil(n * 1_000_000 / (60 * speed))` microseconds from its clock segment.
  `TickInputBuffer` interprets original event timestamps against that boundary.
- The renderer may draw fewer frames on overloaded devices. The clock executes
  **at most 12** simulation ticks per callback and preserves remaining debt for
  subsequent scheduler callbacks. This bounds single-callback work but does not
  guarantee real-time catch-up after prolonged CPU starvation.
- Pause and explicit `suspend()` reset the timing segment and discard wall-time
  backlog, not the accumulated lifetime tick counter. This prevents a manual
  pause from replaying minutes of combat on resume.
- A change to clock `speed` starts a new segment. Core currently runs at
  `speed=1`; external speed changes must be treated as a timebase reset.
- The seeded fighter and CPU random generators remain unchanged.
- The existing hidden/background timer scheduling remains active; the operating
  system may still throttle timers, creating recoverable simulation debt.

## User-facing benchmark instrumentation

Core runtime state includes:
- `simulationHz = 60`
- `simulationTicks`: lifetime Core clock ticks in the current fight
- `simulationBacklogTicks`: whole simulation ticks not yet executed
- `simulationDebt`: full fractional tick debt (existing metric)

The isolated R8 benchmark adds live simulation clock/backlog readings and CSV
columns `simulation_hz`, `simulation_ticks`, `simulation_backlog_ticks`.

**Important:** `render_fps` is a wall-clock presentation measurement, not the
simulation tick rate. GPU memory numbers remain raw texture allocation estimates.

## Verification

`node --test test/core/deterministic-60hz.test.js test/core/frame-scheduler.test.js`

`npm run test:core`

`npm run build:core`

`python scripts/core/verify-browser.py`

The new tests cover:
1. Same 180 rational tick boundaries under 30/60/120 FPS and irregular delivery.
2. Bounded 12-tick catch-up under a one-second delay, with all debt retained.
3. Pause/suspend behavior without an artificial time jump.
4. Timestamped keyboard/touch/gamepad input replay across render cadences.
5. Real bundled KFM CPU matchup with identical per-tick combat hashes despite
   varying frame packet frequency.

Before production rollout: verify matched native MUGEN/IKEMEN per-tick traces,
Dark Donald/Rare Akuma original archive replay, WebGL2 correctness and
physical Android FPS/touch input under background/thermal stress. Retain the
existing JavaScript fallback when Kotlin/Wasm is unavailable.
