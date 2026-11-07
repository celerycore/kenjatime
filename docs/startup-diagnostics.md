# Startup diagnostics

Under **Saved on this device**, open **Startup report → Save startup report**.
The JSON download works while storage is waiting, after recovery, and after a
successful start. On Android it uses the document save picker. It does not send
anything automatically. Keep this report before resetting a stuck library.

The report identifies resource download/unpacking, included catalog checks,
database opening and migration, metadata reads, roster rendering and preview
decoding. Timings distinguish ready, degraded fallback, failed and interrupted
starts. A launch left unfinished is called interrupted; that alone does not
establish an app crash. The last three launches are retained locally, with at
most 48 phases per launch and bounded report storage. Full or damaged diagnostic
storage does not prevent starting or exporting the current report.

Build versions, browser navigation/device details, startup long tasks, library
counts and known imported byte sizes help locate a stall. Android also reports
the WebView version, native activity-to-bridge time, available memory and disk,
and whether the activity was restored. These checks have separate deadlines and
do not block setup. Older imports can lack size metadata; the report counts them
separately rather than reading their archive payloads. Error messages, archive
names, passwords and character contents are excluded.

Library opening and reads retain their eight-second deadlines. Blocked schema
upgrades are reported separately from timeouts. A storage failure allows the
included fighter to run. Recovery never automatically deletes installed files.
[Reset library](library-recovery.md) is still an explicit destructive action.
The included catalog is now parsed once per page instead of on every catalog
refresh. Diagnostic timers and long-task observation stop after startup.

## Reproducible checks

Run `npm test`, `npm run build`, then
`python scripts/verify-startup-diagnostics.py`. The browser check starts its own
local server and uses Chromium/SwiftShader. It runs in the Go browser engine CI.
Detailed results are in [startup evidence](startup-diagnostics-evidence.json).

- Three independent empty-profile starts, two reloads, and two actual Chromium
  process launches using the same persistent profile.
- Real IndexedDB schema 1 → 2 migration, including retained installed files;
  another tab blocking the upgrade, followed by successful recovery.
- A 200-package/20,200-file library with about 289 MiB of logical payload.
  Fixture records reuse Blob objects, so this is not a physical disk saturation
  test. Guards reject bulk reads of either extracted files or original archives
  during startup; metadata reads are sufficient.
- Malformed metadata, stalled storage, an interrupted start, an injected storage
  error and failed included-resource downloads. Reloads restore access without
  purging saved imports, and the report remains exportable during a stall.

These are host integration tests. Android's real Capacitor bridge and startup
metadata are also tested under Robolectric, and APK asset/signature checks verify
packaging. They do not establish physical phone cold-start times, actual Android
package-update survival, low-memory process death or power-loss durability.
Install the same-signed 0.4.2 update over the current app to retain its data;
physical Infinix measurements require the exported device report.
