class Mu{constructor({maxBytes:e=16*1024*1024,maxEntries:t=512,sizeOf:i=s=>{var r;return((r=s==null?void 0:s.rgba)==null?void 0:r.byteLength)||0}}={}){this.maxBytes=e,this.maxEntries=t,this.sizeOf=i,this.entries=new Map,this.bytes=0,this.hits=0,this.misses=0,this.evictions=0}get size(){return this.entries.size}has(e){return this.entries.has(e)}get(e){const t=this.entries.get(e);if(!t){this.misses++;return}return this.hits++,this.entries.delete(e),this.entries.set(e,t),t.value}set(e,t){this.delete(e);const i=Math.max(0,this.sizeOf(t)||0);if(i>this.maxBytes||this.maxEntries<1)return this;for(this.entries.set(e,{value:t,bytes:i}),this.bytes+=i;this.bytes>this.maxBytes||this.size>this.maxEntries;)this.delete(this.entries.keys().next().value),this.evictions++;return this}delete(e){const t=this.entries.get(e);return t?(this.bytes-=t.bytes,this.entries.delete(e)):!1}clear(){this.entries.clear(),this.bytes=0}}var mi=Uint8Array,us=Uint16Array,tf=Int32Array,bu=new mi([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),wu=new mi([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),nf=new mi([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Eu=function(n,e){for(var t=new us(31),i=0;i<31;++i)t[i]=e+=1<<n[i-1];for(var s=new tf(t[30]),i=1;i<30;++i)for(var r=t[i];r<t[i+1];++r)s[r]=r-t[i]<<5|i;return{b:t,r:s}},Tu=Eu(bu,2),Au=Tu.b,sf=Tu.r;Au[28]=258,sf[258]=28;var rf=Eu(wu,0),af=rf.b,zo=new us(32768);for(var _t=0;_t<32768;++_t){var un=(_t&43690)>>1|(_t&21845)<<1;un=(un&52428)>>2|(un&13107)<<2,un=(un&61680)>>4|(un&3855)<<4,zo[_t]=((un&65280)>>8|(un&255)<<8)>>1}var Zs=(function(n,e,t){for(var i=n.length,s=0,r=new us(e);s<i;++s)n[s]&&++r[n[s]-1];var a=new us(e);for(s=1;s<e;++s)a[s]=a[s-1]+r[s-1]<<1;var o;if(t){o=new us(1<<e);var l=15-e;for(s=0;s<i;++s)if(n[s])for(var c=s<<4|n[s],h=e-n[s],f=a[n[s]-1]++<<h,d=f|(1<<h)-1;f<=d;++f)o[zo[f]>>l]=c}else for(o=new us(i),s=0;s<i;++s)n[s]&&(o[s]=zo[a[n[s]-1]++]>>15-n[s]);return o}),dr=new mi(288);for(var _t=0;_t<144;++_t)dr[_t]=8;for(var _t=144;_t<256;++_t)dr[_t]=9;for(var _t=256;_t<280;++_t)dr[_t]=7;for(var _t=280;_t<288;++_t)dr[_t]=8;var Cu=new mi(32);for(var _t=0;_t<32;++_t)Cu[_t]=5;var of=Zs(dr,9,1),lf=Zs(Cu,5,1),Xa=function(n){for(var e=n[0],t=1;t<n.length;++t)n[t]>e&&(e=n[t]);return e},yi=function(n,e,t){var i=e/8|0;return(n[i]|n[i+1]<<8)>>(e&7)&t},$a=function(n,e){var t=e/8|0;return(n[t]|n[t+1]<<8|n[t+2]<<16)>>(e&7)},cf=function(n){return(n+7)/8|0},hf=function(n,e,t){return(t==null||t>n.length)&&(t=n.length),new mi(n.subarray(e,t))},uf=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],Ti=function(n,e,t){var i=new Error(e||uf[n]);if(i.code=n,Error.captureStackTrace&&Error.captureStackTrace(i,Ti),!t)throw i;return i},df=function(n,e,t,i){var s=n.length,r=i?i.length:0;if(!s||e.f&&!e.l)return t||new mi(0);var a=!t,o=a||e.i!=2,l=e.i;a&&(t=new mi(s*3));var c=function(Ee){var He=t.length;if(Ee>He){var Xe=new mi(Math.max(He*2,Ee));Xe.set(t),t=Xe}},h=e.f||0,f=e.p||0,d=e.b||0,u=e.l,p=e.d,_=e.m,m=e.n,g=s*8;do{if(!u){h=yi(n,f,1);var y=yi(n,f+1,3);if(f+=3,y)if(y==1)u=of,p=lf,_=9,m=5;else if(y==2){var M=yi(n,f,31)+257,v=yi(n,f+10,15)+4,S=M+yi(n,f+5,31)+1;f+=14;for(var E=new mi(S),P=new mi(19),C=0;C<v;++C)P[nf[C]]=yi(n,f+C*3,7);f+=v*3;for(var F=Xa(P),I=(1<<F)-1,R=Zs(P,F,1),C=0;C<S;){var O=R[yi(n,f,I)];f+=O&15;var b=O>>4;if(b<16)E[C++]=b;else{var k=0,H=0;for(b==16?(H=3+yi(n,f,3),f+=2,k=E[C-1]):b==17?(H=3+yi(n,f,7),f+=3):b==18&&(H=11+yi(n,f,127),f+=7);H--;)E[C++]=k}}var L=E.subarray(0,M),N=E.subarray(M);_=Xa(L),m=Xa(N),u=Zs(L,_,1),p=Zs(N,m,1)}else Ti(1);else{var b=cf(f)+4,A=n[b-4]|n[b-3]<<8,x=b+A;if(x>s){l&&Ti(0);break}o&&c(d+A),t.set(n.subarray(b,x),d),e.b=d+=A,e.p=f=x*8,e.f=h;continue}if(f>g){l&&Ti(0);break}}o&&c(d+131072);for(var W=(1<<_)-1,B=(1<<m)-1,j=f;;j=f){var k=u[$a(n,f)&W],re=k>>4;if(f+=k&15,f>g){l&&Ti(0);break}if(k||Ti(2),re<256)t[d++]=re;else if(re==256){j=f,u=null;break}else{var V=re-254;if(re>264){var C=re-257,K=bu[C];V=yi(n,f,(1<<K)-1)+Au[C],f+=K}var ie=p[$a(n,f)&B],ae=ie>>4;ie||Ti(3),f+=ie&15;var N=af[ae];if(ae>3){var K=wu[ae];N+=$a(n,f)&(1<<K)-1,f+=K}if(f>g){l&&Ti(0);break}o&&c(d+131072);var se=d+V;if(d<N){var be=r-N,rt=Math.min(N,se);for(be+d<0&&Ti(3);d<rt;++d)t[d]=i[be+d]}for(;d<se;++d)t[d]=t[d-N]}}e.l=u,e.p=j,e.b=d,e.f=h,u&&(h=1,e.m=_,e.d=p,e.n=m)}while(!h);return d!=t.length&&a?hf(t,0,d):t.subarray(0,d)},ff=new mi(0),pf=function(n,e){return((n[0]&15)!=8||n[0]>>4>7||(n[0]<<8|n[1])%31)&&Ti(6,"invalid zlib data"),(n[1]>>5&1)==+!e&&Ti(6,"invalid zlib data: "+(n[1]&32?"need":"unexpected")+" dictionary"),(n[1]>>3&4)+2};function mf(n,e){return df(n.subarray(pf(n,e&&e.dictionary),-4),{i:2},e&&e.out,e&&e.dictionary)}var gf=typeof TextDecoder<"u"&&new TextDecoder,vf=0;try{gf.decode(ff,{stream:!0}),vf=1}catch{}function Li(n){if(!(n instanceof Uint8Array))throw Error("Text file is missing");if(n[0]===255&&n[1]===254)return new TextDecoder("utf-16le").decode(n);if(n[0]===254&&n[1]===255)return new TextDecoder("utf-16be").decode(n);try{return new TextDecoder("utf-8",{fatal:!0}).decode(n)}catch{return new TextDecoder("windows-1252").decode(n)}}function on(n,e="",t=!1){const i=String(n).normalize("NFC").replaceAll("\\","/");if(i.startsWith("/")||/^[a-z]:/i.test(i)||i.includes("\0"))throw Error("Unsafe archive path.");const s=e.split("/").filter(Boolean);for(const r of i.split("/"))if(!(!r||r==="."))if(r===".."){if(!t||!s.length)throw Error("Unsafe archive path.");s.pop()}else s.push(r);return s.join("/").toLowerCase()}function fr(n){const e={};let t="";for(const i of n.replace(/^\uFEFF/,"").split(/\r?\n/)){const s=i.replace(/;(?=(?:[^"']*["'][^"']*["'])*[^"']*$).*$/,"").trim(),r=s.match(/^\[(.+)\]$/);if(r){t=r[1].toLowerCase(),e[t]??(e[t]={});continue}const a=s.indexOf("=");a>0&&t&&(e[t][s.slice(0,a).trim().toLowerCase()]=s.slice(a+1).trim().replace(/^"(.*)"$/,"$1"))}return e}function _f(n){const e=i=>Li(n[i]);return Object.keys(n).filter(i=>i.endsWith(".def")).map(i=>({path:i,def:fr(e(i))})).filter(i=>{var s;return i.def.info&&((s=i.def.files)==null?void 0:s.sprite)}).map(i=>{const s=i.path.slice(0,i.path.lastIndexOf("/")+1),r=c=>on(c,s,!0),a=(c,h)=>{let f;try{f=r(h)}catch{f=null}const d=String(h).replaceAll("\\","/").split("/").at(-1);if(!f&&d&&d!=="."&&d!=="..")try{const m=r(d);n[m]&&(f=m)}catch{}if(/^(cns|cmd|st\d*|stcommon)$/.test(c)&&f&&!n[f]&&n[f+".zss"])return f+".zss";if(c!=="stcommon"||n[f])return f;const u=i.path.indexOf("/chars/"),p=u>=0?i.path.slice(0,u+1):"",_=[p+"data/",p].flatMap(m=>{try{return[on(h,m,!0)]}catch{return[]}});return(d==null?void 0:d.toLowerCase())==="common1.cns"&&_.push(p+"data/common1.cns","data/common1.cns"),_.find(m=>n[m])||_.map(m=>m+".zss").find(m=>n[m])||f},o=Object.entries(i.def.files).filter(([c,h])=>h&&/^(sprite|anim|cmd|cns|sound|stcommon|st\d*|pal\d+)$/.test(c)).map(([c,h])=>{const f=a(c,h);return{key:c,value:h,path:f,ok:!!f&&!!n[f],...f?{}:{message:"This resource is outside the ZIP. Include it in the package or use an in-package relative path."}}}),l=o.find(c=>c.key==="anim"&&c.ok);return{...i,checks:o,files:n,animations:l?Gl(e(l.path)):[],sprite:o.find(c=>c.key==="sprite"&&c.ok),palettes:o.filter(c=>/^pal\d+$/.test(c.key)).map(c=>({...c,number:Number(c.key.slice(3))}))}})}function Gl(n){var a;const e=[];let t,i,s,r;for(const[o,l]of n.replace(/^\uFEFF/,"").split(/\r?\n/).entries()){const c=l.split(";")[0].trim(),h=c.match(/^\[begin action\s+(-?\d+)\]\s*$/i);if(h){t={id:+h[1],frames:[],loopStart:0,loopDeclared:!1},e.push(t),i={1:[],2:[]},s={},r={};continue}if(!t||!c)continue;if(/^loopstart\s*$/i.test(c)){t.loopStart=t.frames.length,t.loopDeclared=!0;continue}const f=c.match(/^clsn([12])(default)?\s*:\s*(\d+)\s*$/i);if(f){const x=+f[1],M=+f[3];if(M>1024)throw Error(`AIR collision box limit exceeded on line ${o+1}`);const v=new Array(M);r[x]=v,f[2]?(i[x]=v,delete s[x]):s[x]=v;continue}const d=c.match(/^clsn([12])\s*\[\s*(\d+)\s*\]\s*=\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*$/i);if(d){const x=r[+d[1]],M=+d[2];if(!x||M>=x.length){(t.diagnostics??(t.diagnostics=[])).push({line:o+1,message:"AIR collision box index out of range; box ignored"});continue}x[M]=d.slice(3).map(Number);continue}const u=c.match(/^interpolate\s+(offset|blend|scale|angle)\s*$/i);if(u){const x=u[1].toLowerCase();t.frames.length?((a=t.frames.at(-1)).interpolate??(a.interpolate=[])).push(x):(t.loopInterpolate??(t.loopInterpolate=[])).push(x);continue}if(!/^-?\d+\s*,/.test(c))continue;const p=c.split(",").map(x=>x.trim()),_=p.slice(0,5).map(Number);if(p.length<5||_.some(x=>!Number.isFinite(x))||_[4]<-1)throw Error(`Invalid AIR frame on line ${o+1}`);const m=x=>{const M=s[x]??i[x];return Object.keys(M).length!==M.length&&(t.diagnostics??(t.diagnostics=[])).push({line:o+1,message:`Incomplete Clsn${x} definition; missing boxes ignored`}),M.filter(Boolean).map(v=>v.slice())},g=(x,M,v)=>{if(!p[x])return M;const S=Number(p[x]);return Number.isFinite(S)?S:((t.diagnostics??(t.diagnostics=[])).push({line:o+1,message:`Invalid AIR ${v} ignored; using ${M}`}),M)},y=g(7,1,"x-scale"),b=g(8,1,"y-scale"),A=g(9,0,"angle");t.frames.push({group:_[0],number:_[1],x:_[2],y:_[3],ticks:_[4],flip:(p[5]||"").toUpperCase(),blend:(p[6]||"").toUpperCase(),scaleX:y,scaleY:b,angle:A,clsn1:m(1),clsn2:m(2)}),s={}}return e.filter(o=>o.frames.length).map(o=>(o.loopStart>=o.frames.length&&(o.loopStart=0,o.loopDeclared=!1),o.loopInterpolate&&(o.frames.at(-1).interpolate=[...new Set([...o.frames.at(-1).interpolate||[],...o.loopInterpolate])]),delete o.loopInterpolate,o))}function xf(n){if(!(n instanceof Uint8Array)||n.length<24||new TextDecoder().decode(n.subarray(0,12))!=="ElecbyteSnd\0")throw Error("Invalid SND signature");const e=new DataView(n.buffer,n.byteOffset,n.byteLength),t=e.getUint32(16,!0),i=[],s=new Map,r=new Set;if(t>1e4)throw Error("SND sample table too large");let a=e.getUint32(20,!0);for(let o=0;o<t;o++){if(a<24||a+16>n.length||r.has(a))throw Error("Invalid SND sample link");r.add(a);const l=e.getUint32(a,!0),c=e.getUint32(a+4,!0),h=e.getUint32(a+8,!0),f=e.getUint32(a+12,!0),d=a+16;if(c<12||c>32*1024*1024||d+c>n.length)throw Error("Invalid SND sample length");const u=n.subarray(d,d+c);if(new TextDecoder().decode(u.subarray(0,4))!=="RIFF"||new TextDecoder().decode(u.subarray(8,12))!=="WAVE")throw Error("Unsupported SND sample: expected WAV");if(new DataView(u.buffer,u.byteOffset,u.byteLength).getUint32(4,!0)+8>c)throw Error("Truncated SND WAV");const p={group:h,number:f,data:u};i.push(p),s.has(`${h},${f}`)||s.set(`${h},${f}`,u),a=l}return{samples:i,get:(o,l)=>s.get(`${o},${l}`)}}function yf(n,e,t,i){const s=[137,80,78,71,13,10,26,10];if(n.length<33||!s.every((S,E)=>n[E]===S))throw Error("Invalid PNG signature");const r=new DataView(n.buffer,n.byteOffset,n.byteLength);let a,o,l,c,h,f,d=8,u=!1,p=0;const _=[];for(;d+12<=n.length;){const S=r.getUint32(d),E=d+8,P=E+S;if(S>64*1024*1024||P+4>n.length)throw Error("Invalid PNG chunk length");const C=String.fromCharCode(...n.subarray(d+4,d+8));if(C==="IHDR"){if(d!==8||S!==13||a!==void 0)throw Error("Invalid PNG header");if(a=r.getUint32(E),o=r.getUint32(E+4),c=n[E+9],l={0:1,2:3,3:1,4:2,6:4}[c],!a||!o||a*o>4e6||e!==void 0&&a!==e||t!==void 0&&o!==t)throw Error("Invalid PNG dimensions");if(n[E+8]!==8||!l||n[E+10]||n[E+11]||n[E+12])throw Error("Unsupported PNG encoding: requires non-interlaced 8-bit channels")}else{if(a===void 0)throw Error("PNG header must be first");if(C==="PLTE"){if(!S||S>768||S%3)throw Error("Invalid PNG palette");h=n.subarray(E,P)}else if(C==="tRNS")f=n.subarray(E,P);else if(C==="IDAT"){if(p+=S,p>64*1024*1024)throw Error("PNG compressed data too large");_.push(n.subarray(E,P))}else if(C==="IEND"){if(S)throw Error("Invalid PNG end chunk");u=!0;break}else if(C[0]===C[0].toUpperCase())throw Error("Unsupported PNG critical chunk: "+C)}d=P+4}if(!u||!_.length)throw Error("Truncated PNG");if(c===3&&!i&&!h)throw Error("PNG palette missing");const m=new Uint8Array(p);let g=0;for(const S of _)m.set(S,g),g+=S.length;const y=a*l,b=(y+1)*o,A=mf(m,{out:new Uint8Array(b+1)});if(A.length!==b)throw Error("Invalid PNG pixel data length");const x=new Uint8Array(y*o),M=(S,E,P)=>{const C=S+E-P,F=Math.abs(C-S),I=Math.abs(C-E),R=Math.abs(C-P);return F<=I&&F<=R?S:I<=R?E:P};for(let S=0;S<o;S++){const E=A[S*(y+1)];if(E>4)throw Error("Invalid PNG scanline filter");for(let P=0;P<y;P++){const C=S*y+P,F=P>=l?x[C-l]:0,I=S?x[C-y]:0,R=S&&P>=l?x[C-y-l]:0,O=E===0?0:E===1?F:E===2?I:E===3?Math.floor((F+I)/2):M(F,I,R);x[C]=A[S*(y+1)+1+P]+O&255}}const v=new Uint8ClampedArray(a*o*4);for(let S=0;S<a*o;S++){const E=S*l,P=S*4;if(c===3){const C=x[E],F=C*(i?4:3),I=i||h;if(F+2>=I.length)throw Error("PNG palette index out of range");v[P]=I[F],v[P+1]=I[F+1],v[P+2]=I[F+2],v[P+3]=i?I[F+3]:(f==null?void 0:f[C])??255}else if(c===0||c===4){const C=x[E];let F=c===4?x[E+1]:255;c===0&&(f==null?void 0:f.length)===2&&C===(f[0]<<8|f[1])&&(F=0),v[P]=C,v[P+1]=C,v[P+2]=C,v[P+3]=F}else{const C=x[E],F=x[E+1],I=x[E+2];let R=c===6?x[E+3]:255;c===2&&(f==null?void 0:f.length)===6&&C===(f[0]<<8|f[1])&&F===(f[2]<<8|f[3])&&I===(f[4]<<8|f[5])&&(R=0),v[P]=C,v[P+1]=F,v[P+2]=I,v[P+3]=R}}return{w:a,h:o,rgba:v,...c===3?{indices:x}:{}}}function Ic(n,e,t){const i=new Uint8Array(e);let s=0,r=0,a=0,o=0;const l=()=>{if(s>=n.length)throw Error("Truncated sprite data");return n[s++]},c=(h,f)=>{if(h<1||r+h>e)throw Error("Invalid sprite run");i.fill(f,r,r+h),r+=h};if(t===0){if(n.length<e)throw Error("Truncated raw sprite");return n.slice(0,e)}if(t===2){for(;r<e;){let h=l();if((h&192)===64){let f=h&63;c(f,l())}else c(1,h)}return i}if(t===3){for(;r<e;){let h=l()+1,f=l(),d=f&127,u=f&128?l():0;for(c(h,u);d--;){let p=l();c((p>>5)+1,p&31)}}return i}if(t!==4)throw Error("Unsupported sprite compression "+t);for(;r<e;){let h=l();for(let f=0;f<8&&r<e;f++){let d=l();if(h&1<<f){let u,p;if((d&63)===0?(p=(d<<2|l())+1,u=l()+3):(a|=(d&192)>>o,o+=2,u=(d&63)+1,o<8?p=l()+1:(p=a+1,a=0,o=0)),p>r||r+u>e)throw Error("Invalid sprite backreference");for(;u--;)i[r]=i[r-p],r++}else{let u;d&224?(u=d>>5,d&=31):u=l()+8,c(u,d)}}}return i}function ia(n,e,t="SFF palette index out of range"){const i=new Uint32Array(Math.ceil(e.length/4));new Uint8Array(i.buffer).set(e);const s=new Uint8ClampedArray(n.length*4),r=new Uint32Array(s.buffer);for(let a=0;a<n.length;a++){const o=n[a];if(o*4+2>=e.length)throw Error(t);r[a]=i[o]}return s}function Ru(n,e={}){if(!(n instanceof Uint8Array)||n.length<32||new TextDecoder().decode(n.subarray(0,12))!=="ElecbyteSpr\0")throw Error("Invalid SFF signature");if(n[15]===1)return Sf(n,e);if(n[15]!==2)throw Error("Unsupported SFF version");if(n.length<68)throw Error("Truncated SFF header");const t=new DataView(n.buffer,n.byteOffset,n.byteLength),i=x=>t.getUint32(x,!0),s=x=>t.getInt16(x,!0),r=x=>t.getUint16(x,!0),a=i(36),o=i(40),l=i(44),c=i(48),h=i(52),f=i(60);if(o>2e4||c>4096)throw Error("SFF table too large");if(a+o*28>n.length||l+c*16>n.length)throw Error("Truncated SFF table");const d=[],u=new Mu({maxBytes:e.cacheBytes??16*1024*1024,sizeOf:x=>{var M;return x.rgba.byteLength+(((M=x.indices)==null?void 0:M.byteLength)||0)}}),p=new Map,_=Array.from({length:c},(x,M)=>({index:M,group:r(l+M*16),number:r(l+M*16+2),colors:r(l+M*16+4)}));for(let x=0;x<o;x++){const M=a+x*28;d.push({group:r(M),number:r(M+2),w:r(M+4),h:r(M+6),x:s(M+8),y:s(M+10),link:r(M+12),format:n[M+14],depth:n[M+15],offset:i(M+16),length:i(M+20),palette:r(M+24),flags:r(M+26)})}function m(x,M=new Set){if(p.has(x))return p.get(x);if(x>=c||M.has(x))throw Error("Invalid palette link");M.add(x);const v=l+x*16,S=i(v+12);if(!S)return m(r(v+6),M);const E=h+i(v+8);if(S%4||E+S>n.length)throw Error("Invalid SFF palette length");const P=n.slice(E,E+S);if(!n[13]&&!n[14])for(let C=0;C<P.length/4;C++)P[C*4+3]=C?255:0;return p.set(x,P),P}function g(x,M=new Set){if(u.has(x))return u.get(x);if(!Number.isInteger(x)||x<0||x>=d.length||M.has(x))throw Error("Invalid sprite link");M.add(x);const v=d[x];if(!v.length){const C=g(v.link,M),F={...C,...v,w:C.w,h:C.h,rgba:C.rgba};return C.indices&&v.palette!==C.palette&&(F.rgba=ia(C.indices,m(v.palette),"Linked sprite palette index out of range")),u.set(x,F),F}if(!v.w||!v.h||v.w*v.h>4e6)throw Error("Invalid SFF sprite dimensions");const S=(v.flags&1?f:h)+v.offset;if(S+v.length>n.length||v.length<(v.format?4:0))throw Error("Truncated SFF sprite data");const E=n.subarray(S+(v.format?4:0),S+v.length);let P;if(v.format>=10&&v.format<=12)P={...v,...yf(E,v.w,v.h,v.format===10&&c?m(v.palette):void 0)};else{if(v.depth!==8&&v.depth!==5)throw Error("Unsupported non-indexed SFF compression: "+v.format);const C=Ic(E,v.w*v.h,v.format),F=ia(C,m(v.palette));P={...v,rgba:F,indices:C}}return u.set(x,P),P}function y(x,M,v){const S=g(x);if(!S.indices)return S;const E=_.find(F=>F.group===M&&F.number===v);if(!E)throw Error(`Palette ${M},${v} does not exist`);const P=_[S.palette];if(P&&Math.ceil(Math.log2(P.colors))!==Math.ceil(Math.log2(E.colors)))return S;const C=ia(S.indices,m(E.index),"Palette depth does not match indexed sprite");return{...S,rgba:C}}function b(x,M=new Set){if(!Number.isInteger(x)||x<0||x>=d.length||M.has(x))throw Error("Invalid sprite link");M.add(x);const v=d[x];if(!v.length){const E=b(v.link,M);return E?{...E,...v,w:E.w,h:E.h,colors:m(v.palette)}:null}if(!v.w||!v.h||v.w*v.h>4e6)throw Error("Invalid SFF sprite dimensions");if(v.format>=10||![5,8].includes(v.depth))return null;const S=(v.flags&1?f:h)+v.offset;if(S+v.length>n.length||v.length<(v.format?4:0))throw Error("Truncated SFF sprite data");return{...v,indices:Ic(n.subarray(S+(v.format?4:0),S+v.length),v.w*v.h,v.format),colors:m(v.palette)}}return{sprites:d,decode:g,decodeIndexed:b,decodeWithPalette:y,paletteColors:(x,M)=>{const v=_.find(S=>S.group===x&&S.number===M);if(!v)throw Error(`Palette ${x},${M} does not exist`);return m(v.index).slice()},palettes:_,version:2,clearDecodedCache:()=>u.clear(),cacheStats:()=>({bytes:u.bytes,entries:u.size,evictions:u.evictions})}}function Sf(n,{externalPalettes:e=new Map,cacheBytes:t=16*1024*1024}={}){var S;const i=new DataView(n.buffer,n.byteOffset,n.byteLength),s=E=>i.getUint32(E,!0),r=E=>i.getUint16(E,!0),a=E=>i.getInt16(E,!0),o=[],l=[],c=[],h=new Set,f=s(20);let d=s(24),u=-1,p=-1;if(f>2e4)throw Error("SFF table too large");const _=E=>{const P=new Uint8Array(1024);for(let C=0;C<256;C++)P.set([E[C*3],E[C*3+1],E[C*3+2],C?255:0],C*4);return c.push(P),c.length-1};for(let E=0;E<f;E++){if(d<32||d+32>n.length||h.has(d))throw Error("Invalid SFF v1 sprite table link");h.add(d);const P=s(d+4),C={group:r(d+12),number:r(d+14),x:a(d+8),y:a(d+10),link:r(d+16),offset:d+32,length:P,shared:n[d+18],palette:u};if(C.offset+P>n.length)throw Error("Truncated SFF v1 sprite");if(P){const F=P>=897&&n[C.offset+P-769]===12;(!C.shared||u<0)&&F&&(C.palette=_(n.subarray(C.offset+P-768,C.offset+P))),C.palette<0&&e.has(1)&&(c.push(e.get(1)),C.palette=c.length-1),C.palette>=0&&p<0&&(p=C.palette),C.group===0&&C.number===0&&C.palette>=0&&(p=C.palette),u=C.palette}else C.palette=void 0;if(o.push(C),d=s(d),!d&&E+1<f)throw Error("Truncated SFF v1 sprite table")}const m=c[p];if(m)for(const E of o)E.palette>=0&&((S=c[E.palette])!=null&&S.every((P,C)=>P===m[C]))&&(E.palette=p);for(let E=0;E<c.length;E++)l.push({index:E,group:E===p?1:0,number:E===p?1:E+1,colors:256});for(const[E,P]of e){if(!(P instanceof Uint8Array)||P.length!==1024||!Number.isInteger(E)||E<1||E>256)throw Error("Invalid external SFF palette");if(E===1&&p>=0)c[p]=P;else{const C=c.length;c.push(P),l.push({index:C,group:1,number:E,colors:256})}}const g=new Mu({maxBytes:t,sizeOf:E=>{var P;return E.rgba.byteLength+(((P=E.indices)==null?void 0:P.byteLength)||0)}});function y(E,P){return{...E,rgba:ia(E.indices,P)}}function b(E,P=new Set,{allowTruncated:C=!1}={}){if(!C&&g.has(E))return g.get(E);if(!Number.isInteger(E)||E<0||E>=o.length||P.has(E))throw Error("Invalid SFF v1 sprite link");P.add(E);const F=o[E];if(!F.length){const ie=b(F.link,P,{allowTruncated:C});F.palette=ie.palette;const ae={...ie,...F,w:ie.w,h:ie.h};return C||g.set(E,ae),ae}const I=n.subarray(F.offset,F.offset+F.length);if(I.length<128||I[0]!==10||I[2]!==1||I[3]!==8||I[65]!==1)throw Error("Only indexed 8-bit PCX sprites are supported");const R=new DataView(I.buffer,I.byteOffset,I.byteLength),O=R.getUint16(8,!0)-R.getUint16(4,!0)+1,k=R.getUint16(10,!0)-R.getUint16(6,!0)+1,H=R.getUint16(66,!0);if(O<=0||k<=0||O*k>4e6||H*k>8e6||H<O)throw Error("Invalid PCX dimensions");const L=c[F.palette];if(!L)throw Error("PCX palette missing");const N=I.length>=897&&I[I.length-769]===12?I.length-769:I.length,W=new Uint8Array(H*k);let B=128,j=0;for(;j<W.length;){if(B>=N){if(C)break;throw Error("Truncated PCX")}let ie=I[B++],ae=1;if((ie&192)===192){if(ae=ie&63,B>=N){if(C)break;throw Error("Truncated PCX run")}ie=I[B++]}if(!ae||j+ae>W.length)throw Error("Invalid PCX run");W.fill(ie,j,j+ae),j+=ae}const re=new Uint8Array(O*k);for(let ie=0;ie<k;ie++)re.set(W.subarray(ie*H,ie*H+O),ie*O);const V=j<W.length,K=y({...F,w:O,h:k,indices:re,...V?{sourceIncomplete:!0,decodedPrefixPixels:j,totalSourcePixels:W.length}:{}},L);return C||g.set(E,K),K}function A(E,P,C){const F=b(E),I=l.find(R=>R.group===P&&R.number===C);if(!I)throw Error(`Palette ${P},${C} does not exist`);return y(F,c[I.index])}const x=(E,P)=>{const C=l.find(F=>F.group===E&&F.number===P);if(!C)throw Error(`Palette ${E},${P} does not exist`);return c[C.index].slice()},M=E=>{const P=b(E);return{...P,colors:c[P.palette]}};return{sprites:o,palettes:l,decode:b,decodeIndexed:M,decodeForDisplay:E=>{try{return M(E)}catch(P){if(P.message!=="Truncated PCX"&&P.message!=="Truncated PCX run")throw P;const C=b(E,new Set,{allowTruncated:!0});if(!C.sourceIncomplete)throw P;return{...C,colors:c[C.palette]}}},decodeWithPalette:A,paletteColors:x,version:1,clearDecodedCache:()=>g.clear(),cacheStats:()=>({bytes:g.bytes,entries:g.size,evictions:g.evictions})}}function Mf(n){if(!(n instanceof Uint8Array)||![768,772].includes(n.length))throw Error("ACT palette must contain 768 RGB bytes, with an optional 4-byte footer.");const e=new Uint8Array(1024);for(let t=0;t<256;t++){const i=(255-t)*3;e.set([n[i],n[i+1],n[i+2],t?255:0],t*4)}return e}const Wl=n=>String(n||"").replaceAll("\\","/").toLowerCase(),Is=n=>{var e;return((e=/^imports\/[^/]+\//.exec(Wl(n)))==null?void 0:e[0])??""},qa=n=>Wl(n).split("/").at(-1),Ya=(n,e=null,t=null)=>({animations:new Map,resource:null,soundPath:t,issues:n,paths:e,scale:1});function bf(n,{fightDef:e,character:t,stage:i,effectsPackage:s}={}){var h,f,d,u,p,_;const r=[],a=s?Is(s):null,o=Wl(e),l=a!==null?[a]:[...new Set([o?Is(o):null,Is(i)||null,Is(t)||null,""].filter(m=>m!==null))];let c=null;for(const m of l){const y=(o&&n[o]&&Is(o)===m?o:null)||[m+"data/fight.def",m+"fight.def"].find(R=>n[R]);let b=null;if(y)try{b=fr(Li(n[y]))}catch(R){r.push({type:"fightfx-config",message:y+": "+R.message})}const A=(y==null?void 0:y.slice(0,y.lastIndexOf("/")+1))||m+"data/",x=(R,O)=>{const k=[];if(R){for(const H of[A,m+"data/",m])try{k.push(on(R,H,!0))}catch{}qa(R)&&k.push(m+"data/"+qa(R),m+qa(R))}return k.push(m+"data/"+O,m+O),[...new Set(k)].find(H=>H.startsWith(m)&&n[H])||null},M=x((h=b==null?void 0:b.files)==null?void 0:h["fightfx.air"],"fightfx.air"),v=x((f=b==null?void 0:b.files)==null?void 0:f["fightfx.sff"],"fightfx.sff"),S=x((d=b==null?void 0:b.files)==null?void 0:d["common.snd"],"common.snd");if(!M&&!v)continue;if(!M||!v){c??(c={air:M,sff:v,snd:S,defPath:y,scope:m});continue}let E;try{E=Gl(Li(n[M]))}catch(R){return r.push({type:"fightfx-air",message:M+": "+R.message}),Ya(r,{air:M,sff:v,definition:y||null,scope:m},S)}const P=new Map(E.map(R=>[R.id,R])),C=Number(((u=b==null?void 0:b.fightfx)==null?void 0:u.scale)||1),F=Number(((_=(p=b==null?void 0:b.info)==null?void 0:p.localcoord)==null?void 0:_.split(",")[0])||320),I=Number.isFinite(C)&&C>0&&Number.isFinite(F)&&F>0?C*320/F:1;return{animations:P,resource:P.size?{files:n,sprite:{path:v}}:null,soundPath:S,paths:{air:M,sff:v,definition:y||null,scope:m},scale:I,issues:r}}return c?(r.push({type:"fightfx-missing",message:"The "+(c.scope||"root")+" effects pack is incomplete: AIR "+(c.air||"missing")+"; SFF "+(c.sff||"missing")+". Do not combine files from different packs."}),Ya(r,{air:c.air,sff:c.sff,definition:c.defPath,scope:c.scope},c.snd)):(a!==null&&r.push({type:"fightfx-missing",message:"Selected common-effects pack "+a+" contains no fightfx.air/fightfx.sff pair."}),Ya(r))}const Ka=new WeakMap;function na(n){let e=n,t=0;for(;e&&t++<256;){if(e.ownPal||e.ownpal)return e;const i=e.paletteParent||e.parent||e.owner;if(!i||i===e)return e;e=i}return e}const Xl=n=>new Map([...n||[]].map(([e,t])=>[e,[...t]]));function sa(n){const e={...n};for(const[t,i]of[["add",[0,0,0]],["mul",[256,256,256]],["sinadd",[0,0,0,0]]])if(e[t]!==void 0){const s=Array.isArray(e[t])?e[t]:[e[t]];e[t]=i.map((r,a)=>{const o=Math.trunc(Number(s[a]??r));return t==="mul"?Math.max(0,o):o})}return e.time!==void 0&&(e.time=Math.trunc(Number(e.time))),e.color!==void 0&&(e.color=Math.max(0,Math.min(256,Math.trunc(Number(e.color))))),e.invertall!==void 0&&(e.invertall=+!!e.invertall),e}function $l(n,e,t){const i=Array.isArray(t)?t:[t],s=[Math.trunc(Number(i[0]??-1)),Math.trunc(Number(i[1]??0))];if(s[0]!==-1){if(s[0]<0||s[1]<0)throw Error("Invalid RemapPal palette pair.");Pu(e,[-1,0],s),n.clear(),n.set("*",s)}}function Pu(n,e,t){var a,o;if(!((a=n.sprite)!=null&&a.path)||!((o=n.files)!=null&&o[n.sprite.path]))return;const i=Iu(n),s=l=>i.palettes.find(c=>c.group===l[0]&&c.number===l[1]),r=s(t);if(!r)throw Error(`RemapPal destination palette ${t.join(",")} does not exist.`);if(e[0]!==-1){const l=s(e);if(!l)throw Error(`RemapPal source palette ${e.join(",")} does not exist.`);if(l.colors&&r.colors&&Math.ceil(Math.log2(l.colors))!==Math.ceil(Math.log2(r.colors)))throw Error("RemapPal source and destination color depths differ.")}}function Iu(n){var o,l;if(Ka.has(n))return Ka.get(n);const e=[],t=new Map,i=n.files,s=n.path.slice(0,n.path.lastIndexOf("/")+1);for(const[c,h]of Object.entries(n.def.files||{}))if(/^pal\d+$/.test(c)&&h)try{const f=Number(c.slice(3));if(f<1||f>256)throw Error(`Invalid palette number ${f}.`);const d=(o=n.checks)==null?void 0:o.find(p=>p.key===c);let u;if(d)u=d.ok?d.path:null;else try{u=on(h,s,!0)}catch{u=null}if(!u||!i[u])throw Error(`Palette file is missing from the ZIP: ${h}`);t.set(f,Mf(i[u]))}catch(f){e.push({type:"palette",source:n.path,line:0,message:f.message})}const r=Ru(i[n.sprite.path],{externalPalettes:t});r.diagnostics=e,r.selectablePalettes=[...new Set((r.palettes||[]).filter(c=>c.group===1&&c.number>=1&&c.number<=12).map(c=>c.number))].sort((c,h)=>c-h),r.selectablePalettes.length||(r.selectablePalettes=[1]);const a=String(((l=n.def.info)==null?void 0:l["pal.defaults"])||"1").split(",").map(Number);return r.defaultPalette=a.find(c=>r.selectablePalettes.includes(c))??r.selectablePalettes[0],Ka.set(n,r),r}function wf(n,e){var c,h;const t=((c=n.world)==null?void 0:c.orderedPhases)&&n.isProjectile&&n.removalReason==="expire",i=n.hitDef||(t?n.proximityHitDef:null);if(n===e||n.destroyed||!i&&(!((h=n.world)!=null&&h.orderedPhases)||n.isProjectile)||n.moveType!=="A"||n.isProjectile&&((n.removed||n.removing)&&!(t&&n.drawVisible)||n.remainingHits<=0||n.owner===e||!/^[SCA]\s*,\s*[NSH][ATP]$/i.test(String(i.attr??"").trim())))return!1;const s=String((i==null?void 0:i.affectteam)??"E").trim().toUpperCase(),r=!!(n.world&&e.world&&n.teamSide===e.teamSide);if(s==="E"&&r||s==="F"&&!r)return!1;const a=(i==null?void 0:i.coordinateScale)??n.coordinateScale??1;let o;(i==null?void 0:i["guard.dist"])!==void 0?o=i["guard.dist"]*a:n.isProjectile?o=n.guardDistance:n.attackDist!==void 0?o=n.attackDist*n.coordinateScale:o=n.constant("size.attack.dist")*n.coordinateScale;const l=(e.pos.x-n.pos.x)*n.facing;return l>0&&l<o}function Lu(n,e){for(const t of e)if(wf(t,n))return!0;return!1}class vt extends Error{constructor(e,t=""){super(e),this.name="ExpressionError",this.source=t}}class bn extends vt{constructor(e,t=""){super(e,t),this.name="UnsupportedExpressionError"}}class Ot extends vt{constructor(e,t=""){super(e,t),this.name="BottomError",this.bottom=!0}}const Ho=8192,Lc=2048,Nc=96,Ef=8192,Wn=new Map,Tf={"||":1,"^^":2,"&&":3,"|":4,"^":5,"&":6,":=":7,"=":8,"!=":8,"<":9,">":9,"<=":9,">=":9,"+":10,"-":10,"*":11,"/":11,"%":11,"**":12},ra=new Set(["=","!=","<","<=",">",">="]),Af=new Set(["parent","root","helper","target","partner","enemy","enemynear","playerid","p2"]),Cf=new Set(["pos","vel","p2dist","p2bodydist","parentdist","rootdist","screenpos","hitvel","camerapos"]),Nu=new Set(["s","c","a","h","l","i","n","v","u"]),Rf=new Set(["const","gethitvar","stagevar","map","inputtime"]),Pf=new Set(["xveladd","yveladd","xoff","yoff","zoff","xvel","yvel","yaccel","fall.xvel","fall.yvel","fall.envshake.freq","fall.envshake.phase"]),If=/^(?:fvar|sysfvar|const240p|const480p|const720p|pos [xy]|vel [xy]|p2dist [xy]|p2bodydist [xy]|parentdist [xy]|rootdist [xy]|screenpos [xy]|hitvel [xy]|camerapos [xy]|camerazoom|gamewidth|gameheight|screenwidth|screenheight|leftedge|rightedge|topedge|bottomedge|(?:front|back)edge(?:body)?dist|frontedge|backedge)$/,Lf=n=>/^(?:velocity\.|movement\.(?!airjump\.)|size\.[xy]scale$|data\.fall\.defence_mul$)/.test(n),pa={abs:[1,Math.abs],ceil:[1,Math.ceil],floor:[1,Math.floor],exp:[1,Math.exp],ln:[1,Math.log],log:[2,(n,e)=>Math.log(e)/Math.log(n)],sin:[1,Math.sin],cos:[1,Math.cos],tan:[1,Math.tan],asin:[1,Math.asin],acos:[1,Math.acos],atan:[1,Math.atan],sqrt:[1,Math.sqrt],min:[2,Math.min],max:[2,Math.max]},Dc=new Set(["var","fvar","sysvar","sysfvar","animelemtime","animelemno","animexist","selfanimexist","const","const240p","const480p","const720p","gethitvar","stagevar","numprojid","playeridexist","projcanceltime","projcontacttime","projguardedtime","projhittime"]),Nf=new Set(["numhelper","numexplod","numtarget","ishelper"]),Df=new Set(["name","authorname","p1name","p2name","p3name","p4name"]),Ff=new Set("time stateno prevstateno anim animtime ctrl statetype movetype physics life lifemax power powermax facing alive gametime hitpausetime hitshakeover hitover movecontact movehit moveguarded movereversed hitcount uniqhitcount numenemy numpartner numproj roundstate roundno matchno teamside teampower tickspersecond ailevel palno id name authorname p1name p2name p3name p4name win lose drawgame inguarddist canrecover roundsexisted hitfall ishometeam teammode leftedge rightedge topedge bottomedge frontedge backedge frontedgedist backedgedist frontedgebodydist backedgebodydist gamewidth gameheight screenwidth screenheight camerazoom winko wintime winperfect loseko losetime loseperfect random pi e".split(" "));function Uf(n){if(typeof n!="string")throw new vt("Expression must be text.");if(n.length>Ho)throw new vt(`Expression exceeds ${Ho} characters.`);const e=[];let t=0;for(;t<n.length;){if(/\s/.test(n[t])){t++;continue}const i=t,s=n.slice(t);let r;if(n[t]==='"'){t++;let a="",o=!1;for(;t<n.length;){const l=n[t++];if(l==='"'){o=!0;break}l==="\\"&&n[t]==='"'?(a+='"',t++):a+=l}if(!o)throw new vt(`Unterminated string at ${i}.`,n);e.push({type:"string",value:a,position:i})}else if(r=s.match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/)){const a=Number(r[0]);if(!Number.isFinite(a))throw new vt(`Invalid number at ${i}.`,n);e.push({type:"number",value:a,float:/[.eE]/.test(r[0]),position:i}),t+=r[0].length}else if(r=s.match(/^[a-z_][a-z0-9_.]*/i))e.push({type:"name",value:r[0].toLowerCase(),position:i}),t+=r[0].length;else if(r=s.match(/^(?:\*\*|:=|<=|>=|!=|&&|\|\||\^\^|[+\-*/%!~&|^=<>()[\],])/))e.push({type:"operator",value:r[0],position:i}),t+=r[0].length;else throw new bn(`Unsupported token at ${i}: ${n[t]}`,n);if(e.length>Lc)throw new vt(`Expression exceeds ${Lc} tokens.`,n)}return e.push({type:"end",value:"",position:t}),e}let Of=class{constructor(e){this.source=e,this.tokens=Uf(e),this.index=0,this.depth=0}peek(e=0){return this.tokens[this.index+e]||this.tokens.at(-1)}take(){return this.tokens[this.index++]}accept(e){return this.peek().value!==e?!1:(this.index++,!0)}expect(e){this.accept(e)||this.fail(`Expected "${e}"`)}fail(e){throw new vt(`${e} at ${this.peek().position}.`,this.source)}signedInteger(){const e=this.accept("-")?-1:(this.accept("+"),1),t=this.take();return(t.type!=="number"||t.float)&&this.fail("Expected an integer literal"),{kind:"number",value:e*t.value,float:!1}}parse(e=0){++this.depth>Nc&&this.fail(`Expression nesting exceeds ${Nc}`);let t=this.prefix();for(;;){const i=this.peek().value,s=Tf[i];if(s===void 0||s<e)break;if(this.take(),(i==="="||i==="!=")&&(this.peek().value==="["||this.isOpenInterval())){const r=this.take().value,a=this.parse();this.expect(",");const o=this.parse(),l=this.take().value;l!=="]"&&l!==")"&&this.fail("Expected an interval endpoint"),t={kind:"range",op:i,left:t,low:a,high:o,includeLow:r==="[",includeHigh:l==="]"}}else{const r=this.parse(s+(i===":="?0:1));i===":="?((t.kind!=="call"||!["var","fvar"].includes(t.name)||t.args.length!==1)&&this.fail("Assignment requires var(index) or fvar(index)"),t={kind:"assign",left:t,right:r}):t={kind:"binary",op:i,left:t,right:r}}}return this.depth--,t}isOpenInterval(){if(this.peek().value!=="(")return!1;const e=this.index,t=this.depth;try{return this.prefix(),!1}catch{}finally{this.index=e,this.depth=t}let i=0;for(let s=this.index;s<this.tokens.length;s++){const r=this.tokens[s].value;if(r==="("||r==="[")i++;else if(r===")"||r==="]"){if(--i===0)return!1}else if(r===","&&i===1)return!0}return!1}prefix(){const e=this.take();if(e.type==="number")return{kind:"number",value:e.value,float:e.float};if(e.type==="string")return{kind:"string",value:e.value};if(["+","-","!","~"].includes(e.value))return{kind:"unary",op:e.value,value:this.parse(13)};if(e.value==="("){const r=this.parse();return this.expect(")"),r}e.type!=="name"&&this.fail("Expected a value");const t=e.value;if(Df.has(t)&&["=","!="].includes(this.peek().value)){const r=this.take().value,a=this.take();return a.type!=="string"&&this.fail(`${t} comparison requires a quoted name`),{kind:"binary",op:r,left:{kind:"name",name:t},right:{kind:"string",value:a.value}}}if(["statetype","movetype","p2statetype","p2movetype"].includes(t)&&["=","!="].includes(this.peek().value)&&this.peek(1).type==="name"&&Nu.has(this.peek(1).value)){const r=this.take().value,a=this.take().value;return{kind:"binary",op:r,left:{kind:"name",name:t},right:{kind:"string",value:a.toUpperCase()}}}if(t==="teammode"&&["=","!="].includes(this.peek().value)){const r=this.take().value,a=this.take();return(a.type!=="name"||!["single","simul","turns"].includes(a.value))&&this.fail("TeamMode requires Single, Simul or Turns"),{kind:"binary",op:r,left:{kind:"name",name:t},right:{kind:"string",value:a.value}}}const i=t.match(/^proj(hit|contact|guarded)(\d*)$/);if(i&&this.accept("=")){const r=this.signedInteger();[0,1].includes(r.value)||this.fail("Projectile condition requires 0 or 1");let a="=",o={kind:"number",value:1,float:!1};return this.accept(",")&&(ra.has(this.peek().value)&&(a=this.take().value),o=this.signedInteger()),{kind:"legacyprojectile",name:`proj${i[1]}time`,id:Number(i[2]||0),expected:r.value,op:a,time:o}}if(t==="command"&&["=","!="].includes(this.peek().value)){const r=this.take().value,a=this.take();return a.type!=="string"&&this.fail("Command comparison requires a quoted name"),{kind:"command",op:r,command:a.value}}if(t==="animelem"&&this.accept("=")){const r=this.signedInteger();let a="=",o={kind:"number",value:0,float:!1};return this.accept(",")&&(ra.has(this.peek().value)&&(a=this.take().value),o=this.signedInteger()),{kind:"legacyanim",element:r,op:a,time:o}}if(t==="timemod"&&ra.has(this.peek().value)){const r=this.take().value,a=this.signedInteger();return this.expect(","),{kind:"legacytime",op:r,divisor:a,remainder:this.signedInteger()}}if(["hitdefattr","reversaldefattr"].includes(t)&&["=","!="].includes(this.peek().value)){const r=this.take().value,a=this.take();(a.type!=="name"||!/^[sca]+$/.test(a.value))&&this.fail("HitDefAttr requires state letters S, C or A");const o=[a.value.toUpperCase()];this.expect(",");do{const l=this.take();(l.type!=="name"||!/^[nsha][atp]$/.test(l.value))&&this.fail("HitDefAttr requires attack attributes such as NA or ST"),o.push(l.value.toUpperCase())}while(this.peek().value===","&&this.peek(1).type==="name"&&/^[nsha][atp]$/.test(this.peek(1).value)&&this.accept(","));return{kind:"legacyattribute",name:t,op:r,attributes:o}}let s;if(this.accept("(")){const r=[];if(!this.accept(")")){do r.push(this.parse());while(this.accept(","));this.expect(")")}(Dc.has(t)||Nf.has(t))&&r.length!==1&&this.fail(`${t} requires one argument`),Ff.has(t)&&r.length&&this.fail(`${t} requires no arguments`);const a=Object.hasOwn(pa,t)?pa[t][0]:["cond","ifelse","fifelse"].includes(t)?3:null;a!==null&&r.length!==a&&this.fail(`${t} requires ${a} argument(s)`),s={kind:"call",name:t,args:r}}else{Dc.has(t)&&this.fail(`${t} requires a parameter list`);let r=t;Cf.has(t)&&this.peek().type==="name"&&/^[xy]$/.test(this.peek().value)&&(r+=" "+this.take().value),s={kind:"name",name:r}}return Af.has(t)&&this.accept(",")?{kind:"redirect",target:s,value:this.prefix()}:s}};function Zi(n){if(typeof n!="string"||n.length>Ho)throw new vt("Invalid or oversized argument list.");const e=[];let t=0,i=!1,s=!1,r=0;for(let a=0;a<n.length;a++){const o=n[a];if(o==='"'&&!s&&(i=!i),s=o==="\\"&&!s,!i)if(o==="("||o==="[")t++;else if(o===")"||o==="]"){if(--t<0)throw new vt("Unbalanced argument list.")}else o===","&&t===0&&(e.push(n.slice(r,a).trim()),r=a+1)}if(i||t)throw new vt("Unbalanced argument list.");return e.push(n.slice(r).trim()),e}function ql(n){const e=new Of(n),t=e.parse();e.peek().type!=="end"&&e.fail("Unexpected token");const i=s=>{for(const r of Object.values(s))Array.isArray(r)?(r.forEach(a=>a&&typeof a=="object"&&i(a)),Object.freeze(r)):r&&typeof r=="object"&&i(r);return Object.freeze(s)};return i(t)}function Du(n){if(Wn.has(n))return Wn.get(n);const e=ql(n),t=i=>kf(e,i||{},n);return Wn.size>=512&&Wn.delete(Wn.keys().next().value),Wn.set(n,t),t}function ma(n,e={}){return Du(n)(e)}function Vo(n,e={}){return Du(n)({...e,typedResult:!0})}const Zt=(n,e=!1)=>{if(typeof n!="number"||!Number.isFinite(n))throw new Ot("Expression produced a non-finite number.");const t=e?Math.fround(n):n|0;if(!Number.isFinite(t))throw new Ot("Expression produced a non-finite number.");return{value:t,float:e}},At=n=>Zt(n,!1);function qt(n){if(n.bottom)throw n.error;if(typeof n.value!="number")throw new Ot("A numeric value is required.");return n.value}function Ls(n){return qt(n)!==0}function xr(n,e,t){if(e.bottom||t.bottom)throw(e.bottom?e:t).error;if(e.absent||t.absent){if(!["=","!="].includes(n))throw new vt("Only equality comparisons are allowed for strings.");return At(+(n==="!="))}if(typeof e.value!=typeof t.value)throw new Ot("Cannot compare a string with a number.");if(typeof e.value=="string"&&!["=","!="].includes(n))throw new vt("Only equality comparisons are allowed for strings.");switch(typeof e.value=="number"&&(e.float||t.float)&&(e={value:Math.fround(e.value)},t={value:Math.fround(t.value)}),n){case"=":return At(+(e.value===t.value));case"!=":return At(+(e.value!==t.value));case"<":return At(+(e.value<t.value));case"<=":return At(+(e.value<=t.value));case">":return At(+(e.value>t.value));case">=":return At(+(e.value>=t.value))}}function kf(n,e,t){let i=0;const s=(a,o,l)=>{if(typeof e.resolve!="function")throw new bn(`Unsupported trigger: ${a}.`,t);const c=e.resolve(a,o,l);if(typeof c=="number")return Zt(c,If.test(a)||a==="gethitvar"&&Pf.has(String(o[0]).toLowerCase())||a==="const"&&Lf(String(o[0]).toLowerCase())||!Number.isInteger(c));if(typeof c=="boolean")return At(Number(c));if(typeof c=="string")return{value:c};if(c!=null&&c.absent)return{value:"",absent:!0};if(c&&typeof c.value=="number")return Zt(c.value,c.type==="float"||c.float);throw new bn(`Trigger ${a} returned no supported value.`,t)},r=(a,o=null)=>{var l,c,h;if(++i>Ef)throw new vt("Expression evaluation budget exceeded.",t);try{switch(a.kind){case"number":return Zt(a.value,a.float);case"string":return{value:a.value};case"name":return a.name==="pi"?Zt(Math.PI,!0):a.name==="e"?Zt(Math.E,!0):Nu.has(a.name)?{value:a.name.toUpperCase()}:s(a.name,[],o);case"unary":{const f=r(a.value,o),d=qt(f);if(a.op==="+")return f;if(a.op==="-")return Zt(-d,f.float);if(a.op==="!")return At(+(d===0));if(f.float)throw new Ot("Bitwise operators require integers.",t);return At(~d)}case"redirect":{const f=((l=a.target.args)==null?void 0:l.map(p=>qt(r(p))))||[],d={name:a.target.name,args:f};if(!o)return r(a.value,d);const u=(p,_)=>({...p,child:p.child?u(p.child,_):_});return r(a.value,u(o,d))}case"assign":{if(o)throw new vt("Variable assignment cannot be redirected.",t);if(typeof e.assign!="function")throw new bn("Variable assignment is unavailable.",t);const f=a.left.args.map(m=>qt(r(m))),d=r(a.right),u=qt(d),p=a.left.name==="var"?Math.trunc(u)|0:Math.fround(u),_=e.assign(a.left.name,f,p);return Zt(typeof _=="number"?_:p,a.left.name==="fvar")}case"range":{const f=[r(a.left,o),r(a.low,o),r(a.high,o)],d=f.some(g=>g.float),[u,p,_]=f.map(g=>d?Math.fround(qt(g)):qt(g)),m=(a.includeLow?u>=p:u>p)&&(a.includeHigh?u<=_:u<_);return At(Number(a.op==="="?m:!m))}case"legacyanim":return xr(a.op,s("animelemtime",[a.element.value],o),r(a.time,o));case"legacytime":{const f=a.divisor.value;if(f<=0)throw new vt("TimeMod divisor must be positive.",t);return xr(a.op,At(qt(s("time",[],o))%f),r(a.remainder,o))}case"legacyprojectile":{const f=s(a.name,[a.id],o),d=qt(f)>=0&&Ls(xr(a.op,f,r(a.time,o)));return At(Number(a.expected?d:!d))}case"legacyattribute":{const f=Ls(s(a.name||"hitdefattr",a.attributes,o));return At(Number(a.op==="="?f:!f))}case"command":{const f=Ls(s("command",[a.command],o));return At(Number(a.op==="="?f:!f))}case"call":{if(a.name==="cond"||a.name==="ifelse"||a.name==="fifelse"){if(a.args.length!==3)throw new vt(`${a.name} requires three arguments.`,t);const p=r(a.args[0],o);if(a.name==="cond")return r(a.args[Ls(p)?1:2],o);const _=[r(a.args[1],o),r(a.args[2],o)];for(const g of _)g.bottom&&((c=e.onWarning)==null||c.call(e,g.error));const m=Ls(p)?0:1;return a.name==="fifelse"?Zt(qt(_[m]),!0):_[m]}if(Object.hasOwn(pa,a.name)){const[p,_]=pa[a.name];if(a.args.length!==p)throw new vt(`${a.name} requires ${p} argument(s).`,t);const m=a.args.map(b=>r(b,o)),g=_(...m.map(b=>["abs","min","max"].includes(a.name)?qt(b):Math.fround(qt(b)))),y=!["ceil","floor"].includes(a.name)&&(a.name!=="abs"||m[0].float)&&(!["min","max"].includes(a.name)||m.some(b=>b.float));return Zt(g,y)}const f=a.args.map(p=>Rf.has(a.name)&&p.kind==="name"?{value:p.name}:r(p,o)),d=f.find(p=>p.bottom);if(d)throw d.error;const u=f.map(p=>p.value);return s(a.name,u,o)}case"binary":{const f=r(a.left,o),d=r(a.right,o);if(ra.has(a.op))return xr(a.op,f,d);const u=f.float||d.float,p=u?Math.fround(qt(f)):qt(f),_=u?Math.fround(qt(d)):qt(d);switch(a.op){case"+":return Zt(p+_,u);case"-":return Zt(p-_,u);case"*":return Zt(u?p*_:Math.imul(p,_),u);case"/":if(_===0)throw new Ot("Division by zero.",t);return Zt(u?p/_:Math.trunc(p/_),u);case"%":if(u||_===0)throw new Ot("Remainder requires integers and a nonzero divisor.",t);return At(p%_);case"**":{const m=u||p<0||_<0;let g=p**_;return!m&&g>2147483647&&(g=2147483647,(h=e.onWarning)==null||h.call(e,new vt("Integer exponent overflow.",t))),Zt(g,m)}case"&&":return At(+(p!==0&&_!==0));case"||":return At(+(p!==0||_!==0));case"^^":return At(+(p!==0!=(_!==0)));case"&":case"|":case"^":if(u)throw new Ot("Bitwise operators require integers.",t);return At(a.op==="&"?p&_:a.op==="|"?p|_:p^_);default:throw new bn(`Unsupported operator ${a.op}.`,t)}}default:throw new vt("Invalid compiled expression.",t)}}catch(f){if(f!=null&&f.bottom)return{bottom:!0,error:f};throw f}};try{const a=r(n);if(a.bottom)throw a.error;return e.typedResult?a:a.value}catch(a){throw a instanceof vt?(a.source||(a.source=t),a):a!=null&&a.bottom?new Ot(a.message||"Expression evaluated to bottom.",t):new vt((a==null?void 0:a.message)||"Trigger evaluation failed.",t)}}function Fu(n,e={},t=!1){var p,_,m,g;const i=n.coordinateScale||1,[s=0,r=0]=e[t?"offset":"pos"]||[0,0],a=String(e.postype||"p1").toLowerCase(),o=((p=n.world)==null?void 0:p.view.left)??((_=n.world)==null?void 0:_.leftBound)??-160,l=((m=n.world)==null?void 0:m.view.right)??((g=n.world)==null?void 0:g.rightBound)??160,c=n.opponent||n;let h=n.pos.x,f=n.pos.y,d=n.facing,u=n.facing;if(a==="p2")h=c.pos.x,f=c.pos.y,t||(d=u=c.facing);else if(a==="front")h=n.facing>0?l:o;else if(a==="back")h=n.facing>0?o:l,t||(d=n.facing);else if(a==="left"||a==="right")h=a==="left"?o:l,t||(d=u=1);else if(a!=="p1")throw Error(`Unsupported spawn postype: ${a}`);return{pos:{x:h+Number(s)*i*d,y:f+Number(r)*i},facing:u*(Number(e.facing??1)<0?-1:1)}}const Uu=8192;function Ou(n){if(!/^"[\s\S]*"$/.test(n))throw Error("Text must be enclosed in double quotes.");if(n.length>Uu)throw Error("Debug text exceeds 8192 characters.");return n.slice(1,-1).replace(/\\([\s\S])/g,(e,t)=>{if(t==="n")return`
`;if(t==="t")return"    ";if(t==="\\"||t==='"')return t;throw Error(`Unsupported text escape \\${t}.`)})}function Bf(n){const e=Ou(n),t=[];let i=0,s=0;for(let r=0;r<e.length;r++)if(e[r]==="%"){if(t.push(e.slice(i,r)),e[r+1]==="%"){t.push("%"),r++,i=r+1;continue}const a=/^%([-+ #0]*)(\d*)(?:\.(\d*))?([difFeEgG])/.exec(e.slice(r));if(!a)throw Error("Unsupported clipboard format specifier.");const o=Number(a[2]||0),l=a[3]===void 0?void 0:Number(a[3]||0);if(o>512||l>20)throw Error("Clipboard format width or precision exceeds supported bounds.");t.push({flags:a[1],width:o,precision:l,spec:a[4]}),s++,r+=a[0].length-1,i=r+1}if(t.push(e.slice(i)),s>6)throw Error("Clipboard format accepts at most 6 numeric parameters.");return{parts:t,count:s}}function zf({flags:n,width:e,precision:t,spec:i},{value:s,float:r}){if(typeof s!="number"||!Number.isFinite(s))throw Error("Clipboard parameters must be finite numbers.");r===void 0&&(r=!Number.isInteger(s)),/[di]/.test(i)===!!r&&(i=r?"f":"d",n="",e=0,t=void 0);const a=s<0||Object.is(s,-0),o=Math.abs(s);let l;if(/[di]/.test(i))l=t===0&&o===0?"":Math.trunc(o).toString().padStart(t??0,"0");else if(/[fF]/.test(i))l=o.toFixed(t??6);else if(/[eE]/.test(i))l=o.toExponential(t??6);else{const h=Math.max(1,t??6),f=Number(o.toPrecision(h)),d=f?Math.floor(Math.log10(f)):0;l=d<-4||d>=h?o.toExponential(h-1):o.toFixed(Math.max(0,h-d-1)),n.includes("#")||(l=l.replace(/(\.\d*?[1-9])0+(?=e|$)/,"$1").replace(/\.0*(?=e|$)/,""))}n.includes("#")&&!l.includes(".")&&(l=l.replace(/e|$/i,"."+(l.includes("e")?"e":""))),l=l.replace(/e([+-])(\d+)$/i,(h,f,d)=>"e"+f+d.padStart(2,"0")),/[FEG]/.test(i)&&(l=l.toUpperCase());const c=a?"-":n.includes("+")?"+":n.includes(" ")?" ":"";return n.includes("0")&&!n.includes("-")&&(t===void 0||!/[di]/.test(i))?c+l.padStart(Math.max(0,e-c.length),"0"):(l=c+l,n.includes("-")?l.padEnd(e):l.padStart(e))}function Hf(n,e){if(e.length!==n.count)throw Error(`Clipboard format requires ${n.count} parameters, received ${e.length}.`);let t=0;const i=n.parts.map(s=>typeof s=="string"?s:zf(s,e[t++])).join("");if(i.length>Uu)throw Error("Formatted clipboard exceeds 8192 characters.");return i}const ja=n=>{if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(String(n).trim()))throw Error("ForceFeedback parameters require numeric constants.");const e=Number(n);if(!Number.isFinite(e))throw Error("ForceFeedback requires finite constants.");return e};function Vf(n){const e=String(n.waveform??"sine").replace(/^"(.*)"$/,"$1").toLowerCase();if(!["sine","square","sinesquare","off"].includes(e))throw Error(`Invalid ForceFeedback waveform ${e}.`);const t=ja(n.time??60),i=ja(n.self??1);if(!Number.isInteger(t)||t<0||t>36e4||![0,1].includes(i))throw Error("Invalid ForceFeedback time or self parameter.");const s={waveform:e,time:t,self:i};for(const r of["freq","ampl"]){const a=String(n[r]??"128").split(",").map(ja);if(a.length>4||!Number.isInteger(a[0]))throw Error(`Invalid ForceFeedback ${r} coefficients.`);s[r]=Array.from({length:4},(o,l)=>a[l]??0)}return s}const ds=(n,e=[0,0])=>n===void 0?[...e]:Array.isArray(n)?[n[0]??e[0],n[1]??e[1]]:[n,e[1]],ga=n=>n<0?-1:1,en=n=>Math.trunc(Number(n)),Go=n=>/^\s*f(?=\s|[\d(+.-])/i.test(n||""),Gf=n=>n.ontop?1e3:n.under?-1e3:n.sprpriority||0,Wf=new Set(["anim","id","space","pos","facing","vfacing","bindid","bindtime","vel","velocity","accel","removetime","supermovetime","pausemovetime","scale","angle","xangle","yangle","sprpriority","under","ontop","shadow","ownpal","remappal","removeongethit","ignorehitpause","trans","alpha","postype","random","supermove"]);function Xf(n,e,t,i=!1){const s=t.ownpal===void 0?i?e.common:e.ownpal:!!t.ownpal;if(s&&(i||!e.ownpal)&&(e.paletteRemaps=e.common?new Map:Xl(n.paletteRemaps),n.events.push({type:"palettesnapshot",target:e,common:e.common})),s||(e.paletteRemaps=null,e.paletteSnapshot=null),e.ownpal=s,s&&!e.common&&t.remappal!==void 0)try{$l(e.paletteRemaps,n.character,t.remappal)}catch(r){n.diagnostic("palette",r.message)}}function $f(n,e,t,i){var h,f,d,u,p,_;const s=e.config,r=((h=n.world)==null?void 0:h.view)||{displayHeight:240};if(i||t.random!==void 0){const m=ds(s.random);e.randomOffset=m.map(g=>g>0?Math.floor(n.resolveTrigger("random")/1e3*g)-Math.floor(g/2):0)}const a=ds(s.pos).map((m,g)=>(m+e.randomOffset[g])*n.coordinateScale);e.bindOffset=a,e.relativeFacing=ga(s.facing??1),e.vfacing=ga(s.vfacing??1);const o=s.space!==void 0||s.bindid!==void 0,l=/^1\.(\d+)/.exec(((d=(f=n.character.def)==null?void 0:f.info)==null?void 0:d.mugenversion)||"");if(e.postype=o?null:String(s.postype??(l&&Number(l[1])>=1?"none":"p1")).toLowerCase(),e.bindID=en(s.bindid??-2),e.bindingTarget=null,o){if(e.space=String(s.space||"stage").toLowerCase(),!["stage","screen"].includes(e.space))throw Error(`Unsupported Explod space ${e.space}.`);if(e.space==="screen"&&e.bindID!==-2)throw Error("Screen-space Explods cannot be bound.");if(e.bindID!==-2&&s.bindtime===void 0)throw Error("Explod bindID requires bindtime.");e.pos={x:a[0],y:a[1]},e.facing=e.relativeFacing}else if(["p1","p2"].includes(e.postype))e.space="stage",e.bindingTarget=e.postype==="p2"?n.opponent:n,e.pos={x:((u=e.bindingTarget)==null?void 0:u.pos.x)??n.pos.x,y:((p=e.bindingTarget)==null?void 0:p.pos.y)??n.pos.y},e.facing=e.relativeFacing*(((_=e.bindingTarget)==null?void 0:_.facing)??n.facing);else if(["front","back","left","right"].includes(e.postype)){e.space="screen";const m=e.postype==="right"||e.postype==="front"&&n.facing>0||e.postype==="back"&&n.facing<0,g=e.postype==="back"?n.facing:1;e.pos={x:(m?320:0)+a[0]*g,y:a[1]},e.facing=e.relativeFacing*g}else if(e.postype==="none")e.space="stage",e.pos={x:a[0],y:a[1]},e.facing=e.relativeFacing;else throw Error(`Unsupported Explod postype ${e.postype}.`);const c=e.postype==="p1"||e.postype==="p2"||e.bindID!==-2;if(e.bindtime=e.space==="stage"&&c?en(s.bindtime??1):0,e.initialBinding=c,e.positioned=!e.initialBinding,!Number.isFinite(r.displayHeight))throw Error("Invalid Explod viewport.")}function Fc(n,e,t,i,s){var r,a;for(const o of["angle","xangle","yangle"])if(t[o]!==void 0&&(typeof t[o]!="number"||!Number.isFinite(t[o])))throw Error(`Explod ${o} must be a finite number.`);if(e.config={...e.config,...t},t.anim!==void 0||i){const o=t.anim===void 0?e.common:Go(s.values.anim),l=en(t.anim??e.anim),c=o?n.commonAnimations:n.animations;if(!c.has(l)||!((r=c.get(l).frames)!=null&&r.length))throw Error(`Explod ${o?"common ":""}animation ${l} does not exist or has no frames.`);e.anim=l,e.common=o,e.animation=c.get(l),e.frameIndex=0,e.frameTime=0}for(const o of["removetime","supermovetime","pausemovetime","sprpriority","under","angle","xangle","yangle","ontop","shadow","removeongethit","ignorehitpause","supermove"])t[o]!==void 0&&(e[o]=t[o]);for(const o of["removetime","supermovetime","pausemovetime","sprpriority"])e[o]=en(e[o]??0);if(e.removetime<-2||en(e.config.bindtime??0)<-1)throw Error("Invalid Explod removal or binding time.");t.under!==void 0&&(e.under=+!!Number(t.under)),t.scale!==void 0&&(e.scale=ds(t.scale,[1,1])),(t.trans!==void 0||t.alpha!==void 0)&&(e.trans={mode:String(e.config.trans||"default").toLowerCase(),alpha:ds(e.config.alpha,[256,0])}),(t.vel!==void 0||t.velocity!==void 0||i)&&(e.velocity=ds(e.config.vel??e.config.velocity).map(o=>o*n.coordinateScale)),(t.accel!==void 0||i)&&(e.accel=ds(e.config.accel).map(o=>o*n.coordinateScale)),Xf(n,e,t,i),i||["space","postype","pos","bindid","random"].some(o=>t[o]!==void 0)?$f(n,e,t,i):(t.facing!==void 0&&(e.relativeFacing=ga(t.facing),e.facing=e.relativeFacing*(((a=e.bindingTarget)==null?void 0:a.facing)??(e.postype==="back"?n.facing:1))),t.vfacing!==void 0&&(e.vfacing=ga(t.vfacing)),t.bindtime!==void 0&&(e.bindtime=en(t.bindtime)))}function qf(n,e){var o;const t=en(n.value(e,"id",-1)),i=n.explods.filter(l=>t===-1||l.id===t);if(e.type==="removeexplod"){n.explods=n.explods.filter(l=>!i.includes(l)),n.drawExplods=n.drawExplods.filter(l=>t!==-1&&l.id!==t);return}if(e.type==="explodbindtime"){const l=en(n.value(e,e.values.time===void 0?"value":"time",1));if(l<-1)throw Error("ExplodBindTime must be -1 or greater.");for(const c of i)c.bindtime=l;return}const s=Go(e.values.anim)?e.entries.map(l=>l.key==="anim"?{...l,value:l.value.replace(/^\s*f\s*/i,"")}:l):e.entries,r=n.effectParameters({...e,entries:s});if(e.values.ignorehitpause!==void 0&&(r.ignorehitpause=n.value(e,"ignorehitpause",1)),r.anim!==void 0){const l=Go(e.values.anim),c=en(r.anim),h=l?n.commonAnimations:n.animations;if(!h.has(c)||!((o=h.get(c).frames)!=null&&o.length)){n.diagnostic("missing-animation",`Explod ${l?"F":""}${c} has no original AIR frames.`,e);return}}for(const l of Object.keys(r))Wf.has(l)||n.diagnostic("unsupported-explod-parameter",`Explod parameter ${l} is not implemented.`,e);for(const l of["pos","vel","velocity","accel","scale","random","remappal","alpha"])if(Array.isArray(r[l])&&r[l].length>2)throw Error(`Explod ${l} takes at most two components.`);if(e.type==="modifyexplod"){for(const l of i){const c=n.events.length,h={...l,config:{...l.config},paletteRemaps:l.paletteRemaps?new Map(l.paletteRemaps):null};try{Fc(n,h,r,!1,e)}catch(f){throw n.events.length=c,f}Object.assign(l,h);for(const f of n.events.slice(c))f.target===h&&(f.target=l)}return}if(e.values.anim===void 0)throw Error("Explod requires anim.");if(n.explods.length>=512){n.diagnostic("resource-limit","Explod limit (512 per entity) reached.",e);return}const a={owner:n,creator:n,id:t,coordinateScale:n.coordinateScale,time:0,frameIndex:0,frameTime:0,config:{},removetime:-2,bindtime:0,ignorehitpause:1,supermovetime:0,pausemovetime:0,scale:[1,1],angle:0,xangle:0,yangle:0,vfacing:1};Fc(n,a,r,!0,e),n.explods.push(a)}function Uc(n,e,t){if(!(e!=null&&e.remaining)||(n[t]!==e&&(n[t]=e,n[t+"Moved"]=0),t==="superPause"&&n.supermove))return!0;const i=t==="superPause"?"supermovetime":"pausemovetime";return n[t+"Moved"]>=Math.max(0,n[i]||0)?!1:(n[t+"Moved"]++,!0)}function Yf(n,e){for(const t of n.explods)!(t.bindingTarget===e||!t.bindingTarget&&(t.postype==="p1"&&n===e||t.postype==="p2"&&n.opponent===e||t.bindID===e.id||t.bindID===-1&&n.root===e))||!t.initialBinding&&t.bindtime===0||((t.initialBinding||!t.positioned)&&(t.pos={x:e.pos.x+t.bindOffset[0]*e.facing,y:e.pos.y+t.bindOffset[1]},t.facing=t.relativeFacing*e.facing),t.bindingTarget=null,t.bindtime=0,t.initialBinding=!1,t.positioned=!0)}function Kf(n,{hitPaused:e=!1,pause:t=null,superPause:i=null,forceFrozen:s=!1}={}){var a,o;const r=[];for(const l of n.explods){if(l.removetime===0||l.pendingRemoval&&!(i!=null&&i.remaining)){l.removed=!0;continue}!l.bindingTarget&&(l.bindtime||l.initialBinding)&&(l.postype==="p2"?l.bindingTarget=n.opponent:l.postype==="p1"?l.bindingTarget=n:l.bindID!==-2&&(l.bindingTarget=l.bindID===-1?n.root:l.bindID===n.id?n:(a=n.world)==null?void 0:a.findPlayer(l.bindID))),(o=l.bindingTarget)!=null&&o.destroyed&&(l.bindingTarget=null,l.bindtime=0,l.initialBinding=!1);const c=l.space==="stage"&&!!l.bindingTarget&&(l.initialBinding||l.bindtime!==0);if(l.initialBinding&&!l.bindingTarget){n.diagnostic("missing-player",`Explod binding player ${l.bindID} is unavailable.`),l.removed=!0;continue}let h=s||e&&!l.ignorehitpause;if(h||(h=i!=null&&i.remaining?!Uc(l,i,"superPause"):!Uc(l,t,"pause")),c?(l.facing=l.relativeFacing*l.bindingTarget.facing,l.pos={x:l.bindingTarget.pos.x+l.bindOffset[0]*l.bindingTarget.facing,y:l.bindingTarget.pos.y+l.bindOffset[1]},l.positioned=!0):!h&&l.time>0&&(l.pos.x+=l.velocity[0]*l.facing,l.pos.y+=l.velocity[1]),r.push({...l,pos:{...l.pos},source:l}),h)continue;l.time>0&&(l.velocity[0]+=l.accel[0],l.velocity[1]+=l.accel[1]),l.initialBinding=!1,l.bindtime>0&&l.bindtime--;const f=l.animation.frames[l.frameIndex];f&&f.ticks>=0&&++l.frameTime>=Math.max(1,f.ticks)&&(l.frameTime=0,++l.frameIndex>=l.animation.frames.length&&(l.removetime===-2&&(l.removed=!0),l.frameIndex=l.animation.loopStart||0)),l.time++,l.removetime>0&&l.time>=l.removetime&&(l.removed=!0),l.removed&&l.supermove&&(i!=null&&i.remaining)&&(l.removed=!1,l.pendingRemoval=!0)}n.drawExplods=r,n.explods=n.explods.filter(l=>!l.removed)}const Xn=new Map,jf=["N","S","H"];function Js(n){const e=String(n??"").toUpperCase().replace(/\s/g,"");if(Xn.has(e))return Xn.get(e);const[t,...i]=e.split(",");if(!/^[SCA]*$/.test(t))throw Error(`Invalid hit attribute states: ${t}`);const s=new Set;for(const a of i)if(a){if(!/^[NSHA][ATP]$/.test(a))throw Error(`Invalid hit attack attribute: ${a}`);for(const o of a[0]==="A"?jf:[a[0]])s.add(o+a[1])}const r={states:new Set(t),attacks:s};return Xn.size>=512&&Xn.delete(Xn.keys().next().value),Xn.set(e,r),r}function ku(n,e){const t=typeof n=="string"?Js(n):n,i=typeof e=="string"?Js(e):e;return{state:[...i.states].some(s=>t.states.has(s)),attack:[...i.attacks].some(s=>t.attacks.has(s))}}function Za(n,e){const t=ku(n,e);return t.state&&t.attack}function Zf(n,e){const t=ku(n.attribute,e);return n.exclude?!t.state&&!t.attack:t.state&&t.attack}function Ut(n){var t,i,s;if((n==null?void 0:n.baseCoordinateScale)>0)return n.baseCoordinateScale;const e=Number(String(((s=(i=(t=n==null?void 0:n.character)==null?void 0:t.def)==null?void 0:i.info)==null?void 0:s.localcoord)||"320,240").split(",")[0]);return e>0?320/e:1}function aa(n,e,{edge:t=!1}={}){var o,l,c,h,f,d;const i=n.facing===e,s=i?"front":"back",r=t?(l=(o=n.width)==null?void 0:o.edge)==null?void 0:l[i?0:1]:(c=n.width)==null?void 0:c[s],a=((f=(h=n.program)==null?void 0:h.constants)==null?void 0:f.get(`size.${n.stateType==="A"?"air":"ground"}.${s}`))??15;if(r!==void 0){const u=(Number(r)||0)*(n.coordinateScale||Ut(n));return Math.max(0,u+((d=n.world)!=null&&d.orderedPhases?Math.max(0,Number(a)||0)*Ut(n):0))}return Math.max(0,Number(a)||0)*Ut(n)}function Jf(n,e,{body:t=!1,scale:i=n.coordinateScale}={}){var o,l,c,h;const s=(o=n.world)==null?void 0:o.view,r=e>0?(s==null?void 0:s.right)??((l=n.options)==null?void 0:l.rightBound)??160:(s==null?void 0:s.left)??((c=n.options)==null?void 0:c.leftBound)??-160;let a=e>0?r-n.pos.x:n.pos.x-r;if(t){const f=n.width??n._previousWidth,d=Number((h=f==null?void 0:f.edge)==null?void 0:h[n.facing===e?0:1])||0;a-=d*n.coordinateScale+(n.stateType==="A"?.5:0)}return Math.trunc(a/i)}function Oc(n){return n.startsWith("velocity.")?!/\.mul(?:\.|$)/.test(n):n.startsWith("size.")?!["size.xscale","size.yscale","size.proj.doscale"].includes(n):n.startsWith("movement.")&&!/(?:\.friction$|\.num$|\.time$|\.mul(?:\.|$))/.test(n)}const Bu=new Set(["xoff","yoff","zoff","xvel","yvel","xveladd","yveladd","yaccel","fall.xvel","fall.yvel","fall.envshake.ampl"]);function Qf(n,e){const t=n.coordinateScale,i=t/e;if(n.coordinateScale=e,i!==1){for(const s of Bu)typeof n.getHitVars[s]=="number"&&(n.getHitVars[s]*=i);if(n.width){for(const s of["front","back"])typeof n.width[s]=="number"&&(n.width[s]*=i);n.width.edge&&(n.width.edge=n.width.edge.map(s=>s*i))}n.attackDist!==void 0&&(n.attackDist*=i)}}function zu(n){return n.collisionFrame?n.collisionAnimationOwner||n.animationOwner||n:n.animationOwner||n}const Wo=n=>{var e;return n!=null&&n.isProjectile?(e=n.owner)==null?void 0:e.id:n==null?void 0:n.id},Hu=(n,e)=>!(e!=null&&e.isProjectile)&&(n.hitonce===void 0?/^[SCA]\s*,\s*[NSH]T$/i.test(n.attr||""):Number(n.hitonce)!==0);function ep(n,e,t){const i=n.hitId??-1,s=e.chainid??-1;if(s>=0&&i!==s)return!1;const r=Array.isArray(e.nochainid)?e.nochainid:[e.nochainid??-1];return!(n.hitSourceId===Wo(t)&&Wo(t)!==void 0&&r.some(a=>a>=0&&a===i&&a!==s))}function tp(n,e,t){var i;return ep(n,e,t)&&!(Hu(e,t)&&((i=t==null?void 0:t._spentHitDefs)!=null&&i.has(e)))}function ip(n,e,t){!t||!Hu(e,t)||(t._spentHitDefs??(t._spentHitDefs=new WeakSet),t._spentHitDefs.add(e),t.targets.splice(0,t.targets.length,n),t.targetHitIds.clear())}function kc(n,e,t,{count:i=!0}={}){var r,a;if(!n||(n.moveContact=1,n.moveHit=t?0:1,n.moveGuarded=t?1:0,n.moveReversed=0,t||!i||(r=n.world)!=null&&r.orderedPhases&&e.numhits===0))return;const s=((a=n.world)==null?void 0:a.ticks)??n.gameTime??0;n._lastHitCountTick!==s&&(n.hitCount=(n.hitCount||0)+1,n._lastHitCountTick=s),n.uniqHitCount=(n.uniqHitCount||0)+1}const np=new Set(["xveladd","yveladd","type","animtype","airtype","groundtype","damage","hitcount","fallcount","hitshaketime","hittime","slidetime","ctrltime","recovertime","xoff","yoff","zoff","xvel","yvel","yaccel","hitid","chainid","guarded","isbound","fall","fall.damage","fall.xvel","fall.yvel","fall.recover","fall.time","fall.recovertime","fall.kill","fall.envshake.time","fall.envshake.freq","fall.envshake.ampl","fall.envshake.phase"]);function sp(n){var e;return{type:0,hitid:-1,chainid:0,hitcount:0,fallcount:0,hittime:-1,recovertime:n.constant("data.liedown.time"),xveladd:0,yveladd:0,zoff:0,fall:0,"fall.time":0,"fall.recover":(e=n.world)!=null&&e.orderedPhases?0:1,"fall.recovertime":4}}const Bc=new Set(["a","b","c","x","y","z","s","U","D","L","R"]);function rp(n,e,t){const i=e===null?new Set([...t].filter(s=>Bc.has(s))):new Set([...e].filter(s=>Bc.has(s)));if(e===null)for(const[s,r]of[["holdup","U"],["holddown","D"],["holdfwd",n.facing<0?"L":"R"],["holdback",n.facing<0?"R":"L"]])t.has(s)&&i.add(r);n._recoveryPressed=[...i].some(s=>!n._previousInput.has(s)),n._previousInput=i,n.rawInput=i}function zc(n,{hitPaused:e=!1}={}){var i;const t=n.getHitVars;if(n.moveType==="H"){if(t.fall&&(t["fall.time"]=(t["fall.time"]||0)+1),e||(n.hitTime>=0&&n.hitTime--,[5070,5100].includes(n.stateNo)&&n._fallEntry!==n._entrySerial&&(t.fallcount=(t.fallcount||0)+1,n._fallEntry=n._entrySerial,n._fallDefenceMultiplier*=n.constant("data.fall.defence_mul")),n.stateNo===5110&&(t.recovertime=Math.max(0,(t.recovertime??n.constant("data.liedown.time"))-1))),n._recoveryPressed&&n.alive&&(n.stateType==="L"||t.fallcount>0)&&t.recovertime>0){const s=Math.max(1,Math.ceil(t.recovertime/2));t.recovertime=Math.max(0,t.recovertime-1-Math.floor(n.resolveTrigger("random")/1e3*s))}}else n.comboHits=0,n.hitTime=-1,n.hitId=n.hitId<0?-1:0,n.hitSourceId=void 0,t.fall=0,t.fallcount=0,(i=n.world)!=null&&i.orderedPhases||(t["fall.time"]=0),t["fall.envshake.time"]=0,n._fallDefenceMultiplier=1,t.recovertime=n.constant("data.liedown.time");t.hittime=n.hitTime,t.hitid=n.hitId,t.chainid=Math.max(0,n.hitId)}const Vu=Object.freeze({attackLifeToPower:.7,getHitLifeToPower:.6,superTargetDefence:1.5});function ap(n={},e={}){const t=Object.keys(n).find(r=>/(?:^|\/)data\/mugen\.cfg$/i.test(r)),i=t?fr(Li(n[t])).rules||{}:{},s={...Vu};for(const[r,a]of[["attackLifeToPower","default.attack.lifetopowermul"],["getHitLifeToPower","default.gethit.lifetopowermul"],["superTargetDefence","super.targetdefencemul"]]){const o=Number(e[r]??i[a]??s[r]);if(!Number.isFinite(o)||o<0)throw Error(`Invalid combat rule ${a}.`);s[r]=o}return s}function yr(n,e,t,{absolute:i=!1}={}){let s=Number(n);if(!Number.isFinite(s))throw Error("Damage must be finite.");if(!i){const r=e?Math.max(0,e.constant("data.attack")/100*(e.attackMultiplier??1)):1,a=Math.max(.01,t.constant("data.defence")/100);s*=r*Math.max(0,t.defenceMultiplier??1)*Math.max(0,t._fallDefenceMultiplier??1)/a}return s>0?Math.max(1,Math.round(s)):Math.round(s)}function op(n,e=Vu){var s;const t=Math.max(0,Math.trunc(((s=n.damage)==null?void 0:s[0])||0)),i=(r,a)=>{const o=Array.isArray(r)?r:r===void 0?[Math.trunc(Math.fround(Math.fround(t)*Math.fround(a)))]:[r],l=Math.trunc(o[0]||0);return[l,Math.trunc(o[1]??l/2)]};return{get:i(n.getpower,e.attackLifeToPower),give:i(n.givepower,e.getHitLifeToPower)}}function lp(n,e,t,i=1){const s=n,r=e;return t!=="L"&&(t!=="A"&&e===0&&(n*=.66),n&&(n+=Math.sign(n)*2.5/i),e<=0&&(e=Math.min(e-2/i,(t==="A"?-3:-6)/i))),{x:n,y:e,xadd:n-s,yadd:e-r}}const Hc=new WeakMap;function sr(n){const e=n==null?void 0:n.frames;if(!(e!=null&&e.length))return null;let t=Hc.get(n);if((t==null?void 0:t.frames)===e&&t.length===e.length)return t;const i=new Float64Array(e.length+1),s=new Float64Array(e.length+1);for(let a=0;a<e.length;a++)i[a+1]=i[a]+Math.max(1,e[a].ticks),s[a+1]=s[a]+(e[a].ticks<0?1/0:Math.max(1,e[a].ticks));const r=n.loopStart??n.loopstart??0;return t={frames:e,length:e.length,offsets:i,lookupOffsets:s,duration:s[e.length],loopStart:r,intro:s[r]},Hc.set(n,t),t}function Xo(n){const e=new Error(n);throw e.bottom=!0,e}function cp(n,e,t){const i=sr(n),s=t-1;return(!i||s<0||s>=i.length)&&Xo(`Animation element out of range: ${t}`),e.animationTime-i.offsets[s]}function hp(n,e,t=0){const i=sr(n);i||Xo("Animation has no elements");let s=e.animationCycleTime+t;if(Number.isFinite(i.duration)&&(e.animationLooped||e.frameIndex>=i.loopStart||s>=i.duration)){const o=i.duration-i.intro;s=i.intro+((s-i.intro)%o+o)%o}else s<0&&Xo("Animation offset precedes its start");let r=0,a=i.length;for(;r<a;){const o=r+a>>>1;s<i.lookupOffsets[o+1]?a=o:r=o+1}return r<i.length?r+1:void 0}function up(n,e){const t=sr(n);return!t||e.animationEnded?0:Number.isFinite(t.duration)?e.animationCycleTime-t.duration:-1}function Ja(n){return{anim:n.anim,animationOwner:n.animationOwner,frameIndex:n.frameIndex,frameTime:n.frameTime,animationTime:n.animationTime,animationCycleTime:n.animationCycleTime,animationLooped:n.animationLooped,animationEnded:n.animationEnded}}function Vc(n,e){n.anim=e.anim,n.animationOwner=e.animationOwner,n.frameIndex=e.frameIndex,n.frameTime=e.frameTime,n.animationTime=e.animationTime,n.animationCycleTime=e.animationCycleTime,n.animationLooped=e.animationLooped,n.animationEnded=e.animationEnded}class On extends Error{constructor(e,t,i){super(e),this.source=t,this.line=i}}function Sr(n,e){const t=[];let i=0,s=0,r=!1,a=!1;for(let o=0;o<n.length;o++){const l=n[o];l==='"'&&!a&&(r=!r),r||("([".includes(l)&&s++,")]".includes(l)&&s--,!s&&l===e&&(t.push(n.slice(i,o).trim()),i=o+1)),a=l==="\\"&&!a}return t.push(n.slice(i).trim()),t}class dp{constructor(e,t){if(e.length>2*1024*1024)throw new On("ZSS file exceeds 2 MiB.",t,1);this.text=e.replace(/^\uFEFF/,""),this.source=t,this.at=0,this.line=1,this.nodes=0,this.depth=0,this.scope=new Set,this.expressions=new Set}fail(e){throw new On(e,this.source,this.line)}take(){const e=this.text[this.at++];return e===`
`&&this.line++,e}skip(){for(;;){for(;/\s/.test(this.text[this.at]||"")&&this.at<this.text.length;)this.take();if(this.text[this.at]!=="#")return;for(;this.at<this.text.length&&this.take()!==`
`;);}}word(){this.skip();const e=/^[a-z_][a-z0-9_.]*/i.exec(this.text.slice(this.at));return e||this.fail("Expected an identifier."),this.at+=e[0].length,e[0]}is(e){return this.skip(),new RegExp("^"+e+"(?![a-z0-9_.])","i").test(this.text.slice(this.at))}expect(e){this.skip(),this.take()!==e&&this.fail(`Expected '${e}'.`)}read(e){let t="",i=0,s=!1,r=!1;for(;this.at<this.text.length;){const a=this.text[this.at];if(!s&&!i&&e.includes(a)&&!(a===":"&&this.text[this.at+1]==="="))break;if(!s&&a==="#"){for(;this.at<this.text.length&&this.take()!==`
`;);t+=" ";continue}t+=this.take(),a==='"'&&!r&&(s=!s),s||("([".includes(a)&&i++,")]".includes(a)&&--i<0&&this.fail("Unbalanced expression.")),r=a==="\\"&&!r}return(s||i)&&this.fail("Unterminated expression."),t.trim()}local(e){/^[a-z_][a-z0-9_]*$/i.test(e)||this.fail("Invalid local variable name."),this.scope.add(e),this.scope.size>256&&this.fail("ZSS local-variable limit (256) exceeded.")}expr(e,t=!0){(!e||e.length>8192)&&this.fail("Empty or oversized ZSS expression.");let i="",s=!1,r=!1;for(let a=0;a<e.length;a++){const o=e[a];if(!s&&o==="$"){const l=/^[a-z_][a-z0-9_]*/i.exec(e.slice(a+1));(!l||!this.scope.has(l[0]))&&this.fail(`Unknown local variable near ${e.slice(a,a+40)}.`),i+=`zsslocal("${l[0]}")`,a+=l[0].length;continue}i+=o,o==='"'&&!r&&(s=!s),r=o==="\\"&&!r}if(t)try{ql(i)}catch(a){this.fail(a.message)}return this.expressions.add(i),i}parameters(e,t){const i=[],s={};for(const r of Sr(e,";").filter(Boolean)){const a=/^([a-z_][a-z0-9_.]*)\s*:\s*([\s\S]*)$/i.exec(r);a||this.fail("Expected parameter: value.");const o=a[1].toLowerCase(),l=a[2].trim()?this.expr(a[2],!1):"";i.push({key:o,value:l,line:t}),s[o]=l}return{entries:i,values:s}}block(e=0){this.expect("{"),++this.depth>64&&this.fail("ZSS nesting limit (64) exceeded.");const t=this.statements(e,!0);return this.expect("}"),this.depth--,t}statements(e=0,t=!1,i=!1){const s=[];for(;;){this.skip();const r=this.text[this.at];if(r==="}"||i&&(this.is("case")||this.is("default"))||this.at>=this.text.length||!t&&r==="[")break;if(r===";"){this.take();continue}++this.nodes>2e4&&this.fail("ZSS statement limit (20,000) exceeded."),s.push(this.statement(e))}return s}call(e){const t=/^call\s+([a-z_][a-z0-9_]*)\s*\(([\s\S]*)\)$/i.exec(e);return t||this.fail("Invalid function call."),{kind:"call",name:t[1],args:t[2].trim()?Zi(t[2]).map(i=>this.expr(i)):[]}}statement(e){++this.depth>64&&this.fail("ZSS nesting limit (64) exceeded.");try{return this.readStatement(e)}finally{this.depth--}}readStatement(e){var d;this.skip();const t=this.line,i=this.source;let s=!1,r=1,a=!1;for(;this.is("ignorehitpause")||this.is("persistent");)if(a=!0,this.word().toLowerCase()==="ignorehitpause")s=!0;else{this.expect("(");const p=this.read(")");this.expect(")"),(!/^\d+$/.test(p)||Number(p)>2147483647)&&this.fail("persistent requires a nonnegative integer constant."),r=Number(p)}const o={source:i,line:t,ignoreHitPause:s,persistent:r};if(this.text[this.at]==="{")return{...o,kind:"block",body:this.block(e)};const l=this.word(),c=l.toLowerCase();if(c==="if"){const u=this.expr(this.read("{")),p=this.block(e);this.skip();let _=[];return this.is("else")&&(this.word(),this.skip(),_=this.text[this.at]==="{"?this.block(e):[this.statement(e)]),{...o,kind:"if",condition:u,yes:p,no:_}}if(a&&this.fail("ignoreHitPause/persistent must prefix an if statement or a braced block."),c==="while")return{...o,kind:"while",condition:this.expr(this.read("{")),body:this.block(e+1)};if(c==="for"){const u=Sr(this.read("{"),";");(u.length<2||u.length>3)&&this.fail("for requires start; end; optional step.");let p=null,_=u[0];const m=/^([a-z_][a-z0-9_]*)\s*=\s*([\s\S]+)$/i.exec(_);return m&&(p=m[1],this.local(p),_=m[2]),{...o,kind:"for",variable:p,start:this.expr(_),end:this.expr(u[1]),step:this.expr(u[2]||"1"),body:this.block(e+1)}}if(c==="switch"){const u=this.expr(this.read("{"));this.expect("{"),++this.depth>64&&this.fail("ZSS nesting limit (64) exceeded.");const p=[];let _=null;for(;this.skip(),this.text[this.at]!=="}";){const m=this.word().toLowerCase();if(m==="case"){const g=Sr(this.read(":"),";").map(y=>this.expr(y));this.expect(":"),p.push({values:g,body:this.statements(e,!0,!0)})}else m==="default"&&!_?(this.expect(":"),_=this.statements(e,!0,!0)):this.fail("Expected case or a single default label.")}return this.expect("}"),this.depth--,{...o,kind:"switch",expression:u,cases:p,fallback:_||[]}}if(c==="break"||c==="continue")return e||this.fail(`${c} is only valid inside a loop.`),this.expect(";"),{...o,kind:c};if(c==="let"){const u=this.read("=").split(",").map(m=>m.trim());u.forEach(m=>this.local(m)),this.expect("=");const p=this.read(";");if(this.expect(";"),/^call\b/i.test(p))return{...o,...this.call(p),outputs:u};const _=Zi(p).map(m=>this.expr(m));return u.length!==_.length&&this.fail("Local assignment needs one value per name."),{...o,kind:"let",names:u,values:_}}if(c==="call"){const u="call "+this.read(";");return this.expect(";"),{...o,...this.call(u)}}if(this.skip(),this.text[this.at]==="{"){this.expect("{");const u=this.parameters(this.read("}"),t);this.expect("}"),(u.values.persistent!==void 0||u.values.ignorehitpause!==void 0&&c!=="explod")&&this.fail("Controller persistence/hitpause flags belong before a ZSS block.");const p=[{key:"type",value:c,line:t},{key:"trigger1",value:"1",line:t},...u.entries];return{...o,kind:"controller",controller:{name:"state zss",source:i,line:t,type:c,entries:p,values:{type:c,trigger1:"1",...u.values},language:"zss"}}}const h=l+this.read(";");this.expect(";");const f=/^(?:(parent|root)\s*,\s*)?(var|fvar|sysvar|sysfvar|map)\s*\(/i.exec(h);if(f){let u=f[0].length,p=1,_=!1,m=!1;for(;u<h.length;u++){const y=h[u];if(y==='"'&&!m&&(_=!_),!_&&(y==="("&&p++,y===")"&&--p===0))break;m=y==="\\"&&!m}const g=/^\s*:=\s*([\s\S]+)$/.exec(h.slice(u+1));if(p===0&&g){const y=((d=f[1])==null?void 0:d.toLowerCase())||null,b=f[2].toLowerCase(),A=h.slice(f[0].length,u);return{...o,kind:"assign",target:y,variable:b,index:b==="map"?A.trim().replace(/^"(.*)"$/,"$1").toLowerCase():this.expr(A),value:this.expr(g[1])}}}return{...o,kind:"expression",expression:this.expr(h)}}parse(){const e=[],t=[];for(;this.at<this.text.length&&(this.skip(),!(this.at>=this.text.length));){const i=this.line;this.expect("[");const s=this.read("]");if(this.expect("]"),this.scope=new Set,/^statedef\b/i.test(s)){const r=Sr(s,";"),a=this.expr(r.shift().replace(/^statedef\s+/i,"")),o=this.parameters(r.filter(Boolean).join(";"),i),l=this.statements();e.push({source:this.source,line:i,name:"statedef zss",idExpression:a,...o,zssNodes:l,localNames:[...this.scope],controllers:[]})}else{const r=/^function\s+([a-z_][a-z0-9_]*)\s*\(([^)]*)\)\s*(.*?)\s*$/i.exec(s);r||this.fail("Expected StateDef or Function header.");const a=r[2].trim()?r[2].split(",").map(c=>c.trim()):[],o=r[3].replace(/^return\s+/i,"").split(",").map(c=>c.trim()).filter(Boolean);[...a,...o].forEach(c=>this.local(c));const l=this.statements();t.push({source:this.source,line:i,name:r[1],args:a,outputs:o,localNames:[...this.scope],body:l})}}return{states:e,functions:t,expressions:this.expressions}}}function Gu(n,e){for(const t of n){e(t);for(const i of[t.body,t.yes,t.no,t.fallback,...(t.cases||[]).map(s=>s.body)])i&&Gu(i,e)}}function fp(n,e="<zss>"){return new dp(n,e).parse()}const Wu=Object.freeze({value:0,float:!1}),dn=new WeakMap;function pp(n){return[n.body,n.yes,n.no,n.fallback,...(n.cases||[]).map(e=>e.body)].filter(Boolean)}function mp(n){var t;if(dn.has(n))return dn.get(n);const e=[[n,!1]];for(;e.length;){const[i,s]=e.pop();if(dn.has(i))continue;if(i.ignoreHitPause){dn.set(i,!0);continue}const r=[...pp(i).flat(),...((t=i.function)==null?void 0:t.body)||[]];if(s)dn.set(i,r.some(a=>dn.get(a)));else{e.push([i,!0]);for(const a of r)dn.has(a)||e.push([a,!1])}}return dn.get(n)}function Ai(n){if(n!=null&&n.bottom)throw n.error;if(typeof(n==null?void 0:n.value)!="number"||!Number.isFinite(n.value))throw Error("ZSS locals and function values currently require finite numbers.");return n.value}function gp(n,e){return n.float||e.float?Math.fround(Ai(n))===Math.fround(Ai(e)):Ai(n)===Ai(e)}function Gc(n){return new Map(n.map(e=>[e,Wu]))}function vp(n,e,t,i){const s=n._zssContext,r=n._scriptOwner,a=n._executing,o=n._entrySerial,l={owner:t,locals:Gc(e.localNames||[]),depth:0};n._zssContext=l,n._scriptOwner=t;const c=(_,m)=>n.evaluate(_,m,!0),h=(_,m)=>{try{return Ai(c(_,m))!==0}catch(g){if(g.bottom)return!1;throw g}},f=_=>{if(n._executing=_,++n._zssSteps>2e4){const m=Error("ZSS instruction budget exceeded (20,000 per tick).");throw m.zssBudget=!0,m}},d=()=>n.destroyed||n._entrySerial!==o;function u(_,m){const g=_.function,y=n._zssContext;if(!g)throw Error(`Unknown ZSS function ${_.name}.`);if(y.depth>=32)throw Error("ZSS function depth limit (32) exceeded.");const b=_.args.map(x=>c(x,_)),A={owner:t,locals:Gc(g.localNames),depth:y.depth+1};b.forEach((x,M)=>A.locals.set(g.args[M],x)),n._zssContext=A;try{return{signal:p(g.body,m),values:g.outputs.map(M=>A.locals.get(M)||Wu)}}finally{n._zssContext=y}}function p(_,m=!1){var g;for(const y of _){if(d())return"transition";const b=m||y.ignoreHitPause;if(i&&!b&&!mp(y))continue;f(y);const A=n._controllerCounts.get(y)||0;if(!(y.persistent!==1&&(n._controllerCounts.set(y,A+1),y.persistent===0?A!==0:A%y.persistent!==0))){try{let x;if(y.kind==="controller")n.execute(y.controller);else if(y.kind==="expression")c(y.expression,y);else if(y.kind==="assign"){const M=y.target==="parent"?n.parent:y.target==="root"?n.root:n;if(!M||M.destroyed){const E=Error("ZSS assignment target is unavailable.");throw E.bottom=!0,E}const v=y.variable==="map"?y.index:Ai(c(y.index,y)),S=Ai(c(y.value,y));y.variable==="map"?M.setMap(y.index,S):M.assignVariable(y.variable,[v],S)}else if(y.kind==="let"){const M=y.values.map(v=>c(v,y));M.forEach(Ai),y.names.forEach((v,S)=>n._zssContext.locals.set(v,M[S]))}else if(y.kind==="call"){const M=u(y,b);x=M.signal,x||(g=y.outputs)==null||g.forEach((v,S)=>n._zssContext.locals.set(v,M.values[S]))}else if(y.kind==="if")x=p(h(y.condition,y)?y.yes:y.no,b);else if(y.kind==="block")x=p(y.body,b);else if(y.kind==="switch"){const M=c(y.expression,y);let v=y.fallback;for(const S of y.cases)if(S.values.some(E=>gp(M,c(E,y)))){v=S.body;break}x=p(v,b)}else{if(y.kind==="break"||y.kind==="continue")return y.kind;if(y.kind==="while"||y.kind==="for"){let M,v,S;if(y.kind==="for"){if(M=Math.trunc(Ai(c(y.start,y))),v=Math.trunc(Ai(c(y.end,y))),S=Math.trunc(Ai(c(y.step,y))),!S)throw Error("ZSS for step cannot be zero.");y.variable&&n._zssContext.locals.set(y.variable,{value:M|0,float:!1})}let E=0;for(;y.kind==="while"?h(y.condition,y):S>0?M<=v:M>=v;){if(f(y),++E>2500){n.diagnostic("resource-limit","ZSS loop stopped at 2,500 iterations.",y);break}const P=p(y.body,b);if(P==="transition")return P;if(P==="break")break;y.kind==="for"&&(M+=S),y.kind==="for"&&(S>0?M<=v:M>=v)&&y.variable&&n._zssContext.locals.set(y.variable,{value:M|0,float:!1})}}}if(x)return x}catch(x){if(x.zssBudget)throw x;x.bottom||n.diagnostic("zss-runtime",x.message,y)}if(d())return"transition"}}return null}try{p(e.zssNodes)}catch(_){n.diagnostic(_.zssBudget?"resource-limit":"zss-runtime",_.message,n._executing)}finally{n._zssContext=s,n._scriptOwner=r,n._executing=a}}function $o(n,e="<script>"){const t=[];let i;for(const[s,r]of String(n).replace(/^\uFEFF/,"").split(/\r?\n/).entries()){let a=!1,o=!1,l="";for(let g=0;g<r.length;g++){const y=r[g];if(y==='"'&&!o&&(a=!a),y===";"&&!a)break;l+=y,o=y==="\\"&&!o}const c=l.trim();if(!c)continue;const h=c.match(/^\[([^\]]+)\]/);if(h){i={name:h[1].trim().toLowerCase(),source:e,line:s+1,entries:[],values:{}},t.push(i);continue}let f=-1,d=0,u=!1,p=!1;for(let g=0;g<c.length;g++){const y=c[g];if(y==='"'&&!p&&(u=!u),!u){if(y==="("||y==="[")d++;else if(y===")"||y==="]")d--;else if(y==="="&&d===0){f=g;break}}p=y==="\\"&&!p}if(!i||f<1)continue;const _=c.slice(0,f).trim().toLowerCase(),m=c.slice(f+1).trim();i.entries.push({key:_,value:m,line:s+1}),Object.hasOwn(i.values,_)||(i.values[_]=m)}return t}const _p={statetagenteringscreen:6565600,statetagleavingscreen:6565610,statetagwaitingoutside:6565611,statetagjumpingin:6565620,statetaglanding:6565621,"data.life":1e3,"data.power":3e3,"data.attack":100,"data.defence":100,"data.airjuggle":15,"data.liedown.time":60,"data.sparkno":2,"data.guard.sparkno":40,"data.fall.defence_up":50,"data.ko.echo":0,"data.intpersistindex":60,"data.floatpersistindex":40,"size.xscale":1,"size.yscale":1,"size.ground.back":15,"size.ground.front":16,"size.air.back":12,"size.air.front":12,"size.height":60,"size.attack.dist":160,"size.proj.doscale":0,"size.proj.attack.dist":90,"size.head.pos.x":0,"size.head.pos.y":-90,"size.mid.pos.x":0,"size.mid.pos.y":-60,"size.draw.offset.x":0,"size.draw.offset.y":0,"size.shadowoffset":0,"velocity.walk.fwd.x":2.4,"velocity.walk.back.x":-2.2,"velocity.run.fwd.x":4.6,"velocity.run.fwd.y":0,"velocity.run.back.x":-4.5,"velocity.run.back.y":-3.8,"velocity.jump.neu.x":0,"velocity.jump.neu.y":-8.4,"velocity.jump.y":-8.4,"velocity.jump.fwd.x":2.5,"velocity.jump.back.x":-2.55,"velocity.runjump.fwd.x":4,"velocity.runjump.fwd.y":-8.1,"velocity.runjump.back.x":-2.55,"velocity.runjump.back.y":-8.1,"velocity.airjump.neu.x":0,"velocity.airjump.neu.y":-8.1,"velocity.airjump.y":-8.1,"velocity.airjump.fwd.x":2.5,"velocity.airjump.back.x":-2.55,"velocity.air.gethit.groundrecover.x":-.15,"velocity.air.gethit.groundrecover.y":-3.5,"velocity.air.gethit.airrecover.mul.x":.5,"velocity.air.gethit.airrecover.mul.y":.2,"velocity.air.gethit.airrecover.add.x":0,"velocity.air.gethit.airrecover.add.y":-4.5,"velocity.air.gethit.airrecover.back":-1,"velocity.air.gethit.airrecover.fwd":0,"velocity.air.gethit.airrecover.up":-2,"velocity.air.gethit.airrecover.down":1.5,"movement.yaccel":.44,"movement.stand.friction":.85,"movement.crouch.friction":.82,"movement.stand.friction.threshold":2,"movement.crouch.friction.threshold":.05,"movement.airjump.num":1,"movement.airjump.height":35,"movement.air.gethit.groundlevel":25,"movement.air.gethit.groundrecover.ground.threshold":-20,"movement.air.gethit.groundrecover.groundlevel":10,"movement.air.gethit.airrecover.threshold":-1,"movement.air.gethit.airrecover.yaccel":.35,"movement.air.gethit.trip.groundlevel":15,"movement.down.bounce.offset.x":0,"movement.down.bounce.offset.y":20,"movement.down.bounce.yaccel":.4,"movement.down.bounce.groundlevel":12,"movement.down.friction.threshold":.05},va=new Set(["null","changestate","selfstate","changeanim","changeanim2","ctrlset","statetypeset","velset","veladd","velmul","posset","posadd","posfreeze","gravity","turn","varset","varadd","varmul","varrandom","varrangeset","parentvarset","parentvaradd","lifeadd","lifeset","poweradd","powerset","hitvelset","hitdef","hitby","nothitby","hitoverride","sprpriority","width","screenbound","playerpush","assertspecial","assertinput","playsnd","stopsnd","sndpan","envshake","palfx","allpalfx","bgpalfx","explod","modifyexplod","removeexplod","explodbindtime","targetbind","targetfacing","targetlifeadd","targetpoweradd","targetvelset","targetveladd","targetstate","targetdrop","bindtoroot","bindtoparent","bindtotarget","attackmulset","defencemulset","hitadd","hitcount","hitfallset","hitfallvel","hitfallDamage".toLowerCase(),"angleadd","angleset","anglemul","angledraw","offset","destroyself","helper","projectile","pause","superpause","afterimage","afterimagetime","trans","movehitreset","attackdist","reversaldef","envcolor","fallenvshake","remappal","makedust","gamemakeanim","forcefeedback","displaytoclipboard","appendtoclipboard","clearclipboard","victoryquote","mapset","mapadd","rootmapset","rootmapadd","modifyplayer"]);new Set(va);const Da=new Set(["time","stateno","prevstateno","anim","animelem","animtime","ctrl","statetype","movetype","physics","life","lifemax","power","powermax","facing","alive","gametime","hitpausetime","hitshakeover","hitover","movecontact","movehit","moveguarded","movereversed","hitcount","uniqhitcount","numhelper","numexplod","numtarget","numenemy","numpartner","ishelper","roundstate","roundno","matchno","teamside","teampower","tickspersecond","ailevel","palno","id","name","authorname","numproj","win","lose","drawgame","inguarddist","canrecover","pos x","pos y","vel x","vel y","screenpos x","screenpos y","command","const","const240p","const480p","const720p","random","animexist","selfanimexist","animelemtime","animelemno","gethitvar","playeridexist","p2name","p2life","p2stateno","p2statetype","p2movetype","p2bodydist x","p2dist x","p2bodydist y","p2dist y","hitdefattr","reversaldefattr","pausetime","incustomstate","ailevelf","gamemode","standby","attack","defence","sprpriority","inputtime","receiveddamage","receivedhits","roundsexisted","camerapos x","camerapos y","hitfall","hitvel x","hitvel y","frontedgedist","backedgedist","frontedgebodydist","backedgebodydist","var","fvar","sysvar","sysfvar"]);Da.add("teammode");Da.add("map");Da.add("ishometeam");for(const n of["p1name","p3name","p4name","frontedge","backedge","const240p","const480p","const720p"])Da.add(n);const xp=new Set(["playsnd","stopsnd","sndpan","envshake","envcolor","palfx","allpalfx","bgpalfx","afterimage","afterimagetime"]),Qa=n=>kn(n).replaceAll("\\","/").toLowerCase().replace(/^\.\//,""),kn=n=>String(n??"").replace(/^"(.*)"$/,"$1"),eo=Li,Fa=new Map;for(const n of["attackdist","attackmulset","changeanim","changeanim2","changestate","selfstate","ctrlset","defencemulset","hitadd","lifeadd","lifeset","playerpush","playsnd","poweradd","powerset","targetfacing","targetlifeadd","targetpoweradd","targetstate"])Fa.set(n,["value"]);for(const[n,e]of Object.entries({afterimagetime:["time"],assertspecial:["flag"],assertinput:["flag"],displaytoclipboard:["text"],appendtoclipboard:["text"],envshake:["time"],explod:["anim"],hitdef:["attr"],pause:["time"],reversaldef:["reversal.attr"],sndpan:["channel"],stopsnd:["channel"],trans:["trans"],varrandom:["v"]}))Fa.set(n,e);const to=new WeakMap;for(const n of["mapset","mapadd","rootmapset","rootmapadd"])Fa.set(n,["map","value"]);function Qs(n){var i;if(to.has(n))return to.get(n);const e={ignorehitpause:0,persistent:1,groups:new Map,errors:[],warnings:[]};for(const s of Fa.get(n.type)||[])n.values[s]===void 0&&e.errors.push({line:n.line,message:`${n.type} requires ${s}.`});["varset","varadd","varmul","parentvarset","parentvaradd"].includes(n.type)&&!n.entries.some(s=>/^(?:var|fvar|sysvar|sysfvar)\s*\(/.test(s.key))&&(n.values.v===void 0&&n.values.fv===void 0&&n.values.sysv===void 0&&n.values.sysfv===void 0&&e.errors.push({line:n.line,message:`${n.type} requires v or fv (or alternate variable assignment syntax).`}),n.values.value===void 0&&e.errors.push({line:n.line,message:`${n.type} requires value.`})),n.type==="varrangeset"&&n.values.value===void 0&&n.values.fvalue===void 0&&e.errors.push({line:n.line,message:"VarRangeSet requires value or fvalue."}),n.type==="sndpan"&&n.values.pan===void 0&&n.values.abspan===void 0&&e.errors.push({line:n.line,message:"SndPan requires pan or abspan."});for(const s of["ignorehitpause","persistent"])if(n.values[s]!==void 0){if(s==="ignorehitpause"&&n.language==="zss"&&n.type==="explod")continue;const r=n.values[s],a=Number(r);!/^[+-]?\d+$/.test(r)||!Number.isSafeInteger(a)||a<-2147483648||a>2147483647||s==="persistent"&&a<0?e.errors.push({line:((i=n.entries.find(o=>o.key===s))==null?void 0:i.line)||n.line,message:`${s} requires ${s==="persistent"?"a nonnegative":"a signed 32-bit"} integer constant; expressions are not allowed.`}):e[s]=a}for(const s of n.entries){const r=/^trigger([1-9]\d*)$/.exec(s.key);if(r){const a=Number(r[1]);e.groups.has(a)||e.groups.set(a,[]),e.groups.get(a).push(s)}}e.groups.has(1)||e.errors.push({line:n.line,message:"A state controller requires at least one trigger1."});let t=1;for(;e.groups.has(t);)t++;for(const[s,r]of e.groups)s>=t&&(e.groups.delete(s),e.warnings.push({line:r[0].line,message:`trigger${s} is ignored because trigger${t} is missing.`}));return to.set(n,e),e}const yp=new Map(Object.entries({time:"time",stateno:"stateNo",prevstateno:"prevStateNo",anim:"scriptAnim",animtime:"animTime",ctrl:"ctrl",statetype:"stateType",movetype:"moveType",physics:"physics",life:"life",lifemax:"maxLife",power:"power",powermax:"maxPower",facing:"facing",hitpausetime:"hitPauseTime",movecontact:"moveContact",movehit:"moveHit",moveguarded:"moveGuarded",hitcount:"hitCount",uniqhitcount:"uniqHitCount",id:"id",name:"name"}));function Xu(n,{commonText:e="",constantDefaults:t={},constantsFromCnsOnly:i=!1}={}){var g,y,b,A;const s={states:new Map,constants:new Map(Object.entries({..._p,...t})),quotes:new Map,functions:new Map,initialMaps:new Map,zssExpressions:new Set,diagnostics:[],sources:[],controllerTypes:new Set},r=[];e&&r.push(["<common states>",e]);const a=n.files||{},o=((g=n.path)==null?void 0:g.slice(0,n.path.lastIndexOf("/")+1))||"",l=x=>{const M=Qa(x),v=o.lastIndexOf("/chars/"),S=v<0?"":o.slice(0,v+1),E=(n.checks||[]).find(C=>C.ok&&C.path&&Qa(C.value||"")===M&&a[C.path]),P=[E==null?void 0:E.path,o+M,M,S+"data/"+M,"data/"+M];return P.find(C=>C&&a[C])||P.filter(Boolean).map(C=>C+".zss").find(C=>a[C])},c=((y=n.def)==null?void 0:y.files)||{},h=c.cns?l(c.cns):(b=(n.checks||[]).find(x=>x.key==="cns"&&x.ok))==null?void 0:b.path,f=c.stcommon&&l(c.stcommon);f?r.push([f,eo(a[f])]):c.stcommon&&Qa(c.stcommon).split("/").at(-1)!=="common1.cns"&&s.diagnostics.push({source:n.path,line:0,type:"missing-file",message:`Common state file not found: ${c.stcommon}`});const d=new Set;for(const[x,M]of Object.entries(c)){if(!/^(cns|cmd|st\d*)$/.test(x)||!M)continue;const v=l(M);v&&!d.has(v)?(d.add(v),r.push([v,eo(a[v])])):v||s.diagnostics.push({source:n.path,line:0,type:"missing-file",message:`${x}: ${M}`})}for(const x of n.checks||[])/^(cns|cmd|st\d*)$/.test(x.key)&&x.ok&&a[x.path]&&!d.has(x.path)&&(d.add(x.path),r.push([x.path,eo(a[x.path])]));let u=0,p=0;const _=x=>ma(x,{resolve:(M,v)=>{if(M!=="const"||!s.constants.has(String(v[0]).toLowerCase()))throw Error("State identifiers must use known numeric constants.");return s.constants.get(String(v[0]).toLowerCase())}});for(const[x,M]of Object.entries(((A=n.def)==null?void 0:A.map)||{}))try{const v=Math.fround(_(M));if(!Number.isFinite(v)||s.initialMaps.size>=4096)throw Error("Invalid or excessive initial named maps.");s.initialMaps.set(x.toLowerCase(),v)}catch(v){s.diagnostics.push({source:n.path,line:0,type:"constant",message:v.message})}const m=new Map;for(const[x,M]of r){if(/\.zss$/i.test(x)||!/^\s*\[\s*(?:constants|map)\s*\]/im.test(M))continue;const v=$o(M,x);m.set(x,v);for(const S of v)if(S.name==="constants"||S.name==="map")for(const E of S.entries)try{const P=Math.fround(_(E.value));if(!Number.isFinite(P))throw Error("Expected a finite float32 value.");if(S.name==="map"&&s.initialMaps.size>=4096&&!s.initialMaps.has(E.key))throw Error("Initial named map limit exceeded.");(S.name==="map"?s.initialMaps:s.constants).set(E.key,P)}catch(P){s.diagnostics.push({source:x,line:E.line,type:"constant",message:P.message})}}for(const[x,M]of r){if(s.sources.push(x),/\.zss$/i.test(x)){try{const S=fp(M,x),E=new Map(s.functions),P=new Map(s.states),C=[],F=[...S.functions.map(I=>({value:I,isFunction:!0})),...S.states.map(I=>({value:I,isFunction:!1}))].sort((I,R)=>I.value.line-R.value.line);for(const{value:I,isFunction:R}of F){const O=R?I.body:I.zssNodes;if(Gu(O,k=>{if(++p>1e5)throw new On("Combined ZSS statement limit (100,000) exceeded.",x,k.line);if(k.kind==="call"){const H=E.get(k.name);if(!H)throw new On(`Function ${k.name} must be defined before its caller.`,x,k.line);if(k.args.length!==H.args.length||k.outputs&&k.outputs.length!==H.outputs.length)throw new On(`Function ${k.name} argument/return count mismatch.`,x,k.line);k.function=H}k.controller&&(k.controller.id=++u,k.controller.state=R?I.name:I.idExpression,C.push(k.controller),R||I.controllers.push(k.controller))}),R)E.set(I.name,I);else{const k=_(I.idExpression);if(!Number.isInteger(k)||k<-2147483648||k>2147483647)throw new On("State number must be a signed 32-bit integer constant.",x,I.line);if(I.idExpression.replace(/\s/g,"")==="+1")throw new On("Extended global state +1 is not scheduled by this preview.",x,I.line);I.id=k,P.set(k,I);const H=new Set(["type","movetype","physics","anim","velset","ctrl","poweradd","facep2","hitdefpersist","movehitpersist","hitcountpersist","sprpriority","juggle"]);for(const L of I.entries)H.has(L.key)||s.diagnostics.push({source:x,line:L.line,type:"unsupported-state-parameter",message:`Statedef parameter ${L.key} is not implemented.`})}}s.functions=E,s.states=P;for(const I of S.expressions)s.zssExpressions.add(I);for(const I of C){s.controllerTypes.add(I.type);const R=Qs(I);for(const O of R.errors)s.diagnostics.push({source:x,line:O.line,type:"controller-parameter",fatal:!0,message:O.message});va.has(I.type)||s.diagnostics.push({source:x,line:I.line,type:"unsupported-controller",name:I.type,message:`Controller ${I.type} is not implemented.`})}}catch(S){s.diagnostics.push({source:x,line:S.line||1,type:"zss-compile",fatal:!0,message:S.message})}continue}if(/\.lua$/i.test(x)){s.diagnostics.push({source:x,line:1,type:"script-language",fatal:!0,message:"Lua character-state execution is not implemented."});continue}let v;for(const S of m.get(x)||$o(M,x)){const E=S.name.match(/^statedef\s+(-?\d+)\s*$/);if(E){v={id:+E[1],...S,controllers:[]},s.states.set(v.id,v);const P=new Set(["type","movetype","physics","anim","velset","ctrl","poweradd","facep2","hitdefpersist","movehitpersist","hitcountpersist","sprpriority","juggle"]);for(const C of S.entries)P.has(C.key)||s.diagnostics.push({source:x,line:C.line,type:"unsupported-state-parameter",message:`Statedef parameter ${C.key} is not implemented.`})}else if(/^state(?:\s|$)/.test(S.name)){if(!v){s.diagnostics.push({source:x,line:S.line,type:"parse",message:"State controller has no preceding Statedef."});continue}const P=kn(S.values.type||"").toLowerCase(),C={...S,id:++u,type:P,state:v.id};v.controllers.push(C),s.controllerTypes.add(P);const F=Qs(C);for(const[I,R]of[["controller-parameter",F.errors],["trigger-numbering",F.warnings]])for(const O of R)s.diagnostics.push({source:x,line:O.line,type:I,message:O.message});va.has(P)||s.diagnostics.push({source:x,line:S.line,type:"unsupported-controller",name:P||"(missing type)",message:`Controller ${P||"(missing type)"} is not implemented.`})}else if(S.name==="quotes")for(const P of S.entries){const C=/^victory(\d{1,2})$/.exec(P.key);if(C)try{s.quotes.set(+C[1],Ou(P.value))}catch(F){s.diagnostics.push({source:x,line:P.line,type:"quote",message:F.message})}}else if(/^(data|size|velocity|movement)$/.test(S.name)){if(i&&x!==h)continue;for(const P of S.entries){const C=`${S.name}.${P.key}`,F=P.value.split(",").map(I=>Number(I.trim()));F.some(I=>!Number.isFinite(I))||(s.constants.set(C,F.length===1?F[0]:F),(F.length>1||S.name==="velocity")&&(s.constants.set(C+".x",F[0]),F.length>1&&s.constants.set(C+".y",F[1])),C==="velocity.jump.neu"&&F.length>1&&s.constants.set("velocity.jump.y",F[1]),C==="velocity.airjump.neu"&&F.length>1&&s.constants.set("velocity.airjump.y",F[1]))}}}}return s}const Ht=n=>{const e=Number(n);if(!Number.isFinite(e))throw new Error(`Expected finite number, received ${String(n)}`);return e},ht=n=>Math.trunc(Ht(n)),Kt=n=>typeof n=="number"&&Number.isFinite(n)&&n!==0,ci=(n,e,t)=>Math.min(t,Math.max(e,n));class _a{constructor(e,t={}){var s,r,a,o,l;this.character=e,this.options=t,this.program=t.program||Xu(e,t),this.animations=new Map((e.animations||[]).map(c=>[c.id,c])),this.diagnostics=[...this.program.diagnostics],this._diagnosticKeys=new Set(this.diagnostics.map(c=>`${c.source}:${c.line}:${c.type}:${c.message}`)),this._seed=t.seed??439041101,this.id=t.id??1,this.name=((r=(s=e.def)==null?void 0:s.info)==null?void 0:r.name)||"Character";const i=(((o=(a=e.def)==null?void 0:a.info)==null?void 0:o.localcoord)||"320,240").split(",").map(Number);this.localcoord={x:i[0]||320,y:i[1]||240},this.coordinateScale=320/this.localcoord.x,this.baseCoordinateScale=this.coordinateScale,this.world=t.world||null,this.parent=t.parent||null,this.root=t.root||this,this.helperId=t.helperId??0,this.keyCtrl=t.keyCtrl??!this.parent,this.ownPal=t.ownPal??!1,this.teamSide=t.teamSide??((l=this.root.options)==null?void 0:l.teamSide)??1,this.commonAnimations=t.commonAnimations||new Map,this.reset()}reset(){var e,t,i;this.vars=new Int32Array(60),this.fvars=new Float32Array(40),this.stateOwner=this,this.animationOwner=this,this.destroyed=!1,this.coordinateScale=this.baseCoordinateScale,this._scriptOwner=null,this.sysvars=new Int32Array(5),this.sysfvars=new Float32Array(5),this.maxLife=this.constant("data.life"),this.life=this.maxLife,this.maxPower=this.constant("data.power"),this._power=0,this.parent||(this.power=0),this.pos={x:((e=this.options.position)==null?void 0:e.x)||0,y:((t=this.options.position)==null?void 0:t.y)||0},this.vel={x:0,y:0},this.facing=this.options.facing===-1?-1:1,this.ctrl=1,this.stateType="S",this.moveType="I",this.physics="S",this.stateNo=0,this.prevStateNo=0,this.time=0,this.gameTime=0,this.anim=0,this.frameIndex=0,this.frameTime=0,this.animationTime=0,this.animationCycleTime=0,this.animationLooped=!1,this.animationEnded=!1,this._animationSerial=0,this._pausedAnimation=null,this._inPausedAnimation=!1,this._animationLoopReset=!1,this.collisionFrame=null,this.collisionAnimationOwner=null,this.collisionAnimation=null,this.collisionFrameIndex=0,this.collisionFrameTime=0,this.hitDef=null,this.reversalDef=null,this.moveReversed=0,this._hitSerial=0,this.hitPauseTime=0,this.hitTime=-1,this.hitId=-1,this.hitSourceId=void 0,this._spentHitDefs=new WeakSet,this.inGuardDistance=!1,this._projectileContactShield=!1,this.moveContact=0,this.moveHit=0,this.moveGuarded=0,this.hitCount=0,this.uniqHitCount=0,this.comboHits=0,this._lastHitCountTick=null,this._receivedComboDamage=0,this._receivedComboHits=0,this.getHitVars=sp(this),this._fallXVelocityDefined=!1,this._fallDefenceMultiplier=1,this._previousInput=new Set,this.rawInput=new Set,this._inputDurations=new Map,this._fallEntry=-1,this.targets=[],this.targetHitIds=new Map,this.helpers=[],this.explods=[],this.drawExplods=[],this.events=[],this.commands=new Set,this.asserted=new Set,this.opponent=null,this.pendingAssertedInputs=new Set,this.maps=new Map(this.program.initialMaps||[]),this._zssContext=null,this._zssSteps=0,this._pendingStateEntry=null,this._pendingHitTransform=null,this.attackMultiplier=1,this.defenceMultiplier=1,this.sprPriority=0,this.angle=0,this.drawScale={x:1,y:1},this.drawOffset={x:0,y:0},this.playerPush=!this.parent,this.screenBound=!this.parent,this.moveCamera={x:!this.parent,y:!this.parent},this.posFrozen=!1,this.width=null,this._previousWidth=null,this.hitFilters=[null,null],this.hitOverrides=new Map,this.bound=null,this._controllerCounts=new Map,this._entrySerial=0,this.pauseMoveTime=this.options.pauseMoveTime||0,this.superMoveTime=this.options.superMoveTime||0,this.projectileHistory=[],this.trans=null,this.angleDraw=!1,this.juggleCost=0,this._juggleSerial=0,this._paletteRemaps=new Map,this.paletteNo=Math.max(1,Math.min(256,Math.trunc(this.options.paletteNo??((i=this.parent)==null?void 0:i.paletteNo)??1))),this.paletteNo!==1&&this._paletteRemaps.set("1,1",[1,this.paletteNo]),this._initializing=!1,this.aiLevel=this.parent?this.root.aiLevel:Math.max(0,Math.min(8,Math.trunc(Number.isFinite(Number(this.options.aiLevel))?Number(this.options.aiLevel):0))),this.clipboard="",this.victoryQuoteIndex=-1,this.victoryQuote=null,this._dustTicks=new Map,this.cornerPush=0,this.cornerPushTarget=null,this.cornerPushSide=0,this._previousUp=!1,this.airJumps=0,this._changeCount=0,this._executing=null,this.attackDist=void 0,this.changeState(0),this.events=[]}diagnostic(e,t,i=this._executing){const s={source:(i==null?void 0:i.source)||this.character.path||"<character>",line:(i==null?void 0:i.line)||0,type:e,message:t};i&&(s.controller=i.type,s.state=i.state);const r=`${s.source}:${s.line}:${s.type}:${s.message}`;return this._diagnosticKeys.has(r)||(this._diagnosticKeys.add(r),this.diagnostics.push(s)),s}constant(e,t=this.coordinateScale){if(e=String(e).toLowerCase(),e==="data.fall.defence_mul")return 100/(100+this.constant("data.fall.defence_up",t));if(!this.program.constants.has(e))throw new Error(`Unknown character constant: ${e}`);const i=this.program.constants.get(e);return(Array.isArray(i)?i[0]:i)*(Oc(e)?this.baseCoordinateScale/t:1)}get animation(){return(this.animationOwner||this).animations.get(this.anim)}get scriptAnimationClock(){var e;return!this._inPausedAnimation&&((e=this._pausedAnimation)==null?void 0:e.logic)||this}get scriptAnim(){return this.scriptAnimationClock.anim}get scriptAnimation(){const e=this.scriptAnimationClock;return(e.animationOwner||this).animations.get(e.anim)}get currentFrame(){var e;return((e=this.animation)==null?void 0:e.frames[this.frameIndex])||null}get animElemTime(){return this.frameTime}get animTime(){return up(this.scriptAnimation,this.scriptAnimationClock)}get alive(){return this.life>0}get paletteRemaps(){return this.parent&&!this.ownPal?this.parent.paletteRemaps:this._paletteRemaps}ownedHelpers(){return this.world?this.world.entities.filter(e=>e.parent&&!e.destroyed&&(this===this.root?e.root===this:e.parent===this)):this.helpers.filter(e=>!e.destroyed)}get power(){return this.parent?this.root.power:this._power}set power(e){this.parent?this.root.power=e:this._power=e}evaluate(e,t=this._executing,i=!1){try{return(this.options.expressionEvaluator||(i?Vo:ma))(e,{resolve:(s,r=[],a=null)=>{var o;if(s==="zsslocal"){const l=(o=this._zssContext)==null?void 0:o.locals.get(String(r[0]));if(!l)throw new bn(`ZSS local ${r[0]} is unavailable.`);if(l.bottom)throw l.error;return l}return this.resolveTrigger(s,r,a)},assign:(s,r,a)=>this.assignVariable(s,r,a),onWarning:s=>{s.bottom||this.diagnostic("expression-warning",`${e}: ${s.message}`,t)},typedResult:i})}catch(s){throw s.bottom||this.diagnostic("expression",`${e}: ${s.message}`,t),s}}variableArray(e){const t={var:this.vars,fvar:this.fvars,sysvar:this.sysvars,sysfvar:this.sysfvars};if(!t[e])throw new Error(`Unsupported assignable variable: ${e}`);return t[e]}assignVariable(e,t,i){const s=this.variableArray(e.toLowerCase()),r=ht(t[0]);if(r<0||r>=s.length)throw new Ot(`${e} index out of range: ${r}`);return s[r]=Ht(i),s[r]}setMap(e,t,i=!1){if(e=String(e).toLowerCase(),!e||e.length>128||e.includes("\0"))throw Error("Invalid map name.");if(!this.maps.has(e)&&this.maps.size>=4096)throw Error("Named map limit (4,096) exceeded.");const s=Math.fround(Ht(t)+(i&&this.maps.get(e)||0));if(!Number.isFinite(s))throw new Ot("Map value is not finite.");return this.maps.set(e,s),s}resolveTrigger(e,t=[],i=null,s=this.coordinateScale){var d,u,p,_,m,g,y,b,A,x,M,v,S,E,P,C,F,I,R,O,k,H,L,N,W,B,j,re,V,K,ie,ae,se,be,rt,Ee,He,Xe,Te,it,Mt,Bt,ft;if(e=e.toLowerCase(),i){let ve;const Ie=i.name.toLowerCase();if(["enemynear","enemy","p2"].includes(Ie)){const Ne=(((d=this.world)==null?void 0:d.entities)||[this.opponent]).filter(bt=>bt&&!bt.destroyed&&!bt.parent&&bt.teamSide!==this.teamSide);Ie==="enemynear"&&Ne.sort((bt,ei)=>Math.abs(bt.pos.x-this.pos.x)-Math.abs(ei.pos.x-this.pos.x)),ve=Ne[Math.trunc(i.args[0]||0)]}else if(Ie==="root")ve=this.root||this;else if(Ie==="parent")ve=this.parent;else if(Ie==="partner")ve=(((u=this.world)==null?void 0:u.entities)||[]).filter(Ne=>!Ne.parent&&Ne!==this.root&&Ne.teamSide===this.teamSide)[Math.trunc(i.args[0]||0)];else if(Ie==="helper")ve=this.ownedHelpers().find(Ne=>!i.args.length||Ne.helperId===+i.args[0]);else if(Ie==="target")ve=this.targets.find(Ne=>!i.args.length||(this.targetHitIds.get(Ne.id)??Ne.hitId)===+i.args[0]);else if(Ie==="playerid")ve=((p=this.world)==null?void 0:p.findPlayer(+i.args[0]))||[this,this.opponent,...this.helpers].find(Ne=>(Ne==null?void 0:Ne.id)===+i.args[0]);else throw new Error(`Unsupported redirection: ${Ie}`);if(!ve||ve.destroyed){const Ne=new Error(`Redirection ${Ie} has no matching player`);throw Ne.bottom=!0,Ne}return ve.resolveTrigger(e,t,i.child||null,s)}if(["var","fvar","sysvar","sysfvar"].includes(e)){const ve=this.variableArray(e),Ie=ht(t[0]);if(Ie<0||Ie>=ve.length)throw new Ot(`${e} index out of range: ${Ie}`);return ve[Ie]}const r=yp.get(e);if(r)return this[r];if(e==="map")return{value:this.maps.get(String(t[0]).toLowerCase())||0,float:!0};if(e==="pausetime")return Math.max(((m=(_=this.world)==null?void 0:_.pause)==null?void 0:m.remaining)||0,((y=(g=this.world)==null?void 0:g.superPause)==null?void 0:y.remaining)||0);if(e==="incustomstate")return+(this.stateOwner!==this);if(e==="ailevelf")return{value:Math.fround(this.aiLevel||0),float:!0};if(e==="standby")return 0;if(e==="gamemode")return((b=this.world)==null?void 0:b.gameMode)||"training";if(e==="attack")return this.constant("data.attack");if(e==="defence")return this.constant("data.defence");if(e==="sprpriority")return this.sprPriority;if(e==="receiveddamage")return this.moveType==="H"?this._receivedComboDamage:0;if(e==="receivedhits")return this.moveType==="H"?this._receivedComboHits:0;if(e==="inputtime"){if(!this.keyCtrl)return 0;const ve=String(t[0]??""),Ie=["f","b","u","d","l","r"].includes(ve.toLowerCase())?ve.toUpperCase():ve,Ne=Ie==="F"?this.facing===1?"R":"L":Ie==="B"?this.facing===1?"L":"R":Ie;return this._inputDurations.get(Ne)||0}if(e==="command")return+this.commands.has(String(t[0]));if(e==="const")return this.constant(t[0],s);if(e==="const240p")return Ht(t[0])/this.coordinateScale;if(e==="const480p")return Ht(t[0])/(2*this.coordinateScale);if(e==="const720p")return Ht(t[0])/(4*this.coordinateScale);if(e==="random")return this._seed^=this._seed<<13,this._seed^=this._seed>>>17,this._seed^=this._seed<<5,(this._seed>>>0)%1e3;if(e==="animexist"||e==="selfanimexist")return+(e==="selfanimexist"?this:this.scriptAnimationClock.animationOwner).animations.has(ht(t[0]));if(e==="animelemtime")return cp(this.scriptAnimation,this.scriptAnimationClock,ht(t[0]));if(e==="animelemno")return hp(this.scriptAnimation,this.scriptAnimationClock,Ht(t[0]||0));if(e==="gethitvar"){const ve=String(t[0]).toLowerCase();if(ve==="isbound")return+(!!this.bound&&!this.bound.target.destroyed);if(ve==="hittime")return this.hitTime;if(ve==="hitshaketime")return(A=this.world)!=null&&A.orderedPhases?this.getHitVars.hitshaketime||0:this.hitPauseTime;if(ve in this.getHitVars)return this.getHitVars[ve]*(Bu.has(ve)?this.coordinateScale/s:1);if(np.has(ve))return 0;throw new Error(`Unsupported GetHitVar field: ${ve}`)}if(e==="inguarddist")return+(this.world?this.inGuardDistance||!1:Lu(this,this.opponent?[this.opponent]:[]));const a=this.opponent,o=(x=this.world)==null?void 0:x.roundFlow,l=this.root===((M=this.world)==null?void 0:M.player)?"player":"opponent",c=!!(o!=null&&o.roundWinner)&&o.roundWinner===l,h=!!(o!=null&&o.roundWinner)&&o.roundWinner!=="draw"&&!c,f={animelem:this.scriptAnimationClock.frameIndex+1,alive:+this.alive,gametime:((v=this.world)==null?void 0:v.ticks)??this.gameTime,hitshakeover:+(((S=this.world)!=null&&S.orderedPhases?this.getHitVars.hitshaketime||0:this.hitPauseTime)===0),hitover:+(this.hitTime<0),movereversed:this.moveReversed||0,numhelper:this.ownedHelpers().length,numexplod:this.explods.length,numtarget:this.targets.length,numenemy:a?1:0,numpartner:0,ishelper:+!!this.parent,roundstate:this.roundState??2,roundsexisted:this.roundsExisted??0,roundno:this.roundNo??1,matchno:this.matchNo??1,matchover:+!!((E=this.world)!=null&&E.matchOver),teamside:this.teamSide??this.id,teampower:this.power,tickspersecond:60,aiLevel:this.aiLevel||0,ailevel:this.aiLevel||0,palno:this.paletteNo||1,teammode:"single",ishometeam:+(this.teamSide===1),authorname:((C=(P=this.character.def)==null?void 0:P.info)==null?void 0:C.author)||"",numproj:(((F=this.world)==null?void 0:F.projectiles)||[]).filter(ve=>ve.owner===this&&!ve.removing&&!ve.removed).length,win:o?+c:+(this.roundState===4&&this.alive&&(a==null?void 0:a.life)<=0),lose:o?+h:+(this.roundState===4&&!this.alive),drawgame:o?+(o.roundWinner==="draw"):+(this.roundState===4&&!this.alive&&(a==null?void 0:a.life)<=0),winko:+(c&&o.reason!=="time"),wintime:+(c&&o.reason==="time"),winperfect:+(c&&this.life===this.maxLife),loseko:+(h&&o.reason!=="time"),losetime:+(h&&o.reason==="time"),loseperfect:+(h&&(a==null?void 0:a.life)===(a==null?void 0:a.maxLife)),camerazoom:this.cameraZoom??1,gamewidth:(((I=this.world)==null?void 0:I.view.width)??320)/s,gameheight:(((R=this.world)==null?void 0:R.view.height)??240)/s,screenwidth:320/s,screenheight:(((O=this.world)==null?void 0:O.view.displayHeight)??240)/s,leftedge:(((k=this.world)==null?void 0:k.view.left)??-160)/s,rightedge:(((H=this.world)==null?void 0:H.view.right)??160)/s,topedge:(((L=this.world)==null?void 0:L.view.top)??-240)/s,bottomedge:(((N=this.world)==null?void 0:N.view.bottom)??0)/s,frontedge:(this.facing===1?((W=this.world)==null?void 0:W.view.right)??160:((B=this.world)==null?void 0:B.view.left)??-160)/s,backedge:(this.facing===1?((j=this.world)==null?void 0:j.view.left)??-160:((re=this.world)==null?void 0:re.view.right)??160)/s,canrecover:+(!!this.getHitVars.fall&&this.getHitVars["fall.recover"]!==0&&(this.getHitVars["fall.time"]||0)>=(this.getHitVars["fall.recovertime"]??4)),hitfall:this.getHitVars.fall||0,"hitvel x":(this.getHitVars.xvel||0)*this.coordinateScale/s,"hitvel y":(this.getHitVars.yvel||0)*this.coordinateScale/s,"pos x":(this.pos.x-(((V=this.cameraPos)==null?void 0:V.x)||0))/s,"pos y":this.pos.y/s,"vel x":this.vel.x/s,"vel y":this.vel.y/s,"screenpos x":(this.pos.x-(((K=this.world)==null?void 0:K.view.left)??-160))/s,"screenpos y":(this.pos.y-(((ie=this.world)==null?void 0:ie.view.top)??-240))/s,"camerapos x":(((ae=this.cameraPos)==null?void 0:ae.x)||0)/s,"camerapos y":(((se=this.cameraPos)==null?void 0:se.y)||0)/s};if(e==="stagevar"){if(!((be=this.world)!=null&&be.stage))throw Error("StageVar requires an imported stage.");return this.world.stage.variable(t[0])}if(e==="ishelper"&&t.length)return+(!!this.parent&&this.helperId===+t[0]);if(e==="numprojid")return(((rt=this.world)==null?void 0:rt.projectiles)||[]).filter(ve=>ve.owner===this&&!ve.removing&&!ve.removed&&ve.projId===Math.max(0,Math.trunc(+t[0]))).length;if(/^proj(contact|hit|guarded|cancel)time$/.test(e)){const ve=e.slice(4,-4),Ie=Math.max(0,+t[0]||0),Ne=this.projectileHistory.at(-1);return Ne&&(!Ie||Ne.projId===Ie)&&(ve==="contact"?["hit","guarded"].includes(Ne.type):Ne.type===ve)?(((Ee=this.world)==null?void 0:Ee.ticks)??this.gameTime)-Ne.tick:-1}if(/^(parentdist|rootdist) [xy]$/.test(e)){const ve=this.parent?e.startsWith("parent")?this.parent:this.root:null;if(!ve||ve.destroyed||e.startsWith("parent")&&!ve.alive){const Ne=Error("No live parent or root");throw Ne.bottom=!0,Ne}const Ie=e.at(-1);return(ve.pos[Ie]-this.pos[Ie])*(Ie==="x"?this.facing:1)/s}if(e==="numexplod"&&t.length)return this.explods.filter(ve=>ve.id===+t[0]).length;if(e==="numhelper"&&t.length)return this.ownedHelpers().filter(ve=>+t[0]<=0||ve.helperId===+t[0]).length;if(e==="numtarget"&&t.length)return this.targets.filter(ve=>!ve.destroyed&&(+t[0]<0||(this.targetHitIds.get(ve.id)??ve.hitId)===+t[0])).length;if(e==="playeridexist")return+((He=this.world)!=null&&He.findPlayer(+t[0])||[this,a,...this.helpers].find(ve=>(ve==null?void 0:ve.id)===+t[0]&&!ve.destroyed)?1:0);if(["frontedgedist","backedgedist","frontedgebodydist","backedgebodydist"].includes(e)){const ve=e.startsWith("front"),Ie=this.facing*(ve?1:-1);if((Xe=this.world)!=null&&Xe.orderedPhases)return Jf(this,Ie,{body:e.includes("body"),scale:s});const Ne=Ie>0?((Te=this.world)==null?void 0:Te.view.right)??this.options.rightBound??160:((it=this.world)==null?void 0:it.view.left)??this.options.leftBound??-160;let bt=(Ie>0?Ne-this.pos.x:this.pos.x-Ne)/s;return e.includes("body")&&(bt-=aa(this,Ie,{edge:!0})/s),bt}if(e==="p1name")return this.name;if(["p2name","p3name","p4name"].includes(e)){const ve=(((Mt=this.world)==null?void 0:Mt.entities)||[this,a]).filter(Ne=>Ne&&!Ne.destroyed&&!Ne.parent),Ie=e==="p2name"?a:e==="p3name"?ve.find(Ne=>Ne!==this.root&&Ne.teamSide===this.teamSide):ve.filter(Ne=>Ne.teamSide!==this.teamSide)[1];return(Ie==null?void 0:Ie.name)??{absent:!0}}if(["p2life","p2stateno","p2statetype","p2movetype","p2bodydist x","p2dist x","p2bodydist y","p2dist y"].includes(e)&&!a)throw new Ot(`${e}: P2 does not exist.`);if(e==="p2life")return a.life;if(e==="p2stateno")return a.stateNo;if(e==="p2statetype")return a.stateType;if(e==="p2movetype")return a.moveType;if(e==="p2bodydist x"||e==="p2dist x"){if(!a)return 0;let ve=(a.pos.x-this.pos.x)*this.facing/s;if(e==="p2bodydist x"){const Ie=ve>=0;ve-=aa(this,this.facing)/s+(Ie?1:-1)*aa(a,Ie?-this.facing:this.facing)/s}return ve}if(e==="p2bodydist y"||e==="p2dist y")return a?(a.pos.y-this.pos.y)/s:0;if(e==="hitdefattr"||e==="reversaldefattr"){const ve=e==="reversaldefattr"?(Bt=this.reversalDef)==null?void 0:Bt["reversal.attr"]:(ft=this.hitDef)==null?void 0:ft.attr;return!ve||e==="hitdefattr"&&this.moveType!=="A"?0:+Za(t.map(String).join(","),ve)}if(Object.hasOwn(f,e))return f[e];throw new bn(`Unsupported trigger: ${e}`)}parameter(e,t=this._executing,i=!1){try{return this.evaluate(e,t,i)}catch(s){if(!s.bottom)throw s;return this.diagnostic("parameter-bottom",`${e}: ${s.message} Parameter set to 0.`,t),i?{value:0,float:!1}:0}}value(e,t,i){var o;const s=e.values[t];if(s===void 0)return i;if((t==="ignorehitpause"||t==="persistent")&&!(t==="ignorehitpause"&&e.language==="zss"&&e.type==="explod")){const l=Qs(e);if(l.errors.some(c=>c.message.startsWith(t)))throw Error(l.errors.find(c=>c.message.startsWith(t)).message);return l[t]}let r=(o=this._parameterCache)==null?void 0:o.get(e);if(this._parameterCache&&!r&&this._parameterCache.set(e,r=new Map),r!=null&&r.has(t))return r.get(t);const a=this.parameter(s,e);return r==null||r.set(t,a),a}vector(e,t,i=[0,0]){var o;const s=e.values[t];if(s===void 0)return[...i];let r=(o=this._parameterCache)==null?void 0:o.get(e);if(this._parameterCache&&!r&&this._parameterCache.set(e,r=new Map),r!=null&&r.has(t))return[...r.get(t)];const a=Zi(s).map(l=>Ht(this.parameter(l,e)));return r==null||r.set(t,a),a}text(e,t,i=""){return kn(e.values[t]??i)}changeAnimation(e,t=1,i=this){var o;if(e=ht(e),e<0&&(this.diagnostic("animation-value","Negative animation number; using action 0."),e=0),!i.animations.has(e)){const l=this._initializing&&this.stateNo===5900&&e===5900?[...i.animations.keys()].filter(c=>c>5900&&c<6e3).sort((c,h)=>c-h)[0]:void 0;if(l!==void 0)e=l;else return this.diagnostic("missing-animation",`Animation ${e} does not exist.`),!1}const s=i.animations.get(e).frames,r=ht(t)-1,a=r>=0&&r<s.length?r:0;if(this._inPausedAnimation||(this._pausedAnimation=null),this._animationSerial++,this.animationOwner=i,this.anim=e,this.frameIndex=a,this.frameTime=0,this.animationEnded=!1,this.animationTime=((o=sr(i.animations.get(e)))==null?void 0:o.offsets[a])||0,this.animationCycleTime=this.animationTime,this.animationLooped=!1,this._animationLoopReset=!1,this._inPausedAnimation){const l=Ja(this);this._pausedAnimation.draw=l,this._pausedAnimation.visible={...l,frameIndex:a-1,frameTime:a>0?Math.max(1,s[a-1].ticks)-1:-1,animationTime:this.animationTime-1,animationCycleTime:this.animationCycleTime-1}}return!0}changeState(e,t,i=this.stateOwner||this){var h,f,d,u;e=ht(e);const s=i.program.states.get(e);if(!s)return this.diagnostic("missing-state",`State ${e} does not exist.`),!1;if((h=this.world)!=null&&h.orderedPhases&&(this.world.contactPhase||this.world.activeActor!==this&&((f=this.world._entities)!=null&&f.includes(this))))return this._pendingStateEntry={number:e,ctrl:t,owner:i,oldState:((d=this._pendingStateEntry)==null?void 0:d.oldState)??this.stateNo,oldOwner:((u=this._pendingStateEntry)==null?void 0:u.oldOwner)??this.stateOwner},this.prevStateNo=this.stateNo,this.stateNo=e,this.stateOwner=i,this.time=0,!0;if(++this._changeCount>64)return this.diagnostic("state-loop","More than 64 state changes in one tick; execution stopped."),!1;const r=this.stateOwner.program.states.get(this.stateNo);this.stateOwner=i,Qf(this,Ut(i)),this.prevStateNo=this.stateNo,this.stateNo=e,this.time=0,t!==void 0&&ht(t)>=0&&(this.ctrl=+Kt(ht(t))),this._entrySerial++,this._controllerCounts.clear();let a=!1,o=!1,l=!1;try{a=Kt(this.value(s,"hitdefpersist",0)),o=Kt(this.value(s,"movehitpersist",0)),l=Kt(this.value(s,"hitcountpersist",0))}catch{}a||(this.hitDef=null,this.reversalDef=null),o||(this.moveContact=0,this.moveHit=0,this.moveGuarded=0,this.moveReversed=0),l||(this.hitCount=0,this.uniqHitCount=0,this._lastHitCountTick=null);const c=this.moveType;this.moveType="I",this._executing=s;try{const p=this.text(s,"type","S").toUpperCase(),_=this.text(s,"physics","N").toUpperCase();if(p!=="U"&&(this.stateType=p),_!=="U"&&(this.physics=_),s.values.movetype){const m=this.text(s,"movetype").toUpperCase();this.moveType=m==="U"?c:m}if(s.values.ctrl!==void 0&&(this.ctrl=+Kt(this.value(s,"ctrl",this.ctrl))),s.values.anim!==void 0){const m=ht(this.value(s,"anim",-1));m!==-1&&this.changeAnimation(m)}if(s.values.velset!==void 0){const[m=0,g=0]=this.vector(s,"velset");this.vel={x:m*this.coordinateScale,y:g*this.coordinateScale}}s.values.sprpriority!==void 0&&(this.sprPriority=ht(this.value(s,"sprpriority",0))),s.values.juggle!==void 0&&(this.juggleCost=Math.max(0,ht(this.value(s,"juggle",0))),this._juggleSerial++),s.values.poweradd!==void 0&&(this.power=ci(this.power+this.value(s,"poweradd",0),0,this.maxPower)),Kt(this.value(s,"facep2",0))&&this.opponent&&(this.facing=this.opponent.pos.x>=this.pos.x?1:-1)}catch{}return this._executing=null,this.events.push({type:"state",state:e,previous:r==null?void 0:r.id}),!0}shouldRun(e,t){const i=Qs(e);if(i.errors.length||t&&!i.ignorehitpause)return!1;const s=e.entries.filter(c=>c.key==="triggerall");for(const c of s)try{if(!Kt(this.evaluate(c.value,{...e,line:c.line})))return!1}catch{return!1}const r=i.groups;let a=!1;for(const[,c]of[...r].sort(([h],[f])=>h-f)){let h=!0;for(const f of c)try{if(!Kt(this.evaluate(f.value,{...e,line:f.line}))){h=!1;break}}catch{h=!1;break}if(h){a=!0;break}}if(!a)return!1;const o=i.persistent,l=this._controllerCounts.get(e)||0;return this._controllerCounts.set(e,l+1),o===0?l===0:l%o===0}runState(e,t,i=this.stateOwner){const s=i.program.states.get(e);if(!s)return;if(s.zssNodes){vp(this,s,i,t);return}const r=this._entrySerial;for(const a of s.controllers){const o=this._scriptOwner;this._scriptOwner=i,this._executing=a;try{this.shouldRun(a,t)&&this.execute(a)}catch(l){this.diagnostics.some(c=>c.message.includes(l.message)&&c.source===a.source)||this.diagnostic("controller",l.message,a)}if(this._executing=null,this._scriptOwner=o,this.destroyed||this._entrySerial!==r)break}}movementHeld(e){var r;if(!((r=this.world)!=null&&r.manageInputs))return this.commands.has(e);const t=this.rawInput,i=this.facing<0?"L":"R",s=this.facing<0?"R":"L";return e==="holdup"?t.has("U")&&!t.has("D"):e==="holddown"?t.has("D")&&!t.has("U"):e==="holdfwd"?t.has(i)&&!t.has(s):e==="holdback"?t.has(s)&&!t.has(i):!1}automaticTransitions(){var r,a,o,l,c,h,f;if(!this.ctrl||this.moveType==="H"||!this.alive||this.stateOwner!==this||this.parent&&!this.keyCtrl||(r=this.world)!=null&&r.roundFlow&&this.world.roundFlow.roundState!==2)return;const e=this.movementHeld("holddown"),t=this.movementHeld("holdup"),i=this.movementHeld("holdfwd")||this.movementHeld("holdback"),s=this.movementHeld("holdback")&&!this.asserted.has("noautoguard")&&!!this.resolveTrigger("inguarddist");if(!(s&&((a=this.world)!=null&&a.orderedPhases)&&[120,130,131,132,140].includes(this.stateNo))){if(s&&![120,130,131,132,140].includes(this.stateNo)){const d=this.stateType==="A"?"noairguard":this.stateType==="C"?"nocrouchguard":"nostandguard",u=(o=this.world)!=null&&o.orderedPhases?120:this.stateType==="A"?132:this.stateType==="C"?131:120;if(!this.asserted.has(d)&&this.program.states.has(u)){this.changeState(u);return}}if(!this.asserted.has("noautoturn")&&((c=(l=this.world)==null?void 0:l.stage)==null?void 0:c.definition.autoturn)!==!1&&this.stateType!=="A"&&this.opponent&&[0,10,11,12,20].includes(this.stateNo)){const d=this.opponent.pos.x>=this.pos.x?1:-1;d!==this.facing&&(this.facing=d)}if(this.stateType==="A"){t&&!this._previousUp&&this.airJumps<this.constant("movement.airjump.num")&&-this.pos.y>=this.constant("movement.airjump.height")&&this.program.states.has(45)&&(this.airJumps++,this.changeState(45));return}if(t&&!this.asserted.has("nojump")&&this.program.states.has(40)){this.changeState(40);return}if(e&&this.stateType==="S"&&!this.asserted.has("nocrouch")&&this.program.states.has(10)){this.changeState(10);return}if(!e&&this.stateType==="C"&&((h=this.world)!=null&&h.orderedPhases||[10,11].includes(this.stateNo))&&this.program.states.has(12)){this.changeState(12);return}!this.asserted.has("nowalk")&&this.stateType==="S"&&this.moveType==="I"&&(i&&((f=this.world)!=null&&f.orderedPhases?this.stateNo!==20&&this.stateNo!==100:this.stateNo===0)&&this.program.states.has(20)?this.changeState(20):!i&&this.stateNo===20&&this.changeState(0))}}tick({commands:e=new Set,opponent:t=null,paused:i=!1,input:s=null}={}){var d;const r=(d=this.world)==null?void 0:d.orderedPhases;this._zssSteps=0;let a=!1;if(r&&!i&&this._pausedAnimation&&(this._pausedAnimation.serial===this._animationSerial?(Vc(this,this._pausedAnimation.logic),a=!0):this._pausedAnimation=null),i||(this._changeCount=0),r&&!i&&this._pendingHitTransform){const u=this._pendingHitTransform;this._pendingHitTransform=null,u.facing!==void 0&&(this.facing=u.facing);for(const p of["x","y"])u[p]!==void 0&&(this.pos[p]=u[p])}const o=this._animationSerial;if(r&&this._pendingStateEntry&&!i){const u=this._pendingStateEntry;this._pendingStateEntry=null,this.stateNo=u.oldState,this.stateOwner=u.oldOwner,this.changeState(u.number,u.ctrl,u.owner)}if(this.events=[],this.commands=e,this.opponent=t,rp(this,s,e),this.keyCtrl){const u=new Set(s||[]),p=new Set([...this._inputDurations.keys(),...u]);for(const _ of p){const m=this._inputDurations.get(_)||0,g=u.has(_);this._inputDurations.set(_,g?m>0?Math.min(m+1,36e4):1:m<0?Math.max(m-1,-36e4):-1)}}const l=this.asserted.has("animfreeze");if(this.destroyed||(this.asserted=new Set,this._executing=null,this.runState(-4,!1,this)),i||this.destroyed)return this.world||this.updateExplods({forceFrozen:!0}),this.gameTime++,this.events;this._executing=null;const c=this.hitPauseTime>0,h=r&&(this.getHitVars.hitshaketime||0)>0&&this.moveType==="H";if(r)if(c){if(!this._pausedAnimation){const u=Ja(this);this._pausedAnimation={visible:u,draw:u,logic:null,serial:this._animationSerial},!a&&o===this._animationSerial&&!h&&!l&&!this.asserted.has("animfreeze")&&this.advanceAnimation()}this._inPausedAnimation=!0}else this._pausedAnimation=null,!a&&o===this._animationSerial&&!h&&!l&&!this.asserted.has("animfreeze")&&this.advanceAnimation();this.posFrozen=!1,c||(this.playerPush=!this.parent,this.screenBound=!this.parent,this.moveCamera={x:!this.parent,y:!this.parent},this._previousWidth=this.width,this.width=null),this.drawOffset={x:0,y:0},this.drawScale={x:1,y:1},this.trans=null,this.angleDraw=!1,this.moveContact>0&&!c&&this.moveContact++,this.moveHit>0&&!c&&this.moveHit++,this.moveGuarded>0&&!c&&this.moveGuarded++,this.moveReversed>0&&!c&&this.moveReversed++;for(let u=0;u<2;u++){const p=this.hitFilters[u];(p==null?void 0:p.time)>0&&--p.time===0&&(this.hitFilters[u]=null)}for(const[u,p]of this.hitOverrides)p.time>0&&--p.time===0&&this.hitOverrides.delete(u);if(this.parent||(this.stateOwner===this&&this.runState(-3,c,this),this.runState(-2,c,this)),this.keyCtrl&&this.stateOwner===this&&!this._initializing&&this.runState(-1,c,this.parent?this.root:this),this.destroyed)return this.finishPausedAnimation(),this.gameTime++,this.events;!c&&!this._initializing&&this.automaticTransitions(),!c&&this.stateNo===5110&&this.time>=1&&this.alive&&(this.getHitVars.recovertime??1)<=0&&this.stateOwner.program.states.has(5120)&&this.changeState(5120);let f;do f=this._entrySerial,this._initializing&&this.options.skipIntro&&[190,191].includes(this.stateNo)?(this.changeState(0),this.ctrl=1):this.runState(this.stateNo,c);while(f!==this._entrySerial&&this._changeCount<=64);if(this.destroyed)return this.finishPausedAnimation(),this.gameTime++,this.events;if(c||(this._initializing=!1),r&&!c&&this._animationLoopReset&&(this.animationTime=this.animationCycleTime,this._animationLoopReset=!1),this.collisionFrame=this.currentFrame,this.collisionAnimationOwner=this.animationOwner,c)return r&&(this.finishPausedAnimation(),this.syncAnimationFrame(this._pausedAnimation.draw)),zc(this,{hitPaused:!0}),this.world||this.updateExplods({hitPaused:!0}),this.getHitVars.damage=0,this.hitPauseTime=Math.max(0,this.hitPauseTime-1),this.gameTime++,this.events;if(!this.posFrozen&&!this.bound&&!h&&(this.pos.x+=this.vel.x*this.facing+(r?0:this.cornerPush),this.pos.y+=this.vel.y,r&&(this.pos.x=Math.fround(this.pos.x),this.pos.y=Math.fround(this.pos.y))),r||(this.cornerPush*=ci(this.constant("movement.stand.friction"),0,1),Math.abs(this.cornerPush)<.01&&(this.cornerPush=0)),!h&&this.physics==="A")this.vel.y+=(r?Math.fround(this.constant("movement.yaccel")):this.constant("movement.yaccel"))*this.coordinateScale,r&&(this.vel.y=Math.fround(this.vel.y)),this.pos.y>=0&&this.vel.y>0&&!(r&&this.stateNo===105)&&(this.pos.y=0,this.vel.y=0,this.airJumps=0,this.program.states.has(52)&&this.changeState(52));else if(!h&&(this.physics==="S"||this.physics==="C")&&(r||![20,100].includes(this.stateNo))){const u=this.physics==="C"?"crouch":"stand",p=this.constant("movement."+u+".friction");if(this.vel.x*=r?Math.fround(p):p,r&&(this.vel.x=Math.fround(this.vel.x)),r){const _=u==="stand"?1:this.constant("movement.crouch.friction.threshold");Math.abs(this.vel.x)<_*this.coordinateScale&&(this.vel.x=0)}}return this.updateBinding(),this.syncAnimationFrame(),r||this.advanceAnimation(),this.world||this.updateExplods(),h&&(this.getHitVars.hitshaketime=Math.max(0,this.getHitVars.hitshaketime-1)),zc(this,{hitPaused:r&&(this.getHitVars.hitshaketime||0)>0}),this.getHitVars.damage=0,this.time++,this.gameTime++,this._previousUp=this.movementHeld("holdup"),this.events}finishPausedAnimation(){if(!this._inPausedAnimation)return;const e=this._pausedAnimation;e.logic=Ja(this),e.serial=this._animationSerial,this._inPausedAnimation=!1,Vc(this,e.visible)}syncAnimationFrame(e=this){var t;this.collisionAnimationOwner=e.animationOwner,this.collisionAnimation=(e.animationOwner||this).animations.get(e.anim),this.collisionFrame=((t=this.collisionAnimation)==null?void 0:t.frames[e.frameIndex])||null,this.collisionFrameIndex=e.frameIndex,this.collisionFrameTime=e.frameTime}advanceAnimation(){var i,s;const e=this.animation,t=this.currentFrame;if(t){if(t.ticks<0){(i=this.world)!=null&&i.orderedPhases&&(this.frameTime++,this.animationTime++,this.animationCycleTime++);return}this.animationEnded&&(this.animationEnded=!1),this.frameTime++,this.animationTime++,this.animationCycleTime++,this.frameTime>=Math.max(1,t.ticks)&&(this.frameTime=0,this.frameIndex++,this.frameIndex>=e.frames.length&&(this.frameIndex=e.loopStart??e.loopstart??0,this.animationEnded=!0,this.animationLooped=!0,this.animationCycleTime=sr(e).offsets[this.frameIndex]||0,(s=this.world)!=null&&s.orderedPhases&&(this._animationLoopReset=!0)))}}execute(e){const t=Qs(e).errors.find(s=>!s.message.includes("trigger1"));if(t)throw Error(t.message);const i=this._parameterCache;this._parameterCache=new WeakMap;try{return this.executeController(e)}finally{this._parameterCache=i}}executeController(e){var o,l,c,h,f,d;const t=e.type,i=(u,p=0)=>Ht(this.value(e,u,p)),s=(u,p=0)=>ht(this.value(e,u,p)),r=(u,p=[0,0])=>this.vector(e,u,p),a=(u,p="")=>this.text(e,u,p);if(!va.has(t)){this.diagnostic("unsupported-controller",`Controller ${t||"(missing type)"} is not implemented.`,e);return}if(t!=="null"){if(["mapset","mapadd","rootmapset","rootmapadd"].includes(t)){const u=t.startsWith("root")?this.parent?this.root:null:this;u&&!u.destroyed&&u.setMap(a("map"),i("value"),t.endsWith("add"));return}if(t==="modifyplayer"){const u=new Set(["type","trigger1","pausemovetime","supermovetime"]);e.values.pausemovetime!==void 0&&(this.pauseMoveTime=Math.max(0,s("pausemovetime"))),e.values.supermovetime!==void 0&&(this.superMoveTime=Math.max(0,s("supermovetime")));for(const p of Object.keys(e.values))u.has(p)||this.diagnostic("unsupported-modifyplayer-parameter",`ModifyPlayer parameter ${p} is not implemented.`,e);return}if(t==="assertinput"){if(!((o=this.world)!=null&&o.manageInputs)){this.diagnostic("unsupported-input-routing","AssertInput needs the independent input scheduler.");return}for(const u of e.entries)if(/^flag\d*$/.test(u.key))for(const p of this.text(e,u.key).split(/[+|\s,]+/).filter(Boolean)){const _={up:"U",down:"D",forward:"F",fwd:"F",back:"B",start:"s"},m=_[p.toLowerCase()]||p;if(!["U","D","F","B","a","b","c","x","y","z","s"].includes(m)){this.diagnostic("unsupported-input",`Input flag ${p} is not implemented.`,e);continue}this.pendingAssertedInputs.add(m)}return}if(["displaytoclipboard","appendtoclipboard","clearclipboard"].includes(t)){if(t==="clearclipboard"){this.clipboard="";return}const u=Bf(e.values.text||""),p=e.values.params===void 0?[]:Zi(e.values.params);if(p.length!==u.count)throw Error(`Clipboard format requires ${u.count} parameters, received ${p.length}.`);const _=Hf(u,p.map(m=>this.parameter(m,e,!0)));this.clipboard=(t==="appendtoclipboard"&&this.clipboard?this.clipboard+`
`+_:_).slice(-8192);return}if(t==="victoryquote"){if(!this.parent){const u=s("value",-1);u!==this.victoryQuoteIndex&&(this.victoryQuote=null),this.victoryQuoteIndex=u}return}if(t==="forcefeedback"){this.events.push({type:t,...Vf(e.values)});return}if(t==="gamemakeanim"||t==="makedust"){if(t==="makedust"){const u=s("spacing",3);if(u<1)throw Error("MakeDust spacing must be at least 1.");const p=this._dustTicks.get(e);if((p==null?void 0:p.entry)===this._entrySerial&&this.gameTime-p.time<u)return;this._dustTicks.set(e,{entry:this._entrySerial,time:this.gameTime}),this.gameAnimation(120,r("pos"),!0,0,e),e.values.pos2!==void 0&&this.gameAnimation(120,r("pos2"),!0,0,e)}else this.gameAnimation(s("value",0),r("pos"),!!i("under"),Math.max(0,s("random")),e);return}if(t==="changestate"||t==="selfstate"){const u=s("value"),p=e.values.ctrl===void 0?void 0:s("ctrl"),_=e.values.anim===void 0?void 0:s("anim"),m=t==="selfstate"?this:this.stateOwner;m.program.states.has(u)&&_!==void 0&&_!==-1&&this.changeAnimation(_),this.changeState(u,p,m);return}if(t==="changeanim"||t==="changeanim2"){this.changeAnimation(s("value"),s("elem",1),t==="changeanim2"?this.stateOwner:this);return}if(t==="ctrlset"){this.ctrl=+Kt(i("value"));return}if(t==="statetypeset"){for(const[u,p]of[["statetype","stateType"],["movetype","moveType"],["physics","physics"]])if(e.values[u]!==void 0){const _=a(u).toUpperCase();_!=="U"&&(this[p]=_)}return}if(/^(vel|pos)(set|add|mul)$/.test(t)){const u=t.startsWith("vel")?this.vel:this.pos,p=t.slice(3);for(const _ of["x","y"])if(e.values[_]!==void 0){const m=i(_)*(p==="mul"?1:this.coordinateScale);p==="set"?u[_]=m+(t==="posset"&&_==="x"&&((l=this.cameraPos)==null?void 0:l.x)||0):p==="add"?u[_]+=m*(t==="posadd"&&_==="x"?this.facing:1):u[_]*=m,(c=this.world)!=null&&c.orderedPhases&&(u[_]=Math.fround(u[_]))}return}if(t==="gravity"){this.vel.y+=this.constant("movement.yaccel")*this.coordinateScale;return}if(t==="turn"){(h=this.world)!=null&&h.orderedPhases&&this.vel.x!==0&&(this.vel.x=-this.vel.x),this.facing*=-1;return}if(t==="posfreeze"){this.posFrozen=Kt(i("value",1));return}if(t==="helper"){if(!this.world)throw Error("Helper requires a match world.");this.world.spawnHelper(this,this.entityParameters(e));return}if(t==="projectile"){if(!this.world)throw Error("Projectile requires a match world.");const u=new Set(["velocity","remvelocity","accel","velmul","offset","postype","supermovetime","pausemovetime","ownpal","remappal"]),p=e.entries.filter(m=>!m.key.startsWith("proj")&&!m.key.startsWith("afterimage.")&&!u.has(m.key)),_=this.parseHitDef({...e,entries:p,values:Object.fromEntries(p.map(m=>[m.key,m.value]))});this.world.spawnProjectile(this,{...this.entityParameters(e,!0),hitDef:_});return}if(t==="pause"||t==="superpause"){if(!this.world)throw Error(`${t} requires a match world.`);const u=this.entityParameters(e);u.coordinateScale=this.coordinateScale,u.type=t,u.time??(u.time=t==="superpause"?30:0),u.animCommon=!/^s/i.test(e.values.anim||""),u.soundCommon=!/^s/i.test(e.values.sound||""),this.world.requestPause(this,u);return}if(t==="trans"){this.trans={mode:a("trans","default").toLowerCase(),alpha:r("alpha",[256,0])};return}if(t==="movehitreset"){this.moveContact=this.moveHit=this.moveGuarded=0;return}if(t==="attackdist"){this.attackDist=i("value"),this.hitDef&&(this.hitDef["guard.dist"]=this.attackDist*this.coordinateScale/(this.hitDef.coordinateScale??this.coordinateScale));return}if(t==="remappal"){const u=b=>{const A=r(b,[-1,0]);return[ht(A[0]),ht(A[1]??0)]},p=u("source"),_=u("dest"),m=p[0]===-1?"*":p.join(",");if(p[0]===-1&&_[0]===-1){this.paletteRemaps.clear();return}if(p[0]<-1||p[0]!==-1&&p[1]<0||_[0]<-1||_[0]!==-1&&_[1]<0)throw Error("Invalid RemapPal palette pair.");const g=_[0]===-1||p.join(",")===_.join(",");g||Pu(this.character,p,_);const y=g&&this.paletteRemaps.has("*")&&p[0]!==-1;if(p[0]!==-1&&(!g||y)&&!this.paletteRemaps.has(m)&&this.paletteRemaps.size>=8){this.diagnostic("resource-limit","RemapPal supports at most 8 simultaneous mappings.",e);return}p[0]===-1&&this.paletteRemaps.clear(),y?this.paletteRemaps.set(m,p):g?this.paletteRemaps.delete(m):this.paletteRemaps.set(m,_);return}if(t==="fallenvshake"){const u=this.getHitVars["fall.envshake.time"]||0;u>0&&this.events.push({type:"envshake",time:u,coordinateScale:this.coordinateScale,...Object.fromEntries(["ampl","freq","phase"].map(p=>[p,this.getHitVars["fall.envshake."+p]]))}),this.getHitVars["fall.envshake.time"]=0;return}if(["varset","varadd","varmul","parentvarset","parentvaradd"].includes(t)){const u=t.startsWith("parent")?this.parent:this;if(!u||u.destroyed)return;let p=e.entries.filter(_=>/^(var|fvar|sysvar|sysfvar)\s*\(/.test(_.key));if(!p.length){const _=e.values.sysfv!==void 0?"sysfvar":e.values.sysv!==void 0?"sysvar":e.values.fv!==void 0?"fvar":"var";p=[{key:`${_}(${s(_==="sysfvar"?"sysfv":_==="sysvar"?"sysv":_==="fvar"?"fv":"v")})`,value:e.values.value??"0"}]}for(const _ of p){const m=_.key.match(/^(var|fvar|sysvar|sysfvar)\s*\((.*)\)$/);if(!m)throw new Error(`Malformed variable target: ${_.key}`);const g=ht(this.parameter(m[2],e));let y=Ht(this.parameter(_.value,e));y=m[1].includes("fvar")?Math.fround(y):ht(y)|0;const b=u.resolveTrigger(m[1],[g]);t.endsWith("add")&&(y+=b),t.endsWith("mul")&&(y*=b),u.assignVariable(m[1],[g],y)}return}if(t==="varrandom"){const u=s("v"),p=r("range",[0,1e3]),[_,m]=p.length===1?[0,ht(p[0])]:p.map(ht);if(_>m)throw Error("VarRandom range requires least_val <= greatest_val.");this.resolveTrigger("random"),this.assignVariable("var",[u],_+Math.floor((this._seed>>>0)/4294967296*(m-_+1)));return}if(t==="varrangeset"){const u=e.values.fvalue!==void 0,p=u?this.fvars:this.vars,_=ci(s("first"),0,p.length-1),m=ci(s("last",p.length-1),0,p.length-1),g=i(u?"fvalue":"value");for(let y=_;y<=m;y++)this.assignVariable(u?"fvar":"var",[y],g);return}if(t==="lifeadd"||t==="lifeset"){let u=s("value");t==="lifeadd"&&(u=-yr(-u,null,this,{absolute:!!i("absolute")}),u+=this.life),this.life=ci(u,this.immortal||!i("kill",1)?1:0,this.maxLife);return}if(t==="poweradd"||t==="powerset"){this.power=ci(s("value")+(t==="poweradd"?this.power:0),0,this.maxPower);return}if(t==="attackmulset"){this.attackMultiplier=i("value",1);return}if(t==="defencemulset"){this.defenceMultiplier=i("value",1);return}if(t==="sprpriority"){this.sprPriority=s("value");return}if(t==="screenbound"){this.screenBound=Kt(i("value",0));const[u,p]=r("movecamera");this.moveCamera={x:!!u,y:!!p};return}if(t==="playerpush"){this.playerPush=Kt(i("value",1));return}if(t==="width"){if(e.values.value!==void 0&&(e.values.player!==void 0||e.values.edge!==void 0))throw Error("Width value cannot be combined with player or edge.");const u=e.values.value===void 0?[0,0]:r("value"),[p=0,_=0]=r("player",u),m=r("edge",u);this.width={front:ht(p),back:ht(_),edge:[ht(m[0]??0),ht(m[1]??0)]};return}if(t==="assertspecial"){const u=new Set(["nowalk","nojump","nocrouch","noautoturn","invisible","noshadow","unguardable","noairguard","nostandguard","nocrouchguard","nojugglecheck","intro","roundnotover","timerfreeze","noko","nobardisplay","nobg","nofg","nomusic","animfreeze","globalnoshadow"]);for(const p of["flag","flag2","flag3"])if(e.values[p]){const _=a(p).toLowerCase();this.asserted.add(_),u.has(_)||this.diagnostic("unsupported-flag",`AssertSpecial flag ${_} is not implemented.`,e)}return}if(t==="hitvelset"){i("x")&&(this.vel.x=(this.getHitVars.xvel||0)*this.coordinateScale),i("y")&&(this.vel.y=(this.getHitVars.yvel||0)*this.coordinateScale);return}if(t==="hitdef"){this.hitDef=null,this.reversalDef=null,this.hitDef=this.parseHitDef(e),this.events.push({type:"hitdef",hitDef:this.hitDef});return}if(t==="reversaldef"){if(this.reversalDef=null,e.values["reversal.attr"]===void 0)throw Error("ReversalDef requires reversal.attr.");if(!e.values["reversal.attr"].trim())return;Js(a("reversal.attr")),this.reversalDef=this.parseHitDef(e);return}if(t==="hitby"||t==="nothitby"){const u=["value","value2"].filter(m=>e.values[m]!==void 0);if(u.length!==1)throw Error(`${t} requires exactly one of value or value2.`);const p=s("time",1);if(p<-1||p>36e4)throw Error("Invalid hit-filter duration.");const _=Js(a(u[0]));this.hitFilters[u[0]==="value"?0:1]=p?{attribute:_,time:p,exclude:t==="nothitby"}:null;return}if(t==="hitoverride"){const u=s("slot"),p=s("time",1);if(u<0||u>7||p<-1||p>36e4)throw Error("HitOverride requires slot 0–7 and time -1 or greater.");if(!p||((f=e.values.attr)==null?void 0:f.trim())===""){this.hitOverrides.delete(u);return}if(e.values.attr===void 0||e.values.stateno===void 0)throw Error("HitOverride requires attr and stateno.");const _=a("attr"),m=Js(_);p?this.hitOverrides.set(u,{attr:_,attribute:m,stateNo:s("stateno"),time:p,forceAir:Kt(i("forceair"))}):this.hitOverrides.delete(u);return}if(xp.has(t)){if(t==="palfx"&&this.parent&&!this.ownPal)return;let u=this.effectParameters(e);if(["palfx","allpalfx","bgpalfx"].includes(t)&&(u=sa(u)),t==="playsnd"){const[p=0,_=0]=Array.isArray(u.value)?u.value:[u.value||0,0];Object.assign(u,{group:p,number:_,common:/^\s*f/i.test(e.values.value||""),volumeScale:u.volumescale,freqMul:u.freqmul})}this.events.push({type:t,...u,coordinateScale:this.coordinateScale,source:e.source,line:e.line});return}if(["explod","modifyexplod","removeexplod","explodbindtime"].includes(t)){this.explodController(e);return}if(t.startsWith("target")){const u=s("id",-1),p=this.targets.filter(x=>u===-1||(this.targetHitIds.get(x.id)??x.hitId)===u);if(t==="targetdrop"){const x=s("excludeid",-1),M=x<0?[]:this.targets.filter(S=>(this.targetHitIds.get(S.id)??S.hitId)===x);this.targets=i("keepone",1)?M.slice(0,1):M;const v=new Set(this.targets.map(S=>S.id));for(const S of this.targetHitIds.keys())v.has(S)||this.targetHitIds.delete(S);return}const _=["targetfacing","targetlifeadd","targetpoweradd","targetstate"].includes(t)?s("value"):void 0,m=t==="targetlifeadd"?i("kill",1):1,g=t==="targetlifeadd"?i("absolute"):0,y=t==="targetstate"&&e.values.ctrl!==void 0?i("ctrl"):void 0,b=t==="targetbind"?{pos:r("pos"),time:s("time",1)}:null,A=t==="targetvelset"||t==="targetveladd"?Object.fromEntries(["x","y"].filter(x=>e.values[x]!==void 0).map(x=>[x,i(x)*this.coordinateScale])):null;for(const x of p)if(t==="targetfacing")_&&(x.facing=this.facing*(_<0?-1:1));else if(t==="targetlifeadd"){const M=-yr(-_,this,x,{absolute:!!g});x.life=ci(x.life+M,m?0:1,x.maxLife)}else if(t==="targetpoweradd")x.power=ci(x.power+_,0,x.maxPower);else if(t==="targetstate")x.changeState(_,y,this._scriptOwner||this.stateOwner);else if(b){const[M=0,v=0]=b.pos;x.bound={target:this,x:M*this.coordinateScale,y:v*this.coordinateScale,time:b.time}}else for(const[M,v]of Object.entries(A||{}))x.vel[M]=v+(t==="targetveladd"?x.vel[M]:0);return}if(["bindtoroot","bindtoparent","bindtotarget"].includes(t)){if(t!=="bindtotarget"&&!this.parent)return;const u=s("id",-1),p=t==="bindtoroot"?this.root:t==="bindtoparent"?this.parent:this.targets.find(y=>u<0||(this.targetHitIds.get(y.id)??y.hitId)===u);if(!p||p.destroyed){if(t==="bindtoparent"&&this.parent){this.bound=null;return}throw new Error(`${t} has no matching player`)}let _=[0,0],m,g;if(t==="bindtotarget"){const y=Zi(e.values.pos||"0,0"),b=kn(y[2]||"foot").toLowerCase();if(y.length>3||!["foot","head","mid"].includes(b))throw Error("BindToTarget pos requires x, y, and Foot, Head or Mid.");[m,g]=y.slice(0,2).map(A=>Ht(this.evaluate(A,e))),m??(m=0),g??(g=0),b!=="foot"&&(_=["x","y"].map(A=>p.constant(`size.${b}.pos.${A}`)*p.coordinateScale))}else[m=0,g=0]=r("pos");this.bound={target:p,x:m*this.coordinateScale+_[0],y:g*this.coordinateScale+_[1],time:s("time",1),facing:i("facing")};return}if(t==="hitadd"){const u=s("value");this.hitCount=Math.max(0,this.hitCount+u),this.uniqHitCount=Math.max(0,this.uniqHitCount+u);const p=this.targets.at(-1)||(((d=this.opponent)==null?void 0:d.moveType)==="H"?this.opponent:null);p&&(p.comboHits=Math.max(0,(p.comboHits||0)+u));return}if(t==="hitcount"){this.hitCount=s("value");return}if(t==="hitfallset"){if(e.values.value!==void 0){const u=s("value",-1);u!==-1&&(u&&!this.getHitVars.fall&&(this.getHitVars["fall.time"]=0),this.getHitVars.fall=+!!u)}e.values.xvel!==void 0&&(this.getHitVars["fall.xvel"]=i("xvel"),this._fallXVelocityDefined=!0),e.values.yvel!==void 0&&(this.getHitVars["fall.yvel"]=i("yvel"));return}if(t==="hitfallvel"){if(this.moveType!=="H")return;this._fallXVelocityDefined&&(this.vel.x=(this.getHitVars["fall.xvel"]||0)*this.coordinateScale),this.vel.y=(this.getHitVars["fall.yvel"]||0)*this.coordinateScale;return}if(t==="hitfalldamage"){if(this.moveType==="H"){const u=yr(this.getHitVars["fall.damage"]||0,null,this);this.life=ci(this.life-u,this.life>0&&this.getHitVars["fall.kill"]===0?1:0,this.maxLife),this.getHitVars["fall.damage"]=0}return}if(t==="angleadd"){this.angle+=i("value");return}if(t==="angleset"){this.angle=i("value");return}if(t==="anglemul"){this.angle*=i("value",1);return}if(t==="angledraw"){this.angleDraw=!0;const[u=1,p=1]=r("scale",[1,1]);this.drawScale={x:u,y:p},e.values.value&&(this.angle=i("value"));return}if(t==="offset"){this.drawOffset={x:i("x")*this.coordinateScale,y:i("y")*this.coordinateScale};return}if(t==="destroyself"){if(!this.parent){this.diagnostic("unsupported-controller","DestroySelf is valid only for helpers.",e);return}const u=!!i("recursive"),p=!!i("removeexplods");this.world?this.world.destroyHelper(this,{recursive:u,removeExplods:p}):(this.destroyed=!0,p&&(this.explods=this.drawExplods=[]));return}this.diagnostic("unsupported-controller",`Controller ${t} is not implemented.`,e)}}selectVictoryQuote(){if(this.parent||this.victoryQuote!==null)return this.victoryQuote;const e=this.program.quotes;if(!(e!=null&&e.size))return null;const t=[...e.keys()],i=e.has(this.victoryQuoteIndex)?this.victoryQuoteIndex:t[Math.floor(this.resolveTrigger("random")/1e3*t.length)];return this.victoryQuote=e.get(i)}gameAnimation(e,t,i,s,r){if(e<0)return;if(!this.commonAnimations.has(e)){this.diagnostic("missing-animation",`Common effect animation ${e} is unavailable. Import its fightfx resources.`,r);return}const a=()=>s?(this.resolveTrigger("random")/999-.5)*s:0;this.events.push({type:"gameanim",anim:e,under:i,common:!0,facing:this.facing,pos:{x:this.pos.x+((t[0]||0)*this.facing+a())*this.coordinateScale,y:this.pos.y+((t[1]||0)+a())*this.coordinateScale}})}effectParameters(e){const t={},i=new Set(["waveform","postype","trans","helpertype","name","space"]);for(const s of e.entries){if(/^(type|triggerall|trigger\d+|persistent|ignorehitpause)$/.test(s.key))continue;if(i.has(s.key)&&!/^-?[\d.]+$/.test(s.value)){t[s.key]=kn(s.value);continue}if(s.key==="redirectid"){t[s.key]=this.parameter(s.value,e);continue}const a=Zi(s.value).map(o=>{const l=o.trim().replace(/^[sSfF](?=[\d(-])/,"");return this.parameter(l,e)});t[s.key]=a.length===1?a[0]:a}return t}entityParameters(e,t=!1){const i=new Set(["velocity","remvelocity","accel","velmul","offset","postype","supermovetime","pausemovetime","ownpal","remappal"]),s=t?e.entries.filter(r=>r.key.startsWith("proj")||r.key.startsWith("afterimage.")||i.has(r.key)):e.entries;if(t){const r=new Set(["projid","projanim","projhitanim","projremanim","projcancelanim","projscale","projremove","projremovetime","projhits","projmisstime","projpriority","projsprpriority","projedgebound","projstagebound","projheightbound","projshadow"]);for(const a of s)a.key.startsWith("proj")&&!r.has(a.key)&&this.diagnostic("unsupported-projectile",`Projectile parameter ${a.key} is not implemented.`,{...e,line:a.line})}return{...this.effectParameters({...e,entries:s}),source:e.source,line:e.line}}createHelper(e,{id:t}={}){e.helpertype&&e.helpertype!=="normal"&&this.diagnostic("unsupported-helper","Player-type helpers are deprecated by MUGEN 1.1; using a normal helper.");const{pos:i,facing:s}=Fu(this,e),r={...this.program,constants:new Map(this.program.constants)};for(const[l,c]of Object.entries(e))if(l.startsWith("size.")){const h=Oc(l)?this.coordinateScale/this.baseCoordinateScale:1,f=Array.isArray(c)?c.map(d=>d*h):c*h;r.constants.set(l,f),Array.isArray(f)&&(r.constants.set(l+".x",f[0]),r.constants.set(l+".y",f[1]))}const a=new _a(this.character,{program:r,expressionEvaluator:this.options.expressionEvaluator,commonAnimations:this.commonAnimations,world:this.world,id:t,position:i,facing:s,parent:this,root:this.root,helperId:Math.trunc(e.id||0),keyCtrl:!!e.keyctrl,ownPal:!!e.ownpal,teamSide:this.teamSide,pauseMoveTime:e.pausemovetime||0,superMoveTime:e.supermovetime||0});a.name=e.name||`${this.name}'s helper`,a.opponent=this.opponent,a.immortal=!!e.immortal;for(const[l,c]of Object.entries(e))l.startsWith("map.")&&a.setMap(l.slice(4),c);if(e.bindtime!==void 0){const l=ht(e.bindtime);if(l<-1||l>36e4)throw Error("Helper bindtime must be -1 or between 0 and 360000 ticks.");if(l!==0){const c=String(e.postype||"p1").toLowerCase(),h=c==="p2"?this.opponent:c==="p1"?this:null;if(h&&!h.destroyed){const[f=0,d=0]=Array.isArray(e.pos)?e.pos:[e.pos??0,0];a.bound={target:h,x:Ht(f)*this.coordinateScale,y:Ht(d)*this.coordinateScale,time:l,facing:Ht(e.facing??1)}}else(c==="p1"||c==="p2")&&a.diagnostic("missing-player","Helper bindtime target is unavailable.")}}e.ownpal&&(a._paletteRemaps=Xl(this.paletteRemaps)),e.ownpal&&this.events.push({type:"palettesnapshot",target:a});const o=new Set(["id","name","stateno","postype","pos","facing","bindtime","helpertype","keyctrl","ownpal","pausemovetime","supermovetime","remappal","immortal","source","line"]);for(const l of Object.keys(e))!o.has(l)&&!l.startsWith("size.")&&!l.startsWith("map.")&&a.diagnostic("unsupported-helper",`Helper parameter ${l} is not implemented.`);if(e.ownpal&&e.remappal!==void 0)try{$l(a.paletteRemaps,a.character,e.remappal)}catch(l){a.diagnostic("palette",l.message)}return a.changeState(e.stateno??0)?(this.helpers.push(a),a):(a.destroyed=!0,a)}parseHitDef(e){var l,c;const t=e.values,i={serial:++this._hitSerial,coordinateScale:this.coordinateScale,stateOwner:this._scriptOwner||this.stateOwner},s=new Set(["attr","reversal.attr","hitflag","guardflag","animtype","air.animtype","fall.animtype","ground.type","air.type","affectteam","priority"]);for(const h of e.entries)if(!/^(type|triggerall|trigger\d+|persistent|ignorehitpause)$/.test(h.key)){if(h.key==="priority"){const[f,d="Hit"]=Zi(h.value);i.priority=[ht(this.parameter(f,e)),kn(d)];continue}if(s.has(h.key)){i[h.key]=kn(h.value);continue}try{const f=Zi(h.value).map(d=>this.parameter(d.trim().replace(/^[sSfF](?=[\d(-])/,""),e));i[h.key]=f.length===1?f[0]:f}catch{throw new Error(`HitDef parameter ${h.key} could not be evaluated; attack disabled.`)}}const r=(h,f)=>Array.isArray(i[h])?i[h]:i[h]===void 0?[...f]:[i[h],f[1]??0];i.sprpriority!==void 0&&i.p1sprpriority===void 0&&(i.p1sprpriority=i.sprpriority),i.attr=i.attr??`${this.stateType}, NA`,i.id=ht(i.id??0),i.chainid=ht(i.chainid??-1);const a=i.nochainid===void 0?[-1,-1]:Array.isArray(i.nochainid)?i.nochainid:[i.nochainid,-1];if(a.length>2)throw Error("HitDef nochainID takes at most two IDs.");i.nochainid=a.map(ht),i.hitonce=i.hitonce===void 0?+/^[SCA]\s*,\s*[NSH]T$/i.test(i.attr):+Kt(Ht(i.hitonce)),i.damage=r("damage",[0,0]),i.pauseTime=r("pausetime",[0,0]),i.guardPauseTime=r("guard.pausetime",i.pauseTime),i.groundVelocity=r("ground.velocity",[0,0]),i.airVelocity=r("air.velocity",[0,0]),i.guardVelocity=r("guard.velocity",[i.groundVelocity[0],0]),i.airGuardVelocity=r("airguard.velocity",[i.airVelocity[0]*1.5,i.airVelocity[1]/2]),i.guardVelocity[1]=0,i["air.type"]??(i["air.type"]=i["ground.type"]??"high"),i.forcestand??(i.forcestand=+(i.groundVelocity[1]!==0)),i["down.velocity"]??(i["down.velocity"]=[...i.airVelocity]),i["down.hittime"]??(i["down.hittime"]=20),i["down.bounce"]??(i["down.bounce"]=0),i["ground.cornerpush.veloff"]??(i["ground.cornerpush.veloff"]=/^A\s*,/i.test(i.attr)?0:1.3*i.guardVelocity[0]);for(const h of["air","down","guard"])i[l=h+".cornerpush.veloff"]??(i[l]=i["ground.cornerpush.veloff"]);i["airguard.cornerpush.veloff"]??(i["airguard.cornerpush.veloff"]=i["guard.cornerpush.veloff"]),i.groundHitTime=i["ground.hittime"]??0,i.airHitTime=i["air.hittime"]??20,i.guardHitTime=i["guard.hittime"]??((c=this.world)!=null&&c.orderedPhases?i["ground.slidetime"]??0:i.groundHitTime),i["ground.slidetime"]??(i["ground.slidetime"]=0),i["guard.slidetime"]??(i["guard.slidetime"]=i.guardHitTime),i["guard.ctrltime"]??(i["guard.ctrltime"]=i["guard.slidetime"]),i["airguard.ctrltime"]??(i["airguard.ctrltime"]=i["guard.ctrltime"]),i.hitFlag=String(i.hitflag??"MAF").toUpperCase(),i.guardFlag=String(i.guardflag??"").toUpperCase(),i.fall=i.fall??0,i.kill=i.kill??1,i["guard.kill"]=i["guard.kill"]??1,i.source=e.source,i.line=e.line,i.juggleCost=this.juggleCost,i.juggleGroup=`${this.id}:${this._juggleSerial}`,i.sparkCommon=!/^s/i.test(t.sparkno||""),i.guardSparkCommon=!/^s/i.test(t["guard.sparkno"]||""),i.hitSoundCommon=!/^s/i.test(t.hitsound||""),i.guardSoundCommon=!/^s/i.test(t.guardsound||""),i.sparkno??(i.sparkno=this.constant("data.sparkno")),i["guard.sparkno"]??(i["guard.sparkno"]=this.constant("data.guard.sparkno"));const o=new Set(["attr","damage","pausetime","guard.pausetime","ground.velocity","air.velocity","guard.velocity","airguard.velocity","ground.hittime","air.hittime","guard.hittime","ground.slidetime","guard.slidetime","ground.ctrltime","guard.ctrltime","guardflag","hitflag","fall","forcenofall","kill","guard.kill","fall.kill","fall.damage","fall.xvelocity","fall.yvelocity","fall.recover","fall.recovertime","yaccel","animtype","air.animtype","ground.type","air.type","chainid","id","p1stateno","p2stateno","p2getp1state","p1facing","p1getp2facing","p2facing","p1sprpriority","p2sprpriority","sprpriority","numhits","getpower","givepower","priority","affectteam","guard.dist","down.velocity","down.hittime","air.fall","forcestand","air.juggle","fall.envshake.time","fall.envshake.ampl","fall.envshake.freq","fall.envshake.phase","sparkno","guard.sparkno","sparkxy","hitsound","guardsound","envshake.time","envshake.freq","envshake.ampl","envshake.phase","palfx.time","palfx.add","palfx.mul","palfx.sinadd","palfx.color","palfx.invertall"]);for(const h of["fall.animtype","mindist","maxdist","snap","ground.cornerpush.veloff","air.cornerpush.veloff","down.cornerpush.veloff","guard.cornerpush.veloff","airguard.cornerpush.veloff","airguard.ctrltime"])o.add(h);o.add("hitonce"),o.add("nochainid"),o.add("down.bounce");for(const h of e.entries)/^(type|triggerall|trigger\d+|persistent|ignorehitpause)$/.test(h.key)||o.has(h.key)||h.key==="reversal.attr"||this.diagnostic("unsupported-hitdef-parameter",`HitDef parameter ${h.key} is parsed but its engine behavior is not implemented.`,{...e,line:h.line});return i}receiveHit(e,t,{guarded:i=!1}={}){var re,V,K,ie;if(!this.canBeHit(e,t))return{damage:0,guarded:!1,rejected:!0};const s=!i&&String(e[this.stateType==="A"?"air.type":"ground.type"]??e["ground.type"]??"high").toLowerCase()==="none",r=i?null:this.matchingHitOverride(e),a=e.p2getp1state===0?this:e.stateOwner||t;if(!s&&!i&&!r&&e.p2stateno>=0&&!(a!=null&&a.program.states.has(e.p2stateno)))return this.diagnostic("missing-state",`HitDef target state ${e.p2stateno} does not exist; hit rejected.`),{damage:0,guarded:!1,rejected:!0};ip(this,e,t);const o=i?e.guardPauseTime:e.pauseTime,l=this.stateType,c=(t==null?void 0:t.facing)??-this.facing,h=this.facing;if(s)return kc(t,e,!1,{count:!1}),{damage:0,guarded:!1,typeNone:!0,cornerPush:0};this.explods=this.explods.filter(ae=>!ae.removeongethit),this.drawExplods=this.drawExplods.filter(ae=>!ae.removeongethit);const f=this.stateType==="A"||!!(r!=null&&r.forceAir),d=this.stateType==="L"&&!(r!=null&&r.forceAir),u=f&&!!this.getHitVars.fall,p=this.getHitVars,_=this.moveType==="H"&&!p.guarded,m=e[(i?f?"airguard":"guard":d?"down":f?"air":"ground")+".cornerpush.veloff"]||0;!i&&e.forcestand&&this.stateType==="C"&&(this.stateType="S");const g=Ht(((re=e.damage)==null?void 0:re[i?1:0])||0),y=Math.max(0,yr(g,t,this));this._receivedComboHits=i?0:(_?this._receivedComboHits:0)+1,this._receivedComboDamage=i?0:(_?this._receivedComboDamage:0)+y;const b=(V=this.world)==null?void 0:V.orderedPhases,A=this.immortal||(i?e["guard.kill"]:e.kill)===0?1:0,x=ci((this._projectedLife??this.life)-y,A,this.maxLife);b?this._projectedLife=x:this.life=x;const M={},v=t&&e.p2facing?(b?-1:1)*c*(e.p2facing<0?-1:1):this.facing;t&&e.p2facing&&(b?M.facing=v:this.facing=v),t&&e.p1getp2facing?t.facing=v*(e.p1getp2facing<0?-1:1):t&&e.p1facing===-1&&(t.facing*=-1);const S=i?f?e.airGuardVelocity:e.guardVelocity:d&&e["down.velocity"]!==void 0?Array.isArray(e["down.velocity"])?e["down.velocity"]:[e["down.velocity"],0]:f?e.airVelocity:e.groundVelocity,E=e.coordinateScale??(t==null?void 0:t.coordinateScale)??this.coordinateScale,P=E/this.coordinateScale;let C=((S==null?void 0:S[0])||0)*P*-c*v,F=((S==null?void 0:S[1])||0)*P;const I=x<=0,R=I?lp(C,F,l,this.coordinateScale):{x:C,y:F};C=R.x,F=R.y;const O=i?e.guardHitTime:d&&F===0?e["down.hittime"]??20:f||F!==0||b&&e.fall?e.airHitTime??20:e.groundHitTime??0,k={light:0,medium:1,med:1,hard:2,back:3,up:4,diagup:5},H={high:1,low:2,trip:3,none:0};let L=H[String(e["ground.type"]||"high").toLowerCase()]??1;t&&(t.pos.x-this.pos.x)*h<0&&(L===1||L===2)&&(L=3-L);const N=e["air.animtype"]||e.animtype||"light",W=e["fall.animtype"]||(String(N).toLowerCase()==="up"?"up":"back"),B=I?1:i?0:+((!e.forcenofall||e.fall)&&!!p.fall||Kt(Ht(f?e["air.fall"]??e.fall??0:e.fall||0)));if(this.getHitVars={animtype:k[String((b?B&&!i:u)?W:f?N:e.animtype||"light").toLowerCase()]??0,groundtype:L,airtype:H[String(e["air.type"]||"high").toLowerCase()]??1,type:f?H[String(e["air.type"]||e["ground.type"]||"high").toLowerCase()]??1:L,damage:y,hitcount:i?0:(_&&p.hitcount||0)+1,fallcount:_&&p.fallcount||0,hitshaketime:(o==null?void 0:o[1])||0,hittime:O,slidetime:e[i?"guard.slidetime":"ground.slidetime"]??(i?O:0),ctrltime:(i&&f?e["airguard.ctrltime"]:void 0)??e[i?"guard.ctrltime":"ground.ctrltime"]??O,xvel:C,yvel:F,yaccel:e.yaccel===void 0?.35/this.coordinateScale:e.yaccel*P,xoff:0,yoff:0,guarded:+i,fall:B,hitid:e.id??0,chainid:Math.max(0,e.id??0),isbound:0,xveladd:0,yveladd:0,zoff:0,recovertime:d?Math.min(p.recovertime??this.constant("data.liedown.time"),this.constant("data.liedown.time")):this.constant("data.liedown.time"),"fall.time":b&&i&&p["fall.time"]||0,"fall.damage":e["fall.damage"]||0,"fall.xvel":e["fall.xvelocity"]===void 0?C:e["fall.xvelocity"]*P*-c*v,"fall.yvel":d&&!e["down.bounce"]&&F!==0?0:e["fall.yvelocity"]===void 0?-4.5/this.coordinateScale:e["fall.yvelocity"]*P,"fall.recover":I||b&&i?0:e["fall.recover"]??1,"fall.recovertime":e["fall.recovertime"]??4,"fall.kill":e["fall.kill"]??1,"fall.envshake.time":e["fall.envshake.time"]||0,"fall.envshake.freq":e["fall.envshake.freq"]??60,"fall.envshake.ampl":e["fall.envshake.ampl"]===void 0?-4/this.coordinateScale:e["fall.envshake.ampl"]*P,"fall.envshake.phase":e["fall.envshake.phase"]??0},this.comboHits=i?0:(_&&this.comboHits||0)+Math.max(0,Math.trunc(e.numhits??1)),this._fallXVelocityDefined=e["fall.xvelocity"]!==void 0,this.hitTime=Math.max(0,O||0)+(b&&!i&&O>0?1:0),this.hitPauseTime=b?0:Math.max(0,(o==null?void 0:o[1])||0),this.ctrl=0,this.moveType="H",this.hitId=e.id??0,this.hitSourceId=Wo(t),b||(this.vel={x:0,y:0}),this.cornerPush=0,this.cornerPushTarget=null,t&&(!i||b)){const ae=E;for(const[se,be]of[["x",0],["y",1]]){const rt=se==="x"?t.facing:1;let Ee=(this.pos[se]-t.pos[se])*rt/ae;const He=i?se==="x"?["mindist","maxdist"]:[]:["mindist","maxdist","snap"];for(const Te of He)if(e[Te]!==void 0){const it=Array.isArray(e[Te])?e[Te][be]:be===0?e[Te]:void 0;if(it===void 0)continue;Ee=Te==="mindist"?Math.max(Ee,it):Te==="maxdist"?Math.min(Ee,it):it}const Xe=t.pos[se]+Ee*rt*ae;b?He.some(Te=>e[Te]!==void 0)&&(M[se]=Math.fround(Xe)):this.pos[se]=Xe}}b&&Object.keys(M).length&&(this._pendingHitTransform=M);const j=r?r.stateNo:!i&&e.p2stateno>=0?e.p2stateno:i&&!I?f?154:this.stateType==="C"?152:150:d?5080:!f&&this.getHitVars.groundtype===3?5070:f?5020:this.stateType==="C"?5010:5e3;if(r!=null&&r.forceAir&&(this.stateType="A"),this.changeState(j,void 0,!i&&!r&&e.p2stateno>=0?a:this)||(this.moveType="H",this.vel={x:C*this.coordinateScale,y:F*this.coordinateScale},this.diagnostic("missing-hit-state",`Hit state ${j} is missing; full hit reaction cannot execute.`)),this.moveType="H",t){kc(t,e,i),t.hitPauseTime=Math.max(t.hitPauseTime,(o==null?void 0:o[0])||0),t.targets.includes(this)||t.targets.push(this),(K=t.targetHitIds)==null||K.set(this.id,e.id??0);const{get:ae,give:se}=op(e,(ie=this.world)==null?void 0:ie.combatRules);b?this.world.pendingCombatEffects.push({defender:this,attacker:t,damage:y,minimum:A,get:ae[i?1:0]||0,give:se[i?1:0]||0}):(t.power=ci(t.power+(ae[i?1:0]||0),0,t.maxPower),this.power=ci(this.power+(se[i?1:0]||0),0,this.maxPower))}return t&&(t.sprPriority=e.p1sprpriority??1,this.sprPriority=e.p2sprpriority??0,!i&&e.p1stateno>=0&&t.changeState(e.p1stateno,void 0,e.stateOwner||t.stateOwner)),this.events.push({type:"hit",damage:y,guarded:i,attacker:t==null?void 0:t.id}),{damage:y,guarded:i,cornerPush:m}}attributeMatches(e,t){return Za(e,t)}matchingHitOverride(e){for(let t=0;t<8;t++){const i=this.hitOverrides.get(t);if(i!=null&&i.time&&Za(i.attribute||i.attr,e.attr))return i}return null}canBeHit(e,t){var s;if(!tp(this,e,t)||(s=this.world)!=null&&s.isSuperUnhittable(this))return!1;for(const r of this.hitFilters)if(r!=null&&r.time&&!Zf(r,e.attr))return!1;return!(String(e[this.stateType==="A"?"air.type":"ground.type"]??e["ground.type"]??"high").toLowerCase()==="none")&&this.matchingHitOverride(e)&&(e.p1stateno>=0||e.p2getp1state===1||e.p2stateno>=0&&e.p2getp1state!==0)?!1:!this.asserted.has("unhittable")}explodController(e){return qf(this,e)}updateExplods(e={}){return Kf(this,e)}updateBinding(){var t;const e=this.bound;if(e){if(e.target.destroyed){this.bound=null;return}this.pos.x=e.target.pos.x+e.x*e.target.facing,this.pos.y=e.target.pos.y+e.y,(t=this.world)!=null&&t.orderedPhases&&(this.pos.x=Math.fround(this.pos.x),this.pos.y=Math.fround(this.pos.y)),e.facing&&(this.facing=e.target.facing*(e.facing<0?-1:1)),e.time>0&&--e.time===0&&(this.bound=null)}}}const $n=(n,e=[0,0])=>Array.isArray(n)?[Number(n[0]??e[0]),Number(n[1]??e[1])]:n===void 0?[...e]:[Number(n),e[1]];class Ns{constructor(e,t,{id:i}={}){var o;this.creator=e,this.owner=e.root||e,this.root=this.owner,this.isProjectile=!0,this.world=e.world,this.id=i,this.projId=Math.max(0,Math.trunc(t.projid??0)),this.teamSide=e.teamSide,this.character=e.character,this.coordinateScale=e.coordinateScale,this.baseCoordinateScale=this.coordinateScale,this.paletteParent=na(e),this.guardDistance=e.constant("size.proj.attack.dist")*e.coordinateScale,this.animations=e.animations,this.program={...e.program,constants:new Map(e.program.constants)},this.spec=t,this.events=[],this.diagnostics=[],this.asserted=new Set,Number(t.projid)<0&&this.diagnostic("projectile-id","Negative ProjID was clamped to 0."),Object.assign(this,Fu(e,t,!0));const s=$n(t.projscale,[1,1]),r=e.constant("size.proj.doscale")!==0;this.program.constants.set("size.xscale",s[0]*(r?e.constant("size.xscale"):1)),this.program.constants.set("size.yscale",s[1]*(r?e.constant("size.yscale"):1)),this.program.constants.set("size.draw.offset.x",0),this.program.constants.set("size.draw.offset.y",0);const a=$n(t.velocity);if(this.vel={x:a[0]*this.coordinateScale,y:a[1]*this.coordinateScale},this.accel=$n(t.accel).map(l=>l*this.coordinateScale),this.velmul=$n(t.velmul,[1,1]),this.anim=Math.trunc(t.projanim??0),this.frameIndex=0,this.frameTime=0,this.collisionFrame=null,this.hitDef=t.hitDef,this.proximityHitDef=t.hitDef,this.hitPauseTime=0,this.hitCount=0,this.moveType="A",this.stateType=(((o=this.hitDef)==null?void 0:o.attr)||"S")[0].toUpperCase(),this.priority=Math.max(1,Math.trunc(t.projpriority??1)),this.sprPriority=t.projsprpriority??3,this.remainingHits=Math.max(0,Math.trunc(t.projhits??1)),this.missTime=Math.max(0,Math.trunc(t.projmisstime??0)),this.pauseMoveTime=Math.max(0,t.pausemovetime||0),this.superMoveTime=Math.max(0,t.supermovetime||0),this.ownPal=!!t.ownpal,this.time=0,this.removing=!1,this.removed=!1,this.activeTicks=0,this.nextHitAge=0,this.drawVisible=!0,this._inTick=!1,this._paletteRemaps=Xl(e.paletteRemaps),this.ownPal&&t.remappal!==void 0)try{$l(this._paletteRemaps,this.character,t.remappal)}catch(l){this.diagnostic("palette",l.message)}this.attackMultiplier=e.attackMultiplier,this.animations.has(this.anim)||(this.diagnostic("missing-animation",`Projectile animation ${this.anim} does not exist.`),this.removed=!0)}get currentFrame(){var e;return((e=this.animations.get(this.anim))==null?void 0:e.frames[this.frameIndex])||null}get life(){return this.removed||this.removing?0:1}get power(){return this.owner.power}set power(e){this.owner.power=e}get maxPower(){return this.owner.maxPower}get targets(){return this.owner.targets}get targetHitIds(){return this.owner.targetHitIds}get paletteRemaps(){return this.ownPal?this._paletteRemaps:this.paletteParent.paletteRemaps}constant(e){const t=this.program.constants.get(e);return Array.isArray(t)?t[0]:t}changeState(){return this.diagnostic("unsupported-projectile","A projectile cannot enter a player state."),!1}diagnostic(e,t){this.diagnostics.some(i=>i.message===t)||this.diagnostics.push({type:e,message:t,source:this.spec.source,line:this.spec.line})}record(e){var i;const t=this.owner.projectileHistory;t.push({type:e,projId:this.projId,tick:((i=this.world)==null?void 0:i.ticks)??this.time});for(let s=t.length-2;s>=0;s--)t[s].type===e&&t[s].projId===this.projId&&t.splice(s,1);t.length>4096&&(t.shift(),this.diagnostic("resource-limit","Projectile history exceeded 4096 distinct ID/event pairs."))}canHit(){return!this.removed&&!this.removing&&!!this.hitDef&&this.activeTicks>=this.nextHitAge&&this.remainingHits>0}onContact({guarded:e=!1,defer:t=!1}={}){this.record(e?"guarded":"hit"),this._contactPending=!0,this.hitPauseTime>0&&(this._holdCollisionFrame=!0),t||this.finishContacts()}finishContacts(){var e;this._contactPending&&(this._contactPending=!1,this.remainingHits--,this.nextHitAge=this.activeTicks+((e=this.world)!=null&&e.orderedPhases?Math.max(1,this.missTime):this.missTime+1),this.spec.projremove!==0&&this.remainingHits<=0&&this.remove("hit"))}cancel(){!this.removing&&!this.removed&&(this.record("cancel"),this.hitPauseTime=0,this.remove("cancel"))}clash(e){var t,i;this.priority>e.priority?this.priority--:this.remainingHits--,this.remainingHits<=0?this.cancel():this.hitPauseTime=Math.max(this.hitPauseTime,((i=(t=this.hitDef)==null?void 0:t.pauseTime)==null?void 0:i[0])||0)}remove(e="expire"){if(!(this.removing||this.removed)){if(this.removing=!0,this.hitDef=null,this.removalReason=e,this._removeAtLoopEnd=this._loopedThisTick,this.hitPauseTime>0){this._holdCollisionFrame=!0;return}this.beginRemoval()}}beginRemoval(){var l;this.removalStarted=!0;const e=this.removalReason,t=this.spec.projhitanim??-1,i=this.spec.projremanim??t,s=e==="hit"?t:e==="cancel"?this.spec.projcancelanim??i:i,r=$n(this.spec.remvelocity);if(this.vel={x:r[0]*this.coordinateScale,y:r[1]*this.coordinateScale},s<0){this.removed=!0,this.drawVisible=!1;return}let a=!1;if(this.animations.has(s)?Math.trunc(s)!==this.anim&&(a=!0,this._loopedThisTick=!1,this.anim=Math.trunc(s),this.frameIndex=this.frameTime=0):this.diagnostic("missing-animation",`Projectile removal animation ${s} does not exist; retaining action ${this.anim}.`),(a||!this.collisionFrame)&&(this.collisionFrame=this.currentFrame,this.collisionAnimation=this.animations.get(this.anim),this.collisionFrameIndex=this.frameIndex,this.collisionFrameTime=this.frameTime),!a&&this._removeAtLoopEnd&&this._inTick){this.removed=!0,this.drawVisible=!1;return}const o=((l=this.animations.get(this.anim))==null?void 0:l.frames)||[];if(o.some(c=>c.ticks<0)||o.reduce((c,h)=>c+h.ticks,0)<=0){this.removed=!0,this.drawVisible=!1;return}this.drawVisible=!!this.collisionFrame,a&&!this._inTick?this.advanceFrame():!a&&!this._inTick&&this._loopedThisTick&&(this.removed=!0)}advanceFrame(){const e=this.currentFrame,t=this.animations.get(this.anim);e&&e.ticks>=0&&++this.frameTime>=Math.max(1,e.ticks)&&(this.frameTime=0,this.frameIndex++,this.frameIndex>=t.frames.length&&(this._loopedThisTick=!0,this.animationLooped=!0,this.removing&&(this.removed=!0),this.frameIndex=t.loopStart||0))}tick({paused:e=!1}={}){var t,i,s,r;if(this.events=[],this._activeThisTick=!1,this.removed){this.drawVisible=!1;return}if(!e){if(this.drawVisible=!0,this._holdCollisionFrame||this.captureFrame(),this.hitPauseTime>0){this.hitPauseTime--;return}if(this._holdCollisionFrame=!1,this._inTick=!0,this._loopedThisTick=!1,this.removing&&!this.removalStarted&&this.beginRemoval(),!this.removing){const a=$n(this.spec.projheightbound,[-240/this.coordinateScale,1/this.coordinateScale]).map(_=>_*this.coordinateScale),o=(this.spec.projedgebound??40/this.coordinateScale)*this.coordinateScale,l=(this.spec.projstagebound??40/this.coordinateScale)*this.coordinateScale,c=((t=this.world)==null?void 0:t.leftBound)??-160,h=((i=this.world)==null?void 0:i.rightBound)??160,f=((s=this.world)==null?void 0:s.view.left)??c,d=((r=this.world)==null?void 0:r.view.right)??h,u=this.spec.projremovetime??-1,p=this.vel.x*this.facing;(u>=0&&this.time>=u||u<=-2&&this.animationLooped||this.pos.x<f-o||this.pos.x>d+o||p<0&&this.pos.x<c-l||p>0&&this.pos.x>h+l||this.vel.y<0&&this.pos.y<a[0]||this.vel.y>0&&this.pos.y>a[1])&&this.remove()}this.removed||(this.captureFrame(),this._activeThisTick=!0,this.activeTicks++,this.pos.x+=this.vel.x*this.facing,this.pos.y+=this.vel.y,this.removing||(this.vel.x=(this.vel.x+this.accel[0])*this.velmul[0],this.vel.y=(this.vel.y+this.accel[1])*this.velmul[1]),this.advanceFrame(),this.time++),this._inTick=!1}}finishMovementAllowance({paused:e=!1}={}){var t,i,s;if(!(e||!this._activeThisTick||this._hitPausedThisTick||this.hitPauseTime>0)){if((t=this.world)!=null&&t.orderedPhases){((i=this.world.pause)==null?void 0:i.remaining)>0&&(this.pauseMoveTime=Math.max(0,this.pauseMoveTime-1)),((s=this.world.superPause)==null?void 0:s.remaining)>0&&(this.superMoveTime=Math.max(0,this.superMoveTime-1));return}this.pauseMoveTime=Math.max(0,this.pauseMoveTime-1),this.superMoveTime=Math.max(0,this.superMoveTime-1)}}captureFrame(){this.collisionFrame=this.currentFrame,this.collisionAnimation=this.animations.get(this.anim),this.collisionFrameIndex=this.frameIndex,this.collisionFrameTime=this.frameTime}}const Ct=(n,e,t)=>Math.max(e,Math.min(t,n)),fs=(n,e=0)=>n===void 0||n===""?e:Number(n),gt=(n,e=[0,0])=>n===void 0?[...e]:String(n).split(",").map((t,i)=>fs(t.trim(),e[i]??0)),_n=n=>String(n??"").replace(/^"(.*)"$/,"$1"),Sp=new Set(["normal","anim","parallax","dummy","video"]),Mp=new Set(["null","anim","visible","enable","posset","posadd","velset","veladd","sinx","siny"]);function bp(n){var t,i;const e=[];for(const s of Object.keys(n).filter(r=>r.endsWith(".def"))){const r=Li(n[s]),a=fr(r);if(a.bgdef)try{e.push(wp(s,n,r,a))}catch(o){e.push({path:s,name:((t=a.info)==null?void 0:t.displayname)||((i=a.info)==null?void 0:i.name)||s,files:n,invalid:!0,diagnostics:[{source:s,line:0,type:"stage",message:o.message}]})}}return e}function wp(n,e,t=Li(e[n]),i=fr(t)){var S,E,P,C,F;const s=[],r=(I,R,O="stage")=>s.push({source:n,line:(R==null?void 0:R.line)||0,type:O,message:I}),a=n.slice(0,n.lastIndexOf("/")+1),o=n.indexOf("/stages/"),l=o>=0?n.slice(0,o+1):"",c=I=>{I=_n(I);const R=[...new Set([a,l,"",l+"video/","video/"])],O=String(I).replaceAll("\\","/").split("/").at(-1),H=R.map(L=>{try{return on(I,L,!0)}catch{return null}}).find(L=>L&&e[L]);if(H)return H;if(O&&O!=="."&&O!=="..")try{const L=on(O,a);if(e[L])return L}catch{}return null},h=gt((S=i.stageinfo)==null?void 0:S.localcoord,[320,240]);if(h.length!==2||h.some(I=>!Number.isFinite(I)||I<=0))throw Error("Invalid stage localcoord.");const f=320/h[0],d=i.camera||{},u=i.playerinfo||{},p=i.bound||{},_=i.stageinfo||{},m=(I,R,O)=>{const k=fs(I[R],O);if(!Number.isFinite(k))throw Error(`Invalid stage numeric value ${R}.`);return k},g={startX:m(d,"startx",0)*f,startY:m(d,"starty",0)*f,left:m(d,"boundleft",0)*f,right:m(d,"boundright",0)*f,high:m(d,"boundhigh",-25)*f,low:m(d,"boundlow",0)*f,tension:Math.max(0,m(d,"tension",60)*f),floorTension:m(d,"floortension",0)*f,verticalFollow:Ct(m(d,"verticalfollow",.2),0,1),zoomIn:m(d,"zoomin",1),zoomOut:m(d,"zoomout",1),startZoom:m(d,"startzoom",1)};if(Object.assign(g,{autoCenter:m(d,"autocenter",0)!==0,zoomInDelay:Math.max(0,Math.trunc(m(d,"zoomindelay",0))),zoomInSpeed:Ct(m(d,"zoominspeed",1),0,1),zoomOutSpeed:Ct(m(d,"zoomoutspeed",1),0,1),tensionVelocity:Ct(m(d,"tensionvel",1),0,1),yScrollSpeed:Ct(m(d,"yscrollspeed",1),0,1),boundHighZoomDelta:Math.max(0,m(d,"boundhighzoomdelta",0)),verticalFollowZoomDelta:Math.max(0,m(d,"verticalfollowzoomdelta",0)),zoomAnchor:_n(d.zoomanchor||"center").toLowerCase()}),!["center","bottom"].includes(g.zoomAnchor))throw Error("Invalid camera zoomanchor.");if(g.boundHighZoomDelta&&r("Camera boundhighzoomdelta curve is not implemented.",null,"unsupported-stage-camera"),g.left>g.right||g.high>g.low||g.zoomOut<=0||g.zoomIn<g.zoomOut)throw Error("Invalid stage camera bounds or zoom limits.");const y=i.bgdef.spr?c(i.bgdef.spr):null;y||r(`Stage sprite file is missing: ${i.bgdef.spr||"(unspecified)"}`);const b=i.music||{},A=b.bgmvolume!==void 0?m(b,"bgmvolume",100):100*(1+Ct(m(b,"bgvolume",0),-255,255)/256),x={path:n,name:((E=i.info)==null?void 0:E.displayname)||((P=i.info)==null?void 0:P.name)||n,files:e,def:i,localcoord:h,coordinateScale:f,camera:g,sprite:y?{path:y}:null,animations:Gl(t),elements:[],controllers:[],diagnostics:s,leftBound:m(u,"leftbound",-1e3)*f,rightBound:m(u,"rightbound",1e3)*f,starts:[1,2].map(I=>({x:m(u,`p${I}startx`,I===1?-70:70)*f,y:m(u,`p${I}starty`,0)*f,facing:m(u,`p${I}facing`,I===1?1:-1)<0?-1:1})),screenLeft:Math.max(0,m(p,"screenleft",15)*f),screenRight:Math.max(0,m(p,"screenright",15)*f),zoffset:m(_,"zoffset",200)*f,resetBG:m(_,"resetbg",1)!==0,autoturn:m(_,"autoturn",1)!==0,xscale:m(_,"xscale",1),yscale:m(_,"yscale",1),backgroundScale:m(_,"hires",0)!==0?.5:1,zoffsetlink:_.zoffsetlink===void 0?null:m(_,"zoffsetlink",0),cropHigh:Math.max(0,m(d,"cuthigh",0)*f),cropLow:Math.max(0,m(d,"cutlow",0)*f),music:{path:b.bgmusic?c(b.bgmusic):null,requested:b.bgmusic||"",volume:A,loop:m(b,"bgmloop",1)!==0,loopStart:m(b,"bgmloopstart",0),loopEnd:m(b,"bgmloopend",0)}};if(x.shadow={intensity:Ct(m(i.shadow||{},"intensity",128),0,256),color:gt((C=i.shadow)==null?void 0:C.color,[0,0,0]),yscale:m(i.shadow||{},"yscale",.4),fade:(F=i.shadow)!=null&&F["fade.range"]?gt(i.shadow["fade.range"]):null},x.reflection=Ct(m(i.reflection||{},"intensity",0),0,256),i.bgdef.model){const I=i.model||{},R=i.bgdef,O=(k,H)=>{const L=gt(k,H);if(L.length!==3||L.some(N=>!Number.isFinite(N)))throw Error("Invalid model transform.");return L};if(x.model={path:c(R.model),requested:R.model,scene:Math.max(0,Math.trunc(m(R,"scenenumber",0))),offset:O(R.modeloffset??I.offset,[0,0,0]),rotation:O(R.modelrotate??I.rotate,[0,0,0]),scale:O(R.modelscale??I.scale,[1,1,1]),camera:{fov:m(R,"fov",m(d,"fov",0)),near:m(R,"near",m(d,"near",0)),far:m(R,"far",m(d,"far",0)),yShift:m(d,"yshift",0)},environment:I.environment?c(I.environment):null,environmentRequested:I.environment||"",environmentIntensity:Math.max(0,m(I,"environmentintensity",1))},x.model.path||r(`Stage model is missing: ${R.model}`,null,"stage-model"),x.model.environmentRequested&&!x.model.environment&&r(`Model environment is missing: ${I.environment}`,null,"stage-model"),x.model.camera.fov<0||x.model.camera.fov>=180||x.model.camera.near<0||x.model.camera.far<0)throw Error("Invalid model camera configuration.")}if(x.leftBound>=x.rightBound)throw Error("Invalid stage player bounds.");x.music.requested&&!x.music.path&&r(`Stage music is missing: ${x.music.requested}`);let M={ids:null,loop:-1};const v=new Set(["type","spriteno","actionno","id","layerno","start","delta","trans","alpha","mask","velocity","tile","tilespacing","positionlink","sin.x","sin.y","window","maskwindow","windowdelta","xscale","width","yscalestart","yscaledelta","scalestart","scaledelta","zoomdelta","path","loop","volume","scalemode","scalefilter","angle","xangle","yangle"]);for(const I of $o(t,n)){const R=I.values;if(/^bgctrldef(?:\s|$)/.test(I.name))M={ids:R.ctrlid===void 0?null:gt(R.ctrlid,[]),loop:m(R,"looptime",-1)};else if(/^bgctrl(?:\s|$)/.test(I.name)){const O=_n(R.type).toLowerCase();if(!Mp.has(O)){r(`Background controller ${O} is not implemented.`,I,"unsupported-stage-controller");continue}const k=gt(R.time,[0]);for(const[H,L]of Object.entries(R))if(H!=="type"&&gt(L,[]).some(N=>!Number.isFinite(N)))throw Error(`Invalid background controller ${H} at line ${I.line}.`);x.controllers.push({type:O,time:[k[0],k[1]??k[0],k[2]??-1],groupLoop:M.loop,ids:R.ctrlid===void 0?M.ids:gt(R.ctrlid,[]),values:R,line:I.line})}else if(/^bg(?:\s|$)/.test(I.name)){const O=_n(R.type||"normal").toLowerCase();if(!Sp.has(O)){r(`Background type ${O} is not implemented.`,I,"unsupported-stage");continue}const k=O==="anim"||O==="parallax"&&R.actionno!==void 0,H=_n(R.trans||"default").toLowerCase(),L={type:O,animated:k,id:m(R,"id",0),layer:m(R,"layerno",0),start:gt(R.start),delta:gt(R.delta,[1,1]),velocity:gt(R.velocity),spriteno:gt(R.spriteno),anim:m(R,"actionno",0),mask:k||m(R,"mask",["add","sub"].includes(H)?1:0)!==0,trans:H,alpha:gt(R.alpha,H==="addalpha"?[256,0]:[256,256]),tile:gt(R.tile),spacing:gt(R.tilespacing),link:m(R,"positionlink",0)!==0,sinX:gt(R["sin.x"],[0,0,0]),sinY:gt(R["sin.y"],[0,0,0]),xscale:gt(R.xscale,[1,1]),width:R.width===void 0?null:gt(R.width),yScaleStart:m(R,"yscalestart",100)/100,yScaleDelta:m(R,"yscaledelta",0)/100,scaleStart:gt(R.scalestart,[1,1]),scaleDelta:gt(R.scaledelta),zoomDelta:m(R,"zoomdelta",1),window:R.maskwindow?gt(R.maskwindow,[]):R.window?gt(R.window,[]):null,windowCentered:!!R.maskwindow,windowDelta:gt(R.windowdelta),transSpecified:R.trans!==void 0,line:I.line};if(L.angle=m(R,"angle",0),L.xangle=m(R,"xangle",0),L.yangle=m(R,"yangle",0),O==="video"){const N=_n(R.scalemode||"none").toLowerCase();if(!["none","fit","fitwidth","fitheight","zoomfill","stretch"].includes(N))throw Error(`Invalid video scalemode at line ${I.line}.`);L.video={path:R.path?c(R.path):null,requested:R.path||"",loop:m(R,"loop",0)!==0,volume:Ct(m(R,"volume",100),0,200),scaleMode:N,filter:_n(R.scalefilter||"fastbilinear").toLowerCase(),key:"@video/"+x.elements.length},L.video.path||r(`Stage video is missing: ${R.path||"(unspecified)"}`,I,"stage-video")}for(const[N,W]of Object.entries(L))if(Array.isArray(W)&&W.some(B=>!Number.isFinite(B)))throw Error(`Invalid background ${N} at line ${I.line}.`);for(const N of["start","delta","velocity","spriteno","alpha","tile","spacing","xscale","scaleStart","scaleDelta","windowDelta"])if(L[N].length!==2)throw Error(`Invalid background ${N} at line ${I.line}.`);if(L.width&&L.width.length!==2||L.window&&L.window.length!==4)throw Error(`Invalid background dimensions at line ${I.line}.`);if(k&&!x.animations.some(N=>N.id===L.anim)&&r(`Stage action ${L.anim} is missing.`,I),k&&L.tile.some((N,W)=>N&&L.spacing[W]<=0)&&O!=="parallax"&&r("Animated background tiling requires positive tilespacing.",I),O==="parallax"&&R.xscale!==void 0&&(k||L.width))throw Error(`Parallax xscale cannot be combined with width or animation at line ${I.line}.`);for(const N of Object.keys(R))v.has(N)||r(`Background parameter ${N} is not implemented.`,I,"unsupported-stage-parameter");x.elements.push(L)}}if(x.elements.length>2048||x.controllers.length>4096)throw Error("Stage background/controller limit exceeded.");if(!i.bgdef.spr&&(x.model||x.elements.some(I=>I.type==="video"))&&(x.diagnostics=s.filter(I=>!I.message.startsWith("Stage sprite file is missing:"))),x.elements.filter(I=>I.type==="video").length>4)throw Error("Stage video-layer limit (4) exceeded.");return x}function Wc(n,e){return n[1]>0?n[0]*Math.sin(2*Math.PI*e/n[1]+(n[2]||0)*Math.PI/180):0}class Ep{constructor(e){if(e.invalid)throw Error(e.diagnostics[0].message);this.definition=e,this.animations=new Map(e.animations.map(t=>[t.id,t])),this.diagnostics=[...e.diagnostics],this.reset()}reset({backgrounds:e=!0}={}){(e||!this.elements)&&(this.generation=(this.generation||0)+1);const t=this.definition;this.camera={x:Ct(t.camera.startX,t.camera.left,t.camera.right),y:Ct(t.camera.startY,t.camera.high,t.camera.low),zoom:Ct(t.camera.startZoom,t.camera.zoomOut,t.camera.zoomIn)},this.zoomWait=0,(e||!this.elements)&&(this.time=0,this.elements=t.elements.map(i=>({...i,start:[...i.start],motion:[0,0],velocity:[...i.velocity],sinX:[...i.sinX],sinY:[...i.sinY],sinStartX:0,sinStartY:0,anim:i.anim,frameIndex:0,frameTime:0,visible:!0,enabled:!0})))}updateCamera(e,{advance:t=!0}={}){e=e.filter(o=>!o.destroyed&&!o.isProjectile);const i=this.definition,s=i.camera,r=e.filter(o=>{var l;return((l=o.moveCamera)==null?void 0:l.x)!==!1}),a=e.filter(o=>{var l;return((l=o.moveCamera)==null?void 0:l.y)!==!1});if(r.length){const o=Math.min(...r.map(p=>p.pos.x)),l=Math.max(...r.map(p=>p.pos.x)),c=Ct(320/Math.max(1,l-o+2*s.tension),s.zoomOut,s.zoomIn);t&&(c>this.camera.zoom?this.zoomWait++>=s.zoomInDelay&&(this.camera.zoom+=(c-this.camera.zoom)*s.zoomInSpeed):(this.zoomWait=0,this.camera.zoom+=(c-this.camera.zoom)*s.zoomOutSpeed));const h=Math.max(1,160/this.camera.zoom-s.tension),f=l-h,d=o+h,u=s.autoCenter?(o+l)/2:f<=d?Ct(this.camera.x,f,d):(o+l)/2;(t||s.tensionVelocity===1)&&(this.camera.x=Ct(this.camera.x+(u-this.camera.x)*s.tensionVelocity,s.left,s.right))}if(a.length&&t){const o=s.verticalFollow+Math.max(0,this.camera.zoom-s.zoomOut)*s.verticalFollowZoomDelta,l=Ct(Math.min(0,Math.min(...a.map(c=>c.pos.y))+s.floorTension)*o,s.high,s.low);this.camera.y+=(l-this.camera.y)*s.yScrollSpeed}}view(e=this.viewportAspect){const t=this.definition,i=e||t.cropHigh+t.cropLow?320/(e||16/9):t.localcoord[1]*t.coordinateScale,s=Math.max(0,t.localcoord[1]*t.coordinateScale-i);let r=t.zoffset;if(t.zoffsetlink!==null){const f=this.elements.findIndex(d=>d.id===t.zoffsetlink);f>=0&&(r=this.position(f).y*t.coordinateScale)}const a=t.cropHigh+t.cropLow?s*t.cropHigh/(t.cropHigh+t.cropLow):Ct(r-i+12,0,s),o=r-a,l=320/this.camera.zoom,c=i/this.camera.zoom,h=t.camera.zoomAnchor==="bottom"?i-(i-o)*this.camera.zoom:o;return{left:this.camera.x-l/2,right:this.camera.x+l/2,top:this.camera.y-h/this.camera.zoom,bottom:this.camera.y+(i-h)/this.camera.zoom,width:l,height:c,displayHeight:i,groundY:h,zoffset:r,cropTop:a,zoom:this.camera.zoom}}position(e){let t=0,i=0,s=[1,1],r=0;for(let a=e;a>=0&&r++<2048;a--){const o=this.elements[a];if(t+=o.start[0]+o.motion[0]+Wc(o.sinX,this.time-o.sinStartX),i+=o.start[1]+o.motion[1]+Wc(o.sinY,this.time-o.sinStartY),s=o.delta,!o.link)break}return{x:t,y:i,delta:s}}tick({paused:e=!1}={}){if(!e){for(const t of this.definition.controllers){let i=t.groupLoop>0?this.time%t.groupLoop:this.time;if(t.time[2]>0&&(i%=t.time[2]),!(i<t.time[0]||i>t.time[1]))for(const s of this.elements){if(t.ids&&!t.ids.includes(s.id)&&!t.ids.includes(-1))continue;const r=t.values;if(t.type==="visible")s.visible=fs(r.value,1)!==0;else if(t.type==="enable")s.enabled=fs(r.value,1)!==0;else if(t.type==="anim")s.anim=fs(r.value,0),s.frameIndex=s.frameTime=0;else if(t.type==="sinx"||t.type==="siny"){const a=t.type==="sinx"?"sinX":"sinY";s[a]=gt(r.value,[0,0,0]),s[a==="sinX"?"sinStartX":"sinStartY"]=this.time}else if(/^(pos|vel)(set|add)$/.test(t.type)){for(const[a,o]of[["x",0],["y",1]])if(r[a]!==void 0){const l=fs(r[a]),c=t.type.startsWith("pos")?s.motion:s.velocity;t.type.endsWith("set")?c[o]=l-(c===s.motion?s.start[o]:0):c[o]+=l}}}}for(const t of this.elements)if(t.enabled){for(let r=0;r<2;r++)t.motion[r]+=t.velocity[r];t.drawFrameIndex=t.frameIndex,t.drawFrameTime=t.frameTime;const i=this.animations.get(t.anim),s=i==null?void 0:i.frames[t.frameIndex];t.animated&&s&&s.ticks>=0&&++t.frameTime>=Math.max(1,s.ticks)&&(t.frameTime=0,++t.frameIndex>=i.frames.length&&(t.frameIndex=i.loopStart||0))}this.time++}}frame(e){var t;return e.animated?(t=this.animations.get(e.anim))==null?void 0:t.frames[e.drawFrameIndex??e.frameIndex]:{group:e.spriteno[0],number:e.spriteno[1],x:0,y:0,flip:"",ticks:-1}}variable(e){var a;const[t,...i]=String(e).toLowerCase().split("."),s=(a=this.definition.def[t])==null?void 0:a[i.join(".")];if(s===void 0)throw Error(`StageVar ${e} is not implemented or missing.`);const r=Number(s);return Number.isFinite(r)?r:_n(s)}}class Tp{constructor(){this.reset()}reset(){this.camera={x:0,y:0,zoom:1}}updateCamera(e,{advance:t=!0}={}){if(!t)return;const i=(e||[]).filter(a=>!a.destroyed&&!a.isProjectile&&!a.parent),s=i.filter(a=>{var o,l;return((o=a.moveCamera)==null?void 0:o.x)!==!1&&Number.isFinite((l=a.pos)==null?void 0:l.x)}),r=i.filter(a=>{var o,l;return((o=a.moveCamera)==null?void 0:o.y)!==!1&&Number.isFinite((l=a.pos)==null?void 0:l.y)});if(s.length){const a=(Math.min(...s.map(o=>o.pos.x))+Math.max(...s.map(o=>o.pos.x)))/2;this.camera.x+=(Ct(a,-150,150)-this.camera.x)*.16,Math.abs(a-this.camera.x)<.01&&(this.camera.x=Ct(a,-150,150))}if(r.length){const a=Math.min(0,...r.map(l=>l.pos.y)),o=Ct(a+48,-600,0);this.camera.y+=(o-this.camera.y)*.22,Math.abs(o-this.camera.y)<.01&&(this.camera.y=o)}}view(){const{x:e,y:t}=this.camera;return{left:e-160,right:e+160,top:t-200,bottom:t+40,width:320,height:240,displayHeight:240,groundY:200,zoom:1}}}const Ap=n=>{if(n[0].life<=0&&n[1].life<=0)return"draw";if(n[0].life<=0)return"opponent";if(n[1].life<=0)return"player";const e=n[0].life*n[1].maxLife-n[1].life*n[0].maxLife;return e===0?"draw":e>0?"player":"opponent"};class Cp{constructor({roundsToWin:e=2,roundTime:t=99,preIntro:i=30,introHold:s=30,overTime:r=60,resultTime:a=90,autoAdvance:o=!0}={}){for(const[l,c]of Object.entries({roundsToWin:e,roundTime:t,preIntro:i,introHold:s,overTime:r,resultTime:a}))if(!Number.isFinite(c)||c<0)throw Error(`Invalid match rule ${l}.`);if(e<1||e>99||t>3600)throw Error("Match rule exceeds supported bounds.");this.rules={roundsToWin:Math.trunc(e),roundTime:t,preIntro:Math.trunc(i),introHold:Math.trunc(s),overTime:Math.trunc(r),resultTime:Math.trunc(a),autoAdvance:o},this.roundNo=1,this.roundsExisted=0,this.wins={player:0,opponent:0},this.matchOver=!1,this.roundWinner=null,this.reason=null,this.startRound()}startRound(){this.roundState=0,this.phaseTime=0,this.timeLeft=this.rules.roundTime?Math.round(this.rules.roundTime*60):-1,this.roundWinner=null,this.reason=null,this._awarded=!1}step({players:e,paused:t=!1,intro:i=!1,roundNotOver:s=!1,timerFreeze:r=!1,noKO:a=[!1,!1]}={}){const o=[];if(t)return o;if(this.roundState===0)return++this.phaseTime>=this.rules.preIntro&&(this.roundState=1,this.phaseTime=0),o;if(this.roundState===1)return this.phaseTime++,!i&&this.phaseTime>=this.rules.introHold&&(this.roundState=2,this.phaseTime=0,o.push({type:"fight"})),o;if(this.roundState===2){this.phaseTime++;const l=e.some((c,h)=>c.life<=0&&!a[h]);return!r&&this.timeLeft>0&&this.timeLeft--,(l||this.timeLeft===0)&&(this.roundWinner=Ap(e),this.reason=l?e.every(c=>c.life<=0)?"double-ko":"ko":"time",this.roundState=3,this.phaseTime=0,o.push({type:"round-over",winner:this.roundWinner,reason:this.reason})),o}return this.roundState===3?(s||++this.phaseTime>=this.rules.overTime&&(!this._awarded&&this.roundWinner!=="draw"&&(this.wins[this.roundWinner]++,this._awarded=!0),this.matchOver=Object.values(this.wins).some(l=>l>=this.rules.roundsToWin),this.roundState=4,this.phaseTime=0,o.push({type:"result",winner:this.roundWinner,reason:this.reason,matchOver:this.matchOver})),o):(this.roundState===4&&!s&&!this.matchOver&&this.rules.autoAdvance&&++this.phaseTime>=this.rules.resultTime&&(this.roundNo++,this.roundsExisted++,this.startRound(),o.push({type:"next-round",roundNo:this.roundNo})),o)}}const Qt=["a","b","c","x","y","z","s"],qs=["U","D","B","F","UB","UF","DB","DF"],Rp=new Set(["U","D","L","R",...Qt]),xa=3600,Xc=128,$c=4096;function Pp(n){let e=null;for(let t=0;t<n.length;t++){const i=n[t];if((i==='"'||i==="'")&&(!e||e===i))e=e?null:i;else if(i===";"&&!e)return n.slice(0,t).trim()}return n.trim()}function io(n){const e=n.match(/^(?:"([\s\S]*)"|'([\s\S]*)')$/);return e?e[1]??e[2]:n}function Ip(n){let e=n.replace(/\s/g,"");if(!e)throw Error("Empty command symbol.");const t={source:n,strict:!1,hold:!1,release:!1,charge:0,tolerant:!1},i=new Set;for(;/^[>\/~$]/.test(e);){const r=e[0];if(i.has(r))throw Error(`Repeated ${r} modifier in ${n}.`);if(i.add(r),e=e.slice(1),r===">"&&(t.strict=!0),r==="/"&&(t.hold=!0),r==="$"&&(t.tolerant=!0),r==="~"){t.release=!0;const a=e.match(/^\d+/);if(a){if(t.charge=Number(a[0]),!Number.isSafeInteger(t.charge)||t.charge>xa)throw Error(`Charge duration exceeds the ${xa}-tick runtime limit.`);e=e.slice(a[0].length)}}}if(t.hold&&t.release)throw Error(`Hold and release cannot be combined in ${n}.`);const s=e.split("+");if(s.some(r=>!r)||new Set(s).size!==s.length)throw Error(`Invalid simultaneous input ${n}.`);if(s.length===1&&qs.includes(s[0]))t.kind="direction",t.keys=s,t.key=(t.tolerant?"$":"")+s[0];else if(s.every(r=>Qt.includes(r))){if(t.tolerant)throw Error(`The $ modifier is only valid on directions: ${n}.`);t.kind="button",t.keys=s}else if(s.filter(r=>qs.includes(r)).length===1&&s.every(r=>qs.includes(r)||Qt.includes(r)))t.kind="chord",t.keys=s.map(r=>qs.includes(r)&&t.tolerant?"$"+r:r);else throw Error(`Unsupported command symbol ${n}. Directions are uppercase and buttons are lowercase.`);return t}function Lp(n){const e=n.split(",").map(Ip),t=[];for(const i of e){const s=t.at(-1);(s==null?void 0:s.kind)==="direction"&&i.kind==="direction"&&s.key===i.key&&!s.hold&&!s.release&&!i.hold&&!i.release?(t.push({...i,source:`>~${i.key}`,strict:!0,release:!0,charge:0}),t.push({...i,strict:!0})):t.push(i)}if(t.length>Xc)throw Error(`Command exceeds the ${Xc}-symbol runtime limit.`);return t}function Yl(n){const e=[];let t;for(const[c,h]of String(n).replace(/^\uFEFF|^ï»¿/,"").split(/\r?\n/).entries()){const f=Pp(h),d=f.match(/^\[([^\]]+)\]$/);if(d)t={name:d[1].trim().toLowerCase(),line:c+1,values:{}},e.push(t);else if(t){const u=f.indexOf("=");u>0&&(t.values[f.slice(0,u).trim().toLowerCase()]=f.slice(u+1).trim())}}const i=[],s={time:15,bufferTime:1},r=Object.fromEntries(Qt.map(c=>[c,c])),a=(c,h,f=io(c.values.name??""))=>{i.push({kind:"command",name:f,line:c.line,message:h})};function o(c,h,f,d,u){if(c==null)return h;if(!/^[-+]?\d+$/.test(c.trim())||!Number.isSafeInteger(Number(c)))throw Error(`${d} must be an integer.`);const p=Math.max(1,Number(c));if(p>u){if(d==="buffer.time"||d==="command.buffer.time")return u;throw Error(`${d} exceeds the ${u}-tick runtime limit.`)}return p}for(const c of e){if(c.name==="defaults")try{s.time=o(c.values["command.time"],s.time,c,"command.time",xa),s.bufferTime=o(c.values["command.buffer.time"],s.bufferTime,c,"command.buffer.time",30)}catch(h){a(c,h.message)}if(c.name==="remap")for(const[h,f]of Object.entries(c.values)){const d=io(f);!Qt.includes(h)||d&&!Qt.includes(d)?a(c,`Unsupported button remap ${h} = ${f}.`):r[h]=d}}const l=[];for(const c of e){if(c.name!=="command")continue;if(l.length>=$c){a(c,`Command count exceeds the ${$c}-command runtime limit.`);break}const{values:h}=c,f=io(h.name??"");try{if(!f)throw Error("Command is missing its name.");if(!h.command)throw Error("Command is missing its input sequence.");const d=Lp(h.command);l.push({name:f,command:h.command,sequence:d,time:o(h.time,s.time,c,"time",xa),bufferTime:o(h["buffer.time"],s.bufferTime,c,"buffer.time",30),line:c.line,holdOnly:d.every(u=>u.hold)})}catch(d){a(c,d.message,f)}}return{commands:l,defaults:s,remap:r,diagnostics:i}}function Np(n,e,t){const i=new Set;n.has("U")!==n.has("D")&&i.add(n.has("U")?"U":"D"),n.has("L")!==n.has("R")&&i.add(n.has(e<0?"L":"R")?"F":"B");for(const s of Qt)n.has(s)&&t[s]&&i.add(t[s]);return i}function Dp(n){const e=new Set(Qt.filter(i=>n.has(i))),t=(n.has("U")?"U":n.has("D")?"D":"")+(n.has("B")?"B":n.has("F")?"F":"");t&&e.add(t);for(const i of qs)[...i].every(s=>n.has(s))&&e.add("$"+i);return e}function Fp(n){return n.kind==="direction"?[n.key]:n.keys}function Mr(n,e){const t=Fp(n);return n.hold?t.every(i=>e.held.has(i)):n.release?t.every(i=>e.released.has(i)&&(e.previousDurations.get(i)??0)>=n.charge):t.every(i=>n.kind==="chord"&&!Qt.includes(i)?e.held.has(i):e.pressed.has(i))}function Up(n){if(n.hold)return[];const e=n.release?"release:":"press:";return n.kind==="chord"?n.keys.filter(t=>Qt.includes(t)||n.release).map(t=>e+(Qt.includes(t)?t:"direction")):n.kind==="direction"?[e+"direction"]:n.keys.map(t=>e+t)}function qc(n,e,t){if(n.kind==="chord"){const i=new Set;for(const s of n.keys)if(Qt.includes(s))for(const r of Qt)t[r]===s&&i.add(r);else for(const r of s.replace("$",""))i.add(r==="F"?e.facing<0?"L":"R":r==="B"?e.facing<0?"R":"L":r);return i}return n.kind==="button"?new Set(Qt.filter(i=>n.keys.includes(t[i]))):new Set([...n.keys[0]].map(i=>i==="F"?e.facing<0?"L":"R":i==="B"?e.facing<0?"R":"L":i))}class er{constructor(e={commands:[]}){typeof e=="string"&&(e=Yl(e)),this.commands=e.commands??[],this.remap=e.remap??Object.fromEntries(Qt.map(t=>[t,t])),this.diagnostics=[...e.diagnostics??[]],this.historyLimit=Math.max(1,...this.commands.map(t=>t.time+1)),this.reset()}reset(){this.tick=-1,this.history=[],this.buffered=new Map,this.active=new Set,this.previous={raw:new Set,held:new Set,durations:new Map}}update(e,t=1){this.tick++;const i=new Set([...e].filter(l=>Rp.has(l))),s=Dp(Np(i,t,this.remap)),r=this.previous,a={tick:this.tick,raw:i,facing:t,held:s,pressed:new Set([...s].filter(l=>!r.held.has(l))),released:new Set([...r.held].filter(l=>!s.has(l))),previousDurations:r.durations,durations:new Map([...s].map(l=>[l,(r.durations.get(l)??0)+1])),changes:new Set([...i,...r.raw].filter(l=>i.has(l)!==r.raw.has(l)))};this.previous=a,this.history.push(a),this.history.length>this.historyLimit&&this.history.shift(),this.active=new Set;let o=25e4;for(const l of this.commands){if(l.holdOnly){l.sequence.every(h=>Mr(h,a))&&this.active.add(l.name);continue}if(l.sequence.every(h=>!h.hold||Mr(h,a))&&Mr(l.sequence.at(-1),a)&&this.matchSequence(l,()=>--o>=0)&&this.buffered.set(l.name,this.tick+l.bufferTime-1),(this.buffered.get(l.name)??-1)>=this.tick&&this.active.add(l.name),o<0){this.diagnostics.some(h=>h.message==="Input matching work limit reached.")||this.diagnostics.push({kind:"command",message:"Input matching work limit reached."});break}}for(const[l,c]of this.buffered)c<this.tick&&this.buffered.delete(l);return this.active}matchSequence(e,t){const i=this.history.length-1,s=this.tick-e.time;let r=i,a=null,o=new Set;for(let l=e.sequence.length-1;l>=0;l--){const c=e.sequence[l],h=Up(c);let f=-1;for(let d=r;d>=0&&this.history[d].tick>=s;d--){if(!t())return!1;if(d<r&&(o=new Set),!(!Mr(c,this.history[d])||h.some(u=>o.has(u)))&&!(a!=null&&a.symbol.strict&&!this.strictBetween(d,a.index,c,a.symbol))){f=d;break}}if(f<0)return!1;f!==r&&(o=new Set);for(const d of h)o.add(d);r=f,a={index:f,symbol:c}}return!0}strictBetween(e,t,i,s){const r=this.history[t],a=qc(s,r,this.remap);if(e===t){for(const o of qc(i,r,this.remap))a.add(o);return[...r.changes].every(o=>a.has(o))}for(let o=e+1;o<t;o++)if(this.history[o].changes.size)return!1;return[...r.changes].every(o=>a.has(o))}}const Yc=["a","b","c","x","y","z","s"];function qo(n){return Number.isFinite(Number(n))?Math.max(0,Math.min(8,Math.trunc(Number(n)))):0}function no(n){var t,i,s,r,a,o;let e=(i=(t=n.checks)==null?void 0:t.find(l=>l.key==="cmd"&&l.ok))==null?void 0:i.path;if(!e&&((r=(s=n.def)==null?void 0:s.files)!=null&&r.cmd))try{e=on(n.def.files.cmd,((a=n.path)==null?void 0:a.slice(0,n.path.lastIndexOf("/")+1))||"",!0)}catch{}return Yl(e&&((o=n.files)!=null&&o[e])?Li(n.files[e]):"")}function Kc(n){const e=[];let t=new Set,i=new Set,s=new Set;const r=(a=1,o=[])=>{const l=new Set([...t,...i,...o]),c=e.at(-1);c&&l.size===c.keys.size&&[...l].every(h=>c.keys.has(h))?c.duration+=a:e.push({keys:l,duration:a}),s=l};r();for(const a of n.sequence)if(a.kind==="direction"){const o=new Set(a.keys[0]);a.release?(t=o,r(Math.max(1,a.charge)),t=new Set,r()):(!a.hold&&o.size===t.size&&[...o].every(l=>t.has(l))&&(t=new Set,r()),t=o,r())}else if(a.release){r(Math.max(1,a.charge),a.keys);for(const o of a.keys)i.delete(o);r()}else{if(a.keys.some(o=>s.has(o))&&!a.hold&&r(),a.hold)for(const o of a.keys)i.add(o);r(1,a.keys)}return t=new Set,i=new Set,r(),e}function $u(n){var t,i,s,r;const e=((i=(t=n==null?void 0:n.states)==null?void 0:t.get(-3))==null?void 0:i.controllers)||[];for(const a of e){if(a.type!=="varset")continue;const o=Object.entries(a.values||{}).find(([d])=>/^var\s*\(\s*\d+\s*\)$/.test(d)),l=Number(o?/^var\s*\(\s*(\d+)\s*\)$/.exec(o[0])[1]:(s=a.values)==null?void 0:s.v);if(!Number.isInteger(l)||l<0||l>=60)continue;const c=(a.entries||[]).filter(d=>/^trigger(?:all|[1-9]\d*)$/.test(d.key)).map(d=>d.value).join(`
`);if(!/\bcommand\s*=\s*["']AI\d+["']/i.test(c))continue;const h=d=>(d.entries||[]).some(u=>{if(!/^trigger(?:all|[1-9]\d*)$/.test(u.key))return!1;const p=String(u.value).replace(/\s+/g,"").toLowerCase();return p.includes("var("+l+")!=0")||p.includes("var("+l+")>0")||p.includes("var("+l+")>=1")});if(e.filter(d=>["changestate","selfstate"].includes(d.type)&&h(d)).length<2)continue;const f=Number(o?o[1]:(r=a.values)==null?void 0:r.value);return{index:l,value:Number.isFinite(f)&&f>0?f:1}}return null}function ya(n){var e;return((e=$u(n))==null?void 0:e.index)??null}function Op(n,e){const t=$u(n);return(t==null?void 0:t.index)===e?t.value:1}function qu(n){var r,a;const e=(r=n==null?void 0:n.states)==null?void 0:r.get(-1);if(!((a=e==null?void 0:e.controllers)!=null&&a.length))return ya(n);const t=e.controllers.flatMap(o=>(o.entries||[]).filter(l=>/^trigger(?:all|[1-9]\d*)$/.test(l.key)).map(l=>l.value)).join(`
`),i=[...t.matchAll(/\bvar\s*\(\s*(\d{1,2})\s*\)\s*(?:>=|>)\s*1\b/gi)].map(o=>+o[1]),s=new Set([...t.matchAll(/\bvar\s*\(\s*(\d{1,2})\s*\)\s*<=\s*0\b/gi)].map(o=>+o[1]));return i.find(o=>o<60&&s.has(o))??ya(n)}function kp(n){var i;if(qu(n)!==null)return!0;const e=(i=n==null?void 0:n.states)==null?void 0:i.get(-1);return[...((e==null?void 0:e.controllers)||[]).flatMap(s=>(s.entries||[]).filter(r=>/^trigger(?:all|[1-9]\d*)$/.test(r.key)).map(r=>r.value)),...(n==null?void 0:n.zssExpressions)||[]].some(s=>/\bailevel\b/i.test(String(s)))}class Bp{constructor(e,{level:t=4,seed:i=1831565813,authoredAI:s=!1,nativeAI:r=!1}={}){var o;this.level=qo(t),this.authoredAI=!!s,this.nativeAI=!!r,this.seed=i>>>0||1,this.buffer=new er(e),this.inverse=new Map;for(const l of Yc){const c=((o=e.remap)==null?void 0:o[l])??l;c&&!this.inverse.has(c)&&this.inverse.set(c,l)}const a=e.commands.filter(l=>l.sequence.every(c=>c.kind!=="button"||c.keys.every(h=>this.inverse.has(h))));this.attacks=a.filter(l=>!l.holdOnly&&l.sequence.some(c=>c.kind==="button"&&c.keys.some(h=>h!=="s"))).slice(0,512),this.byName=new Map;for(const l of a)this.byName.has(l.name)||this.byName.set(l.name,[]),this.byName.get(l.name).push(l);this.recoveries=a.filter(l=>l.name.toLowerCase()==="recovery"),this.recoveryNames=new WeakMap,this.recoveryButton=0,this.recovering=!1,this.normal=this.attacks.filter(l=>l.sequence.length===1&&!l.sequence[0].release),this.special=this.attacks.filter(l=>!this.normal.includes(l)),this.plan=[],this.index=0,this.remaining=0,this.cooldown=0,this.raw=new Set,this.lastCommand=null,this.jumpWait=this.authoredAI?18+this.seed%31:170+this.seed%115}random(){let e=this.seed;return e^=e<<13,e^=e>>>17,e^=e<<5,this.seed=e>>>0,this.seed/4294967296}physical(e,t){return new Set([...e].map(i=>i==="F"?t<0?"L":"R":i==="B"?t<0?"R":"L":this.inverse.get(i)||i))}queue(e,t){this.plan=[{keys:new Set(e),duration:t}],this.index=0,this.remaining=0}chooseRecovery(e){var a;const t=(a=e.stateOwner)==null?void 0:a.program.states.get(e.stateNo);let i=t&&this.recoveryNames.get(t);if(t&&!i){i=new Set;for(const o of t.controllers){if(!["changestate","selfstate"].includes(o.type))continue;const l=o.entries.filter(c=>/^trigger(?:all|[1-9]\d*)$/.test(c.key)).map(c=>c.value).join(`
`);if(/\bcanrecover\b/i.test(l))for(const c of l.matchAll(/\bcommand\s*=\s*"([^"\\]*)"/gi))i.add(c[1])}this.recoveryNames.set(t,i)}const s=[...i||[]].flatMap(o=>this.byName.get(o)||[]),r=s.length?s:this.recoveries;if(r.length){const o=r[Math.floor(this.random()*r.length)];this.lastCommand=o.name,this.plan=Kc(o),this.index=0,this.remaining=0}else{const o=Yc.filter(l=>l!=="s"&&this.inverse.has(l));o.length&&this.queue([o[this.recoveryButton++%o.length]],1)}}canJump(e){var t,i;return e.ctrl&&e.moveType!=="H"&&e.stateType==="S"&&e.pos.y>=-.01&&((t=e.program)==null?void 0:t.states.has(40))&&!((i=e.asserted)!=null&&i.has("nojump"))}chooseJump(e,t){const i=Math.abs(t.pos.x-e.pos.x),s=e.coordinateScale||1,r=e.constant("size.ground.front")*s+t.constant("size.ground.front")*(t.coordinateScale||1)+20*s,a=i>r||this.random()<.65,o=!a&&this.random()<.25;return this.queue(a?["U","F"]:o?["U","B"]:["U"],3+Math.floor(this.random()*3)),this.lastCommand=a?"jump-forward":o?"jump-back":"jump-neutral",this.jumpWait=this.authoredAI?Math.max(40,115-this.level*10)+Math.floor(this.random()*35):Math.max(260,500-this.level*20)+Math.floor(this.random()*85),!0}choose(e,t){if(!e.ctrl||e.moveType==="H")return;const i=Math.abs(t.pos.x-e.pos.x),s=e.coordinateScale||1,r=e.constant("size.ground.front")*s+t.constant("size.ground.front")*(t.coordinateScale||1)+20*s;if(this.canJump(e)&&this.jumpWait<=0){this.chooseJump(e,t);return}if(i>r){this.queue(["F"],4+Math.floor(this.random()*9));return}if(t.moveType==="A"&&this.random()<.12+.07*this.level){this.queue(this.random()<.3?["D","B"]:["B"],4+this.level);return}if(this.attacks.length){const a=this.special.length&&this.random()<.08+.055*this.level?this.special:this.normal.length?this.normal:this.attacks,o=a[Math.floor(this.random()*a.length)];this.lastCommand=o.name,this.plan=Kc(o),this.index=0,this.remaining=0}else this.queue([],2)}tick(e,t,{paused:i=!1,enabled:s=!0}={}){var r,a;if(this.nativeAI){if(!this.level||!s||!e.alive||!(t!=null&&t.alive))this.plan=[],this.index=0,this.remaining=0,this.raw=new Set;else if(!i){this.jumpWait>0&&this.jumpWait--,this.index>=this.plan.length&&this.jumpWait<=0&&e.moveType==="I"&&[0,20,100].includes(e.stateNo)&&this.canJump(e)&&this.chooseJump(e,t);const o=this.plan[this.index];o?(this.remaining<=0&&(this.remaining=o.duration),this.raw=this.physical(o.keys,e.facing),--this.remaining<=0&&this.index++):this.raw=new Set}return this.buffer.update(this.raw,e.facing)}if(!this.level||!s||!e.alive||!(t!=null&&t.alive))this.plan=[],this.index=0,this.remaining=0,this.cooldown=0,this.raw=new Set,this.recovering=!1;else if(!i){this.jumpWait>0&&this.jumpWait--;const o=e.moveType==="H"&&!!((r=e.getHitVars)!=null&&r.fall);o!==this.recovering&&(this.plan=[],this.index=0,this.remaining=0,this.cooldown=o?10-this.level:0,this.raw=new Set,this.recovering=o);const l=o&&["A","L"].includes(e.stateType)&&!!((a=e.resolveTrigger)!=null&&a.call(e,"canrecover"));o&&!l&&(this.plan=[],this.index=0,this.remaining=0,this.cooldown=10-this.level,this.raw=new Set),this.authoredAI&&!o&&this.jumpWait<=0&&this.canJump(e)&&this.index>=this.plan.length&&(this.chooseJump(e,t),this.cooldown=0),this.index>=this.plan.length&&(this.cooldown>0?this.cooldown--:o?(l&&this.chooseRecovery(e),this.cooldown=14-this.level):(this.choose(e,t),this.cooldown=Math.max(1,15-this.level*1.5)));const c=this.plan[this.index];c?(this.remaining<=0&&(this.remaining=c.duration),this.raw=this.physical(c.keys,e.facing),--this.remaining<=0&&this.index++):this.raw=new Set}return this.buffer.update(this.raw,e.facing)}}const Bn=(n,e=0)=>Number.isFinite(Number(n))?Number(n):e,Yo=n=>String(n??"").toUpperCase().replace(/\s/g,"");function ps(n,e,t){var r;const i=(r=n.program)==null?void 0:r.constants,s=i instanceof Map?i.get(e):i==null?void 0:i[e];return s===void 0?t:Bn(s,t)}function Wi(n,e="clsn1",t=n.collisionFrame??n.currentFrame){var h,f,d,u;if(!t||!Array.isArray(t[e]))return[];const i=zu(n),s=Ut(i),r=n.facing<0?-1:1,a=ps(i,"size.xscale",1)*s*r,o=ps(i,"size.yscale",1)*s,l=Bn((h=n.pos)==null?void 0:h.x)+ps(n,"size.draw.offset.x",0)*Ut(n)*r+Bn((f=n.drawOffset)==null?void 0:f.x),c=Bn((d=n.pos)==null?void 0:d.y)+ps(n,"size.draw.offset.y",0)*Ut(n)+Bn((u=n.drawOffset)==null?void 0:u.y);return t[e].filter(p=>Array.isArray(p)&&p.length>=4&&p.slice(0,4).every(_=>Number.isFinite(Number(_)))).map(p=>{const _=l+Number(p[0])*a,m=l+Number(p[2])*a,g=c+Number(p[1])*o,y=c+Number(p[3])*o;return[Math.min(_,m),Math.min(g,y),Math.max(_,m),Math.max(g,y)]})}function zp(n,e,t=!1){return t?n[0]<=e[2]&&n[2]>=e[0]&&n[1]<=e[3]&&n[3]>=e[1]:n[0]<e[2]&&n[2]>e[0]&&n[1]<e[3]&&n[3]>e[1]}function Ds(n,e,t=!1){for(const i of n)for(const s of e)if(zp(i,s,t))return[Math.max(i[0],s[0]),Math.max(i[1],s[1]),Math.min(i[2],s[2]),Math.min(i[3],s[3])];return null}function Hp(n,e){var i;const t=e.moveType==="H";return n.includes("+")&&!t||n.includes("-")&&t?!1:e.stateType==="L"?n.includes("D"):e.stateType==="A"?n.includes(e.moveType==="H"&&((i=e.getHitVars)!=null&&i.fall)?"F":"A"):n.includes("M")||n.includes(e.stateType==="C"?"L":"H")}function Vp(n,e,t,i){var l,c,h,f;const s=t.moveType==="H"&&!!((l=t.getHitVars)!=null&&l.guarded);if(!t.ctrl&&!s||t.moveType==="H"&&!s||!["S","C","A"].includes(t.stateType)||(c=e.asserted)!=null&&c.has("unguardable"))return!1;const r=t.stateType==="A"?"noairguard":t.stateType==="C"?"nocrouchguard":"nostandguard";if((h=t.asserted)!=null&&h.has(r))return!1;const a=new Set([...i].map(d=>String(d).toLowerCase()));if(!((f=t.world)!=null&&f.manageInputs?t.movementHeld("holdback"):a.has("holdback")))return!1;const o=Yo(n.guardFlag??n.guardflag);return t.stateType==="A"?o.includes("A"):t.stateType==="C"?/[LM]/.test(o):/[HM]/.test(o)}function jc(n){const e=Array.isArray(n.priority)?n.priority:String(n.priority??"4,Hit").split(","),t=String(e[1]??"Hit").trim().toLowerCase();return{level:Math.max(1,Math.min(7,Bn(e[0],4))),type:["hit","miss","dodge"].includes(t)?t:"hit"}}function Gp(n){if(n.length<2)return n;const e=jc(n[0].hit),t=jc(n[1].hit);return e.level!==t.level?[n[e.level>t.level?0:1]]:e.type==="dodge"||t.type==="dodge"?[]:e.type==="miss"&&t.type==="miss"?[]:n.filter((i,s)=>(s?t:e).type==="hit")}class Wp{constructor(e,{commonText:t="",commonAnimations:i=new Map,opponentCharacter:s=e,leftBound:r=-150,rightBound:a=150,pushboxes:o=!0,maxHelpers:l=56,maxProjectiles:c=256,initialize:h=!0,skipIntro:f=!0,stage:d=null,rules:u=null,combatRules:p={},playerPalette:_=1,opponentPalette:m=1,playerAILevel:g=0,opponentAILevel:y=0,expressionEvaluator:b=null,programs:A=null,manageInputs:x=!1,orderedPhases:M=!1,cameraFollow:v=!1}={}){if(this.expressionEvaluator=b,this.programs=A,this.manageInputs=x,this.orderedPhases=M,this.combatRules=ap(e.files,p),!Number.isFinite(r)||!Number.isFinite(a)||r>=a)throw Error("Invalid training stage bounds.");this.character=e,this.opponentCharacter=s,this.commonText=t,this.leftBound=r,this.rightBound=a,this.pushboxes=o,this.commonAnimations=i,this.maxHelpers=Math.min(256,Math.max(0,l)),this.maxProjectiles=Math.min(1024,Math.max(0,c)),this.initialize=h,this.skipIntro=f,this.playerPalette=_,this.opponentPalette=m,this.playerAILevel=qo(g),this.opponentAILevel=qo(y),this.stage=d?new Ep(d):null,this.cameraRuntime=this.stage||new Tp,this.cameraFollow=!!v,this.rules=u,this.gameMode=u?"versus":"training",this.stage&&(this.leftBound=d.leftBound,this.rightBound=d.rightBound),this.reset()}reset({preserveMatch:e=!1}={}){var s,r,a,o;const t=e?{players:[this.player,this.opponent],flow:this.roundFlow,ticks:this.ticks,diagnostics:this.diagnostics}:null;this.roundFlow=(t==null?void 0:t.flow)||(this.rules?new Cp(this.rules):null),this.roundGeneration=(this.roundGeneration||0)+1,this.stage?this.stage.reset({backgrounds:!e||this.stage.definition.resetBG}):this.cameraRuntime.reset();const i=((s=this.stage)==null?void 0:s.definition.starts)||[{x:-70,y:0,facing:1},{x:70,y:0,facing:-1}];this.player=new _a(this.character,{world:this,program:(r=this.programs)==null?void 0:r.get(this.character),expressionEvaluator:this.expressionEvaluator,commonAnimations:this.commonAnimations,commonText:this.commonText,position:i[0],facing:i[0].facing,id:1,teamSide:1,paletteNo:this.playerPalette,aiLevel:this.playerAILevel}),this.opponent=new _a(this.opponentCharacter,{world:this,program:(a=this.programs)==null?void 0:a.get(this.opponentCharacter),expressionEvaluator:this.expressionEvaluator,commonAnimations:this.commonAnimations,commonText:this.commonText,position:i[1],facing:i[1].facing,id:2,teamSide:2,paletteNo:this.opponentPalette,aiLevel:this.opponentAILevel});for(const l of[this.player,this.opponent])if(l.aiLevel>0){const c=qu(l.program);c!==null&&(l.legacyAIFlag=c,l.legacyAIValue=Op(l.program,ya(l.program)),l.vars[c]=l.legacyAIValue)}if(this.player.teamSide=1,this.opponent.teamSide=2,this.player.opponent=this.opponent,this.opponent.opponent=this.player,this._entities=[this.player,this.opponent],this.projectiles=[],this.nextEntityId=3,this.orphanEffectOwners=[],this.renderEntities=[...this._entities],this.drawProjectiles=[],this.helperCommands=new Map,this.usedHits=new Map,this.juggles=new Map,this.cornerPushActors=new Set,this.archivedDiagnostics=[],this.archivedDiagnosticKeys=new Set,this.pendingPauses=[],this.pause=null,this.superPause=null,this.commandBuffers=new Map,this.presentationEvents=[],this.eventEntities=[],this.pendingCombatEffects=[],this.activeActor=null,this.contactPhase=!1,this.inputBuffers=new Map,this.inputProfiles=new Map,this.manageInputs)for(const l of this._entities)this.inputProfiles.has(l.character)||this.inputProfiles.set(l.character,no(l.character)),this.inputBuffers.set(l,new er(this.inputProfiles.get(l.character)));this.events=[],this.cpus=new Map;for(const l of this._entities)if(l.aiLevel){const c=no(l.character);this.cpus.set(l,new Bp(c,{level:l.aiLevel,authoredAI:kp(l.program),nativeAI:ya(l.program)!==null,seed:1831565813^l.id*2654435769^(((o=this.roundFlow)==null?void 0:o.roundNo)||1)}));for(const h of c.diagnostics)l.diagnostic("command",h.message,{source:l.character.def.files.cmd,line:h.line})}if(this.ticks=(t==null?void 0:t.ticks)||0,this.winner=null,t){this.archiveDiagnostics(t.diagnostics);for(const[l,c]of[this.player,this.opponent].entries()){const h=t.players[l];c.power=h.power,c.victoryQuoteIndex=h.victoryQuoteIndex;const f=Math.max(0,Math.min(60,Math.trunc(c.program.constants.get("data.intpersistindex")??60))),d=Math.max(0,Math.min(40,Math.trunc(c.program.constants.get("data.floatpersistindex")??40)));c.vars.set(h.vars.subarray(f),f),c.fvars.set(h.fvars.subarray(d),d)}}if(this.syncEnvironment(),this.initialize)for(const l of this._entities)l.program.states.has(5900)&&(l._initializing=!0,l.options.skipIntro=this.skipIntro,l.changeState(5900));return this}get diagnostics(){var i;const e=[...this.archivedDiagnostics,...((i=this.stage)==null?void 0:i.diagnostics)||[],...this.entities.flatMap(s=>s.diagnostics||[]),...this.orphanEffectOwners.flatMap(s=>s.diagnostics||[]),...this.projectiles.flatMap(s=>s.diagnostics||[]),...[...this.cpus||new Map].flatMap(([s,r])=>r.buffer.diagnostics.map(a=>({...a,source:s.character.def.files.cmd})))],t=new Set;return e.filter(s=>{const r=typeof s=="string"?s:JSON.stringify(s);return t.has(r)?!1:(t.add(r),!0)})}get entities(){return this._entities.filter(e=>!e.destroyed)}get view(){return this.cameraRuntime.view()}get matchOver(){var e;return((e=this.roundFlow)==null?void 0:e.matchOver)||!1}syncEnvironment(){for(const e of this._entities||[])e.cameraPos=this.cameraRuntime.camera,e.cameraZoom=this.cameraRuntime.camera.zoom,this.roundFlow&&(e.roundState=this.roundFlow.roundState,e.roundNo=this.roundFlow.roundNo,e.roundsExisted=this.roundFlow.roundsExisted)}findPlayer(e){return this.entities.find(t=>t.id===e)}spawnHelper(e,t){if(this.entities.filter(s=>s.parent).length>=this.maxHelpers)return e.diagnostic("resource-limit",`Helper limit (${this.maxHelpers}) reached.`),null;const i=e.createHelper(t,{id:this.nextEntityId++});return i.destroyed?this.archiveDiagnostics(i.diagnostics):(this._entities.push(i),i.keyCtrl&&this.helperCommands.set(i,new er(no(i.root.character))),this.syncEnvironment()),i}spawnProjectile(e,t){if(this.projectiles.length>=this.maxProjectiles)return e.diagnostic("resource-limit",`Projectile limit (${this.maxProjectiles}) reached.`),null;const i=new Ns(e,t,{id:this.nextEntityId++});if(i.removed)return this.archiveDiagnostics(i.diagnostics),i;const s=Object.fromEntries(Object.entries(t).filter(([r])=>r.startsWith("afterimage.")).map(([r,a])=>[r.slice(11),a]));return Object.keys(s).length&&this.presentationEvents.push({...s,type:"afterimage",entity:i}),this.projectiles.push(i),i}retireEffects(e,{removeExplods:t=!1}={}){var i;if(!e._effectsDetached){if(e._effectsDetached=!0,t)e.explods=[],e.drawExplods=[];else if(e.drawExplods=[],e.explods.length){for(const s of e.explods)s.orphaned=!0;this.orphanEffectOwners.push(e)}for(const s of new Set([...this._entities,...this.orphanEffectOwners]))((i=s.bound)==null?void 0:i.target)===e&&(s.bound=null),Yf(s,e)}}destroyHelper(e,{recursive:t=!1,removeExplods:i=!1}={}){const s=[e];if(t)for(const r of this._entities){let a=r.parent,o=0;for(;a&&o++<256;){if(a===e){s.push(r);break}a=a.parent}}for(const r of s)r.destroyed=!0;for(const r of s)this.retireEffects(r,{removeExplods:i})}requestPause(e,t){const i=Math.max(0,Math.trunc(t.time));if(!Number.isFinite(i)||i>36e4){e.diagnostic("resource-limit","Pause time must be between 0 and 360000 ticks.");return}const s={...t,owner:e,time:i,remaining:i,elapsed:0,moved:new Map,movetime:Math.max(0,Math.min(i,t.movetime||0)),endcmdbuftime:Math.max(0,Math.min(i,t.endcmdbuftime||0))};this.pendingPauses.push(s),t.type==="superpause"&&(e.power=Math.max(0,Math.min(e.maxPower,e.power+(t.poweradd||0))),this.presentationEvents.push({...s,type:"superpause"}))}isFrozen(e){var s,r;const t=((s=this.superPause)==null?void 0:s.remaining)>0?this.superPause:((r=this.pause)==null?void 0:r.remaining)>0?this.pause:null;if(!t)return!1;const i=e===t.owner?t.movetime:t.type==="superpause"?e.superMoveTime||0:e.pauseMoveTime||0;return e.isProjectile?i<=0:(t.moved.get(e)||0)>=i}isSuperUnhittable(e){var t;return((t=this.superPause)==null?void 0:t.remaining)>0&&this.superPause.owner===e&&this.superPause.unhittable!==0}advancePause(){var i,s;const e=((i=this.superPause)==null?void 0:i.remaining)>0?this.superPause:((s=this.pause)==null?void 0:s.remaining)>0?this.pause:null,t=r=>{for(const[a,{before:o,applied:l}]of(r==null?void 0:r.defence)||[])a.defenceMultiplier===l&&(a.defenceMultiplier=o)};if(e){for(const r of[...this.entities,...this.projectiles])!this.isFrozen(r)&&!r._hitPausedThisTick&&e.moved.set(r,(e.moved.get(r)||0)+1);e.remaining--,e.elapsed++,e.remaining||t(e)}for(const r of this.pendingPauses){const a=r.type==="superpause"?"superPause":"pause";if(t(this[a]),this[a]=r,a==="superPause"&&r.remaining>0){const o=r.p2defmul>0?r.p2defmul:this.combatRules.superTargetDefence||1.5;r.defence=new Map;for(const l of r.owner.targets){const c=l.defenceMultiplier,h=c/o;r.defence.set(l,{before:c,applied:h}),l.defenceMultiplier=h}}}this.pendingPauses=[]}tick(e=new Set,t=new Set,{playerInput:i=null,opponentInput:s=null}={}){var S,E,P,C,F,I,R,O,k,H;if(this.orderedPhases){for(const L of this.pendingCombatEffects){const{defender:N,attacker:W,damage:B,minimum:j,get:re,give:V}=L;N.life=Math.max(j,Math.min(N.maxLife,N.life-B)),W&&(W.power=Math.max(0,Math.min(W.maxPower,W.power+re)),N.power=Math.max(0,Math.min(N.maxPower,N.power+V)))}this.pendingCombatEffects=[];for(const L of this._entities)L._projectedLife=void 0}this.events=[],this.presentationEvents=[],e=e instanceof Set?e:new Set(e),t=t instanceof Set?t:new Set(t);const r=((S=this.superPause)==null?void 0:S.remaining)>0||((E=this.pause)==null?void 0:E.remaining)>0&&this.pause.pausebg!==0,a=((P=this.superPause)==null?void 0:P.remaining)>0||((C=this.pause)==null?void 0:C.remaining)>0,o=((F=this.pause)==null?void 0:F.remaining)>0?this.pause:null,l=((I=this.superPause)==null?void 0:I.remaining)>0?this.superPause:null;if(this.syncEnvironment(),!this.roundFlow||this.roundFlow.roundState===2)for(const L of[this.player,this.opponent])L.aiLevel>0&&L.legacyAIFlag!==void 0&&L.vars[L.legacyAIFlag]<=0&&(L.vars[L.legacyAIFlag]=L.legacyAIValue||1);this.cpus.has(this.player)&&(e=this.cpus.get(this.player).tick(this.player,this.opponent,{paused:this.isFrozen(this.player)||this.player.hitPauseTime>0,enabled:!this.roundFlow||this.roundFlow.roundState===2})),this.cpus.has(this.opponent)&&(t=this.cpus.get(this.opponent).tick(this.opponent,this.player,{paused:this.isFrozen(this.opponent)||this.opponent.hitPauseTime>0,enabled:!this.roundFlow||this.roundFlow.roundState===2})),this.cpus.has(this.player)&&(i=this.cpus.get(this.player).raw),this.cpus.has(this.opponent)&&(s=this.cpus.get(this.opponent).raw);const c=new Set([...this.entities,...this.projectiles].filter(L=>L.hitPauseTime>0)),h=new Set,f=[];for(let L=0;L<this._entities.length;L++){const N=this._entities[L];if(N.destroyed)continue;f.push(N);let W=N.root===this.player?e:t,B=N.root===this.player?i:s;if(this.manageInputs&&N.keyCtrl){B=new Set(B||[]);for(const V of N.pendingAssertedInputs)B.add(V==="F"?N.facing===1?"R":"L":V==="B"?N.facing===1?"L":"R":V);this.isFrozen(N)||N.pendingAssertedInputs.clear(),this.inputBuffers.has(N)||this.inputBuffers.set(N,new er(this.inputProfiles.get(N.root.character))),W=this.inputBuffers.get(N).update(B,N.facing)}else N.parent&&N.keyCtrl&&B!==null&&(W=this.helperCommands.get(N).update(B,N.facing));(!N.keyCtrl||this.roundFlow&&this.roundFlow.roundState!==2)&&(W=new Set);const j=N.teamSide===this.player.teamSide?this.opponent:this.player,re=this.isFrozen(N);if(N._hitPausedThisTick=N.hitPauseTime>0,!re&&!N._hitPausedThisTick&&(N._projectileContactShield=!1),re){h.add(N);const V=((R=this.superPause)==null?void 0:R.remaining)>0?this.superPause:this.pause;if(V&&V.remaining<=V.endcmdbuftime){this.commandBuffers.has(N)||this.commandBuffers.set(N,new Set);for(const K of W)this.commandBuffers.get(N).add(K)}}else this.commandBuffers.has(N)&&(W=new Set([...W,...this.commandBuffers.get(N)]),this.commandBuffers.delete(N));this.activeActor=N;try{N.tick({commands:W,opponent:j,paused:re,input:N.keyCtrl?B:new Set})}finally{this.activeActor=null}}for(const L of this.projectiles){const N=this.isFrozen(L);N&&h.add(L),L._hitPausedThisTick=L.hitPauseTime>0,L.tick({paused:N})}if(this.stage)for(const L of this.entities)L.screenBound!==!1&&(L.pos.x=Math.max(this.leftBound,Math.min(this.rightBound,L.pos.x)));(this.stage||this.cameraFollow)&&this.cameraRuntime.updateCamera(this.entities,{advance:!a}),this.syncEnvironment(),this.stage&&this.stage.tick({paused:r}),this.orderedPhases&&this.advanceCornerPush(h),this.constrainPositions()&&((this.stage||this.cameraFollow)&&this.cameraRuntime.updateCamera(this.entities,{advance:!1}),this.syncEnvironment(),this.constrainPositions({push:!1}));const u=this.entities;for(const L of u)if(L.moveType!=="H"&&L.stateType!=="L")for(const N of this.juggles.values())N.delete(L.id);const p=this.projectiles.filter(L=>!L.removed&&!L.removing),_=p.map(L=>Wi(L,"clsn2"));for(let L=0;L<p.length;L++){const N=p[L];if(N.removing||!_[L].length)continue;const W=[];for(let j=L+1;j<p.length;j++){const re=p[j];N.teamSide===re.teamSide||re.removing||h.has(N)&&h.has(re)||!Ds(_[L],_[j],this.orderedPhases)||W.push(re)}const B=j=>(j.pos.x-N.pos.x)**2+(j.pos.y-N.pos.y)**2;W.sort((j,re)=>B(j)-B(re)||j.id-re.id);for(const j of W){if(N.removing)break;j.removing||(N.clash(j),j.clash(N))}}const m=this.orderedPhases?this.projectiles.filter(L=>!L.removed||L.drawVisible):p,g=[...u,...m];for(const L of u)L.inGuardDistance=Lu(L,g);const y=[],b=new Set;for(const L of u)if(!(!L.reversalDef||h.has(L)||c.has(L)||this.roundFlow&&this.roundFlow.roundState!==2))for(const N of u){const W=L.reversalDef;if(!W)break;const B=N.hitDef;if(!B||N===L||N.teamSide===L.teamSide||c.has(N)||b.has(N)||!L.attributeMatches(W["reversal.attr"],B.attr)||((O=this.usedHits.get(L))==null?void 0:O.get(N.id))===W.serial)continue;const j=Ds(Wi(L),Wi(N),this.orderedPhases);if(!j)continue;const re=N.receiveHit(W,L);re.rejected||(this.applyCornerPush(L,N,re.cornerPush,W.coordinateScale),N.moveContact=N.moveHit=N.moveGuarded=0,N.moveReversed=1,N.hitDef=null,b.add(N),this.usedHits.has(L)||this.usedHits.set(L,new Map),this.usedHits.get(L).set(N.id,W.serial),this.events.push({type:"reversal",attacker:L,defender:N,hitDef:W,damage:re.damage,guarded:!1,x:(j[0]+j[2])/2,y:(j[1]+j[3])/2,tick:this.ticks}))}const A=u.length>2?new Map:null;for(const L of[...u,...p]){if(this.winner||this.roundFlow&&this.roundFlow.roundState!==2||L.destroyed||h.has(L)||b.has(L)||c.has(L)||L.life<=0||L.moveType!=="A")continue;const N=L.hitDef;if(!N||!/^[SCA]\s*,\s*[NSH][ATP]$/i.test(String(N.attr??"").trim()))continue;const W=Yo(N.hitFlag??N.hitflag??"MAF");if(!/[HLAMFD]/.test(W)||W.includes("+")&&W.includes("-"))continue;const B=Yo(N.affectteam??"E"),j=N.serial??N,re=this.usedHits.get(L);let V;for(const K of[...u].sort((ie,ae)=>Math.abs(ie.pos.x-L.pos.x)-Math.abs(ae.pos.x-L.pos.x))){if(L===K||L.isProjectile&&L.owner===K||K.life<=0||c.has(K))continue;const ie=L.teamSide===K.teamSide;if(B==="E"&&ie||B==="F"&&!ie||!Hp(W,K)||(L instanceof Ns?!L.canHit(K,this.ticks):(re==null?void 0:re.get(K.id))===j))continue;if(V??(V=Wi(L)),!V.length)break;let ae=A==null?void 0:A.get(K);ae||(ae=Wi(K,"clsn2"),A==null||A.set(K,ae));const se=Ds(V,ae,this.orderedPhases);if(!se||typeof K.canBeHit=="function"&&!K.canBeHit(N,L)||String(N[K.stateType==="A"?"air.type":"ground.type"]??N["ground.type"]??"high").toLowerCase()!=="none"&&!this.canJuggle(L,K,N))continue;const be=this.manageInputs||K.parent?K.commands:K===this.player?e:t;y.push({attacker:L,defender:K,hit:N,activation:j,overlap:se,wasFalling:K.stateType==="L"||K.stateType==="A"&&K.moveType==="H"&&!!((k=K.getHitVars)!=null&&k.fall),guarded:Vp(N,L,K,be)})}}const x=y.filter(L=>{const N=y.find(W=>W.attacker===L.defender&&W.defender===L.attacker);return!N||Gp([L,N]).includes(L)}),M=new Set;for(const L of x){if(L.attacker instanceof Ns&&(L.defender._projectileContactShield||!L.attacker.canHit()))continue;let N;this.contactPhase=!0;try{N=L.defender.receiveHit(L.hit,L.attacker,{guarded:L.guarded})}finally{this.contactPhase=!1}N!=null&&N.rejected||(this.applyCornerPush(L.attacker,L.defender,N.cornerPush,L.hit.coordinateScale),!L.guarded&&!N.typeNone&&this.recordJuggle(L.attacker,L.defender,L.hit,{wasFalling:L.wasFalling}),this.usedHits.has(L.attacker)||this.usedHits.set(L.attacker,new Map),this.usedHits.get(L.attacker).set(L.defender.id,L.activation),L.attacker instanceof Ns&&(L.defender._projectileContactShield=!0,L.attacker.onContact({guarded:L.guarded,defer:!0}),M.add(L.attacker)),this.events.push({type:L.guarded?"guard":"hit",attacker:L.attacker,defender:L.defender,hitDef:L.hit,damage:(N==null?void 0:N.damage)??0,guarded:L.guarded,typeNone:!!N.typeNone,x:(L.overlap[0]+L.overlap[2])/2,y:(L.overlap[1]+L.overlap[3])/2,tick:this.ticks}))}for(const L of M)L.finishContacts();for(const L of this.projectiles)L.finishMovementAllowance({paused:h.has(L)});for(const L of this.entities)L.updateExplods({hitPaused:c.has(L),pause:o,superPause:l});for(const L of this._entities)L.destroyed&&!L._effectsDetached&&this.retireEffects(L);for(const L of this.orphanEffectOwners)L.updateExplods({pause:o,superPause:l});this.orphanEffectOwners=this.orphanEffectOwners.filter(L=>L.explods.length||L.drawExplods.length),this.drawProjectiles=this.projectiles.filter(L=>L.drawVisible),this.eventEntities=[...f,...this.projectiles],this.cleanupEntities(),this.advancePause(),this.ticks++;const v=L=>this.entities.some(N=>N.asserted.has(L));if(!this.roundFlow&&!v("noko")&&(this.player.life<=0||this.opponent.life<=0)&&(this.winner=this.player.life<=0&&this.opponent.life<=0?"draw":this.player.life<=0?"opponent":"player"),this.roundFlow){const L=this.roundFlow,N=[this.player,this.opponent],W=L.step({players:N,paused:a,intro:v("intro"),roundNotOver:v("roundnotover"),timerFreeze:v("timerfreeze"),noKO:N.map(()=>v("noko"))});this.syncEnvironment();for(const B of W){if(B.type==="fight")for(const j of N)j.stateNo===0&&(j.ctrl=1);if(B.type==="round-over"&&(this.winner=B.winner),B.type==="result")for(const j of N){const re=B.winner===(j===this.player?"player":"opponent"),V=re?180:B.reason==="time"?170:null;V!==null&&j.program.states.has(V)&&j.changeState(V,0,j)}B.type==="next-round"&&this.reset({preserveMatch:!0}),this.presentationEvents.push({...B,type:"round",event:B.type})}L.matchOver&&L.roundWinner!=="draw"&&((H=this[L.roundWinner])==null||H.selectVictoryQuote())}return this.events}cleanupEntities(){var t;const e=this._entities.filter(i=>i.destroyed);for(const i of e)i._effectsDetached||this.retireEffects(i);for(const i of[...e,...this.projectiles.filter(s=>s.removed)]){this.archiveDiagnostics(i.diagnostics),this.usedHits.delete(i),this.cornerPushActors.delete(i),this.commandBuffers.delete(i),this.inputBuffers.delete(i),this.helperCommands.delete(i),this.juggles.delete(i);for(const s of this.juggles.values())s.delete(i.id)}this._entities=this._entities.filter(i=>!i.destroyed),this.projectiles=this.projectiles.filter(i=>!i.removed);for(const i of this._entities){i.helpers=i.helpers.filter(s=>!s.destroyed),i.targets=i.targets.filter(s=>!s.destroyed&&(!this.orderedPhases||s.moveType==="H"));for(const s of i.targetHitIds.keys())i.targets.some(r=>r.id===s)||i.targetHitIds.delete(s);(t=i.bound)!=null&&t.target.destroyed&&(i.bound=null)}this.renderEntities=[...this._entities,...this.orphanEffectOwners].sort((i,s)=>i.id-s.id)}archiveDiagnostics(e){for(const t of e){const i=JSON.stringify(t);this.archivedDiagnosticKeys.has(i)||(this.archivedDiagnosticKeys.add(i),this.archivedDiagnostics.push(t))}}canJuggle(e,t,i){var c,h,f;if((c=(e.isProjectile?e.creator:e).asserted)!=null&&c.has("nojugglecheck")||!(t.stateType==="L"||t.stateType==="A"&&t.moveType==="H"&&((h=t.getHitVars)==null?void 0:h.fall)))return!0;const r=e.isProjectile?e.owner:e,a=(f=this.juggles.get(r))==null?void 0:f.get(t.id),o=(a==null?void 0:a.remaining)??r.constant("data.airjuggle"),l=e.isProjectile?i["air.juggle"]||0:(a==null?void 0:a.group)===i.juggleGroup?0:i.juggleCost||0;return o>=l}recordJuggle(e,t,i,{wasFalling:s=!1}={}){var h,f;if(!s&&!((h=t.getHitVars)!=null&&h.fall)&&t.stateType!=="L")return;const r=e.isProjectile?e.owner:e;this.juggles.has(r)||this.juggles.set(r,new Map);const a=this.juggles.get(r),o=a.get(t.id),l=(f=(e.isProjectile?e.creator:e).asserted)==null?void 0:f.has("nojugglecheck"),c=l?0:e.isProjectile?i["air.juggle"]||0:(o==null?void 0:o.group)===i.juggleGroup?0:i.juggleCost||0;a.set(t.id,{remaining:Math.max(0,((o==null?void 0:o.remaining)??r.constant("data.airjuggle"))-c),group:i.juggleGroup})}bodyWidth(e,t,i=!1){return aa(e,t,{edge:i})}horizontalLimits(e){var a,o;const t=l=>{var c,h;return Bn((h=(c=e.width)==null?void 0:c.edge)==null?void 0:h[e.facing===l?0:1])*e.coordinateScale},i=this.view;let s=this.orderedPhases?Math.max(this.leftBound,i.left+(((a=this.stage)==null?void 0:a.definition.screenLeft)||0)+t(-1)):this.stage?Math.max(this.leftBound,i.left+Math.max(this.stage.definition.screenLeft,this.bodyWidth(e,-1,!0))):this.leftBound+this.bodyWidth(e,-1,!0),r=this.orderedPhases?Math.min(this.rightBound,i.right-(((o=this.stage)==null?void 0:o.definition.screenRight)||0)-t(1)):this.stage?Math.min(this.rightBound,i.right-Math.max(this.stage.definition.screenRight,this.bodyWidth(e,1,!0))):this.rightBound-this.bodyWidth(e,1,!0);return s>r&&(s=r=(this.leftBound+this.rightBound)/2),{min:s,max:r}}applyCornerPush(e,t,i=0,s=e.coordinateScale){if(e instanceof Ns)return;if(this.orderedPhases){const l=t.pos.x===e.pos.x?e.facing:Math.sign(t.pos.x-e.pos.x);e.cornerPush=Math.fround(i*s*l),e.cornerPushTarget=e.cornerPush?t:null,e.cornerPushSide=l,e.cornerPush?this.cornerPushActors.add(e):this.cornerPushActors.delete(e);return}if(!i||t.screenBound===!1)return;const{min:r,max:a}=this.horizontalLimits(t),o=t.pos.x===e.pos.x?e.facing:Math.sign(t.pos.x-e.pos.x);(o>0?t.pos.x<a-.01:t.pos.x>r+.01)||(e.cornerPush=i*s*o)}advanceCornerPush(e){for(const t of this.cornerPushActors){if(!t.cornerPush||t.destroyed){this.cornerPushActors.delete(t),t.cornerPushTarget=null;continue}if(e.has(t)||t._hitPausedThisTick)continue;const i=t.cornerPushTarget;if(i&&!i.destroyed&&i.screenBound!==!1){const{min:s,max:r}=this.horizontalLimits(i);(t.cornerPushSide>0?i.pos.x>=r:i.pos.x<=s)&&(t.pos.x=Math.fround(t.pos.x+t.cornerPush))}t.cornerPush=Math.fround(t.cornerPush*Math.fround(.7)),Math.abs(t.cornerPush)<t.coordinateScale&&(t.cornerPush=0),t.cornerPush||(t.cornerPushTarget=null,this.cornerPushActors.delete(t))}}constrainPositions({push:e=!0}={}){const t=this.entities,i=new Map(t.map(o=>[o,this.horizontalLimits(o)])),s=o=>{if(o.screenBound!==!1){const{min:l,max:c}=i.get(o);o.pos.x=Math.max(l,Math.min(c,o.pos.x))}};if(t.forEach(s),!this.pushboxes||!e)return!1;let r=!1;const a=t.filter(o=>o.playerPush!==!1).sort((o,l)=>o.id-l.id);for(let o=0;o<a.length;o++)for(let l=o+1;l<a.length;l++){const c=a[o],h=a[l];if(c.teamSide===h.teamSide)continue;const f=c.pos.y-ps(c,"size.height",60)*Ut(c),d=h.pos.y-ps(h,"size.height",60)*Ut(h);if(f>=h.pos.y||d>=c.pos.y||!Ds(Wi(c,"clsn2"),Wi(h,"clsn2")))continue;const[u,p]=c.pos.x<=h.pos.x?[c,h]:[h,c],_=this.bodyWidth(u,1),m=this.bodyWidth(p,-1);for(let g=0;g<(this.orderedPhases?2:1);g++){const y=u.pos.x+_,b=p.pos.x-m,A=this.orderedPhases?Math.fround(Math.fround(y)-Math.fround(b)):u.pos.x+_-p.pos.x+m;if(A<=0||g&&!Ds(Wi(c,"clsn2"),Wi(h,"clsn2")))break;const x=u.screenBound===!1?1/0:Math.max(0,u.pos.x-i.get(u).min),M=p.screenBound===!1?1/0:Math.max(0,i.get(p).max-p.pos.x),v=Math.min(A/2,x),S=Math.min(A-v,M),E=u.pos.x,P=p.pos.x;if(u.pos.x-=Math.min(A-S,x),p.pos.x+=S,this.orderedPhases&&(u.pos.x=Math.fround(u.pos.x),p.pos.x=Math.fround(p.pos.x)),s(u),s(p),r=!0,u.pos.x===E&&p.pos.x===P)break}}return r}}const Qe=(n,e,t="")=>`
[Statedef ${n}]
${e}
${t}
`,xe=(n,e,t="1")=>`
[State 0, ${n}]
type = ${n}
trigger1 = ${t}
${e}
`,st=(n,e,t=1)=>xe("ChangeState",`value = ${n}
ctrl = ${t}`,e),Ke=(n,e="time = 0")=>xe("ChangeAnim",`value = ${n}`,`(${e}) && selfanimexist(${n})`);function Yu({orderedPhases:n=!1}={}){return[Qe(0,`type = S
movetype = I
physics = S
ctrl = 1`,Ke(0,"anim != 0")+xe("VelSet","y = 0","time = 0")+(n?xe("VelSet","x=0","time>=4 || abs(vel x)<const(movement.stand.friction.threshold)"):"")),Qe(10,`type = C
movetype = I
physics = C`+(n?`
velset=0,0`:""),Ke(10)+st(11,"animtime = 0 || !selfanimexist(10)")),Qe(11,`type = C
movetype = I
physics = C
ctrl = 1`,Ke(11)),Qe(12,`type = S
movetype = I
physics = S`,Ke(12)+st(0,"animtime = 0 || !selfanimexist(12)")),Qe(20,`type = S
movetype = I
physics = S
ctrl = 1`,xe("VelSet","x = const(velocity.walk.fwd.x)",'command = "holdfwd"')+xe("VelSet","x = const(velocity.walk.back.x)",'command = "holdback"')+Ke(20,"vel x > 0 && anim != 20")+Ke(21,"vel x < 0 && anim != 21")),Qe(40,`type = S
movetype = I
physics = S
ctrl = 0`,Ke(40)+xe("VelSet",`x = ifelse(command = "holdfwd", const(velocity.jump.fwd.x), ifelse(command = "holdback", const(velocity.jump.back.x), const(velocity.jump.neu.x)))
y = const(velocity.jump.y)`,"animtime = 0 || !selfanimexist(40)")+st(50,"animtime = 0 || !selfanimexist(40)")),Qe(45,`type = A
movetype = I
physics = A
ctrl = 1`,xe("VelSet",`x = ifelse(command = "holdfwd", const(velocity.airjump.fwd.x), ifelse(command = "holdback", const(velocity.airjump.back.x), const(velocity.airjump.neu.x)))
y = const(velocity.airjump.y)`,"time = 0")+st(50,"time > 0")),Qe(50,`type = A
movetype = I
physics = A
ctrl = 1`,Ke("ifelse(vel x = 0, 41, ifelse(vel x > 0, 42, 43))")+st(52,"pos y >= 0 && vel y > 0",0)),Qe(51,`type = A
movetype = I
physics = A`),Qe(52,`type = S
movetype = I
physics = S
ctrl = 0`+(n?`
velset=0,0
anim=47`:""),Ke(47)+xe("PosSet","y = 0","time = 0")+xe("VelSet","y = 0","time = 0")+(n?xe("CtrlSet","value=1","time>=3"):"")+st(0,"time >= 3 && (animtime = 0 || !selfanimexist(47))")),Qe(100,`type = S
movetype = I
physics = `+(n?"S":"N")+`
ctrl = 1`,Ke(100)+xe("VelSet","x = const(velocity.run.fwd.x)")+xe("AssertSpecial",`flag = nowalk
flag2 = noautoturn`)+st(0,'command != "holdfwd"')),Qe(105,`type = A
movetype = I
physics = A
ctrl = 0`,Ke(105)+(n?xe("CtrlSet","value=1","time>=2"):"")+xe("VelSet",`x = const(velocity.run.back.x)
y = const(velocity.run.back.y)`,"time = 0")+st(n?106:52,"pos y >= 0 && vel y > 0",0)),...n?[Qe(106,`type=S
movetype=I
physics=S
ctrl=0`,Ke(47)+xe("PosSet","y=0")+xe("VelSet","y=0")+xe("VelSet","x=0","abs(vel x)<const(movement.stand.friction.threshold)")+st(0,"time>=7"))]:[],...n?[Qe(120,`type=U
movetype=I
physics=U
ctrl=1`,Ke("ifelse(statetype=A,122,ifelse(statetype=C,121,120))")+xe("VelSet",`x=0
y=0`,"statetype!=A")+xe("ChangeState",`value=ifelse(statetype=A,50,ifelse(statetype=C,11,0))
ctrl=1`,'command!="holdback"')+xe("ChangeState",`value=ifelse(statetype=A,132,ifelse(statetype=C,131,130))
ctrl=1`,"animtime=0 || !selfanimexist(ifelse(statetype=A,122,ifelse(statetype=C,121,120)))")),Qe(140,`type=U
movetype=I
physics=U
ctrl=1`,Ke("ifelse(statetype=A,142,ifelse(statetype=C,141,140))")+xe("ChangeState",`value=ifelse(statetype=A,50,ifelse(statetype=C,11,0))
ctrl=1`,'animtime=0 || command!="holdback"'))]:[],...[[120,"S",130],[130,"S",130],[131,"C",131],[132,"A",132],[140,"S",130]].filter(([e])=>!n||e!==120&&e!==140).map(([e,t,i])=>Qe(e,`type = ${t}
movetype = I
physics = ${t}
ctrl = 1${t==="A"?"":`
velset = 0,0`}`,Ke(i)+(n?st(140,"!inguarddist"):"")+st(t==="A"?50:t==="C"?11:0,'command != "holdback"'))),...[[150,"S",150,151],[152,"C",151,153],[154,"A",152,155]].map(([e,t,i,s])=>Qe(e,`type=${t}
movetype=H
physics=N
ctrl=0
velset=0,0`,Ke(i)+st(s,"hitshakeover",0))),...[[151,"S",150],[153,"C",151],[155,"A",152]].map(([e,t,i])=>Qe(e,`type=${t}
movetype=H
physics=${t==="A"?"N":t}
ctrl=0`,Ke(i)+xe("HitVelSet",`x=1
y=1`,"time=0")+xe("CtrlSet","value=1","time>=gethitvar(ctrltime)")+(t==="A"?xe("Gravity","")+st(52,"pos y>=0 && vel y>0",0)+st(132,"time>=gethitvar(ctrltime)"):xe("VelSet","x=0","time>=gethitvar(slidetime)||hitover")+xe("StateTypeSet",`statetype=C
physics=C`,'command="holddown"')+xe("StateTypeSet",`statetype=S
physics=S`,'command!="holddown"')+xe("ChangeState",`value=${n?"ifelse(inguarddist,ifelse(statetype=C,131,130),140)":"ifelse(statetype=C,131,130)"}
ctrl=1`,"hitover")))),...[[5e3,"S","ifelse(gethitvar(groundtype)=2,5010,5000)"],[5010,"C","5020"],[5020,"A","5030"]].map(([e,t,i])=>{const s="5030+gethitvar(animtype)",r="5050+gethitvar(animtype)-3",a=n?`ifelse(gethitvar(animtype)>=3,ifelse(gethitvar(animtype)=3,5030,ifelse(selfanimexist(${r}),${r},5030)),ifelse((gethitvar(fall)||gethitvar(yvel)!=0)&&selfanimexist(${s}),${s},${i}+gethitvar(animtype)))`:`ifelse(gethitvar(animtype)>=3,5030,${i}+gethitvar(animtype))`;return Qe(e,`type=${t}
movetype=H
physics=N
ctrl=0
velset=0,0`,xe("ChangeAnim",`value=${a}`,`time=0 && selfanimexist(${a})`)+(n?xe("StateTypeSet","statetype=A","gethitvar(yvel)!=0 || pos y!=0"):"")+xe("ChangeState",`value=${t==="A"?"5030":`ifelse(gethitvar(fall)||gethitvar(yvel)!=0||pos y!=0,5030,${e+1})`}
ctrl=0`,"hitshakeover"))}),...[[5001,"S"],[5011,"C"]].map(([e,t])=>Qe(e,`type=${t}
movetype=H
physics=${t}
ctrl=0`,(n?Ke("anim"):"")+xe("HitVelSet","x=1","time=0")+xe("VelMul","x=.6","time>=gethitvar(slidetime)")+(n?Ke("anim+5","animtime=0 && (anim=[5000,5002] || anim=[5010,5012] || anim=[5020,5022])"):"")+xe("VelSet","x=0","hitover")+xe("DefenceMulSet","value=1","hitover")+st(0,"hitover"))),...[5030,5035].map(e=>{const t=xe("VelAdd","y=gethitvar(yaccel)",e===5030?"time>0":n?"time>0 || prevstateno!=5030":"1"),i=xe("ChangeState",`value=ifelse(gethitvar(fall),5050,5040)
ctrl=0`,"hitover || (vel y>0 && pos y>=0)")+(e===5030?n?xe("ChangeState",`value=ifelse(anim=[5050,5059],5050,5035)
ctrl=0`,"animtime=0"):st(5035,"animtime=0",0):xe("ChangeState",`value=ifelse(gethitvar(fall),5050,5040)
ctrl=0`,"animtime=0 || !selfanimexist(5035)"));return Qe(e,`type=A
movetype=H
physics=N
ctrl=0`,(e===5030?(n?Ke("ifelse(gethitvar(fall),anim,5030)"):"")+xe("HitVelSet",`x=1
y=1`,"time=0"):Ke(5035))+t+i)}),Qe(5040,`type=A
movetype=H
physics=N
ctrl=1`,Ke(5040)+xe("VelAdd","y=gethitvar(yaccel)")+st(5050,"!alive",0)+st(52,"pos y>=0 && vel y>0",0)+st(50,"animtime=0 || !selfanimexist(5040)")),Qe(5050,`type=A
movetype=H
physics=N
ctrl=0`,(n?Ke("5050+ifelse(gethitvar(animtype)>=3,gethitvar(animtype)-3,0)","(time=0 && anim=5030 && animtime=-1) || (animtime=0 && (anim<5050 || anim>5069))")+Ke("anim+10","vel y>Const240p(-2) && anim=[5051,5052]"):Ke(5050))+xe("SelfState","value=5210",'alive && CanRecover && command="recovery"')+st(5100,n?"vel y>0 && pos y>=ifelse(anim=5050 || anim=5035,const(movement.air.gethit.groundlevel),0)":"pos y>=0 && vel y>0",0)+xe("VelAdd","y=gethitvar(yaccel)",n?"time>0 || (prevstateno!=5030 && prevstateno!=5035)":"1")),Qe(5070,`type=A
movetype=H
physics=N
ctrl=0
velset=0,0`,Ke(5070)+st(5071,"hitshakeover",0)),Qe(5071,`type=A
movetype=H
physics=N
ctrl=0`,(n?Ke("anim"):"")+xe("HitVelSet",`x=1
y=1`,"time=0")+xe("VelAdd","y=gethitvar(yaccel)",n?"time>0":"1")+st(5110,"vel y>0 && pos y>=const(movement.air.gethit.trip.groundlevel)",0)),Qe(5080,`type=L
movetype=H
physics=N
ctrl=0
velset=0,0`,Ke(5080)+st(5030,"hitshakeover && gethitvar(yvel)!=0",0)+st(5081,"hitshakeover && gethitvar(yvel)=0",0)),Qe(5081,`type=L
movetype=H
physics=C
ctrl=0`,xe("HitVelSet","x=1","time=0")+xe("VelSet","x=0","hitover")+st(5110,"hitover",0)),Qe(5100,`type = L
movetype = H
physics = N
ctrl = 0`+(n?"":`
velset = 0,0`),xe("PosSet","y = 0")+(n?xe("PosFreeze","value=1")+xe("VelMul","x=.75","time=0")+xe("VelSet","y=0","time=0"):"")+xe("HitFallDamage","",n?"time=3":"time=0")+xe("FallEnvShake","","time=0")+Ke(n?"ifelse(selfanimexist(5100+ifelse(gethitvar(animtype)>=3,gethitvar(animtype)-3,0)),5100+ifelse(gethitvar(animtype)>=3,gethitvar(animtype)-3,0),5100)":5100)+st(5110,"time>=1 && gethitvar(fall.yvel)=0",0)+st(5101,"time>=1 && (animtime=0 || time>=12 || !selfanimexist(5100))",0)),Qe(5101,`type=L
movetype=H
physics=N
ctrl=0`,Ke(5160)+xe("HitFallVel","","time=0")+xe("PosSet","y=const(movement.down.bounce.offset.y)","time=0")+xe("PosAdd","x=const(movement.down.bounce.offset.x)","time=0")+(n?xe("PosFreeze","value=1","time=0"):"")+xe("VelAdd","y=const(movement.down.bounce.yaccel)",n?"time>0":"1")+st(5110,"time>0 && vel y>0 && pos y>=const(movement.down.bounce.groundlevel)",0)),Qe(5110,`type = L
movetype = H
physics = N
ctrl = 0`,xe("PosSet","y=0","time=0")+xe("VelSet","y=0","time=0")+(n?Ke("ifelse(selfanimexist(5170),5170,5110)")+Ke(5110,"animtime=0 && anim!=5110")+xe("VelMul","x=const(movement.stand.friction)")+xe("VelSet","x=0","abs(vel x)<const(movement.down.friction.threshold)"):Ke(5110))+st(5150,"!alive",0)+st(5120,"time>=1 && gethitvar(recovertime)<=0",0)),Qe(5120,(n?`type=L
physics=N`:`type=S
physics=S`)+`
movetype=I
ctrl=0`,Ke(5120)+xe("SelfState",`value=0
ctrl=1`,"animtime = 0 || !selfanimexist(5120)")),Qe(5150,`type = L
movetype = H
physics = N
ctrl = 0
velset = 0,0`,Ke(5110)),Qe(5200,`type=A
movetype=H
physics=N
ctrl=0`,Ke(5050,"anim=5035 && animtime=0")+xe("VelAdd","y=gethitvar(yaccel)","time>0")+xe("SelfState",`value=5201
ctrl=0`,"vel y>0 && pos y>=const(movement.air.gethit.groundrecover.groundlevel)")),Qe(5201,`type=A
movetype=H
physics=A
ctrl=0
anim=5200`,xe("Turn","","time=0 && p2dist x<const720p(-20)")+xe("VelSet",`x=const(velocity.air.gethit.groundrecover.x)
y=const(velocity.air.gethit.groundrecover.y)`,"time=0")+xe("PosSet","y=0","time=0")+xe("NotHitBy",`value=SCA
time=1`)+xe("PalFX",`time=3
add=128,128,128`,"time=0")+xe("Explod",`anim=F60
pos=0,0
sprpriority=-10`,"time=0")+st(52,"vel y>0 && pos y>=0",1)),Qe(5210,`type=A
movetype=I
physics=N
ctrl=0`,Ke(5210)+xe("PosFreeze","value=1","time<4")+xe("VelMul",n?`x=const(velocity.air.gethit.airrecover.mul.x)
y=const(velocity.air.gethit.airrecover.mul.y)`:`x=.5
y=.2`,"time=4")+xe("VelAdd",n?`x=const(velocity.air.gethit.airrecover.add.x)
y=const(velocity.air.gethit.airrecover.add.y)`:"y=Const240p(-4.5)","time=4")+xe("NotHitBy","value=SCA",n?"time<20":"time<4")+(n?xe("VelAdd","y=const(movement.air.gethit.airrecover.yaccel)","time>=4")+xe("CtrlSet","value=1","time>=20")+st(52,"pos y>=0 && vel y>0",0):st(50,"time>=4")))].join(`
`)}Yu();function Ko(n=""){if(n=String(n).toUpperCase(),n==="S"||n==="SUB")return{mode:"subtract",source:1,destination:1};if(n==="A"||n==="ADD")return{mode:"add",source:1,destination:1};if(n==="A1"||n==="ADD1")return{mode:"add",source:1,destination:.5};const e=/^AS([\d.]+)D([\d.]+)$/.exec(n);return e?{mode:"add",source:Math.max(0,Math.min(256,+e[1]))/256,destination:Math.max(0,Math.min(256,+e[2]))/256}:{mode:"normal",source:1,destination:0}}function Xp(n=0,e=0,t=0){const i=h=>{if(typeof h!="number"||!Number.isFinite(h))throw Error("Sprite angles must be finite numbers.");const f=h%360*Math.PI/180,d=u=>Math.abs(u)<1e-12?0:Math.abs(1-Math.abs(u))<1e-12?Math.sign(u):u;return[d(Math.cos(f)),d(Math.sin(f))]},[s,r]=i(n),[a,o]=i(e),[l,c]=i(t);return{a:l*s,b:o*c*s-a*r,c:l*r,d:a*s+o*c*r}}function oa(n,e,t=0){var l;const i=n==null?void 0:n.frames[e];if(!i)return null;if(!((l=i.interpolate)!=null&&l.length)||i.ticks<=0)return i;const s=n.frames[e+1]||n.frames[n.loopStart||0];if(!s)return i;const r=Math.max(0,Math.min(1,t/i.ticks)),a={...i},o=(c,h)=>c+(h-c)*r;for(const c of i.interpolate)if(c==="offset"&&(a.x=o(i.x,s.x),a.y=o(i.y,s.y)),c==="scale"&&(a.scaleX=o(i.scaleX??1,s.scaleX??1),a.scaleY=o(i.scaleY??1,s.scaleY??1)),c==="angle"&&(a.angle=o(i.angle||0,s.angle||0)),c==="blend"){const h=Ko(i.blend),f=Ko(s.blend);h.mode==="add"&&f.mode==="add"&&(a.blend=`AS${o(h.source,f.source)*256}D${o(h.destination,f.destination)*256}`)}return a}function Ku(n){var r;const e=oa(n.collisionAnimation??n.animation??((r=n.animations)==null?void 0:r.get(n.anim)),n.collisionFrameIndex??n.frameIndex,n.collisionFrameTime??n.frameTime)??n.collisionFrame??n.currentFrame;if(!e)return null;const t=zu(n);if(t===n)return e;const i=(a,o)=>{var l,c;return((c=(l=a.program)==null?void 0:l.constants)==null?void 0:c.get(o))??1},s=(a,o)=>{const l=Ut(n)*i(n,o);return l?(e[a]||0)*Ut(t)*i(t,o)/l:0};return{...e,x:s("x","size.xscale"),y:s("y","size.yscale")}}function Zc(n,e,t,i,s,r,a=256){if(!i)return[0];if(!Number.isFinite(t)||t<=0||!Number.isFinite(e)||e<=0)return[];let o=i===1?Math.floor((s-n-e)/t):0,l=i===1?Math.ceil((r-n)/t):Math.max(0,Math.trunc(i)-1);return Math.max(0,l-o+1)>a&&(l=o+a-1),Array.from({length:Math.max(0,l-o+1)},(h,f)=>o+f)}function br(n,e,t=0){return n.animated?n.spacing[t]:e+n.spacing[t]}function Jc(n,e,t,i,s=0){const r=i>1?t/(i-1):0,a=n.width?n.width[0]/e:n.xscale[0],o=n.width?n.width[1]/e:n.xscale[1],l=a+(o-a)*r,c=n.yScaleStart+s*n.yScaleDelta;return{x:n.width?l:1,delta:n.width?a?l/a:1:l,y:c>0?1/c:0}}const $p=(n,e)=>Array.isArray(n)?n.slice(0,3).map((t,i)=>Number(t??e[i])):[...e],qp=(n,e=0,t=255)=>Math.max(e,Math.min(t,n)),qn=(n,e={})=>({...e,...n,age:0,remaining:n.time??e.time??1}),ni=n=>n&&(n.remaining<0||n.remaining>0);function so(n){n&&(n.age++,n.remaining>0&&n.remaining--)}class Qc{constructor(){this.palettes=new Map,this.afterimages=new Map,this.all=null,this.background=null,this.shake=null,this.environment=null,this.diagnostics=[]}advance({paused:e=()=>!1,backgroundPaused:t=!1}={}){for(const[i,s]of this.palettes)e(i)||so(s),ni(s)||this.palettes.delete(i);for(const[i,s]of this.afterimages)e(i)||so(s),ni(s)||this.afterimages.delete(i);if(!t)for(const i of[this.all,this.background,this.shake,this.environment])so(i)}consume(e,{entity:t}={}){for(const i of e||[]){const s=String(i.type).toLowerCase();if(s==="palfx"&&t){const r=na(t),a=qn(sa(i));ni(a)?this.palettes.set(r,a):this.palettes.delete(r)}else if(s==="allpalfx")this.all=qn(sa(i));else if(s==="bgpalfx")this.background=qn(sa(i));else if(s==="envshake"){const r=i.coordinateScale??(t==null?void 0:t.coordinateScale)??1;this.shake=qn(i,{time:0,freq:60,ampl:-4/r,phase:i.freq>=90?90:0,coordinateScale:r})}else if(s==="envcolor")this.environment=qn(i,{value:[255,255,255],under:0});else if(s==="palettesnapshot"&&i.target)i.target.paletteSnapshot={layers:[],key:"[]"};else if(s==="afterimage"&&t){const r=qn(i,{time:1,length:20,timegap:1,framegap:4,palcolor:256,palbright:[30,30,30],palcontrast:[120,120,220],palpostbright:[0,0,0],paladd:[10,10,25],palmul:[.65,.65,.75],trans:"none"});r.length=qp(Math.trunc(r.length),0,60),r.timegap=Math.max(1,Math.trunc(r.timegap)),r.framegap=Math.max(1,Math.trunc(r.framegap)),r.frames=[],ni(r)&&r.length?this.afterimages.set(t,r):this.afterimages.delete(t)}else if(s==="afterimagetime"&&this.afterimages.has(t)){const r=this.afterimages.get(t);r.remaining=i.time??i.value??0,ni(r)||this.afterimages.delete(t)}}}capture(e,{paused:t=()=>!1}={}){for(const i of e){const s=this.afterimages.get(i);if(!ni(s)||t(i)||s.age%s.timegap!==0||s.lastAge===s.age)continue;const r=Ku(i);r&&(s.lastAge=s.age,s.frames.unshift({entity:i,frame:{...r},pos:{...i.pos},facing:i.facing,coordinateScale:Ut(i),character:i.character,drawScale:{...i.drawScale},drawOffset:{...i.drawOffset},angle:i.angleDraw?i.angle:0,sizeX:i.constant("size.xscale"),sizeY:i.constant("size.yscale"),paletteRemaps:new Map(i.paletteRemaps)}),s.frames.length=Math.min(s.frames.length,s.length))}}paletteFor(e,{ownpal:t=(e==null?void 0:e.ownPal)??(e==null?void 0:e.ownpal),ignoreLocal:i=!1,includeAll:s=!0}={}){const r=i?null:t?e:na(e),a=this.palettes.get(r);let o=ni(a)?[a]:[];return o=[...o,...s&&ni(this.all)?[this.all]:[]].map(l=>Object.fromEntries(Object.entries(l).map(([c,h])=>[c,Array.isArray(h)?[...h]:h]))),{layers:o,key:JSON.stringify(o.map(({add:l,mul:c,sinadd:h,color:f,invertall:d,age:u})=>({add:l,mul:c,sinadd:h,color:f,invertall:d,age:h?u:0})))}}get backgroundPalette(){const e=[this.background,this.all].filter(ni);return{layers:e,key:JSON.stringify(e)}}get cameraOffset(){if(!ni(this.shake))return{x:0,y:0};const e=this.shake;return{x:0,y:-Number(e.ampl)*e.coordinateScale*Math.sin((Number(e.phase)+e.age*Number(e.freq))*Math.PI/180)}}get environmentColor(){return ni(this.environment)?this.environment:null}trailsFor(e){const t=this.afterimages.get(e);if(!ni(t))return[];const i=[];for(let s=0;s<t.frames.length;s+=t.framegap){const r=[{color:t.palcolor,invertall:t.palinvertall,add:t.palbright,mul:t.palcontrast,postadd:t.palpostbright}];for(let a=0;a<s;a++)r.push({add:t.paladd,mul:$p(t.palmul,[1,1,1]).map(o=>o*256)});ni(this.all)&&r.push(this.all),i.push({...t.frames[s],palette:{layers:r,key:JSON.stringify(r)},trans:t.trans})}return i.reverse()}cleanup(e,{paletteOwners:t=e}={}){const i=new Set(e),s=new Set;for(const r of t){const a=na(r);a&&s.add(a)}for(const r of this.palettes.keys())s.has(r)||this.palettes.delete(r);for(const r of this.afterimages.keys())i.has(r)||this.afterimages.delete(r)}}const ze=127,qe=125,cs=124,Yp=new Set("time stateno prevstateno anim animtime ctrl life lifemax power powermax facing alive gametime hitpausetime hitshakeover hitover movecontact movehit moveguarded movereversed hitcount uniqhitcount numenemy numpartner numproj roundstate roundno matchno teamside teampower tickspersecond ailevel palno id win lose drawgame inguarddist canrecover roundsexisted hitfall ishometeam winko wintime winperfect loseko losetime loseperfect".split(" ")),Kp=new Set("pos x|pos y|vel x|vel y|p2dist x|p2dist y|p2bodydist x|p2bodydist y|parentdist x|parentdist y|rootdist x|rootdist y|screenpos x|screenpos y|hitvel x|hitvel y|camerapos x|camerapos y|camerazoom|gamewidth|gameheight|screenwidth|screenheight|leftedge|rightedge|topedge|bottomedge|frontedge|backedge|frontedgedist|backedgedist|frontedgebodydist|backedgebodydist".split("|")),jp=new Set("var sysvar animelemtime animelemno animexist selfanimexist numprojid playeridexist projcanceltime projcontacttime projguardedtime projhittime numhelper numexplod numtarget ishelper".split(" ")),Zp=new Set(["fvar","sysfvar","const240p","const480p","const720p"]),Jp=new Set("name authorname p1name p2name p3name p4name statetype movetype physics p2statetype p2movetype teammode".split(" ")),Qp=new Set("xveladd yveladd xoff yoff zoff xvel yvel yaccel fall.xvel fall.yvel fall.envshake.freq fall.envshake.phase".split(" ")),Sa=["sin","cos","tan","asin","acos","atan","exp","ln"],em=new TextEncoder,Ci=n=>{const e=[];do{const t=n&127;n>>>=7,e.push(t|(n?128:0))}while(n);return e},tm=n=>{n|=0;const e=[];for(;;){const t=n&127;n>>=7;const i=n===0&&!(t&64)||n===-1&&!!(t&64);if(e.push(t|(i?0:128)),i)return e}},ro=n=>{const e=em.encode(n);return[...Ci(e.length),...e]},Ln=n=>[...Ci(n.length),...n.flat()],Fs=(n,e)=>[n,...Ci(e.length),...e],hi=n=>[65,...tm(n)],jo=n=>{const e=new Uint8Array(4);return new DataView(e.buffer).setFloat32(0,n,!0),[67,...e]},ao=[68,0,0,0,0,0,0,0,0],hs=n=>[16,...Ci(n)],ui=n=>[32,...Ci(n)],Yn=n=>[33,...Ci(n)],Si=(n,e)=>n.type===e?n.code:[...n.code,n.type===ze?e===qe?178:183:187],wr=n=>n.type===ze?[...n.code,69,69]:[...n.code,...jo(0),92],Us=n=>[...n,...hs(2)],mt=(n,e)=>({type:n,code:e});class xn extends Error{}class Os extends Error{}class im{constructor(e){this.trigger=e,this.locals=[]}local(e){return this.locals.push(e),this.locals.length-1}read(e,t=[]){const i=Kp.has(e)||Zp.has(e)?qe:Yp.has(e)||jp.has(e)?ze:null;if(!i||t.length>2)throw new xn;const s=[...hi(this.trigger(e)),...hi(t.length)];for(let r=0;r<2;r++)s.push(...t[r]?Si(this.node(t[r]),cs):ao);return s.push(...hs(i===ze?0:1)),mt(i,s)}literal(e,t=ze){return mt(t,[...hi(this.trigger(e)),...hi(0),...ao,...ao,...hs(t===ze?0:1)])}node(e){var t;if(e.kind==="number"){if(e.float&&!Number.isFinite(Math.fround(e.value)))throw new xn;return mt(e.float?qe:ze,e.float?jo(e.value):hi(e.value))}if(e.kind==="name")return e.name==="pi"||e.name==="e"?mt(qe,jo(e.name==="pi"?Math.PI:Math.E)):this.read(e.name);if(e.kind==="unary"){const i=this.node(e.value);if(e.op==="+")return i;if(e.op==="!")return mt(ze,[...wr(i),69]);if(e.op==="-")return mt(i.type,i.type===ze?[...hi(0),...i.code,107]:[...i.code,140]);if(e.op==="~"&&i.type===ze)return mt(ze,[...i.code,...hi(-1),115]);throw new xn}if(e.kind==="legacyanim")return this.binary(e.op,this.read("animelemtime",[e.element]),this.node(e.time));if(e.kind==="legacytime"){if(e.divisor.value<=0)throw new xn;return this.binary(e.op,this.binary("%",this.read("time"),this.node(e.divisor)),this.node(e.remainder))}if(e.kind==="range"){const i=[this.node(e.left),this.node(e.low),this.node(e.high)],s=i.some(l=>l.type===qe)?qe:ze,r=i.map(()=>this.local(s)),a=[];i.forEach((l,c)=>a.push(...Si(l,s),...Yn(r[c])));const o=l=>mt(s,ui(r[l]));return a.push(...this.binary(e.includeLow?">=":">",o(0),o(1)).code,...this.binary(e.includeHigh?"<=":"<",o(0),o(2)).code,113),e.op==="!="&&a.push(69),mt(ze,a)}if(e.kind==="command"){const i=this.literal({name:"command",args:[e.command]});return e.op==="="?i:mt(ze,[...i.code,69])}if(e.kind==="legacyattribute"){const i=this.literal({name:"hitdefattr",args:e.attributes});return e.op==="="?i:mt(ze,[...i.code,69])}if(e.kind==="binary")return["=","!="].includes(e.op)&&e.left.kind==="name"&&Jp.has(e.left.name)&&e.right.kind==="string"?this.literal({name:e.left.name,match:e.right.value,invert:e.op==="!="}):this.binary(e.op,this.node(e.left),this.node(e.right));if(e.kind==="call"){if(e.name==="cond"){const s=this.node(e.args[0]),r=this.node(e.args[1]),a=this.node(e.args[2]);if(r.type!==a.type)throw new xn;return mt(r.type,[...wr(s),4,r.type,...r.code,5,...a.code,11])}if(["const","gethitvar"].includes(e.name)&&["name","string"].includes((t=e.args[0])==null?void 0:t.kind)){const s=e.args[0].name??e.args[0].value,r=e.name==="const"?/^(?:velocity\.|movement\.(?!airjump\.)|size\.[xy]scale$|data\.fall\.defence_mul$)/.test(s)?qe:ze:Qp.has(s)?qe:ze;return this.literal({name:e.name,args:[s]},r)}const i=e.args.map(s=>this.node(s));if(e.name==="abs"){const s=i[0];if(s.type===qe)return mt(qe,[...s.code,139]);const r=this.local(ze);return mt(ze,[...s.code,...Yn(r),...ui(r),...hi(0),72,4,ze,...hi(0),...ui(r),107,5,...ui(r),11])}if(e.name==="min"||e.name==="max"){if(i.some(a=>a.type===qe))return mt(qe,[...Si(i[0],qe),...Si(i[1],qe),e.name==="min"?150:151]);const s=this.local(ze),r=this.local(ze);return mt(ze,[...i[0].code,...Yn(s),...i[1].code,...Yn(r),...ui(s),...ui(r),e.name==="min"?72:74,4,ze,...ui(s),5,...ui(r),11])}return e.name==="ceil"||e.name==="floor"?mt(ze,[...Si(i[0],qe),e.name==="ceil"?141:142,187,...hs(3)]):e.name==="sqrt"?mt(qe,Us([...Si(i[0],qe),145])):Sa.includes(e.name)?mt(qe,Us([...Si(i[0],qe),...hs(4+Sa.indexOf(e.name))])):e.name==="log"?mt(qe,Us([...Si(i[0],qe),...Si(i[1],qe),...hs(12)])):this.read(e.name,e.args)}throw new xn}binary(e,t,i){if(["&&","||","^^"].includes(e))return mt(ze,[...wr(t),...wr(i),e==="&&"?113:e==="||"?114:115]);const s=t.type===qe||i.type===qe?qe:ze,r=[...Si(t,s),...Si(i,s)],a={"=":[70,91],"!=":[71,92],"<":[72,93],">":[74,94],"<=":[76,95],">=":[78,96]};if(a[e])return mt(ze,[...r,a[e][+(s===qe)]]);const o={"+":[106,146],"-":[107,147],"*":[108,148]};if(o[e])return r.push(o[e][+(s===qe)]),mt(s,s===qe?Us(r):r);if(e==="/"){if(s===qe)return mt(qe,Us([...r,149]));const l=this.local(ze),c=this.local(ze);return mt(ze,[...t.code,...Yn(l),...i.code,...Yn(c),...ui(l),...hi(-2147483648),70,...ui(c),...hi(-1),70,113,4,ze,...hi(-2147483648),5,...ui(l),...ui(c),109,11])}if(s===ze&&["%","&","|","^"].includes(e))return mt(ze,[...r,{"%":111,"&":113,"|":114,"^":115}[e]]);throw new xn}}function nm(n){const e=(a,o)=>[96,...Ln(a.map(l=>[l])),1,o],t=[e([ze,ze,cs,cs],ze),e([ze,ze,cs,cs],qe),e([qe],qe),e([cs],ze),e([qe,qe],qe),e([],ze),e([],qe)],i=[["readInt",0],["readFloat",1],["finite",2],["wrap",3],...Sa.map(a=>[a,2]),["log",4]].map(([a,o])=>[...ro("host"),...ro(a),0,...Ci(o)]),s=n.map((a,o)=>[...ro("e"+o),0,...Ci(i.length+o)]),r=n.map(a=>{const o=[];for(const c of a.locals){const h=o.at(-1);(h==null?void 0:h[1])===c?h[0]++:o.push([1,c])}const l=[...Ln(o.map(([c,h])=>[...Ci(c),h])),...a.code,11];return[...Ci(l.length),...l]});return new Uint8Array([0,97,115,109,1,0,0,0,...Fs(1,Ln(t)),...Fs(2,Ln(i)),...Fs(3,Ln(n.map(a=>Ci(a.type===ze?5:6)))),...Fs(7,Ln(s)),...Fs(10,Ln(r))])}class sm{constructor(e=[],{maxFunctions:t=4096,maxBytes:i=2*1024*1024}={}){if(!Number.isInteger(t)||t<0||t>16384||!Number.isInteger(i)||i<0||i>16*1024*1024)throw RangeError("Invalid numeric compilation budget.");this.context=null,this.entries=new Map,this.triggers=[],this.counts={wasm:0,interpreted:0,deoptimized:0,compiled:0,bytes:0};const s=new Map,r=[],a=[],o=d=>{const u=JSON.stringify(d);return s.has(u)||(s.set(u,this.triggers.length),this.triggers.push(typeof d=="string"?{name:d}:d)),s.get(u)};let l=0;for(const d of new Set(e))if(!(typeof d!="string"||!d.trim()||r.length>=t))try{const u=new im(o),p=u.node(ql(d));if((l+=p.code.length)>i)break;a.push({source:d,type:p.type}),r.push({...p,locals:u.locals})}catch(u){if(!(u instanceof xn)&&!(u instanceof vt))throw u}if(!r.length)return;const c=(d,u,p,_,m)=>{if(typeof this.context.resolve!="function")throw new bn("Trigger resolution is unavailable.");const g=this.triggers[d],y=this.context.resolve(g.name,g.args||(u===0?[]:u===1?[p]:[p,_]),null);let b=y;if(g.match!==void 0)if(y!=null&&y.absent)b=+g.invert;else if(typeof y=="string")b=+(y===g.match!=!!g.invert);else throw new Os;if(typeof y=="boolean")b=+y;else if(y&&typeof y.value=="number"){if(!m&&(y.type==="float"||y.float))throw new Os;b=y.value}if(typeof b!="number")throw new Os;if(!Number.isFinite(b))throw new Ot("Expression produced a non-finite number.");if(!m&&!Number.isInteger(b))throw new Os;if(m){if(b=Math.fround(b),!Number.isFinite(b))throw new Ot("Expression produced a non-finite number.");return b}return b|0},h={readInt:(...d)=>c(...d,!1),readFloat:(...d)=>c(...d,!0),finite:d=>{if(!Number.isFinite(d))throw new Ot("Expression produced a non-finite number.");return d},wrap:d=>d|0};for(const d of Sa)h[d]=Math[d==="ln"?"log":d];h.log=(d,u)=>Math.log(u)/Math.log(d),this.binary=nm(r);const f=new WebAssembly.Instance(new WebAssembly.Module(this.binary),{host:h});a.forEach((d,u)=>this.entries.set(d.source,{...d,run:f.exports["e"+u]})),this.counts.compiled=this.entries.size,this.counts.bytes=this.binary.length}evaluate(e,t={}){const i=this.entries.get(e);if(!i)return this.counts.interpreted++,(t.typedResult?Vo:ma)(e,t);const s=this.context;this.context=t;try{const r=i.run();return this.counts.wasm++,t.typedResult?{value:r,float:i.type===qe}:r}catch(r){if(r instanceof Os)return this.entries.delete(e),this.counts.deoptimized++,(t.typedResult?Vo:ma)(e,t);throw r instanceof WebAssembly.RuntimeError?new Ot("Invalid numeric operation.",e):r instanceof vt?(r.source||(r.source=e),r):r!=null&&r.bottom?new Ot(r.message,e):new vt((r==null?void 0:r.message)||"Trigger evaluation failed.",e)}finally{this.context=s}}get stats(){return{...this.counts,activeFunctions:this.entries.size}}}function rm(n,{factor:e,scale:t,cameraX:i,cameraY:s,cropTop:r=0,displayHeight:a=240}){if(!n.window)return null;const[o,l,c,h]=n.window,f=n.windowCentered?0:1;if(c-o+f<=0||h-l+f<=0)return[];const d=n.windowCentered?480:(960-320*t)/2,u=(540-a*t)/2,p=d+(o*e-i*n.windowDelta[0])*t,_=u+(l*e-s*n.windowDelta[1]-r)*t;if(![p,_,(c-o+f)*e*t,(h-l+f)*e*t].every(Number.isFinite))return[];const m=Math.max(0,p),g=Math.max(0,_),y=Math.min(960,p+(c-o+f)*e*t),b=Math.min(540,_+(h-l+f)*e*t);return y>m&&b>g?[m,g,y-m,b-g]:[]}function am(n,e,t,{x:i,y:s,sx:r,sy:a,cameraX:o,cameraY:l,deltaX:c,zoom:h,factor:f,clip:d=null}){if(d&&!d.length)return[];const u=(t.flip||"").includes("H")?-1:1,p=(t.flip||"").includes("V")?-1:1,_=r*(t.scaleX??1)*u;let m=a*(t.scaleY??1)*p;if(![i,s,_,m].every(Number.isFinite)||!_||!m)return[];let g={x:1,delta:1,y:1},y=g;if(n.type==="parallax"&&(g=Jc(n,e.w,0,e.h,l/f),y=Jc(n,e.w,e.h-1,e.h,l/f),a*=g.y,m*=g.y,!m||![g.x,y.x,g.delta,y.delta,m].every(Number.isFinite)))return[];const b=n.type==="parallax"&&n.width?e.w/2:e.x,A=(R,O)=>{const k=-o*c*h*(R.delta-1)/_,H=br(n,e.w)*R.x*Math.sign(_);return[b-b*R.x+k+O*H,b+(e.w-b)*R.x+k+O*H]};if(![...A(g,0),...A(y,0)].every(Number.isFinite))return[];const x=(d==null?void 0:d[0])??0,M=d?d[0]+d[2]:960,v=(d==null?void 0:d[1])??0,S=d?d[1]+d[3]:540,E=new Set;for(const R of[g,y]){const[O,k]=A(R,0),H=i+(t.x||0)*r+(Math.min(O*_,k*_)-b*_);for(const L of Zc(H,Math.abs((k-O)*_),Math.abs(br(n,e.w)*R.x*_),n.tile[0],x,M))E.add(L)}const P=br(n,e.h,1)*Math.abs(m),C=s+(t.y||0)*a,F=Zc(Math.min(C-e.y*m,C+(e.h-e.y)*m),e.h*Math.abs(m),P,n.tile[1],v,S),I=[];for(const R of F)for(const O of E){if(I.length>=8192)return I;const k=n.type==="parallax"?[...A(g,O),...A(y,O)]:null,H=k?0:O*br(n,e.w)*Math.abs(_);I.push({x:i+H,y:s+R*P,sx:r,sy:a,axisX:b,warp:k,clip:d})}return I}let eh;const om=1024*1024,ju=n=>{if(typeof n!="number"||!Number.isFinite(n))throw Error("Expected a finite Lua number.");return n},Mi=n=>Math.trunc(ju(n)),th=(n,e,t)=>Math.max(e,Math.min(t,n)),lm="aiLevel alive anim animElemNo animElemTime animExist animTime authorName backEdge backEdgeBodyDist backEdgeDist cameraZoom canRecover command const const240p const480p const720p ctrl drawGame facing fvar gameHeight gameTime gameWidth getHitVar hitCount hitFall hitOver hitPauseTime hitShakeOver id inGuardDist isHelper isHomeTeam life lifeMax lose map matchNo moveContact moveGuarded moveHit moveReversed moveType name numEnemy numExplod numHelper numPartner numProj numProjId numTarget p2Life p2MoveType p2StateNo p2StateType palNo physics playerIdExist power powerMax prevStateNo random roundNo roundState roundsExisted screenHeight screenWidth stateNo stateType sysfvar sysvar teamMode teamSide ticksPerSecond uniqHitCount var win".split(" "),cm=new Set("alive animExist canRecover ctrl drawGame hitFall hitOver hitShakeOver inGuardDist isHelper isHomeTeam lose playerIdExist win".split(" ")),hm={cameraPos:"camerapos",pos:"pos",vel:"vel",screenPos:"screenpos",hitVel:"hitvel",p2Dist:"p2dist",p2BodyDist:"p2bodydist",parentDist:"parentdist",rootDist:"rootdist"};function Zu(n,e={}){if(e.modules!==void 0&&!Array.isArray(e.modules))throw Error("Lua modules must be an array of archive paths.");const t=Object.keys(n).filter(i=>/(?:^|\/)external\/mods\/[^/]+\.lua$/i.test(i)&&!i.split("/").at(-1).startsWith("-")).sort();for(const i of e.modules||[]){const s=on(i);if(!n[s])throw Error(`Lua module is missing: ${s}`);t.includes(s)||t.push(s)}if(t.length>32)throw Error("Lua module limit (32) exceeded.");return t}const um=`
local rawload, dbg = load, debug
function print(...)
  local parts={}
  for i=1,select('#',...) do parts[i]=tostring(select(i,...)) end
  __kenja_print(table.concat(parts,'	'))
end
local hooks, required = {}, {}
hook = {}
function hook.add(list, name, fn)
  assert(type(list)=="string" and type(name)=="string" and type(fn)=="function", "Invalid hook registration")
  local group=hooks[list]
  if not group then group={order={},items={},known={}};hooks[list]=group end
  if not group.known[name] then assert(#group.order<1024,"Hook limit exceeded");group.order[#group.order+1]=name;group.known[name]=true end
  group.items[name]=fn
end
function hook.stop(list,name) local g=hooks[list];if g then g.items[name]=nil end end
local function runhooks(first,list,...)
  local g=hooks[list];if not g then return end
  local count=#g.order
  for i=1,count do local fn=g.items[g.order[i]];if fn then local v=fn(...);if first and v~=nil then return v end end end
end
function hook.run(list,...) runhooks(false,list,...) end
function hook.runFirst(list,...) return runhooks(true,list,...) end
function load(chunk,name,mode,env)
  assert(type(chunk)=="string","Only text Lua chunks are supported")
  return rawload(chunk,name or "module","t",env or _G)
end
loadstring=load
unpack=table.unpack
table.getn=function(t) return #t end
math.mod=math.fmod
math.log10=function(x) return math.log(x,10) end
local function envslot(fn)
  for i=1,256 do local name,value=dbg.getupvalue(fn,i);if not name then return end;if name=="_ENV" then return i,value end end
end
function getfenv(fn)
  if fn==nil then fn=1 end
  if fn==0 then return _G end
  if type(fn)=="number" then local frame=dbg.getinfo(fn+1,"f");fn=frame and frame.func end
  if type(fn)~="function" then error("Invalid environment target") end
  local _,env=envslot(fn);return env or _G
end
function setfenv(fn,env)
  assert(type(env)=="table","Expected environment table")
  if type(fn)=="number" then local frame=dbg.getinfo(fn+1,"f");fn=frame and frame.func end
  assert(type(fn)=="function","Invalid environment target")
  local i=envslot(fn)
  if i then local function fresh() return env end;dbg.upvaluejoin(fn,i,fresh,1) end
  return fn
end
function loadfile(path)
  local ok,source=pcall(__kenja_read,path,false)
  if not ok then return nil,source end
  return load(source,"@"..path,"t")
end
function dofile(path) local fn,err=loadfile(path);if not fn then error(err) end;return fn() end
package={loaded={},preload={}}
function require(name)
  if package.loaded[name]~=nil then return package.loaded[name] end
  assert(not required[name],"Recursive module load: "..name)
  required[name]=true
  local fn=package.preload[name]
  if not fn then local source=__kenja_read(name,true);local err;fn,err=load(source,"@"..name,"t");if not fn then error(err) end end
  local value=fn(name);required[name]=nil
  if value==nil then value=true end;package.loaded[name]=value;return value
end
io=nil;os=nil;debug=nil;collectgarbage=nil
function __kenja_tick()
  hook.run("loop");hook.run("loop#"..gameMode())
  if type(loop)=="function" then loop() end
  if __kenja_frame then __kenja_frame() end
end
`;class Kl{static async create(e,{factory:t,memoryLimit:i=32*om,instructions:s=1e5}={}){t||(eh??(eh=import("./__vite-browser-external-B_rT5RHW.js").then(function(o){return o.i}).then(({LuaFactory:o})=>{var l;return new o(typeof process<"u"&&((l=process.versions)!=null&&l.node)?void 0:new URL(""+new URL("glue-Dlydm7r2.wasm",import.meta.url).href,import.meta.url).href)})),t=await eh);const r=await t.createEngine({openStandardLibs:!0,injectObjects:!1,enableProxy:!1,traceAllocations:!0}),a=new Kl(e,r,s);r.global.setMemoryMax(i);try{return a.install(),a.run(um,"<match API>"),a}catch(o){throw a.close(),o}}constructor(e,t,i){this.session=e,this.engine=t,this.actor=e.match.player,this.instructions=i,this.fuel=i,this.closed=!1,this.source="<module>",this.hookPointer=0}install(){const e=this.engine.global,t=(r,a)=>e.set(r,a),i=()=>{if(!this.actor||this.actor.destroyed)throw Error("Lua player selection is unavailable.");return this.actor};for(const r of lm)t(r,(...a)=>{const o=i().resolveTrigger(r.toLowerCase(),a),l=o&&typeof o=="object"&&"float"in o?o.value:o;if(!["number","string","boolean"].includes(typeof l))throw Error(`Lua query ${r} requires an unsupported result type.`);return cm.has(r)||r==="getHitVar"&&["fall","fall.recover","fall.kill","guarded","isbound"].includes(String(a[0]).toLowerCase())?!!l:l});for(const[r,a]of Object.entries(hm))for(const o of["X","Y"])t(r+o,()=>i().resolveTrigger(a+" "+o.toLowerCase()));const s=r=>(...a)=>{const o=r(...a);return!o||o.destroyed?!1:(this.actor=o,!0)};t("player",s(r=>[this.session.match.player,this.session.match.opponent][Mi(r)-1])),t("playerId",s(r=>this.session.match.findPlayer(Mi(r)))),t("playerIndex",s(r=>this.session.match.entities[Mi(r)-1])),t("parent",s(()=>i().parent)),t("root",s(()=>i().root)),t("stateOwner",s(()=>i().stateOwner)),t("p2",s(()=>i().opponent)),t("enemy",s((r=0)=>Mi(r)===0?i().opponent:null)),t("enemyNear",s((r=0)=>Mi(r)===0?i().opponent:null)),t("helper",s(r=>i().ownedHelpers().find(a=>r===void 0||a.helperId===Mi(r)))),t("helperIndex",s(r=>i().ownedHelpers()[Mi(r)-1])),t("target",s(r=>i().targets.find(a=>r===void 0||r===-1||i().targetHitIds.get(a.id)===Mi(r)))),t("partner",()=>!1),t("setLife",r=>{const a=i();a.alive&&(a.life=th(Mi(r),0,a.maxLife))}),t("setPower",r=>{const a=i();a.power=th(Mi(r),0,a.maxPower)}),t("changeState",r=>{const a=i(),o=Mi(r);return o===-1?(a.destroyed=!0,!1):a.program.states.has(o)?(a.changeState(o,void 0,a),!0):!1}),t("mapSet",(r,a,o)=>i().setMap(String(r),ju(a),o==="add")),t("playerBufReset",()=>{var a,o;const r=i();(a=this.session.match.inputBuffers.get(r))==null||a.reset(),(o=this.session.match.helperCommands.get(r))==null||o.reset()}),t("playerNo",()=>this.session.match.entities.indexOf(i())+1),t("stateOwnerPlayerNo",()=>this.session.match.entities.indexOf(i().stateOwner)+1),t("animPlayerNo",()=>this.session.match.entities.indexOf(i().animationOwner)+1),t("pauseTime",()=>{var r;return((r=this.session.match.pause)==null?void 0:r.remaining)||0}),t("superPauseTime",()=>{var r;return((r=this.session.match.superPause)==null?void 0:r.remaining)||0}),t("gameMode",()=>this.session.selection.mode==="training"?"training":"versus"),t("matchOver",()=>this.session.match.matchOver),t("localCoordX",()=>{var r,a,o;return((o=(a=(r=i().character.def)==null?void 0:r.info)==null?void 0:a.localcoord)==null?void 0:o.split(",").map(Number)[0])||320}),t("localCoordY",()=>{var r,a,o;return((o=(a=(r=i().character.def)==null?void 0:r.info)==null?void 0:a.localcoord)==null?void 0:o.split(",").map(Number)[1])||240}),t("isAsserted",r=>i().asserted.has(String(r).toLowerCase())),t("inCustomState",()=>i().stateOwner!==i()),t("inCustomAnim",()=>i().animationOwner!==i()),t("__kenja_print",r=>this.session.issue("lua-output",String(r).slice(0,512))),t("__kenja_read",(r,a)=>{let o=String(r);a&&(o=o.replaceAll(".","/")+".lua");const l=["",...this.modules.map(d=>d.includes("/external/mods/")?d.slice(0,d.indexOf("/external/mods/")+1):d.slice(0,d.lastIndexOf("/")+1))],h=[...new Set(l.map(d=>on(o,d)))].find(d=>this.session.files[d]);if(!h)throw Error(`Lua file is missing: ${o}`);const f=this.session.files[h];if(f.length>256*1024)throw Error("Lua source limit (256 KiB) exceeded.");return Li(f)}),this.modules=Zu(this.session.files,this.session.selection),this.hookPointer=e.lua.module.addFunction(()=>{if(this.fuel-=1e3,this.fuel<0){const r=Error("Lua instruction budget exceeded.");throw r.luaBudget=!0,r}},"vii"),e.lua.lua_sethook(e.address,this.hookPointer,8,1e3)}run(e,t="<module>"){if(e.length>256*1024)throw Error("Lua source limit (256 KiB) exceeded.");this.fuel=this.instructions,this.source=t;try{return this.engine.doStringSync(e)}catch(i){throw Error(`${t}: ${i.message}`)}finally{this.engine.global.setTop(0)}}load(){for(const e of this.modules)this.run(Li(this.session.files[e]),e);this.session.selection.lua&&this.run("local fn,err=load("+JSON.stringify(String(this.session.selection.lua))+',"<fight lua>","t");assert(fn,err);__kenja_frame=fn',"<fight lua>")}step(){if(!this.closed){this.fuel=this.instructions;try{const e=this.engine.global;e.lua.lua_getglobal(e.address,"__kenja_tick"),e.runSync(),e.setTop(0)}catch(e){this.session.issue("lua-runtime",e.message),this.close()}}}close(){if(this.closed)return;this.closed=!0;const e=this.engine.global;e.lua.lua_sethook(e.address,0,0,0),e.close(),this.hookPointer&&e.lua.module.removeFunction(this.hookPointer)}}function dm(n,e,t,i,s){if(![e,t,i,s].every(l=>Number.isFinite(l)&&l>0))return[0,0];const r=i/e,a=s/t,o=n==="fit"?Math.min(r,a):n==="fitwidth"?r:n==="fitheight"?a:n==="zoomfill"?Math.max(r,a):1;return n==="stretch"?[r,a]:[o,o]}const ih=Yu({orderedPhases:!0});function fm(n){const e=new Set;for(const t of n){for(const i of t.zssExpressions||[])e.add(i);for(const i of t.states.values())for(const s of[i,...i.controllers])for(const r of s.entries){e.add(r.value);try{for(const a of Zi(r.value))e.add(a)}catch{}}}return e}const pm=(n,e)=>{const t={entity:e};for(const[i,s]of Object.entries(n))(s===null||["number","string","boolean"].includes(typeof s)||Array.isArray(s))&&(t[i]=s);return t},Er=(n,e,t=0)=>{try{return n.constant(e)}catch{return t}};class mm{constructor(e,t={}){this.files=e,this.selection=t,this.characters=_f(e),this.commonEffects=bf(e,{fightDef:t.fightDef,effectsPackage:t.effectsPackage,character:t.character,stage:t.stage});const i=this.characters.find(o=>o.path===t.character)||this.characters[0],s=this.characters.find(o=>o.path===t.opponent)||i;if(!i||!s)throw Error("No playable character definition found.");const r=new Map([...new Set([i,s])].map(o=>[o,Xu(o,{commonText:ih,constantsFromCnsOnly:!0})]));for(const o of r.values()){const l=o.diagnostics.find(c=>c.fatal);if(l)throw Error(`${l.source}:${l.line}: ${l.message}`)}this.expressions=new sm(fm(r.values())),this.commands=[i,s].map(o=>{var c;const l=(c=o.checks.find(h=>h.key==="cmd"&&h.ok))==null?void 0:c.path;return new er(Yl(l?Li(e[l]):""))});const a=t.stage&&t.stage!=="builtin/grid"?bp(e).find(o=>o.path===t.stage):null;if(a!=null&&a.invalid)throw Error("Stage definition could not be parsed.");this.match=new Wp(i,{opponentCharacter:s,commonText:ih,commonAnimations:this.commonEffects.animations,programs:r,manageInputs:!0,orderedPhases:!0,cameraFollow:!0,expressionEvaluator:(o,l)=>this.expressions.evaluate(o,l),stage:a,playerPalette:t.palette||1,opponentPalette:t.opponentPalette||2,skipIntro:t.mode==="training",playerAILevel:t.mode==="cpu"?t.level||4:0,opponentAILevel:["solo","cpu"].includes(t.mode)?t.level||4:0,rules:t.mode==="training"?null:{roundsToWin:2,preIntro:0,introHold:30}}),this.commands=[this.match.inputBuffers.get(this.match.player),this.match.inputBuffers.get(this.match.opponent)],this.effects=new Qc,this.banks=new Map,this.indices=new Map,this.bankIds=new Map,this.spriteMetadata=new Map,this.sent=new Set,this.assets=[],this.events=[],this.sparks=[],this.gameEffects=[],this.roundGeneration=this.match.roundGeneration,this.issues=new Map(this.commonEffects.issues.map(o=>[o.type+":"+o.message,o])),this.closed=!1,this.videoSprites=new Map,this.match.stage&&(this.match.stage.viewportAspect=16/9),this.modelReady=!1,this.lua=null,this.luaModules=Zu(e,t),this.capabilities={format:"kenjatime-core-coverage-v1",engine:"Kenjatime Core",independentRuntime:!0,universalCompatibility:!1,compiledNumericExpressions:!0,scriptInterpreter:!0,luaMatchHooks:!0,stageVideo:!0,gltfStageModels:!0,knownGaps:["Lua APIs beyond match hooks, extended global states and newer ZSS extensions","Compressed glTF extensions, animation pointers and cross-layer model shadows","Video codecs unavailable on the device","Advanced stage camera offsets and mixed-coordinate camera parity","Afterimage palette chains beyond eight layers","Unverified character families and extended controller combinations"]}}issue(e,t){const i=e+":"+t;this.issues.size<2e3&&this.issues.set(i,{type:e,message:t})}async initializeScripts(){if(this.closed||this.lua||!this.luaModules.length&&!this.selection.lua)return;const e=await Kl.create(this);if(this.closed){e.close();return}try{e.load(),this.lua=e}catch(t){throw e.close(),t}}syncRoundGeneration(){this.roundGeneration!==this.match.roundGeneration&&(this.roundGeneration=this.match.roundGeneration,this.gameEffects=[],this.sparks=[],this.events=[],this.effects=new Qc)}tick(e=new Set,t=new Set){var r,a,o;if(this.closed)throw Error("Match is closed.");this.syncRoundGeneration();const i=this.match,s=l=>i.isFrozen(l)||l.hitPauseTime>0;this.effects.advance({paused:s}),this.gameEffects=this.gameEffects.filter(l=>{if(!l.animation.frames.length)return!1;if(l.owner&&s(l.owner))return!0;if(++l.age>(l.maxAge??3600))return!1;const c=l.animation.frames[l.frameIndex];if(c.ticks<0)return!0;if(++l.frameTime>=Math.max(1,c.ticks)&&(l.frameTime=0,++l.frameIndex>=l.animation.frames.length))if(l.animation.loopDeclared||l.animation.loopStart>0)l.frameIndex=l.animation.loopStart;else return!1;return!0}),i.tick(new Set,new Set,{playerInput:e,opponentInput:t}),this.syncRoundGeneration(),(r=this.lua)==null||r.step(),this.commands=[i.inputBuffers.get(i.player),i.inputBuffers.get(i.opponent)];for(const l of i.eventEntities){this.effects.consume(l.events,{entity:l});for(const c of l.events){if(c.type==="gameanim"){const h=this.commonEffects.animations.get(c.anim);h&&this.commonEffects.resource?(this.gameEffects.length>=256&&this.gameEffects.shift(),this.gameEffects.push({animation:h,frameIndex:0,frameTime:0,age:0,owner:l,pos:c.pos,facing:c.facing,under:c.under})):this.issue("common-effects",`GameMakeAnim ${c.anim} requires imported fightfx AIR/SFF.`)}["playsnd","stopsnd","sndpan"].includes(c.type)&&this.events.push({...pm(c,l.id),character:l.character.path})}}for(const l of i.presentationEvents)this.effects.consume([l],{entity:l.entity||l.owner});for(const l of i.events){if(l.typeNone)continue;const c=(a=l.attacker)!=null&&a.isProjectile?l.attacker.owner:l.attacker,h=l.hitDef||{},f=!!l.guarded,d=Number(f?h["guard.sparkno"]:h.sparkno),u=f?h.guardSparkCommon!==!1:h.sparkCommon!==!1,p=u?this.commonEffects.animations:c==null?void 0:c.animations,_=u?this.commonEffects.resource:c==null?void 0:c.character,m=p==null?void 0:p.get(d),g=Array.isArray(h.sparkxy)?h.sparkxy:[0,0],y=h.coordinateScale??(c==null?void 0:c.coordinateScale)??1;let b=!1;if(Number.isFinite(d)&&d>=0&&((o=m==null?void 0:m.frames)!=null&&o.length)&&_&&c){const M=m.frames.filter(S=>S.group>=0);let v=!0;if(M.length)try{this.bank(_);const S=this.indices.get(_);v=M.some(E=>S.has(E.group+","+E.number))}catch(S){v=!1,this.issue("sprite",S.message)}v?(this.gameEffects.length>=256&&this.gameEffects.shift(),this.gameEffects.push({animation:m,resource:_,scale:u?this.commonEffects.scale:Ut(c),frameIndex:0,frameTime:0,age:0,maxAge:120,owner:c,under:!1,pos:{x:l.x+(g[0]||0)*y*c.facing,y:c.pos.y+(g[1]||0)*y},facing:c.facing}),b=!0):this.issue("missing-sprite",`HitDef ${f?"guard ":""}spark ${u?"F":""}${d} contains no source sprites in its SFF.`)}else Number.isFinite(d)&&d>=0&&this.issue("missing-animation",`HitDef ${f?"guard ":""}spark ${u?"F":""}${d} is unavailable from imported assets.`);b||this.sparks.push({x:l.x,y:l.y,age:0,guarded:f});const A=f?h.guardsound:h.hitsound,x=Array.isArray(A)?A:[A,0];c&&x[0]!==void 0&&Number.isFinite(Number(x[0]))&&Number(x[0])>=0&&this.events.push({type:"playsnd",group:Number(x[0]),number:Number(x[1]||0),common:f?h.guardSoundCommon!==!1:h.hitSoundCommon!==!1,channel:-1,character:c.character.path,entity:c.id})}return this.sparks=this.sparks.filter(l=>++l.age<12),this.sparks.length>256&&this.sparks.splice(0,this.sparks.length-256),this.effects.capture([...i.entities,...i.drawProjectiles],{paused:s}),this.effects.cleanup(i.entities),this}bank(e){var t;if(!this.banks.has(e)){const i=(t=e.def)!=null&&t.files?Iu(e):Ru(e.files[e.sprite.path]);this.banks.set(e,i),this.bankIds.set(e,this.banks.size),this.indices.set(e,new Map(i.sprites.map((s,r)=>[s.group+","+s.number,r])))}return this.banks.get(e)}asset(e,t,i){var s,r,a,o,l;if(!t||t.group<0)return null;try{const c=this.bank(e),h=this.indices.get(e).get(t.group+","+t.number);if(h===void 0)return this.issue("missing-sprite",(((s=e==null?void 0:e.sprite)==null?void 0:s.path)||(e==null?void 0:e.path)||"unidentified bank")+": AIR sprite "+t.group+","+t.number+" is absent from source SFF."),null;const f=this.bankIds.get(e),d=f+":"+h;let u=this.spriteMetadata.get(d);if(!u){const b=((r=c.decodeForDisplay)==null?void 0:r.call(c,h))||((a=c.decodeIndexed)==null?void 0:a.call(c,h))||c.decode(h),A=!!b.indices;b.sourceIncomplete&&this.issue("sprite-incomplete",(((o=e==null?void 0:e.sprite)==null?void 0:o.path)||(e==null?void 0:e.path)||"SFF")+" sprite "+t.group+","+t.number+": original PCX contains "+b.decodedPrefixPixels+"/"+b.totalSourcePixels+" encoded pixels. Remaining pixels are transparent; replace source art for native parity."),u={w:b.w,h:b.h,x:b.x||0,y:b.y||0,palette:b.palette,indexed:A,colors:b.colors},this.assets.push({id:d,width:u.w,height:u.h,indexed:A,pixels:new Uint8Array(A?b.indices:b.rgba)}),this.sent.add(d),this.spriteMetadata.set(d,u),c.clearDecodedCache()}const p=u.indexed,_=c.sprites[h],m=(l=c.palettes)==null?void 0:l.find(b=>b.index===(u.palette??_.palette));let g=m?[m.group,m.number]:[1,1];g=(i==null?void 0:i.get(g.join(",")))||(i==null?void 0:i.get("*"))||g;const y=f+":pal:"+g.join(",");if(p&&!this.sent.has(y)){let b;try{b=c.paletteColors(...g)}catch{if(b=u.colors,!b)throw Error("Sprite palette is missing.");this.issue("palette","Requested palette "+g.join(",")+" is unavailable.")}const A=new Uint8Array(1024);A.set(b.subarray(0,1024)),this.assets.push({id:y,width:256,height:1,pixels:A,indexed:!1}),this.sent.add(y)}return{id:d,paletteId:y,indexed:p,w:u.w,h:u.h,x:u.x||0,y:u.y||0}}catch(c){return this.issue("sprite",c.message),null}}quad(e,t,i,{x:s=0,y:r=0,sx:a=1,sy:o=1,facing:l=1,angle:c=0,xangle:h=0,yangle:f=0,remaps:d=null,palette:u=null,trans:p=null,mask:_=!0,alpha:m=1,clip:g=null,corners:y=null,axisX:b=null,warp:A=null,sprite:x=null,axisY:M=null,pass:v=1}={}){var H,L,N;if(!i||e.length>=8192)return;const S=x||this.asset(t,i,d);if(!S)return;a*=l;const E=Xp((i.angle||0)+c,h,f),P=(i.flip||"").includes("H")?-1:1,C=(i.flip||"").includes("V")?-1:1,F=a*P*(i.scaleX??1)*E.a,I=o*C*(i.scaleY??1)*E.b,R=a*P*(i.scaleX??1)*E.c,O=o*C*(i.scaleY??1)*E.d;if(![F,I,R,O,s,r,m].every(Number.isFinite)){this.issue("render-transform","A non-finite sprite transform was skipped.");return}((H=u==null?void 0:u.layers)==null?void 0:H.length)>8&&this.issue("palette-limit","This preview can render eight palette layers per sprite.");let k=i.blend||"";return typeof p=="string"?k=p:p&&p.mode!=="default"&&(k=p.mode==="sub"?"S":p.mode==="none"?"":p.mode==="add1"?"A1":`AS${((L=p.alpha)==null?void 0:L[0])??256}D${((N=p.alpha)==null?void 0:N[1])??256}`),e.push({texture:S.id,palette:S.paletteId,indexed:S.indexed,width:S.w,height:S.h,matrix:[F,I,R,O,s+(i.x||0)*a-F*(b??S.x)-R*(M??S.y),r+(i.y||0)*o-I*(b??S.x)-O*(M??S.y)],blend:Ko(k),mask:_,alpha:m,palFX:(u==null?void 0:u.layers)||[],clip:g,corners:y,warp:A,pass:v}),S}frame(){var d,u,p,_,m,g,y,b,A;const e=this.match,t=e.view,i=Math.min(960/320,540/(t.displayHeight||240)),s=e.cameraRuntime.camera,r=(540-(t.displayHeight||240)*i)/2+(t.groundY||200)*i,a=i*s.zoom,o=[];this.assets=[];const l=x=>({x:480+(x.x-s.x)*a,y:r+(x.y-s.y)*a}),c=x=>{const M=e.stage;if(!M)return;const v=M.definition,S=v.backgroundScale||1,E=v.coordinateScale*S,P=s.x*S,C=s.y*S;for(const[F,I]of M.elements.entries()){if(o.length>=8192){this.issue("resource-limit","Visible quad budget exceeded.");break}if(I.layer!==x||!I.enabled||!I.visible||I.type==="dummy")continue;const R=I.type==="video"?{x:0,y:0}:I.animated?oa(M.animations.get(I.anim),I.drawFrameIndex??I.frameIndex,I.drawFrameTime??I.frameTime):M.frame(I),O=M.position(F);if(!R)continue;const k=I.type==="video"?this.videoSprites.get(I.video.key):this.asset(v,R);if(!k)continue;const H=1+(s.zoom-1)*I.zoomDelta,L=E*i*H*v.xscale*(I.scaleStart[0]+C/E*I.scaleDelta[0]),N=E*i*H*v.yscale*(I.scaleStart[1]+C/E*I.scaleDelta[1]),W=480+(O.x*E-P*O.delta[0])*a,B=r+(O.y*E-(t.zoffset||0)-C*O.delta[1])*a,j=rm(I,{factor:E,scale:i,cameraX:P,cameraY:C,cropTop:t.cropTop,displayHeight:t.displayHeight});if(I.type==="video"){if(j&&!j.length)continue;const[re,V]=dm(I.video.scaleMode,k.w,k.h,I.window?I.window[2]-I.window[0]+(I.windowCentered?0:1):v.localcoord[0],I.window?I.window[3]-I.window[1]+(I.windowCentered?0:1):v.localcoord[1]);this.quad(o,null,R,{sprite:k,x:480+(O.x*E-P*O.delta[0])*a,y:270+(O.y*E-C*O.delta[1])*a,sx:L*re,sy:N*V,axisX:k.w/2,axisY:k.h/2,clip:j,pass:x===1?2:x,angle:I.angle,xangle:I.xangle,yangle:I.yangle,palette:this.effects.backgroundPalette,mask:!1});continue}for(const re of am(I,k,R,{x:W,y:B,sx:L,sy:N,cameraX:P,cameraY:C,deltaX:O.delta[0],zoom:a,factor:E,clip:j})){if(o.length>=8192){this.issue("resource-limit","Visible quad budget exceeded.");break}this.quad(o,v,R,{...re,pass:x===1?2:x,angle:I.angle,xangle:I.xangle,yangle:I.yangle,mask:I.mask,trans:I.transSpecified?{mode:I.trans,alpha:I.alpha}:null,palette:this.effects.backgroundPalette})}}};c(-1),c(0);const h=[];for(const x of[...e.renderEntities,...e.drawProjectiles]){!x.destroyed&&!x.asserted.has("invisible")&&h.push({priority:x.sprPriority||0,actor:x});for(const M of x.drawExplods||[])h.push({priority:Gf(M),actor:x,effect:M})}for(const x of this.gameEffects)h.push({priority:x.under?-1e3:1e3,gameEffect:x});h.sort((x,M)=>x.priority-M.priority);for(const{actor:x,effect:M,gameEffect:v}of h){if(v){const E=l(v.pos),P=a*(v.scale??this.commonEffects.scale);this.quad(o,v.resource||this.commonEffects.resource,oa(v.animation,v.frameIndex,v.frameTime),{...E,sx:P,sy:P,facing:v.facing,remaps:null,palette:this.effects.paletteFor(v.owner)});continue}if(M){const E=M.common?this.commonEffects.resource:x.character;if(!E){this.issue("common-effects","Character requested an unavailable shared effect sprite bank.");continue}const P=M.space==="screen"?{x:M.pos.x*i,y:M.pos.y*i}:l(M.pos),C=(M.coordinateScale??Ut(x))*a*(M.common?this.commonEffects.scale:1);this.quad(o,E,oa(M.animation,M.frameIndex,M.frameTime),{...P,sx:C*(((d=M.scale)==null?void 0:d[0])??1),sy:C*(((u=M.scale)==null?void 0:u[1])??1)*(M.vfacing||1),facing:M.facing,angle:M.angle||0,xangle:M.xangle||0,yangle:M.yangle||0,remaps:M.common?null:M.ownpal?M.paletteRemaps:x.paletteRemaps,palette:this.effects.paletteFor(M.source||x),trans:M.trans});continue}for(const E of this.effects.trailsFor(x)){const P=l({x:E.pos.x+(((p=E.drawOffset)==null?void 0:p.x)||0),y:E.pos.y+(((_=E.drawOffset)==null?void 0:_.y)||0)}),C=a*E.coordinateScale;this.quad(o,E.character,E.frame,{...P,sx:C*E.sizeX*(E.drawScale.x??1),sy:C*E.sizeY*(E.drawScale.y??1),facing:E.facing,angle:E.angle,remaps:E.paletteRemaps,palette:E.palette,trans:E.trans})}const S=l({x:x.pos.x+(((m=x.drawOffset)==null?void 0:m.x)||0)+Er(x,"size.draw.offset.x")*Ut(x)*x.facing,y:x.pos.y+(((g=x.drawOffset)==null?void 0:g.y)||0)+Er(x,"size.draw.offset.y")*Ut(x)});this.quad(o,x.character,Ku(x),{...S,sx:a*Ut(x)*Er(x,"size.xscale",1)*(((y=x.drawScale)==null?void 0:y.x)??1),sy:a*Ut(x)*Er(x,"size.yscale",1)*(((b=x.drawScale)==null?void 0:b.y)??1),facing:x.facing,angle:x.angleDraw?x.angle:0,remaps:x.paletteRemaps,palette:this.effects.paletteFor(x),trans:x.trans})}c(1);const f=this.sparks.map(x=>({...l(x),age:x.age,guarded:x.guarded}));return{width:960,height:540,draws:o,assets:this.assets,sparks:f,model:this.modelReady?{time:e.stage.time/60,camera:{...s},coordinateScale:e.stage.definition.coordinateScale,start:e.stage.definition.camera}:null,ground:r,suppressCharacterShadows:e.entities.some(x=>x.asserted.has("globalnoshadow")),grid:!e.stage||!e.stage.definition.sprite&&!this.modelReady&&!this.videoSprites.size,players:[e.player,e.opponent].map(x=>({id:x.id,name:x.name,x:x.pos.x,y:x.pos.y,life:x.life,maxLife:x.maxLife,power:x.power,maxPower:x.maxPower,state:x.stateNo,time:x.time,anim:x.anim})),ticks:e.ticks,roundState:((A=e.roundFlow)==null?void 0:A.roundState)??2,paused:!1,expressions:this.expressions.stats}}snapshot(){var e;return{engine:"Kenjatime Core",players:[this.match.player,this.match.opponent].map(t=>({id:t.id,name:t.name,x:t.pos.x,y:t.pos.y,life:t.life,maxLife:t.maxLife,power:t.power,maxPower:t.maxPower,state:t.stateNo,time:t.time,anim:t.anim})),ticks:this.match.ticks,roundState:((e=this.match.roundFlow)==null?void 0:e.roundState)??2,expressions:this.expressions.stats,capabilities:this.capabilities,diagnostics:[...this.match.diagnostics,...this.issues.values()]}}drainEvents(){const e=this.events;return this.events=[],e}close(){var e;(e=this.lua)==null||e.close(),this.closed=!0;for(const t of this.banks.values())t.clearDecodedCache();this.banks.clear(),this.sent.clear(),this.gameEffects=[],this.events=[]}}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const jl="187",gm=0,nh=1,vm=2,la=1,_m=2,Ys=3,zn=0,ii=1,Ri=2,vs=0,tr=1,sh=2,rh=3,ah=4,Ju=5,Ji=100,xm=101,Qu=102,ym=103,Sm=104,Mm=200,Zo=201,bm=202,wm=203,ed=204,Ma=205,Em=206,Tm=207,Am=208,Cm=209,Rm=210,Pm=211,Im=212,Lm=213,Nm=214,Jo=0,Qo=1,el=2,rr=3,tl=4,il=5,nl=6,sl=7,td=0,Dm=1,Fm=2,sn=0,id=1,nd=2,sd=3,rd=4,ad=5,od=6,ld=7,oh="attached",Um="detached",cd=300,ys=301,ar=302,oo=303,lo=304,rl=1e3,ai=1001,al=1002,Pt=1003,Om=1004,Tr=1005,kt=1006,co=1007,tn=1008,ti=1009,hd=1010,ud=1011,or=1012,Zl=1013,Bi=1014,gi=1015,zi=1016,Jl=1017,Ql=1018,Ss=1020,dd=35902,fd=35899,pd=1021,md=1022,vi=1023,En=1026,wn=1027,Ua=1028,ec=1029,Hn=1030,tc=1031,ic=1033,ca=33776,ha=33777,ua=33778,da=33779,ol=35840,ll=35841,cl=35842,hl=35843,ul=36196,dl=37492,fl=37496,pl=37488,ml=37489,ba=37490,gl=37491,vl=37808,_l=37809,xl=37810,yl=37811,Sl=37812,Ml=37813,bl=37814,wl=37815,El=37816,Tl=37817,Al=37818,Cl=37819,Rl=37820,Pl=37821,Il=36492,Ll=36494,Nl=36495,Dl=36283,Fl=36284,wa=36285,Ul=36286,km=2200,Bm=2201,zm=2202,Ea=2300,Ol=2301,ho=2302,lh=2303,ms=2400,gs=2401,Ta=2402,nc=2500,Hm=2501,DS=0,FS=1,US=2,Vm=3200,kl=0,Gm=1,Mn="",fi="srgb",lr="srgb-linear",Aa="linear",lt="srgb",uo=7680,Wm=519,Xm=512,$m=513,qm=514,gd=515,Ym=516,Km=517,vd=518,_d=519,xd=35044,Ca="300 es",Ii=2e3,cr=2001;function jm(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Zm(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function hr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Jm(){const n=hr("canvas");return n.style.display="block",n}const ch={};function Ra(...n){const e="THREE."+n.shift();console.log(e,...n)}function yd(n){const e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Pe(...n){n=yd(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function Ue(...n){n=yd(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function _s(...n){const e=n.join(" ");e in ch||(ch[e]=!0,Pe(...n))}function Qm(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}const eg={[Jo]:Jo,[el]:nl,[tl]:tl,[rr]:il,[Qo]:Qo,[nl]:el,[sl]:sl,[il]:rr};class An{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Xt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let hh=1234567;const ir=Math.PI/180,Ms=180/Math.PI;function Hi(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Xt[n&255]+Xt[n>>8&255]+Xt[n>>16&255]+Xt[n>>24&255]+"-"+Xt[e&255]+Xt[e>>8&255]+"-"+Xt[e>>16&15|64]+Xt[e>>24&255]+"-"+Xt[t&63|128]+Xt[t>>8&255]+"-"+Xt[t>>16&255]+Xt[t>>24&255]+Xt[i&255]+Xt[i>>8&255]+Xt[i>>16&255]+Xt[i>>24&255]).toLowerCase()}function Ye(n,e,t){return Math.max(e,Math.min(t,n))}function sc(n,e){return(n%e+e)%e}function tg(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function ig(n,e,t){return n!==e?(t-n)/(e-n):0}function nr(n,e,t){return(1-t)*n+t*e}function ng(n,e,t,i){return nr(n,e,1-Math.exp(-t*i))}function sg(n,e=1){return e-Math.abs(sc(n,e*2)-e)}function rg(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function ag(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function og(n,e){return n+Math.floor(Math.random()*(e-n+1))}function lg(n,e){return n+Math.random()*(e-n)}function cg(n){return n*(.5-Math.random())}function hg(n){n!==void 0&&(hh=n);let e=hh+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function ug(n){return n*ir}function dg(n){return n*Ms}function fg(n){return n>0&&Number.isInteger(n)&&2**Math.round(Math.log2(n))===n}function pg(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Sd(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function mg(n,e,t,i,s){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+i)/2),h=a((e+i)/2),f=r((e-i)/2),d=a((e-i)/2),u=r((i-e)/2),p=a((i-e)/2);switch(s){case"XYX":n.set(o*h,l*f,l*d,o*c);break;case"YZY":n.set(l*d,o*h,l*f,o*c);break;case"ZXZ":n.set(l*f,l*d,o*h,o*c);break;case"XZX":n.set(o*h,l*p,l*u,o*c);break;case"YXY":n.set(l*u,o*h,l*p,o*c);break;case"ZYZ":n.set(l*p,l*u,o*h,o*c);break;default:Pe("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Oa(n){switch(n.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function rc(n,e){if(e.constructor===Float32Array)return n;const t=Oa(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(n/t,-1)}function ac(n,e){if(e.constructor===Float32Array)return n;const t=Oa(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(n*t)}const OS={DEG2RAD:ir,RAD2DEG:Ms,generateUUID:Hi,clamp:Ye,euclideanModulo:sc,mapLinear:tg,inverseLerp:ig,lerp:nr,damp:ng,pingpong:sg,smoothstep:rg,smootherstep:ag,randInt:og,randFloat:lg,randFloatSpread:cg,seededRandom:hg,degToRad:ug,radToDeg:dg,isPowerOfTwo:fg,ceilPowerOfTwo:pg,floorPowerOfTwo:Sd,setQuaternionFromProperEuler:mg,normalize:ac,denormalize:rc},gc=class gc{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ye(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ye(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};gc.prototype.isVector2=!0;let tt=gc;class Oi{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let l=i[s+0],c=i[s+1],h=i[s+2],f=i[s+3],d=r[a+0],u=r[a+1],p=r[a+2],_=r[a+3];if(f!==_||l!==d||c!==u||h!==p){let m=l*d+c*u+h*p+f*_;m<0&&(d=-d,u=-u,p=-p,_=-_,m=-m);let g=1-o;if(m<.9995){const y=Math.acos(m),b=Math.sin(y);g=Math.sin(g*y)/b,o=Math.sin(o*y)/b,l=l*g+d*o,c=c*g+u*o,h=h*g+p*o,f=f*g+_*o}else{l=l*g+d*o,c=c*g+u*o,h=h*g+p*o,f=f*g+_*o;const y=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=y,c*=y,h*=y,f*=y}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=f}static multiplyQuaternionsFlat(e,t,i,s,r,a){const o=i[s],l=i[s+1],c=i[s+2],h=i[s+3],f=r[a],d=r[a+1],u=r[a+2],p=r[a+3];return e[t]=o*p+h*f+l*u-c*d,e[t+1]=l*p+h*d+c*f-o*u,e[t+2]=c*p+h*u+o*d-l*f,e[t+3]=h*p-o*f-l*d-c*u,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(s/2),f=o(r/2),d=l(i/2),u=l(s/2),p=l(r/2);switch(a){case"XYZ":this._x=d*h*f+c*u*p,this._y=c*u*f-d*h*p,this._z=c*h*p+d*u*f,this._w=c*h*f-d*u*p;break;case"YXZ":this._x=d*h*f+c*u*p,this._y=c*u*f-d*h*p,this._z=c*h*p-d*u*f,this._w=c*h*f+d*u*p;break;case"ZXY":this._x=d*h*f-c*u*p,this._y=c*u*f+d*h*p,this._z=c*h*p+d*u*f,this._w=c*h*f-d*u*p;break;case"ZYX":this._x=d*h*f-c*u*p,this._y=c*u*f+d*h*p,this._z=c*h*p-d*u*f,this._w=c*h*f+d*u*p;break;case"YZX":this._x=d*h*f+c*u*p,this._y=c*u*f+d*h*p,this._z=c*h*p-d*u*f,this._w=c*h*f-d*u*p;break;case"XZY":this._x=d*h*f-c*u*p,this._y=c*u*f-d*h*p,this._z=c*h*p+d*u*f,this._w=c*h*f+d*u*p;break;default:Pe("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],f=t[10],d=i+o+f;if(d>0){const u=.5/Math.sqrt(d+1);this._w=.25/u,this._x=(h-l)*u,this._y=(r-c)*u,this._z=(a-s)*u}else if(i>o&&i>f){const u=2*Math.sqrt(1+i-o-f);this._w=(h-l)/u,this._x=.25*u,this._y=(s+a)/u,this._z=(r+c)/u}else if(o>f){const u=2*Math.sqrt(1+o-i-f);this._w=(r-c)/u,this._x=(s+a)/u,this._y=.25*u,this._z=(l+h)/u}else{const u=2*Math.sqrt(1+f-i-o);this._w=(a-s)/u,this._x=(r+c)/u,this._y=(l+h)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ye(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-i*c,this._z=r*h+a*c+i*l-s*o,this._w=a*h-i*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let i=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const vc=class vc{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(uh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(uh.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*i),h=2*(o*t-r*s),f=2*(r*i-a*t);return this.x=t+l*c+a*f-o*h,this.y=i+l*h+o*c-r*f,this.z=s+l*f+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this.z=Ye(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this.z=Ye(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ye(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-i*l,this.z=i*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return fo.copy(this).projectOnVector(e),this.sub(fo)}reflect(e){return this.sub(fo.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ye(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};vc.prototype.isVector3=!0;let Y=vc;const fo=new Y,uh=new Oi,_c=class _c{constructor(e,t,i,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c)}set(e,t,i,s,r,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],f=i[7],d=i[2],u=i[5],p=i[8],_=s[0],m=s[3],g=s[6],y=s[1],b=s[4],A=s[7],x=s[2],M=s[5],v=s[8];return r[0]=a*_+o*y+l*x,r[3]=a*m+o*b+l*M,r[6]=a*g+o*A+l*v,r[1]=c*_+h*y+f*x,r[4]=c*m+h*b+f*M,r[7]=c*g+h*A+f*v,r[2]=d*_+u*y+p*x,r[5]=d*m+u*b+p*M,r[8]=d*g+u*A+p*v,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-i*r*h+i*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],f=h*a-o*c,d=o*l-h*r,u=c*r-a*l,p=t*f+i*d+s*u;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/p;return e[0]=f*_,e[1]=(s*c-h*i)*_,e[2]=(o*i-s*a)*_,e[3]=d*_,e[4]=(h*t-s*l)*_,e[5]=(s*r-o*t)*_,e[6]=u*_,e[7]=(i*l-c*t)*_,e[8]=(a*t-i*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return _s("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(po.makeScale(e,t)),this}rotate(e){return _s("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(po.makeRotation(-e)),this}translate(e,t){return _s("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(po.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};_c.prototype.isMatrix3=!0;let ke=_c;const po=new ke,dh=new ke().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),fh=new ke().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function gg(){const n={enabled:!0,workingColorSpace:lr,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===lt&&(s.r=rn(s.r),s.g=rn(s.g),s.b=rn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===lt&&(s.r=xs(s.r),s.g=xs(s.g),s.b=xs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Mn?Aa:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[a].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[lr]:{primaries:e,whitePoint:i,transfer:Aa,toXYZ:dh,fromXYZ:fh,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:fi},outputColorSpaceConfig:{drawingBufferColorSpace:fi}},[fi]:{primaries:e,whitePoint:i,transfer:lt,toXYZ:dh,fromXYZ:fh,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:fi}}}),n}const et=gg();function rn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function xs(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Kn;class vg{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Kn===void 0&&(Kn=hr("canvas")),Kn.width=e.width,Kn.height=e.height;const s=Kn.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=Kn}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=hr("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=rn(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(rn(t[i]/255)*255):t[i]=rn(t[i]);return{data:t,width:e.width,height:e.height}}else return Pe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let _g=0;class oc{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:_g++}),this.uuid=Hi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width||0,t.height||0,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(mo(s[a].image)):r.push(mo(s[a]))}else r=mo(s);i.url=r}return t||(e.images[this.uuid]=i),i}}function mo(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?vg.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Pe("Texture: Unable to serialize Texture."),{})}let xg=0;const go=new Y;class Vt extends An{constructor(e=Vt.DEFAULT_IMAGE,t=Vt.DEFAULT_MAPPING,i=ai,s=ai,r=kt,a=tn,o=vi,l=ti,c=Vt.DEFAULT_ANISOTROPY,h=Mn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:xg++}),this.uuid=Hi(),this.name="",this.source=new oc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new tt(0,0),this.repeat=new tt(1,1),this.center=new tt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ke,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(go).x}get height(){return this.source.getSize(go).y}get depth(){return this.source.getSize(go).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){Pe(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Pe(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==cd)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case rl:e.x=e.x-Math.floor(e.x);break;case ai:e.x=e.x<0?0:1;break;case al:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case rl:e.y=e.y-Math.floor(e.y);break;case ai:e.y=e.y<0?0:1;break;case al:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Vt.DEFAULT_IMAGE=null;Vt.DEFAULT_MAPPING=cd;Vt.DEFAULT_ANISOTROPY=1;const xc=class xc{constructor(e=0,t=0,i=0,s=1){this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r;const l=e.elements,c=l[0],h=l[4],f=l[8],d=l[1],u=l[5],p=l[9],_=l[2],m=l[6],g=l[10];if(Math.abs(h-d)<.01&&Math.abs(f-_)<.01&&Math.abs(p-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(f+_)<.1&&Math.abs(p+m)<.1&&Math.abs(c+u+g-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const b=(c+1)/2,A=(u+1)/2,x=(g+1)/2,M=(h+d)/4,v=(f+_)/4,S=(p+m)/4;return b>A&&b>x?b<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(b),s=M/i,r=v/i):A>x?A<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(A),i=M/s,r=S/s):x<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(x),i=v/r,s=S/r),this.set(i,s,r,t),this}let y=Math.sqrt((m-p)*(m-p)+(f-_)*(f-_)+(d-h)*(d-h));return Math.abs(y)<.001&&(y=1),this.x=(m-p)/y,this.y=(f-_)/y,this.z=(d-h)/y,this.w=Math.acos((c+u+g-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this.z=Ye(this.z,e.z,t.z),this.w=Ye(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this.z=Ye(this.z,e,t),this.w=Ye(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ye(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};xc.prototype.isVector4=!0;let ut=xc;class yg extends An{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:kt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new ut(0,0,e,t),this.scissorTest=!1,this.viewport=new ut(0,0,e,t),this.textures=[];const s=i.count;for(let r=0;r<s;r++)this.textures[r]=new Vt({width:e,height:t,depth:i.depth}),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:kt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new oc(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ki extends yg{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Md extends Vt{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Pt,this.minFilter=Pt,this.wrapR=ai,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Sg extends Vt{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Pt,this.minFilter=Pt,this.wrapR=ai,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}const Na=class Na{constructor(e,t,i,s,r,a,o,l,c,h,f,d,u,p,_,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c,h,f,d,u,p,_,m)}set(e,t,i,s,r,a,o,l,c,h,f,d,u,p,_,m){const g=this.elements;return g[0]=e,g[4]=t,g[8]=i,g[12]=s,g[1]=r,g[5]=a,g[9]=o,g[13]=l,g[2]=c,g[6]=h,g[10]=f,g[14]=d,g[3]=u,g[7]=p,g[11]=_,g[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Na().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,i=e.elements,s=1/jn.setFromMatrixColumn(e,0).length(),r=1/jn.setFromMatrixColumn(e,1).length(),a=1/jn.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),f=Math.sin(r);if(e.order==="XYZ"){const d=a*h,u=a*f,p=o*h,_=o*f;t[0]=l*h,t[4]=-l*f,t[8]=c,t[1]=u+p*c,t[5]=d-_*c,t[9]=-o*l,t[2]=_-d*c,t[6]=p+u*c,t[10]=a*l}else if(e.order==="YXZ"){const d=l*h,u=l*f,p=c*h,_=c*f;t[0]=d+_*o,t[4]=p*o-u,t[8]=a*c,t[1]=a*f,t[5]=a*h,t[9]=-o,t[2]=u*o-p,t[6]=_+d*o,t[10]=a*l}else if(e.order==="ZXY"){const d=l*h,u=l*f,p=c*h,_=c*f;t[0]=d-_*o,t[4]=-a*f,t[8]=p+u*o,t[1]=u+p*o,t[5]=a*h,t[9]=_-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const d=a*h,u=a*f,p=o*h,_=o*f;t[0]=l*h,t[4]=p*c-u,t[8]=d*c+_,t[1]=l*f,t[5]=_*c+d,t[9]=u*c-p,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const d=a*l,u=a*c,p=o*l,_=o*c;t[0]=l*h,t[4]=_-d*f,t[8]=p*f+u,t[1]=f,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=u*f+p,t[10]=d-_*f}else if(e.order==="XZY"){const d=a*l,u=a*c,p=o*l,_=o*c;t[0]=l*h,t[4]=-f,t[8]=c*h,t[1]=d*f+_,t[5]=a*h,t[9]=u*f-p,t[2]=p*f-u,t[6]=o*h,t[10]=_*f+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Mg,e,bg)}lookAt(e,t,i){const s=this.elements;return si.subVectors(e,t),si.lengthSq()===0&&(si.z=1),si.normalize(),fn.crossVectors(i,si),fn.lengthSq()===0&&(Math.abs(i.z)===1?si.x+=1e-4:si.z+=1e-4,si.normalize(),fn.crossVectors(i,si)),fn.normalize(),Ar.crossVectors(si,fn),s[0]=fn.x,s[4]=Ar.x,s[8]=si.x,s[1]=fn.y,s[5]=Ar.y,s[9]=si.y,s[2]=fn.z,s[6]=Ar.z,s[10]=si.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],f=i[5],d=i[9],u=i[13],p=i[2],_=i[6],m=i[10],g=i[14],y=i[3],b=i[7],A=i[11],x=i[15],M=s[0],v=s[4],S=s[8],E=s[12],P=s[1],C=s[5],F=s[9],I=s[13],R=s[2],O=s[6],k=s[10],H=s[14],L=s[3],N=s[7],W=s[11],B=s[15];return r[0]=a*M+o*P+l*R+c*L,r[4]=a*v+o*C+l*O+c*N,r[8]=a*S+o*F+l*k+c*W,r[12]=a*E+o*I+l*H+c*B,r[1]=h*M+f*P+d*R+u*L,r[5]=h*v+f*C+d*O+u*N,r[9]=h*S+f*F+d*k+u*W,r[13]=h*E+f*I+d*H+u*B,r[2]=p*M+_*P+m*R+g*L,r[6]=p*v+_*C+m*O+g*N,r[10]=p*S+_*F+m*k+g*W,r[14]=p*E+_*I+m*H+g*B,r[3]=y*M+b*P+A*R+x*L,r[7]=y*v+b*C+A*O+x*N,r[11]=y*S+b*F+A*k+x*W,r[15]=y*E+b*I+A*H+x*B,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],f=e[6],d=e[10],u=e[14],p=e[3],_=e[7],m=e[11],g=e[15],y=l*u-c*d,b=o*u-c*f,A=o*d-l*f,x=a*u-c*h,M=a*d-l*h,v=a*f-o*h;return t*(_*y-m*b+g*A)-i*(p*y-m*x+g*M)+s*(p*b-_*x+g*v)-r*(p*A-_*M+m*v)}determinantAffine(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return t*(a*h-o*c)-i*(r*h-o*l)+s*(r*c-a*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],f=e[9],d=e[10],u=e[11],p=e[12],_=e[13],m=e[14],g=e[15],y=t*o-i*a,b=t*l-s*a,A=t*c-r*a,x=i*l-s*o,M=i*c-r*o,v=s*c-r*l,S=h*_-f*p,E=h*m-d*p,P=h*g-u*p,C=f*m-d*_,F=f*g-u*_,I=d*g-u*m,R=y*I-b*F+A*C+x*P-M*E+v*S;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const O=1/R;return e[0]=(o*I-l*F+c*C)*O,e[1]=(s*F-i*I-r*C)*O,e[2]=(_*v-m*M+g*x)*O,e[3]=(d*M-f*v-u*x)*O,e[4]=(l*P-a*I-c*E)*O,e[5]=(t*I-s*P+r*E)*O,e[6]=(m*A-p*v-g*b)*O,e[7]=(h*v-d*A+u*b)*O,e[8]=(a*F-o*P+c*S)*O,e[9]=(i*P-t*F-r*S)*O,e[10]=(p*M-_*A+g*y)*O,e[11]=(f*A-h*M-u*y)*O,e[12]=(o*E-a*C-l*S)*O,e[13]=(t*C-i*E+s*S)*O,e[14]=(_*b-p*x-m*y)*O,e[15]=(h*x-f*b+d*y)*O,this}scale(e){const t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+i,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+i,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,f=o+o,d=r*c,u=r*h,p=r*f,_=a*h,m=a*f,g=o*f,y=l*c,b=l*h,A=l*f,x=i.x,M=i.y,v=i.z;return s[0]=(1-(_+g))*x,s[1]=(u+A)*x,s[2]=(p-b)*x,s[3]=0,s[4]=(u-A)*M,s[5]=(1-(d+g))*M,s[6]=(m+y)*M,s[7]=0,s[8]=(p+b)*v,s[9]=(m-y)*v,s[10]=(1-(d+_))*v,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinantAffine();if(r===0)return i.set(1,1,1),t.identity(),this;let a=jn.set(s[0],s[1],s[2]).length();const o=jn.set(s[4],s[5],s[6]).length(),l=jn.set(s[8],s[9],s[10]).length();r<0&&(a=-a),bi.copy(this);const c=1/a,h=1/o,f=1/l;return bi.elements[0]*=c,bi.elements[1]*=c,bi.elements[2]*=c,bi.elements[4]*=h,bi.elements[5]*=h,bi.elements[6]*=h,bi.elements[8]*=f,bi.elements[9]*=f,bi.elements[10]*=f,t.setFromRotationMatrix(bi),i.x=a,i.y=o,i.z=l,this}makePerspective(e,t,i,s,r,a,o=Ii,l=!1){const c=this.elements,h=2*r/(t-e),f=2*r/(i-s),d=(t+e)/(t-e),u=(i+s)/(i-s);let p,_;if(l)p=r/(a-r),_=a*r/(a-r);else if(o===Ii)p=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===cr)p=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=f,c[9]=u,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=Ii,l=!1){const c=this.elements,h=2/(t-e),f=2/(i-s),d=-(t+e)/(t-e),u=-(i+s)/(i-s);let p,_;if(l)p=1/(a-r),_=a/(a-r);else if(o===Ii)p=-2/(a-r),_=-(a+r)/(a-r);else if(o===cr)p=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=f,c[9]=0,c[13]=u,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};Na.prototype.isMatrix4=!0;let je=Na;const jn=new Y,bi=new je,Mg=new Y(0,0,0),bg=new Y(1,1,1),fn=new Y,Ar=new Y,si=new Y,ph=new je,mh=new Oi;class Tn{constructor(e=0,t=0,i=0,s=Tn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],f=s[2],d=s[6],u=s[10];switch(t){case"XYZ":this._y=Math.asin(Ye(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,u),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ye(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,u),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ye(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,u),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ye(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,u),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Ye(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,u));break;case"XZY":this._z=Math.asin(-Ye(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,u),this._y=0);break;default:Pe("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return ph.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ph,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return mh.setFromEuler(this),this.setFromQuaternion(mh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Tn.DEFAULT_ORDER="XYZ";class bd{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let wg=0;const gh=new Y,Zn=new Oi,Xi=new je,Cr=new Y,ks=new Y,Eg=new Y,Tg=new Oi,vh=new Y(1,0,0),_h=new Y(0,1,0),xh=new Y(0,0,1),yh={type:"added"},Ag={type:"removed"},Jn={type:"childadded",child:null},vo={type:"childremoved",child:null};class wt extends An{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:wg++}),this.uuid=Hi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=wt.DEFAULT_UP.clone();const e=new Y,t=new Tn,i=new Oi,s=new Y(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new je},normalMatrix:{value:new ke}}),this.matrix=new je,this.matrixWorld=new je,this.matrixAutoUpdate=wt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=wt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new bd,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Zn.setFromAxisAngle(e,t),this.quaternion.multiply(Zn),this}rotateOnWorldAxis(e,t){return Zn.setFromAxisAngle(e,t),this.quaternion.premultiply(Zn),this}rotateX(e){return this.rotateOnAxis(vh,e)}rotateY(e){return this.rotateOnAxis(_h,e)}rotateZ(e){return this.rotateOnAxis(xh,e)}translateOnAxis(e,t){return gh.copy(e).applyQuaternion(this.quaternion),this.position.add(gh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(vh,e)}translateY(e){return this.translateOnAxis(_h,e)}translateZ(e){return this.translateOnAxis(xh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Xi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Cr.copy(e):Cr.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),ks.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Xi.lookAt(ks,Cr,this.up):Xi.lookAt(Cr,ks,this.up),this.quaternion.setFromRotationMatrix(Xi),s&&(Xi.extractRotation(s.matrixWorld),Zn.setFromRotationMatrix(Xi),this.quaternion.premultiply(Zn.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ue("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(yh),Jn.child=e,this.dispatchEvent(Jn),Jn.child=null):Ue("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Ag),vo.child=e,this.dispatchEvent(vo),vo.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Xi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Xi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Xi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(yh),Jn.child=e,this.dispatchEvent(Jn),Jn.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ks,e,Eg),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ks,Tg,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*i-r[8]*s,r[13]+=i-r[1]*t-r[5]*i-r[9]*s,r[14]+=s-r[2]*t-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,i)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];r(e.shapes,f)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),f=a(e.shapes),d=a(e.skeletons),u=a(e.animations),p=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),f.length>0&&(i.shapes=f),d.length>0&&(i.skeletons=d),u.length>0&&(i.animations=u),p.length>0&&(i.nodes=p)}return i.object=s,i;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}wt.DEFAULT_UP=new Y(0,1,0);wt.DEFAULT_MATRIX_AUTO_UPDATE=!0;wt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Rr extends wt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Cg={type:"move"};class _o{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Rr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Rr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new Y,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new Y),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Rr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new Y,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new Y,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const _ of e.hand.values()){const m=t.getJointPose(_,i),g=this._getHandJoint(c,_);m!==null&&(g.matrix.fromArray(m.transform.matrix),g.matrix.decompose(g.position,g.quaternion,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=m.radius),g.visible=m!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],d=h.position.distanceTo(f.position),u=.02,p=.005;c.inputState.pinching&&d>u+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=u-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.quaternion,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Cg)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Rr;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const wd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},pn={h:0,s:0,l:0},Pr={h:0,s:0,l:0};function xo(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class $e{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=fi){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,et.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=et.workingColorSpace){return this.r=e,this.g=t,this.b=i,et.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=et.workingColorSpace){if(e=sc(e,1),t=Ye(t,0,1),i=Ye(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=xo(a,r,e+1/3),this.g=xo(a,r,e),this.b=xo(a,r,e-1/3)}return et.colorSpaceToWorking(this,s),this}setStyle(e,t=fi){function i(r){r!==void 0&&parseFloat(r)<1&&Pe("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,t);break;case"hsl":case"hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Pe("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Pe("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=fi){const i=wd[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Pe("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=rn(e.r),this.g=rn(e.g),this.b=rn(e.b),this}copyLinearToSRGB(e){return this.r=xs(e.r),this.g=xs(e.g),this.b=xs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=fi){return et.workingToColorSpace($t.copy(this),e),Math.round(Ye($t.r*255,0,255))*65536+Math.round(Ye($t.g*255,0,255))*256+Math.round(Ye($t.b*255,0,255))}getHexString(e=fi){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=et.workingColorSpace){et.workingToColorSpace($t.copy(this),t);const i=$t.r,s=$t.g,r=$t.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=h<=.5?f/(a+o):f/(2-a-o),a){case i:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-i)/f+2;break;case r:l=(i-s)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=et.workingColorSpace){return et.workingToColorSpace($t.copy(this),t),e.r=$t.r,e.g=$t.g,e.b=$t.b,e}getStyle(e=fi){et.workingToColorSpace($t.copy(this),e);const t=$t.r,i=$t.g,s=$t.b;return e!==fi?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(pn),this.setHSL(pn.h+e,pn.s+t,pn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(pn),e.getHSL(Pr);const i=nr(pn.h,Pr.h,t),s=nr(pn.s,Pr.s,t),r=nr(pn.l,Pr.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const $t=new $e;$e.NAMES=wd;class Rg extends wt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Tn,this.environmentIntensity=1,this.environmentRotation=new Tn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background!==null?e.background.clone():null,this.environment=e.environment!==null?e.environment.clone():null,this.fog=e.fog!==null?e.fog.clone():null,this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial!==null?e.overrideMaterial.clone():null,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}const wi=new Y,$i=new Y,yo=new Y,qi=new Y,Qn=new Y,es=new Y,Sh=new Y,So=new Y,Mo=new Y,bo=new Y,wo=new ut,Eo=new ut,To=new ut;class Pi{constructor(e=new Y,t=new Y,i=new Y){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),wi.subVectors(e,t),s.cross(wi);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){wi.subVectors(s,t),$i.subVectors(i,t),yo.subVectors(e,t);const a=wi.dot(wi),o=wi.dot($i),l=wi.dot(yo),c=$i.dot($i),h=$i.dot(yo),f=a*c-o*o;if(f===0)return r.set(0,0,0),null;const d=1/f,u=(c*l-o*h)*d,p=(a*h-o*l)*d;return r.set(1-u-p,p,u)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,qi)===null?!1:qi.x>=0&&qi.y>=0&&qi.x+qi.y<=1}static getInterpolation(e,t,i,s,r,a,o,l){return this.getBarycoord(e,t,i,s,qi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,qi.x),l.addScaledVector(a,qi.y),l.addScaledVector(o,qi.z),l)}static getInterpolatedAttribute(e,t,i,s,r,a){return wo.setScalar(0),Eo.setScalar(0),To.setScalar(0),wo.fromBufferAttribute(e,t),Eo.fromBufferAttribute(e,i),To.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(wo,r.x),a.addScaledVector(Eo,r.y),a.addScaledVector(To,r.z),a}static isFrontFacing(e,t,i,s){return wi.subVectors(i,t),$i.subVectors(e,t),wi.cross($i).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return wi.subVectors(this.c,this.b),$i.subVectors(this.a,this.b),wi.cross($i).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Pi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Pi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return Pi.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return Pi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Pi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,r=this.c;let a,o;Qn.subVectors(s,i),es.subVectors(r,i),So.subVectors(e,i);const l=Qn.dot(So),c=es.dot(So);if(l<=0&&c<=0)return t.copy(i);Mo.subVectors(e,s);const h=Qn.dot(Mo),f=es.dot(Mo);if(h>=0&&f<=h)return t.copy(s);const d=l*f-h*c;if(d<=0&&l>=0&&h<=0&&l-h>0)return a=l/(l-h),t.copy(i).addScaledVector(Qn,a);bo.subVectors(e,r);const u=Qn.dot(bo),p=es.dot(bo);if(p>=0&&u<=p)return t.copy(r);const _=u*c-l*p;if(_<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(i).addScaledVector(es,o);const m=h*p-u*f;if(m<=0&&f-h>=0&&u-p>=0)return Sh.subVectors(r,s),o=(f-h)/(f-h+(u-p)),t.copy(s).addScaledVector(Sh,o);const g=1/(m+_+d);return a=_*g,o=d*g,t.copy(i).addScaledVector(Qn,a).addScaledVector(es,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Cn{constructor(e=new Y(1/0,1/0,1/0),t=new Y(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Ei.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Ei.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Ei.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Ei):Ei.fromBufferAttribute(r,a),Ei.applyMatrix4(e.matrixWorld),this.expandByPoint(Ei);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ir.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Ir.copy(i.boundingBox)),Ir.applyMatrix4(e.matrixWorld),this.union(Ir)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Ei),Ei.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Bs),Lr.subVectors(this.max,Bs),ts.subVectors(e.a,Bs),is.subVectors(e.b,Bs),ns.subVectors(e.c,Bs),mn.subVectors(is,ts),gn.subVectors(ns,is),Nn.subVectors(ts,ns);let t=[0,-mn.z,mn.y,0,-gn.z,gn.y,0,-Nn.z,Nn.y,mn.z,0,-mn.x,gn.z,0,-gn.x,Nn.z,0,-Nn.x,-mn.y,mn.x,0,-gn.y,gn.x,0,-Nn.y,Nn.x,0];return!Ao(t,ts,is,ns,Lr)||(t=[1,0,0,0,1,0,0,0,1],!Ao(t,ts,is,ns,Lr))?!1:(Nr.crossVectors(mn,gn),t=[Nr.x,Nr.y,Nr.z],Ao(t,ts,is,ns,Lr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ei).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Ei).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Yi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Yi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Yi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Yi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Yi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Yi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Yi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Yi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Yi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Yi=[new Y,new Y,new Y,new Y,new Y,new Y,new Y,new Y],Ei=new Y,Ir=new Cn,ts=new Y,is=new Y,ns=new Y,mn=new Y,gn=new Y,Nn=new Y,Bs=new Y,Lr=new Y,Nr=new Y,Dn=new Y;function Ao(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){Dn.fromArray(n,r);const o=s.x*Math.abs(Dn.x)+s.y*Math.abs(Dn.y)+s.z*Math.abs(Dn.z),l=e.dot(Dn),c=t.dot(Dn),h=i.dot(Dn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Qi=Pg();function Pg(){const n=new ArrayBuffer(4),e=new Float32Array(n),t=new Uint32Array(n),i=new Uint32Array(512),s=new Uint32Array(512);for(let l=0;l<256;++l){const c=l-127;c<-27?(i[l]=0,i[l|256]=32768,s[l]=24,s[l|256]=24):c<-14?(i[l]=1024>>-c-14,i[l|256]=1024>>-c-14|32768,s[l]=-c-1,s[l|256]=-c-1):c<=15?(i[l]=c+15<<10,i[l|256]=c+15<<10|32768,s[l]=13,s[l|256]=13):c<128?(i[l]=31744,i[l|256]=64512,s[l]=24,s[l|256]=24):(i[l]=31744,i[l|256]=64512,s[l]=13,s[l|256]=13)}const r=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;(c&8388608)===0;)c<<=1,h-=8388608;c&=-8388609,h+=947912704,r[l]=c|h}for(let l=1024;l<2048;++l)r[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)a[l]=l<<23;a[31]=1199570944,a[32]=2147483648;for(let l=33;l<63;++l)a[l]=2147483648+(l-32<<23);a[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(o[l]=1024);return{floatView:e,uint32View:t,baseTable:i,shiftTable:s,mantissaTable:r,exponentTable:a,offsetTable:o}}function Ig(n){Math.abs(n)>65504&&Pe("DataUtils.toHalfFloat(): Value out of range."),n=Ye(n,-65504,65504),Qi.floatView[0]=n;const e=Qi.uint32View[0],t=e>>23&511;return Qi.baseTable[t]+((e&8388607)>>Qi.shiftTable[t])}function Lg(n){const e=n>>10;return Qi.uint32View[0]=Qi.mantissaTable[Qi.offsetTable[e]+(n&1023)]+Qi.exponentTable[e],Qi.floatView[0]}class kS{static toHalfFloat(e){return Ig(e)}static fromHalfFloat(e){return Lg(e)}}const Tt=new Y,Dr=new tt;let Ng=0;class an extends An{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Ng++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=xd,this.updateRanges=[],this.gpuType=gi,this.version=0,this._normalizationScale=e!==void 0?Oa(e):void 0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Dr.fromBufferAttribute(this,t),Dr.applyMatrix3(e),this.setXY(t,Dr.x,Dr.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Tt.fromBufferAttribute(this,t),Tt.applyMatrix3(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Tt.fromBufferAttribute(this,t),Tt.applyMatrix4(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Tt.fromBufferAttribute(this,t),Tt.applyNormalMatrix(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Tt.fromBufferAttribute(this,t),Tt.transformDirection(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=this._denormalize(i)),i}setComponent(e,t,i){return this.normalized&&(i=this._normalize(i)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i),s=this._normalize(s)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i),s=this._normalize(s),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(e){const t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):rc(e,this.array)}_normalize(e){const t=this._normalizationScale;return t!==void 0?Math.round(e*t):ac(e,this.array)}}class Ed extends an{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Td extends an{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class oi extends an{constructor(e,t,i){super(new Float32Array(e),t,i)}}const Dg=new Cn,zs=new Y,Co=new Y;class ln{constructor(e=new Y,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Dg.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;zs.subVectors(e,this.center);const t=zs.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(zs,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Co.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(zs.copy(e.center).add(Co)),this.expandByPoint(zs.copy(e.center).sub(Co))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let Fg=0;const di=new je,Ro=new wt,ss=new Y,ri=new Cn,Hs=new Cn,Ft=new Y;class Vi extends An{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Fg++}),this.uuid=Hi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(jm(e)?Td:Ed)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new ke().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return di.makeRotationFromQuaternion(e),this.applyMatrix4(di),this}rotateX(e){return di.makeRotationX(e),this.applyMatrix4(di),this}rotateY(e){return di.makeRotationY(e),this.applyMatrix4(di),this}rotateZ(e){return di.makeRotationZ(e),this.applyMatrix4(di),this}translate(e,t,i){return di.makeTranslation(e,t,i),this.applyMatrix4(di),this}scale(e,t,i){return di.makeScale(e,t,i),this.applyMatrix4(di),this}lookAt(e){return Ro.lookAt(e),Ro.updateMatrix(),this.applyMatrix4(Ro.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ss).negate(),this.translate(ss.x,ss.y,ss.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new oi(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Pe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Cn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ue("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new Y(-1/0,-1/0,-1/0),new Y(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const r=t[i];ri.setFromBufferAttribute(r),this.morphTargetsRelative?(Ft.addVectors(this.boundingBox.min,ri.min),this.boundingBox.expandByPoint(Ft),Ft.addVectors(this.boundingBox.max,ri.max),this.boundingBox.expandByPoint(Ft)):(this.boundingBox.expandByPoint(ri.min),this.boundingBox.expandByPoint(ri.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ue('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ln);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ue("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new Y,1/0);return}if(e){const i=this.boundingSphere.center;if(ri.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Hs.setFromBufferAttribute(o),this.morphTargetsRelative?(Ft.addVectors(ri.min,Hs.min),ri.expandByPoint(Ft),Ft.addVectors(ri.max,Hs.max),ri.expandByPoint(Ft)):(ri.expandByPoint(Hs.min),ri.expandByPoint(Hs.max))}ri.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)Ft.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(Ft));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Ft.fromBufferAttribute(o,c),l&&(ss.fromBufferAttribute(e,c),Ft.add(ss)),s=Math.max(s,i.distanceToSquared(Ft))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ue('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ue("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,r=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==i.count)&&(a=new an(new Float32Array(4*i.count),4),this.setAttribute("tangent",a));const o=[],l=[],c=new Uint8Array(i.count);for(let E=0;E<i.count;E++)o[E]=new Y,l[E]=new Y;const h=new Y,f=new Y,d=new Y,u=new tt,p=new tt,_=new tt,m=new Y,g=new Y;function y(E,P,C){c[E]=c[P]=c[C]=1,h.fromBufferAttribute(i,E),f.fromBufferAttribute(i,P),d.fromBufferAttribute(i,C),u.fromBufferAttribute(r,E),p.fromBufferAttribute(r,P),_.fromBufferAttribute(r,C),f.sub(h),d.sub(h),p.sub(u),_.sub(u);const F=1/(p.x*_.y-_.x*p.y);isFinite(F)&&(m.copy(f).multiplyScalar(_.y).addScaledVector(d,-p.y).multiplyScalar(F),g.copy(d).multiplyScalar(p.x).addScaledVector(f,-_.x).multiplyScalar(F),o[E].add(m),o[P].add(m),o[C].add(m),l[E].add(g),l[P].add(g),l[C].add(g))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let E=0,P=b.length;E<P;++E){const C=b[E],F=C.start,I=C.count;for(let R=F,O=F+I;R<O;R+=3)y(e.getX(R+0),e.getX(R+1),e.getX(R+2))}const A=new Y,x=new Y,M=new Y,v=new Y;function S(E){M.fromBufferAttribute(s,E),v.copy(M);const P=o[E];A.copy(P),A.sub(M.multiplyScalar(M.dot(P))).normalize(),x.crossVectors(v,P);const F=x.dot(l[E])<0?-1:1;a.setXYZW(E,A.x,A.y,A.z,F)}for(let E=0,P=i.count;E<P;++E)c[E]&&S(E);this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new an(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,u=i.count;d<u;d++)i.setXYZ(d,0,0,0);const s=new Y,r=new Y,a=new Y,o=new Y,l=new Y,c=new Y,h=new Y,f=new Y;if(e)for(let d=0,u=e.count;d<u;d+=3){const p=e.getX(d+0),_=e.getX(d+1),m=e.getX(d+2);s.fromBufferAttribute(t,p),r.fromBufferAttribute(t,_),a.fromBufferAttribute(t,m),h.subVectors(a,r),f.subVectors(s,r),h.cross(f),o.fromBufferAttribute(i,p),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,m),o.add(h),l.add(h),c.add(h),i.setXYZ(p,o.x,o.y,o.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,u=t.count;d<u;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,r),f.subVectors(s,r),h.cross(f),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Ft.fromBufferAttribute(e,t),Ft.normalize(),e.setXYZ(t,Ft.x,Ft.y,Ft.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,f=o.normalized,d=new c.constructor(l.length*h);let u=0,p=0;for(let _=0,m=l.length;_<m;_++){o.isInterleavedBufferAttribute?u=l[_]*o.data.stride+o.offset:u=l[_]*h;for(let g=0;g<h;g++)d[p++]=c[u++]}return new an(d,h,f)}if(this.index===null)return Pe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Vi,i=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,i);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,f=c.length;h<f;h++){const d=c[h],u=e(d,i);l.push(u)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,d=c.length;f<d;f++){const u=c[f];h.push(u.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],f=r[c];for(let d=0,u=f.length;d<u;d++)h.push(f[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class BS{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=xd,this.updateRanges=[],this.version=0,this.uuid=Hi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[i+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});const t=Mh(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=this.array.slice(0).buffer);const i=new this.array.constructor(e.arrayBuffers[t]),s=new this.constructor(i,this.stride);return s.setUsage(this.usage),s}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});const t=Mh(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=Array.from(new Uint32Array(this.array.slice(0).buffer)));const i={uuid:this.uuid,buffer:t,type:this.array.constructor.name,stride:this.stride};return i.usage=this.usage,i}}function Mh(n){return n.buffer._uuid===void 0&&(n.buffer._uuid=Hi()),n.byteOffset===0&&n.byteLength===n.buffer.byteLength?n.buffer._uuid:n.buffer._uuid+":"+n.byteOffset+":"+n.byteLength}const jt=new Y;class Ad{constructor(e,t,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=s,this._normalizationScale=e!==void 0?Oa(e.array):void 0}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)jt.fromBufferAttribute(this,t),jt.applyMatrix4(e),this.setXYZ(t,jt.x,jt.y,jt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)jt.fromBufferAttribute(this,t),jt.applyNormalMatrix(e),this.setXYZ(t,jt.x,jt.y,jt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)jt.fromBufferAttribute(this,t),jt.transformDirection(e),this.setXYZ(t,jt.x,jt.y,jt.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=this._denormalize(i)),i}setComponent(e,t,i){return this.normalized&&(i=this._normalize(i)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=this._denormalize(t)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=this._denormalize(t)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=this._denormalize(t)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=this._denormalize(t)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),i=this._normalize(i)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),i=this._normalize(i),s=this._normalize(s)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),i=this._normalize(i),s=this._normalize(s),r=this._normalize(r)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){Ra("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new an(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Ad(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Ra("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}_denormalize(e){const t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):rc(e,this.data.array)}_normalize(e){const t=this._normalizationScale;return t!==void 0?Math.round(e*t):ac(e,this.data.array)}}const Po=new Y,Ug=new Y,Og=new ke;class yn{constructor(e=new Y(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=Po.subVectors(i,t).cross(Ug.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const s=e.delta(Po),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return i===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Og.getNormalMatrix(e),s=this.coplanarPoint(Po).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let kg=0;class Gn extends An{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:kg++}),this.uuid=Hi(),this.name="",this.type="Material",this.blending=tr,this.side=zn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ed,this.blendDst=Ma,this.blendEquation=Ji,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new $e(0,0,0),this.blendAlpha=0,this.depthFunc=rr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Wm,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=uo,this.stencilZFail=uo,this.stencilZPass=uo,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){Pe(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Pe(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(i.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(i.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(i.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(i.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new $e().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new yn().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new tt().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new tt().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Ki=new Y,Io=new Y,Fr=new Y,Ur=new Y;class ka{constructor(e=new Y,t=new Y(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ki)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Ki.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ki.copy(this.origin).addScaledVector(this.direction,t),Ki.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Io.copy(e).add(t).multiplyScalar(.5),Fr.copy(t).sub(e).normalize(),Ur.copy(this.origin).sub(Io);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Fr),o=Ur.dot(this.direction),l=-Ur.dot(Fr),c=Ur.lengthSq(),h=Math.abs(1-a*a);let f,d,u,p;if(h>0)if(f=a*l-o,d=a*o-l,p=r*h,f>=0)if(d>=-p)if(d<=p){const _=1/h;f*=_,d*=_,u=f*(f+a*d+2*o)+d*(a*f+d+2*l)+c}else d=r,f=Math.max(0,-(a*d+o)),u=-f*f+d*(d+2*l)+c;else d=-r,f=Math.max(0,-(a*d+o)),u=-f*f+d*(d+2*l)+c;else d<=-p?(f=Math.max(0,-(-a*r+o)),d=f>0?-r:Math.min(Math.max(-r,-l),r),u=-f*f+d*(d+2*l)+c):d<=p?(f=0,d=Math.min(Math.max(-r,-l),r),u=d*(d+2*l)+c):(f=Math.max(0,-(a*r+o)),d=f>0?r:Math.min(Math.max(-r,-l),r),u=-f*f+d*(d+2*l)+c);else d=a>0?-r:r,f=Math.max(0,-(a*d+o)),u=-f*f+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Io).addScaledVector(Fr,d),u}intersectSphere(e,t){if(e.radius<0)return null;Ki.subVectors(e.center,this.origin);const i=Ki.dot(this.direction),s=Ki.dot(Ki)-i*i,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(e.min.z-d.z)*f,l=(e.max.z-d.z)*f):(o=(e.max.z-d.z)*f,l=(e.min.z-d.z)*f),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Ki)!==null}intersectTriangle(e,t,i,s,r){const a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,f=e.x-a.x,d=e.y-a.y,u=e.z-a.z,p=t.x-a.x,_=t.y-a.y,m=t.z-a.z,g=i.x-a.x,y=i.y-a.y,b=i.z-a.z,A=Math.abs(l),x=Math.abs(c),M=Math.abs(h);let v,S,E,P,C,F,I,R,O,k,H,L;if(A>=x&&A>=M?(E=l,F=f,O=p,L=g,l>=0?(v=c,S=h,P=d,C=u,I=_,R=m,k=y,H=b):(v=h,S=c,P=u,C=d,I=m,R=_,k=b,H=y)):x>=M?(E=c,F=d,O=_,L=y,c>=0?(v=h,S=l,P=u,C=f,I=m,R=p,k=b,H=g):(v=l,S=h,P=f,C=u,I=p,R=m,k=g,H=b)):(E=h,F=u,O=m,L=b,h>=0?(v=l,S=c,P=f,C=d,I=p,R=_,k=g,H=y):(v=c,S=l,P=d,C=f,I=_,R=p,k=y,H=g)),E===0)return null;const N=v/E,W=S/E,B=1/E,j=P-N*F,re=C-W*F,V=I-N*O,K=R-W*O,ie=k-N*L,ae=H-W*L,se=ie*K-ae*V,be=j*ae-re*ie,rt=V*re-K*j;if(s){if(se<0||be<0||rt<0)return null}else if((se<0||be<0||rt<0)&&(se>0||be>0||rt>0))return null;const Ee=se+be+rt;if(Ee===0)return null;const He=B*(se*F+be*O+rt*L);return(Ee>0?He<0:He>0)?null:this.at(He/Ee,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Bg extends Gn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new $e(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Tn,this.combine=td,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const bh=new je,Fn=new ka,Or=new ln,wh=new Y,kr=new Y,Br=new Y,zr=new Y,Lo=new Y,Hr=new Y,Eh=new Y,Vr=new Y;class _i extends wt{constructor(e=new Vi,t=new Bg){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Hr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],f=r[l];h!==0&&(Lo.fromBufferAttribute(f,e),a?Hr.addScaledVector(Lo,h):Hr.addScaledVector(Lo.sub(t),h))}t.add(Hr)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Or.copy(i.boundingSphere),Or.applyMatrix4(r),Fn.copy(e.ray).recast(e.near),!(Or.containsPoint(Fn.origin)===!1&&(Fn.intersectSphere(Or,wh)===null||Fn.origin.distanceToSquared(wh)>(e.far-e.near)**2))&&(bh.copy(r).invert(),Fn.copy(e.ray).applyMatrix4(bh),!(i.boundingBox!==null&&Fn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Fn)))}_computeIntersections(e,t,i){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,f=r.attributes.normal,d=r.groups,u=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,_=d.length;p<_;p++){const m=d[p],g=a[m.materialIndex],y=Math.max(m.start,u.start),b=Math.min(o.count,Math.min(m.start+m.count,u.start+u.count));for(let A=y,x=b;A<x;A+=3){const M=o.getX(A),v=o.getX(A+1),S=o.getX(A+2);s=Gr(this,g,e,i,c,h,f,M,v,S),s&&(s.faceIndex=Math.floor(A/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const p=Math.max(0,u.start),_=Math.min(o.count,u.start+u.count);for(let m=p,g=_;m<g;m+=3){const y=o.getX(m),b=o.getX(m+1),A=o.getX(m+2);s=Gr(this,a,e,i,c,h,f,y,b,A),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let p=0,_=d.length;p<_;p++){const m=d[p],g=a[m.materialIndex],y=Math.max(m.start,u.start),b=Math.min(l.count,Math.min(m.start+m.count,u.start+u.count));for(let A=y,x=b;A<x;A+=3){const M=A,v=A+1,S=A+2;s=Gr(this,g,e,i,c,h,f,M,v,S),s&&(s.faceIndex=Math.floor(A/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const p=Math.max(0,u.start),_=Math.min(l.count,u.start+u.count);for(let m=p,g=_;m<g;m+=3){const y=m,b=m+1,A=m+2;s=Gr(this,a,e,i,c,h,f,y,b,A),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function zg(n,e,t,i,s,r,a,o){let l;if(e.side===ii?l=i.intersectTriangle(a,r,s,!0,o):l=i.intersectTriangle(s,r,a,e.side===zn,o),l===null)return null;Vr.copy(o),Vr.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Vr);return c<t.near||c>t.far?null:{distance:c,point:Vr.clone(),object:n}}function Gr(n,e,t,i,s,r,a,o,l,c){n.getVertexPosition(o,kr),n.getVertexPosition(l,Br),n.getVertexPosition(c,zr);const h=zg(n,e,t,i,kr,Br,zr,Eh);if(h){const f=new Y;Pi.getBarycoord(Eh,kr,Br,zr,f),s&&(h.uv=Pi.getInterpolatedAttribute(s,o,l,c,f,new tt)),r&&(h.uv1=Pi.getInterpolatedAttribute(r,o,l,c,f,new tt)),a&&(h.normal=Pi.getInterpolatedAttribute(a,o,l,c,f,new Y),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new Y,materialIndex:0};Pi.getNormal(kr,Br,zr,d.normal),h.face=d,h.barycoord=f}return h}const Vs=new ut,Th=new ut,Ah=new ut,Hg=new ut,Ch=new je,Wr=new Y,No=new ln,Rh=new je,Do=new ka;class zS extends _i{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=oh,this.bindMatrix=new je,this.bindMatrixInverse=new je,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Cn),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,Wr),this.boundingBox.expandByPoint(Wr)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new ln),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,Wr),this.boundingSphere.expandByPoint(Wr)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this}raycast(e,t){const i=this.material,s=this.matrixWorld;i!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),No.copy(this.boundingSphere),No.applyMatrix4(s),e.ray.intersectsSphere(No)!==!1&&(Rh.copy(s).invert(),Do.copy(e.ray).applyMatrix4(Rh),!(this.boundingBox!==null&&Do.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Do)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new ut,t=this.geometry.attributes.skinWeight;for(let i=0,s=t.count;i<s;i++){e.fromBufferAttribute(t,i);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(i,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===oh?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Um?this.bindMatrixInverse.copy(this.bindMatrix).invert():Pe("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const i=this.skeleton,s=this.geometry;Th.fromBufferAttribute(s.attributes.skinIndex,e),Ah.fromBufferAttribute(s.attributes.skinWeight,e),t.isVector4?(Vs.copy(t),t.set(0,0,0,0)):(Vs.set(t.x,t.y,t.z,1),t.set(0,0,0)),Vs.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){const a=Ah.getComponent(r);if(a!==0){const o=Th.getComponent(r);Ch.multiplyMatrices(i.bones[o].matrixWorld,i.boneInverses[o]),t.addScaledVector(Hg.copy(Vs).applyMatrix4(Ch),a)}}return t.isVector4&&(t.w=Vs.w),t.applyMatrix4(this.bindMatrixInverse)}}class Vg extends wt{constructor(){super(),this.isBone=!0,this.type="Bone"}}class bs extends Vt{constructor(e=null,t=1,i=1,s,r,a,o,l,c=Pt,h=Pt,f,d){super(null,a,o,l,c,h,s,r,f,d),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Ph=new je,Gg=new je;class Cd{constructor(e=[],t=[]){this.uuid=Hi(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.previousBoneMatrices=null,this.boneTexture=null,this.previousBoneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Pe("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let i=0,s=this.bones.length;i<s;i++)this.boneInverses.push(new je)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const i=new je;this.bones[e]&&i.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(i)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const i=this.bones[e];i&&i.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const i=this.bones[e];i&&(i.parent&&i.parent.isBone?(i.matrix.copy(i.parent.matrixWorld).invert(),i.matrix.multiply(i.matrixWorld)):i.matrix.copy(i.matrixWorld),i.matrix.decompose(i.position,i.quaternion,i.scale))}}update(){const e=this.bones,t=this.boneInverses,i=this.boneMatrices,s=this.boneTexture;for(let r=0,a=e.length;r<a;r++){const o=e[r]?e[r].matrixWorld:Gg;Ph.multiplyMatrices(o,t[r]),Ph.toArray(i,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new Cd(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const i=new bs(t,e,e,vi,gi);return i.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=i,this}getBoneByName(e){for(let t=0,i=this.bones.length;t<i;t++){const s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null),this.previousBoneTexture!==null&&(this.previousBoneTexture.dispose(),this.previousBoneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let i=0,s=e.bones.length;i<s;i++){const r=e.bones[i];let a=t[r];a===void 0&&(Pe("Skeleton: No bone found with UUID:",r),a=new Vg),this.bones.push(a),this.boneInverses.push(new je().fromArray(e.boneInverses[i]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,i=this.boneInverses;for(let s=0,r=t.length;s<r;s++){const a=t[s];e.bones.push(a.uuid);const o=i[s];e.boneInverses.push(o.toArray())}return e}}class Ih extends an{constructor(e,t,i,s=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const rs=new je,Lh=new je,Xr=[],Nh=new Cn,Wg=new je,Gs=new _i,Ws=new ln;class HS extends _i{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Ih(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,Wg)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Cn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,rs),Nh.copy(e.boundingBox).applyMatrix4(rs),this.boundingBox.union(Nh)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new ln),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,rs),Ws.copy(e.boundingSphere).applyMatrix4(rs),this.boundingSphere.union(Ws)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),this.morphTexture=e.morphTexture!==null?e.morphTexture.clone():null,this.instanceColor=e.instanceColor!==null?e.instanceColor.clone():null,this.count=e.count,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=i.length+1,a=e*r+1;for(let o=0;o<i.length;o++)i[o]=s[a+o]}raycast(e,t){const i=this.matrixWorld,s=this.count;if(Gs.geometry=this.geometry,Gs.material=this.material,Gs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ws.copy(this.boundingSphere),Ws.applyMatrix4(i),e.ray.intersectsSphere(Ws)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,rs),Lh.multiplyMatrices(i,rs),Gs.matrixWorld=Lh,Gs.raycast(e,Xr);for(let a=0,o=Xr.length;a<o;a++){const l=Xr[a];l.instanceId=r,l.object=this,t.push(l)}Xr.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Ih(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const i=t.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new bs(new Float32Array(s*this.count),s,this.count,Ua,gi));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<i.length;c++)a+=i[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=s*e;return r[l]=o,r.set(i,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Un=new ln,Xg=new tt(.5,.5),$r=new Y;class ur{constructor(e=new yn,t=new yn,i=new yn,s=new yn,r=new yn,a=new yn){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Ii,i=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],f=r[5],d=r[6],u=r[7],p=r[8],_=r[9],m=r[10],g=r[11],y=r[12],b=r[13],A=r[14],x=r[15];if(s[0].setComponents(c-a,u-h,g-p,x-y).normalize(),s[1].setComponents(c+a,u+h,g+p,x+y).normalize(),s[2].setComponents(c+o,u+f,g+_,x+b).normalize(),s[3].setComponents(c-o,u-f,g-_,x-b).normalize(),i)s[4].setComponents(l,d,m,A).normalize(),s[5].setComponents(c-l,u-d,g-m,x-A).normalize();else if(s[4].setComponents(c-l,u-d,g-m,x-A).normalize(),t===Ii)s[5].setComponents(c+l,u+d,g+m,x+A).normalize();else if(t===cr)s[5].setComponents(l,d,m,A).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Un.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Un.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Un)}intersectsSprite(e){Un.center.set(0,0,0);const t=Xg.distanceTo(e.center);return Un.radius=.7071067811865476+t,Un.applyMatrix4(e.matrixWorld),this.intersectsSphere(Un)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if($r.x=s.normal.x>0?e.max.x:e.min.x,$r.y=s.normal.y>0?e.max.y:e.min.y,$r.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint($r)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}const Dh=new je;class lc{constructor(){this.coordinateSystem=Ii,this._frustums=[],this._count=0}setFromArrayCamera(e){const t=e.cameras,i=this._frustums;for(let s=0;s<t.length;s++){const r=t[s];Dh.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),i[s]===void 0&&(i[s]=new ur),i[s].setFromProjectionMatrix(Dh,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsObject(e))return!0;return!1}intersectsSprite(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsSprite(e))return!0;return!1}intersectsSphere(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsSphere(e))return!0;return!1}intersectsBox(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsBox(e))return!0;return!1}containsPoint(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;const t=this._frustums,i=e._frustums;for(let s=0;s<e._count;s++)t[s]===void 0&&(t[s]=new ur),t[s].copy(i[s]);return this._count=e._count,this}clone(){return new lc().copy(this)}}class $g extends Gn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new $e(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Pa=new Y,Ia=new Y,Fh=new je,Xs=new ka,qr=new ln,Fo=new Y,Uh=new Y;class Rd extends wt{constructor(e=new Vi,t=new $g){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let s=1,r=t.count;s<r;s++)Pa.fromBufferAttribute(t,s-1),Ia.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=Pa.distanceTo(Ia);e.setAttribute("lineDistance",new oi(i,1))}else Pe("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),qr.copy(i.boundingSphere),qr.applyMatrix4(s),qr.radius+=r,e.ray.intersectsSphere(qr)===!1)return;Fh.copy(s).invert(),Xs.copy(e.ray).applyMatrix4(Fh);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){const u=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let _=u,m=p-1;_<m;_+=c){const g=h.getX(_),y=h.getX(_+1),b=Yr(this,e,Xs,l,g,y,_);b&&t.push(b)}if(this.isLineLoop){const _=h.getX(p-1),m=h.getX(u),g=Yr(this,e,Xs,l,_,m,p-1);g&&t.push(g)}}else{const u=Math.max(0,a.start),p=Math.min(d.count,a.start+a.count);for(let _=u,m=p-1;_<m;_+=c){const g=Yr(this,e,Xs,l,_,_+1,_);g&&t.push(g)}if(this.isLineLoop){const _=Yr(this,e,Xs,l,p-1,u,p-1);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Yr(n,e,t,i,s,r,a){const o=n.geometry.attributes.position;if(Pa.fromBufferAttribute(o,s),Ia.fromBufferAttribute(o,r),t.distanceSqToSegment(Pa,Ia,Fo,Uh)>i)return;Fo.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(Fo);if(!(c<e.near||c>e.far))return{distance:c,point:Uh.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const Oh=new Y,kh=new Y;class VS extends Rd{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let s=0,r=t.count;s<r;s+=2)Oh.fromBufferAttribute(t,s),kh.fromBufferAttribute(t,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+Oh.distanceTo(kh);e.setAttribute("lineDistance",new oi(i,1))}else Pe("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class GS extends Rd{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class qg extends Gn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new $e(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Bh=new je,Bl=new ka,Kr=new ln,jr=new Y;class WS extends wt{constructor(e=new Vi,t=new qg){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Kr.copy(i.boundingSphere),Kr.applyMatrix4(s),Kr.radius+=r,e.ray.intersectsSphere(Kr)===!1)return;Bh.copy(s).invert(),Bl.copy(e.ray).applyMatrix4(Bh);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,f=i.attributes.position;if(c!==null){const d=Math.max(0,a.start),u=Math.min(c.count,a.start+a.count);for(let p=d,_=u;p<_;p++){const m=c.getX(p);jr.fromBufferAttribute(f,m),zh(jr,m,l,s,e,t,this)}}else{const d=Math.max(0,a.start),u=Math.min(f.count,a.start+a.count);for(let p=d,_=u;p<_;p++)jr.fromBufferAttribute(f,p),zh(jr,p,l,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function zh(n,e,t,i,s,r,a){const o=Bl.distanceSqToPoint(n);if(o<t){const l=new Y;Bl.closestPointToPoint(n,l),l.applyMatrix4(i);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class Pd extends Vt{constructor(e=[],t=ys,i,s,r,a,o,l,c,h){super(e,t,i,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class ws extends Vt{constructor(e,t,i=Bi,s,r,a,o=Pt,l=Pt,c,h=En,f=1){if(h!==En&&h!==wn)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:f};super(d,s,r,a,o,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new oc(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class Id extends ws{constructor(e,t=Bi,i=ys,s,r,a=Pt,o=Pt,l,c=En){const h={width:e,height:e,depth:1},f=[h,h,h,h,h,h];super(e,e,t,i,s,r,a,o,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Ld extends Vt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class pr extends Vi{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],f=[];let d=0,u=0;p("z","y","x",-1,-1,i,t,e,a,r,0),p("z","y","x",1,-1,i,t,-e,a,r,1),p("x","z","y",1,1,e,i,t,s,a,2),p("x","z","y",1,-1,e,i,-t,s,a,3),p("x","y","z",1,-1,e,t,i,s,r,4),p("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new oi(c,3)),this.setAttribute("normal",new oi(h,3)),this.setAttribute("uv",new oi(f,2));function p(_,m,g,y,b,A,x,M,v,S,E){const P=A/v,C=x/S,F=A/2,I=x/2,R=M/2,O=v+1,k=S+1;let H=0,L=0;const N=new Y;for(let W=0;W<k;W++){const B=W*C-I;for(let j=0;j<O;j++){const re=j*P-F;N[_]=re*y,N[m]=B*b,N[g]=R,c.push(N.x,N.y,N.z),N[_]=0,N[m]=0,N[g]=M>0?1:-1,h.push(N.x,N.y,N.z),f.push(j/v),f.push(1-W/S),H+=1}}for(let W=0;W<S;W++)for(let B=0;B<v;B++){const j=d+B+O*W,re=d+B+O*(W+1),V=d+(B+1)+O*(W+1),K=d+(B+1)+O*W;l.push(j,re,K),l.push(re,V,K),L+=6}o.addGroup(u,L,E),u+=L,d+=H}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new pr(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Ba extends Vi{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(i),l=Math.floor(s),c=o+1,h=l+1,f=e/o,d=t/l,u=[],p=[],_=[],m=[];for(let g=0;g<h;g++){const y=g*d-a;for(let b=0;b<c;b++){const A=b*f-r;p.push(A,-y,0),_.push(0,0,1),m.push(b/o),m.push(1-g/l)}}for(let g=0;g<l;g++)for(let y=0;y<o;y++){const b=y+c*g,A=y+c*(g+1),x=y+1+c*(g+1),M=y+1+c*g;u.push(b,A,M),u.push(A,x,M)}this.setIndex(u),this.setAttribute("position",new oi(p,3)),this.setAttribute("normal",new oi(_,3)),this.setAttribute("uv",new oi(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ba(e.width,e.height,e.widthSegments,e.heightSegments)}}function Es(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];if(Hh(s))s.isRenderTargetTexture?(Pe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone();else if(Array.isArray(s))if(Hh(s[0])){const r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][i]=r}else e[t][i]=s.slice();else e[t][i]=s}}return e}function Jt(n){const e={};for(let t=0;t<n.length;t++){const i=Es(n[t]);for(const s in i)e[s]=i[s]}return e}function Hh(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function Yg(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Nd(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:et.workingColorSpace}const Kg={clone:Es,merge:Jt};var jg=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Zg=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Vn extends Gn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=jg,this.fragmentShader=Zg,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Es(e.uniforms),this.uniformsGroups=Yg(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const i in e.uniforms){const s=e.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=t[s.value]||null;break;case"c":this.uniforms[i].value=new $e().setHex(s.value);break;case"v2":this.uniforms[i].value=new tt().fromArray(s.value);break;case"v3":this.uniforms[i].value=new Y().fromArray(s.value);break;case"v4":this.uniforms[i].value=new ut().fromArray(s.value);break;case"m3":this.uniforms[i].value=new ke().fromArray(s.value);break;case"m4":this.uniforms[i].value=new je().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class zl extends Vn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Jg extends Gn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new $e(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new $e(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=kl,this.normalScale=new tt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Tn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class XS extends Jg{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new tt(1,1),this.clearcoatNormalMap=null,this.diffuseRoughnessMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Ye(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessMinimum=100,this.iridescenceThicknessMaximum=400,this.iridescenceThicknessMap=null,this.sheenColor=new $e(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new $e(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new $e(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._diffuseRoughness=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get diffuseRoughness(){return this._diffuseRoughness}set diffuseRoughness(e){this._diffuseRoughness>0!=e>0&&this.version++,this._diffuseRoughness=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}get iridescenceThicknessRange(){return _s('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),[this.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum]}set iridescenceThicknessRange(e){_s('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),this.iridescenceThicknessMinimum=e[0],this.iridescenceThicknessMaximum=e[1]}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.diffuseRoughness=e.diffuseRoughness,this.diffuseRoughnessMap=e.diffuseRoughnessMap,this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum,this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class Qg extends Gn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Vm,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class e0 extends Gn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function Sn(n,e){return!n||n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}function Ks(n){return n!==void 0&&n.inTangents!==void 0&&n.outTangents!==void 0}function t0(n){function e(s,r){return n[s]-n[r]}const t=n.length,i=new Array(t);for(let s=0;s!==t;++s)i[s]=s;return i.sort(e),i}function Vh(n,e,t){const i=n.length,s=new n.constructor(i);for(let r=0,a=0;a!==i;++r){const o=t[r]*e;for(let l=0;l!==e;++l)s[a++]=n[o+l]}return s}function i0(n,e,t,i){let s=1,r=n[0];for(;r!==void 0&&r[i]===void 0;)r=n[s++];if(r===void 0)return;let a=r[i];if(a!==void 0)if(Array.isArray(a))do a=r[i],a!==void 0&&(e.push(r.time),t.push(...a)),r=n[s++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[i],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=n[s++];while(r!==void 0);else do a=r[i],a!==void 0&&(e.push(r.time),t.push(a)),r=n[s++];while(r!==void 0)}class mr{constructor(e,t,i,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let i=this._cachedIndex,s=t[i],r=t[i-1];e:{t:{let a;i:{n:if(!(e<s)){for(let o=i+2;;){if(s===void 0){if(e<r)break n;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(r=s,s=t[++i],e<s)break t}a=t.length;break i}if(!(e>=r)){const o=t[1];e<o&&(i=2,r=o);for(let l=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(s=r,r=t[--i-1],e>=r)break t}a=i,i=0;break i}break e}for(;i<a;){const o=i+a>>>1;e<t[o]?a=o:i=o+1}if(s=t[i],r=t[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=i[r+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}}class n0 extends mr{constructor(e,t,i,s){super(e,t,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ms,endingEnd:ms}}intervalChanged_(e,t,i){const s=this.parameterPositions;let r=e-2,a=e+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case gs:r=e,o=2*t-i;break;case Ta:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=i}if(l===void 0)switch(this.getSettings_().endingEnd){case gs:a=e,l=2*i-t;break;case Ta:a=1,l=i+s[1]-s[0];break;default:a=e-1,l=t}const c=(i-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-i),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,i,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,f=this._offsetNext,d=this._weightPrev,u=this._weightNext,p=(i-t)/(s-t),_=p*p,m=_*p,g=-d*m+2*d*_-d*p,y=(1+d)*m+(-1.5-2*d)*_+(-.5+d)*p+1,b=(-1-u)*m+(1.5+u)*_+.5*p,A=u*m-u*_;for(let x=0;x!==o;++x)r[x]=g*a[h+x]+y*a[c+x]+b*a[l+x]+A*a[f+x];return r}}class Dd extends mr{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(i-t)/(s-t),f=1-h;for(let d=0;d!==o;++d)r[d]=a[c+d]*f+a[l+d]*h;return r}}class s0 extends mr{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e){return this.copySampleValue_(e-1)}}class r0 extends mr{interpolate_(e,t,i,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this.inTangents,f=this.outTangents;if(!h||!f){const p=(i-t)/(s-t),_=1-p;for(let m=0;m!==o;++m)r[m]=a[c+m]*_+a[l+m]*p;return r}const d=o*2,u=e-1;for(let p=0;p!==o;++p){const _=a[c+p],m=a[l+p],g=u*d+p*2,y=f[g],b=f[g+1],A=e*d+p*2,x=h[A],M=h[A+1],v=o0(i,t,y,x,s);r[p]=Fd(v,_,b,M,m)}return r}}function Fd(n,e,t,i,s){const r=1-n;return r*r*r*e+3*r*r*n*t+3*r*n*n*i+n*n*n*s}function a0(n,e,t,i,s){const r=1-n;return 3*r*r*(t-e)+6*r*n*(i-t)+3*n*n*(s-i)}function o0(n,e,t,i,s){let r=(n-e)/(s-e);for(let a=0;a<8;a++){const o=Fd(r,e,t,i,s)-n;if(Math.abs(o)<1e-10)break;const l=a0(r,e,t,i,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-o/l))}return r}class Ni{constructor(e,t,i,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Sn(t,this.TimeBufferType),this.values=Sn(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:Sn(e.times,Array),values:Sn(e.values,Array)};const s=e.getInterpolation();s!==e.DefaultInterpolation&&(i.interpolation=s),Ks(e.settings)&&(i.settings={inTangents:Sn(e.settings.inTangents,Array),outTangents:Sn(e.settings.outTangents,Array)})}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new s0(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Dd(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new n0(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){const t=new r0(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Ea:t=this.InterpolantFactoryMethodDiscrete;break;case Ol:t=this.InterpolantFactoryMethodLinear;break;case ho:t=this.InterpolantFactoryMethodSmooth;break;case lh:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){const i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return Pe("KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ea;case this.InterpolantFactoryMethodLinear:return Ol;case this.InterpolantFactoryMethodSmooth:return ho;case this.InterpolantFactoryMethodBezier:return lh}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]+=e;Ks(this.settings)&&(Gh(this.settings.inTangents,e),Gh(this.settings.outTangents,e))}return this}scale(e){if(e!==1){const t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]*=e;Ks(this.settings)&&(Wh(this.settings.inTangents,e),Wh(this.settings.outTangents,e))}return this}trim(e,t){const i=this.times,s=i.length;let r=0,a=s-1;for(;r!==s&&i[r]<e;)++r;for(;a!==-1&&i[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);const o=this.getValueSize();this.times=i.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(Ue("KeyframeTrack: Invalid value size in track.",this),e=!1);const i=this.times,s=this.values,r=i.length;r===0&&(Ue("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){const l=i[o];if(typeof l=="number"&&isNaN(l)){Ue("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){Ue("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(s!==void 0&&Zm(s))for(let o=0,l=s.length;o!==l;++o){const c=s[o];if(isNaN(c)){Ue("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===ho,r=e.length-1;let a=1;for(let o=1;o<r;++o){let l=!1;const c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(s)l=!0;else{const f=o*i,d=f-i,u=f+i;for(let p=0;p!==i;++p){const _=t[f+p];if(_!==t[d+p]||_!==t[u+p]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];const f=o*i,d=a*i;for(let u=0;u!==i;++u)t[d+u]=t[f+u]}++a}}if(r>0){e[a]=e[r];for(let o=r*i,l=a*i,c=0;c!==i;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*i)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),i=this.constructor,s=new i(this.name,e,t);return s.createInterpolant=this.createInterpolant,Ks(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}}function Gh(n,e){for(let t=0,i=n.length;t!==i;t+=2)n[t]+=e}function Wh(n,e){for(let t=0,i=n.length;t!==i;t+=2)n[t]*=e}Ni.prototype.ValueTypeName="";Ni.prototype.TimeBufferType=Float32Array;Ni.prototype.ValueBufferType=Float32Array;Ni.prototype.DefaultInterpolation=Ol;class Ts extends Ni{constructor(e,t,i){super(e,t,i)}}Ts.prototype.ValueTypeName="bool";Ts.prototype.ValueBufferType=Array;Ts.prototype.DefaultInterpolation=Ea;Ts.prototype.InterpolantFactoryMethodLinear=void 0;Ts.prototype.InterpolantFactoryMethodSmooth=void 0;class Ud extends Ni{constructor(e,t,i,s){super(e,t,i,s)}}Ud.prototype.ValueTypeName="color";class cc extends Ni{constructor(e,t,i,s){super(e,t,i,s)}}cc.prototype.ValueTypeName="number";class l0 extends mr{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(i-t)/(s-t);let c=e*o;for(let h=c+o;c!==h;c+=4)Oi.slerpFlat(r,0,a,c-o,a,c,l);return r}}class hc extends Ni{constructor(e,t,i,s){super(e,t,i,s)}InterpolantFactoryMethodLinear(e){return new l0(this.times,this.values,this.getValueSize(),e)}}hc.prototype.ValueTypeName="quaternion";hc.prototype.InterpolantFactoryMethodSmooth=void 0;class As extends Ni{constructor(e,t,i){super(e,t,i)}}As.prototype.ValueTypeName="string";As.prototype.ValueBufferType=Array;As.prototype.DefaultInterpolation=Ea;As.prototype.InterpolantFactoryMethodLinear=void 0;As.prototype.InterpolantFactoryMethodSmooth=void 0;class Od extends Ni{constructor(e,t,i,s){super(e,t,i,s)}}Od.prototype.ValueTypeName="vector";class Xh{constructor(e="",t=-1,i=[],s=nc){this.name=e,this.tracks=i,this.duration=t,this.blendMode=s,this.uuid=Hi(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){const t=[],i=e.tracks,s=1/(e.fps||1);for(let a=0,o=i.length;a!==o;++a)t.push(h0(i[a]).scale(s));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){const t=[],i=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,a=i.length;r!==a;++r)t.push(Ni.toJSON(i[r]));return s}static CreateFromMorphTargetSequence(e,t,i,s){const r=t.length,a=[];for(let o=0;o<r;o++){let l=[],c=[];l.push((o+r-1)%r,o,(o+1)%r),c.push(0,1,0);const h=t0(l);l=Vh(l,1,h),c=Vh(c,1,h),!s&&l[0]===0&&(l.push(r),c.push(c[0])),a.push(new cc(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/i))}return new this(e,-1,a)}static findByName(e,t){let i=e;if(!Array.isArray(e)){const s=e;i=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<i.length;s++)if(i[s].name===t)return i[s];return null}static CreateClipsFromMorphTargetSequences(e,t,i){const s={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){const c=e[o],h=c.name.match(r);if(h&&h.length>1){const f=h[1];let d=s[f];d||(s[f]=d=[]),d.push(c)}}const a=[];for(const o in s)a.push(this.CreateFromMorphTargetSequence(o,s[o],t,i));return a}resetDuration(){const e=this.tracks;let t=0;for(let i=0,s=e.length;i!==s;++i){const r=this.tracks[i];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let i=0;i<this.tracks.length;i++)e.push(this.tracks[i].clone());const t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function c0(n){switch(n.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return cc;case"vector":case"vector2":case"vector3":case"vector4":return Od;case"color":return Ud;case"quaternion":return hc;case"bool":case"boolean":return Ts;case"string":return As}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+n)}function h0(n){if(n.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=c0(n.type);if(n.times===void 0){const i=[],s=[];i0(n.keys,i,s,"value"),n.times=i,n.values=s}let t;return e.parse!==void 0?t=e.parse(n):t=new e(n.name,n.times,n.values,n.interpolation),Ks(n.settings)&&(t.settings={inTangents:Sn(n.settings.inTangents,Float32Array),outTangents:Sn(n.settings.outTangents,Float32Array)}),t}const nn={enabled:!1,files:{},add:function(n,e){this.enabled!==!1&&($h(n)||(this.files[n]=e))},get:function(n){if(this.enabled!==!1&&!$h(n))return this.files[n]},remove:function(n){delete this.files[n]},clear:function(){this.files={}}};function $h(n){try{const e=n.slice(n.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class u0{constructor(e,t,i){const s=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this._abortController=null,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,f){return c.push(h,f),this},this.removeHandler=function(h){const f=c.indexOf(h);return f!==-1&&c.splice(f,2),this},this.getHandler=function(h){for(let f=0,d=c.length;f<d;f+=2){const u=c[f],p=c[f+1];if(u.global&&(u.lastIndex=0),u.test(h))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const d0=new u0;class Cs{constructor(e){this.manager=e!==void 0?e:d0,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},this.priority="auto",this.cache="default",typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const i=this;return new Promise(function(s,r){i.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}setPriority(e){return this.priority=e,this}setCache(e){return this.cache=e,this}abort(){return this}}Cs.DEFAULT_MATERIAL_NAME="__DEFAULT";const ji={};class f0 extends Error{constructor(e,t){super(e),this.response=t}}class p0 extends Cs{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,i,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=nn.get(`file:${e}`);if(r!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0);return}if(ji[e]!==void 0){ji[e].push({onLoad:t,onProgress:i,onError:s});return}ji[e]=[],ji[e].push({onLoad:t,onProgress:i,onError:s});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",priority:this.priority,cache:this.cache,signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&Pe("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const h=ji[e],f=c.body.getReader(),d=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),u=d?parseInt(d):0,p=u!==0;let _=0;const m=new ReadableStream({start(g){y();function y(){f.read().then(({done:b,value:A})=>{if(b)g.close();else{_+=A.byteLength;const x=new ProgressEvent("progress",{lengthComputable:p,loaded:_,total:u});for(let M=0,v=h.length;M<v;M++){const S=h[M];S.onProgress&&S.onProgress(x)}g.enqueue(A),y()}},b=>{g.error(b)})}}});return new Response(m)}else throw new f0(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return c.json();default:if(o==="")return c.text();{const f=/charset="?([^;"\s]*)"?/i.exec(o),d=f&&f[1]?f[1].toLowerCase():void 0,u=new TextDecoder(d);return c.arrayBuffer().then(p=>u.decode(p))}}}).then(c=>{nn.add(`file:${e}`,c);const h=ji[e];delete ji[e];for(let f=0,d=h.length;f<d;f++){const u=h[f];u.onLoad&&u.onLoad(c)}}).catch(c=>{const h=ji[e];if(h===void 0)throw this.manager.itemError(e),c;delete ji[e];for(let f=0,d=h.length;f<d;f++){const u=h[f];u.onError&&u.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const as=new WeakMap;class m0 extends Cs{constructor(e){super(e)}load(e,t,i,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=nn.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);else{let f=as.get(a);f===void 0&&(f=[],as.set(a,f)),f.push({onLoad:t,onError:s})}return a}const o=hr("img");function l(){h(),t&&t(this);const f=as.get(this)||[];for(let d=0;d<f.length;d++){const u=f[d];u.onLoad&&u.onLoad(this)}as.delete(this),r.manager.itemEnd(e)}function c(f){h(),s&&s(f),nn.remove(`image:${e}`);const d=as.get(this)||[];for(let u=0;u<d.length;u++){const p=d[u];p.onError&&p.onError(f)}as.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),nn.add(`image:${e}`,o),r.manager.itemStart(e),o.fetchPriority=this.priority,o.src=e,o}}class $S extends Cs{constructor(e){super(e)}load(e,t,i,s){const r=this,a=new bs,o=new p0(this.manager);return o.setPriority(this.priority),o.setCache(this.cache),o.setResponseType("arraybuffer"),o.setRequestHeader(this.requestHeader),o.setPath(this.path),o.setWithCredentials(r.withCredentials),o.load(e,function(l){let c;try{c=r.parse(l)}catch(h){s!==void 0?s(h):Ue(h);return}r._applyTexData(a,c),t&&t(a,c)},i,s),a}createDataTexture(e){const t=new bs;return this._applyTexData(t,this.parse(e)),t}_applyTexData(e,t){t.image!==void 0?e.image=t.image:t.data!==void 0&&(e.image.width=t.width,e.image.height=t.height,e.image.data=t.data),e.wrapS=t.wrapS!==void 0?t.wrapS:ai,e.wrapT=t.wrapT!==void 0?t.wrapT:ai,e.magFilter=t.magFilter!==void 0?t.magFilter:kt,e.minFilter=t.minFilter!==void 0?t.minFilter:kt,e.anisotropy=t.anisotropy!==void 0?t.anisotropy:1,t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.mipmaps!==void 0&&(e.mipmaps=t.mipmaps,e.minFilter=tn),t.mipmapCount===1&&(e.minFilter=kt),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),e.needsUpdate=!0}}class qS extends Cs{constructor(e){super(e)}load(e,t,i,s){const r=new Vt,a=new m0(this.manager);return a.setPriority(this.priority),a.setCache(this.cache),a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},i,s),r}}class za extends wt{static registerNode(e){this.prototype._lightNode=e}constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new $e(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class YS extends za{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(wt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new $e(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const Uo=new je,qh=new Y,Yh=new Y;class uc{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new tt(512,512),this.mapType=ti,this.map=null,this.mapPass=null,this.matrix=new je,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ur,this._frameExtents=new tt(1,1),this._viewportCount=1,this._viewports=[new ut(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera;qh.setFromMatrixPosition(e.matrixWorld),t.position.copy(qh),Yh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Yh),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,i,s){Uo.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),i.setFromProjectionMatrix(Uo,e.coordinateSystem,e.reversedDepth);const r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;e.coordinateSystem===cr||e.reversedDepth?t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Uo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.mapType=e.mapType,this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.mapType=this.mapType,e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Zr=new Y,Jr=new Oi,Di=new Y;class kd extends wt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new je,this.projectionMatrix=new je,this.projectionMatrixInverse=new je,this.coordinateSystem=Ii,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Zr,Jr,Di),Di.x===1&&Di.y===1&&Di.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Zr,Jr,Di.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(Zr,Jr,Di),Di.x===1&&Di.y===1&&Di.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Zr,Jr,Di.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const vn=new Y,Kh=new tt,jh=new tt;class pi extends kd{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Ms*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ir*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ms*2*Math.atan(Math.tan(ir*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){vn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(vn.x,vn.y).multiplyScalar(-e/vn.z),vn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(vn.x,vn.y).multiplyScalar(-e/vn.z)}getViewSize(e,t){return this.getViewBounds(e,Kh,jh),t.subVectors(jh,Kh)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(ir*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*i/c,s*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class g0 extends uc{constructor(){super(new pi(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,i=Ms*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(i!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=i,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){const e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}}class KS extends za{constructor(e,t,i=0,s=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(wt.DEFAULT_UP),this.updateMatrix(),this.target=new wt,this.distance=i,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new g0}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}}class v0 extends uc{constructor(){super(new pi(90,1,.5,500)),this.isPointLightShadow=!0}}class jS extends za{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new v0}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class dc extends kd{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class _0 extends uc{constructor(){super(new dc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class ZS extends za{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(wt.DEFAULT_UP),this.updateMatrix(),this.target=new wt,this.shadow=new _0}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class JS{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}const Oo=new WeakMap;class QS extends Cs{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Pe("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Pe("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,i,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=nn.get(`image-bitmap:${e}`);if(a!==void 0){if(r.manager.itemStart(e),a.then){a.then(c=>{Oo.has(a)===!0?(s&&s(Oo.get(a)),r.manager.itemError(e),r.manager.itemEnd(e)):(t&&t(c),r.manager.itemEnd(e))});return}setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);return}const o={};o.credentials=this.withCredentials||this.crossOrigin!=="anonymous"?"include":"same-origin",o.headers=this.requestHeader,o.priority=this.priority,o.cache=this.cache,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign({},r.options,{colorSpaceConversion:"none"}))}).then(function(c){return nn.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){s&&s(c),Oo.set(l,c),nn.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});nn.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const os=-90,ls=1;class Hl extends wt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new pi(os,ls,e,t);s.layers=this.layers,this.add(s);const r=new pi(os,ls,e,t);r.layers=this.layers,this.add(r);const a=new pi(os,ls,e,t);a.layers=this.layers,this.add(a);const o=new pi(os,ls,e,t);o.layers=this.layers,this.add(o);const l=new pi(os,ls,e,t);l.layers=this.layers,this.add(l);const c=new pi(os,ls,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===Ii)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===cr)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,f=e.getRenderTarget(),d=e.getActiveCubeFace(),u=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;const _=i.texture.mipmapsAutoUpdate;i.texture.mipmapsAutoUpdate=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,1,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,2,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,3,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,4,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),i.texture.mipmapsAutoUpdate=_,e.setRenderTarget(i,5,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(f,d,u),e.xr.enabled=p,i.texture.needsPMREMUpdate=!0}}class x0 extends pi{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}}class y0{constructor(e,t,i){this.binding=e,this.valueSize=i;let s,r,a;switch(t){case"quaternion":s=this._slerp,r=this._slerpAdditive,a=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(i*6),this._workIndex=5;break;case"string":case"bool":s=this._select,r=this._select,a=this._setAdditiveIdentityOther,this.buffer=new Array(i*5);break;default:s=this._lerp,r=this._lerpAdditive,a=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(i*5)}this._mixBufferRegion=s,this._mixBufferRegionAdditive=r,this._setIdentity=a,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){const i=this.buffer,s=this.valueSize,r=e*s+s;let a=this.cumulativeWeight;if(a===0){for(let o=0;o!==s;++o)i[r+o]=i[o];a=t}else{a+=t;const o=t/a;this._mixBufferRegion(i,r,0,o,s)}this.cumulativeWeight=a}accumulateAdditive(e){const t=this.buffer,i=this.valueSize,s=i*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,s,0,e,i),this.cumulativeWeightAdditive+=e}apply(e){const t=this.valueSize,i=this.buffer,s=e*t+t,r=this.cumulativeWeight,a=this.cumulativeWeightAdditive,o=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,r<1){const l=t*this._origIndex;this._mixBufferRegion(i,s,l,1-r,t)}a>0&&this._mixBufferRegionAdditive(i,s,this._addIndex*t,1,t);for(let l=t,c=t+t;l!==c;++l)if(i[l]!==i[l+t]){o.setValue(i,s);break}}saveOriginalState(){const e=this.binding,t=this.buffer,i=this.valueSize,s=i*this._origIndex;e.getValue(t,s);for(let r=i,a=s;r!==a;++r)t[r]=t[s+r%i];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){const e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let i=e;i<t;i++)this.buffer[i]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let i=0;i<this.valueSize;i++)this.buffer[t+i]=this.buffer[e+i]}_select(e,t,i,s,r){if(s>=.5)for(let a=0;a!==r;++a)e[t+a]=e[i+a]}_slerp(e,t,i,s){Oi.slerpFlat(e,t,e,t,e,i,s)}_slerpAdditive(e,t,i,s,r){const a=this._workIndex*r;Oi.multiplyQuaternionsFlat(e,a,e,t,e,i),Oi.slerpFlat(e,t,e,t,e,a,s)}_lerp(e,t,i,s,r){const a=1-s;for(let o=0;o!==r;++o){const l=t+o;e[l]=e[l]*a+e[i+o]*s}}_lerpAdditive(e,t,i,s,r){for(let a=0;a!==r;++a){const o=t+a;e[o]=e[o]+e[i+a]*s}}}const fc="\\[\\]\\.:\\/",S0=new RegExp("["+fc+"]","g"),pc="[^"+fc+"]",M0="[^"+fc.replace("\\.","")+"]",b0=/((?:WC+[\/:])*)/.source.replace("WC",pc),w0=/(WCOD+)?/.source.replace("WCOD",M0),E0=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",pc),T0=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",pc),A0=new RegExp("^"+b0+w0+E0+T0+"$"),C0=["material","materials","bones","map"];class R0{constructor(e,t,i){const s=i||ct.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();const i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(e,t)}setValue(e,t){const i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}}class ct{constructor(e,t,i){this.path=t,this.parsedPath=i||ct.parseTrackName(t),this.node=ct.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new ct.Composite(e,t,i):new ct(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(S0,"")}static parseTrackName(e){const t=A0.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);const i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){const r=i.nodeName.substring(s+1);C0.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){const i=function(r){for(let a=0;a<r.length;a++){const o=r[a];if(o.name===t||o.uuid===t)return o;const l=i(o.children);if(l)return l}return null},s=i(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)e[t++]=i[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,i=t.objectName,s=t.propertyName;let r=t.propertyIndex;if(e||(e=ct.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Pe("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=t.objectIndex;switch(i){case"materials":if(!e.material){Ue("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Ue("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Ue("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Ue("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Ue("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){Ue("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(c!==void 0){if(e[c]===void 0){Ue("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const a=e[s];if(a===void 0){const c=t.nodeName;Ue("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){Ue("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Ue("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}ct.Composite=R0;ct.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ct.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ct.prototype.GetterByBindingType=[ct.prototype._getValue_direct,ct.prototype._getValue_array,ct.prototype._getValue_arrayElement,ct.prototype._getValue_toArray];ct.prototype.SetterByBindingTypeAndVersioning=[[ct.prototype._setValue_direct,ct.prototype._setValue_direct_setNeedsUpdate,ct.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ct.prototype._setValue_array,ct.prototype._setValue_array_setNeedsUpdate,ct.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ct.prototype._setValue_arrayElement,ct.prototype._setValue_arrayElement_setNeedsUpdate,ct.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ct.prototype._setValue_fromArray,ct.prototype._setValue_fromArray_setNeedsUpdate,ct.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class P0{constructor(e,t,i=null,s=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=i,this.blendMode=s;const r=t.tracks,a=r.length,o=new Array(a),l={endingStart:ms,endingEnd:ms};for(let c=0;c!==a;++c){const h=r[c].createInterpolant(null);o[c]=h,h.settings=l}this._interpolantSettings=l,this._interpolants=o,this._propertyBindings=new Array(a),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._restoreTimeScale=null,this._weightInterpolant=null,this.loop=Bm,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,i=!1){if(e.fadeOut(t),this.fadeIn(t),i===!0){const s=this._clip.duration,r=e._clip.duration,a=r/s,o=s/r;e._restoreTimeScale=e.timeScale,this._restoreTimeScale=this.timeScale,e.warp(1,a,t),this.warp(o,1,t)}return this}crossFadeTo(e,t,i=!1){return e.crossFadeFrom(this,t,i)}stopFading(){const e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,i){const s=this._mixer,r=s.time,a=this.timeScale;let o=this._timeScaleInterpolant;o===null&&(o=s._lendControlInterpolant(),this._timeScaleInterpolant=o);const l=o.parameterPositions,c=o.sampleValues;return l[0]=r,l[1]=r+i,c[0]=e/a,c[1]=t/a,this}stopWarping(){const e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this._restoreTimeScale=null,this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,i,s){if(!this.enabled){this._updateWeight(e);return}const r=this._startTime;if(r!==null){const l=(e-r)*i;l<0||i===0?t=0:(this._startTime=null,t=i*l)}t*=this._updateTimeScale(e);const a=this._updateTime(t),o=this._updateWeight(e);if(o>0){const l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case Hm:for(let h=0,f=l.length;h!==f;++h)l[h].evaluate(a),c[h].accumulateAdditive(o);break;case nc:default:for(let h=0,f=l.length;h!==f;++h)l[h].evaluate(a),c[h].accumulate(s,o)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;const i=this._weightInterpolant;if(i!==null){const s=i.evaluate(e)[0];t*=s,e>i.parameterPositions[1]&&(this.stopFading(),s===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;const i=this._timeScaleInterpolant;if(i!==null){const s=i.evaluate(e)[0];t*=s,e>i.parameterPositions[1]&&(t===0?this.paused=!0:(this._restoreTimeScale!==null&&(t=this._restoreTimeScale),this.timeScale=t),this.stopWarping())}}return this._effectiveTimeScale=t,t}_updateTime(e){const t=this._clip.duration,i=this.loop;let s=this.time+e,r=this._loopCount;const a=i===zm;if(e===0)return r===-1?s:a&&(r&1)===1?t-s:s;if(i===km){r===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(s>=t)s=t;else if(s<0)s=0;else{this.time=s;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=s,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(r===-1&&(e>=0?(r=0,this._setEndings(!0,this.repetitions===0,a)):this._setEndings(this.repetitions===0,!0,a)),s>=t||s<0){const o=Math.floor(s/t);s-=t*o,r+=Math.abs(o);const l=this.repetitions-r;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,s=e>0?t:0,this.time=s,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(l===1){const c=e<0;this._setEndings(c,!c,a)}else this._setEndings(!1,!1,a);this._loopCount=r,this.time=s,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:o})}}else this._loopCount=r,this.time=s;if(a&&(r&1)===1)return t-s}return s}_setEndings(e,t,i){const s=this._interpolantSettings;i?(s.endingStart=gs,s.endingEnd=gs):(e?s.endingStart=this.zeroSlopeAtStart?gs:ms:s.endingStart=Ta,t?s.endingEnd=this.zeroSlopeAtEnd?gs:ms:s.endingEnd=Ta)}_scheduleFading(e,t,i){const s=this._mixer,r=s.time;let a=this._weightInterpolant;a===null&&(a=s._lendControlInterpolant(),this._weightInterpolant=a);const o=a.parameterPositions,l=a.sampleValues;return o[0]=r,l[0]=t,o[1]=r+e,l[1]=i,this}}const I0=new Float32Array(1);class eM extends An{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}_bindAction(e,t){const i=e._localRoot||this._root,s=e._clip.tracks,r=s.length,a=e._propertyBindings,o=e._interpolants,l=i.uuid,c=this._bindingsByRootAndName;let h=c[l];h===void 0&&(h={},c[l]=h);for(let f=0;f!==r;++f){const d=s[f],u=d.name;let p=h[u];if(p!==void 0)++p.referenceCount,a[f]=p;else{if(p=a[f],p!==void 0){p._cacheIndex===null&&(++p.referenceCount,this._addInactiveBinding(p,l,u));continue}const _=t&&t._propertyBindings[f].binding.parsedPath;p=new y0(ct.create(i,u,_),d.ValueTypeName,d.getValueSize()),++p.referenceCount,this._addInactiveBinding(p,l,u),a[f]=p}o[f].resultBuffer=p.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){const i=(e._localRoot||this._root).uuid,s=e._clip.uuid,r=this._actionsByClip[s];this._bindAction(e,r&&r.knownActions[0]),this._addInactiveAction(e,s,i)}const t=e._propertyBindings;for(let i=0,s=t.length;i!==s;++i){const r=t[i];r.useCount++===0&&(this._lendBinding(r),r.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){const t=e._propertyBindings;for(let i=0,s=t.length;i!==s;++i){const r=t[i];--r.useCount===0&&(r.restoreOriginalState(),this._takeBackBinding(r))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){const t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,i){const s=this._actions,r=this._actionsByClip;let a=r[t];if(a===void 0)a={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,r[t]=a;else{const o=a.knownActions;e._byClipCacheIndex=o.length,o.push(e)}e._cacheIndex=s.length,s.push(e),a.actionByRoot[i]=e}_removeInactiveAction(e){const t=this._actions,i=t[t.length-1],s=e._cacheIndex;i._cacheIndex=s,t[s]=i,t.pop(),e._cacheIndex=null;const r=e._clip.uuid,a=this._actionsByClip,o=a[r],l=o.knownActions,c=l[l.length-1],h=e._byClipCacheIndex;c._byClipCacheIndex=h,l[h]=c,l.pop(),e._byClipCacheIndex=null;const f=o.actionByRoot,d=(e._localRoot||this._root).uuid;delete f[d],l.length===0&&delete a[r],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){const t=e._propertyBindings;for(let i=0,s=t.length;i!==s;++i){const r=t[i];--r.referenceCount===0&&this._removeInactiveBinding(r)}}_lendAction(e){const t=this._actions,i=e._cacheIndex,s=this._nActiveActions++,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=i,t[i]=r}_takeBackAction(e){const t=this._actions,i=e._cacheIndex,s=--this._nActiveActions,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=i,t[i]=r}_addInactiveBinding(e,t,i){const s=this._bindingsByRootAndName,r=this._bindings;let a=s[t];a===void 0&&(a={},s[t]=a),a[i]=e,e._cacheIndex=r.length,r.push(e)}_removeInactiveBinding(e){const t=this._bindings,i=e.binding,s=i.rootNode.uuid,r=i.path,a=this._bindingsByRootAndName,o=a[s],l=t[t.length-1],c=e._cacheIndex;l._cacheIndex=c,t[c]=l,t.pop(),delete o[r],Object.keys(o).length===0&&delete a[s]}_lendBinding(e){const t=this._bindings,i=e._cacheIndex,s=this._nActiveBindings++,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=i,t[i]=r}_takeBackBinding(e){const t=this._bindings,i=e._cacheIndex,s=--this._nActiveBindings,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=i,t[i]=r}_lendControlInterpolant(){const e=this._controlInterpolants,t=this._nActiveControlInterpolants++;let i=e[t];return i===void 0&&(i=new Dd(new Float32Array(2),new Float32Array(2),1,I0),i.__cacheIndex=t,e[t]=i),i}_takeBackControlInterpolant(e){const t=this._controlInterpolants,i=e.__cacheIndex,s=--this._nActiveControlInterpolants,r=t[s];e.__cacheIndex=s,t[s]=e,r.__cacheIndex=i,t[i]=r}clipAction(e,t,i){const s=t||this._root,r=s.uuid;let a=typeof e=="string"?Xh.findByName(s,e):e;const o=a!==null?a.uuid:e,l=this._actionsByClip[o];let c=null;if(i===void 0&&(a!==null?i=a.blendMode:i=nc),l!==void 0){const f=l.actionByRoot[r];if(f!==void 0&&f.blendMode===i)return f;c=l.knownActions[0],a===null&&(a=c._clip)}if(a===null)return null;const h=new P0(this,a,t,i);return this._bindAction(h,c),this._addInactiveAction(h,o,r),h}existingAction(e,t){const i=t||this._root,s=i.uuid,r=typeof e=="string"?Xh.findByName(i,e):e,a=r?r.uuid:e,o=this._actionsByClip[a];return o!==void 0&&o.actionByRoot[s]||null}stopAllAction(){const e=this._actions,t=this._nActiveActions;for(let i=t-1;i>=0;--i)e[i].stop();return this}update(e){e*=this.timeScale;const t=this._actions,i=this._nActiveActions,s=this.time+=e,r=Math.sign(e),a=this._accuIndex^=1;for(let c=0;c!==i;++c)t[c]._update(s,e,r,a);const o=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)o[c].apply(a);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){const t=this._actions,i=e.uuid,s=this._actionsByClip,r=s[i];if(r!==void 0){const a=r.knownActions;for(let o=0,l=a.length;o!==l;++o){const c=a[o];this._deactivateAction(c);const h=c._cacheIndex,f=t[t.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,f._cacheIndex=h,t[h]=f,t.pop(),this._removeInactiveBindingsForAction(c)}delete s[i]}}uncacheRoot(e){const t=e.uuid,i=this._actionsByClip;for(const a in i){const o=i[a].actionByRoot,l=o[t];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}const s=this._bindingsByRootAndName,r=s[t];if(r!==void 0)for(const a in r){const o=r[a];o.restoreOriginalState(),this._removeInactiveBinding(o)}}uncacheAction(e,t){const i=this.existingAction(e,t);i!==null&&(this._deactivateAction(i),this._removeInactiveAction(i))}}function Zh(n,e,t,i){const s=L0(i);switch(t){case pd:return n*e;case Ua:return n*e/s.components*s.byteLength;case ec:return n*e/s.components*s.byteLength;case Hn:return n*e*2/s.components*s.byteLength;case tc:return n*e*2/s.components*s.byteLength;case md:return n*e*3/s.components*s.byteLength;case vi:return n*e*4/s.components*s.byteLength;case ic:return n*e*4/s.components*s.byteLength;case ca:case ha:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case ua:case da:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case ll:case hl:return Math.max(n,16)*Math.max(e,8)/4;case ol:case cl:return Math.max(n,8)*Math.max(e,8)/2;case ul:case dl:case pl:case ml:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case fl:case ba:case gl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case vl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case _l:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case xl:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case yl:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Sl:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Ml:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case bl:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case wl:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case El:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Tl:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Al:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Cl:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Rl:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Pl:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Il:case Ll:case Nl:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Dl:case Fl:return Math.ceil(n/4)*Math.ceil(e/4)*8;case wa:case Ul:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function L0(n){switch(n){case ti:case hd:return{byteLength:1,components:1};case or:case ud:case zi:return{byteLength:2,components:1};case Jl:case Ql:return{byteLength:2,components:4};case Bi:case Zl:case gi:return{byteLength:4,components:1};case dd:case fd:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:jl}}));typeof window<"u"&&(window.__THREE__?Pe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=jl);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Bd(){let n=null,e=!1,t=null,i=null;function s(r,a){i=n.requestAnimationFrame(s),t(r,a)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function N0(n){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,f=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,h),o.onUploadCallback();let u;if(c instanceof Float32Array)u=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)u=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?u=n.HALF_FLOAT:u=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)u=n.SHORT;else if(c instanceof Uint32Array)u=n.UNSIGNED_INT;else if(c instanceof Int32Array)u=n.INT;else if(c instanceof Int8Array)u=n.BYTE;else if(c instanceof Uint8Array)u=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)u=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:u,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function i(o,l,c){const h=l.array,f=l.updateRanges;if(n.bindBuffer(c,o),f.length===0)n.bufferSubData(c,0,h);else{f.sort((u,p)=>u.start-p.start);let d=0;for(let u=1;u<f.length;u++){const p=f[d],_=f[u];_.start<=p.start+p.count+1?p.count=Math.max(p.count,_.start+_.count-p.start):(++d,f[d]=_)}f.length=d+1;for(let u=0,p=f.length;u<p;u++){const _=f[u];n.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var D0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,F0=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,U0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,O0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,k0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,B0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,z0=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,H0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,V0=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,G0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,W0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,X0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,$0=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,q0=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Y0=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,K0=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,j0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Z0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,J0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Q0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,ev=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,tv=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,iv=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,nv=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,sv=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,rv=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,av=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,ov=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,lv=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,cv="gl_FragColor = linearToOutputTexel( gl_FragColor );",hv=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,uv=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,dv=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,fv=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,pv=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,mv=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,gv=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,vv=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,_v=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,xv=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,yv=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Sv=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Mv=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,bv=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,wv=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Ev=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,Tv=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Av=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Cv=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Rv=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Pv=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Iv=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Lv=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Nv=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Dv=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Fv=`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Uv=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Ov=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,kv=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Bv=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,zv=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Hv=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Vv=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Gv=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Wv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Xv=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,$v=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,qv=`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Yv=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Kv=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,jv=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Zv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Jv=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Qv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,e_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,t_=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,i_=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,n_=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,s_=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,r_=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,a_=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,o_=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,l_=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,c_=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,h_=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,u_=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,d_=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,f_=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,p_=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,m_=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,g_=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,v_=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,__=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,x_=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,y_=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,S_=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,M_=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,b_=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,w_=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,E_=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,T_=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,A_=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,C_=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,R_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,P_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,I_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,L_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const N_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,D_=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,F_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,U_=`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,O_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,k_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,B_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,z_=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,H_=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,V_=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,G_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,W_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,X_=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,$_=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,q_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Y_=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,K_=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,j_=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Z_=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,J_=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Q_=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,ex=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,tx=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ix=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,nx=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,sx=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,rx=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ax=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ox=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,lx=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,cx=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,hx=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ux=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,dx=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,We={alphahash_fragment:D0,alphahash_pars_fragment:F0,alphamap_fragment:U0,alphamap_pars_fragment:O0,alphatest_fragment:k0,alphatest_pars_fragment:B0,aomap_fragment:z0,aomap_pars_fragment:H0,batching_pars_vertex:V0,batching_vertex:G0,begin_vertex:W0,beginnormal_vertex:X0,bsdfs:$0,iridescence_fragment:q0,bumpmap_pars_fragment:Y0,clipping_planes_fragment:K0,clipping_planes_pars_fragment:j0,clipping_planes_pars_vertex:Z0,clipping_planes_vertex:J0,color_fragment:Q0,color_pars_fragment:ev,color_pars_vertex:tv,color_vertex:iv,common:nv,defaultnormal_vertex:sv,displacementmap_pars_vertex:rv,displacementmap_vertex:av,emissivemap_fragment:ov,emissivemap_pars_fragment:lv,colorspace_fragment:cv,colorspace_pars_fragment:hv,envmap_fragment:uv,envmap_common_pars_fragment:dv,envmap_pars_fragment:fv,envmap_pars_vertex:pv,envmap_physical_pars_fragment:Ev,envmap_vertex:mv,fog_vertex:gv,fog_pars_vertex:vv,fog_fragment:_v,fog_pars_fragment:xv,gradientmap_pars_fragment:yv,lightmap_pars_fragment:Sv,lights_lambert_fragment:Mv,lights_lambert_pars_fragment:bv,lights_pars_begin:wv,lights_toon_fragment:Tv,lights_toon_pars_fragment:Av,lights_phong_fragment:Cv,lights_phong_pars_fragment:Rv,lights_physical_fragment:Pv,lights_physical_pars_fragment:Iv,lights_fragment_begin:Lv,lights_fragment_maps:Nv,lights_fragment_end:Dv,lightprobes_pars_fragment:Fv,logdepthbuf_fragment:Uv,logdepthbuf_pars_fragment:Ov,logdepthbuf_pars_vertex:kv,logdepthbuf_vertex:Bv,map_fragment:zv,map_pars_fragment:Hv,map_particle_fragment:Vv,map_particle_pars_fragment:Gv,metalnessmap_fragment:Wv,metalnessmap_pars_fragment:Xv,morphinstance_vertex:$v,morphcolor_vertex:qv,morphnormal_vertex:Yv,morphtarget_pars_vertex:Kv,morphtarget_vertex:jv,normal_fragment_begin:Zv,normal_fragment_maps:Jv,normal_pars_fragment:Qv,normal_pars_vertex:e_,normal_vertex:t_,normalmap_pars_fragment:i_,clearcoat_normal_fragment_begin:n_,clearcoat_normal_fragment_maps:s_,clearcoat_pars_fragment:r_,iridescence_pars_fragment:a_,opaque_fragment:o_,packing:l_,premultiplied_alpha_fragment:c_,project_vertex:h_,dithering_fragment:u_,dithering_pars_fragment:d_,roughnessmap_fragment:f_,roughnessmap_pars_fragment:p_,shadowmap_pars_fragment:m_,shadowmap_pars_vertex:g_,shadowmap_vertex:v_,shadowmask_pars_fragment:__,skinbase_vertex:x_,skinning_pars_vertex:y_,skinning_vertex:S_,skinnormal_vertex:M_,specularmap_fragment:b_,specularmap_pars_fragment:w_,tonemapping_fragment:E_,tonemapping_pars_fragment:T_,transmission_fragment:A_,transmission_pars_fragment:C_,uv_pars_fragment:R_,uv_pars_vertex:P_,uv_vertex:I_,worldpos_vertex:L_,background_vert:N_,background_frag:D_,backgroundCube_vert:F_,backgroundCube_frag:U_,cube_vert:O_,cube_frag:k_,depth_vert:B_,depth_frag:z_,distance_vert:H_,distance_frag:V_,equirect_vert:G_,equirect_frag:W_,linedashed_vert:X_,linedashed_frag:$_,meshbasic_vert:q_,meshbasic_frag:Y_,meshlambert_vert:K_,meshlambert_frag:j_,meshmatcap_vert:Z_,meshmatcap_frag:J_,meshnormal_vert:Q_,meshnormal_frag:ex,meshphong_vert:tx,meshphong_frag:ix,meshphysical_vert:nx,meshphysical_frag:sx,meshtoon_vert:rx,meshtoon_frag:ax,points_vert:ox,points_frag:lx,shadow_vert:cx,shadow_frag:hx,sprite_vert:ux,sprite_frag:dx},Se={common:{diffuse:{value:new $e(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ke},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ke}},envmap:{envMap:{value:null},envMapRotation:{value:new ke},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ke}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ke}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ke},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ke},normalScale:{value:new tt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ke},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ke}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ke}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ke}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new $e(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new $e(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0},uvTransform:{value:new ke}},sprite:{diffuse:{value:new $e(16777215)},opacity:{value:1},center:{value:new tt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ke},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0}}},Ui={basic:{uniforms:Jt([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.fog]),vertexShader:We.meshbasic_vert,fragmentShader:We.meshbasic_frag},lambert:{uniforms:Jt([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,Se.lights,{emissive:{value:new $e(0)},envMapIntensity:{value:1}}]),vertexShader:We.meshlambert_vert,fragmentShader:We.meshlambert_frag},phong:{uniforms:Jt([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,Se.lights,{emissive:{value:new $e(0)},specular:{value:new $e(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:We.meshphong_vert,fragmentShader:We.meshphong_frag},standard:{uniforms:Jt([Se.common,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.roughnessmap,Se.metalnessmap,Se.fog,Se.lights,{emissive:{value:new $e(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:We.meshphysical_vert,fragmentShader:We.meshphysical_frag},toon:{uniforms:Jt([Se.common,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.gradientmap,Se.fog,Se.lights,{emissive:{value:new $e(0)}}]),vertexShader:We.meshtoon_vert,fragmentShader:We.meshtoon_frag},matcap:{uniforms:Jt([Se.common,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,{matcap:{value:null}}]),vertexShader:We.meshmatcap_vert,fragmentShader:We.meshmatcap_frag},points:{uniforms:Jt([Se.points,Se.fog]),vertexShader:We.points_vert,fragmentShader:We.points_frag},dashed:{uniforms:Jt([Se.common,Se.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:We.linedashed_vert,fragmentShader:We.linedashed_frag},depth:{uniforms:Jt([Se.common,Se.displacementmap]),vertexShader:We.depth_vert,fragmentShader:We.depth_frag},normal:{uniforms:Jt([Se.common,Se.bumpmap,Se.normalmap,Se.displacementmap,{opacity:{value:1}}]),vertexShader:We.meshnormal_vert,fragmentShader:We.meshnormal_frag},sprite:{uniforms:Jt([Se.sprite,Se.fog]),vertexShader:We.sprite_vert,fragmentShader:We.sprite_frag},background:{uniforms:{uvTransform:{value:new ke},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:We.background_vert,fragmentShader:We.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ke}},vertexShader:We.backgroundCube_vert,fragmentShader:We.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:We.cube_vert,fragmentShader:We.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:We.equirect_vert,fragmentShader:We.equirect_frag},distance:{uniforms:Jt([Se.common,Se.displacementmap,{referencePosition:{value:new Y},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:We.distance_vert,fragmentShader:We.distance_frag},shadow:{uniforms:Jt([Se.lights,Se.fog,{color:{value:new $e(0)},opacity:{value:1}}]),vertexShader:We.shadow_vert,fragmentShader:We.shadow_frag}};Ui.physical={uniforms:Jt([Ui.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ke},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ke},clearcoatNormalScale:{value:new tt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ke},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new ke},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ke},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ke},sheen:{value:0},sheenColor:{value:new $e(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ke},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ke},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ke},transmissionSamplerSize:{value:new tt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ke},attenuationDistance:{value:0},attenuationColor:{value:new $e(0)},specularColor:{value:new $e(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ke},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ke},anisotropyVector:{value:new tt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ke}}]),vertexShader:We.meshphysical_vert,fragmentShader:We.meshphysical_frag};const Qr={r:0,b:0,g:0},fx=new je,zd=new ke;zd.set(-1,0,0,0,1,0,0,0,1);function px(n,e,t,i,s,r){const a=new $e(0);let o=s===!0?0:1,l,c,h=null,f=0,d=null;function u(y){let b=y.isScene===!0?y.background:null;if(b&&b.isTexture){const A=y.backgroundBlurriness>0;b=e.get(b,A)}return b}function p(y){let b=!1;const A=u(y);A===null?m(a,o):A&&A.isColor&&(m(A,1),b=!0);const x=n.xr.getEnvironmentBlendMode();x==="additive"?t.buffers.color.setClear(0,0,0,1,r):x==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(n.autoClear||b)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function _(y,b){const A=u(b);A&&A.isCubeTexture?(c===void 0&&(c=new _i(new pr(1,1,1),new Vn({name:"BackgroundCubeMaterial",uniforms:Es(Ui.backgroundCube.uniforms),vertexShader:Ui.backgroundCube.vertexShader,fragmentShader:Ui.backgroundCube.fragmentShader,side:ii,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(x,M,v){this.matrixWorld.copyPosition(v.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=A,c.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(fx.makeRotationFromEuler(b.backgroundRotation)).transpose(),A.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(zd),c.material.toneMapped=et.getTransfer(A.colorSpace)!==lt,(h!==A||f!==A.version||d!==n.toneMapping)&&(c.material.needsUpdate=!0,h=A,f=A.version,d=n.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null)):A&&A.isTexture&&(l===void 0&&(l=new _i(new Ba(2,2),new Vn({name:"BackgroundMaterial",uniforms:Es(Ui.background.uniforms),vertexShader:Ui.background.vertexShader,fragmentShader:Ui.background.fragmentShader,side:zn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=A,l.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,l.material.toneMapped=et.getTransfer(A.colorSpace)!==lt,A.matrixAutoUpdate===!0&&A.updateMatrix(),l.material.uniforms.uvTransform.value.copy(A.matrix),(h!==A||f!==A.version||d!==n.toneMapping)&&(l.material.needsUpdate=!0,h=A,f=A.version,d=n.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function m(y,b){y.getRGB(Qr,Nd(n)),t.buffers.color.setClear(Qr.r,Qr.g,Qr.b,b,r)}function g(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(y,b=1){a.set(y),o=b,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(y){o=y,m(a,o)},render:p,addToRenderList:_,dispose:g}}function mx(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null);let r=s,a=!1;function o(C,F,I,R,O){let k=!1;const H=f(C,R,I,F);r!==H&&(r=H,c(r.object)),k=u(C,R,I,O),k&&p(C,R,I,O),O!==null&&e.update(O,n.ELEMENT_ARRAY_BUFFER),(k||a)&&(a=!1,A(C,F,I,R),O!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(O).buffer))}function l(){return n.createVertexArray()}function c(C){return n.bindVertexArray(C)}function h(C){return n.deleteVertexArray(C)}function f(C,F,I,R){const O=R.wireframe===!0;let k=i[F.id];k===void 0&&(k={},i[F.id]=k);const H=C.isInstancedMesh===!0?C.id:0;let L=k[H];L===void 0&&(L={},k[H]=L);let N=L[I.id];N===void 0&&(N={},L[I.id]=N);let W=N[O];return W===void 0&&(W=d(l()),N[O]=W),W}function d(C){const F=[],I=[],R=[];for(let O=0;O<t;O++)F[O]=0,I[O]=0,R[O]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:I,attributeDivisors:R,object:C,attributes:{},index:null}}function u(C,F,I,R){const O=r.attributes,k=F.attributes;let H=0;const L=I.getAttributes();for(const N in L)if(L[N].location>=0){const B=O[N];let j=k[N];if(j===void 0&&(N==="instanceMatrix"&&C.instanceMatrix&&(j=C.instanceMatrix),N==="instanceColor"&&C.instanceColor&&(j=C.instanceColor)),B===void 0||B.attribute!==j||j&&B.data!==j.data)return!0;H++}return r.attributesNum!==H||r.index!==R}function p(C,F,I,R){const O={},k=F.attributes;let H=0;const L=I.getAttributes();for(const N in L)if(L[N].location>=0){let B=k[N];B===void 0&&(N==="instanceMatrix"&&C.instanceMatrix&&(B=C.instanceMatrix),N==="instanceColor"&&C.instanceColor&&(B=C.instanceColor));const j={};j.attribute=B,B&&B.data&&(j.data=B.data),O[N]=j,H++}r.attributes=O,r.attributesNum=H,r.index=R}function _(){const C=r.newAttributes;for(let F=0,I=C.length;F<I;F++)C[F]=0}function m(C){g(C,0)}function g(C,F){const I=r.newAttributes,R=r.enabledAttributes,O=r.attributeDivisors;I[C]=1,R[C]===0&&(n.enableVertexAttribArray(C),R[C]=1),O[C]!==F&&(n.vertexAttribDivisor(C,F),O[C]=F)}function y(){const C=r.newAttributes,F=r.enabledAttributes;for(let I=0,R=F.length;I<R;I++)F[I]!==C[I]&&(n.disableVertexAttribArray(I),F[I]=0)}function b(C,F,I,R,O,k,H){H===!0?n.vertexAttribIPointer(C,F,I,O,k):n.vertexAttribPointer(C,F,I,R,O,k)}function A(C,F,I,R){_();const O=R.attributes,k=I.getAttributes(),H=F.defaultAttributeValues;for(const L in k){const N=k[L];if(N.location>=0){let W=O[L];if(W===void 0&&(L==="instanceMatrix"&&C.instanceMatrix&&(W=C.instanceMatrix),L==="instanceColor"&&C.instanceColor&&(W=C.instanceColor)),W!==void 0){const B=W.normalized,j=W.itemSize,re=e.get(W);if(re===void 0)continue;const V=re.buffer,K=re.type,ie=re.bytesPerElement,ae=K===n.INT||K===n.UNSIGNED_INT||W.gpuType===Zl;if(W.isInterleavedBufferAttribute){const se=W.data,be=se.isInterleavedBuffer===!0?se.stride:se.itemSize,rt=W.offset;if(se.isInstancedInterleavedBuffer||se.isInstancedBufferAttribute){for(let Ee=0;Ee<N.locationSize;Ee++)g(N.location+Ee,se.meshPerAttribute);C.isInstancedMesh!==!0&&R._maxInstanceCount===void 0&&(R._maxInstanceCount=se.meshPerAttribute*se.count)}else for(let Ee=0;Ee<N.locationSize;Ee++)m(N.location+Ee);n.bindBuffer(n.ARRAY_BUFFER,V);for(let Ee=0;Ee<N.locationSize;Ee++)b(N.location+Ee,j/N.locationSize,K,B,be*ie,(rt+j/N.locationSize*Ee)*ie,ae)}else{if(W.isInstancedBufferAttribute){for(let se=0;se<N.locationSize;se++)g(N.location+se,W.meshPerAttribute);C.isInstancedMesh!==!0&&R._maxInstanceCount===void 0&&(R._maxInstanceCount=W.meshPerAttribute*W.count)}else for(let se=0;se<N.locationSize;se++)m(N.location+se);n.bindBuffer(n.ARRAY_BUFFER,V);for(let se=0;se<N.locationSize;se++)b(N.location+se,j/N.locationSize,K,B,j*ie,j/N.locationSize*se*ie,ae)}}else if(H!==void 0){const B=H[L];if(B!==void 0)switch(B.length){case 2:n.vertexAttrib2fv(N.location,B);break;case 3:n.vertexAttrib3fv(N.location,B);break;case 4:n.vertexAttrib4fv(N.location,B);break;default:n.vertexAttrib1fv(N.location,B)}}}}y()}function x(){E();for(const C in i){const F=i[C];for(const I in F){const R=F[I];for(const O in R){const k=R[O];for(const H in k)h(k[H].object),delete k[H];delete R[O]}}delete i[C]}}function M(C){if(i[C.id]===void 0)return;const F=i[C.id];for(const I in F){const R=F[I];for(const O in R){const k=R[O];for(const H in k)h(k[H].object),delete k[H];delete R[O]}}delete i[C.id]}function v(C){for(const F in i){const I=i[F];for(const R in I){const O=I[R];if(O[C.id]===void 0)continue;const k=O[C.id];for(const H in k)h(k[H].object),delete k[H];delete O[C.id]}}}function S(C){for(const F in i){const I=i[F],R=C.isInstancedMesh===!0?C.id:0,O=I[R];if(O!==void 0){for(const k in O){const H=O[k];for(const L in H)h(H[L].object),delete H[L];delete O[k]}delete I[R],Object.keys(I).length===0&&delete i[F]}}}function E(){P(),a=!0,r!==s&&(r=s,c(r.object))}function P(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:E,resetDefaultState:P,dispose:x,releaseStatesOfGeometry:M,releaseStatesOfObject:S,releaseStatesOfProgram:v,initAttributes:_,enableAttribute:m,disableUnusedAttributes:y}}function gx(n,e,t){let i;function s(l){i=l}function r(l,c){n.drawArrays(i,l,c),t.update(c,i,1)}function a(l,c,h){h!==0&&(n.drawArraysInstanced(i,l,c,h),t.update(c,i,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,h);let d=0;for(let u=0;u<h;u++)d+=c[u];t.update(d,i,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function vx(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const v=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(v.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(v){return!(v!==vi&&i.convert(v)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(v){const S=v===zi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(v!==ti&&v!==gi&&!S&&i.convert(v)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE))}function l(v){if(v==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";v="mediump"}return v==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(Pe("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),d=t.logarithmicDepthBuffer===!0&&f===!1;t.reversedDepthBuffer===!0&&f===!1&&Pe("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),t.logarithmicDepthBuffer===!0&&f===!0&&Pe("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");const u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),g=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),b=n.getParameter(n.MAX_VARYING_VECTORS),A=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),x=n.getParameter(n.MAX_SAMPLES),M=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:u,maxVertexTextures:p,maxTextureSize:_,maxCubemapSize:m,maxAttributes:g,maxVertexUniforms:y,maxVaryings:b,maxFragmentUniforms:A,maxSamples:x,samples:M}}function _x(n){const e=this;let t=null,i=0,s=!1,r=!1;const a=new yn,o=new ke,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const u=f.length!==0||d||i!==0||s;return s=d,i=f.length,u},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,d){t=h(f,d,0)},this.setState=function(f,d,u){const p=f.clippingPlanes,_=f.clipIntersection,m=f.clipShadows,g=n.get(f);if(!s||p===null||p.length===0||r&&!m)r?h(null):c();else{const y=r?0:i,b=y*4;let A=g.clippingState||null;l.value=A,A=h(p,d,b,u);for(let x=0;x!==b;++x)A[x]=t[x];g.clippingState=A,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(f,d,u,p){const _=f!==null?f.length:0;let m=null;if(_!==0){if(m=l.value,p!==!0||m===null){const g=u+_*4,y=d.matrixWorldInverse;o.getNormalMatrix(y),(m===null||m.length<g)&&(m=new Float32Array(g));for(let b=0,A=u;b!==_;++b,A+=4)a.copy(f[b]).applyMatrix4(y,o),a.normal.toArray(m,A),m[A+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}class mc extends ki{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Pd(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new pr(5,5,5),r=new Vn({name:"CubemapFromEquirect",uniforms:Es(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:ii,blending:vs});r.uniforms.tEquirect.value=t;const a=new _i(s,r),o=t.minFilter;return t.minFilter===tn&&(t.minFilter=kt),new Hl(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}}const Jh=256,xx=3,yx=20,Hd=256,Vd=16,Sx=3,Mx=new Y,bx=new $e;class La{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new Hl(1,10,null),this._boxMesh=new _i(new pr(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,i=.1,s=100,r={}){const{size:a=256,position:o=Mx}=r,l=this._renderer;this._setSize(a);const c=this._allocateTarget(),h=this._getSourceTarget(!0);t>0&&(h.texture.mipmapsAutoUpdate=!1);const f=l.autoClear,d=l.autoClearColor,u=l.autoClearDepth,p=l.autoClearStencil,_=e.background;l.autoClear=!0,l.autoClearColor=!0,l.autoClearDepth=!0,l.autoClearStencil=!0,_===null&&(e.background=l.getClearColor(bx));const m=new Hl(i,s,h);return m.position.copy(o),m.update(l,e),l.autoClear=f,l.autoClearColor=d,l.autoClearDepth=u,l.autoClearStencil=p,e.background=_,t>0&&(h.texture.mipmapsAutoUpdate=!0,this._blur(c,t)),this._applyPMREM(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=tu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=eu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(Jh,Sd(e))}_fromTexture(e,t){e.mapping===ys||e.mapping===ar?this._setSize(e.image.length===0?Jh:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);const i=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(i),i}_allocateTarget(){const e=this._cubeSize,t=Qh(e,!1,!1),i=Math.log2(e)-xx;for(let s=0;s<=i;s++)t.texture.mipmaps.push({width:e>>s,height:e>>s});return t.texture.name="PMREM",t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){const t=this._cubeSize,i=this._sourceTarget;return(i===null||i.width!==t||e&&i.depthBuffer===!1)&&(i!==null&&i.dispose(),this._sourceTarget=Qh(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,i){const s=this._boxMesh,r=this._cubeCamera;s.material=i,r.renderTarget=e,r.activeMipmapLevel=t;const a=e.width>>t;e.viewport.set(0,0,a,a),r.update(this._renderer,s),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===ys||e.mapping===ar?(this._cubemapMaterial===null&&(this._cubemapMaterial=tu()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=eu()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(e){this._ggxMaterial===null&&(this._ggxMaterial=wx(),this._integrationMaterial=Ex());const t=this._cubeSize,i=e.texture.mipmaps.length-1,s=this._ggxMaterial.uniforms;s.envMap.value=this._sourceTarget.texture;const r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(t/Vd);for(let a=0;a<=i;a++){const o=La.lodToRoughness(a,i);if(a>i-Sx)r.roughness.value=o,this._renderCube(e,a,this._integrationMaterial);else{const l=o>0?Math.log2(t)+.5*Math.log2(6/(Hd*Math.pow(o,4)))+.5:0;s.roughness.value=o,s.lodBias.value=l,this._renderCube(e,a,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=Tx());const i=this._blurMaterial,s=i.uniforms,r=this._sourceTarget;s.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,s.envMap.value=r.texture,this._renderCube(e,0,i),s.envMap.value=e.texture,this._renderCube(r,0,i)}}function Qh(n,e,t){return new mc(n,{minFilter:tn,generateMipmaps:e,type:zi,colorSpace:lr,depthBuffer:t})}function gr(n,e,t){return new Vn({name:n,uniforms:e,vertexShader:We.cube_vert,fragmentShader:t,side:ii,blending:vs,depthTest:!1,depthWrite:!1})}function wx(){return gr("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${Hd}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function Ex(){return gr("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:Vd}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function Tx(){return gr("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${yx}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function eu(){return gr("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function tu(){return gr("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function Ax(n){let e=new WeakMap,t=new WeakMap,i=null;function s(d,u=!1){return d==null?null:u?a(d):r(d)}function r(d){if(d&&d.isTexture){const u=d.mapping;if(u===oo||u===lo)if(e.has(d)){const p=e.get(d).texture;return o(p,d.mapping)}else{const p=d.image;if(p&&p.height>0){const _=new mc(p.height);return _.fromEquirectangularTexture(n,d),e.set(d,_),d.addEventListener("dispose",c),o(_.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture&&d.isPMREMTexture!==!0){const u=d.mapping,p=u===oo||u===lo,_=u===ys||u===ar;if(p||_){let m=t.get(d);const g=m!==void 0?m.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==g)return i===null&&(i=new La(n)),m=p?i.fromEquirectangular(d,m):i.fromCubemap(d,m),m.texture.pmremVersion=d.pmremVersion,t.set(d,m),m.texture;if(m!==void 0)return m.texture;{const y=d.image;return p&&y&&y.height>0||_&&y&&l(y)?(i===null&&(i=new La(n)),m=p?i.fromEquirectangular(d):i.fromCubemap(d),m.texture.pmremVersion=d.pmremVersion,t.set(d,m),d.addEventListener("dispose",h),m.texture):null}}}return d}function o(d,u){return u===oo?d.mapping=ys:u===lo&&(d.mapping=ar),d}function l(d){let u=0;const p=6;for(let _=0;_<p;_++)d[_]!==void 0&&u++;return u===p}function c(d){const u=d.target;u.removeEventListener("dispose",c);const p=e.get(u);p!==void 0&&(e.delete(u),p.dispose())}function h(d){const u=d.target;u.removeEventListener("dispose",h);const p=t.get(u);p!==void 0&&(t.delete(u),p.dispose())}function f(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:f}}function Cx(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&_s("WebGLRenderer: "+i+" extension not supported."),s}}}function Rx(n,e,t,i){const s={},r=new WeakMap,a=new FinalizationRegistry(p=>delete s[p]);function o(p){l(p.target)}function l(p){p.index!==null&&e.remove(p.index);for(const m in p.attributes)e.remove(p.attributes[m]);p.removeEventListener("dispose",o),delete s[p.id],a.unregister(p);const _=r.get(p);_&&(e.remove(_),r.delete(p)),i.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function c(p,_){return s[_.id]!==void 0||(_.addEventListener("dispose",o),s[_.id]=new WeakRef(_),a.register(_,_.id,_),t.memory.geometries++),_}function h(p){const _=p.attributes;for(const m in _)e.update(_[m],n.ARRAY_BUFFER)}function f(p){const _=p.index,m=p.attributes.position;let g=0;if(m===void 0)return;const y=_!==null?_.array.length:m.array.length/3-1,b=m.count>=65535?Td:Ed,A=new b(Math.ceil(y/3)*6,1),x=A.array;if(_!==null){const v=_.array;g=_.version;for(let S=0,E=0;S<y;S+=3){const P=v[S+0],C=v[S+1],F=v[S+2];x[E++]=P,x[E++]=C,x[E++]=C,x[E++]=F,x[E++]=F,x[E++]=P}}else{g=m.version;for(let v=0,S=0;v<y;v+=3){const E=v+0,P=v+1,C=v+2;x[S++]=E,x[S++]=P,x[S++]=P,x[S++]=C,x[S++]=C,x[S++]=E}}A.version=g;const M=r.get(p);M&&e.remove(M),r.set(p,A)}function d(p){const _=r.get(p);if(_){const m=p.index;m!==null&&_.version<m.version&&f(p)}else f(p);return r.get(p)}function u(){for(const p in s){const _=s[p].deref();_!==void 0&&l(_)}}return{get:c,update:h,getWireframeAttribute:d,dispose:u}}function Px(n,e,t){let i;function s(f){i=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,d){n.drawElements(i,d,r,f*a),t.update(d,i,1)}function c(f,d,u){u!==0&&(n.drawElementsInstanced(i,d,r,f*a,u),t.update(d,i,u))}function h(f,d,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,r,f,0,u);let _=0;for(let m=0;m<u;m++)_+=d[m];t.update(_,i,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function Ix(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:Ue("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function Lx(n,e,t){const i=new WeakMap,s=new ut;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0;let d=i.get(o);if(d===void 0||d.count!==f){let E=function(){v.dispose(),i.delete(o),o.removeEventListener("dispose",E)};d!==void 0&&d.texture.dispose();const u=o.morphAttributes.position!==void 0,p=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],g=o.morphAttributes.normal||[],y=o.morphAttributes.color||[];let b=0;u===!0&&(b=1),p===!0&&(b=2),_===!0&&(b=3);let A=o.attributes.position.count*b,x=1;A>e.maxTextureSize&&(x=Math.ceil(A/e.maxTextureSize),A=e.maxTextureSize);const M=new Float32Array(A*x*4*f),v=new Md(M,A,x,f);v.type=gi,v.needsUpdate=!0;const S=b*4;for(let P=0;P<f;P++){const C=m[P],F=g[P],I=y[P],R=A*x*4*P;for(let O=0;O<C.count;O++){const k=O*S;u===!0&&(s.fromBufferAttribute(C,O),M[R+k+0]=s.x,M[R+k+1]=s.y,M[R+k+2]=s.z,M[R+k+3]=0),p===!0&&(s.fromBufferAttribute(F,O),M[R+k+4]=s.x,M[R+k+5]=s.y,M[R+k+6]=s.z,M[R+k+7]=0),_===!0&&(s.fromBufferAttribute(I,O),M[R+k+8]=s.x,M[R+k+9]=s.y,M[R+k+10]=s.z,M[R+k+11]=I.itemSize===4?s.w:1)}}d={count:f,texture:v,size:new tt(A,x)},i.set(o,d),o.addEventListener("dispose",E)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let u=0;for(let _=0;_<c.length;_++)u+=c[_];const p=o.morphTargetsRelative?1:1-u;l.getUniforms().setValue(n,"morphTargetBaseInfluence",p),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:r}}function Nx(n,e,t,i,s){let r=new WeakMap;function a(c){const h=s.render.frame,f=c.geometry,d=e.get(c,f);if(r.get(d)!==h&&(e.update(d),r.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){const u=c.skeleton;r.get(u)!==h&&(u.update(),r.set(u,h))}return d}function o(){r=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),i.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}const Dx={[id]:"LINEAR_TONE_MAPPING",[nd]:"REINHARD_TONE_MAPPING",[sd]:"CINEON_TONE_MAPPING",[rd]:"ACES_FILMIC_TONE_MAPPING",[od]:"AGX_TONE_MAPPING",[ld]:"NEUTRAL_TONE_MAPPING",[ad]:"CUSTOM_TONE_MAPPING"};function Fx(n,e,t,i,s,r){const a=new ki(e,t,{type:n,depthBuffer:s,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,l=null,c=null;const h=new Vi;h.setAttribute("position",new oi([-1,3,0,-1,-1,0,3,-1,0],3)),h.setAttribute("uv",new oi([0,2,0,0,2,0],2));const f=new zl({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new _i(h,f),u=new dc(-1,1,1,-1,0,1);let p=null,_=null,m=!1,g,y=null,b=[],A=!1;this.setSize=function(x,M){a.setSize(x,M),o!==null&&o.setSize(x,M),l!==null&&l.setSize(x,M);for(let v=0;v<b.length;v++){const S=b[v];S.setSize&&S.setSize(x,M)}},this.setEffects=function(x){b=x,A=b.length>0&&b[0].isRenderPass===!0;const M=a.width,v=a.height;b.length>0&&o===null&&(o=new ki(M,v,{type:zi,depthBuffer:!1,stencilBuffer:!1}),l=new ki(M,v,{type:zi,depthBuffer:!1,stencilBuffer:!1}));const S=s===!0&&b.some(E=>E.needsDepthTexture===!0);S!==(a.depthTexture!==null)&&(S===!0&&c===null&&(c=new ws(M,v),r===!0&&(c.format=wn,c.type=Ss)),a.dispose(),a.depthTexture=S?c:null,a.resolveDepthBuffer=S,a.storeMultisampledDepthBuffer=S);for(let E=0;E<b.length;E++){const P=b[E];P.setSize&&P.setSize(M,v),S&&P.needsDepthTexture===!0&&P.setDepthTexture&&P.setDepthTexture(c)}},this.begin=function(x,M){if(m||x.toneMapping===sn&&b.length===0)return!1;if(y=M,M!==null){const v=M.width,S=M.height;(a.width!==v||a.height!==S)&&this.setSize(v,S)}return A===!1&&x.setRenderTarget(a),g=x.toneMapping,x.toneMapping=sn,!0},this.hasRenderPass=function(){return A},this.end=function(x,M){x.toneMapping=g,m=!0;let v=a,S=o;for(let E=0;E<b.length;E++){const P=b[E];P.enabled!==!1&&(P.render(x,S,v,M),P.needsSwap!==!1&&(v=S,S=S===o?l:o))}if(p!==x.outputColorSpace||_!==x.toneMapping){p=x.outputColorSpace,_=x.toneMapping,f.defines={},et.getTransfer(p)===lt&&(f.defines.SRGB_TRANSFER="");const E=Dx[_];E&&(f.defines[E]=""),f.needsUpdate=!0}f.uniforms.tDiffuse.value=v.texture,x.setRenderTarget(y),x.render(d,u),y=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),h.dispose(),f.dispose()}}const Gd=new Vt,Wd=new ws(1,1),Xd=new Id(1),$d=new Md,qd=new Sg,Yd=new Pd,iu=[],nu=[],su=new Float32Array(16),ru=new Float32Array(9),au=new Float32Array(4);function Rs(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let r=iu[s];if(r===void 0&&(r=new Float32Array(s),iu[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function It(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Lt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Ha(n,e){let t=nu[e];t===void 0&&(t=new Int32Array(e),nu[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function Ux(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function Ox(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(It(t,e))return;n.uniform2fv(this.addr,e),Lt(t,e)}}function kx(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(It(t,e))return;n.uniform3fv(this.addr,e),Lt(t,e)}}function Bx(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(It(t,e))return;n.uniform4fv(this.addr,e),Lt(t,e)}}function zx(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(It(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Lt(t,e)}else{if(It(t,i))return;au.set(i),n.uniformMatrix2fv(this.addr,!1,au),Lt(t,i)}}function Hx(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(It(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Lt(t,e)}else{if(It(t,i))return;ru.set(i),n.uniformMatrix3fv(this.addr,!1,ru),Lt(t,i)}}function Vx(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(It(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Lt(t,e)}else{if(It(t,i))return;su.set(i),n.uniformMatrix4fv(this.addr,!1,su),Lt(t,i)}}function Gx(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function Wx(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(It(t,e))return;n.uniform2iv(this.addr,e),Lt(t,e)}}function Xx(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(It(t,e))return;n.uniform3iv(this.addr,e),Lt(t,e)}}function $x(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(It(t,e))return;n.uniform4iv(this.addr,e),Lt(t,e)}}function qx(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function Yx(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(It(t,e))return;n.uniform2uiv(this.addr,e),Lt(t,e)}}function Kx(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(It(t,e))return;n.uniform3uiv(this.addr,e),Lt(t,e)}}function jx(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(It(t,e))return;n.uniform4uiv(this.addr,e),Lt(t,e)}}function Va(n){return n.version===0&&(n.compareFunction=_d,n.needsUpdate=!0),n}function Zx(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?r=Va(Wd):r=Gd,t.setTexture2D(e||r,s)}function Jx(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||qd,s)}function Qx(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_CUBE_SHADOW?r=Va(Xd):r=Yd,t.setTextureCube(e||r,s)}function ey(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||$d,s)}function ty(n){switch(n){case 5126:return Ux;case 35664:return Ox;case 35665:return kx;case 35666:return Bx;case 35674:return zx;case 35675:return Hx;case 35676:return Vx;case 5124:case 35670:return Gx;case 35667:case 35671:return Wx;case 35668:case 35672:return Xx;case 35669:case 35673:return $x;case 5125:return qx;case 36294:return Yx;case 36295:return Kx;case 36296:return jx;case 35678:case 36198:case 36298:case 36306:case 35682:return Zx;case 35679:case 36299:case 36307:return Jx;case 35680:case 36300:case 36308:case 36293:return Qx;case 36289:case 36303:case 36311:case 36292:return ey}}function iy(n,e){n.uniform1fv(this.addr,e)}function ny(n,e){const t=Rs(e,this.size,2);n.uniform2fv(this.addr,t)}function sy(n,e){const t=Rs(e,this.size,3);n.uniform3fv(this.addr,t)}function ry(n,e){const t=Rs(e,this.size,4);n.uniform4fv(this.addr,t)}function ay(n,e){const t=Rs(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function oy(n,e){const t=Rs(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function ly(n,e){const t=Rs(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function cy(n,e){n.uniform1iv(this.addr,e)}function hy(n,e){n.uniform2iv(this.addr,e)}function uy(n,e){n.uniform3iv(this.addr,e)}function dy(n,e){n.uniform4iv(this.addr,e)}function fy(n,e){n.uniform1uiv(this.addr,e)}function py(n,e){n.uniform2uiv(this.addr,e)}function my(n,e){n.uniform3uiv(this.addr,e)}function gy(n,e){n.uniform4uiv(this.addr,e)}function vy(n,e,t){const i=this.cache,s=e.length,r=Ha(t,s);It(i,r)||(n.uniform1iv(this.addr,r),Lt(i,r));let a;this.type===n.SAMPLER_2D_SHADOW?a=Va(Wd):a=Gd;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function _y(n,e,t){const i=this.cache,s=e.length,r=Ha(t,s);It(i,r)||(n.uniform1iv(this.addr,r),Lt(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||qd,r[a])}function xy(n,e,t){const i=this.cache,s=e.length,r=Ha(t,s);It(i,r)||(n.uniform1iv(this.addr,r),Lt(i,r));let a;this.type===n.SAMPLER_CUBE_SHADOW?a=Va(Xd):a=Yd;for(let o=0;o!==s;++o)t.setTextureCube(e[o]||a,r[o])}function yy(n,e,t){const i=this.cache,s=e.length,r=Ha(t,s);It(i,r)||(n.uniform1iv(this.addr,r),Lt(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||$d,r[a])}function Sy(n){switch(n){case 5126:return iy;case 35664:return ny;case 35665:return sy;case 35666:return ry;case 35674:return ay;case 35675:return oy;case 35676:return ly;case 5124:case 35670:return cy;case 35667:case 35671:return hy;case 35668:case 35672:return uy;case 35669:case 35673:return dy;case 5125:return fy;case 36294:return py;case 36295:return my;case 36296:return gy;case 35678:case 36198:case 36298:case 36306:case 35682:return vy;case 35679:case 36299:case 36307:return _y;case 35680:case 36300:case 36308:case 36293:return xy;case 36289:case 36303:case 36311:case 36292:return yy}}class My{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=ty(t.type)}}class by{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Sy(t.type)}}class wy{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],i)}}}const ko=/(\w+)(\])?(\[|\.)?/g;function ou(n,e){n.seq.push(e),n.map[e.id]=e}function Ey(n,e,t){const i=n.name,s=i.length;for(ko.lastIndex=0;;){const r=ko.exec(i),a=ko.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){ou(t,c===void 0?new My(o,n,e):new by(o,n,e));break}else{let f=t.map[o];f===void 0&&(f=new wy(o),ou(t,f)),t=f}}}class fa{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);Ey(o,l,this)}const s=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&i.push(a)}return i}}function lu(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const Ty=37297;let Ay=0;function Cy(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const cu=new ke;function Ry(n){et._getMatrix(cu,et.workingColorSpace,n);const e=`mat3( ${cu.elements.map(t=>t.toFixed(4))} )`;switch(et.getTransfer(n)){case Aa:return[e,"LinearTransferOETF"];case lt:return[e,"sRGBTransferOETF"];default:return Pe("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function hu(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+Cy(n.getShaderSource(e),o)}else return r}function Py(n,e){const t=Ry(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( ${t[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}const Iy={[id]:"Linear",[nd]:"Reinhard",[sd]:"Cineon",[rd]:"ACESFilmic",[od]:"AgX",[ld]:"Neutral",[ad]:"Custom"};function Ly(n,e){const t=Iy[e];return t===void 0?(Pe("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const ea=new Y;function Ny(){et.getLuminanceCoefficients(ea);const n=ea.x.toFixed(4),e=ea.y.toFixed(4),t=ea.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Dy(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(js).join(`
`)}function Fy(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function Uy(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(e,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function js(n){return n!==""}function uu(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,e.numLightProbeGrids)}function du(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Oy=/^[ \t]*#include +<([\w\d./]+)>/gm;function Vl(n){return n.replace(Oy,ky)}function ky(n,e){const t=We[e];if(t===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">");return Vl(t)}const By=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function fu(n){return n.replace(By,zy)}function zy(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function pu(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const Hy={[la]:"SHADOWMAP_TYPE_PCF",[Ys]:"SHADOWMAP_TYPE_VSM"};function Vy(n){return Hy[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Gy={[ar]:"ENVMAP_MODE_REFRACTION"};function Wy(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":Gy[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Xy={[td]:"ENVMAP_BLENDING_MULTIPLY",[Dm]:"ENVMAP_BLENDING_MIX",[Fm]:"ENVMAP_BLENDING_ADD"};function $y(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":Xy[n.combine]||"ENVMAP_BLENDING_NONE"}function qy(n,e,t,i){const s=n.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Vy(t),c=t.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",h=Wy(t),f=$y(t),d=Dy(t),u=Fy(r),p=s.createProgram();let _,m,g=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(_=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,u].filter(js).join(`
`),_.length>0&&(_+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,u].filter(js).join(`
`),m.length>0&&(m+=`
`)):(_=[pu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,u,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+t.diffuseRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(js).join(`
`),m=[pu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,u,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+f:"",t.envMapPMREM?"#define ENVMAP_MAX_LOD "+t.envMapMaxLod+".0":"",t.envMapPMREM?"#define ENVMAP_SIZE "+t.envMapSize+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==sn?"#define TONE_MAPPING":"",t.toneMapping!==sn?We.tonemapping_pars_fragment:"",t.toneMapping!==sn?Ly("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",We.colorspace_pars_fragment,Py("linearToOutputTexel",t.outputColorSpace),Ny(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(js).join(`
`)),a=Vl(a),a=uu(a,t),a=du(a,t),o=Vl(o),o=uu(o,t),o=du(o,t),a=fu(a),o=fu(o),t.isRawShaderMaterial!==!0&&(g=`#version 300 es
`,_=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+_,m=["#define varying in",t.glslVersion===Ca?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ca?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const y=g+_+a,b=g+m+o,A=lu(s,s.VERTEX_SHADER,y),x=lu(s,s.FRAGMENT_SHADER,b);s.attachShader(p,A),s.attachShader(p,x),t.index0AttributeName!==void 0?s.bindAttribLocation(p,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(p,0,"position"),s.linkProgram(p);function M(P){if(n.debug.checkShaderErrors){const C=s.getProgramInfoLog(p)||"",F=s.getShaderInfoLog(A)||"",I=s.getShaderInfoLog(x)||"",R=C.trim(),O=F.trim(),k=I.trim();let H=!0,L=!0;if(s.getProgramParameter(p,s.LINK_STATUS)===!1)if(H=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,p,A,x);else{const N=hu(s,A,"vertex"),W=hu(s,x,"fragment");Ue("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(p,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+R+`
`+N+`
`+W)}else R!==""?Pe("WebGLProgram: Program Info Log:",R):(O===""||k==="")&&(L=!1);L&&(P.diagnostics={runnable:H,programLog:R,vertexShader:{log:O,prefix:_},fragmentShader:{log:k,prefix:m}})}s.deleteShader(A),s.deleteShader(x),v=new fa(s,p),S=Uy(s,p)}let v;this.getUniforms=function(){return v===void 0&&M(this),v};let S;this.getAttributes=function(){return S===void 0&&M(this),S};let E=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=s.getProgramParameter(p,Ty)),E},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(p),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Ay++,this.cacheKey=e,this.usedTimes=1,this.program=p,this.vertexShader=A,this.fragmentShader=x,this}let Yy=0;class Ky{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){const s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new jy(e),t.set(e,i)),i}}class jy{constructor(e){this.id=Yy++,this.code=e,this.usedTimes=0}}function Zy(n){return n===Hn||n===ba||n===wa}function Jy(n,e,t,i,s,r){const a=new bd,o=new Ky,l=new Set,c=[],h=new Map,f=i.logarithmicDepthBuffer,d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function u(v){return l.add(v),v===0?"uv":`uv${v}`}function p(v,S,E,P,C,F){const I=P.fog,R=C.geometry,O=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?P.environment:null,k=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,H=e.get(v.envMap||O,k),L=d[v.type];let N=i.precision;v.precision!==null&&(N=i.getMaxPrecision(v.precision),N!==v.precision&&Pe("WebGLProgram.getParameters:",v.precision,"not supported, using",N,"instead."));const W=R.morphAttributes.position||R.morphAttributes.normal||R.morphAttributes.color,B=W!==void 0?W.length:0;let j=0;R.morphAttributes.position!==void 0&&(j=1),R.morphAttributes.normal!==void 0&&(j=2),R.morphAttributes.color!==void 0&&(j=3);let re,V,K,ie;if(L){const ye=Ui[L];re=ye.vertexShader,V=ye.fragmentShader}else{re=v.vertexShader,V=v.fragmentShader;const ye=o.getVertexShaderStage(v),ot=o.getFragmentShaderStage(v);o.update(v,ye,ot),K=ye.id,ie=ot.id}const ae=n.getRenderTarget(),se=n.state.buffers.depth.getReversed(),be=C.isInstancedMesh===!0,rt=C.isBatchedMesh===!0,Ee=!!v.map,He=!!v.matcap,Xe=!!H,Te=Xe&&H.isPMREMTexture===!0,it=!!v.aoMap,Mt=!!v.lightMap,Bt=!!v.bumpMap&&v.wireframe===!1,ft=!!v.normalMap,ve=!!v.displacementMap,Ie=!!v.emissiveMap,Ne=!!v.metalnessMap,bt=!!v.roughnessMap,ei=v.anisotropy>0,G=v.clearcoat>0,li=v.diffuseRoughness>0,xt=v.dispersion>0,yt=v.retroreflectivity>0,_e=v.iridescence>0,Rt=v.sheen>0,Fe=v.transmission>0,Oe=ei&&!!v.anisotropyMap,D=G&&!!v.clearcoatMap,w=G&&!!v.clearcoatNormalMap,$=G&&!!v.clearcoatRoughnessMap,oe=li&&!!v.diffuseRoughnessMap,ne=_e&&!!v.iridescenceMap,he=_e&&!!v.iridescenceThicknessMap,me=Rt&&!!v.sheenColorMap,Q=Rt&&!!v.sheenRoughnessMap,ee=!!v.specularMap,de=!!v.specularColorMap,U=!!v.specularIntensityMap,te=Fe&&!!v.transmissionMap,J=Fe&&!!v.thicknessMap,fe=!!v.gradientMap,ce=!!v.alphaMap,ue=v.alphaTest>0,Le=!!v.alphaHash,Ge=!!v.extensions;let le=sn;v.toneMapped&&(ae===null||ae.isXRRenderTarget===!0)&&(le=n.toneMapping);const De=Te?H.isCompressedCubeTexture?H.image[0].mipmaps:H.mipmaps:null,Ve={shaderID:L,shaderType:v.type,shaderName:v.name,vertexShader:re,fragmentShader:V,defines:v.defines,customVertexShaderID:K,customFragmentShaderID:ie,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:N,batching:rt,batchingColor:rt&&C._colorsTexture!==null,instancing:be,instancingColor:be&&C.instanceColor!==null,instancingMorph:be&&C.morphTexture!==null,outputColorSpace:ae===null?n.outputColorSpace:ae.isXRRenderTarget===!0?ae.texture.colorSpace:et.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:Ee,matcap:He,envMap:Xe,envMapMode:Xe&&H.mapping,envMapPMREM:Te,envMapMaxLod:Te?De.length-1:null,envMapSize:Te?De[0].width:null,aoMap:it,lightMap:Mt,bumpMap:Bt,normalMap:ft,displacementMap:ve,emissiveMap:Ie,normalMapObjectSpace:ft&&v.normalMapType===Gm,normalMapTangentSpace:ft&&v.normalMapType===kl,packedNormalMap:ft&&v.normalMapType===kl&&Zy(v.normalMap.format),metalnessMap:Ne,roughnessMap:bt,anisotropy:ei,anisotropyMap:Oe,clearcoat:G,clearcoatMap:D,clearcoatNormalMap:w,clearcoatRoughnessMap:$,diffuseRoughness:li,diffuseRoughnessMap:oe,dispersion:xt,retroreflection:yt,iridescence:_e,iridescenceMap:ne,iridescenceThicknessMap:he,sheen:Rt,sheenColorMap:me,sheenRoughnessMap:Q,specularMap:ee,specularColorMap:de,specularIntensityMap:U,transmission:Fe,transmissionMap:te,thicknessMap:J,gradientMap:fe,opaque:v.transparent===!1&&v.blending===tr&&v.alphaToCoverage===!1,alphaMap:ce,alphaTest:ue,alphaHash:Le,combine:v.combine,mapUv:Ee&&u(v.map.channel),aoMapUv:it&&u(v.aoMap.channel),lightMapUv:Mt&&u(v.lightMap.channel),bumpMapUv:Bt&&u(v.bumpMap.channel),normalMapUv:ft&&u(v.normalMap.channel),displacementMapUv:ve&&u(v.displacementMap.channel),emissiveMapUv:Ie&&u(v.emissiveMap.channel),metalnessMapUv:Ne&&u(v.metalnessMap.channel),roughnessMapUv:bt&&u(v.roughnessMap.channel),anisotropyMapUv:Oe&&u(v.anisotropyMap.channel),clearcoatMapUv:D&&u(v.clearcoatMap.channel),clearcoatNormalMapUv:w&&u(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:$&&u(v.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:oe&&u(v.diffuseRoughnessMap.channel),iridescenceMapUv:ne&&u(v.iridescenceMap.channel),iridescenceThicknessMapUv:he&&u(v.iridescenceThicknessMap.channel),sheenColorMapUv:me&&u(v.sheenColorMap.channel),sheenRoughnessMapUv:Q&&u(v.sheenRoughnessMap.channel),specularMapUv:ee&&u(v.specularMap.channel),specularColorMapUv:de&&u(v.specularColorMap.channel),specularIntensityMapUv:U&&u(v.specularIntensityMap.channel),transmissionMapUv:te&&u(v.transmissionMap.channel),thicknessMapUv:J&&u(v.thicknessMap.channel),alphaMapUv:ce&&u(v.alphaMap.channel),vertexTangents:!!R.attributes.tangent&&(ft||ei),vertexNormals:!!R.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!R.attributes.color&&R.attributes.color.itemSize===4,pointsUvs:C.isPoints===!0&&!!R.attributes.uv&&(Ee||ce),fog:!!I,useFog:v.fog===!0,fogExp2:!!I&&I.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||R.attributes.normal===void 0&&ft===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:se,skinning:C.isSkinnedMesh===!0,hasPositionAttribute:R.attributes.position!==void 0,morphTargets:R.morphAttributes.position!==void 0,morphNormals:R.morphAttributes.normal!==void 0,morphColors:R.morphAttributes.color!==void 0,morphTargetsCount:B,morphTextureStride:j,numSunLights:S.sun.length,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numSunLightShadows:S.sunShadowMap.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numLightProbeGrids:F.filter(ye=>ye.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:v.dithering,shadowMapEnabled:n.shadowMap.enabled&&E.length>0,shadowMapType:n.shadowMap.type,toneMapping:le,decodeVideoTexture:Ee&&v.map.isVideoTexture===!0&&et.getTransfer(v.map.colorSpace)===lt,decodeVideoTextureEmissive:Ie&&v.emissiveMap.isVideoTexture===!0&&et.getTransfer(v.emissiveMap.colorSpace)===lt,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Ri,flipSided:v.side===ii,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:Ge&&v.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ge&&v.extensions.multiDraw===!0||rt)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return Ve.vertexUv1s=l.has(1),Ve.vertexUv2s=l.has(2),Ve.vertexUv3s=l.has(3),l.clear(),Ve}function _(v){const S=[];if(v.shaderID?S.push(v.shaderID):(S.push(v.customVertexShaderID),S.push(v.customFragmentShaderID)),v.defines!==void 0)for(const E in v.defines)S.push(E),S.push(v.defines[E]);return v.isRawShaderMaterial===!1&&(m(S,v),g(S,v),S.push(n.outputColorSpace)),S.push(v.customProgramCacheKey),S.join()}function m(v,S){v.push(S.precision),v.push(S.outputColorSpace),v.push(S.envMapMode),v.push(S.envMapPMREM),v.push(S.envMapMaxLod),v.push(S.envMapSize),v.push(S.mapUv),v.push(S.alphaMapUv),v.push(S.lightMapUv),v.push(S.aoMapUv),v.push(S.bumpMapUv),v.push(S.normalMapUv),v.push(S.displacementMapUv),v.push(S.emissiveMapUv),v.push(S.metalnessMapUv),v.push(S.roughnessMapUv),v.push(S.anisotropyMapUv),v.push(S.clearcoatMapUv),v.push(S.clearcoatNormalMapUv),v.push(S.clearcoatRoughnessMapUv),v.push(S.diffuseRoughnessMapUv),v.push(S.iridescenceMapUv),v.push(S.iridescenceThicknessMapUv),v.push(S.sheenColorMapUv),v.push(S.sheenRoughnessMapUv),v.push(S.specularMapUv),v.push(S.specularColorMapUv),v.push(S.specularIntensityMapUv),v.push(S.transmissionMapUv),v.push(S.thicknessMapUv),v.push(S.combine),v.push(S.fogExp2),v.push(S.sizeAttenuation),v.push(S.morphTargetsCount),v.push(S.numSunLights),v.push(S.numDirLights),v.push(S.numPointLights),v.push(S.numSpotLights),v.push(S.numSpotLightMaps),v.push(S.numHemiLights),v.push(S.numRectAreaLights),v.push(S.numSunLightShadows),v.push(S.numDirLightShadows),v.push(S.numPointLightShadows),v.push(S.numSpotLightShadows),v.push(S.numSpotLightShadowsWithMaps),v.push(S.numLightProbes),v.push(S.numLightProbeGrids),v.push(S.shadowMapType),v.push(S.toneMapping),v.push(S.numClippingPlanes),v.push(S.numClipIntersection),v.push(S.depthPacking)}function g(v,S){a.disableAll(),S.instancing&&a.enable(0),S.instancingColor&&a.enable(1),S.instancingMorph&&a.enable(2),S.matcap&&a.enable(3),S.envMap&&a.enable(4),S.normalMapObjectSpace&&a.enable(5),S.normalMapTangentSpace&&a.enable(6),S.clearcoat&&a.enable(7),S.iridescence&&a.enable(8),S.alphaTest&&a.enable(9),S.vertexColors&&a.enable(10),S.vertexAlphas&&a.enable(11),S.vertexUv1s&&a.enable(12),S.vertexUv2s&&a.enable(13),S.vertexUv3s&&a.enable(14),S.vertexTangents&&a.enable(15),S.anisotropy&&a.enable(16),S.alphaHash&&a.enable(17),S.batching&&a.enable(18),S.dispersion&&a.enable(19),S.retroreflection&&a.enable(24),S.diffuseRoughness&&a.enable(25),S.batchingColor&&a.enable(20),S.gradientMap&&a.enable(21),S.packedNormalMap&&a.enable(22),S.vertexNormals&&a.enable(23),v.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.reversedDepthBuffer&&a.enable(4),S.skinning&&a.enable(5),S.morphTargets&&a.enable(6),S.morphNormals&&a.enable(7),S.morphColors&&a.enable(8),S.premultipliedAlpha&&a.enable(9),S.shadowMapEnabled&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),S.decodeVideoTextureEmissive&&a.enable(20),S.alphaToCoverage&&a.enable(21),S.numLightProbeGrids>0&&a.enable(22),S.hasPositionAttribute&&a.enable(23),v.push(a.mask)}function y(v){const S=d[v.type];let E;if(S){const P=Ui[S];E=Kg.clone(P.uniforms)}else E=v.uniforms;return E}function b(v,S){let E=h.get(S);return E!==void 0?++E.usedTimes:(E=new qy(n,S,v,s),c.push(E),h.set(S,E)),E}function A(v){if(--v.usedTimes===0){const S=c.indexOf(v);c[S]=c[c.length-1],c.pop(),h.delete(v.cacheKey),v.destroy()}}function x(v){o.remove(v)}function M(){o.dispose()}return{getParameters:p,getProgramCacheKey:_,getUniforms:y,acquireProgram:b,releaseProgram:A,releaseShaderCache:x,programs:c,dispose:M}}function Qy(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,l){n.get(a)[o]=l}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function eS(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function mu(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function gu(){const n=[];let e=0;const t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(d){let u=0;return d.isInstancedMesh&&(u+=2),d.isSkinnedMesh&&(u+=1),u}function o(d,u,p,_,m,g){let y=n[e];return y===void 0?(y={id:d.id,object:d,geometry:u,material:p,materialVariant:a(d),groupOrder:_,renderOrder:d.renderOrder,z:m,group:g},n[e]=y):(y.id=d.id,y.object=d,y.geometry=u,y.material=p,y.materialVariant=a(d),y.groupOrder=_,y.renderOrder=d.renderOrder,y.z=m,y.group=g),e++,y}function l(d,u,p,_,m,g,y){y.reversedDepth===!0&&(m=-m);const b=o(d,u,p,_,m,g);p.transmission>0?i.push(b):p.transparent===!0?s.push(b):t.push(b)}function c(d,u,p,_,m,g){const y=o(d,u,p,_,m,g);p.transmission>0?i.unshift(y):p.transparent===!0?s.unshift(y):t.unshift(y)}function h(d,u){t.length>1&&t.sort(d||eS),i.length>1&&i.sort(u||mu),s.length>1&&s.sort(u||mu)}function f(){for(let d=e,u=n.length;d<u;d++){const p=n[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:l,unshift:c,finish:f,sort:h}}function tS(){let n=new WeakMap;function e(i,s){const r=n.get(i);let a;return r===void 0?(a=new gu,n.set(i,[a])):s>=r.length?(a=new gu,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function iS(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new Y,color:new $e};break;case"SpotLight":t={position:new Y,direction:new Y,color:new $e,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new Y,color:new $e,distance:0,decay:0};break;case"HemisphereLight":t={direction:new Y,skyColor:new $e,groundColor:new $e};break;case"RectAreaLight":t={color:new $e,position:new Y,halfWidth:new Y,halfHeight:new Y};break}return n[e.id]=t,t}}}function nS(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let sS=0;function rS(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function aS(n){const e=new iS,t=nS(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new Y);const s=new Y,r=new je,a=new je;function o(c){let h=0,f=0,d=0;for(let F=0;F<9;F++)i.probe[F].set(0,0,0);let u=0,p=0,_=0,m=0,g=0,y=0,b=0,A=0,x=0,M=0,v=0,S=0,E=0,P=0;c.sort(rS);for(let F=0,I=c.length;F<I;F++){const R=c[F],O=R.color,k=R.intensity,H=R.distance;let L=null;if(R.shadow&&R.shadow.map&&(R.shadow.map.texture.format===Hn?L=R.shadow.map.texture:L=R.shadow.map.depthTexture||R.shadow.map.texture),R.isAmbientLight)h+=O.r*k,f+=O.g*k,d+=O.b*k;else if(R.isLightProbe){for(let N=0;N<9;N++)i.probe[N].addScaledVector(R.sh.coefficients[N],k);P++}else if(R.isSunLight){const N=e.get(R);if(N.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const W=R.shadow,B=t.get(R);B.shadowIntensity=W.intensity,B.shadowBias=W.bias,B.shadowNormalBias=W.normalBias,B.shadowRadius=W.radius,B.shadowMapSize.copy(W.mapSize).multiply(W.getFrameExtents()),i.sunShadow[p]=B,i.sunShadowMap[p]=L;const j=W.getViewportCount();for(let re=0;re<j;re++)i.sunShadowMatrix[_+re]=W.getMatrix(re),i.sunShadowCascade[_+re]=W._cascadeData[re];_+=j,p++}i.sun[u]=N,u++}else if(R.isDirectionalLight){const N=e.get(R);if(N.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const W=R.shadow,B=t.get(R);B.shadowIntensity=W.intensity,B.shadowBias=W.bias,B.shadowNormalBias=W.normalBias,B.shadowRadius=W.radius,B.shadowMapSize=W.mapSize,i.directionalShadow[m]=B,i.directionalShadowMap[m]=L,i.directionalShadowMatrix[m]=R.shadow.matrix,x++}i.directional[m]=N,m++}else if(R.isSpotLight){const N=e.get(R);N.position.setFromMatrixPosition(R.matrixWorld),N.color.copy(O).multiplyScalar(k),N.distance=H,N.coneCos=Math.cos(R.angle),N.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),N.decay=R.decay,i.spot[y]=N;const W=R.shadow;if(R.map&&(i.spotLightMap[S]=R.map,S++,W.updateMatrices(R),R.castShadow&&E++),i.spotLightMatrix[y]=W.matrix,R.castShadow){const B=t.get(R);B.shadowIntensity=W.intensity,B.shadowBias=W.bias,B.shadowNormalBias=W.normalBias,B.shadowRadius=W.radius,B.shadowMapSize=W.mapSize,i.spotShadow[y]=B,i.spotShadowMap[y]=L,v++}y++}else if(R.isRectAreaLight){const N=e.get(R);N.color.copy(O).multiplyScalar(k),N.halfWidth.set(R.width*.5,0,0),N.halfHeight.set(0,R.height*.5,0),i.rectArea[b]=N,b++}else if(R.isPointLight){const N=e.get(R);if(N.color.copy(R.color).multiplyScalar(R.intensity),N.distance=R.distance,N.decay=R.decay,R.castShadow){const W=R.shadow,B=t.get(R);B.shadowIntensity=W.intensity,B.shadowBias=W.bias,B.shadowNormalBias=W.normalBias,B.shadowRadius=W.radius,B.shadowMapSize=W.mapSize,B.shadowCameraNear=W.camera.near,B.shadowCameraFar=W.camera.far,i.pointShadow[g]=B,i.pointShadowMap[g]=L,i.pointShadowMatrix[g]=R.shadow.matrix,M++}i.point[g]=N,g++}else if(R.isHemisphereLight){const N=e.get(R);N.skyColor.copy(R.color).multiplyScalar(k),N.groundColor.copy(R.groundColor).multiplyScalar(k),i.hemi[A]=N,A++}}b>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Se.LTC_FLOAT_1,i.rectAreaLTC2=Se.LTC_FLOAT_2):(i.rectAreaLTC1=Se.LTC_HALF_1,i.rectAreaLTC2=Se.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=f,i.ambient[2]=d;const C=i.hash;(C.sunLength!==u||C.directionalLength!==m||C.pointLength!==g||C.spotLength!==y||C.rectAreaLength!==b||C.hemiLength!==A||C.numSunShadows!==p||C.numDirectionalShadows!==x||C.numPointShadows!==M||C.numSpotShadows!==v||C.numSpotMaps!==S||C.numLightProbes!==P)&&(i.sun.length=u,i.directional.length=m,i.spot.length=y,i.rectArea.length=b,i.point.length=g,i.hemi.length=A,i.sunShadow.length=p,i.sunShadowMap.length=p,i.sunShadowMatrix.length=_,i.sunShadowCascade.length=_,i.directionalShadow.length=x,i.directionalShadowMap.length=x,i.directionalShadowMatrix.length=x,i.pointShadow.length=M,i.pointShadowMap.length=M,i.pointShadowMatrix.length=M,i.spotShadow.length=v,i.spotShadowMap.length=v,i.spotLightMatrix.length=v+S-E,i.spotLightMap.length=S,i.numSpotLightShadowsWithMaps=E,i.numLightProbes=P,C.sunLength=u,C.directionalLength=m,C.pointLength=g,C.spotLength=y,C.rectAreaLength=b,C.hemiLength=A,C.numSunShadows=p,C.numDirectionalShadows=x,C.numPointShadows=M,C.numSpotShadows=v,C.numSpotMaps=S,C.numLightProbes=P,i.version=sS++)}function l(c,h){let f=0,d=0,u=0,p=0,_=0,m=0;const g=h.matrixWorldInverse;for(let y=0,b=c.length;y<b;y++){const A=c[y];if(A.isSunLight){const x=i.sun[f];x.direction.setFromMatrixPosition(A.matrixWorld),x.direction.transformDirection(g),f++}else if(A.isDirectionalLight){const x=i.directional[d];x.direction.setFromMatrixPosition(A.matrixWorld),s.setFromMatrixPosition(A.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(g),d++}else if(A.isSpotLight){const x=i.spot[p];x.position.setFromMatrixPosition(A.matrixWorld),x.position.applyMatrix4(g),x.direction.setFromMatrixPosition(A.matrixWorld),s.setFromMatrixPosition(A.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(g),p++}else if(A.isRectAreaLight){const x=i.rectArea[_];x.position.setFromMatrixPosition(A.matrixWorld),x.position.applyMatrix4(g),a.identity(),r.copy(A.matrixWorld),r.premultiply(g),a.extractRotation(r),x.halfWidth.set(A.width*.5,0,0),x.halfHeight.set(0,A.height*.5,0),x.halfWidth.applyMatrix4(a),x.halfHeight.applyMatrix4(a),_++}else if(A.isPointLight){const x=i.point[u];x.position.setFromMatrixPosition(A.matrixWorld),x.position.applyMatrix4(g),u++}else if(A.isHemisphereLight){const x=i.hemi[m];x.direction.setFromMatrixPosition(A.matrixWorld),x.direction.transformDirection(g),m++}}}return{setup:o,setupView:l,state:i}}function vu(n){const e=new aS(n),t=[],i=[],s=[];function r(f){h.camera=f,t.length=0,i.length=0,s.length=0}function a(f){f.isLightProbeGrid?s.push(f):t.push(f)}function o(f){i.push(f)}function l(){e.setup(t),s.sort((f,d)=>f.priority-d.priority||f.id-d.id)}function c(f){e.setupView(t,f)}const h={lightsArray:t,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:h,setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function oS(n){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new vu(n),e.set(s,[o])):r>=a.length?(o=new vu(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const lS=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,cS=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,hS=[new Y(1,0,0),new Y(-1,0,0),new Y(0,1,0),new Y(0,-1,0),new Y(0,0,1),new Y(0,0,-1)],uS=[new Y(0,-1,0),new Y(0,-1,0),new Y(0,0,1),new Y(0,0,-1),new Y(0,-1,0),new Y(0,-1,0)],_u=new je,$s=new Y,Bo=new Y;function dS(n,e,t){let i=new ur;const s=new tt,r=new tt,a=new ut,o=new Qg,l=new e0,c={},h=t.maxTextureSize,f={[zn]:ii,[ii]:zn,[Ri]:Ri},d=new Vn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new tt},radius:{value:4}},vertexShader:lS,fragmentShader:cS}),u=d.clone();u.defines.HORIZONTAL_PASS=1;const p=new Vi;p.setAttribute("position",new an(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new _i(p,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=la;let g=this.type;this.render=function(M,v,S){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||M.length===0)return;this.type===_m&&(Pe("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=la);const E=n.getRenderTarget(),P=n.getActiveCubeFace(),C=n.getActiveMipmapLevel(),F=n.state;F.setBlending(vs),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const I=g!==this.type;I&&v.traverse(function(R){R.material&&(Array.isArray(R.material)?R.material.forEach(O=>O.needsUpdate=!0):R.material.needsUpdate=!0)});for(let R=0,O=M.length;R<O;R++){const k=M[R],H=k.shadow;if(H===void 0){Pe("WebGLShadowMap:",k,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;s.copy(H.mapSize);const L=H.getFrameExtents();s.multiply(L),r.copy(H.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/L.x),s.x=r.x*L.x,H.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/L.y),s.y=r.y*L.y,H.mapSize.y=r.y));const N=n.state.buffers.depth.getReversed();if(H.camera._reversedDepth=N,H.map===null||I===!0){if(H.map!==null&&(H.map.depthTexture!==null&&(H.map.depthTexture.dispose(),H.map.depthTexture=null),H.map.dispose()),this.type===Ys){if(k.isPointLight){Pe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}H.map=new ki(s.x,s.y,{format:Hn,type:zi,minFilter:kt,magFilter:kt,generateMipmaps:!1}),H.map.texture.name=k.name+".shadowMap",H.map.depthTexture=new ws(s.x,s.y,gi),H.map.depthTexture.name=k.name+".shadowMapDepth",H.map.depthTexture.format=En,H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Pt,H.map.depthTexture.magFilter=Pt}else k.isPointLight?(H.map=new mc(s.x),H.map.depthTexture=new Id(s.x,Bi)):(H.map=new ki(s.x,s.y),H.map.depthTexture=new ws(s.x,s.y,Bi)),H.map.depthTexture.name=k.name+".shadowMap",H.map.depthTexture.format=En,this.type===la?(H.map.depthTexture.compareFunction=N?vd:gd,H.map.depthTexture.minFilter=kt,H.map.depthTexture.magFilter=kt):(H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Pt,H.map.depthTexture.magFilter=Pt);H.camera.updateProjectionMatrix()}H.map.isWebGLCubeRenderTarget!==!0&&(H.map.width!==s.x||H.map.height!==s.y)&&H.map.setSize(s.x,s.y);const W=H.map.isWebGLCubeRenderTarget?6:H.getViewportCount();k.isPointLight!==!0&&H.updateMatrices(k,S);const B=(H.camera.layers.mask&4294967294)!==0?H.camera.layers:S.layers;for(let j=0;j<W;j++){const re=H.getCamera(j);if(k.isPointLight){const V=H.camera,K=H.matrix,ie=k.distance||V.far;ie!==V.far&&(V.far=ie,V.updateProjectionMatrix()),$s.setFromMatrixPosition(k.matrixWorld),V.position.copy($s),Bo.copy(V.position),Bo.add(hS[j]),V.up.copy(uS[j]),V.lookAt(Bo),V.updateMatrixWorld(),K.makeTranslation(-$s.x,-$s.y,-$s.z),_u.multiplyMatrices(V.projectionMatrix,V.matrixWorldInverse),H._frustum.setFromProjectionMatrix(_u,V.coordinateSystem,V.reversedDepth)}if(H.map.isWebGLCubeRenderTarget)n.setRenderTarget(H.map,j),n.clear();else{j===0&&(n.setRenderTarget(H.map),n.clear());const V=H.getViewport(j);a.set(r.x*V.x,r.y*V.y,r.x*V.z,r.y*V.w),F.viewport(a)}i=H.getFrustum(j),A(v,S,re,k,B,this.type)}H.isPointLightShadow!==!0&&this.type===Ys&&y(H,S),H.needsUpdate=!1}g=this.type,m.needsUpdate=!1,n.setRenderTarget(E,P,C)};function y(M,v){const S=e.update(_);d.defines.VSM_SAMPLES!==M.blurSamples&&(d.defines.VSM_SAMPLES=M.blurSamples,u.defines.VSM_SAMPLES=M.blurSamples,d.needsUpdate=!0,u.needsUpdate=!0),M.mapPass===null?M.mapPass=new ki(s.x,s.y,{format:Hn,type:zi}):(M.mapPass.width!==M.map.width||M.mapPass.height!==M.map.height)&&M.mapPass.setSize(M.map.width,M.map.height),d.uniforms.shadow_pass.value=M.map.depthTexture,d.uniforms.resolution.value.set(M.map.width,M.map.height),d.uniforms.radius.value=M.radius,n.setRenderTarget(M.mapPass),n.clear(),n.renderBufferDirect(v,null,S,d,_,null),u.uniforms.shadow_pass.value=M.mapPass.texture,u.uniforms.resolution.value.set(M.map.width,M.map.height),u.uniforms.radius.value=M.radius,n.setRenderTarget(M.map),n.clear(),n.renderBufferDirect(v,null,S,u,_,null)}function b(M,v,S,E){let P=null;const C=S.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(C!==void 0)P=C;else if(P=S.isPointLight===!0?l:o,n.localClippingEnabled&&v.clipShadows===!0&&Array.isArray(v.clippingPlanes)&&v.clippingPlanes.length!==0||v.displacementMap&&v.displacementScale!==0||v.alphaMap&&v.alphaTest>0||v.map&&v.alphaTest>0||v.alphaToCoverage===!0){const F=P.uuid,I=v.uuid;let R=c[F];R===void 0&&(R={},c[F]=R);let O=R[I];O===void 0&&(O=P.clone(),R[I]=O,v.addEventListener("dispose",x)),P=O}if(P.visible=v.visible,P.wireframe=v.wireframe,E===Ys?P.side=v.shadowSide!==null?v.shadowSide:v.side:P.side=v.shadowSide!==null?v.shadowSide:f[v.side],P.alphaMap=v.alphaMap,P.alphaTest=v.alphaToCoverage===!0?.5:v.alphaTest,P.map=v.map,P.clipShadows=v.clipShadows,P.clippingPlanes=v.clippingPlanes,P.clipIntersection=v.clipIntersection,P.displacementMap=v.displacementMap,P.displacementScale=v.displacementScale,P.displacementBias=v.displacementBias,P.wireframeLinewidth=v.wireframeLinewidth,P.linewidth=v.linewidth,S.isPointLight===!0&&P.isMeshDistanceMaterial===!0){const F=n.properties.get(P);F.light=S}return P}function A(M,v,S,E,P,C){if(M.visible===!1)return;if(M.layers.test(P)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&C===Ys)&&(!M.frustumCulled||M.intersectsFrustum(i))){M.modelViewMatrix.multiplyMatrices(S.matrixWorldInverse,M.matrixWorld);const R=e.update(M),O=M.material;if(Array.isArray(O)){const k=R.groups;for(let H=0,L=k.length;H<L;H++){const N=k[H],W=O[N.materialIndex];if(W&&W.visible){const B=b(M,W,E,C);M.onBeforeShadow(n,M,v,S,R,B,N),n.renderBufferDirect(S,null,R,B,M,N),M.onAfterShadow(n,M,v,S,R,B,N)}}}else if(O.visible){const k=b(M,O,E,C);M.onBeforeShadow(n,M,v,S,R,k,null),n.renderBufferDirect(S,null,R,k,M,null),M.onAfterShadow(n,M,v,S,R,k,null)}}const I=M.children;for(let R=0,O=I.length;R<O;R++)A(I[R],v,S,E,P,C)}function x(M){M.target.removeEventListener("dispose",x);for(const S in c){const E=c[S],P=M.target.uuid;P in E&&(E[P].dispose(),delete E[P])}}}function fS(n,e){function t(){let U=!1;const te=new ut;let J=null;const fe=new ut(0,0,0,0);return{setMask:function(ce){J!==ce&&!U&&(n.colorMask(ce,ce,ce,ce),J=ce)},setLocked:function(ce){U=ce},setClear:function(ce,ue,Le,Ge,le){le===!0&&(ce*=Ge,ue*=Ge,Le*=Ge),te.set(ce,ue,Le,Ge),fe.equals(te)===!1&&(n.clearColor(ce,ue,Le,Ge),fe.copy(te))},reset:function(){U=!1,J=null,fe.set(-1,0,0,0)}}}function i(){let U=!1,te=!1,J=null,fe=null,ce=null;return{setReversed:function(ue){if(te!==ue){const Le=e.get("EXT_clip_control");ue?Le.clipControlEXT(Le.LOWER_LEFT_EXT,Le.ZERO_TO_ONE_EXT):Le.clipControlEXT(Le.LOWER_LEFT_EXT,Le.NEGATIVE_ONE_TO_ONE_EXT),te=ue;const Ge=ce;ce=null,this.setClear(Ge)}},getReversed:function(){return te},setTest:function(ue){ue?se(n.DEPTH_TEST):be(n.DEPTH_TEST)},setMask:function(ue){J!==ue&&!U&&(n.depthMask(ue),J=ue)},setFunc:function(ue){if(te&&(ue=eg[ue]),fe!==ue){switch(ue){case Jo:n.depthFunc(n.NEVER);break;case Qo:n.depthFunc(n.ALWAYS);break;case el:n.depthFunc(n.LESS);break;case rr:n.depthFunc(n.LEQUAL);break;case tl:n.depthFunc(n.EQUAL);break;case il:n.depthFunc(n.GEQUAL);break;case nl:n.depthFunc(n.GREATER);break;case sl:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}fe=ue}},setLocked:function(ue){U=ue},setClear:function(ue){ce!==ue&&(ce=ue,te&&(ue=1-ue),n.clearDepth(ue))},reset:function(){U=!1,J=null,fe=null,ce=null,te=!1}}}function s(){let U=!1,te=null,J=null,fe=null,ce=null,ue=null,Le=null,Ge=null,le=null;return{setTest:function(De){U||(De?se(n.STENCIL_TEST):be(n.STENCIL_TEST))},setMask:function(De){te!==De&&!U&&(n.stencilMask(De),te=De)},setFunc:function(De,Ve,ye){(J!==De||fe!==Ve||ce!==ye)&&(n.stencilFunc(De,Ve,ye),J=De,fe=Ve,ce=ye)},setOp:function(De,Ve,ye){(ue!==De||Le!==Ve||Ge!==ye)&&(n.stencilOp(De,Ve,ye),ue=De,Le=Ve,Ge=ye)},setLocked:function(De){U=De},setClear:function(De){le!==De&&(n.clearStencil(De),le=De)},reset:function(){U=!1,te=null,J=null,fe=null,ce=null,ue=null,Le=null,Ge=null,le=null}}}const r=new t,a=new i,o=new s;let l={};const c=new WeakMap;let h={},f={},d={},u=new WeakMap,p=[],_=null,m=!1,g=null,y=null,b=null,A=null,x=null,M=null,v=null,S=new $e(0,0,0),E=0,P=!1,C=null,F=null,I=null,R=null,O=null;const k=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,L=0;const N=n.getParameter(n.VERSION);N.indexOf("WebGL")!==-1?(L=parseFloat(/^WebGL (\d)/.exec(N)[1]),H=L>=1):N.indexOf("OpenGL ES")!==-1&&(L=parseFloat(/^OpenGL ES (\d)/.exec(N)[1]),H=L>=2);let W=null,B={};const j=n.getParameter(n.SCISSOR_BOX),re=n.getParameter(n.VIEWPORT),V=new ut().fromArray(j),K=new ut().fromArray(re);function ie(U,te,J,fe){const ce=new Uint8Array(4),ue=n.createTexture();n.bindTexture(U,ue),n.texParameteri(U,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(U,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Le=0;Le<J;Le++)U===n.TEXTURE_3D||U===n.TEXTURE_2D_ARRAY?n.texImage3D(te,0,n.RGBA,1,1,fe,0,n.RGBA,n.UNSIGNED_BYTE,ce):n.texImage2D(te+Le,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ce);return ue}const ae={};ae[n.TEXTURE_2D]=ie(n.TEXTURE_2D,n.TEXTURE_2D,1),ae[n.TEXTURE_CUBE_MAP]=ie(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),ae[n.TEXTURE_2D_ARRAY]=ie(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),ae[n.TEXTURE_3D]=ie(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),se(n.DEPTH_TEST),a.setFunc(rr),Bt(!1),ft(nh),se(n.CULL_FACE),it(vs);function se(U){h[U]!==!0&&(n.enable(U),h[U]=!0)}function be(U){h[U]!==!1&&(n.disable(U),h[U]=!1)}function rt(U,te){return d[U]!==te?(n.bindFramebuffer(U,te),d[U]=te,U===n.DRAW_FRAMEBUFFER&&(d[n.FRAMEBUFFER]=te),U===n.FRAMEBUFFER&&(d[n.DRAW_FRAMEBUFFER]=te),!0):!1}function Ee(U,te){let J=p,fe=!1;if(U){J=u.get(te),J===void 0&&(J=[],u.set(te,J));const ce=U.textures;if(J.length!==ce.length||J[0]!==n.COLOR_ATTACHMENT0){for(let ue=0,Le=ce.length;ue<Le;ue++)J[ue]=n.COLOR_ATTACHMENT0+ue;J.length=ce.length,fe=!0}}else J[0]!==n.BACK&&(J[0]=n.BACK,fe=!0);fe&&n.drawBuffers(J)}function He(U){return _!==U?(n.useProgram(U),_=U,!0):!1}const Xe={[Ji]:n.FUNC_ADD,[xm]:n.FUNC_SUBTRACT,[Qu]:n.FUNC_REVERSE_SUBTRACT};Xe[ym]=n.MIN,Xe[Sm]=n.MAX;const Te={[Mm]:n.ZERO,[Zo]:n.ONE,[bm]:n.SRC_COLOR,[ed]:n.SRC_ALPHA,[Rm]:n.SRC_ALPHA_SATURATE,[Am]:n.DST_COLOR,[Em]:n.DST_ALPHA,[wm]:n.ONE_MINUS_SRC_COLOR,[Ma]:n.ONE_MINUS_SRC_ALPHA,[Cm]:n.ONE_MINUS_DST_COLOR,[Tm]:n.ONE_MINUS_DST_ALPHA,[Pm]:n.CONSTANT_COLOR,[Im]:n.ONE_MINUS_CONSTANT_COLOR,[Lm]:n.CONSTANT_ALPHA,[Nm]:n.ONE_MINUS_CONSTANT_ALPHA};function it(U,te,J,fe,ce,ue,Le,Ge,le,De){if(U===vs){m===!0&&(be(n.BLEND),m=!1);return}if(m===!1&&(se(n.BLEND),m=!0),U!==Ju){if(U!==g||De!==P){if((y!==Ji||x!==Ji)&&(n.blendEquation(n.FUNC_ADD),y=Ji,x=Ji),De)switch(U){case tr:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case sh:n.blendFunc(n.ONE,n.ONE);break;case rh:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case ah:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:Ue("WebGLState: Invalid blending: ",U);break}else switch(U){case tr:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case sh:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case rh:Ue("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ah:Ue("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ue("WebGLState: Invalid blending: ",U);break}b=null,A=null,M=null,v=null,S.set(0,0,0),E=0,g=U,P=De}return}ce=ce||te,ue=ue||J,Le=Le||fe,(te!==y||ce!==x)&&(n.blendEquationSeparate(Xe[te],Xe[ce]),y=te,x=ce),(J!==b||fe!==A||ue!==M||Le!==v)&&(n.blendFuncSeparate(Te[J],Te[fe],Te[ue],Te[Le]),b=J,A=fe,M=ue,v=Le),(Ge.equals(S)===!1||le!==E)&&(n.blendColor(Ge.r,Ge.g,Ge.b,le),S.copy(Ge),E=le),g=U,P=!1}function Mt(U,te){U.side===Ri?be(n.CULL_FACE):se(n.CULL_FACE);let J=U.side===ii;te&&(J=!J),Bt(J),U.blending===tr&&U.transparent===!1?it(vs):it(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),a.setFunc(U.depthFunc),a.setTest(U.depthTest),a.setMask(U.depthWrite),r.setMask(U.colorWrite);const fe=U.stencilWrite;o.setTest(fe),fe&&(o.setMask(U.stencilWriteMask),o.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),o.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),Ie(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?se(n.SAMPLE_ALPHA_TO_COVERAGE):be(n.SAMPLE_ALPHA_TO_COVERAGE)}function Bt(U){C!==U&&(U?n.frontFace(n.CW):n.frontFace(n.CCW),C=U)}function ft(U){U!==gm?(se(n.CULL_FACE),U!==F&&(U===nh?n.cullFace(n.BACK):U===vm?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):be(n.CULL_FACE),F=U}function ve(U){U!==I&&(H&&n.lineWidth(U),I=U)}function Ie(U,te,J){U?(se(n.POLYGON_OFFSET_FILL),(R!==te||O!==J)&&(R=te,O=J,a.getReversed()&&(te=-te,J=-J),n.polygonOffset(te,J))):be(n.POLYGON_OFFSET_FILL)}function Ne(U){U?se(n.SCISSOR_TEST):be(n.SCISSOR_TEST)}function bt(U){U===void 0&&(U=n.TEXTURE0+k-1),W!==U&&(n.activeTexture(U),W=U)}function ei(U,te,J){J===void 0&&(W===null?J=n.TEXTURE0+k-1:J=W);let fe=B[J];fe===void 0&&(fe={type:void 0,texture:void 0},B[J]=fe),(fe.type!==U||fe.texture!==te)&&(W!==J&&(n.activeTexture(J),W=J),n.bindTexture(U,te||ae[U]),fe.type=U,fe.texture=te)}function G(){const U=B[W];U!==void 0&&U.type!==void 0&&(n.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function li(){try{n.compressedTexImage2D(...arguments)}catch(U){Ue("WebGLState:",U)}}function xt(){try{n.compressedTexImage3D(...arguments)}catch(U){Ue("WebGLState:",U)}}function yt(){try{n.texSubImage2D(...arguments)}catch(U){Ue("WebGLState:",U)}}function _e(){try{n.texSubImage3D(...arguments)}catch(U){Ue("WebGLState:",U)}}function Rt(){try{n.compressedTexSubImage2D(...arguments)}catch(U){Ue("WebGLState:",U)}}function Fe(){try{n.compressedTexSubImage3D(...arguments)}catch(U){Ue("WebGLState:",U)}}function Oe(){try{n.texStorage2D(...arguments)}catch(U){Ue("WebGLState:",U)}}function D(){try{n.texStorage3D(...arguments)}catch(U){Ue("WebGLState:",U)}}function w(){try{n.texImage2D(...arguments)}catch(U){Ue("WebGLState:",U)}}function $(){try{n.texImage3D(...arguments)}catch(U){Ue("WebGLState:",U)}}function oe(U){return f[U]!==void 0?f[U]:n.getParameter(U)}function ne(U,te){f[U]!==te&&(n.pixelStorei(U,te),f[U]=te)}function he(U){V.equals(U)===!1&&(n.scissor(U.x,U.y,U.z,U.w),V.copy(U))}function me(U){K.equals(U)===!1&&(n.viewport(U.x,U.y,U.z,U.w),K.copy(U))}function Q(U,te){let J=c.get(te);J===void 0&&(J=new WeakMap,c.set(te,J));let fe=J.get(U);fe===void 0&&(fe=n.getUniformBlockIndex(te,U.name),n.uniformBlockBinding(te,fe,fe),J.set(U,fe))}function ee(U,te,J){const ce=c.get(te).get(U);l[ce]!==J&&(n.bindBufferBase(n.UNIFORM_BUFFER,ce,J),l[ce]=J)}function de(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),h={},f={},W=null,B={},d={},l={},u=new WeakMap,p=[],_=null,m=!1,g=null,y=null,b=null,A=null,x=null,M=null,v=null,S=new $e(0,0,0),E=0,P=!1,C=null,F=null,I=null,R=null,O=null,V.set(0,0,n.canvas.width,n.canvas.height),K.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:se,disable:be,bindFramebuffer:rt,drawBuffers:Ee,useProgram:He,setBlending:it,setMaterial:Mt,setFlipSided:Bt,setCullFace:ft,setLineWidth:ve,setPolygonOffset:Ie,setScissorTest:Ne,activeTexture:bt,bindTexture:ei,unbindTexture:G,compressedTexImage2D:li,compressedTexImage3D:xt,texImage2D:w,texImage3D:$,pixelStorei:ne,getParameter:oe,updateUBOMapping:Q,uniformBlockBinding:ee,texStorage2D:Oe,texStorage3D:D,texSubImage2D:yt,texSubImage3D:_e,compressedTexSubImage2D:Rt,compressedTexSubImage3D:Fe,scissor:he,viewport:me,reset:de}}function pS(n,e,t,i,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new tt,h=new WeakMap,f=new Set;let d;const u=new WeakMap,p=new Set,_=new FinalizationRegistry(D=>p.delete(D));let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(D,w){return m?new OffscreenCanvas(D,w):hr("canvas")}function y(D,w,$){let oe=1;const ne=Oe(D);if((ne.width>$||ne.height>$)&&(oe=$/Math.max(ne.width,ne.height)),oe<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){const he=Math.floor(oe*ne.width),me=Math.floor(oe*ne.height);d===void 0&&(d=g(he,me));const Q=w?g(he,me):d;return Q.width=he,Q.height=me,Q.getContext("2d").drawImage(D,0,0,he,me),Pe("WebGLRenderer: Texture has been resized from ("+ne.width+"x"+ne.height+") to ("+he+"x"+me+")."),Q}else return"data"in D&&Pe("WebGLRenderer: Image in DataTexture is too big ("+ne.width+"x"+ne.height+")."),D;return D}function b(D){return D.generateMipmaps}function A(D){n.generateMipmap(D)}function x(D){return D.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:D.isWebGL3DRenderTarget?n.TEXTURE_3D:D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function M(D,w,$,oe,ne,he=!1){if(D!==null){if(n[D]!==void 0)return n[D];Pe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let me;oe&&(me=e.get("EXT_texture_norm16"),me||Pe("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Q=w;if(w===n.RED&&($===n.FLOAT&&(Q=n.R32F),$===n.HALF_FLOAT&&(Q=n.R16F),$===n.UNSIGNED_BYTE&&(Q=n.R8),$===n.UNSIGNED_SHORT&&me&&(Q=me.R16_EXT),$===n.SHORT&&me&&(Q=me.R16_SNORM_EXT)),w===n.RED_INTEGER&&($===n.UNSIGNED_BYTE&&(Q=n.R8UI),$===n.UNSIGNED_SHORT&&(Q=n.R16UI),$===n.UNSIGNED_INT&&(Q=n.R32UI),$===n.BYTE&&(Q=n.R8I),$===n.SHORT&&(Q=n.R16I),$===n.INT&&(Q=n.R32I)),w===n.RG&&($===n.FLOAT&&(Q=n.RG32F),$===n.HALF_FLOAT&&(Q=n.RG16F),$===n.UNSIGNED_BYTE&&(Q=n.RG8),$===n.UNSIGNED_SHORT&&me&&(Q=me.RG16_EXT),$===n.SHORT&&me&&(Q=me.RG16_SNORM_EXT)),w===n.RG_INTEGER&&($===n.UNSIGNED_BYTE&&(Q=n.RG8UI),$===n.UNSIGNED_SHORT&&(Q=n.RG16UI),$===n.UNSIGNED_INT&&(Q=n.RG32UI),$===n.BYTE&&(Q=n.RG8I),$===n.SHORT&&(Q=n.RG16I),$===n.INT&&(Q=n.RG32I)),w===n.RGB_INTEGER&&($===n.UNSIGNED_BYTE&&(Q=n.RGB8UI),$===n.UNSIGNED_SHORT&&(Q=n.RGB16UI),$===n.UNSIGNED_INT&&(Q=n.RGB32UI),$===n.BYTE&&(Q=n.RGB8I),$===n.SHORT&&(Q=n.RGB16I),$===n.INT&&(Q=n.RGB32I)),w===n.RGBA_INTEGER&&($===n.UNSIGNED_BYTE&&(Q=n.RGBA8UI),$===n.UNSIGNED_SHORT&&(Q=n.RGBA16UI),$===n.UNSIGNED_INT&&(Q=n.RGBA32UI),$===n.BYTE&&(Q=n.RGBA8I),$===n.SHORT&&(Q=n.RGBA16I),$===n.INT&&(Q=n.RGBA32I)),w===n.RGB&&($===n.UNSIGNED_SHORT&&me&&(Q=me.RGB16_EXT),$===n.SHORT&&me&&(Q=me.RGB16_SNORM_EXT),$===n.UNSIGNED_INT_5_9_9_9_REV&&(Q=n.RGB9_E5),$===n.UNSIGNED_INT_10F_11F_11F_REV&&(Q=n.R11F_G11F_B10F)),w===n.RGBA){const ee=he?Aa:et.getTransfer(ne);$===n.FLOAT&&(Q=n.RGBA32F),$===n.HALF_FLOAT&&(Q=n.RGBA16F),$===n.UNSIGNED_BYTE&&(Q=ee===lt?n.SRGB8_ALPHA8:n.RGBA8),$===n.UNSIGNED_SHORT&&me&&(Q=me.RGBA16_EXT),$===n.SHORT&&me&&(Q=me.RGBA16_SNORM_EXT),$===n.UNSIGNED_SHORT_4_4_4_4&&(Q=n.RGBA4),$===n.UNSIGNED_SHORT_5_5_5_1&&(Q=n.RGB5_A1)}return(Q===n.R16F||Q===n.R32F||Q===n.RG16F||Q===n.RG32F||Q===n.RGBA16F||Q===n.RGBA32F)&&e.get("EXT_color_buffer_float"),Q}function v(D,w){let $;return D?w===null||w===Bi||w===Ss?$=n.DEPTH24_STENCIL8:w===gi?$=n.DEPTH32F_STENCIL8:w===or&&($=n.DEPTH24_STENCIL8,Pe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===Bi||w===Ss?$=n.DEPTH_COMPONENT24:w===gi?$=n.DEPTH_COMPONENT32F:w===or&&($=n.DEPTH_COMPONENT16),$}function S(D,w){return b(D)===!0||D.isFramebufferTexture&&D.minFilter!==Pt&&D.minFilter!==kt?Math.log2(Math.max(w.width,w.height))+1:D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?w.mipmaps.length:1}function E(D){const w=new WeakRef(D);i.get(D).__ref=w,p.add(w),_.register(D,w,w)}function P(D){const w=i.get(D).__ref;w!==void 0&&(p.delete(w),_.unregister(w))}function C(D){I(D.target)}function F(D){R(D.target)}function I(D){D.removeEventListener("dispose",C),P(D),k(D),D.isVideoTexture&&h.delete(D),D.isHTMLTexture&&f.delete(D)}function R(D){D.removeEventListener("dispose",F),P(D),L(D)}function O(){for(const D of p){const w=D.deref();w!==void 0&&(w.isRenderTarget===!0?R(w):I(w))}p.clear(),f.clear()}function k(D){const w=i.get(D);if(w.__webglInit===void 0)return;const $=D.source,oe=u.get($);if(oe){const ne=oe[w.__cacheKey];ne.usedTimes--,ne.usedTimes===0&&H(D),Object.keys(oe).length===0&&u.delete($)}i.remove(D)}function H(D){const w=i.get(D);n.deleteTexture(w.__webglTexture);const $=D.source,oe=u.get($);delete oe[w.__cacheKey],a.memory.textures--}function L(D){const w=i.get(D);w.__depthDisposeCallback&&w.__depthDisposeCallback();const $=D.depthTexture;if($&&$.renderTarget===D&&I($),D.isWebGLCubeRenderTarget)for(let ne=0;ne<6;ne++){if(Array.isArray(w.__webglFramebuffer[ne]))for(let he=0;he<w.__webglFramebuffer[ne].length;he++)n.deleteFramebuffer(w.__webglFramebuffer[ne][he]);else n.deleteFramebuffer(w.__webglFramebuffer[ne]);w.__webglDepthbuffer&&n.deleteRenderbuffer(w.__webglDepthbuffer[ne])}else{if(Array.isArray(w.__webglFramebuffer))for(let ne=0;ne<w.__webglFramebuffer.length;ne++)n.deleteFramebuffer(w.__webglFramebuffer[ne]);else n.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&n.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&n.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let ne=0;ne<w.__webglColorRenderbuffer.length;ne++)w.__webglColorRenderbuffer[ne]&&n.deleteRenderbuffer(w.__webglColorRenderbuffer[ne]);w.__webglDepthRenderbuffer&&n.deleteRenderbuffer(w.__webglDepthRenderbuffer)}const oe=D.textures;for(let ne=0,he=oe.length;ne<he;ne++){const me=i.get(oe[ne]);me.__webglTexture&&(n.deleteTexture(me.__webglTexture),a.memory.textures--),i.remove(oe[ne])}i.remove(D)}let N=0;function W(){N=0}function B(){return N}function j(D){N=D}function re(){const D=N;return D>=s.maxTextures&&Pe("WebGLTextures: Trying to use "+(D+1)+" texture units while this GPU supports only "+s.maxTextures),N+=1,D}function V(D){const w=[];return w.push(D.wrapS),w.push(D.wrapT),w.push(D.wrapR||0),w.push(D.magFilter),w.push(D.minFilter),w.push(D.anisotropy),w.push(D.internalFormat),w.push(D.format),w.push(D.type),w.push(D.generateMipmaps),w.push(D.mipmapsAutoUpdate),w.push(D.premultiplyAlpha),w.push(D.flipY),w.push(D.unpackAlignment),w.push(D.colorSpace),w.join()}function K(D,w){const $=i.get(D);if(D.isVideoTexture&&Rt(D),D.isRenderTargetTexture===!1&&D.isExternalTexture!==!0&&D.version>0&&$.__version!==D.version){const oe=D.image;if(oe===null)Pe("WebGLRenderer: Texture marked for update but no image data found.");else if(oe.complete===!1)Pe("WebGLRenderer: Texture marked for update but image is incomplete");else{Mt($,D,w);return}}else D.isExternalTexture&&($.__webglTexture=D.sourceTexture?D.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,$.__webglTexture,n.TEXTURE0+w)}function ie(D,w){const $=i.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&$.__version!==D.version){Mt($,D,w);return}else D.isExternalTexture&&($.__webglTexture=D.sourceTexture?D.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,$.__webglTexture,n.TEXTURE0+w)}function ae(D,w){const $=i.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&$.__version!==D.version){Mt($,D,w);return}t.bindTexture(n.TEXTURE_3D,$.__webglTexture,n.TEXTURE0+w)}function se(D,w){const $=i.get(D);if(D.version>0&&$.__version!==D.version){Bt($,D,w);return}t.bindTexture(n.TEXTURE_CUBE_MAP,$.__webglTexture,n.TEXTURE0+w)}const be={[rl]:n.REPEAT,[ai]:n.CLAMP_TO_EDGE,[al]:n.MIRRORED_REPEAT},rt={[Pt]:n.NEAREST,[Om]:n.NEAREST_MIPMAP_NEAREST,[Tr]:n.NEAREST_MIPMAP_LINEAR,[kt]:n.LINEAR,[co]:n.LINEAR_MIPMAP_NEAREST,[tn]:n.LINEAR_MIPMAP_LINEAR},Ee={[Xm]:n.NEVER,[_d]:n.ALWAYS,[$m]:n.LESS,[gd]:n.LEQUAL,[qm]:n.EQUAL,[vd]:n.GEQUAL,[Ym]:n.GREATER,[Km]:n.NOTEQUAL};function He(D,w){if(w.type===gi&&e.has("OES_texture_float_linear")===!1&&(w.magFilter===kt||w.magFilter===co||w.magFilter===Tr||w.magFilter===tn||w.minFilter===kt||w.minFilter===co||w.minFilter===Tr||w.minFilter===tn)&&Pe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(D,n.TEXTURE_WRAP_S,be[w.wrapS]),n.texParameteri(D,n.TEXTURE_WRAP_T,be[w.wrapT]),(D===n.TEXTURE_3D||D===n.TEXTURE_2D_ARRAY)&&n.texParameteri(D,n.TEXTURE_WRAP_R,be[w.wrapR]),n.texParameteri(D,n.TEXTURE_MAG_FILTER,rt[w.magFilter]),n.texParameteri(D,n.TEXTURE_MIN_FILTER,rt[w.minFilter]),w.compareFunction&&(n.texParameteri(D,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(D,n.TEXTURE_COMPARE_FUNC,Ee[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===Pt||w.minFilter!==Tr&&w.minFilter!==tn||w.type===gi&&e.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||i.get(w).__currentAnisotropy){const $=e.get("EXT_texture_filter_anisotropic");n.texParameterf(D,$.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,s.getMaxAnisotropy())),i.get(w).__currentAnisotropy=w.anisotropy}}}function Xe(D,w){let $=!1;D.__webglInit===void 0&&(D.__webglInit=!0,w.addEventListener("dispose",C),E(w));const oe=w.source;let ne=u.get(oe);ne===void 0&&(ne={},u.set(oe,ne));const he=V(w);if(he!==D.__cacheKey){ne[he]===void 0&&(ne[he]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,$=!0),ne[he].usedTimes++;const me=ne[D.__cacheKey];me!==void 0&&(ne[D.__cacheKey].usedTimes--,me.usedTimes===0&&H(w)),D.__cacheKey=he,D.__webglTexture=ne[he].texture}return $}function Te(D,w,$){return Math.floor(Math.floor(D/$)/w)}function it(D,w,$,oe){const he=D.updateRanges;if(he.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,w.width,w.height,$,oe,w.data);else{he.sort((U,te)=>U.start-te.start);let me=0;for(let U=1;U<he.length;U++){const te=he[me],J=he[U],fe=te.start+te.count,ce=Te(J.start,w.width,4),ue=Te(te.start,w.width,4);J.start<=fe+1&&ce===ue&&Te(J.start+J.count-1,w.width,4)===ce?te.count=Math.max(te.count,J.start+J.count-te.start):(++me,he[me]=J)}he.length=me+1;const Q=t.getParameter(n.UNPACK_ROW_LENGTH),ee=t.getParameter(n.UNPACK_SKIP_PIXELS),de=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,w.width);for(let U=0,te=he.length;U<te;U++){const J=he[U],fe=Math.floor(J.start/4),ce=Math.ceil(J.count/4),ue=fe%w.width,Le=Math.floor(fe/w.width),Ge=ce,le=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,ue),t.pixelStorei(n.UNPACK_SKIP_ROWS,Le),t.texSubImage2D(n.TEXTURE_2D,0,ue,Le,Ge,le,$,oe,w.data)}D.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,Q),t.pixelStorei(n.UNPACK_SKIP_PIXELS,ee),t.pixelStorei(n.UNPACK_SKIP_ROWS,de)}}function Mt(D,w,$){let oe=n.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(oe=n.TEXTURE_2D_ARRAY),w.isData3DTexture&&(oe=n.TEXTURE_3D);const ne=Xe(D,w),he=w.source;t.bindTexture(oe,D.__webglTexture,n.TEXTURE0+$);const me=i.get(he);if(he.version!==me.__version||ne===!0){if(t.activeTexture(n.TEXTURE0+$),(typeof ImageBitmap<"u"&&w.image instanceof ImageBitmap)===!1){const le=et.getPrimaries(et.workingColorSpace),De=w.colorSpace===Mn?null:et.getPrimaries(w.colorSpace),Ve=w.colorSpace===Mn||le===De?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,w.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ve)}t.pixelStorei(n.UNPACK_ALIGNMENT,w.unpackAlignment);let ee=y(w.image,!1,s.maxTextureSize);ee=Fe(w,ee);const de=r.convert(w.format,w.colorSpace),U=r.convert(w.type);let te=M(w.internalFormat,de,U,w.normalized,w.colorSpace,w.isVideoTexture);He(oe,w);let J;const fe=w.mipmaps,ce=w.isVideoTexture!==!0,ue=me.__version===void 0||ne===!0,Le=he.dataReady,Ge=S(w,ee);if(w.isDepthTexture)te=v(w.format===wn,w.type),ue&&(ce?t.texStorage2D(n.TEXTURE_2D,1,te,ee.width,ee.height):t.texImage2D(n.TEXTURE_2D,0,te,ee.width,ee.height,0,de,U,null));else if(w.isDataTexture)if(fe.length>0){ce&&ue&&t.texStorage2D(n.TEXTURE_2D,Ge,te,fe[0].width,fe[0].height);for(let le=0,De=fe.length;le<De;le++)J=fe[le],ce?Le&&t.texSubImage2D(n.TEXTURE_2D,le,0,0,J.width,J.height,de,U,J.data):t.texImage2D(n.TEXTURE_2D,le,te,J.width,J.height,0,de,U,J.data);w.generateMipmaps=!1}else ce?(ue&&t.texStorage2D(n.TEXTURE_2D,Ge,te,ee.width,ee.height),Le&&it(w,ee,de,U)):t.texImage2D(n.TEXTURE_2D,0,te,ee.width,ee.height,0,de,U,ee.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){ce&&ue&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ge,te,fe[0].width,fe[0].height,ee.depth);for(let le=0,De=fe.length;le<De;le++)if(J=fe[le],w.format!==vi)if(de!==null)if(ce){if(Le)if(w.layerUpdates.size>0){const Ve=Zh(J.width,J.height,w.format,w.type);for(const ye of w.layerUpdates){const ot=J.data.subarray(ye*Ve/J.data.BYTES_PER_ELEMENT,(ye+1)*Ve/J.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,le,0,0,ye,J.width,J.height,1,de,ot)}}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,le,0,0,0,J.width,J.height,ee.depth,de,J.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,le,te,J.width,J.height,ee.depth,0,J.data,0,0);else Pe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ce?Le&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,le,0,0,0,J.width,J.height,ee.depth,de,U,J.data):t.texImage3D(n.TEXTURE_2D_ARRAY,le,te,J.width,J.height,ee.depth,0,de,U,J.data);w.layerUpdates.size>0&&w.clearLayerUpdates()}else{ce&&ue&&t.texStorage2D(n.TEXTURE_2D,Ge,te,fe[0].width,fe[0].height);for(let le=0,De=fe.length;le<De;le++)J=fe[le],w.format!==vi?de!==null?ce?Le&&t.compressedTexSubImage2D(n.TEXTURE_2D,le,0,0,J.width,J.height,de,J.data):t.compressedTexImage2D(n.TEXTURE_2D,le,te,J.width,J.height,0,J.data):Pe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ce?Le&&t.texSubImage2D(n.TEXTURE_2D,le,0,0,J.width,J.height,de,U,J.data):t.texImage2D(n.TEXTURE_2D,le,te,J.width,J.height,0,de,U,J.data)}else if(w.isDataArrayTexture)if(ce){if(ue&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ge,te,ee.width,ee.height,ee.depth),Le)if(w.layerUpdates.size>0){const le=Zh(ee.width,ee.height,w.format,w.type);for(const De of w.layerUpdates){const Ve=ee.data.subarray(De*le/ee.data.BYTES_PER_ELEMENT,(De+1)*le/ee.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,De,ee.width,ee.height,1,de,U,Ve)}w.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ee.width,ee.height,ee.depth,de,U,ee.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,te,ee.width,ee.height,ee.depth,0,de,U,ee.data);else if(w.isData3DTexture)ce?(ue&&t.texStorage3D(n.TEXTURE_3D,Ge,te,ee.width,ee.height,ee.depth),Le&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ee.width,ee.height,ee.depth,de,U,ee.data)):t.texImage3D(n.TEXTURE_3D,0,te,ee.width,ee.height,ee.depth,0,de,U,ee.data);else if(w.isFramebufferTexture){if(ue)if(ce)t.texStorage2D(n.TEXTURE_2D,Ge,te,ee.width,ee.height);else{let le=ee.width,De=ee.height;for(let Ve=0;Ve<Ge;Ve++)t.texImage2D(n.TEXTURE_2D,Ve,te,le,De,0,de,U,null),le>>=1,De>>=1}}else if(w.isHTMLTexture){if("texElementImage2D"in n){const le=n.canvas;if(le.hasAttribute("layoutsubtree")||le.setAttribute("layoutsubtree","true"),ee.parentNode!==le){le.appendChild(ee),f.add(w),le.onpaint=De=>{const Ve=De.changedElements;for(const ye of f)Ve.includes(ye.image)&&(ye.needsUpdate=!0)},le.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,ee);else{const Ve=n.RGBA,ye=n.RGBA,ot=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,Ve,ye,ot,ee)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(fe.length>0){if(ce&&ue){const le=Oe(fe[0]);t.texStorage2D(n.TEXTURE_2D,Ge,te,le.width,le.height)}for(let le=0,De=fe.length;le<De;le++)J=fe[le],ce?Le&&t.texSubImage2D(n.TEXTURE_2D,le,0,0,de,U,J):t.texImage2D(n.TEXTURE_2D,le,te,de,U,J);w.generateMipmaps=!1}else if(ce){if(ue){const le=Oe(ee);t.texStorage2D(n.TEXTURE_2D,Ge,te,le.width,le.height)}Le&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,de,U,ee)}else t.texImage2D(n.TEXTURE_2D,0,te,de,U,ee);b(w)&&w.mipmapsAutoUpdate===!0&&A(oe),me.__version=he.version,w.onUpdate&&w.onUpdate(w)}D.__version=w.version}function Bt(D,w,$){if(w.image.length!==6)return;const oe=Xe(D,w),ne=w.source;t.bindTexture(n.TEXTURE_CUBE_MAP,D.__webglTexture,n.TEXTURE0+$);const he=i.get(ne);if(ne.version!==he.__version||oe===!0){t.activeTexture(n.TEXTURE0+$);const me=et.getPrimaries(et.workingColorSpace),Q=w.colorSpace===Mn?null:et.getPrimaries(w.colorSpace),ee=w.colorSpace===Mn||me===Q?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,w.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,w.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ee);const de=w.isCompressedTexture||w.image[0].isCompressedTexture,U=w.image[0]&&w.image[0].isDataTexture,te=[];for(let ye=0;ye<6;ye++)!de&&!U?te[ye]=y(w.image[ye],!0,s.maxCubemapSize):te[ye]=U?w.image[ye].image:w.image[ye],te[ye]=Fe(w,te[ye]);const J=te[0],fe=r.convert(w.format,w.colorSpace),ce=r.convert(w.type);let ue=M(w.internalFormat,fe,ce,w.normalized,w.colorSpace);const Le=w.isVideoTexture!==!0,Ge=he.__version===void 0||oe===!0,le=ne.dataReady;let De=S(w,J);He(n.TEXTURE_CUBE_MAP,w);let Ve;if(w.isDepthTexture){if(ue=v(w.format===wn,w.type),Ge)if(Le)t.texStorage2D(n.TEXTURE_CUBE_MAP,1,ue,J.width,J.height);else for(let ye=0;ye<6;ye++)t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,ue,J.width,J.height,0,fe,ce,null)}else if(de){Le&&Ge&&t.texStorage2D(n.TEXTURE_CUBE_MAP,De,ue,J.width,J.height);for(let ye=0;ye<6;ye++){Ve=te[ye].mipmaps;for(let ot=0;ot<Ve.length;ot++){const Nt=Ve[ot];w.format!==vi?fe!==null?Le?le&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,ot,0,0,Nt.width,Nt.height,fe,Nt.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,ot,ue,Nt.width,Nt.height,0,Nt.data):Pe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Le?le&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,ot,0,0,Nt.width,Nt.height,fe,ce,Nt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,ot,ue,Nt.width,Nt.height,0,fe,ce,Nt.data)}}}else{if(Ve=w.mipmaps,Le&&Ge){Ve.length>0&&De++;const ye=Oe(te[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,De,ue,ye.width,ye.height)}for(let ye=0;ye<6;ye++)if(U){Le?le&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,0,0,te[ye].width,te[ye].height,fe,ce,te[ye].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,ue,te[ye].width,te[ye].height,0,fe,ce,te[ye].data);for(let ot=0;ot<Ve.length;ot++){const cn=Ve[ot].image[ye].image;Le?le&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,ot+1,0,0,cn.width,cn.height,fe,ce,cn.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,ot+1,ue,cn.width,cn.height,0,fe,ce,cn.data)}}else{Le?le&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,0,0,fe,ce,te[ye]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,ue,fe,ce,te[ye]);for(let ot=0;ot<Ve.length;ot++){const Nt=Ve[ot];Le?le&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,ot+1,0,0,fe,ce,Nt.image[ye]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,ot+1,ue,fe,ce,Nt.image[ye])}}}b(w)&&w.mipmapsAutoUpdate===!0&&A(n.TEXTURE_CUBE_MAP),he.__version=ne.version,w.onUpdate&&w.onUpdate(w)}D.__version=w.version}function ft(D,w,$,oe,ne,he){const me=r.convert($.format,$.colorSpace),Q=r.convert($.type),ee=M($.internalFormat,me,Q,$.normalized,$.colorSpace),de=i.get(w),U=i.get($);if(U.__renderTarget=w,!de.__hasExternalTextures){const te=Math.max(1,w.width>>he),J=Math.max(1,w.height>>he);ne===n.TEXTURE_3D||ne===n.TEXTURE_2D_ARRAY?t.texImage3D(ne,he,ee,te,J,w.depth,0,me,Q,null):t.texImage2D(ne,he,ee,te,J,0,me,Q,null)}t.bindFramebuffer(n.FRAMEBUFFER,D),_e(w)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,oe,ne,U.__webglTexture,0,yt(w)):(ne===n.TEXTURE_2D||ne>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ne<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,oe,ne,U.__webglTexture,he),t.bindFramebuffer(n.FRAMEBUFFER,null)}function ve(D,w,$){if(n.bindRenderbuffer(n.RENDERBUFFER,D),w.depthBuffer){const oe=w.depthTexture,ne=oe&&oe.isDepthTexture?oe.type:null,he=v(w.stencilBuffer,ne),me=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;_e(w)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,yt(w),he,w.width,w.height):$?n.renderbufferStorageMultisample(n.RENDERBUFFER,yt(w),he,w.width,w.height):n.renderbufferStorage(n.RENDERBUFFER,he,w.width,w.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,me,n.RENDERBUFFER,D)}else{const oe=w.textures;for(let ne=0;ne<oe.length;ne++){const he=oe[ne],me=r.convert(he.format,he.colorSpace),Q=r.convert(he.type),ee=M(he.internalFormat,me,Q,he.normalized,he.colorSpace);_e(w)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,yt(w),ee,w.width,w.height):$?n.renderbufferStorageMultisample(n.RENDERBUFFER,yt(w),ee,w.width,w.height):n.renderbufferStorage(n.RENDERBUFFER,ee,w.width,w.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Ie(D,w,$){const oe=w.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,D),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const ne=i.get(w.depthTexture);ne.__renderTarget=w;const he=oe?w.depthTexture.image[0]:w.depthTexture.image;(!ne.__webglTexture||he.width!==w.width||he.height!==w.height)&&(he.width=w.width,he.height=w.height,w.depthTexture.needsUpdate=!0),oe?se(w.depthTexture,0):K(w.depthTexture,0);const me=ne.__webglTexture,Q=yt(w),ee=oe?n.TEXTURE_CUBE_MAP_POSITIVE_X+$:n.TEXTURE_2D,de=w.depthTexture.format===wn?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(w.depthTexture.format===En)_e(w)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,de,ee,me,0,Q):n.framebufferTexture2D(n.FRAMEBUFFER,de,ee,me,0);else if(w.depthTexture.format===wn)_e(w)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,de,ee,me,0,Q):n.framebufferTexture2D(n.FRAMEBUFFER,de,ee,me,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Ne(D){const w=i.get(D),$=D.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==D.depthTexture){const oe=D.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),oe){const ne=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,oe.removeEventListener("dispose",ne)};oe.addEventListener("dispose",ne),w.__depthDisposeCallback=ne}w.__boundDepthTexture=oe}if(D.depthTexture&&!w.__autoAllocateDepthBuffer)if($)for(let oe=0;oe<6;oe++)Ie(w.__webglFramebuffer[oe],D,oe);else D.texture.mipmaps.length>0?Ie(w.__webglFramebuffer[0],D,0):Ie(w.__webglFramebuffer,D,0);else if($){w.__webglDepthbuffer=[];for(let oe=0;oe<6;oe++)if(t.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer[oe]),w.__webglDepthbuffer[oe]===void 0)w.__webglDepthbuffer[oe]=n.createRenderbuffer(),ve(w.__webglDepthbuffer[oe],D,!1);else{const ne=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,he=w.__webglDepthbuffer[oe];n.bindRenderbuffer(n.RENDERBUFFER,he),n.framebufferRenderbuffer(n.FRAMEBUFFER,ne,n.RENDERBUFFER,he)}}else if(D.texture.mipmaps.length>0?t.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=n.createRenderbuffer(),ve(w.__webglDepthbuffer,D,!1);else{const ne=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,he=w.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,he),n.framebufferRenderbuffer(n.FRAMEBUFFER,ne,n.RENDERBUFFER,he)}t.bindFramebuffer(n.FRAMEBUFFER,null)}function bt(D,w,$){const oe=i.get(D);w!==void 0&&ft(oe.__webglFramebuffer,D,D.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),$!==void 0&&Ne(D)}function ei(D){const w=D.texture,$=i.get(D),oe=i.get(w);D.addEventListener("dispose",F),E(D);const ne=D.textures,he=D.isWebGLCubeRenderTarget===!0,me=ne.length>1;if(me||(oe.__webglTexture===void 0&&(oe.__webglTexture=n.createTexture()),oe.__version=w.version,a.memory.textures++),he){$.__webglFramebuffer=[];for(let Q=0;Q<6;Q++)if(w.mipmaps.length>0){$.__webglFramebuffer[Q]=[];for(let ee=0;ee<w.mipmaps.length;ee++)$.__webglFramebuffer[Q][ee]=n.createFramebuffer()}else $.__webglFramebuffer[Q]=n.createFramebuffer()}else{if(w.mipmaps.length>0){$.__webglFramebuffer=[];for(let Q=0;Q<w.mipmaps.length;Q++)$.__webglFramebuffer[Q]=n.createFramebuffer()}else $.__webglFramebuffer=n.createFramebuffer();if(me)for(let Q=0,ee=ne.length;Q<ee;Q++){const de=i.get(ne[Q]);de.__webglTexture===void 0&&(de.__webglTexture=n.createTexture(),a.memory.textures++)}if(D.samples>0&&_e(D)===!1){$.__webglMultisampledFramebuffer=n.createFramebuffer(),$.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,$.__webglMultisampledFramebuffer);for(let Q=0;Q<ne.length;Q++){const ee=ne[Q];$.__webglColorRenderbuffer[Q]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,$.__webglColorRenderbuffer[Q]);const de=r.convert(ee.format,ee.colorSpace),U=r.convert(ee.type),te=M(ee.internalFormat,de,U,ee.normalized,ee.colorSpace,D.isXRRenderTarget===!0),J=yt(D);n.renderbufferStorageMultisample(n.RENDERBUFFER,J,te,D.width,D.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Q,n.RENDERBUFFER,$.__webglColorRenderbuffer[Q])}n.bindRenderbuffer(n.RENDERBUFFER,null),D.depthBuffer&&($.__webglDepthRenderbuffer=n.createRenderbuffer(),ve($.__webglDepthRenderbuffer,D,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(he){t.bindTexture(n.TEXTURE_CUBE_MAP,oe.__webglTexture),He(n.TEXTURE_CUBE_MAP,w);for(let Q=0;Q<6;Q++)if(w.mipmaps.length>0)for(let ee=0;ee<w.mipmaps.length;ee++)ft($.__webglFramebuffer[Q][ee],D,w,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ee);else ft($.__webglFramebuffer[Q],D,w,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0);b(w)?A(n.TEXTURE_CUBE_MAP):w.mipmaps.length>0&&n.texParameteri(n.TEXTURE_CUBE_MAP,n.TEXTURE_MAX_LEVEL,w.mipmaps.length-1),t.unbindTexture()}else if(me){for(let Q=0,ee=ne.length;Q<ee;Q++){const de=ne[Q],U=i.get(de);let te=n.TEXTURE_2D;(D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(te=D.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(te,U.__webglTexture),He(te,de),ft($.__webglFramebuffer,D,de,n.COLOR_ATTACHMENT0+Q,te,0),b(de)&&A(te)}t.unbindTexture()}else{let Q=n.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(Q=D.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Q,oe.__webglTexture),He(Q,w),w.mipmaps.length>0)for(let ee=0;ee<w.mipmaps.length;ee++)ft($.__webglFramebuffer[ee],D,w,n.COLOR_ATTACHMENT0,Q,ee);else ft($.__webglFramebuffer,D,w,n.COLOR_ATTACHMENT0,Q,0);b(w)?A(Q):w.mipmaps.length>0&&n.texParameteri(Q,n.TEXTURE_MAX_LEVEL,w.mipmaps.length-1),t.unbindTexture()}D.depthBuffer&&Ne(D)}function G(D){const w=D.textures;for(let $=0,oe=w.length;$<oe;$++){const ne=w[$];if(b(ne)&&ne.mipmapsAutoUpdate===!0){const he=x(D),me=i.get(ne).__webglTexture;t.bindTexture(he,me),A(he),t.unbindTexture()}}}const li=[];function xt(D){if(D.samples>0){if(_e(D)===!1){const w=D.textures,$=D.width,oe=D.height;let ne=n.COLOR_BUFFER_BIT;const he=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,me=i.get(D),Q=w.length>1;if(Q)for(let de=0;de<w.length;de++)t.bindFramebuffer(n.FRAMEBUFFER,me.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+de,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,me.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+de,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,me.__webglMultisampledFramebuffer),D.texture.mipmaps.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,me.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,me.__webglFramebuffer);for(let de=0;de<w.length;de++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(ne|=n.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(ne|=n.STENCIL_BUFFER_BIT)),Q){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,me.__webglColorRenderbuffer[de]);const U=i.get(w[de]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,U,0)}n.blitFramebuffer(0,0,$,oe,0,0,$,oe,ne,n.NEAREST),l===!0&&(li.length=0,li.push(n.COLOR_ATTACHMENT0+de),D.depthBuffer&&D.storeMultisampledDepthBuffer===!1&&li.push(he),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,li))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Q)for(let de=0;de<w.length;de++){t.bindFramebuffer(n.FRAMEBUFFER,me.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+de,n.RENDERBUFFER,me.__webglColorRenderbuffer[de]);const U=i.get(w[de]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,me.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+de,n.TEXTURE_2D,U,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,me.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.storeMultisampledDepthBuffer===!1&&l){const w=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[w])}}}function yt(D){return Math.min(s.maxSamples,D.samples)}function _e(D){const w=i.get(D);return D.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function Rt(D){const w=a.render.frame;h.get(D)!==w&&(h.set(D,w),D.update())}function Fe(D,w){const $=D.colorSpace,oe=D.format,ne=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||$!==lr&&$!==Mn&&(et.getTransfer($)===lt?(oe!==vi||ne!==ti)&&Pe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ue("WebGLTextures: Unsupported texture color space:",$)),w}function Oe(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(c.width=D.naturalWidth||D.width,c.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(c.width=D.displayWidth,c.height=D.displayHeight):(c.width=D.width,c.height=D.height),c}this.allocateTextureUnit=re,this.resetTextureUnits=W,this.getTextureUnits=B,this.setTextureUnits=j,this.setTexture2D=K,this.setTexture2DArray=ie,this.setTexture3D=ae,this.setTextureCube=se,this.rebindTextures=bt,this.setupRenderTarget=ei,this.updateRenderTargetMipmap=G,this.updateMultisampleRenderTarget=xt,this.setupDepthRenderbuffer=Ne,this.setupFrameBufferTexture=ft,this.useMultisampledRTT=_e,this.dispose=O}function mS(n,e){function t(i,s=Mn){let r;const a=et.getTransfer(s);if(i===ti)return n.UNSIGNED_BYTE;if(i===Jl)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Ql)return n.UNSIGNED_SHORT_5_5_5_1;if(i===dd)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===fd)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===hd)return n.BYTE;if(i===ud)return n.SHORT;if(i===or)return n.UNSIGNED_SHORT;if(i===Zl)return n.INT;if(i===Bi)return n.UNSIGNED_INT;if(i===gi)return n.FLOAT;if(i===zi)return n.HALF_FLOAT;if(i===pd)return n.ALPHA;if(i===md)return n.RGB;if(i===vi)return n.RGBA;if(i===En)return n.DEPTH_COMPONENT;if(i===wn)return n.DEPTH_STENCIL;if(i===Ua)return n.RED;if(i===ec)return n.RED_INTEGER;if(i===Hn)return n.RG;if(i===tc)return n.RG_INTEGER;if(i===ic)return n.RGBA_INTEGER;if(i===ca||i===ha||i===ua||i===da)if(a===lt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===ca)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===ha)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ua)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===da)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===ca)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===ha)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ua)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===da)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===ol||i===ll||i===cl||i===hl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===ol)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===ll)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===cl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===hl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===ul||i===dl||i===fl||i===pl||i===ml||i===ba||i===gl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===ul||i===dl)return a===lt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===fl)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===pl)return r.COMPRESSED_R11_EAC;if(i===ml)return r.COMPRESSED_SIGNED_R11_EAC;if(i===ba)return r.COMPRESSED_RG11_EAC;if(i===gl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===vl||i===_l||i===xl||i===yl||i===Sl||i===Ml||i===bl||i===wl||i===El||i===Tl||i===Al||i===Cl||i===Rl||i===Pl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===vl)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===_l)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===xl)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===yl)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Sl)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Ml)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===bl)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===wl)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===El)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Tl)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Al)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Cl)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Rl)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Pl)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Il||i===Ll||i===Nl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===Il)return a===lt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Ll)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Nl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Dl||i===Fl||i===wa||i===Ul)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Dl)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Fl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===wa)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Ul)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Ss?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const gS=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,vS=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class _S{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Ld(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Vn({vertexShader:gS,fragmentShader:vS,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new _i(new Ba(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class xS extends An{constructor(e,t){super();const i=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,f=null,d=null,u=null,p=null;const _=typeof XRWebGLBinding<"u",m=new _S,g={},y=t.getContextAttributes();let b=null,A=null;const x=[],M=[],v=new tt;let S=null,E=null;const P=new pi;P.viewport=new ut;const C=new pi;C.viewport=new ut;const F=[P,C],I=new x0;let R=null,O=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(V){let K=x[V];return K===void 0&&(K=new _o,x[V]=K),K.getTargetRaySpace()},this.getControllerGrip=function(V){let K=x[V];return K===void 0&&(K=new _o,x[V]=K),K.getGripSpace()},this.getHand=function(V){let K=x[V];return K===void 0&&(K=new _o,x[V]=K),K.getHandSpace()};function k(V){const K=M.indexOf(V.inputSource);if(K===-1)return;const ie=x[K];ie!==void 0&&(ie.update(V.inputSource,V.frame,c||a),ie.dispatchEvent({type:V.type,data:V.inputSource}))}function H(){s.removeEventListener("select",k),s.removeEventListener("selectstart",k),s.removeEventListener("selectend",k),s.removeEventListener("squeeze",k),s.removeEventListener("squeezestart",k),s.removeEventListener("squeezeend",k),s.removeEventListener("end",H),s.removeEventListener("inputsourceschange",L);for(let V=0;V<x.length;V++){const K=M[V];K!==null&&(M[V]=null,x[V].disconnect(K))}R=null,O=null,m.reset();for(const V in g)delete g[V];if(e.setRenderTarget(b),u=null,d=null,f=null,s=null,A=null,re.stop(),i.isPresenting=!1,e.setPixelRatio(S),e.setSize(v.width,v.height,!1),E!==null){const V=E.camera;V.fov=E.fov,V.zoom=E.zoom,V.updateProjectionMatrix(),E=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(V){r=V,i.isPresenting===!0&&Pe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(V){o=V,i.isPresenting===!0&&Pe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(V){c=V},this.getBaseLayer=function(){return d!==null?d:u},this.getBinding=function(){return f===null&&_&&(f=new XRWebGLBinding(s,t)),f},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(V){if(s=V,s!==null){if(b=e.getRenderTarget(),s.addEventListener("select",k),s.addEventListener("selectstart",k),s.addEventListener("selectend",k),s.addEventListener("squeeze",k),s.addEventListener("squeezestart",k),s.addEventListener("squeezeend",k),s.addEventListener("end",H),s.addEventListener("inputsourceschange",L),y.xrCompatible!==!0&&await t.makeXRCompatible(),S=e.getPixelRatio(),e.getSize(v),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let ie=null,ae=null,se=null;y.depth&&(se=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ie=y.stencil?wn:En,ae=y.stencil?Ss:Bi);const be={colorFormat:t.RGBA8,depthFormat:se,scaleFactor:r};f=this.getBinding(),d=f.createProjectionLayer(be),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),A=new ki(d.textureWidth,d.textureHeight,{format:vi,type:ti,depthTexture:new ws(d.textureWidth,d.textureHeight,ae,void 0,void 0,void 0,void 0,void 0,void 0,ie),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{const ie={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:r};u=new XRWebGLLayer(s,t,ie),s.updateRenderState({baseLayer:u}),e.setPixelRatio(1),e.setSize(u.framebufferWidth,u.framebufferHeight,!1),A=new ki(u.framebufferWidth,u.framebufferHeight,{format:vi,type:ti,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}A.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),re.setContext(s),re.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function L(V){for(let K=0;K<V.removed.length;K++){const ie=V.removed[K],ae=M.indexOf(ie);ae>=0&&(M[ae]=null,x[ae].disconnect(ie))}for(let K=0;K<V.added.length;K++){const ie=V.added[K];let ae=M.indexOf(ie);if(ae===-1){for(let be=0;be<x.length;be++)if(be>=M.length){M.push(ie),ae=be;break}else if(M[be]===null){M[be]=ie,ae=be;break}if(ae===-1)break}const se=x[ae];se&&se.connect(ie)}}function N(V,K){K===null?V.matrixWorld.copy(V.matrix):V.matrixWorld.multiplyMatrices(K.matrixWorld,V.matrix),V.matrixWorldInverse.copy(V.matrixWorld).invert()}this.updateCamera=function(V){if(s===null)return;let K=V.near,ie=V.far;m.texture!==null&&(m.depthNear>0&&(K=m.depthNear),m.depthFar>0&&(ie=m.depthFar)),I.near=C.near=P.near=K,I.far=C.far=P.far=ie,(R!==I.near||O!==I.far)&&(s.updateRenderState({depthNear:I.near,depthFar:I.far}),R=I.near,O=I.far),I.layers.mask=V.layers.mask|6,P.layers.mask=I.layers.mask&-5,C.layers.mask=I.layers.mask&-3;const ae=V.parent,se=I.cameras;N(I,ae);for(let be=0;be<se.length;be++)N(se[be],ae);I.projectionMatrix.copy(P.projectionMatrix),I.projectionMatrixInverse.copy(P.projectionMatrixInverse),E===null&&V.isPerspectiveCamera&&(E={camera:V,fov:V.fov,zoom:V.zoom}),W(V,I,ae)};function W(V,K,ie){ie===null?V.matrix.copy(K.matrixWorld):(V.matrix.copy(ie.matrixWorld),V.matrix.invert(),V.matrix.multiply(K.matrixWorld)),V.matrix.decompose(V.position,V.quaternion,V.scale),V.updateMatrixWorld(!0),V.projectionMatrix.copy(K.projectionMatrix),V.projectionMatrixInverse.copy(K.projectionMatrixInverse),V.isPerspectiveCamera&&(V.fov=Ms*2*Math.atan(1/V.projectionMatrix.elements[5]),V.zoom=1)}this.getCamera=function(){return I},this.getFoveation=function(){if(!(d===null&&u===null))return l},this.setFoveation=function(V){l=V,d!==null&&(d.fixedFoveation=V),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=V)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(I)},this.getCameraTexture=function(V){return g[V]};let B=null;function j(V,K){if(h=K.getViewerPose(c||a),p=K,h!==null){const ie=h.views;u!==null&&(e.setRenderTargetFramebuffer(A,u.framebuffer),e.setRenderTarget(A));let ae=!1;ie.length!==I.cameras.length&&(I.cameras.length=0,ae=!0);for(let Ee=0;Ee<ie.length;Ee++){const He=ie[Ee];let Xe=null;if(u!==null)Xe=u.getViewport(He);else{const it=f.getViewSubImage(d,He);Xe=it.viewport,Ee===0&&(e.setRenderTargetTextures(A,it.colorTexture,it.depthStencilTexture),e.setRenderTarget(A))}let Te=F[Ee];Te===void 0&&(Te=new pi,Te.layers.enable(Ee),Te.viewport=new ut,F[Ee]=Te),Te.matrix.fromArray(He.transform.matrix),Te.matrix.decompose(Te.position,Te.quaternion,Te.scale),Te.projectionMatrix.fromArray(He.projectionMatrix),Te.projectionMatrixInverse.copy(Te.projectionMatrix).invert(),Te.viewport.set(Xe.x,Xe.y,Xe.width,Xe.height),Ee===0&&(I.matrix.copy(Te.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale)),ae===!0&&I.cameras.push(Te)}const se=s.enabledFeatures;if(se&&se.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){f=i.getBinding();const Ee=f.getDepthInformation(ie[0]);Ee&&Ee.isValid&&Ee.texture&&m.init(Ee,s.renderState)}if(se&&se.includes("camera-access")&&_){e.state.unbindTexture(),f=i.getBinding();for(let Ee=0;Ee<ie.length;Ee++){const He=ie[Ee].camera;if(He){let Xe=g[He];Xe||(Xe=new Ld,g[He]=Xe);const Te=f.getCameraImage(He);Xe.sourceTexture=Te}}}}for(let ie=0;ie<x.length;ie++){const ae=M[ie],se=x[ie];ae!==null&&se!==void 0&&se.update(ae,K,c||a)}B&&B(V,K),K.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:K}),p=null}const re=new Bd;re.setAnimationLoop(j),this.setAnimationLoop=function(V){B=V},this.dispose=function(){}}}const yS=new je,Kd=new ke;Kd.set(-1,0,0,0,1,0,0,0,1);function SS(n,e){function t(m,g){m.matrixAutoUpdate===!0&&m.updateMatrix(),g.value.copy(m.matrix)}function i(m,g){g.color.getRGB(m.fogColor.value,Nd(n)),g.isFog?(m.fogNear.value=g.near,m.fogFar.value=g.far):g.isFogExp2&&(m.fogDensity.value=g.density)}function s(m,g,y,b,A){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?r(m,g):g.isMeshLambertMaterial?(r(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(r(m,g),f(m,g)):g.isMeshPhongMaterial?(r(m,g),h(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(r(m,g),d(m,g),g.isMeshPhysicalMaterial&&u(m,g,A)):g.isMeshMatcapMaterial?(r(m,g),p(m,g)):g.isMeshDepthMaterial?r(m,g):g.isMeshDistanceMaterial?(r(m,g),_(m,g)):g.isMeshNormalMaterial?r(m,g):g.isLineBasicMaterial?(a(m,g),g.isLineDashedMaterial&&o(m,g)):g.isPointsMaterial?l(m,g,y,b):g.isSpriteMaterial?c(m,g):g.isShadowMaterial?(m.color.value.copy(g.color),m.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(m,g){m.opacity.value=g.opacity,g.color&&m.diffuse.value.copy(g.color),g.emissive&&m.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(m.map.value=g.map,t(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,t(g.alphaMap,m.alphaMapTransform)),g.bumpMap&&(m.bumpMap.value=g.bumpMap,t(g.bumpMap,m.bumpMapTransform),m.bumpScale.value=g.bumpScale,g.side===ii&&(m.bumpScale.value*=-1)),g.normalMap&&(m.normalMap.value=g.normalMap,t(g.normalMap,m.normalMapTransform),m.normalScale.value.copy(g.normalScale),g.side===ii&&m.normalScale.value.negate()),g.displacementMap&&(m.displacementMap.value=g.displacementMap,t(g.displacementMap,m.displacementMapTransform),m.displacementScale.value=g.displacementScale,m.displacementBias.value=g.displacementBias),g.emissiveMap&&(m.emissiveMap.value=g.emissiveMap,t(g.emissiveMap,m.emissiveMapTransform)),g.specularMap&&(m.specularMap.value=g.specularMap,t(g.specularMap,m.specularMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest);const y=e.get(g),b=y.envMap,A=y.envMapRotation;b&&(m.envMap.value=b,m.envMapRotation.value.setFromMatrix4(yS.makeRotationFromEuler(A)).transpose(),b.isCubeTexture&&b.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Kd),m.reflectivity.value=g.reflectivity,m.ior.value=g.ior,m.refractionRatio.value=g.refractionRatio),g.lightMap&&(m.lightMap.value=g.lightMap,m.lightMapIntensity.value=g.lightMapIntensity,t(g.lightMap,m.lightMapTransform)),g.aoMap&&(m.aoMap.value=g.aoMap,m.aoMapIntensity.value=g.aoMapIntensity,t(g.aoMap,m.aoMapTransform))}function a(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,g.map&&(m.map.value=g.map,t(g.map,m.mapTransform))}function o(m,g){m.dashSize.value=g.dashSize,m.totalSize.value=g.dashSize+g.gapSize,m.scale.value=g.scale}function l(m,g,y,b){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.size.value=g.size*y,m.scale.value=b*.5,g.map&&(m.map.value=g.map,t(g.map,m.uvTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,t(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function c(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.rotation.value=g.rotation,g.map&&(m.map.value=g.map,t(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,t(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function h(m,g){m.specular.value.copy(g.specular),m.shininess.value=Math.max(g.shininess,1e-4)}function f(m,g){g.gradientMap&&(m.gradientMap.value=g.gradientMap)}function d(m,g){m.metalness.value=g.metalness,g.metalnessMap&&(m.metalnessMap.value=g.metalnessMap,t(g.metalnessMap,m.metalnessMapTransform)),m.roughness.value=g.roughness,g.roughnessMap&&(m.roughnessMap.value=g.roughnessMap,t(g.roughnessMap,m.roughnessMapTransform)),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)}function u(m,g,y){m.ior.value=g.ior,g.diffuseRoughness>0&&(m.diffuseRoughness.value=g.diffuseRoughness,g.diffuseRoughnessMap&&(m.diffuseRoughnessMap.value=g.diffuseRoughnessMap,t(g.diffuseRoughnessMap,m.diffuseRoughnessMapTransform))),g.sheen>0&&(m.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),m.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(m.sheenColorMap.value=g.sheenColorMap,t(g.sheenColorMap,m.sheenColorMapTransform)),g.sheenRoughnessMap&&(m.sheenRoughnessMap.value=g.sheenRoughnessMap,t(g.sheenRoughnessMap,m.sheenRoughnessMapTransform))),g.clearcoat>0&&(m.clearcoat.value=g.clearcoat,m.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(m.clearcoatMap.value=g.clearcoatMap,t(g.clearcoatMap,m.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,t(g.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(m.clearcoatNormalMap.value=g.clearcoatNormalMap,t(g.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===ii&&m.clearcoatNormalScale.value.negate())),g.dispersion>0&&(m.dispersion.value=g.dispersion),g.retroreflectivity>0&&(m.retroreflectivity.value=g.retroreflectivity),g.iridescence>0&&(m.iridescence.value=g.iridescence,m.iridescenceIOR.value=g.iridescenceIOR,m.iridescenceThicknessMinimum.value=g.iridescenceThicknessMinimum,m.iridescenceThicknessMaximum.value=g.iridescenceThicknessMaximum,g.iridescenceMap&&(m.iridescenceMap.value=g.iridescenceMap,t(g.iridescenceMap,m.iridescenceMapTransform)),g.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=g.iridescenceThicknessMap,t(g.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),g.transmission>0&&(m.transmission.value=g.transmission,m.transmissionSamplerMap.value=y.texture,m.transmissionSamplerSize.value.set(y.width,y.height),g.transmissionMap&&(m.transmissionMap.value=g.transmissionMap,t(g.transmissionMap,m.transmissionMapTransform)),m.thickness.value=g.thickness,g.thicknessMap&&(m.thicknessMap.value=g.thicknessMap,t(g.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=g.attenuationDistance,m.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(m.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(m.anisotropyMap.value=g.anisotropyMap,t(g.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=g.specularIntensity,m.specularColor.value.copy(g.specularColor),g.specularColorMap&&(m.specularColorMap.value=g.specularColorMap,t(g.specularColorMap,m.specularColorMapTransform)),g.specularIntensityMap&&(m.specularIntensityMap.value=g.specularIntensityMap,t(g.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,g){g.matcap&&(m.matcap.value=g.matcap)}function _(m,g){const y=e.get(g).light;m.referencePosition.value.setFromMatrixPosition(y.matrixWorld),m.nearDistance.value=y.shadow.camera.near,m.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function MS(n,e,t,i){let s={},r={};function a(y,b){const A=b.program;i.uniformBlockBinding(y,A,s[y.id])}function o(y,b){let A=s[y.id];A===void 0&&(p(y),A=l(y),s[y.id]=A,y.addEventListener("dispose",m));const x=b.program;i.updateUBOMapping(y,x);const M=e.render.frame;r[y.id]!==M&&(c(y),r[y.id]=M)}function l(y){const b=n.createBuffer(),A=y.__size,x=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,b),n.bufferData(n.UNIFORM_BUFFER,A,x),n.bindBuffer(n.UNIFORM_BUFFER,null),b}function c(y){const b=s[y.id],A=y.uniforms,x=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,b);for(let M=0,v=A.length;M<v;M++){const S=A[M];if(Array.isArray(S))for(let E=0,P=S.length;E<P;E++)h(S[E],M,E,x);else h(S,M,0,x)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function h(y,b,A,x){if(d(y,b,A,x)===!0){const M=y.__offset,v=y.value;if(Array.isArray(v)){let S=0;for(let E=0;E<v.length;E++){const P=v[E],C=_(P,!0);f(P,y.__data,S),S+=C.storage/Float32Array.BYTES_PER_ELEMENT}}else f(v,y.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,M,y.__data)}}function f(y,b,A){typeof y=="number"||typeof y=="boolean"?b[A]=y:y.isMatrix3?(b[A]=y.elements[0],b[A+1]=y.elements[1],b[A+2]=y.elements[2],b[A+3]=0,b[A+4]=y.elements[3],b[A+5]=y.elements[4],b[A+6]=y.elements[5],b[A+7]=0,b[A+8]=y.elements[6],b[A+9]=y.elements[7],b[A+10]=y.elements[8],b[A+11]=0):ArrayBuffer.isView(y)?b.set(y.subarray(0,b.length-A),A):y.toArray(b,A)}function d(y,b,A,x){const M=y.value,v=b+"_"+A;if(Array.isArray(M)){x[v]===void 0&&(x[v]=[]);const S=x[v];let E=!1;for(let P=0;P<M.length;P++)u(M[P],S,P)===!0&&(E=!0);return E}return u(M,x,v)}function u(y,b,A){if(b[A]===void 0)return typeof y=="number"||typeof y=="boolean"?b[A]=y:ArrayBuffer.isView(y)?b[A]=y.slice():b[A]=y.clone(),!0;{const x=b[A];if(typeof y=="number"||typeof y=="boolean"){if(x!==y)return b[A]=y,!0}else{if(ArrayBuffer.isView(y))return!0;if(x.equals(y)===!1)return x.copy(y),!0}}return!1}function p(y){const b=y.uniforms;let A=0;const x=16;for(let v=0,S=b.length;v<S;v++){const E=Array.isArray(b[v])?b[v]:[b[v]];for(let P=0,C=E.length;P<C;P++){const F=E[P],I=Array.isArray(F.value)?F.value:[F.value],R=Array.isArray(b[v])||Array.isArray(F.value);let O=A;for(let H=0,L=I.length;H<L;H++){const N=I[H],W=_(N,R),B=A%x,j=B%W.boundary,re=B+j;A+=j,re!==0&&x-re<W.storage&&(A+=x-re),H===0&&(O=A),A+=W.storage}const k=F.type==="int"?Int32Array:F.type==="uint"?Uint32Array:Float32Array;F.__data=new k((A-O)/Float32Array.BYTES_PER_ELEMENT),F.__offset=O}}const M=A%x;return M>0&&(A+=x-M),y.__size=A,y.__cache={},this}function _(y,b){const A={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(A.boundary=4,A.storage=4):y.isVector2?(A.boundary=8,A.storage=8):y.isVector3||y.isColor?(A.boundary=16,A.storage=12):y.isVector4?(A.boundary=16,A.storage=16):y.isMatrix3?(A.boundary=16,A.storage=48):y.isMatrix4?(A.boundary=16,A.storage=64):y.isTexture?Pe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(A.boundary=16,A.storage=y.byteLength):Pe("WebGLRenderer: Unsupported uniform value type.",y),b===!0&&(A.boundary=16,A.storage=Math.ceil(A.storage/16)*16),A}function m(y){const b=y.target;b.removeEventListener("dispose",m),n.deleteBuffer(s[b.id]),delete s[b.id],delete r[b.id]}function g(){for(const y in s)n.deleteBuffer(s[y]);s={},r={}}return{bind:a,update:o,dispose:g}}const bS=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Fi=null;function wS(){return Fi===null&&(Fi=new bs(bS,16,16,Hn,zi),Fi.name="DFG_LUT",Fi.minFilter=kt,Fi.magFilter=kt,Fi.wrapS=ai,Fi.wrapT=ai,Fi.generateMipmaps=!1,Fi.needsUpdate=!0),Fi}class ES{constructor(e={}){const{canvas:t=Jm(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:d=!1,outputBufferType:u=ti}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=a;const _=u,m=new Set([ic,tc,ec]),g=new Set([ti,Bi,or,Ss,Jl,Ql]),y=new Uint32Array(4),b=new Int32Array(4),A={textures:[],min:[],max:[],resolution:[]};let x=null,M=null;const v=[],S=[];let E=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=sn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const P=this;let C=!1,F=null,I=null,R=null,O=null;this._outputColorSpace=fi;let k=0,H=0,L=null,N=-1,W=null;const B=new ut,j=new ut;let re=null;const V=new $e(0);let K=0,ie=t.width,ae=t.height,se=1,be=null,rt=null;const Ee=new ut(0,0,ie,ae),He=new ut(0,0,ie,ae);let Xe=!1;const Te=new ur,it=new lc;let Mt=!1,Bt=!1;const ft=new je,ve=new Y,Ie=new ut,Ne={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let bt=!1;function ei(){return L===null?se:1}let G=i;function li(T,z){return t.getContext(T,z)}let xt,yt,_e,Rt,Fe,Oe,D,w,$,oe,ne,he,me,Q,ee,de,U,te,J,fe,ce,ue,Le;try{const T={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${jl}`),t.addEventListener("webglcontextlost",De,!1),t.addEventListener("webglcontextrestored",Ve,!1),t.addEventListener("webglcontextcreationerror",ye,!1),G===null){const z="webgl2";if(G=li(z,T),G===null)throw li(z)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ge()}catch(T){throw t.removeEventListener("webglcontextlost",De,!1),t.removeEventListener("webglcontextrestored",Ve,!1),t.removeEventListener("webglcontextcreationerror",ye,!1),Ue("WebGLRenderer: "+T.message),T}function Ge(){xt=new Cx(G),xt.init(),ce=new mS(G,xt),yt=new vx(G,xt,e,ce),_e=new fS(G,xt),yt.reversedDepthBuffer&&d&&_e.buffers.depth.setReversed(!0),I=G.createFramebuffer(),R=G.createFramebuffer(),O=G.createFramebuffer(),Rt=new Ix(G),Fe=new Qy,Oe=new pS(G,xt,_e,Fe,yt,ce,Rt),D=new Ax(P),w=new N0(G),ue=new mx(G,w),$=new Rx(G,w,Rt,ue),oe=new Nx(G,$,w,ue,Rt),te=new Lx(G,yt,Oe),ee=new _x(Fe),ne=new Jy(P,D,xt,yt,ue,ee),he=new SS(P,Fe),me=new tS,Q=new oS(xt),U=new px(P,D,_e,oe,p,l),de=new dS(P,oe,yt),Le=new MS(G,Rt,yt,_e),J=new gx(G,xt,Rt),fe=new Px(G,xt,Rt),Rt.programs=ne.programs,P.capabilities=yt,P.extensions=xt,P.properties=Fe,P.renderLists=me,P.shadowMap=de,P.state=_e,P.info=Rt}_!==ti&&(E=new Fx(_,t.width,t.height,o,s,r));const le=new xS(P,G);this.xr=le,this.getContext=function(){return G},this.getContextAttributes=function(){return G.getContextAttributes()},this.forceContextLoss=function(){const T=xt.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=xt.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return se},this.setPixelRatio=function(T){T!==void 0&&(se=T,this.setSize(ie,ae,!1))},this.getSize=function(T){return T.set(ie,ae)},this.setSize=function(T,z,Z=!0){if(le.isPresenting){Pe("WebGLRenderer: Can't change size while VR device is presenting.");return}ie=T,ae=z,t.width=Math.floor(T*se),t.height=Math.floor(z*se),Z===!0&&(t.style.width=T+"px",t.style.height=z+"px"),E!==null&&E.setSize(t.width,t.height),this.setViewport(0,0,T,z)},this.getDrawingBufferSize=function(T){return T.set(ie*se,ae*se).floor()},this.setDrawingBufferSize=function(T,z,Z){ie=T,ae=z,se=Z,t.width=Math.floor(T*Z),t.height=Math.floor(z*Z),this.setViewport(0,0,T,z)},this.setEffects=function(T){if(_===ti){Ue("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(T){for(let z=0;z<T.length;z++)if(T[z].isOutputPass===!0){Pe("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}E.setEffects(T||[])},this.getCurrentViewport=function(T){return T.copy(B)},this.getViewport=function(T){return T.copy(Ee)},this.setViewport=function(T,z,Z,X){T.isVector4?Ee.set(T.x,T.y,T.z,T.w):Ee.set(T,z,Z,X),_e.viewport(B.copy(Ee).multiplyScalar(ei()).round())},this.getScissor=function(T){return T.copy(He)},this.setScissor=function(T,z,Z,X){T.isVector4?He.set(T.x,T.y,T.z,T.w):He.set(T,z,Z,X),_e.scissor(j.copy(He).multiplyScalar(ei()).round())},this.getScissorTest=function(){return Xe},this.setScissorTest=function(T){_e.setScissorTest(Xe=T)},this.setOpaqueSort=function(T){be=T},this.setTransparentSort=function(T){rt=T},this.getClearColor=function(T){return T.copy(U.getClearColor())},this.setClearColor=function(){U.setClearColor(...arguments)},this.getClearAlpha=function(){return U.getClearAlpha()},this.setClearAlpha=function(){U.setClearAlpha(...arguments)},this.clear=function(T=!0,z=!0,Z=!0){let X=0;if(T){let q=!1;if(L!==null){const ge=L.texture.format;q=m.has(ge)}if(q){const ge=L.texture.type,we=g.has(ge),pe=U.getClearColor(),Me=U.getClearAlpha(),Re=pe.r,Be=pe.g,Ze=pe.b;we?(y[0]=Re,y[1]=Be,y[2]=Ze,y[3]=Me,G.clearBufferuiv(G.COLOR,0,y)):(b[0]=Re,b[1]=Be,b[2]=Ze,b[3]=Me,G.clearBufferiv(G.COLOR,0,b))}else X|=G.COLOR_BUFFER_BIT}z&&(X|=G.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Z&&(X|=G.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),X!==0&&G.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(T){T.setRenderer(this),F=T},this.dispose=function(){t.removeEventListener("webglcontextlost",De,!1),t.removeEventListener("webglcontextrestored",Ve,!1),t.removeEventListener("webglcontextcreationerror",ye,!1),U.dispose(),me.dispose(),Q.dispose(),Oe.dispose(),Fe.dispose(),D.dispose(),oe.dispose(),$.dispose(),ue.dispose(),Le.dispose(),ne.dispose(),le.dispose(),le.removeEventListener("sessionstart",Sc),le.removeEventListener("sessionend",Mc),Rn.stop()};function De(T){T.preventDefault(),Ra("WebGLRenderer: Context Lost."),C=!0}function Ve(){Ra("WebGLRenderer: Context Restored."),C=!1;const T=Rt.autoReset,z=de.enabled,Z=de.autoUpdate,X=de.needsUpdate,q=de.type;Ge(),Rt.autoReset=T,de.enabled=z,de.autoUpdate=Z,de.needsUpdate=X,de.type=q}function ye(T){Ue("WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function ot(T){const z=T.target;z.removeEventListener("dispose",ot),Nt(z)}function Nt(T){cn(T),Fe.remove(T)}function cn(T){const z=Fe.get(T).programs;z!==void 0&&(z.forEach(function(Z){ne.releaseProgram(Z)}),T.isShaderMaterial&&ne.releaseShaderCache(T))}this.renderBufferDirect=function(T,z,Z,X,q,ge){z===null&&(z=Ne);const we=q.isMesh&&q.matrixWorld.determinantAffine()<0,pe=Jd(T,z,Z,X,q);_e.setMaterial(X,we);let Me=Z.index,Re=1;if(X.wireframe===!0){if(Me=$.getWireframeAttribute(Z),Me===void 0)return;Re=2}const Be=Z.drawRange,Ze=Z.attributes.position;let Ae=Be.start*Re,Je=(Be.start+Be.count)*Re;ge!==null&&(Ae=Math.max(Ae,ge.start*Re),Je=Math.min(Je,(ge.start+ge.count)*Re)),Me!==null?(Ae=Math.max(Ae,0),Je=Math.min(Je,Me.count)):Ze!=null&&(Ae=Math.max(Ae,0),Je=Math.min(Je,Ze.count));const Et=Je-Ae;if(Et<0||Et===1/0)return;ue.setup(q,X,pe,Z,Me);let pt,dt=J;if(Me!==null&&(pt=w.get(Me),dt=fe,dt.setIndex(pt)),q.isMesh)X.wireframe===!0?(_e.setLineWidth(X.wireframeLinewidth*ei()),dt.setMode(G.LINES)):dt.setMode(G.TRIANGLES);else if(q.isLine){let Gt=X.linewidth;Gt===void 0&&(Gt=1),_e.setLineWidth(Gt*ei()),q.isLineSegments?dt.setMode(G.LINES):q.isLineLoop?dt.setMode(G.LINE_LOOP):dt.setMode(G.LINE_STRIP)}else q.isPoints?dt.setMode(G.POINTS):q.isSprite&&dt.setMode(G.TRIANGLES);if(q.isBatchedMesh)if(xt.get("WEBGL_multi_draw"))dt.renderMultiDraw(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount);else{const Gt=q._multiDrawStarts,Ce=q._multiDrawCounts,Yt=q._multiDrawCount,at=Me?w.get(Me).bytesPerElement:1,Pn=Fe.get(X).currentProgram.getUniforms();for(let Wt=0;Wt<Yt;Wt++)Pn.setValue(G,"_gl_DrawID",Wt),dt.render(Gt[Wt]/at,Ce[Wt])}else if(q.isInstancedMesh)dt.renderInstances(Ae,Et,q.count);else if(Z.isInstancedBufferGeometry){const Gt=Z._maxInstanceCount!==void 0?Z._maxInstanceCount:1/0,Ce=Math.min(Z.instanceCount,Gt);dt.renderInstances(Ae,Et,Ce)}else dt.render(Ae,Et)};function yc(T,z,Z,X){F!==null&&T.isNodeMaterial&&F.setObject(X,T),Mt===!0&&ee.setState(T,Z,!1),T.transparent===!0&&T.side===Ri&&T.forceSinglePass===!1?(T.side=ii,T.needsUpdate=!0,Ps(T,z,X),T.side=zn,T.needsUpdate=!0,Ps(T,z,X),T.side=Ri):Ps(T,z,X)}this.compile=function(T,z,Z=null){Z===null&&(Z=T),F!==null&&F.renderStart(T,z,Z),M=Q.get(Z),M.init(z),S.push(M),Z.traverseVisible(function(q){q.isLight&&q.layers.test(z.layers)&&(M.pushLight(q),q.castShadow&&M.pushShadow(q))}),T!==Z&&T.traverseVisible(function(q){q.isLight&&q.layers.test(z.layers)&&(M.pushLight(q),q.castShadow&&M.pushShadow(q))}),M.setupLights(),F!==null&&F.updateLights(M.state.lightsArray),Bt=this.localClippingEnabled,Mt=ee.init(this.clippingPlanes,Bt),Mt===!0&&ee.setGlobalState(this.clippingPlanes,z),F!==null&&de.render(M.state.shadowsArray,Z,z);const X=new Set;return T.traverse(function(q){if(!(q.isMesh||q.isPoints||q.isLine||q.isSprite))return;const ge=q.material;if(ge)if(Array.isArray(ge))for(let we=0;we<ge.length;we++){const pe=ge[we];yc(pe,Z,z,q),X.add(pe)}else yc(ge,Z,z,q),X.add(ge)}),M=S.pop(),F!==null&&F.renderEnd(),X},this.compileAsync=function(T,z,Z=null){const X=this.compile(T,z,Z);return new Promise(q=>{function ge(){if(X.forEach(function(we){const Me=Fe.get(we).currentProgram;(Me===void 0||Me.isReady())&&X.delete(we)}),X.size===0){q(T);return}setTimeout(ge,10)}xt.get("KHR_parallel_shader_compile")!==null?ge():setTimeout(ge,10)})};let Ga=null;function jd(T){Ga&&Ga(T)}function Sc(){Rn.stop()}function Mc(){Rn.start()}const Rn=new Bd;Rn.setAnimationLoop(jd),typeof self<"u"&&Rn.setContext(self),this.setAnimationLoop=function(T){Ga=T,le.setAnimationLoop(T),T===null?Rn.stop():Rn.start()},le.addEventListener("sessionstart",Sc),le.addEventListener("sessionend",Mc),this.render=function(T,z){if(z!==void 0&&z.isCamera!==!0){Ue("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;F!==null&&F.renderStart(T,z);const Z=le.enabled===!0&&le.isPresenting===!0,X=E!==null&&(L===null||Z)&&E.begin(P,L);if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),z.parent===null&&z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),le.enabled===!0&&le.isPresenting===!0&&(E===null||E.isCompositing()===!1)&&(le.cameraAutoUpdate===!0&&le.updateCamera(z),z=le.getCamera()),T.isScene===!0&&T.onBeforeRender(P,T,z,L),M=Q.get(T,S.length),M.init(z),M.state.textureUnits=Oe.getTextureUnits(),S.push(M),ft.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),z.isArrayCamera?it.setFromArrayCamera(z):Te.setFromProjectionMatrix(ft,Ii,z.reversedDepth),Bt=this.localClippingEnabled,Mt=ee.init(this.clippingPlanes,Bt),x=me.get(T,v.length),x.init(),v.push(x),this.info.render.frame++,le.enabled===!0&&le.isPresenting===!0){const we=P.xr.getDepthSensingMesh();we!==null&&Wa(we,z,-1/0,P.sortObjects)}Wa(T,z,0,P.sortObjects),x.finish(),F!==null&&F.updateLights(M.state.lightsArray),P.sortObjects===!0&&x.sort(be,rt),bt=le.enabled===!1||le.isPresenting===!1||le.hasDepthSensing()===!1,bt&&U.addToRenderList(x,T),this.info.autoReset===!0&&this.info.reset(),Mt===!0&&ee.beginShadows();const q=M.state.shadowsArray;if(de.render(q,T,z),Mt===!0&&ee.endShadows(),(X&&E.hasRenderPass())===!1){const we=x.opaque,pe=x.transmissive;if(M.setupLights(),z.isArrayCamera){const Me=z.cameras;if(pe.length>0)for(let Re=0,Be=Me.length;Re<Be;Re++){const Ze=Me[Re];wc(we,pe,T,Ze)}bt&&U.render(T);for(let Re=0,Be=Me.length;Re<Be;Re++){const Ze=Me[Re];bc(x,T,Ze,Ze.viewport)}}else pe.length>0&&wc(we,pe,T,z),bt&&U.render(T),bc(x,T,z)}L!==null&&H===0&&(Oe.updateMultisampleRenderTarget(L),Oe.updateRenderTargetMipmap(L)),X&&E.end(P),T.isScene===!0&&T.onAfterRender(P,T,z),ue.resetDefaultState(),N=-1,W=null,S.pop(),S.length>0?(M=S[S.length-1],Oe.setTextureUnits(M.state.textureUnits),Mt===!0&&ee.setGlobalState(P.clippingPlanes,M.state.camera)):M=null,v.pop(),v.length>0?x=v[v.length-1]:x=null,F!==null&&F.renderEnd()};function Wa(T,z,Z,X){if(T.visible===!1)return;if(T.layers.test(z.layers)){if(T.isGroup)Z=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(z);else if(T.isLight)M.pushLight(T),T.castShadow&&M.pushShadow(T);else if(T.isSprite){const we=z.isArrayCamera?it:Te;if(!T.frustumCulled||T.intersectsFrustum(we)){X&&Ie.setFromMatrixPosition(T.matrixWorld).applyMatrix4(ft);const pe=oe.update(T),Me=T.material;Me.visible&&x.push(T,pe,Me,Z,Ie.z,null,z)}}else if(T.isMesh||T.isLine||T.isPoints){const we=z.isArrayCamera?it:Te;if(!T.frustumCulled||T.intersectsFrustum(we)){const pe=oe.update(T),Me=T.material;if(X&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Ie.copy(T.boundingSphere.center)):(pe.boundingSphere===null&&pe.computeBoundingSphere(),Ie.copy(pe.boundingSphere.center)),Ie.applyMatrix4(T.matrixWorld).applyMatrix4(ft)),Array.isArray(Me)){const Re=pe.groups;for(let Be=0,Ze=Re.length;Be<Ze;Be++){const Ae=Re[Be],Je=Me[Ae.materialIndex];Je&&Je.visible&&x.push(T,pe,Je,Z,Ie.z,Ae,z)}}else Me.visible&&x.push(T,pe,Me,Z,Ie.z,null,z)}}}const ge=T.children;for(let we=0,pe=ge.length;we<pe;we++)Wa(ge[we],z,Z,X)}function bc(T,z,Z,X){const{opaque:q,transmissive:ge,transparent:we}=T;M.setupLightsView(Z),Mt===!0&&ee.setGlobalState(P.clippingPlanes,Z),X&&_e.viewport(B.copy(X)),q.length>0&&vr(q,z,Z),ge.length>0&&vr(ge,z,Z),we.length>0&&vr(we,z,Z),_e.buffers.depth.setTest(!0),_e.buffers.depth.setMask(!0),_e.buffers.color.setMask(!0),_e.setPolygonOffset(!1)}function wc(T,z,Z,X){if((Z.isScene===!0?Z.overrideMaterial:null)!==null)return;if(M.state.transmissionRenderTarget[X.id]===void 0){const Ae=xt.has("EXT_color_buffer_half_float")||xt.has("EXT_color_buffer_float");M.state.transmissionRenderTarget[X.id]=new ki(1,1,{generateMipmaps:!0,type:Ae?zi:ti,minFilter:tn,samples:Math.max(4,yt.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:et.workingColorSpace})}const ge=M.state.transmissionRenderTarget[X.id],we=X.viewport||B;ge.setSize(we.z*P.transmissionResolutionScale,we.w*P.transmissionResolutionScale);const pe=P.getRenderTarget(),Me=P.getActiveCubeFace(),Re=P.getActiveMipmapLevel();P.setRenderTarget(ge),P.getClearColor(V),K=P.getClearAlpha(),K<1&&P.setClearColor(16777215,.5),P.clear(),bt&&U.render(Z);const Be=P.toneMapping;P.toneMapping=sn;const Ze=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),M.setupLightsView(X),Mt===!0&&ee.setGlobalState(P.clippingPlanes,X),vr(T,Z,X),Oe.updateMultisampleRenderTarget(ge),Oe.updateRenderTargetMipmap(ge),xt.has("WEBGL_multisampled_render_to_texture")===!1){let Ae=!1;for(let Je=0,Et=z.length;Je<Et;Je++){const pt=z[Je],{object:dt,geometry:Gt,material:Ce,group:Yt}=pt;if(Ce.side===Ri&&dt.layers.test(X.layers)){const at=Ce.side;Ce.side=ii,Ce.needsUpdate=!0,Ec(dt,Z,X,Gt,Ce,Yt),Ce.side=at,Ce.needsUpdate=!0,Ae=!0}}Ae===!0&&(Oe.updateMultisampleRenderTarget(ge),Oe.updateRenderTargetMipmap(ge))}P.setRenderTarget(pe,Me,Re),P.setClearColor(V,K),Ze!==void 0&&(X.viewport=Ze),P.toneMapping=Be}function vr(T,z,Z){const X=z.isScene===!0?z.overrideMaterial:null;for(let q=0,ge=T.length;q<ge;q++){const we=T[q],{object:pe,geometry:Me,group:Re}=we;let Be=we.material;Be.allowOverride===!0&&X!==null&&(Be=X),pe.layers.test(Z.layers)&&Ec(pe,z,Z,Me,Be,Re)}}function Ec(T,z,Z,X,q,ge){F!==null&&q.isNodeMaterial&&F.setObject(T,q),T.onBeforeRender(P,z,Z,X,q,ge),T.modelViewMatrix.multiplyMatrices(Z.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),q.onBeforeRender(P,z,Z,X,T,ge),q.transparent===!0&&q.side===Ri&&q.forceSinglePass===!1?(q.side=ii,q.needsUpdate=!0,P.renderBufferDirect(Z,z,X,q,T,ge),q.side=zn,q.needsUpdate=!0,P.renderBufferDirect(Z,z,X,q,T,ge),q.side=Ri):P.renderBufferDirect(Z,z,X,q,T,ge),T.onAfterRender(P,z,Z,X,q,ge)}function Tc(T){let z=0;for(const Z of T)Z.texture!==null&&z++;return z}function Ps(T,z,Z){z.isScene!==!0&&(z=Ne);const X=Fe.get(T),q=M.state.lights,ge=M.state.shadowsArray,we=q.state.version,pe=ne.getParameters(T,q.state,ge,z,Z,M.state.lightProbeGridArray),Me=ne.getProgramCacheKey(pe);let Re=X.programs;X.environment=T.isMeshStandardMaterial||T.isMeshLambertMaterial||T.isMeshPhongMaterial?z.environment:null,X.fog=z.fog;const Be=T.isMeshStandardMaterial||T.isMeshLambertMaterial&&!T.envMap||T.isMeshPhongMaterial&&!T.envMap;X.envMap=D.get(T.envMap||X.environment,Be),X.envMapRotation=X.environment!==null&&T.envMap===null?z.environmentRotation:T.envMapRotation,Re===void 0&&(T.addEventListener("dispose",ot),Re=new Map,X.programs=Re,X.programVariants=new Map);let Ze=Re.get(Me);if(Ze!==void 0){if(X.currentProgram===Ze&&X.lightsStateVersion===we)return Cc(T,pe),Ze}else pe.uniforms=ne.getUniforms(T),F!==null&&T.isNodeMaterial&&F.build(T,Z,pe),T.onBeforeCompile(pe,P),Ze=ne.acquireProgram(pe,Me),Re.set(Me,Ze),X.uniforms=pe.uniforms;const Ae=X.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Ae.clippingPlanes=ee.uniform),Cc(T,pe),X.needsLights=ef(T),X.lightsStateVersion=we,X.needsLights&&(Ae.ambientLightColor.value=q.state.ambient,Ae.lightProbe.value=q.state.probe,Ae.sunLights.value=q.state.sun,Ae.sunLightShadows.value=q.state.sunShadow,Ae.directionalLights.value=q.state.directional,Ae.directionalLightShadows.value=q.state.directionalShadow,Ae.spotLights.value=q.state.spot,Ae.spotLightShadows.value=q.state.spotShadow,Ae.rectAreaLights.value=q.state.rectArea,Ae.ltc_1.value=q.state.rectAreaLTC1,Ae.ltc_2.value=q.state.rectAreaLTC2,Ae.pointLights.value=q.state.point,Ae.pointLightShadows.value=q.state.pointShadow,Ae.hemisphereLights.value=q.state.hemi,Ae.sunShadowMatrix.value=q.state.sunShadowMatrix,Ae.sunShadowCascade.value=q.state.sunShadowCascade,Ae.directionalShadowMatrix.value=q.state.directionalShadowMatrix,Ae.spotLightMatrix.value=q.state.spotLightMatrix,Ae.spotLightMap.value=q.state.spotLightMap,Ae.pointShadowMatrix.value=q.state.pointShadowMatrix),X.numLightProbeGrids=Tc(M.state.lightProbeGridArray),X.currentProgram=Ze,X.uniformsList=null,Ze}function Zd(T,z,Z,X,q){const ge=Fe.get(T),we=ge.currentProgram.id+","+X+","+q;let pe=ge.programVariants.get(we);return pe===void 0?(pe=Ps(T,z,Z),ge.programVariants.set(we,pe)):(ge.currentProgram=pe,ge.uniformsList=null,ge.outputColorSpace=X,ge.toneMapping=q),pe}function Ac(T){if(T.uniformsList===null){const z=T.currentProgram.getUniforms();T.uniformsList=fa.seqWithValue(z.seq,T.uniforms)}return T.uniformsList}function Cc(T,z){const Z=Fe.get(T);Z.outputColorSpace=z.outputColorSpace,Z.batching=z.batching,Z.batchingColor=z.batchingColor,Z.instancing=z.instancing,Z.instancingColor=z.instancingColor,Z.instancingMorph=z.instancingMorph,Z.skinning=z.skinning,Z.morphTargets=z.morphTargets,Z.morphNormals=z.morphNormals,Z.morphColors=z.morphColors,Z.morphTargetsCount=z.morphTargetsCount,Z.numClippingPlanes=z.numClippingPlanes,Z.numIntersection=z.numClipIntersection,Z.vertexAlphas=z.vertexAlphas,Z.vertexTangents=z.vertexTangents,Z.toneMapping=z.toneMapping}function Jd(T,z,Z,X,q){z.isScene!==!0&&(z=Ne),Oe.resetTextureUnits();const ge=z.fog,we=X.isMeshStandardMaterial||X.isMeshLambertMaterial||X.isMeshPhongMaterial?z.environment:null,pe=L===null?P.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:et.workingColorSpace,Me=X.isMeshStandardMaterial||X.isMeshLambertMaterial&&!X.envMap||X.isMeshPhongMaterial&&!X.envMap,Re=D.get(X.envMap||we,Me),Be=X.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,Ze=!!Z.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Ae=!!Z.morphAttributes.position,Je=!!Z.morphAttributes.normal,Et=!!Z.morphAttributes.color;let pt=sn;X.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(pt=P.toneMapping);const dt=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,Gt=dt!==void 0?dt.length:0,Ce=Fe.get(X),Yt=M.state.lights;if(Mt===!0&&(Bt===!0||T!==W)){const St=T===W&&X.id===N;ee.setState(X,T,St)}let at=!1,Pn=!1;X.version===Ce.__version?Ce.needsLights&&Ce.lightsStateVersion!==Yt.state.version||q.isBatchedMesh&&Ce.batching===!1||!q.isBatchedMesh&&Ce.batching===!0||q.isBatchedMesh&&Ce.batchingColor===!0&&q._colorsTexture===null||q.isBatchedMesh&&Ce.batchingColor===!1&&q._colorsTexture!==null||q.isInstancedMesh&&Ce.instancing===!1||!q.isInstancedMesh&&Ce.instancing===!0||q.isSkinnedMesh&&Ce.skinning===!1||!q.isSkinnedMesh&&Ce.skinning===!0||q.isInstancedMesh&&Ce.instancingColor===!0&&q.instanceColor===null||q.isInstancedMesh&&Ce.instancingColor===!1&&q.instanceColor!==null||q.isInstancedMesh&&Ce.instancingMorph===!0&&q.morphTexture===null||q.isInstancedMesh&&Ce.instancingMorph===!1&&q.morphTexture!==null||Ce.envMap!==Re||X.fog===!0&&Ce.fog!==ge||Ce.numClippingPlanes!==void 0&&(Ce.numClippingPlanes!==ee.numPlanes||Ce.numIntersection!==ee.numIntersection)||Ce.vertexAlphas!==Be||Ce.vertexTangents!==Ze||Ce.morphTargets!==Ae||Ce.morphNormals!==Je||Ce.morphColors!==Et||Ce.morphTargetsCount!==Gt||Ce.numLightProbeGrids!==Tc(M.state.lightProbeGridArray)?at=!0:(Ce.outputColorSpace!==pe||Ce.toneMapping!==pt)&&(Pn=!0):(at=!0,Ce.__version=X.version);let Wt=Ce.currentProgram;(at===!0||Pn===!0)&&(Wt=Pn===!0?Zd(X,z,q,pe,pt):Ps(X,z,q),F&&X.isNodeMaterial&&F.onUpdateProgram(X,Wt,Ce));let _r=!1,hn=!1,In=!1;const nt=Wt.getUniforms(),zt=Ce.uniforms;if(_e.useProgram(Wt.program)&&(_r=!0,hn=!0,In=!0),X.id!==N&&(N=X.id,hn=!0),_r||W!==T){_e.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),nt.setValue(G,"projectionMatrix",T.projectionMatrix),nt.setValue(G,"viewMatrix",T.matrixWorldInverse);const Dt=nt.map.cameraPosition;Dt!==void 0&&Dt.setValue(G,ve.setFromMatrixPosition(T.matrixWorld)),yt.logarithmicDepthBuffer&&nt.setValue(G,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&nt.setValue(G,"isOrthographic",T.isOrthographicCamera===!0),W!==T&&(W=T,hn=!0,In=!0)}if(Ce.needsLights&&(Yt.state.sunShadowMap.length>0&&nt.setValue(G,"sunShadowMap",Yt.state.sunShadowMap,Oe),Yt.state.directionalShadowMap.length>0&&nt.setValue(G,"directionalShadowMap",Yt.state.directionalShadowMap,Oe),Yt.state.spotShadowMap.length>0&&nt.setValue(G,"spotShadowMap",Yt.state.spotShadowMap,Oe),Yt.state.pointShadowMap.length>0&&nt.setValue(G,"pointShadowMap",Yt.state.pointShadowMap,Oe)),q.isSkinnedMesh){nt.setOptional(G,q,"bindMatrix"),nt.setOptional(G,q,"bindMatrixInverse");const St=q.skeleton;St&&(St.boneTexture===null&&St.computeBoneTexture(),nt.setValue(G,"boneTexture",St.boneTexture,Oe))}q.isBatchedMesh&&(nt.setOptional(G,q,"batchingTexture"),nt.setValue(G,"batchingTexture",q._matricesTexture,Oe),nt.setOptional(G,q,"batchingIdTexture"),nt.setValue(G,"batchingIdTexture",q._indirectTexture,Oe),nt.setOptional(G,q,"batchingColorTexture"),q._colorsTexture!==null&&nt.setValue(G,"batchingColorTexture",q._colorsTexture,Oe));const xi=Z.morphAttributes;if((xi.position!==void 0||xi.normal!==void 0||xi.color!==void 0)&&te.update(q,Z,Wt),(hn||Ce.receiveShadow!==q.receiveShadow)&&(Ce.receiveShadow=q.receiveShadow,nt.setValue(G,"receiveShadow",q.receiveShadow)),(X.isMeshStandardMaterial||X.isMeshLambertMaterial||X.isMeshPhongMaterial)&&X.envMap===null&&z.environment!==null&&(zt.envMapIntensity.value=z.environmentIntensity),zt.dfgLUT!==void 0&&(zt.dfgLUT.value=wS()),hn){if(nt.setValue(G,"toneMappingExposure",P.toneMappingExposure),Ce.needsLights&&Qd(zt,In),ge&&X.fog===!0&&he.refreshFogUniforms(zt,ge),he.refreshMaterialUniforms(zt,X,se,ae,M.state.transmissionRenderTarget[T.id]),Ce.needsLights&&Ce.numLightProbeGrids>0){const St=A;let Dt=0;for(const Gi of M.state.lightProbeGridArray)Gi.texture!==null&&(St.textures[Dt]=Gi.texture,St.min[Dt]=Gi.boundingBox.min,St.max[Dt]=Gi.boundingBox.max,St.resolution[Dt]=Gi.resolution,Dt++);for(const Gi in St)St[Gi].length=Dt;zt.probesSH.value=St.textures,zt.probesMin.value=St.min,zt.probesMax.value=St.max,zt.probesResolution.value=St.resolution}fa.upload(G,Ac(Ce),zt,Oe)}if(X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(fa.upload(G,Ac(Ce),zt,Oe),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&nt.setValue(G,"center",q.center),nt.setValue(G,"modelViewMatrix",q.modelViewMatrix),nt.setValue(G,"normalMatrix",q.normalMatrix),nt.setValue(G,"modelMatrix",q.matrixWorld),X.uniformsGroups!==void 0){const St=X.uniformsGroups;for(let Dt=0,Gi=St.length;Dt<Gi;Dt++){const Pc=St[Dt];Le.update(Pc,Wt),Le.bind(Pc,Wt)}}return Wt}function Qd(T,z){T.ambientLightColor.needsUpdate=z,T.lightProbe.needsUpdate=z,T.sunLights.needsUpdate=z,T.sunLightShadows.needsUpdate=z,T.directionalLights.needsUpdate=z,T.directionalLightShadows.needsUpdate=z,T.pointLights.needsUpdate=z,T.pointLightShadows.needsUpdate=z,T.spotLights.needsUpdate=z,T.spotLightShadows.needsUpdate=z,T.rectAreaLights.needsUpdate=z,T.hemisphereLights.needsUpdate=z}function ef(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return k},this.getActiveMipmapLevel=function(){return H},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(T,z,Z){const X=Fe.get(T);X.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),Fe.get(T.texture).__webglTexture=z,Fe.get(T.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:Z,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,z){const Z=Fe.get(T);Z.__webglFramebuffer=z,Z.__useDefaultFramebuffer=z===void 0},this.setRenderTarget=function(T,z=0,Z=0){L=T,k=z,H=Z;let X=null,q=!1,ge=!1;if(T){const pe=Fe.get(T);if(pe.__useDefaultFramebuffer!==void 0){_e.bindFramebuffer(G.FRAMEBUFFER,pe.__webglFramebuffer),B.copy(T.viewport),j.copy(T.scissor),re=T.scissorTest,_e.viewport(B),_e.scissor(j),_e.setScissorTest(re),N=-1;return}else if(pe.__webglFramebuffer===void 0)Oe.setupRenderTarget(T);else if(pe.__hasExternalTextures)Oe.rebindTextures(T,Fe.get(T.texture).__webglTexture,Fe.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const Be=T.depthTexture;if(pe.__boundDepthTexture!==Be){if(Be!==null&&Fe.has(Be)&&(T.width!==Be.image.width||T.height!==Be.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Oe.setupDepthRenderbuffer(T)}}const Me=T.texture;(Me.isData3DTexture||Me.isDataArrayTexture||Me.isCompressedArrayTexture)&&(ge=!0);const Re=Fe.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Re[z])?X=Re[z][Z]:X=Re[z],q=!0):T.samples>0&&Oe.useMultisampledRTT(T)===!1?X=Fe.get(T).__webglMultisampledFramebuffer:Array.isArray(Re)?X=Re[Z]:X=Re,B.copy(T.viewport),j.copy(T.scissor),re=T.scissorTest}else B.copy(Ee).multiplyScalar(se).floor(),j.copy(He).multiplyScalar(se).floor(),re=Xe;if(Z!==0&&(X=I),_e.bindFramebuffer(G.FRAMEBUFFER,X)&&_e.drawBuffers(T,X),_e.viewport(B),_e.scissor(j),_e.setScissorTest(re),q){const pe=Fe.get(T.texture);G.framebufferTexture2D(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_CUBE_MAP_POSITIVE_X+z,pe.__webglTexture,Z)}else if(ge){const pe=z;for(let Me=0;Me<T.textures.length;Me++){const Re=Fe.get(T.textures[Me]);G.framebufferTextureLayer(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0+Me,Re.__webglTexture,Z,pe)}}else if(T!==null&&Z!==0){const pe=Fe.get(T.texture);G.framebufferTexture2D(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_2D,pe.__webglTexture,Z)}N=-1};function Rc(T){const z=Fe.get(T);return(z.__readFormat!==T.format||z.__readType!==T.type)&&(z.__readFormat=T.format,z.__readType=T.type,z.__formatReadable=yt.textureFormatReadable(T.format),z.__typeReadable=yt.textureTypeReadable(T.type)),z}this.readRenderTargetPixels=function(T,z,Z,X,q,ge,we,pe=0){if(!(T&&T.isWebGLRenderTarget)){Ue("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Me=Fe.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&we!==void 0&&(Me=Me[we],Array.isArray(Me)&&(Me=Me[0])),Me){_e.bindFramebuffer(G.FRAMEBUFFER,Me);try{const Re=T.textures[pe],Be=Re.format,Ze=Re.type;T.textures.length>1&&G.readBuffer(G.COLOR_ATTACHMENT0+pe);const Ae=Rc(Re);if(Ae.__formatReadable===!1){Ue("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ae.__typeReadable===!1){Ue("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}z>=0&&z<=T.width-X&&Z>=0&&Z<=T.height-q&&G.readPixels(z,Z,X,q,ce.convert(Be),ce.convert(Ze),ge)}finally{const Re=L!==null?Fe.get(L).__webglFramebuffer:null;_e.bindFramebuffer(G.FRAMEBUFFER,Re)}}},this.readRenderTargetPixelsAsync=async function(T,z,Z,X,q,ge,we,pe=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Me=Fe.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&we!==void 0&&(Me=Me[we],Array.isArray(Me)&&(Me=Me[0])),Me)if(z>=0&&z<=T.width-X&&Z>=0&&Z<=T.height-q){_e.bindFramebuffer(G.FRAMEBUFFER,Me);const Re=T.textures[pe],Be=Re.format,Ze=Re.type;T.textures.length>1&&G.readBuffer(G.COLOR_ATTACHMENT0+pe);const Ae=Rc(Re);if(Ae.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ae.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Je=G.createBuffer();G.bindBuffer(G.PIXEL_PACK_BUFFER,Je),G.bufferData(G.PIXEL_PACK_BUFFER,ge.byteLength,G.STREAM_READ),G.readPixels(z,Z,X,q,ce.convert(Be),ce.convert(Ze),0),G.bindBuffer(G.PIXEL_PACK_BUFFER,null);const Et=L!==null?Fe.get(L).__webglFramebuffer:null;_e.bindFramebuffer(G.FRAMEBUFFER,Et);const pt=G.fenceSync(G.SYNC_GPU_COMMANDS_COMPLETE,0);return G.flush(),await Qm(G,pt,4),G.bindBuffer(G.PIXEL_PACK_BUFFER,Je),G.getBufferSubData(G.PIXEL_PACK_BUFFER,0,ge),G.bindBuffer(G.PIXEL_PACK_BUFFER,null),G.deleteBuffer(Je),G.deleteSync(pt),ge}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,z=null,Z=0){const X=Math.pow(2,-Z),q=Math.floor(T.image.width*X),ge=Math.floor(T.image.height*X),we=z!==null?z.x:0,pe=z!==null?z.y:0;Oe.setTexture2D(T,0),G.copyTexSubImage2D(G.TEXTURE_2D,Z,0,0,we,pe,q,ge),_e.unbindTexture()},this.copyTextureToTexture=function(T,z,Z=null,X=null,q=0,ge=0){let we,pe,Me,Re,Be,Ze,Ae,Je,Et;const pt=T.isCompressedTexture?T.mipmaps[ge]:T.image;if(Z!==null)we=Z.max.x-Z.min.x,pe=Z.max.y-Z.min.y,Me=Z.isBox3?Z.max.z-Z.min.z:1,Re=Z.min.x,Be=Z.min.y,Ze=Z.isBox3?Z.min.z:0;else{const nt=Math.pow(2,-q);we=Math.floor(pt.width*nt),pe=Math.floor(pt.height*nt),T.isDataArrayTexture?Me=pt.depth:T.isData3DTexture?Me=Math.floor(pt.depth*nt):Me=1,Re=0,Be=0,Ze=0}X!==null?(Ae=X.x,Je=X.y,Et=X.z):(Ae=0,Je=0,Et=0);const dt=ce.convert(z.format),Gt=ce.convert(z.type);let Ce;z.isData3DTexture?(Oe.setTexture3D(z,0),Ce=G.TEXTURE_3D):z.isDataArrayTexture||z.isCompressedArrayTexture?(Oe.setTexture2DArray(z,0),Ce=G.TEXTURE_2D_ARRAY):(Oe.setTexture2D(z,0),Ce=G.TEXTURE_2D),_e.activeTexture(G.TEXTURE0),_e.pixelStorei(G.UNPACK_FLIP_Y_WEBGL,z.flipY),_e.pixelStorei(G.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),_e.pixelStorei(G.UNPACK_ALIGNMENT,z.unpackAlignment);const Yt=_e.getParameter(G.UNPACK_ROW_LENGTH),at=_e.getParameter(G.UNPACK_IMAGE_HEIGHT),Pn=_e.getParameter(G.UNPACK_SKIP_PIXELS),Wt=_e.getParameter(G.UNPACK_SKIP_ROWS),_r=_e.getParameter(G.UNPACK_SKIP_IMAGES);_e.pixelStorei(G.UNPACK_ROW_LENGTH,pt.width),_e.pixelStorei(G.UNPACK_IMAGE_HEIGHT,pt.height),_e.pixelStorei(G.UNPACK_SKIP_PIXELS,Re),_e.pixelStorei(G.UNPACK_SKIP_ROWS,Be),_e.pixelStorei(G.UNPACK_SKIP_IMAGES,Ze);const hn=T.isDataArrayTexture||T.isData3DTexture,In=z.isDataArrayTexture||z.isData3DTexture;if(T.isDepthTexture){const nt=Fe.get(T),zt=Fe.get(z),xi=Fe.get(nt.__renderTarget),St=Fe.get(zt.__renderTarget);_e.bindFramebuffer(G.READ_FRAMEBUFFER,xi.__webglFramebuffer),_e.bindFramebuffer(G.DRAW_FRAMEBUFFER,St.__webglFramebuffer);for(let Dt=0;Dt<Me;Dt++)hn&&(G.framebufferTextureLayer(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,Fe.get(T).__webglTexture,q,Ze+Dt),G.framebufferTextureLayer(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,Fe.get(z).__webglTexture,ge,Et+Dt)),G.blitFramebuffer(Re,Be,Re+we,Be+pe,Ae,Je,Ae+we,Je+pe,G.DEPTH_BUFFER_BIT,G.NEAREST);_e.bindFramebuffer(G.READ_FRAMEBUFFER,null),_e.bindFramebuffer(G.DRAW_FRAMEBUFFER,null)}else if(q!==0||T.isRenderTargetTexture||Fe.has(T)){const nt=Fe.get(T),zt=Fe.get(z);_e.bindFramebuffer(G.READ_FRAMEBUFFER,R),_e.bindFramebuffer(G.DRAW_FRAMEBUFFER,O);for(let xi=0;xi<Me;xi++)hn?G.framebufferTextureLayer(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,nt.__webglTexture,q,Ze+xi):G.framebufferTexture2D(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_2D,nt.__webglTexture,q),In?G.framebufferTextureLayer(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,zt.__webglTexture,ge,Et+xi):G.framebufferTexture2D(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_2D,zt.__webglTexture,ge),q!==0?G.blitFramebuffer(Re,Be,Re+we,Be+pe,Ae,Je,Ae+we,Je+pe,G.COLOR_BUFFER_BIT,G.NEAREST):In?G.copyTexSubImage3D(Ce,ge,Ae,Je,Et+xi,Re,Be,we,pe):G.copyTexSubImage2D(Ce,ge,Ae,Je,Re,Be,we,pe);_e.bindFramebuffer(G.READ_FRAMEBUFFER,null),_e.bindFramebuffer(G.DRAW_FRAMEBUFFER,null)}else In?T.isDataTexture||T.isData3DTexture?G.texSubImage3D(Ce,ge,Ae,Je,Et,we,pe,Me,dt,Gt,pt.data):z.isCompressedArrayTexture?G.compressedTexSubImage3D(Ce,ge,Ae,Je,Et,we,pe,Me,dt,pt.data):G.texSubImage3D(Ce,ge,Ae,Je,Et,we,pe,Me,dt,Gt,pt):T.isDataTexture?G.texSubImage2D(G.TEXTURE_2D,ge,Ae,Je,we,pe,dt,Gt,pt.data):T.isCompressedTexture?G.compressedTexSubImage2D(G.TEXTURE_2D,ge,Ae,Je,pt.width,pt.height,dt,pt.data):G.texSubImage2D(G.TEXTURE_2D,ge,Ae,Je,we,pe,dt,Gt,pt);_e.pixelStorei(G.UNPACK_ROW_LENGTH,Yt),_e.pixelStorei(G.UNPACK_IMAGE_HEIGHT,at),_e.pixelStorei(G.UNPACK_SKIP_PIXELS,Pn),_e.pixelStorei(G.UNPACK_SKIP_ROWS,Wt),_e.pixelStorei(G.UNPACK_SKIP_IMAGES,_r),ge===0&&z.generateMipmaps===!0&&z.mipmapsAutoUpdate===!0&&G.generateMipmap(Ce),_e.unbindTexture()},this.initRenderTarget=function(T){Fe.get(T).__webglFramebuffer===void 0&&Oe.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?Oe.setTextureCube(T,0):T.isData3DTexture?Oe.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?Oe.setTexture2DArray(T,0):Oe.setTexture2D(T,0),_e.unbindTexture()},this.resetState=function(){k=0,H=0,L=null,_e.reset(),ue.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ii}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=et._getDrawingBufferColorSpace(e),t.unpackColorSpace=et._getUnpackColorSpace()}}const xu=`precision highp float;
in vec3 position;in vec2 uv;uniform mat4 projectionMatrix,modelViewMatrix;uniform vec2 size,warpBounds;uniform bool warped;out vec2 texUV,localPoint;
void main(){texUV=uv;localPoint=position.xy*size;if(warped)localPoint.x=mix(warpBounds.x,warpBounds.y,position.x);gl_Position=projectionMatrix*modelViewMatrix*vec4(localPoint,0.,1.);}`,TS=`precision highp float;
uniform sampler2D image,palette;uniform bool indexed,maskZero;uniform vec2 coefficients;uniform float opacity;
uniform bool warped;uniform vec4 warpEdges;uniform vec2 size;uniform int fxCount;uniform vec3 fxAdd[8],fxMul[8],fxPost[8];uniform vec2 fxColorInvert[8];in vec2 texUV,localPoint;out vec4 result;
void main(){vec2 sampleUV=texUV;if(warped){vec2 edges=mix(warpEdges.xy,warpEdges.zw,clamp(localPoint.y/size.y,0.,1.));float span=edges.y-edges.x;if(abs(span)<.00001)discard;float u=(localPoint.x-edges.x)/span;if(u<0.||u>=1.)discard;sampleUV=vec2(u,localPoint.y/size.y);}vec4 color=texture(image,sampleUV);if(indexed){float i=floor(color.r*255.+.5);color=texture(palette,vec2((i+.5)/256.,.5));if(i<.5){if(maskZero)discard;color.a=1.;}}if(color.a<=0.)discard;
vec3 rgb=color.rgb*255.;for(int i=0;i<8;i++){if(i>=fxCount)break;float grey=dot(rgb,vec3(.299,.587,.114));rgb=mix(vec3(grey),rgb,fxColorInvert[i].x);if(fxColorInvert[i].y>.5)rgb=255.-rgb;rgb=clamp((rgb+fxAdd[i])*fxMul[i]+fxPost[i],0.,255.);}
rgb=floor(rgb+.00001)/255.;float coverage=color.a*opacity;result=vec4(rgb*coefficients.x*coverage,coverage*(1.-coefficients.y));}`,AS=`precision highp float;uniform float ground;in vec2 texUV;out vec4 result;
void main(){vec2 p=vec2(texUV.x*960.,texUV.y*540.);vec3 color=vec3(.047,.067,.106);float h=ground-105.;if(p.y>h){float distance=p.y-h+16.;float x=(p.x-480.)*100./distance;float lines=min(abs(fract(x/80.+.5)-.5)*distance/100.,abs(fract(log(distance/16.)*3.)-.5)*distance*.18);color=mix(vec3(.105,.153,.215),color,smoothstep(.35,1.1,lines));}if(abs(p.y-ground)<.6)color=vec3(.27,.38,.33);result=vec4(color,1.);}`,CS=()=>({add:Array.from({length:8},()=>[0,0,0]),mul:Array.from({length:8},()=>[1,1,1]),post:Array.from({length:8},()=>[0,0,0]),color:Array.from({length:8},()=>[1,0])});class RS{constructor(e,{maxTextureBytes:t=64*1024*1024,preserveDrawingBuffer:i=!1}={}){this.renderer=new ES({canvas:e,alpha:!1,antialias:!1,powerPreference:"high-performance",preserveDrawingBuffer:i}),this.renderer.debug.onShaderError=(a,o)=>{throw Error("Sprite shader could not compile: "+a.getProgramInfoLog(o))},this.renderer.outputColorSpace=lr,this.renderer.sortObjects=!1,this.renderer.setClearColor(790811,1),this.canvas=e,this.contextLost=a=>{a.preventDefault(),this.lost=!0},e.addEventListener("webglcontextlost",this.contextLost),this.limit=t,this.textureBytes=0,this.textures=new Map,this.slots=[],this.frames=0,this.scene=new Rg,this.camera=new dc(0,960,0,540,-10,10),this.camera.position.z=1,this.geometry=new Vi,this.geometry.setAttribute("position",new oi([0,0,0,1,0,0,0,1,0,1,1,0],3)),this.geometry.setAttribute("uv",new oi([0,0,1,0,0,1,1,1],2)),this.geometry.setIndex([0,1,2,2,1,3]);const s=new zl({glslVersion:Ca,vertexShader:xu,fragmentShader:AS,uniforms:{size:{value:[960,540]},ground:{value:450},warped:{value:!1},warpBounds:{value:[0,0]}},side:Ri,depthTest:!1,depthWrite:!1});this.grid=new _i(this.geometry,s),this.grid.frustumCulled=!1,this.scene.add(this.grid),this.upload({id:"@white",width:1,height:1,indexed:!1,pixels:new Uint8Array([255,255,255,255])});const r=new Uint8Array(256);for(let a=0;a<8;a++)for(let o=0;o<8;o++)if(o===3||a===3||Math.abs(o-3)===Math.abs(a-3)){const l=(a*8+o)*4;r.set([255,240,130,255],l)}this.upload({id:"@spark",width:8,height:8,pixels:r})}upload(e){if(this.textures.has(e.id))return;const t=e.pixels,i=e.width*e.height*(e.indexed?1:4);if(!Number.isSafeInteger(e.width)||!Number.isSafeInteger(e.height)||e.width<1||e.height<1)throw Error("Invalid GPU asset dimensions.");if(e.width>this.renderer.capabilities.maxTextureSize||e.height>this.renderer.capabilities.maxTextureSize)throw Error("Sprite exceeds this graphics device’s texture limit.");if(!(t instanceof Uint8Array)||t.length!==i)throw Error("Invalid GPU asset dimensions.");if(this.textureBytes+t.length>this.limit)throw Error("GPU texture budget exceeded. Close this match or use a smaller stage.");const s=new bs(t,e.width,e.height,e.indexed?Ua:vi,ti);s.minFilter=s.magFilter=Pt,s.wrapS=s.wrapT=ai,s.generateMipmaps=!1,s.flipY=!1,s.unpackAlignment=1,s.needsUpdate=!0,this.textures.set(e.id,s),this.textureBytes+=t.length}slot(e){if(this.slots[e])return this.slots[e];const t=CS(),i=new zl({glslVersion:Ca,vertexShader:xu,fragmentShader:TS,uniforms:{image:{value:null},palette:{value:null},indexed:{value:!1},maskZero:{value:!0},size:{value:[1,1]},warped:{value:!1},warpEdges:{value:[0,1,0,1]},warpBounds:{value:[0,1]},coefficients:{value:[1,0]},opacity:{value:1},fxCount:{value:0},fxAdd:{value:t.add.flat()},fxMul:{value:t.mul.flat()},fxPost:{value:t.post.flat()},fxColorInvert:{value:t.color.flat()}},transparent:!0,depthTest:!1,depthWrite:!1,blending:Ju,blendSrc:Zo,blendDst:Ma,blendEquation:Ji,blendEquationAlpha:Ji,blendSrcAlpha:Zo,blendDstAlpha:Ma});i.side=Ri,i.forceSinglePass=!0;const s=new _i(this.geometry,i);return s.matrixAutoUpdate=!1,s.frustumCulled=!1,s.onBeforeRender=()=>{const r=s.userData.clip,a=this.renderer,o=this.canvas.width/960;a.setScissorTest(!!r),r&&a.setScissor(r[0]*o,(540-r[1]-r[3])*o,r[2]*o,r[3]*o),i.uniformsNeedUpdate=!0},this.scene.add(s),this.slots[e]=s,s}updateVideo(e){const t=e.bitmap;try{if(this.closed||this.lost)return!1;const i=t.width*t.height*4;if(t.width<1||t.height<1||t.width>1280||t.height>720)throw Error("Invalid stage video frame dimensions.");let s=this.textures.get(e.id);const r=(s==null?void 0:s.userData.videoBytes)||0;if(this.textureBytes-r+i>this.limit)throw Error("GPU texture budget exceeded by stage video.");return s||(s=new Vt,s.generateMipmaps=!1,s.wrapS=s.wrapT=ai,s.flipY=!1,this.textures.set(e.id,s)),s.minFilter=s.magFilter=e.filter==="neighbor"?Pt:kt,s.image=t,s.needsUpdate=!0,this.renderer.initTexture(s),s.userData.videoBytes=i,this.textureBytes+=i-r,this.videoUploads=(this.videoUploads||0)+1,!0}finally{t==null||t.close()}}async loadStage(e,t){var r;if(!((r=e==null?void 0:e.model)!=null&&r.path)||this.closed)return!1;const{ModelStage:i}=await import("./model-stage-Cq6JtgT1.js");if(this.closed)return!1;const s=await i.load(e,t,this.renderer,{textureBudget:Math.min(32*1024*1024,this.limit-this.textureBytes)});return this.closed?(s==null||s.close(),!1):(this.model=s,this.textureBytes+=(s==null?void 0:s.textureBytes)||0,!!s)}render(e,{width:t=960,height:i=540}={}){var r,a,o,l,c,h,f;if(this.closed)return;if(this.lost)throw Error("Graphics context was lost. Start the match again from your library.");(this.canvas.width!==t||this.canvas.height!==i)&&this.renderer.setSize(t,i,!1);for(const d of e.assets||[])this.upload(d);this.grid.visible=!!e.grid,this.grid.material.uniforms.ground.value=e.ground||450;const s=e.draws.concat((e.sparks||[]).map(d=>{const u=(12-d.age)*.3+1;return{texture:"@spark",indexed:!1,width:8,height:8,matrix:[u,0,0,u,d.x-4*u,d.y-4*u],blend:{mode:"add",source:1,destination:1},alpha:(12-d.age)/12}}));for(let d=0;d<Math.max(s.length,this.slots.length);d++){if(d>=s.length){this.slots[d].visible=!1;continue}const u=s[d],p=this.slot(d),_=p.material.uniforms;p.visible=!0,p.layers.set((u.pass??1)+1);const m=this.textures.get(u.texture);if(!m)throw Error("GPU texture was not delivered: "+u.texture);if(_.image.value=m,_.palette.value=this.textures.get(u.palette)||this.textures.get("@white"),_.indexed.value=!!u.indexed,_.maskZero.value=u.mask!==!1,_.size.value[0]=u.width,_.size.value[1]=u.height,_.warped.value=!!u.warp,u.warp){for(let S=0;S<4;S++)_.warpEdges.value[S]=u.warp[S];_.warpBounds.value[0]=Math.min(...u.warp),_.warpBounds.value[1]=Math.max(...u.warp)}_.opacity.value=u.alpha??1,_.coefficients.value[0]=((r=u.blend)==null?void 0:r.source)??1,_.coefficients.value[1]=((a=u.blend)==null?void 0:a.destination)??0;const[g,y,b,A,x,M]=u.matrix;p.matrix.set(g,b,0,x,y,A,0,M,0,0,1,0,0,0,0,1),p.matrixWorldNeedsUpdate=!0,p.userData.clip=u.clip,p.material.blendEquation=((o=u.blend)==null?void 0:o.mode)==="subtract"?Qu:Ji;const v=u.palFX||[];_.fxCount.value=Math.min(8,v.length);for(let S=0;S<_.fxCount.value;S++){const E=v[S],P=E.sinadd||[],C=P[3]?Math.sin(2*Math.PI*(E.age||0)/P[3]):0;_.fxColorInvert.value[S*2]=(E.color??256)/256,_.fxColorInvert.value[S*2+1]=E.invertall?1:0;for(let F=0;F<3;F++)_.fxAdd.value[S*3+F]=(((l=E.add)==null?void 0:l[F])||0)+(P[F]||0)*C,_.fxMul.value[S*3+F]=(((c=E.mul)==null?void 0:c[F])??256)/256,_.fxPost.value[S*3+F]=((h=E.postadd)==null?void 0:h[F])||0}}if(this.renderer.setScissorTest(!1),this.model&&e.model){this.renderer.autoClear=!1,this.renderer.clear(),this.model.update(e.model);for(const d of[-1,0,1,2])d<1&&this.model.render(d),d===2&&this.model.render(1),this.camera.layers.set(d+1),this.renderer.render(this.scene,this.camera),this.renderer.setScissorTest(!1);this.renderer.autoClear=!0}else this.camera.layers.enableAll(),this.renderer.render(this.scene,this.camera);return this.renderer.setScissorTest(!1),this.frames++,this.stats={backend:"Kenjatime Core · Three.js",frames:this.frames,draws:s.length,textureBytes:this.textureBytes,textures:this.textures.size,width:t,height:i,videoUploads:this.videoUploads||0,model:!!this.model,shadowUpdates:((f=this.model)==null?void 0:f.shadowUpdates)||0},this.stats}close(){var e;if(!this.closed){this.closed=!0,(e=this.model)==null||e.close(),this.canvas.removeEventListener("webglcontextlost",this.contextLost);for(const t of this.textures.values())t.dispose();for(const t of this.slots)t.material.dispose();this.grid.material.dispose(),this.geometry.dispose(),this.renderer.dispose(),this.renderer.forceContextLoss(),this.textures.clear()}}}const yu=1e3/60;class PS{constructor({maxTicks:e=12}={}){this.maxTicks=e,this.reset()}reset(){this.last=null,this.debt=0,this.tickCount=0,this.lastRender=null}suspend(){this.last=null,this.debt=0,this.lastRender=null}advance(e,{running:t=!0,speed:i=1}={},s=()=>{}){if(!Number.isFinite(e)||!Number.isFinite(i)||i<=0)throw Error("Invalid frame clock time or speed.");const r=this.last===null?0:Math.max(0,e-this.last);if(this.last=e,!t)return this.debt=0,0;this.debt+=r*i/yu;let a=0;for(;this.debt>=1-1e-9&&a<this.maxTicks;){const o=e-Math.max(0,this.debt-1)*yu/i;s(o),this.debt=Math.max(0,this.debt-1),a++,this.tickCount++}return a}renderDue(e,t=60){return this.lastRender===null||e-this.lastRender>=1e3/t-.25?(this.lastRender=e,!0):!1}}class Su{constructor(){this.reset()}reset(){this.sources=new Map,this.sampled=new Map,this.queue=[],this.offset=0}clearSource(e){this.sources.delete(e),this.sampled.delete(e),this.queue=this.queue.slice(this.offset).filter(t=>t.source!==e),this.offset=0}record(e,t,i){const s=new Set(t),r=this.sources.get(e)||new Set;if(s.size===r.size&&[...s].every(l=>r.has(l)))return;this.sources.set(e,s);const a={source:e,keys:s,time:i};let o=this.queue.length;for(;o>this.offset&&this.queue[o-1].time>i;)o--;this.queue.splice(o,0,a)}sample(e){const t=new Set;for(;this.offset<this.queue.length&&this.queue[this.offset].time<=e;){const s=this.queue[this.offset++],r=this.sampled.get(s.source)||new Set;for(const a of s.keys)r.has(a)||t.add(a);this.sampled.set(s.source,s.keys)}const i=new Set(t);for(const s of this.sampled.values())for(const r of s)i.add(r);return this.offset>128&&(this.queue.splice(0,this.offset),this.offset=0),i}}class IS{constructor(e,t=globalThis){this.callback=e,this.host=t,this.handle=null,this.timer=!1}schedule({timer:e=!1,catchUp:t=!1,idle:i=!1}={}){this.cancel(),this.timer=e||t||i||typeof this.host.requestAnimationFrame!="function";const s=r=>{this.handle=null,this.callback(r)};this.handle=this.timer?this.host.setTimeout(()=>s(this.host.performance.now()),t?0:i?100:1e3/60):this.host.requestAnimationFrame(s)}cancel(){this.handle!==null&&(this.timer?this.host.clearTimeout(this.handle):this.host.cancelAnimationFrame(this.handle),this.handle=null)}}function LS(n){let e,t,i=!1,s=!1,r=!1,a=!0,o=!1,l=!0,c=-1/0,h=1,f="auto",d,u,p,_=1,m=!0,g=!1;const y=new PS,b=[new Su,new Su],A=new Map,x=new Set,M=new Map,v=[],S=new Map,E=new Set;function P(){var V,K;const B=e==null?void 0:e.match.stage;if(!B)return;const j=e.match,re=((V=j.superPause)==null?void 0:V.remaining)>0||((K=j.pause)==null?void 0:K.remaining)>0&&j.pause.pausebg!==0;for(const ie of B.elements)if(ie.video){const ae={type:"video-control",id:ie.video.key,playing:!r&&!re&&ie.enabled&&!E.has(ie.video.key),visible:ie.visible,captureVisible:!o,epoch:B.generation||0},se=JSON.stringify(ae),be=S.get(ae.id);(be==null?void 0:be.signature)!==se&&(ae.reset=be&&be.epoch!==ae.epoch,S.set(ae.id,{signature:se,epoch:ae.epoch}),n(ae))}}const C=new IS(k),F=()=>C.schedule({timer:o||!l,catchUp:!r&&y.debt>=1,idle:r});function I(B){const j=new Float32Array(B);if(j.fill(0),p&&!r&&!g){let re=0;for(;re<j.length/2;){let V=p.read(Math.min(2048,j.length/2-re));if(!V&&(!m||(p.seek(0),V=p.read(Math.min(2048,j.length/2-re)),!V)))break;j.set(new Float32Array(p.pcm.buffer,p.pcm.byteOffset,V*2),re*2),re+=V}if(_!==1)for(let V=0;V<j.length;V++)j[V]*=_}d==null||d.postMessage({buffer:B},[B])}function R(){var B,j,re;for(const V of e.drainEvents()){if(V.type==="playsnd")try{const K=e.characters.find(be=>be.path===V.character),ie=V.common?e.commonEffects.soundPath:(B=K==null?void 0:K.checks.find(be=>be.key==="sound"&&be.ok))==null?void 0:B.path;if(!ie){V.common&&e.issue("common-sound","Common sound requested, but the imported pack has no common.snd.");continue}A.has(ie)||A.set(ie,xf(e.files[ie]));const ae=V.group??((j=V.value)==null?void 0:j[0]),se=V.number??((re=V.value)==null?void 0:re[1]);if(V.soundKey=ie+":"+ae+","+se,M.set(V.soundKey,{path:ie,group:ae,number:se}),!x.has(V.soundKey)){const be=A.get(ie).get(ae,se);if(!be)continue;V.bytes=be.slice(),x.add(V.soundKey)}}catch(K){e.issue("sound",K.message);continue}n({type:"sound",event:V},V.bytes?[V.bytes.buffer]:[])}}function O(){const B=e.match.entities.some(j=>!j.destroyed&&j.asserted.has("nomusic"));B!==g&&(g=B,n({type:"music-suppression",value:B}))}function k(B){if(!i)try{const j=performance.timeOrigin+B;if(y.advance(j,{running:!r},re=>{e.tick(b[0].sample(re),b[1].sample(re)),O(),R()}),P(),!o&&y.debt<1&&(!r||a)&&y.renderDue(B,60)){const re=performance.now(),V=e.frame();t.render(V,{width:Math.round(960*h),height:Math.round(540*h)});const K=performance.now()-re;if(a=!1,f==="auto"&&!V.assets.length&&!r&&(v.push(K),v.length>=30)){const ie=v.reduce((ae,se)=>ae+se,0)/v.length;ie>20?h=Math.max(.5,h-.05):ie<9&&(h=Math.min(1,h+.05)),v.length=0}}B-c>=100&&(c=B,n({type:"state",state:{...e.snapshot(),paused:r,background:o,focused:l,simulationDebt:y.debt},gpu:t.stats})),F()}catch(j){n({type:"error",message:j.message}),N()}}async function H({files:B,selection:j,canvas:re,sampleRate:V=48e3,quality:K="auto"}){var be,rt,Ee,He,Xe;if(f=K,t||W(re),e=new mm(B,j),await e.initializeScripts(),i)return;try{e.modelReady=await t.loadStage((be=e.match.stage)==null?void 0:be.definition,B)}catch(Te){i||e.issue("stage-model",Te.message)}if(i)return;let ie=0;const ae=new Set;for(const Te of((rt=e.match.stage)==null?void 0:rt.elements)||[])if((Ee=Te.video)!=null&&Ee.path){const it=ae.has(Te.video.path)?null:(He=B[Te.video.path])==null?void 0:He.slice();if(it&&(ie+=it.length),ie>64*1024*1024){E.add(Te.video.key),e.issue("stage-video","Stage video source budget (64 MiB) exceeded.");continue}ae.add(Te.video.path),n({type:"video-init",id:Te.video.key,...Te.video,bytes:it},it?[it.buffer]:[])}const se=(Xe=e.match.stage)==null?void 0:Xe.definition.music;if(se!=null&&se.path&&B[se.path])if(/\.(mod|xm|it|s3m)$/i.test(se.path)){const{createModuleMusic:Te}=await import("./module-music-C2Wy91BT.js");if(i)return;const it=await Te();if(i){it.close();return}u=it,p=u.open(B[se.path],V),_=Math.max(0,Math.min(2,se.volume/100)),m=se.loop,n({type:"audio-init",sampleRate:V})}else{const Te=B[se.path].slice();n({type:"music",bytes:Te,path:se.path,volume:se.volume,loop:se.loop},[Te.buffer])}i||(s=!0,n({type:"ready",capabilities:e.capabilities}),F())}function L(B){var j,re,V;if(i){B.type==="video-frame"&&((j=B.bitmap)==null||j.close());return}if(B.type==="video-frame"){try{t.updateVideo(B)&&e.videoSprites.set(B.id,{id:B.id,w:B.sourceWidth,h:B.sourceHeight,x:0,y:0,indexed:!1}),a=!0}catch(K){E.add(B.id),e.issue("stage-video",K.message)}n({type:"video-ack",id:B.id});return}if(B.type==="media-warning"){e==null||e.issue("stage-video",String(B.message));return}if(B.type==="visibility"){o=!!B.hidden,l=B.focused!==!1,o||(a=!0),s&&P(),s&&F();return}if(B.type==="release-inputs"){b.forEach(K=>K.reset());return}if(B.type==="sound-request"){try{const K=M.get(B.key),ie=K&&((V=(re=A.get(K.path))==null?void 0:re.get(K.group,K.number))==null?void 0:V.slice());if(!ie)throw Error("Sound is unavailable.");n({type:"sound-data",key:B.key,bytes:ie},[ie.buffer])}catch(K){n({type:"sound-data",key:B.key,error:K.message})}return}B.type==="input"&&Array.isArray(B.keys)&&b[B.side===1?1:0].record(B.source||"keyboard",B.keys,B.time??performance.timeOrigin+performance.now()),B.type==="pause"&&(r=!!B.value,b.forEach(K=>K.reset()),y.suspend(),a=!0,s&&F()),B.type==="quality"&&(f=B.value,h=1,v.length=0,a=!0),B.type==="audio-port"&&(d=B.port,d.onmessage=({data:K})=>{!i&&K.buffer instanceof ArrayBuffer&&K.buffer.byteLength===8192&&I(K.buffer)},d.start()),B.type==="stop"&&N()}function N(){i||(i=!0,C.cancel(),d==null||d.close(),u==null||u.close(),e==null||e.close(),t==null||t.close(),d=u=p=e=t=null,A.clear(),x.clear(),M.clear(),b.forEach(B=>B.reset()))}function W(B){if(i)throw Error("Match cancelled.");t||(t=new RS(B))}return{start:H,prepare:W,control:L,stop:N,snapshot:()=>e==null?void 0:e.snapshot(),get gpu(){return t==null?void 0:t.stats}}}const ta=LS((n,e=[])=>self.postMessage(n,e));self.onmessage=({data:n})=>{if(n.type==="prepare"){try{ta.prepare(n.canvas),self.postMessage({type:"renderer-ready"})}catch(e){ta.stop(),self.postMessage({type:"renderer-unavailable",message:e.message})}return}n.type==="start"?ta.start(n).catch(e=>self.postMessage({type:"error",message:e.message})):ta.control(n)};export{Xh as $,ct as A,Vi as B,$e as C,ZS as D,zS as E,p0 as F,_i as G,VS as H,HS as I,Rd as J,GS as K,Cs as L,XS as M,Tr as N,wt as O,jS as P,Oi as Q,rl as R,fi as S,DS as T,WS as U,tt as V,Rr as W,pi as X,OS as Y,dc as Z,Cd as _,US as a,Vg as a0,Ea as a1,Ol as a2,Vt as a3,Od as a4,cc as a5,hc as a6,et as a7,zn as a8,mr as a9,Cn as aa,ln as ab,$S as ac,zi as ad,gi as ae,kS as af,u0 as ag,on as ah,Rg as ai,tr as aj,ah as ak,rh as al,sh as am,YS as an,bs as ao,vi as ap,oo as aq,eM as ar,km as as,Bm as at,la as au,Li as av,FS as b,JS as c,lr as d,KS as e,je as f,Y as g,Ih as h,qS as i,QS as j,an as k,BS as l,Ad as m,tn as n,co as o,Om as p,kt as q,Pt as r,al as s,ai as t,qg as u,Gn as v,$g as w,Jg as x,Ri as y,Bg as z};
