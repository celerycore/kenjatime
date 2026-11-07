"""Exercise worker ownership, standard controller forwarding and teardown."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import functools,http.server,json,os,shutil,threading
ROOT=Path(__file__).resolve().parent.parent;os.chdir(ROOT)
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
threading.Thread(target=server.serve_forever,daemon=True).start()
probe="""(()=>{window.__rumble=[];window.__pad={index:0,id:'DualSense test fixture',mapping:'standard',axes:[0,0,0,0],buttons:Array.from({length:17},()=>({pressed:false,value:0})),vibrationActuator:{playEffect:(kind,options)=>{window.__rumble.push({kind,options});return Promise.resolve();}}};window.__pads=[];navigator.getGamepads=()=>window.__pads;})();"""
result={}
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or p.chromium.executable_path,headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
  context=browser.new_context(viewport={'width':854,'height':480});context.add_init_script(probe);page=context.new_page();workers=[];closed=set();errors=[]
  page.on('worker',lambda w:(workers.append(w),w.on('close',lambda _:closed.add(w.url))));page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(f'http://127.0.0.1:{server.server_port}/arena-classic/');page.wait_for_function("document.querySelector('#status').textContent==='Ready when you are.'")
  page.locator('#arena-mode').select_option('versus');page.locator('#fight-now').click();page.wait_for_function("window.__kenjatimeGoState?.matchTime>=120 && window.__kenjatimeGoState.players.every(p=>p.state===0)",timeout=90000)
  frame=page.frames[1];assert frame.evaluate('window.__kenjatimeFrame.backend()')=='worker-three'
  engine=next(w for w in workers if 'engine-worker-' in w.url)
  initial=frame.evaluate('window.__kenjatimeFrame.snapshot()');assert abs(initial['players'][0]['x']-initial['players'][1]['x'])>100,initial
  frame.evaluate('window.__pads=[window.__pad];window.__pad.buttons[15]={pressed:true,value:1}')
  page.wait_for_function(f"window.__kenjatimeGoState.players[0].x>{initial['players'][0]['x']+15}",timeout=5000)
  frame.evaluate('window.__pads=[]');page.wait_for_function('window.__kenjatimeGoState.players[0].state===0',timeout=5000)
  stopped=frame.evaluate('window.__kenjatimeFrame.snapshot()');page.wait_for_timeout(250);assert abs(frame.evaluate('window.__kenjatimeFrame.snapshot()')['players'][0]['x']-stopped['players'][0]['x'])<.1
  frame.evaluate('window.__pads=[window.__pad];window.__pad.buttons[15]={pressed:false,value:0}')
  page.wait_for_timeout(100)
  engine.evaluate("globalThis.__kenjatimeGamepads[0].vibrationActuator.playEffect('dual-rumble',{duration:10,strongMagnitude:.5,weakMagnitude:.25})")
  frame.wait_for_function('window.__rumble.length===1');assert frame.evaluate('window.__rumble[0].options.strongMagnitude')==.5
  frame.locator('canvas').click();leftStart=frame.evaluate('window.__kenjatimeFrame.snapshot().players[0].x');page.keyboard.down('ArrowLeft');page.wait_for_function(f'window.__kenjatimeGoState.players[0].x<{leftStart-4}',timeout=5000);page.keyboard.up('ArrowLeft');page.wait_for_function('window.__kenjatimeGoState.players[0].state===0',timeout=5000)
  page.locator('[data-quality]').click();frame.wait_for_function('window.__kenjatimeGPU?.quality===\"sharp\" && window.__kenjatimeGPU.renderScale===1');assert frame.evaluate('window.__kenjatimeFrame.snapshot().camera.width')==initial['camera']['width']
  page.locator('[data-pause]').click();page.wait_for_function('window.__kenjatimeGoState.paused');frozen=frame.evaluate('window.__kenjatimeFrame.snapshot().players');page.wait_for_timeout(250);assert frame.evaluate('window.__kenjatimeFrame.snapshot().players')==frozen
  page.locator('[data-menu]').click();page.wait_for_timeout(100);assert engine.url in closed,closed;assert page.evaluate('window.__kenjatimeGoState===undefined')
  assert not errors,errors;result={'workerThree':True,'matchPositionReady':True,'standardGamepadMovement':True,'physicalKeyForwarding':True,'disconnectReleasesInput':True,'rumbleBridge':True,'qualityTogglePreservesLogicalCamera':True,'pauseFreezesFighters':True,'menuTerminatesWorker':True,'errors':errors,'physicalController':False};browser.close()
finally:server.shutdown()
output=ROOT/'work/browser-runtime/controller-lifecycle.json';output.parent.mkdir(parents=True,exist_ok=True);output.write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result))
