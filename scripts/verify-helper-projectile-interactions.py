"""Exercise helper guard/push/camera and simultaneous projectile hitpause through the built app."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from playwright.sync_api import sync_playwright
import json, os, struct

os.chdir(Path(__file__).resolve().parent.parent)
Path('work').mkdir(exist_ok=True)
# Independently authored 8x8 indexed sprites: white, red, green and blue.
count=4;palette_offset=68+count*28;data_offset=palette_offset+16
sprite=bytearray(data_offset+20+count*64);sprite[:12]=b'ElecbyteSpr\0';sprite[15]=2
def u(offset,value):struct.pack_into('<I',sprite,offset,value)
def h(offset,value):struct.pack_into('<H',sprite,offset,value)
u(36,68);u(40,count);u(44,palette_offset);u(48,1);u(52,data_offset)
h(palette_offset,1);h(palette_offset+2,1);h(palette_offset+4,5);u(palette_offset+12,20)
sprite[data_offset:data_offset+20]=bytes([255,0,255,0,255,255,255,255,255,0,0,255,0,255,0,255,0,0,255,255])
for index in range(count):
    p=68+index*28;h(p,0);h(p+2,index);h(p+4,8);h(p+6,8);h(p+8,4);h(p+10,8)
    sprite[p+15]=8;u(p+16,20+index*64);u(p+20,64)
    sprite[data_offset+20+index*64:data_offset+20+(index+1)*64]=bytes([index+1])*64

cmd=''
for state,key in [(200,'x'),(201,'y'),(202,'z')]:
    cmd+=f'[Command]\nname="move{state}"\ncommand={key}\ntime=1\n'
cmd+='[Statedef -1]\n'
for state in range(200,203):
    cmd+=f'[State Input]\ntype=ChangeState\ntriggerall=TeamSide=1\ntriggerall=ctrl\ntrigger1=command="move{state}"\nvalue={state}\n'
script='''[Statedef -2]
[State Guard observation]
type=VarSet
trigger1=1
v=0
value=InGuardDist
[State Enemy helper]
type=Helper
triggerall=TeamSide=2
triggerall=NumHelper(77)=0
trigger1=EnemyNear,Var(10)=1
stateno=301
id=77
pos=-8,0
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
[State Threat]
type=Helper
trigger1=Time=0
stateno=300
id=70
pos=180,0
facing=-1
[Statedef 201]
type=S
movetype=I
physics=N
ctrl=0
anim=0
[State Spawn enemy helper]
type=VarSet
trigger1=Time=0
v=10
value=1
[State Multi contact]
type=Projectile
trigger1=Time=1
projanim=100
projhitanim=102
projhits=1
offset=140,0
velocity=0,0
remvelocity=2,0
attr=S,NP
damage=10
pausetime=2,2
ground.hittime=0
ground.velocity=0,0
sparkno=-1
[Statedef 202]
type=S
movetype=I
physics=N
ctrl=0
anim=0
[State Pushing camera helper]
type=Helper
trigger1=Time=0
stateno=302
id=72
pos=138,-60
[Statedef 300]
type=S
movetype=A
physics=N
ctrl=0
anim=10
[State Threat]
type=HitDef
trigger1=Time=0
attr=S,NA
guard.dist=100
[Statedef 301]
type=S
movetype=I
physics=N
ctrl=0
anim=0
[Statedef 302]
type=S
movetype=I
physics=N
ctrl=0
anim=10
[State Ground helper]
type=PosSet
trigger1=Time=1
y=0
[State Push]
type=PlayerPush
trigger1=1
value=1
[State Camera]
type=ScreenBound
trigger1=Time=0
value=0
movecamera=0,1
'''
air='''[Begin Action 0]
Clsn2Default:1
Clsn2[0]=-20,-40,20,0
0,0,0,0,-1
[Begin Action 10]
Clsn2Default:1
Clsn2[0]=-20,-40,20,0
0,1,0,0,-1
[Begin Action 100]
Clsn1Default:1
Clsn1[0]=-20,-40,20,0
Clsn2Default:1
Clsn2[0]=-20,-40,20,0
0,1,0,0,-1
[Begin Action 102]
0,2,0,0,1
'''
stage='''[Info]
name=Interaction camera stage
[Camera]
boundleft=-300
boundright=300
boundhigh=-100
verticalfollow=1
floortension=0
tension=50
[StageInfo]
localcoord=320,240
zoffset=200
[PlayerInfo]
p1startx=-70
p2startx=70
[BGDef]
spr=test.sff
'''
with ZipFile('work/interactions-browser-fixture.zip','w',ZIP_DEFLATED) as target:
    for path,data in {'test.def':'[Info]\nname=Interaction Browser Fixture\nmugenversion=1.1\n[Files]\ncns=test.cns\nst=test.cns\ncmd=test.cmd\nanim=test.air\nsprite=test.sff','test.cns':script,'test.cmd':cmd,'test.air':air,'test.sff':sprite,'stage.def':stage}.items():target.writestr(path,data)

with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':1000},accept_downloads=True);errors=[];failures=[]
    page.on('pageerror',lambda e:errors.append(str(e)));page.on('requestfailed',lambda r:failures.append(r.url))
    page.goto(os.environ.get('MUGEN_TEST_URL','http://127.0.0.1:5186/next/')+'?perf=1&graphics=high',wait_until='networkidle')
    assert page.locator('.tag i').inner_text()=='21'
    page.wait_for_function('!document.querySelector("#file").disabled')
    page.locator('#file').set_input_files('work/interactions-browser-fixture.zip')
    page.wait_for_function("document.querySelector('#name').textContent==='Interaction Browser Fixture'")
    if page.locator('#arena-mode').count():page.locator('#arena-mode').select_option('training')
    page.locator('#training').click();page.locator('#play').click();page.locator('#reset').click()
    page.evaluate('window.__kenjatimePerformance.benchmark({frames:1,ticksPerFrame:0})')
    def steps(n):page.evaluate('(n)=>{for(let i=0;i<n;i++)document.querySelector("#step").click()}',n)
    def press(key):
        page.locator('canvas').click();page.keyboard.down(key);steps(1);page.keyboard.up(key)
    def report(name):
        with page.expect_download() as pending:page.locator('#export-report').click()
        path=Path('work/interactions-'+name+'.json');pending.value.save_as(path);data=json.loads(path.read_text());assert not data['issues'],data['issues'];return data
    def pixels():
        page.evaluate('window.__kenjatimePerformance.benchmark({frames:1,ticksPerFrame:0})')
        return page.locator('canvas').evaluate('''c=>{const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let red=0,green=0;for(let i=0;i<d.length;i+=4){if(d[i]>240&&d[i+1]<10&&d[i+2]<10)red++;if(d[i]<10&&d[i+1]>240&&d[i+2]<10)green++;}return{red,green};}''')
    press('z');guard_first=report('guard-first');assert guard_first['opponent']['variables']['int'][0]==0
    assert next(a for a in guard_first['interactionState'] if a['id']==2)['inGuardDist']
    steps(1);guard_next=report('guard-next');assert guard_next['opponent']['variables']['int'][0]==1

    page.locator('#reset').click();press('x');steps(1);contact=report('contact')
    assert contact['opponent']['life']==990 and len(contact['entities'])==3
    helper=next(a for a in contact['entities'] if a['id']>2);assert helper['life']==990
    projectile=contact['projectiles'][0];assert projectile['remainingHits']==0 and projectile['hitPauseTime']==2
    assert projectile['removing'] and not projectile['removalStarted'] and projectile['anim']==100
    paused_pixels=pixels();assert paused_pixels['red']>0 and paused_pixels['green']==0
    for tick in [1,2]:
        steps(1);paused=report('paused-'+str(tick));current=paused['projectiles'][0]
        assert current['pos']==projectile['pos'] and current['time']==projectile['time'] and current['hitPauseTime']==2-tick
        assert pixels()['green']==0
    steps(1);removed=report('removed');assert removed['projectiles'][0]['removed'] and removed['projectiles'][0]['anim']==102
    removed_pixels=pixels();assert removed_pixels['green']>0
    steps(1);assert report('finished')['projectiles']==[] and pixels()['green']==0

    page.locator('#reset').click();press('c');camera=report('camera');assert camera['stage']['camera']['y']==-60
    assert camera['opponent']['pos']['x']==70
    steps(1);pushed=report('pushed');helper=next(a for a in pushed['entities'] if a['id']>2)
    assert pushed['stage']['camera']['y']==0
    assert abs(helper['pos']['x']-pushed['opponent']['pos']['x'])==32
    assert next(a for a in pushed['interactionState'] if a['id']==helper['id'])['playerPush']
    page.set_viewport_size({'width':390,'height':844});assert page.evaluate('document.documentElement.scrollWidth')<=390
    assert not errors and not failures,(errors,failures)
    evidence={'guardObservation':[guard_first['opponent']['variables']['int'][0],guard_next['opponent']['variables']['int'][0]],'simultaneousLife':[contact['opponent']['life'],next(a for a in contact['entities'] if a['id']>2)['life']],'pauseTicks':2,'pausedPixels':paused_pixels,'removedPixels':removed_pixels,'cameraY':[camera['stage']['camera']['y'],pushed['stage']['camera']['y']],'pushDistance':abs(helper['pos']['x']-pushed['opponent']['pos']['x']),'consoleErrors':errors,'failedRequests':failures}
    Path('work/interaction-browser-evidence.json').write_text(json.dumps(evidence,indent=2));print(json.dumps(evidence));browser.close()
