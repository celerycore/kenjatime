"""Exercise renderer switching, touch/keyboard combat, resizing and Canvas fallbacks."""
from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
from playwright.sync_api import sync_playwright
import json,os
os.chdir(Path(__file__).resolve().parent.parent);Path('work').mkdir(exist_ok=True)
base=os.environ.get('MUGEN_TEST_BASE','http://127.0.0.1:5186/next/').rstrip('/')+'/'
results=[]
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
    for route in ['', 'arena/', 'arena-classic/', 'mobile/index.html']:
        page=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(base+route+'?perf=1&graphics=high',wait_until='networkidle')
        if not route:page.locator('#sample').click()
        page.wait_for_function("document.querySelector('#name').textContent==='Kung Fu Man'")
        if route:page.locator('#arena-mode').select_option('training')
        page.locator('#training').click();page.evaluate('window.__kenjatimePerformance.benchmark({frames:1,ticksPerFrame:0})');page.locator('#reset').click()
        def report():
            return page.evaluate('''async()=>{let blob;const url=URL.createObjectURL,click=HTMLAnchorElement.prototype.click;URL.createObjectURL=b=>{blob=b;return 'blob:test'};HTMLAnchorElement.prototype.click=function(){};try{document.querySelector('#export-report').click();return JSON.parse(await blob.text())}finally{URL.createObjectURL=url;HTMLAnchorElement.prototype.click=click}}''')
        before=report()['player'];page.locator('#renderer-mode').select_option('pixi');page.wait_for_function('!document.querySelector("#renderer-mode").disabled')
        warm=page.evaluate('window.__kenjatimePerformance.benchmark({frames:5,ticksPerFrame:0})');assert warm['counts']['renderer']=='pixi',warm
        assert report()['player']==before,'Renderer switch must not execute a gameplay tick'
        assert warm['counts']['gpuUploads']==0 and warm['counts']['gpuTextureBytes']<=16*1024*1024
        def steps(n):page.evaluate('(n)=>{for(let i=0;i<n;i++)document.querySelector("#step").click()}',n)
        page.locator('canvas').first.click();page.keyboard.down('ArrowRight');steps(50);page.keyboard.up('ArrowRight');steps(1)
        page.locator('.touch-buttons [data-input="x"]').tap();steps(26);assert report()['opponent']['life']==977
        page.locator('#graphics-mode').select_option('low');size=page.evaluate('window.__kenjatimePerformance.benchmark({frames:2,ticksPerFrame:0}).counts');assert size['renderer']=='pixi' and size['renderScale']==.6,(route,size)
        assert page.locator('.gpu-canvas').evaluate('c=>[c.width,c.height]')==[576,324]
        page.locator('#boxes').check();assert page.evaluate('window.__kenjatimePerformance.benchmark({frames:2,ticksPerFrame:0}).counts.renderer')=='pixi'
        preserved=report()['player'];page.locator('#renderer-mode').select_option('canvas');assert report()['player']==preserved
        page.locator('#renderer-mode').select_option('pixi');page.wait_for_function('!document.querySelector("#renderer-mode").disabled');page.evaluate('window.__kenjatimePerformance.benchmark({frames:2,ticksPerFrame:0})')
        page.evaluate("document.querySelector('.gpu-canvas').getContext('webgl2').getExtension('WEBGL_lose_context').loseContext()")
        page.wait_for_function("document.querySelector('#renderer-note').textContent.includes('context was lost')")
        assert page.evaluate('window.__kenjatimePerformance.benchmark({frames:1,ticksPerFrame:0}).counts.renderer')=='canvas'
        assert report()['player']==preserved;assert not errors,errors
        results.append({'route':route or '/','warmUploads':0,'touchDamage':23,'switchPreservesState':True,'lowSize':[576,324],'collisionBoxes':True,'lostContextFallsBack':True,'errors':errors});page.close()
    # A device without WebGL must still be able to import and render normally.
    context=browser.new_context();context.add_init_script("const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type.includes('webgl')?null:get.call(this,type,...args)}")
    page=context.new_page();page.goto(base+'?perf=1&renderer=pixi',wait_until='networkidle');page.wait_for_function('!document.querySelector("#renderer-mode").disabled');page.locator('#sample').click();page.wait_for_function("document.querySelector('#name').textContent==='Kung Fu Man'")
    fallback=page.evaluate('window.__kenjatimePerformance.benchmark({frames:2,ticksPerFrame:0}).counts');assert fallback['renderer']=='canvas' and fallback['rendererFallback'];context.close()
    # Fractional window edges must use the reference compositing path.
    with ZipFile('work/performance/parallax.zip') as z,ZipFile('work/pixi-fractional.zip','w',ZIP_DEFLATED) as out:
        for name in z.namelist():
            data=z.read(name)
            if name=='stage.def':data+=b'\nwindow=-10.1,0,90.3,240\n'
            out.writestr(name,data)
    page=browser.new_page();page.goto(base+'?perf=1',wait_until='networkidle');page.locator('#file').set_input_files('work/pixi-fractional.zip');page.wait_for_function("document.querySelector('#name').textContent==='Performance parallax'")
    page.locator('#training').click();page.evaluate('window.__kenjatimePerformance.benchmark({frames:1,ticksPerFrame:0})');page.locator('#renderer-mode').select_option('pixi');page.wait_for_function('!document.querySelector("#renderer-mode").disabled');counts=page.evaluate('window.__kenjatimePerformance.benchmark({frames:2,ticksPerFrame:0}).counts');assert counts['renderer']=='canvas' and 'Fractional' in counts['rendererFallback'],counts
    browser.close()
result={'routes':results,'unavailableWebGLFallsBack':True,'fractionalClipFallsBack':True};Path('work/pixi-app-evidence.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result))
