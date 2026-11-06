"""Compare the real stage's prepared/reference animation and scrolling on both backends."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import base64,hashlib,json,os
import numpy as np
os.chdir(Path(__file__).resolve().parent.parent)
base=os.environ.get('MUGEN_TEST_BASE','http://127.0.0.1:5186/next/').rstrip('/')+'/'
archive=os.environ['MUGEN_FOREST_RAR'];results=[]
report_js='''async()=>{let blob;const url=URL.createObjectURL,click=HTMLAnchorElement.prototype.click;URL.createObjectURL=b=>{blob=b;return 'blob:test'};HTMLAnchorElement.prototype.click=function(){};try{document.querySelector('#export-report').click();return JSON.parse(await blob.text())}finally{URL.createObjectURL=url;HTMLAnchorElement.prototype.click=click}}'''
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for mode in ['high','low']:
  for backend in ['canvas','pixi']:
   reference=[];states=[];comparisons=[]
   for optimized in [False,True]:
    page=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(base+'mobile/index.html?perf=1&graphics='+mode+'&stageopt='+str(int(optimized)),wait_until='networkidle');page.wait_for_function("document.querySelector('#name').textContent==='Kung Fu Man'")
    page.locator('#arena-mode').select_option('training');page.locator('#training').click();page.evaluate('window.__kenjatimePerformance.benchmark({frames:1,ticksPerFrame:0})');page.locator('#sound').uncheck()
    page.evaluate('window.importPulses=0;window.importTimer=setInterval(()=>window.importPulses++,16)')
    page.locator('#stage-file').set_input_files(archive);page.wait_for_function("document.querySelector('#stage-select option:checked').textContent==='Forest of King Cruel'")
    pulses=page.evaluate('clearInterval(window.importTimer);window.importPulses');assert pulses>0,'Import must yield to the UI'
    page.locator('#renderer-mode').select_option(backend);page.wait_for_function('!document.querySelector("#renderer-mode").disabled');page.evaluate('window.__kenjatimePerformance.benchmark({frames:1,ticksPerFrame:0})');page.locator('#reset').click()
    page.locator('canvas').first.click();page.keyboard.down('ArrowRight');last=0
    for index,tick in enumerate([0,3,6,9,12,15,18,21,24,27,200]):
     page.evaluate('(n)=>{for(let i=0;i<n;i++)document.querySelector("#step").click()}',tick-last);last=tick
     counts=page.evaluate('window.__kenjatimePerformance.benchmark({frames:1,ticksPerFrame:0}).counts');assert counts['renderer']==backend,counts
     raw=page.evaluate("()=>{const d=window.__kenjatimePerformance.capturePixels();let s='';for(let i=0;i<d.length;i+=32768)s+=String.fromCharCode(...d.slice(i,i+32768));return btoa(s)}")
     pixels=np.frombuffer(base64.b64decode(raw),dtype=np.uint8).astype('int16').reshape(-1,4)
     if not optimized:reference.append(pixels)
     else:
      delta=np.abs(pixels-reference[index]);row={'tick':tick,'maximum':int(delta.max()),'meanChannelDelta':float(delta.mean()),'changedPixelFraction':float(np.any(delta,axis=1).mean())};comparisons.append(row)
      # Cropping changes nearest-texel rounding at fractional raster boundaries.
      # Large shifts, missing layers and palette mistakes must still fail.
      assert row['meanChannelDelta']<.1 and row['changedPixelFraction']<.01,row
    page.keyboard.up('ArrowRight');report=page.evaluate(report_js);state={k:report.get(k) for k in ['player','opponent','entities','projectiles','stage','match','issues']};states.append(hashlib.sha256(json.dumps(state,sort_keys=True).encode()).hexdigest())
    assert 0<report['stage']['camera']['x']<=140,report['stage'];assert counts['stagePreparedFrames']==20 and counts['stagePreparedBytes']==7113650
    if optimized and backend=='pixi':assert counts['stageCanvasBytes']==0 and counts['gpuTextureBytes']<=16*1024*1024
    assert not errors,errors;page.close()
   assert states[0]==states[1],'Optimization changed gameplay or stage timing'
   results.append({'mode':mode,'renderer':backend,'gameplayHashMatches':True,'cameraX':report['stage']['camera']['x'],'frames':comparisons,'importUiPulses':pulses,'preparedFrames':20,'preparedBytes':7113650,'errors':[]})
 b.close()
Path('work/stage-optimization-evidence.json').write_text(json.dumps({'physicalAndroid':False,'comparisons':results},indent=2)+'\n')
print(json.dumps([{'mode':r['mode'],'renderer':r['renderer'],'cameraX':r['cameraX'],'maxMeanDelta':max(f['meanChannelDelta'] for f in r['frames']),'maxChangedFraction':max(f['changedPixelFraction'] for f in r['frames'])} for r in results]))
