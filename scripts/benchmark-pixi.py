"""Canvas/WebGL A/B: identical ticks, pixels, CPU submission and fenced frame costs."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import argparse,base64,hashlib,json,os
import numpy as np
from PIL import Image
os.chdir(Path(__file__).resolve().parent.parent)
p=argparse.ArgumentParser();p.add_argument('--url',default='http://127.0.0.1:5186/next/');p.add_argument('--frames',type=int,default=30);p.add_argument('--scenes',default='idle,sparks,additive,custom,entities,parallax,combined');p.add_argument('--output',default='work/pixi-benchmark.json');a=p.parse_args()
results={};out=Path(a.output);out.parent.mkdir(parents=True,exist_ok=True)
with sync_playwright() as pw:
    browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
    renderer=browser.new_browser_cdp_session().send('SystemInfo.getInfo')['gpu'].get('auxAttributes',{}).get('glRenderer','unknown')
    for scene in a.scenes.split(','):
        fixture=Path('work/performance')/(scene+'.zip');assert scene=='forest' or fixture.is_file(),'Generate fixtures with scripts/benchmark-browser.py first.'
        rows={};pixels={}
        for backend in ['canvas','pixi']:
            context=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True);page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
            page.goto(a.url+'?perf=1&graphics=high',wait_until='networkidle')
            if scene=='forest':
                stage=os.environ.get('MUGEN_FOREST_RAR');assert stage,'Set MUGEN_FOREST_RAR for the forest scene.'
                page.locator('#sample').click();page.wait_for_function("document.querySelector('#name').textContent==='Kung Fu Man'");page.locator('#stage-file').set_input_files(stage);page.wait_for_function("document.querySelector('#stage-select option:checked').textContent==='Forest of King Cruel'")
            else:
                page.locator('#file').set_input_files(str(fixture));page.wait_for_function('name=>document.querySelector("#name").textContent==="Performance "+name',arg=scene)
            page.locator('#training').click();page.evaluate('window.__kenjatimePerformance.benchmark({frames:1,ticksPerFrame:0})');page.locator('#renderer-mode').select_option(backend);page.wait_for_function('!document.querySelector("#renderer-mode").disabled');page.locator('#reset').click()
            page.evaluate('()=>{for(let i=0;i<100;i++)document.querySelector("#step").click();window.__kenjatimePerformance.benchmark({frames:15,ticksPerFrame:1})}')
            measurement=page.evaluate('''frames=>{const times=[],cpu=[],stats=[],fence=document.createElement('canvas');fence.width=fence.height=1;const fc=fence.getContext('2d',{willReadFrequently:true});for(let i=0;i<frames;i++){const start=performance.now(),s=window.__kenjatimePerformance.benchmark({frames:1,ticksPerFrame:1});if(s.counts.renderer==='pixi')document.querySelector('.gpu-canvas').getContext('webgl2').finish();else{fc.drawImage(document.querySelector('canvas'),0,0,1,1,0,0,1,1);fc.getImageData(0,0,1,1);}times.push(performance.now()-start);cpu.push(s.renderAverageMs);stats.push(s.counts);}const percentile=(v,p)=>[...v].sort((a,b)=>a-b)[Math.floor(v.length*p)];return{cpuP50:percentile(cpu,.5),cpuP95:percentile(cpu,.95),fencedP50:percentile(times,.5),fencedP95:percentile(times,.95),uploads:stats.reduce((s,v)=>s+v.gpuUploads,0),batches:stats.reduce((s,v)=>s+v.gpuBatches,0),counts:stats.at(-1)}}''',a.frames)
            report=page.evaluate('''async()=>{let blob;const url=URL.createObjectURL,click=HTMLAnchorElement.prototype.click;URL.createObjectURL=b=>{blob=b;return 'blob:test'};HTMLAnchorElement.prototype.click=function(){};try{document.querySelector('#export-report').click();return JSON.parse(await blob.text())}finally{URL.createObjectURL=url;HTMLAnchorElement.prototype.click=click}}''')
            behavior={k:report.get(k) for k in ['player','opponent','entities','projectiles','stage','match','combatRules','issues']};measurement['behaviorSha256']=hashlib.sha256(json.dumps(behavior,sort_keys=True).encode()).hexdigest()
            raw=page.evaluate('''()=>{const bytes=new Uint8Array(window.__kenjatimePerformance.capturePixels());let s='';for(let i=0;i<bytes.length;i+=32768)s+=String.fromCharCode(...bytes.subarray(i,i+32768));return btoa(s)}''')
            pixels[backend]=np.frombuffer(base64.b64decode(raw),dtype=np.uint8).reshape((540,960,4));Image.fromarray(pixels[backend]).save(out.with_name(out.stem+'-'+scene+'-'+backend+'.png'))
            assert not errors,errors
            if scene!='forest':assert not report['issues'],report['issues']
            rows[backend]=measurement;context.close()
        assert rows['canvas']['behaviorSha256']==rows['pixi']['behaviorSha256'],scene
        delta=np.abs(pixels['canvas'].astype(np.int16)-pixels['pixi'].astype(np.int16));rows['pixels']={'max':int(delta.max()),'mean':float(delta.mean()),'pixelsOver3':int(np.any(delta>3,axis=2).sum()),'totalPixels':960*540}
        results[scene]=rows;print(scene,json.dumps(rows),flush=True)
    browser.close()
out.write_text(json.dumps({'environment':{'browser':'Chromium','renderer':renderer,'physicalAndroid':False,'measurement':'CPU render submission and frame including gl.finish / separate one-pixel Canvas fence (avoids deoptimizing the game canvas); not phone FPS'},'frames':a.frames,'scenes':results},indent=2)+'\n')
