"""Package exact redistributable 7-Zip sources separately from app assets."""
from pathlib import Path
from zipfile import ZipFile,ZipInfo,ZIP_DEFLATED
import argparse,hashlib,json,urllib.request
ROOT=Path(__file__).resolve().parent.parent
SOURCES=[{'file':'7zip-24.09.zip','url':'https://codeload.github.com/ip7z/7zip/zip/refs/tags/24.09','bytes':2753009,'sha256':'9b10be21cbb7b29d89feeb4ccab23cd629eb12d49174ef530de47bd8b381799c'},{'file':'7z-wasm-source.zip','url':'https://codeload.github.com/use-strict/7z-wasm/zip/521d2cf93f5964f4e77b01049e19f1b29305c454','bytes':775882,'sha256':'161da114b21ee794520690248a16bcfed309446b8552e43194dfd726bdea6527'}]
BUILD='''Matching sources for the LGPL 7-Zip WebAssembly decoder used in Kenjatime.

The upstream 7-Zip 24.09 tree, the exact 7z-wasm 1.2.0 wrapper/build scripts, and their patch files are included as nested ZIPs. Unpack both archives. Follow the wrapper README/build scripts; use the included 7-Zip source tree for the 24.09 source input instead of downloading it again. The wrapper build uses Docker and Emscripten. No character archives or user files are included. Source URLs and checksums are recorded in manifest.json.
'''
def main():
 parser=argparse.ArgumentParser();parser.add_argument('--output',type=Path,default=ROOT/'work/kenjatime-archive-codec-source.zip');args=parser.parse_args();cache=ROOT/'work/support-sources';cache.mkdir(parents=True,exist_ok=True);files={}
 for item in SOURCES:
  path=cache/item['file']
  if not path.exists():
   with urllib.request.urlopen(item['url'],timeout=120) as r:path.write_bytes(r.read())
  data=path.read_bytes();assert len(data)==item['bytes'] and hashlib.sha256(data).hexdigest()==item['sha256'],item['file'];files[item['file']]=data
 files['manifest.json']=(json.dumps({'codec':'7z-wasm 1.2.0 / 7-Zip 24.09','sources':SOURCES},indent=2)+'\n').encode();files['BUILD.txt']=BUILD.encode();args.output.parent.mkdir(parents=True,exist_ok=True)
 with ZipFile(args.output,'w',compression=ZIP_DEFLATED,compresslevel=9) as z:
  for name,data in files.items():
   info=ZipInfo(name,(1980,1,1,0,0,0));info.compress_type=ZIP_DEFLATED;info.external_attr=0o100644<<16;z.writestr(info,data,compresslevel=9)
 digest=hashlib.sha256(args.output.read_bytes()).hexdigest();args.output.with_suffix('.zip.sha256').write_text(digest+'  '+args.output.name+'\n');print(digest,args.output)
if __name__=='__main__':main()
