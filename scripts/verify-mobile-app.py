"""Verify the bundled Android UI in a mobile browser; native APK checks run separately."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json, os

os.chdir(Path(__file__).resolve().parent.parent)
Path('work').mkdir(exist_ok=True)
url=os.environ.get('MUGEN_MOBILE_URL','http://127.0.0.1:5186/next/mobile/?perf=1')
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,accept_downloads=True)
    page=context.new_page();errors=[];external=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('request',lambda r:external.append(r.url) if not r.url.startswith(('http://127.0.0.1:5186/','blob:','data:')) else None)
    page.goto(url,wait_until='networkidle');page.wait_for_function("document.querySelector('#name').textContent==='Kung Fu Man'")
    assert page.locator('#graphics-mode').input_value()=='low'
    assert not page.locator('.mobile-battle-bar').is_visible()
    page.locator('.mobile-library summary').click()
    assert page.locator('#library-count').inner_text()=='0'
    def import_file(name,data):
        before=int(page.locator('#count').inner_text())
        with page.expect_file_chooser() as chooser:page.locator('#upload').tap()
        chooser.value.set_files({'name':name,'mimeType':'application/octet-stream','buffer':data})
        page.wait_for_function('n=>Number(document.querySelector("#count").textContent)>n',arg=before)
        page.wait_for_function('!document.querySelector("#file").disabled')
    import_file('My Fighter.zip',Path('public/kfm.zip').read_bytes())
    page.wait_for_function("document.querySelector('#library-count').textContent==='1'")
    page.reload(wait_until='networkidle');page.wait_for_function("document.querySelector('#name').textContent==='Kung Fu Man'")
    page.wait_for_function("document.querySelector('#library-count').textContent==='1'")
    assert int(page.locator('#count').inner_text())==1
    page.locator('.mobile-library summary').click();page.locator('#library-items button',has_text='Open').click()
    page.wait_for_function("Number(document.querySelector('#count').textContent)===2")
    page.wait_for_function('!document.querySelector("#file").disabled')
    assert page.locator('#library-count').inner_text()=='1'
    # Failure must leave both the saved library and current roster usable.
    page.locator('#file').set_input_files({'name':'bad.rar','mimeType':'','buffer':b'not an archive'})
    page.wait_for_function("document.querySelector('#status').textContent.includes('Choose a ZIP or RAR')")
    assert page.locator('#library-count').inner_text()=='1'
    page.locator('#library-remember').uncheck();import_file('Session only.zip',Path('public/kfm.zip').read_bytes())
    assert page.locator('#library-count').inner_text()=='1'
    page.locator('#library-remember').check()
    rar=os.environ.get('MUGEN_TOMOKA_RAR')
    if rar:
        import_file('Tomoka.rar',Path(rar).read_bytes());page.wait_for_function("document.querySelector('#library-count').textContent==='2'")
        assert page.locator('#name').inner_text()=='Tomoka'
    page.locator('#cards [data-id="0"]').click();page.locator('#arena-mode').select_option('training')
    page.evaluate('window.__kenjatimePerformance.benchmark({frames:1,ticksPerFrame:0})');page.locator('#reset').click()
    def steps(n):page.evaluate('(n)=>{for(let i=0;i<n;i++)document.querySelector("#step").click()}',n)
    def report():
        return page.evaluate('''async()=>{let blob;const url=URL.createObjectURL,click=HTMLAnchorElement.prototype.click;URL.createObjectURL=b=>{blob=b;return 'blob:test'};HTMLAnchorElement.prototype.click=function(){};try{document.querySelector('#export-report').click();return JSON.parse(await blob.text())}finally{URL.createObjectURL=url;HTMLAnchorElement.prototype.click=click}}''')
    page.set_viewport_size({'width':844,'height':390});page.locator('#mobile-enter').tap()
    assert page.locator('body').evaluate("e=>e.classList.contains('mobile-battle')")
    cdp=context.new_cdp_session(page)
    def point(selector):
        box=page.locator(selector).bounding_box();assert box and box['x']>=0 and box['y']>=0 and box['x']+box['width']<=844 and box['y']+box['height']<=390,box
        return {'id':1,'x':box['x']+box['width']/2,'y':box['y']+box['height']/2}
    cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[point('.touch-dpad [data-input="R"]')]});steps(50)
    cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});steps(1)
    page.locator('.touch-buttons [data-input="x"]').tap();steps(26)
    hit=report();assert hit['opponent']['life']==977,hit['opponent']['life']
    for button in page.locator('.touch-controls button').all():
        box=button.bounding_box();assert box and box['x']>=0 and box['y']>=0 and box['x']+box['width']<=844 and box['y']+box['height']<=390,box
    # Simulate the native lifecycle event while an input is held and play is active.
    page.locator('#mobile-pause').tap()
    cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[point('.touch-dpad [data-input="R"]')]})
    page.evaluate("window.dispatchEvent(new CustomEvent('kenjatime:app-state',{detail:{active:false}}));window.__kenjatimePerformance.reset()")
    page.wait_for_timeout(250);background=page.evaluate('window.__kenjatimePerformance.snapshot()')
    assert background['ticks']==background['drawCalls']==0,background
    assert page.locator('.touch-controls .pressed').count()==0
    page.evaluate("window.dispatchEvent(new CustomEvent('kenjatime:app-state',{detail:{active:true}}))")
    page.wait_for_timeout(250);assert page.evaluate('window.__kenjatimePerformance.snapshot().ticks')==0
    assert page.locator('#mobile-pause').inner_text()=='Resume'
    cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
    steps(1);assert not report()['player']['rawInput']
    page.screenshot(path='work/android-ui-landscape.png')
    page.locator('#mobile-menu').tap();assert not page.locator('body').evaluate("e=>e.classList.contains('mobile-battle')")
    assert not page.locator('.mobile-battle-bar').is_visible()
    page.set_viewport_size({'width':390,'height':844});assert page.evaluate('document.documentElement.scrollWidth')<=390
    page.locator('.mobile-library summary').click() if not page.locator('.mobile-library').evaluate('e=>e.open') else None
    page.screenshot(path='work/android-ui-portrait.png',full_page=True)
    with page.expect_download() as download:page.locator('#export-report').click()
    path=Path('work/android-ui-report.json');download.value.save_as(path);assert json.loads(path.read_text())['graphics']['mode']=='low'
    with page.expect_download() as download:page.locator('#export-scripts').click()
    download.value.save_as('work/android-ui-scripts.zip')
    before=int(page.locator('#library-count').inner_text());page.locator('#library-items button',has_text='Delete').first.click()
    page.wait_for_function('n=>Number(document.querySelector("#library-count").textContent)===n-1',arg=before)
    page.reload(wait_until='networkidle');page.wait_for_function('n=>Number(document.querySelector("#library-count").textContent)===n-1',arg=before)
    assert not errors and not external,(errors,external)
    result={'defaultGraphics':'low','librarySavedReopenedAfterReload':True,'libraryDeletePersisted':True,'invalidImportPreservesLibrary':True,'sessionOnlyImport':True,'actualRarImported':bool(rar),'landscapeControlsInsideViewport':True,'touchPunchDamage':23,'backgroundTicks':background['ticks'],'backgroundDraws':background['drawCalls'],'foregroundRemainsPaused':True,'reportAndScriptBrowserExports':True,'externalRequests':external,'errors':errors,'scope':'Chromium mobile UI and real IndexedDB; not a physical Android/WebView or native share-sheet test.'}
    Path('work/mobile-app-browser-evidence.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result));browser.close()
