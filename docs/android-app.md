# Kenjatime browser-runtime Android app

Version 0.2.0 (version code 6) packages the same Kenjatime interface and Go/WASM engine as the website in Capacitor 8. It starts at `https://localhost/mobile/index.html`, uses bundled assets, WebGL2 and Web Audio, and does not depend on Brave or the hosted site. Stock IKEMEN menus, screenpacks and logos are excluded. The separate [native app](native-android.md) runs the ARM64 engine directly and is the preferred build for native gameplay.

## Included

- Android 7.0/API 24+, Android System WebView 107+, SDK 36 target.
- Offline sample Kung Fu Man and engine core; ZIP/RAR/7z and compressed TAR installs through the validated archive worker.
- Private IndexedDB package library, selectable fighters, palettes and stages. Previously saved web archives migrate on Open without removing the originals.
- The shared Kenjatime setup, HUD, touch controls, Menu and Pause. Landscape/immersive fight mode, background suspension and return to setup on Android Back.
- Browser-standard gamepad input. Physical Bluetooth/USB controller behavior needs device testing.

The 0.2.0 installer retains the existing app ID and signing certificate. Install over the previous browser-runtime app to preserve its library. Uninstalling or clearing storage removes saved copies.

## Build and verify

Use Node 22+, JDK 21 and Android SDK platform/build tools 36.

```sh
npm ci
npm run android:sync
cd android && ./gradlew :app:testDebugUnitTest assembleDebug lintDebug
cd ..
python scripts/verify-android-apk.py
python scripts/verify-go-engine.py
```

The APK is `android/app/build/outputs/apk/debug/app-debug.apk`. The verifier checks its signature, launch metadata and exact bundled build assets, including the compressed WASM payload and engine core. The browser suite executes Go matches, touch attacks, pause, archive imports and library migration; see [integration details](go-engine-integration.md) and [packaging evidence](android-app-evidence.json).

Native bridge tests verify the local startup URL and asset server under Robolectric. Host browser tests use Chromium/SwiftShader; they do not measure Android phone FPS or execute physical device controllers. Browser video-background support and some music decoders remain port limitations.

## Startup correction in 0.1.1

The initial package used `appStartPath: "mobile/"`. Capacitor 8 appends that string directly to its HTTPS origin, producing `https://localhostmobile/` and a DNS failure. A directory path such as `/mobile/` also enters Capacitor's extensionless fallback and can serve the root lab. The corrected configuration targets the exact bundled entry: `/mobile/index.html`.

A native-bridge regression now launches the real `MainActivity` and Capacitor bridge under Robolectric (Android API 35). It checks the resolved URL, the URL sent to WebView, the 200 response containing the mobile page, and the offline sample ZIP through Capacitor's local asset server. The old configuration fails with the same malformed host shown on the phone. Robolectric supplies platform shadows for WebView and its service-worker controller; this is not a physical Android or JavaScript-rendering test. The mobile browser checks exercise JavaScript and the existing UI flows separately.

```sh
npm run android:sync
cd android && ./gradlew :app:testDebugUnitTest assembleDebug lintDebug
```

The APK verifier also rejects relative/directory startup paths. The replacement has a higher version code and the same signing certificate as the originally published APK. Install it over the current app; uninstalling would clear the saved app library. The download page now points to version 0.2.0.
