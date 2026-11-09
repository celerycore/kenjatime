# Kenjatime Core

Independent engine rewrite for imported fighting-game characters and stages. This branch builds the original Kenjatime combat runtime, a numeric WebAssembly compiler, and a direct Three.js GPU renderer. The browser and Android preview share the same UI and offline assets.

**This is a compatibility preview. Full moveset and stage compatibility is unfinished.** All 16 recorded interaction scenarios and 147 recorded KFM moveset scenarios pass the strict comparison. Broader character and stage verification remains unfinished. See [implementation and evidence](docs/core-rewrite.md).

```sh
npm ci
npm run dev
npm run build
npm run compatibility
npm test
```

The 0.5.7 preview fixes repeated incoming-damage reads that could kill Rare Akuma after a single hit. It adds bounded Lua match hooks/modules, browser-decoded video backgrounds, glTF stages with animation and model shadows, legacy-stage cropping, and additional camera controls. [Measured results and limits](docs/core-stage-health-0.5.7-evidence.json) distinguish implemented features from full parity. Focus loss still leaves simulation running when the browser/OS permits it. Complete Lua API/dialect support, newer ZSS/global-state extensions and advanced moving-camera parity remain unfinished.

The standalone output is `dist-core/`. Open `/core/index.html` with the development server. Worker graphics are preferred; unsupported worker graphics fall back to the main thread before character data is transferred. Fights stay in the current page.

ZIP, RAR4/5, 7z, TAR and compressed TAR imports use content detection. Tested encryption variants and multipart sets are supported; select every volume together. Original downloads are preserved, including multipart bundles that can be imported again. The preview uses a separate library and selection key, and resetting it leaves the recovery library intact.

```sh
npm run verify:core:interactions   # strict captured interaction comparison
npm run verify:core:movesets      # strict gate for 147 captured scenarios
npm run diagnose:core:movesets    # reports all 147, including known differences
npm run verify:core:browser       # built UI, input, audio and GPU lifecycle
npm run verify:core:archives      # real picker/worker/store/download checks
npm run verify:core:stages        # production GPU vs authored native stage captures
npm run verify:core:media         # Lua/video/models/shadows and native resolution captures; ffmpeg required
npm run android:core:debug        # requires Android SDK 36 and JDK 21
npm run benchmark:core:combat     # authored CPU simulation loads; not phone FPS
```

The Android package is `io.github.celerycore.kenjatime.core.preview`, labeled **Kenjatime Core Preview**, so the recovery app can remain installed. Its local entry is `https://localhost/core/index.html`; it does not require a remote game server. Physical phone performance has not been measured.

The engine implementation is independently authored. Graphics, archive, music and platform libraries retain their own authorship and license notices; these are collected in `dist-core/NOTICES.txt`. Imported characters and stages retain their authors' rights. [Source boundaries](core/ORIGIN.md) distinguish the runtime from retained recovery and verification material.

Recovery tags preserve the previous source, website and Android artifacts: `recovery/pre-original-engine-0.4.5`, `recovery/pre-original-engine-web-0.4.5`, and `recovery/pre-original-engine-android-0.4.5`. [Historical build information](docs/recovery-build-0.4.5.md) applies to those tags.
