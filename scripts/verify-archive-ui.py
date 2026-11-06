"""Verify real archive workers on Pages paths and the shared native setup UI.
This uses Chromium, not an Android device or the native gameplay process.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,os
ROOT=Path(__file__).resolve().parent.parent;os.chdir(ROOT)
base=os.environ.get('MUGEN_QA_BASE','http://127.0.0.1:5186/next/')
fixtures=ROOT/'test/fixtures/multi-archive';result={'workerImports':[],'nativeUi':{}}
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 for route in ([] if os.environ.get('MUGEN_QA_NATIVE_ONLY') else ['', 'arena/','arena-classic/','mobile/']):
  page.goto(base+route+'index.html');page.wait_for_selector('#file')
  for name in json.loads((fixtures/'manifest.json').read_text())['archives']:
   print(route+name,flush=True)
   page.wait_for_function("!document.querySelector('#file').disabled")
   page.locator('#file').set_input_files({'name':'cloud-download','mimeType':'application/octet-stream','buffer':(fixtures/name).read_bytes()})
   page.wait_for_function("document.querySelector('#name').textContent==='Archive Fixture' && !document.querySelector('#file').disabled && /^Imported /.test(document.querySelector('#status').textContent)")
   result['workerImports'].append(route+name)
  page.locator('#file').set_input_files(str(fixtures/'traversal.tar'));page.wait_for_function("/Unsafe/.test(document.querySelector('#status').textContent)");assert page.locator('#name').inner_text()=='Archive Fixture'
 page=browser.new_page(viewport={'width':390,'height':844},bypass_csp=True);page.on('pageerror',lambda e:errors.append(str(e)))
 sample={'id':'chars/kfm_zss/kfm_zss.def','name':'Kung Fu Man','author':'Elecbyte','fileName':'kfm_zss.def','packageName':'Included sample'}
 imported={**sample,'id':'imports/test/hero.def','packageId':'test','name':'Archive Fixture','packageName':'cloud-download'}
 catalog={'characters':[sample],'stages':[{'id':'stages/kenjatime-grid.def','name':'Training grid'}],'packages':[]}
 page.add_init_script('''window.testCatalog='''+json.dumps(catalog)+''';window.nativeRequests=[];window.KenjatimeNative={request(raw){const r=JSON.parse(raw);nativeRequests.push(r);if(r.action==='pickArchive'){testCatalog.characters.push('''+json.dumps(imported)+''');testCatalog.packages.push({id:'test',name:'cloud-download'});}if(r.action==='remove'){testCatalog.characters=testCatalog.characters.filter(c=>!c.packageId);testCatalog.packages=[];}queueMicrotask(()=>window.__kenjatimeNativeResult({id:r.id,data:r.action==='launch'?{launching:true}:structuredClone(testCatalog)}));}};''')
 page.goto(base+'native-ui/index.html');page.wait_for_function("document.querySelector('#name').textContent==='Kung Fu Man'");assert page.locator('h1').text_content()=='Your next match starts here.'
 page.locator('#browse').click();page.wait_for_function("document.querySelector('#name').textContent==='Archive Fixture'");page.locator('#fight-now').click();page.wait_for_function("nativeRequests.some(r=>r.action==='launch')")
 launch=page.evaluate("nativeRequests.find(r=>r.action==='launch')");assert launch['character']=='imports/test/hero.def';assert launch['stage']=='stages/kenjatime-grid.def';assert page.evaluate("typeof window.__kenjatimePerformance")=='undefined'
 assert page.evaluate('document.documentElement.scrollWidth')<=390;page.screenshot(path='work/native-setup-portrait.png',full_page=True)
 page.set_viewport_size({'width':844,'height':390});assert page.evaluate('document.documentElement.scrollWidth')<=844;page.screenshot(path='work/native-setup-landscape.png',full_page=True)
 result['nativeUi']={'importsSelectNewCharacter':True,'validatedLaunchRequest':launch,'noBrowserCombatRuntime':True,'portraitAndLandscapeFit':True};assert not errors,errors;browser.close()
Path('work/archive-ui-evidence.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps({'workerImports':len(result['workerImports']),'nativeUi':result['nativeUi']}))
