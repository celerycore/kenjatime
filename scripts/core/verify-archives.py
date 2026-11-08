"""Exercise the independent preview's picker, worker, storage and byte exports."""
from pathlib import Path
from zipfile import ZipFile
from playwright.sync_api import sync_playwright
import functools, hashlib, http.server, io, json, shutil, subprocess, threading

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'work/core'
OUT.mkdir(parents=True, exist_ok=True)
subprocess.run(['node', 'scripts/generate-support-archives.mjs'], cwd=ROOT, check=True)
subprocess.run(['node', '--input-type=module', '-e', "import{readFileSync,writeFileSync}from'node:fs';import{unzipSync}from'fflate';import{rar4,rar5}from'./test/fixtures/rar-fixtures.js';const f=Object.entries(unzipSync(readFileSync('test/fixtures/multi-archive/fighter.zip')));for(const[n,fn]of[['rar4',rar4],['rar5',rar5]])writeFileSync('work/core/'+n+'.rar',fn(f));"], cwd=ROOT, check=True)

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args): pass

server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT / 'dist-core')))
threading.Thread(target=server.serve_forever, daemon=True).start()
base = f'http://127.0.0.1:{server.server_port}/core/index.html'
report = {'physicalAndroid': False, 'imports': [], 'errors': []}
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=shutil.which('chromium') or p.chromium.executable_path,
            headless=True, args=['--no-sandbox'])
        page = browser.new_page(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True, accept_downloads=True)
        page.on('pageerror', lambda error: report['errors'].append(str(error)))
        page.goto(base)
        page.wait_for_function("document.querySelector('#status').textContent==='Ready when you are.'")
        page.evaluate("""async()=>{
          const r=indexedDB.open('kenjatime.engine.library',2);
          await new Promise((yes,no)=>{r.onupgradeneeded=()=>r.result.createObjectStore('sentinel');r.onsuccess=yes;r.onerror=no;});
          const db=r.result,tx=db.transaction('sentinel','readwrite');tx.objectStore('sentinel').put('recovery library stays intact','value');
          await new Promise((yes,no)=>{tx.oncomplete=yes;tx.onerror=no;});db.close();
          localStorage.setItem('kenjatime.native.selection','recovery-selection');
        }""")

        def install(parts, password='', success=True):
            page.locator('.archive-options').evaluate('(e)=>e.open=true')
            page.locator('#archive-password').fill(password)
            with page.expect_file_chooser() as chooser:
                page.locator('#browse').click()
            assert chooser.value.is_multiple()
            assert page.locator('#engine-archive-file').get_attribute('accept') == '*/*'
            chooser.value.set_files(parts)
            page.wait_for_function("!document.querySelector('#browse').disabled", timeout=60000)
            if success:
                page.wait_for_function("document.querySelector('#status').textContent.startsWith('Archive installed')", timeout=60000)
                assert page.locator('#name').inner_text() == 'Archive Fixture'

        fixture = ROOT / 'test/fixtures/multi-archive'
        for fmt in ['zip', 'bzip2.zip', 'lzma.zip', '7z', 'tar', 'tar.gz', 'tar.bz2', 'tar.xz', 'tar.zst', 'cpio', 'sfx.zip']:
            path = fixture / ('fighter-sfx.zip' if fmt == 'sfx.zip' else 'fighter.' + fmt)
            name = 'cloud-download' if fmt == 'zip' else path.name
            install({'name': name, 'mimeType': 'application/octet-stream', 'buffer': path.read_bytes()})
            with page.expect_download() as saved:
                page.locator('.library-item').filter(has_text=name).last.get_by_role('button', name='Save archive', exact=True).click()
            assert Path(saved.value.path()).read_bytes() == path.read_bytes()
            report['imports'].append({'archive': fmt, 'parts': 1, 'downloadExact': True})
        for kind in ['rar4', 'rar5']:
            path = OUT / (kind + '.rar'); install(str(path))
            with page.expect_download() as saved:
                page.locator('.library-item').filter(has_text=path.name).last.get_by_role('button', name='Save archive', exact=True).click()
            assert Path(saved.value.path()).read_bytes() == path.read_bytes()
            report['imports'].append({'archive': kind, 'parts': 1, 'downloadExact': True})
        support = ROOT / 'work/support-archives'
        cases = json.loads((support / 'manifest.json').read_text())
        for case in cases:
            install([str(support / name) for name in reversed(case['parts'])], case['password'])
            with page.expect_download() as saved:
                page.locator('.library-item').filter(has_text=case['parts'][0]).last.get_by_role('button', name='Save archive', exact=True).click()
            payload = Path(saved.value.path()).read_bytes()
            if len(case['parts']) == 1:
                assert payload == (support / case['parts'][0]).read_bytes()
            else:
                with ZipFile(io.BytesIO(payload)) as z:
                    assert set(json.loads(z.read('kenjatime-volumes.json'))['parts']) == set(case['parts'])
                    for name in case['parts']: assert z.read(name) == (support / name).read_bytes()
            report['imports'].append({'archive': case['label'], 'parts': len(case['parts']), 'downloadExact': True})
        install({'name': 'saved-volumes.zip', 'mimeType': 'application/zip', 'buffer': payload})
        count = page.locator('#library-count').inner_text()
        install(str(support / cases[0]['parts'][0]), 'wrong', False)
        assert 'password' in page.locator('#status').inner_text().lower()
        assert page.locator('#library-count').inner_text() == count
        split = next(c for c in cases if c['label'] == 'split-7z')
        install([str(support / split['parts'][0]), str(support / split['parts'][2])], 'secret', False)
        assert 'missing' in page.locator('#status').inner_text().lower()
        assert page.locator('#library-count').inner_text() == count
        page.reload()
        page.wait_for_function("document.querySelector('#status').textContent==='Ready when you are.'")
        assert page.locator('#library-count').inner_text() == count
        page.locator('#reset-library').click()
        page.wait_for_function("document.querySelector('#status').textContent==='Ready when you are.'")
        assert page.locator('.library-item').count() == 0
        assert page.evaluate("""async()=>{const r=indexedDB.open('kenjatime.engine.library');await new Promise(y=>r.onsuccess=y);const db=r.result,q=db.transaction('sentinel').objectStore('sentinel').get('value');await new Promise(y=>q.onsuccess=y);db.close();return q.result;}""") == 'recovery library stays intact'
        assert page.evaluate("localStorage.getItem('kenjatime.native.selection')") == 'recovery-selection'
        assert not report['errors'], report['errors']
        report.update(bundleReimport=True, reloadPreservesImports=True, wrongPasswordPreservesLibrary=True,
            missingPartPreservesLibrary=True, independentResetPreservesRecoveryLibrary=True, arbitraryMimePicker=True)
        browser.close()
finally:
    server.shutdown(); server.server_close()
(OUT / 'archive-evidence.json').write_text(json.dumps(report, indent=2) + '\n')
print('PASS', len(report['imports']), 'independent imports and exact downloads; multipart, encryption, reset isolation and recovery')
