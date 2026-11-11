#!/usr/bin/env python3
"""Opt-in physical Android Core Preview validation; does NOT run on emulators.

Connect a phone with USB debugging enabled, then:
  python scripts/core/android-physical-qa.py --apk /path/app-debug.apk --seconds 90

This is a measurement harness, not a substitute for playing the original
character archives on-device. Original archives are never transferred unless
the user imports them into the app themselves.
"""
import argparse,json,subprocess,time,hashlib
from pathlib import Path
from datetime import datetime,timezone

APP="io.github.celerycore.kenjatime.core.preview"
ACTIVITY=APP+"/io.github.celerycore.kenjatime.MainActivity"
def adb(*args, timeout=25):
    result=subprocess.run(["adb",*args],capture_output=True,text=True,timeout=timeout)
    if result.returncode: raise RuntimeError("adb "+ " ".join(args)+": "+result.stderr[-400:])
    return result.stdout.strip()
def prop(name): return adb("shell","getprop",name)
def capture(name,*args): 
    try:return adb(*args,timeout=40)
    except Exception as e:return "Capture unavailable: "+str(e)
def main():
    p=argparse.ArgumentParser()
    p.add_argument("--apk",required=True,type=Path)
    p.add_argument("--seconds",type=int,default=90)
    p.add_argument("--output",type=Path,default=Path("work/core/android-physical-qa.json"))
    args=p.parse_args()
    if not 15<=args.seconds<=1200: p.error("--seconds must be 15..1200")
    apk=args.apk.resolve()
    if not apk.is_file():p.error("APK not found: "+str(apk))
    devices=[line for line in adb("devices").splitlines()[1:] if line.endswith("\tdevice")]
    if len(devices)!=1:p.error("Connect exactly one USB-debuggable Android device; got "+str(len(devices)))
    if prop("ro.kernel.qemu")=="1" or prop("ro.boot.qemu")=="1":p.error("This gate requires a REAL phone, not an emulator")
    version=prop("ro.build.version.release")
    model=prop("ro.product.model")
    abi=prop("ro.product.cpu.abi")
    print("Device:",model,"Android",version,"ABI",abi)
    adb("install","-r",str(apk),timeout=120)
    adb("shell","am","force-stop",APP)
    adb("shell","am","start","-n",ACTIVITY)
    print("Play Kenjatime on the phone now. The app and original character packs must be tested manually.")
    measurements=[]
    started=time.monotonic()
    while time.monotonic()-started<args.seconds:
        now=time.monotonic()
        measurements.append({
            "elapsed_s":round(now-started,1),
            "meminfo":capture("meminfo","shell","dumpsys","meminfo",APP),
            "gfxinfo":capture("gfxinfo","shell","dumpsys","gfxinfo",APP,"framestats"),
            "battery":capture("battery","shell","dumpsys","battery"),
            "thermal":capture("thermal","shell","dumpsys","thermalservice"),
        })
        time.sleep(min(10,max(0,args.seconds-(time.monotonic()-started))))
    result={
        "kind":"physical-android-core-preview",
        "captured_at":datetime.now(timezone.utc).isoformat(),
        "physical_device":True,
        "model":model,"android":version,"abi":abi,
        "apk_sha256":hashlib.sha256(apk.read_bytes()).hexdigest(),
        "package":APP,"duration_s":args.seconds,
        "measurements":measurements,
        "logcat":capture("logcat","logcat","-d","-t","1500"),
        "limitations":[
            "This script cannot prove a specific character move was used without manual gameplay evidence",
            "App dumpsys gfxinfo may omit Chromium WebView GPU timing; it is not a reliable FPS guarantee",
            "Observe touch, sound, heat and rendering on device before signing off"
        ]
    }
    args.output.parent.mkdir(parents=True,exist_ok=True)
    args.output.write_text(json.dumps(result,indent=2)+"\n")
    print("Physical-phone QA capture:",args.output)
if __name__=="__main__":main()
