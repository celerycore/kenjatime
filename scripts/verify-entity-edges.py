"""Check helper/projectile lifecycle through ZIP import, CMD, reports and pixels."""
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
for state,key in [(200,'x'),(201,'y'),(202,'z'),(203,'a'),(204,'b'),(205,'c'),(206,'s'),(207,'a+b')]:
    cmd+=f'[Command]\nname="move{state}"\ncommand={key}\ntime=1\n'
cmd+='[Statedef -1]\n'
for state in [207,*range(200,207)]:
    cmd+=f'[State Command]\ntype=ChangeState\ntriggerall=TeamSide=1\ntriggerall=ctrl\ntrigger1=command="move{state}"\nvalue={state}\n'
script='[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nctrl=1\nanim=0\n'
for state in range(200,208):
    script+=f'[Statedef {state}]\ntype=S\nmovetype=I\nphysics=N\nctrl=0\nanim=0\n'
    if state in [200,201,207]:
        script+=f'[State Helper]\ntype=Helper\ntrigger1=Time=0\nstateno={ {200:300,201:301,207:302}[state] }\nid=77\nownpal={1 if state==207 else 0}\n'
    else:
        params={202:'projhits=3\nprojhitanim=102',203:'projhits=1\nprojhitanim=102',204:'projhits=1\nprojremove=0',205:'projanim=0\nprojshadow=0\noffset=70,0',206:'projanim=0\nprojshadow=1\noffset=70,0'}[state]
        script+='[State Projectile]\ntype=Projectile\ntrigger1=Time=0\nprojid=80\nprojanim=100\noffset=140,0\nvelocity=0,0\nattr=S,NP\ndamage=10\nground.velocity=0,0\nground.hittime=0\nsparkno=-1\n'+params+'\n'
    script+='[State Ready]\ntype=ChangeState\ntrigger1=Time=1\nvalue=0\nctrl=1\n'
for state,remove in [(300,0),(301,1),(302,0)]:
    palette='[State Color]\ntype=PalFX\ntrigger1=Time=0\ntime=3\nadd=0,128,0\n' if state==302 else ''
    script+=f'''[Statedef {state}]
type=S
movetype=I
physics=N
ctrl=0
anim=0
{palette}[State Visual]
type=Explod
trigger1=Time=0
anim=10
postype=none
pos=-100,-80
removetime=8
[State Gone]
type=DestroySelf
trigger1=Time=0
removeexplods={remove}
'''
air='''[Begin Action 0]
Clsn2Default:1
Clsn2[0]=-8,-8,8,0
0,0,0,0,-1
[Begin Action 10]
0,1,0,0,-1
[Begin Action 100]
Clsn1Default:1
Clsn1[0]=-12,-8,12,0
Clsn2Default:1
Clsn2[0]=-8,-8,8,0
0,1,0,0,-1
[Begin Action 102]
0,2,0,0,1
'''
stage='''[Info]
name=Entity pixel stage
[StageInfo]
localcoord=320,240
zoffset=200
[PlayerInfo]
p1startx=-70
p2startx=70
[Shadow]
intensity=128
color=0,0,0
yscale=.4
[BGDef]
spr=test.sff
[BG Floor]
type=normal
spriteno=0,0
start=0,240
scalestart=50,30
'''
with ZipFile('work/entity-browser-fixture.zip','w',ZIP_DEFLATED) as target:
    for path,data in {'test.def':'[Info]\nname=Entity Edge Fixture\nmugenversion=1.1\n[Files]\ncns=test.cns\nst=test.cns\ncmd=test.cmd\nanim=test.air\nsprite=test.sff','test.cns':script,'test.cmd':cmd,'test.air':air,'test.sff':sprite,'stage.def':stage}.items():target.writestr(path,data)

with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':1000},accept_downloads=True);errors=[];failures=[]
    page.on('pageerror',lambda e:errors.append(str(e)));page.on('requestfailed',lambda r:failures.append(r.url))
    page.goto(os.environ.get('MUGEN_TEST_URL','http://127.0.0.1:5186/next/')+'?perf=1&graphics=high',wait_until='networkidle')
    assert page.locator('.tag i').inner_text()=='22'
    page.locator('#file').set_input_files('work/entity-browser-fixture.zip')
    page.wait_for_function("document.querySelector('#name').textContent==='Entity Edge Fixture'")
    page.locator('#training').click();page.locator('#play').click();page.locator('#reset').click()
    def steps(n):page.evaluate('(n)=>{for(let i=0;i<n;i++)document.querySelector("#step").click()}',n)
    def press(key):
        page.locator('canvas').click();page.keyboard.down(key);steps(1);page.keyboard.up(key)
    def render():page.evaluate('window.__kenjatimePerformance.benchmark({frames:1,ticksPerFrame:0})')
    def pixels():
        render()
        return page.locator('canvas').evaluate('''(canvas)=>{const ctx=canvas.getContext('2d'),d=ctx.getImageData(0,0,960,540).data;let red=0,green=0,orange=0,shadow=0;for(let i=0;i<d.length;i+=4){if(d[i]>240&&d[i+1]<10&&d[i+2]<10)red++;if(d[i]<10&&d[i+1]>240&&d[i+2]<10)green++;if(d[i]>240&&d[i+1]>120&&d[i+1]<140&&d[i+2]<10)orange++;}for(let y=451;y<458;y++)for(let x=473;x<487;x++){const i=(y*960+x)*4;if(d[i]<200&&d[i+1]<200&&d[i+2]<200)shadow++;}return{red,green,orange,shadow};}''')
    def report(name):
        with page.expect_download() as pending:page.locator('#export-report').click()
        path=Path('work/entity-'+name+'.json');pending.value.save_as(path);data=json.loads(path.read_text());assert not data['issues'],data['issues'];return data
    press('z');orphan=report('orphan');visible=pixels()
    assert len(orphan['entities'])==2 and len(orphan['orphanExplods'])==1,orphan
    assert visible['red']>0,visible
    steps(8);assert pixels()['red']==0;assert report('orphan-expired')['orphanExplods']==[]
    page.locator('#reset').click();press('x');assert pixels()['red']==0;assert report('removed')['orphanExplods']==[]
    page.locator('#reset').click();page.locator('canvas').click();page.keyboard.down('a');page.keyboard.down('s');steps(1);page.keyboard.up('a');page.keyboard.up('s');tint=pixels();assert tint['orange']>0,tint
    steps(3);faded=pixels();assert faded['orange']==0 and faded['red']>0,faded

    page.locator('#reset').click();press('c');one=report('quota-one');assert one['opponent']['life']==990 and one['projectiles'][0]['remainingHits']==2
    steps(1);two=report('quota-two');assert two['opponent']['life']==980 and two['projectiles'][0]['remainingHits']==1
    steps(1);three=report('quota-three');assert three['opponent']['life']==970 and three['projectiles'][0]['removed']
    assert pixels()['green']>0;steps(1);assert pixels()['green']==0;assert report('quota-finished')['projectiles']==[]

    page.locator('#reset').click();press('a');single=report('single');assert single['opponent']['life']==990 and single['projectiles'][0]['removed']
    assert pixels()['green']>0;steps(1);assert pixels()['green']==0

    page.locator('#reset').click();press('s');steps(8);persistent=report('persistent')
    assert persistent['opponent']['life']==990 and persistent['projectiles'][0]['remainingHits']==0
    assert not persistent['projectiles'][0]['removing'] and pixels()['red']>0

    page.locator('#reset').click();press('d');no_shadow=pixels()['shadow'];assert not report('no-shadow')['projectiles'][0]['shadow']
    page.locator('#reset').click();press('Enter');with_shadow=pixels()['shadow'];assert report('with-shadow')['projectiles'][0]['shadow']
    assert with_shadow>no_shadow,(with_shadow,no_shadow)
    page.screenshot(path='work/entity-browser.png',full_page=True)
    page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(100);assert page.evaluate('document.documentElement.scrollWidth')<=390
    assert not errors,errors;assert not failures,failures
    result={'orphanRedPixels':visible['red'],'orphanPalettePixels':tint['orange'],'quotaLives':[one['opponent']['life'],two['opponent']['life'],three['opponent']['life']],'oneTickRemovalVisible':True,'exhaustedProjectileLife':persistent['opponent']['life'],'shadowPixels':[no_shadow,with_shadow],'errors':errors,'failedRequests':failures}
    Path('work/browser-entity-result.json').write_text(json.dumps(result,indent=2));print(json.dumps(result));browser.close()
