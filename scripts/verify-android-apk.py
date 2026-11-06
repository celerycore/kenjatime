"""Check the built APK signature, launch metadata and exact bundled offline assets."""
from pathlib import Path
from zipfile import ZipFile
import hashlib,json,os,re,subprocess,xml.etree.ElementTree as ET

os.chdir(Path(__file__).resolve().parent.parent)
apk=Path(os.environ.get('APK_PATH','android/app/build/outputs/apk/debug/app-debug.apk'))
sdk=Path(os.environ.get('ANDROID_HOME',os.environ.get('ANDROID_SDK_ROOT','')))
tools=sdk/'build-tools/36.0.0'
if not (tools/'apksigner').is_file():raise SystemExit('Set ANDROID_HOME to the Android SDK with build-tools 36.0.0 installed.')
signing=subprocess.check_output([str(tools/'apksigner'),'verify','--print-certs',str(apk)],text=True)
signer=re.search(r'Signer #1 certificate SHA-256 digest: ([0-9a-f]+)',signing).group(1)
badging=subprocess.check_output([str(tools/'aapt'),'dump','badging',str(apk)],text=True)
gradle=Path('android/app/build.gradle').read_text()
version=re.search(r'versionName\s+"([^"]+)"',gradle).group(1)
version_code=int(re.search(r'versionCode\s+(\d+)',gradle).group(1))
assert f"versionName='{version}'" in badging and f"versionCode='{version_code}'" in badging
assert "name='io.github.celerycore.kenjatime'" in badging and "sdkVersion:'24'" in badging and "targetSdkVersion:'36'" in badging
assert "launchable-activity: name='io.github.celerycore.kenjatime.MainActivity'" in badging
with ZipFile(apk) as z:
    config=json.loads(z.read('assets/capacitor.config.json'))
    assert config==json.loads(Path('capacitor.config.json').read_text())
    server=config['server']
    # Capacitor concatenates this path directly with its origin. A relative path
    # produces localhostmobile, while /mobile/ invokes the root index fallback.
    assert server['appStartPath']=='/mobile/index.html', 'Use the absolute, explicit mobile entry file.'
    assert not server.get('url'), 'The Android app must start from its bundled assets.'
    startup_url=f"{server.get('androidScheme','https')}://{server.get('hostname','localhost')}{server['appStartPath']}"
    assert startup_url=='https://localhost/mobile/index.html'
    # AAPT intentionally excludes the GitHub Pages marker; it is not a runtime asset.
    files=[p for p in Path('dist').rglob('*') if p.is_file() and p.relative_to('dist').as_posix()!='.nojekyll']
    for p in files:assert z.read('assets/public/'+p.relative_to('dist').as_posix())==p.read_bytes(),p
    assert 'assets/public/mobile/index.html' in z.namelist()
    assert b'data-mobile-app="true"' in z.read('assets/public/mobile/index.html')
    assert any(n.endswith('.wasm') for n in z.namelist())
    archives=[n for n in z.namelist() if n.endswith(('.zip','.rar'))]
    assert archives==['assets/public/kfm.zip'],archives
lint=Path('android/app/build/reports/lint-results-debug.xml')
issues=[{'id':i.get('id'),'severity':i.get('severity'),'message':i.get('message')} for i in ET.parse(lint).getroot().findall('issue')]
assert all(i['severity'] not in ['Error','Fatal'] for i in issues),issues
result={'package':'io.github.celerycore.kenjatime','version':version,'versionCode':version_code,'startupUrl':startup_url,'apkBytes':apk.stat().st_size,'apkSha256':hashlib.sha256(apk.read_bytes()).hexdigest(),'signatureVerified':True,'signerSha256':signer,'minSdk':24,'targetSdk':36,'minimumWebView':107,'bundledWebFilesMatchDist':len(files),'onlyBundledCharacterArchive':'kfm.zip','lint':{'errors':0,'warnings':issues},'deviceTesting':'Packaging checks do not execute Android or measure phone FPS.'}
Path('work').mkdir(exist_ok=True);Path('work/mobile-apk-evidence.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result))
