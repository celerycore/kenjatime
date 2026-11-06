"""Run actual IKEMEN GO WASM matches through Kenjatime's shared UI.
Host Chromium/SwiftShader coverage; no phone FPS claim.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,os,time,zipfile,threading,functools,http.server,shutil
ROOT=Path(__file__).resolve().parent.parent;os.chdir(ROOT)
base=os.environ.get('MUGEN_QA_BASE')
server=None
if not base:
 class Quiet(http.server.SimpleHTTPRequestHandler):
  def log_message(self,*args):pass
 server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
 threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'

out={'engine':'IKEMEN GO 1.0.0 (Go/WASM)','phoneExecution':False,'cases':{}}
with zipfile.ZipFile('public/engine/core.zip') as z:
 names=z.namelist();assert not any(n.startswith(('external/script/','external/icons/','data/ikemen1/','data/motif1/')) for n in names);assert 'data/system.sff' not in names
 assert b'loadMotif(' not in z.read('data/kenjatime/engine.lua')
out['coreContainsStockUi']=False
with sync_playwright() as p:
 executable=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or p.chromium.executable_path
 browser=p.chromium.launch(executable_path=executable,headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required'])
 context=browser.new_context(viewport={'width':844,'height':390},is_mobile=True,has_touch=True);page=context.new_page();errors=[];bad=[]
 page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:bad.append(r.url) if r.status>=400 and 'favicon' not in r.url else None)
 def ready():page.wait_for_function("document.querySelector('#status').textContent==='Ready when you are.'")
 def state():return page.evaluate('window.__kenjatimeGoState')
 def start(mode='training'):
  page.locator('#arena-mode').select_option(mode);page.locator('#fight-now').click();page.wait_for_function("window.__kenjatimeGoState?.players.length===2",timeout=90000);page.wait_for_function("window.__kenjatimeGoState.players.every(p=>p.state===0)",timeout=30000)
 def stop():page.locator('[data-menu]').click();assert page.locator('.kenjatime-battle').count()==0
 page.goto(base+'arena-classic/index.html');ready();assert page.locator('#name').inner_text()=='Kung Fu Man';assert page.evaluate('typeof window.__kenjatimePerformance')=='undefined'
 # Versus keeps damage persistent; training automatically restores dummy life.
 start('versus');cdp=context.new_cdp_session(page)
 def point(selector):
  box=page.locator(selector).bounding_box();assert box and 0<=box['x'] and box['x']+box['width']<=844 and 0<=box['y'] and box['y']+box['height']<=390,box
  return {'id':1,'x':box['x']+box['width']/2,'y':box['y']+box['height']/2}
 cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[point('.touch-dpad [data-input="R"]')]})
 page.wait_for_function("Math.abs(window.__kenjatimeGoState.players[1].x-window.__kenjatimeGoState.players[0].x)<=33",timeout=12000)
 before=state()['players'][1]['life'];attack=point('.touch-buttons [data-input="x"]');attack['id']=2
 # Attack with a second finger while approaching; this avoids a spacing change
 # between walking and standing and verifies simultaneous touch inputs.
 cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[point('.touch-dpad [data-input="R"]'),attack]})
 cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
 try:page.wait_for_function(f"window.__kenjatimeGoState.players[1].life<{before}",timeout=15000)
 except Exception:
  page.screenshot(path='work/ikemen-web/attack-failure.png');print(json.dumps({'attackFailure':state(),'errors':errors,'failedRequests':bad}),flush=True);raise
 out['cases']['touchAttackDamage']=before-state()['players'][1]['life'];page.locator('[data-pause]').click();page.wait_for_function('window.__kenjatimeGoState.paused');a=state();page.wait_for_timeout(700);b=state();assert a['players']==b['players'],(a,b);out['cases']['pauseFreezesFighters']=True
 page.screenshot(path='work/ikemen-web/shared-go-fight.png');stop();out['cases']['menuReturnsToKenjatime']=True
 # All routes share the same application, source and upload workflow.
 fixtures=ROOT/'test/fixtures/multi-archive';imports=[]
 for route in ['','arena/','arena-classic/','mobile/']:
  page.goto(base+route+'index.html');ready()
  for name in ['fighter.zip','fighter.bzip2.zip','fighter.lzma.zip','fighter.7z','fighter.tar.gz','fighter-sfx.zip']:
   with page.expect_file_chooser() as chosen:page.locator('#browse').click()
   chosen.value.set_files({'name':'cloud-download','mimeType':'application/octet-stream','buffer':(fixtures/name).read_bytes()})
   page.wait_for_function("document.querySelector('#name').textContent==='Archive Fixture' && !document.querySelector('#browse').disabled")
   imports.append(route+name)
  with page.expect_file_chooser() as chosen:page.locator('#browse').click()
  chosen.value.set_files(str(fixtures/'traversal.tar'));page.wait_for_function("/Unsafe/.test(document.querySelector('#status').textContent)");assert page.locator('#name').inner_text()=='Archive Fixture'
  page.reload();ready();assert page.locator('#name').inner_text()=='Archive Fixture'
 out['cases']['archiveImports']=imports;out['cases']['invalidImportPreservesLibrary']=True;out['cases']['savedImportsSurviveReload']=True
 # Original archives remain visible; open migrates them without deleting the source.
 sample=(fixtures/'fighter.zip').read_bytes()
 page.evaluate('''async bytes=>{const r=indexedDB.open('kenjatime.archives',1);await new Promise((yes,no)=>{r.onupgradeneeded=()=>{for(const n of ['archives','metadata'])r.result.createObjectStore(n,{keyPath:'id'});};r.onsuccess=yes;r.onerror=no;});const db=r.result,tx=db.transaction(['archives','metadata'],'readwrite'),metadata={id:'legacy-fixture',name:'Saved before Go upgrade.zip',stageOnly:false,savedAt:1};tx.objectStore('archives').put({id:metadata.id,metadata,blob:new Blob([Uint8Array.from(bytes)])});tx.objectStore('metadata').put(metadata);await new Promise((yes,no)=>{tx.oncomplete=yes;tx.onerror=no;});db.close();}''',list(sample))
 page.reload();ready();row=page.locator('.library-item').filter(has_text='Saved before Go upgrade.zip');row.locator('button',has_text='Open').click();page.wait_for_function("document.querySelector('#status').textContent.includes('Saved archive installed')");assert page.locator('#name').inner_text()=='Archive Fixture';out['cases']['oldLibraryMigration']=True
 # Real supplied RARs exercise the same decoder and Go VM, rather than only fixtures.
 for envkey,name in [('MUGEN_CNS_KFM_ZIP','Kung Fu Man'),('MUGEN_TOMOKA_RAR','Tomoka Minato'),('MUGEN_FOREST_RAR','Forest')]:
  path=os.environ.get(envkey,str(ROOT/'public/kfm.zip') if envkey=='MUGEN_CNS_KFM_ZIP' else None)
  if not path:continue
  with page.expect_file_chooser() as chosen:page.locator('#add-stage' if 'FOREST' in envkey else '#browse').click()
  chosen.value.set_files(path);page.wait_for_function("!document.querySelector('#browse').disabled && document.querySelector('#status').textContent.startsWith('Archive installed')",timeout=90000)
  print('IMPORTED',envkey,flush=True);start();out['cases'][envkey]={'started':True,'state':state()};page.wait_for_timeout(1000);page.screenshot(path='work/ikemen-web/'+('tomoka' if 'TOMOKA' in envkey else 'forest')+'.png');stop()
 assert not errors,errors;assert not bad,bad;out['errors']=errors;out['failedRequests']=bad;browser.close()
if server:server.shutdown()
Path('work/go-engine-browser-evidence.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out))
