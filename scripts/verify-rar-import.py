"""Check lazy RAR decoding, actual user RAR5 packs and mobile/Classic routes."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json, os, subprocess

os.chdir(Path(__file__).resolve().parent.parent)
Path('work').mkdir(exist_ok=True)
subprocess.run(['node','--input-type=module'],input=r'''
import {readFileSync,writeFileSync} from 'node:fs';
import {unzipSync,strToU8,strFromU8} from 'fflate';
import {rar4,rar5} from './test/fixtures/rar-fixtures.js';
const files=Object.entries(unzipSync(readFileSync('public/kfm.zip')));
function entries(prefix,label){return files.map(([name,data])=>[prefix+'/'+name,name.endsWith('.def')?strToU8(strFromU8(data).replaceAll('Kung Fu Man',label)):data]);}
writeFileSync('work/browser-rar4.rar',rar4(entries('r4','RAR4 Fixture')));
writeFileSync('work/browser-rar5.rar',rar5(entries('日本','RAR5 Fixture')));
writeFileSync('work/browser-large.rar',rar4([...entries('large','Large RAR Fixture'),['large/unrelated.bin',new Uint8Array(40*1024*1024)]]));
writeFileSync('work/browser-unsafe.rar',rar5([['../outside.def','unsafe']]));
writeFileSync('work/browser-password.rar',rar4([['secret.txt','data',{encrypted:true}]]));
''',text=True,check=True)

base=os.environ.get('MUGEN_TEST_BASE','http://127.0.0.1:5186/next/').rstrip('/')+'/'
real=[(os.environ.get('MUGEN_TOMOKA_RAR'),'Tomoka',1),(os.environ.get('MUGEN_TAIGA_RAR'),'Taiga Aisaka',3)]
results=[]
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
    for route in ['','arena/','arena-classic/']:
        context=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,accept_downloads=True)
        if route=='arena-classic/':context.add_init_script("Object.defineProperty(File.prototype,'arrayBuffer',{value:undefined})")
        page=context.new_page();errors=[];failures=[];requests=[]
        page.on('pageerror',lambda e:errors.append(str(e)));page.on('requestfailed',lambda r:failures.append(r.url));page.on('request',lambda r:requests.append(r.url))
        page.goto(base+route+'?perf=1&graphics=low&v=21',wait_until='networkidle');assert page.locator('.tag i').inner_text()=='21'
        if not route:page.locator('#sample').click()
        page.wait_for_function("document.querySelector('#name').textContent==='Kung Fu Man' && !document.querySelector('#file').disabled")
        assert not any('.wasm' in r or 'rar-reader-' in r for r in requests),requests
        assert '.rar' in page.locator('#file').get_attribute('accept')
        if route=='arena-classic/':assert 'Classic Arena' in page.title() and '/arena-classic/' in page.url
        page.evaluate('window.__kenjatimePerformance.benchmark({frames:1,ticksPerFrame:0})')
        def choose(path,name,mime=None):
            page.locator('#file').set_input_files(path if mime is None else {'name':name+'.RAR','mimeType':mime,'buffer':Path(path).read_bytes()})
            page.wait_for_function('(name)=>!document.querySelector("#file").disabled && (document.querySelector("#name").textContent===name || document.querySelector("#status").textContent.startsWith("Import failed:"))',arg=name,timeout=120000)
            assert page.locator('#name').inner_text()==name,page.locator('#status').inner_text()
            page.evaluate('window.__kenjatimePerformance.benchmark({frames:1,ticksPerFrame:0})')
        choose('work/browser-rar4.rar','RAR4 Fixture')
        choose('work/browser-rar5.rar','RAR5 Fixture','application/octet-stream')
        for path,expected in [('work/browser-unsafe.rar','Unsafe archive path'),('work/browser-password.rar','Password-protected')]:
            page.locator('#file').set_input_files(path);page.wait_for_function('(s)=>document.querySelector("#status").textContent.includes(s) && !document.querySelector("#file").disabled',arg=expected)
            assert page.locator('#name').inner_text()=='RAR5 Fixture'
        choose('work/browser-rar4.rar','RAR4 Fixture')
        actual=[]
        for path,name,count in real:
            if not path:continue
            before_count=page.locator('.card').count();choose(path,name);page.locator('#lab').click();page.wait_for_timeout(100)
            with page.expect_download() as pending:page.locator('#export-report').click()
            output=Path('work')/('rar-'+(route.replace('/','') or 'lab')+'-'+Path(path).stem+'.json');pending.value.save_as(output);data=json.loads(output.read_text())
            bad=[d for d in data['issues'] if any(s in d.get('message','') for s in ['Invalid SFF','Truncated SFF','Sprite bank:','Palette depth'])];assert not bad,bad
            matches=page.locator('.card').count()-before_count;assert matches==count,(name,matches,count)
            actual.append({'name':name,'variants':count,'imported':True,'diagnosticCount':len(data['issues'])})
        page.evaluate('window.__rarHeartbeat=0;window.__rarTimer=setInterval(()=>window.__rarHeartbeat++,10)')
        choose('work/browser-large.rar','Large RAR Fixture');heartbeat=page.evaluate('window.__rarHeartbeat');page.evaluate('clearInterval(window.__rarTimer)');assert heartbeat>=2,heartbeat
        assert page.evaluate('document.documentElement.scrollWidth')<=390
        assert not errors and not failures,(errors,failures)
        wasm=[r for r in requests if '.wasm' in r];assert wasm and all(r.startswith(base) for r in wasm),wasm
        results.append({'route':route or '/','fileReaderFallback':route=='arena-classic/','rar4':True,'rar5':True,'unsafeRejected':True,'encryptedRejected':True,'retryPassed':True,'largeRarMiB':round(Path('work/browser-large.rar').stat().st_size/1048576,2),'heartbeatTicks':heartbeat,'actualArchives':actual,'wasmSameOrigin':True,'wasmLazyForZip':True,'errors':errors,'failedRequests':failures})
        context.close()
    browser.close()
Path('work/rar-browser-evidence.json').write_text(json.dumps(results,indent=2));print(json.dumps(results))
