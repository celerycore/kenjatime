"""Independent native IKEMEN versus the shipped Go/WASM VM, never TrainingMatch.

Run under an X server (e.g. xvfb-run -a), or pass --display :93 on this host.
Fixtures/QA Lua are mounted only by this script; production assets are untouched.
"""
from pathlib import Path
from zipfile import ZipFile
import argparse, gzip, http.server, io, json, os, re, shutil, subprocess, sys, threading, time, urllib.parse, urllib.request
from character_verification import ROOT, FIXTURES, RELEASE_SHA, RELEASE_URL, digest, tree_digest, inventory, sections, kfm_cases, inject_driver, fixture_files, interaction_cases, normalize_trace, compare_reports, PALETTE_COLORS

OUT=ROOT/'work/character-verification'
READ_TRACE="""()=>new Promise((resolve,reject)=>{const f=globalThis.fs;f.open('/save/verification.json',0,0,(e,fd)=>{if(e)return reject(String(e));f.fstat(fd,(e,st)=>{if(e)return reject(String(e));const b=new Uint8Array(st.size);f.read(fd,b,0,b.length,0,e=>{f.close(fd,()=>{});e?reject(String(e)):resolve(new TextDecoder().decode(b));});});});})"""

def release():
    p=ROOT/'work/ikemen-native/Ikemen_GO-v1.0.0-linux.zip'
    if not p.is_file():
        p.parent.mkdir(parents=True,exist_ok=True)
        with urllib.request.urlopen(RELEASE_URL,timeout=90) as response,p.open('wb') as f:shutil.copyfileobj(response,f)
    if digest(p.read_bytes())!=RELEASE_SHA:raise ValueError('Native release checksum mismatch')
    return p

def unpack(z,prefix=''):
    return {n:z.read(n) for n in z.namelist() if not n.endswith('/') and n.startswith(prefix)}

def prepare(group,profile,archive,case_filter=None):
    with ZipFile(ROOT/'public/engine/core.zip') as z:files=unpack(z)
    inv=None;capture=False;palettes=[1,2]
    if group.startswith('palette-') or group=='interactions':
        files.update(fixture_files());character='chars/verification-actor/fighter.def';opponent='chars/verification-victim/fighter.def';capture=True
        if group=='interactions':cases=interaction_cases()
        else:
            palettes=[int(n) for n in group.split('-')[1:]]
            cases=[{'id':group,'expected':[0],'input':[],'distance':120,'captureAt':8,'snapshotOnly':True,'tags':['palette-selection']}]
    elif group=='kfm-classic':
        with ZipFile(ROOT/'public/kfm.zip') as z:files.update({'chars/'+n:b for n,b in unpack(z).items()})
        character='chars/kfm/kfm.def';opponent=character;cases,inv=kfm_cases(files['chars/kfm/kfm.cmd'],profile)
    elif group=='kfm-720':
        with ZipFile(archive) as z:files.update(unpack(z,'chars/kfm720/'))
        character='chars/kfm720/kfm720.def';opponent=character;cases,inv=kfm_cases(files['chars/kfm720/kfm720.cmd'],profile)
    else:raise ValueError('Unknown verification group: '+group)
    if case_filter:cases=[c for c in cases if case_filter in c['id']]
    if not cases:raise ValueError('No scenarios selected')
    original_sha=tree_digest(files)
    if opponent==character:
        # Only the opponent's back-walk constant is changed: a stationary guard
        # dummy can hold Back before contact without walking out of range.
        definition=files[character];parent=character.rsplit('/',1)[0]
        info=next(s for s in sections(definition) if s['name'].lower()=='files')
        cns=dict(info['params'])['cns'].strip('"');constants=files[parent+'/'+cns]
        stationary=re.sub(rb'(?im)^(\s*walk\.back\s*=)[^;\r\n]+',rb'\g<1>0',constants)
        files[parent+'/qa-victim.cns']=stationary
        opponent=parent+'/qa-victim.def';files[opponent]=re.sub(rb'(?im)^(\s*cns\s*=)[^;\r\n]+',rb'\g<1>qa-victim.cns',definition)
    files,driver=inject_driver(files,character,cases)
    if opponent!=character:files,other_driver=inject_driver(files,opponent,cases);assert other_driver['originVar']==driver['originVar'] and other_driver['caseVar']==driver['caseVar']
    plan={'cases':cases,'capture':capture,**driver}
    files['qa/plan.json']=json.dumps(plan,sort_keys=True).encode()
    files['qa/driver.lua']=(FIXTURES/'driver.lua').read_bytes()
    bootstrap=(ROOT/'engine/kenjatime.lua').read_bytes()
    assert bootstrap.count(b'function loop() end')==1
    files['data/kenjatime/engine.lua']=bootstrap.replace(b'function loop() end',b"dofile('qa/driver.lua')")
    config=files['data/kenjatime/config.ini'].decode().replace('854','320').replace('480','240').replace('VSync = 1','VSync = 0')
    files['data/kenjatime/config.ini']=config.encode()
    # Fixed, explicit 320x240 reference stage; no camera debt between scenarios.
    stage=files['stages/kenjatime-grid.def'].decode()
    stage=re.sub(r'(?m)^boundleft=.*$','boundleft=0',stage);stage=re.sub(r'(?m)^boundright=.*$','boundright=0',stage)
    stage=re.sub(r'(?m)^screenleft=.*$','screenleft=0',stage);stage=re.sub(r'(?m)^screenright=.*$','screenright=0',stage)
    stage=stage.replace('localcoord=854,480','localcoord=320,240').replace('zoffset=392','zoffset=200')
    files['stages/kenjatime-grid.def']=stage.encode()
    args=['-p1',character,'-p2',opponent,'-p1.ai','0','-p2.ai','0','-p1.color',str(palettes[0]),'-p2.color',str(palettes[1]),'-time','-1','-rounds','99']
    return files,args,plan,{'character':group,'originalResourcesSha256':original_sha,'resourcesSha256':tree_digest(files),'planSha256':digest(files['qa/plan.json']),'inventory':inv,'palettes':palettes}

class Host(http.server.SimpleHTTPRequestHandler):
    files={}
    def __init__(self,*args,**kw):super().__init__(*args,directory=str(ROOT/'dist'),**kw)
    def log_message(self,*args):pass
    def do_GET(self):
        path=urllib.parse.unquote(urllib.parse.urlsplit(self.path).path)
        if path.startswith('/__verification_ref__/') and path.rsplit('/',1)[-1] in ('submit.js','render-target.js'):
            body=(ROOT/'engine/webgl'/path.rsplit('/',1)[-1]).read_bytes()
            self.send_response(200);self.send_header('Content-Type','application/javascript');self.send_header('Content-Length',str(len(body)));self.end_headers();self.wfile.write(body);return
        if path=='/__verification__/manifest.json':body=json.dumps(list(self.files)).encode()
        elif path.startswith('/__verification__/'):
            body=self.files.get(path.removeprefix('/__verification__/'))
            if body is None:self.send_error(404);return
        else:return super().do_GET()
        self.send_response(200);self.send_header('Content-Length',str(len(body)));self.end_headers();self.wfile.write(body)

def browser_capture(playwright,files,args,directory,timeout,capture,gpu_reference=False):
    handler=type('FixtureHost',(Host,),{'files':files});server=http.server.ThreadingHTTPServer(('127.0.0.1',0),handler)
    threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
    browser=playwright.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or playwright.chromium.executable_path,headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
    try:
        page=browser.new_page(viewport={'width':320,'height':240});workers=[];done=[];logs=[];errors=[]
        def output(msg):
            logs.append(msg.text)
            if msg.text=='KJ_VERIFY_DONE':done.append(True)
        page.on('console',output);page.on('worker',lambda w:workers.append(w));page.on('pageerror',lambda error:errors.append(str(error)))
        if gpu_reference:
            def wasm_request(route):
                worker=next(w for w in workers if 'engine-worker' in w.url)
                url=base+'__verification_ref__/submit.js'
                worker.evaluate("async url=>{const m=await import(url);globalThis.__kenjatimeCreateGPU=m.createWebGLSubmitter||m.createThreeSubmitter;}",url)
                route.fulfill(status=200,body=(ROOT/'public/engine/ikemen.wasm.bin').read_bytes())
            page.route('**/ikemen.wasm.bin*',wasm_request)
        page.add_init_script("window.addEventListener('message',e=>{if(e.data?.kenjatimeEngine&&e.data.type==='error')window.__verificationError=e.data.message;});")
        page.goto(base+'engine/index.html');page.wait_for_function('!!window.__kenjatimeFrame')
        page.evaluate('''async args=>{const paths=await(await fetch('/__verification__/manifest.json')).json();const files=Object.fromEntries(await Promise.all(paths.map(async p=>[p,new Uint8Array(await(await fetch('/__verification__/'+p)).arrayBuffer())])));window.postMessage({type:'kenjatime-start',files,args,quality:'high'},location.origin);}''',args)
        end=time.monotonic()+timeout
        while not done and time.monotonic()<end:
            page.wait_for_timeout(250)
            failure=page.evaluate('window.__verificationError')
            if failure:errors.append(failure)
            if errors:break
        (directory/'web.log').write_text('\n'.join(logs+errors)+'\n')
        if not done:raise RuntimeError('Browser trace did not complete: '+repr((logs+errors)[-8:]))
        worker=next((w for w in workers if 'engine-worker' in w.url),None)
        if worker is None:raise RuntimeError('Expected the production worker/Three.js path')
        body=worker.evaluate(READ_TRACE);(directory/'web.raw.json').write_text(body)
        if capture:
            page.wait_for_timeout(120);page.locator('canvas').screenshot(path=str(directory/'web.png'))
        if errors:raise RuntimeError(repr(errors))
        return normalize_trace(json.loads(body))
    finally:browser.close();server.shutdown();server.server_close()

def native_start(files,args,directory,binary,capture,display):
    native=directory/'native';native.mkdir(parents=True,exist_ok=True)
    for name,data in files.items():
        path=native/name;path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(data)
    (native/'save').mkdir(exist_ok=True);(native/'save/config.ini').write_bytes(files['data/kenjatime/config.ini'])
    (native/'save/verification.json').unlink(missing_ok=True);(native/'qa/capture.request').unlink(missing_ok=True);(directory/'native.ppm').unlink(missing_ok=True)
    env=os.environ.copy();env.update(SDL_VIDEODRIVER='x11',SDL_AUDIODRIVER='dummy',LIBGL_ALWAYS_SOFTWARE='1',MESA_SHADER_CACHE_DIR=str(OUT/'mesa-cache'))
    if display:env['DISPLAY']=display
    if capture:
        source=ROOT/'scripts/character-capture.c';helper=OUT/('capture-'+digest(source.read_bytes())[:16]+'.so')
        if not helper.is_file():
            temp=helper.with_suffix('.'+str(os.getpid())+'.tmp.so')
            subprocess.run(['cc','-shared','-fPIC','-O2','-o',str(temp),str(source),'-ldl'],check=True);temp.replace(helper)
        env.update(LD_PRELOAD=str(helper),KENJATIME_QA_CAPTURE_REQUEST=str(native/'qa/capture.request'),KENJATIME_QA_CAPTURE_OUTPUT=str(directory/'native.ppm'))
    log=(directory/'native.log').open('w')
    process=subprocess.Popen([str(binary),'-config','save/config.ini',*args],cwd=native,env=env,stdout=log,stderr=subprocess.STDOUT)
    return process,log,native

def coverage(report,plan):
    failures=[];summary=[]
    if len(report['cases'])!=len(plan['cases']):return {'passed':False,'failures':['Missing scenarios'],'cases':[]}
    for observed,case in zip(report['cases'],plan['cases']):
        states=[s['player']['state'] for s in observed['samples']];sequence=[]
        for state in states:
            if not sequence or state!=sequence[-1]:sequence.append(state)
        expected=iter(case.get('expected',[]));wanted=next(expected,None)
        for state in sequence:
            if state==wanted:wanted=next(expected,None)
        problems=[]
        if observed['id']!=case['id']:problems.append('scenario order')
        if wanted is not None:problems.append('expected move states '+repr(case.get('expected'))+'; observed '+repr(sequence))
        if any(s in states for s in case.get('forbidden',[])):problems.append('power-gated move entered without power')
        if observed.get('timedOut'):problems.append('move/entities did not finish within budget')
        samples=observed['samples'];tags=case.get('tags',[])
        # Fixture damage proves that the named contacts happened, rather than
        # merely observing an attack state on two otherwise idle runtimes.
        fixture_damage={'direct-hit':60,'direct-guard':6,'throw-forward':60,'throw-mirrored':60,'helper-attack':25,'helper-guard-distance':2,'projectile-hit-removal':60,'projectile-guard-removal':6,'simultaneous-projectiles':40,'helper-orphan-projectile':20,'air-recovery':40}
        if case['id'] in fixture_damage and 1000-samples[-1]['opponent']['life']!=fixture_damage[case['id']]:problems.append('expected fixture contact damage was not exercised')
        if case['id']=='direct-guard' and not any(s['opponent']['state'] in (150,151,152) for s in samples):problems.append('direct guarded contact was not exercised')
        if samples[0]['player']['facing']!=case.get('facing',1):problems.append('requested facing was not exercised')
        if 'custom-state' in tags:
            if not any(s['opponent']['stateOwner']==1 for s in samples):problems.append('foreign victim state was not exercised')
            if samples[-1]['opponent']['stateOwner']!=2:problems.append('victim did not restore own state owner')
            if not any(s['opponent']['animationOwner']==1 and s['opponent']['variables'][3]==10 for s in samples) and case.get('entryState')==210:problems.append('foreign animation and own-resource lookup were not exercised')
            if samples[-1]['opponent']['animationOwner']!=2:problems.append('victim did not restore own animation')
        if 'helper' in tags and not any(s['player']['helperCount'] for s in samples):problems.append('helper was not created')
        if 'projectile' in tags and not any(s['player']['projectileCount'] for s in samples):problems.append('projectile was not created')
        if 'projectile' in tags and not case.get('snapshotOnly') and samples[-1]['player']['projectileCount']!=0:problems.append('projectile removal was not exercised')
        if 'guard' in tags and not any(s['opponent']['state'] in (150,151,152) for s in samples):problems.append('guarded contact was not exercised')
        if 'orphan' in tags and not any(s['player']['helperCount']==0 and s['player']['projectileCount']>0 for s in samples):problems.append('projectile did not outlive its creator')
        if 'clash' in tags and not any(s['player']['projectileCancelled']>=0 for s in samples):problems.append('projectile cancellation was not exercised')
        if 'pause' in tags and not any(s['pause']>0 for s in samples):problems.append('pause allowance was not exercised')
        if 'body-push' in tags and (abs(samples[-1]['opponent']['x']-samples[0]['opponent']['x'])<1 or samples[-1]['opponent']['life']!=1000):problems.append('inert helper body push was not exercised')
        if 'air-recovery' in tags and not any(s['opponent']['state'] in (5200,5210) for s in samples):problems.append('air recovery was not exercised')
        if problems:failures.append({'id':case['id'],'problems':problems})
        summary.append({'id':case['id'],'frames':len(samples),'states':sequence,'damage':1000-samples[-1]['opponent']['life'],'maxHelpers':max(s['player']['helperCount'] for s in samples),'maxProjectiles':max(s['player']['projectileCount'] for s in samples),'passed':not problems})
    return {'passed':not failures,'failures':failures,'cases':summary}

def pixel_comparison(native_path,web_path,report,group):
    from PIL import Image
    native=Image.open(native_path).convert('RGB');web=Image.open(web_path).convert('RGB')
    row=report['cases'][-1]['samples'][-1];points=[]
    for label,actor in [('player',row['player']),('opponent',row['opponent']),*[(f'helper-{h["helperId"]}',h) for h in row['player']['helpers']]]:
        w,h,x,y=actor['sprite'];points.append((label,actor['screenX']+actor['facing']*(w/2-x),actor['screenY']+h/2-y))
    for shot in row['player']['projectiles']:
        points.append((f'projectile-{shot["id"]}',row['player']['screenX']+shot['x']-row['player']['x'],row['player']['screenY']+shot['y']-row['player']['y']))
    samples=[]
    for label,x,y in points:
        a=native.getpixel((round(x*native.width/320),round(y*native.height/240)));b=web.getpixel((round(x*web.width/320),round(y*web.height/240)))
        visible=sum(a)>90 and len(set(a))>1
        samples.append({'entity':label,'native':a,'web':b,'matched':visible and max(abs(c-d) for c,d in zip(a,b))<=1})
    if group.startswith('palette-'):
        selected=[int(n) for n in group.split('-')[1:]]
        for sample,n in zip(samples,selected):sample['selectedPaletteCorrect']=tuple(sample['native'])==PALETTE_COLORS[n-1];sample['matched']&=sample['selectedPaletteCorrect']
    return {'matched':all(s['matched'] for s in samples),'nativeSize':native.size,'webSize':web.size,'samples':samples}

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--profile',choices=['smoke','full'],default='full');parser.add_argument('--group',action='append');parser.add_argument('--case');parser.add_argument('--display',default=os.environ.get('DISPLAY'))
    parser.add_argument('--timeout',type=int,default=900);parser.add_argument('--write-baselines',action='store_true');parser.add_argument('--baseline-dir',type=Path,default=FIXTURES/'native');parser.add_argument('--browser-only',action='store_true')
    parser.add_argument('--gpu-reference',action='store_true',help='Diagnostic raw WebGL path, not a production conformance result')
    options=parser.parse_args();OUT.mkdir(parents=True,exist_ok=True)
    if options.write_baselines and (options.browser_only or options.gpu_reference):raise ValueError('Only a fresh production comparison can publish native baselines')
    from playwright.sync_api import sync_playwright
    from PIL import Image
    if not (ROOT/'dist/engine/index.html').is_file():raise ValueError('Build the app first: npm run build')
    archive=release();binary=OUT/'release/Ikemen_GO_Linux'
    with ZipFile(archive) as z:
        for name in z.namelist():
            if name=='Ikemen_GO_Linux' or name.startswith('lib/') and not name.endswith('/'):
                p=OUT/'release'/name;p.parent.mkdir(parents=True,exist_ok=True);data=z.read(name)
                if not p.is_file() or p.read_bytes()!=data:
                    temp=p.with_suffix(p.suffix+'.tmp');temp.write_bytes(data);temp.replace(p)
    binary.chmod(0o755)
    groups=options.group or (['kfm-classic','kfm-720','interactions']+(['palette-1-2','palette-3-4','palette-5-6','palette-7-8','palette-9-10','palette-11-12'] if options.profile=='full' else ['palette-1-2']))
    evidence={'format':'kenjatime-character-verification-v1','profile':options.profile,'completeCompatibility':False,'nativeMugen':'Not captured; this comparison uses independent native IKEMEN 1.0.0','physicalAndroid':False,'groups':[]}
    evidence['status']='running'
    (OUT/'evidence.json').write_text(json.dumps(evidence,indent=2)+'\n')
    build_sha=tree_digest({p.relative_to(ROOT/'dist').as_posix():p.read_bytes() for p in (ROOT/'dist/assets').glob('*.js')})
    with sync_playwright() as playwright:
        for group in groups:
            files,args,plan,meta=prepare(group,options.profile,archive,options.case)
            suffix='-raw' if options.gpu_reference else ''
            directory=OUT/(group+suffix);directory.mkdir(exist_ok=True)
            print('START',group,len(plan['cases']),'scenarios',flush=True)
            process=None;log=None
            try:
                if options.browser_only:
                    baseline=options.baseline_dir/(group+'.json.gz')
                    native=json.loads(gzip.decompress(baseline.read_bytes()))
                else:process,log,native_dir=native_start(files,args,directory,binary,plan['capture'],options.display)
                web=browser_capture(playwright,files,args,directory,options.timeout,plan['capture'],options.gpu_reference)
                if process:
                    process.wait(timeout=options.timeout);log.close();log=None
                    if process.returncode:raise RuntimeError('Native process failed; see '+str(directory/'native.log'))
                    raw=(native_dir/'save/verification.json').read_bytes();(directory/'native.raw.json').write_bytes(raw)
                    native=normalize_trace(json.loads(raw));native.update(meta);native['provenance']={'kind':'native-ikemen','version':'1.0.0','releaseSha256':RELEASE_SHA,'executableSha256':digest(binary.read_bytes()),'captureMethod':'Unmodified official Linux executable; shared QA Common.Lua capture and AssertInput driver','rawCaptureSha256':digest(raw)}
                web.update(meta);web['provenance']={'kind':'web-go-wasm','version':'1.0.0','renderer':'diagnostic-raw-webgl' if options.gpu_reference else 'production-three','browserBuildSha256':build_sha,'wasmSha256':digest(gzip.decompress((ROOT/'public/engine/ikemen.wasm.bin').read_bytes())),'captureMethod':'Shipped Go/WASM worker; identical QA files and plan'}
                reference_coverage=coverage(native,plan);web_coverage=coverage(web,plan);comparison=compare_reports(native,web)
                item={**meta,'scenarios':len(plan['cases']),'reference':native['provenance'],'candidate':web['provenance'],'nativeCoverage':reference_coverage,'webCoverage':web_coverage,'comparison':comparison}
                if plan['capture']:
                    native_image=(options.baseline_dir/(group+'.png')) if options.browser_only else directory/'native.ppm'
                    item['pixels']=pixel_comparison(native_image,directory/'web.png',native,group)
                item['passed']=reference_coverage['passed'] and web_coverage['passed'] and comparison['matched'] and item.get('pixels',{'matched':True})['matched']
                (directory/'native.json.gz').write_bytes(gzip.compress(json.dumps(native,separators=(',',':')).encode(),mtime=0));(directory/'web.json.gz').write_bytes(gzip.compress(json.dumps(web,separators=(',',':')).encode(),mtime=0))
                (directory/'evidence.json').write_text(json.dumps(item,indent=2)+'\n')
                evidence['groups'].append(item);(OUT/'evidence.json').write_text(json.dumps(evidence,indent=2)+'\n')
                if options.write_baselines:
                    if options.browser_only:raise ValueError('A browser run cannot write native baselines')
                    if options.gpu_reference:raise ValueError('Diagnostic renderer runs cannot publish conformance baselines')
                    if not reference_coverage['passed']:raise ValueError('Native coverage failed; refusing to bless an unexercised reference: '+repr(reference_coverage['failures']))
                    options.baseline_dir.mkdir(parents=True,exist_ok=True);path=options.baseline_dir/(group+'.json.gz')
                    if path.exists():raise ValueError('Refusing to overwrite baseline: '+str(path))
                    path.write_bytes(gzip.compress(json.dumps(native,separators=(',',':')).encode(),mtime=0))
                    if plan['capture']:Image.open(directory/'native.ppm').save(options.baseline_dir/(group+'.png'))
                print('PASS' if item['passed'] else 'FAIL',group,'frames',comparison['comparedFrames'],'differences',comparison['differenceCount'],'native failures',reference_coverage['failures'],'web failures',web_coverage['failures'],flush=True)
                if not item['passed']:
                    evidence['status']='failed';(OUT/'evidence.json').write_text(json.dumps(evidence,indent=2)+'\n')
            except Exception as error:
                failure={'character':group,'passed':False,'error':type(error).__name__+': '+str(error)}
                (directory/'evidence.json').write_text(json.dumps(failure,indent=2)+'\n')
                evidence['groups'].append(failure);evidence['status']='failed'
                (OUT/'evidence.json').write_text(json.dumps(evidence,indent=2)+'\n');raise
            finally:
                if process and process.poll() is None:process.kill();process.wait()
                if log:log.close()
    passed=all(item['passed'] for item in evidence['groups'])
    evidence['status']='passed' if passed else 'failed'
    (OUT/'evidence.json').write_text(json.dumps(evidence,indent=2)+'\n')
    return 0 if passed else 1

if __name__=='__main__':
    try:sys.exit(main())
    except Exception as error:print(type(error).__name__+': '+str(error),file=sys.stderr);sys.exit(2)
