"""Measure actual Go/worklet output during controlled 90ms render-worker stalls.
Host Chromium emulation, not a physical Android result.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import argparse,functools,http.server,json,os,shutil,threading
ROOT=Path(__file__).resolve().parent.parent
parser=argparse.ArgumentParser();parser.add_argument('--dist',default='dist');parser.add_argument('--label',default='after');args=parser.parse_args()
OUT=ROOT/'work/mobile-audio';OUT.mkdir(parents=True,exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/args.dist)))
threading.Thread(target=server.serve_forever,daemon=True).start()
probe="""(()=>{const original=AudioNode.prototype.connect;window.__outputProbe={active:false,samples:0,silent:0,peak:0};AudioNode.prototype.connect=function(destination,...rest){if(destination===this.context.destination&&this instanceof AudioWorkletNode){const analyser=this.context.createAnalyser();analyser.fftSize=128;const data=new Float32Array(128);original.call(this,analyser);original.call(analyser,destination,...rest);setInterval(()=>{const p=window.__outputProbe;if(!p.active)return;analyser.getFloatTimeDomainData(data);let peak=0;for(const v of data)peak=Math.max(peak,Math.abs(v));p.samples++;if(peak<.00001)p.silent++;p.peak=Math.max(p.peak,peak);},5);return destination;}return original.call(this,destination,...rest);};})();"""
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or p.chromium.executable_path,headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
  context=browser.new_context(viewport={'width':844,'height':390},is_mobile=True,has_touch=True);context.add_init_script(probe)
  page=context.new_page();workers=[];errors=[];page.on('worker',lambda w:workers.append(w));page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(f'http://127.0.0.1:{server.server_port}/mobile/');page.wait_for_function("document.querySelector('#status').textContent==='Ready when you are.'")
  with page.expect_file_chooser() as chosen:page.locator('#add-stage').click()
  chosen.value.set_files(str(ROOT/'work/go-av/stage-audio.zip'));page.wait_for_function("document.querySelector('#status').textContent.startsWith('Archive installed')")
  page.locator('#arena-mode').select_option('versus');page.locator('#fight-now').click();page.wait_for_function('window.__kenjatimeGoState?.roundState===2',timeout=90000)
  frame=page.frames[1]
  if not frame.evaluate('window.__kenjatimeFrame.audioStatus().running'):page.locator('[data-sound]').click()
  frame.wait_for_function('window.__kenjatimeFrame.audioStatus().running && window.__kenjatimeFrame.audioStatus().pcm.frames>0',timeout=30000)
  engine=next(w for w in workers if 'engine-worker-' in w.url)
  before=frame.evaluate('window.__kenjatimeFrame.audioStatus()');frame.evaluate('window.__outputProbe.active=true')
  engine.evaluate("globalThis.__audioStalls=0;globalThis.__audioJank=setInterval(()=>{globalThis.__audioStalls++;const end=performance.now()+90;while(performance.now()<end){}},500)")
  page.wait_for_timeout(10000)
  stalls=engine.evaluate('clearInterval(globalThis.__audioJank);globalThis.__audioStalls');after=frame.evaluate('window.__kenjatimeFrame.audioStatus()');output=frame.evaluate('window.__outputProbe')
  assert output['peak']>.01 and stalls>=15 and not errors,(output,stalls,errors)
  result={'label':args.label,'physicalPhone':False,'producerStallMs':90,'stallIntervalMs':500,'measurementSeconds':10,'stalls':stalls,'before':before,'after':after,'underrunsDuringStalls':after['pcm']['underruns']-before['pcm']['underruns'],'output':output,'errors':errors}
  (OUT/(args.label+'.json')).write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result));page.locator('[data-menu]').click();browser.close()
finally:server.shutdown()
