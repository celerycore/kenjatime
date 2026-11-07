# Kenjatime Android builds

Current installer: **[Kenjatime 0.4.3](downloads/kenjatime-android-0.4.3-debug.apk)**. Android 7.0+, WebView 107+. Bundles the current Three.js renderer and Go/WASM engine, fixed-aspect same-view matches, adaptive audio, common MUGEN archive imports and native archive saving. Includes the legacy optional AIR transform correction for the supplied Kuromaru archives.

Source: https://github.com/celerycore/kenjatime/tree/a4b03b165a1a9f54fe4fb085d2d5f3c8ff21d021

[Checksum](downloads/kenjatime-android-0.4.3-debug.apk.sha256) · [Build verification](downloads/kenjatime-android-0.4.3-build.json)

Signed with the same certificate as earlier browser-runtime installers. Install over that app to preserve its library. The separate native prototype and the website have separate storage. Phone performance remains device-dependent; the recorded audio stability tests ran on the host browser.

Previous native 0.3.1: IKEMEN GO native ARM64 engine with Kenjatime UI, Android 14+ and OpenGL ES 3.2. Its installer and earlier versions are retained in downloads. No stock IKEMEN menus or screenpack assets are included.

Sources and reproducible build instructions: https://github.com/celerycore/kenjatime/tree/source/mugen-compatibility

APK license notices are bundled. Matching native FFmpeg source: https://github.com/ikemen-engine/Ikemen-GO/releases/download/v1.0.0/src_ffmpeg.tar.gz

0.4.3 routes archive imports to the Android document picker, with all file types visible and Downloads as the initial location on Android 8+. It avoids OEM media-only content choosers. ZIP/RAR/7z and extensionless content URIs are tested without MIME metadata, along with cancellation and retry. Six picker regressions and four existing native bridge tests pass under Robolectric; physical OEM picker verification remains pending. Startup diagnostics and explicit library recovery remain available.
