# Three.js browser renderer

The browser now uses **Three.js 0.187.0 WebGLRenderer** for the actual draw calls.
IKEMEN GO 1.0.0 remains the combat engine. Character states, triggers, collisions,
helpers, projectiles, input rules and stage interpretation stay in Go/WASM.
Kenjatime owns setup, uploads, controls and its HUD; no stock IKEMEN UI is added.

## Rendering and resource ownership

`engine/three/submit.js` translates the Go draw stream into ordered Three scene
batches. It uses BufferGeometry, RawShaderMaterial, external GL buffer attributes
and ExternalTexture. Fighters, backgrounds, Explods, projectiles, font batches,
indexed geometry and the final output quad are drawn by Three. This is not a
Three wrapper around the old raw `drawArrays` renderer.

The existing Go resource loader still decodes/uploads SFF sprites, palettes,
fonts and model buffers. Three consumes those GPU resources in the same context,
without decoding or uploading the character again. The material bridge preserves
the engine GLSL, native uniform values, sampler bindings, clipping, blend/depth
state and vertex layouts. It handles uniform arrays/structs and renames uniforms
that collide with Three's camera/object built-ins. Externally managed framebuffers
use Three's renderer interop API; shared Go buffers remain externally owned.

All draw objects use an explicit order, with object sorting and frustum culling
disabled. Each queued draw snapshots its material/uniform state. Adjacent quads
merge only when their shader, uniforms, textures, clipping, geometry range and
blend/depth state match. Shared quad indices and reusable draw objects avoid
per-frame geometry allocation after warming. The regression includes overlapping
merged quads so it checks pixel order as well as a reduced draw count.

The ABI decoder reads WASM memory synchronously and packs sprite/font vertices
into persistent three-region streams. It batches framebuffer/viewport commands,
mirrors GL bindings and avoids steady-state GL state queries and buffer
reallocation. Direct resource changes flush queued Three draws first.

## Browser execution, audio and controls

The normal path runs the Go VM, filesystem and Three renderer in a dedicated
worker with OffscreenCanvas/WebGL2. Package bytes transfer to that owner. The page
keeps its UI, keyboard/touch event handlers and browser gamepad access. Changed
standard/raw gamepad snapshots and rumble requests cross the worker boundary;
keyboard modifiers and short-tap latching remain supported. Match readiness
requires a running match, and state/damage/pause updates publish from Go.

The Go mixer and existing music decoders feed an AudioWorklet using three
reusable 1,024-frame stereo blocks over a MessagePort. No cross-origin isolation
or SharedArrayBuffer is required. The PCM queue handles different sample rates,
underruns and startup priming. Menu terminates the worker and closes audio.
Unsupported worker/canvas APIs use the main-thread renderer; unsupported audio
worklets use a ScriptProcessor queue. Tests exercise both paths with actual audio
output, rather than accepting a decoder flag as proof of sound.

The browser animation boundary is the render wait. The adapter removes the
additional timer sleep while retaining the engine's fixed-tick deadline,
catch-up and frame-skipping decisions. It does not run gameplay faster to improve
a render counter.

## Visual quality

**Visuals: Auto** starts at full detail and can reduce backing pixels to 75% or
50% per axis under sustained render load. It restores detail conservatively.
**Visuals: Sharp** retains full detail. The choice persists on the device.

Only render targets, viewport and scissor coverage change. The logical window,
MUGEN coordinate space, camera field of view, collisions and simulation clock
remain fixed. The normal 854×480 output can therefore use 641×360 or 427×240
backing pixels without changing gameplay positions. Auto trades image detail for
less pixel work; it is not a claim of identical pixels at reduced resolution.
Custom sprite shaders, external postprocessing and 3D model stages retain full
resolution to preserve pixel-dependent effects. Screenshot readback returns the
requested logical image size.

## Verification and measurements

The source evidence is in `three-browser-evidence.json`. Fixed-wall-time
benchmarks compare source `4f9367a0e44e3d8f8ba7fc6e212fe203c0e72a4c` with this
renderer using Chromium/SwiftShader, no CPU throttling, an 854×480 viewport and
at least 400 warm-up Go ticks. Each measurement window lasts approximately six
seconds. The effects fixture creates 96 persistent Go Explods; Forest is the
supplied RAR, including its relocated MP3 reference.

| Scene | Previous submitted frames/sec | Three.js Auto submitted frames/sec | Backing pixels | Simulation ticks/sec |
| --- | ---: | ---: | --- | ---: |
| Grid | 18.54 | 51.92 | 427×240 | 60.08 |
| Effects | 11.65 | 34.13 | 427×240 | 60.11 |
| Forest | 11.15 | 35.71 | 427×240 | 60.17 |

These results include Auto reducing backing pixels to 50% per axis. They do
not establish the same gains in Sharp mode or on a physical Infinix. Full detail
is separately verified for pixel fidelity.

The reported counter is **submitted frames per second**, measured at completed
canvas draw submissions. It is not a hardware presentation timestamp or physical
phone FPS. Auto's backing resolution is included with each result. Scene-clear
spans are deliberately not compared: batching changes where a queued clear
executes relative to Go simulation work.

The GPU regression compares the pinned interpreter and Three on real WebGL2,
including original command types, mixed blending, scissor windows, matrices,
fonts, indexed geometry, memory growth, array/struct uniforms, native camera
uniform names and compatible-quad merging. Full-detail real-Go pixels are also
compared with the previous effects fixture, including three-axis rotation,
perspective, shear, PalFX and subtractive AIR blending.

Additional checks cover the supplied character/stage archives, four upload
routes, persistent libraries, touch damage, physical-key event forwarding,
standard gamepad movement/disconnect/rumble forwarding, quality selection,
pause, worker termination, actual stage PCM output, sparks, both fighters and
foreground lifebar text. The controller check simulates browser gamepads; it does
not claim a physical Bluetooth controller or Infinix execution. Build CI
reproduces and byte-compares the shipped WASM.

```sh
npm test
npm run build
python scripts/verify-go-gpu.py
python scripts/verify-go-engine.py
python scripts/verify-browser-runtime.py
python scripts/verify-go-presentation.py
MUGEN_QA_MAIN_FALLBACK=1 MUGEN_QA_SCRIPT_AUDIO=1 python scripts/verify-go-presentation.py
python scripts/benchmark-browser-runtime.py --label current
```

Set `MUGEN_FOREST_RAR` to include the supplied stage in a benchmark. Use `--sharp`
for full-resolution measurements, `--main-fallback` to test the compatibility
path, and `--capture-framebuffer` to capture engine pixels independently of page
controls. Native Android engine binaries are unchanged. Existing browser-port
limitations, including video backgrounds, native-only music decoders and model
shadows, remain; passing these checks does not certify every authored package.

Three's pinned version and integrity are in package-lock.json; its MIT license
is distributed at `licenses/three-MIT.txt`. The pinned Go port, dependency notices
and source checksums remain under `engine/`.
