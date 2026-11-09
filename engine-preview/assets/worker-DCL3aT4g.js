class Gc{constructor({maxBytes:e=16*1024*1024,maxEntries:t=512,sizeOf:i=s=>{var r;return((r=s==null?void 0:s.rgba)==null?void 0:r.byteLength)||0}}={}){this.maxBytes=e,this.maxEntries=t,this.sizeOf=i,this.entries=new Map,this.bytes=0,this.hits=0,this.misses=0,this.evictions=0}get size(){return this.entries.size}has(e){return this.entries.has(e)}get(e){const t=this.entries.get(e);if(!t){this.misses++;return}return this.hits++,this.entries.delete(e),this.entries.set(e,t),t.value}set(e,t){this.delete(e);const i=Math.max(0,this.sizeOf(t)||0);if(i>this.maxBytes||this.maxEntries<1)return this;for(this.entries.set(e,{value:t,bytes:i}),this.bytes+=i;this.bytes>this.maxBytes||this.size>this.maxEntries;)this.delete(this.entries.keys().next().value),this.evictions++;return this}delete(e){const t=this.entries.get(e);return t?(this.bytes-=t.bytes,this.entries.delete(e)):!1}clear(){this.entries.clear(),this.bytes=0}}var li=Uint8Array,Yn=Uint16Array,fu=Int32Array,Vc=new li([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Wc=new li([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),du=new li([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Xc=function(n,e){for(var t=new Yn(31),i=0;i<31;++i)t[i]=e+=1<<n[i-1];for(var s=new fu(t[30]),i=1;i<30;++i)for(var r=t[i];r<t[i+1];++r)s[r]=r-t[i]<<5|i;return{b:t,r:s}},$c=Xc(Vc,2),qc=$c.b,pu=$c.r;qc[28]=258,pu[258]=28;var mu=Xc(Wc,0),gu=mu.b,Va=new Yn(32768);for(var ut=0;ut<32768;++ut){var Ki=(ut&43690)>>1|(ut&21845)<<1;Ki=(Ki&52428)>>2|(Ki&13107)<<2,Ki=(Ki&61680)>>4|(Ki&3855)<<4,Va[ut]=((Ki&65280)>>8|(Ki&255)<<8)>>1}var Ms=(function(n,e,t){for(var i=n.length,s=0,r=new Yn(e);s<i;++s)n[s]&&++r[n[s]-1];var a=new Yn(e);for(s=1;s<e;++s)a[s]=a[s-1]+r[s-1]<<1;var o;if(t){o=new Yn(1<<e);var l=15-e;for(s=0;s<i;++s)if(n[s])for(var c=s<<4|n[s],d=e-n[s],f=a[n[s]-1]++<<d,h=f|(1<<d)-1;f<=h;++f)o[Va[f]>>l]=c}else for(o=new Yn(i),s=0;s<i;++s)n[s]&&(o[s]=Va[a[n[s]-1]++]>>15-n[s]);return o}),Is=new li(288);for(var ut=0;ut<144;++ut)Is[ut]=8;for(var ut=144;ut<256;++ut)Is[ut]=9;for(var ut=256;ut<280;++ut)Is[ut]=7;for(var ut=280;ut<288;++ut)Is[ut]=8;var Yc=new li(32);for(var ut=0;ut<32;++ut)Yc[ut]=5;var vu=Ms(Is,9,1),xu=Ms(Yc,5,1),ta=function(n){for(var e=n[0],t=1;t<n.length;++t)n[t]>e&&(e=n[t]);return e},hi=function(n,e,t){var i=e/8|0;return(n[i]|n[i+1]<<8)>>(e&7)&t},ia=function(n,e){var t=e/8|0;return(n[t]|n[t+1]<<8|n[t+2]<<16)>>(e&7)},_u=function(n){return(n+7)/8|0},yu=function(n,e,t){return(t==null||t>n.length)&&(t=n.length),new li(n.subarray(e,t))},Su=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],mi=function(n,e,t){var i=new Error(e||Su[n]);if(i.code=n,Error.captureStackTrace&&Error.captureStackTrace(i,mi),!t)throw i;return i},Mu=function(n,e,t,i){var s=n.length,r=i?i.length:0;if(!s||e.f&&!e.l)return t||new li(0);var a=!t,o=a||e.i!=2,l=e.i;a&&(t=new li(s*3));var c=function(Re){var Ge=t.length;if(Re>Ge){var se=new li(Math.max(Ge*2,Re));se.set(t),t=se}},d=e.f||0,f=e.p||0,h=e.b||0,u=e.l,p=e.d,x=e.m,m=e.n,v=s*8;do{if(!u){d=hi(n,f,1);var y=hi(n,f+1,3);if(f+=3,y)if(y==1)u=vu,p=xu,x=9,m=5;else if(y==2){var M=hi(n,f,31)+257,g=hi(n,f+10,15)+4,_=M+hi(n,f+5,31)+1;f+=14;for(var L=new li(_),E=new li(19),A=0;A<g;++A)E[du[A]]=hi(n,f+A*3,7);f+=g*3;for(var U=ta(E),N=(1<<U)-1,P=Ms(E,U,1),A=0;A<_;){var B=P[hi(n,f,N)];f+=B&15;var T=B>>4;if(T<16)L[A++]=T;else{var F=0,k=0;for(T==16?(k=3+hi(n,f,3),f+=2,F=L[A-1]):T==17?(k=3+hi(n,f,7),f+=3):T==18&&(k=11+hi(n,f,127),f+=7);k--;)L[A++]=F}}var I=L.subarray(0,M),C=L.subarray(M);x=ta(I),m=ta(C),u=Ms(I,x,1),p=Ms(C,m,1)}else mi(1);else{var T=_u(f)+4,R=n[T-4]|n[T-3]<<8,S=T+R;if(S>s){l&&mi(0);break}o&&c(h+R),t.set(n.subarray(T,S),h),e.b=h+=R,e.p=f=S*8,e.f=d;continue}if(f>v){l&&mi(0);break}}o&&c(h+131072);for(var G=(1<<x)-1,W=(1<<m)-1,ee=f;;ee=f){var F=u[ia(n,f)&G],ne=F>>4;if(f+=F&15,f>v){l&&mi(0);break}if(F||mi(2),ne<256)t[h++]=ne;else if(ne==256){ee=f,u=null;break}else{var V=ne-254;if(ne>264){var A=ne-257,ie=Vc[A];V=hi(n,f,(1<<ie)-1)+qc[A],f+=ie}var ve=p[ia(n,f)&W],_e=ve>>4;ve||mi(3),f+=ve&15;var C=gu[_e];if(_e>3){var ie=Wc[_e];C+=ia(n,f)&(1<<ie)-1,f+=ie}if(f>v){l&&mi(0);break}o&&c(h+131072);var ae=h+V;if(h<C){var Le=r-C,rt=Math.min(C,ae);for(Le+h<0&&mi(3);h<rt;++h)t[h]=i[Le+h]}for(;h<ae;++h)t[h]=t[h-C]}}e.l=u,e.p=ee,e.b=h,e.f=d,u&&(d=1,e.m=x,e.d=p,e.n=m)}while(!d);return h!=t.length&&a?yu(t,0,h):t.subarray(0,h)},wu=new li(0),bu=function(n,e){return((n[0]&15)!=8||n[0]>>4>7||(n[0]<<8|n[1])%31)&&mi(6,"invalid zlib data"),(n[1]>>5&1)==+!e&&mi(6,"invalid zlib data: "+(n[1]&32?"need":"unexpected")+" dictionary"),(n[1]>>3&4)+2};function Eu(n,e){return Mu(n.subarray(bu(n,e&&e.dictionary),-4),{i:2},e&&e.out,e&&e.dictionary)}var Tu=typeof TextDecoder<"u"&&new TextDecoder,Au=0;try{Tu.decode(wu,{stream:!0}),Au=1}catch{}function An(n){if(!(n instanceof Uint8Array))throw Error("Text file is missing");if(n[0]===255&&n[1]===254)return new TextDecoder("utf-16le").decode(n);if(n[0]===254&&n[1]===255)return new TextDecoder("utf-16be").decode(n);try{return new TextDecoder("utf-8",{fatal:!0}).decode(n)}catch{return new TextDecoder("windows-1252").decode(n)}}function es(n,e="",t=!1){const i=String(n).normalize("NFC").replaceAll("\\","/");if(i.startsWith("/")||/^[a-z]:/i.test(i)||i.includes("\0"))throw Error("Unsafe archive path.");const s=e.split("/").filter(Boolean);for(const r of i.split("/"))if(!(!r||r==="."))if(r===".."){if(!t||!s.length)throw Error("Unsafe archive path.");s.pop()}else s.push(r);return s.join("/").toLowerCase()}function $r(n){const e={};let t="";for(const i of n.replace(/^\uFEFF/,"").split(/\r?\n/)){const s=i.replace(/;(?=(?:[^"']*["'][^"']*["'])*[^"']*$).*$/,"").trim(),r=s.match(/^\[(.+)\]$/);if(r){t=r[1].toLowerCase(),e[t]??(e[t]={});continue}const a=s.indexOf("=");a>0&&t&&(e[t][s.slice(0,a).trim().toLowerCase()]=s.slice(a+1).trim().replace(/^"(.*)"$/,"$1"))}return e}function Ru(n){const e=i=>An(n[i]);return Object.keys(n).filter(i=>i.endsWith(".def")).map(i=>({path:i,def:$r(e(i))})).filter(i=>{var s;return i.def.info&&((s=i.def.files)==null?void 0:s.sprite)}).map(i=>{const s=i.path.slice(0,i.path.lastIndexOf("/")+1),r=c=>es(c,s,!0),a=(c,d)=>{let f;try{f=r(d)}catch{f=null}const h=String(d).replaceAll("\\","/").split("/").at(-1);if(!f&&h&&h!=="."&&h!=="..")try{const m=r(h);n[m]&&(f=m)}catch{}if(/^(cns|cmd|st\d*|stcommon)$/.test(c)&&f&&!n[f]&&n[f+".zss"])return f+".zss";if(c!=="stcommon"||n[f])return f;const u=i.path.indexOf("/chars/"),p=u>=0?i.path.slice(0,u+1):"",x=[p+"data/",p].flatMap(m=>{try{return[es(d,m,!0)]}catch{return[]}});return(h==null?void 0:h.toLowerCase())==="common1.cns"&&x.push(p+"data/common1.cns","data/common1.cns"),x.find(m=>n[m])||x.map(m=>m+".zss").find(m=>n[m])||f},o=Object.entries(i.def.files).filter(([c,d])=>d&&/^(sprite|anim|cmd|cns|sound|stcommon|st\d*|pal\d+)$/.test(c)).map(([c,d])=>{const f=a(c,d);return{key:c,value:d,path:f,ok:!!f&&!!n[f],...f?{}:{message:"This resource is outside the ZIP. Include it in the package or use an in-package relative path."}}}),l=o.find(c=>c.key==="anim"&&c.ok);return{...i,checks:o,files:n,animations:l?Kc(e(l.path)):[],sprite:o.find(c=>c.key==="sprite"&&c.ok),palettes:o.filter(c=>/^pal\d+$/.test(c.key)).map(c=>({...c,number:Number(c.key.slice(3))}))}})}function Kc(n){var a;const e=[];let t,i,s,r;for(const[o,l]of n.replace(/^\uFEFF/,"").split(/\r?\n/).entries()){const c=l.split(";")[0].trim(),d=c.match(/^\[begin action\s+(-?\d+)\]\s*$/i);if(d){t={id:+d[1],frames:[],loopStart:0},e.push(t),i={1:[],2:[]},s={},r={};continue}if(!t||!c)continue;if(/^loopstart\s*$/i.test(c)){t.loopStart=t.frames.length;continue}const f=c.match(/^clsn([12])(default)?\s*:\s*(\d+)\s*$/i);if(f){const S=+f[1],M=+f[3];if(M>1024)throw Error(`AIR collision box limit exceeded on line ${o+1}`);const g=new Array(M);r[S]=g,f[2]?(i[S]=g,delete s[S]):s[S]=g;continue}const h=c.match(/^clsn([12])\s*\[\s*(\d+)\s*\]\s*=\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*$/i);if(h){const S=r[+h[1]],M=+h[2];if(!S||M>=S.length){(t.diagnostics??(t.diagnostics=[])).push({line:o+1,message:"AIR collision box index out of range; box ignored"});continue}S[M]=h.slice(3).map(Number);continue}const u=c.match(/^interpolate\s+(offset|blend|scale|angle)\s*$/i);if(u){const S=u[1].toLowerCase();t.frames.length?((a=t.frames.at(-1)).interpolate??(a.interpolate=[])).push(S):(t.loopInterpolate??(t.loopInterpolate=[])).push(S);continue}if(!/^-?\d+\s*,/.test(c))continue;const p=c.split(",").map(S=>S.trim()),x=p.slice(0,5).map(Number);if(p.length<5||x.some(S=>!Number.isFinite(S))||x[4]<-1)throw Error(`Invalid AIR frame on line ${o+1}`);const m=S=>{const M=s[S]??i[S];return Object.keys(M).length!==M.length&&(t.diagnostics??(t.diagnostics=[])).push({line:o+1,message:`Incomplete Clsn${S} definition; missing boxes ignored`}),M.filter(Boolean).map(g=>g.slice())},v=(S,M,g)=>{if(!p[S])return M;const _=Number(p[S]);return Number.isFinite(_)?_:((t.diagnostics??(t.diagnostics=[])).push({line:o+1,message:`Invalid AIR ${g} ignored; using ${M}`}),M)},y=v(7,1,"x-scale"),T=v(8,1,"y-scale"),R=v(9,0,"angle");t.frames.push({group:x[0],number:x[1],x:x[2],y:x[3],ticks:x[4],flip:(p[5]||"").toUpperCase(),blend:(p[6]||"").toUpperCase(),scaleX:y,scaleY:T,angle:R,clsn1:m(1),clsn2:m(2)}),s={}}return e.filter(o=>o.frames.length).map(o=>(o.loopStart>=o.frames.length&&(o.loopStart=0),o.loopInterpolate&&(o.frames.at(-1).interpolate=[...new Set([...o.frames.at(-1).interpolate||[],...o.loopInterpolate])]),delete o.loopInterpolate,o))}function Cu(n){if(!(n instanceof Uint8Array)||n.length<24||new TextDecoder().decode(n.subarray(0,12))!=="ElecbyteSnd\0")throw Error("Invalid SND signature");const e=new DataView(n.buffer,n.byteOffset,n.byteLength),t=e.getUint32(16,!0),i=[],s=new Map,r=new Set;if(t>1e4)throw Error("SND sample table too large");let a=e.getUint32(20,!0);for(let o=0;o<t;o++){if(a<24||a+16>n.length||r.has(a))throw Error("Invalid SND sample link");r.add(a);const l=e.getUint32(a,!0),c=e.getUint32(a+4,!0),d=e.getUint32(a+8,!0),f=e.getUint32(a+12,!0),h=a+16;if(c<12||c>32*1024*1024||h+c>n.length)throw Error("Invalid SND sample length");const u=n.subarray(h,h+c);if(new TextDecoder().decode(u.subarray(0,4))!=="RIFF"||new TextDecoder().decode(u.subarray(8,12))!=="WAVE")throw Error("Unsupported SND sample: expected WAV");if(new DataView(u.buffer,u.byteOffset,u.byteLength).getUint32(4,!0)+8>c)throw Error("Truncated SND WAV");const p={group:d,number:f,data:u};i.push(p),s.has(`${d},${f}`)||s.set(`${d},${f}`,u),a=l}return{samples:i,get:(o,l)=>s.get(`${o},${l}`)}}function Pu(n,e,t,i){const s=[137,80,78,71,13,10,26,10];if(n.length<33||!s.every((_,L)=>n[L]===_))throw Error("Invalid PNG signature");const r=new DataView(n.buffer,n.byteOffset,n.byteLength);let a,o,l,c,d,f,h=8,u=!1,p=0;const x=[];for(;h+12<=n.length;){const _=r.getUint32(h),L=h+8,E=L+_;if(_>64*1024*1024||E+4>n.length)throw Error("Invalid PNG chunk length");const A=String.fromCharCode(...n.subarray(h+4,h+8));if(A==="IHDR"){if(h!==8||_!==13||a!==void 0)throw Error("Invalid PNG header");if(a=r.getUint32(L),o=r.getUint32(L+4),c=n[L+9],l={0:1,2:3,3:1,4:2,6:4}[c],!a||!o||a*o>4e6||e!==void 0&&a!==e||t!==void 0&&o!==t)throw Error("Invalid PNG dimensions");if(n[L+8]!==8||!l||n[L+10]||n[L+11]||n[L+12])throw Error("Unsupported PNG encoding: requires non-interlaced 8-bit channels")}else{if(a===void 0)throw Error("PNG header must be first");if(A==="PLTE"){if(!_||_>768||_%3)throw Error("Invalid PNG palette");d=n.subarray(L,E)}else if(A==="tRNS")f=n.subarray(L,E);else if(A==="IDAT"){if(p+=_,p>64*1024*1024)throw Error("PNG compressed data too large");x.push(n.subarray(L,E))}else if(A==="IEND"){if(_)throw Error("Invalid PNG end chunk");u=!0;break}else if(A[0]===A[0].toUpperCase())throw Error("Unsupported PNG critical chunk: "+A)}h=E+4}if(!u||!x.length)throw Error("Truncated PNG");if(c===3&&!i&&!d)throw Error("PNG palette missing");const m=new Uint8Array(p);let v=0;for(const _ of x)m.set(_,v),v+=_.length;const y=a*l,T=(y+1)*o,R=Eu(m,{out:new Uint8Array(T+1)});if(R.length!==T)throw Error("Invalid PNG pixel data length");const S=new Uint8Array(y*o),M=(_,L,E)=>{const A=_+L-E,U=Math.abs(A-_),N=Math.abs(A-L),P=Math.abs(A-E);return U<=N&&U<=P?_:N<=P?L:E};for(let _=0;_<o;_++){const L=R[_*(y+1)];if(L>4)throw Error("Invalid PNG scanline filter");for(let E=0;E<y;E++){const A=_*y+E,U=E>=l?S[A-l]:0,N=_?S[A-y]:0,P=_&&E>=l?S[A-y-l]:0,B=L===0?0:L===1?U:L===2?N:L===3?Math.floor((U+N)/2):M(U,N,P);S[A]=R[_*(y+1)+1+E]+B&255}}const g=new Uint8ClampedArray(a*o*4);for(let _=0;_<a*o;_++){const L=_*l,E=_*4;if(c===3){const A=S[L],U=A*(i?4:3),N=i||d;if(U+2>=N.length)throw Error("PNG palette index out of range");g[E]=N[U],g[E+1]=N[U+1],g[E+2]=N[U+2],g[E+3]=i?N[U+3]:(f==null?void 0:f[A])??255}else if(c===0||c===4){const A=S[L];let U=c===4?S[L+1]:255;c===0&&(f==null?void 0:f.length)===2&&A===(f[0]<<8|f[1])&&(U=0),g[E]=A,g[E+1]=A,g[E+2]=A,g[E+3]=U}else{const A=S[L],U=S[L+1],N=S[L+2];let P=c===6?S[L+3]:255;c===2&&(f==null?void 0:f.length)===6&&A===(f[0]<<8|f[1])&&U===(f[2]<<8|f[3])&&N===(f[4]<<8|f[5])&&(P=0),g[E]=A,g[E+1]=U,g[E+2]=N,g[E+3]=P}}return{w:a,h:o,rgba:g,...c===3?{indices:S}:{}}}function wl(n,e,t){const i=new Uint8Array(e);let s=0,r=0,a=0,o=0;const l=()=>{if(s>=n.length)throw Error("Truncated sprite data");return n[s++]},c=(d,f)=>{if(d<1||r+d>e)throw Error("Invalid sprite run");i.fill(f,r,r+d),r+=d};if(t===0){if(n.length<e)throw Error("Truncated raw sprite");return n.slice(0,e)}if(t===2){for(;r<e;){let d=l();if((d&192)===64){let f=d&63;c(f,l())}else c(1,d)}return i}if(t===3){for(;r<e;){let d=l()+1,f=l(),h=f&127,u=f&128?l():0;for(c(d,u);h--;){let p=l();c((p>>5)+1,p&31)}}return i}if(t!==4)throw Error("Unsupported sprite compression "+t);for(;r<e;){let d=l();for(let f=0;f<8&&r<e;f++){let h=l();if(d&1<<f){let u,p;if((h&63)===0?(p=(h<<2|l())+1,u=l()+3):(a|=(h&192)>>o,o+=2,u=(h&63)+1,o<8?p=l()+1:(p=a+1,a=0,o=0)),p>r||r+u>e)throw Error("Invalid sprite backreference");for(;u--;)i[r]=i[r-p],r++}else{let u;h&224?(u=h>>5,h&=31):u=l()+8,c(u,h)}}}return i}function gr(n,e,t="SFF palette index out of range"){const i=new Uint32Array(Math.ceil(e.length/4));new Uint8Array(i.buffer).set(e);const s=new Uint8ClampedArray(n.length*4),r=new Uint32Array(s.buffer);for(let a=0;a<n.length;a++){const o=n[a];if(o*4+2>=e.length)throw Error(t);r[a]=i[o]}return s}function Zc(n,e={}){if(!(n instanceof Uint8Array)||n.length<32||new TextDecoder().decode(n.subarray(0,12))!=="ElecbyteSpr\0")throw Error("Invalid SFF signature");if(n[15]===1)return Lu(n,e);if(n[15]!==2)throw Error("Unsupported SFF version");if(n.length<68)throw Error("Truncated SFF header");const t=new DataView(n.buffer,n.byteOffset,n.byteLength),i=S=>t.getUint32(S,!0),s=S=>t.getInt16(S,!0),r=S=>t.getUint16(S,!0),a=i(36),o=i(40),l=i(44),c=i(48),d=i(52),f=i(60);if(o>2e4||c>4096)throw Error("SFF table too large");if(a+o*28>n.length||l+c*16>n.length)throw Error("Truncated SFF table");const h=[],u=new Gc({maxBytes:e.cacheBytes??16*1024*1024,sizeOf:S=>{var M;return S.rgba.byteLength+(((M=S.indices)==null?void 0:M.byteLength)||0)}}),p=new Map,x=Array.from({length:c},(S,M)=>({index:M,group:r(l+M*16),number:r(l+M*16+2),colors:r(l+M*16+4)}));for(let S=0;S<o;S++){const M=a+S*28;h.push({group:r(M),number:r(M+2),w:r(M+4),h:r(M+6),x:s(M+8),y:s(M+10),link:r(M+12),format:n[M+14],depth:n[M+15],offset:i(M+16),length:i(M+20),palette:r(M+24),flags:r(M+26)})}function m(S,M=new Set){if(p.has(S))return p.get(S);if(S>=c||M.has(S))throw Error("Invalid palette link");M.add(S);const g=l+S*16,_=i(g+12);if(!_)return m(r(g+6),M);const L=d+i(g+8);if(_%4||L+_>n.length)throw Error("Invalid SFF palette length");const E=n.slice(L,L+_);if(!n[13]&&!n[14])for(let A=0;A<E.length/4;A++)E[A*4+3]=A?255:0;return p.set(S,E),E}function v(S,M=new Set){if(u.has(S))return u.get(S);if(!Number.isInteger(S)||S<0||S>=h.length||M.has(S))throw Error("Invalid sprite link");M.add(S);const g=h[S];if(!g.length){const A=v(g.link,M),U={...A,...g,w:A.w,h:A.h,rgba:A.rgba};return A.indices&&g.palette!==A.palette&&(U.rgba=gr(A.indices,m(g.palette),"Linked sprite palette index out of range")),u.set(S,U),U}if(!g.w||!g.h||g.w*g.h>4e6)throw Error("Invalid SFF sprite dimensions");const _=(g.flags&1?f:d)+g.offset;if(_+g.length>n.length||g.length<(g.format?4:0))throw Error("Truncated SFF sprite data");const L=n.subarray(_+(g.format?4:0),_+g.length);let E;if(g.format>=10&&g.format<=12)E={...g,...Pu(L,g.w,g.h,g.format===10&&c?m(g.palette):void 0)};else{if(g.depth!==8&&g.depth!==5)throw Error("Unsupported non-indexed SFF compression: "+g.format);const A=wl(L,g.w*g.h,g.format),U=gr(A,m(g.palette));E={...g,rgba:U,indices:A}}return u.set(S,E),E}function y(S,M,g){const _=v(S);if(!_.indices)return _;const L=x.find(U=>U.group===M&&U.number===g);if(!L)throw Error(`Palette ${M},${g} does not exist`);const E=x[_.palette];if(E&&Math.ceil(Math.log2(E.colors))!==Math.ceil(Math.log2(L.colors)))return _;const A=gr(_.indices,m(L.index),"Palette depth does not match indexed sprite");return{..._,rgba:A}}function T(S,M=new Set){if(!Number.isInteger(S)||S<0||S>=h.length||M.has(S))throw Error("Invalid sprite link");M.add(S);const g=h[S];if(!g.length){const L=T(g.link,M);return L?{...L,...g,w:L.w,h:L.h,colors:m(g.palette)}:null}if(!g.w||!g.h||g.w*g.h>4e6)throw Error("Invalid SFF sprite dimensions");if(g.format>=10||![5,8].includes(g.depth))return null;const _=(g.flags&1?f:d)+g.offset;if(_+g.length>n.length||g.length<(g.format?4:0))throw Error("Truncated SFF sprite data");return{...g,indices:wl(n.subarray(_+(g.format?4:0),_+g.length),g.w*g.h,g.format),colors:m(g.palette)}}return{sprites:h,decode:v,decodeIndexed:T,decodeWithPalette:y,paletteColors:(S,M)=>{const g=x.find(_=>_.group===S&&_.number===M);if(!g)throw Error(`Palette ${S},${M} does not exist`);return m(g.index).slice()},palettes:x,version:2,clearDecodedCache:()=>u.clear(),cacheStats:()=>({bytes:u.bytes,entries:u.size,evictions:u.evictions})}}function Lu(n,{externalPalettes:e=new Map,cacheBytes:t=16*1024*1024}={}){var g;const i=new DataView(n.buffer,n.byteOffset,n.byteLength),s=_=>i.getUint32(_,!0),r=_=>i.getUint16(_,!0),a=_=>i.getInt16(_,!0),o=[],l=[],c=[],d=new Set,f=s(20);let h=s(24),u=-1,p=-1;if(f>2e4)throw Error("SFF table too large");const x=_=>{const L=new Uint8Array(1024);for(let E=0;E<256;E++)L.set([_[E*3],_[E*3+1],_[E*3+2],E?255:0],E*4);return c.push(L),c.length-1};for(let _=0;_<f;_++){if(h<32||h+32>n.length||d.has(h))throw Error("Invalid SFF v1 sprite table link");d.add(h);const L=s(h+4),E={group:r(h+12),number:r(h+14),x:a(h+8),y:a(h+10),link:r(h+16),offset:h+32,length:L,shared:n[h+18],palette:u};if(E.offset+L>n.length)throw Error("Truncated SFF v1 sprite");if(L){const A=L>=897&&n[E.offset+L-769]===12;(!E.shared||u<0)&&A&&(E.palette=x(n.subarray(E.offset+L-768,E.offset+L))),E.palette<0&&e.has(1)&&(c.push(e.get(1)),E.palette=c.length-1),E.palette>=0&&p<0&&(p=E.palette),E.group===0&&E.number===0&&E.palette>=0&&(p=E.palette),u=E.palette}else E.palette=void 0;if(o.push(E),h=s(h),!h&&_+1<f)throw Error("Truncated SFF v1 sprite table")}const m=c[p];if(m)for(const _ of o)_.palette>=0&&((g=c[_.palette])!=null&&g.every((L,E)=>L===m[E]))&&(_.palette=p);for(let _=0;_<c.length;_++)l.push({index:_,group:_===p?1:0,number:_===p?1:_+1,colors:256});for(const[_,L]of e){if(!(L instanceof Uint8Array)||L.length!==1024||!Number.isInteger(_)||_<1||_>256)throw Error("Invalid external SFF palette");if(_===1&&p>=0)c[p]=L;else{const E=c.length;c.push(L),l.push({index:E,group:1,number:_,colors:256})}}const v=new Gc({maxBytes:t,sizeOf:_=>{var L;return _.rgba.byteLength+(((L=_.indices)==null?void 0:L.byteLength)||0)}});function y(_,L){return{..._,rgba:gr(_.indices,L)}}function T(_,L=new Set){if(v.has(_))return v.get(_);if(!Number.isInteger(_)||_<0||_>=o.length||L.has(_))throw Error("Invalid SFF v1 sprite link");L.add(_);const E=o[_];if(!E.length){const ne=T(E.link,L);E.palette=ne.palette;const V={...ne,...E,w:ne.w,h:ne.h};return v.set(_,V),V}const A=n.subarray(E.offset,E.offset+E.length);if(A.length<128||A[0]!==10||A[2]!==1||A[3]!==8||A[65]!==1)throw Error("Only indexed 8-bit PCX sprites are supported");const U=new DataView(A.buffer,A.byteOffset,A.byteLength),N=U.getUint16(8,!0)-U.getUint16(4,!0)+1,P=U.getUint16(10,!0)-U.getUint16(6,!0)+1,B=U.getUint16(66,!0);if(N<=0||P<=0||N*P>4e6||B*P>8e6||B<N)throw Error("Invalid PCX dimensions");const F=c[E.palette];if(!F)throw Error("PCX palette missing");const k=A.length>=897&&A[A.length-769]===12?A.length-769:A.length,I=new Uint8Array(B*P);let C=128,G=0;for(;G<I.length;){if(C>=k)throw Error("Truncated PCX");let ne=A[C++],V=1;if((ne&192)===192){if(V=ne&63,C>=k)throw Error("Truncated PCX run");ne=A[C++]}if(!V||G+V>I.length)throw Error("Invalid PCX run");I.fill(ne,G,G+V),G+=V}const W=new Uint8Array(N*P);for(let ne=0;ne<P;ne++)W.set(I.subarray(ne*B,ne*B+N),ne*N);const ee=y({...E,w:N,h:P,indices:W},F);return v.set(_,ee),ee}function R(_,L,E){const A=T(_),U=l.find(N=>N.group===L&&N.number===E);if(!U)throw Error(`Palette ${L},${E} does not exist`);return y(A,c[U.index])}return{sprites:o,palettes:l,decode:T,decodeIndexed:_=>{const L=T(_);return{...L,colors:c[L.palette]}},decodeWithPalette:R,paletteColors:(_,L)=>{const E=l.find(A=>A.group===_&&A.number===L);if(!E)throw Error(`Palette ${_},${L} does not exist`);return c[E.index].slice()},version:1,clearDecodedCache:()=>v.clear(),cacheStats:()=>({bytes:v.bytes,entries:v.size,evictions:v.evictions})}}function Iu(n){if(!(n instanceof Uint8Array)||![768,772].includes(n.length))throw Error("ACT palette must contain 768 RGB bytes, with an optional 4-byte footer.");const e=new Uint8Array(1024);for(let t=0;t<256;t++){const i=(255-t)*3;e.set([n[i],n[i+1],n[i+2],t?255:0],t*4)}return e}const na=new WeakMap;function vr(n){let e=n,t=0;for(;e&&t++<256;){if(e.ownPal||e.ownpal)return e;const i=e.paletteParent||e.parent||e.owner;if(!i||i===e)return e;e=i}return e}const Xo=n=>new Map([...n||[]].map(([e,t])=>[e,[...t]]));function xr(n){const e={...n};for(const[t,i]of[["add",[0,0,0]],["mul",[256,256,256]],["sinadd",[0,0,0,0]]])if(e[t]!==void 0){const s=Array.isArray(e[t])?e[t]:[e[t]];e[t]=i.map((r,a)=>{const o=Math.trunc(Number(s[a]??r));return t==="mul"?Math.max(0,o):o})}return e.time!==void 0&&(e.time=Math.trunc(Number(e.time))),e.color!==void 0&&(e.color=Math.max(0,Math.min(256,Math.trunc(Number(e.color))))),e.invertall!==void 0&&(e.invertall=+!!e.invertall),e}function $o(n,e,t){const i=Array.isArray(t)?t:[t],s=[Math.trunc(Number(i[0]??-1)),Math.trunc(Number(i[1]??0))];if(s[0]!==-1){if(s[0]<0||s[1]<0)throw Error("Invalid RemapPal palette pair.");Jc(e,[-1,0],s),n.clear(),n.set("*",s)}}function Jc(n,e,t){var a,o;if(!((a=n.sprite)!=null&&a.path)||!((o=n.files)!=null&&o[n.sprite.path]))return;const i=jc(n),s=l=>i.palettes.find(c=>c.group===l[0]&&c.number===l[1]),r=s(t);if(!r)throw Error(`RemapPal destination palette ${t.join(",")} does not exist.`);if(e[0]!==-1){const l=s(e);if(!l)throw Error(`RemapPal source palette ${e.join(",")} does not exist.`);if(l.colors&&r.colors&&Math.ceil(Math.log2(l.colors))!==Math.ceil(Math.log2(r.colors)))throw Error("RemapPal source and destination color depths differ.")}}function jc(n){var o,l;if(na.has(n))return na.get(n);const e=[],t=new Map,i=n.files,s=n.path.slice(0,n.path.lastIndexOf("/")+1);for(const[c,d]of Object.entries(n.def.files||{}))if(/^pal\d+$/.test(c)&&d)try{const f=Number(c.slice(3));if(f<1||f>256)throw Error(`Invalid palette number ${f}.`);const h=(o=n.checks)==null?void 0:o.find(p=>p.key===c);let u;if(h)u=h.ok?h.path:null;else try{u=es(d,s,!0)}catch{u=null}if(!u||!i[u])throw Error(`Palette file is missing from the ZIP: ${d}`);t.set(f,Iu(i[u]))}catch(f){e.push({type:"palette",source:n.path,line:0,message:f.message})}const r=Zc(i[n.sprite.path],{externalPalettes:t});r.diagnostics=e,r.selectablePalettes=[...new Set((r.palettes||[]).filter(c=>c.group===1&&c.number>=1&&c.number<=12).map(c=>c.number))].sort((c,d)=>c-d),r.selectablePalettes.length||(r.selectablePalettes=[1]);const a=String(((l=n.def.info)==null?void 0:l["pal.defaults"])||"1").split(",").map(Number);return r.defaultPalette=a.find(c=>r.selectablePalettes.includes(c))??r.selectablePalettes[0],na.set(n,r),r}function Du(n,e){var c,d;const t=((c=n.world)==null?void 0:c.orderedPhases)&&n.isProjectile&&n.removalReason==="expire",i=n.hitDef||(t?n.proximityHitDef:null);if(n===e||n.destroyed||!i&&(!((d=n.world)!=null&&d.orderedPhases)||n.isProjectile)||n.moveType!=="A"||n.isProjectile&&((n.removed||n.removing)&&!(t&&n.drawVisible)||n.remainingHits<=0||n.owner===e||!/^[SCA]\s*,\s*[NSH][ATP]$/i.test(String(i.attr??"").trim())))return!1;const s=String((i==null?void 0:i.affectteam)??"E").trim().toUpperCase(),r=!!(n.world&&e.world&&n.teamSide===e.teamSide);if(s==="E"&&r||s==="F"&&!r)return!1;const a=(i==null?void 0:i.coordinateScale)??n.coordinateScale??1;let o;(i==null?void 0:i["guard.dist"])!==void 0?o=i["guard.dist"]*a:n.isProjectile?o=n.guardDistance:n.attackDist!==void 0?o=n.attackDist*n.coordinateScale:o=n.constant("size.attack.dist")*n.coordinateScale;const l=(e.pos.x-n.pos.x)*n.facing;return l>0&&l<o}function Qc(n,e){for(const t of e)if(Du(t,n))return!0;return!1}class ht extends Error{constructor(e,t=""){super(e),this.name="ExpressionError",this.source=t}}class Gi extends ht{constructor(e,t=""){super(e,t),this.name="UnsupportedExpressionError"}}class Ct extends ht{constructor(e,t=""){super(e,t),this.name="BottomError",this.bottom=!0}}const Wa=8192,bl=2048,El=96,Nu=8192,Cn=new Map,Uu={"||":1,"^^":2,"&&":3,"|":4,"^":5,"&":6,":=":7,"=":8,"!=":8,"<":9,">":9,"<=":9,">=":9,"+":10,"-":10,"*":11,"/":11,"%":11,"**":12},_r=new Set(["=","!=","<","<=",">",">="]),Fu=new Set(["parent","root","helper","target","partner","enemy","enemynear","playerid","p2"]),Ou=new Set(["pos","vel","p2dist","p2bodydist","parentdist","rootdist","screenpos","hitvel","camerapos"]),eh=new Set(["s","c","a","h","l","i","n","v","u"]),ku=new Set(["const","gethitvar","stagevar","map"]),Bu=new Set(["xveladd","yveladd","xoff","yoff","zoff","xvel","yvel","yaccel","fall.xvel","fall.yvel","fall.envshake.freq","fall.envshake.phase"]),zu=/^(?:fvar|sysfvar|const240p|const480p|const720p|pos [xy]|vel [xy]|p2dist [xy]|p2bodydist [xy]|parentdist [xy]|rootdist [xy]|screenpos [xy]|hitvel [xy]|camerapos [xy]|camerazoom|gamewidth|gameheight|screenwidth|screenheight|leftedge|rightedge|topedge|bottomedge|(?:front|back)edge(?:body)?dist|frontedge|backedge)$/,Hu=n=>/^(?:velocity\.|movement\.(?!airjump\.)|size\.[xy]scale$|data\.fall\.defence_mul$)/.test(n),Cr={abs:[1,Math.abs],ceil:[1,Math.ceil],floor:[1,Math.floor],exp:[1,Math.exp],ln:[1,Math.log],log:[2,(n,e)=>Math.log(e)/Math.log(n)],sin:[1,Math.sin],cos:[1,Math.cos],tan:[1,Math.tan],asin:[1,Math.asin],acos:[1,Math.acos],atan:[1,Math.atan],sqrt:[1,Math.sqrt],min:[2,Math.min],max:[2,Math.max]},Tl=new Set(["var","fvar","sysvar","sysfvar","animelemtime","animelemno","animexist","selfanimexist","const","const240p","const480p","const720p","gethitvar","stagevar","numprojid","playeridexist","projcanceltime","projcontacttime","projguardedtime","projhittime"]),Gu=new Set(["numhelper","numexplod","numtarget","ishelper"]),Vu=new Set(["name","authorname","p1name","p2name","p3name","p4name"]),Wu=new Set("time stateno prevstateno anim animtime ctrl statetype movetype physics life lifemax power powermax facing alive gametime hitpausetime hitshakeover hitover movecontact movehit moveguarded movereversed hitcount uniqhitcount numenemy numpartner numproj roundstate roundno matchno teamside teampower tickspersecond ailevel palno id name authorname p1name p2name p3name p4name win lose drawgame inguarddist canrecover roundsexisted hitfall ishometeam teammode leftedge rightedge topedge bottomedge frontedge backedge frontedgedist backedgedist frontedgebodydist backedgebodydist gamewidth gameheight screenwidth screenheight camerazoom winko wintime winperfect loseko losetime loseperfect random pi e".split(" "));function Xu(n){if(typeof n!="string")throw new ht("Expression must be text.");if(n.length>Wa)throw new ht(`Expression exceeds ${Wa} characters.`);const e=[];let t=0;for(;t<n.length;){if(/\s/.test(n[t])){t++;continue}const i=t,s=n.slice(t);let r;if(n[t]==='"'){t++;let a="",o=!1;for(;t<n.length;){const l=n[t++];if(l==='"'){o=!0;break}l==="\\"&&n[t]==='"'?(a+='"',t++):a+=l}if(!o)throw new ht(`Unterminated string at ${i}.`,n);e.push({type:"string",value:a,position:i})}else if(r=s.match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/)){const a=Number(r[0]);if(!Number.isFinite(a))throw new ht(`Invalid number at ${i}.`,n);e.push({type:"number",value:a,float:/[.eE]/.test(r[0]),position:i}),t+=r[0].length}else if(r=s.match(/^[a-z_][a-z0-9_.]*/i))e.push({type:"name",value:r[0].toLowerCase(),position:i}),t+=r[0].length;else if(r=s.match(/^(?:\*\*|:=|<=|>=|!=|&&|\|\||\^\^|[+\-*/%!~&|^=<>()[\],])/))e.push({type:"operator",value:r[0],position:i}),t+=r[0].length;else throw new Gi(`Unsupported token at ${i}: ${n[t]}`,n);if(e.length>bl)throw new ht(`Expression exceeds ${bl} tokens.`,n)}return e.push({type:"end",value:"",position:t}),e}let $u=class{constructor(e){this.source=e,this.tokens=Xu(e),this.index=0,this.depth=0}peek(e=0){return this.tokens[this.index+e]||this.tokens.at(-1)}take(){return this.tokens[this.index++]}accept(e){return this.peek().value!==e?!1:(this.index++,!0)}expect(e){this.accept(e)||this.fail(`Expected "${e}"`)}fail(e){throw new ht(`${e} at ${this.peek().position}.`,this.source)}signedInteger(){const e=this.accept("-")?-1:(this.accept("+"),1),t=this.take();return(t.type!=="number"||t.float)&&this.fail("Expected an integer literal"),{kind:"number",value:e*t.value,float:!1}}parse(e=0){++this.depth>El&&this.fail(`Expression nesting exceeds ${El}`);let t=this.prefix();for(;;){const i=this.peek().value,s=Uu[i];if(s===void 0||s<e)break;if(this.take(),(i==="="||i==="!=")&&(this.peek().value==="["||this.isOpenInterval())){const r=this.take().value,a=this.parse();this.expect(",");const o=this.parse(),l=this.take().value;l!=="]"&&l!==")"&&this.fail("Expected an interval endpoint"),t={kind:"range",op:i,left:t,low:a,high:o,includeLow:r==="[",includeHigh:l==="]"}}else{const r=this.parse(s+(i===":="?0:1));i===":="?((t.kind!=="call"||!["var","fvar"].includes(t.name)||t.args.length!==1)&&this.fail("Assignment requires var(index) or fvar(index)"),t={kind:"assign",left:t,right:r}):t={kind:"binary",op:i,left:t,right:r}}}return this.depth--,t}isOpenInterval(){if(this.peek().value!=="(")return!1;const e=this.index,t=this.depth;try{return this.prefix(),!1}catch{}finally{this.index=e,this.depth=t}let i=0;for(let s=this.index;s<this.tokens.length;s++){const r=this.tokens[s].value;if(r==="("||r==="[")i++;else if(r===")"||r==="]"){if(--i===0)return!1}else if(r===","&&i===1)return!0}return!1}prefix(){const e=this.take();if(e.type==="number")return{kind:"number",value:e.value,float:e.float};if(e.type==="string")return{kind:"string",value:e.value};if(["+","-","!","~"].includes(e.value))return{kind:"unary",op:e.value,value:this.parse(13)};if(e.value==="("){const r=this.parse();return this.expect(")"),r}e.type!=="name"&&this.fail("Expected a value");const t=e.value;if(Vu.has(t)&&["=","!="].includes(this.peek().value)){const r=this.take().value,a=this.take();return a.type!=="string"&&this.fail(`${t} comparison requires a quoted name`),{kind:"binary",op:r,left:{kind:"name",name:t},right:{kind:"string",value:a.value}}}if(["statetype","movetype","p2statetype","p2movetype"].includes(t)&&["=","!="].includes(this.peek().value)&&this.peek(1).type==="name"&&eh.has(this.peek(1).value)){const r=this.take().value,a=this.take().value;return{kind:"binary",op:r,left:{kind:"name",name:t},right:{kind:"string",value:a.toUpperCase()}}}if(t==="teammode"&&["=","!="].includes(this.peek().value)){const r=this.take().value,a=this.take();return(a.type!=="name"||!["single","simul","turns"].includes(a.value))&&this.fail("TeamMode requires Single, Simul or Turns"),{kind:"binary",op:r,left:{kind:"name",name:t},right:{kind:"string",value:a.value}}}const i=t.match(/^proj(hit|contact|guarded)(\d*)$/);if(i&&this.accept("=")){const r=this.signedInteger();[0,1].includes(r.value)||this.fail("Projectile condition requires 0 or 1");let a="=",o={kind:"number",value:1,float:!1};return this.accept(",")&&(_r.has(this.peek().value)&&(a=this.take().value),o=this.signedInteger()),{kind:"legacyprojectile",name:`proj${i[1]}time`,id:Number(i[2]||0),expected:r.value,op:a,time:o}}if(t==="command"&&["=","!="].includes(this.peek().value)){const r=this.take().value,a=this.take();return a.type!=="string"&&this.fail("Command comparison requires a quoted name"),{kind:"command",op:r,command:a.value}}if(t==="animelem"&&this.accept("=")){const r=this.signedInteger();let a="=",o={kind:"number",value:0,float:!1};return this.accept(",")&&(_r.has(this.peek().value)&&(a=this.take().value),o=this.signedInteger()),{kind:"legacyanim",element:r,op:a,time:o}}if(t==="timemod"&&_r.has(this.peek().value)){const r=this.take().value,a=this.signedInteger();return this.expect(","),{kind:"legacytime",op:r,divisor:a,remainder:this.signedInteger()}}if(t==="hitdefattr"&&["=","!="].includes(this.peek().value)){const r=this.take().value,a=this.take();(a.type!=="name"||!/^[sca]+$/.test(a.value))&&this.fail("HitDefAttr requires state letters S, C or A");const o=[a.value.toUpperCase()];this.expect(",");do{const l=this.take();(l.type!=="name"||!/^[nsha][atp]$/.test(l.value))&&this.fail("HitDefAttr requires attack attributes such as NA or ST"),o.push(l.value.toUpperCase())}while(this.peek().value===","&&this.peek(1).type==="name"&&/^[nsha][atp]$/.test(this.peek(1).value)&&this.accept(","));return{kind:"legacyattribute",op:r,attributes:o}}let s;if(this.accept("(")){const r=[];if(!this.accept(")")){do r.push(this.parse());while(this.accept(","));this.expect(")")}(Tl.has(t)||Gu.has(t))&&r.length!==1&&this.fail(`${t} requires one argument`),Wu.has(t)&&r.length&&this.fail(`${t} requires no arguments`);const a=Object.hasOwn(Cr,t)?Cr[t][0]:["cond","ifelse"].includes(t)?3:null;a!==null&&r.length!==a&&this.fail(`${t} requires ${a} argument(s)`),s={kind:"call",name:t,args:r}}else{Tl.has(t)&&this.fail(`${t} requires a parameter list`);let r=t;Ou.has(t)&&this.peek().type==="name"&&/^[xy]$/.test(this.peek().value)&&(r+=" "+this.take().value),s={kind:"name",name:r}}return Fu.has(t)&&this.accept(",")?{kind:"redirect",target:s,value:this.prefix()}:s}};function Hi(n){if(typeof n!="string"||n.length>Wa)throw new ht("Invalid or oversized argument list.");const e=[];let t=0,i=!1,s=!1,r=0;for(let a=0;a<n.length;a++){const o=n[a];if(o==='"'&&!s&&(i=!i),s=o==="\\"&&!s,!i)if(o==="("||o==="[")t++;else if(o===")"||o==="]"){if(--t<0)throw new ht("Unbalanced argument list.")}else o===","&&t===0&&(e.push(n.slice(r,a).trim()),r=a+1)}if(i||t)throw new ht("Unbalanced argument list.");return e.push(n.slice(r).trim()),e}function qo(n){const e=new $u(n),t=e.parse();e.peek().type!=="end"&&e.fail("Unexpected token");const i=s=>{for(const r of Object.values(s))Array.isArray(r)?(r.forEach(a=>a&&typeof a=="object"&&i(a)),Object.freeze(r)):r&&typeof r=="object"&&i(r);return Object.freeze(s)};return i(t)}function th(n){if(Cn.has(n))return Cn.get(n);const e=qo(n),t=i=>qu(e,i||{},n);return Cn.size>=512&&Cn.delete(Cn.keys().next().value),Cn.set(n,t),t}function Pr(n,e={}){return th(n)(e)}function Xa(n,e={}){return th(n)({...e,typedResult:!0})}const Wt=(n,e=!1)=>{if(typeof n!="number"||!Number.isFinite(n))throw new Ct("Expression produced a non-finite number.");const t=e?Math.fround(n):n|0;if(!Number.isFinite(t))throw new Ct("Expression produced a non-finite number.");return{value:t,float:e}},St=n=>Wt(n,!1);function zt(n){if(n.bottom)throw n.error;if(typeof n.value!="number")throw new Ct("A numeric value is required.");return n.value}function ls(n){return zt(n)!==0}function Bs(n,e,t){if(e.bottom||t.bottom)throw(e.bottom?e:t).error;if(e.absent||t.absent){if(!["=","!="].includes(n))throw new ht("Only equality comparisons are allowed for strings.");return St(+(n==="!="))}if(typeof e.value!=typeof t.value)throw new Ct("Cannot compare a string with a number.");if(typeof e.value=="string"&&!["=","!="].includes(n))throw new ht("Only equality comparisons are allowed for strings.");switch(typeof e.value=="number"&&(e.float||t.float)&&(e={value:Math.fround(e.value)},t={value:Math.fround(t.value)}),n){case"=":return St(+(e.value===t.value));case"!=":return St(+(e.value!==t.value));case"<":return St(+(e.value<t.value));case"<=":return St(+(e.value<=t.value));case">":return St(+(e.value>t.value));case">=":return St(+(e.value>=t.value))}}function qu(n,e,t){let i=0;const s=(a,o,l)=>{if(typeof e.resolve!="function")throw new Gi(`Unsupported trigger: ${a}.`,t);const c=e.resolve(a,o,l);if(typeof c=="number")return Wt(c,zu.test(a)||a==="gethitvar"&&Bu.has(String(o[0]).toLowerCase())||a==="const"&&Hu(String(o[0]).toLowerCase())||!Number.isInteger(c));if(typeof c=="boolean")return St(Number(c));if(typeof c=="string")return{value:c};if(c!=null&&c.absent)return{value:"",absent:!0};if(c&&typeof c.value=="number")return Wt(c.value,c.type==="float"||c.float);throw new Gi(`Trigger ${a} returned no supported value.`,t)},r=(a,o=null)=>{var l,c,d;if(++i>Nu)throw new ht("Expression evaluation budget exceeded.",t);try{switch(a.kind){case"number":return Wt(a.value,a.float);case"string":return{value:a.value};case"name":return a.name==="pi"?Wt(Math.PI,!0):a.name==="e"?Wt(Math.E,!0):eh.has(a.name)?{value:a.name.toUpperCase()}:s(a.name,[],o);case"unary":{const f=r(a.value,o),h=zt(f);if(a.op==="+")return f;if(a.op==="-")return Wt(-h,f.float);if(a.op==="!")return St(+(h===0));if(f.float)throw new Ct("Bitwise operators require integers.",t);return St(~h)}case"redirect":{if(o)throw new Gi("Recursive trigger redirection is unsupported by MUGEN 1.1.",t);const f=((l=a.target.args)==null?void 0:l.map(h=>zt(r(h))))||[];return r(a.value,{name:a.target.name,args:f})}case"assign":{if(o)throw new ht("Variable assignment cannot be redirected.",t);if(typeof e.assign!="function")throw new Gi("Variable assignment is unavailable.",t);const f=a.left.args.map(m=>zt(r(m))),h=r(a.right),u=zt(h),p=a.left.name==="var"?Math.trunc(u)|0:Math.fround(u),x=e.assign(a.left.name,f,p);return Wt(typeof x=="number"?x:p,a.left.name==="fvar")}case"range":{const f=[r(a.left,o),r(a.low,o),r(a.high,o)],h=f.some(v=>v.float),[u,p,x]=f.map(v=>h?Math.fround(zt(v)):zt(v)),m=(a.includeLow?u>=p:u>p)&&(a.includeHigh?u<=x:u<x);return St(Number(a.op==="="?m:!m))}case"legacyanim":return Bs(a.op,s("animelemtime",[a.element.value],o),r(a.time,o));case"legacytime":{const f=a.divisor.value;if(f<=0)throw new ht("TimeMod divisor must be positive.",t);return Bs(a.op,St(zt(s("time",[],o))%f),r(a.remainder,o))}case"legacyprojectile":{const f=s(a.name,[a.id],o),h=zt(f)>=0&&ls(Bs(a.op,f,r(a.time,o)));return St(Number(a.expected?h:!h))}case"legacyattribute":{const f=ls(s("hitdefattr",a.attributes,o));return St(Number(a.op==="="?f:!f))}case"command":{const f=ls(s("command",[a.command],o));return St(Number(a.op==="="?f:!f))}case"call":{if(a.name==="cond"||a.name==="ifelse"){if(a.args.length!==3)throw new ht(`${a.name} requires three arguments.`,t);const p=r(a.args[0],o);if(a.name==="cond")return r(a.args[ls(p)?1:2],o);const x=[r(a.args[1],o),r(a.args[2],o)];for(const v of x)v.bottom&&((c=e.onWarning)==null||c.call(e,v.error));const m=ls(p)?0:1;return x[m]}if(Object.hasOwn(Cr,a.name)){const[p,x]=Cr[a.name];if(a.args.length!==p)throw new ht(`${a.name} requires ${p} argument(s).`,t);const m=a.args.map(T=>r(T,o)),v=x(...m.map(T=>["abs","min","max"].includes(a.name)?zt(T):Math.fround(zt(T)))),y=!["ceil","floor"].includes(a.name)&&(a.name!=="abs"||m[0].float)&&(!["min","max"].includes(a.name)||m.some(T=>T.float));return Wt(v,y)}const f=a.args.map(p=>ku.has(a.name)&&p.kind==="name"?{value:p.name}:r(p,o)),h=f.find(p=>p.bottom);if(h)throw h.error;const u=f.map(p=>p.value);return s(a.name,u,o)}case"binary":{const f=r(a.left,o),h=r(a.right,o);if(_r.has(a.op))return Bs(a.op,f,h);const u=f.float||h.float,p=u?Math.fround(zt(f)):zt(f),x=u?Math.fround(zt(h)):zt(h);switch(a.op){case"+":return Wt(p+x,u);case"-":return Wt(p-x,u);case"*":return Wt(u?p*x:Math.imul(p,x),u);case"/":if(x===0)throw new Ct("Division by zero.",t);return Wt(u?p/x:Math.trunc(p/x),u);case"%":if(u||x===0)throw new Ct("Remainder requires integers and a nonzero divisor.",t);return St(p%x);case"**":{const m=u||p<0||x<0;let v=p**x;return!m&&v>2147483647&&(v=2147483647,(d=e.onWarning)==null||d.call(e,new ht("Integer exponent overflow.",t))),Wt(v,m)}case"&&":return St(+(p!==0&&x!==0));case"||":return St(+(p!==0||x!==0));case"^^":return St(+(p!==0!=(x!==0)));case"&":case"|":case"^":if(u)throw new Ct("Bitwise operators require integers.",t);return St(a.op==="&"?p&x:a.op==="|"?p|x:p^x);default:throw new Gi(`Unsupported operator ${a.op}.`,t)}}default:throw new ht("Invalid compiled expression.",t)}}catch(f){if(f!=null&&f.bottom)return{bottom:!0,error:f};throw f}};try{const a=r(n);if(a.bottom)throw a.error;return e.typedResult?a:a.value}catch(a){throw a instanceof ht?(a.source||(a.source=t),a):a!=null&&a.bottom?new Ct(a.message||"Expression evaluated to bottom.",t):new ht((a==null?void 0:a.message)||"Trigger evaluation failed.",t)}}function ih(n,e={},t=!1){var u,p,x,m;const i=n.coordinateScale||1,[s=0,r=0]=e[t?"offset":"pos"]||[0,0],a=String(e.postype||"p1").toLowerCase(),o=((u=n.world)==null?void 0:u.view.left)??((p=n.world)==null?void 0:p.leftBound)??-160,l=((x=n.world)==null?void 0:x.view.right)??((m=n.world)==null?void 0:m.rightBound)??160,c=n.opponent||n;let d=n.pos.x,f=n.facing,h=n.facing;if(a==="p2")d=c.pos.x,t||(f=h=c.facing);else if(a==="front")d=n.facing>0?l:o;else if(a==="back")d=n.facing>0?o:l,t||(f=n.facing);else if(a==="left"||a==="right")d=a==="left"?o:l,t||(f=h=1);else if(a!=="p1")throw Error(`Unsupported spawn postype: ${a}`);return{pos:{x:d+Number(s)*i*f,y:n.pos.y+Number(r)*i},facing:h*(Number(e.facing??1)<0?-1:1)}}const nh=8192;function sh(n){if(!/^"[\s\S]*"$/.test(n))throw Error("Text must be enclosed in double quotes.");if(n.length>nh)throw Error("Debug text exceeds 8192 characters.");return n.slice(1,-1).replace(/\\([\s\S])/g,(e,t)=>{if(t==="n")return`
`;if(t==="t")return"    ";if(t==="\\"||t==='"')return t;throw Error(`Unsupported text escape \\${t}.`)})}function Yu(n){const e=sh(n),t=[];let i=0,s=0;for(let r=0;r<e.length;r++)if(e[r]==="%"){if(t.push(e.slice(i,r)),e[r+1]==="%"){t.push("%"),r++,i=r+1;continue}const a=/^%([-+ #0]*)(\d*)(?:\.(\d*))?([difFeEgG])/.exec(e.slice(r));if(!a)throw Error("Unsupported clipboard format specifier.");const o=Number(a[2]||0),l=a[3]===void 0?void 0:Number(a[3]||0);if(o>512||l>20)throw Error("Clipboard format width or precision exceeds supported bounds.");t.push({flags:a[1],width:o,precision:l,spec:a[4]}),s++,r+=a[0].length-1,i=r+1}if(t.push(e.slice(i)),s>6)throw Error("Clipboard format accepts at most 6 numeric parameters.");return{parts:t,count:s}}function Ku({flags:n,width:e,precision:t,spec:i},{value:s,float:r}){if(typeof s!="number"||!Number.isFinite(s))throw Error("Clipboard parameters must be finite numbers.");r===void 0&&(r=!Number.isInteger(s)),/[di]/.test(i)===!!r&&(i=r?"f":"d",n="",e=0,t=void 0);const a=s<0||Object.is(s,-0),o=Math.abs(s);let l;if(/[di]/.test(i))l=t===0&&o===0?"":Math.trunc(o).toString().padStart(t??0,"0");else if(/[fF]/.test(i))l=o.toFixed(t??6);else if(/[eE]/.test(i))l=o.toExponential(t??6);else{const d=Math.max(1,t??6),f=Number(o.toPrecision(d)),h=f?Math.floor(Math.log10(f)):0;l=h<-4||h>=d?o.toExponential(d-1):o.toFixed(Math.max(0,d-h-1)),n.includes("#")||(l=l.replace(/(\.\d*?[1-9])0+(?=e|$)/,"$1").replace(/\.0*(?=e|$)/,""))}n.includes("#")&&!l.includes(".")&&(l=l.replace(/e|$/i,"."+(l.includes("e")?"e":""))),l=l.replace(/e([+-])(\d+)$/i,(d,f,h)=>"e"+f+h.padStart(2,"0")),/[FEG]/.test(i)&&(l=l.toUpperCase());const c=a?"-":n.includes("+")?"+":n.includes(" ")?" ":"";return n.includes("0")&&!n.includes("-")&&(t===void 0||!/[di]/.test(i))?c+l.padStart(Math.max(0,e-c.length),"0"):(l=c+l,n.includes("-")?l.padEnd(e):l.padStart(e))}function Zu(n,e){if(e.length!==n.count)throw Error(`Clipboard format requires ${n.count} parameters, received ${e.length}.`);let t=0;const i=n.parts.map(s=>typeof s=="string"?s:Ku(s,e[t++])).join("");if(i.length>nh)throw Error("Formatted clipboard exceeds 8192 characters.");return i}const sa=n=>{if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(String(n).trim()))throw Error("ForceFeedback parameters require numeric constants.");const e=Number(n);if(!Number.isFinite(e))throw Error("ForceFeedback requires finite constants.");return e};function Ju(n){const e=String(n.waveform??"sine").replace(/^"(.*)"$/,"$1").toLowerCase();if(!["sine","square","sinesquare","off"].includes(e))throw Error(`Invalid ForceFeedback waveform ${e}.`);const t=sa(n.time??60),i=sa(n.self??1);if(!Number.isInteger(t)||t<0||t>36e4||![0,1].includes(i))throw Error("Invalid ForceFeedback time or self parameter.");const s={waveform:e,time:t,self:i};for(const r of["freq","ampl"]){const a=String(n[r]??"128").split(",").map(sa);if(a.length>4||!Number.isInteger(a[0]))throw Error(`Invalid ForceFeedback ${r} coefficients.`);s[r]=Array.from({length:4},(o,l)=>a[l]??0)}return s}const Kn=(n,e=[0,0])=>n===void 0?[...e]:Array.isArray(n)?[n[0]??e[0],n[1]??e[1]]:[n,e[1]],Lr=n=>n<0?-1:1,an=n=>Math.trunc(Number(n)),rh=n=>/^\s*f(?=\s|[\d(+.-])/i.test(n||""),ju=new Set(["anim","id","space","pos","facing","vfacing","bindid","bindtime","vel","velocity","accel","removetime","supermovetime","pausemovetime","scale","angle","xangle","yangle","sprpriority","ontop","shadow","ownpal","remappal","removeongethit","ignorehitpause","trans","alpha","postype","random","supermove"]);function Qu(n,e,t,i=!1){const s=t.ownpal===void 0?i?e.common:e.ownpal:!!t.ownpal;if(s&&(i||!e.ownpal)&&(e.paletteRemaps=e.common?new Map:Xo(n.paletteRemaps),n.events.push({type:"palettesnapshot",target:e,common:e.common})),s||(e.paletteRemaps=null,e.paletteSnapshot=null),e.ownpal=s,s&&!e.common&&t.remappal!==void 0)try{$o(e.paletteRemaps,n.character,t.remappal)}catch(r){n.diagnostic("palette",r.message)}}function ef(n,e,t,i){var d,f,h,u,p,x;const s=e.config,r=((d=n.world)==null?void 0:d.view)||{displayHeight:240};if(i||t.random!==void 0){const m=Kn(s.random);e.randomOffset=m.map(v=>v>0?Math.floor(n.resolveTrigger("random")/1e3*v)-Math.floor(v/2):0)}const a=Kn(s.pos).map((m,v)=>(m+e.randomOffset[v])*n.coordinateScale);e.bindOffset=a,e.relativeFacing=Lr(s.facing??1),e.vfacing=Lr(s.vfacing??1);const o=s.space!==void 0||s.bindid!==void 0,l=/^1\.(\d+)/.exec(((h=(f=n.character.def)==null?void 0:f.info)==null?void 0:h.mugenversion)||"");if(e.postype=o?null:String(s.postype??(l&&Number(l[1])>=1?"none":"p1")).toLowerCase(),e.bindID=an(s.bindid??-2),e.bindingTarget=null,o){if(e.space=String(s.space||"stage").toLowerCase(),!["stage","screen"].includes(e.space))throw Error(`Unsupported Explod space ${e.space}.`);if(e.space==="screen"&&e.bindID!==-2)throw Error("Screen-space Explods cannot be bound.");if(e.bindID!==-2&&s.bindtime===void 0)throw Error("Explod bindID requires bindtime.");e.pos={x:a[0],y:a[1]},e.facing=e.relativeFacing}else if(["p1","p2"].includes(e.postype))e.space="stage",e.bindingTarget=e.postype==="p2"?n.opponent:n,e.pos={x:((u=e.bindingTarget)==null?void 0:u.pos.x)??n.pos.x,y:((p=e.bindingTarget)==null?void 0:p.pos.y)??n.pos.y},e.facing=e.relativeFacing*(((x=e.bindingTarget)==null?void 0:x.facing)??n.facing);else if(["front","back","left","right"].includes(e.postype)){e.space="screen";const m=e.postype==="right"||e.postype==="front"&&n.facing>0||e.postype==="back"&&n.facing<0,v=e.postype==="back"?n.facing:1;e.pos={x:(m?320:0)+a[0]*v,y:a[1]},e.facing=e.relativeFacing*v}else if(e.postype==="none")e.space="stage",e.pos={x:a[0],y:a[1]},e.facing=e.relativeFacing;else throw Error(`Unsupported Explod postype ${e.postype}.`);const c=e.postype==="p1"||e.postype==="p2"||e.bindID!==-2;if(e.bindtime=e.space==="stage"&&c?an(s.bindtime??1):0,e.initialBinding=c,e.positioned=!e.initialBinding,!Number.isFinite(r.displayHeight))throw Error("Invalid Explod viewport.")}function Al(n,e,t,i,s){var r,a;for(const o of["angle","xangle","yangle"])if(t[o]!==void 0&&(typeof t[o]!="number"||!Number.isFinite(t[o])))throw Error(`Explod ${o} must be a finite number.`);if(e.config={...e.config,...t},t.anim!==void 0||i){const o=t.anim===void 0?e.common:rh(s.values.anim),l=an(t.anim??e.anim),c=o?n.commonAnimations:n.animations;if(!c.has(l)||!((r=c.get(l).frames)!=null&&r.length))throw Error(`Explod ${o?"common ":""}animation ${l} does not exist or has no frames.`);e.anim=l,e.common=o,e.animation=c.get(l),e.frameIndex=0,e.frameTime=0}for(const o of["removetime","supermovetime","pausemovetime","sprpriority","angle","xangle","yangle","ontop","shadow","removeongethit","ignorehitpause","supermove"])t[o]!==void 0&&(e[o]=t[o]);for(const o of["removetime","supermovetime","pausemovetime","sprpriority"])e[o]=an(e[o]??0);if(e.removetime<-2||an(e.config.bindtime??0)<-1)throw Error("Invalid Explod removal or binding time.");t.scale!==void 0&&(e.scale=Kn(t.scale,[1,1])),(t.trans!==void 0||t.alpha!==void 0)&&(e.trans={mode:String(e.config.trans||"default").toLowerCase(),alpha:Kn(e.config.alpha,[256,0])}),(t.vel!==void 0||t.velocity!==void 0||i)&&(e.velocity=Kn(e.config.vel??e.config.velocity).map(o=>o*n.coordinateScale)),(t.accel!==void 0||i)&&(e.accel=Kn(e.config.accel).map(o=>o*n.coordinateScale)),Qu(n,e,t,i),i||["space","postype","pos","bindid","random"].some(o=>t[o]!==void 0)?ef(n,e,t,i):(t.facing!==void 0&&(e.relativeFacing=Lr(t.facing),e.facing=e.relativeFacing*(((a=e.bindingTarget)==null?void 0:a.facing)??(e.postype==="back"?n.facing:1))),t.vfacing!==void 0&&(e.vfacing=Lr(t.vfacing)),t.bindtime!==void 0&&(e.bindtime=an(t.bindtime)))}function tf(n,e){const t=an(n.value(e,"id",-1)),i=n.explods.filter(o=>t===-1||o.id===t);if(e.type==="removeexplod"){n.explods=n.explods.filter(o=>!i.includes(o)),n.drawExplods=n.drawExplods.filter(o=>t!==-1&&o.id!==t);return}if(e.type==="explodbindtime"){const o=an(n.value(e,e.values.time===void 0?"value":"time",1));if(o<-1)throw Error("ExplodBindTime must be -1 or greater.");for(const l of i)l.bindtime=o;return}const s=rh(e.values.anim)?e.entries.map(o=>o.key==="anim"?{...o,value:o.value.replace(/^\s*f\s*/i,"")}:o):e.entries,r=n.effectParameters({...e,entries:s});e.values.ignorehitpause!==void 0&&(r.ignorehitpause=n.value(e,"ignorehitpause",1));for(const o of Object.keys(r))ju.has(o)||n.diagnostic("unsupported-explod-parameter",`Explod parameter ${o} is not implemented.`,e);for(const o of["pos","vel","velocity","accel","scale","random","remappal","alpha"])if(Array.isArray(r[o])&&r[o].length>2)throw Error(`Explod ${o} takes at most two components.`);if(e.type==="modifyexplod"){for(const o of i){const l=n.events.length,c={...o,config:{...o.config},paletteRemaps:o.paletteRemaps?new Map(o.paletteRemaps):null};try{Al(n,c,r,!1,e)}catch(d){throw n.events.length=l,d}Object.assign(o,c);for(const d of n.events.slice(l))d.target===c&&(d.target=o)}return}if(e.values.anim===void 0)throw Error("Explod requires anim.");if(n.explods.length>=512){n.diagnostic("resource-limit","Explod limit (512 per entity) reached.",e);return}const a={owner:n,creator:n,id:t,coordinateScale:n.coordinateScale,time:0,frameIndex:0,frameTime:0,config:{},removetime:-2,bindtime:0,ignorehitpause:1,supermovetime:0,pausemovetime:0,scale:[1,1],angle:0,xangle:0,yangle:0,vfacing:1};Al(n,a,r,!0,e),n.explods.push(a)}function Rl(n,e,t){if(!(e!=null&&e.remaining)||(n[t]!==e&&(n[t]=e,n[t+"Moved"]=0),t==="superPause"&&n.supermove))return!0;const i=t==="superPause"?"supermovetime":"pausemovetime";return n[t+"Moved"]>=Math.max(0,n[i]||0)?!1:(n[t+"Moved"]++,!0)}function nf(n,e){for(const t of n.explods)!(t.bindingTarget===e||!t.bindingTarget&&(t.postype==="p1"&&n===e||t.postype==="p2"&&n.opponent===e||t.bindID===e.id||t.bindID===-1&&n.root===e))||!t.initialBinding&&t.bindtime===0||((t.initialBinding||!t.positioned)&&(t.pos={x:e.pos.x+t.bindOffset[0]*e.facing,y:e.pos.y+t.bindOffset[1]},t.facing=t.relativeFacing*e.facing),t.bindingTarget=null,t.bindtime=0,t.initialBinding=!1,t.positioned=!0)}function sf(n,{hitPaused:e=!1,pause:t=null,superPause:i=null,forceFrozen:s=!1}={}){var a,o;const r=[];for(const l of n.explods){if(l.removetime===0||l.pendingRemoval&&!(i!=null&&i.remaining)){l.removed=!0;continue}!l.bindingTarget&&(l.bindtime||l.initialBinding)&&(l.postype==="p2"?l.bindingTarget=n.opponent:l.postype==="p1"?l.bindingTarget=n:l.bindID!==-2&&(l.bindingTarget=l.bindID===-1?n.root:l.bindID===n.id?n:(a=n.world)==null?void 0:a.findPlayer(l.bindID))),(o=l.bindingTarget)!=null&&o.destroyed&&(l.bindingTarget=null,l.bindtime=0,l.initialBinding=!1);const c=l.space==="stage"&&!!l.bindingTarget&&(l.initialBinding||l.bindtime!==0);if(l.initialBinding&&!l.bindingTarget){n.diagnostic("missing-player",`Explod binding player ${l.bindID} is unavailable.`),l.removed=!0;continue}let d=s||e&&!l.ignorehitpause;if(d||(d=i!=null&&i.remaining?!Rl(l,i,"superPause"):!Rl(l,t,"pause")),c?(l.facing=l.relativeFacing*l.bindingTarget.facing,l.pos={x:l.bindingTarget.pos.x+l.bindOffset[0]*l.bindingTarget.facing,y:l.bindingTarget.pos.y+l.bindOffset[1]},l.positioned=!0):!d&&l.time>0&&(l.pos.x+=l.velocity[0]*l.facing,l.pos.y+=l.velocity[1]),r.push({...l,pos:{...l.pos},source:l}),d)continue;l.time>0&&(l.velocity[0]+=l.accel[0],l.velocity[1]+=l.accel[1]),l.initialBinding=!1,l.bindtime>0&&l.bindtime--;const f=l.animation.frames[l.frameIndex];f&&f.ticks>=0&&++l.frameTime>=Math.max(1,f.ticks)&&(l.frameTime=0,++l.frameIndex>=l.animation.frames.length&&(l.removetime===-2&&(l.removed=!0),l.frameIndex=l.animation.loopStart||0)),l.time++,l.removetime>0&&l.time>=l.removetime&&(l.removed=!0),l.removed&&l.supermove&&(i!=null&&i.remaining)&&(l.removed=!1,l.pendingRemoval=!0)}n.drawExplods=r,n.explods=n.explods.filter(l=>!l.removed)}const Pn=new Map,rf=["N","S","H"];function ws(n){const e=String(n??"").toUpperCase().replace(/\s/g,"");if(Pn.has(e))return Pn.get(e);const[t,...i]=e.split(",");if(!/^[SCA]*$/.test(t))throw Error(`Invalid hit attribute states: ${t}`);const s=new Set;for(const a of i)if(a){if(!/^[NSHA][ATP]$/.test(a))throw Error(`Invalid hit attack attribute: ${a}`);for(const o of a[0]==="A"?rf:[a[0]])s.add(o+a[1])}const r={states:new Set(t),attacks:s};return Pn.size>=512&&Pn.delete(Pn.keys().next().value),Pn.set(e,r),r}function ah(n,e){const t=typeof n=="string"?ws(n):n,i=typeof e=="string"?ws(e):e;return{state:[...i.states].some(s=>t.states.has(s)),attack:[...i.attacks].some(s=>t.attacks.has(s))}}function ra(n,e){const t=ah(n,e);return t.state&&t.attack}function af(n,e){const t=ah(n.attribute,e);return n.exclude?!t.state&&!t.attack:t.state&&t.attack}function It(n){var t,i,s;if((n==null?void 0:n.baseCoordinateScale)>0)return n.baseCoordinateScale;const e=Number(String(((s=(i=(t=n==null?void 0:n.character)==null?void 0:t.def)==null?void 0:i.info)==null?void 0:s.localcoord)||"320,240").split(",")[0]);return e>0?320/e:1}function yr(n,e,{edge:t=!1}={}){var o,l,c,d,f,h;const i=n.facing===e,s=i?"front":"back",r=t?(l=(o=n.width)==null?void 0:o.edge)==null?void 0:l[i?0:1]:(c=n.width)==null?void 0:c[s],a=((f=(d=n.program)==null?void 0:d.constants)==null?void 0:f.get(`size.${n.stateType==="A"?"air":"ground"}.${s}`))??15;if(r!==void 0){const u=(Number(r)||0)*(n.coordinateScale||It(n));return Math.max(0,u+((h=n.world)!=null&&h.orderedPhases?Math.max(0,Number(a)||0)*It(n):0))}return Math.max(0,Number(a)||0)*It(n)}function of(n,e,{body:t=!1,scale:i=n.coordinateScale}={}){var o,l,c,d;const s=(o=n.world)==null?void 0:o.view,r=e>0?(s==null?void 0:s.right)??((l=n.options)==null?void 0:l.rightBound)??160:(s==null?void 0:s.left)??((c=n.options)==null?void 0:c.leftBound)??-160;let a=e>0?r-n.pos.x:n.pos.x-r;if(t){const f=n.width??n._previousWidth,h=Number((d=f==null?void 0:f.edge)==null?void 0:d[n.facing===e?0:1])||0;a-=h*n.coordinateScale+(n.stateType==="A"?.5:0)}return Math.trunc(a/i)}function Cl(n){return n.startsWith("velocity.")?!/\.mul(?:\.|$)/.test(n):n.startsWith("size.")?!["size.xscale","size.yscale","size.proj.doscale"].includes(n):n.startsWith("movement.")&&!/(?:\.friction$|\.num$|\.time$|\.mul(?:\.|$))/.test(n)}const oh=new Set(["xoff","yoff","zoff","xvel","yvel","xveladd","yveladd","yaccel","fall.xvel","fall.yvel","fall.envshake.ampl"]);function lf(n,e){const t=n.coordinateScale,i=t/e;if(n.coordinateScale=e,i!==1){for(const s of oh)typeof n.getHitVars[s]=="number"&&(n.getHitVars[s]*=i);if(n.width){for(const s of["front","back"])typeof n.width[s]=="number"&&(n.width[s]*=i);n.width.edge&&(n.width.edge=n.width.edge.map(s=>s*i))}n.attackDist!==void 0&&(n.attackDist*=i)}}function lh(n){return n.collisionFrame?n.collisionAnimationOwner||n.animationOwner||n:n.animationOwner||n}const $a=n=>{var e;return n!=null&&n.isProjectile?(e=n.owner)==null?void 0:e.id:n==null?void 0:n.id},ch=(n,e)=>!(e!=null&&e.isProjectile)&&(n.hitonce===void 0?/^[SCA]\s*,\s*[NSH]T$/i.test(n.attr||""):Number(n.hitonce)!==0);function cf(n,e,t){const i=n.hitId??-1,s=e.chainid??-1;if(s>=0&&i!==s)return!1;const r=Array.isArray(e.nochainid)?e.nochainid:[e.nochainid??-1];return!(n.hitSourceId===$a(t)&&$a(t)!==void 0&&r.some(a=>a>=0&&a===i&&a!==s))}function hf(n,e,t){var i;return cf(n,e,t)&&!(ch(e,t)&&((i=t==null?void 0:t._spentHitDefs)!=null&&i.has(e)))}function uf(n,e,t){!t||!ch(e,t)||(t._spentHitDefs??(t._spentHitDefs=new WeakSet),t._spentHitDefs.add(e),t.targets.splice(0,t.targets.length,n),t.targetHitIds.clear())}function Pl(n,e,t,{count:i=!0}={}){var r,a;if(!n||(n.moveContact=1,n.moveHit=t?0:1,n.moveGuarded=t?1:0,n.moveReversed=0,t||!i||(r=n.world)!=null&&r.orderedPhases&&e.numhits===0))return;const s=((a=n.world)==null?void 0:a.ticks)??n.gameTime??0;n._lastHitCountTick!==s&&(n.hitCount=(n.hitCount||0)+1,n._lastHitCountTick=s),n.uniqHitCount=(n.uniqHitCount||0)+1}const ff=new Set(["xveladd","yveladd","type","animtype","airtype","groundtype","damage","hitcount","fallcount","hitshaketime","hittime","slidetime","ctrltime","recovertime","xoff","yoff","zoff","xvel","yvel","yaccel","hitid","chainid","guarded","isbound","fall","fall.damage","fall.xvel","fall.yvel","fall.recover","fall.time","fall.recovertime","fall.kill","fall.envshake.time","fall.envshake.freq","fall.envshake.ampl","fall.envshake.phase"]);function df(n){var e;return{type:0,hitid:-1,chainid:0,hitcount:0,fallcount:0,hittime:-1,recovertime:n.constant("data.liedown.time"),xveladd:0,yveladd:0,zoff:0,fall:0,"fall.time":0,"fall.recover":(e=n.world)!=null&&e.orderedPhases?0:1,"fall.recovertime":4}}const Ll=new Set(["a","b","c","x","y","z","s","U","D","L","R"]);function pf(n,e,t){const i=e===null?new Set([...t].filter(s=>Ll.has(s))):new Set([...e].filter(s=>Ll.has(s)));if(e===null)for(const[s,r]of[["holdup","U"],["holddown","D"],["holdfwd",n.facing<0?"L":"R"],["holdback",n.facing<0?"R":"L"]])t.has(s)&&i.add(r);n._recoveryPressed=[...i].some(s=>!n._previousInput.has(s)),n._previousInput=i,n.rawInput=i}function Il(n,{hitPaused:e=!1}={}){var i;const t=n.getHitVars;if(n.moveType==="H"){if(t.fall&&(t["fall.time"]=(t["fall.time"]||0)+1),e||(n.hitTime>=0&&n.hitTime--,[5070,5100].includes(n.stateNo)&&n._fallEntry!==n._entrySerial&&(t.fallcount=(t.fallcount||0)+1,n._fallEntry=n._entrySerial,n._fallDefenceMultiplier*=n.constant("data.fall.defence_mul")),n.stateNo===5110&&(t.recovertime=Math.max(0,(t.recovertime??n.constant("data.liedown.time"))-1))),n._recoveryPressed&&n.alive&&(n.stateType==="L"||t.fallcount>0)&&t.recovertime>0){const s=Math.max(1,Math.ceil(t.recovertime/2));t.recovertime=Math.max(0,t.recovertime-1-Math.floor(n.resolveTrigger("random")/1e3*s))}}else n.comboHits=0,n.hitTime=-1,n.hitId=n.hitId<0?-1:0,n.hitSourceId=void 0,t.fall=0,t.fallcount=0,(i=n.world)!=null&&i.orderedPhases||(t["fall.time"]=0),t["fall.envshake.time"]=0,n._fallDefenceMultiplier=1,t.recovertime=n.constant("data.liedown.time");t.hittime=n.hitTime,t.hitid=n.hitId,t.chainid=Math.max(0,n.hitId)}const hh=Object.freeze({attackLifeToPower:.7,getHitLifeToPower:.6,superTargetDefence:1.5});function mf(n={},e={}){const t=Object.keys(n).find(r=>/(?:^|\/)data\/mugen\.cfg$/i.test(r)),i=t?$r(An(n[t])).rules||{}:{},s={...hh};for(const[r,a]of[["attackLifeToPower","default.attack.lifetopowermul"],["getHitLifeToPower","default.gethit.lifetopowermul"],["superTargetDefence","super.targetdefencemul"]]){const o=Number(e[r]??i[a]??s[r]);if(!Number.isFinite(o)||o<0)throw Error(`Invalid combat rule ${a}.`);s[r]=o}return s}function zs(n,e,t,{absolute:i=!1}={}){let s=Number(n);if(!Number.isFinite(s))throw Error("Damage must be finite.");if(!i){const r=e?Math.max(0,e.constant("data.attack")/100*(e.attackMultiplier??1)):1,a=Math.max(.01,t.constant("data.defence")/100);s*=r*Math.max(0,t.defenceMultiplier??1)*Math.max(0,t._fallDefenceMultiplier??1)/a}return s>0?Math.max(1,Math.round(s)):Math.round(s)}function gf(n,e=hh){var s;const t=Math.max(0,Math.trunc(((s=n.damage)==null?void 0:s[0])||0)),i=(r,a)=>{const o=Array.isArray(r)?r:r===void 0?[Math.trunc(Math.fround(Math.fround(t)*Math.fround(a)))]:[r],l=Math.trunc(o[0]||0);return[l,Math.trunc(o[1]??l/2)]};return{get:i(n.getpower,e.attackLifeToPower),give:i(n.givepower,e.getHitLifeToPower)}}function vf(n,e,t,i=1){const s=n,r=e;return t!=="L"&&(t!=="A"&&e===0&&(n*=.66),n&&(n+=Math.sign(n)*2.5/i),e<=0&&(e=Math.min(e-2/i,(t==="A"?-3:-6)/i))),{x:n,y:e,xadd:n-s,yadd:e-r}}const Dl=new WeakMap;function As(n){const e=n==null?void 0:n.frames;if(!(e!=null&&e.length))return null;let t=Dl.get(n);if((t==null?void 0:t.frames)===e&&t.length===e.length)return t;const i=new Float64Array(e.length+1),s=new Float64Array(e.length+1);for(let a=0;a<e.length;a++)i[a+1]=i[a]+Math.max(1,e[a].ticks),s[a+1]=s[a]+(e[a].ticks<0?1/0:Math.max(1,e[a].ticks));const r=n.loopStart??n.loopstart??0;return t={frames:e,length:e.length,offsets:i,lookupOffsets:s,duration:s[e.length],loopStart:r,intro:s[r]},Dl.set(n,t),t}function qa(n){const e=new Error(n);throw e.bottom=!0,e}function xf(n,e,t){const i=As(n),s=t-1;return(!i||s<0||s>=i.length)&&qa(`Animation element out of range: ${t}`),e.animationTime-i.offsets[s]}function _f(n,e,t=0){const i=As(n);i||qa("Animation has no elements");let s=e.animationCycleTime+t;if(Number.isFinite(i.duration)&&(e.animationLooped||e.frameIndex>=i.loopStart||s>=i.duration)){const o=i.duration-i.intro;s=i.intro+((s-i.intro)%o+o)%o}else s<0&&qa("Animation offset precedes its start");let r=0,a=i.length;for(;r<a;){const o=r+a>>>1;s<i.lookupOffsets[o+1]?a=o:r=o+1}return r<i.length?r+1:void 0}function yf(n,e){const t=As(n);return!t||e.animationEnded?0:Number.isFinite(t.duration)?e.animationCycleTime-t.duration:-1}function aa(n){return{anim:n.anim,animationOwner:n.animationOwner,frameIndex:n.frameIndex,frameTime:n.frameTime,animationTime:n.animationTime,animationCycleTime:n.animationCycleTime,animationLooped:n.animationLooped,animationEnded:n.animationEnded}}function Nl(n,e){n.anim=e.anim,n.animationOwner=e.animationOwner,n.frameIndex=e.frameIndex,n.frameTime=e.frameTime,n.animationTime=e.animationTime,n.animationCycleTime=e.animationCycleTime,n.animationLooped=e.animationLooped,n.animationEnded=e.animationEnded}class _n extends Error{constructor(e,t,i){super(e),this.source=t,this.line=i}}function Hs(n,e){const t=[];let i=0,s=0,r=!1,a=!1;for(let o=0;o<n.length;o++){const l=n[o];l==='"'&&!a&&(r=!r),r||("([".includes(l)&&s++,")]".includes(l)&&s--,!s&&l===e&&(t.push(n.slice(i,o).trim()),i=o+1)),a=l==="\\"&&!a}return t.push(n.slice(i).trim()),t}class Sf{constructor(e,t){if(e.length>2*1024*1024)throw new _n("ZSS file exceeds 2 MiB.",t,1);this.text=e.replace(/^\uFEFF/,""),this.source=t,this.at=0,this.line=1,this.nodes=0,this.depth=0,this.scope=new Set,this.expressions=new Set}fail(e){throw new _n(e,this.source,this.line)}take(){const e=this.text[this.at++];return e===`
`&&this.line++,e}skip(){for(;;){for(;/\s/.test(this.text[this.at]||"")&&this.at<this.text.length;)this.take();if(this.text[this.at]!=="#")return;for(;this.at<this.text.length&&this.take()!==`
`;);}}word(){this.skip();const e=/^[a-z_][a-z0-9_.]*/i.exec(this.text.slice(this.at));return e||this.fail("Expected an identifier."),this.at+=e[0].length,e[0]}is(e){return this.skip(),new RegExp("^"+e+"(?![a-z0-9_.])","i").test(this.text.slice(this.at))}expect(e){this.skip(),this.take()!==e&&this.fail(`Expected '${e}'.`)}read(e){let t="",i=0,s=!1,r=!1;for(;this.at<this.text.length;){const a=this.text[this.at];if(!s&&!i&&e.includes(a)&&!(a===":"&&this.text[this.at+1]==="="))break;if(!s&&a==="#"){for(;this.at<this.text.length&&this.take()!==`
`;);t+=" ";continue}t+=this.take(),a==='"'&&!r&&(s=!s),s||("([".includes(a)&&i++,")]".includes(a)&&--i<0&&this.fail("Unbalanced expression.")),r=a==="\\"&&!r}return(s||i)&&this.fail("Unterminated expression."),t.trim()}local(e){/^[a-z_][a-z0-9_]*$/i.test(e)||this.fail("Invalid local variable name."),this.scope.add(e),this.scope.size>256&&this.fail("ZSS local-variable limit (256) exceeded.")}expr(e,t=!0){(!e||e.length>8192)&&this.fail("Empty or oversized ZSS expression.");let i="",s=!1,r=!1;for(let a=0;a<e.length;a++){const o=e[a];if(!s&&o==="$"){const l=/^[a-z_][a-z0-9_]*/i.exec(e.slice(a+1));(!l||!this.scope.has(l[0]))&&this.fail(`Unknown local variable near ${e.slice(a,a+40)}.`),i+=`zsslocal("${l[0]}")`,a+=l[0].length;continue}i+=o,o==='"'&&!r&&(s=!s),r=o==="\\"&&!r}if(t)try{qo(i)}catch(a){this.fail(a.message)}return this.expressions.add(i),i}parameters(e,t){const i=[],s={};for(const r of Hs(e,";").filter(Boolean)){const a=/^([a-z_][a-z0-9_.]*)\s*:\s*([\s\S]+)$/i.exec(r);a||this.fail("Expected parameter: value.");const o=a[1].toLowerCase(),l=this.expr(a[2],!1);i.push({key:o,value:l,line:t}),s[o]=l}return{entries:i,values:s}}block(e=0){this.expect("{"),++this.depth>64&&this.fail("ZSS nesting limit (64) exceeded.");const t=this.statements(e,!0);return this.expect("}"),this.depth--,t}statements(e=0,t=!1,i=!1){const s=[];for(;;){this.skip();const r=this.text[this.at];if(r==="}"||i&&(this.is("case")||this.is("default"))||this.at>=this.text.length||!t&&r==="[")break;if(r===";"){this.take();continue}++this.nodes>2e4&&this.fail("ZSS statement limit (20,000) exceeded."),s.push(this.statement(e))}return s}call(e){const t=/^call\s+([a-z_][a-z0-9_]*)\s*\(([\s\S]*)\)$/i.exec(e);return t||this.fail("Invalid function call."),{kind:"call",name:t[1],args:t[2].trim()?Hi(t[2]).map(i=>this.expr(i)):[]}}statement(e){++this.depth>64&&this.fail("ZSS nesting limit (64) exceeded.");try{return this.readStatement(e)}finally{this.depth--}}readStatement(e){var h;this.skip();const t=this.line,i=this.source;let s=!1,r=1,a=!1;for(;this.is("ignorehitpause")||this.is("persistent");)if(a=!0,this.word().toLowerCase()==="ignorehitpause")s=!0;else{this.expect("(");const p=this.read(")");this.expect(")"),(!/^\d+$/.test(p)||Number(p)>2147483647)&&this.fail("persistent requires a nonnegative integer constant."),r=Number(p)}const o={source:i,line:t,ignoreHitPause:s,persistent:r};if(this.text[this.at]==="{")return{...o,kind:"block",body:this.block(e)};const l=this.word(),c=l.toLowerCase();if(c==="if"){const u=this.expr(this.read("{")),p=this.block(e);this.skip();let x=[];return this.is("else")&&(this.word(),this.skip(),x=this.text[this.at]==="{"?this.block(e):[this.statement(e)]),{...o,kind:"if",condition:u,yes:p,no:x}}if(a&&this.fail("ignoreHitPause/persistent must prefix an if statement or a braced block."),c==="while")return{...o,kind:"while",condition:this.expr(this.read("{")),body:this.block(e+1)};if(c==="for"){const u=Hs(this.read("{"),";");(u.length<2||u.length>3)&&this.fail("for requires start; end; optional step.");let p=null,x=u[0];const m=/^([a-z_][a-z0-9_]*)\s*=\s*([\s\S]+)$/i.exec(x);return m&&(p=m[1],this.local(p),x=m[2]),{...o,kind:"for",variable:p,start:this.expr(x),end:this.expr(u[1]),step:this.expr(u[2]||"1"),body:this.block(e+1)}}if(c==="switch"){const u=this.expr(this.read("{"));this.expect("{"),++this.depth>64&&this.fail("ZSS nesting limit (64) exceeded.");const p=[];let x=null;for(;this.skip(),this.text[this.at]!=="}";){const m=this.word().toLowerCase();if(m==="case"){const v=Hs(this.read(":"),";").map(y=>this.expr(y));this.expect(":"),p.push({values:v,body:this.statements(e,!0,!0)})}else m==="default"&&!x?(this.expect(":"),x=this.statements(e,!0,!0)):this.fail("Expected case or a single default label.")}return this.expect("}"),this.depth--,{...o,kind:"switch",expression:u,cases:p,fallback:x||[]}}if(c==="break"||c==="continue")return e||this.fail(`${c} is only valid inside a loop.`),this.expect(";"),{...o,kind:c};if(c==="let"){const u=this.read("=").split(",").map(m=>m.trim());u.forEach(m=>this.local(m)),this.expect("=");const p=this.read(";");if(this.expect(";"),/^call\b/i.test(p))return{...o,...this.call(p),outputs:u};const x=Hi(p).map(m=>this.expr(m));return u.length!==x.length&&this.fail("Local assignment needs one value per name."),{...o,kind:"let",names:u,values:x}}if(c==="call"){const u="call "+this.read(";");return this.expect(";"),{...o,...this.call(u)}}if(this.skip(),this.text[this.at]==="{"){this.expect("{");const u=this.parameters(this.read("}"),t);this.expect("}"),(u.values.persistent!==void 0||u.values.ignorehitpause!==void 0&&c!=="explod")&&this.fail("Controller persistence/hitpause flags belong before a ZSS block.");const p=[{key:"type",value:c,line:t},{key:"trigger1",value:"1",line:t},...u.entries];return{...o,kind:"controller",controller:{name:"state zss",source:i,line:t,type:c,entries:p,values:{type:c,trigger1:"1",...u.values},language:"zss"}}}const d=l+this.read(";");this.expect(";");const f=/^(?:(parent|root)\s*,\s*)?(var|fvar|sysvar|sysfvar|map)\s*\(/i.exec(d);if(f){let u=f[0].length,p=1,x=!1,m=!1;for(;u<d.length;u++){const y=d[u];if(y==='"'&&!m&&(x=!x),!x&&(y==="("&&p++,y===")"&&--p===0))break;m=y==="\\"&&!m}const v=/^\s*:=\s*([\s\S]+)$/.exec(d.slice(u+1));if(p===0&&v){const y=((h=f[1])==null?void 0:h.toLowerCase())||null,T=f[2].toLowerCase(),R=d.slice(f[0].length,u);return{...o,kind:"assign",target:y,variable:T,index:T==="map"?R.trim().replace(/^"(.*)"$/,"$1").toLowerCase():this.expr(R),value:this.expr(v[1])}}}return{...o,kind:"expression",expression:this.expr(d)}}parse(){const e=[],t=[];for(;this.at<this.text.length&&(this.skip(),!(this.at>=this.text.length));){const i=this.line;this.expect("[");const s=this.read("]");if(this.expect("]"),this.scope=new Set,/^statedef\b/i.test(s)){const r=Hs(s,";"),a=this.expr(r.shift().replace(/^statedef\s+/i,"")),o=this.parameters(r.filter(Boolean).join(";"),i),l=this.statements();e.push({source:this.source,line:i,name:"statedef zss",idExpression:a,...o,zssNodes:l,localNames:[...this.scope],controllers:[]})}else{const r=/^function\s+([a-z_][a-z0-9_]*)\s*\(([^)]*)\)\s*(.*?)\s*$/i.exec(s);r||this.fail("Expected StateDef or Function header.");const a=r[2].trim()?r[2].split(",").map(c=>c.trim()):[],o=r[3].replace(/^return\s+/i,"").split(",").map(c=>c.trim()).filter(Boolean);[...a,...o].forEach(c=>this.local(c));const l=this.statements();t.push({source:this.source,line:i,name:r[1],args:a,outputs:o,localNames:[...this.scope],body:l})}}return{states:e,functions:t,expressions:this.expressions}}}function uh(n,e){for(const t of n){e(t);for(const i of[t.body,t.yes,t.no,t.fallback,...(t.cases||[]).map(s=>s.body)])i&&uh(i,e)}}function Mf(n,e="<zss>"){return new Sf(n,e).parse()}const fh=Object.freeze({value:0,float:!1}),Zi=new WeakMap;function wf(n){return[n.body,n.yes,n.no,n.fallback,...(n.cases||[]).map(e=>e.body)].filter(Boolean)}function bf(n){var t;if(Zi.has(n))return Zi.get(n);const e=[[n,!1]];for(;e.length;){const[i,s]=e.pop();if(Zi.has(i))continue;if(i.ignoreHitPause){Zi.set(i,!0);continue}const r=[...wf(i).flat(),...((t=i.function)==null?void 0:t.body)||[]];if(s)Zi.set(i,r.some(a=>Zi.get(a)));else{e.push([i,!0]);for(const a of r)Zi.has(a)||e.push([a,!1])}}return Zi.get(n)}function gi(n){if(n!=null&&n.bottom)throw n.error;if(typeof(n==null?void 0:n.value)!="number"||!Number.isFinite(n.value))throw Error("ZSS locals and function values currently require finite numbers.");return n.value}function Ef(n,e){return n.float||e.float?Math.fround(gi(n))===Math.fround(gi(e)):gi(n)===gi(e)}function Ul(n){return new Map(n.map(e=>[e,fh]))}function Tf(n,e,t,i){const s=n._zssContext,r=n._scriptOwner,a=n._executing,o=n._entrySerial,l={owner:t,locals:Ul(e.localNames||[]),depth:0};n._zssContext=l,n._scriptOwner=t;const c=(x,m)=>n.evaluate(x,m,!0),d=(x,m)=>{try{return gi(c(x,m))!==0}catch(v){if(v.bottom)return!1;throw v}},f=x=>{if(n._executing=x,++n._zssSteps>2e4){const m=Error("ZSS instruction budget exceeded (20,000 per tick).");throw m.zssBudget=!0,m}},h=()=>n.destroyed||n._entrySerial!==o;function u(x,m){const v=x.function,y=n._zssContext;if(!v)throw Error(`Unknown ZSS function ${x.name}.`);if(y.depth>=32)throw Error("ZSS function depth limit (32) exceeded.");const T=x.args.map(S=>c(S,x)),R={owner:t,locals:Ul(v.localNames),depth:y.depth+1};T.forEach((S,M)=>R.locals.set(v.args[M],S)),n._zssContext=R;try{return{signal:p(v.body,m),values:v.outputs.map(M=>R.locals.get(M)||fh)}}finally{n._zssContext=y}}function p(x,m=!1){var v;for(const y of x){if(h())return"transition";const T=m||y.ignoreHitPause;if(i&&!T&&!bf(y))continue;f(y);const R=n._controllerCounts.get(y)||0;if(!(y.persistent!==1&&(n._controllerCounts.set(y,R+1),y.persistent===0?R!==0:R%y.persistent!==0))){try{let S;if(y.kind==="controller")n.execute(y.controller);else if(y.kind==="expression")c(y.expression,y);else if(y.kind==="assign"){const M=y.target==="parent"?n.parent:y.target==="root"?n.root:n;if(!M||M.destroyed){const L=Error("ZSS assignment target is unavailable.");throw L.bottom=!0,L}const g=y.variable==="map"?y.index:gi(c(y.index,y)),_=gi(c(y.value,y));y.variable==="map"?M.setMap(y.index,_):M.assignVariable(y.variable,[g],_)}else if(y.kind==="let"){const M=y.values.map(g=>c(g,y));M.forEach(gi),y.names.forEach((g,_)=>n._zssContext.locals.set(g,M[_]))}else if(y.kind==="call"){const M=u(y,T);S=M.signal,S||(v=y.outputs)==null||v.forEach((g,_)=>n._zssContext.locals.set(g,M.values[_]))}else if(y.kind==="if")S=p(d(y.condition,y)?y.yes:y.no,T);else if(y.kind==="block")S=p(y.body,T);else if(y.kind==="switch"){const M=c(y.expression,y);let g=y.fallback;for(const _ of y.cases)if(_.values.some(L=>Ef(M,c(L,y)))){g=_.body;break}S=p(g,T)}else{if(y.kind==="break"||y.kind==="continue")return y.kind;if(y.kind==="while"||y.kind==="for"){let M,g,_;if(y.kind==="for"){if(M=Math.trunc(gi(c(y.start,y))),g=Math.trunc(gi(c(y.end,y))),_=Math.trunc(gi(c(y.step,y))),!_)throw Error("ZSS for step cannot be zero.");y.variable&&n._zssContext.locals.set(y.variable,{value:M|0,float:!1})}let L=0;for(;y.kind==="while"?d(y.condition,y):_>0?M<=g:M>=g;){if(f(y),++L>2500){n.diagnostic("resource-limit","ZSS loop stopped at 2,500 iterations.",y);break}const E=p(y.body,T);if(E==="transition")return E;if(E==="break")break;y.kind==="for"&&(M+=_),y.kind==="for"&&(_>0?M<=g:M>=g)&&y.variable&&n._zssContext.locals.set(y.variable,{value:M|0,float:!1})}}}if(S)return S}catch(S){if(S.zssBudget)throw S;S.bottom||n.diagnostic("zss-runtime",S.message,y)}if(h())return"transition"}}return null}try{p(e.zssNodes)}catch(x){n.diagnostic(x.zssBudget?"resource-limit":"zss-runtime",x.message,n._executing)}finally{n._zssContext=s,n._scriptOwner=r,n._executing=a}}function Ya(n,e="<script>"){const t=[];let i;for(const[s,r]of String(n).replace(/^\uFEFF/,"").split(/\r?\n/).entries()){let a=!1,o=!1,l="";for(let v=0;v<r.length;v++){const y=r[v];if(y==='"'&&!o&&(a=!a),y===";"&&!a)break;l+=y,o=y==="\\"&&!o}const c=l.trim();if(!c)continue;const d=c.match(/^\[([^\]]+)\]/);if(d){i={name:d[1].trim().toLowerCase(),source:e,line:s+1,entries:[],values:{}},t.push(i);continue}let f=-1,h=0,u=!1,p=!1;for(let v=0;v<c.length;v++){const y=c[v];if(y==='"'&&!p&&(u=!u),!u){if(y==="("||y==="[")h++;else if(y===")"||y==="]")h--;else if(y==="="&&h===0){f=v;break}}p=y==="\\"&&!p}if(!i||f<1)continue;const x=c.slice(0,f).trim().toLowerCase(),m=c.slice(f+1).trim();i.entries.push({key:x,value:m,line:s+1}),i.values[x]=m}return t}const Af={"data.life":1e3,"data.power":3e3,"data.attack":100,"data.defence":100,"data.airjuggle":15,"data.liedown.time":60,"data.sparkno":2,"data.guard.sparkno":40,"data.fall.defence_up":50,"data.ko.echo":0,"data.intpersistindex":60,"data.floatpersistindex":40,"size.xscale":1,"size.yscale":1,"size.ground.back":15,"size.ground.front":16,"size.air.back":12,"size.air.front":12,"size.height":60,"size.attack.dist":160,"size.proj.doscale":0,"size.proj.attack.dist":90,"size.head.pos.x":0,"size.head.pos.y":-90,"size.mid.pos.x":0,"size.mid.pos.y":-60,"size.draw.offset.x":0,"size.draw.offset.y":0,"size.shadowoffset":0,"velocity.walk.fwd.x":2.4,"velocity.walk.back.x":-2.2,"velocity.run.fwd.x":4.6,"velocity.run.fwd.y":0,"velocity.run.back.x":-4.5,"velocity.run.back.y":-3.8,"velocity.jump.neu.x":0,"velocity.jump.neu.y":-8.4,"velocity.jump.y":-8.4,"velocity.jump.fwd.x":2.5,"velocity.jump.back.x":-2.55,"velocity.runjump.fwd.x":4,"velocity.runjump.fwd.y":-8.1,"velocity.runjump.back.x":-2.55,"velocity.runjump.back.y":-8.1,"velocity.airjump.neu.x":0,"velocity.airjump.neu.y":-8.1,"velocity.airjump.y":-8.1,"velocity.airjump.fwd.x":2.5,"velocity.airjump.back.x":-2.55,"velocity.air.gethit.groundrecover.x":-.15,"velocity.air.gethit.groundrecover.y":-3.5,"velocity.air.gethit.airrecover.mul.x":.5,"velocity.air.gethit.airrecover.mul.y":.2,"velocity.air.gethit.airrecover.add.x":0,"velocity.air.gethit.airrecover.add.y":-4.5,"velocity.air.gethit.airrecover.back":-1,"velocity.air.gethit.airrecover.fwd":0,"velocity.air.gethit.airrecover.up":-2,"velocity.air.gethit.airrecover.down":1.5,"movement.yaccel":.44,"movement.stand.friction":.85,"movement.crouch.friction":.82,"movement.stand.friction.threshold":2,"movement.crouch.friction.threshold":.05,"movement.airjump.num":1,"movement.airjump.height":35,"movement.air.gethit.groundlevel":25,"movement.air.gethit.groundrecover.ground.threshold":-20,"movement.air.gethit.groundrecover.groundlevel":10,"movement.air.gethit.airrecover.threshold":-1,"movement.air.gethit.airrecover.yaccel":.35,"movement.air.gethit.trip.groundlevel":15,"movement.down.bounce.offset.x":0,"movement.down.bounce.offset.y":20,"movement.down.bounce.yaccel":.4,"movement.down.bounce.groundlevel":12,"movement.down.friction.threshold":.05},Ir=new Set(["null","changestate","selfstate","changeanim","changeanim2","ctrlset","statetypeset","velset","veladd","velmul","posset","posadd","posfreeze","gravity","turn","varset","varadd","varmul","varrandom","varrangeset","parentvarset","parentvaradd","lifeadd","lifeset","poweradd","powerset","hitvelset","hitdef","hitby","nothitby","hitoverride","sprpriority","width","screenbound","playerpush","assertspecial","assertinput","playsnd","stopsnd","sndpan","envshake","palfx","allpalfx","bgpalfx","explod","modifyexplod","removeexplod","explodbindtime","targetbind","targetfacing","targetlifeadd","targetpoweradd","targetvelset","targetveladd","targetstate","targetdrop","bindtoroot","bindtoparent","bindtotarget","attackmulset","defencemulset","hitadd","hitcount","hitfallset","hitfallvel","hitfallDamage".toLowerCase(),"angleadd","angleset","anglemul","angledraw","offset","destroyself","helper","projectile","pause","superpause","afterimage","afterimagetime","trans","movehitreset","attackdist","reversaldef","envcolor","fallenvshake","remappal","makedust","gamemakeanim","forcefeedback","displaytoclipboard","appendtoclipboard","clearclipboard","victoryquote","mapset","mapadd"]);new Set(Ir);const qr=new Set(["time","stateno","prevstateno","anim","animelem","animtime","ctrl","statetype","movetype","physics","life","lifemax","power","powermax","facing","alive","gametime","hitpausetime","hitshakeover","hitover","movecontact","movehit","moveguarded","movereversed","hitcount","uniqhitcount","numhelper","numexplod","numtarget","numenemy","numpartner","ishelper","roundstate","roundno","matchno","teamside","teampower","tickspersecond","ailevel","palno","id","name","authorname","numproj","win","lose","drawgame","inguarddist","canrecover","pos x","pos y","vel x","vel y","screenpos x","screenpos y","command","const","const240p","const480p","const720p","random","animexist","selfanimexist","animelemtime","animelemno","gethitvar","playeridexist","p2name","p2life","p2stateno","p2statetype","p2movetype","p2bodydist x","p2dist x","p2bodydist y","p2dist y","hitdefattr","roundsexisted","camerapos x","camerapos y","hitfall","hitvel x","hitvel y","frontedgedist","backedgedist","frontedgebodydist","backedgebodydist","var","fvar","sysvar","sysfvar"]);qr.add("teammode");qr.add("map");qr.add("ishometeam");for(const n of["p1name","p3name","p4name","frontedge","backedge","const240p","const480p","const720p"])qr.add(n);const Rf=new Set(["playsnd","stopsnd","sndpan","envshake","envcolor","palfx","allpalfx","bgpalfx","afterimage","afterimagetime"]),oa=n=>yn(n).replaceAll("\\","/").toLowerCase().replace(/^\.\//,""),yn=n=>String(n??"").replace(/^"(.*)"$/,"$1"),la=An,Yr=new Map;for(const n of["attackdist","attackmulset","changeanim","changeanim2","changestate","selfstate","ctrlset","defencemulset","hitadd","lifeadd","lifeset","playerpush","playsnd","poweradd","powerset","targetfacing","targetlifeadd","targetpoweradd","targetstate"])Yr.set(n,["value"]);for(const[n,e]of Object.entries({afterimagetime:["time"],assertspecial:["flag"],assertinput:["flag"],displaytoclipboard:["text"],appendtoclipboard:["text"],envshake:["time"],explod:["anim"],hitdef:["attr"],pause:["time"],reversaldef:["reversal.attr"],sndpan:["channel"],stopsnd:["channel"],trans:["trans"],varrandom:["v"]}))Yr.set(n,e);const ca=new WeakMap;for(const n of["mapset","mapadd"])Yr.set(n,["map","value"]);function bs(n){var i;if(ca.has(n))return ca.get(n);const e={ignorehitpause:0,persistent:1,groups:new Map,errors:[],warnings:[]};for(const s of Yr.get(n.type)||[])n.values[s]===void 0&&e.errors.push({line:n.line,message:`${n.type} requires ${s}.`});["varset","varadd","varmul","parentvarset","parentvaradd"].includes(n.type)&&!n.entries.some(s=>/^(?:var|fvar|sysvar|sysfvar)\s*\(/.test(s.key))&&(n.values.v===void 0&&n.values.fv===void 0&&e.errors.push({line:n.line,message:`${n.type} requires v or fv (or alternate variable assignment syntax).`}),n.values.value===void 0&&e.errors.push({line:n.line,message:`${n.type} requires value.`})),n.type==="varrangeset"&&n.values.value===void 0&&n.values.fvalue===void 0&&e.errors.push({line:n.line,message:"VarRangeSet requires value or fvalue."}),n.type==="sndpan"&&n.values.pan===void 0&&n.values.abspan===void 0&&e.errors.push({line:n.line,message:"SndPan requires pan or abspan."});for(const s of["ignorehitpause","persistent"])if(n.values[s]!==void 0){if(s==="ignorehitpause"&&n.language==="zss"&&n.type==="explod")continue;const r=n.values[s],a=Number(r);!/^[+-]?\d+$/.test(r)||!Number.isSafeInteger(a)||a<-2147483648||a>2147483647||s==="persistent"&&a<0?e.errors.push({line:((i=n.entries.find(o=>o.key===s))==null?void 0:i.line)||n.line,message:`${s} requires ${s==="persistent"?"a nonnegative":"a signed 32-bit"} integer constant; expressions are not allowed.`}):e[s]=a}for(const s of n.entries){const r=/^trigger([1-9]\d*)$/.exec(s.key);if(r){const a=Number(r[1]);e.groups.has(a)||e.groups.set(a,[]),e.groups.get(a).push(s)}}e.groups.has(1)||e.errors.push({line:n.line,message:"A state controller requires at least one trigger1."});let t=1;for(;e.groups.has(t);)t++;for(const[s,r]of e.groups)s>=t&&(e.groups.delete(s),e.warnings.push({line:r[0].line,message:`trigger${s} is ignored because trigger${t} is missing.`}));return ca.set(n,e),e}const Cf=new Map(Object.entries({time:"time",stateno:"stateNo",prevstateno:"prevStateNo",anim:"scriptAnim",animtime:"animTime",ctrl:"ctrl",statetype:"stateType",movetype:"moveType",physics:"physics",life:"life",lifemax:"maxLife",power:"power",powermax:"maxPower",facing:"facing",hitpausetime:"hitPauseTime",movecontact:"moveContact",movehit:"moveHit",moveguarded:"moveGuarded",hitcount:"hitCount",uniqhitcount:"uniqHitCount",id:"id",name:"name"}));function dh(n,{commonText:e="",constantDefaults:t={},constantsFromCnsOnly:i=!1}={}){var v,y,T,R;const s={states:new Map,constants:new Map(Object.entries({...Af,...t})),quotes:new Map,functions:new Map,initialMaps:new Map,zssExpressions:new Set,diagnostics:[],sources:[],controllerTypes:new Set},r=[];e&&r.push(["<common states>",e]);const a=n.files||{},o=((v=n.path)==null?void 0:v.slice(0,n.path.lastIndexOf("/")+1))||"",l=S=>{const M=oa(S),g=o.lastIndexOf("/chars/"),_=g<0?"":o.slice(0,g+1),L=(n.checks||[]).find(A=>A.ok&&A.path&&oa(A.value||"")===M&&a[A.path]),E=[L==null?void 0:L.path,o+M,M,_+"data/"+M,"data/"+M];return E.find(A=>A&&a[A])||E.filter(Boolean).map(A=>A+".zss").find(A=>a[A])},c=((y=n.def)==null?void 0:y.files)||{},d=c.cns?l(c.cns):(T=(n.checks||[]).find(S=>S.key==="cns"&&S.ok))==null?void 0:T.path,f=c.stcommon&&l(c.stcommon);f?r.push([f,la(a[f])]):c.stcommon&&oa(c.stcommon).split("/").at(-1)!=="common1.cns"&&s.diagnostics.push({source:n.path,line:0,type:"missing-file",message:`Common state file not found: ${c.stcommon}`});const h=new Set;for(const[S,M]of Object.entries(c)){if(!/^(cns|cmd|st\d*)$/.test(S)||!M)continue;const g=l(M);g&&!h.has(g)?(h.add(g),r.push([g,la(a[g])])):g||s.diagnostics.push({source:n.path,line:0,type:"missing-file",message:`${S}: ${M}`})}for(const S of n.checks||[])/^(cns|cmd|st\d*)$/.test(S.key)&&S.ok&&a[S.path]&&!h.has(S.path)&&(h.add(S.path),r.push([S.path,la(a[S.path])]));let u=0,p=0;const x=S=>Pr(S,{resolve:(M,g)=>{if(M!=="const"||!s.constants.has(String(g[0]).toLowerCase()))throw Error("State identifiers must use known numeric constants.");return s.constants.get(String(g[0]).toLowerCase())}});for(const[S,M]of Object.entries(((R=n.def)==null?void 0:R.map)||{}))try{const g=Math.fround(x(M));if(!Number.isFinite(g)||s.initialMaps.size>=4096)throw Error("Invalid or excessive initial named maps.");s.initialMaps.set(S.toLowerCase(),g)}catch(g){s.diagnostics.push({source:n.path,line:0,type:"constant",message:g.message})}const m=new Map;for(const[S,M]of r){if(/\.zss$/i.test(S)||!/^\s*\[\s*(?:constants|map)\s*\]/im.test(M))continue;const g=Ya(M,S);m.set(S,g);for(const _ of g)if(_.name==="constants"||_.name==="map")for(const L of _.entries)try{const E=Math.fround(x(L.value));if(!Number.isFinite(E))throw Error("Expected a finite float32 value.");if(_.name==="map"&&s.initialMaps.size>=4096&&!s.initialMaps.has(L.key))throw Error("Initial named map limit exceeded.");(_.name==="map"?s.initialMaps:s.constants).set(L.key,E)}catch(E){s.diagnostics.push({source:S,line:L.line,type:"constant",message:E.message})}}for(const[S,M]of r){if(s.sources.push(S),/\.zss$/i.test(S)){try{const _=Mf(M,S),L=new Map(s.functions),E=new Map(s.states),A=[],U=[..._.functions.map(N=>({value:N,isFunction:!0})),..._.states.map(N=>({value:N,isFunction:!1}))].sort((N,P)=>N.value.line-P.value.line);for(const{value:N,isFunction:P}of U){const B=P?N.body:N.zssNodes;if(uh(B,F=>{if(++p>1e5)throw new _n("Combined ZSS statement limit (100,000) exceeded.",S,F.line);if(F.kind==="call"){const k=L.get(F.name);if(!k)throw new _n(`Function ${F.name} must be defined before its caller.`,S,F.line);if(F.args.length!==k.args.length||F.outputs&&F.outputs.length!==k.outputs.length)throw new _n(`Function ${F.name} argument/return count mismatch.`,S,F.line);F.function=k}F.controller&&(F.controller.id=++u,F.controller.state=P?N.name:N.idExpression,A.push(F.controller),P||N.controllers.push(F.controller))}),P)L.set(N.name,N);else{const F=x(N.idExpression);if(!Number.isInteger(F)||F<-2147483648||F>2147483647)throw new _n("State number must be a signed 32-bit integer constant.",S,N.line);if(F===-4||N.idExpression.replace(/\s/g,"")==="+1")throw new _n("Extended global states -4/+1 are not scheduled by this preview.",S,N.line);N.id=F,E.set(F,N);const k=new Set(["type","movetype","physics","anim","velset","ctrl","poweradd","facep2","hitdefpersist","movehitpersist","hitcountpersist","sprpriority","juggle"]);for(const I of N.entries)k.has(I.key)||s.diagnostics.push({source:S,line:I.line,type:"unsupported-state-parameter",message:`Statedef parameter ${I.key} is not implemented.`})}}s.functions=L,s.states=E;for(const N of _.expressions)s.zssExpressions.add(N);for(const N of A){s.controllerTypes.add(N.type);const P=bs(N);for(const B of P.errors)s.diagnostics.push({source:S,line:B.line,type:"controller-parameter",fatal:!0,message:B.message});Ir.has(N.type)||s.diagnostics.push({source:S,line:N.line,type:"unsupported-controller",name:N.type,message:`Controller ${N.type} is not implemented.`})}}catch(_){s.diagnostics.push({source:S,line:_.line||1,type:"zss-compile",fatal:!0,message:_.message})}continue}if(/\.lua$/i.test(S)){s.diagnostics.push({source:S,line:1,type:"script-language",fatal:!0,message:"Lua character-state execution is not implemented."});continue}let g;for(const _ of m.get(S)||Ya(M,S)){const L=_.name.match(/^statedef\s+(-?\d+)\s*$/);if(L){g={id:+L[1],..._,controllers:[]},s.states.set(g.id,g);const E=new Set(["type","movetype","physics","anim","velset","ctrl","poweradd","facep2","hitdefpersist","movehitpersist","hitcountpersist","sprpriority","juggle"]);for(const A of _.entries)E.has(A.key)||s.diagnostics.push({source:S,line:A.line,type:"unsupported-state-parameter",message:`Statedef parameter ${A.key} is not implemented.`})}else if(/^state(?:\s|$)/.test(_.name)){if(!g){s.diagnostics.push({source:S,line:_.line,type:"parse",message:"State controller has no preceding Statedef."});continue}const E=yn(_.values.type||"").toLowerCase(),A={..._,id:++u,type:E,state:g.id};g.controllers.push(A),s.controllerTypes.add(E);const U=bs(A);for(const[N,P]of[["controller-parameter",U.errors],["trigger-numbering",U.warnings]])for(const B of P)s.diagnostics.push({source:S,line:B.line,type:N,message:B.message});Ir.has(E)||s.diagnostics.push({source:S,line:_.line,type:"unsupported-controller",name:E||"(missing type)",message:`Controller ${E||"(missing type)"} is not implemented.`})}else if(_.name==="quotes")for(const E of _.entries){const A=/^victory(\d{1,2})$/.exec(E.key);if(A)try{s.quotes.set(+A[1],sh(E.value))}catch(U){s.diagnostics.push({source:S,line:E.line,type:"quote",message:U.message})}}else if(/^(data|size|velocity|movement)$/.test(_.name)){if(i&&S!==d)continue;for(const E of _.entries){const A=`${_.name}.${E.key}`,U=E.value.split(",").map(N=>Number(N.trim()));U.some(N=>!Number.isFinite(N))||(s.constants.set(A,U.length===1?U[0]:U),(U.length>1||_.name==="velocity")&&(s.constants.set(A+".x",U[0]),U.length>1&&s.constants.set(A+".y",U[1])),A==="velocity.jump.neu"&&U.length>1&&s.constants.set("velocity.jump.y",U[1]),A==="velocity.airjump.neu"&&U.length>1&&s.constants.set("velocity.airjump.y",U[1]))}}}}return s}const Xt=n=>{const e=Number(n);if(!Number.isFinite(e))throw new Error(`Expected finite number, received ${String(n)}`);return e},ot=n=>Math.trunc(Xt(n)),Bt=n=>typeof n=="number"&&Number.isFinite(n)&&n!==0,ni=(n,e,t)=>Math.min(t,Math.max(e,n));class Dr{constructor(e,t={}){var s,r,a,o,l;this.character=e,this.options=t,this.program=t.program||dh(e,t),this.animations=new Map((e.animations||[]).map(c=>[c.id,c])),this.diagnostics=[...this.program.diagnostics],this._diagnosticKeys=new Set(this.diagnostics.map(c=>`${c.source}:${c.line}:${c.type}:${c.message}`)),this._seed=t.seed??439041101,this.id=t.id??1,this.name=((r=(s=e.def)==null?void 0:s.info)==null?void 0:r.name)||"Character";const i=(((o=(a=e.def)==null?void 0:a.info)==null?void 0:o.localcoord)||"320,240").split(",").map(Number);this.localcoord={x:i[0]||320,y:i[1]||240},this.coordinateScale=320/this.localcoord.x,this.baseCoordinateScale=this.coordinateScale,this.world=t.world||null,this.parent=t.parent||null,this.root=t.root||this,this.helperId=t.helperId??0,this.keyCtrl=t.keyCtrl??!this.parent,this.ownPal=t.ownPal??!1,this.teamSide=t.teamSide??((l=this.root.options)==null?void 0:l.teamSide)??1,this.commonAnimations=t.commonAnimations||new Map,this.reset()}reset(){var e,t,i;this.vars=new Int32Array(60),this.fvars=new Float32Array(40),this.stateOwner=this,this.animationOwner=this,this.destroyed=!1,this.coordinateScale=this.baseCoordinateScale,this._scriptOwner=null,this.sysvars=new Int32Array(5),this.sysfvars=new Float32Array(5),this.maxLife=this.constant("data.life"),this.life=this.maxLife,this.maxPower=this.constant("data.power"),this._power=0,this.parent||(this.power=0),this.pos={x:((e=this.options.position)==null?void 0:e.x)||0,y:((t=this.options.position)==null?void 0:t.y)||0},this.vel={x:0,y:0},this.facing=this.options.facing===-1?-1:1,this.ctrl=1,this.stateType="S",this.moveType="I",this.physics="S",this.stateNo=0,this.prevStateNo=0,this.time=0,this.gameTime=0,this.anim=0,this.frameIndex=0,this.frameTime=0,this.animationTime=0,this.animationCycleTime=0,this.animationLooped=!1,this.animationEnded=!1,this._animationSerial=0,this._pausedAnimation=null,this._inPausedAnimation=!1,this._animationLoopReset=!1,this.collisionFrame=null,this.collisionAnimationOwner=null,this.collisionAnimation=null,this.collisionFrameIndex=0,this.collisionFrameTime=0,this.hitDef=null,this.reversalDef=null,this.moveReversed=0,this._hitSerial=0,this.hitPauseTime=0,this.hitTime=-1,this.hitId=-1,this.hitSourceId=void 0,this._spentHitDefs=new WeakSet,this.inGuardDistance=!1,this._projectileContactShield=!1,this.moveContact=0,this.moveHit=0,this.moveGuarded=0,this.hitCount=0,this.uniqHitCount=0,this.comboHits=0,this._lastHitCountTick=null,this.getHitVars=df(this),this._fallXVelocityDefined=!1,this._fallDefenceMultiplier=1,this._previousInput=new Set,this.rawInput=new Set,this._fallEntry=-1,this.targets=[],this.targetHitIds=new Map,this.helpers=[],this.explods=[],this.drawExplods=[],this.events=[],this.commands=new Set,this.asserted=new Set,this.opponent=null,this.pendingAssertedInputs=new Set,this.maps=new Map(this.program.initialMaps||[]),this._zssContext=null,this._zssSteps=0,this._pendingStateEntry=null,this._pendingHitTransform=null,this.attackMultiplier=1,this.defenceMultiplier=1,this.sprPriority=0,this.angle=0,this.drawScale={x:1,y:1},this.drawOffset={x:0,y:0},this.playerPush=!this.parent,this.screenBound=!this.parent,this.moveCamera={x:!this.parent,y:!this.parent},this.posFrozen=!1,this.width=null,this._previousWidth=null,this.hitFilters=[null,null],this.hitOverrides=new Map,this.bound=null,this._controllerCounts=new Map,this._entrySerial=0,this.pauseMoveTime=this.options.pauseMoveTime||0,this.superMoveTime=this.options.superMoveTime||0,this.projectileHistory=[],this.trans=null,this.angleDraw=!1,this.juggleCost=0,this._juggleSerial=0,this._paletteRemaps=new Map,this.paletteNo=Math.max(1,Math.min(256,Math.trunc(this.options.paletteNo??((i=this.parent)==null?void 0:i.paletteNo)??1))),this.paletteNo!==1&&this._paletteRemaps.set("1,1",[1,this.paletteNo]),this._initializing=!1,this.aiLevel=this.parent?this.root.aiLevel:Math.max(0,Math.min(8,Math.trunc(Number.isFinite(Number(this.options.aiLevel))?Number(this.options.aiLevel):0))),this.clipboard="",this.victoryQuoteIndex=-1,this.victoryQuote=null,this._dustTicks=new Map,this.cornerPush=0,this.cornerPushTarget=null,this.cornerPushSide=0,this._previousUp=!1,this.airJumps=0,this._changeCount=0,this._executing=null,this.attackDist=void 0,this.changeState(0),this.events=[]}diagnostic(e,t,i=this._executing){const s={source:(i==null?void 0:i.source)||this.character.path||"<character>",line:(i==null?void 0:i.line)||0,type:e,message:t};i&&(s.controller=i.type,s.state=i.state);const r=`${s.source}:${s.line}:${s.type}:${s.message}`;return this._diagnosticKeys.has(r)||(this._diagnosticKeys.add(r),this.diagnostics.push(s)),s}constant(e,t=this.coordinateScale){if(e=String(e).toLowerCase(),e==="data.fall.defence_mul")return 100/(100+this.constant("data.fall.defence_up",t));if(!this.program.constants.has(e))throw new Error(`Unknown character constant: ${e}`);const i=this.program.constants.get(e);return(Array.isArray(i)?i[0]:i)*(Cl(e)?this.baseCoordinateScale/t:1)}get animation(){return(this.animationOwner||this).animations.get(this.anim)}get scriptAnimationClock(){var e;return!this._inPausedAnimation&&((e=this._pausedAnimation)==null?void 0:e.logic)||this}get scriptAnim(){return this.scriptAnimationClock.anim}get scriptAnimation(){const e=this.scriptAnimationClock;return(e.animationOwner||this).animations.get(e.anim)}get currentFrame(){var e;return((e=this.animation)==null?void 0:e.frames[this.frameIndex])||null}get animElemTime(){return this.frameTime}get animTime(){return yf(this.scriptAnimation,this.scriptAnimationClock)}get alive(){return this.life>0}get paletteRemaps(){return this.parent&&!this.ownPal?this.parent.paletteRemaps:this._paletteRemaps}ownedHelpers(){return this.world?this.world.entities.filter(e=>e.parent&&!e.destroyed&&(this===this.root?e.root===this:e.parent===this)):this.helpers.filter(e=>!e.destroyed)}get power(){return this.parent?this.root.power:this._power}set power(e){this.parent?this.root.power=e:this._power=e}evaluate(e,t=this._executing,i=!1){try{return(this.options.expressionEvaluator||(i?Xa:Pr))(e,{resolve:(s,r=[],a=null)=>{var o;if(s==="zsslocal"){const l=(o=this._zssContext)==null?void 0:o.locals.get(String(r[0]));if(!l)throw new Gi(`ZSS local ${r[0]} is unavailable.`);if(l.bottom)throw l.error;return l}return this.resolveTrigger(s,r,a)},assign:(s,r,a)=>this.assignVariable(s,r,a),onWarning:s=>{s.bottom||this.diagnostic("expression-warning",`${e}: ${s.message}`,t)},typedResult:i})}catch(s){throw s.bottom||this.diagnostic("expression",`${e}: ${s.message}`,t),s}}variableArray(e){const t={var:this.vars,fvar:this.fvars,sysvar:this.sysvars,sysfvar:this.sysfvars};if(!t[e])throw new Error(`Unsupported assignable variable: ${e}`);return t[e]}assignVariable(e,t,i){const s=this.variableArray(e.toLowerCase()),r=ot(t[0]);if(r<0||r>=s.length)throw new Ct(`${e} index out of range: ${r}`);return s[r]=Xt(i),s[r]}setMap(e,t,i=!1){if(e=String(e).toLowerCase(),!e||e.length>128||e.includes("\0"))throw Error("Invalid map name.");if(!this.maps.has(e)&&this.maps.size>=4096)throw Error("Named map limit (4,096) exceeded.");const s=Math.fround(Xt(t)+(i&&this.maps.get(e)||0));if(!Number.isFinite(s))throw new Ct("Map value is not finite.");return this.maps.set(e,s),s}resolveTrigger(e,t=[],i=null,s=this.coordinateScale){var h,u,p,x,m,v,y,T,R,S,M,g,_,L,E,A,U,N,P,B,F,k,I,C,G,W,ee,ne,V,ie,ve,_e,ae,Le,rt,Re,Ge;if(e=e.toLowerCase(),i){let se;const ge=i.name.toLowerCase();if(["enemynear","enemy","p2"].includes(ge)){const Ae=(((h=this.world)==null?void 0:h.entities)||[this.opponent]).filter(it=>it&&!it.destroyed&&!it.parent&&it.teamSide!==this.teamSide);ge==="enemynear"&&Ae.sort((it,Dt)=>Math.abs(it.pos.x-this.pos.x)-Math.abs(Dt.pos.x-this.pos.x)),se=Ae[Math.trunc(i.args[0]||0)]}else if(ge==="root")se=this.root||this;else if(ge==="parent")se=this.parent;else if(ge==="partner")se=(((u=this.world)==null?void 0:u.entities)||[]).filter(Ae=>!Ae.parent&&Ae!==this.root&&Ae.teamSide===this.teamSide)[Math.trunc(i.args[0]||0)];else if(ge==="helper")se=this.ownedHelpers().find(Ae=>!i.args.length||Ae.helperId===+i.args[0]);else if(ge==="target")se=this.targets.find(Ae=>!i.args.length||(this.targetHitIds.get(Ae.id)??Ae.hitId)===+i.args[0]);else if(ge==="playerid")se=((p=this.world)==null?void 0:p.findPlayer(+i.args[0]))||[this,this.opponent,...this.helpers].find(Ae=>(Ae==null?void 0:Ae.id)===+i.args[0]);else throw new Error(`Unsupported redirection: ${ge}`);if(!se||se.destroyed){const Ae=new Error(`Redirection ${ge} has no matching player`);throw Ae.bottom=!0,Ae}return se.resolveTrigger(e,t,null,s)}if(["var","fvar","sysvar","sysfvar"].includes(e)){const se=this.variableArray(e),ge=ot(t[0]);if(ge<0||ge>=se.length)throw new Ct(`${e} index out of range: ${ge}`);return se[ge]}const r=Cf.get(e);if(r)return this[r];if(e==="map")return{value:this.maps.get(String(t[0]).toLowerCase())||0,float:!0};if(e==="command")return+this.commands.has(String(t[0]));if(e==="const")return this.constant(t[0],s);if(e==="const240p")return Xt(t[0])/this.coordinateScale;if(e==="const480p")return Xt(t[0])/(2*this.coordinateScale);if(e==="const720p")return Xt(t[0])/(4*this.coordinateScale);if(e==="random")return this._seed^=this._seed<<13,this._seed^=this._seed>>>17,this._seed^=this._seed<<5,(this._seed>>>0)%1e3;if(e==="animexist"||e==="selfanimexist")return+(e==="selfanimexist"?this:this.scriptAnimationClock.animationOwner).animations.has(ot(t[0]));if(e==="animelemtime")return xf(this.scriptAnimation,this.scriptAnimationClock,ot(t[0]));if(e==="animelemno")return _f(this.scriptAnimation,this.scriptAnimationClock,Xt(t[0]||0));if(e==="gethitvar"){const se=String(t[0]).toLowerCase();if(se==="isbound")return+(!!this.bound&&!this.bound.target.destroyed);if(se==="hittime")return this.hitTime;if(se==="hitshaketime")return(x=this.world)!=null&&x.orderedPhases?this.getHitVars.hitshaketime||0:this.hitPauseTime;if(se in this.getHitVars)return this.getHitVars[se]*(oh.has(se)?this.coordinateScale/s:1);if(ff.has(se))return 0;throw new Error(`Unsupported GetHitVar field: ${se}`)}if(e==="inguarddist")return+(this.world?this.inGuardDistance||!1:Qc(this,this.opponent?[this.opponent]:[]));const a=this.opponent,o=(m=this.world)==null?void 0:m.roundFlow,l=this.root===((v=this.world)==null?void 0:v.player)?"player":"opponent",c=!!(o!=null&&o.roundWinner)&&o.roundWinner===l,d=!!(o!=null&&o.roundWinner)&&o.roundWinner!=="draw"&&!c,f={animelem:this.scriptAnimationClock.frameIndex+1,alive:+this.alive,gametime:((y=this.world)==null?void 0:y.ticks)??this.gameTime,hitshakeover:+(((T=this.world)!=null&&T.orderedPhases?this.getHitVars.hitshaketime||0:this.hitPauseTime)===0),hitover:+(this.hitTime<0),movereversed:this.moveReversed||0,numhelper:this.ownedHelpers().length,numexplod:this.explods.length,numtarget:this.targets.length,numenemy:a?1:0,numpartner:0,ishelper:+!!this.parent,roundstate:this.roundState??2,roundsexisted:this.roundsExisted??0,roundno:this.roundNo??1,matchno:this.matchNo??1,matchover:+!!((R=this.world)!=null&&R.matchOver),teamside:this.teamSide??this.id,teampower:this.power,tickspersecond:60,aiLevel:this.aiLevel||0,ailevel:this.aiLevel||0,palno:this.paletteNo||1,teammode:"single",ishometeam:+(this.teamSide===1),authorname:((M=(S=this.character.def)==null?void 0:S.info)==null?void 0:M.author)||"",numproj:(((g=this.world)==null?void 0:g.projectiles)||[]).filter(se=>se.owner===this&&!se.removing&&!se.removed).length,win:o?+c:+(this.roundState===4&&this.alive&&(a==null?void 0:a.life)<=0),lose:o?+d:+(this.roundState===4&&!this.alive),drawgame:o?+(o.roundWinner==="draw"):+(this.roundState===4&&!this.alive&&(a==null?void 0:a.life)<=0),winko:+(c&&o.reason!=="time"),wintime:+(c&&o.reason==="time"),winperfect:+(c&&this.life===this.maxLife),loseko:+(d&&o.reason!=="time"),losetime:+(d&&o.reason==="time"),loseperfect:+(d&&(a==null?void 0:a.life)===(a==null?void 0:a.maxLife)),camerazoom:this.cameraZoom??1,gamewidth:(((_=this.world)==null?void 0:_.view.width)??320)/s,gameheight:(((L=this.world)==null?void 0:L.view.height)??240)/s,screenwidth:320/s,screenheight:(((E=this.world)==null?void 0:E.view.displayHeight)??240)/s,leftedge:(((A=this.world)==null?void 0:A.view.left)??-160)/s,rightedge:(((U=this.world)==null?void 0:U.view.right)??160)/s,topedge:(((N=this.world)==null?void 0:N.view.top)??-240)/s,bottomedge:(((P=this.world)==null?void 0:P.view.bottom)??0)/s,frontedge:(this.facing===1?((B=this.world)==null?void 0:B.view.right)??160:((F=this.world)==null?void 0:F.view.left)??-160)/s,backedge:(this.facing===1?((k=this.world)==null?void 0:k.view.left)??-160:((I=this.world)==null?void 0:I.view.right)??160)/s,canrecover:+(!!this.getHitVars.fall&&this.getHitVars["fall.recover"]!==0&&(this.getHitVars["fall.time"]||0)>=(this.getHitVars["fall.recovertime"]??4)),hitfall:this.getHitVars.fall||0,"hitvel x":(this.getHitVars.xvel||0)*this.coordinateScale/s,"hitvel y":(this.getHitVars.yvel||0)*this.coordinateScale/s,"pos x":(this.pos.x-(((C=this.cameraPos)==null?void 0:C.x)||0))/s,"pos y":this.pos.y/s,"vel x":this.vel.x/s,"vel y":this.vel.y/s,"screenpos x":(this.pos.x-(((G=this.world)==null?void 0:G.view.left)??-160))/s,"screenpos y":(this.pos.y-(((W=this.world)==null?void 0:W.view.top)??-240))/s,"camerapos x":(((ee=this.cameraPos)==null?void 0:ee.x)||0)/s,"camerapos y":(((ne=this.cameraPos)==null?void 0:ne.y)||0)/s};if(e==="stagevar"){if(!((V=this.world)!=null&&V.stage))throw Error("StageVar requires an imported stage.");return this.world.stage.variable(t[0])}if(e==="ishelper"&&t.length)return+(!!this.parent&&this.helperId===+t[0]);if(e==="numprojid")return(((ie=this.world)==null?void 0:ie.projectiles)||[]).filter(se=>se.owner===this&&!se.removing&&!se.removed&&se.projId===Math.max(0,Math.trunc(+t[0]))).length;if(/^proj(contact|hit|guarded|cancel)time$/.test(e)){const se=e.slice(4,-4),ge=Math.max(0,+t[0]||0),Ae=this.projectileHistory.at(-1);return Ae&&(!ge||Ae.projId===ge)&&(se==="contact"?["hit","guarded"].includes(Ae.type):Ae.type===se)?(((ve=this.world)==null?void 0:ve.ticks)??this.gameTime)-Ae.tick:-1}if(/^(parentdist|rootdist) [xy]$/.test(e)){const se=this.parent?e.startsWith("parent")?this.parent:this.root:null;if(!se||se.destroyed||e.startsWith("parent")&&!se.alive){const Ae=Error("No live parent or root");throw Ae.bottom=!0,Ae}const ge=e.at(-1);return(se.pos[ge]-this.pos[ge])*(ge==="x"?this.facing:1)/s}if(e==="numexplod"&&t.length)return this.explods.filter(se=>se.id===+t[0]).length;if(e==="numhelper"&&t.length)return this.ownedHelpers().filter(se=>+t[0]<=0||se.helperId===+t[0]).length;if(e==="numtarget"&&t.length)return this.targets.filter(se=>!se.destroyed&&(+t[0]<0||(this.targetHitIds.get(se.id)??se.hitId)===+t[0])).length;if(e==="playeridexist")return+((_e=this.world)!=null&&_e.findPlayer(+t[0])||[this,a,...this.helpers].find(se=>(se==null?void 0:se.id)===+t[0]&&!se.destroyed)?1:0);if(["frontedgedist","backedgedist","frontedgebodydist","backedgebodydist"].includes(e)){const se=e.startsWith("front"),ge=this.facing*(se?1:-1);if((ae=this.world)!=null&&ae.orderedPhases)return of(this,ge,{body:e.includes("body"),scale:s});const Ae=ge>0?((Le=this.world)==null?void 0:Le.view.right)??this.options.rightBound??160:((rt=this.world)==null?void 0:rt.view.left)??this.options.leftBound??-160;let it=(ge>0?Ae-this.pos.x:this.pos.x-Ae)/s;return e.includes("body")&&(it-=yr(this,ge,{edge:!0})/s),it}if(e==="p1name")return this.name;if(["p2name","p3name","p4name"].includes(e)){const se=(((Re=this.world)==null?void 0:Re.entities)||[this,a]).filter(Ae=>Ae&&!Ae.destroyed&&!Ae.parent),ge=e==="p2name"?a:e==="p3name"?se.find(Ae=>Ae!==this.root&&Ae.teamSide===this.teamSide):se.filter(Ae=>Ae.teamSide!==this.teamSide)[1];return(ge==null?void 0:ge.name)??{absent:!0}}if(["p2life","p2stateno","p2statetype","p2movetype","p2bodydist x","p2dist x","p2bodydist y","p2dist y"].includes(e)&&!a)throw new Ct(`${e}: P2 does not exist.`);if(e==="p2life")return a.life;if(e==="p2stateno")return a.stateNo;if(e==="p2statetype")return a.stateType;if(e==="p2movetype")return a.moveType;if(e==="p2bodydist x"||e==="p2dist x"){if(!a)return 0;let se=(a.pos.x-this.pos.x)*this.facing/s;if(e==="p2bodydist x"){const ge=se>=0;se-=yr(this,this.facing)/s+(ge?1:-1)*yr(a,ge?-this.facing:this.facing)/s}return se}if(e==="p2bodydist y"||e==="p2dist y")return a?(a.pos.y-this.pos.y)/s:0;if(e==="hitdefattr")return this.moveType!=="A"||!((Ge=this.hitDef)!=null&&Ge.attr)?0:+ra(t.map(String).join(","),this.hitDef.attr);if(Object.hasOwn(f,e))return f[e];throw new Gi(`Unsupported trigger: ${e}`)}parameter(e,t=this._executing,i=!1){try{return this.evaluate(e,t,i)}catch(s){if(!s.bottom)throw s;return this.diagnostic("parameter-bottom",`${e}: ${s.message} Parameter set to 0.`,t),i?{value:0,float:!1}:0}}value(e,t,i){var o;const s=e.values[t];if(s===void 0)return i;if((t==="ignorehitpause"||t==="persistent")&&!(t==="ignorehitpause"&&e.language==="zss"&&e.type==="explod")){const l=bs(e);if(l.errors.some(c=>c.message.startsWith(t)))throw Error(l.errors.find(c=>c.message.startsWith(t)).message);return l[t]}let r=(o=this._parameterCache)==null?void 0:o.get(e);if(this._parameterCache&&!r&&this._parameterCache.set(e,r=new Map),r!=null&&r.has(t))return r.get(t);const a=this.parameter(s,e);return r==null||r.set(t,a),a}vector(e,t,i=[0,0]){var o;const s=e.values[t];if(s===void 0)return[...i];let r=(o=this._parameterCache)==null?void 0:o.get(e);if(this._parameterCache&&!r&&this._parameterCache.set(e,r=new Map),r!=null&&r.has(t))return[...r.get(t)];const a=Hi(s).map(l=>Xt(this.parameter(l,e)));return r==null||r.set(t,a),a}text(e,t,i=""){return yn(e.values[t]??i)}changeAnimation(e,t=1,i=this){var o;if(e=ot(e),e<0&&(this.diagnostic("animation-value","Negative animation number; using action 0."),e=0),!i.animations.has(e))return this.diagnostic("missing-animation",`Animation ${e} does not exist.`),!1;const s=i.animations.get(e).frames,r=ot(t)-1,a=r>=0&&r<s.length?r:0;if(this._inPausedAnimation||(this._pausedAnimation=null),this._animationSerial++,this.animationOwner=i,this.anim=e,this.frameIndex=a,this.frameTime=0,this.animationEnded=!1,this.animationTime=((o=As(i.animations.get(e)))==null?void 0:o.offsets[a])||0,this.animationCycleTime=this.animationTime,this.animationLooped=!1,this._animationLoopReset=!1,this._inPausedAnimation){const l=aa(this);this._pausedAnimation.draw=l,this._pausedAnimation.visible={...l,frameIndex:a-1,frameTime:a>0?Math.max(1,s[a-1].ticks)-1:-1,animationTime:this.animationTime-1,animationCycleTime:this.animationCycleTime-1}}return!0}changeState(e,t,i=this.stateOwner||this){var d,f,h,u;e=ot(e);const s=i.program.states.get(e);if(!s)return this.diagnostic("missing-state",`State ${e} does not exist.`),!1;if((d=this.world)!=null&&d.orderedPhases&&(this.world.contactPhase||this.world.activeActor!==this&&((f=this.world._entities)!=null&&f.includes(this))))return this._pendingStateEntry={number:e,ctrl:t,owner:i,oldState:((h=this._pendingStateEntry)==null?void 0:h.oldState)??this.stateNo,oldOwner:((u=this._pendingStateEntry)==null?void 0:u.oldOwner)??this.stateOwner},this.prevStateNo=this.stateNo,this.stateNo=e,this.stateOwner=i,this.time=0,!0;if(++this._changeCount>64)return this.diagnostic("state-loop","More than 64 state changes in one tick; execution stopped."),!1;const r=this.stateOwner.program.states.get(this.stateNo);this.stateOwner=i,lf(this,It(i)),this.prevStateNo=this.stateNo,this.stateNo=e,this.time=0,t!==void 0&&ot(t)>=0&&(this.ctrl=+Bt(ot(t))),this._entrySerial++,this._controllerCounts.clear();let a=!1,o=!1,l=!1;try{a=Bt(this.value(s,"hitdefpersist",0)),o=Bt(this.value(s,"movehitpersist",0)),l=Bt(this.value(s,"hitcountpersist",0))}catch{}a||(this.hitDef=null,this.reversalDef=null),o||(this.moveContact=0,this.moveHit=0,this.moveGuarded=0,this.moveReversed=0),l||(this.hitCount=0,this.uniqHitCount=0,this._lastHitCountTick=null);const c=this.moveType;this.moveType="I",this._executing=s;try{const p=this.text(s,"type","S").toUpperCase(),x=this.text(s,"physics","N").toUpperCase();if(p!=="U"&&(this.stateType=p),x!=="U"&&(this.physics=x),s.values.movetype){const m=this.text(s,"movetype").toUpperCase();this.moveType=m==="U"?c:m}if(s.values.ctrl!==void 0&&(this.ctrl=+Bt(this.value(s,"ctrl",this.ctrl))),s.values.anim!==void 0){const m=ot(this.value(s,"anim",-1));m!==-1&&this.changeAnimation(m)}if(s.values.velset!==void 0){const[m=0,v=0]=this.vector(s,"velset");this.vel={x:m*this.coordinateScale,y:v*this.coordinateScale}}s.values.sprpriority!==void 0&&(this.sprPriority=ot(this.value(s,"sprpriority",0))),s.values.juggle!==void 0&&(this.juggleCost=Math.max(0,ot(this.value(s,"juggle",0))),this._juggleSerial++),s.values.poweradd!==void 0&&(this.power=ni(this.power+this.value(s,"poweradd",0),0,this.maxPower)),Bt(this.value(s,"facep2",0))&&this.opponent&&(this.facing=this.opponent.pos.x>=this.pos.x?1:-1)}catch{}return this._executing=null,this.events.push({type:"state",state:e,previous:r==null?void 0:r.id}),!0}shouldRun(e,t){const i=bs(e);if(i.errors.length||t&&!i.ignorehitpause)return!1;const s=e.entries.filter(c=>c.key==="triggerall");for(const c of s)try{if(!Bt(this.evaluate(c.value,{...e,line:c.line})))return!1}catch{return!1}const r=i.groups;let a=!1;for(const[,c]of[...r].sort(([d],[f])=>d-f)){let d=!0;for(const f of c)try{if(!Bt(this.evaluate(f.value,{...e,line:f.line}))){d=!1;break}}catch{d=!1;break}if(d){a=!0;break}}if(!a)return!1;const o=i.persistent,l=this._controllerCounts.get(e)||0;return this._controllerCounts.set(e,l+1),o===0?l===0:l%o===0}runState(e,t,i=this.stateOwner){const s=i.program.states.get(e);if(!s)return;if(s.zssNodes){Tf(this,s,i,t);return}const r=this._entrySerial;for(const a of s.controllers){const o=this._scriptOwner;this._scriptOwner=i,this._executing=a;try{this.shouldRun(a,t)&&this.execute(a)}catch(l){this.diagnostics.some(c=>c.message.includes(l.message)&&c.source===a.source)||this.diagnostic("controller",l.message,a)}if(this._executing=null,this._scriptOwner=o,this.destroyed||this._entrySerial!==r)break}}movementHeld(e){var r;if(!((r=this.world)!=null&&r.manageInputs))return this.commands.has(e);const t=this.rawInput,i=this.facing<0?"L":"R",s=this.facing<0?"R":"L";return e==="holdup"?t.has("U")&&!t.has("D"):e==="holddown"?t.has("D")&&!t.has("U"):e==="holdfwd"?t.has(i)&&!t.has(s):e==="holdback"?t.has(s)&&!t.has(i):!1}automaticTransitions(){var r,a,o,l,c,d,f;if(!this.ctrl||this.moveType==="H"||!this.alive||this.stateOwner!==this||this.parent&&!this.keyCtrl||(r=this.world)!=null&&r.roundFlow&&this.world.roundFlow.roundState!==2)return;const e=this.movementHeld("holddown"),t=this.movementHeld("holdup"),i=this.movementHeld("holdfwd")||this.movementHeld("holdback"),s=this.movementHeld("holdback")&&!this.asserted.has("noautoguard")&&!!this.resolveTrigger("inguarddist");if(!(s&&((a=this.world)!=null&&a.orderedPhases)&&[120,130,131,132,140].includes(this.stateNo))){if(s&&![120,130,131,132,140].includes(this.stateNo)){const h=this.stateType==="A"?"noairguard":this.stateType==="C"?"nocrouchguard":"nostandguard",u=(o=this.world)!=null&&o.orderedPhases?120:this.stateType==="A"?132:this.stateType==="C"?131:120;if(!this.asserted.has(h)&&this.program.states.has(u)){this.changeState(u);return}}if(!this.asserted.has("noautoturn")&&((c=(l=this.world)==null?void 0:l.stage)==null?void 0:c.definition.autoturn)!==!1&&this.stateType!=="A"&&this.opponent&&[0,10,11,12,20].includes(this.stateNo)){const h=this.opponent.pos.x>=this.pos.x?1:-1;h!==this.facing&&(this.facing=h)}if(this.stateType==="A"){t&&!this._previousUp&&this.airJumps<this.constant("movement.airjump.num")&&-this.pos.y>=this.constant("movement.airjump.height")&&this.program.states.has(45)&&(this.airJumps++,this.changeState(45));return}if(t&&!this.asserted.has("nojump")&&this.program.states.has(40)){this.changeState(40);return}if(e&&this.stateType==="S"&&!this.asserted.has("nocrouch")&&this.program.states.has(10)){this.changeState(10);return}if(!e&&this.stateType==="C"&&((d=this.world)!=null&&d.orderedPhases||[10,11].includes(this.stateNo))&&this.program.states.has(12)){this.changeState(12);return}!this.asserted.has("nowalk")&&this.stateType==="S"&&this.moveType==="I"&&(i&&((f=this.world)!=null&&f.orderedPhases?this.stateNo!==20&&this.stateNo!==100:this.stateNo===0)&&this.program.states.has(20)?this.changeState(20):!i&&this.stateNo===20&&this.changeState(0))}}tick({commands:e=new Set,opponent:t=null,paused:i=!1,input:s=null}={}){var f;const r=(f=this.world)==null?void 0:f.orderedPhases;i||(this._zssSteps=0);let a=!1;if(r&&!i&&this._pausedAnimation&&(this._pausedAnimation.serial===this._animationSerial?(Nl(this,this._pausedAnimation.logic),a=!0):this._pausedAnimation=null),i||(this._changeCount=0),r&&!i&&this._pendingHitTransform){const h=this._pendingHitTransform;this._pendingHitTransform=null,h.facing!==void 0&&(this.facing=h.facing);for(const u of["x","y"])h[u]!==void 0&&(this.pos[u]=h[u])}const o=this._animationSerial;if(r&&this._pendingStateEntry&&!i){const h=this._pendingStateEntry;this._pendingStateEntry=null,this.stateNo=h.oldState,this.stateOwner=h.oldOwner,this.changeState(h.number,h.ctrl,h.owner)}if(this.events=[],this.commands=e,this.opponent=t,pf(this,s,e),i||this.destroyed)return this.world||this.updateExplods({forceFrozen:!0}),this.gameTime++,this.events;this._executing=null;const l=this.hitPauseTime>0,c=r&&(this.getHitVars.hitshaketime||0)>0&&this.moveType==="H";if(r)if(l){if(!this._pausedAnimation){const h=aa(this);this._pausedAnimation={visible:h,draw:h,logic:null,serial:this._animationSerial},!a&&o===this._animationSerial&&!c&&this.advanceAnimation()}this._inPausedAnimation=!0}else this._pausedAnimation=null,!a&&o===this._animationSerial&&!c&&this.advanceAnimation();this.asserted=new Set,this.posFrozen=!1,l||(this.playerPush=!this.parent,this.screenBound=!this.parent,this.moveCamera={x:!this.parent,y:!this.parent},this._previousWidth=this.width,this.width=null),this.drawOffset={x:0,y:0},this.drawScale={x:1,y:1},this.trans=null,this.angleDraw=!1,this.moveContact>0&&!l&&this.moveContact++,this.moveHit>0&&!l&&this.moveHit++,this.moveGuarded>0&&!l&&this.moveGuarded++,this.moveReversed>0&&!l&&this.moveReversed++;for(let h=0;h<2;h++){const u=this.hitFilters[h];(u==null?void 0:u.time)>0&&--u.time===0&&(this.hitFilters[h]=null)}for(const[h,u]of this.hitOverrides)u.time>0&&--u.time===0&&this.hitOverrides.delete(h);if(this.parent||(this.stateOwner===this&&this.runState(-3,l,this),this.runState(-2,l,this)),this.keyCtrl&&this.stateOwner===this&&!this._initializing&&this.runState(-1,l,this.parent?this.root:this),this.destroyed)return this.finishPausedAnimation(),this.gameTime++,this.events;!l&&!this._initializing&&this.automaticTransitions(),!l&&this.stateNo===5110&&this.time>=1&&this.alive&&(this.getHitVars.recovertime??1)<=0&&this.stateOwner.program.states.has(5120)&&this.changeState(5120);let d;do d=this._entrySerial,this._initializing&&this.options.skipIntro&&[190,191].includes(this.stateNo)?(this.changeState(0),this.ctrl=1):this.runState(this.stateNo,l);while(d!==this._entrySerial&&this._changeCount<=64);if(this.destroyed)return this.finishPausedAnimation(),this.gameTime++,this.events;if(l||(this._initializing=!1),r&&!l&&this._animationLoopReset&&(this.animationTime=this.animationCycleTime,this._animationLoopReset=!1),this.collisionFrame=this.currentFrame,this.collisionAnimationOwner=this.animationOwner,l)return r&&(this.finishPausedAnimation(),this.syncAnimationFrame(this._pausedAnimation.draw)),Il(this,{hitPaused:!0}),this.world||this.updateExplods({hitPaused:!0}),this.hitPauseTime=Math.max(0,this.hitPauseTime-1),this.gameTime++,this.events;if(!this.posFrozen&&!this.bound&&!c&&(this.pos.x+=this.vel.x*this.facing+(r?0:this.cornerPush),this.pos.y+=this.vel.y,r&&(this.pos.x=Math.fround(this.pos.x),this.pos.y=Math.fround(this.pos.y))),r||(this.cornerPush*=ni(this.constant("movement.stand.friction"),0,1),Math.abs(this.cornerPush)<.01&&(this.cornerPush=0)),!c&&this.physics==="A")this.vel.y+=(r?Math.fround(this.constant("movement.yaccel")):this.constant("movement.yaccel"))*this.coordinateScale,r&&(this.vel.y=Math.fround(this.vel.y)),this.pos.y>=0&&this.vel.y>0&&!(r&&this.stateNo===105)&&(this.pos.y=0,this.vel.y=0,this.airJumps=0,this.program.states.has(52)&&this.changeState(52));else if(!c&&(this.physics==="S"||this.physics==="C")&&(r||![20,100].includes(this.stateNo))){const h=this.physics==="C"?"crouch":"stand",u=this.constant("movement."+h+".friction");if(this.vel.x*=r?Math.fround(u):u,r&&(this.vel.x=Math.fround(this.vel.x)),r){const p=h==="stand"?1:this.constant("movement.crouch.friction.threshold");Math.abs(this.vel.x)<p*this.coordinateScale&&(this.vel.x=0)}}return this.updateBinding(),this.syncAnimationFrame(),r||this.advanceAnimation(),this.world||this.updateExplods(),c&&(this.getHitVars.hitshaketime=Math.max(0,this.getHitVars.hitshaketime-1)),Il(this,{hitPaused:r&&(this.getHitVars.hitshaketime||0)>0}),this.time++,this.gameTime++,this._previousUp=this.movementHeld("holdup"),this.events}finishPausedAnimation(){if(!this._inPausedAnimation)return;const e=this._pausedAnimation;e.logic=aa(this),e.serial=this._animationSerial,this._inPausedAnimation=!1,Nl(this,e.visible)}syncAnimationFrame(e=this){var t;this.collisionAnimationOwner=e.animationOwner,this.collisionAnimation=(e.animationOwner||this).animations.get(e.anim),this.collisionFrame=((t=this.collisionAnimation)==null?void 0:t.frames[e.frameIndex])||null,this.collisionFrameIndex=e.frameIndex,this.collisionFrameTime=e.frameTime}advanceAnimation(){var i,s;const e=this.animation,t=this.currentFrame;if(t){if(t.ticks<0){(i=this.world)!=null&&i.orderedPhases&&(this.frameTime++,this.animationTime++,this.animationCycleTime++);return}this.animationEnded&&(this.animationEnded=!1),this.frameTime++,this.animationTime++,this.animationCycleTime++,this.frameTime>=Math.max(1,t.ticks)&&(this.frameTime=0,this.frameIndex++,this.frameIndex>=e.frames.length&&(this.frameIndex=e.loopStart??e.loopstart??0,this.animationEnded=!0,this.animationLooped=!0,this.animationCycleTime=As(e).offsets[this.frameIndex]||0,(s=this.world)!=null&&s.orderedPhases&&(this._animationLoopReset=!0)))}}execute(e){const t=bs(e).errors.find(s=>!s.message.includes("trigger1"));if(t)throw Error(t.message);const i=this._parameterCache;this._parameterCache=new WeakMap;try{return this.executeController(e)}finally{this._parameterCache=i}}executeController(e){var o,l,c,d,f,h;const t=e.type,i=(u,p=0)=>Xt(this.value(e,u,p)),s=(u,p=0)=>ot(this.value(e,u,p)),r=(u,p=[0,0])=>this.vector(e,u,p),a=(u,p="")=>this.text(e,u,p);if(!Ir.has(t)){this.diagnostic("unsupported-controller",`Controller ${t||"(missing type)"} is not implemented.`,e);return}if(t!=="null"){if(t==="mapset"||t==="mapadd"){this.setMap(a("map"),i("value"),t==="mapadd");return}if(t==="assertinput"){if(!((o=this.world)!=null&&o.manageInputs)){this.diagnostic("unsupported-input-routing","AssertInput needs the independent input scheduler.");return}for(const u of e.entries)if(/^flag\d*$/.test(u.key))for(const p of this.text(e,u.key).split(/[+|\s,]+/).filter(Boolean)){const x={up:"U",down:"D",forward:"F",fwd:"F",back:"B",start:"s"},m=x[p.toLowerCase()]||p;if(!["U","D","F","B","a","b","c","x","y","z","s"].includes(m)){this.diagnostic("unsupported-input",`Input flag ${p} is not implemented.`,e);continue}this.pendingAssertedInputs.add(m)}return}if(["displaytoclipboard","appendtoclipboard","clearclipboard"].includes(t)){if(t==="clearclipboard"){this.clipboard="";return}const u=Yu(e.values.text||""),p=e.values.params===void 0?[]:Hi(e.values.params);if(p.length!==u.count)throw Error(`Clipboard format requires ${u.count} parameters, received ${p.length}.`);const x=Zu(u,p.map(m=>this.parameter(m,e,!0)));this.clipboard=(t==="appendtoclipboard"&&this.clipboard?this.clipboard+`
`+x:x).slice(-8192);return}if(t==="victoryquote"){if(!this.parent){const u=s("value",-1);u!==this.victoryQuoteIndex&&(this.victoryQuote=null),this.victoryQuoteIndex=u}return}if(t==="forcefeedback"){this.events.push({type:t,...Ju(e.values)});return}if(t==="gamemakeanim"||t==="makedust"){if(t==="makedust"){const u=s("spacing",3);if(u<1)throw Error("MakeDust spacing must be at least 1.");const p=this._dustTicks.get(e);if((p==null?void 0:p.entry)===this._entrySerial&&this.gameTime-p.time<u)return;this._dustTicks.set(e,{entry:this._entrySerial,time:this.gameTime}),this.gameAnimation(120,r("pos"),!0,0,e),e.values.pos2!==void 0&&this.gameAnimation(120,r("pos2"),!0,0,e)}else this.gameAnimation(s("value",0),r("pos"),!!i("under"),Math.max(0,s("random")),e);return}if(t==="changestate"||t==="selfstate"){const u=s("value"),p=e.values.ctrl===void 0?void 0:s("ctrl"),x=e.values.anim===void 0?void 0:s("anim"),m=t==="selfstate"?this:this.stateOwner;m.program.states.has(u)&&x!==void 0&&x!==-1&&this.changeAnimation(x),this.changeState(u,p,m);return}if(t==="changeanim"||t==="changeanim2"){this.changeAnimation(s("value"),s("elem",1),t==="changeanim2"?this.stateOwner:this);return}if(t==="ctrlset"){this.ctrl=+Bt(i("value"));return}if(t==="statetypeset"){for(const[u,p]of[["statetype","stateType"],["movetype","moveType"],["physics","physics"]])if(e.values[u]!==void 0){const x=a(u).toUpperCase();x!=="U"&&(this[p]=x)}return}if(/^(vel|pos)(set|add|mul)$/.test(t)){const u=t.startsWith("vel")?this.vel:this.pos,p=t.slice(3);for(const x of["x","y"])if(e.values[x]!==void 0){const m=i(x)*(p==="mul"?1:this.coordinateScale);p==="set"?u[x]=m+(t==="posset"&&x==="x"&&((l=this.cameraPos)==null?void 0:l.x)||0):p==="add"?u[x]+=m*(t==="posadd"&&x==="x"?this.facing:1):u[x]*=m,(c=this.world)!=null&&c.orderedPhases&&(u[x]=Math.fround(u[x]))}return}if(t==="gravity"){this.vel.y+=this.constant("movement.yaccel")*this.coordinateScale;return}if(t==="turn"){(d=this.world)!=null&&d.orderedPhases&&this.vel.x!==0&&(this.vel.x=-this.vel.x),this.facing*=-1;return}if(t==="posfreeze"){this.posFrozen=Bt(i("value",1));return}if(t==="helper"){if(!this.world)throw Error("Helper requires a match world.");this.world.spawnHelper(this,this.entityParameters(e));return}if(t==="projectile"){if(!this.world)throw Error("Projectile requires a match world.");const u=new Set(["velocity","remvelocity","accel","velmul","offset","postype","supermovetime","pausemovetime","ownpal","remappal"]),p=e.entries.filter(m=>!m.key.startsWith("proj")&&!m.key.startsWith("afterimage.")&&!u.has(m.key)),x=this.parseHitDef({...e,entries:p,values:Object.fromEntries(p.map(m=>[m.key,m.value]))});this.world.spawnProjectile(this,{...this.entityParameters(e,!0),hitDef:x});return}if(t==="pause"||t==="superpause"){if(!this.world)throw Error(`${t} requires a match world.`);const u=this.entityParameters(e);u.coordinateScale=this.coordinateScale,u.type=t,u.time??(u.time=t==="superpause"?30:0),u.animCommon=!/^s/i.test(e.values.anim||""),u.soundCommon=!/^s/i.test(e.values.sound||""),this.world.requestPause(this,u);return}if(t==="trans"){this.trans={mode:a("trans","default").toLowerCase(),alpha:r("alpha",[256,0])};return}if(t==="movehitreset"){this.moveContact=this.moveHit=this.moveGuarded=0;return}if(t==="attackdist"){this.attackDist=i("value"),this.hitDef&&(this.hitDef["guard.dist"]=this.attackDist*this.coordinateScale/(this.hitDef.coordinateScale??this.coordinateScale));return}if(t==="remappal"){const u=T=>{const R=r(T,[-1,0]);return[ot(R[0]),ot(R[1]??0)]},p=u("source"),x=u("dest"),m=p[0]===-1?"*":p.join(",");if(p[0]===-1&&x[0]===-1){this.paletteRemaps.clear();return}if(p[0]<-1||p[0]!==-1&&p[1]<0||x[0]<-1||x[0]!==-1&&x[1]<0)throw Error("Invalid RemapPal palette pair.");const v=x[0]===-1||p.join(",")===x.join(",");v||Jc(this.character,p,x);const y=v&&this.paletteRemaps.has("*")&&p[0]!==-1;if(p[0]!==-1&&(!v||y)&&!this.paletteRemaps.has(m)&&this.paletteRemaps.size>=8){this.diagnostic("resource-limit","RemapPal supports at most 8 simultaneous mappings.",e);return}p[0]===-1&&this.paletteRemaps.clear(),y?this.paletteRemaps.set(m,p):v?this.paletteRemaps.delete(m):this.paletteRemaps.set(m,x);return}if(t==="fallenvshake"){const u=this.getHitVars["fall.envshake.time"]||0;u>0&&this.events.push({type:"envshake",time:u,coordinateScale:this.coordinateScale,...Object.fromEntries(["ampl","freq","phase"].map(p=>[p,this.getHitVars["fall.envshake."+p]]))}),this.getHitVars["fall.envshake.time"]=0;return}if(["varset","varadd","varmul","parentvarset","parentvaradd"].includes(t)){const u=t.startsWith("parent")?this.parent:this;if(!u||u.destroyed)return;let p=e.entries.filter(x=>/^(var|fvar|sysvar|sysfvar)\s*\(/.test(x.key));if(!p.length){const x=e.values.fv!==void 0?"fvar":"var";p=[{key:`${x}(${s(x==="fvar"?"fv":"v")})`,value:e.values.value??"0"}]}for(const x of p){const m=x.key.match(/^(var|fvar|sysvar|sysfvar)\s*\((.*)\)$/);if(!m)throw new Error(`Malformed variable target: ${x.key}`);const v=ot(this.parameter(m[2],e));let y=Xt(this.parameter(x.value,e));y=m[1].includes("fvar")?Math.fround(y):ot(y)|0;const T=u.resolveTrigger(m[1],[v]);t.endsWith("add")&&(y+=T),t.endsWith("mul")&&(y*=T),u.assignVariable(m[1],[v],y)}return}if(t==="varrandom"){const u=s("v"),p=r("range",[0,1e3]),[x,m]=p.length===1?[0,ot(p[0])]:p.map(ot);if(x>m)throw Error("VarRandom range requires least_val <= greatest_val.");this.resolveTrigger("random"),this.assignVariable("var",[u],x+Math.floor((this._seed>>>0)/4294967296*(m-x+1)));return}if(t==="varrangeset"){const u=e.values.fvalue!==void 0,p=u?this.fvars:this.vars,x=ni(s("first"),0,p.length-1),m=ni(s("last",p.length-1),0,p.length-1),v=i(u?"fvalue":"value");for(let y=x;y<=m;y++)this.assignVariable(u?"fvar":"var",[y],v);return}if(t==="lifeadd"||t==="lifeset"){let u=s("value");t==="lifeadd"&&(u=-zs(-u,null,this,{absolute:!!i("absolute")}),u+=this.life),this.life=ni(u,i("kill",1)?0:1,this.maxLife);return}if(t==="poweradd"||t==="powerset"){this.power=ni(s("value")+(t==="poweradd"?this.power:0),0,this.maxPower);return}if(t==="attackmulset"){this.attackMultiplier=i("value",1);return}if(t==="defencemulset"){this.defenceMultiplier=i("value",1);return}if(t==="sprpriority"){this.sprPriority=s("value");return}if(t==="screenbound"){this.screenBound=Bt(i("value",0));const[u,p]=r("movecamera");this.moveCamera={x:!!u,y:!!p};return}if(t==="playerpush"){this.playerPush=Bt(i("value",1));return}if(t==="width"){if(e.values.value!==void 0&&(e.values.player!==void 0||e.values.edge!==void 0))throw Error("Width value cannot be combined with player or edge.");const u=e.values.value===void 0?[0,0]:r("value"),[p=0,x=0]=r("player",u),m=r("edge",u);this.width={front:ot(p),back:ot(x),edge:[ot(m[0]??0),ot(m[1]??0)]};return}if(t==="assertspecial"){const u=new Set(["nowalk","nojump","nocrouch","noautoturn","invisible","noshadow","unguardable","noairguard","nostandguard","nocrouchguard","nojugglecheck","intro","roundnotover","timerfreeze","noko","nobardisplay","nobg","nofg"]);for(const p of["flag","flag2","flag3"])if(e.values[p]){const x=a(p).toLowerCase();this.asserted.add(x),u.has(x)||this.diagnostic("unsupported-flag",`AssertSpecial flag ${x} is not implemented.`,e)}return}if(t==="hitvelset"){i("x")&&(this.vel.x=(this.getHitVars.xvel||0)*this.coordinateScale),i("y")&&(this.vel.y=(this.getHitVars.yvel||0)*this.coordinateScale);return}if(t==="hitdef"){this.hitDef=null,this.reversalDef=null,this.hitDef=this.parseHitDef(e),this.events.push({type:"hitdef",hitDef:this.hitDef});return}if(t==="reversaldef"){if(this.reversalDef=null,e.values["reversal.attr"]===void 0)throw Error("ReversalDef requires reversal.attr.");if(!e.values["reversal.attr"].trim())return;ws(a("reversal.attr")),this.reversalDef=this.parseHitDef(e);return}if(t==="hitby"||t==="nothitby"){const u=["value","value2"].filter(m=>e.values[m]!==void 0);if(u.length!==1)throw Error(`${t} requires exactly one of value or value2.`);const p=s("time",1);if(p<-1||p>36e4)throw Error("Invalid hit-filter duration.");const x=ws(a(u[0]));this.hitFilters[u[0]==="value"?0:1]=p?{attribute:x,time:p,exclude:t==="nothitby"}:null;return}if(t==="hitoverride"){const u=s("slot"),p=s("time",1);if(u<0||u>7||p<-1||p>36e4)throw Error("HitOverride requires slot 0–7 and time -1 or greater.");if(!p||((f=e.values.attr)==null?void 0:f.trim())===""){this.hitOverrides.delete(u);return}if(e.values.attr===void 0||e.values.stateno===void 0)throw Error("HitOverride requires attr and stateno.");const x=a("attr"),m=ws(x);p?this.hitOverrides.set(u,{attr:x,attribute:m,stateNo:s("stateno"),time:p,forceAir:Bt(i("forceair"))}):this.hitOverrides.delete(u);return}if(Rf.has(t)){if(t==="palfx"&&this.parent&&!this.ownPal)return;let u=this.effectParameters(e);if(["palfx","allpalfx","bgpalfx"].includes(t)&&(u=xr(u)),t==="playsnd"){const[p=0,x=0]=Array.isArray(u.value)?u.value:[u.value||0,0];Object.assign(u,{group:p,number:x,common:/^\s*f/i.test(e.values.value||""),volumeScale:u.volumescale,freqMul:u.freqmul})}this.events.push({type:t,...u,coordinateScale:this.coordinateScale,source:e.source,line:e.line});return}if(["explod","modifyexplod","removeexplod","explodbindtime"].includes(t)){this.explodController(e);return}if(t.startsWith("target")){const u=s("id",-1),p=this.targets.filter(S=>u===-1||(this.targetHitIds.get(S.id)??S.hitId)===u);if(t==="targetdrop"){const S=s("excludeid",-1),M=S<0?[]:this.targets.filter(_=>(this.targetHitIds.get(_.id)??_.hitId)===S);this.targets=i("keepone",1)?M.slice(0,1):M;const g=new Set(this.targets.map(_=>_.id));for(const _ of this.targetHitIds.keys())g.has(_)||this.targetHitIds.delete(_);return}const x=["targetfacing","targetlifeadd","targetpoweradd","targetstate"].includes(t)?s("value"):void 0,m=t==="targetlifeadd"?i("kill",1):1,v=t==="targetlifeadd"?i("absolute"):0,y=t==="targetstate"&&e.values.ctrl!==void 0?i("ctrl"):void 0,T=t==="targetbind"?{pos:r("pos"),time:s("time",1)}:null,R=t==="targetvelset"||t==="targetveladd"?Object.fromEntries(["x","y"].filter(S=>e.values[S]!==void 0).map(S=>[S,i(S)*this.coordinateScale])):null;for(const S of p)if(t==="targetfacing")x&&(S.facing=this.facing*(x<0?-1:1));else if(t==="targetlifeadd"){const M=-zs(-x,this,S,{absolute:!!v});S.life=ni(S.life+M,m?0:1,S.maxLife)}else if(t==="targetpoweradd")S.power=ni(S.power+x,0,S.maxPower);else if(t==="targetstate")S.changeState(x,y,this._scriptOwner||this.stateOwner);else if(T){const[M=0,g=0]=T.pos;S.bound={target:this,x:M*this.coordinateScale,y:g*this.coordinateScale,time:T.time}}else for(const[M,g]of Object.entries(R||{}))S.vel[M]=g+(t==="targetveladd"?S.vel[M]:0);return}if(["bindtoroot","bindtoparent","bindtotarget"].includes(t)){if(t!=="bindtotarget"&&!this.parent)return;const u=s("id",-1),p=t==="bindtoroot"?this.root:t==="bindtoparent"?this.parent:this.targets.find(y=>u<0||(this.targetHitIds.get(y.id)??y.hitId)===u);if(!p||p.destroyed){if(t==="bindtoparent"&&this.parent){this.bound=null;return}throw new Error(`${t} has no matching player`)}let x=[0,0],m,v;if(t==="bindtotarget"){const y=Hi(e.values.pos||"0,0"),T=yn(y[2]||"foot").toLowerCase();if(y.length>3||!["foot","head","mid"].includes(T))throw Error("BindToTarget pos requires x, y, and Foot, Head or Mid.");[m,v]=y.slice(0,2).map(R=>Xt(this.evaluate(R,e))),m??(m=0),v??(v=0),T!=="foot"&&(x=["x","y"].map(R=>p.constant(`size.${T}.pos.${R}`)*p.coordinateScale))}else[m=0,v=0]=r("pos");this.bound={target:p,x:m*this.coordinateScale+x[0],y:v*this.coordinateScale+x[1],time:s("time",1),facing:i("facing")};return}if(t==="hitadd"){const u=s("value");this.hitCount=Math.max(0,this.hitCount+u),this.uniqHitCount=Math.max(0,this.uniqHitCount+u);const p=this.targets.at(-1)||(((h=this.opponent)==null?void 0:h.moveType)==="H"?this.opponent:null);p&&(p.comboHits=Math.max(0,(p.comboHits||0)+u));return}if(t==="hitcount"){this.hitCount=s("value");return}if(t==="hitfallset"){if(e.values.value!==void 0){const u=s("value",-1);u!==-1&&(u&&!this.getHitVars.fall&&(this.getHitVars["fall.time"]=0),this.getHitVars.fall=+!!u)}e.values.xvel!==void 0&&(this.getHitVars["fall.xvel"]=i("xvel"),this._fallXVelocityDefined=!0),e.values.yvel!==void 0&&(this.getHitVars["fall.yvel"]=i("yvel"));return}if(t==="hitfallvel"){if(this.moveType!=="H")return;this._fallXVelocityDefined&&(this.vel.x=(this.getHitVars["fall.xvel"]||0)*this.coordinateScale),this.vel.y=(this.getHitVars["fall.yvel"]||0)*this.coordinateScale;return}if(t==="hitfalldamage"){if(this.moveType==="H"){const u=zs(this.getHitVars["fall.damage"]||0,null,this);this.life=ni(this.life-u,this.life>0&&this.getHitVars["fall.kill"]===0?1:0,this.maxLife),this.getHitVars["fall.damage"]=0}return}if(t==="angleadd"){this.angle+=i("value");return}if(t==="angleset"){this.angle=i("value");return}if(t==="anglemul"){this.angle*=i("value",1);return}if(t==="angledraw"){this.angleDraw=!0;const[u=1,p=1]=r("scale",[1,1]);this.drawScale={x:u,y:p},e.values.value&&(this.angle=i("value"));return}if(t==="offset"){this.drawOffset={x:i("x")*this.coordinateScale,y:i("y")*this.coordinateScale};return}if(t==="destroyself"){if(!this.parent){this.diagnostic("unsupported-controller","DestroySelf is valid only for helpers.",e);return}const u=!!i("recursive"),p=!!i("removeexplods");this.world?this.world.destroyHelper(this,{recursive:u,removeExplods:p}):(this.destroyed=!0,p&&(this.explods=this.drawExplods=[]));return}this.diagnostic("unsupported-controller",`Controller ${t} is not implemented.`,e)}}selectVictoryQuote(){if(this.parent||this.victoryQuote!==null)return this.victoryQuote;const e=this.program.quotes;if(!(e!=null&&e.size))return null;const t=[...e.keys()],i=e.has(this.victoryQuoteIndex)?this.victoryQuoteIndex:t[Math.floor(this.resolveTrigger("random")/1e3*t.length)];return this.victoryQuote=e.get(i)}gameAnimation(e,t,i,s,r){if(e<0)return;if(!this.commonAnimations.has(e)){this.diagnostic("missing-animation",`Common effect animation ${e} is unavailable. Import its fightfx resources.`,r);return}const a=()=>s?(this.resolveTrigger("random")/999-.5)*s:0;this.events.push({type:"gameanim",anim:e,under:i,common:!0,facing:this.facing,pos:{x:this.pos.x+((t[0]||0)*this.facing+a())*this.coordinateScale,y:this.pos.y+((t[1]||0)+a())*this.coordinateScale}})}effectParameters(e){const t={},i=new Set(["waveform","postype","trans","helpertype","name","space"]);for(const s of e.entries){if(/^(type|triggerall|trigger\d+|persistent|ignorehitpause)$/.test(s.key))continue;if(i.has(s.key)&&!/^-?[\d.]+$/.test(s.value)){t[s.key]=yn(s.value);continue}const a=Hi(s.value).map(o=>{const l=o.trim().replace(/^[sSfF](?=[\d(-])/,"");return this.parameter(l,e)});t[s.key]=a.length===1?a[0]:a}return t}entityParameters(e,t=!1){const i=new Set(["velocity","remvelocity","accel","velmul","offset","postype","supermovetime","pausemovetime","ownpal","remappal"]),s=t?e.entries.filter(r=>r.key.startsWith("proj")||r.key.startsWith("afterimage.")||i.has(r.key)):e.entries;if(t){const r=new Set(["projid","projanim","projhitanim","projremanim","projcancelanim","projscale","projremove","projremovetime","projhits","projmisstime","projpriority","projsprpriority","projedgebound","projstagebound","projheightbound","projshadow"]);for(const a of s)a.key.startsWith("proj")&&!r.has(a.key)&&this.diagnostic("unsupported-projectile",`Projectile parameter ${a.key} is not implemented.`,{...e,line:a.line})}return{...this.effectParameters({...e,entries:s}),source:e.source,line:e.line}}createHelper(e,{id:t}={}){e.helpertype&&e.helpertype!=="normal"&&this.diagnostic("unsupported-helper","Player-type helpers are deprecated by MUGEN 1.1; using a normal helper.");const{pos:i,facing:s}=ih(this,e),r={...this.program,constants:new Map(this.program.constants)};for(const[l,c]of Object.entries(e))if(l.startsWith("size.")){const d=Cl(l)?this.coordinateScale/this.baseCoordinateScale:1,f=Array.isArray(c)?c.map(h=>h*d):c*d;r.constants.set(l,f),Array.isArray(f)&&(r.constants.set(l+".x",f[0]),r.constants.set(l+".y",f[1]))}const a=new Dr(this.character,{program:r,expressionEvaluator:this.options.expressionEvaluator,commonAnimations:this.commonAnimations,world:this.world,id:t,position:i,facing:s,parent:this,root:this.root,helperId:Math.trunc(e.id||0),keyCtrl:!!e.keyctrl,ownPal:!!e.ownpal,teamSide:this.teamSide,pauseMoveTime:e.pausemovetime||0,superMoveTime:e.supermovetime||0});a.name=e.name||`${this.name}'s helper`,a.opponent=this.opponent,e.ownpal&&(a._paletteRemaps=Xo(this.paletteRemaps)),e.ownpal&&this.events.push({type:"palettesnapshot",target:a});const o=new Set(["id","name","stateno","postype","pos","facing","helpertype","keyctrl","ownpal","pausemovetime","supermovetime","remappal","source","line"]);for(const l of Object.keys(e))!o.has(l)&&!l.startsWith("size.")&&a.diagnostic("unsupported-helper",`Helper parameter ${l} is not implemented.`);if(e.ownpal&&e.remappal!==void 0)try{$o(a.paletteRemaps,a.character,e.remappal)}catch(l){a.diagnostic("palette",l.message)}return a.changeState(e.stateno??0)?(this.helpers.push(a),a):(a.destroyed=!0,a)}parseHitDef(e){var l,c;const t=e.values,i={serial:++this._hitSerial,coordinateScale:this.coordinateScale,stateOwner:this._scriptOwner||this.stateOwner},s=new Set(["attr","reversal.attr","hitflag","guardflag","animtype","air.animtype","fall.animtype","ground.type","air.type","affectteam","priority"]);for(const d of e.entries)if(!/^(type|triggerall|trigger\d+|persistent|ignorehitpause)$/.test(d.key)){if(d.key==="priority"){const[f,h="Hit"]=Hi(d.value);i.priority=[ot(this.parameter(f,e)),yn(h)];continue}if(s.has(d.key)){i[d.key]=yn(d.value);continue}try{const f=Hi(d.value).map(h=>this.parameter(h.trim().replace(/^[sSfF](?=[\d(-])/,""),e));i[d.key]=f.length===1?f[0]:f}catch{throw new Error(`HitDef parameter ${d.key} could not be evaluated; attack disabled.`)}}const r=(d,f)=>Array.isArray(i[d])?i[d]:i[d]===void 0?[...f]:[i[d],f[1]??0];i.attr=i.attr??`${this.stateType}, NA`,i.id=ot(i.id??0),i.chainid=ot(i.chainid??-1);const a=i.nochainid===void 0?[-1,-1]:Array.isArray(i.nochainid)?i.nochainid:[i.nochainid,-1];if(a.length>2)throw Error("HitDef nochainID takes at most two IDs.");i.nochainid=a.map(ot),i.hitonce=i.hitonce===void 0?+/^[SCA]\s*,\s*[NSH]T$/i.test(i.attr):+Bt(Xt(i.hitonce)),i.damage=r("damage",[0,0]),i.pauseTime=r("pausetime",[0,0]),i.guardPauseTime=r("guard.pausetime",i.pauseTime),i.groundVelocity=r("ground.velocity",[0,0]),i.airVelocity=r("air.velocity",[0,0]),i.guardVelocity=r("guard.velocity",[i.groundVelocity[0],0]),i.airGuardVelocity=r("airguard.velocity",[i.airVelocity[0]*1.5,i.airVelocity[1]/2]),i.guardVelocity[1]=0,i["air.type"]??(i["air.type"]=i["ground.type"]??"high"),i.forcestand??(i.forcestand=+(i.groundVelocity[1]!==0)),i["down.velocity"]??(i["down.velocity"]=[...i.airVelocity]),i["down.hittime"]??(i["down.hittime"]=20),i["down.bounce"]??(i["down.bounce"]=0),i["ground.cornerpush.veloff"]??(i["ground.cornerpush.veloff"]=/^A\s*,/i.test(i.attr)?0:1.3*i.guardVelocity[0]);for(const d of["air","down","guard"])i[l=d+".cornerpush.veloff"]??(i[l]=i["ground.cornerpush.veloff"]);i["airguard.cornerpush.veloff"]??(i["airguard.cornerpush.veloff"]=i["guard.cornerpush.veloff"]),i.groundHitTime=i["ground.hittime"]??0,i.airHitTime=i["air.hittime"]??20,i.guardHitTime=i["guard.hittime"]??((c=this.world)!=null&&c.orderedPhases?i["ground.slidetime"]??0:i.groundHitTime),i["ground.slidetime"]??(i["ground.slidetime"]=0),i["guard.slidetime"]??(i["guard.slidetime"]=i.guardHitTime),i["guard.ctrltime"]??(i["guard.ctrltime"]=i["guard.slidetime"]),i["airguard.ctrltime"]??(i["airguard.ctrltime"]=i["guard.ctrltime"]),i.hitFlag=String(i.hitflag??"MAF").toUpperCase(),i.guardFlag=String(i.guardflag??"").toUpperCase(),i.fall=i.fall??0,i.kill=i.kill??1,i["guard.kill"]=i["guard.kill"]??1,i.source=e.source,i.line=e.line,i.juggleCost=this.juggleCost,i.juggleGroup=`${this.id}:${this._juggleSerial}`,i.sparkCommon=!/^s/i.test(t.sparkno||""),i.guardSparkCommon=!/^s/i.test(t["guard.sparkno"]||""),i.hitSoundCommon=!/^s/i.test(t.hitsound||""),i.guardSoundCommon=!/^s/i.test(t.guardsound||""),i.sparkno??(i.sparkno=this.constant("data.sparkno")),i["guard.sparkno"]??(i["guard.sparkno"]=this.constant("data.guard.sparkno"));const o=new Set(["attr","damage","pausetime","guard.pausetime","ground.velocity","air.velocity","guard.velocity","airguard.velocity","ground.hittime","air.hittime","guard.hittime","ground.slidetime","guard.slidetime","ground.ctrltime","guard.ctrltime","guardflag","hitflag","fall","forcenofall","kill","guard.kill","fall.kill","fall.damage","fall.xvelocity","fall.yvelocity","fall.recover","fall.recovertime","yaccel","animtype","air.animtype","ground.type","air.type","chainid","id","p1stateno","p2stateno","p2getp1state","p1facing","p1getp2facing","p2facing","p1sprpriority","p2sprpriority","numhits","getpower","givepower","priority","affectteam","guard.dist","down.velocity","down.hittime","air.fall","forcestand","air.juggle","fall.envshake.time","fall.envshake.ampl","fall.envshake.freq","fall.envshake.phase","sparkno","guard.sparkno","sparkxy","hitsound","guardsound","envshake.time","envshake.freq","envshake.ampl","envshake.phase","palfx.time","palfx.add","palfx.mul","palfx.sinadd","palfx.color","palfx.invertall"]);for(const d of["fall.animtype","mindist","maxdist","snap","ground.cornerpush.veloff","air.cornerpush.veloff","down.cornerpush.veloff","guard.cornerpush.veloff","airguard.cornerpush.veloff","airguard.ctrltime"])o.add(d);o.add("hitonce"),o.add("nochainid"),o.add("down.bounce");for(const d of e.entries)/^(type|triggerall|trigger\d+|persistent|ignorehitpause)$/.test(d.key)||o.has(d.key)||d.key==="reversal.attr"||this.diagnostic("unsupported-hitdef-parameter",`HitDef parameter ${d.key} is parsed but its engine behavior is not implemented.`,{...e,line:d.line});return i}receiveHit(e,t,{guarded:i=!1}={}){var ne,V,ie,ve;if(!this.canBeHit(e,t))return{damage:0,guarded:!1,rejected:!0};const s=!i&&String(e[this.stateType==="A"?"air.type":"ground.type"]??e["ground.type"]??"high").toLowerCase()==="none",r=i?null:this.matchingHitOverride(e),a=e.p2getp1state===0?this:e.stateOwner||t;if(!s&&!i&&!r&&e.p2stateno>=0&&!(a!=null&&a.program.states.has(e.p2stateno)))return this.diagnostic("missing-state",`HitDef target state ${e.p2stateno} does not exist; hit rejected.`),{damage:0,guarded:!1,rejected:!0};uf(this,e,t);const o=i?e.guardPauseTime:e.pauseTime,l=this.stateType,c=(t==null?void 0:t.facing)??-this.facing,d=this.facing;if(s)return Pl(t,e,!1,{count:!1}),{damage:0,guarded:!1,typeNone:!0,cornerPush:0};this.explods=this.explods.filter(_e=>!_e.removeongethit),this.drawExplods=this.drawExplods.filter(_e=>!_e.removeongethit);const f=this.stateType==="A"||!!(r!=null&&r.forceAir),h=this.stateType==="L"&&!(r!=null&&r.forceAir),u=f&&!!this.getHitVars.fall,p=this.getHitVars,x=this.moveType==="H"&&!p.guarded,m=e[(i?f?"airguard":"guard":h?"down":f?"air":"ground")+".cornerpush.veloff"]||0;!i&&e.forcestand&&this.stateType==="C"&&(this.stateType="S");const v=Xt(((ne=e.damage)==null?void 0:ne[i?1:0])||0),y=Math.max(0,zs(v,t,this)),T=(V=this.world)==null?void 0:V.orderedPhases,R=(i?e["guard.kill"]:e.kill)===0?1:0,S=ni((this._projectedLife??this.life)-y,R,this.maxLife);T?this._projectedLife=S:this.life=S;const M={},g=t&&e.p2facing?(T?-1:1)*c*(e.p2facing<0?-1:1):this.facing;t&&e.p2facing&&(T?M.facing=g:this.facing=g),t&&e.p1getp2facing?t.facing=g*(e.p1getp2facing<0?-1:1):t&&e.p1facing===-1&&(t.facing*=-1);const _=i?f?e.airGuardVelocity:e.guardVelocity:h&&e["down.velocity"]!==void 0?Array.isArray(e["down.velocity"])?e["down.velocity"]:[e["down.velocity"],0]:f?e.airVelocity:e.groundVelocity,L=e.coordinateScale??(t==null?void 0:t.coordinateScale)??this.coordinateScale,E=L/this.coordinateScale;let A=((_==null?void 0:_[0])||0)*E*-c*g,U=((_==null?void 0:_[1])||0)*E;const N=S<=0,P=N?vf(A,U,l,this.coordinateScale):{x:A,y:U};A=P.x,U=P.y;const B=i?e.guardHitTime:h&&U===0?e["down.hittime"]??20:f||U!==0||T&&e.fall?e.airHitTime??20:e.groundHitTime??0,F={light:0,medium:1,med:1,hard:2,back:3,up:4,diagup:5},k={high:1,low:2,trip:3,none:0};let I=k[String(e["ground.type"]||"high").toLowerCase()]??1;t&&(t.pos.x-this.pos.x)*d<0&&(I===1||I===2)&&(I=3-I);const C=e["air.animtype"]||e.animtype||"light",G=e["fall.animtype"]||(String(C).toLowerCase()==="up"?"up":"back"),W=N?1:i?0:+((!e.forcenofall||e.fall)&&!!p.fall||Bt(Xt(f?e["air.fall"]??e.fall??0:e.fall||0)));if(this.getHitVars={animtype:F[String((T?W&&!i:u)?G:f?C:e.animtype||"light").toLowerCase()]??0,groundtype:I,airtype:k[String(e["air.type"]||"high").toLowerCase()]??1,type:f?k[String(e["air.type"]||e["ground.type"]||"high").toLowerCase()]??1:I,damage:y,hitcount:i?0:(x&&p.hitcount||0)+1,fallcount:x&&p.fallcount||0,hitshaketime:(o==null?void 0:o[1])||0,hittime:B,slidetime:e[i?"guard.slidetime":"ground.slidetime"]??(i?B:0),ctrltime:(i&&f?e["airguard.ctrltime"]:void 0)??e[i?"guard.ctrltime":"ground.ctrltime"]??B,xvel:A,yvel:U,yaccel:e.yaccel===void 0?.35/this.coordinateScale:e.yaccel*E,xoff:0,yoff:0,guarded:+i,fall:W,hitid:e.id??0,chainid:Math.max(0,e.id??0),isbound:0,xveladd:0,yveladd:0,zoff:0,recovertime:h?Math.min(p.recovertime??this.constant("data.liedown.time"),this.constant("data.liedown.time")):this.constant("data.liedown.time"),"fall.time":T&&i&&p["fall.time"]||0,"fall.damage":e["fall.damage"]||0,"fall.xvel":e["fall.xvelocity"]===void 0?A:e["fall.xvelocity"]*E*-c*g,"fall.yvel":h&&!e["down.bounce"]&&U!==0?0:e["fall.yvelocity"]===void 0?-4.5/this.coordinateScale:e["fall.yvelocity"]*E,"fall.recover":N||T&&i?0:e["fall.recover"]??1,"fall.recovertime":e["fall.recovertime"]??4,"fall.kill":e["fall.kill"]??1,"fall.envshake.time":e["fall.envshake.time"]||0,"fall.envshake.freq":e["fall.envshake.freq"]??60,"fall.envshake.ampl":e["fall.envshake.ampl"]===void 0?-4/this.coordinateScale:e["fall.envshake.ampl"]*E,"fall.envshake.phase":e["fall.envshake.phase"]??0},this.comboHits=i?0:(x&&this.comboHits||0)+Math.max(0,Math.trunc(e.numhits??1)),this._fallXVelocityDefined=e["fall.xvelocity"]!==void 0,this.hitTime=Math.max(0,B||0)+(T&&!i&&B>0?1:0),this.hitPauseTime=T?0:Math.max(0,(o==null?void 0:o[1])||0),this.ctrl=0,this.moveType="H",this.hitId=e.id??0,this.hitSourceId=$a(t),T||(this.vel={x:0,y:0}),this.cornerPush=0,this.cornerPushTarget=null,t&&(!i||T)){const _e=L;for(const[ae,Le]of[["x",0],["y",1]]){const rt=ae==="x"?t.facing:1;let Re=(this.pos[ae]-t.pos[ae])*rt/_e;const Ge=i?ae==="x"?["mindist","maxdist"]:[]:["mindist","maxdist","snap"];for(const ge of Ge)if(e[ge]!==void 0){const Ae=Array.isArray(e[ge])?e[ge][Le]:Le===0?e[ge]:void 0;if(Ae===void 0)continue;Re=ge==="mindist"?Math.max(Re,Ae):ge==="maxdist"?Math.min(Re,Ae):Ae}const se=t.pos[ae]+Re*rt*_e;T?Ge.some(ge=>e[ge]!==void 0)&&(M[ae]=Math.fround(se)):this.pos[ae]=se}}T&&Object.keys(M).length&&(this._pendingHitTransform=M);const ee=r?r.stateNo:!i&&e.p2stateno>=0?e.p2stateno:i&&!N?f?154:this.stateType==="C"?152:150:h?5080:!f&&this.getHitVars.groundtype===3?5070:f?5020:this.stateType==="C"?5010:5e3;if(r!=null&&r.forceAir&&(this.stateType="A"),this.changeState(ee,void 0,!i&&!r&&e.p2stateno>=0?a:this)||(this.moveType="H",this.vel={x:A*this.coordinateScale,y:U*this.coordinateScale},this.diagnostic("missing-hit-state",`Hit state ${ee} is missing; full hit reaction cannot execute.`)),this.moveType="H",t){Pl(t,e,i),t.hitPauseTime=Math.max(t.hitPauseTime,(o==null?void 0:o[0])||0),t.targets.includes(this)||t.targets.push(this),(ie=t.targetHitIds)==null||ie.set(this.id,e.id??0);const{get:_e,give:ae}=gf(e,(ve=this.world)==null?void 0:ve.combatRules);T?this.world.pendingCombatEffects.push({defender:this,attacker:t,damage:y,minimum:R,get:_e[i?1:0]||0,give:ae[i?1:0]||0}):(t.power=ni(t.power+(_e[i?1:0]||0),0,t.maxPower),this.power=ni(this.power+(ae[i?1:0]||0),0,this.maxPower))}return t&&(t.sprPriority=e.p1sprpriority??1,this.sprPriority=e.p2sprpriority??0,!i&&e.p1stateno>=0&&t.changeState(e.p1stateno,void 0,e.stateOwner||t.stateOwner)),this.events.push({type:"hit",damage:y,guarded:i,attacker:t==null?void 0:t.id}),{damage:y,guarded:i,cornerPush:m}}attributeMatches(e,t){return ra(e,t)}matchingHitOverride(e){for(let t=0;t<8;t++){const i=this.hitOverrides.get(t);if(i!=null&&i.time&&ra(i.attribute||i.attr,e.attr))return i}return null}canBeHit(e,t){var s;if(!hf(this,e,t)||(s=this.world)!=null&&s.isSuperUnhittable(this))return!1;for(const r of this.hitFilters)if(r!=null&&r.time&&!af(r,e.attr))return!1;return!(String(e[this.stateType==="A"?"air.type":"ground.type"]??e["ground.type"]??"high").toLowerCase()==="none")&&this.matchingHitOverride(e)&&(e.p1stateno>=0||e.p2getp1state===1||e.p2stateno>=0&&e.p2getp1state!==0)?!1:!this.asserted.has("unhittable")}explodController(e){return tf(this,e)}updateExplods(e={}){return sf(this,e)}updateBinding(){var t;const e=this.bound;if(e){if(e.target.destroyed){this.bound=null;return}this.pos.x=e.target.pos.x+e.x*e.target.facing,this.pos.y=e.target.pos.y+e.y,(t=this.world)!=null&&t.orderedPhases&&(this.pos.x=Math.fround(this.pos.x),this.pos.y=Math.fround(this.pos.y)),e.facing&&(this.facing=e.target.facing*(e.facing<0?-1:1)),e.time>0&&--e.time===0&&(this.bound=null)}}}const Ln=(n,e=[0,0])=>Array.isArray(n)?[Number(n[0]??e[0]),Number(n[1]??e[1])]:n===void 0?[...e]:[Number(n),e[1]];class cs{constructor(e,t,{id:i}={}){var o;this.creator=e,this.owner=e.root||e,this.root=this.owner,this.isProjectile=!0,this.world=e.world,this.id=i,this.projId=Math.max(0,Math.trunc(t.projid??0)),this.teamSide=e.teamSide,this.character=e.character,this.coordinateScale=e.coordinateScale,this.baseCoordinateScale=this.coordinateScale,this.paletteParent=vr(e),this.guardDistance=e.constant("size.proj.attack.dist")*e.coordinateScale,this.animations=e.animations,this.program={...e.program,constants:new Map(e.program.constants)},this.spec=t,this.events=[],this.diagnostics=[],this.asserted=new Set,Number(t.projid)<0&&this.diagnostic("projectile-id","Negative ProjID was clamped to 0."),Object.assign(this,ih(e,t,!0));const s=Ln(t.projscale,[1,1]),r=e.constant("size.proj.doscale")!==0;this.program.constants.set("size.xscale",s[0]*(r?e.constant("size.xscale"):1)),this.program.constants.set("size.yscale",s[1]*(r?e.constant("size.yscale"):1)),this.program.constants.set("size.draw.offset.x",0),this.program.constants.set("size.draw.offset.y",0);const a=Ln(t.velocity);if(this.vel={x:a[0]*this.coordinateScale,y:a[1]*this.coordinateScale},this.accel=Ln(t.accel).map(l=>l*this.coordinateScale),this.velmul=Ln(t.velmul,[1,1]),this.anim=Math.trunc(t.projanim??0),this.frameIndex=0,this.frameTime=0,this.collisionFrame=null,this.hitDef=t.hitDef,this.proximityHitDef=t.hitDef,this.hitPauseTime=0,this.hitCount=0,this.moveType="A",this.stateType=(((o=this.hitDef)==null?void 0:o.attr)||"S")[0].toUpperCase(),this.priority=Math.max(1,Math.trunc(t.projpriority??1)),this.sprPriority=t.projsprpriority??3,this.remainingHits=Math.max(0,Math.trunc(t.projhits??1)),this.missTime=Math.max(0,Math.trunc(t.projmisstime??0)),this.pauseMoveTime=Math.max(0,t.pausemovetime||0),this.superMoveTime=Math.max(0,t.supermovetime||0),this.ownPal=!!t.ownpal,this.time=0,this.removing=!1,this.removed=!1,this.activeTicks=0,this.nextHitAge=0,this.drawVisible=!0,this._inTick=!1,this._paletteRemaps=Xo(e.paletteRemaps),this.ownPal&&t.remappal!==void 0)try{$o(this._paletteRemaps,this.character,t.remappal)}catch(l){this.diagnostic("palette",l.message)}this.attackMultiplier=e.attackMultiplier,this.animations.has(this.anim)||(this.diagnostic("missing-animation",`Projectile animation ${this.anim} does not exist.`),this.removed=!0)}get currentFrame(){var e;return((e=this.animations.get(this.anim))==null?void 0:e.frames[this.frameIndex])||null}get life(){return this.removed||this.removing?0:1}get power(){return this.owner.power}set power(e){this.owner.power=e}get maxPower(){return this.owner.maxPower}get targets(){return this.owner.targets}get targetHitIds(){return this.owner.targetHitIds}get paletteRemaps(){return this.ownPal?this._paletteRemaps:this.paletteParent.paletteRemaps}constant(e){const t=this.program.constants.get(e);return Array.isArray(t)?t[0]:t}changeState(){return this.diagnostic("unsupported-projectile","A projectile cannot enter a player state."),!1}diagnostic(e,t){this.diagnostics.some(i=>i.message===t)||this.diagnostics.push({type:e,message:t,source:this.spec.source,line:this.spec.line})}record(e){var i;const t=this.owner.projectileHistory;t.push({type:e,projId:this.projId,tick:((i=this.world)==null?void 0:i.ticks)??this.time});for(let s=t.length-2;s>=0;s--)t[s].type===e&&t[s].projId===this.projId&&t.splice(s,1);t.length>4096&&(t.shift(),this.diagnostic("resource-limit","Projectile history exceeded 4096 distinct ID/event pairs."))}canHit(){return!this.removed&&!this.removing&&!!this.hitDef&&this.activeTicks>=this.nextHitAge&&this.remainingHits>0}onContact({guarded:e=!1,defer:t=!1}={}){this.record(e?"guarded":"hit"),this._contactPending=!0,this.hitPauseTime>0&&(this._holdCollisionFrame=!0),t||this.finishContacts()}finishContacts(){var e;this._contactPending&&(this._contactPending=!1,this.remainingHits--,this.nextHitAge=this.activeTicks+((e=this.world)!=null&&e.orderedPhases?Math.max(1,this.missTime):this.missTime+1),this.spec.projremove!==0&&this.remainingHits<=0&&this.remove("hit"))}cancel(){!this.removing&&!this.removed&&(this.record("cancel"),this.hitPauseTime=0,this.remove("cancel"))}clash(e){var t,i;this.priority>e.priority?this.priority--:this.remainingHits--,this.remainingHits<=0?this.cancel():this.hitPauseTime=Math.max(this.hitPauseTime,((i=(t=this.hitDef)==null?void 0:t.pauseTime)==null?void 0:i[0])||0)}remove(e="expire"){if(!(this.removing||this.removed)){if(this.removing=!0,this.hitDef=null,this.removalReason=e,this._removeAtLoopEnd=this._loopedThisTick,this.hitPauseTime>0){this._holdCollisionFrame=!0;return}this.beginRemoval()}}beginRemoval(){var l;this.removalStarted=!0;const e=this.removalReason,t=this.spec.projhitanim??-1,i=this.spec.projremanim??t,s=e==="hit"?t:e==="cancel"?this.spec.projcancelanim??i:i,r=Ln(this.spec.remvelocity);if(this.vel={x:r[0]*this.coordinateScale,y:r[1]*this.coordinateScale},s<0){this.removed=!0,this.drawVisible=!1;return}let a=!1;if(this.animations.has(s)?Math.trunc(s)!==this.anim&&(a=!0,this._loopedThisTick=!1,this.anim=Math.trunc(s),this.frameIndex=this.frameTime=0):this.diagnostic("missing-animation",`Projectile removal animation ${s} does not exist; retaining action ${this.anim}.`),(a||!this.collisionFrame)&&(this.collisionFrame=this.currentFrame,this.collisionAnimation=this.animations.get(this.anim),this.collisionFrameIndex=this.frameIndex,this.collisionFrameTime=this.frameTime),!a&&this._removeAtLoopEnd&&this._inTick){this.removed=!0,this.drawVisible=!1;return}const o=((l=this.animations.get(this.anim))==null?void 0:l.frames)||[];if(o.some(c=>c.ticks<0)||o.reduce((c,d)=>c+d.ticks,0)<=0){this.removed=!0,this.drawVisible=!1;return}this.drawVisible=!!this.collisionFrame,a&&!this._inTick?this.advanceFrame():!a&&!this._inTick&&this._loopedThisTick&&(this.removed=!0)}advanceFrame(){const e=this.currentFrame,t=this.animations.get(this.anim);e&&e.ticks>=0&&++this.frameTime>=Math.max(1,e.ticks)&&(this.frameTime=0,this.frameIndex++,this.frameIndex>=t.frames.length&&(this._loopedThisTick=!0,this.animationLooped=!0,this.removing&&(this.removed=!0),this.frameIndex=t.loopStart||0))}tick({paused:e=!1}={}){var t,i,s,r;if(this.events=[],this._activeThisTick=!1,this.removed){this.drawVisible=!1;return}if(!e){if(this.drawVisible=!0,this._holdCollisionFrame||this.captureFrame(),this.hitPauseTime>0){this.hitPauseTime--;return}if(this._holdCollisionFrame=!1,this._inTick=!0,this._loopedThisTick=!1,this.removing&&!this.removalStarted&&this.beginRemoval(),!this.removing){const a=Ln(this.spec.projheightbound,[-240/this.coordinateScale,1/this.coordinateScale]).map(x=>x*this.coordinateScale),o=(this.spec.projedgebound??40/this.coordinateScale)*this.coordinateScale,l=(this.spec.projstagebound??40/this.coordinateScale)*this.coordinateScale,c=((t=this.world)==null?void 0:t.leftBound)??-160,d=((i=this.world)==null?void 0:i.rightBound)??160,f=((s=this.world)==null?void 0:s.view.left)??c,h=((r=this.world)==null?void 0:r.view.right)??d,u=this.spec.projremovetime??-1,p=this.vel.x*this.facing;(u>=0&&this.time>=u||u<=-2&&this.animationLooped||this.pos.x<f-o||this.pos.x>h+o||p<0&&this.pos.x<c-l||p>0&&this.pos.x>d+l||this.vel.y<0&&this.pos.y<a[0]||this.vel.y>0&&this.pos.y>a[1])&&this.remove()}this.removed||(this.captureFrame(),this._activeThisTick=!0,this.activeTicks++,this.pos.x+=this.vel.x*this.facing,this.pos.y+=this.vel.y,this.removing||(this.vel.x=(this.vel.x+this.accel[0])*this.velmul[0],this.vel.y=(this.vel.y+this.accel[1])*this.velmul[1]),this.advanceFrame(),this.time++),this._inTick=!1}}finishMovementAllowance({paused:e=!1}={}){var t,i,s;if(!(e||!this._activeThisTick||this._hitPausedThisTick||this.hitPauseTime>0)){if((t=this.world)!=null&&t.orderedPhases){((i=this.world.pause)==null?void 0:i.remaining)>0&&(this.pauseMoveTime=Math.max(0,this.pauseMoveTime-1)),((s=this.world.superPause)==null?void 0:s.remaining)>0&&(this.superMoveTime=Math.max(0,this.superMoveTime-1));return}this.pauseMoveTime=Math.max(0,this.pauseMoveTime-1),this.superMoveTime=Math.max(0,this.superMoveTime-1)}}captureFrame(){this.collisionFrame=this.currentFrame,this.collisionAnimation=this.animations.get(this.anim),this.collisionFrameIndex=this.frameIndex,this.collisionFrameTime=this.frameTime}}const vi=(n,e,t)=>Math.max(e,Math.min(t,n)),Zn=(n,e=0)=>n===void 0||n===""?e:Number(n),pt=(n,e=[0,0])=>n===void 0?[...e]:String(n).split(",").map((t,i)=>Zn(t.trim(),e[i]??0)),Sr=n=>String(n??"").replace(/^"(.*)"$/,"$1"),Pf=new Set(["normal","anim","parallax","dummy"]),Lf=new Set(["null","anim","visible","enable","posset","posadd","velset","veladd","sinx","siny"]);function If(n){var t,i;const e=[];for(const s of Object.keys(n).filter(r=>r.endsWith(".def"))){const r=An(n[s]),a=$r(r);if(a.bgdef)try{e.push(Df(s,n,r,a))}catch(o){e.push({path:s,name:((t=a.info)==null?void 0:t.displayname)||((i=a.info)==null?void 0:i.name)||s,files:n,invalid:!0,diagnostics:[{source:s,line:0,type:"stage",message:o.message}]})}}return e}function Df(n,e,t=An(e[n]),i=$r(t)){var _,L,E,A,U;const s=[],r=(N,P,B="stage")=>s.push({source:n,line:(P==null?void 0:P.line)||0,type:B,message:N}),a=n.slice(0,n.lastIndexOf("/")+1),o=n.indexOf("/stages/"),l=o>=0?n.slice(0,o+1):"",c=N=>{const P=[...new Set([a,l,""])],B=String(N).replaceAll("\\","/").split("/").at(-1),k=P.map(I=>{try{return es(N,I,!0)}catch{return null}}).find(I=>I&&e[I]);if(k)return k;if(B&&B!=="."&&B!=="..")try{const I=es(B,a);if(e[I])return I}catch{}return null},d=pt((_=i.stageinfo)==null?void 0:_.localcoord,[320,240]);if(d.length!==2||d.some(N=>!Number.isFinite(N)||N<=0))throw Error("Invalid stage localcoord.");const f=320/d[0],h=i.camera||{},u=i.playerinfo||{},p=i.bound||{},x=i.stageinfo||{},m=(N,P,B)=>{const F=Zn(N[P],B);if(!Number.isFinite(F))throw Error(`Invalid stage numeric value ${P}.`);return F},v={startX:m(h,"startx",0)*f,startY:m(h,"starty",0)*f,left:m(h,"boundleft",0)*f,right:m(h,"boundright",0)*f,high:m(h,"boundhigh",-25)*f,low:m(h,"boundlow",0)*f,tension:Math.max(0,m(h,"tension",60)*f),floorTension:m(h,"floortension",0)*f,verticalFollow:vi(m(h,"verticalfollow",.2),0,1),zoomIn:m(h,"zoomin",1),zoomOut:m(h,"zoomout",1),startZoom:m(h,"startzoom",1)};if(v.left>v.right||v.high>v.low||v.zoomOut<=0||v.zoomIn<v.zoomOut)throw Error("Invalid stage camera bounds or zoom limits.");const y=i.bgdef.spr?c(i.bgdef.spr):null;y||r(`Stage sprite file is missing: ${i.bgdef.spr||"(unspecified)"}`);const T=i.music||{},R=T.bgmvolume!==void 0?m(T,"bgmvolume",100):100*(1+vi(m(T,"bgvolume",0),-255,255)/256),S={path:n,name:((L=i.info)==null?void 0:L.displayname)||((E=i.info)==null?void 0:E.name)||n,files:e,def:i,localcoord:d,coordinateScale:f,camera:v,sprite:y?{path:y}:null,animations:Kc(t),elements:[],controllers:[],diagnostics:s,leftBound:m(u,"leftbound",-1e3)*f,rightBound:m(u,"rightbound",1e3)*f,starts:[1,2].map(N=>({x:m(u,`p${N}startx`,N===1?-70:70)*f,y:m(u,`p${N}starty`,0)*f,facing:m(u,`p${N}facing`,N===1?1:-1)<0?-1:1})),screenLeft:Math.max(0,m(p,"screenleft",15)*f),screenRight:Math.max(0,m(p,"screenright",15)*f),zoffset:m(x,"zoffset",200)*f,resetBG:m(x,"resetbg",1)!==0,autoturn:m(x,"autoturn",1)!==0,xscale:m(x,"xscale",1),yscale:m(x,"yscale",1),backgroundScale:m(x,"hires",0)!==0?.5:1,zoffsetlink:x.zoffsetlink===void 0?null:m(x,"zoffsetlink",0),cropHigh:Math.max(0,m(h,"cuthigh",0)*f),cropLow:Math.max(0,m(h,"cutlow",0)*f),music:{path:T.bgmusic?c(T.bgmusic):null,requested:T.bgmusic||"",volume:R,loop:m(T,"bgmloop",1)!==0,loopStart:m(T,"bgmloopstart",0),loopEnd:m(T,"bgmloopend",0)}};if(S.shadow={intensity:vi(m(i.shadow||{},"intensity",128),0,256),color:pt((A=i.shadow)==null?void 0:A.color,[0,0,0]),yscale:m(i.shadow||{},"yscale",.4),fade:(U=i.shadow)!=null&&U["fade.range"]?pt(i.shadow["fade.range"]):null},S.reflection=vi(m(i.reflection||{},"intensity",0),0,256),S.leftBound>=S.rightBound)throw Error("Invalid stage player bounds.");S.music.requested&&!S.music.path&&r(`Stage music is missing: ${S.music.requested}`);let M={ids:null,loop:-1};const g=new Set(["type","spriteno","actionno","id","layerno","start","delta","trans","alpha","mask","velocity","tile","tilespacing","positionlink","sin.x","sin.y","window","maskwindow","windowdelta","xscale","width","yscalestart","yscaledelta","scalestart","scaledelta","zoomdelta"]);for(const N of Ya(t,n)){const P=N.values;if(/^bgctrldef(?:\s|$)/.test(N.name))M={ids:P.ctrlid===void 0?null:pt(P.ctrlid,[]),loop:m(P,"looptime",-1)};else if(/^bgctrl(?:\s|$)/.test(N.name)){const B=Sr(P.type).toLowerCase();if(!Lf.has(B)){r(`Background controller ${B} is not implemented.`,N,"unsupported-stage-controller");continue}const F=pt(P.time,[0]);for(const[k,I]of Object.entries(P))if(k!=="type"&&pt(I,[]).some(C=>!Number.isFinite(C)))throw Error(`Invalid background controller ${k} at line ${N.line}.`);S.controllers.push({type:B,time:[F[0],F[1]??F[0],F[2]??-1],groupLoop:M.loop,ids:P.ctrlid===void 0?M.ids:pt(P.ctrlid,[]),values:P,line:N.line})}else if(/^bg(?:\s|$)/.test(N.name)){const B=Sr(P.type||"normal").toLowerCase();if(!Pf.has(B)){r(`Background type ${B} is not implemented.`,N,"unsupported-stage");continue}const F=B==="anim"||B==="parallax"&&P.actionno!==void 0,k=Sr(P.trans||"default").toLowerCase(),I={type:B,animated:F,id:m(P,"id",0),layer:m(P,"layerno",0),start:pt(P.start),delta:pt(P.delta,[1,1]),velocity:pt(P.velocity),spriteno:pt(P.spriteno),anim:m(P,"actionno",0),mask:F||m(P,"mask",["add","sub"].includes(k)?1:0)!==0,trans:k,alpha:pt(P.alpha,k==="addalpha"?[256,0]:[256,256]),tile:pt(P.tile),spacing:pt(P.tilespacing),link:m(P,"positionlink",0)!==0,sinX:pt(P["sin.x"],[0,0,0]),sinY:pt(P["sin.y"],[0,0,0]),xscale:pt(P.xscale,[1,1]),width:P.width===void 0?null:pt(P.width),yScaleStart:m(P,"yscalestart",100)/100,yScaleDelta:m(P,"yscaledelta",0)/100,scaleStart:pt(P.scalestart,[1,1]),scaleDelta:pt(P.scaledelta),zoomDelta:m(P,"zoomdelta",1),window:P.maskwindow?pt(P.maskwindow,[]):P.window?pt(P.window,[]):null,windowCentered:!!P.maskwindow,windowDelta:pt(P.windowdelta),transSpecified:P.trans!==void 0,line:N.line};for(const[C,G]of Object.entries(I))if(Array.isArray(G)&&G.some(W=>!Number.isFinite(W)))throw Error(`Invalid background ${C} at line ${N.line}.`);for(const C of["start","delta","velocity","spriteno","alpha","tile","spacing","xscale","scaleStart","scaleDelta","windowDelta"])if(I[C].length!==2)throw Error(`Invalid background ${C} at line ${N.line}.`);if(I.width&&I.width.length!==2||I.window&&I.window.length!==4)throw Error(`Invalid background dimensions at line ${N.line}.`);if(F&&!S.animations.some(C=>C.id===I.anim)&&r(`Stage action ${I.anim} is missing.`,N),F&&I.tile.some((C,G)=>C&&I.spacing[G]<=0)&&B!=="parallax"&&r("Animated background tiling requires positive tilespacing.",N),B==="parallax"&&P.xscale!==void 0&&(F||I.width))throw Error(`Parallax xscale cannot be combined with width or animation at line ${N.line}.`);for(const C of Object.keys(P))g.has(C)||r(`Background parameter ${C} is not implemented.`,N,"unsupported-stage-parameter");S.elements.push(I)}}if(S.elements.length>2048||S.controllers.length>4096)throw Error("Stage background/controller limit exceeded.");return S}function Fl(n,e){return n[1]>0?n[0]*Math.sin(2*Math.PI*e/n[1]+(n[2]||0)*Math.PI/180):0}class Nf{constructor(e){if(e.invalid)throw Error(e.diagnostics[0].message);this.definition=e,this.animations=new Map(e.animations.map(t=>[t.id,t])),this.diagnostics=[...e.diagnostics],this.reset()}reset({backgrounds:e=!0}={}){const t=this.definition;this.camera={x:vi(t.camera.startX,t.camera.left,t.camera.right),y:vi(t.camera.startY,t.camera.high,t.camera.low),zoom:vi(t.camera.startZoom,t.camera.zoomOut,t.camera.zoomIn)},(e||!this.elements)&&(this.time=0,this.elements=t.elements.map(i=>({...i,start:[...i.start],motion:[0,0],velocity:[...i.velocity],sinX:[...i.sinX],sinY:[...i.sinY],sinStartX:0,sinStartY:0,anim:i.anim,frameIndex:0,frameTime:0,visible:!0,enabled:!0})))}updateCamera(e){e=e.filter(a=>!a.destroyed&&!a.isProjectile);const t=this.definition,i=t.camera,s=e.filter(a=>{var o;return((o=a.moveCamera)==null?void 0:o.x)!==!1}),r=e.filter(a=>{var o;return((o=a.moveCamera)==null?void 0:o.y)!==!1});if(s.length){const a=Math.min(...s.map(f=>f.pos.x)),o=Math.max(...s.map(f=>f.pos.x));this.camera.zoom=vi(320/Math.max(1,o-a+2*i.tension),i.zoomOut,i.zoomIn);const l=Math.max(1,160/this.camera.zoom-i.tension),c=o-l,d=a+l;this.camera.x=vi(c<=d?vi(this.camera.x,c,d):(a+o)/2,i.left,i.right)}r.length&&(this.camera.y=vi(Math.min(0,Math.min(...r.map(a=>a.pos.y))+i.floorTension)*i.verticalFollow,i.high,i.low))}view(e=16/9){const t=this.definition,i=t.cropHigh+t.cropLow?320/e:t.localcoord[1]*t.coordinateScale,s=Math.max(0,t.localcoord[1]*t.coordinateScale-i),r=t.cropHigh+t.cropLow?t.cropHigh/(t.cropHigh+t.cropLow):.5;let a=t.zoffset;if(t.zoffsetlink!==null){const d=this.elements.findIndex(f=>f.id===t.zoffsetlink);d>=0&&(a=this.position(d).y*t.coordinateScale)}const o=a-s*r,l=320/this.camera.zoom,c=i/this.camera.zoom;return{left:this.camera.x-l/2,right:this.camera.x+l/2,top:this.camera.y-o/this.camera.zoom,bottom:this.camera.y+(i-o)/this.camera.zoom,width:l,height:c,displayHeight:i,groundY:o,zoffset:a,cropTop:s*r,zoom:this.camera.zoom}}position(e){let t=0,i=0,s=[1,1],r=0;for(let a=e;a>=0&&r++<2048;a--){const o=this.elements[a];if(t+=o.start[0]+o.motion[0]+Fl(o.sinX,this.time-o.sinStartX),i+=o.start[1]+o.motion[1]+Fl(o.sinY,this.time-o.sinStartY),s=o.delta,!o.link)break}return{x:t,y:i,delta:s}}tick({paused:e=!1}={}){if(!e){for(const t of this.definition.controllers){let i=t.groupLoop>0?this.time%t.groupLoop:this.time;if(t.time[2]>0&&(i%=t.time[2]),!(i<t.time[0]||i>t.time[1]))for(const s of this.elements){if(t.ids&&!t.ids.includes(s.id)&&!t.ids.includes(-1))continue;const r=t.values;if(t.type==="visible")s.visible=Zn(r.value,1)!==0;else if(t.type==="enable")s.enabled=Zn(r.value,1)!==0;else if(t.type==="anim")s.anim=Zn(r.value,0),s.frameIndex=s.frameTime=0;else if(t.type==="sinx"||t.type==="siny"){const a=t.type==="sinx"?"sinX":"sinY";s[a]=pt(r.value,[0,0,0]),s[a==="sinX"?"sinStartX":"sinStartY"]=this.time}else if(/^(pos|vel)(set|add)$/.test(t.type)){for(const[a,o]of[["x",0],["y",1]])if(r[a]!==void 0){const l=Zn(r[a]),c=t.type.startsWith("pos")?s.motion:s.velocity;t.type.endsWith("set")?c[o]=l-(c===s.motion?s.start[o]:0):c[o]+=l}}}}for(const t of this.elements)if(t.enabled){for(let r=0;r<2;r++)t.motion[r]+=t.velocity[r];t.drawFrameIndex=t.frameIndex,t.drawFrameTime=t.frameTime;const i=this.animations.get(t.anim),s=i==null?void 0:i.frames[t.frameIndex];t.animated&&s&&s.ticks>=0&&++t.frameTime>=Math.max(1,s.ticks)&&(t.frameTime=0,++t.frameIndex>=i.frames.length&&(t.frameIndex=i.loopStart||0))}this.time++}}frame(e){var t;return e.animated?(t=this.animations.get(e.anim))==null?void 0:t.frames[e.drawFrameIndex??e.frameIndex]:{group:e.spriteno[0],number:e.spriteno[1],x:0,y:0,flip:"",ticks:-1}}variable(e){var a;const[t,...i]=String(e).toLowerCase().split("."),s=(a=this.definition.def[t])==null?void 0:a[i.join(".")];if(s===void 0)throw Error(`StageVar ${e} is not implemented or missing.`);const r=Number(s);return Number.isFinite(r)?r:Sr(s)}}const Uf=n=>{if(n[0].life<=0&&n[1].life<=0)return"draw";if(n[0].life<=0)return"opponent";if(n[1].life<=0)return"player";const e=n[0].life*n[1].maxLife-n[1].life*n[0].maxLife;return e===0?"draw":e>0?"player":"opponent"};class Ff{constructor({roundsToWin:e=2,roundTime:t=99,preIntro:i=30,introHold:s=30,overTime:r=60,resultTime:a=90,autoAdvance:o=!0}={}){for(const[l,c]of Object.entries({roundsToWin:e,roundTime:t,preIntro:i,introHold:s,overTime:r,resultTime:a}))if(!Number.isFinite(c)||c<0)throw Error(`Invalid match rule ${l}.`);if(e<1||e>99||t>3600)throw Error("Match rule exceeds supported bounds.");this.rules={roundsToWin:Math.trunc(e),roundTime:t,preIntro:Math.trunc(i),introHold:Math.trunc(s),overTime:Math.trunc(r),resultTime:Math.trunc(a),autoAdvance:o},this.roundNo=1,this.roundsExisted=0,this.wins={player:0,opponent:0},this.matchOver=!1,this.roundWinner=null,this.reason=null,this.startRound()}startRound(){this.roundState=0,this.phaseTime=0,this.timeLeft=this.rules.roundTime?Math.round(this.rules.roundTime*60):-1,this.roundWinner=null,this.reason=null,this._awarded=!1}step({players:e,paused:t=!1,intro:i=!1,roundNotOver:s=!1,timerFreeze:r=!1,noKO:a=[!1,!1]}={}){const o=[];if(t)return o;if(this.roundState===0)return++this.phaseTime>=this.rules.preIntro&&(this.roundState=1,this.phaseTime=0),o;if(this.roundState===1)return this.phaseTime++,!i&&this.phaseTime>=this.rules.introHold&&(this.roundState=2,this.phaseTime=0,o.push({type:"fight"})),o;if(this.roundState===2){this.phaseTime++;const l=e.some((c,d)=>c.life<=0&&!a[d]);return!r&&this.timeLeft>0&&this.timeLeft--,(l||this.timeLeft===0)&&(this.roundWinner=Uf(e),this.reason=l?e.every(c=>c.life<=0)?"double-ko":"ko":"time",this.roundState=3,this.phaseTime=0,o.push({type:"round-over",winner:this.roundWinner,reason:this.reason})),o}return this.roundState===3?(s||++this.phaseTime>=this.rules.overTime&&(!this._awarded&&this.roundWinner!=="draw"&&(this.wins[this.roundWinner]++,this._awarded=!0),this.matchOver=Object.values(this.wins).some(l=>l>=this.rules.roundsToWin),this.roundState=4,this.phaseTime=0,o.push({type:"result",winner:this.roundWinner,reason:this.reason,matchOver:this.matchOver})),o):(this.roundState===4&&!s&&!this.matchOver&&this.rules.autoAdvance&&++this.phaseTime>=this.rules.resultTime&&(this.roundNo++,this.roundsExisted++,this.startRound(),o.push({type:"next-round",roundNo:this.roundNo})),o)}}const Gt=["a","b","c","x","y","z","s"],_s=["U","D","B","F","UB","UF","DB","DF"],Of=new Set(["U","D","L","R",...Gt]),Nr=3600,Ol=128,kl=4096;function kf(n){let e=null;for(let t=0;t<n.length;t++){const i=n[t];if((i==='"'||i==="'")&&(!e||e===i))e=e?null:i;else if(i===";"&&!e)return n.slice(0,t).trim()}return n.trim()}function ha(n){const e=n.match(/^(?:"([\s\S]*)"|'([\s\S]*)')$/);return e?e[1]??e[2]:n}function Bf(n){let e=n.replace(/\s/g,"");if(!e)throw Error("Empty command symbol.");const t={source:n,strict:!1,hold:!1,release:!1,charge:0,tolerant:!1},i=new Set;for(;/^[>\/~$]/.test(e);){const r=e[0];if(i.has(r))throw Error(`Repeated ${r} modifier in ${n}.`);if(i.add(r),e=e.slice(1),r===">"&&(t.strict=!0),r==="/"&&(t.hold=!0),r==="$"&&(t.tolerant=!0),r==="~"){t.release=!0;const a=e.match(/^\d+/);if(a){if(t.charge=Number(a[0]),!Number.isSafeInteger(t.charge)||t.charge>Nr)throw Error(`Charge duration exceeds the ${Nr}-tick runtime limit.`);e=e.slice(a[0].length)}}}if(t.hold&&t.release)throw Error(`Hold and release cannot be combined in ${n}.`);const s=e.split("+");if(s.some(r=>!r)||new Set(s).size!==s.length)throw Error(`Invalid simultaneous input ${n}.`);if(s.length===1&&_s.includes(s[0]))t.kind="direction",t.keys=s,t.key=(t.tolerant?"$":"")+s[0];else if(s.every(r=>Gt.includes(r))){if(t.tolerant)throw Error(`The $ modifier is only valid on directions: ${n}.`);t.kind="button",t.keys=s}else if(s.filter(r=>_s.includes(r)).length===1&&s.every(r=>_s.includes(r)||Gt.includes(r)))t.kind="chord",t.keys=s.map(r=>_s.includes(r)&&t.tolerant?"$"+r:r);else throw Error(`Unsupported command symbol ${n}. Directions are uppercase and buttons are lowercase.`);return t}function zf(n){const e=n.split(",").map(Bf),t=[];for(const i of e){const s=t.at(-1);(s==null?void 0:s.kind)==="direction"&&i.kind==="direction"&&s.key===i.key&&!s.hold&&!s.release&&!i.hold&&!i.release?(t.push({...i,source:`>~${i.key}`,strict:!0,release:!0,charge:0}),t.push({...i,strict:!0})):t.push(i)}if(t.length>Ol)throw Error(`Command exceeds the ${Ol}-symbol runtime limit.`);return t}function Yo(n){const e=[];let t;for(const[c,d]of String(n).replace(/^\uFEFF|^ï»¿/,"").split(/\r?\n/).entries()){const f=kf(d),h=f.match(/^\[([^\]]+)\]$/);if(h)t={name:h[1].trim().toLowerCase(),line:c+1,values:{}},e.push(t);else if(t){const u=f.indexOf("=");u>0&&(t.values[f.slice(0,u).trim().toLowerCase()]=f.slice(u+1).trim())}}const i=[],s={time:15,bufferTime:1},r=Object.fromEntries(Gt.map(c=>[c,c])),a=(c,d,f=ha(c.values.name??""))=>{i.push({kind:"command",name:f,line:c.line,message:d})};function o(c,d,f,h,u){if(c==null)return d;if(!/^[-+]?\d+$/.test(c.trim())||!Number.isSafeInteger(Number(c)))throw Error(`${h} must be an integer.`);const p=Math.max(1,Number(c));if(p>u){if(h==="buffer.time"||h==="command.buffer.time")return u;throw Error(`${h} exceeds the ${u}-tick runtime limit.`)}return p}for(const c of e){if(c.name==="defaults")try{s.time=o(c.values["command.time"],s.time,c,"command.time",Nr),s.bufferTime=o(c.values["command.buffer.time"],s.bufferTime,c,"command.buffer.time",30)}catch(d){a(c,d.message)}if(c.name==="remap")for(const[d,f]of Object.entries(c.values)){const h=ha(f);!Gt.includes(d)||h&&!Gt.includes(h)?a(c,`Unsupported button remap ${d} = ${f}.`):r[d]=h}}const l=[];for(const c of e){if(c.name!=="command")continue;if(l.length>=kl){a(c,`Command count exceeds the ${kl}-command runtime limit.`);break}const{values:d}=c,f=ha(d.name??"");try{if(!f)throw Error("Command is missing its name.");if(!d.command)throw Error("Command is missing its input sequence.");const h=zf(d.command);l.push({name:f,command:d.command,sequence:h,time:o(d.time,s.time,c,"time",Nr),bufferTime:o(d["buffer.time"],s.bufferTime,c,"buffer.time",30),line:c.line,holdOnly:h.every(u=>u.hold)})}catch(h){a(c,h.message,f)}}return{commands:l,defaults:s,remap:r,diagnostics:i}}function Hf(n,e,t){const i=new Set;n.has("U")!==n.has("D")&&i.add(n.has("U")?"U":"D"),n.has("L")!==n.has("R")&&i.add(n.has(e<0?"L":"R")?"F":"B");for(const s of Gt)n.has(s)&&t[s]&&i.add(t[s]);return i}function Gf(n){const e=new Set(Gt.filter(i=>n.has(i))),t=(n.has("U")?"U":n.has("D")?"D":"")+(n.has("B")?"B":n.has("F")?"F":"");t&&e.add(t);for(const i of _s)[...i].every(s=>n.has(s))&&e.add("$"+i);return e}function Vf(n){return n.kind==="direction"?[n.key]:n.keys}function Gs(n,e){const t=Vf(n);return n.hold?t.every(i=>e.held.has(i)):n.release?t.every(i=>e.released.has(i)&&(e.previousDurations.get(i)??0)>=n.charge):t.every(i=>n.kind==="chord"&&!Gt.includes(i)?e.held.has(i):e.pressed.has(i))}function Wf(n){if(n.hold)return[];const e=n.release?"release:":"press:";return n.kind==="chord"?n.keys.filter(t=>Gt.includes(t)||n.release).map(t=>e+(Gt.includes(t)?t:"direction")):n.kind==="direction"?[e+"direction"]:n.keys.map(t=>e+t)}function Bl(n,e,t){if(n.kind==="chord"){const i=new Set;for(const s of n.keys)if(Gt.includes(s))for(const r of Gt)t[r]===s&&i.add(r);else for(const r of s.replace("$",""))i.add(r==="F"?e.facing<0?"L":"R":r==="B"?e.facing<0?"R":"L":r);return i}return n.kind==="button"?new Set(Gt.filter(i=>n.keys.includes(t[i]))):new Set([...n.keys[0]].map(i=>i==="F"?e.facing<0?"L":"R":i==="B"?e.facing<0?"R":"L":i))}class Es{constructor(e={commands:[]}){typeof e=="string"&&(e=Yo(e)),this.commands=e.commands??[],this.remap=e.remap??Object.fromEntries(Gt.map(t=>[t,t])),this.diagnostics=[...e.diagnostics??[]],this.historyLimit=Math.max(1,...this.commands.map(t=>t.time+1)),this.reset()}reset(){this.tick=-1,this.history=[],this.buffered=new Map,this.active=new Set,this.previous={raw:new Set,held:new Set,durations:new Map}}update(e,t=1){this.tick++;const i=new Set([...e].filter(l=>Of.has(l))),s=Gf(Hf(i,t,this.remap)),r=this.previous,a={tick:this.tick,raw:i,facing:t,held:s,pressed:new Set([...s].filter(l=>!r.held.has(l))),released:new Set([...r.held].filter(l=>!s.has(l))),previousDurations:r.durations,durations:new Map([...s].map(l=>[l,(r.durations.get(l)??0)+1])),changes:new Set([...i,...r.raw].filter(l=>i.has(l)!==r.raw.has(l)))};this.previous=a,this.history.push(a),this.history.length>this.historyLimit&&this.history.shift(),this.active=new Set;let o=25e4;for(const l of this.commands){if(l.holdOnly){l.sequence.every(d=>Gs(d,a))&&this.active.add(l.name);continue}if(l.sequence.every(d=>!d.hold||Gs(d,a))&&Gs(l.sequence.at(-1),a)&&this.matchSequence(l,()=>--o>=0)&&this.buffered.set(l.name,this.tick+l.bufferTime-1),(this.buffered.get(l.name)??-1)>=this.tick&&this.active.add(l.name),o<0){this.diagnostics.some(d=>d.message==="Input matching work limit reached.")||this.diagnostics.push({kind:"command",message:"Input matching work limit reached."});break}}for(const[l,c]of this.buffered)c<this.tick&&this.buffered.delete(l);return this.active}matchSequence(e,t){const i=this.history.length-1,s=this.tick-e.time;let r=i,a=null,o=new Set;for(let l=e.sequence.length-1;l>=0;l--){const c=e.sequence[l],d=Wf(c);let f=-1;for(let h=r;h>=0&&this.history[h].tick>=s;h--){if(!t())return!1;if(h<r&&(o=new Set),!(!Gs(c,this.history[h])||d.some(u=>o.has(u)))&&!(a!=null&&a.symbol.strict&&!this.strictBetween(h,a.index,c,a.symbol))){f=h;break}}if(f<0)return!1;f!==r&&(o=new Set);for(const h of d)o.add(h);r=f,a={index:f,symbol:c}}return!0}strictBetween(e,t,i,s){const r=this.history[t],a=Bl(s,r,this.remap);if(e===t){for(const o of Bl(i,r,this.remap))a.add(o);return[...r.changes].every(o=>a.has(o))}for(let o=e+1;o<t;o++)if(this.history[o].changes.size)return!1;return[...r.changes].every(o=>a.has(o))}}const zl=["a","b","c","x","y","z","s"];function Ka(n){return Number.isFinite(Number(n))?Math.max(0,Math.min(8,Math.trunc(Number(n)))):0}function ua(n){var t,i,s,r,a,o;let e=(i=(t=n.checks)==null?void 0:t.find(l=>l.key==="cmd"&&l.ok))==null?void 0:i.path;if(!e&&((r=(s=n.def)==null?void 0:s.files)!=null&&r.cmd))try{e=es(n.def.files.cmd,((a=n.path)==null?void 0:a.slice(0,n.path.lastIndexOf("/")+1))||"",!0)}catch{}return Yo(e&&((o=n.files)!=null&&o[e])?An(n.files[e]):"")}function Hl(n){const e=[];let t=new Set,i=new Set,s=new Set;const r=(a=1,o=[])=>{const l=new Set([...t,...i,...o]),c=e.at(-1);c&&l.size===c.keys.size&&[...l].every(d=>c.keys.has(d))?c.duration+=a:e.push({keys:l,duration:a}),s=l};r();for(const a of n.sequence)if(a.kind==="direction"){const o=new Set(a.keys[0]);a.release?(t=o,r(Math.max(1,a.charge)),t=new Set,r()):(!a.hold&&o.size===t.size&&[...o].every(l=>t.has(l))&&(t=new Set,r()),t=o,r())}else if(a.release){r(Math.max(1,a.charge),a.keys);for(const o of a.keys)i.delete(o);r()}else{if(a.keys.some(o=>s.has(o))&&!a.hold&&r(),a.hold)for(const o of a.keys)i.add(o);r(1,a.keys)}return t=new Set,i=new Set,r(),e}class Xf{constructor(e,{level:t=4,seed:i=1831565813}={}){var r;this.level=Ka(t),this.seed=i>>>0||1,this.buffer=new Es(e),this.inverse=new Map;for(const a of zl){const o=((r=e.remap)==null?void 0:r[a])??a;o&&!this.inverse.has(o)&&this.inverse.set(o,a)}const s=e.commands.filter(a=>a.sequence.every(o=>o.kind!=="button"||o.keys.every(l=>this.inverse.has(l))));this.attacks=s.filter(a=>!a.holdOnly&&a.sequence.some(o=>o.kind==="button"&&o.keys.some(l=>l!=="s"))).slice(0,512),this.byName=new Map;for(const a of s)this.byName.has(a.name)||this.byName.set(a.name,[]),this.byName.get(a.name).push(a);this.recoveries=s.filter(a=>a.name.toLowerCase()==="recovery"),this.recoveryNames=new WeakMap,this.recoveryButton=0,this.recovering=!1,this.normal=this.attacks.filter(a=>a.sequence.length===1&&!a.sequence[0].release),this.special=this.attacks.filter(a=>!this.normal.includes(a)),this.plan=[],this.index=0,this.remaining=0,this.cooldown=0,this.raw=new Set,this.lastCommand=null}random(){let e=this.seed;return e^=e<<13,e^=e>>>17,e^=e<<5,this.seed=e>>>0,this.seed/4294967296}physical(e,t){return new Set([...e].map(i=>i==="F"?t<0?"L":"R":i==="B"?t<0?"R":"L":this.inverse.get(i)||i))}queue(e,t){this.plan=[{keys:new Set(e),duration:t}],this.index=0,this.remaining=0}chooseRecovery(e){var a;const t=(a=e.stateOwner)==null?void 0:a.program.states.get(e.stateNo);let i=t&&this.recoveryNames.get(t);if(t&&!i){i=new Set;for(const o of t.controllers){if(!["changestate","selfstate"].includes(o.type))continue;const l=o.entries.filter(c=>/^trigger(?:all|[1-9]\d*)$/.test(c.key)).map(c=>c.value).join(`
`);if(/\bcanrecover\b/i.test(l))for(const c of l.matchAll(/\bcommand\s*=\s*"([^"\\]*)"/gi))i.add(c[1])}this.recoveryNames.set(t,i)}const s=[...i||[]].flatMap(o=>this.byName.get(o)||[]),r=s.length?s:this.recoveries;if(r.length){const o=r[Math.floor(this.random()*r.length)];this.lastCommand=o.name,this.plan=Hl(o),this.index=0,this.remaining=0}else{const o=zl.filter(l=>l!=="s"&&this.inverse.has(l));o.length&&this.queue([o[this.recoveryButton++%o.length]],1)}}choose(e,t){if(!e.ctrl||e.moveType==="H")return;const i=Math.abs(t.pos.x-e.pos.x),s=e.coordinateScale||1,r=e.constant("size.ground.front")*s+t.constant("size.ground.front")*(t.coordinateScale||1)+20*s;if(i>r){this.queue(["F"],4+Math.floor(this.random()*9));return}if(t.moveType==="A"&&this.random()<.12+.07*this.level){this.queue(this.random()<.3?["D","B"]:["B"],4+this.level);return}if(this.attacks.length){const a=this.special.length&&this.random()<.08+.055*this.level?this.special:this.normal.length?this.normal:this.attacks,o=a[Math.floor(this.random()*a.length)];this.lastCommand=o.name,this.plan=Hl(o),this.index=0,this.remaining=0}else this.queue([],2)}tick(e,t,{paused:i=!1,enabled:s=!0}={}){var r,a;if(!this.level||!s||!e.alive||!(t!=null&&t.alive))this.plan=[],this.index=0,this.remaining=0,this.cooldown=0,this.raw=new Set,this.recovering=!1;else if(!i){const o=e.moveType==="H"&&!!((r=e.getHitVars)!=null&&r.fall);o!==this.recovering&&(this.plan=[],this.index=0,this.remaining=0,this.cooldown=o?10-this.level:0,this.raw=new Set,this.recovering=o);const l=o&&["A","L"].includes(e.stateType)&&!!((a=e.resolveTrigger)!=null&&a.call(e,"canrecover"));o&&!l&&(this.plan=[],this.index=0,this.remaining=0,this.cooldown=10-this.level,this.raw=new Set),this.index>=this.plan.length&&(this.cooldown>0?this.cooldown--:o?(l&&this.chooseRecovery(e),this.cooldown=14-this.level):(this.choose(e,t),this.cooldown=Math.max(1,15-this.level*1.5)));const c=this.plan[this.index];c?(this.remaining<=0&&(this.remaining=c.duration),this.raw=this.physical(c.keys,e.facing),--this.remaining<=0&&this.index++):this.raw=new Set}return this.buffer.update(this.raw,e.facing)}}const Sn=(n,e=0)=>Number.isFinite(Number(n))?Number(n):e,Za=n=>String(n??"").toUpperCase().replace(/\s/g,"");function Jn(n,e,t){var r;const i=(r=n.program)==null?void 0:r.constants,s=i instanceof Map?i.get(e):i==null?void 0:i[e];return s===void 0?t:Sn(s,t)}function Ui(n,e="clsn1",t=n.collisionFrame??n.currentFrame){var d,f,h,u;if(!t||!Array.isArray(t[e]))return[];const i=lh(n),s=It(i),r=n.facing<0?-1:1,a=Jn(i,"size.xscale",1)*s*r,o=Jn(i,"size.yscale",1)*s,l=Sn((d=n.pos)==null?void 0:d.x)+Jn(n,"size.draw.offset.x",0)*It(n)*r+Sn((f=n.drawOffset)==null?void 0:f.x),c=Sn((h=n.pos)==null?void 0:h.y)+Jn(n,"size.draw.offset.y",0)*It(n)+Sn((u=n.drawOffset)==null?void 0:u.y);return t[e].filter(p=>Array.isArray(p)&&p.length>=4&&p.slice(0,4).every(x=>Number.isFinite(Number(x)))).map(p=>{const x=l+Number(p[0])*a,m=l+Number(p[2])*a,v=c+Number(p[1])*o,y=c+Number(p[3])*o;return[Math.min(x,m),Math.min(v,y),Math.max(x,m),Math.max(v,y)]})}function $f(n,e,t=!1){return t?n[0]<=e[2]&&n[2]>=e[0]&&n[1]<=e[3]&&n[3]>=e[1]:n[0]<e[2]&&n[2]>e[0]&&n[1]<e[3]&&n[3]>e[1]}function hs(n,e,t=!1){for(const i of n)for(const s of e)if($f(i,s,t))return[Math.max(i[0],s[0]),Math.max(i[1],s[1]),Math.min(i[2],s[2]),Math.min(i[3],s[3])];return null}function qf(n,e){var i;const t=e.moveType==="H";return n.includes("+")&&!t||n.includes("-")&&t?!1:e.stateType==="L"?n.includes("D"):e.stateType==="A"?n.includes(e.moveType==="H"&&((i=e.getHitVars)!=null&&i.fall)?"F":"A"):n.includes("M")||n.includes(e.stateType==="C"?"L":"H")}function Yf(n,e,t,i){var l,c,d,f;const s=t.moveType==="H"&&!!((l=t.getHitVars)!=null&&l.guarded);if(!t.ctrl&&!s||t.moveType==="H"&&!s||!["S","C","A"].includes(t.stateType)||(c=e.asserted)!=null&&c.has("unguardable"))return!1;const r=t.stateType==="A"?"noairguard":t.stateType==="C"?"nocrouchguard":"nostandguard";if((d=t.asserted)!=null&&d.has(r))return!1;const a=new Set([...i].map(h=>String(h).toLowerCase()));if(!((f=t.world)!=null&&f.manageInputs?t.movementHeld("holdback"):a.has("holdback")))return!1;const o=Za(n.guardFlag??n.guardflag);return t.stateType==="A"?o.includes("A"):t.stateType==="C"?/[LM]/.test(o):/[HM]/.test(o)}function Gl(n){const e=Array.isArray(n.priority)?n.priority:String(n.priority??"4,Hit").split(","),t=String(e[1]??"Hit").trim().toLowerCase();return{level:Math.max(1,Math.min(7,Sn(e[0],4))),type:["hit","miss","dodge"].includes(t)?t:"hit"}}function Kf(n){if(n.length<2)return n;const e=Gl(n[0].hit),t=Gl(n[1].hit);return e.level!==t.level?[n[e.level>t.level?0:1]]:e.type==="dodge"||t.type==="dodge"?[]:e.type==="miss"&&t.type==="miss"?[]:n.filter((i,s)=>(s?t:e).type==="hit")}class Zf{constructor(e,{commonText:t="",commonAnimations:i=new Map,opponentCharacter:s=e,leftBound:r=-150,rightBound:a=150,pushboxes:o=!0,maxHelpers:l=56,maxProjectiles:c=256,initialize:d=!0,skipIntro:f=!0,stage:h=null,rules:u=null,combatRules:p={},playerPalette:x=1,opponentPalette:m=1,playerAILevel:v=0,opponentAILevel:y=0,expressionEvaluator:T=null,programs:R=null,manageInputs:S=!1,orderedPhases:M=!1}={}){if(this.expressionEvaluator=T,this.programs=R,this.manageInputs=S,this.orderedPhases=M,this.combatRules=mf(e.files,p),!Number.isFinite(r)||!Number.isFinite(a)||r>=a)throw Error("Invalid training stage bounds.");this.character=e,this.opponentCharacter=s,this.commonText=t,this.leftBound=r,this.rightBound=a,this.pushboxes=o,this.commonAnimations=i,this.maxHelpers=Math.min(256,Math.max(0,l)),this.maxProjectiles=Math.min(1024,Math.max(0,c)),this.initialize=d,this.skipIntro=f,this.playerPalette=x,this.opponentPalette=m,this.playerAILevel=Ka(v),this.opponentAILevel=Ka(y),this.stage=h?new Nf(h):null,this.rules=u,this.stage&&(this.leftBound=h.leftBound,this.rightBound=h.rightBound),this.reset()}reset({preserveMatch:e=!1}={}){var s,r,a,o;const t=e?{players:[this.player,this.opponent],flow:this.roundFlow,ticks:this.ticks,diagnostics:this.diagnostics}:null;this.roundFlow=(t==null?void 0:t.flow)||(this.rules?new Ff(this.rules):null),this.roundGeneration=(this.roundGeneration||0)+1,this.stage&&this.stage.reset({backgrounds:!e||this.stage.definition.resetBG});const i=((s=this.stage)==null?void 0:s.definition.starts)||[{x:-70,y:0,facing:1},{x:70,y:0,facing:-1}];if(this.player=new Dr(this.character,{world:this,program:(r=this.programs)==null?void 0:r.get(this.character),expressionEvaluator:this.expressionEvaluator,commonAnimations:this.commonAnimations,commonText:this.commonText,position:i[0],facing:i[0].facing,id:1,teamSide:1,paletteNo:this.playerPalette,aiLevel:this.playerAILevel}),this.opponent=new Dr(this.opponentCharacter,{world:this,program:(a=this.programs)==null?void 0:a.get(this.opponentCharacter),expressionEvaluator:this.expressionEvaluator,commonAnimations:this.commonAnimations,commonText:this.commonText,position:i[1],facing:i[1].facing,id:2,teamSide:2,paletteNo:this.opponentPalette,aiLevel:this.opponentAILevel}),this.player.teamSide=1,this.opponent.teamSide=2,this.player.opponent=this.opponent,this.opponent.opponent=this.player,this._entities=[this.player,this.opponent],this.projectiles=[],this.nextEntityId=3,this.orphanEffectOwners=[],this.renderEntities=[...this._entities],this.drawProjectiles=[],this.helperCommands=new Map,this.usedHits=new Map,this.juggles=new Map,this.cornerPushActors=new Set,this.archivedDiagnostics=[],this.archivedDiagnosticKeys=new Set,this.pendingPauses=[],this.pause=null,this.superPause=null,this.commandBuffers=new Map,this.presentationEvents=[],this.eventEntities=[],this.pendingCombatEffects=[],this.activeActor=null,this.contactPhase=!1,this.inputBuffers=new Map,this.inputProfiles=new Map,this.manageInputs)for(const l of this._entities)this.inputProfiles.has(l.character)||this.inputProfiles.set(l.character,ua(l.character)),this.inputBuffers.set(l,new Es(this.inputProfiles.get(l.character)));this.events=[],this.cpus=new Map;for(const l of this._entities)if(l.aiLevel){const c=ua(l.character);this.cpus.set(l,new Xf(c,{level:l.aiLevel,seed:1831565813^l.id*2654435769^(((o=this.roundFlow)==null?void 0:o.roundNo)||1)}));for(const d of c.diagnostics)l.diagnostic("command",d.message,{source:l.character.def.files.cmd,line:d.line})}if(this.ticks=(t==null?void 0:t.ticks)||0,this.winner=null,t){this.archiveDiagnostics(t.diagnostics);for(const[l,c]of[this.player,this.opponent].entries()){const d=t.players[l];c.power=d.power,c.victoryQuoteIndex=d.victoryQuoteIndex;const f=Math.max(0,Math.min(60,Math.trunc(c.program.constants.get("data.intpersistindex")??60))),h=Math.max(0,Math.min(40,Math.trunc(c.program.constants.get("data.floatpersistindex")??40)));c.vars.set(d.vars.subarray(f),f),c.fvars.set(d.fvars.subarray(h),h)}}if(this.syncEnvironment(),this.initialize)for(const l of this._entities)l.program.states.has(5900)&&(l._initializing=!0,l.options.skipIntro=this.skipIntro,l.changeState(5900));return this}get diagnostics(){var i;const e=[...this.archivedDiagnostics,...((i=this.stage)==null?void 0:i.diagnostics)||[],...this.entities.flatMap(s=>s.diagnostics||[]),...this.orphanEffectOwners.flatMap(s=>s.diagnostics||[]),...this.projectiles.flatMap(s=>s.diagnostics||[]),...[...this.cpus||new Map].flatMap(([s,r])=>r.buffer.diagnostics.map(a=>({...a,source:s.character.def.files.cmd})))],t=new Set;return e.filter(s=>{const r=typeof s=="string"?s:JSON.stringify(s);return t.has(r)?!1:(t.add(r),!0)})}get entities(){return this._entities.filter(e=>!e.destroyed)}get view(){var e;return((e=this.stage)==null?void 0:e.view())||{left:-160,right:160,top:-200,bottom:40,width:320,height:240,displayHeight:240,groundY:200,zoom:1}}get matchOver(){var e;return((e=this.roundFlow)==null?void 0:e.matchOver)||!1}syncEnvironment(){for(const e of this._entities||[])this.stage&&(e.cameraPos=this.stage.camera,e.cameraZoom=this.stage.camera.zoom),this.roundFlow&&(e.roundState=this.roundFlow.roundState,e.roundNo=this.roundFlow.roundNo,e.roundsExisted=this.roundFlow.roundsExisted)}findPlayer(e){return this.entities.find(t=>t.id===e)}spawnHelper(e,t){if(this.entities.filter(s=>s.parent).length>=this.maxHelpers)return e.diagnostic("resource-limit",`Helper limit (${this.maxHelpers}) reached.`),null;const i=e.createHelper(t,{id:this.nextEntityId++});return i.destroyed?this.archiveDiagnostics(i.diagnostics):(this._entities.push(i),i.keyCtrl&&this.helperCommands.set(i,new Es(ua(i.root.character))),this.syncEnvironment()),i}spawnProjectile(e,t){if(this.projectiles.length>=this.maxProjectiles)return e.diagnostic("resource-limit",`Projectile limit (${this.maxProjectiles}) reached.`),null;const i=new cs(e,t,{id:this.nextEntityId++});if(i.removed)return this.archiveDiagnostics(i.diagnostics),i;const s=Object.fromEntries(Object.entries(t).filter(([r])=>r.startsWith("afterimage.")).map(([r,a])=>[r.slice(11),a]));return Object.keys(s).length&&this.presentationEvents.push({...s,type:"afterimage",entity:i}),this.projectiles.push(i),i}retireEffects(e,{removeExplods:t=!1}={}){var i;if(!e._effectsDetached){if(e._effectsDetached=!0,t)e.explods=[],e.drawExplods=[];else if(e.drawExplods=[],e.explods.length){for(const s of e.explods)s.orphaned=!0;this.orphanEffectOwners.push(e)}for(const s of new Set([...this._entities,...this.orphanEffectOwners]))((i=s.bound)==null?void 0:i.target)===e&&(s.bound=null),nf(s,e)}}destroyHelper(e,{recursive:t=!1,removeExplods:i=!1}={}){const s=[e];if(t)for(const r of this._entities){let a=r.parent,o=0;for(;a&&o++<256;){if(a===e){s.push(r);break}a=a.parent}}for(const r of s)r.destroyed=!0;for(const r of s)this.retireEffects(r,{removeExplods:i})}requestPause(e,t){const i=Math.max(0,Math.trunc(t.time));if(!Number.isFinite(i)||i>36e4){e.diagnostic("resource-limit","Pause time must be between 0 and 360000 ticks.");return}const s={...t,owner:e,time:i,remaining:i,elapsed:0,moved:new Map,movetime:Math.max(0,Math.min(i,t.movetime||0)),endcmdbuftime:Math.max(0,Math.min(i,t.endcmdbuftime||0))};this.pendingPauses.push(s),t.type==="superpause"&&(e.power=Math.max(0,Math.min(e.maxPower,e.power+(t.poweradd||0))),this.presentationEvents.push({...s,type:"superpause"}))}isFrozen(e){var s,r;const t=((s=this.superPause)==null?void 0:s.remaining)>0?this.superPause:((r=this.pause)==null?void 0:r.remaining)>0?this.pause:null;if(!t)return!1;const i=e===t.owner?t.movetime:t.type==="superpause"?e.superMoveTime||0:e.pauseMoveTime||0;return e.isProjectile?i<=0:(t.moved.get(e)||0)>=i}isSuperUnhittable(e){var t;return((t=this.superPause)==null?void 0:t.remaining)>0&&this.superPause.owner===e&&this.superPause.unhittable!==0}advancePause(){var i,s;const e=((i=this.superPause)==null?void 0:i.remaining)>0?this.superPause:((s=this.pause)==null?void 0:s.remaining)>0?this.pause:null,t=r=>{for(const[a,{before:o,applied:l}]of(r==null?void 0:r.defence)||[])a.defenceMultiplier===l&&(a.defenceMultiplier=o)};if(e){for(const r of[...this.entities,...this.projectiles])!this.isFrozen(r)&&!r._hitPausedThisTick&&e.moved.set(r,(e.moved.get(r)||0)+1);e.remaining--,e.elapsed++,e.remaining||t(e)}for(const r of this.pendingPauses){const a=r.type==="superpause"?"superPause":"pause";if(t(this[a]),this[a]=r,a==="superPause"&&r.remaining>0){const o=r.p2defmul>0?r.p2defmul:this.combatRules.superTargetDefence||1.5;r.defence=new Map;for(const l of r.owner.targets){const c=l.defenceMultiplier,d=c/o;r.defence.set(l,{before:c,applied:d}),l.defenceMultiplier=d}}}this.pendingPauses=[]}tick(e=new Set,t=new Set,{playerInput:i=null,opponentInput:s=null}={}){var _,L,E,A,U,N,P,B,F,k;if(this.orderedPhases){for(const I of this.pendingCombatEffects){const{defender:C,attacker:G,damage:W,minimum:ee,get:ne,give:V}=I;C.life=Math.max(ee,Math.min(C.maxLife,C.life-W)),G&&(G.power=Math.max(0,Math.min(G.maxPower,G.power+ne)),C.power=Math.max(0,Math.min(C.maxPower,C.power+V)))}this.pendingCombatEffects=[];for(const I of this._entities)I._projectedLife=void 0}this.events=[],this.presentationEvents=[],e=e instanceof Set?e:new Set(e),t=t instanceof Set?t:new Set(t);const r=((_=this.superPause)==null?void 0:_.remaining)>0||((L=this.pause)==null?void 0:L.remaining)>0&&this.pause.pausebg!==0,a=((E=this.superPause)==null?void 0:E.remaining)>0||((A=this.pause)==null?void 0:A.remaining)>0,o=((U=this.pause)==null?void 0:U.remaining)>0?this.pause:null,l=((N=this.superPause)==null?void 0:N.remaining)>0?this.superPause:null;this.syncEnvironment(),this.cpus.has(this.player)&&(e=this.cpus.get(this.player).tick(this.player,this.opponent,{paused:this.isFrozen(this.player)||this.player.hitPauseTime>0,enabled:!this.roundFlow||this.roundFlow.roundState===2})),this.cpus.has(this.opponent)&&(t=this.cpus.get(this.opponent).tick(this.opponent,this.player,{paused:this.isFrozen(this.opponent)||this.opponent.hitPauseTime>0,enabled:!this.roundFlow||this.roundFlow.roundState===2})),this.cpus.has(this.player)&&(i=this.cpus.get(this.player).raw),this.cpus.has(this.opponent)&&(s=this.cpus.get(this.opponent).raw);const c=new Set([...this.entities,...this.projectiles].filter(I=>I.hitPauseTime>0)),d=new Set,f=[];for(let I=0;I<this._entities.length;I++){const C=this._entities[I];if(C.destroyed)continue;f.push(C);let G=C.root===this.player?e:t,W=C.root===this.player?i:s;if(this.manageInputs&&C.keyCtrl){W=new Set(W||[]);for(const V of C.pendingAssertedInputs)W.add(V==="F"?C.facing===1?"R":"L":V==="B"?C.facing===1?"L":"R":V);this.isFrozen(C)||C.pendingAssertedInputs.clear(),this.inputBuffers.has(C)||this.inputBuffers.set(C,new Es(this.inputProfiles.get(C.root.character))),G=this.inputBuffers.get(C).update(W,C.facing)}else C.parent&&C.keyCtrl&&W!==null&&(G=this.helperCommands.get(C).update(W,C.facing));(!C.keyCtrl||this.roundFlow&&this.roundFlow.roundState!==2)&&(G=new Set);const ee=C.teamSide===this.player.teamSide?this.opponent:this.player,ne=this.isFrozen(C);if(C._hitPausedThisTick=C.hitPauseTime>0,!ne&&!C._hitPausedThisTick&&(C._projectileContactShield=!1),ne){d.add(C);const V=((P=this.superPause)==null?void 0:P.remaining)>0?this.superPause:this.pause;if(V&&V.remaining<=V.endcmdbuftime){this.commandBuffers.has(C)||this.commandBuffers.set(C,new Set);for(const ie of G)this.commandBuffers.get(C).add(ie)}}else this.commandBuffers.has(C)&&(G=new Set([...G,...this.commandBuffers.get(C)]),this.commandBuffers.delete(C));this.activeActor=C;try{C.tick({commands:G,opponent:ee,paused:ne,input:C.keyCtrl?W:new Set})}finally{this.activeActor=null}}for(const I of this.projectiles){const C=this.isFrozen(I);C&&d.add(I),I._hitPausedThisTick=I.hitPauseTime>0,I.tick({paused:C})}if(this.stage){for(const I of this.entities)I.screenBound!==!1&&(I.pos.x=Math.max(this.leftBound,Math.min(this.rightBound,I.pos.x)));this.stage.updateCamera(this.entities),this.syncEnvironment(),this.stage.tick({paused:r})}this.orderedPhases&&this.advanceCornerPush(d),this.constrainPositions()&&this.stage&&(this.stage.updateCamera(this.entities),this.syncEnvironment(),this.constrainPositions({push:!1}));const u=this.entities;for(const I of u)if(I.moveType!=="H"&&I.stateType!=="L")for(const C of this.juggles.values())C.delete(I.id);const p=this.projectiles.filter(I=>!I.removed&&!I.removing),x=p.map(I=>Ui(I,"clsn2"));for(let I=0;I<p.length;I++){const C=p[I];if(C.removing||!x[I].length)continue;const G=[];for(let ee=I+1;ee<p.length;ee++){const ne=p[ee];C.teamSide===ne.teamSide||ne.removing||d.has(C)&&d.has(ne)||!hs(x[I],x[ee],this.orderedPhases)||G.push(ne)}const W=ee=>(ee.pos.x-C.pos.x)**2+(ee.pos.y-C.pos.y)**2;G.sort((ee,ne)=>W(ee)-W(ne)||ee.id-ne.id);for(const ee of G){if(C.removing)break;ee.removing||(C.clash(ee),ee.clash(C))}}const m=this.orderedPhases?this.projectiles.filter(I=>!I.removed||I.drawVisible):p,v=[...u,...m];for(const I of u)I.inGuardDistance=Qc(I,v);const y=[],T=new Set;for(const I of u)if(!(!I.reversalDef||d.has(I)||c.has(I)||this.roundFlow&&this.roundFlow.roundState!==2))for(const C of u){const G=I.reversalDef;if(!G)break;const W=C.hitDef;if(!W||C===I||C.teamSide===I.teamSide||c.has(C)||T.has(C)||!I.attributeMatches(G["reversal.attr"],W.attr)||((B=this.usedHits.get(I))==null?void 0:B.get(C.id))===G.serial)continue;const ee=hs(Ui(I),Ui(C),this.orderedPhases);if(!ee)continue;const ne=C.receiveHit(G,I);ne.rejected||(this.applyCornerPush(I,C,ne.cornerPush,G.coordinateScale),C.moveContact=C.moveHit=C.moveGuarded=0,C.moveReversed=1,C.hitDef=null,T.add(C),this.usedHits.has(I)||this.usedHits.set(I,new Map),this.usedHits.get(I).set(C.id,G.serial),this.events.push({type:"reversal",attacker:I,defender:C,hitDef:G,damage:ne.damage,guarded:!1,x:(ee[0]+ee[2])/2,y:(ee[1]+ee[3])/2,tick:this.ticks}))}const R=u.length>2?new Map:null;for(const I of[...u,...p]){if(this.winner||this.roundFlow&&this.roundFlow.roundState!==2||I.destroyed||d.has(I)||T.has(I)||c.has(I)||I.life<=0||I.moveType!=="A")continue;const C=I.hitDef;if(!C||!/^[SCA]\s*,\s*[NSH][ATP]$/i.test(String(C.attr??"").trim()))continue;const G=Za(C.hitFlag??C.hitflag??"MAF");if(!/[HLAMFD]/.test(G)||G.includes("+")&&G.includes("-"))continue;const W=Za(C.affectteam??"E"),ee=C.serial??C,ne=this.usedHits.get(I);let V;for(const ie of[...u].sort((ve,_e)=>Math.abs(ve.pos.x-I.pos.x)-Math.abs(_e.pos.x-I.pos.x))){if(I===ie||I.isProjectile&&I.owner===ie||ie.life<=0||c.has(ie))continue;const ve=I.teamSide===ie.teamSide;if(W==="E"&&ve||W==="F"&&!ve||!qf(G,ie)||(I instanceof cs?!I.canHit(ie,this.ticks):(ne==null?void 0:ne.get(ie.id))===ee))continue;if(V??(V=Ui(I)),!V.length)break;let _e=R==null?void 0:R.get(ie);_e||(_e=Ui(ie,"clsn2"),R==null||R.set(ie,_e));const ae=hs(V,_e,this.orderedPhases);if(!ae||typeof ie.canBeHit=="function"&&!ie.canBeHit(C,I)||String(C[ie.stateType==="A"?"air.type":"ground.type"]??C["ground.type"]??"high").toLowerCase()!=="none"&&!this.canJuggle(I,ie,C))continue;const Le=this.manageInputs||ie.parent?ie.commands:ie===this.player?e:t;y.push({attacker:I,defender:ie,hit:C,activation:ee,overlap:ae,wasFalling:ie.stateType==="L"||ie.stateType==="A"&&ie.moveType==="H"&&!!((F=ie.getHitVars)!=null&&F.fall),guarded:Yf(C,I,ie,Le)})}}const S=y.filter(I=>{const C=y.find(G=>G.attacker===I.defender&&G.defender===I.attacker);return!C||Kf([I,C]).includes(I)}),M=new Set;for(const I of S){if(I.attacker instanceof cs&&(I.defender._projectileContactShield||!I.attacker.canHit()))continue;let C;this.contactPhase=!0;try{C=I.defender.receiveHit(I.hit,I.attacker,{guarded:I.guarded})}finally{this.contactPhase=!1}C!=null&&C.rejected||(this.applyCornerPush(I.attacker,I.defender,C.cornerPush,I.hit.coordinateScale),!I.guarded&&!C.typeNone&&this.recordJuggle(I.attacker,I.defender,I.hit,{wasFalling:I.wasFalling}),this.usedHits.has(I.attacker)||this.usedHits.set(I.attacker,new Map),this.usedHits.get(I.attacker).set(I.defender.id,I.activation),I.attacker instanceof cs&&(I.defender._projectileContactShield=!0,I.attacker.onContact({guarded:I.guarded,defer:!0}),M.add(I.attacker)),this.events.push({type:I.guarded?"guard":"hit",attacker:I.attacker,defender:I.defender,hitDef:I.hit,damage:(C==null?void 0:C.damage)??0,guarded:I.guarded,typeNone:!!C.typeNone,x:(I.overlap[0]+I.overlap[2])/2,y:(I.overlap[1]+I.overlap[3])/2,tick:this.ticks}))}for(const I of M)I.finishContacts();for(const I of this.projectiles)I.finishMovementAllowance({paused:d.has(I)});for(const I of this.entities)I.updateExplods({hitPaused:c.has(I),pause:o,superPause:l});for(const I of this._entities)I.destroyed&&!I._effectsDetached&&this.retireEffects(I);for(const I of this.orphanEffectOwners)I.updateExplods({pause:o,superPause:l});this.orphanEffectOwners=this.orphanEffectOwners.filter(I=>I.explods.length||I.drawExplods.length),this.drawProjectiles=this.projectiles.filter(I=>I.drawVisible),this.eventEntities=[...f,...this.projectiles],this.cleanupEntities(),this.advancePause(),this.ticks++;const g=I=>this.entities.some(C=>C.asserted.has(I));if(!this.roundFlow&&!g("noko")&&(this.player.life<=0||this.opponent.life<=0)&&(this.winner=this.player.life<=0&&this.opponent.life<=0?"draw":this.player.life<=0?"opponent":"player"),this.roundFlow){const I=this.roundFlow,C=[this.player,this.opponent],G=I.step({players:C,paused:a,intro:g("intro"),roundNotOver:g("roundnotover"),timerFreeze:g("timerfreeze"),noKO:C.map(()=>g("noko"))});this.syncEnvironment();for(const W of G){if(W.type==="fight")for(const ee of C)ee.stateNo===0&&(ee.ctrl=1);if(W.type==="round-over"&&(this.winner=W.winner),W.type==="result")for(const ee of C){const ne=W.winner===(ee===this.player?"player":"opponent"),V=ne?180:W.reason==="time"?170:null;V!==null&&ee.program.states.has(V)&&ee.changeState(V,0,ee)}W.type==="next-round"&&this.reset({preserveMatch:!0}),this.presentationEvents.push({...W,type:"round",event:W.type})}I.matchOver&&I.roundWinner!=="draw"&&((k=this[I.roundWinner])==null||k.selectVictoryQuote())}return this.events}cleanupEntities(){var t;const e=this._entities.filter(i=>i.destroyed);for(const i of e)i._effectsDetached||this.retireEffects(i);for(const i of[...e,...this.projectiles.filter(s=>s.removed)]){this.archiveDiagnostics(i.diagnostics),this.usedHits.delete(i),this.cornerPushActors.delete(i),this.commandBuffers.delete(i),this.inputBuffers.delete(i),this.helperCommands.delete(i),this.juggles.delete(i);for(const s of this.juggles.values())s.delete(i.id)}this._entities=this._entities.filter(i=>!i.destroyed),this.projectiles=this.projectiles.filter(i=>!i.removed);for(const i of this._entities){i.helpers=i.helpers.filter(s=>!s.destroyed),i.targets=i.targets.filter(s=>!s.destroyed&&(!this.orderedPhases||s.moveType==="H"));for(const s of i.targetHitIds.keys())i.targets.some(r=>r.id===s)||i.targetHitIds.delete(s);(t=i.bound)!=null&&t.target.destroyed&&(i.bound=null)}this.renderEntities=[...this._entities,...this.orphanEffectOwners].sort((i,s)=>i.id-s.id)}archiveDiagnostics(e){for(const t of e){const i=JSON.stringify(t);this.archivedDiagnosticKeys.has(i)||(this.archivedDiagnosticKeys.add(i),this.archivedDiagnostics.push(t))}}canJuggle(e,t,i){var c,d,f;if((c=(e.isProjectile?e.creator:e).asserted)!=null&&c.has("nojugglecheck")||!(t.stateType==="L"||t.stateType==="A"&&t.moveType==="H"&&((d=t.getHitVars)==null?void 0:d.fall)))return!0;const r=e.isProjectile?e.owner:e,a=(f=this.juggles.get(r))==null?void 0:f.get(t.id),o=(a==null?void 0:a.remaining)??r.constant("data.airjuggle"),l=e.isProjectile?i["air.juggle"]||0:(a==null?void 0:a.group)===i.juggleGroup?0:i.juggleCost||0;return o>=l}recordJuggle(e,t,i,{wasFalling:s=!1}={}){var d,f;if(!s&&!((d=t.getHitVars)!=null&&d.fall)&&t.stateType!=="L")return;const r=e.isProjectile?e.owner:e;this.juggles.has(r)||this.juggles.set(r,new Map);const a=this.juggles.get(r),o=a.get(t.id),l=(f=(e.isProjectile?e.creator:e).asserted)==null?void 0:f.has("nojugglecheck"),c=l?0:e.isProjectile?i["air.juggle"]||0:(o==null?void 0:o.group)===i.juggleGroup?0:i.juggleCost||0;a.set(t.id,{remaining:Math.max(0,((o==null?void 0:o.remaining)??r.constant("data.airjuggle"))-c),group:i.juggleGroup})}bodyWidth(e,t,i=!1){return yr(e,t,{edge:i})}horizontalLimits(e){var a,o;const t=l=>{var c,d;return Sn((d=(c=e.width)==null?void 0:c.edge)==null?void 0:d[e.facing===l?0:1])*e.coordinateScale},i=this.view;let s=this.orderedPhases?Math.max(this.leftBound,i.left+(((a=this.stage)==null?void 0:a.definition.screenLeft)||0)+t(-1)):this.stage?Math.max(this.leftBound,i.left+Math.max(this.stage.definition.screenLeft,this.bodyWidth(e,-1,!0))):this.leftBound+this.bodyWidth(e,-1,!0),r=this.orderedPhases?Math.min(this.rightBound,i.right-(((o=this.stage)==null?void 0:o.definition.screenRight)||0)-t(1)):this.stage?Math.min(this.rightBound,i.right-Math.max(this.stage.definition.screenRight,this.bodyWidth(e,1,!0))):this.rightBound-this.bodyWidth(e,1,!0);return s>r&&(s=r=(this.leftBound+this.rightBound)/2),{min:s,max:r}}applyCornerPush(e,t,i=0,s=e.coordinateScale){if(e instanceof cs)return;if(this.orderedPhases){const l=t.pos.x===e.pos.x?e.facing:Math.sign(t.pos.x-e.pos.x);e.cornerPush=Math.fround(i*s*l),e.cornerPushTarget=e.cornerPush?t:null,e.cornerPushSide=l,e.cornerPush?this.cornerPushActors.add(e):this.cornerPushActors.delete(e);return}if(!i||t.screenBound===!1)return;const{min:r,max:a}=this.horizontalLimits(t),o=t.pos.x===e.pos.x?e.facing:Math.sign(t.pos.x-e.pos.x);(o>0?t.pos.x<a-.01:t.pos.x>r+.01)||(e.cornerPush=i*s*o)}advanceCornerPush(e){for(const t of this.cornerPushActors){if(!t.cornerPush||t.destroyed){this.cornerPushActors.delete(t),t.cornerPushTarget=null;continue}if(e.has(t)||t._hitPausedThisTick)continue;const i=t.cornerPushTarget;if(i&&!i.destroyed&&i.screenBound!==!1){const{min:s,max:r}=this.horizontalLimits(i);(t.cornerPushSide>0?i.pos.x>=r:i.pos.x<=s)&&(t.pos.x=Math.fround(t.pos.x+t.cornerPush))}t.cornerPush=Math.fround(t.cornerPush*Math.fround(.7)),Math.abs(t.cornerPush)<t.coordinateScale&&(t.cornerPush=0),t.cornerPush||(t.cornerPushTarget=null,this.cornerPushActors.delete(t))}}constrainPositions({push:e=!0}={}){const t=this.entities,i=new Map(t.map(o=>[o,this.horizontalLimits(o)])),s=o=>{if(o.screenBound!==!1){const{min:l,max:c}=i.get(o);o.pos.x=Math.max(l,Math.min(c,o.pos.x))}};if(t.forEach(s),!this.pushboxes||!e)return!1;let r=!1;const a=t.filter(o=>o.playerPush!==!1).sort((o,l)=>o.id-l.id);for(let o=0;o<a.length;o++)for(let l=o+1;l<a.length;l++){const c=a[o],d=a[l];if(c.teamSide===d.teamSide)continue;const f=c.pos.y-Jn(c,"size.height",60)*It(c),h=d.pos.y-Jn(d,"size.height",60)*It(d);if(f>=d.pos.y||h>=c.pos.y||!hs(Ui(c,"clsn2"),Ui(d,"clsn2")))continue;const[u,p]=c.pos.x<=d.pos.x?[c,d]:[d,c],x=this.bodyWidth(u,1),m=this.bodyWidth(p,-1);for(let v=0;v<(this.orderedPhases?2:1);v++){const y=u.pos.x+x,T=p.pos.x-m,R=this.orderedPhases?Math.fround(Math.fround(y)-Math.fround(T)):u.pos.x+x-p.pos.x+m;if(R<=0||v&&!hs(Ui(c,"clsn2"),Ui(d,"clsn2")))break;const S=u.screenBound===!1?1/0:Math.max(0,u.pos.x-i.get(u).min),M=p.screenBound===!1?1/0:Math.max(0,i.get(p).max-p.pos.x),g=Math.min(R/2,S),_=Math.min(R-g,M),L=u.pos.x,E=p.pos.x;if(u.pos.x-=Math.min(R-_,S),p.pos.x+=_,this.orderedPhases&&(u.pos.x=Math.fround(u.pos.x),p.pos.x=Math.fround(p.pos.x)),s(u),s(p),r=!0,u.pos.x===L&&p.pos.x===E)break}}return r}}const Ze=(n,e,t="")=>`
[Statedef ${n}]
${e}
${t}
`,we=(n,e,t="1")=>`
[State 0, ${n}]
type = ${n}
trigger1 = ${t}
${e}
`,Je=(n,e,t=1)=>we("ChangeState",`value = ${n}
ctrl = ${t}`,e),$e=(n,e="time = 0")=>we("ChangeAnim",`value = ${n}`,`(${e}) && selfanimexist(${n})`);function ph({orderedPhases:n=!1}={}){return[Ze(0,`type = S
movetype = I
physics = S
ctrl = 1`,$e(0,"anim != 0")+we("VelSet","y = 0","time = 0")+(n?we("VelSet","x=0","time>=4 || abs(vel x)<const(movement.stand.friction.threshold)"):"")),Ze(10,`type = C
movetype = I
physics = C`+(n?`
velset=0,0`:""),$e(10)+Je(11,"animtime = 0 || !selfanimexist(10)")),Ze(11,`type = C
movetype = I
physics = C
ctrl = 1`,$e(11)),Ze(12,`type = S
movetype = I
physics = S`,$e(12)+Je(0,"animtime = 0 || !selfanimexist(12)")),Ze(20,`type = S
movetype = I
physics = S
ctrl = 1`,we("VelSet","x = const(velocity.walk.fwd.x)",'command = "holdfwd"')+we("VelSet","x = const(velocity.walk.back.x)",'command = "holdback"')+$e(20,"vel x > 0 && anim != 20")+$e(21,"vel x < 0 && anim != 21")),Ze(40,`type = S
movetype = I
physics = S
ctrl = 0`,$e(40)+we("VelSet",`x = ifelse(command = "holdfwd", const(velocity.jump.fwd.x), ifelse(command = "holdback", const(velocity.jump.back.x), const(velocity.jump.neu.x)))
y = const(velocity.jump.y)`,"animtime = 0 || !selfanimexist(40)")+Je(50,"animtime = 0 || !selfanimexist(40)")),Ze(45,`type = A
movetype = I
physics = A
ctrl = 1`,we("VelSet",`x = ifelse(command = "holdfwd", const(velocity.airjump.fwd.x), ifelse(command = "holdback", const(velocity.airjump.back.x), const(velocity.airjump.neu.x)))
y = const(velocity.airjump.y)`,"time = 0")+Je(50,"time > 0")),Ze(50,`type = A
movetype = I
physics = A
ctrl = 1`,$e("ifelse(vel x = 0, 41, ifelse(vel x > 0, 42, 43))")+Je(52,"pos y >= 0 && vel y > 0",0)),Ze(51,`type = A
movetype = I
physics = A`),Ze(52,`type = S
movetype = I
physics = S
ctrl = 0`+(n?`
velset=0,0
anim=47`:""),$e(47)+we("PosSet","y = 0","time = 0")+we("VelSet","y = 0","time = 0")+(n?we("CtrlSet","value=1","time>=3"):"")+Je(0,"time >= 3 && (animtime = 0 || !selfanimexist(47))")),Ze(100,`type = S
movetype = I
physics = `+(n?"S":"N")+`
ctrl = 1`,$e(100)+we("VelSet","x = const(velocity.run.fwd.x)")+we("AssertSpecial",`flag = nowalk
flag2 = noautoturn`)+Je(0,'command != "holdfwd"')),Ze(105,`type = A
movetype = I
physics = A
ctrl = 0`,$e(105)+(n?we("CtrlSet","value=1","time>=2"):"")+we("VelSet",`x = const(velocity.run.back.x)
y = const(velocity.run.back.y)`,"time = 0")+Je(n?106:52,"pos y >= 0 && vel y > 0",0)),...n?[Ze(106,`type=S
movetype=I
physics=S
ctrl=0`,$e(47)+we("PosSet","y=0")+we("VelSet","y=0")+we("VelSet","x=0","abs(vel x)<const(movement.stand.friction.threshold)")+Je(0,"time>=7"))]:[],...n?[Ze(120,`type=U
movetype=I
physics=U
ctrl=1`,$e("ifelse(statetype=A,122,ifelse(statetype=C,121,120))")+we("VelSet",`x=0
y=0`,"statetype!=A")+we("ChangeState",`value=ifelse(statetype=A,50,ifelse(statetype=C,11,0))
ctrl=1`,'command!="holdback"')+we("ChangeState",`value=ifelse(statetype=A,132,ifelse(statetype=C,131,130))
ctrl=1`,"animtime=0 || !selfanimexist(ifelse(statetype=A,122,ifelse(statetype=C,121,120)))")),Ze(140,`type=U
movetype=I
physics=U
ctrl=1`,$e("ifelse(statetype=A,142,ifelse(statetype=C,141,140))")+we("ChangeState",`value=ifelse(statetype=A,50,ifelse(statetype=C,11,0))
ctrl=1`,'animtime=0 || command!="holdback"'))]:[],...[[120,"S",130],[130,"S",130],[131,"C",131],[132,"A",132],[140,"S",130]].filter(([e])=>!n||e!==120&&e!==140).map(([e,t,i])=>Ze(e,`type = ${t}
movetype = I
physics = ${t}
ctrl = 1${t==="A"?"":`
velset = 0,0`}`,$e(i)+(n?Je(140,"!inguarddist"):"")+Je(t==="A"?50:t==="C"?11:0,'command != "holdback"'))),...[[150,"S",150,151],[152,"C",151,153],[154,"A",152,155]].map(([e,t,i,s])=>Ze(e,`type=${t}
movetype=H
physics=N
ctrl=0
velset=0,0`,$e(i)+Je(s,"hitshakeover",0))),...[[151,"S",150],[153,"C",151],[155,"A",152]].map(([e,t,i])=>Ze(e,`type=${t}
movetype=H
physics=${t==="A"?"N":t}
ctrl=0`,$e(i)+we("HitVelSet",`x=1
y=1`,"time=0")+we("CtrlSet","value=1","time>=gethitvar(ctrltime)")+(t==="A"?we("Gravity","")+Je(52,"pos y>=0 && vel y>0",0)+Je(132,"time>=gethitvar(ctrltime)"):we("VelSet","x=0","time>=gethitvar(slidetime)||hitover")+we("StateTypeSet",`statetype=C
physics=C`,'command="holddown"')+we("StateTypeSet",`statetype=S
physics=S`,'command!="holddown"')+we("ChangeState",`value=${n?"ifelse(inguarddist,ifelse(statetype=C,131,130),140)":"ifelse(statetype=C,131,130)"}
ctrl=1`,"hitover")))),...[[5e3,"S","ifelse(gethitvar(groundtype)=2,5010,5000)"],[5010,"C","5020"],[5020,"A","5030"]].map(([e,t,i])=>{const s="5030+gethitvar(animtype)",r="5050+gethitvar(animtype)-3",a=n?`ifelse(gethitvar(animtype)>=3,ifelse(gethitvar(animtype)=3,5030,ifelse(selfanimexist(${r}),${r},5030)),ifelse((gethitvar(fall)||gethitvar(yvel)!=0)&&selfanimexist(${s}),${s},${i}+gethitvar(animtype)))`:`ifelse(gethitvar(animtype)>=3,5030,${i}+gethitvar(animtype))`;return Ze(e,`type=${t}
movetype=H
physics=N
ctrl=0
velset=0,0`,we("ChangeAnim",`value=${a}`,`time=0 && selfanimexist(${a})`)+(n?we("StateTypeSet","statetype=A","gethitvar(yvel)!=0 || pos y!=0"):"")+we("ChangeState",`value=${t==="A"?"5030":`ifelse(gethitvar(fall)||gethitvar(yvel)!=0||pos y!=0,5030,${e+1})`}
ctrl=0`,"hitshakeover"))}),...[[5001,"S"],[5011,"C"]].map(([e,t])=>Ze(e,`type=${t}
movetype=H
physics=${t}
ctrl=0`,(n?$e("anim"):"")+we("HitVelSet","x=1","time=0")+we("VelMul","x=.6","time>=gethitvar(slidetime)")+(n?$e("anim+5","animtime=0 && (anim=[5000,5002] || anim=[5010,5012] || anim=[5020,5022])"):"")+we("VelSet","x=0","hitover")+we("DefenceMulSet","value=1","hitover")+Je(0,"hitover"))),...[5030,5035].map(e=>{const t=we("VelAdd","y=gethitvar(yaccel)",e===5030?"time>0":n?"time>0 || prevstateno!=5030":"1"),i=we("ChangeState",`value=ifelse(gethitvar(fall),5050,5040)
ctrl=0`,"hitover || (vel y>0 && pos y>=0)")+(e===5030?n?we("ChangeState",`value=ifelse(anim=[5050,5059],5050,5035)
ctrl=0`,"animtime=0"):Je(5035,"animtime=0",0):we("ChangeState",`value=ifelse(gethitvar(fall),5050,5040)
ctrl=0`,"animtime=0 || !selfanimexist(5035)"));return Ze(e,`type=A
movetype=H
physics=N
ctrl=0`,(e===5030?(n?$e("ifelse(gethitvar(fall),anim,5030)"):"")+we("HitVelSet",`x=1
y=1`,"time=0"):$e(5035))+t+i)}),Ze(5040,`type=A
movetype=H
physics=N
ctrl=1`,$e(5040)+we("VelAdd","y=gethitvar(yaccel)")+Je(5050,"!alive",0)+Je(52,"pos y>=0 && vel y>0",0)+Je(50,"animtime=0 || !selfanimexist(5040)")),Ze(5050,`type=A
movetype=H
physics=N
ctrl=0`,(n?$e("5050+ifelse(gethitvar(animtype)>=3,gethitvar(animtype)-3,0)","(time=0 && anim=5030 && animtime=-1) || (animtime=0 && (anim<5050 || anim>5069))")+$e("anim+10","vel y>Const240p(-2) && anim=[5051,5052]"):$e(5050))+we("SelfState","value=5210",'alive && CanRecover && command="recovery"')+Je(5100,n?"vel y>0 && pos y>=ifelse(anim=5050 || anim=5035,const(movement.air.gethit.groundlevel),0)":"pos y>=0 && vel y>0",0)+we("VelAdd","y=gethitvar(yaccel)",n?"time>0 || (prevstateno!=5030 && prevstateno!=5035)":"1")),Ze(5070,`type=A
movetype=H
physics=N
ctrl=0
velset=0,0`,$e(5070)+Je(5071,"hitshakeover",0)),Ze(5071,`type=A
movetype=H
physics=N
ctrl=0`,(n?$e("anim"):"")+we("HitVelSet",`x=1
y=1`,"time=0")+we("VelAdd","y=gethitvar(yaccel)",n?"time>0":"1")+Je(5110,"vel y>0 && pos y>=const(movement.air.gethit.trip.groundlevel)",0)),Ze(5080,`type=L
movetype=H
physics=N
ctrl=0
velset=0,0`,$e(5080)+Je(5030,"hitshakeover && gethitvar(yvel)!=0",0)+Je(5081,"hitshakeover && gethitvar(yvel)=0",0)),Ze(5081,`type=L
movetype=H
physics=C
ctrl=0`,we("HitVelSet","x=1","time=0")+we("VelSet","x=0","hitover")+Je(5110,"hitover",0)),Ze(5100,`type = L
movetype = H
physics = N
ctrl = 0`+(n?"":`
velset = 0,0`),we("PosSet","y = 0")+(n?we("PosFreeze","value=1")+we("VelMul","x=.75","time=0")+we("VelSet","y=0","time=0"):"")+we("HitFallDamage","",n?"time=3":"time=0")+we("FallEnvShake","","time=0")+$e(n?"ifelse(selfanimexist(5100+ifelse(gethitvar(animtype)>=3,gethitvar(animtype)-3,0)),5100+ifelse(gethitvar(animtype)>=3,gethitvar(animtype)-3,0),5100)":5100)+Je(5110,"time>=1 && gethitvar(fall.yvel)=0",0)+Je(5101,"time>=1 && (animtime=0 || time>=12 || !selfanimexist(5100))",0)),Ze(5101,`type=L
movetype=H
physics=N
ctrl=0`,$e(5160)+we("HitFallVel","","time=0")+we("PosSet","y=const(movement.down.bounce.offset.y)","time=0")+we("PosAdd","x=const(movement.down.bounce.offset.x)","time=0")+(n?we("PosFreeze","value=1","time=0"):"")+we("VelAdd","y=const(movement.down.bounce.yaccel)",n?"time>0":"1")+Je(5110,"time>0 && vel y>0 && pos y>=const(movement.down.bounce.groundlevel)",0)),Ze(5110,`type = L
movetype = H
physics = N
ctrl = 0`,we("PosSet","y=0","time=0")+we("VelSet","y=0","time=0")+(n?$e("ifelse(selfanimexist(5170),5170,5110)")+$e(5110,"animtime=0 && anim!=5110")+we("VelMul","x=const(movement.stand.friction)")+we("VelSet","x=0","abs(vel x)<const(movement.down.friction.threshold)"):$e(5110))+Je(5150,"!alive",0)+Je(5120,"time>=1 && gethitvar(recovertime)<=0",0)),Ze(5120,(n?`type=L
physics=N`:`type=S
physics=S`)+`
movetype=I
ctrl=0`,$e(5120)+we("SelfState",`value=0
ctrl=1`,"animtime = 0 || !selfanimexist(5120)")),Ze(5150,`type = L
movetype = H
physics = N
ctrl = 0
velset = 0,0`,$e(5110)),Ze(5210,`type=A
movetype=I
physics=N
ctrl=0`,$e(5210)+we("PosFreeze","value=1","time<4")+we("VelMul",n?`x=const(velocity.air.gethit.airrecover.mul.x)
y=const(velocity.air.gethit.airrecover.mul.y)`:`x=.5
y=.2`,"time=4")+we("VelAdd",n?`x=const(velocity.air.gethit.airrecover.add.x)
y=const(velocity.air.gethit.airrecover.add.y)`:"y=Const240p(-4.5)","time=4")+we("NotHitBy","value=SCA",n?"time<20":"time<4")+(n?we("VelAdd","y=const(movement.air.gethit.airrecover.yaccel)","time>=4")+we("CtrlSet","value=1","time>=20")+Je(52,"pos y>=0 && vel y>0",0):Je(50,"time>=4")))].join(`
`)}ph();function Ja(n=""){if(n=String(n).toUpperCase(),n==="S"||n==="SUB")return{mode:"subtract",source:1,destination:1};if(n==="A"||n==="ADD")return{mode:"add",source:1,destination:1};if(n==="A1"||n==="ADD1")return{mode:"add",source:1,destination:.5};const e=/^AS([\d.]+)D([\d.]+)$/.exec(n);return e?{mode:"add",source:Math.max(0,Math.min(256,+e[1]))/256,destination:Math.max(0,Math.min(256,+e[2]))/256}:{mode:"normal",source:1,destination:0}}function Jf(n=0,e=0,t=0){const i=d=>{if(typeof d!="number"||!Number.isFinite(d))throw Error("Sprite angles must be finite numbers.");const f=d%360*Math.PI/180,h=u=>Math.abs(u)<1e-12?0:Math.abs(1-Math.abs(u))<1e-12?Math.sign(u):u;return[h(Math.cos(f)),h(Math.sin(f))]},[s,r]=i(n),[a,o]=i(e),[l,c]=i(t);return{a:l*s,b:o*c*s-a*r,c:l*r,d:a*s+o*c*r}}function ja(n,e,t=0){var l;const i=n==null?void 0:n.frames[e];if(!i)return null;if(!((l=i.interpolate)!=null&&l.length)||i.ticks<=0)return i;const s=n.frames[e+1]||n.frames[n.loopStart||0];if(!s)return i;const r=Math.max(0,Math.min(1,t/i.ticks)),a={...i},o=(c,d)=>c+(d-c)*r;for(const c of i.interpolate)if(c==="offset"&&(a.x=o(i.x,s.x),a.y=o(i.y,s.y)),c==="scale"&&(a.scaleX=o(i.scaleX??1,s.scaleX??1),a.scaleY=o(i.scaleY??1,s.scaleY??1)),c==="angle"&&(a.angle=o(i.angle||0,s.angle||0)),c==="blend"){const d=Ja(i.blend),f=Ja(s.blend);d.mode==="add"&&f.mode==="add"&&(a.blend=`AS${o(d.source,f.source)*256}D${o(d.destination,f.destination)*256}`)}return a}function mh(n){var r;const e=ja(n.collisionAnimation??n.animation??((r=n.animations)==null?void 0:r.get(n.anim)),n.collisionFrameIndex??n.frameIndex,n.collisionFrameTime??n.frameTime)??n.collisionFrame??n.currentFrame;if(!e)return null;const t=lh(n);if(t===n)return e;const i=(a,o)=>{var l,c;return((c=(l=a.program)==null?void 0:l.constants)==null?void 0:c.get(o))??1},s=(a,o)=>{const l=It(n)*i(n,o);return l?(e[a]||0)*It(t)*i(t,o)/l:0};return{...e,x:s("x","size.xscale"),y:s("y","size.yscale")}}function Vl(n,e,t,i,s,r,a=256){if(!i)return[0];if(!Number.isFinite(t)||t<=0||!Number.isFinite(e)||e<=0)return[];let o=i===1?Math.floor((s-n-e)/t):0,l=i===1?Math.ceil((r-n)/t):Math.max(0,Math.trunc(i)-1);return Math.max(0,l-o+1)>a&&(l=o+a-1),Array.from({length:Math.max(0,l-o+1)},(d,f)=>o+f)}function Vs(n,e,t=0){return n.animated?n.spacing[t]:e+n.spacing[t]}function Wl(n,e,t,i,s=0){const r=i>1?t/(i-1):0,a=n.width?n.width[0]/e:n.xscale[0],o=n.width?n.width[1]/e:n.xscale[1],l=a+(o-a)*r,c=n.yScaleStart+s*n.yScaleDelta;return{x:n.width?l:1,delta:n.width?a?l/a:1:l,y:c>0?1/c:0}}const jf=(n,e)=>Array.isArray(n)?n.slice(0,3).map((t,i)=>Number(t??e[i])):[...e],Qf=(n,e=0,t=255)=>Math.max(e,Math.min(t,n)),In=(n,e={})=>({...e,...n,age:0,remaining:n.time??e.time??1}),Yt=n=>n&&(n.remaining<0||n.remaining>0);function fa(n){n&&(n.age++,n.remaining>0&&n.remaining--)}class ed{constructor(){this.palettes=new Map,this.afterimages=new Map,this.all=null,this.background=null,this.shake=null,this.environment=null,this.diagnostics=[]}advance({paused:e=()=>!1,backgroundPaused:t=!1}={}){for(const[i,s]of this.palettes)e(i)||fa(s),Yt(s)||this.palettes.delete(i);for(const[i,s]of this.afterimages)e(i)||fa(s),Yt(s)||this.afterimages.delete(i);if(!t)for(const i of[this.all,this.background,this.shake,this.environment])fa(i)}consume(e,{entity:t}={}){for(const i of e||[]){const s=String(i.type).toLowerCase();if(s==="palfx"&&t){const r=vr(t),a=In(xr(i));Yt(a)?this.palettes.set(r,a):this.palettes.delete(r)}else if(s==="allpalfx")this.all=In(xr(i));else if(s==="bgpalfx")this.background=In(xr(i));else if(s==="envshake"){const r=i.coordinateScale??(t==null?void 0:t.coordinateScale)??1;this.shake=In(i,{time:0,freq:60,ampl:-4/r,phase:i.freq>=90?90:0,coordinateScale:r})}else if(s==="envcolor")this.environment=In(i,{value:[255,255,255],under:0});else if(s==="palettesnapshot"&&i.target)i.target.paletteSnapshot={layers:[],key:"[]"};else if(s==="afterimage"&&t){const r=In(i,{time:1,length:20,timegap:1,framegap:4,palcolor:256,palbright:[30,30,30],palcontrast:[120,120,220],palpostbright:[0,0,0],paladd:[10,10,25],palmul:[.65,.65,.75],trans:"none"});r.length=Qf(Math.trunc(r.length),0,60),r.timegap=Math.max(1,Math.trunc(r.timegap)),r.framegap=Math.max(1,Math.trunc(r.framegap)),r.frames=[],Yt(r)&&r.length?this.afterimages.set(t,r):this.afterimages.delete(t)}else if(s==="afterimagetime"&&this.afterimages.has(t)){const r=this.afterimages.get(t);r.remaining=i.time??i.value??0,Yt(r)||this.afterimages.delete(t)}}}capture(e,{paused:t=()=>!1}={}){for(const i of e){const s=this.afterimages.get(i);if(!Yt(s)||t(i)||s.age%s.timegap!==0||s.lastAge===s.age)continue;const r=mh(i);r&&(s.lastAge=s.age,s.frames.unshift({entity:i,frame:{...r},pos:{...i.pos},facing:i.facing,coordinateScale:It(i),character:i.character,drawScale:{...i.drawScale},drawOffset:{...i.drawOffset},angle:i.angleDraw?i.angle:0,sizeX:i.constant("size.xscale"),sizeY:i.constant("size.yscale"),paletteRemaps:new Map(i.paletteRemaps)}),s.frames.length=Math.min(s.frames.length,s.length))}}paletteFor(e,{ownpal:t=(e==null?void 0:e.ownPal)??(e==null?void 0:e.ownpal),ignoreLocal:i=!1,includeAll:s=!0}={}){const r=i?null:t?e:vr(e),a=this.palettes.get(r);let o=Yt(a)?[a]:[];return o=[...o,...s&&Yt(this.all)?[this.all]:[]].map(l=>Object.fromEntries(Object.entries(l).map(([c,d])=>[c,Array.isArray(d)?[...d]:d]))),{layers:o,key:JSON.stringify(o.map(({add:l,mul:c,sinadd:d,color:f,invertall:h,age:u})=>({add:l,mul:c,sinadd:d,color:f,invertall:h,age:d?u:0})))}}get backgroundPalette(){const e=[this.background,this.all].filter(Yt);return{layers:e,key:JSON.stringify(e)}}get cameraOffset(){if(!Yt(this.shake))return{x:0,y:0};const e=this.shake;return{x:0,y:-Number(e.ampl)*e.coordinateScale*Math.sin((Number(e.phase)+e.age*Number(e.freq))*Math.PI/180)}}get environmentColor(){return Yt(this.environment)?this.environment:null}trailsFor(e){const t=this.afterimages.get(e);if(!Yt(t))return[];const i=[];for(let s=0;s<t.frames.length;s+=t.framegap){const r=[{color:t.palcolor,invertall:t.palinvertall,add:t.palbright,mul:t.palcontrast,postadd:t.palpostbright}];for(let a=0;a<s;a++)r.push({add:t.paladd,mul:jf(t.palmul,[1,1,1]).map(o=>o*256)});Yt(this.all)&&r.push(this.all),i.push({...t.frames[s],palette:{layers:r,key:JSON.stringify(r)},trans:t.trans})}return i.reverse()}cleanup(e,{paletteOwners:t=e}={}){const i=new Set(e),s=new Set;for(const r of t){const a=vr(r);a&&s.add(a)}for(const r of this.palettes.keys())s.has(r)||this.palettes.delete(r);for(const r of this.afterimages.keys())i.has(r)||this.afterimages.delete(r)}}const ke=127,Ve=125,$n=124,td=new Set("time stateno prevstateno anim animtime ctrl life lifemax power powermax facing alive gametime hitpausetime hitshakeover hitover movecontact movehit moveguarded movereversed hitcount uniqhitcount numenemy numpartner numproj roundstate roundno matchno teamside teampower tickspersecond ailevel palno id win lose drawgame inguarddist canrecover roundsexisted hitfall ishometeam winko wintime winperfect loseko losetime loseperfect".split(" ")),id=new Set("pos x|pos y|vel x|vel y|p2dist x|p2dist y|p2bodydist x|p2bodydist y|parentdist x|parentdist y|rootdist x|rootdist y|screenpos x|screenpos y|hitvel x|hitvel y|camerapos x|camerapos y|camerazoom|gamewidth|gameheight|screenwidth|screenheight|leftedge|rightedge|topedge|bottomedge|frontedge|backedge|frontedgedist|backedgedist|frontedgebodydist|backedgebodydist".split("|")),nd=new Set("var sysvar animelemtime animelemno animexist selfanimexist numprojid playeridexist projcanceltime projcontacttime projguardedtime projhittime numhelper numexplod numtarget ishelper".split(" ")),sd=new Set(["fvar","sysfvar","const240p","const480p","const720p"]),rd=new Set("name authorname p1name p2name p3name p4name statetype movetype physics p2statetype p2movetype teammode".split(" ")),ad=new Set("xveladd yveladd xoff yoff zoff xvel yvel yaccel fall.xvel fall.yvel fall.envshake.freq fall.envshake.phase".split(" ")),Ur=["sin","cos","tan","asin","acos","atan","exp","ln"],od=new TextEncoder,xi=n=>{const e=[];do{const t=n&127;n>>>=7,e.push(t|(n?128:0))}while(n);return e},ld=n=>{n|=0;const e=[];for(;;){const t=n&127;n>>=7;const i=n===0&&!(t&64)||n===-1&&!!(t&64);if(e.push(t|(i?0:128)),i)return e}},da=n=>{const e=od.encode(n);return[...xi(e.length),...e]},pn=n=>[...xi(n.length),...n.flat()],us=(n,e)=>[n,...xi(e.length),...e],si=n=>[65,...ld(n)],Qa=n=>{const e=new Uint8Array(4);return new DataView(e.buffer).setFloat32(0,n,!0),[67,...e]},pa=[68,0,0,0,0,0,0,0,0],qn=n=>[16,...xi(n)],ri=n=>[32,...xi(n)],Dn=n=>[33,...xi(n)],ui=(n,e)=>n.type===e?n.code:[...n.code,n.type===ke?e===Ve?178:183:187],Ws=n=>n.type===ke?[...n.code,69,69]:[...n.code,...Qa(0),92],fs=n=>[...n,...qn(2)],ct=(n,e)=>({type:n,code:e});class nn extends Error{}class ds extends Error{}class cd{constructor(e){this.trigger=e,this.locals=[]}local(e){return this.locals.push(e),this.locals.length-1}read(e,t=[]){const i=id.has(e)||sd.has(e)?Ve:td.has(e)||nd.has(e)?ke:null;if(!i||t.length>2)throw new nn;const s=[...si(this.trigger(e)),...si(t.length)];for(let r=0;r<2;r++)s.push(...t[r]?ui(this.node(t[r]),$n):pa);return s.push(...qn(i===ke?0:1)),ct(i,s)}literal(e,t=ke){return ct(t,[...si(this.trigger(e)),...si(0),...pa,...pa,...qn(t===ke?0:1)])}node(e){var t;if(e.kind==="number"){if(e.float&&!Number.isFinite(Math.fround(e.value)))throw new nn;return ct(e.float?Ve:ke,e.float?Qa(e.value):si(e.value))}if(e.kind==="name")return e.name==="pi"||e.name==="e"?ct(Ve,Qa(e.name==="pi"?Math.PI:Math.E)):this.read(e.name);if(e.kind==="unary"){const i=this.node(e.value);if(e.op==="+")return i;if(e.op==="!")return ct(ke,[...Ws(i),69]);if(e.op==="-")return ct(i.type,i.type===ke?[...si(0),...i.code,107]:[...i.code,140]);if(e.op==="~"&&i.type===ke)return ct(ke,[...i.code,...si(-1),115]);throw new nn}if(e.kind==="legacyanim")return this.binary(e.op,this.read("animelemtime",[e.element]),this.node(e.time));if(e.kind==="legacytime"){if(e.divisor.value<=0)throw new nn;return this.binary(e.op,this.binary("%",this.read("time"),this.node(e.divisor)),this.node(e.remainder))}if(e.kind==="range"){const i=[this.node(e.left),this.node(e.low),this.node(e.high)],s=i.some(l=>l.type===Ve)?Ve:ke,r=i.map(()=>this.local(s)),a=[];i.forEach((l,c)=>a.push(...ui(l,s),...Dn(r[c])));const o=l=>ct(s,ri(r[l]));return a.push(...this.binary(e.includeLow?">=":">",o(0),o(1)).code,...this.binary(e.includeHigh?"<=":"<",o(0),o(2)).code,113),e.op==="!="&&a.push(69),ct(ke,a)}if(e.kind==="command"){const i=this.literal({name:"command",args:[e.command]});return e.op==="="?i:ct(ke,[...i.code,69])}if(e.kind==="legacyattribute"){const i=this.literal({name:"hitdefattr",args:e.attributes});return e.op==="="?i:ct(ke,[...i.code,69])}if(e.kind==="binary")return["=","!="].includes(e.op)&&e.left.kind==="name"&&rd.has(e.left.name)&&e.right.kind==="string"?this.literal({name:e.left.name,match:e.right.value,invert:e.op==="!="}):this.binary(e.op,this.node(e.left),this.node(e.right));if(e.kind==="call"){if(e.name==="cond"){const s=this.node(e.args[0]),r=this.node(e.args[1]),a=this.node(e.args[2]);if(r.type!==a.type)throw new nn;return ct(r.type,[...Ws(s),4,r.type,...r.code,5,...a.code,11])}if(["const","gethitvar"].includes(e.name)&&["name","string"].includes((t=e.args[0])==null?void 0:t.kind)){const s=e.args[0].name??e.args[0].value,r=e.name==="const"?/^(?:velocity\.|movement\.(?!airjump\.)|size\.[xy]scale$|data\.fall\.defence_mul$)/.test(s)?Ve:ke:ad.has(s)?Ve:ke;return this.literal({name:e.name,args:[s]},r)}const i=e.args.map(s=>this.node(s));if(e.name==="abs"){const s=i[0];if(s.type===Ve)return ct(Ve,[...s.code,139]);const r=this.local(ke);return ct(ke,[...s.code,...Dn(r),...ri(r),...si(0),72,4,ke,...si(0),...ri(r),107,5,...ri(r),11])}if(e.name==="min"||e.name==="max"){if(i.some(a=>a.type===Ve))return ct(Ve,[...ui(i[0],Ve),...ui(i[1],Ve),e.name==="min"?150:151]);const s=this.local(ke),r=this.local(ke);return ct(ke,[...i[0].code,...Dn(s),...i[1].code,...Dn(r),...ri(s),...ri(r),e.name==="min"?72:74,4,ke,...ri(s),5,...ri(r),11])}return e.name==="ceil"||e.name==="floor"?ct(ke,[...ui(i[0],Ve),e.name==="ceil"?141:142,187,...qn(3)]):e.name==="sqrt"?ct(Ve,fs([...ui(i[0],Ve),145])):Ur.includes(e.name)?ct(Ve,fs([...ui(i[0],Ve),...qn(4+Ur.indexOf(e.name))])):e.name==="log"?ct(Ve,fs([...ui(i[0],Ve),...ui(i[1],Ve),...qn(12)])):this.read(e.name,e.args)}throw new nn}binary(e,t,i){if(["&&","||","^^"].includes(e))return ct(ke,[...Ws(t),...Ws(i),e==="&&"?113:e==="||"?114:115]);const s=t.type===Ve||i.type===Ve?Ve:ke,r=[...ui(t,s),...ui(i,s)],a={"=":[70,91],"!=":[71,92],"<":[72,93],">":[74,94],"<=":[76,95],">=":[78,96]};if(a[e])return ct(ke,[...r,a[e][+(s===Ve)]]);const o={"+":[106,146],"-":[107,147],"*":[108,148]};if(o[e])return r.push(o[e][+(s===Ve)]),ct(s,s===Ve?fs(r):r);if(e==="/"){if(s===Ve)return ct(Ve,fs([...r,149]));const l=this.local(ke),c=this.local(ke);return ct(ke,[...t.code,...Dn(l),...i.code,...Dn(c),...ri(l),...si(-2147483648),70,...ri(c),...si(-1),70,113,4,ke,...si(-2147483648),5,...ri(l),...ri(c),109,11])}if(s===ke&&["%","&","|","^"].includes(e))return ct(ke,[...r,{"%":111,"&":113,"|":114,"^":115}[e]]);throw new nn}}function hd(n){const e=(a,o)=>[96,...pn(a.map(l=>[l])),1,o],t=[e([ke,ke,$n,$n],ke),e([ke,ke,$n,$n],Ve),e([Ve],Ve),e([$n],ke),e([Ve,Ve],Ve),e([],ke),e([],Ve)],i=[["readInt",0],["readFloat",1],["finite",2],["wrap",3],...Ur.map(a=>[a,2]),["log",4]].map(([a,o])=>[...da("host"),...da(a),0,...xi(o)]),s=n.map((a,o)=>[...da("e"+o),0,...xi(i.length+o)]),r=n.map(a=>{const o=[];for(const c of a.locals){const d=o.at(-1);(d==null?void 0:d[1])===c?d[0]++:o.push([1,c])}const l=[...pn(o.map(([c,d])=>[...xi(c),d])),...a.code,11];return[...xi(l.length),...l]});return new Uint8Array([0,97,115,109,1,0,0,0,...us(1,pn(t)),...us(2,pn(i)),...us(3,pn(n.map(a=>xi(a.type===ke?5:6)))),...us(7,pn(s)),...us(10,pn(r))])}class ud{constructor(e=[],{maxFunctions:t=4096,maxBytes:i=2*1024*1024}={}){if(!Number.isInteger(t)||t<0||t>16384||!Number.isInteger(i)||i<0||i>16*1024*1024)throw RangeError("Invalid numeric compilation budget.");this.context=null,this.entries=new Map,this.triggers=[],this.counts={wasm:0,interpreted:0,deoptimized:0,compiled:0,bytes:0};const s=new Map,r=[],a=[],o=h=>{const u=JSON.stringify(h);return s.has(u)||(s.set(u,this.triggers.length),this.triggers.push(typeof h=="string"?{name:h}:h)),s.get(u)};let l=0;for(const h of new Set(e))if(!(typeof h!="string"||!h.trim()||r.length>=t))try{const u=new cd(o),p=u.node(qo(h));if((l+=p.code.length)>i)break;a.push({source:h,type:p.type}),r.push({...p,locals:u.locals})}catch(u){if(!(u instanceof nn)&&!(u instanceof ht))throw u}if(!r.length)return;const c=(h,u,p,x,m)=>{if(typeof this.context.resolve!="function")throw new Gi("Trigger resolution is unavailable.");const v=this.triggers[h],y=this.context.resolve(v.name,v.args||(u===0?[]:u===1?[p]:[p,x]),null);let T=y;if(v.match!==void 0)if(y!=null&&y.absent)T=+v.invert;else if(typeof y=="string")T=+(y===v.match!=!!v.invert);else throw new ds;if(typeof y=="boolean")T=+y;else if(y&&typeof y.value=="number"){if(!m&&(y.type==="float"||y.float))throw new ds;T=y.value}if(typeof T!="number")throw new ds;if(!Number.isFinite(T))throw new Ct("Expression produced a non-finite number.");if(!m&&!Number.isInteger(T))throw new ds;if(m){if(T=Math.fround(T),!Number.isFinite(T))throw new Ct("Expression produced a non-finite number.");return T}return T|0},d={readInt:(...h)=>c(...h,!1),readFloat:(...h)=>c(...h,!0),finite:h=>{if(!Number.isFinite(h))throw new Ct("Expression produced a non-finite number.");return h},wrap:h=>h|0};for(const h of Ur)d[h]=Math[h==="ln"?"log":h];d.log=(h,u)=>Math.log(u)/Math.log(h),this.binary=hd(r);const f=new WebAssembly.Instance(new WebAssembly.Module(this.binary),{host:d});a.forEach((h,u)=>this.entries.set(h.source,{...h,run:f.exports["e"+u]})),this.counts.compiled=this.entries.size,this.counts.bytes=this.binary.length}evaluate(e,t={}){const i=this.entries.get(e);if(!i)return this.counts.interpreted++,(t.typedResult?Xa:Pr)(e,t);const s=this.context;this.context=t;try{const r=i.run();return this.counts.wasm++,t.typedResult?{value:r,float:i.type===Ve}:r}catch(r){if(r instanceof ds)return this.entries.delete(e),this.counts.deoptimized++,(t.typedResult?Xa:Pr)(e,t);throw r instanceof WebAssembly.RuntimeError?new Ct("Invalid numeric operation.",e):r instanceof ht?(r.source||(r.source=e),r):r!=null&&r.bottom?new Ct(r.message,e):new ht((r==null?void 0:r.message)||"Trigger evaluation failed.",e)}finally{this.context=s}}get stats(){return{...this.counts,activeFunctions:this.entries.size}}}function fd(n,{factor:e,scale:t,cameraX:i,cameraY:s,cropTop:r=0,displayHeight:a=240}){if(!n.window)return null;const[o,l,c,d]=n.window,f=n.windowCentered?0:1;if(c-o+f<=0||d-l+f<=0)return[];const h=n.windowCentered?480:(960-320*t)/2,u=(540-a*t)/2,p=h+(o*e-i*n.windowDelta[0])*t,x=u+(l*e-s*n.windowDelta[1]-r)*t;if(![p,x,(c-o+f)*e*t,(d-l+f)*e*t].every(Number.isFinite))return[];const m=Math.max(0,p),v=Math.max(0,x),y=Math.min(960,p+(c-o+f)*e*t),T=Math.min(540,x+(d-l+f)*e*t);return y>m&&T>v?[m,v,y-m,T-v]:[]}function dd(n,e,t,{x:i,y:s,sx:r,sy:a,cameraX:o,cameraY:l,deltaX:c,zoom:d,factor:f,clip:h=null}){if(h&&!h.length)return[];const u=(t.flip||"").includes("H")?-1:1,p=(t.flip||"").includes("V")?-1:1,x=r*(t.scaleX??1)*u;let m=a*(t.scaleY??1)*p;if(![i,s,x,m].every(Number.isFinite)||!x||!m)return[];let v={x:1,delta:1,y:1},y=v;if(n.type==="parallax"&&(v=Wl(n,e.w,0,e.h,l/f),y=Wl(n,e.w,e.h-1,e.h,l/f),a*=v.y,m*=v.y,!m||![v.x,y.x,v.delta,y.delta,m].every(Number.isFinite)))return[];const T=n.type==="parallax"&&n.width?e.w/2:e.x,R=(P,B)=>{const F=-o*c*d*(P.delta-1)/x,k=Vs(n,e.w)*P.x*Math.sign(x);return[T-T*P.x+F+B*k,T+(e.w-T)*P.x+F+B*k]};if(![...R(v,0),...R(y,0)].every(Number.isFinite))return[];const S=(h==null?void 0:h[0])??0,M=h?h[0]+h[2]:960,g=(h==null?void 0:h[1])??0,_=h?h[1]+h[3]:540,L=new Set;for(const P of[v,y]){const[B,F]=R(P,0),k=i+(t.x||0)*r+(Math.min(B*x,F*x)-T*x);for(const I of Vl(k,Math.abs((F-B)*x),Math.abs(Vs(n,e.w)*P.x*x),n.tile[0],S,M))L.add(I)}const E=Vs(n,e.h,1)*Math.abs(m),A=s+(t.y||0)*a,U=Vl(Math.min(A-e.y*m,A+(e.h-e.y)*m),e.h*Math.abs(m),E,n.tile[1],g,_),N=[];for(const P of U)for(const B of L){if(N.length>=8192)return N;const F=n.type==="parallax"?[...R(v,B),...R(y,B)]:null,k=F?0:B*Vs(n,e.w)*Math.abs(x);N.push({x:i+k,y:s+P*E,sx:r,sy:a,axisX:T,warp:F,clip:h})}return N}const Xl=ph({orderedPhases:!0});function pd(n){const e=new Set;for(const t of n){for(const i of t.zssExpressions||[])e.add(i);for(const i of t.states.values())for(const s of[i,...i.controllers])for(const r of s.entries){e.add(r.value);try{for(const a of Hi(r.value))e.add(a)}catch{}}}return e}const md=(n,e)=>{const t={entity:e};for(const[i,s]of Object.entries(n))(s===null||["number","string","boolean"].includes(typeof s)||Array.isArray(s))&&(t[i]=s);return t},Xs=(n,e,t=0)=>{try{return n.constant(e)}catch{return t}};class gd{constructor(e,t={}){this.files=e,this.selection=t,this.characters=Ru(e);const i=this.characters.find(o=>o.path===t.character)||this.characters[0],s=this.characters.find(o=>o.path===t.opponent)||i;if(!i||!s)throw Error("No playable character definition found.");const r=new Map([...new Set([i,s])].map(o=>[o,dh(o,{commonText:Xl,constantsFromCnsOnly:!0})]));for(const o of r.values()){const l=o.diagnostics.find(c=>c.fatal);if(l)throw Error(`${l.source}:${l.line}: ${l.message}`)}this.expressions=new ud(pd(r.values())),this.commands=[i,s].map(o=>{var c;const l=(c=o.checks.find(d=>d.key==="cmd"&&d.ok))==null?void 0:c.path;return new Es(Yo(l?An(e[l]):""))});const a=t.stage&&t.stage!=="builtin/grid"?If(e).find(o=>o.path===t.stage):null;if(a!=null&&a.invalid)throw Error("Stage definition could not be parsed.");this.match=new Zf(i,{opponentCharacter:s,commonText:Xl,programs:r,manageInputs:!0,orderedPhases:!0,expressionEvaluator:(o,l)=>this.expressions.evaluate(o,l),stage:a,playerPalette:t.palette||1,opponentPalette:t.opponentPalette||2,skipIntro:t.mode==="training",playerAILevel:t.mode==="cpu"?t.level||4:0,opponentAILevel:["solo","cpu"].includes(t.mode)?t.level||4:0,rules:t.mode==="training"?null:{roundsToWin:2,preIntro:0,introHold:30}}),this.commands=[this.match.inputBuffers.get(this.match.player),this.match.inputBuffers.get(this.match.opponent)],this.effects=new ed,this.banks=new Map,this.indices=new Map,this.bankIds=new Map,this.spriteMetadata=new Map,this.sent=new Set,this.assets=[],this.events=[],this.sparks=[],this.issues=new Map,this.closed=!1,this.capabilities={format:"kenjatime-core-coverage-v1",engine:"Kenjatime Core",independentRuntime:!0,universalCompatibility:!1,compiledNumericExpressions:!0,scriptInterpreter:!0,knownGaps:["Lua state scripts, extended global states and newer ZSS extensions","3D model stages and model shadows","Video background composition","Advanced stage camera offsets and mixed-coordinate camera parity","Afterimage palette chains beyond eight layers","Unverified character families and extended controller combinations"]}}issue(e,t){const i=e+":"+t;this.issues.size<2e3&&this.issues.set(i,{type:e,message:t})}tick(e=new Set,t=new Set){if(this.closed)throw Error("Match is closed.");const i=this.match,s=r=>i.isFrozen(r)||r.hitPauseTime>0;this.effects.advance({paused:s}),i.tick(new Set,new Set,{playerInput:e,opponentInput:t}),this.commands=[i.inputBuffers.get(i.player),i.inputBuffers.get(i.opponent)];for(const r of i.eventEntities){this.effects.consume(r.events,{entity:r});for(const a of r.events)["playsnd","stopsnd","sndpan"].includes(a.type)&&this.events.push({...md(a,r.id),character:r.character.path})}for(const r of i.presentationEvents)this.effects.consume([r],{entity:r.entity||r.owner});for(const r of i.events)this.sparks.push({x:r.x,y:r.y,age:0,guarded:r.guarded});return this.sparks=this.sparks.filter(r=>++r.age<12),this.sparks.length>256&&this.sparks.splice(0,this.sparks.length-256),this.effects.capture([...i.entities,...i.drawProjectiles],{paused:s}),this.effects.cleanup(i.entities),this}bank(e){var t;if(!this.banks.has(e)){const i=(t=e.def)!=null&&t.files?jc(e):Zc(e.files[e.sprite.path]);this.banks.set(e,i),this.bankIds.set(e,this.banks.size),this.indices.set(e,new Map(i.sprites.map((s,r)=>[s.group+","+s.number,r])))}return this.banks.get(e)}asset(e,t,i){var s,r;try{const a=this.bank(e),o=this.indices.get(e).get(t.group+","+t.number);if(o===void 0)return null;const l=this.bankIds.get(e),c=l+":"+o;let d=this.spriteMetadata.get(c);if(!d){const m=((s=a.decodeIndexed)==null?void 0:s.call(a,o))||a.decode(o),v=!!m.indices;d={w:m.w,h:m.h,x:m.x||0,y:m.y||0,palette:m.palette,indexed:v,colors:m.colors},this.assets.push({id:c,width:d.w,height:d.h,indexed:v,pixels:new Uint8Array(v?m.indices:m.rgba)}),this.sent.add(c),this.spriteMetadata.set(c,d),a.clearDecodedCache()}const f=d.indexed,h=a.sprites[o],u=(r=a.palettes)==null?void 0:r.find(m=>m.index===(d.palette??h.palette));let p=u?[u.group,u.number]:[1,1];p=(i==null?void 0:i.get(p.join(",")))||(i==null?void 0:i.get("*"))||p;const x=l+":pal:"+p.join(",");if(f&&!this.sent.has(x)){let m;try{m=a.paletteColors(...p)}catch{if(m=d.colors,!m)throw Error("Sprite palette is missing.");this.issue("palette","Requested palette "+p.join(",")+" is unavailable.")}const v=new Uint8Array(1024);v.set(m.subarray(0,1024)),this.assets.push({id:x,width:256,height:1,pixels:v,indexed:!1}),this.sent.add(x)}return{id:c,paletteId:x,indexed:f,w:d.w,h:d.h,x:d.x||0,y:d.y||0}}catch(a){return this.issue("sprite",a.message),null}}quad(e,t,i,{x:s=0,y:r=0,sx:a=1,sy:o=1,facing:l=1,angle:c=0,xangle:d=0,yangle:f=0,remaps:h=null,palette:u=null,trans:p=null,mask:x=!0,alpha:m=1,clip:v=null,corners:y=null,axisX:T=null,warp:R=null}={}){var P,B,F;if(!i||e.length>=8192)return;const S=this.asset(t,i,h);if(!S)return;a*=l;const M=Jf((i.angle||0)+c,d,f),g=(i.flip||"").includes("H")?-1:1,_=(i.flip||"").includes("V")?-1:1,L=a*g*(i.scaleX??1)*M.a,E=o*_*(i.scaleY??1)*M.b,A=a*g*(i.scaleX??1)*M.c,U=o*_*(i.scaleY??1)*M.d;if(![L,E,A,U,s,r,m].every(Number.isFinite)){this.issue("render-transform","A non-finite sprite transform was skipped.");return}((P=u==null?void 0:u.layers)==null?void 0:P.length)>8&&this.issue("palette-limit","This preview can render eight palette layers per sprite.");let N=i.blend||"";return typeof p=="string"?N=p:p&&p.mode!=="default"&&(N=p.mode==="sub"?"S":p.mode==="none"?"":p.mode==="add1"?"A1":`AS${((B=p.alpha)==null?void 0:B[0])??256}D${((F=p.alpha)==null?void 0:F[1])??256}`),e.push({texture:S.id,palette:S.paletteId,indexed:S.indexed,width:S.w,height:S.h,matrix:[L,E,A,U,s+(i.x||0)*a-L*(T??S.x)-A*S.y,r+(i.y||0)*o-E*(T??S.x)-U*S.y],blend:Ja(N),mask:x,alpha:m,palFX:(u==null?void 0:u.layers)||[],clip:v,corners:y,warp:R}),S}frame(){var h,u,p,x,m,v,y,T,R,S;const e=this.match,t=e.view,i=Math.min(960/320,540/(t.displayHeight||240)),s=((h=e.stage)==null?void 0:h.camera)||{x:0,y:0,zoom:1},r=(540-(t.displayHeight||240)*i)/2+(t.groundY||200)*i,a=i*s.zoom,o=[];this.assets=[];const l=M=>({x:480+(M.x-s.x)*a,y:r+(M.y-s.y)*a}),c=M=>{const g=e.stage;if(!(g!=null&&g.definition.sprite))return;const _=g.definition,L=_.backgroundScale||1,E=_.coordinateScale*L,A=s.x*L,U=s.y*L;for(const[N,P]of g.elements.entries()){if(o.length>=8192){this.issue("resource-limit","Visible quad budget exceeded.");break}if(P.layer!==M||!P.enabled||!P.visible||P.type==="dummy")continue;const B=P.animated?ja(g.animations.get(P.anim),P.drawFrameIndex??P.frameIndex,P.drawFrameTime??P.frameTime):g.frame(P),F=g.position(N);if(!B)continue;const k=this.asset(_,B);if(!k)continue;const I=1+(s.zoom-1)*P.zoomDelta,C=E*i*I*_.xscale*(P.scaleStart[0]+U/E*P.scaleDelta[0]),G=E*i*I*_.yscale*(P.scaleStart[1]+U/E*P.scaleDelta[1]),W=480+(F.x*E-A*F.delta[0])*a,ee=r+(F.y*E-(t.zoffset||0)-U*F.delta[1])*a,ne=fd(P,{factor:E,scale:i,cameraX:A,cameraY:U,cropTop:t.cropTop,displayHeight:t.displayHeight});for(const V of dd(P,k,B,{x:W,y:ee,sx:C,sy:G,cameraX:A,cameraY:U,deltaX:F.delta[0],zoom:a,factor:E,clip:ne})){if(o.length>=8192){this.issue("resource-limit","Visible quad budget exceeded.");break}this.quad(o,_,B,{...V,mask:P.mask,trans:P.transSpecified?{mode:P.trans,alpha:P.alpha}:null,palette:this.effects.backgroundPalette})}}};c(0);const d=[];for(const M of[...e.renderEntities,...e.drawProjectiles]){!M.destroyed&&!M.asserted.has("invisible")&&d.push({priority:M.sprPriority||0,actor:M});for(const g of M.drawExplods||[])d.push({priority:g.ontop?1e3:g.sprpriority||0,actor:M,effect:g})}d.sort((M,g)=>M.priority-g.priority);for(const{actor:M,effect:g}of d){if(g){if(g.common){this.issue("common-effects","Character requested an unavailable shared effect animation.");continue}const L=g.space==="screen"?{x:g.pos.x*i,y:g.pos.y*i}:l(g.pos),E=(g.coordinateScale??It(M))*a;this.quad(o,M.character,ja(g.animation,g.frameIndex,g.frameTime),{...L,sx:E*(((u=g.scale)==null?void 0:u[0])??1),sy:E*(((p=g.scale)==null?void 0:p[1])??1)*(g.vfacing||1),facing:g.facing,angle:g.angle||0,xangle:g.xangle||0,yangle:g.yangle||0,remaps:g.ownpal?g.paletteRemaps:M.paletteRemaps,palette:this.effects.paletteFor(g.source||M),trans:g.trans});continue}for(const L of this.effects.trailsFor(M)){const E=l({x:L.pos.x+(((x=L.drawOffset)==null?void 0:x.x)||0),y:L.pos.y+(((m=L.drawOffset)==null?void 0:m.y)||0)}),A=a*L.coordinateScale;this.quad(o,L.character,L.frame,{...E,sx:A*L.sizeX*(L.drawScale.x??1),sy:A*L.sizeY*(L.drawScale.y??1),facing:L.facing,angle:L.angle,remaps:L.paletteRemaps,palette:L.palette,trans:L.trans})}const _=l({x:M.pos.x+(((v=M.drawOffset)==null?void 0:v.x)||0)+Xs(M,"size.draw.offset.x")*It(M)*M.facing,y:M.pos.y+(((y=M.drawOffset)==null?void 0:y.y)||0)+Xs(M,"size.draw.offset.y")*It(M)});this.quad(o,M.character,mh(M),{..._,sx:a*It(M)*Xs(M,"size.xscale",1)*(((T=M.drawScale)==null?void 0:T.x)??1),sy:a*It(M)*Xs(M,"size.yscale",1)*(((R=M.drawScale)==null?void 0:R.y)??1),facing:M.facing,angle:M.angleDraw?M.angle:0,remaps:M.paletteRemaps,palette:this.effects.paletteFor(M),trans:M.trans})}c(1);const f=this.sparks.map(M=>({...l(M),age:M.age,guarded:M.guarded}));return{width:960,height:540,draws:o,assets:this.assets,sparks:f,ground:r,grid:!e.stage,players:[e.player,e.opponent].map(M=>({id:M.id,name:M.name,x:M.pos.x,y:M.pos.y,life:M.life,maxLife:M.maxLife,power:M.power,maxPower:M.maxPower,state:M.stateNo,time:M.time,anim:M.anim})),ticks:e.ticks,roundState:((S=e.roundFlow)==null?void 0:S.roundState)??2,paused:!1,expressions:this.expressions.stats}}snapshot(){var e;return{engine:"Kenjatime Core",players:[this.match.player,this.match.opponent].map(t=>({id:t.id,name:t.name,x:t.pos.x,y:t.pos.y,life:t.life,maxLife:t.maxLife,power:t.power,maxPower:t.maxPower,state:t.stateNo,time:t.time,anim:t.anim})),ticks:this.match.ticks,roundState:((e=this.match.roundFlow)==null?void 0:e.roundState)??2,expressions:this.expressions.stats,capabilities:this.capabilities,diagnostics:[...this.match.diagnostics,...this.issues.values()]}}drainEvents(){const e=this.events;return this.events=[],e}close(){this.closed=!0;for(const e of this.banks.values())e.clearDecodedCache();this.banks.clear(),this.sent.clear(),this.events=[]}}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ko="187",vd=0,$l=1,xd=2,Mr=1,_d=2,ys=3,wn=0,qt=1,_i=2,jn=0,Ts=1,ql=2,Yl=3,Kl=4,gh=5,Vi=100,yd=101,vh=102,Sd=103,Md=104,wd=200,eo=201,bd=202,Ed=203,xh=204,Fr=205,Td=206,Ad=207,Rd=208,Cd=209,Pd=210,Ld=211,Id=212,Dd=213,Nd=214,to=0,io=1,no=2,Rs=3,so=4,ro=5,ao=6,oo=7,_h=0,Ud=1,Fd=2,Wi=0,yh=1,Sh=2,Mh=3,wh=4,bh=5,Eh=6,Th=7,Ah=300,ts=301,Cs=302,ma=303,ga=304,lo=1e3,Ci=1001,co=1002,Pt=1003,Od=1004,$s=1005,$t=1006,va=1007,on=1008,Jt=1009,Rh=1010,Ch=1011,Ps=1012,Zo=1013,Ii=1014,Pi=1015,Di=1016,Jo=1017,jo=1018,is=1020,Ph=35902,Lh=35899,Ih=1021,Dh=1022,Si=1023,cn=1026,ln=1027,Qo=1028,el=1029,bn=1030,tl=1031,il=1033,wr=33776,br=33777,Er=33778,Tr=33779,ho=35840,uo=35841,fo=35842,po=35843,mo=36196,go=37492,vo=37496,xo=37488,_o=37489,Or=37490,yo=37491,So=37808,Mo=37809,wo=37810,bo=37811,Eo=37812,To=37813,Ao=37814,Ro=37815,Co=37816,Po=37817,Lo=37818,Io=37819,Do=37820,No=37821,Uo=36492,Fo=36494,Oo=36495,ko=36283,Bo=36284,kr=36285,zo=36286,kd=3200,Zl=0,Bd=1,rn="",oi="srgb",Ls="srgb-linear",Br="linear",st="srgb",xa=7680,zd=519,Hd=512,Gd=513,Vd=514,Nh=515,Wd=516,Xd=517,Uh=518,Fh=519,$d=35044,zr="300 es",Mi=2e3,Hr=2001;function qd(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Gr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Yd(){const n=Gr("canvas");return n.style.display="block",n}const Jl={};function jl(...n){const e="THREE."+n.shift();console.log(e,...n)}function Oh(n){const e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Ne(...n){n=Oh(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function Qe(...n){n=Oh(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function Ar(...n){const e=n.join(" ");e in Jl||(Jl[e]=!0,Ne(...n))}function Kd(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}const Zd={[to]:to,[no]:ao,[so]:so,[Rs]:ro,[io]:io,[ao]:no,[oo]:oo,[ro]:Rs};class Rn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Ft=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],_a=Math.PI/180,Ho=180/Math.PI;function Ds(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Ft[n&255]+Ft[n>>8&255]+Ft[n>>16&255]+Ft[n>>24&255]+"-"+Ft[e&255]+Ft[e>>8&255]+"-"+Ft[e>>16&15|64]+Ft[e>>24&255]+"-"+Ft[t&63|128]+Ft[t>>8&255]+"-"+Ft[t>>16&255]+Ft[t>>24&255]+Ft[i&255]+Ft[i>>8&255]+Ft[i>>16&255]+Ft[i>>24&255]).toLowerCase()}function Ye(n,e,t){return Math.max(e,Math.min(t,n))}function Jd(n,e){return(n%e+e)%e}function ya(n,e,t){return(1-t)*n+t*e}function jd(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function nl(n){switch(n.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function Qd(n,e){if(e.constructor===Float32Array)return n;const t=nl(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(n/t,-1)}function ep(n,e){if(e.constructor===Float32Array)return n;const t=nl(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(n*t)}const ll=class ll{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ye(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ye(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};ll.prototype.isVector2=!0;let et=ll;class rs{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let l=i[s+0],c=i[s+1],d=i[s+2],f=i[s+3],h=r[a+0],u=r[a+1],p=r[a+2],x=r[a+3];if(f!==x||l!==h||c!==u||d!==p){let m=l*h+c*u+d*p+f*x;m<0&&(h=-h,u=-u,p=-p,x=-x,m=-m);let v=1-o;if(m<.9995){const y=Math.acos(m),T=Math.sin(y);v=Math.sin(v*y)/T,o=Math.sin(o*y)/T,l=l*v+h*o,c=c*v+u*o,d=d*v+p*o,f=f*v+x*o}else{l=l*v+h*o,c=c*v+u*o,d=d*v+p*o,f=f*v+x*o;const y=1/Math.sqrt(l*l+c*c+d*d+f*f);l*=y,c*=y,d*=y,f*=y}}e[t]=l,e[t+1]=c,e[t+2]=d,e[t+3]=f}static multiplyQuaternionsFlat(e,t,i,s,r,a){const o=i[s],l=i[s+1],c=i[s+2],d=i[s+3],f=r[a],h=r[a+1],u=r[a+2],p=r[a+3];return e[t]=o*p+d*f+l*u-c*h,e[t+1]=l*p+d*h+c*f-o*u,e[t+2]=c*p+d*u+o*h-l*f,e[t+3]=d*p-o*f-l*h-c*u,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),d=o(s/2),f=o(r/2),h=l(i/2),u=l(s/2),p=l(r/2);switch(a){case"XYZ":this._x=h*d*f+c*u*p,this._y=c*u*f-h*d*p,this._z=c*d*p+h*u*f,this._w=c*d*f-h*u*p;break;case"YXZ":this._x=h*d*f+c*u*p,this._y=c*u*f-h*d*p,this._z=c*d*p-h*u*f,this._w=c*d*f+h*u*p;break;case"ZXY":this._x=h*d*f-c*u*p,this._y=c*u*f+h*d*p,this._z=c*d*p+h*u*f,this._w=c*d*f-h*u*p;break;case"ZYX":this._x=h*d*f-c*u*p,this._y=c*u*f+h*d*p,this._z=c*d*p-h*u*f,this._w=c*d*f+h*u*p;break;case"YZX":this._x=h*d*f+c*u*p,this._y=c*u*f+h*d*p,this._z=c*d*p-h*u*f,this._w=c*d*f-h*u*p;break;case"XZY":this._x=h*d*f-c*u*p,this._y=c*u*f-h*d*p,this._z=c*d*p+h*u*f,this._w=c*d*f+h*u*p;break;default:Ne("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],d=t[6],f=t[10],h=i+o+f;if(h>0){const u=.5/Math.sqrt(h+1);this._w=.25/u,this._x=(d-l)*u,this._y=(r-c)*u,this._z=(a-s)*u}else if(i>o&&i>f){const u=2*Math.sqrt(1+i-o-f);this._w=(d-l)/u,this._x=.25*u,this._y=(s+a)/u,this._z=(r+c)/u}else if(o>f){const u=2*Math.sqrt(1+o-i-f);this._w=(r-c)/u,this._x=(s+a)/u,this._y=.25*u,this._z=(l+d)/u}else{const u=2*Math.sqrt(1+f-i-o);this._w=(a-s)/u,this._x=(r+c)/u,this._y=(l+d)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ye(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,d=t._w;return this._x=i*d+a*o+s*c-r*l,this._y=s*d+a*l+r*o-i*c,this._z=r*d+a*c+i*l-s*o,this._w=a*d-i*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let i=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),d=Math.sin(c);l=Math.sin(l*c)/d,t=Math.sin(t*c)/d,this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const cl=class cl{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ql.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ql.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*i),d=2*(o*t-r*s),f=2*(r*i-a*t);return this.x=t+l*c+a*f-o*d,this.y=i+l*d+o*c-r*f,this.z=s+l*f+r*d-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this.z=Ye(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this.z=Ye(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ye(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-i*l,this.z=i*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Sa.copy(this).projectOnVector(e),this.sub(Sa)}reflect(e){return this.sub(Sa.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ye(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};cl.prototype.isVector3=!0;let K=cl;const Sa=new K,Ql=new rs,hl=class hl{constructor(e,t,i,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c)}set(e,t,i,s,r,a,o,l,c){const d=this.elements;return d[0]=e,d[1]=s,d[2]=o,d[3]=t,d[4]=r,d[5]=l,d[6]=i,d[7]=a,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],d=i[4],f=i[7],h=i[2],u=i[5],p=i[8],x=s[0],m=s[3],v=s[6],y=s[1],T=s[4],R=s[7],S=s[2],M=s[5],g=s[8];return r[0]=a*x+o*y+l*S,r[3]=a*m+o*T+l*M,r[6]=a*v+o*R+l*g,r[1]=c*x+d*y+f*S,r[4]=c*m+d*T+f*M,r[7]=c*v+d*R+f*g,r[2]=h*x+u*y+p*S,r[5]=h*m+u*T+p*M,r[8]=h*v+u*R+p*g,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8];return t*a*d-t*o*c-i*r*d+i*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8],f=d*a-o*c,h=o*l-d*r,u=c*r-a*l,p=t*f+i*h+s*u;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/p;return e[0]=f*x,e[1]=(s*c-d*i)*x,e[2]=(o*i-s*a)*x,e[3]=h*x,e[4]=(d*t-s*l)*x,e[5]=(s*r-o*t)*x,e[6]=u*x,e[7]=(i*l-c*t)*x,e[8]=(a*t-i*r)*x,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return Ar("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Ma.makeScale(e,t)),this}rotate(e){return Ar("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Ma.makeRotation(-e)),this}translate(e,t){return Ar("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Ma.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};hl.prototype.isMatrix3=!0;let Fe=hl;const Ma=new Fe,ec=new Fe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),tc=new Fe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function tp(){const n={enabled:!0,workingColorSpace:Ls,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===st&&(s.r=Xi(s.r),s.g=Xi(s.g),s.b=Xi(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===st&&(s.r=Qn(s.r),s.g=Qn(s.g),s.b=Qn(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===rn?Br:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[a].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Ls]:{primaries:e,whitePoint:i,transfer:Br,toXYZ:ec,fromXYZ:tc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:oi},outputColorSpaceConfig:{drawingBufferColorSpace:oi}},[oi]:{primaries:e,whitePoint:i,transfer:st,toXYZ:ec,fromXYZ:tc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:oi}}}),n}const qe=tp();function Xi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Qn(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Nn;class ip{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Nn===void 0&&(Nn=Gr("canvas")),Nn.width=e.width,Nn.height=e.height;const s=Nn.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=Nn}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Gr("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Xi(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Xi(t[i]/255)*255):t[i]=Xi(t[i]);return{data:t,width:e.width,height:e.height}}else return Ne("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let np=0;class sl{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:np++}),this.uuid=Ds(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width||0,t.height||0,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(wa(s[a].image)):r.push(wa(s[a]))}else r=wa(s);i.url=r}return t||(e.images[this.uuid]=i),i}}function wa(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?ip.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Ne("Texture: Unable to serialize Texture."),{})}let sp=0;const ba=new K;class Vt extends Rn{constructor(e=Vt.DEFAULT_IMAGE,t=Vt.DEFAULT_MAPPING,i=Ci,s=Ci,r=$t,a=on,o=Si,l=Jt,c=Vt.DEFAULT_ANISOTROPY,d=rn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:sp++}),this.uuid=Ds(),this.name="",this.source=new sl(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new et(0,0),this.repeat=new et(1,1),this.center=new et(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Fe,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(ba).x}get height(){return this.source.getSize(ba).y}get depth(){return this.source.getSize(ba).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){Ne(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ne(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Ah)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case lo:e.x=e.x-Math.floor(e.x);break;case Ci:e.x=e.x<0?0:1;break;case co:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case lo:e.y=e.y-Math.floor(e.y);break;case Ci:e.y=e.y<0?0:1;break;case co:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Vt.DEFAULT_IMAGE=null;Vt.DEFAULT_MAPPING=Ah;Vt.DEFAULT_ANISOTROPY=1;const ul=class ul{constructor(e=0,t=0,i=0,s=1){this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r;const l=e.elements,c=l[0],d=l[4],f=l[8],h=l[1],u=l[5],p=l[9],x=l[2],m=l[6],v=l[10];if(Math.abs(d-h)<.01&&Math.abs(f-x)<.01&&Math.abs(p-m)<.01){if(Math.abs(d+h)<.1&&Math.abs(f+x)<.1&&Math.abs(p+m)<.1&&Math.abs(c+u+v-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const T=(c+1)/2,R=(u+1)/2,S=(v+1)/2,M=(d+h)/4,g=(f+x)/4,_=(p+m)/4;return T>R&&T>S?T<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(T),s=M/i,r=g/i):R>S?R<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(R),i=M/s,r=_/s):S<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(S),i=g/r,s=_/r),this.set(i,s,r,t),this}let y=Math.sqrt((m-p)*(m-p)+(f-x)*(f-x)+(h-d)*(h-d));return Math.abs(y)<.001&&(y=1),this.x=(m-p)/y,this.y=(f-x)/y,this.z=(h-d)/y,this.w=Math.acos((c+u+v-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this.z=Ye(this.z,e.z,t.z),this.w=Ye(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this.z=Ye(this.z,e,t),this.w=Ye(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ye(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};ul.prototype.isVector4=!0;let vt=ul;class rp extends Rn{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:$t,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new vt(0,0,e,t),this.scissorTest=!1,this.viewport=new vt(0,0,e,t),this.textures=[];const s=i.count;for(let r=0;r<s;r++)this.textures[r]=new Vt({width:e,height:t,depth:i.depth}),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:$t,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new sl(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Li extends rp{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class kh extends Vt{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Pt,this.minFilter=Pt,this.wrapR=Ci,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class ap extends Vt{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Pt,this.minFilter=Pt,this.wrapR=Ci,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}const Xr=class Xr{constructor(e,t,i,s,r,a,o,l,c,d,f,h,u,p,x,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c,d,f,h,u,p,x,m)}set(e,t,i,s,r,a,o,l,c,d,f,h,u,p,x,m){const v=this.elements;return v[0]=e,v[4]=t,v[8]=i,v[12]=s,v[1]=r,v[5]=a,v[9]=o,v[13]=l,v[2]=c,v[6]=d,v[10]=f,v[14]=h,v[3]=u,v[7]=p,v[11]=x,v[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Xr().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,i=e.elements,s=1/Un.setFromMatrixColumn(e,0).length(),r=1/Un.setFromMatrixColumn(e,1).length(),a=1/Un.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),d=Math.cos(r),f=Math.sin(r);if(e.order==="XYZ"){const h=a*d,u=a*f,p=o*d,x=o*f;t[0]=l*d,t[4]=-l*f,t[8]=c,t[1]=u+p*c,t[5]=h-x*c,t[9]=-o*l,t[2]=x-h*c,t[6]=p+u*c,t[10]=a*l}else if(e.order==="YXZ"){const h=l*d,u=l*f,p=c*d,x=c*f;t[0]=h+x*o,t[4]=p*o-u,t[8]=a*c,t[1]=a*f,t[5]=a*d,t[9]=-o,t[2]=u*o-p,t[6]=x+h*o,t[10]=a*l}else if(e.order==="ZXY"){const h=l*d,u=l*f,p=c*d,x=c*f;t[0]=h-x*o,t[4]=-a*f,t[8]=p+u*o,t[1]=u+p*o,t[5]=a*d,t[9]=x-h*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const h=a*d,u=a*f,p=o*d,x=o*f;t[0]=l*d,t[4]=p*c-u,t[8]=h*c+x,t[1]=l*f,t[5]=x*c+h,t[9]=u*c-p,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const h=a*l,u=a*c,p=o*l,x=o*c;t[0]=l*d,t[4]=x-h*f,t[8]=p*f+u,t[1]=f,t[5]=a*d,t[9]=-o*d,t[2]=-c*d,t[6]=u*f+p,t[10]=h-x*f}else if(e.order==="XZY"){const h=a*l,u=a*c,p=o*l,x=o*c;t[0]=l*d,t[4]=-f,t[8]=c*d,t[1]=h*f+x,t[5]=a*d,t[9]=u*f-p,t[2]=p*f-u,t[6]=o*d,t[10]=x*f+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(op,e,lp)}lookAt(e,t,i){const s=this.elements;return Kt.subVectors(e,t),Kt.lengthSq()===0&&(Kt.z=1),Kt.normalize(),Ji.crossVectors(i,Kt),Ji.lengthSq()===0&&(Math.abs(i.z)===1?Kt.x+=1e-4:Kt.z+=1e-4,Kt.normalize(),Ji.crossVectors(i,Kt)),Ji.normalize(),qs.crossVectors(Kt,Ji),s[0]=Ji.x,s[4]=qs.x,s[8]=Kt.x,s[1]=Ji.y,s[5]=qs.y,s[9]=Kt.y,s[2]=Ji.z,s[6]=qs.z,s[10]=Kt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],d=i[1],f=i[5],h=i[9],u=i[13],p=i[2],x=i[6],m=i[10],v=i[14],y=i[3],T=i[7],R=i[11],S=i[15],M=s[0],g=s[4],_=s[8],L=s[12],E=s[1],A=s[5],U=s[9],N=s[13],P=s[2],B=s[6],F=s[10],k=s[14],I=s[3],C=s[7],G=s[11],W=s[15];return r[0]=a*M+o*E+l*P+c*I,r[4]=a*g+o*A+l*B+c*C,r[8]=a*_+o*U+l*F+c*G,r[12]=a*L+o*N+l*k+c*W,r[1]=d*M+f*E+h*P+u*I,r[5]=d*g+f*A+h*B+u*C,r[9]=d*_+f*U+h*F+u*G,r[13]=d*L+f*N+h*k+u*W,r[2]=p*M+x*E+m*P+v*I,r[6]=p*g+x*A+m*B+v*C,r[10]=p*_+x*U+m*F+v*G,r[14]=p*L+x*N+m*k+v*W,r[3]=y*M+T*E+R*P+S*I,r[7]=y*g+T*A+R*B+S*C,r[11]=y*_+T*U+R*F+S*G,r[15]=y*L+T*N+R*k+S*W,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],d=e[2],f=e[6],h=e[10],u=e[14],p=e[3],x=e[7],m=e[11],v=e[15],y=l*u-c*h,T=o*u-c*f,R=o*h-l*f,S=a*u-c*d,M=a*h-l*d,g=a*f-o*d;return t*(x*y-m*T+v*R)-i*(p*y-m*S+v*M)+s*(p*T-x*S+v*g)-r*(p*R-x*M+m*g)}determinantAffine(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],d=e[10];return t*(a*d-o*c)-i*(r*d-o*l)+s*(r*c-a*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8],f=e[9],h=e[10],u=e[11],p=e[12],x=e[13],m=e[14],v=e[15],y=t*o-i*a,T=t*l-s*a,R=t*c-r*a,S=i*l-s*o,M=i*c-r*o,g=s*c-r*l,_=d*x-f*p,L=d*m-h*p,E=d*v-u*p,A=f*m-h*x,U=f*v-u*x,N=h*v-u*m,P=y*N-T*U+R*A+S*E-M*L+g*_;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const B=1/P;return e[0]=(o*N-l*U+c*A)*B,e[1]=(s*U-i*N-r*A)*B,e[2]=(x*g-m*M+v*S)*B,e[3]=(h*M-f*g-u*S)*B,e[4]=(l*E-a*N-c*L)*B,e[5]=(t*N-s*E+r*L)*B,e[6]=(m*R-p*g-v*T)*B,e[7]=(d*g-h*R+u*T)*B,e[8]=(a*U-o*E+c*_)*B,e[9]=(i*E-t*U-r*_)*B,e[10]=(p*M-x*R+v*y)*B,e[11]=(f*R-d*M-u*y)*B,e[12]=(o*L-a*A-l*_)*B,e[13]=(t*A-i*L+s*_)*B,e[14]=(x*T-p*S-m*y)*B,e[15]=(d*S-f*T+h*y)*B,this}scale(e){const t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,l=e.z,c=r*a,d=r*o;return this.set(c*a+i,c*o-s*l,c*l+s*o,0,c*o+s*l,d*o+i,d*l-s*a,0,c*l-s*o,d*l+s*a,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,d=a+a,f=o+o,h=r*c,u=r*d,p=r*f,x=a*d,m=a*f,v=o*f,y=l*c,T=l*d,R=l*f,S=i.x,M=i.y,g=i.z;return s[0]=(1-(x+v))*S,s[1]=(u+R)*S,s[2]=(p-T)*S,s[3]=0,s[4]=(u-R)*M,s[5]=(1-(h+v))*M,s[6]=(m+y)*M,s[7]=0,s[8]=(p+T)*g,s[9]=(m-y)*g,s[10]=(1-(h+x))*g,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinantAffine();if(r===0)return i.set(1,1,1),t.identity(),this;let a=Un.set(s[0],s[1],s[2]).length();const o=Un.set(s[4],s[5],s[6]).length(),l=Un.set(s[8],s[9],s[10]).length();r<0&&(a=-a),fi.copy(this);const c=1/a,d=1/o,f=1/l;return fi.elements[0]*=c,fi.elements[1]*=c,fi.elements[2]*=c,fi.elements[4]*=d,fi.elements[5]*=d,fi.elements[6]*=d,fi.elements[8]*=f,fi.elements[9]*=f,fi.elements[10]*=f,t.setFromRotationMatrix(fi),i.x=a,i.y=o,i.z=l,this}makePerspective(e,t,i,s,r,a,o=Mi,l=!1){const c=this.elements,d=2*r/(t-e),f=2*r/(i-s),h=(t+e)/(t-e),u=(i+s)/(i-s);let p,x;if(l)p=r/(a-r),x=a*r/(a-r);else if(o===Mi)p=-(a+r)/(a-r),x=-2*a*r/(a-r);else if(o===Hr)p=-a/(a-r),x=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=d,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=f,c[9]=u,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=Mi,l=!1){const c=this.elements,d=2/(t-e),f=2/(i-s),h=-(t+e)/(t-e),u=-(i+s)/(i-s);let p,x;if(l)p=1/(a-r),x=a/(a-r);else if(o===Mi)p=-2/(a-r),x=-(a+r)/(a-r);else if(o===Hr)p=-1/(a-r),x=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=d,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=f,c[9]=0,c[13]=u,c[2]=0,c[6]=0,c[10]=p,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};Xr.prototype.isMatrix4=!0;let xt=Xr;const Un=new K,fi=new xt,op=new K(0,0,0),lp=new K(1,1,1),Ji=new K,qs=new K,Kt=new K,ic=new xt,nc=new rs;class En{constructor(e=0,t=0,i=0,s=En.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],d=s[9],f=s[2],h=s[6],u=s[10];switch(t){case"XYZ":this._y=Math.asin(Ye(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,u),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ye(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,u),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ye(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,u),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ye(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,u),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Ye(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,u));break;case"XZY":this._z=Math.asin(-Ye(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-d,u),this._y=0);break;default:Ne("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return ic.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ic,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return nc.setFromEuler(this),this.setFromQuaternion(nc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}En.DEFAULT_ORDER="XYZ";class Bh{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let cp=0;const sc=new K,Fn=new rs,Fi=new xt,Ys=new K,ps=new K,hp=new K,up=new rs,rc=new K(1,0,0),ac=new K(0,1,0),oc=new K(0,0,1),lc={type:"added"},fp={type:"removed"},On={type:"childadded",child:null},Ea={type:"childremoved",child:null};class jt extends Rn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:cp++}),this.uuid=Ds(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=jt.DEFAULT_UP.clone();const e=new K,t=new En,i=new rs,s=new K(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new xt},normalMatrix:{value:new Fe}}),this.matrix=new xt,this.matrixWorld=new xt,this.matrixAutoUpdate=jt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=jt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Bh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Fn.setFromAxisAngle(e,t),this.quaternion.multiply(Fn),this}rotateOnWorldAxis(e,t){return Fn.setFromAxisAngle(e,t),this.quaternion.premultiply(Fn),this}rotateX(e){return this.rotateOnAxis(rc,e)}rotateY(e){return this.rotateOnAxis(ac,e)}rotateZ(e){return this.rotateOnAxis(oc,e)}translateOnAxis(e,t){return sc.copy(e).applyQuaternion(this.quaternion),this.position.add(sc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(rc,e)}translateY(e){return this.translateOnAxis(ac,e)}translateZ(e){return this.translateOnAxis(oc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Fi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Ys.copy(e):Ys.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),ps.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Fi.lookAt(ps,Ys,this.up):Fi.lookAt(Ys,ps,this.up),this.quaternion.setFromRotationMatrix(Fi),s&&(Fi.extractRotation(s.matrixWorld),Fn.setFromRotationMatrix(Fi),this.quaternion.premultiply(Fn.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Qe("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(lc),On.child=e,this.dispatchEvent(On),On.child=null):Qe("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(fp),Ea.child=e,this.dispatchEvent(Ea),Ea.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Fi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Fi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Fi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(lc),On.child=e,this.dispatchEvent(On),On.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ps,e,hp),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ps,up,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*i-r[8]*s,r[13]+=i-r[1]*t-r[5]*i-r[9]*s,r[14]+=s-r[2]*t-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,i)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){const f=l[c];r(e.shapes,f)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),d=a(e.images),f=a(e.shapes),h=a(e.skeletons),u=a(e.animations),p=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),d.length>0&&(i.images=d),f.length>0&&(i.shapes=f),h.length>0&&(i.skeletons=h),u.length>0&&(i.animations=u),p.length>0&&(i.nodes=p)}return i.object=s,i;function a(o){const l=[];for(const c in o){const d=o[c];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}jt.DEFAULT_UP=new K(0,1,0);jt.DEFAULT_MATRIX_AUTO_UPDATE=!0;jt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Ks extends jt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const dp={type:"move"};class Ta{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ks,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ks,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new K,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new K),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ks,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new K,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new K,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const x of e.hand.values()){const m=t.getJointPose(x,i),v=this._getHandJoint(c,x);m!==null&&(v.matrix.fromArray(m.transform.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale),v.matrixWorldNeedsUpdate=!0,v.jointRadius=m.radius),v.visible=m!==null}const d=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],h=d.position.distanceTo(f.position),u=.02,p=.005;c.inputState.pinching&&h>u+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=u-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.quaternion,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(dp)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Ks;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const zh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ji={h:0,s:0,l:0},Zs={h:0,s:0,l:0};function Aa(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class tt{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=oi){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,qe.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=qe.workingColorSpace){return this.r=e,this.g=t,this.b=i,qe.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=qe.workingColorSpace){if(e=Jd(e,1),t=Ye(t,0,1),i=Ye(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=Aa(a,r,e+1/3),this.g=Aa(a,r,e),this.b=Aa(a,r,e-1/3)}return qe.colorSpaceToWorking(this,s),this}setStyle(e,t=oi){function i(r){r!==void 0&&parseFloat(r)<1&&Ne("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,t);break;case"hsl":case"hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ne("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Ne("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=oi){const i=zh[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Ne("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Xi(e.r),this.g=Xi(e.g),this.b=Xi(e.b),this}copyLinearToSRGB(e){return this.r=Qn(e.r),this.g=Qn(e.g),this.b=Qn(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=oi){return qe.workingToColorSpace(Ot.copy(this),e),Math.round(Ye(Ot.r*255,0,255))*65536+Math.round(Ye(Ot.g*255,0,255))*256+Math.round(Ye(Ot.b*255,0,255))}getHexString(e=oi){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=qe.workingColorSpace){qe.workingToColorSpace(Ot.copy(this),t);const i=Ot.r,s=Ot.g,r=Ot.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let l,c;const d=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=d<=.5?f/(a+o):f/(2-a-o),a){case i:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-i)/f+2;break;case r:l=(i-s)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=d,e}getRGB(e,t=qe.workingColorSpace){return qe.workingToColorSpace(Ot.copy(this),t),e.r=Ot.r,e.g=Ot.g,e.b=Ot.b,e}getStyle(e=oi){qe.workingToColorSpace(Ot.copy(this),e);const t=Ot.r,i=Ot.g,s=Ot.b;return e!==oi?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(ji),this.setHSL(ji.h+e,ji.s+t,ji.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(ji),e.getHSL(Zs);const i=ya(ji.h,Zs.h,t),s=ya(ji.s,Zs.s,t),r=ya(ji.l,Zs.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ot=new tt;tt.NAMES=zh;class pp extends jt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new En,this.environmentIntensity=1,this.environmentRotation=new En,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background!==null?e.background.clone():null,this.environment=e.environment!==null?e.environment.clone():null,this.fog=e.fog!==null?e.fog.clone():null,this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial!==null?e.overrideMaterial.clone():null,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}const di=new K,Oi=new K,Ra=new K,ki=new K,kn=new K,Bn=new K,cc=new K,Ca=new K,Pa=new K,La=new K,Ia=new vt,Da=new vt,Na=new vt;class yi{constructor(e=new K,t=new K,i=new K){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),di.subVectors(e,t),s.cross(di);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){di.subVectors(s,t),Oi.subVectors(i,t),Ra.subVectors(e,t);const a=di.dot(di),o=di.dot(Oi),l=di.dot(Ra),c=Oi.dot(Oi),d=Oi.dot(Ra),f=a*c-o*o;if(f===0)return r.set(0,0,0),null;const h=1/f,u=(c*l-o*d)*h,p=(a*d-o*l)*h;return r.set(1-u-p,p,u)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,ki)===null?!1:ki.x>=0&&ki.y>=0&&ki.x+ki.y<=1}static getInterpolation(e,t,i,s,r,a,o,l){return this.getBarycoord(e,t,i,s,ki)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,ki.x),l.addScaledVector(a,ki.y),l.addScaledVector(o,ki.z),l)}static getInterpolatedAttribute(e,t,i,s,r,a){return Ia.setScalar(0),Da.setScalar(0),Na.setScalar(0),Ia.fromBufferAttribute(e,t),Da.fromBufferAttribute(e,i),Na.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Ia,r.x),a.addScaledVector(Da,r.y),a.addScaledVector(Na,r.z),a}static isFrontFacing(e,t,i,s){return di.subVectors(i,t),Oi.subVectors(e,t),di.cross(Oi).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return di.subVectors(this.c,this.b),Oi.subVectors(this.a,this.b),di.cross(Oi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return yi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return yi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return yi.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return yi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return yi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,r=this.c;let a,o;kn.subVectors(s,i),Bn.subVectors(r,i),Ca.subVectors(e,i);const l=kn.dot(Ca),c=Bn.dot(Ca);if(l<=0&&c<=0)return t.copy(i);Pa.subVectors(e,s);const d=kn.dot(Pa),f=Bn.dot(Pa);if(d>=0&&f<=d)return t.copy(s);const h=l*f-d*c;if(h<=0&&l>=0&&d<=0&&l-d>0)return a=l/(l-d),t.copy(i).addScaledVector(kn,a);La.subVectors(e,r);const u=kn.dot(La),p=Bn.dot(La);if(p>=0&&u<=p)return t.copy(r);const x=u*c-l*p;if(x<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(i).addScaledVector(Bn,o);const m=d*p-u*f;if(m<=0&&f-d>=0&&u-p>=0)return cc.subVectors(r,s),o=(f-d)/(f-d+(u-p)),t.copy(s).addScaledVector(cc,o);const v=1/(m+x+h);return a=x*v,o=h*v,t.copy(i).addScaledVector(kn,a).addScaledVector(Bn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Ns{constructor(e=new K(1/0,1/0,1/0),t=new K(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(pi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(pi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=pi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,pi):pi.fromBufferAttribute(r,a),pi.applyMatrix4(e.matrixWorld),this.expandByPoint(pi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Js.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Js.copy(i.boundingBox)),Js.applyMatrix4(e.matrixWorld),this.union(Js)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,pi),pi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ms),js.subVectors(this.max,ms),zn.subVectors(e.a,ms),Hn.subVectors(e.b,ms),Gn.subVectors(e.c,ms),Qi.subVectors(Hn,zn),en.subVectors(Gn,Hn),mn.subVectors(zn,Gn);let t=[0,-Qi.z,Qi.y,0,-en.z,en.y,0,-mn.z,mn.y,Qi.z,0,-Qi.x,en.z,0,-en.x,mn.z,0,-mn.x,-Qi.y,Qi.x,0,-en.y,en.x,0,-mn.y,mn.x,0];return!Ua(t,zn,Hn,Gn,js)||(t=[1,0,0,0,1,0,0,0,1],!Ua(t,zn,Hn,Gn,js))?!1:(Qs.crossVectors(Qi,en),t=[Qs.x,Qs.y,Qs.z],Ua(t,zn,Hn,Gn,js))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,pi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(pi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Bi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Bi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Bi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Bi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Bi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Bi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Bi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Bi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Bi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Bi=[new K,new K,new K,new K,new K,new K,new K,new K],pi=new K,Js=new Ns,zn=new K,Hn=new K,Gn=new K,Qi=new K,en=new K,mn=new K,ms=new K,js=new K,Qs=new K,gn=new K;function Ua(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){gn.fromArray(n,r);const o=s.x*Math.abs(gn.x)+s.y*Math.abs(gn.y)+s.z*Math.abs(gn.z),l=e.dot(gn),c=t.dot(gn),d=i.dot(gn);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>o)return!1}return!0}const yt=new K,er=new et;let mp=0;class Mn extends Rn{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:mp++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=$d,this.updateRanges=[],this.gpuType=Pi,this.version=0,this._normalizationScale=e!==void 0?nl(e):void 0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)er.fromBufferAttribute(this,t),er.applyMatrix3(e),this.setXY(t,er.x,er.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)yt.fromBufferAttribute(this,t),yt.applyMatrix3(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)yt.fromBufferAttribute(this,t),yt.applyMatrix4(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)yt.fromBufferAttribute(this,t),yt.applyNormalMatrix(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)yt.fromBufferAttribute(this,t),yt.transformDirection(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=this._denormalize(i)),i}setComponent(e,t,i){return this.normalized&&(i=this._normalize(i)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i),s=this._normalize(s)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i),s=this._normalize(s),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(e){const t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):Qd(e,this.array)}_normalize(e){const t=this._normalizationScale;return t!==void 0?Math.round(e*t):ep(e,this.array)}}class Hh extends Mn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Gh extends Mn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class wi extends Mn{constructor(e,t,i){super(new Float32Array(e),t,i)}}const gp=new Ns,gs=new K,Fa=new K;class rl{constructor(e=new K,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):gp.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;gs.subVectors(e,this.center);const t=gs.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(gs,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Fa.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(gs.copy(e.center).add(Fa)),this.expandByPoint(gs.copy(e.center).sub(Fa))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let vp=0;const ai=new xt,Oa=new jt,Vn=new K,Zt=new Ns,vs=new Ns,Rt=new K;class hn extends Rn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:vp++}),this.uuid=Ds(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(qd(e)?Gh:Hh)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new Fe().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return ai.makeRotationFromQuaternion(e),this.applyMatrix4(ai),this}rotateX(e){return ai.makeRotationX(e),this.applyMatrix4(ai),this}rotateY(e){return ai.makeRotationY(e),this.applyMatrix4(ai),this}rotateZ(e){return ai.makeRotationZ(e),this.applyMatrix4(ai),this}translate(e,t,i){return ai.makeTranslation(e,t,i),this.applyMatrix4(ai),this}scale(e,t,i){return ai.makeScale(e,t,i),this.applyMatrix4(ai),this}lookAt(e){return Oa.lookAt(e),Oa.updateMatrix(),this.applyMatrix4(Oa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Vn).negate(),this.translate(Vn.x,Vn.y,Vn.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new wi(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Ne("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ns);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Qe("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new K(-1/0,-1/0,-1/0),new K(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const r=t[i];Zt.setFromBufferAttribute(r),this.morphTargetsRelative?(Rt.addVectors(this.boundingBox.min,Zt.min),this.boundingBox.expandByPoint(Rt),Rt.addVectors(this.boundingBox.max,Zt.max),this.boundingBox.expandByPoint(Rt)):(this.boundingBox.expandByPoint(Zt.min),this.boundingBox.expandByPoint(Zt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Qe('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new rl);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Qe("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new K,1/0);return}if(e){const i=this.boundingSphere.center;if(Zt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];vs.setFromBufferAttribute(o),this.morphTargetsRelative?(Rt.addVectors(Zt.min,vs.min),Zt.expandByPoint(Rt),Rt.addVectors(Zt.max,vs.max),Zt.expandByPoint(Rt)):(Zt.expandByPoint(vs.min),Zt.expandByPoint(vs.max))}Zt.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)Rt.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(Rt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,d=o.count;c<d;c++)Rt.fromBufferAttribute(o,c),l&&(Vn.fromBufferAttribute(e,c),Rt.add(Vn)),s=Math.max(s,i.distanceToSquared(Rt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Qe('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Qe("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,r=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==i.count)&&(a=new Mn(new Float32Array(4*i.count),4),this.setAttribute("tangent",a));const o=[],l=[],c=new Uint8Array(i.count);for(let L=0;L<i.count;L++)o[L]=new K,l[L]=new K;const d=new K,f=new K,h=new K,u=new et,p=new et,x=new et,m=new K,v=new K;function y(L,E,A){c[L]=c[E]=c[A]=1,d.fromBufferAttribute(i,L),f.fromBufferAttribute(i,E),h.fromBufferAttribute(i,A),u.fromBufferAttribute(r,L),p.fromBufferAttribute(r,E),x.fromBufferAttribute(r,A),f.sub(d),h.sub(d),p.sub(u),x.sub(u);const U=1/(p.x*x.y-x.x*p.y);isFinite(U)&&(m.copy(f).multiplyScalar(x.y).addScaledVector(h,-p.y).multiplyScalar(U),v.copy(h).multiplyScalar(p.x).addScaledVector(f,-x.x).multiplyScalar(U),o[L].add(m),o[E].add(m),o[A].add(m),l[L].add(v),l[E].add(v),l[A].add(v))}let T=this.groups;T.length===0&&(T=[{start:0,count:e.count}]);for(let L=0,E=T.length;L<E;++L){const A=T[L],U=A.start,N=A.count;for(let P=U,B=U+N;P<B;P+=3)y(e.getX(P+0),e.getX(P+1),e.getX(P+2))}const R=new K,S=new K,M=new K,g=new K;function _(L){M.fromBufferAttribute(s,L),g.copy(M);const E=o[L];R.copy(E),R.sub(M.multiplyScalar(M.dot(E))).normalize(),S.crossVectors(g,E);const U=S.dot(l[L])<0?-1:1;a.setXYZW(L,R.x,R.y,R.z,U)}for(let L=0,E=i.count;L<E;++L)c[L]&&_(L);this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new Mn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let h=0,u=i.count;h<u;h++)i.setXYZ(h,0,0,0);const s=new K,r=new K,a=new K,o=new K,l=new K,c=new K,d=new K,f=new K;if(e)for(let h=0,u=e.count;h<u;h+=3){const p=e.getX(h+0),x=e.getX(h+1),m=e.getX(h+2);s.fromBufferAttribute(t,p),r.fromBufferAttribute(t,x),a.fromBufferAttribute(t,m),d.subVectors(a,r),f.subVectors(s,r),d.cross(f),o.fromBufferAttribute(i,p),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,m),o.add(d),l.add(d),c.add(d),i.setXYZ(p,o.x,o.y,o.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,u=t.count;h<u;h+=3)s.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),a.fromBufferAttribute(t,h+2),d.subVectors(a,r),f.subVectors(s,r),d.cross(f),i.setXYZ(h+0,d.x,d.y,d.z),i.setXYZ(h+1,d.x,d.y,d.z),i.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Rt.fromBufferAttribute(e,t),Rt.normalize(),e.setXYZ(t,Rt.x,Rt.y,Rt.z)}toNonIndexed(){function e(o,l){const c=o.array,d=o.itemSize,f=o.normalized,h=new c.constructor(l.length*d);let u=0,p=0;for(let x=0,m=l.length;x<m;x++){o.isInterleavedBufferAttribute?u=l[x]*o.data.stride+o.offset:u=l[x]*d;for(let v=0;v<d;v++)h[p++]=c[u++]}return new Mn(h,d,f)}if(this.index===null)return Ne("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new hn,i=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,i);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let d=0,f=c.length;d<f;d++){const h=c[d],u=e(h,i);l.push(u)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],d=[];for(let f=0,h=c.length;f<h;f++){const u=c[f];d.push(u.toJSON(e.data))}d.length>0&&(s[l]=d,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const c in s){const d=s[c];this.setAttribute(c,d.clone(t))}const r=e.morphAttributes;for(const c in r){const d=[],f=r[c];for(let h=0,u=f.length;h<u;h++)d.push(f[h].clone(t));this.morphAttributes[c]=d}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,d=a.length;c<d;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ka=new K,xp=new K,_p=new Fe;class sn{constructor(e=new K(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=ka.subVectors(i,t).cross(xp.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const s=e.delta(ka),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return i===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||_p.getNormalMatrix(e),s=this.coplanarPoint(ka).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let yp=0;class Kr extends Rn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:yp++}),this.uuid=Ds(),this.name="",this.type="Material",this.blending=Ts,this.side=wn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=xh,this.blendDst=Fr,this.blendEquation=Vi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new tt(0,0,0),this.blendAlpha=0,this.depthFunc=Rs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=zd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=xa,this.stencilZFail=xa,this.stencilZPass=xa,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){Ne(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ne(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(i.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(i.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(i.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(i.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new tt().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new sn().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new et().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new et().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const zi=new K,Ba=new K,tr=new K,ir=new K;class Sp{constructor(e=new K,t=new K(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,zi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=zi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(zi.copy(this.origin).addScaledVector(this.direction,t),zi.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Ba.copy(e).add(t).multiplyScalar(.5),tr.copy(t).sub(e).normalize(),ir.copy(this.origin).sub(Ba);const r=e.distanceTo(t)*.5,a=-this.direction.dot(tr),o=ir.dot(this.direction),l=-ir.dot(tr),c=ir.lengthSq(),d=Math.abs(1-a*a);let f,h,u,p;if(d>0)if(f=a*l-o,h=a*o-l,p=r*d,f>=0)if(h>=-p)if(h<=p){const x=1/d;f*=x,h*=x,u=f*(f+a*h+2*o)+h*(a*f+h+2*l)+c}else h=r,f=Math.max(0,-(a*h+o)),u=-f*f+h*(h+2*l)+c;else h=-r,f=Math.max(0,-(a*h+o)),u=-f*f+h*(h+2*l)+c;else h<=-p?(f=Math.max(0,-(-a*r+o)),h=f>0?-r:Math.min(Math.max(-r,-l),r),u=-f*f+h*(h+2*l)+c):h<=p?(f=0,h=Math.min(Math.max(-r,-l),r),u=h*(h+2*l)+c):(f=Math.max(0,-(a*r+o)),h=f>0?r:Math.min(Math.max(-r,-l),r),u=-f*f+h*(h+2*l)+c);else h=a>0?-r:r,f=Math.max(0,-(a*h+o)),u=-f*f+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Ba).addScaledVector(tr,h),u}intersectSphere(e,t){if(e.radius<0)return null;zi.subVectors(e.center,this.origin);const i=zi.dot(this.direction),s=zi.dot(zi)-i*i,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,l;const c=1/this.direction.x,d=1/this.direction.y,f=1/this.direction.z,h=this.origin;return c>=0?(i=(e.min.x-h.x)*c,s=(e.max.x-h.x)*c):(i=(e.max.x-h.x)*c,s=(e.min.x-h.x)*c),d>=0?(r=(e.min.y-h.y)*d,a=(e.max.y-h.y)*d):(r=(e.max.y-h.y)*d,a=(e.min.y-h.y)*d),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(e.min.z-h.z)*f,l=(e.max.z-h.z)*f):(o=(e.max.z-h.z)*f,l=(e.min.z-h.z)*f),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,zi)!==null}intersectTriangle(e,t,i,s,r){const a=this.origin,o=this.direction,l=o.x,c=o.y,d=o.z,f=e.x-a.x,h=e.y-a.y,u=e.z-a.z,p=t.x-a.x,x=t.y-a.y,m=t.z-a.z,v=i.x-a.x,y=i.y-a.y,T=i.z-a.z,R=Math.abs(l),S=Math.abs(c),M=Math.abs(d);let g,_,L,E,A,U,N,P,B,F,k,I;if(R>=S&&R>=M?(L=l,U=f,B=p,I=v,l>=0?(g=c,_=d,E=h,A=u,N=x,P=m,F=y,k=T):(g=d,_=c,E=u,A=h,N=m,P=x,F=T,k=y)):S>=M?(L=c,U=h,B=x,I=y,c>=0?(g=d,_=l,E=u,A=f,N=m,P=p,F=T,k=v):(g=l,_=d,E=f,A=u,N=p,P=m,F=v,k=T)):(L=d,U=u,B=m,I=T,d>=0?(g=l,_=c,E=f,A=h,N=p,P=x,F=v,k=y):(g=c,_=l,E=h,A=f,N=x,P=p,F=y,k=v)),L===0)return null;const C=g/L,G=_/L,W=1/L,ee=E-C*U,ne=A-G*U,V=N-C*B,ie=P-G*B,ve=F-C*I,_e=k-G*I,ae=ve*ie-_e*V,Le=ee*_e-ne*ve,rt=V*ne-ie*ee;if(s){if(ae<0||Le<0||rt<0)return null}else if((ae<0||Le<0||rt<0)&&(ae>0||Le>0||rt>0))return null;const Re=ae+Le+rt;if(Re===0)return null;const Ge=W*(ae*U+Le*B+rt*I);return(Re>0?Ge<0:Ge>0)?null:this.at(Ge/Re,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Mp extends Kr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new tt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new En,this.combine=_h,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const hc=new xt,vn=new Sp,nr=new rl,uc=new K,sr=new K,rr=new K,ar=new K,za=new K,or=new K,fc=new K,lr=new K;class $i extends jt{constructor(e=new hn,t=new Mp){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){or.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const d=o[l],f=r[l];d!==0&&(za.fromBufferAttribute(f,e),a?or.addScaledVector(za,d):or.addScaledVector(za.sub(t),d))}t.add(or)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),nr.copy(i.boundingSphere),nr.applyMatrix4(r),vn.copy(e.ray).recast(e.near),!(nr.containsPoint(vn.origin)===!1&&(vn.intersectSphere(nr,uc)===null||vn.origin.distanceToSquared(uc)>(e.far-e.near)**2))&&(hc.copy(r).invert(),vn.copy(e.ray).applyMatrix4(hc),!(i.boundingBox!==null&&vn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,vn)))}_computeIntersections(e,t,i){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,d=r.attributes.uv1,f=r.attributes.normal,h=r.groups,u=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,x=h.length;p<x;p++){const m=h[p],v=a[m.materialIndex],y=Math.max(m.start,u.start),T=Math.min(o.count,Math.min(m.start+m.count,u.start+u.count));for(let R=y,S=T;R<S;R+=3){const M=o.getX(R),g=o.getX(R+1),_=o.getX(R+2);s=cr(this,v,e,i,c,d,f,M,g,_),s&&(s.faceIndex=Math.floor(R/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const p=Math.max(0,u.start),x=Math.min(o.count,u.start+u.count);for(let m=p,v=x;m<v;m+=3){const y=o.getX(m),T=o.getX(m+1),R=o.getX(m+2);s=cr(this,a,e,i,c,d,f,y,T,R),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let p=0,x=h.length;p<x;p++){const m=h[p],v=a[m.materialIndex],y=Math.max(m.start,u.start),T=Math.min(l.count,Math.min(m.start+m.count,u.start+u.count));for(let R=y,S=T;R<S;R+=3){const M=R,g=R+1,_=R+2;s=cr(this,v,e,i,c,d,f,M,g,_),s&&(s.faceIndex=Math.floor(R/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const p=Math.max(0,u.start),x=Math.min(l.count,u.start+u.count);for(let m=p,v=x;m<v;m+=3){const y=m,T=m+1,R=m+2;s=cr(this,a,e,i,c,d,f,y,T,R),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function wp(n,e,t,i,s,r,a,o){let l;if(e.side===qt?l=i.intersectTriangle(a,r,s,!0,o):l=i.intersectTriangle(s,r,a,e.side===wn,o),l===null)return null;lr.copy(o),lr.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(lr);return c<t.near||c>t.far?null:{distance:c,point:lr.clone(),object:n}}function cr(n,e,t,i,s,r,a,o,l,c){n.getVertexPosition(o,sr),n.getVertexPosition(l,rr),n.getVertexPosition(c,ar);const d=wp(n,e,t,i,sr,rr,ar,fc);if(d){const f=new K;yi.getBarycoord(fc,sr,rr,ar,f),s&&(d.uv=yi.getInterpolatedAttribute(s,o,l,c,f,new et)),r&&(d.uv1=yi.getInterpolatedAttribute(r,o,l,c,f,new et)),a&&(d.normal=yi.getInterpolatedAttribute(a,o,l,c,f,new K),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const h={a:o,b:l,c,normal:new K,materialIndex:0};yi.getNormal(sr,rr,ar,h.normal),d.face=h,d.barycoord=f}return d}class Vh extends Vt{constructor(e=null,t=1,i=1,s,r,a,o,l,c=Pt,d=Pt,f,h){super(null,a,o,l,c,d,s,r,f,h),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const xn=new rl,bp=new et(.5,.5),hr=new K;class Vr{constructor(e=new sn,t=new sn,i=new sn,s=new sn,r=new sn,a=new sn){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Mi,i=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],d=r[4],f=r[5],h=r[6],u=r[7],p=r[8],x=r[9],m=r[10],v=r[11],y=r[12],T=r[13],R=r[14],S=r[15];if(s[0].setComponents(c-a,u-d,v-p,S-y).normalize(),s[1].setComponents(c+a,u+d,v+p,S+y).normalize(),s[2].setComponents(c+o,u+f,v+x,S+T).normalize(),s[3].setComponents(c-o,u-f,v-x,S-T).normalize(),i)s[4].setComponents(l,h,m,R).normalize(),s[5].setComponents(c-l,u-h,v-m,S-R).normalize();else if(s[4].setComponents(c-l,u-h,v-m,S-R).normalize(),t===Mi)s[5].setComponents(c+l,u+h,v+m,S+R).normalize();else if(t===Hr)s[5].setComponents(l,h,m,R).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),xn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),xn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(xn)}intersectsSprite(e){xn.center.set(0,0,0);const t=bp.distanceTo(e.center);return xn.radius=.7071067811865476+t,xn.applyMatrix4(e.matrixWorld),this.intersectsSphere(xn)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(hr.x=s.normal.x>0?e.max.x:e.min.x,hr.y=s.normal.y>0?e.max.y:e.min.y,hr.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(hr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}const dc=new xt;class al{constructor(){this.coordinateSystem=Mi,this._frustums=[],this._count=0}setFromArrayCamera(e){const t=e.cameras,i=this._frustums;for(let s=0;s<t.length;s++){const r=t[s];dc.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),i[s]===void 0&&(i[s]=new Vr),i[s].setFromProjectionMatrix(dc,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsObject(e))return!0;return!1}intersectsSprite(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsSprite(e))return!0;return!1}intersectsSphere(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsSphere(e))return!0;return!1}intersectsBox(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsBox(e))return!0;return!1}containsPoint(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;const t=this._frustums,i=e._frustums;for(let s=0;s<e._count;s++)t[s]===void 0&&(t[s]=new Vr),t[s].copy(i[s]);return this._count=e._count,this}clone(){return new al().copy(this)}}class Wh extends Vt{constructor(e=[],t=ts,i,s,r,a,o,l,c,d){super(e,t,i,s,r,a,o,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class ns extends Vt{constructor(e,t,i=Ii,s,r,a,o=Pt,l=Pt,c,d=cn,f=1){if(d!==cn&&d!==ln)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const h={width:e,height:t,depth:f};super(h,s,r,a,o,l,d,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new sl(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class Xh extends ns{constructor(e,t=Ii,i=ts,s,r,a=Pt,o=Pt,l,c=cn){const d={width:e,height:e,depth:1},f=[d,d,d,d,d,d];super(e,e,t,i,s,r,a,o,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class $h extends Vt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Us extends hn{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],d=[],f=[];let h=0,u=0;p("z","y","x",-1,-1,i,t,e,a,r,0),p("z","y","x",1,-1,i,t,-e,a,r,1),p("x","z","y",1,1,e,i,t,s,a,2),p("x","z","y",1,-1,e,i,-t,s,a,3),p("x","y","z",1,-1,e,t,i,s,r,4),p("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new wi(c,3)),this.setAttribute("normal",new wi(d,3)),this.setAttribute("uv",new wi(f,2));function p(x,m,v,y,T,R,S,M,g,_,L){const E=R/g,A=S/_,U=R/2,N=S/2,P=M/2,B=g+1,F=_+1;let k=0,I=0;const C=new K;for(let G=0;G<F;G++){const W=G*A-N;for(let ee=0;ee<B;ee++){const ne=ee*E-U;C[x]=ne*y,C[m]=W*T,C[v]=P,c.push(C.x,C.y,C.z),C[x]=0,C[m]=0,C[v]=M>0?1:-1,d.push(C.x,C.y,C.z),f.push(ee/g),f.push(1-G/_),k+=1}}for(let G=0;G<_;G++)for(let W=0;W<g;W++){const ee=h+W+B*G,ne=h+W+B*(G+1),V=h+(W+1)+B*(G+1),ie=h+(W+1)+B*G;l.push(ee,ne,ie),l.push(ne,V,ie),I+=6}o.addGroup(u,I,L),u+=I,h+=k}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Us(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Zr extends hn{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(i),l=Math.floor(s),c=o+1,d=l+1,f=e/o,h=t/l,u=[],p=[],x=[],m=[];for(let v=0;v<d;v++){const y=v*h-a;for(let T=0;T<c;T++){const R=T*f-r;p.push(R,-y,0),x.push(0,0,1),m.push(T/o),m.push(1-v/l)}}for(let v=0;v<l;v++)for(let y=0;y<o;y++){const T=y+c*v,R=y+c*(v+1),S=y+1+c*(v+1),M=y+1+c*v;u.push(T,R,M),u.push(R,S,M)}this.setIndex(u),this.setAttribute("position",new wi(p,3)),this.setAttribute("normal",new wi(x,3)),this.setAttribute("uv",new wi(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Zr(e.width,e.height,e.widthSegments,e.heightSegments)}}function ss(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];if(pc(s))s.isRenderTargetTexture?(Ne("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone();else if(Array.isArray(s))if(pc(s[0])){const r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][i]=r}else e[t][i]=s.slice();else e[t][i]=s}}return e}function Ht(n){const e={};for(let t=0;t<n.length;t++){const i=ss(n[t]);for(const s in i)e[s]=i[s]}return e}function pc(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function Ep(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function qh(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:qe.workingColorSpace}const Tp={clone:ss,merge:Ht};var Ap=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Rp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Tn extends Kr{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ap,this.fragmentShader=Rp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ss(e.uniforms),this.uniformsGroups=Ep(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const i in e.uniforms){const s=e.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=t[s.value]||null;break;case"c":this.uniforms[i].value=new tt().setHex(s.value);break;case"v2":this.uniforms[i].value=new et().fromArray(s.value);break;case"v3":this.uniforms[i].value=new K().fromArray(s.value);break;case"v4":this.uniforms[i].value=new vt().fromArray(s.value);break;case"m3":this.uniforms[i].value=new Fe().fromArray(s.value);break;case"m4":this.uniforms[i].value=new xt().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class Go extends Tn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Cp extends Kr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=kd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Pp extends Kr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const ur=new K,fr=new rs,Ei=new K;class Yh extends jt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new xt,this.projectionMatrix=new xt,this.projectionMatrixInverse=new xt,this.coordinateSystem=Mi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(ur,fr,Ei),Ei.x===1&&Ei.y===1&&Ei.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ur,fr,Ei.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(ur,fr,Ei),Ei.x===1&&Ei.y===1&&Ei.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ur,fr,Ei.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const tn=new K,mc=new et,gc=new et;class Ai extends Yh{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Ho*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(_a*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ho*2*Math.atan(Math.tan(_a*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){tn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(tn.x,tn.y).multiplyScalar(-e/tn.z),tn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(tn.x,tn.y).multiplyScalar(-e/tn.z)}getViewSize(e,t){return this.getViewBounds(e,mc,gc),t.subVectors(gc,mc)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(_a*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*i/c,s*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class Kh extends Yh{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=d*this.view.offsetY,l=o-d*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Wn=-90,Xn=1;class Vo extends jt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Ai(Wn,Xn,e,t);s.layers=this.layers,this.add(s);const r=new Ai(Wn,Xn,e,t);r.layers=this.layers,this.add(r);const a=new Ai(Wn,Xn,e,t);a.layers=this.layers,this.add(a);const o=new Ai(Wn,Xn,e,t);o.layers=this.layers,this.add(o);const l=new Ai(Wn,Xn,e,t);l.layers=this.layers,this.add(l);const c=new Ai(Wn,Xn,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===Mi)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Hr)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,d]=this.children,f=e.getRenderTarget(),h=e.getActiveCubeFace(),u=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;const x=i.texture.mipmapsAutoUpdate;i.texture.mipmapsAutoUpdate=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,1,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,2,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,3,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,4,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),i.texture.mipmapsAutoUpdate=x,e.setRenderTarget(i,5,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,d),e.setRenderTarget(f,h,u),e.xr.enabled=p,i.texture.needsPMREMUpdate=!0}}class Lp extends Ai{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}}function vc(n,e,t,i){const s=Ip(i);switch(t){case Ih:return n*e;case Qo:return n*e/s.components*s.byteLength;case el:return n*e/s.components*s.byteLength;case bn:return n*e*2/s.components*s.byteLength;case tl:return n*e*2/s.components*s.byteLength;case Dh:return n*e*3/s.components*s.byteLength;case Si:return n*e*4/s.components*s.byteLength;case il:return n*e*4/s.components*s.byteLength;case wr:case br:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Er:case Tr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case uo:case po:return Math.max(n,16)*Math.max(e,8)/4;case ho:case fo:return Math.max(n,8)*Math.max(e,8)/2;case mo:case go:case xo:case _o:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case vo:case Or:case yo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case So:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Mo:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case wo:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case bo:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Eo:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case To:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Ao:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Ro:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Co:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Po:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Lo:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Io:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Do:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case No:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Uo:case Fo:case Oo:return Math.ceil(n/4)*Math.ceil(e/4)*16;case ko:case Bo:return Math.ceil(n/4)*Math.ceil(e/4)*8;case kr:case zo:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Ip(n){switch(n){case Jt:case Rh:return{byteLength:1,components:1};case Ps:case Ch:case Di:return{byteLength:2,components:1};case Jo:case jo:return{byteLength:2,components:4};case Ii:case Zo:case Pi:return{byteLength:4,components:1};case Ph:case Lh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ko}}));typeof window<"u"&&(window.__THREE__?Ne("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ko);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Zh(){let n=null,e=!1,t=null,i=null;function s(r,a){i=n.requestAnimationFrame(s),t(r,a)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function Dp(n){const e=new WeakMap;function t(o,l){const c=o.array,d=o.usage,f=c.byteLength,h=n.createBuffer();n.bindBuffer(l,h),n.bufferData(l,c,d),o.onUploadCallback();let u;if(c instanceof Float32Array)u=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)u=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?u=n.HALF_FLOAT:u=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)u=n.SHORT;else if(c instanceof Uint32Array)u=n.UNSIGNED_INT;else if(c instanceof Int32Array)u=n.INT;else if(c instanceof Int8Array)u=n.BYTE;else if(c instanceof Uint8Array)u=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)u=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:u,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function i(o,l,c){const d=l.array,f=l.updateRanges;if(n.bindBuffer(c,o),f.length===0)n.bufferSubData(c,0,d);else{f.sort((u,p)=>u.start-p.start);let h=0;for(let u=1;u<f.length;u++){const p=f[h],x=f[u];x.start<=p.start+p.count+1?p.count=Math.max(p.count,x.start+x.count-p.start):(++h,f[h]=x)}f.length=h+1;for(let u=0,p=f.length;u<p;u++){const x=f[u];n.bufferSubData(c,x.start*d.BYTES_PER_ELEMENT,d,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var Np=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Up=`#ifdef USE_ALPHAHASH
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
#endif`,Fp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Op=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,kp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Bp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,zp=`#ifdef USE_AOMAP
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
#endif`,Hp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Gp=`#ifdef USE_BATCHING
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
#endif`,Vp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Wp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Xp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,$p=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,qp=`#ifdef USE_IRIDESCENCE
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
#endif`,Yp=`#ifdef USE_BUMPMAP
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
#endif`,Kp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Zp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Jp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,jp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Qp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,em=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,tm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,im=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,nm=`#define PI 3.141592653589793
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
} // validated`,sm=`vec3 transformedNormal = objectNormal;
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
#endif`,rm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,am=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,om=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,lm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,cm="gl_FragColor = linearToOutputTexel( gl_FragColor );",hm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,um=`#ifdef USE_ENVMAP
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
#endif`,fm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,dm=`#ifdef USE_ENVMAP
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
#endif`,pm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,mm=`#ifdef USE_ENVMAP
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
#endif`,gm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,vm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,xm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,_m=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,ym=`#ifdef USE_GRADIENTMAP
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
}`,Sm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Mm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,wm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,bm=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,Em=`#ifdef USE_ENVMAP
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
#endif`,Tm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Am=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Rm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Cm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Pm=`PhysicalMaterial material;
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
#endif`,Lm=`uniform sampler2D dfgLUT;
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
}`,Im=`
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
#endif`,Dm=`#if defined( RE_IndirectDiffuse )
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
#endif`,Nm=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Um=`#if NUM_LIGHT_PROBE_GRIDS > 0
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
#endif`,Fm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Om=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,km=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Bm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,zm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Hm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Gm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Vm=`#if defined( USE_POINTS_UV )
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
#endif`,Wm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Xm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,$m=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,qm=`#if defined( USE_MORPHCOLORS )
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
#endif`,Ym=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Km=`#ifdef USE_MORPHTARGETS
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
#endif`,Zm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Jm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,jm=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Qm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,eg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,tg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,ig=`#ifdef USE_NORMALMAP
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
#endif`,ng=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,sg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,rg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,ag=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,og=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,lg=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,cg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,hg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ug=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,fg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,dg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,pg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,mg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,gg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,vg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,xg=`float getShadowMask() {
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
}`,_g=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,yg=`#ifdef USE_SKINNING
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
#endif`,Sg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Mg=`#ifdef USE_SKINNING
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
#endif`,wg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,bg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Eg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Tg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Ag=`#ifdef USE_TRANSMISSION
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
#endif`,Rg=`#ifdef USE_TRANSMISSION
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
#endif`,Cg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Pg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Lg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ig=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Dg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Ng=`uniform sampler2D t2D;
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
}`,Ug=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Fg=`uniform float backgroundBlurriness;
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
}`,Og=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,kg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Bg=`#include <common>
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
}`,zg=`#if DEPTH_PACKING == 3200
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
}`,Hg=`#define DISTANCE
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
}`,Gg=`#define DISTANCE
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
}`,Vg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Wg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Xg=`uniform float scale;
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
}`,$g=`uniform vec3 diffuse;
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
}`,qg=`#include <common>
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
}`,Yg=`uniform vec3 diffuse;
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
}`,Kg=`#define LAMBERT
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
}`,Zg=`#define LAMBERT
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
}`,Jg=`#define MATCAP
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
}`,jg=`#define MATCAP
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
}`,Qg=`#define NORMAL
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
}`,e0=`#define NORMAL
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
}`,t0=`#define PHONG
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
}`,i0=`#define PHONG
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
}`,n0=`#define STANDARD
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
}`,s0=`#define STANDARD
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
}`,r0=`#define TOON
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
}`,a0=`#define TOON
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
}`,o0=`uniform float size;
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
}`,l0=`uniform vec3 diffuse;
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
}`,c0=`#include <common>
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
}`,h0=`uniform vec3 color;
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
}`,u0=`uniform float rotation;
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
}`,f0=`uniform vec3 diffuse;
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
}`,He={alphahash_fragment:Np,alphahash_pars_fragment:Up,alphamap_fragment:Fp,alphamap_pars_fragment:Op,alphatest_fragment:kp,alphatest_pars_fragment:Bp,aomap_fragment:zp,aomap_pars_fragment:Hp,batching_pars_vertex:Gp,batching_vertex:Vp,begin_vertex:Wp,beginnormal_vertex:Xp,bsdfs:$p,iridescence_fragment:qp,bumpmap_pars_fragment:Yp,clipping_planes_fragment:Kp,clipping_planes_pars_fragment:Zp,clipping_planes_pars_vertex:Jp,clipping_planes_vertex:jp,color_fragment:Qp,color_pars_fragment:em,color_pars_vertex:tm,color_vertex:im,common:nm,defaultnormal_vertex:sm,displacementmap_pars_vertex:rm,displacementmap_vertex:am,emissivemap_fragment:om,emissivemap_pars_fragment:lm,colorspace_fragment:cm,colorspace_pars_fragment:hm,envmap_fragment:um,envmap_common_pars_fragment:fm,envmap_pars_fragment:dm,envmap_pars_vertex:pm,envmap_physical_pars_fragment:Em,envmap_vertex:mm,fog_vertex:gm,fog_pars_vertex:vm,fog_fragment:xm,fog_pars_fragment:_m,gradientmap_pars_fragment:ym,lightmap_pars_fragment:Sm,lights_lambert_fragment:Mm,lights_lambert_pars_fragment:wm,lights_pars_begin:bm,lights_toon_fragment:Tm,lights_toon_pars_fragment:Am,lights_phong_fragment:Rm,lights_phong_pars_fragment:Cm,lights_physical_fragment:Pm,lights_physical_pars_fragment:Lm,lights_fragment_begin:Im,lights_fragment_maps:Dm,lights_fragment_end:Nm,lightprobes_pars_fragment:Um,logdepthbuf_fragment:Fm,logdepthbuf_pars_fragment:Om,logdepthbuf_pars_vertex:km,logdepthbuf_vertex:Bm,map_fragment:zm,map_pars_fragment:Hm,map_particle_fragment:Gm,map_particle_pars_fragment:Vm,metalnessmap_fragment:Wm,metalnessmap_pars_fragment:Xm,morphinstance_vertex:$m,morphcolor_vertex:qm,morphnormal_vertex:Ym,morphtarget_pars_vertex:Km,morphtarget_vertex:Zm,normal_fragment_begin:Jm,normal_fragment_maps:jm,normal_pars_fragment:Qm,normal_pars_vertex:eg,normal_vertex:tg,normalmap_pars_fragment:ig,clearcoat_normal_fragment_begin:ng,clearcoat_normal_fragment_maps:sg,clearcoat_pars_fragment:rg,iridescence_pars_fragment:ag,opaque_fragment:og,packing:lg,premultiplied_alpha_fragment:cg,project_vertex:hg,dithering_fragment:ug,dithering_pars_fragment:fg,roughnessmap_fragment:dg,roughnessmap_pars_fragment:pg,shadowmap_pars_fragment:mg,shadowmap_pars_vertex:gg,shadowmap_vertex:vg,shadowmask_pars_fragment:xg,skinbase_vertex:_g,skinning_pars_vertex:yg,skinning_vertex:Sg,skinnormal_vertex:Mg,specularmap_fragment:wg,specularmap_pars_fragment:bg,tonemapping_fragment:Eg,tonemapping_pars_fragment:Tg,transmission_fragment:Ag,transmission_pars_fragment:Rg,uv_pars_fragment:Cg,uv_pars_vertex:Pg,uv_vertex:Lg,worldpos_vertex:Ig,background_vert:Dg,background_frag:Ng,backgroundCube_vert:Ug,backgroundCube_frag:Fg,cube_vert:Og,cube_frag:kg,depth_vert:Bg,depth_frag:zg,distance_vert:Hg,distance_frag:Gg,equirect_vert:Vg,equirect_frag:Wg,linedashed_vert:Xg,linedashed_frag:$g,meshbasic_vert:qg,meshbasic_frag:Yg,meshlambert_vert:Kg,meshlambert_frag:Zg,meshmatcap_vert:Jg,meshmatcap_frag:jg,meshnormal_vert:Qg,meshnormal_frag:e0,meshphong_vert:t0,meshphong_frag:i0,meshphysical_vert:n0,meshphysical_frag:s0,meshtoon_vert:r0,meshtoon_frag:a0,points_vert:o0,points_frag:l0,shadow_vert:c0,shadow_frag:h0,sprite_vert:u0,sprite_frag:f0},Se={common:{diffuse:{value:new tt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Fe}},envmap:{envMap:{value:null},envMapRotation:{value:new Fe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Fe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Fe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Fe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Fe},normalScale:{value:new et(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Fe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Fe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Fe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Fe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new tt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new tt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0},uvTransform:{value:new Fe}},sprite:{diffuse:{value:new tt(16777215)},opacity:{value:1},center:{value:new et(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}}},Ri={basic:{uniforms:Ht([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.fog]),vertexShader:He.meshbasic_vert,fragmentShader:He.meshbasic_frag},lambert:{uniforms:Ht([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,Se.lights,{emissive:{value:new tt(0)},envMapIntensity:{value:1}}]),vertexShader:He.meshlambert_vert,fragmentShader:He.meshlambert_frag},phong:{uniforms:Ht([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,Se.lights,{emissive:{value:new tt(0)},specular:{value:new tt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:He.meshphong_vert,fragmentShader:He.meshphong_frag},standard:{uniforms:Ht([Se.common,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.roughnessmap,Se.metalnessmap,Se.fog,Se.lights,{emissive:{value:new tt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:He.meshphysical_vert,fragmentShader:He.meshphysical_frag},toon:{uniforms:Ht([Se.common,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.gradientmap,Se.fog,Se.lights,{emissive:{value:new tt(0)}}]),vertexShader:He.meshtoon_vert,fragmentShader:He.meshtoon_frag},matcap:{uniforms:Ht([Se.common,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,{matcap:{value:null}}]),vertexShader:He.meshmatcap_vert,fragmentShader:He.meshmatcap_frag},points:{uniforms:Ht([Se.points,Se.fog]),vertexShader:He.points_vert,fragmentShader:He.points_frag},dashed:{uniforms:Ht([Se.common,Se.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:He.linedashed_vert,fragmentShader:He.linedashed_frag},depth:{uniforms:Ht([Se.common,Se.displacementmap]),vertexShader:He.depth_vert,fragmentShader:He.depth_frag},normal:{uniforms:Ht([Se.common,Se.bumpmap,Se.normalmap,Se.displacementmap,{opacity:{value:1}}]),vertexShader:He.meshnormal_vert,fragmentShader:He.meshnormal_frag},sprite:{uniforms:Ht([Se.sprite,Se.fog]),vertexShader:He.sprite_vert,fragmentShader:He.sprite_frag},background:{uniforms:{uvTransform:{value:new Fe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:He.background_vert,fragmentShader:He.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Fe}},vertexShader:He.backgroundCube_vert,fragmentShader:He.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:He.cube_vert,fragmentShader:He.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:He.equirect_vert,fragmentShader:He.equirect_frag},distance:{uniforms:Ht([Se.common,Se.displacementmap,{referencePosition:{value:new K},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:He.distance_vert,fragmentShader:He.distance_frag},shadow:{uniforms:Ht([Se.lights,Se.fog,{color:{value:new tt(0)},opacity:{value:1}}]),vertexShader:He.shadow_vert,fragmentShader:He.shadow_frag}};Ri.physical={uniforms:Ht([Ri.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Fe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Fe},clearcoatNormalScale:{value:new et(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Fe},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new Fe},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Fe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Fe},sheen:{value:0},sheenColor:{value:new tt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Fe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Fe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Fe},transmissionSamplerSize:{value:new et},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Fe},attenuationDistance:{value:0},attenuationColor:{value:new tt(0)},specularColor:{value:new tt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Fe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Fe},anisotropyVector:{value:new et},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Fe}}]),vertexShader:He.meshphysical_vert,fragmentShader:He.meshphysical_frag};const dr={r:0,b:0,g:0},d0=new xt,Jh=new Fe;Jh.set(-1,0,0,0,1,0,0,0,1);function p0(n,e,t,i,s,r){const a=new tt(0);let o=s===!0?0:1,l,c,d=null,f=0,h=null;function u(y){let T=y.isScene===!0?y.background:null;if(T&&T.isTexture){const R=y.backgroundBlurriness>0;T=e.get(T,R)}return T}function p(y){let T=!1;const R=u(y);R===null?m(a,o):R&&R.isColor&&(m(R,1),T=!0);const S=n.xr.getEnvironmentBlendMode();S==="additive"?t.buffers.color.setClear(0,0,0,1,r):S==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(n.autoClear||T)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function x(y,T){const R=u(T);R&&R.isCubeTexture?(c===void 0&&(c=new $i(new Us(1,1,1),new Tn({name:"BackgroundCubeMaterial",uniforms:ss(Ri.backgroundCube.uniforms),vertexShader:Ri.backgroundCube.vertexShader,fragmentShader:Ri.backgroundCube.fragmentShader,side:qt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(S,M,g){this.matrixWorld.copyPosition(g.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=R,c.material.uniforms.backgroundBlurriness.value=T.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(d0.makeRotationFromEuler(T.backgroundRotation)).transpose(),R.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Jh),c.material.toneMapped=qe.getTransfer(R.colorSpace)!==st,(d!==R||f!==R.version||h!==n.toneMapping)&&(c.material.needsUpdate=!0,d=R,f=R.version,h=n.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null)):R&&R.isTexture&&(l===void 0&&(l=new $i(new Zr(2,2),new Tn({name:"BackgroundMaterial",uniforms:ss(Ri.background.uniforms),vertexShader:Ri.background.vertexShader,fragmentShader:Ri.background.fragmentShader,side:wn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=R,l.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,l.material.toneMapped=qe.getTransfer(R.colorSpace)!==st,R.matrixAutoUpdate===!0&&R.updateMatrix(),l.material.uniforms.uvTransform.value.copy(R.matrix),(d!==R||f!==R.version||h!==n.toneMapping)&&(l.material.needsUpdate=!0,d=R,f=R.version,h=n.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function m(y,T){y.getRGB(dr,qh(n)),t.buffers.color.setClear(dr.r,dr.g,dr.b,T,r)}function v(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(y,T=1){a.set(y),o=T,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(y){o=y,m(a,o)},render:p,addToRenderList:x,dispose:v}}function m0(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=h(null);let r=s,a=!1;function o(A,U,N,P,B){let F=!1;const k=f(A,P,N,U);r!==k&&(r=k,c(r.object)),F=u(A,P,N,B),F&&p(A,P,N,B),B!==null&&e.update(B,n.ELEMENT_ARRAY_BUFFER),(F||a)&&(a=!1,R(A,U,N,P),B!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(B).buffer))}function l(){return n.createVertexArray()}function c(A){return n.bindVertexArray(A)}function d(A){return n.deleteVertexArray(A)}function f(A,U,N,P){const B=P.wireframe===!0;let F=i[U.id];F===void 0&&(F={},i[U.id]=F);const k=A.isInstancedMesh===!0?A.id:0;let I=F[k];I===void 0&&(I={},F[k]=I);let C=I[N.id];C===void 0&&(C={},I[N.id]=C);let G=C[B];return G===void 0&&(G=h(l()),C[B]=G),G}function h(A){const U=[],N=[],P=[];for(let B=0;B<t;B++)U[B]=0,N[B]=0,P[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:N,attributeDivisors:P,object:A,attributes:{},index:null}}function u(A,U,N,P){const B=r.attributes,F=U.attributes;let k=0;const I=N.getAttributes();for(const C in I)if(I[C].location>=0){const W=B[C];let ee=F[C];if(ee===void 0&&(C==="instanceMatrix"&&A.instanceMatrix&&(ee=A.instanceMatrix),C==="instanceColor"&&A.instanceColor&&(ee=A.instanceColor)),W===void 0||W.attribute!==ee||ee&&W.data!==ee.data)return!0;k++}return r.attributesNum!==k||r.index!==P}function p(A,U,N,P){const B={},F=U.attributes;let k=0;const I=N.getAttributes();for(const C in I)if(I[C].location>=0){let W=F[C];W===void 0&&(C==="instanceMatrix"&&A.instanceMatrix&&(W=A.instanceMatrix),C==="instanceColor"&&A.instanceColor&&(W=A.instanceColor));const ee={};ee.attribute=W,W&&W.data&&(ee.data=W.data),B[C]=ee,k++}r.attributes=B,r.attributesNum=k,r.index=P}function x(){const A=r.newAttributes;for(let U=0,N=A.length;U<N;U++)A[U]=0}function m(A){v(A,0)}function v(A,U){const N=r.newAttributes,P=r.enabledAttributes,B=r.attributeDivisors;N[A]=1,P[A]===0&&(n.enableVertexAttribArray(A),P[A]=1),B[A]!==U&&(n.vertexAttribDivisor(A,U),B[A]=U)}function y(){const A=r.newAttributes,U=r.enabledAttributes;for(let N=0,P=U.length;N<P;N++)U[N]!==A[N]&&(n.disableVertexAttribArray(N),U[N]=0)}function T(A,U,N,P,B,F,k){k===!0?n.vertexAttribIPointer(A,U,N,B,F):n.vertexAttribPointer(A,U,N,P,B,F)}function R(A,U,N,P){x();const B=P.attributes,F=N.getAttributes(),k=U.defaultAttributeValues;for(const I in F){const C=F[I];if(C.location>=0){let G=B[I];if(G===void 0&&(I==="instanceMatrix"&&A.instanceMatrix&&(G=A.instanceMatrix),I==="instanceColor"&&A.instanceColor&&(G=A.instanceColor)),G!==void 0){const W=G.normalized,ee=G.itemSize,ne=e.get(G);if(ne===void 0)continue;const V=ne.buffer,ie=ne.type,ve=ne.bytesPerElement,_e=ie===n.INT||ie===n.UNSIGNED_INT||G.gpuType===Zo;if(G.isInterleavedBufferAttribute){const ae=G.data,Le=ae.isInterleavedBuffer===!0?ae.stride:ae.itemSize,rt=G.offset;if(ae.isInstancedInterleavedBuffer||ae.isInstancedBufferAttribute){for(let Re=0;Re<C.locationSize;Re++)v(C.location+Re,ae.meshPerAttribute);A.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let Re=0;Re<C.locationSize;Re++)m(C.location+Re);n.bindBuffer(n.ARRAY_BUFFER,V);for(let Re=0;Re<C.locationSize;Re++)T(C.location+Re,ee/C.locationSize,ie,W,Le*ve,(rt+ee/C.locationSize*Re)*ve,_e)}else{if(G.isInstancedBufferAttribute){for(let ae=0;ae<C.locationSize;ae++)v(C.location+ae,G.meshPerAttribute);A.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=G.meshPerAttribute*G.count)}else for(let ae=0;ae<C.locationSize;ae++)m(C.location+ae);n.bindBuffer(n.ARRAY_BUFFER,V);for(let ae=0;ae<C.locationSize;ae++)T(C.location+ae,ee/C.locationSize,ie,W,ee*ve,ee/C.locationSize*ae*ve,_e)}}else if(k!==void 0){const W=k[I];if(W!==void 0)switch(W.length){case 2:n.vertexAttrib2fv(C.location,W);break;case 3:n.vertexAttrib3fv(C.location,W);break;case 4:n.vertexAttrib4fv(C.location,W);break;default:n.vertexAttrib1fv(C.location,W)}}}}y()}function S(){L();for(const A in i){const U=i[A];for(const N in U){const P=U[N];for(const B in P){const F=P[B];for(const k in F)d(F[k].object),delete F[k];delete P[B]}}delete i[A]}}function M(A){if(i[A.id]===void 0)return;const U=i[A.id];for(const N in U){const P=U[N];for(const B in P){const F=P[B];for(const k in F)d(F[k].object),delete F[k];delete P[B]}}delete i[A.id]}function g(A){for(const U in i){const N=i[U];for(const P in N){const B=N[P];if(B[A.id]===void 0)continue;const F=B[A.id];for(const k in F)d(F[k].object),delete F[k];delete B[A.id]}}}function _(A){for(const U in i){const N=i[U],P=A.isInstancedMesh===!0?A.id:0,B=N[P];if(B!==void 0){for(const F in B){const k=B[F];for(const I in k)d(k[I].object),delete k[I];delete B[F]}delete N[P],Object.keys(N).length===0&&delete i[U]}}}function L(){E(),a=!0,r!==s&&(r=s,c(r.object))}function E(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:L,resetDefaultState:E,dispose:S,releaseStatesOfGeometry:M,releaseStatesOfObject:_,releaseStatesOfProgram:g,initAttributes:x,enableAttribute:m,disableUnusedAttributes:y}}function g0(n,e,t){let i;function s(l){i=l}function r(l,c){n.drawArrays(i,l,c),t.update(c,i,1)}function a(l,c,d){d!==0&&(n.drawArraysInstanced(i,l,c,d),t.update(c,i,d))}function o(l,c,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,d);let h=0;for(let u=0;u<d;u++)h+=c[u];t.update(h,i,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function v0(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const g=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(g.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(g){return!(g!==Si&&i.convert(g)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(g){const _=g===Di&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(g!==Jt&&g!==Pi&&!_&&i.convert(g)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE))}function l(g){if(g==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";g="mediump"}return g==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const d=l(c);d!==c&&(Ne("WebGLRenderer:",c,"not supported, using",d,"instead."),c=d);const f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),h=t.logarithmicDepthBuffer===!0&&f===!1;t.reversedDepthBuffer===!0&&f===!1&&Ne("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),t.logarithmicDepthBuffer===!0&&f===!0&&Ne("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");const u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),v=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),T=n.getParameter(n.MAX_VARYING_VECTORS),R=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),S=n.getParameter(n.MAX_SAMPLES),M=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:f,maxTextures:u,maxVertexTextures:p,maxTextureSize:x,maxCubemapSize:m,maxAttributes:v,maxVertexUniforms:y,maxVaryings:T,maxFragmentUniforms:R,maxSamples:S,samples:M}}function x0(n){const e=this;let t=null,i=0,s=!1,r=!1;const a=new sn,o=new Fe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){const u=f.length!==0||h||i!==0||s;return s=h,i=f.length,u},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,h){t=d(f,h,0)},this.setState=function(f,h,u){const p=f.clippingPlanes,x=f.clipIntersection,m=f.clipShadows,v=n.get(f);if(!s||p===null||p.length===0||r&&!m)r?d(null):c();else{const y=r?0:i,T=y*4;let R=v.clippingState||null;l.value=R,R=d(p,h,T,u);for(let S=0;S!==T;++S)R[S]=t[S];v.clippingState=R,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(f,h,u,p){const x=f!==null?f.length:0;let m=null;if(x!==0){if(m=l.value,p!==!0||m===null){const v=u+x*4,y=h.matrixWorldInverse;o.getNormalMatrix(y),(m===null||m.length<v)&&(m=new Float32Array(v));for(let T=0,R=u;T!==x;++T,R+=4)a.copy(f[T]).applyMatrix4(y,o),a.normal.toArray(m,R),m[R+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,m}}class ol extends Li{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Wh(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Us(5,5,5),r=new Tn({name:"CubemapFromEquirect",uniforms:ss(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:qt,blending:jn});r.uniforms.tEquirect.value=t;const a=new $i(s,r),o=t.minFilter;return t.minFilter===on&&(t.minFilter=$t),new Vo(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}}const xc=256,_0=3,y0=20,jh=256,Qh=16,S0=3,M0=new K,w0=new tt;class Wr{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new Vo(1,10,null),this._boxMesh=new $i(new Us(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,i=.1,s=100,r={}){const{size:a=256,position:o=M0}=r,l=this._renderer;this._setSize(a);const c=this._allocateTarget(),d=this._getSourceTarget(!0);t>0&&(d.texture.mipmapsAutoUpdate=!1);const f=l.autoClear,h=l.autoClearColor,u=l.autoClearDepth,p=l.autoClearStencil,x=e.background;l.autoClear=!0,l.autoClearColor=!0,l.autoClearDepth=!0,l.autoClearStencil=!0,x===null&&(e.background=l.getClearColor(w0));const m=new Vo(i,s,d);return m.position.copy(o),m.update(l,e),l.autoClear=f,l.autoClearColor=h,l.autoClearDepth=u,l.autoClearStencil=p,e.background=x,t>0&&(d.texture.mipmapsAutoUpdate=!0,this._blur(c,t)),this._applyPMREM(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Sc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=yc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(xc,jd(e))}_fromTexture(e,t){e.mapping===ts||e.mapping===Cs?this._setSize(e.image.length===0?xc:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);const i=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(i),i}_allocateTarget(){const e=this._cubeSize,t=_c(e,!1,!1),i=Math.log2(e)-_0;for(let s=0;s<=i;s++)t.texture.mipmaps.push({width:e>>s,height:e>>s});return t.texture.name="PMREM",t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){const t=this._cubeSize,i=this._sourceTarget;return(i===null||i.width!==t||e&&i.depthBuffer===!1)&&(i!==null&&i.dispose(),this._sourceTarget=_c(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,i){const s=this._boxMesh,r=this._cubeCamera;s.material=i,r.renderTarget=e,r.activeMipmapLevel=t;const a=e.width>>t;e.viewport.set(0,0,a,a),r.update(this._renderer,s),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===ts||e.mapping===Cs?(this._cubemapMaterial===null&&(this._cubemapMaterial=Sc()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=yc()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(e){this._ggxMaterial===null&&(this._ggxMaterial=b0(),this._integrationMaterial=E0());const t=this._cubeSize,i=e.texture.mipmaps.length-1,s=this._ggxMaterial.uniforms;s.envMap.value=this._sourceTarget.texture;const r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(t/Qh);for(let a=0;a<=i;a++){const o=Wr.lodToRoughness(a,i);if(a>i-S0)r.roughness.value=o,this._renderCube(e,a,this._integrationMaterial);else{const l=o>0?Math.log2(t)+.5*Math.log2(6/(jh*Math.pow(o,4)))+.5:0;s.roughness.value=o,s.lodBias.value=l,this._renderCube(e,a,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=T0());const i=this._blurMaterial,s=i.uniforms,r=this._sourceTarget;s.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,s.envMap.value=r.texture,this._renderCube(e,0,i),s.envMap.value=e.texture,this._renderCube(r,0,i)}}function _c(n,e,t){return new ol(n,{minFilter:on,generateMipmaps:e,type:Di,colorSpace:Ls,depthBuffer:t})}function Fs(n,e,t){return new Tn({name:n,uniforms:e,vertexShader:He.cube_vert,fragmentShader:t,side:qt,blending:jn,depthTest:!1,depthWrite:!1})}function b0(){return Fs("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${jh}u

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
	`)}function E0(){return Fs("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:Qh}},`

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
	`)}function T0(){return Fs("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${y0}
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
	`)}function yc(){return Fs("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

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
	`)}function Sc(){return Fs("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function A0(n){let e=new WeakMap,t=new WeakMap,i=null;function s(h,u=!1){return h==null?null:u?a(h):r(h)}function r(h){if(h&&h.isTexture){const u=h.mapping;if(u===ma||u===ga)if(e.has(h)){const p=e.get(h).texture;return o(p,h.mapping)}else{const p=h.image;if(p&&p.height>0){const x=new ol(p.height);return x.fromEquirectangularTexture(n,h),e.set(h,x),h.addEventListener("dispose",c),o(x.texture,h.mapping)}else return null}}return h}function a(h){if(h&&h.isTexture&&h.isPMREMTexture!==!0){const u=h.mapping,p=u===ma||u===ga,x=u===ts||u===Cs;if(p||x){let m=t.get(h);const v=m!==void 0?m.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==v)return i===null&&(i=new Wr(n)),m=p?i.fromEquirectangular(h,m):i.fromCubemap(h,m),m.texture.pmremVersion=h.pmremVersion,t.set(h,m),m.texture;if(m!==void 0)return m.texture;{const y=h.image;return p&&y&&y.height>0||x&&y&&l(y)?(i===null&&(i=new Wr(n)),m=p?i.fromEquirectangular(h):i.fromCubemap(h),m.texture.pmremVersion=h.pmremVersion,t.set(h,m),h.addEventListener("dispose",d),m.texture):null}}}return h}function o(h,u){return u===ma?h.mapping=ts:u===ga&&(h.mapping=Cs),h}function l(h){let u=0;const p=6;for(let x=0;x<p;x++)h[x]!==void 0&&u++;return u===p}function c(h){const u=h.target;u.removeEventListener("dispose",c);const p=e.get(u);p!==void 0&&(e.delete(u),p.dispose())}function d(h){const u=h.target;u.removeEventListener("dispose",d);const p=t.get(u);p!==void 0&&(t.delete(u),p.dispose())}function f(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:f}}function R0(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&Ar("WebGLRenderer: "+i+" extension not supported."),s}}}function C0(n,e,t,i){const s={},r=new WeakMap,a=new FinalizationRegistry(p=>delete s[p]);function o(p){l(p.target)}function l(p){p.index!==null&&e.remove(p.index);for(const m in p.attributes)e.remove(p.attributes[m]);p.removeEventListener("dispose",o),delete s[p.id],a.unregister(p);const x=r.get(p);x&&(e.remove(x),r.delete(p)),i.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function c(p,x){return s[x.id]!==void 0||(x.addEventListener("dispose",o),s[x.id]=new WeakRef(x),a.register(x,x.id,x),t.memory.geometries++),x}function d(p){const x=p.attributes;for(const m in x)e.update(x[m],n.ARRAY_BUFFER)}function f(p){const x=p.index,m=p.attributes.position;let v=0;if(m===void 0)return;const y=x!==null?x.array.length:m.array.length/3-1,T=m.count>=65535?Gh:Hh,R=new T(Math.ceil(y/3)*6,1),S=R.array;if(x!==null){const g=x.array;v=x.version;for(let _=0,L=0;_<y;_+=3){const E=g[_+0],A=g[_+1],U=g[_+2];S[L++]=E,S[L++]=A,S[L++]=A,S[L++]=U,S[L++]=U,S[L++]=E}}else{v=m.version;for(let g=0,_=0;g<y;g+=3){const L=g+0,E=g+1,A=g+2;S[_++]=L,S[_++]=E,S[_++]=E,S[_++]=A,S[_++]=A,S[_++]=L}}R.version=v;const M=r.get(p);M&&e.remove(M),r.set(p,R)}function h(p){const x=r.get(p);if(x){const m=p.index;m!==null&&x.version<m.version&&f(p)}else f(p);return r.get(p)}function u(){for(const p in s){const x=s[p].deref();x!==void 0&&l(x)}}return{get:c,update:d,getWireframeAttribute:h,dispose:u}}function P0(n,e,t){let i;function s(f){i=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,h){n.drawElements(i,h,r,f*a),t.update(h,i,1)}function c(f,h,u){u!==0&&(n.drawElementsInstanced(i,h,r,f*a,u),t.update(h,i,u))}function d(f,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,h,0,r,f,0,u);let x=0;for(let m=0;m<u;m++)x+=h[m];t.update(x,i,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=d}function L0(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:Qe("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function I0(n,e,t){const i=new WeakMap,s=new vt;function r(a,o,l){const c=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=d!==void 0?d.length:0;let h=i.get(o);if(h===void 0||h.count!==f){let E=function(){_.dispose(),i.delete(o),o.removeEventListener("dispose",E)};var u=E;h!==void 0&&h.texture.dispose();const p=o.morphAttributes.position!==void 0,x=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,v=o.morphAttributes.position||[],y=o.morphAttributes.normal||[],T=o.morphAttributes.color||[];let R=0;p===!0&&(R=1),x===!0&&(R=2),m===!0&&(R=3);let S=o.attributes.position.count*R,M=1;S>e.maxTextureSize&&(M=Math.ceil(S/e.maxTextureSize),S=e.maxTextureSize);const g=new Float32Array(S*M*4*f),_=new kh(g,S,M,f);_.type=Pi,_.needsUpdate=!0;const L=R*4;for(let A=0;A<f;A++){const U=v[A],N=y[A],P=T[A],B=S*M*4*A;for(let F=0;F<U.count;F++){const k=F*L;p===!0&&(s.fromBufferAttribute(U,F),g[B+k+0]=s.x,g[B+k+1]=s.y,g[B+k+2]=s.z,g[B+k+3]=0),x===!0&&(s.fromBufferAttribute(N,F),g[B+k+4]=s.x,g[B+k+5]=s.y,g[B+k+6]=s.z,g[B+k+7]=0),m===!0&&(s.fromBufferAttribute(P,F),g[B+k+8]=s.x,g[B+k+9]=s.y,g[B+k+10]=s.z,g[B+k+11]=P.itemSize===4?s.w:1)}}h={count:f,texture:_,size:new et(S,M)},i.set(o,h),o.addEventListener("dispose",E)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let p=0;for(let m=0;m<c.length;m++)p+=c[m];const x=o.morphTargetsRelative?1:1-p;l.getUniforms().setValue(n,"morphTargetBaseInfluence",x),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:r}}function D0(n,e,t,i,s){let r=new WeakMap;function a(c){const d=s.render.frame,f=c.geometry,h=e.get(c,f);if(r.get(h)!==d&&(e.update(h),r.set(h,d)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==d&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),r.set(c,d))),c.isSkinnedMesh){const u=c.skeleton;r.get(u)!==d&&(u.update(),r.set(u,d))}return h}function o(){r=new WeakMap}function l(c){const d=c.target;d.removeEventListener("dispose",l),i.releaseStatesOfObject(d),t.remove(d.instanceMatrix),d.instanceColor!==null&&t.remove(d.instanceColor)}return{update:a,dispose:o}}const N0={[yh]:"LINEAR_TONE_MAPPING",[Sh]:"REINHARD_TONE_MAPPING",[Mh]:"CINEON_TONE_MAPPING",[wh]:"ACES_FILMIC_TONE_MAPPING",[Eh]:"AGX_TONE_MAPPING",[Th]:"NEUTRAL_TONE_MAPPING",[bh]:"CUSTOM_TONE_MAPPING"};function U0(n,e,t,i,s,r){const a=new Li(e,t,{type:n,depthBuffer:s,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,l=null,c=null;const d=new hn;d.setAttribute("position",new wi([-1,3,0,-1,-1,0,3,-1,0],3)),d.setAttribute("uv",new wi([0,2,0,0,2,0],2));const f=new Go({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),h=new $i(d,f),u=new Kh(-1,1,1,-1,0,1);let p=null,x=null,m=!1,v,y=null,T=[],R=!1;this.setSize=function(S,M){a.setSize(S,M),o!==null&&o.setSize(S,M),l!==null&&l.setSize(S,M);for(let g=0;g<T.length;g++){const _=T[g];_.setSize&&_.setSize(S,M)}},this.setEffects=function(S){T=S,R=T.length>0&&T[0].isRenderPass===!0;const M=a.width,g=a.height;T.length>0&&o===null&&(o=new Li(M,g,{type:Di,depthBuffer:!1,stencilBuffer:!1}),l=new Li(M,g,{type:Di,depthBuffer:!1,stencilBuffer:!1}));const _=s===!0&&T.some(L=>L.needsDepthTexture===!0);_!==(a.depthTexture!==null)&&(_===!0&&c===null&&(c=new ns(M,g),r===!0&&(c.format=ln,c.type=is)),a.dispose(),a.depthTexture=_?c:null,a.resolveDepthBuffer=_,a.storeMultisampledDepthBuffer=_);for(let L=0;L<T.length;L++){const E=T[L];E.setSize&&E.setSize(M,g),_&&E.needsDepthTexture===!0&&E.setDepthTexture&&E.setDepthTexture(c)}},this.begin=function(S,M){if(m||S.toneMapping===Wi&&T.length===0)return!1;if(y=M,M!==null){const g=M.width,_=M.height;(a.width!==g||a.height!==_)&&this.setSize(g,_)}return R===!1&&S.setRenderTarget(a),v=S.toneMapping,S.toneMapping=Wi,!0},this.hasRenderPass=function(){return R},this.end=function(S,M){S.toneMapping=v,m=!0;let g=a,_=o;for(let L=0;L<T.length;L++){const E=T[L];E.enabled!==!1&&(E.render(S,_,g,M),E.needsSwap!==!1&&(g=_,_=_===o?l:o))}if(p!==S.outputColorSpace||x!==S.toneMapping){p=S.outputColorSpace,x=S.toneMapping,f.defines={},qe.getTransfer(p)===st&&(f.defines.SRGB_TRANSFER="");const L=N0[x];L&&(f.defines[L]=""),f.needsUpdate=!0}f.uniforms.tDiffuse.value=g.texture,S.setRenderTarget(y),S.render(h,u),y=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),d.dispose(),f.dispose()}}const eu=new Vt,tu=new ns(1,1),iu=new Xh(1),nu=new kh,su=new ap,ru=new Wh,Mc=[],wc=[],bc=new Float32Array(16),Ec=new Float32Array(9),Tc=new Float32Array(4);function as(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let r=Mc[s];if(r===void 0&&(r=new Float32Array(s),Mc[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function wt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function bt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Jr(n,e){let t=wc[e];t===void 0&&(t=new Int32Array(e),wc[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function F0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function O0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(wt(t,e))return;n.uniform2fv(this.addr,e),bt(t,e)}}function k0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(wt(t,e))return;n.uniform3fv(this.addr,e),bt(t,e)}}function B0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(wt(t,e))return;n.uniform4fv(this.addr,e),bt(t,e)}}function z0(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(wt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),bt(t,e)}else{if(wt(t,i))return;Tc.set(i),n.uniformMatrix2fv(this.addr,!1,Tc),bt(t,i)}}function H0(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(wt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),bt(t,e)}else{if(wt(t,i))return;Ec.set(i),n.uniformMatrix3fv(this.addr,!1,Ec),bt(t,i)}}function G0(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(wt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),bt(t,e)}else{if(wt(t,i))return;bc.set(i),n.uniformMatrix4fv(this.addr,!1,bc),bt(t,i)}}function V0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function W0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(wt(t,e))return;n.uniform2iv(this.addr,e),bt(t,e)}}function X0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(wt(t,e))return;n.uniform3iv(this.addr,e),bt(t,e)}}function $0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(wt(t,e))return;n.uniform4iv(this.addr,e),bt(t,e)}}function q0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function Y0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(wt(t,e))return;n.uniform2uiv(this.addr,e),bt(t,e)}}function K0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(wt(t,e))return;n.uniform3uiv(this.addr,e),bt(t,e)}}function Z0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(wt(t,e))return;n.uniform4uiv(this.addr,e),bt(t,e)}}function jr(n){return n.version===0&&(n.compareFunction=Fh,n.needsUpdate=!0),n}function J0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?r=jr(tu):r=eu,t.setTexture2D(e||r,s)}function j0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||su,s)}function Q0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_CUBE_SHADOW?r=jr(iu):r=ru,t.setTextureCube(e||r,s)}function ev(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||nu,s)}function tv(n){switch(n){case 5126:return F0;case 35664:return O0;case 35665:return k0;case 35666:return B0;case 35674:return z0;case 35675:return H0;case 35676:return G0;case 5124:case 35670:return V0;case 35667:case 35671:return W0;case 35668:case 35672:return X0;case 35669:case 35673:return $0;case 5125:return q0;case 36294:return Y0;case 36295:return K0;case 36296:return Z0;case 35678:case 36198:case 36298:case 36306:case 35682:return J0;case 35679:case 36299:case 36307:return j0;case 35680:case 36300:case 36308:case 36293:return Q0;case 36289:case 36303:case 36311:case 36292:return ev}}function iv(n,e){n.uniform1fv(this.addr,e)}function nv(n,e){const t=as(e,this.size,2);n.uniform2fv(this.addr,t)}function sv(n,e){const t=as(e,this.size,3);n.uniform3fv(this.addr,t)}function rv(n,e){const t=as(e,this.size,4);n.uniform4fv(this.addr,t)}function av(n,e){const t=as(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function ov(n,e){const t=as(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function lv(n,e){const t=as(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function cv(n,e){n.uniform1iv(this.addr,e)}function hv(n,e){n.uniform2iv(this.addr,e)}function uv(n,e){n.uniform3iv(this.addr,e)}function fv(n,e){n.uniform4iv(this.addr,e)}function dv(n,e){n.uniform1uiv(this.addr,e)}function pv(n,e){n.uniform2uiv(this.addr,e)}function mv(n,e){n.uniform3uiv(this.addr,e)}function gv(n,e){n.uniform4uiv(this.addr,e)}function vv(n,e,t){const i=this.cache,s=e.length,r=Jr(t,s);wt(i,r)||(n.uniform1iv(this.addr,r),bt(i,r));let a;this.type===n.SAMPLER_2D_SHADOW?a=jr(tu):a=eu;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function xv(n,e,t){const i=this.cache,s=e.length,r=Jr(t,s);wt(i,r)||(n.uniform1iv(this.addr,r),bt(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||su,r[a])}function _v(n,e,t){const i=this.cache,s=e.length,r=Jr(t,s);wt(i,r)||(n.uniform1iv(this.addr,r),bt(i,r));let a;this.type===n.SAMPLER_CUBE_SHADOW?a=jr(iu):a=ru;for(let o=0;o!==s;++o)t.setTextureCube(e[o]||a,r[o])}function yv(n,e,t){const i=this.cache,s=e.length,r=Jr(t,s);wt(i,r)||(n.uniform1iv(this.addr,r),bt(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||nu,r[a])}function Sv(n){switch(n){case 5126:return iv;case 35664:return nv;case 35665:return sv;case 35666:return rv;case 35674:return av;case 35675:return ov;case 35676:return lv;case 5124:case 35670:return cv;case 35667:case 35671:return hv;case 35668:case 35672:return uv;case 35669:case 35673:return fv;case 5125:return dv;case 36294:return pv;case 36295:return mv;case 36296:return gv;case 35678:case 36198:case 36298:case 36306:case 35682:return vv;case 35679:case 36299:case 36307:return xv;case 35680:case 36300:case 36308:case 36293:return _v;case 36289:case 36303:case 36311:case 36292:return yv}}class Mv{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=tv(t.type)}}class wv{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Sv(t.type)}}class bv{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],i)}}}const Ha=/(\w+)(\])?(\[|\.)?/g;function Ac(n,e){n.seq.push(e),n.map[e.id]=e}function Ev(n,e,t){const i=n.name,s=i.length;for(Ha.lastIndex=0;;){const r=Ha.exec(i),a=Ha.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Ac(t,c===void 0?new Mv(o,n,e):new wv(o,n,e));break}else{let f=t.map[o];f===void 0&&(f=new bv(o),Ac(t,f)),t=f}}}class Rr{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);Ev(o,l,this)}const s=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&i.push(a)}return i}}function Rc(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const Tv=37297;let Av=0;function Rv(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const Cc=new Fe;function Cv(n){qe._getMatrix(Cc,qe.workingColorSpace,n);const e=`mat3( ${Cc.elements.map(t=>t.toFixed(4))} )`;switch(qe.getTransfer(n)){case Br:return[e,"LinearTransferOETF"];case st:return[e,"sRGBTransferOETF"];default:return Ne("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Pc(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+Rv(n.getShaderSource(e),o)}else return r}function Pv(n,e){const t=Cv(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( ${t[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}const Lv={[yh]:"Linear",[Sh]:"Reinhard",[Mh]:"Cineon",[wh]:"ACESFilmic",[Eh]:"AgX",[Th]:"Neutral",[bh]:"Custom"};function Iv(n,e){const t=Lv[e];return t===void 0?(Ne("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const pr=new K;function Dv(){qe.getLuminanceCoefficients(pr);const n=pr.x.toFixed(4),e=pr.y.toFixed(4),t=pr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Nv(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ss).join(`
`)}function Uv(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function Fv(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(e,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function Ss(n){return n!==""}function Lc(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,e.numLightProbeGrids)}function Ic(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Ov=/^[ \t]*#include +<([\w\d./]+)>/gm;function Wo(n){return n.replace(Ov,kv)}function kv(n,e){const t=He[e];if(t===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">");return Wo(t)}const Bv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Dc(n){return n.replace(Bv,zv)}function zv(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Nc(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}const Hv={[Mr]:"SHADOWMAP_TYPE_PCF",[ys]:"SHADOWMAP_TYPE_VSM"};function Gv(n){return Hv[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Vv={[Cs]:"ENVMAP_MODE_REFRACTION"};function Wv(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":Vv[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Xv={[_h]:"ENVMAP_BLENDING_MULTIPLY",[Ud]:"ENVMAP_BLENDING_MIX",[Fd]:"ENVMAP_BLENDING_ADD"};function $v(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":Xv[n.combine]||"ENVMAP_BLENDING_NONE"}function qv(n,e,t,i){const s=n.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Gv(t),c=t.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",d=Wv(t),f=$v(t),h=Nv(t),u=Uv(r),p=s.createProgram();let x,m,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(x=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,u].filter(Ss).join(`
`),x.length>0&&(x+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,u].filter(Ss).join(`
`),m.length>0&&(m+=`
`)):(x=[Nc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,u,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+t.diffuseRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ss).join(`
`),m=[Nc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,u,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+d:"",t.envMap?"#define "+f:"",t.envMapPMREM?"#define ENVMAP_MAX_LOD "+t.envMapMaxLod+".0":"",t.envMapPMREM?"#define ENVMAP_SIZE "+t.envMapSize+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Wi?"#define TONE_MAPPING":"",t.toneMapping!==Wi?He.tonemapping_pars_fragment:"",t.toneMapping!==Wi?Iv("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",He.colorspace_pars_fragment,Pv("linearToOutputTexel",t.outputColorSpace),Dv(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ss).join(`
`)),a=Wo(a),a=Lc(a,t),a=Ic(a,t),o=Wo(o),o=Lc(o,t),o=Ic(o,t),a=Dc(a),o=Dc(o),t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,x=[h,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,m=["#define varying in",t.glslVersion===zr?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===zr?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const y=v+x+a,T=v+m+o,R=Rc(s,s.VERTEX_SHADER,y),S=Rc(s,s.FRAGMENT_SHADER,T);s.attachShader(p,R),s.attachShader(p,S),t.index0AttributeName!==void 0?s.bindAttribLocation(p,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(p,0,"position"),s.linkProgram(p);function M(E){if(n.debug.checkShaderErrors){const A=s.getProgramInfoLog(p)||"",U=s.getShaderInfoLog(R)||"",N=s.getShaderInfoLog(S)||"",P=A.trim(),B=U.trim(),F=N.trim();let k=!0,I=!0;if(s.getProgramParameter(p,s.LINK_STATUS)===!1)if(k=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,p,R,S);else{const C=Pc(s,R,"vertex"),G=Pc(s,S,"fragment");Qe("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(p,s.VALIDATE_STATUS)+`

Material Name: `+E.name+`
Material Type: `+E.type+`

Program Info Log: `+P+`
`+C+`
`+G)}else P!==""?Ne("WebGLProgram: Program Info Log:",P):(B===""||F==="")&&(I=!1);I&&(E.diagnostics={runnable:k,programLog:P,vertexShader:{log:B,prefix:x},fragmentShader:{log:F,prefix:m}})}s.deleteShader(R),s.deleteShader(S),g=new Rr(s,p),_=Fv(s,p)}let g;this.getUniforms=function(){return g===void 0&&M(this),g};let _;this.getAttributes=function(){return _===void 0&&M(this),_};let L=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=s.getProgramParameter(p,Tv)),L},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(p),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Av++,this.cacheKey=e,this.usedTimes=1,this.program=p,this.vertexShader=R,this.fragmentShader=S,this}let Yv=0;class Kv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){const s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new Zv(e),t.set(e,i)),i}}class Zv{constructor(e){this.id=Yv++,this.code=e,this.usedTimes=0}}function Jv(n){return n===bn||n===Or||n===kr}function jv(n,e,t,i,s,r){const a=new Bh,o=new Kv,l=new Set,c=[],d=new Map,f=i.logarithmicDepthBuffer,h={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function u(g){return l.add(g),g===0?"uv":`uv${g}`}function p(g,_,L,E,A,U){const N=E.fog,P=A.geometry,B=g.isMeshStandardMaterial||g.isMeshLambertMaterial||g.isMeshPhongMaterial?E.environment:null,F=g.isMeshStandardMaterial||g.isMeshLambertMaterial&&!g.envMap||g.isMeshPhongMaterial&&!g.envMap,k=e.get(g.envMap||B,F),I=h[g.type];let C=i.precision;g.precision!==null&&(C=i.getMaxPrecision(g.precision),C!==g.precision&&Ne("WebGLProgram.getParameters:",g.precision,"not supported, using",C,"instead."));const G=P.morphAttributes.position||P.morphAttributes.normal||P.morphAttributes.color,W=G!==void 0?G.length:0;let ee=0;P.morphAttributes.position!==void 0&&(ee=1),P.morphAttributes.normal!==void 0&&(ee=2),P.morphAttributes.color!==void 0&&(ee=3);let ne,V,ie,ve;if(I){const ye=Ri[I];ne=ye.vertexShader,V=ye.fragmentShader}else{ne=g.vertexShader,V=g.fragmentShader;const ye=o.getVertexShaderStage(g),nt=o.getFragmentShaderStage(g);o.update(g,ye,nt),ie=ye.id,ve=nt.id}const _e=n.getRenderTarget(),ae=n.state.buffers.depth.getReversed(),Le=A.isInstancedMesh===!0,rt=A.isBatchedMesh===!0,Re=!!g.map,Ge=!!g.matcap,se=!!k,ge=se&&k.isPMREMTexture===!0,Ae=!!g.aoMap,it=!!g.lightMap,Dt=!!g.bumpMap&&g.wireframe===!1,mt=!!g.normalMap,bi=!!g.displacementMap,Et=!!g.emissiveMap,Qt=!!g.metalnessMap,ei=!!g.roughnessMap,ti=g.anisotropy>0,H=g.clearcoat>0,ii=g.diffuseRoughness>0,ft=g.dispersion>0,dt=g.retroreflectivity>0,xe=g.iridescence>0,Mt=g.sheen>0,De=g.transmission>0,Ue=ti&&!!g.anisotropyMap,D=H&&!!g.clearcoatMap,w=H&&!!g.clearcoatNormalMap,$=H&&!!g.clearcoatRoughnessMap,re=ii&&!!g.diffuseRoughnessMap,te=xe&&!!g.iridescenceMap,ce=xe&&!!g.iridescenceThicknessMap,pe=Mt&&!!g.sheenColorMap,J=Mt&&!!g.sheenRoughnessMap,j=!!g.specularMap,ue=!!g.specularColorMap,O=!!g.specularIntensityMap,Q=De&&!!g.transmissionMap,Z=De&&!!g.thicknessMap,fe=!!g.gradientMap,le=!!g.alphaMap,he=g.alphaTest>0,Pe=!!g.alphaHash,ze=!!g.extensions;let oe=Wi;g.toneMapped&&(_e===null||_e.isXRRenderTarget===!0)&&(oe=n.toneMapping);const Ie=ge?k.isCompressedCubeTexture?k.image[0].mipmaps:k.mipmaps:null,Be={shaderID:I,shaderType:g.type,shaderName:g.name,vertexShader:ne,fragmentShader:V,defines:g.defines,customVertexShaderID:ie,customFragmentShaderID:ve,isRawShaderMaterial:g.isRawShaderMaterial===!0,glslVersion:g.glslVersion,precision:C,batching:rt,batchingColor:rt&&A._colorsTexture!==null,instancing:Le,instancingColor:Le&&A.instanceColor!==null,instancingMorph:Le&&A.morphTexture!==null,outputColorSpace:_e===null?n.outputColorSpace:_e.isXRRenderTarget===!0?_e.texture.colorSpace:qe.workingColorSpace,alphaToCoverage:!!g.alphaToCoverage,map:Re,matcap:Ge,envMap:se,envMapMode:se&&k.mapping,envMapPMREM:ge,envMapMaxLod:ge?Ie.length-1:null,envMapSize:ge?Ie[0].width:null,aoMap:Ae,lightMap:it,bumpMap:Dt,normalMap:mt,displacementMap:bi,emissiveMap:Et,normalMapObjectSpace:mt&&g.normalMapType===Bd,normalMapTangentSpace:mt&&g.normalMapType===Zl,packedNormalMap:mt&&g.normalMapType===Zl&&Jv(g.normalMap.format),metalnessMap:Qt,roughnessMap:ei,anisotropy:ti,anisotropyMap:Ue,clearcoat:H,clearcoatMap:D,clearcoatNormalMap:w,clearcoatRoughnessMap:$,diffuseRoughness:ii,diffuseRoughnessMap:re,dispersion:ft,retroreflection:dt,iridescence:xe,iridescenceMap:te,iridescenceThicknessMap:ce,sheen:Mt,sheenColorMap:pe,sheenRoughnessMap:J,specularMap:j,specularColorMap:ue,specularIntensityMap:O,transmission:De,transmissionMap:Q,thicknessMap:Z,gradientMap:fe,opaque:g.transparent===!1&&g.blending===Ts&&g.alphaToCoverage===!1,alphaMap:le,alphaTest:he,alphaHash:Pe,combine:g.combine,mapUv:Re&&u(g.map.channel),aoMapUv:Ae&&u(g.aoMap.channel),lightMapUv:it&&u(g.lightMap.channel),bumpMapUv:Dt&&u(g.bumpMap.channel),normalMapUv:mt&&u(g.normalMap.channel),displacementMapUv:bi&&u(g.displacementMap.channel),emissiveMapUv:Et&&u(g.emissiveMap.channel),metalnessMapUv:Qt&&u(g.metalnessMap.channel),roughnessMapUv:ei&&u(g.roughnessMap.channel),anisotropyMapUv:Ue&&u(g.anisotropyMap.channel),clearcoatMapUv:D&&u(g.clearcoatMap.channel),clearcoatNormalMapUv:w&&u(g.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:$&&u(g.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:re&&u(g.diffuseRoughnessMap.channel),iridescenceMapUv:te&&u(g.iridescenceMap.channel),iridescenceThicknessMapUv:ce&&u(g.iridescenceThicknessMap.channel),sheenColorMapUv:pe&&u(g.sheenColorMap.channel),sheenRoughnessMapUv:J&&u(g.sheenRoughnessMap.channel),specularMapUv:j&&u(g.specularMap.channel),specularColorMapUv:ue&&u(g.specularColorMap.channel),specularIntensityMapUv:O&&u(g.specularIntensityMap.channel),transmissionMapUv:Q&&u(g.transmissionMap.channel),thicknessMapUv:Z&&u(g.thicknessMap.channel),alphaMapUv:le&&u(g.alphaMap.channel),vertexTangents:!!P.attributes.tangent&&(mt||ti),vertexNormals:!!P.attributes.normal,vertexColors:g.vertexColors,vertexAlphas:g.vertexColors===!0&&!!P.attributes.color&&P.attributes.color.itemSize===4,pointsUvs:A.isPoints===!0&&!!P.attributes.uv&&(Re||le),fog:!!N,useFog:g.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:g.wireframe===!1&&(g.flatShading===!0||P.attributes.normal===void 0&&mt===!1&&(g.isMeshLambertMaterial||g.isMeshPhongMaterial||g.isMeshStandardMaterial||g.isMeshPhysicalMaterial)),sizeAttenuation:g.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:ae,skinning:A.isSkinnedMesh===!0,hasPositionAttribute:P.attributes.position!==void 0,morphTargets:P.morphAttributes.position!==void 0,morphNormals:P.morphAttributes.normal!==void 0,morphColors:P.morphAttributes.color!==void 0,morphTargetsCount:W,morphTextureStride:ee,numSunLights:_.sun.length,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numSunLightShadows:_.sunShadowMap.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numLightProbeGrids:U.filter(ye=>ye.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:g.dithering,shadowMapEnabled:n.shadowMap.enabled&&L.length>0,shadowMapType:n.shadowMap.type,toneMapping:oe,decodeVideoTexture:Re&&g.map.isVideoTexture===!0&&qe.getTransfer(g.map.colorSpace)===st,decodeVideoTextureEmissive:Et&&g.emissiveMap.isVideoTexture===!0&&qe.getTransfer(g.emissiveMap.colorSpace)===st,premultipliedAlpha:g.premultipliedAlpha,doubleSided:g.side===_i,flipSided:g.side===qt,useDepthPacking:g.depthPacking>=0,depthPacking:g.depthPacking||0,index0AttributeName:g.index0AttributeName,extensionClipCullDistance:ze&&g.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ze&&g.extensions.multiDraw===!0||rt)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:g.customProgramCacheKey()};return Be.vertexUv1s=l.has(1),Be.vertexUv2s=l.has(2),Be.vertexUv3s=l.has(3),l.clear(),Be}function x(g){const _=[];if(g.shaderID?_.push(g.shaderID):(_.push(g.customVertexShaderID),_.push(g.customFragmentShaderID)),g.defines!==void 0)for(const L in g.defines)_.push(L),_.push(g.defines[L]);return g.isRawShaderMaterial===!1&&(m(_,g),v(_,g),_.push(n.outputColorSpace)),_.push(g.customProgramCacheKey),_.join()}function m(g,_){g.push(_.precision),g.push(_.outputColorSpace),g.push(_.envMapMode),g.push(_.envMapPMREM),g.push(_.envMapMaxLod),g.push(_.envMapSize),g.push(_.mapUv),g.push(_.alphaMapUv),g.push(_.lightMapUv),g.push(_.aoMapUv),g.push(_.bumpMapUv),g.push(_.normalMapUv),g.push(_.displacementMapUv),g.push(_.emissiveMapUv),g.push(_.metalnessMapUv),g.push(_.roughnessMapUv),g.push(_.anisotropyMapUv),g.push(_.clearcoatMapUv),g.push(_.clearcoatNormalMapUv),g.push(_.clearcoatRoughnessMapUv),g.push(_.diffuseRoughnessMapUv),g.push(_.iridescenceMapUv),g.push(_.iridescenceThicknessMapUv),g.push(_.sheenColorMapUv),g.push(_.sheenRoughnessMapUv),g.push(_.specularMapUv),g.push(_.specularColorMapUv),g.push(_.specularIntensityMapUv),g.push(_.transmissionMapUv),g.push(_.thicknessMapUv),g.push(_.combine),g.push(_.fogExp2),g.push(_.sizeAttenuation),g.push(_.morphTargetsCount),g.push(_.numSunLights),g.push(_.numDirLights),g.push(_.numPointLights),g.push(_.numSpotLights),g.push(_.numSpotLightMaps),g.push(_.numHemiLights),g.push(_.numRectAreaLights),g.push(_.numSunLightShadows),g.push(_.numDirLightShadows),g.push(_.numPointLightShadows),g.push(_.numSpotLightShadows),g.push(_.numSpotLightShadowsWithMaps),g.push(_.numLightProbes),g.push(_.numLightProbeGrids),g.push(_.shadowMapType),g.push(_.toneMapping),g.push(_.numClippingPlanes),g.push(_.numClipIntersection),g.push(_.depthPacking)}function v(g,_){a.disableAll(),_.instancing&&a.enable(0),_.instancingColor&&a.enable(1),_.instancingMorph&&a.enable(2),_.matcap&&a.enable(3),_.envMap&&a.enable(4),_.normalMapObjectSpace&&a.enable(5),_.normalMapTangentSpace&&a.enable(6),_.clearcoat&&a.enable(7),_.iridescence&&a.enable(8),_.alphaTest&&a.enable(9),_.vertexColors&&a.enable(10),_.vertexAlphas&&a.enable(11),_.vertexUv1s&&a.enable(12),_.vertexUv2s&&a.enable(13),_.vertexUv3s&&a.enable(14),_.vertexTangents&&a.enable(15),_.anisotropy&&a.enable(16),_.alphaHash&&a.enable(17),_.batching&&a.enable(18),_.dispersion&&a.enable(19),_.retroreflection&&a.enable(24),_.diffuseRoughness&&a.enable(25),_.batchingColor&&a.enable(20),_.gradientMap&&a.enable(21),_.packedNormalMap&&a.enable(22),_.vertexNormals&&a.enable(23),g.push(a.mask),a.disableAll(),_.fog&&a.enable(0),_.useFog&&a.enable(1),_.flatShading&&a.enable(2),_.logarithmicDepthBuffer&&a.enable(3),_.reversedDepthBuffer&&a.enable(4),_.skinning&&a.enable(5),_.morphTargets&&a.enable(6),_.morphNormals&&a.enable(7),_.morphColors&&a.enable(8),_.premultipliedAlpha&&a.enable(9),_.shadowMapEnabled&&a.enable(10),_.doubleSided&&a.enable(11),_.flipSided&&a.enable(12),_.useDepthPacking&&a.enable(13),_.dithering&&a.enable(14),_.transmission&&a.enable(15),_.sheen&&a.enable(16),_.opaque&&a.enable(17),_.pointsUvs&&a.enable(18),_.decodeVideoTexture&&a.enable(19),_.decodeVideoTextureEmissive&&a.enable(20),_.alphaToCoverage&&a.enable(21),_.numLightProbeGrids>0&&a.enable(22),_.hasPositionAttribute&&a.enable(23),g.push(a.mask)}function y(g){const _=h[g.type];let L;if(_){const E=Ri[_];L=Tp.clone(E.uniforms)}else L=g.uniforms;return L}function T(g,_){let L=d.get(_);return L!==void 0?++L.usedTimes:(L=new qv(n,_,g,s),c.push(L),d.set(_,L)),L}function R(g){if(--g.usedTimes===0){const _=c.indexOf(g);c[_]=c[c.length-1],c.pop(),d.delete(g.cacheKey),g.destroy()}}function S(g){o.remove(g)}function M(){o.dispose()}return{getParameters:p,getProgramCacheKey:x,getUniforms:y,acquireProgram:T,releaseProgram:R,releaseShaderCache:S,programs:c,dispose:M}}function Qv(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,l){n.get(a)[o]=l}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function ex(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function Uc(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Fc(){const n=[];let e=0;const t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(h){let u=0;return h.isInstancedMesh&&(u+=2),h.isSkinnedMesh&&(u+=1),u}function o(h,u,p,x,m,v){let y=n[e];return y===void 0?(y={id:h.id,object:h,geometry:u,material:p,materialVariant:a(h),groupOrder:x,renderOrder:h.renderOrder,z:m,group:v},n[e]=y):(y.id=h.id,y.object=h,y.geometry=u,y.material=p,y.materialVariant=a(h),y.groupOrder=x,y.renderOrder=h.renderOrder,y.z=m,y.group=v),e++,y}function l(h,u,p,x,m,v,y){y.reversedDepth===!0&&(m=-m);const T=o(h,u,p,x,m,v);p.transmission>0?i.push(T):p.transparent===!0?s.push(T):t.push(T)}function c(h,u,p,x,m,v){const y=o(h,u,p,x,m,v);p.transmission>0?i.unshift(y):p.transparent===!0?s.unshift(y):t.unshift(y)}function d(h,u){t.length>1&&t.sort(h||ex),i.length>1&&i.sort(u||Uc),s.length>1&&s.sort(u||Uc)}function f(){for(let h=e,u=n.length;h<u;h++){const p=n[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:l,unshift:c,finish:f,sort:d}}function tx(){let n=new WeakMap;function e(i,s){const r=n.get(i);let a;return r===void 0?(a=new Fc,n.set(i,[a])):s>=r.length?(a=new Fc,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function ix(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new K,color:new tt};break;case"SpotLight":t={position:new K,direction:new K,color:new tt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new K,color:new tt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new K,skyColor:new tt,groundColor:new tt};break;case"RectAreaLight":t={color:new tt,position:new K,halfWidth:new K,halfHeight:new K};break}return n[e.id]=t,t}}}function nx(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new et};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new et};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new et,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let sx=0;function rx(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function ax(n){const e=new ix,t=nx(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new K);const s=new K,r=new xt,a=new xt;function o(c){let d=0,f=0,h=0;for(let U=0;U<9;U++)i.probe[U].set(0,0,0);let u=0,p=0,x=0,m=0,v=0,y=0,T=0,R=0,S=0,M=0,g=0,_=0,L=0,E=0;c.sort(rx);for(let U=0,N=c.length;U<N;U++){const P=c[U],B=P.color,F=P.intensity,k=P.distance;let I=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===bn?I=P.shadow.map.texture:I=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)d+=B.r*F,f+=B.g*F,h+=B.b*F;else if(P.isLightProbe){for(let C=0;C<9;C++)i.probe[C].addScaledVector(P.sh.coefficients[C],F);E++}else if(P.isSunLight){const C=e.get(P);if(C.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const G=P.shadow,W=t.get(P);W.shadowIntensity=G.intensity,W.shadowBias=G.bias,W.shadowNormalBias=G.normalBias,W.shadowRadius=G.radius,W.shadowMapSize.copy(G.mapSize).multiply(G.getFrameExtents()),i.sunShadow[p]=W,i.sunShadowMap[p]=I;const ee=G.getViewportCount();for(let ne=0;ne<ee;ne++)i.sunShadowMatrix[x+ne]=G.getMatrix(ne),i.sunShadowCascade[x+ne]=G._cascadeData[ne];x+=ee,p++}i.sun[u]=C,u++}else if(P.isDirectionalLight){const C=e.get(P);if(C.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const G=P.shadow,W=t.get(P);W.shadowIntensity=G.intensity,W.shadowBias=G.bias,W.shadowNormalBias=G.normalBias,W.shadowRadius=G.radius,W.shadowMapSize=G.mapSize,i.directionalShadow[m]=W,i.directionalShadowMap[m]=I,i.directionalShadowMatrix[m]=P.shadow.matrix,S++}i.directional[m]=C,m++}else if(P.isSpotLight){const C=e.get(P);C.position.setFromMatrixPosition(P.matrixWorld),C.color.copy(B).multiplyScalar(F),C.distance=k,C.coneCos=Math.cos(P.angle),C.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),C.decay=P.decay,i.spot[y]=C;const G=P.shadow;if(P.map&&(i.spotLightMap[_]=P.map,_++,G.updateMatrices(P),P.castShadow&&L++),i.spotLightMatrix[y]=G.matrix,P.castShadow){const W=t.get(P);W.shadowIntensity=G.intensity,W.shadowBias=G.bias,W.shadowNormalBias=G.normalBias,W.shadowRadius=G.radius,W.shadowMapSize=G.mapSize,i.spotShadow[y]=W,i.spotShadowMap[y]=I,g++}y++}else if(P.isRectAreaLight){const C=e.get(P);C.color.copy(B).multiplyScalar(F),C.halfWidth.set(P.width*.5,0,0),C.halfHeight.set(0,P.height*.5,0),i.rectArea[T]=C,T++}else if(P.isPointLight){const C=e.get(P);if(C.color.copy(P.color).multiplyScalar(P.intensity),C.distance=P.distance,C.decay=P.decay,P.castShadow){const G=P.shadow,W=t.get(P);W.shadowIntensity=G.intensity,W.shadowBias=G.bias,W.shadowNormalBias=G.normalBias,W.shadowRadius=G.radius,W.shadowMapSize=G.mapSize,W.shadowCameraNear=G.camera.near,W.shadowCameraFar=G.camera.far,i.pointShadow[v]=W,i.pointShadowMap[v]=I,i.pointShadowMatrix[v]=P.shadow.matrix,M++}i.point[v]=C,v++}else if(P.isHemisphereLight){const C=e.get(P);C.skyColor.copy(P.color).multiplyScalar(F),C.groundColor.copy(P.groundColor).multiplyScalar(F),i.hemi[R]=C,R++}}T>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Se.LTC_FLOAT_1,i.rectAreaLTC2=Se.LTC_FLOAT_2):(i.rectAreaLTC1=Se.LTC_HALF_1,i.rectAreaLTC2=Se.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=f,i.ambient[2]=h;const A=i.hash;(A.sunLength!==u||A.directionalLength!==m||A.pointLength!==v||A.spotLength!==y||A.rectAreaLength!==T||A.hemiLength!==R||A.numSunShadows!==p||A.numDirectionalShadows!==S||A.numPointShadows!==M||A.numSpotShadows!==g||A.numSpotMaps!==_||A.numLightProbes!==E)&&(i.sun.length=u,i.directional.length=m,i.spot.length=y,i.rectArea.length=T,i.point.length=v,i.hemi.length=R,i.sunShadow.length=p,i.sunShadowMap.length=p,i.sunShadowMatrix.length=x,i.sunShadowCascade.length=x,i.directionalShadow.length=S,i.directionalShadowMap.length=S,i.directionalShadowMatrix.length=S,i.pointShadow.length=M,i.pointShadowMap.length=M,i.pointShadowMatrix.length=M,i.spotShadow.length=g,i.spotShadowMap.length=g,i.spotLightMatrix.length=g+_-L,i.spotLightMap.length=_,i.numSpotLightShadowsWithMaps=L,i.numLightProbes=E,A.sunLength=u,A.directionalLength=m,A.pointLength=v,A.spotLength=y,A.rectAreaLength=T,A.hemiLength=R,A.numSunShadows=p,A.numDirectionalShadows=S,A.numPointShadows=M,A.numSpotShadows=g,A.numSpotMaps=_,A.numLightProbes=E,i.version=sx++)}function l(c,d){let f=0,h=0,u=0,p=0,x=0,m=0;const v=d.matrixWorldInverse;for(let y=0,T=c.length;y<T;y++){const R=c[y];if(R.isSunLight){const S=i.sun[f];S.direction.setFromMatrixPosition(R.matrixWorld),S.direction.transformDirection(v),f++}else if(R.isDirectionalLight){const S=i.directional[h];S.direction.setFromMatrixPosition(R.matrixWorld),s.setFromMatrixPosition(R.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(v),h++}else if(R.isSpotLight){const S=i.spot[p];S.position.setFromMatrixPosition(R.matrixWorld),S.position.applyMatrix4(v),S.direction.setFromMatrixPosition(R.matrixWorld),s.setFromMatrixPosition(R.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(v),p++}else if(R.isRectAreaLight){const S=i.rectArea[x];S.position.setFromMatrixPosition(R.matrixWorld),S.position.applyMatrix4(v),a.identity(),r.copy(R.matrixWorld),r.premultiply(v),a.extractRotation(r),S.halfWidth.set(R.width*.5,0,0),S.halfHeight.set(0,R.height*.5,0),S.halfWidth.applyMatrix4(a),S.halfHeight.applyMatrix4(a),x++}else if(R.isPointLight){const S=i.point[u];S.position.setFromMatrixPosition(R.matrixWorld),S.position.applyMatrix4(v),u++}else if(R.isHemisphereLight){const S=i.hemi[m];S.direction.setFromMatrixPosition(R.matrixWorld),S.direction.transformDirection(v),m++}}}return{setup:o,setupView:l,state:i}}function Oc(n){const e=new ax(n),t=[],i=[],s=[];function r(f){d.camera=f,t.length=0,i.length=0,s.length=0}function a(f){f.isLightProbeGrid?s.push(f):t.push(f)}function o(f){i.push(f)}function l(){e.setup(t),s.sort((f,h)=>f.priority-h.priority||f.id-h.id)}function c(f){e.setupView(t,f)}const d={lightsArray:t,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function ox(n){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new Oc(n),e.set(s,[o])):r>=a.length?(o=new Oc(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const lx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,cx=`uniform sampler2D shadow_pass;
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
}`,hx=[new K(1,0,0),new K(-1,0,0),new K(0,1,0),new K(0,-1,0),new K(0,0,1),new K(0,0,-1)],ux=[new K(0,-1,0),new K(0,-1,0),new K(0,0,1),new K(0,0,-1),new K(0,-1,0),new K(0,-1,0)],kc=new xt,xs=new K,Ga=new K;function fx(n,e,t){let i=new Vr;const s=new et,r=new et,a=new vt,o=new Cp,l=new Pp,c={},d=t.maxTextureSize,f={[wn]:qt,[qt]:wn,[_i]:_i},h=new Tn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new et},radius:{value:4}},vertexShader:lx,fragmentShader:cx}),u=h.clone();u.defines.HORIZONTAL_PASS=1;const p=new hn;p.setAttribute("position",new Mn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new $i(p,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Mr;let v=this.type;this.render=function(M,g,_){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||M.length===0)return;this.type===_d&&(Ne("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Mr);const L=n.getRenderTarget(),E=n.getActiveCubeFace(),A=n.getActiveMipmapLevel(),U=n.state;U.setBlending(jn),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const N=v!==this.type;N&&g.traverse(function(P){P.material&&(Array.isArray(P.material)?P.material.forEach(B=>B.needsUpdate=!0):P.material.needsUpdate=!0)});for(let P=0,B=M.length;P<B;P++){const F=M[P],k=F.shadow;if(k===void 0){Ne("WebGLShadowMap:",F,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;s.copy(k.mapSize);const I=k.getFrameExtents();s.multiply(I),r.copy(k.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/I.x),s.x=r.x*I.x,k.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/I.y),s.y=r.y*I.y,k.mapSize.y=r.y));const C=n.state.buffers.depth.getReversed();if(k.camera._reversedDepth=C,k.map===null||N===!0){if(k.map!==null&&(k.map.depthTexture!==null&&(k.map.depthTexture.dispose(),k.map.depthTexture=null),k.map.dispose()),this.type===ys){if(F.isPointLight){Ne("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}k.map=new Li(s.x,s.y,{format:bn,type:Di,minFilter:$t,magFilter:$t,generateMipmaps:!1}),k.map.texture.name=F.name+".shadowMap",k.map.depthTexture=new ns(s.x,s.y,Pi),k.map.depthTexture.name=F.name+".shadowMapDepth",k.map.depthTexture.format=cn,k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=Pt,k.map.depthTexture.magFilter=Pt}else F.isPointLight?(k.map=new ol(s.x),k.map.depthTexture=new Xh(s.x,Ii)):(k.map=new Li(s.x,s.y),k.map.depthTexture=new ns(s.x,s.y,Ii)),k.map.depthTexture.name=F.name+".shadowMap",k.map.depthTexture.format=cn,this.type===Mr?(k.map.depthTexture.compareFunction=C?Uh:Nh,k.map.depthTexture.minFilter=$t,k.map.depthTexture.magFilter=$t):(k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=Pt,k.map.depthTexture.magFilter=Pt);k.camera.updateProjectionMatrix()}k.map.isWebGLCubeRenderTarget!==!0&&(k.map.width!==s.x||k.map.height!==s.y)&&k.map.setSize(s.x,s.y);const G=k.map.isWebGLCubeRenderTarget?6:k.getViewportCount();F.isPointLight!==!0&&k.updateMatrices(F,_);const W=(k.camera.layers.mask&4294967294)!==0?k.camera.layers:_.layers;for(let ee=0;ee<G;ee++){const ne=k.getCamera(ee);if(F.isPointLight){const V=k.camera,ie=k.matrix,ve=F.distance||V.far;ve!==V.far&&(V.far=ve,V.updateProjectionMatrix()),xs.setFromMatrixPosition(F.matrixWorld),V.position.copy(xs),Ga.copy(V.position),Ga.add(hx[ee]),V.up.copy(ux[ee]),V.lookAt(Ga),V.updateMatrixWorld(),ie.makeTranslation(-xs.x,-xs.y,-xs.z),kc.multiplyMatrices(V.projectionMatrix,V.matrixWorldInverse),k._frustum.setFromProjectionMatrix(kc,V.coordinateSystem,V.reversedDepth)}if(k.map.isWebGLCubeRenderTarget)n.setRenderTarget(k.map,ee),n.clear();else{ee===0&&(n.setRenderTarget(k.map),n.clear());const V=k.getViewport(ee);a.set(r.x*V.x,r.y*V.y,r.x*V.z,r.y*V.w),U.viewport(a)}i=k.getFrustum(ee),R(g,_,ne,F,W,this.type)}k.isPointLightShadow!==!0&&this.type===ys&&y(k,_),k.needsUpdate=!1}v=this.type,m.needsUpdate=!1,n.setRenderTarget(L,E,A)};function y(M,g){const _=e.update(x);h.defines.VSM_SAMPLES!==M.blurSamples&&(h.defines.VSM_SAMPLES=M.blurSamples,u.defines.VSM_SAMPLES=M.blurSamples,h.needsUpdate=!0,u.needsUpdate=!0),M.mapPass===null?M.mapPass=new Li(s.x,s.y,{format:bn,type:Di}):(M.mapPass.width!==M.map.width||M.mapPass.height!==M.map.height)&&M.mapPass.setSize(M.map.width,M.map.height),h.uniforms.shadow_pass.value=M.map.depthTexture,h.uniforms.resolution.value.set(M.map.width,M.map.height),h.uniforms.radius.value=M.radius,n.setRenderTarget(M.mapPass),n.clear(),n.renderBufferDirect(g,null,_,h,x,null),u.uniforms.shadow_pass.value=M.mapPass.texture,u.uniforms.resolution.value.set(M.map.width,M.map.height),u.uniforms.radius.value=M.radius,n.setRenderTarget(M.map),n.clear(),n.renderBufferDirect(g,null,_,u,x,null)}function T(M,g,_,L){let E=null;const A=_.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(A!==void 0)E=A;else if(E=_.isPointLight===!0?l:o,n.localClippingEnabled&&g.clipShadows===!0&&Array.isArray(g.clippingPlanes)&&g.clippingPlanes.length!==0||g.displacementMap&&g.displacementScale!==0||g.alphaMap&&g.alphaTest>0||g.map&&g.alphaTest>0||g.alphaToCoverage===!0){const U=E.uuid,N=g.uuid;let P=c[U];P===void 0&&(P={},c[U]=P);let B=P[N];B===void 0&&(B=E.clone(),P[N]=B,g.addEventListener("dispose",S)),E=B}if(E.visible=g.visible,E.wireframe=g.wireframe,L===ys?E.side=g.shadowSide!==null?g.shadowSide:g.side:E.side=g.shadowSide!==null?g.shadowSide:f[g.side],E.alphaMap=g.alphaMap,E.alphaTest=g.alphaToCoverage===!0?.5:g.alphaTest,E.map=g.map,E.clipShadows=g.clipShadows,E.clippingPlanes=g.clippingPlanes,E.clipIntersection=g.clipIntersection,E.displacementMap=g.displacementMap,E.displacementScale=g.displacementScale,E.displacementBias=g.displacementBias,E.wireframeLinewidth=g.wireframeLinewidth,E.linewidth=g.linewidth,_.isPointLight===!0&&E.isMeshDistanceMaterial===!0){const U=n.properties.get(E);U.light=_}return E}function R(M,g,_,L,E,A){if(M.visible===!1)return;if(M.layers.test(E)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&A===ys)&&(!M.frustumCulled||M.intersectsFrustum(i))){M.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,M.matrixWorld);const P=e.update(M),B=M.material;if(Array.isArray(B)){const F=P.groups;for(let k=0,I=F.length;k<I;k++){const C=F[k],G=B[C.materialIndex];if(G&&G.visible){const W=T(M,G,L,A);M.onBeforeShadow(n,M,g,_,P,W,C),n.renderBufferDirect(_,null,P,W,M,C),M.onAfterShadow(n,M,g,_,P,W,C)}}}else if(B.visible){const F=T(M,B,L,A);M.onBeforeShadow(n,M,g,_,P,F,null),n.renderBufferDirect(_,null,P,F,M,null),M.onAfterShadow(n,M,g,_,P,F,null)}}const N=M.children;for(let P=0,B=N.length;P<B;P++)R(N[P],g,_,L,E,A)}function S(M){M.target.removeEventListener("dispose",S);for(const _ in c){const L=c[_],E=M.target.uuid;E in L&&(L[E].dispose(),delete L[E])}}}function dx(n,e){function t(){let O=!1;const Q=new vt;let Z=null;const fe=new vt(0,0,0,0);return{setMask:function(le){Z!==le&&!O&&(n.colorMask(le,le,le,le),Z=le)},setLocked:function(le){O=le},setClear:function(le,he,Pe,ze,oe){oe===!0&&(le*=ze,he*=ze,Pe*=ze),Q.set(le,he,Pe,ze),fe.equals(Q)===!1&&(n.clearColor(le,he,Pe,ze),fe.copy(Q))},reset:function(){O=!1,Z=null,fe.set(-1,0,0,0)}}}function i(){let O=!1,Q=!1,Z=null,fe=null,le=null;return{setReversed:function(he){if(Q!==he){const Pe=e.get("EXT_clip_control");he?Pe.clipControlEXT(Pe.LOWER_LEFT_EXT,Pe.ZERO_TO_ONE_EXT):Pe.clipControlEXT(Pe.LOWER_LEFT_EXT,Pe.NEGATIVE_ONE_TO_ONE_EXT),Q=he;const ze=le;le=null,this.setClear(ze)}},getReversed:function(){return Q},setTest:function(he){he?ae(n.DEPTH_TEST):Le(n.DEPTH_TEST)},setMask:function(he){Z!==he&&!O&&(n.depthMask(he),Z=he)},setFunc:function(he){if(Q&&(he=Zd[he]),fe!==he){switch(he){case to:n.depthFunc(n.NEVER);break;case io:n.depthFunc(n.ALWAYS);break;case no:n.depthFunc(n.LESS);break;case Rs:n.depthFunc(n.LEQUAL);break;case so:n.depthFunc(n.EQUAL);break;case ro:n.depthFunc(n.GEQUAL);break;case ao:n.depthFunc(n.GREATER);break;case oo:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}fe=he}},setLocked:function(he){O=he},setClear:function(he){le!==he&&(le=he,Q&&(he=1-he),n.clearDepth(he))},reset:function(){O=!1,Z=null,fe=null,le=null,Q=!1}}}function s(){let O=!1,Q=null,Z=null,fe=null,le=null,he=null,Pe=null,ze=null,oe=null;return{setTest:function(Ie){O||(Ie?ae(n.STENCIL_TEST):Le(n.STENCIL_TEST))},setMask:function(Ie){Q!==Ie&&!O&&(n.stencilMask(Ie),Q=Ie)},setFunc:function(Ie,Be,ye){(Z!==Ie||fe!==Be||le!==ye)&&(n.stencilFunc(Ie,Be,ye),Z=Ie,fe=Be,le=ye)},setOp:function(Ie,Be,ye){(he!==Ie||Pe!==Be||ze!==ye)&&(n.stencilOp(Ie,Be,ye),he=Ie,Pe=Be,ze=ye)},setLocked:function(Ie){O=Ie},setClear:function(Ie){oe!==Ie&&(n.clearStencil(Ie),oe=Ie)},reset:function(){O=!1,Q=null,Z=null,fe=null,le=null,he=null,Pe=null,ze=null,oe=null}}}const r=new t,a=new i,o=new s;let l={};const c=new WeakMap;let d={},f={},h={},u=new WeakMap,p=[],x=null,m=!1,v=null,y=null,T=null,R=null,S=null,M=null,g=null,_=new tt(0,0,0),L=0,E=!1,A=null,U=null,N=null,P=null,B=null;const F=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,I=0;const C=n.getParameter(n.VERSION);C.indexOf("WebGL")!==-1?(I=parseFloat(/^WebGL (\d)/.exec(C)[1]),k=I>=1):C.indexOf("OpenGL ES")!==-1&&(I=parseFloat(/^OpenGL ES (\d)/.exec(C)[1]),k=I>=2);let G=null,W={};const ee=n.getParameter(n.SCISSOR_BOX),ne=n.getParameter(n.VIEWPORT),V=new vt().fromArray(ee),ie=new vt().fromArray(ne);function ve(O,Q,Z,fe){const le=new Uint8Array(4),he=n.createTexture();n.bindTexture(O,he),n.texParameteri(O,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(O,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Pe=0;Pe<Z;Pe++)O===n.TEXTURE_3D||O===n.TEXTURE_2D_ARRAY?n.texImage3D(Q,0,n.RGBA,1,1,fe,0,n.RGBA,n.UNSIGNED_BYTE,le):n.texImage2D(Q+Pe,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,le);return he}const _e={};_e[n.TEXTURE_2D]=ve(n.TEXTURE_2D,n.TEXTURE_2D,1),_e[n.TEXTURE_CUBE_MAP]=ve(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),_e[n.TEXTURE_2D_ARRAY]=ve(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),_e[n.TEXTURE_3D]=ve(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ae(n.DEPTH_TEST),a.setFunc(Rs),Dt(!1),mt($l),ae(n.CULL_FACE),Ae(jn);function ae(O){d[O]!==!0&&(n.enable(O),d[O]=!0)}function Le(O){d[O]!==!1&&(n.disable(O),d[O]=!1)}function rt(O,Q){return h[O]!==Q?(n.bindFramebuffer(O,Q),h[O]=Q,O===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=Q),O===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=Q),!0):!1}function Re(O,Q){let Z=p,fe=!1;if(O){Z=u.get(Q),Z===void 0&&(Z=[],u.set(Q,Z));const le=O.textures;if(Z.length!==le.length||Z[0]!==n.COLOR_ATTACHMENT0){for(let he=0,Pe=le.length;he<Pe;he++)Z[he]=n.COLOR_ATTACHMENT0+he;Z.length=le.length,fe=!0}}else Z[0]!==n.BACK&&(Z[0]=n.BACK,fe=!0);fe&&n.drawBuffers(Z)}function Ge(O){return x!==O?(n.useProgram(O),x=O,!0):!1}const se={[Vi]:n.FUNC_ADD,[yd]:n.FUNC_SUBTRACT,[vh]:n.FUNC_REVERSE_SUBTRACT};se[Sd]=n.MIN,se[Md]=n.MAX;const ge={[wd]:n.ZERO,[eo]:n.ONE,[bd]:n.SRC_COLOR,[xh]:n.SRC_ALPHA,[Pd]:n.SRC_ALPHA_SATURATE,[Rd]:n.DST_COLOR,[Td]:n.DST_ALPHA,[Ed]:n.ONE_MINUS_SRC_COLOR,[Fr]:n.ONE_MINUS_SRC_ALPHA,[Cd]:n.ONE_MINUS_DST_COLOR,[Ad]:n.ONE_MINUS_DST_ALPHA,[Ld]:n.CONSTANT_COLOR,[Id]:n.ONE_MINUS_CONSTANT_COLOR,[Dd]:n.CONSTANT_ALPHA,[Nd]:n.ONE_MINUS_CONSTANT_ALPHA};function Ae(O,Q,Z,fe,le,he,Pe,ze,oe,Ie){if(O===jn){m===!0&&(Le(n.BLEND),m=!1);return}if(m===!1&&(ae(n.BLEND),m=!0),O!==gh){if(O!==v||Ie!==E){if((y!==Vi||S!==Vi)&&(n.blendEquation(n.FUNC_ADD),y=Vi,S=Vi),Ie)switch(O){case Ts:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case ql:n.blendFunc(n.ONE,n.ONE);break;case Yl:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Kl:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:Qe("WebGLState: Invalid blending: ",O);break}else switch(O){case Ts:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case ql:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Yl:Qe("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Kl:Qe("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Qe("WebGLState: Invalid blending: ",O);break}T=null,R=null,M=null,g=null,_.set(0,0,0),L=0,v=O,E=Ie}return}le=le||Q,he=he||Z,Pe=Pe||fe,(Q!==y||le!==S)&&(n.blendEquationSeparate(se[Q],se[le]),y=Q,S=le),(Z!==T||fe!==R||he!==M||Pe!==g)&&(n.blendFuncSeparate(ge[Z],ge[fe],ge[he],ge[Pe]),T=Z,R=fe,M=he,g=Pe),(ze.equals(_)===!1||oe!==L)&&(n.blendColor(ze.r,ze.g,ze.b,oe),_.copy(ze),L=oe),v=O,E=!1}function it(O,Q){O.side===_i?Le(n.CULL_FACE):ae(n.CULL_FACE);let Z=O.side===qt;Q&&(Z=!Z),Dt(Z),O.blending===Ts&&O.transparent===!1?Ae(jn):Ae(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),a.setFunc(O.depthFunc),a.setTest(O.depthTest),a.setMask(O.depthWrite),r.setMask(O.colorWrite);const fe=O.stencilWrite;o.setTest(fe),fe&&(o.setMask(O.stencilWriteMask),o.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),o.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),Et(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?ae(n.SAMPLE_ALPHA_TO_COVERAGE):Le(n.SAMPLE_ALPHA_TO_COVERAGE)}function Dt(O){A!==O&&(O?n.frontFace(n.CW):n.frontFace(n.CCW),A=O)}function mt(O){O!==vd?(ae(n.CULL_FACE),O!==U&&(O===$l?n.cullFace(n.BACK):O===xd?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Le(n.CULL_FACE),U=O}function bi(O){O!==N&&(k&&n.lineWidth(O),N=O)}function Et(O,Q,Z){O?(ae(n.POLYGON_OFFSET_FILL),(P!==Q||B!==Z)&&(P=Q,B=Z,a.getReversed()&&(Q=-Q,Z=-Z),n.polygonOffset(Q,Z))):Le(n.POLYGON_OFFSET_FILL)}function Qt(O){O?ae(n.SCISSOR_TEST):Le(n.SCISSOR_TEST)}function ei(O){O===void 0&&(O=n.TEXTURE0+F-1),G!==O&&(n.activeTexture(O),G=O)}function ti(O,Q,Z){Z===void 0&&(G===null?Z=n.TEXTURE0+F-1:Z=G);let fe=W[Z];fe===void 0&&(fe={type:void 0,texture:void 0},W[Z]=fe),(fe.type!==O||fe.texture!==Q)&&(G!==Z&&(n.activeTexture(Z),G=Z),n.bindTexture(O,Q||_e[O]),fe.type=O,fe.texture=Q)}function H(){const O=W[G];O!==void 0&&O.type!==void 0&&(n.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function ii(){try{n.compressedTexImage2D(...arguments)}catch(O){Qe("WebGLState:",O)}}function ft(){try{n.compressedTexImage3D(...arguments)}catch(O){Qe("WebGLState:",O)}}function dt(){try{n.texSubImage2D(...arguments)}catch(O){Qe("WebGLState:",O)}}function xe(){try{n.texSubImage3D(...arguments)}catch(O){Qe("WebGLState:",O)}}function Mt(){try{n.compressedTexSubImage2D(...arguments)}catch(O){Qe("WebGLState:",O)}}function De(){try{n.compressedTexSubImage3D(...arguments)}catch(O){Qe("WebGLState:",O)}}function Ue(){try{n.texStorage2D(...arguments)}catch(O){Qe("WebGLState:",O)}}function D(){try{n.texStorage3D(...arguments)}catch(O){Qe("WebGLState:",O)}}function w(){try{n.texImage2D(...arguments)}catch(O){Qe("WebGLState:",O)}}function $(){try{n.texImage3D(...arguments)}catch(O){Qe("WebGLState:",O)}}function re(O){return f[O]!==void 0?f[O]:n.getParameter(O)}function te(O,Q){f[O]!==Q&&(n.pixelStorei(O,Q),f[O]=Q)}function ce(O){V.equals(O)===!1&&(n.scissor(O.x,O.y,O.z,O.w),V.copy(O))}function pe(O){ie.equals(O)===!1&&(n.viewport(O.x,O.y,O.z,O.w),ie.copy(O))}function J(O,Q){let Z=c.get(Q);Z===void 0&&(Z=new WeakMap,c.set(Q,Z));let fe=Z.get(O);fe===void 0&&(fe=n.getUniformBlockIndex(Q,O.name),n.uniformBlockBinding(Q,fe,fe),Z.set(O,fe))}function j(O,Q,Z){const le=c.get(Q).get(O);l[le]!==Z&&(n.bindBufferBase(n.UNIFORM_BUFFER,le,Z),l[le]=Z)}function ue(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),d={},f={},G=null,W={},h={},l={},u=new WeakMap,p=[],x=null,m=!1,v=null,y=null,T=null,R=null,S=null,M=null,g=null,_=new tt(0,0,0),L=0,E=!1,A=null,U=null,N=null,P=null,B=null,V.set(0,0,n.canvas.width,n.canvas.height),ie.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ae,disable:Le,bindFramebuffer:rt,drawBuffers:Re,useProgram:Ge,setBlending:Ae,setMaterial:it,setFlipSided:Dt,setCullFace:mt,setLineWidth:bi,setPolygonOffset:Et,setScissorTest:Qt,activeTexture:ei,bindTexture:ti,unbindTexture:H,compressedTexImage2D:ii,compressedTexImage3D:ft,texImage2D:w,texImage3D:$,pixelStorei:te,getParameter:re,updateUBOMapping:J,uniformBlockBinding:j,texStorage2D:Ue,texStorage3D:D,texSubImage2D:dt,texSubImage3D:xe,compressedTexSubImage2D:Mt,compressedTexSubImage3D:De,scissor:ce,viewport:pe,reset:ue}}function px(n,e,t,i,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new et,d=new WeakMap,f=new Set;let h;const u=new WeakMap,p=new Set,x=new FinalizationRegistry(D=>p.delete(D));let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(D,w){return m?new OffscreenCanvas(D,w):Gr("canvas")}function y(D,w,$){let re=1;const te=Ue(D);if((te.width>$||te.height>$)&&(re=$/Math.max(te.width,te.height)),re<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){const ce=Math.floor(re*te.width),pe=Math.floor(re*te.height);h===void 0&&(h=v(ce,pe));const J=w?v(ce,pe):h;return J.width=ce,J.height=pe,J.getContext("2d").drawImage(D,0,0,ce,pe),Ne("WebGLRenderer: Texture has been resized from ("+te.width+"x"+te.height+") to ("+ce+"x"+pe+")."),J}else return"data"in D&&Ne("WebGLRenderer: Image in DataTexture is too big ("+te.width+"x"+te.height+")."),D;return D}function T(D){return D.generateMipmaps}function R(D){n.generateMipmap(D)}function S(D){return D.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:D.isWebGL3DRenderTarget?n.TEXTURE_3D:D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function M(D,w,$,re,te,ce=!1){if(D!==null){if(n[D]!==void 0)return n[D];Ne("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let pe;re&&(pe=e.get("EXT_texture_norm16"),pe||Ne("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let J=w;if(w===n.RED&&($===n.FLOAT&&(J=n.R32F),$===n.HALF_FLOAT&&(J=n.R16F),$===n.UNSIGNED_BYTE&&(J=n.R8),$===n.UNSIGNED_SHORT&&pe&&(J=pe.R16_EXT),$===n.SHORT&&pe&&(J=pe.R16_SNORM_EXT)),w===n.RED_INTEGER&&($===n.UNSIGNED_BYTE&&(J=n.R8UI),$===n.UNSIGNED_SHORT&&(J=n.R16UI),$===n.UNSIGNED_INT&&(J=n.R32UI),$===n.BYTE&&(J=n.R8I),$===n.SHORT&&(J=n.R16I),$===n.INT&&(J=n.R32I)),w===n.RG&&($===n.FLOAT&&(J=n.RG32F),$===n.HALF_FLOAT&&(J=n.RG16F),$===n.UNSIGNED_BYTE&&(J=n.RG8),$===n.UNSIGNED_SHORT&&pe&&(J=pe.RG16_EXT),$===n.SHORT&&pe&&(J=pe.RG16_SNORM_EXT)),w===n.RG_INTEGER&&($===n.UNSIGNED_BYTE&&(J=n.RG8UI),$===n.UNSIGNED_SHORT&&(J=n.RG16UI),$===n.UNSIGNED_INT&&(J=n.RG32UI),$===n.BYTE&&(J=n.RG8I),$===n.SHORT&&(J=n.RG16I),$===n.INT&&(J=n.RG32I)),w===n.RGB_INTEGER&&($===n.UNSIGNED_BYTE&&(J=n.RGB8UI),$===n.UNSIGNED_SHORT&&(J=n.RGB16UI),$===n.UNSIGNED_INT&&(J=n.RGB32UI),$===n.BYTE&&(J=n.RGB8I),$===n.SHORT&&(J=n.RGB16I),$===n.INT&&(J=n.RGB32I)),w===n.RGBA_INTEGER&&($===n.UNSIGNED_BYTE&&(J=n.RGBA8UI),$===n.UNSIGNED_SHORT&&(J=n.RGBA16UI),$===n.UNSIGNED_INT&&(J=n.RGBA32UI),$===n.BYTE&&(J=n.RGBA8I),$===n.SHORT&&(J=n.RGBA16I),$===n.INT&&(J=n.RGBA32I)),w===n.RGB&&($===n.UNSIGNED_SHORT&&pe&&(J=pe.RGB16_EXT),$===n.SHORT&&pe&&(J=pe.RGB16_SNORM_EXT),$===n.UNSIGNED_INT_5_9_9_9_REV&&(J=n.RGB9_E5),$===n.UNSIGNED_INT_10F_11F_11F_REV&&(J=n.R11F_G11F_B10F)),w===n.RGBA){const j=ce?Br:qe.getTransfer(te);$===n.FLOAT&&(J=n.RGBA32F),$===n.HALF_FLOAT&&(J=n.RGBA16F),$===n.UNSIGNED_BYTE&&(J=j===st?n.SRGB8_ALPHA8:n.RGBA8),$===n.UNSIGNED_SHORT&&pe&&(J=pe.RGBA16_EXT),$===n.SHORT&&pe&&(J=pe.RGBA16_SNORM_EXT),$===n.UNSIGNED_SHORT_4_4_4_4&&(J=n.RGBA4),$===n.UNSIGNED_SHORT_5_5_5_1&&(J=n.RGB5_A1)}return(J===n.R16F||J===n.R32F||J===n.RG16F||J===n.RG32F||J===n.RGBA16F||J===n.RGBA32F)&&e.get("EXT_color_buffer_float"),J}function g(D,w){let $;return D?w===null||w===Ii||w===is?$=n.DEPTH24_STENCIL8:w===Pi?$=n.DEPTH32F_STENCIL8:w===Ps&&($=n.DEPTH24_STENCIL8,Ne("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===Ii||w===is?$=n.DEPTH_COMPONENT24:w===Pi?$=n.DEPTH_COMPONENT32F:w===Ps&&($=n.DEPTH_COMPONENT16),$}function _(D,w){return T(D)===!0||D.isFramebufferTexture&&D.minFilter!==Pt&&D.minFilter!==$t?Math.log2(Math.max(w.width,w.height))+1:D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?w.mipmaps.length:1}function L(D){const w=new WeakRef(D);i.get(D).__ref=w,p.add(w),x.register(D,w,w)}function E(D){const w=i.get(D).__ref;w!==void 0&&(p.delete(w),x.unregister(w))}function A(D){N(D.target)}function U(D){P(D.target)}function N(D){D.removeEventListener("dispose",A),E(D),F(D),D.isVideoTexture&&d.delete(D),D.isHTMLTexture&&f.delete(D)}function P(D){D.removeEventListener("dispose",U),E(D),I(D)}function B(){for(const D of p){const w=D.deref();w!==void 0&&(w.isRenderTarget===!0?P(w):N(w))}p.clear(),f.clear()}function F(D){const w=i.get(D);if(w.__webglInit===void 0)return;const $=D.source,re=u.get($);if(re){const te=re[w.__cacheKey];te.usedTimes--,te.usedTimes===0&&k(D),Object.keys(re).length===0&&u.delete($)}i.remove(D)}function k(D){const w=i.get(D);n.deleteTexture(w.__webglTexture);const $=D.source,re=u.get($);delete re[w.__cacheKey],a.memory.textures--}function I(D){const w=i.get(D);w.__depthDisposeCallback&&w.__depthDisposeCallback();const $=D.depthTexture;if($&&$.renderTarget===D&&N($),D.isWebGLCubeRenderTarget)for(let te=0;te<6;te++){if(Array.isArray(w.__webglFramebuffer[te]))for(let ce=0;ce<w.__webglFramebuffer[te].length;ce++)n.deleteFramebuffer(w.__webglFramebuffer[te][ce]);else n.deleteFramebuffer(w.__webglFramebuffer[te]);w.__webglDepthbuffer&&n.deleteRenderbuffer(w.__webglDepthbuffer[te])}else{if(Array.isArray(w.__webglFramebuffer))for(let te=0;te<w.__webglFramebuffer.length;te++)n.deleteFramebuffer(w.__webglFramebuffer[te]);else n.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&n.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&n.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let te=0;te<w.__webglColorRenderbuffer.length;te++)w.__webglColorRenderbuffer[te]&&n.deleteRenderbuffer(w.__webglColorRenderbuffer[te]);w.__webglDepthRenderbuffer&&n.deleteRenderbuffer(w.__webglDepthRenderbuffer)}const re=D.textures;for(let te=0,ce=re.length;te<ce;te++){const pe=i.get(re[te]);pe.__webglTexture&&(n.deleteTexture(pe.__webglTexture),a.memory.textures--),i.remove(re[te])}i.remove(D)}let C=0;function G(){C=0}function W(){return C}function ee(D){C=D}function ne(){const D=C;return D>=s.maxTextures&&Ne("WebGLTextures: Trying to use "+(D+1)+" texture units while this GPU supports only "+s.maxTextures),C+=1,D}function V(D){const w=[];return w.push(D.wrapS),w.push(D.wrapT),w.push(D.wrapR||0),w.push(D.magFilter),w.push(D.minFilter),w.push(D.anisotropy),w.push(D.internalFormat),w.push(D.format),w.push(D.type),w.push(D.generateMipmaps),w.push(D.mipmapsAutoUpdate),w.push(D.premultiplyAlpha),w.push(D.flipY),w.push(D.unpackAlignment),w.push(D.colorSpace),w.join()}function ie(D,w){const $=i.get(D);if(D.isVideoTexture&&Mt(D),D.isRenderTargetTexture===!1&&D.isExternalTexture!==!0&&D.version>0&&$.__version!==D.version){const re=D.image;if(re===null)Ne("WebGLRenderer: Texture marked for update but no image data found.");else if(re.complete===!1)Ne("WebGLRenderer: Texture marked for update but image is incomplete");else{it($,D,w);return}}else D.isExternalTexture&&($.__webglTexture=D.sourceTexture?D.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,$.__webglTexture,n.TEXTURE0+w)}function ve(D,w){const $=i.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&$.__version!==D.version){it($,D,w);return}else D.isExternalTexture&&($.__webglTexture=D.sourceTexture?D.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,$.__webglTexture,n.TEXTURE0+w)}function _e(D,w){const $=i.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&$.__version!==D.version){it($,D,w);return}t.bindTexture(n.TEXTURE_3D,$.__webglTexture,n.TEXTURE0+w)}function ae(D,w){const $=i.get(D);if(D.version>0&&$.__version!==D.version){Dt($,D,w);return}t.bindTexture(n.TEXTURE_CUBE_MAP,$.__webglTexture,n.TEXTURE0+w)}const Le={[lo]:n.REPEAT,[Ci]:n.CLAMP_TO_EDGE,[co]:n.MIRRORED_REPEAT},rt={[Pt]:n.NEAREST,[Od]:n.NEAREST_MIPMAP_NEAREST,[$s]:n.NEAREST_MIPMAP_LINEAR,[$t]:n.LINEAR,[va]:n.LINEAR_MIPMAP_NEAREST,[on]:n.LINEAR_MIPMAP_LINEAR},Re={[Hd]:n.NEVER,[Fh]:n.ALWAYS,[Gd]:n.LESS,[Nh]:n.LEQUAL,[Vd]:n.EQUAL,[Uh]:n.GEQUAL,[Wd]:n.GREATER,[Xd]:n.NOTEQUAL};function Ge(D,w){if(w.type===Pi&&e.has("OES_texture_float_linear")===!1&&(w.magFilter===$t||w.magFilter===va||w.magFilter===$s||w.magFilter===on||w.minFilter===$t||w.minFilter===va||w.minFilter===$s||w.minFilter===on)&&Ne("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(D,n.TEXTURE_WRAP_S,Le[w.wrapS]),n.texParameteri(D,n.TEXTURE_WRAP_T,Le[w.wrapT]),(D===n.TEXTURE_3D||D===n.TEXTURE_2D_ARRAY)&&n.texParameteri(D,n.TEXTURE_WRAP_R,Le[w.wrapR]),n.texParameteri(D,n.TEXTURE_MAG_FILTER,rt[w.magFilter]),n.texParameteri(D,n.TEXTURE_MIN_FILTER,rt[w.minFilter]),w.compareFunction&&(n.texParameteri(D,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(D,n.TEXTURE_COMPARE_FUNC,Re[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===Pt||w.minFilter!==$s&&w.minFilter!==on||w.type===Pi&&e.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||i.get(w).__currentAnisotropy){const $=e.get("EXT_texture_filter_anisotropic");n.texParameterf(D,$.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,s.getMaxAnisotropy())),i.get(w).__currentAnisotropy=w.anisotropy}}}function se(D,w){let $=!1;D.__webglInit===void 0&&(D.__webglInit=!0,w.addEventListener("dispose",A),L(w));const re=w.source;let te=u.get(re);te===void 0&&(te={},u.set(re,te));const ce=V(w);if(ce!==D.__cacheKey){te[ce]===void 0&&(te[ce]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,$=!0),te[ce].usedTimes++;const pe=te[D.__cacheKey];pe!==void 0&&(te[D.__cacheKey].usedTimes--,pe.usedTimes===0&&k(w)),D.__cacheKey=ce,D.__webglTexture=te[ce].texture}return $}function ge(D,w,$){return Math.floor(Math.floor(D/$)/w)}function Ae(D,w,$,re){const ce=D.updateRanges;if(ce.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,w.width,w.height,$,re,w.data);else{ce.sort((O,Q)=>O.start-Q.start);let pe=0;for(let O=1;O<ce.length;O++){const Q=ce[pe],Z=ce[O],fe=Q.start+Q.count,le=ge(Z.start,w.width,4),he=ge(Q.start,w.width,4);Z.start<=fe+1&&le===he&&ge(Z.start+Z.count-1,w.width,4)===le?Q.count=Math.max(Q.count,Z.start+Z.count-Q.start):(++pe,ce[pe]=Z)}ce.length=pe+1;const J=t.getParameter(n.UNPACK_ROW_LENGTH),j=t.getParameter(n.UNPACK_SKIP_PIXELS),ue=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,w.width);for(let O=0,Q=ce.length;O<Q;O++){const Z=ce[O],fe=Math.floor(Z.start/4),le=Math.ceil(Z.count/4),he=fe%w.width,Pe=Math.floor(fe/w.width),ze=le,oe=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,he),t.pixelStorei(n.UNPACK_SKIP_ROWS,Pe),t.texSubImage2D(n.TEXTURE_2D,0,he,Pe,ze,oe,$,re,w.data)}D.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,J),t.pixelStorei(n.UNPACK_SKIP_PIXELS,j),t.pixelStorei(n.UNPACK_SKIP_ROWS,ue)}}function it(D,w,$){let re=n.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(re=n.TEXTURE_2D_ARRAY),w.isData3DTexture&&(re=n.TEXTURE_3D);const te=se(D,w),ce=w.source;t.bindTexture(re,D.__webglTexture,n.TEXTURE0+$);const pe=i.get(ce);if(ce.version!==pe.__version||te===!0){if(t.activeTexture(n.TEXTURE0+$),(typeof ImageBitmap<"u"&&w.image instanceof ImageBitmap)===!1){const oe=qe.getPrimaries(qe.workingColorSpace),Ie=w.colorSpace===rn?null:qe.getPrimaries(w.colorSpace),Be=w.colorSpace===rn||oe===Ie?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,w.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Be)}t.pixelStorei(n.UNPACK_ALIGNMENT,w.unpackAlignment);let j=y(w.image,!1,s.maxTextureSize);j=De(w,j);const ue=r.convert(w.format,w.colorSpace),O=r.convert(w.type);let Q=M(w.internalFormat,ue,O,w.normalized,w.colorSpace,w.isVideoTexture);Ge(re,w);let Z;const fe=w.mipmaps,le=w.isVideoTexture!==!0,he=pe.__version===void 0||te===!0,Pe=ce.dataReady,ze=_(w,j);if(w.isDepthTexture)Q=g(w.format===ln,w.type),he&&(le?t.texStorage2D(n.TEXTURE_2D,1,Q,j.width,j.height):t.texImage2D(n.TEXTURE_2D,0,Q,j.width,j.height,0,ue,O,null));else if(w.isDataTexture)if(fe.length>0){le&&he&&t.texStorage2D(n.TEXTURE_2D,ze,Q,fe[0].width,fe[0].height);for(let oe=0,Ie=fe.length;oe<Ie;oe++)Z=fe[oe],le?Pe&&t.texSubImage2D(n.TEXTURE_2D,oe,0,0,Z.width,Z.height,ue,O,Z.data):t.texImage2D(n.TEXTURE_2D,oe,Q,Z.width,Z.height,0,ue,O,Z.data);w.generateMipmaps=!1}else le?(he&&t.texStorage2D(n.TEXTURE_2D,ze,Q,j.width,j.height),Pe&&Ae(w,j,ue,O)):t.texImage2D(n.TEXTURE_2D,0,Q,j.width,j.height,0,ue,O,j.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){le&&he&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ze,Q,fe[0].width,fe[0].height,j.depth);for(let oe=0,Ie=fe.length;oe<Ie;oe++)if(Z=fe[oe],w.format!==Si)if(ue!==null)if(le){if(Pe)if(w.layerUpdates.size>0){const Be=vc(Z.width,Z.height,w.format,w.type);for(const ye of w.layerUpdates){const nt=Z.data.subarray(ye*Be/Z.data.BYTES_PER_ELEMENT,(ye+1)*Be/Z.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,oe,0,0,ye,Z.width,Z.height,1,ue,nt)}}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,oe,0,0,0,Z.width,Z.height,j.depth,ue,Z.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,oe,Q,Z.width,Z.height,j.depth,0,Z.data,0,0);else Ne("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else le?Pe&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,oe,0,0,0,Z.width,Z.height,j.depth,ue,O,Z.data):t.texImage3D(n.TEXTURE_2D_ARRAY,oe,Q,Z.width,Z.height,j.depth,0,ue,O,Z.data);w.layerUpdates.size>0&&w.clearLayerUpdates()}else{le&&he&&t.texStorage2D(n.TEXTURE_2D,ze,Q,fe[0].width,fe[0].height);for(let oe=0,Ie=fe.length;oe<Ie;oe++)Z=fe[oe],w.format!==Si?ue!==null?le?Pe&&t.compressedTexSubImage2D(n.TEXTURE_2D,oe,0,0,Z.width,Z.height,ue,Z.data):t.compressedTexImage2D(n.TEXTURE_2D,oe,Q,Z.width,Z.height,0,Z.data):Ne("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):le?Pe&&t.texSubImage2D(n.TEXTURE_2D,oe,0,0,Z.width,Z.height,ue,O,Z.data):t.texImage2D(n.TEXTURE_2D,oe,Q,Z.width,Z.height,0,ue,O,Z.data)}else if(w.isDataArrayTexture)if(le){if(he&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ze,Q,j.width,j.height,j.depth),Pe)if(w.layerUpdates.size>0){const oe=vc(j.width,j.height,w.format,w.type);for(const Ie of w.layerUpdates){const Be=j.data.subarray(Ie*oe/j.data.BYTES_PER_ELEMENT,(Ie+1)*oe/j.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Ie,j.width,j.height,1,ue,O,Be)}w.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,j.width,j.height,j.depth,ue,O,j.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Q,j.width,j.height,j.depth,0,ue,O,j.data);else if(w.isData3DTexture)le?(he&&t.texStorage3D(n.TEXTURE_3D,ze,Q,j.width,j.height,j.depth),Pe&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,j.width,j.height,j.depth,ue,O,j.data)):t.texImage3D(n.TEXTURE_3D,0,Q,j.width,j.height,j.depth,0,ue,O,j.data);else if(w.isFramebufferTexture){if(he)if(le)t.texStorage2D(n.TEXTURE_2D,ze,Q,j.width,j.height);else{let oe=j.width,Ie=j.height;for(let Be=0;Be<ze;Be++)t.texImage2D(n.TEXTURE_2D,Be,Q,oe,Ie,0,ue,O,null),oe>>=1,Ie>>=1}}else if(w.isHTMLTexture){if("texElementImage2D"in n){const oe=n.canvas;if(oe.hasAttribute("layoutsubtree")||oe.setAttribute("layoutsubtree","true"),j.parentNode!==oe){oe.appendChild(j),f.add(w),oe.onpaint=Ie=>{const Be=Ie.changedElements;for(const ye of f)Be.includes(ye.image)&&(ye.needsUpdate=!0)},oe.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,j);else{const Be=n.RGBA,ye=n.RGBA,nt=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,Be,ye,nt,j)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(fe.length>0){if(le&&he){const oe=Ue(fe[0]);t.texStorage2D(n.TEXTURE_2D,ze,Q,oe.width,oe.height)}for(let oe=0,Ie=fe.length;oe<Ie;oe++)Z=fe[oe],le?Pe&&t.texSubImage2D(n.TEXTURE_2D,oe,0,0,ue,O,Z):t.texImage2D(n.TEXTURE_2D,oe,Q,ue,O,Z);w.generateMipmaps=!1}else if(le){if(he){const oe=Ue(j);t.texStorage2D(n.TEXTURE_2D,ze,Q,oe.width,oe.height)}Pe&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ue,O,j)}else t.texImage2D(n.TEXTURE_2D,0,Q,ue,O,j);T(w)&&w.mipmapsAutoUpdate===!0&&R(re),pe.__version=ce.version,w.onUpdate&&w.onUpdate(w)}D.__version=w.version}function Dt(D,w,$){if(w.image.length!==6)return;const re=se(D,w),te=w.source;t.bindTexture(n.TEXTURE_CUBE_MAP,D.__webglTexture,n.TEXTURE0+$);const ce=i.get(te);if(te.version!==ce.__version||re===!0){t.activeTexture(n.TEXTURE0+$);const pe=qe.getPrimaries(qe.workingColorSpace),J=w.colorSpace===rn?null:qe.getPrimaries(w.colorSpace),j=w.colorSpace===rn||pe===J?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,w.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,w.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,j);const ue=w.isCompressedTexture||w.image[0].isCompressedTexture,O=w.image[0]&&w.image[0].isDataTexture,Q=[];for(let ye=0;ye<6;ye++)!ue&&!O?Q[ye]=y(w.image[ye],!0,s.maxCubemapSize):Q[ye]=O?w.image[ye].image:w.image[ye],Q[ye]=De(w,Q[ye]);const Z=Q[0],fe=r.convert(w.format,w.colorSpace),le=r.convert(w.type);let he=M(w.internalFormat,fe,le,w.normalized,w.colorSpace);const Pe=w.isVideoTexture!==!0,ze=ce.__version===void 0||re===!0,oe=te.dataReady;let Ie=_(w,Z);Ge(n.TEXTURE_CUBE_MAP,w);let Be;if(w.isDepthTexture){if(he=g(w.format===ln,w.type),ze)if(Pe)t.texStorage2D(n.TEXTURE_CUBE_MAP,1,he,Z.width,Z.height);else for(let ye=0;ye<6;ye++)t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,he,Z.width,Z.height,0,fe,le,null)}else if(ue){Pe&&ze&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Ie,he,Z.width,Z.height);for(let ye=0;ye<6;ye++){Be=Q[ye].mipmaps;for(let nt=0;nt<Be.length;nt++){const Tt=Be[nt];w.format!==Si?fe!==null?Pe?oe&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,nt,0,0,Tt.width,Tt.height,fe,Tt.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,nt,he,Tt.width,Tt.height,0,Tt.data):Ne("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Pe?oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,nt,0,0,Tt.width,Tt.height,fe,le,Tt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,nt,he,Tt.width,Tt.height,0,fe,le,Tt.data)}}}else{if(Be=w.mipmaps,Pe&&ze){Be.length>0&&Ie++;const ye=Ue(Q[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Ie,he,ye.width,ye.height)}for(let ye=0;ye<6;ye++)if(O){Pe?oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,0,0,Q[ye].width,Q[ye].height,fe,le,Q[ye].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,he,Q[ye].width,Q[ye].height,0,fe,le,Q[ye].data);for(let nt=0;nt<Be.length;nt++){const qi=Be[nt].image[ye].image;Pe?oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,nt+1,0,0,qi.width,qi.height,fe,le,qi.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,nt+1,he,qi.width,qi.height,0,fe,le,qi.data)}}else{Pe?oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,0,0,fe,le,Q[ye]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,he,fe,le,Q[ye]);for(let nt=0;nt<Be.length;nt++){const Tt=Be[nt];Pe?oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,nt+1,0,0,fe,le,Tt.image[ye]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,nt+1,he,fe,le,Tt.image[ye])}}}T(w)&&w.mipmapsAutoUpdate===!0&&R(n.TEXTURE_CUBE_MAP),ce.__version=te.version,w.onUpdate&&w.onUpdate(w)}D.__version=w.version}function mt(D,w,$,re,te,ce){const pe=r.convert($.format,$.colorSpace),J=r.convert($.type),j=M($.internalFormat,pe,J,$.normalized,$.colorSpace),ue=i.get(w),O=i.get($);if(O.__renderTarget=w,!ue.__hasExternalTextures){const Q=Math.max(1,w.width>>ce),Z=Math.max(1,w.height>>ce);te===n.TEXTURE_3D||te===n.TEXTURE_2D_ARRAY?t.texImage3D(te,ce,j,Q,Z,w.depth,0,pe,J,null):t.texImage2D(te,ce,j,Q,Z,0,pe,J,null)}t.bindFramebuffer(n.FRAMEBUFFER,D),xe(w)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,re,te,O.__webglTexture,0,dt(w)):(te===n.TEXTURE_2D||te>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&te<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,re,te,O.__webglTexture,ce),t.bindFramebuffer(n.FRAMEBUFFER,null)}function bi(D,w,$){if(n.bindRenderbuffer(n.RENDERBUFFER,D),w.depthBuffer){const re=w.depthTexture,te=re&&re.isDepthTexture?re.type:null,ce=g(w.stencilBuffer,te),pe=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;xe(w)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,dt(w),ce,w.width,w.height):$?n.renderbufferStorageMultisample(n.RENDERBUFFER,dt(w),ce,w.width,w.height):n.renderbufferStorage(n.RENDERBUFFER,ce,w.width,w.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,pe,n.RENDERBUFFER,D)}else{const re=w.textures;for(let te=0;te<re.length;te++){const ce=re[te],pe=r.convert(ce.format,ce.colorSpace),J=r.convert(ce.type),j=M(ce.internalFormat,pe,J,ce.normalized,ce.colorSpace);xe(w)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,dt(w),j,w.width,w.height):$?n.renderbufferStorageMultisample(n.RENDERBUFFER,dt(w),j,w.width,w.height):n.renderbufferStorage(n.RENDERBUFFER,j,w.width,w.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Et(D,w,$){const re=w.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,D),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const te=i.get(w.depthTexture);te.__renderTarget=w;const ce=re?w.depthTexture.image[0]:w.depthTexture.image;(!te.__webglTexture||ce.width!==w.width||ce.height!==w.height)&&(ce.width=w.width,ce.height=w.height,w.depthTexture.needsUpdate=!0),re?ae(w.depthTexture,0):ie(w.depthTexture,0);const pe=te.__webglTexture,J=dt(w),j=re?n.TEXTURE_CUBE_MAP_POSITIVE_X+$:n.TEXTURE_2D,ue=w.depthTexture.format===ln?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(w.depthTexture.format===cn)xe(w)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ue,j,pe,0,J):n.framebufferTexture2D(n.FRAMEBUFFER,ue,j,pe,0);else if(w.depthTexture.format===ln)xe(w)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ue,j,pe,0,J):n.framebufferTexture2D(n.FRAMEBUFFER,ue,j,pe,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Qt(D){const w=i.get(D),$=D.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==D.depthTexture){const re=D.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),re){const te=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,re.removeEventListener("dispose",te)};re.addEventListener("dispose",te),w.__depthDisposeCallback=te}w.__boundDepthTexture=re}if(D.depthTexture&&!w.__autoAllocateDepthBuffer)if($)for(let re=0;re<6;re++)Et(w.__webglFramebuffer[re],D,re);else D.texture.mipmaps.length>0?Et(w.__webglFramebuffer[0],D,0):Et(w.__webglFramebuffer,D,0);else if($){w.__webglDepthbuffer=[];for(let re=0;re<6;re++)if(t.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer[re]),w.__webglDepthbuffer[re]===void 0)w.__webglDepthbuffer[re]=n.createRenderbuffer(),bi(w.__webglDepthbuffer[re],D,!1);else{const te=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ce=w.__webglDepthbuffer[re];n.bindRenderbuffer(n.RENDERBUFFER,ce),n.framebufferRenderbuffer(n.FRAMEBUFFER,te,n.RENDERBUFFER,ce)}}else if(D.texture.mipmaps.length>0?t.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=n.createRenderbuffer(),bi(w.__webglDepthbuffer,D,!1);else{const te=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ce=w.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ce),n.framebufferRenderbuffer(n.FRAMEBUFFER,te,n.RENDERBUFFER,ce)}t.bindFramebuffer(n.FRAMEBUFFER,null)}function ei(D,w,$){const re=i.get(D);w!==void 0&&mt(re.__webglFramebuffer,D,D.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),$!==void 0&&Qt(D)}function ti(D){const w=D.texture,$=i.get(D),re=i.get(w);D.addEventListener("dispose",U),L(D);const te=D.textures,ce=D.isWebGLCubeRenderTarget===!0,pe=te.length>1;if(pe||(re.__webglTexture===void 0&&(re.__webglTexture=n.createTexture()),re.__version=w.version,a.memory.textures++),ce){$.__webglFramebuffer=[];for(let J=0;J<6;J++)if(w.mipmaps.length>0){$.__webglFramebuffer[J]=[];for(let j=0;j<w.mipmaps.length;j++)$.__webglFramebuffer[J][j]=n.createFramebuffer()}else $.__webglFramebuffer[J]=n.createFramebuffer()}else{if(w.mipmaps.length>0){$.__webglFramebuffer=[];for(let J=0;J<w.mipmaps.length;J++)$.__webglFramebuffer[J]=n.createFramebuffer()}else $.__webglFramebuffer=n.createFramebuffer();if(pe)for(let J=0,j=te.length;J<j;J++){const ue=i.get(te[J]);ue.__webglTexture===void 0&&(ue.__webglTexture=n.createTexture(),a.memory.textures++)}if(D.samples>0&&xe(D)===!1){$.__webglMultisampledFramebuffer=n.createFramebuffer(),$.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,$.__webglMultisampledFramebuffer);for(let J=0;J<te.length;J++){const j=te[J];$.__webglColorRenderbuffer[J]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,$.__webglColorRenderbuffer[J]);const ue=r.convert(j.format,j.colorSpace),O=r.convert(j.type),Q=M(j.internalFormat,ue,O,j.normalized,j.colorSpace,D.isXRRenderTarget===!0),Z=dt(D);n.renderbufferStorageMultisample(n.RENDERBUFFER,Z,Q,D.width,D.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+J,n.RENDERBUFFER,$.__webglColorRenderbuffer[J])}n.bindRenderbuffer(n.RENDERBUFFER,null),D.depthBuffer&&($.__webglDepthRenderbuffer=n.createRenderbuffer(),bi($.__webglDepthRenderbuffer,D,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ce){t.bindTexture(n.TEXTURE_CUBE_MAP,re.__webglTexture),Ge(n.TEXTURE_CUBE_MAP,w);for(let J=0;J<6;J++)if(w.mipmaps.length>0)for(let j=0;j<w.mipmaps.length;j++)mt($.__webglFramebuffer[J][j],D,w,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+J,j);else mt($.__webglFramebuffer[J],D,w,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0);T(w)?R(n.TEXTURE_CUBE_MAP):w.mipmaps.length>0&&n.texParameteri(n.TEXTURE_CUBE_MAP,n.TEXTURE_MAX_LEVEL,w.mipmaps.length-1),t.unbindTexture()}else if(pe){for(let J=0,j=te.length;J<j;J++){const ue=te[J],O=i.get(ue);let Q=n.TEXTURE_2D;(D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(Q=D.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Q,O.__webglTexture),Ge(Q,ue),mt($.__webglFramebuffer,D,ue,n.COLOR_ATTACHMENT0+J,Q,0),T(ue)&&R(Q)}t.unbindTexture()}else{let J=n.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(J=D.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(J,re.__webglTexture),Ge(J,w),w.mipmaps.length>0)for(let j=0;j<w.mipmaps.length;j++)mt($.__webglFramebuffer[j],D,w,n.COLOR_ATTACHMENT0,J,j);else mt($.__webglFramebuffer,D,w,n.COLOR_ATTACHMENT0,J,0);T(w)?R(J):w.mipmaps.length>0&&n.texParameteri(J,n.TEXTURE_MAX_LEVEL,w.mipmaps.length-1),t.unbindTexture()}D.depthBuffer&&Qt(D)}function H(D){const w=D.textures;for(let $=0,re=w.length;$<re;$++){const te=w[$];if(T(te)&&te.mipmapsAutoUpdate===!0){const ce=S(D),pe=i.get(te).__webglTexture;t.bindTexture(ce,pe),R(ce),t.unbindTexture()}}}const ii=[];function ft(D){if(D.samples>0){if(xe(D)===!1){const w=D.textures,$=D.width,re=D.height;let te=n.COLOR_BUFFER_BIT;const ce=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,pe=i.get(D),J=w.length>1;if(J)for(let ue=0;ue<w.length;ue++)t.bindFramebuffer(n.FRAMEBUFFER,pe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ue,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,pe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ue,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,pe.__webglMultisampledFramebuffer),D.texture.mipmaps.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,pe.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,pe.__webglFramebuffer);for(let ue=0;ue<w.length;ue++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(te|=n.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(te|=n.STENCIL_BUFFER_BIT)),J){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,pe.__webglColorRenderbuffer[ue]);const O=i.get(w[ue]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,O,0)}n.blitFramebuffer(0,0,$,re,0,0,$,re,te,n.NEAREST),l===!0&&(ii.length=0,ii.push(n.COLOR_ATTACHMENT0+ue),D.depthBuffer&&D.storeMultisampledDepthBuffer===!1&&ii.push(ce),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,ii))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),J)for(let ue=0;ue<w.length;ue++){t.bindFramebuffer(n.FRAMEBUFFER,pe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ue,n.RENDERBUFFER,pe.__webglColorRenderbuffer[ue]);const O=i.get(w[ue]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,pe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ue,n.TEXTURE_2D,O,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,pe.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.storeMultisampledDepthBuffer===!1&&l){const w=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[w])}}}function dt(D){return Math.min(s.maxSamples,D.samples)}function xe(D){const w=i.get(D);return D.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function Mt(D){const w=a.render.frame;d.get(D)!==w&&(d.set(D,w),D.update())}function De(D,w){const $=D.colorSpace,re=D.format,te=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||$!==Ls&&$!==rn&&(qe.getTransfer($)===st?(re!==Si||te!==Jt)&&Ne("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Qe("WebGLTextures: Unsupported texture color space:",$)),w}function Ue(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(c.width=D.naturalWidth||D.width,c.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(c.width=D.displayWidth,c.height=D.displayHeight):(c.width=D.width,c.height=D.height),c}this.allocateTextureUnit=ne,this.resetTextureUnits=G,this.getTextureUnits=W,this.setTextureUnits=ee,this.setTexture2D=ie,this.setTexture2DArray=ve,this.setTexture3D=_e,this.setTextureCube=ae,this.rebindTextures=ei,this.setupRenderTarget=ti,this.updateRenderTargetMipmap=H,this.updateMultisampleRenderTarget=ft,this.setupDepthRenderbuffer=Qt,this.setupFrameBufferTexture=mt,this.useMultisampledRTT=xe,this.dispose=B}function mx(n,e){function t(i,s=rn){let r;const a=qe.getTransfer(s);if(i===Jt)return n.UNSIGNED_BYTE;if(i===Jo)return n.UNSIGNED_SHORT_4_4_4_4;if(i===jo)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Ph)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Lh)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Rh)return n.BYTE;if(i===Ch)return n.SHORT;if(i===Ps)return n.UNSIGNED_SHORT;if(i===Zo)return n.INT;if(i===Ii)return n.UNSIGNED_INT;if(i===Pi)return n.FLOAT;if(i===Di)return n.HALF_FLOAT;if(i===Ih)return n.ALPHA;if(i===Dh)return n.RGB;if(i===Si)return n.RGBA;if(i===cn)return n.DEPTH_COMPONENT;if(i===ln)return n.DEPTH_STENCIL;if(i===Qo)return n.RED;if(i===el)return n.RED_INTEGER;if(i===bn)return n.RG;if(i===tl)return n.RG_INTEGER;if(i===il)return n.RGBA_INTEGER;if(i===wr||i===br||i===Er||i===Tr)if(a===st)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===wr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===br)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Er)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Tr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===wr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===br)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Er)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Tr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===ho||i===uo||i===fo||i===po)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===ho)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===uo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===fo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===po)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===mo||i===go||i===vo||i===xo||i===_o||i===Or||i===yo)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===mo||i===go)return a===st?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===vo)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===xo)return r.COMPRESSED_R11_EAC;if(i===_o)return r.COMPRESSED_SIGNED_R11_EAC;if(i===Or)return r.COMPRESSED_RG11_EAC;if(i===yo)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===So||i===Mo||i===wo||i===bo||i===Eo||i===To||i===Ao||i===Ro||i===Co||i===Po||i===Lo||i===Io||i===Do||i===No)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===So)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Mo)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===wo)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===bo)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Eo)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===To)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Ao)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Ro)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Co)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Po)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Lo)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Io)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Do)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===No)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Uo||i===Fo||i===Oo)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===Uo)return a===st?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Fo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Oo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===ko||i===Bo||i===kr||i===zo)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===ko)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Bo)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===kr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===zo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===is?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const gx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,vx=`
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

}`;class xx{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new $h(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Tn({vertexShader:gx,fragmentShader:vx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new $i(new Zr(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class _x extends Rn{constructor(e,t){super();const i=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,d=null,f=null,h=null,u=null,p=null;const x=typeof XRWebGLBinding<"u",m=new xx,v={},y=t.getContextAttributes();let T=null,R=null;const S=[],M=[],g=new et;let _=null,L=null;const E=new Ai;E.viewport=new vt;const A=new Ai;A.viewport=new vt;const U=[E,A],N=new Lp;let P=null,B=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(V){let ie=S[V];return ie===void 0&&(ie=new Ta,S[V]=ie),ie.getTargetRaySpace()},this.getControllerGrip=function(V){let ie=S[V];return ie===void 0&&(ie=new Ta,S[V]=ie),ie.getGripSpace()},this.getHand=function(V){let ie=S[V];return ie===void 0&&(ie=new Ta,S[V]=ie),ie.getHandSpace()};function F(V){const ie=M.indexOf(V.inputSource);if(ie===-1)return;const ve=S[ie];ve!==void 0&&(ve.update(V.inputSource,V.frame,c||a),ve.dispatchEvent({type:V.type,data:V.inputSource}))}function k(){s.removeEventListener("select",F),s.removeEventListener("selectstart",F),s.removeEventListener("selectend",F),s.removeEventListener("squeeze",F),s.removeEventListener("squeezestart",F),s.removeEventListener("squeezeend",F),s.removeEventListener("end",k),s.removeEventListener("inputsourceschange",I);for(let V=0;V<S.length;V++){const ie=M[V];ie!==null&&(M[V]=null,S[V].disconnect(ie))}P=null,B=null,m.reset();for(const V in v)delete v[V];if(e.setRenderTarget(T),u=null,h=null,f=null,s=null,R=null,ne.stop(),i.isPresenting=!1,e.setPixelRatio(_),e.setSize(g.width,g.height,!1),L!==null){const V=L.camera;V.fov=L.fov,V.zoom=L.zoom,V.updateProjectionMatrix(),L=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(V){r=V,i.isPresenting===!0&&Ne("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(V){o=V,i.isPresenting===!0&&Ne("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(V){c=V},this.getBaseLayer=function(){return h!==null?h:u},this.getBinding=function(){return f===null&&x&&(f=new XRWebGLBinding(s,t)),f},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(V){if(s=V,s!==null){if(T=e.getRenderTarget(),s.addEventListener("select",F),s.addEventListener("selectstart",F),s.addEventListener("selectend",F),s.addEventListener("squeeze",F),s.addEventListener("squeezestart",F),s.addEventListener("squeezeend",F),s.addEventListener("end",k),s.addEventListener("inputsourceschange",I),y.xrCompatible!==!0&&await t.makeXRCompatible(),_=e.getPixelRatio(),e.getSize(g),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let ve=null,_e=null,ae=null;y.depth&&(ae=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ve=y.stencil?ln:cn,_e=y.stencil?is:Ii);const Le={colorFormat:t.RGBA8,depthFormat:ae,scaleFactor:r};f=this.getBinding(),h=f.createProjectionLayer(Le),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),R=new Li(h.textureWidth,h.textureHeight,{format:Si,type:Jt,depthTexture:new ns(h.textureWidth,h.textureHeight,_e,void 0,void 0,void 0,void 0,void 0,void 0,ve),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{const ve={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:r};u=new XRWebGLLayer(s,t,ve),s.updateRenderState({baseLayer:u}),e.setPixelRatio(1),e.setSize(u.framebufferWidth,u.framebufferHeight,!1),R=new Li(u.framebufferWidth,u.framebufferHeight,{format:Si,type:Jt,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}R.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),ne.setContext(s),ne.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function I(V){for(let ie=0;ie<V.removed.length;ie++){const ve=V.removed[ie],_e=M.indexOf(ve);_e>=0&&(M[_e]=null,S[_e].disconnect(ve))}for(let ie=0;ie<V.added.length;ie++){const ve=V.added[ie];let _e=M.indexOf(ve);if(_e===-1){for(let Le=0;Le<S.length;Le++)if(Le>=M.length){M.push(ve),_e=Le;break}else if(M[Le]===null){M[Le]=ve,_e=Le;break}if(_e===-1)break}const ae=S[_e];ae&&ae.connect(ve)}}function C(V,ie){ie===null?V.matrixWorld.copy(V.matrix):V.matrixWorld.multiplyMatrices(ie.matrixWorld,V.matrix),V.matrixWorldInverse.copy(V.matrixWorld).invert()}this.updateCamera=function(V){if(s===null)return;let ie=V.near,ve=V.far;m.texture!==null&&(m.depthNear>0&&(ie=m.depthNear),m.depthFar>0&&(ve=m.depthFar)),N.near=A.near=E.near=ie,N.far=A.far=E.far=ve,(P!==N.near||B!==N.far)&&(s.updateRenderState({depthNear:N.near,depthFar:N.far}),P=N.near,B=N.far),N.layers.mask=V.layers.mask|6,E.layers.mask=N.layers.mask&-5,A.layers.mask=N.layers.mask&-3;const _e=V.parent,ae=N.cameras;C(N,_e);for(let Le=0;Le<ae.length;Le++)C(ae[Le],_e);N.projectionMatrix.copy(E.projectionMatrix),N.projectionMatrixInverse.copy(E.projectionMatrixInverse),L===null&&V.isPerspectiveCamera&&(L={camera:V,fov:V.fov,zoom:V.zoom}),G(V,N,_e)};function G(V,ie,ve){ve===null?V.matrix.copy(ie.matrixWorld):(V.matrix.copy(ve.matrixWorld),V.matrix.invert(),V.matrix.multiply(ie.matrixWorld)),V.matrix.decompose(V.position,V.quaternion,V.scale),V.updateMatrixWorld(!0),V.projectionMatrix.copy(ie.projectionMatrix),V.projectionMatrixInverse.copy(ie.projectionMatrixInverse),V.isPerspectiveCamera&&(V.fov=Ho*2*Math.atan(1/V.projectionMatrix.elements[5]),V.zoom=1)}this.getCamera=function(){return N},this.getFoveation=function(){if(!(h===null&&u===null))return l},this.setFoveation=function(V){l=V,h!==null&&(h.fixedFoveation=V),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=V)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(N)},this.getCameraTexture=function(V){return v[V]};let W=null;function ee(V,ie){if(d=ie.getViewerPose(c||a),p=ie,d!==null){const ve=d.views;u!==null&&(e.setRenderTargetFramebuffer(R,u.framebuffer),e.setRenderTarget(R));let _e=!1;ve.length!==N.cameras.length&&(N.cameras.length=0,_e=!0);for(let Re=0;Re<ve.length;Re++){const Ge=ve[Re];let se=null;if(u!==null)se=u.getViewport(Ge);else{const Ae=f.getViewSubImage(h,Ge);se=Ae.viewport,Re===0&&(e.setRenderTargetTextures(R,Ae.colorTexture,Ae.depthStencilTexture),e.setRenderTarget(R))}let ge=U[Re];ge===void 0&&(ge=new Ai,ge.layers.enable(Re),ge.viewport=new vt,U[Re]=ge),ge.matrix.fromArray(Ge.transform.matrix),ge.matrix.decompose(ge.position,ge.quaternion,ge.scale),ge.projectionMatrix.fromArray(Ge.projectionMatrix),ge.projectionMatrixInverse.copy(ge.projectionMatrix).invert(),ge.viewport.set(se.x,se.y,se.width,se.height),Re===0&&(N.matrix.copy(ge.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale)),_e===!0&&N.cameras.push(ge)}const ae=s.enabledFeatures;if(ae&&ae.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){f=i.getBinding();const Re=f.getDepthInformation(ve[0]);Re&&Re.isValid&&Re.texture&&m.init(Re,s.renderState)}if(ae&&ae.includes("camera-access")&&x){e.state.unbindTexture(),f=i.getBinding();for(let Re=0;Re<ve.length;Re++){const Ge=ve[Re].camera;if(Ge){let se=v[Ge];se||(se=new $h,v[Ge]=se);const ge=f.getCameraImage(Ge);se.sourceTexture=ge}}}}for(let ve=0;ve<S.length;ve++){const _e=M[ve],ae=S[ve];_e!==null&&ae!==void 0&&ae.update(_e,ie,c||a)}W&&W(V,ie),ie.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ie}),p=null}const ne=new Zh;ne.setAnimationLoop(ee),this.setAnimationLoop=function(V){W=V},this.dispose=function(){}}}const yx=new xt,au=new Fe;au.set(-1,0,0,0,1,0,0,0,1);function Sx(n,e){function t(m,v){m.matrixAutoUpdate===!0&&m.updateMatrix(),v.value.copy(m.matrix)}function i(m,v){v.color.getRGB(m.fogColor.value,qh(n)),v.isFog?(m.fogNear.value=v.near,m.fogFar.value=v.far):v.isFogExp2&&(m.fogDensity.value=v.density)}function s(m,v,y,T,R){v.isNodeMaterial?v.uniformsNeedUpdate=!1:v.isMeshBasicMaterial?r(m,v):v.isMeshLambertMaterial?(r(m,v),v.envMap&&(m.envMapIntensity.value=v.envMapIntensity)):v.isMeshToonMaterial?(r(m,v),f(m,v)):v.isMeshPhongMaterial?(r(m,v),d(m,v),v.envMap&&(m.envMapIntensity.value=v.envMapIntensity)):v.isMeshStandardMaterial?(r(m,v),h(m,v),v.isMeshPhysicalMaterial&&u(m,v,R)):v.isMeshMatcapMaterial?(r(m,v),p(m,v)):v.isMeshDepthMaterial?r(m,v):v.isMeshDistanceMaterial?(r(m,v),x(m,v)):v.isMeshNormalMaterial?r(m,v):v.isLineBasicMaterial?(a(m,v),v.isLineDashedMaterial&&o(m,v)):v.isPointsMaterial?l(m,v,y,T):v.isSpriteMaterial?c(m,v):v.isShadowMaterial?(m.color.value.copy(v.color),m.opacity.value=v.opacity):v.isShaderMaterial&&(v.uniformsNeedUpdate=!1)}function r(m,v){m.opacity.value=v.opacity,v.color&&m.diffuse.value.copy(v.color),v.emissive&&m.emissive.value.copy(v.emissive).multiplyScalar(v.emissiveIntensity),v.map&&(m.map.value=v.map,t(v.map,m.mapTransform)),v.alphaMap&&(m.alphaMap.value=v.alphaMap,t(v.alphaMap,m.alphaMapTransform)),v.bumpMap&&(m.bumpMap.value=v.bumpMap,t(v.bumpMap,m.bumpMapTransform),m.bumpScale.value=v.bumpScale,v.side===qt&&(m.bumpScale.value*=-1)),v.normalMap&&(m.normalMap.value=v.normalMap,t(v.normalMap,m.normalMapTransform),m.normalScale.value.copy(v.normalScale),v.side===qt&&m.normalScale.value.negate()),v.displacementMap&&(m.displacementMap.value=v.displacementMap,t(v.displacementMap,m.displacementMapTransform),m.displacementScale.value=v.displacementScale,m.displacementBias.value=v.displacementBias),v.emissiveMap&&(m.emissiveMap.value=v.emissiveMap,t(v.emissiveMap,m.emissiveMapTransform)),v.specularMap&&(m.specularMap.value=v.specularMap,t(v.specularMap,m.specularMapTransform)),v.alphaTest>0&&(m.alphaTest.value=v.alphaTest);const y=e.get(v),T=y.envMap,R=y.envMapRotation;T&&(m.envMap.value=T,m.envMapRotation.value.setFromMatrix4(yx.makeRotationFromEuler(R)).transpose(),T.isCubeTexture&&T.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(au),m.reflectivity.value=v.reflectivity,m.ior.value=v.ior,m.refractionRatio.value=v.refractionRatio),v.lightMap&&(m.lightMap.value=v.lightMap,m.lightMapIntensity.value=v.lightMapIntensity,t(v.lightMap,m.lightMapTransform)),v.aoMap&&(m.aoMap.value=v.aoMap,m.aoMapIntensity.value=v.aoMapIntensity,t(v.aoMap,m.aoMapTransform))}function a(m,v){m.diffuse.value.copy(v.color),m.opacity.value=v.opacity,v.map&&(m.map.value=v.map,t(v.map,m.mapTransform))}function o(m,v){m.dashSize.value=v.dashSize,m.totalSize.value=v.dashSize+v.gapSize,m.scale.value=v.scale}function l(m,v,y,T){m.diffuse.value.copy(v.color),m.opacity.value=v.opacity,m.size.value=v.size*y,m.scale.value=T*.5,v.map&&(m.map.value=v.map,t(v.map,m.uvTransform)),v.alphaMap&&(m.alphaMap.value=v.alphaMap,t(v.alphaMap,m.alphaMapTransform)),v.alphaTest>0&&(m.alphaTest.value=v.alphaTest)}function c(m,v){m.diffuse.value.copy(v.color),m.opacity.value=v.opacity,m.rotation.value=v.rotation,v.map&&(m.map.value=v.map,t(v.map,m.mapTransform)),v.alphaMap&&(m.alphaMap.value=v.alphaMap,t(v.alphaMap,m.alphaMapTransform)),v.alphaTest>0&&(m.alphaTest.value=v.alphaTest)}function d(m,v){m.specular.value.copy(v.specular),m.shininess.value=Math.max(v.shininess,1e-4)}function f(m,v){v.gradientMap&&(m.gradientMap.value=v.gradientMap)}function h(m,v){m.metalness.value=v.metalness,v.metalnessMap&&(m.metalnessMap.value=v.metalnessMap,t(v.metalnessMap,m.metalnessMapTransform)),m.roughness.value=v.roughness,v.roughnessMap&&(m.roughnessMap.value=v.roughnessMap,t(v.roughnessMap,m.roughnessMapTransform)),v.envMap&&(m.envMapIntensity.value=v.envMapIntensity)}function u(m,v,y){m.ior.value=v.ior,v.diffuseRoughness>0&&(m.diffuseRoughness.value=v.diffuseRoughness,v.diffuseRoughnessMap&&(m.diffuseRoughnessMap.value=v.diffuseRoughnessMap,t(v.diffuseRoughnessMap,m.diffuseRoughnessMapTransform))),v.sheen>0&&(m.sheenColor.value.copy(v.sheenColor).multiplyScalar(v.sheen),m.sheenRoughness.value=v.sheenRoughness,v.sheenColorMap&&(m.sheenColorMap.value=v.sheenColorMap,t(v.sheenColorMap,m.sheenColorMapTransform)),v.sheenRoughnessMap&&(m.sheenRoughnessMap.value=v.sheenRoughnessMap,t(v.sheenRoughnessMap,m.sheenRoughnessMapTransform))),v.clearcoat>0&&(m.clearcoat.value=v.clearcoat,m.clearcoatRoughness.value=v.clearcoatRoughness,v.clearcoatMap&&(m.clearcoatMap.value=v.clearcoatMap,t(v.clearcoatMap,m.clearcoatMapTransform)),v.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=v.clearcoatRoughnessMap,t(v.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),v.clearcoatNormalMap&&(m.clearcoatNormalMap.value=v.clearcoatNormalMap,t(v.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(v.clearcoatNormalScale),v.side===qt&&m.clearcoatNormalScale.value.negate())),v.dispersion>0&&(m.dispersion.value=v.dispersion),v.retroreflectivity>0&&(m.retroreflectivity.value=v.retroreflectivity),v.iridescence>0&&(m.iridescence.value=v.iridescence,m.iridescenceIOR.value=v.iridescenceIOR,m.iridescenceThicknessMinimum.value=v.iridescenceThicknessMinimum,m.iridescenceThicknessMaximum.value=v.iridescenceThicknessMaximum,v.iridescenceMap&&(m.iridescenceMap.value=v.iridescenceMap,t(v.iridescenceMap,m.iridescenceMapTransform)),v.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=v.iridescenceThicknessMap,t(v.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),v.transmission>0&&(m.transmission.value=v.transmission,m.transmissionSamplerMap.value=y.texture,m.transmissionSamplerSize.value.set(y.width,y.height),v.transmissionMap&&(m.transmissionMap.value=v.transmissionMap,t(v.transmissionMap,m.transmissionMapTransform)),m.thickness.value=v.thickness,v.thicknessMap&&(m.thicknessMap.value=v.thicknessMap,t(v.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=v.attenuationDistance,m.attenuationColor.value.copy(v.attenuationColor)),v.anisotropy>0&&(m.anisotropyVector.value.set(v.anisotropy*Math.cos(v.anisotropyRotation),v.anisotropy*Math.sin(v.anisotropyRotation)),v.anisotropyMap&&(m.anisotropyMap.value=v.anisotropyMap,t(v.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=v.specularIntensity,m.specularColor.value.copy(v.specularColor),v.specularColorMap&&(m.specularColorMap.value=v.specularColorMap,t(v.specularColorMap,m.specularColorMapTransform)),v.specularIntensityMap&&(m.specularIntensityMap.value=v.specularIntensityMap,t(v.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,v){v.matcap&&(m.matcap.value=v.matcap)}function x(m,v){const y=e.get(v).light;m.referencePosition.value.setFromMatrixPosition(y.matrixWorld),m.nearDistance.value=y.shadow.camera.near,m.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function Mx(n,e,t,i){let s={},r={};function a(y,T){const R=T.program;i.uniformBlockBinding(y,R,s[y.id])}function o(y,T){let R=s[y.id];R===void 0&&(p(y),R=l(y),s[y.id]=R,y.addEventListener("dispose",m));const S=T.program;i.updateUBOMapping(y,S);const M=e.render.frame;r[y.id]!==M&&(c(y),r[y.id]=M)}function l(y){const T=n.createBuffer(),R=y.__size,S=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,T),n.bufferData(n.UNIFORM_BUFFER,R,S),n.bindBuffer(n.UNIFORM_BUFFER,null),T}function c(y){const T=s[y.id],R=y.uniforms,S=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,T);for(let M=0,g=R.length;M<g;M++){const _=R[M];if(Array.isArray(_))for(let L=0,E=_.length;L<E;L++)d(_[L],M,L,S);else d(_,M,0,S)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function d(y,T,R,S){if(h(y,T,R,S)===!0){const M=y.__offset,g=y.value;if(Array.isArray(g)){let _=0;for(let L=0;L<g.length;L++){const E=g[L],A=x(E,!0);f(E,y.__data,_),_+=A.storage/Float32Array.BYTES_PER_ELEMENT}}else f(g,y.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,M,y.__data)}}function f(y,T,R){typeof y=="number"||typeof y=="boolean"?T[R]=y:y.isMatrix3?(T[R]=y.elements[0],T[R+1]=y.elements[1],T[R+2]=y.elements[2],T[R+3]=0,T[R+4]=y.elements[3],T[R+5]=y.elements[4],T[R+6]=y.elements[5],T[R+7]=0,T[R+8]=y.elements[6],T[R+9]=y.elements[7],T[R+10]=y.elements[8],T[R+11]=0):ArrayBuffer.isView(y)?T.set(y.subarray(0,T.length-R),R):y.toArray(T,R)}function h(y,T,R,S){const M=y.value,g=T+"_"+R;if(Array.isArray(M)){S[g]===void 0&&(S[g]=[]);const _=S[g];let L=!1;for(let E=0;E<M.length;E++)u(M[E],_,E)===!0&&(L=!0);return L}return u(M,S,g)}function u(y,T,R){if(T[R]===void 0)return typeof y=="number"||typeof y=="boolean"?T[R]=y:ArrayBuffer.isView(y)?T[R]=y.slice():T[R]=y.clone(),!0;{const S=T[R];if(typeof y=="number"||typeof y=="boolean"){if(S!==y)return T[R]=y,!0}else{if(ArrayBuffer.isView(y))return!0;if(S.equals(y)===!1)return S.copy(y),!0}}return!1}function p(y){const T=y.uniforms;let R=0;const S=16;for(let g=0,_=T.length;g<_;g++){const L=Array.isArray(T[g])?T[g]:[T[g]];for(let E=0,A=L.length;E<A;E++){const U=L[E],N=Array.isArray(U.value)?U.value:[U.value],P=Array.isArray(T[g])||Array.isArray(U.value);let B=R;for(let k=0,I=N.length;k<I;k++){const C=N[k],G=x(C,P),W=R%S,ee=W%G.boundary,ne=W+ee;R+=ee,ne!==0&&S-ne<G.storage&&(R+=S-ne),k===0&&(B=R),R+=G.storage}const F=U.type==="int"?Int32Array:U.type==="uint"?Uint32Array:Float32Array;U.__data=new F((R-B)/Float32Array.BYTES_PER_ELEMENT),U.__offset=B}}const M=R%S;return M>0&&(R+=S-M),y.__size=R,y.__cache={},this}function x(y,T){const R={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(R.boundary=4,R.storage=4):y.isVector2?(R.boundary=8,R.storage=8):y.isVector3||y.isColor?(R.boundary=16,R.storage=12):y.isVector4?(R.boundary=16,R.storage=16):y.isMatrix3?(R.boundary=16,R.storage=48):y.isMatrix4?(R.boundary=16,R.storage=64):y.isTexture?Ne("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(R.boundary=16,R.storage=y.byteLength):Ne("WebGLRenderer: Unsupported uniform value type.",y),T===!0&&(R.boundary=16,R.storage=Math.ceil(R.storage/16)*16),R}function m(y){const T=y.target;T.removeEventListener("dispose",m),n.deleteBuffer(s[T.id]),delete s[T.id],delete r[T.id]}function v(){for(const y in s)n.deleteBuffer(s[y]);s={},r={}}return{bind:a,update:o,dispose:v}}const wx=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Ti=null;function bx(){return Ti===null&&(Ti=new Vh(wx,16,16,bn,Di),Ti.name="DFG_LUT",Ti.minFilter=$t,Ti.magFilter=$t,Ti.wrapS=Ci,Ti.wrapT=Ci,Ti.generateMipmaps=!1,Ti.needsUpdate=!0),Ti}class Ex{constructor(e={}){const{canvas:t=Yd(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:h=!1,outputBufferType:u=Jt}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=a;const x=u,m=new Set([il,tl,el]),v=new Set([Jt,Ii,Ps,is,Jo,jo]),y=new Uint32Array(4),T=new Int32Array(4),R={textures:[],min:[],max:[],resolution:[]};let S=null,M=null;const g=[],_=[];let L=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Wi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const E=this;let A=!1,U=null,N=null,P=null,B=null;this._outputColorSpace=oi;let F=0,k=0,I=null,C=-1,G=null;const W=new vt,ee=new vt;let ne=null;const V=new tt(0);let ie=0,ve=t.width,_e=t.height,ae=1,Le=null,rt=null;const Re=new vt(0,0,ve,_e),Ge=new vt(0,0,ve,_e);let se=!1;const ge=new Vr,Ae=new al;let it=!1,Dt=!1;const mt=new xt,bi=new K,Et=new vt,Qt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ei=!1;function ti(){return I===null?ae:1}let H=i;function ii(b,z){return t.getContext(b,z)}let ft,dt,xe,Mt,De,Ue,D,w,$,re,te,ce,pe,J,j,ue,O,Q,Z,fe,le,he,Pe;try{const b={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ko}`),t.addEventListener("webglcontextlost",Ie,!1),t.addEventListener("webglcontextrestored",Be,!1),t.addEventListener("webglcontextcreationerror",ye,!1),H===null){const z="webgl2";if(H=ii(z,b),H===null)throw ii(z)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}ze()}catch(b){throw t.removeEventListener("webglcontextlost",Ie,!1),t.removeEventListener("webglcontextrestored",Be,!1),t.removeEventListener("webglcontextcreationerror",ye,!1),Qe("WebGLRenderer: "+b.message),b}function ze(){ft=new R0(H),ft.init(),le=new mx(H,ft),dt=new v0(H,ft,e,le),xe=new dx(H,ft),dt.reversedDepthBuffer&&h&&xe.buffers.depth.setReversed(!0),N=H.createFramebuffer(),P=H.createFramebuffer(),B=H.createFramebuffer(),Mt=new L0(H),De=new Qv,Ue=new px(H,ft,xe,De,dt,le,Mt),D=new A0(E),w=new Dp(H),he=new m0(H,w),$=new C0(H,w,Mt,he),re=new D0(H,$,w,he,Mt),Q=new I0(H,dt,Ue),j=new x0(De),te=new jv(E,D,ft,dt,he,j),ce=new Sx(E,De),pe=new tx,J=new ox(ft),O=new p0(E,D,xe,re,p,l),ue=new fx(E,re,dt),Pe=new Mx(H,Mt,dt,xe),Z=new g0(H,ft,Mt),fe=new P0(H,ft,Mt),Mt.programs=te.programs,E.capabilities=dt,E.extensions=ft,E.properties=De,E.renderLists=pe,E.shadowMap=ue,E.state=xe,E.info=Mt}x!==Jt&&(L=new U0(x,t.width,t.height,o,s,r));const oe=new _x(E,H);this.xr=oe,this.getContext=function(){return H},this.getContextAttributes=function(){return H.getContextAttributes()},this.forceContextLoss=function(){const b=ft.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=ft.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return ae},this.setPixelRatio=function(b){b!==void 0&&(ae=b,this.setSize(ve,_e,!1))},this.getSize=function(b){return b.set(ve,_e)},this.setSize=function(b,z,Y=!0){if(oe.isPresenting){Ne("WebGLRenderer: Can't change size while VR device is presenting.");return}ve=b,_e=z,t.width=Math.floor(b*ae),t.height=Math.floor(z*ae),Y===!0&&(t.style.width=b+"px",t.style.height=z+"px"),L!==null&&L.setSize(t.width,t.height),this.setViewport(0,0,b,z)},this.getDrawingBufferSize=function(b){return b.set(ve*ae,_e*ae).floor()},this.setDrawingBufferSize=function(b,z,Y){ve=b,_e=z,ae=Y,t.width=Math.floor(b*Y),t.height=Math.floor(z*Y),this.setViewport(0,0,b,z)},this.setEffects=function(b){if(x===Jt){Qe("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(b){for(let z=0;z<b.length;z++)if(b[z].isOutputPass===!0){Ne("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}L.setEffects(b||[])},this.getCurrentViewport=function(b){return b.copy(W)},this.getViewport=function(b){return b.copy(Re)},this.setViewport=function(b,z,Y,X){b.isVector4?Re.set(b.x,b.y,b.z,b.w):Re.set(b,z,Y,X),xe.viewport(W.copy(Re).multiplyScalar(ti()).round())},this.getScissor=function(b){return b.copy(Ge)},this.setScissor=function(b,z,Y,X){b.isVector4?Ge.set(b.x,b.y,b.z,b.w):Ge.set(b,z,Y,X),xe.scissor(ee.copy(Ge).multiplyScalar(ti()).round())},this.getScissorTest=function(){return se},this.setScissorTest=function(b){xe.setScissorTest(se=b)},this.setOpaqueSort=function(b){Le=b},this.setTransparentSort=function(b){rt=b},this.getClearColor=function(b){return b.copy(O.getClearColor())},this.setClearColor=function(){O.setClearColor(...arguments)},this.getClearAlpha=function(){return O.getClearAlpha()},this.setClearAlpha=function(){O.setClearAlpha(...arguments)},this.clear=function(b=!0,z=!0,Y=!0){let X=0;if(b){let q=!1;if(I!==null){const me=I.texture.format;q=m.has(me)}if(q){const me=I.texture.type,be=v.has(me),de=O.getClearColor(),Me=O.getClearAlpha(),Ce=de.r,Oe=de.g,We=de.b;be?(y[0]=Ce,y[1]=Oe,y[2]=We,y[3]=Me,H.clearBufferuiv(H.COLOR,0,y)):(T[0]=Ce,T[1]=Oe,T[2]=We,T[3]=Me,H.clearBufferiv(H.COLOR,0,T))}else X|=H.COLOR_BUFFER_BIT}z&&(X|=H.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Y&&(X|=H.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),X!==0&&H.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(b){b.setRenderer(this),U=b},this.dispose=function(){t.removeEventListener("webglcontextlost",Ie,!1),t.removeEventListener("webglcontextrestored",Be,!1),t.removeEventListener("webglcontextcreationerror",ye,!1),O.dispose(),pe.dispose(),J.dispose(),Ue.dispose(),De.dispose(),D.dispose(),re.dispose(),$.dispose(),he.dispose(),Pe.dispose(),te.dispose(),oe.dispose(),oe.removeEventListener("sessionstart",dl),oe.removeEventListener("sessionend",pl),un.stop()};function Ie(b){b.preventDefault(),jl("WebGLRenderer: Context Lost."),A=!0}function Be(){jl("WebGLRenderer: Context Restored."),A=!1;const b=Mt.autoReset,z=ue.enabled,Y=ue.autoUpdate,X=ue.needsUpdate,q=ue.type;ze(),Mt.autoReset=b,ue.enabled=z,ue.autoUpdate=Y,ue.needsUpdate=X,ue.type=q}function ye(b){Qe("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function nt(b){const z=b.target;z.removeEventListener("dispose",nt),Tt(z)}function Tt(b){qi(b),De.remove(b)}function qi(b){const z=De.get(b).programs;z!==void 0&&(z.forEach(function(Y){te.releaseProgram(Y)}),b.isShaderMaterial&&te.releaseShaderCache(b))}this.renderBufferDirect=function(b,z,Y,X,q,me){z===null&&(z=Qt);const be=q.isMesh&&q.matrixWorld.determinantAffine()<0,de=cu(b,z,Y,X,q);xe.setMaterial(X,be);let Me=Y.index,Ce=1;if(X.wireframe===!0){if(Me=$.getWireframeAttribute(Y),Me===void 0)return;Ce=2}const Oe=Y.drawRange,We=Y.attributes.position;let Ee=Oe.start*Ce,Xe=(Oe.start+Oe.count)*Ce;me!==null&&(Ee=Math.max(Ee,me.start*Ce),Xe=Math.min(Xe,(me.start+me.count)*Ce)),Me!==null?(Ee=Math.max(Ee,0),Xe=Math.min(Xe,Me.count)):We!=null&&(Ee=Math.max(Ee,0),Xe=Math.min(Xe,We.count));const _t=Xe-Ee;if(_t<0||_t===1/0)return;he.setup(q,X,de,Y,Me);let lt,at=Z;if(Me!==null&&(lt=w.get(Me),at=fe,at.setIndex(lt)),q.isMesh)X.wireframe===!0?(xe.setLineWidth(X.wireframeLinewidth*ti()),at.setMode(H.LINES)):at.setMode(H.TRIANGLES);else if(q.isLine){let Nt=X.linewidth;Nt===void 0&&(Nt=1),xe.setLineWidth(Nt*ti()),q.isLineSegments?at.setMode(H.LINES):q.isLineLoop?at.setMode(H.LINE_LOOP):at.setMode(H.LINE_STRIP)}else q.isPoints?at.setMode(H.POINTS):q.isSprite&&at.setMode(H.TRIANGLES);if(q.isBatchedMesh)if(ft.get("WEBGL_multi_draw"))at.renderMultiDraw(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount);else{const Nt=q._multiDrawStarts,Te=q._multiDrawCounts,kt=q._multiDrawCount,je=Me?w.get(Me).bytesPerElement:1,fn=De.get(X).currentProgram.getUniforms();for(let Ut=0;Ut<kt;Ut++)fn.setValue(H,"_gl_DrawID",Ut),at.render(Nt[Ut]/je,Te[Ut])}else if(q.isInstancedMesh)at.renderInstances(Ee,_t,q.count);else if(Y.isInstancedBufferGeometry){const Nt=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,Te=Math.min(Y.instanceCount,Nt);at.renderInstances(Ee,_t,Te)}else at.render(Ee,_t)};function fl(b,z,Y,X){U!==null&&b.isNodeMaterial&&U.setObject(X,b),it===!0&&j.setState(b,Y,!1),b.transparent===!0&&b.side===_i&&b.forceSinglePass===!1?(b.side=qt,b.needsUpdate=!0,os(b,z,X),b.side=wn,b.needsUpdate=!0,os(b,z,X),b.side=_i):os(b,z,X)}this.compile=function(b,z,Y=null){Y===null&&(Y=b),U!==null&&U.renderStart(b,z,Y),M=J.get(Y),M.init(z),_.push(M),Y.traverseVisible(function(q){q.isLight&&q.layers.test(z.layers)&&(M.pushLight(q),q.castShadow&&M.pushShadow(q))}),b!==Y&&b.traverseVisible(function(q){q.isLight&&q.layers.test(z.layers)&&(M.pushLight(q),q.castShadow&&M.pushShadow(q))}),M.setupLights(),U!==null&&U.updateLights(M.state.lightsArray),Dt=this.localClippingEnabled,it=j.init(this.clippingPlanes,Dt),it===!0&&j.setGlobalState(this.clippingPlanes,z),U!==null&&ue.render(M.state.shadowsArray,Y,z);const X=new Set;return b.traverse(function(q){if(!(q.isMesh||q.isPoints||q.isLine||q.isSprite))return;const me=q.material;if(me)if(Array.isArray(me))for(let be=0;be<me.length;be++){const de=me[be];fl(de,Y,z,q),X.add(de)}else fl(me,Y,z,q),X.add(me)}),M=_.pop(),U!==null&&U.renderEnd(),X},this.compileAsync=function(b,z,Y=null){const X=this.compile(b,z,Y);return new Promise(q=>{function me(){if(X.forEach(function(be){const Me=De.get(be).currentProgram;(Me===void 0||Me.isReady())&&X.delete(be)}),X.size===0){q(b);return}setTimeout(me,10)}ft.get("KHR_parallel_shader_compile")!==null?me():setTimeout(me,10)})};let Qr=null;function ou(b){Qr&&Qr(b)}function dl(){un.stop()}function pl(){un.start()}const un=new Zh;un.setAnimationLoop(ou),typeof self<"u"&&un.setContext(self),this.setAnimationLoop=function(b){Qr=b,oe.setAnimationLoop(b),b===null?un.stop():un.start()},oe.addEventListener("sessionstart",dl),oe.addEventListener("sessionend",pl),this.render=function(b,z){if(z!==void 0&&z.isCamera!==!0){Qe("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(A===!0)return;U!==null&&U.renderStart(b,z);const Y=oe.enabled===!0&&oe.isPresenting===!0,X=L!==null&&(I===null||Y)&&L.begin(E,I);if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),z.parent===null&&z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),oe.enabled===!0&&oe.isPresenting===!0&&(L===null||L.isCompositing()===!1)&&(oe.cameraAutoUpdate===!0&&oe.updateCamera(z),z=oe.getCamera()),b.isScene===!0&&b.onBeforeRender(E,b,z,I),M=J.get(b,_.length),M.init(z),M.state.textureUnits=Ue.getTextureUnits(),_.push(M),mt.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),z.isArrayCamera?Ae.setFromArrayCamera(z):ge.setFromProjectionMatrix(mt,Mi,z.reversedDepth),Dt=this.localClippingEnabled,it=j.init(this.clippingPlanes,Dt),S=pe.get(b,g.length),S.init(),g.push(S),this.info.render.frame++,oe.enabled===!0&&oe.isPresenting===!0){const be=E.xr.getDepthSensingMesh();be!==null&&ea(be,z,-1/0,E.sortObjects)}ea(b,z,0,E.sortObjects),S.finish(),U!==null&&U.updateLights(M.state.lightsArray),E.sortObjects===!0&&S.sort(Le,rt),ei=oe.enabled===!1||oe.isPresenting===!1||oe.hasDepthSensing()===!1,ei&&O.addToRenderList(S,b),this.info.autoReset===!0&&this.info.reset(),it===!0&&j.beginShadows();const q=M.state.shadowsArray;if(ue.render(q,b,z),it===!0&&j.endShadows(),(X&&L.hasRenderPass())===!1){const be=S.opaque,de=S.transmissive;if(M.setupLights(),z.isArrayCamera){const Me=z.cameras;if(de.length>0)for(let Ce=0,Oe=Me.length;Ce<Oe;Ce++){const We=Me[Ce];gl(be,de,b,We)}ei&&O.render(b);for(let Ce=0,Oe=Me.length;Ce<Oe;Ce++){const We=Me[Ce];ml(S,b,We,We.viewport)}}else de.length>0&&gl(be,de,b,z),ei&&O.render(b),ml(S,b,z)}I!==null&&k===0&&(Ue.updateMultisampleRenderTarget(I),Ue.updateRenderTargetMipmap(I)),X&&L.end(E),b.isScene===!0&&b.onAfterRender(E,b,z),he.resetDefaultState(),C=-1,G=null,_.pop(),_.length>0?(M=_[_.length-1],Ue.setTextureUnits(M.state.textureUnits),it===!0&&j.setGlobalState(E.clippingPlanes,M.state.camera)):M=null,g.pop(),g.length>0?S=g[g.length-1]:S=null,U!==null&&U.renderEnd()};function ea(b,z,Y,X){if(b.visible===!1)return;if(b.layers.test(z.layers)){if(b.isGroup)Y=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(z);else if(b.isLight)M.pushLight(b),b.castShadow&&M.pushShadow(b);else if(b.isSprite){const be=z.isArrayCamera?Ae:ge;if(!b.frustumCulled||b.intersectsFrustum(be)){X&&Et.setFromMatrixPosition(b.matrixWorld).applyMatrix4(mt);const de=re.update(b),Me=b.material;Me.visible&&S.push(b,de,Me,Y,Et.z,null,z)}}else if(b.isMesh||b.isLine||b.isPoints){const be=z.isArrayCamera?Ae:ge;if(!b.frustumCulled||b.intersectsFrustum(be)){const de=re.update(b),Me=b.material;if(X&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),Et.copy(b.boundingSphere.center)):(de.boundingSphere===null&&de.computeBoundingSphere(),Et.copy(de.boundingSphere.center)),Et.applyMatrix4(b.matrixWorld).applyMatrix4(mt)),Array.isArray(Me)){const Ce=de.groups;for(let Oe=0,We=Ce.length;Oe<We;Oe++){const Ee=Ce[Oe],Xe=Me[Ee.materialIndex];Xe&&Xe.visible&&S.push(b,de,Xe,Y,Et.z,Ee,z)}}else Me.visible&&S.push(b,de,Me,Y,Et.z,null,z)}}}const me=b.children;for(let be=0,de=me.length;be<de;be++)ea(me[be],z,Y,X)}function ml(b,z,Y,X){const{opaque:q,transmissive:me,transparent:be}=b;M.setupLightsView(Y),it===!0&&j.setGlobalState(E.clippingPlanes,Y),X&&xe.viewport(W.copy(X)),q.length>0&&Os(q,z,Y),me.length>0&&Os(me,z,Y),be.length>0&&Os(be,z,Y),xe.buffers.depth.setTest(!0),xe.buffers.depth.setMask(!0),xe.buffers.color.setMask(!0),xe.setPolygonOffset(!1)}function gl(b,z,Y,X){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;if(M.state.transmissionRenderTarget[X.id]===void 0){const Ee=ft.has("EXT_color_buffer_half_float")||ft.has("EXT_color_buffer_float");M.state.transmissionRenderTarget[X.id]=new Li(1,1,{generateMipmaps:!0,type:Ee?Di:Jt,minFilter:on,samples:Math.max(4,dt.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:qe.workingColorSpace})}const me=M.state.transmissionRenderTarget[X.id],be=X.viewport||W;me.setSize(be.z*E.transmissionResolutionScale,be.w*E.transmissionResolutionScale);const de=E.getRenderTarget(),Me=E.getActiveCubeFace(),Ce=E.getActiveMipmapLevel();E.setRenderTarget(me),E.getClearColor(V),ie=E.getClearAlpha(),ie<1&&E.setClearColor(16777215,.5),E.clear(),ei&&O.render(Y);const Oe=E.toneMapping;E.toneMapping=Wi;const We=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),M.setupLightsView(X),it===!0&&j.setGlobalState(E.clippingPlanes,X),Os(b,Y,X),Ue.updateMultisampleRenderTarget(me),Ue.updateRenderTargetMipmap(me),ft.has("WEBGL_multisampled_render_to_texture")===!1){let Ee=!1;for(let Xe=0,_t=z.length;Xe<_t;Xe++){const lt=z[Xe],{object:at,geometry:Nt,material:Te,group:kt}=lt;if(Te.side===_i&&at.layers.test(X.layers)){const je=Te.side;Te.side=qt,Te.needsUpdate=!0,vl(at,Y,X,Nt,Te,kt),Te.side=je,Te.needsUpdate=!0,Ee=!0}}Ee===!0&&(Ue.updateMultisampleRenderTarget(me),Ue.updateRenderTargetMipmap(me))}E.setRenderTarget(de,Me,Ce),E.setClearColor(V,ie),We!==void 0&&(X.viewport=We),E.toneMapping=Oe}function Os(b,z,Y){const X=z.isScene===!0?z.overrideMaterial:null;for(let q=0,me=b.length;q<me;q++){const be=b[q],{object:de,geometry:Me,group:Ce}=be;let Oe=be.material;Oe.allowOverride===!0&&X!==null&&(Oe=X),de.layers.test(Y.layers)&&vl(de,z,Y,Me,Oe,Ce)}}function vl(b,z,Y,X,q,me){U!==null&&q.isNodeMaterial&&U.setObject(b,q),b.onBeforeRender(E,z,Y,X,q,me),b.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),q.onBeforeRender(E,z,Y,X,b,me),q.transparent===!0&&q.side===_i&&q.forceSinglePass===!1?(q.side=qt,q.needsUpdate=!0,E.renderBufferDirect(Y,z,X,q,b,me),q.side=wn,q.needsUpdate=!0,E.renderBufferDirect(Y,z,X,q,b,me),q.side=_i):E.renderBufferDirect(Y,z,X,q,b,me),b.onAfterRender(E,z,Y,X,q,me)}function xl(b){let z=0;for(const Y of b)Y.texture!==null&&z++;return z}function os(b,z,Y){z.isScene!==!0&&(z=Qt);const X=De.get(b),q=M.state.lights,me=M.state.shadowsArray,be=q.state.version,de=te.getParameters(b,q.state,me,z,Y,M.state.lightProbeGridArray),Me=te.getProgramCacheKey(de);let Ce=X.programs;X.environment=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?z.environment:null,X.fog=z.fog;const Oe=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap;X.envMap=D.get(b.envMap||X.environment,Oe),X.envMapRotation=X.environment!==null&&b.envMap===null?z.environmentRotation:b.envMapRotation,Ce===void 0&&(b.addEventListener("dispose",nt),Ce=new Map,X.programs=Ce,X.programVariants=new Map);let We=Ce.get(Me);if(We!==void 0){if(X.currentProgram===We&&X.lightsStateVersion===be)return yl(b,de),We}else de.uniforms=te.getUniforms(b),U!==null&&b.isNodeMaterial&&U.build(b,Y,de),b.onBeforeCompile(de,E),We=te.acquireProgram(de,Me),Ce.set(Me,We),X.uniforms=de.uniforms;const Ee=X.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Ee.clippingPlanes=j.uniform),yl(b,de),X.needsLights=uu(b),X.lightsStateVersion=be,X.needsLights&&(Ee.ambientLightColor.value=q.state.ambient,Ee.lightProbe.value=q.state.probe,Ee.sunLights.value=q.state.sun,Ee.sunLightShadows.value=q.state.sunShadow,Ee.directionalLights.value=q.state.directional,Ee.directionalLightShadows.value=q.state.directionalShadow,Ee.spotLights.value=q.state.spot,Ee.spotLightShadows.value=q.state.spotShadow,Ee.rectAreaLights.value=q.state.rectArea,Ee.ltc_1.value=q.state.rectAreaLTC1,Ee.ltc_2.value=q.state.rectAreaLTC2,Ee.pointLights.value=q.state.point,Ee.pointLightShadows.value=q.state.pointShadow,Ee.hemisphereLights.value=q.state.hemi,Ee.sunShadowMatrix.value=q.state.sunShadowMatrix,Ee.sunShadowCascade.value=q.state.sunShadowCascade,Ee.directionalShadowMatrix.value=q.state.directionalShadowMatrix,Ee.spotLightMatrix.value=q.state.spotLightMatrix,Ee.spotLightMap.value=q.state.spotLightMap,Ee.pointShadowMatrix.value=q.state.pointShadowMatrix),X.numLightProbeGrids=xl(M.state.lightProbeGridArray),X.currentProgram=We,X.uniformsList=null,We}function lu(b,z,Y,X,q){const me=De.get(b),be=me.currentProgram.id+","+X+","+q;let de=me.programVariants.get(be);return de===void 0?(de=os(b,z,Y),me.programVariants.set(be,de)):(me.currentProgram=de,me.uniformsList=null,me.outputColorSpace=X,me.toneMapping=q),de}function _l(b){if(b.uniformsList===null){const z=b.currentProgram.getUniforms();b.uniformsList=Rr.seqWithValue(z.seq,b.uniforms)}return b.uniformsList}function yl(b,z){const Y=De.get(b);Y.outputColorSpace=z.outputColorSpace,Y.batching=z.batching,Y.batchingColor=z.batchingColor,Y.instancing=z.instancing,Y.instancingColor=z.instancingColor,Y.instancingMorph=z.instancingMorph,Y.skinning=z.skinning,Y.morphTargets=z.morphTargets,Y.morphNormals=z.morphNormals,Y.morphColors=z.morphColors,Y.morphTargetsCount=z.morphTargetsCount,Y.numClippingPlanes=z.numClippingPlanes,Y.numIntersection=z.numClipIntersection,Y.vertexAlphas=z.vertexAlphas,Y.vertexTangents=z.vertexTangents,Y.toneMapping=z.toneMapping}function cu(b,z,Y,X,q){z.isScene!==!0&&(z=Qt),Ue.resetTextureUnits();const me=z.fog,be=X.isMeshStandardMaterial||X.isMeshLambertMaterial||X.isMeshPhongMaterial?z.environment:null,de=I===null?E.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:qe.workingColorSpace,Me=X.isMeshStandardMaterial||X.isMeshLambertMaterial&&!X.envMap||X.isMeshPhongMaterial&&!X.envMap,Ce=D.get(X.envMap||be,Me),Oe=X.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,We=!!Y.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Ee=!!Y.morphAttributes.position,Xe=!!Y.morphAttributes.normal,_t=!!Y.morphAttributes.color;let lt=Wi;X.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(lt=E.toneMapping);const at=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,Nt=at!==void 0?at.length:0,Te=De.get(X),kt=M.state.lights;if(it===!0&&(Dt===!0||b!==G)){const gt=b===G&&X.id===C;j.setState(X,b,gt)}let je=!1,fn=!1;X.version===Te.__version?Te.needsLights&&Te.lightsStateVersion!==kt.state.version||q.isBatchedMesh&&Te.batching===!1||!q.isBatchedMesh&&Te.batching===!0||q.isBatchedMesh&&Te.batchingColor===!0&&q._colorsTexture===null||q.isBatchedMesh&&Te.batchingColor===!1&&q._colorsTexture!==null||q.isInstancedMesh&&Te.instancing===!1||!q.isInstancedMesh&&Te.instancing===!0||q.isSkinnedMesh&&Te.skinning===!1||!q.isSkinnedMesh&&Te.skinning===!0||q.isInstancedMesh&&Te.instancingColor===!0&&q.instanceColor===null||q.isInstancedMesh&&Te.instancingColor===!1&&q.instanceColor!==null||q.isInstancedMesh&&Te.instancingMorph===!0&&q.morphTexture===null||q.isInstancedMesh&&Te.instancingMorph===!1&&q.morphTexture!==null||Te.envMap!==Ce||X.fog===!0&&Te.fog!==me||Te.numClippingPlanes!==void 0&&(Te.numClippingPlanes!==j.numPlanes||Te.numIntersection!==j.numIntersection)||Te.vertexAlphas!==Oe||Te.vertexTangents!==We||Te.morphTargets!==Ee||Te.morphNormals!==Xe||Te.morphColors!==_t||Te.morphTargetsCount!==Nt||Te.numLightProbeGrids!==xl(M.state.lightProbeGridArray)?je=!0:(Te.outputColorSpace!==de||Te.toneMapping!==lt)&&(fn=!0):(je=!0,Te.__version=X.version);let Ut=Te.currentProgram;(je===!0||fn===!0)&&(Ut=fn===!0?lu(X,z,q,de,lt):os(X,z,q),U&&X.isNodeMaterial&&U.onUpdateProgram(X,Ut,Te));let ks=!1,Yi=!1,dn=!1;const Ke=Ut.getUniforms(),Lt=Te.uniforms;if(xe.useProgram(Ut.program)&&(ks=!0,Yi=!0,dn=!0),X.id!==C&&(C=X.id,Yi=!0),ks||G!==b){xe.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),Ke.setValue(H,"projectionMatrix",b.projectionMatrix),Ke.setValue(H,"viewMatrix",b.matrixWorldInverse);const At=Ke.map.cameraPosition;At!==void 0&&At.setValue(H,bi.setFromMatrixPosition(b.matrixWorld)),dt.logarithmicDepthBuffer&&Ke.setValue(H,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&Ke.setValue(H,"isOrthographic",b.isOrthographicCamera===!0),G!==b&&(G=b,Yi=!0,dn=!0)}if(Te.needsLights&&(kt.state.sunShadowMap.length>0&&Ke.setValue(H,"sunShadowMap",kt.state.sunShadowMap,Ue),kt.state.directionalShadowMap.length>0&&Ke.setValue(H,"directionalShadowMap",kt.state.directionalShadowMap,Ue),kt.state.spotShadowMap.length>0&&Ke.setValue(H,"spotShadowMap",kt.state.spotShadowMap,Ue),kt.state.pointShadowMap.length>0&&Ke.setValue(H,"pointShadowMap",kt.state.pointShadowMap,Ue)),q.isSkinnedMesh){Ke.setOptional(H,q,"bindMatrix"),Ke.setOptional(H,q,"bindMatrixInverse");const gt=q.skeleton;gt&&(gt.boneTexture===null&&gt.computeBoneTexture(),Ke.setValue(H,"boneTexture",gt.boneTexture,Ue))}q.isBatchedMesh&&(Ke.setOptional(H,q,"batchingTexture"),Ke.setValue(H,"batchingTexture",q._matricesTexture,Ue),Ke.setOptional(H,q,"batchingIdTexture"),Ke.setValue(H,"batchingIdTexture",q._indirectTexture,Ue),Ke.setOptional(H,q,"batchingColorTexture"),q._colorsTexture!==null&&Ke.setValue(H,"batchingColorTexture",q._colorsTexture,Ue));const ci=Y.morphAttributes;if((ci.position!==void 0||ci.normal!==void 0||ci.color!==void 0)&&Q.update(q,Y,Ut),(Yi||Te.receiveShadow!==q.receiveShadow)&&(Te.receiveShadow=q.receiveShadow,Ke.setValue(H,"receiveShadow",q.receiveShadow)),(X.isMeshStandardMaterial||X.isMeshLambertMaterial||X.isMeshPhongMaterial)&&X.envMap===null&&z.environment!==null&&(Lt.envMapIntensity.value=z.environmentIntensity),Lt.dfgLUT!==void 0&&(Lt.dfgLUT.value=bx()),Yi){if(Ke.setValue(H,"toneMappingExposure",E.toneMappingExposure),Te.needsLights&&hu(Lt,dn),me&&X.fog===!0&&ce.refreshFogUniforms(Lt,me),ce.refreshMaterialUniforms(Lt,X,ae,_e,M.state.transmissionRenderTarget[b.id]),Te.needsLights&&Te.numLightProbeGrids>0){const gt=R;let At=0;for(const Ni of M.state.lightProbeGridArray)Ni.texture!==null&&(gt.textures[At]=Ni.texture,gt.min[At]=Ni.boundingBox.min,gt.max[At]=Ni.boundingBox.max,gt.resolution[At]=Ni.resolution,At++);for(const Ni in gt)gt[Ni].length=At;Lt.probesSH.value=gt.textures,Lt.probesMin.value=gt.min,Lt.probesMax.value=gt.max,Lt.probesResolution.value=gt.resolution}Rr.upload(H,_l(Te),Lt,Ue)}if(X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(Rr.upload(H,_l(Te),Lt,Ue),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&Ke.setValue(H,"center",q.center),Ke.setValue(H,"modelViewMatrix",q.modelViewMatrix),Ke.setValue(H,"normalMatrix",q.normalMatrix),Ke.setValue(H,"modelMatrix",q.matrixWorld),X.uniformsGroups!==void 0){const gt=X.uniformsGroups;for(let At=0,Ni=gt.length;At<Ni;At++){const Ml=gt[At];Pe.update(Ml,Ut),Pe.bind(Ml,Ut)}}return Ut}function hu(b,z){b.ambientLightColor.needsUpdate=z,b.lightProbe.needsUpdate=z,b.sunLights.needsUpdate=z,b.sunLightShadows.needsUpdate=z,b.directionalLights.needsUpdate=z,b.directionalLightShadows.needsUpdate=z,b.pointLights.needsUpdate=z,b.pointLightShadows.needsUpdate=z,b.spotLights.needsUpdate=z,b.spotLightShadows.needsUpdate=z,b.rectAreaLights.needsUpdate=z,b.hemisphereLights.needsUpdate=z}function uu(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return F},this.getActiveMipmapLevel=function(){return k},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(b,z,Y){const X=De.get(b);X.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),De.get(b.texture).__webglTexture=z,De.get(b.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:Y,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,z){const Y=De.get(b);Y.__webglFramebuffer=z,Y.__useDefaultFramebuffer=z===void 0},this.setRenderTarget=function(b,z=0,Y=0){I=b,F=z,k=Y;let X=null,q=!1,me=!1;if(b){const de=De.get(b);if(de.__useDefaultFramebuffer!==void 0){xe.bindFramebuffer(H.FRAMEBUFFER,de.__webglFramebuffer),W.copy(b.viewport),ee.copy(b.scissor),ne=b.scissorTest,xe.viewport(W),xe.scissor(ee),xe.setScissorTest(ne),C=-1;return}else if(de.__webglFramebuffer===void 0)Ue.setupRenderTarget(b);else if(de.__hasExternalTextures)Ue.rebindTextures(b,De.get(b.texture).__webglTexture,De.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const Oe=b.depthTexture;if(de.__boundDepthTexture!==Oe){if(Oe!==null&&De.has(Oe)&&(b.width!==Oe.image.width||b.height!==Oe.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Ue.setupDepthRenderbuffer(b)}}const Me=b.texture;(Me.isData3DTexture||Me.isDataArrayTexture||Me.isCompressedArrayTexture)&&(me=!0);const Ce=De.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Ce[z])?X=Ce[z][Y]:X=Ce[z],q=!0):b.samples>0&&Ue.useMultisampledRTT(b)===!1?X=De.get(b).__webglMultisampledFramebuffer:Array.isArray(Ce)?X=Ce[Y]:X=Ce,W.copy(b.viewport),ee.copy(b.scissor),ne=b.scissorTest}else W.copy(Re).multiplyScalar(ae).floor(),ee.copy(Ge).multiplyScalar(ae).floor(),ne=se;if(Y!==0&&(X=N),xe.bindFramebuffer(H.FRAMEBUFFER,X)&&xe.drawBuffers(b,X),xe.viewport(W),xe.scissor(ee),xe.setScissorTest(ne),q){const de=De.get(b.texture);H.framebufferTexture2D(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_CUBE_MAP_POSITIVE_X+z,de.__webglTexture,Y)}else if(me){const de=z;for(let Me=0;Me<b.textures.length;Me++){const Ce=De.get(b.textures[Me]);H.framebufferTextureLayer(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0+Me,Ce.__webglTexture,Y,de)}}else if(b!==null&&Y!==0){const de=De.get(b.texture);H.framebufferTexture2D(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_2D,de.__webglTexture,Y)}C=-1};function Sl(b){const z=De.get(b);return(z.__readFormat!==b.format||z.__readType!==b.type)&&(z.__readFormat=b.format,z.__readType=b.type,z.__formatReadable=dt.textureFormatReadable(b.format),z.__typeReadable=dt.textureTypeReadable(b.type)),z}this.readRenderTargetPixels=function(b,z,Y,X,q,me,be,de=0){if(!(b&&b.isWebGLRenderTarget)){Qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Me=De.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&be!==void 0&&(Me=Me[be],Array.isArray(Me)&&(Me=Me[0])),Me){xe.bindFramebuffer(H.FRAMEBUFFER,Me);try{const Ce=b.textures[de],Oe=Ce.format,We=Ce.type;b.textures.length>1&&H.readBuffer(H.COLOR_ATTACHMENT0+de);const Ee=Sl(Ce);if(Ee.__formatReadable===!1){Qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ee.__typeReadable===!1){Qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}z>=0&&z<=b.width-X&&Y>=0&&Y<=b.height-q&&H.readPixels(z,Y,X,q,le.convert(Oe),le.convert(We),me)}finally{const Ce=I!==null?De.get(I).__webglFramebuffer:null;xe.bindFramebuffer(H.FRAMEBUFFER,Ce)}}},this.readRenderTargetPixelsAsync=async function(b,z,Y,X,q,me,be,de=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Me=De.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&be!==void 0&&(Me=Me[be],Array.isArray(Me)&&(Me=Me[0])),Me)if(z>=0&&z<=b.width-X&&Y>=0&&Y<=b.height-q){xe.bindFramebuffer(H.FRAMEBUFFER,Me);const Ce=b.textures[de],Oe=Ce.format,We=Ce.type;b.textures.length>1&&H.readBuffer(H.COLOR_ATTACHMENT0+de);const Ee=Sl(Ce);if(Ee.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ee.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Xe=H.createBuffer();H.bindBuffer(H.PIXEL_PACK_BUFFER,Xe),H.bufferData(H.PIXEL_PACK_BUFFER,me.byteLength,H.STREAM_READ),H.readPixels(z,Y,X,q,le.convert(Oe),le.convert(We),0),H.bindBuffer(H.PIXEL_PACK_BUFFER,null);const _t=I!==null?De.get(I).__webglFramebuffer:null;xe.bindFramebuffer(H.FRAMEBUFFER,_t);const lt=H.fenceSync(H.SYNC_GPU_COMMANDS_COMPLETE,0);return H.flush(),await Kd(H,lt,4),H.bindBuffer(H.PIXEL_PACK_BUFFER,Xe),H.getBufferSubData(H.PIXEL_PACK_BUFFER,0,me),H.bindBuffer(H.PIXEL_PACK_BUFFER,null),H.deleteBuffer(Xe),H.deleteSync(lt),me}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,z=null,Y=0){const X=Math.pow(2,-Y),q=Math.floor(b.image.width*X),me=Math.floor(b.image.height*X),be=z!==null?z.x:0,de=z!==null?z.y:0;Ue.setTexture2D(b,0),H.copyTexSubImage2D(H.TEXTURE_2D,Y,0,0,be,de,q,me),xe.unbindTexture()},this.copyTextureToTexture=function(b,z,Y=null,X=null,q=0,me=0){let be,de,Me,Ce,Oe,We,Ee,Xe,_t;const lt=b.isCompressedTexture?b.mipmaps[me]:b.image;if(Y!==null)be=Y.max.x-Y.min.x,de=Y.max.y-Y.min.y,Me=Y.isBox3?Y.max.z-Y.min.z:1,Ce=Y.min.x,Oe=Y.min.y,We=Y.isBox3?Y.min.z:0;else{const Ke=Math.pow(2,-q);be=Math.floor(lt.width*Ke),de=Math.floor(lt.height*Ke),b.isDataArrayTexture?Me=lt.depth:b.isData3DTexture?Me=Math.floor(lt.depth*Ke):Me=1,Ce=0,Oe=0,We=0}X!==null?(Ee=X.x,Xe=X.y,_t=X.z):(Ee=0,Xe=0,_t=0);const at=le.convert(z.format),Nt=le.convert(z.type);let Te;z.isData3DTexture?(Ue.setTexture3D(z,0),Te=H.TEXTURE_3D):z.isDataArrayTexture||z.isCompressedArrayTexture?(Ue.setTexture2DArray(z,0),Te=H.TEXTURE_2D_ARRAY):(Ue.setTexture2D(z,0),Te=H.TEXTURE_2D),xe.activeTexture(H.TEXTURE0),xe.pixelStorei(H.UNPACK_FLIP_Y_WEBGL,z.flipY),xe.pixelStorei(H.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),xe.pixelStorei(H.UNPACK_ALIGNMENT,z.unpackAlignment);const kt=xe.getParameter(H.UNPACK_ROW_LENGTH),je=xe.getParameter(H.UNPACK_IMAGE_HEIGHT),fn=xe.getParameter(H.UNPACK_SKIP_PIXELS),Ut=xe.getParameter(H.UNPACK_SKIP_ROWS),ks=xe.getParameter(H.UNPACK_SKIP_IMAGES);xe.pixelStorei(H.UNPACK_ROW_LENGTH,lt.width),xe.pixelStorei(H.UNPACK_IMAGE_HEIGHT,lt.height),xe.pixelStorei(H.UNPACK_SKIP_PIXELS,Ce),xe.pixelStorei(H.UNPACK_SKIP_ROWS,Oe),xe.pixelStorei(H.UNPACK_SKIP_IMAGES,We);const Yi=b.isDataArrayTexture||b.isData3DTexture,dn=z.isDataArrayTexture||z.isData3DTexture;if(b.isDepthTexture){const Ke=De.get(b),Lt=De.get(z),ci=De.get(Ke.__renderTarget),gt=De.get(Lt.__renderTarget);xe.bindFramebuffer(H.READ_FRAMEBUFFER,ci.__webglFramebuffer),xe.bindFramebuffer(H.DRAW_FRAMEBUFFER,gt.__webglFramebuffer);for(let At=0;At<Me;At++)Yi&&(H.framebufferTextureLayer(H.READ_FRAMEBUFFER,H.COLOR_ATTACHMENT0,De.get(b).__webglTexture,q,We+At),H.framebufferTextureLayer(H.DRAW_FRAMEBUFFER,H.COLOR_ATTACHMENT0,De.get(z).__webglTexture,me,_t+At)),H.blitFramebuffer(Ce,Oe,Ce+be,Oe+de,Ee,Xe,Ee+be,Xe+de,H.DEPTH_BUFFER_BIT,H.NEAREST);xe.bindFramebuffer(H.READ_FRAMEBUFFER,null),xe.bindFramebuffer(H.DRAW_FRAMEBUFFER,null)}else if(q!==0||b.isRenderTargetTexture||De.has(b)){const Ke=De.get(b),Lt=De.get(z);xe.bindFramebuffer(H.READ_FRAMEBUFFER,P),xe.bindFramebuffer(H.DRAW_FRAMEBUFFER,B);for(let ci=0;ci<Me;ci++)Yi?H.framebufferTextureLayer(H.READ_FRAMEBUFFER,H.COLOR_ATTACHMENT0,Ke.__webglTexture,q,We+ci):H.framebufferTexture2D(H.READ_FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_2D,Ke.__webglTexture,q),dn?H.framebufferTextureLayer(H.DRAW_FRAMEBUFFER,H.COLOR_ATTACHMENT0,Lt.__webglTexture,me,_t+ci):H.framebufferTexture2D(H.DRAW_FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_2D,Lt.__webglTexture,me),q!==0?H.blitFramebuffer(Ce,Oe,Ce+be,Oe+de,Ee,Xe,Ee+be,Xe+de,H.COLOR_BUFFER_BIT,H.NEAREST):dn?H.copyTexSubImage3D(Te,me,Ee,Xe,_t+ci,Ce,Oe,be,de):H.copyTexSubImage2D(Te,me,Ee,Xe,Ce,Oe,be,de);xe.bindFramebuffer(H.READ_FRAMEBUFFER,null),xe.bindFramebuffer(H.DRAW_FRAMEBUFFER,null)}else dn?b.isDataTexture||b.isData3DTexture?H.texSubImage3D(Te,me,Ee,Xe,_t,be,de,Me,at,Nt,lt.data):z.isCompressedArrayTexture?H.compressedTexSubImage3D(Te,me,Ee,Xe,_t,be,de,Me,at,lt.data):H.texSubImage3D(Te,me,Ee,Xe,_t,be,de,Me,at,Nt,lt):b.isDataTexture?H.texSubImage2D(H.TEXTURE_2D,me,Ee,Xe,be,de,at,Nt,lt.data):b.isCompressedTexture?H.compressedTexSubImage2D(H.TEXTURE_2D,me,Ee,Xe,lt.width,lt.height,at,lt.data):H.texSubImage2D(H.TEXTURE_2D,me,Ee,Xe,be,de,at,Nt,lt);xe.pixelStorei(H.UNPACK_ROW_LENGTH,kt),xe.pixelStorei(H.UNPACK_IMAGE_HEIGHT,je),xe.pixelStorei(H.UNPACK_SKIP_PIXELS,fn),xe.pixelStorei(H.UNPACK_SKIP_ROWS,Ut),xe.pixelStorei(H.UNPACK_SKIP_IMAGES,ks),me===0&&z.generateMipmaps===!0&&z.mipmapsAutoUpdate===!0&&H.generateMipmap(Te),xe.unbindTexture()},this.initRenderTarget=function(b){De.get(b).__webglFramebuffer===void 0&&Ue.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?Ue.setTextureCube(b,0):b.isData3DTexture?Ue.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?Ue.setTexture2DArray(b,0):Ue.setTexture2D(b,0),xe.unbindTexture()},this.resetState=function(){F=0,k=0,I=null,xe.reset(),he.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Mi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=qe._getDrawingBufferColorSpace(e),t.unpackColorSpace=qe._getUnpackColorSpace()}}const Bc=`precision highp float;
in vec3 position;in vec2 uv;uniform mat4 projectionMatrix,modelViewMatrix;uniform vec2 size,warpBounds;uniform bool warped;out vec2 texUV,localPoint;
void main(){texUV=uv;localPoint=position.xy*size;if(warped)localPoint.x=mix(warpBounds.x,warpBounds.y,position.x);gl_Position=projectionMatrix*modelViewMatrix*vec4(localPoint,0.,1.);}`,Tx=`precision highp float;
uniform sampler2D image,palette;uniform bool indexed,maskZero;uniform vec2 coefficients;uniform float opacity;
uniform bool warped;uniform vec4 warpEdges;uniform vec2 size;uniform int fxCount;uniform vec3 fxAdd[8],fxMul[8],fxPost[8];uniform vec2 fxColorInvert[8];in vec2 texUV,localPoint;out vec4 result;
void main(){vec2 sampleUV=texUV;if(warped){vec2 edges=mix(warpEdges.xy,warpEdges.zw,clamp(localPoint.y/size.y,0.,1.));float span=edges.y-edges.x;if(abs(span)<.00001)discard;float u=(localPoint.x-edges.x)/span;if(u<0.||u>=1.)discard;sampleUV=vec2(u,localPoint.y/size.y);}vec4 color=texture(image,sampleUV);if(indexed){float i=floor(color.r*255.+.5);color=texture(palette,vec2((i+.5)/256.,.5));if(i<.5){if(maskZero)discard;color.a=1.;}}if(color.a<=0.)discard;
vec3 rgb=color.rgb*255.;for(int i=0;i<8;i++){if(i>=fxCount)break;float grey=dot(rgb,vec3(.299,.587,.114));rgb=mix(vec3(grey),rgb,fxColorInvert[i].x);if(fxColorInvert[i].y>.5)rgb=255.-rgb;rgb=clamp((rgb+fxAdd[i])*fxMul[i]+fxPost[i],0.,255.);}
rgb=floor(rgb+.00001)/255.;float coverage=color.a*opacity;result=vec4(rgb*coefficients.x*coverage,coverage*(1.-coefficients.y));}`,Ax=`precision highp float;uniform float ground;in vec2 texUV;out vec4 result;
void main(){vec2 p=vec2(texUV.x*960.,texUV.y*540.);vec3 color=vec3(.047,.067,.106);float h=ground-105.;if(p.y>h){float distance=p.y-h+16.;float x=(p.x-480.)*100./distance;float lines=min(abs(fract(x/80.+.5)-.5)*distance/100.,abs(fract(log(distance/16.)*3.)-.5)*distance*.18);color=mix(vec3(.105,.153,.215),color,smoothstep(.35,1.1,lines));}if(abs(p.y-ground)<.6)color=vec3(.27,.38,.33);result=vec4(color,1.);}`,Rx=()=>({add:Array.from({length:8},()=>[0,0,0]),mul:Array.from({length:8},()=>[1,1,1]),post:Array.from({length:8},()=>[0,0,0]),color:Array.from({length:8},()=>[1,0])});class Cx{constructor(e,{maxTextureBytes:t=64*1024*1024,preserveDrawingBuffer:i=!1}={}){this.renderer=new Ex({canvas:e,alpha:!1,antialias:!1,powerPreference:"high-performance",preserveDrawingBuffer:i}),this.renderer.debug.onShaderError=(a,o)=>{throw Error("Sprite shader could not compile: "+a.getProgramInfoLog(o))},this.renderer.outputColorSpace=Ls,this.renderer.sortObjects=!1,this.renderer.setClearColor(790811,1),this.canvas=e,this.contextLost=a=>{a.preventDefault(),this.lost=!0},e.addEventListener("webglcontextlost",this.contextLost),this.limit=t,this.textureBytes=0,this.textures=new Map,this.slots=[],this.frames=0,this.scene=new pp,this.camera=new Kh(0,960,0,540,-10,10),this.camera.position.z=1,this.geometry=new hn,this.geometry.setAttribute("position",new wi([0,0,0,1,0,0,0,1,0,1,1,0],3)),this.geometry.setAttribute("uv",new wi([0,0,1,0,0,1,1,1],2)),this.geometry.setIndex([0,1,2,2,1,3]);const s=new Go({glslVersion:zr,vertexShader:Bc,fragmentShader:Ax,uniforms:{size:{value:[960,540]},ground:{value:450},warped:{value:!1},warpBounds:{value:[0,0]}},side:_i,depthTest:!1,depthWrite:!1});this.grid=new $i(this.geometry,s),this.grid.frustumCulled=!1,this.scene.add(this.grid),this.upload({id:"@white",width:1,height:1,indexed:!1,pixels:new Uint8Array([255,255,255,255])});const r=new Uint8Array(256);for(let a=0;a<8;a++)for(let o=0;o<8;o++)if(o===3||a===3||Math.abs(o-3)===Math.abs(a-3)){const l=(a*8+o)*4;r.set([255,240,130,255],l)}this.upload({id:"@spark",width:8,height:8,pixels:r})}upload(e){if(this.textures.has(e.id))return;const t=e.pixels,i=e.width*e.height*(e.indexed?1:4);if(!Number.isSafeInteger(e.width)||!Number.isSafeInteger(e.height)||e.width<1||e.height<1)throw Error("Invalid GPU asset dimensions.");if(e.width>this.renderer.capabilities.maxTextureSize||e.height>this.renderer.capabilities.maxTextureSize)throw Error("Sprite exceeds this graphics device’s texture limit.");if(!(t instanceof Uint8Array)||t.length!==i)throw Error("Invalid GPU asset dimensions.");if(this.textureBytes+t.length>this.limit)throw Error("GPU texture budget exceeded. Close this match or use a smaller stage.");const s=new Vh(t,e.width,e.height,e.indexed?Qo:Si,Jt);s.minFilter=s.magFilter=Pt,s.wrapS=s.wrapT=Ci,s.generateMipmaps=!1,s.flipY=!1,s.unpackAlignment=1,s.needsUpdate=!0,this.textures.set(e.id,s),this.textureBytes+=t.length}slot(e){if(this.slots[e])return this.slots[e];const t=Rx(),i=new Go({glslVersion:zr,vertexShader:Bc,fragmentShader:Tx,uniforms:{image:{value:null},palette:{value:null},indexed:{value:!1},maskZero:{value:!0},size:{value:[1,1]},warped:{value:!1},warpEdges:{value:[0,1,0,1]},warpBounds:{value:[0,1]},coefficients:{value:[1,0]},opacity:{value:1},fxCount:{value:0},fxAdd:{value:t.add.flat()},fxMul:{value:t.mul.flat()},fxPost:{value:t.post.flat()},fxColorInvert:{value:t.color.flat()}},transparent:!0,depthTest:!1,depthWrite:!1,blending:gh,blendSrc:eo,blendDst:Fr,blendEquation:Vi,blendEquationAlpha:Vi,blendSrcAlpha:eo,blendDstAlpha:Fr});i.side=_i,i.forceSinglePass=!0;const s=new $i(this.geometry,i);return s.matrixAutoUpdate=!1,s.frustumCulled=!1,s.onBeforeRender=()=>{const r=s.userData.clip,a=this.renderer,o=this.canvas.width/960;a.setScissorTest(!!r),r&&a.setScissor(r[0]*o,(540-r[1]-r[3])*o,r[2]*o,r[3]*o),i.uniformsNeedUpdate=!0},this.scene.add(s),this.slots[e]=s,s}render(e,{width:t=960,height:i=540}={}){var r,a,o,l,c,d;if(this.closed)return;if(this.lost)throw Error("Graphics context was lost. Start the match again from your library.");(this.canvas.width!==t||this.canvas.height!==i)&&this.renderer.setSize(t,i,!1);for(const f of e.assets||[])this.upload(f);this.grid.visible=!!e.grid,this.grid.material.uniforms.ground.value=e.ground||450;const s=e.draws.concat((e.sparks||[]).map(f=>{const h=(12-f.age)*.3+1;return{texture:"@spark",indexed:!1,width:8,height:8,matrix:[h,0,0,h,f.x-4*h,f.y-4*h],blend:{mode:"add",source:1,destination:1},alpha:(12-f.age)/12}}));for(let f=0;f<Math.max(s.length,this.slots.length);f++){if(f>=s.length){this.slots[f].visible=!1;continue}const h=s[f],u=this.slot(f),p=u.material.uniforms;u.visible=!0;const x=this.textures.get(h.texture);if(!x)throw Error("GPU texture was not delivered: "+h.texture);if(p.image.value=x,p.palette.value=this.textures.get(h.palette)||this.textures.get("@white"),p.indexed.value=!!h.indexed,p.maskZero.value=h.mask!==!1,p.size.value[0]=h.width,p.size.value[1]=h.height,p.warped.value=!!h.warp,h.warp){for(let g=0;g<4;g++)p.warpEdges.value[g]=h.warp[g];p.warpBounds.value[0]=Math.min(...h.warp),p.warpBounds.value[1]=Math.max(...h.warp)}p.opacity.value=h.alpha??1,p.coefficients.value[0]=((r=h.blend)==null?void 0:r.source)??1,p.coefficients.value[1]=((a=h.blend)==null?void 0:a.destination)??0;const[m,v,y,T,R,S]=h.matrix;u.matrix.set(m,y,0,R,v,T,0,S,0,0,1,0,0,0,0,1),u.matrixWorldNeedsUpdate=!0,u.userData.clip=h.clip,u.material.blendEquation=((o=h.blend)==null?void 0:o.mode)==="subtract"?vh:Vi;const M=h.palFX||[];p.fxCount.value=Math.min(8,M.length);for(let g=0;g<p.fxCount.value;g++){const _=M[g],L=_.sinadd||[],E=L[3]?Math.sin(2*Math.PI*(_.age||0)/L[3]):0;p.fxColorInvert.value[g*2]=(_.color??256)/256,p.fxColorInvert.value[g*2+1]=_.invertall?1:0;for(let A=0;A<3;A++)p.fxAdd.value[g*3+A]=(((l=_.add)==null?void 0:l[A])||0)+(L[A]||0)*E,p.fxMul.value[g*3+A]=(((c=_.mul)==null?void 0:c[A])??256)/256,p.fxPost.value[g*3+A]=((d=_.postadd)==null?void 0:d[A])||0}}return this.renderer.setScissorTest(!1),this.renderer.render(this.scene,this.camera),this.renderer.setScissorTest(!1),this.frames++,this.stats={backend:"Kenjatime Core · Three.js",frames:this.frames,draws:s.length,textureBytes:this.textureBytes,textures:this.textures.size,width:t,height:i},this.stats}close(){if(!this.closed){this.closed=!0,this.canvas.removeEventListener("webglcontextlost",this.contextLost);for(const e of this.textures.values())e.dispose();for(const e of this.slots)e.material.dispose();this.grid.material.dispose(),this.geometry.dispose(),this.renderer.dispose(),this.renderer.forceContextLoss(),this.textures.clear()}}}const zc=1e3/60;class Px{constructor({maxTicks:e=12}={}){this.maxTicks=e,this.reset()}reset(){this.last=null,this.debt=0,this.tickCount=0,this.lastRender=null}suspend(){this.last=null,this.debt=0,this.lastRender=null}advance(e,{running:t=!0,speed:i=1}={},s=()=>{}){if(!Number.isFinite(e)||!Number.isFinite(i)||i<=0)throw Error("Invalid frame clock time or speed.");const r=this.last===null?0:Math.max(0,e-this.last);if(this.last=e,!t)return this.debt=0,0;this.debt+=r*i/zc;let a=0;for(;this.debt>=1-1e-9&&a<this.maxTicks;){const o=e-Math.max(0,this.debt-1)*zc/i;s(o),this.debt=Math.max(0,this.debt-1),a++,this.tickCount++}return a}renderDue(e,t=60){return this.lastRender===null||e-this.lastRender>=1e3/t-.25?(this.lastRender=e,!0):!1}}class Hc{constructor(){this.reset()}reset(){this.sources=new Map,this.sampled=new Map,this.queue=[],this.offset=0}clearSource(e){this.sources.delete(e),this.sampled.delete(e),this.queue=this.queue.slice(this.offset).filter(t=>t.source!==e),this.offset=0}record(e,t,i){const s=new Set(t),r=this.sources.get(e)||new Set;if(s.size===r.size&&[...s].every(l=>r.has(l)))return;this.sources.set(e,s);const a={source:e,keys:s,time:i};let o=this.queue.length;for(;o>this.offset&&this.queue[o-1].time>i;)o--;this.queue.splice(o,0,a)}sample(e){const t=new Set;for(;this.offset<this.queue.length&&this.queue[this.offset].time<=e;){const s=this.queue[this.offset++],r=this.sampled.get(s.source)||new Set;for(const a of s.keys)r.has(a)||t.add(a);this.sampled.set(s.source,s.keys)}const i=new Set(t);for(const s of this.sampled.values())for(const r of s)i.add(r);return this.offset>128&&(this.queue.splice(0,this.offset),this.offset=0),i}}class Lx{constructor(e,t=globalThis){this.callback=e,this.host=t,this.handle=null,this.timer=!1}schedule({timer:e=!1,catchUp:t=!1,idle:i=!1}={}){this.cancel(),this.timer=e||t||i||typeof this.host.requestAnimationFrame!="function";const s=r=>{this.handle=null,this.callback(r)};this.handle=this.timer?this.host.setTimeout(()=>s(this.host.performance.now()),t?0:i?100:1e3/60):this.host.requestAnimationFrame(s)}cancel(){this.handle!==null&&(this.timer?this.host.clearTimeout(this.handle):this.host.cancelAnimationFrame(this.handle),this.handle=null)}}function Ix(n){let e,t,i=!1,s=!1,r=!1,a=!0,o=!1,l=!0,c=-1/0,d=1,f="auto",h,u,p,x=1,m=!0;const v=new Px,y=[new Hc,new Hc],T=new Map,R=new Set,S=new Map,M=[],g=new Lx(A),_=()=>g.schedule({timer:o||!l,catchUp:!r&&v.debt>=1,idle:r});function L(F){const k=new Float32Array(F);if(k.fill(0),p&&!r){let I=0;for(;I<k.length/2;){let C=p.read(Math.min(2048,k.length/2-I));if(!C&&(!m||(p.seek(0),C=p.read(Math.min(2048,k.length/2-I)),!C)))break;k.set(new Float32Array(p.pcm.buffer,p.pcm.byteOffset,C*2),I*2),I+=C}if(x!==1)for(let C=0;C<k.length;C++)k[C]*=x}h==null||h.postMessage({buffer:F},[F])}function E(){var F,k,I;for(const C of e.drainEvents()){if(C.type==="playsnd")try{const G=e.characters.find(V=>V.path===C.character),W=(F=G==null?void 0:G.checks.find(V=>V.key==="sound"&&V.ok))==null?void 0:F.path;if(!W||C.common)continue;T.has(W)||T.set(W,Cu(e.files[W]));const ee=C.group??((k=C.value)==null?void 0:k[0]),ne=C.number??((I=C.value)==null?void 0:I[1]);if(C.soundKey=W+":"+ee+","+ne,S.set(C.soundKey,{path:W,group:ee,number:ne}),!R.has(C.soundKey)){const V=T.get(W).get(ee,ne);if(!V)continue;C.bytes=V.slice(),R.add(C.soundKey)}}catch(G){e.issue("sound",G.message);continue}n({type:"sound",event:C},C.bytes?[C.bytes.buffer]:[])}}function A(F){if(!i)try{const k=performance.timeOrigin+F;if(v.advance(k,{running:!r},I=>{e.tick(y[0].sample(I),y[1].sample(I)),E()}),!o&&v.debt<1&&(!r||a)&&v.renderDue(F,60)){const I=performance.now(),C=e.frame();t.render(C,{width:Math.round(960*d),height:Math.round(540*d)});const G=performance.now()-I;if(a=!1,f==="auto"&&!C.assets.length&&!r&&(M.push(G),M.length>=30)){const W=M.reduce((ee,ne)=>ee+ne,0)/M.length;W>20?d=Math.max(.5,d-.05):W<9&&(d=Math.min(1,d+.05)),M.length=0}}F-c>=100&&(c=F,n({type:"state",state:{...e.snapshot(),paused:r,background:o,focused:l,simulationDebt:v.debt},gpu:t.stats})),_()}catch(k){n({type:"error",message:k.message}),P()}}async function U({files:F,selection:k,canvas:I,sampleRate:C=48e3,quality:G="auto"}){var ee;f=G,t||B(I),e=new gd(F,k);const W=(ee=e.match.stage)==null?void 0:ee.definition.music;if(W!=null&&W.path&&F[W.path])if(/\.(mod|xm|it|s3m)$/i.test(W.path)){const{createModuleMusic:ne}=await import("./module-music-C2Wy91BT.js");if(i)return;const V=await ne();if(i){V.close();return}u=V,p=u.open(F[W.path],C),x=Math.max(0,Math.min(2,W.volume/100)),m=W.loop,n({type:"audio-init",sampleRate:C})}else{const ne=F[W.path].slice();n({type:"music",bytes:ne,path:W.path,volume:W.volume,loop:W.loop},[ne.buffer])}i||(s=!0,n({type:"ready",capabilities:e.capabilities}),_())}function N(F){var k,I;if(!i){if(F.type==="visibility"){o=!!F.hidden,l=F.focused!==!1,o||(a=!0),s&&_();return}if(F.type==="release-inputs"){y.forEach(C=>C.reset());return}if(F.type==="sound-request"){try{const C=S.get(F.key),G=C&&((I=(k=T.get(C.path))==null?void 0:k.get(C.group,C.number))==null?void 0:I.slice());if(!G)throw Error("Sound is unavailable.");n({type:"sound-data",key:F.key,bytes:G},[G.buffer])}catch(C){n({type:"sound-data",key:F.key,error:C.message})}return}F.type==="input"&&Array.isArray(F.keys)&&y[F.side===1?1:0].record(F.source||"keyboard",F.keys,F.time??performance.timeOrigin+performance.now()),F.type==="pause"&&(r=!!F.value,y.forEach(C=>C.reset()),v.suspend(),a=!0,s&&_()),F.type==="quality"&&(f=F.value,d=1,M.length=0,a=!0),F.type==="audio-port"&&(h=F.port,h.onmessage=({data:C})=>{!i&&C.buffer instanceof ArrayBuffer&&C.buffer.byteLength===8192&&L(C.buffer)},h.start()),F.type==="stop"&&P()}}function P(){i||(i=!0,g.cancel(),h==null||h.close(),u==null||u.close(),e==null||e.close(),t==null||t.close(),h=u=p=e=t=null,T.clear(),R.clear(),S.clear(),y.forEach(F=>F.reset()))}function B(F){if(i)throw Error("Match cancelled.");t||(t=new Cx(F))}return{start:U,prepare:B,control:N,stop:P,snapshot:()=>e==null?void 0:e.snapshot(),get gpu(){return t==null?void 0:t.stats}}}const mr=Ix((n,e=[])=>self.postMessage(n,e));self.onmessage=({data:n})=>{if(n.type==="prepare"){try{mr.prepare(n.canvas),self.postMessage({type:"renderer-ready"})}catch(e){mr.stop(),self.postMessage({type:"renderer-unavailable",message:e.message})}return}n.type==="start"?mr.start(n).catch(e=>self.postMessage({type:"error",message:e.message})):mr.control(n)};
