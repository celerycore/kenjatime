"""Verify the independent APK launch, signature and exact offline web assets."""
from pathlib import Path
from zipfile import ZipFile
import hashlib, json, os, re, subprocess
ROOT = Path(__file__).resolve().parents[2]
apk = Path(os.environ.get('APK_PATH', ROOT / 'android/app/build/outputs/apk/debug/app-debug.apk'))
tools = Path(os.environ['ANDROID_HOME']) / 'build-tools/36.0.0'
signing = subprocess.check_output([str(tools / 'apksigner'), 'verify', '--print-certs', str(apk)], text=True)
certificate = re.search(r'Signer #1 certificate SHA-256 digest: ([0-9a-f]+)', signing).group(1)
badging = subprocess.check_output([str(tools / 'aapt'), 'dump', 'badging', str(apk)], text=True)
assert "name='io.github.celerycore.kenjatime.core.preview'" in badging
assert "versionName='0.5.0-core-preview'" in badging and "versionCode='1'" in badging
assert "application-label:'Kenjatime Core Preview'" in badging
assert "launchable-activity: name='io.github.celerycore.kenjatime.MainActivity'" in badging
expected_config = json.loads((ROOT / 'capacitor.core.config.json').read_text())
with ZipFile(apk) as z:
    config = json.loads(z.read('assets/capacitor.config.json'))
    assert config == expected_config
    assert config['server']['appStartPath'] == '/core/index.html'
    assert config['server']['hostname'] == 'localhost' and not config['server'].get('url')
    assert b'data-mobile-app="true"' in z.read('assets/public/core/index.html')
    files = [p for p in (ROOT / 'dist-core').rglob('*') if p.is_file()
        and not any(part.startswith('.') for part in p.relative_to(ROOT / 'dist-core').parts)]
    expected = set()
    for path in files:
        name = path.relative_to(ROOT / 'dist-core').as_posix(); expected.add(name)
        assert z.read('assets/public/' + name) == path.read_bytes(), name
    actual = {name.removeprefix('assets/public/') for name in z.namelist()
        if name.startswith('assets/public/') and not name.endswith('/')}
    assert not actual - expected - {'cordova.js', 'cordova_plugins.js'}, actual - expected
    assert not any(re.search(r'ikemen|wasm_exec|/engine/|\.so$', name, re.I) for name in z.namelist())
    proof = json.loads(z.read('assets/public/provenance.json'))
    assert proof['independentRuntime'] and not proof['externalEnginePayloads']
    for name, item in proof['files'].items():
        assert hashlib.sha256(z.read('assets/public/' + name)).hexdigest() == item['sha256'], name
    assert z.read('assets/public/NOTICES.txt')
report = {'applicationId': expected_config['appId'], 'version': '0.5.0-core-preview',
    'bytes': apk.stat().st_size, 'sha256': hashlib.sha256(apk.read_bytes()).hexdigest(),
    'certificateSha256': certificate, 'offlineAssetsMatchWebBuild': True, 'bundledFiles': len(files),
    'startupUrl': 'https://localhost/core/index.html', 'separateRecoveryInstallation': True,
    'externalEnginePayloads': False, 'physicalPhoneTest': False}
(ROOT / 'work/core/android-evidence.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report, indent=2))
