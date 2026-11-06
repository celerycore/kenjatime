# Kenjatime native Android prototype

The Infinix X6725 user reports that IKEMEN GO runs smoothly while Kenjatime in Brave remains slow on both the grid and Forest. Kenjatime now uses IKEMEN GO's native engine directly. This prototype is a separate Android app; the existing browser/Capacitor app remains available.

## Install and play

Download `kenjatime-native-0.3.0-debug.apk` from the [Android download page](https://celerycore.github.io/kenjatime/android/). It installs as **Kenjatime Native**, package `io.github.celerycore.kenjatime.nativeprototype`, alongside the previous Kenjatime app and official IKEMEN GO. It targets Android 14/API 34 or newer, ARM64, and OpenGL ES 3.2. The original installed apps and their libraries are separate.

Kenjatime’s original layout is shared with the web app. Import character or stage archives through Android’s file picker; ZIP, RAR4/5 and 7z are the primary formats. TAR and compressed TAR, CPIO and other formats supported by libarchive are also available. Detection uses contents, so an incorrect/missing extension or provider MIME does not hide a valid file. The optional password field is passed to the decoder; encryption methods and split-volume archives are not universally supported. No archive executable is run.

Imports install into the app’s private library and survive restart. Choose a fighter, opponent, palette, stage and play mode, then tap **Fight now**. Matches launch directly with Kenjatime’s HUD and touch controls. Stock menu scripts and screenpacks are removed. The default config and private JSON selection launch the match-only bootstrap, including when Android ignores argv. **Menu** returns to Kenjatime; **Pause** pauses the native thread. The setup WebView is destroyed during gameplay, and no browser combat runtime runs in it. USB/Bluetooth gamepad input remains handled by upstream SDL.

Each native archive is limited to 512 MiB compressed/expanded, 5,000 entries and 24 nested levels. Traversal, links, conflicting duplicate paths and incomplete imports are rejected without replacing the existing library. Imports can be deleted from the setup screen. Android’s picker needs no broad storage permission. The existing web app uses a 128 MiB compressed limit. Libraries remain separate between the two apps. Keep original archives when uninstalling.

## Engine and build provenance

- IKEMEN GO **v1.0.0**, engine commit `81c6da71d689625e20db79586815b695da00dd6d`.
- Official Android release ZIP SHA256: `915ee0c8ce96e860e0aab71c505e9ddd2940fe3e1c339e3f30ab4bd69880d47c`.
- Android/SDL Java wrapper commit `dbc5cfb49b1fed1d4a732ff48b439dd684d54145` from [Jesuszilla/ikemen-droid](https://github.com/Jesuszilla/ikemen-droid).
- The prototype minimum follows the highest Android API build note in the native libraries (API 34), rather than the upstream APK’s older manifest. The verifier checks this bound.
- All ten gameplay native libraries are copied **byte for byte** from the official Android release. The archive reader adds libarchive-android 1.1.6 separately. UI assets, file-based startup routing and wrapper controls are changed; the prototype does not recompile or modify the native engine, SDL or FFmpeg binaries.
- Wrapper changes select app-private storage, disable the upstream shared-folder chooser, scope USB permission broadcasts, and reject microphone capture without permission. GameActivity adds the modern Android back callback and holds the library lock. Ordinary Android gamepad input remains in SDL; raw Steam Controller Bluetooth HID is not enabled because the app requests no Bluetooth permission.

The preparer verifies pinned downloads before staging source, resources and binary dependencies. Its generated directory is ignored by Git. The source repository contains the custom launcher/library, exact preparation patches, Gradle project and tests. The APK includes upstream license notices, wrapper attribution, and source provenance, also accessible under **Credits and source → License notices**. IKEMEN GO is MIT; SDL/wrapper, screenpack, fonts and FFmpeg keep their upstream licenses. The matching FFmpeg source is linked from the download page and published beside the APK without modification.

## Build and validation

Use Python 3, JDK 21, Android SDK/build tools 36 and network access for the pinned release/source downloads:

```sh
npm ci
npm run build
python scripts/prepare-native-android.py
cd native-android
./gradlew :app:testDebugUnitTest assembleDebug lintDebug --console=plain
cd ..
python scripts/verify-native-android.py
```

Set `JAVA_HOME` and `ANDROID_HOME` for local tools. The APK is `native-android/app/build/outputs/apk/debug/app-debug.apk`. The [native Android workflow](../.github/workflows/native-android.yml) repeats preparation, tests, build, lint and packaging checks. CI signing keys can differ; published test updates must keep the existing prototype signing certificate and increment its version code.

The verifier checks the signed APK, separate package/process, ARM64 ABI, all ten official library hashes, 53 exported SDL JNI method signatures against the original APK, and every staged asset byte. Twenty-four Robolectric tests check the archive picker, native-launch intent, setup WebView disposal, catalog selection and real asset preparation, character/stage registration, update preservation, rollback, provider failures, path/size/depth/file limits, locking, interrupted-import recovery and denied audio capture. Lint has no errors; scoped exclusions cover guarded/unreachable upstream Bluetooth/audio calls and the legacy SDL Back override beneath GameActivity's modern callback.

These are **host-side package/Java checks**. They do not execute ARM64 gameplay, measure FPS, or prove native touch/controller behavior on a phone. [Recorded validation](native-android-evidence.json) states that scope. The previous web tests remain evidence for the web engine, not the native engine.

## Phone comparison

On the Infinix X6725, compare this prototype with official IKEMEN GO using the same fighters, stage, video settings and touch/controller input. Start with the included fighter and a plain stage; then test Forest and the user's actual characters during sustained attacks. Record FPS/frame pacing and check touch input, Back, interruptions, stage music and imported resource errors. The website uses a separate Go/WASM build with the same Kenjatime setup and match bootstrap. Native and browser media backends differ; compare each on the phone before drawing performance conclusions.
