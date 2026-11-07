# Browser GPU renderer rewrite

Kenjatime now maintains its Go/WASM WebGL2 submission backend in
`engine/webgl/`. The pinned IKEMEN GO simulation, MUGEN state/controller rules,
character packages and Kenjatime UI continue to use their existing interfaces.
The previous browser engine already encoded GL commands; this rewrite replaces
its copied command-buffer interpreter and per-sprite vertex transfers.

## Changes

- JavaScript reads the live WASM command buffer synchronously. Typed views refresh
  when WASM memory grows. Command submission no longer copies staging bytes to a
  second JavaScript ArrayBuffer or creates a function from a source string.
- Sprite and font vertices are packed into reusable streams, with one data
  transfer per touched VBO per submission. Geometry survives buffer-capacity
  flushes and repeated draws. Model buffer bindings are restored after packing.
- Matrix uniforms cache their last value per program/location. Custom shader
  parameter locations resolve once on load, including missing parameters.
- The default output uses a GPU framebuffer blit. The two intermediate colour
  textures and their clears are reserved for actual postprocessing. At 854×480,
  omitting these textures saves 3,279,360 bytes of colour storage. Custom sprite
  shaders and grab passes retain the existing drawing interfaces.
- Renderer `Await` now connects to the browser animation-frame pump. The old
  WebGL renderer's empty `Await` bypassed that pump, allowing render/catch-up
  loops to delay painting and input callbacks. The pump tolerates 0.5 ms of
  timestamp quantization and rebases only after a whole missed interval. The
  engine retains its fixed-tick scheduler and frame-skipping rules.
- The content-derived engine cache revision covers the new GPU bridge as well
  as the WASM payload, Go runtime and shared core.

No texture sorting or draw reordering is used: alpha/subtractive blending,
PalFX, clipping, rotations and foreground HUD order remain significant. Cold
texture uploads still use scratch arrays. There is no claim that every browser
resource operation is zero-copy, or that the Go simulation was replaced.

## Measured results

Compared with source commit `20e009340f43b37f5b1d6cb315b7a20ffef6d791`, using
Chromium/SwiftShader, an 854×480 viewport, no CPU throttling and isolated scenes.
Measurements start after at least 400 Go ticks. The effects fixture creates 96
persistent Explods with mixed normal, additive and custom-alpha AIR blending.

| Effects scene metric | Previous | Rewritten |
| --- | ---: | ---: |
| Sprite `bufferData` calls per rendered frame | 146 | 2 |
| Vertex data transfers, including font `bufferSubData` | 151 | 2 |
| Matrix uniform updates per warmed frame | 258 | 0 |
| Mean scene-clear → canvas submission elapsed time | 62.65 ms | 12.71 ms |
| 95th percentile of that elapsed time | 562.60 ms | 43.00 ms |
| 95th percentile interval of a 10 ms event-loop heartbeat | 616.60 ms | 41.50 ms |
| Animation-frame callbacks observing a new submitted frame | 17 / 191 submissions | 178 / 180 submissions |

The grid's corresponding mean elapsed time falls from 31.66 to 6.56 ms.
For the supplied Forest RAR, the mean falls from 79.74 to 9.26 ms and vertex
transfers fall from 56 to 2; animation-frame callbacks observing a new frame
rise from 15 / 231 submissions to 177 / 180. The baseline can exceed the target
180 samples because the browser cannot run the stop callback during a burst.
The elapsed measurements include simulation/catch-up work, scheduling and driver
stalls; they are **not CPU-only timings**. Lower overhead does not imply every
percentile improves: grid median elapsed time rises from 1.9 to 4.9 ms and its
95th percentile rises from 21.3 to 37.8 ms; the effects median rises from 2.7 to
8.1 ms. Mean submission intervals also do not reliably describe visible FPS:
the old implementation submits bursts while animation-frame callbacks stall.
The callback counter measures browser paint opportunities, not a hardware
compositor presentation timestamp.

These are host software-GPU measurements, not Brave/Android or Infinix X6725
FPS. The rewritten host effects scene still has roughly 85 ms mean submission
intervals. Physical-device profiling remains necessary to establish phone FPS.
Raw measurements, source hashes and visual checks are recorded in
`go-webgl-evidence.json`.

## Verification and reproduction

`test/go-gpu.test.js` compares ordered semantic draws with the exact pinned
reference interpreter. `python scripts/verify-go-gpu.py` compares 49,152 pixel
channels on actual WebGL2 across all 30 command types, mixed blending, clipping,
matrices, fonts, indexed geometry, memory growth and a flush between geometry
upload and draw. The default blit also preserves the rendered pixels.

Static real-Go grid and effects captures match the previous build exactly.
A separate 96-Explod fixture also matches all 1,639,680 pixel channels with
rotations on all three axes, perspective, shear, clipping, PalFX and subtractive
AIR blending.
Separate Go match and presentation checks cover touch damage, pause, library
imports/persistence, supplied Tomoka/Forest RARs, both fighters, visible sparks,
foreground health values, actual stage-audio PCM and audio unlock. Go CI rebuilds
and byte-compares the shipped WASM, and runs the GPU pixel regression.

```sh
npm test
python scripts/prepare-native-android.py
GOPROXY=direct python scripts/build-go-engine.py
npm run build
python scripts/verify-go-gpu.py
python scripts/verify-go-engine.py
python scripts/verify-go-presentation.py
python scripts/benchmark-go-webgl.py --label current
```

Set `MUGEN_FOREST_RAR` to the supplied stage archive to include Forest in a
benchmark; it is not redistributed. `--dist` selects an independently built
baseline, and `--capture-framebuffer` captures engine pixels without waiting for
the browser compositor. Actual shaders and draw operations are preserved;
unsupported native media decoders and model-shadow capabilities remain browser
port limitations. No stock IKEMEN UI is added.
