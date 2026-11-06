"""Verify native APK provenance, JNI signatures, assets, manifest and host-side tests."""
from pathlib import Path
from zipfile import ZipFile
from collections import Counter
import hashlib,io,json,os,re,subprocess,tempfile,xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parent.parent
os.chdir(ROOT)
apk=Path(os.environ.get('NATIVE_APK_PATH','native-android/app/build/outputs/apk/debug/app-debug.apk'))
sdk=Path(os.environ['ANDROID_HOME'])/'build-tools/36.0.0'
signature=subprocess.check_output([sdk/'apksigner','verify','--print-certs',apk],text=True)
signer=re.search(r'Signer #1 certificate SHA-256 digest: ([0-9a-f]+)',signature).group(1)
badging=subprocess.check_output([sdk/'aapt','dump','badging',apk],text=True)
assert "name='io.github.celerycore.kenjatime.nativeprototype'" in badging
assert "versionName='0.1.0'" in badging and "versionCode='1'" in badging
assert "sdkVersion:'34'" in badging and "targetSdkVersion:'36'" in badging
assert "native-code: 'arm64-v8a'" in badging
assert 'maxSdkVersion:' not in badging
assert "launchable-activity: name='io.github.celerycore.kenjatime.nativeprototype.LauncherActivity'" in badging
assert not any(p in badging for p in ['MANAGE_EXTERNAL_STORAGE','READ_EXTERNAL_STORAGE','WRITE_EXTERNAL_STORAGE','RECORD_AUDIO','BLUETOOTH_CONNECT','android.permission.INTERNET'])

provenance=json.loads(Path('native-android/generated/assets/native-provenance.json').read_text())
assert max(item['androidApiBuildNote'] for item in provenance['libraries'])<=34
release=Path('work/ikemen-native/Ikemen_GO-v1.0.0-android.zip')
assert hashlib.sha256(release.read_bytes()).hexdigest()==provenance['releaseSha256']
with ZipFile(release) as z:original_bytes=z.read(next(n for n in z.namelist() if n.endswith('.apk')))
assert hashlib.sha256(original_bytes).hexdigest()==provenance['upstreamApkSha256']

def native_methods(z,folder):
    methods=set()
    for name in z.namelist():
        if not name.endswith('.dex'):continue
        dest=folder/name;dest.write_bytes(z.read(name))
        xml=subprocess.check_output([sdk/'dexdump','-l','xml',dest],text=True)
        for package in ET.fromstring(xml).findall('package'):
            if package.get('name')!='org.libsdl.app':continue
            for cls in package.findall('class'):
                for method in cls.findall('method'):
                    if method.get('native')=='true':methods.add((cls.get('name'),method.get('name'),method.get('return'),method.get('static'),tuple(p.get('type') for p in method.findall('parameter'))))
    return methods

with ZipFile(apk) as candidate,ZipFile(io.BytesIO(original_bytes)) as original,tempfile.TemporaryDirectory(dir='work') as temp:
    count=0
    for item in provenance['libraries']:
        name='lib/'+item['name'];data=candidate.read(name)
        assert data==original.read(name),name
        assert hashlib.sha256(data).hexdigest()==item['sha256'],name
        assert data[:4]==b'\x7fELF' and int.from_bytes(data[18:20],'little')==183
    assert len(provenance['libraries'])==10
    for file in Path('native-android/generated/assets').rglob('*'):
        if file.is_file():assert candidate.read('assets/'+file.relative_to('native-android/generated/assets').as_posix())==file.read_bytes();count+=1
    assert not any(n.startswith('assets/public/') or 'capacitor' in n.lower() for n in candidate.namelist())
    a=Path(temp)/'upstream';b=Path(temp)/'candidate';a.mkdir();b.mkdir()
    before=native_methods(original,a);after=native_methods(candidate,b)
    assert before and before==after,{'missing':list(before-after),'extra':list(after-before)}

ns='{http://schemas.android.com/apk/res/android}'
manifest=ET.parse('native-android/app/src/main/AndroidManifest.xml').getroot()
game=next(a for a in manifest.find('application').findall('activity') if a.get(ns+'name')=='.GameActivity')
assert game.get(ns+'exported')=='false' and game.get(ns+'process')==':engine'
lint=ET.parse('native-android/app/build/reports/lint-results-debug.xml').getroot().findall('issue')
assert not [i.get('id') for i in lint if i.get('severity') in ['Error','Fatal']]
tests=[]
for file in Path('native-android/app/build/test-results/testDebugUnitTest').glob('TEST-*.xml'):
    root=ET.parse(file).getroot();tests.append({k:root.get(k) for k in ['name','tests','failures','errors','skipped']})
assert tests and sum(int(t['tests']) for t in tests)==14
assert all(int(t[k])==0 for t in tests for k in ['failures','errors','skipped'])
record={'applicationId':'io.github.celerycore.kenjatime.nativeprototype','version':'0.1.0','versionCode':1,'apkBytes':apk.stat().st_size,'apkSha256':hashlib.sha256(apk.read_bytes()).hexdigest(),'signerSha256':signer,'signatureVerified':True,'minSdk':34,'targetSdk':36,'abi':'arm64-v8a','nativeLibrariesMatchOfficialRelease':10,'exportedJniSignaturesMatch':len(before),'bundledAssetsMatchPreparedFiles':count,'nativeGameProcess':':engine','webViewBattleView':False,'tests':tests,'lint':{'errors':0,'warningCounts':dict(Counter(i.get('id') for i in lint)),'scopedVendorSuppressions':'native-android/lint.xml'},'engine':provenance,'phoneExecution':False,'phoneFpsMeasured':False,'scope':'Native ARM64 execution requires an Android phone. Robolectric verifies launcher, assets, imports, rollback, limits, locking and audio permission handling; it does not execute the game engine.'}
Path('work/native-android-evidence.json').write_text(json.dumps(record,indent=2)+'\n')
print(json.dumps({k:v for k,v in record.items() if k not in ['engine','tests']}))
