"""Stage pinned upstream native binaries, assets and SDL Java sources; no engine rebuild."""
from pathlib import Path, PurePosixPath
from zipfile import ZipFile
import hashlib,io,json,shutil,struct,urllib.request,importlib.util

ROOT=Path(__file__).resolve().parent.parent
CACHE=ROOT/'work/ikemen-native'
OUT=ROOT/'native-android/generated'
VERSION='v1.0.0'
ENGINE_COMMIT='81c6da71d689625e20db79586815b695da00dd6d'
WRAPPER_COMMIT='dbc5cfb49b1fed1d4a732ff48b439dd684d54145'
ENGINE_SHA='915ee0c8ce96e860e0aab71c505e9ddd2940fe3e1c339e3f30ab4bd69880d47c'
WRAPPER_SHA='2072b8aef430e6f52496a555659a830dda8a3b9b6ae99997c2700baf11687184'

def android_api(data):
    """Read Android's API build note from an ELF64 library, rather than trusting the old APK manifest."""
    assert data[:6]==b'\x7fELF\x02\x01'
    offset=struct.unpack_from('<Q',data,40)[0];size,count=struct.unpack_from('<HH',data,58);apis=[]
    for i in range(count):
        section=offset+i*size
        if struct.unpack_from('<I',data,section+4)[0]!=7:continue
        start,length=struct.unpack_from('<QQ',data,section+24);end=start+length
        while start+12<=end:
            names,description,_=struct.unpack_from('<III',data,start);start+=12
            name=data[start:start+names].rstrip(b'\x00');start+=(names+3)//4*4
            if name==b'Android' and description>=4:apis.append(struct.unpack_from('<I',data,start)[0])
            start+=(description+3)//4*4
    if not apis:raise ValueError('Missing native Android API build note')
    return max(apis)

def download(name,url,digest):
    CACHE.mkdir(parents=True,exist_ok=True);path=CACHE/name
    if not path.exists():
        temp=path.with_suffix('.download')
        with urllib.request.urlopen(url,timeout=120) as response,temp.open('wb') as dest:shutil.copyfileobj(response,dest)
        if hashlib.sha256(temp.read_bytes()).hexdigest()!=digest:
            temp.unlink();raise ValueError('Checksum mismatch: '+name)
        temp.replace(path)
    if hashlib.sha256(path.read_bytes()).hexdigest()!=digest:raise ValueError('Checksum mismatch: '+name)
    return path

def write(path,data):
    if PurePosixPath(path).is_absolute() or '..' in PurePosixPath(path).parts:raise ValueError('Unsafe upstream path')
    dest=OUT/path;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(data)

def main():
    release=download(f'Ikemen_GO-{VERSION}-android.zip',f'https://github.com/ikemen-engine/Ikemen-GO/releases/download/{VERSION}/Ikemen_GO-{VERSION}-android.zip',ENGINE_SHA)
    wrapper=download('wrapper.zip',f'https://codeload.github.com/Jesuszilla/ikemen-droid/zip/{WRAPPER_COMMIT}',WRAPPER_SHA)
    if OUT.exists():shutil.rmtree(OUT)
    with ZipFile(release) as z:
        apk=next(n for n in z.namelist() if n.endswith('.apk'));apk_bytes=z.read(apk)
        write('assets/upstream/LICENSES.txt',z.read('LICENSES.txt'))
    native=[]
    with ZipFile(io.BytesIO(apk_bytes)) as z:
        for info in z.infolist():
            if info.is_dir():continue
            if info.filename.startswith('assets/'):write(info.filename,z.read(info))
            elif info.filename.startswith('lib/arm64-v8a/'):
                data=z.read(info);assert data[:4]==b'\x7fELF' and int.from_bytes(data[18:20],'little')==183
                write('jniLibs/'+info.filename[4:],data);native.append({'name':info.filename[4:],'sha256':hashlib.sha256(data).hexdigest(),'bytes':len(data),'androidApiBuildNote':android_api(data)})
    patched=[]
    with ZipFile(wrapper) as z:
        for info in z.infolist():
            name=info.filename.split('/',1)[-1]
            if info.is_dir():continue
            if name in ['LICENSE.txt','README.md']:write('assets/upstream/SDL-wrapper-'+name,z.read(info));continue
            if name.startswith('app/src/main/java/'):
                data=z.read(info).decode('utf-8').replace('org.ikemen_engine.ikemen_go.R','io.github.celerycore.kenjatime.nativeprototype.R')
                if name.endswith('/SDLActivity.java'):
                    assert 'private final boolean USE_FOLDER_SELECT = true;' in data
                    data=data.replace('private final boolean USE_FOLDER_SELECT = true;','private final boolean USE_FOLDER_SELECT = false;')
                    assert data.count('getExternalFilesDir(null).getAbsolutePath()')==5
                    data=data.replace('getExternalFilesDir(null).getAbsolutePath()', 'new File(getFilesDir(), "game").getAbsolutePath()')
                    # The native launcher has already staged assets; the engine always uses app-private files.
                    data=data.replace('mBasePath = mSharedPrefs.getString(getString(R.string.game_folder_key), "");','mBasePath = new File(getFilesDir(), "game").getAbsolutePath();')
                if 'org.ikemen_engine.ikemen_go' in data:data=data.replace('org.ikemen_engine.ikemen_go.USB_PERMISSION','io.github.celerycore.kenjatime.nativeprototype.USB_PERMISSION')
                if name.endswith('/HIDDeviceManager.java'):
                    old='mContext.registerReceiver(mUsbBroadcast, filter);'
                    assert data.count(old)==1
                    data=data.replace(old,'androidx.core.content.ContextCompat.registerReceiver(mContext, mUsbBroadcast, filter, androidx.core.content.ContextCompat.RECEIVER_NOT_EXPORTED);')
                if name.endswith('/SDLAudioManager.java'):
                    old='if (mAudioRecord == null) {'
                    assert data.count(old)==1
                    data=data.replace(old,'if (mContext == null || mContext.checkSelfPermission(android.Manifest.permission.RECORD_AUDIO) != android.content.pm.PackageManager.PERMISSION_GRANTED) { return null; }\n            '+old)
                write('java/'+name.split('java/',1)[1],data.encode());patched.append(name)
            elif name.startswith('app/src/main/res/'):
                data=z.read(info)
                if name.endswith('/values/strings.xml'):data=data.replace(b'>I.K.E.M.E.N-Go<',b'>Kenjatime Native<')
                write('res/'+name.split('res/',1)[1],data)
    record={'engineVersion':VERSION,'engineCommit':ENGINE_COMMIT,'releaseSha256':ENGINE_SHA,'wrapperCommit':WRAPPER_COMMIT,'wrapperArchiveSha256':WRAPPER_SHA,'upstreamApkSha256':hashlib.sha256(apk_bytes).hexdigest(),'libraries':native,'javaFiles':len(patched),'changes':['Kenjatime R namespace and USB broadcast action','Disable upstream shared-folder chooser','Use app-private game directory','Scope USB broadcast receiver on Android 13+','Reject audio capture without microphone permission'],'engineBinaryModified':False,'sources':{'engine':f'https://github.com/ikemen-engine/Ikemen-GO/tree/{ENGINE_COMMIT}','wrapper':f'https://github.com/Jesuszilla/ikemen-droid/tree/{WRAPPER_COMMIT}','ffmpeg':'https://github.com/ikemen-engine/Ikemen-GO/releases/download/v1.0.0/src_ffmpeg.tar.gz'}}
    spec=importlib.util.spec_from_file_location('kenjatime_ui',ROOT/'scripts/prepare-kenjatime-ui.py');module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
    record['uiOverrides']=module.main();record['ui']='Shared Kenjatime setup and HUD; match-only engine bootstrap; stock menu scripts and assets excluded'
    record['stockMenuAssets']=False
    record['stockMenuScripts']=False
    record['systemScript']='data/kenjatime/engine.lua'
    record['archiveDecoder']='libarchive-android 1.1.6'
    write('assets/native-provenance.json',(json.dumps(record,indent=2)+'\n').encode())
    print(json.dumps({'engine':VERSION,'nativeLibraries':len(native),'javaFiles':len(patched),'directory':str(OUT)}))

if __name__=='__main__':main()
