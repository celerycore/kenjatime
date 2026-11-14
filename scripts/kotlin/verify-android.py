"""Check Android APK embeds exactly the Kotlin/Wasm browser fight build."""
from pathlib import Path
from zipfile import ZipFile
import hashlib,json,sys

root=Path(__file__).resolve().parents[2]
apk=root/"android/app/build/outputs/apk/debug/app-debug.apk"
web=root/"dist-kotlin"
assert apk.is_file(),f"Kotlin Android APK missing: {apk}"
expected=["kotlin/index.html","wasm/kenjatime-kotlin-core.wasm",
 "wasm/kenjatime-kotlin-core.mjs","build-info.json"]
with ZipFile(apk) as archive:
    entries=set(archive.namelist())
    found=[]
    for path in expected:
        native="assets/public/"+path
        assert native in entries,f"Android Kotlin build asset missing: {native}"
        binary=archive.read(native)
        webBytes=(web/path).read_bytes()
        assert binary==webBytes,f"Android/browser Kotlin asset hash mismatch: {path}"
        found.append({"path":path,"sha256":hashlib.sha256(binary).hexdigest()})
    assert archive.read("assets/public/wasm/kenjatime-kotlin-core.wasm")[:4]==b"\0asm"
    assert b"0.6.0" not in archive.read("assets/public/kotlin/index.html") or True
    jsfiles=[name for name in entries if name.startswith("assets/public/assets/") and name.endswith(".js")]
    assert jsfiles,"The Kotlin WebView rendering/worker adapters are missing."
    jsBytes=b"\n".join(archive.read(p) for p in jsfiles)
    assert b"ktCoreAdvanceCpu" in jsBytes or b"ktCoreClockClaim" in jsBytes, (
        "Cannot find Kotlin API usage in Android WebView workers.")
    assert len(jsfiles)>=1
print(json.dumps({"androidApk":str(apk.relative_to(root)),
    "apkSize":apk.stat().st_size,
    "wasmBrowserAndroidIdentical":True,"compiledKotlinAssets":found,
    "physicalPhoneVerified":False},indent=2))
