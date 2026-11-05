"""Measure supplied stage rendering/upload churn; software Chromium, not phone FPS."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import argparse, base64, hashlib, json, os

os.chdir(Path(__file__).resolve().parent.parent)
p=argparse.ArgumentParser();p.add_argument('--url',required=True);p.add_argument('--output',required=True);p.add_argument('--archive',default=os.environ.get('MUGEN_FOREST_RAR'));args=p.parse_args()
assert args.archive and Path(args.archive).exists(), 'Supply the stage archive through --archive or MUGEN_FOREST_RAR.'
output=Path(args.output);output.parent.mkdir(parents=True,exist_ok=True)
probe='''window.textureProbe={active:false,canvases:0,writes:0,bytes:0};const create=document.createElement.bind(document);document.createElement=function(tag,...args){if(window.textureProbe.active&&String(tag).toLowerCase()==='canvas')window.textureProbe.canvases++;return create(tag,...args)};const write=CanvasRenderingContext2D.prototype.putImageData;CanvasRenderingContext2D.prototype.putImageData=function(data,...args){if(window.textureProbe.active){window.textureProbe.writes++;window.textureProbe.bytes+=data.data.byteLength}return write.call(this,data,...args)};'''
with sync_playwright() as pw:
    browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,accept_downloads=True);context.add_init_script(probe)
    page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(args.url+'?perf=1&graphics=high',wait_until='networkidle');page.locator('#sample').click();page.wait_for_function("document.querySelector('#name').textContent==='Kung Fu Man'")
    page.locator('#training').click();page.locator('#sound').uncheck();page.wait_for_function('!document.querySelector("#stage-file").disabled');page.locator('#stage-file').set_input_files(args.archive)
    page.wait_for_function("document.querySelector('#stage-select option:checked').textContent==='Forest of King Cruel'")
    page.locator('canvas').scroll_into_view_if_needed();results={}
    for mode in ['high','low']:
        page.locator('#graphics-mode').select_option(mode);page.evaluate('window.__kenjatimePerformance.benchmark({frames:1,ticksPerFrame:0})');page.locator('#reset').click()
        page.evaluate('window.__kenjatimePerformance.benchmark({frames:40,ticksPerFrame:1})')
        page.evaluate('Object.assign(window.textureProbe,{active:true,canvases:0,writes:0,bytes:0})')
        result=page.evaluate('window.__kenjatimePerformance.benchmark({frames:60,ticksPerFrame:1})')
        result['textureUploads']=page.evaluate('window.textureProbe.active=false;({...window.textureProbe})');result['textureUploads'].pop('active')
        png=output.with_name(output.stem+'-'+mode+'.png');png.write_bytes(base64.b64decode(page.locator('canvas').evaluate('(c)=>c.toDataURL()').split(',')[1]))
        result['screenshot']=str(png)
        with page.expect_download() as pending:page.locator('#export-report').click()
        reportPath=output.with_name(output.stem+'-'+mode+'-report.json');pending.value.save_as(reportPath);report=json.loads(reportPath.read_text())
        state={k:report[k] for k in ['player','opponent','stage','issues']};result['behaviorSha256']=hashlib.sha256(json.dumps(state,sort_keys=True).encode()).hexdigest()
        results[mode]=result
    assert not errors,errors
    output.write_text(json.dumps({'environment':{'browser':browser.version,'kind':'software Chromium; no physical Brave/phone FPS claim'},'frames':60,'scenes':results,'errors':errors},indent=2)+'\n')
    print(json.dumps({k:{'p50Ms':v['renderP50Ms'],'p95Ms':v['renderP95Ms'],'textureUploads':v['textureUploads']} for k,v in results.items()}))
    browser.close()
