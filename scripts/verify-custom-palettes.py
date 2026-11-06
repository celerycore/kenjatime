"""Import two independent SFF/CNS/AIR characters and inspect custom-state/palette reports and pixels."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from playwright.sync_api import sync_playwright
import json, os, struct

os.chdir(Path(__file__).resolve().parent.parent)
Path('work').mkdir(exist_ok=True)

def sprites(colors):
    count=2;paloff=68+count*28;dataoff=paloff+len(colors)*16
    b=bytearray(dataoff+count*64+len(colors)*8);b[:12]=b'ElecbyteSpr\0';b[15]=2
    def u(p,n):struct.pack_into('<I',b,p,n)
    def h(p,n):struct.pack_into('<H',b,p,n)
    u(36,68);u(40,count);u(44,paloff);u(48,len(colors));u(52,dataoff)
    for i in range(count):
        p=68+i*28;h(p+2,i);h(p+4,8);h(p+6,8);h(p+8,4);h(p+10,8);b[p+15]=8;u(p+16,i*64);u(p+20,64);b[dataoff+i*64:dataoff+(i+1)*64]=bytes([1])*64
    for i,rgb in enumerate(colors):
        p=paloff+i*16;h(p,1);h(p+2,i+1);h(p+4,2);u(p+8,count*64+i*8);u(p+12,8);b[dataoff+count*64+i*8:dataoff+count*64+(i+1)*8]=bytes([255,0,255,0,*rgb,255])
    return b

commands='''[Command]
name="throw"
command=x
time=1
[Command]
name="palettes"
command=y
time=1
[Statedef -1]
[State Throw]
type=ChangeState
triggerall=ctrl
trigger1=command="throw"
value=200
[State Palettes]
type=ChangeState
triggerall=ctrl
trigger1=command="palettes"
value=202
'''
attacker='''[Statedef 0]
type=S
movetype=I
physics=N
ctrl=1
anim=0
[Statedef 200]
type=S
movetype=A
physics=N
ctrl=0
anim=100
[State Throw]
type=HitDef
trigger1=Time=0
attr=S,NT
damage=10
pausetime=0,0
ground.velocity=0,0
p2stateno=700
p2getp1state=1
sparkno=-1
[Statedef 700]
type=U
movetype=H
physics=N
ctrl=0
[State Foreign AIR]
type=ChangeAnim2
trigger1=Time=0
value=700
[State Animation bank]
type=VarSet
trigger1=Time=0
v=2
value=AnimExist(700)*10+SelfAnimExist(700)
[State Restore own states]
type=SelfState
trigger1=Time=3
value=701
ctrl=1
anim=-1
[Statedef 202]
type=S
movetype=I
physics=N
ctrl=0
anim=0
[State Green working palette]
type=RemapPal
trigger1=Time=0
source=1,1
dest=1,2
[State Parent tint]
type=PalFX
trigger1=Time=0
time=20
add=128,0,0
[State Independent helper]
type=Helper
trigger1=Time=0
stateno=303
id=30
pos=100,-60
ownpal=1
[State Shared helper]
type=Helper
trigger1=Time=0
stateno=304
id=31
pos=50,-100
ownpal=0
[State Independent effect]
type=Explod
trigger1=Time=0
anim=10
ownpal=1
postype=none
pos=-100,-60
removetime=12
[State Blue parent palette]
type=RemapPal
trigger1=Time=1
source=1,1
dest=1,3
[Statedef 303]
type=S
movetype=I
physics=N
ctrl=0
anim=10
[State Independent helper tint]
type=PalFX
trigger1=Time=1
time=4
add=0,0,128
[State Shared projectile]
type=Projectile
trigger1=Time=1
projanim=10
projid=40
offset=40,0
projremovetime=12
attr=S,NP
damage=0
ownpal=0
[State Independent projectile]
type=Projectile
trigger1=Time=1
projanim=10
projid=41
offset=80,0
projremovetime=12
attr=S,NP
damage=0
ownpal=1
[State Destroy creator]
type=DestroySelf
trigger1=Time=2
[Statedef 304]
type=S
movetype=I
physics=N
ctrl=0
anim=10
[State Must not tint a shared palette]
type=PalFX
trigger1=1
time=10
add=255,0,0
'''
victim='''[Statedef -2]
[State Own global code]
type=VarSet
trigger1=1
v=8
value=(StateNo=700)*100+AnimExist(700)*10+PalNo
[Statedef 0]
type=S
movetype=I
physics=N
ctrl=1
anim=0
[Statedef 701]
type=S
movetype=I
physics=N
ctrl=0
[State Retained AIR bank]
type=VarSet
trigger1=Time=0
v=4
value=AnimExist(700)*10+SelfAnimExist(700)
[State StateDef control]
type=VarSet
trigger1=Time=0
v=5
value=Ctrl
[State Local AIR]
type=ChangeAnim
trigger1=Time=2
value=0
[State Local bank observation]
type=VarSet
trigger1=Time=2
v=6
value=AnimExist(700)
'''
base_air='''[Begin Action 0]
Clsn2Default:1
Clsn2[0]=-10,-40,10,0
0,0,0,0,-1
[Begin Action 10]
0,0,0,0,-1
'''
foreign_air=base_air+'''[Begin Action 100]
Clsn1Default:1
Clsn1[0]=0,-40,160,0
Clsn2Default:1
Clsn2[0]=-10,-40,10,0
0,0,0,0,-1
[Begin Action 700]
Clsn2Default:1
Clsn2[0]=-10,-40,10,0
0,1,8,-4,-1
'''
with ZipFile('work/custom-palette-browser-fixture.zip','w',ZIP_DEFLATED) as z:
    for directory,name,width,cns,air,colors in [('a','Accuracy Attacker',320,attacker,foreign_air,[(255,0,0),(0,255,0),(0,0,255)]),('b','Accuracy Victim',640,victim,base_air,[(255,255,0),(0,255,255),(255,0,255)])]:
        files={'c.def':f'[Info]\nname={name}\nmugenversion=1.1\nlocalcoord={width},240\n[Files]\ncns=c.cns\nst=c.cns\ncmd=c.cmd\nanim=c.air\nsprite=c.sff','c.cns':cns,'c.cmd':commands if directory=='a' else '', 'c.air':air,'c.sff':sprites(colors)}
        for path,data in files.items():z.writestr(directory+'/'+path,data)

with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':1000},accept_downloads=True);errors=[];failures=[]
    page.on('pageerror',lambda e:errors.append(str(e)));page.on('requestfailed',lambda r:failures.append(r.url))
    page.goto(os.environ.get('MUGEN_TEST_URL','http://127.0.0.1:5186/next/')+'?perf=1&graphics=high',wait_until='networkidle');assert page.locator('.tag i').inner_text()=='22'
    page.wait_for_function('!document.querySelector("#file").disabled')
    page.locator('#file').set_input_files('work/custom-palette-browser-fixture.zip');page.wait_for_function("document.querySelector('#name').textContent==='Accuracy Attacker'")
    if page.locator('#arena-mode').count():page.locator('#arena-mode').select_option('training')
    page.locator('#training').click();page.locator('#play').click();page.locator('#opponent-select').select_option(label='Accuracy Victim');page.locator('#opponent-palette-select').select_option('2');page.locator('#reset').click()
    page.evaluate('window.__kenjatimePerformance.benchmark({frames:1,ticksPerFrame:0})')
    def steps(n):page.evaluate('(n)=>{for(let i=0;i<n;i++)document.querySelector("#step").click()}',n)
    def press(key):
        page.locator('canvas').click();page.keyboard.down(key);steps(1);page.keyboard.up(key)
    def report(name):
        with page.expect_download() as pending:page.locator('#export-report').click()
        path=Path('work/custom-palettes-'+name+'.json');pending.value.save_as(path);d=json.loads(path.read_text());assert not d['issues'],d['issues'];return d
    def pixels():
        page.evaluate('window.__kenjatimePerformance.benchmark({frames:1,ticksPerFrame:0})')
        return page.locator('canvas').evaluate('''c=>{const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data,counts={cyan:0,green:0,teal:0,purple:0};for(let i=0;i<d.length;i+=4){const r=d[i],g=d[i+1],b=d[i+2];if(r===0&&g===255&&b===255)counts.cyan++;if(r===0&&g===255&&b===0)counts.green++;if(r===0&&g===255&&b===128)counts.teal++;if(r===128&&g===0&&b===255)counts.purple++;}return counts;}''')
    press('z');steps(1);foreign=report('foreign');foreign_pixels=pixels();b=foreign['opponent'];assert b['stateNo']==700 and b['stateOwner']==1 and b['animationOwner']==1 and b['coordinateScale']==1 and b['variables']['int'][2]==10 and b['paletteNo']==2
    assert foreign_pixels['cyan']>0,foreign_pixels
    steps(3);restored=report('restored');b=restored['opponent'];assert b['stateNo']==701 and b['stateOwner']==2 and b['animationOwner']==1 and b['coordinateScale']==.5 and b['ctrl']==0 and b['variables']['int'][4]==10 and b['variables']['int'][5]==0
    steps(2);local=report('local');assert local['opponent']['animationOwner']==2 and local['opponent']['variables']['int'][6]==0 and pixels()['cyan']>0

    page.locator('#reset').click();press('x');creation=report('creation');creation_pixels=pixels();helper_id=next(h['id'] for h in creation['helperRelationships'] if h['ownpal'])
    assert creation_pixels['green']>0
    assert next(s for s in creation['paletteState'] if s['id']==helper_id)['localEffects']==[]
    steps(1);projectiles=report('projectiles');projectile_pixels=pixels();assert len(projectiles['projectiles'])==2
    shared=next(p for p in projectiles['projectiles'] if p['projId']==40);own=next(p for p in projectiles['projectiles'] if p['projId']==41)
    shared_palette=next(s for s in projectiles['paletteState'] if s['id']==shared['id']);own_palette=next(s for s in projectiles['paletteState'] if s['id']==own['id'])
    assert shared_palette['localEffects'][0]['add']==[0,0,128] and own_palette['localEffects']==[]
    assert shared_palette['remaps']==own_palette['remaps']==[['1,1',[1,2]]]
    assert projectile_pixels['green']>0 and projectile_pixels['teal']>0 and projectile_pixels['purple']>0,projectile_pixels
    steps(1);destroyed=report('creator-destroyed');assert all(e['id']!=helper_id for e in destroyed['entities']) and pixels()['teal']>0
    steps(3);expired=report('effect-expired');expired_pixels=pixels();assert expired_pixels['teal']==0 and expired_pixels['green']>0,expired_pixels
    assert next(s for s in expired['paletteState'] if s['id']==shared['id'])['localEffects']==[]
    page.set_viewport_size({'width':390,'height':844});assert page.evaluate('document.documentElement.scrollWidth')<=390;assert not errors and not failures,(errors,failures)
    result={'foreignState':{'stateOwner':foreign['opponent']['stateOwner'],'animationOwner':foreign['opponent']['animationOwner'],'coordinateScale':foreign['opponent']['coordinateScale'],'animExistMask':foreign['opponent']['variables']['int'][2],'victimPalette':foreign['opponent']['paletteNo'],'cyanPixels':foreign_pixels['cyan']},'selfState':{'stateOwner':restored['opponent']['stateOwner'],'animationOwner':restored['opponent']['animationOwner'],'coordinateScale':restored['opponent']['coordinateScale'],'ctrl':restored['opponent']['ctrl']},'creationPixels':creation_pixels,'projectilePixels':projectile_pixels,'expiredPixels':expired_pixels,'creatorPaletteRetained':True,'errors':errors,'failedRequests':failures}
    Path('work/custom-palette-browser-evidence.json').write_text(json.dumps(result,indent=2));print(json.dumps(result));browser.close()
