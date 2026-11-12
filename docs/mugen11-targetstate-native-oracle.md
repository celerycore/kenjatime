# MUGEN 1.1 native oracle — TargetState / SelfState / ChangeAnim2

**Target:** Elecbyte **M.U.G.E.N 1.1 Beta 1 P1** (2013).  
**Scenario:** `targetstate-selfstate-changeanim2-v1`  
**Status:** NATIVE ORACLE NOT PROVIDED OR EXECUTED — full MUGEN 1.1 parity **UNVERIFIED**.

This milestone supplies (1) Kenjatime original synthetic regression
characters, (2) original native-compatible CNS/AIR *additions*, (3) a
candidate trace exporter, and (4) a strict comparator for independently
supplied native observations. No MUGEN binaries, KFM sprites, proprietary
character content, or prefilled "native" traces are provided.

## 1. What this tests

| Condition | Expected MUGEN 1.1 controller behavior |
| --- | --- |
| `TargetState id=71, value=910` | Only living captured targets with hit ID 71 enter P1's StateDef 910 |
| `TargetState ctrl=0` | **Not** a documented TargetState parameter; it must not force victim control |
| P2 in borrowed StateDef 910 | Controllers and the following ChangeState 911 come from P1's CNS, **not** P2's conflicting StateDef 910 |
| `ChangeAnim2 value=9100, elem=2` | Chooses P1's AIR action 9100 starting on its second element, even when P2 lacks that action |
| `ChangeAnim` | Uses P2's own AIR, not the borrowed P1 AIR |
| `SelfState value=0` | Returns P2 to its own StateDef 0; that state's `anim=0` selects P2 AIR action 0 |
| P2-owned helper ID 72 | Survives as a distinct actor and does not inherit P2's borrowed state unless itself targeted |

The original synthetic controller/animation fixture is
`test/core/fixtures/mugen11-targetstate-scenario.js`.
This validates the **Kenjatime implementation against documented rules**,
not the result of a native executable run.

## 2. Native probe preparation — use your own installation

On a PC with a lawfully obtained native M.U.G.E.N 1.1 Beta 1 P1 installation:

1. **Make backups** of the installation and KFM folder. Copy the original
   `chars/kfm` folder into two *separate* character folders,
   `kenja-oracle-p1` and `kenja-oracle-p2`. Select their respective
   existing copied `.def` files in a local versus match (add references
   to `select.def` if necessary). Never distribute the copied KFM SFF,
   AIR, SND, or the engine binary.
2. For P1 **append** `append-p1.cns` to the copied main CNS file and
   **append** `append-p1.air` to the copied main AIR file. Keep all
   existing KFM constants, sprites, palettes, and sound files.
3. For P2 **append** `append-p2.cns` to its separate copied main CNS.
   It defines a deliberately conflicting StateDef 910 and a P2-owned
   helper-spawning state 901. Do **not** append P1's action 9100 to P2:
   it must exist **only** in P1 AIR.
4. Confirm the copied KFM version has no StateDef conflicts with **900,
   901, 910, 911** or action conflicts with **900, 9100** before testing.
   Use an unmodified stock stage and disable external AI/scripts that
   change state ownership. Record the exact character files and stage.
5. Start P1 vs P2. Open the official MUGEN 1.1 console with **Ctrl+~**.
   Use `changestate 2 901` and advance two logic ticks so P2 spawns
   a distant normal helper (ID 72) and returns to its own standing state.
   Next use `changestate 1 900` to perform the original probe attack.
   Its HitDef has ID 71 and the P1 controller subsequently invokes
   `TargetState value=910, id=71` on the captured opponent.
6. Enable player debug with **Ctrl+D**; cycle through P1/P2/helper as
   appropriate. Pause the game, then use the console `framestep`
   command or **Scroll Lock** to advance one native tick at a time.
   Take screenshots with `screenshot` / **F12** as needed. P1's borrowed
   StateDefs 910 and 911 include `DisplayToClipboard` showing P2's
   `StateNo`, `Time`, `Anim`, `AnimElemNo(0)`, and `Var(42)`.
   The expected borrowed-state marker is **73**, whereas P2's *own*
   conflicting StateDef 910 deliberately writes **999**.
7. Note the first frame **after P2 enters borrowed StateDef 910**, then
   record *post-transition* frames of 910 / 911 / own 0. Align the native
   observations to Kenjatime's corresponding `after_tick` phases.
   Native pre-hit contact timing may differ: the synthetic probe seeds
   target ID 71 directly instead of replicating MUGEN collision setup.
   **Do not compare the complete pre-hit fight timeline as though it
   were identical.** Do not invent unavailable owner flags; omit those
   fields if only their effects (animation/marker/state) were observed.
8. Record exact MUGEN build version and SHA-256 of the local `mugen.exe`,
   plus SHA-256 hashes of **separate archived final P1 and P2 character
   folders**. On Windows, PowerShell:
   `Get-FileHash .\\mugen.exe -Algorithm SHA256` (and the relevant
   P1/P2 ZIPs). The supplied hashes are *self-reported provenance*,
   not proof of authenticity.

Native M.U.G.E.N console documentation confirms `changestate`,
`framestep`, `pause`, and `screenshot`:
https://network.mugenguild.com/justnopoint/1.1docs/mconsole.html .
The AIR documentation also documents Pause + Scroll Lock frame stepping:
https://network.mugenguild.com/justnopoint/1.1docs/air.html .

## 3. Generate the Kenjatime candidate trace

```sh
node scripts/core/mugen11-targetstate-oracle.mjs \\
  --candidate /tmp/mugen11-targetstate-candidate.json --ticks 5
```

This emits a machine-readable synthetic candidate with
`nativeMugen11Verified:false`. It never asserts that a native run
occurred. Each observation includes `tick`, `phase` and actor roles
`p1`, `p2`, `p2-helper-72`; per actor it includes `stateNo`,
`stateTime`, `anim`, 1-based `animElem`, `ctrl`,
`stateOwner`, `animationOwner`, and `var42`.

## 4. Supply a *real* native observation file

Manually transcribe **only values actually observed** during the native
run. Native reference data is intentionally **not** bundled:

```json
{
  "source": "native-mugen11",
  "scenario": "targetstate-selfstate-changeanim2-v1",
  "provenance": {
    "engine": "Elecbyte M.U.G.E.N",
    "release": "1.1 Beta 1 P1",
    "executableSha256": "REPLACE_WITH_REAL_64_CHARACTER_SHA256",
    "attackerAssetsSha256": "REPLACE_WITH_REAL_64_CHARACTER_SHA256",
    "victimAssetsSha256": "REPLACE_WITH_REAL_64_CHARACTER_SHA256",
    "captureMethod": "manual native debug screenshots, one frame at a time",
    "stage": "record actual stage filename",
    "inputSequence": "native console P2 state 901, then P1 state 900"
  },
  "ticks": [
    {
      "tick": 1,
      "phase": "after_tick",
      "actors": [
        {
          "role": "p2",
          "stateNo": 910,
          "anim": 9100,
          "var42": 73
        }
      ]
    }
  ]
}
```

**This JSON is a SCHEMA EXAMPLE ONLY**, *not an observed reference*.
Replace every value with actual native evidence; the sample tick is
illustrative and may not align with the native hit timing. The hash
placeholders deliberately fail validation.

Use the same `tick` and `phase` labels as the matching candidate
observation. A native file may include **a subset** of candidate ticks,
actors, and fields; comparisons remain **exact**, with no automatic
rounding or invented values. The comparator rejects missing actor roles,
unknown fields, mislabeled engines, empty evidence, and scenario mismatches.

```sh
node scripts/core/mugen11-targetstate-oracle.mjs \\
  --candidate /tmp/mugen11-targetstate-candidate.json \\
  --native /path/to/real-native-mugen11-observations.json
```

The comparison returns the first mismatching tick/actor/field and
reports observed coverage. Even a matching trace has
`nativeReferenceAuthenticated:false` and
`fullMugen11Certified:false`: neither provided metadata nor one
scenario can authenticate native measurements or prove total engine
parity. No real native observations currently exist in this project.

## 5. Future expansion to Tomoka

After the original synthetic scenario is matched to a native reference,
run both unmodified Tomoka archive variants **locally** and capture
actual assist activation under the same input stream. Compare helper
creation, borrowed owner, AIR lookup, state transitions, target identity
and player-facing rendering. Do not replace private character assets
with simplified substitutes and declare full fidelity.
