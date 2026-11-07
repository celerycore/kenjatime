# Kenjatime

Import MUGEN fighters and stages, choose your match, and play through Kenjatime’s interface.

The website now executes **IKEMEN GO 1.0.0 compiled from Go to WebAssembly**, with WebGL2 and Web Audio. Android **Kenjatime Native 0.3.1** executes the native ARM64 engine. Both use the same setup component, Kenjatime HUD and match-only Lua bootstrap. Stock title/select/options menus, screenpacks, startup logos and menu scripts are excluded. The previous JavaScript combat interpreter is retained in source and historical tests, and is not loaded by these application entries.

- [Play](https://celerycore.github.io/kenjatime/arena-classic/) · [Android download](https://celerycore.github.io/kenjatime/android/)
- [Browser GPU rewrite and measured results](docs/go-webgl-renderer.md)
- [Go engine integration and checks](docs/go-engine-integration.md)
- [Native Android build](docs/native-android.md)
- [Earlier JavaScript engine work](docs/javascript-engine-history.md)

## Run locally

```sh
npm ci
npm run dev
```

ZIP, RAR4/5, 7z and common compressed TAR archives are identified from contents. Imported packages stay in the device’s private library. Older saved web archives remain available under **Saved on this device**; Open installs their contents into the Go engine library. Split volumes and unsupported encryption still require repackaging. Web imports allow 128 MiB compressed / 512 MiB expanded; native imports allow 512 MiB compressed / expanded. Both cap imports at 5,000 entries and reject escaping paths, links and conflicting duplicates.

The browser mounts all selected resources before starting a match. Gameplay does not make synchronous network file requests. The Go engine and shared resources are downloaded when needed. Native gameplay uses a separate SDL activity and destroys the setup WebView. Browser gamepads use the browser API; native gamepads use SDL.

## Build and check

```sh
npm run build
npm test
python scripts/prepare-native-android.py
python scripts/build-go-engine.py
npm run android:sync
```

`build-go-engine.py` pins the browser-port source, Go toolchain and supplemental dependency source, records checksums, and builds the shipped WASM without copying another project’s UI. A dedicated CI job rebuilds and compares the compressed binary. The native verifier checks all ten engine libraries and 53 SDL JNI signatures against the official release.

The original Android entrypoint ignores command-line arguments. Kenjatime writes its own default startup configuration and a validated private JSON match selection; the shared bootstrap reads that file. It never needs the stock main menu to launch a match.

Host verification includes repository tests, native startup/import tests, real Go/WASM matches with touch damage and pause, archive imports on all four routes, old-library migration, and supplied Tomoka/Forest resources. Physical phone FPS is not measured here. The browser port currently omits video-background decoding and some native music decoders; the platform backends have different media capabilities. Passing tests do not certify every authored character or stage.
