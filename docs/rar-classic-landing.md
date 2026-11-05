# RAR uploads, Classic Arena and landing defaults: Edition 19

This release adds browser RAR decoding, moves Classic Arena to the current shared runtime, and fixes the missing stock constants exposed by Shiki R's post-combo report. All **438 Node tests** pass with the supplied native examples, two real RAR5 archives, and Shiki's script/report exports; no tests are skipped in that run.

## Upload formats and checks

The previous importer explicitly accepted only ZIP signatures and rejected RAR before extraction. It now identifies ZIP, RAR4 and RAR5 by content, including phone providers with absent/mismatched MIME types and names. File-picker labels/accept values and error messages agree with the supported formats.

RAR extraction uses node-unrar-js 2.0.2 / UnRAR 6.1.7 in a disposable module worker. Its JavaScript and WASM are loaded from the same site only for RAR imports; ZIP imports do not request the decoder. Input and output buffers are transferred rather than cloned. Limits remain **128 MiB compressed, 512 MiB expanded, 5,000 entries**. Declared expanded sizes and names are checked before extraction, with actual-size checks afterward.

Both formats share safe path normalization, contained parent segments, case/Unicode matching, metadata filtering and duplicate-content checks. RAR's native filename sanitization is reconciled with its JavaScript in-memory callback names, including Windows separators. Extraction never writes archive entries to a device/server filesystem. Early validation failures close the native archive; repeated/concurrent API calls cannot corrupt the shared WASM callback target.

Password-protected and multi-volume RARs are rejected with repackaging guidance. Damaged headers/payloads and excessive sizes/counts fail visibly. Decoder [license notices](../public/licenses/README.txt) ship with the site. This application performs extraction, not RAR compression.

### Real supplied archives

| Archive | Format | Files | Expanded bytes | Definitions / references |
| --- | --- | ---: | ---: | --- |
| Tomoka.rar | RAR5 | 32 | 44,134,434 | Tomoka Minato; all referenced files resolve. |
| KOFXIII_Taiga.rar | RAR5 | 24 | 31,809,827 | Three Taiga Aisaka variants; all referenced files resolve. |

Both archives import in the lab, Web Arena and Classic Arena at a 390px mobile viewport. A **40.56 MiB** stored RAR also imports while the UI heartbeat continues. Tests cover mobile FileReader fallback, same-origin/lazy WASM requests, unsafe/encrypted archive rejection and successful retry. Existing 55.56 MiB ZIP, touch and CPU-match checks pass on Classic Arena.

These are archive/import/resource checks, not full native character certifications. Tomoka retains AIR collision-definition warnings and an unsupported StateDef option. Taiga retains AIR/trigger-numbering warnings and unsupported mixed direction/button CMD chords. Kirito_MB.rar exceeded this session's 32 MiB attachment-transfer limit and could not be inspected. The app's separate upload limit remains 128 MiB.

## Classic Arena

`/arena-classic/` is now a third Vite entry using the same importer, CNS/CMD engine, renderer and assets as `/` and `/arena/`. It keeps its Classic Arena identity at the requested URL. The old embedded standalone combat engine is replaced by the current arena controls/runtime, so controller, helper/projectile, custom-state, palette and mobile fixes reach this page too. Existing Kung Fu Man/font notices remain in place.

The built pages reference the same main module. Browser checks on Classic cover RAR4/RAR5 and both actual packs, large ZIP/RAR imports, touch/CPU modes, helper guard/push/camera/contact clocks, foreign AIR with victim palettes, and post-combo landing. Build/deploy the complete `dist/`, including decoder/worker assets; an old downloaded standalone HTML file does not contain these corrections.

## Shiki R: falling below the floor

The supplied report records `Ryougi_Shiki` at **Y=22019.6496**, downward velocity **124.15**, in foreign hit state **6050** owned by Maid Taiga. Its diagnostics show landing/recovery expressions failing on missing constants:

- `movement.air.gethit.groundlevel`
- `movement.air.gethit.groundrecover.ground.threshold`
- `movement.air.gethit.airrecover.threshold`

Shiki's legacy `[Movement]` section defines gravity/friction and relies on native stock values for newer common-state parameters. The engine's defaults omitted them. Those expressions raised errors and their transition triggers stayed false while the authored gravity controller kept running.

The runtime now supplies all related documented stock ground/air recovery thresholds, acceleration and velocity constants. Explicit character values still override defaults. Recovery velocity multipliers remain dimensionless across custom-state coordinate changes. Landing continues through the character's CNS conditions and states, preserving authored offscreen movement.

Replaying the supplied Shiki CNS/AIR and captured position/velocity/get-hit values in its own common falling state gives:

| Tick | Before correction | Corrected replay |
| --- | --- | --- |
| 1 | Falling continues; required Const triggers fail. | State 5100, Y=0, vertical velocity 0. |
| 5 | Still state 5050; Y=22645.6496 and accelerating. | Landing/bounce states execute. |
| 91 | Not replayed for this comparison. | State 0, Y=0; standing/control restored. |

No unknown-constant diagnostics remain in this replay. A separate browser fixture exercises foreign state 6050 → SelfState 5100 → idle in both the lab and Classic Arena. The exact Maid Taiga 6050 implementation/input sequence was not included in Shiki's export, so this is a verified landing defect/reduced reproduction rather than a capture of that entire combo. Shiki's full sprite ZIP also exceeded the session transfer limit; its supplied CNS/CMD/AIR export and JSON report were accessible and tested.

## Verification

`test/rar.test.js` covers independent stored RAR4/RAR5 fixtures, Unicode, path/duplicate validation, size/count preflight, corrupted/encrypted/multipart cases, Buffer view boundaries, recovery after errors, concurrency and real supplied archives. `test/landing-defaults.test.js` covers defaults/overrides, three coordinate sizes, foreign landing, captured below-floor values and Shiki's actual fall scripts. There are **27 new Node cases** beyond Edition 18. The seven existing performance scenes retain identical behavior hashes and pixels versus Edition 18, with zero routine readbacks. CPU timings vary between runs; this release makes no new physical-phone speed claim.

Browser scripts: `verify-rar-import.py`, `verify-landing-defaults.py`, `verify-custom-palettes.py`, `verify-helper-projectile-interactions.py`, `verify-mobile-import.py` and `verify-arena.py`. Compact results are in [release evidence](rar-classic-landing-evidence.json). Real uploaded assets/scripts are not bundled in the repository; their tests use optional local environment paths. Set those paths plus `MUGEN_TEST_ARCHIVE` to run the full no-skip corpus.

```sh
npm ci
npm test
npm run build
MUGEN_TOMOKA_RAR=/path/Tomoka.rar MUGEN_TAIGA_RAR=/path/KOFXIII_Taiga.rar \
  python scripts/verify-rar-import.py
python scripts/verify-landing-defaults.py
```

Native references are the supplied MUGEN 1.1 `Const` documentation and KFM `[Movement]`/`[Velocity]` defaults. Native executable comparison, complete per-character moves, remaining controller/CMD/AIR/version quirks and physical-phone performance remain unverified. Reports continue to say `completeCompatibility: false`.
