# Kenjatime Android builds

Current installer: **[Kenjatime 0.4.0](downloads/kenjatime-android-0.4.0-debug.apk)**. Android 7.0+, WebView 107+. Bundles the current Three.js renderer and Go/WASM engine, fixed-aspect same-view matches, adaptive audio, common MUGEN archive imports and native archive saving. Includes the legacy optional AIR transform correction for the supplied Kuromaru archives.

Source: https://github.com/celerycore/kenjatime/tree/1130ee9f2ca31a4a1ec0565e6f41a057ea5bb2fb

[Checksum](downloads/kenjatime-android-0.4.0-debug.apk.sha256) · [Build verification](downloads/kenjatime-android-0.4.0-build.json)

Signed with the same certificate as earlier browser-runtime installers. Install over that app to preserve its library. The separate native prototype and the website have separate storage. Phone performance remains device-dependent; the recorded audio stability tests ran on the host browser.

Previous native 0.3.1: IKEMEN GO native ARM64 engine with Kenjatime UI, Android 14+ and OpenGL ES 3.2. Its installer and earlier versions are retained in downloads. No stock IKEMEN menus or screenpack assets are included.

Sources and reproducible build instructions: https://github.com/celerycore/kenjatime/tree/source/mugen-compatibility

APK license notices are bundled. Matching native FFmpeg source: https://github.com/ikemen-engine/Ikemen-GO/releases/download/v1.0.0/src_ffmpeg.tar.gz
