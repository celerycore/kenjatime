# Archive and stage-media support in 0.4.5

Web and the browser-runtime Android APK use the same importer, Go/WASM engine,
Three.js submission backend and audio implementation. Kenjatime retains its own
setup and fight UI. This update does not add IKEMEN menus or screenpacks.

## Installing and saving archives

Select all volumes of **one** archive together in Files/Downloads, or drop them
on the uploader. Supported volume naming includes `.part1.rar`, `.rar/.r00`,
`.7z.001`, `.zip.001` and spanned `.zip/.z01` sets. Selection order does not
matter; missing, duplicate and unrelated parts are rejected before installation.
The Android picker already returns multiple document URIs with unrestricted
file types. Ordinary single ZIP/RAR/7z/TAR imports still work.

ZIP ZipCrypto and WinZip AES-128/192/256, 7z AES with encrypted headers, and
RAR4/RAR5 AES including encrypted headers and solid archives are covered.
UTF-8 ZIP passwords are checked against an independently generated Pyzipper
fixture. Enter the archive's password before browsing; it is not saved.
Different passwords for different entries cannot be entered in one import.
Corrupt data, unsupported methods and incomplete volumes fail without replacing
installed characters. This is coverage of tested variants, not every archive
format ever produced.

Single-file **Save archive** retains exact original bytes. Multipart saves produce
a ZIP containing the exact original volumes and a small Kenjatime manifest.
Importing that bundle reconstructs the volume set; external tools can also unzip
it and open the first original volume. Construction runs in a disposable worker.
Imports retain the total 128 MiB compressed / 512 MiB expanded / 5,000-entry
limits, with at most 512 selected volumes. A bundle adds ZIP overhead: sets very
close to the compressed limit may need to be unzipped and their original parts
selected together for re-import. Split archives are not a way around these limits.

Full 7-Zip loads only when needed and runs in a disposable worker. Paths,
canonical duplicates, links, declared sizes and actual extracted sizes are
checked before installation. Existing library schema 2 records remain usable;
no library purge or destructive migration is part of this update.

## Module music and video backgrounds

MOD, XM, IT and S3M use libopenmpt, decoding at most 2,048 stereo frames into a
16 KiB PCM block at a time. Songs are not decoded into whole-song PCM buffers.
Output feeds the existing Go mixer and bounded AudioWorklet queue at the device
sample rate. Seek, loop restart, track replacement and session disposal release
native decoder handles. This adds formats; it does not promise to fix all phone
underruns or provide physical Infinix audio measurements.

Video backgrounds use the browser's native media decoder, with MP4 and WebM
fixtures tested for both pixels and audio. The stage's `type=video`, `path`,
`scalemode`, `loop` and `volume` settings are honored. Video is decoded on the
owning page and transfers at most one ImageBitmap per layer to the worker until
the engine acknowledges its GPU upload. There are at most 16 simultaneous video
layers. Pause, app backgrounding, visibility changes, reset, end and teardown
control the media elements; audio shares the existing AudioContext and mute
controls. If the browser blocks autoplay, tap the arena/Enable sound to resume.

Codec availability depends on Android System WebView/browser support. This is
not a bundled FFmpeg decoder: AVI and arbitrary codecs are not certified.
Browser scaling also does not reproduce every native FFmpeg interpolation kernel.

## Model rendering and shadows

WebGL2 model rendering now preserves float conversion for integer-backed vertex
attributes; previously Three.js could submit them with the wrong pointer type,
leaving glTF models invisible. Directional, point and spot shadows use the engine's
light transforms, skinning/morph data, material alpha masking and cast-shadow
flags. WebGL2 depth atlas passes replace the unavailable geometry-shader path.
No shadow atlas is allocated for ordinary 2D stages.

Atlas tiles are 512 pixels when starting with Visuals: Sharp, 256 on Auto,
and 128 with the low runtime setting, capped by GPU limits. Atlas size is chosen
when the stage first renders; a new match applies a changed starting preset.
Four lights and six faces per point light fit in one atlas. Approximate depth
storage is 24/6/1.5 MiB respectively; rendering a point light still requires six
passes and is more expensive than a directional light. This is an optional glTF
stage extension, not a claim that classic MUGEN has 3D model stages.

## Measured bounds and packaging

The decoder bridge uses a fixed 16,384-byte PCM block rather than allocating
whole-song output. Video has one acknowledged bitmap per layer in flight.
Ordinary 2D fights report zero shadow allocation and zero shadow draws.
The clean 0.4.5 APK is 13,695,411 bytes, with all 58 current Web build files
matched byte for byte and no stale Web assets. An incremental packaging artifact
had grown to 19,257,271 bytes despite identical contents; a clean build removes
5,561,860 bytes of unused container space (28.9%). This is a download-size
measurement, not a phone FPS or audio-underrun improvement claim.

## Reproducing checks

```sh
npm ci
npm test
npm run build
python scripts/verify-support-archives.py
python scripts/verify-media-support.py
python scripts/verify-media-support.py --group shadow --quality low
python scripts/verify-media-support.py --group all --main-thread
python scripts/verify-go-gpu.py
npm run verify:characters -- --profile full --browser-only
npm run android:sync
cd android && ./gradlew :app:testDebugUnitTest assembleDebug lintDebug
cd ..
python scripts/verify-android-apk.py
```

The archive suite exercises actual picker/worker/IndexedDB/download/re-import
flows on the root, arena, arena-classic and mobile routes. Pinned libarchive RAR
fixtures have source URLs and hashes under `test/fixtures/support-rar/`.
Authored tracker, video and model fixture generation is under `scripts/generate-*`.
Browser checks use host Chromium/SwiftShader. They do not measure phone FPS,
exercise an OEM Files app, or certify complete character compatibility.
The independent native character comparisons and their unresolved loaded
projectile-retirement guard-distance difference remain documented in
[character verification](character-verification.md).

Runtime licenses ship in `engine/NOTICES.txt`. The exact 7-Zip upstream and WASM
wrapper sources are distributed separately as
[the matching codec source bundle](https://github.com/celerycore/kenjatime/raw/refs/heads/android-builds/downloads/kenjatime-archive-codec-source.zip).
`python scripts/package-archive-codec-source.py` reproduces that bundle from
pinned, checksum-verified sources. It is intentionally not added to app assets.
