# Kenjatime Android builds

Signed test installers. Sources and reproducible build instructions: https://github.com/celerycore/kenjatime/tree/source/mugen-compatibility

Native 0.3.1 uses the IKEMEN GO engine with Kenjatime UI, a dedicated match bootstrap and no stock menu scripts or screenpack assets. Android 14+, ARM64 and OpenGL ES 3.2.

APK license notices are bundled. Matching FFmpeg source: https://github.com/ikemen-engine/Ikemen-GO/releases/download/v1.0.0/src_ffmpeg.tar.gz

Browser-runtime 0.2.1 packages the Go/WASM backend with the same Kenjatime interface. Android 7.0+ and WebView 107+. Native gameplay is provided by the separate native installer above. Install updates over the matching existing app to retain saved imports.

These updates add a two-fighter preview, repaired stage music paths, browser audio unlock, normal common hit effects and a larger foreground Kenjatime HUD. The stock IKEMEN interface remains excluded.
