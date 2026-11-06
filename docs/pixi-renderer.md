# PixiJS / WebGL renderer prototype

Android test app 0.1.2 adds an optional PixiJS 8.22 WebGL2 renderer. In the arena setup, choose **Renderer → PixiJS · WebGL prototype**. Canvas remains the default. The same selector is present in the lab, Arena and Classic Arena. `?renderer=pixi&perf=1` enables the prototype and measurement display for a browser session; selecting it in the UI persists the preference locally.

The renderer changes drawing only. CNS/CMD execution, command buffers, collision handling, input sampling, hit clocks and the fixed 60 Hz simulation remain shared. Switching while paused does not execute a gameplay tick. Android 0.1.2 keeps the app ID and original download's signing certificate, with version code 3 for an in-place update.

## Implemented path

- Sprites draw directly as textured GPU quads, with existing sprite axes, palette remaps, facing, scaling and the projected X/Y/Z rotation matrix.
- Contiguous quads sharing a texture, palette program, clip and hardware blend mode form a batch. Blend coefficients and opacity are vertex attributes, so normal/add/addalpha sprites can share a batch without sorting or changing painter order. Subtraction uses a separate reverse-subtract blend state.
- Up to eight layered PalFX operations run in the fragment shader: grayscale/color, inversion, add, sine, multiply and post-add. The result truncates to the integer channel value after the layers, as the CPU path does. Static palette remaps still use the existing SFF decoder.
- Textures use stable character/sprite/palette keys, nearest sampling, no mipmaps, a 16 MiB texel budget and complete-frame pinning before eviction. No helpers, trails, projectiles or stage elements are dropped to meet the budget. CPU upload arrays can occupy a similar amount of memory in addition to GPU storage.
- Canvas primitives and the existing CPU parallax rasterizer are staged between GPU batches in original draw order. Static staging layers reuse their textures. Grid BGPalFX, parallax generation and some palette work therefore remain on the CPU. This is a hybrid prototype, not an entirely GPU-rendered stage implementation or a complete-frame Canvas-to-WebGL copy.
- Missing WebGL2, context loss, nonrectangular/rotated clips, fractional clip edges, oversized textures, more than eight palette layers or an excessive frame budget return the frame to Canvas. Small float32 transform noise at integer clip edges is normalized. The fallback is shown in the UI and exported report.

The fractional-clip fallback is intentional: Canvas applies its antialiased destination clip after blend saturation, which cannot be reproduced by multiplying the source alpha before blending. A later implementation needs destination-aware compositing or an equivalent mask pass.

## Validation

The existing supplied corpus passes **477 tests, zero failures and zero skips**. The existing native startup regression still verifies the corrected local entry URL. GPU-specific browser checks add:

- 324 aligned blend, alpha, palette and rectangular-clip comparisons against Canvas: maximum channel difference 2/255.
- Mixed normal/add/alpha coefficients inside a shared batch, geometry-buffer reuse, nested clips with interleaved Canvas primitives, three projected rotation fixtures, texture-budget rejection and visible-set pinning.
- A 100-sprite repeated-texture scene becomes one GPU batch.
- The lab, both arenas and mobile UI retain expected touch damage, paused state across renderer switches, resolution changes, collision-box drawing and context-loss fallback. A device without WebGL and a fractional stage window both use Canvas.
- Eight existing/supplied benchmark scenes produce identical exported gameplay hashes across renderers, including helpers/projectiles/trails and Forest of King Cruel.

Full-scene images are **not pixel-identical**. Canvas and WebGL rasterize transformed edges differently; the evidence records mean/max channel error and the number of pixels above a three-channel-value tolerance. The projected-shape tests allow a one-pixel raster boundary. The prototype is not certification of native MUGEN visual equivalence.

## Measurements and limits

The following is one sequential, 30-frame pass in **software Chromium/SwiftShader**, at High resolution, after a 115-tick warm-up. It is not Android hardware FPS. Values are CPU drawing submission times, in milliseconds:

| Scene | Canvas median | Pixi median | Canvas p95 | Pixi p95 |
| --- | ---: | ---: | ---: | ---: |
| Idle | 0.1 | 0.4 | 0.3 | 4.0 |
| Additive effects | 2.5 | 0.9 | 4.8 | 2.2 |
| Custom blends / PalFX | 3.2 | 1.8 | 5.8 | 7.7 |
| Helpers / projectiles / trails | 3.1 | 3.9 | 6.3 | 34.2 |
| Combined stress | 5.9 | 3.7 | 12.9 | 36.7 |
| Forest stage | 1.1 | 6.7 | 16.0 | 195.6 |

The seven small scenes need no new texture-source uploads during the measured warm interval. Forest still uploads large animated frames within the bounded cache and has much worse CPU tail latency. This is why the renderer remains opt-in. Indexed textures, atlas/streaming work, palette batching and CPU allocation reduction are still necessary before considering a default change.

The benchmark also records fenced frame costs: `gl.finish()` for WebGL and a separate one-pixel Canvas readback surface for Canvas. Reading the game Canvas every frame was rejected as a measurement method because Chromium can switch it to software rasterization and change both timing and pixels. These barriers are not identical implementations; fenced results must not be advertised as a phone FPS multiplier. Use the CPU timings, frame-pacing telemetry and real-device recordings together.

The Performance overlay and report identify the actual renderer, fallback reason, GPU batches, texture bytes and texture-source creations/updates requested. These counters are not driver-level GPU allocation/upload profiling. [Compact evidence](pixi-renderer-evidence.json) includes the measured values and comparison scope.

## Reproduce

With Python Playwright, Chromium, NumPy and Pillow available:

```sh
npm ci
npm run build
# Serve dist under /next/ on port 5186 for the following checks.
python scripts/benchmark-browser.py --url http://127.0.0.1:5186/next/ --frames 1 --output work/fixtures.json
python scripts/verify-pixi-app.py
MUGEN_FOREST_RAR=/path/to/Forest.rar python scripts/benchmark-pixi.py --scenes idle,sparks,additive,custom,entities,parallax,combined,forest
# Run Vite separately on port 5193 for direct module comparisons:
npx vite --host 127.0.0.1 --port 5193
python scripts/verify-pixi.py
```

Run performance benchmarks sequentially. Pixel capture is an explicit test operation and is not part of normal rendering. The Canvas reference and existing compatibility checks remain available. Physical Android/WebView FPS, thermal behavior and memory pressure have not been measured by these desktop checks.
