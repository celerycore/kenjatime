# Kenjatime Core R8 — Stage 1 GPU-residency hardening (2026-11-14)

**Scope:** stacked on PR #18 (itself stacked on PR #17). **This is not a
production deployment and does not certify MUGEN 1.1 or physical Android FPS.**

## Existing R8 work preserved

- GL_R8 indexed sprites, 256x1 RGBA8 palette textures, nearest filtering,
  byte-aligned odd-width uploads and PalFX shader path (PR #17).
- A bounded sprite restore cache, offscreen-quad filtering, 64 MiB initial
  GPU backing allocation budget (up to 96 MiB after repeated measured thrash),
  60 Hz deterministic combat, adaptive presentation and telemetry (PR #18).
- The production JavaScript Core stays authoritative; Kotlin/Wasm remains off
  by default. The isolated R8 publisher may touch only `r8-benchmark/`.

## Stage 1 correction: stage-video updates under memory pressure

Previously normal R8 sprites could evict inactive textures, but
`CoreThreeRenderer.updateVideo()` rejected any frame that exceeded remaining
GPU backing budget without trying the same LRU path. Its throw was caught in
`src/core/runtime.js` and permanently marked that video as failed for the
match. This unnecessarily disabled video backgrounds when old sprites
occupied reclaimable space.

Now the sprite/video paths share `makeRoomFor()`. On a new video frame:

1. Retain the most recently visible art, built-in white/spark textures and the
   video being replaced.
2. Evict only inactive allocations in LRU order if the replacement's **growth
   delta** needs space. Replacing a 1024-byte video with another 1024-byte
   frame does not allocate a second 1024 bytes in residency accounting.
3. Keep per-format raw allocation counters consistent when a video or sprite
   is evicted.
4. If the visible frame genuinely cannot fit, close the transferred bitmap,
   increment `deferredVideoFrames` and return `false` without throwing or
   permanently marking the video as failed. Later video frames can retry.
5. Expose `videoTextureBytes` and `deferredVideoFrames` in runtime stats,
   the isolated R8 HUD and *appended* CSV columns `video_gpu_mib` and
   `video_deferred_frames`. Existing CSV column positions stay unchanged.

**Memory caveat:** all counters estimate raw texture backing allocations, not
total driver/GL/OS GPU or browser heap memory. No codec claim is made.

## Automated regression gates

```sh
node --test test/core/indexed-r8-textures.test.js \
  test/core/gpu-residency-regression.test.js \
  test/core/r8-video-residency.test.js
npm run test:core
npm run build:core
npm run verify:core:browser
python scripts/core/verify-r8-benchmark.py
```

`r8-video-residency.test.js` covers an old sprite evicted to admit new video
while keeping visible fighter art; video grow/shrink/replacement deltas; a
deferred frame at an impossible live-frame budget; video eviction by a new
sprite with counters reconciled; and bitmap release on invalid/colliding data.

The isolated R8 workflow now runs the new tests in its focused pass, and the
Playwright benchmark test checks the new HUD and CSV schema. **No automated
test can substitute for real GPU video decoding, palette animation, and native
mobile memory behavior.**

## Physical-device acceptance (not completed by this change)

Record each phone model, Android/browser/WebView version, device RAM,
orientation and test build SHA.

1. Open an *isolated* R8 preview build, import bundled KFM and then large
   original user-owned packages (Nu-13, Tomoka/helper-heavy, Forest stage,
   Ako/Asuna where available). Do not commit character archives.
2. Run 4:3 and 16:9, landscape and portrait, both Sharp and Auto, and an
   endless CPU match long enough to observe cache churn. Export R8 CSV.
3. Verify actual WebGL2 pixels: index-zero transparency, nonzero indexed
   palette colors, ACT selection, hit-pause PalFX, transparency/blending and
   restored art after repeated eviction; compare original reference captures.
4. Confirm that indexed/palette/true-color/video raw byte counters are
   nonnegative and sum to no more than total texture bytes. Confirm
   `textureBytes <= textureBudgetBytes` after every frame.
5. Confirm visible fighter textures are not evicted mid-frame, missing frames
   do not remain permanently blank, stage video recovers after pressure and
   video-frame deferrals do not kill combat.
6. Record real presentation FPS/frame interval p50/p95, deterministic 60 Hz
   ticks, worst simulation backlog, GPU residency high-water mark, video
   deferrals, import peak RAM, thermal throttling and any context losses.
7. Run tests long enough to detect continuously growing memory and validate
   pause/background recovery.

**Release gates:** CI green, real-device signoff, original-character visual
regressions, public R8 SHA verification and unchanged production
`/arcade/`, `/core-test/`, site root. Until all pass, keep the PR draft and
the public production Core unchanged.
