"""Reproducible production-renderer CPU benchmark; not a physical phone FPS test."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import argparse, base64, hashlib, json, os, platform, time
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
os.chdir(ROOT)
parser=argparse.ArgumentParser()
parser.add_argument('--url',default='http://127.0.0.1:5186/kenjatime/')
parser.add_argument('--output',default='work/performance-current.json')
parser.add_argument('--frames',type=int,default=90)
parser.add_argument('--cpu',type=float,default=1)
parser.add_argument('--scenes',default='idle,sparks,additive,custom,entities,parallax,combined')
args=parser.parse_args()
Path('work/performance').mkdir(parents=True,exist_ok=True)
with ZipFile('public/kfm.zip') as source:sprite=source.read('kfm/kfm.sff')

def fixture(scene):
    cns='[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nctrl=0\nanim=0\n'
    air='[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-10,-70,10,0\n0,0,0,0,-1\n'
    if scene in ['additive','custom','combined']:
        cns+='''[State Effects]
type=Explod
triggerall=TeamSide=1
trigger1=Time<64
anim=10+(Time%3)
id=Time
postype=left
pos=20+(Time%16)*18,50+(Time%4)*30
scale=1.5,1.5
bindtime=0
removetime=-1
ownpal=1
'''
        for action,blend in [(10,'A'),(11,'S' if scene!='additive' else 'A'),(12,'AS160D96' if scene!='additive' else 'A')]:
            air+=f'[Begin Action {action}]\n0,0,0,0,-1,,{blend}\n'
    if scene in ['custom','combined']:
        cns+='[State Palette]\ntype=PalFX\ntrigger1=Time=0\ntime=-1\nadd=20,-10,5\nmul=200,240,256\n'
    if scene in ['entities','combined']:
        cns+='''[State Helpers]
type=Helper
triggerall=TeamSide=1
trigger1=Time<8
stateno=300
id=Time
pos=Time*20,-40
[State Projectile]
type=Projectile
triggerall=TeamSide=1
trigger1=Time<12
projid=Time
projanim=0
projremovetime=-1
velocity=0,0
offset=Time*18,-120
attr=S,NP
damage=0
[Statedef 300]
type=S
movetype=I
physics=N
ctrl=0
anim=0
[State Trail]
type=AfterImage
trigger1=Time=0
time=-1
length=8
timegap=1
framegap=1
trans=add
'''
    if scene=='sparks':
        cns+='''[State Attack]
type=ChangeState
triggerall=TeamSide=1
trigger1=1
value=200
ctrl=0
[Statedef 200]
type=S
movetype=A
physics=N
anim=200
[State Hit]
type=HitDef
trigger1=Time=0
attr=S,NA
damage=0
ground.hittime=0
ground.velocity=0,0
sparkno=S10
sparkxy=0,-40
[State Repeat]
type=ChangeState
trigger1=Time=4
value=200
ctrl=0
'''
        air+='[Begin Action 200]\nClsn1Default:1\nClsn1[0]=0,-100,300,0\nClsn2Default:1\nClsn2[0]=-10,-70,10,0\n0,0,0,0,-1\n[Begin Action 10]\n0,0,0,0,18,,A\n'
    path=Path('work/performance')/(scene+'.zip')
    with ZipFile(path,'w',ZIP_DEFLATED) as target:
        files={'fighter.def':f'[Info]\nname=Performance {scene}\n[Files]\ncns=fighter.cns\nst=fighter.cns\nanim=fighter.air\ncmd=fighter.cmd\nsprite=fighter.sff',
               'fighter.cns':cns,'fighter.cmd':'','fighter.air':air,'fighter.sff':sprite}
        if scene in ['parallax','combined']:
            files['stage.def']='''[Info]
name=Performance parallax
[Camera]
boundleft=-100
boundright=100
[PlayerInfo]
p1startx=-70
p2startx=70
[StageInfo]
localcoord=320,240
zoffset=220
[BGDef]
spr=fighter.sff
[BG Floor]
type=parallax
spriteno=0,0
start=0,-30
xscale=1,2
tile=1,0
trans=addalpha
alpha=160,192
'''
        for name,data in files.items():target.writestr(name,data)
    return str(path)

result={'environment':{'host':platform.platform(),'kind':'headless Chromium, mobile viewport; synchronous render CPU timings',
                       'physicalAndroid':False,'viewport':[390,844],'dpr':2,'cpuThrottle':args.cpu,'frames':args.frames},'scenes':{}}
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
    result['environment']['browser']=browser.version
    for scene in args.scenes.split(','):
        context=browser.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,accept_downloads=True)
        page=context.new_page();errors=[]
        page.on('pageerror',lambda error:errors.append(str(error)))
        cdp=context.new_cdp_session(page)
        if args.cpu!=1:cdp.send('Emulation.setCPUThrottlingRate',{'rate':args.cpu})
        page.goto(args.url+('&' if '?' in args.url else '?')+'perf=1&graphics=high',wait_until='networkidle')
        page.locator('#file').set_input_files(fixture(scene))
        page.wait_for_function('(scene)=>document.querySelector("#name").textContent==="Performance "+scene',arg=scene)
        page.locator('#training').click();page.locator('#play').click();page.locator('#reset').click()
        page.evaluate('()=>{for(let i=0;i<100;i++)document.querySelector("#step").click()}')
        page.evaluate('()=>window.__kenjatimePerformance.benchmark({frames:15,ticksPerFrame:1})')
        measurement=page.evaluate('(frames)=>window.__kenjatimePerformance.benchmark({frames,ticksPerFrame:1})',args.frames)
        with page.expect_download() as download:page.locator('#export-report').click()
        reportpath=Path('work/performance')/(scene+'-report.json');download.value.save_as(reportpath)
        report=json.loads(reportpath.read_text())
        assert not report['issues'],(scene,report['issues'])
        assert not errors,errors
        measurement['state']={side:{key:report[side][key] for key in ['stateNo','time','pos','vel','life','power','getHitVars','variables']} for side in ['player','opponent']}
        measurement['entities']=len(report['entities'])
        behavior={key:report.get(key) for key in ['player','opponent','entities','stage','match','combatRules']}
        measurement['behaviorSha256']=hashlib.sha256(json.dumps(behavior,sort_keys=True).encode()).hexdigest()
        measurement['canvasHash']=page.evaluate('async()=>{const data=document.querySelector("canvas").getContext("2d").getImageData(0,0,960,540).data;const hash=await crypto.subtle.digest("SHA-256",data);return [...new Uint8Array(hash)].map(n=>n.toString(16).padStart(2,"0")).join("")}')
        images=Path(args.output).with_suffix('');images.mkdir(parents=True,exist_ok=True)
        image=page.locator('canvas').evaluate('(canvas)=>canvas.toDataURL()').split(',')[1]
        (images/(scene+'.png')).write_bytes(base64.b64decode(image))
        # These are CPU draw timings, not achieved presentation FPS.
        for key in ['fps','frameAverageMs','frameP95Ms','slowFrameRate']:measurement.pop(key,None)
        result['scenes'][scene]=measurement
        print(scene,json.dumps({key:measurement[key] for key in ['renderP50Ms','renderP95Ms','simulationTickMs','readbacks','readbackPixels','drawCalls']}),flush=True)
        context.close()
    browser.close()
Path(args.output).parent.mkdir(parents=True,exist_ok=True)
Path(args.output).write_text(json.dumps(result,indent=2)+'\n')
