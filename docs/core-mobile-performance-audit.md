# Kenjatime Core mobile performance: baseline comparison and initial recovery

## Scope and evidence

A user reports notably worse rendering on an Android phone after moving from the
pre-rewrite web edition to the independent Three.js Core preview. This report
compares checked-in source policies, **not measured FPS on that phone**.

- Pre-rewrite optimized implementation: [source/mobile-performance](https://github.com/celerycore/kenjatime/tree/source/mobile-performance).
- Core engine and renderer: [Core runtime](https://github.com/celerycore/kenjatime/blob/qa/rare-akuma-native-ai-jump-parity-20261110/src/core/runtime.js), [Three renderer](https://github.com/celerycore/kenjatime/blob/qa/rare-akuma-native-ai-jump-parity-20261110/src/core/three-renderer.js).
- Pre-rewrite performance report: [performance-baseline.md](https://github.com/celerycore/kenjatime/blob/source/mobile-performance/docs/performance-baseline.md).

The pre-rewrite Chromium benchmarks were obtained on a software-rendered Linux
environment. Their numbers do not establish physical Android performance.

## Main source-code differences

| Aspect | Before rewrite (Canvas optimized) | Independent Core before this patch | This isolated patch |
| --- | --- | --- | --- |
| Initial phone policy | Auto starts Balanced, **0.75×, 60 FPS** | Auto starts **1.0×, 60 FPS** | Restore mobile Balanced |
| Heavy-load fallback | Low **0.6×, 30 FPS presentation**, never drop simulation ticks | Shrink by 0.05 down to 0.5×, still target 60 FPS | Restore 0.6× / 30 FPS fallback |
| Adaptive evidence | 3-second windows, p95 of render cost and presented interval | 30-frame mean of synchronous render cost only | Restore interval-aware, p95-based 3s windows |
| Escalation stability | 2 slow windows to degrade; 5 fast windows to improve | Single mean-window transitions; potential frequent resizing | Restore hysteresis |
| Renderer | Optimized Canvas 2D, bounded caches, static parallax reuse | Three.js/WebGL2, shader-based indexed palettes and effects, 64 MiB texture limit | Leave renderer and authentic effects untouched |
| Simulation | Fixed-step tick separate from rendering | Fixed-step tick separate from rendering | Keep fixed 60 Hz simulation, adjust only presentation |

## Why performance may have regressed

1. Rendering **960×540 at 60 FPS by default on phones** may ask too much of
   fill rate or a browser's WebGL2/ANGLE implementation. The old edition starts
   touch phones at a smaller resolution.
2. Measuring only synchronous JavaScript `renderer.render()` time can miss GPU
   pipeline delays. A low frame rate can coexist with deceptively low CPU render
   durations; presenting-frame intervals must contribute to the quality signal.
3. A fixed 60 FPS presentation target continues doing full draw preparation and
   GPU work despite a saturated mobile GPU. Reducing *presentation* to 30 FPS
   can free CPU/GPU time without changing 60 Hz combat simulations.
4. Current Core's `session.frame()` constructs draw arrays and allocates new
   render packets every draw, and `CoreThreeRenderer.render()` applies many
   uniform writes per sprite/effect. These are **audit candidates**; no claim
   about their measured share can be made without profiling a device.
5. Model/glTF stages add layered rendering passes. Core should collect
   separate model-stage and plain-grid budgets rather than apply a single
   benchmark to all stages.

## Implemented first-pass recovery

This change reuses the existing checked-in `GraphicsQuality` implementation,
instead of inventing new frame pacing. Touch detection is passed from the UI
into both the worker and main-thread fallbacks.

Auto on handheld devices starts at 720×405 @ 60 FPS and can adapt down to
576×324 @ 30 FPS presentation. Sharp remains a manual full 960×540 @ 60 FPS
override. The fight simulation always advances on its original fixed 60 Hz
clock; no helpers, hitboxes, projectiles, combo state, or visual effects are
deleted or simplified.

A concrete performance comparison on the user's phone still requires:
- displayed FPS and p95 frame interval in a 60-second Dark Donald mirror match
- p95 simulation tick duration, p95 renderer duration, GPU texture bytes and
  uploads, current quality tier, dropped presentation frames, and simulation debt
- comparison of worker vs main-thread fallback, with effects-heavy intros,
  hitsparks, and victory animations, at identical scale and character versions

## Next steps that require measurement

- Put the Core per-frame telemetry alongside the old Web performance overlay.
- Profile draw-packet allocations and shader/uniform churn with 16/32/64
  overlapping effects and helper bursts.
- Reuse render-geometry and effect packet pools when data is unchanged;
  preserve shader blending, color, palette and exact original sprites.
- Implement texture LRU eviction *only if* measured GPU pressure warrants it;
  validate that retained original animations and palettes reupload correctly.
- Check mobile WebGL availability and worker fallback behavior separately.

Do not assert a device FPS gain until these measurements exist.
