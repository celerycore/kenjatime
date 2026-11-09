# Rare Akuma 2007 + 2026: cross-generation Core compatibility

This benchmark uses **two separately provided, unmodified archives**, not a
single mixed character package. No Rare Akuma character art or scripts are committed.

| Input | Original archive SHA-256 |
| --- | --- |
| 2007 Rare Akuma, versiondate 10,20,2007 | 1482540feca04a9dba1eec529e99ea36dceb41730fb3a00a3450de67faa8e08d |
| 2026 IKEMEN ZSS Rare Akuma, versiondate 2026 | c626441be701eb104f20b5a5673ab9078555bfad17b298256daf4fcb5d9e349b |

## Exact two-archive regression

On a Kenjatime Core checkout with Node.js and npm dependencies:

    npm ci
    MUGEN_RARE_AKUMA_OLD="/path/Rare Akuma.zip" \
    MUGEN_RARE_AKUMA_2026="/path/RareAkuma.zip" \
    npm run benchmark:core:rare-akuma-duel

The bench runs independent CPU matches **in both player orders** with both
characters' assets isolated into separate virtual package namespaces.
It tracks hits/guards/reversals, helper/projectile peaks, non-finite state,
fixed-interval draw packets, decoded texture uploads, per-round snapshots,
runtime diagnostics and source/resource diagnostics separately.

An original effect ZIP can be selected with MUGEN_FIGHTFX_PACK; AIR, SFF and
SND must come from the **same source pack**. Do not borrow graphics across
original MUGEN and IKEMEN installations.

Set RARE_DUEL_TICKS to an integer from 1 to 18000 and
RARE_DUEL_FRAME_INTERVAL to adjust render sampling. Use RARE_DUEL_STRICT=1
to exit nonzero for an exception or runtime diagnostic.

Outputs work/core/rare-akuma-dual-compat.json or RARE_DUEL_OUTPUT.

## Baseline with the exact supplied archives

On the unchanged core gameplay logic plus atomic effect-bank routing:

| CPU pairing | Ticks | Contact events | Peak helpers | Peak projectiles | Runtime errors |
| --- | ---: | ---: | ---: | ---: | --- |
| 2007 P1 vs 2026 P2 | 3600 / 3600 | 107 | 12 | 26 | 0 |
| 2026 P1 vs 2007 P2 | 3600 / 3600 | 91 | 9 | 20 | 0 |

31 sampled frame packets were rendered in each player order. Before the
partial-PCX presentation change, one sampled render reported a truncated
sprite from the **2026 original SFF**.

The 2026 archive has seven corrupt SFF v1 PCX image records, with no
complete encoded data. **Strict SFF decode still reports all seven as
invalid**. A new display-only decode preserves their original encoded pixel
prefix and fills trailing absent pixels with transparent palette index 0.
This allows animations to continue drawing valid portions, but is **not**
restoration of missing artwork or proof of native visual equivalence.
Every recovered sprite is marked sprite-incomplete with exact pixel counts.
Invalid PCX headers and overrun run-lengths remain rejected.

The engine separately reports AIR sprite pairs absent from the archive
as missing-sprite. Unavailable original fightfx sprites are not generated.

## Coverage levels

- 2007 original: 137 authored states, 24 helper-state definitions and 307
  effective AIR actions were independently smoke-probed in PR #2.
- 2026 original: 222 authored ZSS states, 54 helper-state definitions and
  327 AIR actions were independently smoke-probed in PR #3.
- This dual benchmark checks **cross-version gameplay interoperability**,
  a separate risk not established by standalone character probes.
- Synthetic CI tests verify two characters with the identical display name
  have isolated state tables, sprite resources and command buffers.

**Not yet certified:** exact animation pixels for 2007 source-absent sprites,
seven 2026 source-truncated PCX records, old/new native MUGEN and IKEMEN GO
tick-for-tick timing and collision parity, optional shared effect/audio packs
not yet supplied, full command reachability of every move, and physical
Android/mobile GPU performance. No universal compatibility claim follows
from these smoke tests alone.

The work is on a draft, review-only branch stacked on the prior Rare Akuma
PRs. Production and the deployed website remain unchanged.
