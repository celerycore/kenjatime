"""Fight inside the existing page, including phones that reject fullscreen.

Chromium mobile emulation; this does not claim physical Android execution.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import functools,http.server,json,os,shutil,threading

ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'work/embedded-battle';OUT.mkdir(parents=True,exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
threading.Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}/'
probe="""(()=>{
 window.__viewSwitches=[];
 window.open=()=>{window.__viewSwitches.push('popup');throw Error('Popup rejected');};
 Element.prototype.requestFullscreen=function(){window.__viewSwitches.push('fullscreen');return Promise.reject(Error('Fullscreen rejected'));};
 if(screen.orientation)screen.orientation.lock=()=>{window.__viewSwitches.push('orientation');return Promise.reject(Error('Orientation rejected'));};
})();"""
result={'physicalPhone':False,'cases':{}}
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or p.chromium.executable_path,headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
  cases=[('phone-portrait',384,844,'arena-classic/'),('phone-landscape',844,390,'mobile/'),('desktop',1280,900,'arena/')]
  for name,width,height,route in cases:
   context=browser.new_context(viewport={'width':width,'height':height},is_mobile=name.startswith('phone'),has_touch=name.startswith('phone'))
   context.add_init_script(probe)
   if os.environ.get('MUGEN_QA_MAIN_FALLBACK'):context.add_init_script('HTMLCanvasElement.prototype.transferControlToOffscreen=undefined;')
   page=context.new_page();errors=[];requests=[];workers=[];closed=[]
   page.on('pageerror',lambda e:errors.append(str(e)))
   page.on('worker',lambda w:(workers.append(w),w.on('close',lambda _:closed.append(w.url))))
   page.on('response',lambda r:requests.append(r.url) if r.status>=400 and 'favicon' not in r.url else None)
   page.goto(base+route);page.wait_for_function("document.querySelector('#status').textContent==='Ready when you are.'")
   url=page.url
   page.locator('#arena-mode').select_option('versus');page.locator('#fight-now').click()
   page.wait_for_function("window.__kenjatimeGoState?.matchTime>=120 && window.__kenjatimeGoState.players.every(p=>p.state===0)",timeout=90000)
   assert page.url==url and len(context.pages)==1
   assert page.evaluate('window.__viewSwitches.length===0 && document.fullscreenElement===null')
   assert page.locator('.viewer > .stage > .kenjatime-battle iframe').count()==1
   assert page.evaluate("getComputedStyle(document.body).overflow!=='hidden' && getComputedStyle(document.querySelector('.kenjatime-battle')).position!=='fixed'")
   frame=page.frames[1];state=frame.evaluate('window.__kenjatimeFrame.snapshot()')
   assert all(.04<p['screenX']<.96 and .4<p['screenY']<1 for p in state['players']),state
   backend=frame.evaluate('window.__kenjatimeFrame.backend()')
   # The video and both groups of touch buttons fit together after scrolling
   # to the match. The browser remains free to scroll the rest of the page.
   layout=page.evaluate("""()=>{const box=s=>{const b=document.querySelector(s).getBoundingClientRect();return{x:b.x,y:b.y,width:b.width,height:b.height};};return{video:box('.kenjatime-battle iframe'),controls:box('.kenjatime-battle .touch-controls'),bar:box('.kenjatime-battle-bar'),width:innerWidth,height:innerHeight};}""")
   for box in [layout['video'],layout['controls'],layout['bar']]:
    assert box['width']>0 and box['height']>0 and box['x']>=0 and box['x']+box['width']<=width+1,layout
    assert box['y']>=-1 and box['y']+box['height']<=height+1,layout
   assert abs(layout['video']['width']/layout['video']['height']-854/480)<.01,layout
   page.screenshot(path=str(OUT/(name+'.png')))
   page.locator('[data-pause]').click();page.wait_for_function('window.__kenjatimeGoState.paused')
   page.locator('[data-menu]').click();page.wait_for_function("!document.querySelector('.kenjatime-battle') && document.querySelector('#status').textContent==='Ready when you are.'")
   assert page.locator('.viewer > .stage > canvas').is_visible()
   assert page.locator('.details').is_visible()
   assert page.evaluate('window.__kenjatimeGoState===undefined && !document.querySelector(".kenjatime-viewer-playing")')
   if backend.startswith('worker-'):
    for _ in range(20):
     if any('engine-worker-' in url for url in closed):break
     page.wait_for_timeout(25)
    assert any('engine-worker-' in url for url in closed),closed
   assert not errors and not requests,(errors,requests)
   result['cases'][name]={'backend':backend,'samePage':True,'noPopupFullscreenOrRotation':True,'bothFightersPositioned':True,'layout':layout,'pause':True,'menuRestoresPreview':True,'errors':errors}
   print('PASS '+name,flush=True);context.close()
  # A failed frame module must restore setup with an actionable message,
  # rather than leave a blank fight or a permanent Preparing screen.
  context=browser.new_context();page=context.new_page()
  engine_asset=json.loads((ROOT/'dist/.vite/manifest.json').read_text())['engine/index.html']['file']
  page.route('**/'+engine_asset+'*',lambda route:route.abort())
  page.goto(base+'arena-classic/');page.wait_for_function("document.querySelector('#status').textContent==='Ready when you are.'")
  page.locator('#fight-now').click();page.wait_for_function("document.querySelector('#status').textContent.includes('fight view could not load') && !document.querySelector('.kenjatime-battle')")
  assert page.locator('.viewer > .stage > canvas').is_visible()
  result['frameLoadFailureRestoresSetup']=True
  page.unroute('**/'+engine_asset+'*');page.locator('#fight-now').click()
  page.wait_for_function('window.__kenjatimeGoState?.players.length===2',timeout=90000)
  page.locator('[data-menu]').click();result['retryAfterFrameLoadFailure']=True
  context.close();browser.close()
finally:server.shutdown()
(OUT/('main-fallback.json' if os.environ.get('MUGEN_QA_MAIN_FALLBACK') else 'evidence.json')).write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result))
