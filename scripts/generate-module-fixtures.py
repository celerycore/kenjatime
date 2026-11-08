from pathlib import Path
import struct,math
out=Path('test/fixtures/media');sine=[round(100*math.sin(i*2*math.pi/64)) for i in range(64)]
def put(b,o,fmt,*v):struct.pack_into('<'+fmt,b,o,*v)
# ProTracker MOD, one looping instrument, one pattern.
b=bytearray(1084+1024+64);b[:20]=b'Kenjatime module QA'.ljust(20,b'\0');struct.pack_into('>H',b,42,32);b[45]=64;struct.pack_into('>H',b,48,32);b[950]=1;b[1080:1084]=b'M.K.';b[1084:1088]=bytes([1,172,16,0]);b[-64:]=bytes(n&255 for n in sine);(out/'tone.mod').write_bytes(b)
# FastTracker II XM, one channel/instrument, delta-coded 8-bit sample.
b=bytearray(336);b[:17]=b'Extended Module: ';b[17:37]=b'Kenjatime XM QA'.ljust(20,b'\0');b[37]=26;b[38:58]=b'Kenjatime'.ljust(20,b'\0');put(b,58,'H',0x104);put(b,60,'I',276);put(b,64,'8H',1,0,1,1,1,1,6,125)
p=bytearray(9+64*5);put(p,0,'IBHH',9,0,64,320);p[9:14]=bytes([49,1,64,0,0]);b+=p
i=bytearray(243);put(i,0,'I',243);i[4:26]=b'Sine QA'.ljust(22,b'\0');put(i,27,'H',1);put(i,29,'I',40);b+=i
s=bytearray(40);put(s,0,'III',64,0,64);s[12]=64;s[14]=1;s[15]=128;b+=s;previous=0
for n in sine:b.append((n-previous)&255);previous=n
(out/'tone.xm').write_bytes(b)
# Impulse Tracker IT sample mode, one channel and signed looping sample.
b=bytearray(202);b[:4]=b'IMPM';b[4:30]=b'Kenjatime IT QA'.ljust(26,b'\0');put(b,32,'8H',2,0,1,1,0x214,0x214,1,0);b[48:54]=bytes([128,48,6,125,128,0]);b[64:128]=bytes([32]+[160]*63);b[128:192]=bytes([64]*64);b[192:194]=bytes([0,255]);put(b,194,'II',202,282)
s=bytearray(80);s[:4]=b'IMPS';s[17]=64;s[18]=17;s[19]=64;s[20:46]=b'Sine QA'.ljust(26,b'\0');s[46]=1;put(s,48,'7I',64,0,64,8363,0,0,358);b+=s
p=bytearray(8);data=bytes([129,3,60,1,0]+[0]*63);put(p,0,'HH',len(data),64);b+=p+data;assert len(b)==358;b+=bytes(n&255 for n in sine);(out/'tone.it').write_bytes(b)
# ScreamTracker S3M, one channel, unsigned PCM instrument.
b=bytearray(112);b[:28]=b'Kenjatime S3M QA'.ljust(28,b'\0');b[28]=26;b[29]=16;put(b,32,'6H',1,1,1,0,0x1320,2);b[44:48]=b'SCRM';b[48:52]=bytes([64,6,125,176]);b[64:96]=bytes([0]+[255]*31);b[96]=0;put(b,97,'HH',7,12)
s=bytearray(80);s[0]=1;s[14]=17;put(s,16,'III',64,0,64);s[28]=64;s[31]=1;put(s,32,'I',8363);s[48:76]=b'Sine QA'.ljust(28,b'\0');s[76:80]=b'SCRS';b+=s
p=bytes([32,64,1,0]+[0]*63);b+=struct.pack('<H',len(p))+p;b+=bytes(272-len(b));b+=bytes(n+128 for n in sine);(out/'tone.s3m').write_bytes(b)
