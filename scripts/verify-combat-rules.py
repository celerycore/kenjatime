"""Exercise combat rules through ZIP import, CMD inputs, common states and reports."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from playwright.sync_api import sync_playwright
import json
import os

os.chdir(Path(__file__).resolve().parent.parent)
Path('work').mkdir(exist_ok=True)
with ZipFile('public/kfm.zip') as source:
    sprite = source.read('kfm/kfm.sff')

script = '''[Data]
liedown.time=120
[Statedef 0]
type=S
movetype=I
physics=N
ctrl=1
anim=0
'''
moves = [
    (200, 'light', 'x', 'damage=90,10'),
    (201, 'trip', 'y', 'damage=20\nground.type=Trip\nground.velocity=-2,-4\nfall=1'),
    (202, 'down', 'z', 'damage=20\nhitflag=D\ndown.velocity=-2,0\ndown.hittime=12'),
    (203, 'ko', 'a', 'damage=2000\nground.velocity=-4,0'),
    (204, 'none', 'b', 'damage=999\nground.type=None\np2stateno=9999'),
    (205, 'launch', 'c', 'damage=20\nground.velocity=-2,-4\nfall=1\nfall.recover=0'),
]
cmd = '[Command]\nname="holdback"\ncommand=/$B\n[Command]\nname="holddown"\ncommand=/$D\n'
for state, name, key, params in moves:
    script += f'''[Statedef {state}]
type=S
movetype=A
physics=N
ctrl=0
anim=200
[State Contact]
type=HitDef
trigger1=time=0
attr=S,NA
guardflag=MA
pausetime=2,3
ground.hittime=60
guard.hittime=60
guard.slidetime=50
guard.ctrltime=40
ground.velocity=0,0
sparkno=-1
guard.sparkno=-1
{params}
[State Ready]
type=ChangeState
trigger1=time=1
value=0
ctrl=1
'''
    cmd += f'[Command]\nname="{name}"\ncommand={key}\ntime=1\n'
cmd += '[Command]\nname="lie"\ncommand=s\n[Statedef -1]\n'
for state, name, key, params in moves:
    cmd += f'''[State Attack]
type=ChangeState
triggerall=TeamSide=1
triggerall=ctrl
trigger1=command="{name}"
value={state}
'''
cmd += '''[State Force downed setup]
type=TargetState
triggerall=TeamSide=1
trigger1=command="lie"
value=5110
'''
air = ''
for action in [0, 200, 130, 131, 150, 151, 152, 5000, 5001, 5002, 5010,
               5011, 5012, 5020, 5021, 5022, 5030, 5035, 5040, 5050,
               5070, 5080, 5100, 5110, 5120, 5160]:
    air += f'[Begin Action {action}]\nClsn2Default:1\nClsn2[0]=-10,-50,10,0\n'
    if action == 200:
        air += 'Clsn1Default:1\nClsn1[0]=0,-60,240,0\n'
    air += '0,0,0,0,' + ('-1' if action in [0, 200, 5110] else '1') + '\n'
with ZipFile('work/combat-rules-fixture.zip', 'w', ZIP_DEFLATED) as target:
    files = {
        'test.def': '[Info]\nname=Combat Rules Fixture\n[Files]\ncns=test.cns\nst=test.cns\ncmd=test.cmd\nanim=test.air\nsprite=test.sff',
        'test.cns': script, 'test.cmd': cmd, 'test.air': air, 'test.sff': sprite,
        'data/mugen.cfg': '[Rules]\nDefault.Attack.LifeToPowerMul=1.25\nDefault.GetHit.LifeToPowerMul=.5\nSuper.TargetDefenceMul=2',
    }
    for name, data in files.items():
        target.writestr(name, data)

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium'),
                               headless=True, args=['--no-sandbox'])
    page = browser.new_page(viewport={'width': 1440, 'height': 1000}, accept_downloads=True)
    errors, failures = [], []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.on('requestfailed', lambda request: failures.append(request.url))
    page.goto(os.environ.get('MUGEN_TEST_URL', 'http://127.0.0.1:5186/kenjatime/'), wait_until='networkidle')
    assert page.locator('.tag i').inner_text() == '15'
    page.locator('#file').set_input_files('work/combat-rules-fixture.zip')
    page.wait_for_function("document.querySelector('#name').textContent==='Combat Rules Fixture'")
    page.locator('#training').click()
    page.locator('#play').click()
    page.locator('#reset').click()

    def steps(count):
        page.evaluate('(n)=>{for(let i=0;i<n;i++)document.querySelector("#step").click()}', count)

    def tap(key):
        page.locator('canvas').click()
        page.keyboard.down(key)
        steps(1)
        page.keyboard.up(key)
        steps(1)

    def report(name):
        with page.expect_download() as pending:
            page.locator('#export-report').click()
        path = Path('work/combat-browser-' + name + '.json')
        pending.value.save_as(path)
        result = json.loads(path.read_text())
        assert not result['issues'], result['issues']
        assert result['completeCompatibility'] is False
        return result

    # Ordinary contacts expose the raw-damage power defaults and separate clocks.
    tap('z')
    hit = report('hit')
    assert hit['opponent']['life'] == 910, hit['opponent']
    assert [hit['player']['power'], hit['opponent']['power']] == [112, 45]
    assert hit['player']['hitCount'] == hit['player']['uniqHitCount'] == hit['opponent']['comboHits'] == 1
    assert hit['combatRules'] == {'attackLifeToPower': 1.25, 'getHitLifeToPower': .5, 'superTargetDefence': 2}
    steps(5)
    shake = report('shake-over')
    assert shake['opponent']['stateNo'] == 5001 and shake['opponent']['ctrl'] == 0

    # A second attack still guards while control is zero; posture can change in stun.
    page.locator('#reset').click()
    page.locator('#dummy-mode').select_option('keyboard')
    page.locator('canvas').click()
    page.keyboard.down('Numpad6')
    tap('z')
    guard = report('guard')
    assert guard['opponent']['life'] == 990 and guard['opponent']['getHitVars']['guarded'] == 1
    assert [guard['player']['power'], guard['opponent']['power']] == [56, 22]
    steps(5)
    page.keyboard.down('Numpad2')
    steps(1)
    posture = report('guard-crouch')
    assert posture['opponent']['stateType'] == 'C' and posture['opponent']['ctrl'] == 0
    tap('z')
    guarded_again = report('guard-again')
    assert guarded_again['opponent']['life'] == 980
    assert guarded_again['opponent']['getHitVars']['guarded'] == 1
    assert guarded_again['player']['moveHit'] == 0 and guarded_again['player']['moveGuarded'] > 0
    page.keyboard.up('Numpad6')
    page.keyboard.up('Numpad2')
    page.locator('#dummy-mode').select_option('stand')

    # Trip uses its own reaction and lands without the normal fall bounce.
    page.locator('#reset').click()
    tap('x')
    trip = report('trip')
    assert trip['opponent']['stateNo'] == 5070
    steps(5)
    assert report('trip-flight')['opponent']['stateNo'] == 5071
    steps(50)
    trip_landed = report('trip-landed')
    assert trip_landed['opponent']['stateNo'] == 5110

    # A downed flat hit selects down.hittime rather than ground.hittime.
    page.locator('#reset').click()
    tap('z')
    steps(5)
    tap('Enter')
    assert report('down-setup')['opponent']['stateNo'] == 5110
    tap('c')
    down = report('down-hit')
    assert down['opponent']['stateNo'] == 5080 and down['opponent']['getHitVars']['hittime'] <= 12
    steps(20)
    assert report('down-landed')['opponent']['stateNo'] == 5110

    # Normal falling hits bounce, with the fall defence multiplier captured for diagnosis.
    page.locator('#reset').click()
    tap('d')
    steps(32)
    bounce = report('bounce')
    assert bounce['opponent']['getHitVars']['fallcount'] == 1, bounce['opponent']
    assert abs(bounce['opponent']['damageMultipliers']['fallDefence'] - 2/3) < 1e-6
    assert bounce['opponent']['stateNo'] == 5101, bounce['opponent']

    # A lethal grounded hit must launch before the lying-dead state.
    page.locator('#reset').click()
    tap('a')
    ko = report('ko')
    assert ko['opponent']['life'] == 0 and ko['opponent']['getHitVars']['fall.recover'] == 0
    assert ko['opponent']['getHitVars']['yvel'] == -6
    assert ko['opponent']['getHitVars']['xveladd'] == ko['opponent']['getHitVars']['yveladd'] == 0
    steps(5)
    ko_flight = report('ko-flight')
    assert ko_flight['opponent']['pos']['y'] < 0 and ko_flight['opponent']['stateNo'] != 5150

    page.locator('#reset').click()
    tap('s')
    none = report('none')
    assert none['opponent']['life'] == 1000 and none['opponent']['stateNo'] == 0
    assert none['opponent']['ctrl'] == 1 and none['opponent']['hitPauseTime'] == 0
    assert none['player']['power'] == none['opponent']['power'] == 0
    page.screenshot(path='work/browser-combat-rules.png', full_page=True)
    assert not errors, errors
    assert not failures, failures
    result = {'normalDamage': 90, 'powerAwards': [112, 45], 'guardPower': [56, 22],
              'guardComboLife': guarded_again['opponent']['life'], 'tripState': trip_landed['opponent']['stateNo'],
              'downState': down['opponent']['stateNo'], 'bounceState': bounce['opponent']['stateNo'],
              'koY': ko_flight['opponent']['pos']['y'], 'noneLife': none['opponent']['life'],
              'errors': errors, 'failedRequests': failures}
    Path('work/browser-combat-rules-result.json').write_text(json.dumps(result, indent=2))
    print(json.dumps(result))
    browser.close()
