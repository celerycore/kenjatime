"""Build the pinned IKEMEN GO 1.0 browser backend, with no screenpack or UI.
Core data is produced by prepare-native-android.py from the same native release.
"""
from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED,ZipInfo
import gzip,hashlib,json,os,shutil,subprocess,tarfile,urllib.request
ROOT=Path(__file__).resolve().parent.parent
CACHE=ROOT/'work/ikemen-web';OUT=ROOT/'public/engine';CACHE.mkdir(parents=True,exist_ok=True);OUT.mkdir(parents=True,exist_ok=True)
COMMIT='96324a1c8aaaa5c0cb7756aebeb4b572588523ee'
def fetch(name,url,digest):
 p=CACHE/name
 if not p.exists():
  with urllib.request.urlopen(url,timeout=120) as response,p.open('wb') as f:shutil.copyfileobj(response,f)
 assert hashlib.sha256(p.read_bytes()).hexdigest()==digest,name
 return p

def extract(archive,target):
 if target.exists():shutil.rmtree(target)
 with ZipFile(archive) as z:
  for e in z.infolist():
   parts=Path(e.filename).parts[1:]
   if not parts or e.is_dir():continue
   assert '..' not in parts
   p=target/Path(*parts);p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(z.read(e))
source=fetch('source.zip','https://codeload.github.com/energyjp/ikemen-go-web/zip/'+COMMIT,'38bc19e95c0e5df1c515d81fbfa2146a641e8452d294520cd3b58aa563080bea')
extract(source,CACHE/'source')
beep=fetch('beep-source.zip','https://codeload.github.com/gopxl/beep/zip/defe79638e9948d7b2872a58f96ec11dbae5d748','ebc463b777fb159ce579471bd07cd90bd94c293758a5f2975348e8f5c10ec615')
extract(beep,CACHE/'source/third_party/beep')
mod=CACHE/'source/go.mod';mod.write_text(mod.read_text().replace('replace github.com/gopxl/beep/v2 => github.com/gopxl/beep/v2 v2.1.1-0.20240921133731-defe79638e99','replace github.com/gopxl/beep/v2 => ./third_party/beep'))
shutil.copy2(ROOT/'engine/kenjatime_js.go',CACHE/'source/src/kenjatime_js.go')
p=CACHE/'source/src/system_js.go';p.write_text(p.read_text().replace('\tpollGamepads()','\tpollGamepads()\n\tkenjatimePollInputs()'))
p=CACHE/'source/src/util_js.go';p.write_text(p.read_text().replace('I.K.E.M.E.N Error','Kenjatime'))
go=os.environ.get('KENJATIME_GO')
if not go:
 tool=CACHE/'go-tools';tool.mkdir(exist_ok=True)
 archive=fetch('go-tools/go1.23.12.linux-amd64.tar.gz','https://go.dev/dl/go1.23.12.linux-amd64.tar.gz','d3847fef834e9db11bf64e3fb34db9c04db14e068eeb064f49af747010454f90')
 if not(tool/'go/bin/go').exists():
  with tarfile.open(archive) as t:t.extractall(tool,filter='data')
 go=str(tool/'go/bin/go')
version=subprocess.check_output([go,'version'],text=True).strip();assert 'go1.23.12 ' in version,version
env=os.environ.copy();env.update(GOCACHE=str(CACHE/'go-cache'),GOPATH=str(CACHE/'go-path'),GOEXPERIMENT='arenas',GOOS='js',GOARCH='wasm',CGO_ENABLED='0',GOWASM='satconv,signext')
args=[go,'build','-trimpath','-buildvcs=false','-ldflags=-X main.Version=1.0.0','-o',str(CACHE/'engine.wasm'),'./src']
subprocess.check_call(args,cwd=CACHE/'source',env=env)
wasm=(CACHE/'engine.wasm').read_bytes();(OUT/'ikemen.wasm.bin').write_bytes(gzip.compress(wasm,compresslevel=6,mtime=0))
goroot=Path(subprocess.check_output([go,'env','GOROOT'],text=True).strip());shutil.copy2(goroot/'misc/wasm/wasm_exec.js',OUT/'wasm_exec.js');shutil.copy2(CACHE/'source/LICENCE.txt',OUT/'LICENSE.txt');shutil.copy2(goroot/'LICENSE',OUT/'GO-LICENSE.txt')
assets=ROOT/'native-android/generated/assets';assert (assets/'data/kenjatime/engine.lua').is_file(),'Prepare the native engine assets first.'
with ZipFile(OUT/'core.zip','w',compression=ZIP_DEFLATED,compresslevel=6) as z:
 for p in sorted(assets.rglob('*')):
  if not p.is_file():continue
  name=p.relative_to(assets).as_posix()
  if name.startswith(('web/','upstream/')) or name=='native-provenance.json':continue
  entry=ZipInfo(name,date_time=(1980,1,1,0,0,0));entry.compress_type=ZIP_DEFLATED;entry.external_attr=0o100644<<16;z.writestr(entry,p.read_bytes())
# Include notices for the linked pure-Go packages and the source fork.
notices=['IKEMEN GO browser backend sources: https://github.com/energyjp/ikemen-go-web/tree/'+COMMIT+'\n']
for folder in [CACHE/'source/third_party',CACHE/'go-path/pkg/mod']:
 for file in sorted(folder.rglob('*')):
  if file.is_file() and file.name.lower() in {'license','license.txt','licence','licence.txt','copying','notice'} and '/cache/' not in file.as_posix():
   try:content=file.read_text()
   except (UnicodeError,OSError):continue
   notices.append(str(file.relative_to(folder))+'\n'+content)
(OUT/'THIRD-PARTY-LICENSES.txt').write_text('\n\n'.join(notices))
record={'goEnvironment':{'GOEXPERIMENT':'arenas','GOWASM':'satconv,signext','GOOS':'js','GOARCH':'wasm','CGO_ENABLED':'0'},'hostBridgeSha256':hashlib.sha256((ROOT/'engine/kenjatime_js.go').read_bytes()).hexdigest(),'engine':'IKEMEN GO','version':'1.0.0','portRepository':'https://github.com/energyjp/ikemen-go-web','portCommit':COMMIT,'sourceArchiveSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'go':version,'flags':args[1:-3],'patches':['Kenjatime match status, pause and touch input bridge','Release touch inputs after at least one simulation poll','Kenjatime error title'],'stockMenuAssets':False,'stockMenuScripts':False,'wasmBytes':len(wasm),'wasmSha256':hashlib.sha256(wasm).hexdigest(),'files':{p.name:{'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in OUT.iterdir() if p.is_file() and p.name!='provenance.json'}}
(OUT/'provenance.json').write_text(json.dumps(record,indent=2)+'\n');print(json.dumps({'wasmBytes':len(wasm),'compressedBytes':(OUT/'ikemen.wasm.bin').stat().st_size,'sha256':record['wasmSha256']}))
