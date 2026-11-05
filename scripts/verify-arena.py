"""Check the built arena, large worker imports, script exports and touch combat."""
from pathlib import Path
from zipfile import ZipFile, ZIP_STORED
import json
import os
from playwright.sync_api import sync_playwright, expect

os.chdir(Path(__file__).resolve().parent.parent)
Path('work').mkdir(exist_ok=True)
fixture=Path('work/large-arena-fixture.zip')
with ZipFile('public/kfm.zip') as source, ZipFile(fixture,'w',ZIP_STORED) as target:
    for name in source.namelist():
        data=source.read(name)
        if name=='kfm/kfm.def':data=data.replace(b'Kung Fu Man',b'Large ZIP Fixture')
        target.writestr(name,data)
    target.writestr('unrelated-bank.bin',bytes(55*1024*1024))
assert fixture.stat().st_size>50*1024*1024
url=os.environ.get('MUGEN_ARENA_URL','http://127.0.0.1:5184/kenjatime/arena/')
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,accept_downloads=True)
    page=context.new_page();errors=[];failures=[];workers=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    page.on('requestfailed',lambda req:failures.append(req.url))
    page.on('worker',lambda worker:workers.append(worker.url))
    page.goto(url,wait_until='networkidle')
    page.wait_for_function("document.querySelector('#name').textContent==='Kung Fu Man'")
    assert page.locator('.tag i').inner_text()=='16'
    assert page.locator('#match-mode').input_value()=='match'
    assert page.locator('#dummy-mode').input_value()=='cpu'
    assert page.evaluate('document.documentElement.scrollWidth')<=390
    page.evaluate('window.importTicks=0;window.importInterval=setInterval(()=>window.importTicks++,20)')
    with page.expect_file_chooser() as pending:page.locator('#upload').tap()
    pending.value.set_files(str(fixture))
    page.wait_for_function("document.querySelector('#name').textContent==='Large ZIP Fixture'",timeout=60000)
    heartbeat=page.evaluate('clearInterval(window.importInterval);window.importTicks')
    assert heartbeat>0
    assert len(workers)>=2,workers
    page.locator('#arena-mode').select_option('training')
    page.locator('#fight-now').tap()
    assert page.locator('#play').get_attribute('aria-label')=='Pause'
    page.locator('#play').tap();page.locator('#reset').tap()
    def steps(n):page.evaluate('(n)=>{for(let i=0;i<n;i++)document.querySelector("#step").click()}',n)
    cdp=context.new_cdp_session(page)
    def point(selector,identifier):
        page.locator(selector).scroll_into_view_if_needed();box=page.locator(selector).bounding_box()
        return {'id':identifier,'x':box['x']+box['width']/2,'y':box['y']+box['height']/2}
    right=point('.touch-dpad [data-input="R"]',1)
    cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[right]});steps(50)
    cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});steps(1)
    attack=point('.touch-buttons [data-input="x"]',2)
    cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[attack]});steps(1)
    cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});steps(25)
    assert page.locator('#p2life').evaluate('(el)=>el.value')==977
    assert page.locator('.touch-controls .pressed').count()==0
    # A diagonal plus an attack can be held by two independent fingers.
    diagonal=point('.touch-dpad [data-input="R D"]',3)
    attack=point('.touch-buttons [data-input="a"]',4)
    cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[diagonal,attack]});steps(1)
    with page.expect_download() as pending:page.locator('#export-report').evaluate('(el)=>el.click()')
    pending.value.save_as('work/arena-touch-report.json')
    report=json.loads(Path('work/arena-touch-report.json').read_text())
    assert set(report['player']['rawInput'])=={'R','D','a'},report['player']
    cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[attack]})
    assert page.locator('.touch-controls .pressed').count()==1
    assert page.locator('.touch-dpad [data-input="R D"]').get_attribute('aria-pressed')=='true'
    cdp.send('Input.dispatchTouchEvent',{'type':'touchCancel','touchPoints':[]});steps(1)
    assert page.locator('.touch-controls .pressed').count()==0
    # Keep tracking the finger while it crosses the gap between D-pad keys.
    down=point('.touch-dpad [data-input="D"]',5)
    corner=point('.touch-dpad [data-input="R D"]',5)
    gap={**down,'x':(down['x']+corner['x'])/2}
    cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[down]})
    cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[gap]})
    expect(page.locator('.touch-controls .pressed')).to_have_count(0)
    cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[corner]})
    expect(page.locator('.touch-dpad [data-input="R D"]')).to_have_attribute('aria-pressed','true')
    cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
    with page.expect_download() as pending:page.locator('#export-scripts').tap()
    pending.value.save_as('work/arena-character-scripts.zip')
    with ZipFile('work/arena-character-scripts.zip') as z:
        assert 'kfm/kfm.def' in z.namelist() and 'kfm/kfm.cmd' in z.namelist()
        assert not any(name.endswith(('.sff','.snd')) for name in z.namelist())
        assert 'unrelated-bank.bin' not in z.namelist()
        metadata=json.loads(z.read('character-analysis.json'))
        assert metadata['name']=='Large ZIP Fixture'
    page.locator('#arena-mode').select_option('cpu')
    assert page.locator('#player-control').input_value()==page.locator('#dummy-mode').input_value()=='cpu'
    assert page.locator('#match-mode').input_value()=='match'
    page.locator('#fight-now').tap();page.wait_for_timeout(100)
    page.locator('#play').tap()
    assert page.evaluate('document.documentElement.scrollWidth')<=390
    page.screenshot(path='work/arena-mobile-12.png',full_page=True)
    assert not errors,errors
    assert not failures,failures
    result={'zipMB':round(fixture.stat().st_size/1024/1024,2),'workerCount':len(workers),'importHeartbeatTicks':heartbeat,'touchPunchDamage':23,'multiTouchInput':report['player']['rawInput'],'scriptExportBytes':Path('work/arena-character-scripts.zip').stat().st_size,'cpuMatch':True,'errors':errors,'failedRequests':failures}
    Path('work/browser-arena-result.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
    browser.close()
