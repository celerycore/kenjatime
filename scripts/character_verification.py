"""QA fixtures and strict native/Go-WASM combat comparison; no production hooks."""
from pathlib import Path
import hashlib, json, math, re, struct

ROOT = Path(__file__).resolve().parent.parent
FIXTURES = ROOT / 'test/fixtures/character-verification'
RELEASE_SHA = 'cc533c1a2ab84d63cbf9126d9dcb3f2dcc1a41c6206f2da419b0c91084f193e4'
RELEASE_URL = 'https://github.com/ikemen-engine/Ikemen-GO/releases/download/v1.0.0/Ikemen_GO-v1.0.0-linux.zip'

def digest(data):
    return hashlib.sha256(data).hexdigest()

def tree_digest(files):
    return digest(json.dumps({p: digest(b) for p,b in sorted(files.items())},sort_keys=True,separators=(',',':')).encode())

def sections(data):
    """Preserve repeated keys/sections; semicolons inside quoted names are data."""
    result=[]
    for line_no,line in enumerate(data.decode('latin1').splitlines(),1):
        line=re.split(r';(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)',line)[0].strip()
        match=re.fullmatch(r'\[([^]]+)\]',line)
        if match:result.append({'name':match[1].strip(),'line':line_no,'params':[]})
        elif result and '=' in line:
            k,v=line.split('=',1);result[-1]['params'].append((k.strip().lower(),v.strip()))
    return result

def inventory(data):
    commands={};entries=[]
    for section in sections(data):
        p=dict(section['params'])
        if section['name'].lower()=='command' and 'name' in p and 'command' in p:
            commands.setdefault(p['name'].strip('"'),[]).append(p['command'])
        elif section['name'].lower().startswith('state -1') and p.get('type','').lower()=='changestate':
            target=p.get('value','')
            entries.append({'label':section['name'],'line':section['line'],'target':int(target) if re.fullmatch(r'\d+',target) else None,'expression':target,
                'commands':list(dict.fromkeys(re.findall(r'(?i)\bcommand\s*=\s*"([^\"]+)"',' '.join(v for k,v in section['params'] if k.startswith('trigger')))))})
    return {'commands':commands,'entries':entries}

def motion(command, posture='stand'):
    if re.search(r'~\d+',command):raise ValueError('Charged motions require an explicit timed recipe: '+command)
    steps=[];held=[];overlapping=bool(re.fullmatch(r'[xyzabc],\s*\$[FB]',command))
    # MUGEN accepts the overlapping button/direction blocking alternative.
    # A two-frame button-first delay already enters the ordinary punch instead.
    if overlapping:command=command[0]+'+'+command[-1]
    def add(keys,ticks=3):steps.append({'keys':list(dict.fromkeys(keys)),'ticks':ticks})
    for token in command.split(','):
        token=token.strip();held_token=token.startswith('/')
        token=re.sub(r'^[~/$>]*\d*','',token)
        keys=token.split('+')
        if any(not re.fullmatch(r'(?:[DBFU]{1,2}|[abcxyzs])',k) for k in keys):raise ValueError('Unsupported motion token: '+token)
        if keys==held and steps:add([],2)
        if all(k.isupper() for k in keys):held=keys;add(keys)
        else:add(held+keys,2)
        if held_token:held=keys
    if posture=='crouch':
        steps=[{'keys':['D'],'ticks':20 if overlapping else 4}]+[{'keys':list(dict.fromkeys(['D']+s['keys'])),'ticks':s['ticks']} for s in steps]
    return steps

def kfm_cases(cmd, profile='full'):
    inv=inventory(cmd);cases=[]
    for entry in inv['entries']:
        n=entry['target']
        primary=[s for s in entry['commands'] if not s.startswith('hold')]
        if n is None or len(primary)!=1:raise ValueError('KFM entry requires an explicit curated case: '+entry['label'])
        name=primary[0];posture='air' if n in (600,610,630,640,1340) else 'crouch' if n in (400,410,430,440,1320) else 'stand'
        for variant,command in enumerate(inv['commands'][name]):
            for facing in ([1,-1] if profile=='full' else [1]):
                for spacing in (['near','far','guard'] if profile=='full' and n not in (800,100,105,195,1300,1320,1340) else ['near']):
                    if spacing!='near' and (facing!=1 or variant!=0):continue
                    cases.append({'id':f'kfm-{n}-{variant}-{facing}-{spacing}','entry':entry['line'],'entryState':n,'expected':[810 if n==800 else n],'input':motion('F,y' if n==800 else command,posture),
                        'posture':posture,'facing':facing,'distance':32 if spacing!='far' else 210,'guard':spacing=='guard','minFrames':40,'maxFrames':480,'power':1500})
    # Throw direction and combo transitions are distinct authored paths.
    for facing in ([1,-1] if profile=='full' else [1]):
        cases.append({'id':f'kfm-back-throw-{facing}','entryState':800,'expected':[810],'input':[{'keys':[],'ticks':20}]+motion('B+y'),'opponentInput':[{'keys':['D'],'ticks':40}],'posture':'stand','facing':facing,'distance':32,'minFrames':80,'maxFrames':480,'tags':['throw','custom-state']})
    cases.append({'id':'kfm-chain','expected':[200,230,210],'input':[{'keys':[],'ticks':4},{'keys':['x'],'ticks':2},{'keys':[],'ticks':14},{'keys':['a'],'ticks':2},{'keys':[],'ticks':18},{'keys':['y'],'ticks':2}],
        'distance':32,'minFrames':60,'maxFrames':480,'tags':['combo']})
    for n,name in [(1020,'QCF_xy'),(1070,'FF_ab'),(3000,'TripleKFPalm'),(3050,'SmashKFUpper')]:
        cases.append({'id':f'kfm-insufficient-power-{n}','expected':[],'forbidden':[n],'input':motion(inv['commands'][name][0]),'power':0,'distance':64,'minFrames':45,'maxFrames':180,'tags':['power-requirement']})
    return cases,inv

def inject_driver(files,def_path,cases):
    files=dict(files);definition=files[def_path];directory=def_path.rsplit('/',1)[0]
    refs=[]
    for s in sections(definition):
        if s['name'].lower()=='files':refs=[directory+'/'+v.strip('"').replace('\\','/') for k,v in s['params'] if re.fullmatch(r'st\d*|cmd|cns',k)]
    used=set()
    for path in refs:
        if path in files:
            used.update(int(n) for n in re.findall(rb'(?i)\bvar\(\s*(\d+)\s*\)',files[path]))
            if re.search(rb'(?im)^\s*\[statedef\s+-2\s*\]',files[path]):raise ValueError('QA must preserve an existing -2; this corpus needs a separate driver adapter: '+path)
    available=[n for n in range(59,-1,-1) if n not in used]
    if len(available)<2:raise ValueError('No unused QA variables')
    origin,case_var=available[:2]
    width=320
    for s in sections(definition):
        if s['name'].lower()=='info':
            p=dict(s['params']);width=int(p.get('localcoord','320,240').split(',')[0])
    scale=width/320
    blocks=['[Statedef -2]'];setup_blocks=[];input_groups={}
    for i,case in enumerate(cases,1):
        for side,key in [(1,'input'),(2,'opponentInput')]:
            sequence=case.get(key,[])
            if side==2 and case.get('guard'):sequence=[{'keys':['B','D'] if case.get('posture')=='crouch' else ['B'],'ticks':case['maxFrames']}]
            at=0;spans={}
            for step in sequence:
                for flag in step['keys']:
                    # Diagonal tokens expand into their physical/directional flags.
                    for f in list(flag) if flag.isupper() else [flag]:spans.setdefault(f,[]).append((at,at+step['ticks']-1))
                at+=step['ticks']
            for flag,ranges in spans.items():
                input_groups.setdefault((side,flag,(i-1)//8),[]).extend((i,a,b) for a,b in ranges)
        # QA setup is the only forced state. All tested move entries use the authored CMD.
        n=9000000+i;case['setupState']=n
        typ='A' if case.get('posture')=='air' else 'S';seed=50 if typ=='A' else 11 if case.get('posture')=='crouch' else 0
        distance=case.get('distance',64)*scale/2;facing=case.get('facing',1)
        states=f'[Statedef {n}]\ntype={typ}\nmovetype=I\nphysics=N\nanim=0\nctrl=0\n'
        def controller(kind,params,trigger='1'):return f'[State QA, Setup]\ntype={kind}\ntrigger1={trigger}\n{params}\n'
        states+=controller('VarSet',f'v={origin}\nvalue=GameTime+8','Time=0')+controller('VarSet',f'v={case_var}\nvalue={i}','Time=0')
        states+=controller('ScreenBound','value=0\nmovecamera=1,0')+controller('PlayerPush','value=0')+controller('AssertSpecial','flag=NoAutoTurn')
        if case.get('resetPalette'):states+=controller('RemapPal','source=1,1\ndest=1,PalNo')
        states+=controller('PalFX','time=1\nadd=0,0,0\nmul=256,256,256\ncolor=1\ninvertall=0')
        states+=controller('TargetDrop','excludeid=-1')+controller('PosSet',f'x=ifelse(TeamSide=1,{-distance*facing},{distance*facing})\ny=ifelse(TeamSide=1,{-45*scale if typ=="A" else 0},0)')
        states+=controller('VelSet',f'x=0\ny=ifelse(TeamSide=1,{-scale if typ=="A" else 0},0)')
        states+=f'[State QA, Facing]\ntype=Turn\ntrigger1=Facing != ifelse(TeamSide=1,{facing},{-facing})\n'
        states+=controller('ChangeState',f'value=ifelse(TeamSide=1,{seed},0)\nctrl=1','Time=8')
        setup_blocks.append(states)
    for (side,flag,bucket),spans in input_groups.items():
        conditions='\n'.join(f'trigger{j}=var({case_var})={i} && GameTime-var({origin})=[{a},{b}]' for j,(i,a,b) in enumerate(spans,1))
        blocks.append(f'[State QA, Input]\ntype=AssertInput\ntriggerall=!IsHelper && TeamSide={side} && var({case_var})=[{bucket*8+1},{bucket*8+8}]\n{conditions}\nflag={flag}\nignorehitpause=1')
    path=directory+'/qa-driver.cns';files[path]='\n'.join(blocks+setup_blocks).encode()
    text=definition.decode('latin1');match=re.search(r'(?im)^\[Files\]\s*$',text)
    if not match:raise ValueError('No Files section')
    files[def_path]=(text[:match.end()]+'\nst99=qa-driver.cns\n'+text[match.end():]).encode('latin1')
    return files,{'originVar':origin,'caseVar':case_var,'localcoord':width,'setupStatesOnly':True,'inputMethod':'QA-only AssertInput; authored CMD/state code retained'}

PALETTE_COLORS=[(210,34,51),(36,190,81),(42,71,213),(192,132,37),(146,43,177),(33,175,181),(207,76,132),(112,153,42),(76,43,198),(196,92,35),(38,116,164),(144,70,92)]

def fixture_sff():
    shapes=[(16,32,8,32),(8,8,4,4),(12,16,6,16)]
    paloff=68+len(shapes)*28;dataoff=paloff+12*16
    pixels=b''.join(bytes([1])*(w*h) for w,h,x,y in shapes);b=bytearray(dataoff+len(pixels)+12*8)
    b[:12]=b'ElecbyteSpr\0';b[15]=2
    def u(at,n):struct.pack_into('<I',b,at,n)
    def h(at,n):struct.pack_into('<H',b,at,n)
    u(36,68);u(40,len(shapes));u(44,paloff);u(48,12);u(52,dataoff);offset=0
    for i,(w,ht,x,y) in enumerate(shapes):
        p=68+i*28;h(p+2,i);h(p+4,w);h(p+6,ht);h(p+8,x);h(p+10,y);b[p+15]=8;u(p+16,offset);u(p+20,w*ht);offset+=w*ht
    b[dataoff:dataoff+len(pixels)]=pixels
    for i,rgb in enumerate(PALETTE_COLORS):
        p=paloff+i*16;h(p,1);h(p+2,i+1);h(p+4,2);u(p+8,len(pixels)+i*8);u(p+12,8);b[dataoff+len(pixels)+i*8:dataoff+len(pixels)+(i+1)*8]=bytes([0,0,0,0,*rgb,255])
    return bytes(b)

def fixture_files():
    files={}
    for name in ['actor','victim']:
        directory='chars/verification-'+name
        files[directory+'/fighter.def']=(f'[Info]\nname="Verification {name}"\nmugenversion=1.1\nlocalcoord=320,240\n[Files]\ncmd=fighter.cmd\ncns=fighter.cns\nst=fighter.cns\nstcommon=common1.cns\nsprite=fighter.sff\nanim=fighter.air\n[Palette Keymap]\nx=1\ny=2\nz=3\na=4\nb=5\nc=6\nx2=7\ny2=8\nz2=9\na2=10\nb2=11\nc2=12\n').encode()
        files[directory+'/fighter.sff']=fixture_sff()
        files[directory+'/fighter.cmd']=(FIXTURES/'fighter.cmd').read_bytes()
        files[directory+'/fighter.cns']=(FIXTURES/'fighter.cns').read_bytes().replace(b'walk.back=-2',b'walk.back=0') if name=='victim' else (FIXTURES/'fighter.cns').read_bytes()
        air=[]
        for n in [0,5,6,10,11,12,20,21,40,41,42,43,44,45,46,47,50,51,52,100,105,120,130,131,132,140,150,151,152,5000,5001,5002,5005,5010,5011,5012,5020,5030,5040,5050,5060,5070,5080,5090,5100,5110,5120,5200,5210]:
            air.append(f'[Begin Action {n}]\nClsn2Default: 1\nClsn2[0]=-8,-32,8,0\n0,0,0,0,-1\n')
        for n,sprite in [(200,0),(700,0),(1000,2),(1100,1)]:
            if name=='victim' and n==700:continue
            air.append(f'[Begin Action {n}]\nClsn2Default: 1\nClsn2[0]=-8,-32,8,0\nClsn1Default: 1\nClsn1[0]=0,-28,28,0\n0,{sprite},0,0,-1\n')
        air.append('[Begin Action 1101]\n0,1,0,0,3\n')
        air.append('[Begin Action 1102]\n0,1,0,0,-1\n')
        files[directory+'/fighter.air']='\n'.join(air).encode()
    return files

def interaction_cases():
    def case(label,target,command,**kw):
        return {'id':label,'expected':[target],'input':motion(command),'distance':120,'minFrames':75,'maxFrames':240,'resetPalette':True,**kw}
    result=[case('direct-hit',200,'x',distance=32),case('direct-guard',200,'x',distance=32,guard=True),
        case('throw-forward',211,'y',distance=16,entryState=210,tags=['throw','custom-state']),case('throw-mirrored',211,'y',distance=16,facing=-1,entryState=210,tags=['throw','custom-state']),
        case('helper-attack',220,'a',tags=['helper']),case('helper-body-push',222,'a+c',distance=64,tags=['helper','body-push']),case('helper-guard-distance',220,'a',guard=True,tags=['helper','guard']),
        case('projectile-hit-removal',230,'b',tags=['projectile']),case('projectile-guard-removal',230,'b',guard=True,tags=['projectile','guard']),
        case('simultaneous-projectiles',250,'z',distance=32,tags=['projectile','simultaneous-contact']),
        case('projectile-clash',270,'b+c',opponentInput=motion('b'),tags=['projectile','clash']),
        case('pause-allowances',260,'s',tags=['pause','helper','projectile']),
        case('helper-orphan-projectile',280,'a+b',tags=['helper','projectile','orphan']),
        case('air-recovery',290,'D,x',distance=32,opponentInput=[{'keys':[],'ticks':26},{'keys':['x','y'],'ticks':2},{'keys':[],'ticks':16},{'keys':['x','y'],'ticks':2}],tags=['air-recovery']),
        case('palette-fx-lifecycle',240,'x+y',tags=['palette','helper','projectile']),
        case('palette-ownership-pixels',240,'x+y',captureAt=5,snapshotOnly=True,tags=['palette','visual'])]
    return result

def normalize_trace(report):
    def normalize(value):
        if isinstance(value,dict):return {k:[] if k in ('helpers','projectiles','samples') and v=={} else normalize(v) for k,v in value.items()}
        if isinstance(value,list):return [normalize(v) for v in value]
        return value
    return normalize(report)

def compare_reports(native,web,tolerance=0.00001):
    if not math.isfinite(tolerance) or not 0<=tolerance<=0.001:raise ValueError('Invalid comparison tolerance')
    if native.get('provenance',{}).get('kind')!='native-ikemen':raise ValueError('Reference must be an independently captured native IKEMEN trace')
    if native['provenance'].get('releaseSha256')!=RELEASE_SHA:raise ValueError('Unpinned native reference')
    if web.get('provenance',{}).get('kind')!='web-go-wasm':raise ValueError('Candidate must come from the Go/WASM VM')
    for key in ['resourcesSha256','planSha256','character']:
        if not native.get(key) or native[key]!=web.get(key):raise ValueError('Mismatched '+key)
    def validate(report):
        if not isinstance(report.get('cases'),list) or not report['cases']:raise ValueError('No captured scenarios')
        seen=set()
        for case in report['cases']:
            if case['id'] in seen:raise ValueError('Duplicate scenario')
            seen.add(case['id']);samples=case['samples']
            if not samples or any(type(s.get('tick')) is not int or s['tick']!=n+1 for n,s in enumerate(samples)):raise ValueError('Trace must contain every consecutive tick')
            if any(not all(k in s for k in ['player','opponent']) for s in samples):raise ValueError('Missing fighter samples')
    validate(native);validate(web)
    differences=[];total=0
    def difference(a,b,path):
        nonlocal total
        total+=1
        if len(differences)<200:differences.append({'path':path,'native':a,'web':b})
    def compare(a,b,path):
        if isinstance(a,dict) and isinstance(b,dict):
            for k in sorted(set(a)|set(b)):
                if k not in a or k not in b:difference(a[k] if k in a else {'missing':True},b[k] if k in b else {'missing':True},path+'.'+str(k))
                else:compare(a[k],b[k],path+'.'+str(k))
            return
        if isinstance(a,list) and isinstance(b,list):
            if len(a)!=len(b):difference(len(a),len(b),path+'.length')
            for i,(x,y) in enumerate(zip(a,b)):compare(x,y,path+f'[{i}]')
            return
        elif isinstance(a,bool) or isinstance(b,bool):different=type(a)!=type(b) or a!=b
        elif isinstance(a,(float,int)) and isinstance(b,(float,int)):
            if not math.isfinite(a) or not math.isfinite(b):raise ValueError('Nonfinite trace value')
            continuous=bool(re.search(r'\.(?:x|y|vx|vy|screenX|screenY)$|\.camera\[\d+\]$',path))
            different=abs(a-b)>(tolerance if continuous else 0)
        else:different=a!=b
        if different:difference(a,b,path)
    compare(native['cases'],web['cases'],'cases')
    return {'matched':total==0,'differenceCount':total,'differences':differences,'tolerance':tolerance,'comparedScenarios':len(native['cases']),'comparedFrames':sum(len(c['samples']) for c in native['cases'])}
