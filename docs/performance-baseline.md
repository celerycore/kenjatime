# Mobile rendering optimization: Web Edition 15

Latest follow-up: [Edition 21 sprite-cache and palette-processing fixes](fps-performance.md) address the Forest/desktop Brave lag report, with unchanged cache limits and pixel/behavior comparisons. Earlier phase measurements below remain historical.

This work preserves the current MUGEN simulation and improves browser presentation. The measured improvements below are CPU render timings from the actual application. They are **not physical Android FPS claims** or certification of full native MUGEN compatibility.

## Audit and reproducible source

The repository default/deployment branch was `gh-pages`, at `1bb6e15` (Edition 14). It contained generated bundles and no package/build sources. The older `fix/mugen-zip-unsafe-path-import-20261031` branch also contained a distribution. Editable source was already present in the working project. It has been preserved on **`source/mobile-performance`**, separately from the live distribution.

Source checkpoints:

- `0aa294c`: preserve Edition 14 sources, assets, tests and Vite build.
- `34f7043`: add opt-in telemetry and stress scenes, before rendering optimizations.
- `4193ecd`: native Canvas compositing, bounded caches, static parallax reuse and draw-command reuse.
- `2b47644`: fixed-step scheduling, input buffering, graphics controls and initial browser checks.
- `e06794f`: elapsed-time adaptive windows, complete behavior hashes and final benchmark/visual comparisons. The primary benchmark's optimized build uses this checkpoint; later telemetry labels and documentation do not change its blend formulas.

`src/combat.js`, `runtime.js`, CNS/CMD interpretation, authoritative entity limits, hitboxes, match rules and AI were not changed by this optimization pass. SFF decoding now uses a bounded cache, with unchanged decoded pixels. The simulation remains independent of Canvas and the DOM.

## Measurement method and environment

The saved JSON reports in [performance-data](performance-data/) contain the environment, per-frame CPU render samples, p50/p95 values, slow-render counts, readback counts/areas, entity counts and behavior hashes. Measurements used a shared Linux x86-64 host reporting **AMD EPYC 9V74 80-Core Processor**, Node **24.19.0**, Python **3.12.14**, and headless Chromium **154.0.8037.57**, a **390×844** mobile viewport, DPR **2**, and explicit **High** graphics at **960×540**. The reported renderer was **ANGLE Vulkan / SwiftShader**, a software renderer. Host power mode was unknown and thermal conditions were uncontrolled. DevTools CPU throttling is a separate experiment; it does not represent a particular Android SoC or throttle every browser subsystem equally.

Each fixture imports through the real ZIP interface, runs 100 simulation ticks, warms 15 render/tick pairs and measures 90 more pairs. Each measured pair advances one actual simulation tick and draws through the production renderer. Per-frame measurements exclude the surrounding Playwright calls. Opt-in Canvas counters are enabled on both sides and add overhead. These synchronous CPU measurements are separate from real requestAnimationFrame presentation FPS.

The seven scenes are idle, repeated actual hit sparks, 64 overlapping additive Explods, 64 mixed subtractive/custom-alpha/palette Explods, 8 helpers plus 12 projectiles and 64 trails, a parallax stage, and their combined stress case. They use bundled KFM sprites and independent synthetic scripts. Fixtures are generated in ignored `work/`; no additional external characters are distributed. A moving/sinusoidal parallax case additionally checks cache invalidation.

| Scene | Before p50 / p95 (ms) | After p50 / p95 (ms) | Slow draws before → after |
| --- | ---: | ---: | ---: |
| Idle | 0.1 / 0.2 | 0.1 / 0.2 | 0 → 0 |
| Repeated sparks | 3.0 / 4.8 | 1.3 / 1.8 | 0 → 0 |
| 64 additive effects | 43.0 / 49.6 | 13.9 / 18.8 | 90 → 16 |
| Mixed custom/subtract/palette | 55.2 / 66.7 | 16.6 / 22.3 | 90 → 42 |
| Helpers/projectiles/trails | 36.3 / 43.5 | 10.5 / 13.4 | 90 → 1 |
| Static parallax | 5.3 / 10.3 | 1.0 / 1.3 | 0 → 0 |
| Combined stress | 99.2 / 123.4 | 25.9 / 33.9 | 90 → 90 |

Slow frames in that table mean **CPU render work over 16.67 ms**, out of 90 draws. They do not measure displayed FPS. Idle timings are at the timer's precision floor and should not be interpreted as a speedup. Other runs varied with host load; these are the saved paired runs, not guaranteed device thresholds.

| 4× CPU throttling, High | Before p95 (ms) | After p95 (ms) |
| --- | ---: | ---: |
| 64 additive effects | 351.8 | 80.7 |
| Mixed custom/subtract/palette | 412.6 | 143.3 |
| Combined stress | 642.7 | 182.3 |

The throttled runs use 30 measured pairs after the same warm-up, at High quality. They show a substantial improvement but also show that the extreme scene is still expensive. In a separate real-callback stress check with 4× CPU throttling, Auto reached Low while retaining all 64 Explods, 12 projectiles and 8 helpers. Its measured presentation average was approximately **9.7 FPS** across the adaptation interval; simulation advanced 613 ticks with less than one tick of remaining debt. This does **not** meet the 30 FPS presentation target on that synthetic software-rendered workload.

## Changes by phase

**Phase 0 — profiling.** `src/performance.js` supplies opt-in Canvas counters and timing. Select **Performance** in training/arena, or use `?perf=1`. The overlay shows presented FPS, slow-frame rate relative to the selected FPS target, average/p95 frame intervals, simulation tick/render cost, active sprite/effect counts, draw/readback counts per rendered frame, estimated asset-cache bytes and simulation debt. Instrumentation restores the original Canvas methods when disabled. It is off by default; reports include performance data only when opted in.

**Phases 1/2 — replace the measured bottleneck.** `src/canvas-renderer.js` replaces the per-effect getImageData → JavaScript RGB loop → pixel upload path with native Canvas composition. For source RGB S, destination RGB D and sprite coverage a, subtraction uses `1 - min(1, (1-D) + S*a)`. Custom source/destination coefficients factor into source-over, optional source tint and addition. Reusable source/destination surfaces retain device coordinates, rasterize coverage once and apply the destination clip once. This preserves fractional windows, flips and XYZ rotations. The target is opaque because the application paints its background first.

This is a targeted Canvas renderer boundary, **not a complete WebGL renderer, texture atlas or full render-model migration**. The measured results justified shipping this smaller change first. Native Canvas may use acceleration where the browser supports it; the measurements here used SwiftShader. No approximate substitute blend mode or graphics library was introduced.

`src/memory-cache.js` implements byte-bounded LRU promotion/eviction. `src/formats.js` bounds decoded SFF data to 16 MiB per bank; renderer sprite surfaces are bounded to 12 MiB, palette/tint variants to 8 MiB, and parallax variants to 8 MiB. Entries larger than a budget are still rendered, but are not retained. Opaque variants are accounted for. Character/match changes clear active caches and pooled references. These are estimates of retained asset data, **not a cap on browser heap, driver memory, sound buffers or imported archive/roster storage**. The old telemetry counted fewer kinds of memory, so its byte figures cannot be compared directly with the new total.

`src/app-runtime.js` reuses actor/draw arrays and draw records, retains equal-priority insertion order, culls wholly off-canvas sprite draws, avoids redundant DOM writes and limits changing debug/coordinate text to 10 Hz. Static parallax rows are cached only after matching geometry; moving geometry continues to render with its current camera/scroll/window parameters. Parallax draw commands fell from 95,940 to 810 over the measured 90 static-stage draws. Import decompression already used a worker and transferables; it was retained.

**Phase 3 — scheduling and inputs.** `src/frame-clock.js` advances fixed 60 Hz simulation ticks independently of 30/60 FPS presentation, retains catch-up debt with at most 12 ticks per callback, and exposes that debt. It removes the old elapsed-time clamp that discarded long frame intervals. `src/input-buffer.js` buffers timestamped keyboard/touch/standard-gamepad sources, including presses released before the next simulation callback. Display frames are allowed to skip; required simulation ticks are not.

Paused views draw only when changed. An offscreen viewer stops drawing while simulation continues. Hidden tabs explicitly pause simulation, clear held inputs and stop sound effects/haptics; the audio context suspends. Returning starts from the current game state with no background-time backlog. This is the app's intentional background policy, not catch-up tick loss during active play.

**Phase 4 — graphics settings.** Auto is the default; coarse-pointer devices start at Balanced. High uses 100% scale/60 FPS target, Balanced 75%/60, and Low 60%/30. The simulation stays at 60 Hz. Settings persist locally. Auto considers CPU draw cost and delayed presentation intervals in three-second percentile windows, steps down after two slow windows, and recovers after five headroom windows. It does not remove, cap or reduce the density of MUGEN Explods, projectiles, helpers, sparks, afterimages or attack telegraphs. No effects were declared optional without evidence. Canvas backing resolution is not multiplied by display DPR.

## Verification

- **309 Node tests**, including full-engine classic/720p KFM fixtures when `MUGEN_TEST_ARCHIVE` is supplied. Tests compare actual KFM commands, attacks, hitpause and state sequences under 30/60/120 Hz callbacks; check retained debt, short presses, source sharing/gamepads, adaptive hysteresis and cache eviction/pixel integrity.
- **180 browser blend comparisons** cover normal/add/A1/subtractive/custom coefficients, alpha, fractional clipping and XYZ transforms. Maximum measured channel difference was 2/255; the acceptance tolerance is 3/255 for native Canvas quantization.
- Complete exported player/opponent/entity/effect/stage/match/combat-rule hashes matched before/after in all seven primary scenes, all three throttled cases and moving parallax. Five primary scenes were pixel-identical; custom and combined differed by at most 2/255. These compare against Edition 14's web runtime, not independently captured native MUGEN.
- Browser combat, chains/throws/recovery, script semantics, ZIP safety, both mobile file-reader paths, 55.56 MB worker import, multi-touch and script/report exports pass. The Low-mode callback check measured approximately 30.0 presented FPS while continuing simulation near 60 ticks/second. Paused/offscreen views made zero draw calls; synthetic hidden/resume policy checks created no backlog. Graphics changes preserved paused fighter state, worked after rotation and persisted on reload.

## Build, run and reproduce

Check out **the source branch**; the default `gh-pages` branch is a built site:

```sh
git clone --branch source/mobile-performance https://github.com/celerycore/kenjatime.git
cd kenjatime
npm ci
npm test
npm run compatibility
npm run build
npx vite --host 127.0.0.1 --port 5173
```

For a full native-format example corpus, set `MUGEN_TEST_ARCHIVE=/path/to/mugen-1.1b1.zip` when running tests. This imports files and does not execute `mugen.exe`. Browser tools require Python Playwright, Pillow and Chromium; `CHROMIUM_PATH` overrides `/usr/bin/chromium`.

```sh
python scripts/benchmark-browser.py --url http://127.0.0.1:5173/ --output work/after.json
python scripts/benchmark-browser.py --url http://127.0.0.1:5173/ --cpu 4 --frames 30 --scenes additive,custom,combined --output work/after-cpu4.json
MUGEN_TEST_URL=http://127.0.0.1:5173/ python scripts/verify-performance.py
MUGEN_ARENA_URL=http://127.0.0.1:5173/arena/ python scripts/verify-arena.py
```

Add `MUGEN_STRESS_FIXTURE=work/performance/combined.zip` to `verify-performance.py` to exercise Auto under 4× CPU throttling. The benchmark generates that fixture. `--scenes moving-parallax` exercises moving/sinusoidal geometry.

For paired baselines, create a separate worktree at `34f7043`, run `npm ci && npm run build` there, and serve its `dist` on a different loopback port. Run **the current** benchmark driver against both URLs with the same frame count and CPU setting. It works with the baseline's telemetry API. Then compare full behavior hashes and generated PNGs:

```sh
python scripts/compare-performance.py work/before.json work/after.json --output work/comparison.json
```

For the standalone compositor check, `verify-renderer.py` creates a narrow `work/render-qa` containing only test modules. Serve that folder on loopback in another terminal, then run the check:

```sh
mkdir -p work/render-qa
python -m http.server 5190 --bind 127.0.0.1 --directory work/render-qa
# In another terminal:
python scripts/verify-renderer.py
```

## Deployment

Keep source and distribution branches separate. **Do not merge the source checkout directly into `gh-pages`**; its HTML references source modules and needs the Vite build. Build/test on the current `source/mugen-compatibility` branch (`source/mobile-performance` preserves Edition 15), fetch a clean `gh-pages` checkout, fast-forward it, and copy the tested contents of `dist/` into that checkout. Preserve existing attribution files and old hashed assets. Review `git diff --check`/the staged file list, commit, then push normally without force. Confirm the Pages workflow succeeds for that exact commit.

Vite builds `/`, `/arena/` and `/arena-classic/` with relative assets and the shared current runtime. Classic attribution files are copied from public assets. Release URLs remain `https://celerycore.github.io/kenjatime/`, `/arena/` and `/arena-classic/`. Use a version query or reload if an old page is cached.

## Physical-phone checklist and follow-up

No physical Android handset was available. On at least one midrange phone, record model/SoC/RAM, Android/Chrome versions, DPR, viewport, selected quality, power-saving mode and thermal state. Run all seven scenes from a cold load and after several minutes, record presented p50/p95/slow-frame rate, simulation debt, battery/heat observations and memory after repeated character/stage switches. Check touch diagonals and short attacks, a Bluetooth gamepad, file-picker imports, audio pause/resume, screen rotation and background/foreground transitions. Compare High visuals against these goldens before changing the renderer further.

Outstanding work is scoped to:

1. Profile real Android CPU/GPU timelines. Use actual hardware evidence before claiming 30/60 FPS or selecting atlas sizes/memory budgets.
2. Reduce native Canvas copy/pass overhead for overlapping effects. If it remains dominant, add a batched WebGL2 backend behind the renderer boundary, with exact blend shaders, clipping, texture eviction/context recovery and the current Canvas path as fallback. Do not approximate subtract/custom coefficients.
3. Profile dynamic PalFX and the training grid's BGPalFX path. The latter still uses a full-background CPU readback/transform when enabled; it is not exercised by the seven routine sprite/stage benchmark paths. Remaining palette conversions on cache misses also run on CPU.
4. Extend long-duration heap/driver-memory tests, animated stage/character coverage and native visual comparisons. Imported archive/roster/sound memory remains separate from renderer cache bounds.

The extreme 4× software workload still misses the presentation target. The app reports slowdown debt rather than changing combat timing, and its graphics settings offer a bounded presentation tradeoff while this follow-up work proceeds.
