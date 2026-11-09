"""Compare production Three.js stage output with immutable native observations."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
import base64, functools, hashlib, http.server, io, json, shutil, subprocess, threading
ROOT=Path(__file__).resolve().parents[2]
FIXTURE=ROOT/'test/fixtures/core/stages'
FIXTURES=json.loads((FIXTURE/'cases.json').read_text())
assert hashlib.sha256((FIXTURE/'pattern.sff').read_bytes()).hexdigest()==FIXTURES['spriteSha256']
for case in FIXTURES['cases']:
 assert hashlib.sha256((FIXTURE/(case['id']+'.png')).read_bytes()).hexdigest()==case['sha256']
OUT=ROOT/'work/core/stage-browser'
subprocess.run(['node','--input-type=module','-e',"import {build} from 'vite';await build({configFile:false,publicDir:false,base:'/',build:{outDir:'work/core/stage-browser',rollupOptions:{input:'scripts/core/stage-harness.html'}}});"],cwd=ROOT,check=True,stdout=subprocess.DEVNULL)
class Host(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
 def do_GET(self):
  files={'/fixtures/kfm.zip':ROOT/'public/kfm.zip','/fixtures/pattern.sff':FIXTURE/'pattern.sff'}
  if self.path in files:
   body=files[self.path].read_bytes();self.send_response(200);self.send_header('Content-Length',str(len(body)));self.end_headers();self.wfile.write(body)
  else:super().do_GET()
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Host,directory=str(OUT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
results=[]
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=shutil.which('chromium') or p.chromium.executable_path,headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
  page=browser.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(f'http://127.0.0.1:{server.server_port}/scripts/core/stage-harness.html');page.wait_for_function('typeof renderStage==="function"')
  for case in FIXTURES['cases']:
   result=page.evaluate('testCase=>renderStage(testCase)',case);image=Image.open(io.BytesIO(base64.b64decode(result.pop('png').split(',')[1]))).convert('RGB');image.save(OUT/(case['id']+'.png'))
   native=Image.open(FIXTURE/(case['id']+'.png')).convert('RGB');assert image.size==native.size==(320,180)
   x,y,w,h=case['roi'];actual=image.load();expected=native.load();different=[];edgeDifferences=0;tested=0
   # Native clear color is black; Core's clear is its authored training theme.
   # Compare all native colored pixels and reject extra Core pattern pixels.
   colors={(240,32,32),(32,224,64),(32,80,240),(240,224,32)}
   for yy in range(y,y+h):
    for xx in range(x,x+w):
     a,b=actual[xx,yy],expected[xx,yy]
     if a in colors or b in colors:
      tested+=1
      if a!=b:
       # Different OpenGL/WebGL rasterizers may place an edge one pixel apart.
       # Both directions must agree locally; interiors and missing tiles fail.
       neighbors=[(nx,ny) for ny in range(max(0,yy-1),min(180,yy+2)) for nx in range(max(0,xx-1),min(320,xx+2))]
       same=lambda c,d:c==d or c not in colors and d not in colors
       if any(same(a,expected[nx,ny]) for nx,ny in neighbors) and any(same(b,actual[nx,ny]) for nx,ny in neighbors):edgeDifferences+=1
       else:different.append((xx,yy,a,b))
   result.update(id=case['id'],testedPixels=tested,rasterEdgePixels=edgeDifferences,differentPixels=len(different));results.append(result)
   print(case['id'],tested,'pixels;',len(different),'interior differences;',edgeDifferences,'raster edge pixels;',len(result['draws']),'quads',flush=True)
   if different:print('First differences:',different[:8],flush=True)
   assert result['warmUploads']==0
  assert not errors,errors
  browser.close()
finally:server.shutdown();server.server_close()
(OUT/'evidence.json').write_text(json.dumps({'physicalPhone':False,'cases':results},indent=2)+'\n')
assert all(c['testedPixels']>0 and c['differentPixels']==0 for c in results), 'Stage rendering differs from the native fixtures.'
