"""Compare actual Go/WASM engine work and GL traffic; software GPU, not phone FPS."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import argparse,base64,functools,http.server,json,os,shutil,threading,zipfile
from PIL import Image

ROOT=Path(__file__).resolve().parent.parent;os.chdir(ROOT)
p=argparse.ArgumentParser();p.add_argument('--dist',default='dist');p.add_argument('--label',default='current');p.add_argument('--frames',type=int,default=180);p.add_argument('--output',default='work/gpu-rewrite/current.json');p.add_argument('--scenes',default='grid,effects,forest' if os.environ.get('MUGEN_FOREST_RAR') else 'grid,effects');p.add_argument('--capture-framebuffer',action='store_true');args=p.parse_args()
out=ROOT/'work/gpu-rewrite';out.mkdir(parents=True,exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/args.dist)));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
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
 const P=WebGL2RenderingContext.prototype,original={},state={draw:null,start:0,active:false,frames:[],samples:[],counts:{},current:{},last:0,rafSeen:0,displayedFrames:0,rafIntervals:[],heartbeat:[],heartbeatLast:0,rafLast:0};window.__glMeasure=state;
 const names=['bindFramebuffer','clear','drawArrays','drawElements','blitFramebuffer','bufferData','bufferSubData','uniformMatrix4fv','uniformMatrix3fv','uniform1i','uniform1f','uniform2f','uniform3f','uniform4f','uniform4fv','bindBuffer','bindTexture','useProgram','texImage2D','texSubImage2D','getParameter','vertexAttribPointer'];
 for(const name of names){original[name]=P[name];P[name]=function(...a){if(state.active){state.counts[name]=(state.counts[name]||0)+1;state.current[name]=(state.current[name]||0)+1;}if(name==='bindFramebuffer'&&(a[0]===this.FRAMEBUFFER||a[0]===this.DRAW_FRAMEBUFFER))state.draw=a[1];if(name==='clear'&&state.draw!==null&&(a[0]&this.DEPTH_BUFFER_BIT)){state.start=performance.now();state.scene=state.draw;}const result=original[name].apply(this,a);if((name==='drawArrays'||name==='blitFramebuffer')&&state.draw===null){const now=performance.now();if(state.active){state.frames.push(now-state.start);if(state.last)state.samples.push(now-state.last);state.last=now;}state.current={};}return result;};}
 function raf(now){if(state.active){if(state.frames.length>state.rafSeen)state.displayedFrames++;state.rafSeen=state.frames.length;if(state.rafLast)state.rafIntervals.push(now-state.rafLast);state.rafLast=now;}requestAnimationFrame(raf);}requestAnimationFrame(raf);
 setInterval(()=>{const now=performance.now();if(state.active&&state.heartbeatLast)state.heartbeat.push(now-state.heartbeatLast);state.heartbeatLast=now;},10);
 state.begin=()=>{state.displayedFrames=0;state.rafSeen=0;state.rafLast=0;state.rafIntervals=[];state.heartbeat=[];state.frames=[];state.samples=[];state.counts={};state.last=0;state.active=true;};state.end=()=>{state.active=false;const summarize=a=>{a=[...a].sort((x,y)=>x-y);return{median:a[Math.floor(a.length*.5)],p95:a[Math.floor(a.length*.95)],mean:a.reduce((s,x)=>s+x,0)/a.length};};return{frames:state.frames.length,displayedFrames:state.displayedFrames,eventLoopIntervalMs:summarize(state.heartbeat),rafIntervalMs:summarize(state.rafIntervals),engineWorkMs:summarize(state.frames),presentIntervalMs:summarize(state.samples),glCallsPerFrame:Object.fromEntries(Object.entries(state.counts).map(([k,v])=>[k,v/state.frames.length])),renderer:original.getParameter.call(document.querySelector('canvas').getContext('webgl2'),0x1F01)};};
})();"""
results={'label':args.label,'gpu':'Chromium SwiftShader','physicalPhone':False,'scenes':{}}
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or p.chromium.executable_path,headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required'])
  for scene in args.scenes.split(','):
   context=browser.new_context(viewport={'width':854,'height':480});context.add_init_script(probe);page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.goto(base+'arena-classic/');page.wait_for_function("document.querySelector('#status').textContent==='Ready when you are.'")
   with page.expect_file_chooser() as chosen:page.locator('#browse').click()
   chosen.value.set_files(str(fixture(scene in ['effects','fidelity'],scene=='fidelity')));page.wait_for_function("document.querySelector('#status').textContent.startsWith('Archive installed')")
   if scene=='forest':
    with page.expect_file_chooser() as chosen:page.locator('#add-stage').click()
    chosen.value.set_files(os.environ['MUGEN_FOREST_RAR']);page.wait_for_function("document.querySelector('#status').textContent.startsWith('Archive installed')")
   page.locator('#arena-mode').select_option('training');page.locator('#fight-now').click();page.locator('.kenjatime-battle iframe').wait_for(state='visible');page.wait_for_function("window.__kenjatimeGoState?.ticks>=400",timeout=120000)
   frame=page.frames[1];startState=frame.evaluate('window.__kenjatimeFrame.snapshot()');frame.evaluate('window.__glMeasure.begin()');frame.wait_for_function(f'window.__glMeasure.frames.length>={args.frames}',timeout=120000);r=frame.evaluate('window.__glMeasure.end()');r['state']=frame.evaluate('window.__kenjatimeFrame.snapshot()');r['simulationTicks']=r['state']['ticks']-startState['ticks'];r['gpu']=frame.evaluate('window.__kenjatimeGPU??null');r['errors']=errors;assert not errors,errors
   results['scenes'][scene]=r;Path(args.output).write_text(json.dumps(results,indent=2)+'\n');print(json.dumps({'scene':scene,**r}),flush=True);frame.evaluate('window.__kenjatimeFrame.pause(true)')
   if args.capture_framebuffer:
    image=frame.evaluate('''()=>{const c=document.querySelector('canvas'),gl=c.getContext('webgl2'),previous=gl.getParameter(gl.READ_FRAMEBUFFER_BINDING),pixels=new Uint8Array(c.width*c.height*4);gl.bindFramebuffer(gl.READ_FRAMEBUFFER,window.__glMeasure.scene);gl.readPixels(0,0,c.width,c.height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);gl.bindFramebuffer(gl.READ_FRAMEBUFFER,previous);let bytes='';for(let i=0;i<pixels.length;i+=32768)bytes+=String.fromCharCode(...pixels.subarray(i,i+32768));return{width:c.width,height:c.height,data:btoa(bytes)};}''')
    Image.frombytes('RGBA',(image['width'],image['height']),base64.b64decode(image['data'])).transpose(Image.Transpose.FLIP_TOP_BOTTOM).save(out/(args.label+'-'+scene+'.png'))
   else:page.screenshot(path=str(out/(args.label+'-'+scene+'.png')))
   context.close()
  browser.close()
finally:server.shutdown()
Path(args.output).write_text(json.dumps(results,indent=2)+'\n')
