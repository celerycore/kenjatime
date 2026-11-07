"""Real browser cold/warm/process starts, migration, large libraries and faults.
Android hardware is not emulated by this script. Native bridge tests complement it.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import functools,http.server,json,os,shutil,tempfile,threading,time
ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'work/startup-diagnostics';OUT.mkdir(parents=True,exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
threading.Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}/'
args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']
result={'physicalPhone':False,'cases':{}}
seed="""async({version=2,large=false,malformed=false,hold=false})=>{
 const r=indexedDB.open('kenjatime.engine.library',version);r.onupgradeneeded=()=>{const db=r.result;db.createObjectStore('packages',{keyPath:'id'});db.createObjectStore('files',{keyPath:'path'}).createIndex('packageId','packageId');if(version===2)db.createObjectStore('archives',{keyPath:'id'});};await new Promise((yes,no)=>{r.onsuccess=yes;r.onerror=no;});const db=r.result;
 const count=large?200:1,stores=version===2?['packages','files','archives']:['packages','files'];
 const sprite=new Blob([new Uint8Array(1024*1024)]),archive=new Blob([new Uint8Array(256*1024)]),script=new Blob([new Uint8Array(2048)]);
 for(let group=0;group<count;group+=10){const tx=db.transaction(stores,'readwrite');for(let n=group;n<Math.min(count,group+10);n++){const id='00000000-0000-4000-8000-'+String(n).padStart(12,'0');tx.objectStore('packages').put({id,name:'Private archive '+n+'.rar',characters:[{id:'imports/'+id+'/hero.def',name:'Saved fighter '+n,fileName:'hero.def',packageId:id}],stages:[],archiveSaved:version===2,archiveBytes:large?262144:3,expandedBytes:large?1253376:3,fileCount:large?101:1});tx.objectStore('files').put({path:'imports/'+id+'/hero.sff',packageId:id,blob:large?sprite:new Blob(['old'])});if(large)for(let i=0;i<100;i++)tx.objectStore('files').put({path:'imports/'+id+'/state'+i+'.cns',packageId:id,blob:script});if(version===2)tx.objectStore('archives').put({id,name:'Private archive '+n+'.rar',blob:archive});}await new Promise((yes,no)=>{tx.oncomplete=yes;tx.onerror=no;});}
 if(malformed){const tx=db.transaction('packages','readwrite');tx.objectStore('packages').put({id:'bad',characters:null,stages:[]});await new Promise(y=>tx.oncomplete=y);}
 if(hold)window.__heldLibrary=db;else db.close();return{packages:count,files:large?20200:1,logicalBytes:large?303104000:3,sharedFixtureBlobs:true};
}"""
def wait_ready(page,status='ready'):
 page.wait_for_function("s=>window.__kenjatimeStartup?.snapshot().sessions[0].status===s",arg=status,timeout=20000)
 page.wait_for_function("document.querySelector('#fight-now') && !document.querySelector('#fight-now').disabled")
 return page.evaluate('window.__kenjatimeStartup.snapshot()')
def save(name,report):
 text=json.dumps(report);assert 'Private archive' not in text and 'hero.def' not in text and 'password' not in text.lower(),text
 (OUT/(name+'.json')).write_text(json.dumps(report,indent=2)+'\n');result['cases'][name]={'status':report['sessions'][0]['status'],'elapsedMs':report['sessions'][0]['elapsedMs'],'metrics':report['sessions'][0]['metrics']};print('PASS '+name,flush=True)
try:
 with sync_playwright() as p:
  executable=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or p.chromium.executable_path
  browser=p.chromium.launch(executable_path=executable,headless=True,args=args)
  # Independent empty profiles are true browser cold starts, not reloads.
  for i in range(3):
   context=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True);page=context.new_page();page.goto(base+'mobile/');r=wait_ready(page);assert r['sessions'][0]['metrics']['packages']==0;save('cold-'+str(i+1),r);context.close()
  # Old installed files survive the schema-1 to schema-2 update.
  context=browser.new_context();page=context.new_page();page.goto(base+'engine/index.html');page.evaluate(seed,{'version':1});page.goto(base+'mobile/');r=wait_ready(page);phase=next(s for s in r['sessions'][0]['phases'] if s['code']=='library-open');assert phase['data']['fromVersion']==1 and phase['data']['toVersion']==2 and phase['data']['migrated'];assert page.locator('.library-item').count()==1;save('upgrade-v1',r)
  for i in range(2):
   page.reload();r=wait_ready(page);assert page.locator('.library-item').count()==1;assert len(r['sessions'])>=2;save('warm-'+str(i+1),r)
  context.close()
  # A stale tab can block upgrading; fallback must neither hang nor erase data.
  context=browser.new_context();holder=context.new_page();holder.goto(base+'engine/index.html');holder.evaluate(seed,{'version':1,'hold':True});page=context.new_page();page.goto(base+'mobile/');r=wait_ready(page,'degraded');assert any(s['status']=='blocked' for s in r['sessions'][0]['phases']);save('blocked-upgrade',r);holder.close();page.reload();r=wait_ready(page);assert page.locator('.library-item').count()==1;save('unblocked-upgrade',r);context.close()
  # 200 packages, 20,200 installed files and ~289 MiB of logical Blob payload.
  context=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True);page=context.new_page();page.goto(base+'engine/index.html');size=page.evaluate(seed,{'large':True});result['largeLibrary']=size
  context.add_init_script("window.__payloadReads=0;const get=IDBObjectStore.prototype.getAll;IDBObjectStore.prototype.getAll=function(...args){if(this.name==='files'||this.name==='archives'){window.__payloadReads++;throw Error('Startup read payload store');}return get.apply(this,args);};")
  page.goto(base+'mobile/');r=wait_ready(page);assert r['sessions'][0]['metrics']['packages']==200 and r['sessions'][0]['metrics']['knownFiles']==20200;assert page.evaluate('window.__payloadReads')==0;assert page.locator('.library-item').count()==200;save('large-library',r);context.close()
  # Bad metadata is reported separately from storage-open errors.
  context=browser.new_context();page=context.new_page();page.goto(base+'engine/index.html');page.evaluate(seed,{'malformed':True});page.goto(base+'mobile/');r=wait_ready(page,'degraded');assert r['sessions'][0]['metrics']['invalidPackages']==1;save('malformed-metadata',r);context.close()
  # Export remains usable while startup is stuck, and survives a later reload.
  context=browser.new_context(accept_downloads=True);context.add_init_script("if(!sessionStorage.getItem('restore-storage')){const open=IDBFactory.prototype.open;IDBFactory.prototype.open=function(name,...args){return name==='kenjatime.engine.library'?{}:open.call(this,name,...args);};}")
  page=context.new_page();page.goto(base+'mobile/');page.locator('#startup-diagnostics summary').click();assert page.locator('#export-startup').is_enabled()
  with page.expect_download() as chosen:page.locator('#export-startup').click()
  exported=json.loads(Path(chosen.value.path()).read_text());assert exported['sessions'][0]['status']=='loading';assert any(s['code']=='library-open' and s['status']=='pending' for s in exported['sessions'][0]['phases'])
  r=wait_ready(page,'degraded');assert any(s['status']=='timed-out' for s in r['sessions'][0]['phases']);save('hung-storage',r)
  page.evaluate("sessionStorage.setItem('restore-storage','yes');window.__kenjatimeStartup.persist()");page.reload();r=wait_ready(page);assert any(s['status']=='degraded' for s in r['sessions'][1:]);save('recovered-storage',r);context.close();result['exportDuringHang']=True
  # An interrupted launch remains identifiable after restarting, rather than
  # being mislabeled as a successful start or forcing deletion of the library.
  context=browser.new_context();context.add_init_script("if(!sessionStorage.getItem('restore-storage')){const open=IDBFactory.prototype.open;IDBFactory.prototype.open=function(name,...args){return name==='kenjatime.engine.library'?{}:open.call(this,name,...args);};}")
  page=context.new_page();page.goto(base+'mobile/');page.wait_for_function("window.__kenjatimeStartup?.snapshot().sessions[0].phases.some(p=>p.code==='library-open')")
  page.evaluate("sessionStorage.setItem('restore-storage','yes')");page.reload();r=wait_ready(page);assert r['sessions'][1]['status']=='interrupted';save('interrupted-startup',r);context.close()
  # A storage failure reports the error class without copying exception text
  # or silently deleting existing installed metadata.
  context=browser.new_context();context.add_init_script("if(!sessionStorage.getItem('restore-storage')){const get=IDBObjectStore.prototype.getAll;IDBObjectStore.prototype.getAll=function(...args){if(this.name==='packages')throw new DOMException('private archive text','QuotaExceededError');return get.apply(this,args);};}")
  page=context.new_page();page.goto(base+'engine/index.html');page.evaluate(seed,{'version':2});page.goto(base+'mobile/');r=wait_ready(page,'degraded');assert any(s.get('error',{}).get('name')=='QuotaExceededError' for s in r['sessions'][0]['phases']);save('storage-error',r)
  page.evaluate("sessionStorage.setItem('restore-storage','yes')");page.reload();r=wait_ready(page);assert page.locator('.library-item').count()==1;save('storage-error-recovery',r);context.close()
  # Failed resource loading must identify its phase, without silent data deletion.
  context=browser.new_context();context.route('**/engine/core.zip*',lambda route:route.fulfill(status=503,body='unavailable'));page=context.new_page();page.goto(base+'mobile/');r=wait_ready(page,'failed');assert any(s['code']=='core-download' and s['status']=='failed' and s['data']['httpStatus']==503 for s in r['sessions'][0]['phases']);save('failed-resources',r);context.close();browser.close()
  # Closing and relaunching Chromium with the same profile exercises persistence
  # across real browser process termination, rather than merely navigating back.
  with tempfile.TemporaryDirectory(prefix='kenjatime-startup-') as profile:
   for n in range(2):
    context=p.chromium.launch_persistent_context(profile,executable_path=executable,headless=True,args=args,viewport={'width':390,'height':844});page=context.pages[0]
    if n==0:page.goto(base+'engine/index.html');page.evaluate(seed,{'version':2})
    page.goto(base+'mobile/');r=wait_ready(page);assert page.locator('.library-item').count()==1;page.evaluate('window.__kenjatimeStartup.persist()');save('process-'+str(n+1),r);context.close()
finally:server.shutdown()
(OUT/'evidence.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result))
