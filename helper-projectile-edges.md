# Helper and projectile compatibility: Web Edition 16

This pass fixes lifecycle and contact edge cases against the supplied MUGEN 1.1 beta 1 documentation. Tests use independently authored CNS/CMD/AIR/SFF fixtures and the supplied classic/720p KFM files. No independent native executable capture is available, so this does not certify full MUGEN equivalence.

## Helpers and Explods

DestroySelf now stops the helper's remaining controllers and movement immediately. `recursive` removes active descendants; `removeexplods` controls whether their Explods disappear. For example, a helper that creates a timed Explod and then executes plain DestroySelf leaves that effect visible until its own removal time. Previously the effect disappeared with the helper.

Surviving effects are tracked as orphan presentation owners. They retain their animation, movement, coordinates, palette and independent pause allowances. They are not players, helpers, targets or authoritative collision entities. NumHelper/PlayerIDExist stop finding the destroyed helper, and its effects are not added to the root's NumExplod count. Finite orphan holders are released after their final visible frame; round reset clears them. Permanent effects retain their authored lifetime.

Players and Explods bound to a destroyed helper detach immediately. An effect that has not yet received its first binding update resolves its anchor/offset once before detaching. A surviving descendant cannot rebind to its destroyed parent or write its variables. Parent redirection/distance returns bottom when the parent no longer exists; ParentDist also rejects a KO'd parent. RootDist is valid for helpers, including descendants whose immediate parent was destroyed. BindToParent/BindToRoot do nothing when used by a root player, as documented.

Palette effects needed by surviving children/orphan effects remain reachable after their original helper disappears. Independent children release unused ancestor palettes. Events produced before destruction still reach presentation, including palette snapshots. A browser pixel check verifies an orphan effect keeps its orange PalFX tint and then returns to red when the shared palette effect expires.

Helpers with `keyctrl=1` have a command buffer using the root's command definitions and their own facing. A right input can therefore mean forward to the root and back to a left-facing helper. They inherit the root's State -1; helpers with `keyctrl=0` have no command access or State -1. The browser supplies physical input; API callers supplying only already-matched command names retain the existing named-command behavior. Helper buffers are removed when the helper disappears.

Normal helpers remain free to move offscreen. Explicit ScreenBound constrains them using their body widths. Legacy player-type helpers remain reported as unsupported/deprecated for the 1.1 target.

## Projectiles

- **Hit quotas:** default `projremove=1` waits for `projhits` to be exhausted. A three-hit projectile can now hit three times. `projremove=0` keeps an exhausted projectile alive until its time/bounds/cancellation remove it, with no additional damage. Zero-hit projectiles remain visible and can participate in cancellation.
- **Hit spacing:** `projmisstime` uses the projectile's advancing clock, so hitpause and global pauses do not consume its delay while it is frozen.
- **Cancellation:** projectiles collide with other projectiles through **Clsn2**, independently of their Clsn1 attack boxes. Higher priority spends a priority point; other clashes spend hit capacity. A multi-hit projectile can survive a clash rather than being removed as a one-hit projectile.
- **Removal frames:** finite hit/cancel/time-removal actions retain their last visible frame after collision participation ends. A one-tick action is shown once. Selecting the current action continues its existing clock; a hit on its last frame does not restart a cycle. These are drawing snapshots, not extra active projectiles.
- **Invalid resources:** a missing removal action produces a diagnostic and retains the current action. An invalid initial projectile action does not occupy a slot that blocks a later valid projectile. A helper rejected for a missing initial state similarly leaves its slot available.
- **IDs and ownership:** negative ProjID values normalize to zero with a diagnostic; NumProjID normalizes negative/integer arguments as documented. Helper-created projectiles remain owned by the root after their creator disappears, preserving power, target and contact-history access.
- **Shadows:** the existing stage-shadow render path is exercised through `projshadow`; its false unsupported diagnostic was removed. The native stage must supply an enabled shadow. The synthetic training grid is not a native stage shadow fixture.

Reports now expose helper parent/root/key-control relationships, orphan Explods and projectile ownership, creation scale, position, hit capacity, spacing, removal state and visible animation frames. Removed projectile snapshots may appear for their final drawn frame while NumProj already excludes them.

## Source and evidence

| Source | Change |
| --- | --- |
| `src/runtime.js` | Immediate DestroySelf termination, binding/distance rules and integer projectile-ID queries. |
| `src/combat.js` | Helper destruction/orphan ownership, independent helper inputs, cancellation, screen constraints and separate visible projectile frames. |
| `src/projectiles.js` | Quotas, advancing-clock hit spacing, clashes, removal/action clocks and ID/resource handling. |
| `src/explods.js` | Immediate force-unbinding with preserved world coordinates. |
| `src/effects.js` | Retain palette owners needed by descendants/effects; release unused maps. |
| `src/app-runtime.js` | Render orphan/final-frame snapshots, forward destroyed-helper events, expose diagnostics and Edition 16. |
| `test/entity-edge-cases.test.js` | 31 focused lifecycle/input/contact regressions. |
| `scripts/verify-entity-edges.py` | ZIP import → CMD → helper/projectile simulation → reports and pixel checks, with independent indexed sprites. |

The supplied MUGEN docs are the primary reference for Helper, DestroySelf, BindToParent/Root, ParentDist/RootDist, Projectile and NumProjID. The public [Ikemen GO character runtime](https://github.com/ikemen-engine/Ikemen-GO/blob/develop/src/char.go) was used as a secondary reference for cancellation boxes/durability and removal-action fallback/continuation. It includes extensions and intentional fixes, so those interactions still require native MUGEN captures for exact version parity.

All **340 Node tests** pass with the full example archive and no skipped tests. The new browser check observes 324 orphan pixels, 324 tinted orphan pixels, life values 990 → 980 → 970 for a three-hit shot, one-tick removal visibility, and shadow pixels changing from 0 to 84. It also checks report exports and 390px layout. Existing combat, chains/throws/recovery, mobile worker import/touch and graphics/cadence checks pass. All seven existing performance scenes retain identical exported behavior hashes and pixel-identical output against the Edition 15 benchmark, with zero routine sprite/stage readbacks. The compatibility replay has zero diagnostics; it is still a web-runtime replay rather than a native comparison.

```sh
npm test
MUGEN_TEST_ARCHIVE=/path/to/mugen-1.1b1.zip npm test
npm run compatibility
npm run build
MUGEN_TEST_URL=http://127.0.0.1:5173/ python scripts/verify-entity-edges.py
```

Browser scripts require Python Playwright and Chromium; `CHROMIUM_PATH` overrides `/usr/bin/chromium`. Serve the Vite app or built site first. Source development continues on **`source/mugen-compatibility`**. `source/mobile-performance` preserves the Edition 15 performance checkpoint; `gh-pages` remains the built deployment. Copy tested `dist/` assets into a separate fast-forwarded deployment checkout, as described in the [performance/deployment guide](performance-baseline.md#deployment).

## Remaining work

Independent native captures are still needed for simultaneous multi-target/cancellation ordering, exact hitpause/removal boundaries, every invalid/nonterminating removal action, mixed-character/custom-state projectile sprite ownership, palette/version quirks and stage reflection interactions. Complete helper/projectile InGuardDist detection, helper body-push/camera interactions, legacy player-type behavior and team modes need further coverage. These changes preserve the fixed 60 Hz simulation and mobile graphics settings; they do not establish full character compatibility.
