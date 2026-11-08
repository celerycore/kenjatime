class Cc{constructor({maxBytes:e=16*1024*1024,maxEntries:t=512,sizeOf:i=s=>{var r;return((r=s==null?void 0:s.rgba)==null?void 0:r.byteLength)||0}}={}){this.maxBytes=e,this.maxEntries=t,this.sizeOf=i,this.entries=new Map,this.bytes=0,this.hits=0,this.misses=0,this.evictions=0}get size(){return this.entries.size}has(e){return this.entries.has(e)}get(e){const t=this.entries.get(e);if(!t){this.misses++;return}return this.hits++,this.entries.delete(e),this.entries.set(e,t),t.value}set(e,t){this.delete(e);const i=Math.max(0,this.sizeOf(t)||0);if(i>this.maxBytes||this.maxEntries<1)return this;for(this.entries.set(e,{value:t,bytes:i}),this.bytes+=i;this.bytes>this.maxBytes||this.size>this.maxEntries;)this.delete(this.entries.keys().next().value),this.evictions++;return this}delete(e){const t=this.entries.get(e);return t?(this.bytes-=t.bytes,this.entries.delete(e)):!1}clear(){this.entries.clear(),this.bytes=0}}var ci=Uint8Array,Xn=Uint16Array,Qh=Int32Array,Pc=new ci([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Ic=new ci([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),eu=new ci([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Lc=function(n,e){for(var t=new Xn(31),i=0;i<31;++i)t[i]=e+=1<<n[i-1];for(var s=new Qh(t[30]),i=1;i<30;++i)for(var r=t[i];r<t[i+1];++r)s[r]=r-t[i]<<5|i;return{b:t,r:s}},Dc=Lc(Pc,2),Nc=Dc.b,tu=Dc.r;Nc[28]=258,tu[258]=28;var iu=Lc(Ic,0),nu=iu.b,La=new Xn(32768);for(var gt=0;gt<32768;++gt){var Xi=(gt&43690)>>1|(gt&21845)<<1;Xi=(Xi&52428)>>2|(Xi&13107)<<2,Xi=(Xi&61680)>>4|(Xi&3855)<<4,La[gt]=((Xi&65280)>>8|(Xi&255)<<8)>>1}var xs=(function(n,e,t){for(var i=n.length,s=0,r=new Xn(e);s<i;++s)n[s]&&++r[n[s]-1];var a=new Xn(e);for(s=1;s<e;++s)a[s]=a[s-1]+r[s-1]<<1;var o;if(t){o=new Xn(1<<e);var l=15-e;for(s=0;s<i;++s)if(n[s])for(var c=s<<4|n[s],f=e-n[s],h=a[n[s]-1]++<<f,u=h|(1<<f)-1;h<=u;++h)o[La[h]>>l]=c}else for(o=new Xn(i),s=0;s<i;++s)n[s]&&(o[s]=La[a[n[s]-1]++]>>15-n[s]);return o}),Ts=new ci(288);for(var gt=0;gt<144;++gt)Ts[gt]=8;for(var gt=144;gt<256;++gt)Ts[gt]=9;for(var gt=256;gt<280;++gt)Ts[gt]=7;for(var gt=280;gt<288;++gt)Ts[gt]=8;var Uc=new ci(32);for(var gt=0;gt<32;++gt)Uc[gt]=5;var su=xs(Ts,9,1),ru=xs(Uc,5,1),Xr=function(n){for(var e=n[0],t=1;t<n.length;++t)n[t]>e&&(e=n[t]);return e},ui=function(n,e,t){var i=e/8|0;return(n[i]|n[i+1]<<8)>>(e&7)&t},qr=function(n,e){var t=e/8|0;return(n[t]|n[t+1]<<8|n[t+2]<<16)>>(e&7)},au=function(n){return(n+7)/8|0},ou=function(n,e,t){return(t==null||t>n.length)&&(t=n.length),new ci(n.subarray(e,t))},lu=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],gi=function(n,e,t){var i=new Error(e||lu[n]);if(i.code=n,Error.captureStackTrace&&Error.captureStackTrace(i,gi),!t)throw i;return i},cu=function(n,e,t,i){var s=n.length,r=i?i.length:0;if(!s||e.f&&!e.l)return t||new ci(0);var a=!t,o=a||e.i!=2,l=e.i;a&&(t=new ci(s*3));var c=function(Ae){var Ve=t.length;if(Ae>Ve){var Xe=new ci(Math.max(Ve*2,Ae));Xe.set(t),t=Xe}},f=e.f||0,h=e.p||0,u=e.b||0,d=e.l,m=e.d,_=e.m,p=e.n,v=s*8;do{if(!d){f=ui(n,h,1);var S=ui(n,h+1,3);if(h+=3,S)if(S==1)d=su,m=ru,_=9,p=5;else if(S==2){var y=ui(n,h,31)+257,g=ui(n,h+10,15)+4,x=y+ui(n,h+5,31)+1;h+=14;for(var I=new ci(x),R=new ci(19),A=0;A<g;++A)R[eu[A]]=ui(n,h+A*3,7);h+=g*3;for(var F=Xr(R),N=(1<<F)-1,P=xs(R,F,1),A=0;A<x;){var B=P[ui(n,h,N)];h+=B&15;var E=B>>4;if(E<16)I[A++]=E;else{var H=0,k=0;for(E==16?(k=3+ui(n,h,3),h+=2,H=I[A-1]):E==17?(k=3+ui(n,h,7),h+=3):E==18&&(k=11+ui(n,h,127),h+=7);k--;)I[A++]=H}}var C=I.subarray(0,y),L=I.subarray(y);_=Xr(C),p=Xr(L),d=xs(C,_,1),m=xs(L,p,1)}else gi(1);else{var E=au(h)+4,T=n[E-4]|n[E-3]<<8,w=E+T;if(w>s){l&&gi(0);break}o&&c(u+T),t.set(n.subarray(E,w),u),e.b=u+=T,e.p=h=w*8,e.f=f;continue}if(h>v){l&&gi(0);break}}o&&c(u+131072);for(var G=(1<<_)-1,$=(1<<p)-1,ie=h;;ie=h){var H=d[qr(n,h)&G],ne=H>>4;if(h+=H&15,h>v){l&&gi(0);break}if(H||gi(2),ne<256)t[u++]=ne;else if(ne==256){ie=h,d=null;break}else{var X=ne-254;if(ne>264){var A=ne-257,te=Pc[A];X=ui(n,h,(1<<te)-1)+Nc[A],h+=te}var ge=m[qr(n,h)&$],xe=ge>>4;ge||gi(3),h+=ge&15;var L=nu[xe];if(xe>3){var te=Ic[xe];L+=qr(n,h)&(1<<te)-1,h+=te}if(h>v){l&&gi(0);break}o&&c(u+131072);var re=u+X;if(u<L){var Ie=r-L,lt=Math.min(L,re);for(Ie+u<0&&gi(3);u<lt;++u)t[u]=i[Ie+u]}for(;u<re;++u)t[u]=t[u-L]}}e.l=d,e.p=ie,e.b=u,e.f=f,d&&(f=1,e.m=_,e.d=m,e.n=p)}while(!f);return u!=t.length&&a?ou(t,0,u):t.subarray(0,u)},hu=new ci(0),uu=function(n,e){return((n[0]&15)!=8||n[0]>>4>7||(n[0]<<8|n[1])%31)&&gi(6,"invalid zlib data"),(n[1]>>5&1)==+!e&&gi(6,"invalid zlib data: "+(n[1]&32?"need":"unexpected")+" dictionary"),(n[1]>>3&4)+2};function fu(n,e){return cu(n.subarray(uu(n,e&&e.dictionary),-4),{i:2},e&&e.out,e&&e.dictionary)}var du=typeof TextDecoder<"u"&&new TextDecoder,pu=0;try{du.decode(hu,{stream:!0}),pu=1}catch{}function bn(n){if(!(n instanceof Uint8Array))throw Error("Text file is missing");if(n[0]===255&&n[1]===254)return new TextDecoder("utf-16le").decode(n);if(n[0]===254&&n[1]===255)return new TextDecoder("utf-16be").decode(n);try{return new TextDecoder("utf-8",{fatal:!0}).decode(n)}catch{return new TextDecoder("windows-1252").decode(n)}}function Jn(n,e="",t=!1){const i=String(n).normalize("NFC").replaceAll("\\","/");if(i.startsWith("/")||/^[a-z]:/i.test(i)||i.includes("\0"))throw Error("Unsafe archive path.");const s=e.split("/").filter(Boolean);for(const r of i.split("/"))if(!(!r||r==="."))if(r===".."){if(!t||!s.length)throw Error("Unsafe archive path.");s.pop()}else s.push(r);return s.join("/").toLowerCase()}function Br(n){const e={};let t="";for(const i of n.replace(/^\uFEFF/,"").split(/\r?\n/)){const s=i.replace(/;(?=(?:[^"']*["'][^"']*["'])*[^"']*$).*$/,"").trim(),r=s.match(/^\[(.+)\]$/);if(r){t=r[1].toLowerCase(),e[t]??(e[t]={});continue}const a=s.indexOf("=");a>0&&t&&(e[t][s.slice(0,a).trim().toLowerCase()]=s.slice(a+1).trim().replace(/^"(.*)"$/,"$1"))}return e}function mu(n){const e=i=>bn(n[i]);return Object.keys(n).filter(i=>i.endsWith(".def")).map(i=>({path:i,def:Br(e(i))})).filter(i=>{var s;return i.def.info&&((s=i.def.files)==null?void 0:s.sprite)}).map(i=>{const s=i.path.slice(0,i.path.lastIndexOf("/")+1),r=c=>Jn(c,s,!0),a=(c,f)=>{let h;try{h=r(f)}catch{h=null}const u=String(f).replaceAll("\\","/").split("/").at(-1);if(!h&&u&&u!=="."&&u!=="..")try{const p=r(u);n[p]&&(h=p)}catch{}if(c!=="stcommon"||n[h])return h;const d=i.path.indexOf("/chars/"),m=d>=0?i.path.slice(0,d+1):"",_=[m+"data/",m].flatMap(p=>{try{return[Jn(f,p,!0)]}catch{return[]}});return(u==null?void 0:u.toLowerCase())==="common1.cns"&&_.push(m+"data/common1.cns","data/common1.cns"),_.find(p=>n[p])||h},o=Object.entries(i.def.files).filter(([c,f])=>f&&/^(sprite|anim|cmd|cns|sound|stcommon|st\d*|pal\d+)$/.test(c)).map(([c,f])=>{const h=a(c,f);return{key:c,value:f,path:h,ok:!!h&&!!n[h],...h?{}:{message:"This resource is outside the ZIP. Include it in the package or use an in-package relative path."}}}),l=o.find(c=>c.key==="anim"&&c.ok);return{...i,checks:o,files:n,animations:l?Fc(e(l.path)):[],sprite:o.find(c=>c.key==="sprite"&&c.ok),palettes:o.filter(c=>/^pal\d+$/.test(c.key)).map(c=>({...c,number:Number(c.key.slice(3))}))}})}function Fc(n){var a;const e=[];let t,i,s,r;for(const[o,l]of n.replace(/^\uFEFF/,"").split(/\r?\n/).entries()){const c=l.split(";")[0].trim(),f=c.match(/^\[begin action\s+(-?\d+)\]\s*$/i);if(f){t={id:+f[1],frames:[],loopStart:0},e.push(t),i={1:[],2:[]},s={},r={};continue}if(!t||!c)continue;if(/^loopstart\s*$/i.test(c)){t.loopStart=t.frames.length;continue}const h=c.match(/^clsn([12])(default)?\s*:\s*(\d+)\s*$/i);if(h){const w=+h[1],y=+h[3];if(y>1024)throw Error(`AIR collision box limit exceeded on line ${o+1}`);const g=new Array(y);r[w]=g,h[2]?(i[w]=g,delete s[w]):s[w]=g;continue}const u=c.match(/^clsn([12])\s*\[\s*(\d+)\s*\]\s*=\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*$/i);if(u){const w=r[+u[1]],y=+u[2];if(!w||y>=w.length){(t.diagnostics??(t.diagnostics=[])).push({line:o+1,message:"AIR collision box index out of range; box ignored"});continue}w[y]=u.slice(3).map(Number);continue}const d=c.match(/^interpolate\s+(offset|blend|scale|angle)\s*$/i);if(d){const w=d[1].toLowerCase();t.frames.length?((a=t.frames.at(-1)).interpolate??(a.interpolate=[])).push(w):(t.loopInterpolate??(t.loopInterpolate=[])).push(w);continue}if(!/^-?\d+\s*,/.test(c))continue;const m=c.split(",").map(w=>w.trim()),_=m.slice(0,5).map(Number);if(m.length<5||_.some(w=>!Number.isFinite(w))||_[4]<-1)throw Error(`Invalid AIR frame on line ${o+1}`);const p=w=>{const y=s[w]??i[w];return Object.keys(y).length!==y.length&&(t.diagnostics??(t.diagnostics=[])).push({line:o+1,message:`Incomplete Clsn${w} definition; missing boxes ignored`}),y.filter(Boolean).map(g=>g.slice())},v=(w,y,g)=>{if(!m[w])return y;const x=Number(m[w]);return Number.isFinite(x)?x:((t.diagnostics??(t.diagnostics=[])).push({line:o+1,message:`Invalid AIR ${g} ignored; using ${y}`}),y)},S=v(7,1,"x-scale"),E=v(8,1,"y-scale"),T=v(9,0,"angle");t.frames.push({group:_[0],number:_[1],x:_[2],y:_[3],ticks:_[4],flip:(m[5]||"").toUpperCase(),blend:(m[6]||"").toUpperCase(),scaleX:S,scaleY:E,angle:T,clsn1:p(1),clsn2:p(2)}),s={}}return e.filter(o=>o.frames.length).map(o=>(o.loopStart>=o.frames.length&&(o.loopStart=0),o.loopInterpolate&&(o.frames.at(-1).interpolate=[...new Set([...o.frames.at(-1).interpolate||[],...o.loopInterpolate])]),delete o.loopInterpolate,o))}function gu(n){if(!(n instanceof Uint8Array)||n.length<24||new TextDecoder().decode(n.subarray(0,12))!=="ElecbyteSnd\0")throw Error("Invalid SND signature");const e=new DataView(n.buffer,n.byteOffset,n.byteLength),t=e.getUint32(16,!0),i=[],s=new Map,r=new Set;if(t>1e4)throw Error("SND sample table too large");let a=e.getUint32(20,!0);for(let o=0;o<t;o++){if(a<24||a+16>n.length||r.has(a))throw Error("Invalid SND sample link");r.add(a);const l=e.getUint32(a,!0),c=e.getUint32(a+4,!0),f=e.getUint32(a+8,!0),h=e.getUint32(a+12,!0),u=a+16;if(c<12||c>32*1024*1024||u+c>n.length)throw Error("Invalid SND sample length");const d=n.subarray(u,u+c);if(new TextDecoder().decode(d.subarray(0,4))!=="RIFF"||new TextDecoder().decode(d.subarray(8,12))!=="WAVE")throw Error("Unsupported SND sample: expected WAV");if(new DataView(d.buffer,d.byteOffset,d.byteLength).getUint32(4,!0)+8>c)throw Error("Truncated SND WAV");const m={group:f,number:h,data:d};i.push(m),s.has(`${f},${h}`)||s.set(`${f},${h}`,d),a=l}return{samples:i,get:(o,l)=>s.get(`${o},${l}`)}}function vu(n,e,t,i){const s=[137,80,78,71,13,10,26,10];if(n.length<33||!s.every((x,I)=>n[I]===x))throw Error("Invalid PNG signature");const r=new DataView(n.buffer,n.byteOffset,n.byteLength);let a,o,l,c,f,h,u=8,d=!1,m=0;const _=[];for(;u+12<=n.length;){const x=r.getUint32(u),I=u+8,R=I+x;if(x>64*1024*1024||R+4>n.length)throw Error("Invalid PNG chunk length");const A=String.fromCharCode(...n.subarray(u+4,u+8));if(A==="IHDR"){if(u!==8||x!==13||a!==void 0)throw Error("Invalid PNG header");if(a=r.getUint32(I),o=r.getUint32(I+4),c=n[I+9],l={0:1,2:3,3:1,4:2,6:4}[c],!a||!o||a*o>4e6||e!==void 0&&a!==e||t!==void 0&&o!==t)throw Error("Invalid PNG dimensions");if(n[I+8]!==8||!l||n[I+10]||n[I+11]||n[I+12])throw Error("Unsupported PNG encoding: requires non-interlaced 8-bit channels")}else{if(a===void 0)throw Error("PNG header must be first");if(A==="PLTE"){if(!x||x>768||x%3)throw Error("Invalid PNG palette");f=n.subarray(I,R)}else if(A==="tRNS")h=n.subarray(I,R);else if(A==="IDAT"){if(m+=x,m>64*1024*1024)throw Error("PNG compressed data too large");_.push(n.subarray(I,R))}else if(A==="IEND"){if(x)throw Error("Invalid PNG end chunk");d=!0;break}else if(A[0]===A[0].toUpperCase())throw Error("Unsupported PNG critical chunk: "+A)}u=R+4}if(!d||!_.length)throw Error("Truncated PNG");if(c===3&&!i&&!f)throw Error("PNG palette missing");const p=new Uint8Array(m);let v=0;for(const x of _)p.set(x,v),v+=x.length;const S=a*l,E=(S+1)*o,T=fu(p,{out:new Uint8Array(E+1)});if(T.length!==E)throw Error("Invalid PNG pixel data length");const w=new Uint8Array(S*o),y=(x,I,R)=>{const A=x+I-R,F=Math.abs(A-x),N=Math.abs(A-I),P=Math.abs(A-R);return F<=N&&F<=P?x:N<=P?I:R};for(let x=0;x<o;x++){const I=T[x*(S+1)];if(I>4)throw Error("Invalid PNG scanline filter");for(let R=0;R<S;R++){const A=x*S+R,F=R>=l?w[A-l]:0,N=x?w[A-S]:0,P=x&&R>=l?w[A-S-l]:0,B=I===0?0:I===1?F:I===2?N:I===3?Math.floor((F+N)/2):y(F,N,P);w[A]=T[x*(S+1)+1+R]+B&255}}const g=new Uint8ClampedArray(a*o*4);for(let x=0;x<a*o;x++){const I=x*l,R=x*4;if(c===3){const A=w[I],F=A*(i?4:3),N=i||f;if(F+2>=N.length)throw Error("PNG palette index out of range");g[R]=N[F],g[R+1]=N[F+1],g[R+2]=N[F+2],g[R+3]=i?N[F+3]:(h==null?void 0:h[A])??255}else if(c===0||c===4){const A=w[I];let F=c===4?w[I+1]:255;c===0&&(h==null?void 0:h.length)===2&&A===(h[0]<<8|h[1])&&(F=0),g[R]=A,g[R+1]=A,g[R+2]=A,g[R+3]=F}else{const A=w[I],F=w[I+1],N=w[I+2];let P=c===6?w[I+3]:255;c===2&&(h==null?void 0:h.length)===6&&A===(h[0]<<8|h[1])&&F===(h[2]<<8|h[3])&&N===(h[4]<<8|h[5])&&(P=0),g[R]=A,g[R+1]=F,g[R+2]=N,g[R+3]=P}}return{w:a,h:o,rgba:g,...c===3?{indices:w}:{}}}function dl(n,e,t){const i=new Uint8Array(e);let s=0,r=0,a=0,o=0;const l=()=>{if(s>=n.length)throw Error("Truncated sprite data");return n[s++]},c=(f,h)=>{if(f<1||r+f>e)throw Error("Invalid sprite run");i.fill(h,r,r+f),r+=f};if(t===0){if(n.length<e)throw Error("Truncated raw sprite");return n.slice(0,e)}if(t===2){for(;r<e;){let f=l();if((f&192)===64){let h=f&63;c(h,l())}else c(1,f)}return i}if(t===3){for(;r<e;){let f=l()+1,h=l(),u=h&127,d=h&128?l():0;for(c(f,d);u--;){let m=l();c((m>>5)+1,m&31)}}return i}if(t!==4)throw Error("Unsupported sprite compression "+t);for(;r<e;){let f=l();for(let h=0;h<8&&r<e;h++){let u=l();if(f&1<<h){let d,m;if((u&63)===0?(m=(u<<2|l())+1,d=l()+3):(a|=(u&192)>>o,o+=2,d=(u&63)+1,o<8?m=l()+1:(m=a+1,a=0,o=0)),m>r||r+d>e)throw Error("Invalid sprite backreference");for(;d--;)i[r]=i[r-m],r++}else{let d;u&224?(d=u>>5,u&=31):d=l()+8,c(d,u)}}}return i}function cr(n,e,t="SFF palette index out of range"){const i=new Uint32Array(Math.ceil(e.length/4));new Uint8Array(i.buffer).set(e);const s=new Uint8ClampedArray(n.length*4),r=new Uint32Array(s.buffer);for(let a=0;a<n.length;a++){const o=n[a];if(o*4+2>=e.length)throw Error(t);r[a]=i[o]}return s}function Oc(n,e={}){if(!(n instanceof Uint8Array)||n.length<32||new TextDecoder().decode(n.subarray(0,12))!=="ElecbyteSpr\0")throw Error("Invalid SFF signature");if(n[15]===1)return xu(n,e);if(n[15]!==2)throw Error("Unsupported SFF version");if(n.length<68)throw Error("Truncated SFF header");const t=new DataView(n.buffer,n.byteOffset,n.byteLength),i=w=>t.getUint32(w,!0),s=w=>t.getInt16(w,!0),r=w=>t.getUint16(w,!0),a=i(36),o=i(40),l=i(44),c=i(48),f=i(52),h=i(60);if(o>2e4||c>4096)throw Error("SFF table too large");if(a+o*28>n.length||l+c*16>n.length)throw Error("Truncated SFF table");const u=[],d=new Cc({maxBytes:e.cacheBytes??16*1024*1024,sizeOf:w=>{var y;return w.rgba.byteLength+(((y=w.indices)==null?void 0:y.byteLength)||0)}}),m=new Map,_=Array.from({length:c},(w,y)=>({index:y,group:r(l+y*16),number:r(l+y*16+2),colors:r(l+y*16+4)}));for(let w=0;w<o;w++){const y=a+w*28;u.push({group:r(y),number:r(y+2),w:r(y+4),h:r(y+6),x:s(y+8),y:s(y+10),link:r(y+12),format:n[y+14],depth:n[y+15],offset:i(y+16),length:i(y+20),palette:r(y+24),flags:r(y+26)})}function p(w,y=new Set){if(m.has(w))return m.get(w);if(w>=c||y.has(w))throw Error("Invalid palette link");y.add(w);const g=l+w*16,x=i(g+12);if(!x)return p(r(g+6),y);const I=f+i(g+8);if(x%4||I+x>n.length)throw Error("Invalid SFF palette length");const R=n.slice(I,I+x);if(!n[13]&&!n[14])for(let A=0;A<R.length/4;A++)R[A*4+3]=A?255:0;return m.set(w,R),R}function v(w,y=new Set){if(d.has(w))return d.get(w);if(!Number.isInteger(w)||w<0||w>=u.length||y.has(w))throw Error("Invalid sprite link");y.add(w);const g=u[w];if(!g.length){const A=v(g.link,y),F={...A,...g,w:A.w,h:A.h,rgba:A.rgba};return A.indices&&g.palette!==A.palette&&(F.rgba=cr(A.indices,p(g.palette),"Linked sprite palette index out of range")),d.set(w,F),F}if(!g.w||!g.h||g.w*g.h>4e6)throw Error("Invalid SFF sprite dimensions");const x=(g.flags&1?h:f)+g.offset;if(x+g.length>n.length||g.length<(g.format?4:0))throw Error("Truncated SFF sprite data");const I=n.subarray(x+(g.format?4:0),x+g.length);let R;if(g.format>=10&&g.format<=12)R={...g,...vu(I,g.w,g.h,g.format===10&&c?p(g.palette):void 0)};else{if(g.depth!==8&&g.depth!==5)throw Error("Unsupported non-indexed SFF compression: "+g.format);const A=dl(I,g.w*g.h,g.format),F=cr(A,p(g.palette));R={...g,rgba:F,indices:A}}return d.set(w,R),R}function S(w,y,g){const x=v(w);if(!x.indices)return x;const I=_.find(F=>F.group===y&&F.number===g);if(!I)throw Error(`Palette ${y},${g} does not exist`);const R=_[x.palette];if(R&&Math.ceil(Math.log2(R.colors))!==Math.ceil(Math.log2(I.colors)))return x;const A=cr(x.indices,p(I.index),"Palette depth does not match indexed sprite");return{...x,rgba:A}}function E(w,y=new Set){if(!Number.isInteger(w)||w<0||w>=u.length||y.has(w))throw Error("Invalid sprite link");y.add(w);const g=u[w];if(!g.length){const I=E(g.link,y);return I?{...I,...g,w:I.w,h:I.h,colors:p(g.palette)}:null}if(!g.w||!g.h||g.w*g.h>4e6)throw Error("Invalid SFF sprite dimensions");if(g.format>=10||![5,8].includes(g.depth))return null;const x=(g.flags&1?h:f)+g.offset;if(x+g.length>n.length||g.length<(g.format?4:0))throw Error("Truncated SFF sprite data");return{...g,indices:dl(n.subarray(x+(g.format?4:0),x+g.length),g.w*g.h,g.format),colors:p(g.palette)}}return{sprites:u,decode:v,decodeIndexed:E,decodeWithPalette:S,paletteColors:(w,y)=>{const g=_.find(x=>x.group===w&&x.number===y);if(!g)throw Error(`Palette ${w},${y} does not exist`);return p(g.index).slice()},palettes:_,version:2,clearDecodedCache:()=>d.clear(),cacheStats:()=>({bytes:d.bytes,entries:d.size,evictions:d.evictions})}}function xu(n,{externalPalettes:e=new Map,cacheBytes:t=16*1024*1024}={}){var g;const i=new DataView(n.buffer,n.byteOffset,n.byteLength),s=x=>i.getUint32(x,!0),r=x=>i.getUint16(x,!0),a=x=>i.getInt16(x,!0),o=[],l=[],c=[],f=new Set,h=s(20);let u=s(24),d=-1,m=-1;if(h>2e4)throw Error("SFF table too large");const _=x=>{const I=new Uint8Array(1024);for(let R=0;R<256;R++)I.set([x[R*3],x[R*3+1],x[R*3+2],R?255:0],R*4);return c.push(I),c.length-1};for(let x=0;x<h;x++){if(u<32||u+32>n.length||f.has(u))throw Error("Invalid SFF v1 sprite table link");f.add(u);const I=s(u+4),R={group:r(u+12),number:r(u+14),x:a(u+8),y:a(u+10),link:r(u+16),offset:u+32,length:I,shared:n[u+18],palette:d};if(R.offset+I>n.length)throw Error("Truncated SFF v1 sprite");if(I){const A=I>=897&&n[R.offset+I-769]===12;(!R.shared||d<0)&&A&&(R.palette=_(n.subarray(R.offset+I-768,R.offset+I))),R.palette<0&&e.has(1)&&(c.push(e.get(1)),R.palette=c.length-1),R.palette>=0&&m<0&&(m=R.palette),R.group===0&&R.number===0&&R.palette>=0&&(m=R.palette),d=R.palette}else R.palette=void 0;if(o.push(R),u=s(u),!u&&x+1<h)throw Error("Truncated SFF v1 sprite table")}const p=c[m];if(p)for(const x of o)x.palette>=0&&((g=c[x.palette])!=null&&g.every((I,R)=>I===p[R]))&&(x.palette=m);for(let x=0;x<c.length;x++)l.push({index:x,group:x===m?1:0,number:x===m?1:x+1,colors:256});for(const[x,I]of e){if(!(I instanceof Uint8Array)||I.length!==1024||!Number.isInteger(x)||x<1||x>256)throw Error("Invalid external SFF palette");if(x===1&&m>=0)c[m]=I;else{const R=c.length;c.push(I),l.push({index:R,group:1,number:x,colors:256})}}const v=new Cc({maxBytes:t,sizeOf:x=>{var I;return x.rgba.byteLength+(((I=x.indices)==null?void 0:I.byteLength)||0)}});function S(x,I){return{...x,rgba:cr(x.indices,I)}}function E(x,I=new Set){if(v.has(x))return v.get(x);if(!Number.isInteger(x)||x<0||x>=o.length||I.has(x))throw Error("Invalid SFF v1 sprite link");I.add(x);const R=o[x];if(!R.length){const ne=E(R.link,I);R.palette=ne.palette;const X={...ne,...R,w:ne.w,h:ne.h};return v.set(x,X),X}const A=n.subarray(R.offset,R.offset+R.length);if(A.length<128||A[0]!==10||A[2]!==1||A[3]!==8||A[65]!==1)throw Error("Only indexed 8-bit PCX sprites are supported");const F=new DataView(A.buffer,A.byteOffset,A.byteLength),N=F.getUint16(8,!0)-F.getUint16(4,!0)+1,P=F.getUint16(10,!0)-F.getUint16(6,!0)+1,B=F.getUint16(66,!0);if(N<=0||P<=0||N*P>4e6||B*P>8e6||B<N)throw Error("Invalid PCX dimensions");const H=c[R.palette];if(!H)throw Error("PCX palette missing");const k=A.length>=897&&A[A.length-769]===12?A.length-769:A.length,C=new Uint8Array(B*P);let L=128,G=0;for(;G<C.length;){if(L>=k)throw Error("Truncated PCX");let ne=A[L++],X=1;if((ne&192)===192){if(X=ne&63,L>=k)throw Error("Truncated PCX run");ne=A[L++]}if(!X||G+X>C.length)throw Error("Invalid PCX run");C.fill(ne,G,G+X),G+=X}const $=new Uint8Array(N*P);for(let ne=0;ne<P;ne++)$.set(C.subarray(ne*B,ne*B+N),ne*N);const ie=S({...R,w:N,h:P,indices:$},H);return v.set(x,ie),ie}function T(x,I,R){const A=E(x),F=l.find(N=>N.group===I&&N.number===R);if(!F)throw Error(`Palette ${I},${R} does not exist`);return S(A,c[F.index])}return{sprites:o,palettes:l,decode:E,decodeIndexed:x=>{const I=E(x);return{...I,colors:c[I.palette]}},decodeWithPalette:T,paletteColors:(x,I)=>{const R=l.find(A=>A.group===x&&A.number===I);if(!R)throw Error(`Palette ${x},${I} does not exist`);return c[R.index].slice()},version:1,clearDecodedCache:()=>v.clear(),cacheStats:()=>({bytes:v.bytes,entries:v.size,evictions:v.evictions})}}function _u(n){if(!(n instanceof Uint8Array)||![768,772].includes(n.length))throw Error("ACT palette must contain 768 RGB bytes, with an optional 4-byte footer.");const e=new Uint8Array(1024);for(let t=0;t<256;t++){const i=(255-t)*3;e.set([n[i],n[i+1],n[i+2],t?255:0],t*4)}return e}const $r=new WeakMap;function hr(n){let e=n,t=0;for(;e&&t++<256;){if(e.ownPal||e.ownpal)return e;const i=e.paletteParent||e.parent||e.owner;if(!i||i===e)return e;e=i}return e}const Do=n=>new Map([...n||[]].map(([e,t])=>[e,[...t]]));function ur(n){const e={...n};for(const[t,i]of[["add",[0,0,0]],["mul",[256,256,256]],["sinadd",[0,0,0,0]]])if(e[t]!==void 0){const s=Array.isArray(e[t])?e[t]:[e[t]];e[t]=i.map((r,a)=>{const o=Math.trunc(Number(s[a]??r));return t==="mul"?Math.max(0,o):o})}return e.time!==void 0&&(e.time=Math.trunc(Number(e.time))),e.color!==void 0&&(e.color=Math.max(0,Math.min(256,Math.trunc(Number(e.color))))),e.invertall!==void 0&&(e.invertall=+!!e.invertall),e}function No(n,e,t){const i=Array.isArray(t)?t:[t],s=[Math.trunc(Number(i[0]??-1)),Math.trunc(Number(i[1]??0))];if(s[0]!==-1){if(s[0]<0||s[1]<0)throw Error("Invalid RemapPal palette pair.");Bc(e,[-1,0],s),n.clear(),n.set("*",s)}}function Bc(n,e,t){var a,o;if(!((a=n.sprite)!=null&&a.path)||!((o=n.files)!=null&&o[n.sprite.path]))return;const i=kc(n),s=l=>i.palettes.find(c=>c.group===l[0]&&c.number===l[1]),r=s(t);if(!r)throw Error(`RemapPal destination palette ${t.join(",")} does not exist.`);if(e[0]!==-1){const l=s(e);if(!l)throw Error(`RemapPal source palette ${e.join(",")} does not exist.`);if(l.colors&&r.colors&&Math.ceil(Math.log2(l.colors))!==Math.ceil(Math.log2(r.colors)))throw Error("RemapPal source and destination color depths differ.")}}function kc(n){var o,l;if($r.has(n))return $r.get(n);const e=[],t=new Map,i=n.files,s=n.path.slice(0,n.path.lastIndexOf("/")+1);for(const[c,f]of Object.entries(n.def.files||{}))if(/^pal\d+$/.test(c)&&f)try{const h=Number(c.slice(3));if(h<1||h>256)throw Error(`Invalid palette number ${h}.`);const u=(o=n.checks)==null?void 0:o.find(m=>m.key===c);let d;if(u)d=u.ok?u.path:null;else try{d=Jn(f,s,!0)}catch{d=null}if(!d||!i[d])throw Error(`Palette file is missing from the ZIP: ${f}`);t.set(h,_u(i[d]))}catch(h){e.push({type:"palette",source:n.path,line:0,message:h.message})}const r=Oc(i[n.sprite.path],{externalPalettes:t});r.diagnostics=e,r.selectablePalettes=[...new Set((r.palettes||[]).filter(c=>c.group===1&&c.number>=1&&c.number<=12).map(c=>c.number))].sort((c,f)=>c-f),r.selectablePalettes.length||(r.selectablePalettes=[1]);const a=String(((l=n.def.info)==null?void 0:l["pal.defaults"])||"1").split(",").map(Number);return r.defaultPalette=a.find(c=>r.selectablePalettes.includes(c))??r.selectablePalettes[0],$r.set(n,r),r}function yu(n,e){var c,f;const t=((c=n.world)==null?void 0:c.orderedPhases)&&n.isProjectile&&n.removalReason==="expire",i=n.hitDef||(t?n.proximityHitDef:null);if(n===e||n.destroyed||!i&&(!((f=n.world)!=null&&f.orderedPhases)||n.isProjectile)||n.moveType!=="A"||n.isProjectile&&((n.removed||n.removing)&&!(t&&n.drawVisible)||n.remainingHits<=0||n.owner===e||!/^[SCA]\s*,\s*[NSH][ATP]$/i.test(String(i.attr??"").trim())))return!1;const s=String((i==null?void 0:i.affectteam)??"E").trim().toUpperCase(),r=!!(n.world&&e.world&&n.teamSide===e.teamSide);if(s==="E"&&r||s==="F"&&!r)return!1;const a=(i==null?void 0:i.coordinateScale)??n.coordinateScale??1;let o;(i==null?void 0:i["guard.dist"])!==void 0?o=i["guard.dist"]*a:n.isProjectile?o=n.guardDistance:n.attackDist!==void 0?o=n.attackDist*n.coordinateScale:o=n.constant("size.attack.dist")*n.coordinateScale;const l=(e.pos.x-n.pos.x)*n.facing;return l>0&&l<o}function Hc(n,e){for(const t of e)if(yu(t,n))return!0;return!1}class mt extends Error{constructor(e,t=""){super(e),this.name="ExpressionError",this.source=t}}class Qi extends mt{constructor(e,t=""){super(e,t),this.name="UnsupportedExpressionError"}}class Nt extends mt{constructor(e,t=""){super(e,t),this.name="BottomError",this.bottom=!0}}const Da=8192,pl=2048,ml=96,Su=8192,Tn=new Map,Mu={"||":1,"^^":2,"&&":3,"|":4,"^":5,"&":6,":=":7,"=":8,"!=":8,"<":9,">":9,"<=":9,">=":9,"+":10,"-":10,"*":11,"/":11,"%":11,"**":12},fr=new Set(["=","!=","<","<=",">",">="]),wu=new Set(["parent","root","helper","target","partner","enemy","enemynear","playerid","p2"]),bu=new Set(["pos","vel","p2dist","p2bodydist","parentdist","rootdist","screenpos","hitvel","camerapos"]),zc=new Set(["s","c","a","h","l","i","n","v","u"]),Eu=new Set(["const","gethitvar","stagevar"]),Tu=new Set(["xveladd","yveladd","xoff","yoff","zoff","xvel","yvel","yaccel","fall.xvel","fall.yvel","fall.envshake.freq","fall.envshake.phase"]),Au=/^(?:fvar|sysfvar|const240p|const480p|const720p|pos [xy]|vel [xy]|p2dist [xy]|p2bodydist [xy]|parentdist [xy]|rootdist [xy]|screenpos [xy]|hitvel [xy]|camerapos [xy]|camerazoom|gamewidth|gameheight|screenwidth|screenheight|leftedge|rightedge|topedge|bottomedge|(?:front|back)edge(?:body)?dist|frontedge|backedge)$/,Ru=n=>/^(?:velocity\.|movement\.(?!airjump\.)|size\.[xy]scale$|data\.fall\.defence_mul$)/.test(n),wr={abs:[1,Math.abs],ceil:[1,Math.ceil],floor:[1,Math.floor],exp:[1,Math.exp],ln:[1,Math.log],log:[2,(n,e)=>Math.log(e)/Math.log(n)],sin:[1,Math.sin],cos:[1,Math.cos],tan:[1,Math.tan],asin:[1,Math.asin],acos:[1,Math.acos],atan:[1,Math.atan],sqrt:[1,Math.sqrt],min:[2,Math.min],max:[2,Math.max]},gl=new Set(["var","fvar","sysvar","sysfvar","animelemtime","animelemno","animexist","selfanimexist","const","const240p","const480p","const720p","gethitvar","stagevar","numprojid","playeridexist","projcanceltime","projcontacttime","projguardedtime","projhittime"]),Cu=new Set(["numhelper","numexplod","numtarget","ishelper"]),Pu=new Set(["name","authorname","p1name","p2name","p3name","p4name"]),Iu=new Set("time stateno prevstateno anim animtime ctrl statetype movetype physics life lifemax power powermax facing alive gametime hitpausetime hitshakeover hitover movecontact movehit moveguarded movereversed hitcount uniqhitcount numenemy numpartner numproj roundstate roundno matchno teamside teampower tickspersecond ailevel palno id name authorname p1name p2name p3name p4name win lose drawgame inguarddist canrecover roundsexisted hitfall ishometeam teammode leftedge rightedge topedge bottomedge frontedge backedge frontedgedist backedgedist frontedgebodydist backedgebodydist gamewidth gameheight screenwidth screenheight camerazoom winko wintime winperfect loseko losetime loseperfect random pi e".split(" "));function Lu(n){if(typeof n!="string")throw new mt("Expression must be text.");if(n.length>Da)throw new mt(`Expression exceeds ${Da} characters.`);const e=[];let t=0;for(;t<n.length;){if(/\s/.test(n[t])){t++;continue}const i=t,s=n.slice(t);let r;if(n[t]==='"'){t++;let a="",o=!1;for(;t<n.length;){const l=n[t++];if(l==='"'){o=!0;break}l==="\\"&&n[t]==='"'?(a+='"',t++):a+=l}if(!o)throw new mt(`Unterminated string at ${i}.`,n);e.push({type:"string",value:a,position:i})}else if(r=s.match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/)){const a=Number(r[0]);if(!Number.isFinite(a))throw new mt(`Invalid number at ${i}.`,n);e.push({type:"number",value:a,float:/[.eE]/.test(r[0]),position:i}),t+=r[0].length}else if(r=s.match(/^[a-z_][a-z0-9_.]*/i))e.push({type:"name",value:r[0].toLowerCase(),position:i}),t+=r[0].length;else if(r=s.match(/^(?:\*\*|:=|<=|>=|!=|&&|\|\||\^\^|[+\-*/%!~&|^=<>()[\],])/))e.push({type:"operator",value:r[0],position:i}),t+=r[0].length;else throw new Qi(`Unsupported token at ${i}: ${n[t]}`,n);if(e.length>pl)throw new mt(`Expression exceeds ${pl} tokens.`,n)}return e.push({type:"end",value:"",position:t}),e}class Du{constructor(e){this.source=e,this.tokens=Lu(e),this.index=0,this.depth=0}peek(e=0){return this.tokens[this.index+e]||this.tokens.at(-1)}take(){return this.tokens[this.index++]}accept(e){return this.peek().value!==e?!1:(this.index++,!0)}expect(e){this.accept(e)||this.fail(`Expected "${e}"`)}fail(e){throw new mt(`${e} at ${this.peek().position}.`,this.source)}signedInteger(){const e=this.accept("-")?-1:(this.accept("+"),1),t=this.take();return(t.type!=="number"||t.float)&&this.fail("Expected an integer literal"),{kind:"number",value:e*t.value,float:!1}}parse(e=0){++this.depth>ml&&this.fail(`Expression nesting exceeds ${ml}`);let t=this.prefix();for(;;){const i=this.peek().value,s=Mu[i];if(s===void 0||s<e)break;if(this.take(),(i==="="||i==="!=")&&(this.peek().value==="["||this.isOpenInterval())){const r=this.take().value,a=this.parse();this.expect(",");const o=this.parse(),l=this.take().value;l!=="]"&&l!==")"&&this.fail("Expected an interval endpoint"),t={kind:"range",op:i,left:t,low:a,high:o,includeLow:r==="[",includeHigh:l==="]"}}else{const r=this.parse(s+(i===":="?0:1));i===":="?((t.kind!=="call"||!["var","fvar"].includes(t.name)||t.args.length!==1)&&this.fail("Assignment requires var(index) or fvar(index)"),t={kind:"assign",left:t,right:r}):t={kind:"binary",op:i,left:t,right:r}}}return this.depth--,t}isOpenInterval(){if(this.peek().value!=="(")return!1;const e=this.index,t=this.depth;try{return this.prefix(),!1}catch{}finally{this.index=e,this.depth=t}let i=0;for(let s=this.index;s<this.tokens.length;s++){const r=this.tokens[s].value;if(r==="("||r==="[")i++;else if(r===")"||r==="]"){if(--i===0)return!1}else if(r===","&&i===1)return!0}return!1}prefix(){const e=this.take();if(e.type==="number")return{kind:"number",value:e.value,float:e.float};if(e.type==="string")return{kind:"string",value:e.value};if(["+","-","!","~"].includes(e.value))return{kind:"unary",op:e.value,value:this.parse(13)};if(e.value==="("){const r=this.parse();return this.expect(")"),r}e.type!=="name"&&this.fail("Expected a value");const t=e.value;if(Pu.has(t)&&["=","!="].includes(this.peek().value)){const r=this.take().value,a=this.take();return a.type!=="string"&&this.fail(`${t} comparison requires a quoted name`),{kind:"binary",op:r,left:{kind:"name",name:t},right:{kind:"string",value:a.value}}}if(["statetype","movetype","p2statetype","p2movetype"].includes(t)&&["=","!="].includes(this.peek().value)&&this.peek(1).type==="name"&&zc.has(this.peek(1).value)){const r=this.take().value,a=this.take().value;return{kind:"binary",op:r,left:{kind:"name",name:t},right:{kind:"string",value:a.toUpperCase()}}}if(t==="teammode"&&["=","!="].includes(this.peek().value)){const r=this.take().value,a=this.take();return(a.type!=="name"||!["single","simul","turns"].includes(a.value))&&this.fail("TeamMode requires Single, Simul or Turns"),{kind:"binary",op:r,left:{kind:"name",name:t},right:{kind:"string",value:a.value}}}const i=t.match(/^proj(hit|contact|guarded)(\d*)$/);if(i&&this.accept("=")){const r=this.signedInteger();[0,1].includes(r.value)||this.fail("Projectile condition requires 0 or 1");let a="=",o={kind:"number",value:1,float:!1};return this.accept(",")&&(fr.has(this.peek().value)&&(a=this.take().value),o=this.signedInteger()),{kind:"legacyprojectile",name:`proj${i[1]}time`,id:Number(i[2]||0),expected:r.value,op:a,time:o}}if(t==="command"&&["=","!="].includes(this.peek().value)){const r=this.take().value,a=this.take();return a.type!=="string"&&this.fail("Command comparison requires a quoted name"),{kind:"command",op:r,command:a.value}}if(t==="animelem"&&this.accept("=")){const r=this.signedInteger();let a="=",o={kind:"number",value:0,float:!1};return this.accept(",")&&(fr.has(this.peek().value)&&(a=this.take().value),o=this.signedInteger()),{kind:"legacyanim",element:r,op:a,time:o}}if(t==="timemod"&&fr.has(this.peek().value)){const r=this.take().value,a=this.signedInteger();return this.expect(","),{kind:"legacytime",op:r,divisor:a,remainder:this.signedInteger()}}if(t==="hitdefattr"&&["=","!="].includes(this.peek().value)){const r=this.take().value,a=this.take();(a.type!=="name"||!/^[sca]+$/.test(a.value))&&this.fail("HitDefAttr requires state letters S, C or A");const o=[a.value.toUpperCase()];this.expect(",");do{const l=this.take();(l.type!=="name"||!/^[nsha][atp]$/.test(l.value))&&this.fail("HitDefAttr requires attack attributes such as NA or ST"),o.push(l.value.toUpperCase())}while(this.peek().value===","&&this.peek(1).type==="name"&&/^[nsha][atp]$/.test(this.peek(1).value)&&this.accept(","));return{kind:"legacyattribute",op:r,attributes:o}}let s;if(this.accept("(")){const r=[];if(!this.accept(")")){do r.push(this.parse());while(this.accept(","));this.expect(")")}(gl.has(t)||Cu.has(t))&&r.length!==1&&this.fail(`${t} requires one argument`),Iu.has(t)&&r.length&&this.fail(`${t} requires no arguments`);const a=Object.hasOwn(wr,t)?wr[t][0]:["cond","ifelse"].includes(t)?3:null;a!==null&&r.length!==a&&this.fail(`${t} requires ${a} argument(s)`),s={kind:"call",name:t,args:r}}else{gl.has(t)&&this.fail(`${t} requires a parameter list`);let r=t;bu.has(t)&&this.peek().type==="name"&&/^[xy]$/.test(this.peek().value)&&(r+=" "+this.take().value),s={kind:"name",name:r}}return wu.has(t)&&this.accept(",")?{kind:"redirect",target:s,value:this.prefix()}:s}}function gn(n){if(typeof n!="string"||n.length>Da)throw new mt("Invalid or oversized argument list.");const e=[];let t=0,i=!1,s=!1,r=0;for(let a=0;a<n.length;a++){const o=n[a];if(o==='"'&&!s&&(i=!i),s=o==="\\"&&!s,!i)if(o==="("||o==="[")t++;else if(o===")"||o==="]"){if(--t<0)throw new mt("Unbalanced argument list.")}else o===","&&t===0&&(e.push(n.slice(r,a).trim()),r=a+1)}if(i||t)throw new mt("Unbalanced argument list.");return e.push(n.slice(r).trim()),e}function Gc(n){const e=new Du(n),t=e.parse();e.peek().type!=="end"&&e.fail("Unexpected token");const i=s=>{for(const r of Object.values(s))Array.isArray(r)?(r.forEach(a=>a&&typeof a=="object"&&i(a)),Object.freeze(r)):r&&typeof r=="object"&&i(r);return Object.freeze(s)};return i(t)}function Vc(n){if(Tn.has(n))return Tn.get(n);const e=Gc(n),t=i=>Nu(e,i||{},n);return Tn.size>=512&&Tn.delete(Tn.keys().next().value),Tn.set(n,t),t}function Na(n,e={}){return Vc(n)(e)}function Ua(n,e={}){return Vc(n)({...e,typedResult:!0})}const Yt=(n,e=!1)=>{if(typeof n!="number"||!Number.isFinite(n))throw new Nt("Expression produced a non-finite number.");const t=e?Math.fround(n):n|0;if(!Number.isFinite(t))throw new Nt("Expression produced a non-finite number.");return{value:t,float:e}},Et=n=>Yt(n,!1);function Wt(n){if(n.bottom)throw n.error;if(typeof n.value!="number")throw new Nt("A numeric value is required.");return n.value}function rs(n){return Wt(n)!==0}function Ds(n,e,t){if(e.bottom||t.bottom)throw(e.bottom?e:t).error;if(e.absent||t.absent){if(!["=","!="].includes(n))throw new mt("Only equality comparisons are allowed for strings.");return Et(+(n==="!="))}if(typeof e.value!=typeof t.value)throw new Nt("Cannot compare a string with a number.");if(typeof e.value=="string"&&!["=","!="].includes(n))throw new mt("Only equality comparisons are allowed for strings.");switch(typeof e.value=="number"&&(e.float||t.float)&&(e={value:Math.fround(e.value)},t={value:Math.fround(t.value)}),n){case"=":return Et(+(e.value===t.value));case"!=":return Et(+(e.value!==t.value));case"<":return Et(+(e.value<t.value));case"<=":return Et(+(e.value<=t.value));case">":return Et(+(e.value>t.value));case">=":return Et(+(e.value>=t.value))}}function Nu(n,e,t){let i=0;const s=(a,o,l)=>{if(typeof e.resolve!="function")throw new Qi(`Unsupported trigger: ${a}.`,t);const c=e.resolve(a,o,l);if(typeof c=="number")return Yt(c,Au.test(a)||a==="gethitvar"&&Tu.has(String(o[0]).toLowerCase())||a==="const"&&Ru(String(o[0]).toLowerCase())||!Number.isInteger(c));if(typeof c=="boolean")return Et(Number(c));if(typeof c=="string")return{value:c};if(c!=null&&c.absent)return{value:"",absent:!0};if(c&&typeof c.value=="number")return Yt(c.value,c.type==="float"||c.float);throw new Qi(`Trigger ${a} returned no supported value.`,t)},r=(a,o=null)=>{var l,c,f;if(++i>Su)throw new mt("Expression evaluation budget exceeded.",t);try{switch(a.kind){case"number":return Yt(a.value,a.float);case"string":return{value:a.value};case"name":return a.name==="pi"?Yt(Math.PI,!0):a.name==="e"?Yt(Math.E,!0):zc.has(a.name)?{value:a.name.toUpperCase()}:s(a.name,[],o);case"unary":{const h=r(a.value,o),u=Wt(h);if(a.op==="+")return h;if(a.op==="-")return Yt(-u,h.float);if(a.op==="!")return Et(+(u===0));if(h.float)throw new Nt("Bitwise operators require integers.",t);return Et(~u)}case"redirect":{if(o)throw new Qi("Recursive trigger redirection is unsupported by MUGEN 1.1.",t);const h=((l=a.target.args)==null?void 0:l.map(u=>Wt(r(u))))||[];return r(a.value,{name:a.target.name,args:h})}case"assign":{if(o)throw new mt("Variable assignment cannot be redirected.",t);if(typeof e.assign!="function")throw new Qi("Variable assignment is unavailable.",t);const h=a.left.args.map(p=>Wt(r(p))),u=r(a.right),d=Wt(u),m=a.left.name==="var"?Math.trunc(d)|0:Math.fround(d),_=e.assign(a.left.name,h,m);return Yt(typeof _=="number"?_:m,a.left.name==="fvar")}case"range":{const h=[r(a.left,o),r(a.low,o),r(a.high,o)],u=h.some(v=>v.float),[d,m,_]=h.map(v=>u?Math.fround(Wt(v)):Wt(v)),p=(a.includeLow?d>=m:d>m)&&(a.includeHigh?d<=_:d<_);return Et(Number(a.op==="="?p:!p))}case"legacyanim":return Ds(a.op,s("animelemtime",[a.element.value],o),r(a.time,o));case"legacytime":{const h=a.divisor.value;if(h<=0)throw new mt("TimeMod divisor must be positive.",t);return Ds(a.op,Et(Wt(s("time",[],o))%h),r(a.remainder,o))}case"legacyprojectile":{const h=s(a.name,[a.id],o),u=Wt(h)>=0&&rs(Ds(a.op,h,r(a.time,o)));return Et(Number(a.expected?u:!u))}case"legacyattribute":{const h=rs(s("hitdefattr",a.attributes,o));return Et(Number(a.op==="="?h:!h))}case"command":{const h=rs(s("command",[a.command],o));return Et(Number(a.op==="="?h:!h))}case"call":{if(a.name==="cond"||a.name==="ifelse"){if(a.args.length!==3)throw new mt(`${a.name} requires three arguments.`,t);const m=r(a.args[0],o);if(a.name==="cond")return r(a.args[rs(m)?1:2],o);const _=[r(a.args[1],o),r(a.args[2],o)];for(const v of _)v.bottom&&((c=e.onWarning)==null||c.call(e,v.error));const p=rs(m)?0:1;return _[p]}if(Object.hasOwn(wr,a.name)){const[m,_]=wr[a.name];if(a.args.length!==m)throw new mt(`${a.name} requires ${m} argument(s).`,t);const p=a.args.map(E=>r(E,o)),v=_(...p.map(E=>["abs","min","max"].includes(a.name)?Wt(E):Math.fround(Wt(E)))),S=!["ceil","floor"].includes(a.name)&&(a.name!=="abs"||p[0].float)&&(!["min","max"].includes(a.name)||p.some(E=>E.float));return Yt(v,S)}const h=a.args.map(m=>Eu.has(a.name)&&m.kind==="name"?{value:m.name}:r(m,o)),u=h.find(m=>m.bottom);if(u)throw u.error;const d=h.map(m=>m.value);return s(a.name,d,o)}case"binary":{const h=r(a.left,o),u=r(a.right,o);if(fr.has(a.op))return Ds(a.op,h,u);const d=h.float||u.float,m=d?Math.fround(Wt(h)):Wt(h),_=d?Math.fround(Wt(u)):Wt(u);switch(a.op){case"+":return Yt(m+_,d);case"-":return Yt(m-_,d);case"*":return Yt(d?m*_:Math.imul(m,_),d);case"/":if(_===0)throw new Nt("Division by zero.",t);return Yt(d?m/_:Math.trunc(m/_),d);case"%":if(d||_===0)throw new Nt("Remainder requires integers and a nonzero divisor.",t);return Et(m%_);case"**":{const p=d||m<0||_<0;let v=m**_;return!p&&v>2147483647&&(v=2147483647,(f=e.onWarning)==null||f.call(e,new mt("Integer exponent overflow.",t))),Yt(v,p)}case"&&":return Et(+(m!==0&&_!==0));case"||":return Et(+(m!==0||_!==0));case"^^":return Et(+(m!==0!=(_!==0)));case"&":case"|":case"^":if(d)throw new Nt("Bitwise operators require integers.",t);return Et(a.op==="&"?m&_:a.op==="|"?m|_:m^_);default:throw new Qi(`Unsupported operator ${a.op}.`,t)}}default:throw new mt("Invalid compiled expression.",t)}}catch(h){if(h!=null&&h.bottom)return{bottom:!0,error:h};throw h}};try{const a=r(n);if(a.bottom)throw a.error;return e.typedResult?a:a.value}catch(a){throw a instanceof mt?(a.source||(a.source=t),a):a!=null&&a.bottom?new Nt(a.message||"Expression evaluated to bottom.",t):new mt((a==null?void 0:a.message)||"Trigger evaluation failed.",t)}}function Wc(n,e={},t=!1){var d,m,_,p;const i=n.coordinateScale||1,[s=0,r=0]=e[t?"offset":"pos"]||[0,0],a=String(e.postype||"p1").toLowerCase(),o=((d=n.world)==null?void 0:d.view.left)??((m=n.world)==null?void 0:m.leftBound)??-160,l=((_=n.world)==null?void 0:_.view.right)??((p=n.world)==null?void 0:p.rightBound)??160,c=n.opponent||n;let f=n.pos.x,h=n.facing,u=n.facing;if(a==="p2")f=c.pos.x,t||(h=u=c.facing);else if(a==="front")f=n.facing>0?l:o;else if(a==="back")f=n.facing>0?o:l,t||(h=n.facing);else if(a==="left"||a==="right")f=a==="left"?o:l,t||(h=u=1);else if(a!=="p1")throw Error(`Unsupported spawn postype: ${a}`);return{pos:{x:f+Number(s)*i*h,y:n.pos.y+Number(r)*i},facing:u*(Number(e.facing??1)<0?-1:1)}}const Xc=8192;function qc(n){if(!/^"[\s\S]*"$/.test(n))throw Error("Text must be enclosed in double quotes.");if(n.length>Xc)throw Error("Debug text exceeds 8192 characters.");return n.slice(1,-1).replace(/\\([\s\S])/g,(e,t)=>{if(t==="n")return`
`;if(t==="t")return"    ";if(t==="\\"||t==='"')return t;throw Error(`Unsupported text escape \\${t}.`)})}function Uu(n){const e=qc(n),t=[];let i=0,s=0;for(let r=0;r<e.length;r++)if(e[r]==="%"){if(t.push(e.slice(i,r)),e[r+1]==="%"){t.push("%"),r++,i=r+1;continue}const a=/^%([-+ #0]*)(\d*)(?:\.(\d*))?([difFeEgG])/.exec(e.slice(r));if(!a)throw Error("Unsupported clipboard format specifier.");const o=Number(a[2]||0),l=a[3]===void 0?void 0:Number(a[3]||0);if(o>512||l>20)throw Error("Clipboard format width or precision exceeds supported bounds.");t.push({flags:a[1],width:o,precision:l,spec:a[4]}),s++,r+=a[0].length-1,i=r+1}if(t.push(e.slice(i)),s>6)throw Error("Clipboard format accepts at most 6 numeric parameters.");return{parts:t,count:s}}function Fu({flags:n,width:e,precision:t,spec:i},{value:s,float:r}){if(typeof s!="number"||!Number.isFinite(s))throw Error("Clipboard parameters must be finite numbers.");r===void 0&&(r=!Number.isInteger(s)),/[di]/.test(i)===!!r&&(i=r?"f":"d",n="",e=0,t=void 0);const a=s<0||Object.is(s,-0),o=Math.abs(s);let l;if(/[di]/.test(i))l=t===0&&o===0?"":Math.trunc(o).toString().padStart(t??0,"0");else if(/[fF]/.test(i))l=o.toFixed(t??6);else if(/[eE]/.test(i))l=o.toExponential(t??6);else{const f=Math.max(1,t??6),h=Number(o.toPrecision(f)),u=h?Math.floor(Math.log10(h)):0;l=u<-4||u>=f?o.toExponential(f-1):o.toFixed(Math.max(0,f-u-1)),n.includes("#")||(l=l.replace(/(\.\d*?[1-9])0+(?=e|$)/,"$1").replace(/\.0*(?=e|$)/,""))}n.includes("#")&&!l.includes(".")&&(l=l.replace(/e|$/i,"."+(l.includes("e")?"e":""))),l=l.replace(/e([+-])(\d+)$/i,(f,h,u)=>"e"+h+u.padStart(2,"0")),/[FEG]/.test(i)&&(l=l.toUpperCase());const c=a?"-":n.includes("+")?"+":n.includes(" ")?" ":"";return n.includes("0")&&!n.includes("-")&&(t===void 0||!/[di]/.test(i))?c+l.padStart(Math.max(0,e-c.length),"0"):(l=c+l,n.includes("-")?l.padEnd(e):l.padStart(e))}function Ou(n,e){if(e.length!==n.count)throw Error(`Clipboard format requires ${n.count} parameters, received ${e.length}.`);let t=0;const i=n.parts.map(s=>typeof s=="string"?s:Fu(s,e[t++])).join("");if(i.length>Xc)throw Error("Formatted clipboard exceeds 8192 characters.");return i}const Yr=n=>{if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(String(n).trim()))throw Error("ForceFeedback parameters require numeric constants.");const e=Number(n);if(!Number.isFinite(e))throw Error("ForceFeedback requires finite constants.");return e};function Bu(n){const e=String(n.waveform??"sine").replace(/^"(.*)"$/,"$1").toLowerCase();if(!["sine","square","sinesquare","off"].includes(e))throw Error(`Invalid ForceFeedback waveform ${e}.`);const t=Yr(n.time??60),i=Yr(n.self??1);if(!Number.isInteger(t)||t<0||t>36e4||![0,1].includes(i))throw Error("Invalid ForceFeedback time or self parameter.");const s={waveform:e,time:t,self:i};for(const r of["freq","ampl"]){const a=String(n[r]??"128").split(",").map(Yr);if(a.length>4||!Number.isInteger(a[0]))throw Error(`Invalid ForceFeedback ${r} coefficients.`);s[r]=Array.from({length:4},(o,l)=>a[l]??0)}return s}const qn=(n,e=[0,0])=>n===void 0?[...e]:Array.isArray(n)?[n[0]??e[0],n[1]??e[1]]:[n,e[1]],br=n=>n<0?-1:1,tn=n=>Math.trunc(Number(n)),$c=n=>/^\s*f(?=\s|[\d(+.-])/i.test(n||""),ku=new Set(["anim","id","space","pos","facing","vfacing","bindid","bindtime","vel","velocity","accel","removetime","supermovetime","pausemovetime","scale","angle","xangle","yangle","sprpriority","ontop","shadow","ownpal","remappal","removeongethit","ignorehitpause","trans","alpha","postype","random","supermove"]);function Hu(n,e,t,i=!1){const s=t.ownpal===void 0?i?e.common:e.ownpal:!!t.ownpal;if(s&&(i||!e.ownpal)&&(e.paletteRemaps=e.common?new Map:Do(n.paletteRemaps),n.events.push({type:"palettesnapshot",target:e,common:e.common})),s||(e.paletteRemaps=null,e.paletteSnapshot=null),e.ownpal=s,s&&!e.common&&t.remappal!==void 0)try{No(e.paletteRemaps,n.character,t.remappal)}catch(r){n.diagnostic("palette",r.message)}}function zu(n,e,t,i){var f,h,u,d,m,_;const s=e.config,r=((f=n.world)==null?void 0:f.view)||{displayHeight:240};if(i||t.random!==void 0){const p=qn(s.random);e.randomOffset=p.map(v=>v>0?Math.floor(n.resolveTrigger("random")/1e3*v)-Math.floor(v/2):0)}const a=qn(s.pos).map((p,v)=>(p+e.randomOffset[v])*n.coordinateScale);e.bindOffset=a,e.relativeFacing=br(s.facing??1),e.vfacing=br(s.vfacing??1);const o=s.space!==void 0||s.bindid!==void 0,l=/^1\.(\d+)/.exec(((u=(h=n.character.def)==null?void 0:h.info)==null?void 0:u.mugenversion)||"");if(e.postype=o?null:String(s.postype??(l&&Number(l[1])>=1?"none":"p1")).toLowerCase(),e.bindID=tn(s.bindid??-2),e.bindingTarget=null,o){if(e.space=String(s.space||"stage").toLowerCase(),!["stage","screen"].includes(e.space))throw Error(`Unsupported Explod space ${e.space}.`);if(e.space==="screen"&&e.bindID!==-2)throw Error("Screen-space Explods cannot be bound.");if(e.bindID!==-2&&s.bindtime===void 0)throw Error("Explod bindID requires bindtime.");e.pos={x:a[0],y:a[1]},e.facing=e.relativeFacing}else if(["p1","p2"].includes(e.postype))e.space="stage",e.bindingTarget=e.postype==="p2"?n.opponent:n,e.pos={x:((d=e.bindingTarget)==null?void 0:d.pos.x)??n.pos.x,y:((m=e.bindingTarget)==null?void 0:m.pos.y)??n.pos.y},e.facing=e.relativeFacing*(((_=e.bindingTarget)==null?void 0:_.facing)??n.facing);else if(["front","back","left","right"].includes(e.postype)){e.space="screen";const p=e.postype==="right"||e.postype==="front"&&n.facing>0||e.postype==="back"&&n.facing<0,v=e.postype==="back"?n.facing:1;e.pos={x:(p?320:0)+a[0]*v,y:a[1]},e.facing=e.relativeFacing*v}else if(e.postype==="none")e.space="stage",e.pos={x:a[0],y:a[1]},e.facing=e.relativeFacing;else throw Error(`Unsupported Explod postype ${e.postype}.`);const c=e.postype==="p1"||e.postype==="p2"||e.bindID!==-2;if(e.bindtime=e.space==="stage"&&c?tn(s.bindtime??1):0,e.initialBinding=c,e.positioned=!e.initialBinding,!Number.isFinite(r.displayHeight))throw Error("Invalid Explod viewport.")}function vl(n,e,t,i,s){var r,a;for(const o of["angle","xangle","yangle"])if(t[o]!==void 0&&(typeof t[o]!="number"||!Number.isFinite(t[o])))throw Error(`Explod ${o} must be a finite number.`);if(e.config={...e.config,...t},t.anim!==void 0||i){const o=t.anim===void 0?e.common:$c(s.values.anim),l=tn(t.anim??e.anim),c=o?n.commonAnimations:n.animations;if(!c.has(l)||!((r=c.get(l).frames)!=null&&r.length))throw Error(`Explod ${o?"common ":""}animation ${l} does not exist or has no frames.`);e.anim=l,e.common=o,e.animation=c.get(l),e.frameIndex=0,e.frameTime=0}for(const o of["removetime","supermovetime","pausemovetime","sprpriority","angle","xangle","yangle","ontop","shadow","removeongethit","ignorehitpause","supermove"])t[o]!==void 0&&(e[o]=t[o]);for(const o of["removetime","supermovetime","pausemovetime","sprpriority"])e[o]=tn(e[o]??0);if(e.removetime<-2||tn(e.config.bindtime??0)<-1)throw Error("Invalid Explod removal or binding time.");t.scale!==void 0&&(e.scale=qn(t.scale,[1,1])),(t.trans!==void 0||t.alpha!==void 0)&&(e.trans={mode:String(e.config.trans||"default").toLowerCase(),alpha:qn(e.config.alpha,[256,0])}),(t.vel!==void 0||t.velocity!==void 0||i)&&(e.velocity=qn(e.config.vel??e.config.velocity).map(o=>o*n.coordinateScale)),(t.accel!==void 0||i)&&(e.accel=qn(e.config.accel).map(o=>o*n.coordinateScale)),Hu(n,e,t,i),i||["space","postype","pos","bindid","random"].some(o=>t[o]!==void 0)?zu(n,e,t,i):(t.facing!==void 0&&(e.relativeFacing=br(t.facing),e.facing=e.relativeFacing*(((a=e.bindingTarget)==null?void 0:a.facing)??(e.postype==="back"?n.facing:1))),t.vfacing!==void 0&&(e.vfacing=br(t.vfacing)),t.bindtime!==void 0&&(e.bindtime=tn(t.bindtime)))}function Gu(n,e){const t=tn(n.value(e,"id",-1)),i=n.explods.filter(o=>t===-1||o.id===t);if(e.type==="removeexplod"){n.explods=n.explods.filter(o=>!i.includes(o)),n.drawExplods=n.drawExplods.filter(o=>t!==-1&&o.id!==t);return}if(e.type==="explodbindtime"){const o=tn(n.value(e,e.values.time===void 0?"value":"time",1));if(o<-1)throw Error("ExplodBindTime must be -1 or greater.");for(const l of i)l.bindtime=o;return}const s=$c(e.values.anim)?e.entries.map(o=>o.key==="anim"?{...o,value:o.value.replace(/^\s*f\s*/i,"")}:o):e.entries,r=n.effectParameters({...e,entries:s});e.values.ignorehitpause!==void 0&&(r.ignorehitpause=n.value(e,"ignorehitpause",1));for(const o of Object.keys(r))ku.has(o)||n.diagnostic("unsupported-explod-parameter",`Explod parameter ${o} is not implemented.`,e);for(const o of["pos","vel","velocity","accel","scale","random","remappal","alpha"])if(Array.isArray(r[o])&&r[o].length>2)throw Error(`Explod ${o} takes at most two components.`);if(e.type==="modifyexplod"){for(const o of i){const l=n.events.length,c={...o,config:{...o.config},paletteRemaps:o.paletteRemaps?new Map(o.paletteRemaps):null};try{vl(n,c,r,!1,e)}catch(f){throw n.events.length=l,f}Object.assign(o,c);for(const f of n.events.slice(l))f.target===c&&(f.target=o)}return}if(e.values.anim===void 0)throw Error("Explod requires anim.");if(n.explods.length>=512){n.diagnostic("resource-limit","Explod limit (512 per entity) reached.",e);return}const a={owner:n,creator:n,id:t,coordinateScale:n.coordinateScale,time:0,frameIndex:0,frameTime:0,config:{},removetime:-2,bindtime:0,ignorehitpause:1,supermovetime:0,pausemovetime:0,scale:[1,1],angle:0,xangle:0,yangle:0,vfacing:1};vl(n,a,r,!0,e),n.explods.push(a)}function xl(n,e,t){if(!(e!=null&&e.remaining)||(n[t]!==e&&(n[t]=e,n[t+"Moved"]=0),t==="superPause"&&n.supermove))return!0;const i=t==="superPause"?"supermovetime":"pausemovetime";return n[t+"Moved"]>=Math.max(0,n[i]||0)?!1:(n[t+"Moved"]++,!0)}function Vu(n,e){for(const t of n.explods)!(t.bindingTarget===e||!t.bindingTarget&&(t.postype==="p1"&&n===e||t.postype==="p2"&&n.opponent===e||t.bindID===e.id||t.bindID===-1&&n.root===e))||!t.initialBinding&&t.bindtime===0||((t.initialBinding||!t.positioned)&&(t.pos={x:e.pos.x+t.bindOffset[0]*e.facing,y:e.pos.y+t.bindOffset[1]},t.facing=t.relativeFacing*e.facing),t.bindingTarget=null,t.bindtime=0,t.initialBinding=!1,t.positioned=!0)}function Wu(n,{hitPaused:e=!1,pause:t=null,superPause:i=null,forceFrozen:s=!1}={}){var a,o;const r=[];for(const l of n.explods){if(l.removetime===0||l.pendingRemoval&&!(i!=null&&i.remaining)){l.removed=!0;continue}!l.bindingTarget&&(l.bindtime||l.initialBinding)&&(l.postype==="p2"?l.bindingTarget=n.opponent:l.postype==="p1"?l.bindingTarget=n:l.bindID!==-2&&(l.bindingTarget=l.bindID===-1?n.root:l.bindID===n.id?n:(a=n.world)==null?void 0:a.findPlayer(l.bindID))),(o=l.bindingTarget)!=null&&o.destroyed&&(l.bindingTarget=null,l.bindtime=0,l.initialBinding=!1);const c=l.space==="stage"&&!!l.bindingTarget&&(l.initialBinding||l.bindtime!==0);if(l.initialBinding&&!l.bindingTarget){n.diagnostic("missing-player",`Explod binding player ${l.bindID} is unavailable.`),l.removed=!0;continue}let f=s||e&&!l.ignorehitpause;if(f||(f=i!=null&&i.remaining?!xl(l,i,"superPause"):!xl(l,t,"pause")),c?(l.facing=l.relativeFacing*l.bindingTarget.facing,l.pos={x:l.bindingTarget.pos.x+l.bindOffset[0]*l.bindingTarget.facing,y:l.bindingTarget.pos.y+l.bindOffset[1]},l.positioned=!0):!f&&l.time>0&&(l.pos.x+=l.velocity[0]*l.facing,l.pos.y+=l.velocity[1]),r.push({...l,pos:{...l.pos},source:l}),f)continue;l.time>0&&(l.velocity[0]+=l.accel[0],l.velocity[1]+=l.accel[1]),l.initialBinding=!1,l.bindtime>0&&l.bindtime--;const h=l.animation.frames[l.frameIndex];h&&h.ticks>=0&&++l.frameTime>=Math.max(1,h.ticks)&&(l.frameTime=0,++l.frameIndex>=l.animation.frames.length&&(l.removetime===-2&&(l.removed=!0),l.frameIndex=l.animation.loopStart||0)),l.time++,l.removetime>0&&l.time>=l.removetime&&(l.removed=!0),l.removed&&l.supermove&&(i!=null&&i.remaining)&&(l.removed=!1,l.pendingRemoval=!0)}n.drawExplods=r,n.explods=n.explods.filter(l=>!l.removed)}const An=new Map,Xu=["N","S","H"];function _s(n){const e=String(n??"").toUpperCase().replace(/\s/g,"");if(An.has(e))return An.get(e);const[t,...i]=e.split(",");if(!/^[SCA]*$/.test(t))throw Error(`Invalid hit attribute states: ${t}`);const s=new Set;for(const a of i)if(a){if(!/^[NSHA][ATP]$/.test(a))throw Error(`Invalid hit attack attribute: ${a}`);for(const o of a[0]==="A"?Xu:[a[0]])s.add(o+a[1])}const r={states:new Set(t),attacks:s};return An.size>=512&&An.delete(An.keys().next().value),An.set(e,r),r}function Yc(n,e){const t=typeof n=="string"?_s(n):n,i=typeof e=="string"?_s(e):e;return{state:[...i.states].some(s=>t.states.has(s)),attack:[...i.attacks].some(s=>t.attacks.has(s))}}function Kr(n,e){const t=Yc(n,e);return t.state&&t.attack}function qu(n,e){const t=Yc(n.attribute,e);return n.exclude?!t.state&&!t.attack:t.state&&t.attack}function Ut(n){var t,i,s;if((n==null?void 0:n.baseCoordinateScale)>0)return n.baseCoordinateScale;const e=Number(String(((s=(i=(t=n==null?void 0:n.character)==null?void 0:t.def)==null?void 0:i.info)==null?void 0:s.localcoord)||"320,240").split(",")[0]);return e>0?320/e:1}function dr(n,e,{edge:t=!1}={}){var o,l,c,f,h,u;const i=n.facing===e,s=i?"front":"back",r=t?(l=(o=n.width)==null?void 0:o.edge)==null?void 0:l[i?0:1]:(c=n.width)==null?void 0:c[s],a=((h=(f=n.program)==null?void 0:f.constants)==null?void 0:h.get(`size.${n.stateType==="A"?"air":"ground"}.${s}`))??15;if(r!==void 0){const d=(Number(r)||0)*(n.coordinateScale||Ut(n));return Math.max(0,d+((u=n.world)!=null&&u.orderedPhases?Math.max(0,Number(a)||0)*Ut(n):0))}return Math.max(0,Number(a)||0)*Ut(n)}function $u(n,e,{body:t=!1,scale:i=n.coordinateScale}={}){var o,l,c,f;const s=(o=n.world)==null?void 0:o.view,r=e>0?(s==null?void 0:s.right)??((l=n.options)==null?void 0:l.rightBound)??160:(s==null?void 0:s.left)??((c=n.options)==null?void 0:c.leftBound)??-160;let a=e>0?r-n.pos.x:n.pos.x-r;if(t){const h=n.width??n._previousWidth,u=Number((f=h==null?void 0:h.edge)==null?void 0:f[n.facing===e?0:1])||0;a-=u*n.coordinateScale+(n.stateType==="A"?.5:0)}return Math.trunc(a/i)}function _l(n){return n.startsWith("velocity.")?!/\.mul(?:\.|$)/.test(n):n.startsWith("size.")?!["size.xscale","size.yscale","size.proj.doscale"].includes(n):n.startsWith("movement.")&&!/(?:\.friction$|\.num$|\.time$|\.mul(?:\.|$))/.test(n)}const Kc=new Set(["xoff","yoff","zoff","xvel","yvel","xveladd","yveladd","yaccel","fall.xvel","fall.yvel","fall.envshake.ampl"]);function Yu(n,e){const t=n.coordinateScale,i=t/e;if(n.coordinateScale=e,i!==1){for(const s of Kc)typeof n.getHitVars[s]=="number"&&(n.getHitVars[s]*=i);if(n.width){for(const s of["front","back"])typeof n.width[s]=="number"&&(n.width[s]*=i);n.width.edge&&(n.width.edge=n.width.edge.map(s=>s*i))}n.attackDist!==void 0&&(n.attackDist*=i)}}function Zc(n){return n.collisionFrame?n.collisionAnimationOwner||n.animationOwner||n:n.animationOwner||n}const Fa=n=>{var e;return n!=null&&n.isProjectile?(e=n.owner)==null?void 0:e.id:n==null?void 0:n.id},Jc=(n,e)=>!(e!=null&&e.isProjectile)&&(n.hitonce===void 0?/^[SCA]\s*,\s*[NSH]T$/i.test(n.attr||""):Number(n.hitonce)!==0);function Ku(n,e,t){const i=n.hitId??-1,s=e.chainid??-1;if(s>=0&&i!==s)return!1;const r=Array.isArray(e.nochainid)?e.nochainid:[e.nochainid??-1];return!(n.hitSourceId===Fa(t)&&Fa(t)!==void 0&&r.some(a=>a>=0&&a===i&&a!==s))}function Zu(n,e,t){var i;return Ku(n,e,t)&&!(Jc(e,t)&&((i=t==null?void 0:t._spentHitDefs)!=null&&i.has(e)))}function Ju(n,e,t){!t||!Jc(e,t)||(t._spentHitDefs??(t._spentHitDefs=new WeakSet),t._spentHitDefs.add(e),t.targets.splice(0,t.targets.length,n),t.targetHitIds.clear())}function yl(n,e,t,{count:i=!0}={}){var r,a;if(!n||(n.moveContact=1,n.moveHit=t?0:1,n.moveGuarded=t?1:0,n.moveReversed=0,t||!i||(r=n.world)!=null&&r.orderedPhases&&e.numhits===0))return;const s=((a=n.world)==null?void 0:a.ticks)??n.gameTime??0;n._lastHitCountTick!==s&&(n.hitCount=(n.hitCount||0)+1,n._lastHitCountTick=s),n.uniqHitCount=(n.uniqHitCount||0)+1}const ju=new Set(["xveladd","yveladd","type","animtype","airtype","groundtype","damage","hitcount","fallcount","hitshaketime","hittime","slidetime","ctrltime","recovertime","xoff","yoff","zoff","xvel","yvel","yaccel","hitid","chainid","guarded","isbound","fall","fall.damage","fall.xvel","fall.yvel","fall.recover","fall.time","fall.recovertime","fall.kill","fall.envshake.time","fall.envshake.freq","fall.envshake.ampl","fall.envshake.phase"]);function Qu(n){var e;return{type:0,hitid:-1,chainid:0,hitcount:0,fallcount:0,hittime:-1,recovertime:n.constant("data.liedown.time"),xveladd:0,yveladd:0,zoff:0,fall:0,"fall.time":0,"fall.recover":(e=n.world)!=null&&e.orderedPhases?0:1,"fall.recovertime":4}}const Sl=new Set(["a","b","c","x","y","z","s","U","D","L","R"]);function ef(n,e,t){const i=e===null?new Set([...t].filter(s=>Sl.has(s))):new Set([...e].filter(s=>Sl.has(s)));if(e===null)for(const[s,r]of[["holdup","U"],["holddown","D"],["holdfwd",n.facing<0?"L":"R"],["holdback",n.facing<0?"R":"L"]])t.has(s)&&i.add(r);n._recoveryPressed=[...i].some(s=>!n._previousInput.has(s)),n._previousInput=i,n.rawInput=i}function Ml(n,{hitPaused:e=!1}={}){var i;const t=n.getHitVars;if(n.moveType==="H"){if(t.fall&&(t["fall.time"]=(t["fall.time"]||0)+1),e||(n.hitTime>=0&&n.hitTime--,[5070,5100].includes(n.stateNo)&&n._fallEntry!==n._entrySerial&&(t.fallcount=(t.fallcount||0)+1,n._fallEntry=n._entrySerial,n._fallDefenceMultiplier*=n.constant("data.fall.defence_mul")),n.stateNo===5110&&(t.recovertime=Math.max(0,(t.recovertime??n.constant("data.liedown.time"))-1))),n._recoveryPressed&&n.alive&&(n.stateType==="L"||t.fallcount>0)&&t.recovertime>0){const s=Math.max(1,Math.ceil(t.recovertime/2));t.recovertime=Math.max(0,t.recovertime-1-Math.floor(n.resolveTrigger("random")/1e3*s))}}else n.comboHits=0,n.hitTime=-1,n.hitId=n.hitId<0?-1:0,n.hitSourceId=void 0,t.fall=0,t.fallcount=0,(i=n.world)!=null&&i.orderedPhases||(t["fall.time"]=0),t["fall.envshake.time"]=0,n._fallDefenceMultiplier=1,t.recovertime=n.constant("data.liedown.time");t.hittime=n.hitTime,t.hitid=n.hitId,t.chainid=Math.max(0,n.hitId)}const jc=Object.freeze({attackLifeToPower:.7,getHitLifeToPower:.6,superTargetDefence:1.5});function tf(n={},e={}){const t=Object.keys(n).find(r=>/(?:^|\/)data\/mugen\.cfg$/i.test(r)),i=t?Br(bn(n[t])).rules||{}:{},s={...jc};for(const[r,a]of[["attackLifeToPower","default.attack.lifetopowermul"],["getHitLifeToPower","default.gethit.lifetopowermul"],["superTargetDefence","super.targetdefencemul"]]){const o=Number(e[r]??i[a]??s[r]);if(!Number.isFinite(o)||o<0)throw Error(`Invalid combat rule ${a}.`);s[r]=o}return s}function Ns(n,e,t,{absolute:i=!1}={}){let s=Number(n);if(!Number.isFinite(s))throw Error("Damage must be finite.");if(!i){const r=e?Math.max(0,e.constant("data.attack")/100*(e.attackMultiplier??1)):1,a=Math.max(.01,t.constant("data.defence")/100);s*=r*Math.max(0,t.defenceMultiplier??1)*Math.max(0,t._fallDefenceMultiplier??1)/a}return s>0?Math.max(1,Math.round(s)):Math.round(s)}function nf(n,e=jc){var s;const t=Math.max(0,Math.trunc(((s=n.damage)==null?void 0:s[0])||0)),i=(r,a)=>{const o=Array.isArray(r)?r:r===void 0?[Math.trunc(Math.fround(Math.fround(t)*Math.fround(a)))]:[r],l=Math.trunc(o[0]||0);return[l,Math.trunc(o[1]??l/2)]};return{get:i(n.getpower,e.attackLifeToPower),give:i(n.givepower,e.getHitLifeToPower)}}function sf(n,e,t,i=1){const s=n,r=e;return t!=="L"&&(t!=="A"&&e===0&&(n*=.66),n&&(n+=Math.sign(n)*2.5/i),e<=0&&(e=Math.min(e-2/i,(t==="A"?-3:-6)/i))),{x:n,y:e,xadd:n-s,yadd:e-r}}function Qc(n,e="<script>"){const t=[];let i;for(const[s,r]of String(n).replace(/^\uFEFF/,"").split(/\r?\n/).entries()){let a=!1,o=!1,l="";for(let v=0;v<r.length;v++){const S=r[v];if(S==='"'&&!o&&(a=!a),S===";"&&!a)break;l+=S,o=S==="\\"&&!o}const c=l.trim();if(!c)continue;const f=c.match(/^\[([^\]]+)\]/);if(f){i={name:f[1].trim().toLowerCase(),source:e,line:s+1,entries:[],values:{}},t.push(i);continue}let h=-1,u=0,d=!1,m=!1;for(let v=0;v<c.length;v++){const S=c[v];if(S==='"'&&!m&&(d=!d),!d){if(S==="("||S==="[")u++;else if(S===")"||S==="]")u--;else if(S==="="&&u===0){h=v;break}}m=S==="\\"&&!m}if(!i||h<1)continue;const _=c.slice(0,h).trim().toLowerCase(),p=c.slice(h+1).trim();i.entries.push({key:_,value:p,line:s+1}),i.values[_]=p}return t}const rf={"data.life":1e3,"data.power":3e3,"data.attack":100,"data.defence":100,"data.airjuggle":15,"data.liedown.time":60,"data.sparkno":2,"data.guard.sparkno":40,"data.fall.defence_up":50,"data.ko.echo":0,"data.intpersistindex":60,"data.floatpersistindex":40,"size.xscale":1,"size.yscale":1,"size.ground.back":15,"size.ground.front":16,"size.air.back":12,"size.air.front":12,"size.height":60,"size.attack.dist":160,"size.proj.doscale":0,"size.proj.attack.dist":90,"size.head.pos.x":0,"size.head.pos.y":-90,"size.mid.pos.x":0,"size.mid.pos.y":-60,"size.draw.offset.x":0,"size.draw.offset.y":0,"size.shadowoffset":0,"velocity.walk.fwd.x":2.4,"velocity.walk.back.x":-2.2,"velocity.run.fwd.x":4.6,"velocity.run.fwd.y":0,"velocity.run.back.x":-4.5,"velocity.run.back.y":-3.8,"velocity.jump.neu.x":0,"velocity.jump.neu.y":-8.4,"velocity.jump.y":-8.4,"velocity.jump.fwd.x":2.5,"velocity.jump.back.x":-2.55,"velocity.runjump.fwd.x":4,"velocity.runjump.fwd.y":-8.1,"velocity.runjump.back.x":-2.55,"velocity.runjump.back.y":-8.1,"velocity.airjump.neu.x":0,"velocity.airjump.neu.y":-8.1,"velocity.airjump.y":-8.1,"velocity.airjump.fwd.x":2.5,"velocity.airjump.back.x":-2.55,"velocity.air.gethit.groundrecover.x":-.15,"velocity.air.gethit.groundrecover.y":-3.5,"velocity.air.gethit.airrecover.mul.x":.5,"velocity.air.gethit.airrecover.mul.y":.2,"velocity.air.gethit.airrecover.add.x":0,"velocity.air.gethit.airrecover.add.y":-4.5,"velocity.air.gethit.airrecover.back":-1,"velocity.air.gethit.airrecover.fwd":0,"velocity.air.gethit.airrecover.up":-2,"velocity.air.gethit.airrecover.down":1.5,"movement.yaccel":.44,"movement.stand.friction":.85,"movement.crouch.friction":.82,"movement.stand.friction.threshold":2,"movement.crouch.friction.threshold":.05,"movement.airjump.num":1,"movement.airjump.height":35,"movement.air.gethit.groundlevel":25,"movement.air.gethit.groundrecover.ground.threshold":-20,"movement.air.gethit.groundrecover.groundlevel":10,"movement.air.gethit.airrecover.threshold":-1,"movement.air.gethit.airrecover.yaccel":.35,"movement.air.gethit.trip.groundlevel":15,"movement.down.bounce.offset.x":0,"movement.down.bounce.offset.y":20,"movement.down.bounce.yaccel":.4,"movement.down.bounce.groundlevel":12,"movement.down.friction.threshold":.05},Uo=new Set(["null","changestate","selfstate","changeanim","changeanim2","ctrlset","statetypeset","velset","veladd","velmul","posset","posadd","posfreeze","gravity","turn","varset","varadd","varmul","varrandom","varrangeset","parentvarset","parentvaradd","lifeadd","lifeset","poweradd","powerset","hitvelset","hitdef","hitby","nothitby","hitoverride","sprpriority","width","screenbound","playerpush","assertspecial","assertinput","playsnd","stopsnd","sndpan","envshake","palfx","allpalfx","bgpalfx","explod","modifyexplod","removeexplod","explodbindtime","targetbind","targetfacing","targetlifeadd","targetpoweradd","targetvelset","targetveladd","targetstate","targetdrop","bindtoroot","bindtoparent","bindtotarget","attackmulset","defencemulset","hitadd","hitcount","hitfallset","hitfallvel","hitfallDamage".toLowerCase(),"angleadd","angleset","anglemul","angledraw","offset","destroyself","helper","projectile","pause","superpause","afterimage","afterimagetime","trans","movehitreset","attackdist","reversaldef","envcolor","fallenvshake","remappal","makedust","gamemakeanim","forcefeedback","displaytoclipboard","appendtoclipboard","clearclipboard","victoryquote"]);new Set(Uo);const Fo=new Set(["time","stateno","prevstateno","anim","animelem","animtime","ctrl","statetype","movetype","physics","life","lifemax","power","powermax","facing","alive","gametime","hitpausetime","hitshakeover","hitover","movecontact","movehit","moveguarded","movereversed","hitcount","uniqhitcount","numhelper","numexplod","numtarget","numenemy","numpartner","ishelper","roundstate","roundno","matchno","teamside","teampower","tickspersecond","ailevel","palno","id","name","authorname","numproj","win","lose","drawgame","inguarddist","canrecover","pos x","pos y","vel x","vel y","screenpos x","screenpos y","command","const","const240p","const480p","const720p","random","animexist","selfanimexist","animelemtime","animelemno","gethitvar","playeridexist","p2name","p2life","p2stateno","p2statetype","p2movetype","p2bodydist x","p2dist x","p2bodydist y","p2dist y","hitdefattr","roundsexisted","camerapos x","camerapos y","hitfall","hitvel x","hitvel y","frontedgedist","backedgedist","frontedgebodydist","backedgebodydist","var","fvar","sysvar","sysfvar"]);Fo.add("teammode");Fo.add("ishometeam");for(const n of["p1name","p3name","p4name","frontedge","backedge","const240p","const480p","const720p"])Fo.add(n);const af=new Set(["playsnd","stopsnd","sndpan","envshake","envcolor","palfx","allpalfx","bgpalfx","afterimage","afterimagetime"]),Zr=n=>vn(n).replaceAll("\\","/").toLowerCase().replace(/^\.\//,""),vn=n=>String(n??"").replace(/^"(.*)"$/,"$1"),Jr=bn,Oo=new Map;for(const n of["attackdist","attackmulset","changeanim","changeanim2","changestate","selfstate","ctrlset","defencemulset","hitadd","lifeadd","lifeset","playerpush","playsnd","poweradd","powerset","targetfacing","targetlifeadd","targetpoweradd","targetstate"])Oo.set(n,["value"]);for(const[n,e]of Object.entries({afterimagetime:["time"],assertspecial:["flag"],assertinput:["flag"],displaytoclipboard:["text"],appendtoclipboard:["text"],envshake:["time"],explod:["anim"],hitdef:["attr"],pause:["time"],reversaldef:["reversal.attr"],sndpan:["channel"],stopsnd:["channel"],trans:["trans"],varrandom:["v"]}))Oo.set(n,e);const jr=new WeakMap;function pr(n){var i;if(jr.has(n))return jr.get(n);const e={ignorehitpause:0,persistent:1,groups:new Map,errors:[],warnings:[]};for(const s of Oo.get(n.type)||[])n.values[s]===void 0&&e.errors.push({line:n.line,message:`${n.type} requires ${s}.`});["varset","varadd","varmul","parentvarset","parentvaradd"].includes(n.type)&&!n.entries.some(s=>/^(?:var|fvar|sysvar|sysfvar)\s*\(/.test(s.key))&&(n.values.v===void 0&&n.values.fv===void 0&&e.errors.push({line:n.line,message:`${n.type} requires v or fv (or alternate variable assignment syntax).`}),n.values.value===void 0&&e.errors.push({line:n.line,message:`${n.type} requires value.`})),n.type==="varrangeset"&&n.values.value===void 0&&n.values.fvalue===void 0&&e.errors.push({line:n.line,message:"VarRangeSet requires value or fvalue."}),n.type==="sndpan"&&n.values.pan===void 0&&n.values.abspan===void 0&&e.errors.push({line:n.line,message:"SndPan requires pan or abspan."});for(const s of["ignorehitpause","persistent"])if(n.values[s]!==void 0){const r=n.values[s],a=Number(r);!/^[+-]?\d+$/.test(r)||!Number.isSafeInteger(a)||a<-2147483648||a>2147483647||s==="persistent"&&a<0?e.errors.push({line:((i=n.entries.find(o=>o.key===s))==null?void 0:i.line)||n.line,message:`${s} requires ${s==="persistent"?"a nonnegative":"a signed 32-bit"} integer constant; expressions are not allowed.`}):e[s]=a}for(const s of n.entries){const r=/^trigger([1-9]\d*)$/.exec(s.key);if(r){const a=Number(r[1]);e.groups.has(a)||e.groups.set(a,[]),e.groups.get(a).push(s)}}e.groups.has(1)||e.errors.push({line:n.line,message:"A state controller requires at least one trigger1."});let t=1;for(;e.groups.has(t);)t++;for(const[s,r]of e.groups)s>=t&&(e.groups.delete(s),e.warnings.push({line:r[0].line,message:`trigger${s} is ignored because trigger${t} is missing.`}));return jr.set(n,e),e}const of=new Map(Object.entries({time:"time",stateno:"stateNo",prevstateno:"prevStateNo",anim:"anim",animtime:"animTime",ctrl:"ctrl",statetype:"stateType",movetype:"moveType",physics:"physics",life:"life",lifemax:"maxLife",power:"power",powermax:"maxPower",facing:"facing",hitpausetime:"hitPauseTime",movecontact:"moveContact",movehit:"moveHit",moveguarded:"moveGuarded",hitcount:"hitCount",uniqhitcount:"uniqHitCount",id:"id",name:"name"}));function eh(n,{commonText:e="",constantDefaults:t={},constantsFromCnsOnly:i=!1}={}){var m,_,p;const s={states:new Map,constants:new Map(Object.entries({...rf,...t})),quotes:new Map,diagnostics:[],sources:[],controllerTypes:new Set},r=[];e&&r.push(["<common states>",e]);const a=n.files||{},o=((m=n.path)==null?void 0:m.slice(0,n.path.lastIndexOf("/")+1))||"",l=v=>{const S=Zr(v),E=o.lastIndexOf("/chars/"),T=E<0?"":o.slice(0,E+1),w=(n.checks||[]).find(y=>y.ok&&y.path&&Zr(y.value||"")===S&&a[y.path]);return[w==null?void 0:w.path,o+S,S,T+"data/"+S,"data/"+S].find(y=>y&&a[y])},c=((_=n.def)==null?void 0:_.files)||{},f=c.cns?l(c.cns):(p=(n.checks||[]).find(v=>v.key==="cns"&&v.ok))==null?void 0:p.path,h=c.stcommon&&l(c.stcommon);h?r.push([h,Jr(a[h])]):c.stcommon&&Zr(c.stcommon).split("/").at(-1)!=="common1.cns"&&s.diagnostics.push({source:n.path,line:0,type:"missing-file",message:`Common state file not found: ${c.stcommon}`});const u=new Set;for(const[v,S]of Object.entries(c)){if(!/^(cns|cmd|st\d*)$/.test(v)||!S)continue;const E=l(S);E&&!u.has(E)?(u.add(E),r.push([E,Jr(a[E])])):E||s.diagnostics.push({source:n.path,line:0,type:"missing-file",message:`${v}: ${S}`})}for(const v of n.checks||[])/^(cns|cmd|st\d*)$/.test(v.key)&&v.ok&&a[v.path]&&!u.has(v.path)&&(u.add(v.path),r.push([v.path,Jr(a[v.path])]));let d=0;for(const[v,S]of r){s.sources.push(v);let E;for(const T of Qc(S,v)){const w=T.name.match(/^statedef\s+(-?\d+)\s*$/);if(w){E={id:+w[1],...T,controllers:[]},s.states.set(E.id,E);const y=new Set(["type","movetype","physics","anim","velset","ctrl","poweradd","facep2","hitdefpersist","movehitpersist","hitcountpersist","sprpriority","juggle"]);for(const g of T.entries)y.has(g.key)||s.diagnostics.push({source:v,line:g.line,type:"unsupported-state-parameter",message:`Statedef parameter ${g.key} is not implemented.`})}else if(/^state(?:\s|$)/.test(T.name)){if(!E){s.diagnostics.push({source:v,line:T.line,type:"parse",message:"State controller has no preceding Statedef."});continue}const y=vn(T.values.type||"").toLowerCase(),g={...T,id:++d,type:y,state:E.id};E.controllers.push(g),s.controllerTypes.add(y);const x=pr(g);for(const[I,R]of[["controller-parameter",x.errors],["trigger-numbering",x.warnings]])for(const A of R)s.diagnostics.push({source:v,line:A.line,type:I,message:A.message});Uo.has(y)||s.diagnostics.push({source:v,line:T.line,type:"unsupported-controller",name:y||"(missing type)",message:`Controller ${y||"(missing type)"} is not implemented.`})}else if(T.name==="quotes")for(const y of T.entries){const g=/^victory(\d{1,2})$/.exec(y.key);if(g)try{s.quotes.set(+g[1],qc(y.value))}catch(x){s.diagnostics.push({source:v,line:y.line,type:"quote",message:x.message})}}else if(/^(data|size|velocity|movement)$/.test(T.name)){if(i&&v!==f)continue;for(const y of T.entries){const g=`${T.name}.${y.key}`,x=y.value.split(",").map(I=>Number(I.trim()));x.some(I=>!Number.isFinite(I))||(s.constants.set(g,x.length===1?x[0]:x),(x.length>1||T.name==="velocity")&&(s.constants.set(g+".x",x[0]),x.length>1&&s.constants.set(g+".y",x[1])),g==="velocity.jump.neu"&&x.length>1&&s.constants.set("velocity.jump.y",x[1]),g==="velocity.airjump.neu"&&x.length>1&&s.constants.set("velocity.airjump.y",x[1]))}}}}return s}const ei=n=>{const e=Number(n);if(!Number.isFinite(e))throw new Error(`Expected finite number, received ${String(n)}`);return e},ht=n=>Math.trunc(ei(n)),Vt=n=>typeof n=="number"&&Number.isFinite(n)&&n!==0,si=(n,e,t)=>Math.min(t,Math.max(e,n));class Er{constructor(e,t={}){var s,r,a,o,l;this.character=e,this.options=t,this.program=t.program||eh(e,t),this.animations=new Map((e.animations||[]).map(c=>[c.id,c])),this.diagnostics=[...this.program.diagnostics],this._diagnosticKeys=new Set(this.diagnostics.map(c=>`${c.source}:${c.line}:${c.type}:${c.message}`)),this._seed=t.seed??439041101,this.id=t.id??1,this.name=((r=(s=e.def)==null?void 0:s.info)==null?void 0:r.name)||"Character";const i=(((o=(a=e.def)==null?void 0:a.info)==null?void 0:o.localcoord)||"320,240").split(",").map(Number);this.localcoord={x:i[0]||320,y:i[1]||240},this.coordinateScale=320/this.localcoord.x,this.baseCoordinateScale=this.coordinateScale,this.world=t.world||null,this.parent=t.parent||null,this.root=t.root||this,this.helperId=t.helperId??0,this.keyCtrl=t.keyCtrl??!this.parent,this.ownPal=t.ownPal??!1,this.teamSide=t.teamSide??((l=this.root.options)==null?void 0:l.teamSide)??1,this.commonAnimations=t.commonAnimations||new Map,this.reset()}reset(){var e,t,i;this.vars=new Int32Array(60),this.fvars=new Float32Array(40),this.stateOwner=this,this.animationOwner=this,this.destroyed=!1,this.coordinateScale=this.baseCoordinateScale,this._scriptOwner=null,this.sysvars=new Int32Array(5),this.sysfvars=new Float32Array(5),this.maxLife=this.constant("data.life"),this.life=this.maxLife,this.maxPower=this.constant("data.power"),this._power=0,this.parent||(this.power=0),this.pos={x:((e=this.options.position)==null?void 0:e.x)||0,y:((t=this.options.position)==null?void 0:t.y)||0},this.vel={x:0,y:0},this.facing=this.options.facing===-1?-1:1,this.ctrl=1,this.stateType="S",this.moveType="I",this.physics="S",this.stateNo=0,this.prevStateNo=0,this.time=0,this.gameTime=0,this.anim=0,this.frameIndex=0,this.frameTime=0,this.animationTime=0,this.animationCycleTime=0,this.animationLooped=!1,this.animationEnded=!1,this._animationSerial=0,this.collisionFrame=null,this.collisionAnimationOwner=null,this.collisionAnimation=null,this.collisionFrameIndex=0,this.collisionFrameTime=0,this.hitDef=null,this.reversalDef=null,this.moveReversed=0,this._hitSerial=0,this.hitPauseTime=0,this.hitTime=-1,this.hitId=-1,this.hitSourceId=void 0,this._spentHitDefs=new WeakSet,this.inGuardDistance=!1,this._projectileContactShield=!1,this.moveContact=0,this.moveHit=0,this.moveGuarded=0,this.hitCount=0,this.uniqHitCount=0,this.comboHits=0,this._lastHitCountTick=null,this.getHitVars=Qu(this),this._fallXVelocityDefined=!1,this._fallDefenceMultiplier=1,this._previousInput=new Set,this.rawInput=new Set,this._fallEntry=-1,this.targets=[],this.targetHitIds=new Map,this.helpers=[],this.explods=[],this.drawExplods=[],this.events=[],this.commands=new Set,this.asserted=new Set,this.opponent=null,this.pendingAssertedInputs=new Set,this._pendingStateEntry=null,this._pendingHitTransform=null,this.attackMultiplier=1,this.defenceMultiplier=1,this.sprPriority=0,this.angle=0,this.drawScale={x:1,y:1},this.drawOffset={x:0,y:0},this.playerPush=!this.parent,this.screenBound=!this.parent,this.moveCamera={x:!this.parent,y:!this.parent},this.posFrozen=!1,this.width=null,this._previousWidth=null,this.hitFilters=[null,null],this.hitOverrides=new Map,this.bound=null,this._controllerCounts=new Map,this._entrySerial=0,this.pauseMoveTime=this.options.pauseMoveTime||0,this.superMoveTime=this.options.superMoveTime||0,this.projectileHistory=[],this.trans=null,this.angleDraw=!1,this.juggleCost=0,this._juggleSerial=0,this._paletteRemaps=new Map,this.paletteNo=Math.max(1,Math.min(256,Math.trunc(this.options.paletteNo??((i=this.parent)==null?void 0:i.paletteNo)??1))),this.paletteNo!==1&&this._paletteRemaps.set("1,1",[1,this.paletteNo]),this._initializing=!1,this.aiLevel=this.parent?this.root.aiLevel:Math.max(0,Math.min(8,Math.trunc(Number.isFinite(Number(this.options.aiLevel))?Number(this.options.aiLevel):0))),this.clipboard="",this.victoryQuoteIndex=-1,this.victoryQuote=null,this._dustTicks=new Map,this.cornerPush=0,this.cornerPushTarget=null,this.cornerPushSide=0,this._previousUp=!1,this.airJumps=0,this._changeCount=0,this._executing=null,this.attackDist=void 0,this.changeState(0),this.events=[]}diagnostic(e,t,i=this._executing){const s={source:(i==null?void 0:i.source)||this.character.path||"<character>",line:(i==null?void 0:i.line)||0,type:e,message:t};i&&(s.controller=i.type,s.state=i.state);const r=`${s.source}:${s.line}:${s.type}:${s.message}`;return this._diagnosticKeys.has(r)||(this._diagnosticKeys.add(r),this.diagnostics.push(s)),s}constant(e,t=this.coordinateScale){if(e=String(e).toLowerCase(),e==="data.fall.defence_mul")return 100/(100+this.constant("data.fall.defence_up",t));if(!this.program.constants.has(e))throw new Error(`Unknown character constant: ${e}`);const i=this.program.constants.get(e);return(Array.isArray(i)?i[0]:i)*(_l(e)?this.baseCoordinateScale/t:1)}get animation(){return(this.animationOwner||this).animations.get(this.anim)}get currentFrame(){var e;return((e=this.animation)==null?void 0:e.frames[this.frameIndex])||null}get animElemTime(){return this.frameTime}get animTime(){var t;const e=(t=this.animation)==null?void 0:t.frames;return!(e!=null&&e.length)||this.animationEnded?0:e.some(i=>i.ticks<0)?-1:this.animationCycleTime-e.reduce((i,s)=>i+Math.max(1,s.ticks),0)}get alive(){return this.life>0}get paletteRemaps(){return this.parent&&!this.ownPal?this.parent.paletteRemaps:this._paletteRemaps}ownedHelpers(){return this.world?this.world.entities.filter(e=>e.parent&&!e.destroyed&&(this===this.root?e.root===this:e.parent===this)):this.helpers.filter(e=>!e.destroyed)}get power(){return this.parent?this.root.power:this._power}set power(e){this.parent?this.root.power=e:this._power=e}evaluate(e,t=this._executing,i=!1){try{return(this.options.expressionEvaluator||(i?Ua:Na))(e,{resolve:(s,r=[],a=null)=>this.resolveTrigger(s,r,a),assign:(s,r,a)=>this.assignVariable(s,r,a),onWarning:s=>{s.bottom||this.diagnostic("expression-warning",`${e}: ${s.message}`,t)},typedResult:i})}catch(s){throw s.bottom||this.diagnostic("expression",`${e}: ${s.message}`,t),s}}variableArray(e){const t={var:this.vars,fvar:this.fvars,sysvar:this.sysvars,sysfvar:this.sysfvars};if(!t[e])throw new Error(`Unsupported assignable variable: ${e}`);return t[e]}assignVariable(e,t,i){const s=this.variableArray(e.toLowerCase()),r=ht(t[0]);if(r<0||r>=s.length)throw new Nt(`${e} index out of range: ${r}`);return s[r]=ei(i),s[r]}resolveTrigger(e,t=[],i=null,s=this.coordinateScale){var u,d,m,_,p,v,S,E,T,w,y,g,x,I,R,A,F,N,P,B,H,k,C,L,G,$,ie,ne,X,te,ge,xe,re,Ie,lt,Ae,Ve,Xe,Ne,dt;if(e=e.toLowerCase(),i){let ae;const Pe=i.name.toLowerCase();if(["enemynear","enemy","p2"].includes(Pe)){const we=(((u=this.world)==null?void 0:u.entities)||[this.opponent]).filter(rt=>rt&&!rt.destroyed&&!rt.parent&&rt.teamSide!==this.teamSide);Pe==="enemynear"&&we.sort((rt,pt)=>Math.abs(rt.pos.x-this.pos.x)-Math.abs(pt.pos.x-this.pos.x)),ae=we[Math.trunc(i.args[0]||0)]}else if(Pe==="root")ae=this.root||this;else if(Pe==="parent")ae=this.parent;else if(Pe==="partner")ae=(((d=this.world)==null?void 0:d.entities)||[]).filter(we=>!we.parent&&we!==this.root&&we.teamSide===this.teamSide)[Math.trunc(i.args[0]||0)];else if(Pe==="helper")ae=this.ownedHelpers().find(we=>!i.args.length||we.helperId===+i.args[0]);else if(Pe==="target")ae=this.targets.find(we=>!i.args.length||(this.targetHitIds.get(we.id)??we.hitId)===+i.args[0]);else if(Pe==="playerid")ae=((m=this.world)==null?void 0:m.findPlayer(+i.args[0]))||[this,this.opponent,...this.helpers].find(we=>(we==null?void 0:we.id)===+i.args[0]);else throw new Error(`Unsupported redirection: ${Pe}`);if(!ae||ae.destroyed){const we=new Error(`Redirection ${Pe} has no matching player`);throw we.bottom=!0,we}return ae.resolveTrigger(e,t,null,s)}if(["var","fvar","sysvar","sysfvar"].includes(e)){const ae=this.variableArray(e),Pe=ht(t[0]);if(Pe<0||Pe>=ae.length)throw new Nt(`${e} index out of range: ${Pe}`);return ae[Pe]}const r=of.get(e);if(r)return this[r];if(e==="command")return+this.commands.has(String(t[0]));if(e==="const")return this.constant(t[0],s);if(e==="const240p")return ei(t[0])/this.coordinateScale;if(e==="const480p")return ei(t[0])/(2*this.coordinateScale);if(e==="const720p")return ei(t[0])/(4*this.coordinateScale);if(e==="random")return this._seed^=this._seed<<13,this._seed^=this._seed>>>17,this._seed^=this._seed<<5,(this._seed>>>0)%1e3;if(e==="animexist"||e==="selfanimexist")return+(e==="selfanimexist"?this:this.animationOwner).animations.has(ht(t[0]));if(e==="animelemtime"){const ae=ht(t[0])-1,Pe=((_=this.animation)==null?void 0:_.frames)||[];if(ae<0||ae>=Pe.length){const rt=new Error(`Animation element out of range: ${ae+1}`);throw rt.bottom=!0,rt}const we=Pe.slice(0,ae).reduce((rt,pt)=>rt+Math.max(1,pt.ticks),0);return this.animationTime-we}if(e==="animelemno"){let ae=this.animationCycleTime+ei(t[0]||0),Pe=((p=this.animation)==null?void 0:p.frames)||[];if(!Pe.length){const Je=new Error("Animation has no elements");throw Je.bottom=!0,Je}const we=Pe.map(Je=>Je.ticks<0?1/0:Math.max(1,Je.ticks)),rt=we.reduce((Je,Ot)=>Je+Ot,0),pt=((v=this.animation)==null?void 0:v.loopStart)??0,Ft=we.slice(0,pt).reduce((Je,Ot)=>Je+Ot,0);if(Number.isFinite(rt)&&(this.animationLooped||this.frameIndex>=pt||ae>=rt)){const Je=rt-Ft;ae=Ft+((ae-Ft)%Je+Je)%Je}else if(ae<0){const Je=new Error("Animation offset precedes its start");throw Je.bottom=!0,Je}for(let Je=0;Je<Pe.length;Je++)if(ae-=we[Je],ae<0)return Je+1}if(e==="gethitvar"){const ae=String(t[0]).toLowerCase();if(ae==="isbound")return+(!!this.bound&&!this.bound.target.destroyed);if(ae==="hittime")return this.hitTime;if(ae==="hitshaketime")return(S=this.world)!=null&&S.orderedPhases?this.getHitVars.hitshaketime||0:this.hitPauseTime;if(ae in this.getHitVars)return this.getHitVars[ae]*(Kc.has(ae)?this.coordinateScale/s:1);if(ju.has(ae))return 0;throw new Error(`Unsupported GetHitVar field: ${ae}`)}if(e==="inguarddist")return+(this.world?this.inGuardDistance||!1:Hc(this,this.opponent?[this.opponent]:[]));const a=this.opponent,o=(E=this.world)==null?void 0:E.roundFlow,l=this.root===((T=this.world)==null?void 0:T.player)?"player":"opponent",c=!!(o!=null&&o.roundWinner)&&o.roundWinner===l,f=!!(o!=null&&o.roundWinner)&&o.roundWinner!=="draw"&&!c,h={animelem:this.frameIndex+1,alive:+this.alive,gametime:((w=this.world)==null?void 0:w.ticks)??this.gameTime,hitshakeover:+(((y=this.world)!=null&&y.orderedPhases?this.getHitVars.hitshaketime||0:this.hitPauseTime)===0),hitover:+(this.hitTime<0),movereversed:this.moveReversed||0,numhelper:this.ownedHelpers().length,numexplod:this.explods.length,numtarget:this.targets.length,numenemy:a?1:0,numpartner:0,ishelper:+!!this.parent,roundstate:this.roundState??2,roundsexisted:this.roundsExisted??0,roundno:this.roundNo??1,matchno:this.matchNo??1,matchover:+!!((g=this.world)!=null&&g.matchOver),teamside:this.teamSide??this.id,teampower:this.power,tickspersecond:60,aiLevel:this.aiLevel||0,ailevel:this.aiLevel||0,palno:this.paletteNo||1,teammode:"single",ishometeam:+(this.teamSide===1),authorname:((I=(x=this.character.def)==null?void 0:x.info)==null?void 0:I.author)||"",numproj:(((R=this.world)==null?void 0:R.projectiles)||[]).filter(ae=>ae.owner===this&&!ae.removing&&!ae.removed).length,win:o?+c:+(this.roundState===4&&this.alive&&(a==null?void 0:a.life)<=0),lose:o?+f:+(this.roundState===4&&!this.alive),drawgame:o?+(o.roundWinner==="draw"):+(this.roundState===4&&!this.alive&&(a==null?void 0:a.life)<=0),winko:+(c&&o.reason!=="time"),wintime:+(c&&o.reason==="time"),winperfect:+(c&&this.life===this.maxLife),loseko:+(f&&o.reason!=="time"),losetime:+(f&&o.reason==="time"),loseperfect:+(f&&(a==null?void 0:a.life)===(a==null?void 0:a.maxLife)),camerazoom:this.cameraZoom??1,gamewidth:(((A=this.world)==null?void 0:A.view.width)??320)/s,gameheight:(((F=this.world)==null?void 0:F.view.height)??240)/s,screenwidth:320/s,screenheight:(((N=this.world)==null?void 0:N.view.displayHeight)??240)/s,leftedge:(((P=this.world)==null?void 0:P.view.left)??-160)/s,rightedge:(((B=this.world)==null?void 0:B.view.right)??160)/s,topedge:(((H=this.world)==null?void 0:H.view.top)??-240)/s,bottomedge:(((k=this.world)==null?void 0:k.view.bottom)??0)/s,frontedge:(this.facing===1?((C=this.world)==null?void 0:C.view.right)??160:((L=this.world)==null?void 0:L.view.left)??-160)/s,backedge:(this.facing===1?((G=this.world)==null?void 0:G.view.left)??-160:(($=this.world)==null?void 0:$.view.right)??160)/s,canrecover:+(!!this.getHitVars.fall&&this.getHitVars["fall.recover"]!==0&&(this.getHitVars["fall.time"]||0)>=(this.getHitVars["fall.recovertime"]??4)),hitfall:this.getHitVars.fall||0,"hitvel x":(this.getHitVars.xvel||0)*this.coordinateScale/s,"hitvel y":(this.getHitVars.yvel||0)*this.coordinateScale/s,"pos x":(this.pos.x-(((ie=this.cameraPos)==null?void 0:ie.x)||0))/s,"pos y":this.pos.y/s,"vel x":this.vel.x/s,"vel y":this.vel.y/s,"screenpos x":(this.pos.x-(((ne=this.world)==null?void 0:ne.view.left)??-160))/s,"screenpos y":(this.pos.y-(((X=this.world)==null?void 0:X.view.top)??-240))/s,"camerapos x":(((te=this.cameraPos)==null?void 0:te.x)||0)/s,"camerapos y":(((ge=this.cameraPos)==null?void 0:ge.y)||0)/s};if(e==="stagevar"){if(!((xe=this.world)!=null&&xe.stage))throw Error("StageVar requires an imported stage.");return this.world.stage.variable(t[0])}if(e==="ishelper"&&t.length)return+(!!this.parent&&this.helperId===+t[0]);if(e==="numprojid")return(((re=this.world)==null?void 0:re.projectiles)||[]).filter(ae=>ae.owner===this&&!ae.removing&&!ae.removed&&ae.projId===Math.max(0,Math.trunc(+t[0]))).length;if(/^proj(contact|hit|guarded|cancel)time$/.test(e)){const ae=e.slice(4,-4),Pe=Math.max(0,+t[0]||0),we=this.projectileHistory.at(-1);return we&&(!Pe||we.projId===Pe)&&(ae==="contact"?["hit","guarded"].includes(we.type):we.type===ae)?(((Ie=this.world)==null?void 0:Ie.ticks)??this.gameTime)-we.tick:-1}if(/^(parentdist|rootdist) [xy]$/.test(e)){const ae=this.parent?e.startsWith("parent")?this.parent:this.root:null;if(!ae||ae.destroyed||e.startsWith("parent")&&!ae.alive){const we=Error("No live parent or root");throw we.bottom=!0,we}const Pe=e.at(-1);return(ae.pos[Pe]-this.pos[Pe])*(Pe==="x"?this.facing:1)/s}if(e==="numexplod"&&t.length)return this.explods.filter(ae=>ae.id===+t[0]).length;if(e==="numhelper"&&t.length)return this.ownedHelpers().filter(ae=>+t[0]<=0||ae.helperId===+t[0]).length;if(e==="numtarget"&&t.length)return this.targets.filter(ae=>!ae.destroyed&&(+t[0]<0||(this.targetHitIds.get(ae.id)??ae.hitId)===+t[0])).length;if(e==="playeridexist")return+((lt=this.world)!=null&&lt.findPlayer(+t[0])||[this,a,...this.helpers].find(ae=>(ae==null?void 0:ae.id)===+t[0]&&!ae.destroyed)?1:0);if(["frontedgedist","backedgedist","frontedgebodydist","backedgebodydist"].includes(e)){const ae=e.startsWith("front"),Pe=this.facing*(ae?1:-1);if((Ae=this.world)!=null&&Ae.orderedPhases)return $u(this,Pe,{body:e.includes("body"),scale:s});const we=Pe>0?((Ve=this.world)==null?void 0:Ve.view.right)??this.options.rightBound??160:((Xe=this.world)==null?void 0:Xe.view.left)??this.options.leftBound??-160;let rt=(Pe>0?we-this.pos.x:this.pos.x-we)/s;return e.includes("body")&&(rt-=dr(this,Pe,{edge:!0})/s),rt}if(e==="p1name")return this.name;if(["p2name","p3name","p4name"].includes(e)){const ae=(((Ne=this.world)==null?void 0:Ne.entities)||[this,a]).filter(we=>we&&!we.destroyed&&!we.parent),Pe=e==="p2name"?a:e==="p3name"?ae.find(we=>we!==this.root&&we.teamSide===this.teamSide):ae.filter(we=>we.teamSide!==this.teamSide)[1];return(Pe==null?void 0:Pe.name)??{absent:!0}}if(["p2life","p2stateno","p2statetype","p2movetype","p2bodydist x","p2dist x","p2bodydist y","p2dist y"].includes(e)&&!a)throw new Nt(`${e}: P2 does not exist.`);if(e==="p2life")return a.life;if(e==="p2stateno")return a.stateNo;if(e==="p2statetype")return a.stateType;if(e==="p2movetype")return a.moveType;if(e==="p2bodydist x"||e==="p2dist x"){if(!a)return 0;let ae=(a.pos.x-this.pos.x)*this.facing/s;if(e==="p2bodydist x"){const Pe=ae>=0;ae-=dr(this,this.facing)/s+(Pe?1:-1)*dr(a,Pe?-this.facing:this.facing)/s}return ae}if(e==="p2bodydist y"||e==="p2dist y")return a?(a.pos.y-this.pos.y)/s:0;if(e==="hitdefattr")return this.moveType!=="A"||!((dt=this.hitDef)!=null&&dt.attr)?0:+Kr(t.map(String).join(","),this.hitDef.attr);if(Object.hasOwn(h,e))return h[e];throw new Qi(`Unsupported trigger: ${e}`)}parameter(e,t=this._executing,i=!1){try{return this.evaluate(e,t,i)}catch(s){if(!s.bottom)throw s;return this.diagnostic("parameter-bottom",`${e}: ${s.message} Parameter set to 0.`,t),i?{value:0,float:!1}:0}}value(e,t,i){var o;const s=e.values[t];if(s===void 0)return i;if(t==="ignorehitpause"||t==="persistent"){const l=pr(e);if(l.errors.some(c=>c.message.startsWith(t)))throw Error(l.errors.find(c=>c.message.startsWith(t)).message);return l[t]}let r=(o=this._parameterCache)==null?void 0:o.get(e);if(this._parameterCache&&!r&&this._parameterCache.set(e,r=new Map),r!=null&&r.has(t))return r.get(t);const a=this.parameter(s,e);return r==null||r.set(t,a),a}vector(e,t,i=[0,0]){var o;const s=e.values[t];if(s===void 0)return[...i];let r=(o=this._parameterCache)==null?void 0:o.get(e);if(this._parameterCache&&!r&&this._parameterCache.set(e,r=new Map),r!=null&&r.has(t))return[...r.get(t)];const a=gn(s).map(l=>ei(this.parameter(l,e)));return r==null||r.set(t,a),a}text(e,t,i=""){return vn(e.values[t]??i)}changeAnimation(e,t=1,i=this){if(e=ht(e),e<0&&(this.diagnostic("animation-value","Negative animation number; using action 0."),e=0),!i.animations.has(e))return this.diagnostic("missing-animation",`Animation ${e} does not exist.`),!1;const s=i.animations.get(e).frames,r=ht(t)-1,a=r>=0&&r<s.length?r:0;return this._animationSerial++,this.animationOwner=i,this.anim=e,this.frameIndex=a,this.frameTime=0,this.animationEnded=!1,this.animationTime=s.slice(0,a).reduce((o,l)=>o+Math.max(1,l.ticks),0),this.animationCycleTime=this.animationTime,this.animationLooped=!1,!0}changeState(e,t,i=this.stateOwner||this){var f,h,u,d;e=ht(e);const s=i.program.states.get(e);if(!s)return this.diagnostic("missing-state",`State ${e} does not exist.`),!1;if((f=this.world)!=null&&f.orderedPhases&&(this.world.contactPhase||this.world.activeActor!==this&&((h=this.world._entities)!=null&&h.includes(this))))return this._pendingStateEntry={number:e,ctrl:t,owner:i,oldState:((u=this._pendingStateEntry)==null?void 0:u.oldState)??this.stateNo,oldOwner:((d=this._pendingStateEntry)==null?void 0:d.oldOwner)??this.stateOwner},this.prevStateNo=this.stateNo,this.stateNo=e,this.stateOwner=i,this.time=0,!0;if(++this._changeCount>64)return this.diagnostic("state-loop","More than 64 state changes in one tick; execution stopped."),!1;const r=this.stateOwner.program.states.get(this.stateNo);this.stateOwner=i,Yu(this,Ut(i)),this.prevStateNo=this.stateNo,this.stateNo=e,this.time=0,t!==void 0&&ht(t)>=0&&(this.ctrl=+Vt(ht(t))),this._entrySerial++,this._controllerCounts.clear();let a=!1,o=!1,l=!1;try{a=Vt(this.value(s,"hitdefpersist",0)),o=Vt(this.value(s,"movehitpersist",0)),l=Vt(this.value(s,"hitcountpersist",0))}catch{}a||(this.hitDef=null,this.reversalDef=null),o||(this.moveContact=0,this.moveHit=0,this.moveGuarded=0,this.moveReversed=0),l||(this.hitCount=0,this.uniqHitCount=0,this._lastHitCountTick=null);const c=this.moveType;this.moveType="I",this._executing=s;try{const m=this.text(s,"type","S").toUpperCase(),_=this.text(s,"physics","N").toUpperCase();if(m!=="U"&&(this.stateType=m),_!=="U"&&(this.physics=_),s.values.movetype){const p=this.text(s,"movetype").toUpperCase();this.moveType=p==="U"?c:p}if(s.values.ctrl!==void 0&&(this.ctrl=+Vt(this.value(s,"ctrl",this.ctrl))),s.values.anim!==void 0){const p=ht(this.value(s,"anim",-1));p!==-1&&this.changeAnimation(p)}if(s.values.velset!==void 0){const[p=0,v=0]=this.vector(s,"velset");this.vel={x:p*this.coordinateScale,y:v*this.coordinateScale}}s.values.sprpriority!==void 0&&(this.sprPriority=ht(this.value(s,"sprpriority",0))),s.values.juggle!==void 0&&(this.juggleCost=Math.max(0,ht(this.value(s,"juggle",0))),this._juggleSerial++),s.values.poweradd!==void 0&&(this.power=si(this.power+this.value(s,"poweradd",0),0,this.maxPower)),Vt(this.value(s,"facep2",0))&&this.opponent&&(this.facing=this.opponent.pos.x>=this.pos.x?1:-1)}catch{}return this._executing=null,this.events.push({type:"state",state:e,previous:r==null?void 0:r.id}),!0}shouldRun(e,t){const i=pr(e);if(i.errors.length||t&&!i.ignorehitpause)return!1;const s=e.entries.filter(c=>c.key==="triggerall");for(const c of s)try{if(!Vt(this.evaluate(c.value,{...e,line:c.line})))return!1}catch{return!1}const r=i.groups;let a=!1;for(const[,c]of[...r].sort(([f],[h])=>f-h)){let f=!0;for(const h of c)try{if(!Vt(this.evaluate(h.value,{...e,line:h.line}))){f=!1;break}}catch{f=!1;break}if(f){a=!0;break}}if(!a)return!1;const o=i.persistent,l=this._controllerCounts.get(e)||0;return this._controllerCounts.set(e,l+1),o===0?l===0:l%o===0}runState(e,t,i=this.stateOwner){const s=i.program.states.get(e);if(!s)return;const r=this._entrySerial;for(const a of s.controllers){const o=this._scriptOwner;this._scriptOwner=i,this._executing=a;try{this.shouldRun(a,t)&&this.execute(a)}catch(l){this.diagnostics.some(c=>c.message.includes(l.message)&&c.source===a.source)||this.diagnostic("controller",l.message,a)}if(this._executing=null,this._scriptOwner=o,this.destroyed||this._entrySerial!==r)break}}movementHeld(e){var r;if(!((r=this.world)!=null&&r.manageInputs))return this.commands.has(e);const t=this.rawInput,i=this.facing<0?"L":"R",s=this.facing<0?"R":"L";return e==="holdup"?t.has("U")&&!t.has("D"):e==="holddown"?t.has("D")&&!t.has("U"):e==="holdfwd"?t.has(i)&&!t.has(s):e==="holdback"?t.has(s)&&!t.has(i):!1}automaticTransitions(){var r,a,o,l,c,f,h;if(!this.ctrl||this.moveType==="H"||!this.alive||this.stateOwner!==this||this.parent&&!this.keyCtrl||(r=this.world)!=null&&r.roundFlow&&this.world.roundFlow.roundState!==2)return;const e=this.movementHeld("holddown"),t=this.movementHeld("holdup"),i=this.movementHeld("holdfwd")||this.movementHeld("holdback"),s=this.movementHeld("holdback")&&!this.asserted.has("noautoguard")&&!!this.resolveTrigger("inguarddist");if(!(s&&((a=this.world)!=null&&a.orderedPhases)&&[120,130,131,132,140].includes(this.stateNo))){if(s&&![120,130,131,132,140].includes(this.stateNo)){const u=this.stateType==="A"?"noairguard":this.stateType==="C"?"nocrouchguard":"nostandguard",d=(o=this.world)!=null&&o.orderedPhases?120:this.stateType==="A"?132:this.stateType==="C"?131:120;if(!this.asserted.has(u)&&this.program.states.has(d)){this.changeState(d);return}}if(!this.asserted.has("noautoturn")&&((c=(l=this.world)==null?void 0:l.stage)==null?void 0:c.definition.autoturn)!==!1&&this.stateType!=="A"&&this.opponent&&[0,10,11,12,20].includes(this.stateNo)){const u=this.opponent.pos.x>=this.pos.x?1:-1;u!==this.facing&&(this.facing=u)}if(this.stateType==="A"){t&&!this._previousUp&&this.airJumps<this.constant("movement.airjump.num")&&-this.pos.y>=this.constant("movement.airjump.height")&&this.program.states.has(45)&&(this.airJumps++,this.changeState(45));return}if(t&&!this.asserted.has("nojump")&&this.program.states.has(40)){this.changeState(40);return}if(e&&this.stateType==="S"&&!this.asserted.has("nocrouch")&&this.program.states.has(10)){this.changeState(10);return}if(!e&&this.stateType==="C"&&((f=this.world)!=null&&f.orderedPhases||[10,11].includes(this.stateNo))&&this.program.states.has(12)){this.changeState(12);return}!this.asserted.has("nowalk")&&this.stateType==="S"&&this.moveType==="I"&&(i&&((h=this.world)!=null&&h.orderedPhases?this.stateNo!==20&&this.stateNo!==100:this.stateNo===0)&&this.program.states.has(20)?this.changeState(20):!i&&this.stateNo===20&&this.changeState(0))}}tick({commands:e=new Set,opponent:t=null,paused:i=!1,input:s=null}={}){var f;const r=(f=this.world)==null?void 0:f.orderedPhases;if(i||(this._changeCount=0),r&&!i&&this._pendingHitTransform){const h=this._pendingHitTransform;this._pendingHitTransform=null,h.facing!==void 0&&(this.facing=h.facing);for(const u of["x","y"])h[u]!==void 0&&(this.pos[u]=h[u])}const a=this._animationSerial;if(r&&this._pendingStateEntry&&!i){const h=this._pendingStateEntry;this._pendingStateEntry=null,this.stateNo=h.oldState,this.stateOwner=h.oldOwner,this.changeState(h.number,h.ctrl,h.owner)}if(this.events=[],this.commands=e,this.opponent=t,ef(this,s,e),i||this.destroyed)return this.world||this.updateExplods({forceFrozen:!0}),this.gameTime++,this.events;this._executing=null;const o=this.hitPauseTime>0,l=r&&(this.getHitVars.hitshaketime||0)>0&&this.moveType==="H";r&&a===this._animationSerial&&!o&&!l&&this.advanceAnimation(),this.asserted=new Set,this.posFrozen=!1,o||(this.playerPush=!this.parent,this.screenBound=!this.parent,this.moveCamera={x:!this.parent,y:!this.parent},this._previousWidth=this.width,this.width=null),this.drawOffset={x:0,y:0},this.drawScale={x:1,y:1},this.trans=null,this.angleDraw=!1,this.moveContact>0&&!o&&this.moveContact++,this.moveHit>0&&!o&&this.moveHit++,this.moveGuarded>0&&!o&&this.moveGuarded++,this.moveReversed>0&&!o&&this.moveReversed++;for(let h=0;h<2;h++){const u=this.hitFilters[h];(u==null?void 0:u.time)>0&&--u.time===0&&(this.hitFilters[h]=null)}for(const[h,u]of this.hitOverrides)u.time>0&&--u.time===0&&this.hitOverrides.delete(h);if(this.parent||(this.stateOwner===this&&this.runState(-3,o,this),this.runState(-2,o,this)),this.keyCtrl&&this.stateOwner===this&&!this._initializing&&this.runState(-1,o,this.parent?this.root:this),this.destroyed)return this.gameTime++,this.events;!o&&!this._initializing&&this.automaticTransitions(),!o&&this.stateNo===5110&&this.time>=1&&this.alive&&(this.getHitVars.recovertime??1)<=0&&this.stateOwner.program.states.has(5120)&&this.changeState(5120);let c;do c=this._entrySerial,this._initializing&&this.options.skipIntro&&[190,191].includes(this.stateNo)?(this.changeState(0),this.ctrl=1):this.runState(this.stateNo,o);while(c!==this._entrySerial&&this._changeCount<=64);if(this.destroyed)return this.gameTime++,this.events;if(o||(this._initializing=!1),this.collisionFrame=this.currentFrame,this.collisionAnimationOwner=this.animationOwner,o)return Ml(this,{hitPaused:!0}),this.world||this.updateExplods({hitPaused:!0}),this.hitPauseTime=Math.max(0,this.hitPauseTime-1),this.gameTime++,this.events;if(!this.posFrozen&&!this.bound&&!l&&(this.pos.x+=this.vel.x*this.facing+(r?0:this.cornerPush),this.pos.y+=this.vel.y,r&&(this.pos.x=Math.fround(this.pos.x),this.pos.y=Math.fround(this.pos.y))),r||(this.cornerPush*=si(this.constant("movement.stand.friction"),0,1),Math.abs(this.cornerPush)<.01&&(this.cornerPush=0)),!l&&this.physics==="A")this.vel.y+=(r?Math.fround(this.constant("movement.yaccel")):this.constant("movement.yaccel"))*this.coordinateScale,r&&(this.vel.y=Math.fround(this.vel.y)),this.pos.y>=0&&this.vel.y>0&&!(r&&this.stateNo===105)&&(this.pos.y=0,this.vel.y=0,this.airJumps=0,this.program.states.has(52)&&this.changeState(52));else if(!l&&(this.physics==="S"||this.physics==="C")&&(r||![20,100].includes(this.stateNo))){const h=this.physics==="C"?"crouch":"stand",u=this.constant("movement."+h+".friction");if(this.vel.x*=r?Math.fround(u):u,r&&(this.vel.x=Math.fround(this.vel.x)),r){const d=h==="stand"?1:this.constant("movement.crouch.friction.threshold");Math.abs(this.vel.x)<d*this.coordinateScale&&(this.vel.x=0)}}return this.updateBinding(),this.collisionFrame=this.currentFrame,this.collisionAnimationOwner=this.animationOwner,this.collisionAnimation=this.animation,this.collisionFrameIndex=this.frameIndex,this.collisionFrameTime=this.frameTime,r||this.advanceAnimation(),this.world||this.updateExplods(),l&&(this.getHitVars.hitshaketime=Math.max(0,this.getHitVars.hitshaketime-1)),Ml(this,{hitPaused:r&&(this.getHitVars.hitshaketime||0)>0}),this.time++,this.gameTime++,this._previousUp=this.movementHeld("holdup"),this.events}advanceAnimation(){var i;const e=this.animation,t=this.currentFrame;if(t){if(t.ticks<0){(i=this.world)!=null&&i.orderedPhases&&(this.frameTime++,this.animationTime++,this.animationCycleTime++);return}this.animationEnded&&(this.animationEnded=!1),this.frameTime++,this.animationTime++,this.animationCycleTime++,this.frameTime>=Math.max(1,t.ticks)&&(this.frameTime=0,this.frameIndex++,this.frameIndex>=e.frames.length&&(this.frameIndex=e.loopStart??e.loopstart??0,this.animationEnded=!0,this.animationLooped=!0,this.animationCycleTime=e.frames.slice(0,this.frameIndex).reduce((s,r)=>s+Math.max(1,r.ticks),0)))}}execute(e){const t=pr(e).errors.find(s=>!s.message.includes("trigger1"));if(t)throw Error(t.message);const i=this._parameterCache;this._parameterCache=new WeakMap;try{return this.executeController(e)}finally{this._parameterCache=i}}executeController(e){var o,l,c,f,h,u;const t=e.type,i=(d,m=0)=>ei(this.value(e,d,m)),s=(d,m=0)=>ht(this.value(e,d,m)),r=(d,m=[0,0])=>this.vector(e,d,m),a=(d,m="")=>this.text(e,d,m);if(!Uo.has(t)){this.diagnostic("unsupported-controller",`Controller ${t||"(missing type)"} is not implemented.`,e);return}if(t!=="null"){if(t==="assertinput"){if(!((o=this.world)!=null&&o.manageInputs)){this.diagnostic("unsupported-input-routing","AssertInput needs the independent input scheduler.");return}for(const d of e.entries)if(/^flag\d*$/.test(d.key))for(const m of this.text(e,d.key).split(/[+|\s,]+/).filter(Boolean)){const _={up:"U",down:"D",forward:"F",fwd:"F",back:"B",start:"s"},p=_[m.toLowerCase()]||m;if(!["U","D","F","B","a","b","c","x","y","z","s"].includes(p)){this.diagnostic("unsupported-input",`Input flag ${m} is not implemented.`,e);continue}this.pendingAssertedInputs.add(p)}return}if(["displaytoclipboard","appendtoclipboard","clearclipboard"].includes(t)){if(t==="clearclipboard"){this.clipboard="";return}const d=Uu(e.values.text||""),m=e.values.params===void 0?[]:gn(e.values.params);if(m.length!==d.count)throw Error(`Clipboard format requires ${d.count} parameters, received ${m.length}.`);const _=Ou(d,m.map(p=>this.parameter(p,e,!0)));this.clipboard=(t==="appendtoclipboard"&&this.clipboard?this.clipboard+`
`+_:_).slice(-8192);return}if(t==="victoryquote"){if(!this.parent){const d=s("value",-1);d!==this.victoryQuoteIndex&&(this.victoryQuote=null),this.victoryQuoteIndex=d}return}if(t==="forcefeedback"){this.events.push({type:t,...Bu(e.values)});return}if(t==="gamemakeanim"||t==="makedust"){if(t==="makedust"){const d=s("spacing",3);if(d<1)throw Error("MakeDust spacing must be at least 1.");const m=this._dustTicks.get(e);if((m==null?void 0:m.entry)===this._entrySerial&&this.gameTime-m.time<d)return;this._dustTicks.set(e,{entry:this._entrySerial,time:this.gameTime}),this.gameAnimation(120,r("pos"),!0,0,e),e.values.pos2!==void 0&&this.gameAnimation(120,r("pos2"),!0,0,e)}else this.gameAnimation(s("value",0),r("pos"),!!i("under"),Math.max(0,s("random")),e);return}if(t==="changestate"||t==="selfstate"){const d=s("value"),m=e.values.ctrl===void 0?void 0:s("ctrl"),_=e.values.anim===void 0?void 0:s("anim"),p=t==="selfstate"?this:this.stateOwner;p.program.states.has(d)&&_!==void 0&&_!==-1&&this.changeAnimation(_),this.changeState(d,m,p);return}if(t==="changeanim"||t==="changeanim2"){this.changeAnimation(s("value"),s("elem",1),t==="changeanim2"?this.stateOwner:this);return}if(t==="ctrlset"){this.ctrl=+Vt(i("value"));return}if(t==="statetypeset"){for(const[d,m]of[["statetype","stateType"],["movetype","moveType"],["physics","physics"]])if(e.values[d]!==void 0){const _=a(d).toUpperCase();_!=="U"&&(this[m]=_)}return}if(/^(vel|pos)(set|add|mul)$/.test(t)){const d=t.startsWith("vel")?this.vel:this.pos,m=t.slice(3);for(const _ of["x","y"])if(e.values[_]!==void 0){const p=i(_)*(m==="mul"?1:this.coordinateScale);m==="set"?d[_]=p+(t==="posset"&&_==="x"&&((l=this.cameraPos)==null?void 0:l.x)||0):m==="add"?d[_]+=p*(t==="posadd"&&_==="x"?this.facing:1):d[_]*=p,(c=this.world)!=null&&c.orderedPhases&&(d[_]=Math.fround(d[_]))}return}if(t==="gravity"){this.vel.y+=this.constant("movement.yaccel")*this.coordinateScale;return}if(t==="turn"){(f=this.world)!=null&&f.orderedPhases&&this.vel.x!==0&&(this.vel.x=-this.vel.x),this.facing*=-1;return}if(t==="posfreeze"){this.posFrozen=Vt(i("value",1));return}if(t==="helper"){if(!this.world)throw Error("Helper requires a match world.");this.world.spawnHelper(this,this.entityParameters(e));return}if(t==="projectile"){if(!this.world)throw Error("Projectile requires a match world.");const d=new Set(["velocity","remvelocity","accel","velmul","offset","postype","supermovetime","pausemovetime","ownpal","remappal"]),m=e.entries.filter(p=>!p.key.startsWith("proj")&&!p.key.startsWith("afterimage.")&&!d.has(p.key)),_=this.parseHitDef({...e,entries:m,values:Object.fromEntries(m.map(p=>[p.key,p.value]))});this.world.spawnProjectile(this,{...this.entityParameters(e,!0),hitDef:_});return}if(t==="pause"||t==="superpause"){if(!this.world)throw Error(`${t} requires a match world.`);const d=this.entityParameters(e);d.coordinateScale=this.coordinateScale,d.type=t,d.time??(d.time=t==="superpause"?30:0),d.animCommon=!/^s/i.test(e.values.anim||""),d.soundCommon=!/^s/i.test(e.values.sound||""),this.world.requestPause(this,d);return}if(t==="trans"){this.trans={mode:a("trans","default").toLowerCase(),alpha:r("alpha",[256,0])};return}if(t==="movehitreset"){this.moveContact=this.moveHit=this.moveGuarded=0;return}if(t==="attackdist"){this.attackDist=i("value"),this.hitDef&&(this.hitDef["guard.dist"]=this.attackDist*this.coordinateScale/(this.hitDef.coordinateScale??this.coordinateScale));return}if(t==="remappal"){const d=E=>{const T=r(E,[-1,0]);return[ht(T[0]),ht(T[1]??0)]},m=d("source"),_=d("dest"),p=m[0]===-1?"*":m.join(",");if(m[0]===-1&&_[0]===-1){this.paletteRemaps.clear();return}if(m[0]<-1||m[0]!==-1&&m[1]<0||_[0]<-1||_[0]!==-1&&_[1]<0)throw Error("Invalid RemapPal palette pair.");const v=_[0]===-1||m.join(",")===_.join(",");v||Bc(this.character,m,_);const S=v&&this.paletteRemaps.has("*")&&m[0]!==-1;if(m[0]!==-1&&(!v||S)&&!this.paletteRemaps.has(p)&&this.paletteRemaps.size>=8){this.diagnostic("resource-limit","RemapPal supports at most 8 simultaneous mappings.",e);return}m[0]===-1&&this.paletteRemaps.clear(),S?this.paletteRemaps.set(p,m):v?this.paletteRemaps.delete(p):this.paletteRemaps.set(p,_);return}if(t==="fallenvshake"){const d=this.getHitVars["fall.envshake.time"]||0;d>0&&this.events.push({type:"envshake",time:d,coordinateScale:this.coordinateScale,...Object.fromEntries(["ampl","freq","phase"].map(m=>[m,this.getHitVars["fall.envshake."+m]]))}),this.getHitVars["fall.envshake.time"]=0;return}if(["varset","varadd","varmul","parentvarset","parentvaradd"].includes(t)){const d=t.startsWith("parent")?this.parent:this;if(!d||d.destroyed)return;let m=e.entries.filter(_=>/^(var|fvar|sysvar|sysfvar)\s*\(/.test(_.key));if(!m.length){const _=e.values.fv!==void 0?"fvar":"var";m=[{key:`${_}(${s(_==="fvar"?"fv":"v")})`,value:e.values.value??"0"}]}for(const _ of m){const p=_.key.match(/^(var|fvar|sysvar|sysfvar)\s*\((.*)\)$/);if(!p)throw new Error(`Malformed variable target: ${_.key}`);const v=ht(this.parameter(p[2],e));let S=ei(this.parameter(_.value,e));S=p[1].includes("fvar")?Math.fround(S):ht(S)|0;const E=d.resolveTrigger(p[1],[v]);t.endsWith("add")&&(S+=E),t.endsWith("mul")&&(S*=E),d.assignVariable(p[1],[v],S)}return}if(t==="varrandom"){const d=s("v"),m=r("range",[0,1e3]),[_,p]=m.length===1?[0,ht(m[0])]:m.map(ht);if(_>p)throw Error("VarRandom range requires least_val <= greatest_val.");this.resolveTrigger("random"),this.assignVariable("var",[d],_+Math.floor((this._seed>>>0)/4294967296*(p-_+1)));return}if(t==="varrangeset"){const d=e.values.fvalue!==void 0,m=d?this.fvars:this.vars,_=si(s("first"),0,m.length-1),p=si(s("last",m.length-1),0,m.length-1),v=i(d?"fvalue":"value");for(let S=_;S<=p;S++)this.assignVariable(d?"fvar":"var",[S],v);return}if(t==="lifeadd"||t==="lifeset"){let d=s("value");t==="lifeadd"&&(d=-Ns(-d,null,this,{absolute:!!i("absolute")}),d+=this.life),this.life=si(d,i("kill",1)?0:1,this.maxLife);return}if(t==="poweradd"||t==="powerset"){this.power=si(s("value")+(t==="poweradd"?this.power:0),0,this.maxPower);return}if(t==="attackmulset"){this.attackMultiplier=i("value",1);return}if(t==="defencemulset"){this.defenceMultiplier=i("value",1);return}if(t==="sprpriority"){this.sprPriority=s("value");return}if(t==="screenbound"){this.screenBound=Vt(i("value",0));const[d,m]=r("movecamera");this.moveCamera={x:!!d,y:!!m};return}if(t==="playerpush"){this.playerPush=Vt(i("value",1));return}if(t==="width"){if(e.values.value!==void 0&&(e.values.player!==void 0||e.values.edge!==void 0))throw Error("Width value cannot be combined with player or edge.");const d=e.values.value===void 0?[0,0]:r("value"),[m=0,_=0]=r("player",d),p=r("edge",d);this.width={front:ht(m),back:ht(_),edge:[ht(p[0]??0),ht(p[1]??0)]};return}if(t==="assertspecial"){const d=new Set(["nowalk","nojump","nocrouch","noautoturn","invisible","noshadow","unguardable","noairguard","nostandguard","nocrouchguard","nojugglecheck","intro","roundnotover","timerfreeze","noko","nobardisplay","nobg","nofg"]);for(const m of["flag","flag2","flag3"])if(e.values[m]){const _=a(m).toLowerCase();this.asserted.add(_),d.has(_)||this.diagnostic("unsupported-flag",`AssertSpecial flag ${_} is not implemented.`,e)}return}if(t==="hitvelset"){i("x")&&(this.vel.x=(this.getHitVars.xvel||0)*this.coordinateScale),i("y")&&(this.vel.y=(this.getHitVars.yvel||0)*this.coordinateScale);return}if(t==="hitdef"){this.hitDef=null,this.reversalDef=null,this.hitDef=this.parseHitDef(e),this.events.push({type:"hitdef",hitDef:this.hitDef});return}if(t==="reversaldef"){if(this.reversalDef=null,e.values["reversal.attr"]===void 0)throw Error("ReversalDef requires reversal.attr.");if(!e.values["reversal.attr"].trim())return;_s(a("reversal.attr")),this.reversalDef=this.parseHitDef(e);return}if(t==="hitby"||t==="nothitby"){const d=["value","value2"].filter(p=>e.values[p]!==void 0);if(d.length!==1)throw Error(`${t} requires exactly one of value or value2.`);const m=s("time",1);if(m<-1||m>36e4)throw Error("Invalid hit-filter duration.");const _=_s(a(d[0]));this.hitFilters[d[0]==="value"?0:1]=m?{attribute:_,time:m,exclude:t==="nothitby"}:null;return}if(t==="hitoverride"){const d=s("slot"),m=s("time",1);if(d<0||d>7||m<-1||m>36e4)throw Error("HitOverride requires slot 0–7 and time -1 or greater.");if(!m||((h=e.values.attr)==null?void 0:h.trim())===""){this.hitOverrides.delete(d);return}if(e.values.attr===void 0||e.values.stateno===void 0)throw Error("HitOverride requires attr and stateno.");const _=a("attr"),p=_s(_);m?this.hitOverrides.set(d,{attr:_,attribute:p,stateNo:s("stateno"),time:m,forceAir:Vt(i("forceair"))}):this.hitOverrides.delete(d);return}if(af.has(t)){if(t==="palfx"&&this.parent&&!this.ownPal)return;let d=this.effectParameters(e);if(["palfx","allpalfx","bgpalfx"].includes(t)&&(d=ur(d)),t==="playsnd"){const[m=0,_=0]=Array.isArray(d.value)?d.value:[d.value||0,0];Object.assign(d,{group:m,number:_,common:/^\s*f/i.test(e.values.value||""),volumeScale:d.volumescale,freqMul:d.freqmul})}this.events.push({type:t,...d,coordinateScale:this.coordinateScale,source:e.source,line:e.line});return}if(["explod","modifyexplod","removeexplod","explodbindtime"].includes(t)){this.explodController(e);return}if(t.startsWith("target")){const d=s("id",-1),m=this.targets.filter(w=>d===-1||(this.targetHitIds.get(w.id)??w.hitId)===d);if(t==="targetdrop"){const w=s("excludeid",-1),y=w<0?[]:this.targets.filter(x=>(this.targetHitIds.get(x.id)??x.hitId)===w);this.targets=i("keepone",1)?y.slice(0,1):y;const g=new Set(this.targets.map(x=>x.id));for(const x of this.targetHitIds.keys())g.has(x)||this.targetHitIds.delete(x);return}const _=["targetfacing","targetlifeadd","targetpoweradd","targetstate"].includes(t)?s("value"):void 0,p=t==="targetlifeadd"?i("kill",1):1,v=t==="targetlifeadd"?i("absolute"):0,S=t==="targetstate"&&e.values.ctrl!==void 0?i("ctrl"):void 0,E=t==="targetbind"?{pos:r("pos"),time:s("time",1)}:null,T=t==="targetvelset"||t==="targetveladd"?Object.fromEntries(["x","y"].filter(w=>e.values[w]!==void 0).map(w=>[w,i(w)*this.coordinateScale])):null;for(const w of m)if(t==="targetfacing")_&&(w.facing=this.facing*(_<0?-1:1));else if(t==="targetlifeadd"){const y=-Ns(-_,this,w,{absolute:!!v});w.life=si(w.life+y,p?0:1,w.maxLife)}else if(t==="targetpoweradd")w.power=si(w.power+_,0,w.maxPower);else if(t==="targetstate")w.changeState(_,S,this._scriptOwner||this.stateOwner);else if(E){const[y=0,g=0]=E.pos;w.bound={target:this,x:y*this.coordinateScale,y:g*this.coordinateScale,time:E.time}}else for(const[y,g]of Object.entries(T||{}))w.vel[y]=g+(t==="targetveladd"?w.vel[y]:0);return}if(["bindtoroot","bindtoparent","bindtotarget"].includes(t)){if(t!=="bindtotarget"&&!this.parent)return;const d=s("id",-1),m=t==="bindtoroot"?this.root:t==="bindtoparent"?this.parent:this.targets.find(S=>d<0||(this.targetHitIds.get(S.id)??S.hitId)===d);if(!m||m.destroyed){if(t==="bindtoparent"&&this.parent){this.bound=null;return}throw new Error(`${t} has no matching player`)}let _=[0,0],p,v;if(t==="bindtotarget"){const S=gn(e.values.pos||"0,0"),E=vn(S[2]||"foot").toLowerCase();if(S.length>3||!["foot","head","mid"].includes(E))throw Error("BindToTarget pos requires x, y, and Foot, Head or Mid.");[p,v]=S.slice(0,2).map(T=>ei(this.evaluate(T,e))),p??(p=0),v??(v=0),E!=="foot"&&(_=["x","y"].map(T=>m.constant(`size.${E}.pos.${T}`)*m.coordinateScale))}else[p=0,v=0]=r("pos");this.bound={target:m,x:p*this.coordinateScale+_[0],y:v*this.coordinateScale+_[1],time:s("time",1),facing:i("facing")};return}if(t==="hitadd"){const d=s("value");this.hitCount=Math.max(0,this.hitCount+d),this.uniqHitCount=Math.max(0,this.uniqHitCount+d);const m=this.targets.at(-1)||(((u=this.opponent)==null?void 0:u.moveType)==="H"?this.opponent:null);m&&(m.comboHits=Math.max(0,(m.comboHits||0)+d));return}if(t==="hitcount"){this.hitCount=s("value");return}if(t==="hitfallset"){if(e.values.value!==void 0){const d=s("value",-1);d!==-1&&(d&&!this.getHitVars.fall&&(this.getHitVars["fall.time"]=0),this.getHitVars.fall=+!!d)}e.values.xvel!==void 0&&(this.getHitVars["fall.xvel"]=i("xvel"),this._fallXVelocityDefined=!0),e.values.yvel!==void 0&&(this.getHitVars["fall.yvel"]=i("yvel"));return}if(t==="hitfallvel"){if(this.moveType!=="H")return;this._fallXVelocityDefined&&(this.vel.x=(this.getHitVars["fall.xvel"]||0)*this.coordinateScale),this.vel.y=(this.getHitVars["fall.yvel"]||0)*this.coordinateScale;return}if(t==="hitfalldamage"){if(this.moveType==="H"){const d=Ns(this.getHitVars["fall.damage"]||0,null,this);this.life=si(this.life-d,this.life>0&&this.getHitVars["fall.kill"]===0?1:0,this.maxLife),this.getHitVars["fall.damage"]=0}return}if(t==="angleadd"){this.angle+=i("value");return}if(t==="angleset"){this.angle=i("value");return}if(t==="anglemul"){this.angle*=i("value",1);return}if(t==="angledraw"){this.angleDraw=!0;const[d=1,m=1]=r("scale",[1,1]);this.drawScale={x:d,y:m},e.values.value&&(this.angle=i("value"));return}if(t==="offset"){this.drawOffset={x:i("x")*this.coordinateScale,y:i("y")*this.coordinateScale};return}if(t==="destroyself"){if(!this.parent){this.diagnostic("unsupported-controller","DestroySelf is valid only for helpers.",e);return}const d=!!i("recursive"),m=!!i("removeexplods");this.world?this.world.destroyHelper(this,{recursive:d,removeExplods:m}):(this.destroyed=!0,m&&(this.explods=this.drawExplods=[]));return}this.diagnostic("unsupported-controller",`Controller ${t} is not implemented.`,e)}}selectVictoryQuote(){if(this.parent||this.victoryQuote!==null)return this.victoryQuote;const e=this.program.quotes;if(!(e!=null&&e.size))return null;const t=[...e.keys()],i=e.has(this.victoryQuoteIndex)?this.victoryQuoteIndex:t[Math.floor(this.resolveTrigger("random")/1e3*t.length)];return this.victoryQuote=e.get(i)}gameAnimation(e,t,i,s,r){if(e<0)return;if(!this.commonAnimations.has(e)){this.diagnostic("missing-animation",`Common effect animation ${e} is unavailable. Import its fightfx resources.`,r);return}const a=()=>s?(this.resolveTrigger("random")/999-.5)*s:0;this.events.push({type:"gameanim",anim:e,under:i,common:!0,facing:this.facing,pos:{x:this.pos.x+((t[0]||0)*this.facing+a())*this.coordinateScale,y:this.pos.y+((t[1]||0)+a())*this.coordinateScale}})}effectParameters(e){const t={},i=new Set(["waveform","postype","trans","helpertype","name","space"]);for(const s of e.entries){if(/^(type|triggerall|trigger\d+|persistent|ignorehitpause)$/.test(s.key))continue;if(i.has(s.key)&&!/^-?[\d.]+$/.test(s.value)){t[s.key]=vn(s.value);continue}const a=gn(s.value).map(o=>{const l=o.trim().replace(/^[sSfF](?=[\d(-])/,"");return this.parameter(l,e)});t[s.key]=a.length===1?a[0]:a}return t}entityParameters(e,t=!1){const i=new Set(["velocity","remvelocity","accel","velmul","offset","postype","supermovetime","pausemovetime","ownpal","remappal"]),s=t?e.entries.filter(r=>r.key.startsWith("proj")||r.key.startsWith("afterimage.")||i.has(r.key)):e.entries;if(t){const r=new Set(["projid","projanim","projhitanim","projremanim","projcancelanim","projscale","projremove","projremovetime","projhits","projmisstime","projpriority","projsprpriority","projedgebound","projstagebound","projheightbound","projshadow"]);for(const a of s)a.key.startsWith("proj")&&!r.has(a.key)&&this.diagnostic("unsupported-projectile",`Projectile parameter ${a.key} is not implemented.`,{...e,line:a.line})}return{...this.effectParameters({...e,entries:s}),source:e.source,line:e.line}}createHelper(e,{id:t}={}){e.helpertype&&e.helpertype!=="normal"&&this.diagnostic("unsupported-helper","Player-type helpers are deprecated by MUGEN 1.1; using a normal helper.");const{pos:i,facing:s}=Wc(this,e),r={...this.program,constants:new Map(this.program.constants)};for(const[l,c]of Object.entries(e))if(l.startsWith("size.")){const f=_l(l)?this.coordinateScale/this.baseCoordinateScale:1,h=Array.isArray(c)?c.map(u=>u*f):c*f;r.constants.set(l,h),Array.isArray(h)&&(r.constants.set(l+".x",h[0]),r.constants.set(l+".y",h[1]))}const a=new Er(this.character,{program:r,expressionEvaluator:this.options.expressionEvaluator,commonAnimations:this.commonAnimations,world:this.world,id:t,position:i,facing:s,parent:this,root:this.root,helperId:Math.trunc(e.id||0),keyCtrl:!!e.keyctrl,ownPal:!!e.ownpal,teamSide:this.teamSide,pauseMoveTime:e.pausemovetime||0,superMoveTime:e.supermovetime||0});a.name=e.name||`${this.name}'s helper`,a.opponent=this.opponent,e.ownpal&&(a._paletteRemaps=Do(this.paletteRemaps)),e.ownpal&&this.events.push({type:"palettesnapshot",target:a});const o=new Set(["id","name","stateno","postype","pos","facing","helpertype","keyctrl","ownpal","pausemovetime","supermovetime","remappal","source","line"]);for(const l of Object.keys(e))!o.has(l)&&!l.startsWith("size.")&&a.diagnostic("unsupported-helper",`Helper parameter ${l} is not implemented.`);if(e.ownpal&&e.remappal!==void 0)try{No(a.paletteRemaps,a.character,e.remappal)}catch(l){a.diagnostic("palette",l.message)}return a.changeState(e.stateno??0)?(this.helpers.push(a),a):(a.destroyed=!0,a)}parseHitDef(e){var l,c;const t=e.values,i={serial:++this._hitSerial,coordinateScale:this.coordinateScale,stateOwner:this._scriptOwner||this.stateOwner},s=new Set(["attr","reversal.attr","hitflag","guardflag","animtype","air.animtype","fall.animtype","ground.type","air.type","affectteam","priority"]);for(const f of e.entries)if(!/^(type|triggerall|trigger\d+|persistent|ignorehitpause)$/.test(f.key)){if(f.key==="priority"){const[h,u="Hit"]=gn(f.value);i.priority=[ht(this.parameter(h,e)),vn(u)];continue}if(s.has(f.key)){i[f.key]=vn(f.value);continue}try{const h=gn(f.value).map(u=>this.parameter(u.trim().replace(/^[sSfF](?=[\d(-])/,""),e));i[f.key]=h.length===1?h[0]:h}catch{throw new Error(`HitDef parameter ${f.key} could not be evaluated; attack disabled.`)}}const r=(f,h)=>Array.isArray(i[f])?i[f]:i[f]===void 0?[...h]:[i[f],h[1]??0];i.attr=i.attr??`${this.stateType}, NA`,i.id=ht(i.id??0),i.chainid=ht(i.chainid??-1);const a=i.nochainid===void 0?[-1,-1]:Array.isArray(i.nochainid)?i.nochainid:[i.nochainid,-1];if(a.length>2)throw Error("HitDef nochainID takes at most two IDs.");i.nochainid=a.map(ht),i.hitonce=i.hitonce===void 0?+/^[SCA]\s*,\s*[NSH]T$/i.test(i.attr):+Vt(ei(i.hitonce)),i.damage=r("damage",[0,0]),i.pauseTime=r("pausetime",[0,0]),i.guardPauseTime=r("guard.pausetime",i.pauseTime),i.groundVelocity=r("ground.velocity",[0,0]),i.airVelocity=r("air.velocity",[0,0]),i.guardVelocity=r("guard.velocity",[i.groundVelocity[0],0]),i.airGuardVelocity=r("airguard.velocity",[i.airVelocity[0]*1.5,i.airVelocity[1]/2]),i.guardVelocity[1]=0,i["air.type"]??(i["air.type"]=i["ground.type"]??"high"),i.forcestand??(i.forcestand=+(i.groundVelocity[1]!==0)),i["down.velocity"]??(i["down.velocity"]=[...i.airVelocity]),i["down.hittime"]??(i["down.hittime"]=20),i["down.bounce"]??(i["down.bounce"]=0),i["ground.cornerpush.veloff"]??(i["ground.cornerpush.veloff"]=/^A\s*,/i.test(i.attr)?0:1.3*i.guardVelocity[0]);for(const f of["air","down","guard"])i[l=f+".cornerpush.veloff"]??(i[l]=i["ground.cornerpush.veloff"]);i["airguard.cornerpush.veloff"]??(i["airguard.cornerpush.veloff"]=i["guard.cornerpush.veloff"]),i.groundHitTime=i["ground.hittime"]??0,i.airHitTime=i["air.hittime"]??20,i.guardHitTime=i["guard.hittime"]??((c=this.world)!=null&&c.orderedPhases?i["ground.slidetime"]??0:i.groundHitTime),i["ground.slidetime"]??(i["ground.slidetime"]=0),i["guard.slidetime"]??(i["guard.slidetime"]=i.guardHitTime),i["guard.ctrltime"]??(i["guard.ctrltime"]=i["guard.slidetime"]),i["airguard.ctrltime"]??(i["airguard.ctrltime"]=i["guard.ctrltime"]),i.hitFlag=String(i.hitflag??"MAF").toUpperCase(),i.guardFlag=String(i.guardflag??"").toUpperCase(),i.fall=i.fall??0,i.kill=i.kill??1,i["guard.kill"]=i["guard.kill"]??1,i.source=e.source,i.line=e.line,i.juggleCost=this.juggleCost,i.juggleGroup=`${this.id}:${this._juggleSerial}`,i.sparkCommon=!/^s/i.test(t.sparkno||""),i.guardSparkCommon=!/^s/i.test(t["guard.sparkno"]||""),i.hitSoundCommon=!/^s/i.test(t.hitsound||""),i.guardSoundCommon=!/^s/i.test(t.guardsound||""),i.sparkno??(i.sparkno=this.constant("data.sparkno")),i["guard.sparkno"]??(i["guard.sparkno"]=this.constant("data.guard.sparkno"));const o=new Set(["attr","damage","pausetime","guard.pausetime","ground.velocity","air.velocity","guard.velocity","airguard.velocity","ground.hittime","air.hittime","guard.hittime","ground.slidetime","guard.slidetime","ground.ctrltime","guard.ctrltime","guardflag","hitflag","fall","forcenofall","kill","guard.kill","fall.kill","fall.damage","fall.xvelocity","fall.yvelocity","fall.recover","fall.recovertime","yaccel","animtype","air.animtype","ground.type","air.type","chainid","id","p1stateno","p2stateno","p2getp1state","p1facing","p1getp2facing","p2facing","p1sprpriority","p2sprpriority","numhits","getpower","givepower","priority","affectteam","guard.dist","down.velocity","down.hittime","air.fall","forcestand","air.juggle","fall.envshake.time","fall.envshake.ampl","fall.envshake.freq","fall.envshake.phase","sparkno","guard.sparkno","sparkxy","hitsound","guardsound","envshake.time","envshake.freq","envshake.ampl","envshake.phase","palfx.time","palfx.add","palfx.mul","palfx.sinadd","palfx.color","palfx.invertall"]);for(const f of["fall.animtype","mindist","maxdist","snap","ground.cornerpush.veloff","air.cornerpush.veloff","down.cornerpush.veloff","guard.cornerpush.veloff","airguard.cornerpush.veloff","airguard.ctrltime"])o.add(f);o.add("hitonce"),o.add("nochainid"),o.add("down.bounce");for(const f of e.entries)/^(type|triggerall|trigger\d+|persistent|ignorehitpause)$/.test(f.key)||o.has(f.key)||f.key==="reversal.attr"||this.diagnostic("unsupported-hitdef-parameter",`HitDef parameter ${f.key} is parsed but its engine behavior is not implemented.`,{...e,line:f.line});return i}receiveHit(e,t,{guarded:i=!1}={}){var ne,X,te,ge;if(!this.canBeHit(e,t))return{damage:0,guarded:!1,rejected:!0};const s=!i&&String(e[this.stateType==="A"?"air.type":"ground.type"]??e["ground.type"]??"high").toLowerCase()==="none",r=i?null:this.matchingHitOverride(e),a=e.p2getp1state===0?this:e.stateOwner||t;if(!s&&!i&&!r&&e.p2stateno>=0&&!(a!=null&&a.program.states.has(e.p2stateno)))return this.diagnostic("missing-state",`HitDef target state ${e.p2stateno} does not exist; hit rejected.`),{damage:0,guarded:!1,rejected:!0};Ju(this,e,t);const o=i?e.guardPauseTime:e.pauseTime,l=this.stateType,c=(t==null?void 0:t.facing)??-this.facing,f=this.facing;if(s)return yl(t,e,!1,{count:!1}),{damage:0,guarded:!1,typeNone:!0,cornerPush:0};this.explods=this.explods.filter(xe=>!xe.removeongethit),this.drawExplods=this.drawExplods.filter(xe=>!xe.removeongethit);const h=this.stateType==="A"||!!(r!=null&&r.forceAir),u=this.stateType==="L"&&!(r!=null&&r.forceAir),d=h&&!!this.getHitVars.fall,m=this.getHitVars,_=this.moveType==="H"&&!m.guarded,p=e[(i?h?"airguard":"guard":u?"down":h?"air":"ground")+".cornerpush.veloff"]||0;!i&&e.forcestand&&this.stateType==="C"&&(this.stateType="S");const v=ei(((ne=e.damage)==null?void 0:ne[i?1:0])||0),S=Math.max(0,Ns(v,t,this)),E=(X=this.world)==null?void 0:X.orderedPhases,T=(i?e["guard.kill"]:e.kill)===0?1:0,w=si((this._projectedLife??this.life)-S,T,this.maxLife);E?this._projectedLife=w:this.life=w;const y={},g=t&&e.p2facing?(E?-1:1)*c*(e.p2facing<0?-1:1):this.facing;t&&e.p2facing&&(E?y.facing=g:this.facing=g),t&&e.p1getp2facing?t.facing=g*(e.p1getp2facing<0?-1:1):t&&e.p1facing===-1&&(t.facing*=-1);const x=i?h?e.airGuardVelocity:e.guardVelocity:u&&e["down.velocity"]!==void 0?Array.isArray(e["down.velocity"])?e["down.velocity"]:[e["down.velocity"],0]:h?e.airVelocity:e.groundVelocity,I=e.coordinateScale??(t==null?void 0:t.coordinateScale)??this.coordinateScale,R=I/this.coordinateScale;let A=((x==null?void 0:x[0])||0)*R*-c*g,F=((x==null?void 0:x[1])||0)*R;const N=w<=0,P=N?sf(A,F,l,this.coordinateScale):{x:A,y:F};A=P.x,F=P.y;const B=i?e.guardHitTime:u&&F===0?e["down.hittime"]??20:h||F!==0||E&&e.fall?e.airHitTime??20:e.groundHitTime??0,H={light:0,medium:1,med:1,hard:2,back:3,up:4,diagup:5},k={high:1,low:2,trip:3,none:0};let C=k[String(e["ground.type"]||"high").toLowerCase()]??1;t&&(t.pos.x-this.pos.x)*f<0&&(C===1||C===2)&&(C=3-C);const L=e["air.animtype"]||e.animtype||"light",G=e["fall.animtype"]||(String(L).toLowerCase()==="up"?"up":"back"),$=N?1:i?0:+((!e.forcenofall||e.fall)&&!!m.fall||Vt(ei(h?e["air.fall"]??e.fall??0:e.fall||0)));if(this.getHitVars={animtype:H[String((E?$&&!i:d)?G:h?L:e.animtype||"light").toLowerCase()]??0,groundtype:C,airtype:k[String(e["air.type"]||"high").toLowerCase()]??1,type:h?k[String(e["air.type"]||e["ground.type"]||"high").toLowerCase()]??1:C,damage:S,hitcount:i?0:(_&&m.hitcount||0)+1,fallcount:_&&m.fallcount||0,hitshaketime:(o==null?void 0:o[1])||0,hittime:B,slidetime:e[i?"guard.slidetime":"ground.slidetime"]??(i?B:0),ctrltime:(i&&h?e["airguard.ctrltime"]:void 0)??e[i?"guard.ctrltime":"ground.ctrltime"]??B,xvel:A,yvel:F,yaccel:e.yaccel===void 0?.35/this.coordinateScale:e.yaccel*R,xoff:0,yoff:0,guarded:+i,fall:$,hitid:e.id??0,chainid:Math.max(0,e.id??0),isbound:0,xveladd:0,yveladd:0,zoff:0,recovertime:u?Math.min(m.recovertime??this.constant("data.liedown.time"),this.constant("data.liedown.time")):this.constant("data.liedown.time"),"fall.time":E&&i&&m["fall.time"]||0,"fall.damage":e["fall.damage"]||0,"fall.xvel":e["fall.xvelocity"]===void 0?A:e["fall.xvelocity"]*R*-c*g,"fall.yvel":u&&!e["down.bounce"]&&F!==0?0:e["fall.yvelocity"]===void 0?-4.5/this.coordinateScale:e["fall.yvelocity"]*R,"fall.recover":N||E&&i?0:e["fall.recover"]??1,"fall.recovertime":e["fall.recovertime"]??4,"fall.kill":e["fall.kill"]??1,"fall.envshake.time":e["fall.envshake.time"]||0,"fall.envshake.freq":e["fall.envshake.freq"]??60,"fall.envshake.ampl":e["fall.envshake.ampl"]===void 0?-4/this.coordinateScale:e["fall.envshake.ampl"]*R,"fall.envshake.phase":e["fall.envshake.phase"]??0},this.comboHits=i?0:(_&&this.comboHits||0)+Math.max(0,Math.trunc(e.numhits??1)),this._fallXVelocityDefined=e["fall.xvelocity"]!==void 0,this.hitTime=Math.max(0,B||0)+(E&&!i&&B>0?1:0),this.hitPauseTime=E?0:Math.max(0,(o==null?void 0:o[1])||0),this.ctrl=0,this.moveType="H",this.hitId=e.id??0,this.hitSourceId=Fa(t),E||(this.vel={x:0,y:0}),this.cornerPush=0,this.cornerPushTarget=null,t&&(!i||E)){const xe=I;for(const[re,Ie]of[["x",0],["y",1]]){const lt=re==="x"?t.facing:1;let Ae=(this.pos[re]-t.pos[re])*lt/xe;const Ve=i?re==="x"?["mindist","maxdist"]:[]:["mindist","maxdist","snap"];for(const Ne of Ve)if(e[Ne]!==void 0){const dt=Array.isArray(e[Ne])?e[Ne][Ie]:Ie===0?e[Ne]:void 0;if(dt===void 0)continue;Ae=Ne==="mindist"?Math.max(Ae,dt):Ne==="maxdist"?Math.min(Ae,dt):dt}const Xe=t.pos[re]+Ae*lt*xe;E?Ve.some(Ne=>e[Ne]!==void 0)&&(y[re]=Math.fround(Xe)):this.pos[re]=Xe}}E&&Object.keys(y).length&&(this._pendingHitTransform=y);const ie=r?r.stateNo:!i&&e.p2stateno>=0?e.p2stateno:i&&!N?h?154:this.stateType==="C"?152:150:u?5080:!h&&this.getHitVars.groundtype===3?5070:h?5020:this.stateType==="C"?5010:5e3;if(r!=null&&r.forceAir&&(this.stateType="A"),this.changeState(ie,void 0,!i&&!r&&e.p2stateno>=0?a:this)||(this.moveType="H",this.vel={x:A*this.coordinateScale,y:F*this.coordinateScale},this.diagnostic("missing-hit-state",`Hit state ${ie} is missing; full hit reaction cannot execute.`)),this.moveType="H",t){yl(t,e,i),t.hitPauseTime=Math.max(t.hitPauseTime,(o==null?void 0:o[0])||0),t.targets.includes(this)||t.targets.push(this),(te=t.targetHitIds)==null||te.set(this.id,e.id??0);const{get:xe,give:re}=nf(e,(ge=this.world)==null?void 0:ge.combatRules);E?this.world.pendingCombatEffects.push({defender:this,attacker:t,damage:S,minimum:T,get:xe[i?1:0]||0,give:re[i?1:0]||0}):(t.power=si(t.power+(xe[i?1:0]||0),0,t.maxPower),this.power=si(this.power+(re[i?1:0]||0),0,this.maxPower))}return t&&(t.sprPriority=e.p1sprpriority??1,this.sprPriority=e.p2sprpriority??0,!i&&e.p1stateno>=0&&t.changeState(e.p1stateno,void 0,e.stateOwner||t.stateOwner)),this.events.push({type:"hit",damage:S,guarded:i,attacker:t==null?void 0:t.id}),{damage:S,guarded:i,cornerPush:p}}attributeMatches(e,t){return Kr(e,t)}matchingHitOverride(e){for(let t=0;t<8;t++){const i=this.hitOverrides.get(t);if(i!=null&&i.time&&Kr(i.attribute||i.attr,e.attr))return i}return null}canBeHit(e,t){var s;if(!Zu(this,e,t)||(s=this.world)!=null&&s.isSuperUnhittable(this))return!1;for(const r of this.hitFilters)if(r!=null&&r.time&&!qu(r,e.attr))return!1;return!(String(e[this.stateType==="A"?"air.type":"ground.type"]??e["ground.type"]??"high").toLowerCase()==="none")&&this.matchingHitOverride(e)&&(e.p1stateno>=0||e.p2getp1state===1||e.p2stateno>=0&&e.p2getp1state!==0)?!1:!this.asserted.has("unhittable")}explodController(e){return Gu(this,e)}updateExplods(e={}){return Wu(this,e)}updateBinding(){var t;const e=this.bound;if(e){if(e.target.destroyed){this.bound=null;return}this.pos.x=e.target.pos.x+e.x*e.target.facing,this.pos.y=e.target.pos.y+e.y,(t=this.world)!=null&&t.orderedPhases&&(this.pos.x=Math.fround(this.pos.x),this.pos.y=Math.fround(this.pos.y)),e.facing&&(this.facing=e.target.facing*(e.facing<0?-1:1)),e.time>0&&--e.time===0&&(this.bound=null)}}}const Rn=(n,e=[0,0])=>Array.isArray(n)?[Number(n[0]??e[0]),Number(n[1]??e[1])]:n===void 0?[...e]:[Number(n),e[1]];class as{constructor(e,t,{id:i}={}){var o;this.creator=e,this.owner=e.root||e,this.root=this.owner,this.isProjectile=!0,this.world=e.world,this.id=i,this.projId=Math.max(0,Math.trunc(t.projid??0)),this.teamSide=e.teamSide,this.character=e.character,this.coordinateScale=e.coordinateScale,this.baseCoordinateScale=this.coordinateScale,this.paletteParent=hr(e),this.guardDistance=e.constant("size.proj.attack.dist")*e.coordinateScale,this.animations=e.animations,this.program={...e.program,constants:new Map(e.program.constants)},this.spec=t,this.events=[],this.diagnostics=[],this.asserted=new Set,Number(t.projid)<0&&this.diagnostic("projectile-id","Negative ProjID was clamped to 0."),Object.assign(this,Wc(e,t,!0));const s=Rn(t.projscale,[1,1]),r=e.constant("size.proj.doscale")!==0;this.program.constants.set("size.xscale",s[0]*(r?e.constant("size.xscale"):1)),this.program.constants.set("size.yscale",s[1]*(r?e.constant("size.yscale"):1)),this.program.constants.set("size.draw.offset.x",0),this.program.constants.set("size.draw.offset.y",0);const a=Rn(t.velocity);if(this.vel={x:a[0]*this.coordinateScale,y:a[1]*this.coordinateScale},this.accel=Rn(t.accel).map(l=>l*this.coordinateScale),this.velmul=Rn(t.velmul,[1,1]),this.anim=Math.trunc(t.projanim??0),this.frameIndex=0,this.frameTime=0,this.collisionFrame=null,this.hitDef=t.hitDef,this.proximityHitDef=t.hitDef,this.hitPauseTime=0,this.hitCount=0,this.moveType="A",this.stateType=(((o=this.hitDef)==null?void 0:o.attr)||"S")[0].toUpperCase(),this.priority=Math.max(1,Math.trunc(t.projpriority??1)),this.sprPriority=t.projsprpriority??3,this.remainingHits=Math.max(0,Math.trunc(t.projhits??1)),this.missTime=Math.max(0,Math.trunc(t.projmisstime??0)),this.pauseMoveTime=Math.max(0,t.pausemovetime||0),this.superMoveTime=Math.max(0,t.supermovetime||0),this.ownPal=!!t.ownpal,this.time=0,this.removing=!1,this.removed=!1,this.activeTicks=0,this.nextHitAge=0,this.drawVisible=!0,this._inTick=!1,this._paletteRemaps=Do(e.paletteRemaps),this.ownPal&&t.remappal!==void 0)try{No(this._paletteRemaps,this.character,t.remappal)}catch(l){this.diagnostic("palette",l.message)}this.attackMultiplier=e.attackMultiplier,this.animations.has(this.anim)||(this.diagnostic("missing-animation",`Projectile animation ${this.anim} does not exist.`),this.removed=!0)}get currentFrame(){var e;return((e=this.animations.get(this.anim))==null?void 0:e.frames[this.frameIndex])||null}get life(){return this.removed||this.removing?0:1}get power(){return this.owner.power}set power(e){this.owner.power=e}get maxPower(){return this.owner.maxPower}get targets(){return this.owner.targets}get targetHitIds(){return this.owner.targetHitIds}get paletteRemaps(){return this.ownPal?this._paletteRemaps:this.paletteParent.paletteRemaps}constant(e){const t=this.program.constants.get(e);return Array.isArray(t)?t[0]:t}changeState(){return this.diagnostic("unsupported-projectile","A projectile cannot enter a player state."),!1}diagnostic(e,t){this.diagnostics.some(i=>i.message===t)||this.diagnostics.push({type:e,message:t,source:this.spec.source,line:this.spec.line})}record(e){var i;const t=this.owner.projectileHistory;t.push({type:e,projId:this.projId,tick:((i=this.world)==null?void 0:i.ticks)??this.time});for(let s=t.length-2;s>=0;s--)t[s].type===e&&t[s].projId===this.projId&&t.splice(s,1);t.length>4096&&(t.shift(),this.diagnostic("resource-limit","Projectile history exceeded 4096 distinct ID/event pairs."))}canHit(){return!this.removed&&!this.removing&&!!this.hitDef&&this.activeTicks>=this.nextHitAge&&this.remainingHits>0}onContact({guarded:e=!1,defer:t=!1}={}){this.record(e?"guarded":"hit"),this._contactPending=!0,this.hitPauseTime>0&&(this._holdCollisionFrame=!0),t||this.finishContacts()}finishContacts(){var e;this._contactPending&&(this._contactPending=!1,this.remainingHits--,this.nextHitAge=this.activeTicks+((e=this.world)!=null&&e.orderedPhases?Math.max(1,this.missTime):this.missTime+1),this.spec.projremove!==0&&this.remainingHits<=0&&this.remove("hit"))}cancel(){!this.removing&&!this.removed&&(this.record("cancel"),this.hitPauseTime=0,this.remove("cancel"))}clash(e){var t,i;this.priority>e.priority?this.priority--:this.remainingHits--,this.remainingHits<=0?this.cancel():this.hitPauseTime=Math.max(this.hitPauseTime,((i=(t=this.hitDef)==null?void 0:t.pauseTime)==null?void 0:i[0])||0)}remove(e="expire"){if(!(this.removing||this.removed)){if(this.removing=!0,this.hitDef=null,this.removalReason=e,this._removeAtLoopEnd=this._loopedThisTick,this.hitPauseTime>0){this._holdCollisionFrame=!0;return}this.beginRemoval()}}beginRemoval(){var l;this.removalStarted=!0;const e=this.removalReason,t=this.spec.projhitanim??-1,i=this.spec.projremanim??t,s=e==="hit"?t:e==="cancel"?this.spec.projcancelanim??i:i,r=Rn(this.spec.remvelocity);if(this.vel={x:r[0]*this.coordinateScale,y:r[1]*this.coordinateScale},s<0){this.removed=!0,this.drawVisible=!1;return}let a=!1;if(this.animations.has(s)?Math.trunc(s)!==this.anim&&(a=!0,this._loopedThisTick=!1,this.anim=Math.trunc(s),this.frameIndex=this.frameTime=0):this.diagnostic("missing-animation",`Projectile removal animation ${s} does not exist; retaining action ${this.anim}.`),(a||!this.collisionFrame)&&(this.collisionFrame=this.currentFrame,this.collisionAnimation=this.animations.get(this.anim),this.collisionFrameIndex=this.frameIndex,this.collisionFrameTime=this.frameTime),!a&&this._removeAtLoopEnd&&this._inTick){this.removed=!0,this.drawVisible=!1;return}const o=((l=this.animations.get(this.anim))==null?void 0:l.frames)||[];if(o.some(c=>c.ticks<0)||o.reduce((c,f)=>c+f.ticks,0)<=0){this.removed=!0,this.drawVisible=!1;return}this.drawVisible=!!this.collisionFrame,a&&!this._inTick?this.advanceFrame():!a&&!this._inTick&&this._loopedThisTick&&(this.removed=!0)}advanceFrame(){const e=this.currentFrame,t=this.animations.get(this.anim);e&&e.ticks>=0&&++this.frameTime>=Math.max(1,e.ticks)&&(this.frameTime=0,this.frameIndex++,this.frameIndex>=t.frames.length&&(this._loopedThisTick=!0,this.animationLooped=!0,this.removing&&(this.removed=!0),this.frameIndex=t.loopStart||0))}tick({paused:e=!1}={}){var t,i,s,r;if(this.events=[],this._activeThisTick=!1,this.removed){this.drawVisible=!1;return}if(!e){if(this.drawVisible=!0,this._holdCollisionFrame||this.captureFrame(),this.hitPauseTime>0){this.hitPauseTime--;return}if(this._holdCollisionFrame=!1,this._inTick=!0,this._loopedThisTick=!1,this.removing&&!this.removalStarted&&this.beginRemoval(),!this.removing){const a=Rn(this.spec.projheightbound,[-240/this.coordinateScale,1/this.coordinateScale]).map(_=>_*this.coordinateScale),o=(this.spec.projedgebound??40/this.coordinateScale)*this.coordinateScale,l=(this.spec.projstagebound??40/this.coordinateScale)*this.coordinateScale,c=((t=this.world)==null?void 0:t.leftBound)??-160,f=((i=this.world)==null?void 0:i.rightBound)??160,h=((s=this.world)==null?void 0:s.view.left)??c,u=((r=this.world)==null?void 0:r.view.right)??f,d=this.spec.projremovetime??-1,m=this.vel.x*this.facing;(d>=0&&this.time>=d||d<=-2&&this.animationLooped||this.pos.x<h-o||this.pos.x>u+o||m<0&&this.pos.x<c-l||m>0&&this.pos.x>f+l||this.vel.y<0&&this.pos.y<a[0]||this.vel.y>0&&this.pos.y>a[1])&&this.remove()}this.removed||(this.captureFrame(),this._activeThisTick=!0,this.activeTicks++,this.pos.x+=this.vel.x*this.facing,this.pos.y+=this.vel.y,this.removing||(this.vel.x=(this.vel.x+this.accel[0])*this.velmul[0],this.vel.y=(this.vel.y+this.accel[1])*this.velmul[1]),this.advanceFrame(),this.time++),this._inTick=!1}}finishMovementAllowance({paused:e=!1}={}){var t,i,s;if(!(e||!this._activeThisTick||this._hitPausedThisTick||this.hitPauseTime>0)){if((t=this.world)!=null&&t.orderedPhases){((i=this.world.pause)==null?void 0:i.remaining)>0&&(this.pauseMoveTime=Math.max(0,this.pauseMoveTime-1)),((s=this.world.superPause)==null?void 0:s.remaining)>0&&(this.superMoveTime=Math.max(0,this.superMoveTime-1));return}this.pauseMoveTime=Math.max(0,this.pauseMoveTime-1),this.superMoveTime=Math.max(0,this.superMoveTime-1)}}captureFrame(){this.collisionFrame=this.currentFrame,this.collisionAnimation=this.animations.get(this.anim),this.collisionFrameIndex=this.frameIndex,this.collisionFrameTime=this.frameTime}}const vi=(n,e,t)=>Math.max(e,Math.min(t,n)),$n=(n,e=0)=>n===void 0||n===""?e:Number(n),_t=(n,e=[0,0])=>n===void 0?[...e]:String(n).split(",").map((t,i)=>$n(t.trim(),e[i]??0)),mr=n=>String(n??"").replace(/^"(.*)"$/,"$1"),lf=new Set(["normal","anim","parallax","dummy"]),cf=new Set(["null","anim","visible","enable","posset","posadd","velset","veladd","sinx","siny"]);function hf(n){var t,i;const e=[];for(const s of Object.keys(n).filter(r=>r.endsWith(".def"))){const r=bn(n[s]),a=Br(r);if(a.bgdef)try{e.push(uf(s,n,r,a))}catch(o){e.push({path:s,name:((t=a.info)==null?void 0:t.displayname)||((i=a.info)==null?void 0:i.name)||s,files:n,invalid:!0,diagnostics:[{source:s,line:0,type:"stage",message:o.message}]})}}return e}function uf(n,e,t=bn(e[n]),i=Br(t)){var x,I,R,A,F;const s=[],r=(N,P,B="stage")=>s.push({source:n,line:(P==null?void 0:P.line)||0,type:B,message:N}),a=n.slice(0,n.lastIndexOf("/")+1),o=n.indexOf("/stages/"),l=o>=0?n.slice(0,o+1):"",c=N=>{const P=[...new Set([a,l,""])],B=String(N).replaceAll("\\","/").split("/").at(-1),k=P.map(C=>{try{return Jn(N,C,!0)}catch{return null}}).find(C=>C&&e[C]);if(k)return k;if(B&&B!=="."&&B!=="..")try{const C=Jn(B,a);if(e[C])return C}catch{}return null},f=_t((x=i.stageinfo)==null?void 0:x.localcoord,[320,240]);if(f.length!==2||f.some(N=>!Number.isFinite(N)||N<=0))throw Error("Invalid stage localcoord.");const h=320/f[0],u=i.camera||{},d=i.playerinfo||{},m=i.bound||{},_=i.stageinfo||{},p=(N,P,B)=>{const H=$n(N[P],B);if(!Number.isFinite(H))throw Error(`Invalid stage numeric value ${P}.`);return H},v={startX:p(u,"startx",0)*h,startY:p(u,"starty",0)*h,left:p(u,"boundleft",0)*h,right:p(u,"boundright",0)*h,high:p(u,"boundhigh",-25)*h,low:p(u,"boundlow",0)*h,tension:Math.max(0,p(u,"tension",60)*h),floorTension:p(u,"floortension",0)*h,verticalFollow:vi(p(u,"verticalfollow",.2),0,1),zoomIn:p(u,"zoomin",1),zoomOut:p(u,"zoomout",1),startZoom:p(u,"startzoom",1)};if(v.left>v.right||v.high>v.low||v.zoomOut<=0||v.zoomIn<v.zoomOut)throw Error("Invalid stage camera bounds or zoom limits.");const S=i.bgdef.spr?c(i.bgdef.spr):null;S||r(`Stage sprite file is missing: ${i.bgdef.spr||"(unspecified)"}`);const E=i.music||{},T=E.bgmvolume!==void 0?p(E,"bgmvolume",100):100*(1+vi(p(E,"bgvolume",0),-255,255)/256),w={path:n,name:((I=i.info)==null?void 0:I.displayname)||((R=i.info)==null?void 0:R.name)||n,files:e,def:i,localcoord:f,coordinateScale:h,camera:v,sprite:S?{path:S}:null,animations:Fc(t),elements:[],controllers:[],diagnostics:s,leftBound:p(d,"leftbound",-1e3)*h,rightBound:p(d,"rightbound",1e3)*h,starts:[1,2].map(N=>({x:p(d,`p${N}startx`,N===1?-70:70)*h,y:p(d,`p${N}starty`,0)*h,facing:p(d,`p${N}facing`,N===1?1:-1)<0?-1:1})),screenLeft:Math.max(0,p(m,"screenleft",15)*h),screenRight:Math.max(0,p(m,"screenright",15)*h),zoffset:p(_,"zoffset",200)*h,resetBG:p(_,"resetbg",1)!==0,autoturn:p(_,"autoturn",1)!==0,xscale:p(_,"xscale",1),yscale:p(_,"yscale",1),backgroundScale:p(_,"hires",0)!==0?.5:1,zoffsetlink:_.zoffsetlink===void 0?null:p(_,"zoffsetlink",0),cropHigh:Math.max(0,p(u,"cuthigh",0)*h),cropLow:Math.max(0,p(u,"cutlow",0)*h),music:{path:E.bgmusic?c(E.bgmusic):null,requested:E.bgmusic||"",volume:T,loop:p(E,"bgmloop",1)!==0,loopStart:p(E,"bgmloopstart",0),loopEnd:p(E,"bgmloopend",0)}};if(w.shadow={intensity:vi(p(i.shadow||{},"intensity",128),0,256),color:_t((A=i.shadow)==null?void 0:A.color,[0,0,0]),yscale:p(i.shadow||{},"yscale",.4),fade:(F=i.shadow)!=null&&F["fade.range"]?_t(i.shadow["fade.range"]):null},w.reflection=vi(p(i.reflection||{},"intensity",0),0,256),w.leftBound>=w.rightBound)throw Error("Invalid stage player bounds.");w.music.requested&&!w.music.path&&r(`Stage music is missing: ${w.music.requested}`);let y={ids:null,loop:-1};const g=new Set(["type","spriteno","actionno","id","layerno","start","delta","trans","alpha","mask","velocity","tile","tilespacing","positionlink","sin.x","sin.y","window","maskwindow","windowdelta","xscale","width","yscalestart","yscaledelta","scalestart","scaledelta","zoomdelta"]);for(const N of Qc(t,n)){const P=N.values;if(/^bgctrldef(?:\s|$)/.test(N.name))y={ids:P.ctrlid===void 0?null:_t(P.ctrlid,[]),loop:p(P,"looptime",-1)};else if(/^bgctrl(?:\s|$)/.test(N.name)){const B=mr(P.type).toLowerCase();if(!cf.has(B)){r(`Background controller ${B} is not implemented.`,N,"unsupported-stage-controller");continue}const H=_t(P.time,[0]);for(const[k,C]of Object.entries(P))if(k!=="type"&&_t(C,[]).some(L=>!Number.isFinite(L)))throw Error(`Invalid background controller ${k} at line ${N.line}.`);w.controllers.push({type:B,time:[H[0],H[1]??H[0],H[2]??-1],groupLoop:y.loop,ids:P.ctrlid===void 0?y.ids:_t(P.ctrlid,[]),values:P,line:N.line})}else if(/^bg(?:\s|$)/.test(N.name)){const B=mr(P.type||"normal").toLowerCase();if(!lf.has(B)){r(`Background type ${B} is not implemented.`,N,"unsupported-stage");continue}const H=B==="anim"||B==="parallax"&&P.actionno!==void 0,k=mr(P.trans||"default").toLowerCase(),C={type:B,animated:H,id:p(P,"id",0),layer:p(P,"layerno",0),start:_t(P.start),delta:_t(P.delta,[1,1]),velocity:_t(P.velocity),spriteno:_t(P.spriteno),anim:p(P,"actionno",0),mask:H||p(P,"mask",["add","sub"].includes(k)?1:0)!==0,trans:k,alpha:_t(P.alpha,k==="addalpha"?[256,0]:[256,256]),tile:_t(P.tile),spacing:_t(P.tilespacing),link:p(P,"positionlink",0)!==0,sinX:_t(P["sin.x"],[0,0,0]),sinY:_t(P["sin.y"],[0,0,0]),xscale:_t(P.xscale,[1,1]),width:P.width===void 0?null:_t(P.width),yScaleStart:p(P,"yscalestart",100)/100,yScaleDelta:p(P,"yscaledelta",0)/100,scaleStart:_t(P.scalestart,[1,1]),scaleDelta:_t(P.scaledelta),zoomDelta:p(P,"zoomdelta",1),window:P.maskwindow?_t(P.maskwindow,[]):P.window?_t(P.window,[]):null,windowCentered:!!P.maskwindow,windowDelta:_t(P.windowdelta),transSpecified:P.trans!==void 0,line:N.line};for(const[L,G]of Object.entries(C))if(Array.isArray(G)&&G.some($=>!Number.isFinite($)))throw Error(`Invalid background ${L} at line ${N.line}.`);for(const L of["start","delta","velocity","spriteno","alpha","tile","spacing","xscale","scaleStart","scaleDelta","windowDelta"])if(C[L].length!==2)throw Error(`Invalid background ${L} at line ${N.line}.`);if(C.width&&C.width.length!==2||C.window&&C.window.length!==4)throw Error(`Invalid background dimensions at line ${N.line}.`);if(H&&!w.animations.some(L=>L.id===C.anim)&&r(`Stage action ${C.anim} is missing.`,N),H&&C.tile.some((L,G)=>L&&C.spacing[G]<=0)&&B!=="parallax"&&r("Animated background tiling requires positive tilespacing.",N),B==="parallax"&&P.xscale!==void 0&&(H||C.width))throw Error(`Parallax xscale cannot be combined with width or animation at line ${N.line}.`);for(const L of Object.keys(P))g.has(L)||r(`Background parameter ${L} is not implemented.`,N,"unsupported-stage-parameter");w.elements.push(C)}}if(w.elements.length>2048||w.controllers.length>4096)throw Error("Stage background/controller limit exceeded.");return w}function wl(n,e){return n[1]>0?n[0]*Math.sin(2*Math.PI*e/n[1]+(n[2]||0)*Math.PI/180):0}class ff{constructor(e){if(e.invalid)throw Error(e.diagnostics[0].message);this.definition=e,this.animations=new Map(e.animations.map(t=>[t.id,t])),this.diagnostics=[...e.diagnostics],this.reset()}reset({backgrounds:e=!0}={}){const t=this.definition;this.camera={x:vi(t.camera.startX,t.camera.left,t.camera.right),y:vi(t.camera.startY,t.camera.high,t.camera.low),zoom:vi(t.camera.startZoom,t.camera.zoomOut,t.camera.zoomIn)},(e||!this.elements)&&(this.time=0,this.elements=t.elements.map(i=>({...i,start:[...i.start],motion:[0,0],velocity:[...i.velocity],sinX:[...i.sinX],sinY:[...i.sinY],sinStartX:0,sinStartY:0,anim:i.anim,frameIndex:0,frameTime:0,visible:!0,enabled:!0})))}updateCamera(e){e=e.filter(a=>!a.destroyed&&!a.isProjectile);const t=this.definition,i=t.camera,s=e.filter(a=>{var o;return((o=a.moveCamera)==null?void 0:o.x)!==!1}),r=e.filter(a=>{var o;return((o=a.moveCamera)==null?void 0:o.y)!==!1});if(s.length){const a=Math.min(...s.map(h=>h.pos.x)),o=Math.max(...s.map(h=>h.pos.x));this.camera.zoom=vi(320/Math.max(1,o-a+2*i.tension),i.zoomOut,i.zoomIn);const l=Math.max(1,160/this.camera.zoom-i.tension),c=o-l,f=a+l;this.camera.x=vi(c<=f?vi(this.camera.x,c,f):(a+o)/2,i.left,i.right)}r.length&&(this.camera.y=vi(Math.min(0,Math.min(...r.map(a=>a.pos.y))+i.floorTension)*i.verticalFollow,i.high,i.low))}view(e=16/9){const t=this.definition,i=t.cropHigh+t.cropLow?320/e:t.localcoord[1]*t.coordinateScale,s=Math.max(0,t.localcoord[1]*t.coordinateScale-i),r=t.cropHigh+t.cropLow?t.cropHigh/(t.cropHigh+t.cropLow):.5;let a=t.zoffset;if(t.zoffsetlink!==null){const f=this.elements.findIndex(h=>h.id===t.zoffsetlink);f>=0&&(a=this.position(f).y*t.coordinateScale)}const o=a-s*r,l=320/this.camera.zoom,c=i/this.camera.zoom;return{left:this.camera.x-l/2,right:this.camera.x+l/2,top:this.camera.y-o/this.camera.zoom,bottom:this.camera.y+(i-o)/this.camera.zoom,width:l,height:c,displayHeight:i,groundY:o,zoffset:a,cropTop:s*r,zoom:this.camera.zoom}}position(e){let t=0,i=0,s=[1,1],r=0;for(let a=e;a>=0&&r++<2048;a--){const o=this.elements[a];if(t+=o.start[0]+o.motion[0]+wl(o.sinX,this.time-o.sinStartX),i+=o.start[1]+o.motion[1]+wl(o.sinY,this.time-o.sinStartY),s=o.delta,!o.link)break}return{x:t,y:i,delta:s}}tick({paused:e=!1}={}){if(!e){for(const t of this.definition.controllers){let i=t.groupLoop>0?this.time%t.groupLoop:this.time;if(t.time[2]>0&&(i%=t.time[2]),!(i<t.time[0]||i>t.time[1]))for(const s of this.elements){if(t.ids&&!t.ids.includes(s.id)&&!t.ids.includes(-1))continue;const r=t.values;if(t.type==="visible")s.visible=$n(r.value,1)!==0;else if(t.type==="enable")s.enabled=$n(r.value,1)!==0;else if(t.type==="anim")s.anim=$n(r.value,0),s.frameIndex=s.frameTime=0;else if(t.type==="sinx"||t.type==="siny"){const a=t.type==="sinx"?"sinX":"sinY";s[a]=_t(r.value,[0,0,0]),s[a==="sinX"?"sinStartX":"sinStartY"]=this.time}else if(/^(pos|vel)(set|add)$/.test(t.type)){for(const[a,o]of[["x",0],["y",1]])if(r[a]!==void 0){const l=$n(r[a]),c=t.type.startsWith("pos")?s.motion:s.velocity;t.type.endsWith("set")?c[o]=l-(c===s.motion?s.start[o]:0):c[o]+=l}}}}for(const t of this.elements)if(t.enabled){for(let r=0;r<2;r++)t.motion[r]+=t.velocity[r];t.drawFrameIndex=t.frameIndex,t.drawFrameTime=t.frameTime;const i=this.animations.get(t.anim),s=i==null?void 0:i.frames[t.frameIndex];t.animated&&s&&s.ticks>=0&&++t.frameTime>=Math.max(1,s.ticks)&&(t.frameTime=0,++t.frameIndex>=i.frames.length&&(t.frameIndex=i.loopStart||0))}this.time++}}frame(e){var t;return e.animated?(t=this.animations.get(e.anim))==null?void 0:t.frames[e.drawFrameIndex??e.frameIndex]:{group:e.spriteno[0],number:e.spriteno[1],x:0,y:0,flip:"",ticks:-1}}variable(e){var a;const[t,...i]=String(e).toLowerCase().split("."),s=(a=this.definition.def[t])==null?void 0:a[i.join(".")];if(s===void 0)throw Error(`StageVar ${e} is not implemented or missing.`);const r=Number(s);return Number.isFinite(r)?r:mr(s)}}const df=n=>{if(n[0].life<=0&&n[1].life<=0)return"draw";if(n[0].life<=0)return"opponent";if(n[1].life<=0)return"player";const e=n[0].life*n[1].maxLife-n[1].life*n[0].maxLife;return e===0?"draw":e>0?"player":"opponent"};class pf{constructor({roundsToWin:e=2,roundTime:t=99,preIntro:i=30,introHold:s=30,overTime:r=60,resultTime:a=90,autoAdvance:o=!0}={}){for(const[l,c]of Object.entries({roundsToWin:e,roundTime:t,preIntro:i,introHold:s,overTime:r,resultTime:a}))if(!Number.isFinite(c)||c<0)throw Error(`Invalid match rule ${l}.`);if(e<1||e>99||t>3600)throw Error("Match rule exceeds supported bounds.");this.rules={roundsToWin:Math.trunc(e),roundTime:t,preIntro:Math.trunc(i),introHold:Math.trunc(s),overTime:Math.trunc(r),resultTime:Math.trunc(a),autoAdvance:o},this.roundNo=1,this.roundsExisted=0,this.wins={player:0,opponent:0},this.matchOver=!1,this.roundWinner=null,this.reason=null,this.startRound()}startRound(){this.roundState=0,this.phaseTime=0,this.timeLeft=this.rules.roundTime?Math.round(this.rules.roundTime*60):-1,this.roundWinner=null,this.reason=null,this._awarded=!1}step({players:e,paused:t=!1,intro:i=!1,roundNotOver:s=!1,timerFreeze:r=!1,noKO:a=[!1,!1]}={}){const o=[];if(t)return o;if(this.roundState===0)return++this.phaseTime>=this.rules.preIntro&&(this.roundState=1,this.phaseTime=0),o;if(this.roundState===1)return this.phaseTime++,!i&&this.phaseTime>=this.rules.introHold&&(this.roundState=2,this.phaseTime=0,o.push({type:"fight"})),o;if(this.roundState===2){this.phaseTime++;const l=e.some((c,f)=>c.life<=0&&!a[f]);return!r&&this.timeLeft>0&&this.timeLeft--,(l||this.timeLeft===0)&&(this.roundWinner=df(e),this.reason=l?e.every(c=>c.life<=0)?"double-ko":"ko":"time",this.roundState=3,this.phaseTime=0,o.push({type:"round-over",winner:this.roundWinner,reason:this.reason})),o}return this.roundState===3?(s||++this.phaseTime>=this.rules.overTime&&(!this._awarded&&this.roundWinner!=="draw"&&(this.wins[this.roundWinner]++,this._awarded=!0),this.matchOver=Object.values(this.wins).some(l=>l>=this.rules.roundsToWin),this.roundState=4,this.phaseTime=0,o.push({type:"result",winner:this.roundWinner,reason:this.reason,matchOver:this.matchOver})),o):(this.roundState===4&&!s&&!this.matchOver&&this.rules.autoAdvance&&++this.phaseTime>=this.rules.resultTime&&(this.roundNo++,this.roundsExisted++,this.startRound(),o.push({type:"next-round",roundNo:this.roundNo})),o)}}const qt=["a","b","c","x","y","z","s"],ms=["U","D","B","F","UB","UF","DB","DF"],mf=new Set(["U","D","L","R",...qt]),Tr=3600,bl=128,El=4096;function gf(n){let e=null;for(let t=0;t<n.length;t++){const i=n[t];if((i==='"'||i==="'")&&(!e||e===i))e=e?null:i;else if(i===";"&&!e)return n.slice(0,t).trim()}return n.trim()}function Qr(n){const e=n.match(/^(?:"([\s\S]*)"|'([\s\S]*)')$/);return e?e[1]??e[2]:n}function vf(n){let e=n.replace(/\s/g,"");if(!e)throw Error("Empty command symbol.");const t={source:n,strict:!1,hold:!1,release:!1,charge:0,tolerant:!1},i=new Set;for(;/^[>\/~$]/.test(e);){const r=e[0];if(i.has(r))throw Error(`Repeated ${r} modifier in ${n}.`);if(i.add(r),e=e.slice(1),r===">"&&(t.strict=!0),r==="/"&&(t.hold=!0),r==="$"&&(t.tolerant=!0),r==="~"){t.release=!0;const a=e.match(/^\d+/);if(a){if(t.charge=Number(a[0]),!Number.isSafeInteger(t.charge)||t.charge>Tr)throw Error(`Charge duration exceeds the ${Tr}-tick runtime limit.`);e=e.slice(a[0].length)}}}if(t.hold&&t.release)throw Error(`Hold and release cannot be combined in ${n}.`);const s=e.split("+");if(s.some(r=>!r)||new Set(s).size!==s.length)throw Error(`Invalid simultaneous input ${n}.`);if(s.length===1&&ms.includes(s[0]))t.kind="direction",t.keys=s,t.key=(t.tolerant?"$":"")+s[0];else if(s.every(r=>qt.includes(r))){if(t.tolerant)throw Error(`The $ modifier is only valid on directions: ${n}.`);t.kind="button",t.keys=s}else if(s.filter(r=>ms.includes(r)).length===1&&s.every(r=>ms.includes(r)||qt.includes(r)))t.kind="chord",t.keys=s.map(r=>ms.includes(r)&&t.tolerant?"$"+r:r);else throw Error(`Unsupported command symbol ${n}. Directions are uppercase and buttons are lowercase.`);return t}function xf(n){const e=n.split(",").map(vf),t=[];for(const i of e){const s=t.at(-1);(s==null?void 0:s.kind)==="direction"&&i.kind==="direction"&&s.key===i.key&&!s.hold&&!s.release&&!i.hold&&!i.release?(t.push({...i,source:`>~${i.key}`,strict:!0,release:!0,charge:0}),t.push({...i,strict:!0})):t.push(i)}if(t.length>bl)throw Error(`Command exceeds the ${bl}-symbol runtime limit.`);return t}function Bo(n){const e=[];let t;for(const[c,f]of String(n).replace(/^\uFEFF|^ï»¿/,"").split(/\r?\n/).entries()){const h=gf(f),u=h.match(/^\[([^\]]+)\]$/);if(u)t={name:u[1].trim().toLowerCase(),line:c+1,values:{}},e.push(t);else if(t){const d=h.indexOf("=");d>0&&(t.values[h.slice(0,d).trim().toLowerCase()]=h.slice(d+1).trim())}}const i=[],s={time:15,bufferTime:1},r=Object.fromEntries(qt.map(c=>[c,c])),a=(c,f,h=Qr(c.values.name??""))=>{i.push({kind:"command",name:h,line:c.line,message:f})};function o(c,f,h,u,d){if(c==null)return f;if(!/^[-+]?\d+$/.test(c.trim())||!Number.isSafeInteger(Number(c)))throw Error(`${u} must be an integer.`);const m=Math.max(1,Number(c));if(m>d){if(u==="buffer.time"||u==="command.buffer.time")return d;throw Error(`${u} exceeds the ${d}-tick runtime limit.`)}return m}for(const c of e){if(c.name==="defaults")try{s.time=o(c.values["command.time"],s.time,c,"command.time",Tr),s.bufferTime=o(c.values["command.buffer.time"],s.bufferTime,c,"command.buffer.time",30)}catch(f){a(c,f.message)}if(c.name==="remap")for(const[f,h]of Object.entries(c.values)){const u=Qr(h);!qt.includes(f)||u&&!qt.includes(u)?a(c,`Unsupported button remap ${f} = ${h}.`):r[f]=u}}const l=[];for(const c of e){if(c.name!=="command")continue;if(l.length>=El){a(c,`Command count exceeds the ${El}-command runtime limit.`);break}const{values:f}=c,h=Qr(f.name??"");try{if(!h)throw Error("Command is missing its name.");if(!f.command)throw Error("Command is missing its input sequence.");const u=xf(f.command);l.push({name:h,command:f.command,sequence:u,time:o(f.time,s.time,c,"time",Tr),bufferTime:o(f["buffer.time"],s.bufferTime,c,"buffer.time",30),line:c.line,holdOnly:u.every(d=>d.hold)})}catch(u){a(c,u.message,h)}}return{commands:l,defaults:s,remap:r,diagnostics:i}}function _f(n,e,t){const i=new Set;n.has("U")!==n.has("D")&&i.add(n.has("U")?"U":"D"),n.has("L")!==n.has("R")&&i.add(n.has(e<0?"L":"R")?"F":"B");for(const s of qt)n.has(s)&&t[s]&&i.add(t[s]);return i}function yf(n){const e=new Set(qt.filter(i=>n.has(i))),t=(n.has("U")?"U":n.has("D")?"D":"")+(n.has("B")?"B":n.has("F")?"F":"");t&&e.add(t);for(const i of ms)[...i].every(s=>n.has(s))&&e.add("$"+i);return e}function Sf(n){return n.kind==="direction"?[n.key]:n.keys}function Us(n,e){const t=Sf(n);return n.hold?t.every(i=>e.held.has(i)):n.release?t.every(i=>e.released.has(i)&&(e.previousDurations.get(i)??0)>=n.charge):t.every(i=>n.kind==="chord"&&!qt.includes(i)?e.held.has(i):e.pressed.has(i))}function Mf(n){if(n.hold)return[];const e=n.release?"release:":"press:";return n.kind==="chord"?n.keys.filter(t=>qt.includes(t)||n.release).map(t=>e+(qt.includes(t)?t:"direction")):n.kind==="direction"?[e+"direction"]:n.keys.map(t=>e+t)}function Tl(n,e,t){if(n.kind==="chord"){const i=new Set;for(const s of n.keys)if(qt.includes(s))for(const r of qt)t[r]===s&&i.add(r);else for(const r of s.replace("$",""))i.add(r==="F"?e.facing<0?"L":"R":r==="B"?e.facing<0?"R":"L":r);return i}return n.kind==="button"?new Set(qt.filter(i=>n.keys.includes(t[i]))):new Set([...n.keys[0]].map(i=>i==="F"?e.facing<0?"L":"R":i==="B"?e.facing<0?"R":"L":i))}class ys{constructor(e={commands:[]}){typeof e=="string"&&(e=Bo(e)),this.commands=e.commands??[],this.remap=e.remap??Object.fromEntries(qt.map(t=>[t,t])),this.diagnostics=[...e.diagnostics??[]],this.historyLimit=Math.max(1,...this.commands.map(t=>t.time+1)),this.reset()}reset(){this.tick=-1,this.history=[],this.buffered=new Map,this.active=new Set,this.previous={raw:new Set,held:new Set,durations:new Map}}update(e,t=1){this.tick++;const i=new Set([...e].filter(l=>mf.has(l))),s=yf(_f(i,t,this.remap)),r=this.previous,a={tick:this.tick,raw:i,facing:t,held:s,pressed:new Set([...s].filter(l=>!r.held.has(l))),released:new Set([...r.held].filter(l=>!s.has(l))),previousDurations:r.durations,durations:new Map([...s].map(l=>[l,(r.durations.get(l)??0)+1])),changes:new Set([...i,...r.raw].filter(l=>i.has(l)!==r.raw.has(l)))};this.previous=a,this.history.push(a),this.history.length>this.historyLimit&&this.history.shift(),this.active=new Set;let o=25e4;for(const l of this.commands){if(l.holdOnly){l.sequence.every(f=>Us(f,a))&&this.active.add(l.name);continue}if(l.sequence.every(f=>!f.hold||Us(f,a))&&Us(l.sequence.at(-1),a)&&this.matchSequence(l,()=>--o>=0)&&this.buffered.set(l.name,this.tick+l.bufferTime-1),(this.buffered.get(l.name)??-1)>=this.tick&&this.active.add(l.name),o<0){this.diagnostics.some(f=>f.message==="Input matching work limit reached.")||this.diagnostics.push({kind:"command",message:"Input matching work limit reached."});break}}for(const[l,c]of this.buffered)c<this.tick&&this.buffered.delete(l);return this.active}matchSequence(e,t){const i=this.history.length-1,s=this.tick-e.time;let r=i,a=null,o=new Set;for(let l=e.sequence.length-1;l>=0;l--){const c=e.sequence[l],f=Mf(c);let h=-1;for(let u=r;u>=0&&this.history[u].tick>=s;u--){if(!t())return!1;if(u<r&&(o=new Set),!(!Us(c,this.history[u])||f.some(d=>o.has(d)))&&!(a!=null&&a.symbol.strict&&!this.strictBetween(u,a.index,c,a.symbol))){h=u;break}}if(h<0)return!1;h!==r&&(o=new Set);for(const u of f)o.add(u);r=h,a={index:h,symbol:c}}return!0}strictBetween(e,t,i,s){const r=this.history[t],a=Tl(s,r,this.remap);if(e===t){for(const o of Tl(i,r,this.remap))a.add(o);return[...r.changes].every(o=>a.has(o))}for(let o=e+1;o<t;o++)if(this.history[o].changes.size)return!1;return[...r.changes].every(o=>a.has(o))}}const Al=["a","b","c","x","y","z","s"];function Oa(n){return Number.isFinite(Number(n))?Math.max(0,Math.min(8,Math.trunc(Number(n)))):0}function ea(n){var t,i,s,r,a,o;let e=(i=(t=n.checks)==null?void 0:t.find(l=>l.key==="cmd"&&l.ok))==null?void 0:i.path;if(!e&&((r=(s=n.def)==null?void 0:s.files)!=null&&r.cmd))try{e=Jn(n.def.files.cmd,((a=n.path)==null?void 0:a.slice(0,n.path.lastIndexOf("/")+1))||"",!0)}catch{}return Bo(e&&((o=n.files)!=null&&o[e])?bn(n.files[e]):"")}function Rl(n){const e=[];let t=new Set,i=new Set,s=new Set;const r=(a=1,o=[])=>{const l=new Set([...t,...i,...o]),c=e.at(-1);c&&l.size===c.keys.size&&[...l].every(f=>c.keys.has(f))?c.duration+=a:e.push({keys:l,duration:a}),s=l};r();for(const a of n.sequence)if(a.kind==="direction"){const o=new Set(a.keys[0]);a.release?(t=o,r(Math.max(1,a.charge)),t=new Set,r()):(!a.hold&&o.size===t.size&&[...o].every(l=>t.has(l))&&(t=new Set,r()),t=o,r())}else if(a.release){r(Math.max(1,a.charge),a.keys);for(const o of a.keys)i.delete(o);r()}else{if(a.keys.some(o=>s.has(o))&&!a.hold&&r(),a.hold)for(const o of a.keys)i.add(o);r(1,a.keys)}return t=new Set,i=new Set,r(),e}class wf{constructor(e,{level:t=4,seed:i=1831565813}={}){var r;this.level=Oa(t),this.seed=i>>>0||1,this.buffer=new ys(e),this.inverse=new Map;for(const a of Al){const o=((r=e.remap)==null?void 0:r[a])??a;o&&!this.inverse.has(o)&&this.inverse.set(o,a)}const s=e.commands.filter(a=>a.sequence.every(o=>o.kind!=="button"||o.keys.every(l=>this.inverse.has(l))));this.attacks=s.filter(a=>!a.holdOnly&&a.sequence.some(o=>o.kind==="button"&&o.keys.some(l=>l!=="s"))).slice(0,512),this.byName=new Map;for(const a of s)this.byName.has(a.name)||this.byName.set(a.name,[]),this.byName.get(a.name).push(a);this.recoveries=s.filter(a=>a.name.toLowerCase()==="recovery"),this.recoveryNames=new WeakMap,this.recoveryButton=0,this.recovering=!1,this.normal=this.attacks.filter(a=>a.sequence.length===1&&!a.sequence[0].release),this.special=this.attacks.filter(a=>!this.normal.includes(a)),this.plan=[],this.index=0,this.remaining=0,this.cooldown=0,this.raw=new Set,this.lastCommand=null}random(){let e=this.seed;return e^=e<<13,e^=e>>>17,e^=e<<5,this.seed=e>>>0,this.seed/4294967296}physical(e,t){return new Set([...e].map(i=>i==="F"?t<0?"L":"R":i==="B"?t<0?"R":"L":this.inverse.get(i)||i))}queue(e,t){this.plan=[{keys:new Set(e),duration:t}],this.index=0,this.remaining=0}chooseRecovery(e){var a;const t=(a=e.stateOwner)==null?void 0:a.program.states.get(e.stateNo);let i=t&&this.recoveryNames.get(t);if(t&&!i){i=new Set;for(const o of t.controllers){if(!["changestate","selfstate"].includes(o.type))continue;const l=o.entries.filter(c=>/^trigger(?:all|[1-9]\d*)$/.test(c.key)).map(c=>c.value).join(`
`);if(/\bcanrecover\b/i.test(l))for(const c of l.matchAll(/\bcommand\s*=\s*"([^"\\]*)"/gi))i.add(c[1])}this.recoveryNames.set(t,i)}const s=[...i||[]].flatMap(o=>this.byName.get(o)||[]),r=s.length?s:this.recoveries;if(r.length){const o=r[Math.floor(this.random()*r.length)];this.lastCommand=o.name,this.plan=Rl(o),this.index=0,this.remaining=0}else{const o=Al.filter(l=>l!=="s"&&this.inverse.has(l));o.length&&this.queue([o[this.recoveryButton++%o.length]],1)}}choose(e,t){if(!e.ctrl||e.moveType==="H")return;const i=Math.abs(t.pos.x-e.pos.x),s=e.coordinateScale||1,r=e.constant("size.ground.front")*s+t.constant("size.ground.front")*(t.coordinateScale||1)+20*s;if(i>r){this.queue(["F"],4+Math.floor(this.random()*9));return}if(t.moveType==="A"&&this.random()<.12+.07*this.level){this.queue(this.random()<.3?["D","B"]:["B"],4+this.level);return}if(this.attacks.length){const a=this.special.length&&this.random()<.08+.055*this.level?this.special:this.normal.length?this.normal:this.attacks,o=a[Math.floor(this.random()*a.length)];this.lastCommand=o.name,this.plan=Rl(o),this.index=0,this.remaining=0}else this.queue([],2)}tick(e,t,{paused:i=!1,enabled:s=!0}={}){var r,a;if(!this.level||!s||!e.alive||!(t!=null&&t.alive))this.plan=[],this.index=0,this.remaining=0,this.cooldown=0,this.raw=new Set,this.recovering=!1;else if(!i){const o=e.moveType==="H"&&!!((r=e.getHitVars)!=null&&r.fall);o!==this.recovering&&(this.plan=[],this.index=0,this.remaining=0,this.cooldown=o?10-this.level:0,this.raw=new Set,this.recovering=o);const l=o&&["A","L"].includes(e.stateType)&&!!((a=e.resolveTrigger)!=null&&a.call(e,"canrecover"));o&&!l&&(this.plan=[],this.index=0,this.remaining=0,this.cooldown=10-this.level,this.raw=new Set),this.index>=this.plan.length&&(this.cooldown>0?this.cooldown--:o?(l&&this.chooseRecovery(e),this.cooldown=14-this.level):(this.choose(e,t),this.cooldown=Math.max(1,15-this.level*1.5)));const c=this.plan[this.index];c?(this.remaining<=0&&(this.remaining=c.duration),this.raw=this.physical(c.keys,e.facing),--this.remaining<=0&&this.index++):this.raw=new Set}return this.buffer.update(this.raw,e.facing)}}const xn=(n,e=0)=>Number.isFinite(Number(n))?Number(n):e,Ba=n=>String(n??"").toUpperCase().replace(/\s/g,"");function Yn(n,e,t){var r;const i=(r=n.program)==null?void 0:r.constants,s=i instanceof Map?i.get(e):i==null?void 0:i[e];return s===void 0?t:xn(s,t)}function hn(n,e="clsn1",t=n.collisionFrame??n.currentFrame){var f,h,u,d;if(!t||!Array.isArray(t[e]))return[];const i=Zc(n),s=Ut(i),r=n.facing<0?-1:1,a=Yn(i,"size.xscale",1)*s*r,o=Yn(i,"size.yscale",1)*s,l=xn((f=n.pos)==null?void 0:f.x)+Yn(n,"size.draw.offset.x",0)*Ut(n)*r+xn((h=n.drawOffset)==null?void 0:h.x),c=xn((u=n.pos)==null?void 0:u.y)+Yn(n,"size.draw.offset.y",0)*Ut(n)+xn((d=n.drawOffset)==null?void 0:d.y);return t[e].filter(m=>Array.isArray(m)&&m.length>=4&&m.slice(0,4).every(_=>Number.isFinite(Number(_)))).map(m=>{const _=l+Number(m[0])*a,p=l+Number(m[2])*a,v=c+Number(m[1])*o,S=c+Number(m[3])*o;return[Math.min(_,p),Math.min(v,S),Math.max(_,p),Math.max(v,S)]})}function bf(n,e,t=!1){return t?n[0]<=e[2]&&n[2]>=e[0]&&n[1]<=e[3]&&n[3]>=e[1]:n[0]<e[2]&&n[2]>e[0]&&n[1]<e[3]&&n[3]>e[1]}function Fs(n,e,t=!1){for(const i of n)for(const s of e)if(bf(i,s,t))return[Math.max(i[0],s[0]),Math.max(i[1],s[1]),Math.min(i[2],s[2]),Math.min(i[3],s[3])];return null}function Ef(n,e){var i;const t=e.moveType==="H";return n.includes("+")&&!t||n.includes("-")&&t?!1:e.stateType==="L"?n.includes("D"):e.stateType==="A"?n.includes(e.moveType==="H"&&((i=e.getHitVars)!=null&&i.fall)?"F":"A"):n.includes("M")||n.includes(e.stateType==="C"?"L":"H")}function Tf(n,e,t,i){var l,c,f,h;const s=t.moveType==="H"&&!!((l=t.getHitVars)!=null&&l.guarded);if(!t.ctrl&&!s||t.moveType==="H"&&!s||!["S","C","A"].includes(t.stateType)||(c=e.asserted)!=null&&c.has("unguardable"))return!1;const r=t.stateType==="A"?"noairguard":t.stateType==="C"?"nocrouchguard":"nostandguard";if((f=t.asserted)!=null&&f.has(r))return!1;const a=new Set([...i].map(u=>String(u).toLowerCase()));if(!((h=t.world)!=null&&h.manageInputs?t.movementHeld("holdback"):a.has("holdback")))return!1;const o=Ba(n.guardFlag??n.guardflag);return t.stateType==="A"?o.includes("A"):t.stateType==="C"?/[LM]/.test(o):/[HM]/.test(o)}function Cl(n){const e=Array.isArray(n.priority)?n.priority:String(n.priority??"4,Hit").split(","),t=String(e[1]??"Hit").trim().toLowerCase();return{level:Math.max(1,Math.min(7,xn(e[0],4))),type:["hit","miss","dodge"].includes(t)?t:"hit"}}function Af(n){if(n.length<2)return n;const e=Cl(n[0].hit),t=Cl(n[1].hit);return e.level!==t.level?[n[e.level>t.level?0:1]]:e.type==="dodge"||t.type==="dodge"?[]:e.type==="miss"&&t.type==="miss"?[]:n.filter((i,s)=>(s?t:e).type==="hit")}class Rf{constructor(e,{commonText:t="",commonAnimations:i=new Map,opponentCharacter:s=e,leftBound:r=-150,rightBound:a=150,pushboxes:o=!0,maxHelpers:l=56,maxProjectiles:c=256,initialize:f=!0,skipIntro:h=!0,stage:u=null,rules:d=null,combatRules:m={},playerPalette:_=1,opponentPalette:p=1,playerAILevel:v=0,opponentAILevel:S=0,expressionEvaluator:E=null,programs:T=null,manageInputs:w=!1,orderedPhases:y=!1}={}){if(this.expressionEvaluator=E,this.programs=T,this.manageInputs=w,this.orderedPhases=y,this.combatRules=tf(e.files,m),!Number.isFinite(r)||!Number.isFinite(a)||r>=a)throw Error("Invalid training stage bounds.");this.character=e,this.opponentCharacter=s,this.commonText=t,this.leftBound=r,this.rightBound=a,this.pushboxes=o,this.commonAnimations=i,this.maxHelpers=Math.min(256,Math.max(0,l)),this.maxProjectiles=Math.min(1024,Math.max(0,c)),this.initialize=f,this.skipIntro=h,this.playerPalette=_,this.opponentPalette=p,this.playerAILevel=Oa(v),this.opponentAILevel=Oa(S),this.stage=u?new ff(u):null,this.rules=d,this.stage&&(this.leftBound=u.leftBound,this.rightBound=u.rightBound),this.reset()}reset({preserveMatch:e=!1}={}){var s,r,a,o;const t=e?{players:[this.player,this.opponent],flow:this.roundFlow,ticks:this.ticks,diagnostics:this.diagnostics}:null;this.roundFlow=(t==null?void 0:t.flow)||(this.rules?new pf(this.rules):null),this.roundGeneration=(this.roundGeneration||0)+1,this.stage&&this.stage.reset({backgrounds:!e||this.stage.definition.resetBG});const i=((s=this.stage)==null?void 0:s.definition.starts)||[{x:-70,y:0,facing:1},{x:70,y:0,facing:-1}];if(this.player=new Er(this.character,{world:this,program:(r=this.programs)==null?void 0:r.get(this.character),expressionEvaluator:this.expressionEvaluator,commonAnimations:this.commonAnimations,commonText:this.commonText,position:i[0],facing:i[0].facing,id:1,teamSide:1,paletteNo:this.playerPalette,aiLevel:this.playerAILevel}),this.opponent=new Er(this.opponentCharacter,{world:this,program:(a=this.programs)==null?void 0:a.get(this.opponentCharacter),expressionEvaluator:this.expressionEvaluator,commonAnimations:this.commonAnimations,commonText:this.commonText,position:i[1],facing:i[1].facing,id:2,teamSide:2,paletteNo:this.opponentPalette,aiLevel:this.opponentAILevel}),this.player.teamSide=1,this.opponent.teamSide=2,this.player.opponent=this.opponent,this.opponent.opponent=this.player,this._entities=[this.player,this.opponent],this.projectiles=[],this.nextEntityId=3,this.orphanEffectOwners=[],this.renderEntities=[...this._entities],this.drawProjectiles=[],this.helperCommands=new Map,this.usedHits=new Map,this.juggles=new Map,this.cornerPushActors=new Set,this.archivedDiagnostics=[],this.archivedDiagnosticKeys=new Set,this.pendingPauses=[],this.pause=null,this.superPause=null,this.commandBuffers=new Map,this.presentationEvents=[],this.eventEntities=[],this.pendingCombatEffects=[],this.activeActor=null,this.contactPhase=!1,this.inputBuffers=new Map,this.inputProfiles=new Map,this.manageInputs)for(const l of this._entities)this.inputProfiles.has(l.character)||this.inputProfiles.set(l.character,ea(l.character)),this.inputBuffers.set(l,new ys(this.inputProfiles.get(l.character)));this.events=[],this.cpus=new Map;for(const l of this._entities)if(l.aiLevel){const c=ea(l.character);this.cpus.set(l,new wf(c,{level:l.aiLevel,seed:1831565813^l.id*2654435769^(((o=this.roundFlow)==null?void 0:o.roundNo)||1)}));for(const f of c.diagnostics)l.diagnostic("command",f.message,{source:l.character.def.files.cmd,line:f.line})}if(this.ticks=(t==null?void 0:t.ticks)||0,this.winner=null,t){this.archiveDiagnostics(t.diagnostics);for(const[l,c]of[this.player,this.opponent].entries()){const f=t.players[l];c.power=f.power,c.victoryQuoteIndex=f.victoryQuoteIndex;const h=Math.max(0,Math.min(60,Math.trunc(c.program.constants.get("data.intpersistindex")??60))),u=Math.max(0,Math.min(40,Math.trunc(c.program.constants.get("data.floatpersistindex")??40)));c.vars.set(f.vars.subarray(h),h),c.fvars.set(f.fvars.subarray(u),u)}}if(this.syncEnvironment(),this.initialize)for(const l of this._entities)l.program.states.has(5900)&&(l._initializing=!0,l.options.skipIntro=this.skipIntro,l.changeState(5900));return this}get diagnostics(){var i;const e=[...this.archivedDiagnostics,...((i=this.stage)==null?void 0:i.diagnostics)||[],...this.entities.flatMap(s=>s.diagnostics||[]),...this.orphanEffectOwners.flatMap(s=>s.diagnostics||[]),...this.projectiles.flatMap(s=>s.diagnostics||[]),...[...this.cpus||new Map].flatMap(([s,r])=>r.buffer.diagnostics.map(a=>({...a,source:s.character.def.files.cmd})))],t=new Set;return e.filter(s=>{const r=typeof s=="string"?s:JSON.stringify(s);return t.has(r)?!1:(t.add(r),!0)})}get entities(){return this._entities.filter(e=>!e.destroyed)}get view(){var e;return((e=this.stage)==null?void 0:e.view())||{left:-160,right:160,top:-200,bottom:40,width:320,height:240,displayHeight:240,groundY:200,zoom:1}}get matchOver(){var e;return((e=this.roundFlow)==null?void 0:e.matchOver)||!1}syncEnvironment(){for(const e of this._entities||[])this.stage&&(e.cameraPos=this.stage.camera,e.cameraZoom=this.stage.camera.zoom),this.roundFlow&&(e.roundState=this.roundFlow.roundState,e.roundNo=this.roundFlow.roundNo,e.roundsExisted=this.roundFlow.roundsExisted)}findPlayer(e){return this.entities.find(t=>t.id===e)}spawnHelper(e,t){if(this.entities.filter(s=>s.parent).length>=this.maxHelpers)return e.diagnostic("resource-limit",`Helper limit (${this.maxHelpers}) reached.`),null;const i=e.createHelper(t,{id:this.nextEntityId++});return i.destroyed?this.archiveDiagnostics(i.diagnostics):(this._entities.push(i),i.keyCtrl&&this.helperCommands.set(i,new ys(ea(i.root.character))),this.syncEnvironment()),i}spawnProjectile(e,t){if(this.projectiles.length>=this.maxProjectiles)return e.diagnostic("resource-limit",`Projectile limit (${this.maxProjectiles}) reached.`),null;const i=new as(e,t,{id:this.nextEntityId++});if(i.removed)return this.archiveDiagnostics(i.diagnostics),i;const s=Object.fromEntries(Object.entries(t).filter(([r])=>r.startsWith("afterimage.")).map(([r,a])=>[r.slice(11),a]));return Object.keys(s).length&&this.presentationEvents.push({...s,type:"afterimage",entity:i}),this.projectiles.push(i),i}retireEffects(e,{removeExplods:t=!1}={}){var i;if(!e._effectsDetached){if(e._effectsDetached=!0,t)e.explods=[],e.drawExplods=[];else if(e.drawExplods=[],e.explods.length){for(const s of e.explods)s.orphaned=!0;this.orphanEffectOwners.push(e)}for(const s of new Set([...this._entities,...this.orphanEffectOwners]))((i=s.bound)==null?void 0:i.target)===e&&(s.bound=null),Vu(s,e)}}destroyHelper(e,{recursive:t=!1,removeExplods:i=!1}={}){const s=[e];if(t)for(const r of this._entities){let a=r.parent,o=0;for(;a&&o++<256;){if(a===e){s.push(r);break}a=a.parent}}for(const r of s)r.destroyed=!0;for(const r of s)this.retireEffects(r,{removeExplods:i})}requestPause(e,t){const i=Math.max(0,Math.trunc(t.time));if(!Number.isFinite(i)||i>36e4){e.diagnostic("resource-limit","Pause time must be between 0 and 360000 ticks.");return}const s={...t,owner:e,time:i,remaining:i,elapsed:0,moved:new Map,movetime:Math.max(0,Math.min(i,t.movetime||0)),endcmdbuftime:Math.max(0,Math.min(i,t.endcmdbuftime||0))};this.pendingPauses.push(s),t.type==="superpause"&&(e.power=Math.max(0,Math.min(e.maxPower,e.power+(t.poweradd||0))),this.presentationEvents.push({...s,type:"superpause"}))}isFrozen(e){var s,r;const t=((s=this.superPause)==null?void 0:s.remaining)>0?this.superPause:((r=this.pause)==null?void 0:r.remaining)>0?this.pause:null;if(!t)return!1;const i=e===t.owner?t.movetime:t.type==="superpause"?e.superMoveTime||0:e.pauseMoveTime||0;return e.isProjectile?i<=0:(t.moved.get(e)||0)>=i}isSuperUnhittable(e){var t;return((t=this.superPause)==null?void 0:t.remaining)>0&&this.superPause.owner===e&&this.superPause.unhittable!==0}advancePause(){var i,s;const e=((i=this.superPause)==null?void 0:i.remaining)>0?this.superPause:((s=this.pause)==null?void 0:s.remaining)>0?this.pause:null,t=r=>{for(const[a,{before:o,applied:l}]of(r==null?void 0:r.defence)||[])a.defenceMultiplier===l&&(a.defenceMultiplier=o)};if(e){for(const r of[...this.entities,...this.projectiles])!this.isFrozen(r)&&!r._hitPausedThisTick&&e.moved.set(r,(e.moved.get(r)||0)+1);e.remaining--,e.elapsed++,e.remaining||t(e)}for(const r of this.pendingPauses){const a=r.type==="superpause"?"superPause":"pause";if(t(this[a]),this[a]=r,a==="superPause"&&r.remaining>0){const o=r.p2defmul>0?r.p2defmul:this.combatRules.superTargetDefence||1.5;r.defence=new Map;for(const l of r.owner.targets){const c=l.defenceMultiplier,f=c/o;r.defence.set(l,{before:c,applied:f}),l.defenceMultiplier=f}}}this.pendingPauses=[]}tick(e=new Set,t=new Set,{playerInput:i=null,opponentInput:s=null}={}){var x,I,R,A,F,N,P,B,H,k;if(this.orderedPhases){for(const C of this.pendingCombatEffects){const{defender:L,attacker:G,damage:$,minimum:ie,get:ne,give:X}=C;L.life=Math.max(ie,Math.min(L.maxLife,L.life-$)),G&&(G.power=Math.max(0,Math.min(G.maxPower,G.power+ne)),L.power=Math.max(0,Math.min(L.maxPower,L.power+X)))}this.pendingCombatEffects=[];for(const C of this._entities)C._projectedLife=void 0}this.events=[],this.presentationEvents=[],e=e instanceof Set?e:new Set(e),t=t instanceof Set?t:new Set(t);const r=((x=this.superPause)==null?void 0:x.remaining)>0||((I=this.pause)==null?void 0:I.remaining)>0&&this.pause.pausebg!==0,a=((R=this.superPause)==null?void 0:R.remaining)>0||((A=this.pause)==null?void 0:A.remaining)>0,o=((F=this.pause)==null?void 0:F.remaining)>0?this.pause:null,l=((N=this.superPause)==null?void 0:N.remaining)>0?this.superPause:null;this.syncEnvironment(),this.cpus.has(this.player)&&(e=this.cpus.get(this.player).tick(this.player,this.opponent,{paused:this.isFrozen(this.player)||this.player.hitPauseTime>0,enabled:!this.roundFlow||this.roundFlow.roundState===2})),this.cpus.has(this.opponent)&&(t=this.cpus.get(this.opponent).tick(this.opponent,this.player,{paused:this.isFrozen(this.opponent)||this.opponent.hitPauseTime>0,enabled:!this.roundFlow||this.roundFlow.roundState===2})),this.cpus.has(this.player)&&(i=this.cpus.get(this.player).raw),this.cpus.has(this.opponent)&&(s=this.cpus.get(this.opponent).raw);const c=new Set([...this.entities,...this.projectiles].filter(C=>C.hitPauseTime>0)),f=new Set,h=[];for(let C=0;C<this._entities.length;C++){const L=this._entities[C];if(L.destroyed)continue;h.push(L);let G=L.root===this.player?e:t,$=L.root===this.player?i:s;if(this.manageInputs&&L.keyCtrl){$=new Set($||[]);for(const X of L.pendingAssertedInputs)$.add(X==="F"?L.facing===1?"R":"L":X==="B"?L.facing===1?"L":"R":X);this.isFrozen(L)||L.pendingAssertedInputs.clear(),this.inputBuffers.has(L)||this.inputBuffers.set(L,new ys(this.inputProfiles.get(L.root.character))),G=this.inputBuffers.get(L).update($,L.facing)}else L.parent&&L.keyCtrl&&$!==null&&(G=this.helperCommands.get(L).update($,L.facing));(!L.keyCtrl||this.roundFlow&&this.roundFlow.roundState!==2)&&(G=new Set);const ie=L.teamSide===this.player.teamSide?this.opponent:this.player,ne=this.isFrozen(L);if(L._hitPausedThisTick=L.hitPauseTime>0,!ne&&!L._hitPausedThisTick&&(L._projectileContactShield=!1),ne){f.add(L);const X=((P=this.superPause)==null?void 0:P.remaining)>0?this.superPause:this.pause;if(X&&X.remaining<=X.endcmdbuftime){this.commandBuffers.has(L)||this.commandBuffers.set(L,new Set);for(const te of G)this.commandBuffers.get(L).add(te)}}else this.commandBuffers.has(L)&&(G=new Set([...G,...this.commandBuffers.get(L)]),this.commandBuffers.delete(L));this.activeActor=L;try{L.tick({commands:G,opponent:ie,paused:ne,input:L.keyCtrl?$:new Set})}finally{this.activeActor=null}}for(const C of this.projectiles){const L=this.isFrozen(C);L&&f.add(C),C._hitPausedThisTick=C.hitPauseTime>0,C.tick({paused:L})}if(this.stage){for(const C of this.entities)C.screenBound!==!1&&(C.pos.x=Math.max(this.leftBound,Math.min(this.rightBound,C.pos.x)));this.stage.updateCamera(this.entities),this.syncEnvironment(),this.stage.tick({paused:r})}this.orderedPhases&&this.advanceCornerPush(f),this.constrainPositions()&&this.stage&&(this.stage.updateCamera(this.entities),this.syncEnvironment(),this.constrainPositions({push:!1}));const d=this.entities;for(const C of d)if(C.moveType!=="H"&&C.stateType!=="L")for(const L of this.juggles.values())L.delete(C.id);const m=this.projectiles.filter(C=>!C.removed&&!C.removing),_=m.map(C=>hn(C,"clsn2"));for(let C=0;C<m.length;C++){const L=m[C];if(L.removing||!_[C].length)continue;const G=[];for(let ie=C+1;ie<m.length;ie++){const ne=m[ie];L.teamSide===ne.teamSide||ne.removing||f.has(L)&&f.has(ne)||!Fs(_[C],_[ie],this.orderedPhases)||G.push(ne)}const $=ie=>(ie.pos.x-L.pos.x)**2+(ie.pos.y-L.pos.y)**2;G.sort((ie,ne)=>$(ie)-$(ne)||ie.id-ne.id);for(const ie of G){if(L.removing)break;ie.removing||(L.clash(ie),ie.clash(L))}}const p=this.orderedPhases?this.projectiles.filter(C=>!C.removed||C.drawVisible):m,v=[...d,...p];for(const C of d)C.inGuardDistance=Hc(C,v);const S=[],E=new Set;for(const C of d)if(!(!C.reversalDef||f.has(C)||c.has(C)||this.roundFlow&&this.roundFlow.roundState!==2))for(const L of d){const G=C.reversalDef;if(!G)break;const $=L.hitDef;if(!$||L===C||L.teamSide===C.teamSide||c.has(L)||E.has(L)||!C.attributeMatches(G["reversal.attr"],$.attr)||((B=this.usedHits.get(C))==null?void 0:B.get(L.id))===G.serial)continue;const ie=Fs(hn(C),hn(L),this.orderedPhases);if(!ie)continue;const ne=L.receiveHit(G,C);ne.rejected||(this.applyCornerPush(C,L,ne.cornerPush,G.coordinateScale),L.moveContact=L.moveHit=L.moveGuarded=0,L.moveReversed=1,L.hitDef=null,E.add(L),this.usedHits.has(C)||this.usedHits.set(C,new Map),this.usedHits.get(C).set(L.id,G.serial),this.events.push({type:"reversal",attacker:C,defender:L,hitDef:G,damage:ne.damage,guarded:!1,x:(ie[0]+ie[2])/2,y:(ie[1]+ie[3])/2,tick:this.ticks}))}const T=d.length>2?new Map:null;for(const C of[...d,...m]){if(this.winner||this.roundFlow&&this.roundFlow.roundState!==2||C.destroyed||f.has(C)||E.has(C)||c.has(C)||C.life<=0||C.moveType!=="A")continue;const L=C.hitDef;if(!L||!/^[SCA]\s*,\s*[NSH][ATP]$/i.test(String(L.attr??"").trim()))continue;const G=Ba(L.hitFlag??L.hitflag??"MAF");if(!/[HLAMFD]/.test(G)||G.includes("+")&&G.includes("-"))continue;const $=Ba(L.affectteam??"E"),ie=L.serial??L,ne=this.usedHits.get(C);let X;for(const te of[...d].sort((ge,xe)=>Math.abs(ge.pos.x-C.pos.x)-Math.abs(xe.pos.x-C.pos.x))){if(C===te||C.isProjectile&&C.owner===te||te.life<=0||c.has(te))continue;const ge=C.teamSide===te.teamSide;if($==="E"&&ge||$==="F"&&!ge||!Ef(G,te)||(C instanceof as?!C.canHit(te,this.ticks):(ne==null?void 0:ne.get(te.id))===ie))continue;if(X??(X=hn(C)),!X.length)break;let xe=T==null?void 0:T.get(te);xe||(xe=hn(te,"clsn2"),T==null||T.set(te,xe));const re=Fs(X,xe,this.orderedPhases);if(!re||typeof te.canBeHit=="function"&&!te.canBeHit(L,C)||String(L[te.stateType==="A"?"air.type":"ground.type"]??L["ground.type"]??"high").toLowerCase()!=="none"&&!this.canJuggle(C,te,L))continue;const Ie=this.manageInputs||te.parent?te.commands:te===this.player?e:t;S.push({attacker:C,defender:te,hit:L,activation:ie,overlap:re,wasFalling:te.stateType==="L"||te.stateType==="A"&&te.moveType==="H"&&!!((H=te.getHitVars)!=null&&H.fall),guarded:Tf(L,C,te,Ie)})}}const w=S.filter(C=>{const L=S.find(G=>G.attacker===C.defender&&G.defender===C.attacker);return!L||Af([C,L]).includes(C)}),y=new Set;for(const C of w){if(C.attacker instanceof as&&(C.defender._projectileContactShield||!C.attacker.canHit()))continue;let L;this.contactPhase=!0;try{L=C.defender.receiveHit(C.hit,C.attacker,{guarded:C.guarded})}finally{this.contactPhase=!1}L!=null&&L.rejected||(this.applyCornerPush(C.attacker,C.defender,L.cornerPush,C.hit.coordinateScale),!C.guarded&&!L.typeNone&&this.recordJuggle(C.attacker,C.defender,C.hit,{wasFalling:C.wasFalling}),this.usedHits.has(C.attacker)||this.usedHits.set(C.attacker,new Map),this.usedHits.get(C.attacker).set(C.defender.id,C.activation),C.attacker instanceof as&&(C.defender._projectileContactShield=!0,C.attacker.onContact({guarded:C.guarded,defer:!0}),y.add(C.attacker)),this.events.push({type:C.guarded?"guard":"hit",attacker:C.attacker,defender:C.defender,hitDef:C.hit,damage:(L==null?void 0:L.damage)??0,guarded:C.guarded,typeNone:!!L.typeNone,x:(C.overlap[0]+C.overlap[2])/2,y:(C.overlap[1]+C.overlap[3])/2,tick:this.ticks}))}for(const C of y)C.finishContacts();for(const C of this.projectiles)C.finishMovementAllowance({paused:f.has(C)});for(const C of this.entities)C.updateExplods({hitPaused:c.has(C),pause:o,superPause:l});for(const C of this._entities)C.destroyed&&!C._effectsDetached&&this.retireEffects(C);for(const C of this.orphanEffectOwners)C.updateExplods({pause:o,superPause:l});this.orphanEffectOwners=this.orphanEffectOwners.filter(C=>C.explods.length||C.drawExplods.length),this.drawProjectiles=this.projectiles.filter(C=>C.drawVisible),this.eventEntities=[...h,...this.projectiles],this.cleanupEntities(),this.advancePause(),this.ticks++;const g=C=>this.entities.some(L=>L.asserted.has(C));if(!this.roundFlow&&!g("noko")&&(this.player.life<=0||this.opponent.life<=0)&&(this.winner=this.player.life<=0&&this.opponent.life<=0?"draw":this.player.life<=0?"opponent":"player"),this.roundFlow){const C=this.roundFlow,L=[this.player,this.opponent],G=C.step({players:L,paused:a,intro:g("intro"),roundNotOver:g("roundnotover"),timerFreeze:g("timerfreeze"),noKO:L.map(()=>g("noko"))});this.syncEnvironment();for(const $ of G){if($.type==="fight")for(const ie of L)ie.stateNo===0&&(ie.ctrl=1);if($.type==="round-over"&&(this.winner=$.winner),$.type==="result")for(const ie of L){const ne=$.winner===(ie===this.player?"player":"opponent"),X=ne?180:$.reason==="time"?170:null;X!==null&&ie.program.states.has(X)&&ie.changeState(X,0,ie)}$.type==="next-round"&&this.reset({preserveMatch:!0}),this.presentationEvents.push({...$,type:"round",event:$.type})}C.matchOver&&C.roundWinner!=="draw"&&((k=this[C.roundWinner])==null||k.selectVictoryQuote())}return this.events}cleanupEntities(){var t;const e=this._entities.filter(i=>i.destroyed);for(const i of e)i._effectsDetached||this.retireEffects(i);for(const i of[...e,...this.projectiles.filter(s=>s.removed)]){this.archiveDiagnostics(i.diagnostics),this.usedHits.delete(i),this.cornerPushActors.delete(i),this.commandBuffers.delete(i),this.inputBuffers.delete(i),this.helperCommands.delete(i),this.juggles.delete(i);for(const s of this.juggles.values())s.delete(i.id)}this._entities=this._entities.filter(i=>!i.destroyed),this.projectiles=this.projectiles.filter(i=>!i.removed);for(const i of this._entities){i.helpers=i.helpers.filter(s=>!s.destroyed),i.targets=i.targets.filter(s=>!s.destroyed&&(!this.orderedPhases||s.moveType==="H"));for(const s of i.targetHitIds.keys())i.targets.some(r=>r.id===s)||i.targetHitIds.delete(s);(t=i.bound)!=null&&t.target.destroyed&&(i.bound=null)}this.renderEntities=[...this._entities,...this.orphanEffectOwners].sort((i,s)=>i.id-s.id)}archiveDiagnostics(e){for(const t of e){const i=JSON.stringify(t);this.archivedDiagnosticKeys.has(i)||(this.archivedDiagnosticKeys.add(i),this.archivedDiagnostics.push(t))}}canJuggle(e,t,i){var c,f,h;if((c=(e.isProjectile?e.creator:e).asserted)!=null&&c.has("nojugglecheck")||!(t.stateType==="L"||t.stateType==="A"&&t.moveType==="H"&&((f=t.getHitVars)==null?void 0:f.fall)))return!0;const r=e.isProjectile?e.owner:e,a=(h=this.juggles.get(r))==null?void 0:h.get(t.id),o=(a==null?void 0:a.remaining)??r.constant("data.airjuggle"),l=e.isProjectile?i["air.juggle"]||0:(a==null?void 0:a.group)===i.juggleGroup?0:i.juggleCost||0;return o>=l}recordJuggle(e,t,i,{wasFalling:s=!1}={}){var f,h;if(!s&&!((f=t.getHitVars)!=null&&f.fall)&&t.stateType!=="L")return;const r=e.isProjectile?e.owner:e;this.juggles.has(r)||this.juggles.set(r,new Map);const a=this.juggles.get(r),o=a.get(t.id),l=(h=(e.isProjectile?e.creator:e).asserted)==null?void 0:h.has("nojugglecheck"),c=l?0:e.isProjectile?i["air.juggle"]||0:(o==null?void 0:o.group)===i.juggleGroup?0:i.juggleCost||0;a.set(t.id,{remaining:Math.max(0,((o==null?void 0:o.remaining)??r.constant("data.airjuggle"))-c),group:i.juggleGroup})}bodyWidth(e,t,i=!1){return dr(e,t,{edge:i})}horizontalLimits(e){var a,o;const t=l=>{var c,f;return xn((f=(c=e.width)==null?void 0:c.edge)==null?void 0:f[e.facing===l?0:1])*e.coordinateScale},i=this.view;let s=this.orderedPhases?Math.max(this.leftBound,i.left+(((a=this.stage)==null?void 0:a.definition.screenLeft)||0)+t(-1)):this.stage?Math.max(this.leftBound,i.left+Math.max(this.stage.definition.screenLeft,this.bodyWidth(e,-1,!0))):this.leftBound+this.bodyWidth(e,-1,!0),r=this.orderedPhases?Math.min(this.rightBound,i.right-(((o=this.stage)==null?void 0:o.definition.screenRight)||0)-t(1)):this.stage?Math.min(this.rightBound,i.right-Math.max(this.stage.definition.screenRight,this.bodyWidth(e,1,!0))):this.rightBound-this.bodyWidth(e,1,!0);return s>r&&(s=r=(this.leftBound+this.rightBound)/2),{min:s,max:r}}applyCornerPush(e,t,i=0,s=e.coordinateScale){if(e instanceof as)return;if(this.orderedPhases){const l=t.pos.x===e.pos.x?e.facing:Math.sign(t.pos.x-e.pos.x);e.cornerPush=Math.fround(i*s*l),e.cornerPushTarget=e.cornerPush?t:null,e.cornerPushSide=l,e.cornerPush?this.cornerPushActors.add(e):this.cornerPushActors.delete(e);return}if(!i||t.screenBound===!1)return;const{min:r,max:a}=this.horizontalLimits(t),o=t.pos.x===e.pos.x?e.facing:Math.sign(t.pos.x-e.pos.x);(o>0?t.pos.x<a-.01:t.pos.x>r+.01)||(e.cornerPush=i*s*o)}advanceCornerPush(e){for(const t of this.cornerPushActors){if(!t.cornerPush||t.destroyed){this.cornerPushActors.delete(t),t.cornerPushTarget=null;continue}if(e.has(t)||t._hitPausedThisTick)continue;const i=t.cornerPushTarget;if(i&&!i.destroyed&&i.screenBound!==!1){const{min:s,max:r}=this.horizontalLimits(i);(t.cornerPushSide>0?i.pos.x>=r:i.pos.x<=s)&&(t.pos.x=Math.fround(t.pos.x+t.cornerPush))}t.cornerPush=Math.fround(t.cornerPush*Math.fround(.7)),Math.abs(t.cornerPush)<t.coordinateScale&&(t.cornerPush=0),t.cornerPush||(t.cornerPushTarget=null,this.cornerPushActors.delete(t))}}constrainPositions({push:e=!0}={}){const t=this.entities,i=new Map(t.map(o=>[o,this.horizontalLimits(o)])),s=o=>{if(o.screenBound!==!1){const{min:l,max:c}=i.get(o);o.pos.x=Math.max(l,Math.min(c,o.pos.x))}};if(t.forEach(s),!this.pushboxes||!e)return!1;let r=!1;const a=t.filter(o=>o.playerPush!==!1).sort((o,l)=>o.id-l.id);for(let o=0;o<a.length;o++)for(let l=o+1;l<a.length;l++){const c=a[o],f=a[l];if(c.teamSide===f.teamSide)continue;const h=c.pos.y-Yn(c,"size.height",60)*Ut(c),u=f.pos.y-Yn(f,"size.height",60)*Ut(f);if(h>=f.pos.y||u>=c.pos.y||!Fs(hn(c,"clsn2"),hn(f,"clsn2")))continue;const[d,m]=c.pos.x<=f.pos.x?[c,f]:[f,c],_=d.pos.x+this.bodyWidth(d,1)-m.pos.x+this.bodyWidth(m,-1);if(_<=0)continue;const p=d.screenBound===!1?1/0:Math.max(0,d.pos.x-i.get(d).min),v=m.screenBound===!1?1/0:Math.max(0,i.get(m).max-m.pos.x),S=Math.min(_/2,p),E=Math.min(_-S,v);d.pos.x-=Math.min(_-E,p),m.pos.x+=E,this.orderedPhases&&(d.pos.x=Math.fround(d.pos.x),m.pos.x=Math.fround(m.pos.x)),s(d),s(m),r=!0}return r}}const Qe=(n,e,t="")=>`
[Statedef ${n}]
${e}
${t}
`,Me=(n,e,t="1")=>`
[State 0, ${n}]
type = ${n}
trigger1 = ${t}
${e}
`,et=(n,e,t=1)=>Me("ChangeState",`value = ${n}
ctrl = ${t}`,e),Ye=(n,e="time = 0")=>Me("ChangeAnim",`value = ${n}`,`(${e}) && selfanimexist(${n})`);function th({orderedPhases:n=!1}={}){return[Qe(0,`type = S
movetype = I
physics = S
ctrl = 1`,Ye(0,"anim != 0")+Me("VelSet","y = 0","time = 0")+(n?Me("VelSet","x=0","time>=4 || abs(vel x)<const(movement.stand.friction.threshold)"):"")),Qe(10,`type = C
movetype = I
physics = C`+(n?`
velset=0,0`:""),Ye(10)+et(11,"animtime = 0 || !selfanimexist(10)")),Qe(11,`type = C
movetype = I
physics = C
ctrl = 1`,Ye(11)),Qe(12,`type = S
movetype = I
physics = S`,Ye(12)+et(0,"animtime = 0 || !selfanimexist(12)")),Qe(20,`type = S
movetype = I
physics = S
ctrl = 1`,Me("VelSet","x = const(velocity.walk.fwd.x)",'command = "holdfwd"')+Me("VelSet","x = const(velocity.walk.back.x)",'command = "holdback"')+Ye(20,"vel x > 0 && anim != 20")+Ye(21,"vel x < 0 && anim != 21")),Qe(40,`type = S
movetype = I
physics = S
ctrl = 0`,Ye(40)+Me("VelSet",`x = ifelse(command = "holdfwd", const(velocity.jump.fwd.x), ifelse(command = "holdback", const(velocity.jump.back.x), const(velocity.jump.neu.x)))
y = const(velocity.jump.y)`,"animtime = 0 || !selfanimexist(40)")+et(50,"animtime = 0 || !selfanimexist(40)")),Qe(45,`type = A
movetype = I
physics = A
ctrl = 1`,Me("VelSet",`x = ifelse(command = "holdfwd", const(velocity.airjump.fwd.x), ifelse(command = "holdback", const(velocity.airjump.back.x), const(velocity.airjump.neu.x)))
y = const(velocity.airjump.y)`,"time = 0")+et(50,"time > 0")),Qe(50,`type = A
movetype = I
physics = A
ctrl = 1`,Ye("ifelse(vel x = 0, 41, ifelse(vel x > 0, 42, 43))")+et(52,"pos y >= 0 && vel y > 0",0)),Qe(51,`type = A
movetype = I
physics = A`),Qe(52,`type = S
movetype = I
physics = S
ctrl = 0`+(n?`
velset=0,0
anim=47`:""),Ye(47)+Me("PosSet","y = 0","time = 0")+Me("VelSet","y = 0","time = 0")+(n?Me("CtrlSet","value=1","time>=3"):"")+et(0,"time >= 3 && (animtime = 0 || !selfanimexist(47))")),Qe(100,`type = S
movetype = I
physics = `+(n?"S":"N")+`
ctrl = 1`,Ye(100)+Me("VelSet","x = const(velocity.run.fwd.x)")+Me("AssertSpecial",`flag = nowalk
flag2 = noautoturn`)+et(0,'command != "holdfwd"')),Qe(105,`type = A
movetype = I
physics = A
ctrl = 0`,Ye(105)+(n?Me("CtrlSet","value=1","time>=2"):"")+Me("VelSet",`x = const(velocity.run.back.x)
y = const(velocity.run.back.y)`,"time = 0")+et(n?106:52,"pos y >= 0 && vel y > 0",0)),...n?[Qe(106,`type=S
movetype=I
physics=S
ctrl=0`,Ye(47)+Me("PosSet","y=0")+Me("VelSet","y=0")+Me("VelSet","x=0","abs(vel x)<const(movement.stand.friction.threshold)")+et(0,"time>=7"))]:[],...n?[Qe(120,`type=U
movetype=I
physics=U
ctrl=1`,Ye("ifelse(statetype=A,122,ifelse(statetype=C,121,120))")+Me("VelSet",`x=0
y=0`,"statetype!=A")+Me("ChangeState",`value=ifelse(statetype=A,50,ifelse(statetype=C,11,0))
ctrl=1`,'command!="holdback"')+Me("ChangeState",`value=ifelse(statetype=A,132,ifelse(statetype=C,131,130))
ctrl=1`,"animtime=0 || !selfanimexist(ifelse(statetype=A,122,ifelse(statetype=C,121,120)))")),Qe(140,`type=U
movetype=I
physics=U
ctrl=1`,Ye("ifelse(statetype=A,142,ifelse(statetype=C,141,140))")+Me("ChangeState",`value=ifelse(statetype=A,50,ifelse(statetype=C,11,0))
ctrl=1`,'animtime=0 || command!="holdback"'))]:[],...[[120,"S",130],[130,"S",130],[131,"C",131],[132,"A",132],[140,"S",130]].filter(([e])=>!n||e!==120&&e!==140).map(([e,t,i])=>Qe(e,`type = ${t}
movetype = I
physics = ${t}
ctrl = 1${t==="A"?"":`
velset = 0,0`}`,Ye(i)+(n?et(140,"!inguarddist"):"")+et(t==="A"?50:t==="C"?11:0,'command != "holdback"'))),...[[150,"S",150,151],[152,"C",151,153],[154,"A",152,155]].map(([e,t,i,s])=>Qe(e,`type=${t}
movetype=H
physics=N
ctrl=0
velset=0,0`,Ye(i)+et(s,"hitshakeover",0))),...[[151,"S",150],[153,"C",151],[155,"A",152]].map(([e,t,i])=>Qe(e,`type=${t}
movetype=H
physics=${t==="A"?"N":t}
ctrl=0`,Ye(i)+Me("HitVelSet",`x=1
y=1`,"time=0")+Me("CtrlSet","value=1","time>=gethitvar(ctrltime)")+(t==="A"?Me("Gravity","")+et(52,"pos y>=0 && vel y>0",0)+et(132,"time>=gethitvar(ctrltime)"):Me("VelSet","x=0","time>=gethitvar(slidetime)||hitover")+Me("StateTypeSet",`statetype=C
physics=C`,'command="holddown"')+Me("StateTypeSet",`statetype=S
physics=S`,'command!="holddown"')+Me("ChangeState",`value=${n?"ifelse(inguarddist,ifelse(statetype=C,131,130),140)":"ifelse(statetype=C,131,130)"}
ctrl=1`,"hitover")))),...[[5e3,"S","ifelse(gethitvar(groundtype)=2,5010,5000)"],[5010,"C","5020"],[5020,"A","5030"]].map(([e,t,i])=>{const s="5030+gethitvar(animtype)",r="5050+gethitvar(animtype)-3",a=n?`ifelse(gethitvar(animtype)>=3,ifelse(gethitvar(animtype)=3,5030,ifelse(selfanimexist(${r}),${r},5030)),ifelse((gethitvar(fall)||gethitvar(yvel)!=0)&&selfanimexist(${s}),${s},${i}+gethitvar(animtype)))`:`ifelse(gethitvar(animtype)>=3,5030,${i}+gethitvar(animtype))`;return Qe(e,`type=${t}
movetype=H
physics=N
ctrl=0
velset=0,0`,Me("ChangeAnim",`value=${a}`,`time=0 && selfanimexist(${a})`)+(n?Me("StateTypeSet","statetype=A","gethitvar(yvel)!=0 || pos y!=0"):"")+Me("ChangeState",`value=${t==="A"?"5030":`ifelse(gethitvar(fall)||gethitvar(yvel)!=0||pos y!=0,5030,${e+1})`}
ctrl=0`,"hitshakeover"))}),...[[5001,"S"],[5011,"C"]].map(([e,t])=>Qe(e,`type=${t}
movetype=H
physics=${t}
ctrl=0`,(n?Ye("anim"):"")+Me("HitVelSet","x=1","time=0")+Me("VelMul","x=.6","time>=gethitvar(slidetime)")+(n?Ye("anim+5","animtime=0 && (anim=[5000,5002] || anim=[5010,5012] || anim=[5020,5022])"):"")+Me("VelSet","x=0","hitover")+Me("DefenceMulSet","value=1","hitover")+et(0,"hitover"))),...[5030,5035].map(e=>{const t=Me("VelAdd","y=gethitvar(yaccel)",e===5030?"time>0":n?"time>0 || prevstateno!=5030":"1"),i=Me("ChangeState",`value=ifelse(gethitvar(fall),5050,5040)
ctrl=0`,"hitover || (vel y>0 && pos y>=0)")+(e===5030?n?Me("ChangeState",`value=ifelse(anim=[5050,5059],5050,5035)
ctrl=0`,"animtime=0"):et(5035,"animtime=0",0):Me("ChangeState",`value=ifelse(gethitvar(fall),5050,5040)
ctrl=0`,"animtime=0 || !selfanimexist(5035)"));return Qe(e,`type=A
movetype=H
physics=N
ctrl=0`,(e===5030?(n?Ye("ifelse(gethitvar(fall),anim,5030)"):"")+Me("HitVelSet",`x=1
y=1`,"time=0"):Ye(5035))+t+i)}),Qe(5040,`type=A
movetype=H
physics=N
ctrl=1`,Ye(5040)+Me("VelAdd","y=gethitvar(yaccel)")+et(5050,"!alive",0)+et(52,"pos y>=0 && vel y>0",0)+et(50,"animtime=0 || !selfanimexist(5040)")),Qe(5050,`type=A
movetype=H
physics=N
ctrl=0`,(n?Ye("5050+ifelse(gethitvar(animtype)>=3,gethitvar(animtype)-3,0)","(time=0 && anim=5030 && animtime=-1) || (animtime=0 && (anim<5050 || anim>5069))")+Ye("anim+10","vel y>Const240p(-2) && anim=[5051,5052]"):Ye(5050))+Me("SelfState","value=5210",'alive && CanRecover && command="recovery"')+et(5100,n?"vel y>0 && pos y>=ifelse(anim=5050 || anim=5035,const(movement.air.gethit.groundlevel),0)":"pos y>=0 && vel y>0",0)+Me("VelAdd","y=gethitvar(yaccel)",n?"time>0 || (prevstateno!=5030 && prevstateno!=5035)":"1")),Qe(5070,`type=A
movetype=H
physics=N
ctrl=0
velset=0,0`,Ye(5070)+et(5071,"hitshakeover",0)),Qe(5071,`type=A
movetype=H
physics=N
ctrl=0`,(n?Ye("anim"):"")+Me("HitVelSet",`x=1
y=1`,"time=0")+Me("VelAdd","y=gethitvar(yaccel)",n?"time>0":"1")+et(5110,"vel y>0 && pos y>=const(movement.air.gethit.trip.groundlevel)",0)),Qe(5080,`type=L
movetype=H
physics=N
ctrl=0
velset=0,0`,Ye(5080)+et(5030,"hitshakeover && gethitvar(yvel)!=0",0)+et(5081,"hitshakeover && gethitvar(yvel)=0",0)),Qe(5081,`type=L
movetype=H
physics=C
ctrl=0`,Me("HitVelSet","x=1","time=0")+Me("VelSet","x=0","hitover")+et(5110,"hitover",0)),Qe(5100,`type = L
movetype = H
physics = N
ctrl = 0`+(n?"":`
velset = 0,0`),Me("PosSet","y = 0")+(n?Me("PosFreeze","value=1")+Me("VelMul","x=.75","time=0")+Me("VelSet","y=0","time=0"):"")+Me("HitFallDamage","",n?"time=3":"time=0")+Me("FallEnvShake","","time=0")+Ye(n?"ifelse(selfanimexist(5100+ifelse(gethitvar(animtype)>=3,gethitvar(animtype)-3,0)),5100+ifelse(gethitvar(animtype)>=3,gethitvar(animtype)-3,0),5100)":5100)+et(5110,"time>=1 && gethitvar(fall.yvel)=0",0)+et(5101,"time>=1 && (animtime=0 || time>=12 || !selfanimexist(5100))",0)),Qe(5101,`type=L
movetype=H
physics=N
ctrl=0`,Ye(5160)+Me("HitFallVel","","time=0")+Me("PosSet","y=const(movement.down.bounce.offset.y)","time=0")+Me("PosAdd","x=const(movement.down.bounce.offset.x)","time=0")+(n?Me("PosFreeze","value=1","time=0"):"")+Me("VelAdd","y=const(movement.down.bounce.yaccel)",n?"time>0":"1")+et(5110,"time>0 && vel y>0 && pos y>=const(movement.down.bounce.groundlevel)",0)),Qe(5110,`type = L
movetype = H
physics = N
ctrl = 0`,Me("PosSet","y=0","time=0")+Me("VelSet","y=0","time=0")+(n?Ye("ifelse(selfanimexist(5170),5170,5110)")+Ye(5110,"animtime=0 && anim!=5110")+Me("VelMul","x=const(movement.stand.friction)")+Me("VelSet","x=0","abs(vel x)<const(movement.down.friction.threshold)"):Ye(5110))+et(5150,"!alive",0)+et(5120,"time>=1 && gethitvar(recovertime)<=0",0)),Qe(5120,(n?`type=L
physics=N`:`type=S
physics=S`)+`
movetype=I
ctrl=0`,Ye(5120)+Me("SelfState",`value=0
ctrl=1`,"animtime = 0 || !selfanimexist(5120)")),Qe(5150,`type = L
movetype = H
physics = N
ctrl = 0
velset = 0,0`,Ye(5110)),Qe(5210,`type=A
movetype=I
physics=N
ctrl=0`,Ye(5210)+Me("PosFreeze","value=1","time<4")+Me("VelMul",n?`x=const(velocity.air.gethit.airrecover.mul.x)
y=const(velocity.air.gethit.airrecover.mul.y)`:`x=.5
y=.2`,"time=4")+Me("VelAdd",n?`x=const(velocity.air.gethit.airrecover.add.x)
y=const(velocity.air.gethit.airrecover.add.y)`:"y=Const240p(-4.5)","time=4")+Me("NotHitBy","value=SCA",n?"time<20":"time<4")+(n?Me("VelAdd","y=const(movement.air.gethit.airrecover.yaccel)","time>=4")+Me("CtrlSet","value=1","time>=20")+et(52,"pos y>=0 && vel y>0",0):et(50,"time>=4")))].join(`
`)}th();function ka(n=""){if(n=String(n).toUpperCase(),n==="S"||n==="SUB")return{mode:"subtract",source:1,destination:1};if(n==="A"||n==="ADD")return{mode:"add",source:1,destination:1};if(n==="A1"||n==="ADD1")return{mode:"add",source:1,destination:.5};const e=/^AS([\d.]+)D([\d.]+)$/.exec(n);return e?{mode:"add",source:Math.max(0,Math.min(256,+e[1]))/256,destination:Math.max(0,Math.min(256,+e[2]))/256}:{mode:"normal",source:1,destination:0}}function Cf(n=0,e=0,t=0){const i=f=>{if(typeof f!="number"||!Number.isFinite(f))throw Error("Sprite angles must be finite numbers.");const h=f%360*Math.PI/180,u=d=>Math.abs(d)<1e-12?0:Math.abs(1-Math.abs(d))<1e-12?Math.sign(d):d;return[u(Math.cos(h)),u(Math.sin(h))]},[s,r]=i(n),[a,o]=i(e),[l,c]=i(t);return{a:l*s,b:o*c*s-a*r,c:l*r,d:a*s+o*c*r}}function Ha(n,e,t=0){var l;const i=n==null?void 0:n.frames[e];if(!i)return null;if(!((l=i.interpolate)!=null&&l.length)||i.ticks<=0)return i;const s=n.frames[e+1]||n.frames[n.loopStart||0];if(!s)return i;const r=Math.max(0,Math.min(1,t/i.ticks)),a={...i},o=(c,f)=>c+(f-c)*r;for(const c of i.interpolate)if(c==="offset"&&(a.x=o(i.x,s.x),a.y=o(i.y,s.y)),c==="scale"&&(a.scaleX=o(i.scaleX??1,s.scaleX??1),a.scaleY=o(i.scaleY??1,s.scaleY??1)),c==="angle"&&(a.angle=o(i.angle||0,s.angle||0)),c==="blend"){const f=ka(i.blend),h=ka(s.blend);f.mode==="add"&&h.mode==="add"&&(a.blend=`AS${o(f.source,h.source)*256}D${o(f.destination,h.destination)*256}`)}return a}function ih(n){var r;const e=Ha(n.collisionAnimation??n.animation??((r=n.animations)==null?void 0:r.get(n.anim)),n.collisionFrameIndex??n.frameIndex,n.collisionFrameTime??n.frameTime)??n.collisionFrame??n.currentFrame;if(!e)return null;const t=Zc(n);if(t===n)return e;const i=(a,o)=>{var l,c;return((c=(l=a.program)==null?void 0:l.constants)==null?void 0:c.get(o))??1},s=(a,o)=>{const l=Ut(n)*i(n,o);return l?(e[a]||0)*Ut(t)*i(t,o)/l:0};return{...e,x:s("x","size.xscale"),y:s("y","size.yscale")}}function Pl(n,e,t,i,s,r,a=256){if(!i)return[0];if(!Number.isFinite(t)||t<=0||!Number.isFinite(e)||e<=0)return[];let o=i===1?Math.floor((s-n-e)/t):0,l=i===1?Math.ceil((r-n)/t):Math.max(0,Math.trunc(i)-1);return Math.max(0,l-o+1)>a&&(l=o+a-1),Array.from({length:Math.max(0,l-o+1)},(f,h)=>o+h)}function Il(n,e,t=0){return n.animated?n.spacing[t]:e+n.spacing[t]}const Pf=(n,e)=>Array.isArray(n)?n.slice(0,3).map((t,i)=>Number(t??e[i])):[...e],If=(n,e=0,t=255)=>Math.max(e,Math.min(t,n)),Cn=(n,e={})=>({...e,...n,age:0,remaining:n.time??e.time??1}),Jt=n=>n&&(n.remaining<0||n.remaining>0);function ta(n){n&&(n.age++,n.remaining>0&&n.remaining--)}class Lf{constructor(){this.palettes=new Map,this.afterimages=new Map,this.all=null,this.background=null,this.shake=null,this.environment=null,this.diagnostics=[]}advance({paused:e=()=>!1,backgroundPaused:t=!1}={}){for(const[i,s]of this.palettes)e(i)||ta(s),Jt(s)||this.palettes.delete(i);for(const[i,s]of this.afterimages)e(i)||ta(s),Jt(s)||this.afterimages.delete(i);if(!t)for(const i of[this.all,this.background,this.shake,this.environment])ta(i)}consume(e,{entity:t}={}){for(const i of e||[]){const s=String(i.type).toLowerCase();if(s==="palfx"&&t){const r=hr(t),a=Cn(ur(i));Jt(a)?this.palettes.set(r,a):this.palettes.delete(r)}else if(s==="allpalfx")this.all=Cn(ur(i));else if(s==="bgpalfx")this.background=Cn(ur(i));else if(s==="envshake"){const r=i.coordinateScale??(t==null?void 0:t.coordinateScale)??1;this.shake=Cn(i,{time:0,freq:60,ampl:-4/r,phase:i.freq>=90?90:0,coordinateScale:r})}else if(s==="envcolor")this.environment=Cn(i,{value:[255,255,255],under:0});else if(s==="palettesnapshot"&&i.target)i.target.paletteSnapshot={layers:[],key:"[]"};else if(s==="afterimage"&&t){const r=Cn(i,{time:1,length:20,timegap:1,framegap:4,palcolor:256,palbright:[30,30,30],palcontrast:[120,120,220],palpostbright:[0,0,0],paladd:[10,10,25],palmul:[.65,.65,.75],trans:"none"});r.length=If(Math.trunc(r.length),0,60),r.timegap=Math.max(1,Math.trunc(r.timegap)),r.framegap=Math.max(1,Math.trunc(r.framegap)),r.frames=[],Jt(r)&&r.length?this.afterimages.set(t,r):this.afterimages.delete(t)}else if(s==="afterimagetime"&&this.afterimages.has(t)){const r=this.afterimages.get(t);r.remaining=i.time??i.value??0,Jt(r)||this.afterimages.delete(t)}}}capture(e,{paused:t=()=>!1}={}){for(const i of e){const s=this.afterimages.get(i);if(!Jt(s)||t(i)||s.age%s.timegap!==0||s.lastAge===s.age)continue;const r=ih(i);r&&(s.lastAge=s.age,s.frames.unshift({entity:i,frame:{...r},pos:{...i.pos},facing:i.facing,coordinateScale:Ut(i),character:i.character,drawScale:{...i.drawScale},drawOffset:{...i.drawOffset},angle:i.angleDraw?i.angle:0,sizeX:i.constant("size.xscale"),sizeY:i.constant("size.yscale"),paletteRemaps:new Map(i.paletteRemaps)}),s.frames.length=Math.min(s.frames.length,s.length))}}paletteFor(e,{ownpal:t=(e==null?void 0:e.ownPal)??(e==null?void 0:e.ownpal),ignoreLocal:i=!1,includeAll:s=!0}={}){const r=i?null:t?e:hr(e),a=this.palettes.get(r);let o=Jt(a)?[a]:[];return o=[...o,...s&&Jt(this.all)?[this.all]:[]].map(l=>Object.fromEntries(Object.entries(l).map(([c,f])=>[c,Array.isArray(f)?[...f]:f]))),{layers:o,key:JSON.stringify(o.map(({add:l,mul:c,sinadd:f,color:h,invertall:u,age:d})=>({add:l,mul:c,sinadd:f,color:h,invertall:u,age:f?d:0})))}}get backgroundPalette(){const e=[this.background,this.all].filter(Jt);return{layers:e,key:JSON.stringify(e)}}get cameraOffset(){if(!Jt(this.shake))return{x:0,y:0};const e=this.shake;return{x:0,y:-Number(e.ampl)*e.coordinateScale*Math.sin((Number(e.phase)+e.age*Number(e.freq))*Math.PI/180)}}get environmentColor(){return Jt(this.environment)?this.environment:null}trailsFor(e){const t=this.afterimages.get(e);if(!Jt(t))return[];const i=[];for(let s=0;s<t.frames.length;s+=t.framegap){const r=[{color:t.palcolor,invertall:t.palinvertall,add:t.palbright,mul:t.palcontrast,postadd:t.palpostbright}];for(let a=0;a<s;a++)r.push({add:t.paladd,mul:Pf(t.palmul,[1,1,1]).map(o=>o*256)});Jt(this.all)&&r.push(this.all),i.push({...t.frames[s],palette:{layers:r,key:JSON.stringify(r)},trans:t.trans})}return i.reverse()}cleanup(e,{paletteOwners:t=e}={}){const i=new Set(e),s=new Set;for(const r of t){const a=hr(r);a&&s.add(a)}for(const r of this.palettes.keys())s.has(r)||this.palettes.delete(r);for(const r of this.afterimages.keys())i.has(r)||this.afterimages.delete(r)}}const ke=127,We=125,Vn=124,Df=new Set("time stateno prevstateno anim animtime ctrl life lifemax power powermax facing alive gametime hitpausetime hitshakeover hitover movecontact movehit moveguarded movereversed hitcount uniqhitcount numenemy numpartner numproj roundstate roundno matchno teamside teampower tickspersecond ailevel palno id win lose drawgame inguarddist canrecover roundsexisted hitfall ishometeam winko wintime winperfect loseko losetime loseperfect".split(" ")),Nf=new Set("pos x|pos y|vel x|vel y|p2dist x|p2dist y|p2bodydist x|p2bodydist y|parentdist x|parentdist y|rootdist x|rootdist y|screenpos x|screenpos y|hitvel x|hitvel y|camerapos x|camerapos y|camerazoom|gamewidth|gameheight|screenwidth|screenheight|leftedge|rightedge|topedge|bottomedge|frontedge|backedge|frontedgedist|backedgedist|frontedgebodydist|backedgebodydist".split("|")),Uf=new Set("var sysvar animelemtime animelemno animexist selfanimexist numprojid playeridexist projcanceltime projcontacttime projguardedtime projhittime numhelper numexplod numtarget ishelper".split(" ")),Ff=new Set(["fvar","sysfvar","const240p","const480p","const720p"]),Of=new Set("name authorname p1name p2name p3name p4name statetype movetype physics p2statetype p2movetype teammode".split(" ")),Bf=new Set("xveladd yveladd xoff yoff zoff xvel yvel yaccel fall.xvel fall.yvel fall.envshake.freq fall.envshake.phase".split(" ")),Ar=["sin","cos","tan","asin","acos","atan","exp","ln"],kf=new TextEncoder,xi=n=>{const e=[];do{const t=n&127;n>>>=7,e.push(t|(n?128:0))}while(n);return e},Hf=n=>{n|=0;const e=[];for(;;){const t=n&127;n>>=7;const i=n===0&&!(t&64)||n===-1&&!!(t&64);if(e.push(t|(i?0:128)),i)return e}},ia=n=>{const e=kf.encode(n);return[...xi(e.length),...e]},un=n=>[...xi(n.length),...n.flat()],os=(n,e)=>[n,...xi(e.length),...e],ri=n=>[65,...Hf(n)],za=n=>{const e=new Uint8Array(4);return new DataView(e.buffer).setFloat32(0,n,!0),[67,...e]},na=[68,0,0,0,0,0,0,0,0],Wn=n=>[16,...xi(n)],ai=n=>[32,...xi(n)],Pn=n=>[33,...xi(n)],fi=(n,e)=>n.type===e?n.code:[...n.code,n.type===ke?e===We?178:183:187],Os=n=>n.type===ke?[...n.code,69,69]:[...n.code,...za(0),92],ls=n=>[...n,...Wn(2)],ft=(n,e)=>({type:n,code:e});class Ji extends Error{}class cs extends Error{}class zf{constructor(e){this.trigger=e,this.locals=[]}local(e){return this.locals.push(e),this.locals.length-1}read(e,t=[]){const i=Nf.has(e)||Ff.has(e)?We:Df.has(e)||Uf.has(e)?ke:null;if(!i||t.length>2)throw new Ji;const s=[...ri(this.trigger(e)),...ri(t.length)];for(let r=0;r<2;r++)s.push(...t[r]?fi(this.node(t[r]),Vn):na);return s.push(...Wn(i===ke?0:1)),ft(i,s)}literal(e,t=ke){return ft(t,[...ri(this.trigger(e)),...ri(0),...na,...na,...Wn(t===ke?0:1)])}node(e){var t;if(e.kind==="number"){if(e.float&&!Number.isFinite(Math.fround(e.value)))throw new Ji;return ft(e.float?We:ke,e.float?za(e.value):ri(e.value))}if(e.kind==="name")return e.name==="pi"||e.name==="e"?ft(We,za(e.name==="pi"?Math.PI:Math.E)):this.read(e.name);if(e.kind==="unary"){const i=this.node(e.value);if(e.op==="+")return i;if(e.op==="!")return ft(ke,[...Os(i),69]);if(e.op==="-")return ft(i.type,i.type===ke?[...ri(0),...i.code,107]:[...i.code,140]);if(e.op==="~"&&i.type===ke)return ft(ke,[...i.code,...ri(-1),115]);throw new Ji}if(e.kind==="legacyanim")return this.binary(e.op,this.read("animelemtime",[e.element]),this.node(e.time));if(e.kind==="legacytime"){if(e.divisor.value<=0)throw new Ji;return this.binary(e.op,this.binary("%",this.read("time"),this.node(e.divisor)),this.node(e.remainder))}if(e.kind==="range"){const i=[this.node(e.left),this.node(e.low),this.node(e.high)],s=i.some(l=>l.type===We)?We:ke,r=i.map(()=>this.local(s)),a=[];i.forEach((l,c)=>a.push(...fi(l,s),...Pn(r[c])));const o=l=>ft(s,ai(r[l]));return a.push(...this.binary(e.includeLow?">=":">",o(0),o(1)).code,...this.binary(e.includeHigh?"<=":"<",o(0),o(2)).code,113),e.op==="!="&&a.push(69),ft(ke,a)}if(e.kind==="command"){const i=this.literal({name:"command",args:[e.command]});return e.op==="="?i:ft(ke,[...i.code,69])}if(e.kind==="legacyattribute"){const i=this.literal({name:"hitdefattr",args:e.attributes});return e.op==="="?i:ft(ke,[...i.code,69])}if(e.kind==="binary")return["=","!="].includes(e.op)&&e.left.kind==="name"&&Of.has(e.left.name)&&e.right.kind==="string"?this.literal({name:e.left.name,match:e.right.value,invert:e.op==="!="}):this.binary(e.op,this.node(e.left),this.node(e.right));if(e.kind==="call"){if(e.name==="cond"){const s=this.node(e.args[0]),r=this.node(e.args[1]),a=this.node(e.args[2]);if(r.type!==a.type)throw new Ji;return ft(r.type,[...Os(s),4,r.type,...r.code,5,...a.code,11])}if(["const","gethitvar"].includes(e.name)&&["name","string"].includes((t=e.args[0])==null?void 0:t.kind)){const s=e.args[0].name??e.args[0].value,r=e.name==="const"?/^(?:velocity\.|movement\.(?!airjump\.)|size\.[xy]scale$|data\.fall\.defence_mul$)/.test(s)?We:ke:Bf.has(s)?We:ke;return this.literal({name:e.name,args:[s]},r)}const i=e.args.map(s=>this.node(s));if(e.name==="abs"){const s=i[0];if(s.type===We)return ft(We,[...s.code,139]);const r=this.local(ke);return ft(ke,[...s.code,...Pn(r),...ai(r),...ri(0),72,4,ke,...ri(0),...ai(r),107,5,...ai(r),11])}if(e.name==="min"||e.name==="max"){if(i.some(a=>a.type===We))return ft(We,[...fi(i[0],We),...fi(i[1],We),e.name==="min"?150:151]);const s=this.local(ke),r=this.local(ke);return ft(ke,[...i[0].code,...Pn(s),...i[1].code,...Pn(r),...ai(s),...ai(r),e.name==="min"?72:74,4,ke,...ai(s),5,...ai(r),11])}return e.name==="ceil"||e.name==="floor"?ft(ke,[...fi(i[0],We),e.name==="ceil"?141:142,187,...Wn(3)]):e.name==="sqrt"?ft(We,ls([...fi(i[0],We),145])):Ar.includes(e.name)?ft(We,ls([...fi(i[0],We),...Wn(4+Ar.indexOf(e.name))])):e.name==="log"?ft(We,ls([...fi(i[0],We),...fi(i[1],We),...Wn(12)])):this.read(e.name,e.args)}throw new Ji}binary(e,t,i){if(["&&","||","^^"].includes(e))return ft(ke,[...Os(t),...Os(i),e==="&&"?113:e==="||"?114:115]);const s=t.type===We||i.type===We?We:ke,r=[...fi(t,s),...fi(i,s)],a={"=":[70,91],"!=":[71,92],"<":[72,93],">":[74,94],"<=":[76,95],">=":[78,96]};if(a[e])return ft(ke,[...r,a[e][+(s===We)]]);const o={"+":[106,146],"-":[107,147],"*":[108,148]};if(o[e])return r.push(o[e][+(s===We)]),ft(s,s===We?ls(r):r);if(e==="/"){if(s===We)return ft(We,ls([...r,149]));const l=this.local(ke),c=this.local(ke);return ft(ke,[...t.code,...Pn(l),...i.code,...Pn(c),...ai(l),...ri(-2147483648),70,...ai(c),...ri(-1),70,113,4,ke,...ri(-2147483648),5,...ai(l),...ai(c),109,11])}if(s===ke&&["%","&","|","^"].includes(e))return ft(ke,[...r,{"%":111,"&":113,"|":114,"^":115}[e]]);throw new Ji}}function Gf(n){const e=(a,o)=>[96,...un(a.map(l=>[l])),1,o],t=[e([ke,ke,Vn,Vn],ke),e([ke,ke,Vn,Vn],We),e([We],We),e([Vn],ke),e([We,We],We),e([],ke),e([],We)],i=[["readInt",0],["readFloat",1],["finite",2],["wrap",3],...Ar.map(a=>[a,2]),["log",4]].map(([a,o])=>[...ia("host"),...ia(a),0,...xi(o)]),s=n.map((a,o)=>[...ia("e"+o),0,...xi(i.length+o)]),r=n.map(a=>{const o=[];for(const c of a.locals){const f=o.at(-1);(f==null?void 0:f[1])===c?f[0]++:o.push([1,c])}const l=[...un(o.map(([c,f])=>[...xi(c),f])),...a.code,11];return[...xi(l.length),...l]});return new Uint8Array([0,97,115,109,1,0,0,0,...os(1,un(t)),...os(2,un(i)),...os(3,un(n.map(a=>xi(a.type===ke?5:6)))),...os(7,un(s)),...os(10,un(r))])}class Vf{constructor(e=[],{maxFunctions:t=4096,maxBytes:i=2*1024*1024}={}){if(!Number.isInteger(t)||t<0||t>16384||!Number.isInteger(i)||i<0||i>16*1024*1024)throw RangeError("Invalid numeric compilation budget.");this.context=null,this.entries=new Map,this.triggers=[],this.counts={wasm:0,interpreted:0,deoptimized:0,compiled:0,bytes:0};const s=new Map,r=[],a=[],o=u=>{const d=JSON.stringify(u);return s.has(d)||(s.set(d,this.triggers.length),this.triggers.push(typeof u=="string"?{name:u}:u)),s.get(d)};let l=0;for(const u of new Set(e))if(!(typeof u!="string"||!u.trim()||r.length>=t))try{const d=new zf(o),m=d.node(Gc(u));if((l+=m.code.length)>i)break;a.push({source:u,type:m.type}),r.push({...m,locals:d.locals})}catch(d){if(!(d instanceof Ji)&&!(d instanceof mt))throw d}if(!r.length)return;const c=(u,d,m,_,p)=>{if(typeof this.context.resolve!="function")throw new Qi("Trigger resolution is unavailable.");const v=this.triggers[u],S=this.context.resolve(v.name,v.args||(d===0?[]:d===1?[m]:[m,_]),null);let E=S;if(v.match!==void 0)if(S!=null&&S.absent)E=+v.invert;else if(typeof S=="string")E=+(S===v.match!=!!v.invert);else throw new cs;if(typeof S=="boolean")E=+S;else if(S&&typeof S.value=="number"){if(!p&&(S.type==="float"||S.float))throw new cs;E=S.value}if(typeof E!="number")throw new cs;if(!Number.isFinite(E))throw new Nt("Expression produced a non-finite number.");if(!p&&!Number.isInteger(E))throw new cs;if(p){if(E=Math.fround(E),!Number.isFinite(E))throw new Nt("Expression produced a non-finite number.");return E}return E|0},f={readInt:(...u)=>c(...u,!1),readFloat:(...u)=>c(...u,!0),finite:u=>{if(!Number.isFinite(u))throw new Nt("Expression produced a non-finite number.");return u},wrap:u=>u|0};for(const u of Ar)f[u]=Math[u==="ln"?"log":u];f.log=(u,d)=>Math.log(d)/Math.log(u),this.binary=Gf(r);const h=new WebAssembly.Instance(new WebAssembly.Module(this.binary),{host:f});a.forEach((u,d)=>this.entries.set(u.source,{...u,run:h.exports["e"+d]})),this.counts.compiled=this.entries.size,this.counts.bytes=this.binary.length}evaluate(e,t={}){const i=this.entries.get(e);if(!i)return this.counts.interpreted++,(t.typedResult?Ua:Na)(e,t);const s=this.context;this.context=t;try{const r=i.run();return this.counts.wasm++,t.typedResult?{value:r,float:i.type===We}:r}catch(r){if(r instanceof cs)return this.entries.delete(e),this.counts.deoptimized++,(t.typedResult?Ua:Na)(e,t);throw r instanceof WebAssembly.RuntimeError?new Nt("Invalid numeric operation.",e):r instanceof mt?(r.source||(r.source=e),r):r!=null&&r.bottom?new Nt(r.message,e):new mt((r==null?void 0:r.message)||"Trigger evaluation failed.",e)}finally{this.context=s}}get stats(){return{...this.counts,activeFunctions:this.entries.size}}}const Ll=th({orderedPhases:!0});function Wf(n){const e=new Set;for(const t of n)for(const i of t.states.values())for(const s of[i,...i.controllers])for(const r of s.entries){e.add(r.value);try{for(const a of gn(r.value))e.add(a)}catch{}}return e}const Xf=(n,e)=>{const t={entity:e};for(const[i,s]of Object.entries(n))(s===null||["number","string","boolean"].includes(typeof s)||Array.isArray(s))&&(t[i]=s);return t},Bs=(n,e,t=0)=>{try{return n.constant(e)}catch{return t}};class qf{constructor(e,t={}){this.files=e,this.selection=t,this.characters=mu(e);const i=this.characters.find(o=>o.path===t.character)||this.characters[0],s=this.characters.find(o=>o.path===t.opponent)||i;if(!i||!s)throw Error("No playable character definition found.");const r=new Map([...new Set([i,s])].map(o=>[o,eh(o,{commonText:Ll,constantsFromCnsOnly:!0})]));this.expressions=new Vf(Wf(r.values())),this.commands=[i,s].map(o=>{var c;const l=(c=o.checks.find(f=>f.key==="cmd"&&f.ok))==null?void 0:c.path;return new ys(Bo(l?bn(e[l]):""))});const a=t.stage&&t.stage!=="builtin/grid"?hf(e).find(o=>o.path===t.stage):null;if(a!=null&&a.invalid)throw Error("Stage definition could not be parsed.");this.match=new Rf(i,{opponentCharacter:s,commonText:Ll,programs:r,manageInputs:!0,orderedPhases:!0,expressionEvaluator:(o,l)=>this.expressions.evaluate(o,l),stage:a,playerPalette:t.palette||1,opponentPalette:t.opponentPalette||2,skipIntro:t.mode==="training",playerAILevel:t.mode==="cpu"?t.level||4:0,opponentAILevel:["solo","cpu"].includes(t.mode)?t.level||4:0,rules:t.mode==="training"?null:{roundsToWin:2,preIntro:0,introHold:30}}),this.commands=[this.match.inputBuffers.get(this.match.player),this.match.inputBuffers.get(this.match.opponent)],this.effects=new Lf,this.banks=new Map,this.indices=new Map,this.bankIds=new Map,this.spriteMetadata=new Map,this.sent=new Set,this.assets=[],this.events=[],this.sparks=[],this.issues=new Map,this.closed=!1,this.capabilities={format:"kenjatime-core-coverage-v1",engine:"Kenjatime Core",independentRuntime:!0,universalCompatibility:!1,compiledNumericExpressions:!0,scriptInterpreter:!0,knownGaps:["Extended scripting languages","3D model stages and model shadows","Video background composition","Stage parallax and window clipping","Afterimage palette chains beyond eight layers","Full native moveset parity not yet established"]}}issue(e,t){const i=e+":"+t;this.issues.size<2e3&&this.issues.set(i,{type:e,message:t})}tick(e=new Set,t=new Set){if(this.closed)throw Error("Match is closed.");const i=this.match,s=r=>i.isFrozen(r)||r.hitPauseTime>0;this.effects.advance({paused:s}),i.tick(new Set,new Set,{playerInput:e,opponentInput:t}),this.commands=[i.inputBuffers.get(i.player),i.inputBuffers.get(i.opponent)];for(const r of i.eventEntities){this.effects.consume(r.events,{entity:r});for(const a of r.events)["playsnd","stopsnd","sndpan"].includes(a.type)&&this.events.push({...Xf(a,r.id),character:r.character.path})}for(const r of i.presentationEvents)this.effects.consume([r],{entity:r.entity||r.owner});for(const r of i.events)this.sparks.push({x:r.x,y:r.y,age:0,guarded:r.guarded});return this.sparks=this.sparks.filter(r=>++r.age<12),this.sparks.length>256&&this.sparks.splice(0,this.sparks.length-256),this.effects.capture([...i.entities,...i.drawProjectiles],{paused:s}),this.effects.cleanup(i.entities),this}bank(e){var t;if(!this.banks.has(e)){const i=(t=e.def)!=null&&t.files?kc(e):Oc(e.files[e.sprite.path]);this.banks.set(e,i),this.bankIds.set(e,this.banks.size),this.indices.set(e,new Map(i.sprites.map((s,r)=>[s.group+","+s.number,r])))}return this.banks.get(e)}asset(e,t,i){var s,r;try{const a=this.bank(e),o=this.indices.get(e).get(t.group+","+t.number);if(o===void 0)return null;const l=this.bankIds.get(e),c=l+":"+o;let f=this.spriteMetadata.get(c);if(!f){const p=((s=a.decodeIndexed)==null?void 0:s.call(a,o))||a.decode(o),v=!!p.indices;f={w:p.w,h:p.h,x:p.x||0,y:p.y||0,palette:p.palette,indexed:v,colors:p.colors},this.assets.push({id:c,width:f.w,height:f.h,indexed:v,pixels:new Uint8Array(v?p.indices:p.rgba)}),this.sent.add(c),this.spriteMetadata.set(c,f),a.clearDecodedCache()}const h=f.indexed,u=a.sprites[o],d=(r=a.palettes)==null?void 0:r.find(p=>p.index===(f.palette??u.palette));let m=d?[d.group,d.number]:[1,1];m=(i==null?void 0:i.get(m.join(",")))||(i==null?void 0:i.get("*"))||m;const _=l+":pal:"+m.join(",");if(h&&!this.sent.has(_)){let p;try{p=a.paletteColors(...m)}catch{if(p=f.colors,!p)throw Error("Sprite palette is missing.");this.issue("palette","Requested palette "+m.join(",")+" is unavailable.")}const v=new Uint8Array(1024);v.set(p.subarray(0,1024)),this.assets.push({id:_,width:256,height:1,pixels:v,indexed:!1}),this.sent.add(_)}return{id:c,paletteId:_,indexed:h,w:f.w,h:f.h,x:f.x||0,y:f.y||0}}catch(a){return this.issue("sprite",a.message),null}}quad(e,t,i,{x:s=0,y:r=0,sx:a=1,sy:o=1,facing:l=1,angle:c=0,xangle:f=0,yangle:h=0,remaps:u=null,palette:d=null,trans:m=null,mask:_=!0,alpha:p=1,clip:v=null,corners:S=null}={}){var F,N,P;if(!i||e.length>=8192)return;const E=this.asset(t,i,u);if(!E)return;a*=l;const T=Cf((i.angle||0)+c,f,h),w=(i.flip||"").includes("H")?-1:1,y=(i.flip||"").includes("V")?-1:1,g=a*w*(i.scaleX??1)*T.a,x=o*y*(i.scaleY??1)*T.b,I=a*w*(i.scaleX??1)*T.c,R=o*y*(i.scaleY??1)*T.d;if(![g,x,I,R,s,r,p].every(Number.isFinite)){this.issue("render-transform","A non-finite sprite transform was skipped.");return}((F=d==null?void 0:d.layers)==null?void 0:F.length)>8&&this.issue("palette-limit","This preview can render eight palette layers per sprite.");let A=i.blend||"";return typeof m=="string"?A=m:m&&m.mode!=="default"&&(A=m.mode==="sub"?"S":m.mode==="none"?"":m.mode==="add1"?"A1":`AS${((N=m.alpha)==null?void 0:N[0])??256}D${((P=m.alpha)==null?void 0:P[1])??256}`),e.push({texture:E.id,palette:E.paletteId,indexed:E.indexed,width:E.w,height:E.h,matrix:[g,x,I,R,s+(i.x||0)*a-g*E.x-I*E.y,r+(i.y||0)*o-x*E.x-R*E.y],blend:ka(A),mask:_,alpha:p,palFX:(d==null?void 0:d.layers)||[],clip:v,corners:S}),E}frame(){var u,d,m,_,p,v,S,E,T,w;const e=this.match,t=e.view,i=Math.min(960/320,540/(t.displayHeight||240)),s=((u=e.stage)==null?void 0:u.camera)||{x:0,y:0,zoom:1},r=(540-(t.displayHeight||240)*i)/2+(t.groundY||200)*i,a=i*s.zoom,o=[];this.assets=[];const l=y=>({x:480+(y.x-s.x)*a,y:r+(y.y-s.y)*a}),c=y=>{const g=e.stage;if(!(g!=null&&g.definition.sprite))return;const x=g.definition,I=x.coordinateScale*(x.backgroundScale||1);for(const[R,A]of g.elements.entries()){if(A.layer!==y||!A.enabled||!A.visible||A.type==="dummy")continue;const F=A.animated?Ha(g.animations.get(A.anim),A.drawFrameIndex??A.frameIndex,A.drawFrameTime??A.frameTime):g.frame(A),N=g.position(R);if(!F)continue;const P=this.asset(x,F);if(!P)continue;const B=1+(s.zoom-1)*A.zoomDelta,H=I*i*B*x.xscale*(A.scaleStart[0]+s.y/I*A.scaleDelta[0]),k=I*i*B*x.yscale*(A.scaleStart[1]+s.y/I*A.scaleDelta[1]),C=480+(N.x*I-s.x*N.delta[0])*a,L=r+(N.y*I-(t.zoffset||0)-s.y*N.delta[1])*a,G=Il(A,P.w)*Math.abs(H),$=Il(A,P.h,1)*Math.abs(k),ie=Pl(C-P.x*H,P.w*Math.abs(H),G,A.tile[0],0,960),ne=Pl(L-P.y*k,P.h*Math.abs(k),$,A.tile[1],0,540);for(const X of ne)for(const te of ie){if(o.length>=8192){this.issue("resource-limit","Visible quad budget exceeded.");break}this.quad(o,x,F,{x:C+te*G,y:L+X*$,sx:H,sy:k,mask:A.mask,trans:A.transSpecified?{mode:A.trans,alpha:A.alpha}:null,palette:this.effects.backgroundPalette})}A.type==="parallax"&&this.issue("stage","Parallax perspective is pending; this preview uses the authored base scale.")}};c(0);const f=[];for(const y of[...e.renderEntities,...e.drawProjectiles]){!y.destroyed&&!y.asserted.has("invisible")&&f.push({priority:y.sprPriority||0,actor:y});for(const g of y.drawExplods||[])f.push({priority:g.ontop?1e3:g.sprpriority||0,actor:y,effect:g})}f.sort((y,g)=>y.priority-g.priority);for(const{actor:y,effect:g}of f){if(g){if(g.common){this.issue("common-effects","Character requested an unavailable shared effect animation.");continue}const I=g.space==="screen"?{x:g.pos.x*i,y:g.pos.y*i}:l(g.pos),R=(g.coordinateScale??Ut(y))*a;this.quad(o,y.character,Ha(g.animation,g.frameIndex,g.frameTime),{...I,sx:R*(((d=g.scale)==null?void 0:d[0])??1),sy:R*(((m=g.scale)==null?void 0:m[1])??1)*(g.vfacing||1),facing:g.facing,angle:g.angle||0,xangle:g.xangle||0,yangle:g.yangle||0,remaps:g.ownpal?g.paletteRemaps:y.paletteRemaps,palette:this.effects.paletteFor(g.source||y),trans:g.trans});continue}for(const I of this.effects.trailsFor(y)){const R=l({x:I.pos.x+(((_=I.drawOffset)==null?void 0:_.x)||0),y:I.pos.y+(((p=I.drawOffset)==null?void 0:p.y)||0)}),A=a*I.coordinateScale;this.quad(o,I.character,I.frame,{...R,sx:A*I.sizeX*(I.drawScale.x??1),sy:A*I.sizeY*(I.drawScale.y??1),facing:I.facing,angle:I.angle,remaps:I.paletteRemaps,palette:I.palette,trans:I.trans})}const x=l({x:y.pos.x+(((v=y.drawOffset)==null?void 0:v.x)||0)+Bs(y,"size.draw.offset.x")*Ut(y)*y.facing,y:y.pos.y+(((S=y.drawOffset)==null?void 0:S.y)||0)+Bs(y,"size.draw.offset.y")*Ut(y)});this.quad(o,y.character,ih(y),{...x,sx:a*Ut(y)*Bs(y,"size.xscale",1)*(((E=y.drawScale)==null?void 0:E.x)??1),sy:a*Ut(y)*Bs(y,"size.yscale",1)*(((T=y.drawScale)==null?void 0:T.y)??1),facing:y.facing,angle:y.angleDraw?y.angle:0,remaps:y.paletteRemaps,palette:this.effects.paletteFor(y),trans:y.trans})}c(1);const h=this.sparks.map(y=>({...l(y),age:y.age,guarded:y.guarded}));return{width:960,height:540,draws:o,assets:this.assets,sparks:h,ground:r,grid:!e.stage,players:[e.player,e.opponent].map(y=>({id:y.id,name:y.name,x:y.pos.x,y:y.pos.y,life:y.life,maxLife:y.maxLife,power:y.power,maxPower:y.maxPower,state:y.stateNo,time:y.time,anim:y.anim})),ticks:e.ticks,roundState:((w=e.roundFlow)==null?void 0:w.roundState)??2,paused:!1,expressions:this.expressions.stats}}snapshot(){var e;return{engine:"Kenjatime Core",players:[this.match.player,this.match.opponent].map(t=>({id:t.id,name:t.name,x:t.pos.x,y:t.pos.y,life:t.life,maxLife:t.maxLife,power:t.power,maxPower:t.maxPower,state:t.stateNo,time:t.time,anim:t.anim})),ticks:this.match.ticks,roundState:((e=this.match.roundFlow)==null?void 0:e.roundState)??2,expressions:this.expressions.stats,capabilities:this.capabilities,diagnostics:[...this.match.diagnostics,...this.issues.values()]}}drainEvents(){const e=this.events;return this.events=[],e}close(){this.closed=!0;for(const e of this.banks.values())e.clearDecodedCache();this.banks.clear(),this.sent.clear(),this.events=[]}}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const ko="187",$f=0,Dl=1,Yf=2,gr=1,Kf=2,gs=3,yn=0,Zt=1,_i=2,Kn=0,Ss=1,Nl=2,Ul=3,Fl=4,nh=5,ki=100,Zf=101,sh=102,Jf=103,jf=104,Qf=200,Ga=201,ed=202,td=203,rh=204,Rr=205,id=206,nd=207,sd=208,rd=209,ad=210,od=211,ld=212,cd=213,hd=214,Va=0,Wa=1,Xa=2,Ms=3,qa=4,$a=5,Ya=6,Ka=7,ah=0,ud=1,fd=2,Hi=0,oh=1,lh=2,ch=3,hh=4,uh=5,fh=6,dh=7,ph=300,jn=301,ws=302,sa=303,ra=304,Za=1e3,Ri=1001,Ja=1002,Lt=1003,dd=1004,ks=1005,Kt=1006,aa=1007,nn=1008,ti=1009,mh=1010,gh=1011,bs=1012,Ho=1013,Ii=1014,Ci=1015,Li=1016,zo=1017,Go=1018,Qn=1020,vh=35902,xh=35899,_h=1021,yh=1022,Si=1023,rn=1026,sn=1027,Vo=1028,Wo=1029,Sn=1030,Xo=1031,qo=1033,vr=33776,xr=33777,_r=33778,yr=33779,ja=35840,Qa=35841,eo=35842,to=35843,io=36196,no=37492,so=37496,ro=37488,ao=37489,Cr=37490,oo=37491,lo=37808,co=37809,ho=37810,uo=37811,fo=37812,po=37813,mo=37814,go=37815,vo=37816,xo=37817,_o=37818,yo=37819,So=37820,Mo=37821,wo=36492,bo=36494,Eo=36495,To=36283,Ao=36284,Pr=36285,Ro=36286,pd=3200,Ol=0,md=1,en="",li="srgb",Es="srgb-linear",Ir="linear",ot="srgb",oa=7680,gd=519,vd=512,xd=513,_d=514,Sh=515,yd=516,Sd=517,Mh=518,wh=519,Md=35044,Lr="300 es",Mi=2e3,Dr=2001;function wd(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Nr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function bd(){const n=Nr("canvas");return n.style.display="block",n}const Bl={};function kl(...n){const e="THREE."+n.shift();console.log(e,...n)}function bh(n){const e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Ue(...n){n=bh(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function it(...n){n=bh(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function Sr(...n){const e=n.join(" ");e in Bl||(Bl[e]=!0,Ue(...n))}function Ed(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}const Td={[Va]:Va,[Xa]:Ya,[qa]:qa,[Ms]:$a,[Wa]:Wa,[Ya]:Xa,[Ka]:Ka,[$a]:Ms};class En{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Ht=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],la=Math.PI/180,Co=180/Math.PI;function As(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Ht[n&255]+Ht[n>>8&255]+Ht[n>>16&255]+Ht[n>>24&255]+"-"+Ht[e&255]+Ht[e>>8&255]+"-"+Ht[e>>16&15|64]+Ht[e>>24&255]+"-"+Ht[t&63|128]+Ht[t>>8&255]+"-"+Ht[t>>16&255]+Ht[t>>24&255]+Ht[i&255]+Ht[i>>8&255]+Ht[i>>16&255]+Ht[i>>24&255]).toLowerCase()}function Ze(n,e,t){return Math.max(e,Math.min(t,n))}function Ad(n,e){return(n%e+e)%e}function ca(n,e,t){return(1-t)*n+t*e}function Rd(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function $o(n){switch(n.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function Cd(n,e){if(e.constructor===Float32Array)return n;const t=$o(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(n/t,-1)}function Pd(n,e){if(e.constructor===Float32Array)return n;const t=$o(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(n*t)}const jo=class jo{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ze(this.x,e.x,t.x),this.y=Ze(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ze(this.x,e,t),this.y=Ze(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ze(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ze(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};jo.prototype.isVector2=!0;let nt=jo;class is{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let l=i[s+0],c=i[s+1],f=i[s+2],h=i[s+3],u=r[a+0],d=r[a+1],m=r[a+2],_=r[a+3];if(h!==_||l!==u||c!==d||f!==m){let p=l*u+c*d+f*m+h*_;p<0&&(u=-u,d=-d,m=-m,_=-_,p=-p);let v=1-o;if(p<.9995){const S=Math.acos(p),E=Math.sin(S);v=Math.sin(v*S)/E,o=Math.sin(o*S)/E,l=l*v+u*o,c=c*v+d*o,f=f*v+m*o,h=h*v+_*o}else{l=l*v+u*o,c=c*v+d*o,f=f*v+m*o,h=h*v+_*o;const S=1/Math.sqrt(l*l+c*c+f*f+h*h);l*=S,c*=S,f*=S,h*=S}}e[t]=l,e[t+1]=c,e[t+2]=f,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,s,r,a){const o=i[s],l=i[s+1],c=i[s+2],f=i[s+3],h=r[a],u=r[a+1],d=r[a+2],m=r[a+3];return e[t]=o*m+f*h+l*d-c*u,e[t+1]=l*m+f*u+c*h-o*d,e[t+2]=c*m+f*d+o*u-l*h,e[t+3]=f*m-o*h-l*u-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),f=o(s/2),h=o(r/2),u=l(i/2),d=l(s/2),m=l(r/2);switch(a){case"XYZ":this._x=u*f*h+c*d*m,this._y=c*d*h-u*f*m,this._z=c*f*m+u*d*h,this._w=c*f*h-u*d*m;break;case"YXZ":this._x=u*f*h+c*d*m,this._y=c*d*h-u*f*m,this._z=c*f*m-u*d*h,this._w=c*f*h+u*d*m;break;case"ZXY":this._x=u*f*h-c*d*m,this._y=c*d*h+u*f*m,this._z=c*f*m+u*d*h,this._w=c*f*h-u*d*m;break;case"ZYX":this._x=u*f*h-c*d*m,this._y=c*d*h+u*f*m,this._z=c*f*m-u*d*h,this._w=c*f*h+u*d*m;break;case"YZX":this._x=u*f*h+c*d*m,this._y=c*d*h+u*f*m,this._z=c*f*m-u*d*h,this._w=c*f*h-u*d*m;break;case"XZY":this._x=u*f*h-c*d*m,this._y=c*d*h-u*f*m,this._z=c*f*m+u*d*h,this._w=c*f*h+u*d*m;break;default:Ue("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],f=t[6],h=t[10],u=i+o+h;if(u>0){const d=.5/Math.sqrt(u+1);this._w=.25/d,this._x=(f-l)*d,this._y=(r-c)*d,this._z=(a-s)*d}else if(i>o&&i>h){const d=2*Math.sqrt(1+i-o-h);this._w=(f-l)/d,this._x=.25*d,this._y=(s+a)/d,this._z=(r+c)/d}else if(o>h){const d=2*Math.sqrt(1+o-i-h);this._w=(r-c)/d,this._x=(s+a)/d,this._y=.25*d,this._z=(l+f)/d}else{const d=2*Math.sqrt(1+h-i-o);this._w=(a-s)/d,this._x=(r+c)/d,this._y=(l+f)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ze(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,f=t._w;return this._x=i*f+a*o+s*c-r*l,this._y=s*f+a*l+r*o-i*c,this._z=r*f+a*c+i*l-s*o,this._w=a*f-i*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let i=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),f=Math.sin(c);l=Math.sin(l*c)/f,t=Math.sin(t*c)/f,this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Qo=class Qo{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Hl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Hl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*i),f=2*(o*t-r*s),h=2*(r*i-a*t);return this.x=t+l*c+a*h-o*f,this.y=i+l*f+o*c-r*h,this.z=s+l*h+r*f-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ze(this.x,e.x,t.x),this.y=Ze(this.y,e.y,t.y),this.z=Ze(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ze(this.x,e,t),this.y=Ze(this.y,e,t),this.z=Ze(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ze(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-i*l,this.z=i*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return ha.copy(this).projectOnVector(e),this.sub(ha)}reflect(e){return this.sub(ha.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ze(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Qo.prototype.isVector3=!0;let K=Qo;const ha=new K,Hl=new is,el=class el{constructor(e,t,i,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c)}set(e,t,i,s,r,a,o,l,c){const f=this.elements;return f[0]=e,f[1]=s,f[2]=o,f[3]=t,f[4]=r,f[5]=l,f[6]=i,f[7]=a,f[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],f=i[4],h=i[7],u=i[2],d=i[5],m=i[8],_=s[0],p=s[3],v=s[6],S=s[1],E=s[4],T=s[7],w=s[2],y=s[5],g=s[8];return r[0]=a*_+o*S+l*w,r[3]=a*p+o*E+l*y,r[6]=a*v+o*T+l*g,r[1]=c*_+f*S+h*w,r[4]=c*p+f*E+h*y,r[7]=c*v+f*T+h*g,r[2]=u*_+d*S+m*w,r[5]=u*p+d*E+m*y,r[8]=u*v+d*T+m*g,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],f=e[8];return t*a*f-t*o*c-i*r*f+i*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],f=e[8],h=f*a-o*c,u=o*l-f*r,d=c*r-a*l,m=t*h+i*u+s*d;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/m;return e[0]=h*_,e[1]=(s*c-f*i)*_,e[2]=(o*i-s*a)*_,e[3]=u*_,e[4]=(f*t-s*l)*_,e[5]=(s*r-o*t)*_,e[6]=d*_,e[7]=(i*l-c*t)*_,e[8]=(a*t-i*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return Sr("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(ua.makeScale(e,t)),this}rotate(e){return Sr("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(ua.makeRotation(-e)),this}translate(e,t){return Sr("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(ua.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};el.prototype.isMatrix3=!0;let Oe=el;const ua=new Oe,zl=new Oe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Gl=new Oe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Id(){const n={enabled:!0,workingColorSpace:Es,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ot&&(s.r=zi(s.r),s.g=zi(s.g),s.b=zi(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ot&&(s.r=Zn(s.r),s.g=Zn(s.g),s.b=Zn(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===en?Ir:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[a].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Es]:{primaries:e,whitePoint:i,transfer:Ir,toXYZ:zl,fromXYZ:Gl,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:li},outputColorSpaceConfig:{drawingBufferColorSpace:li}},[li]:{primaries:e,whitePoint:i,transfer:ot,toXYZ:zl,fromXYZ:Gl,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:li}}}),n}const Ke=Id();function zi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Zn(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let In;class Ld{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{In===void 0&&(In=Nr("canvas")),In.width=e.width,In.height=e.height;const s=In.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=In}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Nr("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=zi(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(zi(t[i]/255)*255):t[i]=zi(t[i]);return{data:t,width:e.width,height:e.height}}else return Ue("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Dd=0;class Yo{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Dd++}),this.uuid=As(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width||0,t.height||0,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(fa(s[a].image)):r.push(fa(s[a]))}else r=fa(s);i.url=r}return t||(e.images[this.uuid]=i),i}}function fa(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Ld.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Ue("Texture: Unable to serialize Texture."),{})}let Nd=0;const da=new K;class $t extends En{constructor(e=$t.DEFAULT_IMAGE,t=$t.DEFAULT_MAPPING,i=Ri,s=Ri,r=Kt,a=nn,o=Si,l=ti,c=$t.DEFAULT_ANISOTROPY,f=en){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Nd++}),this.uuid=As(),this.name="",this.source=new Yo(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new nt(0,0),this.repeat=new nt(1,1),this.center=new nt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Oe,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=f,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(da).x}get height(){return this.source.getSize(da).y}get depth(){return this.source.getSize(da).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){Ue(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ue(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==ph)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Za:e.x=e.x-Math.floor(e.x);break;case Ri:e.x=e.x<0?0:1;break;case Ja:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Za:e.y=e.y-Math.floor(e.y);break;case Ri:e.y=e.y<0?0:1;break;case Ja:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}$t.DEFAULT_IMAGE=null;$t.DEFAULT_MAPPING=ph;$t.DEFAULT_ANISOTROPY=1;const tl=class tl{constructor(e=0,t=0,i=0,s=1){this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r;const l=e.elements,c=l[0],f=l[4],h=l[8],u=l[1],d=l[5],m=l[9],_=l[2],p=l[6],v=l[10];if(Math.abs(f-u)<.01&&Math.abs(h-_)<.01&&Math.abs(m-p)<.01){if(Math.abs(f+u)<.1&&Math.abs(h+_)<.1&&Math.abs(m+p)<.1&&Math.abs(c+d+v-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const E=(c+1)/2,T=(d+1)/2,w=(v+1)/2,y=(f+u)/4,g=(h+_)/4,x=(m+p)/4;return E>T&&E>w?E<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(E),s=y/i,r=g/i):T>w?T<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(T),i=y/s,r=x/s):w<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),i=g/r,s=x/r),this.set(i,s,r,t),this}let S=Math.sqrt((p-m)*(p-m)+(h-_)*(h-_)+(u-f)*(u-f));return Math.abs(S)<.001&&(S=1),this.x=(p-m)/S,this.y=(h-_)/S,this.z=(u-f)/S,this.w=Math.acos((c+d+v-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ze(this.x,e.x,t.x),this.y=Ze(this.y,e.y,t.y),this.z=Ze(this.z,e.z,t.z),this.w=Ze(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ze(this.x,e,t),this.y=Ze(this.y,e,t),this.z=Ze(this.z,e,t),this.w=Ze(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ze(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};tl.prototype.isVector4=!0;let St=tl;class Ud extends En{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Kt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new St(0,0,e,t),this.scissorTest=!1,this.viewport=new St(0,0,e,t),this.textures=[];const s=i.count;for(let r=0;r<s;r++)this.textures[r]=new $t({width:e,height:t,depth:i.depth}),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:Kt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Yo(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Pi extends Ud{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Eh extends $t{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Lt,this.minFilter=Lt,this.wrapR=Ri,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Fd extends $t{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Lt,this.minFilter=Lt,this.wrapR=Ri,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}const Or=class Or{constructor(e,t,i,s,r,a,o,l,c,f,h,u,d,m,_,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c,f,h,u,d,m,_,p)}set(e,t,i,s,r,a,o,l,c,f,h,u,d,m,_,p){const v=this.elements;return v[0]=e,v[4]=t,v[8]=i,v[12]=s,v[1]=r,v[5]=a,v[9]=o,v[13]=l,v[2]=c,v[6]=f,v[10]=h,v[14]=u,v[3]=d,v[7]=m,v[11]=_,v[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Or().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,i=e.elements,s=1/Ln.setFromMatrixColumn(e,0).length(),r=1/Ln.setFromMatrixColumn(e,1).length(),a=1/Ln.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),f=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){const u=a*f,d=a*h,m=o*f,_=o*h;t[0]=l*f,t[4]=-l*h,t[8]=c,t[1]=d+m*c,t[5]=u-_*c,t[9]=-o*l,t[2]=_-u*c,t[6]=m+d*c,t[10]=a*l}else if(e.order==="YXZ"){const u=l*f,d=l*h,m=c*f,_=c*h;t[0]=u+_*o,t[4]=m*o-d,t[8]=a*c,t[1]=a*h,t[5]=a*f,t[9]=-o,t[2]=d*o-m,t[6]=_+u*o,t[10]=a*l}else if(e.order==="ZXY"){const u=l*f,d=l*h,m=c*f,_=c*h;t[0]=u-_*o,t[4]=-a*h,t[8]=m+d*o,t[1]=d+m*o,t[5]=a*f,t[9]=_-u*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const u=a*f,d=a*h,m=o*f,_=o*h;t[0]=l*f,t[4]=m*c-d,t[8]=u*c+_,t[1]=l*h,t[5]=_*c+u,t[9]=d*c-m,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const u=a*l,d=a*c,m=o*l,_=o*c;t[0]=l*f,t[4]=_-u*h,t[8]=m*h+d,t[1]=h,t[5]=a*f,t[9]=-o*f,t[2]=-c*f,t[6]=d*h+m,t[10]=u-_*h}else if(e.order==="XZY"){const u=a*l,d=a*c,m=o*l,_=o*c;t[0]=l*f,t[4]=-h,t[8]=c*f,t[1]=u*h+_,t[5]=a*f,t[9]=d*h-m,t[2]=m*h-d,t[6]=o*f,t[10]=_*h+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Od,e,Bd)}lookAt(e,t,i){const s=this.elements;return jt.subVectors(e,t),jt.lengthSq()===0&&(jt.z=1),jt.normalize(),qi.crossVectors(i,jt),qi.lengthSq()===0&&(Math.abs(i.z)===1?jt.x+=1e-4:jt.z+=1e-4,jt.normalize(),qi.crossVectors(i,jt)),qi.normalize(),Hs.crossVectors(jt,qi),s[0]=qi.x,s[4]=Hs.x,s[8]=jt.x,s[1]=qi.y,s[5]=Hs.y,s[9]=jt.y,s[2]=qi.z,s[6]=Hs.z,s[10]=jt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],f=i[1],h=i[5],u=i[9],d=i[13],m=i[2],_=i[6],p=i[10],v=i[14],S=i[3],E=i[7],T=i[11],w=i[15],y=s[0],g=s[4],x=s[8],I=s[12],R=s[1],A=s[5],F=s[9],N=s[13],P=s[2],B=s[6],H=s[10],k=s[14],C=s[3],L=s[7],G=s[11],$=s[15];return r[0]=a*y+o*R+l*P+c*C,r[4]=a*g+o*A+l*B+c*L,r[8]=a*x+o*F+l*H+c*G,r[12]=a*I+o*N+l*k+c*$,r[1]=f*y+h*R+u*P+d*C,r[5]=f*g+h*A+u*B+d*L,r[9]=f*x+h*F+u*H+d*G,r[13]=f*I+h*N+u*k+d*$,r[2]=m*y+_*R+p*P+v*C,r[6]=m*g+_*A+p*B+v*L,r[10]=m*x+_*F+p*H+v*G,r[14]=m*I+_*N+p*k+v*$,r[3]=S*y+E*R+T*P+w*C,r[7]=S*g+E*A+T*B+w*L,r[11]=S*x+E*F+T*H+w*G,r[15]=S*I+E*N+T*k+w*$,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],f=e[2],h=e[6],u=e[10],d=e[14],m=e[3],_=e[7],p=e[11],v=e[15],S=l*d-c*u,E=o*d-c*h,T=o*u-l*h,w=a*d-c*f,y=a*u-l*f,g=a*h-o*f;return t*(_*S-p*E+v*T)-i*(m*S-p*w+v*y)+s*(m*E-_*w+v*g)-r*(m*T-_*y+p*g)}determinantAffine(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],f=e[10];return t*(a*f-o*c)-i*(r*f-o*l)+s*(r*c-a*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],f=e[8],h=e[9],u=e[10],d=e[11],m=e[12],_=e[13],p=e[14],v=e[15],S=t*o-i*a,E=t*l-s*a,T=t*c-r*a,w=i*l-s*o,y=i*c-r*o,g=s*c-r*l,x=f*_-h*m,I=f*p-u*m,R=f*v-d*m,A=h*p-u*_,F=h*v-d*_,N=u*v-d*p,P=S*N-E*F+T*A+w*R-y*I+g*x;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const B=1/P;return e[0]=(o*N-l*F+c*A)*B,e[1]=(s*F-i*N-r*A)*B,e[2]=(_*g-p*y+v*w)*B,e[3]=(u*y-h*g-d*w)*B,e[4]=(l*R-a*N-c*I)*B,e[5]=(t*N-s*R+r*I)*B,e[6]=(p*T-m*g-v*E)*B,e[7]=(f*g-u*T+d*E)*B,e[8]=(a*F-o*R+c*x)*B,e[9]=(i*R-t*F-r*x)*B,e[10]=(m*y-_*T+v*S)*B,e[11]=(h*T-f*y-d*S)*B,e[12]=(o*I-a*A-l*x)*B,e[13]=(t*A-i*I+s*x)*B,e[14]=(_*E-m*w-p*S)*B,e[15]=(f*w-h*E+u*S)*B,this}scale(e){const t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,l=e.z,c=r*a,f=r*o;return this.set(c*a+i,c*o-s*l,c*l+s*o,0,c*o+s*l,f*o+i,f*l-s*a,0,c*l-s*o,f*l+s*a,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,f=a+a,h=o+o,u=r*c,d=r*f,m=r*h,_=a*f,p=a*h,v=o*h,S=l*c,E=l*f,T=l*h,w=i.x,y=i.y,g=i.z;return s[0]=(1-(_+v))*w,s[1]=(d+T)*w,s[2]=(m-E)*w,s[3]=0,s[4]=(d-T)*y,s[5]=(1-(u+v))*y,s[6]=(p+S)*y,s[7]=0,s[8]=(m+E)*g,s[9]=(p-S)*g,s[10]=(1-(u+_))*g,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinantAffine();if(r===0)return i.set(1,1,1),t.identity(),this;let a=Ln.set(s[0],s[1],s[2]).length();const o=Ln.set(s[4],s[5],s[6]).length(),l=Ln.set(s[8],s[9],s[10]).length();r<0&&(a=-a),di.copy(this);const c=1/a,f=1/o,h=1/l;return di.elements[0]*=c,di.elements[1]*=c,di.elements[2]*=c,di.elements[4]*=f,di.elements[5]*=f,di.elements[6]*=f,di.elements[8]*=h,di.elements[9]*=h,di.elements[10]*=h,t.setFromRotationMatrix(di),i.x=a,i.y=o,i.z=l,this}makePerspective(e,t,i,s,r,a,o=Mi,l=!1){const c=this.elements,f=2*r/(t-e),h=2*r/(i-s),u=(t+e)/(t-e),d=(i+s)/(i-s);let m,_;if(l)m=r/(a-r),_=a*r/(a-r);else if(o===Mi)m=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===Dr)m=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=f,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=Mi,l=!1){const c=this.elements,f=2/(t-e),h=2/(i-s),u=-(t+e)/(t-e),d=-(i+s)/(i-s);let m,_;if(l)m=1/(a-r),_=a/(a-r);else if(o===Mi)m=-2/(a-r),_=-(a+r)/(a-r);else if(o===Dr)m=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=f,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=h,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=m,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};Or.prototype.isMatrix4=!0;let Mt=Or;const Ln=new K,di=new Mt,Od=new K(0,0,0),Bd=new K(1,1,1),qi=new K,Hs=new K,jt=new K,Vl=new Mt,Wl=new is;class Mn{constructor(e=0,t=0,i=0,s=Mn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],f=s[9],h=s[2],u=s[6],d=s[10];switch(t){case"XYZ":this._y=Math.asin(Ze(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-f,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ze(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ze(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-h,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ze(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(u,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Ze(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-f,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-Ze(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-f,d),this._y=0);break;default:Ue("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Vl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Vl,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Wl.setFromEuler(this),this.setFromQuaternion(Wl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Mn.DEFAULT_ORDER="XYZ";class Th{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let kd=0;const Xl=new K,Dn=new is,Ni=new Mt,zs=new K,hs=new K,Hd=new K,zd=new is,ql=new K(1,0,0),$l=new K(0,1,0),Yl=new K(0,0,1),Kl={type:"added"},Gd={type:"removed"},Nn={type:"childadded",child:null},pa={type:"childremoved",child:null};class ii extends En{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:kd++}),this.uuid=As(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ii.DEFAULT_UP.clone();const e=new K,t=new Mn,i=new is,s=new K(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Mt},normalMatrix:{value:new Oe}}),this.matrix=new Mt,this.matrixWorld=new Mt,this.matrixAutoUpdate=ii.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ii.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Th,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Dn.setFromAxisAngle(e,t),this.quaternion.multiply(Dn),this}rotateOnWorldAxis(e,t){return Dn.setFromAxisAngle(e,t),this.quaternion.premultiply(Dn),this}rotateX(e){return this.rotateOnAxis(ql,e)}rotateY(e){return this.rotateOnAxis($l,e)}rotateZ(e){return this.rotateOnAxis(Yl,e)}translateOnAxis(e,t){return Xl.copy(e).applyQuaternion(this.quaternion),this.position.add(Xl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(ql,e)}translateY(e){return this.translateOnAxis($l,e)}translateZ(e){return this.translateOnAxis(Yl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ni.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?zs.copy(e):zs.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),hs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ni.lookAt(hs,zs,this.up):Ni.lookAt(zs,hs,this.up),this.quaternion.setFromRotationMatrix(Ni),s&&(Ni.extractRotation(s.matrixWorld),Dn.setFromRotationMatrix(Ni),this.quaternion.premultiply(Dn.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(it("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Kl),Nn.child=e,this.dispatchEvent(Nn),Nn.child=null):it("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Gd),pa.child=e,this.dispatchEvent(pa),pa.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ni.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ni.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ni),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Kl),Nn.child=e,this.dispatchEvent(Nn),Nn.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(hs,e,Hd),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(hs,zd,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*i-r[8]*s,r[13]+=i-r[1]*t-r[5]*i-r[9]*s,r[14]+=s-r[2]*t-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,i)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,f=l.length;c<f;c++){const h=l[c];r(e.shapes,h)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),f=a(e.images),h=a(e.shapes),u=a(e.skeletons),d=a(e.animations),m=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),f.length>0&&(i.images=f),h.length>0&&(i.shapes=h),u.length>0&&(i.skeletons=u),d.length>0&&(i.animations=d),m.length>0&&(i.nodes=m)}return i.object=s,i;function a(o){const l=[];for(const c in o){const f=o[c];delete f.metadata,l.push(f)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}ii.DEFAULT_UP=new K(0,1,0);ii.DEFAULT_MATRIX_AUTO_UPDATE=!0;ii.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Gs extends ii{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Vd={type:"move"};class ma{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Gs,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Gs,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new K,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new K),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Gs,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new K,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new K,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const _ of e.hand.values()){const p=t.getJointPose(_,i),v=this._getHandJoint(c,_);p!==null&&(v.matrix.fromArray(p.transform.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale),v.matrixWorldNeedsUpdate=!0,v.jointRadius=p.radius),v.visible=p!==null}const f=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],u=f.position.distanceTo(h.position),d=.02,m=.005;c.inputState.pinching&&u>d+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=d-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.quaternion,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Vd)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Gs;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const Ah={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},$i={h:0,s:0,l:0},Vs={h:0,s:0,l:0};function ga(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class st{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=li){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ke.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=Ke.workingColorSpace){return this.r=e,this.g=t,this.b=i,Ke.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=Ke.workingColorSpace){if(e=Ad(e,1),t=Ze(t,0,1),i=Ze(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=ga(a,r,e+1/3),this.g=ga(a,r,e),this.b=ga(a,r,e-1/3)}return Ke.colorSpaceToWorking(this,s),this}setStyle(e,t=li){function i(r){r!==void 0&&parseFloat(r)<1&&Ue("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,t);break;case"hsl":case"hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ue("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Ue("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=li){const i=Ah[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Ue("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=zi(e.r),this.g=zi(e.g),this.b=zi(e.b),this}copyLinearToSRGB(e){return this.r=Zn(e.r),this.g=Zn(e.g),this.b=Zn(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=li){return Ke.workingToColorSpace(zt.copy(this),e),Math.round(Ze(zt.r*255,0,255))*65536+Math.round(Ze(zt.g*255,0,255))*256+Math.round(Ze(zt.b*255,0,255))}getHexString(e=li){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ke.workingColorSpace){Ke.workingToColorSpace(zt.copy(this),t);const i=zt.r,s=zt.g,r=zt.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let l,c;const f=(o+a)/2;if(o===a)l=0,c=0;else{const h=a-o;switch(c=f<=.5?h/(a+o):h/(2-a-o),a){case i:l=(s-r)/h+(s<r?6:0);break;case s:l=(r-i)/h+2;break;case r:l=(i-s)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=f,e}getRGB(e,t=Ke.workingColorSpace){return Ke.workingToColorSpace(zt.copy(this),t),e.r=zt.r,e.g=zt.g,e.b=zt.b,e}getStyle(e=li){Ke.workingToColorSpace(zt.copy(this),e);const t=zt.r,i=zt.g,s=zt.b;return e!==li?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL($i),this.setHSL($i.h+e,$i.s+t,$i.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL($i),e.getHSL(Vs);const i=ca($i.h,Vs.h,t),s=ca($i.s,Vs.s,t),r=ca($i.l,Vs.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const zt=new st;st.NAMES=Ah;class Wd extends ii{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Mn,this.environmentIntensity=1,this.environmentRotation=new Mn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background!==null?e.background.clone():null,this.environment=e.environment!==null?e.environment.clone():null,this.fog=e.fog!==null?e.fog.clone():null,this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial!==null?e.overrideMaterial.clone():null,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}const pi=new K,Ui=new K,va=new K,Fi=new K,Un=new K,Fn=new K,Zl=new K,xa=new K,_a=new K,ya=new K,Sa=new St,Ma=new St,wa=new St;class yi{constructor(e=new K,t=new K,i=new K){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),pi.subVectors(e,t),s.cross(pi);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){pi.subVectors(s,t),Ui.subVectors(i,t),va.subVectors(e,t);const a=pi.dot(pi),o=pi.dot(Ui),l=pi.dot(va),c=Ui.dot(Ui),f=Ui.dot(va),h=a*c-o*o;if(h===0)return r.set(0,0,0),null;const u=1/h,d=(c*l-o*f)*u,m=(a*f-o*l)*u;return r.set(1-d-m,m,d)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Fi)===null?!1:Fi.x>=0&&Fi.y>=0&&Fi.x+Fi.y<=1}static getInterpolation(e,t,i,s,r,a,o,l){return this.getBarycoord(e,t,i,s,Fi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Fi.x),l.addScaledVector(a,Fi.y),l.addScaledVector(o,Fi.z),l)}static getInterpolatedAttribute(e,t,i,s,r,a){return Sa.setScalar(0),Ma.setScalar(0),wa.setScalar(0),Sa.fromBufferAttribute(e,t),Ma.fromBufferAttribute(e,i),wa.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Sa,r.x),a.addScaledVector(Ma,r.y),a.addScaledVector(wa,r.z),a}static isFrontFacing(e,t,i,s){return pi.subVectors(i,t),Ui.subVectors(e,t),pi.cross(Ui).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return pi.subVectors(this.c,this.b),Ui.subVectors(this.a,this.b),pi.cross(Ui).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return yi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return yi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return yi.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return yi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return yi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,r=this.c;let a,o;Un.subVectors(s,i),Fn.subVectors(r,i),xa.subVectors(e,i);const l=Un.dot(xa),c=Fn.dot(xa);if(l<=0&&c<=0)return t.copy(i);_a.subVectors(e,s);const f=Un.dot(_a),h=Fn.dot(_a);if(f>=0&&h<=f)return t.copy(s);const u=l*h-f*c;if(u<=0&&l>=0&&f<=0&&l-f>0)return a=l/(l-f),t.copy(i).addScaledVector(Un,a);ya.subVectors(e,r);const d=Un.dot(ya),m=Fn.dot(ya);if(m>=0&&d<=m)return t.copy(r);const _=d*c-l*m;if(_<=0&&c>=0&&m<=0)return o=c/(c-m),t.copy(i).addScaledVector(Fn,o);const p=f*m-d*h;if(p<=0&&h-f>=0&&d-m>=0)return Zl.subVectors(r,s),o=(h-f)/(h-f+(d-m)),t.copy(s).addScaledVector(Zl,o);const v=1/(p+_+u);return a=_*v,o=u*v,t.copy(i).addScaledVector(Un,a).addScaledVector(Fn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Rs{constructor(e=new K(1/0,1/0,1/0),t=new K(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(mi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(mi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=mi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,mi):mi.fromBufferAttribute(r,a),mi.applyMatrix4(e.matrixWorld),this.expandByPoint(mi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ws.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Ws.copy(i.boundingBox)),Ws.applyMatrix4(e.matrixWorld),this.union(Ws)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,mi),mi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(us),Xs.subVectors(this.max,us),On.subVectors(e.a,us),Bn.subVectors(e.b,us),kn.subVectors(e.c,us),Yi.subVectors(Bn,On),Ki.subVectors(kn,Bn),fn.subVectors(On,kn);let t=[0,-Yi.z,Yi.y,0,-Ki.z,Ki.y,0,-fn.z,fn.y,Yi.z,0,-Yi.x,Ki.z,0,-Ki.x,fn.z,0,-fn.x,-Yi.y,Yi.x,0,-Ki.y,Ki.x,0,-fn.y,fn.x,0];return!ba(t,On,Bn,kn,Xs)||(t=[1,0,0,0,1,0,0,0,1],!ba(t,On,Bn,kn,Xs))?!1:(qs.crossVectors(Yi,Ki),t=[qs.x,qs.y,qs.z],ba(t,On,Bn,kn,Xs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,mi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(mi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Oi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Oi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Oi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Oi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Oi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Oi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Oi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Oi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Oi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Oi=[new K,new K,new K,new K,new K,new K,new K,new K],mi=new K,Ws=new Rs,On=new K,Bn=new K,kn=new K,Yi=new K,Ki=new K,fn=new K,us=new K,Xs=new K,qs=new K,dn=new K;function ba(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){dn.fromArray(n,r);const o=s.x*Math.abs(dn.x)+s.y*Math.abs(dn.y)+s.z*Math.abs(dn.z),l=e.dot(dn),c=t.dot(dn),f=i.dot(dn);if(Math.max(-Math.max(l,c,f),Math.min(l,c,f))>o)return!1}return!0}const bt=new K,$s=new nt;let Xd=0;class _n extends En{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Xd++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Md,this.updateRanges=[],this.gpuType=Ci,this.version=0,this._normalizationScale=e!==void 0?$o(e):void 0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)$s.fromBufferAttribute(this,t),$s.applyMatrix3(e),this.setXY(t,$s.x,$s.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)bt.fromBufferAttribute(this,t),bt.applyMatrix3(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)bt.fromBufferAttribute(this,t),bt.applyMatrix4(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)bt.fromBufferAttribute(this,t),bt.applyNormalMatrix(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)bt.fromBufferAttribute(this,t),bt.transformDirection(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=this._denormalize(i)),i}setComponent(e,t,i){return this.normalized&&(i=this._normalize(i)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i),s=this._normalize(s)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i),s=this._normalize(s),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(e){const t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):Cd(e,this.array)}_normalize(e){const t=this._normalizationScale;return t!==void 0?Math.round(e*t):Pd(e,this.array)}}class Rh extends _n{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Ch extends _n{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class wi extends _n{constructor(e,t,i){super(new Float32Array(e),t,i)}}const qd=new Rs,fs=new K,Ea=new K;class Ko{constructor(e=new K,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):qd.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;fs.subVectors(e,this.center);const t=fs.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(fs,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ea.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(fs.copy(e.center).add(Ea)),this.expandByPoint(fs.copy(e.center).sub(Ea))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let $d=0;const oi=new Mt,Ta=new ii,Hn=new K,Qt=new Rs,ds=new Rs,It=new K;class an extends En{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:$d++}),this.uuid=As(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(wd(e)?Ch:Rh)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new Oe().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return oi.makeRotationFromQuaternion(e),this.applyMatrix4(oi),this}rotateX(e){return oi.makeRotationX(e),this.applyMatrix4(oi),this}rotateY(e){return oi.makeRotationY(e),this.applyMatrix4(oi),this}rotateZ(e){return oi.makeRotationZ(e),this.applyMatrix4(oi),this}translate(e,t,i){return oi.makeTranslation(e,t,i),this.applyMatrix4(oi),this}scale(e,t,i){return oi.makeScale(e,t,i),this.applyMatrix4(oi),this}lookAt(e){return Ta.lookAt(e),Ta.updateMatrix(),this.applyMatrix4(Ta.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Hn).negate(),this.translate(Hn.x,Hn.y,Hn.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new wi(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Ue("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Rs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){it("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new K(-1/0,-1/0,-1/0),new K(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const r=t[i];Qt.setFromBufferAttribute(r),this.morphTargetsRelative?(It.addVectors(this.boundingBox.min,Qt.min),this.boundingBox.expandByPoint(It),It.addVectors(this.boundingBox.max,Qt.max),this.boundingBox.expandByPoint(It)):(this.boundingBox.expandByPoint(Qt.min),this.boundingBox.expandByPoint(Qt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&it('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ko);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){it("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new K,1/0);return}if(e){const i=this.boundingSphere.center;if(Qt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];ds.setFromBufferAttribute(o),this.morphTargetsRelative?(It.addVectors(Qt.min,ds.min),Qt.expandByPoint(It),It.addVectors(Qt.max,ds.max),Qt.expandByPoint(It)):(Qt.expandByPoint(ds.min),Qt.expandByPoint(ds.max))}Qt.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)It.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(It));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,f=o.count;c<f;c++)It.fromBufferAttribute(o,c),l&&(Hn.fromBufferAttribute(e,c),It.add(Hn)),s=Math.max(s,i.distanceToSquared(It))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&it('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){it("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,r=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==i.count)&&(a=new _n(new Float32Array(4*i.count),4),this.setAttribute("tangent",a));const o=[],l=[],c=new Uint8Array(i.count);for(let I=0;I<i.count;I++)o[I]=new K,l[I]=new K;const f=new K,h=new K,u=new K,d=new nt,m=new nt,_=new nt,p=new K,v=new K;function S(I,R,A){c[I]=c[R]=c[A]=1,f.fromBufferAttribute(i,I),h.fromBufferAttribute(i,R),u.fromBufferAttribute(i,A),d.fromBufferAttribute(r,I),m.fromBufferAttribute(r,R),_.fromBufferAttribute(r,A),h.sub(f),u.sub(f),m.sub(d),_.sub(d);const F=1/(m.x*_.y-_.x*m.y);isFinite(F)&&(p.copy(h).multiplyScalar(_.y).addScaledVector(u,-m.y).multiplyScalar(F),v.copy(u).multiplyScalar(m.x).addScaledVector(h,-_.x).multiplyScalar(F),o[I].add(p),o[R].add(p),o[A].add(p),l[I].add(v),l[R].add(v),l[A].add(v))}let E=this.groups;E.length===0&&(E=[{start:0,count:e.count}]);for(let I=0,R=E.length;I<R;++I){const A=E[I],F=A.start,N=A.count;for(let P=F,B=F+N;P<B;P+=3)S(e.getX(P+0),e.getX(P+1),e.getX(P+2))}const T=new K,w=new K,y=new K,g=new K;function x(I){y.fromBufferAttribute(s,I),g.copy(y);const R=o[I];T.copy(R),T.sub(y.multiplyScalar(y.dot(R))).normalize(),w.crossVectors(g,R);const F=w.dot(l[I])<0?-1:1;a.setXYZW(I,T.x,T.y,T.z,F)}for(let I=0,R=i.count;I<R;++I)c[I]&&x(I);this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new _n(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let u=0,d=i.count;u<d;u++)i.setXYZ(u,0,0,0);const s=new K,r=new K,a=new K,o=new K,l=new K,c=new K,f=new K,h=new K;if(e)for(let u=0,d=e.count;u<d;u+=3){const m=e.getX(u+0),_=e.getX(u+1),p=e.getX(u+2);s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,_),a.fromBufferAttribute(t,p),f.subVectors(a,r),h.subVectors(s,r),f.cross(h),o.fromBufferAttribute(i,m),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,p),o.add(f),l.add(f),c.add(f),i.setXYZ(m,o.x,o.y,o.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(p,c.x,c.y,c.z)}else for(let u=0,d=t.count;u<d;u+=3)s.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),a.fromBufferAttribute(t,u+2),f.subVectors(a,r),h.subVectors(s,r),f.cross(h),i.setXYZ(u+0,f.x,f.y,f.z),i.setXYZ(u+1,f.x,f.y,f.z),i.setXYZ(u+2,f.x,f.y,f.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)It.fromBufferAttribute(e,t),It.normalize(),e.setXYZ(t,It.x,It.y,It.z)}toNonIndexed(){function e(o,l){const c=o.array,f=o.itemSize,h=o.normalized,u=new c.constructor(l.length*f);let d=0,m=0;for(let _=0,p=l.length;_<p;_++){o.isInterleavedBufferAttribute?d=l[_]*o.data.stride+o.offset:d=l[_]*f;for(let v=0;v<f;v++)u[m++]=c[d++]}return new _n(u,f,h)}if(this.index===null)return Ue("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new an,i=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,i);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let f=0,h=c.length;f<h;f++){const u=c[f],d=e(u,i);l.push(d)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],f=[];for(let h=0,u=c.length;h<u;h++){const d=c[h];f.push(d.toJSON(e.data))}f.length>0&&(s[l]=f,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const c in s){const f=s[c];this.setAttribute(c,f.clone(t))}const r=e.morphAttributes;for(const c in r){const f=[],h=r[c];for(let u=0,d=h.length;u<d;u++)f.push(h[u].clone(t));this.morphAttributes[c]=f}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,f=a.length;c<f;c++){const h=a[c];this.addGroup(h.start,h.count,h.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Aa=new K,Yd=new K,Kd=new Oe;class ji{constructor(e=new K(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=Aa.subVectors(i,t).cross(Yd.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const s=e.delta(Aa),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return i===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Kd.getNormalMatrix(e),s=this.coplanarPoint(Aa).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let Zd=0;class kr extends En{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Zd++}),this.uuid=As(),this.name="",this.type="Material",this.blending=Ss,this.side=yn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=rh,this.blendDst=Rr,this.blendEquation=ki,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new st(0,0,0),this.blendAlpha=0,this.depthFunc=Ms,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=gd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=oa,this.stencilZFail=oa,this.stencilZPass=oa,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){Ue(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ue(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(i.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(i.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(i.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(i.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new st().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new ji().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new nt().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new nt().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Bi=new K,Ra=new K,Ys=new K,Ks=new K;class Jd{constructor(e=new K,t=new K(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Bi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Bi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Bi.copy(this.origin).addScaledVector(this.direction,t),Bi.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Ra.copy(e).add(t).multiplyScalar(.5),Ys.copy(t).sub(e).normalize(),Ks.copy(this.origin).sub(Ra);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Ys),o=Ks.dot(this.direction),l=-Ks.dot(Ys),c=Ks.lengthSq(),f=Math.abs(1-a*a);let h,u,d,m;if(f>0)if(h=a*l-o,u=a*o-l,m=r*f,h>=0)if(u>=-m)if(u<=m){const _=1/f;h*=_,u*=_,d=h*(h+a*u+2*o)+u*(a*h+u+2*l)+c}else u=r,h=Math.max(0,-(a*u+o)),d=-h*h+u*(u+2*l)+c;else u=-r,h=Math.max(0,-(a*u+o)),d=-h*h+u*(u+2*l)+c;else u<=-m?(h=Math.max(0,-(-a*r+o)),u=h>0?-r:Math.min(Math.max(-r,-l),r),d=-h*h+u*(u+2*l)+c):u<=m?(h=0,u=Math.min(Math.max(-r,-l),r),d=u*(u+2*l)+c):(h=Math.max(0,-(a*r+o)),u=h>0?r:Math.min(Math.max(-r,-l),r),d=-h*h+u*(u+2*l)+c);else u=a>0?-r:r,h=Math.max(0,-(a*u+o)),d=-h*h+u*(u+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(Ra).addScaledVector(Ys,u),d}intersectSphere(e,t){if(e.radius<0)return null;Bi.subVectors(e.center,this.origin);const i=Bi.dot(this.direction),s=Bi.dot(Bi)-i*i,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,l;const c=1/this.direction.x,f=1/this.direction.y,h=1/this.direction.z,u=this.origin;return c>=0?(i=(e.min.x-u.x)*c,s=(e.max.x-u.x)*c):(i=(e.max.x-u.x)*c,s=(e.min.x-u.x)*c),f>=0?(r=(e.min.y-u.y)*f,a=(e.max.y-u.y)*f):(r=(e.max.y-u.y)*f,a=(e.min.y-u.y)*f),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),h>=0?(o=(e.min.z-u.z)*h,l=(e.max.z-u.z)*h):(o=(e.max.z-u.z)*h,l=(e.min.z-u.z)*h),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Bi)!==null}intersectTriangle(e,t,i,s,r){const a=this.origin,o=this.direction,l=o.x,c=o.y,f=o.z,h=e.x-a.x,u=e.y-a.y,d=e.z-a.z,m=t.x-a.x,_=t.y-a.y,p=t.z-a.z,v=i.x-a.x,S=i.y-a.y,E=i.z-a.z,T=Math.abs(l),w=Math.abs(c),y=Math.abs(f);let g,x,I,R,A,F,N,P,B,H,k,C;if(T>=w&&T>=y?(I=l,F=h,B=m,C=v,l>=0?(g=c,x=f,R=u,A=d,N=_,P=p,H=S,k=E):(g=f,x=c,R=d,A=u,N=p,P=_,H=E,k=S)):w>=y?(I=c,F=u,B=_,C=S,c>=0?(g=f,x=l,R=d,A=h,N=p,P=m,H=E,k=v):(g=l,x=f,R=h,A=d,N=m,P=p,H=v,k=E)):(I=f,F=d,B=p,C=E,f>=0?(g=l,x=c,R=h,A=u,N=m,P=_,H=v,k=S):(g=c,x=l,R=u,A=h,N=_,P=m,H=S,k=v)),I===0)return null;const L=g/I,G=x/I,$=1/I,ie=R-L*F,ne=A-G*F,X=N-L*B,te=P-G*B,ge=H-L*C,xe=k-G*C,re=ge*te-xe*X,Ie=ie*xe-ne*ge,lt=X*ne-te*ie;if(s){if(re<0||Ie<0||lt<0)return null}else if((re<0||Ie<0||lt<0)&&(re>0||Ie>0||lt>0))return null;const Ae=re+Ie+lt;if(Ae===0)return null;const Ve=$*(re*F+Ie*B+lt*C);return(Ae>0?Ve<0:Ve>0)?null:this.at(Ve/Ae,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class jd extends kr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new st(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Mn,this.combine=ah,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Jl=new Mt,pn=new Jd,Zs=new Ko,jl=new K,Js=new K,js=new K,Qs=new K,Ca=new K,er=new K,Ql=new K,tr=new K;class Gi extends ii{constructor(e=new an,t=new jd){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){er.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const f=o[l],h=r[l];f!==0&&(Ca.fromBufferAttribute(h,e),a?er.addScaledVector(Ca,f):er.addScaledVector(Ca.sub(t),f))}t.add(er)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Zs.copy(i.boundingSphere),Zs.applyMatrix4(r),pn.copy(e.ray).recast(e.near),!(Zs.containsPoint(pn.origin)===!1&&(pn.intersectSphere(Zs,jl)===null||pn.origin.distanceToSquared(jl)>(e.far-e.near)**2))&&(Jl.copy(r).invert(),pn.copy(e.ray).applyMatrix4(Jl),!(i.boundingBox!==null&&pn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,pn)))}_computeIntersections(e,t,i){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,f=r.attributes.uv1,h=r.attributes.normal,u=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,_=u.length;m<_;m++){const p=u[m],v=a[p.materialIndex],S=Math.max(p.start,d.start),E=Math.min(o.count,Math.min(p.start+p.count,d.start+d.count));for(let T=S,w=E;T<w;T+=3){const y=o.getX(T),g=o.getX(T+1),x=o.getX(T+2);s=ir(this,v,e,i,c,f,h,y,g,x),s&&(s.faceIndex=Math.floor(T/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const m=Math.max(0,d.start),_=Math.min(o.count,d.start+d.count);for(let p=m,v=_;p<v;p+=3){const S=o.getX(p),E=o.getX(p+1),T=o.getX(p+2);s=ir(this,a,e,i,c,f,h,S,E,T),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let m=0,_=u.length;m<_;m++){const p=u[m],v=a[p.materialIndex],S=Math.max(p.start,d.start),E=Math.min(l.count,Math.min(p.start+p.count,d.start+d.count));for(let T=S,w=E;T<w;T+=3){const y=T,g=T+1,x=T+2;s=ir(this,v,e,i,c,f,h,y,g,x),s&&(s.faceIndex=Math.floor(T/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const m=Math.max(0,d.start),_=Math.min(l.count,d.start+d.count);for(let p=m,v=_;p<v;p+=3){const S=p,E=p+1,T=p+2;s=ir(this,a,e,i,c,f,h,S,E,T),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}}function Qd(n,e,t,i,s,r,a,o){let l;if(e.side===Zt?l=i.intersectTriangle(a,r,s,!0,o):l=i.intersectTriangle(s,r,a,e.side===yn,o),l===null)return null;tr.copy(o),tr.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(tr);return c<t.near||c>t.far?null:{distance:c,point:tr.clone(),object:n}}function ir(n,e,t,i,s,r,a,o,l,c){n.getVertexPosition(o,Js),n.getVertexPosition(l,js),n.getVertexPosition(c,Qs);const f=Qd(n,e,t,i,Js,js,Qs,Ql);if(f){const h=new K;yi.getBarycoord(Ql,Js,js,Qs,h),s&&(f.uv=yi.getInterpolatedAttribute(s,o,l,c,h,new nt)),r&&(f.uv1=yi.getInterpolatedAttribute(r,o,l,c,h,new nt)),a&&(f.normal=yi.getInterpolatedAttribute(a,o,l,c,h,new K),f.normal.dot(i.direction)>0&&f.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new K,materialIndex:0};yi.getNormal(Js,js,Qs,u.normal),f.face=u,f.barycoord=h}return f}class Ph extends $t{constructor(e=null,t=1,i=1,s,r,a,o,l,c=Lt,f=Lt,h,u){super(null,a,o,l,c,f,s,r,h,u),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const mn=new Ko,ep=new nt(.5,.5),nr=new K;class Ur{constructor(e=new ji,t=new ji,i=new ji,s=new ji,r=new ji,a=new ji){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Mi,i=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],f=r[4],h=r[5],u=r[6],d=r[7],m=r[8],_=r[9],p=r[10],v=r[11],S=r[12],E=r[13],T=r[14],w=r[15];if(s[0].setComponents(c-a,d-f,v-m,w-S).normalize(),s[1].setComponents(c+a,d+f,v+m,w+S).normalize(),s[2].setComponents(c+o,d+h,v+_,w+E).normalize(),s[3].setComponents(c-o,d-h,v-_,w-E).normalize(),i)s[4].setComponents(l,u,p,T).normalize(),s[5].setComponents(c-l,d-u,v-p,w-T).normalize();else if(s[4].setComponents(c-l,d-u,v-p,w-T).normalize(),t===Mi)s[5].setComponents(c+l,d+u,v+p,w+T).normalize();else if(t===Dr)s[5].setComponents(l,u,p,T).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),mn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),mn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(mn)}intersectsSprite(e){mn.center.set(0,0,0);const t=ep.distanceTo(e.center);return mn.radius=.7071067811865476+t,mn.applyMatrix4(e.matrixWorld),this.intersectsSphere(mn)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(nr.x=s.normal.x>0?e.max.x:e.min.x,nr.y=s.normal.y>0?e.max.y:e.min.y,nr.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(nr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}const ec=new Mt;class Zo{constructor(){this.coordinateSystem=Mi,this._frustums=[],this._count=0}setFromArrayCamera(e){const t=e.cameras,i=this._frustums;for(let s=0;s<t.length;s++){const r=t[s];ec.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),i[s]===void 0&&(i[s]=new Ur),i[s].setFromProjectionMatrix(ec,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsObject(e))return!0;return!1}intersectsSprite(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsSprite(e))return!0;return!1}intersectsSphere(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsSphere(e))return!0;return!1}intersectsBox(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsBox(e))return!0;return!1}containsPoint(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;const t=this._frustums,i=e._frustums;for(let s=0;s<e._count;s++)t[s]===void 0&&(t[s]=new Ur),t[s].copy(i[s]);return this._count=e._count,this}clone(){return new Zo().copy(this)}}class Ih extends $t{constructor(e=[],t=jn,i,s,r,a,o,l,c,f){super(e,t,i,s,r,a,o,l,c,f),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class es extends $t{constructor(e,t,i=Ii,s,r,a,o=Lt,l=Lt,c,f=rn,h=1){if(f!==rn&&f!==sn)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:e,height:t,depth:h};super(u,s,r,a,o,l,f,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Yo(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class Lh extends es{constructor(e,t=Ii,i=jn,s,r,a=Lt,o=Lt,l,c=rn){const f={width:e,height:e,depth:1},h=[f,f,f,f,f,f];super(e,e,t,i,s,r,a,o,l,c),this.image=h,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Dh extends $t{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Cs extends an{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],f=[],h=[];let u=0,d=0;m("z","y","x",-1,-1,i,t,e,a,r,0),m("z","y","x",1,-1,i,t,-e,a,r,1),m("x","z","y",1,1,e,i,t,s,a,2),m("x","z","y",1,-1,e,i,-t,s,a,3),m("x","y","z",1,-1,e,t,i,s,r,4),m("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new wi(c,3)),this.setAttribute("normal",new wi(f,3)),this.setAttribute("uv",new wi(h,2));function m(_,p,v,S,E,T,w,y,g,x,I){const R=T/g,A=w/x,F=T/2,N=w/2,P=y/2,B=g+1,H=x+1;let k=0,C=0;const L=new K;for(let G=0;G<H;G++){const $=G*A-N;for(let ie=0;ie<B;ie++){const ne=ie*R-F;L[_]=ne*S,L[p]=$*E,L[v]=P,c.push(L.x,L.y,L.z),L[_]=0,L[p]=0,L[v]=y>0?1:-1,f.push(L.x,L.y,L.z),h.push(ie/g),h.push(1-G/x),k+=1}}for(let G=0;G<x;G++)for(let $=0;$<g;$++){const ie=u+$+B*G,ne=u+$+B*(G+1),X=u+($+1)+B*(G+1),te=u+($+1)+B*G;l.push(ie,ne,te),l.push(ne,X,te),C+=6}o.addGroup(d,C,I),d+=C,u+=k}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Cs(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Hr extends an{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(i),l=Math.floor(s),c=o+1,f=l+1,h=e/o,u=t/l,d=[],m=[],_=[],p=[];for(let v=0;v<f;v++){const S=v*u-a;for(let E=0;E<c;E++){const T=E*h-r;m.push(T,-S,0),_.push(0,0,1),p.push(E/o),p.push(1-v/l)}}for(let v=0;v<l;v++)for(let S=0;S<o;S++){const E=S+c*v,T=S+c*(v+1),w=S+1+c*(v+1),y=S+1+c*v;d.push(E,T,y),d.push(T,w,y)}this.setIndex(d),this.setAttribute("position",new wi(m,3)),this.setAttribute("normal",new wi(_,3)),this.setAttribute("uv",new wi(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Hr(e.width,e.height,e.widthSegments,e.heightSegments)}}function ts(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];if(tc(s))s.isRenderTargetTexture?(Ue("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone();else if(Array.isArray(s))if(tc(s[0])){const r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][i]=r}else e[t][i]=s.slice();else e[t][i]=s}}return e}function Xt(n){const e={};for(let t=0;t<n.length;t++){const i=ts(n[t]);for(const s in i)e[s]=i[s]}return e}function tc(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function tp(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Nh(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ke.workingColorSpace}const ip={clone:ts,merge:Xt};var np=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,sp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class wn extends kr{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=np,this.fragmentShader=sp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ts(e.uniforms),this.uniformsGroups=tp(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const i in e.uniforms){const s=e.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=t[s.value]||null;break;case"c":this.uniforms[i].value=new st().setHex(s.value);break;case"v2":this.uniforms[i].value=new nt().fromArray(s.value);break;case"v3":this.uniforms[i].value=new K().fromArray(s.value);break;case"v4":this.uniforms[i].value=new St().fromArray(s.value);break;case"m3":this.uniforms[i].value=new Oe().fromArray(s.value);break;case"m4":this.uniforms[i].value=new Mt().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class Po extends wn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class rp extends kr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=pd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class ap extends kr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const sr=new K,rr=new is,bi=new K;class Uh extends ii{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Mt,this.projectionMatrix=new Mt,this.projectionMatrixInverse=new Mt,this.coordinateSystem=Mi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(sr,rr,bi),bi.x===1&&bi.y===1&&bi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(sr,rr,bi.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(sr,rr,bi),bi.x===1&&bi.y===1&&bi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(sr,rr,bi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Zi=new K,ic=new nt,nc=new nt;class Ti extends Uh{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Co*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(la*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Co*2*Math.atan(Math.tan(la*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Zi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Zi.x,Zi.y).multiplyScalar(-e/Zi.z),Zi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Zi.x,Zi.y).multiplyScalar(-e/Zi.z)}getViewSize(e,t){return this.getViewBounds(e,ic,nc),t.subVectors(nc,ic)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(la*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*i/c,s*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class Fh extends Uh{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,f=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=f*this.view.offsetY,l=o-f*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const zn=-90,Gn=1;class Io extends ii{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Ti(zn,Gn,e,t);s.layers=this.layers,this.add(s);const r=new Ti(zn,Gn,e,t);r.layers=this.layers,this.add(r);const a=new Ti(zn,Gn,e,t);a.layers=this.layers,this.add(a);const o=new Ti(zn,Gn,e,t);o.layers=this.layers,this.add(o);const l=new Ti(zn,Gn,e,t);l.layers=this.layers,this.add(l);const c=new Ti(zn,Gn,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===Mi)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Dr)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,f]=this.children,h=e.getRenderTarget(),u=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;const _=i.texture.mipmapsAutoUpdate;i.texture.mipmapsAutoUpdate=!1;let p=!1;e.isWebGLRenderer===!0?p=e.state.buffers.depth.getReversed():p=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,1,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,2,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,3,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,4,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),i.texture.mipmapsAutoUpdate=_,e.setRenderTarget(i,5,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,f),e.setRenderTarget(h,u,d),e.xr.enabled=m,i.texture.needsPMREMUpdate=!0}}class op extends Ti{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}}function sc(n,e,t,i){const s=lp(i);switch(t){case _h:return n*e;case Vo:return n*e/s.components*s.byteLength;case Wo:return n*e/s.components*s.byteLength;case Sn:return n*e*2/s.components*s.byteLength;case Xo:return n*e*2/s.components*s.byteLength;case yh:return n*e*3/s.components*s.byteLength;case Si:return n*e*4/s.components*s.byteLength;case qo:return n*e*4/s.components*s.byteLength;case vr:case xr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case _r:case yr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Qa:case to:return Math.max(n,16)*Math.max(e,8)/4;case ja:case eo:return Math.max(n,8)*Math.max(e,8)/2;case io:case no:case ro:case ao:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case so:case Cr:case oo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case lo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case co:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case ho:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case uo:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case fo:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case po:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case mo:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case go:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case vo:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case xo:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case _o:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case yo:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case So:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Mo:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case wo:case bo:case Eo:return Math.ceil(n/4)*Math.ceil(e/4)*16;case To:case Ao:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Pr:case Ro:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function lp(n){switch(n){case ti:case mh:return{byteLength:1,components:1};case bs:case gh:case Li:return{byteLength:2,components:1};case zo:case Go:return{byteLength:2,components:4};case Ii:case Ho:case Ci:return{byteLength:4,components:1};case vh:case xh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ko}}));typeof window<"u"&&(window.__THREE__?Ue("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ko);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Oh(){let n=null,e=!1,t=null,i=null;function s(r,a){i=n.requestAnimationFrame(s),t(r,a)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function cp(n){const e=new WeakMap;function t(o,l){const c=o.array,f=o.usage,h=c.byteLength,u=n.createBuffer();n.bindBuffer(l,u),n.bufferData(l,c,f),o.onUploadCallback();let d;if(c instanceof Float32Array)d=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=n.HALF_FLOAT:d=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=n.SHORT;else if(c instanceof Uint32Array)d=n.UNSIGNED_INT;else if(c instanceof Int32Array)d=n.INT;else if(c instanceof Int8Array)d=n.BYTE;else if(c instanceof Uint8Array)d=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:h}}function i(o,l,c){const f=l.array,h=l.updateRanges;if(n.bindBuffer(c,o),h.length===0)n.bufferSubData(c,0,f);else{h.sort((d,m)=>d.start-m.start);let u=0;for(let d=1;d<h.length;d++){const m=h[u],_=h[d];_.start<=m.start+m.count+1?m.count=Math.max(m.count,_.start+_.count-m.start):(++u,h[u]=_)}h.length=u+1;for(let d=0,m=h.length;d<m;d++){const _=h[d];n.bufferSubData(c,_.start*f.BYTES_PER_ELEMENT,f,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const f=e.get(o);(!f||f.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var hp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,up=`#ifdef USE_ALPHAHASH
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
#endif`,fp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,dp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,pp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,mp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,gp=`#ifdef USE_AOMAP
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
#endif`,vp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,xp=`#ifdef USE_BATCHING
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
#endif`,_p=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,yp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Sp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Mp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,wp=`#ifdef USE_IRIDESCENCE
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
#endif`,bp=`#ifdef USE_BUMPMAP
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
#endif`,Ep=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Tp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ap=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Rp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Cp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Pp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Ip=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Lp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Dp=`#define PI 3.141592653589793
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
} // validated`,Np=`vec3 transformedNormal = objectNormal;
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
#endif`,Up=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Fp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Op=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Bp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,kp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Hp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,zp=`#ifdef USE_ENVMAP
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
#endif`,Gp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,Vp=`#ifdef USE_ENVMAP
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
#endif`,Wp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Xp=`#ifdef USE_ENVMAP
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
#endif`,qp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,$p=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Yp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Kp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Zp=`#ifdef USE_GRADIENTMAP
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
}`,Jp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,jp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Qp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,em=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,tm=`#ifdef USE_ENVMAP
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
#endif`,im=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,nm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,sm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,rm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,am=`PhysicalMaterial material;
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
#endif`,om=`uniform sampler2D dfgLUT;
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
}`,lm=`
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
#endif`,cm=`#if defined( RE_IndirectDiffuse )
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
#endif`,hm=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,um=`#if NUM_LIGHT_PROBE_GRIDS > 0
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
#endif`,fm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,dm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,pm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,mm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,gm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,vm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,xm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,_m=`#if defined( USE_POINTS_UV )
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
#endif`,ym=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Sm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Mm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,wm=`#if defined( USE_MORPHCOLORS )
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
#endif`,bm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Em=`#ifdef USE_MORPHTARGETS
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
#endif`,Tm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Am=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Rm=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Cm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Pm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Im=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Lm=`#ifdef USE_NORMALMAP
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
#endif`,Dm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Nm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Um=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Fm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Om=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Bm=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,km=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Hm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,zm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Gm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Vm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Wm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Xm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,qm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,$m=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Ym=`float getShadowMask() {
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
}`,Km=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Zm=`#ifdef USE_SKINNING
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
#endif`,Jm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,jm=`#ifdef USE_SKINNING
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
#endif`,Qm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,eg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ig=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,ng=`#ifdef USE_TRANSMISSION
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
#endif`,sg=`#ifdef USE_TRANSMISSION
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
#endif`,rg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ag=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,og=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,lg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const cg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,hg=`uniform sampler2D t2D;
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
}`,ug=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,fg=`uniform float backgroundBlurriness;
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
}`,dg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,pg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,mg=`#include <common>
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
}`,gg=`#if DEPTH_PACKING == 3200
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
}`,vg=`#define DISTANCE
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
}`,xg=`#define DISTANCE
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
}`,_g=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,yg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Sg=`uniform float scale;
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
}`,Mg=`uniform vec3 diffuse;
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
}`,wg=`#include <common>
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
}`,bg=`uniform vec3 diffuse;
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
}`,Eg=`#define LAMBERT
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
}`,Tg=`#define LAMBERT
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
}`,Ag=`#define MATCAP
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
}`,Rg=`#define MATCAP
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
}`,Cg=`#define NORMAL
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
}`,Pg=`#define NORMAL
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
}`,Ig=`#define PHONG
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
}`,Lg=`#define PHONG
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
}`,Dg=`#define STANDARD
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
}`,Ng=`#define STANDARD
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
}`,Ug=`#define TOON
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
}`,Fg=`#define TOON
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
}`,Og=`uniform float size;
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
}`,Bg=`uniform vec3 diffuse;
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
}`,kg=`#include <common>
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
}`,Hg=`uniform vec3 color;
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
}`,zg=`uniform float rotation;
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
}`,Gg=`uniform vec3 diffuse;
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
}`,Ge={alphahash_fragment:hp,alphahash_pars_fragment:up,alphamap_fragment:fp,alphamap_pars_fragment:dp,alphatest_fragment:pp,alphatest_pars_fragment:mp,aomap_fragment:gp,aomap_pars_fragment:vp,batching_pars_vertex:xp,batching_vertex:_p,begin_vertex:yp,beginnormal_vertex:Sp,bsdfs:Mp,iridescence_fragment:wp,bumpmap_pars_fragment:bp,clipping_planes_fragment:Ep,clipping_planes_pars_fragment:Tp,clipping_planes_pars_vertex:Ap,clipping_planes_vertex:Rp,color_fragment:Cp,color_pars_fragment:Pp,color_pars_vertex:Ip,color_vertex:Lp,common:Dp,defaultnormal_vertex:Np,displacementmap_pars_vertex:Up,displacementmap_vertex:Fp,emissivemap_fragment:Op,emissivemap_pars_fragment:Bp,colorspace_fragment:kp,colorspace_pars_fragment:Hp,envmap_fragment:zp,envmap_common_pars_fragment:Gp,envmap_pars_fragment:Vp,envmap_pars_vertex:Wp,envmap_physical_pars_fragment:tm,envmap_vertex:Xp,fog_vertex:qp,fog_pars_vertex:$p,fog_fragment:Yp,fog_pars_fragment:Kp,gradientmap_pars_fragment:Zp,lightmap_pars_fragment:Jp,lights_lambert_fragment:jp,lights_lambert_pars_fragment:Qp,lights_pars_begin:em,lights_toon_fragment:im,lights_toon_pars_fragment:nm,lights_phong_fragment:sm,lights_phong_pars_fragment:rm,lights_physical_fragment:am,lights_physical_pars_fragment:om,lights_fragment_begin:lm,lights_fragment_maps:cm,lights_fragment_end:hm,lightprobes_pars_fragment:um,logdepthbuf_fragment:fm,logdepthbuf_pars_fragment:dm,logdepthbuf_pars_vertex:pm,logdepthbuf_vertex:mm,map_fragment:gm,map_pars_fragment:vm,map_particle_fragment:xm,map_particle_pars_fragment:_m,metalnessmap_fragment:ym,metalnessmap_pars_fragment:Sm,morphinstance_vertex:Mm,morphcolor_vertex:wm,morphnormal_vertex:bm,morphtarget_pars_vertex:Em,morphtarget_vertex:Tm,normal_fragment_begin:Am,normal_fragment_maps:Rm,normal_pars_fragment:Cm,normal_pars_vertex:Pm,normal_vertex:Im,normalmap_pars_fragment:Lm,clearcoat_normal_fragment_begin:Dm,clearcoat_normal_fragment_maps:Nm,clearcoat_pars_fragment:Um,iridescence_pars_fragment:Fm,opaque_fragment:Om,packing:Bm,premultiplied_alpha_fragment:km,project_vertex:Hm,dithering_fragment:zm,dithering_pars_fragment:Gm,roughnessmap_fragment:Vm,roughnessmap_pars_fragment:Wm,shadowmap_pars_fragment:Xm,shadowmap_pars_vertex:qm,shadowmap_vertex:$m,shadowmask_pars_fragment:Ym,skinbase_vertex:Km,skinning_pars_vertex:Zm,skinning_vertex:Jm,skinnormal_vertex:jm,specularmap_fragment:Qm,specularmap_pars_fragment:eg,tonemapping_fragment:tg,tonemapping_pars_fragment:ig,transmission_fragment:ng,transmission_pars_fragment:sg,uv_pars_fragment:rg,uv_pars_vertex:ag,uv_vertex:og,worldpos_vertex:lg,background_vert:cg,background_frag:hg,backgroundCube_vert:ug,backgroundCube_frag:fg,cube_vert:dg,cube_frag:pg,depth_vert:mg,depth_frag:gg,distance_vert:vg,distance_frag:xg,equirect_vert:_g,equirect_frag:yg,linedashed_vert:Sg,linedashed_frag:Mg,meshbasic_vert:wg,meshbasic_frag:bg,meshlambert_vert:Eg,meshlambert_frag:Tg,meshmatcap_vert:Ag,meshmatcap_frag:Rg,meshnormal_vert:Cg,meshnormal_frag:Pg,meshphong_vert:Ig,meshphong_frag:Lg,meshphysical_vert:Dg,meshphysical_frag:Ng,meshtoon_vert:Ug,meshtoon_frag:Fg,points_vert:Og,points_frag:Bg,shadow_vert:kg,shadow_frag:Hg,sprite_vert:zg,sprite_frag:Gg},ye={common:{diffuse:{value:new st(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Oe}},envmap:{envMap:{value:null},envMapRotation:{value:new Oe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Oe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Oe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Oe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Oe},normalScale:{value:new nt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Oe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Oe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Oe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Oe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new st(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new st(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0},uvTransform:{value:new Oe}},sprite:{diffuse:{value:new st(16777215)},opacity:{value:1},center:{value:new nt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}}},Ai={basic:{uniforms:Xt([ye.common,ye.specularmap,ye.envmap,ye.aomap,ye.lightmap,ye.fog]),vertexShader:Ge.meshbasic_vert,fragmentShader:Ge.meshbasic_frag},lambert:{uniforms:Xt([ye.common,ye.specularmap,ye.envmap,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.fog,ye.lights,{emissive:{value:new st(0)},envMapIntensity:{value:1}}]),vertexShader:Ge.meshlambert_vert,fragmentShader:Ge.meshlambert_frag},phong:{uniforms:Xt([ye.common,ye.specularmap,ye.envmap,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.fog,ye.lights,{emissive:{value:new st(0)},specular:{value:new st(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ge.meshphong_vert,fragmentShader:Ge.meshphong_frag},standard:{uniforms:Xt([ye.common,ye.envmap,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.roughnessmap,ye.metalnessmap,ye.fog,ye.lights,{emissive:{value:new st(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag},toon:{uniforms:Xt([ye.common,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.gradientmap,ye.fog,ye.lights,{emissive:{value:new st(0)}}]),vertexShader:Ge.meshtoon_vert,fragmentShader:Ge.meshtoon_frag},matcap:{uniforms:Xt([ye.common,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.fog,{matcap:{value:null}}]),vertexShader:Ge.meshmatcap_vert,fragmentShader:Ge.meshmatcap_frag},points:{uniforms:Xt([ye.points,ye.fog]),vertexShader:Ge.points_vert,fragmentShader:Ge.points_frag},dashed:{uniforms:Xt([ye.common,ye.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ge.linedashed_vert,fragmentShader:Ge.linedashed_frag},depth:{uniforms:Xt([ye.common,ye.displacementmap]),vertexShader:Ge.depth_vert,fragmentShader:Ge.depth_frag},normal:{uniforms:Xt([ye.common,ye.bumpmap,ye.normalmap,ye.displacementmap,{opacity:{value:1}}]),vertexShader:Ge.meshnormal_vert,fragmentShader:Ge.meshnormal_frag},sprite:{uniforms:Xt([ye.sprite,ye.fog]),vertexShader:Ge.sprite_vert,fragmentShader:Ge.sprite_frag},background:{uniforms:{uvTransform:{value:new Oe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ge.background_vert,fragmentShader:Ge.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Oe}},vertexShader:Ge.backgroundCube_vert,fragmentShader:Ge.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ge.cube_vert,fragmentShader:Ge.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ge.equirect_vert,fragmentShader:Ge.equirect_frag},distance:{uniforms:Xt([ye.common,ye.displacementmap,{referencePosition:{value:new K},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ge.distance_vert,fragmentShader:Ge.distance_frag},shadow:{uniforms:Xt([ye.lights,ye.fog,{color:{value:new st(0)},opacity:{value:1}}]),vertexShader:Ge.shadow_vert,fragmentShader:Ge.shadow_frag}};Ai.physical={uniforms:Xt([Ai.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Oe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Oe},clearcoatNormalScale:{value:new nt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Oe},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new Oe},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Oe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Oe},sheen:{value:0},sheenColor:{value:new st(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Oe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Oe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Oe},transmissionSamplerSize:{value:new nt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Oe},attenuationDistance:{value:0},attenuationColor:{value:new st(0)},specularColor:{value:new st(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Oe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Oe},anisotropyVector:{value:new nt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Oe}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag};const ar={r:0,b:0,g:0},Vg=new Mt,Bh=new Oe;Bh.set(-1,0,0,0,1,0,0,0,1);function Wg(n,e,t,i,s,r){const a=new st(0);let o=s===!0?0:1,l,c,f=null,h=0,u=null;function d(S){let E=S.isScene===!0?S.background:null;if(E&&E.isTexture){const T=S.backgroundBlurriness>0;E=e.get(E,T)}return E}function m(S){let E=!1;const T=d(S);T===null?p(a,o):T&&T.isColor&&(p(T,1),E=!0);const w=n.xr.getEnvironmentBlendMode();w==="additive"?t.buffers.color.setClear(0,0,0,1,r):w==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(n.autoClear||E)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function _(S,E){const T=d(E);T&&T.isCubeTexture?(c===void 0&&(c=new Gi(new Cs(1,1,1),new wn({name:"BackgroundCubeMaterial",uniforms:ts(Ai.backgroundCube.uniforms),vertexShader:Ai.backgroundCube.vertexShader,fragmentShader:Ai.backgroundCube.fragmentShader,side:Zt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(w,y,g){this.matrixWorld.copyPosition(g.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=T,c.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Vg.makeRotationFromEuler(E.backgroundRotation)).transpose(),T.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Bh),c.material.toneMapped=Ke.getTransfer(T.colorSpace)!==ot,(f!==T||h!==T.version||u!==n.toneMapping)&&(c.material.needsUpdate=!0,f=T,h=T.version,u=n.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null)):T&&T.isTexture&&(l===void 0&&(l=new Gi(new Hr(2,2),new wn({name:"BackgroundMaterial",uniforms:ts(Ai.background.uniforms),vertexShader:Ai.background.vertexShader,fragmentShader:Ai.background.fragmentShader,side:yn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=T,l.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,l.material.toneMapped=Ke.getTransfer(T.colorSpace)!==ot,T.matrixAutoUpdate===!0&&T.updateMatrix(),l.material.uniforms.uvTransform.value.copy(T.matrix),(f!==T||h!==T.version||u!==n.toneMapping)&&(l.material.needsUpdate=!0,f=T,h=T.version,u=n.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function p(S,E){S.getRGB(ar,Nh(n)),t.buffers.color.setClear(ar.r,ar.g,ar.b,E,r)}function v(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(S,E=1){a.set(S),o=E,p(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(S){o=S,p(a,o)},render:m,addToRenderList:_,dispose:v}}function Xg(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=u(null);let r=s,a=!1;function o(A,F,N,P,B){let H=!1;const k=h(A,P,N,F);r!==k&&(r=k,c(r.object)),H=d(A,P,N,B),H&&m(A,P,N,B),B!==null&&e.update(B,n.ELEMENT_ARRAY_BUFFER),(H||a)&&(a=!1,T(A,F,N,P),B!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(B).buffer))}function l(){return n.createVertexArray()}function c(A){return n.bindVertexArray(A)}function f(A){return n.deleteVertexArray(A)}function h(A,F,N,P){const B=P.wireframe===!0;let H=i[F.id];H===void 0&&(H={},i[F.id]=H);const k=A.isInstancedMesh===!0?A.id:0;let C=H[k];C===void 0&&(C={},H[k]=C);let L=C[N.id];L===void 0&&(L={},C[N.id]=L);let G=L[B];return G===void 0&&(G=u(l()),L[B]=G),G}function u(A){const F=[],N=[],P=[];for(let B=0;B<t;B++)F[B]=0,N[B]=0,P[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:N,attributeDivisors:P,object:A,attributes:{},index:null}}function d(A,F,N,P){const B=r.attributes,H=F.attributes;let k=0;const C=N.getAttributes();for(const L in C)if(C[L].location>=0){const $=B[L];let ie=H[L];if(ie===void 0&&(L==="instanceMatrix"&&A.instanceMatrix&&(ie=A.instanceMatrix),L==="instanceColor"&&A.instanceColor&&(ie=A.instanceColor)),$===void 0||$.attribute!==ie||ie&&$.data!==ie.data)return!0;k++}return r.attributesNum!==k||r.index!==P}function m(A,F,N,P){const B={},H=F.attributes;let k=0;const C=N.getAttributes();for(const L in C)if(C[L].location>=0){let $=H[L];$===void 0&&(L==="instanceMatrix"&&A.instanceMatrix&&($=A.instanceMatrix),L==="instanceColor"&&A.instanceColor&&($=A.instanceColor));const ie={};ie.attribute=$,$&&$.data&&(ie.data=$.data),B[L]=ie,k++}r.attributes=B,r.attributesNum=k,r.index=P}function _(){const A=r.newAttributes;for(let F=0,N=A.length;F<N;F++)A[F]=0}function p(A){v(A,0)}function v(A,F){const N=r.newAttributes,P=r.enabledAttributes,B=r.attributeDivisors;N[A]=1,P[A]===0&&(n.enableVertexAttribArray(A),P[A]=1),B[A]!==F&&(n.vertexAttribDivisor(A,F),B[A]=F)}function S(){const A=r.newAttributes,F=r.enabledAttributes;for(let N=0,P=F.length;N<P;N++)F[N]!==A[N]&&(n.disableVertexAttribArray(N),F[N]=0)}function E(A,F,N,P,B,H,k){k===!0?n.vertexAttribIPointer(A,F,N,B,H):n.vertexAttribPointer(A,F,N,P,B,H)}function T(A,F,N,P){_();const B=P.attributes,H=N.getAttributes(),k=F.defaultAttributeValues;for(const C in H){const L=H[C];if(L.location>=0){let G=B[C];if(G===void 0&&(C==="instanceMatrix"&&A.instanceMatrix&&(G=A.instanceMatrix),C==="instanceColor"&&A.instanceColor&&(G=A.instanceColor)),G!==void 0){const $=G.normalized,ie=G.itemSize,ne=e.get(G);if(ne===void 0)continue;const X=ne.buffer,te=ne.type,ge=ne.bytesPerElement,xe=te===n.INT||te===n.UNSIGNED_INT||G.gpuType===Ho;if(G.isInterleavedBufferAttribute){const re=G.data,Ie=re.isInterleavedBuffer===!0?re.stride:re.itemSize,lt=G.offset;if(re.isInstancedInterleavedBuffer||re.isInstancedBufferAttribute){for(let Ae=0;Ae<L.locationSize;Ae++)v(L.location+Ae,re.meshPerAttribute);A.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=re.meshPerAttribute*re.count)}else for(let Ae=0;Ae<L.locationSize;Ae++)p(L.location+Ae);n.bindBuffer(n.ARRAY_BUFFER,X);for(let Ae=0;Ae<L.locationSize;Ae++)E(L.location+Ae,ie/L.locationSize,te,$,Ie*ge,(lt+ie/L.locationSize*Ae)*ge,xe)}else{if(G.isInstancedBufferAttribute){for(let re=0;re<L.locationSize;re++)v(L.location+re,G.meshPerAttribute);A.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=G.meshPerAttribute*G.count)}else for(let re=0;re<L.locationSize;re++)p(L.location+re);n.bindBuffer(n.ARRAY_BUFFER,X);for(let re=0;re<L.locationSize;re++)E(L.location+re,ie/L.locationSize,te,$,ie*ge,ie/L.locationSize*re*ge,xe)}}else if(k!==void 0){const $=k[C];if($!==void 0)switch($.length){case 2:n.vertexAttrib2fv(L.location,$);break;case 3:n.vertexAttrib3fv(L.location,$);break;case 4:n.vertexAttrib4fv(L.location,$);break;default:n.vertexAttrib1fv(L.location,$)}}}}S()}function w(){I();for(const A in i){const F=i[A];for(const N in F){const P=F[N];for(const B in P){const H=P[B];for(const k in H)f(H[k].object),delete H[k];delete P[B]}}delete i[A]}}function y(A){if(i[A.id]===void 0)return;const F=i[A.id];for(const N in F){const P=F[N];for(const B in P){const H=P[B];for(const k in H)f(H[k].object),delete H[k];delete P[B]}}delete i[A.id]}function g(A){for(const F in i){const N=i[F];for(const P in N){const B=N[P];if(B[A.id]===void 0)continue;const H=B[A.id];for(const k in H)f(H[k].object),delete H[k];delete B[A.id]}}}function x(A){for(const F in i){const N=i[F],P=A.isInstancedMesh===!0?A.id:0,B=N[P];if(B!==void 0){for(const H in B){const k=B[H];for(const C in k)f(k[C].object),delete k[C];delete B[H]}delete N[P],Object.keys(N).length===0&&delete i[F]}}}function I(){R(),a=!0,r!==s&&(r=s,c(r.object))}function R(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:I,resetDefaultState:R,dispose:w,releaseStatesOfGeometry:y,releaseStatesOfObject:x,releaseStatesOfProgram:g,initAttributes:_,enableAttribute:p,disableUnusedAttributes:S}}function qg(n,e,t){let i;function s(l){i=l}function r(l,c){n.drawArrays(i,l,c),t.update(c,i,1)}function a(l,c,f){f!==0&&(n.drawArraysInstanced(i,l,c,f),t.update(c,i,f))}function o(l,c,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,f);let u=0;for(let d=0;d<f;d++)u+=c[d];t.update(u,i,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function $g(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const g=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(g.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(g){return!(g!==Si&&i.convert(g)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(g){const x=g===Li&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(g!==ti&&g!==Ci&&!x&&i.convert(g)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE))}function l(g){if(g==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";g="mediump"}return g==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const f=l(c);f!==c&&(Ue("WebGLRenderer:",c,"not supported, using",f,"instead."),c=f);const h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),u=t.logarithmicDepthBuffer===!0&&h===!1;t.reversedDepthBuffer===!0&&h===!1&&Ue("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),t.logarithmicDepthBuffer===!0&&h===!0&&Ue("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");const d=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),p=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),v=n.getParameter(n.MAX_VERTEX_ATTRIBS),S=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),E=n.getParameter(n.MAX_VARYING_VECTORS),T=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),w=n.getParameter(n.MAX_SAMPLES),y=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:h,maxTextures:d,maxVertexTextures:m,maxTextureSize:_,maxCubemapSize:p,maxAttributes:v,maxVertexUniforms:S,maxVaryings:E,maxFragmentUniforms:T,maxSamples:w,samples:y}}function Yg(n){const e=this;let t=null,i=0,s=!1,r=!1;const a=new ji,o=new Oe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,u){const d=h.length!==0||u||i!==0||s;return s=u,i=h.length,d},this.beginShadows=function(){r=!0,f(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,u){t=f(h,u,0)},this.setState=function(h,u,d){const m=h.clippingPlanes,_=h.clipIntersection,p=h.clipShadows,v=n.get(h);if(!s||m===null||m.length===0||r&&!p)r?f(null):c();else{const S=r?0:i,E=S*4;let T=v.clippingState||null;l.value=T,T=f(m,u,E,d);for(let w=0;w!==E;++w)T[w]=t[w];v.clippingState=T,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function f(h,u,d,m){const _=h!==null?h.length:0;let p=null;if(_!==0){if(p=l.value,m!==!0||p===null){const v=d+_*4,S=u.matrixWorldInverse;o.getNormalMatrix(S),(p===null||p.length<v)&&(p=new Float32Array(v));for(let E=0,T=d;E!==_;++E,T+=4)a.copy(h[E]).applyMatrix4(S,o),a.normal.toArray(p,T),p[T+3]=a.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,p}}class Jo extends Pi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Ih(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Cs(5,5,5),r=new wn({name:"CubemapFromEquirect",uniforms:ts(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Zt,blending:Kn});r.uniforms.tEquirect.value=t;const a=new Gi(s,r),o=t.minFilter;return t.minFilter===nn&&(t.minFilter=Kt),new Io(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}}const rc=256,Kg=3,Zg=20,kh=256,Hh=16,Jg=3,jg=new K,Qg=new st;class Fr{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new Io(1,10,null),this._boxMesh=new Gi(new Cs(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,i=.1,s=100,r={}){const{size:a=256,position:o=jg}=r,l=this._renderer;this._setSize(a);const c=this._allocateTarget(),f=this._getSourceTarget(!0);t>0&&(f.texture.mipmapsAutoUpdate=!1);const h=l.autoClear,u=l.autoClearColor,d=l.autoClearDepth,m=l.autoClearStencil,_=e.background;l.autoClear=!0,l.autoClearColor=!0,l.autoClearDepth=!0,l.autoClearStencil=!0,_===null&&(e.background=l.getClearColor(Qg));const p=new Io(i,s,f);return p.position.copy(o),p.update(l,e),l.autoClear=h,l.autoClearColor=u,l.autoClearDepth=d,l.autoClearStencil=m,e.background=_,t>0&&(f.texture.mipmapsAutoUpdate=!0,this._blur(c,t)),this._applyPMREM(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=lc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=oc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(rc,Rd(e))}_fromTexture(e,t){e.mapping===jn||e.mapping===ws?this._setSize(e.image.length===0?rc:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);const i=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(i),i}_allocateTarget(){const e=this._cubeSize,t=ac(e,!1,!1),i=Math.log2(e)-Kg;for(let s=0;s<=i;s++)t.texture.mipmaps.push({width:e>>s,height:e>>s});return t.texture.name="PMREM",t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){const t=this._cubeSize,i=this._sourceTarget;return(i===null||i.width!==t||e&&i.depthBuffer===!1)&&(i!==null&&i.dispose(),this._sourceTarget=ac(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,i){const s=this._boxMesh,r=this._cubeCamera;s.material=i,r.renderTarget=e,r.activeMipmapLevel=t;const a=e.width>>t;e.viewport.set(0,0,a,a),r.update(this._renderer,s),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===jn||e.mapping===ws?(this._cubemapMaterial===null&&(this._cubemapMaterial=lc()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=oc()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(e){this._ggxMaterial===null&&(this._ggxMaterial=e0(),this._integrationMaterial=t0());const t=this._cubeSize,i=e.texture.mipmaps.length-1,s=this._ggxMaterial.uniforms;s.envMap.value=this._sourceTarget.texture;const r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(t/Hh);for(let a=0;a<=i;a++){const o=Fr.lodToRoughness(a,i);if(a>i-Jg)r.roughness.value=o,this._renderCube(e,a,this._integrationMaterial);else{const l=o>0?Math.log2(t)+.5*Math.log2(6/(kh*Math.pow(o,4)))+.5:0;s.roughness.value=o,s.lodBias.value=l,this._renderCube(e,a,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=i0());const i=this._blurMaterial,s=i.uniforms,r=this._sourceTarget;s.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,s.envMap.value=r.texture,this._renderCube(e,0,i),s.envMap.value=e.texture,this._renderCube(r,0,i)}}function ac(n,e,t){return new Jo(n,{minFilter:nn,generateMipmaps:e,type:Li,colorSpace:Es,depthBuffer:t})}function Ps(n,e,t){return new wn({name:n,uniforms:e,vertexShader:Ge.cube_vert,fragmentShader:t,side:Zt,blending:Kn,depthTest:!1,depthWrite:!1})}function e0(){return Ps("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${kh}u

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
	`)}function t0(){return Ps("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:Hh}},`

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
	`)}function i0(){return Ps("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${Zg}
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
	`)}function oc(){return Ps("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

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
	`)}function lc(){return Ps("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function n0(n){let e=new WeakMap,t=new WeakMap,i=null;function s(u,d=!1){return u==null?null:d?a(u):r(u)}function r(u){if(u&&u.isTexture){const d=u.mapping;if(d===sa||d===ra)if(e.has(u)){const m=e.get(u).texture;return o(m,u.mapping)}else{const m=u.image;if(m&&m.height>0){const _=new Jo(m.height);return _.fromEquirectangularTexture(n,u),e.set(u,_),u.addEventListener("dispose",c),o(_.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture&&u.isPMREMTexture!==!0){const d=u.mapping,m=d===sa||d===ra,_=d===jn||d===ws;if(m||_){let p=t.get(u);const v=p!==void 0?p.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==v)return i===null&&(i=new Fr(n)),p=m?i.fromEquirectangular(u,p):i.fromCubemap(u,p),p.texture.pmremVersion=u.pmremVersion,t.set(u,p),p.texture;if(p!==void 0)return p.texture;{const S=u.image;return m&&S&&S.height>0||_&&S&&l(S)?(i===null&&(i=new Fr(n)),p=m?i.fromEquirectangular(u):i.fromCubemap(u),p.texture.pmremVersion=u.pmremVersion,t.set(u,p),u.addEventListener("dispose",f),p.texture):null}}}return u}function o(u,d){return d===sa?u.mapping=jn:d===ra&&(u.mapping=ws),u}function l(u){let d=0;const m=6;for(let _=0;_<m;_++)u[_]!==void 0&&d++;return d===m}function c(u){const d=u.target;d.removeEventListener("dispose",c);const m=e.get(d);m!==void 0&&(e.delete(d),m.dispose())}function f(u){const d=u.target;d.removeEventListener("dispose",f);const m=t.get(d);m!==void 0&&(t.delete(d),m.dispose())}function h(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:h}}function s0(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&Sr("WebGLRenderer: "+i+" extension not supported."),s}}}function r0(n,e,t,i){const s={},r=new WeakMap,a=new FinalizationRegistry(m=>delete s[m]);function o(m){l(m.target)}function l(m){m.index!==null&&e.remove(m.index);for(const p in m.attributes)e.remove(m.attributes[p]);m.removeEventListener("dispose",o),delete s[m.id],a.unregister(m);const _=r.get(m);_&&(e.remove(_),r.delete(m)),i.releaseStatesOfGeometry(m),m.isInstancedBufferGeometry===!0&&delete m._maxInstanceCount,t.memory.geometries--}function c(m,_){return s[_.id]!==void 0||(_.addEventListener("dispose",o),s[_.id]=new WeakRef(_),a.register(_,_.id,_),t.memory.geometries++),_}function f(m){const _=m.attributes;for(const p in _)e.update(_[p],n.ARRAY_BUFFER)}function h(m){const _=m.index,p=m.attributes.position;let v=0;if(p===void 0)return;const S=_!==null?_.array.length:p.array.length/3-1,E=p.count>=65535?Ch:Rh,T=new E(Math.ceil(S/3)*6,1),w=T.array;if(_!==null){const g=_.array;v=_.version;for(let x=0,I=0;x<S;x+=3){const R=g[x+0],A=g[x+1],F=g[x+2];w[I++]=R,w[I++]=A,w[I++]=A,w[I++]=F,w[I++]=F,w[I++]=R}}else{v=p.version;for(let g=0,x=0;g<S;g+=3){const I=g+0,R=g+1,A=g+2;w[x++]=I,w[x++]=R,w[x++]=R,w[x++]=A,w[x++]=A,w[x++]=I}}T.version=v;const y=r.get(m);y&&e.remove(y),r.set(m,T)}function u(m){const _=r.get(m);if(_){const p=m.index;p!==null&&_.version<p.version&&h(m)}else h(m);return r.get(m)}function d(){for(const m in s){const _=s[m].deref();_!==void 0&&l(_)}}return{get:c,update:f,getWireframeAttribute:u,dispose:d}}function a0(n,e,t){let i;function s(h){i=h}let r,a;function o(h){r=h.type,a=h.bytesPerElement}function l(h,u){n.drawElements(i,u,r,h*a),t.update(u,i,1)}function c(h,u,d){d!==0&&(n.drawElementsInstanced(i,u,r,h*a,d),t.update(u,i,d))}function f(h,u,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,r,h,0,d);let _=0;for(let p=0;p<d;p++)_+=u[p];t.update(_,i,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=f}function o0(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:it("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function l0(n,e,t){const i=new WeakMap,s=new St;function r(a,o,l){const c=a.morphTargetInfluences,f=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=f!==void 0?f.length:0;let u=i.get(o);if(u===void 0||u.count!==h){let R=function(){x.dispose(),i.delete(o),o.removeEventListener("dispose",R)};var d=R;u!==void 0&&u.texture.dispose();const m=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,p=o.morphAttributes.color!==void 0,v=o.morphAttributes.position||[],S=o.morphAttributes.normal||[],E=o.morphAttributes.color||[];let T=0;m===!0&&(T=1),_===!0&&(T=2),p===!0&&(T=3);let w=o.attributes.position.count*T,y=1;w>e.maxTextureSize&&(y=Math.ceil(w/e.maxTextureSize),w=e.maxTextureSize);const g=new Float32Array(w*y*4*h),x=new Eh(g,w,y,h);x.type=Ci,x.needsUpdate=!0;const I=T*4;for(let A=0;A<h;A++){const F=v[A],N=S[A],P=E[A],B=w*y*4*A;for(let H=0;H<F.count;H++){const k=H*I;m===!0&&(s.fromBufferAttribute(F,H),g[B+k+0]=s.x,g[B+k+1]=s.y,g[B+k+2]=s.z,g[B+k+3]=0),_===!0&&(s.fromBufferAttribute(N,H),g[B+k+4]=s.x,g[B+k+5]=s.y,g[B+k+6]=s.z,g[B+k+7]=0),p===!0&&(s.fromBufferAttribute(P,H),g[B+k+8]=s.x,g[B+k+9]=s.y,g[B+k+10]=s.z,g[B+k+11]=P.itemSize===4?s.w:1)}}u={count:h,texture:x,size:new nt(w,y)},i.set(o,u),o.addEventListener("dispose",R)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let m=0;for(let p=0;p<c.length;p++)m+=c[p];const _=o.morphTargetsRelative?1:1-m;l.getUniforms().setValue(n,"morphTargetBaseInfluence",_),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",u.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",u.size)}return{update:r}}function c0(n,e,t,i,s){let r=new WeakMap;function a(c){const f=s.render.frame,h=c.geometry,u=e.get(c,h);if(r.get(u)!==f&&(e.update(u),r.set(u,f)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==f&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),r.set(c,f))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==f&&(d.update(),r.set(d,f))}return u}function o(){r=new WeakMap}function l(c){const f=c.target;f.removeEventListener("dispose",l),i.releaseStatesOfObject(f),t.remove(f.instanceMatrix),f.instanceColor!==null&&t.remove(f.instanceColor)}return{update:a,dispose:o}}const h0={[oh]:"LINEAR_TONE_MAPPING",[lh]:"REINHARD_TONE_MAPPING",[ch]:"CINEON_TONE_MAPPING",[hh]:"ACES_FILMIC_TONE_MAPPING",[fh]:"AGX_TONE_MAPPING",[dh]:"NEUTRAL_TONE_MAPPING",[uh]:"CUSTOM_TONE_MAPPING"};function u0(n,e,t,i,s,r){const a=new Pi(e,t,{type:n,depthBuffer:s,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,l=null,c=null;const f=new an;f.setAttribute("position",new wi([-1,3,0,-1,-1,0,3,-1,0],3)),f.setAttribute("uv",new wi([0,2,0,0,2,0],2));const h=new Po({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),u=new Gi(f,h),d=new Fh(-1,1,1,-1,0,1);let m=null,_=null,p=!1,v,S=null,E=[],T=!1;this.setSize=function(w,y){a.setSize(w,y),o!==null&&o.setSize(w,y),l!==null&&l.setSize(w,y);for(let g=0;g<E.length;g++){const x=E[g];x.setSize&&x.setSize(w,y)}},this.setEffects=function(w){E=w,T=E.length>0&&E[0].isRenderPass===!0;const y=a.width,g=a.height;E.length>0&&o===null&&(o=new Pi(y,g,{type:Li,depthBuffer:!1,stencilBuffer:!1}),l=new Pi(y,g,{type:Li,depthBuffer:!1,stencilBuffer:!1}));const x=s===!0&&E.some(I=>I.needsDepthTexture===!0);x!==(a.depthTexture!==null)&&(x===!0&&c===null&&(c=new es(y,g),r===!0&&(c.format=sn,c.type=Qn)),a.dispose(),a.depthTexture=x?c:null,a.resolveDepthBuffer=x,a.storeMultisampledDepthBuffer=x);for(let I=0;I<E.length;I++){const R=E[I];R.setSize&&R.setSize(y,g),x&&R.needsDepthTexture===!0&&R.setDepthTexture&&R.setDepthTexture(c)}},this.begin=function(w,y){if(p||w.toneMapping===Hi&&E.length===0)return!1;if(S=y,y!==null){const g=y.width,x=y.height;(a.width!==g||a.height!==x)&&this.setSize(g,x)}return T===!1&&w.setRenderTarget(a),v=w.toneMapping,w.toneMapping=Hi,!0},this.hasRenderPass=function(){return T},this.end=function(w,y){w.toneMapping=v,p=!0;let g=a,x=o;for(let I=0;I<E.length;I++){const R=E[I];R.enabled!==!1&&(R.render(w,x,g,y),R.needsSwap!==!1&&(g=x,x=x===o?l:o))}if(m!==w.outputColorSpace||_!==w.toneMapping){m=w.outputColorSpace,_=w.toneMapping,h.defines={},Ke.getTransfer(m)===ot&&(h.defines.SRGB_TRANSFER="");const I=h0[_];I&&(h.defines[I]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=g.texture,w.setRenderTarget(S),w.render(u,d),S=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),f.dispose(),h.dispose()}}const zh=new $t,Gh=new es(1,1),Vh=new Lh(1),Wh=new Eh,Xh=new Fd,qh=new Ih,cc=[],hc=[],uc=new Float32Array(16),fc=new Float32Array(9),dc=new Float32Array(4);function ns(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let r=cc[s];if(r===void 0&&(r=new Float32Array(s),cc[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function At(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Rt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function zr(n,e){let t=hc[e];t===void 0&&(t=new Int32Array(e),hc[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function f0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function d0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(At(t,e))return;n.uniform2fv(this.addr,e),Rt(t,e)}}function p0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(At(t,e))return;n.uniform3fv(this.addr,e),Rt(t,e)}}function m0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(At(t,e))return;n.uniform4fv(this.addr,e),Rt(t,e)}}function g0(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(At(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Rt(t,e)}else{if(At(t,i))return;dc.set(i),n.uniformMatrix2fv(this.addr,!1,dc),Rt(t,i)}}function v0(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(At(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Rt(t,e)}else{if(At(t,i))return;fc.set(i),n.uniformMatrix3fv(this.addr,!1,fc),Rt(t,i)}}function x0(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(At(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Rt(t,e)}else{if(At(t,i))return;uc.set(i),n.uniformMatrix4fv(this.addr,!1,uc),Rt(t,i)}}function _0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function y0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(At(t,e))return;n.uniform2iv(this.addr,e),Rt(t,e)}}function S0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(At(t,e))return;n.uniform3iv(this.addr,e),Rt(t,e)}}function M0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(At(t,e))return;n.uniform4iv(this.addr,e),Rt(t,e)}}function w0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function b0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(At(t,e))return;n.uniform2uiv(this.addr,e),Rt(t,e)}}function E0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(At(t,e))return;n.uniform3uiv(this.addr,e),Rt(t,e)}}function T0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(At(t,e))return;n.uniform4uiv(this.addr,e),Rt(t,e)}}function Gr(n){return n.version===0&&(n.compareFunction=wh,n.needsUpdate=!0),n}function A0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?r=Gr(Gh):r=zh,t.setTexture2D(e||r,s)}function R0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||Xh,s)}function C0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_CUBE_SHADOW?r=Gr(Vh):r=qh,t.setTextureCube(e||r,s)}function P0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||Wh,s)}function I0(n){switch(n){case 5126:return f0;case 35664:return d0;case 35665:return p0;case 35666:return m0;case 35674:return g0;case 35675:return v0;case 35676:return x0;case 5124:case 35670:return _0;case 35667:case 35671:return y0;case 35668:case 35672:return S0;case 35669:case 35673:return M0;case 5125:return w0;case 36294:return b0;case 36295:return E0;case 36296:return T0;case 35678:case 36198:case 36298:case 36306:case 35682:return A0;case 35679:case 36299:case 36307:return R0;case 35680:case 36300:case 36308:case 36293:return C0;case 36289:case 36303:case 36311:case 36292:return P0}}function L0(n,e){n.uniform1fv(this.addr,e)}function D0(n,e){const t=ns(e,this.size,2);n.uniform2fv(this.addr,t)}function N0(n,e){const t=ns(e,this.size,3);n.uniform3fv(this.addr,t)}function U0(n,e){const t=ns(e,this.size,4);n.uniform4fv(this.addr,t)}function F0(n,e){const t=ns(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function O0(n,e){const t=ns(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function B0(n,e){const t=ns(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function k0(n,e){n.uniform1iv(this.addr,e)}function H0(n,e){n.uniform2iv(this.addr,e)}function z0(n,e){n.uniform3iv(this.addr,e)}function G0(n,e){n.uniform4iv(this.addr,e)}function V0(n,e){n.uniform1uiv(this.addr,e)}function W0(n,e){n.uniform2uiv(this.addr,e)}function X0(n,e){n.uniform3uiv(this.addr,e)}function q0(n,e){n.uniform4uiv(this.addr,e)}function $0(n,e,t){const i=this.cache,s=e.length,r=zr(t,s);At(i,r)||(n.uniform1iv(this.addr,r),Rt(i,r));let a;this.type===n.SAMPLER_2D_SHADOW?a=Gr(Gh):a=zh;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function Y0(n,e,t){const i=this.cache,s=e.length,r=zr(t,s);At(i,r)||(n.uniform1iv(this.addr,r),Rt(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Xh,r[a])}function K0(n,e,t){const i=this.cache,s=e.length,r=zr(t,s);At(i,r)||(n.uniform1iv(this.addr,r),Rt(i,r));let a;this.type===n.SAMPLER_CUBE_SHADOW?a=Gr(Vh):a=qh;for(let o=0;o!==s;++o)t.setTextureCube(e[o]||a,r[o])}function Z0(n,e,t){const i=this.cache,s=e.length,r=zr(t,s);At(i,r)||(n.uniform1iv(this.addr,r),Rt(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Wh,r[a])}function J0(n){switch(n){case 5126:return L0;case 35664:return D0;case 35665:return N0;case 35666:return U0;case 35674:return F0;case 35675:return O0;case 35676:return B0;case 5124:case 35670:return k0;case 35667:case 35671:return H0;case 35668:case 35672:return z0;case 35669:case 35673:return G0;case 5125:return V0;case 36294:return W0;case 36295:return X0;case 36296:return q0;case 35678:case 36198:case 36298:case 36306:case 35682:return $0;case 35679:case 36299:case 36307:return Y0;case 35680:case 36300:case 36308:case 36293:return K0;case 36289:case 36303:case 36311:case 36292:return Z0}}class j0{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=I0(t.type)}}class Q0{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=J0(t.type)}}class ev{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],i)}}}const Pa=/(\w+)(\])?(\[|\.)?/g;function pc(n,e){n.seq.push(e),n.map[e.id]=e}function tv(n,e,t){const i=n.name,s=i.length;for(Pa.lastIndex=0;;){const r=Pa.exec(i),a=Pa.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){pc(t,c===void 0?new j0(o,n,e):new Q0(o,n,e));break}else{let h=t.map[o];h===void 0&&(h=new ev(o),pc(t,h)),t=h}}}class Mr{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);tv(o,l,this)}const s=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&i.push(a)}return i}}function mc(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const iv=37297;let nv=0;function sv(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const gc=new Oe;function rv(n){Ke._getMatrix(gc,Ke.workingColorSpace,n);const e=`mat3( ${gc.elements.map(t=>t.toFixed(4))} )`;switch(Ke.getTransfer(n)){case Ir:return[e,"LinearTransferOETF"];case ot:return[e,"sRGBTransferOETF"];default:return Ue("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function vc(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+sv(n.getShaderSource(e),o)}else return r}function av(n,e){const t=rv(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( ${t[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}const ov={[oh]:"Linear",[lh]:"Reinhard",[ch]:"Cineon",[hh]:"ACESFilmic",[fh]:"AgX",[dh]:"Neutral",[uh]:"Custom"};function lv(n,e){const t=ov[e];return t===void 0?(Ue("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const or=new K;function cv(){Ke.getLuminanceCoefficients(or);const n=or.x.toFixed(4),e=or.y.toFixed(4),t=or.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function hv(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(vs).join(`
`)}function uv(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function fv(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(e,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function vs(n){return n!==""}function xc(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,e.numLightProbeGrids)}function _c(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const dv=/^[ \t]*#include +<([\w\d./]+)>/gm;function Lo(n){return n.replace(dv,pv)}function pv(n,e){const t=Ge[e];if(t===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">");return Lo(t)}const mv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function yc(n){return n.replace(mv,gv)}function gv(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Sc(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}const vv={[gr]:"SHADOWMAP_TYPE_PCF",[gs]:"SHADOWMAP_TYPE_VSM"};function xv(n){return vv[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const _v={[ws]:"ENVMAP_MODE_REFRACTION"};function yv(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":_v[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Sv={[ah]:"ENVMAP_BLENDING_MULTIPLY",[ud]:"ENVMAP_BLENDING_MIX",[fd]:"ENVMAP_BLENDING_ADD"};function Mv(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":Sv[n.combine]||"ENVMAP_BLENDING_NONE"}function wv(n,e,t,i){const s=n.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=xv(t),c=t.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",f=yv(t),h=Mv(t),u=hv(t),d=uv(r),m=s.createProgram();let _,p,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(_=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d].filter(vs).join(`
`),_.length>0&&(_+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d].filter(vs).join(`
`),p.length>0&&(p+=`
`)):(_=[Sc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+f:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+t.diffuseRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(vs).join(`
`),p=[Sc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+f:"",t.envMap?"#define "+h:"",t.envMapPMREM?"#define ENVMAP_MAX_LOD "+t.envMapMaxLod+".0":"",t.envMapPMREM?"#define ENVMAP_SIZE "+t.envMapSize+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Hi?"#define TONE_MAPPING":"",t.toneMapping!==Hi?Ge.tonemapping_pars_fragment:"",t.toneMapping!==Hi?lv("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ge.colorspace_pars_fragment,av("linearToOutputTexel",t.outputColorSpace),cv(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(vs).join(`
`)),a=Lo(a),a=xc(a,t),a=_c(a,t),o=Lo(o),o=xc(o,t),o=_c(o,t),a=yc(a),o=yc(o),t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,_=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+_,p=["#define varying in",t.glslVersion===Lr?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Lr?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const S=v+_+a,E=v+p+o,T=mc(s,s.VERTEX_SHADER,S),w=mc(s,s.FRAGMENT_SHADER,E);s.attachShader(m,T),s.attachShader(m,w),t.index0AttributeName!==void 0?s.bindAttribLocation(m,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(m,0,"position"),s.linkProgram(m);function y(R){if(n.debug.checkShaderErrors){const A=s.getProgramInfoLog(m)||"",F=s.getShaderInfoLog(T)||"",N=s.getShaderInfoLog(w)||"",P=A.trim(),B=F.trim(),H=N.trim();let k=!0,C=!0;if(s.getProgramParameter(m,s.LINK_STATUS)===!1)if(k=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,m,T,w);else{const L=vc(s,T,"vertex"),G=vc(s,w,"fragment");it("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(m,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+P+`
`+L+`
`+G)}else P!==""?Ue("WebGLProgram: Program Info Log:",P):(B===""||H==="")&&(C=!1);C&&(R.diagnostics={runnable:k,programLog:P,vertexShader:{log:B,prefix:_},fragmentShader:{log:H,prefix:p}})}s.deleteShader(T),s.deleteShader(w),g=new Mr(s,m),x=fv(s,m)}let g;this.getUniforms=function(){return g===void 0&&y(this),g};let x;this.getAttributes=function(){return x===void 0&&y(this),x};let I=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return I===!1&&(I=s.getProgramParameter(m,iv)),I},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(m),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=nv++,this.cacheKey=e,this.usedTimes=1,this.program=m,this.vertexShader=T,this.fragmentShader=w,this}let bv=0;class Ev{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){const s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new Tv(e),t.set(e,i)),i}}class Tv{constructor(e){this.id=bv++,this.code=e,this.usedTimes=0}}function Av(n){return n===Sn||n===Cr||n===Pr}function Rv(n,e,t,i,s,r){const a=new Th,o=new Ev,l=new Set,c=[],f=new Map,h=i.logarithmicDepthBuffer,u={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function d(g){return l.add(g),g===0?"uv":`uv${g}`}function m(g,x,I,R,A,F){const N=R.fog,P=A.geometry,B=g.isMeshStandardMaterial||g.isMeshLambertMaterial||g.isMeshPhongMaterial?R.environment:null,H=g.isMeshStandardMaterial||g.isMeshLambertMaterial&&!g.envMap||g.isMeshPhongMaterial&&!g.envMap,k=e.get(g.envMap||B,H),C=u[g.type];let L=i.precision;g.precision!==null&&(L=i.getMaxPrecision(g.precision),L!==g.precision&&Ue("WebGLProgram.getParameters:",g.precision,"not supported, using",L,"instead."));const G=P.morphAttributes.position||P.morphAttributes.normal||P.morphAttributes.color,$=G!==void 0?G.length:0;let ie=0;P.morphAttributes.position!==void 0&&(ie=1),P.morphAttributes.normal!==void 0&&(ie=2),P.morphAttributes.color!==void 0&&(ie=3);let ne,X,te,ge;if(C){const _e=Ai[C];ne=_e.vertexShader,X=_e.fragmentShader}else{ne=g.vertexShader,X=g.fragmentShader;const _e=o.getVertexShaderStage(g),at=o.getFragmentShaderStage(g);o.update(g,_e,at),te=_e.id,ge=at.id}const xe=n.getRenderTarget(),re=n.state.buffers.depth.getReversed(),Ie=A.isInstancedMesh===!0,lt=A.isBatchedMesh===!0,Ae=!!g.map,Ve=!!g.matcap,Xe=!!k,Ne=Xe&&k.isPMREMTexture===!0,dt=!!g.aoMap,ae=!!g.lightMap,Pe=!!g.bumpMap&&g.wireframe===!1,we=!!g.normalMap,rt=!!g.displacementMap,pt=!!g.emissiveMap,Ft=!!g.metalnessMap,Je=!!g.roughnessMap,Ot=g.anisotropy>0,z=g.clearcoat>0,ni=g.diffuseRoughness>0,vt=g.dispersion>0,xt=g.retroreflectivity>0,ve=g.iridescence>0,Tt=g.sheen>0,De=g.transmission>0,Fe=Ot&&!!g.anisotropyMap,D=z&&!!g.clearcoatMap,M=z&&!!g.clearcoatNormalMap,W=z&&!!g.clearcoatRoughnessMap,se=ni&&!!g.diffuseRoughnessMap,ee=ve&&!!g.iridescenceMap,ce=ve&&!!g.iridescenceThicknessMap,pe=Tt&&!!g.sheenColorMap,J=Tt&&!!g.sheenRoughnessMap,j=!!g.specularMap,ue=!!g.specularColorMap,U=!!g.specularIntensityMap,Q=De&&!!g.transmissionMap,Z=De&&!!g.thicknessMap,fe=!!g.gradientMap,le=!!g.alphaMap,he=g.alphaTest>0,Ce=!!g.alphaHash,ze=!!g.extensions;let oe=Hi;g.toneMapped&&(xe===null||xe.isXRRenderTarget===!0)&&(oe=n.toneMapping);const Le=Ne?k.isCompressedCubeTexture?k.image[0].mipmaps:k.mipmaps:null,He={shaderID:C,shaderType:g.type,shaderName:g.name,vertexShader:ne,fragmentShader:X,defines:g.defines,customVertexShaderID:te,customFragmentShaderID:ge,isRawShaderMaterial:g.isRawShaderMaterial===!0,glslVersion:g.glslVersion,precision:L,batching:lt,batchingColor:lt&&A._colorsTexture!==null,instancing:Ie,instancingColor:Ie&&A.instanceColor!==null,instancingMorph:Ie&&A.morphTexture!==null,outputColorSpace:xe===null?n.outputColorSpace:xe.isXRRenderTarget===!0?xe.texture.colorSpace:Ke.workingColorSpace,alphaToCoverage:!!g.alphaToCoverage,map:Ae,matcap:Ve,envMap:Xe,envMapMode:Xe&&k.mapping,envMapPMREM:Ne,envMapMaxLod:Ne?Le.length-1:null,envMapSize:Ne?Le[0].width:null,aoMap:dt,lightMap:ae,bumpMap:Pe,normalMap:we,displacementMap:rt,emissiveMap:pt,normalMapObjectSpace:we&&g.normalMapType===md,normalMapTangentSpace:we&&g.normalMapType===Ol,packedNormalMap:we&&g.normalMapType===Ol&&Av(g.normalMap.format),metalnessMap:Ft,roughnessMap:Je,anisotropy:Ot,anisotropyMap:Fe,clearcoat:z,clearcoatMap:D,clearcoatNormalMap:M,clearcoatRoughnessMap:W,diffuseRoughness:ni,diffuseRoughnessMap:se,dispersion:vt,retroreflection:xt,iridescence:ve,iridescenceMap:ee,iridescenceThicknessMap:ce,sheen:Tt,sheenColorMap:pe,sheenRoughnessMap:J,specularMap:j,specularColorMap:ue,specularIntensityMap:U,transmission:De,transmissionMap:Q,thicknessMap:Z,gradientMap:fe,opaque:g.transparent===!1&&g.blending===Ss&&g.alphaToCoverage===!1,alphaMap:le,alphaTest:he,alphaHash:Ce,combine:g.combine,mapUv:Ae&&d(g.map.channel),aoMapUv:dt&&d(g.aoMap.channel),lightMapUv:ae&&d(g.lightMap.channel),bumpMapUv:Pe&&d(g.bumpMap.channel),normalMapUv:we&&d(g.normalMap.channel),displacementMapUv:rt&&d(g.displacementMap.channel),emissiveMapUv:pt&&d(g.emissiveMap.channel),metalnessMapUv:Ft&&d(g.metalnessMap.channel),roughnessMapUv:Je&&d(g.roughnessMap.channel),anisotropyMapUv:Fe&&d(g.anisotropyMap.channel),clearcoatMapUv:D&&d(g.clearcoatMap.channel),clearcoatNormalMapUv:M&&d(g.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:W&&d(g.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:se&&d(g.diffuseRoughnessMap.channel),iridescenceMapUv:ee&&d(g.iridescenceMap.channel),iridescenceThicknessMapUv:ce&&d(g.iridescenceThicknessMap.channel),sheenColorMapUv:pe&&d(g.sheenColorMap.channel),sheenRoughnessMapUv:J&&d(g.sheenRoughnessMap.channel),specularMapUv:j&&d(g.specularMap.channel),specularColorMapUv:ue&&d(g.specularColorMap.channel),specularIntensityMapUv:U&&d(g.specularIntensityMap.channel),transmissionMapUv:Q&&d(g.transmissionMap.channel),thicknessMapUv:Z&&d(g.thicknessMap.channel),alphaMapUv:le&&d(g.alphaMap.channel),vertexTangents:!!P.attributes.tangent&&(we||Ot),vertexNormals:!!P.attributes.normal,vertexColors:g.vertexColors,vertexAlphas:g.vertexColors===!0&&!!P.attributes.color&&P.attributes.color.itemSize===4,pointsUvs:A.isPoints===!0&&!!P.attributes.uv&&(Ae||le),fog:!!N,useFog:g.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:g.wireframe===!1&&(g.flatShading===!0||P.attributes.normal===void 0&&we===!1&&(g.isMeshLambertMaterial||g.isMeshPhongMaterial||g.isMeshStandardMaterial||g.isMeshPhysicalMaterial)),sizeAttenuation:g.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:re,skinning:A.isSkinnedMesh===!0,hasPositionAttribute:P.attributes.position!==void 0,morphTargets:P.morphAttributes.position!==void 0,morphNormals:P.morphAttributes.normal!==void 0,morphColors:P.morphAttributes.color!==void 0,morphTargetsCount:$,morphTextureStride:ie,numSunLights:x.sun.length,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numSunLightShadows:x.sunShadowMap.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numLightProbeGrids:F.filter(_e=>_e.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:g.dithering,shadowMapEnabled:n.shadowMap.enabled&&I.length>0,shadowMapType:n.shadowMap.type,toneMapping:oe,decodeVideoTexture:Ae&&g.map.isVideoTexture===!0&&Ke.getTransfer(g.map.colorSpace)===ot,decodeVideoTextureEmissive:pt&&g.emissiveMap.isVideoTexture===!0&&Ke.getTransfer(g.emissiveMap.colorSpace)===ot,premultipliedAlpha:g.premultipliedAlpha,doubleSided:g.side===_i,flipSided:g.side===Zt,useDepthPacking:g.depthPacking>=0,depthPacking:g.depthPacking||0,index0AttributeName:g.index0AttributeName,extensionClipCullDistance:ze&&g.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ze&&g.extensions.multiDraw===!0||lt)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:g.customProgramCacheKey()};return He.vertexUv1s=l.has(1),He.vertexUv2s=l.has(2),He.vertexUv3s=l.has(3),l.clear(),He}function _(g){const x=[];if(g.shaderID?x.push(g.shaderID):(x.push(g.customVertexShaderID),x.push(g.customFragmentShaderID)),g.defines!==void 0)for(const I in g.defines)x.push(I),x.push(g.defines[I]);return g.isRawShaderMaterial===!1&&(p(x,g),v(x,g),x.push(n.outputColorSpace)),x.push(g.customProgramCacheKey),x.join()}function p(g,x){g.push(x.precision),g.push(x.outputColorSpace),g.push(x.envMapMode),g.push(x.envMapPMREM),g.push(x.envMapMaxLod),g.push(x.envMapSize),g.push(x.mapUv),g.push(x.alphaMapUv),g.push(x.lightMapUv),g.push(x.aoMapUv),g.push(x.bumpMapUv),g.push(x.normalMapUv),g.push(x.displacementMapUv),g.push(x.emissiveMapUv),g.push(x.metalnessMapUv),g.push(x.roughnessMapUv),g.push(x.anisotropyMapUv),g.push(x.clearcoatMapUv),g.push(x.clearcoatNormalMapUv),g.push(x.clearcoatRoughnessMapUv),g.push(x.diffuseRoughnessMapUv),g.push(x.iridescenceMapUv),g.push(x.iridescenceThicknessMapUv),g.push(x.sheenColorMapUv),g.push(x.sheenRoughnessMapUv),g.push(x.specularMapUv),g.push(x.specularColorMapUv),g.push(x.specularIntensityMapUv),g.push(x.transmissionMapUv),g.push(x.thicknessMapUv),g.push(x.combine),g.push(x.fogExp2),g.push(x.sizeAttenuation),g.push(x.morphTargetsCount),g.push(x.numSunLights),g.push(x.numDirLights),g.push(x.numPointLights),g.push(x.numSpotLights),g.push(x.numSpotLightMaps),g.push(x.numHemiLights),g.push(x.numRectAreaLights),g.push(x.numSunLightShadows),g.push(x.numDirLightShadows),g.push(x.numPointLightShadows),g.push(x.numSpotLightShadows),g.push(x.numSpotLightShadowsWithMaps),g.push(x.numLightProbes),g.push(x.numLightProbeGrids),g.push(x.shadowMapType),g.push(x.toneMapping),g.push(x.numClippingPlanes),g.push(x.numClipIntersection),g.push(x.depthPacking)}function v(g,x){a.disableAll(),x.instancing&&a.enable(0),x.instancingColor&&a.enable(1),x.instancingMorph&&a.enable(2),x.matcap&&a.enable(3),x.envMap&&a.enable(4),x.normalMapObjectSpace&&a.enable(5),x.normalMapTangentSpace&&a.enable(6),x.clearcoat&&a.enable(7),x.iridescence&&a.enable(8),x.alphaTest&&a.enable(9),x.vertexColors&&a.enable(10),x.vertexAlphas&&a.enable(11),x.vertexUv1s&&a.enable(12),x.vertexUv2s&&a.enable(13),x.vertexUv3s&&a.enable(14),x.vertexTangents&&a.enable(15),x.anisotropy&&a.enable(16),x.alphaHash&&a.enable(17),x.batching&&a.enable(18),x.dispersion&&a.enable(19),x.retroreflection&&a.enable(24),x.diffuseRoughness&&a.enable(25),x.batchingColor&&a.enable(20),x.gradientMap&&a.enable(21),x.packedNormalMap&&a.enable(22),x.vertexNormals&&a.enable(23),g.push(a.mask),a.disableAll(),x.fog&&a.enable(0),x.useFog&&a.enable(1),x.flatShading&&a.enable(2),x.logarithmicDepthBuffer&&a.enable(3),x.reversedDepthBuffer&&a.enable(4),x.skinning&&a.enable(5),x.morphTargets&&a.enable(6),x.morphNormals&&a.enable(7),x.morphColors&&a.enable(8),x.premultipliedAlpha&&a.enable(9),x.shadowMapEnabled&&a.enable(10),x.doubleSided&&a.enable(11),x.flipSided&&a.enable(12),x.useDepthPacking&&a.enable(13),x.dithering&&a.enable(14),x.transmission&&a.enable(15),x.sheen&&a.enable(16),x.opaque&&a.enable(17),x.pointsUvs&&a.enable(18),x.decodeVideoTexture&&a.enable(19),x.decodeVideoTextureEmissive&&a.enable(20),x.alphaToCoverage&&a.enable(21),x.numLightProbeGrids>0&&a.enable(22),x.hasPositionAttribute&&a.enable(23),g.push(a.mask)}function S(g){const x=u[g.type];let I;if(x){const R=Ai[x];I=ip.clone(R.uniforms)}else I=g.uniforms;return I}function E(g,x){let I=f.get(x);return I!==void 0?++I.usedTimes:(I=new wv(n,x,g,s),c.push(I),f.set(x,I)),I}function T(g){if(--g.usedTimes===0){const x=c.indexOf(g);c[x]=c[c.length-1],c.pop(),f.delete(g.cacheKey),g.destroy()}}function w(g){o.remove(g)}function y(){o.dispose()}return{getParameters:m,getProgramCacheKey:_,getUniforms:S,acquireProgram:E,releaseProgram:T,releaseShaderCache:w,programs:c,dispose:y}}function Cv(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,l){n.get(a)[o]=l}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function Pv(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function Mc(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function wc(){const n=[];let e=0;const t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(u){let d=0;return u.isInstancedMesh&&(d+=2),u.isSkinnedMesh&&(d+=1),d}function o(u,d,m,_,p,v){let S=n[e];return S===void 0?(S={id:u.id,object:u,geometry:d,material:m,materialVariant:a(u),groupOrder:_,renderOrder:u.renderOrder,z:p,group:v},n[e]=S):(S.id=u.id,S.object=u,S.geometry=d,S.material=m,S.materialVariant=a(u),S.groupOrder=_,S.renderOrder=u.renderOrder,S.z=p,S.group=v),e++,S}function l(u,d,m,_,p,v,S){S.reversedDepth===!0&&(p=-p);const E=o(u,d,m,_,p,v);m.transmission>0?i.push(E):m.transparent===!0?s.push(E):t.push(E)}function c(u,d,m,_,p,v){const S=o(u,d,m,_,p,v);m.transmission>0?i.unshift(S):m.transparent===!0?s.unshift(S):t.unshift(S)}function f(u,d){t.length>1&&t.sort(u||Pv),i.length>1&&i.sort(d||Mc),s.length>1&&s.sort(d||Mc)}function h(){for(let u=e,d=n.length;u<d;u++){const m=n[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:l,unshift:c,finish:h,sort:f}}function Iv(){let n=new WeakMap;function e(i,s){const r=n.get(i);let a;return r===void 0?(a=new wc,n.set(i,[a])):s>=r.length?(a=new wc,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function Lv(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new K,color:new st};break;case"SpotLight":t={position:new K,direction:new K,color:new st,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new K,color:new st,distance:0,decay:0};break;case"HemisphereLight":t={direction:new K,skyColor:new st,groundColor:new st};break;case"RectAreaLight":t={color:new st,position:new K,halfWidth:new K,halfHeight:new K};break}return n[e.id]=t,t}}}function Dv(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let Nv=0;function Uv(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function Fv(n){const e=new Lv,t=Dv(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new K);const s=new K,r=new Mt,a=new Mt;function o(c){let f=0,h=0,u=0;for(let F=0;F<9;F++)i.probe[F].set(0,0,0);let d=0,m=0,_=0,p=0,v=0,S=0,E=0,T=0,w=0,y=0,g=0,x=0,I=0,R=0;c.sort(Uv);for(let F=0,N=c.length;F<N;F++){const P=c[F],B=P.color,H=P.intensity,k=P.distance;let C=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===Sn?C=P.shadow.map.texture:C=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)f+=B.r*H,h+=B.g*H,u+=B.b*H;else if(P.isLightProbe){for(let L=0;L<9;L++)i.probe[L].addScaledVector(P.sh.coefficients[L],H);R++}else if(P.isSunLight){const L=e.get(P);if(L.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const G=P.shadow,$=t.get(P);$.shadowIntensity=G.intensity,$.shadowBias=G.bias,$.shadowNormalBias=G.normalBias,$.shadowRadius=G.radius,$.shadowMapSize.copy(G.mapSize).multiply(G.getFrameExtents()),i.sunShadow[m]=$,i.sunShadowMap[m]=C;const ie=G.getViewportCount();for(let ne=0;ne<ie;ne++)i.sunShadowMatrix[_+ne]=G.getMatrix(ne),i.sunShadowCascade[_+ne]=G._cascadeData[ne];_+=ie,m++}i.sun[d]=L,d++}else if(P.isDirectionalLight){const L=e.get(P);if(L.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const G=P.shadow,$=t.get(P);$.shadowIntensity=G.intensity,$.shadowBias=G.bias,$.shadowNormalBias=G.normalBias,$.shadowRadius=G.radius,$.shadowMapSize=G.mapSize,i.directionalShadow[p]=$,i.directionalShadowMap[p]=C,i.directionalShadowMatrix[p]=P.shadow.matrix,w++}i.directional[p]=L,p++}else if(P.isSpotLight){const L=e.get(P);L.position.setFromMatrixPosition(P.matrixWorld),L.color.copy(B).multiplyScalar(H),L.distance=k,L.coneCos=Math.cos(P.angle),L.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),L.decay=P.decay,i.spot[S]=L;const G=P.shadow;if(P.map&&(i.spotLightMap[x]=P.map,x++,G.updateMatrices(P),P.castShadow&&I++),i.spotLightMatrix[S]=G.matrix,P.castShadow){const $=t.get(P);$.shadowIntensity=G.intensity,$.shadowBias=G.bias,$.shadowNormalBias=G.normalBias,$.shadowRadius=G.radius,$.shadowMapSize=G.mapSize,i.spotShadow[S]=$,i.spotShadowMap[S]=C,g++}S++}else if(P.isRectAreaLight){const L=e.get(P);L.color.copy(B).multiplyScalar(H),L.halfWidth.set(P.width*.5,0,0),L.halfHeight.set(0,P.height*.5,0),i.rectArea[E]=L,E++}else if(P.isPointLight){const L=e.get(P);if(L.color.copy(P.color).multiplyScalar(P.intensity),L.distance=P.distance,L.decay=P.decay,P.castShadow){const G=P.shadow,$=t.get(P);$.shadowIntensity=G.intensity,$.shadowBias=G.bias,$.shadowNormalBias=G.normalBias,$.shadowRadius=G.radius,$.shadowMapSize=G.mapSize,$.shadowCameraNear=G.camera.near,$.shadowCameraFar=G.camera.far,i.pointShadow[v]=$,i.pointShadowMap[v]=C,i.pointShadowMatrix[v]=P.shadow.matrix,y++}i.point[v]=L,v++}else if(P.isHemisphereLight){const L=e.get(P);L.skyColor.copy(P.color).multiplyScalar(H),L.groundColor.copy(P.groundColor).multiplyScalar(H),i.hemi[T]=L,T++}}E>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ye.LTC_FLOAT_1,i.rectAreaLTC2=ye.LTC_FLOAT_2):(i.rectAreaLTC1=ye.LTC_HALF_1,i.rectAreaLTC2=ye.LTC_HALF_2)),i.ambient[0]=f,i.ambient[1]=h,i.ambient[2]=u;const A=i.hash;(A.sunLength!==d||A.directionalLength!==p||A.pointLength!==v||A.spotLength!==S||A.rectAreaLength!==E||A.hemiLength!==T||A.numSunShadows!==m||A.numDirectionalShadows!==w||A.numPointShadows!==y||A.numSpotShadows!==g||A.numSpotMaps!==x||A.numLightProbes!==R)&&(i.sun.length=d,i.directional.length=p,i.spot.length=S,i.rectArea.length=E,i.point.length=v,i.hemi.length=T,i.sunShadow.length=m,i.sunShadowMap.length=m,i.sunShadowMatrix.length=_,i.sunShadowCascade.length=_,i.directionalShadow.length=w,i.directionalShadowMap.length=w,i.directionalShadowMatrix.length=w,i.pointShadow.length=y,i.pointShadowMap.length=y,i.pointShadowMatrix.length=y,i.spotShadow.length=g,i.spotShadowMap.length=g,i.spotLightMatrix.length=g+x-I,i.spotLightMap.length=x,i.numSpotLightShadowsWithMaps=I,i.numLightProbes=R,A.sunLength=d,A.directionalLength=p,A.pointLength=v,A.spotLength=S,A.rectAreaLength=E,A.hemiLength=T,A.numSunShadows=m,A.numDirectionalShadows=w,A.numPointShadows=y,A.numSpotShadows=g,A.numSpotMaps=x,A.numLightProbes=R,i.version=Nv++)}function l(c,f){let h=0,u=0,d=0,m=0,_=0,p=0;const v=f.matrixWorldInverse;for(let S=0,E=c.length;S<E;S++){const T=c[S];if(T.isSunLight){const w=i.sun[h];w.direction.setFromMatrixPosition(T.matrixWorld),w.direction.transformDirection(v),h++}else if(T.isDirectionalLight){const w=i.directional[u];w.direction.setFromMatrixPosition(T.matrixWorld),s.setFromMatrixPosition(T.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(v),u++}else if(T.isSpotLight){const w=i.spot[m];w.position.setFromMatrixPosition(T.matrixWorld),w.position.applyMatrix4(v),w.direction.setFromMatrixPosition(T.matrixWorld),s.setFromMatrixPosition(T.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(v),m++}else if(T.isRectAreaLight){const w=i.rectArea[_];w.position.setFromMatrixPosition(T.matrixWorld),w.position.applyMatrix4(v),a.identity(),r.copy(T.matrixWorld),r.premultiply(v),a.extractRotation(r),w.halfWidth.set(T.width*.5,0,0),w.halfHeight.set(0,T.height*.5,0),w.halfWidth.applyMatrix4(a),w.halfHeight.applyMatrix4(a),_++}else if(T.isPointLight){const w=i.point[d];w.position.setFromMatrixPosition(T.matrixWorld),w.position.applyMatrix4(v),d++}else if(T.isHemisphereLight){const w=i.hemi[p];w.direction.setFromMatrixPosition(T.matrixWorld),w.direction.transformDirection(v),p++}}}return{setup:o,setupView:l,state:i}}function bc(n){const e=new Fv(n),t=[],i=[],s=[];function r(h){f.camera=h,t.length=0,i.length=0,s.length=0}function a(h){h.isLightProbeGrid?s.push(h):t.push(h)}function o(h){i.push(h)}function l(){e.setup(t),s.sort((h,u)=>h.priority-u.priority||h.id-u.id)}function c(h){e.setupView(t,h)}const f={lightsArray:t,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:f,setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function Ov(n){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new bc(n),e.set(s,[o])):r>=a.length?(o=new bc(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const Bv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,kv=`uniform sampler2D shadow_pass;
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
}`,Hv=[new K(1,0,0),new K(-1,0,0),new K(0,1,0),new K(0,-1,0),new K(0,0,1),new K(0,0,-1)],zv=[new K(0,-1,0),new K(0,-1,0),new K(0,0,1),new K(0,0,-1),new K(0,-1,0),new K(0,-1,0)],Ec=new Mt,ps=new K,Ia=new K;function Gv(n,e,t){let i=new Ur;const s=new nt,r=new nt,a=new St,o=new rp,l=new ap,c={},f=t.maxTextureSize,h={[yn]:Zt,[Zt]:yn,[_i]:_i},u=new wn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new nt},radius:{value:4}},vertexShader:Bv,fragmentShader:kv}),d=u.clone();d.defines.HORIZONTAL_PASS=1;const m=new an;m.setAttribute("position",new _n(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Gi(m,u),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=gr;let v=this.type;this.render=function(y,g,x){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||y.length===0)return;this.type===Kf&&(Ue("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=gr);const I=n.getRenderTarget(),R=n.getActiveCubeFace(),A=n.getActiveMipmapLevel(),F=n.state;F.setBlending(Kn),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const N=v!==this.type;N&&g.traverse(function(P){P.material&&(Array.isArray(P.material)?P.material.forEach(B=>B.needsUpdate=!0):P.material.needsUpdate=!0)});for(let P=0,B=y.length;P<B;P++){const H=y[P],k=H.shadow;if(k===void 0){Ue("WebGLShadowMap:",H,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;s.copy(k.mapSize);const C=k.getFrameExtents();s.multiply(C),r.copy(k.mapSize),(s.x>f||s.y>f)&&(s.x>f&&(r.x=Math.floor(f/C.x),s.x=r.x*C.x,k.mapSize.x=r.x),s.y>f&&(r.y=Math.floor(f/C.y),s.y=r.y*C.y,k.mapSize.y=r.y));const L=n.state.buffers.depth.getReversed();if(k.camera._reversedDepth=L,k.map===null||N===!0){if(k.map!==null&&(k.map.depthTexture!==null&&(k.map.depthTexture.dispose(),k.map.depthTexture=null),k.map.dispose()),this.type===gs){if(H.isPointLight){Ue("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}k.map=new Pi(s.x,s.y,{format:Sn,type:Li,minFilter:Kt,magFilter:Kt,generateMipmaps:!1}),k.map.texture.name=H.name+".shadowMap",k.map.depthTexture=new es(s.x,s.y,Ci),k.map.depthTexture.name=H.name+".shadowMapDepth",k.map.depthTexture.format=rn,k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=Lt,k.map.depthTexture.magFilter=Lt}else H.isPointLight?(k.map=new Jo(s.x),k.map.depthTexture=new Lh(s.x,Ii)):(k.map=new Pi(s.x,s.y),k.map.depthTexture=new es(s.x,s.y,Ii)),k.map.depthTexture.name=H.name+".shadowMap",k.map.depthTexture.format=rn,this.type===gr?(k.map.depthTexture.compareFunction=L?Mh:Sh,k.map.depthTexture.minFilter=Kt,k.map.depthTexture.magFilter=Kt):(k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=Lt,k.map.depthTexture.magFilter=Lt);k.camera.updateProjectionMatrix()}k.map.isWebGLCubeRenderTarget!==!0&&(k.map.width!==s.x||k.map.height!==s.y)&&k.map.setSize(s.x,s.y);const G=k.map.isWebGLCubeRenderTarget?6:k.getViewportCount();H.isPointLight!==!0&&k.updateMatrices(H,x);const $=(k.camera.layers.mask&4294967294)!==0?k.camera.layers:x.layers;for(let ie=0;ie<G;ie++){const ne=k.getCamera(ie);if(H.isPointLight){const X=k.camera,te=k.matrix,ge=H.distance||X.far;ge!==X.far&&(X.far=ge,X.updateProjectionMatrix()),ps.setFromMatrixPosition(H.matrixWorld),X.position.copy(ps),Ia.copy(X.position),Ia.add(Hv[ie]),X.up.copy(zv[ie]),X.lookAt(Ia),X.updateMatrixWorld(),te.makeTranslation(-ps.x,-ps.y,-ps.z),Ec.multiplyMatrices(X.projectionMatrix,X.matrixWorldInverse),k._frustum.setFromProjectionMatrix(Ec,X.coordinateSystem,X.reversedDepth)}if(k.map.isWebGLCubeRenderTarget)n.setRenderTarget(k.map,ie),n.clear();else{ie===0&&(n.setRenderTarget(k.map),n.clear());const X=k.getViewport(ie);a.set(r.x*X.x,r.y*X.y,r.x*X.z,r.y*X.w),F.viewport(a)}i=k.getFrustum(ie),T(g,x,ne,H,$,this.type)}k.isPointLightShadow!==!0&&this.type===gs&&S(k,x),k.needsUpdate=!1}v=this.type,p.needsUpdate=!1,n.setRenderTarget(I,R,A)};function S(y,g){const x=e.update(_);u.defines.VSM_SAMPLES!==y.blurSamples&&(u.defines.VSM_SAMPLES=y.blurSamples,d.defines.VSM_SAMPLES=y.blurSamples,u.needsUpdate=!0,d.needsUpdate=!0),y.mapPass===null?y.mapPass=new Pi(s.x,s.y,{format:Sn,type:Li}):(y.mapPass.width!==y.map.width||y.mapPass.height!==y.map.height)&&y.mapPass.setSize(y.map.width,y.map.height),u.uniforms.shadow_pass.value=y.map.depthTexture,u.uniforms.resolution.value.set(y.map.width,y.map.height),u.uniforms.radius.value=y.radius,n.setRenderTarget(y.mapPass),n.clear(),n.renderBufferDirect(g,null,x,u,_,null),d.uniforms.shadow_pass.value=y.mapPass.texture,d.uniforms.resolution.value.set(y.map.width,y.map.height),d.uniforms.radius.value=y.radius,n.setRenderTarget(y.map),n.clear(),n.renderBufferDirect(g,null,x,d,_,null)}function E(y,g,x,I){let R=null;const A=x.isPointLight===!0?y.customDistanceMaterial:y.customDepthMaterial;if(A!==void 0)R=A;else if(R=x.isPointLight===!0?l:o,n.localClippingEnabled&&g.clipShadows===!0&&Array.isArray(g.clippingPlanes)&&g.clippingPlanes.length!==0||g.displacementMap&&g.displacementScale!==0||g.alphaMap&&g.alphaTest>0||g.map&&g.alphaTest>0||g.alphaToCoverage===!0){const F=R.uuid,N=g.uuid;let P=c[F];P===void 0&&(P={},c[F]=P);let B=P[N];B===void 0&&(B=R.clone(),P[N]=B,g.addEventListener("dispose",w)),R=B}if(R.visible=g.visible,R.wireframe=g.wireframe,I===gs?R.side=g.shadowSide!==null?g.shadowSide:g.side:R.side=g.shadowSide!==null?g.shadowSide:h[g.side],R.alphaMap=g.alphaMap,R.alphaTest=g.alphaToCoverage===!0?.5:g.alphaTest,R.map=g.map,R.clipShadows=g.clipShadows,R.clippingPlanes=g.clippingPlanes,R.clipIntersection=g.clipIntersection,R.displacementMap=g.displacementMap,R.displacementScale=g.displacementScale,R.displacementBias=g.displacementBias,R.wireframeLinewidth=g.wireframeLinewidth,R.linewidth=g.linewidth,x.isPointLight===!0&&R.isMeshDistanceMaterial===!0){const F=n.properties.get(R);F.light=x}return R}function T(y,g,x,I,R,A){if(y.visible===!1)return;if(y.layers.test(R)&&(y.isMesh||y.isLine||y.isPoints)&&(y.castShadow||y.receiveShadow&&A===gs)&&(!y.frustumCulled||y.intersectsFrustum(i))){y.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,y.matrixWorld);const P=e.update(y),B=y.material;if(Array.isArray(B)){const H=P.groups;for(let k=0,C=H.length;k<C;k++){const L=H[k],G=B[L.materialIndex];if(G&&G.visible){const $=E(y,G,I,A);y.onBeforeShadow(n,y,g,x,P,$,L),n.renderBufferDirect(x,null,P,$,y,L),y.onAfterShadow(n,y,g,x,P,$,L)}}}else if(B.visible){const H=E(y,B,I,A);y.onBeforeShadow(n,y,g,x,P,H,null),n.renderBufferDirect(x,null,P,H,y,null),y.onAfterShadow(n,y,g,x,P,H,null)}}const N=y.children;for(let P=0,B=N.length;P<B;P++)T(N[P],g,x,I,R,A)}function w(y){y.target.removeEventListener("dispose",w);for(const x in c){const I=c[x],R=y.target.uuid;R in I&&(I[R].dispose(),delete I[R])}}}function Vv(n,e){function t(){let U=!1;const Q=new St;let Z=null;const fe=new St(0,0,0,0);return{setMask:function(le){Z!==le&&!U&&(n.colorMask(le,le,le,le),Z=le)},setLocked:function(le){U=le},setClear:function(le,he,Ce,ze,oe){oe===!0&&(le*=ze,he*=ze,Ce*=ze),Q.set(le,he,Ce,ze),fe.equals(Q)===!1&&(n.clearColor(le,he,Ce,ze),fe.copy(Q))},reset:function(){U=!1,Z=null,fe.set(-1,0,0,0)}}}function i(){let U=!1,Q=!1,Z=null,fe=null,le=null;return{setReversed:function(he){if(Q!==he){const Ce=e.get("EXT_clip_control");he?Ce.clipControlEXT(Ce.LOWER_LEFT_EXT,Ce.ZERO_TO_ONE_EXT):Ce.clipControlEXT(Ce.LOWER_LEFT_EXT,Ce.NEGATIVE_ONE_TO_ONE_EXT),Q=he;const ze=le;le=null,this.setClear(ze)}},getReversed:function(){return Q},setTest:function(he){he?re(n.DEPTH_TEST):Ie(n.DEPTH_TEST)},setMask:function(he){Z!==he&&!U&&(n.depthMask(he),Z=he)},setFunc:function(he){if(Q&&(he=Td[he]),fe!==he){switch(he){case Va:n.depthFunc(n.NEVER);break;case Wa:n.depthFunc(n.ALWAYS);break;case Xa:n.depthFunc(n.LESS);break;case Ms:n.depthFunc(n.LEQUAL);break;case qa:n.depthFunc(n.EQUAL);break;case $a:n.depthFunc(n.GEQUAL);break;case Ya:n.depthFunc(n.GREATER);break;case Ka:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}fe=he}},setLocked:function(he){U=he},setClear:function(he){le!==he&&(le=he,Q&&(he=1-he),n.clearDepth(he))},reset:function(){U=!1,Z=null,fe=null,le=null,Q=!1}}}function s(){let U=!1,Q=null,Z=null,fe=null,le=null,he=null,Ce=null,ze=null,oe=null;return{setTest:function(Le){U||(Le?re(n.STENCIL_TEST):Ie(n.STENCIL_TEST))},setMask:function(Le){Q!==Le&&!U&&(n.stencilMask(Le),Q=Le)},setFunc:function(Le,He,_e){(Z!==Le||fe!==He||le!==_e)&&(n.stencilFunc(Le,He,_e),Z=Le,fe=He,le=_e)},setOp:function(Le,He,_e){(he!==Le||Ce!==He||ze!==_e)&&(n.stencilOp(Le,He,_e),he=Le,Ce=He,ze=_e)},setLocked:function(Le){U=Le},setClear:function(Le){oe!==Le&&(n.clearStencil(Le),oe=Le)},reset:function(){U=!1,Q=null,Z=null,fe=null,le=null,he=null,Ce=null,ze=null,oe=null}}}const r=new t,a=new i,o=new s;let l={};const c=new WeakMap;let f={},h={},u={},d=new WeakMap,m=[],_=null,p=!1,v=null,S=null,E=null,T=null,w=null,y=null,g=null,x=new st(0,0,0),I=0,R=!1,A=null,F=null,N=null,P=null,B=null;const H=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,C=0;const L=n.getParameter(n.VERSION);L.indexOf("WebGL")!==-1?(C=parseFloat(/^WebGL (\d)/.exec(L)[1]),k=C>=1):L.indexOf("OpenGL ES")!==-1&&(C=parseFloat(/^OpenGL ES (\d)/.exec(L)[1]),k=C>=2);let G=null,$={};const ie=n.getParameter(n.SCISSOR_BOX),ne=n.getParameter(n.VIEWPORT),X=new St().fromArray(ie),te=new St().fromArray(ne);function ge(U,Q,Z,fe){const le=new Uint8Array(4),he=n.createTexture();n.bindTexture(U,he),n.texParameteri(U,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(U,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ce=0;Ce<Z;Ce++)U===n.TEXTURE_3D||U===n.TEXTURE_2D_ARRAY?n.texImage3D(Q,0,n.RGBA,1,1,fe,0,n.RGBA,n.UNSIGNED_BYTE,le):n.texImage2D(Q+Ce,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,le);return he}const xe={};xe[n.TEXTURE_2D]=ge(n.TEXTURE_2D,n.TEXTURE_2D,1),xe[n.TEXTURE_CUBE_MAP]=ge(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),xe[n.TEXTURE_2D_ARRAY]=ge(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),xe[n.TEXTURE_3D]=ge(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),re(n.DEPTH_TEST),a.setFunc(Ms),Pe(!1),we(Dl),re(n.CULL_FACE),dt(Kn);function re(U){f[U]!==!0&&(n.enable(U),f[U]=!0)}function Ie(U){f[U]!==!1&&(n.disable(U),f[U]=!1)}function lt(U,Q){return u[U]!==Q?(n.bindFramebuffer(U,Q),u[U]=Q,U===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=Q),U===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=Q),!0):!1}function Ae(U,Q){let Z=m,fe=!1;if(U){Z=d.get(Q),Z===void 0&&(Z=[],d.set(Q,Z));const le=U.textures;if(Z.length!==le.length||Z[0]!==n.COLOR_ATTACHMENT0){for(let he=0,Ce=le.length;he<Ce;he++)Z[he]=n.COLOR_ATTACHMENT0+he;Z.length=le.length,fe=!0}}else Z[0]!==n.BACK&&(Z[0]=n.BACK,fe=!0);fe&&n.drawBuffers(Z)}function Ve(U){return _!==U?(n.useProgram(U),_=U,!0):!1}const Xe={[ki]:n.FUNC_ADD,[Zf]:n.FUNC_SUBTRACT,[sh]:n.FUNC_REVERSE_SUBTRACT};Xe[Jf]=n.MIN,Xe[jf]=n.MAX;const Ne={[Qf]:n.ZERO,[Ga]:n.ONE,[ed]:n.SRC_COLOR,[rh]:n.SRC_ALPHA,[ad]:n.SRC_ALPHA_SATURATE,[sd]:n.DST_COLOR,[id]:n.DST_ALPHA,[td]:n.ONE_MINUS_SRC_COLOR,[Rr]:n.ONE_MINUS_SRC_ALPHA,[rd]:n.ONE_MINUS_DST_COLOR,[nd]:n.ONE_MINUS_DST_ALPHA,[od]:n.CONSTANT_COLOR,[ld]:n.ONE_MINUS_CONSTANT_COLOR,[cd]:n.CONSTANT_ALPHA,[hd]:n.ONE_MINUS_CONSTANT_ALPHA};function dt(U,Q,Z,fe,le,he,Ce,ze,oe,Le){if(U===Kn){p===!0&&(Ie(n.BLEND),p=!1);return}if(p===!1&&(re(n.BLEND),p=!0),U!==nh){if(U!==v||Le!==R){if((S!==ki||w!==ki)&&(n.blendEquation(n.FUNC_ADD),S=ki,w=ki),Le)switch(U){case Ss:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Nl:n.blendFunc(n.ONE,n.ONE);break;case Ul:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Fl:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:it("WebGLState: Invalid blending: ",U);break}else switch(U){case Ss:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Nl:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Ul:it("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Fl:it("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:it("WebGLState: Invalid blending: ",U);break}E=null,T=null,y=null,g=null,x.set(0,0,0),I=0,v=U,R=Le}return}le=le||Q,he=he||Z,Ce=Ce||fe,(Q!==S||le!==w)&&(n.blendEquationSeparate(Xe[Q],Xe[le]),S=Q,w=le),(Z!==E||fe!==T||he!==y||Ce!==g)&&(n.blendFuncSeparate(Ne[Z],Ne[fe],Ne[he],Ne[Ce]),E=Z,T=fe,y=he,g=Ce),(ze.equals(x)===!1||oe!==I)&&(n.blendColor(ze.r,ze.g,ze.b,oe),x.copy(ze),I=oe),v=U,R=!1}function ae(U,Q){U.side===_i?Ie(n.CULL_FACE):re(n.CULL_FACE);let Z=U.side===Zt;Q&&(Z=!Z),Pe(Z),U.blending===Ss&&U.transparent===!1?dt(Kn):dt(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),a.setFunc(U.depthFunc),a.setTest(U.depthTest),a.setMask(U.depthWrite),r.setMask(U.colorWrite);const fe=U.stencilWrite;o.setTest(fe),fe&&(o.setMask(U.stencilWriteMask),o.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),o.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),pt(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?re(n.SAMPLE_ALPHA_TO_COVERAGE):Ie(n.SAMPLE_ALPHA_TO_COVERAGE)}function Pe(U){A!==U&&(U?n.frontFace(n.CW):n.frontFace(n.CCW),A=U)}function we(U){U!==$f?(re(n.CULL_FACE),U!==F&&(U===Dl?n.cullFace(n.BACK):U===Yf?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Ie(n.CULL_FACE),F=U}function rt(U){U!==N&&(k&&n.lineWidth(U),N=U)}function pt(U,Q,Z){U?(re(n.POLYGON_OFFSET_FILL),(P!==Q||B!==Z)&&(P=Q,B=Z,a.getReversed()&&(Q=-Q,Z=-Z),n.polygonOffset(Q,Z))):Ie(n.POLYGON_OFFSET_FILL)}function Ft(U){U?re(n.SCISSOR_TEST):Ie(n.SCISSOR_TEST)}function Je(U){U===void 0&&(U=n.TEXTURE0+H-1),G!==U&&(n.activeTexture(U),G=U)}function Ot(U,Q,Z){Z===void 0&&(G===null?Z=n.TEXTURE0+H-1:Z=G);let fe=$[Z];fe===void 0&&(fe={type:void 0,texture:void 0},$[Z]=fe),(fe.type!==U||fe.texture!==Q)&&(G!==Z&&(n.activeTexture(Z),G=Z),n.bindTexture(U,Q||xe[U]),fe.type=U,fe.texture=Q)}function z(){const U=$[G];U!==void 0&&U.type!==void 0&&(n.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function ni(){try{n.compressedTexImage2D(...arguments)}catch(U){it("WebGLState:",U)}}function vt(){try{n.compressedTexImage3D(...arguments)}catch(U){it("WebGLState:",U)}}function xt(){try{n.texSubImage2D(...arguments)}catch(U){it("WebGLState:",U)}}function ve(){try{n.texSubImage3D(...arguments)}catch(U){it("WebGLState:",U)}}function Tt(){try{n.compressedTexSubImage2D(...arguments)}catch(U){it("WebGLState:",U)}}function De(){try{n.compressedTexSubImage3D(...arguments)}catch(U){it("WebGLState:",U)}}function Fe(){try{n.texStorage2D(...arguments)}catch(U){it("WebGLState:",U)}}function D(){try{n.texStorage3D(...arguments)}catch(U){it("WebGLState:",U)}}function M(){try{n.texImage2D(...arguments)}catch(U){it("WebGLState:",U)}}function W(){try{n.texImage3D(...arguments)}catch(U){it("WebGLState:",U)}}function se(U){return h[U]!==void 0?h[U]:n.getParameter(U)}function ee(U,Q){h[U]!==Q&&(n.pixelStorei(U,Q),h[U]=Q)}function ce(U){X.equals(U)===!1&&(n.scissor(U.x,U.y,U.z,U.w),X.copy(U))}function pe(U){te.equals(U)===!1&&(n.viewport(U.x,U.y,U.z,U.w),te.copy(U))}function J(U,Q){let Z=c.get(Q);Z===void 0&&(Z=new WeakMap,c.set(Q,Z));let fe=Z.get(U);fe===void 0&&(fe=n.getUniformBlockIndex(Q,U.name),n.uniformBlockBinding(Q,fe,fe),Z.set(U,fe))}function j(U,Q,Z){const le=c.get(Q).get(U);l[le]!==Z&&(n.bindBufferBase(n.UNIFORM_BUFFER,le,Z),l[le]=Z)}function ue(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),f={},h={},G=null,$={},u={},l={},d=new WeakMap,m=[],_=null,p=!1,v=null,S=null,E=null,T=null,w=null,y=null,g=null,x=new st(0,0,0),I=0,R=!1,A=null,F=null,N=null,P=null,B=null,X.set(0,0,n.canvas.width,n.canvas.height),te.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:re,disable:Ie,bindFramebuffer:lt,drawBuffers:Ae,useProgram:Ve,setBlending:dt,setMaterial:ae,setFlipSided:Pe,setCullFace:we,setLineWidth:rt,setPolygonOffset:pt,setScissorTest:Ft,activeTexture:Je,bindTexture:Ot,unbindTexture:z,compressedTexImage2D:ni,compressedTexImage3D:vt,texImage2D:M,texImage3D:W,pixelStorei:ee,getParameter:se,updateUBOMapping:J,uniformBlockBinding:j,texStorage2D:Fe,texStorage3D:D,texSubImage2D:xt,texSubImage3D:ve,compressedTexSubImage2D:Tt,compressedTexSubImage3D:De,scissor:ce,viewport:pe,reset:ue}}function Wv(n,e,t,i,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new nt,f=new WeakMap,h=new Set;let u;const d=new WeakMap,m=new Set,_=new FinalizationRegistry(D=>m.delete(D));let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(D,M){return p?new OffscreenCanvas(D,M):Nr("canvas")}function S(D,M,W){let se=1;const ee=Fe(D);if((ee.width>W||ee.height>W)&&(se=W/Math.max(ee.width,ee.height)),se<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){const ce=Math.floor(se*ee.width),pe=Math.floor(se*ee.height);u===void 0&&(u=v(ce,pe));const J=M?v(ce,pe):u;return J.width=ce,J.height=pe,J.getContext("2d").drawImage(D,0,0,ce,pe),Ue("WebGLRenderer: Texture has been resized from ("+ee.width+"x"+ee.height+") to ("+ce+"x"+pe+")."),J}else return"data"in D&&Ue("WebGLRenderer: Image in DataTexture is too big ("+ee.width+"x"+ee.height+")."),D;return D}function E(D){return D.generateMipmaps}function T(D){n.generateMipmap(D)}function w(D){return D.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:D.isWebGL3DRenderTarget?n.TEXTURE_3D:D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function y(D,M,W,se,ee,ce=!1){if(D!==null){if(n[D]!==void 0)return n[D];Ue("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let pe;se&&(pe=e.get("EXT_texture_norm16"),pe||Ue("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let J=M;if(M===n.RED&&(W===n.FLOAT&&(J=n.R32F),W===n.HALF_FLOAT&&(J=n.R16F),W===n.UNSIGNED_BYTE&&(J=n.R8),W===n.UNSIGNED_SHORT&&pe&&(J=pe.R16_EXT),W===n.SHORT&&pe&&(J=pe.R16_SNORM_EXT)),M===n.RED_INTEGER&&(W===n.UNSIGNED_BYTE&&(J=n.R8UI),W===n.UNSIGNED_SHORT&&(J=n.R16UI),W===n.UNSIGNED_INT&&(J=n.R32UI),W===n.BYTE&&(J=n.R8I),W===n.SHORT&&(J=n.R16I),W===n.INT&&(J=n.R32I)),M===n.RG&&(W===n.FLOAT&&(J=n.RG32F),W===n.HALF_FLOAT&&(J=n.RG16F),W===n.UNSIGNED_BYTE&&(J=n.RG8),W===n.UNSIGNED_SHORT&&pe&&(J=pe.RG16_EXT),W===n.SHORT&&pe&&(J=pe.RG16_SNORM_EXT)),M===n.RG_INTEGER&&(W===n.UNSIGNED_BYTE&&(J=n.RG8UI),W===n.UNSIGNED_SHORT&&(J=n.RG16UI),W===n.UNSIGNED_INT&&(J=n.RG32UI),W===n.BYTE&&(J=n.RG8I),W===n.SHORT&&(J=n.RG16I),W===n.INT&&(J=n.RG32I)),M===n.RGB_INTEGER&&(W===n.UNSIGNED_BYTE&&(J=n.RGB8UI),W===n.UNSIGNED_SHORT&&(J=n.RGB16UI),W===n.UNSIGNED_INT&&(J=n.RGB32UI),W===n.BYTE&&(J=n.RGB8I),W===n.SHORT&&(J=n.RGB16I),W===n.INT&&(J=n.RGB32I)),M===n.RGBA_INTEGER&&(W===n.UNSIGNED_BYTE&&(J=n.RGBA8UI),W===n.UNSIGNED_SHORT&&(J=n.RGBA16UI),W===n.UNSIGNED_INT&&(J=n.RGBA32UI),W===n.BYTE&&(J=n.RGBA8I),W===n.SHORT&&(J=n.RGBA16I),W===n.INT&&(J=n.RGBA32I)),M===n.RGB&&(W===n.UNSIGNED_SHORT&&pe&&(J=pe.RGB16_EXT),W===n.SHORT&&pe&&(J=pe.RGB16_SNORM_EXT),W===n.UNSIGNED_INT_5_9_9_9_REV&&(J=n.RGB9_E5),W===n.UNSIGNED_INT_10F_11F_11F_REV&&(J=n.R11F_G11F_B10F)),M===n.RGBA){const j=ce?Ir:Ke.getTransfer(ee);W===n.FLOAT&&(J=n.RGBA32F),W===n.HALF_FLOAT&&(J=n.RGBA16F),W===n.UNSIGNED_BYTE&&(J=j===ot?n.SRGB8_ALPHA8:n.RGBA8),W===n.UNSIGNED_SHORT&&pe&&(J=pe.RGBA16_EXT),W===n.SHORT&&pe&&(J=pe.RGBA16_SNORM_EXT),W===n.UNSIGNED_SHORT_4_4_4_4&&(J=n.RGBA4),W===n.UNSIGNED_SHORT_5_5_5_1&&(J=n.RGB5_A1)}return(J===n.R16F||J===n.R32F||J===n.RG16F||J===n.RG32F||J===n.RGBA16F||J===n.RGBA32F)&&e.get("EXT_color_buffer_float"),J}function g(D,M){let W;return D?M===null||M===Ii||M===Qn?W=n.DEPTH24_STENCIL8:M===Ci?W=n.DEPTH32F_STENCIL8:M===bs&&(W=n.DEPTH24_STENCIL8,Ue("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===Ii||M===Qn?W=n.DEPTH_COMPONENT24:M===Ci?W=n.DEPTH_COMPONENT32F:M===bs&&(W=n.DEPTH_COMPONENT16),W}function x(D,M){return E(D)===!0||D.isFramebufferTexture&&D.minFilter!==Lt&&D.minFilter!==Kt?Math.log2(Math.max(M.width,M.height))+1:D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?M.mipmaps.length:1}function I(D){const M=new WeakRef(D);i.get(D).__ref=M,m.add(M),_.register(D,M,M)}function R(D){const M=i.get(D).__ref;M!==void 0&&(m.delete(M),_.unregister(M))}function A(D){N(D.target)}function F(D){P(D.target)}function N(D){D.removeEventListener("dispose",A),R(D),H(D),D.isVideoTexture&&f.delete(D),D.isHTMLTexture&&h.delete(D)}function P(D){D.removeEventListener("dispose",F),R(D),C(D)}function B(){for(const D of m){const M=D.deref();M!==void 0&&(M.isRenderTarget===!0?P(M):N(M))}m.clear(),h.clear()}function H(D){const M=i.get(D);if(M.__webglInit===void 0)return;const W=D.source,se=d.get(W);if(se){const ee=se[M.__cacheKey];ee.usedTimes--,ee.usedTimes===0&&k(D),Object.keys(se).length===0&&d.delete(W)}i.remove(D)}function k(D){const M=i.get(D);n.deleteTexture(M.__webglTexture);const W=D.source,se=d.get(W);delete se[M.__cacheKey],a.memory.textures--}function C(D){const M=i.get(D);M.__depthDisposeCallback&&M.__depthDisposeCallback();const W=D.depthTexture;if(W&&W.renderTarget===D&&N(W),D.isWebGLCubeRenderTarget)for(let ee=0;ee<6;ee++){if(Array.isArray(M.__webglFramebuffer[ee]))for(let ce=0;ce<M.__webglFramebuffer[ee].length;ce++)n.deleteFramebuffer(M.__webglFramebuffer[ee][ce]);else n.deleteFramebuffer(M.__webglFramebuffer[ee]);M.__webglDepthbuffer&&n.deleteRenderbuffer(M.__webglDepthbuffer[ee])}else{if(Array.isArray(M.__webglFramebuffer))for(let ee=0;ee<M.__webglFramebuffer.length;ee++)n.deleteFramebuffer(M.__webglFramebuffer[ee]);else n.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&n.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&n.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let ee=0;ee<M.__webglColorRenderbuffer.length;ee++)M.__webglColorRenderbuffer[ee]&&n.deleteRenderbuffer(M.__webglColorRenderbuffer[ee]);M.__webglDepthRenderbuffer&&n.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const se=D.textures;for(let ee=0,ce=se.length;ee<ce;ee++){const pe=i.get(se[ee]);pe.__webglTexture&&(n.deleteTexture(pe.__webglTexture),a.memory.textures--),i.remove(se[ee])}i.remove(D)}let L=0;function G(){L=0}function $(){return L}function ie(D){L=D}function ne(){const D=L;return D>=s.maxTextures&&Ue("WebGLTextures: Trying to use "+(D+1)+" texture units while this GPU supports only "+s.maxTextures),L+=1,D}function X(D){const M=[];return M.push(D.wrapS),M.push(D.wrapT),M.push(D.wrapR||0),M.push(D.magFilter),M.push(D.minFilter),M.push(D.anisotropy),M.push(D.internalFormat),M.push(D.format),M.push(D.type),M.push(D.generateMipmaps),M.push(D.mipmapsAutoUpdate),M.push(D.premultiplyAlpha),M.push(D.flipY),M.push(D.unpackAlignment),M.push(D.colorSpace),M.join()}function te(D,M){const W=i.get(D);if(D.isVideoTexture&&Tt(D),D.isRenderTargetTexture===!1&&D.isExternalTexture!==!0&&D.version>0&&W.__version!==D.version){const se=D.image;if(se===null)Ue("WebGLRenderer: Texture marked for update but no image data found.");else if(se.complete===!1)Ue("WebGLRenderer: Texture marked for update but image is incomplete");else{ae(W,D,M);return}}else D.isExternalTexture&&(W.__webglTexture=D.sourceTexture?D.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,W.__webglTexture,n.TEXTURE0+M)}function ge(D,M){const W=i.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&W.__version!==D.version){ae(W,D,M);return}else D.isExternalTexture&&(W.__webglTexture=D.sourceTexture?D.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,W.__webglTexture,n.TEXTURE0+M)}function xe(D,M){const W=i.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&W.__version!==D.version){ae(W,D,M);return}t.bindTexture(n.TEXTURE_3D,W.__webglTexture,n.TEXTURE0+M)}function re(D,M){const W=i.get(D);if(D.version>0&&W.__version!==D.version){Pe(W,D,M);return}t.bindTexture(n.TEXTURE_CUBE_MAP,W.__webglTexture,n.TEXTURE0+M)}const Ie={[Za]:n.REPEAT,[Ri]:n.CLAMP_TO_EDGE,[Ja]:n.MIRRORED_REPEAT},lt={[Lt]:n.NEAREST,[dd]:n.NEAREST_MIPMAP_NEAREST,[ks]:n.NEAREST_MIPMAP_LINEAR,[Kt]:n.LINEAR,[aa]:n.LINEAR_MIPMAP_NEAREST,[nn]:n.LINEAR_MIPMAP_LINEAR},Ae={[vd]:n.NEVER,[wh]:n.ALWAYS,[xd]:n.LESS,[Sh]:n.LEQUAL,[_d]:n.EQUAL,[Mh]:n.GEQUAL,[yd]:n.GREATER,[Sd]:n.NOTEQUAL};function Ve(D,M){if(M.type===Ci&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===Kt||M.magFilter===aa||M.magFilter===ks||M.magFilter===nn||M.minFilter===Kt||M.minFilter===aa||M.minFilter===ks||M.minFilter===nn)&&Ue("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(D,n.TEXTURE_WRAP_S,Ie[M.wrapS]),n.texParameteri(D,n.TEXTURE_WRAP_T,Ie[M.wrapT]),(D===n.TEXTURE_3D||D===n.TEXTURE_2D_ARRAY)&&n.texParameteri(D,n.TEXTURE_WRAP_R,Ie[M.wrapR]),n.texParameteri(D,n.TEXTURE_MAG_FILTER,lt[M.magFilter]),n.texParameteri(D,n.TEXTURE_MIN_FILTER,lt[M.minFilter]),M.compareFunction&&(n.texParameteri(D,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(D,n.TEXTURE_COMPARE_FUNC,Ae[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===Lt||M.minFilter!==ks&&M.minFilter!==nn||M.type===Ci&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||i.get(M).__currentAnisotropy){const W=e.get("EXT_texture_filter_anisotropic");n.texParameterf(D,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,s.getMaxAnisotropy())),i.get(M).__currentAnisotropy=M.anisotropy}}}function Xe(D,M){let W=!1;D.__webglInit===void 0&&(D.__webglInit=!0,M.addEventListener("dispose",A),I(M));const se=M.source;let ee=d.get(se);ee===void 0&&(ee={},d.set(se,ee));const ce=X(M);if(ce!==D.__cacheKey){ee[ce]===void 0&&(ee[ce]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,W=!0),ee[ce].usedTimes++;const pe=ee[D.__cacheKey];pe!==void 0&&(ee[D.__cacheKey].usedTimes--,pe.usedTimes===0&&k(M)),D.__cacheKey=ce,D.__webglTexture=ee[ce].texture}return W}function Ne(D,M,W){return Math.floor(Math.floor(D/W)/M)}function dt(D,M,W,se){const ce=D.updateRanges;if(ce.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,M.width,M.height,W,se,M.data);else{ce.sort((U,Q)=>U.start-Q.start);let pe=0;for(let U=1;U<ce.length;U++){const Q=ce[pe],Z=ce[U],fe=Q.start+Q.count,le=Ne(Z.start,M.width,4),he=Ne(Q.start,M.width,4);Z.start<=fe+1&&le===he&&Ne(Z.start+Z.count-1,M.width,4)===le?Q.count=Math.max(Q.count,Z.start+Z.count-Q.start):(++pe,ce[pe]=Z)}ce.length=pe+1;const J=t.getParameter(n.UNPACK_ROW_LENGTH),j=t.getParameter(n.UNPACK_SKIP_PIXELS),ue=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,M.width);for(let U=0,Q=ce.length;U<Q;U++){const Z=ce[U],fe=Math.floor(Z.start/4),le=Math.ceil(Z.count/4),he=fe%M.width,Ce=Math.floor(fe/M.width),ze=le,oe=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,he),t.pixelStorei(n.UNPACK_SKIP_ROWS,Ce),t.texSubImage2D(n.TEXTURE_2D,0,he,Ce,ze,oe,W,se,M.data)}D.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,J),t.pixelStorei(n.UNPACK_SKIP_PIXELS,j),t.pixelStorei(n.UNPACK_SKIP_ROWS,ue)}}function ae(D,M,W){let se=n.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(se=n.TEXTURE_2D_ARRAY),M.isData3DTexture&&(se=n.TEXTURE_3D);const ee=Xe(D,M),ce=M.source;t.bindTexture(se,D.__webglTexture,n.TEXTURE0+W);const pe=i.get(ce);if(ce.version!==pe.__version||ee===!0){if(t.activeTexture(n.TEXTURE0+W),(typeof ImageBitmap<"u"&&M.image instanceof ImageBitmap)===!1){const oe=Ke.getPrimaries(Ke.workingColorSpace),Le=M.colorSpace===en?null:Ke.getPrimaries(M.colorSpace),He=M.colorSpace===en||oe===Le?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,He)}t.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment);let j=S(M.image,!1,s.maxTextureSize);j=De(M,j);const ue=r.convert(M.format,M.colorSpace),U=r.convert(M.type);let Q=y(M.internalFormat,ue,U,M.normalized,M.colorSpace,M.isVideoTexture);Ve(se,M);let Z;const fe=M.mipmaps,le=M.isVideoTexture!==!0,he=pe.__version===void 0||ee===!0,Ce=ce.dataReady,ze=x(M,j);if(M.isDepthTexture)Q=g(M.format===sn,M.type),he&&(le?t.texStorage2D(n.TEXTURE_2D,1,Q,j.width,j.height):t.texImage2D(n.TEXTURE_2D,0,Q,j.width,j.height,0,ue,U,null));else if(M.isDataTexture)if(fe.length>0){le&&he&&t.texStorage2D(n.TEXTURE_2D,ze,Q,fe[0].width,fe[0].height);for(let oe=0,Le=fe.length;oe<Le;oe++)Z=fe[oe],le?Ce&&t.texSubImage2D(n.TEXTURE_2D,oe,0,0,Z.width,Z.height,ue,U,Z.data):t.texImage2D(n.TEXTURE_2D,oe,Q,Z.width,Z.height,0,ue,U,Z.data);M.generateMipmaps=!1}else le?(he&&t.texStorage2D(n.TEXTURE_2D,ze,Q,j.width,j.height),Ce&&dt(M,j,ue,U)):t.texImage2D(n.TEXTURE_2D,0,Q,j.width,j.height,0,ue,U,j.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){le&&he&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ze,Q,fe[0].width,fe[0].height,j.depth);for(let oe=0,Le=fe.length;oe<Le;oe++)if(Z=fe[oe],M.format!==Si)if(ue!==null)if(le){if(Ce)if(M.layerUpdates.size>0){const He=sc(Z.width,Z.height,M.format,M.type);for(const _e of M.layerUpdates){const at=Z.data.subarray(_e*He/Z.data.BYTES_PER_ELEMENT,(_e+1)*He/Z.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,oe,0,0,_e,Z.width,Z.height,1,ue,at)}}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,oe,0,0,0,Z.width,Z.height,j.depth,ue,Z.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,oe,Q,Z.width,Z.height,j.depth,0,Z.data,0,0);else Ue("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else le?Ce&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,oe,0,0,0,Z.width,Z.height,j.depth,ue,U,Z.data):t.texImage3D(n.TEXTURE_2D_ARRAY,oe,Q,Z.width,Z.height,j.depth,0,ue,U,Z.data);M.layerUpdates.size>0&&M.clearLayerUpdates()}else{le&&he&&t.texStorage2D(n.TEXTURE_2D,ze,Q,fe[0].width,fe[0].height);for(let oe=0,Le=fe.length;oe<Le;oe++)Z=fe[oe],M.format!==Si?ue!==null?le?Ce&&t.compressedTexSubImage2D(n.TEXTURE_2D,oe,0,0,Z.width,Z.height,ue,Z.data):t.compressedTexImage2D(n.TEXTURE_2D,oe,Q,Z.width,Z.height,0,Z.data):Ue("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):le?Ce&&t.texSubImage2D(n.TEXTURE_2D,oe,0,0,Z.width,Z.height,ue,U,Z.data):t.texImage2D(n.TEXTURE_2D,oe,Q,Z.width,Z.height,0,ue,U,Z.data)}else if(M.isDataArrayTexture)if(le){if(he&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ze,Q,j.width,j.height,j.depth),Ce)if(M.layerUpdates.size>0){const oe=sc(j.width,j.height,M.format,M.type);for(const Le of M.layerUpdates){const He=j.data.subarray(Le*oe/j.data.BYTES_PER_ELEMENT,(Le+1)*oe/j.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Le,j.width,j.height,1,ue,U,He)}M.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,j.width,j.height,j.depth,ue,U,j.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Q,j.width,j.height,j.depth,0,ue,U,j.data);else if(M.isData3DTexture)le?(he&&t.texStorage3D(n.TEXTURE_3D,ze,Q,j.width,j.height,j.depth),Ce&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,j.width,j.height,j.depth,ue,U,j.data)):t.texImage3D(n.TEXTURE_3D,0,Q,j.width,j.height,j.depth,0,ue,U,j.data);else if(M.isFramebufferTexture){if(he)if(le)t.texStorage2D(n.TEXTURE_2D,ze,Q,j.width,j.height);else{let oe=j.width,Le=j.height;for(let He=0;He<ze;He++)t.texImage2D(n.TEXTURE_2D,He,Q,oe,Le,0,ue,U,null),oe>>=1,Le>>=1}}else if(M.isHTMLTexture){if("texElementImage2D"in n){const oe=n.canvas;if(oe.hasAttribute("layoutsubtree")||oe.setAttribute("layoutsubtree","true"),j.parentNode!==oe){oe.appendChild(j),h.add(M),oe.onpaint=Le=>{const He=Le.changedElements;for(const _e of h)He.includes(_e.image)&&(_e.needsUpdate=!0)},oe.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,j);else{const He=n.RGBA,_e=n.RGBA,at=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,He,_e,at,j)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(fe.length>0){if(le&&he){const oe=Fe(fe[0]);t.texStorage2D(n.TEXTURE_2D,ze,Q,oe.width,oe.height)}for(let oe=0,Le=fe.length;oe<Le;oe++)Z=fe[oe],le?Ce&&t.texSubImage2D(n.TEXTURE_2D,oe,0,0,ue,U,Z):t.texImage2D(n.TEXTURE_2D,oe,Q,ue,U,Z);M.generateMipmaps=!1}else if(le){if(he){const oe=Fe(j);t.texStorage2D(n.TEXTURE_2D,ze,Q,oe.width,oe.height)}Ce&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ue,U,j)}else t.texImage2D(n.TEXTURE_2D,0,Q,ue,U,j);E(M)&&M.mipmapsAutoUpdate===!0&&T(se),pe.__version=ce.version,M.onUpdate&&M.onUpdate(M)}D.__version=M.version}function Pe(D,M,W){if(M.image.length!==6)return;const se=Xe(D,M),ee=M.source;t.bindTexture(n.TEXTURE_CUBE_MAP,D.__webglTexture,n.TEXTURE0+W);const ce=i.get(ee);if(ee.version!==ce.__version||se===!0){t.activeTexture(n.TEXTURE0+W);const pe=Ke.getPrimaries(Ke.workingColorSpace),J=M.colorSpace===en?null:Ke.getPrimaries(M.colorSpace),j=M.colorSpace===en||pe===J?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,j);const ue=M.isCompressedTexture||M.image[0].isCompressedTexture,U=M.image[0]&&M.image[0].isDataTexture,Q=[];for(let _e=0;_e<6;_e++)!ue&&!U?Q[_e]=S(M.image[_e],!0,s.maxCubemapSize):Q[_e]=U?M.image[_e].image:M.image[_e],Q[_e]=De(M,Q[_e]);const Z=Q[0],fe=r.convert(M.format,M.colorSpace),le=r.convert(M.type);let he=y(M.internalFormat,fe,le,M.normalized,M.colorSpace);const Ce=M.isVideoTexture!==!0,ze=ce.__version===void 0||se===!0,oe=ee.dataReady;let Le=x(M,Z);Ve(n.TEXTURE_CUBE_MAP,M);let He;if(M.isDepthTexture){if(he=g(M.format===sn,M.type),ze)if(Ce)t.texStorage2D(n.TEXTURE_CUBE_MAP,1,he,Z.width,Z.height);else for(let _e=0;_e<6;_e++)t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,he,Z.width,Z.height,0,fe,le,null)}else if(ue){Ce&&ze&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Le,he,Z.width,Z.height);for(let _e=0;_e<6;_e++){He=Q[_e].mipmaps;for(let at=0;at<He.length;at++){const Ct=He[at];M.format!==Si?fe!==null?Ce?oe&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+_e,at,0,0,Ct.width,Ct.height,fe,Ct.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+_e,at,he,Ct.width,Ct.height,0,Ct.data):Ue("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ce?oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+_e,at,0,0,Ct.width,Ct.height,fe,le,Ct.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+_e,at,he,Ct.width,Ct.height,0,fe,le,Ct.data)}}}else{if(He=M.mipmaps,Ce&&ze){He.length>0&&Le++;const _e=Fe(Q[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Le,he,_e.width,_e.height)}for(let _e=0;_e<6;_e++)if(U){Ce?oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,0,0,Q[_e].width,Q[_e].height,fe,le,Q[_e].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,he,Q[_e].width,Q[_e].height,0,fe,le,Q[_e].data);for(let at=0;at<He.length;at++){const Vi=He[at].image[_e].image;Ce?oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+_e,at+1,0,0,Vi.width,Vi.height,fe,le,Vi.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+_e,at+1,he,Vi.width,Vi.height,0,fe,le,Vi.data)}}else{Ce?oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,0,0,fe,le,Q[_e]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,he,fe,le,Q[_e]);for(let at=0;at<He.length;at++){const Ct=He[at];Ce?oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+_e,at+1,0,0,fe,le,Ct.image[_e]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+_e,at+1,he,fe,le,Ct.image[_e])}}}E(M)&&M.mipmapsAutoUpdate===!0&&T(n.TEXTURE_CUBE_MAP),ce.__version=ee.version,M.onUpdate&&M.onUpdate(M)}D.__version=M.version}function we(D,M,W,se,ee,ce){const pe=r.convert(W.format,W.colorSpace),J=r.convert(W.type),j=y(W.internalFormat,pe,J,W.normalized,W.colorSpace),ue=i.get(M),U=i.get(W);if(U.__renderTarget=M,!ue.__hasExternalTextures){const Q=Math.max(1,M.width>>ce),Z=Math.max(1,M.height>>ce);ee===n.TEXTURE_3D||ee===n.TEXTURE_2D_ARRAY?t.texImage3D(ee,ce,j,Q,Z,M.depth,0,pe,J,null):t.texImage2D(ee,ce,j,Q,Z,0,pe,J,null)}t.bindFramebuffer(n.FRAMEBUFFER,D),ve(M)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,se,ee,U.__webglTexture,0,xt(M)):(ee===n.TEXTURE_2D||ee>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ee<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,se,ee,U.__webglTexture,ce),t.bindFramebuffer(n.FRAMEBUFFER,null)}function rt(D,M,W){if(n.bindRenderbuffer(n.RENDERBUFFER,D),M.depthBuffer){const se=M.depthTexture,ee=se&&se.isDepthTexture?se.type:null,ce=g(M.stencilBuffer,ee),pe=M.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;ve(M)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,xt(M),ce,M.width,M.height):W?n.renderbufferStorageMultisample(n.RENDERBUFFER,xt(M),ce,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,ce,M.width,M.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,pe,n.RENDERBUFFER,D)}else{const se=M.textures;for(let ee=0;ee<se.length;ee++){const ce=se[ee],pe=r.convert(ce.format,ce.colorSpace),J=r.convert(ce.type),j=y(ce.internalFormat,pe,J,ce.normalized,ce.colorSpace);ve(M)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,xt(M),j,M.width,M.height):W?n.renderbufferStorageMultisample(n.RENDERBUFFER,xt(M),j,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,j,M.width,M.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function pt(D,M,W){const se=M.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,D),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const ee=i.get(M.depthTexture);ee.__renderTarget=M;const ce=se?M.depthTexture.image[0]:M.depthTexture.image;(!ee.__webglTexture||ce.width!==M.width||ce.height!==M.height)&&(ce.width=M.width,ce.height=M.height,M.depthTexture.needsUpdate=!0),se?re(M.depthTexture,0):te(M.depthTexture,0);const pe=ee.__webglTexture,J=xt(M),j=se?n.TEXTURE_CUBE_MAP_POSITIVE_X+W:n.TEXTURE_2D,ue=M.depthTexture.format===sn?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(M.depthTexture.format===rn)ve(M)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ue,j,pe,0,J):n.framebufferTexture2D(n.FRAMEBUFFER,ue,j,pe,0);else if(M.depthTexture.format===sn)ve(M)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ue,j,pe,0,J):n.framebufferTexture2D(n.FRAMEBUFFER,ue,j,pe,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Ft(D){const M=i.get(D),W=D.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==D.depthTexture){const se=D.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),se){const ee=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,se.removeEventListener("dispose",ee)};se.addEventListener("dispose",ee),M.__depthDisposeCallback=ee}M.__boundDepthTexture=se}if(D.depthTexture&&!M.__autoAllocateDepthBuffer)if(W)for(let se=0;se<6;se++)pt(M.__webglFramebuffer[se],D,se);else D.texture.mipmaps.length>0?pt(M.__webglFramebuffer[0],D,0):pt(M.__webglFramebuffer,D,0);else if(W){M.__webglDepthbuffer=[];for(let se=0;se<6;se++)if(t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer[se]),M.__webglDepthbuffer[se]===void 0)M.__webglDepthbuffer[se]=n.createRenderbuffer(),rt(M.__webglDepthbuffer[se],D,!1);else{const ee=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ce=M.__webglDepthbuffer[se];n.bindRenderbuffer(n.RENDERBUFFER,ce),n.framebufferRenderbuffer(n.FRAMEBUFFER,ee,n.RENDERBUFFER,ce)}}else if(D.texture.mipmaps.length>0?t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=n.createRenderbuffer(),rt(M.__webglDepthbuffer,D,!1);else{const ee=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ce=M.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ce),n.framebufferRenderbuffer(n.FRAMEBUFFER,ee,n.RENDERBUFFER,ce)}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Je(D,M,W){const se=i.get(D);M!==void 0&&we(se.__webglFramebuffer,D,D.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),W!==void 0&&Ft(D)}function Ot(D){const M=D.texture,W=i.get(D),se=i.get(M);D.addEventListener("dispose",F),I(D);const ee=D.textures,ce=D.isWebGLCubeRenderTarget===!0,pe=ee.length>1;if(pe||(se.__webglTexture===void 0&&(se.__webglTexture=n.createTexture()),se.__version=M.version,a.memory.textures++),ce){W.__webglFramebuffer=[];for(let J=0;J<6;J++)if(M.mipmaps.length>0){W.__webglFramebuffer[J]=[];for(let j=0;j<M.mipmaps.length;j++)W.__webglFramebuffer[J][j]=n.createFramebuffer()}else W.__webglFramebuffer[J]=n.createFramebuffer()}else{if(M.mipmaps.length>0){W.__webglFramebuffer=[];for(let J=0;J<M.mipmaps.length;J++)W.__webglFramebuffer[J]=n.createFramebuffer()}else W.__webglFramebuffer=n.createFramebuffer();if(pe)for(let J=0,j=ee.length;J<j;J++){const ue=i.get(ee[J]);ue.__webglTexture===void 0&&(ue.__webglTexture=n.createTexture(),a.memory.textures++)}if(D.samples>0&&ve(D)===!1){W.__webglMultisampledFramebuffer=n.createFramebuffer(),W.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let J=0;J<ee.length;J++){const j=ee[J];W.__webglColorRenderbuffer[J]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,W.__webglColorRenderbuffer[J]);const ue=r.convert(j.format,j.colorSpace),U=r.convert(j.type),Q=y(j.internalFormat,ue,U,j.normalized,j.colorSpace,D.isXRRenderTarget===!0),Z=xt(D);n.renderbufferStorageMultisample(n.RENDERBUFFER,Z,Q,D.width,D.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+J,n.RENDERBUFFER,W.__webglColorRenderbuffer[J])}n.bindRenderbuffer(n.RENDERBUFFER,null),D.depthBuffer&&(W.__webglDepthRenderbuffer=n.createRenderbuffer(),rt(W.__webglDepthRenderbuffer,D,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ce){t.bindTexture(n.TEXTURE_CUBE_MAP,se.__webglTexture),Ve(n.TEXTURE_CUBE_MAP,M);for(let J=0;J<6;J++)if(M.mipmaps.length>0)for(let j=0;j<M.mipmaps.length;j++)we(W.__webglFramebuffer[J][j],D,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+J,j);else we(W.__webglFramebuffer[J],D,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0);E(M)?T(n.TEXTURE_CUBE_MAP):M.mipmaps.length>0&&n.texParameteri(n.TEXTURE_CUBE_MAP,n.TEXTURE_MAX_LEVEL,M.mipmaps.length-1),t.unbindTexture()}else if(pe){for(let J=0,j=ee.length;J<j;J++){const ue=ee[J],U=i.get(ue);let Q=n.TEXTURE_2D;(D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(Q=D.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Q,U.__webglTexture),Ve(Q,ue),we(W.__webglFramebuffer,D,ue,n.COLOR_ATTACHMENT0+J,Q,0),E(ue)&&T(Q)}t.unbindTexture()}else{let J=n.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(J=D.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(J,se.__webglTexture),Ve(J,M),M.mipmaps.length>0)for(let j=0;j<M.mipmaps.length;j++)we(W.__webglFramebuffer[j],D,M,n.COLOR_ATTACHMENT0,J,j);else we(W.__webglFramebuffer,D,M,n.COLOR_ATTACHMENT0,J,0);E(M)?T(J):M.mipmaps.length>0&&n.texParameteri(J,n.TEXTURE_MAX_LEVEL,M.mipmaps.length-1),t.unbindTexture()}D.depthBuffer&&Ft(D)}function z(D){const M=D.textures;for(let W=0,se=M.length;W<se;W++){const ee=M[W];if(E(ee)&&ee.mipmapsAutoUpdate===!0){const ce=w(D),pe=i.get(ee).__webglTexture;t.bindTexture(ce,pe),T(ce),t.unbindTexture()}}}const ni=[];function vt(D){if(D.samples>0){if(ve(D)===!1){const M=D.textures,W=D.width,se=D.height;let ee=n.COLOR_BUFFER_BIT;const ce=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,pe=i.get(D),J=M.length>1;if(J)for(let ue=0;ue<M.length;ue++)t.bindFramebuffer(n.FRAMEBUFFER,pe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ue,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,pe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ue,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,pe.__webglMultisampledFramebuffer),D.texture.mipmaps.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,pe.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,pe.__webglFramebuffer);for(let ue=0;ue<M.length;ue++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(ee|=n.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(ee|=n.STENCIL_BUFFER_BIT)),J){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,pe.__webglColorRenderbuffer[ue]);const U=i.get(M[ue]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,U,0)}n.blitFramebuffer(0,0,W,se,0,0,W,se,ee,n.NEAREST),l===!0&&(ni.length=0,ni.push(n.COLOR_ATTACHMENT0+ue),D.depthBuffer&&D.storeMultisampledDepthBuffer===!1&&ni.push(ce),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,ni))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),J)for(let ue=0;ue<M.length;ue++){t.bindFramebuffer(n.FRAMEBUFFER,pe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ue,n.RENDERBUFFER,pe.__webglColorRenderbuffer[ue]);const U=i.get(M[ue]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,pe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ue,n.TEXTURE_2D,U,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,pe.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.storeMultisampledDepthBuffer===!1&&l){const M=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[M])}}}function xt(D){return Math.min(s.maxSamples,D.samples)}function ve(D){const M=i.get(D);return D.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function Tt(D){const M=a.render.frame;f.get(D)!==M&&(f.set(D,M),D.update())}function De(D,M){const W=D.colorSpace,se=D.format,ee=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||W!==Es&&W!==en&&(Ke.getTransfer(W)===ot?(se!==Si||ee!==ti)&&Ue("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):it("WebGLTextures: Unsupported texture color space:",W)),M}function Fe(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(c.width=D.naturalWidth||D.width,c.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(c.width=D.displayWidth,c.height=D.displayHeight):(c.width=D.width,c.height=D.height),c}this.allocateTextureUnit=ne,this.resetTextureUnits=G,this.getTextureUnits=$,this.setTextureUnits=ie,this.setTexture2D=te,this.setTexture2DArray=ge,this.setTexture3D=xe,this.setTextureCube=re,this.rebindTextures=Je,this.setupRenderTarget=Ot,this.updateRenderTargetMipmap=z,this.updateMultisampleRenderTarget=vt,this.setupDepthRenderbuffer=Ft,this.setupFrameBufferTexture=we,this.useMultisampledRTT=ve,this.dispose=B}function Xv(n,e){function t(i,s=en){let r;const a=Ke.getTransfer(s);if(i===ti)return n.UNSIGNED_BYTE;if(i===zo)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Go)return n.UNSIGNED_SHORT_5_5_5_1;if(i===vh)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===xh)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===mh)return n.BYTE;if(i===gh)return n.SHORT;if(i===bs)return n.UNSIGNED_SHORT;if(i===Ho)return n.INT;if(i===Ii)return n.UNSIGNED_INT;if(i===Ci)return n.FLOAT;if(i===Li)return n.HALF_FLOAT;if(i===_h)return n.ALPHA;if(i===yh)return n.RGB;if(i===Si)return n.RGBA;if(i===rn)return n.DEPTH_COMPONENT;if(i===sn)return n.DEPTH_STENCIL;if(i===Vo)return n.RED;if(i===Wo)return n.RED_INTEGER;if(i===Sn)return n.RG;if(i===Xo)return n.RG_INTEGER;if(i===qo)return n.RGBA_INTEGER;if(i===vr||i===xr||i===_r||i===yr)if(a===ot)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===vr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===xr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===_r)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===yr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===vr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===xr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===_r)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===yr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===ja||i===Qa||i===eo||i===to)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===ja)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Qa)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===eo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===to)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===io||i===no||i===so||i===ro||i===ao||i===Cr||i===oo)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===io||i===no)return a===ot?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===so)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===ro)return r.COMPRESSED_R11_EAC;if(i===ao)return r.COMPRESSED_SIGNED_R11_EAC;if(i===Cr)return r.COMPRESSED_RG11_EAC;if(i===oo)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===lo||i===co||i===ho||i===uo||i===fo||i===po||i===mo||i===go||i===vo||i===xo||i===_o||i===yo||i===So||i===Mo)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===lo)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===co)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===ho)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===uo)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===fo)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===po)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===mo)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===go)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===vo)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===xo)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===_o)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===yo)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===So)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Mo)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===wo||i===bo||i===Eo)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===wo)return a===ot?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===bo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Eo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===To||i===Ao||i===Pr||i===Ro)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===To)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Ao)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Pr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Ro)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Qn?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const qv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,$v=`
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

}`;class Yv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Dh(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new wn({vertexShader:qv,fragmentShader:$v,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Gi(new Hr(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Kv extends En{constructor(e,t){super();const i=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,f=null,h=null,u=null,d=null,m=null;const _=typeof XRWebGLBinding<"u",p=new Yv,v={},S=t.getContextAttributes();let E=null,T=null;const w=[],y=[],g=new nt;let x=null,I=null;const R=new Ti;R.viewport=new St;const A=new Ti;A.viewport=new St;const F=[R,A],N=new op;let P=null,B=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let te=w[X];return te===void 0&&(te=new ma,w[X]=te),te.getTargetRaySpace()},this.getControllerGrip=function(X){let te=w[X];return te===void 0&&(te=new ma,w[X]=te),te.getGripSpace()},this.getHand=function(X){let te=w[X];return te===void 0&&(te=new ma,w[X]=te),te.getHandSpace()};function H(X){const te=y.indexOf(X.inputSource);if(te===-1)return;const ge=w[te];ge!==void 0&&(ge.update(X.inputSource,X.frame,c||a),ge.dispatchEvent({type:X.type,data:X.inputSource}))}function k(){s.removeEventListener("select",H),s.removeEventListener("selectstart",H),s.removeEventListener("selectend",H),s.removeEventListener("squeeze",H),s.removeEventListener("squeezestart",H),s.removeEventListener("squeezeend",H),s.removeEventListener("end",k),s.removeEventListener("inputsourceschange",C);for(let X=0;X<w.length;X++){const te=y[X];te!==null&&(y[X]=null,w[X].disconnect(te))}P=null,B=null,p.reset();for(const X in v)delete v[X];if(e.setRenderTarget(E),d=null,u=null,h=null,s=null,T=null,ne.stop(),i.isPresenting=!1,e.setPixelRatio(x),e.setSize(g.width,g.height,!1),I!==null){const X=I.camera;X.fov=I.fov,X.zoom=I.zoom,X.updateProjectionMatrix(),I=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){r=X,i.isPresenting===!0&&Ue("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){o=X,i.isPresenting===!0&&Ue("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(X){c=X},this.getBaseLayer=function(){return u!==null?u:d},this.getBinding=function(){return h===null&&_&&(h=new XRWebGLBinding(s,t)),h},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(X){if(s=X,s!==null){if(E=e.getRenderTarget(),s.addEventListener("select",H),s.addEventListener("selectstart",H),s.addEventListener("selectend",H),s.addEventListener("squeeze",H),s.addEventListener("squeezestart",H),s.addEventListener("squeezeend",H),s.addEventListener("end",k),s.addEventListener("inputsourceschange",C),S.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(g),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let ge=null,xe=null,re=null;S.depth&&(re=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ge=S.stencil?sn:rn,xe=S.stencil?Qn:Ii);const Ie={colorFormat:t.RGBA8,depthFormat:re,scaleFactor:r};h=this.getBinding(),u=h.createProjectionLayer(Ie),s.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),T=new Pi(u.textureWidth,u.textureHeight,{format:Si,type:ti,depthTexture:new es(u.textureWidth,u.textureHeight,xe,void 0,void 0,void 0,void 0,void 0,void 0,ge),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{const ge={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,t,ge),s.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),T=new Pi(d.framebufferWidth,d.framebufferHeight,{format:Si,type:ti,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}T.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),ne.setContext(s),ne.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function C(X){for(let te=0;te<X.removed.length;te++){const ge=X.removed[te],xe=y.indexOf(ge);xe>=0&&(y[xe]=null,w[xe].disconnect(ge))}for(let te=0;te<X.added.length;te++){const ge=X.added[te];let xe=y.indexOf(ge);if(xe===-1){for(let Ie=0;Ie<w.length;Ie++)if(Ie>=y.length){y.push(ge),xe=Ie;break}else if(y[Ie]===null){y[Ie]=ge,xe=Ie;break}if(xe===-1)break}const re=w[xe];re&&re.connect(ge)}}function L(X,te){te===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(te.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(s===null)return;let te=X.near,ge=X.far;p.texture!==null&&(p.depthNear>0&&(te=p.depthNear),p.depthFar>0&&(ge=p.depthFar)),N.near=A.near=R.near=te,N.far=A.far=R.far=ge,(P!==N.near||B!==N.far)&&(s.updateRenderState({depthNear:N.near,depthFar:N.far}),P=N.near,B=N.far),N.layers.mask=X.layers.mask|6,R.layers.mask=N.layers.mask&-5,A.layers.mask=N.layers.mask&-3;const xe=X.parent,re=N.cameras;L(N,xe);for(let Ie=0;Ie<re.length;Ie++)L(re[Ie],xe);N.projectionMatrix.copy(R.projectionMatrix),N.projectionMatrixInverse.copy(R.projectionMatrixInverse),I===null&&X.isPerspectiveCamera&&(I={camera:X,fov:X.fov,zoom:X.zoom}),G(X,N,xe)};function G(X,te,ge){ge===null?X.matrix.copy(te.matrixWorld):(X.matrix.copy(ge.matrixWorld),X.matrix.invert(),X.matrix.multiply(te.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(te.projectionMatrix),X.projectionMatrixInverse.copy(te.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=Co*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return N},this.getFoveation=function(){if(!(u===null&&d===null))return l},this.setFoveation=function(X){l=X,u!==null&&(u.fixedFoveation=X),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=X)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(N)},this.getCameraTexture=function(X){return v[X]};let $=null;function ie(X,te){if(f=te.getViewerPose(c||a),m=te,f!==null){const ge=f.views;d!==null&&(e.setRenderTargetFramebuffer(T,d.framebuffer),e.setRenderTarget(T));let xe=!1;ge.length!==N.cameras.length&&(N.cameras.length=0,xe=!0);for(let Ae=0;Ae<ge.length;Ae++){const Ve=ge[Ae];let Xe=null;if(d!==null)Xe=d.getViewport(Ve);else{const dt=h.getViewSubImage(u,Ve);Xe=dt.viewport,Ae===0&&(e.setRenderTargetTextures(T,dt.colorTexture,dt.depthStencilTexture),e.setRenderTarget(T))}let Ne=F[Ae];Ne===void 0&&(Ne=new Ti,Ne.layers.enable(Ae),Ne.viewport=new St,F[Ae]=Ne),Ne.matrix.fromArray(Ve.transform.matrix),Ne.matrix.decompose(Ne.position,Ne.quaternion,Ne.scale),Ne.projectionMatrix.fromArray(Ve.projectionMatrix),Ne.projectionMatrixInverse.copy(Ne.projectionMatrix).invert(),Ne.viewport.set(Xe.x,Xe.y,Xe.width,Xe.height),Ae===0&&(N.matrix.copy(Ne.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale)),xe===!0&&N.cameras.push(Ne)}const re=s.enabledFeatures;if(re&&re.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){h=i.getBinding();const Ae=h.getDepthInformation(ge[0]);Ae&&Ae.isValid&&Ae.texture&&p.init(Ae,s.renderState)}if(re&&re.includes("camera-access")&&_){e.state.unbindTexture(),h=i.getBinding();for(let Ae=0;Ae<ge.length;Ae++){const Ve=ge[Ae].camera;if(Ve){let Xe=v[Ve];Xe||(Xe=new Dh,v[Ve]=Xe);const Ne=h.getCameraImage(Ve);Xe.sourceTexture=Ne}}}}for(let ge=0;ge<w.length;ge++){const xe=y[ge],re=w[ge];xe!==null&&re!==void 0&&re.update(xe,te,c||a)}$&&$(X,te),te.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:te}),m=null}const ne=new Oh;ne.setAnimationLoop(ie),this.setAnimationLoop=function(X){$=X},this.dispose=function(){}}}const Zv=new Mt,$h=new Oe;$h.set(-1,0,0,0,1,0,0,0,1);function Jv(n,e){function t(p,v){p.matrixAutoUpdate===!0&&p.updateMatrix(),v.value.copy(p.matrix)}function i(p,v){v.color.getRGB(p.fogColor.value,Nh(n)),v.isFog?(p.fogNear.value=v.near,p.fogFar.value=v.far):v.isFogExp2&&(p.fogDensity.value=v.density)}function s(p,v,S,E,T){v.isNodeMaterial?v.uniformsNeedUpdate=!1:v.isMeshBasicMaterial?r(p,v):v.isMeshLambertMaterial?(r(p,v),v.envMap&&(p.envMapIntensity.value=v.envMapIntensity)):v.isMeshToonMaterial?(r(p,v),h(p,v)):v.isMeshPhongMaterial?(r(p,v),f(p,v),v.envMap&&(p.envMapIntensity.value=v.envMapIntensity)):v.isMeshStandardMaterial?(r(p,v),u(p,v),v.isMeshPhysicalMaterial&&d(p,v,T)):v.isMeshMatcapMaterial?(r(p,v),m(p,v)):v.isMeshDepthMaterial?r(p,v):v.isMeshDistanceMaterial?(r(p,v),_(p,v)):v.isMeshNormalMaterial?r(p,v):v.isLineBasicMaterial?(a(p,v),v.isLineDashedMaterial&&o(p,v)):v.isPointsMaterial?l(p,v,S,E):v.isSpriteMaterial?c(p,v):v.isShadowMaterial?(p.color.value.copy(v.color),p.opacity.value=v.opacity):v.isShaderMaterial&&(v.uniformsNeedUpdate=!1)}function r(p,v){p.opacity.value=v.opacity,v.color&&p.diffuse.value.copy(v.color),v.emissive&&p.emissive.value.copy(v.emissive).multiplyScalar(v.emissiveIntensity),v.map&&(p.map.value=v.map,t(v.map,p.mapTransform)),v.alphaMap&&(p.alphaMap.value=v.alphaMap,t(v.alphaMap,p.alphaMapTransform)),v.bumpMap&&(p.bumpMap.value=v.bumpMap,t(v.bumpMap,p.bumpMapTransform),p.bumpScale.value=v.bumpScale,v.side===Zt&&(p.bumpScale.value*=-1)),v.normalMap&&(p.normalMap.value=v.normalMap,t(v.normalMap,p.normalMapTransform),p.normalScale.value.copy(v.normalScale),v.side===Zt&&p.normalScale.value.negate()),v.displacementMap&&(p.displacementMap.value=v.displacementMap,t(v.displacementMap,p.displacementMapTransform),p.displacementScale.value=v.displacementScale,p.displacementBias.value=v.displacementBias),v.emissiveMap&&(p.emissiveMap.value=v.emissiveMap,t(v.emissiveMap,p.emissiveMapTransform)),v.specularMap&&(p.specularMap.value=v.specularMap,t(v.specularMap,p.specularMapTransform)),v.alphaTest>0&&(p.alphaTest.value=v.alphaTest);const S=e.get(v),E=S.envMap,T=S.envMapRotation;E&&(p.envMap.value=E,p.envMapRotation.value.setFromMatrix4(Zv.makeRotationFromEuler(T)).transpose(),E.isCubeTexture&&E.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply($h),p.reflectivity.value=v.reflectivity,p.ior.value=v.ior,p.refractionRatio.value=v.refractionRatio),v.lightMap&&(p.lightMap.value=v.lightMap,p.lightMapIntensity.value=v.lightMapIntensity,t(v.lightMap,p.lightMapTransform)),v.aoMap&&(p.aoMap.value=v.aoMap,p.aoMapIntensity.value=v.aoMapIntensity,t(v.aoMap,p.aoMapTransform))}function a(p,v){p.diffuse.value.copy(v.color),p.opacity.value=v.opacity,v.map&&(p.map.value=v.map,t(v.map,p.mapTransform))}function o(p,v){p.dashSize.value=v.dashSize,p.totalSize.value=v.dashSize+v.gapSize,p.scale.value=v.scale}function l(p,v,S,E){p.diffuse.value.copy(v.color),p.opacity.value=v.opacity,p.size.value=v.size*S,p.scale.value=E*.5,v.map&&(p.map.value=v.map,t(v.map,p.uvTransform)),v.alphaMap&&(p.alphaMap.value=v.alphaMap,t(v.alphaMap,p.alphaMapTransform)),v.alphaTest>0&&(p.alphaTest.value=v.alphaTest)}function c(p,v){p.diffuse.value.copy(v.color),p.opacity.value=v.opacity,p.rotation.value=v.rotation,v.map&&(p.map.value=v.map,t(v.map,p.mapTransform)),v.alphaMap&&(p.alphaMap.value=v.alphaMap,t(v.alphaMap,p.alphaMapTransform)),v.alphaTest>0&&(p.alphaTest.value=v.alphaTest)}function f(p,v){p.specular.value.copy(v.specular),p.shininess.value=Math.max(v.shininess,1e-4)}function h(p,v){v.gradientMap&&(p.gradientMap.value=v.gradientMap)}function u(p,v){p.metalness.value=v.metalness,v.metalnessMap&&(p.metalnessMap.value=v.metalnessMap,t(v.metalnessMap,p.metalnessMapTransform)),p.roughness.value=v.roughness,v.roughnessMap&&(p.roughnessMap.value=v.roughnessMap,t(v.roughnessMap,p.roughnessMapTransform)),v.envMap&&(p.envMapIntensity.value=v.envMapIntensity)}function d(p,v,S){p.ior.value=v.ior,v.diffuseRoughness>0&&(p.diffuseRoughness.value=v.diffuseRoughness,v.diffuseRoughnessMap&&(p.diffuseRoughnessMap.value=v.diffuseRoughnessMap,t(v.diffuseRoughnessMap,p.diffuseRoughnessMapTransform))),v.sheen>0&&(p.sheenColor.value.copy(v.sheenColor).multiplyScalar(v.sheen),p.sheenRoughness.value=v.sheenRoughness,v.sheenColorMap&&(p.sheenColorMap.value=v.sheenColorMap,t(v.sheenColorMap,p.sheenColorMapTransform)),v.sheenRoughnessMap&&(p.sheenRoughnessMap.value=v.sheenRoughnessMap,t(v.sheenRoughnessMap,p.sheenRoughnessMapTransform))),v.clearcoat>0&&(p.clearcoat.value=v.clearcoat,p.clearcoatRoughness.value=v.clearcoatRoughness,v.clearcoatMap&&(p.clearcoatMap.value=v.clearcoatMap,t(v.clearcoatMap,p.clearcoatMapTransform)),v.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=v.clearcoatRoughnessMap,t(v.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),v.clearcoatNormalMap&&(p.clearcoatNormalMap.value=v.clearcoatNormalMap,t(v.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(v.clearcoatNormalScale),v.side===Zt&&p.clearcoatNormalScale.value.negate())),v.dispersion>0&&(p.dispersion.value=v.dispersion),v.retroreflectivity>0&&(p.retroreflectivity.value=v.retroreflectivity),v.iridescence>0&&(p.iridescence.value=v.iridescence,p.iridescenceIOR.value=v.iridescenceIOR,p.iridescenceThicknessMinimum.value=v.iridescenceThicknessMinimum,p.iridescenceThicknessMaximum.value=v.iridescenceThicknessMaximum,v.iridescenceMap&&(p.iridescenceMap.value=v.iridescenceMap,t(v.iridescenceMap,p.iridescenceMapTransform)),v.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=v.iridescenceThicknessMap,t(v.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),v.transmission>0&&(p.transmission.value=v.transmission,p.transmissionSamplerMap.value=S.texture,p.transmissionSamplerSize.value.set(S.width,S.height),v.transmissionMap&&(p.transmissionMap.value=v.transmissionMap,t(v.transmissionMap,p.transmissionMapTransform)),p.thickness.value=v.thickness,v.thicknessMap&&(p.thicknessMap.value=v.thicknessMap,t(v.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=v.attenuationDistance,p.attenuationColor.value.copy(v.attenuationColor)),v.anisotropy>0&&(p.anisotropyVector.value.set(v.anisotropy*Math.cos(v.anisotropyRotation),v.anisotropy*Math.sin(v.anisotropyRotation)),v.anisotropyMap&&(p.anisotropyMap.value=v.anisotropyMap,t(v.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=v.specularIntensity,p.specularColor.value.copy(v.specularColor),v.specularColorMap&&(p.specularColorMap.value=v.specularColorMap,t(v.specularColorMap,p.specularColorMapTransform)),v.specularIntensityMap&&(p.specularIntensityMap.value=v.specularIntensityMap,t(v.specularIntensityMap,p.specularIntensityMapTransform))}function m(p,v){v.matcap&&(p.matcap.value=v.matcap)}function _(p,v){const S=e.get(v).light;p.referencePosition.value.setFromMatrixPosition(S.matrixWorld),p.nearDistance.value=S.shadow.camera.near,p.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function jv(n,e,t,i){let s={},r={};function a(S,E){const T=E.program;i.uniformBlockBinding(S,T,s[S.id])}function o(S,E){let T=s[S.id];T===void 0&&(m(S),T=l(S),s[S.id]=T,S.addEventListener("dispose",p));const w=E.program;i.updateUBOMapping(S,w);const y=e.render.frame;r[S.id]!==y&&(c(S),r[S.id]=y)}function l(S){const E=n.createBuffer(),T=S.__size,w=S.usage;return n.bindBuffer(n.UNIFORM_BUFFER,E),n.bufferData(n.UNIFORM_BUFFER,T,w),n.bindBuffer(n.UNIFORM_BUFFER,null),E}function c(S){const E=s[S.id],T=S.uniforms,w=S.__cache;n.bindBuffer(n.UNIFORM_BUFFER,E);for(let y=0,g=T.length;y<g;y++){const x=T[y];if(Array.isArray(x))for(let I=0,R=x.length;I<R;I++)f(x[I],y,I,w);else f(x,y,0,w)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(S,E,T,w){if(u(S,E,T,w)===!0){const y=S.__offset,g=S.value;if(Array.isArray(g)){let x=0;for(let I=0;I<g.length;I++){const R=g[I],A=_(R,!0);h(R,S.__data,x),x+=A.storage/Float32Array.BYTES_PER_ELEMENT}}else h(g,S.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,y,S.__data)}}function h(S,E,T){typeof S=="number"||typeof S=="boolean"?E[T]=S:S.isMatrix3?(E[T]=S.elements[0],E[T+1]=S.elements[1],E[T+2]=S.elements[2],E[T+3]=0,E[T+4]=S.elements[3],E[T+5]=S.elements[4],E[T+6]=S.elements[5],E[T+7]=0,E[T+8]=S.elements[6],E[T+9]=S.elements[7],E[T+10]=S.elements[8],E[T+11]=0):ArrayBuffer.isView(S)?E.set(S.subarray(0,E.length-T),T):S.toArray(E,T)}function u(S,E,T,w){const y=S.value,g=E+"_"+T;if(Array.isArray(y)){w[g]===void 0&&(w[g]=[]);const x=w[g];let I=!1;for(let R=0;R<y.length;R++)d(y[R],x,R)===!0&&(I=!0);return I}return d(y,w,g)}function d(S,E,T){if(E[T]===void 0)return typeof S=="number"||typeof S=="boolean"?E[T]=S:ArrayBuffer.isView(S)?E[T]=S.slice():E[T]=S.clone(),!0;{const w=E[T];if(typeof S=="number"||typeof S=="boolean"){if(w!==S)return E[T]=S,!0}else{if(ArrayBuffer.isView(S))return!0;if(w.equals(S)===!1)return w.copy(S),!0}}return!1}function m(S){const E=S.uniforms;let T=0;const w=16;for(let g=0,x=E.length;g<x;g++){const I=Array.isArray(E[g])?E[g]:[E[g]];for(let R=0,A=I.length;R<A;R++){const F=I[R],N=Array.isArray(F.value)?F.value:[F.value],P=Array.isArray(E[g])||Array.isArray(F.value);let B=T;for(let k=0,C=N.length;k<C;k++){const L=N[k],G=_(L,P),$=T%w,ie=$%G.boundary,ne=$+ie;T+=ie,ne!==0&&w-ne<G.storage&&(T+=w-ne),k===0&&(B=T),T+=G.storage}const H=F.type==="int"?Int32Array:F.type==="uint"?Uint32Array:Float32Array;F.__data=new H((T-B)/Float32Array.BYTES_PER_ELEMENT),F.__offset=B}}const y=T%w;return y>0&&(T+=w-y),S.__size=T,S.__cache={},this}function _(S,E){const T={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(T.boundary=4,T.storage=4):S.isVector2?(T.boundary=8,T.storage=8):S.isVector3||S.isColor?(T.boundary=16,T.storage=12):S.isVector4?(T.boundary=16,T.storage=16):S.isMatrix3?(T.boundary=16,T.storage=48):S.isMatrix4?(T.boundary=16,T.storage=64):S.isTexture?Ue("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(S)?(T.boundary=16,T.storage=S.byteLength):Ue("WebGLRenderer: Unsupported uniform value type.",S),E===!0&&(T.boundary=16,T.storage=Math.ceil(T.storage/16)*16),T}function p(S){const E=S.target;E.removeEventListener("dispose",p),n.deleteBuffer(s[E.id]),delete s[E.id],delete r[E.id]}function v(){for(const S in s)n.deleteBuffer(s[S]);s={},r={}}return{bind:a,update:o,dispose:v}}const Qv=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Ei=null;function ex(){return Ei===null&&(Ei=new Ph(Qv,16,16,Sn,Li),Ei.name="DFG_LUT",Ei.minFilter=Kt,Ei.magFilter=Kt,Ei.wrapS=Ri,Ei.wrapT=Ri,Ei.generateMipmaps=!1,Ei.needsUpdate=!0),Ei}class tx{constructor(e={}){const{canvas:t=bd(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:f="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:u=!1,outputBufferType:d=ti}=e;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=a;const _=d,p=new Set([qo,Xo,Wo]),v=new Set([ti,Ii,bs,Qn,zo,Go]),S=new Uint32Array(4),E=new Int32Array(4),T={textures:[],min:[],max:[],resolution:[]};let w=null,y=null;const g=[],x=[];let I=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Hi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const R=this;let A=!1,F=null,N=null,P=null,B=null;this._outputColorSpace=li;let H=0,k=0,C=null,L=-1,G=null;const $=new St,ie=new St;let ne=null;const X=new st(0);let te=0,ge=t.width,xe=t.height,re=1,Ie=null,lt=null;const Ae=new St(0,0,ge,xe),Ve=new St(0,0,ge,xe);let Xe=!1;const Ne=new Ur,dt=new Zo;let ae=!1,Pe=!1;const we=new Mt,rt=new K,pt=new St,Ft={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Je=!1;function Ot(){return C===null?re:1}let z=i;function ni(b,O){return t.getContext(b,O)}let vt,xt,ve,Tt,De,Fe,D,M,W,se,ee,ce,pe,J,j,ue,U,Q,Z,fe,le,he,Ce;try{const b={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:f,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${ko}`),t.addEventListener("webglcontextlost",Le,!1),t.addEventListener("webglcontextrestored",He,!1),t.addEventListener("webglcontextcreationerror",_e,!1),z===null){const O="webgl2";if(z=ni(O,b),z===null)throw ni(O)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}ze()}catch(b){throw t.removeEventListener("webglcontextlost",Le,!1),t.removeEventListener("webglcontextrestored",He,!1),t.removeEventListener("webglcontextcreationerror",_e,!1),it("WebGLRenderer: "+b.message),b}function ze(){vt=new s0(z),vt.init(),le=new Xv(z,vt),xt=new $g(z,vt,e,le),ve=new Vv(z,vt),xt.reversedDepthBuffer&&u&&ve.buffers.depth.setReversed(!0),N=z.createFramebuffer(),P=z.createFramebuffer(),B=z.createFramebuffer(),Tt=new o0(z),De=new Cv,Fe=new Wv(z,vt,ve,De,xt,le,Tt),D=new n0(R),M=new cp(z),he=new Xg(z,M),W=new r0(z,M,Tt,he),se=new c0(z,W,M,he,Tt),Q=new l0(z,xt,Fe),j=new Yg(De),ee=new Rv(R,D,vt,xt,he,j),ce=new Jv(R,De),pe=new Iv,J=new Ov(vt),U=new Wg(R,D,ve,se,m,l),ue=new Gv(R,se,xt),Ce=new jv(z,Tt,xt,ve),Z=new qg(z,vt,Tt),fe=new a0(z,vt,Tt),Tt.programs=ee.programs,R.capabilities=xt,R.extensions=vt,R.properties=De,R.renderLists=pe,R.shadowMap=ue,R.state=ve,R.info=Tt}_!==ti&&(I=new u0(_,t.width,t.height,o,s,r));const oe=new Kv(R,z);this.xr=oe,this.getContext=function(){return z},this.getContextAttributes=function(){return z.getContextAttributes()},this.forceContextLoss=function(){const b=vt.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=vt.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return re},this.setPixelRatio=function(b){b!==void 0&&(re=b,this.setSize(ge,xe,!1))},this.getSize=function(b){return b.set(ge,xe)},this.setSize=function(b,O,Y=!0){if(oe.isPresenting){Ue("WebGLRenderer: Can't change size while VR device is presenting.");return}ge=b,xe=O,t.width=Math.floor(b*re),t.height=Math.floor(O*re),Y===!0&&(t.style.width=b+"px",t.style.height=O+"px"),I!==null&&I.setSize(t.width,t.height),this.setViewport(0,0,b,O)},this.getDrawingBufferSize=function(b){return b.set(ge*re,xe*re).floor()},this.setDrawingBufferSize=function(b,O,Y){ge=b,xe=O,re=Y,t.width=Math.floor(b*Y),t.height=Math.floor(O*Y),this.setViewport(0,0,b,O)},this.setEffects=function(b){if(_===ti){it("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(b){for(let O=0;O<b.length;O++)if(b[O].isOutputPass===!0){Ue("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}I.setEffects(b||[])},this.getCurrentViewport=function(b){return b.copy($)},this.getViewport=function(b){return b.copy(Ae)},this.setViewport=function(b,O,Y,V){b.isVector4?Ae.set(b.x,b.y,b.z,b.w):Ae.set(b,O,Y,V),ve.viewport($.copy(Ae).multiplyScalar(Ot()).round())},this.getScissor=function(b){return b.copy(Ve)},this.setScissor=function(b,O,Y,V){b.isVector4?Ve.set(b.x,b.y,b.z,b.w):Ve.set(b,O,Y,V),ve.scissor(ie.copy(Ve).multiplyScalar(Ot()).round())},this.getScissorTest=function(){return Xe},this.setScissorTest=function(b){ve.setScissorTest(Xe=b)},this.setOpaqueSort=function(b){Ie=b},this.setTransparentSort=function(b){lt=b},this.getClearColor=function(b){return b.copy(U.getClearColor())},this.setClearColor=function(){U.setClearColor(...arguments)},this.getClearAlpha=function(){return U.getClearAlpha()},this.setClearAlpha=function(){U.setClearAlpha(...arguments)},this.clear=function(b=!0,O=!0,Y=!0){let V=0;if(b){let q=!1;if(C!==null){const me=C.texture.format;q=p.has(me)}if(q){const me=C.texture.type,be=v.has(me),de=U.getClearColor(),Se=U.getClearAlpha(),Re=de.r,Be=de.g,qe=de.b;be?(S[0]=Re,S[1]=Be,S[2]=qe,S[3]=Se,z.clearBufferuiv(z.COLOR,0,S)):(E[0]=Re,E[1]=Be,E[2]=qe,E[3]=Se,z.clearBufferiv(z.COLOR,0,E))}else V|=z.COLOR_BUFFER_BIT}O&&(V|=z.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Y&&(V|=z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),V!==0&&z.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(b){b.setRenderer(this),F=b},this.dispose=function(){t.removeEventListener("webglcontextlost",Le,!1),t.removeEventListener("webglcontextrestored",He,!1),t.removeEventListener("webglcontextcreationerror",_e,!1),U.dispose(),pe.dispose(),J.dispose(),Fe.dispose(),De.dispose(),D.dispose(),se.dispose(),W.dispose(),he.dispose(),Ce.dispose(),ee.dispose(),oe.dispose(),oe.removeEventListener("sessionstart",nl),oe.removeEventListener("sessionend",sl),on.stop()};function Le(b){b.preventDefault(),kl("WebGLRenderer: Context Lost."),A=!0}function He(){kl("WebGLRenderer: Context Restored."),A=!1;const b=Tt.autoReset,O=ue.enabled,Y=ue.autoUpdate,V=ue.needsUpdate,q=ue.type;ze(),Tt.autoReset=b,ue.enabled=O,ue.autoUpdate=Y,ue.needsUpdate=V,ue.type=q}function _e(b){it("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function at(b){const O=b.target;O.removeEventListener("dispose",at),Ct(O)}function Ct(b){Vi(b),De.remove(b)}function Vi(b){const O=De.get(b).programs;O!==void 0&&(O.forEach(function(Y){ee.releaseProgram(Y)}),b.isShaderMaterial&&ee.releaseShaderCache(b))}this.renderBufferDirect=function(b,O,Y,V,q,me){O===null&&(O=Ft);const be=q.isMesh&&q.matrixWorld.determinantAffine()<0,de=Zh(b,O,Y,V,q);ve.setMaterial(V,be);let Se=Y.index,Re=1;if(V.wireframe===!0){if(Se=W.getWireframeAttribute(Y),Se===void 0)return;Re=2}const Be=Y.drawRange,qe=Y.attributes.position;let Ee=Be.start*Re,$e=(Be.start+Be.count)*Re;me!==null&&(Ee=Math.max(Ee,me.start*Re),$e=Math.min($e,(me.start+me.count)*Re)),Se!==null?(Ee=Math.max(Ee,0),$e=Math.min($e,Se.count)):qe!=null&&(Ee=Math.max(Ee,0),$e=Math.min($e,qe.count));const wt=$e-Ee;if(wt<0||wt===1/0)return;he.setup(q,V,de,Y,Se);let ut,ct=Z;if(Se!==null&&(ut=M.get(Se),ct=fe,ct.setIndex(ut)),q.isMesh)V.wireframe===!0?(ve.setLineWidth(V.wireframeLinewidth*Ot()),ct.setMode(z.LINES)):ct.setMode(z.TRIANGLES);else if(q.isLine){let Bt=V.linewidth;Bt===void 0&&(Bt=1),ve.setLineWidth(Bt*Ot()),q.isLineSegments?ct.setMode(z.LINES):q.isLineLoop?ct.setMode(z.LINE_LOOP):ct.setMode(z.LINE_STRIP)}else q.isPoints?ct.setMode(z.POINTS):q.isSprite&&ct.setMode(z.TRIANGLES);if(q.isBatchedMesh)if(vt.get("WEBGL_multi_draw"))ct.renderMultiDraw(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount);else{const Bt=q._multiDrawStarts,Te=q._multiDrawCounts,Gt=q._multiDrawCount,tt=Se?M.get(Se).bytesPerElement:1,ln=De.get(V).currentProgram.getUniforms();for(let kt=0;kt<Gt;kt++)ln.setValue(z,"_gl_DrawID",kt),ct.render(Bt[kt]/tt,Te[kt])}else if(q.isInstancedMesh)ct.renderInstances(Ee,wt,q.count);else if(Y.isInstancedBufferGeometry){const Bt=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,Te=Math.min(Y.instanceCount,Bt);ct.renderInstances(Ee,wt,Te)}else ct.render(Ee,wt)};function il(b,O,Y,V){F!==null&&b.isNodeMaterial&&F.setObject(V,b),ae===!0&&j.setState(b,Y,!1),b.transparent===!0&&b.side===_i&&b.forceSinglePass===!1?(b.side=Zt,b.needsUpdate=!0,ss(b,O,V),b.side=yn,b.needsUpdate=!0,ss(b,O,V),b.side=_i):ss(b,O,V)}this.compile=function(b,O,Y=null){Y===null&&(Y=b),F!==null&&F.renderStart(b,O,Y),y=J.get(Y),y.init(O),x.push(y),Y.traverseVisible(function(q){q.isLight&&q.layers.test(O.layers)&&(y.pushLight(q),q.castShadow&&y.pushShadow(q))}),b!==Y&&b.traverseVisible(function(q){q.isLight&&q.layers.test(O.layers)&&(y.pushLight(q),q.castShadow&&y.pushShadow(q))}),y.setupLights(),F!==null&&F.updateLights(y.state.lightsArray),Pe=this.localClippingEnabled,ae=j.init(this.clippingPlanes,Pe),ae===!0&&j.setGlobalState(this.clippingPlanes,O),F!==null&&ue.render(y.state.shadowsArray,Y,O);const V=new Set;return b.traverse(function(q){if(!(q.isMesh||q.isPoints||q.isLine||q.isSprite))return;const me=q.material;if(me)if(Array.isArray(me))for(let be=0;be<me.length;be++){const de=me[be];il(de,Y,O,q),V.add(de)}else il(me,Y,O,q),V.add(me)}),y=x.pop(),F!==null&&F.renderEnd(),V},this.compileAsync=function(b,O,Y=null){const V=this.compile(b,O,Y);return new Promise(q=>{function me(){if(V.forEach(function(be){const Se=De.get(be).currentProgram;(Se===void 0||Se.isReady())&&V.delete(be)}),V.size===0){q(b);return}setTimeout(me,10)}vt.get("KHR_parallel_shader_compile")!==null?me():setTimeout(me,10)})};let Vr=null;function Yh(b){Vr&&Vr(b)}function nl(){on.stop()}function sl(){on.start()}const on=new Oh;on.setAnimationLoop(Yh),typeof self<"u"&&on.setContext(self),this.setAnimationLoop=function(b){Vr=b,oe.setAnimationLoop(b),b===null?on.stop():on.start()},oe.addEventListener("sessionstart",nl),oe.addEventListener("sessionend",sl),this.render=function(b,O){if(O!==void 0&&O.isCamera!==!0){it("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(A===!0)return;F!==null&&F.renderStart(b,O);const Y=oe.enabled===!0&&oe.isPresenting===!0,V=I!==null&&(C===null||Y)&&I.begin(R,C);if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),oe.enabled===!0&&oe.isPresenting===!0&&(I===null||I.isCompositing()===!1)&&(oe.cameraAutoUpdate===!0&&oe.updateCamera(O),O=oe.getCamera()),b.isScene===!0&&b.onBeforeRender(R,b,O,C),y=J.get(b,x.length),y.init(O),y.state.textureUnits=Fe.getTextureUnits(),x.push(y),we.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),O.isArrayCamera?dt.setFromArrayCamera(O):Ne.setFromProjectionMatrix(we,Mi,O.reversedDepth),Pe=this.localClippingEnabled,ae=j.init(this.clippingPlanes,Pe),w=pe.get(b,g.length),w.init(),g.push(w),this.info.render.frame++,oe.enabled===!0&&oe.isPresenting===!0){const be=R.xr.getDepthSensingMesh();be!==null&&Wr(be,O,-1/0,R.sortObjects)}Wr(b,O,0,R.sortObjects),w.finish(),F!==null&&F.updateLights(y.state.lightsArray),R.sortObjects===!0&&w.sort(Ie,lt),Je=oe.enabled===!1||oe.isPresenting===!1||oe.hasDepthSensing()===!1,Je&&U.addToRenderList(w,b),this.info.autoReset===!0&&this.info.reset(),ae===!0&&j.beginShadows();const q=y.state.shadowsArray;if(ue.render(q,b,O),ae===!0&&j.endShadows(),(V&&I.hasRenderPass())===!1){const be=w.opaque,de=w.transmissive;if(y.setupLights(),O.isArrayCamera){const Se=O.cameras;if(de.length>0)for(let Re=0,Be=Se.length;Re<Be;Re++){const qe=Se[Re];al(be,de,b,qe)}Je&&U.render(b);for(let Re=0,Be=Se.length;Re<Be;Re++){const qe=Se[Re];rl(w,b,qe,qe.viewport)}}else de.length>0&&al(be,de,b,O),Je&&U.render(b),rl(w,b,O)}C!==null&&k===0&&(Fe.updateMultisampleRenderTarget(C),Fe.updateRenderTargetMipmap(C)),V&&I.end(R),b.isScene===!0&&b.onAfterRender(R,b,O),he.resetDefaultState(),L=-1,G=null,x.pop(),x.length>0?(y=x[x.length-1],Fe.setTextureUnits(y.state.textureUnits),ae===!0&&j.setGlobalState(R.clippingPlanes,y.state.camera)):y=null,g.pop(),g.length>0?w=g[g.length-1]:w=null,F!==null&&F.renderEnd()};function Wr(b,O,Y,V){if(b.visible===!1)return;if(b.layers.test(O.layers)){if(b.isGroup)Y=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(O);else if(b.isLight)y.pushLight(b),b.castShadow&&y.pushShadow(b);else if(b.isSprite){const be=O.isArrayCamera?dt:Ne;if(!b.frustumCulled||b.intersectsFrustum(be)){V&&pt.setFromMatrixPosition(b.matrixWorld).applyMatrix4(we);const de=se.update(b),Se=b.material;Se.visible&&w.push(b,de,Se,Y,pt.z,null,O)}}else if(b.isMesh||b.isLine||b.isPoints){const be=O.isArrayCamera?dt:Ne;if(!b.frustumCulled||b.intersectsFrustum(be)){const de=se.update(b),Se=b.material;if(V&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),pt.copy(b.boundingSphere.center)):(de.boundingSphere===null&&de.computeBoundingSphere(),pt.copy(de.boundingSphere.center)),pt.applyMatrix4(b.matrixWorld).applyMatrix4(we)),Array.isArray(Se)){const Re=de.groups;for(let Be=0,qe=Re.length;Be<qe;Be++){const Ee=Re[Be],$e=Se[Ee.materialIndex];$e&&$e.visible&&w.push(b,de,$e,Y,pt.z,Ee,O)}}else Se.visible&&w.push(b,de,Se,Y,pt.z,null,O)}}}const me=b.children;for(let be=0,de=me.length;be<de;be++)Wr(me[be],O,Y,V)}function rl(b,O,Y,V){const{opaque:q,transmissive:me,transparent:be}=b;y.setupLightsView(Y),ae===!0&&j.setGlobalState(R.clippingPlanes,Y),V&&ve.viewport($.copy(V)),q.length>0&&Is(q,O,Y),me.length>0&&Is(me,O,Y),be.length>0&&Is(be,O,Y),ve.buffers.depth.setTest(!0),ve.buffers.depth.setMask(!0),ve.buffers.color.setMask(!0),ve.setPolygonOffset(!1)}function al(b,O,Y,V){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;if(y.state.transmissionRenderTarget[V.id]===void 0){const Ee=vt.has("EXT_color_buffer_half_float")||vt.has("EXT_color_buffer_float");y.state.transmissionRenderTarget[V.id]=new Pi(1,1,{generateMipmaps:!0,type:Ee?Li:ti,minFilter:nn,samples:Math.max(4,xt.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Ke.workingColorSpace})}const me=y.state.transmissionRenderTarget[V.id],be=V.viewport||$;me.setSize(be.z*R.transmissionResolutionScale,be.w*R.transmissionResolutionScale);const de=R.getRenderTarget(),Se=R.getActiveCubeFace(),Re=R.getActiveMipmapLevel();R.setRenderTarget(me),R.getClearColor(X),te=R.getClearAlpha(),te<1&&R.setClearColor(16777215,.5),R.clear(),Je&&U.render(Y);const Be=R.toneMapping;R.toneMapping=Hi;const qe=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),y.setupLightsView(V),ae===!0&&j.setGlobalState(R.clippingPlanes,V),Is(b,Y,V),Fe.updateMultisampleRenderTarget(me),Fe.updateRenderTargetMipmap(me),vt.has("WEBGL_multisampled_render_to_texture")===!1){let Ee=!1;for(let $e=0,wt=O.length;$e<wt;$e++){const ut=O[$e],{object:ct,geometry:Bt,material:Te,group:Gt}=ut;if(Te.side===_i&&ct.layers.test(V.layers)){const tt=Te.side;Te.side=Zt,Te.needsUpdate=!0,ol(ct,Y,V,Bt,Te,Gt),Te.side=tt,Te.needsUpdate=!0,Ee=!0}}Ee===!0&&(Fe.updateMultisampleRenderTarget(me),Fe.updateRenderTargetMipmap(me))}R.setRenderTarget(de,Se,Re),R.setClearColor(X,te),qe!==void 0&&(V.viewport=qe),R.toneMapping=Be}function Is(b,O,Y){const V=O.isScene===!0?O.overrideMaterial:null;for(let q=0,me=b.length;q<me;q++){const be=b[q],{object:de,geometry:Se,group:Re}=be;let Be=be.material;Be.allowOverride===!0&&V!==null&&(Be=V),de.layers.test(Y.layers)&&ol(de,O,Y,Se,Be,Re)}}function ol(b,O,Y,V,q,me){F!==null&&q.isNodeMaterial&&F.setObject(b,q),b.onBeforeRender(R,O,Y,V,q,me),b.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),q.onBeforeRender(R,O,Y,V,b,me),q.transparent===!0&&q.side===_i&&q.forceSinglePass===!1?(q.side=Zt,q.needsUpdate=!0,R.renderBufferDirect(Y,O,V,q,b,me),q.side=yn,q.needsUpdate=!0,R.renderBufferDirect(Y,O,V,q,b,me),q.side=_i):R.renderBufferDirect(Y,O,V,q,b,me),b.onAfterRender(R,O,Y,V,q,me)}function ll(b){let O=0;for(const Y of b)Y.texture!==null&&O++;return O}function ss(b,O,Y){O.isScene!==!0&&(O=Ft);const V=De.get(b),q=y.state.lights,me=y.state.shadowsArray,be=q.state.version,de=ee.getParameters(b,q.state,me,O,Y,y.state.lightProbeGridArray),Se=ee.getProgramCacheKey(de);let Re=V.programs;V.environment=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?O.environment:null,V.fog=O.fog;const Be=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap;V.envMap=D.get(b.envMap||V.environment,Be),V.envMapRotation=V.environment!==null&&b.envMap===null?O.environmentRotation:b.envMapRotation,Re===void 0&&(b.addEventListener("dispose",at),Re=new Map,V.programs=Re,V.programVariants=new Map);let qe=Re.get(Se);if(qe!==void 0){if(V.currentProgram===qe&&V.lightsStateVersion===be)return hl(b,de),qe}else de.uniforms=ee.getUniforms(b),F!==null&&b.isNodeMaterial&&F.build(b,Y,de),b.onBeforeCompile(de,R),qe=ee.acquireProgram(de,Se),Re.set(Se,qe),V.uniforms=de.uniforms;const Ee=V.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Ee.clippingPlanes=j.uniform),hl(b,de),V.needsLights=jh(b),V.lightsStateVersion=be,V.needsLights&&(Ee.ambientLightColor.value=q.state.ambient,Ee.lightProbe.value=q.state.probe,Ee.sunLights.value=q.state.sun,Ee.sunLightShadows.value=q.state.sunShadow,Ee.directionalLights.value=q.state.directional,Ee.directionalLightShadows.value=q.state.directionalShadow,Ee.spotLights.value=q.state.spot,Ee.spotLightShadows.value=q.state.spotShadow,Ee.rectAreaLights.value=q.state.rectArea,Ee.ltc_1.value=q.state.rectAreaLTC1,Ee.ltc_2.value=q.state.rectAreaLTC2,Ee.pointLights.value=q.state.point,Ee.pointLightShadows.value=q.state.pointShadow,Ee.hemisphereLights.value=q.state.hemi,Ee.sunShadowMatrix.value=q.state.sunShadowMatrix,Ee.sunShadowCascade.value=q.state.sunShadowCascade,Ee.directionalShadowMatrix.value=q.state.directionalShadowMatrix,Ee.spotLightMatrix.value=q.state.spotLightMatrix,Ee.spotLightMap.value=q.state.spotLightMap,Ee.pointShadowMatrix.value=q.state.pointShadowMatrix),V.numLightProbeGrids=ll(y.state.lightProbeGridArray),V.currentProgram=qe,V.uniformsList=null,qe}function Kh(b,O,Y,V,q){const me=De.get(b),be=me.currentProgram.id+","+V+","+q;let de=me.programVariants.get(be);return de===void 0?(de=ss(b,O,Y),me.programVariants.set(be,de)):(me.currentProgram=de,me.uniformsList=null,me.outputColorSpace=V,me.toneMapping=q),de}function cl(b){if(b.uniformsList===null){const O=b.currentProgram.getUniforms();b.uniformsList=Mr.seqWithValue(O.seq,b.uniforms)}return b.uniformsList}function hl(b,O){const Y=De.get(b);Y.outputColorSpace=O.outputColorSpace,Y.batching=O.batching,Y.batchingColor=O.batchingColor,Y.instancing=O.instancing,Y.instancingColor=O.instancingColor,Y.instancingMorph=O.instancingMorph,Y.skinning=O.skinning,Y.morphTargets=O.morphTargets,Y.morphNormals=O.morphNormals,Y.morphColors=O.morphColors,Y.morphTargetsCount=O.morphTargetsCount,Y.numClippingPlanes=O.numClippingPlanes,Y.numIntersection=O.numClipIntersection,Y.vertexAlphas=O.vertexAlphas,Y.vertexTangents=O.vertexTangents,Y.toneMapping=O.toneMapping}function Zh(b,O,Y,V,q){O.isScene!==!0&&(O=Ft),Fe.resetTextureUnits();const me=O.fog,be=V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial?O.environment:null,de=C===null?R.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:Ke.workingColorSpace,Se=V.isMeshStandardMaterial||V.isMeshLambertMaterial&&!V.envMap||V.isMeshPhongMaterial&&!V.envMap,Re=D.get(V.envMap||be,Se),Be=V.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,qe=!!Y.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),Ee=!!Y.morphAttributes.position,$e=!!Y.morphAttributes.normal,wt=!!Y.morphAttributes.color;let ut=Hi;V.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(ut=R.toneMapping);const ct=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,Bt=ct!==void 0?ct.length:0,Te=De.get(V),Gt=y.state.lights;if(ae===!0&&(Pe===!0||b!==G)){const yt=b===G&&V.id===L;j.setState(V,b,yt)}let tt=!1,ln=!1;V.version===Te.__version?Te.needsLights&&Te.lightsStateVersion!==Gt.state.version||q.isBatchedMesh&&Te.batching===!1||!q.isBatchedMesh&&Te.batching===!0||q.isBatchedMesh&&Te.batchingColor===!0&&q._colorsTexture===null||q.isBatchedMesh&&Te.batchingColor===!1&&q._colorsTexture!==null||q.isInstancedMesh&&Te.instancing===!1||!q.isInstancedMesh&&Te.instancing===!0||q.isSkinnedMesh&&Te.skinning===!1||!q.isSkinnedMesh&&Te.skinning===!0||q.isInstancedMesh&&Te.instancingColor===!0&&q.instanceColor===null||q.isInstancedMesh&&Te.instancingColor===!1&&q.instanceColor!==null||q.isInstancedMesh&&Te.instancingMorph===!0&&q.morphTexture===null||q.isInstancedMesh&&Te.instancingMorph===!1&&q.morphTexture!==null||Te.envMap!==Re||V.fog===!0&&Te.fog!==me||Te.numClippingPlanes!==void 0&&(Te.numClippingPlanes!==j.numPlanes||Te.numIntersection!==j.numIntersection)||Te.vertexAlphas!==Be||Te.vertexTangents!==qe||Te.morphTargets!==Ee||Te.morphNormals!==$e||Te.morphColors!==wt||Te.morphTargetsCount!==Bt||Te.numLightProbeGrids!==ll(y.state.lightProbeGridArray)?tt=!0:(Te.outputColorSpace!==de||Te.toneMapping!==ut)&&(ln=!0):(tt=!0,Te.__version=V.version);let kt=Te.currentProgram;(tt===!0||ln===!0)&&(kt=ln===!0?Kh(V,O,q,de,ut):ss(V,O,q),F&&V.isNodeMaterial&&F.onUpdateProgram(V,kt,Te));let Ls=!1,Wi=!1,cn=!1;const je=kt.getUniforms(),Dt=Te.uniforms;if(ve.useProgram(kt.program)&&(Ls=!0,Wi=!0,cn=!0),V.id!==L&&(L=V.id,Wi=!0),Ls||G!==b){ve.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),je.setValue(z,"projectionMatrix",b.projectionMatrix),je.setValue(z,"viewMatrix",b.matrixWorldInverse);const Pt=je.map.cameraPosition;Pt!==void 0&&Pt.setValue(z,rt.setFromMatrixPosition(b.matrixWorld)),xt.logarithmicDepthBuffer&&je.setValue(z,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&je.setValue(z,"isOrthographic",b.isOrthographicCamera===!0),G!==b&&(G=b,Wi=!0,cn=!0)}if(Te.needsLights&&(Gt.state.sunShadowMap.length>0&&je.setValue(z,"sunShadowMap",Gt.state.sunShadowMap,Fe),Gt.state.directionalShadowMap.length>0&&je.setValue(z,"directionalShadowMap",Gt.state.directionalShadowMap,Fe),Gt.state.spotShadowMap.length>0&&je.setValue(z,"spotShadowMap",Gt.state.spotShadowMap,Fe),Gt.state.pointShadowMap.length>0&&je.setValue(z,"pointShadowMap",Gt.state.pointShadowMap,Fe)),q.isSkinnedMesh){je.setOptional(z,q,"bindMatrix"),je.setOptional(z,q,"bindMatrixInverse");const yt=q.skeleton;yt&&(yt.boneTexture===null&&yt.computeBoneTexture(),je.setValue(z,"boneTexture",yt.boneTexture,Fe))}q.isBatchedMesh&&(je.setOptional(z,q,"batchingTexture"),je.setValue(z,"batchingTexture",q._matricesTexture,Fe),je.setOptional(z,q,"batchingIdTexture"),je.setValue(z,"batchingIdTexture",q._indirectTexture,Fe),je.setOptional(z,q,"batchingColorTexture"),q._colorsTexture!==null&&je.setValue(z,"batchingColorTexture",q._colorsTexture,Fe));const hi=Y.morphAttributes;if((hi.position!==void 0||hi.normal!==void 0||hi.color!==void 0)&&Q.update(q,Y,kt),(Wi||Te.receiveShadow!==q.receiveShadow)&&(Te.receiveShadow=q.receiveShadow,je.setValue(z,"receiveShadow",q.receiveShadow)),(V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial)&&V.envMap===null&&O.environment!==null&&(Dt.envMapIntensity.value=O.environmentIntensity),Dt.dfgLUT!==void 0&&(Dt.dfgLUT.value=ex()),Wi){if(je.setValue(z,"toneMappingExposure",R.toneMappingExposure),Te.needsLights&&Jh(Dt,cn),me&&V.fog===!0&&ce.refreshFogUniforms(Dt,me),ce.refreshMaterialUniforms(Dt,V,re,xe,y.state.transmissionRenderTarget[b.id]),Te.needsLights&&Te.numLightProbeGrids>0){const yt=T;let Pt=0;for(const Di of y.state.lightProbeGridArray)Di.texture!==null&&(yt.textures[Pt]=Di.texture,yt.min[Pt]=Di.boundingBox.min,yt.max[Pt]=Di.boundingBox.max,yt.resolution[Pt]=Di.resolution,Pt++);for(const Di in yt)yt[Di].length=Pt;Dt.probesSH.value=yt.textures,Dt.probesMin.value=yt.min,Dt.probesMax.value=yt.max,Dt.probesResolution.value=yt.resolution}Mr.upload(z,cl(Te),Dt,Fe)}if(V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(Mr.upload(z,cl(Te),Dt,Fe),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&je.setValue(z,"center",q.center),je.setValue(z,"modelViewMatrix",q.modelViewMatrix),je.setValue(z,"normalMatrix",q.normalMatrix),je.setValue(z,"modelMatrix",q.matrixWorld),V.uniformsGroups!==void 0){const yt=V.uniformsGroups;for(let Pt=0,Di=yt.length;Pt<Di;Pt++){const fl=yt[Pt];Ce.update(fl,kt),Ce.bind(fl,kt)}}return kt}function Jh(b,O){b.ambientLightColor.needsUpdate=O,b.lightProbe.needsUpdate=O,b.sunLights.needsUpdate=O,b.sunLightShadows.needsUpdate=O,b.directionalLights.needsUpdate=O,b.directionalLightShadows.needsUpdate=O,b.pointLights.needsUpdate=O,b.pointLightShadows.needsUpdate=O,b.spotLights.needsUpdate=O,b.spotLightShadows.needsUpdate=O,b.rectAreaLights.needsUpdate=O,b.hemisphereLights.needsUpdate=O}function jh(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return H},this.getActiveMipmapLevel=function(){return k},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(b,O,Y){const V=De.get(b);V.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,V.__autoAllocateDepthBuffer===!1&&(V.__useRenderToTexture=!1),De.get(b.texture).__webglTexture=O,De.get(b.depthTexture).__webglTexture=V.__autoAllocateDepthBuffer?void 0:Y,V.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,O){const Y=De.get(b);Y.__webglFramebuffer=O,Y.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(b,O=0,Y=0){C=b,H=O,k=Y;let V=null,q=!1,me=!1;if(b){const de=De.get(b);if(de.__useDefaultFramebuffer!==void 0){ve.bindFramebuffer(z.FRAMEBUFFER,de.__webglFramebuffer),$.copy(b.viewport),ie.copy(b.scissor),ne=b.scissorTest,ve.viewport($),ve.scissor(ie),ve.setScissorTest(ne),L=-1;return}else if(de.__webglFramebuffer===void 0)Fe.setupRenderTarget(b);else if(de.__hasExternalTextures)Fe.rebindTextures(b,De.get(b.texture).__webglTexture,De.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const Be=b.depthTexture;if(de.__boundDepthTexture!==Be){if(Be!==null&&De.has(Be)&&(b.width!==Be.image.width||b.height!==Be.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Fe.setupDepthRenderbuffer(b)}}const Se=b.texture;(Se.isData3DTexture||Se.isDataArrayTexture||Se.isCompressedArrayTexture)&&(me=!0);const Re=De.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Re[O])?V=Re[O][Y]:V=Re[O],q=!0):b.samples>0&&Fe.useMultisampledRTT(b)===!1?V=De.get(b).__webglMultisampledFramebuffer:Array.isArray(Re)?V=Re[Y]:V=Re,$.copy(b.viewport),ie.copy(b.scissor),ne=b.scissorTest}else $.copy(Ae).multiplyScalar(re).floor(),ie.copy(Ve).multiplyScalar(re).floor(),ne=Xe;if(Y!==0&&(V=N),ve.bindFramebuffer(z.FRAMEBUFFER,V)&&ve.drawBuffers(b,V),ve.viewport($),ve.scissor(ie),ve.setScissorTest(ne),q){const de=De.get(b.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_CUBE_MAP_POSITIVE_X+O,de.__webglTexture,Y)}else if(me){const de=O;for(let Se=0;Se<b.textures.length;Se++){const Re=De.get(b.textures[Se]);z.framebufferTextureLayer(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0+Se,Re.__webglTexture,Y,de)}}else if(b!==null&&Y!==0){const de=De.get(b.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,de.__webglTexture,Y)}L=-1};function ul(b){const O=De.get(b);return(O.__readFormat!==b.format||O.__readType!==b.type)&&(O.__readFormat=b.format,O.__readType=b.type,O.__formatReadable=xt.textureFormatReadable(b.format),O.__typeReadable=xt.textureTypeReadable(b.type)),O}this.readRenderTargetPixels=function(b,O,Y,V,q,me,be,de=0){if(!(b&&b.isWebGLRenderTarget)){it("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Se=De.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&be!==void 0&&(Se=Se[be],Array.isArray(Se)&&(Se=Se[0])),Se){ve.bindFramebuffer(z.FRAMEBUFFER,Se);try{const Re=b.textures[de],Be=Re.format,qe=Re.type;b.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+de);const Ee=ul(Re);if(Ee.__formatReadable===!1){it("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ee.__typeReadable===!1){it("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=b.width-V&&Y>=0&&Y<=b.height-q&&z.readPixels(O,Y,V,q,le.convert(Be),le.convert(qe),me)}finally{const Re=C!==null?De.get(C).__webglFramebuffer:null;ve.bindFramebuffer(z.FRAMEBUFFER,Re)}}},this.readRenderTargetPixelsAsync=async function(b,O,Y,V,q,me,be,de=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Se=De.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&be!==void 0&&(Se=Se[be],Array.isArray(Se)&&(Se=Se[0])),Se)if(O>=0&&O<=b.width-V&&Y>=0&&Y<=b.height-q){ve.bindFramebuffer(z.FRAMEBUFFER,Se);const Re=b.textures[de],Be=Re.format,qe=Re.type;b.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+de);const Ee=ul(Re);if(Ee.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ee.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const $e=z.createBuffer();z.bindBuffer(z.PIXEL_PACK_BUFFER,$e),z.bufferData(z.PIXEL_PACK_BUFFER,me.byteLength,z.STREAM_READ),z.readPixels(O,Y,V,q,le.convert(Be),le.convert(qe),0),z.bindBuffer(z.PIXEL_PACK_BUFFER,null);const wt=C!==null?De.get(C).__webglFramebuffer:null;ve.bindFramebuffer(z.FRAMEBUFFER,wt);const ut=z.fenceSync(z.SYNC_GPU_COMMANDS_COMPLETE,0);return z.flush(),await Ed(z,ut,4),z.bindBuffer(z.PIXEL_PACK_BUFFER,$e),z.getBufferSubData(z.PIXEL_PACK_BUFFER,0,me),z.bindBuffer(z.PIXEL_PACK_BUFFER,null),z.deleteBuffer($e),z.deleteSync(ut),me}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,O=null,Y=0){const V=Math.pow(2,-Y),q=Math.floor(b.image.width*V),me=Math.floor(b.image.height*V),be=O!==null?O.x:0,de=O!==null?O.y:0;Fe.setTexture2D(b,0),z.copyTexSubImage2D(z.TEXTURE_2D,Y,0,0,be,de,q,me),ve.unbindTexture()},this.copyTextureToTexture=function(b,O,Y=null,V=null,q=0,me=0){let be,de,Se,Re,Be,qe,Ee,$e,wt;const ut=b.isCompressedTexture?b.mipmaps[me]:b.image;if(Y!==null)be=Y.max.x-Y.min.x,de=Y.max.y-Y.min.y,Se=Y.isBox3?Y.max.z-Y.min.z:1,Re=Y.min.x,Be=Y.min.y,qe=Y.isBox3?Y.min.z:0;else{const je=Math.pow(2,-q);be=Math.floor(ut.width*je),de=Math.floor(ut.height*je),b.isDataArrayTexture?Se=ut.depth:b.isData3DTexture?Se=Math.floor(ut.depth*je):Se=1,Re=0,Be=0,qe=0}V!==null?(Ee=V.x,$e=V.y,wt=V.z):(Ee=0,$e=0,wt=0);const ct=le.convert(O.format),Bt=le.convert(O.type);let Te;O.isData3DTexture?(Fe.setTexture3D(O,0),Te=z.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(Fe.setTexture2DArray(O,0),Te=z.TEXTURE_2D_ARRAY):(Fe.setTexture2D(O,0),Te=z.TEXTURE_2D),ve.activeTexture(z.TEXTURE0),ve.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,O.flipY),ve.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),ve.pixelStorei(z.UNPACK_ALIGNMENT,O.unpackAlignment);const Gt=ve.getParameter(z.UNPACK_ROW_LENGTH),tt=ve.getParameter(z.UNPACK_IMAGE_HEIGHT),ln=ve.getParameter(z.UNPACK_SKIP_PIXELS),kt=ve.getParameter(z.UNPACK_SKIP_ROWS),Ls=ve.getParameter(z.UNPACK_SKIP_IMAGES);ve.pixelStorei(z.UNPACK_ROW_LENGTH,ut.width),ve.pixelStorei(z.UNPACK_IMAGE_HEIGHT,ut.height),ve.pixelStorei(z.UNPACK_SKIP_PIXELS,Re),ve.pixelStorei(z.UNPACK_SKIP_ROWS,Be),ve.pixelStorei(z.UNPACK_SKIP_IMAGES,qe);const Wi=b.isDataArrayTexture||b.isData3DTexture,cn=O.isDataArrayTexture||O.isData3DTexture;if(b.isDepthTexture){const je=De.get(b),Dt=De.get(O),hi=De.get(je.__renderTarget),yt=De.get(Dt.__renderTarget);ve.bindFramebuffer(z.READ_FRAMEBUFFER,hi.__webglFramebuffer),ve.bindFramebuffer(z.DRAW_FRAMEBUFFER,yt.__webglFramebuffer);for(let Pt=0;Pt<Se;Pt++)Wi&&(z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,De.get(b).__webglTexture,q,qe+Pt),z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,De.get(O).__webglTexture,me,wt+Pt)),z.blitFramebuffer(Re,Be,Re+be,Be+de,Ee,$e,Ee+be,$e+de,z.DEPTH_BUFFER_BIT,z.NEAREST);ve.bindFramebuffer(z.READ_FRAMEBUFFER,null),ve.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else if(q!==0||b.isRenderTargetTexture||De.has(b)){const je=De.get(b),Dt=De.get(O);ve.bindFramebuffer(z.READ_FRAMEBUFFER,P),ve.bindFramebuffer(z.DRAW_FRAMEBUFFER,B);for(let hi=0;hi<Se;hi++)Wi?z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,je.__webglTexture,q,qe+hi):z.framebufferTexture2D(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,je.__webglTexture,q),cn?z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,Dt.__webglTexture,me,wt+hi):z.framebufferTexture2D(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,Dt.__webglTexture,me),q!==0?z.blitFramebuffer(Re,Be,Re+be,Be+de,Ee,$e,Ee+be,$e+de,z.COLOR_BUFFER_BIT,z.NEAREST):cn?z.copyTexSubImage3D(Te,me,Ee,$e,wt+hi,Re,Be,be,de):z.copyTexSubImage2D(Te,me,Ee,$e,Re,Be,be,de);ve.bindFramebuffer(z.READ_FRAMEBUFFER,null),ve.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else cn?b.isDataTexture||b.isData3DTexture?z.texSubImage3D(Te,me,Ee,$e,wt,be,de,Se,ct,Bt,ut.data):O.isCompressedArrayTexture?z.compressedTexSubImage3D(Te,me,Ee,$e,wt,be,de,Se,ct,ut.data):z.texSubImage3D(Te,me,Ee,$e,wt,be,de,Se,ct,Bt,ut):b.isDataTexture?z.texSubImage2D(z.TEXTURE_2D,me,Ee,$e,be,de,ct,Bt,ut.data):b.isCompressedTexture?z.compressedTexSubImage2D(z.TEXTURE_2D,me,Ee,$e,ut.width,ut.height,ct,ut.data):z.texSubImage2D(z.TEXTURE_2D,me,Ee,$e,be,de,ct,Bt,ut);ve.pixelStorei(z.UNPACK_ROW_LENGTH,Gt),ve.pixelStorei(z.UNPACK_IMAGE_HEIGHT,tt),ve.pixelStorei(z.UNPACK_SKIP_PIXELS,ln),ve.pixelStorei(z.UNPACK_SKIP_ROWS,kt),ve.pixelStorei(z.UNPACK_SKIP_IMAGES,Ls),me===0&&O.generateMipmaps===!0&&O.mipmapsAutoUpdate===!0&&z.generateMipmap(Te),ve.unbindTexture()},this.initRenderTarget=function(b){De.get(b).__webglFramebuffer===void 0&&Fe.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?Fe.setTextureCube(b,0):b.isData3DTexture?Fe.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?Fe.setTexture2DArray(b,0):Fe.setTexture2D(b,0),ve.unbindTexture()},this.resetState=function(){H=0,k=0,C=null,ve.reset(),he.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Mi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Ke._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ke._getUnpackColorSpace()}}const Tc=`precision highp float;
in vec3 position;in vec2 uv;uniform mat4 projectionMatrix,modelViewMatrix;uniform vec2 size;out vec2 texUV;
void main(){texUV=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position.xy*size,0.,1.);}`,ix=`precision highp float;
uniform sampler2D image,palette;uniform bool indexed,maskZero;uniform vec2 coefficients;uniform float opacity;
uniform int fxCount;uniform vec3 fxAdd[8],fxMul[8],fxPost[8];uniform vec2 fxColorInvert[8];in vec2 texUV;out vec4 result;
void main(){vec4 color=texture(image,texUV);if(indexed){float i=floor(color.r*255.+.5);color=texture(palette,vec2((i+.5)/256.,.5));if(i<.5){if(maskZero)discard;color.a=1.;}}if(color.a<=0.)discard;
vec3 rgb=color.rgb*255.;for(int i=0;i<8;i++){if(i>=fxCount)break;float grey=dot(rgb,vec3(.299,.587,.114));rgb=mix(vec3(grey),rgb,fxColorInvert[i].x);if(fxColorInvert[i].y>.5)rgb=255.-rgb;rgb=clamp((rgb+fxAdd[i])*fxMul[i]+fxPost[i],0.,255.);}
rgb=floor(rgb+.00001)/255.;float coverage=color.a*opacity;result=vec4(rgb*coefficients.x*coverage,coverage*(1.-coefficients.y));}`,nx=`precision highp float;uniform float ground;in vec2 texUV;out vec4 result;
void main(){vec2 p=vec2(texUV.x*960.,texUV.y*540.);vec3 color=vec3(.047,.067,.106);float h=ground-105.;if(p.y>h){float distance=p.y-h+16.;float x=(p.x-480.)*100./distance;float lines=min(abs(fract(x/80.+.5)-.5)*distance/100.,abs(fract(log(distance/16.)*3.)-.5)*distance*.18);color=mix(vec3(.105,.153,.215),color,smoothstep(.35,1.1,lines));}if(abs(p.y-ground)<.6)color=vec3(.27,.38,.33);result=vec4(color,1.);}`,sx=()=>({add:Array.from({length:8},()=>[0,0,0]),mul:Array.from({length:8},()=>[1,1,1]),post:Array.from({length:8},()=>[0,0,0]),color:Array.from({length:8},()=>[1,0])});class rx{constructor(e,{maxTextureBytes:t=64*1024*1024,preserveDrawingBuffer:i=!1}={}){this.renderer=new tx({canvas:e,alpha:!1,antialias:!1,powerPreference:"high-performance",preserveDrawingBuffer:i}),this.renderer.debug.onShaderError=(a,o)=>{throw Error("Sprite shader could not compile: "+a.getProgramInfoLog(o))},this.renderer.outputColorSpace=Es,this.renderer.sortObjects=!1,this.renderer.setClearColor(790811,1),this.canvas=e,this.contextLost=a=>{a.preventDefault(),this.lost=!0},e.addEventListener("webglcontextlost",this.contextLost),this.limit=t,this.textureBytes=0,this.textures=new Map,this.slots=[],this.frames=0,this.scene=new Wd,this.camera=new Fh(0,960,0,540,-10,10),this.camera.position.z=1,this.geometry=new an,this.geometry.setAttribute("position",new wi([0,0,0,1,0,0,0,1,0,1,1,0],3)),this.geometry.setAttribute("uv",new wi([0,0,1,0,0,1,1,1],2)),this.geometry.setIndex([0,1,2,2,1,3]);const s=new Po({glslVersion:Lr,vertexShader:Tc,fragmentShader:nx,uniforms:{size:{value:[960,540]},ground:{value:450}},side:_i,depthTest:!1,depthWrite:!1});this.grid=new Gi(this.geometry,s),this.grid.frustumCulled=!1,this.scene.add(this.grid),this.upload({id:"@white",width:1,height:1,indexed:!1,pixels:new Uint8Array([255,255,255,255])});const r=new Uint8Array(256);for(let a=0;a<8;a++)for(let o=0;o<8;o++)if(o===3||a===3||Math.abs(o-3)===Math.abs(a-3)){const l=(a*8+o)*4;r.set([255,240,130,255],l)}this.upload({id:"@spark",width:8,height:8,pixels:r})}upload(e){if(this.textures.has(e.id))return;const t=e.pixels,i=e.width*e.height*(e.indexed?1:4);if(!Number.isSafeInteger(e.width)||!Number.isSafeInteger(e.height)||e.width<1||e.height<1)throw Error("Invalid GPU asset dimensions.");if(e.width>this.renderer.capabilities.maxTextureSize||e.height>this.renderer.capabilities.maxTextureSize)throw Error("Sprite exceeds this graphics device’s texture limit.");if(!(t instanceof Uint8Array)||t.length!==i)throw Error("Invalid GPU asset dimensions.");if(this.textureBytes+t.length>this.limit)throw Error("GPU texture budget exceeded. Close this match or use a smaller stage.");const s=new Ph(t,e.width,e.height,e.indexed?Vo:Si,ti);s.minFilter=s.magFilter=Lt,s.wrapS=s.wrapT=Ri,s.generateMipmaps=!1,s.flipY=!1,s.unpackAlignment=1,s.needsUpdate=!0,this.textures.set(e.id,s),this.textureBytes+=t.length}slot(e){if(this.slots[e])return this.slots[e];const t=sx(),i=new Po({glslVersion:Lr,vertexShader:Tc,fragmentShader:ix,uniforms:{image:{value:null},palette:{value:null},indexed:{value:!1},maskZero:{value:!0},size:{value:[1,1]},coefficients:{value:[1,0]},opacity:{value:1},fxCount:{value:0},fxAdd:{value:t.add.flat()},fxMul:{value:t.mul.flat()},fxPost:{value:t.post.flat()},fxColorInvert:{value:t.color.flat()}},transparent:!0,depthTest:!1,depthWrite:!1,blending:nh,blendSrc:Ga,blendDst:Rr,blendEquation:ki,blendEquationAlpha:ki,blendSrcAlpha:Ga,blendDstAlpha:Rr});i.side=_i,i.forceSinglePass=!0;const s=new Gi(this.geometry,i);return s.matrixAutoUpdate=!1,s.frustumCulled=!1,s.onBeforeRender=()=>{const r=s.userData.clip,a=this.renderer,o=this.canvas.width/960;a.setScissorTest(!!r),r&&a.setScissor(r[0]*o,(540-r[1]-r[3])*o,r[2]*o,r[3]*o),i.uniformsNeedUpdate=!0},this.scene.add(s),this.slots[e]=s,s}render(e,{width:t=960,height:i=540}={}){var r,a,o,l,c,f;if(this.closed)return;if(this.lost)throw Error("Graphics context was lost. Start the match again from your library.");(this.canvas.width!==t||this.canvas.height!==i)&&this.renderer.setSize(t,i,!1);for(const h of e.assets||[])this.upload(h);this.grid.visible=!!e.grid,this.grid.material.uniforms.ground.value=e.ground||450;const s=e.draws.concat((e.sparks||[]).map(h=>{const u=(12-h.age)*.3+1;return{texture:"@spark",indexed:!1,width:8,height:8,matrix:[u,0,0,u,h.x-4*u,h.y-4*u],blend:{mode:"add",source:1,destination:1},alpha:(12-h.age)/12}}));for(let h=0;h<Math.max(s.length,this.slots.length);h++){if(h>=s.length){this.slots[h].visible=!1;continue}const u=s[h],d=this.slot(h),m=d.material.uniforms;d.visible=!0;const _=this.textures.get(u.texture);if(!_)throw Error("GPU texture was not delivered: "+u.texture);m.image.value=_,m.palette.value=this.textures.get(u.palette)||this.textures.get("@white"),m.indexed.value=!!u.indexed,m.maskZero.value=u.mask!==!1,m.size.value[0]=u.width,m.size.value[1]=u.height,m.opacity.value=u.alpha??1,m.coefficients.value[0]=((r=u.blend)==null?void 0:r.source)??1,m.coefficients.value[1]=((a=u.blend)==null?void 0:a.destination)??0;const[p,v,S,E,T,w]=u.matrix;d.matrix.set(p,S,0,T,v,E,0,w,0,0,1,0,0,0,0,1),d.matrixWorldNeedsUpdate=!0,d.userData.clip=u.clip,d.material.blendEquation=((o=u.blend)==null?void 0:o.mode)==="subtract"?sh:ki;const y=u.palFX||[];m.fxCount.value=Math.min(8,y.length);for(let g=0;g<m.fxCount.value;g++){const x=y[g],I=x.sinadd||[],R=I[3]?Math.sin(2*Math.PI*(x.age||0)/I[3]):0;m.fxColorInvert.value[g*2]=(x.color??256)/256,m.fxColorInvert.value[g*2+1]=x.invertall?1:0;for(let A=0;A<3;A++)m.fxAdd.value[g*3+A]=(((l=x.add)==null?void 0:l[A])||0)+(I[A]||0)*R,m.fxMul.value[g*3+A]=(((c=x.mul)==null?void 0:c[A])??256)/256,m.fxPost.value[g*3+A]=((f=x.postadd)==null?void 0:f[A])||0}}return this.renderer.setScissorTest(!1),this.renderer.render(this.scene,this.camera),this.renderer.setScissorTest(!1),this.frames++,this.stats={backend:"Kenjatime Core · Three.js",frames:this.frames,draws:s.length,textureBytes:this.textureBytes,textures:this.textures.size,width:t,height:i},this.stats}close(){if(!this.closed){this.closed=!0,this.canvas.removeEventListener("webglcontextlost",this.contextLost);for(const e of this.textures.values())e.dispose();for(const e of this.slots)e.material.dispose();this.grid.material.dispose(),this.geometry.dispose(),this.renderer.dispose(),this.renderer.forceContextLoss(),this.textures.clear()}}}const Ac=1e3/60;class ax{constructor({maxTicks:e=12}={}){this.maxTicks=e,this.reset()}reset(){this.last=null,this.debt=0,this.tickCount=0,this.lastRender=null}suspend(){this.last=null,this.debt=0,this.lastRender=null}advance(e,{running:t=!0,speed:i=1}={},s=()=>{}){if(!Number.isFinite(e)||!Number.isFinite(i)||i<=0)throw Error("Invalid frame clock time or speed.");const r=this.last===null?0:Math.max(0,e-this.last);if(this.last=e,!t)return this.debt=0,0;this.debt+=r*i/Ac;let a=0;for(;this.debt>=1-1e-9&&a<this.maxTicks;){const o=e-Math.max(0,this.debt-1)*Ac/i;s(o),this.debt=Math.max(0,this.debt-1),a++,this.tickCount++}return a}renderDue(e,t=60){return this.lastRender===null||e-this.lastRender>=1e3/t-.25?(this.lastRender=e,!0):!1}}class Rc{constructor(){this.reset()}reset(){this.sources=new Map,this.sampled=new Map,this.queue=[],this.offset=0}clearSource(e){this.sources.delete(e),this.sampled.delete(e),this.queue=this.queue.slice(this.offset).filter(t=>t.source!==e),this.offset=0}record(e,t,i){const s=new Set(t),r=this.sources.get(e)||new Set;if(s.size===r.size&&[...s].every(l=>r.has(l)))return;this.sources.set(e,s);const a={source:e,keys:s,time:i};let o=this.queue.length;for(;o>this.offset&&this.queue[o-1].time>i;)o--;this.queue.splice(o,0,a)}sample(e){const t=new Set;for(;this.offset<this.queue.length&&this.queue[this.offset].time<=e;){const s=this.queue[this.offset++],r=this.sampled.get(s.source)||new Set;for(const a of s.keys)r.has(a)||t.add(a);this.sampled.set(s.source,s.keys)}const i=new Set(t);for(const s of this.sampled.values())for(const r of s)i.add(r);return this.offset>128&&(this.queue.splice(0,this.offset),this.offset=0),i}}function ox(n){let e,t,i=!1,s=!1,r=!0,a=0,o=-1/0,l=1,c="auto",f,h,u,d=1,m=!0;const _=new ax,p=[new Rc,new Rc],v=new Map,S=new Set,E=new Map,T=[],w=N=>typeof requestAnimationFrame=="function"?requestAnimationFrame(N):setTimeout(()=>N(performance.now()),16);function y(N){const P=new Float32Array(N);if(P.fill(0),u&&!s){let B=0;for(;B<P.length/2;){let H=u.read(Math.min(2048,P.length/2-B));if(!H&&(!m||(u.seek(0),H=u.read(Math.min(2048,P.length/2-B)),!H)))break;P.set(new Float32Array(u.pcm.buffer,u.pcm.byteOffset,H*2),B*2),B+=H}if(d!==1)for(let H=0;H<P.length;H++)P[H]*=d}f==null||f.postMessage({buffer:N},[N])}function g(){var N,P,B;for(const H of e.drainEvents()){if(H.type==="playsnd")try{const k=e.characters.find($=>$.path===H.character),C=(N=k==null?void 0:k.checks.find($=>$.key==="sound"&&$.ok))==null?void 0:N.path;if(!C||H.common)continue;v.has(C)||v.set(C,gu(e.files[C]));const L=H.group??((P=H.value)==null?void 0:P[0]),G=H.number??((B=H.value)==null?void 0:B[1]);if(H.soundKey=C+":"+L+","+G,E.set(H.soundKey,{path:C,group:L,number:G}),!S.has(H.soundKey)){const $=v.get(C).get(L,G);if(!$)continue;H.bytes=$.slice(),S.add(H.soundKey)}}catch(k){e.issue("sound",k.message);continue}n({type:"sound",event:H},H.bytes?[H.bytes.buffer]:[])}}function x(N){if(!i)try{const P=performance.timeOrigin+N;if(_.advance(P,{running:!s},B=>{e.tick(p[0].sample(B),p[1].sample(B)),g()}),(!s||r)&&_.renderDue(N,60)){const B=performance.now(),H=e.frame();t.render(H,{width:Math.round(960*l),height:Math.round(540*l)});const k=performance.now()-B;if(r=!1,c==="auto"&&!H.assets.length&&!s&&(T.push(k),T.length>=30)){const C=T.reduce((L,G)=>L+G,0)/T.length;C>20?l=Math.max(.5,l-.05):C<9&&(l=Math.min(1,l+.05)),T.length=0}}N-o>=100&&(o=N,n({type:"state",state:{...e.snapshot(),paused:s,simulationDebt:_.debt},gpu:t.stats})),a=w(x)}catch(P){n({type:"error",message:P.message}),A()}}async function I({files:N,selection:P,canvas:B,sampleRate:H=48e3,quality:k="auto"}){var L;c=k,t||F(B),e=new qf(N,P);const C=(L=e.match.stage)==null?void 0:L.definition.music;if(C!=null&&C.path&&N[C.path])if(/\.(mod|xm|it|s3m)$/i.test(C.path)){const{createModuleMusic:G}=await import("./module-music-C2Wy91BT.js");if(i)return;const $=await G();if(i){$.close();return}h=$,u=h.open(N[C.path],H),d=Math.max(0,Math.min(2,C.volume/100)),m=C.loop,n({type:"audio-init",sampleRate:H})}else{const G=N[C.path].slice();n({type:"music",bytes:G,path:C.path,volume:C.volume,loop:C.loop},[G.buffer])}i||(n({type:"ready",capabilities:e.capabilities}),a=w(x))}function R(N){var P,B;if(!i){if(N.type==="sound-request"){try{const H=E.get(N.key),k=H&&((B=(P=v.get(H.path))==null?void 0:P.get(H.group,H.number))==null?void 0:B.slice());if(!k)throw Error("Sound is unavailable.");n({type:"sound-data",key:N.key,bytes:k},[k.buffer])}catch(H){n({type:"sound-data",key:N.key,error:H.message})}return}N.type==="input"&&Array.isArray(N.keys)&&p[N.side===1?1:0].record(N.source||"keyboard",N.keys,N.time??performance.timeOrigin+performance.now()),N.type==="pause"&&(s=!!N.value,p.forEach(H=>H.reset()),_.suspend(),r=!0),N.type==="quality"&&(c=N.value,l=1,T.length=0,r=!0),N.type==="audio-port"&&(f=N.port,f.onmessage=({data:H})=>{!i&&H.buffer instanceof ArrayBuffer&&H.buffer.byteLength===8192&&y(H.buffer)},f.start()),N.type==="stop"&&A()}}function A(){i||(i=!0,typeof cancelAnimationFrame=="function"?cancelAnimationFrame(a):clearTimeout(a),f==null||f.close(),h==null||h.close(),e==null||e.close(),t==null||t.close(),f=h=u=e=t=null,v.clear(),S.clear(),E.clear(),p.forEach(N=>N.reset()))}function F(N){if(i)throw Error("Match cancelled.");t||(t=new rx(N))}return{start:I,prepare:F,control:R,stop:A,snapshot:()=>e==null?void 0:e.snapshot(),get gpu(){return t==null?void 0:t.stats}}}const lr=ox((n,e=[])=>self.postMessage(n,e));self.onmessage=({data:n})=>{if(n.type==="prepare"){try{lr.prepare(n.canvas),self.postMessage({type:"renderer-ready"})}catch(e){lr.stop(),self.postMessage({type:"renderer-unavailable",message:e.message})}return}n.type==="start"?lr.start(n).catch(e=>self.postMessage({type:"error",message:e.message})):lr.control(n)};
