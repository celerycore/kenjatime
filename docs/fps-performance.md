# Sprite-cache and palette processing performance: Edition 21

This pass addresses severe lag reported in desktop Brave on the training grid and during attacks. Reproduction found repeated canvas uploads and palette-processing allocations. It keeps the existing Canvas blend compositor, character/controller execution, entity counts, effects and fixed 60 Hz simulation.

## Measured results

The supplied Forest stage was replayed with identical input, actor state and background clocks in frozen Edition 20 and Edition 21 builds. Each High/Low measurement follows 40 warm-up ticks and samples 60 rendered ticks. Instrumentation counts canvas creation and `putImageData` bytes only during the measured interval.

| Measurement | Edition 20 | Edition 21 |
| --- | ---: | ---: |
| Forest High render median | 26.8 ms | 3.1 ms |
| Forest High render p95 | 130.2 ms | 18.1 ms |
| Forest Low render median | 26.6 ms | 2.2 ms |
| Forest Low render p95 | 124.1 ms | 19.1 ms |
| Canvas uploads over 60 ticks | 7,991 | 43 |
| Uploaded pixel bytes over 60 ticks | 1,028,770,656 | 160,298,520 |
| Layered PalFX transform median, 524,288 pixels | 226.8 ms | 15.7 ms |

High p95 rendering time improves by **86.1%**; canvas upload count falls **99.5%**. The separate Node/V8 PalFX CPU test is **14.5× faster**, with byte-identical output. These are software Chromium render timings and a CPU microbenchmark, **not physical Brave FPS measurements**. They omit browser presentation/driver/compositor costs and do not guarantee a frame rate on a particular computer.

The Forest High/Low screenshots and actor/stage hashes match exactly. All seven existing benchmark scenes retain identical pixels and gameplay hashes. Their warm-cache attack timings remain broadly similar: additive p95 14.4 → 13.2 ms, custom blends 16.1 → 15.6 ms, combined effects 32.0 → 32.0 ms. Timing noise remains visible in small cases; this release does not claim every scene became faster.

## Implementation

- `sprite-surfaces.js` stores uploaded canvases and metadata in the 12 MiB surface LRU. Raw RGBA/index arrays remain in each bank's existing bounded decode cache and are read on demand for color effects. Cache hits no longer decode a sprite first. Opaque indexed backgrounds are materialized directly, avoiding an unused transparent surface plus a second opaque surface. Linked/selected palettes keep distinct keys.
- `formats.js` expands indexed sprites with packed RGBA words. Palette bytes are copied into a native-endian lookup table, so unaligned views, color order and alpha remain correct on either byte order. Invalid palette indices retain their diagnostics. PNG conversion also avoids allocating a temporary four-channel array per pixel.
- `effects.js` prepares color, multiplier, sine and post-add parameters once per effect invocation. Scalar channel operations preserve layer order, intermediate clamping and final truncation, removing RGB arrays and repeated sine calculations from the pixel loop.

Surface/decode cache budgets are unchanged. The renderer's blending and clipping algorithm is unchanged. Rendering presets retain their existing resolutions/targets; helpers, projectiles, effects and simulation ticks are not dropped.

## Validation

The full local corpus passes **466 tests**, with no skips when all supplied archives/exports are provided. Eleven new cases cover surface lifetime/opaque and selected palettes, packed expansion/unaligned buffers, and exact layered PalFX output. A preserved preceding PalFX implementation is a regression oracle, not independent native-engine proof.

Browser checks cover Forest import/animation/music/camera on all three pages, foreign AIR and victim palette pixels on Classic, ownpal/projectile colors, controller input/remapping/disconnects, real Tomoka/Taiga RAR imports, landing recovery and fixed-step/render cadence. The bundled KFM retains its existing AIR warnings; those warnings are distinguished from stage errors. See [compact evidence and build hashes](fps-performance-evidence.json).

Reproduce against separately served old/current builds:

```sh
MUGEN_FOREST_RAR=/path/Forest.rar python scripts/benchmark-heavy-stage.py \
  --url http://127.0.0.1:5186/before/ --output work/forest-before.json
MUGEN_FOREST_RAR=/path/Forest.rar python scripts/benchmark-heavy-stage.py \
  --url http://127.0.0.1:5186/after/ --output work/forest-after.json
node scripts/benchmark-palfx.mjs
python scripts/benchmark-browser.py --url http://127.0.0.1:5186/after/ \
  --output work/performance-after.json
```

## Desktop Brave settings

Refresh the arena with `?v=21` and check **WEB EDITION 21**. In Brave, enable **Settings → System → Use graphics acceleration when available** and relaunch if changed. In the arena, **Balanced** targets 60 FPS at a lower rendering resolution; **Low** targets 30 FPS. Both retain 60 Hz combat simulation. The optional Performance display can distinguish rendering cost from simulation cost.

Physical Brave/Android hardware, GPU drivers, wider character replays, true-color animated palette effects and a future batched GPU renderer still need profiling. Native engine parity and full character compatibility remain unfinished.
