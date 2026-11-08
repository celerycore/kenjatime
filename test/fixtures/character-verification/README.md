# Independent character verification fixtures

`fighter.cmd`, `fighter.cns`, generated SFF/AIR and solid-color palette images
are authored QA fixtures. `driver.lua` is loaded only by the verification
runner; it is not shipped in production engine assets. It samples simulation
state after each tick and cannot declare an unexercised move compatible.

`native/*.json.gz` are field captures from the unmodified official Linux
IKEMEN GO v1.0.0 executable, with pinned release/executable and resource/plan
hashes inside each report. `native/*.png` are actual native framebuffer reads,
not browser-generated expected images. Gzip streams use mtime zero.

The classic KFM resources already come from `public/kfm.zip`; 720p KFM resources
are read from the checksum-verified official release at test time. Original
CMD and combat states are retained. Only the separate opponent's backward-walk
constant changes for a stationary guard dummy; neutral setup/input injection
is applied identically in both engines.

The interactions reference is valid native evidence even though a browser
comparison under load found four projectile-retirement `InGuardDist` timing
differences. Baseline data is never edited to match the browser. See
[the workflow and limitations](../../../docs/character-verification.md).
