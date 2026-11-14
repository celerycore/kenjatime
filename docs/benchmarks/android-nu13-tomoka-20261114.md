# Kenjatime Android R8 — Nu-13 vs Tomoka Minato, 2026-11-14

**Status:** Android CSV received; source optimization implemented on isolated
branch `perf/r8-android-csv-20261114`; no claim of measured speedup yet.

## User's physical-device baseline

The user supplied a locally exported R8 benchmark CSV covering **185 samples,
approximately 92.0 seconds** and one character pairing: Nu-13 versus Tomoka
Minato. The user-owned CSV and character files are not committed to GitHub.

| Reported measurement | Baseline |
| --- | ---: |
| Rendering preset | Performance at 672×378 (70% backing scale) |
| Presented FPS median / p95 | 22.02 / 28.00 |
| Frame packet + renderer CPU p50 / p95 | 11.6 / 43.76 ms |
| Simulation tick CPU median / p95 | 13.1 / 23.04 ms |
| Completed simulation ticks | 285 → 3,855 (3,570 ticks) |
| Real elapsed duration | 92.0 seconds |
| Effective simulated ticks / real second | 38.8 Hz (target 60 Hz) |
| Final simulation debt | 1,957 pending ticks (~32.6 sec of game time) |
| Final resident raw GPU texture bytes | 95.72 MiB of 96 MiB budget |
| Final GPU evictions | 4,953 |
| Final CPU sprite restore hits / misses | 77 / 3,051 |
| Final sprite cache promotions / stores | 1,077 / 1,077 |
| Last retained restore-cache size | 15.836 MiB / 16 MiB budget |
| Final Wasm numeric expression calls | 3,848,665 |
| Final interpreted expression calls | 983,352 |
| Model/video memory | 0 MiB stage video in this match |
| Missing visible textures / palette draws | 0 at every recorded sample |

The reported game tick backlog grows steadily, so lower resolution alone
cannot recover simulation time. Repeated SFF sprite restoration/GL allocation
and many numeric trigger invocations are plausible CPU contributors. The CSV
does not identify individual CPU call sites, so these remain hypotheses until
the next device comparison.

## Isolated optimization under review

1. **R8 restore cache:** Compression of sparse index-zero runs, reversible
   byte for byte, with 16 MiB cache budget retained. Non-R8 and high-entropy
   art stays raw. Fix periodic-image sampling alias via odd stride.
2. **GPU churn:** Recycle a previously allocated `DataTexture` only for an
   inactive texture with exactly the same width, height, data format and
   byte count. Preserve visible texture pinning, ordered redraw and PalFX.
   Continue bounding GPU residency at the previous 64–96 MiB range.
3. **Expression overhead:** Change numeric Wasm host bridge wrappers to
   fixed-arity function signatures, preserving typed outcomes.
4. **Simulation scheduling:** Only when 120+ simulation ticks are already
   overdue and a tick costs more than 5 but no more than 14 ms, execute
   two full ticks in the same worker callback. No tick, input phase or
   state-controller operation is skipped; the normal 30/60 FPS presentation
   targets remain intact.
5. **Diagnostics:** Append compressed entries, saved raw CPU MiB,
   decompression count, recycled GPU object count, frame packet CPU,
   SFF restore CPU and renderer CPU to existing R8 CSV schema. Older columns
   stay in their exact original order.

## Automated verification

```sh
node --test test/core/r8-android-csv-performance.test.js \
  test/core/r8-texture-reuse.test.js \
  test/core/indexed-r8-textures.test.js \
  test/core/gpu-residency-regression.test.js \
  test/core/r8-render-starvation.test.js \
  test/core/r8-video-residency.test.js
npm run test:core
npm run build:core
python scripts/core/verify-r8-gpu-pixels.py
npm run verify:core:browser
python scripts/core/verify-r8-benchmark.py
```

The only accepted deployment path for this experiment is
`/r8-android-perf-preview/`. GitHub Pages production
`/arcade/`, other previews and the site root must remain unchanged.

## A/B physical device signoff (pending)

Use **the same phone**, Nu-13 and Tomoka Minato archives, match settings,
performance preset, screen orientation and 90+ second recording duration in
both the old R8 Stage 1 and the new Android performance preview.

Compare median FPS, actual completed 60Hz simulation ticks / real second,
final backlog and backlog slope, GPU evictions/sec, GPU recycled allocations,
CPU restore-cache hit rate, compressed memory saved, p50/p95 sprite restore
CPU and frame render CPU, thermals, touch latency and browser memory. Review
exact palette/PalFX pixels and helper sprites.

If slower, increases RAM dangerously, corrupts art, breaks 60Hz hashes,
or drops frames when a GPU texture is reused, **revert this experimental
branch** and retain the Stage 1 preview. No MUGEN 1.1 native parity or
physical 60 FPS certification is implied by CI success.
