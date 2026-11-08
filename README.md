# Kenjatime Android builds

Current installer: **[Kenjatime 0.4.4](downloads/kenjatime-android-0.4.4-debug.apk)**. Android 7.0+, WebView 107+. Bundles the current Three.js renderer and Go/WASM engine, fixed-aspect same-view matches, adaptive audio, common MUGEN archive imports and native archive saving. Includes the legacy optional AIR transform correction for the supplied Kuromaru archives.

Source: https://github.com/celerycore/kenjatime/tree/db6822ec8229d505a967cd46f5540f4f350a5b27

[Checksum](downloads/kenjatime-android-0.4.4-debug.apk.sha256) · [Build verification](downloads/kenjatime-android-0.4.4-build.json)

Signed with the same certificate as earlier browser-runtime installers. Install over that app to preserve its library. The separate native prototype and the website have separate storage. Phone performance remains device-dependent; the recorded audio stability tests ran on the host browser.

Previous native 0.3.1: IKEMEN GO native ARM64 engine with Kenjatime UI, Android 14+ and OpenGL ES 3.2. Its installer and earlier versions are retained in downloads. No stock IKEMEN menus or screenpack assets are included.

Sources and reproducible build instructions: https://github.com/celerycore/kenjatime/tree/source/mugen-compatibility

APK license notices are bundled. Matching native FFmpeg source: https://github.com/ikemen-engine/Ikemen-GO/releases/download/v1.0.0/src_ffmpeg.tar.gz

0.4.4 fixes disappearing projectiles when cached sprite index-buffer bindings are reused. The GPU regression verifies the missing sprite and GL error before/after correction. Independent native IKEMEN comparisons cover 316 character scenarios and 26,889 simulation frames, including complete curated classic/720p KFM CMD entry coverage, throws/custom states, helpers, projectiles and 12 palettes. A four-frame InGuardDist retirement discrepancy under concurrent load remains documented; these results do not certify every MUGEN character.

The Android document picker still shows every file type and starts in Downloads on Android 8+. ZIP/RAR/7z content URIs, missing MIME metadata, cancellation and retry have six picker regressions, alongside four native startup/bridge tests. Physical OEM picker and phone performance verification remain pending.
