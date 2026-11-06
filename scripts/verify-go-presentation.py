"""Exercise both fighters, stage PCM output, sparks and HUD pixels in real Go/WASM."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
import functools,http.server,io,json,math,os,shutil,struct,threading,wave,zipfile

ROOT=Path(__file__).resolve().parent.parent;os.chdir(ROOT)
OUT=ROOT/'work/go-av';OUT.mkdir(parents=True,exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
# Deliberately use a flattened audio file, a sound/ reference and provider-style casing.
with zipfile.ZipFile('public/engine/core.zip') as core:
 stage=core.read('stages/kenjatime-grid.def').decode().replace('[BGDef]','[Music]\nbgmusic = sound/Tone.wav\nbgmvolume = 80\nbgmloop = 1\n[BGDef]')
 sprite=core.read('stages/kenjatime-grid.sff')
audio=io.BytesIO()
with wave.open(audio,'wb') as w:
 w.setnchannels(1);w.setsampwidth(2);w.setframerate(22050);w.writeframes(b''.join(struct.pack('<h',round(math.sin(i*2*math.pi*440/22050)*6000)) for i in range(22050)))
fixture=OUT/'stage-audio.zip'
with zipfile.ZipFile(fixture,'w',zipfile.ZIP_DEFLATED) as z:
 z.writestr('Stage/stages/Presentation.DEF',stage);z.writestr('Stage/stages/kenjatime-grid.sff',sprite);z.writestr('Stage/stages/Tone.wav',audio.getvalue())

probe="""(()=>{if(!window.AudioContext)return;const original=AudioContext.prototype.createScriptProcessor;window.__pcmProbe={buffers:0,peak:0};AudioContext.prototype.createScriptProcessor=function(...args){const node=original.apply(this,args),add=node.addEventListener.bind(node);node.addEventListener=(type,fn,...rest)=>add(type,type==='audioprocess'?event=>{fn(event);const data=event.outputBuffer.getChannelData(0);let peak=0;for(let i=0;i<data.length;i+=8)peak=Math.max(peak,Math.abs(data[i]));window.__pcmProbe.buffers++;window.__pcmProbe.peak=Math.max(window.__pcmProbe.peak,peak);}:fn,...rest);return node;};})();"""
evidence={'phoneExecution':False,'checks':{}}
def colors(path):
 im=Image.open(path).convert('RGB');upper=im.crop((0,0,im.width,im.height//2));counts=upper.getcolors(upper.width*upper.height) or []
 return {'p1':sum(n for n,c in counts if c==(211,251,141)),'p2':sum(n for n,c in counts if c==(143,207,255)),'damage':sum(n for n,c in counts if c==(231,128,116))}
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or p.chromium.executable_path,headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=document-user-activation-required'])
  context=browser.new_context(viewport={'width':844,'height':390},is_mobile=True,has_touch=True);context.add_init_script(probe)
  page=context.new_page();page.set_default_timeout(60000);errors=[];requests=[];page.on('pageerror',lambda e:errors.append(str(e)));page.on('request',lambda r:requests.append(r.url))
  page.goto(base+'arena-classic/');page.wait_for_function("document.querySelector('#status').textContent==='Ready when you are.'");page.wait_for_function("document.querySelector('canvas').dataset.previewCount==='2'")
  page.locator('.viewer').screenshot(path=str(OUT/'two-fighter-preview.png'));evidence['checks']['twoPreviewFighters']=True;print('PASS two-fighter preview',flush=True)
  with page.expect_file_chooser() as chosen:page.locator('#add-stage').click()
  chosen.value.set_files(str(fixture));page.wait_for_function("document.querySelector('#status').textContent.startsWith('Archive installed')")
  page.locator('#arena-mode').select_option('versus');page.locator('#fight-now').click();page.wait_for_function("window.__kenjatimeGoState?.players.length===2 && window.__kenjatimeGoState.players.every(p=>p.state===0)",timeout=90000)
  frame=page.frames[1];frame.wait_for_function("window.__kenjatimeFrame.snapshot().music.streaming",timeout=30000)
  state=frame.evaluate('window.__kenjatimeFrame.snapshot()');assert state['music']['file'].endswith('/tone.wav'),state
  from urllib.parse import urlparse,parse_qs
  assets=[u for u in requests if urlparse(u).path.split('/')[-1] in ['core.zip','wasm_exec.js','ikemen.wasm.bin'] or '/engine/index.html' in u]
  versions=[parse_qs(urlparse(u).query).get('v') for u in assets];assert len(assets)==4 and all(versions) and all(v==versions[0] for v in versions),(assets,versions)
  evidence['checks']['engineCacheRevision']=versions[0][0]
  assert all(.04<p['screenX']<.96 and .4<p['screenY']<1 for p in state['players']),state
  assert abs(state['effects']['commonScale']-1)<.001,state
  # Explicitly test mute and user-gesture resume, rather than disabling autoplay policy.
  if frame.evaluate('window.__kenjatimeFrame.audioStatus().running'):page.locator('[data-sound]').click()
  frame.wait_for_function('!window.__kenjatimeFrame.audioStatus().running')
  page.locator('[data-sound]').click();frame.wait_for_function('window.__kenjatimeFrame.audioStatus().running')
  page.wait_for_timeout(1000);frame.evaluate('window.__pcmProbe={buffers:0,peak:0}')
  frame.wait_for_function('window.__pcmProbe.peak>.01 && window.__pcmProbe.buffers>2',timeout=30000)
  evidence['checks']['stageAudio']={'music':state['music'],'pcm':frame.evaluate('window.__pcmProbe'),'audio':frame.evaluate('window.__kenjatimeFrame.audioStatus()')}
  print('PASS stage PCM output and audio unlock',flush=True)
  page.locator('[data-pause]').click();page.wait_for_function('window.__kenjatimeGoState.paused');page.screenshot(path=str(OUT/'hud-before.png'));before=colors(OUT/'hud-before.png');assert before['p1']>500 and before['p2']>500,before
  evidence['checks']['hudBefore']=before;page.locator('[data-pause]').click()
  cdp=context.new_cdp_session(page)
  def point(selector,id=1):
   b=page.locator(selector).bounding_box();return {'id':id,'x':b['x']+b['width']/2,'y':b['y']+b['height']/2}
  cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[point('[data-input="R"]')]})
  page.wait_for_function("Math.abs(window.__kenjatimeGoState.players[1].x-window.__kenjatimeGoState.players[0].x)<=33",timeout=15000)
  frame.evaluate("""()=>{window.__sparkCapture=null;const before=window.__kenjatimeFrame.snapshot().players[1].life;const timer=setInterval(()=>{const s=window.__kenjatimeFrame.snapshot();if(s.effects.activeCommon>0&&s.players[1].life<before){window.__sparkCapture=s;window.__kenjatimeFrame.pause(true);clearInterval(timer);}},10);window.__captureTimer=timer;}""")
  cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[point('[data-input="R"]'),point('.touch-buttons [data-input="x"]',2)]});cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
  frame.wait_for_function('window.__sparkCapture!==null',timeout=15000);page.locator('[data-pause]').click();page.wait_for_timeout(400);page.screenshot(path=str(OUT/'hit-spark-and-hud.png'))
  hit=frame.evaluate('window.__sparkCapture');after=colors(OUT/'hit-spark-and-hud.png');assert after['p2']<before['p2'] and after['damage']>0,(before,after)
  assert all(.08<p['screenX']<.92 for p in hit['players']),hit
  im=Image.open(OUT/'hit-spark-and-hud.png').convert('RGB');pixels=im.crop((0,im.height//3,im.width,im.height)).tobytes();sparks=sum(1 for i in range(0,len(pixels),3) if pixels[i]>225 and pixels[i+1]>120 and pixels[i+2]<125);assert sparks>5,sparks
  # The defender overlaps this area: health text must draw above the fighter.
  scale=im.height/540;left=(im.width-im.height*854/480)/2;x=left+912*scale;y=176*scale
  hp=im.crop((round(x-48*scale),round(y-22*scale),round(x+2*scale),round(y+3*scale))).tobytes();healthPixels=sum(1 for i in range(0,len(hp),3) if min(hp[i:i+3])>185 and max(hp[i:i+3])-min(hp[i:i+3])<10);assert healthPixels>5,healthPixels
  evidence['checks']['defenderHealthTextPixels']=healthPixels
  evidence['checks'].update({'fightersVisibleAtContact':True,'normalCommonSparkScale':hit['effects']['commonScale'],'visibleSparkPixels':sparks,'hudAfterHit':after,'hitState':hit})
  print('PASS corner framing, spark and foreground HUD pixels',flush=True)
  page.locator('[data-menu]').click();assert page.locator('.kenjatime-battle').count()==0;assert not errors,errors;evidence['errors']=errors;browser.close()
finally:server.shutdown()
(OUT/'presentation-evidence.json').write_text(json.dumps(evidence,indent=2)+'\n');print(json.dumps(evidence))
