"""Reproduce the reported falling custom state with independent sprites/scripts."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from playwright.sync_api import sync_playwright
import json, os

os.chdir(Path(__file__).resolve().parent.parent)
Path('work').mkdir(exist_ok=True)
with ZipFile('public/kfm.zip') as z:sprite=z.read('kfm/kfm.sff')
cmd='[Command]\nname="combo"\ncommand=x\ntime=1\n[Statedef -1]\n[State Start]\ntype=ChangeState\ntriggerall=TeamSide=1\ntriggerall=ctrl\ntrigger1=command="combo"\nvalue=200\n'
cns='''[Statedef -2]
[State Attack once]
type=ChangeState
triggerall=TeamSide=2
triggerall=!Var(20)
trigger1=EnemyNear,Var(10)=1
value=600
[Statedef 0]
type=S
movetype=I
physics=N
ctrl=1
anim=0
[Statedef 200]
type=S
movetype=I
physics=N
ctrl=0
anim=0
[State Combo signal]
type=VarSet
trigger1=Time=0
v=10
value=1
[Statedef 600]
type=S
movetype=A
physics=N
ctrl=0
anim=600
[State Only once]
type=VarSet
trigger1=Time=0
v=20
value=1
[State Custom falling hit]
type=HitDef
trigger1=Time=0
attr=S,NT
damage=10
pausetime=0,0
ground.velocity=1.2,-5
fall=1
p2stateno=6050
p2getp1state=1
sparkno=-1
[Statedef 6050]
type=A
movetype=H
physics=N
ctrl=0
anim=5050
[State Captured position]
type=PosSet
trigger1=Time=0
y=22019.649592906237
[State Captured velocity]
type=VelSet
trigger1=Time=0
y=124.14999780058861
[State Gravity]
type=VelAdd
trigger1=1
y=GetHitVar(yaccel)
[State Native landing condition]
type=SelfState
trigger1=Pos Y >= Const(movement.air.gethit.groundlevel)
trigger1=Vel Y>0
value=5100
'''
air='[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,0,0,-1\n[Begin Action 600]\nClsn1Default:1\nClsn1[0]=0,-40,160,0\n0,0,0,0,-1\n'
for action in [5000,5001,5010,5011,5020,5030,5035,5050,5070,5080,5100,5101,5110,5120,5200,5210]:air+=f'[Begin Action {action}]\n0,0,0,0,2\n'
with ZipFile('work/landing-browser-fixture.zip','w',ZIP_DEFLATED) as z:
    for path,data in {'c.def':'[Info]\nname=Post-combo Landing Fixture\n[Files]\ncns=c.cns\nst=c.cns\ncmd=c.cmd\nanim=c.air\nsprite=c.sff','c.cns':cns,'c.cmd':cmd,'c.air':air,'c.sff':sprite}.items():z.writestr(path,data)
base=os.environ.get('MUGEN_TEST_BASE','http://127.0.0.1:5186/next/').rstrip('/')+'/'
results=[]
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
    for route in ['','arena-classic/']:
        page=browser.new_page(viewport={'width':390,'height':844},accept_downloads=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(base+route+'?perf=1&graphics=high&v=22',wait_until='networkidle')
        if route:page.wait_for_function('!document.querySelector("#file").disabled')
        page.locator('#file').set_input_files('work/landing-browser-fixture.zip');page.wait_for_function("document.querySelector('#name').textContent==='Post-combo Landing Fixture'")
        if route:page.locator('#arena-mode').select_option('training')
        page.locator('#training').click();page.evaluate('window.__kenjatimePerformance.benchmark({frames:1,ticksPerFrame:0})');page.locator('#reset').click()
        def steps(n):page.evaluate('(n)=>{for(let i=0;i<n;i++)document.querySelector("#step").click()}',n)
        def report(name):
            with page.expect_download() as pending:page.locator('#export-report').click()
            path=Path('work')/('landing-'+(route.replace('/','') or 'lab')+'-'+name+'.json');pending.value.save_as(path);d=json.loads(path.read_text());assert not d['issues'],d['issues'];return d
        page.locator('canvas').click();page.keyboard.down('z');steps(1);page.keyboard.up('z');falling=report('falling');assert falling['player']['stateNo']==6050 and falling['player']['stateOwner']==2
        steps(1);landed=report('landed');assert landed['player']['stateNo']==5100 and landed['player']['stateOwner']==1 and landed['player']['pos']['y']==0
        steps(180);recovered=report('recovered');assert recovered['player']['stateNo']==0 and recovered['player']['pos']['y']==0 and recovered['player']['ctrl']==1
        assert not errors;results.append({'route':route or '/','foreignState':6050,'landedNextTick':True,'landingState':5100,'landingY':0,'recoveredState':0,'recoveredCtrl':1,'errors':errors});page.close()
    browser.close()
Path('work/landing-browser-evidence.json').write_text(json.dumps(results,indent=2));print(json.dumps(results))
