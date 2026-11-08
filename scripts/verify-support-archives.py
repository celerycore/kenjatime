"""Real multi-file picker/worker/store/download round trips on every shipped route."""
from pathlib import Path
from zipfile import ZipFile
from playwright.sync_api import sync_playwright
import functools,http.server,io,json,os,shutil,subprocess,threading
ROOT=Path(__file__).resolve().parent.parent;os.chdir(ROOT)
subprocess.run(['node','scripts/generate-support-archives.mjs'],check=True)
fixtures=ROOT/'work/support-archives';cases=json.loads((fixtures/'manifest.json').read_text());out={'physicalAndroid':False,'imports':[]}
# Info-ZIP produces a genuine central-directory spanned ZIP, not split byte slices.
source=fixtures/'spanned-input';source.mkdir(exist_ok=True)
with ZipFile(ROOT/'test/fixtures/multi-archive/fighter.zip') as z:z.extractall(source)
(source/'padding.bin').write_bytes(bytes(range(256))*1024)
for old in fixtures.glob('spanned.*'):
 if old.is_file():old.unlink()
subprocess.run(['zip','-q','-s','64k','-0','-r',str(fixtures/'spanned.zip'),'.'],cwd=source,check=True)
cases.append({'label':'spanned-zip','password':'','parts':['spanned.zip']+[p.name for p in sorted(fixtures.glob('spanned.z[0-9]*'))]})
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=shutil.which('chromium') or p.chromium.executable_path,headless=True,args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':390,'height':844},accept_downloads=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  def install(parts,password='',success=True):
   page.locator('.archive-options').evaluate('(e)=>e.open=true');page.locator('#archive-password').fill(password)
   with page.expect_file_chooser() as chooser:page.locator('#browse').click()
   assert chooser.value.is_multiple();chooser.value.set_files(parts)
   page.wait_for_function("!document.querySelector('#browse').disabled",timeout=60000)
   if success:page.wait_for_function("document.querySelector('#status').textContent.startsWith('Archive installed')",timeout=60000);assert page.locator('#name').inner_text()=='Archive Fixture'
  for route in ['','arena/','arena-classic/','mobile/']:
   page.goto(base+route+'index.html');page.wait_for_function("document.querySelector('#status').textContent==='Ready when you are.'")
   for case in cases:
    paths=[str(fixtures/n) for n in reversed(case['parts'])];install(paths,case['password'])
    with page.expect_download(timeout=60000) as download:page.locator('.library-item').filter(has_text=case['parts'][0]).last.get_by_role('button',name='Save archive',exact=True).click()
    saved=Path(download.value.path()).read_bytes()
    if len(paths)==1:assert saved==Path(paths[0]).read_bytes()
    else:
     with ZipFile(io.BytesIO(saved)) as z:
      manifest=json.loads(z.read('kenjatime-volumes.json'));assert set(manifest['parts'])==set(case['parts'])
      for n in case['parts']:assert z.read(n)==(fixtures/n).read_bytes()
    out['imports'].append({'route':route,'archive':case['label'],'parts':len(paths),'downloadExact':True})
   install({'name':'saved-volumes.zip','mimeType':'application/zip','buffer':saved});page.reload();page.wait_for_function("document.querySelector('#status').textContent==='Ready when you are.'");assert page.locator('#name').inner_text()=='Archive Fixture'
  count=page.locator('#library-count').inner_text();install([str(fixtures/n) for n in cases[0]['parts']],'wrong',False);assert 'password' in page.locator('#status').inner_text().lower();assert page.locator('#library-count').inner_text()==count
  split=next(c for c in cases if c['label']=='split-7z');assert len(split['parts'])>=3;install([str(fixtures/split['parts'][0]),str(fixtures/split['parts'][2])],'secret',False);assert 'missing' in page.locator('#status').inner_text().lower();assert page.locator('#library-count').inner_text()==count
  assert not errors,errors;out.update(bundleReimport=True,reloadPreservesImports=True,wrongPasswordPreservesLibrary=True,missingPartPreservesLibrary=True,errors=errors);browser.close()
finally:server.shutdown();server.server_close()
(ROOT/'work/support-archives/evidence.json').write_text(json.dumps(out,indent=2)+'\n');print('PASS',len(out['imports']),'imports/downloads across four routes, bundle reimport, reload and failure recovery')
