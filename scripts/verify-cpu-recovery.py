"""One-hit combo gaps: CPU/human recovery must pass CMD and authored CNS gates."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from playwright.sync_api import sync_playwright
import json, os

os.chdir(Path(__file__).resolve().parent.parent)
Path('work').mkdir(exist_ok=True)
with ZipFile('public/kfm.zip') as z:sprite=z.read('kfm/kfm.sff')
air=''
for n in [0,5000,5010,5020,5030,5035,5040,5050,5060,5100,5101,5110,5120,5210]:air+=f'[Begin Action {n}]\nClsn2Default:1\nClsn2[0]=-10,-60,10,0\n0,0,0,0,4\n'
attacker_air='[Begin Action 0]\n0,0,0,0,-1\n[Begin Action 600]\nClsn1Default:1\nClsn1[0]=0,-80,160,0\n0,0,0,0,-1\n[Begin Action 5050]\n0,0,0,0,-1\n'
victim='''[Statedef 0]
type=S
movetype=I
physics=N
ctrl=0
anim=0
[Statedef 5050]
type=A
movetype=H
physics=N
ctrl=0
[State Gravity]
type=VelAdd
trigger1=1
y=GetHitVar(yaccel)
[State Air tech]
type=SelfState
triggerall=CanRecover
triggerall=Vel Y>-1
trigger1=command="ukemi"
value=5210
[State Land]
type=ChangeState
trigger1=Pos Y>=0 && Vel Y>0
value=5100
[Statedef 5210]
type=A
movetype=I
physics=A
ctrl=1
anim=5210
[State Record tech]
type=VarSet
trigger1=Time=0
v=10
value=1
[State Recovery velocity]
type=VelSet
trigger1=Time=0
y=-3
[State Finish]
type=ChangeState
trigger1=Time>20
value=50
ctrl=1
'''
attack='''[Statedef 0]
type=S
movetype=I
physics=N
ctrl=0
anim=0
[State Attack once]
type=ChangeState
trigger1=Time=0
value=600
[Statedef 600]
type=S
movetype=A
physics=N
ctrl=0
anim=600
[State One launcher]
type=HitDef
trigger1=Time=0
attr=S,NA
hitonce=1
damage=1
ground.velocity=3,-13
ground.hittime=20
fall=1
fall.recover=RECOVER
fall.recovertime=33
yaccel=.35
pausetime=0,3
sparkno=-1
hitsound=-1,0
FOREIGN
[State End combo]
type=ChangeState
trigger1=Time>=4
value=601
[Statedef 601]
type=S
movetype=I
physics=N
ctrl=0
anim=0
[Statedef 6050]
type=A
movetype=H
physics=N
ctrl=0
[State Launch velocity]
type=VelSet
trigger1=Time=0
x=GetHitVar(xvel)
y=GetHitVar(yvel)
[State Gravity]
type=VelAdd
trigger1=1
y=GetHitVar(yaccel)
[State Victim air tech]
type=SelfState
triggerall=CanRecover
triggerall=Vel Y>-1
trigger1=command="ukemi"
value=5210
[State Victim landing]
type=SelfState
trigger1=Pos Y>=0 && Vel Y>0
value=5100
'''
for kind in ['normal','foreign','unrecoverable']:
    files={'victim/v.def':'[Info]\nname=Recovery Victim\n[Files]\ncns=v.cns\ncmd=v.cmd\nanim=v.air\nsprite=v.sff','victim/v.cns':victim,'victim/v.cmd':'[Command]\nname="ukemi"\ncommand=a\ntime=1','victim/v.air':air,'victim/v.sff':sprite,'attacker/a.def':'[Info]\nname=One-hit Attacker\n[Files]\ncns=a.cns\nanim=a.air\nsprite=a.sff','attacker/a.cns':attack.replace('RECOVER','0' if kind=='unrecoverable' else '1').replace('FOREIGN','p2stateno=6050\np2getp1state=1' if kind=='foreign' else ''),'attacker/a.air':attacker_air,'attacker/a.sff':sprite}
    with ZipFile(f'work/cpu-recovery-{kind}.zip','w',ZIP_DEFLATED) as z:
        for path,data in files.items():z.writestr(path,data)

base=os.environ.get('MUGEN_TEST_BASE','http://127.0.0.1:5186/next/').rstrip('/')+'/'
results=[]
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
    for route in ['', 'arena/', 'arena-classic/']:
        page=browser.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(base+route+'?perf=1&graphics=high&v=22',wait_until='networkidle')
        if route:page.wait_for_function('!document.querySelector("#file").disabled');page.locator('#arena-mode').select_option('training')
        def steps(n):page.evaluate('(n)=>{for(let i=0;i<n;i++)document.querySelector("#step").click()}',n)
        def report():
            return page.evaluate('''async()=>{let blob;const url=URL.createObjectURL,click=HTMLAnchorElement.prototype.click;URL.createObjectURL=b=>{blob=b;return 'blob:fixture'};HTMLAnchorElement.prototype.click=function(){};try{document.querySelector('#export-report').click();return JSON.parse(await blob.text())}finally{URL.createObjectURL=url;HTMLAnchorElement.prototype.click=click}}''')
        for kind,role in [('normal','p1cpu'),('foreign','p1cpu'),('unrecoverable','p1cpu'),('normal','p2cpu'),('foreign','p2cpu'),('normal','human')]:
            before=int(page.locator('#count').inner_text())
            page.locator('#file').set_input_files(f'work/cpu-recovery-{kind}.zip')
            page.wait_for_function("n=>Number(document.querySelector('#count').textContent)===n+2 && document.querySelector('#name').textContent==='Recovery Victim'",arg=before)
            page.locator('#training').click()
            # Each import appends victim+attacker. Swap sides to exercise both CPUs.
            count=int(page.locator('#count').inner_text());p2=role=='p2cpu';subject='opponent' if p2 else 'player'
            if p2:page.locator(f'#cards [data-id="{count-1}"]').click()
            page.locator('#opponent-select').select_option(str(count-2 if p2 else count-1))
            page.locator('#player-control').select_option('cpu' if role=='p1cpu' else 'keyboard');page.locator('#dummy-mode').select_option('cpu' if p2 else 'stand')
            if role!='human':page.locator('#cpu-level').select_option('7')
            page.evaluate('window.__kenjatimePerformance.benchmark({frames:1,ticksPerFrame:0})');page.locator('#reset').click()
            steps(1);hit=report()[subject];assert hit['moveType']=='H' and hit['getHitVars']['fall.recovertime']==33,hit
            assert hit['stateOwner']==(3-hit['id'] if kind=='foreign' else hit['id'])
            steps(30);waiting=report()[subject];assert waiting['variables']['int'][10]==0
            tech=None
            if role=='human':
                steps(20);assert not report()[subject]['variables']['int'][10]
                page.locator('canvas').click();page.keyboard.down('a');steps(1);page.keyboard.up('a')
                r=report();tech=52;assert r[subject]['variables']['int'][10]==1
            for tick in range(31,100):
                if role=='human':break
                steps(1);r=report()
                if r[subject]['variables']['int'][10]:tech=tick+1;break
            if kind=='unrecoverable':assert tech is None
            else:
                assert tech is not None,(kind,r[subject]);assert r[subject]['stateOwner']==r[subject]['id'];assert r[subject]['moveType']=='I'
                assert 'ukemi' in r[subject]['commands'];assert not r['issues'],r['issues']
            results.append({'route':route or '/','kind':kind,'role':role,'techTick':tech,'state':r[subject]['stateNo'],'ownerRestored':r[subject]['stateOwner']==r[subject]['id'],'cpuLevel':r[subject]['aiLevel'],'errors':errors})
        assert not errors;assert page.evaluate('document.documentElement.scrollWidth')<=390;page.close()
    browser.close()
Path('work/cpu-recovery-browser-evidence.json').write_text(json.dumps(results,indent=2)+'\n');print(json.dumps(results))
