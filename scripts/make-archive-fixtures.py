"""Create real MUGEN archive fixtures for the shared web/native import checks."""
from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED,ZIP_BZIP2,ZIP_LZMA
import ctypes,hashlib,json,os,tarfile,io,gzip,bz2,lzma
ROOT=Path(__file__).resolve().parent.parent;os.chdir(ROOT)
out=Path('work/archive-qa/fixtures');out.mkdir(parents=True,exist_ok=True)
# Tiny original fixture: one solid sprite, idle animation and common MUGEN states.
import struct
sprite=bytearray(68+28+16+4+8);sprite[:12]=b'ElecbyteSpr\0';sprite[15]=2
for pos,value in [(36,68),(40,1),(44,96),(48,1),(52,112)]:struct.pack_into('<I',sprite,pos,value)
struct.pack_into('<HHHHhhHBBIIHH',sprite,68,0,0,2,2,1,2,0,0,8,0,4,0,0)
struct.pack_into('<HHHHII',sprite,96,1,1,2,0,4,8);sprite[112:]=bytes([1,1,1,1,0,0,0,0,211,251,141,255])
files={'Fixture/Hero.def':b'[Info]\nname=Archive Fixture\n[Files]\nsprite=hero.sff\nanim=hero.air\ncmd=hero.cmd\ncns=hero.cns\nst=hero.cns',
'Fixture/Hero.sff':bytes(sprite),'Fixture/Hero.air':b'[Begin Action 0]\n0,0,0,0,-1',
'Fixture/Hero.cmd':b'[Command]\nname="x"\ncommand=x\n[Statedef -1]',
'Fixture/Hero.cns':b'[Data]\nlife=1000\n[Size]\nxscale=1\nyscale=1\n[Statedef 0]\ntype=S\nphysics=S\nanim=0'}
expected={n.lower():hashlib.sha256(b).hexdigest() for n,b in files.items()}
for name,compression in [('zip',ZIP_DEFLATED),('bzip2.zip',ZIP_BZIP2),('lzma.zip',ZIP_LZMA)]:
    with ZipFile(out/('fighter.'+name),'w',compression=compression) as z:
        for n,b in files.items():z.writestr(n,b)
with tarfile.open(out/'fighter.tar','w') as tar:
    for n,b in files.items():info=tarfile.TarInfo(n);info.size=len(b);tar.addfile(info,io.BytesIO(b))
data=(out/'fighter.tar').read_bytes()
for extension,compress in [('tar.gz',gzip.compress),('tar.bz2',bz2.compress),('tar.xz',lzma.compress)]: (out/('fighter.'+extension)).write_bytes(compress(data))
(out/'fighter-sfx.zip').write_bytes(b'MZ'+bytes(510)+(out/'fighter.zip').read_bytes())

lib=ctypes.CDLL('libarchive.so.13')
def bind(name,restype,args):fn=getattr(lib,name);fn.restype=restype;fn.argtypes=args;return fn
ptr=ctypes.c_void_p;i=ctypes.c_int;s=ctypes.c_char_p;l=ctypes.c_longlong
new=bind('archive_write_new',ptr,[]);entry_new=bind('archive_entry_new',ptr,[]);error=bind('archive_error_string',s,[ptr]);free=bind('archive_write_free',i,[ptr]);efree=bind('archive_entry_free',None,[ptr])
openfile=bind('archive_write_open_filename',i,[ptr,s]);header=bind('archive_write_header',i,[ptr,ptr]);write=bind('archive_write_data',ctypes.c_ssize_t,[ptr,ptr,ctypes.c_size_t])
setpath=bind('archive_entry_set_pathname',None,[ptr,s]);settype=bind('archive_entry_set_filetype',None,[ptr,ctypes.c_uint]);setperm=bind('archive_entry_set_perm',None,[ptr,ctypes.c_uint]);setsize=bind('archive_entry_set_size',None,[ptr,l])
for extension,format_name,filter_name in [('7z','7zip',None),('cpio','cpio',None),('tar.zst','pax_restricted','zstd')]:
    archive=new()
    def check(result):
        if result<0:raise RuntimeError(error(archive))
    check(bind('archive_write_set_format_'+format_name,i,[ptr])(archive))
    if filter_name:check(bind('archive_write_add_filter_'+filter_name,i,[ptr])(archive))
    check(openfile(archive,str(out/('fighter.'+extension)).encode()))
    for name,data in files.items():
        entry=entry_new();setpath(entry,name.encode());settype(entry,0o100000);setperm(entry,0o644);setsize(entry,len(data));check(header(archive,entry));buffer=ctypes.create_string_buffer(data);check(write(archive,buffer,len(data)));efree(entry)
    check(free(archive))
with tarfile.open(out/'traversal.tar','w') as tar:
    info=tarfile.TarInfo('../escape.def');info.size=1;tar.addfile(info,io.BytesIO(b'x'))
with tarfile.open(out/'symlink.tar','w') as tar:
    info=tarfile.TarInfo('escape');info.type=tarfile.SYMTYPE;info.linkname='/tmp/escape';tar.addfile(info)
manifest={'files':expected,'archives':sorted(p.name for p in out.glob('fighter.*'))+['fighter-sfx.zip'],'invalid':['traversal.tar','symlink.tar']}
(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n');print(json.dumps({'archives':manifest['archives'],'files':len(files)}))
