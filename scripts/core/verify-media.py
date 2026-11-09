"""Original Lua/video/glTF fixtures through the production worker/main battle."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
import base64,functools,hashlib,http.server,io,json,shutil,subprocess,threading
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'work/core/media-browser';OUT.mkdir(parents=True,exist_ok=True)
subprocess.run(['ffmpeg','-loglevel','error','-y','-f','lavfi','-i','testsrc2=size=160x90:rate=12','-t','2','-c:v','libvpx','-b:v','120k','-an',str(OUT/'clip.webm')],check=True)
subprocess.run(['node','--input-type=module','-e',"import {build} from 'vite';await build({configFile:false,publicDir:false,base:'/',worker:{format:'es'},build:{outDir:'work/core/media-browser/build',rollupOptions:{input:'scripts/core/media-harness.html'}}});"],cwd=ROOT,check=True,stdout=subprocess.DEVNULL)
class Host(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
 def do_GET(self):
  fixture={'/fixtures/kfm.zip':ROOT/'public/kfm.zip','/fixtures/clip.webm':OUT/'clip.webm','/fixtures/pattern.sff':ROOT/'test/fixtures/core/stages/pattern.sff'}.get(self.path)
  if fixture:
   body=fixture.read_bytes();self.send_response(200);self.send_header('Content-Length',str(len(body)));self.end_headers();self.wfile.write(body)
  else:super().do_GET()
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Host,directory=str(OUT/'build')));threading.Thread(target=server.serve_forever,daemon=True).start();results=[]
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=shutil.which('chromium'),headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=user-gesture-required'])
  for mode in ['worker','main']:
   page=browser.new_page(viewport={'width':960,'height':720});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   if mode=='main':page.add_init_script('HTMLCanvasElement.prototype.transferControlToOffscreen=undefined;')
   page.goto(f'http://127.0.0.1:{server.server_port}/scripts/core/media-harness.html');page.wait_for_function('typeof mediaStart==="function"')
   for kind in ['video','model']:
    page.evaluate('kind=>mediaStart(kind)',kind)
    try:
     page.wait_for_function('window.__kenjatimeCoreState?.ticks>30',timeout=30000)
     assert page.evaluate('window.__kenjatimeCoreBattle.backend()')==mode
     assert page.evaluate('window.__kenjatimeCoreState.players[0].power')==123
     assert not page.evaluate('window.__kenjatimeCoreState.diagnostics'),page.evaluate('window.__kenjatimeCoreState.diagnostics')
     if kind=='video':page.wait_for_function('window.__kenjatimeCoreBattle.gpu()?.videoUploads>=4',timeout=15000)
     else:page.wait_for_function('window.__kenjatimeCoreBattle.gpu()?.model===true && window.__kenjatimeCoreBattle.gpu().shadowUpdates>0')
     stats=page.evaluate('window.__kenjatimeCoreBattle.gpu()');media=page.evaluate('window.__kenjatimeCoreBattle.videoStatus()')
     page.locator('.kenjatime-battle canvas').screenshot(path=str(OUT/(mode+'-'+kind+'.png')))
     if kind=='model':
      updates=stats['shadowUpdates'];page.wait_for_timeout(200);assert page.evaluate('window.__kenjatimeCoreBattle.gpu().shadowUpdates')==updates
     else:
      assert media['inFlight']<=1
      page.locator('[data-pause]').click();page.wait_for_function('window.__kenjatimeCoreState.paused');page.wait_for_timeout(150);paused=page.evaluate('window.__kenjatimeCoreBattle.videoStatus()');page.wait_for_timeout(200);after=page.evaluate('window.__kenjatimeCoreBattle.videoStatus()');assert paused['videos'][0]['time']==after['videos'][0]['time']
      page.locator('[data-pause]').click();page.wait_for_function('!window.__kenjatimeCoreState.paused')
      page.evaluate('Object.defineProperty(document,"hidden",{configurable:true,get:()=>true});document.dispatchEvent(new Event("visibilitychange"))');page.wait_for_function('window.__kenjatimeCoreState.background');page.wait_for_timeout(150);before=page.evaluate('window.__kenjatimeCoreBattle.videoStatus()');page.wait_for_timeout(300);after=page.evaluate('window.__kenjatimeCoreBattle.videoStatus()');assert after['frames']==before['frames'],{'before':before,'after':after};assert after['videos'][0]['time']!=before['videos'][0]['time'],{'before':before,'after':after};page.evaluate('delete document.hidden;document.dispatchEvent(new Event("visibilitychange"))')
     results.append({'backend':mode,'kind':kind,'gpu':stats,'media':media,'luaPower':123})
    finally:
     page.evaluate('window.__kenjatimeCoreBattle?.close()');assert page.locator('video').count()==0
   if mode=='main':
    animation=page.evaluate('modelProbe(true)');assert animation['start']!=animation['moved'];assert animation['start']==animation['rewound'];assert animation['warmUpdates']==0;results.append({'modelAnimationChangesPixels':True,'resetRestoresPixels':True,'warmShadowUpdates':0})
    probe=page.evaluate('modelProbe()');a=Image.open(io.BytesIO(base64.b64decode(probe['shadow'].split(',')[1]))).convert('RGB');b=Image.open(io.BytesIO(base64.b64decode(probe['unshadowed'].split(',')[1]))).convert('RGB');a.save(OUT/'shadow.png');b.save(OUT/'unshadowed.png');changed=sum(x!=y for x,y in zip(a.getdata(),b.getdata()));assert changed>30,{'pixels':changed,'lights':probe['lights']};results.append({'shadowPixels':changed,'lights':probe['lights']})
    fixture=json.loads((ROOT/'test/fixtures/core/resolution/cases.json').read_text());colors={(210,34,51),(36,190,81)}
    for case in fixture['cases']:
     native=ROOT/'test/fixtures/core/resolution'/(case['id']+'.png');assert hashlib.sha256(native.read_bytes()).hexdigest()==case['imageSha256']
     response=page.evaluate('([c,f])=>resolutionProbe(c,f)',[case,fixture]);actual=Image.open(io.BytesIO(base64.b64decode(response['png'].split(',')[1]))).convert('RGB');expected=Image.open(native).convert('RGB');actual.save(OUT/('resolution-'+case['id']+'.png'));a=actual.load();b=expected.load();bad=[];tested=0;edges=0
     for y in range(180):
      for x in range(320):
       if a[x,y] not in colors and b[x,y] not in colors:continue
       tested+=1
       if a[x,y]==b[x,y]:continue
       neighbors=[(xx,yy)for yy in range(max(0,y-1),min(180,y+2))for xx in range(max(0,x-1),min(320,x+2))]
       same=lambda c,d:c==d or c not in colors and d not in colors
       if any(same(a[x,y],b[xx,yy])for xx,yy in neighbors)and any(same(b[x,y],a[xx,yy])for xx,yy in neighbors):edges+=1
       else:bad.append((x,y,a[x,y],b[x,y]))
     result={'resolution':case['id'],'testedPixels':tested,'interiorDifferences':len(bad),'rasterEdgePixels':edges};print(result,flush=True);assert tested>500 and not bad,bad[:10];assert not response['diagnostics'],response['diagnostics'];results.append(result)
   assert not errors,errors;page.close()
  browser.close()
finally:server.shutdown();server.server_close()
(OUT/'evidence.json').write_text(json.dumps({'physicalPhone':False,'scope':'Original fixtures; no native 3D/video pixel parity claimed.','cases':results},indent=2)+'\n');print(json.dumps(results,indent=2))
