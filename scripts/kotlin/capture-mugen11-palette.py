"""Record hit and guard palette colors from the original MUGEN executable."""

import argparse
from collections import Counter
import hashlib
import json
import os
from pathlib import Path
import re
import struct
import subprocess
from tempfile import TemporaryDirectory
import time
import zipfile

from PIL import ImageGrab


ARCHIVE_SHA = "67f55cafa49107f29e4317a245e35b17a718044de8e88ee824ad64862667b356"
ATTACKER = [(40, 180, 240), (20, 190, 70), (240, 70, 15)]
DEFENDER = [(96, 120, 144), (120, 100, 160), (56, 200, 104)]
READY = (45, 125, 55)
ADD = (64, -32, 32)
MUL = (192, 320, 256)


def write_sff(path, colors):
    # Independently authored 32×48 rectangles, with palette index 0 transparent.
    header = bytearray(512)
    header[:12] = b"ElecbyteSpr\0"
    header[13] = header[15] = 1
    struct.pack_into("<IIII", header, 16, 1, len(colors), len(header), 32)
    data = bytearray(header)
    for number, color in enumerate(colors):
        pcx = bytearray(128)
        pcx[:4] = bytes([10, 5, 1, 8])
        struct.pack_into("<HHHH", pcx, 4, 0, 0, 31, 47)
        pcx[65] = 1
        struct.pack_into("<H", pcx, 66, 32)
        pcx.extend(bytes([0xE0, 1]) * 48)
        pcx.extend(bytes([12, 0, 0, 0, *color]) + bytes(762))
        next_offset = len(data) + 32 + len(pcx) if number + 1 < len(colors) else 0
        data.extend(struct.pack("<IIhhHHHB13x", next_offset, len(pcx), 16, 48, 0, number, 0, 0))
        data.extend(pcx)
    path.write_bytes(data)


def prepare(game):
    cfg = game / "data/mugen.cfg"
    config = cfg.read_text(encoding="latin-1")
    for key, value in {"GameWidth": 640, "GameHeight": 480, "Sound": 0, "Debug": 1}.items():
        config = re.sub(rf"^{key}\s*=.*$", f"{key} = {value}", config, flags=re.M)
    cfg.write_text(config, encoding="latin-1")

    constants = (game / "chars/kfm/kfm.cns").read_bytes()
    defense = "Clsn2Default: 1\nClsn2[0] = -12,-48,12,0\n"
    for side, colors in enumerate((ATTACKER, DEFENDER), start=1):
        name = f"ktpal{side}"
        fighter = game / "chars" / name
        fighter.mkdir()
        (fighter / "base.cns").write_bytes(constants)
        write_sff(fighter / "probe.sff", [*colors, READY])
        (fighter / f"{name}.def").write_text(f"""[Info]
name = "Palette Probe {side}"
mugenversion = 1.1
localcoord = 320,240
[Files]
cmd = probe.cmd
cns = base.cns
st = probe.st
stcommon = common1.cns
sprite = probe.sff
anim = probe.air
""")
        commands = {"holdback": "/B", "holdfwd": "/F", "holdup": "/U",
                    "holddown": "/D", "recovery": "x+y"}
        command_text = "\n".join(
            f'[Command]\nname = "{name}"\ncommand = {command}\ntime = 1\n'
            for name, command in commands.items()
        )
        command_text += "\n[Statedef -1]\n[State -1, hold]\ntype = Null\ntrigger1 = 1\n"
        (fighter / "probe.cmd").write_text(command_text)
        states = "".join(
            f"\n[Statedef {state}]\ntype = S\nmovetype = {move}\nphysics = N\nanim = {anim}\nctrl = {ctrl}\nvelset = 0,0\n"
            f"[State {state}, hold]\ntype = Null\ntrigger1 = 1\n"
            + ("[State 0, arm]\ntype = ChangeState\ntrigger1 = RoundState = 2\nvalue = 190\n"
               if side == 1 and state == 0 else "")
            for state, move, anim, ctrl in [(0, "I", 0, 1), (20, "I", 0, 1), (150, "H", 150, 0), (5000, "H", 5000, 0)]
        )
        (fighter / "probe.st").write_text(states + f"""
[Statedef 190]
type = S
movetype = I
physics = N
anim = 190
ctrl = 0
[State 190, attack]
type = ChangeState
trigger1 = Time = 48
value = 200

[Statedef 200]
type = S
movetype = A
physics = N
anim = 200
ctrl = 0
velset = 0,0
[State 200, contact]
type = HitDef
trigger1 = Time = 0
attr = S,NA
damage = 10,2
guardflag = M
pausetime = 8,8
guard.pausetime = 8,8
ground.velocity = 0,0
guard.velocity = 0
sparkno = -1
guard.sparkno = -1
palfx.time = 4
palfx.add = {','.join(map(str, ADD))}
palfx.mul = {','.join(map(str, MUL))}
""", encoding="latin-1", newline="\r\n")
        idle_actions = "".join(
            f"[Begin Action {action}]\n{defense}0,{sprite},0,0,-1\n\n"
            for action, sprite in [(0, 0), (20, 0), (120, 0), (130, 0), (140, 0), (150, 2), (190, 3), (5000, 1)]
        )
        (fighter / "probe.air").write_text(idle_actions + f"""[Begin Action 200]
{defense}0,1,0,0,4
Clsn1: 1
Clsn1[0] = 0,-48,95,0
0,2,0,0,1
0,1,0,0,40
""")

    stage = (game / "stages/stage0.def").read_text(encoding="latin-1")
    for key, value in {"p1startx": -32, "p2startx": 32}.items():
        stage = re.sub(rf"^{key}\s*=.*$", f"{key} = {value}", stage, flags=re.M | re.I)
    (game / "stages/ktpal.def").write_text(stage, encoding="latin-1")


def xdotool(*args):
    return subprocess.check_output(["xdotool", *args], text=True, stderr=subprocess.DEVNULL).strip()


def sample(window):
    geometry = dict(line.split("=", 1) for line in xdotool("getwindowgeometry", "--shell", window).splitlines())
    x, y, width, height = (int(geometry[key]) for key in ("X", "Y", "WIDTH", "HEIGHT"))
    screen = ImageGrab.grab(xdisplay=os.environ["DISPLAY"]).convert("RGB")
    colors = []
    for center in (x + width * 4 // 10, x + width * 6 // 10):
        pixels = screen.crop((center - 10, y + height * 64 // 100,
                              center + 10, y + height * 74 // 100)).tobytes()
        colors.append(Counter(zip(pixels[0::3], pixels[1::3], pixels[2::3])).most_common(1)[0][0])
    return colors


def capture(game, guard, log_path):
    with log_path.open("wb") as log:
        process = subprocess.Popen([os.getenv("WINE", "wine"), "./mugen.exe", "ktpal1",
                                    "ktpal2", "-s", "ktpal"], cwd=game,
                                   stdout=log, stderr=subprocess.STDOUT)
        try:
            deadline = time.monotonic() + 50
            last = None
            while time.monotonic() < deadline and process.poll() is None:
                try:
                    window = xdotool("search", "--onlyvisible", "--name", "M.U.G.E.N").splitlines()[0]
                    last = sample(window)
                    if last == [READY, DEFENDER[0]]:
                        break
                except (IndexError, subprocess.CalledProcessError):
                    pass
                time.sleep(0.2)
            else:
                raise RuntimeError(f"MUGEN did not render both probe fighters. Last sample: {last}")
            xdotool("windowfocus", window)
            if guard:
                xdotool("keydown", "d")
            xdotool("key", "Pause")
            frames = []
            try:
                for tick in range(75):
                    xdotool("key", "Scroll_Lock")
                    time.sleep(0.045)
                    left, right = sample(window)
                    frames.append({"tick": tick, "attackerRgb": left, "defenderRgb": right})
            finally:
                if guard:
                    xdotool("keyup", "d")
            if not any(tuple(frame["attackerRgb"]) == ATTACKER[2] for frame in frames):
                raise RuntimeError(f"MUGEN did not render the attack frame. Samples: {frames}")
            return frames
        except Exception:
            for path in (log_path, game / "mugen.log"):
                if path.is_file():
                    print(path.read_text(encoding="latin-1", errors="replace")[-12000:], flush=True)
            raise
        finally:
            if process.poll() is None:
                process.terminate()
                try:
                    process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    process.kill()
                    process.wait()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("archive", type=Path, help="Original MUGEN 1.1b1 ZIP")
    parser.add_argument("--expected", type=Path, help="Check the contact window against a recorded trace")
    args = parser.parse_args()
    with args.archive.open("rb") as archive:
        if hashlib.file_digest(archive, "sha256").hexdigest() != ARCHIVE_SHA:
            parser.error("The archive does not match the original MUGEN 1.1b1 checksum")
    with TemporaryDirectory(prefix="kenjatime-mugen11-", ignore_cleanup_errors=True) as directory:
        root = Path(directory)
        os.environ["WINEPREFIX"] = str(root / "wine")
        with zipfile.ZipFile(args.archive) as archive:
            archive.extractall(root)
        game = root / "mugen-1.1b1"
        prepare(game)
        try:
            traces = {key: capture(game, key == "guard", root / f"{key}.log") for key in ("hit", "guard")}
        finally:
            subprocess.run(["wineserver", "-k"], check=False, timeout=10)
        if args.expected:
            expected = json.loads(args.expected.read_text())["probes"]
            for case, frames in traces.items():
                impact = next(i for i, frame in enumerate(frames) if frame["attackerRgb"] == ATTACKER[2])
                window = [[frame["tick"] - impact, list(frame["attackerRgb"]), list(frame["defenderRgb"])]
                          for frame in frames[impact - 1:impact + 14]]
                if window != expected[case]:
                    raise RuntimeError(f"Native {case} colors differ from the saved trace: {window}")
        print(json.dumps({"referenceSha256": ARCHIVE_SHA, "duration": 4, "hitPause": 8,
                          "add": ADD, "mul": MUL, "traces": traces}, indent=2))


if __name__ == "__main__":
    main()
