# Resetting a stuck library

The library belongs to the current browser profile or Android app. Updating the
site or installer does not silently purge every user's saved imports.

**Reset library**, under Saved on this device, remains clickable while startup
is waiting for storage. It reloads the same page with an explicit one-time reset
request. The request deletes `kenjatime.engine.library` (installed fighters,
stages and saved original copies) and `kenjatime.archives` (older saved imports),
then restores the included fighter and grid. Selection references are cleared;
visual preferences and unrelated databases remain. Original ZIP/RAR/7z files
outside the app are not modified.

The reset parameter is consumed with `history.replaceState`. Reloading after a
successful reset therefore keeps new imports instead of deleting them again.
If another Kenjatime page holds a database open, it must close its connection or
the reset reports a bounded error asking the user to close other windows.

Saved-library opening and reads now have eight-second deadlines. A late database
open is closed instead of leaving an untracked connection. Failed storage reads
fall back to the included resources with a visible recovery message. The sample
can launch without opening a broken saved database. A stalled older library does
not prevent using a healthy current library. Included resources have a separate
bounded load error, and malformed package metadata is skipped.

The Android 0.4.1 update retains the same app ID and signing certificate. To purge
an older stuck app immediately, Android Settings → Apps → Kenjatime → Storage →
Clear data resets its local app data. This removes saved imports inside that app;
downloaded original archives outside it remain available for reimport.

`scripts/verify-library-reset.py` verifies real IndexedDB deletion, legacy purge,
one-time reset, preserved unrelated data, surviving new imports, reset while
`IndexedDB.open` never resolves, and a real Go sample match with unavailable
saved storage. These are host browser tests, not remote access to a phone.
