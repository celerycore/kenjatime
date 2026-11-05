from zipfile import ZipFile,ZIP_DEFLATED
from playwright.sync_api import sync_playwright
import json,os
from pathlib import Path
os.chdir(Path(__file__).resolve().parent.parent)
Path("work").mkdir(exist_ok=True)
with ZipFile('public/kfm.zip') as z:sprite=z.read('kfm/kfm.sff')
script='''[Data]
liedown.time=80
[Statedef 0]
type=S
movetype=I
physics=N
ctrl=1
anim=0
[State Enemy helper]
type=Helper
triggerall=TeamSide=2
trigger1=time=0
trigger1=NumHelper(9)=0
stateno=300
id=9
pos=100,0
[Statedef 300]
type=S
movetype=I
physics=N
ctrl=0
anim=0
'''
for state,params in [(200,'id=11\ndamage=10'),(201,'id=22\nchainID=11\ndamage=20'),(202,'id=33\nnochainID=22\ndamage=40'),(203,'id=44\nattr=S,NT\ndamage=30')]:
 script+=f'''[Statedef {state}]
type=S
movetype=A
physics=N
ctrl=0
anim=0
[State Hit]
type=HitDef
trigger1=time=0
attr=S,NA
ground.hittime=80
ground.velocity=0,0
sparkno=-1
{params}
[State Ready]
type=ChangeState
trigger1=time=1
value=0
ctrl=1
'''
script+='''[Statedef 5050]
type=A
movetype=H
physics=N
ctrl=0
[State Fall]
type=HitFallSet
trigger1=time=0
value=1
[State Velocity]
type=VelSet
trigger1=time=0
y=-2
[State Gravity]
type=VelAdd
trigger1=1
y=.1
[State Recovery]
type=SelfState
triggerall=CanRecover
trigger1=command="recovery"
value=5210
'''
cmd=''
for name,key in [('foundation','x'),('follow','y'),('blocked','z'),('throw','a'),('lie','s'),('fall','b'),('recovery','a+b')]:cmd+=f'[Command]\nname="{name}"\ncommand={key}\n'
cmd+='[Statedef -1]\n'
for state,name in [(200,'foundation'),(201,'follow'),(202,'blocked'),(203,'throw')]:cmd+=f'[State Attack]\ntype=ChangeState\ntriggerall=TeamSide=1\ntriggerall=ctrl\ntrigger1=command="{name}"\nvalue={state}\n'
for name,state in [('lie',5110),('fall',5050)]:cmd+=f'[State Target state]\ntype=TargetState\ntriggerall=TeamSide=1\ntrigger1=command="{name}"\nvalue={state}\n'
cmd+='[State Air position]\ntype=TargetBind\ntriggerall=TeamSide=1\ntrigger1=command="fall"\ntime=1\npos=60,-60\n'
with ZipFile('work/workflow-fixture.zip','w',ZIP_DEFLATED) as z:
 for path,data in {'test.def':'[Info]\nname=Combat Workflow Fixture\n[Files]\ncns=test.cns\nst=test.cns\ncmd=test.cmd\nanim=test.air\nsprite=test.sff','test.cns':script,'test.cmd':cmd,'test.air':'[Begin Action 0]\nClsn1Default:1\nClsn1[0]=0,-60,200,0\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,0,0,-1','test.sff':sprite}.items():z.writestr(path,data)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1440,'height':1000},accept_downloads=True);errors=[];failures=[]
 page.on('pageerror',lambda e:errors.append(str(e)));page.on('requestfailed',lambda req:failures.append(req.url))
 page.goto(os.environ.get('MUGEN_TEST_URL','http://127.0.0.1:5173/'),wait_until='networkidle');page.locator('#file').set_input_files('work/workflow-fixture.zip')
 page.wait_for_function("document.querySelector('#name').textContent.includes('Combat Workflow')")
 page.locator('#training').click();page.locator('#play').click();page.locator('#reset').click()
 def steps(n):page.evaluate('(n)=>{for(let i=0;i<n;i++)document.querySelector("#step").click()}',n)
 def tap(key):page.locator('canvas').click();page.keyboard.down(key);steps(1);page.keyboard.up(key);steps(2)
 def report(name):
  with page.expect_download() as pending:page.locator('#export-report').click()
  pending.value.save_as('work/'+name+'.json');return json.load(open('work/'+name+'.json'))
 def helper(data):return next(actor for actor in data['entities'] if actor['name'].endswith('helper'))
 steps(1);tap('z');first=report('workflow-foundation');assert first['opponent']['life']==helper(first)['life']==990,first
 tap('x');follow=report('workflow-follow');assert follow['opponent']['life']==helper(follow)['life']==970,follow
 assert follow['opponent']['getHitVars']['chainid']==22
 tap('c');blocked=report('workflow-blocked');assert blocked['opponent']['life']==helper(blocked)['life']==970
 tap('a');thrown=report('workflow-throw');assert thrown['opponent']['life']==970 and helper(thrown)['life']==940,thrown
 assert thrown['player']['targets']==[helper(thrown)['id']]
 tap('z');tap('Enter');lying=report('workflow-lying');assert lying['opponent']['stateNo']==5110,lying
 page.locator('#dummy-mode').select_option('keyboard');page.locator('canvas').click();page.keyboard.down('Numpad1');steps(1);pressed=report('workflow-pressed');page.keyboard.up('Numpad1')
 assert pressed['opponent']['getHitVars']['recovertime']<lying['opponent']['getHitVars']['recovertime']-1
 for i in range(20):
  page.keyboard.down('Numpad1' if i%2==0 else 'Numpad3');steps(1);page.keyboard.up('Numpad1' if i%2==0 else 'Numpad3');steps(1)
 up=report('workflow-up');assert up['opponent']['stateNo']==0 and up['opponent']['stateOwner']==2,up
 tap('s');steps(3);falling=report('workflow-falling');assert falling['opponent']['getHitVars']['fall.time']>=4,falling
 page.locator('canvas').click();page.keyboard.down('Numpad1');page.keyboard.down('Numpad3');steps(1);page.keyboard.up('Numpad1');page.keyboard.up('Numpad3')
 recovery=report('workflow-air-recovery');assert recovery['opponent']['stateNo']==5210 and recovery['opponent']['stateOwner']==2,recovery
 steps(5);done=report('workflow-done');assert done['opponent']['stateNo']==50,done
 assert not done['issues'],done['issues'];page.screenshot(path='work/workflow-combat.png',full_page=True)
 page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(60);assert page.evaluate('document.documentElement.scrollWidth')<=390
 result={'foundationLife':first['opponent']['life'],'followLife':follow['opponent']['life'],'blockedLife':blocked['opponent']['life'],'throwLife':[thrown['opponent']['life'],helper(thrown)['life']],'liedownBefore':lying['opponent']['getHitVars']['recovertime'],'afterPress':pressed['opponent']['getHitVars']['recovertime'],'getupState':up['opponent']['stateNo'],'airRecoveryState':recovery['opponent']['stateNo'],'finalState':done['opponent']['stateNo'],'errors':errors,'failedRequests':failures}
 json.dump(result,open('work/browser-workflow-result.json','w'),indent=2);print(json.dumps(result));browser.close();assert not errors;assert not failures
