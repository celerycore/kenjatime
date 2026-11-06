"""Generate Kenjatime UI assets only. No character or combat state code changes."""
from pathlib import Path
import hashlib,json,struct,shutil

ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'native-android/generated'

def write(name,data):
    p=OUT/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(data)

def sff(sprites,colors):
    # Raw indexed SFF 2.1, used for UI rectangles and the training grid only.
    table=68;palette=table+28*len(sprites);data=palette+16;payload=b''.join(pixels for _,_,_,_,pixels in sprites);pal=bytes(sum((list(c) for c in colors),[]))
    result=bytearray(data+len(payload)+len(pal));result[:12]=b'ElecbyteSpr\0';result[14]=1;result[15]=2
    for offset,value in [(36,table),(40,len(sprites)),(44,palette),(48,1),(52,data)]:struct.pack_into('<I',result,offset,value)
    offset=0
    for i,(w,h,x,y,pixels) in enumerate(sprites):
        p=table+i*28;struct.pack_into('<HHHHhhHBBIIHH',result,p,0,i,w,h,x,y,0,0,8,offset,len(pixels),0,0);offset+=len(pixels)
    struct.pack_into('<HHHHII',result,palette,0,0,len(colors),0,len(payload),len(pal));result[data:data+len(payload)]=payload;result[data+len(payload):]=pal
    return result

def line(pixels,w,h,x0,y0,x1,y1,color):
    steps=max(abs(x1-x0),abs(y1-y0),1)
    for step in range(steps+1):
        x=round(x0+(x1-x0)*step/steps);y=round(y0+(y1-y0)*step/steps)
        if 0<=x<w and 0<=y<h:pixels[y*w+x]=color

def main():
    ui=ROOT/'native-android/ui'
    fight=(ui/'fight.def').read_text()
    # The native lifebar schema allocates/reset objects for every team mode,
    # even during 1v1. Declare those UI sections without inheriting stock art.
    def section(name):
        marker='['+name+']';start=fight.index(marker)+len(marker);end=fight.find('\n[',start);return fight[start:] if end<0 else fight[start:end]
    extras=''
    for name in ['Lifebar','Powerbar','Guardbar','Stunbar','Face','Name']:
        body=section(name) if '['+name+']' in fight else '\np1.pos=0,0\np2.pos=0,0\n'
        if '['+name+']' not in fight:extras+='\n['+name+']'+body
        for mode in ['Simul','Simul_3P','Simul_4P','Tag','Tag_3P','Tag_4P','Turns']:extras+='\n['+mode+' '+name+']'+body
    for name in ['Action','WinCount','Timer','Score','Match','AILevel','Mode']:extras+='\n['+name+']\n'
    write('assets/data/kenjatime/fight.def',(fight+extras).encode())
    for name,height in [('label',13),('banner',28)]:
        write('assets/data/kenjatime/'+name+'.def',f'[FNT v2]\nfntversion=2,00\nname=Kenjatime {name}\n[Def]\nType=truetype\nSize=8,{height}\nSpacing=1,1\nFile=../../font/Open_Sans/OpenSans-Regular.ttf\nColors=256\n'.encode())
    vs=bytearray(20*12)
    for row,bits in enumerate(['100010111','100010100','100010100','010100111','010100001','001000001','001000111']):
        for col,bit in enumerate(bits):
            if bit=='1':
                vs[(row+2)*20+col*2]=2;vs[(row+2)*20+col*2+1]=2
    sprites=[(300,8,0,0,bytes([1])*(300*8)),(300,8,0,0,bytes([2])*(300*8)),(20,12,10,0,bytes(vs)),(4,4,0,0,bytes([2])*16),(150,4,0,0,bytes([1])*600),(150,4,0,0,bytes([2])*600)]
    write('assets/data/kenjatime/fight.sff',sff(sprites,[(0,0,0,0),(42,47,52,255),(211,251,141,255)]))
    w,h=854,480;grid=bytearray(w*h)
    for x in range(-620,1480,72):line(grid,w,h,round(w/2+(x-w/2)*.3),284,x,h-1,1)
    y=293
    while y<h:line(grid,w,h,0,round(y),w-1,round(y),1);y+=(y-266)*.3
    line(grid,w,h,0,392,w-1,392,2)
    write('assets/stages/kenjatime-grid.sff',sff([(w,h,w//2,0,bytes(grid))],[(12,17,27,255),(27,39,55,255),(70,96,85,255)]))
    write('assets/stages/kenjatime-grid.def',b'[Info]\nname=Training grid\nauthor=Kenjatime\n[Camera]\nstartx=0\nstarty=0\nboundleft=-160\nboundright=160\nboundhigh=0\nboundlow=0\ntension=50\n[PlayerInfo]\np1startx=-180\np1starty=0\np1facing=1\np2startx=180\np2starty=0\np2facing=-1\nleftbound=-1000\nrightbound=1000\n[StageInfo]\nzoffset=392\nautoturn=1\nresetbg=1\nlocalcoord=854,480\nxscale=1\nyscale=1\n[BGDef]\nspr=kenjatime-grid.sff\n[BG 0]\ntype=normal\nspriteno=0,0\nstart=0,0\ndelta=0,0\nmask=0\n')
    write('assets/data/kenjatime/engine.lua',(ROOT/'engine/kenjatime.lua').read_bytes())
    write('assets/data/kenjatime/config.ini',(ROOT/'engine/config.ini').read_bytes())
    write('assets/data/select.def',b'[Characters]\nkfm_zss, stages/kenjatime-grid.def\n[ExtraStages]\nstages/kenjatime-grid.def\n')
    # Ship gameplay data and Kenjatime assets only. Stock menus, motif graphics,
    # startup scripts, logos, storyboards, announcers and portraits are absent.
    exact={'data/fightfx.sff','data/fightfx.air','data/common.snd','data/select.def','font/f-6x9f.fnt','font/Open_Sans/OpenSans-Regular.ttf','font/Open_Sans/LICENSE.txt','external/gamecontrollerdb.txt','upstream/LICENSES.txt','upstream/SDL-wrapper-LICENSE.txt'}
    for file in (OUT/'assets').rglob('*'):
        if not file.is_file():continue
        name=file.relative_to(OUT/'assets').as_posix()
        common=name.startswith('data/') and '/' not in name[5:] and file.suffix in {'.zss','.cns','.air','.cmd','.const'}
        if name not in exact and not common and not name.startswith(('data/kenjatime/','data/gofx/','chars/kfm_zss/','stages/kenjatime-grid.')):file.unlink()
    write('res/drawable/kenjatime_control.xml',(ui/'kenjatime_control.xml').read_bytes())
    write('res/color/kenjatime_control_text.xml',(ui/'kenjatime_control_text.xml').read_bytes())
    def cell(view_id,label,left,top,width=44,height=44):
        return f'<TextView android:id="@+id/{view_id}" android:layout_width="{width}dp" android:layout_height="{height}dp" android:layout_marginLeft="{left}dp" android:layout_marginTop="{top}dp" android:background="@drawable/kenjatime_control" android:textColor="@color/kenjatime_control_text" android:gravity="center" android:textSize="16sp" android:text="{label}"/>'
    dpad=''.join(cell(id,label,x*48,y*48) for id,label,x,y in [('dp_upleft','↖',0,0),('dp_up','↑',1,0),('dp_upright','↗',2,0),('dp_left','←',0,1),('dp_right','→',2,1),('dp_downleft','↙',0,2),('dp_down','↓',1,2),('dp_downright','↘',2,2)])
    attacks=''.join(cell(id,label,x*48,y*48) for id,label,x,y in [('btn_x','X',0,0),('btn_y','Y',1,0),('btn_z','Z',2,0),('btn_a','A',0,1),('btn_b','B',1,1),('btn_c','C',2,1)])+cell('btn_start','START',0,96,140,28)
    layout=f'''<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android" android:layout_width="match_parent" android:layout_height="match_parent"><RelativeLayout android:id="@+id/dpad_container" android:layout_width="140dp" android:layout_height="140dp" android:layout_alignParentBottom="true" android:layout_alignParentLeft="true" android:layout_marginLeft="18dp" android:layout_marginBottom="18dp">{dpad}</RelativeLayout><RelativeLayout android:layout_width="140dp" android:layout_height="124dp" android:layout_alignParentRight="true" android:layout_alignParentBottom="true" android:layout_marginRight="18dp" android:layout_marginBottom="18dp">{attacks}</RelativeLayout><org.libsdl.app.JoystickOverlay android:id="@+id/left_analog" android:layout_width="1dp" android:layout_height="1dp" android:visibility="gone"/><org.libsdl.app.JoystickOverlay android:id="@+id/right_analog" android:layout_width="1dp" android:layout_height="1dp" android:visibility="gone"/><View android:id="@+id/btn_w" android:layout_width="1dp" android:layout_height="1dp" android:visibility="gone"/><View android:id="@+id/btn_d" android:layout_width="1dp" android:layout_height="1dp" android:visibility="gone"/><View android:id="@+id/btn_back" android:layout_width="1dp" android:layout_height="1dp" android:visibility="gone"/></RelativeLayout>'''
    write('res/layout/virtual_controller.xml',layout.encode())
    controller=OUT/'java/org/libsdl/app/ControllerOverlay.java';code=controller.read_text();code=code.replace('if (v == null) return;','if (v == null || v.getVisibility() != View.VISIBLE) return;')
    needle='    private int ensureJoystickAlive() {';assert needle in code
    code=code.replace(needle,'''    public void releaseAllControls() {
        if (!isInitialized) return;
        for (Integer pointer : new java.util.ArrayList<>(pointerStates.keySet())) releasePointer(pointer);
        hatX=hatY=0;SDLControllerManager.onNativeHat(virtualDeviceId,0,0,0);
        resetJoystick(findViewById(R.id.left_analog));resetJoystick(findViewById(R.id.right_analog));
    }
'''+needle)
    controller.write_text(code)
    activity=OUT/'java/org/libsdl/app/SDLActivity.java';code=activity.read_text().replace('private ControllerOverlay mControllerOverlay;','protected ControllerOverlay mControllerOverlay;').replace('mLayout.setVisibility(View.INVISIBLE);','mLayout.setVisibility(View.VISIBLE);');activity.write_text(code)
    dist=ROOT/'dist';assert (dist/'native-ui/index.html').is_file(),'Run npm run build before native preparation.'
    # Copy only the native entry's dependency graph. Browser combat, Capacitor,
    # web download pages and decoder workers never enter the native setup APK.
    manifest=json.loads((dist/'.vite/manifest.json').read_text());pending=['native-ui/index.html'];seen=set();files={'native-ui/index.html','third-party-archives.txt'}
    while pending:
        key=pending.pop()
        if key in seen:continue
        seen.add(key);entry=manifest[key];files.add(entry['file']);files.update(entry.get('css',[]));files.update(entry.get('assets',[]));pending.extend(entry.get('imports',[]));pending.extend(entry.get('dynamicImports',[]))
    for name in sorted(files):write('assets/web/'+name,(dist/name).read_bytes())
    # Discard the upstream Android launcher/controller artwork as well.
    for folder in (OUT/'res').glob('mipmap-*'):shutil.rmtree(folder)
    for file in (OUT/'res').rglob('ic_launcher*'):
        if file.is_file():file.unlink()
    for file in (OUT/'res').rglob('round_button.xml'):file.unlink()
    overrides={}
    for path in [OUT/'assets/data/kenjatime',OUT/'assets/stages/kenjatime-grid.def',OUT/'assets/stages/kenjatime-grid.sff',OUT/'assets/data/select.def',OUT/'res/layout/virtual_controller.xml',OUT/'assets/web']:
        for file in path.rglob('*') if path.is_dir() else [path]:
            if file.is_file():overrides[file.relative_to(OUT).as_posix()]=hashlib.sha256(file.read_bytes()).hexdigest()
    return overrides

if __name__=='__main__':print(json.dumps(main(),indent=2))
