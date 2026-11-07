"""Scoped library purge and recovery from a storage request that never completes."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import functools,http.server,json,os,shutil,threading,hashlib
ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'work/library-reset';OUT.mkdir(parents=True,exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
threading.Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}/'
result={'physicalPhone':False}
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or p.chromium.executable_path,headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
  context=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True);page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(base+'mobile/');page.wait_for_function("document.querySelector('#status').textContent==='Ready when you are.'")
  fixture=ROOT/'test/fixtures/multi-archive/fighter.zip';original=hashlib.sha256(fixture.read_bytes()).hexdigest()
  with page.expect_file_chooser() as chosen:page.locator('#browse').click()
  chosen.value.set_files(str(fixture));page.wait_for_function("document.querySelector('#status').textContent.startsWith('Archive installed')")
  page.evaluate("""async()=>{localStorage.setItem('kenjatime.visuals','sharp');const request=indexedDB.open('unrelated-library',1);request.onupgradeneeded=()=>request.result.createObjectStore('keep');await new Promise(y=>request.onsuccess=y);const db=request.result,tx=db.transaction('keep','readwrite');tx.objectStore('keep').put('keep me','test');await new Promise(y=>tx.oncomplete=y);db.close();const r=indexedDB.open('kenjatime.archives',1);await new Promise(y=>r.onsuccess=y);const old=r.result,t=old.transaction(['archives','metadata'],'readwrite');t.objectStore('archives').put({id:'old',blob:new Blob(['original'])});t.objectStore('metadata').put({id:'old',name:'Old saved archive.zip'});await new Promise(y=>t.oncomplete=y);old.close();}""")
  page.locator('#reset-library').click();page.wait_for_function("document.querySelector('#status').textContent==='Ready when you are.'")
  assert page.locator('.library-item').count()==0
  assert page.locator('#name').inner_text()=='Kung Fu Man'
  assert page.evaluate("!new URL(location.href).searchParams.has('reset-library') && localStorage.getItem('kenjatime.visuals')==='sharp'")
  retained=page.evaluate("""async()=>{const r=indexedDB.open('unrelated-library');await new Promise(y=>r.onsuccess=y);const db=r.result,q=db.transaction('keep').objectStore('keep').get('test');await new Promise(y=>q.onsuccess=y);db.close();return q.result;}""");assert retained=='keep me'
  with page.expect_file_chooser() as chosen:page.locator('#browse').click()
  chosen.value.set_files(str(fixture));page.wait_for_function("document.querySelector('#status').textContent.startsWith('Archive installed')")
  page.reload();page.wait_for_function("document.querySelector('#status').textContent==='Ready when you are.'");assert page.locator('.library-item').count()==1
  assert hashlib.sha256(fixture.read_bytes()).hexdigest()==original
  result.update({'purgesCurrentAndLegacyLibraries':True,'sampleRestored':True,'resetConsumedOnce':True,'newImportsSurviveReload':True,'unrelatedDataAndOriginalFilePreserved':True});context.close()
  # This models the reported permanent Opening screen: IndexedDB.open never
  # fires success/error. The reset anchor must work before any timeout expires.
  context=browser.new_context();context.add_init_script("""if(!new URL(location.href).searchParams.has('reset-library')){const open=IDBFactory.prototype.open;IDBFactory.prototype.open=function(name,...args){return name==='kenjatime.engine.library'?{}:open.call(this,name,...args);};}""")
  page=context.new_page();page.goto(base+'mobile/');page.locator('#reset-library').wait_for();assert page.locator('#fight-now').is_disabled()
  page.locator('#reset-library').click();page.wait_for_function("document.querySelector('#status').textContent==='Ready when you are.'",timeout=15000);result['resetWorksDuringHungStartup']=True;context.close()
  # Without purging, a hung saved library falls back to a usable sample match.
  context=browser.new_context();context.add_init_script("const open=IDBFactory.prototype.open;IDBFactory.prototype.open=function(name,...args){return name==='kenjatime.engine.library'?{}:open.call(this,name,...args);};")
  page=context.new_page();page.goto(base+'mobile/');page.wait_for_function("document.querySelector('#status').textContent.includes('included fighter is ready')",timeout=15000)
  assert page.locator('#fight-now').is_enabled();page.locator('#fight-now').click();page.wait_for_function('window.__kenjatimeGoState?.players.length===2',timeout=90000);page.locator('[data-menu]').click()
  result['hungStorageFallsBackToPlayableSample']=True;assert not errors,errors;result['errors']=errors;browser.close()
finally:server.shutdown()
(OUT/'evidence.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result))
