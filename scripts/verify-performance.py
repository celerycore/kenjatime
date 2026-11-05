"""Browser checks for graphics, short inputs, idle work and background policy."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from playwright.sync_api import sync_playwright
import json, os
os.chdir(Path(__file__).resolve().parent.parent)
Path('work').mkdir(exist_ok=True)
with ZipFile('public/kfm.zip') as source:sprite=source.read('kfm/kfm.sff')
with ZipFile('work/performance-input-fixture.zip','w',ZIP_DEFLATED) as target:
    files={
        'test.def':'[Info]\nname=Performance Input\n[Files]\ncns=test.cns\nst=test.cns\ncmd=test.cmd\nanim=test.air\nsprite=test.sff',
        'test.cmd':'[Command]\nname="punch"\ncommand=x\n[Statedef -1]\n[State Input]\ntype=ChangeState\ntriggerall=TeamSide=1\ntriggerall=ctrl\ntrigger1=command="punch"\nvalue=200',
        'test.cns':'[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nctrl=1\nanim=0\n[Statedef 200]\ntype=S\nmovetype=A\nphysics=N\nctrl=0\nanim=200\n[State Hit]\ntype=HitDef\ntrigger1=Time=0\nattr=S,NA\ndamage=10\nground.velocity=0,0\nground.hittime=8\npausetime=1,1\nsparkno=-1\n[State Ready]\ntype=ChangeState\ntrigger1=Time=20\nvalue=0\nctrl=1',
        'test.air':'[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-10,-60,10,0\n0,0,0,0,-1\n[Begin Action 200]\nClsn1Default:1\nClsn1[0]=0,-60,240,0\nClsn2Default:1\nClsn2[0]=-10,-60,10,0\n0,0,0,0,-1',
        'test.sff':sprite,
    }
    for name,data in files.items():target.writestr(name,data)
url=os.environ.get('MUGEN_TEST_URL','http://127.0.0.1:5186/kenjatime/')
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,accept_downloads=True)
    page=context.new_page();errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
    page.goto(url+'?perf=1&graphics=low',wait_until='networkidle')
    page.locator('#file').set_input_files('work/performance-input-fixture.zip')
    page.wait_for_function("document.querySelector('#name').textContent==='Performance Input'")
    page.locator('#training').click();page.locator('#play').click();page.locator('#reset').click()
    page.locator('canvas').scroll_into_view_if_needed();page.wait_for_timeout(100)
    assert page.locator('canvas').evaluate('(canvas)=>canvas.width')==576

    def report():
        with page.expect_download() as pending:page.locator('#export-report').evaluate('(el)=>el.click()')
        pending.value.save_as('work/performance-browser-report.json')
        result=json.loads(Path('work/performance-browser-report.json').read_text());assert not result['issues'],result['issues'];return result

    # Both events occur before the manual simulation tick.
    page.locator('canvas').click();page.keyboard.press('z')
    page.locator('#step').evaluate('(el)=>el.click()')
    short=report();assert short['player']['stateNo']==200 and short['opponent']['life']==990
    page.locator('#reset').evaluate('(el)=>el.click()')
    page.locator('#play').evaluate('(el)=>el.click()')
    page.locator('canvas').scroll_into_view_if_needed();page.wait_for_timeout(100)
    page.evaluate('window.__kenjatimePerformance.reset()');page.wait_for_timeout(1100)
    cadence=page.evaluate('window.__kenjatimePerformance.snapshot()')
    assert 55<=cadence['ticks']<=75,cadence
    assert 24<=cadence['fps']<=36,cadence
    assert cadence['counts']['simulationDebt']<2,cadence
    assert cadence['counts']['targetFPS']==30

    page.evaluate("window.scrollTo(0,document.body.scrollHeight)");page.wait_for_timeout(100)
    page.evaluate('window.__kenjatimePerformance.reset()');page.wait_for_timeout(300)
    offscreen=page.evaluate('window.__kenjatimePerformance.snapshot()')
    assert offscreen['ticks']>=12 and offscreen['drawCalls']==0,offscreen

    # Dispatch the app's explicit visibility policy without relying on a phone OS.
    page.evaluate("Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));window.__kenjatimePerformance.reset()")
    page.wait_for_timeout(250);hidden=page.evaluate('window.__kenjatimePerformance.snapshot()');assert hidden['ticks']==0
    page.evaluate("Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'))")
    page.wait_for_timeout(300);resumed=page.evaluate('window.__kenjatimePerformance.snapshot()');assert 10<=resumed['ticks']<=23,resumed

    page.locator('#play').evaluate('(el)=>el.click()');page.locator('canvas').scroll_into_view_if_needed();page.wait_for_timeout(100)
    page.evaluate('window.__kenjatimePerformance.reset()');page.wait_for_timeout(250)
    paused=page.evaluate('window.__kenjatimePerformance.snapshot()');assert paused['ticks']==paused['drawCalls']==0,paused
    before=report()['player'];sizes=[]
    for mode in ['high','balanced','low']:
        page.locator('#graphics-mode').select_option(mode);page.wait_for_timeout(80)
        sizes.append(page.locator('canvas').evaluate('(canvas)=>[canvas.width,canvas.height]'))
        after=report()['player'];assert [after[k] for k in ['stateNo','time','life','pos']]==[before[k] for k in ['stateNo','time','life','pos']]
    assert sizes==[[960,540],[720,405],[576,324]],sizes
    page.locator('#performance-toggle').uncheck();assert page.evaluate('window.__kenjatimePerformance===undefined')
    page.set_viewport_size({'width':844,'height':390});page.wait_for_timeout(100);assert page.evaluate('document.documentElement.scrollWidth')<=844
    page.goto(url,wait_until='networkidle');assert page.locator('#graphics-mode').input_value()=='low'
    assert page.evaluate('window.__kenjatimePerformance===undefined')
    assert not errors,errors
    result={'shortPressDamage':10,'lowModeSimulationTicks':cadence['ticks'],'lowModeRenderedFPS':cadence['fps'],'offscreenTicks':offscreen['ticks'],'offscreenDraws':offscreen['drawCalls'],'pausedDraws':paused['drawCalls'],'hiddenTicks':hidden['ticks'],'resumeTicks':resumed['ticks'],'sizes':sizes,'settingsPersisted':True,'instrumentationOffByDefault':True,'errors':errors}
    Path('work/browser-performance-result.json').write_text(json.dumps(result,indent=2));print(json.dumps(result));browser.close()
