# Kenjatime browser-runtime Android app

Version 0.4.5 (version code 13) packages the current Three.js renderer and
Go/WASM combat engine in Capacitor 8. It starts at
`https://localhost/mobile/index.html` from bundled assets and works offline.
It retains Kenjatime’s UI, fixed-aspect match view, touch controls, lifebars,
palettes and controller bridge. Stock IKEMEN menus and screenpacks are excluded.

Version 0.4.5 adds multipart imports, ZIP AES variants and encrypted 7z/RAR,
streamed MOD/XM/IT/S3M music, MP4/WebM backgrounds and model shadows. It also
fixes the integer-backed vertex attributes that could hide 3D stage models.
See [archive/media support, limits and verification](media-archive-support.md).
The [character verification suite](character-verification.md) retains its
independent native captures and unresolved loaded projectile guard-distance issue.

## Included

Open **Startup report → Save startup report**, under Saved on this device,
to export phase timings and device details, including while startup is waiting.
See [startup diagnostics and test coverage](startup-diagnostics.md).
If necessary, use **Reset library**, which remains available during loading. See
[library recovery](library-recovery.md) for what the reset removes and preserves.

- Android 7.0/API 24+, Android System WebView 107+, SDK 36 target.
- Offline sample and engine core; decoder code and WASM are bundled too.
- ZIP (including BZIP2/LZMA methods), RAR4/RAR5, 7z, TAR, gzip/bzip2/xz/zstd
  compressed TAR and common TGZ/TBZ2/TXZ/TZST aliases. CPIO and ZIP
  self-extracting containers are also tested as data.
- Content detection accepts downloaded files without reliable names or MIME.
- Android imports use the Storage Access Framework document picker, with all
  file types visible and Downloads as the initial location on Android 8+.
  This replaces WebView's generic content chooser, which can show only media
  providers on OEM phones. ZIP, RAR, 7z and other archive types remain selectable
  even when their provider supplies a missing or incorrect MIME type. No media
  or broad storage permission is required. The selected content URI goes
  directly back to WebView; the existing archive size/content checks still apply.
- New imports save the original archive separately from catalog metadata.
  **Save archive** downloads it on the web or opens Android’s document save picker.
  The picker accepts every supported archive extension and streams the file to
  the folder chosen by the user. A share-sheet fallback remains for other hosts.
  Export bridges use at most 256 KiB per chunk, rather than base64-encoding
  an entire large RAR/7z at once.
- Existing installed packages migrate from library schema 1 to 2 without
  deleting characters, stages or extracted files. An old package needs its
  archive imported again before Save archive is available.
- Audio uses the device’s native AudioContext rate and adaptive, bounded PCM
  headroom. The audio worklet continues during short rendering stalls. See
  [audio measurements](mobile-audio.md).
- Matches remain in the same view. The app keeps the screen awake during play,
  pauses on background, and returns to setup with Android Back. Orientation
  and fullscreen are not forced.

The installer retains the browser-runtime app ID and signing certificate.
Install it over that existing app to keep its library. The separate ARM64 native
prototype and the website have their own storage. Uninstalling or clearing
storage removes copies inside the affected app.

Archive imports retain the existing 128 MB compressed, 512 MB expanded and
5,000-entry limits. Select every multipart volume together. Save archive bundles the exact originals for download and re-import. The password field
supports encrypted formats supported by the decoders; password-protected ZIP
and original encrypted-byte export are tested. This does not certify every
compression/encryption variant.
## Build and verify

Use Node 22+, JDK 21 and Android SDK platform/build tools 36.

```sh
npm ci
npm run android:sync
cd android && ./gradlew :app:testDebugUnitTest assembleDebug lintDebug
cd ..
python scripts/verify-android-apk.py
python scripts/verify-go-engine.py
python scripts/verify-startup-diagnostics.py
```

The APK is `android/app/build/outputs/apk/debug/app-debug.apk`. The verifier checks its signature, launch metadata and exact bundled build assets, including the compressed WASM payload and engine core. The browser suite executes Go matches, touch attacks, pause, archive imports and library migration; see [integration details](go-engine-integration.md) and [packaging evidence](android-app-evidence.json).

Native bridge tests verify the local startup URL, asset server and actual document-picker intent/callbacks under Robolectric. Picker checks include ZIP/RAR/7z and extensionless content URIs with no MIME metadata, cancellation/retry, missing result data, multiple results, competing requests and activity destruction. Host browser tests use Chromium/SwiftShader; they do not measure Android phone FPS or execute physical device controllers. The OEM picker appearance still requires physical phone verification. Media codecs depend on WebView support; MP4/WebM and MOD/XM/IT/S3M have host browser coverage. See the support report for limits.

See [document-picker evidence](android-picker-evidence.json) for the Android intent and regression cases.

## Startup correction in 0.1.1

The initial package used `appStartPath: "mobile/"`. Capacitor 8 appends that string directly to its HTTPS origin, producing `https://localhostmobile/` and a DNS failure. A directory path such as `/mobile/` also enters Capacitor's extensionless fallback and can serve the root lab. The corrected configuration targets the exact bundled entry: `/mobile/index.html`.

A native-bridge regression now launches the real `MainActivity` and Capacitor bridge under Robolectric (Android API 35). It checks the resolved URL, the URL sent to WebView, the 200 response containing the mobile page, and the offline sample ZIP through Capacitor's local asset server. The old configuration fails with the same malformed host shown on the phone. Robolectric supplies platform shadows for WebView and its service-worker controller; this is not a physical Android or JavaScript-rendering test. The mobile browser checks exercise JavaScript and the existing UI flows separately.

```sh
npm run android:sync
cd android && ./gradlew :app:testDebugUnitTest assembleDebug lintDebug
```

The APK verifier also rejects relative/directory startup paths. The replacement has a higher version code and the same signing certificate as the originally published APK. Install it over the current app; uninstalling would clear the saved app library. The download page now points to the current version.
