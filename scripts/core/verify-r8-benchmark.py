"""End-to-end smoke test for the isolated PR17 benchmark UI and CSV capture."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import functools, http.server, json, shutil, threading

ROOT = Path(__file__).resolve().parents[2]
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args): pass

server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT / 'dist-core')))
threading.Thread(target=server.serve_forever, daemon=True).start()
base = f'http://127.0.0.1:{server.server_port}/core/index.html'
summary = {'preview': 'r8-benchmark-pr17', 'checks': {}}
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=shutil.which('chromium') or p.chromium.executable_path,
            headless=True,
            args=['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
        page = browser.new_page(viewport={'width': 1100, 'height': 850}, accept_downloads=True)
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(base)
        page.wait_for_function("document.querySelector('#status')?.textContent === 'Ready when you are.'", timeout=30000)
        assert page.title() == 'Kenjatime Core · PR #17 R8 Benchmark'
        assert page.locator('#kenjatime-r8-benchmark').count() == 1
        assert page.locator('#core-qa-guide').count() == 1
        assert page.locator('#endless-mode').count() == 1
        assert not page.locator('#endless-mode').is_checked()
        assert page.locator('#browse').count() == 1
        assert page.locator('#browse-split').count() == 1
        assert page.locator('#browse-all').count() == 1
        # The primary archive chooser must no longer request unrestricted
        # multi-selection, which can open Android's photo/gallery providers.
        for button, multi, generic in [
            ('#browse', False, False),
            ('#browse-split', True, False),
            ('#browse-all', False, True),
        ]:
            with page.expect_file_chooser() as chooser_event:
                page.locator(button).click()
            chooser = chooser_event.value
            assert chooser.is_multiple() is multi, button
            accept = page.locator('#engine-archive-file').get_attribute('accept')
            assert (accept == '*/*') is generic, (button, accept)
            if not generic:
                assert all(ext in accept for ext in ['.zip', '.rar', '.7z'])
            # Simulate user cancellation without importing an actual archive.
            page.locator('#engine-archive-file').evaluate(
                '(el) => el.dispatchEvent(new Event("cancel"))')
            page.wait_for_function("!document.querySelector('#engine-archive-file')")
            page.wait_for_function("!document.querySelector('#browse').disabled")
        summary['checks']['androidDocumentPicker'] = True
        summary['checks']['isolatedLabel'] = True

        page.locator('#arena-mode').select_option('cpu')
        page.locator('#endless-mode').check()
        assert page.locator('#endless-mode').is_checked()
        page.locator('#fight-now').click()
        page.wait_for_function('window.__kenjatimeCoreBattle?.gpu()?.frames > 10', timeout=40000)
        page.locator('[data-r8-start]').click()
        page.wait_for_function('window.__kenjatimeR8Benchmark.snapshot().samples >= 3', timeout=20000)
        snapshot = page.evaluate('window.__kenjatimeR8Benchmark.snapshot()')
        gpu = page.evaluate('window.__kenjatimeCoreBattle.gpu()')
        assert snapshot['recording'] and snapshot['samples'] >= 3
        assert 'indexedTextureBytes' in gpu and 'paletteTextureBytes' in gpu
        assert gpu['textureBytes'] >= gpu['indexedTextureBytes'] + gpu['paletteTextureBytes']
        assert gpu['textureEvictions'] >= 0
        state = page.evaluate('window.__kenjatimeCoreBattle.snapshot()')
        assert state['endlessMode'] is True and state['roundTimeLeft'] == -1, state
        summary['checks']['endlessRules'] = {'enabled':state['endlessMode'], 'round':state['roundNo'], 'timeLeft':state['roundTimeLeft']}
        summary['checks']['r8Telemetry'] = {
            'samples': snapshot['samples'],
            'gpuRawResidentBytes': gpu['textureBytes'],
            'indexedBytes': gpu['indexedTextureBytes'],
            'paletteBytes': gpu['paletteTextureBytes'],
        }
        page.locator('[data-r8-stop]').click()
        assert page.locator('[data-r8-export]').is_enabled()
        csv = page.evaluate('window.__kenjatimeR8Benchmark.csv()')
        assert 'r8_index_mib' in csv and 'missing_palette_draws' in csv and 'endless_mode' in csv and 'round_number' in csv and len(csv.splitlines()) >= 4
        with page.expect_download() as downloaded:
            page.locator('[data-r8-export]').click()
        item = downloaded.value
        assert item.suggested_filename.startswith('kenjatime-r8-pr17-benchmark-')
        summary['checks']['csvExport'] = True
        assert not errors, errors
        page.locator('[data-menu]').click()
        browser.close()
    print(json.dumps(summary, indent=2))
finally:
    server.shutdown()
