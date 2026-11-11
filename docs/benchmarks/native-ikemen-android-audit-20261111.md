# Native IKEMEN GO and Android compatibility audit — 2026-11-11

## Evidence boundary

The user-provided originals were locally loaded into **official unmodified IKEMEN GO v1.0.0** (the pinned Linux ZIP was checked against its release SHA256SUMS). Native AI matches ran in Xvfb with software Mesa OpenGL 4.5, with `-speedtest -time 15 -rounds 1 -p1.ai 8 -p2.ai 8 -nojoy -nosound`. No original user archive was committed or uploaded to GitHub.

**Native match observations** (actual completed native logs; not deterministic frame-by-frame oracle captures):

| Native matchup | Result | Last life P1/P2 |
|---|---|---:|
| Rare Akuma 2026 vs KFM | Completed, exit 0, P1 win | 2000 / 155 |
| Rare Akuma 2007 vs KFM | Completed, exit 0, P1 win | 2000 / 0 |
| Dark Donald vs KFM | Completed, exit 0, P1 win | 1111 / 0 |
| Rare Akuma 2026 vs Rare Akuma 2007 | Completed, exit 0, P2 win | 683 / 2000 |
| Rare Akuma 2007 vs Dark Donald | Completed, exit 0, P2 win | 0 / 1111 |
| Dark Donald vs Rare Akuma 2026 | **Timed out** twice (22s / 20s) with software rendering | No completed log |

All five successful native processes produced real match logs; the sixth must not be represented as a pass. AI/random seeds and engine timing rules differed between the native trials and Kenjatime tests. **This does not demonstrate bit-exact native parity.**

### Direct native findings for Dark Donald

- IKEMEN GO itself prints **unknown Statedef ownpal** on several Donald states. It is an authored unsupported parameter, not evidence of a Kenjatime missing controller. Kenjatime retains the diagnostic and **does not apply a fabricated ownpal state entry**.
- IKEMEN GO also prints **unknown HitDef gurad.pausetime**. This typo is ignored by native. Kenjatime no longer silently replaces it with `guard.pausetime` (which would alter hitpause).
- The original Dark Donald text contains concatenated two-character HitBy/NotHitBy masks such as `SCA,NASAHANPSPHPNTSTHT`; Kenjatime now supports those tokens. Safe oversized positive integer `persistent` literals are accepted with a nonportable diagnostic; their precise 32-bit native overflow behavior remains unproven.
- The original Donald HitDef missing required `attr` stays diagnosed as authored invalid data. No invented attack attribute is supplied.
- Native IKEMEN warns about original Donald missing sprites (e.g. `9999,0`, `2,0`) and numerous unsupported/deprecated authored parameters. These must not be counted as newly introduced Kenjatime defects.

### Actual Android emulator run

GitHub Actions: https://github.com/celerycore/kenjatime/actions/runs/43016414220

- Built Core Preview APK and AndroidTest APK; package/offline asset audit passed.
- Android API 35 emulator (Pixel 5 x86_64, software GPU): 1 instrumented `CoreWebViewSmokeTest.bundledCoreLoadsAndKfmCombatAdvances`, **1 passed, 0 failed**, successfully advanced KFM gameplay inside the packaged WebView.
- APK SHA-256: `3752a10b15e787c7c54c72a620c4a0bb5afea4e3f389f548cb39d9d30d54b15f`.
- **No physical Android device was connected.** Emulator success is not physical-device CPU/GPU/FPS, thermal, battery, audio or multi-touch certification. The emulator test used KFM, not the original three archives.
- A real-phone capture harness was added at `scripts/core/android-physical-qa.py` for use with an explicitly connected real device and installed Core Preview APK. It rejects emulator targets.

### Core tests and release decision

- Regression CI for the compatibility branch: https://github.com/celerycore/kenjatime/actions/runs/43017713301 — **success**.
- Earlier user-archive headless JavaScript/Kotlin/Wasm differential tests remain valid for their exact source revision, but the new native observations **do not** establish precise per-frame equivalence.
- **Keep Kotlin/Wasm disabled by default** and PR #14 in draft until identical-input native oracle captures, missing effect/sprite review, actual physical Android hardware profiling, and the sixth native duel have been resolved.

## Native vs Kenjatime comparison methodology

For strict parity, both engines need identical characters, stages, round/intro rules, deterministic PRNG seed or controlled random transcript, input replay, hitpause and frame clock. Capture each tick's actor and projectile IDs, states, positions, velocities, life/power, hit events and controller phase order from the native engine, then compare against an identically driven Kenjatime trace. Comparing terminal AI match outcomes without controlling those variables would give false fidelity claims.
