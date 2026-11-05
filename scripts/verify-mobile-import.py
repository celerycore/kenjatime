"""Exercise native mobile ZIP pickers against development or production URLs."""
from io import BytesIO
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import json
import os
from playwright.sync_api import sync_playwright

os.chdir(Path(__file__).resolve().parent.parent)
Path('work').mkdir(exist_ok=True)
output = BytesIO()
with ZipFile('public/kfm.zip') as source, ZipFile(output, 'w', ZIP_DEFLATED) as target:
    target.writestr('/', b'')
    target.writestr('/Phone/', b'')
    target.writestr('__MACOSX/._kfm.def', b'Apple metadata')
    for name in source.namelist():
        basename = name.rsplit('/', 1)[-1]
        if not basename:
            continue
        data = source.read(name)
        if basename == 'kfm.def':
            text = data.decode('cp1252')
            text = text.replace('stcommon = common1.cns', 'stcommon = ../../data/common1.cns')
            text = text.replace('sprite  = kfm.sff', r'sprite  = C:\Mugen\chars\kfm\kfm.sff')
            text = text.replace('cmd     = kfm.cmd', r'cmd     = C:\Mugen\chars\kfm\kfm.cmd')
            data = text.encode('cp1252')
        path = '/Phone/./' + basename
        if basename == 'kfm.sff':
            path = '/Phone/cache/../' + basename
        if basename == 'kfm.cns':
            path = 'Phone\\' + basename
        target.writestr(path, data)
zip_bytes = output.getvalue()
bad = BytesIO()
with ZipFile(bad, 'w', ZIP_DEFLATED) as z:
    z.writestr('../escape.def', '[Info]\nname=Unsafe')

results = []
with sync_playwright() as p:
    browser = p.chromium.launch(
        executable_path=os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium'),
        headless=True, args=['--no-sandbox'])
    for fallback in (False, True):
        context = browser.new_context(viewport={'width': 390, 'height': 844},
                                      is_mobile=True, has_touch=True, accept_downloads=True)
        if fallback:
            # Older phone browsers expose FileReader without Blob.arrayBuffer.
            context.add_init_script("Object.defineProperty(File.prototype,'arrayBuffer',{value:undefined})")
        page = context.new_page()
        errors, failures, samples = [], [], []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.on('requestfailed', lambda req: failures.append(req.url))
        page.on('response', lambda response: samples.append(response.url) if response.url.endswith('/kfm.zip') else None)
        page.goto(os.environ.get('MUGEN_TEST_URL', 'http://127.0.0.1:5173/'), wait_until='networkidle')
        assert page.locator('.tag i').inner_text() == '17'
        assert page.evaluate('document.documentElement.scrollWidth') <= 390

        def choose(selector, name, data, mime='application/octet-stream', keyboard=False):
            with page.expect_file_chooser() as pending:
                if keyboard:
                    page.locator(selector).focus()
                    page.locator(selector).press('Enter')
                else:
                    page.locator(selector).tap()
            pending.value.set_files({'name': name, 'mimeType': mime, 'buffer': data})

        choose('#upload', 'Phone-Character.ZIP', zip_bytes)
        page.wait_for_function("document.querySelector('#name').textContent==='Kung Fu Man'")
        assert 'Unsafe' not in page.locator('#status').inner_text()
        assert page.locator('#file').input_value() == ''
        page.locator('#training').tap()
        page.locator('#play').tap()
        page.locator('#reset').tap()
        page.locator('canvas').tap()
        page.keyboard.down('ArrowRight')
        page.evaluate("for(let i=0;i<50;i++)document.querySelector('#step').click()")
        page.keyboard.up('ArrowRight')
        page.evaluate("document.querySelector('#step').click()")
        page.keyboard.down('z')
        page.evaluate("document.querySelector('#step').click()")
        page.keyboard.up('z')
        page.evaluate("for(let i=0;i<20;i++)document.querySelector('#step').click()")
        with page.expect_download() as pending:
            page.locator('#export-report').tap()
        report_path = 'work/mobile-import-' + ('filereader' if fallback else 'modern') + '.json'
        pending.value.save_as(report_path)
        report = json.loads(Path(report_path).read_text())
        assert report['opponent']['life'] == 977, report['opponent']
        page.locator('#lab').tap()

        choose('#browse', 'broken.zip', bad.getvalue())
        page.wait_for_function("document.querySelector('#status').textContent.includes('Unsafe archive path: ../escape.def')")
        assert page.locator('#name').inner_text() == 'Kung Fu Man'
        assert page.locator('#file').input_value() == ''
        choose('#browse', 'broken.zip', b'RAR archive')
        page.wait_for_function("document.querySelector('#status').textContent.includes('Choose a ZIP archive')")
        assert page.locator('#name').inner_text() == 'Kung Fu Man'
        # Retry the same filename after a failure, using a generic provider MIME.
        choose('#upload', 'broken.zip', zip_bytes, mime='', keyboard=True)
        page.wait_for_function("document.querySelector('#status').textContent.includes('Imported')")
        assert page.locator('#file').input_value() == ''
        with page.expect_response('**/kfm.zip') as response:
            page.locator('#sample').tap()
        assert response.value.ok
        page.wait_for_function("document.querySelector('#status').textContent.includes('Imported')")
        page.wait_for_timeout(200)
        assert samples, 'Sample archive was not fetched'
        assert page.locator('.legacy-arena').get_attribute('href') == './arena/'
        page.screenshot(path='work/mobile-import-' + str(fallback) + '.png', full_page=True)
        assert not errors, errors
        assert not failures, failures
        results.append({'fileReaderFallback': fallback, 'punchDamage': 1000-report['opponent']['life'],
                        'unsafeEntryBlocked': True, 'retryPassed': True, 'sampleURL': samples[-1],
                        'errors': errors, 'failedRequests': failures})
        context.close()
    browser.close()
Path('work/browser-mobile-import-result.json').write_text(json.dumps(results, indent=2))
print(json.dumps(results))
