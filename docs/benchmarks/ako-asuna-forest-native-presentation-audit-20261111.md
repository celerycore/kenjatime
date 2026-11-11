# Ako / Asuna / Forest — native 4:3 and widescreen presentation audit

Date: 2026-11-11. Draft PR #14; test site `/gpu-camera-test/`. Original user-provided character and stage files remain local and are **not committed or served from GitHub Pages**.

## Why 4:3 is selectable

IKEMEN GO supports configurable match aspect ratios, including stage aspect and explicit width:height. Forest of King Cruel is an older `320,240` coordinate stage with `HIres = 1`. Its official IKEMEN GO v1.0.0 Linux reference screenshot (generated locally with Ako and Asuna) displays a centered 4:3 picture; the active region in a 1280×720 screenshot measured roughly **720×540 pixels**. It is a visual reference, **not** a deterministic frame-by-frame native oracle trace.

The Kenjatime test build now provides:

- **16:9 widescreen** (existing/default): full 960×540 frame = **426⅔ × 240** stage units, without vertical cropping. The extra horizontal room changes screen-edge behavior as expected.
- **4:3 native-style** (opt-in): centered 720×540 gameplay image in a 960×540 frame, with 120-pixel pillarboxes on each side = **320 × 240** stage units. DOM HUD stays inside the active 4:3 viewport; mobile touch controls remain outside the bars.
- Screen format selector before starting a match, plus an in-match toggle that switches the active stage camera and letterbox without resetting the fight. The saved preference is restored with the user's other match settings.

Changing aspect never changes authored constants, horizontal/vertical fighter scales, jump velocity, or gravity. ScreenBound constraints can change because the world viewport genuinely changes width.

## Original authored source values

| Item | Forest of King Cruel / Ako / Asuna |
|---|---|
| Stage localcoord | 320×240 (implicit) |
| HIres stage sprite factor | 0.5 |
| Stage camera horizontal bounds | −140 to +140 |
| Stage camera vertical bounds | −170 to 0 |
| Stage player screen margin | 15 each side |
| Stage world ground level | zoffset 220 |
| Stage verticalfollow / floortension | 0.95 / 62 |
| BG start and delta (first layer) | −600,−404 / 2,2 |
| Ako and Asuna sprite x/y scale | 0.315 / 0.315 |
| Authored neutral jump velocity, gravity | −8.4 / 0.44 |

With a 720×540 native-style view, each 320×240 world unit spans 2.25 display pixels. At `0.315` actor scale, one source sprite pixel spans 0.70875 output pixels. Original idle SFF first-frame sizes observed locally were Ako 147×414 and Asuna 295×361, yielding approximate sprite rectangles **104×293** and **209×256** pixels before clipping/sprite-specific transparency. Those dimensions and the actual IKEMEN screenshot are consistent in general character scale; they are not proof of per-pixel parity.

A 1200×864 HIres background sprite becomes 600×432 authored world units before camera/pan and is therefore scaled to a virtual 1350×972 pixels at 2.25 px/unit, cropped to the visible fight area. The original first-layer `delta=2,2` is preserved. No background art is resized independently to fill a 16:9 frame.

## Actual headless jump-state comparison using the original assets

In the full Core with Ako and Asuna on Forest, **forced execution** of their authored jump state `40` (followed by states 50, 52, 0) measured:

| Metric | Ako 4:3 | Ako 16:9 | Asuna 4:3 | Asuna 16:9 |
|---|---:|---:|---:|---:|
| World-coordinate jump apex | −84.40 | −84.40 | −84.40 | −84.40 |
| Minimum stage camera Y | −21.28 | −21.28 | −21.28 | −21.28 |
| Minimum relative screen movement | −63.12 | −63.12 | −63.12 | −63.12 |
| Return to ground | Yes | Yes | Yes | Yes |

The stage follows the jumper upward, so its 84.4-unit world displacement appears closer to a 63.1-unit displacement relative to the moving camera. The nominal constant-motion estimate `v²/(2g)` from −8.4 and 0.44 is ~80.2 units; precise simulation differs due to discrete ticks and authored transitions. No jump-height multiplier has been inserted.

**Separate input-controller limitation:** in a local training-input test, simply holding Up did not move either original character out of state 0. The authored files explicitly include human Up-triggered jump *cancel* states and AI-driven jumps; whether the missing neutral Up transition is an authored difference or a Kenjatime command fallback gap has **not yet been compared with an identical manual-input native IKEMEN capture**. Do not claim that on-device neutral jumping is fully fixed on the basis of forced-state jump physics tests.

## Validation and remaining boundaries

- `test/core/presentation-modes.test.js`: modes, 4:3 viewport rectangle, stage sprite scale, camera bounds, jump state parity, and runtime switching.
- `scripts/core/verify-browser.py`: opens actual built browser Core, chooses 4:3, toggles 16:9 and back mid-match, confirms UI and saved selection; runs in CI on real Chromium.
- `test/core/legacy-stage-viewport-regression.test.js`: existing wide view, explicit crops, 16:9 authored localcoord remain protected.
- These are presentation and simulation tests; physical mobile GPU, camera smoothness under high-load Ako/Asuna specials, player-input parity and native frame-perfect camera correctness still require manual hardware/native comparison.
- The deployed preview stays isolated under `gh-pages/gpu-camera-test/`; main `/arcade/core/` and other test sites are unchanged.
