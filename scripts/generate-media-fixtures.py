"""Reproduce authored video and independent AES ZIP fixtures (development only).
Requires ffmpeg, pyzipper==0.3.6 and pycryptodomex==3.24.2.
"""
from pathlib import Path
import subprocess,pyzipper
ROOT=Path(__file__).resolve().parent.parent;out=ROOT/'test/fixtures/media'
for ext in ['webm','mp4']:
 codec=['-c:v','libvpx-vp9','-b:v','80k','-c:a','libopus'] if ext=='webm' else ['-c:v','libx264','-pix_fmt','yuv420p','-c:a','aac','-movflags','+faststart']
 subprocess.run(['ffmpeg','-y','-loglevel','error','-f','lavfi','-i','color=c=red:s=64x48:r=10:d=1','-f','lavfi','-i','color=c=green:s=64x48:r=10:d=1','-f','lavfi','-i','sine=frequency=440:sample_rate=48000:duration=2','-filter_complex','[0:v][1:v]concat=n=2:v=1:a=0[v]','-map','[v]','-map','2:a',*codec,str(out/('colors.'+ext))],check=True)
with pyzipper.AESZipFile(out/'zip-aes-unicode.zip','w',compression=pyzipper.ZIP_DEFLATED,encryption=pyzipper.WZ_AES) as z:
 z.setpassword('日本語 passphrase'.encode());z.setencryption(pyzipper.WZ_AES,nbits=256);z.writestr('hero.def',b'[Info]\nname=Unicode encryption fixture\n')
