# Kenjatime Kotlin/WASM

`main` is the Kotlin/WASM core engine rewrite. Kotlin owns the deterministic
60 Hz simulation, character states, collision geometry, commands, animation
clocks and render planning. JavaScript handles browser UI, archives, image
decoding and Canvas painting. Browser and Android use the same compiled Wasm.

Compatibility is incomplete. The passing Kotlin tests and bundled KFM replay
do not certify native MUGEN/IKEMEN parity or physical-phone performance. See
[migration progress and limits](kotlin-core/MIGRATION_STATUS.md) and the
[compatibility contract](kotlin-core/compatibility.json).

Use Node.js 24 and a JDK 21 installation (`JAVA_HOME` must point to the JDK).
The checked-in Gradle wrapper downloads the Kotlin toolchain on first use.

```sh
npm ci
npm test                         # JVM + Wasm tests, adapter checks, ABI and KFM replay
npm run build                    # compile Kotlin/Wasm and package dist-kotlin/
npm run dev                      # Kotlin UI at /kotlin/index.html
```

Build Wasm before starting the development server. Rebuild it after changing
Kotlin source; the Vite development server serves the compiled engine from
`dist-kotlin/wasm`. The packaged site's root redirects to `/kotlin/index.html`.

To verify the built UI, install Python Playwright and Chromium, then run:

```sh
python -m pip install 'playwright>=1.57,<2'
python -m playwright install --with-deps chromium
npm run test:kotlin:browser
```

This generates public KFM import fixtures and checks real sprite/effect
painting, mixed localcoord scaling, RAR companion imports, CSV export and a
360px Android layout. It does not measure physical-device performance.

```sh
npm run android:debug            # build Kotlin browser assets and a debug APK
npm run android:sync             # build and copy Kotlin assets for Android Studio
npm run android:open
```

Android builds also require SDK 36 and Build Tools 36.0.0. The package is
`io.github.celerycore.kenjatime.kotlin`, labeled **Kenjatime Kotlin**, with an
offline WebView entry at `https://localhost/kotlin/index.html`. It can coexist
with older Kenjatime installations. CI checks the APK contains the exact Wasm
and browser assets tested in the browser job.

The **Kotlin/WASM Main** workflow runs on pushes and pull requests to `main`.
It produces browser, test-result and APK artifacts. It does not deploy the
website. GitHub Pages remains on `gh-pages`; promoting the source branch does
not replace that published site.

Earlier JavaScript and recovery code remains available for reference through
explicit commands such as `build:core`, `test:core`, `test:core:compiled`,
`dev:core`, `build:reference` and `dev:reference`. Native capture comparisons
under `verify:core:*` concern that earlier engine, not Kotlin parity. Historical
details are in [the original rewrite notes](docs/core-rewrite.md),
[source boundaries](core/ORIGIN.md), and
[recovery build information](docs/recovery-build-0.4.5.md).

Imported characters and stages retain their authors' rights. Original Nu-13,
Tomoka, Dark Donald and Rare Akuma archives are not included. Graphics,
archive, music and platform libraries retain their own authorship and license
notices.
