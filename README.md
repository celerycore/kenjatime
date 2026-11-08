# Kenjatime Android builds

Independent rewrite preview: **[Kenjatime Core 0.5.3](downloads/kenjatime-core-0.5.3-preview.apk)** · [checksum](downloads/kenjatime-core-0.5.3-preview.apk.sha256) · [build evidence](downloads/kenjatime-core-0.5.3-preview-build.json) · [Web preview](https://celerycore.github.io/kenjatime/engine-preview/).

This preview uses the independently authored combat runtime, numeric Wasm compiler and Three.js renderer. It updates earlier Core previews in place and installs alongside the recovery app, with its own library. Optimizes common trigger reads and fixes deferred animations, edge triggers, facing changes, guard/trip transitions and recovery from state-loop limits. All 16 interaction scenarios and 132 of 147 wider moveset scenarios match captured root trace fields; remaining differences are explicit. The host two-fighter CPU sample used 36.6% less time; other workload results were mixed. Phone FPS and audible audio quality have not been measured. Third-party libraries and imported content retain their credits.

[Original engine source and verification](https://github.com/celerycore/kenjatime/tree/source/independent-engine) · [Core 0.5.2 recovery installer](downloads/kenjatime-core-0.5.2-preview.apk) · [Core 0.5.1](downloads/kenjatime-core-0.5.1-preview.apk).

Recovery installer: **[Kenjatime 0.4.5](downloads/kenjatime-android-0.4.5-debug.apk)**. Android 7.0+, WebView 107+. Bundles the current Three.js renderer and Go/WASM engine, fixed-aspect same-view matches, adaptive audio, common MUGEN archive imports and native archive saving. Adds multipart ZIP/RAR/7z selection, ZIP AES variants, encrypted 7z/RAR, MOD/XM/IT/S3M music, MP4/WebM backgrounds and WebGL2 model shadows.

Source: https://github.com/celerycore/kenjatime/tree/978a117c64393dddc81424d5e403c68471f697b8

[Checksum](downloads/kenjatime-android-0.4.5-debug.apk.sha256) · [Build verification](downloads/kenjatime-android-0.4.5-build.json)

Signed with the same certificate as earlier browser-runtime installers. Install over that app to preserve its library. The separate native prototype and the website have separate storage. Phone performance remains device-dependent; the recorded audio stability tests ran on the host browser.

Previous native 0.3.1: IKEMEN GO native ARM64 engine with Kenjatime UI, Android 14+ and OpenGL ES 3.2. Its installer and earlier versions are retained in downloads. No stock IKEMEN menus or screenpack assets are included.

Sources and reproducible build instructions: https://github.com/celerycore/kenjatime/tree/source/mugen-compatibility

APK license notices are bundled. Matching native FFmpeg source: https://github.com/ikemen-engine/Ikemen-GO/releases/download/v1.0.0/src_ffmpeg.tar.gz

The prior 0.4.4 release fixes disappearing projectiles when cached sprite index-buffer bindings are reused. The GPU regression verifies the missing sprite and GL error before/after correction. Independent native IKEMEN comparisons cover 316 character scenarios and 26,889 simulation frames, including complete curated classic/720p KFM CMD entry coverage, throws/custom states, helpers, projectiles and 12 palettes. A four-frame InGuardDist retirement discrepancy under concurrent load remains documented; these results do not certify every MUGEN character.

The Android document picker still shows every file type and starts in Downloads on Android 8+. ZIP/RAR/7z content URIs, missing MIME metadata, cancellation and retry have six picker regressions, alongside four native startup/bridge tests. Physical OEM picker and phone performance verification remain pending.

Matching 7-Zip codec sources and build scripts: [source bundle](downloads/kenjatime-archive-codec-source.zip) · [checksum](downloads/kenjatime-archive-codec-source.zip.sha256). Licenses are available inside the app via Credits and source.
