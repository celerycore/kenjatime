# Kenjatime Core — production release acceptance checklist

Release candidate branch: `release/gpu-camera-js-fallback-20261111`  
Production source: `feature/kenjatime-arcade-browser-ui-20261111` (auto-publishes `/arcade/` on push)  
Production URL: https://celerycore.github.io/kenjatime/arcade/core/index.html  
Validated isolated test URL: https://celerycore.github.io/kenjatime/gpu-camera-test/

## Included fixes

- Correct 16:9 320×240 legacy-stage framing (426⅔×240 world units, not 320×180 crop).
- Optional native-style 4:3 pillarbox (320×240 world units) and in-match toggle.
- Preserve imported custom HUD, real character select portraits, Endless Round Mode, stage importer, and existing player input.
- Reconstruct evicted fighter/stage SFF sprites in the **same render frame** when possible while preserving the arcade branch's active texture protection, 64 MiB GPU residency cap and nonfatal deferral.
- Keep the JavaScript Core runtime authoritative. **Kotlin/WASM is not a production dependency nor enabled by default.**
- Do not publish original user-uploaded Ako, Asuna or Forest character/stage packages.

## Release gate — no automatic production release

**Pending real Android device test**. Existing Android emulator tests are not a substitute. Do not merge the release PR into the auto-deploying production source branch before this gate passes.

On a physical Android phone using Chrome, open https://celerycore.github.io/kenjatime/gpu-camera-test/ and import the original `Ako.zip`, `Asuna.zip`, `Forest of King Cruel.rar` from local files. Run a minimum **15 minute** match in each 4:3 and 16:9 mode (at least 30 minutes total), alternating specials, multiple rounds, jumps, camera scrolling, and high-effect actions. Toggle formats without ending the match. Include an extended CPU/Endless Round test of at least 15 minutes. The match must not close, report a GPU texture budget fatal error, lose the WebGL context, or show persistent missing sprites. Record device model, Android version, browser/WebView version, approximate FPS, date and any issue/screenshots.

Validate:
- 4:3 pillarboxed and 16:9 expanded framing; original sprite and stage scales, floor alignment and camera boundaries
- Two-player/input controls work while toggling; controls do not overlap the visible frame
- Existing portrait HUD and health bars remain visible; Endless Round Mode still functions
- Character archive import and local persistence work after restarting browser
- Touch handling, audio, GPU context, heat and battery impacts are acceptable on the actual phone

### Required acceptance record

- Tester and time/date: **PENDING**
- Physical phone make/model: **PENDING**
- Android and browser versions: **PENDING**
- Test recording / screenshots / device log: **PENDING**
- 4:3 and 16:9 original-asset gameplay: **PENDING**
- GPU crash absence and HUD/Endless compatibility: **PENDING**
- Decision: **NOT APPROVED FOR LIVE RELEASE**

Once documented physical QA passes, request review/approval of the release PR, merge into the production source branch, and verify the automatic GitHub Pages deployment. Back out by reverting the production commit if any user-visible regression occurs. Do not merge the experimental Kotlin/WASM PR #14 as part of this release.

**Note:** Neutral Up input compatibility for original Ako/Asuna was previously reported as unverified despite forced jump-state physics parity. Do not claim this separate compatibility gap is fixed without testing the actual original controls on device.
