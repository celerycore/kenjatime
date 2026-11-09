class pu{constructor({maxBytes:e=16*1024*1024,maxEntries:t=512,sizeOf:i=s=>{var r;return((r=s==null?void 0:s.rgba)==null?void 0:r.byteLength)||0}}={}){this.maxBytes=e,this.maxEntries=t,this.sizeOf=i,this.entries=new Map,this.bytes=0,this.hits=0,this.misses=0,this.evictions=0}get size(){return this.entries.size}has(e){return this.entries.has(e)}get(e){const t=this.entries.get(e);if(!t){this.misses++;return}return this.hits++,this.entries.delete(e),this.entries.set(e,t),t.value}set(e,t){this.delete(e);const i=Math.max(0,this.sizeOf(t)||0);if(i>this.maxBytes||this.maxEntries<1)return this;for(this.entries.set(e,{value:t,bytes:i}),this.bytes+=i;this.bytes>this.maxBytes||this.size>this.maxEntries;)this.delete(this.entries.keys().next().value),this.evictions++;return this}delete(e){const t=this.entries.get(e);return t?(this.bytes-=t.bytes,this.entries.delete(e)):!1}clear(){this.entries.clear(),this.bytes=0}}var pi=Uint8Array,us=Uint16Array,qd=Int32Array,mu=new pi([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),gu=new pi([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Yd=new pi([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),vu=function(n,e){for(var t=new us(31),i=0;i<31;++i)t[i]=e+=1<<n[i-1];for(var s=new qd(t[30]),i=1;i<30;++i)for(var r=t[i];r<t[i+1];++r)s[r]=r-t[i]<<5|i;return{b:t,r:s}},_u=vu(mu,2),xu=_u.b,Kd=_u.r;xu[28]=258,Kd[258]=28;var Zd=vu(gu,0),jd=Zd.b,Uo=new us(32768);for(var mt=0;mt<32768;++mt){var hn=(mt&43690)>>1|(mt&21845)<<1;hn=(hn&52428)>>2|(hn&13107)<<2,hn=(hn&61680)>>4|(hn&3855)<<4,Uo[mt]=((hn&65280)>>8|(hn&255)<<8)>>1}var Zs=(function(n,e,t){for(var i=n.length,s=0,r=new us(e);s<i;++s)n[s]&&++r[n[s]-1];var a=new us(e);for(s=1;s<e;++s)a[s]=a[s-1]+r[s-1]<<1;var o;if(t){o=new us(1<<e);var l=15-e;for(s=0;s<i;++s)if(n[s])for(var c=s<<4|n[s],h=e-n[s],f=a[n[s]-1]++<<h,u=f|(1<<h)-1;f<=u;++f)o[Uo[f]>>l]=c}else for(o=new us(i),s=0;s<i;++s)n[s]&&(o[s]=Uo[a[n[s]-1]++]>>15-n[s]);return o}),ur=new pi(288);for(var mt=0;mt<144;++mt)ur[mt]=8;for(var mt=144;mt<256;++mt)ur[mt]=9;for(var mt=256;mt<280;++mt)ur[mt]=7;for(var mt=280;mt<288;++mt)ur[mt]=8;var yu=new pi(32);for(var mt=0;mt<32;++mt)yu[mt]=5;var Jd=Zs(ur,9,1),Qd=Zs(yu,5,1),Va=function(n){for(var e=n[0],t=1;t<n.length;++t)n[t]>e&&(e=n[t]);return e},xi=function(n,e,t){var i=e/8|0;return(n[i]|n[i+1]<<8)>>(e&7)&t},Ga=function(n,e){var t=e/8|0;return(n[t]|n[t+1]<<8|n[t+2]<<16)>>(e&7)},ef=function(n){return(n+7)/8|0},tf=function(n,e,t){return(t==null||t>n.length)&&(t=n.length),new pi(n.subarray(e,t))},nf=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],Ei=function(n,e,t){var i=new Error(e||nf[n]);if(i.code=n,Error.captureStackTrace&&Error.captureStackTrace(i,Ei),!t)throw i;return i},sf=function(n,e,t,i){var s=n.length,r=i?i.length:0;if(!s||e.f&&!e.l)return t||new pi(0);var a=!t,o=a||e.i!=2,l=e.i;a&&(t=new pi(s*3));var c=function(Ee){var De=t.length;if(Ee>De){var se=new pi(Math.max(De*2,Ee));se.set(t),t=se}},h=e.f||0,f=e.p||0,u=e.b||0,d=e.l,p=e.d,_=e.m,m=e.n,v=s*8;do{if(!d){h=xi(n,f,1);var y=xi(n,f+1,3);if(f+=3,y)if(y==1)d=Jd,p=Qd,_=9,m=5;else if(y==2){var M=xi(n,f,31)+257,g=xi(n,f+10,15)+4,x=M+xi(n,f+5,31)+1;f+=14;for(var P=new pi(x),T=new pi(19),I=0;I<g;++I)T[Yd[I]]=xi(n,f+I*3,7);f+=g*3;for(var U=Va(T),D=(1<<U)-1,w=Zs(T,U,1),I=0;I<x;){var O=w[xi(n,f,D)];f+=O&15;var A=O>>4;if(A<16)P[I++]=A;else{var B=0,z=0;for(A==16?(z=3+xi(n,f,3),f+=2,B=P[I-1]):A==17?(z=3+xi(n,f,7),f+=3):A==18&&(z=11+xi(n,f,127),f+=7);z--;)P[I++]=B}}var L=P.subarray(0,M),C=P.subarray(M);_=Va(L),m=Va(C),d=Zs(L,_,1),p=Zs(C,m,1)}else Ei(1);else{var A=ef(f)+4,R=n[A-4]|n[A-3]<<8,S=A+R;if(S>s){l&&Ei(0);break}o&&c(u+R),t.set(n.subarray(A,S),u),e.b=u+=R,e.p=f=S*8,e.f=h;continue}if(f>v){l&&Ei(0);break}}o&&c(u+131072);for(var H=(1<<_)-1,W=(1<<m)-1,K=f;;K=f){var B=d[Ga(n,f)&H],Q=B>>4;if(f+=B&15,f>v){l&&Ei(0);break}if(B||Ei(2),Q<256)t[u++]=Q;else if(Q==256){K=f,d=null;break}else{var G=Q-254;if(Q>264){var I=Q-257,j=mu[I];G=xi(n,f,(1<<j)-1)+xu[I],f+=j}var re=p[Ga(n,f)&W],le=re>>4;re||Ei(3),f+=re&15;var C=jd[le];if(le>3){var j=gu[le];C+=Ga(n,f)&(1<<j)-1,f+=j}if(f>v){l&&Ei(0);break}o&&c(u+131072);var ae=u+G;if(u<C){var Ie=r-C,it=Math.min(C,ae);for(Ie+u<0&&Ei(3);u<it;++u)t[u]=i[Ie+u]}for(;u<ae;++u)t[u]=t[u-C]}}e.l=d,e.p=K,e.b=u,e.f=h,d&&(h=1,e.m=_,e.d=p,e.n=m)}while(!h);return u!=t.length&&a?tf(t,0,u):t.subarray(0,u)},rf=new pi(0),af=function(n,e){return((n[0]&15)!=8||n[0]>>4>7||(n[0]<<8|n[1])%31)&&Ei(6,"invalid zlib data"),(n[1]>>5&1)==+!e&&Ei(6,"invalid zlib data: "+(n[1]&32?"need":"unexpected")+" dictionary"),(n[1]>>3&4)+2};function of(n,e){return sf(n.subarray(af(n,e&&e.dictionary),-4),{i:2},e&&e.out,e&&e.dictionary)}var lf=typeof TextDecoder<"u"&&new TextDecoder,cf=0;try{lf.decode(rf,{stream:!0}),cf=1}catch{}function an(n){if(!(n instanceof Uint8Array))throw Error("Text file is missing");if(n[0]===255&&n[1]===254)return new TextDecoder("utf-16le").decode(n);if(n[0]===254&&n[1]===255)return new TextDecoder("utf-16be").decode(n);try{return new TextDecoder("utf-8",{fatal:!0}).decode(n)}catch{return new TextDecoder("windows-1252").decode(n)}}function wn(n,e="",t=!1){const i=String(n).normalize("NFC").replaceAll("\\","/");if(i.startsWith("/")||/^[a-z]:/i.test(i)||i.includes("\0"))throw Error("Unsafe archive path.");const s=e.split("/").filter(Boolean);for(const r of i.split("/"))if(!(!r||r==="."))if(r===".."){if(!t||!s.length)throw Error("Unsafe archive path.");s.pop()}else s.push(r);return s.join("/").toLowerCase()}function Pa(n){const e={};let t="";for(const i of n.replace(/^\uFEFF/,"").split(/\r?\n/)){const s=i.replace(/;(?=(?:[^"']*["'][^"']*["'])*[^"']*$).*$/,"").trim(),r=s.match(/^\[(.+)\]$/);if(r){t=r[1].toLowerCase(),e[t]??(e[t]={});continue}const a=s.indexOf("=");a>0&&t&&(e[t][s.slice(0,a).trim().toLowerCase()]=s.slice(a+1).trim().replace(/^"(.*)"$/,"$1"))}return e}function hf(n){const e=i=>an(n[i]);return Object.keys(n).filter(i=>i.endsWith(".def")).map(i=>({path:i,def:Pa(e(i))})).filter(i=>{var s;return i.def.info&&((s=i.def.files)==null?void 0:s.sprite)}).map(i=>{const s=i.path.slice(0,i.path.lastIndexOf("/")+1),r=c=>wn(c,s,!0),a=(c,h)=>{let f;try{f=r(h)}catch{f=null}const u=String(h).replaceAll("\\","/").split("/").at(-1);if(!f&&u&&u!=="."&&u!=="..")try{const m=r(u);n[m]&&(f=m)}catch{}if(/^(cns|cmd|st\d*|stcommon)$/.test(c)&&f&&!n[f]&&n[f+".zss"])return f+".zss";if(c!=="stcommon"||n[f])return f;const d=i.path.indexOf("/chars/"),p=d>=0?i.path.slice(0,d+1):"",_=[p+"data/",p].flatMap(m=>{try{return[wn(h,m,!0)]}catch{return[]}});return(u==null?void 0:u.toLowerCase())==="common1.cns"&&_.push(p+"data/common1.cns","data/common1.cns"),_.find(m=>n[m])||_.map(m=>m+".zss").find(m=>n[m])||f},o=Object.entries(i.def.files).filter(([c,h])=>h&&/^(sprite|anim|cmd|cns|sound|stcommon|st\d*|pal\d+)$/.test(c)).map(([c,h])=>{const f=a(c,h);return{key:c,value:h,path:f,ok:!!f&&!!n[f],...f?{}:{message:"This resource is outside the ZIP. Include it in the package or use an in-package relative path."}}}),l=o.find(c=>c.key==="anim"&&c.ok);return{...i,checks:o,files:n,animations:l?Su(e(l.path)):[],sprite:o.find(c=>c.key==="sprite"&&c.ok),palettes:o.filter(c=>/^pal\d+$/.test(c.key)).map(c=>({...c,number:Number(c.key.slice(3))}))}})}function Su(n){var a;const e=[];let t,i,s,r;for(const[o,l]of n.replace(/^\uFEFF/,"").split(/\r?\n/).entries()){const c=l.split(";")[0].trim(),h=c.match(/^\[begin action\s+(-?\d+)\]\s*$/i);if(h){t={id:+h[1],frames:[],loopStart:0},e.push(t),i={1:[],2:[]},s={},r={};continue}if(!t||!c)continue;if(/^loopstart\s*$/i.test(c)){t.loopStart=t.frames.length;continue}const f=c.match(/^clsn([12])(default)?\s*:\s*(\d+)\s*$/i);if(f){const S=+f[1],M=+f[3];if(M>1024)throw Error(`AIR collision box limit exceeded on line ${o+1}`);const g=new Array(M);r[S]=g,f[2]?(i[S]=g,delete s[S]):s[S]=g;continue}const u=c.match(/^clsn([12])\s*\[\s*(\d+)\s*\]\s*=\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*$/i);if(u){const S=r[+u[1]],M=+u[2];if(!S||M>=S.length){(t.diagnostics??(t.diagnostics=[])).push({line:o+1,message:"AIR collision box index out of range; box ignored"});continue}S[M]=u.slice(3).map(Number);continue}const d=c.match(/^interpolate\s+(offset|blend|scale|angle)\s*$/i);if(d){const S=d[1].toLowerCase();t.frames.length?((a=t.frames.at(-1)).interpolate??(a.interpolate=[])).push(S):(t.loopInterpolate??(t.loopInterpolate=[])).push(S);continue}if(!/^-?\d+\s*,/.test(c))continue;const p=c.split(",").map(S=>S.trim()),_=p.slice(0,5).map(Number);if(p.length<5||_.some(S=>!Number.isFinite(S))||_[4]<-1)throw Error(`Invalid AIR frame on line ${o+1}`);const m=S=>{const M=s[S]??i[S];return Object.keys(M).length!==M.length&&(t.diagnostics??(t.diagnostics=[])).push({line:o+1,message:`Incomplete Clsn${S} definition; missing boxes ignored`}),M.filter(Boolean).map(g=>g.slice())},v=(S,M,g)=>{if(!p[S])return M;const x=Number(p[S]);return Number.isFinite(x)?x:((t.diagnostics??(t.diagnostics=[])).push({line:o+1,message:`Invalid AIR ${g} ignored; using ${M}`}),M)},y=v(7,1,"x-scale"),A=v(8,1,"y-scale"),R=v(9,0,"angle");t.frames.push({group:_[0],number:_[1],x:_[2],y:_[3],ticks:_[4],flip:(p[5]||"").toUpperCase(),blend:(p[6]||"").toUpperCase(),scaleX:y,scaleY:A,angle:R,clsn1:m(1),clsn2:m(2)}),s={}}return e.filter(o=>o.frames.length).map(o=>(o.loopStart>=o.frames.length&&(o.loopStart=0),o.loopInterpolate&&(o.frames.at(-1).interpolate=[...new Set([...o.frames.at(-1).interpolate||[],...o.loopInterpolate])]),delete o.loopInterpolate,o))}function uf(n){if(!(n instanceof Uint8Array)||n.length<24||new TextDecoder().decode(n.subarray(0,12))!=="ElecbyteSnd\0")throw Error("Invalid SND signature");const e=new DataView(n.buffer,n.byteOffset,n.byteLength),t=e.getUint32(16,!0),i=[],s=new Map,r=new Set;if(t>1e4)throw Error("SND sample table too large");let a=e.getUint32(20,!0);for(let o=0;o<t;o++){if(a<24||a+16>n.length||r.has(a))throw Error("Invalid SND sample link");r.add(a);const l=e.getUint32(a,!0),c=e.getUint32(a+4,!0),h=e.getUint32(a+8,!0),f=e.getUint32(a+12,!0),u=a+16;if(c<12||c>32*1024*1024||u+c>n.length)throw Error("Invalid SND sample length");const d=n.subarray(u,u+c);if(new TextDecoder().decode(d.subarray(0,4))!=="RIFF"||new TextDecoder().decode(d.subarray(8,12))!=="WAVE")throw Error("Unsupported SND sample: expected WAV");if(new DataView(d.buffer,d.byteOffset,d.byteLength).getUint32(4,!0)+8>c)throw Error("Truncated SND WAV");const p={group:h,number:f,data:d};i.push(p),s.has(`${h},${f}`)||s.set(`${h},${f}`,d),a=l}return{samples:i,get:(o,l)=>s.get(`${o},${l}`)}}function df(n,e,t,i){const s=[137,80,78,71,13,10,26,10];if(n.length<33||!s.every((x,P)=>n[P]===x))throw Error("Invalid PNG signature");const r=new DataView(n.buffer,n.byteOffset,n.byteLength);let a,o,l,c,h,f,u=8,d=!1,p=0;const _=[];for(;u+12<=n.length;){const x=r.getUint32(u),P=u+8,T=P+x;if(x>64*1024*1024||T+4>n.length)throw Error("Invalid PNG chunk length");const I=String.fromCharCode(...n.subarray(u+4,u+8));if(I==="IHDR"){if(u!==8||x!==13||a!==void 0)throw Error("Invalid PNG header");if(a=r.getUint32(P),o=r.getUint32(P+4),c=n[P+9],l={0:1,2:3,3:1,4:2,6:4}[c],!a||!o||a*o>4e6||e!==void 0&&a!==e||t!==void 0&&o!==t)throw Error("Invalid PNG dimensions");if(n[P+8]!==8||!l||n[P+10]||n[P+11]||n[P+12])throw Error("Unsupported PNG encoding: requires non-interlaced 8-bit channels")}else{if(a===void 0)throw Error("PNG header must be first");if(I==="PLTE"){if(!x||x>768||x%3)throw Error("Invalid PNG palette");h=n.subarray(P,T)}else if(I==="tRNS")f=n.subarray(P,T);else if(I==="IDAT"){if(p+=x,p>64*1024*1024)throw Error("PNG compressed data too large");_.push(n.subarray(P,T))}else if(I==="IEND"){if(x)throw Error("Invalid PNG end chunk");d=!0;break}else if(I[0]===I[0].toUpperCase())throw Error("Unsupported PNG critical chunk: "+I)}u=T+4}if(!d||!_.length)throw Error("Truncated PNG");if(c===3&&!i&&!h)throw Error("PNG palette missing");const m=new Uint8Array(p);let v=0;for(const x of _)m.set(x,v),v+=x.length;const y=a*l,A=(y+1)*o,R=of(m,{out:new Uint8Array(A+1)});if(R.length!==A)throw Error("Invalid PNG pixel data length");const S=new Uint8Array(y*o),M=(x,P,T)=>{const I=x+P-T,U=Math.abs(I-x),D=Math.abs(I-P),w=Math.abs(I-T);return U<=D&&U<=w?x:D<=w?P:T};for(let x=0;x<o;x++){const P=R[x*(y+1)];if(P>4)throw Error("Invalid PNG scanline filter");for(let T=0;T<y;T++){const I=x*y+T,U=T>=l?S[I-l]:0,D=x?S[I-y]:0,w=x&&T>=l?S[I-y-l]:0,O=P===0?0:P===1?U:P===2?D:P===3?Math.floor((U+D)/2):M(U,D,w);S[I]=R[x*(y+1)+1+T]+O&255}}const g=new Uint8ClampedArray(a*o*4);for(let x=0;x<a*o;x++){const P=x*l,T=x*4;if(c===3){const I=S[P],U=I*(i?4:3),D=i||h;if(U+2>=D.length)throw Error("PNG palette index out of range");g[T]=D[U],g[T+1]=D[U+1],g[T+2]=D[U+2],g[T+3]=i?D[U+3]:(f==null?void 0:f[I])??255}else if(c===0||c===4){const I=S[P];let U=c===4?S[P+1]:255;c===0&&(f==null?void 0:f.length)===2&&I===(f[0]<<8|f[1])&&(U=0),g[T]=I,g[T+1]=I,g[T+2]=I,g[T+3]=U}else{const I=S[P],U=S[P+1],D=S[P+2];let w=c===6?S[P+3]:255;c===2&&(f==null?void 0:f.length)===6&&I===(f[0]<<8|f[1])&&U===(f[2]<<8|f[3])&&D===(f[4]<<8|f[5])&&(w=0),g[T]=I,g[T+1]=U,g[T+2]=D,g[T+3]=w}}return{w:a,h:o,rgba:g,...c===3?{indices:S}:{}}}function wc(n,e,t){const i=new Uint8Array(e);let s=0,r=0,a=0,o=0;const l=()=>{if(s>=n.length)throw Error("Truncated sprite data");return n[s++]},c=(h,f)=>{if(h<1||r+h>e)throw Error("Invalid sprite run");i.fill(f,r,r+h),r+=h};if(t===0){if(n.length<e)throw Error("Truncated raw sprite");return n.slice(0,e)}if(t===2){for(;r<e;){let h=l();if((h&192)===64){let f=h&63;c(f,l())}else c(1,h)}return i}if(t===3){for(;r<e;){let h=l()+1,f=l(),u=f&127,d=f&128?l():0;for(c(h,d);u--;){let p=l();c((p>>5)+1,p&31)}}return i}if(t!==4)throw Error("Unsupported sprite compression "+t);for(;r<e;){let h=l();for(let f=0;f<8&&r<e;f++){let u=l();if(h&1<<f){let d,p;if((u&63)===0?(p=(u<<2|l())+1,d=l()+3):(a|=(u&192)>>o,o+=2,d=(u&63)+1,o<8?p=l()+1:(p=a+1,a=0,o=0)),p>r||r+d>e)throw Error("Invalid sprite backreference");for(;d--;)i[r]=i[r-p],r++}else{let d;u&224?(d=u>>5,u&=31):d=l()+8,c(d,u)}}}return i}function ea(n,e,t="SFF palette index out of range"){const i=new Uint32Array(Math.ceil(e.length/4));new Uint8Array(i.buffer).set(e);const s=new Uint8ClampedArray(n.length*4),r=new Uint32Array(s.buffer);for(let a=0;a<n.length;a++){const o=n[a];if(o*4+2>=e.length)throw Error(t);r[a]=i[o]}return s}function Mu(n,e={}){if(!(n instanceof Uint8Array)||n.length<32||new TextDecoder().decode(n.subarray(0,12))!=="ElecbyteSpr\0")throw Error("Invalid SFF signature");if(n[15]===1)return ff(n,e);if(n[15]!==2)throw Error("Unsupported SFF version");if(n.length<68)throw Error("Truncated SFF header");const t=new DataView(n.buffer,n.byteOffset,n.byteLength),i=S=>t.getUint32(S,!0),s=S=>t.getInt16(S,!0),r=S=>t.getUint16(S,!0),a=i(36),o=i(40),l=i(44),c=i(48),h=i(52),f=i(60);if(o>2e4||c>4096)throw Error("SFF table too large");if(a+o*28>n.length||l+c*16>n.length)throw Error("Truncated SFF table");const u=[],d=new pu({maxBytes:e.cacheBytes??16*1024*1024,sizeOf:S=>{var M;return S.rgba.byteLength+(((M=S.indices)==null?void 0:M.byteLength)||0)}}),p=new Map,_=Array.from({length:c},(S,M)=>({index:M,group:r(l+M*16),number:r(l+M*16+2),colors:r(l+M*16+4)}));for(let S=0;S<o;S++){const M=a+S*28;u.push({group:r(M),number:r(M+2),w:r(M+4),h:r(M+6),x:s(M+8),y:s(M+10),link:r(M+12),format:n[M+14],depth:n[M+15],offset:i(M+16),length:i(M+20),palette:r(M+24),flags:r(M+26)})}function m(S,M=new Set){if(p.has(S))return p.get(S);if(S>=c||M.has(S))throw Error("Invalid palette link");M.add(S);const g=l+S*16,x=i(g+12);if(!x)return m(r(g+6),M);const P=h+i(g+8);if(x%4||P+x>n.length)throw Error("Invalid SFF palette length");const T=n.slice(P,P+x);if(!n[13]&&!n[14])for(let I=0;I<T.length/4;I++)T[I*4+3]=I?255:0;return p.set(S,T),T}function v(S,M=new Set){if(d.has(S))return d.get(S);if(!Number.isInteger(S)||S<0||S>=u.length||M.has(S))throw Error("Invalid sprite link");M.add(S);const g=u[S];if(!g.length){const I=v(g.link,M),U={...I,...g,w:I.w,h:I.h,rgba:I.rgba};return I.indices&&g.palette!==I.palette&&(U.rgba=ea(I.indices,m(g.palette),"Linked sprite palette index out of range")),d.set(S,U),U}if(!g.w||!g.h||g.w*g.h>4e6)throw Error("Invalid SFF sprite dimensions");const x=(g.flags&1?f:h)+g.offset;if(x+g.length>n.length||g.length<(g.format?4:0))throw Error("Truncated SFF sprite data");const P=n.subarray(x+(g.format?4:0),x+g.length);let T;if(g.format>=10&&g.format<=12)T={...g,...df(P,g.w,g.h,g.format===10&&c?m(g.palette):void 0)};else{if(g.depth!==8&&g.depth!==5)throw Error("Unsupported non-indexed SFF compression: "+g.format);const I=wc(P,g.w*g.h,g.format),U=ea(I,m(g.palette));T={...g,rgba:U,indices:I}}return d.set(S,T),T}function y(S,M,g){const x=v(S);if(!x.indices)return x;const P=_.find(U=>U.group===M&&U.number===g);if(!P)throw Error(`Palette ${M},${g} does not exist`);const T=_[x.palette];if(T&&Math.ceil(Math.log2(T.colors))!==Math.ceil(Math.log2(P.colors)))return x;const I=ea(x.indices,m(P.index),"Palette depth does not match indexed sprite");return{...x,rgba:I}}function A(S,M=new Set){if(!Number.isInteger(S)||S<0||S>=u.length||M.has(S))throw Error("Invalid sprite link");M.add(S);const g=u[S];if(!g.length){const P=A(g.link,M);return P?{...P,...g,w:P.w,h:P.h,colors:m(g.palette)}:null}if(!g.w||!g.h||g.w*g.h>4e6)throw Error("Invalid SFF sprite dimensions");if(g.format>=10||![5,8].includes(g.depth))return null;const x=(g.flags&1?f:h)+g.offset;if(x+g.length>n.length||g.length<(g.format?4:0))throw Error("Truncated SFF sprite data");return{...g,indices:wc(n.subarray(x+(g.format?4:0),x+g.length),g.w*g.h,g.format),colors:m(g.palette)}}return{sprites:u,decode:v,decodeIndexed:A,decodeWithPalette:y,paletteColors:(S,M)=>{const g=_.find(x=>x.group===S&&x.number===M);if(!g)throw Error(`Palette ${S},${M} does not exist`);return m(g.index).slice()},palettes:_,version:2,clearDecodedCache:()=>d.clear(),cacheStats:()=>({bytes:d.bytes,entries:d.size,evictions:d.evictions})}}function ff(n,{externalPalettes:e=new Map,cacheBytes:t=16*1024*1024}={}){var g;const i=new DataView(n.buffer,n.byteOffset,n.byteLength),s=x=>i.getUint32(x,!0),r=x=>i.getUint16(x,!0),a=x=>i.getInt16(x,!0),o=[],l=[],c=[],h=new Set,f=s(20);let u=s(24),d=-1,p=-1;if(f>2e4)throw Error("SFF table too large");const _=x=>{const P=new Uint8Array(1024);for(let T=0;T<256;T++)P.set([x[T*3],x[T*3+1],x[T*3+2],T?255:0],T*4);return c.push(P),c.length-1};for(let x=0;x<f;x++){if(u<32||u+32>n.length||h.has(u))throw Error("Invalid SFF v1 sprite table link");h.add(u);const P=s(u+4),T={group:r(u+12),number:r(u+14),x:a(u+8),y:a(u+10),link:r(u+16),offset:u+32,length:P,shared:n[u+18],palette:d};if(T.offset+P>n.length)throw Error("Truncated SFF v1 sprite");if(P){const I=P>=897&&n[T.offset+P-769]===12;(!T.shared||d<0)&&I&&(T.palette=_(n.subarray(T.offset+P-768,T.offset+P))),T.palette<0&&e.has(1)&&(c.push(e.get(1)),T.palette=c.length-1),T.palette>=0&&p<0&&(p=T.palette),T.group===0&&T.number===0&&T.palette>=0&&(p=T.palette),d=T.palette}else T.palette=void 0;if(o.push(T),u=s(u),!u&&x+1<f)throw Error("Truncated SFF v1 sprite table")}const m=c[p];if(m)for(const x of o)x.palette>=0&&((g=c[x.palette])!=null&&g.every((P,T)=>P===m[T]))&&(x.palette=p);for(let x=0;x<c.length;x++)l.push({index:x,group:x===p?1:0,number:x===p?1:x+1,colors:256});for(const[x,P]of e){if(!(P instanceof Uint8Array)||P.length!==1024||!Number.isInteger(x)||x<1||x>256)throw Error("Invalid external SFF palette");if(x===1&&p>=0)c[p]=P;else{const T=c.length;c.push(P),l.push({index:T,group:1,number:x,colors:256})}}const v=new pu({maxBytes:t,sizeOf:x=>{var P;return x.rgba.byteLength+(((P=x.indices)==null?void 0:P.byteLength)||0)}});function y(x,P){return{...x,rgba:ea(x.indices,P)}}function A(x,P=new Set){if(v.has(x))return v.get(x);if(!Number.isInteger(x)||x<0||x>=o.length||P.has(x))throw Error("Invalid SFF v1 sprite link");P.add(x);const T=o[x];if(!T.length){const Q=A(T.link,P);T.palette=Q.palette;const G={...Q,...T,w:Q.w,h:Q.h};return v.set(x,G),G}const I=n.subarray(T.offset,T.offset+T.length);if(I.length<128||I[0]!==10||I[2]!==1||I[3]!==8||I[65]!==1)throw Error("Only indexed 8-bit PCX sprites are supported");const U=new DataView(I.buffer,I.byteOffset,I.byteLength),D=U.getUint16(8,!0)-U.getUint16(4,!0)+1,w=U.getUint16(10,!0)-U.getUint16(6,!0)+1,O=U.getUint16(66,!0);if(D<=0||w<=0||D*w>4e6||O*w>8e6||O<D)throw Error("Invalid PCX dimensions");const B=c[T.palette];if(!B)throw Error("PCX palette missing");const z=I.length>=897&&I[I.length-769]===12?I.length-769:I.length,L=new Uint8Array(O*w);let C=128,H=0;for(;H<L.length;){if(C>=z)throw Error("Truncated PCX");let Q=I[C++],G=1;if((Q&192)===192){if(G=Q&63,C>=z)throw Error("Truncated PCX run");Q=I[C++]}if(!G||H+G>L.length)throw Error("Invalid PCX run");L.fill(Q,H,H+G),H+=G}const W=new Uint8Array(D*w);for(let Q=0;Q<w;Q++)W.set(L.subarray(Q*O,Q*O+D),Q*D);const K=y({...T,w:D,h:w,indices:W},B);return v.set(x,K),K}function R(x,P,T){const I=A(x),U=l.find(D=>D.group===P&&D.number===T);if(!U)throw Error(`Palette ${P},${T} does not exist`);return y(I,c[U.index])}return{sprites:o,palettes:l,decode:A,decodeIndexed:x=>{const P=A(x);return{...P,colors:c[P.palette]}},decodeWithPalette:R,paletteColors:(x,P)=>{const T=l.find(I=>I.group===x&&I.number===P);if(!T)throw Error(`Palette ${x},${P} does not exist`);return c[T.index].slice()},version:1,clearDecodedCache:()=>v.clear(),cacheStats:()=>({bytes:v.bytes,entries:v.size,evictions:v.evictions})}}function pf(n){if(!(n instanceof Uint8Array)||![768,772].includes(n.length))throw Error("ACT palette must contain 768 RGB bytes, with an optional 4-byte footer.");const e=new Uint8Array(1024);for(let t=0;t<256;t++){const i=(255-t)*3;e.set([n[i],n[i+1],n[i+2],t?255:0],t*4)}return e}const Wa=new WeakMap;function ta(n){let e=n,t=0;for(;e&&t++<256;){if(e.ownPal||e.ownpal)return e;const i=e.paletteParent||e.parent||e.owner;if(!i||i===e)return e;e=i}return e}const kl=n=>new Map([...n||[]].map(([e,t])=>[e,[...t]]));function ia(n){const e={...n};for(const[t,i]of[["add",[0,0,0]],["mul",[256,256,256]],["sinadd",[0,0,0,0]]])if(e[t]!==void 0){const s=Array.isArray(e[t])?e[t]:[e[t]];e[t]=i.map((r,a)=>{const o=Math.trunc(Number(s[a]??r));return t==="mul"?Math.max(0,o):o})}return e.time!==void 0&&(e.time=Math.trunc(Number(e.time))),e.color!==void 0&&(e.color=Math.max(0,Math.min(256,Math.trunc(Number(e.color))))),e.invertall!==void 0&&(e.invertall=+!!e.invertall),e}function Bl(n,e,t){const i=Array.isArray(t)?t:[t],s=[Math.trunc(Number(i[0]??-1)),Math.trunc(Number(i[1]??0))];if(s[0]!==-1){if(s[0]<0||s[1]<0)throw Error("Invalid RemapPal palette pair.");bu(e,[-1,0],s),n.clear(),n.set("*",s)}}function bu(n,e,t){var a,o;if(!((a=n.sprite)!=null&&a.path)||!((o=n.files)!=null&&o[n.sprite.path]))return;const i=wu(n),s=l=>i.palettes.find(c=>c.group===l[0]&&c.number===l[1]),r=s(t);if(!r)throw Error(`RemapPal destination palette ${t.join(",")} does not exist.`);if(e[0]!==-1){const l=s(e);if(!l)throw Error(`RemapPal source palette ${e.join(",")} does not exist.`);if(l.colors&&r.colors&&Math.ceil(Math.log2(l.colors))!==Math.ceil(Math.log2(r.colors)))throw Error("RemapPal source and destination color depths differ.")}}function wu(n){var o,l;if(Wa.has(n))return Wa.get(n);const e=[],t=new Map,i=n.files,s=n.path.slice(0,n.path.lastIndexOf("/")+1);for(const[c,h]of Object.entries(n.def.files||{}))if(/^pal\d+$/.test(c)&&h)try{const f=Number(c.slice(3));if(f<1||f>256)throw Error(`Invalid palette number ${f}.`);const u=(o=n.checks)==null?void 0:o.find(p=>p.key===c);let d;if(u)d=u.ok?u.path:null;else try{d=wn(h,s,!0)}catch{d=null}if(!d||!i[d])throw Error(`Palette file is missing from the ZIP: ${h}`);t.set(f,pf(i[d]))}catch(f){e.push({type:"palette",source:n.path,line:0,message:f.message})}const r=Mu(i[n.sprite.path],{externalPalettes:t});r.diagnostics=e,r.selectablePalettes=[...new Set((r.palettes||[]).filter(c=>c.group===1&&c.number>=1&&c.number<=12).map(c=>c.number))].sort((c,h)=>c-h),r.selectablePalettes.length||(r.selectablePalettes=[1]);const a=String(((l=n.def.info)==null?void 0:l["pal.defaults"])||"1").split(",").map(Number);return r.defaultPalette=a.find(c=>r.selectablePalettes.includes(c))??r.selectablePalettes[0],Wa.set(n,r),r}function mf(n,e){var c,h;const t=((c=n.world)==null?void 0:c.orderedPhases)&&n.isProjectile&&n.removalReason==="expire",i=n.hitDef||(t?n.proximityHitDef:null);if(n===e||n.destroyed||!i&&(!((h=n.world)!=null&&h.orderedPhases)||n.isProjectile)||n.moveType!=="A"||n.isProjectile&&((n.removed||n.removing)&&!(t&&n.drawVisible)||n.remainingHits<=0||n.owner===e||!/^[SCA]\s*,\s*[NSH][ATP]$/i.test(String(i.attr??"").trim())))return!1;const s=String((i==null?void 0:i.affectteam)??"E").trim().toUpperCase(),r=!!(n.world&&e.world&&n.teamSide===e.teamSide);if(s==="E"&&r||s==="F"&&!r)return!1;const a=(i==null?void 0:i.coordinateScale)??n.coordinateScale??1;let o;(i==null?void 0:i["guard.dist"])!==void 0?o=i["guard.dist"]*a:n.isProjectile?o=n.guardDistance:n.attackDist!==void 0?o=n.attackDist*n.coordinateScale:o=n.constant("size.attack.dist")*n.coordinateScale;const l=(e.pos.x-n.pos.x)*n.facing;return l>0&&l<o}function Eu(n,e){for(const t of e)if(mf(t,n))return!0;return!1}class pt extends Error{constructor(e,t=""){super(e),this.name="ExpressionError",this.source=t}}class ji extends pt{constructor(e,t=""){super(e,t),this.name="UnsupportedExpressionError"}}class Lt extends pt{constructor(e,t=""){super(e,t),this.name="BottomError",this.bottom=!0}}const Fo=8192,Ec=2048,Tc=96,gf=8192,Wn=new Map,vf={"||":1,"^^":2,"&&":3,"|":4,"^":5,"&":6,":=":7,"=":8,"!=":8,"<":9,">":9,"<=":9,">=":9,"+":10,"-":10,"*":11,"/":11,"%":11,"**":12},na=new Set(["=","!=","<","<=",">",">="]),_f=new Set(["parent","root","helper","target","partner","enemy","enemynear","playerid","p2"]),xf=new Set(["pos","vel","p2dist","p2bodydist","parentdist","rootdist","screenpos","hitvel","camerapos"]),Tu=new Set(["s","c","a","h","l","i","n","v","u"]),yf=new Set(["const","gethitvar","stagevar","map"]),Sf=new Set(["xveladd","yveladd","xoff","yoff","zoff","xvel","yvel","yaccel","fall.xvel","fall.yvel","fall.envshake.freq","fall.envshake.phase"]),Mf=/^(?:fvar|sysfvar|const240p|const480p|const720p|pos [xy]|vel [xy]|p2dist [xy]|p2bodydist [xy]|parentdist [xy]|rootdist [xy]|screenpos [xy]|hitvel [xy]|camerapos [xy]|camerazoom|gamewidth|gameheight|screenwidth|screenheight|leftedge|rightedge|topedge|bottomedge|(?:front|back)edge(?:body)?dist|frontedge|backedge)$/,bf=n=>/^(?:velocity\.|movement\.(?!airjump\.)|size\.[xy]scale$|data\.fall\.defence_mul$)/.test(n),ua={abs:[1,Math.abs],ceil:[1,Math.ceil],floor:[1,Math.floor],exp:[1,Math.exp],ln:[1,Math.log],log:[2,(n,e)=>Math.log(e)/Math.log(n)],sin:[1,Math.sin],cos:[1,Math.cos],tan:[1,Math.tan],asin:[1,Math.asin],acos:[1,Math.acos],atan:[1,Math.atan],sqrt:[1,Math.sqrt],min:[2,Math.min],max:[2,Math.max]},Ac=new Set(["var","fvar","sysvar","sysfvar","animelemtime","animelemno","animexist","selfanimexist","const","const240p","const480p","const720p","gethitvar","stagevar","numprojid","playeridexist","projcanceltime","projcontacttime","projguardedtime","projhittime"]),wf=new Set(["numhelper","numexplod","numtarget","ishelper"]),Ef=new Set(["name","authorname","p1name","p2name","p3name","p4name"]),Tf=new Set("time stateno prevstateno anim animtime ctrl statetype movetype physics life lifemax power powermax facing alive gametime hitpausetime hitshakeover hitover movecontact movehit moveguarded movereversed hitcount uniqhitcount numenemy numpartner numproj roundstate roundno matchno teamside teampower tickspersecond ailevel palno id name authorname p1name p2name p3name p4name win lose drawgame inguarddist canrecover roundsexisted hitfall ishometeam teammode leftedge rightedge topedge bottomedge frontedge backedge frontedgedist backedgedist frontedgebodydist backedgebodydist gamewidth gameheight screenwidth screenheight camerazoom winko wintime winperfect loseko losetime loseperfect random pi e".split(" "));function Af(n){if(typeof n!="string")throw new pt("Expression must be text.");if(n.length>Fo)throw new pt(`Expression exceeds ${Fo} characters.`);const e=[];let t=0;for(;t<n.length;){if(/\s/.test(n[t])){t++;continue}const i=t,s=n.slice(t);let r;if(n[t]==='"'){t++;let a="",o=!1;for(;t<n.length;){const l=n[t++];if(l==='"'){o=!0;break}l==="\\"&&n[t]==='"'?(a+='"',t++):a+=l}if(!o)throw new pt(`Unterminated string at ${i}.`,n);e.push({type:"string",value:a,position:i})}else if(r=s.match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/)){const a=Number(r[0]);if(!Number.isFinite(a))throw new pt(`Invalid number at ${i}.`,n);e.push({type:"number",value:a,float:/[.eE]/.test(r[0]),position:i}),t+=r[0].length}else if(r=s.match(/^[a-z_][a-z0-9_.]*/i))e.push({type:"name",value:r[0].toLowerCase(),position:i}),t+=r[0].length;else if(r=s.match(/^(?:\*\*|:=|<=|>=|!=|&&|\|\||\^\^|[+\-*/%!~&|^=<>()[\],])/))e.push({type:"operator",value:r[0],position:i}),t+=r[0].length;else throw new ji(`Unsupported token at ${i}: ${n[t]}`,n);if(e.length>Ec)throw new pt(`Expression exceeds ${Ec} tokens.`,n)}return e.push({type:"end",value:"",position:t}),e}let Cf=class{constructor(e){this.source=e,this.tokens=Af(e),this.index=0,this.depth=0}peek(e=0){return this.tokens[this.index+e]||this.tokens.at(-1)}take(){return this.tokens[this.index++]}accept(e){return this.peek().value!==e?!1:(this.index++,!0)}expect(e){this.accept(e)||this.fail(`Expected "${e}"`)}fail(e){throw new pt(`${e} at ${this.peek().position}.`,this.source)}signedInteger(){const e=this.accept("-")?-1:(this.accept("+"),1),t=this.take();return(t.type!=="number"||t.float)&&this.fail("Expected an integer literal"),{kind:"number",value:e*t.value,float:!1}}parse(e=0){++this.depth>Tc&&this.fail(`Expression nesting exceeds ${Tc}`);let t=this.prefix();for(;;){const i=this.peek().value,s=vf[i];if(s===void 0||s<e)break;if(this.take(),(i==="="||i==="!=")&&(this.peek().value==="["||this.isOpenInterval())){const r=this.take().value,a=this.parse();this.expect(",");const o=this.parse(),l=this.take().value;l!=="]"&&l!==")"&&this.fail("Expected an interval endpoint"),t={kind:"range",op:i,left:t,low:a,high:o,includeLow:r==="[",includeHigh:l==="]"}}else{const r=this.parse(s+(i===":="?0:1));i===":="?((t.kind!=="call"||!["var","fvar"].includes(t.name)||t.args.length!==1)&&this.fail("Assignment requires var(index) or fvar(index)"),t={kind:"assign",left:t,right:r}):t={kind:"binary",op:i,left:t,right:r}}}return this.depth--,t}isOpenInterval(){if(this.peek().value!=="(")return!1;const e=this.index,t=this.depth;try{return this.prefix(),!1}catch{}finally{this.index=e,this.depth=t}let i=0;for(let s=this.index;s<this.tokens.length;s++){const r=this.tokens[s].value;if(r==="("||r==="[")i++;else if(r===")"||r==="]"){if(--i===0)return!1}else if(r===","&&i===1)return!0}return!1}prefix(){const e=this.take();if(e.type==="number")return{kind:"number",value:e.value,float:e.float};if(e.type==="string")return{kind:"string",value:e.value};if(["+","-","!","~"].includes(e.value))return{kind:"unary",op:e.value,value:this.parse(13)};if(e.value==="("){const r=this.parse();return this.expect(")"),r}e.type!=="name"&&this.fail("Expected a value");const t=e.value;if(Ef.has(t)&&["=","!="].includes(this.peek().value)){const r=this.take().value,a=this.take();return a.type!=="string"&&this.fail(`${t} comparison requires a quoted name`),{kind:"binary",op:r,left:{kind:"name",name:t},right:{kind:"string",value:a.value}}}if(["statetype","movetype","p2statetype","p2movetype"].includes(t)&&["=","!="].includes(this.peek().value)&&this.peek(1).type==="name"&&Tu.has(this.peek(1).value)){const r=this.take().value,a=this.take().value;return{kind:"binary",op:r,left:{kind:"name",name:t},right:{kind:"string",value:a.toUpperCase()}}}if(t==="teammode"&&["=","!="].includes(this.peek().value)){const r=this.take().value,a=this.take();return(a.type!=="name"||!["single","simul","turns"].includes(a.value))&&this.fail("TeamMode requires Single, Simul or Turns"),{kind:"binary",op:r,left:{kind:"name",name:t},right:{kind:"string",value:a.value}}}const i=t.match(/^proj(hit|contact|guarded)(\d*)$/);if(i&&this.accept("=")){const r=this.signedInteger();[0,1].includes(r.value)||this.fail("Projectile condition requires 0 or 1");let a="=",o={kind:"number",value:1,float:!1};return this.accept(",")&&(na.has(this.peek().value)&&(a=this.take().value),o=this.signedInteger()),{kind:"legacyprojectile",name:`proj${i[1]}time`,id:Number(i[2]||0),expected:r.value,op:a,time:o}}if(t==="command"&&["=","!="].includes(this.peek().value)){const r=this.take().value,a=this.take();return a.type!=="string"&&this.fail("Command comparison requires a quoted name"),{kind:"command",op:r,command:a.value}}if(t==="animelem"&&this.accept("=")){const r=this.signedInteger();let a="=",o={kind:"number",value:0,float:!1};return this.accept(",")&&(na.has(this.peek().value)&&(a=this.take().value),o=this.signedInteger()),{kind:"legacyanim",element:r,op:a,time:o}}if(t==="timemod"&&na.has(this.peek().value)){const r=this.take().value,a=this.signedInteger();return this.expect(","),{kind:"legacytime",op:r,divisor:a,remainder:this.signedInteger()}}if(t==="hitdefattr"&&["=","!="].includes(this.peek().value)){const r=this.take().value,a=this.take();(a.type!=="name"||!/^[sca]+$/.test(a.value))&&this.fail("HitDefAttr requires state letters S, C or A");const o=[a.value.toUpperCase()];this.expect(",");do{const l=this.take();(l.type!=="name"||!/^[nsha][atp]$/.test(l.value))&&this.fail("HitDefAttr requires attack attributes such as NA or ST"),o.push(l.value.toUpperCase())}while(this.peek().value===","&&this.peek(1).type==="name"&&/^[nsha][atp]$/.test(this.peek(1).value)&&this.accept(","));return{kind:"legacyattribute",op:r,attributes:o}}let s;if(this.accept("(")){const r=[];if(!this.accept(")")){do r.push(this.parse());while(this.accept(","));this.expect(")")}(Ac.has(t)||wf.has(t))&&r.length!==1&&this.fail(`${t} requires one argument`),Tf.has(t)&&r.length&&this.fail(`${t} requires no arguments`);const a=Object.hasOwn(ua,t)?ua[t][0]:["cond","ifelse"].includes(t)?3:null;a!==null&&r.length!==a&&this.fail(`${t} requires ${a} argument(s)`),s={kind:"call",name:t,args:r}}else{Ac.has(t)&&this.fail(`${t} requires a parameter list`);let r=t;xf.has(t)&&this.peek().type==="name"&&/^[xy]$/.test(this.peek().value)&&(r+=" "+this.take().value),s={kind:"name",name:r}}return _f.has(t)&&this.accept(",")?{kind:"redirect",target:s,value:this.prefix()}:s}};function Zi(n){if(typeof n!="string"||n.length>Fo)throw new pt("Invalid or oversized argument list.");const e=[];let t=0,i=!1,s=!1,r=0;for(let a=0;a<n.length;a++){const o=n[a];if(o==='"'&&!s&&(i=!i),s=o==="\\"&&!s,!i)if(o==="("||o==="[")t++;else if(o===")"||o==="]"){if(--t<0)throw new pt("Unbalanced argument list.")}else o===","&&t===0&&(e.push(n.slice(r,a).trim()),r=a+1)}if(i||t)throw new pt("Unbalanced argument list.");return e.push(n.slice(r).trim()),e}function zl(n){const e=new Cf(n),t=e.parse();e.peek().type!=="end"&&e.fail("Unexpected token");const i=s=>{for(const r of Object.values(s))Array.isArray(r)?(r.forEach(a=>a&&typeof a=="object"&&i(a)),Object.freeze(r)):r&&typeof r=="object"&&i(r);return Object.freeze(s)};return i(t)}function Au(n){if(Wn.has(n))return Wn.get(n);const e=zl(n),t=i=>Rf(e,i||{},n);return Wn.size>=512&&Wn.delete(Wn.keys().next().value),Wn.set(n,t),t}function da(n,e={}){return Au(n)(e)}function Oo(n,e={}){return Au(n)({...e,typedResult:!0})}const Kt=(n,e=!1)=>{if(typeof n!="number"||!Number.isFinite(n))throw new Lt("Expression produced a non-finite number.");const t=e?Math.fround(n):n|0;if(!Number.isFinite(t))throw new Lt("Expression produced a non-finite number.");return{value:t,float:e}},bt=n=>Kt(n,!1);function $t(n){if(n.bottom)throw n.error;if(typeof n.value!="number")throw new Lt("A numeric value is required.");return n.value}function Is(n){return $t(n)!==0}function vr(n,e,t){if(e.bottom||t.bottom)throw(e.bottom?e:t).error;if(e.absent||t.absent){if(!["=","!="].includes(n))throw new pt("Only equality comparisons are allowed for strings.");return bt(+(n==="!="))}if(typeof e.value!=typeof t.value)throw new Lt("Cannot compare a string with a number.");if(typeof e.value=="string"&&!["=","!="].includes(n))throw new pt("Only equality comparisons are allowed for strings.");switch(typeof e.value=="number"&&(e.float||t.float)&&(e={value:Math.fround(e.value)},t={value:Math.fround(t.value)}),n){case"=":return bt(+(e.value===t.value));case"!=":return bt(+(e.value!==t.value));case"<":return bt(+(e.value<t.value));case"<=":return bt(+(e.value<=t.value));case">":return bt(+(e.value>t.value));case">=":return bt(+(e.value>=t.value))}}function Rf(n,e,t){let i=0;const s=(a,o,l)=>{if(typeof e.resolve!="function")throw new ji(`Unsupported trigger: ${a}.`,t);const c=e.resolve(a,o,l);if(typeof c=="number")return Kt(c,Mf.test(a)||a==="gethitvar"&&Sf.has(String(o[0]).toLowerCase())||a==="const"&&bf(String(o[0]).toLowerCase())||!Number.isInteger(c));if(typeof c=="boolean")return bt(Number(c));if(typeof c=="string")return{value:c};if(c!=null&&c.absent)return{value:"",absent:!0};if(c&&typeof c.value=="number")return Kt(c.value,c.type==="float"||c.float);throw new ji(`Trigger ${a} returned no supported value.`,t)},r=(a,o=null)=>{var l,c,h;if(++i>gf)throw new pt("Expression evaluation budget exceeded.",t);try{switch(a.kind){case"number":return Kt(a.value,a.float);case"string":return{value:a.value};case"name":return a.name==="pi"?Kt(Math.PI,!0):a.name==="e"?Kt(Math.E,!0):Tu.has(a.name)?{value:a.name.toUpperCase()}:s(a.name,[],o);case"unary":{const f=r(a.value,o),u=$t(f);if(a.op==="+")return f;if(a.op==="-")return Kt(-u,f.float);if(a.op==="!")return bt(+(u===0));if(f.float)throw new Lt("Bitwise operators require integers.",t);return bt(~u)}case"redirect":{if(o)throw new ji("Recursive trigger redirection is unsupported by MUGEN 1.1.",t);const f=((l=a.target.args)==null?void 0:l.map(u=>$t(r(u))))||[];return r(a.value,{name:a.target.name,args:f})}case"assign":{if(o)throw new pt("Variable assignment cannot be redirected.",t);if(typeof e.assign!="function")throw new ji("Variable assignment is unavailable.",t);const f=a.left.args.map(m=>$t(r(m))),u=r(a.right),d=$t(u),p=a.left.name==="var"?Math.trunc(d)|0:Math.fround(d),_=e.assign(a.left.name,f,p);return Kt(typeof _=="number"?_:p,a.left.name==="fvar")}case"range":{const f=[r(a.left,o),r(a.low,o),r(a.high,o)],u=f.some(v=>v.float),[d,p,_]=f.map(v=>u?Math.fround($t(v)):$t(v)),m=(a.includeLow?d>=p:d>p)&&(a.includeHigh?d<=_:d<_);return bt(Number(a.op==="="?m:!m))}case"legacyanim":return vr(a.op,s("animelemtime",[a.element.value],o),r(a.time,o));case"legacytime":{const f=a.divisor.value;if(f<=0)throw new pt("TimeMod divisor must be positive.",t);return vr(a.op,bt($t(s("time",[],o))%f),r(a.remainder,o))}case"legacyprojectile":{const f=s(a.name,[a.id],o),u=$t(f)>=0&&Is(vr(a.op,f,r(a.time,o)));return bt(Number(a.expected?u:!u))}case"legacyattribute":{const f=Is(s("hitdefattr",a.attributes,o));return bt(Number(a.op==="="?f:!f))}case"command":{const f=Is(s("command",[a.command],o));return bt(Number(a.op==="="?f:!f))}case"call":{if(a.name==="cond"||a.name==="ifelse"){if(a.args.length!==3)throw new pt(`${a.name} requires three arguments.`,t);const p=r(a.args[0],o);if(a.name==="cond")return r(a.args[Is(p)?1:2],o);const _=[r(a.args[1],o),r(a.args[2],o)];for(const v of _)v.bottom&&((c=e.onWarning)==null||c.call(e,v.error));const m=Is(p)?0:1;return _[m]}if(Object.hasOwn(ua,a.name)){const[p,_]=ua[a.name];if(a.args.length!==p)throw new pt(`${a.name} requires ${p} argument(s).`,t);const m=a.args.map(A=>r(A,o)),v=_(...m.map(A=>["abs","min","max"].includes(a.name)?$t(A):Math.fround($t(A)))),y=!["ceil","floor"].includes(a.name)&&(a.name!=="abs"||m[0].float)&&(!["min","max"].includes(a.name)||m.some(A=>A.float));return Kt(v,y)}const f=a.args.map(p=>yf.has(a.name)&&p.kind==="name"?{value:p.name}:r(p,o)),u=f.find(p=>p.bottom);if(u)throw u.error;const d=f.map(p=>p.value);return s(a.name,d,o)}case"binary":{const f=r(a.left,o),u=r(a.right,o);if(na.has(a.op))return vr(a.op,f,u);const d=f.float||u.float,p=d?Math.fround($t(f)):$t(f),_=d?Math.fround($t(u)):$t(u);switch(a.op){case"+":return Kt(p+_,d);case"-":return Kt(p-_,d);case"*":return Kt(d?p*_:Math.imul(p,_),d);case"/":if(_===0)throw new Lt("Division by zero.",t);return Kt(d?p/_:Math.trunc(p/_),d);case"%":if(d||_===0)throw new Lt("Remainder requires integers and a nonzero divisor.",t);return bt(p%_);case"**":{const m=d||p<0||_<0;let v=p**_;return!m&&v>2147483647&&(v=2147483647,(h=e.onWarning)==null||h.call(e,new pt("Integer exponent overflow.",t))),Kt(v,m)}case"&&":return bt(+(p!==0&&_!==0));case"||":return bt(+(p!==0||_!==0));case"^^":return bt(+(p!==0!=(_!==0)));case"&":case"|":case"^":if(d)throw new Lt("Bitwise operators require integers.",t);return bt(a.op==="&"?p&_:a.op==="|"?p|_:p^_);default:throw new ji(`Unsupported operator ${a.op}.`,t)}}default:throw new pt("Invalid compiled expression.",t)}}catch(f){if(f!=null&&f.bottom)return{bottom:!0,error:f};throw f}};try{const a=r(n);if(a.bottom)throw a.error;return e.typedResult?a:a.value}catch(a){throw a instanceof pt?(a.source||(a.source=t),a):a!=null&&a.bottom?new Lt(a.message||"Expression evaluated to bottom.",t):new pt((a==null?void 0:a.message)||"Trigger evaluation failed.",t)}}function Cu(n,e={},t=!1){var d,p,_,m;const i=n.coordinateScale||1,[s=0,r=0]=e[t?"offset":"pos"]||[0,0],a=String(e.postype||"p1").toLowerCase(),o=((d=n.world)==null?void 0:d.view.left)??((p=n.world)==null?void 0:p.leftBound)??-160,l=((_=n.world)==null?void 0:_.view.right)??((m=n.world)==null?void 0:m.rightBound)??160,c=n.opponent||n;let h=n.pos.x,f=n.facing,u=n.facing;if(a==="p2")h=c.pos.x,t||(f=u=c.facing);else if(a==="front")h=n.facing>0?l:o;else if(a==="back")h=n.facing>0?o:l,t||(f=n.facing);else if(a==="left"||a==="right")h=a==="left"?o:l,t||(f=u=1);else if(a!=="p1")throw Error(`Unsupported spawn postype: ${a}`);return{pos:{x:h+Number(s)*i*f,y:n.pos.y+Number(r)*i},facing:u*(Number(e.facing??1)<0?-1:1)}}const Ru=8192;function Pu(n){if(!/^"[\s\S]*"$/.test(n))throw Error("Text must be enclosed in double quotes.");if(n.length>Ru)throw Error("Debug text exceeds 8192 characters.");return n.slice(1,-1).replace(/\\([\s\S])/g,(e,t)=>{if(t==="n")return`
`;if(t==="t")return"    ";if(t==="\\"||t==='"')return t;throw Error(`Unsupported text escape \\${t}.`)})}function Pf(n){const e=Pu(n),t=[];let i=0,s=0;for(let r=0;r<e.length;r++)if(e[r]==="%"){if(t.push(e.slice(i,r)),e[r+1]==="%"){t.push("%"),r++,i=r+1;continue}const a=/^%([-+ #0]*)(\d*)(?:\.(\d*))?([difFeEgG])/.exec(e.slice(r));if(!a)throw Error("Unsupported clipboard format specifier.");const o=Number(a[2]||0),l=a[3]===void 0?void 0:Number(a[3]||0);if(o>512||l>20)throw Error("Clipboard format width or precision exceeds supported bounds.");t.push({flags:a[1],width:o,precision:l,spec:a[4]}),s++,r+=a[0].length-1,i=r+1}if(t.push(e.slice(i)),s>6)throw Error("Clipboard format accepts at most 6 numeric parameters.");return{parts:t,count:s}}function If({flags:n,width:e,precision:t,spec:i},{value:s,float:r}){if(typeof s!="number"||!Number.isFinite(s))throw Error("Clipboard parameters must be finite numbers.");r===void 0&&(r=!Number.isInteger(s)),/[di]/.test(i)===!!r&&(i=r?"f":"d",n="",e=0,t=void 0);const a=s<0||Object.is(s,-0),o=Math.abs(s);let l;if(/[di]/.test(i))l=t===0&&o===0?"":Math.trunc(o).toString().padStart(t??0,"0");else if(/[fF]/.test(i))l=o.toFixed(t??6);else if(/[eE]/.test(i))l=o.toExponential(t??6);else{const h=Math.max(1,t??6),f=Number(o.toPrecision(h)),u=f?Math.floor(Math.log10(f)):0;l=u<-4||u>=h?o.toExponential(h-1):o.toFixed(Math.max(0,h-u-1)),n.includes("#")||(l=l.replace(/(\.\d*?[1-9])0+(?=e|$)/,"$1").replace(/\.0*(?=e|$)/,""))}n.includes("#")&&!l.includes(".")&&(l=l.replace(/e|$/i,"."+(l.includes("e")?"e":""))),l=l.replace(/e([+-])(\d+)$/i,(h,f,u)=>"e"+f+u.padStart(2,"0")),/[FEG]/.test(i)&&(l=l.toUpperCase());const c=a?"-":n.includes("+")?"+":n.includes(" ")?" ":"";return n.includes("0")&&!n.includes("-")&&(t===void 0||!/[di]/.test(i))?c+l.padStart(Math.max(0,e-c.length),"0"):(l=c+l,n.includes("-")?l.padEnd(e):l.padStart(e))}function Lf(n,e){if(e.length!==n.count)throw Error(`Clipboard format requires ${n.count} parameters, received ${e.length}.`);let t=0;const i=n.parts.map(s=>typeof s=="string"?s:If(s,e[t++])).join("");if(i.length>Ru)throw Error("Formatted clipboard exceeds 8192 characters.");return i}const Xa=n=>{if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(String(n).trim()))throw Error("ForceFeedback parameters require numeric constants.");const e=Number(n);if(!Number.isFinite(e))throw Error("ForceFeedback requires finite constants.");return e};function Nf(n){const e=String(n.waveform??"sine").replace(/^"(.*)"$/,"$1").toLowerCase();if(!["sine","square","sinesquare","off"].includes(e))throw Error(`Invalid ForceFeedback waveform ${e}.`);const t=Xa(n.time??60),i=Xa(n.self??1);if(!Number.isInteger(t)||t<0||t>36e4||![0,1].includes(i))throw Error("Invalid ForceFeedback time or self parameter.");const s={waveform:e,time:t,self:i};for(const r of["freq","ampl"]){const a=String(n[r]??"128").split(",").map(Xa);if(a.length>4||!Number.isInteger(a[0]))throw Error(`Invalid ForceFeedback ${r} coefficients.`);s[r]=Array.from({length:4},(o,l)=>a[l]??0)}return s}const ds=(n,e=[0,0])=>n===void 0?[...e]:Array.isArray(n)?[n[0]??e[0],n[1]??e[1]]:[n,e[1]],fa=n=>n<0?-1:1,Mn=n=>Math.trunc(Number(n)),Iu=n=>/^\s*f(?=\s|[\d(+.-])/i.test(n||""),Df=new Set(["anim","id","space","pos","facing","vfacing","bindid","bindtime","vel","velocity","accel","removetime","supermovetime","pausemovetime","scale","angle","xangle","yangle","sprpriority","ontop","shadow","ownpal","remappal","removeongethit","ignorehitpause","trans","alpha","postype","random","supermove"]);function Uf(n,e,t,i=!1){const s=t.ownpal===void 0?i?e.common:e.ownpal:!!t.ownpal;if(s&&(i||!e.ownpal)&&(e.paletteRemaps=e.common?new Map:kl(n.paletteRemaps),n.events.push({type:"palettesnapshot",target:e,common:e.common})),s||(e.paletteRemaps=null,e.paletteSnapshot=null),e.ownpal=s,s&&!e.common&&t.remappal!==void 0)try{Bl(e.paletteRemaps,n.character,t.remappal)}catch(r){n.diagnostic("palette",r.message)}}function Ff(n,e,t,i){var h,f,u,d,p,_;const s=e.config,r=((h=n.world)==null?void 0:h.view)||{displayHeight:240};if(i||t.random!==void 0){const m=ds(s.random);e.randomOffset=m.map(v=>v>0?Math.floor(n.resolveTrigger("random")/1e3*v)-Math.floor(v/2):0)}const a=ds(s.pos).map((m,v)=>(m+e.randomOffset[v])*n.coordinateScale);e.bindOffset=a,e.relativeFacing=fa(s.facing??1),e.vfacing=fa(s.vfacing??1);const o=s.space!==void 0||s.bindid!==void 0,l=/^1\.(\d+)/.exec(((u=(f=n.character.def)==null?void 0:f.info)==null?void 0:u.mugenversion)||"");if(e.postype=o?null:String(s.postype??(l&&Number(l[1])>=1?"none":"p1")).toLowerCase(),e.bindID=Mn(s.bindid??-2),e.bindingTarget=null,o){if(e.space=String(s.space||"stage").toLowerCase(),!["stage","screen"].includes(e.space))throw Error(`Unsupported Explod space ${e.space}.`);if(e.space==="screen"&&e.bindID!==-2)throw Error("Screen-space Explods cannot be bound.");if(e.bindID!==-2&&s.bindtime===void 0)throw Error("Explod bindID requires bindtime.");e.pos={x:a[0],y:a[1]},e.facing=e.relativeFacing}else if(["p1","p2"].includes(e.postype))e.space="stage",e.bindingTarget=e.postype==="p2"?n.opponent:n,e.pos={x:((d=e.bindingTarget)==null?void 0:d.pos.x)??n.pos.x,y:((p=e.bindingTarget)==null?void 0:p.pos.y)??n.pos.y},e.facing=e.relativeFacing*(((_=e.bindingTarget)==null?void 0:_.facing)??n.facing);else if(["front","back","left","right"].includes(e.postype)){e.space="screen";const m=e.postype==="right"||e.postype==="front"&&n.facing>0||e.postype==="back"&&n.facing<0,v=e.postype==="back"?n.facing:1;e.pos={x:(m?320:0)+a[0]*v,y:a[1]},e.facing=e.relativeFacing*v}else if(e.postype==="none")e.space="stage",e.pos={x:a[0],y:a[1]},e.facing=e.relativeFacing;else throw Error(`Unsupported Explod postype ${e.postype}.`);const c=e.postype==="p1"||e.postype==="p2"||e.bindID!==-2;if(e.bindtime=e.space==="stage"&&c?Mn(s.bindtime??1):0,e.initialBinding=c,e.positioned=!e.initialBinding,!Number.isFinite(r.displayHeight))throw Error("Invalid Explod viewport.")}function Cc(n,e,t,i,s){var r,a;for(const o of["angle","xangle","yangle"])if(t[o]!==void 0&&(typeof t[o]!="number"||!Number.isFinite(t[o])))throw Error(`Explod ${o} must be a finite number.`);if(e.config={...e.config,...t},t.anim!==void 0||i){const o=t.anim===void 0?e.common:Iu(s.values.anim),l=Mn(t.anim??e.anim),c=o?n.commonAnimations:n.animations;if(!c.has(l)||!((r=c.get(l).frames)!=null&&r.length))throw Error(`Explod ${o?"common ":""}animation ${l} does not exist or has no frames.`);e.anim=l,e.common=o,e.animation=c.get(l),e.frameIndex=0,e.frameTime=0}for(const o of["removetime","supermovetime","pausemovetime","sprpriority","angle","xangle","yangle","ontop","shadow","removeongethit","ignorehitpause","supermove"])t[o]!==void 0&&(e[o]=t[o]);for(const o of["removetime","supermovetime","pausemovetime","sprpriority"])e[o]=Mn(e[o]??0);if(e.removetime<-2||Mn(e.config.bindtime??0)<-1)throw Error("Invalid Explod removal or binding time.");t.scale!==void 0&&(e.scale=ds(t.scale,[1,1])),(t.trans!==void 0||t.alpha!==void 0)&&(e.trans={mode:String(e.config.trans||"default").toLowerCase(),alpha:ds(e.config.alpha,[256,0])}),(t.vel!==void 0||t.velocity!==void 0||i)&&(e.velocity=ds(e.config.vel??e.config.velocity).map(o=>o*n.coordinateScale)),(t.accel!==void 0||i)&&(e.accel=ds(e.config.accel).map(o=>o*n.coordinateScale)),Uf(n,e,t,i),i||["space","postype","pos","bindid","random"].some(o=>t[o]!==void 0)?Ff(n,e,t,i):(t.facing!==void 0&&(e.relativeFacing=fa(t.facing),e.facing=e.relativeFacing*(((a=e.bindingTarget)==null?void 0:a.facing)??(e.postype==="back"?n.facing:1))),t.vfacing!==void 0&&(e.vfacing=fa(t.vfacing)),t.bindtime!==void 0&&(e.bindtime=Mn(t.bindtime)))}function Of(n,e){const t=Mn(n.value(e,"id",-1)),i=n.explods.filter(o=>t===-1||o.id===t);if(e.type==="removeexplod"){n.explods=n.explods.filter(o=>!i.includes(o)),n.drawExplods=n.drawExplods.filter(o=>t!==-1&&o.id!==t);return}if(e.type==="explodbindtime"){const o=Mn(n.value(e,e.values.time===void 0?"value":"time",1));if(o<-1)throw Error("ExplodBindTime must be -1 or greater.");for(const l of i)l.bindtime=o;return}const s=Iu(e.values.anim)?e.entries.map(o=>o.key==="anim"?{...o,value:o.value.replace(/^\s*f\s*/i,"")}:o):e.entries,r=n.effectParameters({...e,entries:s});e.values.ignorehitpause!==void 0&&(r.ignorehitpause=n.value(e,"ignorehitpause",1));for(const o of Object.keys(r))Df.has(o)||n.diagnostic("unsupported-explod-parameter",`Explod parameter ${o} is not implemented.`,e);for(const o of["pos","vel","velocity","accel","scale","random","remappal","alpha"])if(Array.isArray(r[o])&&r[o].length>2)throw Error(`Explod ${o} takes at most two components.`);if(e.type==="modifyexplod"){for(const o of i){const l=n.events.length,c={...o,config:{...o.config},paletteRemaps:o.paletteRemaps?new Map(o.paletteRemaps):null};try{Cc(n,c,r,!1,e)}catch(h){throw n.events.length=l,h}Object.assign(o,c);for(const h of n.events.slice(l))h.target===c&&(h.target=o)}return}if(e.values.anim===void 0)throw Error("Explod requires anim.");if(n.explods.length>=512){n.diagnostic("resource-limit","Explod limit (512 per entity) reached.",e);return}const a={owner:n,creator:n,id:t,coordinateScale:n.coordinateScale,time:0,frameIndex:0,frameTime:0,config:{},removetime:-2,bindtime:0,ignorehitpause:1,supermovetime:0,pausemovetime:0,scale:[1,1],angle:0,xangle:0,yangle:0,vfacing:1};Cc(n,a,r,!0,e),n.explods.push(a)}function Rc(n,e,t){if(!(e!=null&&e.remaining)||(n[t]!==e&&(n[t]=e,n[t+"Moved"]=0),t==="superPause"&&n.supermove))return!0;const i=t==="superPause"?"supermovetime":"pausemovetime";return n[t+"Moved"]>=Math.max(0,n[i]||0)?!1:(n[t+"Moved"]++,!0)}function kf(n,e){for(const t of n.explods)!(t.bindingTarget===e||!t.bindingTarget&&(t.postype==="p1"&&n===e||t.postype==="p2"&&n.opponent===e||t.bindID===e.id||t.bindID===-1&&n.root===e))||!t.initialBinding&&t.bindtime===0||((t.initialBinding||!t.positioned)&&(t.pos={x:e.pos.x+t.bindOffset[0]*e.facing,y:e.pos.y+t.bindOffset[1]},t.facing=t.relativeFacing*e.facing),t.bindingTarget=null,t.bindtime=0,t.initialBinding=!1,t.positioned=!0)}function Bf(n,{hitPaused:e=!1,pause:t=null,superPause:i=null,forceFrozen:s=!1}={}){var a,o;const r=[];for(const l of n.explods){if(l.removetime===0||l.pendingRemoval&&!(i!=null&&i.remaining)){l.removed=!0;continue}!l.bindingTarget&&(l.bindtime||l.initialBinding)&&(l.postype==="p2"?l.bindingTarget=n.opponent:l.postype==="p1"?l.bindingTarget=n:l.bindID!==-2&&(l.bindingTarget=l.bindID===-1?n.root:l.bindID===n.id?n:(a=n.world)==null?void 0:a.findPlayer(l.bindID))),(o=l.bindingTarget)!=null&&o.destroyed&&(l.bindingTarget=null,l.bindtime=0,l.initialBinding=!1);const c=l.space==="stage"&&!!l.bindingTarget&&(l.initialBinding||l.bindtime!==0);if(l.initialBinding&&!l.bindingTarget){n.diagnostic("missing-player",`Explod binding player ${l.bindID} is unavailable.`),l.removed=!0;continue}let h=s||e&&!l.ignorehitpause;if(h||(h=i!=null&&i.remaining?!Rc(l,i,"superPause"):!Rc(l,t,"pause")),c?(l.facing=l.relativeFacing*l.bindingTarget.facing,l.pos={x:l.bindingTarget.pos.x+l.bindOffset[0]*l.bindingTarget.facing,y:l.bindingTarget.pos.y+l.bindOffset[1]},l.positioned=!0):!h&&l.time>0&&(l.pos.x+=l.velocity[0]*l.facing,l.pos.y+=l.velocity[1]),r.push({...l,pos:{...l.pos},source:l}),h)continue;l.time>0&&(l.velocity[0]+=l.accel[0],l.velocity[1]+=l.accel[1]),l.initialBinding=!1,l.bindtime>0&&l.bindtime--;const f=l.animation.frames[l.frameIndex];f&&f.ticks>=0&&++l.frameTime>=Math.max(1,f.ticks)&&(l.frameTime=0,++l.frameIndex>=l.animation.frames.length&&(l.removetime===-2&&(l.removed=!0),l.frameIndex=l.animation.loopStart||0)),l.time++,l.removetime>0&&l.time>=l.removetime&&(l.removed=!0),l.removed&&l.supermove&&(i!=null&&i.remaining)&&(l.removed=!1,l.pendingRemoval=!0)}n.drawExplods=r,n.explods=n.explods.filter(l=>!l.removed)}const Xn=new Map,zf=["N","S","H"];function js(n){const e=String(n??"").toUpperCase().replace(/\s/g,"");if(Xn.has(e))return Xn.get(e);const[t,...i]=e.split(",");if(!/^[SCA]*$/.test(t))throw Error(`Invalid hit attribute states: ${t}`);const s=new Set;for(const a of i)if(a){if(!/^[NSHA][ATP]$/.test(a))throw Error(`Invalid hit attack attribute: ${a}`);for(const o of a[0]==="A"?zf:[a[0]])s.add(o+a[1])}const r={states:new Set(t),attacks:s};return Xn.size>=512&&Xn.delete(Xn.keys().next().value),Xn.set(e,r),r}function Lu(n,e){const t=typeof n=="string"?js(n):n,i=typeof e=="string"?js(e):e;return{state:[...i.states].some(s=>t.states.has(s)),attack:[...i.attacks].some(s=>t.attacks.has(s))}}function $a(n,e){const t=Lu(n,e);return t.state&&t.attack}function Hf(n,e){const t=Lu(n.attribute,e);return n.exclude?!t.state&&!t.attack:t.state&&t.attack}function Ft(n){var t,i,s;if((n==null?void 0:n.baseCoordinateScale)>0)return n.baseCoordinateScale;const e=Number(String(((s=(i=(t=n==null?void 0:n.character)==null?void 0:t.def)==null?void 0:i.info)==null?void 0:s.localcoord)||"320,240").split(",")[0]);return e>0?320/e:1}function sa(n,e,{edge:t=!1}={}){var o,l,c,h,f,u;const i=n.facing===e,s=i?"front":"back",r=t?(l=(o=n.width)==null?void 0:o.edge)==null?void 0:l[i?0:1]:(c=n.width)==null?void 0:c[s],a=((f=(h=n.program)==null?void 0:h.constants)==null?void 0:f.get(`size.${n.stateType==="A"?"air":"ground"}.${s}`))??15;if(r!==void 0){const d=(Number(r)||0)*(n.coordinateScale||Ft(n));return Math.max(0,d+((u=n.world)!=null&&u.orderedPhases?Math.max(0,Number(a)||0)*Ft(n):0))}return Math.max(0,Number(a)||0)*Ft(n)}function Vf(n,e,{body:t=!1,scale:i=n.coordinateScale}={}){var o,l,c,h;const s=(o=n.world)==null?void 0:o.view,r=e>0?(s==null?void 0:s.right)??((l=n.options)==null?void 0:l.rightBound)??160:(s==null?void 0:s.left)??((c=n.options)==null?void 0:c.leftBound)??-160;let a=e>0?r-n.pos.x:n.pos.x-r;if(t){const f=n.width??n._previousWidth,u=Number((h=f==null?void 0:f.edge)==null?void 0:h[n.facing===e?0:1])||0;a-=u*n.coordinateScale+(n.stateType==="A"?.5:0)}return Math.trunc(a/i)}function Pc(n){return n.startsWith("velocity.")?!/\.mul(?:\.|$)/.test(n):n.startsWith("size.")?!["size.xscale","size.yscale","size.proj.doscale"].includes(n):n.startsWith("movement.")&&!/(?:\.friction$|\.num$|\.time$|\.mul(?:\.|$))/.test(n)}const Nu=new Set(["xoff","yoff","zoff","xvel","yvel","xveladd","yveladd","yaccel","fall.xvel","fall.yvel","fall.envshake.ampl"]);function Gf(n,e){const t=n.coordinateScale,i=t/e;if(n.coordinateScale=e,i!==1){for(const s of Nu)typeof n.getHitVars[s]=="number"&&(n.getHitVars[s]*=i);if(n.width){for(const s of["front","back"])typeof n.width[s]=="number"&&(n.width[s]*=i);n.width.edge&&(n.width.edge=n.width.edge.map(s=>s*i))}n.attackDist!==void 0&&(n.attackDist*=i)}}function Du(n){return n.collisionFrame?n.collisionAnimationOwner||n.animationOwner||n:n.animationOwner||n}const ko=n=>{var e;return n!=null&&n.isProjectile?(e=n.owner)==null?void 0:e.id:n==null?void 0:n.id},Uu=(n,e)=>!(e!=null&&e.isProjectile)&&(n.hitonce===void 0?/^[SCA]\s*,\s*[NSH]T$/i.test(n.attr||""):Number(n.hitonce)!==0);function Wf(n,e,t){const i=n.hitId??-1,s=e.chainid??-1;if(s>=0&&i!==s)return!1;const r=Array.isArray(e.nochainid)?e.nochainid:[e.nochainid??-1];return!(n.hitSourceId===ko(t)&&ko(t)!==void 0&&r.some(a=>a>=0&&a===i&&a!==s))}function Xf(n,e,t){var i;return Wf(n,e,t)&&!(Uu(e,t)&&((i=t==null?void 0:t._spentHitDefs)!=null&&i.has(e)))}function $f(n,e,t){!t||!Uu(e,t)||(t._spentHitDefs??(t._spentHitDefs=new WeakSet),t._spentHitDefs.add(e),t.targets.splice(0,t.targets.length,n),t.targetHitIds.clear())}function Ic(n,e,t,{count:i=!0}={}){var r,a;if(!n||(n.moveContact=1,n.moveHit=t?0:1,n.moveGuarded=t?1:0,n.moveReversed=0,t||!i||(r=n.world)!=null&&r.orderedPhases&&e.numhits===0))return;const s=((a=n.world)==null?void 0:a.ticks)??n.gameTime??0;n._lastHitCountTick!==s&&(n.hitCount=(n.hitCount||0)+1,n._lastHitCountTick=s),n.uniqHitCount=(n.uniqHitCount||0)+1}const qf=new Set(["xveladd","yveladd","type","animtype","airtype","groundtype","damage","hitcount","fallcount","hitshaketime","hittime","slidetime","ctrltime","recovertime","xoff","yoff","zoff","xvel","yvel","yaccel","hitid","chainid","guarded","isbound","fall","fall.damage","fall.xvel","fall.yvel","fall.recover","fall.time","fall.recovertime","fall.kill","fall.envshake.time","fall.envshake.freq","fall.envshake.ampl","fall.envshake.phase"]);function Yf(n){var e;return{type:0,hitid:-1,chainid:0,hitcount:0,fallcount:0,hittime:-1,recovertime:n.constant("data.liedown.time"),xveladd:0,yveladd:0,zoff:0,fall:0,"fall.time":0,"fall.recover":(e=n.world)!=null&&e.orderedPhases?0:1,"fall.recovertime":4}}const Lc=new Set(["a","b","c","x","y","z","s","U","D","L","R"]);function Kf(n,e,t){const i=e===null?new Set([...t].filter(s=>Lc.has(s))):new Set([...e].filter(s=>Lc.has(s)));if(e===null)for(const[s,r]of[["holdup","U"],["holddown","D"],["holdfwd",n.facing<0?"L":"R"],["holdback",n.facing<0?"R":"L"]])t.has(s)&&i.add(r);n._recoveryPressed=[...i].some(s=>!n._previousInput.has(s)),n._previousInput=i,n.rawInput=i}function Nc(n,{hitPaused:e=!1}={}){var i;const t=n.getHitVars;if(n.moveType==="H"){if(t.fall&&(t["fall.time"]=(t["fall.time"]||0)+1),e||(n.hitTime>=0&&n.hitTime--,[5070,5100].includes(n.stateNo)&&n._fallEntry!==n._entrySerial&&(t.fallcount=(t.fallcount||0)+1,n._fallEntry=n._entrySerial,n._fallDefenceMultiplier*=n.constant("data.fall.defence_mul")),n.stateNo===5110&&(t.recovertime=Math.max(0,(t.recovertime??n.constant("data.liedown.time"))-1))),n._recoveryPressed&&n.alive&&(n.stateType==="L"||t.fallcount>0)&&t.recovertime>0){const s=Math.max(1,Math.ceil(t.recovertime/2));t.recovertime=Math.max(0,t.recovertime-1-Math.floor(n.resolveTrigger("random")/1e3*s))}}else n.comboHits=0,n.hitTime=-1,n.hitId=n.hitId<0?-1:0,n.hitSourceId=void 0,t.fall=0,t.fallcount=0,(i=n.world)!=null&&i.orderedPhases||(t["fall.time"]=0),t["fall.envshake.time"]=0,n._fallDefenceMultiplier=1,t.recovertime=n.constant("data.liedown.time");t.hittime=n.hitTime,t.hitid=n.hitId,t.chainid=Math.max(0,n.hitId)}const Fu=Object.freeze({attackLifeToPower:.7,getHitLifeToPower:.6,superTargetDefence:1.5});function Zf(n={},e={}){const t=Object.keys(n).find(r=>/(?:^|\/)data\/mugen\.cfg$/i.test(r)),i=t?Pa(an(n[t])).rules||{}:{},s={...Fu};for(const[r,a]of[["attackLifeToPower","default.attack.lifetopowermul"],["getHitLifeToPower","default.gethit.lifetopowermul"],["superTargetDefence","super.targetdefencemul"]]){const o=Number(e[r]??i[a]??s[r]);if(!Number.isFinite(o)||o<0)throw Error(`Invalid combat rule ${a}.`);s[r]=o}return s}function _r(n,e,t,{absolute:i=!1}={}){let s=Number(n);if(!Number.isFinite(s))throw Error("Damage must be finite.");if(!i){const r=e?Math.max(0,e.constant("data.attack")/100*(e.attackMultiplier??1)):1,a=Math.max(.01,t.constant("data.defence")/100);s*=r*Math.max(0,t.defenceMultiplier??1)*Math.max(0,t._fallDefenceMultiplier??1)/a}return s>0?Math.max(1,Math.round(s)):Math.round(s)}function jf(n,e=Fu){var s;const t=Math.max(0,Math.trunc(((s=n.damage)==null?void 0:s[0])||0)),i=(r,a)=>{const o=Array.isArray(r)?r:r===void 0?[Math.trunc(Math.fround(Math.fround(t)*Math.fround(a)))]:[r],l=Math.trunc(o[0]||0);return[l,Math.trunc(o[1]??l/2)]};return{get:i(n.getpower,e.attackLifeToPower),give:i(n.givepower,e.getHitLifeToPower)}}function Jf(n,e,t,i=1){const s=n,r=e;return t!=="L"&&(t!=="A"&&e===0&&(n*=.66),n&&(n+=Math.sign(n)*2.5/i),e<=0&&(e=Math.min(e-2/i,(t==="A"?-3:-6)/i))),{x:n,y:e,xadd:n-s,yadd:e-r}}const Dc=new WeakMap;function nr(n){const e=n==null?void 0:n.frames;if(!(e!=null&&e.length))return null;let t=Dc.get(n);if((t==null?void 0:t.frames)===e&&t.length===e.length)return t;const i=new Float64Array(e.length+1),s=new Float64Array(e.length+1);for(let a=0;a<e.length;a++)i[a+1]=i[a]+Math.max(1,e[a].ticks),s[a+1]=s[a]+(e[a].ticks<0?1/0:Math.max(1,e[a].ticks));const r=n.loopStart??n.loopstart??0;return t={frames:e,length:e.length,offsets:i,lookupOffsets:s,duration:s[e.length],loopStart:r,intro:s[r]},Dc.set(n,t),t}function Bo(n){const e=new Error(n);throw e.bottom=!0,e}function Qf(n,e,t){const i=nr(n),s=t-1;return(!i||s<0||s>=i.length)&&Bo(`Animation element out of range: ${t}`),e.animationTime-i.offsets[s]}function ep(n,e,t=0){const i=nr(n);i||Bo("Animation has no elements");let s=e.animationCycleTime+t;if(Number.isFinite(i.duration)&&(e.animationLooped||e.frameIndex>=i.loopStart||s>=i.duration)){const o=i.duration-i.intro;s=i.intro+((s-i.intro)%o+o)%o}else s<0&&Bo("Animation offset precedes its start");let r=0,a=i.length;for(;r<a;){const o=r+a>>>1;s<i.lookupOffsets[o+1]?a=o:r=o+1}return r<i.length?r+1:void 0}function tp(n,e){const t=nr(n);return!t||e.animationEnded?0:Number.isFinite(t.duration)?e.animationCycleTime-t.duration:-1}function qa(n){return{anim:n.anim,animationOwner:n.animationOwner,frameIndex:n.frameIndex,frameTime:n.frameTime,animationTime:n.animationTime,animationCycleTime:n.animationCycleTime,animationLooped:n.animationLooped,animationEnded:n.animationEnded}}function Uc(n,e){n.anim=e.anim,n.animationOwner=e.animationOwner,n.frameIndex=e.frameIndex,n.frameTime=e.frameTime,n.animationTime=e.animationTime,n.animationCycleTime=e.animationCycleTime,n.animationLooped=e.animationLooped,n.animationEnded=e.animationEnded}class On extends Error{constructor(e,t,i){super(e),this.source=t,this.line=i}}function xr(n,e){const t=[];let i=0,s=0,r=!1,a=!1;for(let o=0;o<n.length;o++){const l=n[o];l==='"'&&!a&&(r=!r),r||("([".includes(l)&&s++,")]".includes(l)&&s--,!s&&l===e&&(t.push(n.slice(i,o).trim()),i=o+1)),a=l==="\\"&&!a}return t.push(n.slice(i).trim()),t}class ip{constructor(e,t){if(e.length>2*1024*1024)throw new On("ZSS file exceeds 2 MiB.",t,1);this.text=e.replace(/^\uFEFF/,""),this.source=t,this.at=0,this.line=1,this.nodes=0,this.depth=0,this.scope=new Set,this.expressions=new Set}fail(e){throw new On(e,this.source,this.line)}take(){const e=this.text[this.at++];return e===`
`&&this.line++,e}skip(){for(;;){for(;/\s/.test(this.text[this.at]||"")&&this.at<this.text.length;)this.take();if(this.text[this.at]!=="#")return;for(;this.at<this.text.length&&this.take()!==`
`;);}}word(){this.skip();const e=/^[a-z_][a-z0-9_.]*/i.exec(this.text.slice(this.at));return e||this.fail("Expected an identifier."),this.at+=e[0].length,e[0]}is(e){return this.skip(),new RegExp("^"+e+"(?![a-z0-9_.])","i").test(this.text.slice(this.at))}expect(e){this.skip(),this.take()!==e&&this.fail(`Expected '${e}'.`)}read(e){let t="",i=0,s=!1,r=!1;for(;this.at<this.text.length;){const a=this.text[this.at];if(!s&&!i&&e.includes(a)&&!(a===":"&&this.text[this.at+1]==="="))break;if(!s&&a==="#"){for(;this.at<this.text.length&&this.take()!==`
`;);t+=" ";continue}t+=this.take(),a==='"'&&!r&&(s=!s),s||("([".includes(a)&&i++,")]".includes(a)&&--i<0&&this.fail("Unbalanced expression.")),r=a==="\\"&&!r}return(s||i)&&this.fail("Unterminated expression."),t.trim()}local(e){/^[a-z_][a-z0-9_]*$/i.test(e)||this.fail("Invalid local variable name."),this.scope.add(e),this.scope.size>256&&this.fail("ZSS local-variable limit (256) exceeded.")}expr(e,t=!0){(!e||e.length>8192)&&this.fail("Empty or oversized ZSS expression.");let i="",s=!1,r=!1;for(let a=0;a<e.length;a++){const o=e[a];if(!s&&o==="$"){const l=/^[a-z_][a-z0-9_]*/i.exec(e.slice(a+1));(!l||!this.scope.has(l[0]))&&this.fail(`Unknown local variable near ${e.slice(a,a+40)}.`),i+=`zsslocal("${l[0]}")`,a+=l[0].length;continue}i+=o,o==='"'&&!r&&(s=!s),r=o==="\\"&&!r}if(t)try{zl(i)}catch(a){this.fail(a.message)}return this.expressions.add(i),i}parameters(e,t){const i=[],s={};for(const r of xr(e,";").filter(Boolean)){const a=/^([a-z_][a-z0-9_.]*)\s*:\s*([\s\S]+)$/i.exec(r);a||this.fail("Expected parameter: value.");const o=a[1].toLowerCase(),l=this.expr(a[2],!1);i.push({key:o,value:l,line:t}),s[o]=l}return{entries:i,values:s}}block(e=0){this.expect("{"),++this.depth>64&&this.fail("ZSS nesting limit (64) exceeded.");const t=this.statements(e,!0);return this.expect("}"),this.depth--,t}statements(e=0,t=!1,i=!1){const s=[];for(;;){this.skip();const r=this.text[this.at];if(r==="}"||i&&(this.is("case")||this.is("default"))||this.at>=this.text.length||!t&&r==="[")break;if(r===";"){this.take();continue}++this.nodes>2e4&&this.fail("ZSS statement limit (20,000) exceeded."),s.push(this.statement(e))}return s}call(e){const t=/^call\s+([a-z_][a-z0-9_]*)\s*\(([\s\S]*)\)$/i.exec(e);return t||this.fail("Invalid function call."),{kind:"call",name:t[1],args:t[2].trim()?Zi(t[2]).map(i=>this.expr(i)):[]}}statement(e){++this.depth>64&&this.fail("ZSS nesting limit (64) exceeded.");try{return this.readStatement(e)}finally{this.depth--}}readStatement(e){var u;this.skip();const t=this.line,i=this.source;let s=!1,r=1,a=!1;for(;this.is("ignorehitpause")||this.is("persistent");)if(a=!0,this.word().toLowerCase()==="ignorehitpause")s=!0;else{this.expect("(");const p=this.read(")");this.expect(")"),(!/^\d+$/.test(p)||Number(p)>2147483647)&&this.fail("persistent requires a nonnegative integer constant."),r=Number(p)}const o={source:i,line:t,ignoreHitPause:s,persistent:r};if(this.text[this.at]==="{")return{...o,kind:"block",body:this.block(e)};const l=this.word(),c=l.toLowerCase();if(c==="if"){const d=this.expr(this.read("{")),p=this.block(e);this.skip();let _=[];return this.is("else")&&(this.word(),this.skip(),_=this.text[this.at]==="{"?this.block(e):[this.statement(e)]),{...o,kind:"if",condition:d,yes:p,no:_}}if(a&&this.fail("ignoreHitPause/persistent must prefix an if statement or a braced block."),c==="while")return{...o,kind:"while",condition:this.expr(this.read("{")),body:this.block(e+1)};if(c==="for"){const d=xr(this.read("{"),";");(d.length<2||d.length>3)&&this.fail("for requires start; end; optional step.");let p=null,_=d[0];const m=/^([a-z_][a-z0-9_]*)\s*=\s*([\s\S]+)$/i.exec(_);return m&&(p=m[1],this.local(p),_=m[2]),{...o,kind:"for",variable:p,start:this.expr(_),end:this.expr(d[1]),step:this.expr(d[2]||"1"),body:this.block(e+1)}}if(c==="switch"){const d=this.expr(this.read("{"));this.expect("{"),++this.depth>64&&this.fail("ZSS nesting limit (64) exceeded.");const p=[];let _=null;for(;this.skip(),this.text[this.at]!=="}";){const m=this.word().toLowerCase();if(m==="case"){const v=xr(this.read(":"),";").map(y=>this.expr(y));this.expect(":"),p.push({values:v,body:this.statements(e,!0,!0)})}else m==="default"&&!_?(this.expect(":"),_=this.statements(e,!0,!0)):this.fail("Expected case or a single default label.")}return this.expect("}"),this.depth--,{...o,kind:"switch",expression:d,cases:p,fallback:_||[]}}if(c==="break"||c==="continue")return e||this.fail(`${c} is only valid inside a loop.`),this.expect(";"),{...o,kind:c};if(c==="let"){const d=this.read("=").split(",").map(m=>m.trim());d.forEach(m=>this.local(m)),this.expect("=");const p=this.read(";");if(this.expect(";"),/^call\b/i.test(p))return{...o,...this.call(p),outputs:d};const _=Zi(p).map(m=>this.expr(m));return d.length!==_.length&&this.fail("Local assignment needs one value per name."),{...o,kind:"let",names:d,values:_}}if(c==="call"){const d="call "+this.read(";");return this.expect(";"),{...o,...this.call(d)}}if(this.skip(),this.text[this.at]==="{"){this.expect("{");const d=this.parameters(this.read("}"),t);this.expect("}"),(d.values.persistent!==void 0||d.values.ignorehitpause!==void 0&&c!=="explod")&&this.fail("Controller persistence/hitpause flags belong before a ZSS block.");const p=[{key:"type",value:c,line:t},{key:"trigger1",value:"1",line:t},...d.entries];return{...o,kind:"controller",controller:{name:"state zss",source:i,line:t,type:c,entries:p,values:{type:c,trigger1:"1",...d.values},language:"zss"}}}const h=l+this.read(";");this.expect(";");const f=/^(?:(parent|root)\s*,\s*)?(var|fvar|sysvar|sysfvar|map)\s*\(/i.exec(h);if(f){let d=f[0].length,p=1,_=!1,m=!1;for(;d<h.length;d++){const y=h[d];if(y==='"'&&!m&&(_=!_),!_&&(y==="("&&p++,y===")"&&--p===0))break;m=y==="\\"&&!m}const v=/^\s*:=\s*([\s\S]+)$/.exec(h.slice(d+1));if(p===0&&v){const y=((u=f[1])==null?void 0:u.toLowerCase())||null,A=f[2].toLowerCase(),R=h.slice(f[0].length,d);return{...o,kind:"assign",target:y,variable:A,index:A==="map"?R.trim().replace(/^"(.*)"$/,"$1").toLowerCase():this.expr(R),value:this.expr(v[1])}}}return{...o,kind:"expression",expression:this.expr(h)}}parse(){const e=[],t=[];for(;this.at<this.text.length&&(this.skip(),!(this.at>=this.text.length));){const i=this.line;this.expect("[");const s=this.read("]");if(this.expect("]"),this.scope=new Set,/^statedef\b/i.test(s)){const r=xr(s,";"),a=this.expr(r.shift().replace(/^statedef\s+/i,"")),o=this.parameters(r.filter(Boolean).join(";"),i),l=this.statements();e.push({source:this.source,line:i,name:"statedef zss",idExpression:a,...o,zssNodes:l,localNames:[...this.scope],controllers:[]})}else{const r=/^function\s+([a-z_][a-z0-9_]*)\s*\(([^)]*)\)\s*(.*?)\s*$/i.exec(s);r||this.fail("Expected StateDef or Function header.");const a=r[2].trim()?r[2].split(",").map(c=>c.trim()):[],o=r[3].replace(/^return\s+/i,"").split(",").map(c=>c.trim()).filter(Boolean);[...a,...o].forEach(c=>this.local(c));const l=this.statements();t.push({source:this.source,line:i,name:r[1],args:a,outputs:o,localNames:[...this.scope],body:l})}}return{states:e,functions:t,expressions:this.expressions}}}function Ou(n,e){for(const t of n){e(t);for(const i of[t.body,t.yes,t.no,t.fallback,...(t.cases||[]).map(s=>s.body)])i&&Ou(i,e)}}function np(n,e="<zss>"){return new ip(n,e).parse()}const ku=Object.freeze({value:0,float:!1}),un=new WeakMap;function sp(n){return[n.body,n.yes,n.no,n.fallback,...(n.cases||[]).map(e=>e.body)].filter(Boolean)}function rp(n){var t;if(un.has(n))return un.get(n);const e=[[n,!1]];for(;e.length;){const[i,s]=e.pop();if(un.has(i))continue;if(i.ignoreHitPause){un.set(i,!0);continue}const r=[...sp(i).flat(),...((t=i.function)==null?void 0:t.body)||[]];if(s)un.set(i,r.some(a=>un.get(a)));else{e.push([i,!0]);for(const a of r)un.has(a)||e.push([a,!1])}}return un.get(n)}function Ti(n){if(n!=null&&n.bottom)throw n.error;if(typeof(n==null?void 0:n.value)!="number"||!Number.isFinite(n.value))throw Error("ZSS locals and function values currently require finite numbers.");return n.value}function ap(n,e){return n.float||e.float?Math.fround(Ti(n))===Math.fround(Ti(e)):Ti(n)===Ti(e)}function Fc(n){return new Map(n.map(e=>[e,ku]))}function op(n,e,t,i){const s=n._zssContext,r=n._scriptOwner,a=n._executing,o=n._entrySerial,l={owner:t,locals:Fc(e.localNames||[]),depth:0};n._zssContext=l,n._scriptOwner=t;const c=(_,m)=>n.evaluate(_,m,!0),h=(_,m)=>{try{return Ti(c(_,m))!==0}catch(v){if(v.bottom)return!1;throw v}},f=_=>{if(n._executing=_,++n._zssSteps>2e4){const m=Error("ZSS instruction budget exceeded (20,000 per tick).");throw m.zssBudget=!0,m}},u=()=>n.destroyed||n._entrySerial!==o;function d(_,m){const v=_.function,y=n._zssContext;if(!v)throw Error(`Unknown ZSS function ${_.name}.`);if(y.depth>=32)throw Error("ZSS function depth limit (32) exceeded.");const A=_.args.map(S=>c(S,_)),R={owner:t,locals:Fc(v.localNames),depth:y.depth+1};A.forEach((S,M)=>R.locals.set(v.args[M],S)),n._zssContext=R;try{return{signal:p(v.body,m),values:v.outputs.map(M=>R.locals.get(M)||ku)}}finally{n._zssContext=y}}function p(_,m=!1){var v;for(const y of _){if(u())return"transition";const A=m||y.ignoreHitPause;if(i&&!A&&!rp(y))continue;f(y);const R=n._controllerCounts.get(y)||0;if(!(y.persistent!==1&&(n._controllerCounts.set(y,R+1),y.persistent===0?R!==0:R%y.persistent!==0))){try{let S;if(y.kind==="controller")n.execute(y.controller);else if(y.kind==="expression")c(y.expression,y);else if(y.kind==="assign"){const M=y.target==="parent"?n.parent:y.target==="root"?n.root:n;if(!M||M.destroyed){const P=Error("ZSS assignment target is unavailable.");throw P.bottom=!0,P}const g=y.variable==="map"?y.index:Ti(c(y.index,y)),x=Ti(c(y.value,y));y.variable==="map"?M.setMap(y.index,x):M.assignVariable(y.variable,[g],x)}else if(y.kind==="let"){const M=y.values.map(g=>c(g,y));M.forEach(Ti),y.names.forEach((g,x)=>n._zssContext.locals.set(g,M[x]))}else if(y.kind==="call"){const M=d(y,A);S=M.signal,S||(v=y.outputs)==null||v.forEach((g,x)=>n._zssContext.locals.set(g,M.values[x]))}else if(y.kind==="if")S=p(h(y.condition,y)?y.yes:y.no,A);else if(y.kind==="block")S=p(y.body,A);else if(y.kind==="switch"){const M=c(y.expression,y);let g=y.fallback;for(const x of y.cases)if(x.values.some(P=>ap(M,c(P,y)))){g=x.body;break}S=p(g,A)}else{if(y.kind==="break"||y.kind==="continue")return y.kind;if(y.kind==="while"||y.kind==="for"){let M,g,x;if(y.kind==="for"){if(M=Math.trunc(Ti(c(y.start,y))),g=Math.trunc(Ti(c(y.end,y))),x=Math.trunc(Ti(c(y.step,y))),!x)throw Error("ZSS for step cannot be zero.");y.variable&&n._zssContext.locals.set(y.variable,{value:M|0,float:!1})}let P=0;for(;y.kind==="while"?h(y.condition,y):x>0?M<=g:M>=g;){if(f(y),++P>2500){n.diagnostic("resource-limit","ZSS loop stopped at 2,500 iterations.",y);break}const T=p(y.body,A);if(T==="transition")return T;if(T==="break")break;y.kind==="for"&&(M+=x),y.kind==="for"&&(x>0?M<=g:M>=g)&&y.variable&&n._zssContext.locals.set(y.variable,{value:M|0,float:!1})}}}if(S)return S}catch(S){if(S.zssBudget)throw S;S.bottom||n.diagnostic("zss-runtime",S.message,y)}if(u())return"transition"}}return null}try{p(e.zssNodes)}catch(_){n.diagnostic(_.zssBudget?"resource-limit":"zss-runtime",_.message,n._executing)}finally{n._zssContext=s,n._scriptOwner=r,n._executing=a}}function zo(n,e="<script>"){const t=[];let i;for(const[s,r]of String(n).replace(/^\uFEFF/,"").split(/\r?\n/).entries()){let a=!1,o=!1,l="";for(let v=0;v<r.length;v++){const y=r[v];if(y==='"'&&!o&&(a=!a),y===";"&&!a)break;l+=y,o=y==="\\"&&!o}const c=l.trim();if(!c)continue;const h=c.match(/^\[([^\]]+)\]/);if(h){i={name:h[1].trim().toLowerCase(),source:e,line:s+1,entries:[],values:{}},t.push(i);continue}let f=-1,u=0,d=!1,p=!1;for(let v=0;v<c.length;v++){const y=c[v];if(y==='"'&&!p&&(d=!d),!d){if(y==="("||y==="[")u++;else if(y===")"||y==="]")u--;else if(y==="="&&u===0){f=v;break}}p=y==="\\"&&!p}if(!i||f<1)continue;const _=c.slice(0,f).trim().toLowerCase(),m=c.slice(f+1).trim();i.entries.push({key:_,value:m,line:s+1}),Object.hasOwn(i.values,_)||(i.values[_]=m)}return t}const lp={"data.life":1e3,"data.power":3e3,"data.attack":100,"data.defence":100,"data.airjuggle":15,"data.liedown.time":60,"data.sparkno":2,"data.guard.sparkno":40,"data.fall.defence_up":50,"data.ko.echo":0,"data.intpersistindex":60,"data.floatpersistindex":40,"size.xscale":1,"size.yscale":1,"size.ground.back":15,"size.ground.front":16,"size.air.back":12,"size.air.front":12,"size.height":60,"size.attack.dist":160,"size.proj.doscale":0,"size.proj.attack.dist":90,"size.head.pos.x":0,"size.head.pos.y":-90,"size.mid.pos.x":0,"size.mid.pos.y":-60,"size.draw.offset.x":0,"size.draw.offset.y":0,"size.shadowoffset":0,"velocity.walk.fwd.x":2.4,"velocity.walk.back.x":-2.2,"velocity.run.fwd.x":4.6,"velocity.run.fwd.y":0,"velocity.run.back.x":-4.5,"velocity.run.back.y":-3.8,"velocity.jump.neu.x":0,"velocity.jump.neu.y":-8.4,"velocity.jump.y":-8.4,"velocity.jump.fwd.x":2.5,"velocity.jump.back.x":-2.55,"velocity.runjump.fwd.x":4,"velocity.runjump.fwd.y":-8.1,"velocity.runjump.back.x":-2.55,"velocity.runjump.back.y":-8.1,"velocity.airjump.neu.x":0,"velocity.airjump.neu.y":-8.1,"velocity.airjump.y":-8.1,"velocity.airjump.fwd.x":2.5,"velocity.airjump.back.x":-2.55,"velocity.air.gethit.groundrecover.x":-.15,"velocity.air.gethit.groundrecover.y":-3.5,"velocity.air.gethit.airrecover.mul.x":.5,"velocity.air.gethit.airrecover.mul.y":.2,"velocity.air.gethit.airrecover.add.x":0,"velocity.air.gethit.airrecover.add.y":-4.5,"velocity.air.gethit.airrecover.back":-1,"velocity.air.gethit.airrecover.fwd":0,"velocity.air.gethit.airrecover.up":-2,"velocity.air.gethit.airrecover.down":1.5,"movement.yaccel":.44,"movement.stand.friction":.85,"movement.crouch.friction":.82,"movement.stand.friction.threshold":2,"movement.crouch.friction.threshold":.05,"movement.airjump.num":1,"movement.airjump.height":35,"movement.air.gethit.groundlevel":25,"movement.air.gethit.groundrecover.ground.threshold":-20,"movement.air.gethit.groundrecover.groundlevel":10,"movement.air.gethit.airrecover.threshold":-1,"movement.air.gethit.airrecover.yaccel":.35,"movement.air.gethit.trip.groundlevel":15,"movement.down.bounce.offset.x":0,"movement.down.bounce.offset.y":20,"movement.down.bounce.yaccel":.4,"movement.down.bounce.groundlevel":12,"movement.down.friction.threshold":.05},pa=new Set(["null","changestate","selfstate","changeanim","changeanim2","ctrlset","statetypeset","velset","veladd","velmul","posset","posadd","posfreeze","gravity","turn","varset","varadd","varmul","varrandom","varrangeset","parentvarset","parentvaradd","lifeadd","lifeset","poweradd","powerset","hitvelset","hitdef","hitby","nothitby","hitoverride","sprpriority","width","screenbound","playerpush","assertspecial","assertinput","playsnd","stopsnd","sndpan","envshake","palfx","allpalfx","bgpalfx","explod","modifyexplod","removeexplod","explodbindtime","targetbind","targetfacing","targetlifeadd","targetpoweradd","targetvelset","targetveladd","targetstate","targetdrop","bindtoroot","bindtoparent","bindtotarget","attackmulset","defencemulset","hitadd","hitcount","hitfallset","hitfallvel","hitfallDamage".toLowerCase(),"angleadd","angleset","anglemul","angledraw","offset","destroyself","helper","projectile","pause","superpause","afterimage","afterimagetime","trans","movehitreset","attackdist","reversaldef","envcolor","fallenvshake","remappal","makedust","gamemakeanim","forcefeedback","displaytoclipboard","appendtoclipboard","clearclipboard","victoryquote","mapset","mapadd"]);new Set(pa);const Ia=new Set(["time","stateno","prevstateno","anim","animelem","animtime","ctrl","statetype","movetype","physics","life","lifemax","power","powermax","facing","alive","gametime","hitpausetime","hitshakeover","hitover","movecontact","movehit","moveguarded","movereversed","hitcount","uniqhitcount","numhelper","numexplod","numtarget","numenemy","numpartner","ishelper","roundstate","roundno","matchno","teamside","teampower","tickspersecond","ailevel","palno","id","name","authorname","numproj","win","lose","drawgame","inguarddist","canrecover","pos x","pos y","vel x","vel y","screenpos x","screenpos y","command","const","const240p","const480p","const720p","random","animexist","selfanimexist","animelemtime","animelemno","gethitvar","playeridexist","p2name","p2life","p2stateno","p2statetype","p2movetype","p2bodydist x","p2dist x","p2bodydist y","p2dist y","hitdefattr","roundsexisted","camerapos x","camerapos y","hitfall","hitvel x","hitvel y","frontedgedist","backedgedist","frontedgebodydist","backedgebodydist","var","fvar","sysvar","sysfvar"]);Ia.add("teammode");Ia.add("map");Ia.add("ishometeam");for(const n of["p1name","p3name","p4name","frontedge","backedge","const240p","const480p","const720p"])Ia.add(n);const cp=new Set(["playsnd","stopsnd","sndpan","envshake","envcolor","palfx","allpalfx","bgpalfx","afterimage","afterimagetime"]),Ya=n=>kn(n).replaceAll("\\","/").toLowerCase().replace(/^\.\//,""),kn=n=>String(n??"").replace(/^"(.*)"$/,"$1"),Ka=an,La=new Map;for(const n of["attackdist","attackmulset","changeanim","changeanim2","changestate","selfstate","ctrlset","defencemulset","hitadd","lifeadd","lifeset","playerpush","playsnd","poweradd","powerset","targetfacing","targetlifeadd","targetpoweradd","targetstate"])La.set(n,["value"]);for(const[n,e]of Object.entries({afterimagetime:["time"],assertspecial:["flag"],assertinput:["flag"],displaytoclipboard:["text"],appendtoclipboard:["text"],envshake:["time"],explod:["anim"],hitdef:["attr"],pause:["time"],reversaldef:["reversal.attr"],sndpan:["channel"],stopsnd:["channel"],trans:["trans"],varrandom:["v"]}))La.set(n,e);const Za=new WeakMap;for(const n of["mapset","mapadd"])La.set(n,["map","value"]);function Js(n){var i;if(Za.has(n))return Za.get(n);const e={ignorehitpause:0,persistent:1,groups:new Map,errors:[],warnings:[]};for(const s of La.get(n.type)||[])n.values[s]===void 0&&e.errors.push({line:n.line,message:`${n.type} requires ${s}.`});["varset","varadd","varmul","parentvarset","parentvaradd"].includes(n.type)&&!n.entries.some(s=>/^(?:var|fvar|sysvar|sysfvar)\s*\(/.test(s.key))&&(n.values.v===void 0&&n.values.fv===void 0&&e.errors.push({line:n.line,message:`${n.type} requires v or fv (or alternate variable assignment syntax).`}),n.values.value===void 0&&e.errors.push({line:n.line,message:`${n.type} requires value.`})),n.type==="varrangeset"&&n.values.value===void 0&&n.values.fvalue===void 0&&e.errors.push({line:n.line,message:"VarRangeSet requires value or fvalue."}),n.type==="sndpan"&&n.values.pan===void 0&&n.values.abspan===void 0&&e.errors.push({line:n.line,message:"SndPan requires pan or abspan."});for(const s of["ignorehitpause","persistent"])if(n.values[s]!==void 0){if(s==="ignorehitpause"&&n.language==="zss"&&n.type==="explod")continue;const r=n.values[s],a=Number(r);!/^[+-]?\d+$/.test(r)||!Number.isSafeInteger(a)||a<-2147483648||a>2147483647||s==="persistent"&&a<0?e.errors.push({line:((i=n.entries.find(o=>o.key===s))==null?void 0:i.line)||n.line,message:`${s} requires ${s==="persistent"?"a nonnegative":"a signed 32-bit"} integer constant; expressions are not allowed.`}):e[s]=a}for(const s of n.entries){const r=/^trigger([1-9]\d*)$/.exec(s.key);if(r){const a=Number(r[1]);e.groups.has(a)||e.groups.set(a,[]),e.groups.get(a).push(s)}}e.groups.has(1)||e.errors.push({line:n.line,message:"A state controller requires at least one trigger1."});let t=1;for(;e.groups.has(t);)t++;for(const[s,r]of e.groups)s>=t&&(e.groups.delete(s),e.warnings.push({line:r[0].line,message:`trigger${s} is ignored because trigger${t} is missing.`}));return Za.set(n,e),e}const hp=new Map(Object.entries({time:"time",stateno:"stateNo",prevstateno:"prevStateNo",anim:"scriptAnim",animtime:"animTime",ctrl:"ctrl",statetype:"stateType",movetype:"moveType",physics:"physics",life:"life",lifemax:"maxLife",power:"power",powermax:"maxPower",facing:"facing",hitpausetime:"hitPauseTime",movecontact:"moveContact",movehit:"moveHit",moveguarded:"moveGuarded",hitcount:"hitCount",uniqhitcount:"uniqHitCount",id:"id",name:"name"}));function Bu(n,{commonText:e="",constantDefaults:t={},constantsFromCnsOnly:i=!1}={}){var v,y,A,R;const s={states:new Map,constants:new Map(Object.entries({...lp,...t})),quotes:new Map,functions:new Map,initialMaps:new Map,zssExpressions:new Set,diagnostics:[],sources:[],controllerTypes:new Set},r=[];e&&r.push(["<common states>",e]);const a=n.files||{},o=((v=n.path)==null?void 0:v.slice(0,n.path.lastIndexOf("/")+1))||"",l=S=>{const M=Ya(S),g=o.lastIndexOf("/chars/"),x=g<0?"":o.slice(0,g+1),P=(n.checks||[]).find(I=>I.ok&&I.path&&Ya(I.value||"")===M&&a[I.path]),T=[P==null?void 0:P.path,o+M,M,x+"data/"+M,"data/"+M];return T.find(I=>I&&a[I])||T.filter(Boolean).map(I=>I+".zss").find(I=>a[I])},c=((y=n.def)==null?void 0:y.files)||{},h=c.cns?l(c.cns):(A=(n.checks||[]).find(S=>S.key==="cns"&&S.ok))==null?void 0:A.path,f=c.stcommon&&l(c.stcommon);f?r.push([f,Ka(a[f])]):c.stcommon&&Ya(c.stcommon).split("/").at(-1)!=="common1.cns"&&s.diagnostics.push({source:n.path,line:0,type:"missing-file",message:`Common state file not found: ${c.stcommon}`});const u=new Set;for(const[S,M]of Object.entries(c)){if(!/^(cns|cmd|st\d*)$/.test(S)||!M)continue;const g=l(M);g&&!u.has(g)?(u.add(g),r.push([g,Ka(a[g])])):g||s.diagnostics.push({source:n.path,line:0,type:"missing-file",message:`${S}: ${M}`})}for(const S of n.checks||[])/^(cns|cmd|st\d*)$/.test(S.key)&&S.ok&&a[S.path]&&!u.has(S.path)&&(u.add(S.path),r.push([S.path,Ka(a[S.path])]));let d=0,p=0;const _=S=>da(S,{resolve:(M,g)=>{if(M!=="const"||!s.constants.has(String(g[0]).toLowerCase()))throw Error("State identifiers must use known numeric constants.");return s.constants.get(String(g[0]).toLowerCase())}});for(const[S,M]of Object.entries(((R=n.def)==null?void 0:R.map)||{}))try{const g=Math.fround(_(M));if(!Number.isFinite(g)||s.initialMaps.size>=4096)throw Error("Invalid or excessive initial named maps.");s.initialMaps.set(S.toLowerCase(),g)}catch(g){s.diagnostics.push({source:n.path,line:0,type:"constant",message:g.message})}const m=new Map;for(const[S,M]of r){if(/\.zss$/i.test(S)||!/^\s*\[\s*(?:constants|map)\s*\]/im.test(M))continue;const g=zo(M,S);m.set(S,g);for(const x of g)if(x.name==="constants"||x.name==="map")for(const P of x.entries)try{const T=Math.fround(_(P.value));if(!Number.isFinite(T))throw Error("Expected a finite float32 value.");if(x.name==="map"&&s.initialMaps.size>=4096&&!s.initialMaps.has(P.key))throw Error("Initial named map limit exceeded.");(x.name==="map"?s.initialMaps:s.constants).set(P.key,T)}catch(T){s.diagnostics.push({source:S,line:P.line,type:"constant",message:T.message})}}for(const[S,M]of r){if(s.sources.push(S),/\.zss$/i.test(S)){try{const x=np(M,S),P=new Map(s.functions),T=new Map(s.states),I=[],U=[...x.functions.map(D=>({value:D,isFunction:!0})),...x.states.map(D=>({value:D,isFunction:!1}))].sort((D,w)=>D.value.line-w.value.line);for(const{value:D,isFunction:w}of U){const O=w?D.body:D.zssNodes;if(Ou(O,B=>{if(++p>1e5)throw new On("Combined ZSS statement limit (100,000) exceeded.",S,B.line);if(B.kind==="call"){const z=P.get(B.name);if(!z)throw new On(`Function ${B.name} must be defined before its caller.`,S,B.line);if(B.args.length!==z.args.length||B.outputs&&B.outputs.length!==z.outputs.length)throw new On(`Function ${B.name} argument/return count mismatch.`,S,B.line);B.function=z}B.controller&&(B.controller.id=++d,B.controller.state=w?D.name:D.idExpression,I.push(B.controller),w||D.controllers.push(B.controller))}),w)P.set(D.name,D);else{const B=_(D.idExpression);if(!Number.isInteger(B)||B<-2147483648||B>2147483647)throw new On("State number must be a signed 32-bit integer constant.",S,D.line);if(B===-4||D.idExpression.replace(/\s/g,"")==="+1")throw new On("Extended global states -4/+1 are not scheduled by this preview.",S,D.line);D.id=B,T.set(B,D);const z=new Set(["type","movetype","physics","anim","velset","ctrl","poweradd","facep2","hitdefpersist","movehitpersist","hitcountpersist","sprpriority","juggle"]);for(const L of D.entries)z.has(L.key)||s.diagnostics.push({source:S,line:L.line,type:"unsupported-state-parameter",message:`Statedef parameter ${L.key} is not implemented.`})}}s.functions=P,s.states=T;for(const D of x.expressions)s.zssExpressions.add(D);for(const D of I){s.controllerTypes.add(D.type);const w=Js(D);for(const O of w.errors)s.diagnostics.push({source:S,line:O.line,type:"controller-parameter",fatal:!0,message:O.message});pa.has(D.type)||s.diagnostics.push({source:S,line:D.line,type:"unsupported-controller",name:D.type,message:`Controller ${D.type} is not implemented.`})}}catch(x){s.diagnostics.push({source:S,line:x.line||1,type:"zss-compile",fatal:!0,message:x.message})}continue}if(/\.lua$/i.test(S)){s.diagnostics.push({source:S,line:1,type:"script-language",fatal:!0,message:"Lua character-state execution is not implemented."});continue}let g;for(const x of m.get(S)||zo(M,S)){const P=x.name.match(/^statedef\s+(-?\d+)\s*$/);if(P){g={id:+P[1],...x,controllers:[]},s.states.set(g.id,g);const T=new Set(["type","movetype","physics","anim","velset","ctrl","poweradd","facep2","hitdefpersist","movehitpersist","hitcountpersist","sprpriority","juggle"]);for(const I of x.entries)T.has(I.key)||s.diagnostics.push({source:S,line:I.line,type:"unsupported-state-parameter",message:`Statedef parameter ${I.key} is not implemented.`})}else if(/^state(?:\s|$)/.test(x.name)){if(!g){s.diagnostics.push({source:S,line:x.line,type:"parse",message:"State controller has no preceding Statedef."});continue}const T=kn(x.values.type||"").toLowerCase(),I={...x,id:++d,type:T,state:g.id};g.controllers.push(I),s.controllerTypes.add(T);const U=Js(I);for(const[D,w]of[["controller-parameter",U.errors],["trigger-numbering",U.warnings]])for(const O of w)s.diagnostics.push({source:S,line:O.line,type:D,message:O.message});pa.has(T)||s.diagnostics.push({source:S,line:x.line,type:"unsupported-controller",name:T||"(missing type)",message:`Controller ${T||"(missing type)"} is not implemented.`})}else if(x.name==="quotes")for(const T of x.entries){const I=/^victory(\d{1,2})$/.exec(T.key);if(I)try{s.quotes.set(+I[1],Pu(T.value))}catch(U){s.diagnostics.push({source:S,line:T.line,type:"quote",message:U.message})}}else if(/^(data|size|velocity|movement)$/.test(x.name)){if(i&&S!==h)continue;for(const T of x.entries){const I=`${x.name}.${T.key}`,U=T.value.split(",").map(D=>Number(D.trim()));U.some(D=>!Number.isFinite(D))||(s.constants.set(I,U.length===1?U[0]:U),(U.length>1||x.name==="velocity")&&(s.constants.set(I+".x",U[0]),U.length>1&&s.constants.set(I+".y",U[1])),I==="velocity.jump.neu"&&U.length>1&&s.constants.set("velocity.jump.y",U[1]),I==="velocity.airjump.neu"&&U.length>1&&s.constants.set("velocity.airjump.y",U[1]))}}}}return s}const Zt=n=>{const e=Number(n);if(!Number.isFinite(e))throw new Error(`Expected finite number, received ${String(n)}`);return e},ht=n=>Math.trunc(Zt(n)),Wt=n=>typeof n=="number"&&Number.isFinite(n)&&n!==0,li=(n,e,t)=>Math.min(t,Math.max(e,n));class ma{constructor(e,t={}){var s,r,a,o,l;this.character=e,this.options=t,this.program=t.program||Bu(e,t),this.animations=new Map((e.animations||[]).map(c=>[c.id,c])),this.diagnostics=[...this.program.diagnostics],this._diagnosticKeys=new Set(this.diagnostics.map(c=>`${c.source}:${c.line}:${c.type}:${c.message}`)),this._seed=t.seed??439041101,this.id=t.id??1,this.name=((r=(s=e.def)==null?void 0:s.info)==null?void 0:r.name)||"Character";const i=(((o=(a=e.def)==null?void 0:a.info)==null?void 0:o.localcoord)||"320,240").split(",").map(Number);this.localcoord={x:i[0]||320,y:i[1]||240},this.coordinateScale=320/this.localcoord.x,this.baseCoordinateScale=this.coordinateScale,this.world=t.world||null,this.parent=t.parent||null,this.root=t.root||this,this.helperId=t.helperId??0,this.keyCtrl=t.keyCtrl??!this.parent,this.ownPal=t.ownPal??!1,this.teamSide=t.teamSide??((l=this.root.options)==null?void 0:l.teamSide)??1,this.commonAnimations=t.commonAnimations||new Map,this.reset()}reset(){var e,t,i;this.vars=new Int32Array(60),this.fvars=new Float32Array(40),this.stateOwner=this,this.animationOwner=this,this.destroyed=!1,this.coordinateScale=this.baseCoordinateScale,this._scriptOwner=null,this.sysvars=new Int32Array(5),this.sysfvars=new Float32Array(5),this.maxLife=this.constant("data.life"),this.life=this.maxLife,this.maxPower=this.constant("data.power"),this._power=0,this.parent||(this.power=0),this.pos={x:((e=this.options.position)==null?void 0:e.x)||0,y:((t=this.options.position)==null?void 0:t.y)||0},this.vel={x:0,y:0},this.facing=this.options.facing===-1?-1:1,this.ctrl=1,this.stateType="S",this.moveType="I",this.physics="S",this.stateNo=0,this.prevStateNo=0,this.time=0,this.gameTime=0,this.anim=0,this.frameIndex=0,this.frameTime=0,this.animationTime=0,this.animationCycleTime=0,this.animationLooped=!1,this.animationEnded=!1,this._animationSerial=0,this._pausedAnimation=null,this._inPausedAnimation=!1,this._animationLoopReset=!1,this.collisionFrame=null,this.collisionAnimationOwner=null,this.collisionAnimation=null,this.collisionFrameIndex=0,this.collisionFrameTime=0,this.hitDef=null,this.reversalDef=null,this.moveReversed=0,this._hitSerial=0,this.hitPauseTime=0,this.hitTime=-1,this.hitId=-1,this.hitSourceId=void 0,this._spentHitDefs=new WeakSet,this.inGuardDistance=!1,this._projectileContactShield=!1,this.moveContact=0,this.moveHit=0,this.moveGuarded=0,this.hitCount=0,this.uniqHitCount=0,this.comboHits=0,this._lastHitCountTick=null,this.getHitVars=Yf(this),this._fallXVelocityDefined=!1,this._fallDefenceMultiplier=1,this._previousInput=new Set,this.rawInput=new Set,this._fallEntry=-1,this.targets=[],this.targetHitIds=new Map,this.helpers=[],this.explods=[],this.drawExplods=[],this.events=[],this.commands=new Set,this.asserted=new Set,this.opponent=null,this.pendingAssertedInputs=new Set,this.maps=new Map(this.program.initialMaps||[]),this._zssContext=null,this._zssSteps=0,this._pendingStateEntry=null,this._pendingHitTransform=null,this.attackMultiplier=1,this.defenceMultiplier=1,this.sprPriority=0,this.angle=0,this.drawScale={x:1,y:1},this.drawOffset={x:0,y:0},this.playerPush=!this.parent,this.screenBound=!this.parent,this.moveCamera={x:!this.parent,y:!this.parent},this.posFrozen=!1,this.width=null,this._previousWidth=null,this.hitFilters=[null,null],this.hitOverrides=new Map,this.bound=null,this._controllerCounts=new Map,this._entrySerial=0,this.pauseMoveTime=this.options.pauseMoveTime||0,this.superMoveTime=this.options.superMoveTime||0,this.projectileHistory=[],this.trans=null,this.angleDraw=!1,this.juggleCost=0,this._juggleSerial=0,this._paletteRemaps=new Map,this.paletteNo=Math.max(1,Math.min(256,Math.trunc(this.options.paletteNo??((i=this.parent)==null?void 0:i.paletteNo)??1))),this.paletteNo!==1&&this._paletteRemaps.set("1,1",[1,this.paletteNo]),this._initializing=!1,this.aiLevel=this.parent?this.root.aiLevel:Math.max(0,Math.min(8,Math.trunc(Number.isFinite(Number(this.options.aiLevel))?Number(this.options.aiLevel):0))),this.clipboard="",this.victoryQuoteIndex=-1,this.victoryQuote=null,this._dustTicks=new Map,this.cornerPush=0,this.cornerPushTarget=null,this.cornerPushSide=0,this._previousUp=!1,this.airJumps=0,this._changeCount=0,this._executing=null,this.attackDist=void 0,this.changeState(0),this.events=[]}diagnostic(e,t,i=this._executing){const s={source:(i==null?void 0:i.source)||this.character.path||"<character>",line:(i==null?void 0:i.line)||0,type:e,message:t};i&&(s.controller=i.type,s.state=i.state);const r=`${s.source}:${s.line}:${s.type}:${s.message}`;return this._diagnosticKeys.has(r)||(this._diagnosticKeys.add(r),this.diagnostics.push(s)),s}constant(e,t=this.coordinateScale){if(e=String(e).toLowerCase(),e==="data.fall.defence_mul")return 100/(100+this.constant("data.fall.defence_up",t));if(!this.program.constants.has(e))throw new Error(`Unknown character constant: ${e}`);const i=this.program.constants.get(e);return(Array.isArray(i)?i[0]:i)*(Pc(e)?this.baseCoordinateScale/t:1)}get animation(){return(this.animationOwner||this).animations.get(this.anim)}get scriptAnimationClock(){var e;return!this._inPausedAnimation&&((e=this._pausedAnimation)==null?void 0:e.logic)||this}get scriptAnim(){return this.scriptAnimationClock.anim}get scriptAnimation(){const e=this.scriptAnimationClock;return(e.animationOwner||this).animations.get(e.anim)}get currentFrame(){var e;return((e=this.animation)==null?void 0:e.frames[this.frameIndex])||null}get animElemTime(){return this.frameTime}get animTime(){return tp(this.scriptAnimation,this.scriptAnimationClock)}get alive(){return this.life>0}get paletteRemaps(){return this.parent&&!this.ownPal?this.parent.paletteRemaps:this._paletteRemaps}ownedHelpers(){return this.world?this.world.entities.filter(e=>e.parent&&!e.destroyed&&(this===this.root?e.root===this:e.parent===this)):this.helpers.filter(e=>!e.destroyed)}get power(){return this.parent?this.root.power:this._power}set power(e){this.parent?this.root.power=e:this._power=e}evaluate(e,t=this._executing,i=!1){try{return(this.options.expressionEvaluator||(i?Oo:da))(e,{resolve:(s,r=[],a=null)=>{var o;if(s==="zsslocal"){const l=(o=this._zssContext)==null?void 0:o.locals.get(String(r[0]));if(!l)throw new ji(`ZSS local ${r[0]} is unavailable.`);if(l.bottom)throw l.error;return l}return this.resolveTrigger(s,r,a)},assign:(s,r,a)=>this.assignVariable(s,r,a),onWarning:s=>{s.bottom||this.diagnostic("expression-warning",`${e}: ${s.message}`,t)},typedResult:i})}catch(s){throw s.bottom||this.diagnostic("expression",`${e}: ${s.message}`,t),s}}variableArray(e){const t={var:this.vars,fvar:this.fvars,sysvar:this.sysvars,sysfvar:this.sysfvars};if(!t[e])throw new Error(`Unsupported assignable variable: ${e}`);return t[e]}assignVariable(e,t,i){const s=this.variableArray(e.toLowerCase()),r=ht(t[0]);if(r<0||r>=s.length)throw new Lt(`${e} index out of range: ${r}`);return s[r]=Zt(i),s[r]}setMap(e,t,i=!1){if(e=String(e).toLowerCase(),!e||e.length>128||e.includes("\0"))throw Error("Invalid map name.");if(!this.maps.has(e)&&this.maps.size>=4096)throw Error("Named map limit (4,096) exceeded.");const s=Math.fround(Zt(t)+(i&&this.maps.get(e)||0));if(!Number.isFinite(s))throw new Lt("Map value is not finite.");return this.maps.set(e,s),s}resolveTrigger(e,t=[],i=null,s=this.coordinateScale){var u,d,p,_,m,v,y,A,R,S,M,g,x,P,T,I,U,D,w,O,B,z,L,C,H,W,K,Q,G,j,re,le,ae,Ie,it,Ee,De;if(e=e.toLowerCase(),i){let se;const _e=i.name.toLowerCase();if(["enemynear","enemy","p2"].includes(_e)){const Ce=(((u=this.world)==null?void 0:u.entities)||[this.opponent]).filter(st=>st&&!st.destroyed&&!st.parent&&st.teamSide!==this.teamSide);_e==="enemynear"&&Ce.sort((st,kt)=>Math.abs(st.pos.x-this.pos.x)-Math.abs(kt.pos.x-this.pos.x)),se=Ce[Math.trunc(i.args[0]||0)]}else if(_e==="root")se=this.root||this;else if(_e==="parent")se=this.parent;else if(_e==="partner")se=(((d=this.world)==null?void 0:d.entities)||[]).filter(Ce=>!Ce.parent&&Ce!==this.root&&Ce.teamSide===this.teamSide)[Math.trunc(i.args[0]||0)];else if(_e==="helper")se=this.ownedHelpers().find(Ce=>!i.args.length||Ce.helperId===+i.args[0]);else if(_e==="target")se=this.targets.find(Ce=>!i.args.length||(this.targetHitIds.get(Ce.id)??Ce.hitId)===+i.args[0]);else if(_e==="playerid")se=((p=this.world)==null?void 0:p.findPlayer(+i.args[0]))||[this,this.opponent,...this.helpers].find(Ce=>(Ce==null?void 0:Ce.id)===+i.args[0]);else throw new Error(`Unsupported redirection: ${_e}`);if(!se||se.destroyed){const Ce=new Error(`Redirection ${_e} has no matching player`);throw Ce.bottom=!0,Ce}return se.resolveTrigger(e,t,null,s)}if(["var","fvar","sysvar","sysfvar"].includes(e)){const se=this.variableArray(e),_e=ht(t[0]);if(_e<0||_e>=se.length)throw new Lt(`${e} index out of range: ${_e}`);return se[_e]}const r=hp.get(e);if(r)return this[r];if(e==="map")return{value:this.maps.get(String(t[0]).toLowerCase())||0,float:!0};if(e==="command")return+this.commands.has(String(t[0]));if(e==="const")return this.constant(t[0],s);if(e==="const240p")return Zt(t[0])/this.coordinateScale;if(e==="const480p")return Zt(t[0])/(2*this.coordinateScale);if(e==="const720p")return Zt(t[0])/(4*this.coordinateScale);if(e==="random")return this._seed^=this._seed<<13,this._seed^=this._seed>>>17,this._seed^=this._seed<<5,(this._seed>>>0)%1e3;if(e==="animexist"||e==="selfanimexist")return+(e==="selfanimexist"?this:this.scriptAnimationClock.animationOwner).animations.has(ht(t[0]));if(e==="animelemtime")return Qf(this.scriptAnimation,this.scriptAnimationClock,ht(t[0]));if(e==="animelemno")return ep(this.scriptAnimation,this.scriptAnimationClock,Zt(t[0]||0));if(e==="gethitvar"){const se=String(t[0]).toLowerCase();if(se==="isbound")return+(!!this.bound&&!this.bound.target.destroyed);if(se==="hittime")return this.hitTime;if(se==="hitshaketime")return(_=this.world)!=null&&_.orderedPhases?this.getHitVars.hitshaketime||0:this.hitPauseTime;if(se in this.getHitVars)return this.getHitVars[se]*(Nu.has(se)?this.coordinateScale/s:1);if(qf.has(se))return 0;throw new Error(`Unsupported GetHitVar field: ${se}`)}if(e==="inguarddist")return+(this.world?this.inGuardDistance||!1:Eu(this,this.opponent?[this.opponent]:[]));const a=this.opponent,o=(m=this.world)==null?void 0:m.roundFlow,l=this.root===((v=this.world)==null?void 0:v.player)?"player":"opponent",c=!!(o!=null&&o.roundWinner)&&o.roundWinner===l,h=!!(o!=null&&o.roundWinner)&&o.roundWinner!=="draw"&&!c,f={animelem:this.scriptAnimationClock.frameIndex+1,alive:+this.alive,gametime:((y=this.world)==null?void 0:y.ticks)??this.gameTime,hitshakeover:+(((A=this.world)!=null&&A.orderedPhases?this.getHitVars.hitshaketime||0:this.hitPauseTime)===0),hitover:+(this.hitTime<0),movereversed:this.moveReversed||0,numhelper:this.ownedHelpers().length,numexplod:this.explods.length,numtarget:this.targets.length,numenemy:a?1:0,numpartner:0,ishelper:+!!this.parent,roundstate:this.roundState??2,roundsexisted:this.roundsExisted??0,roundno:this.roundNo??1,matchno:this.matchNo??1,matchover:+!!((R=this.world)!=null&&R.matchOver),teamside:this.teamSide??this.id,teampower:this.power,tickspersecond:60,aiLevel:this.aiLevel||0,ailevel:this.aiLevel||0,palno:this.paletteNo||1,teammode:"single",ishometeam:+(this.teamSide===1),authorname:((M=(S=this.character.def)==null?void 0:S.info)==null?void 0:M.author)||"",numproj:(((g=this.world)==null?void 0:g.projectiles)||[]).filter(se=>se.owner===this&&!se.removing&&!se.removed).length,win:o?+c:+(this.roundState===4&&this.alive&&(a==null?void 0:a.life)<=0),lose:o?+h:+(this.roundState===4&&!this.alive),drawgame:o?+(o.roundWinner==="draw"):+(this.roundState===4&&!this.alive&&(a==null?void 0:a.life)<=0),winko:+(c&&o.reason!=="time"),wintime:+(c&&o.reason==="time"),winperfect:+(c&&this.life===this.maxLife),loseko:+(h&&o.reason!=="time"),losetime:+(h&&o.reason==="time"),loseperfect:+(h&&(a==null?void 0:a.life)===(a==null?void 0:a.maxLife)),camerazoom:this.cameraZoom??1,gamewidth:(((x=this.world)==null?void 0:x.view.width)??320)/s,gameheight:(((P=this.world)==null?void 0:P.view.height)??240)/s,screenwidth:320/s,screenheight:(((T=this.world)==null?void 0:T.view.displayHeight)??240)/s,leftedge:(((I=this.world)==null?void 0:I.view.left)??-160)/s,rightedge:(((U=this.world)==null?void 0:U.view.right)??160)/s,topedge:(((D=this.world)==null?void 0:D.view.top)??-240)/s,bottomedge:(((w=this.world)==null?void 0:w.view.bottom)??0)/s,frontedge:(this.facing===1?((O=this.world)==null?void 0:O.view.right)??160:((B=this.world)==null?void 0:B.view.left)??-160)/s,backedge:(this.facing===1?((z=this.world)==null?void 0:z.view.left)??-160:((L=this.world)==null?void 0:L.view.right)??160)/s,canrecover:+(!!this.getHitVars.fall&&this.getHitVars["fall.recover"]!==0&&(this.getHitVars["fall.time"]||0)>=(this.getHitVars["fall.recovertime"]??4)),hitfall:this.getHitVars.fall||0,"hitvel x":(this.getHitVars.xvel||0)*this.coordinateScale/s,"hitvel y":(this.getHitVars.yvel||0)*this.coordinateScale/s,"pos x":(this.pos.x-(((C=this.cameraPos)==null?void 0:C.x)||0))/s,"pos y":this.pos.y/s,"vel x":this.vel.x/s,"vel y":this.vel.y/s,"screenpos x":(this.pos.x-(((H=this.world)==null?void 0:H.view.left)??-160))/s,"screenpos y":(this.pos.y-(((W=this.world)==null?void 0:W.view.top)??-240))/s,"camerapos x":(((K=this.cameraPos)==null?void 0:K.x)||0)/s,"camerapos y":(((Q=this.cameraPos)==null?void 0:Q.y)||0)/s};if(e==="stagevar"){if(!((G=this.world)!=null&&G.stage))throw Error("StageVar requires an imported stage.");return this.world.stage.variable(t[0])}if(e==="ishelper"&&t.length)return+(!!this.parent&&this.helperId===+t[0]);if(e==="numprojid")return(((j=this.world)==null?void 0:j.projectiles)||[]).filter(se=>se.owner===this&&!se.removing&&!se.removed&&se.projId===Math.max(0,Math.trunc(+t[0]))).length;if(/^proj(contact|hit|guarded|cancel)time$/.test(e)){const se=e.slice(4,-4),_e=Math.max(0,+t[0]||0),Ce=this.projectileHistory.at(-1);return Ce&&(!_e||Ce.projId===_e)&&(se==="contact"?["hit","guarded"].includes(Ce.type):Ce.type===se)?(((re=this.world)==null?void 0:re.ticks)??this.gameTime)-Ce.tick:-1}if(/^(parentdist|rootdist) [xy]$/.test(e)){const se=this.parent?e.startsWith("parent")?this.parent:this.root:null;if(!se||se.destroyed||e.startsWith("parent")&&!se.alive){const Ce=Error("No live parent or root");throw Ce.bottom=!0,Ce}const _e=e.at(-1);return(se.pos[_e]-this.pos[_e])*(_e==="x"?this.facing:1)/s}if(e==="numexplod"&&t.length)return this.explods.filter(se=>se.id===+t[0]).length;if(e==="numhelper"&&t.length)return this.ownedHelpers().filter(se=>+t[0]<=0||se.helperId===+t[0]).length;if(e==="numtarget"&&t.length)return this.targets.filter(se=>!se.destroyed&&(+t[0]<0||(this.targetHitIds.get(se.id)??se.hitId)===+t[0])).length;if(e==="playeridexist")return+((le=this.world)!=null&&le.findPlayer(+t[0])||[this,a,...this.helpers].find(se=>(se==null?void 0:se.id)===+t[0]&&!se.destroyed)?1:0);if(["frontedgedist","backedgedist","frontedgebodydist","backedgebodydist"].includes(e)){const se=e.startsWith("front"),_e=this.facing*(se?1:-1);if((ae=this.world)!=null&&ae.orderedPhases)return Vf(this,_e,{body:e.includes("body"),scale:s});const Ce=_e>0?((Ie=this.world)==null?void 0:Ie.view.right)??this.options.rightBound??160:((it=this.world)==null?void 0:it.view.left)??this.options.leftBound??-160;let st=(_e>0?Ce-this.pos.x:this.pos.x-Ce)/s;return e.includes("body")&&(st-=sa(this,_e,{edge:!0})/s),st}if(e==="p1name")return this.name;if(["p2name","p3name","p4name"].includes(e)){const se=(((Ee=this.world)==null?void 0:Ee.entities)||[this,a]).filter(Ce=>Ce&&!Ce.destroyed&&!Ce.parent),_e=e==="p2name"?a:e==="p3name"?se.find(Ce=>Ce!==this.root&&Ce.teamSide===this.teamSide):se.filter(Ce=>Ce.teamSide!==this.teamSide)[1];return(_e==null?void 0:_e.name)??{absent:!0}}if(["p2life","p2stateno","p2statetype","p2movetype","p2bodydist x","p2dist x","p2bodydist y","p2dist y"].includes(e)&&!a)throw new Lt(`${e}: P2 does not exist.`);if(e==="p2life")return a.life;if(e==="p2stateno")return a.stateNo;if(e==="p2statetype")return a.stateType;if(e==="p2movetype")return a.moveType;if(e==="p2bodydist x"||e==="p2dist x"){if(!a)return 0;let se=(a.pos.x-this.pos.x)*this.facing/s;if(e==="p2bodydist x"){const _e=se>=0;se-=sa(this,this.facing)/s+(_e?1:-1)*sa(a,_e?-this.facing:this.facing)/s}return se}if(e==="p2bodydist y"||e==="p2dist y")return a?(a.pos.y-this.pos.y)/s:0;if(e==="hitdefattr")return this.moveType!=="A"||!((De=this.hitDef)!=null&&De.attr)?0:+$a(t.map(String).join(","),this.hitDef.attr);if(Object.hasOwn(f,e))return f[e];throw new ji(`Unsupported trigger: ${e}`)}parameter(e,t=this._executing,i=!1){try{return this.evaluate(e,t,i)}catch(s){if(!s.bottom)throw s;return this.diagnostic("parameter-bottom",`${e}: ${s.message} Parameter set to 0.`,t),i?{value:0,float:!1}:0}}value(e,t,i){var o;const s=e.values[t];if(s===void 0)return i;if((t==="ignorehitpause"||t==="persistent")&&!(t==="ignorehitpause"&&e.language==="zss"&&e.type==="explod")){const l=Js(e);if(l.errors.some(c=>c.message.startsWith(t)))throw Error(l.errors.find(c=>c.message.startsWith(t)).message);return l[t]}let r=(o=this._parameterCache)==null?void 0:o.get(e);if(this._parameterCache&&!r&&this._parameterCache.set(e,r=new Map),r!=null&&r.has(t))return r.get(t);const a=this.parameter(s,e);return r==null||r.set(t,a),a}vector(e,t,i=[0,0]){var o;const s=e.values[t];if(s===void 0)return[...i];let r=(o=this._parameterCache)==null?void 0:o.get(e);if(this._parameterCache&&!r&&this._parameterCache.set(e,r=new Map),r!=null&&r.has(t))return[...r.get(t)];const a=Zi(s).map(l=>Zt(this.parameter(l,e)));return r==null||r.set(t,a),a}text(e,t,i=""){return kn(e.values[t]??i)}changeAnimation(e,t=1,i=this){var o;if(e=ht(e),e<0&&(this.diagnostic("animation-value","Negative animation number; using action 0."),e=0),!i.animations.has(e))return this.diagnostic("missing-animation",`Animation ${e} does not exist.`),!1;const s=i.animations.get(e).frames,r=ht(t)-1,a=r>=0&&r<s.length?r:0;if(this._inPausedAnimation||(this._pausedAnimation=null),this._animationSerial++,this.animationOwner=i,this.anim=e,this.frameIndex=a,this.frameTime=0,this.animationEnded=!1,this.animationTime=((o=nr(i.animations.get(e)))==null?void 0:o.offsets[a])||0,this.animationCycleTime=this.animationTime,this.animationLooped=!1,this._animationLoopReset=!1,this._inPausedAnimation){const l=qa(this);this._pausedAnimation.draw=l,this._pausedAnimation.visible={...l,frameIndex:a-1,frameTime:a>0?Math.max(1,s[a-1].ticks)-1:-1,animationTime:this.animationTime-1,animationCycleTime:this.animationCycleTime-1}}return!0}changeState(e,t,i=this.stateOwner||this){var h,f,u,d;e=ht(e);const s=i.program.states.get(e);if(!s)return this.diagnostic("missing-state",`State ${e} does not exist.`),!1;if((h=this.world)!=null&&h.orderedPhases&&(this.world.contactPhase||this.world.activeActor!==this&&((f=this.world._entities)!=null&&f.includes(this))))return this._pendingStateEntry={number:e,ctrl:t,owner:i,oldState:((u=this._pendingStateEntry)==null?void 0:u.oldState)??this.stateNo,oldOwner:((d=this._pendingStateEntry)==null?void 0:d.oldOwner)??this.stateOwner},this.prevStateNo=this.stateNo,this.stateNo=e,this.stateOwner=i,this.time=0,!0;if(++this._changeCount>64)return this.diagnostic("state-loop","More than 64 state changes in one tick; execution stopped."),!1;const r=this.stateOwner.program.states.get(this.stateNo);this.stateOwner=i,Gf(this,Ft(i)),this.prevStateNo=this.stateNo,this.stateNo=e,this.time=0,t!==void 0&&ht(t)>=0&&(this.ctrl=+Wt(ht(t))),this._entrySerial++,this._controllerCounts.clear();let a=!1,o=!1,l=!1;try{a=Wt(this.value(s,"hitdefpersist",0)),o=Wt(this.value(s,"movehitpersist",0)),l=Wt(this.value(s,"hitcountpersist",0))}catch{}a||(this.hitDef=null,this.reversalDef=null),o||(this.moveContact=0,this.moveHit=0,this.moveGuarded=0,this.moveReversed=0),l||(this.hitCount=0,this.uniqHitCount=0,this._lastHitCountTick=null);const c=this.moveType;this.moveType="I",this._executing=s;try{const p=this.text(s,"type","S").toUpperCase(),_=this.text(s,"physics","N").toUpperCase();if(p!=="U"&&(this.stateType=p),_!=="U"&&(this.physics=_),s.values.movetype){const m=this.text(s,"movetype").toUpperCase();this.moveType=m==="U"?c:m}if(s.values.ctrl!==void 0&&(this.ctrl=+Wt(this.value(s,"ctrl",this.ctrl))),s.values.anim!==void 0){const m=ht(this.value(s,"anim",-1));m!==-1&&this.changeAnimation(m)}if(s.values.velset!==void 0){const[m=0,v=0]=this.vector(s,"velset");this.vel={x:m*this.coordinateScale,y:v*this.coordinateScale}}s.values.sprpriority!==void 0&&(this.sprPriority=ht(this.value(s,"sprpriority",0))),s.values.juggle!==void 0&&(this.juggleCost=Math.max(0,ht(this.value(s,"juggle",0))),this._juggleSerial++),s.values.poweradd!==void 0&&(this.power=li(this.power+this.value(s,"poweradd",0),0,this.maxPower)),Wt(this.value(s,"facep2",0))&&this.opponent&&(this.facing=this.opponent.pos.x>=this.pos.x?1:-1)}catch{}return this._executing=null,this.events.push({type:"state",state:e,previous:r==null?void 0:r.id}),!0}shouldRun(e,t){const i=Js(e);if(i.errors.length||t&&!i.ignorehitpause)return!1;const s=e.entries.filter(c=>c.key==="triggerall");for(const c of s)try{if(!Wt(this.evaluate(c.value,{...e,line:c.line})))return!1}catch{return!1}const r=i.groups;let a=!1;for(const[,c]of[...r].sort(([h],[f])=>h-f)){let h=!0;for(const f of c)try{if(!Wt(this.evaluate(f.value,{...e,line:f.line}))){h=!1;break}}catch{h=!1;break}if(h){a=!0;break}}if(!a)return!1;const o=i.persistent,l=this._controllerCounts.get(e)||0;return this._controllerCounts.set(e,l+1),o===0?l===0:l%o===0}runState(e,t,i=this.stateOwner){const s=i.program.states.get(e);if(!s)return;if(s.zssNodes){op(this,s,i,t);return}const r=this._entrySerial;for(const a of s.controllers){const o=this._scriptOwner;this._scriptOwner=i,this._executing=a;try{this.shouldRun(a,t)&&this.execute(a)}catch(l){this.diagnostics.some(c=>c.message.includes(l.message)&&c.source===a.source)||this.diagnostic("controller",l.message,a)}if(this._executing=null,this._scriptOwner=o,this.destroyed||this._entrySerial!==r)break}}movementHeld(e){var r;if(!((r=this.world)!=null&&r.manageInputs))return this.commands.has(e);const t=this.rawInput,i=this.facing<0?"L":"R",s=this.facing<0?"R":"L";return e==="holdup"?t.has("U")&&!t.has("D"):e==="holddown"?t.has("D")&&!t.has("U"):e==="holdfwd"?t.has(i)&&!t.has(s):e==="holdback"?t.has(s)&&!t.has(i):!1}automaticTransitions(){var r,a,o,l,c,h,f;if(!this.ctrl||this.moveType==="H"||!this.alive||this.stateOwner!==this||this.parent&&!this.keyCtrl||(r=this.world)!=null&&r.roundFlow&&this.world.roundFlow.roundState!==2)return;const e=this.movementHeld("holddown"),t=this.movementHeld("holdup"),i=this.movementHeld("holdfwd")||this.movementHeld("holdback"),s=this.movementHeld("holdback")&&!this.asserted.has("noautoguard")&&!!this.resolveTrigger("inguarddist");if(!(s&&((a=this.world)!=null&&a.orderedPhases)&&[120,130,131,132,140].includes(this.stateNo))){if(s&&![120,130,131,132,140].includes(this.stateNo)){const u=this.stateType==="A"?"noairguard":this.stateType==="C"?"nocrouchguard":"nostandguard",d=(o=this.world)!=null&&o.orderedPhases?120:this.stateType==="A"?132:this.stateType==="C"?131:120;if(!this.asserted.has(u)&&this.program.states.has(d)){this.changeState(d);return}}if(!this.asserted.has("noautoturn")&&((c=(l=this.world)==null?void 0:l.stage)==null?void 0:c.definition.autoturn)!==!1&&this.stateType!=="A"&&this.opponent&&[0,10,11,12,20].includes(this.stateNo)){const u=this.opponent.pos.x>=this.pos.x?1:-1;u!==this.facing&&(this.facing=u)}if(this.stateType==="A"){t&&!this._previousUp&&this.airJumps<this.constant("movement.airjump.num")&&-this.pos.y>=this.constant("movement.airjump.height")&&this.program.states.has(45)&&(this.airJumps++,this.changeState(45));return}if(t&&!this.asserted.has("nojump")&&this.program.states.has(40)){this.changeState(40);return}if(e&&this.stateType==="S"&&!this.asserted.has("nocrouch")&&this.program.states.has(10)){this.changeState(10);return}if(!e&&this.stateType==="C"&&((h=this.world)!=null&&h.orderedPhases||[10,11].includes(this.stateNo))&&this.program.states.has(12)){this.changeState(12);return}!this.asserted.has("nowalk")&&this.stateType==="S"&&this.moveType==="I"&&(i&&((f=this.world)!=null&&f.orderedPhases?this.stateNo!==20&&this.stateNo!==100:this.stateNo===0)&&this.program.states.has(20)?this.changeState(20):!i&&this.stateNo===20&&this.changeState(0))}}tick({commands:e=new Set,opponent:t=null,paused:i=!1,input:s=null}={}){var f;const r=(f=this.world)==null?void 0:f.orderedPhases;i||(this._zssSteps=0);let a=!1;if(r&&!i&&this._pausedAnimation&&(this._pausedAnimation.serial===this._animationSerial?(Uc(this,this._pausedAnimation.logic),a=!0):this._pausedAnimation=null),i||(this._changeCount=0),r&&!i&&this._pendingHitTransform){const u=this._pendingHitTransform;this._pendingHitTransform=null,u.facing!==void 0&&(this.facing=u.facing);for(const d of["x","y"])u[d]!==void 0&&(this.pos[d]=u[d])}const o=this._animationSerial;if(r&&this._pendingStateEntry&&!i){const u=this._pendingStateEntry;this._pendingStateEntry=null,this.stateNo=u.oldState,this.stateOwner=u.oldOwner,this.changeState(u.number,u.ctrl,u.owner)}if(this.events=[],this.commands=e,this.opponent=t,Kf(this,s,e),i||this.destroyed)return this.world||this.updateExplods({forceFrozen:!0}),this.gameTime++,this.events;this._executing=null;const l=this.hitPauseTime>0,c=r&&(this.getHitVars.hitshaketime||0)>0&&this.moveType==="H";if(r)if(l){if(!this._pausedAnimation){const u=qa(this);this._pausedAnimation={visible:u,draw:u,logic:null,serial:this._animationSerial},!a&&o===this._animationSerial&&!c&&this.advanceAnimation()}this._inPausedAnimation=!0}else this._pausedAnimation=null,!a&&o===this._animationSerial&&!c&&this.advanceAnimation();this.asserted=new Set,this.posFrozen=!1,l||(this.playerPush=!this.parent,this.screenBound=!this.parent,this.moveCamera={x:!this.parent,y:!this.parent},this._previousWidth=this.width,this.width=null),this.drawOffset={x:0,y:0},this.drawScale={x:1,y:1},this.trans=null,this.angleDraw=!1,this.moveContact>0&&!l&&this.moveContact++,this.moveHit>0&&!l&&this.moveHit++,this.moveGuarded>0&&!l&&this.moveGuarded++,this.moveReversed>0&&!l&&this.moveReversed++;for(let u=0;u<2;u++){const d=this.hitFilters[u];(d==null?void 0:d.time)>0&&--d.time===0&&(this.hitFilters[u]=null)}for(const[u,d]of this.hitOverrides)d.time>0&&--d.time===0&&this.hitOverrides.delete(u);if(this.parent||(this.stateOwner===this&&this.runState(-3,l,this),this.runState(-2,l,this)),this.keyCtrl&&this.stateOwner===this&&!this._initializing&&this.runState(-1,l,this.parent?this.root:this),this.destroyed)return this.finishPausedAnimation(),this.gameTime++,this.events;!l&&!this._initializing&&this.automaticTransitions(),!l&&this.stateNo===5110&&this.time>=1&&this.alive&&(this.getHitVars.recovertime??1)<=0&&this.stateOwner.program.states.has(5120)&&this.changeState(5120);let h;do h=this._entrySerial,this._initializing&&this.options.skipIntro&&[190,191].includes(this.stateNo)?(this.changeState(0),this.ctrl=1):this.runState(this.stateNo,l);while(h!==this._entrySerial&&this._changeCount<=64);if(this.destroyed)return this.finishPausedAnimation(),this.gameTime++,this.events;if(l||(this._initializing=!1),r&&!l&&this._animationLoopReset&&(this.animationTime=this.animationCycleTime,this._animationLoopReset=!1),this.collisionFrame=this.currentFrame,this.collisionAnimationOwner=this.animationOwner,l)return r&&(this.finishPausedAnimation(),this.syncAnimationFrame(this._pausedAnimation.draw)),Nc(this,{hitPaused:!0}),this.world||this.updateExplods({hitPaused:!0}),this.getHitVars.damage=0,this.hitPauseTime=Math.max(0,this.hitPauseTime-1),this.gameTime++,this.events;if(!this.posFrozen&&!this.bound&&!c&&(this.pos.x+=this.vel.x*this.facing+(r?0:this.cornerPush),this.pos.y+=this.vel.y,r&&(this.pos.x=Math.fround(this.pos.x),this.pos.y=Math.fround(this.pos.y))),r||(this.cornerPush*=li(this.constant("movement.stand.friction"),0,1),Math.abs(this.cornerPush)<.01&&(this.cornerPush=0)),!c&&this.physics==="A")this.vel.y+=(r?Math.fround(this.constant("movement.yaccel")):this.constant("movement.yaccel"))*this.coordinateScale,r&&(this.vel.y=Math.fround(this.vel.y)),this.pos.y>=0&&this.vel.y>0&&!(r&&this.stateNo===105)&&(this.pos.y=0,this.vel.y=0,this.airJumps=0,this.program.states.has(52)&&this.changeState(52));else if(!c&&(this.physics==="S"||this.physics==="C")&&(r||![20,100].includes(this.stateNo))){const u=this.physics==="C"?"crouch":"stand",d=this.constant("movement."+u+".friction");if(this.vel.x*=r?Math.fround(d):d,r&&(this.vel.x=Math.fround(this.vel.x)),r){const p=u==="stand"?1:this.constant("movement.crouch.friction.threshold");Math.abs(this.vel.x)<p*this.coordinateScale&&(this.vel.x=0)}}return this.updateBinding(),this.syncAnimationFrame(),r||this.advanceAnimation(),this.world||this.updateExplods(),c&&(this.getHitVars.hitshaketime=Math.max(0,this.getHitVars.hitshaketime-1)),Nc(this,{hitPaused:r&&(this.getHitVars.hitshaketime||0)>0}),this.getHitVars.damage=0,this.time++,this.gameTime++,this._previousUp=this.movementHeld("holdup"),this.events}finishPausedAnimation(){if(!this._inPausedAnimation)return;const e=this._pausedAnimation;e.logic=qa(this),e.serial=this._animationSerial,this._inPausedAnimation=!1,Uc(this,e.visible)}syncAnimationFrame(e=this){var t;this.collisionAnimationOwner=e.animationOwner,this.collisionAnimation=(e.animationOwner||this).animations.get(e.anim),this.collisionFrame=((t=this.collisionAnimation)==null?void 0:t.frames[e.frameIndex])||null,this.collisionFrameIndex=e.frameIndex,this.collisionFrameTime=e.frameTime}advanceAnimation(){var i,s;const e=this.animation,t=this.currentFrame;if(t){if(t.ticks<0){(i=this.world)!=null&&i.orderedPhases&&(this.frameTime++,this.animationTime++,this.animationCycleTime++);return}this.animationEnded&&(this.animationEnded=!1),this.frameTime++,this.animationTime++,this.animationCycleTime++,this.frameTime>=Math.max(1,t.ticks)&&(this.frameTime=0,this.frameIndex++,this.frameIndex>=e.frames.length&&(this.frameIndex=e.loopStart??e.loopstart??0,this.animationEnded=!0,this.animationLooped=!0,this.animationCycleTime=nr(e).offsets[this.frameIndex]||0,(s=this.world)!=null&&s.orderedPhases&&(this._animationLoopReset=!0)))}}execute(e){const t=Js(e).errors.find(s=>!s.message.includes("trigger1"));if(t)throw Error(t.message);const i=this._parameterCache;this._parameterCache=new WeakMap;try{return this.executeController(e)}finally{this._parameterCache=i}}executeController(e){var o,l,c,h,f,u;const t=e.type,i=(d,p=0)=>Zt(this.value(e,d,p)),s=(d,p=0)=>ht(this.value(e,d,p)),r=(d,p=[0,0])=>this.vector(e,d,p),a=(d,p="")=>this.text(e,d,p);if(!pa.has(t)){this.diagnostic("unsupported-controller",`Controller ${t||"(missing type)"} is not implemented.`,e);return}if(t!=="null"){if(t==="mapset"||t==="mapadd"){this.setMap(a("map"),i("value"),t==="mapadd");return}if(t==="assertinput"){if(!((o=this.world)!=null&&o.manageInputs)){this.diagnostic("unsupported-input-routing","AssertInput needs the independent input scheduler.");return}for(const d of e.entries)if(/^flag\d*$/.test(d.key))for(const p of this.text(e,d.key).split(/[+|\s,]+/).filter(Boolean)){const _={up:"U",down:"D",forward:"F",fwd:"F",back:"B",start:"s"},m=_[p.toLowerCase()]||p;if(!["U","D","F","B","a","b","c","x","y","z","s"].includes(m)){this.diagnostic("unsupported-input",`Input flag ${p} is not implemented.`,e);continue}this.pendingAssertedInputs.add(m)}return}if(["displaytoclipboard","appendtoclipboard","clearclipboard"].includes(t)){if(t==="clearclipboard"){this.clipboard="";return}const d=Pf(e.values.text||""),p=e.values.params===void 0?[]:Zi(e.values.params);if(p.length!==d.count)throw Error(`Clipboard format requires ${d.count} parameters, received ${p.length}.`);const _=Lf(d,p.map(m=>this.parameter(m,e,!0)));this.clipboard=(t==="appendtoclipboard"&&this.clipboard?this.clipboard+`
`+_:_).slice(-8192);return}if(t==="victoryquote"){if(!this.parent){const d=s("value",-1);d!==this.victoryQuoteIndex&&(this.victoryQuote=null),this.victoryQuoteIndex=d}return}if(t==="forcefeedback"){this.events.push({type:t,...Nf(e.values)});return}if(t==="gamemakeanim"||t==="makedust"){if(t==="makedust"){const d=s("spacing",3);if(d<1)throw Error("MakeDust spacing must be at least 1.");const p=this._dustTicks.get(e);if((p==null?void 0:p.entry)===this._entrySerial&&this.gameTime-p.time<d)return;this._dustTicks.set(e,{entry:this._entrySerial,time:this.gameTime}),this.gameAnimation(120,r("pos"),!0,0,e),e.values.pos2!==void 0&&this.gameAnimation(120,r("pos2"),!0,0,e)}else this.gameAnimation(s("value",0),r("pos"),!!i("under"),Math.max(0,s("random")),e);return}if(t==="changestate"||t==="selfstate"){const d=s("value"),p=e.values.ctrl===void 0?void 0:s("ctrl"),_=e.values.anim===void 0?void 0:s("anim"),m=t==="selfstate"?this:this.stateOwner;m.program.states.has(d)&&_!==void 0&&_!==-1&&this.changeAnimation(_),this.changeState(d,p,m);return}if(t==="changeanim"||t==="changeanim2"){this.changeAnimation(s("value"),s("elem",1),t==="changeanim2"?this.stateOwner:this);return}if(t==="ctrlset"){this.ctrl=+Wt(i("value"));return}if(t==="statetypeset"){for(const[d,p]of[["statetype","stateType"],["movetype","moveType"],["physics","physics"]])if(e.values[d]!==void 0){const _=a(d).toUpperCase();_!=="U"&&(this[p]=_)}return}if(/^(vel|pos)(set|add|mul)$/.test(t)){const d=t.startsWith("vel")?this.vel:this.pos,p=t.slice(3);for(const _ of["x","y"])if(e.values[_]!==void 0){const m=i(_)*(p==="mul"?1:this.coordinateScale);p==="set"?d[_]=m+(t==="posset"&&_==="x"&&((l=this.cameraPos)==null?void 0:l.x)||0):p==="add"?d[_]+=m*(t==="posadd"&&_==="x"?this.facing:1):d[_]*=m,(c=this.world)!=null&&c.orderedPhases&&(d[_]=Math.fround(d[_]))}return}if(t==="gravity"){this.vel.y+=this.constant("movement.yaccel")*this.coordinateScale;return}if(t==="turn"){(h=this.world)!=null&&h.orderedPhases&&this.vel.x!==0&&(this.vel.x=-this.vel.x),this.facing*=-1;return}if(t==="posfreeze"){this.posFrozen=Wt(i("value",1));return}if(t==="helper"){if(!this.world)throw Error("Helper requires a match world.");this.world.spawnHelper(this,this.entityParameters(e));return}if(t==="projectile"){if(!this.world)throw Error("Projectile requires a match world.");const d=new Set(["velocity","remvelocity","accel","velmul","offset","postype","supermovetime","pausemovetime","ownpal","remappal"]),p=e.entries.filter(m=>!m.key.startsWith("proj")&&!m.key.startsWith("afterimage.")&&!d.has(m.key)),_=this.parseHitDef({...e,entries:p,values:Object.fromEntries(p.map(m=>[m.key,m.value]))});this.world.spawnProjectile(this,{...this.entityParameters(e,!0),hitDef:_});return}if(t==="pause"||t==="superpause"){if(!this.world)throw Error(`${t} requires a match world.`);const d=this.entityParameters(e);d.coordinateScale=this.coordinateScale,d.type=t,d.time??(d.time=t==="superpause"?30:0),d.animCommon=!/^s/i.test(e.values.anim||""),d.soundCommon=!/^s/i.test(e.values.sound||""),this.world.requestPause(this,d);return}if(t==="trans"){this.trans={mode:a("trans","default").toLowerCase(),alpha:r("alpha",[256,0])};return}if(t==="movehitreset"){this.moveContact=this.moveHit=this.moveGuarded=0;return}if(t==="attackdist"){this.attackDist=i("value"),this.hitDef&&(this.hitDef["guard.dist"]=this.attackDist*this.coordinateScale/(this.hitDef.coordinateScale??this.coordinateScale));return}if(t==="remappal"){const d=A=>{const R=r(A,[-1,0]);return[ht(R[0]),ht(R[1]??0)]},p=d("source"),_=d("dest"),m=p[0]===-1?"*":p.join(",");if(p[0]===-1&&_[0]===-1){this.paletteRemaps.clear();return}if(p[0]<-1||p[0]!==-1&&p[1]<0||_[0]<-1||_[0]!==-1&&_[1]<0)throw Error("Invalid RemapPal palette pair.");const v=_[0]===-1||p.join(",")===_.join(",");v||bu(this.character,p,_);const y=v&&this.paletteRemaps.has("*")&&p[0]!==-1;if(p[0]!==-1&&(!v||y)&&!this.paletteRemaps.has(m)&&this.paletteRemaps.size>=8){this.diagnostic("resource-limit","RemapPal supports at most 8 simultaneous mappings.",e);return}p[0]===-1&&this.paletteRemaps.clear(),y?this.paletteRemaps.set(m,p):v?this.paletteRemaps.delete(m):this.paletteRemaps.set(m,_);return}if(t==="fallenvshake"){const d=this.getHitVars["fall.envshake.time"]||0;d>0&&this.events.push({type:"envshake",time:d,coordinateScale:this.coordinateScale,...Object.fromEntries(["ampl","freq","phase"].map(p=>[p,this.getHitVars["fall.envshake."+p]]))}),this.getHitVars["fall.envshake.time"]=0;return}if(["varset","varadd","varmul","parentvarset","parentvaradd"].includes(t)){const d=t.startsWith("parent")?this.parent:this;if(!d||d.destroyed)return;let p=e.entries.filter(_=>/^(var|fvar|sysvar|sysfvar)\s*\(/.test(_.key));if(!p.length){const _=e.values.fv!==void 0?"fvar":"var";p=[{key:`${_}(${s(_==="fvar"?"fv":"v")})`,value:e.values.value??"0"}]}for(const _ of p){const m=_.key.match(/^(var|fvar|sysvar|sysfvar)\s*\((.*)\)$/);if(!m)throw new Error(`Malformed variable target: ${_.key}`);const v=ht(this.parameter(m[2],e));let y=Zt(this.parameter(_.value,e));y=m[1].includes("fvar")?Math.fround(y):ht(y)|0;const A=d.resolveTrigger(m[1],[v]);t.endsWith("add")&&(y+=A),t.endsWith("mul")&&(y*=A),d.assignVariable(m[1],[v],y)}return}if(t==="varrandom"){const d=s("v"),p=r("range",[0,1e3]),[_,m]=p.length===1?[0,ht(p[0])]:p.map(ht);if(_>m)throw Error("VarRandom range requires least_val <= greatest_val.");this.resolveTrigger("random"),this.assignVariable("var",[d],_+Math.floor((this._seed>>>0)/4294967296*(m-_+1)));return}if(t==="varrangeset"){const d=e.values.fvalue!==void 0,p=d?this.fvars:this.vars,_=li(s("first"),0,p.length-1),m=li(s("last",p.length-1),0,p.length-1),v=i(d?"fvalue":"value");for(let y=_;y<=m;y++)this.assignVariable(d?"fvar":"var",[y],v);return}if(t==="lifeadd"||t==="lifeset"){let d=s("value");t==="lifeadd"&&(d=-_r(-d,null,this,{absolute:!!i("absolute")}),d+=this.life),this.life=li(d,i("kill",1)?0:1,this.maxLife);return}if(t==="poweradd"||t==="powerset"){this.power=li(s("value")+(t==="poweradd"?this.power:0),0,this.maxPower);return}if(t==="attackmulset"){this.attackMultiplier=i("value",1);return}if(t==="defencemulset"){this.defenceMultiplier=i("value",1);return}if(t==="sprpriority"){this.sprPriority=s("value");return}if(t==="screenbound"){this.screenBound=Wt(i("value",0));const[d,p]=r("movecamera");this.moveCamera={x:!!d,y:!!p};return}if(t==="playerpush"){this.playerPush=Wt(i("value",1));return}if(t==="width"){if(e.values.value!==void 0&&(e.values.player!==void 0||e.values.edge!==void 0))throw Error("Width value cannot be combined with player or edge.");const d=e.values.value===void 0?[0,0]:r("value"),[p=0,_=0]=r("player",d),m=r("edge",d);this.width={front:ht(p),back:ht(_),edge:[ht(m[0]??0),ht(m[1]??0)]};return}if(t==="assertspecial"){const d=new Set(["nowalk","nojump","nocrouch","noautoturn","invisible","noshadow","unguardable","noairguard","nostandguard","nocrouchguard","nojugglecheck","intro","roundnotover","timerfreeze","noko","nobardisplay","nobg","nofg"]);for(const p of["flag","flag2","flag3"])if(e.values[p]){const _=a(p).toLowerCase();this.asserted.add(_),d.has(_)||this.diagnostic("unsupported-flag",`AssertSpecial flag ${_} is not implemented.`,e)}return}if(t==="hitvelset"){i("x")&&(this.vel.x=(this.getHitVars.xvel||0)*this.coordinateScale),i("y")&&(this.vel.y=(this.getHitVars.yvel||0)*this.coordinateScale);return}if(t==="hitdef"){this.hitDef=null,this.reversalDef=null,this.hitDef=this.parseHitDef(e),this.events.push({type:"hitdef",hitDef:this.hitDef});return}if(t==="reversaldef"){if(this.reversalDef=null,e.values["reversal.attr"]===void 0)throw Error("ReversalDef requires reversal.attr.");if(!e.values["reversal.attr"].trim())return;js(a("reversal.attr")),this.reversalDef=this.parseHitDef(e);return}if(t==="hitby"||t==="nothitby"){const d=["value","value2"].filter(m=>e.values[m]!==void 0);if(d.length!==1)throw Error(`${t} requires exactly one of value or value2.`);const p=s("time",1);if(p<-1||p>36e4)throw Error("Invalid hit-filter duration.");const _=js(a(d[0]));this.hitFilters[d[0]==="value"?0:1]=p?{attribute:_,time:p,exclude:t==="nothitby"}:null;return}if(t==="hitoverride"){const d=s("slot"),p=s("time",1);if(d<0||d>7||p<-1||p>36e4)throw Error("HitOverride requires slot 0–7 and time -1 or greater.");if(!p||((f=e.values.attr)==null?void 0:f.trim())===""){this.hitOverrides.delete(d);return}if(e.values.attr===void 0||e.values.stateno===void 0)throw Error("HitOverride requires attr and stateno.");const _=a("attr"),m=js(_);p?this.hitOverrides.set(d,{attr:_,attribute:m,stateNo:s("stateno"),time:p,forceAir:Wt(i("forceair"))}):this.hitOverrides.delete(d);return}if(cp.has(t)){if(t==="palfx"&&this.parent&&!this.ownPal)return;let d=this.effectParameters(e);if(["palfx","allpalfx","bgpalfx"].includes(t)&&(d=ia(d)),t==="playsnd"){const[p=0,_=0]=Array.isArray(d.value)?d.value:[d.value||0,0];Object.assign(d,{group:p,number:_,common:/^\s*f/i.test(e.values.value||""),volumeScale:d.volumescale,freqMul:d.freqmul})}this.events.push({type:t,...d,coordinateScale:this.coordinateScale,source:e.source,line:e.line});return}if(["explod","modifyexplod","removeexplod","explodbindtime"].includes(t)){this.explodController(e);return}if(t.startsWith("target")){const d=s("id",-1),p=this.targets.filter(S=>d===-1||(this.targetHitIds.get(S.id)??S.hitId)===d);if(t==="targetdrop"){const S=s("excludeid",-1),M=S<0?[]:this.targets.filter(x=>(this.targetHitIds.get(x.id)??x.hitId)===S);this.targets=i("keepone",1)?M.slice(0,1):M;const g=new Set(this.targets.map(x=>x.id));for(const x of this.targetHitIds.keys())g.has(x)||this.targetHitIds.delete(x);return}const _=["targetfacing","targetlifeadd","targetpoweradd","targetstate"].includes(t)?s("value"):void 0,m=t==="targetlifeadd"?i("kill",1):1,v=t==="targetlifeadd"?i("absolute"):0,y=t==="targetstate"&&e.values.ctrl!==void 0?i("ctrl"):void 0,A=t==="targetbind"?{pos:r("pos"),time:s("time",1)}:null,R=t==="targetvelset"||t==="targetveladd"?Object.fromEntries(["x","y"].filter(S=>e.values[S]!==void 0).map(S=>[S,i(S)*this.coordinateScale])):null;for(const S of p)if(t==="targetfacing")_&&(S.facing=this.facing*(_<0?-1:1));else if(t==="targetlifeadd"){const M=-_r(-_,this,S,{absolute:!!v});S.life=li(S.life+M,m?0:1,S.maxLife)}else if(t==="targetpoweradd")S.power=li(S.power+_,0,S.maxPower);else if(t==="targetstate")S.changeState(_,y,this._scriptOwner||this.stateOwner);else if(A){const[M=0,g=0]=A.pos;S.bound={target:this,x:M*this.coordinateScale,y:g*this.coordinateScale,time:A.time}}else for(const[M,g]of Object.entries(R||{}))S.vel[M]=g+(t==="targetveladd"?S.vel[M]:0);return}if(["bindtoroot","bindtoparent","bindtotarget"].includes(t)){if(t!=="bindtotarget"&&!this.parent)return;const d=s("id",-1),p=t==="bindtoroot"?this.root:t==="bindtoparent"?this.parent:this.targets.find(y=>d<0||(this.targetHitIds.get(y.id)??y.hitId)===d);if(!p||p.destroyed){if(t==="bindtoparent"&&this.parent){this.bound=null;return}throw new Error(`${t} has no matching player`)}let _=[0,0],m,v;if(t==="bindtotarget"){const y=Zi(e.values.pos||"0,0"),A=kn(y[2]||"foot").toLowerCase();if(y.length>3||!["foot","head","mid"].includes(A))throw Error("BindToTarget pos requires x, y, and Foot, Head or Mid.");[m,v]=y.slice(0,2).map(R=>Zt(this.evaluate(R,e))),m??(m=0),v??(v=0),A!=="foot"&&(_=["x","y"].map(R=>p.constant(`size.${A}.pos.${R}`)*p.coordinateScale))}else[m=0,v=0]=r("pos");this.bound={target:p,x:m*this.coordinateScale+_[0],y:v*this.coordinateScale+_[1],time:s("time",1),facing:i("facing")};return}if(t==="hitadd"){const d=s("value");this.hitCount=Math.max(0,this.hitCount+d),this.uniqHitCount=Math.max(0,this.uniqHitCount+d);const p=this.targets.at(-1)||(((u=this.opponent)==null?void 0:u.moveType)==="H"?this.opponent:null);p&&(p.comboHits=Math.max(0,(p.comboHits||0)+d));return}if(t==="hitcount"){this.hitCount=s("value");return}if(t==="hitfallset"){if(e.values.value!==void 0){const d=s("value",-1);d!==-1&&(d&&!this.getHitVars.fall&&(this.getHitVars["fall.time"]=0),this.getHitVars.fall=+!!d)}e.values.xvel!==void 0&&(this.getHitVars["fall.xvel"]=i("xvel"),this._fallXVelocityDefined=!0),e.values.yvel!==void 0&&(this.getHitVars["fall.yvel"]=i("yvel"));return}if(t==="hitfallvel"){if(this.moveType!=="H")return;this._fallXVelocityDefined&&(this.vel.x=(this.getHitVars["fall.xvel"]||0)*this.coordinateScale),this.vel.y=(this.getHitVars["fall.yvel"]||0)*this.coordinateScale;return}if(t==="hitfalldamage"){if(this.moveType==="H"){const d=_r(this.getHitVars["fall.damage"]||0,null,this);this.life=li(this.life-d,this.life>0&&this.getHitVars["fall.kill"]===0?1:0,this.maxLife),this.getHitVars["fall.damage"]=0}return}if(t==="angleadd"){this.angle+=i("value");return}if(t==="angleset"){this.angle=i("value");return}if(t==="anglemul"){this.angle*=i("value",1);return}if(t==="angledraw"){this.angleDraw=!0;const[d=1,p=1]=r("scale",[1,1]);this.drawScale={x:d,y:p},e.values.value&&(this.angle=i("value"));return}if(t==="offset"){this.drawOffset={x:i("x")*this.coordinateScale,y:i("y")*this.coordinateScale};return}if(t==="destroyself"){if(!this.parent){this.diagnostic("unsupported-controller","DestroySelf is valid only for helpers.",e);return}const d=!!i("recursive"),p=!!i("removeexplods");this.world?this.world.destroyHelper(this,{recursive:d,removeExplods:p}):(this.destroyed=!0,p&&(this.explods=this.drawExplods=[]));return}this.diagnostic("unsupported-controller",`Controller ${t} is not implemented.`,e)}}selectVictoryQuote(){if(this.parent||this.victoryQuote!==null)return this.victoryQuote;const e=this.program.quotes;if(!(e!=null&&e.size))return null;const t=[...e.keys()],i=e.has(this.victoryQuoteIndex)?this.victoryQuoteIndex:t[Math.floor(this.resolveTrigger("random")/1e3*t.length)];return this.victoryQuote=e.get(i)}gameAnimation(e,t,i,s,r){if(e<0)return;if(!this.commonAnimations.has(e)){this.diagnostic("missing-animation",`Common effect animation ${e} is unavailable. Import its fightfx resources.`,r);return}const a=()=>s?(this.resolveTrigger("random")/999-.5)*s:0;this.events.push({type:"gameanim",anim:e,under:i,common:!0,facing:this.facing,pos:{x:this.pos.x+((t[0]||0)*this.facing+a())*this.coordinateScale,y:this.pos.y+((t[1]||0)+a())*this.coordinateScale}})}effectParameters(e){const t={},i=new Set(["waveform","postype","trans","helpertype","name","space"]);for(const s of e.entries){if(/^(type|triggerall|trigger\d+|persistent|ignorehitpause)$/.test(s.key))continue;if(i.has(s.key)&&!/^-?[\d.]+$/.test(s.value)){t[s.key]=kn(s.value);continue}const a=Zi(s.value).map(o=>{const l=o.trim().replace(/^[sSfF](?=[\d(-])/,"");return this.parameter(l,e)});t[s.key]=a.length===1?a[0]:a}return t}entityParameters(e,t=!1){const i=new Set(["velocity","remvelocity","accel","velmul","offset","postype","supermovetime","pausemovetime","ownpal","remappal"]),s=t?e.entries.filter(r=>r.key.startsWith("proj")||r.key.startsWith("afterimage.")||i.has(r.key)):e.entries;if(t){const r=new Set(["projid","projanim","projhitanim","projremanim","projcancelanim","projscale","projremove","projremovetime","projhits","projmisstime","projpriority","projsprpriority","projedgebound","projstagebound","projheightbound","projshadow"]);for(const a of s)a.key.startsWith("proj")&&!r.has(a.key)&&this.diagnostic("unsupported-projectile",`Projectile parameter ${a.key} is not implemented.`,{...e,line:a.line})}return{...this.effectParameters({...e,entries:s}),source:e.source,line:e.line}}createHelper(e,{id:t}={}){e.helpertype&&e.helpertype!=="normal"&&this.diagnostic("unsupported-helper","Player-type helpers are deprecated by MUGEN 1.1; using a normal helper.");const{pos:i,facing:s}=Cu(this,e),r={...this.program,constants:new Map(this.program.constants)};for(const[l,c]of Object.entries(e))if(l.startsWith("size.")){const h=Pc(l)?this.coordinateScale/this.baseCoordinateScale:1,f=Array.isArray(c)?c.map(u=>u*h):c*h;r.constants.set(l,f),Array.isArray(f)&&(r.constants.set(l+".x",f[0]),r.constants.set(l+".y",f[1]))}const a=new ma(this.character,{program:r,expressionEvaluator:this.options.expressionEvaluator,commonAnimations:this.commonAnimations,world:this.world,id:t,position:i,facing:s,parent:this,root:this.root,helperId:Math.trunc(e.id||0),keyCtrl:!!e.keyctrl,ownPal:!!e.ownpal,teamSide:this.teamSide,pauseMoveTime:e.pausemovetime||0,superMoveTime:e.supermovetime||0});a.name=e.name||`${this.name}'s helper`,a.opponent=this.opponent,e.ownpal&&(a._paletteRemaps=kl(this.paletteRemaps)),e.ownpal&&this.events.push({type:"palettesnapshot",target:a});const o=new Set(["id","name","stateno","postype","pos","facing","helpertype","keyctrl","ownpal","pausemovetime","supermovetime","remappal","source","line"]);for(const l of Object.keys(e))!o.has(l)&&!l.startsWith("size.")&&a.diagnostic("unsupported-helper",`Helper parameter ${l} is not implemented.`);if(e.ownpal&&e.remappal!==void 0)try{Bl(a.paletteRemaps,a.character,e.remappal)}catch(l){a.diagnostic("palette",l.message)}return a.changeState(e.stateno??0)?(this.helpers.push(a),a):(a.destroyed=!0,a)}parseHitDef(e){var l,c;const t=e.values,i={serial:++this._hitSerial,coordinateScale:this.coordinateScale,stateOwner:this._scriptOwner||this.stateOwner},s=new Set(["attr","reversal.attr","hitflag","guardflag","animtype","air.animtype","fall.animtype","ground.type","air.type","affectteam","priority"]);for(const h of e.entries)if(!/^(type|triggerall|trigger\d+|persistent|ignorehitpause)$/.test(h.key)){if(h.key==="priority"){const[f,u="Hit"]=Zi(h.value);i.priority=[ht(this.parameter(f,e)),kn(u)];continue}if(s.has(h.key)){i[h.key]=kn(h.value);continue}try{const f=Zi(h.value).map(u=>this.parameter(u.trim().replace(/^[sSfF](?=[\d(-])/,""),e));i[h.key]=f.length===1?f[0]:f}catch{throw new Error(`HitDef parameter ${h.key} could not be evaluated; attack disabled.`)}}const r=(h,f)=>Array.isArray(i[h])?i[h]:i[h]===void 0?[...f]:[i[h],f[1]??0];i.attr=i.attr??`${this.stateType}, NA`,i.id=ht(i.id??0),i.chainid=ht(i.chainid??-1);const a=i.nochainid===void 0?[-1,-1]:Array.isArray(i.nochainid)?i.nochainid:[i.nochainid,-1];if(a.length>2)throw Error("HitDef nochainID takes at most two IDs.");i.nochainid=a.map(ht),i.hitonce=i.hitonce===void 0?+/^[SCA]\s*,\s*[NSH]T$/i.test(i.attr):+Wt(Zt(i.hitonce)),i.damage=r("damage",[0,0]),i.pauseTime=r("pausetime",[0,0]),i.guardPauseTime=r("guard.pausetime",i.pauseTime),i.groundVelocity=r("ground.velocity",[0,0]),i.airVelocity=r("air.velocity",[0,0]),i.guardVelocity=r("guard.velocity",[i.groundVelocity[0],0]),i.airGuardVelocity=r("airguard.velocity",[i.airVelocity[0]*1.5,i.airVelocity[1]/2]),i.guardVelocity[1]=0,i["air.type"]??(i["air.type"]=i["ground.type"]??"high"),i.forcestand??(i.forcestand=+(i.groundVelocity[1]!==0)),i["down.velocity"]??(i["down.velocity"]=[...i.airVelocity]),i["down.hittime"]??(i["down.hittime"]=20),i["down.bounce"]??(i["down.bounce"]=0),i["ground.cornerpush.veloff"]??(i["ground.cornerpush.veloff"]=/^A\s*,/i.test(i.attr)?0:1.3*i.guardVelocity[0]);for(const h of["air","down","guard"])i[l=h+".cornerpush.veloff"]??(i[l]=i["ground.cornerpush.veloff"]);i["airguard.cornerpush.veloff"]??(i["airguard.cornerpush.veloff"]=i["guard.cornerpush.veloff"]),i.groundHitTime=i["ground.hittime"]??0,i.airHitTime=i["air.hittime"]??20,i.guardHitTime=i["guard.hittime"]??((c=this.world)!=null&&c.orderedPhases?i["ground.slidetime"]??0:i.groundHitTime),i["ground.slidetime"]??(i["ground.slidetime"]=0),i["guard.slidetime"]??(i["guard.slidetime"]=i.guardHitTime),i["guard.ctrltime"]??(i["guard.ctrltime"]=i["guard.slidetime"]),i["airguard.ctrltime"]??(i["airguard.ctrltime"]=i["guard.ctrltime"]),i.hitFlag=String(i.hitflag??"MAF").toUpperCase(),i.guardFlag=String(i.guardflag??"").toUpperCase(),i.fall=i.fall??0,i.kill=i.kill??1,i["guard.kill"]=i["guard.kill"]??1,i.source=e.source,i.line=e.line,i.juggleCost=this.juggleCost,i.juggleGroup=`${this.id}:${this._juggleSerial}`,i.sparkCommon=!/^s/i.test(t.sparkno||""),i.guardSparkCommon=!/^s/i.test(t["guard.sparkno"]||""),i.hitSoundCommon=!/^s/i.test(t.hitsound||""),i.guardSoundCommon=!/^s/i.test(t.guardsound||""),i.sparkno??(i.sparkno=this.constant("data.sparkno")),i["guard.sparkno"]??(i["guard.sparkno"]=this.constant("data.guard.sparkno"));const o=new Set(["attr","damage","pausetime","guard.pausetime","ground.velocity","air.velocity","guard.velocity","airguard.velocity","ground.hittime","air.hittime","guard.hittime","ground.slidetime","guard.slidetime","ground.ctrltime","guard.ctrltime","guardflag","hitflag","fall","forcenofall","kill","guard.kill","fall.kill","fall.damage","fall.xvelocity","fall.yvelocity","fall.recover","fall.recovertime","yaccel","animtype","air.animtype","ground.type","air.type","chainid","id","p1stateno","p2stateno","p2getp1state","p1facing","p1getp2facing","p2facing","p1sprpriority","p2sprpriority","numhits","getpower","givepower","priority","affectteam","guard.dist","down.velocity","down.hittime","air.fall","forcestand","air.juggle","fall.envshake.time","fall.envshake.ampl","fall.envshake.freq","fall.envshake.phase","sparkno","guard.sparkno","sparkxy","hitsound","guardsound","envshake.time","envshake.freq","envshake.ampl","envshake.phase","palfx.time","palfx.add","palfx.mul","palfx.sinadd","palfx.color","palfx.invertall"]);for(const h of["fall.animtype","mindist","maxdist","snap","ground.cornerpush.veloff","air.cornerpush.veloff","down.cornerpush.veloff","guard.cornerpush.veloff","airguard.cornerpush.veloff","airguard.ctrltime"])o.add(h);o.add("hitonce"),o.add("nochainid"),o.add("down.bounce");for(const h of e.entries)/^(type|triggerall|trigger\d+|persistent|ignorehitpause)$/.test(h.key)||o.has(h.key)||h.key==="reversal.attr"||this.diagnostic("unsupported-hitdef-parameter",`HitDef parameter ${h.key} is parsed but its engine behavior is not implemented.`,{...e,line:h.line});return i}receiveHit(e,t,{guarded:i=!1}={}){var Q,G,j,re;if(!this.canBeHit(e,t))return{damage:0,guarded:!1,rejected:!0};const s=!i&&String(e[this.stateType==="A"?"air.type":"ground.type"]??e["ground.type"]??"high").toLowerCase()==="none",r=i?null:this.matchingHitOverride(e),a=e.p2getp1state===0?this:e.stateOwner||t;if(!s&&!i&&!r&&e.p2stateno>=0&&!(a!=null&&a.program.states.has(e.p2stateno)))return this.diagnostic("missing-state",`HitDef target state ${e.p2stateno} does not exist; hit rejected.`),{damage:0,guarded:!1,rejected:!0};$f(this,e,t);const o=i?e.guardPauseTime:e.pauseTime,l=this.stateType,c=(t==null?void 0:t.facing)??-this.facing,h=this.facing;if(s)return Ic(t,e,!1,{count:!1}),{damage:0,guarded:!1,typeNone:!0,cornerPush:0};this.explods=this.explods.filter(le=>!le.removeongethit),this.drawExplods=this.drawExplods.filter(le=>!le.removeongethit);const f=this.stateType==="A"||!!(r!=null&&r.forceAir),u=this.stateType==="L"&&!(r!=null&&r.forceAir),d=f&&!!this.getHitVars.fall,p=this.getHitVars,_=this.moveType==="H"&&!p.guarded,m=e[(i?f?"airguard":"guard":u?"down":f?"air":"ground")+".cornerpush.veloff"]||0;!i&&e.forcestand&&this.stateType==="C"&&(this.stateType="S");const v=Zt(((Q=e.damage)==null?void 0:Q[i?1:0])||0),y=Math.max(0,_r(v,t,this)),A=(G=this.world)==null?void 0:G.orderedPhases,R=(i?e["guard.kill"]:e.kill)===0?1:0,S=li((this._projectedLife??this.life)-y,R,this.maxLife);A?this._projectedLife=S:this.life=S;const M={},g=t&&e.p2facing?(A?-1:1)*c*(e.p2facing<0?-1:1):this.facing;t&&e.p2facing&&(A?M.facing=g:this.facing=g),t&&e.p1getp2facing?t.facing=g*(e.p1getp2facing<0?-1:1):t&&e.p1facing===-1&&(t.facing*=-1);const x=i?f?e.airGuardVelocity:e.guardVelocity:u&&e["down.velocity"]!==void 0?Array.isArray(e["down.velocity"])?e["down.velocity"]:[e["down.velocity"],0]:f?e.airVelocity:e.groundVelocity,P=e.coordinateScale??(t==null?void 0:t.coordinateScale)??this.coordinateScale,T=P/this.coordinateScale;let I=((x==null?void 0:x[0])||0)*T*-c*g,U=((x==null?void 0:x[1])||0)*T;const D=S<=0,w=D?Jf(I,U,l,this.coordinateScale):{x:I,y:U};I=w.x,U=w.y;const O=i?e.guardHitTime:u&&U===0?e["down.hittime"]??20:f||U!==0||A&&e.fall?e.airHitTime??20:e.groundHitTime??0,B={light:0,medium:1,med:1,hard:2,back:3,up:4,diagup:5},z={high:1,low:2,trip:3,none:0};let L=z[String(e["ground.type"]||"high").toLowerCase()]??1;t&&(t.pos.x-this.pos.x)*h<0&&(L===1||L===2)&&(L=3-L);const C=e["air.animtype"]||e.animtype||"light",H=e["fall.animtype"]||(String(C).toLowerCase()==="up"?"up":"back"),W=D?1:i?0:+((!e.forcenofall||e.fall)&&!!p.fall||Wt(Zt(f?e["air.fall"]??e.fall??0:e.fall||0)));if(this.getHitVars={animtype:B[String((A?W&&!i:d)?H:f?C:e.animtype||"light").toLowerCase()]??0,groundtype:L,airtype:z[String(e["air.type"]||"high").toLowerCase()]??1,type:f?z[String(e["air.type"]||e["ground.type"]||"high").toLowerCase()]??1:L,damage:y,hitcount:i?0:(_&&p.hitcount||0)+1,fallcount:_&&p.fallcount||0,hitshaketime:(o==null?void 0:o[1])||0,hittime:O,slidetime:e[i?"guard.slidetime":"ground.slidetime"]??(i?O:0),ctrltime:(i&&f?e["airguard.ctrltime"]:void 0)??e[i?"guard.ctrltime":"ground.ctrltime"]??O,xvel:I,yvel:U,yaccel:e.yaccel===void 0?.35/this.coordinateScale:e.yaccel*T,xoff:0,yoff:0,guarded:+i,fall:W,hitid:e.id??0,chainid:Math.max(0,e.id??0),isbound:0,xveladd:0,yveladd:0,zoff:0,recovertime:u?Math.min(p.recovertime??this.constant("data.liedown.time"),this.constant("data.liedown.time")):this.constant("data.liedown.time"),"fall.time":A&&i&&p["fall.time"]||0,"fall.damage":e["fall.damage"]||0,"fall.xvel":e["fall.xvelocity"]===void 0?I:e["fall.xvelocity"]*T*-c*g,"fall.yvel":u&&!e["down.bounce"]&&U!==0?0:e["fall.yvelocity"]===void 0?-4.5/this.coordinateScale:e["fall.yvelocity"]*T,"fall.recover":D||A&&i?0:e["fall.recover"]??1,"fall.recovertime":e["fall.recovertime"]??4,"fall.kill":e["fall.kill"]??1,"fall.envshake.time":e["fall.envshake.time"]||0,"fall.envshake.freq":e["fall.envshake.freq"]??60,"fall.envshake.ampl":e["fall.envshake.ampl"]===void 0?-4/this.coordinateScale:e["fall.envshake.ampl"]*T,"fall.envshake.phase":e["fall.envshake.phase"]??0},this.comboHits=i?0:(_&&this.comboHits||0)+Math.max(0,Math.trunc(e.numhits??1)),this._fallXVelocityDefined=e["fall.xvelocity"]!==void 0,this.hitTime=Math.max(0,O||0)+(A&&!i&&O>0?1:0),this.hitPauseTime=A?0:Math.max(0,(o==null?void 0:o[1])||0),this.ctrl=0,this.moveType="H",this.hitId=e.id??0,this.hitSourceId=ko(t),A||(this.vel={x:0,y:0}),this.cornerPush=0,this.cornerPushTarget=null,t&&(!i||A)){const le=P;for(const[ae,Ie]of[["x",0],["y",1]]){const it=ae==="x"?t.facing:1;let Ee=(this.pos[ae]-t.pos[ae])*it/le;const De=i?ae==="x"?["mindist","maxdist"]:[]:["mindist","maxdist","snap"];for(const _e of De)if(e[_e]!==void 0){const Ce=Array.isArray(e[_e])?e[_e][Ie]:Ie===0?e[_e]:void 0;if(Ce===void 0)continue;Ee=_e==="mindist"?Math.max(Ee,Ce):_e==="maxdist"?Math.min(Ee,Ce):Ce}const se=t.pos[ae]+Ee*it*le;A?De.some(_e=>e[_e]!==void 0)&&(M[ae]=Math.fround(se)):this.pos[ae]=se}}A&&Object.keys(M).length&&(this._pendingHitTransform=M);const K=r?r.stateNo:!i&&e.p2stateno>=0?e.p2stateno:i&&!D?f?154:this.stateType==="C"?152:150:u?5080:!f&&this.getHitVars.groundtype===3?5070:f?5020:this.stateType==="C"?5010:5e3;if(r!=null&&r.forceAir&&(this.stateType="A"),this.changeState(K,void 0,!i&&!r&&e.p2stateno>=0?a:this)||(this.moveType="H",this.vel={x:I*this.coordinateScale,y:U*this.coordinateScale},this.diagnostic("missing-hit-state",`Hit state ${K} is missing; full hit reaction cannot execute.`)),this.moveType="H",t){Ic(t,e,i),t.hitPauseTime=Math.max(t.hitPauseTime,(o==null?void 0:o[0])||0),t.targets.includes(this)||t.targets.push(this),(j=t.targetHitIds)==null||j.set(this.id,e.id??0);const{get:le,give:ae}=jf(e,(re=this.world)==null?void 0:re.combatRules);A?this.world.pendingCombatEffects.push({defender:this,attacker:t,damage:y,minimum:R,get:le[i?1:0]||0,give:ae[i?1:0]||0}):(t.power=li(t.power+(le[i?1:0]||0),0,t.maxPower),this.power=li(this.power+(ae[i?1:0]||0),0,this.maxPower))}return t&&(t.sprPriority=e.p1sprpriority??1,this.sprPriority=e.p2sprpriority??0,!i&&e.p1stateno>=0&&t.changeState(e.p1stateno,void 0,e.stateOwner||t.stateOwner)),this.events.push({type:"hit",damage:y,guarded:i,attacker:t==null?void 0:t.id}),{damage:y,guarded:i,cornerPush:m}}attributeMatches(e,t){return $a(e,t)}matchingHitOverride(e){for(let t=0;t<8;t++){const i=this.hitOverrides.get(t);if(i!=null&&i.time&&$a(i.attribute||i.attr,e.attr))return i}return null}canBeHit(e,t){var s;if(!Xf(this,e,t)||(s=this.world)!=null&&s.isSuperUnhittable(this))return!1;for(const r of this.hitFilters)if(r!=null&&r.time&&!Hf(r,e.attr))return!1;return!(String(e[this.stateType==="A"?"air.type":"ground.type"]??e["ground.type"]??"high").toLowerCase()==="none")&&this.matchingHitOverride(e)&&(e.p1stateno>=0||e.p2getp1state===1||e.p2stateno>=0&&e.p2getp1state!==0)?!1:!this.asserted.has("unhittable")}explodController(e){return Of(this,e)}updateExplods(e={}){return Bf(this,e)}updateBinding(){var t;const e=this.bound;if(e){if(e.target.destroyed){this.bound=null;return}this.pos.x=e.target.pos.x+e.x*e.target.facing,this.pos.y=e.target.pos.y+e.y,(t=this.world)!=null&&t.orderedPhases&&(this.pos.x=Math.fround(this.pos.x),this.pos.y=Math.fround(this.pos.y)),e.facing&&(this.facing=e.target.facing*(e.facing<0?-1:1)),e.time>0&&--e.time===0&&(this.bound=null)}}}const $n=(n,e=[0,0])=>Array.isArray(n)?[Number(n[0]??e[0]),Number(n[1]??e[1])]:n===void 0?[...e]:[Number(n),e[1]];class Ls{constructor(e,t,{id:i}={}){var o;this.creator=e,this.owner=e.root||e,this.root=this.owner,this.isProjectile=!0,this.world=e.world,this.id=i,this.projId=Math.max(0,Math.trunc(t.projid??0)),this.teamSide=e.teamSide,this.character=e.character,this.coordinateScale=e.coordinateScale,this.baseCoordinateScale=this.coordinateScale,this.paletteParent=ta(e),this.guardDistance=e.constant("size.proj.attack.dist")*e.coordinateScale,this.animations=e.animations,this.program={...e.program,constants:new Map(e.program.constants)},this.spec=t,this.events=[],this.diagnostics=[],this.asserted=new Set,Number(t.projid)<0&&this.diagnostic("projectile-id","Negative ProjID was clamped to 0."),Object.assign(this,Cu(e,t,!0));const s=$n(t.projscale,[1,1]),r=e.constant("size.proj.doscale")!==0;this.program.constants.set("size.xscale",s[0]*(r?e.constant("size.xscale"):1)),this.program.constants.set("size.yscale",s[1]*(r?e.constant("size.yscale"):1)),this.program.constants.set("size.draw.offset.x",0),this.program.constants.set("size.draw.offset.y",0);const a=$n(t.velocity);if(this.vel={x:a[0]*this.coordinateScale,y:a[1]*this.coordinateScale},this.accel=$n(t.accel).map(l=>l*this.coordinateScale),this.velmul=$n(t.velmul,[1,1]),this.anim=Math.trunc(t.projanim??0),this.frameIndex=0,this.frameTime=0,this.collisionFrame=null,this.hitDef=t.hitDef,this.proximityHitDef=t.hitDef,this.hitPauseTime=0,this.hitCount=0,this.moveType="A",this.stateType=(((o=this.hitDef)==null?void 0:o.attr)||"S")[0].toUpperCase(),this.priority=Math.max(1,Math.trunc(t.projpriority??1)),this.sprPriority=t.projsprpriority??3,this.remainingHits=Math.max(0,Math.trunc(t.projhits??1)),this.missTime=Math.max(0,Math.trunc(t.projmisstime??0)),this.pauseMoveTime=Math.max(0,t.pausemovetime||0),this.superMoveTime=Math.max(0,t.supermovetime||0),this.ownPal=!!t.ownpal,this.time=0,this.removing=!1,this.removed=!1,this.activeTicks=0,this.nextHitAge=0,this.drawVisible=!0,this._inTick=!1,this._paletteRemaps=kl(e.paletteRemaps),this.ownPal&&t.remappal!==void 0)try{Bl(this._paletteRemaps,this.character,t.remappal)}catch(l){this.diagnostic("palette",l.message)}this.attackMultiplier=e.attackMultiplier,this.animations.has(this.anim)||(this.diagnostic("missing-animation",`Projectile animation ${this.anim} does not exist.`),this.removed=!0)}get currentFrame(){var e;return((e=this.animations.get(this.anim))==null?void 0:e.frames[this.frameIndex])||null}get life(){return this.removed||this.removing?0:1}get power(){return this.owner.power}set power(e){this.owner.power=e}get maxPower(){return this.owner.maxPower}get targets(){return this.owner.targets}get targetHitIds(){return this.owner.targetHitIds}get paletteRemaps(){return this.ownPal?this._paletteRemaps:this.paletteParent.paletteRemaps}constant(e){const t=this.program.constants.get(e);return Array.isArray(t)?t[0]:t}changeState(){return this.diagnostic("unsupported-projectile","A projectile cannot enter a player state."),!1}diagnostic(e,t){this.diagnostics.some(i=>i.message===t)||this.diagnostics.push({type:e,message:t,source:this.spec.source,line:this.spec.line})}record(e){var i;const t=this.owner.projectileHistory;t.push({type:e,projId:this.projId,tick:((i=this.world)==null?void 0:i.ticks)??this.time});for(let s=t.length-2;s>=0;s--)t[s].type===e&&t[s].projId===this.projId&&t.splice(s,1);t.length>4096&&(t.shift(),this.diagnostic("resource-limit","Projectile history exceeded 4096 distinct ID/event pairs."))}canHit(){return!this.removed&&!this.removing&&!!this.hitDef&&this.activeTicks>=this.nextHitAge&&this.remainingHits>0}onContact({guarded:e=!1,defer:t=!1}={}){this.record(e?"guarded":"hit"),this._contactPending=!0,this.hitPauseTime>0&&(this._holdCollisionFrame=!0),t||this.finishContacts()}finishContacts(){var e;this._contactPending&&(this._contactPending=!1,this.remainingHits--,this.nextHitAge=this.activeTicks+((e=this.world)!=null&&e.orderedPhases?Math.max(1,this.missTime):this.missTime+1),this.spec.projremove!==0&&this.remainingHits<=0&&this.remove("hit"))}cancel(){!this.removing&&!this.removed&&(this.record("cancel"),this.hitPauseTime=0,this.remove("cancel"))}clash(e){var t,i;this.priority>e.priority?this.priority--:this.remainingHits--,this.remainingHits<=0?this.cancel():this.hitPauseTime=Math.max(this.hitPauseTime,((i=(t=this.hitDef)==null?void 0:t.pauseTime)==null?void 0:i[0])||0)}remove(e="expire"){if(!(this.removing||this.removed)){if(this.removing=!0,this.hitDef=null,this.removalReason=e,this._removeAtLoopEnd=this._loopedThisTick,this.hitPauseTime>0){this._holdCollisionFrame=!0;return}this.beginRemoval()}}beginRemoval(){var l;this.removalStarted=!0;const e=this.removalReason,t=this.spec.projhitanim??-1,i=this.spec.projremanim??t,s=e==="hit"?t:e==="cancel"?this.spec.projcancelanim??i:i,r=$n(this.spec.remvelocity);if(this.vel={x:r[0]*this.coordinateScale,y:r[1]*this.coordinateScale},s<0){this.removed=!0,this.drawVisible=!1;return}let a=!1;if(this.animations.has(s)?Math.trunc(s)!==this.anim&&(a=!0,this._loopedThisTick=!1,this.anim=Math.trunc(s),this.frameIndex=this.frameTime=0):this.diagnostic("missing-animation",`Projectile removal animation ${s} does not exist; retaining action ${this.anim}.`),(a||!this.collisionFrame)&&(this.collisionFrame=this.currentFrame,this.collisionAnimation=this.animations.get(this.anim),this.collisionFrameIndex=this.frameIndex,this.collisionFrameTime=this.frameTime),!a&&this._removeAtLoopEnd&&this._inTick){this.removed=!0,this.drawVisible=!1;return}const o=((l=this.animations.get(this.anim))==null?void 0:l.frames)||[];if(o.some(c=>c.ticks<0)||o.reduce((c,h)=>c+h.ticks,0)<=0){this.removed=!0,this.drawVisible=!1;return}this.drawVisible=!!this.collisionFrame,a&&!this._inTick?this.advanceFrame():!a&&!this._inTick&&this._loopedThisTick&&(this.removed=!0)}advanceFrame(){const e=this.currentFrame,t=this.animations.get(this.anim);e&&e.ticks>=0&&++this.frameTime>=Math.max(1,e.ticks)&&(this.frameTime=0,this.frameIndex++,this.frameIndex>=t.frames.length&&(this._loopedThisTick=!0,this.animationLooped=!0,this.removing&&(this.removed=!0),this.frameIndex=t.loopStart||0))}tick({paused:e=!1}={}){var t,i,s,r;if(this.events=[],this._activeThisTick=!1,this.removed){this.drawVisible=!1;return}if(!e){if(this.drawVisible=!0,this._holdCollisionFrame||this.captureFrame(),this.hitPauseTime>0){this.hitPauseTime--;return}if(this._holdCollisionFrame=!1,this._inTick=!0,this._loopedThisTick=!1,this.removing&&!this.removalStarted&&this.beginRemoval(),!this.removing){const a=$n(this.spec.projheightbound,[-240/this.coordinateScale,1/this.coordinateScale]).map(_=>_*this.coordinateScale),o=(this.spec.projedgebound??40/this.coordinateScale)*this.coordinateScale,l=(this.spec.projstagebound??40/this.coordinateScale)*this.coordinateScale,c=((t=this.world)==null?void 0:t.leftBound)??-160,h=((i=this.world)==null?void 0:i.rightBound)??160,f=((s=this.world)==null?void 0:s.view.left)??c,u=((r=this.world)==null?void 0:r.view.right)??h,d=this.spec.projremovetime??-1,p=this.vel.x*this.facing;(d>=0&&this.time>=d||d<=-2&&this.animationLooped||this.pos.x<f-o||this.pos.x>u+o||p<0&&this.pos.x<c-l||p>0&&this.pos.x>h+l||this.vel.y<0&&this.pos.y<a[0]||this.vel.y>0&&this.pos.y>a[1])&&this.remove()}this.removed||(this.captureFrame(),this._activeThisTick=!0,this.activeTicks++,this.pos.x+=this.vel.x*this.facing,this.pos.y+=this.vel.y,this.removing||(this.vel.x=(this.vel.x+this.accel[0])*this.velmul[0],this.vel.y=(this.vel.y+this.accel[1])*this.velmul[1]),this.advanceFrame(),this.time++),this._inTick=!1}}finishMovementAllowance({paused:e=!1}={}){var t,i,s;if(!(e||!this._activeThisTick||this._hitPausedThisTick||this.hitPauseTime>0)){if((t=this.world)!=null&&t.orderedPhases){((i=this.world.pause)==null?void 0:i.remaining)>0&&(this.pauseMoveTime=Math.max(0,this.pauseMoveTime-1)),((s=this.world.superPause)==null?void 0:s.remaining)>0&&(this.superMoveTime=Math.max(0,this.superMoveTime-1));return}this.pauseMoveTime=Math.max(0,this.pauseMoveTime-1),this.superMoveTime=Math.max(0,this.superMoveTime-1)}}captureFrame(){this.collisionFrame=this.currentFrame,this.collisionAnimation=this.animations.get(this.anim),this.collisionFrameIndex=this.frameIndex,this.collisionFrameTime=this.frameTime}}const Ut=(n,e,t)=>Math.max(e,Math.min(t,n)),fs=(n,e=0)=>n===void 0||n===""?e:Number(n),ft=(n,e=[0,0])=>n===void 0?[...e]:String(n).split(",").map((t,i)=>fs(t.trim(),e[i]??0)),vn=n=>String(n??"").replace(/^"(.*)"$/,"$1"),up=new Set(["normal","anim","parallax","dummy","video"]),dp=new Set(["null","anim","visible","enable","posset","posadd","velset","veladd","sinx","siny"]);function fp(n){var t,i;const e=[];for(const s of Object.keys(n).filter(r=>r.endsWith(".def"))){const r=an(n[s]),a=Pa(r);if(a.bgdef)try{e.push(pp(s,n,r,a))}catch(o){e.push({path:s,name:((t=a.info)==null?void 0:t.displayname)||((i=a.info)==null?void 0:i.name)||s,files:n,invalid:!0,diagnostics:[{source:s,line:0,type:"stage",message:o.message}]})}}return e}function pp(n,e,t=an(e[n]),i=Pa(t)){var x,P,T,I,U;const s=[],r=(D,w,O="stage")=>s.push({source:n,line:(w==null?void 0:w.line)||0,type:O,message:D}),a=n.slice(0,n.lastIndexOf("/")+1),o=n.indexOf("/stages/"),l=o>=0?n.slice(0,o+1):"",c=D=>{D=vn(D);const w=[...new Set([a,l,"",l+"video/","video/"])],O=String(D).replaceAll("\\","/").split("/").at(-1),z=w.map(L=>{try{return wn(D,L,!0)}catch{return null}}).find(L=>L&&e[L]);if(z)return z;if(O&&O!=="."&&O!=="..")try{const L=wn(O,a);if(e[L])return L}catch{}return null},h=ft((x=i.stageinfo)==null?void 0:x.localcoord,[320,240]);if(h.length!==2||h.some(D=>!Number.isFinite(D)||D<=0))throw Error("Invalid stage localcoord.");const f=320/h[0],u=i.camera||{},d=i.playerinfo||{},p=i.bound||{},_=i.stageinfo||{},m=(D,w,O)=>{const B=fs(D[w],O);if(!Number.isFinite(B))throw Error(`Invalid stage numeric value ${w}.`);return B},v={startX:m(u,"startx",0)*f,startY:m(u,"starty",0)*f,left:m(u,"boundleft",0)*f,right:m(u,"boundright",0)*f,high:m(u,"boundhigh",-25)*f,low:m(u,"boundlow",0)*f,tension:Math.max(0,m(u,"tension",60)*f),floorTension:m(u,"floortension",0)*f,verticalFollow:Ut(m(u,"verticalfollow",.2),0,1),zoomIn:m(u,"zoomin",1),zoomOut:m(u,"zoomout",1),startZoom:m(u,"startzoom",1)};if(Object.assign(v,{autoCenter:m(u,"autocenter",0)!==0,zoomInDelay:Math.max(0,Math.trunc(m(u,"zoomindelay",0))),zoomInSpeed:Ut(m(u,"zoominspeed",1),0,1),zoomOutSpeed:Ut(m(u,"zoomoutspeed",1),0,1),tensionVelocity:Ut(m(u,"tensionvel",1),0,1),yScrollSpeed:Ut(m(u,"yscrollspeed",1),0,1),boundHighZoomDelta:Math.max(0,m(u,"boundhighzoomdelta",0)),verticalFollowZoomDelta:Math.max(0,m(u,"verticalfollowzoomdelta",0)),zoomAnchor:vn(u.zoomanchor||"center").toLowerCase()}),!["center","bottom"].includes(v.zoomAnchor))throw Error("Invalid camera zoomanchor.");if(v.boundHighZoomDelta&&r("Camera boundhighzoomdelta curve is not implemented.",null,"unsupported-stage-camera"),v.left>v.right||v.high>v.low||v.zoomOut<=0||v.zoomIn<v.zoomOut)throw Error("Invalid stage camera bounds or zoom limits.");const y=i.bgdef.spr?c(i.bgdef.spr):null;y||r(`Stage sprite file is missing: ${i.bgdef.spr||"(unspecified)"}`);const A=i.music||{},R=A.bgmvolume!==void 0?m(A,"bgmvolume",100):100*(1+Ut(m(A,"bgvolume",0),-255,255)/256),S={path:n,name:((P=i.info)==null?void 0:P.displayname)||((T=i.info)==null?void 0:T.name)||n,files:e,def:i,localcoord:h,coordinateScale:f,camera:v,sprite:y?{path:y}:null,animations:Su(t),elements:[],controllers:[],diagnostics:s,leftBound:m(d,"leftbound",-1e3)*f,rightBound:m(d,"rightbound",1e3)*f,starts:[1,2].map(D=>({x:m(d,`p${D}startx`,D===1?-70:70)*f,y:m(d,`p${D}starty`,0)*f,facing:m(d,`p${D}facing`,D===1?1:-1)<0?-1:1})),screenLeft:Math.max(0,m(p,"screenleft",15)*f),screenRight:Math.max(0,m(p,"screenright",15)*f),zoffset:m(_,"zoffset",200)*f,resetBG:m(_,"resetbg",1)!==0,autoturn:m(_,"autoturn",1)!==0,xscale:m(_,"xscale",1),yscale:m(_,"yscale",1),backgroundScale:m(_,"hires",0)!==0?.5:1,zoffsetlink:_.zoffsetlink===void 0?null:m(_,"zoffsetlink",0),cropHigh:Math.max(0,m(u,"cuthigh",0)*f),cropLow:Math.max(0,m(u,"cutlow",0)*f),music:{path:A.bgmusic?c(A.bgmusic):null,requested:A.bgmusic||"",volume:R,loop:m(A,"bgmloop",1)!==0,loopStart:m(A,"bgmloopstart",0),loopEnd:m(A,"bgmloopend",0)}};if(S.shadow={intensity:Ut(m(i.shadow||{},"intensity",128),0,256),color:ft((I=i.shadow)==null?void 0:I.color,[0,0,0]),yscale:m(i.shadow||{},"yscale",.4),fade:(U=i.shadow)!=null&&U["fade.range"]?ft(i.shadow["fade.range"]):null},S.reflection=Ut(m(i.reflection||{},"intensity",0),0,256),i.bgdef.model){const D=i.model||{},w=i.bgdef,O=(B,z)=>{const L=ft(B,z);if(L.length!==3||L.some(C=>!Number.isFinite(C)))throw Error("Invalid model transform.");return L};if(S.model={path:c(w.model),requested:w.model,scene:Math.max(0,Math.trunc(m(w,"scenenumber",0))),offset:O(w.modeloffset??D.offset,[0,0,0]),rotation:O(w.modelrotate??D.rotate,[0,0,0]),scale:O(w.modelscale??D.scale,[1,1,1]),camera:{fov:m(w,"fov",m(u,"fov",0)),near:m(w,"near",m(u,"near",0)),far:m(w,"far",m(u,"far",0)),yShift:m(u,"yshift",0)},environment:D.environment?c(D.environment):null,environmentRequested:D.environment||"",environmentIntensity:Math.max(0,m(D,"environmentintensity",1))},S.model.path||r(`Stage model is missing: ${w.model}`,null,"stage-model"),S.model.environmentRequested&&!S.model.environment&&r(`Model environment is missing: ${D.environment}`,null,"stage-model"),S.model.camera.fov<0||S.model.camera.fov>=180||S.model.camera.near<0||S.model.camera.far<0)throw Error("Invalid model camera configuration.")}if(S.leftBound>=S.rightBound)throw Error("Invalid stage player bounds.");S.music.requested&&!S.music.path&&r(`Stage music is missing: ${S.music.requested}`);let M={ids:null,loop:-1};const g=new Set(["type","spriteno","actionno","id","layerno","start","delta","trans","alpha","mask","velocity","tile","tilespacing","positionlink","sin.x","sin.y","window","maskwindow","windowdelta","xscale","width","yscalestart","yscaledelta","scalestart","scaledelta","zoomdelta","path","loop","volume","scalemode","scalefilter","angle","xangle","yangle"]);for(const D of zo(t,n)){const w=D.values;if(/^bgctrldef(?:\s|$)/.test(D.name))M={ids:w.ctrlid===void 0?null:ft(w.ctrlid,[]),loop:m(w,"looptime",-1)};else if(/^bgctrl(?:\s|$)/.test(D.name)){const O=vn(w.type).toLowerCase();if(!dp.has(O)){r(`Background controller ${O} is not implemented.`,D,"unsupported-stage-controller");continue}const B=ft(w.time,[0]);for(const[z,L]of Object.entries(w))if(z!=="type"&&ft(L,[]).some(C=>!Number.isFinite(C)))throw Error(`Invalid background controller ${z} at line ${D.line}.`);S.controllers.push({type:O,time:[B[0],B[1]??B[0],B[2]??-1],groupLoop:M.loop,ids:w.ctrlid===void 0?M.ids:ft(w.ctrlid,[]),values:w,line:D.line})}else if(/^bg(?:\s|$)/.test(D.name)){const O=vn(w.type||"normal").toLowerCase();if(!up.has(O)){r(`Background type ${O} is not implemented.`,D,"unsupported-stage");continue}const B=O==="anim"||O==="parallax"&&w.actionno!==void 0,z=vn(w.trans||"default").toLowerCase(),L={type:O,animated:B,id:m(w,"id",0),layer:m(w,"layerno",0),start:ft(w.start),delta:ft(w.delta,[1,1]),velocity:ft(w.velocity),spriteno:ft(w.spriteno),anim:m(w,"actionno",0),mask:B||m(w,"mask",["add","sub"].includes(z)?1:0)!==0,trans:z,alpha:ft(w.alpha,z==="addalpha"?[256,0]:[256,256]),tile:ft(w.tile),spacing:ft(w.tilespacing),link:m(w,"positionlink",0)!==0,sinX:ft(w["sin.x"],[0,0,0]),sinY:ft(w["sin.y"],[0,0,0]),xscale:ft(w.xscale,[1,1]),width:w.width===void 0?null:ft(w.width),yScaleStart:m(w,"yscalestart",100)/100,yScaleDelta:m(w,"yscaledelta",0)/100,scaleStart:ft(w.scalestart,[1,1]),scaleDelta:ft(w.scaledelta),zoomDelta:m(w,"zoomdelta",1),window:w.maskwindow?ft(w.maskwindow,[]):w.window?ft(w.window,[]):null,windowCentered:!!w.maskwindow,windowDelta:ft(w.windowdelta),transSpecified:w.trans!==void 0,line:D.line};if(L.angle=m(w,"angle",0),L.xangle=m(w,"xangle",0),L.yangle=m(w,"yangle",0),O==="video"){const C=vn(w.scalemode||"none").toLowerCase();if(!["none","fit","fitwidth","fitheight","zoomfill","stretch"].includes(C))throw Error(`Invalid video scalemode at line ${D.line}.`);L.video={path:w.path?c(w.path):null,requested:w.path||"",loop:m(w,"loop",0)!==0,volume:Ut(m(w,"volume",100),0,200),scaleMode:C,filter:vn(w.scalefilter||"fastbilinear").toLowerCase(),key:"@video/"+S.elements.length},L.video.path||r(`Stage video is missing: ${w.path||"(unspecified)"}`,D,"stage-video")}for(const[C,H]of Object.entries(L))if(Array.isArray(H)&&H.some(W=>!Number.isFinite(W)))throw Error(`Invalid background ${C} at line ${D.line}.`);for(const C of["start","delta","velocity","spriteno","alpha","tile","spacing","xscale","scaleStart","scaleDelta","windowDelta"])if(L[C].length!==2)throw Error(`Invalid background ${C} at line ${D.line}.`);if(L.width&&L.width.length!==2||L.window&&L.window.length!==4)throw Error(`Invalid background dimensions at line ${D.line}.`);if(B&&!S.animations.some(C=>C.id===L.anim)&&r(`Stage action ${L.anim} is missing.`,D),B&&L.tile.some((C,H)=>C&&L.spacing[H]<=0)&&O!=="parallax"&&r("Animated background tiling requires positive tilespacing.",D),O==="parallax"&&w.xscale!==void 0&&(B||L.width))throw Error(`Parallax xscale cannot be combined with width or animation at line ${D.line}.`);for(const C of Object.keys(w))g.has(C)||r(`Background parameter ${C} is not implemented.`,D,"unsupported-stage-parameter");S.elements.push(L)}}if(S.elements.length>2048||S.controllers.length>4096)throw Error("Stage background/controller limit exceeded.");if(!i.bgdef.spr&&(S.model||S.elements.some(D=>D.type==="video"))&&(S.diagnostics=s.filter(D=>!D.message.startsWith("Stage sprite file is missing:"))),S.elements.filter(D=>D.type==="video").length>4)throw Error("Stage video-layer limit (4) exceeded.");return S}function Oc(n,e){return n[1]>0?n[0]*Math.sin(2*Math.PI*e/n[1]+(n[2]||0)*Math.PI/180):0}class mp{constructor(e){if(e.invalid)throw Error(e.diagnostics[0].message);this.definition=e,this.animations=new Map(e.animations.map(t=>[t.id,t])),this.diagnostics=[...e.diagnostics],this.reset()}reset({backgrounds:e=!0}={}){(e||!this.elements)&&(this.generation=(this.generation||0)+1);const t=this.definition;this.camera={x:Ut(t.camera.startX,t.camera.left,t.camera.right),y:Ut(t.camera.startY,t.camera.high,t.camera.low),zoom:Ut(t.camera.startZoom,t.camera.zoomOut,t.camera.zoomIn)},this.zoomWait=0,(e||!this.elements)&&(this.time=0,this.elements=t.elements.map(i=>({...i,start:[...i.start],motion:[0,0],velocity:[...i.velocity],sinX:[...i.sinX],sinY:[...i.sinY],sinStartX:0,sinStartY:0,anim:i.anim,frameIndex:0,frameTime:0,visible:!0,enabled:!0})))}updateCamera(e,{advance:t=!0}={}){e=e.filter(o=>!o.destroyed&&!o.isProjectile);const i=this.definition,s=i.camera,r=e.filter(o=>{var l;return((l=o.moveCamera)==null?void 0:l.x)!==!1}),a=e.filter(o=>{var l;return((l=o.moveCamera)==null?void 0:l.y)!==!1});if(r.length){const o=Math.min(...r.map(p=>p.pos.x)),l=Math.max(...r.map(p=>p.pos.x)),c=Ut(320/Math.max(1,l-o+2*s.tension),s.zoomOut,s.zoomIn);t&&(c>this.camera.zoom?this.zoomWait++>=s.zoomInDelay&&(this.camera.zoom+=(c-this.camera.zoom)*s.zoomInSpeed):(this.zoomWait=0,this.camera.zoom+=(c-this.camera.zoom)*s.zoomOutSpeed));const h=Math.max(1,160/this.camera.zoom-s.tension),f=l-h,u=o+h,d=s.autoCenter?(o+l)/2:f<=u?Ut(this.camera.x,f,u):(o+l)/2;(t||s.tensionVelocity===1)&&(this.camera.x=Ut(this.camera.x+(d-this.camera.x)*s.tensionVelocity,s.left,s.right))}if(a.length&&t){const o=s.verticalFollow+Math.max(0,this.camera.zoom-s.zoomOut)*s.verticalFollowZoomDelta,l=Ut(Math.min(0,Math.min(...a.map(c=>c.pos.y))+s.floorTension)*o,s.high,s.low);this.camera.y+=(l-this.camera.y)*s.yScrollSpeed}}view(e=this.viewportAspect){const t=this.definition,i=e||t.cropHigh+t.cropLow?320/(e||16/9):t.localcoord[1]*t.coordinateScale,s=Math.max(0,t.localcoord[1]*t.coordinateScale-i);let r=t.zoffset;if(t.zoffsetlink!==null){const f=this.elements.findIndex(u=>u.id===t.zoffsetlink);f>=0&&(r=this.position(f).y*t.coordinateScale)}const a=t.cropHigh+t.cropLow?s*t.cropHigh/(t.cropHigh+t.cropLow):Ut(r-i+12,0,s),o=r-a,l=320/this.camera.zoom,c=i/this.camera.zoom,h=t.camera.zoomAnchor==="bottom"?i-(i-o)*this.camera.zoom:o;return{left:this.camera.x-l/2,right:this.camera.x+l/2,top:this.camera.y-h/this.camera.zoom,bottom:this.camera.y+(i-h)/this.camera.zoom,width:l,height:c,displayHeight:i,groundY:h,zoffset:r,cropTop:a,zoom:this.camera.zoom}}position(e){let t=0,i=0,s=[1,1],r=0;for(let a=e;a>=0&&r++<2048;a--){const o=this.elements[a];if(t+=o.start[0]+o.motion[0]+Oc(o.sinX,this.time-o.sinStartX),i+=o.start[1]+o.motion[1]+Oc(o.sinY,this.time-o.sinStartY),s=o.delta,!o.link)break}return{x:t,y:i,delta:s}}tick({paused:e=!1}={}){if(!e){for(const t of this.definition.controllers){let i=t.groupLoop>0?this.time%t.groupLoop:this.time;if(t.time[2]>0&&(i%=t.time[2]),!(i<t.time[0]||i>t.time[1]))for(const s of this.elements){if(t.ids&&!t.ids.includes(s.id)&&!t.ids.includes(-1))continue;const r=t.values;if(t.type==="visible")s.visible=fs(r.value,1)!==0;else if(t.type==="enable")s.enabled=fs(r.value,1)!==0;else if(t.type==="anim")s.anim=fs(r.value,0),s.frameIndex=s.frameTime=0;else if(t.type==="sinx"||t.type==="siny"){const a=t.type==="sinx"?"sinX":"sinY";s[a]=ft(r.value,[0,0,0]),s[a==="sinX"?"sinStartX":"sinStartY"]=this.time}else if(/^(pos|vel)(set|add)$/.test(t.type)){for(const[a,o]of[["x",0],["y",1]])if(r[a]!==void 0){const l=fs(r[a]),c=t.type.startsWith("pos")?s.motion:s.velocity;t.type.endsWith("set")?c[o]=l-(c===s.motion?s.start[o]:0):c[o]+=l}}}}for(const t of this.elements)if(t.enabled){for(let r=0;r<2;r++)t.motion[r]+=t.velocity[r];t.drawFrameIndex=t.frameIndex,t.drawFrameTime=t.frameTime;const i=this.animations.get(t.anim),s=i==null?void 0:i.frames[t.frameIndex];t.animated&&s&&s.ticks>=0&&++t.frameTime>=Math.max(1,s.ticks)&&(t.frameTime=0,++t.frameIndex>=i.frames.length&&(t.frameIndex=i.loopStart||0))}this.time++}}frame(e){var t;return e.animated?(t=this.animations.get(e.anim))==null?void 0:t.frames[e.drawFrameIndex??e.frameIndex]:{group:e.spriteno[0],number:e.spriteno[1],x:0,y:0,flip:"",ticks:-1}}variable(e){var a;const[t,...i]=String(e).toLowerCase().split("."),s=(a=this.definition.def[t])==null?void 0:a[i.join(".")];if(s===void 0)throw Error(`StageVar ${e} is not implemented or missing.`);const r=Number(s);return Number.isFinite(r)?r:vn(s)}}const gp=n=>{if(n[0].life<=0&&n[1].life<=0)return"draw";if(n[0].life<=0)return"opponent";if(n[1].life<=0)return"player";const e=n[0].life*n[1].maxLife-n[1].life*n[0].maxLife;return e===0?"draw":e>0?"player":"opponent"};class vp{constructor({roundsToWin:e=2,roundTime:t=99,preIntro:i=30,introHold:s=30,overTime:r=60,resultTime:a=90,autoAdvance:o=!0}={}){for(const[l,c]of Object.entries({roundsToWin:e,roundTime:t,preIntro:i,introHold:s,overTime:r,resultTime:a}))if(!Number.isFinite(c)||c<0)throw Error(`Invalid match rule ${l}.`);if(e<1||e>99||t>3600)throw Error("Match rule exceeds supported bounds.");this.rules={roundsToWin:Math.trunc(e),roundTime:t,preIntro:Math.trunc(i),introHold:Math.trunc(s),overTime:Math.trunc(r),resultTime:Math.trunc(a),autoAdvance:o},this.roundNo=1,this.roundsExisted=0,this.wins={player:0,opponent:0},this.matchOver=!1,this.roundWinner=null,this.reason=null,this.startRound()}startRound(){this.roundState=0,this.phaseTime=0,this.timeLeft=this.rules.roundTime?Math.round(this.rules.roundTime*60):-1,this.roundWinner=null,this.reason=null,this._awarded=!1}step({players:e,paused:t=!1,intro:i=!1,roundNotOver:s=!1,timerFreeze:r=!1,noKO:a=[!1,!1]}={}){const o=[];if(t)return o;if(this.roundState===0)return++this.phaseTime>=this.rules.preIntro&&(this.roundState=1,this.phaseTime=0),o;if(this.roundState===1)return this.phaseTime++,!i&&this.phaseTime>=this.rules.introHold&&(this.roundState=2,this.phaseTime=0,o.push({type:"fight"})),o;if(this.roundState===2){this.phaseTime++;const l=e.some((c,h)=>c.life<=0&&!a[h]);return!r&&this.timeLeft>0&&this.timeLeft--,(l||this.timeLeft===0)&&(this.roundWinner=gp(e),this.reason=l?e.every(c=>c.life<=0)?"double-ko":"ko":"time",this.roundState=3,this.phaseTime=0,o.push({type:"round-over",winner:this.roundWinner,reason:this.reason})),o}return this.roundState===3?(s||++this.phaseTime>=this.rules.overTime&&(!this._awarded&&this.roundWinner!=="draw"&&(this.wins[this.roundWinner]++,this._awarded=!0),this.matchOver=Object.values(this.wins).some(l=>l>=this.rules.roundsToWin),this.roundState=4,this.phaseTime=0,o.push({type:"result",winner:this.roundWinner,reason:this.reason,matchOver:this.matchOver})),o):(this.roundState===4&&!s&&!this.matchOver&&this.rules.autoAdvance&&++this.phaseTime>=this.rules.resultTime&&(this.roundNo++,this.roundsExisted++,this.startRound(),o.push({type:"next-round",roundNo:this.roundNo})),o)}}const Yt=["a","b","c","x","y","z","s"],$s=["U","D","B","F","UB","UF","DB","DF"],_p=new Set(["U","D","L","R",...Yt]),ga=3600,kc=128,Bc=4096;function xp(n){let e=null;for(let t=0;t<n.length;t++){const i=n[t];if((i==='"'||i==="'")&&(!e||e===i))e=e?null:i;else if(i===";"&&!e)return n.slice(0,t).trim()}return n.trim()}function ja(n){const e=n.match(/^(?:"([\s\S]*)"|'([\s\S]*)')$/);return e?e[1]??e[2]:n}function yp(n){let e=n.replace(/\s/g,"");if(!e)throw Error("Empty command symbol.");const t={source:n,strict:!1,hold:!1,release:!1,charge:0,tolerant:!1},i=new Set;for(;/^[>\/~$]/.test(e);){const r=e[0];if(i.has(r))throw Error(`Repeated ${r} modifier in ${n}.`);if(i.add(r),e=e.slice(1),r===">"&&(t.strict=!0),r==="/"&&(t.hold=!0),r==="$"&&(t.tolerant=!0),r==="~"){t.release=!0;const a=e.match(/^\d+/);if(a){if(t.charge=Number(a[0]),!Number.isSafeInteger(t.charge)||t.charge>ga)throw Error(`Charge duration exceeds the ${ga}-tick runtime limit.`);e=e.slice(a[0].length)}}}if(t.hold&&t.release)throw Error(`Hold and release cannot be combined in ${n}.`);const s=e.split("+");if(s.some(r=>!r)||new Set(s).size!==s.length)throw Error(`Invalid simultaneous input ${n}.`);if(s.length===1&&$s.includes(s[0]))t.kind="direction",t.keys=s,t.key=(t.tolerant?"$":"")+s[0];else if(s.every(r=>Yt.includes(r))){if(t.tolerant)throw Error(`The $ modifier is only valid on directions: ${n}.`);t.kind="button",t.keys=s}else if(s.filter(r=>$s.includes(r)).length===1&&s.every(r=>$s.includes(r)||Yt.includes(r)))t.kind="chord",t.keys=s.map(r=>$s.includes(r)&&t.tolerant?"$"+r:r);else throw Error(`Unsupported command symbol ${n}. Directions are uppercase and buttons are lowercase.`);return t}function Sp(n){const e=n.split(",").map(yp),t=[];for(const i of e){const s=t.at(-1);(s==null?void 0:s.kind)==="direction"&&i.kind==="direction"&&s.key===i.key&&!s.hold&&!s.release&&!i.hold&&!i.release?(t.push({...i,source:`>~${i.key}`,strict:!0,release:!0,charge:0}),t.push({...i,strict:!0})):t.push(i)}if(t.length>kc)throw Error(`Command exceeds the ${kc}-symbol runtime limit.`);return t}function Hl(n){const e=[];let t;for(const[c,h]of String(n).replace(/^\uFEFF|^ï»¿/,"").split(/\r?\n/).entries()){const f=xp(h),u=f.match(/^\[([^\]]+)\]$/);if(u)t={name:u[1].trim().toLowerCase(),line:c+1,values:{}},e.push(t);else if(t){const d=f.indexOf("=");d>0&&(t.values[f.slice(0,d).trim().toLowerCase()]=f.slice(d+1).trim())}}const i=[],s={time:15,bufferTime:1},r=Object.fromEntries(Yt.map(c=>[c,c])),a=(c,h,f=ja(c.values.name??""))=>{i.push({kind:"command",name:f,line:c.line,message:h})};function o(c,h,f,u,d){if(c==null)return h;if(!/^[-+]?\d+$/.test(c.trim())||!Number.isSafeInteger(Number(c)))throw Error(`${u} must be an integer.`);const p=Math.max(1,Number(c));if(p>d){if(u==="buffer.time"||u==="command.buffer.time")return d;throw Error(`${u} exceeds the ${d}-tick runtime limit.`)}return p}for(const c of e){if(c.name==="defaults")try{s.time=o(c.values["command.time"],s.time,c,"command.time",ga),s.bufferTime=o(c.values["command.buffer.time"],s.bufferTime,c,"command.buffer.time",30)}catch(h){a(c,h.message)}if(c.name==="remap")for(const[h,f]of Object.entries(c.values)){const u=ja(f);!Yt.includes(h)||u&&!Yt.includes(u)?a(c,`Unsupported button remap ${h} = ${f}.`):r[h]=u}}const l=[];for(const c of e){if(c.name!=="command")continue;if(l.length>=Bc){a(c,`Command count exceeds the ${Bc}-command runtime limit.`);break}const{values:h}=c,f=ja(h.name??"");try{if(!f)throw Error("Command is missing its name.");if(!h.command)throw Error("Command is missing its input sequence.");const u=Sp(h.command);l.push({name:f,command:h.command,sequence:u,time:o(h.time,s.time,c,"time",ga),bufferTime:o(h["buffer.time"],s.bufferTime,c,"buffer.time",30),line:c.line,holdOnly:u.every(d=>d.hold)})}catch(u){a(c,u.message,f)}}return{commands:l,defaults:s,remap:r,diagnostics:i}}function Mp(n,e,t){const i=new Set;n.has("U")!==n.has("D")&&i.add(n.has("U")?"U":"D"),n.has("L")!==n.has("R")&&i.add(n.has(e<0?"L":"R")?"F":"B");for(const s of Yt)n.has(s)&&t[s]&&i.add(t[s]);return i}function bp(n){const e=new Set(Yt.filter(i=>n.has(i))),t=(n.has("U")?"U":n.has("D")?"D":"")+(n.has("B")?"B":n.has("F")?"F":"");t&&e.add(t);for(const i of $s)[...i].every(s=>n.has(s))&&e.add("$"+i);return e}function wp(n){return n.kind==="direction"?[n.key]:n.keys}function yr(n,e){const t=wp(n);return n.hold?t.every(i=>e.held.has(i)):n.release?t.every(i=>e.released.has(i)&&(e.previousDurations.get(i)??0)>=n.charge):t.every(i=>n.kind==="chord"&&!Yt.includes(i)?e.held.has(i):e.pressed.has(i))}function Ep(n){if(n.hold)return[];const e=n.release?"release:":"press:";return n.kind==="chord"?n.keys.filter(t=>Yt.includes(t)||n.release).map(t=>e+(Yt.includes(t)?t:"direction")):n.kind==="direction"?[e+"direction"]:n.keys.map(t=>e+t)}function zc(n,e,t){if(n.kind==="chord"){const i=new Set;for(const s of n.keys)if(Yt.includes(s))for(const r of Yt)t[r]===s&&i.add(r);else for(const r of s.replace("$",""))i.add(r==="F"?e.facing<0?"L":"R":r==="B"?e.facing<0?"R":"L":r);return i}return n.kind==="button"?new Set(Yt.filter(i=>n.keys.includes(t[i]))):new Set([...n.keys[0]].map(i=>i==="F"?e.facing<0?"L":"R":i==="B"?e.facing<0?"R":"L":i))}class Qs{constructor(e={commands:[]}){typeof e=="string"&&(e=Hl(e)),this.commands=e.commands??[],this.remap=e.remap??Object.fromEntries(Yt.map(t=>[t,t])),this.diagnostics=[...e.diagnostics??[]],this.historyLimit=Math.max(1,...this.commands.map(t=>t.time+1)),this.reset()}reset(){this.tick=-1,this.history=[],this.buffered=new Map,this.active=new Set,this.previous={raw:new Set,held:new Set,durations:new Map}}update(e,t=1){this.tick++;const i=new Set([...e].filter(l=>_p.has(l))),s=bp(Mp(i,t,this.remap)),r=this.previous,a={tick:this.tick,raw:i,facing:t,held:s,pressed:new Set([...s].filter(l=>!r.held.has(l))),released:new Set([...r.held].filter(l=>!s.has(l))),previousDurations:r.durations,durations:new Map([...s].map(l=>[l,(r.durations.get(l)??0)+1])),changes:new Set([...i,...r.raw].filter(l=>i.has(l)!==r.raw.has(l)))};this.previous=a,this.history.push(a),this.history.length>this.historyLimit&&this.history.shift(),this.active=new Set;let o=25e4;for(const l of this.commands){if(l.holdOnly){l.sequence.every(h=>yr(h,a))&&this.active.add(l.name);continue}if(l.sequence.every(h=>!h.hold||yr(h,a))&&yr(l.sequence.at(-1),a)&&this.matchSequence(l,()=>--o>=0)&&this.buffered.set(l.name,this.tick+l.bufferTime-1),(this.buffered.get(l.name)??-1)>=this.tick&&this.active.add(l.name),o<0){this.diagnostics.some(h=>h.message==="Input matching work limit reached.")||this.diagnostics.push({kind:"command",message:"Input matching work limit reached."});break}}for(const[l,c]of this.buffered)c<this.tick&&this.buffered.delete(l);return this.active}matchSequence(e,t){const i=this.history.length-1,s=this.tick-e.time;let r=i,a=null,o=new Set;for(let l=e.sequence.length-1;l>=0;l--){const c=e.sequence[l],h=Ep(c);let f=-1;for(let u=r;u>=0&&this.history[u].tick>=s;u--){if(!t())return!1;if(u<r&&(o=new Set),!(!yr(c,this.history[u])||h.some(d=>o.has(d)))&&!(a!=null&&a.symbol.strict&&!this.strictBetween(u,a.index,c,a.symbol))){f=u;break}}if(f<0)return!1;f!==r&&(o=new Set);for(const u of h)o.add(u);r=f,a={index:f,symbol:c}}return!0}strictBetween(e,t,i,s){const r=this.history[t],a=zc(s,r,this.remap);if(e===t){for(const o of zc(i,r,this.remap))a.add(o);return[...r.changes].every(o=>a.has(o))}for(let o=e+1;o<t;o++)if(this.history[o].changes.size)return!1;return[...r.changes].every(o=>a.has(o))}}const Hc=["a","b","c","x","y","z","s"];function Ho(n){return Number.isFinite(Number(n))?Math.max(0,Math.min(8,Math.trunc(Number(n)))):0}function Ja(n){var t,i,s,r,a,o;let e=(i=(t=n.checks)==null?void 0:t.find(l=>l.key==="cmd"&&l.ok))==null?void 0:i.path;if(!e&&((r=(s=n.def)==null?void 0:s.files)!=null&&r.cmd))try{e=wn(n.def.files.cmd,((a=n.path)==null?void 0:a.slice(0,n.path.lastIndexOf("/")+1))||"",!0)}catch{}return Hl(e&&((o=n.files)!=null&&o[e])?an(n.files[e]):"")}function Vc(n){const e=[];let t=new Set,i=new Set,s=new Set;const r=(a=1,o=[])=>{const l=new Set([...t,...i,...o]),c=e.at(-1);c&&l.size===c.keys.size&&[...l].every(h=>c.keys.has(h))?c.duration+=a:e.push({keys:l,duration:a}),s=l};r();for(const a of n.sequence)if(a.kind==="direction"){const o=new Set(a.keys[0]);a.release?(t=o,r(Math.max(1,a.charge)),t=new Set,r()):(!a.hold&&o.size===t.size&&[...o].every(l=>t.has(l))&&(t=new Set,r()),t=o,r())}else if(a.release){r(Math.max(1,a.charge),a.keys);for(const o of a.keys)i.delete(o);r()}else{if(a.keys.some(o=>s.has(o))&&!a.hold&&r(),a.hold)for(const o of a.keys)i.add(o);r(1,a.keys)}return t=new Set,i=new Set,r(),e}class Tp{constructor(e,{level:t=4,seed:i=1831565813}={}){var r;this.level=Ho(t),this.seed=i>>>0||1,this.buffer=new Qs(e),this.inverse=new Map;for(const a of Hc){const o=((r=e.remap)==null?void 0:r[a])??a;o&&!this.inverse.has(o)&&this.inverse.set(o,a)}const s=e.commands.filter(a=>a.sequence.every(o=>o.kind!=="button"||o.keys.every(l=>this.inverse.has(l))));this.attacks=s.filter(a=>!a.holdOnly&&a.sequence.some(o=>o.kind==="button"&&o.keys.some(l=>l!=="s"))).slice(0,512),this.byName=new Map;for(const a of s)this.byName.has(a.name)||this.byName.set(a.name,[]),this.byName.get(a.name).push(a);this.recoveries=s.filter(a=>a.name.toLowerCase()==="recovery"),this.recoveryNames=new WeakMap,this.recoveryButton=0,this.recovering=!1,this.normal=this.attacks.filter(a=>a.sequence.length===1&&!a.sequence[0].release),this.special=this.attacks.filter(a=>!this.normal.includes(a)),this.plan=[],this.index=0,this.remaining=0,this.cooldown=0,this.raw=new Set,this.lastCommand=null}random(){let e=this.seed;return e^=e<<13,e^=e>>>17,e^=e<<5,this.seed=e>>>0,this.seed/4294967296}physical(e,t){return new Set([...e].map(i=>i==="F"?t<0?"L":"R":i==="B"?t<0?"R":"L":this.inverse.get(i)||i))}queue(e,t){this.plan=[{keys:new Set(e),duration:t}],this.index=0,this.remaining=0}chooseRecovery(e){var a;const t=(a=e.stateOwner)==null?void 0:a.program.states.get(e.stateNo);let i=t&&this.recoveryNames.get(t);if(t&&!i){i=new Set;for(const o of t.controllers){if(!["changestate","selfstate"].includes(o.type))continue;const l=o.entries.filter(c=>/^trigger(?:all|[1-9]\d*)$/.test(c.key)).map(c=>c.value).join(`
`);if(/\bcanrecover\b/i.test(l))for(const c of l.matchAll(/\bcommand\s*=\s*"([^"\\]*)"/gi))i.add(c[1])}this.recoveryNames.set(t,i)}const s=[...i||[]].flatMap(o=>this.byName.get(o)||[]),r=s.length?s:this.recoveries;if(r.length){const o=r[Math.floor(this.random()*r.length)];this.lastCommand=o.name,this.plan=Vc(o),this.index=0,this.remaining=0}else{const o=Hc.filter(l=>l!=="s"&&this.inverse.has(l));o.length&&this.queue([o[this.recoveryButton++%o.length]],1)}}choose(e,t){if(!e.ctrl||e.moveType==="H")return;const i=Math.abs(t.pos.x-e.pos.x),s=e.coordinateScale||1,r=e.constant("size.ground.front")*s+t.constant("size.ground.front")*(t.coordinateScale||1)+20*s;if(i>r){this.queue(["F"],4+Math.floor(this.random()*9));return}if(t.moveType==="A"&&this.random()<.12+.07*this.level){this.queue(this.random()<.3?["D","B"]:["B"],4+this.level);return}if(this.attacks.length){const a=this.special.length&&this.random()<.08+.055*this.level?this.special:this.normal.length?this.normal:this.attacks,o=a[Math.floor(this.random()*a.length)];this.lastCommand=o.name,this.plan=Vc(o),this.index=0,this.remaining=0}else this.queue([],2)}tick(e,t,{paused:i=!1,enabled:s=!0}={}){var r,a;if(!this.level||!s||!e.alive||!(t!=null&&t.alive))this.plan=[],this.index=0,this.remaining=0,this.cooldown=0,this.raw=new Set,this.recovering=!1;else if(!i){const o=e.moveType==="H"&&!!((r=e.getHitVars)!=null&&r.fall);o!==this.recovering&&(this.plan=[],this.index=0,this.remaining=0,this.cooldown=o?10-this.level:0,this.raw=new Set,this.recovering=o);const l=o&&["A","L"].includes(e.stateType)&&!!((a=e.resolveTrigger)!=null&&a.call(e,"canrecover"));o&&!l&&(this.plan=[],this.index=0,this.remaining=0,this.cooldown=10-this.level,this.raw=new Set),this.index>=this.plan.length&&(this.cooldown>0?this.cooldown--:o?(l&&this.chooseRecovery(e),this.cooldown=14-this.level):(this.choose(e,t),this.cooldown=Math.max(1,15-this.level*1.5)));const c=this.plan[this.index];c?(this.remaining<=0&&(this.remaining=c.duration),this.raw=this.physical(c.keys,e.facing),--this.remaining<=0&&this.index++):this.raw=new Set}return this.buffer.update(this.raw,e.facing)}}const Bn=(n,e=0)=>Number.isFinite(Number(n))?Number(n):e,Vo=n=>String(n??"").toUpperCase().replace(/\s/g,"");function ps(n,e,t){var r;const i=(r=n.program)==null?void 0:r.constants,s=i instanceof Map?i.get(e):i==null?void 0:i[e];return s===void 0?t:Bn(s,t)}function Gi(n,e="clsn1",t=n.collisionFrame??n.currentFrame){var h,f,u,d;if(!t||!Array.isArray(t[e]))return[];const i=Du(n),s=Ft(i),r=n.facing<0?-1:1,a=ps(i,"size.xscale",1)*s*r,o=ps(i,"size.yscale",1)*s,l=Bn((h=n.pos)==null?void 0:h.x)+ps(n,"size.draw.offset.x",0)*Ft(n)*r+Bn((f=n.drawOffset)==null?void 0:f.x),c=Bn((u=n.pos)==null?void 0:u.y)+ps(n,"size.draw.offset.y",0)*Ft(n)+Bn((d=n.drawOffset)==null?void 0:d.y);return t[e].filter(p=>Array.isArray(p)&&p.length>=4&&p.slice(0,4).every(_=>Number.isFinite(Number(_)))).map(p=>{const _=l+Number(p[0])*a,m=l+Number(p[2])*a,v=c+Number(p[1])*o,y=c+Number(p[3])*o;return[Math.min(_,m),Math.min(v,y),Math.max(_,m),Math.max(v,y)]})}function Ap(n,e,t=!1){return t?n[0]<=e[2]&&n[2]>=e[0]&&n[1]<=e[3]&&n[3]>=e[1]:n[0]<e[2]&&n[2]>e[0]&&n[1]<e[3]&&n[3]>e[1]}function Ns(n,e,t=!1){for(const i of n)for(const s of e)if(Ap(i,s,t))return[Math.max(i[0],s[0]),Math.max(i[1],s[1]),Math.min(i[2],s[2]),Math.min(i[3],s[3])];return null}function Cp(n,e){var i;const t=e.moveType==="H";return n.includes("+")&&!t||n.includes("-")&&t?!1:e.stateType==="L"?n.includes("D"):e.stateType==="A"?n.includes(e.moveType==="H"&&((i=e.getHitVars)!=null&&i.fall)?"F":"A"):n.includes("M")||n.includes(e.stateType==="C"?"L":"H")}function Rp(n,e,t,i){var l,c,h,f;const s=t.moveType==="H"&&!!((l=t.getHitVars)!=null&&l.guarded);if(!t.ctrl&&!s||t.moveType==="H"&&!s||!["S","C","A"].includes(t.stateType)||(c=e.asserted)!=null&&c.has("unguardable"))return!1;const r=t.stateType==="A"?"noairguard":t.stateType==="C"?"nocrouchguard":"nostandguard";if((h=t.asserted)!=null&&h.has(r))return!1;const a=new Set([...i].map(u=>String(u).toLowerCase()));if(!((f=t.world)!=null&&f.manageInputs?t.movementHeld("holdback"):a.has("holdback")))return!1;const o=Vo(n.guardFlag??n.guardflag);return t.stateType==="A"?o.includes("A"):t.stateType==="C"?/[LM]/.test(o):/[HM]/.test(o)}function Gc(n){const e=Array.isArray(n.priority)?n.priority:String(n.priority??"4,Hit").split(","),t=String(e[1]??"Hit").trim().toLowerCase();return{level:Math.max(1,Math.min(7,Bn(e[0],4))),type:["hit","miss","dodge"].includes(t)?t:"hit"}}function Pp(n){if(n.length<2)return n;const e=Gc(n[0].hit),t=Gc(n[1].hit);return e.level!==t.level?[n[e.level>t.level?0:1]]:e.type==="dodge"||t.type==="dodge"?[]:e.type==="miss"&&t.type==="miss"?[]:n.filter((i,s)=>(s?t:e).type==="hit")}class Ip{constructor(e,{commonText:t="",commonAnimations:i=new Map,opponentCharacter:s=e,leftBound:r=-150,rightBound:a=150,pushboxes:o=!0,maxHelpers:l=56,maxProjectiles:c=256,initialize:h=!0,skipIntro:f=!0,stage:u=null,rules:d=null,combatRules:p={},playerPalette:_=1,opponentPalette:m=1,playerAILevel:v=0,opponentAILevel:y=0,expressionEvaluator:A=null,programs:R=null,manageInputs:S=!1,orderedPhases:M=!1}={}){if(this.expressionEvaluator=A,this.programs=R,this.manageInputs=S,this.orderedPhases=M,this.combatRules=Zf(e.files,p),!Number.isFinite(r)||!Number.isFinite(a)||r>=a)throw Error("Invalid training stage bounds.");this.character=e,this.opponentCharacter=s,this.commonText=t,this.leftBound=r,this.rightBound=a,this.pushboxes=o,this.commonAnimations=i,this.maxHelpers=Math.min(256,Math.max(0,l)),this.maxProjectiles=Math.min(1024,Math.max(0,c)),this.initialize=h,this.skipIntro=f,this.playerPalette=_,this.opponentPalette=m,this.playerAILevel=Ho(v),this.opponentAILevel=Ho(y),this.stage=u?new mp(u):null,this.rules=d,this.stage&&(this.leftBound=u.leftBound,this.rightBound=u.rightBound),this.reset()}reset({preserveMatch:e=!1}={}){var s,r,a,o;const t=e?{players:[this.player,this.opponent],flow:this.roundFlow,ticks:this.ticks,diagnostics:this.diagnostics}:null;this.roundFlow=(t==null?void 0:t.flow)||(this.rules?new vp(this.rules):null),this.roundGeneration=(this.roundGeneration||0)+1,this.stage&&this.stage.reset({backgrounds:!e||this.stage.definition.resetBG});const i=((s=this.stage)==null?void 0:s.definition.starts)||[{x:-70,y:0,facing:1},{x:70,y:0,facing:-1}];if(this.player=new ma(this.character,{world:this,program:(r=this.programs)==null?void 0:r.get(this.character),expressionEvaluator:this.expressionEvaluator,commonAnimations:this.commonAnimations,commonText:this.commonText,position:i[0],facing:i[0].facing,id:1,teamSide:1,paletteNo:this.playerPalette,aiLevel:this.playerAILevel}),this.opponent=new ma(this.opponentCharacter,{world:this,program:(a=this.programs)==null?void 0:a.get(this.opponentCharacter),expressionEvaluator:this.expressionEvaluator,commonAnimations:this.commonAnimations,commonText:this.commonText,position:i[1],facing:i[1].facing,id:2,teamSide:2,paletteNo:this.opponentPalette,aiLevel:this.opponentAILevel}),this.player.teamSide=1,this.opponent.teamSide=2,this.player.opponent=this.opponent,this.opponent.opponent=this.player,this._entities=[this.player,this.opponent],this.projectiles=[],this.nextEntityId=3,this.orphanEffectOwners=[],this.renderEntities=[...this._entities],this.drawProjectiles=[],this.helperCommands=new Map,this.usedHits=new Map,this.juggles=new Map,this.cornerPushActors=new Set,this.archivedDiagnostics=[],this.archivedDiagnosticKeys=new Set,this.pendingPauses=[],this.pause=null,this.superPause=null,this.commandBuffers=new Map,this.presentationEvents=[],this.eventEntities=[],this.pendingCombatEffects=[],this.activeActor=null,this.contactPhase=!1,this.inputBuffers=new Map,this.inputProfiles=new Map,this.manageInputs)for(const l of this._entities)this.inputProfiles.has(l.character)||this.inputProfiles.set(l.character,Ja(l.character)),this.inputBuffers.set(l,new Qs(this.inputProfiles.get(l.character)));this.events=[],this.cpus=new Map;for(const l of this._entities)if(l.aiLevel){const c=Ja(l.character);this.cpus.set(l,new Tp(c,{level:l.aiLevel,seed:1831565813^l.id*2654435769^(((o=this.roundFlow)==null?void 0:o.roundNo)||1)}));for(const h of c.diagnostics)l.diagnostic("command",h.message,{source:l.character.def.files.cmd,line:h.line})}if(this.ticks=(t==null?void 0:t.ticks)||0,this.winner=null,t){this.archiveDiagnostics(t.diagnostics);for(const[l,c]of[this.player,this.opponent].entries()){const h=t.players[l];c.power=h.power,c.victoryQuoteIndex=h.victoryQuoteIndex;const f=Math.max(0,Math.min(60,Math.trunc(c.program.constants.get("data.intpersistindex")??60))),u=Math.max(0,Math.min(40,Math.trunc(c.program.constants.get("data.floatpersistindex")??40)));c.vars.set(h.vars.subarray(f),f),c.fvars.set(h.fvars.subarray(u),u)}}if(this.syncEnvironment(),this.initialize)for(const l of this._entities)l.program.states.has(5900)&&(l._initializing=!0,l.options.skipIntro=this.skipIntro,l.changeState(5900));return this}get diagnostics(){var i;const e=[...this.archivedDiagnostics,...((i=this.stage)==null?void 0:i.diagnostics)||[],...this.entities.flatMap(s=>s.diagnostics||[]),...this.orphanEffectOwners.flatMap(s=>s.diagnostics||[]),...this.projectiles.flatMap(s=>s.diagnostics||[]),...[...this.cpus||new Map].flatMap(([s,r])=>r.buffer.diagnostics.map(a=>({...a,source:s.character.def.files.cmd})))],t=new Set;return e.filter(s=>{const r=typeof s=="string"?s:JSON.stringify(s);return t.has(r)?!1:(t.add(r),!0)})}get entities(){return this._entities.filter(e=>!e.destroyed)}get view(){var e;return((e=this.stage)==null?void 0:e.view())||{left:-160,right:160,top:-200,bottom:40,width:320,height:240,displayHeight:240,groundY:200,zoom:1}}get matchOver(){var e;return((e=this.roundFlow)==null?void 0:e.matchOver)||!1}syncEnvironment(){for(const e of this._entities||[])this.stage&&(e.cameraPos=this.stage.camera,e.cameraZoom=this.stage.camera.zoom),this.roundFlow&&(e.roundState=this.roundFlow.roundState,e.roundNo=this.roundFlow.roundNo,e.roundsExisted=this.roundFlow.roundsExisted)}findPlayer(e){return this.entities.find(t=>t.id===e)}spawnHelper(e,t){if(this.entities.filter(s=>s.parent).length>=this.maxHelpers)return e.diagnostic("resource-limit",`Helper limit (${this.maxHelpers}) reached.`),null;const i=e.createHelper(t,{id:this.nextEntityId++});return i.destroyed?this.archiveDiagnostics(i.diagnostics):(this._entities.push(i),i.keyCtrl&&this.helperCommands.set(i,new Qs(Ja(i.root.character))),this.syncEnvironment()),i}spawnProjectile(e,t){if(this.projectiles.length>=this.maxProjectiles)return e.diagnostic("resource-limit",`Projectile limit (${this.maxProjectiles}) reached.`),null;const i=new Ls(e,t,{id:this.nextEntityId++});if(i.removed)return this.archiveDiagnostics(i.diagnostics),i;const s=Object.fromEntries(Object.entries(t).filter(([r])=>r.startsWith("afterimage.")).map(([r,a])=>[r.slice(11),a]));return Object.keys(s).length&&this.presentationEvents.push({...s,type:"afterimage",entity:i}),this.projectiles.push(i),i}retireEffects(e,{removeExplods:t=!1}={}){var i;if(!e._effectsDetached){if(e._effectsDetached=!0,t)e.explods=[],e.drawExplods=[];else if(e.drawExplods=[],e.explods.length){for(const s of e.explods)s.orphaned=!0;this.orphanEffectOwners.push(e)}for(const s of new Set([...this._entities,...this.orphanEffectOwners]))((i=s.bound)==null?void 0:i.target)===e&&(s.bound=null),kf(s,e)}}destroyHelper(e,{recursive:t=!1,removeExplods:i=!1}={}){const s=[e];if(t)for(const r of this._entities){let a=r.parent,o=0;for(;a&&o++<256;){if(a===e){s.push(r);break}a=a.parent}}for(const r of s)r.destroyed=!0;for(const r of s)this.retireEffects(r,{removeExplods:i})}requestPause(e,t){const i=Math.max(0,Math.trunc(t.time));if(!Number.isFinite(i)||i>36e4){e.diagnostic("resource-limit","Pause time must be between 0 and 360000 ticks.");return}const s={...t,owner:e,time:i,remaining:i,elapsed:0,moved:new Map,movetime:Math.max(0,Math.min(i,t.movetime||0)),endcmdbuftime:Math.max(0,Math.min(i,t.endcmdbuftime||0))};this.pendingPauses.push(s),t.type==="superpause"&&(e.power=Math.max(0,Math.min(e.maxPower,e.power+(t.poweradd||0))),this.presentationEvents.push({...s,type:"superpause"}))}isFrozen(e){var s,r;const t=((s=this.superPause)==null?void 0:s.remaining)>0?this.superPause:((r=this.pause)==null?void 0:r.remaining)>0?this.pause:null;if(!t)return!1;const i=e===t.owner?t.movetime:t.type==="superpause"?e.superMoveTime||0:e.pauseMoveTime||0;return e.isProjectile?i<=0:(t.moved.get(e)||0)>=i}isSuperUnhittable(e){var t;return((t=this.superPause)==null?void 0:t.remaining)>0&&this.superPause.owner===e&&this.superPause.unhittable!==0}advancePause(){var i,s;const e=((i=this.superPause)==null?void 0:i.remaining)>0?this.superPause:((s=this.pause)==null?void 0:s.remaining)>0?this.pause:null,t=r=>{for(const[a,{before:o,applied:l}]of(r==null?void 0:r.defence)||[])a.defenceMultiplier===l&&(a.defenceMultiplier=o)};if(e){for(const r of[...this.entities,...this.projectiles])!this.isFrozen(r)&&!r._hitPausedThisTick&&e.moved.set(r,(e.moved.get(r)||0)+1);e.remaining--,e.elapsed++,e.remaining||t(e)}for(const r of this.pendingPauses){const a=r.type==="superpause"?"superPause":"pause";if(t(this[a]),this[a]=r,a==="superPause"&&r.remaining>0){const o=r.p2defmul>0?r.p2defmul:this.combatRules.superTargetDefence||1.5;r.defence=new Map;for(const l of r.owner.targets){const c=l.defenceMultiplier,h=c/o;r.defence.set(l,{before:c,applied:h}),l.defenceMultiplier=h}}}this.pendingPauses=[]}tick(e=new Set,t=new Set,{playerInput:i=null,opponentInput:s=null}={}){var x,P,T,I,U,D,w,O,B,z;if(this.orderedPhases){for(const L of this.pendingCombatEffects){const{defender:C,attacker:H,damage:W,minimum:K,get:Q,give:G}=L;C.life=Math.max(K,Math.min(C.maxLife,C.life-W)),H&&(H.power=Math.max(0,Math.min(H.maxPower,H.power+Q)),C.power=Math.max(0,Math.min(C.maxPower,C.power+G)))}this.pendingCombatEffects=[];for(const L of this._entities)L._projectedLife=void 0}this.events=[],this.presentationEvents=[],e=e instanceof Set?e:new Set(e),t=t instanceof Set?t:new Set(t);const r=((x=this.superPause)==null?void 0:x.remaining)>0||((P=this.pause)==null?void 0:P.remaining)>0&&this.pause.pausebg!==0,a=((T=this.superPause)==null?void 0:T.remaining)>0||((I=this.pause)==null?void 0:I.remaining)>0,o=((U=this.pause)==null?void 0:U.remaining)>0?this.pause:null,l=((D=this.superPause)==null?void 0:D.remaining)>0?this.superPause:null;this.syncEnvironment(),this.cpus.has(this.player)&&(e=this.cpus.get(this.player).tick(this.player,this.opponent,{paused:this.isFrozen(this.player)||this.player.hitPauseTime>0,enabled:!this.roundFlow||this.roundFlow.roundState===2})),this.cpus.has(this.opponent)&&(t=this.cpus.get(this.opponent).tick(this.opponent,this.player,{paused:this.isFrozen(this.opponent)||this.opponent.hitPauseTime>0,enabled:!this.roundFlow||this.roundFlow.roundState===2})),this.cpus.has(this.player)&&(i=this.cpus.get(this.player).raw),this.cpus.has(this.opponent)&&(s=this.cpus.get(this.opponent).raw);const c=new Set([...this.entities,...this.projectiles].filter(L=>L.hitPauseTime>0)),h=new Set,f=[];for(let L=0;L<this._entities.length;L++){const C=this._entities[L];if(C.destroyed)continue;f.push(C);let H=C.root===this.player?e:t,W=C.root===this.player?i:s;if(this.manageInputs&&C.keyCtrl){W=new Set(W||[]);for(const G of C.pendingAssertedInputs)W.add(G==="F"?C.facing===1?"R":"L":G==="B"?C.facing===1?"L":"R":G);this.isFrozen(C)||C.pendingAssertedInputs.clear(),this.inputBuffers.has(C)||this.inputBuffers.set(C,new Qs(this.inputProfiles.get(C.root.character))),H=this.inputBuffers.get(C).update(W,C.facing)}else C.parent&&C.keyCtrl&&W!==null&&(H=this.helperCommands.get(C).update(W,C.facing));(!C.keyCtrl||this.roundFlow&&this.roundFlow.roundState!==2)&&(H=new Set);const K=C.teamSide===this.player.teamSide?this.opponent:this.player,Q=this.isFrozen(C);if(C._hitPausedThisTick=C.hitPauseTime>0,!Q&&!C._hitPausedThisTick&&(C._projectileContactShield=!1),Q){h.add(C);const G=((w=this.superPause)==null?void 0:w.remaining)>0?this.superPause:this.pause;if(G&&G.remaining<=G.endcmdbuftime){this.commandBuffers.has(C)||this.commandBuffers.set(C,new Set);for(const j of H)this.commandBuffers.get(C).add(j)}}else this.commandBuffers.has(C)&&(H=new Set([...H,...this.commandBuffers.get(C)]),this.commandBuffers.delete(C));this.activeActor=C;try{C.tick({commands:H,opponent:K,paused:Q,input:C.keyCtrl?W:new Set})}finally{this.activeActor=null}}for(const L of this.projectiles){const C=this.isFrozen(L);C&&h.add(L),L._hitPausedThisTick=L.hitPauseTime>0,L.tick({paused:C})}if(this.stage){for(const L of this.entities)L.screenBound!==!1&&(L.pos.x=Math.max(this.leftBound,Math.min(this.rightBound,L.pos.x)));this.stage.updateCamera(this.entities),this.syncEnvironment(),this.stage.tick({paused:r})}this.orderedPhases&&this.advanceCornerPush(h),this.constrainPositions()&&this.stage&&(this.stage.updateCamera(this.entities,{advance:!1}),this.syncEnvironment(),this.constrainPositions({push:!1}));const d=this.entities;for(const L of d)if(L.moveType!=="H"&&L.stateType!=="L")for(const C of this.juggles.values())C.delete(L.id);const p=this.projectiles.filter(L=>!L.removed&&!L.removing),_=p.map(L=>Gi(L,"clsn2"));for(let L=0;L<p.length;L++){const C=p[L];if(C.removing||!_[L].length)continue;const H=[];for(let K=L+1;K<p.length;K++){const Q=p[K];C.teamSide===Q.teamSide||Q.removing||h.has(C)&&h.has(Q)||!Ns(_[L],_[K],this.orderedPhases)||H.push(Q)}const W=K=>(K.pos.x-C.pos.x)**2+(K.pos.y-C.pos.y)**2;H.sort((K,Q)=>W(K)-W(Q)||K.id-Q.id);for(const K of H){if(C.removing)break;K.removing||(C.clash(K),K.clash(C))}}const m=this.orderedPhases?this.projectiles.filter(L=>!L.removed||L.drawVisible):p,v=[...d,...m];for(const L of d)L.inGuardDistance=Eu(L,v);const y=[],A=new Set;for(const L of d)if(!(!L.reversalDef||h.has(L)||c.has(L)||this.roundFlow&&this.roundFlow.roundState!==2))for(const C of d){const H=L.reversalDef;if(!H)break;const W=C.hitDef;if(!W||C===L||C.teamSide===L.teamSide||c.has(C)||A.has(C)||!L.attributeMatches(H["reversal.attr"],W.attr)||((O=this.usedHits.get(L))==null?void 0:O.get(C.id))===H.serial)continue;const K=Ns(Gi(L),Gi(C),this.orderedPhases);if(!K)continue;const Q=C.receiveHit(H,L);Q.rejected||(this.applyCornerPush(L,C,Q.cornerPush,H.coordinateScale),C.moveContact=C.moveHit=C.moveGuarded=0,C.moveReversed=1,C.hitDef=null,A.add(C),this.usedHits.has(L)||this.usedHits.set(L,new Map),this.usedHits.get(L).set(C.id,H.serial),this.events.push({type:"reversal",attacker:L,defender:C,hitDef:H,damage:Q.damage,guarded:!1,x:(K[0]+K[2])/2,y:(K[1]+K[3])/2,tick:this.ticks}))}const R=d.length>2?new Map:null;for(const L of[...d,...p]){if(this.winner||this.roundFlow&&this.roundFlow.roundState!==2||L.destroyed||h.has(L)||A.has(L)||c.has(L)||L.life<=0||L.moveType!=="A")continue;const C=L.hitDef;if(!C||!/^[SCA]\s*,\s*[NSH][ATP]$/i.test(String(C.attr??"").trim()))continue;const H=Vo(C.hitFlag??C.hitflag??"MAF");if(!/[HLAMFD]/.test(H)||H.includes("+")&&H.includes("-"))continue;const W=Vo(C.affectteam??"E"),K=C.serial??C,Q=this.usedHits.get(L);let G;for(const j of[...d].sort((re,le)=>Math.abs(re.pos.x-L.pos.x)-Math.abs(le.pos.x-L.pos.x))){if(L===j||L.isProjectile&&L.owner===j||j.life<=0||c.has(j))continue;const re=L.teamSide===j.teamSide;if(W==="E"&&re||W==="F"&&!re||!Cp(H,j)||(L instanceof Ls?!L.canHit(j,this.ticks):(Q==null?void 0:Q.get(j.id))===K))continue;if(G??(G=Gi(L)),!G.length)break;let le=R==null?void 0:R.get(j);le||(le=Gi(j,"clsn2"),R==null||R.set(j,le));const ae=Ns(G,le,this.orderedPhases);if(!ae||typeof j.canBeHit=="function"&&!j.canBeHit(C,L)||String(C[j.stateType==="A"?"air.type":"ground.type"]??C["ground.type"]??"high").toLowerCase()!=="none"&&!this.canJuggle(L,j,C))continue;const Ie=this.manageInputs||j.parent?j.commands:j===this.player?e:t;y.push({attacker:L,defender:j,hit:C,activation:K,overlap:ae,wasFalling:j.stateType==="L"||j.stateType==="A"&&j.moveType==="H"&&!!((B=j.getHitVars)!=null&&B.fall),guarded:Rp(C,L,j,Ie)})}}const S=y.filter(L=>{const C=y.find(H=>H.attacker===L.defender&&H.defender===L.attacker);return!C||Pp([L,C]).includes(L)}),M=new Set;for(const L of S){if(L.attacker instanceof Ls&&(L.defender._projectileContactShield||!L.attacker.canHit()))continue;let C;this.contactPhase=!0;try{C=L.defender.receiveHit(L.hit,L.attacker,{guarded:L.guarded})}finally{this.contactPhase=!1}C!=null&&C.rejected||(this.applyCornerPush(L.attacker,L.defender,C.cornerPush,L.hit.coordinateScale),!L.guarded&&!C.typeNone&&this.recordJuggle(L.attacker,L.defender,L.hit,{wasFalling:L.wasFalling}),this.usedHits.has(L.attacker)||this.usedHits.set(L.attacker,new Map),this.usedHits.get(L.attacker).set(L.defender.id,L.activation),L.attacker instanceof Ls&&(L.defender._projectileContactShield=!0,L.attacker.onContact({guarded:L.guarded,defer:!0}),M.add(L.attacker)),this.events.push({type:L.guarded?"guard":"hit",attacker:L.attacker,defender:L.defender,hitDef:L.hit,damage:(C==null?void 0:C.damage)??0,guarded:L.guarded,typeNone:!!C.typeNone,x:(L.overlap[0]+L.overlap[2])/2,y:(L.overlap[1]+L.overlap[3])/2,tick:this.ticks}))}for(const L of M)L.finishContacts();for(const L of this.projectiles)L.finishMovementAllowance({paused:h.has(L)});for(const L of this.entities)L.updateExplods({hitPaused:c.has(L),pause:o,superPause:l});for(const L of this._entities)L.destroyed&&!L._effectsDetached&&this.retireEffects(L);for(const L of this.orphanEffectOwners)L.updateExplods({pause:o,superPause:l});this.orphanEffectOwners=this.orphanEffectOwners.filter(L=>L.explods.length||L.drawExplods.length),this.drawProjectiles=this.projectiles.filter(L=>L.drawVisible),this.eventEntities=[...f,...this.projectiles],this.cleanupEntities(),this.advancePause(),this.ticks++;const g=L=>this.entities.some(C=>C.asserted.has(L));if(!this.roundFlow&&!g("noko")&&(this.player.life<=0||this.opponent.life<=0)&&(this.winner=this.player.life<=0&&this.opponent.life<=0?"draw":this.player.life<=0?"opponent":"player"),this.roundFlow){const L=this.roundFlow,C=[this.player,this.opponent],H=L.step({players:C,paused:a,intro:g("intro"),roundNotOver:g("roundnotover"),timerFreeze:g("timerfreeze"),noKO:C.map(()=>g("noko"))});this.syncEnvironment();for(const W of H){if(W.type==="fight")for(const K of C)K.stateNo===0&&(K.ctrl=1);if(W.type==="round-over"&&(this.winner=W.winner),W.type==="result")for(const K of C){const Q=W.winner===(K===this.player?"player":"opponent"),G=Q?180:W.reason==="time"?170:null;G!==null&&K.program.states.has(G)&&K.changeState(G,0,K)}W.type==="next-round"&&this.reset({preserveMatch:!0}),this.presentationEvents.push({...W,type:"round",event:W.type})}L.matchOver&&L.roundWinner!=="draw"&&((z=this[L.roundWinner])==null||z.selectVictoryQuote())}return this.events}cleanupEntities(){var t;const e=this._entities.filter(i=>i.destroyed);for(const i of e)i._effectsDetached||this.retireEffects(i);for(const i of[...e,...this.projectiles.filter(s=>s.removed)]){this.archiveDiagnostics(i.diagnostics),this.usedHits.delete(i),this.cornerPushActors.delete(i),this.commandBuffers.delete(i),this.inputBuffers.delete(i),this.helperCommands.delete(i),this.juggles.delete(i);for(const s of this.juggles.values())s.delete(i.id)}this._entities=this._entities.filter(i=>!i.destroyed),this.projectiles=this.projectiles.filter(i=>!i.removed);for(const i of this._entities){i.helpers=i.helpers.filter(s=>!s.destroyed),i.targets=i.targets.filter(s=>!s.destroyed&&(!this.orderedPhases||s.moveType==="H"));for(const s of i.targetHitIds.keys())i.targets.some(r=>r.id===s)||i.targetHitIds.delete(s);(t=i.bound)!=null&&t.target.destroyed&&(i.bound=null)}this.renderEntities=[...this._entities,...this.orphanEffectOwners].sort((i,s)=>i.id-s.id)}archiveDiagnostics(e){for(const t of e){const i=JSON.stringify(t);this.archivedDiagnosticKeys.has(i)||(this.archivedDiagnosticKeys.add(i),this.archivedDiagnostics.push(t))}}canJuggle(e,t,i){var c,h,f;if((c=(e.isProjectile?e.creator:e).asserted)!=null&&c.has("nojugglecheck")||!(t.stateType==="L"||t.stateType==="A"&&t.moveType==="H"&&((h=t.getHitVars)==null?void 0:h.fall)))return!0;const r=e.isProjectile?e.owner:e,a=(f=this.juggles.get(r))==null?void 0:f.get(t.id),o=(a==null?void 0:a.remaining)??r.constant("data.airjuggle"),l=e.isProjectile?i["air.juggle"]||0:(a==null?void 0:a.group)===i.juggleGroup?0:i.juggleCost||0;return o>=l}recordJuggle(e,t,i,{wasFalling:s=!1}={}){var h,f;if(!s&&!((h=t.getHitVars)!=null&&h.fall)&&t.stateType!=="L")return;const r=e.isProjectile?e.owner:e;this.juggles.has(r)||this.juggles.set(r,new Map);const a=this.juggles.get(r),o=a.get(t.id),l=(f=(e.isProjectile?e.creator:e).asserted)==null?void 0:f.has("nojugglecheck"),c=l?0:e.isProjectile?i["air.juggle"]||0:(o==null?void 0:o.group)===i.juggleGroup?0:i.juggleCost||0;a.set(t.id,{remaining:Math.max(0,((o==null?void 0:o.remaining)??r.constant("data.airjuggle"))-c),group:i.juggleGroup})}bodyWidth(e,t,i=!1){return sa(e,t,{edge:i})}horizontalLimits(e){var a,o;const t=l=>{var c,h;return Bn((h=(c=e.width)==null?void 0:c.edge)==null?void 0:h[e.facing===l?0:1])*e.coordinateScale},i=this.view;let s=this.orderedPhases?Math.max(this.leftBound,i.left+(((a=this.stage)==null?void 0:a.definition.screenLeft)||0)+t(-1)):this.stage?Math.max(this.leftBound,i.left+Math.max(this.stage.definition.screenLeft,this.bodyWidth(e,-1,!0))):this.leftBound+this.bodyWidth(e,-1,!0),r=this.orderedPhases?Math.min(this.rightBound,i.right-(((o=this.stage)==null?void 0:o.definition.screenRight)||0)-t(1)):this.stage?Math.min(this.rightBound,i.right-Math.max(this.stage.definition.screenRight,this.bodyWidth(e,1,!0))):this.rightBound-this.bodyWidth(e,1,!0);return s>r&&(s=r=(this.leftBound+this.rightBound)/2),{min:s,max:r}}applyCornerPush(e,t,i=0,s=e.coordinateScale){if(e instanceof Ls)return;if(this.orderedPhases){const l=t.pos.x===e.pos.x?e.facing:Math.sign(t.pos.x-e.pos.x);e.cornerPush=Math.fround(i*s*l),e.cornerPushTarget=e.cornerPush?t:null,e.cornerPushSide=l,e.cornerPush?this.cornerPushActors.add(e):this.cornerPushActors.delete(e);return}if(!i||t.screenBound===!1)return;const{min:r,max:a}=this.horizontalLimits(t),o=t.pos.x===e.pos.x?e.facing:Math.sign(t.pos.x-e.pos.x);(o>0?t.pos.x<a-.01:t.pos.x>r+.01)||(e.cornerPush=i*s*o)}advanceCornerPush(e){for(const t of this.cornerPushActors){if(!t.cornerPush||t.destroyed){this.cornerPushActors.delete(t),t.cornerPushTarget=null;continue}if(e.has(t)||t._hitPausedThisTick)continue;const i=t.cornerPushTarget;if(i&&!i.destroyed&&i.screenBound!==!1){const{min:s,max:r}=this.horizontalLimits(i);(t.cornerPushSide>0?i.pos.x>=r:i.pos.x<=s)&&(t.pos.x=Math.fround(t.pos.x+t.cornerPush))}t.cornerPush=Math.fround(t.cornerPush*Math.fround(.7)),Math.abs(t.cornerPush)<t.coordinateScale&&(t.cornerPush=0),t.cornerPush||(t.cornerPushTarget=null,this.cornerPushActors.delete(t))}}constrainPositions({push:e=!0}={}){const t=this.entities,i=new Map(t.map(o=>[o,this.horizontalLimits(o)])),s=o=>{if(o.screenBound!==!1){const{min:l,max:c}=i.get(o);o.pos.x=Math.max(l,Math.min(c,o.pos.x))}};if(t.forEach(s),!this.pushboxes||!e)return!1;let r=!1;const a=t.filter(o=>o.playerPush!==!1).sort((o,l)=>o.id-l.id);for(let o=0;o<a.length;o++)for(let l=o+1;l<a.length;l++){const c=a[o],h=a[l];if(c.teamSide===h.teamSide)continue;const f=c.pos.y-ps(c,"size.height",60)*Ft(c),u=h.pos.y-ps(h,"size.height",60)*Ft(h);if(f>=h.pos.y||u>=c.pos.y||!Ns(Gi(c,"clsn2"),Gi(h,"clsn2")))continue;const[d,p]=c.pos.x<=h.pos.x?[c,h]:[h,c],_=this.bodyWidth(d,1),m=this.bodyWidth(p,-1);for(let v=0;v<(this.orderedPhases?2:1);v++){const y=d.pos.x+_,A=p.pos.x-m,R=this.orderedPhases?Math.fround(Math.fround(y)-Math.fround(A)):d.pos.x+_-p.pos.x+m;if(R<=0||v&&!Ns(Gi(c,"clsn2"),Gi(h,"clsn2")))break;const S=d.screenBound===!1?1/0:Math.max(0,d.pos.x-i.get(d).min),M=p.screenBound===!1?1/0:Math.max(0,i.get(p).max-p.pos.x),g=Math.min(R/2,S),x=Math.min(R-g,M),P=d.pos.x,T=p.pos.x;if(d.pos.x-=Math.min(R-x,S),p.pos.x+=x,this.orderedPhases&&(d.pos.x=Math.fround(d.pos.x),p.pos.x=Math.fround(p.pos.x)),s(d),s(p),r=!0,d.pos.x===P&&p.pos.x===T)break}}return r}}const et=(n,e,t="")=>`
[Statedef ${n}]
${e}
${t}
`,be=(n,e,t="1")=>`
[State 0, ${n}]
type = ${n}
trigger1 = ${t}
${e}
`,tt=(n,e,t=1)=>be("ChangeState",`value = ${n}
ctrl = ${t}`,e),Ze=(n,e="time = 0")=>be("ChangeAnim",`value = ${n}`,`(${e}) && selfanimexist(${n})`);function zu({orderedPhases:n=!1}={}){return[et(0,`type = S
movetype = I
physics = S
ctrl = 1`,Ze(0,"anim != 0")+be("VelSet","y = 0","time = 0")+(n?be("VelSet","x=0","time>=4 || abs(vel x)<const(movement.stand.friction.threshold)"):"")),et(10,`type = C
movetype = I
physics = C`+(n?`
velset=0,0`:""),Ze(10)+tt(11,"animtime = 0 || !selfanimexist(10)")),et(11,`type = C
movetype = I
physics = C
ctrl = 1`,Ze(11)),et(12,`type = S
movetype = I
physics = S`,Ze(12)+tt(0,"animtime = 0 || !selfanimexist(12)")),et(20,`type = S
movetype = I
physics = S
ctrl = 1`,be("VelSet","x = const(velocity.walk.fwd.x)",'command = "holdfwd"')+be("VelSet","x = const(velocity.walk.back.x)",'command = "holdback"')+Ze(20,"vel x > 0 && anim != 20")+Ze(21,"vel x < 0 && anim != 21")),et(40,`type = S
movetype = I
physics = S
ctrl = 0`,Ze(40)+be("VelSet",`x = ifelse(command = "holdfwd", const(velocity.jump.fwd.x), ifelse(command = "holdback", const(velocity.jump.back.x), const(velocity.jump.neu.x)))
y = const(velocity.jump.y)`,"animtime = 0 || !selfanimexist(40)")+tt(50,"animtime = 0 || !selfanimexist(40)")),et(45,`type = A
movetype = I
physics = A
ctrl = 1`,be("VelSet",`x = ifelse(command = "holdfwd", const(velocity.airjump.fwd.x), ifelse(command = "holdback", const(velocity.airjump.back.x), const(velocity.airjump.neu.x)))
y = const(velocity.airjump.y)`,"time = 0")+tt(50,"time > 0")),et(50,`type = A
movetype = I
physics = A
ctrl = 1`,Ze("ifelse(vel x = 0, 41, ifelse(vel x > 0, 42, 43))")+tt(52,"pos y >= 0 && vel y > 0",0)),et(51,`type = A
movetype = I
physics = A`),et(52,`type = S
movetype = I
physics = S
ctrl = 0`+(n?`
velset=0,0
anim=47`:""),Ze(47)+be("PosSet","y = 0","time = 0")+be("VelSet","y = 0","time = 0")+(n?be("CtrlSet","value=1","time>=3"):"")+tt(0,"time >= 3 && (animtime = 0 || !selfanimexist(47))")),et(100,`type = S
movetype = I
physics = `+(n?"S":"N")+`
ctrl = 1`,Ze(100)+be("VelSet","x = const(velocity.run.fwd.x)")+be("AssertSpecial",`flag = nowalk
flag2 = noautoturn`)+tt(0,'command != "holdfwd"')),et(105,`type = A
movetype = I
physics = A
ctrl = 0`,Ze(105)+(n?be("CtrlSet","value=1","time>=2"):"")+be("VelSet",`x = const(velocity.run.back.x)
y = const(velocity.run.back.y)`,"time = 0")+tt(n?106:52,"pos y >= 0 && vel y > 0",0)),...n?[et(106,`type=S
movetype=I
physics=S
ctrl=0`,Ze(47)+be("PosSet","y=0")+be("VelSet","y=0")+be("VelSet","x=0","abs(vel x)<const(movement.stand.friction.threshold)")+tt(0,"time>=7"))]:[],...n?[et(120,`type=U
movetype=I
physics=U
ctrl=1`,Ze("ifelse(statetype=A,122,ifelse(statetype=C,121,120))")+be("VelSet",`x=0
y=0`,"statetype!=A")+be("ChangeState",`value=ifelse(statetype=A,50,ifelse(statetype=C,11,0))
ctrl=1`,'command!="holdback"')+be("ChangeState",`value=ifelse(statetype=A,132,ifelse(statetype=C,131,130))
ctrl=1`,"animtime=0 || !selfanimexist(ifelse(statetype=A,122,ifelse(statetype=C,121,120)))")),et(140,`type=U
movetype=I
physics=U
ctrl=1`,Ze("ifelse(statetype=A,142,ifelse(statetype=C,141,140))")+be("ChangeState",`value=ifelse(statetype=A,50,ifelse(statetype=C,11,0))
ctrl=1`,'animtime=0 || command!="holdback"'))]:[],...[[120,"S",130],[130,"S",130],[131,"C",131],[132,"A",132],[140,"S",130]].filter(([e])=>!n||e!==120&&e!==140).map(([e,t,i])=>et(e,`type = ${t}
movetype = I
physics = ${t}
ctrl = 1${t==="A"?"":`
velset = 0,0`}`,Ze(i)+(n?tt(140,"!inguarddist"):"")+tt(t==="A"?50:t==="C"?11:0,'command != "holdback"'))),...[[150,"S",150,151],[152,"C",151,153],[154,"A",152,155]].map(([e,t,i,s])=>et(e,`type=${t}
movetype=H
physics=N
ctrl=0
velset=0,0`,Ze(i)+tt(s,"hitshakeover",0))),...[[151,"S",150],[153,"C",151],[155,"A",152]].map(([e,t,i])=>et(e,`type=${t}
movetype=H
physics=${t==="A"?"N":t}
ctrl=0`,Ze(i)+be("HitVelSet",`x=1
y=1`,"time=0")+be("CtrlSet","value=1","time>=gethitvar(ctrltime)")+(t==="A"?be("Gravity","")+tt(52,"pos y>=0 && vel y>0",0)+tt(132,"time>=gethitvar(ctrltime)"):be("VelSet","x=0","time>=gethitvar(slidetime)||hitover")+be("StateTypeSet",`statetype=C
physics=C`,'command="holddown"')+be("StateTypeSet",`statetype=S
physics=S`,'command!="holddown"')+be("ChangeState",`value=${n?"ifelse(inguarddist,ifelse(statetype=C,131,130),140)":"ifelse(statetype=C,131,130)"}
ctrl=1`,"hitover")))),...[[5e3,"S","ifelse(gethitvar(groundtype)=2,5010,5000)"],[5010,"C","5020"],[5020,"A","5030"]].map(([e,t,i])=>{const s="5030+gethitvar(animtype)",r="5050+gethitvar(animtype)-3",a=n?`ifelse(gethitvar(animtype)>=3,ifelse(gethitvar(animtype)=3,5030,ifelse(selfanimexist(${r}),${r},5030)),ifelse((gethitvar(fall)||gethitvar(yvel)!=0)&&selfanimexist(${s}),${s},${i}+gethitvar(animtype)))`:`ifelse(gethitvar(animtype)>=3,5030,${i}+gethitvar(animtype))`;return et(e,`type=${t}
movetype=H
physics=N
ctrl=0
velset=0,0`,be("ChangeAnim",`value=${a}`,`time=0 && selfanimexist(${a})`)+(n?be("StateTypeSet","statetype=A","gethitvar(yvel)!=0 || pos y!=0"):"")+be("ChangeState",`value=${t==="A"?"5030":`ifelse(gethitvar(fall)||gethitvar(yvel)!=0||pos y!=0,5030,${e+1})`}
ctrl=0`,"hitshakeover"))}),...[[5001,"S"],[5011,"C"]].map(([e,t])=>et(e,`type=${t}
movetype=H
physics=${t}
ctrl=0`,(n?Ze("anim"):"")+be("HitVelSet","x=1","time=0")+be("VelMul","x=.6","time>=gethitvar(slidetime)")+(n?Ze("anim+5","animtime=0 && (anim=[5000,5002] || anim=[5010,5012] || anim=[5020,5022])"):"")+be("VelSet","x=0","hitover")+be("DefenceMulSet","value=1","hitover")+tt(0,"hitover"))),...[5030,5035].map(e=>{const t=be("VelAdd","y=gethitvar(yaccel)",e===5030?"time>0":n?"time>0 || prevstateno!=5030":"1"),i=be("ChangeState",`value=ifelse(gethitvar(fall),5050,5040)
ctrl=0`,"hitover || (vel y>0 && pos y>=0)")+(e===5030?n?be("ChangeState",`value=ifelse(anim=[5050,5059],5050,5035)
ctrl=0`,"animtime=0"):tt(5035,"animtime=0",0):be("ChangeState",`value=ifelse(gethitvar(fall),5050,5040)
ctrl=0`,"animtime=0 || !selfanimexist(5035)"));return et(e,`type=A
movetype=H
physics=N
ctrl=0`,(e===5030?(n?Ze("ifelse(gethitvar(fall),anim,5030)"):"")+be("HitVelSet",`x=1
y=1`,"time=0"):Ze(5035))+t+i)}),et(5040,`type=A
movetype=H
physics=N
ctrl=1`,Ze(5040)+be("VelAdd","y=gethitvar(yaccel)")+tt(5050,"!alive",0)+tt(52,"pos y>=0 && vel y>0",0)+tt(50,"animtime=0 || !selfanimexist(5040)")),et(5050,`type=A
movetype=H
physics=N
ctrl=0`,(n?Ze("5050+ifelse(gethitvar(animtype)>=3,gethitvar(animtype)-3,0)","(time=0 && anim=5030 && animtime=-1) || (animtime=0 && (anim<5050 || anim>5069))")+Ze("anim+10","vel y>Const240p(-2) && anim=[5051,5052]"):Ze(5050))+be("SelfState","value=5210",'alive && CanRecover && command="recovery"')+tt(5100,n?"vel y>0 && pos y>=ifelse(anim=5050 || anim=5035,const(movement.air.gethit.groundlevel),0)":"pos y>=0 && vel y>0",0)+be("VelAdd","y=gethitvar(yaccel)",n?"time>0 || (prevstateno!=5030 && prevstateno!=5035)":"1")),et(5070,`type=A
movetype=H
physics=N
ctrl=0
velset=0,0`,Ze(5070)+tt(5071,"hitshakeover",0)),et(5071,`type=A
movetype=H
physics=N
ctrl=0`,(n?Ze("anim"):"")+be("HitVelSet",`x=1
y=1`,"time=0")+be("VelAdd","y=gethitvar(yaccel)",n?"time>0":"1")+tt(5110,"vel y>0 && pos y>=const(movement.air.gethit.trip.groundlevel)",0)),et(5080,`type=L
movetype=H
physics=N
ctrl=0
velset=0,0`,Ze(5080)+tt(5030,"hitshakeover && gethitvar(yvel)!=0",0)+tt(5081,"hitshakeover && gethitvar(yvel)=0",0)),et(5081,`type=L
movetype=H
physics=C
ctrl=0`,be("HitVelSet","x=1","time=0")+be("VelSet","x=0","hitover")+tt(5110,"hitover",0)),et(5100,`type = L
movetype = H
physics = N
ctrl = 0`+(n?"":`
velset = 0,0`),be("PosSet","y = 0")+(n?be("PosFreeze","value=1")+be("VelMul","x=.75","time=0")+be("VelSet","y=0","time=0"):"")+be("HitFallDamage","",n?"time=3":"time=0")+be("FallEnvShake","","time=0")+Ze(n?"ifelse(selfanimexist(5100+ifelse(gethitvar(animtype)>=3,gethitvar(animtype)-3,0)),5100+ifelse(gethitvar(animtype)>=3,gethitvar(animtype)-3,0),5100)":5100)+tt(5110,"time>=1 && gethitvar(fall.yvel)=0",0)+tt(5101,"time>=1 && (animtime=0 || time>=12 || !selfanimexist(5100))",0)),et(5101,`type=L
movetype=H
physics=N
ctrl=0`,Ze(5160)+be("HitFallVel","","time=0")+be("PosSet","y=const(movement.down.bounce.offset.y)","time=0")+be("PosAdd","x=const(movement.down.bounce.offset.x)","time=0")+(n?be("PosFreeze","value=1","time=0"):"")+be("VelAdd","y=const(movement.down.bounce.yaccel)",n?"time>0":"1")+tt(5110,"time>0 && vel y>0 && pos y>=const(movement.down.bounce.groundlevel)",0)),et(5110,`type = L
movetype = H
physics = N
ctrl = 0`,be("PosSet","y=0","time=0")+be("VelSet","y=0","time=0")+(n?Ze("ifelse(selfanimexist(5170),5170,5110)")+Ze(5110,"animtime=0 && anim!=5110")+be("VelMul","x=const(movement.stand.friction)")+be("VelSet","x=0","abs(vel x)<const(movement.down.friction.threshold)"):Ze(5110))+tt(5150,"!alive",0)+tt(5120,"time>=1 && gethitvar(recovertime)<=0",0)),et(5120,(n?`type=L
physics=N`:`type=S
physics=S`)+`
movetype=I
ctrl=0`,Ze(5120)+be("SelfState",`value=0
ctrl=1`,"animtime = 0 || !selfanimexist(5120)")),et(5150,`type = L
movetype = H
physics = N
ctrl = 0
velset = 0,0`,Ze(5110)),et(5210,`type=A
movetype=I
physics=N
ctrl=0`,Ze(5210)+be("PosFreeze","value=1","time<4")+be("VelMul",n?`x=const(velocity.air.gethit.airrecover.mul.x)
y=const(velocity.air.gethit.airrecover.mul.y)`:`x=.5
y=.2`,"time=4")+be("VelAdd",n?`x=const(velocity.air.gethit.airrecover.add.x)
y=const(velocity.air.gethit.airrecover.add.y)`:"y=Const240p(-4.5)","time=4")+be("NotHitBy","value=SCA",n?"time<20":"time<4")+(n?be("VelAdd","y=const(movement.air.gethit.airrecover.yaccel)","time>=4")+be("CtrlSet","value=1","time>=20")+tt(52,"pos y>=0 && vel y>0",0):tt(50,"time>=4")))].join(`
`)}zu();function Go(n=""){if(n=String(n).toUpperCase(),n==="S"||n==="SUB")return{mode:"subtract",source:1,destination:1};if(n==="A"||n==="ADD")return{mode:"add",source:1,destination:1};if(n==="A1"||n==="ADD1")return{mode:"add",source:1,destination:.5};const e=/^AS([\d.]+)D([\d.]+)$/.exec(n);return e?{mode:"add",source:Math.max(0,Math.min(256,+e[1]))/256,destination:Math.max(0,Math.min(256,+e[2]))/256}:{mode:"normal",source:1,destination:0}}function Lp(n=0,e=0,t=0){const i=h=>{if(typeof h!="number"||!Number.isFinite(h))throw Error("Sprite angles must be finite numbers.");const f=h%360*Math.PI/180,u=d=>Math.abs(d)<1e-12?0:Math.abs(1-Math.abs(d))<1e-12?Math.sign(d):d;return[u(Math.cos(f)),u(Math.sin(f))]},[s,r]=i(n),[a,o]=i(e),[l,c]=i(t);return{a:l*s,b:o*c*s-a*r,c:l*r,d:a*s+o*c*r}}function Wo(n,e,t=0){var l;const i=n==null?void 0:n.frames[e];if(!i)return null;if(!((l=i.interpolate)!=null&&l.length)||i.ticks<=0)return i;const s=n.frames[e+1]||n.frames[n.loopStart||0];if(!s)return i;const r=Math.max(0,Math.min(1,t/i.ticks)),a={...i},o=(c,h)=>c+(h-c)*r;for(const c of i.interpolate)if(c==="offset"&&(a.x=o(i.x,s.x),a.y=o(i.y,s.y)),c==="scale"&&(a.scaleX=o(i.scaleX??1,s.scaleX??1),a.scaleY=o(i.scaleY??1,s.scaleY??1)),c==="angle"&&(a.angle=o(i.angle||0,s.angle||0)),c==="blend"){const h=Go(i.blend),f=Go(s.blend);h.mode==="add"&&f.mode==="add"&&(a.blend=`AS${o(h.source,f.source)*256}D${o(h.destination,f.destination)*256}`)}return a}function Hu(n){var r;const e=Wo(n.collisionAnimation??n.animation??((r=n.animations)==null?void 0:r.get(n.anim)),n.collisionFrameIndex??n.frameIndex,n.collisionFrameTime??n.frameTime)??n.collisionFrame??n.currentFrame;if(!e)return null;const t=Du(n);if(t===n)return e;const i=(a,o)=>{var l,c;return((c=(l=a.program)==null?void 0:l.constants)==null?void 0:c.get(o))??1},s=(a,o)=>{const l=Ft(n)*i(n,o);return l?(e[a]||0)*Ft(t)*i(t,o)/l:0};return{...e,x:s("x","size.xscale"),y:s("y","size.yscale")}}function Wc(n,e,t,i,s,r,a=256){if(!i)return[0];if(!Number.isFinite(t)||t<=0||!Number.isFinite(e)||e<=0)return[];let o=i===1?Math.floor((s-n-e)/t):0,l=i===1?Math.ceil((r-n)/t):Math.max(0,Math.trunc(i)-1);return Math.max(0,l-o+1)>a&&(l=o+a-1),Array.from({length:Math.max(0,l-o+1)},(h,f)=>o+f)}function Sr(n,e,t=0){return n.animated?n.spacing[t]:e+n.spacing[t]}function Xc(n,e,t,i,s=0){const r=i>1?t/(i-1):0,a=n.width?n.width[0]/e:n.xscale[0],o=n.width?n.width[1]/e:n.xscale[1],l=a+(o-a)*r,c=n.yScaleStart+s*n.yScaleDelta;return{x:n.width?l:1,delta:n.width?a?l/a:1:l,y:c>0?1/c:0}}const Np=(n,e)=>Array.isArray(n)?n.slice(0,3).map((t,i)=>Number(t??e[i])):[...e],Dp=(n,e=0,t=255)=>Math.max(e,Math.min(t,n)),qn=(n,e={})=>({...e,...n,age:0,remaining:n.time??e.time??1}),Qt=n=>n&&(n.remaining<0||n.remaining>0);function Qa(n){n&&(n.age++,n.remaining>0&&n.remaining--)}class Up{constructor(){this.palettes=new Map,this.afterimages=new Map,this.all=null,this.background=null,this.shake=null,this.environment=null,this.diagnostics=[]}advance({paused:e=()=>!1,backgroundPaused:t=!1}={}){for(const[i,s]of this.palettes)e(i)||Qa(s),Qt(s)||this.palettes.delete(i);for(const[i,s]of this.afterimages)e(i)||Qa(s),Qt(s)||this.afterimages.delete(i);if(!t)for(const i of[this.all,this.background,this.shake,this.environment])Qa(i)}consume(e,{entity:t}={}){for(const i of e||[]){const s=String(i.type).toLowerCase();if(s==="palfx"&&t){const r=ta(t),a=qn(ia(i));Qt(a)?this.palettes.set(r,a):this.palettes.delete(r)}else if(s==="allpalfx")this.all=qn(ia(i));else if(s==="bgpalfx")this.background=qn(ia(i));else if(s==="envshake"){const r=i.coordinateScale??(t==null?void 0:t.coordinateScale)??1;this.shake=qn(i,{time:0,freq:60,ampl:-4/r,phase:i.freq>=90?90:0,coordinateScale:r})}else if(s==="envcolor")this.environment=qn(i,{value:[255,255,255],under:0});else if(s==="palettesnapshot"&&i.target)i.target.paletteSnapshot={layers:[],key:"[]"};else if(s==="afterimage"&&t){const r=qn(i,{time:1,length:20,timegap:1,framegap:4,palcolor:256,palbright:[30,30,30],palcontrast:[120,120,220],palpostbright:[0,0,0],paladd:[10,10,25],palmul:[.65,.65,.75],trans:"none"});r.length=Dp(Math.trunc(r.length),0,60),r.timegap=Math.max(1,Math.trunc(r.timegap)),r.framegap=Math.max(1,Math.trunc(r.framegap)),r.frames=[],Qt(r)&&r.length?this.afterimages.set(t,r):this.afterimages.delete(t)}else if(s==="afterimagetime"&&this.afterimages.has(t)){const r=this.afterimages.get(t);r.remaining=i.time??i.value??0,Qt(r)||this.afterimages.delete(t)}}}capture(e,{paused:t=()=>!1}={}){for(const i of e){const s=this.afterimages.get(i);if(!Qt(s)||t(i)||s.age%s.timegap!==0||s.lastAge===s.age)continue;const r=Hu(i);r&&(s.lastAge=s.age,s.frames.unshift({entity:i,frame:{...r},pos:{...i.pos},facing:i.facing,coordinateScale:Ft(i),character:i.character,drawScale:{...i.drawScale},drawOffset:{...i.drawOffset},angle:i.angleDraw?i.angle:0,sizeX:i.constant("size.xscale"),sizeY:i.constant("size.yscale"),paletteRemaps:new Map(i.paletteRemaps)}),s.frames.length=Math.min(s.frames.length,s.length))}}paletteFor(e,{ownpal:t=(e==null?void 0:e.ownPal)??(e==null?void 0:e.ownpal),ignoreLocal:i=!1,includeAll:s=!0}={}){const r=i?null:t?e:ta(e),a=this.palettes.get(r);let o=Qt(a)?[a]:[];return o=[...o,...s&&Qt(this.all)?[this.all]:[]].map(l=>Object.fromEntries(Object.entries(l).map(([c,h])=>[c,Array.isArray(h)?[...h]:h]))),{layers:o,key:JSON.stringify(o.map(({add:l,mul:c,sinadd:h,color:f,invertall:u,age:d})=>({add:l,mul:c,sinadd:h,color:f,invertall:u,age:h?d:0})))}}get backgroundPalette(){const e=[this.background,this.all].filter(Qt);return{layers:e,key:JSON.stringify(e)}}get cameraOffset(){if(!Qt(this.shake))return{x:0,y:0};const e=this.shake;return{x:0,y:-Number(e.ampl)*e.coordinateScale*Math.sin((Number(e.phase)+e.age*Number(e.freq))*Math.PI/180)}}get environmentColor(){return Qt(this.environment)?this.environment:null}trailsFor(e){const t=this.afterimages.get(e);if(!Qt(t))return[];const i=[];for(let s=0;s<t.frames.length;s+=t.framegap){const r=[{color:t.palcolor,invertall:t.palinvertall,add:t.palbright,mul:t.palcontrast,postadd:t.palpostbright}];for(let a=0;a<s;a++)r.push({add:t.paladd,mul:Np(t.palmul,[1,1,1]).map(o=>o*256)});Qt(this.all)&&r.push(this.all),i.push({...t.frames[s],palette:{layers:r,key:JSON.stringify(r)},trans:t.trans})}return i.reverse()}cleanup(e,{paletteOwners:t=e}={}){const i=new Set(e),s=new Set;for(const r of t){const a=ta(r);a&&s.add(a)}for(const r of this.palettes.keys())s.has(r)||this.palettes.delete(r);for(const r of this.afterimages.keys())i.has(r)||this.afterimages.delete(r)}}const ze=127,Xe=125,cs=124,Fp=new Set("time stateno prevstateno anim animtime ctrl life lifemax power powermax facing alive gametime hitpausetime hitshakeover hitover movecontact movehit moveguarded movereversed hitcount uniqhitcount numenemy numpartner numproj roundstate roundno matchno teamside teampower tickspersecond ailevel palno id win lose drawgame inguarddist canrecover roundsexisted hitfall ishometeam winko wintime winperfect loseko losetime loseperfect".split(" ")),Op=new Set("pos x|pos y|vel x|vel y|p2dist x|p2dist y|p2bodydist x|p2bodydist y|parentdist x|parentdist y|rootdist x|rootdist y|screenpos x|screenpos y|hitvel x|hitvel y|camerapos x|camerapos y|camerazoom|gamewidth|gameheight|screenwidth|screenheight|leftedge|rightedge|topedge|bottomedge|frontedge|backedge|frontedgedist|backedgedist|frontedgebodydist|backedgebodydist".split("|")),kp=new Set("var sysvar animelemtime animelemno animexist selfanimexist numprojid playeridexist projcanceltime projcontacttime projguardedtime projhittime numhelper numexplod numtarget ishelper".split(" ")),Bp=new Set(["fvar","sysfvar","const240p","const480p","const720p"]),zp=new Set("name authorname p1name p2name p3name p4name statetype movetype physics p2statetype p2movetype teammode".split(" ")),Hp=new Set("xveladd yveladd xoff yoff zoff xvel yvel yaccel fall.xvel fall.yvel fall.envshake.freq fall.envshake.phase".split(" ")),va=["sin","cos","tan","asin","acos","atan","exp","ln"],Vp=new TextEncoder,Ai=n=>{const e=[];do{const t=n&127;n>>>=7,e.push(t|(n?128:0))}while(n);return e},Gp=n=>{n|=0;const e=[];for(;;){const t=n&127;n>>=7;const i=n===0&&!(t&64)||n===-1&&!!(t&64);if(e.push(t|(i?0:128)),i)return e}},eo=n=>{const e=Vp.encode(n);return[...Ai(e.length),...e]},Ln=n=>[...Ai(n.length),...n.flat()],Ds=(n,e)=>[n,...Ai(e.length),...e],ci=n=>[65,...Gp(n)],Xo=n=>{const e=new Uint8Array(4);return new DataView(e.buffer).setFloat32(0,n,!0),[67,...e]},to=[68,0,0,0,0,0,0,0,0],hs=n=>[16,...Ai(n)],hi=n=>[32,...Ai(n)],Yn=n=>[33,...Ai(n)],yi=(n,e)=>n.type===e?n.code:[...n.code,n.type===ze?e===Xe?178:183:187],Mr=n=>n.type===ze?[...n.code,69,69]:[...n.code,...Xo(0),92],Us=n=>[...n,...hs(2)],dt=(n,e)=>({type:n,code:e});class _n extends Error{}class Fs extends Error{}class Wp{constructor(e){this.trigger=e,this.locals=[]}local(e){return this.locals.push(e),this.locals.length-1}read(e,t=[]){const i=Op.has(e)||Bp.has(e)?Xe:Fp.has(e)||kp.has(e)?ze:null;if(!i||t.length>2)throw new _n;const s=[...ci(this.trigger(e)),...ci(t.length)];for(let r=0;r<2;r++)s.push(...t[r]?yi(this.node(t[r]),cs):to);return s.push(...hs(i===ze?0:1)),dt(i,s)}literal(e,t=ze){return dt(t,[...ci(this.trigger(e)),...ci(0),...to,...to,...hs(t===ze?0:1)])}node(e){var t;if(e.kind==="number"){if(e.float&&!Number.isFinite(Math.fround(e.value)))throw new _n;return dt(e.float?Xe:ze,e.float?Xo(e.value):ci(e.value))}if(e.kind==="name")return e.name==="pi"||e.name==="e"?dt(Xe,Xo(e.name==="pi"?Math.PI:Math.E)):this.read(e.name);if(e.kind==="unary"){const i=this.node(e.value);if(e.op==="+")return i;if(e.op==="!")return dt(ze,[...Mr(i),69]);if(e.op==="-")return dt(i.type,i.type===ze?[...ci(0),...i.code,107]:[...i.code,140]);if(e.op==="~"&&i.type===ze)return dt(ze,[...i.code,...ci(-1),115]);throw new _n}if(e.kind==="legacyanim")return this.binary(e.op,this.read("animelemtime",[e.element]),this.node(e.time));if(e.kind==="legacytime"){if(e.divisor.value<=0)throw new _n;return this.binary(e.op,this.binary("%",this.read("time"),this.node(e.divisor)),this.node(e.remainder))}if(e.kind==="range"){const i=[this.node(e.left),this.node(e.low),this.node(e.high)],s=i.some(l=>l.type===Xe)?Xe:ze,r=i.map(()=>this.local(s)),a=[];i.forEach((l,c)=>a.push(...yi(l,s),...Yn(r[c])));const o=l=>dt(s,hi(r[l]));return a.push(...this.binary(e.includeLow?">=":">",o(0),o(1)).code,...this.binary(e.includeHigh?"<=":"<",o(0),o(2)).code,113),e.op==="!="&&a.push(69),dt(ze,a)}if(e.kind==="command"){const i=this.literal({name:"command",args:[e.command]});return e.op==="="?i:dt(ze,[...i.code,69])}if(e.kind==="legacyattribute"){const i=this.literal({name:"hitdefattr",args:e.attributes});return e.op==="="?i:dt(ze,[...i.code,69])}if(e.kind==="binary")return["=","!="].includes(e.op)&&e.left.kind==="name"&&zp.has(e.left.name)&&e.right.kind==="string"?this.literal({name:e.left.name,match:e.right.value,invert:e.op==="!="}):this.binary(e.op,this.node(e.left),this.node(e.right));if(e.kind==="call"){if(e.name==="cond"){const s=this.node(e.args[0]),r=this.node(e.args[1]),a=this.node(e.args[2]);if(r.type!==a.type)throw new _n;return dt(r.type,[...Mr(s),4,r.type,...r.code,5,...a.code,11])}if(["const","gethitvar"].includes(e.name)&&["name","string"].includes((t=e.args[0])==null?void 0:t.kind)){const s=e.args[0].name??e.args[0].value,r=e.name==="const"?/^(?:velocity\.|movement\.(?!airjump\.)|size\.[xy]scale$|data\.fall\.defence_mul$)/.test(s)?Xe:ze:Hp.has(s)?Xe:ze;return this.literal({name:e.name,args:[s]},r)}const i=e.args.map(s=>this.node(s));if(e.name==="abs"){const s=i[0];if(s.type===Xe)return dt(Xe,[...s.code,139]);const r=this.local(ze);return dt(ze,[...s.code,...Yn(r),...hi(r),...ci(0),72,4,ze,...ci(0),...hi(r),107,5,...hi(r),11])}if(e.name==="min"||e.name==="max"){if(i.some(a=>a.type===Xe))return dt(Xe,[...yi(i[0],Xe),...yi(i[1],Xe),e.name==="min"?150:151]);const s=this.local(ze),r=this.local(ze);return dt(ze,[...i[0].code,...Yn(s),...i[1].code,...Yn(r),...hi(s),...hi(r),e.name==="min"?72:74,4,ze,...hi(s),5,...hi(r),11])}return e.name==="ceil"||e.name==="floor"?dt(ze,[...yi(i[0],Xe),e.name==="ceil"?141:142,187,...hs(3)]):e.name==="sqrt"?dt(Xe,Us([...yi(i[0],Xe),145])):va.includes(e.name)?dt(Xe,Us([...yi(i[0],Xe),...hs(4+va.indexOf(e.name))])):e.name==="log"?dt(Xe,Us([...yi(i[0],Xe),...yi(i[1],Xe),...hs(12)])):this.read(e.name,e.args)}throw new _n}binary(e,t,i){if(["&&","||","^^"].includes(e))return dt(ze,[...Mr(t),...Mr(i),e==="&&"?113:e==="||"?114:115]);const s=t.type===Xe||i.type===Xe?Xe:ze,r=[...yi(t,s),...yi(i,s)],a={"=":[70,91],"!=":[71,92],"<":[72,93],">":[74,94],"<=":[76,95],">=":[78,96]};if(a[e])return dt(ze,[...r,a[e][+(s===Xe)]]);const o={"+":[106,146],"-":[107,147],"*":[108,148]};if(o[e])return r.push(o[e][+(s===Xe)]),dt(s,s===Xe?Us(r):r);if(e==="/"){if(s===Xe)return dt(Xe,Us([...r,149]));const l=this.local(ze),c=this.local(ze);return dt(ze,[...t.code,...Yn(l),...i.code,...Yn(c),...hi(l),...ci(-2147483648),70,...hi(c),...ci(-1),70,113,4,ze,...ci(-2147483648),5,...hi(l),...hi(c),109,11])}if(s===ze&&["%","&","|","^"].includes(e))return dt(ze,[...r,{"%":111,"&":113,"|":114,"^":115}[e]]);throw new _n}}function Xp(n){const e=(a,o)=>[96,...Ln(a.map(l=>[l])),1,o],t=[e([ze,ze,cs,cs],ze),e([ze,ze,cs,cs],Xe),e([Xe],Xe),e([cs],ze),e([Xe,Xe],Xe),e([],ze),e([],Xe)],i=[["readInt",0],["readFloat",1],["finite",2],["wrap",3],...va.map(a=>[a,2]),["log",4]].map(([a,o])=>[...eo("host"),...eo(a),0,...Ai(o)]),s=n.map((a,o)=>[...eo("e"+o),0,...Ai(i.length+o)]),r=n.map(a=>{const o=[];for(const c of a.locals){const h=o.at(-1);(h==null?void 0:h[1])===c?h[0]++:o.push([1,c])}const l=[...Ln(o.map(([c,h])=>[...Ai(c),h])),...a.code,11];return[...Ai(l.length),...l]});return new Uint8Array([0,97,115,109,1,0,0,0,...Ds(1,Ln(t)),...Ds(2,Ln(i)),...Ds(3,Ln(n.map(a=>Ai(a.type===ze?5:6)))),...Ds(7,Ln(s)),...Ds(10,Ln(r))])}class $p{constructor(e=[],{maxFunctions:t=4096,maxBytes:i=2*1024*1024}={}){if(!Number.isInteger(t)||t<0||t>16384||!Number.isInteger(i)||i<0||i>16*1024*1024)throw RangeError("Invalid numeric compilation budget.");this.context=null,this.entries=new Map,this.triggers=[],this.counts={wasm:0,interpreted:0,deoptimized:0,compiled:0,bytes:0};const s=new Map,r=[],a=[],o=u=>{const d=JSON.stringify(u);return s.has(d)||(s.set(d,this.triggers.length),this.triggers.push(typeof u=="string"?{name:u}:u)),s.get(d)};let l=0;for(const u of new Set(e))if(!(typeof u!="string"||!u.trim()||r.length>=t))try{const d=new Wp(o),p=d.node(zl(u));if((l+=p.code.length)>i)break;a.push({source:u,type:p.type}),r.push({...p,locals:d.locals})}catch(d){if(!(d instanceof _n)&&!(d instanceof pt))throw d}if(!r.length)return;const c=(u,d,p,_,m)=>{if(typeof this.context.resolve!="function")throw new ji("Trigger resolution is unavailable.");const v=this.triggers[u],y=this.context.resolve(v.name,v.args||(d===0?[]:d===1?[p]:[p,_]),null);let A=y;if(v.match!==void 0)if(y!=null&&y.absent)A=+v.invert;else if(typeof y=="string")A=+(y===v.match!=!!v.invert);else throw new Fs;if(typeof y=="boolean")A=+y;else if(y&&typeof y.value=="number"){if(!m&&(y.type==="float"||y.float))throw new Fs;A=y.value}if(typeof A!="number")throw new Fs;if(!Number.isFinite(A))throw new Lt("Expression produced a non-finite number.");if(!m&&!Number.isInteger(A))throw new Fs;if(m){if(A=Math.fround(A),!Number.isFinite(A))throw new Lt("Expression produced a non-finite number.");return A}return A|0},h={readInt:(...u)=>c(...u,!1),readFloat:(...u)=>c(...u,!0),finite:u=>{if(!Number.isFinite(u))throw new Lt("Expression produced a non-finite number.");return u},wrap:u=>u|0};for(const u of va)h[u]=Math[u==="ln"?"log":u];h.log=(u,d)=>Math.log(d)/Math.log(u),this.binary=Xp(r);const f=new WebAssembly.Instance(new WebAssembly.Module(this.binary),{host:h});a.forEach((u,d)=>this.entries.set(u.source,{...u,run:f.exports["e"+d]})),this.counts.compiled=this.entries.size,this.counts.bytes=this.binary.length}evaluate(e,t={}){const i=this.entries.get(e);if(!i)return this.counts.interpreted++,(t.typedResult?Oo:da)(e,t);const s=this.context;this.context=t;try{const r=i.run();return this.counts.wasm++,t.typedResult?{value:r,float:i.type===Xe}:r}catch(r){if(r instanceof Fs)return this.entries.delete(e),this.counts.deoptimized++,(t.typedResult?Oo:da)(e,t);throw r instanceof WebAssembly.RuntimeError?new Lt("Invalid numeric operation.",e):r instanceof pt?(r.source||(r.source=e),r):r!=null&&r.bottom?new Lt(r.message,e):new pt((r==null?void 0:r.message)||"Trigger evaluation failed.",e)}finally{this.context=s}}get stats(){return{...this.counts,activeFunctions:this.entries.size}}}function qp(n,{factor:e,scale:t,cameraX:i,cameraY:s,cropTop:r=0,displayHeight:a=240}){if(!n.window)return null;const[o,l,c,h]=n.window,f=n.windowCentered?0:1;if(c-o+f<=0||h-l+f<=0)return[];const u=n.windowCentered?480:(960-320*t)/2,d=(540-a*t)/2,p=u+(o*e-i*n.windowDelta[0])*t,_=d+(l*e-s*n.windowDelta[1]-r)*t;if(![p,_,(c-o+f)*e*t,(h-l+f)*e*t].every(Number.isFinite))return[];const m=Math.max(0,p),v=Math.max(0,_),y=Math.min(960,p+(c-o+f)*e*t),A=Math.min(540,_+(h-l+f)*e*t);return y>m&&A>v?[m,v,y-m,A-v]:[]}function Yp(n,e,t,{x:i,y:s,sx:r,sy:a,cameraX:o,cameraY:l,deltaX:c,zoom:h,factor:f,clip:u=null}){if(u&&!u.length)return[];const d=(t.flip||"").includes("H")?-1:1,p=(t.flip||"").includes("V")?-1:1,_=r*(t.scaleX??1)*d;let m=a*(t.scaleY??1)*p;if(![i,s,_,m].every(Number.isFinite)||!_||!m)return[];let v={x:1,delta:1,y:1},y=v;if(n.type==="parallax"&&(v=Xc(n,e.w,0,e.h,l/f),y=Xc(n,e.w,e.h-1,e.h,l/f),a*=v.y,m*=v.y,!m||![v.x,y.x,v.delta,y.delta,m].every(Number.isFinite)))return[];const A=n.type==="parallax"&&n.width?e.w/2:e.x,R=(w,O)=>{const B=-o*c*h*(w.delta-1)/_,z=Sr(n,e.w)*w.x*Math.sign(_);return[A-A*w.x+B+O*z,A+(e.w-A)*w.x+B+O*z]};if(![...R(v,0),...R(y,0)].every(Number.isFinite))return[];const S=(u==null?void 0:u[0])??0,M=u?u[0]+u[2]:960,g=(u==null?void 0:u[1])??0,x=u?u[1]+u[3]:540,P=new Set;for(const w of[v,y]){const[O,B]=R(w,0),z=i+(t.x||0)*r+(Math.min(O*_,B*_)-A*_);for(const L of Wc(z,Math.abs((B-O)*_),Math.abs(Sr(n,e.w)*w.x*_),n.tile[0],S,M))P.add(L)}const T=Sr(n,e.h,1)*Math.abs(m),I=s+(t.y||0)*a,U=Wc(Math.min(I-e.y*m,I+(e.h-e.y)*m),e.h*Math.abs(m),T,n.tile[1],g,x),D=[];for(const w of U)for(const O of P){if(D.length>=8192)return D;const B=n.type==="parallax"?[...R(v,O),...R(y,O)]:null,z=B?0:O*Sr(n,e.w)*Math.abs(_);D.push({x:i+z,y:s+w*T,sx:r,sy:a,axisX:A,warp:B,clip:u})}return D}let $c;const Kp=1024*1024,Vu=n=>{if(typeof n!="number"||!Number.isFinite(n))throw Error("Expected a finite Lua number.");return n},Si=n=>Math.trunc(Vu(n)),qc=(n,e,t)=>Math.max(e,Math.min(t,n)),Zp="aiLevel alive anim animElemNo animElemTime animExist animTime authorName backEdge backEdgeBodyDist backEdgeDist cameraZoom canRecover command const const240p const480p const720p ctrl drawGame facing fvar gameHeight gameTime gameWidth getHitVar hitCount hitFall hitOver hitPauseTime hitShakeOver id inGuardDist isHelper isHomeTeam life lifeMax lose map matchNo moveContact moveGuarded moveHit moveReversed moveType name numEnemy numExplod numHelper numPartner numProj numProjId numTarget p2Life p2MoveType p2StateNo p2StateType palNo physics playerIdExist power powerMax prevStateNo random roundNo roundState roundsExisted screenHeight screenWidth stateNo stateType sysfvar sysvar teamMode teamSide ticksPerSecond uniqHitCount var win".split(" "),jp=new Set("alive animExist canRecover ctrl drawGame hitFall hitOver hitShakeOver inGuardDist isHelper isHomeTeam lose playerIdExist win".split(" ")),Jp={cameraPos:"camerapos",pos:"pos",vel:"vel",screenPos:"screenpos",hitVel:"hitvel",p2Dist:"p2dist",p2BodyDist:"p2bodydist",parentDist:"parentdist",rootDist:"rootdist"};function Gu(n,e={}){if(e.modules!==void 0&&!Array.isArray(e.modules))throw Error("Lua modules must be an array of archive paths.");const t=Object.keys(n).filter(i=>/(?:^|\/)external\/mods\/[^/]+\.lua$/i.test(i)&&!i.split("/").at(-1).startsWith("-")).sort();for(const i of e.modules||[]){const s=wn(i);if(!n[s])throw Error(`Lua module is missing: ${s}`);t.includes(s)||t.push(s)}if(t.length>32)throw Error("Lua module limit (32) exceeded.");return t}const Qp=`
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
`;class Vl{static async create(e,{factory:t,memoryLimit:i=32*Kp,instructions:s=1e5}={}){t||($c??($c=import("./__vite-browser-external-B_rT5RHW.js").then(function(o){return o.i}).then(({LuaFactory:o})=>{var l;return new o(typeof process<"u"&&((l=process.versions)!=null&&l.node)?void 0:new URL(""+new URL("glue-Dlydm7r2.wasm",import.meta.url).href,import.meta.url).href)})),t=await $c);const r=await t.createEngine({openStandardLibs:!0,injectObjects:!1,enableProxy:!1,traceAllocations:!0}),a=new Vl(e,r,s);r.global.setMemoryMax(i);try{return a.install(),a.run(Qp,"<match API>"),a}catch(o){throw a.close(),o}}constructor(e,t,i){this.session=e,this.engine=t,this.actor=e.match.player,this.instructions=i,this.fuel=i,this.closed=!1,this.source="<module>",this.hookPointer=0}install(){const e=this.engine.global,t=(r,a)=>e.set(r,a),i=()=>{if(!this.actor||this.actor.destroyed)throw Error("Lua player selection is unavailable.");return this.actor};for(const r of Zp)t(r,(...a)=>{const o=i().resolveTrigger(r.toLowerCase(),a),l=o&&typeof o=="object"&&"float"in o?o.value:o;if(!["number","string","boolean"].includes(typeof l))throw Error(`Lua query ${r} requires an unsupported result type.`);return jp.has(r)||r==="getHitVar"&&["fall","fall.recover","fall.kill","guarded","isbound"].includes(String(a[0]).toLowerCase())?!!l:l});for(const[r,a]of Object.entries(Jp))for(const o of["X","Y"])t(r+o,()=>i().resolveTrigger(a+" "+o.toLowerCase()));const s=r=>(...a)=>{const o=r(...a);return!o||o.destroyed?!1:(this.actor=o,!0)};t("player",s(r=>[this.session.match.player,this.session.match.opponent][Si(r)-1])),t("playerId",s(r=>this.session.match.findPlayer(Si(r)))),t("playerIndex",s(r=>this.session.match.entities[Si(r)-1])),t("parent",s(()=>i().parent)),t("root",s(()=>i().root)),t("stateOwner",s(()=>i().stateOwner)),t("p2",s(()=>i().opponent)),t("enemy",s((r=0)=>Si(r)===0?i().opponent:null)),t("enemyNear",s((r=0)=>Si(r)===0?i().opponent:null)),t("helper",s(r=>i().ownedHelpers().find(a=>r===void 0||a.helperId===Si(r)))),t("helperIndex",s(r=>i().ownedHelpers()[Si(r)-1])),t("target",s(r=>i().targets.find(a=>r===void 0||r===-1||i().targetHitIds.get(a.id)===Si(r)))),t("partner",()=>!1),t("setLife",r=>{const a=i();a.alive&&(a.life=qc(Si(r),0,a.maxLife))}),t("setPower",r=>{const a=i();a.power=qc(Si(r),0,a.maxPower)}),t("changeState",r=>{const a=i(),o=Si(r);return o===-1?(a.destroyed=!0,!1):a.program.states.has(o)?(a.changeState(o,void 0,a),!0):!1}),t("mapSet",(r,a,o)=>i().setMap(String(r),Vu(a),o==="add")),t("playerBufReset",()=>{var a,o;const r=i();(a=this.session.match.inputBuffers.get(r))==null||a.reset(),(o=this.session.match.helperCommands.get(r))==null||o.reset()}),t("playerNo",()=>this.session.match.entities.indexOf(i())+1),t("stateOwnerPlayerNo",()=>this.session.match.entities.indexOf(i().stateOwner)+1),t("animPlayerNo",()=>this.session.match.entities.indexOf(i().animationOwner)+1),t("pauseTime",()=>{var r;return((r=this.session.match.pause)==null?void 0:r.remaining)||0}),t("superPauseTime",()=>{var r;return((r=this.session.match.superPause)==null?void 0:r.remaining)||0}),t("gameMode",()=>this.session.selection.mode==="training"?"training":"versus"),t("matchOver",()=>this.session.match.matchOver),t("localCoordX",()=>{var r,a,o;return((o=(a=(r=i().character.def)==null?void 0:r.info)==null?void 0:a.localcoord)==null?void 0:o.split(",").map(Number)[0])||320}),t("localCoordY",()=>{var r,a,o;return((o=(a=(r=i().character.def)==null?void 0:r.info)==null?void 0:a.localcoord)==null?void 0:o.split(",").map(Number)[1])||240}),t("isAsserted",r=>i().asserted.has(String(r).toLowerCase())),t("inCustomState",()=>i().stateOwner!==i()),t("inCustomAnim",()=>i().animationOwner!==i()),t("__kenja_print",r=>this.session.issue("lua-output",String(r).slice(0,512))),t("__kenja_read",(r,a)=>{let o=String(r);a&&(o=o.replaceAll(".","/")+".lua");const l=["",...this.modules.map(u=>u.includes("/external/mods/")?u.slice(0,u.indexOf("/external/mods/")+1):u.slice(0,u.lastIndexOf("/")+1))],h=[...new Set(l.map(u=>wn(o,u)))].find(u=>this.session.files[u]);if(!h)throw Error(`Lua file is missing: ${o}`);const f=this.session.files[h];if(f.length>256*1024)throw Error("Lua source limit (256 KiB) exceeded.");return an(f)}),this.modules=Gu(this.session.files,this.session.selection),this.hookPointer=e.lua.module.addFunction(()=>{if(this.fuel-=1e3,this.fuel<0){const r=Error("Lua instruction budget exceeded.");throw r.luaBudget=!0,r}},"vii"),e.lua.lua_sethook(e.address,this.hookPointer,8,1e3)}run(e,t="<module>"){if(e.length>256*1024)throw Error("Lua source limit (256 KiB) exceeded.");this.fuel=this.instructions,this.source=t;try{return this.engine.doStringSync(e)}catch(i){throw Error(`${t}: ${i.message}`)}finally{this.engine.global.setTop(0)}}load(){for(const e of this.modules)this.run(an(this.session.files[e]),e);this.session.selection.lua&&this.run("local fn,err=load("+JSON.stringify(String(this.session.selection.lua))+',"<fight lua>","t");assert(fn,err);__kenja_frame=fn',"<fight lua>")}step(){if(!this.closed){this.fuel=this.instructions;try{const e=this.engine.global;e.lua.lua_getglobal(e.address,"__kenja_tick"),e.runSync(),e.setTop(0)}catch(e){this.session.issue("lua-runtime",e.message),this.close()}}}close(){if(this.closed)return;this.closed=!0;const e=this.engine.global;e.lua.lua_sethook(e.address,0,0,0),e.close(),this.hookPointer&&e.lua.module.removeFunction(this.hookPointer)}}function em(n,e,t,i,s){if(![e,t,i,s].every(l=>Number.isFinite(l)&&l>0))return[0,0];const r=i/e,a=s/t,o=n==="fit"?Math.min(r,a):n==="fitwidth"?r:n==="fitheight"?a:n==="zoomfill"?Math.max(r,a):1;return n==="stretch"?[r,a]:[o,o]}const Yc=zu({orderedPhases:!0});function tm(n){const e=new Set;for(const t of n){for(const i of t.zssExpressions||[])e.add(i);for(const i of t.states.values())for(const s of[i,...i.controllers])for(const r of s.entries){e.add(r.value);try{for(const a of Zi(r.value))e.add(a)}catch{}}}return e}const im=(n,e)=>{const t={entity:e};for(const[i,s]of Object.entries(n))(s===null||["number","string","boolean"].includes(typeof s)||Array.isArray(s))&&(t[i]=s);return t},br=(n,e,t=0)=>{try{return n.constant(e)}catch{return t}};class nm{constructor(e,t={}){this.files=e,this.selection=t,this.characters=hf(e);const i=this.characters.find(o=>o.path===t.character)||this.characters[0],s=this.characters.find(o=>o.path===t.opponent)||i;if(!i||!s)throw Error("No playable character definition found.");const r=new Map([...new Set([i,s])].map(o=>[o,Bu(o,{commonText:Yc,constantsFromCnsOnly:!0})]));for(const o of r.values()){const l=o.diagnostics.find(c=>c.fatal);if(l)throw Error(`${l.source}:${l.line}: ${l.message}`)}this.expressions=new $p(tm(r.values())),this.commands=[i,s].map(o=>{var c;const l=(c=o.checks.find(h=>h.key==="cmd"&&h.ok))==null?void 0:c.path;return new Qs(Hl(l?an(e[l]):""))});const a=t.stage&&t.stage!=="builtin/grid"?fp(e).find(o=>o.path===t.stage):null;if(a!=null&&a.invalid)throw Error("Stage definition could not be parsed.");this.match=new Ip(i,{opponentCharacter:s,commonText:Yc,programs:r,manageInputs:!0,orderedPhases:!0,expressionEvaluator:(o,l)=>this.expressions.evaluate(o,l),stage:a,playerPalette:t.palette||1,opponentPalette:t.opponentPalette||2,skipIntro:t.mode==="training",playerAILevel:t.mode==="cpu"?t.level||4:0,opponentAILevel:["solo","cpu"].includes(t.mode)?t.level||4:0,rules:t.mode==="training"?null:{roundsToWin:2,preIntro:0,introHold:30}}),this.commands=[this.match.inputBuffers.get(this.match.player),this.match.inputBuffers.get(this.match.opponent)],this.effects=new Up,this.banks=new Map,this.indices=new Map,this.bankIds=new Map,this.spriteMetadata=new Map,this.sent=new Set,this.assets=[],this.events=[],this.sparks=[],this.issues=new Map,this.closed=!1,this.videoSprites=new Map,this.match.stage&&(this.match.stage.viewportAspect=16/9),this.modelReady=!1,this.lua=null,this.luaModules=Gu(e,t),this.capabilities={format:"kenjatime-core-coverage-v1",engine:"Kenjatime Core",independentRuntime:!0,universalCompatibility:!1,compiledNumericExpressions:!0,scriptInterpreter:!0,luaMatchHooks:!0,stageVideo:!0,gltfStageModels:!0,knownGaps:["Lua APIs beyond match hooks, extended global states and newer ZSS extensions","Compressed glTF extensions, animation pointers and cross-layer model shadows","Video codecs unavailable on the device","Advanced stage camera offsets and mixed-coordinate camera parity","Afterimage palette chains beyond eight layers","Unverified character families and extended controller combinations"]}}issue(e,t){const i=e+":"+t;this.issues.size<2e3&&this.issues.set(i,{type:e,message:t})}async initializeScripts(){if(this.closed||this.lua||!this.luaModules.length&&!this.selection.lua)return;const e=await Vl.create(this);if(this.closed){e.close();return}try{e.load(),this.lua=e}catch(t){throw e.close(),t}}tick(e=new Set,t=new Set){var r;if(this.closed)throw Error("Match is closed.");const i=this.match,s=a=>i.isFrozen(a)||a.hitPauseTime>0;this.effects.advance({paused:s}),i.tick(new Set,new Set,{playerInput:e,opponentInput:t}),(r=this.lua)==null||r.step(),this.commands=[i.inputBuffers.get(i.player),i.inputBuffers.get(i.opponent)];for(const a of i.eventEntities){this.effects.consume(a.events,{entity:a});for(const o of a.events)["playsnd","stopsnd","sndpan"].includes(o.type)&&this.events.push({...im(o,a.id),character:a.character.path})}for(const a of i.presentationEvents)this.effects.consume([a],{entity:a.entity||a.owner});for(const a of i.events)this.sparks.push({x:a.x,y:a.y,age:0,guarded:a.guarded});return this.sparks=this.sparks.filter(a=>++a.age<12),this.sparks.length>256&&this.sparks.splice(0,this.sparks.length-256),this.effects.capture([...i.entities,...i.drawProjectiles],{paused:s}),this.effects.cleanup(i.entities),this}bank(e){var t;if(!this.banks.has(e)){const i=(t=e.def)!=null&&t.files?wu(e):Mu(e.files[e.sprite.path]);this.banks.set(e,i),this.bankIds.set(e,this.banks.size),this.indices.set(e,new Map(i.sprites.map((s,r)=>[s.group+","+s.number,r])))}return this.banks.get(e)}asset(e,t,i){var s,r;try{const a=this.bank(e),o=this.indices.get(e).get(t.group+","+t.number);if(o===void 0)return null;const l=this.bankIds.get(e),c=l+":"+o;let h=this.spriteMetadata.get(c);if(!h){const m=((s=a.decodeIndexed)==null?void 0:s.call(a,o))||a.decode(o),v=!!m.indices;h={w:m.w,h:m.h,x:m.x||0,y:m.y||0,palette:m.palette,indexed:v,colors:m.colors},this.assets.push({id:c,width:h.w,height:h.h,indexed:v,pixels:new Uint8Array(v?m.indices:m.rgba)}),this.sent.add(c),this.spriteMetadata.set(c,h),a.clearDecodedCache()}const f=h.indexed,u=a.sprites[o],d=(r=a.palettes)==null?void 0:r.find(m=>m.index===(h.palette??u.palette));let p=d?[d.group,d.number]:[1,1];p=(i==null?void 0:i.get(p.join(",")))||(i==null?void 0:i.get("*"))||p;const _=l+":pal:"+p.join(",");if(f&&!this.sent.has(_)){let m;try{m=a.paletteColors(...p)}catch{if(m=h.colors,!m)throw Error("Sprite palette is missing.");this.issue("palette","Requested palette "+p.join(",")+" is unavailable.")}const v=new Uint8Array(1024);v.set(m.subarray(0,1024)),this.assets.push({id:_,width:256,height:1,pixels:v,indexed:!1}),this.sent.add(_)}return{id:c,paletteId:_,indexed:f,w:h.w,h:h.h,x:h.x||0,y:h.y||0}}catch(a){return this.issue("sprite",a.message),null}}quad(e,t,i,{x:s=0,y:r=0,sx:a=1,sy:o=1,facing:l=1,angle:c=0,xangle:h=0,yangle:f=0,remaps:u=null,palette:d=null,trans:p=null,mask:_=!0,alpha:m=1,clip:v=null,corners:y=null,axisX:A=null,warp:R=null,sprite:S=null,axisY:M=null,pass:g=1}={}){var z,L,C;if(!i||e.length>=8192)return;const x=S||this.asset(t,i,u);if(!x)return;a*=l;const P=Lp((i.angle||0)+c,h,f),T=(i.flip||"").includes("H")?-1:1,I=(i.flip||"").includes("V")?-1:1,U=a*T*(i.scaleX??1)*P.a,D=o*I*(i.scaleY??1)*P.b,w=a*T*(i.scaleX??1)*P.c,O=o*I*(i.scaleY??1)*P.d;if(![U,D,w,O,s,r,m].every(Number.isFinite)){this.issue("render-transform","A non-finite sprite transform was skipped.");return}((z=d==null?void 0:d.layers)==null?void 0:z.length)>8&&this.issue("palette-limit","This preview can render eight palette layers per sprite.");let B=i.blend||"";return typeof p=="string"?B=p:p&&p.mode!=="default"&&(B=p.mode==="sub"?"S":p.mode==="none"?"":p.mode==="add1"?"A1":`AS${((L=p.alpha)==null?void 0:L[0])??256}D${((C=p.alpha)==null?void 0:C[1])??256}`),e.push({texture:x.id,palette:x.paletteId,indexed:x.indexed,width:x.w,height:x.h,matrix:[U,D,w,O,s+(i.x||0)*a-U*(A??x.x)-w*(M??x.y),r+(i.y||0)*o-D*(A??x.x)-O*(M??x.y)],blend:Go(B),mask:_,alpha:m,palFX:(d==null?void 0:d.layers)||[],clip:v,corners:y,warp:R,pass:g}),x}frame(){var u,d,p,_,m,v,y,A,R,S;const e=this.match,t=e.view,i=Math.min(960/320,540/(t.displayHeight||240)),s=((u=e.stage)==null?void 0:u.camera)||{x:0,y:0,zoom:1},r=(540-(t.displayHeight||240)*i)/2+(t.groundY||200)*i,a=i*s.zoom,o=[];this.assets=[];const l=M=>({x:480+(M.x-s.x)*a,y:r+(M.y-s.y)*a}),c=M=>{const g=e.stage;if(!g)return;const x=g.definition,P=x.backgroundScale||1,T=x.coordinateScale*P,I=s.x*P,U=s.y*P;for(const[D,w]of g.elements.entries()){if(o.length>=8192){this.issue("resource-limit","Visible quad budget exceeded.");break}if(w.layer!==M||!w.enabled||!w.visible||w.type==="dummy")continue;const O=w.type==="video"?{x:0,y:0}:w.animated?Wo(g.animations.get(w.anim),w.drawFrameIndex??w.frameIndex,w.drawFrameTime??w.frameTime):g.frame(w),B=g.position(D);if(!O)continue;const z=w.type==="video"?this.videoSprites.get(w.video.key):this.asset(x,O);if(!z)continue;const L=1+(s.zoom-1)*w.zoomDelta,C=T*i*L*x.xscale*(w.scaleStart[0]+U/T*w.scaleDelta[0]),H=T*i*L*x.yscale*(w.scaleStart[1]+U/T*w.scaleDelta[1]),W=480+(B.x*T-I*B.delta[0])*a,K=r+(B.y*T-(t.zoffset||0)-U*B.delta[1])*a,Q=qp(w,{factor:T,scale:i,cameraX:I,cameraY:U,cropTop:t.cropTop,displayHeight:t.displayHeight});if(w.type==="video"){if(Q&&!Q.length)continue;const[G,j]=em(w.video.scaleMode,z.w,z.h,w.window?w.window[2]-w.window[0]+(w.windowCentered?0:1):x.localcoord[0],w.window?w.window[3]-w.window[1]+(w.windowCentered?0:1):x.localcoord[1]);this.quad(o,null,O,{sprite:z,x:480+(B.x*T-I*B.delta[0])*a,y:270+(B.y*T-U*B.delta[1])*a,sx:C*G,sy:H*j,axisX:z.w/2,axisY:z.h/2,clip:Q,pass:M===1?2:M,angle:w.angle,xangle:w.xangle,yangle:w.yangle,palette:this.effects.backgroundPalette,mask:!1});continue}for(const G of Yp(w,z,O,{x:W,y:K,sx:C,sy:H,cameraX:I,cameraY:U,deltaX:B.delta[0],zoom:a,factor:T,clip:Q})){if(o.length>=8192){this.issue("resource-limit","Visible quad budget exceeded.");break}this.quad(o,x,O,{...G,pass:M===1?2:M,angle:w.angle,xangle:w.xangle,yangle:w.yangle,mask:w.mask,trans:w.transSpecified?{mode:w.trans,alpha:w.alpha}:null,palette:this.effects.backgroundPalette})}}};c(-1),c(0);const h=[];for(const M of[...e.renderEntities,...e.drawProjectiles]){!M.destroyed&&!M.asserted.has("invisible")&&h.push({priority:M.sprPriority||0,actor:M});for(const g of M.drawExplods||[])h.push({priority:g.ontop?1e3:g.sprpriority||0,actor:M,effect:g})}h.sort((M,g)=>M.priority-g.priority);for(const{actor:M,effect:g}of h){if(g){if(g.common){this.issue("common-effects","Character requested an unavailable shared effect animation.");continue}const P=g.space==="screen"?{x:g.pos.x*i,y:g.pos.y*i}:l(g.pos),T=(g.coordinateScale??Ft(M))*a;this.quad(o,M.character,Wo(g.animation,g.frameIndex,g.frameTime),{...P,sx:T*(((d=g.scale)==null?void 0:d[0])??1),sy:T*(((p=g.scale)==null?void 0:p[1])??1)*(g.vfacing||1),facing:g.facing,angle:g.angle||0,xangle:g.xangle||0,yangle:g.yangle||0,remaps:g.ownpal?g.paletteRemaps:M.paletteRemaps,palette:this.effects.paletteFor(g.source||M),trans:g.trans});continue}for(const P of this.effects.trailsFor(M)){const T=l({x:P.pos.x+(((_=P.drawOffset)==null?void 0:_.x)||0),y:P.pos.y+(((m=P.drawOffset)==null?void 0:m.y)||0)}),I=a*P.coordinateScale;this.quad(o,P.character,P.frame,{...T,sx:I*P.sizeX*(P.drawScale.x??1),sy:I*P.sizeY*(P.drawScale.y??1),facing:P.facing,angle:P.angle,remaps:P.paletteRemaps,palette:P.palette,trans:P.trans})}const x=l({x:M.pos.x+(((v=M.drawOffset)==null?void 0:v.x)||0)+br(M,"size.draw.offset.x")*Ft(M)*M.facing,y:M.pos.y+(((y=M.drawOffset)==null?void 0:y.y)||0)+br(M,"size.draw.offset.y")*Ft(M)});this.quad(o,M.character,Hu(M),{...x,sx:a*Ft(M)*br(M,"size.xscale",1)*(((A=M.drawScale)==null?void 0:A.x)??1),sy:a*Ft(M)*br(M,"size.yscale",1)*(((R=M.drawScale)==null?void 0:R.y)??1),facing:M.facing,angle:M.angleDraw?M.angle:0,remaps:M.paletteRemaps,palette:this.effects.paletteFor(M),trans:M.trans})}c(1);const f=this.sparks.map(M=>({...l(M),age:M.age,guarded:M.guarded}));return{width:960,height:540,draws:o,assets:this.assets,sparks:f,model:this.modelReady?{time:e.stage.time/60,camera:{...s},coordinateScale:e.stage.definition.coordinateScale,start:e.stage.definition.camera}:null,ground:r,grid:!e.stage||!e.stage.definition.sprite&&!this.modelReady&&!this.videoSprites.size,players:[e.player,e.opponent].map(M=>({id:M.id,name:M.name,x:M.pos.x,y:M.pos.y,life:M.life,maxLife:M.maxLife,power:M.power,maxPower:M.maxPower,state:M.stateNo,time:M.time,anim:M.anim})),ticks:e.ticks,roundState:((S=e.roundFlow)==null?void 0:S.roundState)??2,paused:!1,expressions:this.expressions.stats}}snapshot(){var e;return{engine:"Kenjatime Core",players:[this.match.player,this.match.opponent].map(t=>({id:t.id,name:t.name,x:t.pos.x,y:t.pos.y,life:t.life,maxLife:t.maxLife,power:t.power,maxPower:t.maxPower,state:t.stateNo,time:t.time,anim:t.anim})),ticks:this.match.ticks,roundState:((e=this.match.roundFlow)==null?void 0:e.roundState)??2,expressions:this.expressions.stats,capabilities:this.capabilities,diagnostics:[...this.match.diagnostics,...this.issues.values()]}}drainEvents(){const e=this.events;return this.events=[],e}close(){var e;(e=this.lua)==null||e.close(),this.closed=!0;for(const t of this.banks.values())t.clearDecodedCache();this.banks.clear(),this.sent.clear(),this.events=[]}}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Gl="187",sm=0,Kc=1,rm=2,ra=1,am=2,qs=3,zn=0,Jt=1,Ci=2,vs=0,er=1,Zc=2,jc=3,Jc=4,Wu=5,Ji=100,om=101,Xu=102,lm=103,cm=104,hm=200,$o=201,um=202,dm=203,$u=204,_a=205,fm=206,pm=207,mm=208,gm=209,vm=210,_m=211,xm=212,ym=213,Sm=214,qo=0,Yo=1,Ko=2,sr=3,Zo=4,jo=5,Jo=6,Qo=7,qu=0,Mm=1,bm=2,nn=0,Yu=1,Ku=2,Zu=3,ju=4,Ju=5,Qu=6,ed=7,Qc="attached",wm="detached",td=300,ys=301,rr=302,io=303,no=304,el=1e3,ii=1001,tl=1002,Et=1003,Em=1004,wr=1005,Nt=1006,so=1007,en=1008,jt=1009,id=1010,nd=1011,ar=1012,Wl=1013,ki=1014,mi=1015,Bi=1016,Xl=1017,$l=1018,Ss=1020,sd=35902,rd=35899,ad=1021,od=1022,gi=1023,En=1026,bn=1027,Na=1028,ql=1029,Hn=1030,Yl=1031,Kl=1033,aa=33776,oa=33777,la=33778,ca=33779,il=35840,nl=35841,sl=35842,rl=35843,al=36196,ol=37492,ll=37496,cl=37488,hl=37489,xa=37490,ul=37491,dl=37808,fl=37809,pl=37810,ml=37811,gl=37812,vl=37813,_l=37814,xl=37815,yl=37816,Sl=37817,Ml=37818,bl=37819,wl=37820,El=37821,Tl=36492,Al=36494,Cl=36495,Rl=36283,Pl=36284,ya=36285,Il=36286,Tm=2200,Am=2201,Cm=2202,Sa=2300,Ll=2301,ro=2302,eh=2303,ms=2400,gs=2401,Ma=2402,Zl=2500,Rm=2501,MS=0,bS=1,wS=2,Pm=3200,Nl=0,Im=1,Sn="",di="srgb",or="srgb-linear",ba="linear",at="srgb",ao=7680,Lm=519,Nm=512,Dm=513,Um=514,ld=515,Fm=516,Om=517,cd=518,hd=519,ud=35044,wa="300 es",Pi=2e3,lr=2001;function km(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Bm(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function cr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function zm(){const n=cr("canvas");return n.style.display="block",n}const th={};function Ea(...n){const e="THREE."+n.shift();console.log(e,...n)}function dd(n){const e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Pe(...n){n=dd(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function Fe(...n){n=dd(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function _s(...n){const e=n.join(" ");e in th||(th[e]=!0,Pe(...n))}function Hm(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}const Vm={[qo]:qo,[Ko]:Jo,[Zo]:Zo,[sr]:jo,[Yo]:Yo,[Jo]:Ko,[Qo]:Qo,[jo]:sr};class An{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Ht=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ih=1234567;const tr=Math.PI/180,Ms=180/Math.PI;function zi(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Ht[n&255]+Ht[n>>8&255]+Ht[n>>16&255]+Ht[n>>24&255]+"-"+Ht[e&255]+Ht[e>>8&255]+"-"+Ht[e>>16&15|64]+Ht[e>>24&255]+"-"+Ht[t&63|128]+Ht[t>>8&255]+"-"+Ht[t>>16&255]+Ht[t>>24&255]+Ht[i&255]+Ht[i>>8&255]+Ht[i>>16&255]+Ht[i>>24&255]).toLowerCase()}function $e(n,e,t){return Math.max(e,Math.min(t,n))}function jl(n,e){return(n%e+e)%e}function Gm(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function Wm(n,e,t){return n!==e?(t-n)/(e-n):0}function ir(n,e,t){return(1-t)*n+t*e}function Xm(n,e,t,i){return ir(n,e,1-Math.exp(-t*i))}function $m(n,e=1){return e-Math.abs(jl(n,e*2)-e)}function qm(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function Ym(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function Km(n,e){return n+Math.floor(Math.random()*(e-n+1))}function Zm(n,e){return n+Math.random()*(e-n)}function jm(n){return n*(.5-Math.random())}function Jm(n){n!==void 0&&(ih=n);let e=ih+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Qm(n){return n*tr}function eg(n){return n*Ms}function tg(n){return n>0&&Number.isInteger(n)&&2**Math.round(Math.log2(n))===n}function ig(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function fd(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function ng(n,e,t,i,s){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+i)/2),h=a((e+i)/2),f=r((e-i)/2),u=a((e-i)/2),d=r((i-e)/2),p=a((i-e)/2);switch(s){case"XYX":n.set(o*h,l*f,l*u,o*c);break;case"YZY":n.set(l*u,o*h,l*f,o*c);break;case"ZXZ":n.set(l*f,l*u,o*h,o*c);break;case"XZX":n.set(o*h,l*p,l*d,o*c);break;case"YXY":n.set(l*d,o*h,l*p,o*c);break;case"ZYZ":n.set(l*p,l*d,o*h,o*c);break;default:Pe("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Da(n){switch(n.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function Jl(n,e){if(e.constructor===Float32Array)return n;const t=Da(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(n/t,-1)}function Ql(n,e){if(e.constructor===Float32Array)return n;const t=Da(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(n*t)}const ES={DEG2RAD:tr,RAD2DEG:Ms,generateUUID:zi,clamp:$e,euclideanModulo:jl,mapLinear:Gm,inverseLerp:Wm,lerp:ir,damp:Xm,pingpong:$m,smoothstep:qm,smootherstep:Ym,randInt:Km,randFloat:Zm,randFloatSpread:jm,seededRandom:Jm,degToRad:Qm,radToDeg:eg,isPowerOfTwo:tg,ceilPowerOfTwo:ig,floorPowerOfTwo:fd,setQuaternionFromProperEuler:ng,normalize:Ql,denormalize:Jl},cc=class cc{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar($e(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos($e(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};cc.prototype.isVector2=!0;let Je=cc;class Fi{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let l=i[s+0],c=i[s+1],h=i[s+2],f=i[s+3],u=r[a+0],d=r[a+1],p=r[a+2],_=r[a+3];if(f!==_||l!==u||c!==d||h!==p){let m=l*u+c*d+h*p+f*_;m<0&&(u=-u,d=-d,p=-p,_=-_,m=-m);let v=1-o;if(m<.9995){const y=Math.acos(m),A=Math.sin(y);v=Math.sin(v*y)/A,o=Math.sin(o*y)/A,l=l*v+u*o,c=c*v+d*o,h=h*v+p*o,f=f*v+_*o}else{l=l*v+u*o,c=c*v+d*o,h=h*v+p*o,f=f*v+_*o;const y=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=y,c*=y,h*=y,f*=y}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=f}static multiplyQuaternionsFlat(e,t,i,s,r,a){const o=i[s],l=i[s+1],c=i[s+2],h=i[s+3],f=r[a],u=r[a+1],d=r[a+2],p=r[a+3];return e[t]=o*p+h*f+l*d-c*u,e[t+1]=l*p+h*u+c*f-o*d,e[t+2]=c*p+h*d+o*u-l*f,e[t+3]=h*p-o*f-l*u-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(s/2),f=o(r/2),u=l(i/2),d=l(s/2),p=l(r/2);switch(a){case"XYZ":this._x=u*h*f+c*d*p,this._y=c*d*f-u*h*p,this._z=c*h*p+u*d*f,this._w=c*h*f-u*d*p;break;case"YXZ":this._x=u*h*f+c*d*p,this._y=c*d*f-u*h*p,this._z=c*h*p-u*d*f,this._w=c*h*f+u*d*p;break;case"ZXY":this._x=u*h*f-c*d*p,this._y=c*d*f+u*h*p,this._z=c*h*p+u*d*f,this._w=c*h*f-u*d*p;break;case"ZYX":this._x=u*h*f-c*d*p,this._y=c*d*f+u*h*p,this._z=c*h*p-u*d*f,this._w=c*h*f+u*d*p;break;case"YZX":this._x=u*h*f+c*d*p,this._y=c*d*f+u*h*p,this._z=c*h*p-u*d*f,this._w=c*h*f-u*d*p;break;case"XZY":this._x=u*h*f-c*d*p,this._y=c*d*f-u*h*p,this._z=c*h*p+u*d*f,this._w=c*h*f+u*d*p;break;default:Pe("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],f=t[10],u=i+o+f;if(u>0){const d=.5/Math.sqrt(u+1);this._w=.25/d,this._x=(h-l)*d,this._y=(r-c)*d,this._z=(a-s)*d}else if(i>o&&i>f){const d=2*Math.sqrt(1+i-o-f);this._w=(h-l)/d,this._x=.25*d,this._y=(s+a)/d,this._z=(r+c)/d}else if(o>f){const d=2*Math.sqrt(1+o-i-f);this._w=(r-c)/d,this._x=(s+a)/d,this._y=.25*d,this._z=(l+h)/d}else{const d=2*Math.sqrt(1+f-i-o);this._w=(a-s)/d,this._x=(r+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs($e(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-i*c,this._z=r*h+a*c+i*l-s*o,this._w=a*h-i*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let i=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const hc=class hc{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(nh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(nh.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*i),h=2*(o*t-r*s),f=2*(r*i-a*t);return this.x=t+l*c+a*f-o*h,this.y=i+l*h+o*c-r*f,this.z=s+l*f+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this.z=$e(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this.z=$e(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar($e(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-i*l,this.z=i*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return oo.copy(this).projectOnVector(e),this.sub(oo)}reflect(e){return this.sub(oo.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos($e(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};hc.prototype.isVector3=!0;let Y=hc;const oo=new Y,nh=new Fi,uc=class uc{constructor(e,t,i,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c)}set(e,t,i,s,r,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],f=i[7],u=i[2],d=i[5],p=i[8],_=s[0],m=s[3],v=s[6],y=s[1],A=s[4],R=s[7],S=s[2],M=s[5],g=s[8];return r[0]=a*_+o*y+l*S,r[3]=a*m+o*A+l*M,r[6]=a*v+o*R+l*g,r[1]=c*_+h*y+f*S,r[4]=c*m+h*A+f*M,r[7]=c*v+h*R+f*g,r[2]=u*_+d*y+p*S,r[5]=u*m+d*A+p*M,r[8]=u*v+d*R+p*g,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-i*r*h+i*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],f=h*a-o*c,u=o*l-h*r,d=c*r-a*l,p=t*f+i*u+s*d;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/p;return e[0]=f*_,e[1]=(s*c-h*i)*_,e[2]=(o*i-s*a)*_,e[3]=u*_,e[4]=(h*t-s*l)*_,e[5]=(s*r-o*t)*_,e[6]=d*_,e[7]=(i*l-c*t)*_,e[8]=(a*t-i*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return _s("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(lo.makeScale(e,t)),this}rotate(e){return _s("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(lo.makeRotation(-e)),this}translate(e,t){return _s("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(lo.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};uc.prototype.isMatrix3=!0;let ke=uc;const lo=new ke,sh=new ke().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),rh=new ke().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function sg(){const n={enabled:!0,workingColorSpace:or,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===at&&(s.r=sn(s.r),s.g=sn(s.g),s.b=sn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===at&&(s.r=xs(s.r),s.g=xs(s.g),s.b=xs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Sn?ba:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[a].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[or]:{primaries:e,whitePoint:i,transfer:ba,toXYZ:sh,fromXYZ:rh,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:di},outputColorSpaceConfig:{drawingBufferColorSpace:di}},[di]:{primaries:e,whitePoint:i,transfer:at,toXYZ:sh,fromXYZ:rh,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:di}}}),n}const je=sg();function sn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function xs(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Kn;class rg{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Kn===void 0&&(Kn=cr("canvas")),Kn.width=e.width,Kn.height=e.height;const s=Kn.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=Kn}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=cr("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=sn(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(sn(t[i]/255)*255):t[i]=sn(t[i]);return{data:t,width:e.width,height:e.height}}else return Pe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let ag=0;class ec{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:ag++}),this.uuid=zi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width||0,t.height||0,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(co(s[a].image)):r.push(co(s[a]))}else r=co(s);i.url=r}return t||(e.images[this.uuid]=i),i}}function co(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?rg.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Pe("Texture: Unable to serialize Texture."),{})}let og=0;const ho=new Y;class Ot extends An{constructor(e=Ot.DEFAULT_IMAGE,t=Ot.DEFAULT_MAPPING,i=ii,s=ii,r=Nt,a=en,o=gi,l=jt,c=Ot.DEFAULT_ANISOTROPY,h=Sn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:og++}),this.uuid=zi(),this.name="",this.source=new ec(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Je(0,0),this.repeat=new Je(1,1),this.center=new Je(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ke,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(ho).x}get height(){return this.source.getSize(ho).y}get depth(){return this.source.getSize(ho).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){Pe(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Pe(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==td)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case el:e.x=e.x-Math.floor(e.x);break;case ii:e.x=e.x<0?0:1;break;case tl:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case el:e.y=e.y-Math.floor(e.y);break;case ii:e.y=e.y<0?0:1;break;case tl:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Ot.DEFAULT_IMAGE=null;Ot.DEFAULT_MAPPING=td;Ot.DEFAULT_ANISOTROPY=1;const dc=class dc{constructor(e=0,t=0,i=0,s=1){this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r;const l=e.elements,c=l[0],h=l[4],f=l[8],u=l[1],d=l[5],p=l[9],_=l[2],m=l[6],v=l[10];if(Math.abs(h-u)<.01&&Math.abs(f-_)<.01&&Math.abs(p-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(f+_)<.1&&Math.abs(p+m)<.1&&Math.abs(c+d+v-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const A=(c+1)/2,R=(d+1)/2,S=(v+1)/2,M=(h+u)/4,g=(f+_)/4,x=(p+m)/4;return A>R&&A>S?A<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(A),s=M/i,r=g/i):R>S?R<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(R),i=M/s,r=x/s):S<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(S),i=g/r,s=x/r),this.set(i,s,r,t),this}let y=Math.sqrt((m-p)*(m-p)+(f-_)*(f-_)+(u-h)*(u-h));return Math.abs(y)<.001&&(y=1),this.x=(m-p)/y,this.y=(f-_)/y,this.z=(u-h)/y,this.w=Math.acos((c+d+v-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this.z=$e(this.z,e.z,t.z),this.w=$e(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this.z=$e(this.z,e,t),this.w=$e(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar($e(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};dc.prototype.isVector4=!0;let lt=dc;class lg extends An{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Nt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new lt(0,0,e,t),this.scissorTest=!1,this.viewport=new lt(0,0,e,t),this.textures=[];const s=i.count;for(let r=0;r<s;r++)this.textures[r]=new Ot({width:e,height:t,depth:i.depth}),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:Nt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new ec(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Oi extends lg{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class pd extends Ot{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Et,this.minFilter=Et,this.wrapR=ii,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class cg extends Ot{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Et,this.minFilter=Et,this.wrapR=ii,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}const Ra=class Ra{constructor(e,t,i,s,r,a,o,l,c,h,f,u,d,p,_,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c,h,f,u,d,p,_,m)}set(e,t,i,s,r,a,o,l,c,h,f,u,d,p,_,m){const v=this.elements;return v[0]=e,v[4]=t,v[8]=i,v[12]=s,v[1]=r,v[5]=a,v[9]=o,v[13]=l,v[2]=c,v[6]=h,v[10]=f,v[14]=u,v[3]=d,v[7]=p,v[11]=_,v[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ra().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,i=e.elements,s=1/Zn.setFromMatrixColumn(e,0).length(),r=1/Zn.setFromMatrixColumn(e,1).length(),a=1/Zn.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),f=Math.sin(r);if(e.order==="XYZ"){const u=a*h,d=a*f,p=o*h,_=o*f;t[0]=l*h,t[4]=-l*f,t[8]=c,t[1]=d+p*c,t[5]=u-_*c,t[9]=-o*l,t[2]=_-u*c,t[6]=p+d*c,t[10]=a*l}else if(e.order==="YXZ"){const u=l*h,d=l*f,p=c*h,_=c*f;t[0]=u+_*o,t[4]=p*o-d,t[8]=a*c,t[1]=a*f,t[5]=a*h,t[9]=-o,t[2]=d*o-p,t[6]=_+u*o,t[10]=a*l}else if(e.order==="ZXY"){const u=l*h,d=l*f,p=c*h,_=c*f;t[0]=u-_*o,t[4]=-a*f,t[8]=p+d*o,t[1]=d+p*o,t[5]=a*h,t[9]=_-u*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const u=a*h,d=a*f,p=o*h,_=o*f;t[0]=l*h,t[4]=p*c-d,t[8]=u*c+_,t[1]=l*f,t[5]=_*c+u,t[9]=d*c-p,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const u=a*l,d=a*c,p=o*l,_=o*c;t[0]=l*h,t[4]=_-u*f,t[8]=p*f+d,t[1]=f,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=d*f+p,t[10]=u-_*f}else if(e.order==="XZY"){const u=a*l,d=a*c,p=o*l,_=o*c;t[0]=l*h,t[4]=-f,t[8]=c*h,t[1]=u*f+_,t[5]=a*h,t[9]=d*f-p,t[2]=p*f-d,t[6]=o*h,t[10]=_*f+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(hg,e,ug)}lookAt(e,t,i){const s=this.elements;return ei.subVectors(e,t),ei.lengthSq()===0&&(ei.z=1),ei.normalize(),dn.crossVectors(i,ei),dn.lengthSq()===0&&(Math.abs(i.z)===1?ei.x+=1e-4:ei.z+=1e-4,ei.normalize(),dn.crossVectors(i,ei)),dn.normalize(),Er.crossVectors(ei,dn),s[0]=dn.x,s[4]=Er.x,s[8]=ei.x,s[1]=dn.y,s[5]=Er.y,s[9]=ei.y,s[2]=dn.z,s[6]=Er.z,s[10]=ei.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],f=i[5],u=i[9],d=i[13],p=i[2],_=i[6],m=i[10],v=i[14],y=i[3],A=i[7],R=i[11],S=i[15],M=s[0],g=s[4],x=s[8],P=s[12],T=s[1],I=s[5],U=s[9],D=s[13],w=s[2],O=s[6],B=s[10],z=s[14],L=s[3],C=s[7],H=s[11],W=s[15];return r[0]=a*M+o*T+l*w+c*L,r[4]=a*g+o*I+l*O+c*C,r[8]=a*x+o*U+l*B+c*H,r[12]=a*P+o*D+l*z+c*W,r[1]=h*M+f*T+u*w+d*L,r[5]=h*g+f*I+u*O+d*C,r[9]=h*x+f*U+u*B+d*H,r[13]=h*P+f*D+u*z+d*W,r[2]=p*M+_*T+m*w+v*L,r[6]=p*g+_*I+m*O+v*C,r[10]=p*x+_*U+m*B+v*H,r[14]=p*P+_*D+m*z+v*W,r[3]=y*M+A*T+R*w+S*L,r[7]=y*g+A*I+R*O+S*C,r[11]=y*x+A*U+R*B+S*H,r[15]=y*P+A*D+R*z+S*W,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],f=e[6],u=e[10],d=e[14],p=e[3],_=e[7],m=e[11],v=e[15],y=l*d-c*u,A=o*d-c*f,R=o*u-l*f,S=a*d-c*h,M=a*u-l*h,g=a*f-o*h;return t*(_*y-m*A+v*R)-i*(p*y-m*S+v*M)+s*(p*A-_*S+v*g)-r*(p*R-_*M+m*g)}determinantAffine(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return t*(a*h-o*c)-i*(r*h-o*l)+s*(r*c-a*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],f=e[9],u=e[10],d=e[11],p=e[12],_=e[13],m=e[14],v=e[15],y=t*o-i*a,A=t*l-s*a,R=t*c-r*a,S=i*l-s*o,M=i*c-r*o,g=s*c-r*l,x=h*_-f*p,P=h*m-u*p,T=h*v-d*p,I=f*m-u*_,U=f*v-d*_,D=u*v-d*m,w=y*D-A*U+R*I+S*T-M*P+g*x;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const O=1/w;return e[0]=(o*D-l*U+c*I)*O,e[1]=(s*U-i*D-r*I)*O,e[2]=(_*g-m*M+v*S)*O,e[3]=(u*M-f*g-d*S)*O,e[4]=(l*T-a*D-c*P)*O,e[5]=(t*D-s*T+r*P)*O,e[6]=(m*R-p*g-v*A)*O,e[7]=(h*g-u*R+d*A)*O,e[8]=(a*U-o*T+c*x)*O,e[9]=(i*T-t*U-r*x)*O,e[10]=(p*M-_*R+v*y)*O,e[11]=(f*R-h*M-d*y)*O,e[12]=(o*P-a*I-l*x)*O,e[13]=(t*I-i*P+s*x)*O,e[14]=(_*A-p*S-m*y)*O,e[15]=(h*S-f*A+u*y)*O,this}scale(e){const t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+i,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+i,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,f=o+o,u=r*c,d=r*h,p=r*f,_=a*h,m=a*f,v=o*f,y=l*c,A=l*h,R=l*f,S=i.x,M=i.y,g=i.z;return s[0]=(1-(_+v))*S,s[1]=(d+R)*S,s[2]=(p-A)*S,s[3]=0,s[4]=(d-R)*M,s[5]=(1-(u+v))*M,s[6]=(m+y)*M,s[7]=0,s[8]=(p+A)*g,s[9]=(m-y)*g,s[10]=(1-(u+_))*g,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinantAffine();if(r===0)return i.set(1,1,1),t.identity(),this;let a=Zn.set(s[0],s[1],s[2]).length();const o=Zn.set(s[4],s[5],s[6]).length(),l=Zn.set(s[8],s[9],s[10]).length();r<0&&(a=-a),Mi.copy(this);const c=1/a,h=1/o,f=1/l;return Mi.elements[0]*=c,Mi.elements[1]*=c,Mi.elements[2]*=c,Mi.elements[4]*=h,Mi.elements[5]*=h,Mi.elements[6]*=h,Mi.elements[8]*=f,Mi.elements[9]*=f,Mi.elements[10]*=f,t.setFromRotationMatrix(Mi),i.x=a,i.y=o,i.z=l,this}makePerspective(e,t,i,s,r,a,o=Pi,l=!1){const c=this.elements,h=2*r/(t-e),f=2*r/(i-s),u=(t+e)/(t-e),d=(i+s)/(i-s);let p,_;if(l)p=r/(a-r),_=a*r/(a-r);else if(o===Pi)p=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===lr)p=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=f,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=Pi,l=!1){const c=this.elements,h=2/(t-e),f=2/(i-s),u=-(t+e)/(t-e),d=-(i+s)/(i-s);let p,_;if(l)p=1/(a-r),_=a/(a-r);else if(o===Pi)p=-2/(a-r),_=-(a+r)/(a-r);else if(o===lr)p=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=f,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};Ra.prototype.isMatrix4=!0;let qe=Ra;const Zn=new Y,Mi=new qe,hg=new Y(0,0,0),ug=new Y(1,1,1),dn=new Y,Er=new Y,ei=new Y,ah=new qe,oh=new Fi;class Tn{constructor(e=0,t=0,i=0,s=Tn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],f=s[2],u=s[6],d=s[10];switch(t){case"XYZ":this._y=Math.asin($e(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-$e(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin($e(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-$e(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(u,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin($e(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-$e(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:Pe("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return ah.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ah,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return oh.setFromEuler(this),this.setFromQuaternion(oh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Tn.DEFAULT_ORDER="XYZ";class md{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let dg=0;const lh=new Y,jn=new Fi,Wi=new qe,Tr=new Y,Os=new Y,fg=new Y,pg=new Fi,ch=new Y(1,0,0),hh=new Y(0,1,0),uh=new Y(0,0,1),dh={type:"added"},mg={type:"removed"},Jn={type:"childadded",child:null},uo={type:"childremoved",child:null};class yt extends An{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:dg++}),this.uuid=zi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=yt.DEFAULT_UP.clone();const e=new Y,t=new Tn,i=new Fi,s=new Y(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new qe},normalMatrix:{value:new ke}}),this.matrix=new qe,this.matrixWorld=new qe,this.matrixAutoUpdate=yt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=yt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new md,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return jn.setFromAxisAngle(e,t),this.quaternion.multiply(jn),this}rotateOnWorldAxis(e,t){return jn.setFromAxisAngle(e,t),this.quaternion.premultiply(jn),this}rotateX(e){return this.rotateOnAxis(ch,e)}rotateY(e){return this.rotateOnAxis(hh,e)}rotateZ(e){return this.rotateOnAxis(uh,e)}translateOnAxis(e,t){return lh.copy(e).applyQuaternion(this.quaternion),this.position.add(lh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(ch,e)}translateY(e){return this.translateOnAxis(hh,e)}translateZ(e){return this.translateOnAxis(uh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Wi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Tr.copy(e):Tr.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),Os.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Wi.lookAt(Os,Tr,this.up):Wi.lookAt(Tr,Os,this.up),this.quaternion.setFromRotationMatrix(Wi),s&&(Wi.extractRotation(s.matrixWorld),jn.setFromRotationMatrix(Wi),this.quaternion.premultiply(jn.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Fe("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(dh),Jn.child=e,this.dispatchEvent(Jn),Jn.child=null):Fe("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(mg),uo.child=e,this.dispatchEvent(uo),uo.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Wi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Wi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Wi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(dh),Jn.child=e,this.dispatchEvent(Jn),Jn.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Os,e,fg),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Os,pg,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*i-r[8]*s,r[13]+=i-r[1]*t-r[5]*i-r[9]*s,r[14]+=s-r[2]*t-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,i)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];r(e.shapes,f)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),f=a(e.shapes),u=a(e.skeletons),d=a(e.animations),p=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),f.length>0&&(i.shapes=f),u.length>0&&(i.skeletons=u),d.length>0&&(i.animations=d),p.length>0&&(i.nodes=p)}return i.object=s,i;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}yt.DEFAULT_UP=new Y(0,1,0);yt.DEFAULT_MATRIX_AUTO_UPDATE=!0;yt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Ar extends yt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const gg={type:"move"};class fo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ar,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ar,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new Y,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new Y),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ar,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new Y,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new Y,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const _ of e.hand.values()){const m=t.getJointPose(_,i),v=this._getHandJoint(c,_);m!==null&&(v.matrix.fromArray(m.transform.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale),v.matrixWorldNeedsUpdate=!0,v.jointRadius=m.radius),v.visible=m!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],u=h.position.distanceTo(f.position),d=.02,p=.005;c.inputState.pinching&&u>d+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=d-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.quaternion,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(gg)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Ar;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const gd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},fn={h:0,s:0,l:0},Cr={h:0,s:0,l:0};function po(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class We{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=di){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,je.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=je.workingColorSpace){return this.r=e,this.g=t,this.b=i,je.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=je.workingColorSpace){if(e=jl(e,1),t=$e(t,0,1),i=$e(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=po(a,r,e+1/3),this.g=po(a,r,e),this.b=po(a,r,e-1/3)}return je.colorSpaceToWorking(this,s),this}setStyle(e,t=di){function i(r){r!==void 0&&parseFloat(r)<1&&Pe("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,t);break;case"hsl":case"hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Pe("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Pe("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=di){const i=gd[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Pe("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=sn(e.r),this.g=sn(e.g),this.b=sn(e.b),this}copyLinearToSRGB(e){return this.r=xs(e.r),this.g=xs(e.g),this.b=xs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=di){return je.workingToColorSpace(Vt.copy(this),e),Math.round($e(Vt.r*255,0,255))*65536+Math.round($e(Vt.g*255,0,255))*256+Math.round($e(Vt.b*255,0,255))}getHexString(e=di){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=je.workingColorSpace){je.workingToColorSpace(Vt.copy(this),t);const i=Vt.r,s=Vt.g,r=Vt.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=h<=.5?f/(a+o):f/(2-a-o),a){case i:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-i)/f+2;break;case r:l=(i-s)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=je.workingColorSpace){return je.workingToColorSpace(Vt.copy(this),t),e.r=Vt.r,e.g=Vt.g,e.b=Vt.b,e}getStyle(e=di){je.workingToColorSpace(Vt.copy(this),e);const t=Vt.r,i=Vt.g,s=Vt.b;return e!==di?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(fn),this.setHSL(fn.h+e,fn.s+t,fn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(fn),e.getHSL(Cr);const i=ir(fn.h,Cr.h,t),s=ir(fn.s,Cr.s,t),r=ir(fn.l,Cr.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Vt=new We;We.NAMES=gd;class vg extends yt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Tn,this.environmentIntensity=1,this.environmentRotation=new Tn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background!==null?e.background.clone():null,this.environment=e.environment!==null?e.environment.clone():null,this.fog=e.fog!==null?e.fog.clone():null,this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial!==null?e.overrideMaterial.clone():null,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}const bi=new Y,Xi=new Y,mo=new Y,$i=new Y,Qn=new Y,es=new Y,fh=new Y,go=new Y,vo=new Y,_o=new Y,xo=new lt,yo=new lt,So=new lt;class Ri{constructor(e=new Y,t=new Y,i=new Y){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),bi.subVectors(e,t),s.cross(bi);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){bi.subVectors(s,t),Xi.subVectors(i,t),mo.subVectors(e,t);const a=bi.dot(bi),o=bi.dot(Xi),l=bi.dot(mo),c=Xi.dot(Xi),h=Xi.dot(mo),f=a*c-o*o;if(f===0)return r.set(0,0,0),null;const u=1/f,d=(c*l-o*h)*u,p=(a*h-o*l)*u;return r.set(1-d-p,p,d)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,$i)===null?!1:$i.x>=0&&$i.y>=0&&$i.x+$i.y<=1}static getInterpolation(e,t,i,s,r,a,o,l){return this.getBarycoord(e,t,i,s,$i)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,$i.x),l.addScaledVector(a,$i.y),l.addScaledVector(o,$i.z),l)}static getInterpolatedAttribute(e,t,i,s,r,a){return xo.setScalar(0),yo.setScalar(0),So.setScalar(0),xo.fromBufferAttribute(e,t),yo.fromBufferAttribute(e,i),So.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(xo,r.x),a.addScaledVector(yo,r.y),a.addScaledVector(So,r.z),a}static isFrontFacing(e,t,i,s){return bi.subVectors(i,t),Xi.subVectors(e,t),bi.cross(Xi).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return bi.subVectors(this.c,this.b),Xi.subVectors(this.a,this.b),bi.cross(Xi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Ri.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Ri.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return Ri.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return Ri.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Ri.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,r=this.c;let a,o;Qn.subVectors(s,i),es.subVectors(r,i),go.subVectors(e,i);const l=Qn.dot(go),c=es.dot(go);if(l<=0&&c<=0)return t.copy(i);vo.subVectors(e,s);const h=Qn.dot(vo),f=es.dot(vo);if(h>=0&&f<=h)return t.copy(s);const u=l*f-h*c;if(u<=0&&l>=0&&h<=0&&l-h>0)return a=l/(l-h),t.copy(i).addScaledVector(Qn,a);_o.subVectors(e,r);const d=Qn.dot(_o),p=es.dot(_o);if(p>=0&&d<=p)return t.copy(r);const _=d*c-l*p;if(_<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(i).addScaledVector(es,o);const m=h*p-d*f;if(m<=0&&f-h>=0&&d-p>=0)return fh.subVectors(r,s),o=(f-h)/(f-h+(d-p)),t.copy(s).addScaledVector(fh,o);const v=1/(m+_+u);return a=_*v,o=u*v,t.copy(i).addScaledVector(Qn,a).addScaledVector(es,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Cn{constructor(e=new Y(1/0,1/0,1/0),t=new Y(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(wi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(wi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=wi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,wi):wi.fromBufferAttribute(r,a),wi.applyMatrix4(e.matrixWorld),this.expandByPoint(wi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Rr.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Rr.copy(i.boundingBox)),Rr.applyMatrix4(e.matrixWorld),this.union(Rr)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,wi),wi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ks),Pr.subVectors(this.max,ks),ts.subVectors(e.a,ks),is.subVectors(e.b,ks),ns.subVectors(e.c,ks),pn.subVectors(is,ts),mn.subVectors(ns,is),Nn.subVectors(ts,ns);let t=[0,-pn.z,pn.y,0,-mn.z,mn.y,0,-Nn.z,Nn.y,pn.z,0,-pn.x,mn.z,0,-mn.x,Nn.z,0,-Nn.x,-pn.y,pn.x,0,-mn.y,mn.x,0,-Nn.y,Nn.x,0];return!Mo(t,ts,is,ns,Pr)||(t=[1,0,0,0,1,0,0,0,1],!Mo(t,ts,is,ns,Pr))?!1:(Ir.crossVectors(pn,mn),t=[Ir.x,Ir.y,Ir.z],Mo(t,ts,is,ns,Pr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,wi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(wi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(qi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),qi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),qi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),qi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),qi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),qi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),qi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),qi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(qi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const qi=[new Y,new Y,new Y,new Y,new Y,new Y,new Y,new Y],wi=new Y,Rr=new Cn,ts=new Y,is=new Y,ns=new Y,pn=new Y,mn=new Y,Nn=new Y,ks=new Y,Pr=new Y,Ir=new Y,Dn=new Y;function Mo(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){Dn.fromArray(n,r);const o=s.x*Math.abs(Dn.x)+s.y*Math.abs(Dn.y)+s.z*Math.abs(Dn.z),l=e.dot(Dn),c=t.dot(Dn),h=i.dot(Dn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Qi=_g();function _g(){const n=new ArrayBuffer(4),e=new Float32Array(n),t=new Uint32Array(n),i=new Uint32Array(512),s=new Uint32Array(512);for(let l=0;l<256;++l){const c=l-127;c<-27?(i[l]=0,i[l|256]=32768,s[l]=24,s[l|256]=24):c<-14?(i[l]=1024>>-c-14,i[l|256]=1024>>-c-14|32768,s[l]=-c-1,s[l|256]=-c-1):c<=15?(i[l]=c+15<<10,i[l|256]=c+15<<10|32768,s[l]=13,s[l|256]=13):c<128?(i[l]=31744,i[l|256]=64512,s[l]=24,s[l|256]=24):(i[l]=31744,i[l|256]=64512,s[l]=13,s[l|256]=13)}const r=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;(c&8388608)===0;)c<<=1,h-=8388608;c&=-8388609,h+=947912704,r[l]=c|h}for(let l=1024;l<2048;++l)r[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)a[l]=l<<23;a[31]=1199570944,a[32]=2147483648;for(let l=33;l<63;++l)a[l]=2147483648+(l-32<<23);a[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(o[l]=1024);return{floatView:e,uint32View:t,baseTable:i,shiftTable:s,mantissaTable:r,exponentTable:a,offsetTable:o}}function xg(n){Math.abs(n)>65504&&Pe("DataUtils.toHalfFloat(): Value out of range."),n=$e(n,-65504,65504),Qi.floatView[0]=n;const e=Qi.uint32View[0],t=e>>23&511;return Qi.baseTable[t]+((e&8388607)>>Qi.shiftTable[t])}function yg(n){const e=n>>10;return Qi.uint32View[0]=Qi.mantissaTable[Qi.offsetTable[e]+(n&1023)]+Qi.exponentTable[e],Qi.floatView[0]}class TS{static toHalfFloat(e){return xg(e)}static fromHalfFloat(e){return yg(e)}}const Mt=new Y,Lr=new Je;let Sg=0;class rn extends An{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Sg++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=ud,this.updateRanges=[],this.gpuType=mi,this.version=0,this._normalizationScale=e!==void 0?Da(e):void 0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Lr.fromBufferAttribute(this,t),Lr.applyMatrix3(e),this.setXY(t,Lr.x,Lr.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Mt.fromBufferAttribute(this,t),Mt.applyMatrix3(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Mt.fromBufferAttribute(this,t),Mt.applyMatrix4(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Mt.fromBufferAttribute(this,t),Mt.applyNormalMatrix(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Mt.fromBufferAttribute(this,t),Mt.transformDirection(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=this._denormalize(i)),i}setComponent(e,t,i){return this.normalized&&(i=this._normalize(i)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i),s=this._normalize(s)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i),s=this._normalize(s),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(e){const t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):Jl(e,this.array)}_normalize(e){const t=this._normalizationScale;return t!==void 0?Math.round(e*t):Ql(e,this.array)}}class vd extends rn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class _d extends rn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class ni extends rn{constructor(e,t,i){super(new Float32Array(e),t,i)}}const Mg=new Cn,Bs=new Y,bo=new Y;class on{constructor(e=new Y,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Mg.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Bs.subVectors(e,this.center);const t=Bs.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(Bs,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(bo.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Bs.copy(e.center).add(bo)),this.expandByPoint(Bs.copy(e.center).sub(bo))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let bg=0;const ui=new qe,wo=new yt,ss=new Y,ti=new Cn,zs=new Cn,It=new Y;class Hi extends An{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:bg++}),this.uuid=zi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(km(e)?_d:vd)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new ke().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return ui.makeRotationFromQuaternion(e),this.applyMatrix4(ui),this}rotateX(e){return ui.makeRotationX(e),this.applyMatrix4(ui),this}rotateY(e){return ui.makeRotationY(e),this.applyMatrix4(ui),this}rotateZ(e){return ui.makeRotationZ(e),this.applyMatrix4(ui),this}translate(e,t,i){return ui.makeTranslation(e,t,i),this.applyMatrix4(ui),this}scale(e,t,i){return ui.makeScale(e,t,i),this.applyMatrix4(ui),this}lookAt(e){return wo.lookAt(e),wo.updateMatrix(),this.applyMatrix4(wo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ss).negate(),this.translate(ss.x,ss.y,ss.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ni(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Pe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Cn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Fe("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new Y(-1/0,-1/0,-1/0),new Y(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const r=t[i];ti.setFromBufferAttribute(r),this.morphTargetsRelative?(It.addVectors(this.boundingBox.min,ti.min),this.boundingBox.expandByPoint(It),It.addVectors(this.boundingBox.max,ti.max),this.boundingBox.expandByPoint(It)):(this.boundingBox.expandByPoint(ti.min),this.boundingBox.expandByPoint(ti.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Fe('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new on);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Fe("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new Y,1/0);return}if(e){const i=this.boundingSphere.center;if(ti.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];zs.setFromBufferAttribute(o),this.morphTargetsRelative?(It.addVectors(ti.min,zs.min),ti.expandByPoint(It),It.addVectors(ti.max,zs.max),ti.expandByPoint(It)):(ti.expandByPoint(zs.min),ti.expandByPoint(zs.max))}ti.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)It.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(It));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)It.fromBufferAttribute(o,c),l&&(ss.fromBufferAttribute(e,c),It.add(ss)),s=Math.max(s,i.distanceToSquared(It))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Fe('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Fe("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,r=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==i.count)&&(a=new rn(new Float32Array(4*i.count),4),this.setAttribute("tangent",a));const o=[],l=[],c=new Uint8Array(i.count);for(let P=0;P<i.count;P++)o[P]=new Y,l[P]=new Y;const h=new Y,f=new Y,u=new Y,d=new Je,p=new Je,_=new Je,m=new Y,v=new Y;function y(P,T,I){c[P]=c[T]=c[I]=1,h.fromBufferAttribute(i,P),f.fromBufferAttribute(i,T),u.fromBufferAttribute(i,I),d.fromBufferAttribute(r,P),p.fromBufferAttribute(r,T),_.fromBufferAttribute(r,I),f.sub(h),u.sub(h),p.sub(d),_.sub(d);const U=1/(p.x*_.y-_.x*p.y);isFinite(U)&&(m.copy(f).multiplyScalar(_.y).addScaledVector(u,-p.y).multiplyScalar(U),v.copy(u).multiplyScalar(p.x).addScaledVector(f,-_.x).multiplyScalar(U),o[P].add(m),o[T].add(m),o[I].add(m),l[P].add(v),l[T].add(v),l[I].add(v))}let A=this.groups;A.length===0&&(A=[{start:0,count:e.count}]);for(let P=0,T=A.length;P<T;++P){const I=A[P],U=I.start,D=I.count;for(let w=U,O=U+D;w<O;w+=3)y(e.getX(w+0),e.getX(w+1),e.getX(w+2))}const R=new Y,S=new Y,M=new Y,g=new Y;function x(P){M.fromBufferAttribute(s,P),g.copy(M);const T=o[P];R.copy(T),R.sub(M.multiplyScalar(M.dot(T))).normalize(),S.crossVectors(g,T);const U=S.dot(l[P])<0?-1:1;a.setXYZW(P,R.x,R.y,R.z,U)}for(let P=0,T=i.count;P<T;++P)c[P]&&x(P);this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new rn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let u=0,d=i.count;u<d;u++)i.setXYZ(u,0,0,0);const s=new Y,r=new Y,a=new Y,o=new Y,l=new Y,c=new Y,h=new Y,f=new Y;if(e)for(let u=0,d=e.count;u<d;u+=3){const p=e.getX(u+0),_=e.getX(u+1),m=e.getX(u+2);s.fromBufferAttribute(t,p),r.fromBufferAttribute(t,_),a.fromBufferAttribute(t,m),h.subVectors(a,r),f.subVectors(s,r),h.cross(f),o.fromBufferAttribute(i,p),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,m),o.add(h),l.add(h),c.add(h),i.setXYZ(p,o.x,o.y,o.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,d=t.count;u<d;u+=3)s.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),a.fromBufferAttribute(t,u+2),h.subVectors(a,r),f.subVectors(s,r),h.cross(f),i.setXYZ(u+0,h.x,h.y,h.z),i.setXYZ(u+1,h.x,h.y,h.z),i.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)It.fromBufferAttribute(e,t),It.normalize(),e.setXYZ(t,It.x,It.y,It.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,f=o.normalized,u=new c.constructor(l.length*h);let d=0,p=0;for(let _=0,m=l.length;_<m;_++){o.isInterleavedBufferAttribute?d=l[_]*o.data.stride+o.offset:d=l[_]*h;for(let v=0;v<h;v++)u[p++]=c[d++]}return new rn(u,h,f)}if(this.index===null)return Pe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Hi,i=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,i);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,f=c.length;h<f;h++){const u=c[h],d=e(u,i);l.push(d)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,u=c.length;f<u;f++){const d=c[f];h.push(d.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],f=r[c];for(let u=0,d=f.length;u<d;u++)h.push(f[u].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class AS{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=ud,this.updateRanges=[],this.version=0,this.uuid=zi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[i+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});const t=ph(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=this.array.slice(0).buffer);const i=new this.array.constructor(e.arrayBuffers[t]),s=new this.constructor(i,this.stride);return s.setUsage(this.usage),s}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});const t=ph(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=Array.from(new Uint32Array(this.array.slice(0).buffer)));const i={uuid:this.uuid,buffer:t,type:this.array.constructor.name,stride:this.stride};return i.usage=this.usage,i}}function ph(n){return n.buffer._uuid===void 0&&(n.buffer._uuid=zi()),n.byteOffset===0&&n.byteLength===n.buffer.byteLength?n.buffer._uuid:n.buffer._uuid+":"+n.byteOffset+":"+n.byteLength}const Xt=new Y;class xd{constructor(e,t,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=s,this._normalizationScale=e!==void 0?Da(e.array):void 0}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)Xt.fromBufferAttribute(this,t),Xt.applyMatrix4(e),this.setXYZ(t,Xt.x,Xt.y,Xt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Xt.fromBufferAttribute(this,t),Xt.applyNormalMatrix(e),this.setXYZ(t,Xt.x,Xt.y,Xt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Xt.fromBufferAttribute(this,t),Xt.transformDirection(e),this.setXYZ(t,Xt.x,Xt.y,Xt.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=this._denormalize(i)),i}setComponent(e,t,i){return this.normalized&&(i=this._normalize(i)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=this._denormalize(t)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=this._denormalize(t)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=this._denormalize(t)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=this._denormalize(t)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),i=this._normalize(i)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),i=this._normalize(i),s=this._normalize(s)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),i=this._normalize(i),s=this._normalize(s),r=this._normalize(r)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){Ea("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new rn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new xd(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Ea("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}_denormalize(e){const t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):Jl(e,this.data.array)}_normalize(e){const t=this._normalizationScale;return t!==void 0?Math.round(e*t):Ql(e,this.data.array)}}const Eo=new Y,wg=new Y,Eg=new ke;class xn{constructor(e=new Y(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=Eo.subVectors(i,t).cross(wg.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const s=e.delta(Eo),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return i===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Eg.getNormalMatrix(e),s=this.coplanarPoint(Eo).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let Tg=0;class Gn extends An{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Tg++}),this.uuid=zi(),this.name="",this.type="Material",this.blending=er,this.side=zn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=$u,this.blendDst=_a,this.blendEquation=Ji,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new We(0,0,0),this.blendAlpha=0,this.depthFunc=sr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Lm,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ao,this.stencilZFail=ao,this.stencilZPass=ao,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){Pe(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Pe(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(i.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(i.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(i.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(i.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new We().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new xn().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new Je().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Je().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Yi=new Y,To=new Y,Nr=new Y,Dr=new Y;class Ua{constructor(e=new Y,t=new Y(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Yi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Yi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Yi.copy(this.origin).addScaledVector(this.direction,t),Yi.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){To.copy(e).add(t).multiplyScalar(.5),Nr.copy(t).sub(e).normalize(),Dr.copy(this.origin).sub(To);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Nr),o=Dr.dot(this.direction),l=-Dr.dot(Nr),c=Dr.lengthSq(),h=Math.abs(1-a*a);let f,u,d,p;if(h>0)if(f=a*l-o,u=a*o-l,p=r*h,f>=0)if(u>=-p)if(u<=p){const _=1/h;f*=_,u*=_,d=f*(f+a*u+2*o)+u*(a*f+u+2*l)+c}else u=r,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;else u=-r,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;else u<=-p?(f=Math.max(0,-(-a*r+o)),u=f>0?-r:Math.min(Math.max(-r,-l),r),d=-f*f+u*(u+2*l)+c):u<=p?(f=0,u=Math.min(Math.max(-r,-l),r),d=u*(u+2*l)+c):(f=Math.max(0,-(a*r+o)),u=f>0?r:Math.min(Math.max(-r,-l),r),d=-f*f+u*(u+2*l)+c);else u=a>0?-r:r,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(To).addScaledVector(Nr,u),d}intersectSphere(e,t){if(e.radius<0)return null;Yi.subVectors(e.center,this.origin);const i=Yi.dot(this.direction),s=Yi.dot(Yi)-i*i,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,u=this.origin;return c>=0?(i=(e.min.x-u.x)*c,s=(e.max.x-u.x)*c):(i=(e.max.x-u.x)*c,s=(e.min.x-u.x)*c),h>=0?(r=(e.min.y-u.y)*h,a=(e.max.y-u.y)*h):(r=(e.max.y-u.y)*h,a=(e.min.y-u.y)*h),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(e.min.z-u.z)*f,l=(e.max.z-u.z)*f):(o=(e.max.z-u.z)*f,l=(e.min.z-u.z)*f),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Yi)!==null}intersectTriangle(e,t,i,s,r){const a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,f=e.x-a.x,u=e.y-a.y,d=e.z-a.z,p=t.x-a.x,_=t.y-a.y,m=t.z-a.z,v=i.x-a.x,y=i.y-a.y,A=i.z-a.z,R=Math.abs(l),S=Math.abs(c),M=Math.abs(h);let g,x,P,T,I,U,D,w,O,B,z,L;if(R>=S&&R>=M?(P=l,U=f,O=p,L=v,l>=0?(g=c,x=h,T=u,I=d,D=_,w=m,B=y,z=A):(g=h,x=c,T=d,I=u,D=m,w=_,B=A,z=y)):S>=M?(P=c,U=u,O=_,L=y,c>=0?(g=h,x=l,T=d,I=f,D=m,w=p,B=A,z=v):(g=l,x=h,T=f,I=d,D=p,w=m,B=v,z=A)):(P=h,U=d,O=m,L=A,h>=0?(g=l,x=c,T=f,I=u,D=p,w=_,B=v,z=y):(g=c,x=l,T=u,I=f,D=_,w=p,B=y,z=v)),P===0)return null;const C=g/P,H=x/P,W=1/P,K=T-C*U,Q=I-H*U,G=D-C*O,j=w-H*O,re=B-C*L,le=z-H*L,ae=re*j-le*G,Ie=K*le-Q*re,it=G*Q-j*K;if(s){if(ae<0||Ie<0||it<0)return null}else if((ae<0||Ie<0||it<0)&&(ae>0||Ie>0||it>0))return null;const Ee=ae+Ie+it;if(Ee===0)return null;const De=W*(ae*U+Ie*O+it*L);return(Ee>0?De<0:De>0)?null:this.at(De/Ee,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ag extends Gn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new We(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Tn,this.combine=qu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const mh=new qe,Un=new Ua,Ur=new on,gh=new Y,Fr=new Y,Or=new Y,kr=new Y,Ao=new Y,Br=new Y,vh=new Y,zr=new Y;class vi extends yt{constructor(e=new Hi,t=new Ag){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Br.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],f=r[l];h!==0&&(Ao.fromBufferAttribute(f,e),a?Br.addScaledVector(Ao,h):Br.addScaledVector(Ao.sub(t),h))}t.add(Br)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ur.copy(i.boundingSphere),Ur.applyMatrix4(r),Un.copy(e.ray).recast(e.near),!(Ur.containsPoint(Un.origin)===!1&&(Un.intersectSphere(Ur,gh)===null||Un.origin.distanceToSquared(gh)>(e.far-e.near)**2))&&(mh.copy(r).invert(),Un.copy(e.ray).applyMatrix4(mh),!(i.boundingBox!==null&&Un.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Un)))}_computeIntersections(e,t,i){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,f=r.attributes.normal,u=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,_=u.length;p<_;p++){const m=u[p],v=a[m.materialIndex],y=Math.max(m.start,d.start),A=Math.min(o.count,Math.min(m.start+m.count,d.start+d.count));for(let R=y,S=A;R<S;R+=3){const M=o.getX(R),g=o.getX(R+1),x=o.getX(R+2);s=Hr(this,v,e,i,c,h,f,M,g,x),s&&(s.faceIndex=Math.floor(R/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const p=Math.max(0,d.start),_=Math.min(o.count,d.start+d.count);for(let m=p,v=_;m<v;m+=3){const y=o.getX(m),A=o.getX(m+1),R=o.getX(m+2);s=Hr(this,a,e,i,c,h,f,y,A,R),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let p=0,_=u.length;p<_;p++){const m=u[p],v=a[m.materialIndex],y=Math.max(m.start,d.start),A=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let R=y,S=A;R<S;R+=3){const M=R,g=R+1,x=R+2;s=Hr(this,v,e,i,c,h,f,M,g,x),s&&(s.faceIndex=Math.floor(R/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const p=Math.max(0,d.start),_=Math.min(l.count,d.start+d.count);for(let m=p,v=_;m<v;m+=3){const y=m,A=m+1,R=m+2;s=Hr(this,a,e,i,c,h,f,y,A,R),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function Cg(n,e,t,i,s,r,a,o){let l;if(e.side===Jt?l=i.intersectTriangle(a,r,s,!0,o):l=i.intersectTriangle(s,r,a,e.side===zn,o),l===null)return null;zr.copy(o),zr.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(zr);return c<t.near||c>t.far?null:{distance:c,point:zr.clone(),object:n}}function Hr(n,e,t,i,s,r,a,o,l,c){n.getVertexPosition(o,Fr),n.getVertexPosition(l,Or),n.getVertexPosition(c,kr);const h=Cg(n,e,t,i,Fr,Or,kr,vh);if(h){const f=new Y;Ri.getBarycoord(vh,Fr,Or,kr,f),s&&(h.uv=Ri.getInterpolatedAttribute(s,o,l,c,f,new Je)),r&&(h.uv1=Ri.getInterpolatedAttribute(r,o,l,c,f,new Je)),a&&(h.normal=Ri.getInterpolatedAttribute(a,o,l,c,f,new Y),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new Y,materialIndex:0};Ri.getNormal(Fr,Or,kr,u.normal),h.face=u,h.barycoord=f}return h}const Hs=new lt,_h=new lt,xh=new lt,Rg=new lt,yh=new qe,Vr=new Y,Co=new on,Sh=new qe,Ro=new Ua;class CS extends vi{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Qc,this.bindMatrix=new qe,this.bindMatrixInverse=new qe,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Cn),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,Vr),this.boundingBox.expandByPoint(Vr)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new on),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,Vr),this.boundingSphere.expandByPoint(Vr)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this}raycast(e,t){const i=this.material,s=this.matrixWorld;i!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Co.copy(this.boundingSphere),Co.applyMatrix4(s),e.ray.intersectsSphere(Co)!==!1&&(Sh.copy(s).invert(),Ro.copy(e.ray).applyMatrix4(Sh),!(this.boundingBox!==null&&Ro.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Ro)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new lt,t=this.geometry.attributes.skinWeight;for(let i=0,s=t.count;i<s;i++){e.fromBufferAttribute(t,i);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(i,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Qc?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===wm?this.bindMatrixInverse.copy(this.bindMatrix).invert():Pe("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const i=this.skeleton,s=this.geometry;_h.fromBufferAttribute(s.attributes.skinIndex,e),xh.fromBufferAttribute(s.attributes.skinWeight,e),t.isVector4?(Hs.copy(t),t.set(0,0,0,0)):(Hs.set(t.x,t.y,t.z,1),t.set(0,0,0)),Hs.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){const a=xh.getComponent(r);if(a!==0){const o=_h.getComponent(r);yh.multiplyMatrices(i.bones[o].matrixWorld,i.boneInverses[o]),t.addScaledVector(Rg.copy(Hs).applyMatrix4(yh),a)}}return t.isVector4&&(t.w=Hs.w),t.applyMatrix4(this.bindMatrixInverse)}}class Pg extends yt{constructor(){super(),this.isBone=!0,this.type="Bone"}}class bs extends Ot{constructor(e=null,t=1,i=1,s,r,a,o,l,c=Et,h=Et,f,u){super(null,a,o,l,c,h,s,r,f,u),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Mh=new qe,Ig=new qe;class yd{constructor(e=[],t=[]){this.uuid=zi(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.previousBoneMatrices=null,this.boneTexture=null,this.previousBoneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Pe("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let i=0,s=this.bones.length;i<s;i++)this.boneInverses.push(new qe)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const i=new qe;this.bones[e]&&i.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(i)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const i=this.bones[e];i&&i.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const i=this.bones[e];i&&(i.parent&&i.parent.isBone?(i.matrix.copy(i.parent.matrixWorld).invert(),i.matrix.multiply(i.matrixWorld)):i.matrix.copy(i.matrixWorld),i.matrix.decompose(i.position,i.quaternion,i.scale))}}update(){const e=this.bones,t=this.boneInverses,i=this.boneMatrices,s=this.boneTexture;for(let r=0,a=e.length;r<a;r++){const o=e[r]?e[r].matrixWorld:Ig;Mh.multiplyMatrices(o,t[r]),Mh.toArray(i,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new yd(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const i=new bs(t,e,e,gi,mi);return i.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=i,this}getBoneByName(e){for(let t=0,i=this.bones.length;t<i;t++){const s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null),this.previousBoneTexture!==null&&(this.previousBoneTexture.dispose(),this.previousBoneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let i=0,s=e.bones.length;i<s;i++){const r=e.bones[i];let a=t[r];a===void 0&&(Pe("Skeleton: No bone found with UUID:",r),a=new Pg),this.bones.push(a),this.boneInverses.push(new qe().fromArray(e.boneInverses[i]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,i=this.boneInverses;for(let s=0,r=t.length;s<r;s++){const a=t[s];e.bones.push(a.uuid);const o=i[s];e.boneInverses.push(o.toArray())}return e}}class bh extends rn{constructor(e,t,i,s=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const rs=new qe,wh=new qe,Gr=[],Eh=new Cn,Lg=new qe,Vs=new vi,Gs=new on;class RS extends vi{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new bh(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,Lg)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Cn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,rs),Eh.copy(e.boundingBox).applyMatrix4(rs),this.boundingBox.union(Eh)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new on),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,rs),Gs.copy(e.boundingSphere).applyMatrix4(rs),this.boundingSphere.union(Gs)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),this.morphTexture=e.morphTexture!==null?e.morphTexture.clone():null,this.instanceColor=e.instanceColor!==null?e.instanceColor.clone():null,this.count=e.count,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=i.length+1,a=e*r+1;for(let o=0;o<i.length;o++)i[o]=s[a+o]}raycast(e,t){const i=this.matrixWorld,s=this.count;if(Vs.geometry=this.geometry,Vs.material=this.material,Vs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Gs.copy(this.boundingSphere),Gs.applyMatrix4(i),e.ray.intersectsSphere(Gs)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,rs),wh.multiplyMatrices(i,rs),Vs.matrixWorld=wh,Vs.raycast(e,Gr);for(let a=0,o=Gr.length;a<o;a++){const l=Gr[a];l.instanceId=r,l.object=this,t.push(l)}Gr.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new bh(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const i=t.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new bs(new Float32Array(s*this.count),s,this.count,Na,mi));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<i.length;c++)a+=i[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=s*e;return r[l]=o,r.set(i,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Fn=new on,Ng=new Je(.5,.5),Wr=new Y;class hr{constructor(e=new xn,t=new xn,i=new xn,s=new xn,r=new xn,a=new xn){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Pi,i=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],f=r[5],u=r[6],d=r[7],p=r[8],_=r[9],m=r[10],v=r[11],y=r[12],A=r[13],R=r[14],S=r[15];if(s[0].setComponents(c-a,d-h,v-p,S-y).normalize(),s[1].setComponents(c+a,d+h,v+p,S+y).normalize(),s[2].setComponents(c+o,d+f,v+_,S+A).normalize(),s[3].setComponents(c-o,d-f,v-_,S-A).normalize(),i)s[4].setComponents(l,u,m,R).normalize(),s[5].setComponents(c-l,d-u,v-m,S-R).normalize();else if(s[4].setComponents(c-l,d-u,v-m,S-R).normalize(),t===Pi)s[5].setComponents(c+l,d+u,v+m,S+R).normalize();else if(t===lr)s[5].setComponents(l,u,m,R).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Fn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Fn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Fn)}intersectsSprite(e){Fn.center.set(0,0,0);const t=Ng.distanceTo(e.center);return Fn.radius=.7071067811865476+t,Fn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Fn)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(Wr.x=s.normal.x>0?e.max.x:e.min.x,Wr.y=s.normal.y>0?e.max.y:e.min.y,Wr.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Wr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}const Th=new qe;class tc{constructor(){this.coordinateSystem=Pi,this._frustums=[],this._count=0}setFromArrayCamera(e){const t=e.cameras,i=this._frustums;for(let s=0;s<t.length;s++){const r=t[s];Th.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),i[s]===void 0&&(i[s]=new hr),i[s].setFromProjectionMatrix(Th,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsObject(e))return!0;return!1}intersectsSprite(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsSprite(e))return!0;return!1}intersectsSphere(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsSphere(e))return!0;return!1}intersectsBox(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsBox(e))return!0;return!1}containsPoint(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;const t=this._frustums,i=e._frustums;for(let s=0;s<e._count;s++)t[s]===void 0&&(t[s]=new hr),t[s].copy(i[s]);return this._count=e._count,this}clone(){return new tc().copy(this)}}class Dg extends Gn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new We(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Ta=new Y,Aa=new Y,Ah=new qe,Ws=new Ua,Xr=new on,Po=new Y,Ch=new Y;class Sd extends yt{constructor(e=new Hi,t=new Dg){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let s=1,r=t.count;s<r;s++)Ta.fromBufferAttribute(t,s-1),Aa.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=Ta.distanceTo(Aa);e.setAttribute("lineDistance",new ni(i,1))}else Pe("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Xr.copy(i.boundingSphere),Xr.applyMatrix4(s),Xr.radius+=r,e.ray.intersectsSphere(Xr)===!1)return;Ah.copy(s).invert(),Ws.copy(e.ray).applyMatrix4(Ah);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=i.index,u=i.attributes.position;if(h!==null){const d=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let _=d,m=p-1;_<m;_+=c){const v=h.getX(_),y=h.getX(_+1),A=$r(this,e,Ws,l,v,y,_);A&&t.push(A)}if(this.isLineLoop){const _=h.getX(p-1),m=h.getX(d),v=$r(this,e,Ws,l,_,m,p-1);v&&t.push(v)}}else{const d=Math.max(0,a.start),p=Math.min(u.count,a.start+a.count);for(let _=d,m=p-1;_<m;_+=c){const v=$r(this,e,Ws,l,_,_+1,_);v&&t.push(v)}if(this.isLineLoop){const _=$r(this,e,Ws,l,p-1,d,p-1);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function $r(n,e,t,i,s,r,a){const o=n.geometry.attributes.position;if(Ta.fromBufferAttribute(o,s),Aa.fromBufferAttribute(o,r),t.distanceSqToSegment(Ta,Aa,Po,Ch)>i)return;Po.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(Po);if(!(c<e.near||c>e.far))return{distance:c,point:Ch.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const Rh=new Y,Ph=new Y;class PS extends Sd{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let s=0,r=t.count;s<r;s+=2)Rh.fromBufferAttribute(t,s),Ph.fromBufferAttribute(t,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+Rh.distanceTo(Ph);e.setAttribute("lineDistance",new ni(i,1))}else Pe("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class IS extends Sd{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class Ug extends Gn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new We(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Ih=new qe,Dl=new Ua,qr=new on,Yr=new Y;class LS extends yt{constructor(e=new Hi,t=new Ug){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),qr.copy(i.boundingSphere),qr.applyMatrix4(s),qr.radius+=r,e.ray.intersectsSphere(qr)===!1)return;Ih.copy(s).invert(),Dl.copy(e.ray).applyMatrix4(Ih);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,f=i.attributes.position;if(c!==null){const u=Math.max(0,a.start),d=Math.min(c.count,a.start+a.count);for(let p=u,_=d;p<_;p++){const m=c.getX(p);Yr.fromBufferAttribute(f,m),Lh(Yr,m,l,s,e,t,this)}}else{const u=Math.max(0,a.start),d=Math.min(f.count,a.start+a.count);for(let p=u,_=d;p<_;p++)Yr.fromBufferAttribute(f,p),Lh(Yr,p,l,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Lh(n,e,t,i,s,r,a){const o=Dl.distanceSqToPoint(n);if(o<t){const l=new Y;Dl.closestPointToPoint(n,l),l.applyMatrix4(i);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class Md extends Ot{constructor(e=[],t=ys,i,s,r,a,o,l,c,h){super(e,t,i,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class ws extends Ot{constructor(e,t,i=ki,s,r,a,o=Et,l=Et,c,h=En,f=1){if(h!==En&&h!==bn)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:e,height:t,depth:f};super(u,s,r,a,o,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new ec(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class bd extends ws{constructor(e,t=ki,i=ys,s,r,a=Et,o=Et,l,c=En){const h={width:e,height:e,depth:1},f=[h,h,h,h,h,h];super(e,e,t,i,s,r,a,o,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class wd extends Ot{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class dr extends Hi{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],f=[];let u=0,d=0;p("z","y","x",-1,-1,i,t,e,a,r,0),p("z","y","x",1,-1,i,t,-e,a,r,1),p("x","z","y",1,1,e,i,t,s,a,2),p("x","z","y",1,-1,e,i,-t,s,a,3),p("x","y","z",1,-1,e,t,i,s,r,4),p("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new ni(c,3)),this.setAttribute("normal",new ni(h,3)),this.setAttribute("uv",new ni(f,2));function p(_,m,v,y,A,R,S,M,g,x,P){const T=R/g,I=S/x,U=R/2,D=S/2,w=M/2,O=g+1,B=x+1;let z=0,L=0;const C=new Y;for(let H=0;H<B;H++){const W=H*I-D;for(let K=0;K<O;K++){const Q=K*T-U;C[_]=Q*y,C[m]=W*A,C[v]=w,c.push(C.x,C.y,C.z),C[_]=0,C[m]=0,C[v]=M>0?1:-1,h.push(C.x,C.y,C.z),f.push(K/g),f.push(1-H/x),z+=1}}for(let H=0;H<x;H++)for(let W=0;W<g;W++){const K=u+W+O*H,Q=u+W+O*(H+1),G=u+(W+1)+O*(H+1),j=u+(W+1)+O*H;l.push(K,Q,j),l.push(Q,G,j),L+=6}o.addGroup(d,L,P),d+=L,u+=z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new dr(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Fa extends Hi{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(i),l=Math.floor(s),c=o+1,h=l+1,f=e/o,u=t/l,d=[],p=[],_=[],m=[];for(let v=0;v<h;v++){const y=v*u-a;for(let A=0;A<c;A++){const R=A*f-r;p.push(R,-y,0),_.push(0,0,1),m.push(A/o),m.push(1-v/l)}}for(let v=0;v<l;v++)for(let y=0;y<o;y++){const A=y+c*v,R=y+c*(v+1),S=y+1+c*(v+1),M=y+1+c*v;d.push(A,R,M),d.push(R,S,M)}this.setIndex(d),this.setAttribute("position",new ni(p,3)),this.setAttribute("normal",new ni(_,3)),this.setAttribute("uv",new ni(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Fa(e.width,e.height,e.widthSegments,e.heightSegments)}}function Es(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];if(Nh(s))s.isRenderTargetTexture?(Pe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone();else if(Array.isArray(s))if(Nh(s[0])){const r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][i]=r}else e[t][i]=s.slice();else e[t][i]=s}}return e}function qt(n){const e={};for(let t=0;t<n.length;t++){const i=Es(n[t]);for(const s in i)e[s]=i[s]}return e}function Nh(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function Fg(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Ed(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:je.workingColorSpace}const Og={clone:Es,merge:qt};var kg=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Bg=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Vn extends Gn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=kg,this.fragmentShader=Bg,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Es(e.uniforms),this.uniformsGroups=Fg(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const i in e.uniforms){const s=e.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=t[s.value]||null;break;case"c":this.uniforms[i].value=new We().setHex(s.value);break;case"v2":this.uniforms[i].value=new Je().fromArray(s.value);break;case"v3":this.uniforms[i].value=new Y().fromArray(s.value);break;case"v4":this.uniforms[i].value=new lt().fromArray(s.value);break;case"m3":this.uniforms[i].value=new ke().fromArray(s.value);break;case"m4":this.uniforms[i].value=new qe().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class Ul extends Vn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class zg extends Gn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new We(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new We(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Nl,this.normalScale=new Je(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Tn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class NS extends zg{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Je(1,1),this.clearcoatNormalMap=null,this.diffuseRoughnessMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return $e(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessMinimum=100,this.iridescenceThicknessMaximum=400,this.iridescenceThicknessMap=null,this.sheenColor=new We(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new We(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new We(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._diffuseRoughness=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get diffuseRoughness(){return this._diffuseRoughness}set diffuseRoughness(e){this._diffuseRoughness>0!=e>0&&this.version++,this._diffuseRoughness=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}get iridescenceThicknessRange(){return _s('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),[this.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum]}set iridescenceThicknessRange(e){_s('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),this.iridescenceThicknessMinimum=e[0],this.iridescenceThicknessMaximum=e[1]}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.diffuseRoughness=e.diffuseRoughness,this.diffuseRoughnessMap=e.diffuseRoughnessMap,this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum,this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class Hg extends Gn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Pm,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Vg extends Gn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function yn(n,e){return!n||n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}function Ys(n){return n!==void 0&&n.inTangents!==void 0&&n.outTangents!==void 0}function Gg(n){function e(s,r){return n[s]-n[r]}const t=n.length,i=new Array(t);for(let s=0;s!==t;++s)i[s]=s;return i.sort(e),i}function Dh(n,e,t){const i=n.length,s=new n.constructor(i);for(let r=0,a=0;a!==i;++r){const o=t[r]*e;for(let l=0;l!==e;++l)s[a++]=n[o+l]}return s}function Wg(n,e,t,i){let s=1,r=n[0];for(;r!==void 0&&r[i]===void 0;)r=n[s++];if(r===void 0)return;let a=r[i];if(a!==void 0)if(Array.isArray(a))do a=r[i],a!==void 0&&(e.push(r.time),t.push(...a)),r=n[s++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[i],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=n[s++];while(r!==void 0);else do a=r[i],a!==void 0&&(e.push(r.time),t.push(a)),r=n[s++];while(r!==void 0)}class fr{constructor(e,t,i,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let i=this._cachedIndex,s=t[i],r=t[i-1];e:{t:{let a;i:{n:if(!(e<s)){for(let o=i+2;;){if(s===void 0){if(e<r)break n;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(r=s,s=t[++i],e<s)break t}a=t.length;break i}if(!(e>=r)){const o=t[1];e<o&&(i=2,r=o);for(let l=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(s=r,r=t[--i-1],e>=r)break t}a=i,i=0;break i}break e}for(;i<a;){const o=i+a>>>1;e<t[o]?a=o:i=o+1}if(s=t[i],r=t[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=i[r+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}}class Xg extends fr{constructor(e,t,i,s){super(e,t,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ms,endingEnd:ms}}intervalChanged_(e,t,i){const s=this.parameterPositions;let r=e-2,a=e+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case gs:r=e,o=2*t-i;break;case Ma:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=i}if(l===void 0)switch(this.getSettings_().endingEnd){case gs:a=e,l=2*i-t;break;case Ma:a=1,l=i+s[1]-s[0];break;default:a=e-1,l=t}const c=(i-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-i),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,i,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,f=this._offsetNext,u=this._weightPrev,d=this._weightNext,p=(i-t)/(s-t),_=p*p,m=_*p,v=-u*m+2*u*_-u*p,y=(1+u)*m+(-1.5-2*u)*_+(-.5+u)*p+1,A=(-1-d)*m+(1.5+d)*_+.5*p,R=d*m-d*_;for(let S=0;S!==o;++S)r[S]=v*a[h+S]+y*a[c+S]+A*a[l+S]+R*a[f+S];return r}}class Td extends fr{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(i-t)/(s-t),f=1-h;for(let u=0;u!==o;++u)r[u]=a[c+u]*f+a[l+u]*h;return r}}class $g extends fr{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e){return this.copySampleValue_(e-1)}}class qg extends fr{interpolate_(e,t,i,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this.inTangents,f=this.outTangents;if(!h||!f){const p=(i-t)/(s-t),_=1-p;for(let m=0;m!==o;++m)r[m]=a[c+m]*_+a[l+m]*p;return r}const u=o*2,d=e-1;for(let p=0;p!==o;++p){const _=a[c+p],m=a[l+p],v=d*u+p*2,y=f[v],A=f[v+1],R=e*u+p*2,S=h[R],M=h[R+1],g=Kg(i,t,y,S,s);r[p]=Ad(g,_,A,M,m)}return r}}function Ad(n,e,t,i,s){const r=1-n;return r*r*r*e+3*r*r*n*t+3*r*n*n*i+n*n*n*s}function Yg(n,e,t,i,s){const r=1-n;return 3*r*r*(t-e)+6*r*n*(i-t)+3*n*n*(s-i)}function Kg(n,e,t,i,s){let r=(n-e)/(s-e);for(let a=0;a<8;a++){const o=Ad(r,e,t,i,s)-n;if(Math.abs(o)<1e-10)break;const l=Yg(r,e,t,i,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-o/l))}return r}class Ii{constructor(e,t,i,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=yn(t,this.TimeBufferType),this.values=yn(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:yn(e.times,Array),values:yn(e.values,Array)};const s=e.getInterpolation();s!==e.DefaultInterpolation&&(i.interpolation=s),Ys(e.settings)&&(i.settings={inTangents:yn(e.settings.inTangents,Array),outTangents:yn(e.settings.outTangents,Array)})}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new $g(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Td(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Xg(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){const t=new qg(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Sa:t=this.InterpolantFactoryMethodDiscrete;break;case Ll:t=this.InterpolantFactoryMethodLinear;break;case ro:t=this.InterpolantFactoryMethodSmooth;break;case eh:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){const i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return Pe("KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Sa;case this.InterpolantFactoryMethodLinear:return Ll;case this.InterpolantFactoryMethodSmooth:return ro;case this.InterpolantFactoryMethodBezier:return eh}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]+=e;Ys(this.settings)&&(Uh(this.settings.inTangents,e),Uh(this.settings.outTangents,e))}return this}scale(e){if(e!==1){const t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]*=e;Ys(this.settings)&&(Fh(this.settings.inTangents,e),Fh(this.settings.outTangents,e))}return this}trim(e,t){const i=this.times,s=i.length;let r=0,a=s-1;for(;r!==s&&i[r]<e;)++r;for(;a!==-1&&i[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);const o=this.getValueSize();this.times=i.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(Fe("KeyframeTrack: Invalid value size in track.",this),e=!1);const i=this.times,s=this.values,r=i.length;r===0&&(Fe("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){const l=i[o];if(typeof l=="number"&&isNaN(l)){Fe("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){Fe("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(s!==void 0&&Bm(s))for(let o=0,l=s.length;o!==l;++o){const c=s[o];if(isNaN(c)){Fe("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===ro,r=e.length-1;let a=1;for(let o=1;o<r;++o){let l=!1;const c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(s)l=!0;else{const f=o*i,u=f-i,d=f+i;for(let p=0;p!==i;++p){const _=t[f+p];if(_!==t[u+p]||_!==t[d+p]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];const f=o*i,u=a*i;for(let d=0;d!==i;++d)t[u+d]=t[f+d]}++a}}if(r>0){e[a]=e[r];for(let o=r*i,l=a*i,c=0;c!==i;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*i)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),i=this.constructor,s=new i(this.name,e,t);return s.createInterpolant=this.createInterpolant,Ys(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}}function Uh(n,e){for(let t=0,i=n.length;t!==i;t+=2)n[t]+=e}function Fh(n,e){for(let t=0,i=n.length;t!==i;t+=2)n[t]*=e}Ii.prototype.ValueTypeName="";Ii.prototype.TimeBufferType=Float32Array;Ii.prototype.ValueBufferType=Float32Array;Ii.prototype.DefaultInterpolation=Ll;class Ts extends Ii{constructor(e,t,i){super(e,t,i)}}Ts.prototype.ValueTypeName="bool";Ts.prototype.ValueBufferType=Array;Ts.prototype.DefaultInterpolation=Sa;Ts.prototype.InterpolantFactoryMethodLinear=void 0;Ts.prototype.InterpolantFactoryMethodSmooth=void 0;class Cd extends Ii{constructor(e,t,i,s){super(e,t,i,s)}}Cd.prototype.ValueTypeName="color";class ic extends Ii{constructor(e,t,i,s){super(e,t,i,s)}}ic.prototype.ValueTypeName="number";class Zg extends fr{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(i-t)/(s-t);let c=e*o;for(let h=c+o;c!==h;c+=4)Fi.slerpFlat(r,0,a,c-o,a,c,l);return r}}class nc extends Ii{constructor(e,t,i,s){super(e,t,i,s)}InterpolantFactoryMethodLinear(e){return new Zg(this.times,this.values,this.getValueSize(),e)}}nc.prototype.ValueTypeName="quaternion";nc.prototype.InterpolantFactoryMethodSmooth=void 0;class As extends Ii{constructor(e,t,i){super(e,t,i)}}As.prototype.ValueTypeName="string";As.prototype.ValueBufferType=Array;As.prototype.DefaultInterpolation=Sa;As.prototype.InterpolantFactoryMethodLinear=void 0;As.prototype.InterpolantFactoryMethodSmooth=void 0;class Rd extends Ii{constructor(e,t,i,s){super(e,t,i,s)}}Rd.prototype.ValueTypeName="vector";class Oh{constructor(e="",t=-1,i=[],s=Zl){this.name=e,this.tracks=i,this.duration=t,this.blendMode=s,this.uuid=zi(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){const t=[],i=e.tracks,s=1/(e.fps||1);for(let a=0,o=i.length;a!==o;++a)t.push(Jg(i[a]).scale(s));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){const t=[],i=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,a=i.length;r!==a;++r)t.push(Ii.toJSON(i[r]));return s}static CreateFromMorphTargetSequence(e,t,i,s){const r=t.length,a=[];for(let o=0;o<r;o++){let l=[],c=[];l.push((o+r-1)%r,o,(o+1)%r),c.push(0,1,0);const h=Gg(l);l=Dh(l,1,h),c=Dh(c,1,h),!s&&l[0]===0&&(l.push(r),c.push(c[0])),a.push(new ic(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/i))}return new this(e,-1,a)}static findByName(e,t){let i=e;if(!Array.isArray(e)){const s=e;i=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<i.length;s++)if(i[s].name===t)return i[s];return null}static CreateClipsFromMorphTargetSequences(e,t,i){const s={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){const c=e[o],h=c.name.match(r);if(h&&h.length>1){const f=h[1];let u=s[f];u||(s[f]=u=[]),u.push(c)}}const a=[];for(const o in s)a.push(this.CreateFromMorphTargetSequence(o,s[o],t,i));return a}resetDuration(){const e=this.tracks;let t=0;for(let i=0,s=e.length;i!==s;++i){const r=this.tracks[i];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let i=0;i<this.tracks.length;i++)e.push(this.tracks[i].clone());const t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function jg(n){switch(n.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return ic;case"vector":case"vector2":case"vector3":case"vector4":return Rd;case"color":return Cd;case"quaternion":return nc;case"bool":case"boolean":return Ts;case"string":return As}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+n)}function Jg(n){if(n.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=jg(n.type);if(n.times===void 0){const i=[],s=[];Wg(n.keys,i,s,"value"),n.times=i,n.values=s}let t;return e.parse!==void 0?t=e.parse(n):t=new e(n.name,n.times,n.values,n.interpolation),Ys(n.settings)&&(t.settings={inTangents:yn(n.settings.inTangents,Float32Array),outTangents:yn(n.settings.outTangents,Float32Array)}),t}const tn={enabled:!1,files:{},add:function(n,e){this.enabled!==!1&&(kh(n)||(this.files[n]=e))},get:function(n){if(this.enabled!==!1&&!kh(n))return this.files[n]},remove:function(n){delete this.files[n]},clear:function(){this.files={}}};function kh(n){try{const e=n.slice(n.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class Qg{constructor(e,t,i){const s=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this._abortController=null,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,f){return c.push(h,f),this},this.removeHandler=function(h){const f=c.indexOf(h);return f!==-1&&c.splice(f,2),this},this.getHandler=function(h){for(let f=0,u=c.length;f<u;f+=2){const d=c[f],p=c[f+1];if(d.global&&(d.lastIndex=0),d.test(h))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const e0=new Qg;class Cs{constructor(e){this.manager=e!==void 0?e:e0,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},this.priority="auto",this.cache="default",typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const i=this;return new Promise(function(s,r){i.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}setPriority(e){return this.priority=e,this}setCache(e){return this.cache=e,this}abort(){return this}}Cs.DEFAULT_MATERIAL_NAME="__DEFAULT";const Ki={};class t0 extends Error{constructor(e,t){super(e),this.response=t}}class i0 extends Cs{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,i,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=tn.get(`file:${e}`);if(r!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0);return}if(Ki[e]!==void 0){Ki[e].push({onLoad:t,onProgress:i,onError:s});return}Ki[e]=[],Ki[e].push({onLoad:t,onProgress:i,onError:s});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",priority:this.priority,cache:this.cache,signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&Pe("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const h=Ki[e],f=c.body.getReader(),u=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),d=u?parseInt(u):0,p=d!==0;let _=0;const m=new ReadableStream({start(v){y();function y(){f.read().then(({done:A,value:R})=>{if(A)v.close();else{_+=R.byteLength;const S=new ProgressEvent("progress",{lengthComputable:p,loaded:_,total:d});for(let M=0,g=h.length;M<g;M++){const x=h[M];x.onProgress&&x.onProgress(S)}v.enqueue(R),y()}},A=>{v.error(A)})}}});return new Response(m)}else throw new t0(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return c.json();default:if(o==="")return c.text();{const f=/charset="?([^;"\s]*)"?/i.exec(o),u=f&&f[1]?f[1].toLowerCase():void 0,d=new TextDecoder(u);return c.arrayBuffer().then(p=>d.decode(p))}}}).then(c=>{tn.add(`file:${e}`,c);const h=Ki[e];delete Ki[e];for(let f=0,u=h.length;f<u;f++){const d=h[f];d.onLoad&&d.onLoad(c)}}).catch(c=>{const h=Ki[e];if(h===void 0)throw this.manager.itemError(e),c;delete Ki[e];for(let f=0,u=h.length;f<u;f++){const d=h[f];d.onError&&d.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const as=new WeakMap;class n0 extends Cs{constructor(e){super(e)}load(e,t,i,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=tn.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);else{let f=as.get(a);f===void 0&&(f=[],as.set(a,f)),f.push({onLoad:t,onError:s})}return a}const o=cr("img");function l(){h(),t&&t(this);const f=as.get(this)||[];for(let u=0;u<f.length;u++){const d=f[u];d.onLoad&&d.onLoad(this)}as.delete(this),r.manager.itemEnd(e)}function c(f){h(),s&&s(f),tn.remove(`image:${e}`);const u=as.get(this)||[];for(let d=0;d<u.length;d++){const p=u[d];p.onError&&p.onError(f)}as.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),tn.add(`image:${e}`,o),r.manager.itemStart(e),o.fetchPriority=this.priority,o.src=e,o}}class DS extends Cs{constructor(e){super(e)}load(e,t,i,s){const r=this,a=new bs,o=new i0(this.manager);return o.setPriority(this.priority),o.setCache(this.cache),o.setResponseType("arraybuffer"),o.setRequestHeader(this.requestHeader),o.setPath(this.path),o.setWithCredentials(r.withCredentials),o.load(e,function(l){let c;try{c=r.parse(l)}catch(h){s!==void 0?s(h):Fe(h);return}r._applyTexData(a,c),t&&t(a,c)},i,s),a}createDataTexture(e){const t=new bs;return this._applyTexData(t,this.parse(e)),t}_applyTexData(e,t){t.image!==void 0?e.image=t.image:t.data!==void 0&&(e.image.width=t.width,e.image.height=t.height,e.image.data=t.data),e.wrapS=t.wrapS!==void 0?t.wrapS:ii,e.wrapT=t.wrapT!==void 0?t.wrapT:ii,e.magFilter=t.magFilter!==void 0?t.magFilter:Nt,e.minFilter=t.minFilter!==void 0?t.minFilter:Nt,e.anisotropy=t.anisotropy!==void 0?t.anisotropy:1,t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.mipmaps!==void 0&&(e.mipmaps=t.mipmaps,e.minFilter=en),t.mipmapCount===1&&(e.minFilter=Nt),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),e.needsUpdate=!0}}class US extends Cs{constructor(e){super(e)}load(e,t,i,s){const r=new Ot,a=new n0(this.manager);return a.setPriority(this.priority),a.setCache(this.cache),a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},i,s),r}}class Oa extends yt{static registerNode(e){this.prototype._lightNode=e}constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new We(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class FS extends Oa{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(yt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new We(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const Io=new qe,Bh=new Y,zh=new Y;class sc{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Je(512,512),this.mapType=jt,this.map=null,this.mapPass=null,this.matrix=new qe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new hr,this._frameExtents=new Je(1,1),this._viewportCount=1,this._viewports=[new lt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera;Bh.setFromMatrixPosition(e.matrixWorld),t.position.copy(Bh),zh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(zh),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,i,s){Io.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),i.setFromProjectionMatrix(Io,e.coordinateSystem,e.reversedDepth);const r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;e.coordinateSystem===lr||e.reversedDepth?t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Io)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.mapType=e.mapType,this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.mapType=this.mapType,e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Kr=new Y,Zr=new Fi,Ni=new Y;class Pd extends yt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new qe,this.projectionMatrix=new qe,this.projectionMatrixInverse=new qe,this.coordinateSystem=Pi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Kr,Zr,Ni),Ni.x===1&&Ni.y===1&&Ni.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Kr,Zr,Ni.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(Kr,Zr,Ni),Ni.x===1&&Ni.y===1&&Ni.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Kr,Zr,Ni.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const gn=new Y,Hh=new Je,Vh=new Je;class fi extends Pd{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Ms*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(tr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ms*2*Math.atan(Math.tan(tr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){gn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(gn.x,gn.y).multiplyScalar(-e/gn.z),gn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(gn.x,gn.y).multiplyScalar(-e/gn.z)}getViewSize(e,t){return this.getViewBounds(e,Hh,Vh),t.subVectors(Vh,Hh)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(tr*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*i/c,s*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class s0 extends sc{constructor(){super(new fi(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,i=Ms*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(i!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=i,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){const e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}}class OS extends Oa{constructor(e,t,i=0,s=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(yt.DEFAULT_UP),this.updateMatrix(),this.target=new yt,this.distance=i,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new s0}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}}class r0 extends sc{constructor(){super(new fi(90,1,.5,500)),this.isPointLightShadow=!0}}class kS extends Oa{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new r0}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class rc extends Pd{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class a0 extends sc{constructor(){super(new rc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class BS extends Oa{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(yt.DEFAULT_UP),this.updateMatrix(),this.target=new yt,this.shadow=new a0}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class zS{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}const Lo=new WeakMap;class HS extends Cs{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Pe("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Pe("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,i,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=tn.get(`image-bitmap:${e}`);if(a!==void 0){if(r.manager.itemStart(e),a.then){a.then(c=>{Lo.has(a)===!0?(s&&s(Lo.get(a)),r.manager.itemError(e),r.manager.itemEnd(e)):(t&&t(c),r.manager.itemEnd(e))});return}setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);return}const o={};o.credentials=this.withCredentials||this.crossOrigin!=="anonymous"?"include":"same-origin",o.headers=this.requestHeader,o.priority=this.priority,o.cache=this.cache,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign({},r.options,{colorSpaceConversion:"none"}))}).then(function(c){return tn.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){s&&s(c),Lo.set(l,c),tn.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});tn.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const os=-90,ls=1;class Fl extends yt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new fi(os,ls,e,t);s.layers=this.layers,this.add(s);const r=new fi(os,ls,e,t);r.layers=this.layers,this.add(r);const a=new fi(os,ls,e,t);a.layers=this.layers,this.add(a);const o=new fi(os,ls,e,t);o.layers=this.layers,this.add(o);const l=new fi(os,ls,e,t);l.layers=this.layers,this.add(l);const c=new fi(os,ls,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===Pi)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===lr)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,f=e.getRenderTarget(),u=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;const _=i.texture.mipmapsAutoUpdate;i.texture.mipmapsAutoUpdate=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,1,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,2,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,3,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,4,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),i.texture.mipmapsAutoUpdate=_,e.setRenderTarget(i,5,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(f,u,d),e.xr.enabled=p,i.texture.needsPMREMUpdate=!0}}class o0 extends fi{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}}class l0{constructor(e,t,i){this.binding=e,this.valueSize=i;let s,r,a;switch(t){case"quaternion":s=this._slerp,r=this._slerpAdditive,a=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(i*6),this._workIndex=5;break;case"string":case"bool":s=this._select,r=this._select,a=this._setAdditiveIdentityOther,this.buffer=new Array(i*5);break;default:s=this._lerp,r=this._lerpAdditive,a=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(i*5)}this._mixBufferRegion=s,this._mixBufferRegionAdditive=r,this._setIdentity=a,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){const i=this.buffer,s=this.valueSize,r=e*s+s;let a=this.cumulativeWeight;if(a===0){for(let o=0;o!==s;++o)i[r+o]=i[o];a=t}else{a+=t;const o=t/a;this._mixBufferRegion(i,r,0,o,s)}this.cumulativeWeight=a}accumulateAdditive(e){const t=this.buffer,i=this.valueSize,s=i*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,s,0,e,i),this.cumulativeWeightAdditive+=e}apply(e){const t=this.valueSize,i=this.buffer,s=e*t+t,r=this.cumulativeWeight,a=this.cumulativeWeightAdditive,o=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,r<1){const l=t*this._origIndex;this._mixBufferRegion(i,s,l,1-r,t)}a>0&&this._mixBufferRegionAdditive(i,s,this._addIndex*t,1,t);for(let l=t,c=t+t;l!==c;++l)if(i[l]!==i[l+t]){o.setValue(i,s);break}}saveOriginalState(){const e=this.binding,t=this.buffer,i=this.valueSize,s=i*this._origIndex;e.getValue(t,s);for(let r=i,a=s;r!==a;++r)t[r]=t[s+r%i];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){const e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let i=e;i<t;i++)this.buffer[i]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let i=0;i<this.valueSize;i++)this.buffer[t+i]=this.buffer[e+i]}_select(e,t,i,s,r){if(s>=.5)for(let a=0;a!==r;++a)e[t+a]=e[i+a]}_slerp(e,t,i,s){Fi.slerpFlat(e,t,e,t,e,i,s)}_slerpAdditive(e,t,i,s,r){const a=this._workIndex*r;Fi.multiplyQuaternionsFlat(e,a,e,t,e,i),Fi.slerpFlat(e,t,e,t,e,a,s)}_lerp(e,t,i,s,r){const a=1-s;for(let o=0;o!==r;++o){const l=t+o;e[l]=e[l]*a+e[i+o]*s}}_lerpAdditive(e,t,i,s,r){for(let a=0;a!==r;++a){const o=t+a;e[o]=e[o]+e[i+a]*s}}}const ac="\\[\\]\\.:\\/",c0=new RegExp("["+ac+"]","g"),oc="[^"+ac+"]",h0="[^"+ac.replace("\\.","")+"]",u0=/((?:WC+[\/:])*)/.source.replace("WC",oc),d0=/(WCOD+)?/.source.replace("WCOD",h0),f0=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",oc),p0=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",oc),m0=new RegExp("^"+u0+d0+f0+p0+"$"),g0=["material","materials","bones","map"];class v0{constructor(e,t,i){const s=i||ot.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();const i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(e,t)}setValue(e,t){const i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}}class ot{constructor(e,t,i){this.path=t,this.parsedPath=i||ot.parseTrackName(t),this.node=ot.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new ot.Composite(e,t,i):new ot(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(c0,"")}static parseTrackName(e){const t=m0.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);const i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){const r=i.nodeName.substring(s+1);g0.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){const i=function(r){for(let a=0;a<r.length;a++){const o=r[a];if(o.name===t||o.uuid===t)return o;const l=i(o.children);if(l)return l}return null},s=i(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)e[t++]=i[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,i=t.objectName,s=t.propertyName;let r=t.propertyIndex;if(e||(e=ot.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Pe("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=t.objectIndex;switch(i){case"materials":if(!e.material){Fe("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Fe("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Fe("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Fe("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Fe("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){Fe("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(c!==void 0){if(e[c]===void 0){Fe("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const a=e[s];if(a===void 0){const c=t.nodeName;Fe("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){Fe("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Fe("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}ot.Composite=v0;ot.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ot.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ot.prototype.GetterByBindingType=[ot.prototype._getValue_direct,ot.prototype._getValue_array,ot.prototype._getValue_arrayElement,ot.prototype._getValue_toArray];ot.prototype.SetterByBindingTypeAndVersioning=[[ot.prototype._setValue_direct,ot.prototype._setValue_direct_setNeedsUpdate,ot.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ot.prototype._setValue_array,ot.prototype._setValue_array_setNeedsUpdate,ot.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ot.prototype._setValue_arrayElement,ot.prototype._setValue_arrayElement_setNeedsUpdate,ot.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ot.prototype._setValue_fromArray,ot.prototype._setValue_fromArray_setNeedsUpdate,ot.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class _0{constructor(e,t,i=null,s=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=i,this.blendMode=s;const r=t.tracks,a=r.length,o=new Array(a),l={endingStart:ms,endingEnd:ms};for(let c=0;c!==a;++c){const h=r[c].createInterpolant(null);o[c]=h,h.settings=l}this._interpolantSettings=l,this._interpolants=o,this._propertyBindings=new Array(a),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._restoreTimeScale=null,this._weightInterpolant=null,this.loop=Am,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,i=!1){if(e.fadeOut(t),this.fadeIn(t),i===!0){const s=this._clip.duration,r=e._clip.duration,a=r/s,o=s/r;e._restoreTimeScale=e.timeScale,this._restoreTimeScale=this.timeScale,e.warp(1,a,t),this.warp(o,1,t)}return this}crossFadeTo(e,t,i=!1){return e.crossFadeFrom(this,t,i)}stopFading(){const e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,i){const s=this._mixer,r=s.time,a=this.timeScale;let o=this._timeScaleInterpolant;o===null&&(o=s._lendControlInterpolant(),this._timeScaleInterpolant=o);const l=o.parameterPositions,c=o.sampleValues;return l[0]=r,l[1]=r+i,c[0]=e/a,c[1]=t/a,this}stopWarping(){const e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this._restoreTimeScale=null,this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,i,s){if(!this.enabled){this._updateWeight(e);return}const r=this._startTime;if(r!==null){const l=(e-r)*i;l<0||i===0?t=0:(this._startTime=null,t=i*l)}t*=this._updateTimeScale(e);const a=this._updateTime(t),o=this._updateWeight(e);if(o>0){const l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case Rm:for(let h=0,f=l.length;h!==f;++h)l[h].evaluate(a),c[h].accumulateAdditive(o);break;case Zl:default:for(let h=0,f=l.length;h!==f;++h)l[h].evaluate(a),c[h].accumulate(s,o)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;const i=this._weightInterpolant;if(i!==null){const s=i.evaluate(e)[0];t*=s,e>i.parameterPositions[1]&&(this.stopFading(),s===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;const i=this._timeScaleInterpolant;if(i!==null){const s=i.evaluate(e)[0];t*=s,e>i.parameterPositions[1]&&(t===0?this.paused=!0:(this._restoreTimeScale!==null&&(t=this._restoreTimeScale),this.timeScale=t),this.stopWarping())}}return this._effectiveTimeScale=t,t}_updateTime(e){const t=this._clip.duration,i=this.loop;let s=this.time+e,r=this._loopCount;const a=i===Cm;if(e===0)return r===-1?s:a&&(r&1)===1?t-s:s;if(i===Tm){r===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(s>=t)s=t;else if(s<0)s=0;else{this.time=s;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=s,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(r===-1&&(e>=0?(r=0,this._setEndings(!0,this.repetitions===0,a)):this._setEndings(this.repetitions===0,!0,a)),s>=t||s<0){const o=Math.floor(s/t);s-=t*o,r+=Math.abs(o);const l=this.repetitions-r;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,s=e>0?t:0,this.time=s,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(l===1){const c=e<0;this._setEndings(c,!c,a)}else this._setEndings(!1,!1,a);this._loopCount=r,this.time=s,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:o})}}else this._loopCount=r,this.time=s;if(a&&(r&1)===1)return t-s}return s}_setEndings(e,t,i){const s=this._interpolantSettings;i?(s.endingStart=gs,s.endingEnd=gs):(e?s.endingStart=this.zeroSlopeAtStart?gs:ms:s.endingStart=Ma,t?s.endingEnd=this.zeroSlopeAtEnd?gs:ms:s.endingEnd=Ma)}_scheduleFading(e,t,i){const s=this._mixer,r=s.time;let a=this._weightInterpolant;a===null&&(a=s._lendControlInterpolant(),this._weightInterpolant=a);const o=a.parameterPositions,l=a.sampleValues;return o[0]=r,l[0]=t,o[1]=r+e,l[1]=i,this}}const x0=new Float32Array(1);class VS extends An{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}_bindAction(e,t){const i=e._localRoot||this._root,s=e._clip.tracks,r=s.length,a=e._propertyBindings,o=e._interpolants,l=i.uuid,c=this._bindingsByRootAndName;let h=c[l];h===void 0&&(h={},c[l]=h);for(let f=0;f!==r;++f){const u=s[f],d=u.name;let p=h[d];if(p!==void 0)++p.referenceCount,a[f]=p;else{if(p=a[f],p!==void 0){p._cacheIndex===null&&(++p.referenceCount,this._addInactiveBinding(p,l,d));continue}const _=t&&t._propertyBindings[f].binding.parsedPath;p=new l0(ot.create(i,d,_),u.ValueTypeName,u.getValueSize()),++p.referenceCount,this._addInactiveBinding(p,l,d),a[f]=p}o[f].resultBuffer=p.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){const i=(e._localRoot||this._root).uuid,s=e._clip.uuid,r=this._actionsByClip[s];this._bindAction(e,r&&r.knownActions[0]),this._addInactiveAction(e,s,i)}const t=e._propertyBindings;for(let i=0,s=t.length;i!==s;++i){const r=t[i];r.useCount++===0&&(this._lendBinding(r),r.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){const t=e._propertyBindings;for(let i=0,s=t.length;i!==s;++i){const r=t[i];--r.useCount===0&&(r.restoreOriginalState(),this._takeBackBinding(r))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){const t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,i){const s=this._actions,r=this._actionsByClip;let a=r[t];if(a===void 0)a={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,r[t]=a;else{const o=a.knownActions;e._byClipCacheIndex=o.length,o.push(e)}e._cacheIndex=s.length,s.push(e),a.actionByRoot[i]=e}_removeInactiveAction(e){const t=this._actions,i=t[t.length-1],s=e._cacheIndex;i._cacheIndex=s,t[s]=i,t.pop(),e._cacheIndex=null;const r=e._clip.uuid,a=this._actionsByClip,o=a[r],l=o.knownActions,c=l[l.length-1],h=e._byClipCacheIndex;c._byClipCacheIndex=h,l[h]=c,l.pop(),e._byClipCacheIndex=null;const f=o.actionByRoot,u=(e._localRoot||this._root).uuid;delete f[u],l.length===0&&delete a[r],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){const t=e._propertyBindings;for(let i=0,s=t.length;i!==s;++i){const r=t[i];--r.referenceCount===0&&this._removeInactiveBinding(r)}}_lendAction(e){const t=this._actions,i=e._cacheIndex,s=this._nActiveActions++,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=i,t[i]=r}_takeBackAction(e){const t=this._actions,i=e._cacheIndex,s=--this._nActiveActions,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=i,t[i]=r}_addInactiveBinding(e,t,i){const s=this._bindingsByRootAndName,r=this._bindings;let a=s[t];a===void 0&&(a={},s[t]=a),a[i]=e,e._cacheIndex=r.length,r.push(e)}_removeInactiveBinding(e){const t=this._bindings,i=e.binding,s=i.rootNode.uuid,r=i.path,a=this._bindingsByRootAndName,o=a[s],l=t[t.length-1],c=e._cacheIndex;l._cacheIndex=c,t[c]=l,t.pop(),delete o[r],Object.keys(o).length===0&&delete a[s]}_lendBinding(e){const t=this._bindings,i=e._cacheIndex,s=this._nActiveBindings++,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=i,t[i]=r}_takeBackBinding(e){const t=this._bindings,i=e._cacheIndex,s=--this._nActiveBindings,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=i,t[i]=r}_lendControlInterpolant(){const e=this._controlInterpolants,t=this._nActiveControlInterpolants++;let i=e[t];return i===void 0&&(i=new Td(new Float32Array(2),new Float32Array(2),1,x0),i.__cacheIndex=t,e[t]=i),i}_takeBackControlInterpolant(e){const t=this._controlInterpolants,i=e.__cacheIndex,s=--this._nActiveControlInterpolants,r=t[s];e.__cacheIndex=s,t[s]=e,r.__cacheIndex=i,t[i]=r}clipAction(e,t,i){const s=t||this._root,r=s.uuid;let a=typeof e=="string"?Oh.findByName(s,e):e;const o=a!==null?a.uuid:e,l=this._actionsByClip[o];let c=null;if(i===void 0&&(a!==null?i=a.blendMode:i=Zl),l!==void 0){const f=l.actionByRoot[r];if(f!==void 0&&f.blendMode===i)return f;c=l.knownActions[0],a===null&&(a=c._clip)}if(a===null)return null;const h=new _0(this,a,t,i);return this._bindAction(h,c),this._addInactiveAction(h,o,r),h}existingAction(e,t){const i=t||this._root,s=i.uuid,r=typeof e=="string"?Oh.findByName(i,e):e,a=r?r.uuid:e,o=this._actionsByClip[a];return o!==void 0&&o.actionByRoot[s]||null}stopAllAction(){const e=this._actions,t=this._nActiveActions;for(let i=t-1;i>=0;--i)e[i].stop();return this}update(e){e*=this.timeScale;const t=this._actions,i=this._nActiveActions,s=this.time+=e,r=Math.sign(e),a=this._accuIndex^=1;for(let c=0;c!==i;++c)t[c]._update(s,e,r,a);const o=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)o[c].apply(a);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){const t=this._actions,i=e.uuid,s=this._actionsByClip,r=s[i];if(r!==void 0){const a=r.knownActions;for(let o=0,l=a.length;o!==l;++o){const c=a[o];this._deactivateAction(c);const h=c._cacheIndex,f=t[t.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,f._cacheIndex=h,t[h]=f,t.pop(),this._removeInactiveBindingsForAction(c)}delete s[i]}}uncacheRoot(e){const t=e.uuid,i=this._actionsByClip;for(const a in i){const o=i[a].actionByRoot,l=o[t];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}const s=this._bindingsByRootAndName,r=s[t];if(r!==void 0)for(const a in r){const o=r[a];o.restoreOriginalState(),this._removeInactiveBinding(o)}}uncacheAction(e,t){const i=this.existingAction(e,t);i!==null&&(this._deactivateAction(i),this._removeInactiveAction(i))}}function Gh(n,e,t,i){const s=y0(i);switch(t){case ad:return n*e;case Na:return n*e/s.components*s.byteLength;case ql:return n*e/s.components*s.byteLength;case Hn:return n*e*2/s.components*s.byteLength;case Yl:return n*e*2/s.components*s.byteLength;case od:return n*e*3/s.components*s.byteLength;case gi:return n*e*4/s.components*s.byteLength;case Kl:return n*e*4/s.components*s.byteLength;case aa:case oa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case la:case ca:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case nl:case rl:return Math.max(n,16)*Math.max(e,8)/4;case il:case sl:return Math.max(n,8)*Math.max(e,8)/2;case al:case ol:case cl:case hl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case ll:case xa:case ul:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case dl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case fl:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case pl:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case ml:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case gl:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case vl:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case _l:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case xl:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case yl:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Sl:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Ml:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case bl:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case wl:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case El:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Tl:case Al:case Cl:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Rl:case Pl:return Math.ceil(n/4)*Math.ceil(e/4)*8;case ya:case Il:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function y0(n){switch(n){case jt:case id:return{byteLength:1,components:1};case ar:case nd:case Bi:return{byteLength:2,components:1};case Xl:case $l:return{byteLength:2,components:4};case ki:case Wl:case mi:return{byteLength:4,components:1};case sd:case rd:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Gl}}));typeof window<"u"&&(window.__THREE__?Pe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Gl);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Id(){let n=null,e=!1,t=null,i=null;function s(r,a){i=n.requestAnimationFrame(s),t(r,a)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function S0(n){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,f=c.byteLength,u=n.createBuffer();n.bindBuffer(l,u),n.bufferData(l,c,h),o.onUploadCallback();let d;if(c instanceof Float32Array)d=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=n.HALF_FLOAT:d=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=n.SHORT;else if(c instanceof Uint32Array)d=n.UNSIGNED_INT;else if(c instanceof Int32Array)d=n.INT;else if(c instanceof Int8Array)d=n.BYTE;else if(c instanceof Uint8Array)d=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function i(o,l,c){const h=l.array,f=l.updateRanges;if(n.bindBuffer(c,o),f.length===0)n.bufferSubData(c,0,h);else{f.sort((d,p)=>d.start-p.start);let u=0;for(let d=1;d<f.length;d++){const p=f[u],_=f[d];_.start<=p.start+p.count+1?p.count=Math.max(p.count,_.start+_.count-p.start):(++u,f[u]=_)}f.length=u+1;for(let d=0,p=f.length;d<p;d++){const _=f[d];n.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var M0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,b0=`#ifdef USE_ALPHAHASH
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
#endif`,w0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,E0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,T0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,A0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,C0=`#ifdef USE_AOMAP
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
#endif`,R0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,P0=`#ifdef USE_BATCHING
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
#endif`,I0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,L0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,N0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,D0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,U0=`#ifdef USE_IRIDESCENCE
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
#endif`,F0=`#ifdef USE_BUMPMAP
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
#endif`,O0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,k0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,B0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,z0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,H0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,V0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,G0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,W0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,X0=`#define PI 3.141592653589793
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
} // validated`,$0=`vec3 transformedNormal = objectNormal;
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
#endif`,q0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Y0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,K0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Z0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,j0="gl_FragColor = linearToOutputTexel( gl_FragColor );",J0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Q0=`#ifdef USE_ENVMAP
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
#endif`,ev=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,tv=`#ifdef USE_ENVMAP
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
#endif`,iv=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,nv=`#ifdef USE_ENVMAP
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
#endif`,sv=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,rv=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,av=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ov=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,lv=`#ifdef USE_GRADIENTMAP
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
}`,cv=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,hv=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,uv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,dv=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,fv=`#ifdef USE_ENVMAP
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
#endif`,pv=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,mv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,gv=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,vv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,_v=`PhysicalMaterial material;
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
#endif`,xv=`uniform sampler2D dfgLUT;
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
}`,yv=`
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
#endif`,Sv=`#if defined( RE_IndirectDiffuse )
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
#endif`,Mv=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,bv=`#if NUM_LIGHT_PROBE_GRIDS > 0
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
#endif`,wv=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Ev=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Tv=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Av=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Cv=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Rv=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Pv=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Iv=`#if defined( USE_POINTS_UV )
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
#endif`,Lv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Nv=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Dv=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Uv=`#if defined( USE_MORPHCOLORS )
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
#endif`,Fv=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ov=`#ifdef USE_MORPHTARGETS
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
#endif`,kv=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Bv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,zv=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Hv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Vv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Gv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Wv=`#ifdef USE_NORMALMAP
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
#endif`,Xv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,$v=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,qv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Yv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Kv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Zv=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,jv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Jv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Qv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,e_=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,t_=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,i_=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,n_=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,s_=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,r_=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,a_=`float getShadowMask() {
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
}`,o_=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,l_=`#ifdef USE_SKINNING
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
#endif`,c_=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,h_=`#ifdef USE_SKINNING
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
#endif`,u_=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,d_=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,f_=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,p_=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,m_=`#ifdef USE_TRANSMISSION
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
#endif`,g_=`#ifdef USE_TRANSMISSION
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
#endif`,v_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,__=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,x_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,y_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const S_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,M_=`uniform sampler2D t2D;
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
}`,b_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,w_=`uniform float backgroundBlurriness;
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
}`,E_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,T_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,A_=`#include <common>
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
}`,C_=`#if DEPTH_PACKING == 3200
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
}`,R_=`#define DISTANCE
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
}`,P_=`#define DISTANCE
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
}`,I_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,L_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,N_=`uniform float scale;
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
}`,D_=`uniform vec3 diffuse;
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
}`,U_=`#include <common>
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
}`,F_=`uniform vec3 diffuse;
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
}`,O_=`#define LAMBERT
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
}`,k_=`#define LAMBERT
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
}`,B_=`#define MATCAP
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
}`,z_=`#define MATCAP
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
}`,H_=`#define NORMAL
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
}`,V_=`#define NORMAL
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
}`,G_=`#define PHONG
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
}`,W_=`#define PHONG
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
}`,X_=`#define STANDARD
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
}`,$_=`#define STANDARD
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
}`,q_=`#define TOON
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
}`,Y_=`#define TOON
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
}`,K_=`uniform float size;
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
}`,Z_=`uniform vec3 diffuse;
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
}`,j_=`#include <common>
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
}`,J_=`uniform vec3 color;
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
}`,Q_=`uniform float rotation;
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
}`,ex=`uniform vec3 diffuse;
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
}`,Ge={alphahash_fragment:M0,alphahash_pars_fragment:b0,alphamap_fragment:w0,alphamap_pars_fragment:E0,alphatest_fragment:T0,alphatest_pars_fragment:A0,aomap_fragment:C0,aomap_pars_fragment:R0,batching_pars_vertex:P0,batching_vertex:I0,begin_vertex:L0,beginnormal_vertex:N0,bsdfs:D0,iridescence_fragment:U0,bumpmap_pars_fragment:F0,clipping_planes_fragment:O0,clipping_planes_pars_fragment:k0,clipping_planes_pars_vertex:B0,clipping_planes_vertex:z0,color_fragment:H0,color_pars_fragment:V0,color_pars_vertex:G0,color_vertex:W0,common:X0,defaultnormal_vertex:$0,displacementmap_pars_vertex:q0,displacementmap_vertex:Y0,emissivemap_fragment:K0,emissivemap_pars_fragment:Z0,colorspace_fragment:j0,colorspace_pars_fragment:J0,envmap_fragment:Q0,envmap_common_pars_fragment:ev,envmap_pars_fragment:tv,envmap_pars_vertex:iv,envmap_physical_pars_fragment:fv,envmap_vertex:nv,fog_vertex:sv,fog_pars_vertex:rv,fog_fragment:av,fog_pars_fragment:ov,gradientmap_pars_fragment:lv,lightmap_pars_fragment:cv,lights_lambert_fragment:hv,lights_lambert_pars_fragment:uv,lights_pars_begin:dv,lights_toon_fragment:pv,lights_toon_pars_fragment:mv,lights_phong_fragment:gv,lights_phong_pars_fragment:vv,lights_physical_fragment:_v,lights_physical_pars_fragment:xv,lights_fragment_begin:yv,lights_fragment_maps:Sv,lights_fragment_end:Mv,lightprobes_pars_fragment:bv,logdepthbuf_fragment:wv,logdepthbuf_pars_fragment:Ev,logdepthbuf_pars_vertex:Tv,logdepthbuf_vertex:Av,map_fragment:Cv,map_pars_fragment:Rv,map_particle_fragment:Pv,map_particle_pars_fragment:Iv,metalnessmap_fragment:Lv,metalnessmap_pars_fragment:Nv,morphinstance_vertex:Dv,morphcolor_vertex:Uv,morphnormal_vertex:Fv,morphtarget_pars_vertex:Ov,morphtarget_vertex:kv,normal_fragment_begin:Bv,normal_fragment_maps:zv,normal_pars_fragment:Hv,normal_pars_vertex:Vv,normal_vertex:Gv,normalmap_pars_fragment:Wv,clearcoat_normal_fragment_begin:Xv,clearcoat_normal_fragment_maps:$v,clearcoat_pars_fragment:qv,iridescence_pars_fragment:Yv,opaque_fragment:Kv,packing:Zv,premultiplied_alpha_fragment:jv,project_vertex:Jv,dithering_fragment:Qv,dithering_pars_fragment:e_,roughnessmap_fragment:t_,roughnessmap_pars_fragment:i_,shadowmap_pars_fragment:n_,shadowmap_pars_vertex:s_,shadowmap_vertex:r_,shadowmask_pars_fragment:a_,skinbase_vertex:o_,skinning_pars_vertex:l_,skinning_vertex:c_,skinnormal_vertex:h_,specularmap_fragment:u_,specularmap_pars_fragment:d_,tonemapping_fragment:f_,tonemapping_pars_fragment:p_,transmission_fragment:m_,transmission_pars_fragment:g_,uv_pars_fragment:v_,uv_pars_vertex:__,uv_vertex:x_,worldpos_vertex:y_,background_vert:S_,background_frag:M_,backgroundCube_vert:b_,backgroundCube_frag:w_,cube_vert:E_,cube_frag:T_,depth_vert:A_,depth_frag:C_,distance_vert:R_,distance_frag:P_,equirect_vert:I_,equirect_frag:L_,linedashed_vert:N_,linedashed_frag:D_,meshbasic_vert:U_,meshbasic_frag:F_,meshlambert_vert:O_,meshlambert_frag:k_,meshmatcap_vert:B_,meshmatcap_frag:z_,meshnormal_vert:H_,meshnormal_frag:V_,meshphong_vert:G_,meshphong_frag:W_,meshphysical_vert:X_,meshphysical_frag:$_,meshtoon_vert:q_,meshtoon_frag:Y_,points_vert:K_,points_frag:Z_,shadow_vert:j_,shadow_frag:J_,sprite_vert:Q_,sprite_frag:ex},Se={common:{diffuse:{value:new We(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ke},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ke}},envmap:{envMap:{value:null},envMapRotation:{value:new ke},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ke}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ke}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ke},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ke},normalScale:{value:new Je(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ke},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ke}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ke}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ke}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new We(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new We(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0},uvTransform:{value:new ke}},sprite:{diffuse:{value:new We(16777215)},opacity:{value:1},center:{value:new Je(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ke},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0}}},Ui={basic:{uniforms:qt([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.fog]),vertexShader:Ge.meshbasic_vert,fragmentShader:Ge.meshbasic_frag},lambert:{uniforms:qt([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,Se.lights,{emissive:{value:new We(0)},envMapIntensity:{value:1}}]),vertexShader:Ge.meshlambert_vert,fragmentShader:Ge.meshlambert_frag},phong:{uniforms:qt([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,Se.lights,{emissive:{value:new We(0)},specular:{value:new We(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ge.meshphong_vert,fragmentShader:Ge.meshphong_frag},standard:{uniforms:qt([Se.common,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.roughnessmap,Se.metalnessmap,Se.fog,Se.lights,{emissive:{value:new We(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag},toon:{uniforms:qt([Se.common,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.gradientmap,Se.fog,Se.lights,{emissive:{value:new We(0)}}]),vertexShader:Ge.meshtoon_vert,fragmentShader:Ge.meshtoon_frag},matcap:{uniforms:qt([Se.common,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,{matcap:{value:null}}]),vertexShader:Ge.meshmatcap_vert,fragmentShader:Ge.meshmatcap_frag},points:{uniforms:qt([Se.points,Se.fog]),vertexShader:Ge.points_vert,fragmentShader:Ge.points_frag},dashed:{uniforms:qt([Se.common,Se.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ge.linedashed_vert,fragmentShader:Ge.linedashed_frag},depth:{uniforms:qt([Se.common,Se.displacementmap]),vertexShader:Ge.depth_vert,fragmentShader:Ge.depth_frag},normal:{uniforms:qt([Se.common,Se.bumpmap,Se.normalmap,Se.displacementmap,{opacity:{value:1}}]),vertexShader:Ge.meshnormal_vert,fragmentShader:Ge.meshnormal_frag},sprite:{uniforms:qt([Se.sprite,Se.fog]),vertexShader:Ge.sprite_vert,fragmentShader:Ge.sprite_frag},background:{uniforms:{uvTransform:{value:new ke},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ge.background_vert,fragmentShader:Ge.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ke}},vertexShader:Ge.backgroundCube_vert,fragmentShader:Ge.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ge.cube_vert,fragmentShader:Ge.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ge.equirect_vert,fragmentShader:Ge.equirect_frag},distance:{uniforms:qt([Se.common,Se.displacementmap,{referencePosition:{value:new Y},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ge.distance_vert,fragmentShader:Ge.distance_frag},shadow:{uniforms:qt([Se.lights,Se.fog,{color:{value:new We(0)},opacity:{value:1}}]),vertexShader:Ge.shadow_vert,fragmentShader:Ge.shadow_frag}};Ui.physical={uniforms:qt([Ui.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ke},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ke},clearcoatNormalScale:{value:new Je(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ke},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new ke},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ke},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ke},sheen:{value:0},sheenColor:{value:new We(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ke},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ke},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ke},transmissionSamplerSize:{value:new Je},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ke},attenuationDistance:{value:0},attenuationColor:{value:new We(0)},specularColor:{value:new We(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ke},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ke},anisotropyVector:{value:new Je},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ke}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag};const jr={r:0,b:0,g:0},tx=new qe,Ld=new ke;Ld.set(-1,0,0,0,1,0,0,0,1);function ix(n,e,t,i,s,r){const a=new We(0);let o=s===!0?0:1,l,c,h=null,f=0,u=null;function d(y){let A=y.isScene===!0?y.background:null;if(A&&A.isTexture){const R=y.backgroundBlurriness>0;A=e.get(A,R)}return A}function p(y){let A=!1;const R=d(y);R===null?m(a,o):R&&R.isColor&&(m(R,1),A=!0);const S=n.xr.getEnvironmentBlendMode();S==="additive"?t.buffers.color.setClear(0,0,0,1,r):S==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(n.autoClear||A)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function _(y,A){const R=d(A);R&&R.isCubeTexture?(c===void 0&&(c=new vi(new dr(1,1,1),new Vn({name:"BackgroundCubeMaterial",uniforms:Es(Ui.backgroundCube.uniforms),vertexShader:Ui.backgroundCube.vertexShader,fragmentShader:Ui.backgroundCube.fragmentShader,side:Jt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(S,M,g){this.matrixWorld.copyPosition(g.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=R,c.material.uniforms.backgroundBlurriness.value=A.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(tx.makeRotationFromEuler(A.backgroundRotation)).transpose(),R.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Ld),c.material.toneMapped=je.getTransfer(R.colorSpace)!==at,(h!==R||f!==R.version||u!==n.toneMapping)&&(c.material.needsUpdate=!0,h=R,f=R.version,u=n.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null)):R&&R.isTexture&&(l===void 0&&(l=new vi(new Fa(2,2),new Vn({name:"BackgroundMaterial",uniforms:Es(Ui.background.uniforms),vertexShader:Ui.background.vertexShader,fragmentShader:Ui.background.fragmentShader,side:zn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=R,l.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,l.material.toneMapped=je.getTransfer(R.colorSpace)!==at,R.matrixAutoUpdate===!0&&R.updateMatrix(),l.material.uniforms.uvTransform.value.copy(R.matrix),(h!==R||f!==R.version||u!==n.toneMapping)&&(l.material.needsUpdate=!0,h=R,f=R.version,u=n.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function m(y,A){y.getRGB(jr,Ed(n)),t.buffers.color.setClear(jr.r,jr.g,jr.b,A,r)}function v(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(y,A=1){a.set(y),o=A,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(y){o=y,m(a,o)},render:p,addToRenderList:_,dispose:v}}function nx(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=u(null);let r=s,a=!1;function o(I,U,D,w,O){let B=!1;const z=f(I,w,D,U);r!==z&&(r=z,c(r.object)),B=d(I,w,D,O),B&&p(I,w,D,O),O!==null&&e.update(O,n.ELEMENT_ARRAY_BUFFER),(B||a)&&(a=!1,R(I,U,D,w),O!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(O).buffer))}function l(){return n.createVertexArray()}function c(I){return n.bindVertexArray(I)}function h(I){return n.deleteVertexArray(I)}function f(I,U,D,w){const O=w.wireframe===!0;let B=i[U.id];B===void 0&&(B={},i[U.id]=B);const z=I.isInstancedMesh===!0?I.id:0;let L=B[z];L===void 0&&(L={},B[z]=L);let C=L[D.id];C===void 0&&(C={},L[D.id]=C);let H=C[O];return H===void 0&&(H=u(l()),C[O]=H),H}function u(I){const U=[],D=[],w=[];for(let O=0;O<t;O++)U[O]=0,D[O]=0,w[O]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:D,attributeDivisors:w,object:I,attributes:{},index:null}}function d(I,U,D,w){const O=r.attributes,B=U.attributes;let z=0;const L=D.getAttributes();for(const C in L)if(L[C].location>=0){const W=O[C];let K=B[C];if(K===void 0&&(C==="instanceMatrix"&&I.instanceMatrix&&(K=I.instanceMatrix),C==="instanceColor"&&I.instanceColor&&(K=I.instanceColor)),W===void 0||W.attribute!==K||K&&W.data!==K.data)return!0;z++}return r.attributesNum!==z||r.index!==w}function p(I,U,D,w){const O={},B=U.attributes;let z=0;const L=D.getAttributes();for(const C in L)if(L[C].location>=0){let W=B[C];W===void 0&&(C==="instanceMatrix"&&I.instanceMatrix&&(W=I.instanceMatrix),C==="instanceColor"&&I.instanceColor&&(W=I.instanceColor));const K={};K.attribute=W,W&&W.data&&(K.data=W.data),O[C]=K,z++}r.attributes=O,r.attributesNum=z,r.index=w}function _(){const I=r.newAttributes;for(let U=0,D=I.length;U<D;U++)I[U]=0}function m(I){v(I,0)}function v(I,U){const D=r.newAttributes,w=r.enabledAttributes,O=r.attributeDivisors;D[I]=1,w[I]===0&&(n.enableVertexAttribArray(I),w[I]=1),O[I]!==U&&(n.vertexAttribDivisor(I,U),O[I]=U)}function y(){const I=r.newAttributes,U=r.enabledAttributes;for(let D=0,w=U.length;D<w;D++)U[D]!==I[D]&&(n.disableVertexAttribArray(D),U[D]=0)}function A(I,U,D,w,O,B,z){z===!0?n.vertexAttribIPointer(I,U,D,O,B):n.vertexAttribPointer(I,U,D,w,O,B)}function R(I,U,D,w){_();const O=w.attributes,B=D.getAttributes(),z=U.defaultAttributeValues;for(const L in B){const C=B[L];if(C.location>=0){let H=O[L];if(H===void 0&&(L==="instanceMatrix"&&I.instanceMatrix&&(H=I.instanceMatrix),L==="instanceColor"&&I.instanceColor&&(H=I.instanceColor)),H!==void 0){const W=H.normalized,K=H.itemSize,Q=e.get(H);if(Q===void 0)continue;const G=Q.buffer,j=Q.type,re=Q.bytesPerElement,le=j===n.INT||j===n.UNSIGNED_INT||H.gpuType===Wl;if(H.isInterleavedBufferAttribute){const ae=H.data,Ie=ae.isInterleavedBuffer===!0?ae.stride:ae.itemSize,it=H.offset;if(ae.isInstancedInterleavedBuffer||ae.isInstancedBufferAttribute){for(let Ee=0;Ee<C.locationSize;Ee++)v(C.location+Ee,ae.meshPerAttribute);I.isInstancedMesh!==!0&&w._maxInstanceCount===void 0&&(w._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let Ee=0;Ee<C.locationSize;Ee++)m(C.location+Ee);n.bindBuffer(n.ARRAY_BUFFER,G);for(let Ee=0;Ee<C.locationSize;Ee++)A(C.location+Ee,K/C.locationSize,j,W,Ie*re,(it+K/C.locationSize*Ee)*re,le)}else{if(H.isInstancedBufferAttribute){for(let ae=0;ae<C.locationSize;ae++)v(C.location+ae,H.meshPerAttribute);I.isInstancedMesh!==!0&&w._maxInstanceCount===void 0&&(w._maxInstanceCount=H.meshPerAttribute*H.count)}else for(let ae=0;ae<C.locationSize;ae++)m(C.location+ae);n.bindBuffer(n.ARRAY_BUFFER,G);for(let ae=0;ae<C.locationSize;ae++)A(C.location+ae,K/C.locationSize,j,W,K*re,K/C.locationSize*ae*re,le)}}else if(z!==void 0){const W=z[L];if(W!==void 0)switch(W.length){case 2:n.vertexAttrib2fv(C.location,W);break;case 3:n.vertexAttrib3fv(C.location,W);break;case 4:n.vertexAttrib4fv(C.location,W);break;default:n.vertexAttrib1fv(C.location,W)}}}}y()}function S(){P();for(const I in i){const U=i[I];for(const D in U){const w=U[D];for(const O in w){const B=w[O];for(const z in B)h(B[z].object),delete B[z];delete w[O]}}delete i[I]}}function M(I){if(i[I.id]===void 0)return;const U=i[I.id];for(const D in U){const w=U[D];for(const O in w){const B=w[O];for(const z in B)h(B[z].object),delete B[z];delete w[O]}}delete i[I.id]}function g(I){for(const U in i){const D=i[U];for(const w in D){const O=D[w];if(O[I.id]===void 0)continue;const B=O[I.id];for(const z in B)h(B[z].object),delete B[z];delete O[I.id]}}}function x(I){for(const U in i){const D=i[U],w=I.isInstancedMesh===!0?I.id:0,O=D[w];if(O!==void 0){for(const B in O){const z=O[B];for(const L in z)h(z[L].object),delete z[L];delete O[B]}delete D[w],Object.keys(D).length===0&&delete i[U]}}}function P(){T(),a=!0,r!==s&&(r=s,c(r.object))}function T(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:P,resetDefaultState:T,dispose:S,releaseStatesOfGeometry:M,releaseStatesOfObject:x,releaseStatesOfProgram:g,initAttributes:_,enableAttribute:m,disableUnusedAttributes:y}}function sx(n,e,t){let i;function s(l){i=l}function r(l,c){n.drawArrays(i,l,c),t.update(c,i,1)}function a(l,c,h){h!==0&&(n.drawArraysInstanced(i,l,c,h),t.update(c,i,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,h);let u=0;for(let d=0;d<h;d++)u+=c[d];t.update(u,i,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function rx(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const g=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(g.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(g){return!(g!==gi&&i.convert(g)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(g){const x=g===Bi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(g!==jt&&g!==mi&&!x&&i.convert(g)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE))}function l(g){if(g==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";g="mediump"}return g==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(Pe("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),u=t.logarithmicDepthBuffer===!0&&f===!1;t.reversedDepthBuffer===!0&&f===!1&&Pe("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),t.logarithmicDepthBuffer===!0&&f===!0&&Pe("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");const d=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),v=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),A=n.getParameter(n.MAX_VARYING_VECTORS),R=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),S=n.getParameter(n.MAX_SAMPLES),M=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:d,maxVertexTextures:p,maxTextureSize:_,maxCubemapSize:m,maxAttributes:v,maxVertexUniforms:y,maxVaryings:A,maxFragmentUniforms:R,maxSamples:S,samples:M}}function ax(n){const e=this;let t=null,i=0,s=!1,r=!1;const a=new xn,o=new ke,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,u){const d=f.length!==0||u||i!==0||s;return s=u,i=f.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,u){t=h(f,u,0)},this.setState=function(f,u,d){const p=f.clippingPlanes,_=f.clipIntersection,m=f.clipShadows,v=n.get(f);if(!s||p===null||p.length===0||r&&!m)r?h(null):c();else{const y=r?0:i,A=y*4;let R=v.clippingState||null;l.value=R,R=h(p,u,A,d);for(let S=0;S!==A;++S)R[S]=t[S];v.clippingState=R,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(f,u,d,p){const _=f!==null?f.length:0;let m=null;if(_!==0){if(m=l.value,p!==!0||m===null){const v=d+_*4,y=u.matrixWorldInverse;o.getNormalMatrix(y),(m===null||m.length<v)&&(m=new Float32Array(v));for(let A=0,R=d;A!==_;++A,R+=4)a.copy(f[A]).applyMatrix4(y,o),a.normal.toArray(m,R),m[R+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}class lc extends Oi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Md(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new dr(5,5,5),r=new Vn({name:"CubemapFromEquirect",uniforms:Es(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Jt,blending:vs});r.uniforms.tEquirect.value=t;const a=new vi(s,r),o=t.minFilter;return t.minFilter===en&&(t.minFilter=Nt),new Fl(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}}const Wh=256,ox=3,lx=20,Nd=256,Dd=16,cx=3,hx=new Y,ux=new We;class Ca{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new Fl(1,10,null),this._boxMesh=new vi(new dr(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,i=.1,s=100,r={}){const{size:a=256,position:o=hx}=r,l=this._renderer;this._setSize(a);const c=this._allocateTarget(),h=this._getSourceTarget(!0);t>0&&(h.texture.mipmapsAutoUpdate=!1);const f=l.autoClear,u=l.autoClearColor,d=l.autoClearDepth,p=l.autoClearStencil,_=e.background;l.autoClear=!0,l.autoClearColor=!0,l.autoClearDepth=!0,l.autoClearStencil=!0,_===null&&(e.background=l.getClearColor(ux));const m=new Fl(i,s,h);return m.position.copy(o),m.update(l,e),l.autoClear=f,l.autoClearColor=u,l.autoClearDepth=d,l.autoClearStencil=p,e.background=_,t>0&&(h.texture.mipmapsAutoUpdate=!0,this._blur(c,t)),this._applyPMREM(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=qh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=$h(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(Wh,fd(e))}_fromTexture(e,t){e.mapping===ys||e.mapping===rr?this._setSize(e.image.length===0?Wh:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);const i=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(i),i}_allocateTarget(){const e=this._cubeSize,t=Xh(e,!1,!1),i=Math.log2(e)-ox;for(let s=0;s<=i;s++)t.texture.mipmaps.push({width:e>>s,height:e>>s});return t.texture.name="PMREM",t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){const t=this._cubeSize,i=this._sourceTarget;return(i===null||i.width!==t||e&&i.depthBuffer===!1)&&(i!==null&&i.dispose(),this._sourceTarget=Xh(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,i){const s=this._boxMesh,r=this._cubeCamera;s.material=i,r.renderTarget=e,r.activeMipmapLevel=t;const a=e.width>>t;e.viewport.set(0,0,a,a),r.update(this._renderer,s),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===ys||e.mapping===rr?(this._cubemapMaterial===null&&(this._cubemapMaterial=qh()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=$h()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(e){this._ggxMaterial===null&&(this._ggxMaterial=dx(),this._integrationMaterial=fx());const t=this._cubeSize,i=e.texture.mipmaps.length-1,s=this._ggxMaterial.uniforms;s.envMap.value=this._sourceTarget.texture;const r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(t/Dd);for(let a=0;a<=i;a++){const o=Ca.lodToRoughness(a,i);if(a>i-cx)r.roughness.value=o,this._renderCube(e,a,this._integrationMaterial);else{const l=o>0?Math.log2(t)+.5*Math.log2(6/(Nd*Math.pow(o,4)))+.5:0;s.roughness.value=o,s.lodBias.value=l,this._renderCube(e,a,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=px());const i=this._blurMaterial,s=i.uniforms,r=this._sourceTarget;s.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,s.envMap.value=r.texture,this._renderCube(e,0,i),s.envMap.value=e.texture,this._renderCube(r,0,i)}}function Xh(n,e,t){return new lc(n,{minFilter:en,generateMipmaps:e,type:Bi,colorSpace:or,depthBuffer:t})}function pr(n,e,t){return new Vn({name:n,uniforms:e,vertexShader:Ge.cube_vert,fragmentShader:t,side:Jt,blending:vs,depthTest:!1,depthWrite:!1})}function dx(){return pr("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${Nd}u

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
	`)}function fx(){return pr("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:Dd}},`

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
	`)}function px(){return pr("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${lx}
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
	`)}function $h(){return pr("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

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
	`)}function qh(){return pr("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function mx(n){let e=new WeakMap,t=new WeakMap,i=null;function s(u,d=!1){return u==null?null:d?a(u):r(u)}function r(u){if(u&&u.isTexture){const d=u.mapping;if(d===io||d===no)if(e.has(u)){const p=e.get(u).texture;return o(p,u.mapping)}else{const p=u.image;if(p&&p.height>0){const _=new lc(p.height);return _.fromEquirectangularTexture(n,u),e.set(u,_),u.addEventListener("dispose",c),o(_.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture&&u.isPMREMTexture!==!0){const d=u.mapping,p=d===io||d===no,_=d===ys||d===rr;if(p||_){let m=t.get(u);const v=m!==void 0?m.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==v)return i===null&&(i=new Ca(n)),m=p?i.fromEquirectangular(u,m):i.fromCubemap(u,m),m.texture.pmremVersion=u.pmremVersion,t.set(u,m),m.texture;if(m!==void 0)return m.texture;{const y=u.image;return p&&y&&y.height>0||_&&y&&l(y)?(i===null&&(i=new Ca(n)),m=p?i.fromEquirectangular(u):i.fromCubemap(u),m.texture.pmremVersion=u.pmremVersion,t.set(u,m),u.addEventListener("dispose",h),m.texture):null}}}return u}function o(u,d){return d===io?u.mapping=ys:d===no&&(u.mapping=rr),u}function l(u){let d=0;const p=6;for(let _=0;_<p;_++)u[_]!==void 0&&d++;return d===p}function c(u){const d=u.target;d.removeEventListener("dispose",c);const p=e.get(d);p!==void 0&&(e.delete(d),p.dispose())}function h(u){const d=u.target;d.removeEventListener("dispose",h);const p=t.get(d);p!==void 0&&(t.delete(d),p.dispose())}function f(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:f}}function gx(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&_s("WebGLRenderer: "+i+" extension not supported."),s}}}function vx(n,e,t,i){const s={},r=new WeakMap,a=new FinalizationRegistry(p=>delete s[p]);function o(p){l(p.target)}function l(p){p.index!==null&&e.remove(p.index);for(const m in p.attributes)e.remove(p.attributes[m]);p.removeEventListener("dispose",o),delete s[p.id],a.unregister(p);const _=r.get(p);_&&(e.remove(_),r.delete(p)),i.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function c(p,_){return s[_.id]!==void 0||(_.addEventListener("dispose",o),s[_.id]=new WeakRef(_),a.register(_,_.id,_),t.memory.geometries++),_}function h(p){const _=p.attributes;for(const m in _)e.update(_[m],n.ARRAY_BUFFER)}function f(p){const _=p.index,m=p.attributes.position;let v=0;if(m===void 0)return;const y=_!==null?_.array.length:m.array.length/3-1,A=m.count>=65535?_d:vd,R=new A(Math.ceil(y/3)*6,1),S=R.array;if(_!==null){const g=_.array;v=_.version;for(let x=0,P=0;x<y;x+=3){const T=g[x+0],I=g[x+1],U=g[x+2];S[P++]=T,S[P++]=I,S[P++]=I,S[P++]=U,S[P++]=U,S[P++]=T}}else{v=m.version;for(let g=0,x=0;g<y;g+=3){const P=g+0,T=g+1,I=g+2;S[x++]=P,S[x++]=T,S[x++]=T,S[x++]=I,S[x++]=I,S[x++]=P}}R.version=v;const M=r.get(p);M&&e.remove(M),r.set(p,R)}function u(p){const _=r.get(p);if(_){const m=p.index;m!==null&&_.version<m.version&&f(p)}else f(p);return r.get(p)}function d(){for(const p in s){const _=s[p].deref();_!==void 0&&l(_)}}return{get:c,update:h,getWireframeAttribute:u,dispose:d}}function _x(n,e,t){let i;function s(f){i=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,u){n.drawElements(i,u,r,f*a),t.update(u,i,1)}function c(f,u,d){d!==0&&(n.drawElementsInstanced(i,u,r,f*a,d),t.update(u,i,d))}function h(f,u,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,r,f,0,d);let _=0;for(let m=0;m<d;m++)_+=u[m];t.update(_,i,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function xx(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:Fe("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function yx(n,e,t){const i=new WeakMap,s=new lt;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0;let u=i.get(o);if(u===void 0||u.count!==f){let P=function(){g.dispose(),i.delete(o),o.removeEventListener("dispose",P)};u!==void 0&&u.texture.dispose();const d=o.morphAttributes.position!==void 0,p=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],v=o.morphAttributes.normal||[],y=o.morphAttributes.color||[];let A=0;d===!0&&(A=1),p===!0&&(A=2),_===!0&&(A=3);let R=o.attributes.position.count*A,S=1;R>e.maxTextureSize&&(S=Math.ceil(R/e.maxTextureSize),R=e.maxTextureSize);const M=new Float32Array(R*S*4*f),g=new pd(M,R,S,f);g.type=mi,g.needsUpdate=!0;const x=A*4;for(let T=0;T<f;T++){const I=m[T],U=v[T],D=y[T],w=R*S*4*T;for(let O=0;O<I.count;O++){const B=O*x;d===!0&&(s.fromBufferAttribute(I,O),M[w+B+0]=s.x,M[w+B+1]=s.y,M[w+B+2]=s.z,M[w+B+3]=0),p===!0&&(s.fromBufferAttribute(U,O),M[w+B+4]=s.x,M[w+B+5]=s.y,M[w+B+6]=s.z,M[w+B+7]=0),_===!0&&(s.fromBufferAttribute(D,O),M[w+B+8]=s.x,M[w+B+9]=s.y,M[w+B+10]=s.z,M[w+B+11]=D.itemSize===4?s.w:1)}}u={count:f,texture:g,size:new Je(R,S)},i.set(o,u),o.addEventListener("dispose",P)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let d=0;for(let _=0;_<c.length;_++)d+=c[_];const p=o.morphTargetsRelative?1:1-d;l.getUniforms().setValue(n,"morphTargetBaseInfluence",p),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",u.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",u.size)}return{update:r}}function Sx(n,e,t,i,s){let r=new WeakMap;function a(c){const h=s.render.frame,f=c.geometry,u=e.get(c,f);if(r.get(u)!==h&&(e.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==h&&(d.update(),r.set(d,h))}return u}function o(){r=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),i.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}const Mx={[Yu]:"LINEAR_TONE_MAPPING",[Ku]:"REINHARD_TONE_MAPPING",[Zu]:"CINEON_TONE_MAPPING",[ju]:"ACES_FILMIC_TONE_MAPPING",[Qu]:"AGX_TONE_MAPPING",[ed]:"NEUTRAL_TONE_MAPPING",[Ju]:"CUSTOM_TONE_MAPPING"};function bx(n,e,t,i,s,r){const a=new Oi(e,t,{type:n,depthBuffer:s,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,l=null,c=null;const h=new Hi;h.setAttribute("position",new ni([-1,3,0,-1,-1,0,3,-1,0],3)),h.setAttribute("uv",new ni([0,2,0,0,2,0],2));const f=new Ul({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),u=new vi(h,f),d=new rc(-1,1,1,-1,0,1);let p=null,_=null,m=!1,v,y=null,A=[],R=!1;this.setSize=function(S,M){a.setSize(S,M),o!==null&&o.setSize(S,M),l!==null&&l.setSize(S,M);for(let g=0;g<A.length;g++){const x=A[g];x.setSize&&x.setSize(S,M)}},this.setEffects=function(S){A=S,R=A.length>0&&A[0].isRenderPass===!0;const M=a.width,g=a.height;A.length>0&&o===null&&(o=new Oi(M,g,{type:Bi,depthBuffer:!1,stencilBuffer:!1}),l=new Oi(M,g,{type:Bi,depthBuffer:!1,stencilBuffer:!1}));const x=s===!0&&A.some(P=>P.needsDepthTexture===!0);x!==(a.depthTexture!==null)&&(x===!0&&c===null&&(c=new ws(M,g),r===!0&&(c.format=bn,c.type=Ss)),a.dispose(),a.depthTexture=x?c:null,a.resolveDepthBuffer=x,a.storeMultisampledDepthBuffer=x);for(let P=0;P<A.length;P++){const T=A[P];T.setSize&&T.setSize(M,g),x&&T.needsDepthTexture===!0&&T.setDepthTexture&&T.setDepthTexture(c)}},this.begin=function(S,M){if(m||S.toneMapping===nn&&A.length===0)return!1;if(y=M,M!==null){const g=M.width,x=M.height;(a.width!==g||a.height!==x)&&this.setSize(g,x)}return R===!1&&S.setRenderTarget(a),v=S.toneMapping,S.toneMapping=nn,!0},this.hasRenderPass=function(){return R},this.end=function(S,M){S.toneMapping=v,m=!0;let g=a,x=o;for(let P=0;P<A.length;P++){const T=A[P];T.enabled!==!1&&(T.render(S,x,g,M),T.needsSwap!==!1&&(g=x,x=x===o?l:o))}if(p!==S.outputColorSpace||_!==S.toneMapping){p=S.outputColorSpace,_=S.toneMapping,f.defines={},je.getTransfer(p)===at&&(f.defines.SRGB_TRANSFER="");const P=Mx[_];P&&(f.defines[P]=""),f.needsUpdate=!0}f.uniforms.tDiffuse.value=g.texture,S.setRenderTarget(y),S.render(u,d),y=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),h.dispose(),f.dispose()}}const Ud=new Ot,Fd=new ws(1,1),Od=new bd(1),kd=new pd,Bd=new cg,zd=new Md,Yh=[],Kh=[],Zh=new Float32Array(16),jh=new Float32Array(9),Jh=new Float32Array(4);function Rs(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let r=Yh[s];if(r===void 0&&(r=new Float32Array(s),Yh[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function Tt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function At(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function ka(n,e){let t=Kh[e];t===void 0&&(t=new Int32Array(e),Kh[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function wx(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function Ex(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;n.uniform2fv(this.addr,e),At(t,e)}}function Tx(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Tt(t,e))return;n.uniform3fv(this.addr,e),At(t,e)}}function Ax(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;n.uniform4fv(this.addr,e),At(t,e)}}function Cx(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Tt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),At(t,e)}else{if(Tt(t,i))return;Jh.set(i),n.uniformMatrix2fv(this.addr,!1,Jh),At(t,i)}}function Rx(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Tt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),At(t,e)}else{if(Tt(t,i))return;jh.set(i),n.uniformMatrix3fv(this.addr,!1,jh),At(t,i)}}function Px(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Tt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),At(t,e)}else{if(Tt(t,i))return;Zh.set(i),n.uniformMatrix4fv(this.addr,!1,Zh),At(t,i)}}function Ix(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function Lx(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;n.uniform2iv(this.addr,e),At(t,e)}}function Nx(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Tt(t,e))return;n.uniform3iv(this.addr,e),At(t,e)}}function Dx(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;n.uniform4iv(this.addr,e),At(t,e)}}function Ux(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function Fx(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;n.uniform2uiv(this.addr,e),At(t,e)}}function Ox(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Tt(t,e))return;n.uniform3uiv(this.addr,e),At(t,e)}}function kx(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;n.uniform4uiv(this.addr,e),At(t,e)}}function Ba(n){return n.version===0&&(n.compareFunction=hd,n.needsUpdate=!0),n}function Bx(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?r=Ba(Fd):r=Ud,t.setTexture2D(e||r,s)}function zx(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||Bd,s)}function Hx(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_CUBE_SHADOW?r=Ba(Od):r=zd,t.setTextureCube(e||r,s)}function Vx(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||kd,s)}function Gx(n){switch(n){case 5126:return wx;case 35664:return Ex;case 35665:return Tx;case 35666:return Ax;case 35674:return Cx;case 35675:return Rx;case 35676:return Px;case 5124:case 35670:return Ix;case 35667:case 35671:return Lx;case 35668:case 35672:return Nx;case 35669:case 35673:return Dx;case 5125:return Ux;case 36294:return Fx;case 36295:return Ox;case 36296:return kx;case 35678:case 36198:case 36298:case 36306:case 35682:return Bx;case 35679:case 36299:case 36307:return zx;case 35680:case 36300:case 36308:case 36293:return Hx;case 36289:case 36303:case 36311:case 36292:return Vx}}function Wx(n,e){n.uniform1fv(this.addr,e)}function Xx(n,e){const t=Rs(e,this.size,2);n.uniform2fv(this.addr,t)}function $x(n,e){const t=Rs(e,this.size,3);n.uniform3fv(this.addr,t)}function qx(n,e){const t=Rs(e,this.size,4);n.uniform4fv(this.addr,t)}function Yx(n,e){const t=Rs(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function Kx(n,e){const t=Rs(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Zx(n,e){const t=Rs(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function jx(n,e){n.uniform1iv(this.addr,e)}function Jx(n,e){n.uniform2iv(this.addr,e)}function Qx(n,e){n.uniform3iv(this.addr,e)}function ey(n,e){n.uniform4iv(this.addr,e)}function ty(n,e){n.uniform1uiv(this.addr,e)}function iy(n,e){n.uniform2uiv(this.addr,e)}function ny(n,e){n.uniform3uiv(this.addr,e)}function sy(n,e){n.uniform4uiv(this.addr,e)}function ry(n,e,t){const i=this.cache,s=e.length,r=ka(t,s);Tt(i,r)||(n.uniform1iv(this.addr,r),At(i,r));let a;this.type===n.SAMPLER_2D_SHADOW?a=Ba(Fd):a=Ud;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function ay(n,e,t){const i=this.cache,s=e.length,r=ka(t,s);Tt(i,r)||(n.uniform1iv(this.addr,r),At(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Bd,r[a])}function oy(n,e,t){const i=this.cache,s=e.length,r=ka(t,s);Tt(i,r)||(n.uniform1iv(this.addr,r),At(i,r));let a;this.type===n.SAMPLER_CUBE_SHADOW?a=Ba(Od):a=zd;for(let o=0;o!==s;++o)t.setTextureCube(e[o]||a,r[o])}function ly(n,e,t){const i=this.cache,s=e.length,r=ka(t,s);Tt(i,r)||(n.uniform1iv(this.addr,r),At(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||kd,r[a])}function cy(n){switch(n){case 5126:return Wx;case 35664:return Xx;case 35665:return $x;case 35666:return qx;case 35674:return Yx;case 35675:return Kx;case 35676:return Zx;case 5124:case 35670:return jx;case 35667:case 35671:return Jx;case 35668:case 35672:return Qx;case 35669:case 35673:return ey;case 5125:return ty;case 36294:return iy;case 36295:return ny;case 36296:return sy;case 35678:case 36198:case 36298:case 36306:case 35682:return ry;case 35679:case 36299:case 36307:return ay;case 35680:case 36300:case 36308:case 36293:return oy;case 36289:case 36303:case 36311:case 36292:return ly}}class hy{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Gx(t.type)}}class uy{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=cy(t.type)}}class dy{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],i)}}}const No=/(\w+)(\])?(\[|\.)?/g;function Qh(n,e){n.seq.push(e),n.map[e.id]=e}function fy(n,e,t){const i=n.name,s=i.length;for(No.lastIndex=0;;){const r=No.exec(i),a=No.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Qh(t,c===void 0?new hy(o,n,e):new uy(o,n,e));break}else{let f=t.map[o];f===void 0&&(f=new dy(o),Qh(t,f)),t=f}}}class ha{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);fy(o,l,this)}const s=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&i.push(a)}return i}}function eu(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const py=37297;let my=0;function gy(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const tu=new ke;function vy(n){je._getMatrix(tu,je.workingColorSpace,n);const e=`mat3( ${tu.elements.map(t=>t.toFixed(4))} )`;switch(je.getTransfer(n)){case ba:return[e,"LinearTransferOETF"];case at:return[e,"sRGBTransferOETF"];default:return Pe("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function iu(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+gy(n.getShaderSource(e),o)}else return r}function _y(n,e){const t=vy(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( ${t[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}const xy={[Yu]:"Linear",[Ku]:"Reinhard",[Zu]:"Cineon",[ju]:"ACESFilmic",[Qu]:"AgX",[ed]:"Neutral",[Ju]:"Custom"};function yy(n,e){const t=xy[e];return t===void 0?(Pe("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Jr=new Y;function Sy(){je.getLuminanceCoefficients(Jr);const n=Jr.x.toFixed(4),e=Jr.y.toFixed(4),t=Jr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function My(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ks).join(`
`)}function by(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function wy(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(e,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function Ks(n){return n!==""}function nu(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,e.numLightProbeGrids)}function su(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Ey=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ol(n){return n.replace(Ey,Ty)}function Ty(n,e){const t=Ge[e];if(t===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">");return Ol(t)}const Ay=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ru(n){return n.replace(Ay,Cy)}function Cy(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function au(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}const Ry={[ra]:"SHADOWMAP_TYPE_PCF",[qs]:"SHADOWMAP_TYPE_VSM"};function Py(n){return Ry[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Iy={[rr]:"ENVMAP_MODE_REFRACTION"};function Ly(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":Iy[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Ny={[qu]:"ENVMAP_BLENDING_MULTIPLY",[Mm]:"ENVMAP_BLENDING_MIX",[bm]:"ENVMAP_BLENDING_ADD"};function Dy(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":Ny[n.combine]||"ENVMAP_BLENDING_NONE"}function Uy(n,e,t,i){const s=n.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Py(t),c=t.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",h=Ly(t),f=Dy(t),u=My(t),d=by(r),p=s.createProgram();let _,m,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(_=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d].filter(Ks).join(`
`),_.length>0&&(_+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d].filter(Ks).join(`
`),m.length>0&&(m+=`
`)):(_=[au(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+t.diffuseRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ks).join(`
`),m=[au(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+f:"",t.envMapPMREM?"#define ENVMAP_MAX_LOD "+t.envMapMaxLod+".0":"",t.envMapPMREM?"#define ENVMAP_SIZE "+t.envMapSize+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==nn?"#define TONE_MAPPING":"",t.toneMapping!==nn?Ge.tonemapping_pars_fragment:"",t.toneMapping!==nn?yy("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ge.colorspace_pars_fragment,_y("linearToOutputTexel",t.outputColorSpace),Sy(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ks).join(`
`)),a=Ol(a),a=nu(a,t),a=su(a,t),o=Ol(o),o=nu(o,t),o=su(o,t),a=ru(a),o=ru(o),t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,_=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+_,m=["#define varying in",t.glslVersion===wa?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===wa?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const y=v+_+a,A=v+m+o,R=eu(s,s.VERTEX_SHADER,y),S=eu(s,s.FRAGMENT_SHADER,A);s.attachShader(p,R),s.attachShader(p,S),t.index0AttributeName!==void 0?s.bindAttribLocation(p,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(p,0,"position"),s.linkProgram(p);function M(T){if(n.debug.checkShaderErrors){const I=s.getProgramInfoLog(p)||"",U=s.getShaderInfoLog(R)||"",D=s.getShaderInfoLog(S)||"",w=I.trim(),O=U.trim(),B=D.trim();let z=!0,L=!0;if(s.getProgramParameter(p,s.LINK_STATUS)===!1)if(z=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,p,R,S);else{const C=iu(s,R,"vertex"),H=iu(s,S,"fragment");Fe("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(p,s.VALIDATE_STATUS)+`

Material Name: `+T.name+`
Material Type: `+T.type+`

Program Info Log: `+w+`
`+C+`
`+H)}else w!==""?Pe("WebGLProgram: Program Info Log:",w):(O===""||B==="")&&(L=!1);L&&(T.diagnostics={runnable:z,programLog:w,vertexShader:{log:O,prefix:_},fragmentShader:{log:B,prefix:m}})}s.deleteShader(R),s.deleteShader(S),g=new ha(s,p),x=wy(s,p)}let g;this.getUniforms=function(){return g===void 0&&M(this),g};let x;this.getAttributes=function(){return x===void 0&&M(this),x};let P=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return P===!1&&(P=s.getProgramParameter(p,py)),P},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(p),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=my++,this.cacheKey=e,this.usedTimes=1,this.program=p,this.vertexShader=R,this.fragmentShader=S,this}let Fy=0;class Oy{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){const s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new ky(e),t.set(e,i)),i}}class ky{constructor(e){this.id=Fy++,this.code=e,this.usedTimes=0}}function By(n){return n===Hn||n===xa||n===ya}function zy(n,e,t,i,s,r){const a=new md,o=new Oy,l=new Set,c=[],h=new Map,f=i.logarithmicDepthBuffer,u={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function d(g){return l.add(g),g===0?"uv":`uv${g}`}function p(g,x,P,T,I,U){const D=T.fog,w=I.geometry,O=g.isMeshStandardMaterial||g.isMeshLambertMaterial||g.isMeshPhongMaterial?T.environment:null,B=g.isMeshStandardMaterial||g.isMeshLambertMaterial&&!g.envMap||g.isMeshPhongMaterial&&!g.envMap,z=e.get(g.envMap||O,B),L=u[g.type];let C=i.precision;g.precision!==null&&(C=i.getMaxPrecision(g.precision),C!==g.precision&&Pe("WebGLProgram.getParameters:",g.precision,"not supported, using",C,"instead."));const H=w.morphAttributes.position||w.morphAttributes.normal||w.morphAttributes.color,W=H!==void 0?H.length:0;let K=0;w.morphAttributes.position!==void 0&&(K=1),w.morphAttributes.normal!==void 0&&(K=2),w.morphAttributes.color!==void 0&&(K=3);let Q,G,j,re;if(L){const ye=Ui[L];Q=ye.vertexShader,G=ye.fragmentShader}else{Q=g.vertexShader,G=g.fragmentShader;const ye=o.getVertexShaderStage(g),rt=o.getFragmentShaderStage(g);o.update(g,ye,rt),j=ye.id,re=rt.id}const le=n.getRenderTarget(),ae=n.state.buffers.depth.getReversed(),Ie=I.isInstancedMesh===!0,it=I.isBatchedMesh===!0,Ee=!!g.map,De=!!g.matcap,se=!!z,_e=se&&z.isPMREMTexture===!0,Ce=!!g.aoMap,st=!!g.lightMap,kt=!!g.bumpMap&&g.wireframe===!1,_t=!!g.normalMap,Li=!!g.displacementMap,Ct=!!g.emissiveMap,si=!!g.metalnessMap,ri=!!g.roughnessMap,ai=g.anisotropy>0,V=g.clearcoat>0,oi=g.diffuseRoughness>0,gt=g.dispersion>0,vt=g.retroreflectivity>0,xe=g.iridescence>0,wt=g.sheen>0,Ue=g.transmission>0,Oe=ai&&!!g.anisotropyMap,N=V&&!!g.clearcoatMap,b=V&&!!g.clearcoatNormalMap,$=V&&!!g.clearcoatRoughnessMap,oe=oi&&!!g.diffuseRoughnessMap,ne=xe&&!!g.iridescenceMap,ue=xe&&!!g.iridescenceThicknessMap,ge=wt&&!!g.sheenColorMap,ee=wt&&!!g.sheenRoughnessMap,te=!!g.specularMap,fe=!!g.specularColorMap,F=!!g.specularIntensityMap,ie=Ue&&!!g.transmissionMap,J=Ue&&!!g.thicknessMap,pe=!!g.gradientMap,he=!!g.alphaMap,de=g.alphaTest>0,Le=!!g.alphaHash,Ve=!!g.extensions;let ce=nn;g.toneMapped&&(le===null||le.isXRRenderTarget===!0)&&(ce=n.toneMapping);const Ne=_e?z.isCompressedCubeTexture?z.image[0].mipmaps:z.mipmaps:null,He={shaderID:L,shaderType:g.type,shaderName:g.name,vertexShader:Q,fragmentShader:G,defines:g.defines,customVertexShaderID:j,customFragmentShaderID:re,isRawShaderMaterial:g.isRawShaderMaterial===!0,glslVersion:g.glslVersion,precision:C,batching:it,batchingColor:it&&I._colorsTexture!==null,instancing:Ie,instancingColor:Ie&&I.instanceColor!==null,instancingMorph:Ie&&I.morphTexture!==null,outputColorSpace:le===null?n.outputColorSpace:le.isXRRenderTarget===!0?le.texture.colorSpace:je.workingColorSpace,alphaToCoverage:!!g.alphaToCoverage,map:Ee,matcap:De,envMap:se,envMapMode:se&&z.mapping,envMapPMREM:_e,envMapMaxLod:_e?Ne.length-1:null,envMapSize:_e?Ne[0].width:null,aoMap:Ce,lightMap:st,bumpMap:kt,normalMap:_t,displacementMap:Li,emissiveMap:Ct,normalMapObjectSpace:_t&&g.normalMapType===Im,normalMapTangentSpace:_t&&g.normalMapType===Nl,packedNormalMap:_t&&g.normalMapType===Nl&&By(g.normalMap.format),metalnessMap:si,roughnessMap:ri,anisotropy:ai,anisotropyMap:Oe,clearcoat:V,clearcoatMap:N,clearcoatNormalMap:b,clearcoatRoughnessMap:$,diffuseRoughness:oi,diffuseRoughnessMap:oe,dispersion:gt,retroreflection:vt,iridescence:xe,iridescenceMap:ne,iridescenceThicknessMap:ue,sheen:wt,sheenColorMap:ge,sheenRoughnessMap:ee,specularMap:te,specularColorMap:fe,specularIntensityMap:F,transmission:Ue,transmissionMap:ie,thicknessMap:J,gradientMap:pe,opaque:g.transparent===!1&&g.blending===er&&g.alphaToCoverage===!1,alphaMap:he,alphaTest:de,alphaHash:Le,combine:g.combine,mapUv:Ee&&d(g.map.channel),aoMapUv:Ce&&d(g.aoMap.channel),lightMapUv:st&&d(g.lightMap.channel),bumpMapUv:kt&&d(g.bumpMap.channel),normalMapUv:_t&&d(g.normalMap.channel),displacementMapUv:Li&&d(g.displacementMap.channel),emissiveMapUv:Ct&&d(g.emissiveMap.channel),metalnessMapUv:si&&d(g.metalnessMap.channel),roughnessMapUv:ri&&d(g.roughnessMap.channel),anisotropyMapUv:Oe&&d(g.anisotropyMap.channel),clearcoatMapUv:N&&d(g.clearcoatMap.channel),clearcoatNormalMapUv:b&&d(g.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:$&&d(g.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:oe&&d(g.diffuseRoughnessMap.channel),iridescenceMapUv:ne&&d(g.iridescenceMap.channel),iridescenceThicknessMapUv:ue&&d(g.iridescenceThicknessMap.channel),sheenColorMapUv:ge&&d(g.sheenColorMap.channel),sheenRoughnessMapUv:ee&&d(g.sheenRoughnessMap.channel),specularMapUv:te&&d(g.specularMap.channel),specularColorMapUv:fe&&d(g.specularColorMap.channel),specularIntensityMapUv:F&&d(g.specularIntensityMap.channel),transmissionMapUv:ie&&d(g.transmissionMap.channel),thicknessMapUv:J&&d(g.thicknessMap.channel),alphaMapUv:he&&d(g.alphaMap.channel),vertexTangents:!!w.attributes.tangent&&(_t||ai),vertexNormals:!!w.attributes.normal,vertexColors:g.vertexColors,vertexAlphas:g.vertexColors===!0&&!!w.attributes.color&&w.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!w.attributes.uv&&(Ee||he),fog:!!D,useFog:g.fog===!0,fogExp2:!!D&&D.isFogExp2,flatShading:g.wireframe===!1&&(g.flatShading===!0||w.attributes.normal===void 0&&_t===!1&&(g.isMeshLambertMaterial||g.isMeshPhongMaterial||g.isMeshStandardMaterial||g.isMeshPhysicalMaterial)),sizeAttenuation:g.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:ae,skinning:I.isSkinnedMesh===!0,hasPositionAttribute:w.attributes.position!==void 0,morphTargets:w.morphAttributes.position!==void 0,morphNormals:w.morphAttributes.normal!==void 0,morphColors:w.morphAttributes.color!==void 0,morphTargetsCount:W,morphTextureStride:K,numSunLights:x.sun.length,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numSunLightShadows:x.sunShadowMap.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numLightProbeGrids:U.filter(ye=>ye.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:g.dithering,shadowMapEnabled:n.shadowMap.enabled&&P.length>0,shadowMapType:n.shadowMap.type,toneMapping:ce,decodeVideoTexture:Ee&&g.map.isVideoTexture===!0&&je.getTransfer(g.map.colorSpace)===at,decodeVideoTextureEmissive:Ct&&g.emissiveMap.isVideoTexture===!0&&je.getTransfer(g.emissiveMap.colorSpace)===at,premultipliedAlpha:g.premultipliedAlpha,doubleSided:g.side===Ci,flipSided:g.side===Jt,useDepthPacking:g.depthPacking>=0,depthPacking:g.depthPacking||0,index0AttributeName:g.index0AttributeName,extensionClipCullDistance:Ve&&g.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ve&&g.extensions.multiDraw===!0||it)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:g.customProgramCacheKey()};return He.vertexUv1s=l.has(1),He.vertexUv2s=l.has(2),He.vertexUv3s=l.has(3),l.clear(),He}function _(g){const x=[];if(g.shaderID?x.push(g.shaderID):(x.push(g.customVertexShaderID),x.push(g.customFragmentShaderID)),g.defines!==void 0)for(const P in g.defines)x.push(P),x.push(g.defines[P]);return g.isRawShaderMaterial===!1&&(m(x,g),v(x,g),x.push(n.outputColorSpace)),x.push(g.customProgramCacheKey),x.join()}function m(g,x){g.push(x.precision),g.push(x.outputColorSpace),g.push(x.envMapMode),g.push(x.envMapPMREM),g.push(x.envMapMaxLod),g.push(x.envMapSize),g.push(x.mapUv),g.push(x.alphaMapUv),g.push(x.lightMapUv),g.push(x.aoMapUv),g.push(x.bumpMapUv),g.push(x.normalMapUv),g.push(x.displacementMapUv),g.push(x.emissiveMapUv),g.push(x.metalnessMapUv),g.push(x.roughnessMapUv),g.push(x.anisotropyMapUv),g.push(x.clearcoatMapUv),g.push(x.clearcoatNormalMapUv),g.push(x.clearcoatRoughnessMapUv),g.push(x.diffuseRoughnessMapUv),g.push(x.iridescenceMapUv),g.push(x.iridescenceThicknessMapUv),g.push(x.sheenColorMapUv),g.push(x.sheenRoughnessMapUv),g.push(x.specularMapUv),g.push(x.specularColorMapUv),g.push(x.specularIntensityMapUv),g.push(x.transmissionMapUv),g.push(x.thicknessMapUv),g.push(x.combine),g.push(x.fogExp2),g.push(x.sizeAttenuation),g.push(x.morphTargetsCount),g.push(x.numSunLights),g.push(x.numDirLights),g.push(x.numPointLights),g.push(x.numSpotLights),g.push(x.numSpotLightMaps),g.push(x.numHemiLights),g.push(x.numRectAreaLights),g.push(x.numSunLightShadows),g.push(x.numDirLightShadows),g.push(x.numPointLightShadows),g.push(x.numSpotLightShadows),g.push(x.numSpotLightShadowsWithMaps),g.push(x.numLightProbes),g.push(x.numLightProbeGrids),g.push(x.shadowMapType),g.push(x.toneMapping),g.push(x.numClippingPlanes),g.push(x.numClipIntersection),g.push(x.depthPacking)}function v(g,x){a.disableAll(),x.instancing&&a.enable(0),x.instancingColor&&a.enable(1),x.instancingMorph&&a.enable(2),x.matcap&&a.enable(3),x.envMap&&a.enable(4),x.normalMapObjectSpace&&a.enable(5),x.normalMapTangentSpace&&a.enable(6),x.clearcoat&&a.enable(7),x.iridescence&&a.enable(8),x.alphaTest&&a.enable(9),x.vertexColors&&a.enable(10),x.vertexAlphas&&a.enable(11),x.vertexUv1s&&a.enable(12),x.vertexUv2s&&a.enable(13),x.vertexUv3s&&a.enable(14),x.vertexTangents&&a.enable(15),x.anisotropy&&a.enable(16),x.alphaHash&&a.enable(17),x.batching&&a.enable(18),x.dispersion&&a.enable(19),x.retroreflection&&a.enable(24),x.diffuseRoughness&&a.enable(25),x.batchingColor&&a.enable(20),x.gradientMap&&a.enable(21),x.packedNormalMap&&a.enable(22),x.vertexNormals&&a.enable(23),g.push(a.mask),a.disableAll(),x.fog&&a.enable(0),x.useFog&&a.enable(1),x.flatShading&&a.enable(2),x.logarithmicDepthBuffer&&a.enable(3),x.reversedDepthBuffer&&a.enable(4),x.skinning&&a.enable(5),x.morphTargets&&a.enable(6),x.morphNormals&&a.enable(7),x.morphColors&&a.enable(8),x.premultipliedAlpha&&a.enable(9),x.shadowMapEnabled&&a.enable(10),x.doubleSided&&a.enable(11),x.flipSided&&a.enable(12),x.useDepthPacking&&a.enable(13),x.dithering&&a.enable(14),x.transmission&&a.enable(15),x.sheen&&a.enable(16),x.opaque&&a.enable(17),x.pointsUvs&&a.enable(18),x.decodeVideoTexture&&a.enable(19),x.decodeVideoTextureEmissive&&a.enable(20),x.alphaToCoverage&&a.enable(21),x.numLightProbeGrids>0&&a.enable(22),x.hasPositionAttribute&&a.enable(23),g.push(a.mask)}function y(g){const x=u[g.type];let P;if(x){const T=Ui[x];P=Og.clone(T.uniforms)}else P=g.uniforms;return P}function A(g,x){let P=h.get(x);return P!==void 0?++P.usedTimes:(P=new Uy(n,x,g,s),c.push(P),h.set(x,P)),P}function R(g){if(--g.usedTimes===0){const x=c.indexOf(g);c[x]=c[c.length-1],c.pop(),h.delete(g.cacheKey),g.destroy()}}function S(g){o.remove(g)}function M(){o.dispose()}return{getParameters:p,getProgramCacheKey:_,getUniforms:y,acquireProgram:A,releaseProgram:R,releaseShaderCache:S,programs:c,dispose:M}}function Hy(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,l){n.get(a)[o]=l}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function Vy(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function ou(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function lu(){const n=[];let e=0;const t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(u){let d=0;return u.isInstancedMesh&&(d+=2),u.isSkinnedMesh&&(d+=1),d}function o(u,d,p,_,m,v){let y=n[e];return y===void 0?(y={id:u.id,object:u,geometry:d,material:p,materialVariant:a(u),groupOrder:_,renderOrder:u.renderOrder,z:m,group:v},n[e]=y):(y.id=u.id,y.object=u,y.geometry=d,y.material=p,y.materialVariant=a(u),y.groupOrder=_,y.renderOrder=u.renderOrder,y.z=m,y.group=v),e++,y}function l(u,d,p,_,m,v,y){y.reversedDepth===!0&&(m=-m);const A=o(u,d,p,_,m,v);p.transmission>0?i.push(A):p.transparent===!0?s.push(A):t.push(A)}function c(u,d,p,_,m,v){const y=o(u,d,p,_,m,v);p.transmission>0?i.unshift(y):p.transparent===!0?s.unshift(y):t.unshift(y)}function h(u,d){t.length>1&&t.sort(u||Vy),i.length>1&&i.sort(d||ou),s.length>1&&s.sort(d||ou)}function f(){for(let u=e,d=n.length;u<d;u++){const p=n[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:l,unshift:c,finish:f,sort:h}}function Gy(){let n=new WeakMap;function e(i,s){const r=n.get(i);let a;return r===void 0?(a=new lu,n.set(i,[a])):s>=r.length?(a=new lu,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function Wy(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new Y,color:new We};break;case"SpotLight":t={position:new Y,direction:new Y,color:new We,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new Y,color:new We,distance:0,decay:0};break;case"HemisphereLight":t={direction:new Y,skyColor:new We,groundColor:new We};break;case"RectAreaLight":t={color:new We,position:new Y,halfWidth:new Y,halfHeight:new Y};break}return n[e.id]=t,t}}}function Xy(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Je};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Je};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Je,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let $y=0;function qy(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function Yy(n){const e=new Wy,t=Xy(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new Y);const s=new Y,r=new qe,a=new qe;function o(c){let h=0,f=0,u=0;for(let U=0;U<9;U++)i.probe[U].set(0,0,0);let d=0,p=0,_=0,m=0,v=0,y=0,A=0,R=0,S=0,M=0,g=0,x=0,P=0,T=0;c.sort(qy);for(let U=0,D=c.length;U<D;U++){const w=c[U],O=w.color,B=w.intensity,z=w.distance;let L=null;if(w.shadow&&w.shadow.map&&(w.shadow.map.texture.format===Hn?L=w.shadow.map.texture:L=w.shadow.map.depthTexture||w.shadow.map.texture),w.isAmbientLight)h+=O.r*B,f+=O.g*B,u+=O.b*B;else if(w.isLightProbe){for(let C=0;C<9;C++)i.probe[C].addScaledVector(w.sh.coefficients[C],B);T++}else if(w.isSunLight){const C=e.get(w);if(C.color.copy(w.color).multiplyScalar(w.intensity),w.castShadow){const H=w.shadow,W=t.get(w);W.shadowIntensity=H.intensity,W.shadowBias=H.bias,W.shadowNormalBias=H.normalBias,W.shadowRadius=H.radius,W.shadowMapSize.copy(H.mapSize).multiply(H.getFrameExtents()),i.sunShadow[p]=W,i.sunShadowMap[p]=L;const K=H.getViewportCount();for(let Q=0;Q<K;Q++)i.sunShadowMatrix[_+Q]=H.getMatrix(Q),i.sunShadowCascade[_+Q]=H._cascadeData[Q];_+=K,p++}i.sun[d]=C,d++}else if(w.isDirectionalLight){const C=e.get(w);if(C.color.copy(w.color).multiplyScalar(w.intensity),w.castShadow){const H=w.shadow,W=t.get(w);W.shadowIntensity=H.intensity,W.shadowBias=H.bias,W.shadowNormalBias=H.normalBias,W.shadowRadius=H.radius,W.shadowMapSize=H.mapSize,i.directionalShadow[m]=W,i.directionalShadowMap[m]=L,i.directionalShadowMatrix[m]=w.shadow.matrix,S++}i.directional[m]=C,m++}else if(w.isSpotLight){const C=e.get(w);C.position.setFromMatrixPosition(w.matrixWorld),C.color.copy(O).multiplyScalar(B),C.distance=z,C.coneCos=Math.cos(w.angle),C.penumbraCos=Math.cos(w.angle*(1-w.penumbra)),C.decay=w.decay,i.spot[y]=C;const H=w.shadow;if(w.map&&(i.spotLightMap[x]=w.map,x++,H.updateMatrices(w),w.castShadow&&P++),i.spotLightMatrix[y]=H.matrix,w.castShadow){const W=t.get(w);W.shadowIntensity=H.intensity,W.shadowBias=H.bias,W.shadowNormalBias=H.normalBias,W.shadowRadius=H.radius,W.shadowMapSize=H.mapSize,i.spotShadow[y]=W,i.spotShadowMap[y]=L,g++}y++}else if(w.isRectAreaLight){const C=e.get(w);C.color.copy(O).multiplyScalar(B),C.halfWidth.set(w.width*.5,0,0),C.halfHeight.set(0,w.height*.5,0),i.rectArea[A]=C,A++}else if(w.isPointLight){const C=e.get(w);if(C.color.copy(w.color).multiplyScalar(w.intensity),C.distance=w.distance,C.decay=w.decay,w.castShadow){const H=w.shadow,W=t.get(w);W.shadowIntensity=H.intensity,W.shadowBias=H.bias,W.shadowNormalBias=H.normalBias,W.shadowRadius=H.radius,W.shadowMapSize=H.mapSize,W.shadowCameraNear=H.camera.near,W.shadowCameraFar=H.camera.far,i.pointShadow[v]=W,i.pointShadowMap[v]=L,i.pointShadowMatrix[v]=w.shadow.matrix,M++}i.point[v]=C,v++}else if(w.isHemisphereLight){const C=e.get(w);C.skyColor.copy(w.color).multiplyScalar(B),C.groundColor.copy(w.groundColor).multiplyScalar(B),i.hemi[R]=C,R++}}A>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Se.LTC_FLOAT_1,i.rectAreaLTC2=Se.LTC_FLOAT_2):(i.rectAreaLTC1=Se.LTC_HALF_1,i.rectAreaLTC2=Se.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=f,i.ambient[2]=u;const I=i.hash;(I.sunLength!==d||I.directionalLength!==m||I.pointLength!==v||I.spotLength!==y||I.rectAreaLength!==A||I.hemiLength!==R||I.numSunShadows!==p||I.numDirectionalShadows!==S||I.numPointShadows!==M||I.numSpotShadows!==g||I.numSpotMaps!==x||I.numLightProbes!==T)&&(i.sun.length=d,i.directional.length=m,i.spot.length=y,i.rectArea.length=A,i.point.length=v,i.hemi.length=R,i.sunShadow.length=p,i.sunShadowMap.length=p,i.sunShadowMatrix.length=_,i.sunShadowCascade.length=_,i.directionalShadow.length=S,i.directionalShadowMap.length=S,i.directionalShadowMatrix.length=S,i.pointShadow.length=M,i.pointShadowMap.length=M,i.pointShadowMatrix.length=M,i.spotShadow.length=g,i.spotShadowMap.length=g,i.spotLightMatrix.length=g+x-P,i.spotLightMap.length=x,i.numSpotLightShadowsWithMaps=P,i.numLightProbes=T,I.sunLength=d,I.directionalLength=m,I.pointLength=v,I.spotLength=y,I.rectAreaLength=A,I.hemiLength=R,I.numSunShadows=p,I.numDirectionalShadows=S,I.numPointShadows=M,I.numSpotShadows=g,I.numSpotMaps=x,I.numLightProbes=T,i.version=$y++)}function l(c,h){let f=0,u=0,d=0,p=0,_=0,m=0;const v=h.matrixWorldInverse;for(let y=0,A=c.length;y<A;y++){const R=c[y];if(R.isSunLight){const S=i.sun[f];S.direction.setFromMatrixPosition(R.matrixWorld),S.direction.transformDirection(v),f++}else if(R.isDirectionalLight){const S=i.directional[u];S.direction.setFromMatrixPosition(R.matrixWorld),s.setFromMatrixPosition(R.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(v),u++}else if(R.isSpotLight){const S=i.spot[p];S.position.setFromMatrixPosition(R.matrixWorld),S.position.applyMatrix4(v),S.direction.setFromMatrixPosition(R.matrixWorld),s.setFromMatrixPosition(R.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(v),p++}else if(R.isRectAreaLight){const S=i.rectArea[_];S.position.setFromMatrixPosition(R.matrixWorld),S.position.applyMatrix4(v),a.identity(),r.copy(R.matrixWorld),r.premultiply(v),a.extractRotation(r),S.halfWidth.set(R.width*.5,0,0),S.halfHeight.set(0,R.height*.5,0),S.halfWidth.applyMatrix4(a),S.halfHeight.applyMatrix4(a),_++}else if(R.isPointLight){const S=i.point[d];S.position.setFromMatrixPosition(R.matrixWorld),S.position.applyMatrix4(v),d++}else if(R.isHemisphereLight){const S=i.hemi[m];S.direction.setFromMatrixPosition(R.matrixWorld),S.direction.transformDirection(v),m++}}}return{setup:o,setupView:l,state:i}}function cu(n){const e=new Yy(n),t=[],i=[],s=[];function r(f){h.camera=f,t.length=0,i.length=0,s.length=0}function a(f){f.isLightProbeGrid?s.push(f):t.push(f)}function o(f){i.push(f)}function l(){e.setup(t),s.sort((f,u)=>f.priority-u.priority||f.id-u.id)}function c(f){e.setupView(t,f)}const h={lightsArray:t,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:h,setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function Ky(n){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new cu(n),e.set(s,[o])):r>=a.length?(o=new cu(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const Zy=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,jy=`uniform sampler2D shadow_pass;
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
}`,Jy=[new Y(1,0,0),new Y(-1,0,0),new Y(0,1,0),new Y(0,-1,0),new Y(0,0,1),new Y(0,0,-1)],Qy=[new Y(0,-1,0),new Y(0,-1,0),new Y(0,0,1),new Y(0,0,-1),new Y(0,-1,0),new Y(0,-1,0)],hu=new qe,Xs=new Y,Do=new Y;function eS(n,e,t){let i=new hr;const s=new Je,r=new Je,a=new lt,o=new Hg,l=new Vg,c={},h=t.maxTextureSize,f={[zn]:Jt,[Jt]:zn,[Ci]:Ci},u=new Vn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Je},radius:{value:4}},vertexShader:Zy,fragmentShader:jy}),d=u.clone();d.defines.HORIZONTAL_PASS=1;const p=new Hi;p.setAttribute("position",new rn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new vi(p,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ra;let v=this.type;this.render=function(M,g,x){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||M.length===0)return;this.type===am&&(Pe("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=ra);const P=n.getRenderTarget(),T=n.getActiveCubeFace(),I=n.getActiveMipmapLevel(),U=n.state;U.setBlending(vs),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const D=v!==this.type;D&&g.traverse(function(w){w.material&&(Array.isArray(w.material)?w.material.forEach(O=>O.needsUpdate=!0):w.material.needsUpdate=!0)});for(let w=0,O=M.length;w<O;w++){const B=M[w],z=B.shadow;if(z===void 0){Pe("WebGLShadowMap:",B,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;s.copy(z.mapSize);const L=z.getFrameExtents();s.multiply(L),r.copy(z.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/L.x),s.x=r.x*L.x,z.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/L.y),s.y=r.y*L.y,z.mapSize.y=r.y));const C=n.state.buffers.depth.getReversed();if(z.camera._reversedDepth=C,z.map===null||D===!0){if(z.map!==null&&(z.map.depthTexture!==null&&(z.map.depthTexture.dispose(),z.map.depthTexture=null),z.map.dispose()),this.type===qs){if(B.isPointLight){Pe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}z.map=new Oi(s.x,s.y,{format:Hn,type:Bi,minFilter:Nt,magFilter:Nt,generateMipmaps:!1}),z.map.texture.name=B.name+".shadowMap",z.map.depthTexture=new ws(s.x,s.y,mi),z.map.depthTexture.name=B.name+".shadowMapDepth",z.map.depthTexture.format=En,z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=Et,z.map.depthTexture.magFilter=Et}else B.isPointLight?(z.map=new lc(s.x),z.map.depthTexture=new bd(s.x,ki)):(z.map=new Oi(s.x,s.y),z.map.depthTexture=new ws(s.x,s.y,ki)),z.map.depthTexture.name=B.name+".shadowMap",z.map.depthTexture.format=En,this.type===ra?(z.map.depthTexture.compareFunction=C?cd:ld,z.map.depthTexture.minFilter=Nt,z.map.depthTexture.magFilter=Nt):(z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=Et,z.map.depthTexture.magFilter=Et);z.camera.updateProjectionMatrix()}z.map.isWebGLCubeRenderTarget!==!0&&(z.map.width!==s.x||z.map.height!==s.y)&&z.map.setSize(s.x,s.y);const H=z.map.isWebGLCubeRenderTarget?6:z.getViewportCount();B.isPointLight!==!0&&z.updateMatrices(B,x);const W=(z.camera.layers.mask&4294967294)!==0?z.camera.layers:x.layers;for(let K=0;K<H;K++){const Q=z.getCamera(K);if(B.isPointLight){const G=z.camera,j=z.matrix,re=B.distance||G.far;re!==G.far&&(G.far=re,G.updateProjectionMatrix()),Xs.setFromMatrixPosition(B.matrixWorld),G.position.copy(Xs),Do.copy(G.position),Do.add(Jy[K]),G.up.copy(Qy[K]),G.lookAt(Do),G.updateMatrixWorld(),j.makeTranslation(-Xs.x,-Xs.y,-Xs.z),hu.multiplyMatrices(G.projectionMatrix,G.matrixWorldInverse),z._frustum.setFromProjectionMatrix(hu,G.coordinateSystem,G.reversedDepth)}if(z.map.isWebGLCubeRenderTarget)n.setRenderTarget(z.map,K),n.clear();else{K===0&&(n.setRenderTarget(z.map),n.clear());const G=z.getViewport(K);a.set(r.x*G.x,r.y*G.y,r.x*G.z,r.y*G.w),U.viewport(a)}i=z.getFrustum(K),R(g,x,Q,B,W,this.type)}z.isPointLightShadow!==!0&&this.type===qs&&y(z,x),z.needsUpdate=!1}v=this.type,m.needsUpdate=!1,n.setRenderTarget(P,T,I)};function y(M,g){const x=e.update(_);u.defines.VSM_SAMPLES!==M.blurSamples&&(u.defines.VSM_SAMPLES=M.blurSamples,d.defines.VSM_SAMPLES=M.blurSamples,u.needsUpdate=!0,d.needsUpdate=!0),M.mapPass===null?M.mapPass=new Oi(s.x,s.y,{format:Hn,type:Bi}):(M.mapPass.width!==M.map.width||M.mapPass.height!==M.map.height)&&M.mapPass.setSize(M.map.width,M.map.height),u.uniforms.shadow_pass.value=M.map.depthTexture,u.uniforms.resolution.value.set(M.map.width,M.map.height),u.uniforms.radius.value=M.radius,n.setRenderTarget(M.mapPass),n.clear(),n.renderBufferDirect(g,null,x,u,_,null),d.uniforms.shadow_pass.value=M.mapPass.texture,d.uniforms.resolution.value.set(M.map.width,M.map.height),d.uniforms.radius.value=M.radius,n.setRenderTarget(M.map),n.clear(),n.renderBufferDirect(g,null,x,d,_,null)}function A(M,g,x,P){let T=null;const I=x.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(I!==void 0)T=I;else if(T=x.isPointLight===!0?l:o,n.localClippingEnabled&&g.clipShadows===!0&&Array.isArray(g.clippingPlanes)&&g.clippingPlanes.length!==0||g.displacementMap&&g.displacementScale!==0||g.alphaMap&&g.alphaTest>0||g.map&&g.alphaTest>0||g.alphaToCoverage===!0){const U=T.uuid,D=g.uuid;let w=c[U];w===void 0&&(w={},c[U]=w);let O=w[D];O===void 0&&(O=T.clone(),w[D]=O,g.addEventListener("dispose",S)),T=O}if(T.visible=g.visible,T.wireframe=g.wireframe,P===qs?T.side=g.shadowSide!==null?g.shadowSide:g.side:T.side=g.shadowSide!==null?g.shadowSide:f[g.side],T.alphaMap=g.alphaMap,T.alphaTest=g.alphaToCoverage===!0?.5:g.alphaTest,T.map=g.map,T.clipShadows=g.clipShadows,T.clippingPlanes=g.clippingPlanes,T.clipIntersection=g.clipIntersection,T.displacementMap=g.displacementMap,T.displacementScale=g.displacementScale,T.displacementBias=g.displacementBias,T.wireframeLinewidth=g.wireframeLinewidth,T.linewidth=g.linewidth,x.isPointLight===!0&&T.isMeshDistanceMaterial===!0){const U=n.properties.get(T);U.light=x}return T}function R(M,g,x,P,T,I){if(M.visible===!1)return;if(M.layers.test(T)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&I===qs)&&(!M.frustumCulled||M.intersectsFrustum(i))){M.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,M.matrixWorld);const w=e.update(M),O=M.material;if(Array.isArray(O)){const B=w.groups;for(let z=0,L=B.length;z<L;z++){const C=B[z],H=O[C.materialIndex];if(H&&H.visible){const W=A(M,H,P,I);M.onBeforeShadow(n,M,g,x,w,W,C),n.renderBufferDirect(x,null,w,W,M,C),M.onAfterShadow(n,M,g,x,w,W,C)}}}else if(O.visible){const B=A(M,O,P,I);M.onBeforeShadow(n,M,g,x,w,B,null),n.renderBufferDirect(x,null,w,B,M,null),M.onAfterShadow(n,M,g,x,w,B,null)}}const D=M.children;for(let w=0,O=D.length;w<O;w++)R(D[w],g,x,P,T,I)}function S(M){M.target.removeEventListener("dispose",S);for(const x in c){const P=c[x],T=M.target.uuid;T in P&&(P[T].dispose(),delete P[T])}}}function tS(n,e){function t(){let F=!1;const ie=new lt;let J=null;const pe=new lt(0,0,0,0);return{setMask:function(he){J!==he&&!F&&(n.colorMask(he,he,he,he),J=he)},setLocked:function(he){F=he},setClear:function(he,de,Le,Ve,ce){ce===!0&&(he*=Ve,de*=Ve,Le*=Ve),ie.set(he,de,Le,Ve),pe.equals(ie)===!1&&(n.clearColor(he,de,Le,Ve),pe.copy(ie))},reset:function(){F=!1,J=null,pe.set(-1,0,0,0)}}}function i(){let F=!1,ie=!1,J=null,pe=null,he=null;return{setReversed:function(de){if(ie!==de){const Le=e.get("EXT_clip_control");de?Le.clipControlEXT(Le.LOWER_LEFT_EXT,Le.ZERO_TO_ONE_EXT):Le.clipControlEXT(Le.LOWER_LEFT_EXT,Le.NEGATIVE_ONE_TO_ONE_EXT),ie=de;const Ve=he;he=null,this.setClear(Ve)}},getReversed:function(){return ie},setTest:function(de){de?ae(n.DEPTH_TEST):Ie(n.DEPTH_TEST)},setMask:function(de){J!==de&&!F&&(n.depthMask(de),J=de)},setFunc:function(de){if(ie&&(de=Vm[de]),pe!==de){switch(de){case qo:n.depthFunc(n.NEVER);break;case Yo:n.depthFunc(n.ALWAYS);break;case Ko:n.depthFunc(n.LESS);break;case sr:n.depthFunc(n.LEQUAL);break;case Zo:n.depthFunc(n.EQUAL);break;case jo:n.depthFunc(n.GEQUAL);break;case Jo:n.depthFunc(n.GREATER);break;case Qo:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}pe=de}},setLocked:function(de){F=de},setClear:function(de){he!==de&&(he=de,ie&&(de=1-de),n.clearDepth(de))},reset:function(){F=!1,J=null,pe=null,he=null,ie=!1}}}function s(){let F=!1,ie=null,J=null,pe=null,he=null,de=null,Le=null,Ve=null,ce=null;return{setTest:function(Ne){F||(Ne?ae(n.STENCIL_TEST):Ie(n.STENCIL_TEST))},setMask:function(Ne){ie!==Ne&&!F&&(n.stencilMask(Ne),ie=Ne)},setFunc:function(Ne,He,ye){(J!==Ne||pe!==He||he!==ye)&&(n.stencilFunc(Ne,He,ye),J=Ne,pe=He,he=ye)},setOp:function(Ne,He,ye){(de!==Ne||Le!==He||Ve!==ye)&&(n.stencilOp(Ne,He,ye),de=Ne,Le=He,Ve=ye)},setLocked:function(Ne){F=Ne},setClear:function(Ne){ce!==Ne&&(n.clearStencil(Ne),ce=Ne)},reset:function(){F=!1,ie=null,J=null,pe=null,he=null,de=null,Le=null,Ve=null,ce=null}}}const r=new t,a=new i,o=new s;let l={};const c=new WeakMap;let h={},f={},u={},d=new WeakMap,p=[],_=null,m=!1,v=null,y=null,A=null,R=null,S=null,M=null,g=null,x=new We(0,0,0),P=0,T=!1,I=null,U=null,D=null,w=null,O=null;const B=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let z=!1,L=0;const C=n.getParameter(n.VERSION);C.indexOf("WebGL")!==-1?(L=parseFloat(/^WebGL (\d)/.exec(C)[1]),z=L>=1):C.indexOf("OpenGL ES")!==-1&&(L=parseFloat(/^OpenGL ES (\d)/.exec(C)[1]),z=L>=2);let H=null,W={};const K=n.getParameter(n.SCISSOR_BOX),Q=n.getParameter(n.VIEWPORT),G=new lt().fromArray(K),j=new lt().fromArray(Q);function re(F,ie,J,pe){const he=new Uint8Array(4),de=n.createTexture();n.bindTexture(F,de),n.texParameteri(F,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(F,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Le=0;Le<J;Le++)F===n.TEXTURE_3D||F===n.TEXTURE_2D_ARRAY?n.texImage3D(ie,0,n.RGBA,1,1,pe,0,n.RGBA,n.UNSIGNED_BYTE,he):n.texImage2D(ie+Le,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,he);return de}const le={};le[n.TEXTURE_2D]=re(n.TEXTURE_2D,n.TEXTURE_2D,1),le[n.TEXTURE_CUBE_MAP]=re(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),le[n.TEXTURE_2D_ARRAY]=re(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),le[n.TEXTURE_3D]=re(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ae(n.DEPTH_TEST),a.setFunc(sr),kt(!1),_t(Kc),ae(n.CULL_FACE),Ce(vs);function ae(F){h[F]!==!0&&(n.enable(F),h[F]=!0)}function Ie(F){h[F]!==!1&&(n.disable(F),h[F]=!1)}function it(F,ie){return u[F]!==ie?(n.bindFramebuffer(F,ie),u[F]=ie,F===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=ie),F===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=ie),!0):!1}function Ee(F,ie){let J=p,pe=!1;if(F){J=d.get(ie),J===void 0&&(J=[],d.set(ie,J));const he=F.textures;if(J.length!==he.length||J[0]!==n.COLOR_ATTACHMENT0){for(let de=0,Le=he.length;de<Le;de++)J[de]=n.COLOR_ATTACHMENT0+de;J.length=he.length,pe=!0}}else J[0]!==n.BACK&&(J[0]=n.BACK,pe=!0);pe&&n.drawBuffers(J)}function De(F){return _!==F?(n.useProgram(F),_=F,!0):!1}const se={[Ji]:n.FUNC_ADD,[om]:n.FUNC_SUBTRACT,[Xu]:n.FUNC_REVERSE_SUBTRACT};se[lm]=n.MIN,se[cm]=n.MAX;const _e={[hm]:n.ZERO,[$o]:n.ONE,[um]:n.SRC_COLOR,[$u]:n.SRC_ALPHA,[vm]:n.SRC_ALPHA_SATURATE,[mm]:n.DST_COLOR,[fm]:n.DST_ALPHA,[dm]:n.ONE_MINUS_SRC_COLOR,[_a]:n.ONE_MINUS_SRC_ALPHA,[gm]:n.ONE_MINUS_DST_COLOR,[pm]:n.ONE_MINUS_DST_ALPHA,[_m]:n.CONSTANT_COLOR,[xm]:n.ONE_MINUS_CONSTANT_COLOR,[ym]:n.CONSTANT_ALPHA,[Sm]:n.ONE_MINUS_CONSTANT_ALPHA};function Ce(F,ie,J,pe,he,de,Le,Ve,ce,Ne){if(F===vs){m===!0&&(Ie(n.BLEND),m=!1);return}if(m===!1&&(ae(n.BLEND),m=!0),F!==Wu){if(F!==v||Ne!==T){if((y!==Ji||S!==Ji)&&(n.blendEquation(n.FUNC_ADD),y=Ji,S=Ji),Ne)switch(F){case er:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Zc:n.blendFunc(n.ONE,n.ONE);break;case jc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Jc:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:Fe("WebGLState: Invalid blending: ",F);break}else switch(F){case er:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Zc:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case jc:Fe("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Jc:Fe("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Fe("WebGLState: Invalid blending: ",F);break}A=null,R=null,M=null,g=null,x.set(0,0,0),P=0,v=F,T=Ne}return}he=he||ie,de=de||J,Le=Le||pe,(ie!==y||he!==S)&&(n.blendEquationSeparate(se[ie],se[he]),y=ie,S=he),(J!==A||pe!==R||de!==M||Le!==g)&&(n.blendFuncSeparate(_e[J],_e[pe],_e[de],_e[Le]),A=J,R=pe,M=de,g=Le),(Ve.equals(x)===!1||ce!==P)&&(n.blendColor(Ve.r,Ve.g,Ve.b,ce),x.copy(Ve),P=ce),v=F,T=!1}function st(F,ie){F.side===Ci?Ie(n.CULL_FACE):ae(n.CULL_FACE);let J=F.side===Jt;ie&&(J=!J),kt(J),F.blending===er&&F.transparent===!1?Ce(vs):Ce(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),a.setFunc(F.depthFunc),a.setTest(F.depthTest),a.setMask(F.depthWrite),r.setMask(F.colorWrite);const pe=F.stencilWrite;o.setTest(pe),pe&&(o.setMask(F.stencilWriteMask),o.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),o.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Ct(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?ae(n.SAMPLE_ALPHA_TO_COVERAGE):Ie(n.SAMPLE_ALPHA_TO_COVERAGE)}function kt(F){I!==F&&(F?n.frontFace(n.CW):n.frontFace(n.CCW),I=F)}function _t(F){F!==sm?(ae(n.CULL_FACE),F!==U&&(F===Kc?n.cullFace(n.BACK):F===rm?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Ie(n.CULL_FACE),U=F}function Li(F){F!==D&&(z&&n.lineWidth(F),D=F)}function Ct(F,ie,J){F?(ae(n.POLYGON_OFFSET_FILL),(w!==ie||O!==J)&&(w=ie,O=J,a.getReversed()&&(ie=-ie,J=-J),n.polygonOffset(ie,J))):Ie(n.POLYGON_OFFSET_FILL)}function si(F){F?ae(n.SCISSOR_TEST):Ie(n.SCISSOR_TEST)}function ri(F){F===void 0&&(F=n.TEXTURE0+B-1),H!==F&&(n.activeTexture(F),H=F)}function ai(F,ie,J){J===void 0&&(H===null?J=n.TEXTURE0+B-1:J=H);let pe=W[J];pe===void 0&&(pe={type:void 0,texture:void 0},W[J]=pe),(pe.type!==F||pe.texture!==ie)&&(H!==J&&(n.activeTexture(J),H=J),n.bindTexture(F,ie||le[F]),pe.type=F,pe.texture=ie)}function V(){const F=W[H];F!==void 0&&F.type!==void 0&&(n.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function oi(){try{n.compressedTexImage2D(...arguments)}catch(F){Fe("WebGLState:",F)}}function gt(){try{n.compressedTexImage3D(...arguments)}catch(F){Fe("WebGLState:",F)}}function vt(){try{n.texSubImage2D(...arguments)}catch(F){Fe("WebGLState:",F)}}function xe(){try{n.texSubImage3D(...arguments)}catch(F){Fe("WebGLState:",F)}}function wt(){try{n.compressedTexSubImage2D(...arguments)}catch(F){Fe("WebGLState:",F)}}function Ue(){try{n.compressedTexSubImage3D(...arguments)}catch(F){Fe("WebGLState:",F)}}function Oe(){try{n.texStorage2D(...arguments)}catch(F){Fe("WebGLState:",F)}}function N(){try{n.texStorage3D(...arguments)}catch(F){Fe("WebGLState:",F)}}function b(){try{n.texImage2D(...arguments)}catch(F){Fe("WebGLState:",F)}}function $(){try{n.texImage3D(...arguments)}catch(F){Fe("WebGLState:",F)}}function oe(F){return f[F]!==void 0?f[F]:n.getParameter(F)}function ne(F,ie){f[F]!==ie&&(n.pixelStorei(F,ie),f[F]=ie)}function ue(F){G.equals(F)===!1&&(n.scissor(F.x,F.y,F.z,F.w),G.copy(F))}function ge(F){j.equals(F)===!1&&(n.viewport(F.x,F.y,F.z,F.w),j.copy(F))}function ee(F,ie){let J=c.get(ie);J===void 0&&(J=new WeakMap,c.set(ie,J));let pe=J.get(F);pe===void 0&&(pe=n.getUniformBlockIndex(ie,F.name),n.uniformBlockBinding(ie,pe,pe),J.set(F,pe))}function te(F,ie,J){const he=c.get(ie).get(F);l[he]!==J&&(n.bindBufferBase(n.UNIFORM_BUFFER,he,J),l[he]=J)}function fe(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),h={},f={},H=null,W={},u={},l={},d=new WeakMap,p=[],_=null,m=!1,v=null,y=null,A=null,R=null,S=null,M=null,g=null,x=new We(0,0,0),P=0,T=!1,I=null,U=null,D=null,w=null,O=null,G.set(0,0,n.canvas.width,n.canvas.height),j.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ae,disable:Ie,bindFramebuffer:it,drawBuffers:Ee,useProgram:De,setBlending:Ce,setMaterial:st,setFlipSided:kt,setCullFace:_t,setLineWidth:Li,setPolygonOffset:Ct,setScissorTest:si,activeTexture:ri,bindTexture:ai,unbindTexture:V,compressedTexImage2D:oi,compressedTexImage3D:gt,texImage2D:b,texImage3D:$,pixelStorei:ne,getParameter:oe,updateUBOMapping:ee,uniformBlockBinding:te,texStorage2D:Oe,texStorage3D:N,texSubImage2D:vt,texSubImage3D:xe,compressedTexSubImage2D:wt,compressedTexSubImage3D:Ue,scissor:ue,viewport:ge,reset:fe}}function iS(n,e,t,i,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Je,h=new WeakMap,f=new Set;let u;const d=new WeakMap,p=new Set,_=new FinalizationRegistry(N=>p.delete(N));let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(N,b){return m?new OffscreenCanvas(N,b):cr("canvas")}function y(N,b,$){let oe=1;const ne=Oe(N);if((ne.width>$||ne.height>$)&&(oe=$/Math.max(ne.width,ne.height)),oe<1)if(typeof HTMLImageElement<"u"&&N instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&N instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&N instanceof ImageBitmap||typeof VideoFrame<"u"&&N instanceof VideoFrame){const ue=Math.floor(oe*ne.width),ge=Math.floor(oe*ne.height);u===void 0&&(u=v(ue,ge));const ee=b?v(ue,ge):u;return ee.width=ue,ee.height=ge,ee.getContext("2d").drawImage(N,0,0,ue,ge),Pe("WebGLRenderer: Texture has been resized from ("+ne.width+"x"+ne.height+") to ("+ue+"x"+ge+")."),ee}else return"data"in N&&Pe("WebGLRenderer: Image in DataTexture is too big ("+ne.width+"x"+ne.height+")."),N;return N}function A(N){return N.generateMipmaps}function R(N){n.generateMipmap(N)}function S(N){return N.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:N.isWebGL3DRenderTarget?n.TEXTURE_3D:N.isWebGLArrayRenderTarget||N.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function M(N,b,$,oe,ne,ue=!1){if(N!==null){if(n[N]!==void 0)return n[N];Pe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+N+"'")}let ge;oe&&(ge=e.get("EXT_texture_norm16"),ge||Pe("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let ee=b;if(b===n.RED&&($===n.FLOAT&&(ee=n.R32F),$===n.HALF_FLOAT&&(ee=n.R16F),$===n.UNSIGNED_BYTE&&(ee=n.R8),$===n.UNSIGNED_SHORT&&ge&&(ee=ge.R16_EXT),$===n.SHORT&&ge&&(ee=ge.R16_SNORM_EXT)),b===n.RED_INTEGER&&($===n.UNSIGNED_BYTE&&(ee=n.R8UI),$===n.UNSIGNED_SHORT&&(ee=n.R16UI),$===n.UNSIGNED_INT&&(ee=n.R32UI),$===n.BYTE&&(ee=n.R8I),$===n.SHORT&&(ee=n.R16I),$===n.INT&&(ee=n.R32I)),b===n.RG&&($===n.FLOAT&&(ee=n.RG32F),$===n.HALF_FLOAT&&(ee=n.RG16F),$===n.UNSIGNED_BYTE&&(ee=n.RG8),$===n.UNSIGNED_SHORT&&ge&&(ee=ge.RG16_EXT),$===n.SHORT&&ge&&(ee=ge.RG16_SNORM_EXT)),b===n.RG_INTEGER&&($===n.UNSIGNED_BYTE&&(ee=n.RG8UI),$===n.UNSIGNED_SHORT&&(ee=n.RG16UI),$===n.UNSIGNED_INT&&(ee=n.RG32UI),$===n.BYTE&&(ee=n.RG8I),$===n.SHORT&&(ee=n.RG16I),$===n.INT&&(ee=n.RG32I)),b===n.RGB_INTEGER&&($===n.UNSIGNED_BYTE&&(ee=n.RGB8UI),$===n.UNSIGNED_SHORT&&(ee=n.RGB16UI),$===n.UNSIGNED_INT&&(ee=n.RGB32UI),$===n.BYTE&&(ee=n.RGB8I),$===n.SHORT&&(ee=n.RGB16I),$===n.INT&&(ee=n.RGB32I)),b===n.RGBA_INTEGER&&($===n.UNSIGNED_BYTE&&(ee=n.RGBA8UI),$===n.UNSIGNED_SHORT&&(ee=n.RGBA16UI),$===n.UNSIGNED_INT&&(ee=n.RGBA32UI),$===n.BYTE&&(ee=n.RGBA8I),$===n.SHORT&&(ee=n.RGBA16I),$===n.INT&&(ee=n.RGBA32I)),b===n.RGB&&($===n.UNSIGNED_SHORT&&ge&&(ee=ge.RGB16_EXT),$===n.SHORT&&ge&&(ee=ge.RGB16_SNORM_EXT),$===n.UNSIGNED_INT_5_9_9_9_REV&&(ee=n.RGB9_E5),$===n.UNSIGNED_INT_10F_11F_11F_REV&&(ee=n.R11F_G11F_B10F)),b===n.RGBA){const te=ue?ba:je.getTransfer(ne);$===n.FLOAT&&(ee=n.RGBA32F),$===n.HALF_FLOAT&&(ee=n.RGBA16F),$===n.UNSIGNED_BYTE&&(ee=te===at?n.SRGB8_ALPHA8:n.RGBA8),$===n.UNSIGNED_SHORT&&ge&&(ee=ge.RGBA16_EXT),$===n.SHORT&&ge&&(ee=ge.RGBA16_SNORM_EXT),$===n.UNSIGNED_SHORT_4_4_4_4&&(ee=n.RGBA4),$===n.UNSIGNED_SHORT_5_5_5_1&&(ee=n.RGB5_A1)}return(ee===n.R16F||ee===n.R32F||ee===n.RG16F||ee===n.RG32F||ee===n.RGBA16F||ee===n.RGBA32F)&&e.get("EXT_color_buffer_float"),ee}function g(N,b){let $;return N?b===null||b===ki||b===Ss?$=n.DEPTH24_STENCIL8:b===mi?$=n.DEPTH32F_STENCIL8:b===ar&&($=n.DEPTH24_STENCIL8,Pe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===ki||b===Ss?$=n.DEPTH_COMPONENT24:b===mi?$=n.DEPTH_COMPONENT32F:b===ar&&($=n.DEPTH_COMPONENT16),$}function x(N,b){return A(N)===!0||N.isFramebufferTexture&&N.minFilter!==Et&&N.minFilter!==Nt?Math.log2(Math.max(b.width,b.height))+1:N.mipmaps.length>0?N.mipmaps.length:N.isCompressedTexture&&Array.isArray(N.image)?b.mipmaps.length:1}function P(N){const b=new WeakRef(N);i.get(N).__ref=b,p.add(b),_.register(N,b,b)}function T(N){const b=i.get(N).__ref;b!==void 0&&(p.delete(b),_.unregister(b))}function I(N){D(N.target)}function U(N){w(N.target)}function D(N){N.removeEventListener("dispose",I),T(N),B(N),N.isVideoTexture&&h.delete(N),N.isHTMLTexture&&f.delete(N)}function w(N){N.removeEventListener("dispose",U),T(N),L(N)}function O(){for(const N of p){const b=N.deref();b!==void 0&&(b.isRenderTarget===!0?w(b):D(b))}p.clear(),f.clear()}function B(N){const b=i.get(N);if(b.__webglInit===void 0)return;const $=N.source,oe=d.get($);if(oe){const ne=oe[b.__cacheKey];ne.usedTimes--,ne.usedTimes===0&&z(N),Object.keys(oe).length===0&&d.delete($)}i.remove(N)}function z(N){const b=i.get(N);n.deleteTexture(b.__webglTexture);const $=N.source,oe=d.get($);delete oe[b.__cacheKey],a.memory.textures--}function L(N){const b=i.get(N);b.__depthDisposeCallback&&b.__depthDisposeCallback();const $=N.depthTexture;if($&&$.renderTarget===N&&D($),N.isWebGLCubeRenderTarget)for(let ne=0;ne<6;ne++){if(Array.isArray(b.__webglFramebuffer[ne]))for(let ue=0;ue<b.__webglFramebuffer[ne].length;ue++)n.deleteFramebuffer(b.__webglFramebuffer[ne][ue]);else n.deleteFramebuffer(b.__webglFramebuffer[ne]);b.__webglDepthbuffer&&n.deleteRenderbuffer(b.__webglDepthbuffer[ne])}else{if(Array.isArray(b.__webglFramebuffer))for(let ne=0;ne<b.__webglFramebuffer.length;ne++)n.deleteFramebuffer(b.__webglFramebuffer[ne]);else n.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&n.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&n.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let ne=0;ne<b.__webglColorRenderbuffer.length;ne++)b.__webglColorRenderbuffer[ne]&&n.deleteRenderbuffer(b.__webglColorRenderbuffer[ne]);b.__webglDepthRenderbuffer&&n.deleteRenderbuffer(b.__webglDepthRenderbuffer)}const oe=N.textures;for(let ne=0,ue=oe.length;ne<ue;ne++){const ge=i.get(oe[ne]);ge.__webglTexture&&(n.deleteTexture(ge.__webglTexture),a.memory.textures--),i.remove(oe[ne])}i.remove(N)}let C=0;function H(){C=0}function W(){return C}function K(N){C=N}function Q(){const N=C;return N>=s.maxTextures&&Pe("WebGLTextures: Trying to use "+(N+1)+" texture units while this GPU supports only "+s.maxTextures),C+=1,N}function G(N){const b=[];return b.push(N.wrapS),b.push(N.wrapT),b.push(N.wrapR||0),b.push(N.magFilter),b.push(N.minFilter),b.push(N.anisotropy),b.push(N.internalFormat),b.push(N.format),b.push(N.type),b.push(N.generateMipmaps),b.push(N.mipmapsAutoUpdate),b.push(N.premultiplyAlpha),b.push(N.flipY),b.push(N.unpackAlignment),b.push(N.colorSpace),b.join()}function j(N,b){const $=i.get(N);if(N.isVideoTexture&&wt(N),N.isRenderTargetTexture===!1&&N.isExternalTexture!==!0&&N.version>0&&$.__version!==N.version){const oe=N.image;if(oe===null)Pe("WebGLRenderer: Texture marked for update but no image data found.");else if(oe.complete===!1)Pe("WebGLRenderer: Texture marked for update but image is incomplete");else{st($,N,b);return}}else N.isExternalTexture&&($.__webglTexture=N.sourceTexture?N.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,$.__webglTexture,n.TEXTURE0+b)}function re(N,b){const $=i.get(N);if(N.isRenderTargetTexture===!1&&N.version>0&&$.__version!==N.version){st($,N,b);return}else N.isExternalTexture&&($.__webglTexture=N.sourceTexture?N.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,$.__webglTexture,n.TEXTURE0+b)}function le(N,b){const $=i.get(N);if(N.isRenderTargetTexture===!1&&N.version>0&&$.__version!==N.version){st($,N,b);return}t.bindTexture(n.TEXTURE_3D,$.__webglTexture,n.TEXTURE0+b)}function ae(N,b){const $=i.get(N);if(N.version>0&&$.__version!==N.version){kt($,N,b);return}t.bindTexture(n.TEXTURE_CUBE_MAP,$.__webglTexture,n.TEXTURE0+b)}const Ie={[el]:n.REPEAT,[ii]:n.CLAMP_TO_EDGE,[tl]:n.MIRRORED_REPEAT},it={[Et]:n.NEAREST,[Em]:n.NEAREST_MIPMAP_NEAREST,[wr]:n.NEAREST_MIPMAP_LINEAR,[Nt]:n.LINEAR,[so]:n.LINEAR_MIPMAP_NEAREST,[en]:n.LINEAR_MIPMAP_LINEAR},Ee={[Nm]:n.NEVER,[hd]:n.ALWAYS,[Dm]:n.LESS,[ld]:n.LEQUAL,[Um]:n.EQUAL,[cd]:n.GEQUAL,[Fm]:n.GREATER,[Om]:n.NOTEQUAL};function De(N,b){if(b.type===mi&&e.has("OES_texture_float_linear")===!1&&(b.magFilter===Nt||b.magFilter===so||b.magFilter===wr||b.magFilter===en||b.minFilter===Nt||b.minFilter===so||b.minFilter===wr||b.minFilter===en)&&Pe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(N,n.TEXTURE_WRAP_S,Ie[b.wrapS]),n.texParameteri(N,n.TEXTURE_WRAP_T,Ie[b.wrapT]),(N===n.TEXTURE_3D||N===n.TEXTURE_2D_ARRAY)&&n.texParameteri(N,n.TEXTURE_WRAP_R,Ie[b.wrapR]),n.texParameteri(N,n.TEXTURE_MAG_FILTER,it[b.magFilter]),n.texParameteri(N,n.TEXTURE_MIN_FILTER,it[b.minFilter]),b.compareFunction&&(n.texParameteri(N,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(N,n.TEXTURE_COMPARE_FUNC,Ee[b.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===Et||b.minFilter!==wr&&b.minFilter!==en||b.type===mi&&e.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||i.get(b).__currentAnisotropy){const $=e.get("EXT_texture_filter_anisotropic");n.texParameterf(N,$.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,s.getMaxAnisotropy())),i.get(b).__currentAnisotropy=b.anisotropy}}}function se(N,b){let $=!1;N.__webglInit===void 0&&(N.__webglInit=!0,b.addEventListener("dispose",I),P(b));const oe=b.source;let ne=d.get(oe);ne===void 0&&(ne={},d.set(oe,ne));const ue=G(b);if(ue!==N.__cacheKey){ne[ue]===void 0&&(ne[ue]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,$=!0),ne[ue].usedTimes++;const ge=ne[N.__cacheKey];ge!==void 0&&(ne[N.__cacheKey].usedTimes--,ge.usedTimes===0&&z(b)),N.__cacheKey=ue,N.__webglTexture=ne[ue].texture}return $}function _e(N,b,$){return Math.floor(Math.floor(N/$)/b)}function Ce(N,b,$,oe){const ue=N.updateRanges;if(ue.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,b.width,b.height,$,oe,b.data);else{ue.sort((F,ie)=>F.start-ie.start);let ge=0;for(let F=1;F<ue.length;F++){const ie=ue[ge],J=ue[F],pe=ie.start+ie.count,he=_e(J.start,b.width,4),de=_e(ie.start,b.width,4);J.start<=pe+1&&he===de&&_e(J.start+J.count-1,b.width,4)===he?ie.count=Math.max(ie.count,J.start+J.count-ie.start):(++ge,ue[ge]=J)}ue.length=ge+1;const ee=t.getParameter(n.UNPACK_ROW_LENGTH),te=t.getParameter(n.UNPACK_SKIP_PIXELS),fe=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,b.width);for(let F=0,ie=ue.length;F<ie;F++){const J=ue[F],pe=Math.floor(J.start/4),he=Math.ceil(J.count/4),de=pe%b.width,Le=Math.floor(pe/b.width),Ve=he,ce=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,de),t.pixelStorei(n.UNPACK_SKIP_ROWS,Le),t.texSubImage2D(n.TEXTURE_2D,0,de,Le,Ve,ce,$,oe,b.data)}N.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,ee),t.pixelStorei(n.UNPACK_SKIP_PIXELS,te),t.pixelStorei(n.UNPACK_SKIP_ROWS,fe)}}function st(N,b,$){let oe=n.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(oe=n.TEXTURE_2D_ARRAY),b.isData3DTexture&&(oe=n.TEXTURE_3D);const ne=se(N,b),ue=b.source;t.bindTexture(oe,N.__webglTexture,n.TEXTURE0+$);const ge=i.get(ue);if(ue.version!==ge.__version||ne===!0){if(t.activeTexture(n.TEXTURE0+$),(typeof ImageBitmap<"u"&&b.image instanceof ImageBitmap)===!1){const ce=je.getPrimaries(je.workingColorSpace),Ne=b.colorSpace===Sn?null:je.getPrimaries(b.colorSpace),He=b.colorSpace===Sn||ce===Ne?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,b.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,He)}t.pixelStorei(n.UNPACK_ALIGNMENT,b.unpackAlignment);let te=y(b.image,!1,s.maxTextureSize);te=Ue(b,te);const fe=r.convert(b.format,b.colorSpace),F=r.convert(b.type);let ie=M(b.internalFormat,fe,F,b.normalized,b.colorSpace,b.isVideoTexture);De(oe,b);let J;const pe=b.mipmaps,he=b.isVideoTexture!==!0,de=ge.__version===void 0||ne===!0,Le=ue.dataReady,Ve=x(b,te);if(b.isDepthTexture)ie=g(b.format===bn,b.type),de&&(he?t.texStorage2D(n.TEXTURE_2D,1,ie,te.width,te.height):t.texImage2D(n.TEXTURE_2D,0,ie,te.width,te.height,0,fe,F,null));else if(b.isDataTexture)if(pe.length>0){he&&de&&t.texStorage2D(n.TEXTURE_2D,Ve,ie,pe[0].width,pe[0].height);for(let ce=0,Ne=pe.length;ce<Ne;ce++)J=pe[ce],he?Le&&t.texSubImage2D(n.TEXTURE_2D,ce,0,0,J.width,J.height,fe,F,J.data):t.texImage2D(n.TEXTURE_2D,ce,ie,J.width,J.height,0,fe,F,J.data);b.generateMipmaps=!1}else he?(de&&t.texStorage2D(n.TEXTURE_2D,Ve,ie,te.width,te.height),Le&&Ce(b,te,fe,F)):t.texImage2D(n.TEXTURE_2D,0,ie,te.width,te.height,0,fe,F,te.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){he&&de&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ve,ie,pe[0].width,pe[0].height,te.depth);for(let ce=0,Ne=pe.length;ce<Ne;ce++)if(J=pe[ce],b.format!==gi)if(fe!==null)if(he){if(Le)if(b.layerUpdates.size>0){const He=Gh(J.width,J.height,b.format,b.type);for(const ye of b.layerUpdates){const rt=J.data.subarray(ye*He/J.data.BYTES_PER_ELEMENT,(ye+1)*He/J.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ce,0,0,ye,J.width,J.height,1,fe,rt)}}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ce,0,0,0,J.width,J.height,te.depth,fe,J.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,ce,ie,J.width,J.height,te.depth,0,J.data,0,0);else Pe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else he?Le&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,ce,0,0,0,J.width,J.height,te.depth,fe,F,J.data):t.texImage3D(n.TEXTURE_2D_ARRAY,ce,ie,J.width,J.height,te.depth,0,fe,F,J.data);b.layerUpdates.size>0&&b.clearLayerUpdates()}else{he&&de&&t.texStorage2D(n.TEXTURE_2D,Ve,ie,pe[0].width,pe[0].height);for(let ce=0,Ne=pe.length;ce<Ne;ce++)J=pe[ce],b.format!==gi?fe!==null?he?Le&&t.compressedTexSubImage2D(n.TEXTURE_2D,ce,0,0,J.width,J.height,fe,J.data):t.compressedTexImage2D(n.TEXTURE_2D,ce,ie,J.width,J.height,0,J.data):Pe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):he?Le&&t.texSubImage2D(n.TEXTURE_2D,ce,0,0,J.width,J.height,fe,F,J.data):t.texImage2D(n.TEXTURE_2D,ce,ie,J.width,J.height,0,fe,F,J.data)}else if(b.isDataArrayTexture)if(he){if(de&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ve,ie,te.width,te.height,te.depth),Le)if(b.layerUpdates.size>0){const ce=Gh(te.width,te.height,b.format,b.type);for(const Ne of b.layerUpdates){const He=te.data.subarray(Ne*ce/te.data.BYTES_PER_ELEMENT,(Ne+1)*ce/te.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Ne,te.width,te.height,1,fe,F,He)}b.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,te.width,te.height,te.depth,fe,F,te.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,ie,te.width,te.height,te.depth,0,fe,F,te.data);else if(b.isData3DTexture)he?(de&&t.texStorage3D(n.TEXTURE_3D,Ve,ie,te.width,te.height,te.depth),Le&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,te.width,te.height,te.depth,fe,F,te.data)):t.texImage3D(n.TEXTURE_3D,0,ie,te.width,te.height,te.depth,0,fe,F,te.data);else if(b.isFramebufferTexture){if(de)if(he)t.texStorage2D(n.TEXTURE_2D,Ve,ie,te.width,te.height);else{let ce=te.width,Ne=te.height;for(let He=0;He<Ve;He++)t.texImage2D(n.TEXTURE_2D,He,ie,ce,Ne,0,fe,F,null),ce>>=1,Ne>>=1}}else if(b.isHTMLTexture){if("texElementImage2D"in n){const ce=n.canvas;if(ce.hasAttribute("layoutsubtree")||ce.setAttribute("layoutsubtree","true"),te.parentNode!==ce){ce.appendChild(te),f.add(b),ce.onpaint=Ne=>{const He=Ne.changedElements;for(const ye of f)He.includes(ye.image)&&(ye.needsUpdate=!0)},ce.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,te);else{const He=n.RGBA,ye=n.RGBA,rt=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,He,ye,rt,te)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(pe.length>0){if(he&&de){const ce=Oe(pe[0]);t.texStorage2D(n.TEXTURE_2D,Ve,ie,ce.width,ce.height)}for(let ce=0,Ne=pe.length;ce<Ne;ce++)J=pe[ce],he?Le&&t.texSubImage2D(n.TEXTURE_2D,ce,0,0,fe,F,J):t.texImage2D(n.TEXTURE_2D,ce,ie,fe,F,J);b.generateMipmaps=!1}else if(he){if(de){const ce=Oe(te);t.texStorage2D(n.TEXTURE_2D,Ve,ie,ce.width,ce.height)}Le&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,fe,F,te)}else t.texImage2D(n.TEXTURE_2D,0,ie,fe,F,te);A(b)&&b.mipmapsAutoUpdate===!0&&R(oe),ge.__version=ue.version,b.onUpdate&&b.onUpdate(b)}N.__version=b.version}function kt(N,b,$){if(b.image.length!==6)return;const oe=se(N,b),ne=b.source;t.bindTexture(n.TEXTURE_CUBE_MAP,N.__webglTexture,n.TEXTURE0+$);const ue=i.get(ne);if(ne.version!==ue.__version||oe===!0){t.activeTexture(n.TEXTURE0+$);const ge=je.getPrimaries(je.workingColorSpace),ee=b.colorSpace===Sn?null:je.getPrimaries(b.colorSpace),te=b.colorSpace===Sn||ge===ee?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,b.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,b.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,te);const fe=b.isCompressedTexture||b.image[0].isCompressedTexture,F=b.image[0]&&b.image[0].isDataTexture,ie=[];for(let ye=0;ye<6;ye++)!fe&&!F?ie[ye]=y(b.image[ye],!0,s.maxCubemapSize):ie[ye]=F?b.image[ye].image:b.image[ye],ie[ye]=Ue(b,ie[ye]);const J=ie[0],pe=r.convert(b.format,b.colorSpace),he=r.convert(b.type);let de=M(b.internalFormat,pe,he,b.normalized,b.colorSpace);const Le=b.isVideoTexture!==!0,Ve=ue.__version===void 0||oe===!0,ce=ne.dataReady;let Ne=x(b,J);De(n.TEXTURE_CUBE_MAP,b);let He;if(b.isDepthTexture){if(de=g(b.format===bn,b.type),Ve)if(Le)t.texStorage2D(n.TEXTURE_CUBE_MAP,1,de,J.width,J.height);else for(let ye=0;ye<6;ye++)t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,de,J.width,J.height,0,pe,he,null)}else if(fe){Le&&Ve&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Ne,de,J.width,J.height);for(let ye=0;ye<6;ye++){He=ie[ye].mipmaps;for(let rt=0;rt<He.length;rt++){const Rt=He[rt];b.format!==gi?pe!==null?Le?ce&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,rt,0,0,Rt.width,Rt.height,pe,Rt.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,rt,de,Rt.width,Rt.height,0,Rt.data):Pe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Le?ce&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,rt,0,0,Rt.width,Rt.height,pe,he,Rt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,rt,de,Rt.width,Rt.height,0,pe,he,Rt.data)}}}else{if(He=b.mipmaps,Le&&Ve){He.length>0&&Ne++;const ye=Oe(ie[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Ne,de,ye.width,ye.height)}for(let ye=0;ye<6;ye++)if(F){Le?ce&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,0,0,ie[ye].width,ie[ye].height,pe,he,ie[ye].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,de,ie[ye].width,ie[ye].height,0,pe,he,ie[ye].data);for(let rt=0;rt<He.length;rt++){const ln=He[rt].image[ye].image;Le?ce&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,rt+1,0,0,ln.width,ln.height,pe,he,ln.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,rt+1,de,ln.width,ln.height,0,pe,he,ln.data)}}else{Le?ce&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,0,0,pe,he,ie[ye]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,de,pe,he,ie[ye]);for(let rt=0;rt<He.length;rt++){const Rt=He[rt];Le?ce&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,rt+1,0,0,pe,he,Rt.image[ye]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,rt+1,de,pe,he,Rt.image[ye])}}}A(b)&&b.mipmapsAutoUpdate===!0&&R(n.TEXTURE_CUBE_MAP),ue.__version=ne.version,b.onUpdate&&b.onUpdate(b)}N.__version=b.version}function _t(N,b,$,oe,ne,ue){const ge=r.convert($.format,$.colorSpace),ee=r.convert($.type),te=M($.internalFormat,ge,ee,$.normalized,$.colorSpace),fe=i.get(b),F=i.get($);if(F.__renderTarget=b,!fe.__hasExternalTextures){const ie=Math.max(1,b.width>>ue),J=Math.max(1,b.height>>ue);ne===n.TEXTURE_3D||ne===n.TEXTURE_2D_ARRAY?t.texImage3D(ne,ue,te,ie,J,b.depth,0,ge,ee,null):t.texImage2D(ne,ue,te,ie,J,0,ge,ee,null)}t.bindFramebuffer(n.FRAMEBUFFER,N),xe(b)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,oe,ne,F.__webglTexture,0,vt(b)):(ne===n.TEXTURE_2D||ne>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ne<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,oe,ne,F.__webglTexture,ue),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Li(N,b,$){if(n.bindRenderbuffer(n.RENDERBUFFER,N),b.depthBuffer){const oe=b.depthTexture,ne=oe&&oe.isDepthTexture?oe.type:null,ue=g(b.stencilBuffer,ne),ge=b.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;xe(b)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,vt(b),ue,b.width,b.height):$?n.renderbufferStorageMultisample(n.RENDERBUFFER,vt(b),ue,b.width,b.height):n.renderbufferStorage(n.RENDERBUFFER,ue,b.width,b.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,ge,n.RENDERBUFFER,N)}else{const oe=b.textures;for(let ne=0;ne<oe.length;ne++){const ue=oe[ne],ge=r.convert(ue.format,ue.colorSpace),ee=r.convert(ue.type),te=M(ue.internalFormat,ge,ee,ue.normalized,ue.colorSpace);xe(b)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,vt(b),te,b.width,b.height):$?n.renderbufferStorageMultisample(n.RENDERBUFFER,vt(b),te,b.width,b.height):n.renderbufferStorage(n.RENDERBUFFER,te,b.width,b.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Ct(N,b,$){const oe=b.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,N),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const ne=i.get(b.depthTexture);ne.__renderTarget=b;const ue=oe?b.depthTexture.image[0]:b.depthTexture.image;(!ne.__webglTexture||ue.width!==b.width||ue.height!==b.height)&&(ue.width=b.width,ue.height=b.height,b.depthTexture.needsUpdate=!0),oe?ae(b.depthTexture,0):j(b.depthTexture,0);const ge=ne.__webglTexture,ee=vt(b),te=oe?n.TEXTURE_CUBE_MAP_POSITIVE_X+$:n.TEXTURE_2D,fe=b.depthTexture.format===bn?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(b.depthTexture.format===En)xe(b)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,fe,te,ge,0,ee):n.framebufferTexture2D(n.FRAMEBUFFER,fe,te,ge,0);else if(b.depthTexture.format===bn)xe(b)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,fe,te,ge,0,ee):n.framebufferTexture2D(n.FRAMEBUFFER,fe,te,ge,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function si(N){const b=i.get(N),$=N.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==N.depthTexture){const oe=N.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),oe){const ne=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,oe.removeEventListener("dispose",ne)};oe.addEventListener("dispose",ne),b.__depthDisposeCallback=ne}b.__boundDepthTexture=oe}if(N.depthTexture&&!b.__autoAllocateDepthBuffer)if($)for(let oe=0;oe<6;oe++)Ct(b.__webglFramebuffer[oe],N,oe);else N.texture.mipmaps.length>0?Ct(b.__webglFramebuffer[0],N,0):Ct(b.__webglFramebuffer,N,0);else if($){b.__webglDepthbuffer=[];for(let oe=0;oe<6;oe++)if(t.bindFramebuffer(n.FRAMEBUFFER,b.__webglFramebuffer[oe]),b.__webglDepthbuffer[oe]===void 0)b.__webglDepthbuffer[oe]=n.createRenderbuffer(),Li(b.__webglDepthbuffer[oe],N,!1);else{const ne=N.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ue=b.__webglDepthbuffer[oe];n.bindRenderbuffer(n.RENDERBUFFER,ue),n.framebufferRenderbuffer(n.FRAMEBUFFER,ne,n.RENDERBUFFER,ue)}}else if(N.texture.mipmaps.length>0?t.bindFramebuffer(n.FRAMEBUFFER,b.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=n.createRenderbuffer(),Li(b.__webglDepthbuffer,N,!1);else{const ne=N.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ue=b.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ue),n.framebufferRenderbuffer(n.FRAMEBUFFER,ne,n.RENDERBUFFER,ue)}t.bindFramebuffer(n.FRAMEBUFFER,null)}function ri(N,b,$){const oe=i.get(N);b!==void 0&&_t(oe.__webglFramebuffer,N,N.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),$!==void 0&&si(N)}function ai(N){const b=N.texture,$=i.get(N),oe=i.get(b);N.addEventListener("dispose",U),P(N);const ne=N.textures,ue=N.isWebGLCubeRenderTarget===!0,ge=ne.length>1;if(ge||(oe.__webglTexture===void 0&&(oe.__webglTexture=n.createTexture()),oe.__version=b.version,a.memory.textures++),ue){$.__webglFramebuffer=[];for(let ee=0;ee<6;ee++)if(b.mipmaps.length>0){$.__webglFramebuffer[ee]=[];for(let te=0;te<b.mipmaps.length;te++)$.__webglFramebuffer[ee][te]=n.createFramebuffer()}else $.__webglFramebuffer[ee]=n.createFramebuffer()}else{if(b.mipmaps.length>0){$.__webglFramebuffer=[];for(let ee=0;ee<b.mipmaps.length;ee++)$.__webglFramebuffer[ee]=n.createFramebuffer()}else $.__webglFramebuffer=n.createFramebuffer();if(ge)for(let ee=0,te=ne.length;ee<te;ee++){const fe=i.get(ne[ee]);fe.__webglTexture===void 0&&(fe.__webglTexture=n.createTexture(),a.memory.textures++)}if(N.samples>0&&xe(N)===!1){$.__webglMultisampledFramebuffer=n.createFramebuffer(),$.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,$.__webglMultisampledFramebuffer);for(let ee=0;ee<ne.length;ee++){const te=ne[ee];$.__webglColorRenderbuffer[ee]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,$.__webglColorRenderbuffer[ee]);const fe=r.convert(te.format,te.colorSpace),F=r.convert(te.type),ie=M(te.internalFormat,fe,F,te.normalized,te.colorSpace,N.isXRRenderTarget===!0),J=vt(N);n.renderbufferStorageMultisample(n.RENDERBUFFER,J,ie,N.width,N.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ee,n.RENDERBUFFER,$.__webglColorRenderbuffer[ee])}n.bindRenderbuffer(n.RENDERBUFFER,null),N.depthBuffer&&($.__webglDepthRenderbuffer=n.createRenderbuffer(),Li($.__webglDepthRenderbuffer,N,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ue){t.bindTexture(n.TEXTURE_CUBE_MAP,oe.__webglTexture),De(n.TEXTURE_CUBE_MAP,b);for(let ee=0;ee<6;ee++)if(b.mipmaps.length>0)for(let te=0;te<b.mipmaps.length;te++)_t($.__webglFramebuffer[ee][te],N,b,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,te);else _t($.__webglFramebuffer[ee],N,b,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0);A(b)?R(n.TEXTURE_CUBE_MAP):b.mipmaps.length>0&&n.texParameteri(n.TEXTURE_CUBE_MAP,n.TEXTURE_MAX_LEVEL,b.mipmaps.length-1),t.unbindTexture()}else if(ge){for(let ee=0,te=ne.length;ee<te;ee++){const fe=ne[ee],F=i.get(fe);let ie=n.TEXTURE_2D;(N.isWebGL3DRenderTarget||N.isWebGLArrayRenderTarget)&&(ie=N.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ie,F.__webglTexture),De(ie,fe),_t($.__webglFramebuffer,N,fe,n.COLOR_ATTACHMENT0+ee,ie,0),A(fe)&&R(ie)}t.unbindTexture()}else{let ee=n.TEXTURE_2D;if((N.isWebGL3DRenderTarget||N.isWebGLArrayRenderTarget)&&(ee=N.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ee,oe.__webglTexture),De(ee,b),b.mipmaps.length>0)for(let te=0;te<b.mipmaps.length;te++)_t($.__webglFramebuffer[te],N,b,n.COLOR_ATTACHMENT0,ee,te);else _t($.__webglFramebuffer,N,b,n.COLOR_ATTACHMENT0,ee,0);A(b)?R(ee):b.mipmaps.length>0&&n.texParameteri(ee,n.TEXTURE_MAX_LEVEL,b.mipmaps.length-1),t.unbindTexture()}N.depthBuffer&&si(N)}function V(N){const b=N.textures;for(let $=0,oe=b.length;$<oe;$++){const ne=b[$];if(A(ne)&&ne.mipmapsAutoUpdate===!0){const ue=S(N),ge=i.get(ne).__webglTexture;t.bindTexture(ue,ge),R(ue),t.unbindTexture()}}}const oi=[];function gt(N){if(N.samples>0){if(xe(N)===!1){const b=N.textures,$=N.width,oe=N.height;let ne=n.COLOR_BUFFER_BIT;const ue=N.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ge=i.get(N),ee=b.length>1;if(ee)for(let fe=0;fe<b.length;fe++)t.bindFramebuffer(n.FRAMEBUFFER,ge.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+fe,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,ge.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+fe,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,ge.__webglMultisampledFramebuffer),N.texture.mipmaps.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ge.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ge.__webglFramebuffer);for(let fe=0;fe<b.length;fe++){if(N.resolveDepthBuffer&&(N.depthBuffer&&(ne|=n.DEPTH_BUFFER_BIT),N.stencilBuffer&&N.resolveStencilBuffer&&(ne|=n.STENCIL_BUFFER_BIT)),ee){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,ge.__webglColorRenderbuffer[fe]);const F=i.get(b[fe]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,F,0)}n.blitFramebuffer(0,0,$,oe,0,0,$,oe,ne,n.NEAREST),l===!0&&(oi.length=0,oi.push(n.COLOR_ATTACHMENT0+fe),N.depthBuffer&&N.storeMultisampledDepthBuffer===!1&&oi.push(ue),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,oi))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ee)for(let fe=0;fe<b.length;fe++){t.bindFramebuffer(n.FRAMEBUFFER,ge.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+fe,n.RENDERBUFFER,ge.__webglColorRenderbuffer[fe]);const F=i.get(b[fe]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,ge.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+fe,n.TEXTURE_2D,F,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ge.__webglMultisampledFramebuffer)}else if(N.depthBuffer&&N.storeMultisampledDepthBuffer===!1&&l){const b=N.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[b])}}}function vt(N){return Math.min(s.maxSamples,N.samples)}function xe(N){const b=i.get(N);return N.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function wt(N){const b=a.render.frame;h.get(N)!==b&&(h.set(N,b),N.update())}function Ue(N,b){const $=N.colorSpace,oe=N.format,ne=N.type;return N.isCompressedTexture===!0||N.isVideoTexture===!0||$!==or&&$!==Sn&&(je.getTransfer($)===at?(oe!==gi||ne!==jt)&&Pe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Fe("WebGLTextures: Unsupported texture color space:",$)),b}function Oe(N){return typeof HTMLImageElement<"u"&&N instanceof HTMLImageElement?(c.width=N.naturalWidth||N.width,c.height=N.naturalHeight||N.height):typeof VideoFrame<"u"&&N instanceof VideoFrame?(c.width=N.displayWidth,c.height=N.displayHeight):(c.width=N.width,c.height=N.height),c}this.allocateTextureUnit=Q,this.resetTextureUnits=H,this.getTextureUnits=W,this.setTextureUnits=K,this.setTexture2D=j,this.setTexture2DArray=re,this.setTexture3D=le,this.setTextureCube=ae,this.rebindTextures=ri,this.setupRenderTarget=ai,this.updateRenderTargetMipmap=V,this.updateMultisampleRenderTarget=gt,this.setupDepthRenderbuffer=si,this.setupFrameBufferTexture=_t,this.useMultisampledRTT=xe,this.dispose=O}function nS(n,e){function t(i,s=Sn){let r;const a=je.getTransfer(s);if(i===jt)return n.UNSIGNED_BYTE;if(i===Xl)return n.UNSIGNED_SHORT_4_4_4_4;if(i===$l)return n.UNSIGNED_SHORT_5_5_5_1;if(i===sd)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===rd)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===id)return n.BYTE;if(i===nd)return n.SHORT;if(i===ar)return n.UNSIGNED_SHORT;if(i===Wl)return n.INT;if(i===ki)return n.UNSIGNED_INT;if(i===mi)return n.FLOAT;if(i===Bi)return n.HALF_FLOAT;if(i===ad)return n.ALPHA;if(i===od)return n.RGB;if(i===gi)return n.RGBA;if(i===En)return n.DEPTH_COMPONENT;if(i===bn)return n.DEPTH_STENCIL;if(i===Na)return n.RED;if(i===ql)return n.RED_INTEGER;if(i===Hn)return n.RG;if(i===Yl)return n.RG_INTEGER;if(i===Kl)return n.RGBA_INTEGER;if(i===aa||i===oa||i===la||i===ca)if(a===at)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===aa)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===oa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===la)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===ca)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===aa)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===oa)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===la)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===ca)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===il||i===nl||i===sl||i===rl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===il)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===nl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===sl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===rl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===al||i===ol||i===ll||i===cl||i===hl||i===xa||i===ul)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===al||i===ol)return a===at?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===ll)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===cl)return r.COMPRESSED_R11_EAC;if(i===hl)return r.COMPRESSED_SIGNED_R11_EAC;if(i===xa)return r.COMPRESSED_RG11_EAC;if(i===ul)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===dl||i===fl||i===pl||i===ml||i===gl||i===vl||i===_l||i===xl||i===yl||i===Sl||i===Ml||i===bl||i===wl||i===El)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===dl)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===fl)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===pl)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===ml)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===gl)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===vl)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===_l)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===xl)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===yl)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Sl)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Ml)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===bl)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===wl)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===El)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Tl||i===Al||i===Cl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===Tl)return a===at?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Al)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Cl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Rl||i===Pl||i===ya||i===Il)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Rl)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Pl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===ya)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Il)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Ss?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const sS=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,rS=`
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

}`;class aS{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new wd(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Vn({vertexShader:sS,fragmentShader:rS,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new vi(new Fa(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class oS extends An{constructor(e,t){super();const i=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,f=null,u=null,d=null,p=null;const _=typeof XRWebGLBinding<"u",m=new aS,v={},y=t.getContextAttributes();let A=null,R=null;const S=[],M=[],g=new Je;let x=null,P=null;const T=new fi;T.viewport=new lt;const I=new fi;I.viewport=new lt;const U=[T,I],D=new o0;let w=null,O=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(G){let j=S[G];return j===void 0&&(j=new fo,S[G]=j),j.getTargetRaySpace()},this.getControllerGrip=function(G){let j=S[G];return j===void 0&&(j=new fo,S[G]=j),j.getGripSpace()},this.getHand=function(G){let j=S[G];return j===void 0&&(j=new fo,S[G]=j),j.getHandSpace()};function B(G){const j=M.indexOf(G.inputSource);if(j===-1)return;const re=S[j];re!==void 0&&(re.update(G.inputSource,G.frame,c||a),re.dispatchEvent({type:G.type,data:G.inputSource}))}function z(){s.removeEventListener("select",B),s.removeEventListener("selectstart",B),s.removeEventListener("selectend",B),s.removeEventListener("squeeze",B),s.removeEventListener("squeezestart",B),s.removeEventListener("squeezeend",B),s.removeEventListener("end",z),s.removeEventListener("inputsourceschange",L);for(let G=0;G<S.length;G++){const j=M[G];j!==null&&(M[G]=null,S[G].disconnect(j))}w=null,O=null,m.reset();for(const G in v)delete v[G];if(e.setRenderTarget(A),d=null,u=null,f=null,s=null,R=null,Q.stop(),i.isPresenting=!1,e.setPixelRatio(x),e.setSize(g.width,g.height,!1),P!==null){const G=P.camera;G.fov=P.fov,G.zoom=P.zoom,G.updateProjectionMatrix(),P=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(G){r=G,i.isPresenting===!0&&Pe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(G){o=G,i.isPresenting===!0&&Pe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(G){c=G},this.getBaseLayer=function(){return u!==null?u:d},this.getBinding=function(){return f===null&&_&&(f=new XRWebGLBinding(s,t)),f},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(G){if(s=G,s!==null){if(A=e.getRenderTarget(),s.addEventListener("select",B),s.addEventListener("selectstart",B),s.addEventListener("selectend",B),s.addEventListener("squeeze",B),s.addEventListener("squeezestart",B),s.addEventListener("squeezeend",B),s.addEventListener("end",z),s.addEventListener("inputsourceschange",L),y.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(g),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let re=null,le=null,ae=null;y.depth&&(ae=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,re=y.stencil?bn:En,le=y.stencil?Ss:ki);const Ie={colorFormat:t.RGBA8,depthFormat:ae,scaleFactor:r};f=this.getBinding(),u=f.createProjectionLayer(Ie),s.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),R=new Oi(u.textureWidth,u.textureHeight,{format:gi,type:jt,depthTexture:new ws(u.textureWidth,u.textureHeight,le,void 0,void 0,void 0,void 0,void 0,void 0,re),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{const re={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,t,re),s.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),R=new Oi(d.framebufferWidth,d.framebufferHeight,{format:gi,type:jt,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}R.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Q.setContext(s),Q.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function L(G){for(let j=0;j<G.removed.length;j++){const re=G.removed[j],le=M.indexOf(re);le>=0&&(M[le]=null,S[le].disconnect(re))}for(let j=0;j<G.added.length;j++){const re=G.added[j];let le=M.indexOf(re);if(le===-1){for(let Ie=0;Ie<S.length;Ie++)if(Ie>=M.length){M.push(re),le=Ie;break}else if(M[Ie]===null){M[Ie]=re,le=Ie;break}if(le===-1)break}const ae=S[le];ae&&ae.connect(re)}}function C(G,j){j===null?G.matrixWorld.copy(G.matrix):G.matrixWorld.multiplyMatrices(j.matrixWorld,G.matrix),G.matrixWorldInverse.copy(G.matrixWorld).invert()}this.updateCamera=function(G){if(s===null)return;let j=G.near,re=G.far;m.texture!==null&&(m.depthNear>0&&(j=m.depthNear),m.depthFar>0&&(re=m.depthFar)),D.near=I.near=T.near=j,D.far=I.far=T.far=re,(w!==D.near||O!==D.far)&&(s.updateRenderState({depthNear:D.near,depthFar:D.far}),w=D.near,O=D.far),D.layers.mask=G.layers.mask|6,T.layers.mask=D.layers.mask&-5,I.layers.mask=D.layers.mask&-3;const le=G.parent,ae=D.cameras;C(D,le);for(let Ie=0;Ie<ae.length;Ie++)C(ae[Ie],le);D.projectionMatrix.copy(T.projectionMatrix),D.projectionMatrixInverse.copy(T.projectionMatrixInverse),P===null&&G.isPerspectiveCamera&&(P={camera:G,fov:G.fov,zoom:G.zoom}),H(G,D,le)};function H(G,j,re){re===null?G.matrix.copy(j.matrixWorld):(G.matrix.copy(re.matrixWorld),G.matrix.invert(),G.matrix.multiply(j.matrixWorld)),G.matrix.decompose(G.position,G.quaternion,G.scale),G.updateMatrixWorld(!0),G.projectionMatrix.copy(j.projectionMatrix),G.projectionMatrixInverse.copy(j.projectionMatrixInverse),G.isPerspectiveCamera&&(G.fov=Ms*2*Math.atan(1/G.projectionMatrix.elements[5]),G.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(!(u===null&&d===null))return l},this.setFoveation=function(G){l=G,u!==null&&(u.fixedFoveation=G),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=G)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(D)},this.getCameraTexture=function(G){return v[G]};let W=null;function K(G,j){if(h=j.getViewerPose(c||a),p=j,h!==null){const re=h.views;d!==null&&(e.setRenderTargetFramebuffer(R,d.framebuffer),e.setRenderTarget(R));let le=!1;re.length!==D.cameras.length&&(D.cameras.length=0,le=!0);for(let Ee=0;Ee<re.length;Ee++){const De=re[Ee];let se=null;if(d!==null)se=d.getViewport(De);else{const Ce=f.getViewSubImage(u,De);se=Ce.viewport,Ee===0&&(e.setRenderTargetTextures(R,Ce.colorTexture,Ce.depthStencilTexture),e.setRenderTarget(R))}let _e=U[Ee];_e===void 0&&(_e=new fi,_e.layers.enable(Ee),_e.viewport=new lt,U[Ee]=_e),_e.matrix.fromArray(De.transform.matrix),_e.matrix.decompose(_e.position,_e.quaternion,_e.scale),_e.projectionMatrix.fromArray(De.projectionMatrix),_e.projectionMatrixInverse.copy(_e.projectionMatrix).invert(),_e.viewport.set(se.x,se.y,se.width,se.height),Ee===0&&(D.matrix.copy(_e.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),le===!0&&D.cameras.push(_e)}const ae=s.enabledFeatures;if(ae&&ae.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){f=i.getBinding();const Ee=f.getDepthInformation(re[0]);Ee&&Ee.isValid&&Ee.texture&&m.init(Ee,s.renderState)}if(ae&&ae.includes("camera-access")&&_){e.state.unbindTexture(),f=i.getBinding();for(let Ee=0;Ee<re.length;Ee++){const De=re[Ee].camera;if(De){let se=v[De];se||(se=new wd,v[De]=se);const _e=f.getCameraImage(De);se.sourceTexture=_e}}}}for(let re=0;re<S.length;re++){const le=M[re],ae=S[re];le!==null&&ae!==void 0&&ae.update(le,j,c||a)}W&&W(G,j),j.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:j}),p=null}const Q=new Id;Q.setAnimationLoop(K),this.setAnimationLoop=function(G){W=G},this.dispose=function(){}}}const lS=new qe,Hd=new ke;Hd.set(-1,0,0,0,1,0,0,0,1);function cS(n,e){function t(m,v){m.matrixAutoUpdate===!0&&m.updateMatrix(),v.value.copy(m.matrix)}function i(m,v){v.color.getRGB(m.fogColor.value,Ed(n)),v.isFog?(m.fogNear.value=v.near,m.fogFar.value=v.far):v.isFogExp2&&(m.fogDensity.value=v.density)}function s(m,v,y,A,R){v.isNodeMaterial?v.uniformsNeedUpdate=!1:v.isMeshBasicMaterial?r(m,v):v.isMeshLambertMaterial?(r(m,v),v.envMap&&(m.envMapIntensity.value=v.envMapIntensity)):v.isMeshToonMaterial?(r(m,v),f(m,v)):v.isMeshPhongMaterial?(r(m,v),h(m,v),v.envMap&&(m.envMapIntensity.value=v.envMapIntensity)):v.isMeshStandardMaterial?(r(m,v),u(m,v),v.isMeshPhysicalMaterial&&d(m,v,R)):v.isMeshMatcapMaterial?(r(m,v),p(m,v)):v.isMeshDepthMaterial?r(m,v):v.isMeshDistanceMaterial?(r(m,v),_(m,v)):v.isMeshNormalMaterial?r(m,v):v.isLineBasicMaterial?(a(m,v),v.isLineDashedMaterial&&o(m,v)):v.isPointsMaterial?l(m,v,y,A):v.isSpriteMaterial?c(m,v):v.isShadowMaterial?(m.color.value.copy(v.color),m.opacity.value=v.opacity):v.isShaderMaterial&&(v.uniformsNeedUpdate=!1)}function r(m,v){m.opacity.value=v.opacity,v.color&&m.diffuse.value.copy(v.color),v.emissive&&m.emissive.value.copy(v.emissive).multiplyScalar(v.emissiveIntensity),v.map&&(m.map.value=v.map,t(v.map,m.mapTransform)),v.alphaMap&&(m.alphaMap.value=v.alphaMap,t(v.alphaMap,m.alphaMapTransform)),v.bumpMap&&(m.bumpMap.value=v.bumpMap,t(v.bumpMap,m.bumpMapTransform),m.bumpScale.value=v.bumpScale,v.side===Jt&&(m.bumpScale.value*=-1)),v.normalMap&&(m.normalMap.value=v.normalMap,t(v.normalMap,m.normalMapTransform),m.normalScale.value.copy(v.normalScale),v.side===Jt&&m.normalScale.value.negate()),v.displacementMap&&(m.displacementMap.value=v.displacementMap,t(v.displacementMap,m.displacementMapTransform),m.displacementScale.value=v.displacementScale,m.displacementBias.value=v.displacementBias),v.emissiveMap&&(m.emissiveMap.value=v.emissiveMap,t(v.emissiveMap,m.emissiveMapTransform)),v.specularMap&&(m.specularMap.value=v.specularMap,t(v.specularMap,m.specularMapTransform)),v.alphaTest>0&&(m.alphaTest.value=v.alphaTest);const y=e.get(v),A=y.envMap,R=y.envMapRotation;A&&(m.envMap.value=A,m.envMapRotation.value.setFromMatrix4(lS.makeRotationFromEuler(R)).transpose(),A.isCubeTexture&&A.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Hd),m.reflectivity.value=v.reflectivity,m.ior.value=v.ior,m.refractionRatio.value=v.refractionRatio),v.lightMap&&(m.lightMap.value=v.lightMap,m.lightMapIntensity.value=v.lightMapIntensity,t(v.lightMap,m.lightMapTransform)),v.aoMap&&(m.aoMap.value=v.aoMap,m.aoMapIntensity.value=v.aoMapIntensity,t(v.aoMap,m.aoMapTransform))}function a(m,v){m.diffuse.value.copy(v.color),m.opacity.value=v.opacity,v.map&&(m.map.value=v.map,t(v.map,m.mapTransform))}function o(m,v){m.dashSize.value=v.dashSize,m.totalSize.value=v.dashSize+v.gapSize,m.scale.value=v.scale}function l(m,v,y,A){m.diffuse.value.copy(v.color),m.opacity.value=v.opacity,m.size.value=v.size*y,m.scale.value=A*.5,v.map&&(m.map.value=v.map,t(v.map,m.uvTransform)),v.alphaMap&&(m.alphaMap.value=v.alphaMap,t(v.alphaMap,m.alphaMapTransform)),v.alphaTest>0&&(m.alphaTest.value=v.alphaTest)}function c(m,v){m.diffuse.value.copy(v.color),m.opacity.value=v.opacity,m.rotation.value=v.rotation,v.map&&(m.map.value=v.map,t(v.map,m.mapTransform)),v.alphaMap&&(m.alphaMap.value=v.alphaMap,t(v.alphaMap,m.alphaMapTransform)),v.alphaTest>0&&(m.alphaTest.value=v.alphaTest)}function h(m,v){m.specular.value.copy(v.specular),m.shininess.value=Math.max(v.shininess,1e-4)}function f(m,v){v.gradientMap&&(m.gradientMap.value=v.gradientMap)}function u(m,v){m.metalness.value=v.metalness,v.metalnessMap&&(m.metalnessMap.value=v.metalnessMap,t(v.metalnessMap,m.metalnessMapTransform)),m.roughness.value=v.roughness,v.roughnessMap&&(m.roughnessMap.value=v.roughnessMap,t(v.roughnessMap,m.roughnessMapTransform)),v.envMap&&(m.envMapIntensity.value=v.envMapIntensity)}function d(m,v,y){m.ior.value=v.ior,v.diffuseRoughness>0&&(m.diffuseRoughness.value=v.diffuseRoughness,v.diffuseRoughnessMap&&(m.diffuseRoughnessMap.value=v.diffuseRoughnessMap,t(v.diffuseRoughnessMap,m.diffuseRoughnessMapTransform))),v.sheen>0&&(m.sheenColor.value.copy(v.sheenColor).multiplyScalar(v.sheen),m.sheenRoughness.value=v.sheenRoughness,v.sheenColorMap&&(m.sheenColorMap.value=v.sheenColorMap,t(v.sheenColorMap,m.sheenColorMapTransform)),v.sheenRoughnessMap&&(m.sheenRoughnessMap.value=v.sheenRoughnessMap,t(v.sheenRoughnessMap,m.sheenRoughnessMapTransform))),v.clearcoat>0&&(m.clearcoat.value=v.clearcoat,m.clearcoatRoughness.value=v.clearcoatRoughness,v.clearcoatMap&&(m.clearcoatMap.value=v.clearcoatMap,t(v.clearcoatMap,m.clearcoatMapTransform)),v.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=v.clearcoatRoughnessMap,t(v.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),v.clearcoatNormalMap&&(m.clearcoatNormalMap.value=v.clearcoatNormalMap,t(v.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(v.clearcoatNormalScale),v.side===Jt&&m.clearcoatNormalScale.value.negate())),v.dispersion>0&&(m.dispersion.value=v.dispersion),v.retroreflectivity>0&&(m.retroreflectivity.value=v.retroreflectivity),v.iridescence>0&&(m.iridescence.value=v.iridescence,m.iridescenceIOR.value=v.iridescenceIOR,m.iridescenceThicknessMinimum.value=v.iridescenceThicknessMinimum,m.iridescenceThicknessMaximum.value=v.iridescenceThicknessMaximum,v.iridescenceMap&&(m.iridescenceMap.value=v.iridescenceMap,t(v.iridescenceMap,m.iridescenceMapTransform)),v.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=v.iridescenceThicknessMap,t(v.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),v.transmission>0&&(m.transmission.value=v.transmission,m.transmissionSamplerMap.value=y.texture,m.transmissionSamplerSize.value.set(y.width,y.height),v.transmissionMap&&(m.transmissionMap.value=v.transmissionMap,t(v.transmissionMap,m.transmissionMapTransform)),m.thickness.value=v.thickness,v.thicknessMap&&(m.thicknessMap.value=v.thicknessMap,t(v.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=v.attenuationDistance,m.attenuationColor.value.copy(v.attenuationColor)),v.anisotropy>0&&(m.anisotropyVector.value.set(v.anisotropy*Math.cos(v.anisotropyRotation),v.anisotropy*Math.sin(v.anisotropyRotation)),v.anisotropyMap&&(m.anisotropyMap.value=v.anisotropyMap,t(v.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=v.specularIntensity,m.specularColor.value.copy(v.specularColor),v.specularColorMap&&(m.specularColorMap.value=v.specularColorMap,t(v.specularColorMap,m.specularColorMapTransform)),v.specularIntensityMap&&(m.specularIntensityMap.value=v.specularIntensityMap,t(v.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,v){v.matcap&&(m.matcap.value=v.matcap)}function _(m,v){const y=e.get(v).light;m.referencePosition.value.setFromMatrixPosition(y.matrixWorld),m.nearDistance.value=y.shadow.camera.near,m.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function hS(n,e,t,i){let s={},r={};function a(y,A){const R=A.program;i.uniformBlockBinding(y,R,s[y.id])}function o(y,A){let R=s[y.id];R===void 0&&(p(y),R=l(y),s[y.id]=R,y.addEventListener("dispose",m));const S=A.program;i.updateUBOMapping(y,S);const M=e.render.frame;r[y.id]!==M&&(c(y),r[y.id]=M)}function l(y){const A=n.createBuffer(),R=y.__size,S=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,A),n.bufferData(n.UNIFORM_BUFFER,R,S),n.bindBuffer(n.UNIFORM_BUFFER,null),A}function c(y){const A=s[y.id],R=y.uniforms,S=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,A);for(let M=0,g=R.length;M<g;M++){const x=R[M];if(Array.isArray(x))for(let P=0,T=x.length;P<T;P++)h(x[P],M,P,S);else h(x,M,0,S)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function h(y,A,R,S){if(u(y,A,R,S)===!0){const M=y.__offset,g=y.value;if(Array.isArray(g)){let x=0;for(let P=0;P<g.length;P++){const T=g[P],I=_(T,!0);f(T,y.__data,x),x+=I.storage/Float32Array.BYTES_PER_ELEMENT}}else f(g,y.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,M,y.__data)}}function f(y,A,R){typeof y=="number"||typeof y=="boolean"?A[R]=y:y.isMatrix3?(A[R]=y.elements[0],A[R+1]=y.elements[1],A[R+2]=y.elements[2],A[R+3]=0,A[R+4]=y.elements[3],A[R+5]=y.elements[4],A[R+6]=y.elements[5],A[R+7]=0,A[R+8]=y.elements[6],A[R+9]=y.elements[7],A[R+10]=y.elements[8],A[R+11]=0):ArrayBuffer.isView(y)?A.set(y.subarray(0,A.length-R),R):y.toArray(A,R)}function u(y,A,R,S){const M=y.value,g=A+"_"+R;if(Array.isArray(M)){S[g]===void 0&&(S[g]=[]);const x=S[g];let P=!1;for(let T=0;T<M.length;T++)d(M[T],x,T)===!0&&(P=!0);return P}return d(M,S,g)}function d(y,A,R){if(A[R]===void 0)return typeof y=="number"||typeof y=="boolean"?A[R]=y:ArrayBuffer.isView(y)?A[R]=y.slice():A[R]=y.clone(),!0;{const S=A[R];if(typeof y=="number"||typeof y=="boolean"){if(S!==y)return A[R]=y,!0}else{if(ArrayBuffer.isView(y))return!0;if(S.equals(y)===!1)return S.copy(y),!0}}return!1}function p(y){const A=y.uniforms;let R=0;const S=16;for(let g=0,x=A.length;g<x;g++){const P=Array.isArray(A[g])?A[g]:[A[g]];for(let T=0,I=P.length;T<I;T++){const U=P[T],D=Array.isArray(U.value)?U.value:[U.value],w=Array.isArray(A[g])||Array.isArray(U.value);let O=R;for(let z=0,L=D.length;z<L;z++){const C=D[z],H=_(C,w),W=R%S,K=W%H.boundary,Q=W+K;R+=K,Q!==0&&S-Q<H.storage&&(R+=S-Q),z===0&&(O=R),R+=H.storage}const B=U.type==="int"?Int32Array:U.type==="uint"?Uint32Array:Float32Array;U.__data=new B((R-O)/Float32Array.BYTES_PER_ELEMENT),U.__offset=O}}const M=R%S;return M>0&&(R+=S-M),y.__size=R,y.__cache={},this}function _(y,A){const R={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(R.boundary=4,R.storage=4):y.isVector2?(R.boundary=8,R.storage=8):y.isVector3||y.isColor?(R.boundary=16,R.storage=12):y.isVector4?(R.boundary=16,R.storage=16):y.isMatrix3?(R.boundary=16,R.storage=48):y.isMatrix4?(R.boundary=16,R.storage=64):y.isTexture?Pe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(R.boundary=16,R.storage=y.byteLength):Pe("WebGLRenderer: Unsupported uniform value type.",y),A===!0&&(R.boundary=16,R.storage=Math.ceil(R.storage/16)*16),R}function m(y){const A=y.target;A.removeEventListener("dispose",m),n.deleteBuffer(s[A.id]),delete s[A.id],delete r[A.id]}function v(){for(const y in s)n.deleteBuffer(s[y]);s={},r={}}return{bind:a,update:o,dispose:v}}const uS=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Di=null;function dS(){return Di===null&&(Di=new bs(uS,16,16,Hn,Bi),Di.name="DFG_LUT",Di.minFilter=Nt,Di.magFilter=Nt,Di.wrapS=ii,Di.wrapT=ii,Di.generateMipmaps=!1,Di.needsUpdate=!0),Di}class fS{constructor(e={}){const{canvas:t=zm(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:u=!1,outputBufferType:d=jt}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=a;const _=d,m=new Set([Kl,Yl,ql]),v=new Set([jt,ki,ar,Ss,Xl,$l]),y=new Uint32Array(4),A=new Int32Array(4),R={textures:[],min:[],max:[],resolution:[]};let S=null,M=null;const g=[],x=[];let P=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=nn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const T=this;let I=!1,U=null,D=null,w=null,O=null;this._outputColorSpace=di;let B=0,z=0,L=null,C=-1,H=null;const W=new lt,K=new lt;let Q=null;const G=new We(0);let j=0,re=t.width,le=t.height,ae=1,Ie=null,it=null;const Ee=new lt(0,0,re,le),De=new lt(0,0,re,le);let se=!1;const _e=new hr,Ce=new tc;let st=!1,kt=!1;const _t=new qe,Li=new Y,Ct=new lt,si={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ri=!1;function ai(){return L===null?ae:1}let V=i;function oi(E,k){return t.getContext(E,k)}let gt,vt,xe,wt,Ue,Oe,N,b,$,oe,ne,ue,ge,ee,te,fe,F,ie,J,pe,he,de,Le;try{const E={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Gl}`),t.addEventListener("webglcontextlost",Ne,!1),t.addEventListener("webglcontextrestored",He,!1),t.addEventListener("webglcontextcreationerror",ye,!1),V===null){const k="webgl2";if(V=oi(k,E),V===null)throw oi(k)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ve()}catch(E){throw t.removeEventListener("webglcontextlost",Ne,!1),t.removeEventListener("webglcontextrestored",He,!1),t.removeEventListener("webglcontextcreationerror",ye,!1),Fe("WebGLRenderer: "+E.message),E}function Ve(){gt=new gx(V),gt.init(),he=new nS(V,gt),vt=new rx(V,gt,e,he),xe=new tS(V,gt),vt.reversedDepthBuffer&&u&&xe.buffers.depth.setReversed(!0),D=V.createFramebuffer(),w=V.createFramebuffer(),O=V.createFramebuffer(),wt=new xx(V),Ue=new Hy,Oe=new iS(V,gt,xe,Ue,vt,he,wt),N=new mx(T),b=new S0(V),de=new nx(V,b),$=new vx(V,b,wt,de),oe=new Sx(V,$,b,de,wt),ie=new yx(V,vt,Oe),te=new ax(Ue),ne=new zy(T,N,gt,vt,de,te),ue=new cS(T,Ue),ge=new Gy,ee=new Ky(gt),F=new ix(T,N,xe,oe,p,l),fe=new eS(T,oe,vt),Le=new hS(V,wt,vt,xe),J=new sx(V,gt,wt),pe=new _x(V,gt,wt),wt.programs=ne.programs,T.capabilities=vt,T.extensions=gt,T.properties=Ue,T.renderLists=ge,T.shadowMap=fe,T.state=xe,T.info=wt}_!==jt&&(P=new bx(_,t.width,t.height,o,s,r));const ce=new oS(T,V);this.xr=ce,this.getContext=function(){return V},this.getContextAttributes=function(){return V.getContextAttributes()},this.forceContextLoss=function(){const E=gt.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=gt.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return ae},this.setPixelRatio=function(E){E!==void 0&&(ae=E,this.setSize(re,le,!1))},this.getSize=function(E){return E.set(re,le)},this.setSize=function(E,k,Z=!0){if(ce.isPresenting){Pe("WebGLRenderer: Can't change size while VR device is presenting.");return}re=E,le=k,t.width=Math.floor(E*ae),t.height=Math.floor(k*ae),Z===!0&&(t.style.width=E+"px",t.style.height=k+"px"),P!==null&&P.setSize(t.width,t.height),this.setViewport(0,0,E,k)},this.getDrawingBufferSize=function(E){return E.set(re*ae,le*ae).floor()},this.setDrawingBufferSize=function(E,k,Z){re=E,le=k,ae=Z,t.width=Math.floor(E*Z),t.height=Math.floor(k*Z),this.setViewport(0,0,E,k)},this.setEffects=function(E){if(_===jt){Fe("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(E){for(let k=0;k<E.length;k++)if(E[k].isOutputPass===!0){Pe("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}P.setEffects(E||[])},this.getCurrentViewport=function(E){return E.copy(W)},this.getViewport=function(E){return E.copy(Ee)},this.setViewport=function(E,k,Z,X){E.isVector4?Ee.set(E.x,E.y,E.z,E.w):Ee.set(E,k,Z,X),xe.viewport(W.copy(Ee).multiplyScalar(ai()).round())},this.getScissor=function(E){return E.copy(De)},this.setScissor=function(E,k,Z,X){E.isVector4?De.set(E.x,E.y,E.z,E.w):De.set(E,k,Z,X),xe.scissor(K.copy(De).multiplyScalar(ai()).round())},this.getScissorTest=function(){return se},this.setScissorTest=function(E){xe.setScissorTest(se=E)},this.setOpaqueSort=function(E){Ie=E},this.setTransparentSort=function(E){it=E},this.getClearColor=function(E){return E.copy(F.getClearColor())},this.setClearColor=function(){F.setClearColor(...arguments)},this.getClearAlpha=function(){return F.getClearAlpha()},this.setClearAlpha=function(){F.setClearAlpha(...arguments)},this.clear=function(E=!0,k=!0,Z=!0){let X=0;if(E){let q=!1;if(L!==null){const ve=L.texture.format;q=m.has(ve)}if(q){const ve=L.texture.type,we=v.has(ve),me=F.getClearColor(),Me=F.getClearAlpha(),Re=me.r,Be=me.g,Ye=me.b;we?(y[0]=Re,y[1]=Be,y[2]=Ye,y[3]=Me,V.clearBufferuiv(V.COLOR,0,y)):(A[0]=Re,A[1]=Be,A[2]=Ye,A[3]=Me,V.clearBufferiv(V.COLOR,0,A))}else X|=V.COLOR_BUFFER_BIT}k&&(X|=V.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Z&&(X|=V.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),X!==0&&V.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(E){E.setRenderer(this),U=E},this.dispose=function(){t.removeEventListener("webglcontextlost",Ne,!1),t.removeEventListener("webglcontextrestored",He,!1),t.removeEventListener("webglcontextcreationerror",ye,!1),F.dispose(),ge.dispose(),ee.dispose(),Oe.dispose(),Ue.dispose(),N.dispose(),oe.dispose(),$.dispose(),de.dispose(),Le.dispose(),ne.dispose(),ce.dispose(),ce.removeEventListener("sessionstart",pc),ce.removeEventListener("sessionend",mc),Rn.stop()};function Ne(E){E.preventDefault(),Ea("WebGLRenderer: Context Lost."),I=!0}function He(){Ea("WebGLRenderer: Context Restored."),I=!1;const E=wt.autoReset,k=fe.enabled,Z=fe.autoUpdate,X=fe.needsUpdate,q=fe.type;Ve(),wt.autoReset=E,fe.enabled=k,fe.autoUpdate=Z,fe.needsUpdate=X,fe.type=q}function ye(E){Fe("WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function rt(E){const k=E.target;k.removeEventListener("dispose",rt),Rt(k)}function Rt(E){ln(E),Ue.remove(E)}function ln(E){const k=Ue.get(E).programs;k!==void 0&&(k.forEach(function(Z){ne.releaseProgram(Z)}),E.isShaderMaterial&&ne.releaseShaderCache(E))}this.renderBufferDirect=function(E,k,Z,X,q,ve){k===null&&(k=si);const we=q.isMesh&&q.matrixWorld.determinantAffine()<0,me=Wd(E,k,Z,X,q);xe.setMaterial(X,we);let Me=Z.index,Re=1;if(X.wireframe===!0){if(Me=$.getWireframeAttribute(Z),Me===void 0)return;Re=2}const Be=Z.drawRange,Ye=Z.attributes.position;let Te=Be.start*Re,Ke=(Be.start+Be.count)*Re;ve!==null&&(Te=Math.max(Te,ve.start*Re),Ke=Math.min(Ke,(ve.start+ve.count)*Re)),Me!==null?(Te=Math.max(Te,0),Ke=Math.min(Ke,Me.count)):Ye!=null&&(Te=Math.max(Te,0),Ke=Math.min(Ke,Ye.count));const St=Ke-Te;if(St<0||St===1/0)return;de.setup(q,X,me,Z,Me);let ut,ct=J;if(Me!==null&&(ut=b.get(Me),ct=pe,ct.setIndex(ut)),q.isMesh)X.wireframe===!0?(xe.setLineWidth(X.wireframeLinewidth*ai()),ct.setMode(V.LINES)):ct.setMode(V.TRIANGLES);else if(q.isLine){let Bt=X.linewidth;Bt===void 0&&(Bt=1),xe.setLineWidth(Bt*ai()),q.isLineSegments?ct.setMode(V.LINES):q.isLineLoop?ct.setMode(V.LINE_LOOP):ct.setMode(V.LINE_STRIP)}else q.isPoints?ct.setMode(V.POINTS):q.isSprite&&ct.setMode(V.TRIANGLES);if(q.isBatchedMesh)if(gt.get("WEBGL_multi_draw"))ct.renderMultiDraw(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount);else{const Bt=q._multiDrawStarts,Ae=q._multiDrawCounts,Gt=q._multiDrawCount,nt=Me?b.get(Me).bytesPerElement:1,Pn=Ue.get(X).currentProgram.getUniforms();for(let zt=0;zt<Gt;zt++)Pn.setValue(V,"_gl_DrawID",zt),ct.render(Bt[zt]/nt,Ae[zt])}else if(q.isInstancedMesh)ct.renderInstances(Te,St,q.count);else if(Z.isInstancedBufferGeometry){const Bt=Z._maxInstanceCount!==void 0?Z._maxInstanceCount:1/0,Ae=Math.min(Z.instanceCount,Bt);ct.renderInstances(Te,St,Ae)}else ct.render(Te,St)};function fc(E,k,Z,X){U!==null&&E.isNodeMaterial&&U.setObject(X,E),st===!0&&te.setState(E,Z,!1),E.transparent===!0&&E.side===Ci&&E.forceSinglePass===!1?(E.side=Jt,E.needsUpdate=!0,Ps(E,k,X),E.side=zn,E.needsUpdate=!0,Ps(E,k,X),E.side=Ci):Ps(E,k,X)}this.compile=function(E,k,Z=null){Z===null&&(Z=E),U!==null&&U.renderStart(E,k,Z),M=ee.get(Z),M.init(k),x.push(M),Z.traverseVisible(function(q){q.isLight&&q.layers.test(k.layers)&&(M.pushLight(q),q.castShadow&&M.pushShadow(q))}),E!==Z&&E.traverseVisible(function(q){q.isLight&&q.layers.test(k.layers)&&(M.pushLight(q),q.castShadow&&M.pushShadow(q))}),M.setupLights(),U!==null&&U.updateLights(M.state.lightsArray),kt=this.localClippingEnabled,st=te.init(this.clippingPlanes,kt),st===!0&&te.setGlobalState(this.clippingPlanes,k),U!==null&&fe.render(M.state.shadowsArray,Z,k);const X=new Set;return E.traverse(function(q){if(!(q.isMesh||q.isPoints||q.isLine||q.isSprite))return;const ve=q.material;if(ve)if(Array.isArray(ve))for(let we=0;we<ve.length;we++){const me=ve[we];fc(me,Z,k,q),X.add(me)}else fc(ve,Z,k,q),X.add(ve)}),M=x.pop(),U!==null&&U.renderEnd(),X},this.compileAsync=function(E,k,Z=null){const X=this.compile(E,k,Z);return new Promise(q=>{function ve(){if(X.forEach(function(we){const Me=Ue.get(we).currentProgram;(Me===void 0||Me.isReady())&&X.delete(we)}),X.size===0){q(E);return}setTimeout(ve,10)}gt.get("KHR_parallel_shader_compile")!==null?ve():setTimeout(ve,10)})};let za=null;function Vd(E){za&&za(E)}function pc(){Rn.stop()}function mc(){Rn.start()}const Rn=new Id;Rn.setAnimationLoop(Vd),typeof self<"u"&&Rn.setContext(self),this.setAnimationLoop=function(E){za=E,ce.setAnimationLoop(E),E===null?Rn.stop():Rn.start()},ce.addEventListener("sessionstart",pc),ce.addEventListener("sessionend",mc),this.render=function(E,k){if(k!==void 0&&k.isCamera!==!0){Fe("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;U!==null&&U.renderStart(E,k);const Z=ce.enabled===!0&&ce.isPresenting===!0,X=P!==null&&(L===null||Z)&&P.begin(T,L);if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),ce.enabled===!0&&ce.isPresenting===!0&&(P===null||P.isCompositing()===!1)&&(ce.cameraAutoUpdate===!0&&ce.updateCamera(k),k=ce.getCamera()),E.isScene===!0&&E.onBeforeRender(T,E,k,L),M=ee.get(E,x.length),M.init(k),M.state.textureUnits=Oe.getTextureUnits(),x.push(M),_t.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),k.isArrayCamera?Ce.setFromArrayCamera(k):_e.setFromProjectionMatrix(_t,Pi,k.reversedDepth),kt=this.localClippingEnabled,st=te.init(this.clippingPlanes,kt),S=ge.get(E,g.length),S.init(),g.push(S),this.info.render.frame++,ce.enabled===!0&&ce.isPresenting===!0){const we=T.xr.getDepthSensingMesh();we!==null&&Ha(we,k,-1/0,T.sortObjects)}Ha(E,k,0,T.sortObjects),S.finish(),U!==null&&U.updateLights(M.state.lightsArray),T.sortObjects===!0&&S.sort(Ie,it),ri=ce.enabled===!1||ce.isPresenting===!1||ce.hasDepthSensing()===!1,ri&&F.addToRenderList(S,E),this.info.autoReset===!0&&this.info.reset(),st===!0&&te.beginShadows();const q=M.state.shadowsArray;if(fe.render(q,E,k),st===!0&&te.endShadows(),(X&&P.hasRenderPass())===!1){const we=S.opaque,me=S.transmissive;if(M.setupLights(),k.isArrayCamera){const Me=k.cameras;if(me.length>0)for(let Re=0,Be=Me.length;Re<Be;Re++){const Ye=Me[Re];vc(we,me,E,Ye)}ri&&F.render(E);for(let Re=0,Be=Me.length;Re<Be;Re++){const Ye=Me[Re];gc(S,E,Ye,Ye.viewport)}}else me.length>0&&vc(we,me,E,k),ri&&F.render(E),gc(S,E,k)}L!==null&&z===0&&(Oe.updateMultisampleRenderTarget(L),Oe.updateRenderTargetMipmap(L)),X&&P.end(T),E.isScene===!0&&E.onAfterRender(T,E,k),de.resetDefaultState(),C=-1,H=null,x.pop(),x.length>0?(M=x[x.length-1],Oe.setTextureUnits(M.state.textureUnits),st===!0&&te.setGlobalState(T.clippingPlanes,M.state.camera)):M=null,g.pop(),g.length>0?S=g[g.length-1]:S=null,U!==null&&U.renderEnd()};function Ha(E,k,Z,X){if(E.visible===!1)return;if(E.layers.test(k.layers)){if(E.isGroup)Z=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(k);else if(E.isLight)M.pushLight(E),E.castShadow&&M.pushShadow(E);else if(E.isSprite){const we=k.isArrayCamera?Ce:_e;if(!E.frustumCulled||E.intersectsFrustum(we)){X&&Ct.setFromMatrixPosition(E.matrixWorld).applyMatrix4(_t);const me=oe.update(E),Me=E.material;Me.visible&&S.push(E,me,Me,Z,Ct.z,null,k)}}else if(E.isMesh||E.isLine||E.isPoints){const we=k.isArrayCamera?Ce:_e;if(!E.frustumCulled||E.intersectsFrustum(we)){const me=oe.update(E),Me=E.material;if(X&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Ct.copy(E.boundingSphere.center)):(me.boundingSphere===null&&me.computeBoundingSphere(),Ct.copy(me.boundingSphere.center)),Ct.applyMatrix4(E.matrixWorld).applyMatrix4(_t)),Array.isArray(Me)){const Re=me.groups;for(let Be=0,Ye=Re.length;Be<Ye;Be++){const Te=Re[Be],Ke=Me[Te.materialIndex];Ke&&Ke.visible&&S.push(E,me,Ke,Z,Ct.z,Te,k)}}else Me.visible&&S.push(E,me,Me,Z,Ct.z,null,k)}}}const ve=E.children;for(let we=0,me=ve.length;we<me;we++)Ha(ve[we],k,Z,X)}function gc(E,k,Z,X){const{opaque:q,transmissive:ve,transparent:we}=E;M.setupLightsView(Z),st===!0&&te.setGlobalState(T.clippingPlanes,Z),X&&xe.viewport(W.copy(X)),q.length>0&&mr(q,k,Z),ve.length>0&&mr(ve,k,Z),we.length>0&&mr(we,k,Z),xe.buffers.depth.setTest(!0),xe.buffers.depth.setMask(!0),xe.buffers.color.setMask(!0),xe.setPolygonOffset(!1)}function vc(E,k,Z,X){if((Z.isScene===!0?Z.overrideMaterial:null)!==null)return;if(M.state.transmissionRenderTarget[X.id]===void 0){const Te=gt.has("EXT_color_buffer_half_float")||gt.has("EXT_color_buffer_float");M.state.transmissionRenderTarget[X.id]=new Oi(1,1,{generateMipmaps:!0,type:Te?Bi:jt,minFilter:en,samples:Math.max(4,vt.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:je.workingColorSpace})}const ve=M.state.transmissionRenderTarget[X.id],we=X.viewport||W;ve.setSize(we.z*T.transmissionResolutionScale,we.w*T.transmissionResolutionScale);const me=T.getRenderTarget(),Me=T.getActiveCubeFace(),Re=T.getActiveMipmapLevel();T.setRenderTarget(ve),T.getClearColor(G),j=T.getClearAlpha(),j<1&&T.setClearColor(16777215,.5),T.clear(),ri&&F.render(Z);const Be=T.toneMapping;T.toneMapping=nn;const Ye=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),M.setupLightsView(X),st===!0&&te.setGlobalState(T.clippingPlanes,X),mr(E,Z,X),Oe.updateMultisampleRenderTarget(ve),Oe.updateRenderTargetMipmap(ve),gt.has("WEBGL_multisampled_render_to_texture")===!1){let Te=!1;for(let Ke=0,St=k.length;Ke<St;Ke++){const ut=k[Ke],{object:ct,geometry:Bt,material:Ae,group:Gt}=ut;if(Ae.side===Ci&&ct.layers.test(X.layers)){const nt=Ae.side;Ae.side=Jt,Ae.needsUpdate=!0,_c(ct,Z,X,Bt,Ae,Gt),Ae.side=nt,Ae.needsUpdate=!0,Te=!0}}Te===!0&&(Oe.updateMultisampleRenderTarget(ve),Oe.updateRenderTargetMipmap(ve))}T.setRenderTarget(me,Me,Re),T.setClearColor(G,j),Ye!==void 0&&(X.viewport=Ye),T.toneMapping=Be}function mr(E,k,Z){const X=k.isScene===!0?k.overrideMaterial:null;for(let q=0,ve=E.length;q<ve;q++){const we=E[q],{object:me,geometry:Me,group:Re}=we;let Be=we.material;Be.allowOverride===!0&&X!==null&&(Be=X),me.layers.test(Z.layers)&&_c(me,k,Z,Me,Be,Re)}}function _c(E,k,Z,X,q,ve){U!==null&&q.isNodeMaterial&&U.setObject(E,q),E.onBeforeRender(T,k,Z,X,q,ve),E.modelViewMatrix.multiplyMatrices(Z.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),q.onBeforeRender(T,k,Z,X,E,ve),q.transparent===!0&&q.side===Ci&&q.forceSinglePass===!1?(q.side=Jt,q.needsUpdate=!0,T.renderBufferDirect(Z,k,X,q,E,ve),q.side=zn,q.needsUpdate=!0,T.renderBufferDirect(Z,k,X,q,E,ve),q.side=Ci):T.renderBufferDirect(Z,k,X,q,E,ve),E.onAfterRender(T,k,Z,X,q,ve)}function xc(E){let k=0;for(const Z of E)Z.texture!==null&&k++;return k}function Ps(E,k,Z){k.isScene!==!0&&(k=si);const X=Ue.get(E),q=M.state.lights,ve=M.state.shadowsArray,we=q.state.version,me=ne.getParameters(E,q.state,ve,k,Z,M.state.lightProbeGridArray),Me=ne.getProgramCacheKey(me);let Re=X.programs;X.environment=E.isMeshStandardMaterial||E.isMeshLambertMaterial||E.isMeshPhongMaterial?k.environment:null,X.fog=k.fog;const Be=E.isMeshStandardMaterial||E.isMeshLambertMaterial&&!E.envMap||E.isMeshPhongMaterial&&!E.envMap;X.envMap=N.get(E.envMap||X.environment,Be),X.envMapRotation=X.environment!==null&&E.envMap===null?k.environmentRotation:E.envMapRotation,Re===void 0&&(E.addEventListener("dispose",rt),Re=new Map,X.programs=Re,X.programVariants=new Map);let Ye=Re.get(Me);if(Ye!==void 0){if(X.currentProgram===Ye&&X.lightsStateVersion===we)return Sc(E,me),Ye}else me.uniforms=ne.getUniforms(E),U!==null&&E.isNodeMaterial&&U.build(E,Z,me),E.onBeforeCompile(me,T),Ye=ne.acquireProgram(me,Me),Re.set(Me,Ye),X.uniforms=me.uniforms;const Te=X.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Te.clippingPlanes=te.uniform),Sc(E,me),X.needsLights=$d(E),X.lightsStateVersion=we,X.needsLights&&(Te.ambientLightColor.value=q.state.ambient,Te.lightProbe.value=q.state.probe,Te.sunLights.value=q.state.sun,Te.sunLightShadows.value=q.state.sunShadow,Te.directionalLights.value=q.state.directional,Te.directionalLightShadows.value=q.state.directionalShadow,Te.spotLights.value=q.state.spot,Te.spotLightShadows.value=q.state.spotShadow,Te.rectAreaLights.value=q.state.rectArea,Te.ltc_1.value=q.state.rectAreaLTC1,Te.ltc_2.value=q.state.rectAreaLTC2,Te.pointLights.value=q.state.point,Te.pointLightShadows.value=q.state.pointShadow,Te.hemisphereLights.value=q.state.hemi,Te.sunShadowMatrix.value=q.state.sunShadowMatrix,Te.sunShadowCascade.value=q.state.sunShadowCascade,Te.directionalShadowMatrix.value=q.state.directionalShadowMatrix,Te.spotLightMatrix.value=q.state.spotLightMatrix,Te.spotLightMap.value=q.state.spotLightMap,Te.pointShadowMatrix.value=q.state.pointShadowMatrix),X.numLightProbeGrids=xc(M.state.lightProbeGridArray),X.currentProgram=Ye,X.uniformsList=null,Ye}function Gd(E,k,Z,X,q){const ve=Ue.get(E),we=ve.currentProgram.id+","+X+","+q;let me=ve.programVariants.get(we);return me===void 0?(me=Ps(E,k,Z),ve.programVariants.set(we,me)):(ve.currentProgram=me,ve.uniformsList=null,ve.outputColorSpace=X,ve.toneMapping=q),me}function yc(E){if(E.uniformsList===null){const k=E.currentProgram.getUniforms();E.uniformsList=ha.seqWithValue(k.seq,E.uniforms)}return E.uniformsList}function Sc(E,k){const Z=Ue.get(E);Z.outputColorSpace=k.outputColorSpace,Z.batching=k.batching,Z.batchingColor=k.batchingColor,Z.instancing=k.instancing,Z.instancingColor=k.instancingColor,Z.instancingMorph=k.instancingMorph,Z.skinning=k.skinning,Z.morphTargets=k.morphTargets,Z.morphNormals=k.morphNormals,Z.morphColors=k.morphColors,Z.morphTargetsCount=k.morphTargetsCount,Z.numClippingPlanes=k.numClippingPlanes,Z.numIntersection=k.numClipIntersection,Z.vertexAlphas=k.vertexAlphas,Z.vertexTangents=k.vertexTangents,Z.toneMapping=k.toneMapping}function Wd(E,k,Z,X,q){k.isScene!==!0&&(k=si),Oe.resetTextureUnits();const ve=k.fog,we=X.isMeshStandardMaterial||X.isMeshLambertMaterial||X.isMeshPhongMaterial?k.environment:null,me=L===null?T.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:je.workingColorSpace,Me=X.isMeshStandardMaterial||X.isMeshLambertMaterial&&!X.envMap||X.isMeshPhongMaterial&&!X.envMap,Re=N.get(X.envMap||we,Me),Be=X.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,Ye=!!Z.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Te=!!Z.morphAttributes.position,Ke=!!Z.morphAttributes.normal,St=!!Z.morphAttributes.color;let ut=nn;X.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(ut=T.toneMapping);const ct=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,Bt=ct!==void 0?ct.length:0,Ae=Ue.get(X),Gt=M.state.lights;if(st===!0&&(kt===!0||E!==H)){const xt=E===H&&X.id===C;te.setState(X,E,xt)}let nt=!1,Pn=!1;X.version===Ae.__version?Ae.needsLights&&Ae.lightsStateVersion!==Gt.state.version||q.isBatchedMesh&&Ae.batching===!1||!q.isBatchedMesh&&Ae.batching===!0||q.isBatchedMesh&&Ae.batchingColor===!0&&q._colorsTexture===null||q.isBatchedMesh&&Ae.batchingColor===!1&&q._colorsTexture!==null||q.isInstancedMesh&&Ae.instancing===!1||!q.isInstancedMesh&&Ae.instancing===!0||q.isSkinnedMesh&&Ae.skinning===!1||!q.isSkinnedMesh&&Ae.skinning===!0||q.isInstancedMesh&&Ae.instancingColor===!0&&q.instanceColor===null||q.isInstancedMesh&&Ae.instancingColor===!1&&q.instanceColor!==null||q.isInstancedMesh&&Ae.instancingMorph===!0&&q.morphTexture===null||q.isInstancedMesh&&Ae.instancingMorph===!1&&q.morphTexture!==null||Ae.envMap!==Re||X.fog===!0&&Ae.fog!==ve||Ae.numClippingPlanes!==void 0&&(Ae.numClippingPlanes!==te.numPlanes||Ae.numIntersection!==te.numIntersection)||Ae.vertexAlphas!==Be||Ae.vertexTangents!==Ye||Ae.morphTargets!==Te||Ae.morphNormals!==Ke||Ae.morphColors!==St||Ae.morphTargetsCount!==Bt||Ae.numLightProbeGrids!==xc(M.state.lightProbeGridArray)?nt=!0:(Ae.outputColorSpace!==me||Ae.toneMapping!==ut)&&(Pn=!0):(nt=!0,Ae.__version=X.version);let zt=Ae.currentProgram;(nt===!0||Pn===!0)&&(zt=Pn===!0?Gd(X,k,q,me,ut):Ps(X,k,q),U&&X.isNodeMaterial&&U.onUpdateProgram(X,zt,Ae));let gr=!1,cn=!1,In=!1;const Qe=zt.getUniforms(),Dt=Ae.uniforms;if(xe.useProgram(zt.program)&&(gr=!0,cn=!0,In=!0),X.id!==C&&(C=X.id,cn=!0),gr||H!==E){xe.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),Qe.setValue(V,"projectionMatrix",E.projectionMatrix),Qe.setValue(V,"viewMatrix",E.matrixWorldInverse);const Pt=Qe.map.cameraPosition;Pt!==void 0&&Pt.setValue(V,Li.setFromMatrixPosition(E.matrixWorld)),vt.logarithmicDepthBuffer&&Qe.setValue(V,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&Qe.setValue(V,"isOrthographic",E.isOrthographicCamera===!0),H!==E&&(H=E,cn=!0,In=!0)}if(Ae.needsLights&&(Gt.state.sunShadowMap.length>0&&Qe.setValue(V,"sunShadowMap",Gt.state.sunShadowMap,Oe),Gt.state.directionalShadowMap.length>0&&Qe.setValue(V,"directionalShadowMap",Gt.state.directionalShadowMap,Oe),Gt.state.spotShadowMap.length>0&&Qe.setValue(V,"spotShadowMap",Gt.state.spotShadowMap,Oe),Gt.state.pointShadowMap.length>0&&Qe.setValue(V,"pointShadowMap",Gt.state.pointShadowMap,Oe)),q.isSkinnedMesh){Qe.setOptional(V,q,"bindMatrix"),Qe.setOptional(V,q,"bindMatrixInverse");const xt=q.skeleton;xt&&(xt.boneTexture===null&&xt.computeBoneTexture(),Qe.setValue(V,"boneTexture",xt.boneTexture,Oe))}q.isBatchedMesh&&(Qe.setOptional(V,q,"batchingTexture"),Qe.setValue(V,"batchingTexture",q._matricesTexture,Oe),Qe.setOptional(V,q,"batchingIdTexture"),Qe.setValue(V,"batchingIdTexture",q._indirectTexture,Oe),Qe.setOptional(V,q,"batchingColorTexture"),q._colorsTexture!==null&&Qe.setValue(V,"batchingColorTexture",q._colorsTexture,Oe));const _i=Z.morphAttributes;if((_i.position!==void 0||_i.normal!==void 0||_i.color!==void 0)&&ie.update(q,Z,zt),(cn||Ae.receiveShadow!==q.receiveShadow)&&(Ae.receiveShadow=q.receiveShadow,Qe.setValue(V,"receiveShadow",q.receiveShadow)),(X.isMeshStandardMaterial||X.isMeshLambertMaterial||X.isMeshPhongMaterial)&&X.envMap===null&&k.environment!==null&&(Dt.envMapIntensity.value=k.environmentIntensity),Dt.dfgLUT!==void 0&&(Dt.dfgLUT.value=dS()),cn){if(Qe.setValue(V,"toneMappingExposure",T.toneMappingExposure),Ae.needsLights&&Xd(Dt,In),ve&&X.fog===!0&&ue.refreshFogUniforms(Dt,ve),ue.refreshMaterialUniforms(Dt,X,ae,le,M.state.transmissionRenderTarget[E.id]),Ae.needsLights&&Ae.numLightProbeGrids>0){const xt=R;let Pt=0;for(const Vi of M.state.lightProbeGridArray)Vi.texture!==null&&(xt.textures[Pt]=Vi.texture,xt.min[Pt]=Vi.boundingBox.min,xt.max[Pt]=Vi.boundingBox.max,xt.resolution[Pt]=Vi.resolution,Pt++);for(const Vi in xt)xt[Vi].length=Pt;Dt.probesSH.value=xt.textures,Dt.probesMin.value=xt.min,Dt.probesMax.value=xt.max,Dt.probesResolution.value=xt.resolution}ha.upload(V,yc(Ae),Dt,Oe)}if(X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(ha.upload(V,yc(Ae),Dt,Oe),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&Qe.setValue(V,"center",q.center),Qe.setValue(V,"modelViewMatrix",q.modelViewMatrix),Qe.setValue(V,"normalMatrix",q.normalMatrix),Qe.setValue(V,"modelMatrix",q.matrixWorld),X.uniformsGroups!==void 0){const xt=X.uniformsGroups;for(let Pt=0,Vi=xt.length;Pt<Vi;Pt++){const bc=xt[Pt];Le.update(bc,zt),Le.bind(bc,zt)}}return zt}function Xd(E,k){E.ambientLightColor.needsUpdate=k,E.lightProbe.needsUpdate=k,E.sunLights.needsUpdate=k,E.sunLightShadows.needsUpdate=k,E.directionalLights.needsUpdate=k,E.directionalLightShadows.needsUpdate=k,E.pointLights.needsUpdate=k,E.pointLightShadows.needsUpdate=k,E.spotLights.needsUpdate=k,E.spotLightShadows.needsUpdate=k,E.rectAreaLights.needsUpdate=k,E.hemisphereLights.needsUpdate=k}function $d(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return B},this.getActiveMipmapLevel=function(){return z},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(E,k,Z){const X=Ue.get(E);X.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),Ue.get(E.texture).__webglTexture=k,Ue.get(E.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:Z,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,k){const Z=Ue.get(E);Z.__webglFramebuffer=k,Z.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(E,k=0,Z=0){L=E,B=k,z=Z;let X=null,q=!1,ve=!1;if(E){const me=Ue.get(E);if(me.__useDefaultFramebuffer!==void 0){xe.bindFramebuffer(V.FRAMEBUFFER,me.__webglFramebuffer),W.copy(E.viewport),K.copy(E.scissor),Q=E.scissorTest,xe.viewport(W),xe.scissor(K),xe.setScissorTest(Q),C=-1;return}else if(me.__webglFramebuffer===void 0)Oe.setupRenderTarget(E);else if(me.__hasExternalTextures)Oe.rebindTextures(E,Ue.get(E.texture).__webglTexture,Ue.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Be=E.depthTexture;if(me.__boundDepthTexture!==Be){if(Be!==null&&Ue.has(Be)&&(E.width!==Be.image.width||E.height!==Be.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Oe.setupDepthRenderbuffer(E)}}const Me=E.texture;(Me.isData3DTexture||Me.isDataArrayTexture||Me.isCompressedArrayTexture)&&(ve=!0);const Re=Ue.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Re[k])?X=Re[k][Z]:X=Re[k],q=!0):E.samples>0&&Oe.useMultisampledRTT(E)===!1?X=Ue.get(E).__webglMultisampledFramebuffer:Array.isArray(Re)?X=Re[Z]:X=Re,W.copy(E.viewport),K.copy(E.scissor),Q=E.scissorTest}else W.copy(Ee).multiplyScalar(ae).floor(),K.copy(De).multiplyScalar(ae).floor(),Q=se;if(Z!==0&&(X=D),xe.bindFramebuffer(V.FRAMEBUFFER,X)&&xe.drawBuffers(E,X),xe.viewport(W),xe.scissor(K),xe.setScissorTest(Q),q){const me=Ue.get(E.texture);V.framebufferTexture2D(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_CUBE_MAP_POSITIVE_X+k,me.__webglTexture,Z)}else if(ve){const me=k;for(let Me=0;Me<E.textures.length;Me++){const Re=Ue.get(E.textures[Me]);V.framebufferTextureLayer(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0+Me,Re.__webglTexture,Z,me)}}else if(E!==null&&Z!==0){const me=Ue.get(E.texture);V.framebufferTexture2D(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_2D,me.__webglTexture,Z)}C=-1};function Mc(E){const k=Ue.get(E);return(k.__readFormat!==E.format||k.__readType!==E.type)&&(k.__readFormat=E.format,k.__readType=E.type,k.__formatReadable=vt.textureFormatReadable(E.format),k.__typeReadable=vt.textureTypeReadable(E.type)),k}this.readRenderTargetPixels=function(E,k,Z,X,q,ve,we,me=0){if(!(E&&E.isWebGLRenderTarget)){Fe("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Me=Ue.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&we!==void 0&&(Me=Me[we],Array.isArray(Me)&&(Me=Me[0])),Me){xe.bindFramebuffer(V.FRAMEBUFFER,Me);try{const Re=E.textures[me],Be=Re.format,Ye=Re.type;E.textures.length>1&&V.readBuffer(V.COLOR_ATTACHMENT0+me);const Te=Mc(Re);if(Te.__formatReadable===!1){Fe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Te.__typeReadable===!1){Fe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=E.width-X&&Z>=0&&Z<=E.height-q&&V.readPixels(k,Z,X,q,he.convert(Be),he.convert(Ye),ve)}finally{const Re=L!==null?Ue.get(L).__webglFramebuffer:null;xe.bindFramebuffer(V.FRAMEBUFFER,Re)}}},this.readRenderTargetPixelsAsync=async function(E,k,Z,X,q,ve,we,me=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Me=Ue.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&we!==void 0&&(Me=Me[we],Array.isArray(Me)&&(Me=Me[0])),Me)if(k>=0&&k<=E.width-X&&Z>=0&&Z<=E.height-q){xe.bindFramebuffer(V.FRAMEBUFFER,Me);const Re=E.textures[me],Be=Re.format,Ye=Re.type;E.textures.length>1&&V.readBuffer(V.COLOR_ATTACHMENT0+me);const Te=Mc(Re);if(Te.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Te.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ke=V.createBuffer();V.bindBuffer(V.PIXEL_PACK_BUFFER,Ke),V.bufferData(V.PIXEL_PACK_BUFFER,ve.byteLength,V.STREAM_READ),V.readPixels(k,Z,X,q,he.convert(Be),he.convert(Ye),0),V.bindBuffer(V.PIXEL_PACK_BUFFER,null);const St=L!==null?Ue.get(L).__webglFramebuffer:null;xe.bindFramebuffer(V.FRAMEBUFFER,St);const ut=V.fenceSync(V.SYNC_GPU_COMMANDS_COMPLETE,0);return V.flush(),await Hm(V,ut,4),V.bindBuffer(V.PIXEL_PACK_BUFFER,Ke),V.getBufferSubData(V.PIXEL_PACK_BUFFER,0,ve),V.bindBuffer(V.PIXEL_PACK_BUFFER,null),V.deleteBuffer(Ke),V.deleteSync(ut),ve}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,k=null,Z=0){const X=Math.pow(2,-Z),q=Math.floor(E.image.width*X),ve=Math.floor(E.image.height*X),we=k!==null?k.x:0,me=k!==null?k.y:0;Oe.setTexture2D(E,0),V.copyTexSubImage2D(V.TEXTURE_2D,Z,0,0,we,me,q,ve),xe.unbindTexture()},this.copyTextureToTexture=function(E,k,Z=null,X=null,q=0,ve=0){let we,me,Me,Re,Be,Ye,Te,Ke,St;const ut=E.isCompressedTexture?E.mipmaps[ve]:E.image;if(Z!==null)we=Z.max.x-Z.min.x,me=Z.max.y-Z.min.y,Me=Z.isBox3?Z.max.z-Z.min.z:1,Re=Z.min.x,Be=Z.min.y,Ye=Z.isBox3?Z.min.z:0;else{const Qe=Math.pow(2,-q);we=Math.floor(ut.width*Qe),me=Math.floor(ut.height*Qe),E.isDataArrayTexture?Me=ut.depth:E.isData3DTexture?Me=Math.floor(ut.depth*Qe):Me=1,Re=0,Be=0,Ye=0}X!==null?(Te=X.x,Ke=X.y,St=X.z):(Te=0,Ke=0,St=0);const ct=he.convert(k.format),Bt=he.convert(k.type);let Ae;k.isData3DTexture?(Oe.setTexture3D(k,0),Ae=V.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(Oe.setTexture2DArray(k,0),Ae=V.TEXTURE_2D_ARRAY):(Oe.setTexture2D(k,0),Ae=V.TEXTURE_2D),xe.activeTexture(V.TEXTURE0),xe.pixelStorei(V.UNPACK_FLIP_Y_WEBGL,k.flipY),xe.pixelStorei(V.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),xe.pixelStorei(V.UNPACK_ALIGNMENT,k.unpackAlignment);const Gt=xe.getParameter(V.UNPACK_ROW_LENGTH),nt=xe.getParameter(V.UNPACK_IMAGE_HEIGHT),Pn=xe.getParameter(V.UNPACK_SKIP_PIXELS),zt=xe.getParameter(V.UNPACK_SKIP_ROWS),gr=xe.getParameter(V.UNPACK_SKIP_IMAGES);xe.pixelStorei(V.UNPACK_ROW_LENGTH,ut.width),xe.pixelStorei(V.UNPACK_IMAGE_HEIGHT,ut.height),xe.pixelStorei(V.UNPACK_SKIP_PIXELS,Re),xe.pixelStorei(V.UNPACK_SKIP_ROWS,Be),xe.pixelStorei(V.UNPACK_SKIP_IMAGES,Ye);const cn=E.isDataArrayTexture||E.isData3DTexture,In=k.isDataArrayTexture||k.isData3DTexture;if(E.isDepthTexture){const Qe=Ue.get(E),Dt=Ue.get(k),_i=Ue.get(Qe.__renderTarget),xt=Ue.get(Dt.__renderTarget);xe.bindFramebuffer(V.READ_FRAMEBUFFER,_i.__webglFramebuffer),xe.bindFramebuffer(V.DRAW_FRAMEBUFFER,xt.__webglFramebuffer);for(let Pt=0;Pt<Me;Pt++)cn&&(V.framebufferTextureLayer(V.READ_FRAMEBUFFER,V.COLOR_ATTACHMENT0,Ue.get(E).__webglTexture,q,Ye+Pt),V.framebufferTextureLayer(V.DRAW_FRAMEBUFFER,V.COLOR_ATTACHMENT0,Ue.get(k).__webglTexture,ve,St+Pt)),V.blitFramebuffer(Re,Be,Re+we,Be+me,Te,Ke,Te+we,Ke+me,V.DEPTH_BUFFER_BIT,V.NEAREST);xe.bindFramebuffer(V.READ_FRAMEBUFFER,null),xe.bindFramebuffer(V.DRAW_FRAMEBUFFER,null)}else if(q!==0||E.isRenderTargetTexture||Ue.has(E)){const Qe=Ue.get(E),Dt=Ue.get(k);xe.bindFramebuffer(V.READ_FRAMEBUFFER,w),xe.bindFramebuffer(V.DRAW_FRAMEBUFFER,O);for(let _i=0;_i<Me;_i++)cn?V.framebufferTextureLayer(V.READ_FRAMEBUFFER,V.COLOR_ATTACHMENT0,Qe.__webglTexture,q,Ye+_i):V.framebufferTexture2D(V.READ_FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_2D,Qe.__webglTexture,q),In?V.framebufferTextureLayer(V.DRAW_FRAMEBUFFER,V.COLOR_ATTACHMENT0,Dt.__webglTexture,ve,St+_i):V.framebufferTexture2D(V.DRAW_FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_2D,Dt.__webglTexture,ve),q!==0?V.blitFramebuffer(Re,Be,Re+we,Be+me,Te,Ke,Te+we,Ke+me,V.COLOR_BUFFER_BIT,V.NEAREST):In?V.copyTexSubImage3D(Ae,ve,Te,Ke,St+_i,Re,Be,we,me):V.copyTexSubImage2D(Ae,ve,Te,Ke,Re,Be,we,me);xe.bindFramebuffer(V.READ_FRAMEBUFFER,null),xe.bindFramebuffer(V.DRAW_FRAMEBUFFER,null)}else In?E.isDataTexture||E.isData3DTexture?V.texSubImage3D(Ae,ve,Te,Ke,St,we,me,Me,ct,Bt,ut.data):k.isCompressedArrayTexture?V.compressedTexSubImage3D(Ae,ve,Te,Ke,St,we,me,Me,ct,ut.data):V.texSubImage3D(Ae,ve,Te,Ke,St,we,me,Me,ct,Bt,ut):E.isDataTexture?V.texSubImage2D(V.TEXTURE_2D,ve,Te,Ke,we,me,ct,Bt,ut.data):E.isCompressedTexture?V.compressedTexSubImage2D(V.TEXTURE_2D,ve,Te,Ke,ut.width,ut.height,ct,ut.data):V.texSubImage2D(V.TEXTURE_2D,ve,Te,Ke,we,me,ct,Bt,ut);xe.pixelStorei(V.UNPACK_ROW_LENGTH,Gt),xe.pixelStorei(V.UNPACK_IMAGE_HEIGHT,nt),xe.pixelStorei(V.UNPACK_SKIP_PIXELS,Pn),xe.pixelStorei(V.UNPACK_SKIP_ROWS,zt),xe.pixelStorei(V.UNPACK_SKIP_IMAGES,gr),ve===0&&k.generateMipmaps===!0&&k.mipmapsAutoUpdate===!0&&V.generateMipmap(Ae),xe.unbindTexture()},this.initRenderTarget=function(E){Ue.get(E).__webglFramebuffer===void 0&&Oe.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?Oe.setTextureCube(E,0):E.isData3DTexture?Oe.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?Oe.setTexture2DArray(E,0):Oe.setTexture2D(E,0),xe.unbindTexture()},this.resetState=function(){B=0,z=0,L=null,xe.reset(),de.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Pi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=je._getDrawingBufferColorSpace(e),t.unpackColorSpace=je._getUnpackColorSpace()}}const uu=`precision highp float;
in vec3 position;in vec2 uv;uniform mat4 projectionMatrix,modelViewMatrix;uniform vec2 size,warpBounds;uniform bool warped;out vec2 texUV,localPoint;
void main(){texUV=uv;localPoint=position.xy*size;if(warped)localPoint.x=mix(warpBounds.x,warpBounds.y,position.x);gl_Position=projectionMatrix*modelViewMatrix*vec4(localPoint,0.,1.);}`,pS=`precision highp float;
uniform sampler2D image,palette;uniform bool indexed,maskZero;uniform vec2 coefficients;uniform float opacity;
uniform bool warped;uniform vec4 warpEdges;uniform vec2 size;uniform int fxCount;uniform vec3 fxAdd[8],fxMul[8],fxPost[8];uniform vec2 fxColorInvert[8];in vec2 texUV,localPoint;out vec4 result;
void main(){vec2 sampleUV=texUV;if(warped){vec2 edges=mix(warpEdges.xy,warpEdges.zw,clamp(localPoint.y/size.y,0.,1.));float span=edges.y-edges.x;if(abs(span)<.00001)discard;float u=(localPoint.x-edges.x)/span;if(u<0.||u>=1.)discard;sampleUV=vec2(u,localPoint.y/size.y);}vec4 color=texture(image,sampleUV);if(indexed){float i=floor(color.r*255.+.5);color=texture(palette,vec2((i+.5)/256.,.5));if(i<.5){if(maskZero)discard;color.a=1.;}}if(color.a<=0.)discard;
vec3 rgb=color.rgb*255.;for(int i=0;i<8;i++){if(i>=fxCount)break;float grey=dot(rgb,vec3(.299,.587,.114));rgb=mix(vec3(grey),rgb,fxColorInvert[i].x);if(fxColorInvert[i].y>.5)rgb=255.-rgb;rgb=clamp((rgb+fxAdd[i])*fxMul[i]+fxPost[i],0.,255.);}
rgb=floor(rgb+.00001)/255.;float coverage=color.a*opacity;result=vec4(rgb*coefficients.x*coverage,coverage*(1.-coefficients.y));}`,mS=`precision highp float;uniform float ground;in vec2 texUV;out vec4 result;
void main(){vec2 p=vec2(texUV.x*960.,texUV.y*540.);vec3 color=vec3(.047,.067,.106);float h=ground-105.;if(p.y>h){float distance=p.y-h+16.;float x=(p.x-480.)*100./distance;float lines=min(abs(fract(x/80.+.5)-.5)*distance/100.,abs(fract(log(distance/16.)*3.)-.5)*distance*.18);color=mix(vec3(.105,.153,.215),color,smoothstep(.35,1.1,lines));}if(abs(p.y-ground)<.6)color=vec3(.27,.38,.33);result=vec4(color,1.);}`,gS=()=>({add:Array.from({length:8},()=>[0,0,0]),mul:Array.from({length:8},()=>[1,1,1]),post:Array.from({length:8},()=>[0,0,0]),color:Array.from({length:8},()=>[1,0])});class vS{constructor(e,{maxTextureBytes:t=64*1024*1024,preserveDrawingBuffer:i=!1}={}){this.renderer=new fS({canvas:e,alpha:!1,antialias:!1,powerPreference:"high-performance",preserveDrawingBuffer:i}),this.renderer.debug.onShaderError=(a,o)=>{throw Error("Sprite shader could not compile: "+a.getProgramInfoLog(o))},this.renderer.outputColorSpace=or,this.renderer.sortObjects=!1,this.renderer.setClearColor(790811,1),this.canvas=e,this.contextLost=a=>{a.preventDefault(),this.lost=!0},e.addEventListener("webglcontextlost",this.contextLost),this.limit=t,this.textureBytes=0,this.textures=new Map,this.slots=[],this.frames=0,this.scene=new vg,this.camera=new rc(0,960,0,540,-10,10),this.camera.position.z=1,this.geometry=new Hi,this.geometry.setAttribute("position",new ni([0,0,0,1,0,0,0,1,0,1,1,0],3)),this.geometry.setAttribute("uv",new ni([0,0,1,0,0,1,1,1],2)),this.geometry.setIndex([0,1,2,2,1,3]);const s=new Ul({glslVersion:wa,vertexShader:uu,fragmentShader:mS,uniforms:{size:{value:[960,540]},ground:{value:450},warped:{value:!1},warpBounds:{value:[0,0]}},side:Ci,depthTest:!1,depthWrite:!1});this.grid=new vi(this.geometry,s),this.grid.frustumCulled=!1,this.scene.add(this.grid),this.upload({id:"@white",width:1,height:1,indexed:!1,pixels:new Uint8Array([255,255,255,255])});const r=new Uint8Array(256);for(let a=0;a<8;a++)for(let o=0;o<8;o++)if(o===3||a===3||Math.abs(o-3)===Math.abs(a-3)){const l=(a*8+o)*4;r.set([255,240,130,255],l)}this.upload({id:"@spark",width:8,height:8,pixels:r})}upload(e){if(this.textures.has(e.id))return;const t=e.pixels,i=e.width*e.height*(e.indexed?1:4);if(!Number.isSafeInteger(e.width)||!Number.isSafeInteger(e.height)||e.width<1||e.height<1)throw Error("Invalid GPU asset dimensions.");if(e.width>this.renderer.capabilities.maxTextureSize||e.height>this.renderer.capabilities.maxTextureSize)throw Error("Sprite exceeds this graphics device’s texture limit.");if(!(t instanceof Uint8Array)||t.length!==i)throw Error("Invalid GPU asset dimensions.");if(this.textureBytes+t.length>this.limit)throw Error("GPU texture budget exceeded. Close this match or use a smaller stage.");const s=new bs(t,e.width,e.height,e.indexed?Na:gi,jt);s.minFilter=s.magFilter=Et,s.wrapS=s.wrapT=ii,s.generateMipmaps=!1,s.flipY=!1,s.unpackAlignment=1,s.needsUpdate=!0,this.textures.set(e.id,s),this.textureBytes+=t.length}slot(e){if(this.slots[e])return this.slots[e];const t=gS(),i=new Ul({glslVersion:wa,vertexShader:uu,fragmentShader:pS,uniforms:{image:{value:null},palette:{value:null},indexed:{value:!1},maskZero:{value:!0},size:{value:[1,1]},warped:{value:!1},warpEdges:{value:[0,1,0,1]},warpBounds:{value:[0,1]},coefficients:{value:[1,0]},opacity:{value:1},fxCount:{value:0},fxAdd:{value:t.add.flat()},fxMul:{value:t.mul.flat()},fxPost:{value:t.post.flat()},fxColorInvert:{value:t.color.flat()}},transparent:!0,depthTest:!1,depthWrite:!1,blending:Wu,blendSrc:$o,blendDst:_a,blendEquation:Ji,blendEquationAlpha:Ji,blendSrcAlpha:$o,blendDstAlpha:_a});i.side=Ci,i.forceSinglePass=!0;const s=new vi(this.geometry,i);return s.matrixAutoUpdate=!1,s.frustumCulled=!1,s.onBeforeRender=()=>{const r=s.userData.clip,a=this.renderer,o=this.canvas.width/960;a.setScissorTest(!!r),r&&a.setScissor(r[0]*o,(540-r[1]-r[3])*o,r[2]*o,r[3]*o),i.uniformsNeedUpdate=!0},this.scene.add(s),this.slots[e]=s,s}updateVideo(e){const t=e.bitmap;try{if(this.closed||this.lost)return!1;const i=t.width*t.height*4;if(t.width<1||t.height<1||t.width>1280||t.height>720)throw Error("Invalid stage video frame dimensions.");let s=this.textures.get(e.id);const r=(s==null?void 0:s.userData.videoBytes)||0;if(this.textureBytes-r+i>this.limit)throw Error("GPU texture budget exceeded by stage video.");return s||(s=new Ot,s.generateMipmaps=!1,s.wrapS=s.wrapT=ii,s.flipY=!1,this.textures.set(e.id,s)),s.minFilter=s.magFilter=e.filter==="neighbor"?Et:Nt,s.image=t,s.needsUpdate=!0,this.renderer.initTexture(s),s.userData.videoBytes=i,this.textureBytes+=i-r,this.videoUploads=(this.videoUploads||0)+1,!0}finally{t==null||t.close()}}async loadStage(e,t){var r;if(!((r=e==null?void 0:e.model)!=null&&r.path)||this.closed)return!1;const{ModelStage:i}=await import("./model-stage-BWiVNiZ8.js");if(this.closed)return!1;const s=await i.load(e,t,this.renderer,{textureBudget:Math.min(32*1024*1024,this.limit-this.textureBytes)});return this.closed?(s==null||s.close(),!1):(this.model=s,this.textureBytes+=(s==null?void 0:s.textureBytes)||0,!!s)}render(e,{width:t=960,height:i=540}={}){var r,a,o,l,c,h,f;if(this.closed)return;if(this.lost)throw Error("Graphics context was lost. Start the match again from your library.");(this.canvas.width!==t||this.canvas.height!==i)&&this.renderer.setSize(t,i,!1);for(const u of e.assets||[])this.upload(u);this.grid.visible=!!e.grid,this.grid.material.uniforms.ground.value=e.ground||450;const s=e.draws.concat((e.sparks||[]).map(u=>{const d=(12-u.age)*.3+1;return{texture:"@spark",indexed:!1,width:8,height:8,matrix:[d,0,0,d,u.x-4*d,u.y-4*d],blend:{mode:"add",source:1,destination:1},alpha:(12-u.age)/12}}));for(let u=0;u<Math.max(s.length,this.slots.length);u++){if(u>=s.length){this.slots[u].visible=!1;continue}const d=s[u],p=this.slot(u),_=p.material.uniforms;p.visible=!0,p.layers.set((d.pass??1)+1);const m=this.textures.get(d.texture);if(!m)throw Error("GPU texture was not delivered: "+d.texture);if(_.image.value=m,_.palette.value=this.textures.get(d.palette)||this.textures.get("@white"),_.indexed.value=!!d.indexed,_.maskZero.value=d.mask!==!1,_.size.value[0]=d.width,_.size.value[1]=d.height,_.warped.value=!!d.warp,d.warp){for(let x=0;x<4;x++)_.warpEdges.value[x]=d.warp[x];_.warpBounds.value[0]=Math.min(...d.warp),_.warpBounds.value[1]=Math.max(...d.warp)}_.opacity.value=d.alpha??1,_.coefficients.value[0]=((r=d.blend)==null?void 0:r.source)??1,_.coefficients.value[1]=((a=d.blend)==null?void 0:a.destination)??0;const[v,y,A,R,S,M]=d.matrix;p.matrix.set(v,A,0,S,y,R,0,M,0,0,1,0,0,0,0,1),p.matrixWorldNeedsUpdate=!0,p.userData.clip=d.clip,p.material.blendEquation=((o=d.blend)==null?void 0:o.mode)==="subtract"?Xu:Ji;const g=d.palFX||[];_.fxCount.value=Math.min(8,g.length);for(let x=0;x<_.fxCount.value;x++){const P=g[x],T=P.sinadd||[],I=T[3]?Math.sin(2*Math.PI*(P.age||0)/T[3]):0;_.fxColorInvert.value[x*2]=(P.color??256)/256,_.fxColorInvert.value[x*2+1]=P.invertall?1:0;for(let U=0;U<3;U++)_.fxAdd.value[x*3+U]=(((l=P.add)==null?void 0:l[U])||0)+(T[U]||0)*I,_.fxMul.value[x*3+U]=(((c=P.mul)==null?void 0:c[U])??256)/256,_.fxPost.value[x*3+U]=((h=P.postadd)==null?void 0:h[U])||0}}if(this.renderer.setScissorTest(!1),this.model&&e.model){this.renderer.autoClear=!1,this.renderer.clear(),this.model.update(e.model);for(const u of[-1,0,1,2])u<1&&this.model.render(u),u===2&&this.model.render(1),this.camera.layers.set(u+1),this.renderer.render(this.scene,this.camera),this.renderer.setScissorTest(!1);this.renderer.autoClear=!0}else this.camera.layers.enableAll(),this.renderer.render(this.scene,this.camera);return this.renderer.setScissorTest(!1),this.frames++,this.stats={backend:"Kenjatime Core · Three.js",frames:this.frames,draws:s.length,textureBytes:this.textureBytes,textures:this.textures.size,width:t,height:i,videoUploads:this.videoUploads||0,model:!!this.model,shadowUpdates:((f=this.model)==null?void 0:f.shadowUpdates)||0},this.stats}close(){var e;if(!this.closed){this.closed=!0,(e=this.model)==null||e.close(),this.canvas.removeEventListener("webglcontextlost",this.contextLost);for(const t of this.textures.values())t.dispose();for(const t of this.slots)t.material.dispose();this.grid.material.dispose(),this.geometry.dispose(),this.renderer.dispose(),this.renderer.forceContextLoss(),this.textures.clear()}}}const du=1e3/60;class _S{constructor({maxTicks:e=12}={}){this.maxTicks=e,this.reset()}reset(){this.last=null,this.debt=0,this.tickCount=0,this.lastRender=null}suspend(){this.last=null,this.debt=0,this.lastRender=null}advance(e,{running:t=!0,speed:i=1}={},s=()=>{}){if(!Number.isFinite(e)||!Number.isFinite(i)||i<=0)throw Error("Invalid frame clock time or speed.");const r=this.last===null?0:Math.max(0,e-this.last);if(this.last=e,!t)return this.debt=0,0;this.debt+=r*i/du;let a=0;for(;this.debt>=1-1e-9&&a<this.maxTicks;){const o=e-Math.max(0,this.debt-1)*du/i;s(o),this.debt=Math.max(0,this.debt-1),a++,this.tickCount++}return a}renderDue(e,t=60){return this.lastRender===null||e-this.lastRender>=1e3/t-.25?(this.lastRender=e,!0):!1}}class fu{constructor(){this.reset()}reset(){this.sources=new Map,this.sampled=new Map,this.queue=[],this.offset=0}clearSource(e){this.sources.delete(e),this.sampled.delete(e),this.queue=this.queue.slice(this.offset).filter(t=>t.source!==e),this.offset=0}record(e,t,i){const s=new Set(t),r=this.sources.get(e)||new Set;if(s.size===r.size&&[...s].every(l=>r.has(l)))return;this.sources.set(e,s);const a={source:e,keys:s,time:i};let o=this.queue.length;for(;o>this.offset&&this.queue[o-1].time>i;)o--;this.queue.splice(o,0,a)}sample(e){const t=new Set;for(;this.offset<this.queue.length&&this.queue[this.offset].time<=e;){const s=this.queue[this.offset++],r=this.sampled.get(s.source)||new Set;for(const a of s.keys)r.has(a)||t.add(a);this.sampled.set(s.source,s.keys)}const i=new Set(t);for(const s of this.sampled.values())for(const r of s)i.add(r);return this.offset>128&&(this.queue.splice(0,this.offset),this.offset=0),i}}class xS{constructor(e,t=globalThis){this.callback=e,this.host=t,this.handle=null,this.timer=!1}schedule({timer:e=!1,catchUp:t=!1,idle:i=!1}={}){this.cancel(),this.timer=e||t||i||typeof this.host.requestAnimationFrame!="function";const s=r=>{this.handle=null,this.callback(r)};this.handle=this.timer?this.host.setTimeout(()=>s(this.host.performance.now()),t?0:i?100:1e3/60):this.host.requestAnimationFrame(s)}cancel(){this.handle!==null&&(this.timer?this.host.clearTimeout(this.handle):this.host.cancelAnimationFrame(this.handle),this.handle=null)}}function yS(n){let e,t,i=!1,s=!1,r=!1,a=!0,o=!1,l=!0,c=-1/0,h=1,f="auto",u,d,p,_=1,m=!0;const v=new _S,y=[new fu,new fu],A=new Map,R=new Set,S=new Map,M=[],g=new Map,x=new Set;function P(){var K,Q;const C=e==null?void 0:e.match.stage;if(!C)return;const H=e.match,W=((K=H.superPause)==null?void 0:K.remaining)>0||((Q=H.pause)==null?void 0:Q.remaining)>0&&H.pause.pausebg!==0;for(const G of C.elements)if(G.video){const j={type:"video-control",id:G.video.key,playing:!r&&!W&&G.enabled&&!x.has(G.video.key),visible:G.visible,captureVisible:!o,epoch:C.generation||0},re=JSON.stringify(j),le=g.get(j.id);(le==null?void 0:le.signature)!==re&&(j.reset=le&&le.epoch!==j.epoch,g.set(j.id,{signature:re,epoch:j.epoch}),n(j))}}const T=new xS(w),I=()=>T.schedule({timer:o||!l,catchUp:!r&&v.debt>=1,idle:r});function U(C){const H=new Float32Array(C);if(H.fill(0),p&&!r){let W=0;for(;W<H.length/2;){let K=p.read(Math.min(2048,H.length/2-W));if(!K&&(!m||(p.seek(0),K=p.read(Math.min(2048,H.length/2-W)),!K)))break;H.set(new Float32Array(p.pcm.buffer,p.pcm.byteOffset,K*2),W*2),W+=K}if(_!==1)for(let K=0;K<H.length;K++)H[K]*=_}u==null||u.postMessage({buffer:C},[C])}function D(){var C,H,W;for(const K of e.drainEvents()){if(K.type==="playsnd")try{const Q=e.characters.find(le=>le.path===K.character),G=(C=Q==null?void 0:Q.checks.find(le=>le.key==="sound"&&le.ok))==null?void 0:C.path;if(!G||K.common)continue;A.has(G)||A.set(G,uf(e.files[G]));const j=K.group??((H=K.value)==null?void 0:H[0]),re=K.number??((W=K.value)==null?void 0:W[1]);if(K.soundKey=G+":"+j+","+re,S.set(K.soundKey,{path:G,group:j,number:re}),!R.has(K.soundKey)){const le=A.get(G).get(j,re);if(!le)continue;K.bytes=le.slice(),R.add(K.soundKey)}}catch(Q){e.issue("sound",Q.message);continue}n({type:"sound",event:K},K.bytes?[K.bytes.buffer]:[])}}function w(C){if(!i)try{const H=performance.timeOrigin+C;if(v.advance(H,{running:!r},W=>{e.tick(y[0].sample(W),y[1].sample(W)),D()}),P(),!o&&v.debt<1&&(!r||a)&&v.renderDue(C,60)){const W=performance.now(),K=e.frame();t.render(K,{width:Math.round(960*h),height:Math.round(540*h)});const Q=performance.now()-W;if(a=!1,f==="auto"&&!K.assets.length&&!r&&(M.push(Q),M.length>=30)){const G=M.reduce((j,re)=>j+re,0)/M.length;G>20?h=Math.max(.5,h-.05):G<9&&(h=Math.min(1,h+.05)),M.length=0}}C-c>=100&&(c=C,n({type:"state",state:{...e.snapshot(),paused:r,background:o,focused:l,simulationDebt:v.debt},gpu:t.stats})),I()}catch(H){n({type:"error",message:H.message}),z()}}async function O({files:C,selection:H,canvas:W,sampleRate:K=48e3,quality:Q="auto"}){var le,ae,Ie,it,Ee;if(f=Q,t||L(W),e=new nm(C,H),await e.initializeScripts(),i)return;try{e.modelReady=await t.loadStage((le=e.match.stage)==null?void 0:le.definition,C)}catch(De){i||e.issue("stage-model",De.message)}if(i)return;let G=0;const j=new Set;for(const De of((ae=e.match.stage)==null?void 0:ae.elements)||[])if((Ie=De.video)!=null&&Ie.path){const se=j.has(De.video.path)?null:(it=C[De.video.path])==null?void 0:it.slice();if(se&&(G+=se.length),G>64*1024*1024){x.add(De.video.key),e.issue("stage-video","Stage video source budget (64 MiB) exceeded.");continue}j.add(De.video.path),n({type:"video-init",id:De.video.key,...De.video,bytes:se},se?[se.buffer]:[])}const re=(Ee=e.match.stage)==null?void 0:Ee.definition.music;if(re!=null&&re.path&&C[re.path])if(/\.(mod|xm|it|s3m)$/i.test(re.path)){const{createModuleMusic:De}=await import("./module-music-C2Wy91BT.js");if(i)return;const se=await De();if(i){se.close();return}d=se,p=d.open(C[re.path],K),_=Math.max(0,Math.min(2,re.volume/100)),m=re.loop,n({type:"audio-init",sampleRate:K})}else{const De=C[re.path].slice();n({type:"music",bytes:De,path:re.path,volume:re.volume,loop:re.loop},[De.buffer])}i||(s=!0,n({type:"ready",capabilities:e.capabilities}),I())}function B(C){var H,W,K;if(i){C.type==="video-frame"&&((H=C.bitmap)==null||H.close());return}if(C.type==="video-frame"){try{t.updateVideo(C)&&e.videoSprites.set(C.id,{id:C.id,w:C.sourceWidth,h:C.sourceHeight,x:0,y:0,indexed:!1}),a=!0}catch(Q){x.add(C.id),e.issue("stage-video",Q.message)}n({type:"video-ack",id:C.id});return}if(C.type==="media-warning"){e==null||e.issue("stage-video",String(C.message));return}if(C.type==="visibility"){o=!!C.hidden,l=C.focused!==!1,o||(a=!0),s&&P(),s&&I();return}if(C.type==="release-inputs"){y.forEach(Q=>Q.reset());return}if(C.type==="sound-request"){try{const Q=S.get(C.key),G=Q&&((K=(W=A.get(Q.path))==null?void 0:W.get(Q.group,Q.number))==null?void 0:K.slice());if(!G)throw Error("Sound is unavailable.");n({type:"sound-data",key:C.key,bytes:G},[G.buffer])}catch(Q){n({type:"sound-data",key:C.key,error:Q.message})}return}C.type==="input"&&Array.isArray(C.keys)&&y[C.side===1?1:0].record(C.source||"keyboard",C.keys,C.time??performance.timeOrigin+performance.now()),C.type==="pause"&&(r=!!C.value,y.forEach(Q=>Q.reset()),v.suspend(),a=!0,s&&I()),C.type==="quality"&&(f=C.value,h=1,M.length=0,a=!0),C.type==="audio-port"&&(u=C.port,u.onmessage=({data:Q})=>{!i&&Q.buffer instanceof ArrayBuffer&&Q.buffer.byteLength===8192&&U(Q.buffer)},u.start()),C.type==="stop"&&z()}function z(){i||(i=!0,T.cancel(),u==null||u.close(),d==null||d.close(),e==null||e.close(),t==null||t.close(),u=d=p=e=t=null,A.clear(),R.clear(),S.clear(),y.forEach(C=>C.reset()))}function L(C){if(i)throw Error("Match cancelled.");t||(t=new vS(C))}return{start:O,prepare:L,control:B,stop:z,snapshot:()=>e==null?void 0:e.snapshot(),get gpu(){return t==null?void 0:t.stats}}}const Qr=yS((n,e=[])=>self.postMessage(n,e));self.onmessage=({data:n})=>{if(n.type==="prepare"){try{Qr.prepare(n.canvas),self.postMessage({type:"renderer-ready"})}catch(e){Qr.stop(),self.postMessage({type:"renderer-unavailable",message:e.message})}return}n.type==="start"?Qr.start(n).catch(e=>self.postMessage({type:"error",message:e.message})):Qr.control(n)};export{Oh as $,ot as A,Hi as B,We as C,BS as D,CS as E,i0 as F,vi as G,PS as H,RS as I,Sd as J,IS as K,Cs as L,NS as M,wr as N,yt as O,kS as P,Fi as Q,el as R,di as S,MS as T,LS as U,Je as V,Ar as W,fi as X,ES as Y,rc as Z,yd as _,wS as a,Pg as a0,Sa as a1,Ll as a2,Ot as a3,Rd as a4,ic as a5,nc as a6,je as a7,zn as a8,fr as a9,Cn as aa,on as ab,DS as ac,Bi as ad,mi as ae,TS as af,Qg as ag,wn as ah,vg as ai,er as aj,Jc as ak,jc as al,Zc as am,FS as an,bs as ao,gi as ap,io as aq,VS as ar,Tm as as,Am as at,ra as au,an as av,bS as b,zS as c,or as d,OS as e,qe as f,Y as g,bh as h,US as i,HS as j,rn as k,AS as l,xd as m,en as n,so as o,Em as p,Nt as q,Et as r,tl as s,ii as t,Ug as u,Gn as v,Dg as w,zg as x,Ci as y,Ag as z};
