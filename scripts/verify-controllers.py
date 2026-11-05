"""Exercise Gamepad API input, player roles, remaps and disconnects with simulated DualSense devices."""
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
import json, os

os.chdir(Path(__file__).resolve().parent.parent)
Path('work').mkdir(exist_ok=True)
base=os.environ.get('MUGEN_TEST_BASE','http://127.0.0.1:5186/next/').rstrip('/')+'/'
probe='''window.controllerPads=[];window.rumbleCalls=[];
Object.defineProperty(navigator,'getGamepads',{value:()=>window.controllerPads});
window.connectController=(index)=>{window.controllerPads[index]={index,id:'DualSense Wireless Controller (Vendor: 054c Product: 0ce6)',connected:true,mapping:'standard',axes:[0,0,0,0],buttons:Array.from({length:18},()=>({pressed:false,value:0})),vibrationActuator:{playEffect:(kind,effect)=>{window.rumbleCalls.push({index,kind,...effect});return Promise.resolve('complete')},reset:()=>Promise.resolve()}};window.dispatchEvent(new Event('gamepadconnected'))};
window.controllerState=(index,buttons=[],axes=[0,0])=>{const p=window.controllerPads[index];p.axes=axes;p.buttons.forEach((b,i)=>{b.pressed=buttons.includes(i);b.value=b.pressed?1:0})};
window.disconnectController=(index)=>{window.controllerPads[index]=null;window.dispatchEvent(new Event('gamepaddisconnected'))};'''
results=[]
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
    for route in ['', 'arena/', 'arena-classic/']:
        context=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,accept_downloads=True)
        context.add_init_script(probe);page=context.new_page();errors=[];failures=[]
        page.on('pageerror',lambda e:errors.append(str(e)));page.on('requestfailed',lambda req:failures.append(req.url))
        page.goto(base+route+'?perf=1&graphics=low&v=21',wait_until='networkidle')
        if not route:page.locator('#sample').click()
        page.wait_for_function("document.querySelector('#name').textContent==='Kung Fu Man'")
        if route:page.locator('#arena-mode').select_option('training')
        page.locator('#training').click();page.locator('canvas').click()
        page.evaluate('window.__kenjatimePerformance.benchmark({frames:1,ticksPerFrame:0})');page.locator('#reset').click()
        page.evaluate('window.connectController(2);window.connectController(5)')
        expect(page.locator('#controller-status')).to_have_text('P1: PS5 DualSense · P2: PS5 DualSense')
        def poll():page.evaluate('()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))')
        def state(index,buttons=None,axes=None):
            page.evaluate('([i,b,a])=>window.controllerState(i,b,a)',[index,buttons or [],axes or [0,0]]);poll()
        def steps(n):page.evaluate('(n)=>{for(let i=0;i<n;i++)document.querySelector("#step").click()}',n)
        def report(name):
            with page.expect_download() as pending:page.locator('#export-report').click()
            path=Path('work')/f'controller-{route.replace("/", "") or "lab"}-{name}.json';pending.value.save_as(path);return json.loads(path.read_text())
        # Sparse browser slot 2 is P1; Square is MUGEN x. A brief press is
        # retained even when released before the next 60 Hz simulation tick.
        state(2,axes=[1,0]);steps(50);state(2);steps(1)
        state(2,[2]);state(2);steps(25)
        hit=report('punch');assert hit['opponent']['life']==977,hit['opponent']['life']
        page.locator('.controller-setup summary').click()
        page.locator('#controller-player').select_option('0')
        page.locator('.controller-bindings select[data-button="2"]').select_option('z')
        page.locator('canvas').click();state(2,[2]);steps(1)
        remapped=report('remap');assert 'z' in remapped['player']['rawInput'] and 'x' not in remapped['player']['rawInput']
        state(2);page.locator('#controller-reset').click();page.locator('canvas').click()
        page.locator('#dummy-mode').select_option('keyboard');page.locator('#reset').click();page.locator('canvas').click()
        state(5,axes=[-1,0]);steps(50);state(5);steps(1);state(5,[2]);state(5);steps(25)
        second=report('p2');assert second['player']['life']==977,second['player']['life']
        # Vibration follows the chosen player, not GamepadList slot 0/1.
        page.locator('#controller-player').select_option('1');page.locator('#controller-rumble').click()
        expect(page.locator('#controller-feedback')).to_have_text('Vibration test sent.')
        assert page.evaluate('window.rumbleCalls.at(-1).index')==5
        # Reassignment is exclusive and profile settings survive a page reload.
        page.locator('#controller-p1').select_option('5');page.locator('canvas').click();state(5,[3]);steps(1)
        assigned=report('assigned');assert 'y' in assigned['player']['rawInput'] and not assigned['opponent']['rawInput']
        state(5);page.locator('#controller-p1').select_option('auto');page.locator('#controller-p2').select_option('2')
        page.locator('#controller-p1').select_option('2');page.locator('#controller-p2').select_option('5');page.locator('canvas').click()
        state(2,axes=[1,0]);steps(1);page.evaluate('window.disconnectController(2)');poll();steps(1)
        disconnected=report('disconnected');assert not disconnected['player']['rawInput']
        expect(page.locator('#controller-status')).to_have_text('P1: No controller · P2: PS5 DualSense')
        # Background windows cannot keep receiving gamepad moves.
        page.evaluate('window.connectController(2)');page.locator('canvas').click();state(2,axes=[1,0]);steps(1)
        page.evaluate('window.dispatchEvent(new Event("blur"))');poll();steps(1)
        blurred=report('blurred');assert not blurred['player']['rawInput']
        page.evaluate('window.dispatchEvent(new Event("focus"))');state(2)
        page.locator('#controller-player').select_option('0');page.locator('.controller-bindings select[data-button="2"]').select_option('b')
        page.locator('#controller-deadzone').evaluate('(e)=>{e.value=.4;e.dispatchEvent(new Event("input",{bubbles:true}))}')
        assert page.evaluate('document.documentElement.scrollWidth')<=390
        page.screenshot(path=f'work/controller-{route.replace("/", "") or "lab"}.png',full_page=True)
        page.reload(wait_until='networkidle');page.locator('.controller-setup summary').click()
        assert page.locator('.controller-bindings select[data-button="2"]').input_value()=='b'
        assert page.locator('#controller-deadzone').input_value()=='0.4'
        assert not errors and not failures,(errors,failures)
        results.append({'route':route or '/','hardware':'simulated Gamepad API DualSense devices, slots 2 and 5','p1PunchDamage':23,'p2PunchDamage':23,'shortPressRetainedAt30Fps':True,'remapping':True,'exclusiveAssignment':True,'disconnectReleased':True,'blurSuspended':True,'vibrationTarget':5,'settingsPersisted':True,'errors':errors,'failedRequests':failures})
        context.close()
    browser.close()
Path('work/controller-browser-evidence.json').write_text(json.dumps(results,indent=2));print(json.dumps(results))
