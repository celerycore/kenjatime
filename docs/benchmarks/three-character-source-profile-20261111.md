# Rare Akuma ×2 / Dark Donald — 2026-11-11 asset/source benchmark

Benchmarked the original uploaded archives read-only with a common libarchive streaming decoder, SHA-256 of decoded bytes, and five repetitions per archive. **This is not a CoreSession combat tick or GPU FPS benchmark.** Results are host-specific and include hash CPU work.

| Input | Archive | Expanded | States (unique) | Script controller sections/candidates* | Helper sites* | AIR actions (unique) | Median stream+hash |
|---|---:|---:|---:|---:|---:|---:|---:|
| RareAkuma(1).zip — 2026 IKEMEN ZSS | 10,104,778 B | 14,553,450 B | 222 | 2,255 | 72 | 327 | 97.96 ms |
| Rare Akuma(1).zip — 2007 legacy ST | 6,274,786 B | 10,049,467 B | 137 | 1,033 | 45 | 307 | 65.78 ms |
| Dark Donald(2).rar — 2011 CNS | 58,535,448 B | 113,346,046 B | 277 | 3,442 | 103 | 282 | 1,651.13 ms |

*Static source occurrences; not per-frame executed operations. ZSS brace-call candidates include non-controller constructs, so the metrics are not strict equivalents across script dialects. The Dark Donald count includes `OPTION.txt`, referenced as `st7` in its DEF. Each distinct source file is counted once.

## Compatibility checks needed

- **ZSS Rare Akuma:** has global `-4` (also `-3,-2,-1`), extensive scoped conditions and redirections. Require IKEMEN extended scheduler, map/trigger semantics and a bounded helper stress run.
- **ST Rare Akuma:** legacy comparator; two duplicate AIR action declarations (309 declarations, 307 unique). Preserve effective action selection rules.
- **Dark Donald:** 405 `Projectile` controller sections, 358 `Null` controllers, 103 Helper sites and duplicate state IDs `3503` / `-3`. Its DEF references `Donald.cns` twice and loads state code from `OPTION.txt`. Check load-once AST sharing and state precedence. 80,727,500 bytes of SND media require bounded decoding and cache eviction.

The source archive SHA-256s respectively are:
- ZSS: `c626441be701eb104f20b5a5673ab9078555bfad17b298256daf4fcb5d9e349b`
- ST: `1482540feca04a9dba1eec529e99ea36dceb41730fb3a00a3450de67faa8e08d`
- Donald: `26d014d0b0e7d3aadea6512bc2885782ae8703582e6dd68d9490386eb11a5162`

## Real engine test hook

`scripts/core/benchmark-character-packages.mjs` is an additional **unexecuted** headless CoreSession benchmark harness. It takes a character ZIP or a directory containing extracted RAR contents, uses KFM opponent, and reports setup time, tick timings, entity and projectile counts, heap use, errors and repeat-run hashes. Run it against the three packages (locally; original archives are not committed):

```sh
npm ci
node scripts/core/benchmark-character-packages.mjs '/path/RareAkuma(1).zip' 120 3
node scripts/core/benchmark-character-packages.mjs '/path/Rare Akuma(1).zip' 120 3
node scripts/core/benchmark-character-packages.mjs '/path/dark-donald-extracted' 120 3
```

To claim actual game compatibility or mobile FPS, additionally run browser rendering, animation, sprite/SND decoding, controlled hit/guard/intro/outro fixtures, Dark Donald camera/AI tests, and Android physical-device profiling. No character asset contents were committed.
