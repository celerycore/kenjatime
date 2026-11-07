"""Compare ordered packets on real WebGL2 with the pinned reference interpreter."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import functools,http.server,json,os,shutil,threading
ROOT=Path(__file__).resolve().parent.parent
class Handler(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
 def do_GET(self):
  if self.path=='/gpu-test':
   self.send_response(200);self.send_header('Content-Type','text/html');self.end_headers();self.wfile.write(b'<!doctype html><title>GPU regression</title><script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js"}}</script>');return
  super().do_GET()
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or p.chromium.executable_path,headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
  page=browser.new_page();page.goto(f'http://127.0.0.1:{server.server_port}/gpu-test')
  result=page.evaluate("async()=>{const {verifyPixels}=await import('/test/fixtures/webgl-pixels.js');return{native:verifyPixels(),three:verifyPixels(true)};}")
  browser.close()
finally:server.shutdown()
output=ROOT/'work/gpu-rewrite/pixel-evidence.json';output.parent.mkdir(parents=True,exist_ok=True);output.write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result))
