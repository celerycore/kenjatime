"""Import the supplied stage on all pages; verify music and equivalent hires pixels."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from playwright.sync_api import sync_playwright, expect
import base64, io, json, os, struct
from PIL import Image, ImageChops

os.chdir(Path(__file__).resolve().parent.parent)
Path('work').mkdir(exist_ok=True)
archive=os.environ.get('MUGEN_FOREST_RAR')
assert archive and Path(archive).exists(), 'Set MUGEN_FOREST_RAR to the supplied stage archive.'
base=os.environ.get('MUGEN_TEST_BASE','http://127.0.0.1:5186/next/').rstrip('/')+'/'

def checker_sprite(scale):
    size=8*scale;paloff=96;dataoff=128
    b=bytearray(dataoff+size*size+12);b[:12]=b'ElecbyteSpr\0';b[15]=2
    def u(p,n):struct.pack_into('<I',b,p,n)
    def h(p,n):struct.pack_into('<H',b,p,n)
    u(36,68);u(40,1);u(44,paloff);u(48,1);u(52,dataoff)
    h(72,size);h(74,size);b[83]=8;u(84,0);u(88,size*size)
    h(paloff,1);h(paloff+2,1);h(paloff+4,3);u(paloff+8,size*size);u(paloff+12,12)
    b[dataoff:dataoff+size*size]=bytes(1+((x//scale+y//scale)%2) for y in range(size) for x in range(size))
    b[-12:]=bytes([0,0,0,0,20,80,140,255,180,70,30,255])
    return b

for scale in [1,2]:
    text=f'''[Info]
name=Hires equivalence
[StageInfo]
hires={int(scale==2)}
zoffset=200
[Camera]
boundleft=-140
boundright=80
[BGDef]
spr=stage.sff
[BG 0]
type=normal
spriteno=0,0
start={-40*scale},{120*scale}
delta={scale},{scale}
tile=1,1
'''
    with ZipFile(f'work/stage-hires-{scale}.zip','w',ZIP_DEFLATED) as z:
        z.writestr('stage.def',text);z.writestr('stage.sff',checker_sprite(scale))

audio_probe='''window.stageAudio=[];const make=AudioContext.prototype.createBufferSource;
AudioContext.prototype.createBufferSource=function(){const source=make.call(this),start=source.start;source.start=function(...args){if(source.buffer?.duration>10)window.stageAudio.push({duration:source.buffer.duration,loop:source.loop,sampleRate:source.buffer.sampleRate});return start.apply(this,args)};return source};'''
results=[]
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
    for route in ['', 'arena/', 'arena-classic/']:
        context=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,accept_downloads=True)
        context.add_init_script(audio_probe)
        if route=='arena-classic/':context.add_init_script('File.prototype.arrayBuffer=undefined')
        page=context.new_page();errors=[];failures=[]
        page.on('pageerror',lambda e:errors.append(str(e)));page.on('requestfailed',lambda req:failures.append(req.url))
        page.goto(base+route+'?perf=1&graphics=high&v=21',wait_until='networkidle')
        page.wait_for_function('!document.querySelector("#file").disabled')
        assert page.locator('.tag i').inner_text()=='21'
        # The explicit stage chooser rejects a character without changing the roster.
        count=page.locator('#count').inner_text()
        with page.expect_file_chooser() as pending:page.locator('#add-stage').tap()
        pending.value.set_files('public/kfm.zip')
        expect(page.locator('#status')).to_contain_text('No stage DEF found')
        assert page.locator('#count').inner_text()==count
        with page.expect_file_chooser() as pending:page.locator('#add-stage').tap()
        pending.value.set_files(archive)
        expect(page.locator('#status')).to_contain_text('1 stage',timeout=60000)
        expect(page.locator('#stage-select option:checked')).to_have_text('Forest of King Cruel')
        expect(page.locator('#stage-summary')).to_have_text('66 backgrounds · Music ready')
        assert page.locator('#count').inner_text()==count
        if not route:
            assert count=='00'
            page.locator('#sample').tap();page.wait_for_function("document.querySelector('#name').textContent==='Kung Fu Man'")
        else:page.locator('#arena-mode').select_option('training')
        page.locator('#training').tap();page.locator('canvas').tap()
        page.wait_for_function('window.stageAudio.length>0',timeout=20000)
        page.evaluate('window.__kenjatimePerformance.benchmark({frames:1,ticksPerFrame:0})');page.locator('#reset').click()
        def steps(n):page.evaluate('(n)=>{for(let i=0;i<n;i++)document.querySelector("#step").click()}',n)
        def report(name):
            with page.expect_download() as pending:page.locator('#export-report').click()
            path=Path('work')/f'stage-{route.replace("/", "") or "lab"}-{name}.json';pending.value.save_as(path);return json.loads(path.read_text())
        before=report('initial');assert before['stage']['name']=='Forest of King Cruel'
        steps(6);after=report('animated');assert after['stage']['backgroundTime']>=6
        page.locator('#performance-overlay').evaluate('(e)=>e.style.visibility="hidden"')
        page.locator('canvas').screenshot(path=f'work/forest-{route.replace("/", "") or "lab"}.png')
        page.locator('canvas').click();page.keyboard.down('ArrowRight');steps(200);page.keyboard.up('ArrowRight')
        moved=report('camera');assert 0<moved['stage']['camera']['x']<=140,moved['stage']
        baseline={d['message'] for d in before['issues']}
        extra=[d for d in moved['issues'] if d['message'] not in baseline]
        assert not extra,extra
        assert page.evaluate('document.documentElement.scrollWidth')<=390
        audio=page.evaluate('window.stageAudio');assert audio[0]['loop'] and audio[0]['duration']>10
        results.append({'route':route or '/','stageOnlyImport':True,'wrongArchiveRejected':True,'fileReaderFallback':route=='arena-classic/','music':audio[0],'cameraX':moved['stage']['camera']['x'],'backgroundTicks':after['stage']['backgroundTime'],'additionalDiagnostics':extra,'baselineCharacterWarnings':len(baseline),'errors':errors,'failedRequests':failures})
        assert not errors and not failures,(errors,failures)
        # Same scene authored in low resolution and legacy hires must match,
        # including scrolling camera/delta and tiled sprite alignment.
        if not route:
            images=[];cameras=[]
            for scale in [1,2]:
                page.locator('#stage-file').set_input_files(f'work/stage-hires-{scale}.zip')
                expect(page.locator('#stage-select option:checked')).to_have_text('Hires equivalence')
                page.evaluate('window.__kenjatimePerformance.benchmark({frames:1,ticksPerFrame:0})');page.locator('#reset').click()
                captures=[]
                for move in [False,True]:
                    if move:
                        page.locator('canvas').click();page.keyboard.down('ArrowRight');steps(150);page.keyboard.up('ArrowRight')
                    page.evaluate('window.__kenjatimePerformance.benchmark({frames:1,ticksPerFrame:0})')
                    data=base64.b64decode(page.locator('canvas').evaluate('(c)=>c.toDataURL()').split(',')[1])
                    Path(f'work/stage-hires-{scale}-{int(move)}.png').write_bytes(data)
                    captures.append(Image.open(io.BytesIO(data)).convert('RGBA'))
                images.append(captures);cameras.append(report(f'hires-{scale}')['stage']['camera']['x'])
            assert cameras[0]==cameras[1] and cameras[0]>0,cameras
            differences=[ImageChops.difference(a,b).convert('RGB').getbbox() for a,b in zip(images[0],images[1])]
            assert not any(differences), f'Legacy hires pixel differences: {differences}'
            results[-1]['hiresPixelEquivalent']=True;results[-1]['equivalenceCameraX']=cameras[0]
        context.close()
    browser.close()
Path('work/stage-browser-evidence.json').write_text(json.dumps(results,indent=2));print(json.dumps(results))
