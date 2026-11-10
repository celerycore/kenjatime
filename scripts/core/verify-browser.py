"""Real independent worker/Three fight. No reference runtime is loaded."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import functools,http.server,json,os,shutil,threading
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'work/core';OUT.mkdir(parents=True,exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist-core')));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/';mode='worker-fallback' if os.environ.get('CORE_WORKER_FAIL') else 'main' if os.environ.get('CORE_MAIN') else 'worker';result={'physicalPhone':False,'backendTest':mode,'checks':{}}
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=shutil.which('chromium') or p.chromium.executable_path,headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=user-gesture-required'])
  page=browser.new_page(viewport={'width':960,'height':720},has_touch=True,accept_downloads=True);errors=[];failed=[];requests=[];page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:failed.append(r.url) if r.status>=400 and 'favicon' not in r.url else None);page.on('request',lambda r:requests.append(r.url));page.on('console',lambda m:print(m.text,flush=True) if m.type=='error' else None)
  
  if os.environ.get('CORE_WORKER_FAIL'):
   def fail_worker_gpu(route):
    response=route.fetch();route.fulfill(response=response,body="OffscreenCanvas.prototype.getContext=function(){throw Error('Fixture: worker GPU unavailable');};\n"+response.text())
   page.route('**/assets/worker-*.js',fail_worker_gpu)
  if os.environ.get('CORE_MAIN'):page.add_init_script('HTMLCanvasElement.prototype.transferControlToOffscreen=undefined;')
  page.goto(base+'core/index.html');page.wait_for_function("document.querySelector('#status').textContent==='Ready when you are.'",timeout=30000);assert page.locator('#core-qa-guide').is_visible();assert page.locator('#effects-select').count()==1;assert page.locator('#name').inner_text()=='Kung Fu Man';page.locator('#arena-mode').select_option('training');page.locator('#opponent-palette-select').select_option('1');page.locator('#fight-now').click()
  try:
   page.wait_for_function('window.__kenjatimeCoreState?.ticks>30',timeout=30000);page.wait_for_function('window.__kenjatimeCoreState.players.every(p=>p.state===0)',timeout=30000)
   assert page.evaluate('window.__kenjatimeCoreBattle.backend()')==('worker' if mode=='worker' else 'main')
   page.keyboard.down('ArrowRight');page.wait_for_function('Math.abs(window.__kenjatimeCoreState.players[1].x-window.__kenjatimeCoreState.players[0].x)<=35',timeout=10000);page.keyboard.up('ArrowRight');page.wait_for_timeout(100)
   before=page.evaluate('window.__kenjatimeCoreState.players[1].life');page.keyboard.down('KeyA');page.wait_for_timeout(100);page.keyboard.up('KeyA');page.wait_for_function(f'window.__kenjatimeCoreState.players[1].life<{before}',timeout=10000)
   state=page.evaluate('window.__kenjatimeCoreState');result['checks']['attackDamage']=before-state['players'][1]['life'];result['checks']['compiled']=state['expressions'];result['checks']['gpu']=page.evaluate('window.__kenjatimeCoreBattle.gpu()');page.wait_for_function('window.__kenjatimeCoreBattle.audioStatus().cachedSounds>0');result['checks']['audio']=page.evaluate('window.__kenjatimeCoreBattle.audioStatus()');assert page.locator('.core-hud meter:visible').count()==2;box=page.locator('.kenjatime-battle canvas').bounding_box();assert abs(box['width']/box['height']-16/9)<.02;page.locator('.kenjatime-battle canvas').screenshot(path=str(OUT/('independent-fight-'+mode+'.png')))
   # Explicit event injection is deterministic in headless Chromium. Timer tests
   # separately withhold rAF; this does not emulate an OS freezing a process.
   page.evaluate('for(const source of ["keyboard","gamepad","touch"])window.__kenjatimeCoreBattle.input(0,new Set(["R"]),source)');page.wait_for_function('window.__kenjatimeCoreState.players[0].state===20');page.evaluate('window.dispatchEvent(new Event("blur"))');page.wait_for_function('window.__kenjatimeCoreState?.focused===false && window.__kenjatimeCoreState.players[0].state===0');result['checks']['blurReleasesAllInputs']=True;before_focus=page.evaluate('window.__kenjatimeCoreState.ticks');page.wait_for_function(f'window.__kenjatimeCoreState.ticks>{before_focus+6}');assert not page.evaluate('window.__kenjatimeCoreState.paused')
   page.evaluate('Object.defineProperty(document,"hidden",{configurable:true,get:()=>true});document.dispatchEvent(new Event("visibilitychange"))');page.wait_for_function('window.__kenjatimeCoreState?.background===true');hidden_ticks=page.evaluate('window.__kenjatimeCoreState.ticks');hidden_frames=page.evaluate('window.__kenjatimeCoreBattle.gpu().frames');page.wait_for_function(f'window.__kenjatimeCoreState.ticks>{hidden_ticks+6}');assert page.evaluate('window.__kenjatimeCoreBattle.gpu().frames')==hidden_frames;assert not page.evaluate('window.__kenjatimeCoreState.paused')
   page.evaluate('delete document.hidden;document.dispatchEvent(new Event("visibilitychange"));window.dispatchEvent(new Event("focus"));window.dispatchEvent(new CustomEvent("kenjatime:app-state",{detail:{active:false}}))');page.wait_for_function('window.__kenjatimeCoreState?.background===true');app_ticks=page.evaluate('window.__kenjatimeCoreState.ticks');page.wait_for_function(f'window.__kenjatimeCoreState.ticks>{app_ticks+6}');assert not page.evaluate('window.__kenjatimeCoreState.paused');page.evaluate('window.dispatchEvent(new CustomEvent("kenjatime:app-state",{detail:{active:true}}))');page.wait_for_function('window.__kenjatimeCoreState?.background===false');result['checks'].update(blurKeepsRunning=True,hiddenKeepsSimulating=True,hiddenGpuStops=True,appInactiveDoesNotAutoPause=True)
   page.locator('[data-pause]').click();page.wait_for_function('window.__kenjatimeCoreState?.paused===true',timeout=10000);page.evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');a=page.evaluate('window.__kenjatimeCoreState');frames=page.evaluate('window.__kenjatimeCoreBattle.gpu().frames');page.wait_for_timeout(300);b=page.evaluate('window.__kenjatimeCoreState');assert a['ticks']==b['ticks'] and a['players']==b['players'],{'before':a,'after':b};assert page.evaluate('window.__kenjatimeCoreBattle.gpu().frames')==frames;result['checks']['pause']=True;page.evaluate('window.dispatchEvent(new Event("blur"));document.dispatchEvent(new Event("visibilitychange"));window.dispatchEvent(new Event("focus"))');page.wait_for_timeout(150);assert page.evaluate('window.__kenjatimeCoreState.paused');assert page.evaluate('window.__kenjatimeCoreState.ticks')==a['ticks'];result['checks']['focusPreservesManualPause']=True
   assert len(page.context.pages)==1;assert page.locator('.kenjatime-battle iframe').count()==0;assert not any('ikemen' in url.lower() or 'wasm_exec' in url or 'core.zip' in url for url in requests),requests
   assert not errors,errors;assert not failed,failed;page.locator('[data-menu]').click();assert page.locator('.kenjatime-battle').count()==0;assert page.evaluate('window.__kenjatimeCoreState===undefined');result['checks'].update(samePage=True,menuCleanup=True,noExternalEngineRequests=True,pausedGpuStops=True,twoVisibleLifeBars=True,fixedAspectRatio=True)
   assert page.evaluate('window.__kenjatimeCoreBattle===undefined')
   page.wait_for_function("!document.querySelector('#fight-now').disabled")
   page.locator('#fight-now').click();page.locator('[data-menu]').click();page.wait_for_function("!document.querySelector('#fight-now').disabled");assert page.locator('.kenjatime-battle').count()==0
   for _ in range(3):
    page.locator('#fight-now').click();page.wait_for_function('window.__kenjatimeCoreState?.ticks>3',timeout=30000);page.locator('[data-menu]').click();page.wait_for_function("!document.querySelector('#fight-now').disabled")
   result['checks'].update(earlyCancellation=True,repeatedSessions=3)
   if mode=='main':
    page.locator('#fight-now').click();page.wait_for_function('window.__kenjatimeCoreState?.ticks>3',timeout=30000);page.evaluate("document.querySelector('.kenjatime-battle canvas').getContext('webgl2').getExtension('WEBGL_lose_context').loseContext()");page.wait_for_function('window.__kenjatimeCoreBattle===undefined');page.wait_for_function("!document.querySelector('#fight-now').disabled");assert 'context was lost' in page.locator('#status').inner_text();result['checks']['contextLossReturnsToLibrary']=True
   assert not errors,errors
  finally:
   page.screenshot(path=str(OUT/('last-page-'+mode+'.png')),full_page=True);print('STATUS',page.locator('#status').inner_text(),flush=True);print('ERRORS',errors,failed,flush=True)
  browser.close()
finally:server.shutdown();server.server_close()
(OUT/('browser-'+mode+'-evidence.json')).write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
