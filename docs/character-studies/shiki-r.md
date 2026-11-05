# Shiki R by Hakura — investigation status

The user supplied `Shiki R by Hakura.zip` and reported that the arena could not import it. The workspace attachment downloader refused the transfer because it exceeds its 32 MiB limit. The archive's exact size, entries, character definition, controllers, triggers and sprite format have therefore **not** been inspected. No character-specific compatibility claim follows from the filename.

Two independently confirmed application issues were addressed in Web Edition 12:

- The previous `arena/` route still contained an older importer and runtime. The current arena now shares the lab's import/runtime implementation; the old build is preserved at `arena-classic/`.
- Both entry points previously capped ZIPs at 50 MB compressed and 160 MB expanded. They now allow 128 MB compressed and 512 MB expanded, with unpacking and definition discovery in a worker. A 55.56 MB synthetic package containing actual KFM files passed browser import and touch combat checks. This does not demonstrate that Shiki R imports or behaves correctly.

To continue this character study, import the original ZIP into Web Edition 12 and select **Export character scripts**. The smaller ZIP includes the selected DEF and available CMD/CNS/state/AIR files, a file-size inventory and missing-reference evidence. It omits sprite and sound banks. Attach that export for script inspection, along with **Download report** after attempting the character's moves. If import still fails, provide the exact new error and the archive's displayed file size; individual DEF/CMD/CNS/AIR files can also be supplied separately.
