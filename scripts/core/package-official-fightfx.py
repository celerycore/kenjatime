#!/usr/bin/env python3
"""Assemble unchanged official IKEMEN GO common FX files in an importable ZIP.

No original binaries are stored in the Kenjatime repository. Every downloaded
blob is matched to its pinned upstream Git object SHA-1 before packaging.
Usage: python3 scripts/core/package-official-fightfx.py --output path.zip
"""
import argparse
import hashlib
import io
import pathlib
import urllib.request
import zipfile

SOURCE_REPO = "ikemen-engine/Ikemen-GO-Screenpack"
SOURCE_REV = "7e5c282e960a1021f6e48999065868abe9a2ad82"
# Git blob SHA-1, verified from the exact pinned upstream repository commit.
BLOBS = {
    "data/fight.def": "c2ea979d2b007c27fc13f7873219f60f66d47fdb",
    "data/fightfx.air": "6fbbfaa65ea8267fdc64f573d7a85d84d875b67d",
    "data/fightfx.sff": "51df53f3ee0fd51fc095b1a1fc3786974a47b7a2",
    "data/common.snd": "038c75c3b5bfb48ee78e41de8011f013219b43cc",
}

def download(path):
    url = f"https://raw.githubusercontent.com/{SOURCE_REPO}/{SOURCE_REV}/{path}"
    request = urllib.request.Request(url, headers={"User-Agent": "Kenjatime-Core-FightFX-Verification"})
    with urllib.request.urlopen(request, timeout=45) as response:
        data = response.read(4 * 1024 * 1024 + 1)
    if len(data) > 4 * 1024 * 1024:
        raise ValueError(f"Asset unexpectedly oversized: {path}")
    return data

def verify_blob(path, data):
    actual = hashlib.sha1(b"blob " + str(len(data)).encode() + b"\x00" + data).hexdigest()
    if actual != BLOBS[path]:
        raise ValueError(f"Git blob SHA mismatch for {path}: {actual}, expected {BLOBS[path]}")

def create(output):
    downloaded = {}
    for path in BLOBS:
        data = download(path)
        verify_blob(path, data)
        downloaded[path] = data
        print(f"verified {path}: {len(data)} bytes, blob {BLOBS[path]}")
    license_data = download("LICENCE.txt")
    notice = (
        f"Source: https://github.com/{SOURCE_REPO}\n"
        f"Pinned source commit: {SOURCE_REV}\n"
        "Original files are provided unchanged for installing an IKEMEN GO\n"
        "common-effects resource pack in Kenjatime. Review SOURCE_LICENCE.txt.\n"
        "These shared effects do not replace missing sprites inside either\n"
        "original Rare Akuma character SFF.\n"
    ).encode("utf-8")
    output = pathlib.Path(output).resolve()
    output.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED, compresslevel=7) as archive:
        for name, data in downloaded.items():
            archive.writestr(name, data)
        archive.writestr("SOURCE_LICENCE.txt", license_data)
        archive.writestr("SOURCE.txt", notice)
    print(f"wrote {output} ({output.stat().st_size} bytes)")
    return output

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="work/core/IKEMEN_GO_Official_Common_FX.zip")
    args = parser.parse_args()
    create(args.output)
