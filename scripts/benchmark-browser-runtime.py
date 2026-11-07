"""Fixed-wall-time Go/WASM throughput and page responsiveness, not phone FPS."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
import argparse,base64,functools,http.server,json,os,shutil,threading,zipfile
ROOT=Path(__file__).resolve().parent.parent;os.chdir(ROOT)
p=argparse.ArgumentParser();p.add_argument('--dist',default='dist');p.add_argument('--label',default='current');p.add_argument('--seconds',type=float,default=6);p.add_argument('--scenes',default='grid,effects,forest' if os.environ.get('MUGEN_FOREST_RAR') else 'grid,effects');p.add_argument('--main-fallback',action='store_true');p.add_argument('--sharp',action='store_true');p.add_argument('--capture-framebuffer',action='store_true');args=p.parse_args()
out=ROOT/'work/browser-runtime';out.mkdir(parents=True,exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/args.dist)))
threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
with zipfile.ZipFile('public/kfm.zip') as z:sprite=z.read('kfm/kfm.sff')
def fixture(effects,fidelity=False):
 cns='[Data]\nlife=1000\nattack=100\ndefence=100\n[Size]\nxscale=1\nyscale=1\nground.back=10\nground.front=10\nheight=80\n[Velocity]\n[Movement]\n[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nctrl=0\nanim=0\n'
 if effects:cns+='''[State Effects]
type=Explod
triggerall=TeamSide=1
trigger1=Time<96
anim=10+(Time%3)
id=Time
postype=left
pos=20+(Time%16)*18,65+(Time%6)*22
scale=.35,.35
facing=ifelse(Time%2,1,-1)
bindtime=0
removetime=-1
ownpal=1
'''
 if fidelity:cns=cns.replace('Time%3','Time%4');cns+='angle=(Time*11)%360\nxangle=20\nyangle=-30\nprojection=perspective\nfocallength=2048\nxshear=.15\nwindow=30,30,290,215\npalfx.time=-1\npalfx.add=20,-10,15\npalfx.mul=180,255,210\npalfx.color=160\n'
 air='[Begin Action 0]\n0,0,0,0,-1\n'
 for i,blend in enumerate(['','A','AS160D96']+(['S'] if fidelity else [])):air+=f'[Begin Action {10+i}]\n0,0,0,0,-1,,{blend}\n'
 f=out/('fidelity.zip' if fidelity else 'effects.zip' if effects else 'static.zip')
 with zipfile.ZipFile(f,'w',zipfile.ZIP_DEFLATED) as z:
  z.writestr('fighter.def','[Info]\nname=GPU fixture\nmugenversion=1.0\n[Files]\ncns=fighter.cns\nst=fighter.cns\ncmd=fighter.cmd\nsprite=fighter.sff\nanim=fighter.air');z.writestr('fighter.cns',cns);z.writestr('fighter.cmd','[Command]\nname="x"\ncommand=x\ntime=1');z.writestr('fighter.air',air);z.writestr('fighter.sff',sprite)
 return f

probe=r"""(()=>{
 const P=WebGL2RenderingContext.prototype,state={active:false,draw:null,frames:0,counts:{},intervals:[],heartbeat:[],raf:[],lastFrame:0};globalThis.__runtimeProbe=state;
 for(const name of ['bindFramebuffer','drawArrays','drawElements','blitFramebuffer','bufferData','bufferSubData','getParameter','uniformMatrix4fv','useProgram','clear']){
  const original=P[name];P[name]=function(...a){
   if(state.active)state.counts[name]=(state.counts[name]||0)+1;
   if(name==='bindFramebuffer'&&(a[0]===this.FRAMEBUFFER||a[0]===this.DRAW_FRAMEBUFFER))state.draw=a[1];
   if(name==='clear'&&state.draw!==null&&(a[0]&this.DEPTH_BUFFER_BIT))state.scene=state.draw;
   const result=original.apply(this,a);
   if(state.active&&state.draw===null&&(name==='drawArrays'||name==='drawElements'||name==='blitFramebuffer')){const now=performance.now();state.frames++;if(state.lastFrame)state.intervals.push(now-state.lastFrame);state.lastFrame=now;}
   return result;
  };
 }
 let lastBeat=0,lastRAF=0;
 setInterval(()=>{const now=performance.now();if(state.active&&lastBeat)state.heartbeat.push(now-lastBeat);lastBeat=now;},10);
 if(typeof document!=='undefined'){const raf=now=>{if(state.active&&lastRAF)state.raf.push(now-lastRAF);lastRAF=now;requestAnimationFrame(raf);};requestAnimationFrame(raf);}
 state.begin=()=>{state.frames=0;state.counts={};state.intervals=[];state.heartbeat=[];state.raf=[];state.lastFrame=0;lastBeat=0;lastRAF=0;state.start=performance.now();state.active=true;};
 state.end=()=>{const elapsedMs=performance.now()-state.start;state.active=false;const summary=a=>{a=[...a].sort((x,y)=>x-y);return a.length?{median:a[Math.floor(a.length*.5)],p95:a[Math.floor(a.length*.95)],max:a.at(-1),mean:a.reduce((s,x)=>s+x,0)/a.length}:null;};return{elapsedMs,frames:state.frames,submittedFramesPerSecond:state.frames*1000/elapsedMs,submissionIntervalsMs:summary(state.intervals),heartbeatIntervalsMs:summary(state.heartbeat),animationIntervalsMs:summary(state.raf),glCallsPerFrame:Object.fromEntries(Object.entries(state.counts).map(([k,v])=>[k,v/state.frames]))};};
})();"""
results={'label':args.label,'physicalPhone':False,'gpu':'Chromium SwiftShader','secondsRequested':args.seconds,'scenes':{}}
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or p.chromium.executable_path,headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required'])
  for scene in args.scenes.split(','):
   print('START '+scene,flush=True)
   context=browser.new_context(viewport={'width':854,'height':480});context.add_init_script(probe)
   if args.sharp:context.add_init_script("try{localStorage.setItem('kenjatime.visuals','sharp');}catch{}")
   if args.main_fallback:context.add_init_script("HTMLCanvasElement.prototype.transferControlToOffscreen=undefined;")
   page=context.new_page();workers=[];errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   def worker_ready(worker):
    if 'engine-worker-' in worker.url:worker.evaluate(probe);workers.append(worker)
   page.on('worker',worker_ready)
   page.goto(base+'arena-classic/');page.wait_for_function("document.querySelector('#status').textContent==='Ready when you are.'")
   with page.expect_file_chooser() as chosen:page.locator('#browse').click()
   chosen.value.set_files(str(fixture(scene in ['effects','fidelity'],scene=='fidelity')));page.wait_for_function("document.querySelector('#status').textContent.startsWith('Archive installed')")
   if scene=='forest':
    with page.expect_file_chooser() as chosen:page.locator('#add-stage').click()
    chosen.value.set_files(os.environ['MUGEN_FOREST_RAR']);page.wait_for_function("document.querySelector('#status').textContent.startsWith('Archive installed')")
   page.locator('#arena-mode').select_option('training');page.locator('#fight-now').click();page.wait_for_function("window.__kenjatimeGoState?.ticks>=400",timeout=120000)
   frame=page.frames[1];backend=frame.evaluate("window.__kenjatimeFrame.backend?.()||'legacy-main-webgl2'")
   engine=next((w for w in workers if 'engine-worker-' in w.url),frame) if backend.startswith('worker-') else frame
   # Vite hashes worker module names; require an actual worker for that backend.
   if backend.startswith('worker-'):assert engine!=frame,[w.url for w in workers]
   start=engine.evaluate('globalThis.kenjatimeEngineSnapshot()');frame.evaluate('globalThis.__runtimeProbe.begin()')
   if engine!=frame:engine.evaluate('globalThis.__runtimeProbe.begin()')
   page.wait_for_timeout(args.seconds*1000)
   measured=engine.evaluate('globalThis.__runtimeProbe.end()');ui=frame.evaluate('globalThis.__runtimeProbe.end()') if engine!=frame else measured
   end=engine.evaluate('globalThis.kenjatimeEngineSnapshot()');gpu=engine.evaluate('globalThis.__kenjatimeGPU')
   result={'backend':backend,'engine':measured,'page':ui,'simulationTicksPerSecond':(end['ticks']-start['ticks'])*1000/measured['elapsedMs'],'state':end,'gpu':gpu,'errors':errors}
   assert not errors,errors;assert measured['frames']>0,result
   results['scenes'][scene]=result;(out/(args.label+'.json')).write_text(json.dumps(results,indent=2)+'\n');print(json.dumps({'scene':scene,**result}),flush=True)
   frame.evaluate('window.__kenjatimeFrame.pause(true)');frame.wait_for_function('window.__kenjatimeFrame.snapshot().paused')
   if args.capture_framebuffer:
    image=engine.evaluate('''()=>{const c=globalThis.__kenjatimeCanvas||document.querySelector('canvas'),gl=c.getContext('webgl2'),previous=gl.getParameter(gl.READ_FRAMEBUFFER_BINDING),pixels=new Uint8Array(c.width*c.height*4);gl.bindFramebuffer(gl.READ_FRAMEBUFFER,globalThis.__runtimeProbe.scene);gl.readPixels(0,0,c.width,c.height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);gl.bindFramebuffer(gl.READ_FRAMEBUFFER,previous);let bytes='';for(let i=0;i<pixels.length;i+=32768)bytes+=String.fromCharCode(...pixels.subarray(i,i+32768));return{width:c.width,height:c.height,data:btoa(bytes)};}''')
    Image.frombytes('RGBA',(image['width'],image['height']),base64.b64decode(image['data'])).transpose(Image.Transpose.FLIP_TOP_BOTTOM).save(out/(args.label+'-'+scene+'.png'))
   else:page.screenshot(path=str(out/(args.label+'-'+scene+'.png')))
   context.close()
  browser.close()
finally:server.shutdown()
