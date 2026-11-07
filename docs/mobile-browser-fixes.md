# Embedded fights and mobile WebGL uniform handling

Fight now mounts a match in the existing arena viewer. The browser stays on the
same page, with no new tab, automatic fullscreen, orientation request or scroll
lock. Menu removes the match, terminates its worker and restores the preview.
An unavailable fight module restores setup with a reload message, so a failed
load does not leave a blank overlay. Retry works without leaving the page.

The renderer now checks the uniform location before querying its initial value.
Active-uniform reflection can contain entries with no scalar location, including
uniform-block members. Passing null to `getUniform` throws the exact TypeError
reported on the phone. Skipping these entries avoids that invalid query and
leaves the remaining uniform and shader behavior intact.

The graphics regression adds such an entry to real WebGL2 reflection. Before
the fix it reproduces `parameter 2 is not of type 'WebGLUniformLocation'` in the
Three adapter. After the fix all 49,152 RGBA channels match the reference, with
zero invalid uniform reads. This reproduces the failure mode; it does not claim
that the user's physical GPU was available to inspect.

The match frame retains the engine's 854:480 aspect ratio in both orientations.
Short landscape screens reduce its width and center it rather than stretch the
frame. Portrait touch controls sit below the video. Landscape controls occupy
the lower corners, while Menu, Pause, sound and quality controls sit below it.
Names, life, power, health values, timer and win marks use a compact layout near
the top. Bar fills and text are larger; HUD layers and spark scaling remain
unchanged. The Go/WASM binary is byte-identical to the recovery point.

Verification commands:

```sh
npm test
npm run build
python scripts/verify-go-gpu.py
python scripts/verify-embedded-battle.py
python scripts/verify-browser-runtime.py
python scripts/verify-go-presentation.py
MUGEN_QA_MAIN_FALLBACK=1 MUGEN_QA_SCRIPT_AUDIO=1 python scripts/verify-go-presentation.py
python scripts/verify-go-engine.py
```

The embedded fight regression covers portrait and landscape phone emulation
plus desktop, fixed frame proportions, both fighters, blocked popup/fullscreen/
orientation APIs, pause, Menu, worker teardown, missing frame code and retry.
Presentation checks measure stage PCM output and actual HUD/spark pixels in
both the worker and main-thread fallback. These are host browser tests; no new
physical Infinix FPS or device result is asserted.

The captured results are in `mobile-browser-fixes-evidence.json`: 513 repository
tests passed with no skips, all three embedded layouts passed, GPU pixels were
unchanged under the missing-location regression, and both audio/render paths
passed the presentation check. Supplied Tomoka and Forest RARs also started,
including Forest's streaming MP3.

The previous smooth renderer remains available under the
[source and Pages recovery tags](three-smooth-recovery.md).
