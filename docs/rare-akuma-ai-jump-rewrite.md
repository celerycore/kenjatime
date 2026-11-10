# Native-style CPU jump restoration for both Rare Akuma editions

This is a review-only Kenjatime Core engine update. It does not change or
redistribute original Rare Akuma character files.

## Comparison with the older Kenjatime engine

Before the rewrite, engine/kenjatime.lua booted the actual Go/WebAssembly
game engine and used setCom() for native CPU control. The new Core substituted
a generic physical-key command planner, which jumped only occasionally.

The original 2007 Rare Akuma uses a legacy Winane-style AI flag in variable
59: human commands check var(59)<=0 and CPU commands check var(59)>=1.
Its helper state 9741 normally detects CPU input behavior. Core's simulated
keys incorrectly made that flag become -1, disabling the authored AI.
The 2026 ZSS release instead uses the built-in AILevel trigger.

## Engine changes

1. Detect paired CPU and human variable gates from the character's own
   StateDef -1 trigger definitions. Activate only for CPU-controlled fighters;
   leave all human players and unrelated variables unchanged. Refresh after
   intro transitions and round resets.
2. Use a more responsive Up, Up+Forward and Up+Back command cadence. A
   completed generic attack-plan releases movement selection immediately
   instead of enforcing another attack cooldown. Do not force state 40 or
   interrupt an active multi-step command.
3. Classify original character references to unavailable Explod animations
   (including legacy action 4128) as missing-art resource diagnostics rather
   than pretending these are failed engine controllers.
4. Track physical Up inputs, actual jump-state entries, airborne ticks and
   authored AI flag activation in the 3600-tick dual-version benchmark.
5. Add synthetic Core and Chromium CPU-versus-CPU regression checks.

## Fresh dual Rare Akuma replay with the original official FX pack

| Outcome | 2007 P1 vs 2026 P2 | 2026 P1 vs 2007 P2 |
| --- | ---: | ---: |
| Simulation | 3600/3600 | 3600/3600 |
| Real jump starts P1/P2 | 12 / 9 | 11 / 8 |
| P1/P2 airborne ticks | 1410 / 2860 | 1941 / 1084 |
| 2007 authored AI ticks | 3228 | 3228 |
| Combat contacts | 238 | 105 |
| Runtime diagnostic kinds | 0 | 0 |

Original sprite warnings still remain: seven damaged 2026 PCX records and
missing 2007 AIR action 4128. None was replaced with fabricated sprites.

Local original-archive replay used a temporary offline ZIP decoder adapter
due network registry access being unavailable. The engine simulation logic
was not modified by that adapter. Hosted Core CI uses normal npm ci.

## Repeat the original asset verification

Set MUGEN_RARE_AKUMA_OLD and MUGEN_RARE_AKUMA_2026 to the two original ZIPs,
MUGEN_FIGHTFX_PACK to the authentic common FX ZIP, and run:

    RARE_DUEL_STRICT=1 RARE_DUEL_REQUIRE_JUMPS=1 RARE_DUEL_REQUIRE_AUTHORED_AI=1 npm run benchmark:core:rare-akuma-duel

No claim of exact native frame-by-frame parity or complete restoration of
original character sprite art is made.
