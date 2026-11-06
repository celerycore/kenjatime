# Kenjatime UI and archive update

Kenjatime Native 0.2.0 restores the shared Kenjatime setup layout, replaces the stock native menus with direct match launch, and uses Kenjatime HUD and touch-control styling. The ten official IKEMEN GO gameplay libraries remain unchanged. The setup WebView is destroyed during native gameplay. Browser gameplay and the existing Capacitor app retain their engine and interface; their uploader changes ship in Android 0.1.4 and on all web routes.

## Import behavior

Choose ZIP, RAR4/5 or 7z directly from Android Files/Downloads or the web uploader. File signatures identify archives regardless of extension or MIME. The picker accepts all files because Android providers can report valid RAR/ZIP files with incorrect types; decoding and MUGEN DEF discovery validate the chosen contents. Native imports install to the private library and can be selected or deleted inside the app. Browser mobile imports use the existing saved library.

ZIP keeps its fast decoder and now falls back for additional compression methods, including BZip2 (12) and LZMA (14). RAR keeps its existing RAR4/5 decoder and integrity failures. A separate worker-loaded libarchive WASM decoder handles 7z, TAR, gzip/bzip2/xz/zstd-compressed TAR and CPIO; other libarchive formats are detected when their signatures are known. Self-extracting ZIP/RAR containers are read as archive data without running executable code. The optional password field supplies a passphrase to supported decoders. Split volumes and unsupported encryption/format variants still need repackaging; this does not guarantee every archive ever produced.

Existing limits and path checks remain: web 128 MiB compressed, 512 MiB expanded and 5,000 entries; native 512 MiB compressed/expanded, 5,000 entries and 24 path levels. Windows separators, virtual leading slashes and contained dot segments normalize inside the package. Escaping paths, links and conflicting duplicate contents are rejected. Failed web imports no longer report successful installation to the saved-library flow.

## Validation

- 495 Node tests pass with the available supplied corpus, including Tomoka, Taiga, Forest, the MUGEN distribution and actual character scripts/reports. No skips in that corpus run.
- 21 native Robolectric tests cover the picker, catalog and path resolution, installation/persistence/removal, rollback, limits, locking, launch arguments, setup WebView disposal/recreation and denied audio capture. Both APKs pass Android lint with zero errors.
- Browser tests import eleven real variants (ZIP, ZIP BZip2/LZMA, 7z, TAR, TAR.gz/bz2/xz/zst, CPIO and self-extracting ZIP) without useful names/MIME on the lab, Arena, Classic Arena and mobile routes. Their fixture file hashes are also checked in Node. Traversal imports preserve the current character.
- The shared native setup UI is tested with a mock Android bridge for import selection, launch settings and portrait/landscape fit. Its strict CSP is bypassed only in this mock browser test so Playwright's polling functions work; production assets retain the policy. Robolectric separately checks the actual Android launcher and picker.
- The pinned v1.0.0 Linux engine launches an actual KFM match using the generated Kenjatime HUD and grid under Mesa/Xvfb. This caught missing team-mode HUD sections, name fields and stage facing parameters. The QA-only SDL capture hook is in `scripts/native-hud-capture.c`; Linux release SHA256 is `cc533c1a2ab84d63cbf9126d9dcb3f2dcc1a41c6206f2da419b0c91084f193e4`.
- APK verification compares all ten gameplay libraries and 53 SDL JNI signatures with the official Android release, checks the separate archive JNI library and the exact prepared assets, signatures, package IDs and versions. The native APK includes only the shared setup entry's dependency graph, with no browser combat or Capacitor runtime.

These host/browser checks do not execute the Android ARM64 archive decoder or gameplay on the Infinix X6725, and do not measure phone FPS. The native engine remains the performance path requested by the user; the web uploader update makes no new FPS claim. Build and packaging records are in [native evidence](native-android-evidence.json), [web app evidence](android-app-evidence.json) and [archive/UI evidence](archive-ui-evidence.json). Additional decoder notices and source links ship in `third-party-archives.txt`.

Native APK downloads use a verified immutable GitHub URL. The APKs stay available in repository history and are excluded from the latest Pages tree, reducing the site payload after Pages deployment timeouts. Android build and archive tests succeeded independently of the hosting failures.
