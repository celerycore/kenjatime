# Forest stage performance

The uploaded Forest of King Cruel stage has 64 static tiles and two additive fire animations. Its 20 fire sprites expand to roughly 80 MB of RGBA data, much of it transparent padding. Cycling them through smaller caches repeatedly decoded images, created Canvas surfaces and uploaded WebGL textures. The largest pauses occurred when animation frames changed.

The importer now prepares eligible large, masked SFF v2 stage animations inside its disposable worker. It crops fully transparent padding, retains a transparent guard texel, preserves the original sprite axes/dimensions and keeps indexed pixels with their palettes. Forest's complete fire sequence occupies **7,113,650 bytes** of prepared data. The WebGL shader reads one-byte R8 indices through a shared RGBA palette; all 20 frames fit alongside the static tiles in the existing 16 MiB texture budget. Canvas lazily expands only cropped active frames in a separate 8 MiB surface cache. Choosing WebGL releases that Canvas cache.

No background layers, animation frames, effects, camera rules or simulation ticks are removed. Static, unmasked, tiled, parallax, PNG and unsupported animations retain their established path. Preparation has an 8 MiB retained-data budget and a 32-million-pixel scan limit across an import. Malformed or over-budget assets retain normal import/renderer diagnostics. Saved original archives are prepared again when reopened; no archive conversion is needed.

## Paired measurements

Desktop Chromium/SwiftShader, mobile viewport, sequential runs, identical supplied archive, 90 warm-up ticks followed by 120 measured frames per scene. These are CPU render submission timings, **not physical Android FPS**.

| Preset / renderer, idle | Before median | After median | Before p95 | After p95 |
| --- | ---: | ---: | ---: | ---: |
| High / Canvas | 1.2 ms | 1.1 ms | 24.6 ms | 5.2 ms |
| High / WebGL | 6.5 ms | 1.6 ms | 248.3 ms | 9.6 ms |
| Low / Canvas | 1.2 ms | 1.0 ms | 18.5 ms | 3.5 ms |
| Low / WebGL | 5.8 ms | 1.1 ms | 114.9 ms | 7.7 ms |

WebGL requested **320,657,288 upload bytes in 89 texture uploads → zero** during each measured warm interval. Alternating movement/jump/attack input cases also improve: High WebGL p95 271.4 → 6.8 ms, Low 113.2 → 5.5 ms. High idle fenced median falls from 8.6 → 2.3 ms for WebGL and 57.9 → 28.9 ms for Canvas. The fences use WebGL `finish()` and a separate one-pixel Canvas readback; they are different synchronization mechanisms and cannot establish a phone FPS multiplier. Texture counters describe requested source updates, not driver-level allocations.

All eight paired gameplay/stage hashes match. A separate mobile UI check compares every fire animation phase and a 200-tick walk, in High/Low and Canvas/WebGL. It reaches camera x=136 with matching gameplay hashes and responsive worker import. Every visible original sprite texel is preserved in the indexed reconstruction test. Cropping changes nearest-sampling rounding at some fractional raster boundaries: across the 44 paired animation/camera captures, the largest mean channel difference is 0.0347/255 and the largest changed-pixel fraction is 0.839%. Images are not pixel-identical. Palette lookup itself matches RGBA WebGL output exactly in 36 blend/alpha/PalFX cases.

The supplied corpus passes 482 tests with no failures/skips. The lab and both arenas retain stage import, scrolling, animation and music; GPU route checks also cover the mobile UI, renderer switching, touch damage and Canvas fallback. The user's stage artwork/music are not bundled in the app or repository. [Recorded measurements and validation](stage-performance-evidence.json) include all scenes and image comparison limits.

## Use and reproduce

Refresh the browser arena, or install Android test app 0.1.3 over the existing app. Reopen Forest from the library or import the original RAR. Choose **Renderer → PixiJS · WebGL prototype** for the indexed GPU path. Canvas remains the default and also receives the stage preparation/cache improvements. Low graphics remains useful on phones. Context loss or unavailable WebGL retains Canvas fallback.

Serve the old build under `/before-stage-lag/` and the new build under `/next/` on port 5186. With the archive supplied locally:

```sh
export MUGEN_FOREST_RAR=/path/to/Forest.rar
python scripts/benchmark-stage-lag.py --url http://127.0.0.1:5186/before-stage-lag/ --output work/stage-lag/before.json
python scripts/benchmark-stage-lag.py --url http://127.0.0.1:5186/next/ --output work/stage-lag/after.json
python scripts/verify-stage-optimization.py
python scripts/verify-stage-import.py
# With a Vite development server on port 5193:
python scripts/verify-pixi.py
```

Run timing passes sequentially without competing builds/tests. The `stageopt=0` query disables prepared drawing for same-build visual comparisons. Real Android/WebView sustained FPS, thermals and device memory pressure still need a physical-phone recording with the same fighters and attack sequence.
