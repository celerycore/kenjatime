# Kuromaru AIR upload correction

The supplied `kuromaru_girl_plus.rar` and `kuromaru_plus.zip` failed import at
AIR lines 3271 and 7044 respectively. Both contained this optional-field form:

```text
3605, 1, 0, 0, 10, H, , A0
```

The eighth column is the optional X-scale. The text `A0` is not a numeric scale.
The browser parser previously converted it to NaN and rejected the whole archive.
It now keeps the frame, flip, duration and collision data, uses X-scale 1, and
records a nonfatal diagnostic. Invalid Y-scale/angle values similarly retain
defaults 1 and 0. Valid numeric transforms, including zero and negative scale,
remain intact. Required frame fields and archive path/size checks stay strict.

This matches the default retained by the Go AIR reader for an invalid optional
scale. The importer does not move `A0` into another column or rewrite the archive.
The source character scripts and original saved/downloaded archive remain intact.

Both provided archives resolve every referenced resource and pass import:

| Archive | Animation actions | Optional-transform warnings | Go/WASM match startup |
| --- | ---: | ---: | --- |
| kuromaru_girl_plus.rar | 835 | 181 | Passed |
| kuromaru_plus.zip | 1,227 | 181 | Passed |

The actual supplied archives were installed through the browser file picker and
loaded into Go matches, with no page errors or failed requests. This verifies
the reported upload blocker and startup, rather than every authored move.
`test/formats.test.js` includes a small independent regression for the malformed
optional fields. `scripts/verify-go-engine.py` accepts `MUGEN_KUROMARU_RAR` and
`MUGEN_KUROMARU_ZIP` for the full archive checks.
