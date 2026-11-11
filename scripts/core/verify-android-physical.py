#!/usr/bin/env python3
"""ADB smoke test on a *physical* Android phone only; refuses emulators.

Launches the independent Core Preview, captures Android process/memory/gfx
evidence and crash logs, and requests a manually controlled KFM fight. Android
UI frame stats do NOT measure the game's WebGL2 frame rate or native parity.
"""
import argparse, json, re, subprocess, time
from pathlib import Path
from datetime import datetime, timezone

PACKAGE='io.github.celerycore.kenjatime.core.preview'
ACTIVITY='io.github.celerycore.kenjatime.MainActivity'

def run(*cmd,timeout=35,check=True):
    p=subprocess.run(cmd,capture_output=True,text=True,timeout=timeout)
    if check and p.returncode: raise RuntimeError(f'{cmd!r}: {p.stderr or p.stdout}')
    return p.stdout

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--serial');p.add_argument('--apk')
    p.add_argument('--seconds',type=int,default=30)
    p.add_argument('--output',type=Path,default=Path('work/core/android-physical-device'))
    o=p.parse_args()
    if not 10<=o.seconds<=120:p.error('seconds must be 10..120')
    devices=[]
    for line in run('adb','devices','-l').splitlines()[1:]:
        a=line.split()
        if len(a)>1 and a[1]=='device':devices.append(a[0])
    if not devices:raise SystemExit('BLOCKED: no authorized Android device connected')
    if o.serial and o.serial not in devices:raise SystemExit('BLOCKED: requested ADB serial not present')
    if not o.serial and len(devices)!=1:raise SystemExit('BLOCKED: choose one device with --serial')
    serial=o.serial or devices[0]
    adb=lambda *args,**kw:run('adb','-s',serial,*args,**kw)
    if (serial.startswith('emulator-') or adb('shell','getprop','ro.kernel.qemu').strip()=='1'
        or adb('shell','getprop','ro.hardware').strip().lower() in ['ranchu','goldfish']):
        raise SystemExit('BLOCKED: physical Android phone required, not an emulator')
    keys=['ro.product.model','ro.product.manufacturer','ro.build.version.release','ro.build.version.sdk','ro.hardware','ro.build.fingerprint']
    props={key:adb('shell','getprop',key).strip() for key in keys}
    o.output.mkdir(parents=True,exist_ok=True)
    if o.apk:adb('install','-r',o.apk,timeout=110)
    adb('logcat','-c')
    start=adb('shell','am','start','-W','-n',ACTIVITY)
    print('Start a KFM training fight and exercise movement, attack, camera and audio on your phone.')
    time.sleep(o.seconds)
    pid=adb('shell','pidof',PACKAGE).strip()
    if not pid:raise SystemExit('FAIL: Core Preview app process exited')
    gfx=adb('shell','dumpsys','gfxinfo',PACKAGE,'framestats')
    mem=adb('shell','dumpsys','meminfo',PACKAGE)
    log=adb('logcat','-d','-v','time',check=False)
    adb('shell','screencap','-p','/sdcard/Download/kenjatime-core-proof.png')
    adb('pull','/sdcard/Download/kenjatime-core-proof.png',str(o.output/'screenshot.png'))
    for name,body in [('gfxinfo.txt',gfx),('meminfo.txt',mem),('logcat.txt',log),('am-start.txt',start)]:
        (o.output/name).write_text(body)
    ps=re.search(r'\bTOTAL PSS:\s*(\d+)',mem)
    fatals=[x for x in log.splitlines() if 'FATAL EXCEPTION' in x or 'Fatal signal' in x]
    report={'timestamp':datetime.now(timezone.utc).isoformat(),'physicalPhone':True,
      'package':PACKAGE,'serial':serial,'device':props,'observedSeconds':o.seconds,
      'pid':pid,'totalPssKiB':int(ps.group(1)) if ps else None,
      'fatalEntries':fatals[:15],'webglFramesPerSecond':None,
      'nativeMugenParity':None,'note':'Manual KFM play requested; ADB alone does not verify exact gameplay inputs or WebGL2 FPS.'}
    (o.output/'evidence.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps(report,indent=2))
    if fatals:raise SystemExit('FAIL: native crash found')
    print('PASS: physical-device launch/process smoke check; game parity and FPS remain separate.')
if __name__=='__main__':main()
