"""Compare independent Core with captured native behavior; never load a native VM.
The neutral setup and input recipes are authored QA data. Native captures are
read-only and never rewritten. This is a diagnostic gate, not certification.
"""
from pathlib import Path
from zipfile import ZipFile
import argparse,base64,gzip,json,subprocess,sys
ROOT=Path(__file__).resolve().parents[2];sys.path.insert(0,str(ROOT/'scripts'))
from character_verification import fixture_files,interaction_cases,inject_driver,kfm_cases,sections,digest

def main():
 p=argparse.ArgumentParser();p.add_argument('--group',choices=['interactions','kfm-classic'],default='interactions');p.add_argument('--allow-gaps',action='store_true');args=p.parse_args();out=ROOT/'work/core';out.mkdir(parents=True,exist_ok=True)
 if args.group=='interactions':files=fixture_files();character='chars/verification-actor/fighter.def';opponent='chars/verification-victim/fighter.def';cases=interaction_cases()
 else:
  import re
  with ZipFile(ROOT/'public/kfm.zip') as z:files={'chars/'+n:z.read(n) for n in z.namelist() if not n.endswith('/')}
  character='chars/kfm/kfm.def';opponent='chars/kfm/qa-victim.def';files[opponent]=files[character].replace(b'cns = kfm.cns',b'cns = qa-victim.cns');files['chars/kfm/qa-victim.cns']=re.sub(rb'(?im)^(\s*walk\.back\s*=)[^;\r\n]+',rb'\g<1>0',files['chars/kfm/kfm.cns']);cases,_=kfm_cases(files['chars/kfm/kfm.cmd'])
 for path in [character,opponent]:
  files,driver=inject_driver(files,path,cases)
 ref=ROOT/'test/fixtures/character-verification/native'/(args.group+'.json.gz');native=json.loads(gzip.decompress(ref.read_bytes()));assert[c['id'] for c in cases]==[c['id'] for c in native['cases']]
 plan={'group':args.group,'character':character,'opponent':opponent,'cases':cases,'driver':driver,'files':{k:base64.b64encode(v).decode() for k,v in files.items()},'native':native,'nativeCaptureSha256':digest(ref.read_bytes())}
 source=out/(args.group+'-input.json');source.write_text(json.dumps(plan));subprocess.run(['node','scripts/core/native-trace.mjs',str(source)],cwd=ROOT,check=True)
 report=json.loads((out/(args.group+'-native-comparison.json')).read_text());print(json.dumps({k:report[k] for k in ['group','matched','scenarios','comparedTicks','differentFields','firstDifferences','scope']},indent=2));return 0 if report['matched'] or args.allow_gaps else 2
if __name__=='__main__':raise SystemExit(main())
