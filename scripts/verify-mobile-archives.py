"""Exercise downloaded MUGEN archives, original-byte exports and v1 migration."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import functools,hashlib,http.server,json,os,shutil,subprocess,threading,zipfile
ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'work/mobile-app-qa';OUT.mkdir(parents=True,exist_ok=True)
subprocess.run(['node','--input-type=module','-e',"import{readFileSync,writeFileSync}from'node:fs';import{unzipSync}from'fflate';import{rar4,rar5}from'./test/fixtures/rar-fixtures.js';const files=Object.entries(unzipSync(readFileSync('test/fixtures/multi-archive/fighter.zip')));for(const[n,make]of[['rar4',rar4],['rar5',rar5]])writeFileSync('work/mobile-app-qa/fighter-'+n+'.rar',make(files));"],cwd=ROOT,check=True)
with zipfile.ZipFile(ROOT/'test/fixtures/multi-archive/fighter.zip') as z:z.extractall(OUT/'password-input')
protected=OUT/'fighter-password.zip'
if protected.exists():protected.unlink()
subprocess.run(['zip','-q','-r','-P','mugen',str(protected),'.'],cwd=OUT/'password-input',check=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
threading.Thread(target=server.serve_forever,daemon=True).start()
result={'physicalAndroid':False,'formats':[]}
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or p.chromium.executable_path,headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
  context=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,accept_downloads=True);page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  base=f'http://127.0.0.1:{server.server_port}/';page.goto(base+'engine/index.html')
  page.evaluate("""async()=>{const req=indexedDB.open('kenjatime.engine.library',1);await new Promise((yes,no)=>{req.onupgradeneeded=()=>{const db=req.result;db.createObjectStore('packages',{keyPath:'id'});db.createObjectStore('files',{keyPath:'path'}).createIndex('packageId','packageId');};req.onsuccess=yes;req.onerror=no;});const db=req.result,tx=db.transaction(['packages','files'],'readwrite');tx.objectStore('packages').put({id:'11111111-1111-4111-8111-111111111111',name:'Before update.zip',characters:[],stages:[]});tx.objectStore('files').put({path:'imports/old/saved.txt',packageId:'11111111-1111-4111-8111-111111111111',blob:new Blob(['saved bytes'])});await new Promise((yes,no)=>{tx.oncomplete=yes;tx.onerror=no;});db.close();}""")
  page.goto(base+'mobile/');page.wait_for_function("document.querySelector('#status').textContent==='Ready when you are.'")
  assert page.locator('.library-item').filter(has_text='Before update.zip').count()==1
  assert page.evaluate("""async()=>{const r=indexedDB.open('kenjatime.engine.library');await new Promise(y=>r.onsuccess=y);const db=r.result,q=db.transaction('files').objectStore('files').get('imports/old/saved.txt');await new Promise(y=>q.onsuccess=y);const text=await q.result.blob.text();db.close();return text;}""")=='saved bytes'
  result['version1LibraryPreserved']=True
  formats=['zip','bzip2.zip','lzma.zip','7z','tar','tar.gz','tar.bz2','tar.xz','tar.zst','cpio']
  cases=[(ROOT/'test/fixtures/multi-archive'/('fighter.'+f),'fighter.'+f,'') for f in formats]
  cases += [(ROOT/'test/fixtures/multi-archive/fighter-sfx.zip','fighter-sfx.zip',''),(OUT/'fighter-rar4.rar','fighter-rar4.rar',''),(OUT/'fighter-rar5.rar','fighter-rar5.rar',''),(protected,protected.name,'mugen')]
  cases += [(ROOT/'test/fixtures/multi-archive'/('fighter.'+ext),'fighter.'+alias,'') for ext,alias in [('tar.gz','tgz'),('tar.bz2','tbz2'),('tar.xz','txz'),('tar.zst','tzst')]]
  for archive,name,password in cases:
   if password:
    page.locator('.archive-options summary').click();page.locator('#archive-password').fill(password)
   with page.expect_file_chooser() as chosen:page.locator('#browse').click()
   chosen.value.set_files({'name':name,'mimeType':'application/octet-stream','buffer':archive.read_bytes()})
   page.wait_for_function("document.querySelector('#status').textContent.startsWith('Archive installed') && !document.querySelector('#browse').disabled",timeout=60000)
   row=page.locator('.library-item').filter(has_text=name).last
   with page.expect_download() as saved:row.get_by_role('button',name='Save archive',exact=True).click()
   download=saved.value;assert download.suggested_filename==name
   digest=hashlib.sha256(Path(download.path()).read_bytes()).hexdigest();assert digest==hashlib.sha256(archive.read_bytes()).hexdigest()
   page.wait_for_function("!document.querySelector('#browse').disabled")
   result['formats'].append({'name':name,'imported':True,'originalDownloadSha256':digest,'password':bool(password)});print('PASS '+name,flush=True)
  page.reload();page.wait_for_function("document.querySelector('#status').textContent==='Ready when you are.'")
  assert page.locator('.library-item button').filter(has_text='Save archive').count()==len(cases)
  # Delete removes both the installed files and the saved original, while
  # the package created by the older app remains available after the upgrade.
  for _ in cases:
   page.locator('.library-item').filter(has=page.get_by_role('button',name='Save archive',exact=True)).first.get_by_role('button',name='Delete',exact=True).click()
   page.wait_for_function("document.querySelector('#status').textContent==='Package removed from this app. The source archive is unchanged.' && !document.querySelector('#browse').disabled")
  assert page.evaluate("""async()=>{const r=indexedDB.open('kenjatime.engine.library');await new Promise(y=>r.onsuccess=y);const db=r.result,q=db.transaction('archives').objectStore('archives').count();await new Promise(y=>q.onsuccess=y);db.close();return q.result;}""")==0
  assert page.locator('.library-item').filter(has_text='Before update.zip').count()==1
  assert not errors,errors;result.update({'downloadSurvivesReload':True,'deleteCleansSavedArchive':True,'errors':errors});browser.close()
finally:server.shutdown()
(OUT/'archives.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result))
