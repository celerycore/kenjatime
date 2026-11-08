# IKEMEN GO engine integration

The native app and the website share `src/native-setup.js`, the Kenjatime HUD definitions and `engine/kenjatime.lua`. Android runs the official ARM64 IKEMEN GO v1.0.0 libraries; the website runs the pinned v1.0.0 browser port from `energyjp/ikemen-go-web`, commit `96324a1c8aaaa5c0cb7756aebeb4b572588523ee`. The browser backend is Go/WASM, WebGL2 and Web Audio. No other project’s frontend is copied.

## Stock UI removal and the Android startup fix

The earlier launcher supplied match arguments to SDL. In the pinned Android engine, `src/util_android.go` exports `SDL_main(argc, argv)` but never copies argv to `os.Args`; the Go main routine therefore received no selected match. This allowed its default stock menu path to run. Host launch-intent tests and a Linux CLI match did not cover that Android-specific behavior.

The corrected handoff writes `save/config.ini` with `System = data/kenjatime/engine.lua`, and atomically writes validated match settings to `save/kenjatime-match.json`. The shared Lua script reads the JSON and runs a single match, then returns to Kenjatime. The browser likewise starts Go with only its program name and reads the mounted JSON/config files. A native Linux match with no command-line arguments verifies this bootstrap independently of CLI forwarding.

The APK and browser core bundle exclude `external/script/`, `external/icons/`, stock `data/system.*`, `data/ikemen1/`, `data/motif1/`, stock fight-screen artwork, and Android launcher artwork. Android upgrades delete the obsolete bundled screenpack directories while preserving `imports/`. Core fighting effects and character-owned resources remain engine data. The native APK falls from 66,331,402 bytes to approximately 18.5 MB. This packaging reduction is measured; phone FPS is not.

## Browser resource and input lifecycle

The browser importer stores extracted files as private IndexedDB Blobs with a small catalog. It mounts only the chosen fighters’ and stage’s packages plus the shared core in an in-memory filesystem before Go starts. Buffers transfer into the engine frame without another full structured-clone copy. The archive worker skips the former Canvas/Pixi stage predecoder. The old JavaScript combat interpreter and Pixi renderer are not loaded by the new entries.

The engine frame contains a canvas. Kenjatime owns the Menu/Pause controls, touch buttons, setup and uploads. Touch input goes into Go’s input system and short taps remain latched until the simulation polls them. Native touch labels map to the engine’s actual six attack bindings, including C on RT and Z on RB. Both backends use the same match settings and HUD assets.

Pause and app backgrounding clear held inputs and pause fighters. Menu disposes the browser frame/audio and returns to setup. Android destroys the setup WebView during the native match. Previously saved web archives are migrated on Open, retaining the original stored archive until explicitly deleted.

## Validation and limits

The following records describe the initial integration. Current archive/media
coverage and reproducible checks are in [the 0.4.5 report](media-archive-support.md).

- 513 repository tests pass with the available supplied corpus, without skips. Most pre-existing combat tests describe the historical JS implementation; these alone are not evidence of the Go backend.
- 25 native host tests cover private match/config handoff without relying on argv, invalid-selection rollback, actual asset preparation, removal of obsolete UI on upgrade, archive policy/registration, library persistence, picker and native launch, WebView lifecycle and audio permission handling.
- The browser smoke suite executes real Go/WASM matches, records a 23-point touch punch, verifies paused fighter state, Menu return, 24 archive imports across the four routes, invalid-import preservation, restart persistence and old-library migration. It launches the ordinary CNS Kung Fu Man ZIP, Tomoka RAR and Forest RAR with the Go VM.
- The APK verifier checks the original ten native libraries and 53 JNI signatures, versions, signatures, prepared files and absent stock UI paths. Both Android builds have lint checks. The Go build job reproduces the shipped WASM from pinned source.

These are host/browser checks, including software WebGL. No physical Infinix X6725 execution or FPS result is claimed. The browser-runtime app and website now support streamed tracker music, browser-native MP4/WebM video and WebGL2 model shadows; see [coverage and limits](media-archive-support.md). The native and browser backends share the v1.0.0 engine family and game assets, with platform-specific rendering/audio implementations and source revisions.

Build provenance is shipped at `engine/provenance.json`; source and dependency licenses are provided alongside it. Native library license notices and the matching FFmpeg source link remain available from the download page.

The compressed WASM payload uses `.wasm.bin` with a gzip header, decoded by the engine frame. Android AAPT automatically expands `.gz` asset files and strips that suffix, so `.bin` preserves the exact browser payload and URL inside the WebView APK. The APK verifier checks those bytes.

## Fighter view, stage audio and HUD correction (0.3.1 / web wrapper 0.2.1)

Setup previews both selected fighters, facing inward, with separate player labels and palettes. The static canvases release decoded sprite banks after drawing. Matches explicitly use the output aspect ratio, keeping stage camera rules and the full canvas visible; the Kenjatime grid has a wider camera margin and explicit edge insets so cornered fighters retain room for their sprites.

The HUD has larger health/power bars and names, separate P1/P2 colours, numeric health and a distinct delayed-damage trail. Controls sit above the bars. HUD graphics and text use the foreground UI layer so fighters and stage foregrounds cannot cover health values. Common fight effects are authored at 320 pixels; the 960-pixel HUD now sets FightFx scale to 3, restoring their normal gameplay size rather than shrinking them to one third.

The supplied Forest RAR stores `blood heat!.mp3` beside its DEF while requesting `sound/Blood heat!.mp3`. Music references resolve to exact package paths first, then an adjacent relocated file; lookup never borrows a basename from another import. Web matches patch only their in-memory DEF. Native matches create a private hidden DEF beside the original, retaining relative sprite references and the original catalog/library entry. Both handle case and Windows separators.

The browser resumes its actual audio contexts from fight input and provides an Enable sound / Sound on / Sound off control. Pause and mute remain separate. The presentation regression uses Chromium's user-activation autoplay policy, captures real nonzero PCM output from an imported WAV stage, checks both fighters' screen coordinates, and compares lifebar/damage and spark pixels. It complements the supplied Tomoka/Forest match checks and the native host tests; physical Android audio remains a device check.

The browser core, WASM payload, Go runtime and engine frame share a content-derived cache revision. Updates load those resources together, including in a previously used Brave tab or Android WebView. The presentation check verifies all four requests carry the same revision.

The maintained browser GPU submission backend and its measured frame-pacing,
transfer and pixel results are described in [the Three.js browser renderer report](three-browser-renderer.md).
