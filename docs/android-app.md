# Kenjatime Android app

The Android app packages the existing engine with Capacitor 8 and local assets. It opens the mobile arena through Android System WebView; it does not load the GitHub Pages site or depend on Brave. The CNS/CMD interpreter, combat rules, graphics presets, archives, stages, audio, touch input and Gamepad API remain shared with the browser version.

## Included

Version 0.1.2 adds the [optional PixiJS/WebGL renderer prototype](pixi-renderer.md). Select it under **Renderer** in arena setup. Canvas remains the default; use it when the prototype falls back or performs worse on your device. Version code 3 and the same app ID/signing certificate support updating the existing download in place.

- An installable Android debug APK, targeting SDK 36 and Android 7.0/API 24 or later with a sufficiently recent Android System WebView.
- Offline bundled arena, Kung Fu Man sample and RAR decoder. Imported archives stay on the device.
- ZIP/RAR selection through the Android document picker, using the existing validated worker importer and limits.
- A local archive library in IndexedDB, with metadata listed separately from archive Blobs. Opening a saved archive loads it into the current session; files are not all unpacked at launch. Library failures leave session imports working. Delete removes only the app's saved copy.
- Landscape fight mode, immersive system bars, safe-area-aware touch controls, Menu and Pause/Resume. Menu restores normal orientation behavior. Existing PS5/controller mapping remains available in setup.
- Low graphics by default on a fresh app installation: 576×324 drawing at a 30 FPS target, retaining the 60 Hz combat simulation. Users can select Balanced, High or Auto.
- Backgrounding pauses play, clears held input, suspends audio and rendering, and leaves the fight paused on return. The screen stays awake only during active fights. Android Back returns from fight mode to setup; Back in setup minimizes the app.
- Report/script exports through Android's share sheet, using app-cache files and the generated FileProvider. Ordinary browser downloads remain available in the web version.

The library survives normal app restarts and updates signed with the same key. Uninstalling the app or clearing its storage removes its saved copies; retain the original archives. Files selected from a cloud provider must first be available to Android's document picker. System WebView may reclaim a background app process; reopen saved archives from the library after a cold start. App data backup is disabled to keep the library on the device.

## Build and install

Use Node 22+, JDK 21 and Android SDK platform/build tools 36. Android Studio can install the SDK and open the generated project.

```sh
npm ci
npm run android:sync
npm run android:open
# Or build without Android Studio:
npm run android:debug
cd android && ./gradlew lintDebug
```

Set `ANDROID_HOME` and `JAVA_HOME` when the tools are outside their standard locations. `android/local.properties` can point to the SDK; it is ignored. `npm run android:debug` rebuilds the Vite assets and syncs plugins before assembling the APK. Its output is `android/app/build/outputs/apk/debug/app-debug.apk`. Version 0.1.1 (version code 2) fixes the startup URL and keeps the original app ID/signing key for an in-place update. Install that APK with Android's package installer, or `adb install -r <apk>` on an authorized test phone.

The [Android APK workflow](../.github/workflows/android.yml) also builds the source branch and uploads a `kenjatime-android-debug` artifact. Debug builds are intended for testing. Different development machines can produce different debug signing keys; keep the same signing key for updates. `npm run android:release` creates a release App Bundle; store distribution still needs a production signing configuration and release review. No store publication or signing keys are included.

After building and running lint, `python scripts/verify-android-apk.py` verifies the signature, Android launch metadata and exact bundled build assets. Set `ANDROID_HOME` to the SDK. [Recorded validation](android-app-evidence.json) includes the APK checksum and browser checks.

## Verification and performance scope

The browser UI check uses real IndexedDB and archive workers, and the supplied Tomoka RAR when configured:

```sh
npm run build
# Serve dist on port 5186 under /next/, or set MUGEN_MOBILE_URL.
MUGEN_TOMOKA_RAR=/path/to/Tomoka.rar python scripts/verify-mobile-app.py
```

It checks library persistence/reopening/deletion, session-only imports, failed imports, actual RAR import, landscape controls, touch attack damage, background suspension, released inputs, paused foreground return, exports, local-only requests and small-screen layout. It runs in Chromium with mobile emulation, not a physical Android WebView. Native compilation, Android lint and APK packaging checks complement it. Android document-provider behavior, rotation, system Back, native sharing, Bluetooth/USB controllers and sustained FPS/thermal behavior still require a real phone pass.

Packaging removes the dependency on Brave and supplies native lifecycle/file-sharing integration. It does **not** move character scripts into native code or guarantee faster combat. Keep the existing performance display available to distinguish script time, rendering time and simulation debt. Use the same characters, stage, move sequence and preset when comparing the APK with Brave.

## Next performance work

1. Profile a representative Android phone: training grid and Forest stage, idle and attack-heavy moves, then a 10-minute sustained match. Record median/p95 render time, simulation tick time, frame pacing, missed targets and memory pressure. Compare 60 Hz simulation and identical gameplay outcomes.
2. If sprite/effect drawing dominates, implement a texture-atlas GPU renderer behind the existing rendering interface. Preserve palette/remap, blend, rotation, clipping and layer semantics with pixel comparisons and the current compatibility corpus.
3. If character execution dominates, investigate compiled expression/state dispatch and worker execution with timestamped input. Preserve 60 Hz ordering, command history, pauses, custom states and simultaneous contacts before shipping it.
4. Bound decoded media and library loading under real Android memory pressure, and retest controllers, interruptions and cold starts. Choose wider device targets and release signing after those measurements.

The app is the first delivery step. Moving the combat/rendering engine to native code would be a separate, substantial compatibility project.

## Startup correction in 0.1.1

The initial package used `appStartPath: "mobile/"`. Capacitor 8 appends that string directly to its HTTPS origin, producing `https://localhostmobile/` and a DNS failure. A directory path such as `/mobile/` also enters Capacitor's extensionless fallback and can serve the root lab. The corrected configuration targets the exact bundled entry: `/mobile/index.html`.

A native-bridge regression now launches the real `MainActivity` and Capacitor bridge under Robolectric (Android API 35). It checks the resolved URL, the URL sent to WebView, the 200 response containing the mobile page, and the offline sample ZIP through Capacitor's local asset server. The old configuration fails with the same malformed host shown on the phone. Robolectric supplies platform shadows for WebView and its service-worker controller; this is not a physical Android or JavaScript-rendering test. The mobile browser checks exercise JavaScript and the existing UI flows separately.

```sh
npm run android:sync
cd android && ./gradlew :app:testDebugUnitTest assembleDebug lintDebug
```

The APK verifier also rejects relative/directory startup paths. The replacement has a higher version code and the same signing certificate as the originally published APK. Install it over the current app; uninstalling would clear the saved app library. The Android download page points to version 0.1.1, and the previous APK URL serves the corrected build as well.
