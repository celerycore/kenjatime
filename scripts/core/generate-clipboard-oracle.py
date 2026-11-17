"""Regenerate numeric-format evidence with the host C printf implementation."""
from pathlib import Path
import ctypes, json, locale, sys

locale.setlocale(locale.LC_NUMERIC,"C")
printf=ctypes.CDLL(None).snprintf
printf.restype=ctypes.c_int
printf.argtypes=[ctypes.c_char_p,ctypes.c_size_t,ctypes.c_char_p]
cases=[]
for value in [0.0,-0.0,.1,1.25,2.5,3.5,2.675,9.99999,.00001,1000000.0,
              float.fromhex("0x0.0000000000001p-1022"),sys.float_info.max]:
    for spec in ["%.6f","%+.2f","%08.2f","%-12.3e","%#.0f","%g","%.4g","%#.6g","%G","%.20f"]:
        output=ctypes.create_string_buffer(4096)
        size=printf(output,len(output),spec.encode(),ctypes.c_double(value))
        assert 0<=size<len(output)
        cases.append({"format":spec,"param":repr(value),"expected":output.value.decode()})
for value in [-2147483648,-42,0,42,2147483647]:
    for spec in ["%d","%i","%+06d","%05.3d"]:
        output=ctypes.create_string_buffer(4096)
        size=printf(output,len(output),spec.encode(),ctypes.c_int(value))
        assert 0<=size<len(output)
        cases.append({"format":spec,"param":str(value),"expected":output.value.decode()})
target=Path(__file__).resolve().parents[2]/"test/fixtures/kotlin-clipboard-printf.json"
target.write_text(json.dumps({"reference":"C snprintf; LC_NUMERIC=C; IEEE binary64 floats and signed int32 integers",
                              "cases":cases},indent=2)+"\n")
print(f"Wrote {len(cases)} numeric cases to {target}")
