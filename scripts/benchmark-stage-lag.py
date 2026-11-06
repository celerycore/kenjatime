"""Profile the supplied animated stage across renderers, quality and movement inputs."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
import argparse,base64,hashlib,json,os,time
import numpy as np
os.chdir(Path(__file__).resolve().parent.parent)
p=argparse.ArgumentParser();p.add_argument('--url',required=True);p.add_argument('--output',required=True);p.add_argument('--archive',default=os.environ.get('MUGEN_FOREST_RAR'));p.add_argument('--frames',type=int,default=120);p.add_argument('--modes',default='high,low');p.add_argument('--motion',default='idle,pan');a=p.parse_args();assert a.archive
out=Path(a.output);out.parent.mkdir(parents=True,exist_ok=True);scenes={}
with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
    gpu=b.new_browser_cdp_session().send('SystemInfo.getInfo')['gpu'].get('auxAttributes',{}).get('glRenderer','unknown')
    for mode in a.modes.split(','):
      for renderer in ['canvas','pixi']:
       for motion in a.motion.split(','):
        c=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True);page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(a.url+'?perf=1&graphics='+mode,wait_until='networkidle');page.locator('#sample').click();page.wait_for_function("document.querySelector('#name').textContent==='Kung Fu Man'")
        page.locator('#training').click();page.evaluate('window.__kenjatimePerformance.benchmark({frames:1,ticksPerFrame:0})');page.locator('#sound').uncheck()
        start=time.monotonic();page.locator('#stage-file').set_input_files(a.archive);page.wait_for_function("document.querySelector('#stage-select option:checked').textContent==='Forest of King Cruel'");import_ms=(time.monotonic()-start)*1000
        page.locator('#renderer-mode').select_option(renderer);page.wait_for_function('!document.querySelector("#renderer-mode").disabled');page.evaluate('window.__kenjatimePerformance.benchmark({frames:1,ticksPerFrame:0})');page.locator('#reset').click();page.locator('canvas').first.click()
        samples=page.evaluate('''({frames,motion})=>{
          const held=new Set(),keys=['ArrowLeft','ArrowRight','ArrowUp','KeyZ'];
          const change=(next)=>{for(const key of keys){if(next.has(key)&&!held.has(key))document.querySelector('canvas').dispatchEvent(new KeyboardEvent('keydown',{code:key,key:key,bubbles:true}));if(!next.has(key)&&held.has(key))document.querySelector('canvas').dispatchEvent(new KeyboardEvent('keyup',{code:key,key:key,bubbles:true}));}held.clear();for(const key of next)held.add(key);};
          const fence=document.createElement('canvas');fence.width=fence.height=1;const fc=fence.getContext('2d',{willReadFrequently:true}),samples=[];
          for(let i=0;i<frames+90;i++){
            const t=i%120,next=new Set();if(motion==='pan'){next.add(t<60?'ArrowRight':'ArrowLeft');if(i%60===0)next.add('ArrowUp');if(i%30===12)next.add('KeyZ');}change(next);
            const start=performance.now(),s=window.__kenjatimePerformance.benchmark({frames:1,ticksPerFrame:1});if(s.counts.renderer==='pixi')document.querySelector('.gpu-canvas').getContext('webgl2').finish();else{fc.drawImage(document.querySelector('canvas'),0,0,1,1,0,0,1,1);fc.getImageData(0,0,1,1);}
            if(i>=90)samples.push({cpu:s.renderAverageMs,tick:s.simulationTickMs,wall:performance.now()-start,counts:s.counts,pixelWrites:s.pixelWrites});
          }change(new Set());return samples;
        }''',{'frames':a.frames,'motion':motion})
        report=page.evaluate('''async()=>{let blob;const url=URL.createObjectURL,click=HTMLAnchorElement.prototype.click;URL.createObjectURL=b=>{blob=b;return 'blob:test'};HTMLAnchorElement.prototype.click=function(){};try{document.querySelector('#export-report').click();return JSON.parse(await blob.text())}finally{URL.createObjectURL=url;HTMLAnchorElement.prototype.click=click}}''')
        raw=page.evaluate("()=>{const d=window.__kenjatimePerformance.capturePixels();let s='';for(let i=0;i<d.length;i+=32768)s+=String.fromCharCode(...d.slice(i,i+32768));return btoa(s)}")
        w,h=page.locator('canvas').first.evaluate('c=>[c.width,c.height]');pixels=np.frombuffer(base64.b64decode(raw),dtype=np.uint8).reshape(h,w,4)
        name=f'{mode}-{renderer}-{motion}';Image.fromarray(pixels).save(out.with_name(out.stem+'-'+name+'.png'))
        def q(field,f):return sorted(s[field] for s in samples)[min(len(samples)-1,int(len(samples)*f))]
        behavior={key:report.get(key) for key in ['player','opponent','entities','projectiles','stage','match','issues']}
        result={'cpuP50':q('cpu',.5),'cpuP95':q('cpu',.95),'cpuMax':q('cpu',1),'fencedP50':q('wall',.5),'fencedP95':q('wall',.95),'tickP50':q('tick',.5),'gpuUploads':sum(s['counts'].get('gpuUploads',0) for s in samples),'gpuUploadBytes':sum(s['counts'].get('gpuUploadBytes',0) for s in samples),'pixelWrites':sum(s['pixelWrites'] for s in samples),'counts':samples[-1]['counts'],'importMs':import_ms,'behaviorSha256':hashlib.sha256(json.dumps(behavior,sort_keys=True).encode()).hexdigest(),'camera':report['stage']['camera'],'errors':errors}
        assert not errors,errors;scenes[name]=result;print(name,json.dumps({k:result[k] for k in ['cpuP50','cpuP95','fencedP50','gpuUploads','gpuUploadBytes','pixelWrites','camera']}),flush=True);c.close()
    b.close()
out.write_text(json.dumps({'frames':a.frames,'gpu':gpu,'physicalAndroid':False,'fence':'WebGL finish / separate one-pixel Canvas readback; not phone FPS','scenes':scenes},indent=2)+'\n')
