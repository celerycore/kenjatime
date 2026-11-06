# Kenjatime native Android prototype

The Infinix X6725 user reports that IKEMEN GO runs smoothly while Kenjatime in Brave remains slow on both the grid and Forest. The next comparison uses IKEMEN GO's native engine directly. This prototype is a separate Android app; the existing browser/Capacitor app remains available.

## Install and play

Download `kenjatime-native-0.1.0-debug.apk` from the [Android download page](https://celerycore.github.io/kenjatime/android/). It installs as **Kenjatime Native**, package `io.github.celerycore.kenjatime.nativeprototype`, alongside the previous Kenjatime app and official IKEMEN GO. It targets Android 14/API 34 or newer, ARM64, and OpenGL ES 3.2. The original installed apps and their libraries are separate.

Tap **Start native game**. The first launch copies the included engine assets into the app's private game directory. The IKEMEN GO menu, fighters, stages, touch controls and matches run through SDL and the native ARM64 engine library. There is no WebView battle view. Use the engine menu for training and matches; Back exits the game process and returns to the launcher.

For this first prototype, extract a character or stage ZIP/RAR using a file manager, then choose **Import extracted character / stage folder**. Select a complete folder containing its DEF and associated resources. The importer preserves its directory structure and registers character/stage DEFs with the native roster. Stock fighters/stages remain available. Normal IKEMEN GO resource/path requirements still apply; imported content has not been certified against every MUGEN version or author-specific quirk. Native ZIP/RAR picking and migration from the old web library are not implemented yet.

Importing streams files through Android's document picker into a private staging directory; it requests no broad storage permission. It limits each import to 512 MiB, 10,000 entries and 24 nested levels. Traversal names, case-colliding names, provider failures and failed registrations leave the prior library intact. Interrupted staging is cleared at the next preparation. An OS file lock prevents library changes while the engine is running. Definitions whose registered path contains commas/semicolons need selecting their own folder rather than the surrounding collection because of the upstream roster syntax. Uninstalling this prototype clears its private library; keep the original archives.

## Engine and build provenance

- IKEMEN GO **v1.0.0**, engine commit `81c6da71d689625e20db79586815b695da00dd6d`.
- Official Android release ZIP SHA256: `915ee0c8ce96e860e0aab71c505e9ddd2940fe3e1c339e3f30ab4bd69880d47c`.
- Android/SDL Java wrapper commit `dbc5cfb49b1fed1d4a732ff48b439dd684d54145` from [Jesuszilla/ikemen-droid](https://github.com/Jesuszilla/ikemen-droid).
- The prototype minimum follows the highest Android API build note in the native libraries (API 34), rather than the upstream APK’s older manifest. The verifier checks this bound.
- All ten native libraries are copied **byte for byte** from the official Android release. The prototype does not recompile or modify the native engine, SDL or FFmpeg binaries.
- Wrapper changes select app-private storage, disable the upstream shared-folder chooser, scope USB permission broadcasts, and reject microphone capture without permission. GameActivity adds the modern Android back callback and holds the library lock. Ordinary Android gamepad input remains in SDL; raw Steam Controller Bluetooth HID is not enabled because the app requests no Bluetooth permission.

The preparer verifies pinned downloads before staging source, resources and binary dependencies. Its generated directory is ignored by Git. The source repository contains the custom launcher/library, exact preparation patches, Gradle project and tests. The APK includes upstream license notices, wrapper attribution, and source provenance, also accessible under **Engine credits and source**. IKEMEN GO is MIT; SDL/wrapper, screenpack, fonts and FFmpeg keep their upstream licenses. The matching FFmpeg source is linked from the download page and published beside the APK without modification.

## Build and validation

Use Python 3, JDK 21, Android SDK/build tools 36 and network access for the pinned release/source downloads:

```sh
python scripts/prepare-native-android.py
cd native-android
./gradlew :app:testDebugUnitTest assembleDebug lintDebug --console=plain
cd ..
python scripts/verify-native-android.py
```

Set `JAVA_HOME` and `ANDROID_HOME` for local tools. The APK is `native-android/app/build/outputs/apk/debug/app-debug.apk`. The [native Android workflow](../.github/workflows/native-android.yml) repeats preparation, tests, build, lint and packaging checks. CI signing keys can differ; published test updates must keep the existing prototype signing certificate and increment its version code.

The verifier checks the signed APK, separate package/process, ARM64 ABI, all ten official library hashes, 53 exported SDL JNI method signatures against the original APK, and every staged asset byte. Fourteen Robolectric tests check native-launch intent and real asset preparation, character/stage registration, update preservation, rollback, provider failures, path/size/depth/file limits, locking, interrupted-import recovery and denied audio capture. Lint has no errors; scoped exclusions cover guarded/unreachable upstream Bluetooth/audio calls and the legacy SDL Back override beneath GameActivity's modern callback.

These are **host-side package/Java checks**. They do not execute ARM64 gameplay, measure FPS, or prove native touch/controller behavior on a phone. [Recorded validation](native-android-evidence.json) states that scope. The previous web tests remain evidence for the web engine, not the native engine.

## Phone comparison

On the Infinix X6725, compare this prototype with official IKEMEN GO using the same fighters, stage, video settings and touch/controller input. Start with the included fighter and a plain stage; then test Forest and the user's actual characters during sustained attacks. Record FPS/frame pacing and check touch input, Back, interruptions, stage music and imported resource errors. Only after that comparison should this prototype replace the existing app's primary gameplay path. Browser-native execution would require a different solution; installing this APK does not change Brave's JavaScript engine.
