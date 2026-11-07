# Kenjatime Android builds

Current installer: **[Kenjatime 0.4.2](downloads/kenjatime-android-0.4.2-debug.apk)**. Android 7.0+, WebView 107+. Bundles the current Three.js renderer and Go/WASM engine, fixed-aspect same-view matches, adaptive audio, common MUGEN archive imports and native archive saving. Includes the legacy optional AIR transform correction for the supplied Kuromaru archives.

Source: https://github.com/celerycore/kenjatime/tree/dee3a17cd5ae4100928702df8157ba38685fa090

[Checksum](downloads/kenjatime-android-0.4.2-debug.apk.sha256) · [Build verification](downloads/kenjatime-android-0.4.2-build.json)

Signed with the same certificate as earlier browser-runtime installers. Install over that app to preserve its library. The separate native prototype and the website have separate storage. Phone performance remains device-dependent; the recorded audio stability tests ran on the host browser.

Previous native 0.3.1: IKEMEN GO native ARM64 engine with Kenjatime UI, Android 14+ and OpenGL ES 3.2. Its installer and earlier versions are retained in downloads. No stock IKEMEN menus or screenpack assets are included.

Sources and reproducible build instructions: https://github.com/celerycore/kenjatime/tree/source/mugen-compatibility

APK license notices are bundled. Matching native FFmpeg source: https://github.com/ikemen-engine/Ikemen-GO/releases/download/v1.0.0/src_ffmpeg.tar.gz

0.4.2 adds a Startup report panel and JSON export that works during loading. Reports retain three launches with phase timings, device/WebView details and library counts. Eighteen host scenarios cover cold starts, database upgrades, a 200-package/20,200-file library and recovery. Reset library remains explicit; startup never silently deletes imports. Physical phone startup times and actual Android package-update survival are not measured here.
