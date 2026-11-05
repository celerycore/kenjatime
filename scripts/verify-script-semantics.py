"""Check typed CNS evaluation through ZIP import, real CMD input and reports."""
from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
from playwright.sync_api import sync_playwright
import json,os

os.chdir(Path(__file__).resolve().parent.parent)
Path('work').mkdir(exist_ok=True)
with ZipFile('public/kfm.zip') as z:sprite=z.read('kfm/kfm.sff')
script='''[Statedef 0]
type=S
movetype=I
physics=N
ctrl=1
anim=0
[State Set range once]
type=VarRangeSet
trigger1=Time=0
first=0
last=2
value=var(9):=var(9)+1
[State Float cancellation]
type=VarSet
trigger1=Time=0
fv=0
value=16777216.0+1.0-16777216.0
[State Integer wrap]
type=VarSet
trigger1=Time=0
v=3
value=2147483647+1
[State Skipped group]
type=VarSet
trigger1=0
trigger3=var(8):=9
v=4
value=8
[State Bottom parameter]
type=VarSet
trigger1=Time=0
v=5
value=1/0+(var(6):=11)
[State Invalid flag]
type=VarSet
trigger1=1
ignorehitpause=var(12):=1
v=13
value=9
[Statedef 210]
type=S
movetype=I
physics=N
ctrl=0
anim=0
[State Read variables]
type=VarSet
trigger1=Time=0
var(IfElse(Time=0,7,14))=var(0)+var(1)
[State Display result]
type=DisplayToClipboard
trigger1=1
text="range=%d,%d,%d calls=%d float=%f wrap=%d"
params=var(0),var(1),var(2),var(9),fvar(0),var(3)
[State Append result]
type=AppendToClipboard
trigger1=1
text="bottom=%d later=%d cmd=%d"
params=var(5),var(6),var(7)
'''
cmd='''[Command]
name="inspect"
command=x
[Statedef -1]
[State Native input]
type=ChangeState
trigger1=command="inspect"
value=210
'''
with ZipFile('work/script-semantics-fixture.zip','w',ZIP_DEFLATED) as z:
    for path,data in {'test.def':'[Info]\nname=Script Semantics\n[Files]\nsprite=test.sff\nanim=test.air\ncns=test.cns\nst=test.cns\ncmd=test.cmd','test.cns':script,'test.cmd':cmd,'test.air':'[Begin Action 0]\n0,0,0,0,-1','test.sff':sprite}.items():z.writestr(path,data)
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':1000},accept_downloads=True)
    errors=[];failures=[]
    page.on('pageerror',lambda e:errors.append(str(e)));page.on('requestfailed',lambda r:failures.append(r.url))
    page.goto(os.environ.get('MUGEN_TEST_URL','http://127.0.0.1:5186/kenjatime/'),wait_until='networkidle')
    page.locator('#file').set_input_files('work/script-semantics-fixture.zip')
    page.wait_for_function("document.querySelector('#name').textContent==='Script Semantics'")
    page.locator('#training').click();page.locator('#play').click();page.locator('#reset').click()
    def steps(n):page.evaluate('(n)=>{for(let i=0;i<n;i++)document.querySelector("#step").click()}',n)
    steps(1);page.locator('canvas').click();page.keyboard.down('z');steps(1);page.keyboard.up('z');steps(1)
    page.locator('#debug-text').check()
    with page.expect_download() as pending:page.locator('#export-report').click()
    pending.value.save_as('work/browser-script-semantics-report.json')
    report=json.loads(Path('work/browser-script-semantics-report.json').read_text());f=report['player'];v=f['variables']['int']
    assert f['stateNo']==210 and f['ctrl']==0,f
    assert v[:10]==[1,1,1,-2147483648,0,0,11,2,0,1],v[:10]
    assert v[12]==v[13]==0 and f['variables']['float'][0]==0
    assert f['clipboard']=='range=1,1,1 calls=1 float=0.000000 wrap=-2147483648\nbottom=0 later=11 cmd=2',f['clipboard']
    assert {d['type'] for d in report['issues']}=={'trigger-numbering','controller-parameter','parameter-bottom'},report['issues']
    page.screenshot(path='work/browser-script-semantics.png',full_page=True)
    assert not errors,errors
    assert not failures,failures
    result={'state':f['stateNo'],'intVariables':v[:10],'floatVariable':f['variables']['float'][0],'clipboard':f['clipboard'],'diagnosticTypes':sorted({d['type'] for d in report['issues']}),'errors':errors,'failedRequests':failures}
    Path('work/browser-script-semantics-result.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
    browser.close()
