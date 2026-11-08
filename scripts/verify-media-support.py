"""Exercise shipping Go/Three module audio, stage video and glTF model shadows."""
from pathlib import Path
from zipfile import ZipFile
from playwright.sync_api import sync_playwright
from PIL import Image,ImageChops
import argparse,copy,http.server,importlib.util,json,os,shutil,threading,time
ROOT=Path(__file__).resolve().parent.parent;OUT=ROOT/'work/support-media';OUT.mkdir(parents=True,exist_ok=True)
spec=importlib.util.spec_from_file_location('character_runner',ROOT/'scripts/verify-characters.py');runner=importlib.util.module_from_spec(spec);spec.loader.exec_module(runner)

def resources(kind,variant=''):
 with ZipFile(ROOT/'public/engine/core.zip') as z:files=runner.unpack(z)
 files.update(runner.fixture_files())
 stage=files['stages/kenjatime-grid.def'].decode().split('[BGDef]')[0]
 if kind=='module':
  files['stages/tone.'+variant]=(ROOT/'test/fixtures/media'/('tone.'+variant)).read_bytes()
  stage+='\n[Music]\nbgmusic=tone.'+variant+'\nbgmloop=1\nbgmvolume=100\n[BGDef]\nspr=kenjatime-grid.sff\n'
 elif kind=='video':
  files['stages/colors.'+variant]=(ROOT/'test/fixtures/media'/('colors.'+variant)).read_bytes()
  stage+='\n[BGDef]\nspr=kenjatime-grid.sff\n[BG Video]\ntype=video\npath=colors.'+variant+'\nstart=-427,0\ndelta=0,0\nscalemode=stretch\nloop=1\nvolume=100\n'
 else:
  model=json.loads((ROOT/'test/fixtures/media/shadow.gltf').read_text());light,*middle,cast=variant.split('-')
  model['extensions']['KHR_lights_punctual']['lights'][0]['type']=light
  if light=='spot':model['extensions']['KHR_lights_punctual']['lights'][0]['spot']={'innerConeAngle':.1,'outerConeAngle':.75}
  if light!='directional':model['extensions']['KHR_lights_punctual']['lights'][0]['intensity']=80
  if 'alpha' in middle:
   model['images']=[{'uri':'mask.png'}];model['textures']=[{'source':0}];model['materials'][1].update(alphaMode='MASK',alphaCutoff=.5);model['materials'][1]['pbrMetallicRoughness'].update(baseColorFactor=[1,1,1,1],baseColorTexture={'index':0});files['stages/mask.png']=(ROOT/'test/fixtures/media/mask.png').read_bytes()
  if cast=='off':model['nodes'][1]['extras']={'castShadow':'false'}
  files['stages/shadow.gltf']=json.dumps(model).encode();files['stages/shadow.bin']=(ROOT/'test/fixtures/media/shadow.bin').read_bytes()
  stage+='\n[BGDef]\nmodel=shadow.gltf\n[Model]\noffset=0,0,-6\nscale=1,1,1\n'
 files['stages/kenjatime-grid.def']=stage.encode()
 args=['-config','data/kenjatime/config.ini','-p1','chars/verification-actor/fighter.def','-p2','chars/verification-victim/fighter.def','-p1.ai','0','-p2.ai','0','-time','-1','-rounds','99']
 return files,args

def main():
 global OUT
 parser=argparse.ArgumentParser();parser.add_argument('--case');parser.add_argument('--quality',choices=['high','low'],default='high');parser.add_argument('--main-thread',action='store_true');parser.add_argument('--group',choices=['module','video','shadow','all'],default='all');options=parser.parse_args();OUT=OUT/('main' if options.main_thread else options.quality);OUT.mkdir(parents=True,exist_ok=True);report={'physicalAndroid':False,'quality':options.quality,'mainThread':options.main_thread,'checks':[]}
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or p.chromium.executable_path,headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=user-gesture-required'])
  try:
   cases=([('module',n) for n in ['mod','xm','it','s3m']] if options.group in ['module','all'] else [])+([('video',n) for n in ['webm','mp4']] if options.group in ['video','all'] else [])+([('shadow',light+'-'+state) for light in ['directional','point','spot'] for state in ['off','on']] if options.group in ['shadow','all'] else [])
   if options.group in ['shadow','all']:cases += [('shadow','directional-alpha-'+state) for state in ['off','on']]
   if options.case:cases=[c for c in cases if options.case in c[1]]
   for kind,variant in cases:
    files,args=resources(kind,variant);handler=type('MediaHost',(runner.Host,),{'files':files});server=http.server.ThreadingHTTPServer(('127.0.0.1',0),handler);threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
    page=browser.new_page(viewport={'width':854,'height':480});errors=[];logs=[]
    page.on('pageerror',lambda e:errors.append(str(e)));page.on('console',lambda m:logs.append(m.text))
    if options.main_thread:page.add_init_script('HTMLCanvasElement.prototype.transferControlToOffscreen=undefined;')
    page.add_init_script("const original=AudioContext.prototype.createMediaElementSource;AudioContext.prototype.createMediaElementSource=function(...args){const node=original.apply(this,args),analyser=this.createAnalyser();node.connect(analyser);window.__mediaAnalyser=analyser;return node;};")
    try:
     page.goto(base+'engine/index.html');page.evaluate('value=>window.__mediaQuality=value','sharp' if options.quality=='high' else options.quality);page.wait_for_function('!!window.__kenjatimeFrame')
     page.evaluate('''async args=>{const paths=await(await fetch('/__verification__/manifest.json')).json();window.__mediaFiles=Object.fromEntries(await Promise.all(paths.map(async path=>[path,new Uint8Array(await(await fetch('/__verification__/'+path)).arrayBuffer())])));const button=document.createElement('button');button.id='media-start';button.textContent='Start';button.onclick=()=>{window.postMessage({type:'kenjatime-start',files:window.__mediaFiles,args,quality:window.__mediaQuality},location.origin);button.remove();};document.body.append(button);}''',args)
     page.locator('#media-start').click();page.wait_for_function('window.__kenjatimeFrame.snapshot()?.players?.length===2',timeout=90000)
     page.wait_for_function('window.__kenjatimeFrame.snapshot()?.roundState===2',timeout=30000)
     if kind=='module':
      page.wait_for_function("window.__kenjatimeFrame.snapshot()?.music?.format==='xmp'&&window.__kenjatimeFrame.snapshot()?.music?.streaming",timeout=20000)
      page.wait_for_function('window.__kenjatimeFrame.snapshot()?.roundState===2',timeout=20000);page.wait_for_timeout(600);page.evaluate('window.__kenjatimeFrame.audioProbeReset()');page.wait_for_timeout(1000)
      audio=page.evaluate('window.__kenjatimeFrame.audioStatus()');assert audio['pcm']['peak']>.005,audio
      result={'format':variant,'music':page.evaluate('window.__kenjatimeFrame.snapshot().music'),'audio':audio}
     elif kind=='video':
      page.wait_for_function('window.__kenjatimeFrame.videoStatus().frames>3',timeout=30000)
      colors=[]
      for i in range(8):
       target=OUT/(variant+'-'+str(i)+'.png');page.locator('canvas').screenshot(path=str(target));im=Image.open(target).convert('RGB');colors.append(im.getpixel((int(im.width*.2),int(im.height*.3))));page.wait_for_timeout(250)
      assert any(r>g*1.5 and r>80 for r,g,b in colors) and any(g>r*1.5 and g>40 for r,g,b in colors),colors
      peak=page.evaluate("()=>{const a=window.__mediaAnalyser,v=new Float32Array(a.fftSize);a.getFloatTimeDomainData(v);return Math.max(...v.map(Math.abs));}");assert peak>.01,peak
      page.evaluate('window.__kenjatimeFrame.pause(true)');page.wait_for_timeout(200);before=page.evaluate('window.__kenjatimeFrame.videoStatus()');page.wait_for_timeout(350);after=page.evaluate('window.__kenjatimeFrame.videoStatus()');assert abs(before['videos'][0]['time']-after['videos'][0]['time'])<.1,(before,after)
      page.evaluate('window.__kenjatimeFrame.pause(false)');page.wait_for_timeout(300);status=page.evaluate('window.__kenjatimeFrame.videoStatus()');assert status['inFlight']<=status['layers'],status
      result={'format':variant,'colors':colors,'videoAudioPeak':peak,'video':status,'pauseStopsPlayback':True}
     else:
      page.wait_for_timeout(300);page.evaluate('window.__kenjatimeFrame.pause(true)');page.wait_for_timeout(80);target=OUT/(variant+'.png');page.locator('canvas').screenshot(path=str(target));result={'variant':variant,'screenshot':target.name,'gpu':page.evaluate('window.__kenjatimeGPU'),'graphics':page.evaluate('window.__kenjatimeFrame.snapshot().graphics')};assert result['graphics']['stageModel'] and result['graphics']['modelEnabled'] and result['graphics']['shadowDraws']>0,result;assert result['graphics']['shadowSize']==(128 if options.quality=='low' else 512),result
      assert not any('models disabled' in line or 'shadows disabled' in line.lower() for line in logs),logs[-10:]
     diagnostic=page.evaluate('({state:window.__kenjatimeFrame.snapshot(),video:window.__kenjatimeFrame.videoStatus()})');diagnostic['workers']=[w.evaluate('({error:globalThis.__kenjatimeGPUControl?.context.getError(),snapshot:globalThis.kenjatimeEngineSnapshot?.()})') for w in page.workers];(OUT/(kind+'-'+variant+'-live.json')).write_text(json.dumps(diagnostic,indent=2)+'\n')
     assert all(w['error']==0 for w in diagnostic['workers']),diagnostic
     assert not errors,errors
     page.evaluate('window.__kenjatimeFrame.dispose()');assert page.evaluate('window.__kenjatimeFrame.videoStatus().layers')==0
     result.update(group=kind,cleanup=True);report['checks'].append(result);print('PASS',kind,variant,flush=True)
    finally:
     try:
      diagnostic=page.evaluate('({state:window.__kenjatimeFrame.snapshot(),video:window.__kenjatimeFrame.videoStatus()})');diagnostic['workers']=[w.evaluate('({error:globalThis.__kenjatimeGPUControl?.context.getError(),snapshot:globalThis.kenjatimeEngineSnapshot?.()})') for w in page.workers];(OUT/(kind+'-'+variant+'-diagnostic.json')).write_text(json.dumps(diagnostic,indent=2)+'\n')
     except Exception:pass
     (OUT/(kind+'-'+variant+'.log')).write_text('\n'.join(logs+errors)+'\n');page.close();server.shutdown();server.server_close()
   if options.group in ['shadow','all'] and not options.case:
    for light in ['directional','point','spot','directional-alpha']:
     a=Image.open(OUT/(light+'-off.png')).convert('RGB');b=Image.open(OUT/(light+'-on.png')).convert('RGB');region=(int(a.width*.36),int(a.height*.36),int(a.width*.65),int(a.height*.75));diff=ImageChops.difference(a.crop(region),b.crop(region));count=sum(1 for x,y,z in (diff.get_flattened_data() if hasattr(diff,'get_flattened_data') else diff.getdata()) if max(x,y,z)>8);assert count>30,('No rendered shadow difference',light,count);report['checks'].append({'group':'shadowPixels','light':light,'changedPixels':count});print('PASS shadow pixels',light,count,flush=True)
  finally:browser.close()
 (OUT/('evidence-'+options.group+'.json')).write_text(json.dumps(report,indent=2)+'\n');return 0
if __name__=='__main__':raise SystemExit(main())
