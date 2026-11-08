class Rc{constructor({maxBytes:e=16*1024*1024,maxEntries:t=512,sizeOf:i=s=>{var r;return((r=s==null?void 0:s.rgba)==null?void 0:r.byteLength)||0}}={}){this.maxBytes=e,this.maxEntries=t,this.sizeOf=i,this.entries=new Map,this.bytes=0,this.hits=0,this.misses=0,this.evictions=0}get size(){return this.entries.size}has(e){return this.entries.has(e)}get(e){const t=this.entries.get(e);if(!t){this.misses++;return}return this.hits++,this.entries.delete(e),this.entries.set(e,t),t.value}set(e,t){this.delete(e);const i=Math.max(0,this.sizeOf(t)||0);if(i>this.maxBytes||this.maxEntries<1)return this;for(this.entries.set(e,{value:t,bytes:i}),this.bytes+=i;this.bytes>this.maxBytes||this.size>this.maxEntries;)this.delete(this.entries.keys().next().value),this.evictions++;return this}delete(e){const t=this.entries.get(e);return t?(this.bytes-=t.bytes,this.entries.delete(e)):!1}clear(){this.entries.clear(),this.bytes=0}}var li=Uint8Array,Wn=Uint16Array,Qh=Int32Array,Cc=new li([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Pc=new li([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),eu=new li([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Ic=function(n,e){for(var t=new Wn(31),i=0;i<31;++i)t[i]=e+=1<<n[i-1];for(var s=new Qh(t[30]),i=1;i<30;++i)for(var r=t[i];r<t[i+1];++r)s[r]=r-t[i]<<5|i;return{b:t,r:s}},Lc=Ic(Cc,2),Dc=Lc.b,tu=Lc.r;Dc[28]=258,tu[258]=28;var iu=Ic(Pc,0),nu=iu.b,Ia=new Wn(32768);for(var pt=0;pt<32768;++pt){var Xi=(pt&43690)>>1|(pt&21845)<<1;Xi=(Xi&52428)>>2|(Xi&13107)<<2,Xi=(Xi&61680)>>4|(Xi&3855)<<4,Ia[pt]=((Xi&65280)>>8|(Xi&255)<<8)>>1}var vs=(function(n,e,t){for(var i=n.length,s=0,r=new Wn(e);s<i;++s)n[s]&&++r[n[s]-1];var a=new Wn(e);for(s=1;s<e;++s)a[s]=a[s-1]+r[s-1]<<1;var o;if(t){o=new Wn(1<<e);var l=15-e;for(s=0;s<i;++s)if(n[s])for(var c=s<<4|n[s],f=e-n[s],u=a[n[s]-1]++<<f,h=u|(1<<f)-1;u<=h;++u)o[Ia[u]>>l]=c}else for(o=new Wn(i),s=0;s<i;++s)n[s]&&(o[s]=Ia[a[n[s]-1]++]>>15-n[s]);return o}),Es=new li(288);for(var pt=0;pt<144;++pt)Es[pt]=8;for(var pt=144;pt<256;++pt)Es[pt]=9;for(var pt=256;pt<280;++pt)Es[pt]=7;for(var pt=280;pt<288;++pt)Es[pt]=8;var Nc=new li(32);for(var pt=0;pt<32;++pt)Nc[pt]=5;var su=vs(Es,9,1),ru=vs(Nc,5,1),Wr=function(n){for(var e=n[0],t=1;t<n.length;++t)n[t]>e&&(e=n[t]);return e},hi=function(n,e,t){var i=e/8|0;return(n[i]|n[i+1]<<8)>>(e&7)&t},Xr=function(n,e){var t=e/8|0;return(n[t]|n[t+1]<<8|n[t+2]<<16)>>(e&7)},au=function(n){return(n+7)/8|0},ou=function(n,e,t){return(t==null||t>n.length)&&(t=n.length),new li(n.subarray(e,t))},lu=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],mi=function(n,e,t){var i=new Error(e||lu[n]);if(i.code=n,Error.captureStackTrace&&Error.captureStackTrace(i,mi),!t)throw i;return i},cu=function(n,e,t,i){var s=n.length,r=i?i.length:0;if(!s||e.f&&!e.l)return t||new li(0);var a=!t,o=a||e.i!=2,l=e.i;a&&(t=new li(s*3));var c=function(Te){var qe=t.length;if(Te>qe){var Ke=new li(Math.max(qe*2,Te));Ke.set(t),t=Ke}},f=e.f||0,u=e.p||0,h=e.b||0,d=e.l,p=e.d,x=e.m,m=e.n,v=s*8;do{if(!d){f=hi(n,u,1);var M=hi(n,u+1,3);if(u+=3,M)if(M==1)d=su,p=ru,x=9,m=5;else if(M==2){var y=hi(n,u,31)+257,g=hi(n,u+10,15)+4,_=y+hi(n,u+5,31)+1;u+=14;for(var L=new li(_),R=new li(19),A=0;A<g;++A)R[eu[A]]=hi(n,u+A*3,7);u+=g*3;for(var O=Wr(R),N=(1<<O)-1,C=vs(R,O,1),A=0;A<_;){var k=C[hi(n,u,N)];u+=k&15;var T=k>>4;if(T<16)L[A++]=T;else{var B=0,H=0;for(T==16?(H=3+hi(n,u,3),u+=2,B=L[A-1]):T==17?(H=3+hi(n,u,7),u+=3):T==18&&(H=11+hi(n,u,127),u+=7);H--;)L[A++]=B}}var P=L.subarray(0,y),I=L.subarray(y);x=Wr(P),m=Wr(I),d=vs(P,x,1),p=vs(I,m,1)}else mi(1);else{var T=au(u)+4,E=n[T-4]|n[T-3]<<8,w=T+E;if(w>s){l&&mi(0);break}o&&c(h+E),t.set(n.subarray(T,w),h),e.b=h+=E,e.p=u=w*8,e.f=f;continue}if(u>v){l&&mi(0);break}}o&&c(h+131072);for(var z=(1<<x)-1,$=(1<<m)-1,te=u;;te=u){var B=d[Xr(n,u)&z],se=B>>4;if(u+=B&15,u>v){l&&mi(0);break}if(B||mi(2),se<256)t[h++]=se;else if(se==256){te=u,d=null;break}else{var q=se-254;if(se>264){var A=se-257,ne=Cc[A];q=hi(n,u,(1<<ne)-1)+Dc[A],u+=ne}var fe=p[Xr(n,u)&$],we=fe>>4;fe||mi(3),u+=fe&15;var I=nu[we];if(we>3){var ne=Pc[we];I+=Xr(n,u)&(1<<ne)-1,u+=ne}if(u>v){l&&mi(0);break}o&&c(h+131072);var de=h+q;if(h<I){var Pe=r-I,je=Math.min(I,de);for(Pe+h<0&&mi(3);h<je;++h)t[h]=i[Pe+h]}for(;h<de;++h)t[h]=t[h-I]}}e.l=d,e.p=te,e.b=h,e.f=f,d&&(f=1,e.m=x,e.d=p,e.n=m)}while(!f);return h!=t.length&&a?ou(t,0,h):t.subarray(0,h)},hu=new li(0),uu=function(n,e){return((n[0]&15)!=8||n[0]>>4>7||(n[0]<<8|n[1])%31)&&mi(6,"invalid zlib data"),(n[1]>>5&1)==+!e&&mi(6,"invalid zlib data: "+(n[1]&32?"need":"unexpected")+" dictionary"),(n[1]>>3&4)+2};function fu(n,e){return cu(n.subarray(uu(n,e&&e.dictionary),-4),{i:2},e&&e.out,e&&e.dictionary)}var du=typeof TextDecoder<"u"&&new TextDecoder,pu=0;try{du.decode(hu,{stream:!0}),pu=1}catch{}function wn(n){if(!(n instanceof Uint8Array))throw Error("Text file is missing");if(n[0]===255&&n[1]===254)return new TextDecoder("utf-16le").decode(n);if(n[0]===254&&n[1]===255)return new TextDecoder("utf-16be").decode(n);try{return new TextDecoder("utf-8",{fatal:!0}).decode(n)}catch{return new TextDecoder("windows-1252").decode(n)}}function Jn(n,e="",t=!1){const i=String(n).normalize("NFC").replaceAll("\\","/");if(i.startsWith("/")||/^[a-z]:/i.test(i)||i.includes("\0"))throw Error("Unsafe archive path.");const s=e.split("/").filter(Boolean);for(const r of i.split("/"))if(!(!r||r==="."))if(r===".."){if(!t||!s.length)throw Error("Unsafe archive path.");s.pop()}else s.push(r);return s.join("/").toLowerCase()}function Or(n){const e={};let t="";for(const i of n.replace(/^\uFEFF/,"").split(/\r?\n/)){const s=i.replace(/;(?=(?:[^"']*["'][^"']*["'])*[^"']*$).*$/,"").trim(),r=s.match(/^\[(.+)\]$/);if(r){t=r[1].toLowerCase(),e[t]??(e[t]={});continue}const a=s.indexOf("=");a>0&&t&&(e[t][s.slice(0,a).trim().toLowerCase()]=s.slice(a+1).trim().replace(/^"(.*)"$/,"$1"))}return e}function mu(n){const e=i=>wn(n[i]);return Object.keys(n).filter(i=>i.endsWith(".def")).map(i=>({path:i,def:Or(e(i))})).filter(i=>{var s;return i.def.info&&((s=i.def.files)==null?void 0:s.sprite)}).map(i=>{const s=i.path.slice(0,i.path.lastIndexOf("/")+1),r=c=>Jn(c,s,!0),a=(c,f)=>{let u;try{u=r(f)}catch{u=null}const h=String(f).replaceAll("\\","/").split("/").at(-1);if(!u&&h&&h!=="."&&h!=="..")try{const m=r(h);n[m]&&(u=m)}catch{}if(c!=="stcommon"||n[u])return u;const d=i.path.indexOf("/chars/"),p=d>=0?i.path.slice(0,d+1):"",x=[p+"data/",p].flatMap(m=>{try{return[Jn(f,m,!0)]}catch{return[]}});return(h==null?void 0:h.toLowerCase())==="common1.cns"&&x.push(p+"data/common1.cns","data/common1.cns"),x.find(m=>n[m])||u},o=Object.entries(i.def.files).filter(([c,f])=>f&&/^(sprite|anim|cmd|cns|sound|stcommon|st\d*|pal\d+)$/.test(c)).map(([c,f])=>{const u=a(c,f);return{key:c,value:f,path:u,ok:!!u&&!!n[u],...u?{}:{message:"This resource is outside the ZIP. Include it in the package or use an in-package relative path."}}}),l=o.find(c=>c.key==="anim"&&c.ok);return{...i,checks:o,files:n,animations:l?Uc(e(l.path)):[],sprite:o.find(c=>c.key==="sprite"&&c.ok),palettes:o.filter(c=>/^pal\d+$/.test(c.key)).map(c=>({...c,number:Number(c.key.slice(3))}))}})}function Uc(n){var a;const e=[];let t,i,s,r;for(const[o,l]of n.replace(/^\uFEFF/,"").split(/\r?\n/).entries()){const c=l.split(";")[0].trim(),f=c.match(/^\[begin action\s+(-?\d+)\]\s*$/i);if(f){t={id:+f[1],frames:[],loopStart:0},e.push(t),i={1:[],2:[]},s={},r={};continue}if(!t||!c)continue;if(/^loopstart\s*$/i.test(c)){t.loopStart=t.frames.length;continue}const u=c.match(/^clsn([12])(default)?\s*:\s*(\d+)\s*$/i);if(u){const w=+u[1],y=+u[3];if(y>1024)throw Error(`AIR collision box limit exceeded on line ${o+1}`);const g=new Array(y);r[w]=g,u[2]?(i[w]=g,delete s[w]):s[w]=g;continue}const h=c.match(/^clsn([12])\s*\[\s*(\d+)\s*\]\s*=\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*$/i);if(h){const w=r[+h[1]],y=+h[2];if(!w||y>=w.length){(t.diagnostics??(t.diagnostics=[])).push({line:o+1,message:"AIR collision box index out of range; box ignored"});continue}w[y]=h.slice(3).map(Number);continue}const d=c.match(/^interpolate\s+(offset|blend|scale|angle)\s*$/i);if(d){const w=d[1].toLowerCase();t.frames.length?((a=t.frames.at(-1)).interpolate??(a.interpolate=[])).push(w):(t.loopInterpolate??(t.loopInterpolate=[])).push(w);continue}if(!/^-?\d+\s*,/.test(c))continue;const p=c.split(",").map(w=>w.trim()),x=p.slice(0,5).map(Number);if(p.length<5||x.some(w=>!Number.isFinite(w))||x[4]<-1)throw Error(`Invalid AIR frame on line ${o+1}`);const m=w=>{const y=s[w]??i[w];return Object.keys(y).length!==y.length&&(t.diagnostics??(t.diagnostics=[])).push({line:o+1,message:`Incomplete Clsn${w} definition; missing boxes ignored`}),y.filter(Boolean).map(g=>g.slice())},v=(w,y,g)=>{if(!p[w])return y;const _=Number(p[w]);return Number.isFinite(_)?_:((t.diagnostics??(t.diagnostics=[])).push({line:o+1,message:`Invalid AIR ${g} ignored; using ${y}`}),y)},M=v(7,1,"x-scale"),T=v(8,1,"y-scale"),E=v(9,0,"angle");t.frames.push({group:x[0],number:x[1],x:x[2],y:x[3],ticks:x[4],flip:(p[5]||"").toUpperCase(),blend:(p[6]||"").toUpperCase(),scaleX:M,scaleY:T,angle:E,clsn1:m(1),clsn2:m(2)}),s={}}return e.filter(o=>o.frames.length).map(o=>(o.loopStart>=o.frames.length&&(o.loopStart=0),o.loopInterpolate&&(o.frames.at(-1).interpolate=[...new Set([...o.frames.at(-1).interpolate||[],...o.loopInterpolate])]),delete o.loopInterpolate,o))}function gu(n){if(!(n instanceof Uint8Array)||n.length<24||new TextDecoder().decode(n.subarray(0,12))!=="ElecbyteSnd\0")throw Error("Invalid SND signature");const e=new DataView(n.buffer,n.byteOffset,n.byteLength),t=e.getUint32(16,!0),i=[],s=new Map,r=new Set;if(t>1e4)throw Error("SND sample table too large");let a=e.getUint32(20,!0);for(let o=0;o<t;o++){if(a<24||a+16>n.length||r.has(a))throw Error("Invalid SND sample link");r.add(a);const l=e.getUint32(a,!0),c=e.getUint32(a+4,!0),f=e.getUint32(a+8,!0),u=e.getUint32(a+12,!0),h=a+16;if(c<12||c>32*1024*1024||h+c>n.length)throw Error("Invalid SND sample length");const d=n.subarray(h,h+c);if(new TextDecoder().decode(d.subarray(0,4))!=="RIFF"||new TextDecoder().decode(d.subarray(8,12))!=="WAVE")throw Error("Unsupported SND sample: expected WAV");if(new DataView(d.buffer,d.byteOffset,d.byteLength).getUint32(4,!0)+8>c)throw Error("Truncated SND WAV");const p={group:f,number:u,data:d};i.push(p),s.has(`${f},${u}`)||s.set(`${f},${u}`,d),a=l}return{samples:i,get:(o,l)=>s.get(`${o},${l}`)}}function vu(n,e,t,i){const s=[137,80,78,71,13,10,26,10];if(n.length<33||!s.every((_,L)=>n[L]===_))throw Error("Invalid PNG signature");const r=new DataView(n.buffer,n.byteOffset,n.byteLength);let a,o,l,c,f,u,h=8,d=!1,p=0;const x=[];for(;h+12<=n.length;){const _=r.getUint32(h),L=h+8,R=L+_;if(_>64*1024*1024||R+4>n.length)throw Error("Invalid PNG chunk length");const A=String.fromCharCode(...n.subarray(h+4,h+8));if(A==="IHDR"){if(h!==8||_!==13||a!==void 0)throw Error("Invalid PNG header");if(a=r.getUint32(L),o=r.getUint32(L+4),c=n[L+9],l={0:1,2:3,3:1,4:2,6:4}[c],!a||!o||a*o>4e6||e!==void 0&&a!==e||t!==void 0&&o!==t)throw Error("Invalid PNG dimensions");if(n[L+8]!==8||!l||n[L+10]||n[L+11]||n[L+12])throw Error("Unsupported PNG encoding: requires non-interlaced 8-bit channels")}else{if(a===void 0)throw Error("PNG header must be first");if(A==="PLTE"){if(!_||_>768||_%3)throw Error("Invalid PNG palette");f=n.subarray(L,R)}else if(A==="tRNS")u=n.subarray(L,R);else if(A==="IDAT"){if(p+=_,p>64*1024*1024)throw Error("PNG compressed data too large");x.push(n.subarray(L,R))}else if(A==="IEND"){if(_)throw Error("Invalid PNG end chunk");d=!0;break}else if(A[0]===A[0].toUpperCase())throw Error("Unsupported PNG critical chunk: "+A)}h=R+4}if(!d||!x.length)throw Error("Truncated PNG");if(c===3&&!i&&!f)throw Error("PNG palette missing");const m=new Uint8Array(p);let v=0;for(const _ of x)m.set(_,v),v+=_.length;const M=a*l,T=(M+1)*o,E=fu(m,{out:new Uint8Array(T+1)});if(E.length!==T)throw Error("Invalid PNG pixel data length");const w=new Uint8Array(M*o),y=(_,L,R)=>{const A=_+L-R,O=Math.abs(A-_),N=Math.abs(A-L),C=Math.abs(A-R);return O<=N&&O<=C?_:N<=C?L:R};for(let _=0;_<o;_++){const L=E[_*(M+1)];if(L>4)throw Error("Invalid PNG scanline filter");for(let R=0;R<M;R++){const A=_*M+R,O=R>=l?w[A-l]:0,N=_?w[A-M]:0,C=_&&R>=l?w[A-M-l]:0,k=L===0?0:L===1?O:L===2?N:L===3?Math.floor((O+N)/2):y(O,N,C);w[A]=E[_*(M+1)+1+R]+k&255}}const g=new Uint8ClampedArray(a*o*4);for(let _=0;_<a*o;_++){const L=_*l,R=_*4;if(c===3){const A=w[L],O=A*(i?4:3),N=i||f;if(O+2>=N.length)throw Error("PNG palette index out of range");g[R]=N[O],g[R+1]=N[O+1],g[R+2]=N[O+2],g[R+3]=i?N[O+3]:(u==null?void 0:u[A])??255}else if(c===0||c===4){const A=w[L];let O=c===4?w[L+1]:255;c===0&&(u==null?void 0:u.length)===2&&A===(u[0]<<8|u[1])&&(O=0),g[R]=A,g[R+1]=A,g[R+2]=A,g[R+3]=O}else{const A=w[L],O=w[L+1],N=w[L+2];let C=c===6?w[L+3]:255;c===2&&(u==null?void 0:u.length)===6&&A===(u[0]<<8|u[1])&&O===(u[2]<<8|u[3])&&N===(u[4]<<8|u[5])&&(C=0),g[R]=A,g[R+1]=O,g[R+2]=N,g[R+3]=C}}return{w:a,h:o,rgba:g,...c===3?{indices:w}:{}}}function fl(n,e,t){const i=new Uint8Array(e);let s=0,r=0,a=0,o=0;const l=()=>{if(s>=n.length)throw Error("Truncated sprite data");return n[s++]},c=(f,u)=>{if(f<1||r+f>e)throw Error("Invalid sprite run");i.fill(u,r,r+f),r+=f};if(t===0){if(n.length<e)throw Error("Truncated raw sprite");return n.slice(0,e)}if(t===2){for(;r<e;){let f=l();if((f&192)===64){let u=f&63;c(u,l())}else c(1,f)}return i}if(t===3){for(;r<e;){let f=l()+1,u=l(),h=u&127,d=u&128?l():0;for(c(f,d);h--;){let p=l();c((p>>5)+1,p&31)}}return i}if(t!==4)throw Error("Unsupported sprite compression "+t);for(;r<e;){let f=l();for(let u=0;u<8&&r<e;u++){let h=l();if(f&1<<u){let d,p;if((h&63)===0?(p=(h<<2|l())+1,d=l()+3):(a|=(h&192)>>o,o+=2,d=(h&63)+1,o<8?p=l()+1:(p=a+1,a=0,o=0)),p>r||r+d>e)throw Error("Invalid sprite backreference");for(;d--;)i[r]=i[r-p],r++}else{let d;h&224?(d=h>>5,h&=31):d=l()+8,c(d,h)}}}return i}function lr(n,e,t="SFF palette index out of range"){const i=new Uint32Array(Math.ceil(e.length/4));new Uint8Array(i.buffer).set(e);const s=new Uint8ClampedArray(n.length*4),r=new Uint32Array(s.buffer);for(let a=0;a<n.length;a++){const o=n[a];if(o*4+2>=e.length)throw Error(t);r[a]=i[o]}return s}function Fc(n,e={}){if(!(n instanceof Uint8Array)||n.length<32||new TextDecoder().decode(n.subarray(0,12))!=="ElecbyteSpr\0")throw Error("Invalid SFF signature");if(n[15]===1)return xu(n,e);if(n[15]!==2)throw Error("Unsupported SFF version");if(n.length<68)throw Error("Truncated SFF header");const t=new DataView(n.buffer,n.byteOffset,n.byteLength),i=w=>t.getUint32(w,!0),s=w=>t.getInt16(w,!0),r=w=>t.getUint16(w,!0),a=i(36),o=i(40),l=i(44),c=i(48),f=i(52),u=i(60);if(o>2e4||c>4096)throw Error("SFF table too large");if(a+o*28>n.length||l+c*16>n.length)throw Error("Truncated SFF table");const h=[],d=new Rc({maxBytes:e.cacheBytes??16*1024*1024,sizeOf:w=>{var y;return w.rgba.byteLength+(((y=w.indices)==null?void 0:y.byteLength)||0)}}),p=new Map,x=Array.from({length:c},(w,y)=>({index:y,group:r(l+y*16),number:r(l+y*16+2),colors:r(l+y*16+4)}));for(let w=0;w<o;w++){const y=a+w*28;h.push({group:r(y),number:r(y+2),w:r(y+4),h:r(y+6),x:s(y+8),y:s(y+10),link:r(y+12),format:n[y+14],depth:n[y+15],offset:i(y+16),length:i(y+20),palette:r(y+24),flags:r(y+26)})}function m(w,y=new Set){if(p.has(w))return p.get(w);if(w>=c||y.has(w))throw Error("Invalid palette link");y.add(w);const g=l+w*16,_=i(g+12);if(!_)return m(r(g+6),y);const L=f+i(g+8);if(_%4||L+_>n.length)throw Error("Invalid SFF palette length");const R=n.slice(L,L+_);if(!n[13]&&!n[14])for(let A=0;A<R.length/4;A++)R[A*4+3]=A?255:0;return p.set(w,R),R}function v(w,y=new Set){if(d.has(w))return d.get(w);if(!Number.isInteger(w)||w<0||w>=h.length||y.has(w))throw Error("Invalid sprite link");y.add(w);const g=h[w];if(!g.length){const A=v(g.link,y),O={...A,...g,w:A.w,h:A.h,rgba:A.rgba};return A.indices&&g.palette!==A.palette&&(O.rgba=lr(A.indices,m(g.palette),"Linked sprite palette index out of range")),d.set(w,O),O}if(!g.w||!g.h||g.w*g.h>4e6)throw Error("Invalid SFF sprite dimensions");const _=(g.flags&1?u:f)+g.offset;if(_+g.length>n.length||g.length<(g.format?4:0))throw Error("Truncated SFF sprite data");const L=n.subarray(_+(g.format?4:0),_+g.length);let R;if(g.format>=10&&g.format<=12)R={...g,...vu(L,g.w,g.h,g.format===10&&c?m(g.palette):void 0)};else{if(g.depth!==8&&g.depth!==5)throw Error("Unsupported non-indexed SFF compression: "+g.format);const A=fl(L,g.w*g.h,g.format),O=lr(A,m(g.palette));R={...g,rgba:O,indices:A}}return d.set(w,R),R}function M(w,y,g){const _=v(w);if(!_.indices)return _;const L=x.find(O=>O.group===y&&O.number===g);if(!L)throw Error(`Palette ${y},${g} does not exist`);const R=x[_.palette];if(R&&Math.ceil(Math.log2(R.colors))!==Math.ceil(Math.log2(L.colors)))return _;const A=lr(_.indices,m(L.index),"Palette depth does not match indexed sprite");return{..._,rgba:A}}function T(w,y=new Set){if(!Number.isInteger(w)||w<0||w>=h.length||y.has(w))throw Error("Invalid sprite link");y.add(w);const g=h[w];if(!g.length){const L=T(g.link,y);return L?{...L,...g,w:L.w,h:L.h,colors:m(g.palette)}:null}if(!g.w||!g.h||g.w*g.h>4e6)throw Error("Invalid SFF sprite dimensions");if(g.format>=10||![5,8].includes(g.depth))return null;const _=(g.flags&1?u:f)+g.offset;if(_+g.length>n.length||g.length<(g.format?4:0))throw Error("Truncated SFF sprite data");return{...g,indices:fl(n.subarray(_+(g.format?4:0),_+g.length),g.w*g.h,g.format),colors:m(g.palette)}}return{sprites:h,decode:v,decodeIndexed:T,decodeWithPalette:M,paletteColors:(w,y)=>{const g=x.find(_=>_.group===w&&_.number===y);if(!g)throw Error(`Palette ${w},${y} does not exist`);return m(g.index).slice()},palettes:x,version:2,clearDecodedCache:()=>d.clear(),cacheStats:()=>({bytes:d.bytes,entries:d.size,evictions:d.evictions})}}function xu(n,{externalPalettes:e=new Map,cacheBytes:t=16*1024*1024}={}){var g;const i=new DataView(n.buffer,n.byteOffset,n.byteLength),s=_=>i.getUint32(_,!0),r=_=>i.getUint16(_,!0),a=_=>i.getInt16(_,!0),o=[],l=[],c=[],f=new Set,u=s(20);let h=s(24),d=-1,p=-1;if(u>2e4)throw Error("SFF table too large");const x=_=>{const L=new Uint8Array(1024);for(let R=0;R<256;R++)L.set([_[R*3],_[R*3+1],_[R*3+2],R?255:0],R*4);return c.push(L),c.length-1};for(let _=0;_<u;_++){if(h<32||h+32>n.length||f.has(h))throw Error("Invalid SFF v1 sprite table link");f.add(h);const L=s(h+4),R={group:r(h+12),number:r(h+14),x:a(h+8),y:a(h+10),link:r(h+16),offset:h+32,length:L,shared:n[h+18],palette:d};if(R.offset+L>n.length)throw Error("Truncated SFF v1 sprite");if(L){const A=L>=897&&n[R.offset+L-769]===12;(!R.shared||d<0)&&A&&(R.palette=x(n.subarray(R.offset+L-768,R.offset+L))),R.palette<0&&e.has(1)&&(c.push(e.get(1)),R.palette=c.length-1),R.palette>=0&&p<0&&(p=R.palette),R.group===0&&R.number===0&&R.palette>=0&&(p=R.palette),d=R.palette}else R.palette=void 0;if(o.push(R),h=s(h),!h&&_+1<u)throw Error("Truncated SFF v1 sprite table")}const m=c[p];if(m)for(const _ of o)_.palette>=0&&((g=c[_.palette])!=null&&g.every((L,R)=>L===m[R]))&&(_.palette=p);for(let _=0;_<c.length;_++)l.push({index:_,group:_===p?1:0,number:_===p?1:_+1,colors:256});for(const[_,L]of e){if(!(L instanceof Uint8Array)||L.length!==1024||!Number.isInteger(_)||_<1||_>256)throw Error("Invalid external SFF palette");if(_===1&&p>=0)c[p]=L;else{const R=c.length;c.push(L),l.push({index:R,group:1,number:_,colors:256})}}const v=new Rc({maxBytes:t,sizeOf:_=>{var L;return _.rgba.byteLength+(((L=_.indices)==null?void 0:L.byteLength)||0)}});function M(_,L){return{..._,rgba:lr(_.indices,L)}}function T(_,L=new Set){if(v.has(_))return v.get(_);if(!Number.isInteger(_)||_<0||_>=o.length||L.has(_))throw Error("Invalid SFF v1 sprite link");L.add(_);const R=o[_];if(!R.length){const se=T(R.link,L);R.palette=se.palette;const q={...se,...R,w:se.w,h:se.h};return v.set(_,q),q}const A=n.subarray(R.offset,R.offset+R.length);if(A.length<128||A[0]!==10||A[2]!==1||A[3]!==8||A[65]!==1)throw Error("Only indexed 8-bit PCX sprites are supported");const O=new DataView(A.buffer,A.byteOffset,A.byteLength),N=O.getUint16(8,!0)-O.getUint16(4,!0)+1,C=O.getUint16(10,!0)-O.getUint16(6,!0)+1,k=O.getUint16(66,!0);if(N<=0||C<=0||N*C>4e6||k*C>8e6||k<N)throw Error("Invalid PCX dimensions");const B=c[R.palette];if(!B)throw Error("PCX palette missing");const H=A.length>=897&&A[A.length-769]===12?A.length-769:A.length,P=new Uint8Array(k*C);let I=128,z=0;for(;z<P.length;){if(I>=H)throw Error("Truncated PCX");let se=A[I++],q=1;if((se&192)===192){if(q=se&63,I>=H)throw Error("Truncated PCX run");se=A[I++]}if(!q||z+q>P.length)throw Error("Invalid PCX run");P.fill(se,z,z+q),z+=q}const $=new Uint8Array(N*C);for(let se=0;se<C;se++)$.set(P.subarray(se*k,se*k+N),se*N);const te=M({...R,w:N,h:C,indices:$},B);return v.set(_,te),te}function E(_,L,R){const A=T(_),O=l.find(N=>N.group===L&&N.number===R);if(!O)throw Error(`Palette ${L},${R} does not exist`);return M(A,c[O.index])}return{sprites:o,palettes:l,decode:T,decodeIndexed:_=>{const L=T(_);return{...L,colors:c[L.palette]}},decodeWithPalette:E,paletteColors:(_,L)=>{const R=l.find(A=>A.group===_&&A.number===L);if(!R)throw Error(`Palette ${_},${L} does not exist`);return c[R.index].slice()},version:1,clearDecodedCache:()=>v.clear(),cacheStats:()=>({bytes:v.bytes,entries:v.size,evictions:v.evictions})}}function _u(n){if(!(n instanceof Uint8Array)||![768,772].includes(n.length))throw Error("ACT palette must contain 768 RGB bytes, with an optional 4-byte footer.");const e=new Uint8Array(1024);for(let t=0;t<256;t++){const i=(255-t)*3;e.set([n[i],n[i+1],n[i+2],t?255:0],t*4)}return e}const qr=new WeakMap;function cr(n){let e=n,t=0;for(;e&&t++<256;){if(e.ownPal||e.ownpal)return e;const i=e.paletteParent||e.parent||e.owner;if(!i||i===e)return e;e=i}return e}const Io=n=>new Map([...n||[]].map(([e,t])=>[e,[...t]]));function hr(n){const e={...n};for(const[t,i]of[["add",[0,0,0]],["mul",[256,256,256]],["sinadd",[0,0,0,0]]])if(e[t]!==void 0){const s=Array.isArray(e[t])?e[t]:[e[t]];e[t]=i.map((r,a)=>{const o=Math.trunc(Number(s[a]??r));return t==="mul"?Math.max(0,o):o})}return e.time!==void 0&&(e.time=Math.trunc(Number(e.time))),e.color!==void 0&&(e.color=Math.max(0,Math.min(256,Math.trunc(Number(e.color))))),e.invertall!==void 0&&(e.invertall=+!!e.invertall),e}function Lo(n,e,t){const i=Array.isArray(t)?t:[t],s=[Math.trunc(Number(i[0]??-1)),Math.trunc(Number(i[1]??0))];if(s[0]!==-1){if(s[0]<0||s[1]<0)throw Error("Invalid RemapPal palette pair.");Oc(e,[-1,0],s),n.clear(),n.set("*",s)}}function Oc(n,e,t){var a,o;if(!((a=n.sprite)!=null&&a.path)||!((o=n.files)!=null&&o[n.sprite.path]))return;const i=Bc(n),s=l=>i.palettes.find(c=>c.group===l[0]&&c.number===l[1]),r=s(t);if(!r)throw Error(`RemapPal destination palette ${t.join(",")} does not exist.`);if(e[0]!==-1){const l=s(e);if(!l)throw Error(`RemapPal source palette ${e.join(",")} does not exist.`);if(l.colors&&r.colors&&Math.ceil(Math.log2(l.colors))!==Math.ceil(Math.log2(r.colors)))throw Error("RemapPal source and destination color depths differ.")}}function Bc(n){var o,l;if(qr.has(n))return qr.get(n);const e=[],t=new Map,i=n.files,s=n.path.slice(0,n.path.lastIndexOf("/")+1);for(const[c,f]of Object.entries(n.def.files||{}))if(/^pal\d+$/.test(c)&&f)try{const u=Number(c.slice(3));if(u<1||u>256)throw Error(`Invalid palette number ${u}.`);const h=(o=n.checks)==null?void 0:o.find(p=>p.key===c);let d;if(h)d=h.ok?h.path:null;else try{d=Jn(f,s,!0)}catch{d=null}if(!d||!i[d])throw Error(`Palette file is missing from the ZIP: ${f}`);t.set(u,_u(i[d]))}catch(u){e.push({type:"palette",source:n.path,line:0,message:u.message})}const r=Fc(i[n.sprite.path],{externalPalettes:t});r.diagnostics=e,r.selectablePalettes=[...new Set((r.palettes||[]).filter(c=>c.group===1&&c.number>=1&&c.number<=12).map(c=>c.number))].sort((c,f)=>c-f),r.selectablePalettes.length||(r.selectablePalettes=[1]);const a=String(((l=n.def.info)==null?void 0:l["pal.defaults"])||"1").split(",").map(Number);return r.defaultPalette=a.find(c=>r.selectablePalettes.includes(c))??r.selectablePalettes[0],qr.set(n,r),r}function yu(n,e){var c,f;const t=((c=n.world)==null?void 0:c.orderedPhases)&&n.isProjectile&&n.removalReason==="expire",i=n.hitDef||(t?n.proximityHitDef:null);if(n===e||n.destroyed||!i&&(!((f=n.world)!=null&&f.orderedPhases)||n.isProjectile)||n.moveType!=="A"||n.isProjectile&&((n.removed||n.removing)&&!(t&&n.drawVisible)||n.remainingHits<=0||n.owner===e||!/^[SCA]\s*,\s*[NSH][ATP]$/i.test(String(i.attr??"").trim())))return!1;const s=String((i==null?void 0:i.affectteam)??"E").trim().toUpperCase(),r=!!(n.world&&e.world&&n.teamSide===e.teamSide);if(s==="E"&&r||s==="F"&&!r)return!1;const a=(i==null?void 0:i.coordinateScale)??n.coordinateScale??1;let o;(i==null?void 0:i["guard.dist"])!==void 0?o=i["guard.dist"]*a:n.isProjectile?o=n.guardDistance:n.attackDist!==void 0?o=n.attackDist*n.coordinateScale:o=n.constant("size.attack.dist")*n.coordinateScale;const l=(e.pos.x-n.pos.x)*n.facing;return l>0&&l<o}function kc(n,e){for(const t of e)if(yu(t,n))return!0;return!1}class dt extends Error{constructor(e,t=""){super(e),this.name="ExpressionError",this.source=t}}class Qi extends dt{constructor(e,t=""){super(e,t),this.name="UnsupportedExpressionError"}}class Lt extends dt{constructor(e,t=""){super(e,t),this.name="BottomError",this.bottom=!0}}const La=8192,dl=2048,pl=96,Su=8192,En=new Map,Mu={"||":1,"^^":2,"&&":3,"|":4,"^":5,"&":6,":=":7,"=":8,"!=":8,"<":9,">":9,"<=":9,">=":9,"+":10,"-":10,"*":11,"/":11,"%":11,"**":12},ur=new Set(["=","!=","<","<=",">",">="]),wu=new Set(["parent","root","helper","target","partner","enemy","enemynear","playerid","p2"]),bu=new Set(["pos","vel","p2dist","p2bodydist","parentdist","rootdist","screenpos","hitvel","camerapos"]),Hc=new Set(["s","c","a","h","l","i","n","v","u"]),Eu=new Set(["const","gethitvar","stagevar"]),Tu=new Set(["xveladd","yveladd","xoff","yoff","zoff","xvel","yvel","yaccel","fall.xvel","fall.yvel","fall.envshake.freq","fall.envshake.phase"]),Au=/^(?:fvar|sysfvar|const240p|const480p|const720p|pos [xy]|vel [xy]|p2dist [xy]|p2bodydist [xy]|parentdist [xy]|rootdist [xy]|screenpos [xy]|hitvel [xy]|camerapos [xy]|camerazoom|gamewidth|gameheight|screenwidth|screenheight|leftedge|rightedge|topedge|bottomedge|(?:front|back)edge(?:body)?dist|frontedge|backedge)$/,Ru=n=>/^(?:velocity\.|movement\.(?!airjump\.)|size\.[xy]scale$|data\.fall\.defence_mul$)/.test(n),Mr={abs:[1,Math.abs],ceil:[1,Math.ceil],floor:[1,Math.floor],exp:[1,Math.exp],ln:[1,Math.log],log:[2,(n,e)=>Math.log(e)/Math.log(n)],sin:[1,Math.sin],cos:[1,Math.cos],tan:[1,Math.tan],asin:[1,Math.asin],acos:[1,Math.acos],atan:[1,Math.atan],sqrt:[1,Math.sqrt],min:[2,Math.min],max:[2,Math.max]},ml=new Set(["var","fvar","sysvar","sysfvar","animelemtime","animelemno","animexist","selfanimexist","const","const240p","const480p","const720p","gethitvar","stagevar","numprojid","playeridexist","projcanceltime","projcontacttime","projguardedtime","projhittime"]),Cu=new Set(["numhelper","numexplod","numtarget","ishelper"]),Pu=new Set(["name","authorname","p1name","p2name","p3name","p4name"]),Iu=new Set("time stateno prevstateno anim animtime ctrl statetype movetype physics life lifemax power powermax facing alive gametime hitpausetime hitshakeover hitover movecontact movehit moveguarded movereversed hitcount uniqhitcount numenemy numpartner numproj roundstate roundno matchno teamside teampower tickspersecond ailevel palno id name authorname p1name p2name p3name p4name win lose drawgame inguarddist canrecover roundsexisted hitfall ishometeam teammode leftedge rightedge topedge bottomedge frontedge backedge frontedgedist backedgedist frontedgebodydist backedgebodydist gamewidth gameheight screenwidth screenheight camerazoom winko wintime winperfect loseko losetime loseperfect random pi e".split(" "));function Lu(n){if(typeof n!="string")throw new dt("Expression must be text.");if(n.length>La)throw new dt(`Expression exceeds ${La} characters.`);const e=[];let t=0;for(;t<n.length;){if(/\s/.test(n[t])){t++;continue}const i=t,s=n.slice(t);let r;if(n[t]==='"'){t++;let a="",o=!1;for(;t<n.length;){const l=n[t++];if(l==='"'){o=!0;break}l==="\\"&&n[t]==='"'?(a+='"',t++):a+=l}if(!o)throw new dt(`Unterminated string at ${i}.`,n);e.push({type:"string",value:a,position:i})}else if(r=s.match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/)){const a=Number(r[0]);if(!Number.isFinite(a))throw new dt(`Invalid number at ${i}.`,n);e.push({type:"number",value:a,float:/[.eE]/.test(r[0]),position:i}),t+=r[0].length}else if(r=s.match(/^[a-z_][a-z0-9_.]*/i))e.push({type:"name",value:r[0].toLowerCase(),position:i}),t+=r[0].length;else if(r=s.match(/^(?:\*\*|:=|<=|>=|!=|&&|\|\||\^\^|[+\-*/%!~&|^=<>()[\],])/))e.push({type:"operator",value:r[0],position:i}),t+=r[0].length;else throw new Qi(`Unsupported token at ${i}: ${n[t]}`,n);if(e.length>dl)throw new dt(`Expression exceeds ${dl} tokens.`,n)}return e.push({type:"end",value:"",position:t}),e}class Du{constructor(e){this.source=e,this.tokens=Lu(e),this.index=0,this.depth=0}peek(e=0){return this.tokens[this.index+e]||this.tokens.at(-1)}take(){return this.tokens[this.index++]}accept(e){return this.peek().value!==e?!1:(this.index++,!0)}expect(e){this.accept(e)||this.fail(`Expected "${e}"`)}fail(e){throw new dt(`${e} at ${this.peek().position}.`,this.source)}signedInteger(){const e=this.accept("-")?-1:(this.accept("+"),1),t=this.take();return(t.type!=="number"||t.float)&&this.fail("Expected an integer literal"),{kind:"number",value:e*t.value,float:!1}}parse(e=0){++this.depth>pl&&this.fail(`Expression nesting exceeds ${pl}`);let t=this.prefix();for(;;){const i=this.peek().value,s=Mu[i];if(s===void 0||s<e)break;if(this.take(),(i==="="||i==="!=")&&(this.peek().value==="["||this.isOpenInterval())){const r=this.take().value,a=this.parse();this.expect(",");const o=this.parse(),l=this.take().value;l!=="]"&&l!==")"&&this.fail("Expected an interval endpoint"),t={kind:"range",op:i,left:t,low:a,high:o,includeLow:r==="[",includeHigh:l==="]"}}else{const r=this.parse(s+(i===":="?0:1));i===":="?((t.kind!=="call"||!["var","fvar"].includes(t.name)||t.args.length!==1)&&this.fail("Assignment requires var(index) or fvar(index)"),t={kind:"assign",left:t,right:r}):t={kind:"binary",op:i,left:t,right:r}}}return this.depth--,t}isOpenInterval(){if(this.peek().value!=="(")return!1;const e=this.index,t=this.depth;try{return this.prefix(),!1}catch{}finally{this.index=e,this.depth=t}let i=0;for(let s=this.index;s<this.tokens.length;s++){const r=this.tokens[s].value;if(r==="("||r==="[")i++;else if(r===")"||r==="]"){if(--i===0)return!1}else if(r===","&&i===1)return!0}return!1}prefix(){const e=this.take();if(e.type==="number")return{kind:"number",value:e.value,float:e.float};if(e.type==="string")return{kind:"string",value:e.value};if(["+","-","!","~"].includes(e.value))return{kind:"unary",op:e.value,value:this.parse(13)};if(e.value==="("){const r=this.parse();return this.expect(")"),r}e.type!=="name"&&this.fail("Expected a value");const t=e.value;if(Pu.has(t)&&["=","!="].includes(this.peek().value)){const r=this.take().value,a=this.take();return a.type!=="string"&&this.fail(`${t} comparison requires a quoted name`),{kind:"binary",op:r,left:{kind:"name",name:t},right:{kind:"string",value:a.value}}}if(["statetype","movetype","p2statetype","p2movetype"].includes(t)&&["=","!="].includes(this.peek().value)&&this.peek(1).type==="name"&&Hc.has(this.peek(1).value)){const r=this.take().value,a=this.take().value;return{kind:"binary",op:r,left:{kind:"name",name:t},right:{kind:"string",value:a.toUpperCase()}}}if(t==="teammode"&&["=","!="].includes(this.peek().value)){const r=this.take().value,a=this.take();return(a.type!=="name"||!["single","simul","turns"].includes(a.value))&&this.fail("TeamMode requires Single, Simul or Turns"),{kind:"binary",op:r,left:{kind:"name",name:t},right:{kind:"string",value:a.value}}}const i=t.match(/^proj(hit|contact|guarded)(\d*)$/);if(i&&this.accept("=")){const r=this.signedInteger();[0,1].includes(r.value)||this.fail("Projectile condition requires 0 or 1");let a="=",o={kind:"number",value:1,float:!1};return this.accept(",")&&(ur.has(this.peek().value)&&(a=this.take().value),o=this.signedInteger()),{kind:"legacyprojectile",name:`proj${i[1]}time`,id:Number(i[2]||0),expected:r.value,op:a,time:o}}if(t==="command"&&["=","!="].includes(this.peek().value)){const r=this.take().value,a=this.take();return a.type!=="string"&&this.fail("Command comparison requires a quoted name"),{kind:"command",op:r,command:a.value}}if(t==="animelem"&&this.accept("=")){const r=this.signedInteger();let a="=",o={kind:"number",value:0,float:!1};return this.accept(",")&&(ur.has(this.peek().value)&&(a=this.take().value),o=this.signedInteger()),{kind:"legacyanim",element:r,op:a,time:o}}if(t==="timemod"&&ur.has(this.peek().value)){const r=this.take().value,a=this.signedInteger();return this.expect(","),{kind:"legacytime",op:r,divisor:a,remainder:this.signedInteger()}}if(t==="hitdefattr"&&["=","!="].includes(this.peek().value)){const r=this.take().value,a=this.take();(a.type!=="name"||!/^[sca]+$/.test(a.value))&&this.fail("HitDefAttr requires state letters S, C or A");const o=[a.value.toUpperCase()];this.expect(",");do{const l=this.take();(l.type!=="name"||!/^[nsha][atp]$/.test(l.value))&&this.fail("HitDefAttr requires attack attributes such as NA or ST"),o.push(l.value.toUpperCase())}while(this.peek().value===","&&this.peek(1).type==="name"&&/^[nsha][atp]$/.test(this.peek(1).value)&&this.accept(","));return{kind:"legacyattribute",op:r,attributes:o}}let s;if(this.accept("(")){const r=[];if(!this.accept(")")){do r.push(this.parse());while(this.accept(","));this.expect(")")}(ml.has(t)||Cu.has(t))&&r.length!==1&&this.fail(`${t} requires one argument`),Iu.has(t)&&r.length&&this.fail(`${t} requires no arguments`);const a=Object.hasOwn(Mr,t)?Mr[t][0]:["cond","ifelse"].includes(t)?3:null;a!==null&&r.length!==a&&this.fail(`${t} requires ${a} argument(s)`),s={kind:"call",name:t,args:r}}else{ml.has(t)&&this.fail(`${t} requires a parameter list`);let r=t;bu.has(t)&&this.peek().type==="name"&&/^[xy]$/.test(this.peek().value)&&(r+=" "+this.take().value),s={kind:"name",name:r}}return wu.has(t)&&this.accept(",")?{kind:"redirect",target:s,value:this.prefix()}:s}}function gn(n){if(typeof n!="string"||n.length>La)throw new dt("Invalid or oversized argument list.");const e=[];let t=0,i=!1,s=!1,r=0;for(let a=0;a<n.length;a++){const o=n[a];if(o==='"'&&!s&&(i=!i),s=o==="\\"&&!s,!i)if(o==="("||o==="[")t++;else if(o===")"||o==="]"){if(--t<0)throw new dt("Unbalanced argument list.")}else o===","&&t===0&&(e.push(n.slice(r,a).trim()),r=a+1)}if(i||t)throw new dt("Unbalanced argument list.");return e.push(n.slice(r).trim()),e}function zc(n){const e=new Du(n),t=e.parse();e.peek().type!=="end"&&e.fail("Unexpected token");const i=s=>{for(const r of Object.values(s))Array.isArray(r)?(r.forEach(a=>a&&typeof a=="object"&&i(a)),Object.freeze(r)):r&&typeof r=="object"&&i(r);return Object.freeze(s)};return i(t)}function Gc(n){if(En.has(n))return En.get(n);const e=zc(n),t=i=>Nu(e,i||{},n);return En.size>=512&&En.delete(En.keys().next().value),En.set(n,t),t}function Da(n,e={}){return Gc(n)(e)}function Na(n,e={}){return Gc(n)({...e,typedResult:!0})}const Xt=(n,e=!1)=>{if(typeof n!="number"||!Number.isFinite(n))throw new Lt("Expression produced a non-finite number.");const t=e?Math.fround(n):n|0;if(!Number.isFinite(t))throw new Lt("Expression produced a non-finite number.");return{value:t,float:e}},wt=n=>Xt(n,!1);function zt(n){if(n.bottom)throw n.error;if(typeof n.value!="number")throw new Lt("A numeric value is required.");return n.value}function rs(n){return zt(n)!==0}function Ls(n,e,t){if(e.bottom||t.bottom)throw(e.bottom?e:t).error;if(e.absent||t.absent){if(!["=","!="].includes(n))throw new dt("Only equality comparisons are allowed for strings.");return wt(+(n==="!="))}if(typeof e.value!=typeof t.value)throw new Lt("Cannot compare a string with a number.");if(typeof e.value=="string"&&!["=","!="].includes(n))throw new dt("Only equality comparisons are allowed for strings.");switch(typeof e.value=="number"&&(e.float||t.float)&&(e={value:Math.fround(e.value)},t={value:Math.fround(t.value)}),n){case"=":return wt(+(e.value===t.value));case"!=":return wt(+(e.value!==t.value));case"<":return wt(+(e.value<t.value));case"<=":return wt(+(e.value<=t.value));case">":return wt(+(e.value>t.value));case">=":return wt(+(e.value>=t.value))}}function Nu(n,e,t){let i=0;const s=(a,o,l)=>{if(typeof e.resolve!="function")throw new Qi(`Unsupported trigger: ${a}.`,t);const c=e.resolve(a,o,l);if(typeof c=="number")return Xt(c,Au.test(a)||a==="gethitvar"&&Tu.has(String(o[0]).toLowerCase())||a==="const"&&Ru(String(o[0]).toLowerCase())||!Number.isInteger(c));if(typeof c=="boolean")return wt(Number(c));if(typeof c=="string")return{value:c};if(c!=null&&c.absent)return{value:"",absent:!0};if(c&&typeof c.value=="number")return Xt(c.value,c.type==="float"||c.float);throw new Qi(`Trigger ${a} returned no supported value.`,t)},r=(a,o=null)=>{var l,c,f;if(++i>Su)throw new dt("Expression evaluation budget exceeded.",t);try{switch(a.kind){case"number":return Xt(a.value,a.float);case"string":return{value:a.value};case"name":return a.name==="pi"?Xt(Math.PI,!0):a.name==="e"?Xt(Math.E,!0):Hc.has(a.name)?{value:a.name.toUpperCase()}:s(a.name,[],o);case"unary":{const u=r(a.value,o),h=zt(u);if(a.op==="+")return u;if(a.op==="-")return Xt(-h,u.float);if(a.op==="!")return wt(+(h===0));if(u.float)throw new Lt("Bitwise operators require integers.",t);return wt(~h)}case"redirect":{if(o)throw new Qi("Recursive trigger redirection is unsupported by MUGEN 1.1.",t);const u=((l=a.target.args)==null?void 0:l.map(h=>zt(r(h))))||[];return r(a.value,{name:a.target.name,args:u})}case"assign":{if(o)throw new dt("Variable assignment cannot be redirected.",t);if(typeof e.assign!="function")throw new Qi("Variable assignment is unavailable.",t);const u=a.left.args.map(m=>zt(r(m))),h=r(a.right),d=zt(h),p=a.left.name==="var"?Math.trunc(d)|0:Math.fround(d),x=e.assign(a.left.name,u,p);return Xt(typeof x=="number"?x:p,a.left.name==="fvar")}case"range":{const u=[r(a.left,o),r(a.low,o),r(a.high,o)],h=u.some(v=>v.float),[d,p,x]=u.map(v=>h?Math.fround(zt(v)):zt(v)),m=(a.includeLow?d>=p:d>p)&&(a.includeHigh?d<=x:d<x);return wt(Number(a.op==="="?m:!m))}case"legacyanim":return Ls(a.op,s("animelemtime",[a.element.value],o),r(a.time,o));case"legacytime":{const u=a.divisor.value;if(u<=0)throw new dt("TimeMod divisor must be positive.",t);return Ls(a.op,wt(zt(s("time",[],o))%u),r(a.remainder,o))}case"legacyprojectile":{const u=s(a.name,[a.id],o),h=zt(u)>=0&&rs(Ls(a.op,u,r(a.time,o)));return wt(Number(a.expected?h:!h))}case"legacyattribute":{const u=rs(s("hitdefattr",a.attributes,o));return wt(Number(a.op==="="?u:!u))}case"command":{const u=rs(s("command",[a.command],o));return wt(Number(a.op==="="?u:!u))}case"call":{if(a.name==="cond"||a.name==="ifelse"){if(a.args.length!==3)throw new dt(`${a.name} requires three arguments.`,t);const p=r(a.args[0],o);if(a.name==="cond")return r(a.args[rs(p)?1:2],o);const x=[r(a.args[1],o),r(a.args[2],o)];for(const v of x)v.bottom&&((c=e.onWarning)==null||c.call(e,v.error));const m=rs(p)?0:1;return x[m]}if(Object.hasOwn(Mr,a.name)){const[p,x]=Mr[a.name];if(a.args.length!==p)throw new dt(`${a.name} requires ${p} argument(s).`,t);const m=a.args.map(T=>r(T,o)),v=x(...m.map(T=>["abs","min","max"].includes(a.name)?zt(T):Math.fround(zt(T)))),M=!["ceil","floor"].includes(a.name)&&(a.name!=="abs"||m[0].float)&&(!["min","max"].includes(a.name)||m.some(T=>T.float));return Xt(v,M)}const u=a.args.map(p=>Eu.has(a.name)&&p.kind==="name"?{value:p.name}:r(p,o)),h=u.find(p=>p.bottom);if(h)throw h.error;const d=u.map(p=>p.value);return s(a.name,d,o)}case"binary":{const u=r(a.left,o),h=r(a.right,o);if(ur.has(a.op))return Ls(a.op,u,h);const d=u.float||h.float,p=d?Math.fround(zt(u)):zt(u),x=d?Math.fround(zt(h)):zt(h);switch(a.op){case"+":return Xt(p+x,d);case"-":return Xt(p-x,d);case"*":return Xt(d?p*x:Math.imul(p,x),d);case"/":if(x===0)throw new Lt("Division by zero.",t);return Xt(d?p/x:Math.trunc(p/x),d);case"%":if(d||x===0)throw new Lt("Remainder requires integers and a nonzero divisor.",t);return wt(p%x);case"**":{const m=d||p<0||x<0;let v=p**x;return!m&&v>2147483647&&(v=2147483647,(f=e.onWarning)==null||f.call(e,new dt("Integer exponent overflow.",t))),Xt(v,m)}case"&&":return wt(+(p!==0&&x!==0));case"||":return wt(+(p!==0||x!==0));case"^^":return wt(+(p!==0!=(x!==0)));case"&":case"|":case"^":if(d)throw new Lt("Bitwise operators require integers.",t);return wt(a.op==="&"?p&x:a.op==="|"?p|x:p^x);default:throw new Qi(`Unsupported operator ${a.op}.`,t)}}default:throw new dt("Invalid compiled expression.",t)}}catch(u){if(u!=null&&u.bottom)return{bottom:!0,error:u};throw u}};try{const a=r(n);if(a.bottom)throw a.error;return e.typedResult?a:a.value}catch(a){throw a instanceof dt?(a.source||(a.source=t),a):a!=null&&a.bottom?new Lt(a.message||"Expression evaluated to bottom.",t):new dt((a==null?void 0:a.message)||"Trigger evaluation failed.",t)}}function Vc(n,e={},t=!1){var d,p,x,m;const i=n.coordinateScale||1,[s=0,r=0]=e[t?"offset":"pos"]||[0,0],a=String(e.postype||"p1").toLowerCase(),o=((d=n.world)==null?void 0:d.view.left)??((p=n.world)==null?void 0:p.leftBound)??-160,l=((x=n.world)==null?void 0:x.view.right)??((m=n.world)==null?void 0:m.rightBound)??160,c=n.opponent||n;let f=n.pos.x,u=n.facing,h=n.facing;if(a==="p2")f=c.pos.x,t||(u=h=c.facing);else if(a==="front")f=n.facing>0?l:o;else if(a==="back")f=n.facing>0?o:l,t||(u=n.facing);else if(a==="left"||a==="right")f=a==="left"?o:l,t||(u=h=1);else if(a!=="p1")throw Error(`Unsupported spawn postype: ${a}`);return{pos:{x:f+Number(s)*i*u,y:n.pos.y+Number(r)*i},facing:h*(Number(e.facing??1)<0?-1:1)}}const Wc=8192;function Xc(n){if(!/^"[\s\S]*"$/.test(n))throw Error("Text must be enclosed in double quotes.");if(n.length>Wc)throw Error("Debug text exceeds 8192 characters.");return n.slice(1,-1).replace(/\\([\s\S])/g,(e,t)=>{if(t==="n")return`
`;if(t==="t")return"    ";if(t==="\\"||t==='"')return t;throw Error(`Unsupported text escape \\${t}.`)})}function Uu(n){const e=Xc(n),t=[];let i=0,s=0;for(let r=0;r<e.length;r++)if(e[r]==="%"){if(t.push(e.slice(i,r)),e[r+1]==="%"){t.push("%"),r++,i=r+1;continue}const a=/^%([-+ #0]*)(\d*)(?:\.(\d*))?([difFeEgG])/.exec(e.slice(r));if(!a)throw Error("Unsupported clipboard format specifier.");const o=Number(a[2]||0),l=a[3]===void 0?void 0:Number(a[3]||0);if(o>512||l>20)throw Error("Clipboard format width or precision exceeds supported bounds.");t.push({flags:a[1],width:o,precision:l,spec:a[4]}),s++,r+=a[0].length-1,i=r+1}if(t.push(e.slice(i)),s>6)throw Error("Clipboard format accepts at most 6 numeric parameters.");return{parts:t,count:s}}function Fu({flags:n,width:e,precision:t,spec:i},{value:s,float:r}){if(typeof s!="number"||!Number.isFinite(s))throw Error("Clipboard parameters must be finite numbers.");r===void 0&&(r=!Number.isInteger(s)),/[di]/.test(i)===!!r&&(i=r?"f":"d",n="",e=0,t=void 0);const a=s<0||Object.is(s,-0),o=Math.abs(s);let l;if(/[di]/.test(i))l=t===0&&o===0?"":Math.trunc(o).toString().padStart(t??0,"0");else if(/[fF]/.test(i))l=o.toFixed(t??6);else if(/[eE]/.test(i))l=o.toExponential(t??6);else{const f=Math.max(1,t??6),u=Number(o.toPrecision(f)),h=u?Math.floor(Math.log10(u)):0;l=h<-4||h>=f?o.toExponential(f-1):o.toFixed(Math.max(0,f-h-1)),n.includes("#")||(l=l.replace(/(\.\d*?[1-9])0+(?=e|$)/,"$1").replace(/\.0*(?=e|$)/,""))}n.includes("#")&&!l.includes(".")&&(l=l.replace(/e|$/i,"."+(l.includes("e")?"e":""))),l=l.replace(/e([+-])(\d+)$/i,(f,u,h)=>"e"+u+h.padStart(2,"0")),/[FEG]/.test(i)&&(l=l.toUpperCase());const c=a?"-":n.includes("+")?"+":n.includes(" ")?" ":"";return n.includes("0")&&!n.includes("-")&&(t===void 0||!/[di]/.test(i))?c+l.padStart(Math.max(0,e-c.length),"0"):(l=c+l,n.includes("-")?l.padEnd(e):l.padStart(e))}function Ou(n,e){if(e.length!==n.count)throw Error(`Clipboard format requires ${n.count} parameters, received ${e.length}.`);let t=0;const i=n.parts.map(s=>typeof s=="string"?s:Fu(s,e[t++])).join("");if(i.length>Wc)throw Error("Formatted clipboard exceeds 8192 characters.");return i}const $r=n=>{if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(String(n).trim()))throw Error("ForceFeedback parameters require numeric constants.");const e=Number(n);if(!Number.isFinite(e))throw Error("ForceFeedback requires finite constants.");return e};function Bu(n){const e=String(n.waveform??"sine").replace(/^"(.*)"$/,"$1").toLowerCase();if(!["sine","square","sinesquare","off"].includes(e))throw Error(`Invalid ForceFeedback waveform ${e}.`);const t=$r(n.time??60),i=$r(n.self??1);if(!Number.isInteger(t)||t<0||t>36e4||![0,1].includes(i))throw Error("Invalid ForceFeedback time or self parameter.");const s={waveform:e,time:t,self:i};for(const r of["freq","ampl"]){const a=String(n[r]??"128").split(",").map($r);if(a.length>4||!Number.isInteger(a[0]))throw Error(`Invalid ForceFeedback ${r} coefficients.`);s[r]=Array.from({length:4},(o,l)=>a[l]??0)}return s}const Xn=(n,e=[0,0])=>n===void 0?[...e]:Array.isArray(n)?[n[0]??e[0],n[1]??e[1]]:[n,e[1]],wr=n=>n<0?-1:1,tn=n=>Math.trunc(Number(n)),qc=n=>/^\s*f(?=\s|[\d(+.-])/i.test(n||""),ku=new Set(["anim","id","space","pos","facing","vfacing","bindid","bindtime","vel","velocity","accel","removetime","supermovetime","pausemovetime","scale","angle","xangle","yangle","sprpriority","ontop","shadow","ownpal","remappal","removeongethit","ignorehitpause","trans","alpha","postype","random","supermove"]);function Hu(n,e,t,i=!1){const s=t.ownpal===void 0?i?e.common:e.ownpal:!!t.ownpal;if(s&&(i||!e.ownpal)&&(e.paletteRemaps=e.common?new Map:Io(n.paletteRemaps),n.events.push({type:"palettesnapshot",target:e,common:e.common})),s||(e.paletteRemaps=null,e.paletteSnapshot=null),e.ownpal=s,s&&!e.common&&t.remappal!==void 0)try{Lo(e.paletteRemaps,n.character,t.remappal)}catch(r){n.diagnostic("palette",r.message)}}function zu(n,e,t,i){var f,u,h,d,p,x;const s=e.config,r=((f=n.world)==null?void 0:f.view)||{displayHeight:240};if(i||t.random!==void 0){const m=Xn(s.random);e.randomOffset=m.map(v=>v>0?Math.floor(n.resolveTrigger("random")/1e3*v)-Math.floor(v/2):0)}const a=Xn(s.pos).map((m,v)=>(m+e.randomOffset[v])*n.coordinateScale);e.bindOffset=a,e.relativeFacing=wr(s.facing??1),e.vfacing=wr(s.vfacing??1);const o=s.space!==void 0||s.bindid!==void 0,l=/^1\.(\d+)/.exec(((h=(u=n.character.def)==null?void 0:u.info)==null?void 0:h.mugenversion)||"");if(e.postype=o?null:String(s.postype??(l&&Number(l[1])>=1?"none":"p1")).toLowerCase(),e.bindID=tn(s.bindid??-2),e.bindingTarget=null,o){if(e.space=String(s.space||"stage").toLowerCase(),!["stage","screen"].includes(e.space))throw Error(`Unsupported Explod space ${e.space}.`);if(e.space==="screen"&&e.bindID!==-2)throw Error("Screen-space Explods cannot be bound.");if(e.bindID!==-2&&s.bindtime===void 0)throw Error("Explod bindID requires bindtime.");e.pos={x:a[0],y:a[1]},e.facing=e.relativeFacing}else if(["p1","p2"].includes(e.postype))e.space="stage",e.bindingTarget=e.postype==="p2"?n.opponent:n,e.pos={x:((d=e.bindingTarget)==null?void 0:d.pos.x)??n.pos.x,y:((p=e.bindingTarget)==null?void 0:p.pos.y)??n.pos.y},e.facing=e.relativeFacing*(((x=e.bindingTarget)==null?void 0:x.facing)??n.facing);else if(["front","back","left","right"].includes(e.postype)){e.space="screen";const m=e.postype==="right"||e.postype==="front"&&n.facing>0||e.postype==="back"&&n.facing<0,v=e.postype==="back"?n.facing:1;e.pos={x:(m?320:0)+a[0]*v,y:a[1]},e.facing=e.relativeFacing*v}else if(e.postype==="none")e.space="stage",e.pos={x:a[0],y:a[1]},e.facing=e.relativeFacing;else throw Error(`Unsupported Explod postype ${e.postype}.`);const c=e.postype==="p1"||e.postype==="p2"||e.bindID!==-2;if(e.bindtime=e.space==="stage"&&c?tn(s.bindtime??1):0,e.initialBinding=c,e.positioned=!e.initialBinding,!Number.isFinite(r.displayHeight))throw Error("Invalid Explod viewport.")}function gl(n,e,t,i,s){var r,a;for(const o of["angle","xangle","yangle"])if(t[o]!==void 0&&(typeof t[o]!="number"||!Number.isFinite(t[o])))throw Error(`Explod ${o} must be a finite number.`);if(e.config={...e.config,...t},t.anim!==void 0||i){const o=t.anim===void 0?e.common:qc(s.values.anim),l=tn(t.anim??e.anim),c=o?n.commonAnimations:n.animations;if(!c.has(l)||!((r=c.get(l).frames)!=null&&r.length))throw Error(`Explod ${o?"common ":""}animation ${l} does not exist or has no frames.`);e.anim=l,e.common=o,e.animation=c.get(l),e.frameIndex=0,e.frameTime=0}for(const o of["removetime","supermovetime","pausemovetime","sprpriority","angle","xangle","yangle","ontop","shadow","removeongethit","ignorehitpause","supermove"])t[o]!==void 0&&(e[o]=t[o]);for(const o of["removetime","supermovetime","pausemovetime","sprpriority"])e[o]=tn(e[o]??0);if(e.removetime<-2||tn(e.config.bindtime??0)<-1)throw Error("Invalid Explod removal or binding time.");t.scale!==void 0&&(e.scale=Xn(t.scale,[1,1])),(t.trans!==void 0||t.alpha!==void 0)&&(e.trans={mode:String(e.config.trans||"default").toLowerCase(),alpha:Xn(e.config.alpha,[256,0])}),(t.vel!==void 0||t.velocity!==void 0||i)&&(e.velocity=Xn(e.config.vel??e.config.velocity).map(o=>o*n.coordinateScale)),(t.accel!==void 0||i)&&(e.accel=Xn(e.config.accel).map(o=>o*n.coordinateScale)),Hu(n,e,t,i),i||["space","postype","pos","bindid","random"].some(o=>t[o]!==void 0)?zu(n,e,t,i):(t.facing!==void 0&&(e.relativeFacing=wr(t.facing),e.facing=e.relativeFacing*(((a=e.bindingTarget)==null?void 0:a.facing)??(e.postype==="back"?n.facing:1))),t.vfacing!==void 0&&(e.vfacing=wr(t.vfacing)),t.bindtime!==void 0&&(e.bindtime=tn(t.bindtime)))}function Gu(n,e){const t=tn(n.value(e,"id",-1)),i=n.explods.filter(o=>t===-1||o.id===t);if(e.type==="removeexplod"){n.explods=n.explods.filter(o=>!i.includes(o)),n.drawExplods=n.drawExplods.filter(o=>t!==-1&&o.id!==t);return}if(e.type==="explodbindtime"){const o=tn(n.value(e,e.values.time===void 0?"value":"time",1));if(o<-1)throw Error("ExplodBindTime must be -1 or greater.");for(const l of i)l.bindtime=o;return}const s=qc(e.values.anim)?e.entries.map(o=>o.key==="anim"?{...o,value:o.value.replace(/^\s*f\s*/i,"")}:o):e.entries,r=n.effectParameters({...e,entries:s});e.values.ignorehitpause!==void 0&&(r.ignorehitpause=n.value(e,"ignorehitpause",1));for(const o of Object.keys(r))ku.has(o)||n.diagnostic("unsupported-explod-parameter",`Explod parameter ${o} is not implemented.`,e);for(const o of["pos","vel","velocity","accel","scale","random","remappal","alpha"])if(Array.isArray(r[o])&&r[o].length>2)throw Error(`Explod ${o} takes at most two components.`);if(e.type==="modifyexplod"){for(const o of i){const l=n.events.length,c={...o,config:{...o.config},paletteRemaps:o.paletteRemaps?new Map(o.paletteRemaps):null};try{gl(n,c,r,!1,e)}catch(f){throw n.events.length=l,f}Object.assign(o,c);for(const f of n.events.slice(l))f.target===c&&(f.target=o)}return}if(e.values.anim===void 0)throw Error("Explod requires anim.");if(n.explods.length>=512){n.diagnostic("resource-limit","Explod limit (512 per entity) reached.",e);return}const a={owner:n,creator:n,id:t,coordinateScale:n.coordinateScale,time:0,frameIndex:0,frameTime:0,config:{},removetime:-2,bindtime:0,ignorehitpause:1,supermovetime:0,pausemovetime:0,scale:[1,1],angle:0,xangle:0,yangle:0,vfacing:1};gl(n,a,r,!0,e),n.explods.push(a)}function vl(n,e,t){if(!(e!=null&&e.remaining)||(n[t]!==e&&(n[t]=e,n[t+"Moved"]=0),t==="superPause"&&n.supermove))return!0;const i=t==="superPause"?"supermovetime":"pausemovetime";return n[t+"Moved"]>=Math.max(0,n[i]||0)?!1:(n[t+"Moved"]++,!0)}function Vu(n,e){for(const t of n.explods)!(t.bindingTarget===e||!t.bindingTarget&&(t.postype==="p1"&&n===e||t.postype==="p2"&&n.opponent===e||t.bindID===e.id||t.bindID===-1&&n.root===e))||!t.initialBinding&&t.bindtime===0||((t.initialBinding||!t.positioned)&&(t.pos={x:e.pos.x+t.bindOffset[0]*e.facing,y:e.pos.y+t.bindOffset[1]},t.facing=t.relativeFacing*e.facing),t.bindingTarget=null,t.bindtime=0,t.initialBinding=!1,t.positioned=!0)}function Wu(n,{hitPaused:e=!1,pause:t=null,superPause:i=null,forceFrozen:s=!1}={}){var a,o;const r=[];for(const l of n.explods){if(l.removetime===0||l.pendingRemoval&&!(i!=null&&i.remaining)){l.removed=!0;continue}!l.bindingTarget&&(l.bindtime||l.initialBinding)&&(l.postype==="p2"?l.bindingTarget=n.opponent:l.postype==="p1"?l.bindingTarget=n:l.bindID!==-2&&(l.bindingTarget=l.bindID===-1?n.root:l.bindID===n.id?n:(a=n.world)==null?void 0:a.findPlayer(l.bindID))),(o=l.bindingTarget)!=null&&o.destroyed&&(l.bindingTarget=null,l.bindtime=0,l.initialBinding=!1);const c=l.space==="stage"&&!!l.bindingTarget&&(l.initialBinding||l.bindtime!==0);if(l.initialBinding&&!l.bindingTarget){n.diagnostic("missing-player",`Explod binding player ${l.bindID} is unavailable.`),l.removed=!0;continue}let f=s||e&&!l.ignorehitpause;if(f||(f=i!=null&&i.remaining?!vl(l,i,"superPause"):!vl(l,t,"pause")),c?(l.facing=l.relativeFacing*l.bindingTarget.facing,l.pos={x:l.bindingTarget.pos.x+l.bindOffset[0]*l.bindingTarget.facing,y:l.bindingTarget.pos.y+l.bindOffset[1]},l.positioned=!0):!f&&l.time>0&&(l.pos.x+=l.velocity[0]*l.facing,l.pos.y+=l.velocity[1]),r.push({...l,pos:{...l.pos},source:l}),f)continue;l.time>0&&(l.velocity[0]+=l.accel[0],l.velocity[1]+=l.accel[1]),l.initialBinding=!1,l.bindtime>0&&l.bindtime--;const u=l.animation.frames[l.frameIndex];u&&u.ticks>=0&&++l.frameTime>=Math.max(1,u.ticks)&&(l.frameTime=0,++l.frameIndex>=l.animation.frames.length&&(l.removetime===-2&&(l.removed=!0),l.frameIndex=l.animation.loopStart||0)),l.time++,l.removetime>0&&l.time>=l.removetime&&(l.removed=!0),l.removed&&l.supermove&&(i!=null&&i.remaining)&&(l.removed=!1,l.pendingRemoval=!0)}n.drawExplods=r,n.explods=n.explods.filter(l=>!l.removed)}const Tn=new Map,Xu=["N","S","H"];function xs(n){const e=String(n??"").toUpperCase().replace(/\s/g,"");if(Tn.has(e))return Tn.get(e);const[t,...i]=e.split(",");if(!/^[SCA]*$/.test(t))throw Error(`Invalid hit attribute states: ${t}`);const s=new Set;for(const a of i)if(a){if(!/^[NSHA][ATP]$/.test(a))throw Error(`Invalid hit attack attribute: ${a}`);for(const o of a[0]==="A"?Xu:[a[0]])s.add(o+a[1])}const r={states:new Set(t),attacks:s};return Tn.size>=512&&Tn.delete(Tn.keys().next().value),Tn.set(e,r),r}function $c(n,e){const t=typeof n=="string"?xs(n):n,i=typeof e=="string"?xs(e):e;return{state:[...i.states].some(s=>t.states.has(s)),attack:[...i.attacks].some(s=>t.attacks.has(s))}}function Yr(n,e){const t=$c(n,e);return t.state&&t.attack}function qu(n,e){const t=$c(n.attribute,e);return n.exclude?!t.state&&!t.attack:t.state&&t.attack}function Bt(n){var t,i,s;if((n==null?void 0:n.baseCoordinateScale)>0)return n.baseCoordinateScale;const e=Number(String(((s=(i=(t=n==null?void 0:n.character)==null?void 0:t.def)==null?void 0:i.info)==null?void 0:s.localcoord)||"320,240").split(",")[0]);return e>0?320/e:1}function fr(n,e,{edge:t=!1}={}){var o,l,c,f,u;const i=n.facing===e,s=i?"front":"back",r=t?(l=(o=n.width)==null?void 0:o.edge)==null?void 0:l[i?0:1]:(c=n.width)==null?void 0:c[s];if(r!==void 0)return Math.max(0,Number(r)||0)*(n.coordinateScale||Bt(n));const a=((u=(f=n.program)==null?void 0:f.constants)==null?void 0:u.get(`size.${n.stateType==="A"?"air":"ground"}.${s}`))??15;return Math.max(0,Number(a)||0)*Bt(n)}function xl(n){return n.startsWith("velocity.")?!/\.mul(?:\.|$)/.test(n):n.startsWith("size.")?!["size.xscale","size.yscale","size.proj.doscale"].includes(n):n.startsWith("movement.")&&!/(?:\.friction$|\.num$|\.time$|\.mul(?:\.|$))/.test(n)}const Yc=new Set(["xoff","yoff","zoff","xvel","yvel","xveladd","yveladd","yaccel","fall.xvel","fall.yvel","fall.envshake.ampl"]);function $u(n,e){const t=n.coordinateScale,i=t/e;if(n.coordinateScale=e,i!==1){for(const s of Yc)typeof n.getHitVars[s]=="number"&&(n.getHitVars[s]*=i);if(n.width){for(const s of["front","back"])typeof n.width[s]=="number"&&(n.width[s]*=i);n.width.edge&&(n.width.edge=n.width.edge.map(s=>s*i))}n.attackDist!==void 0&&(n.attackDist*=i)}}function Kc(n){return n.collisionFrame?n.collisionAnimationOwner||n.animationOwner||n:n.animationOwner||n}const Ua=n=>{var e;return n!=null&&n.isProjectile?(e=n.owner)==null?void 0:e.id:n==null?void 0:n.id},Zc=(n,e)=>!(e!=null&&e.isProjectile)&&(n.hitonce===void 0?/^[SCA]\s*,\s*[NSH]T$/i.test(n.attr||""):Number(n.hitonce)!==0);function Yu(n,e,t){const i=n.hitId??-1,s=e.chainid??-1;if(s>=0&&i!==s)return!1;const r=Array.isArray(e.nochainid)?e.nochainid:[e.nochainid??-1];return!(n.hitSourceId===Ua(t)&&Ua(t)!==void 0&&r.some(a=>a>=0&&a===i&&a!==s))}function Ku(n,e,t){var i;return Yu(n,e,t)&&!(Zc(e,t)&&((i=t==null?void 0:t._spentHitDefs)!=null&&i.has(e)))}function Zu(n,e,t){!t||!Zc(e,t)||(t._spentHitDefs??(t._spentHitDefs=new WeakSet),t._spentHitDefs.add(e),t.targets.splice(0,t.targets.length,n),t.targetHitIds.clear())}function _l(n,e,t,{count:i=!0}={}){var r,a;if(!n||(n.moveContact=1,n.moveHit=t?0:1,n.moveGuarded=t?1:0,n.moveReversed=0,t||!i||(r=n.world)!=null&&r.orderedPhases&&e.numhits===0))return;const s=((a=n.world)==null?void 0:a.ticks)??n.gameTime??0;n._lastHitCountTick!==s&&(n.hitCount=(n.hitCount||0)+1,n._lastHitCountTick=s),n.uniqHitCount=(n.uniqHitCount||0)+1}const Ju=new Set(["xveladd","yveladd","type","animtype","airtype","groundtype","damage","hitcount","fallcount","hitshaketime","hittime","slidetime","ctrltime","recovertime","xoff","yoff","zoff","xvel","yvel","yaccel","hitid","chainid","guarded","isbound","fall","fall.damage","fall.xvel","fall.yvel","fall.recover","fall.time","fall.recovertime","fall.kill","fall.envshake.time","fall.envshake.freq","fall.envshake.ampl","fall.envshake.phase"]);function ju(n){var e;return{type:0,hitid:-1,chainid:0,hitcount:0,fallcount:0,hittime:-1,recovertime:n.constant("data.liedown.time"),xveladd:0,yveladd:0,zoff:0,fall:0,"fall.time":0,"fall.recover":(e=n.world)!=null&&e.orderedPhases?0:1,"fall.recovertime":4}}const yl=new Set(["a","b","c","x","y","z","s","U","D","L","R"]);function Qu(n,e,t){const i=e===null?new Set([...t].filter(s=>yl.has(s))):new Set([...e].filter(s=>yl.has(s)));if(e===null)for(const[s,r]of[["holdup","U"],["holddown","D"],["holdfwd",n.facing<0?"L":"R"],["holdback",n.facing<0?"R":"L"]])t.has(s)&&i.add(r);n._recoveryPressed=[...i].some(s=>!n._previousInput.has(s)),n._previousInput=i,n.rawInput=i}function Sl(n,{hitPaused:e=!1}={}){var i;const t=n.getHitVars;if(n.moveType==="H"){if(t.fall&&(t["fall.time"]=(t["fall.time"]||0)+1),e||(n.hitTime>=0&&n.hitTime--,[5070,5100].includes(n.stateNo)&&n._fallEntry!==n._entrySerial&&(t.fallcount=(t.fallcount||0)+1,n._fallEntry=n._entrySerial,n._fallDefenceMultiplier*=n.constant("data.fall.defence_mul")),n.stateNo===5110&&(t.recovertime=Math.max(0,(t.recovertime??n.constant("data.liedown.time"))-1))),n._recoveryPressed&&n.alive&&(n.stateType==="L"||t.fallcount>0)&&t.recovertime>0){const s=Math.max(1,Math.ceil(t.recovertime/2));t.recovertime=Math.max(0,t.recovertime-1-Math.floor(n.resolveTrigger("random")/1e3*s))}}else n.comboHits=0,n.hitTime=-1,n.hitId=n.hitId<0?-1:0,n.hitSourceId=void 0,t.fall=0,t.fallcount=0,(i=n.world)!=null&&i.orderedPhases||(t["fall.time"]=0),t["fall.envshake.time"]=0,n._fallDefenceMultiplier=1,t.recovertime=n.constant("data.liedown.time");t.hittime=n.hitTime,t.hitid=n.hitId,t.chainid=Math.max(0,n.hitId)}const Jc=Object.freeze({attackLifeToPower:.7,getHitLifeToPower:.6,superTargetDefence:1.5});function ef(n={},e={}){const t=Object.keys(n).find(r=>/(?:^|\/)data\/mugen\.cfg$/i.test(r)),i=t?Or(wn(n[t])).rules||{}:{},s={...Jc};for(const[r,a]of[["attackLifeToPower","default.attack.lifetopowermul"],["getHitLifeToPower","default.gethit.lifetopowermul"],["superTargetDefence","super.targetdefencemul"]]){const o=Number(e[r]??i[a]??s[r]);if(!Number.isFinite(o)||o<0)throw Error(`Invalid combat rule ${a}.`);s[r]=o}return s}function Ds(n,e,t,{absolute:i=!1}={}){let s=Number(n);if(!Number.isFinite(s))throw Error("Damage must be finite.");if(!i){const r=e?Math.max(0,e.constant("data.attack")/100*(e.attackMultiplier??1)):1,a=Math.max(.01,t.constant("data.defence")/100);s*=r*Math.max(0,t.defenceMultiplier??1)*Math.max(0,t._fallDefenceMultiplier??1)/a}return s>0?Math.max(1,Math.round(s)):Math.round(s)}function tf(n,e=Jc){var s;const t=Math.max(0,Math.trunc(((s=n.damage)==null?void 0:s[0])||0)),i=(r,a)=>{const o=Array.isArray(r)?r:r===void 0?[Math.trunc(Math.fround(Math.fround(t)*Math.fround(a)))]:[r],l=Math.trunc(o[0]||0);return[l,Math.trunc(o[1]??l/2)]};return{get:i(n.getpower,e.attackLifeToPower),give:i(n.givepower,e.getHitLifeToPower)}}function nf(n,e,t,i=1){const s=n,r=e;return t!=="L"&&(t!=="A"&&e===0&&(n*=.66),n&&(n+=Math.sign(n)*2.5/i),e<=0&&(e=Math.min(e-2/i,(t==="A"?-3:-6)/i))),{x:n,y:e,xadd:n-s,yadd:e-r}}function jc(n,e="<script>"){const t=[];let i;for(const[s,r]of String(n).replace(/^\uFEFF/,"").split(/\r?\n/).entries()){let a=!1,o=!1,l="";for(let v=0;v<r.length;v++){const M=r[v];if(M==='"'&&!o&&(a=!a),M===";"&&!a)break;l+=M,o=M==="\\"&&!o}const c=l.trim();if(!c)continue;const f=c.match(/^\[([^\]]+)\]/);if(f){i={name:f[1].trim().toLowerCase(),source:e,line:s+1,entries:[],values:{}},t.push(i);continue}let u=-1,h=0,d=!1,p=!1;for(let v=0;v<c.length;v++){const M=c[v];if(M==='"'&&!p&&(d=!d),!d){if(M==="("||M==="[")h++;else if(M===")"||M==="]")h--;else if(M==="="&&h===0){u=v;break}}p=M==="\\"&&!p}if(!i||u<1)continue;const x=c.slice(0,u).trim().toLowerCase(),m=c.slice(u+1).trim();i.entries.push({key:x,value:m,line:s+1}),i.values[x]=m}return t}const sf={"data.life":1e3,"data.power":3e3,"data.attack":100,"data.defence":100,"data.airjuggle":15,"data.liedown.time":60,"data.sparkno":2,"data.guard.sparkno":40,"data.fall.defence_up":50,"data.ko.echo":0,"data.intpersistindex":60,"data.floatpersistindex":40,"size.xscale":1,"size.yscale":1,"size.ground.back":15,"size.ground.front":16,"size.air.back":12,"size.air.front":12,"size.height":60,"size.attack.dist":160,"size.proj.doscale":0,"size.proj.attack.dist":90,"size.head.pos.x":0,"size.head.pos.y":-90,"size.mid.pos.x":0,"size.mid.pos.y":-60,"size.draw.offset.x":0,"size.draw.offset.y":0,"size.shadowoffset":0,"velocity.walk.fwd.x":2.4,"velocity.walk.back.x":-2.2,"velocity.run.fwd.x":4.6,"velocity.run.fwd.y":0,"velocity.run.back.x":-4.5,"velocity.run.back.y":-3.8,"velocity.jump.neu.x":0,"velocity.jump.neu.y":-8.4,"velocity.jump.y":-8.4,"velocity.jump.fwd.x":2.5,"velocity.jump.back.x":-2.55,"velocity.runjump.fwd.x":4,"velocity.runjump.fwd.y":-8.1,"velocity.runjump.back.x":-2.55,"velocity.runjump.back.y":-8.1,"velocity.airjump.neu.x":0,"velocity.airjump.neu.y":-8.1,"velocity.airjump.y":-8.1,"velocity.airjump.fwd.x":2.5,"velocity.airjump.back.x":-2.55,"velocity.air.gethit.groundrecover.x":-.15,"velocity.air.gethit.groundrecover.y":-3.5,"velocity.air.gethit.airrecover.mul.x":.5,"velocity.air.gethit.airrecover.mul.y":.2,"velocity.air.gethit.airrecover.add.x":0,"velocity.air.gethit.airrecover.add.y":-4.5,"velocity.air.gethit.airrecover.back":-1,"velocity.air.gethit.airrecover.fwd":0,"velocity.air.gethit.airrecover.up":-2,"velocity.air.gethit.airrecover.down":1.5,"movement.yaccel":.44,"movement.stand.friction":.85,"movement.crouch.friction":.82,"movement.stand.friction.threshold":2,"movement.crouch.friction.threshold":.05,"movement.airjump.num":1,"movement.airjump.height":35,"movement.air.gethit.groundlevel":25,"movement.air.gethit.groundrecover.ground.threshold":-20,"movement.air.gethit.groundrecover.groundlevel":10,"movement.air.gethit.airrecover.threshold":-1,"movement.air.gethit.airrecover.yaccel":.35,"movement.air.gethit.trip.groundlevel":15,"movement.down.bounce.offset.x":0,"movement.down.bounce.offset.y":20,"movement.down.bounce.yaccel":.4,"movement.down.bounce.groundlevel":12,"movement.down.friction.threshold":.05},Do=new Set(["null","changestate","selfstate","changeanim","changeanim2","ctrlset","statetypeset","velset","veladd","velmul","posset","posadd","posfreeze","gravity","turn","varset","varadd","varmul","varrandom","varrangeset","parentvarset","parentvaradd","lifeadd","lifeset","poweradd","powerset","hitvelset","hitdef","hitby","nothitby","hitoverride","sprpriority","width","screenbound","playerpush","assertspecial","assertinput","playsnd","stopsnd","sndpan","envshake","palfx","allpalfx","bgpalfx","explod","modifyexplod","removeexplod","explodbindtime","targetbind","targetfacing","targetlifeadd","targetpoweradd","targetvelset","targetveladd","targetstate","targetdrop","bindtoroot","bindtoparent","bindtotarget","attackmulset","defencemulset","hitadd","hitcount","hitfallset","hitfallvel","hitfallDamage".toLowerCase(),"angleadd","angleset","anglemul","angledraw","offset","destroyself","helper","projectile","pause","superpause","afterimage","afterimagetime","trans","movehitreset","attackdist","reversaldef","envcolor","fallenvshake","remappal","makedust","gamemakeanim","forcefeedback","displaytoclipboard","appendtoclipboard","clearclipboard","victoryquote"]);new Set(Do);const No=new Set(["time","stateno","prevstateno","anim","animelem","animtime","ctrl","statetype","movetype","physics","life","lifemax","power","powermax","facing","alive","gametime","hitpausetime","hitshakeover","hitover","movecontact","movehit","moveguarded","movereversed","hitcount","uniqhitcount","numhelper","numexplod","numtarget","numenemy","numpartner","ishelper","roundstate","roundno","matchno","teamside","teampower","tickspersecond","ailevel","palno","id","name","authorname","numproj","win","lose","drawgame","inguarddist","canrecover","pos x","pos y","vel x","vel y","screenpos x","screenpos y","command","const","const240p","const480p","const720p","random","animexist","selfanimexist","animelemtime","animelemno","gethitvar","playeridexist","p2name","p2life","p2stateno","p2statetype","p2movetype","p2bodydist x","p2dist x","p2bodydist y","p2dist y","hitdefattr","roundsexisted","camerapos x","camerapos y","hitfall","hitvel x","hitvel y","frontedgedist","backedgedist","frontedgebodydist","backedgebodydist","var","fvar","sysvar","sysfvar"]);No.add("teammode");No.add("ishometeam");for(const n of["p1name","p3name","p4name","frontedge","backedge","const240p","const480p","const720p"])No.add(n);const rf=new Set(["playsnd","stopsnd","sndpan","envshake","envcolor","palfx","allpalfx","bgpalfx","afterimage","afterimagetime"]),Kr=n=>vn(n).replaceAll("\\","/").toLowerCase().replace(/^\.\//,""),vn=n=>String(n??"").replace(/^"(.*)"$/,"$1"),Zr=wn,Uo=new Map;for(const n of["attackdist","attackmulset","changeanim","changeanim2","changestate","selfstate","ctrlset","defencemulset","hitadd","lifeadd","lifeset","playerpush","playsnd","poweradd","powerset","targetfacing","targetlifeadd","targetpoweradd","targetstate"])Uo.set(n,["value"]);for(const[n,e]of Object.entries({afterimagetime:["time"],assertspecial:["flag"],assertinput:["flag"],displaytoclipboard:["text"],appendtoclipboard:["text"],envshake:["time"],explod:["anim"],hitdef:["attr"],pause:["time"],reversaldef:["reversal.attr"],sndpan:["channel"],stopsnd:["channel"],trans:["trans"],varrandom:["v"]}))Uo.set(n,e);const Jr=new WeakMap;function dr(n){var i;if(Jr.has(n))return Jr.get(n);const e={ignorehitpause:0,persistent:1,groups:new Map,errors:[],warnings:[]};for(const s of Uo.get(n.type)||[])n.values[s]===void 0&&e.errors.push({line:n.line,message:`${n.type} requires ${s}.`});["varset","varadd","varmul","parentvarset","parentvaradd"].includes(n.type)&&!n.entries.some(s=>/^(?:var|fvar|sysvar|sysfvar)\s*\(/.test(s.key))&&(n.values.v===void 0&&n.values.fv===void 0&&e.errors.push({line:n.line,message:`${n.type} requires v or fv (or alternate variable assignment syntax).`}),n.values.value===void 0&&e.errors.push({line:n.line,message:`${n.type} requires value.`})),n.type==="varrangeset"&&n.values.value===void 0&&n.values.fvalue===void 0&&e.errors.push({line:n.line,message:"VarRangeSet requires value or fvalue."}),n.type==="sndpan"&&n.values.pan===void 0&&n.values.abspan===void 0&&e.errors.push({line:n.line,message:"SndPan requires pan or abspan."});for(const s of["ignorehitpause","persistent"])if(n.values[s]!==void 0){const r=n.values[s],a=Number(r);!/^[+-]?\d+$/.test(r)||!Number.isSafeInteger(a)||a<-2147483648||a>2147483647||s==="persistent"&&a<0?e.errors.push({line:((i=n.entries.find(o=>o.key===s))==null?void 0:i.line)||n.line,message:`${s} requires ${s==="persistent"?"a nonnegative":"a signed 32-bit"} integer constant; expressions are not allowed.`}):e[s]=a}for(const s of n.entries){const r=/^trigger([1-9]\d*)$/.exec(s.key);if(r){const a=Number(r[1]);e.groups.has(a)||e.groups.set(a,[]),e.groups.get(a).push(s)}}e.groups.has(1)||e.errors.push({line:n.line,message:"A state controller requires at least one trigger1."});let t=1;for(;e.groups.has(t);)t++;for(const[s,r]of e.groups)s>=t&&(e.groups.delete(s),e.warnings.push({line:r[0].line,message:`trigger${s} is ignored because trigger${t} is missing.`}));return Jr.set(n,e),e}function Qc(n,{commonText:e="",constantDefaults:t={}}={}){var h,d;const i={states:new Map,constants:new Map(Object.entries({...sf,...t})),quotes:new Map,diagnostics:[],sources:[],controllerTypes:new Set},s=[];e&&s.push(["<common states>",e]);const r=n.files||{},a=((h=n.path)==null?void 0:h.slice(0,n.path.lastIndexOf("/")+1))||"",o=p=>{const x=Kr(p),m=a.lastIndexOf("/chars/"),v=m<0?"":a.slice(0,m+1),M=(n.checks||[]).find(T=>T.ok&&T.path&&Kr(T.value||"")===x&&r[T.path]);return[M==null?void 0:M.path,a+x,x,v+"data/"+x,"data/"+x].find(T=>T&&r[T])},l=((d=n.def)==null?void 0:d.files)||{},c=l.stcommon&&o(l.stcommon);c?s.push([c,Zr(r[c])]):l.stcommon&&Kr(l.stcommon).split("/").at(-1)!=="common1.cns"&&i.diagnostics.push({source:n.path,line:0,type:"missing-file",message:`Common state file not found: ${l.stcommon}`});const f=new Set;for(const[p,x]of Object.entries(l)){if(!/^(cns|cmd|st\d*)$/.test(p)||!x)continue;const m=o(x);m&&!f.has(m)?(f.add(m),s.push([m,Zr(r[m])])):m||i.diagnostics.push({source:n.path,line:0,type:"missing-file",message:`${p}: ${x}`})}for(const p of n.checks||[])/^(cns|cmd|st\d*)$/.test(p.key)&&p.ok&&r[p.path]&&!f.has(p.path)&&(f.add(p.path),s.push([p.path,Zr(r[p.path])]));let u=0;for(const[p,x]of s){i.sources.push(p);let m;for(const v of jc(x,p)){const M=v.name.match(/^statedef\s+(-?\d+)\s*$/);if(M){m={id:+M[1],...v,controllers:[]},i.states.set(m.id,m);const T=new Set(["type","movetype","physics","anim","velset","ctrl","poweradd","facep2","hitdefpersist","movehitpersist","hitcountpersist","sprpriority","juggle"]);for(const E of v.entries)T.has(E.key)||i.diagnostics.push({source:p,line:E.line,type:"unsupported-state-parameter",message:`Statedef parameter ${E.key} is not implemented.`})}else if(/^state(?:\s|$)/.test(v.name)){if(!m){i.diagnostics.push({source:p,line:v.line,type:"parse",message:"State controller has no preceding Statedef."});continue}const T=vn(v.values.type||"").toLowerCase(),E={...v,id:++u,type:T,state:m.id};m.controllers.push(E),i.controllerTypes.add(T);const w=dr(E);for(const[y,g]of[["controller-parameter",w.errors],["trigger-numbering",w.warnings]])for(const _ of g)i.diagnostics.push({source:p,line:_.line,type:y,message:_.message});Do.has(T)||i.diagnostics.push({source:p,line:v.line,type:"unsupported-controller",name:T||"(missing type)",message:`Controller ${T||"(missing type)"} is not implemented.`})}else if(v.name==="quotes")for(const T of v.entries){const E=/^victory(\d{1,2})$/.exec(T.key);if(E)try{i.quotes.set(+E[1],Xc(T.value))}catch(w){i.diagnostics.push({source:p,line:T.line,type:"quote",message:w.message})}}else if(/^(data|size|velocity|movement)$/.test(v.name))for(const T of v.entries){const E=`${v.name}.${T.key}`,w=T.value.split(",").map(y=>Number(y.trim()));w.some(y=>!Number.isFinite(y))||(i.constants.set(E,w.length===1?w[0]:w),(w.length>1||v.name==="velocity")&&(i.constants.set(E+".x",w[0]),w.length>1&&i.constants.set(E+".y",w[1])),E==="velocity.jump.neu"&&w.length>1&&i.constants.set("velocity.jump.y",w[1]),E==="velocity.airjump.neu"&&w.length>1&&i.constants.set("velocity.airjump.y",w[1]))}}}return i}const Jt=n=>{const e=Number(n);if(!Number.isFinite(e))throw new Error(`Expected finite number, received ${String(n)}`);return e},ct=n=>Math.trunc(Jt(n)),Ht=n=>typeof n=="number"&&Number.isFinite(n)&&n!==0,ni=(n,e,t)=>Math.min(t,Math.max(e,n));class br{constructor(e,t={}){var s,r,a,o,l;this.character=e,this.options=t,this.program=t.program||Qc(e,t),this.animations=new Map((e.animations||[]).map(c=>[c.id,c])),this.diagnostics=[...this.program.diagnostics],this._diagnosticKeys=new Set(this.diagnostics.map(c=>`${c.source}:${c.line}:${c.type}:${c.message}`)),this._seed=t.seed??439041101,this.id=t.id??1,this.name=((r=(s=e.def)==null?void 0:s.info)==null?void 0:r.name)||"Character";const i=(((o=(a=e.def)==null?void 0:a.info)==null?void 0:o.localcoord)||"320,240").split(",").map(Number);this.localcoord={x:i[0]||320,y:i[1]||240},this.coordinateScale=320/this.localcoord.x,this.baseCoordinateScale=this.coordinateScale,this.world=t.world||null,this.parent=t.parent||null,this.root=t.root||this,this.helperId=t.helperId??0,this.keyCtrl=t.keyCtrl??!this.parent,this.ownPal=t.ownPal??!1,this.teamSide=t.teamSide??((l=this.root.options)==null?void 0:l.teamSide)??1,this.commonAnimations=t.commonAnimations||new Map,this.reset()}reset(){var e,t,i;this.vars=new Int32Array(60),this.fvars=new Float32Array(40),this.stateOwner=this,this.animationOwner=this,this.destroyed=!1,this.coordinateScale=this.baseCoordinateScale,this._scriptOwner=null,this.sysvars=new Int32Array(5),this.sysfvars=new Float32Array(5),this.maxLife=this.constant("data.life"),this.life=this.maxLife,this.maxPower=this.constant("data.power"),this._power=0,this.parent||(this.power=0),this.pos={x:((e=this.options.position)==null?void 0:e.x)||0,y:((t=this.options.position)==null?void 0:t.y)||0},this.vel={x:0,y:0},this.facing=this.options.facing===-1?-1:1,this.ctrl=1,this.stateType="S",this.moveType="I",this.physics="S",this.stateNo=0,this.prevStateNo=0,this.time=0,this.gameTime=0,this.anim=0,this.frameIndex=0,this.frameTime=0,this.animationTime=0,this.animationCycleTime=0,this.animationLooped=!1,this.animationEnded=!1,this.collisionFrame=null,this.collisionAnimationOwner=null,this.collisionAnimation=null,this.collisionFrameIndex=0,this.collisionFrameTime=0,this.hitDef=null,this.reversalDef=null,this.moveReversed=0,this._hitSerial=0,this.hitPauseTime=0,this.hitTime=-1,this.hitId=-1,this.hitSourceId=void 0,this._spentHitDefs=new WeakSet,this.inGuardDistance=!1,this._projectileContactShield=!1,this.moveContact=0,this.moveHit=0,this.moveGuarded=0,this.hitCount=0,this.uniqHitCount=0,this.comboHits=0,this._lastHitCountTick=null,this.getHitVars=ju(this),this._fallXVelocityDefined=!1,this._fallDefenceMultiplier=1,this._previousInput=new Set,this.rawInput=new Set,this._fallEntry=-1,this.targets=[],this.targetHitIds=new Map,this.helpers=[],this.explods=[],this.drawExplods=[],this.events=[],this.commands=new Set,this.asserted=new Set,this.opponent=null,this.pendingAssertedInputs=new Set,this._pendingStateEntry=null,this.attackMultiplier=1,this.defenceMultiplier=1,this.sprPriority=0,this.angle=0,this.drawScale={x:1,y:1},this.drawOffset={x:0,y:0},this.playerPush=!this.parent,this.screenBound=!this.parent,this.moveCamera={x:!this.parent,y:!this.parent},this.posFrozen=!1,this.width=null,this.hitFilters=[null,null],this.hitOverrides=new Map,this.bound=null,this._controllerCounts=new Map,this._entrySerial=0,this.pauseMoveTime=this.options.pauseMoveTime||0,this.superMoveTime=this.options.superMoveTime||0,this.projectileHistory=[],this.trans=null,this.angleDraw=!1,this.juggleCost=0,this._juggleSerial=0,this._paletteRemaps=new Map,this.paletteNo=Math.max(1,Math.min(256,Math.trunc(this.options.paletteNo??((i=this.parent)==null?void 0:i.paletteNo)??1))),this.paletteNo!==1&&this._paletteRemaps.set("1,1",[1,this.paletteNo]),this._initializing=!1,this.aiLevel=this.parent?this.root.aiLevel:Math.max(0,Math.min(8,Math.trunc(Number.isFinite(Number(this.options.aiLevel))?Number(this.options.aiLevel):0))),this.clipboard="",this.victoryQuoteIndex=-1,this.victoryQuote=null,this._dustTicks=new Map,this.cornerPush=0,this._previousUp=!1,this.airJumps=0,this._changeCount=0,this._executing=null,this.attackDist=void 0,this.changeState(0),this.events=[]}diagnostic(e,t,i=this._executing){const s={source:(i==null?void 0:i.source)||this.character.path||"<character>",line:(i==null?void 0:i.line)||0,type:e,message:t};i&&(s.controller=i.type,s.state=i.state);const r=`${s.source}:${s.line}:${s.type}:${s.message}`;return this._diagnosticKeys.has(r)||(this._diagnosticKeys.add(r),this.diagnostics.push(s)),s}constant(e,t=this.coordinateScale){if(e=String(e).toLowerCase(),e==="data.fall.defence_mul")return 100/(100+this.constant("data.fall.defence_up",t));if(!this.program.constants.has(e))throw new Error(`Unknown character constant: ${e}`);const i=this.program.constants.get(e);return(Array.isArray(i)?i[0]:i)*(xl(e)?this.baseCoordinateScale/t:1)}get animation(){return(this.animationOwner||this).animations.get(this.anim)}get currentFrame(){var e;return((e=this.animation)==null?void 0:e.frames[this.frameIndex])||null}get animElemTime(){return this.frameTime}get animTime(){var t;const e=(t=this.animation)==null?void 0:t.frames;return!(e!=null&&e.length)||this.animationEnded?0:e.some(i=>i.ticks<0)?-1:this.animationCycleTime-e.reduce((i,s)=>i+Math.max(1,s.ticks),0)}get alive(){return this.life>0}get paletteRemaps(){return this.parent&&!this.ownPal?this.parent.paletteRemaps:this._paletteRemaps}ownedHelpers(){return this.world?this.world.entities.filter(e=>e.parent&&!e.destroyed&&(this===this.root?e.root===this:e.parent===this)):this.helpers.filter(e=>!e.destroyed)}get power(){return this.parent?this.root.power:this._power}set power(e){this.parent?this.root.power=e:this._power=e}evaluate(e,t=this._executing,i=!1){try{return(this.options.expressionEvaluator||(i?Na:Da))(e,{resolve:(s,r=[],a=null)=>this.resolveTrigger(s,r,a),assign:(s,r,a)=>this.assignVariable(s,r,a),onWarning:s=>{s.bottom||this.diagnostic("expression-warning",`${e}: ${s.message}`,t)},typedResult:i})}catch(s){throw s.bottom||this.diagnostic("expression",`${e}: ${s.message}`,t),s}}variableArray(e){const t={var:this.vars,fvar:this.fvars,sysvar:this.sysvars,sysfvar:this.sysfvars};if(!t[e])throw new Error(`Unsupported assignable variable: ${e}`);return t[e]}assignVariable(e,t,i){const s=this.variableArray(e.toLowerCase()),r=ct(t[0]);if(r<0||r>=s.length)throw new Lt(`${e} index out of range: ${r}`);return s[r]=Jt(i),s[r]}resolveTrigger(e,t=[],i=null,s=this.coordinateScale){var u,h,d,p,x,m,v,M,T,E,w,y,g,_,L,R,A,O,N,C,k,B,H,P,I,z,$,te,se,q,ne,fe,we,de,Pe,je,Te,qe,Ke;if(e=e.toLowerCase(),i){let ie;const Re=i.name.toLowerCase();if(["enemynear","enemy","p2"].includes(Re)){const Se=(((u=this.world)==null?void 0:u.entities)||[this.opponent]).filter(Ze=>Ze&&!Ze.destroyed&&!Ze.parent&&Ze.teamSide!==this.teamSide);Re==="enemynear"&&Se.sort((Ze,it)=>Math.abs(Ze.pos.x-this.pos.x)-Math.abs(it.pos.x-this.pos.x)),ie=Se[Math.trunc(i.args[0]||0)]}else if(Re==="root")ie=this.root||this;else if(Re==="parent")ie=this.parent;else if(Re==="partner")ie=(((h=this.world)==null?void 0:h.entities)||[]).filter(Se=>!Se.parent&&Se!==this.root&&Se.teamSide===this.teamSide)[Math.trunc(i.args[0]||0)];else if(Re==="helper")ie=this.ownedHelpers().find(Se=>!i.args.length||Se.helperId===+i.args[0]);else if(Re==="target")ie=this.targets.find(Se=>!i.args.length||(this.targetHitIds.get(Se.id)??Se.hitId)===+i.args[0]);else if(Re==="playerid")ie=((d=this.world)==null?void 0:d.findPlayer(+i.args[0]))||[this,this.opponent,...this.helpers].find(Se=>(Se==null?void 0:Se.id)===+i.args[0]);else throw new Error(`Unsupported redirection: ${Re}`);if(!ie||ie.destroyed){const Se=new Error(`Redirection ${Re} has no matching player`);throw Se.bottom=!0,Se}return ie.resolveTrigger(e,t,null,s)}if(["var","fvar","sysvar","sysfvar"].includes(e)){const ie=this.variableArray(e),Re=ct(t[0]);if(Re<0||Re>=ie.length)throw new Lt(`${e} index out of range: ${Re}`);return ie[Re]}if(e==="inguarddist")return+(this.world?this.inGuardDistance||!1:kc(this,this.opponent?[this.opponent]:[]));const r=this.opponent,a=(p=this.world)==null?void 0:p.roundFlow,o=this.root===((x=this.world)==null?void 0:x.player)?"player":"opponent",l=!!(a!=null&&a.roundWinner)&&a.roundWinner===o,c=!!(a!=null&&a.roundWinner)&&a.roundWinner!=="draw"&&!l,f={time:this.time,stateno:this.stateNo,prevstateno:this.prevStateNo,anim:this.anim,animelem:this.frameIndex+1,animtime:this.animTime,ctrl:this.ctrl,statetype:this.stateType,movetype:this.moveType,physics:this.physics,life:this.life,lifemax:this.maxLife,power:this.power,powermax:this.maxPower,facing:this.facing,alive:+this.alive,gametime:((m=this.world)==null?void 0:m.ticks)??this.gameTime,hitpausetime:this.hitPauseTime,hitshakeover:+(((v=this.world)!=null&&v.orderedPhases?this.getHitVars.hitshaketime||0:this.hitPauseTime)===0),hitover:+(this.hitTime<0),movecontact:this.moveContact,movehit:this.moveHit,moveguarded:this.moveGuarded,movereversed:this.moveReversed||0,hitcount:this.hitCount,uniqhitcount:this.uniqHitCount,numhelper:this.ownedHelpers().length,numexplod:this.explods.length,numtarget:this.targets.length,numenemy:r?1:0,numpartner:0,ishelper:+!!this.parent,roundstate:this.roundState??2,roundsexisted:this.roundsExisted??0,roundno:this.roundNo??1,matchno:this.matchNo??1,matchover:+!!((M=this.world)!=null&&M.matchOver),teamside:this.teamSide??this.id,teampower:this.power,tickspersecond:60,aiLevel:this.aiLevel||0,ailevel:this.aiLevel||0,palno:this.paletteNo||1,teammode:"single",ishometeam:+(this.teamSide===1),id:this.id,name:this.name,authorname:((E=(T=this.character.def)==null?void 0:T.info)==null?void 0:E.author)||"",numproj:(((w=this.world)==null?void 0:w.projectiles)||[]).filter(ie=>ie.owner===this&&!ie.removing&&!ie.removed).length,win:a?+l:+(this.roundState===4&&this.alive&&(r==null?void 0:r.life)<=0),lose:a?+c:+(this.roundState===4&&!this.alive),drawgame:a?+(a.roundWinner==="draw"):+(this.roundState===4&&!this.alive&&(r==null?void 0:r.life)<=0),winko:+(l&&a.reason!=="time"),wintime:+(l&&a.reason==="time"),winperfect:+(l&&this.life===this.maxLife),loseko:+(c&&a.reason!=="time"),losetime:+(c&&a.reason==="time"),loseperfect:+(c&&(r==null?void 0:r.life)===(r==null?void 0:r.maxLife)),camerazoom:this.cameraZoom??1,gamewidth:(((y=this.world)==null?void 0:y.view.width)??320)/s,gameheight:(((g=this.world)==null?void 0:g.view.height)??240)/s,screenwidth:320/s,screenheight:(((_=this.world)==null?void 0:_.view.displayHeight)??240)/s,leftedge:(((L=this.world)==null?void 0:L.view.left)??-160)/s,rightedge:(((R=this.world)==null?void 0:R.view.right)??160)/s,topedge:(((A=this.world)==null?void 0:A.view.top)??-240)/s,bottomedge:(((O=this.world)==null?void 0:O.view.bottom)??0)/s,frontedge:(this.facing===1?((N=this.world)==null?void 0:N.view.right)??160:((C=this.world)==null?void 0:C.view.left)??-160)/s,backedge:(this.facing===1?((k=this.world)==null?void 0:k.view.left)??-160:((B=this.world)==null?void 0:B.view.right)??160)/s,canrecover:+(!!this.getHitVars.fall&&this.getHitVars["fall.recover"]!==0&&(this.getHitVars["fall.time"]||0)>=(this.getHitVars["fall.recovertime"]??4)),hitfall:this.getHitVars.fall||0,"hitvel x":(this.getHitVars.xvel||0)*this.coordinateScale/s,"hitvel y":(this.getHitVars.yvel||0)*this.coordinateScale/s,"pos x":(this.pos.x-(((H=this.cameraPos)==null?void 0:H.x)||0))/s,"pos y":this.pos.y/s,"vel x":this.vel.x/s,"vel y":this.vel.y/s,"screenpos x":(this.pos.x-(((P=this.world)==null?void 0:P.view.left)??-160))/s,"screenpos y":(this.pos.y-(((I=this.world)==null?void 0:I.view.top)??-240))/s,"camerapos x":(((z=this.cameraPos)==null?void 0:z.x)||0)/s,"camerapos y":((($=this.cameraPos)==null?void 0:$.y)||0)/s};if(e==="command")return+this.commands.has(String(t[0]));if(e==="stagevar"){if(!((te=this.world)!=null&&te.stage))throw Error("StageVar requires an imported stage.");return this.world.stage.variable(t[0])}if(e==="ishelper"&&t.length)return+(!!this.parent&&this.helperId===+t[0]);if(e==="numprojid")return(((se=this.world)==null?void 0:se.projectiles)||[]).filter(ie=>ie.owner===this&&!ie.removing&&!ie.removed&&ie.projId===Math.max(0,Math.trunc(+t[0]))).length;if(/^proj(contact|hit|guarded|cancel)time$/.test(e)){const ie=e.slice(4,-4),Re=Math.max(0,+t[0]||0),Se=this.projectileHistory.at(-1);return Se&&(!Re||Se.projId===Re)&&(ie==="contact"?["hit","guarded"].includes(Se.type):Se.type===ie)?(((q=this.world)==null?void 0:q.ticks)??this.gameTime)-Se.tick:-1}if(/^(parentdist|rootdist) [xy]$/.test(e)){const ie=this.parent?e.startsWith("parent")?this.parent:this.root:null;if(!ie||ie.destroyed||e.startsWith("parent")&&!ie.alive){const Se=Error("No live parent or root");throw Se.bottom=!0,Se}const Re=e.at(-1);return(ie.pos[Re]-this.pos[Re])*(Re==="x"?this.facing:1)/s}if(e==="const")return this.constant(t[0],s);if(e==="const240p")return Jt(t[0])/this.coordinateScale;if(e==="const480p")return Jt(t[0])/(2*this.coordinateScale);if(e==="const720p")return Jt(t[0])/(4*this.coordinateScale);if(e==="random")return this._seed^=this._seed<<13,this._seed^=this._seed>>>17,this._seed^=this._seed<<5,(this._seed>>>0)%1e3;if(e==="animexist"||e==="selfanimexist")return+(e==="selfanimexist"?this:this.animationOwner).animations.has(ct(t[0]));if(e==="animelemtime"){const ie=ct(t[0])-1,Re=((ne=this.animation)==null?void 0:ne.frames)||[];if(ie<0||ie>=Re.length){const Ze=new Error(`Animation element out of range: ${ie+1}`);throw Ze.bottom=!0,Ze}const Se=Re.slice(0,ie).reduce((Ze,it)=>Ze+Math.max(1,it.ticks),0);return this.animationTime-Se}if(e==="animelemno"){let ie=this.animationCycleTime+Jt(t[0]||0),Re=((fe=this.animation)==null?void 0:fe.frames)||[];if(!Re.length){const He=new Error("Animation has no elements");throw He.bottom=!0,He}const Se=Re.map(He=>He.ticks<0?1/0:Math.max(1,He.ticks)),Ze=Se.reduce((He,Dt)=>He+Dt,0),it=((we=this.animation)==null?void 0:we.loopStart)??0,Wt=Se.slice(0,it).reduce((He,Dt)=>He+Dt,0);if(Number.isFinite(Ze)&&(this.animationLooped||this.frameIndex>=it||ie>=Ze)){const He=Ze-Wt;ie=Wt+((ie-Wt)%He+He)%He}else if(ie<0){const He=new Error("Animation offset precedes its start");throw He.bottom=!0,He}for(let He=0;He<Re.length;He++)if(ie-=Se[He],ie<0)return He+1}if(e==="gethitvar"){const ie=String(t[0]).toLowerCase();if(ie==="isbound")return+(!!this.bound&&!this.bound.target.destroyed);if(ie==="hittime")return this.hitTime;if(ie==="hitshaketime")return(de=this.world)!=null&&de.orderedPhases?this.getHitVars.hitshaketime||0:this.hitPauseTime;if(ie in this.getHitVars)return this.getHitVars[ie]*(Yc.has(ie)?this.coordinateScale/s:1);if(Ju.has(ie))return 0;throw new Error(`Unsupported GetHitVar field: ${ie}`)}if(e==="numexplod"&&t.length)return this.explods.filter(ie=>ie.id===+t[0]).length;if(e==="numhelper"&&t.length)return this.ownedHelpers().filter(ie=>+t[0]<=0||ie.helperId===+t[0]).length;if(e==="numtarget"&&t.length)return this.targets.filter(ie=>!ie.destroyed&&(+t[0]<0||(this.targetHitIds.get(ie.id)??ie.hitId)===+t[0])).length;if(e==="playeridexist")return+((Pe=this.world)!=null&&Pe.findPlayer(+t[0])||[this,r,...this.helpers].find(ie=>(ie==null?void 0:ie.id)===+t[0]&&!ie.destroyed)?1:0);if(["frontedgedist","backedgedist","frontedgebodydist","backedgebodydist"].includes(e)){const ie=e.startsWith("front"),Re=this.facing*(ie?1:-1),Se=Re>0?((je=this.world)==null?void 0:je.view.right)??this.options.rightBound??160:((Te=this.world)==null?void 0:Te.view.left)??this.options.leftBound??-160;let Ze=(Re>0?Se-this.pos.x:this.pos.x-Se)/s;return e.includes("body")&&(Ze-=fr(this,Re,{edge:!0})/s),Ze}if(e==="p1name")return this.name;if(["p2name","p3name","p4name"].includes(e)){const ie=(((qe=this.world)==null?void 0:qe.entities)||[this,r]).filter(Se=>Se&&!Se.destroyed&&!Se.parent),Re=e==="p2name"?r:e==="p3name"?ie.find(Se=>Se!==this.root&&Se.teamSide===this.teamSide):ie.filter(Se=>Se.teamSide!==this.teamSide)[1];return(Re==null?void 0:Re.name)??{absent:!0}}if(["p2life","p2stateno","p2statetype","p2movetype","p2bodydist x","p2dist x","p2bodydist y","p2dist y"].includes(e)&&!r)throw new Lt(`${e}: P2 does not exist.`);if(e==="p2life")return r.life;if(e==="p2stateno")return r.stateNo;if(e==="p2statetype")return r.stateType;if(e==="p2movetype")return r.moveType;if(e==="p2bodydist x"||e==="p2dist x"){if(!r)return 0;let ie=(r.pos.x-this.pos.x)*this.facing/s;if(e==="p2bodydist x"){const Re=ie>=0;ie-=fr(this,this.facing)/s+(Re?1:-1)*fr(r,Re?-this.facing:this.facing)/s}return ie}if(e==="p2bodydist y"||e==="p2dist y")return r?(r.pos.y-this.pos.y)/s:0;if(e==="hitdefattr")return this.moveType!=="A"||!((Ke=this.hitDef)!=null&&Ke.attr)?0:+Yr(t.map(String).join(","),this.hitDef.attr);if(Object.hasOwn(f,e))return f[e];throw new Qi(`Unsupported trigger: ${e}`)}parameter(e,t=this._executing,i=!1){try{return this.evaluate(e,t,i)}catch(s){if(!s.bottom)throw s;return this.diagnostic("parameter-bottom",`${e}: ${s.message} Parameter set to 0.`,t),i?{value:0,float:!1}:0}}value(e,t,i){var o;const s=e.values[t];if(s===void 0)return i;if(t==="ignorehitpause"||t==="persistent"){const l=dr(e);if(l.errors.some(c=>c.message.startsWith(t)))throw Error(l.errors.find(c=>c.message.startsWith(t)).message);return l[t]}let r=(o=this._parameterCache)==null?void 0:o.get(e);if(this._parameterCache&&!r&&this._parameterCache.set(e,r=new Map),r!=null&&r.has(t))return r.get(t);const a=this.parameter(s,e);return r==null||r.set(t,a),a}vector(e,t,i=[0,0]){var o;const s=e.values[t];if(s===void 0)return[...i];let r=(o=this._parameterCache)==null?void 0:o.get(e);if(this._parameterCache&&!r&&this._parameterCache.set(e,r=new Map),r!=null&&r.has(t))return[...r.get(t)];const a=gn(s).map(l=>Jt(this.parameter(l,e)));return r==null||r.set(t,a),a}text(e,t,i=""){return vn(e.values[t]??i)}changeAnimation(e,t=1,i=this){if(e=ct(e),e<0&&(this.diagnostic("animation-value","Negative animation number; using action 0."),e=0),!i.animations.has(e))return this.diagnostic("missing-animation",`Animation ${e} does not exist.`),!1;const s=i.animations.get(e).frames,r=ct(t)-1,a=r>=0&&r<s.length?r:0;return this.animationOwner=i,this.anim=e,this.frameIndex=a,this.frameTime=0,this.animationEnded=!1,this.animationTime=s.slice(0,a).reduce((o,l)=>o+Math.max(1,l.ticks),0),this.animationCycleTime=this.animationTime,this.animationLooped=!1,!0}changeState(e,t,i=this.stateOwner||this){var f,u,h,d;e=ct(e);const s=i.program.states.get(e);if(!s)return this.diagnostic("missing-state",`State ${e} does not exist.`),!1;if((f=this.world)!=null&&f.orderedPhases&&(this.world.contactPhase||this.world.activeActor!==this&&((u=this.world._entities)!=null&&u.includes(this))))return this._pendingStateEntry={number:e,ctrl:t,owner:i,oldState:((h=this._pendingStateEntry)==null?void 0:h.oldState)??this.stateNo,oldOwner:((d=this._pendingStateEntry)==null?void 0:d.oldOwner)??this.stateOwner},this.prevStateNo=this.stateNo,this.stateNo=e,this.stateOwner=i,this.time=0,!0;if(++this._changeCount>64)return this.diagnostic("state-loop","More than 64 state changes in one tick; execution stopped."),!1;const r=this.stateOwner.program.states.get(this.stateNo);this.stateOwner=i,$u(this,Bt(i)),this.prevStateNo=this.stateNo,this.stateNo=e,this.time=0,t!==void 0&&ct(t)>=0&&(this.ctrl=+Ht(ct(t))),this._entrySerial++,this._controllerCounts.clear();let a=!1,o=!1,l=!1;try{a=Ht(this.value(s,"hitdefpersist",0)),o=Ht(this.value(s,"movehitpersist",0)),l=Ht(this.value(s,"hitcountpersist",0))}catch{}a||(this.hitDef=null,this.reversalDef=null),o||(this.moveContact=0,this.moveHit=0,this.moveGuarded=0,this.moveReversed=0),l||(this.hitCount=0,this.uniqHitCount=0,this._lastHitCountTick=null);const c=this.moveType;this.moveType="I",this._executing=s;try{const p=this.text(s,"type","S").toUpperCase(),x=this.text(s,"physics","N").toUpperCase();if(p!=="U"&&(this.stateType=p),x!=="U"&&(this.physics=x),s.values.movetype){const m=this.text(s,"movetype").toUpperCase();this.moveType=m==="U"?c:m}if(s.values.ctrl!==void 0&&(this.ctrl=+Ht(this.value(s,"ctrl",this.ctrl))),s.values.anim!==void 0){const m=ct(this.value(s,"anim",-1));m!==-1&&this.changeAnimation(m)}if(s.values.velset!==void 0){const[m=0,v=0]=this.vector(s,"velset");this.vel={x:m*this.coordinateScale,y:v*this.coordinateScale}}s.values.sprpriority!==void 0&&(this.sprPriority=ct(this.value(s,"sprpriority",0))),s.values.juggle!==void 0&&(this.juggleCost=Math.max(0,ct(this.value(s,"juggle",0))),this._juggleSerial++),s.values.poweradd!==void 0&&(this.power=ni(this.power+this.value(s,"poweradd",0),0,this.maxPower)),Ht(this.value(s,"facep2",0))&&this.opponent&&(this.facing=this.opponent.pos.x>=this.pos.x?1:-1)}catch{}return this._executing=null,this.events.push({type:"state",state:e,previous:r==null?void 0:r.id}),!0}shouldRun(e,t){const i=dr(e);if(i.errors.length||t&&!i.ignorehitpause)return!1;const s=e.entries.filter(c=>c.key==="triggerall");for(const c of s)try{if(!Ht(this.evaluate(c.value,{...e,line:c.line})))return!1}catch{return!1}const r=i.groups;let a=!1;for(const[,c]of[...r].sort(([f],[u])=>f-u)){let f=!0;for(const u of c)try{if(!Ht(this.evaluate(u.value,{...e,line:u.line}))){f=!1;break}}catch{f=!1;break}if(f){a=!0;break}}if(!a)return!1;const o=i.persistent,l=this._controllerCounts.get(e)||0;return this._controllerCounts.set(e,l+1),o===0?l===0:l%o===0}runState(e,t,i=this.stateOwner){const s=i.program.states.get(e);if(!s)return;const r=this._entrySerial;for(const a of s.controllers){const o=this._scriptOwner;this._scriptOwner=i,this._executing=a;try{this.shouldRun(a,t)&&this.execute(a)}catch(l){this.diagnostics.some(c=>c.message.includes(l.message)&&c.source===a.source)||this.diagnostic("controller",l.message,a)}if(this._executing=null,this._scriptOwner=o,this.destroyed||this._entrySerial!==r)break}}movementHeld(e){var r;if(!((r=this.world)!=null&&r.manageInputs))return this.commands.has(e);const t=this.rawInput,i=this.facing<0?"L":"R",s=this.facing<0?"R":"L";return e==="holdup"?t.has("U")&&!t.has("D"):e==="holddown"?t.has("D")&&!t.has("U"):e==="holdfwd"?t.has(i)&&!t.has(s):e==="holdback"?t.has(s)&&!t.has(i):!1}automaticTransitions(){var r,a,o,l,c;if(!this.ctrl||this.moveType==="H"||!this.alive||this.stateOwner!==this||this.parent&&!this.keyCtrl||(r=this.world)!=null&&r.roundFlow&&this.world.roundFlow.roundState!==2)return;const e=this.movementHeld("holddown"),t=this.movementHeld("holdup"),i=this.movementHeld("holdfwd")||this.movementHeld("holdback"),s=this.movementHeld("holdback")&&!this.asserted.has("noautoguard")&&!!this.resolveTrigger("inguarddist");if(!((a=this.world)!=null&&a.orderedPhases&&s&&[120,130,131,132,140].includes(this.stateNo))){if(s&&![120,130,131,132,140].includes(this.stateNo)){const f=this.stateType==="A"?"noairguard":this.stateType==="C"?"nocrouchguard":"nostandguard",u=this.stateType==="A"?132:this.stateType==="C"?131:120;if(!this.asserted.has(f)&&this.program.states.has(u)){this.changeState(u);return}}if(!this.asserted.has("noautoturn")&&((l=(o=this.world)==null?void 0:o.stage)==null?void 0:l.definition.autoturn)!==!1&&this.stateType!=="A"&&this.opponent&&[0,10,11,12,20].includes(this.stateNo)){const f=this.opponent.pos.x>=this.pos.x?1:-1;f!==this.facing&&(this.facing=f)}if(this.stateType==="A"){t&&!this._previousUp&&this.airJumps<this.constant("movement.airjump.num")&&-this.pos.y>=this.constant("movement.airjump.height")&&this.program.states.has(45)&&(this.airJumps++,this.changeState(45));return}if(t&&!this.asserted.has("nojump")&&this.program.states.has(40)){this.changeState(40);return}if(e&&this.stateType==="S"&&!this.asserted.has("nocrouch")&&this.program.states.has(10)){this.changeState(10);return}if(!e&&this.stateType==="C"&&[10,11].includes(this.stateNo)&&this.program.states.has(12)){this.changeState(12);return}!this.asserted.has("nowalk")&&this.stateType==="S"&&this.moveType==="I"&&(i&&((c=this.world)!=null&&c.orderedPhases?this.stateNo!==20:this.stateNo===0)&&this.program.states.has(20)?this.changeState(20):!i&&this.stateNo===20&&this.changeState(0))}}tick({commands:e=new Set,opponent:t=null,paused:i=!1,input:s=null}={}){var f;const r=(f=this.world)==null?void 0:f.orderedPhases,a=r&&!!this._pendingStateEntry&&!i;if(r&&this._pendingStateEntry&&!i){const u=this._pendingStateEntry;this._pendingStateEntry=null,this.stateNo=u.oldState,this.stateOwner=u.oldOwner,this.changeState(u.number,u.ctrl,u.owner)}if(this.events=[],this.commands=e,this.opponent=t,Qu(this,s,e),i||this.destroyed)return this.world||this.updateExplods({forceFrozen:!0}),this.gameTime++,this.events;this._changeCount=0,this._executing=null;const o=this.hitPauseTime>0,l=r&&(this.getHitVars.hitshaketime||0)>0&&this.moveType==="H";r&&!a&&!o&&!l&&this.advanceAnimation(),this.asserted=new Set,this.posFrozen=!1,o||(this.playerPush=!this.parent,this.screenBound=!this.parent,this.moveCamera={x:!this.parent,y:!this.parent},this.width=null),this.drawOffset={x:0,y:0},this.drawScale={x:1,y:1},this.trans=null,this.angleDraw=!1,this.moveContact>0&&!o&&this.moveContact++,this.moveHit>0&&!o&&this.moveHit++,this.moveGuarded>0&&!o&&this.moveGuarded++,this.moveReversed>0&&!o&&this.moveReversed++;for(let u=0;u<2;u++){const h=this.hitFilters[u];(h==null?void 0:h.time)>0&&--h.time===0&&(this.hitFilters[u]=null)}for(const[u,h]of this.hitOverrides)h.time>0&&--h.time===0&&this.hitOverrides.delete(u);if(this.parent||(this.stateOwner===this&&this.runState(-3,o,this),this.runState(-2,o,this)),this.keyCtrl&&this.stateOwner===this&&!this._initializing&&this.runState(-1,o,this.parent?this.root:this),this.destroyed)return this.gameTime++,this.events;!o&&!this._initializing&&this.automaticTransitions(),!o&&this.stateNo===5110&&this.time>=1&&this.alive&&(this.getHitVars.recovertime??1)<=0&&this.stateOwner.program.states.has(5120)&&this.changeState(5120);let c;do c=this._entrySerial,this._initializing&&this.options.skipIntro&&[190,191].includes(this.stateNo)?(this.changeState(0),this.ctrl=1):this.runState(this.stateNo,o);while(c!==this._entrySerial&&this._changeCount<=64);if(this.destroyed)return this.gameTime++,this.events;if(o||(this._initializing=!1),this.collisionFrame=this.currentFrame,this.collisionAnimationOwner=this.animationOwner,o)return Sl(this,{hitPaused:!0}),this.world||this.updateExplods({hitPaused:!0}),this.hitPauseTime=Math.max(0,this.hitPauseTime-1),this.gameTime++,this.events;if(!this.posFrozen&&!this.bound&&!l&&(this.pos.x+=this.vel.x*this.facing+this.cornerPush,this.pos.y+=this.vel.y,r&&(this.pos.x=Math.fround(this.pos.x),this.pos.y=Math.fround(this.pos.y))),this.cornerPush*=ni(this.constant("movement.stand.friction"),0,1),Math.abs(this.cornerPush)<.01&&(this.cornerPush=0),!l&&this.physics==="A")this.vel.y+=(r?Math.fround(this.constant("movement.yaccel")):this.constant("movement.yaccel"))*this.coordinateScale,r&&(this.vel.y=Math.fround(this.vel.y)),this.pos.y>=0&&this.vel.y>0&&(this.pos.y=0,this.vel.y=0,this.airJumps=0,this.program.states.has(52)&&this.changeState(52));else if(!l&&(this.physics==="S"||this.physics==="C")&&(r||![20,100].includes(this.stateNo))){const u=this.physics==="C"?"crouch":"stand",h=this.constant("movement."+u+".friction");if(this.vel.x*=r?Math.fround(h):h,r&&(this.vel.x=Math.fround(this.vel.x)),r){const d=this.constant("movement."+u+".friction.threshold");this.stateNo!==20&&Math.abs(this.vel.x)<d*this.coordinateScale&&(this.vel.x=0)}}return this.updateBinding(),this.collisionFrame=this.currentFrame,this.collisionAnimationOwner=this.animationOwner,this.collisionAnimation=this.animation,this.collisionFrameIndex=this.frameIndex,this.collisionFrameTime=this.frameTime,r||this.advanceAnimation(),this.world||this.updateExplods(),l&&(this.getHitVars.hitshaketime=Math.max(0,this.getHitVars.hitshaketime-1)),Sl(this,{hitPaused:r&&(this.getHitVars.hitshaketime||0)>0}),this.time++,this.gameTime++,this._previousUp=this.movementHeld("holdup"),this.events}advanceAnimation(){var i;const e=this.animation,t=this.currentFrame;if(t){if(t.ticks<0){(i=this.world)!=null&&i.orderedPhases&&(this.frameTime++,this.animationTime++,this.animationCycleTime++);return}this.animationEnded&&(this.animationEnded=!1),this.frameTime++,this.animationTime++,this.animationCycleTime++,this.frameTime>=Math.max(1,t.ticks)&&(this.frameTime=0,this.frameIndex++,this.frameIndex>=e.frames.length&&(this.frameIndex=e.loopStart??e.loopstart??0,this.animationEnded=!0,this.animationLooped=!0,this.animationCycleTime=e.frames.slice(0,this.frameIndex).reduce((s,r)=>s+Math.max(1,r.ticks),0)))}}execute(e){const t=dr(e).errors.find(s=>!s.message.includes("trigger1"));if(t)throw Error(t.message);const i=this._parameterCache;this._parameterCache=new WeakMap;try{return this.executeController(e)}finally{this._parameterCache=i}}executeController(e){var o,l,c,f,u;const t=e.type,i=(h,d=0)=>Jt(this.value(e,h,d)),s=(h,d=0)=>ct(this.value(e,h,d)),r=(h,d=[0,0])=>this.vector(e,h,d),a=(h,d="")=>this.text(e,h,d);if(!Do.has(t)){this.diagnostic("unsupported-controller",`Controller ${t||"(missing type)"} is not implemented.`,e);return}if(t!=="null"){if(t==="assertinput"){if(!((o=this.world)!=null&&o.manageInputs)){this.diagnostic("unsupported-input-routing","AssertInput needs the independent input scheduler.");return}for(const h of e.entries)if(/^flag\d*$/.test(h.key))for(const d of this.text(e,h.key).split(/[+|\s,]+/).filter(Boolean)){const p={up:"U",down:"D",forward:"F",fwd:"F",back:"B",start:"s"},x=p[d.toLowerCase()]||d;if(!["U","D","F","B","a","b","c","x","y","z","s"].includes(x)){this.diagnostic("unsupported-input",`Input flag ${d} is not implemented.`,e);continue}this.pendingAssertedInputs.add(x)}return}if(["displaytoclipboard","appendtoclipboard","clearclipboard"].includes(t)){if(t==="clearclipboard"){this.clipboard="";return}const h=Uu(e.values.text||""),d=e.values.params===void 0?[]:gn(e.values.params);if(d.length!==h.count)throw Error(`Clipboard format requires ${h.count} parameters, received ${d.length}.`);const p=Ou(h,d.map(x=>this.parameter(x,e,!0)));this.clipboard=(t==="appendtoclipboard"&&this.clipboard?this.clipboard+`
`+p:p).slice(-8192);return}if(t==="victoryquote"){if(!this.parent){const h=s("value",-1);h!==this.victoryQuoteIndex&&(this.victoryQuote=null),this.victoryQuoteIndex=h}return}if(t==="forcefeedback"){this.events.push({type:t,...Bu(e.values)});return}if(t==="gamemakeanim"||t==="makedust"){if(t==="makedust"){const h=s("spacing",3);if(h<1)throw Error("MakeDust spacing must be at least 1.");const d=this._dustTicks.get(e);if((d==null?void 0:d.entry)===this._entrySerial&&this.gameTime-d.time<h)return;this._dustTicks.set(e,{entry:this._entrySerial,time:this.gameTime}),this.gameAnimation(120,r("pos"),!0,0,e),e.values.pos2!==void 0&&this.gameAnimation(120,r("pos2"),!0,0,e)}else this.gameAnimation(s("value",0),r("pos"),!!i("under"),Math.max(0,s("random")),e);return}if(t==="changestate"||t==="selfstate"){const h=s("value"),d=e.values.ctrl===void 0?void 0:s("ctrl"),p=e.values.anim===void 0?void 0:s("anim"),x=t==="selfstate"?this:this.stateOwner;x.program.states.has(h)&&p!==void 0&&p!==-1&&this.changeAnimation(p),this.changeState(h,d,x);return}if(t==="changeanim"||t==="changeanim2"){this.changeAnimation(s("value"),s("elem",1),t==="changeanim2"?this.stateOwner:this);return}if(t==="ctrlset"){this.ctrl=+Ht(i("value"));return}if(t==="statetypeset"){for(const[h,d]of[["statetype","stateType"],["movetype","moveType"],["physics","physics"]])if(e.values[h]!==void 0){const p=a(h).toUpperCase();p!=="U"&&(this[d]=p)}return}if(/^(vel|pos)(set|add|mul)$/.test(t)){const h=t.startsWith("vel")?this.vel:this.pos,d=t.slice(3);for(const p of["x","y"])if(e.values[p]!==void 0){const x=i(p)*(d==="mul"?1:this.coordinateScale);d==="set"?h[p]=x+(t==="posset"&&p==="x"&&((l=this.cameraPos)==null?void 0:l.x)||0):d==="add"?h[p]+=x*(t==="posadd"&&p==="x"?this.facing:1):h[p]*=x,(c=this.world)!=null&&c.orderedPhases&&(h[p]=Math.fround(h[p]))}return}if(t==="gravity"){this.vel.y+=this.constant("movement.yaccel")*this.coordinateScale;return}if(t==="turn"){this.facing*=-1;return}if(t==="posfreeze"){this.posFrozen=Ht(i("value",1));return}if(t==="helper"){if(!this.world)throw Error("Helper requires a match world.");this.world.spawnHelper(this,this.entityParameters(e));return}if(t==="projectile"){if(!this.world)throw Error("Projectile requires a match world.");const h=new Set(["velocity","remvelocity","accel","velmul","offset","postype","supermovetime","pausemovetime","ownpal","remappal"]),d=e.entries.filter(x=>!x.key.startsWith("proj")&&!x.key.startsWith("afterimage.")&&!h.has(x.key)),p=this.parseHitDef({...e,entries:d,values:Object.fromEntries(d.map(x=>[x.key,x.value]))});this.world.spawnProjectile(this,{...this.entityParameters(e,!0),hitDef:p});return}if(t==="pause"||t==="superpause"){if(!this.world)throw Error(`${t} requires a match world.`);const h=this.entityParameters(e);h.coordinateScale=this.coordinateScale,h.type=t,h.time??(h.time=t==="superpause"?30:0),h.animCommon=!/^s/i.test(e.values.anim||""),h.soundCommon=!/^s/i.test(e.values.sound||""),this.world.requestPause(this,h);return}if(t==="trans"){this.trans={mode:a("trans","default").toLowerCase(),alpha:r("alpha",[256,0])};return}if(t==="movehitreset"){this.moveContact=this.moveHit=this.moveGuarded=0;return}if(t==="attackdist"){this.attackDist=i("value"),this.hitDef&&(this.hitDef["guard.dist"]=this.attackDist*this.coordinateScale/(this.hitDef.coordinateScale??this.coordinateScale));return}if(t==="remappal"){const h=M=>{const T=r(M,[-1,0]);return[ct(T[0]),ct(T[1]??0)]},d=h("source"),p=h("dest"),x=d[0]===-1?"*":d.join(",");if(d[0]===-1&&p[0]===-1){this.paletteRemaps.clear();return}if(d[0]<-1||d[0]!==-1&&d[1]<0||p[0]<-1||p[0]!==-1&&p[1]<0)throw Error("Invalid RemapPal palette pair.");const m=p[0]===-1||d.join(",")===p.join(",");m||Oc(this.character,d,p);const v=m&&this.paletteRemaps.has("*")&&d[0]!==-1;if(d[0]!==-1&&(!m||v)&&!this.paletteRemaps.has(x)&&this.paletteRemaps.size>=8){this.diagnostic("resource-limit","RemapPal supports at most 8 simultaneous mappings.",e);return}d[0]===-1&&this.paletteRemaps.clear(),v?this.paletteRemaps.set(x,d):m?this.paletteRemaps.delete(x):this.paletteRemaps.set(x,p);return}if(t==="fallenvshake"){const h=this.getHitVars["fall.envshake.time"]||0;h>0&&this.events.push({type:"envshake",time:h,coordinateScale:this.coordinateScale,...Object.fromEntries(["ampl","freq","phase"].map(d=>[d,this.getHitVars["fall.envshake."+d]]))}),this.getHitVars["fall.envshake.time"]=0;return}if(["varset","varadd","varmul","parentvarset","parentvaradd"].includes(t)){const h=t.startsWith("parent")?this.parent:this;if(!h||h.destroyed)return;let d=e.entries.filter(p=>/^(var|fvar|sysvar|sysfvar)\s*\(/.test(p.key));if(!d.length){const p=e.values.fv!==void 0?"fvar":"var";d=[{key:`${p}(${s(p==="fvar"?"fv":"v")})`,value:e.values.value??"0"}]}for(const p of d){const x=p.key.match(/^(var|fvar|sysvar|sysfvar)\s*\((.*)\)$/);if(!x)throw new Error(`Malformed variable target: ${p.key}`);const m=ct(this.parameter(x[2],e));let v=Jt(this.parameter(p.value,e));v=x[1].includes("fvar")?Math.fround(v):ct(v)|0;const M=h.resolveTrigger(x[1],[m]);t.endsWith("add")&&(v+=M),t.endsWith("mul")&&(v*=M),h.assignVariable(x[1],[m],v)}return}if(t==="varrandom"){const h=s("v"),d=r("range",[0,1e3]),[p,x]=d.length===1?[0,ct(d[0])]:d.map(ct);if(p>x)throw Error("VarRandom range requires least_val <= greatest_val.");this.resolveTrigger("random"),this.assignVariable("var",[h],p+Math.floor((this._seed>>>0)/4294967296*(x-p+1)));return}if(t==="varrangeset"){const h=e.values.fvalue!==void 0,d=h?this.fvars:this.vars,p=ni(s("first"),0,d.length-1),x=ni(s("last",d.length-1),0,d.length-1),m=i(h?"fvalue":"value");for(let v=p;v<=x;v++)this.assignVariable(h?"fvar":"var",[v],m);return}if(t==="lifeadd"||t==="lifeset"){let h=s("value");t==="lifeadd"&&(h=-Ds(-h,null,this,{absolute:!!i("absolute")}),h+=this.life),this.life=ni(h,i("kill",1)?0:1,this.maxLife);return}if(t==="poweradd"||t==="powerset"){this.power=ni(s("value")+(t==="poweradd"?this.power:0),0,this.maxPower);return}if(t==="attackmulset"){this.attackMultiplier=i("value",1);return}if(t==="defencemulset"){this.defenceMultiplier=i("value",1);return}if(t==="sprpriority"){this.sprPriority=s("value");return}if(t==="screenbound"){this.screenBound=Ht(i("value",0));const[h,d]=r("movecamera");this.moveCamera={x:!!h,y:!!d};return}if(t==="playerpush"){this.playerPush=Ht(i("value",1));return}if(t==="width"){if(e.values.value!==void 0&&(e.values.player!==void 0||e.values.edge!==void 0))throw Error("Width value cannot be combined with player or edge.");const h=e.values.value===void 0?[0,0]:r("value"),[d=0,p=0]=r("player",h),x=r("edge",h);this.width={front:ct(d),back:ct(p),edge:[ct(x[0]??0),ct(x[1]??0)]};return}if(t==="assertspecial"){const h=new Set(["nowalk","nojump","nocrouch","noautoturn","invisible","noshadow","unguardable","noairguard","nostandguard","nocrouchguard","nojugglecheck","intro","roundnotover","timerfreeze","noko","nobardisplay","nobg","nofg"]);for(const d of["flag","flag2","flag3"])if(e.values[d]){const p=a(d).toLowerCase();this.asserted.add(p),h.has(p)||this.diagnostic("unsupported-flag",`AssertSpecial flag ${p} is not implemented.`,e)}return}if(t==="hitvelset"){i("x")&&(this.vel.x=(this.getHitVars.xvel||0)*this.coordinateScale),i("y")&&(this.vel.y=(this.getHitVars.yvel||0)*this.coordinateScale);return}if(t==="hitdef"){this.hitDef=null,this.reversalDef=null,this.hitDef=this.parseHitDef(e),this.events.push({type:"hitdef",hitDef:this.hitDef});return}if(t==="reversaldef"){if(this.reversalDef=null,e.values["reversal.attr"]===void 0)throw Error("ReversalDef requires reversal.attr.");if(!e.values["reversal.attr"].trim())return;xs(a("reversal.attr")),this.reversalDef=this.parseHitDef(e);return}if(t==="hitby"||t==="nothitby"){const h=["value","value2"].filter(x=>e.values[x]!==void 0);if(h.length!==1)throw Error(`${t} requires exactly one of value or value2.`);const d=s("time",1);if(d<-1||d>36e4)throw Error("Invalid hit-filter duration.");const p=xs(a(h[0]));this.hitFilters[h[0]==="value"?0:1]=d?{attribute:p,time:d,exclude:t==="nothitby"}:null;return}if(t==="hitoverride"){const h=s("slot"),d=s("time",1);if(h<0||h>7||d<-1||d>36e4)throw Error("HitOverride requires slot 0–7 and time -1 or greater.");if(!d||((f=e.values.attr)==null?void 0:f.trim())===""){this.hitOverrides.delete(h);return}if(e.values.attr===void 0||e.values.stateno===void 0)throw Error("HitOverride requires attr and stateno.");const p=a("attr"),x=xs(p);d?this.hitOverrides.set(h,{attr:p,attribute:x,stateNo:s("stateno"),time:d,forceAir:Ht(i("forceair"))}):this.hitOverrides.delete(h);return}if(rf.has(t)){if(t==="palfx"&&this.parent&&!this.ownPal)return;let h=this.effectParameters(e);if(["palfx","allpalfx","bgpalfx"].includes(t)&&(h=hr(h)),t==="playsnd"){const[d=0,p=0]=Array.isArray(h.value)?h.value:[h.value||0,0];Object.assign(h,{group:d,number:p,common:/^\s*f/i.test(e.values.value||""),volumeScale:h.volumescale,freqMul:h.freqmul})}this.events.push({type:t,...h,coordinateScale:this.coordinateScale,source:e.source,line:e.line});return}if(["explod","modifyexplod","removeexplod","explodbindtime"].includes(t)){this.explodController(e);return}if(t.startsWith("target")){const h=s("id",-1),d=this.targets.filter(E=>h===-1||(this.targetHitIds.get(E.id)??E.hitId)===h);if(t==="targetdrop"){const E=s("excludeid",-1),w=E<0?[]:this.targets.filter(g=>(this.targetHitIds.get(g.id)??g.hitId)===E);this.targets=i("keepone",1)?w.slice(0,1):w;const y=new Set(this.targets.map(g=>g.id));for(const g of this.targetHitIds.keys())y.has(g)||this.targetHitIds.delete(g);return}const p=["targetfacing","targetlifeadd","targetpoweradd","targetstate"].includes(t)?s("value"):void 0,x=t==="targetlifeadd"?i("kill",1):1,m=t==="targetlifeadd"?i("absolute"):0,v=t==="targetstate"&&e.values.ctrl!==void 0?i("ctrl"):void 0,M=t==="targetbind"?{pos:r("pos"),time:s("time",1)}:null,T=t==="targetvelset"||t==="targetveladd"?Object.fromEntries(["x","y"].filter(E=>e.values[E]!==void 0).map(E=>[E,i(E)*this.coordinateScale])):null;for(const E of d)if(t==="targetfacing")p&&(E.facing=this.facing*(p<0?-1:1));else if(t==="targetlifeadd"){const w=-Ds(-p,this,E,{absolute:!!m});E.life=ni(E.life+w,x?0:1,E.maxLife)}else if(t==="targetpoweradd")E.power=ni(E.power+p,0,E.maxPower);else if(t==="targetstate")E.changeState(p,v,this._scriptOwner||this.stateOwner);else if(M){const[w=0,y=0]=M.pos;E.bound={target:this,x:w*this.coordinateScale,y:y*this.coordinateScale,time:M.time}}else for(const[w,y]of Object.entries(T||{}))E.vel[w]=y+(t==="targetveladd"?E.vel[w]:0);return}if(["bindtoroot","bindtoparent","bindtotarget"].includes(t)){if(t!=="bindtotarget"&&!this.parent)return;const h=s("id",-1),d=t==="bindtoroot"?this.root:t==="bindtoparent"?this.parent:this.targets.find(v=>h<0||(this.targetHitIds.get(v.id)??v.hitId)===h);if(!d||d.destroyed){if(t==="bindtoparent"&&this.parent){this.bound=null;return}throw new Error(`${t} has no matching player`)}let p=[0,0],x,m;if(t==="bindtotarget"){const v=gn(e.values.pos||"0,0"),M=vn(v[2]||"foot").toLowerCase();if(v.length>3||!["foot","head","mid"].includes(M))throw Error("BindToTarget pos requires x, y, and Foot, Head or Mid.");[x,m]=v.slice(0,2).map(T=>Jt(this.evaluate(T,e))),x??(x=0),m??(m=0),M!=="foot"&&(p=["x","y"].map(T=>d.constant(`size.${M}.pos.${T}`)*d.coordinateScale))}else[x=0,m=0]=r("pos");this.bound={target:d,x:x*this.coordinateScale+p[0],y:m*this.coordinateScale+p[1],time:s("time",1),facing:i("facing")};return}if(t==="hitadd"){const h=s("value");this.hitCount=Math.max(0,this.hitCount+h),this.uniqHitCount=Math.max(0,this.uniqHitCount+h);const d=this.targets.at(-1)||(((u=this.opponent)==null?void 0:u.moveType)==="H"?this.opponent:null);d&&(d.comboHits=Math.max(0,(d.comboHits||0)+h));return}if(t==="hitcount"){this.hitCount=s("value");return}if(t==="hitfallset"){if(e.values.value!==void 0){const h=s("value",-1);h!==-1&&(h&&!this.getHitVars.fall&&(this.getHitVars["fall.time"]=0),this.getHitVars.fall=+!!h)}e.values.xvel!==void 0&&(this.getHitVars["fall.xvel"]=i("xvel"),this._fallXVelocityDefined=!0),e.values.yvel!==void 0&&(this.getHitVars["fall.yvel"]=i("yvel"));return}if(t==="hitfallvel"){if(this.moveType!=="H")return;this._fallXVelocityDefined&&(this.vel.x=(this.getHitVars["fall.xvel"]||0)*this.coordinateScale),this.vel.y=(this.getHitVars["fall.yvel"]||0)*this.coordinateScale;return}if(t==="hitfalldamage"){if(this.moveType==="H"){const h=Ds(this.getHitVars["fall.damage"]||0,null,this);this.life=ni(this.life-h,this.life>0&&this.getHitVars["fall.kill"]===0?1:0,this.maxLife),this.getHitVars["fall.damage"]=0}return}if(t==="angleadd"){this.angle+=i("value");return}if(t==="angleset"){this.angle=i("value");return}if(t==="anglemul"){this.angle*=i("value",1);return}if(t==="angledraw"){this.angleDraw=!0;const[h=1,d=1]=r("scale",[1,1]);this.drawScale={x:h,y:d},e.values.value&&(this.angle=i("value"));return}if(t==="offset"){this.drawOffset={x:i("x")*this.coordinateScale,y:i("y")*this.coordinateScale};return}if(t==="destroyself"){if(!this.parent){this.diagnostic("unsupported-controller","DestroySelf is valid only for helpers.",e);return}const h=!!i("recursive"),d=!!i("removeexplods");this.world?this.world.destroyHelper(this,{recursive:h,removeExplods:d}):(this.destroyed=!0,d&&(this.explods=this.drawExplods=[]));return}this.diagnostic("unsupported-controller",`Controller ${t} is not implemented.`,e)}}selectVictoryQuote(){if(this.parent||this.victoryQuote!==null)return this.victoryQuote;const e=this.program.quotes;if(!(e!=null&&e.size))return null;const t=[...e.keys()],i=e.has(this.victoryQuoteIndex)?this.victoryQuoteIndex:t[Math.floor(this.resolveTrigger("random")/1e3*t.length)];return this.victoryQuote=e.get(i)}gameAnimation(e,t,i,s,r){if(e<0)return;if(!this.commonAnimations.has(e)){this.diagnostic("missing-animation",`Common effect animation ${e} is unavailable. Import its fightfx resources.`,r);return}const a=()=>s?(this.resolveTrigger("random")/999-.5)*s:0;this.events.push({type:"gameanim",anim:e,under:i,common:!0,facing:this.facing,pos:{x:this.pos.x+((t[0]||0)*this.facing+a())*this.coordinateScale,y:this.pos.y+((t[1]||0)+a())*this.coordinateScale}})}effectParameters(e){const t={},i=new Set(["waveform","postype","trans","helpertype","name","space"]);for(const s of e.entries){if(/^(type|triggerall|trigger\d+|persistent|ignorehitpause)$/.test(s.key))continue;if(i.has(s.key)&&!/^-?[\d.]+$/.test(s.value)){t[s.key]=vn(s.value);continue}const a=gn(s.value).map(o=>{const l=o.trim().replace(/^[sSfF](?=[\d(-])/,"");return this.parameter(l,e)});t[s.key]=a.length===1?a[0]:a}return t}entityParameters(e,t=!1){const i=new Set(["velocity","remvelocity","accel","velmul","offset","postype","supermovetime","pausemovetime","ownpal","remappal"]),s=t?e.entries.filter(r=>r.key.startsWith("proj")||r.key.startsWith("afterimage.")||i.has(r.key)):e.entries;if(t){const r=new Set(["projid","projanim","projhitanim","projremanim","projcancelanim","projscale","projremove","projremovetime","projhits","projmisstime","projpriority","projsprpriority","projedgebound","projstagebound","projheightbound","projshadow"]);for(const a of s)a.key.startsWith("proj")&&!r.has(a.key)&&this.diagnostic("unsupported-projectile",`Projectile parameter ${a.key} is not implemented.`,{...e,line:a.line})}return{...this.effectParameters({...e,entries:s}),source:e.source,line:e.line}}createHelper(e,{id:t}={}){e.helpertype&&e.helpertype!=="normal"&&this.diagnostic("unsupported-helper","Player-type helpers are deprecated by MUGEN 1.1; using a normal helper.");const{pos:i,facing:s}=Vc(this,e),r={...this.program,constants:new Map(this.program.constants)};for(const[l,c]of Object.entries(e))if(l.startsWith("size.")){const f=xl(l)?this.coordinateScale/this.baseCoordinateScale:1,u=Array.isArray(c)?c.map(h=>h*f):c*f;r.constants.set(l,u),Array.isArray(u)&&(r.constants.set(l+".x",u[0]),r.constants.set(l+".y",u[1]))}const a=new br(this.character,{program:r,expressionEvaluator:this.options.expressionEvaluator,commonAnimations:this.commonAnimations,world:this.world,id:t,position:i,facing:s,parent:this,root:this.root,helperId:Math.trunc(e.id||0),keyCtrl:!!e.keyctrl,ownPal:!!e.ownpal,teamSide:this.teamSide,pauseMoveTime:e.pausemovetime||0,superMoveTime:e.supermovetime||0});a.name=e.name||`${this.name}'s helper`,a.opponent=this.opponent,e.ownpal&&(a._paletteRemaps=Io(this.paletteRemaps)),e.ownpal&&this.events.push({type:"palettesnapshot",target:a});const o=new Set(["id","name","stateno","postype","pos","facing","helpertype","keyctrl","ownpal","pausemovetime","supermovetime","remappal","source","line"]);for(const l of Object.keys(e))!o.has(l)&&!l.startsWith("size.")&&a.diagnostic("unsupported-helper",`Helper parameter ${l} is not implemented.`);if(e.ownpal&&e.remappal!==void 0)try{Lo(a.paletteRemaps,a.character,e.remappal)}catch(l){a.diagnostic("palette",l.message)}return a.changeState(e.stateno??0)?(this.helpers.push(a),a):(a.destroyed=!0,a)}parseHitDef(e){var l,c;const t=e.values,i={serial:++this._hitSerial,coordinateScale:this.coordinateScale,stateOwner:this._scriptOwner||this.stateOwner},s=new Set(["attr","reversal.attr","hitflag","guardflag","animtype","air.animtype","fall.animtype","ground.type","air.type","affectteam","priority"]);for(const f of e.entries)if(!/^(type|triggerall|trigger\d+|persistent|ignorehitpause)$/.test(f.key)){if(f.key==="priority"){const[u,h="Hit"]=gn(f.value);i.priority=[ct(this.parameter(u,e)),vn(h)];continue}if(s.has(f.key)){i[f.key]=vn(f.value);continue}try{const u=gn(f.value).map(h=>this.parameter(h.trim().replace(/^[sSfF](?=[\d(-])/,""),e));i[f.key]=u.length===1?u[0]:u}catch{throw new Error(`HitDef parameter ${f.key} could not be evaluated; attack disabled.`)}}const r=(f,u)=>Array.isArray(i[f])?i[f]:i[f]===void 0?[...u]:[i[f],u[1]??0];i.attr=i.attr??`${this.stateType}, NA`,i.id=ct(i.id??0),i.chainid=ct(i.chainid??-1);const a=i.nochainid===void 0?[-1,-1]:Array.isArray(i.nochainid)?i.nochainid:[i.nochainid,-1];if(a.length>2)throw Error("HitDef nochainID takes at most two IDs.");i.nochainid=a.map(ct),i.hitonce=i.hitonce===void 0?+/^[SCA]\s*,\s*[NSH]T$/i.test(i.attr):+Ht(Jt(i.hitonce)),i.damage=r("damage",[0,0]),i.pauseTime=r("pausetime",[0,0]),i.guardPauseTime=r("guard.pausetime",i.pauseTime),i.groundVelocity=r("ground.velocity",[0,0]),i.airVelocity=r("air.velocity",[0,0]),i.guardVelocity=r("guard.velocity",[i.groundVelocity[0],0]),i.airGuardVelocity=r("airguard.velocity",[i.airVelocity[0]*1.5,i.airVelocity[1]/2]),i.guardVelocity[1]=0,i["air.type"]??(i["air.type"]=i["ground.type"]??"high"),i.forcestand??(i.forcestand=+(i.groundVelocity[1]!==0)),i["down.velocity"]??(i["down.velocity"]=[...i.airVelocity]),i["down.hittime"]??(i["down.hittime"]=20),i["down.bounce"]??(i["down.bounce"]=0),i["ground.cornerpush.veloff"]??(i["ground.cornerpush.veloff"]=/^A\s*,/i.test(i.attr)?0:1.3*i.guardVelocity[0]);for(const f of["air","down","guard"])i[l=f+".cornerpush.veloff"]??(i[l]=i["ground.cornerpush.veloff"]);i["airguard.cornerpush.veloff"]??(i["airguard.cornerpush.veloff"]=i["guard.cornerpush.veloff"]),i.groundHitTime=i["ground.hittime"]??0,i.airHitTime=i["air.hittime"]??20,i.guardHitTime=i["guard.hittime"]??((c=this.world)!=null&&c.orderedPhases?i["ground.slidetime"]??0:i.groundHitTime),i["ground.slidetime"]??(i["ground.slidetime"]=0),i["guard.slidetime"]??(i["guard.slidetime"]=i.guardHitTime),i["guard.ctrltime"]??(i["guard.ctrltime"]=i["guard.slidetime"]),i["airguard.ctrltime"]??(i["airguard.ctrltime"]=i["guard.ctrltime"]),i.hitFlag=String(i.hitflag??"MAF").toUpperCase(),i.guardFlag=String(i.guardflag??"").toUpperCase(),i.fall=i.fall??0,i.kill=i.kill??1,i["guard.kill"]=i["guard.kill"]??1,i.source=e.source,i.line=e.line,i.juggleCost=this.juggleCost,i.juggleGroup=`${this.id}:${this._juggleSerial}`,i.sparkCommon=!/^s/i.test(t.sparkno||""),i.guardSparkCommon=!/^s/i.test(t["guard.sparkno"]||""),i.hitSoundCommon=!/^s/i.test(t.hitsound||""),i.guardSoundCommon=!/^s/i.test(t.guardsound||""),i.sparkno??(i.sparkno=this.constant("data.sparkno")),i["guard.sparkno"]??(i["guard.sparkno"]=this.constant("data.guard.sparkno"));const o=new Set(["attr","damage","pausetime","guard.pausetime","ground.velocity","air.velocity","guard.velocity","airguard.velocity","ground.hittime","air.hittime","guard.hittime","ground.slidetime","guard.slidetime","ground.ctrltime","guard.ctrltime","guardflag","hitflag","fall","forcenofall","kill","guard.kill","fall.kill","fall.damage","fall.xvelocity","fall.yvelocity","fall.recover","fall.recovertime","yaccel","animtype","air.animtype","ground.type","air.type","chainid","id","p1stateno","p2stateno","p2getp1state","p1facing","p1getp2facing","p2facing","p1sprpriority","p2sprpriority","numhits","getpower","givepower","priority","affectteam","guard.dist","down.velocity","down.hittime","air.fall","forcestand","air.juggle","fall.envshake.time","fall.envshake.ampl","fall.envshake.freq","fall.envshake.phase","sparkno","guard.sparkno","sparkxy","hitsound","guardsound","envshake.time","envshake.freq","envshake.ampl","envshake.phase","palfx.time","palfx.add","palfx.mul","palfx.sinadd","palfx.color","palfx.invertall"]);for(const f of["fall.animtype","mindist","maxdist","snap","ground.cornerpush.veloff","air.cornerpush.veloff","down.cornerpush.veloff","guard.cornerpush.veloff","airguard.cornerpush.veloff","airguard.ctrltime"])o.add(f);o.add("hitonce"),o.add("nochainid"),o.add("down.bounce");for(const f of e.entries)/^(type|triggerall|trigger\d+|persistent|ignorehitpause)$/.test(f.key)||o.has(f.key)||f.key==="reversal.attr"||this.diagnostic("unsupported-hitdef-parameter",`HitDef parameter ${f.key} is parsed but its engine behavior is not implemented.`,{...e,line:f.line});return i}receiveHit(e,t,{guarded:i=!1}={}){var $,te,se,q;if(!this.canBeHit(e,t))return{damage:0,guarded:!1,rejected:!0};const s=!i&&String(e[this.stateType==="A"?"air.type":"ground.type"]??e["ground.type"]??"high").toLowerCase()==="none",r=i?null:this.matchingHitOverride(e),a=e.p2getp1state===0?this:e.stateOwner||t;if(!s&&!i&&!r&&e.p2stateno>=0&&!(a!=null&&a.program.states.has(e.p2stateno)))return this.diagnostic("missing-state",`HitDef target state ${e.p2stateno} does not exist; hit rejected.`),{damage:0,guarded:!1,rejected:!0};Zu(this,e,t);const o=i?e.guardPauseTime:e.pauseTime,l=this.stateType,c=(t==null?void 0:t.facing)??-this.facing,f=this.facing;if(s)return _l(t,e,!1,{count:!1}),{damage:0,guarded:!1,typeNone:!0,cornerPush:0};this.explods=this.explods.filter(ne=>!ne.removeongethit),this.drawExplods=this.drawExplods.filter(ne=>!ne.removeongethit);const u=this.stateType==="A"||!!(r!=null&&r.forceAir),h=this.stateType==="L"&&!(r!=null&&r.forceAir),d=u&&!!this.getHitVars.fall,p=this.getHitVars,x=this.moveType==="H"&&!p.guarded,m=e[(i?u?"airguard":"guard":h?"down":u?"air":"ground")+".cornerpush.veloff"]||0;e.forcestand&&this.stateType==="C"&&(this.stateType="S");const v=Jt((($=e.damage)==null?void 0:$[i?1:0])||0),M=Math.max(0,Ds(v,t,this)),T=(te=this.world)==null?void 0:te.orderedPhases,E=(i?e["guard.kill"]:e.kill)===0?1:0,w=ni((this._projectedLife??this.life)-M,E,this.maxLife);T?this._projectedLife=w:this.life=w,t&&e.p2facing&&(this.facing=t.facing*(e.p2facing<0?-1:1)),t&&e.p1getp2facing?t.facing=this.facing*(e.p1getp2facing<0?-1:1):t&&e.p1facing===-1&&(t.facing*=-1);const y=i?u?e.airGuardVelocity:e.guardVelocity:h&&e["down.velocity"]!==void 0?Array.isArray(e["down.velocity"])?e["down.velocity"]:[e["down.velocity"],0]:u?e.airVelocity:e.groundVelocity,g=e.coordinateScale??(t==null?void 0:t.coordinateScale)??this.coordinateScale,_=g/this.coordinateScale;let L=((y==null?void 0:y[0])||0)*_*-c*this.facing,R=((y==null?void 0:y[1])||0)*_;const A=w<=0,O=A?nf(L,R,l,this.coordinateScale):{x:L,y:R};L=O.x,R=O.y;const N=i?e.guardHitTime:h&&R===0?e["down.hittime"]??20:u||R!==0?e.airHitTime??20:e.groundHitTime??0,C={light:0,medium:1,med:1,hard:2,back:3,up:4,diagup:5},k={high:1,low:2,trip:3,none:0};let B=k[String(e["ground.type"]||"high").toLowerCase()]??1;t&&(t.pos.x-this.pos.x)*f<0&&(B===1||B===2)&&(B=3-B);const H=e["air.animtype"]||e.animtype||"light",P=e["fall.animtype"]||(String(H).toLowerCase()==="up"?"up":"back"),I=A?1:i?0:+((!e.forcenofall||e.fall)&&!!p.fall||Ht(Jt(u?e["air.fall"]??e.fall??0:e.fall||0)));if(this.getHitVars={animtype:C[String(d?P:u?H:e.animtype||"light").toLowerCase()]??0,groundtype:B,airtype:k[String(e["air.type"]||"high").toLowerCase()]??1,type:u?k[String(e["air.type"]||e["ground.type"]||"high").toLowerCase()]??1:B,damage:M,hitcount:i?0:(x&&p.hitcount||0)+1,fallcount:x&&p.fallcount||0,hitshaketime:(o==null?void 0:o[1])||0,hittime:N,slidetime:e[i?"guard.slidetime":"ground.slidetime"]??(i?N:0),ctrltime:(i&&u?e["airguard.ctrltime"]:void 0)??e[i?"guard.ctrltime":"ground.ctrltime"]??N,xvel:L,yvel:R,yaccel:e.yaccel===void 0?.35/this.coordinateScale:e.yaccel*_,xoff:0,yoff:0,guarded:+i,fall:I,hitid:e.id??0,chainid:Math.max(0,e.id??0),isbound:0,xveladd:0,yveladd:0,zoff:0,recovertime:h?Math.min(p.recovertime??this.constant("data.liedown.time"),this.constant("data.liedown.time")):this.constant("data.liedown.time"),"fall.time":0,"fall.damage":e["fall.damage"]||0,"fall.xvel":e["fall.xvelocity"]===void 0?L:e["fall.xvelocity"]*_*-c*this.facing,"fall.yvel":h&&!e["down.bounce"]&&R!==0?0:e["fall.yvelocity"]===void 0?-4.5/this.coordinateScale:e["fall.yvelocity"]*_,"fall.recover":A||T&&i?0:e["fall.recover"]??1,"fall.recovertime":e["fall.recovertime"]??4,"fall.kill":e["fall.kill"]??1,"fall.envshake.time":e["fall.envshake.time"]||0,"fall.envshake.freq":e["fall.envshake.freq"]??60,"fall.envshake.ampl":e["fall.envshake.ampl"]===void 0?-4/this.coordinateScale:e["fall.envshake.ampl"]*_,"fall.envshake.phase":e["fall.envshake.phase"]??0},this.comboHits=i?0:(x&&this.comboHits||0)+Math.max(0,Math.trunc(e.numhits??1)),this._fallXVelocityDefined=e["fall.xvelocity"]!==void 0,this.hitTime=Math.max(0,N||0)+(T&&!i&&N>0?1:0),this.hitPauseTime=T?0:Math.max(0,(o==null?void 0:o[1])||0),this.ctrl=0,this.moveType="H",this.hitId=e.id??0,this.hitSourceId=Ua(t),this.vel={x:0,y:0},this.cornerPush=0,t&&!i){const ne=g;for(const[fe,we]of[["x",0],["y",1]]){const de=fe==="x"?t.facing:1;let Pe=(this.pos[fe]-t.pos[fe])*de/ne;for(const je of["mindist","maxdist","snap"])if(e[je]!==void 0){const Te=Array.isArray(e[je])?e[je][we]:we===0?e[je]:void 0;if(Te===void 0)continue;Pe=je==="mindist"?Math.max(Pe,Te):je==="maxdist"?Math.min(Pe,Te):Te}this.pos[fe]=t.pos[fe]+Pe*de*ne}}const z=r?r.stateNo:!i&&e.p2stateno>=0?e.p2stateno:i&&!A?u?154:this.stateType==="C"?152:150:h?5080:!u&&this.getHitVars.groundtype===3?5070:u?5020:this.stateType==="C"?5010:5e3;if(r!=null&&r.forceAir&&(this.stateType="A"),this.changeState(z,void 0,!i&&!r&&e.p2stateno>=0?a:this)||(this.moveType="H",this.vel={x:L*this.coordinateScale,y:R*this.coordinateScale},this.diagnostic("missing-hit-state",`Hit state ${z} is missing; full hit reaction cannot execute.`)),this.moveType="H",t){_l(t,e,i),t.hitPauseTime=Math.max(t.hitPauseTime,(o==null?void 0:o[0])||0),t.targets.includes(this)||t.targets.push(this),(se=t.targetHitIds)==null||se.set(this.id,e.id??0);const{get:ne,give:fe}=tf(e,(q=this.world)==null?void 0:q.combatRules);T?this.world.pendingCombatEffects.push({defender:this,attacker:t,damage:M,minimum:E,get:ne[i?1:0]||0,give:fe[i?1:0]||0}):(t.power=ni(t.power+(ne[i?1:0]||0),0,t.maxPower),this.power=ni(this.power+(fe[i?1:0]||0),0,this.maxPower))}return t&&(t.sprPriority=e.p1sprpriority??1,this.sprPriority=e.p2sprpriority??0,!i&&e.p1stateno>=0&&t.changeState(e.p1stateno,void 0,e.stateOwner||t.stateOwner)),this.events.push({type:"hit",damage:M,guarded:i,attacker:t==null?void 0:t.id}),{damage:M,guarded:i,cornerPush:m}}attributeMatches(e,t){return Yr(e,t)}matchingHitOverride(e){for(let t=0;t<8;t++){const i=this.hitOverrides.get(t);if(i!=null&&i.time&&Yr(i.attribute||i.attr,e.attr))return i}return null}canBeHit(e,t){var s;if(!Ku(this,e,t)||(s=this.world)!=null&&s.isSuperUnhittable(this))return!1;for(const r of this.hitFilters)if(r!=null&&r.time&&!qu(r,e.attr))return!1;return!(String(e[this.stateType==="A"?"air.type":"ground.type"]??e["ground.type"]??"high").toLowerCase()==="none")&&this.matchingHitOverride(e)&&(e.p1stateno>=0||e.p2getp1state===1||e.p2stateno>=0&&e.p2getp1state!==0)?!1:!this.asserted.has("unhittable")}explodController(e){return Gu(this,e)}updateExplods(e={}){return Wu(this,e)}updateBinding(){const e=this.bound;if(e){if(e.target.destroyed){this.bound=null;return}this.pos.x=e.target.pos.x+e.x*e.target.facing,this.pos.y=e.target.pos.y+e.y,e.facing&&(this.facing=e.target.facing*(e.facing<0?-1:1)),e.time>0&&--e.time===0&&(this.bound=null)}}}const An=(n,e=[0,0])=>Array.isArray(n)?[Number(n[0]??e[0]),Number(n[1]??e[1])]:n===void 0?[...e]:[Number(n),e[1]];class as{constructor(e,t,{id:i}={}){var o;this.creator=e,this.owner=e.root||e,this.root=this.owner,this.isProjectile=!0,this.world=e.world,this.id=i,this.projId=Math.max(0,Math.trunc(t.projid??0)),this.teamSide=e.teamSide,this.character=e.character,this.coordinateScale=e.coordinateScale,this.baseCoordinateScale=this.coordinateScale,this.paletteParent=cr(e),this.guardDistance=e.constant("size.proj.attack.dist")*e.coordinateScale,this.animations=e.animations,this.program={...e.program,constants:new Map(e.program.constants)},this.spec=t,this.events=[],this.diagnostics=[],this.asserted=new Set,Number(t.projid)<0&&this.diagnostic("projectile-id","Negative ProjID was clamped to 0."),Object.assign(this,Vc(e,t,!0));const s=An(t.projscale,[1,1]),r=e.constant("size.proj.doscale")!==0;this.program.constants.set("size.xscale",s[0]*(r?e.constant("size.xscale"):1)),this.program.constants.set("size.yscale",s[1]*(r?e.constant("size.yscale"):1)),this.program.constants.set("size.draw.offset.x",0),this.program.constants.set("size.draw.offset.y",0);const a=An(t.velocity);if(this.vel={x:a[0]*this.coordinateScale,y:a[1]*this.coordinateScale},this.accel=An(t.accel).map(l=>l*this.coordinateScale),this.velmul=An(t.velmul,[1,1]),this.anim=Math.trunc(t.projanim??0),this.frameIndex=0,this.frameTime=0,this.collisionFrame=null,this.hitDef=t.hitDef,this.proximityHitDef=t.hitDef,this.hitPauseTime=0,this.hitCount=0,this.moveType="A",this.stateType=(((o=this.hitDef)==null?void 0:o.attr)||"S")[0].toUpperCase(),this.priority=Math.max(1,Math.trunc(t.projpriority??1)),this.sprPriority=t.projsprpriority??3,this.remainingHits=Math.max(0,Math.trunc(t.projhits??1)),this.missTime=Math.max(0,Math.trunc(t.projmisstime??0)),this.pauseMoveTime=Math.max(0,t.pausemovetime||0),this.superMoveTime=Math.max(0,t.supermovetime||0),this.ownPal=!!t.ownpal,this.time=0,this.removing=!1,this.removed=!1,this.activeTicks=0,this.nextHitAge=0,this.drawVisible=!0,this._inTick=!1,this._paletteRemaps=Io(e.paletteRemaps),this.ownPal&&t.remappal!==void 0)try{Lo(this._paletteRemaps,this.character,t.remappal)}catch(l){this.diagnostic("palette",l.message)}this.attackMultiplier=e.attackMultiplier,this.animations.has(this.anim)||(this.diagnostic("missing-animation",`Projectile animation ${this.anim} does not exist.`),this.removed=!0)}get currentFrame(){var e;return((e=this.animations.get(this.anim))==null?void 0:e.frames[this.frameIndex])||null}get life(){return this.removed||this.removing?0:1}get power(){return this.owner.power}set power(e){this.owner.power=e}get maxPower(){return this.owner.maxPower}get targets(){return this.owner.targets}get targetHitIds(){return this.owner.targetHitIds}get paletteRemaps(){return this.ownPal?this._paletteRemaps:this.paletteParent.paletteRemaps}constant(e){const t=this.program.constants.get(e);return Array.isArray(t)?t[0]:t}changeState(){return this.diagnostic("unsupported-projectile","A projectile cannot enter a player state."),!1}diagnostic(e,t){this.diagnostics.some(i=>i.message===t)||this.diagnostics.push({type:e,message:t,source:this.spec.source,line:this.spec.line})}record(e){var i;const t=this.owner.projectileHistory;t.push({type:e,projId:this.projId,tick:((i=this.world)==null?void 0:i.ticks)??this.time});for(let s=t.length-2;s>=0;s--)t[s].type===e&&t[s].projId===this.projId&&t.splice(s,1);t.length>4096&&(t.shift(),this.diagnostic("resource-limit","Projectile history exceeded 4096 distinct ID/event pairs."))}canHit(){return!this.removed&&!this.removing&&!!this.hitDef&&this.activeTicks>=this.nextHitAge&&this.remainingHits>0}onContact({guarded:e=!1,defer:t=!1}={}){this.record(e?"guarded":"hit"),this._contactPending=!0,this.hitPauseTime>0&&(this._holdCollisionFrame=!0),t||this.finishContacts()}finishContacts(){var e;this._contactPending&&(this._contactPending=!1,this.remainingHits--,this.nextHitAge=this.activeTicks+((e=this.world)!=null&&e.orderedPhases?Math.max(1,this.missTime):this.missTime+1),this.spec.projremove!==0&&this.remainingHits<=0&&this.remove("hit"))}cancel(){!this.removing&&!this.removed&&(this.record("cancel"),this.hitPauseTime=0,this.remove("cancel"))}clash(e){var t,i;this.priority>e.priority?this.priority--:this.remainingHits--,this.remainingHits<=0?this.cancel():this.hitPauseTime=Math.max(this.hitPauseTime,((i=(t=this.hitDef)==null?void 0:t.pauseTime)==null?void 0:i[0])||0)}remove(e="expire"){if(!(this.removing||this.removed)){if(this.removing=!0,this.hitDef=null,this.removalReason=e,this._removeAtLoopEnd=this._loopedThisTick,this.hitPauseTime>0){this._holdCollisionFrame=!0;return}this.beginRemoval()}}beginRemoval(){var l;this.removalStarted=!0;const e=this.removalReason,t=this.spec.projhitanim??-1,i=this.spec.projremanim??t,s=e==="hit"?t:e==="cancel"?this.spec.projcancelanim??i:i,r=An(this.spec.remvelocity);if(this.vel={x:r[0]*this.coordinateScale,y:r[1]*this.coordinateScale},s<0){this.removed=!0,this.drawVisible=!1;return}let a=!1;if(this.animations.has(s)?Math.trunc(s)!==this.anim&&(a=!0,this._loopedThisTick=!1,this.anim=Math.trunc(s),this.frameIndex=this.frameTime=0):this.diagnostic("missing-animation",`Projectile removal animation ${s} does not exist; retaining action ${this.anim}.`),(a||!this.collisionFrame)&&(this.collisionFrame=this.currentFrame,this.collisionAnimation=this.animations.get(this.anim),this.collisionFrameIndex=this.frameIndex,this.collisionFrameTime=this.frameTime),!a&&this._removeAtLoopEnd&&this._inTick){this.removed=!0,this.drawVisible=!1;return}const o=((l=this.animations.get(this.anim))==null?void 0:l.frames)||[];if(o.some(c=>c.ticks<0)||o.reduce((c,f)=>c+f.ticks,0)<=0){this.removed=!0,this.drawVisible=!1;return}this.drawVisible=!!this.collisionFrame,a&&!this._inTick?this.advanceFrame():!a&&!this._inTick&&this._loopedThisTick&&(this.removed=!0)}advanceFrame(){const e=this.currentFrame,t=this.animations.get(this.anim);e&&e.ticks>=0&&++this.frameTime>=Math.max(1,e.ticks)&&(this.frameTime=0,this.frameIndex++,this.frameIndex>=t.frames.length&&(this._loopedThisTick=!0,this.animationLooped=!0,this.removing&&(this.removed=!0),this.frameIndex=t.loopStart||0))}tick({paused:e=!1}={}){var t,i,s,r;if(this.events=[],this._activeThisTick=!1,this.removed){this.drawVisible=!1;return}if(!e){if(this.drawVisible=!0,this._holdCollisionFrame||this.captureFrame(),this.hitPauseTime>0){this.hitPauseTime--;return}if(this._holdCollisionFrame=!1,this._inTick=!0,this._loopedThisTick=!1,this.removing&&!this.removalStarted&&this.beginRemoval(),!this.removing){const a=An(this.spec.projheightbound,[-240/this.coordinateScale,1/this.coordinateScale]).map(x=>x*this.coordinateScale),o=(this.spec.projedgebound??40/this.coordinateScale)*this.coordinateScale,l=(this.spec.projstagebound??40/this.coordinateScale)*this.coordinateScale,c=((t=this.world)==null?void 0:t.leftBound)??-160,f=((i=this.world)==null?void 0:i.rightBound)??160,u=((s=this.world)==null?void 0:s.view.left)??c,h=((r=this.world)==null?void 0:r.view.right)??f,d=this.spec.projremovetime??-1,p=this.vel.x*this.facing;(d>=0&&this.time>=d||d<=-2&&this.animationLooped||this.pos.x<u-o||this.pos.x>h+o||p<0&&this.pos.x<c-l||p>0&&this.pos.x>f+l||this.vel.y<0&&this.pos.y<a[0]||this.vel.y>0&&this.pos.y>a[1])&&this.remove()}this.removed||(this.captureFrame(),this._activeThisTick=!0,this.activeTicks++,this.pos.x+=this.vel.x*this.facing,this.pos.y+=this.vel.y,this.removing||(this.vel.x=(this.vel.x+this.accel[0])*this.velmul[0],this.vel.y=(this.vel.y+this.accel[1])*this.velmul[1]),this.advanceFrame(),this.time++),this._inTick=!1}}finishMovementAllowance({paused:e=!1}={}){var t,i,s;if(!(e||!this._activeThisTick||this._hitPausedThisTick||this.hitPauseTime>0)){if((t=this.world)!=null&&t.orderedPhases){((i=this.world.pause)==null?void 0:i.remaining)>0&&(this.pauseMoveTime=Math.max(0,this.pauseMoveTime-1)),((s=this.world.superPause)==null?void 0:s.remaining)>0&&(this.superMoveTime=Math.max(0,this.superMoveTime-1));return}this.pauseMoveTime=Math.max(0,this.pauseMoveTime-1),this.superMoveTime=Math.max(0,this.superMoveTime-1)}}captureFrame(){this.collisionFrame=this.currentFrame,this.collisionAnimation=this.animations.get(this.anim),this.collisionFrameIndex=this.frameIndex,this.collisionFrameTime=this.frameTime}}const gi=(n,e,t)=>Math.max(e,Math.min(t,n)),qn=(n,e=0)=>n===void 0||n===""?e:Number(n),vt=(n,e=[0,0])=>n===void 0?[...e]:String(n).split(",").map((t,i)=>qn(t.trim(),e[i]??0)),pr=n=>String(n??"").replace(/^"(.*)"$/,"$1"),af=new Set(["normal","anim","parallax","dummy"]),of=new Set(["null","anim","visible","enable","posset","posadd","velset","veladd","sinx","siny"]);function lf(n){var t,i;const e=[];for(const s of Object.keys(n).filter(r=>r.endsWith(".def"))){const r=wn(n[s]),a=Or(r);if(a.bgdef)try{e.push(cf(s,n,r,a))}catch(o){e.push({path:s,name:((t=a.info)==null?void 0:t.displayname)||((i=a.info)==null?void 0:i.name)||s,files:n,invalid:!0,diagnostics:[{source:s,line:0,type:"stage",message:o.message}]})}}return e}function cf(n,e,t=wn(e[n]),i=Or(t)){var _,L,R,A,O;const s=[],r=(N,C,k="stage")=>s.push({source:n,line:(C==null?void 0:C.line)||0,type:k,message:N}),a=n.slice(0,n.lastIndexOf("/")+1),o=n.indexOf("/stages/"),l=o>=0?n.slice(0,o+1):"",c=N=>{const C=[...new Set([a,l,""])],k=String(N).replaceAll("\\","/").split("/").at(-1),H=C.map(P=>{try{return Jn(N,P,!0)}catch{return null}}).find(P=>P&&e[P]);if(H)return H;if(k&&k!=="."&&k!=="..")try{const P=Jn(k,a);if(e[P])return P}catch{}return null},f=vt((_=i.stageinfo)==null?void 0:_.localcoord,[320,240]);if(f.length!==2||f.some(N=>!Number.isFinite(N)||N<=0))throw Error("Invalid stage localcoord.");const u=320/f[0],h=i.camera||{},d=i.playerinfo||{},p=i.bound||{},x=i.stageinfo||{},m=(N,C,k)=>{const B=qn(N[C],k);if(!Number.isFinite(B))throw Error(`Invalid stage numeric value ${C}.`);return B},v={startX:m(h,"startx",0)*u,startY:m(h,"starty",0)*u,left:m(h,"boundleft",0)*u,right:m(h,"boundright",0)*u,high:m(h,"boundhigh",-25)*u,low:m(h,"boundlow",0)*u,tension:Math.max(0,m(h,"tension",60)*u),floorTension:m(h,"floortension",0)*u,verticalFollow:gi(m(h,"verticalfollow",.2),0,1),zoomIn:m(h,"zoomin",1),zoomOut:m(h,"zoomout",1),startZoom:m(h,"startzoom",1)};if(v.left>v.right||v.high>v.low||v.zoomOut<=0||v.zoomIn<v.zoomOut)throw Error("Invalid stage camera bounds or zoom limits.");const M=i.bgdef.spr?c(i.bgdef.spr):null;M||r(`Stage sprite file is missing: ${i.bgdef.spr||"(unspecified)"}`);const T=i.music||{},E=T.bgmvolume!==void 0?m(T,"bgmvolume",100):100*(1+gi(m(T,"bgvolume",0),-255,255)/256),w={path:n,name:((L=i.info)==null?void 0:L.displayname)||((R=i.info)==null?void 0:R.name)||n,files:e,def:i,localcoord:f,coordinateScale:u,camera:v,sprite:M?{path:M}:null,animations:Uc(t),elements:[],controllers:[],diagnostics:s,leftBound:m(d,"leftbound",-1e3)*u,rightBound:m(d,"rightbound",1e3)*u,starts:[1,2].map(N=>({x:m(d,`p${N}startx`,N===1?-70:70)*u,y:m(d,`p${N}starty`,0)*u,facing:m(d,`p${N}facing`,N===1?1:-1)<0?-1:1})),screenLeft:Math.max(0,m(p,"screenleft",15)*u),screenRight:Math.max(0,m(p,"screenright",15)*u),zoffset:m(x,"zoffset",200)*u,resetBG:m(x,"resetbg",1)!==0,autoturn:m(x,"autoturn",1)!==0,xscale:m(x,"xscale",1),yscale:m(x,"yscale",1),backgroundScale:m(x,"hires",0)!==0?.5:1,zoffsetlink:x.zoffsetlink===void 0?null:m(x,"zoffsetlink",0),cropHigh:Math.max(0,m(h,"cuthigh",0)*u),cropLow:Math.max(0,m(h,"cutlow",0)*u),music:{path:T.bgmusic?c(T.bgmusic):null,requested:T.bgmusic||"",volume:E,loop:m(T,"bgmloop",1)!==0,loopStart:m(T,"bgmloopstart",0),loopEnd:m(T,"bgmloopend",0)}};if(w.shadow={intensity:gi(m(i.shadow||{},"intensity",128),0,256),color:vt((A=i.shadow)==null?void 0:A.color,[0,0,0]),yscale:m(i.shadow||{},"yscale",.4),fade:(O=i.shadow)!=null&&O["fade.range"]?vt(i.shadow["fade.range"]):null},w.reflection=gi(m(i.reflection||{},"intensity",0),0,256),w.leftBound>=w.rightBound)throw Error("Invalid stage player bounds.");w.music.requested&&!w.music.path&&r(`Stage music is missing: ${w.music.requested}`);let y={ids:null,loop:-1};const g=new Set(["type","spriteno","actionno","id","layerno","start","delta","trans","alpha","mask","velocity","tile","tilespacing","positionlink","sin.x","sin.y","window","maskwindow","windowdelta","xscale","width","yscalestart","yscaledelta","scalestart","scaledelta","zoomdelta"]);for(const N of jc(t,n)){const C=N.values;if(/^bgctrldef(?:\s|$)/.test(N.name))y={ids:C.ctrlid===void 0?null:vt(C.ctrlid,[]),loop:m(C,"looptime",-1)};else if(/^bgctrl(?:\s|$)/.test(N.name)){const k=pr(C.type).toLowerCase();if(!of.has(k)){r(`Background controller ${k} is not implemented.`,N,"unsupported-stage-controller");continue}const B=vt(C.time,[0]);for(const[H,P]of Object.entries(C))if(H!=="type"&&vt(P,[]).some(I=>!Number.isFinite(I)))throw Error(`Invalid background controller ${H} at line ${N.line}.`);w.controllers.push({type:k,time:[B[0],B[1]??B[0],B[2]??-1],groupLoop:y.loop,ids:C.ctrlid===void 0?y.ids:vt(C.ctrlid,[]),values:C,line:N.line})}else if(/^bg(?:\s|$)/.test(N.name)){const k=pr(C.type||"normal").toLowerCase();if(!af.has(k)){r(`Background type ${k} is not implemented.`,N,"unsupported-stage");continue}const B=k==="anim"||k==="parallax"&&C.actionno!==void 0,H=pr(C.trans||"default").toLowerCase(),P={type:k,animated:B,id:m(C,"id",0),layer:m(C,"layerno",0),start:vt(C.start),delta:vt(C.delta,[1,1]),velocity:vt(C.velocity),spriteno:vt(C.spriteno),anim:m(C,"actionno",0),mask:B||m(C,"mask",["add","sub"].includes(H)?1:0)!==0,trans:H,alpha:vt(C.alpha,H==="addalpha"?[256,0]:[256,256]),tile:vt(C.tile),spacing:vt(C.tilespacing),link:m(C,"positionlink",0)!==0,sinX:vt(C["sin.x"],[0,0,0]),sinY:vt(C["sin.y"],[0,0,0]),xscale:vt(C.xscale,[1,1]),width:C.width===void 0?null:vt(C.width),yScaleStart:m(C,"yscalestart",100)/100,yScaleDelta:m(C,"yscaledelta",0)/100,scaleStart:vt(C.scalestart,[1,1]),scaleDelta:vt(C.scaledelta),zoomDelta:m(C,"zoomdelta",1),window:C.maskwindow?vt(C.maskwindow,[]):C.window?vt(C.window,[]):null,windowCentered:!!C.maskwindow,windowDelta:vt(C.windowdelta),transSpecified:C.trans!==void 0,line:N.line};for(const[I,z]of Object.entries(P))if(Array.isArray(z)&&z.some($=>!Number.isFinite($)))throw Error(`Invalid background ${I} at line ${N.line}.`);for(const I of["start","delta","velocity","spriteno","alpha","tile","spacing","xscale","scaleStart","scaleDelta","windowDelta"])if(P[I].length!==2)throw Error(`Invalid background ${I} at line ${N.line}.`);if(P.width&&P.width.length!==2||P.window&&P.window.length!==4)throw Error(`Invalid background dimensions at line ${N.line}.`);if(B&&!w.animations.some(I=>I.id===P.anim)&&r(`Stage action ${P.anim} is missing.`,N),B&&P.tile.some((I,z)=>I&&P.spacing[z]<=0)&&k!=="parallax"&&r("Animated background tiling requires positive tilespacing.",N),k==="parallax"&&C.xscale!==void 0&&(B||P.width))throw Error(`Parallax xscale cannot be combined with width or animation at line ${N.line}.`);for(const I of Object.keys(C))g.has(I)||r(`Background parameter ${I} is not implemented.`,N,"unsupported-stage-parameter");w.elements.push(P)}}if(w.elements.length>2048||w.controllers.length>4096)throw Error("Stage background/controller limit exceeded.");return w}function Ml(n,e){return n[1]>0?n[0]*Math.sin(2*Math.PI*e/n[1]+(n[2]||0)*Math.PI/180):0}class hf{constructor(e){if(e.invalid)throw Error(e.diagnostics[0].message);this.definition=e,this.animations=new Map(e.animations.map(t=>[t.id,t])),this.diagnostics=[...e.diagnostics],this.reset()}reset({backgrounds:e=!0}={}){const t=this.definition;this.camera={x:gi(t.camera.startX,t.camera.left,t.camera.right),y:gi(t.camera.startY,t.camera.high,t.camera.low),zoom:gi(t.camera.startZoom,t.camera.zoomOut,t.camera.zoomIn)},(e||!this.elements)&&(this.time=0,this.elements=t.elements.map(i=>({...i,start:[...i.start],motion:[0,0],velocity:[...i.velocity],sinX:[...i.sinX],sinY:[...i.sinY],sinStartX:0,sinStartY:0,anim:i.anim,frameIndex:0,frameTime:0,visible:!0,enabled:!0})))}updateCamera(e){e=e.filter(a=>!a.destroyed&&!a.isProjectile);const t=this.definition,i=t.camera,s=e.filter(a=>{var o;return((o=a.moveCamera)==null?void 0:o.x)!==!1}),r=e.filter(a=>{var o;return((o=a.moveCamera)==null?void 0:o.y)!==!1});if(s.length){const a=Math.min(...s.map(u=>u.pos.x)),o=Math.max(...s.map(u=>u.pos.x));this.camera.zoom=gi(320/Math.max(1,o-a+2*i.tension),i.zoomOut,i.zoomIn);const l=Math.max(1,160/this.camera.zoom-i.tension),c=o-l,f=a+l;this.camera.x=gi(c<=f?gi(this.camera.x,c,f):(a+o)/2,i.left,i.right)}r.length&&(this.camera.y=gi(Math.min(0,Math.min(...r.map(a=>a.pos.y))+i.floorTension)*i.verticalFollow,i.high,i.low))}view(e=16/9){const t=this.definition,i=t.cropHigh+t.cropLow?320/e:t.localcoord[1]*t.coordinateScale,s=Math.max(0,t.localcoord[1]*t.coordinateScale-i),r=t.cropHigh+t.cropLow?t.cropHigh/(t.cropHigh+t.cropLow):.5;let a=t.zoffset;if(t.zoffsetlink!==null){const f=this.elements.findIndex(u=>u.id===t.zoffsetlink);f>=0&&(a=this.position(f).y*t.coordinateScale)}const o=a-s*r,l=320/this.camera.zoom,c=i/this.camera.zoom;return{left:this.camera.x-l/2,right:this.camera.x+l/2,top:this.camera.y-o/this.camera.zoom,bottom:this.camera.y+(i-o)/this.camera.zoom,width:l,height:c,displayHeight:i,groundY:o,zoffset:a,cropTop:s*r,zoom:this.camera.zoom}}position(e){let t=0,i=0,s=[1,1],r=0;for(let a=e;a>=0&&r++<2048;a--){const o=this.elements[a];if(t+=o.start[0]+o.motion[0]+Ml(o.sinX,this.time-o.sinStartX),i+=o.start[1]+o.motion[1]+Ml(o.sinY,this.time-o.sinStartY),s=o.delta,!o.link)break}return{x:t,y:i,delta:s}}tick({paused:e=!1}={}){if(!e){for(const t of this.definition.controllers){let i=t.groupLoop>0?this.time%t.groupLoop:this.time;if(t.time[2]>0&&(i%=t.time[2]),!(i<t.time[0]||i>t.time[1]))for(const s of this.elements){if(t.ids&&!t.ids.includes(s.id)&&!t.ids.includes(-1))continue;const r=t.values;if(t.type==="visible")s.visible=qn(r.value,1)!==0;else if(t.type==="enable")s.enabled=qn(r.value,1)!==0;else if(t.type==="anim")s.anim=qn(r.value,0),s.frameIndex=s.frameTime=0;else if(t.type==="sinx"||t.type==="siny"){const a=t.type==="sinx"?"sinX":"sinY";s[a]=vt(r.value,[0,0,0]),s[a==="sinX"?"sinStartX":"sinStartY"]=this.time}else if(/^(pos|vel)(set|add)$/.test(t.type)){for(const[a,o]of[["x",0],["y",1]])if(r[a]!==void 0){const l=qn(r[a]),c=t.type.startsWith("pos")?s.motion:s.velocity;t.type.endsWith("set")?c[o]=l-(c===s.motion?s.start[o]:0):c[o]+=l}}}}for(const t of this.elements)if(t.enabled){for(let r=0;r<2;r++)t.motion[r]+=t.velocity[r];t.drawFrameIndex=t.frameIndex,t.drawFrameTime=t.frameTime;const i=this.animations.get(t.anim),s=i==null?void 0:i.frames[t.frameIndex];t.animated&&s&&s.ticks>=0&&++t.frameTime>=Math.max(1,s.ticks)&&(t.frameTime=0,++t.frameIndex>=i.frames.length&&(t.frameIndex=i.loopStart||0))}this.time++}}frame(e){var t;return e.animated?(t=this.animations.get(e.anim))==null?void 0:t.frames[e.drawFrameIndex??e.frameIndex]:{group:e.spriteno[0],number:e.spriteno[1],x:0,y:0,flip:"",ticks:-1}}variable(e){var a;const[t,...i]=String(e).toLowerCase().split("."),s=(a=this.definition.def[t])==null?void 0:a[i.join(".")];if(s===void 0)throw Error(`StageVar ${e} is not implemented or missing.`);const r=Number(s);return Number.isFinite(r)?r:pr(s)}}const uf=n=>{if(n[0].life<=0&&n[1].life<=0)return"draw";if(n[0].life<=0)return"opponent";if(n[1].life<=0)return"player";const e=n[0].life*n[1].maxLife-n[1].life*n[0].maxLife;return e===0?"draw":e>0?"player":"opponent"};class ff{constructor({roundsToWin:e=2,roundTime:t=99,preIntro:i=30,introHold:s=30,overTime:r=60,resultTime:a=90,autoAdvance:o=!0}={}){for(const[l,c]of Object.entries({roundsToWin:e,roundTime:t,preIntro:i,introHold:s,overTime:r,resultTime:a}))if(!Number.isFinite(c)||c<0)throw Error(`Invalid match rule ${l}.`);if(e<1||e>99||t>3600)throw Error("Match rule exceeds supported bounds.");this.rules={roundsToWin:Math.trunc(e),roundTime:t,preIntro:Math.trunc(i),introHold:Math.trunc(s),overTime:Math.trunc(r),resultTime:Math.trunc(a),autoAdvance:o},this.roundNo=1,this.roundsExisted=0,this.wins={player:0,opponent:0},this.matchOver=!1,this.roundWinner=null,this.reason=null,this.startRound()}startRound(){this.roundState=0,this.phaseTime=0,this.timeLeft=this.rules.roundTime?Math.round(this.rules.roundTime*60):-1,this.roundWinner=null,this.reason=null,this._awarded=!1}step({players:e,paused:t=!1,intro:i=!1,roundNotOver:s=!1,timerFreeze:r=!1,noKO:a=[!1,!1]}={}){const o=[];if(t)return o;if(this.roundState===0)return++this.phaseTime>=this.rules.preIntro&&(this.roundState=1,this.phaseTime=0),o;if(this.roundState===1)return this.phaseTime++,!i&&this.phaseTime>=this.rules.introHold&&(this.roundState=2,this.phaseTime=0,o.push({type:"fight"})),o;if(this.roundState===2){this.phaseTime++;const l=e.some((c,f)=>c.life<=0&&!a[f]);return!r&&this.timeLeft>0&&this.timeLeft--,(l||this.timeLeft===0)&&(this.roundWinner=uf(e),this.reason=l?e.every(c=>c.life<=0)?"double-ko":"ko":"time",this.roundState=3,this.phaseTime=0,o.push({type:"round-over",winner:this.roundWinner,reason:this.reason})),o}return this.roundState===3?(s||++this.phaseTime>=this.rules.overTime&&(!this._awarded&&this.roundWinner!=="draw"&&(this.wins[this.roundWinner]++,this._awarded=!0),this.matchOver=Object.values(this.wins).some(l=>l>=this.rules.roundsToWin),this.roundState=4,this.phaseTime=0,o.push({type:"result",winner:this.roundWinner,reason:this.reason,matchOver:this.matchOver})),o):(this.roundState===4&&!s&&!this.matchOver&&this.rules.autoAdvance&&++this.phaseTime>=this.rules.resultTime&&(this.roundNo++,this.roundsExisted++,this.startRound(),o.push({type:"next-round",roundNo:this.roundNo})),o)}}const ki=["a","b","c","x","y","z","s"],eh=["U","D","B","F","UB","UF","DB","DF"],df=new Set(["U","D","L","R",...ki]),Er=3600,wl=128,bl=4096;function pf(n){let e=null;for(let t=0;t<n.length;t++){const i=n[t];if((i==='"'||i==="'")&&(!e||e===i))e=e?null:i;else if(i===";"&&!e)return n.slice(0,t).trim()}return n.trim()}function jr(n){const e=n.match(/^(?:"([\s\S]*)"|'([\s\S]*)')$/);return e?e[1]??e[2]:n}function mf(n){let e=n.replace(/\s/g,"");if(!e)throw Error("Empty command symbol.");const t={source:n,strict:!1,hold:!1,release:!1,charge:0,tolerant:!1},i=new Set;for(;/^[>\/~$]/.test(e);){const r=e[0];if(i.has(r))throw Error(`Repeated ${r} modifier in ${n}.`);if(i.add(r),e=e.slice(1),r===">"&&(t.strict=!0),r==="/"&&(t.hold=!0),r==="$"&&(t.tolerant=!0),r==="~"){t.release=!0;const a=e.match(/^\d+/);if(a){if(t.charge=Number(a[0]),!Number.isSafeInteger(t.charge)||t.charge>Er)throw Error(`Charge duration exceeds the ${Er}-tick runtime limit.`);e=e.slice(a[0].length)}}}if(t.hold&&t.release)throw Error(`Hold and release cannot be combined in ${n}.`);const s=e.split("+");if(s.some(r=>!r)||new Set(s).size!==s.length)throw Error(`Invalid simultaneous input ${n}.`);if(s.length===1&&eh.includes(s[0]))t.kind="direction",t.keys=s,t.key=(t.tolerant?"$":"")+s[0];else if(s.every(r=>ki.includes(r))){if(t.tolerant)throw Error(`The $ modifier is only valid on directions: ${n}.`);t.kind="button",t.keys=s}else throw Error(`Unsupported command symbol ${n}. Directions are uppercase and buttons are lowercase.`);return t}function gf(n){const e=n.split(",").map(mf),t=[];for(const i of e){const s=t.at(-1);(s==null?void 0:s.kind)==="direction"&&i.kind==="direction"&&s.key===i.key&&!s.hold&&!s.release&&!i.hold&&!i.release?(t.push({...i,source:`>~${i.key}`,strict:!0,release:!0,charge:0}),t.push({...i,strict:!0})):t.push(i)}if(t.length>wl)throw Error(`Command exceeds the ${wl}-symbol runtime limit.`);return t}function Fo(n){const e=[];let t;for(const[c,f]of String(n).replace(/^\uFEFF|^ï»¿/,"").split(/\r?\n/).entries()){const u=pf(f),h=u.match(/^\[([^\]]+)\]$/);if(h)t={name:h[1].trim().toLowerCase(),line:c+1,values:{}},e.push(t);else if(t){const d=u.indexOf("=");d>0&&(t.values[u.slice(0,d).trim().toLowerCase()]=u.slice(d+1).trim())}}const i=[],s={time:15,bufferTime:1},r=Object.fromEntries(ki.map(c=>[c,c])),a=(c,f,u=jr(c.values.name??""))=>{i.push({kind:"command",name:u,line:c.line,message:f})};function o(c,f,u,h,d){if(c==null)return f;if(!/^[-+]?\d+$/.test(c.trim())||!Number.isSafeInteger(Number(c)))throw Error(`${h} must be an integer.`);const p=Math.max(1,Number(c));if(p>d){if(h==="buffer.time"||h==="command.buffer.time")return d;throw Error(`${h} exceeds the ${d}-tick runtime limit.`)}return p}for(const c of e){if(c.name==="defaults")try{s.time=o(c.values["command.time"],s.time,c,"command.time",Er),s.bufferTime=o(c.values["command.buffer.time"],s.bufferTime,c,"command.buffer.time",30)}catch(f){a(c,f.message)}if(c.name==="remap")for(const[f,u]of Object.entries(c.values)){const h=jr(u);!ki.includes(f)||h&&!ki.includes(h)?a(c,`Unsupported button remap ${f} = ${u}.`):r[f]=h}}const l=[];for(const c of e){if(c.name!=="command")continue;if(l.length>=bl){a(c,`Command count exceeds the ${bl}-command runtime limit.`);break}const{values:f}=c,u=jr(f.name??"");try{if(!u)throw Error("Command is missing its name.");if(!f.command)throw Error("Command is missing its input sequence.");const h=gf(f.command);l.push({name:u,command:f.command,sequence:h,time:o(f.time,s.time,c,"time",Er),bufferTime:o(f["buffer.time"],s.bufferTime,c,"buffer.time",30),line:c.line,holdOnly:h.every(d=>d.hold)})}catch(h){a(c,h.message,u)}}return{commands:l,defaults:s,remap:r,diagnostics:i}}function vf(n,e,t){const i=new Set;n.has("U")!==n.has("D")&&i.add(n.has("U")?"U":"D"),n.has("L")!==n.has("R")&&i.add(n.has(e<0?"L":"R")?"F":"B");for(const s of ki)n.has(s)&&t[s]&&i.add(t[s]);return i}function xf(n){const e=new Set(ki.filter(i=>n.has(i))),t=(n.has("U")?"U":n.has("D")?"D":"")+(n.has("B")?"B":n.has("F")?"F":"");t&&e.add(t);for(const i of eh)[...i].every(s=>n.has(s))&&e.add("$"+i);return e}function _f(n){return n.kind==="direction"?[n.key]:n.keys}function Ns(n,e){const t=_f(n);return n.hold?t.every(i=>e.held.has(i)):n.release?t.every(i=>e.released.has(i)&&(e.previousDurations.get(i)??0)>=n.charge):t.every(i=>e.pressed.has(i))}function yf(n){if(n.hold)return[];const e=n.release?"release:":"press:";return n.kind==="direction"?[e+"direction"]:n.keys.map(t=>e+t)}function El(n,e,t){return n.kind==="button"?new Set(ki.filter(i=>n.keys.includes(t[i]))):new Set([...n.keys[0]].map(i=>i==="F"?e.facing<0?"L":"R":i==="B"?e.facing<0?"R":"L":i))}class _s{constructor(e={commands:[]}){typeof e=="string"&&(e=Fo(e)),this.commands=e.commands??[],this.remap=e.remap??Object.fromEntries(ki.map(t=>[t,t])),this.diagnostics=[...e.diagnostics??[]],this.historyLimit=Math.max(1,...this.commands.map(t=>t.time)),this.reset()}reset(){this.tick=-1,this.history=[],this.buffered=new Map,this.active=new Set,this.previous={raw:new Set,held:new Set,durations:new Map}}update(e,t=1){this.tick++;const i=new Set([...e].filter(l=>df.has(l))),s=xf(vf(i,t,this.remap)),r=this.previous,a={tick:this.tick,raw:i,facing:t,held:s,pressed:new Set([...s].filter(l=>!r.held.has(l))),released:new Set([...r.held].filter(l=>!s.has(l))),previousDurations:r.durations,durations:new Map([...s].map(l=>[l,(r.durations.get(l)??0)+1])),changes:new Set([...i,...r.raw].filter(l=>i.has(l)!==r.raw.has(l)))};this.previous=a,this.history.push(a),this.history.length>this.historyLimit&&this.history.shift(),this.active=new Set;let o=25e4;for(const l of this.commands){if(l.holdOnly){l.sequence.every(f=>Ns(f,a))&&this.active.add(l.name);continue}if(l.sequence.every(f=>!f.hold||Ns(f,a))&&Ns(l.sequence.at(-1),a)&&this.matchSequence(l,()=>--o>=0)&&this.buffered.set(l.name,this.tick+l.bufferTime-1),(this.buffered.get(l.name)??-1)>=this.tick&&this.active.add(l.name),o<0){this.diagnostics.some(f=>f.message==="Input matching work limit reached.")||this.diagnostics.push({kind:"command",message:"Input matching work limit reached."});break}}for(const[l,c]of this.buffered)c<this.tick&&this.buffered.delete(l);return this.active}matchSequence(e,t){const i=this.history.length-1,s=this.tick-e.time+1;let r=i,a=null,o=new Set;for(let l=e.sequence.length-1;l>=0;l--){const c=e.sequence[l],f=yf(c);let u=-1;for(let h=r;h>=0&&this.history[h].tick>=s;h--){if(!t())return!1;if(h<r&&(o=new Set),!(!Ns(c,this.history[h])||f.some(d=>o.has(d)))&&!(a!=null&&a.symbol.strict&&!this.strictBetween(h,a.index,c,a.symbol))){u=h;break}}if(u<0)return!1;u!==r&&(o=new Set);for(const h of f)o.add(h);r=u,a={index:u,symbol:c}}return!0}strictBetween(e,t,i,s){const r=this.history[t],a=El(s,r,this.remap);if(e===t){for(const o of El(i,r,this.remap))a.add(o);return[...r.changes].every(o=>a.has(o))}for(let o=e+1;o<t;o++)if(this.history[o].changes.size)return!1;return[...r.changes].every(o=>a.has(o))}}const Tl=["a","b","c","x","y","z","s"];function Fa(n){return Number.isFinite(Number(n))?Math.max(0,Math.min(8,Math.trunc(Number(n)))):0}function Qr(n){var t,i,s,r,a,o;let e=(i=(t=n.checks)==null?void 0:t.find(l=>l.key==="cmd"&&l.ok))==null?void 0:i.path;if(!e&&((r=(s=n.def)==null?void 0:s.files)!=null&&r.cmd))try{e=Jn(n.def.files.cmd,((a=n.path)==null?void 0:a.slice(0,n.path.lastIndexOf("/")+1))||"",!0)}catch{}return Fo(e&&((o=n.files)!=null&&o[e])?wn(n.files[e]):"")}function Al(n){const e=[];let t=new Set,i=new Set,s=new Set;const r=(a=1,o=[])=>{const l=new Set([...t,...i,...o]),c=e.at(-1);c&&l.size===c.keys.size&&[...l].every(f=>c.keys.has(f))?c.duration+=a:e.push({keys:l,duration:a}),s=l};r();for(const a of n.sequence)if(a.kind==="direction"){const o=new Set(a.keys[0]);a.release?(t=o,r(Math.max(1,a.charge)),t=new Set,r()):(!a.hold&&o.size===t.size&&[...o].every(l=>t.has(l))&&(t=new Set,r()),t=o,r())}else if(a.release){r(Math.max(1,a.charge),a.keys);for(const o of a.keys)i.delete(o);r()}else{if(a.keys.some(o=>s.has(o))&&!a.hold&&r(),a.hold)for(const o of a.keys)i.add(o);r(1,a.keys)}return t=new Set,i=new Set,r(),e}class Sf{constructor(e,{level:t=4,seed:i=1831565813}={}){var r;this.level=Fa(t),this.seed=i>>>0||1,this.buffer=new _s(e),this.inverse=new Map;for(const a of Tl){const o=((r=e.remap)==null?void 0:r[a])??a;o&&!this.inverse.has(o)&&this.inverse.set(o,a)}const s=e.commands.filter(a=>a.sequence.every(o=>o.kind!=="button"||o.keys.every(l=>this.inverse.has(l))));this.attacks=s.filter(a=>!a.holdOnly&&a.sequence.some(o=>o.kind==="button"&&o.keys.some(l=>l!=="s"))).slice(0,512),this.byName=new Map;for(const a of s)this.byName.has(a.name)||this.byName.set(a.name,[]),this.byName.get(a.name).push(a);this.recoveries=s.filter(a=>a.name.toLowerCase()==="recovery"),this.recoveryNames=new WeakMap,this.recoveryButton=0,this.recovering=!1,this.normal=this.attacks.filter(a=>a.sequence.length===1&&!a.sequence[0].release),this.special=this.attacks.filter(a=>!this.normal.includes(a)),this.plan=[],this.index=0,this.remaining=0,this.cooldown=0,this.raw=new Set,this.lastCommand=null}random(){let e=this.seed;return e^=e<<13,e^=e>>>17,e^=e<<5,this.seed=e>>>0,this.seed/4294967296}physical(e,t){return new Set([...e].map(i=>i==="F"?t<0?"L":"R":i==="B"?t<0?"R":"L":this.inverse.get(i)||i))}queue(e,t){this.plan=[{keys:new Set(e),duration:t}],this.index=0,this.remaining=0}chooseRecovery(e){var a;const t=(a=e.stateOwner)==null?void 0:a.program.states.get(e.stateNo);let i=t&&this.recoveryNames.get(t);if(t&&!i){i=new Set;for(const o of t.controllers){if(!["changestate","selfstate"].includes(o.type))continue;const l=o.entries.filter(c=>/^trigger(?:all|[1-9]\d*)$/.test(c.key)).map(c=>c.value).join(`
`);if(/\bcanrecover\b/i.test(l))for(const c of l.matchAll(/\bcommand\s*=\s*"([^"\\]*)"/gi))i.add(c[1])}this.recoveryNames.set(t,i)}const s=[...i||[]].flatMap(o=>this.byName.get(o)||[]),r=s.length?s:this.recoveries;if(r.length){const o=r[Math.floor(this.random()*r.length)];this.lastCommand=o.name,this.plan=Al(o),this.index=0,this.remaining=0}else{const o=Tl.filter(l=>l!=="s"&&this.inverse.has(l));o.length&&this.queue([o[this.recoveryButton++%o.length]],1)}}choose(e,t){if(!e.ctrl||e.moveType==="H")return;const i=Math.abs(t.pos.x-e.pos.x),s=e.coordinateScale||1,r=e.constant("size.ground.front")*s+t.constant("size.ground.front")*(t.coordinateScale||1)+20*s;if(i>r){this.queue(["F"],4+Math.floor(this.random()*9));return}if(t.moveType==="A"&&this.random()<.12+.07*this.level){this.queue(this.random()<.3?["D","B"]:["B"],4+this.level);return}if(this.attacks.length){const a=this.special.length&&this.random()<.08+.055*this.level?this.special:this.normal.length?this.normal:this.attacks,o=a[Math.floor(this.random()*a.length)];this.lastCommand=o.name,this.plan=Al(o),this.index=0,this.remaining=0}else this.queue([],2)}tick(e,t,{paused:i=!1,enabled:s=!0}={}){var r,a;if(!this.level||!s||!e.alive||!(t!=null&&t.alive))this.plan=[],this.index=0,this.remaining=0,this.cooldown=0,this.raw=new Set,this.recovering=!1;else if(!i){const o=e.moveType==="H"&&!!((r=e.getHitVars)!=null&&r.fall);o!==this.recovering&&(this.plan=[],this.index=0,this.remaining=0,this.cooldown=o?10-this.level:0,this.raw=new Set,this.recovering=o);const l=o&&["A","L"].includes(e.stateType)&&!!((a=e.resolveTrigger)!=null&&a.call(e,"canrecover"));o&&!l&&(this.plan=[],this.index=0,this.remaining=0,this.cooldown=10-this.level,this.raw=new Set),this.index>=this.plan.length&&(this.cooldown>0?this.cooldown--:o?(l&&this.chooseRecovery(e),this.cooldown=14-this.level):(this.choose(e,t),this.cooldown=Math.max(1,15-this.level*1.5)));const c=this.plan[this.index];c?(this.remaining<=0&&(this.remaining=c.duration),this.raw=this.physical(c.keys,e.facing),--this.remaining<=0&&this.index++):this.raw=new Set}return this.buffer.update(this.raw,e.facing)}}const $n=(n,e=0)=>Number.isFinite(Number(n))?Number(n):e,Oo=n=>String(n??"").toUpperCase().replace(/\s/g,"");function Yn(n,e,t){var r;const i=(r=n.program)==null?void 0:r.constants,s=i instanceof Map?i.get(e):i==null?void 0:i[e];return s===void 0?t:$n(s,t)}function hn(n,e="clsn1",t=n.collisionFrame??n.currentFrame){var f,u,h,d;if(!t||!Array.isArray(t[e]))return[];const i=Kc(n),s=Bt(i),r=n.facing<0?-1:1,a=Yn(i,"size.xscale",1)*s*r,o=Yn(i,"size.yscale",1)*s,l=$n((f=n.pos)==null?void 0:f.x)+Yn(n,"size.draw.offset.x",0)*Bt(n)*r+$n((u=n.drawOffset)==null?void 0:u.x),c=$n((h=n.pos)==null?void 0:h.y)+Yn(n,"size.draw.offset.y",0)*Bt(n)+$n((d=n.drawOffset)==null?void 0:d.y);return t[e].filter(p=>Array.isArray(p)&&p.length>=4&&p.slice(0,4).every(x=>Number.isFinite(Number(x)))).map(p=>{const x=l+Number(p[0])*a,m=l+Number(p[2])*a,v=c+Number(p[1])*o,M=c+Number(p[3])*o;return[Math.min(x,m),Math.min(v,M),Math.max(x,m),Math.max(v,M)]})}function Mf(n,e,t=!1){return t?n[0]<=e[2]&&n[2]>=e[0]&&n[1]<=e[3]&&n[3]>=e[1]:n[0]<e[2]&&n[2]>e[0]&&n[1]<e[3]&&n[3]>e[1]}function Us(n,e,t=!1){for(const i of n)for(const s of e)if(Mf(i,s,t))return[Math.max(i[0],s[0]),Math.max(i[1],s[1]),Math.min(i[2],s[2]),Math.min(i[3],s[3])];return null}function wf(n,e){var s;const t=Oo(n.hitFlag??n.hitflag??"MAF");if(!/[HLAMFD]/.test(t)||t.includes("+")&&t.includes("-"))return!1;const i=e.moveType==="H";return t.includes("+")&&!i||t.includes("-")&&i?!1:e.stateType==="L"?t.includes("D"):e.stateType==="A"?t.includes(e.moveType==="H"&&((s=e.getHitVars)!=null&&s.fall)?"F":"A"):e.stateType==="C"?/[LM]/.test(t):/[HM]/.test(t)}function bf(n,e,t,i){var l,c,f,u;const s=t.moveType==="H"&&!!((l=t.getHitVars)!=null&&l.guarded);if(!t.ctrl&&!s||t.moveType==="H"&&!s||!["S","C","A"].includes(t.stateType)||(c=e.asserted)!=null&&c.has("unguardable"))return!1;const r=t.stateType==="A"?"noairguard":t.stateType==="C"?"nocrouchguard":"nostandguard";if((f=t.asserted)!=null&&f.has(r))return!1;const a=new Set([...i].map(h=>String(h).toLowerCase()));if(!((u=t.world)!=null&&u.manageInputs?t.movementHeld("holdback"):a.has("holdback")))return!1;const o=Oo(n.guardFlag??n.guardflag);return t.stateType==="A"?o.includes("A"):t.stateType==="C"?/[LM]/.test(o):/[HM]/.test(o)}function Rl(n){const e=Array.isArray(n.priority)?n.priority:String(n.priority??"4,Hit").split(","),t=String(e[1]??"Hit").trim().toLowerCase();return{level:Math.max(1,Math.min(7,$n(e[0],4))),type:["hit","miss","dodge"].includes(t)?t:"hit"}}function Ef(n){if(n.length<2)return n;const e=Rl(n[0].hit),t=Rl(n[1].hit);return e.level!==t.level?[n[e.level>t.level?0:1]]:e.type==="dodge"||t.type==="dodge"?[]:e.type==="miss"&&t.type==="miss"?[]:n.filter((i,s)=>(s?t:e).type==="hit")}class Tf{constructor(e,{commonText:t="",commonAnimations:i=new Map,opponentCharacter:s=e,leftBound:r=-150,rightBound:a=150,pushboxes:o=!0,maxHelpers:l=56,maxProjectiles:c=256,initialize:f=!0,skipIntro:u=!0,stage:h=null,rules:d=null,combatRules:p={},playerPalette:x=1,opponentPalette:m=1,playerAILevel:v=0,opponentAILevel:M=0,expressionEvaluator:T=null,programs:E=null,manageInputs:w=!1,orderedPhases:y=!1}={}){if(this.expressionEvaluator=T,this.programs=E,this.manageInputs=w,this.orderedPhases=y,this.combatRules=ef(e.files,p),!Number.isFinite(r)||!Number.isFinite(a)||r>=a)throw Error("Invalid training stage bounds.");this.character=e,this.opponentCharacter=s,this.commonText=t,this.leftBound=r,this.rightBound=a,this.pushboxes=o,this.commonAnimations=i,this.maxHelpers=Math.min(256,Math.max(0,l)),this.maxProjectiles=Math.min(1024,Math.max(0,c)),this.initialize=f,this.skipIntro=u,this.playerPalette=x,this.opponentPalette=m,this.playerAILevel=Fa(v),this.opponentAILevel=Fa(M),this.stage=h?new hf(h):null,this.rules=d,this.stage&&(this.leftBound=h.leftBound,this.rightBound=h.rightBound),this.reset()}reset({preserveMatch:e=!1}={}){var s,r,a,o;const t=e?{players:[this.player,this.opponent],flow:this.roundFlow,ticks:this.ticks,diagnostics:this.diagnostics}:null;this.roundFlow=(t==null?void 0:t.flow)||(this.rules?new ff(this.rules):null),this.roundGeneration=(this.roundGeneration||0)+1,this.stage&&this.stage.reset({backgrounds:!e||this.stage.definition.resetBG});const i=((s=this.stage)==null?void 0:s.definition.starts)||[{x:-70,y:0,facing:1},{x:70,y:0,facing:-1}];if(this.player=new br(this.character,{world:this,program:(r=this.programs)==null?void 0:r.get(this.character),expressionEvaluator:this.expressionEvaluator,commonAnimations:this.commonAnimations,commonText:this.commonText,position:i[0],facing:i[0].facing,id:1,teamSide:1,paletteNo:this.playerPalette,aiLevel:this.playerAILevel}),this.opponent=new br(this.opponentCharacter,{world:this,program:(a=this.programs)==null?void 0:a.get(this.opponentCharacter),expressionEvaluator:this.expressionEvaluator,commonAnimations:this.commonAnimations,commonText:this.commonText,position:i[1],facing:i[1].facing,id:2,teamSide:2,paletteNo:this.opponentPalette,aiLevel:this.opponentAILevel}),this.player.teamSide=1,this.opponent.teamSide=2,this.player.opponent=this.opponent,this.opponent.opponent=this.player,this._entities=[this.player,this.opponent],this.projectiles=[],this.nextEntityId=3,this.orphanEffectOwners=[],this.renderEntities=[...this._entities],this.drawProjectiles=[],this.helperCommands=new Map,this.usedHits=new Map,this.juggles=new Map,this.archivedDiagnostics=[],this.archivedDiagnosticKeys=new Set,this.pendingPauses=[],this.pause=null,this.superPause=null,this.commandBuffers=new Map,this.presentationEvents=[],this.eventEntities=[],this.pendingCombatEffects=[],this.activeActor=null,this.contactPhase=!1,this.inputBuffers=new Map,this.inputProfiles=new Map,this.manageInputs)for(const l of this._entities)this.inputProfiles.has(l.character)||this.inputProfiles.set(l.character,Qr(l.character)),this.inputBuffers.set(l,new _s(this.inputProfiles.get(l.character)));this.events=[],this.cpus=new Map;for(const l of this._entities)if(l.aiLevel){const c=Qr(l.character);this.cpus.set(l,new Sf(c,{level:l.aiLevel,seed:1831565813^l.id*2654435769^(((o=this.roundFlow)==null?void 0:o.roundNo)||1)}));for(const f of c.diagnostics)l.diagnostic("command",f.message,{source:l.character.def.files.cmd,line:f.line})}if(this.ticks=(t==null?void 0:t.ticks)||0,this.winner=null,t){this.archiveDiagnostics(t.diagnostics);for(const[l,c]of[this.player,this.opponent].entries()){const f=t.players[l];c.power=f.power,c.victoryQuoteIndex=f.victoryQuoteIndex;const u=Math.max(0,Math.min(60,Math.trunc(c.program.constants.get("data.intpersistindex")??60))),h=Math.max(0,Math.min(40,Math.trunc(c.program.constants.get("data.floatpersistindex")??40)));c.vars.set(f.vars.subarray(u),u),c.fvars.set(f.fvars.subarray(h),h)}}if(this.syncEnvironment(),this.initialize)for(const l of this._entities)l.program.states.has(5900)&&(l._initializing=!0,l.options.skipIntro=this.skipIntro,l.changeState(5900));return this}get diagnostics(){var i;const e=[...this.archivedDiagnostics,...((i=this.stage)==null?void 0:i.diagnostics)||[],...this.entities.flatMap(s=>s.diagnostics||[]),...this.orphanEffectOwners.flatMap(s=>s.diagnostics||[]),...this.projectiles.flatMap(s=>s.diagnostics||[]),...[...this.cpus||new Map].flatMap(([s,r])=>r.buffer.diagnostics.map(a=>({...a,source:s.character.def.files.cmd})))],t=new Set;return e.filter(s=>{const r=typeof s=="string"?s:JSON.stringify(s);return t.has(r)?!1:(t.add(r),!0)})}get entities(){return this._entities.filter(e=>!e.destroyed)}get view(){var e;return((e=this.stage)==null?void 0:e.view())||{left:-160,right:160,top:-200,bottom:40,width:320,height:240,displayHeight:240,groundY:200,zoom:1}}get matchOver(){var e;return((e=this.roundFlow)==null?void 0:e.matchOver)||!1}syncEnvironment(){for(const e of this._entities||[])this.stage&&(e.cameraPos=this.stage.camera,e.cameraZoom=this.stage.camera.zoom),this.roundFlow&&(e.roundState=this.roundFlow.roundState,e.roundNo=this.roundFlow.roundNo,e.roundsExisted=this.roundFlow.roundsExisted)}findPlayer(e){return this.entities.find(t=>t.id===e)}spawnHelper(e,t){if(this.entities.filter(s=>s.parent).length>=this.maxHelpers)return e.diagnostic("resource-limit",`Helper limit (${this.maxHelpers}) reached.`),null;const i=e.createHelper(t,{id:this.nextEntityId++});return i.destroyed?this.archiveDiagnostics(i.diagnostics):(this._entities.push(i),i.keyCtrl&&this.helperCommands.set(i,new _s(Qr(i.root.character))),this.syncEnvironment()),i}spawnProjectile(e,t){if(this.projectiles.length>=this.maxProjectiles)return e.diagnostic("resource-limit",`Projectile limit (${this.maxProjectiles}) reached.`),null;const i=new as(e,t,{id:this.nextEntityId++});if(i.removed)return this.archiveDiagnostics(i.diagnostics),i;const s=Object.fromEntries(Object.entries(t).filter(([r])=>r.startsWith("afterimage.")).map(([r,a])=>[r.slice(11),a]));return Object.keys(s).length&&this.presentationEvents.push({...s,type:"afterimage",entity:i}),this.projectiles.push(i),i}retireEffects(e,{removeExplods:t=!1}={}){var i;if(!e._effectsDetached){if(e._effectsDetached=!0,t)e.explods=[],e.drawExplods=[];else if(e.drawExplods=[],e.explods.length){for(const s of e.explods)s.orphaned=!0;this.orphanEffectOwners.push(e)}for(const s of new Set([...this._entities,...this.orphanEffectOwners]))((i=s.bound)==null?void 0:i.target)===e&&(s.bound=null),Vu(s,e)}}destroyHelper(e,{recursive:t=!1,removeExplods:i=!1}={}){const s=[e];if(t)for(const r of this._entities){let a=r.parent,o=0;for(;a&&o++<256;){if(a===e){s.push(r);break}a=a.parent}}for(const r of s)r.destroyed=!0;for(const r of s)this.retireEffects(r,{removeExplods:i})}requestPause(e,t){const i=Math.max(0,Math.trunc(t.time));if(!Number.isFinite(i)||i>36e4){e.diagnostic("resource-limit","Pause time must be between 0 and 360000 ticks.");return}const s={...t,owner:e,time:i,remaining:i,elapsed:0,moved:new Map,movetime:Math.max(0,Math.min(i,t.movetime||0)),endcmdbuftime:Math.max(0,Math.min(i,t.endcmdbuftime||0))};this.pendingPauses.push(s),t.type==="superpause"&&(e.power=Math.max(0,Math.min(e.maxPower,e.power+(t.poweradd||0))),this.presentationEvents.push({...s,type:"superpause"}))}isFrozen(e){var s,r;const t=((s=this.superPause)==null?void 0:s.remaining)>0?this.superPause:((r=this.pause)==null?void 0:r.remaining)>0?this.pause:null;if(!t)return!1;const i=e===t.owner?t.movetime:t.type==="superpause"?e.superMoveTime||0:e.pauseMoveTime||0;return e.isProjectile?i<=0:(t.moved.get(e)||0)>=i}isSuperUnhittable(e){var t;return((t=this.superPause)==null?void 0:t.remaining)>0&&this.superPause.owner===e&&this.superPause.unhittable!==0}advancePause(){var i,s;const e=((i=this.superPause)==null?void 0:i.remaining)>0?this.superPause:((s=this.pause)==null?void 0:s.remaining)>0?this.pause:null,t=r=>{for(const[a,{before:o,applied:l}]of(r==null?void 0:r.defence)||[])a.defenceMultiplier===l&&(a.defenceMultiplier=o)};if(e){for(const r of[...this.entities,...this.projectiles])!this.isFrozen(r)&&!r._hitPausedThisTick&&e.moved.set(r,(e.moved.get(r)||0)+1);e.remaining--,e.elapsed++,e.remaining||t(e)}for(const r of this.pendingPauses){const a=r.type==="superpause"?"superPause":"pause";if(t(this[a]),this[a]=r,a==="superPause"&&r.remaining>0){const o=r.p2defmul>0?r.p2defmul:this.combatRules.superTargetDefence||1.5;r.defence=new Map;for(const l of r.owner.targets){const c=l.defenceMultiplier,f=c/o;r.defence.set(l,{before:c,applied:f}),l.defenceMultiplier=f}}}this.pendingPauses=[]}tick(e=new Set,t=new Set,{playerInput:i=null,opponentInput:s=null}={}){var g,_,L,R,A,O,N,C,k,B,H;if(this.orderedPhases){for(const P of this.pendingCombatEffects){const{defender:I,attacker:z,damage:$,minimum:te,get:se,give:q}=P;I.life=Math.max(te,Math.min(I.maxLife,I.life-$)),z&&(z.power=Math.max(0,Math.min(z.maxPower,z.power+se)),I.power=Math.max(0,Math.min(I.maxPower,I.power+q)))}this.pendingCombatEffects=[];for(const P of this._entities)P._projectedLife=void 0}this.events=[],this.presentationEvents=[],e=e instanceof Set?e:new Set(e),t=t instanceof Set?t:new Set(t);const r=((g=this.superPause)==null?void 0:g.remaining)>0||((_=this.pause)==null?void 0:_.remaining)>0&&this.pause.pausebg!==0,a=((L=this.superPause)==null?void 0:L.remaining)>0||((R=this.pause)==null?void 0:R.remaining)>0,o=((A=this.pause)==null?void 0:A.remaining)>0?this.pause:null,l=((O=this.superPause)==null?void 0:O.remaining)>0?this.superPause:null;this.syncEnvironment(),this.cpus.has(this.player)&&(e=this.cpus.get(this.player).tick(this.player,this.opponent,{paused:this.isFrozen(this.player)||this.player.hitPauseTime>0,enabled:!this.roundFlow||this.roundFlow.roundState===2})),this.cpus.has(this.opponent)&&(t=this.cpus.get(this.opponent).tick(this.opponent,this.player,{paused:this.isFrozen(this.opponent)||this.opponent.hitPauseTime>0,enabled:!this.roundFlow||this.roundFlow.roundState===2})),this.cpus.has(this.player)&&(i=this.cpus.get(this.player).raw),this.cpus.has(this.opponent)&&(s=this.cpus.get(this.opponent).raw);const c=new Set([...this.entities,...this.projectiles].filter(P=>P.hitPauseTime>0)),f=new Set,u=[];for(let P=0;P<this._entities.length;P++){const I=this._entities[P];if(I.destroyed)continue;u.push(I);let z=I.root===this.player?e:t,$=I.root===this.player?i:s;if(this.manageInputs&&I.keyCtrl){$=new Set($||[]);for(const q of I.pendingAssertedInputs)$.add(q==="F"?I.facing===1?"R":"L":q==="B"?I.facing===1?"L":"R":q);I.pendingAssertedInputs.clear(),this.inputBuffers.has(I)||this.inputBuffers.set(I,new _s(this.inputProfiles.get(I.root.character))),z=this.inputBuffers.get(I).update($,I.facing)}else I.parent&&I.keyCtrl&&$!==null&&(z=this.helperCommands.get(I).update($,I.facing));(!I.keyCtrl||this.roundFlow&&this.roundFlow.roundState!==2)&&(z=new Set);const te=I.teamSide===this.player.teamSide?this.opponent:this.player,se=this.isFrozen(I);if(I._hitPausedThisTick=I.hitPauseTime>0,!se&&!I._hitPausedThisTick&&(I._projectileContactShield=!1),se){f.add(I);const q=((N=this.superPause)==null?void 0:N.remaining)>0?this.superPause:this.pause;if(q&&q.remaining<=q.endcmdbuftime){this.commandBuffers.has(I)||this.commandBuffers.set(I,new Set);for(const ne of z)this.commandBuffers.get(I).add(ne)}}else this.commandBuffers.has(I)&&(z=new Set([...z,...this.commandBuffers.get(I)]),this.commandBuffers.delete(I));this.activeActor=I;try{I.tick({commands:z,opponent:te,paused:se,input:I.keyCtrl?$:new Set})}finally{this.activeActor=null}}for(const P of this.projectiles){const I=this.isFrozen(P);I&&f.add(P),P._hitPausedThisTick=P.hitPauseTime>0,P.tick({paused:I})}if(this.stage){for(const P of this.entities)P.screenBound!==!1&&(P.pos.x=Math.max(this.leftBound,Math.min(this.rightBound,P.pos.x)));this.stage.updateCamera(this.entities),this.syncEnvironment(),this.stage.tick({paused:r})}this.constrainPositions()&&this.stage&&(this.stage.updateCamera(this.entities),this.syncEnvironment(),this.constrainPositions({push:!1}));const d=this.entities;for(const P of d)if(P.moveType!=="H"&&P.stateType!=="L")for(const I of this.juggles.values())I.delete(P.id);const p=this.projectiles.filter(P=>!P.removed&&!P.removing),x=p.map(P=>hn(P,"clsn2"));for(let P=0;P<p.length;P++){const I=p[P];if(I.removing||!x[P].length)continue;const z=[];for(let te=P+1;te<p.length;te++){const se=p[te];I.teamSide===se.teamSide||se.removing||f.has(I)&&f.has(se)||!Us(x[P],x[te],this.orderedPhases)||z.push(se)}const $=te=>(te.pos.x-I.pos.x)**2+(te.pos.y-I.pos.y)**2;z.sort((te,se)=>$(te)-$(se)||te.id-se.id);for(const te of z){if(I.removing)break;te.removing||(I.clash(te),te.clash(I))}}const m=this.orderedPhases?this.projectiles.filter(P=>!P.removed||P.drawVisible):p,v=[...d,...m];for(const P of d)P.inGuardDistance=kc(P,v);const M=[],T=new Set;for(const P of d)for(const I of d){if(this.roundFlow&&this.roundFlow.roundState!==2)continue;const z=P.reversalDef,$=I.hitDef;if(!z||!$||I===P||I.teamSide===P.teamSide||f.has(P)||c.has(P)||c.has(I)||T.has(I)||!P.attributeMatches(z["reversal.attr"],$.attr)||((C=this.usedHits.get(P))==null?void 0:C.get(I.id))===z.serial)continue;const te=Us(hn(P),hn(I),this.orderedPhases);if(!te)continue;const se=I.receiveHit(z,P);se.rejected||(this.applyCornerPush(P,I,se.cornerPush,z.coordinateScale),I.moveContact=I.moveHit=I.moveGuarded=0,I.moveReversed=1,I.hitDef=null,T.add(I),this.usedHits.has(P)||this.usedHits.set(P,new Map),this.usedHits.get(P).set(I.id,z.serial),this.events.push({type:"reversal",attacker:P,defender:I,hitDef:z,damage:se.damage,guarded:!1,x:(te[0]+te[2])/2,y:(te[1]+te[3])/2,tick:this.ticks}))}for(const P of[...d,...p])for(const I of[...d].sort((z,$)=>Math.abs(z.pos.x-P.pos.x)-Math.abs($.pos.x-P.pos.x))){if(P===I||this.winner||this.roundFlow&&this.roundFlow.roundState!==2||P.destroyed||f.has(P)||T.has(P))continue;const z=P.hitDef;if(P.isProjectile&&P.owner===I||!z||P.life<=0||I.life<=0||c.has(P)||c.has(I)||P.moveType!=="A"||!/^[SCA]\s*,\s*[NSH][ATP]$/i.test(String(z.attr??"").trim())||!wf(z,I))continue;const $=Oo(z.affectteam??"E"),te=P.teamSide===I.teamSide;if($==="E"&&te||$==="F"&&!te||typeof I.canBeHit=="function"&&!I.canBeHit(z,P)||String(z[I.stateType==="A"?"air.type":"ground.type"]??z["ground.type"]??"high").toLowerCase()!=="none"&&!this.canJuggle(P,I,z))continue;const se=z.serial??z;if(P instanceof as?!P.canHit(I,this.ticks):((k=this.usedHits.get(P))==null?void 0:k.get(I.id))===se)continue;const q=hn(P),ne=hn(I,"clsn2"),fe=Us(q,ne,this.orderedPhases);if(!fe)continue;const we=this.manageInputs||I.parent?I.commands:I===this.player?e:t;M.push({attacker:P,defender:I,hit:z,activation:se,overlap:fe,wasFalling:I.stateType==="L"||I.stateType==="A"&&I.moveType==="H"&&!!((B=I.getHitVars)!=null&&B.fall),guarded:bf(z,P,I,we)})}const E=M.filter(P=>{const I=M.find(z=>z.attacker===P.defender&&z.defender===P.attacker);return!I||Ef([P,I]).includes(P)}),w=new Set;for(const P of E){if(P.attacker instanceof as&&(P.defender._projectileContactShield||!P.attacker.canHit()))continue;let I;this.contactPhase=!0;try{I=P.defender.receiveHit(P.hit,P.attacker,{guarded:P.guarded})}finally{this.contactPhase=!1}I!=null&&I.rejected||(this.applyCornerPush(P.attacker,P.defender,I.cornerPush,P.hit.coordinateScale),!P.guarded&&!I.typeNone&&this.recordJuggle(P.attacker,P.defender,P.hit,{wasFalling:P.wasFalling}),this.usedHits.has(P.attacker)||this.usedHits.set(P.attacker,new Map),this.usedHits.get(P.attacker).set(P.defender.id,P.activation),P.attacker instanceof as&&(P.defender._projectileContactShield=!0,P.attacker.onContact({guarded:P.guarded,defer:!0}),w.add(P.attacker)),this.events.push({type:P.guarded?"guard":"hit",attacker:P.attacker,defender:P.defender,hitDef:P.hit,damage:(I==null?void 0:I.damage)??0,guarded:P.guarded,typeNone:!!I.typeNone,x:(P.overlap[0]+P.overlap[2])/2,y:(P.overlap[1]+P.overlap[3])/2,tick:this.ticks}))}for(const P of w)P.finishContacts();for(const P of this.projectiles)P.finishMovementAllowance({paused:f.has(P)});for(const P of this.entities)P.updateExplods({hitPaused:c.has(P),pause:o,superPause:l});for(const P of this._entities)P.destroyed&&!P._effectsDetached&&this.retireEffects(P);for(const P of this.orphanEffectOwners)P.updateExplods({pause:o,superPause:l});this.orphanEffectOwners=this.orphanEffectOwners.filter(P=>P.explods.length||P.drawExplods.length),this.drawProjectiles=this.projectiles.filter(P=>P.drawVisible),this.eventEntities=[...u,...this.projectiles],this.cleanupEntities(),this.advancePause(),this.ticks++;const y=P=>this.entities.some(I=>I.asserted.has(P));if(!this.roundFlow&&!y("noko")&&(this.player.life<=0||this.opponent.life<=0)&&(this.winner=this.player.life<=0&&this.opponent.life<=0?"draw":this.player.life<=0?"opponent":"player"),this.roundFlow){const P=this.roundFlow,I=[this.player,this.opponent],z=P.step({players:I,paused:a,intro:y("intro"),roundNotOver:y("roundnotover"),timerFreeze:y("timerfreeze"),noKO:I.map(()=>y("noko"))});this.syncEnvironment();for(const $ of z){if($.type==="fight")for(const te of I)te.stateNo===0&&(te.ctrl=1);if($.type==="round-over"&&(this.winner=$.winner),$.type==="result")for(const te of I){const se=$.winner===(te===this.player?"player":"opponent"),q=se?180:$.reason==="time"?170:null;q!==null&&te.program.states.has(q)&&te.changeState(q,0,te)}$.type==="next-round"&&this.reset({preserveMatch:!0}),this.presentationEvents.push({...$,type:"round",event:$.type})}P.matchOver&&P.roundWinner!=="draw"&&((H=this[P.roundWinner])==null||H.selectVictoryQuote())}return this.events}cleanupEntities(){var t;const e=this._entities.filter(i=>i.destroyed);for(const i of e)i._effectsDetached||this.retireEffects(i);for(const i of[...e,...this.projectiles.filter(s=>s.removed)]){this.archiveDiagnostics(i.diagnostics),this.usedHits.delete(i),this.commandBuffers.delete(i),this.inputBuffers.delete(i),this.helperCommands.delete(i),this.juggles.delete(i);for(const s of this.juggles.values())s.delete(i.id)}this._entities=this._entities.filter(i=>!i.destroyed),this.projectiles=this.projectiles.filter(i=>!i.removed);for(const i of this._entities){i.helpers=i.helpers.filter(s=>!s.destroyed),i.targets=i.targets.filter(s=>!s.destroyed&&(!this.orderedPhases||s.moveType==="H"));for(const s of i.targetHitIds.keys())i.targets.some(r=>r.id===s)||i.targetHitIds.delete(s);(t=i.bound)!=null&&t.target.destroyed&&(i.bound=null)}this.renderEntities=[...this._entities,...this.orphanEffectOwners].sort((i,s)=>i.id-s.id)}archiveDiagnostics(e){for(const t of e){const i=JSON.stringify(t);this.archivedDiagnosticKeys.has(i)||(this.archivedDiagnosticKeys.add(i),this.archivedDiagnostics.push(t))}}canJuggle(e,t,i){var c,f,u;if((c=(e.isProjectile?e.creator:e).asserted)!=null&&c.has("nojugglecheck")||!(t.stateType==="L"||t.stateType==="A"&&t.moveType==="H"&&((f=t.getHitVars)==null?void 0:f.fall)))return!0;const r=e.isProjectile?e.owner:e,a=(u=this.juggles.get(r))==null?void 0:u.get(t.id),o=(a==null?void 0:a.remaining)??r.constant("data.airjuggle"),l=e.isProjectile?i["air.juggle"]||0:(a==null?void 0:a.group)===i.juggleGroup?0:i.juggleCost||0;return o>=l}recordJuggle(e,t,i,{wasFalling:s=!1}={}){var f,u;if(!s&&!((f=t.getHitVars)!=null&&f.fall)&&t.stateType!=="L")return;const r=e.isProjectile?e.owner:e;this.juggles.has(r)||this.juggles.set(r,new Map);const a=this.juggles.get(r),o=a.get(t.id),l=(u=(e.isProjectile?e.creator:e).asserted)==null?void 0:u.has("nojugglecheck"),c=l?0:e.isProjectile?i["air.juggle"]||0:(o==null?void 0:o.group)===i.juggleGroup?0:i.juggleCost||0;a.set(t.id,{remaining:Math.max(0,((o==null?void 0:o.remaining)??r.constant("data.airjuggle"))-c),group:i.juggleGroup})}bodyWidth(e,t,i=!1){return fr(e,t,{edge:i})}horizontalLimits(e){let t=this.stage?Math.max(this.leftBound,this.view.left+Math.max(this.stage.definition.screenLeft,this.bodyWidth(e,-1,!0))):this.leftBound+this.bodyWidth(e,-1,!0),i=this.stage?Math.min(this.rightBound,this.view.right-Math.max(this.stage.definition.screenRight,this.bodyWidth(e,1,!0))):this.rightBound-this.bodyWidth(e,1,!0);return t>i&&(t=i=(this.leftBound+this.rightBound)/2),{min:t,max:i}}applyCornerPush(e,t,i=0,s=e.coordinateScale){if(!i||e instanceof as||t.screenBound===!1)return;const{min:r,max:a}=this.horizontalLimits(t),o=t.pos.x===e.pos.x?e.facing:Math.sign(t.pos.x-e.pos.x);(o>0?t.pos.x<a-.01:t.pos.x>r+.01)||(e.cornerPush=i*s*o)}constrainPositions({push:e=!0}={}){const t=this.entities,i=new Map(t.map(o=>[o,this.horizontalLimits(o)])),s=o=>{if(o.screenBound!==!1){const{min:l,max:c}=i.get(o);o.pos.x=Math.max(l,Math.min(c,o.pos.x))}};if(t.forEach(s),!this.pushboxes||!e)return!1;let r=!1;const a=t.filter(o=>o.playerPush!==!1).sort((o,l)=>o.id-l.id);for(let o=0;o<a.length;o++)for(let l=o+1;l<a.length;l++){const c=a[o],f=a[l];if(c.teamSide===f.teamSide)continue;const u=c.pos.y-Yn(c,"size.height",60)*Bt(c),h=f.pos.y-Yn(f,"size.height",60)*Bt(f);if(u>=f.pos.y||h>=c.pos.y||!Us(hn(c,"clsn2"),hn(f,"clsn2")))continue;const[d,p]=c.pos.x<=f.pos.x?[c,f]:[f,c],x=d.pos.x+this.bodyWidth(d,1)-p.pos.x+this.bodyWidth(p,-1);if(x<=0)continue;const m=d.screenBound===!1?1/0:Math.max(0,d.pos.x-i.get(d).min),v=p.screenBound===!1?1/0:Math.max(0,i.get(p).max-p.pos.x),M=Math.min(x/2,m),T=Math.min(x-M,v);d.pos.x-=Math.min(x-T,m),p.pos.x+=T,s(d),s(p),r=!0}return r}}const nt=(n,e,t="")=>`
[Statedef ${n}]
${e}
${t}
`,Le=(n,e,t="1")=>`
[State 0, ${n}]
type = ${n}
trigger1 = ${t}
${e}
`,st=(n,e,t=1)=>Le("ChangeState",`value = ${n}
ctrl = ${t}`,e),ut=(n,e="time = 0")=>Le("ChangeAnim",`value = ${n}`,`(${e}) && selfanimexist(${n})`);function th({orderedPhases:n=!1}={}){return[nt(0,`type = S
movetype = I
physics = S
ctrl = 1`,ut(0,"anim != 0")+Le("VelSet","y = 0","time = 0")),nt(10,`type = C
movetype = I
physics = C`,ut(10)+st(11,"animtime = 0 || !selfanimexist(10)")),nt(11,`type = C
movetype = I
physics = C
ctrl = 1`,ut(11)),nt(12,`type = S
movetype = I
physics = S`,ut(12)+st(0,"animtime = 0 || !selfanimexist(12)")),nt(20,`type = S
movetype = I
physics = S
ctrl = 1`,Le("VelSet","x = const(velocity.walk.fwd.x)",'command = "holdfwd"')+Le("VelSet","x = const(velocity.walk.back.x)",'command = "holdback"')+ut(20,"vel x > 0 && anim != 20")+ut(21,"vel x < 0 && anim != 21")),nt(40,`type = S
movetype = I
physics = S
ctrl = 0`,ut(40)+Le("VelSet",`x = ifelse(command = "holdfwd", const(velocity.jump.fwd.x), ifelse(command = "holdback", const(velocity.jump.back.x), const(velocity.jump.neu.x)))
y = const(velocity.jump.y)`,"animtime = 0 || !selfanimexist(40)")+st(50,"animtime = 0 || !selfanimexist(40)")),nt(45,`type = A
movetype = I
physics = A
ctrl = 1`,Le("VelSet",`x = ifelse(command = "holdfwd", const(velocity.airjump.fwd.x), ifelse(command = "holdback", const(velocity.airjump.back.x), const(velocity.airjump.neu.x)))
y = const(velocity.airjump.y)`,"time = 0")+st(50,"time > 0")),nt(50,`type = A
movetype = I
physics = A
ctrl = 1`,ut("ifelse(vel x = 0, 41, ifelse(vel x > 0, 42, 43))")+st(52,"pos y >= 0 && vel y > 0",0)),nt(51,`type = A
movetype = I
physics = A`),nt(52,`type = S
movetype = I
physics = S
ctrl = 0`+(n?`
velset=0,0`:""),ut(47)+Le("PosSet","y = 0","time = 0")+Le("VelSet","y = 0","time = 0")+(n?Le("CtrlSet","value=1","time>=3"):"")+st(0,"time >= 3 && (animtime = 0 || !selfanimexist(47))")),nt(100,`type = S
movetype = I
physics = N
ctrl = 1`,ut(100)+Le("VelSet","x = const(velocity.run.fwd.x)")+Le("AssertSpecial",`flag = nowalk
flag2 = noautoturn`)+st(0,'command != "holdfwd"')),nt(105,`type = A
movetype = I
physics = A
ctrl = 0`,ut(105)+Le("VelSet",`x = const(velocity.run.back.x)
y = const(velocity.run.back.y)`,"time = 0")+st(52,"pos y >= 0 && vel y > 0",0)),...[[120,"S",130],[130,"S",130],[131,"C",131],[132,"A",132],[140,"S",130]].map(([e,t,i])=>nt(e,`type = ${t}
movetype = I
physics = ${t}
ctrl = 1${t==="A"?"":`
velset = 0,0`}`,ut(i)+st(t==="A"?50:t==="C"?11:0,'command != "holdback"'))),...[[150,"S",150,151],[152,"C",151,153],[154,"A",152,155]].map(([e,t,i,s])=>nt(e,`type=${t}
movetype=H
physics=N
ctrl=0
velset=0,0`,ut(i)+st(s,"hitshakeover",0))),...[[151,"S",150],[153,"C",151],[155,"A",152]].map(([e,t,i])=>nt(e,`type=${t}
movetype=H
physics=${t==="A"?"N":t}
ctrl=0`,ut(i)+Le("HitVelSet",`x=1
y=1`,"time=0")+Le("CtrlSet","value=1","time>=gethitvar(ctrltime)")+(t==="A"?Le("Gravity","")+st(52,"pos y>=0 && vel y>0",0)+st(132,"time>=gethitvar(ctrltime)"):Le("VelSet","x=0","time>=gethitvar(slidetime)||hitover")+Le("StateTypeSet",`statetype=C
physics=C`,'command="holddown"')+Le("StateTypeSet",`statetype=S
physics=S`,'command!="holddown"')+Le("ChangeState",`value=ifelse(statetype=C,131,130)
ctrl=1`,"hitover")))),...[[5e3,"S","ifelse(gethitvar(groundtype)=2,5010,5000)"],[5010,"C","5020"],[5020,"A","5030"]].map(([e,t,i])=>{const s=`ifelse(gethitvar(animtype)>=3,5030,${n?"ifelse(gethitvar(fall)||gethitvar(yvel)!=0,5030,":""}${i}${n?")":""}+gethitvar(animtype))`;return nt(e,`type=${t}
movetype=H
physics=N
ctrl=0
velset=0,0`,Le("ChangeAnim",`value=${s}`,`time=0 && selfanimexist(${s})`)+Le("ChangeState",`value=${t==="A"?"5030":`ifelse(gethitvar(fall)||gethitvar(yvel)!=0||pos y!=0,5030,${e+1})`}
ctrl=0`,"hitshakeover"))}),...[[5001,"S"],[5011,"C"]].map(([e,t])=>nt(e,`type=${t}
movetype=H
physics=${t}
ctrl=0`,(n?ut("anim"):"")+Le("HitVelSet","x=1","time=0")+Le("VelMul","x=.6","time>=gethitvar(slidetime)")+Le("VelSet","x=0","hitover")+Le("DefenceMulSet","value=1","hitover")+st(0,"hitover"))),...[5030,5035].map(e=>nt(e,`type=A
movetype=H
physics=N
ctrl=0`,(e===5030?Le("HitVelSet",`x=1
y=1`,"time=0"):ut(5035))+Le("VelAdd","y=gethitvar(yaccel)",e===5030?"time>0":"1")+Le("ChangeState",`value=ifelse(gethitvar(fall),5050,5040)
ctrl=0`,"hitover || (vel y>0 && pos y>=0)")+(e===5030?st(5035,"animtime=0",0):Le("ChangeState",`value=ifelse(gethitvar(fall),5050,5040)
ctrl=0`,"animtime=0 || !selfanimexist(5035)")))),nt(5040,`type=A
movetype=H
physics=N
ctrl=1`,ut(5040)+Le("VelAdd","y=gethitvar(yaccel)")+st(5050,"!alive",0)+st(52,"pos y>=0 && vel y>0",0)+st(50,"animtime=0 || !selfanimexist(5040)")),nt(5050,`type=A
movetype=H
physics=N
ctrl=0`,ut(5050)+Le("SelfState","value=5210",'alive && CanRecover && command="recovery"')+st(5100,"pos y>=0 && vel y>0",0)+Le("VelAdd","y=gethitvar(yaccel)")),nt(5070,`type=A
movetype=H
physics=N
ctrl=0
velset=0,0`,ut(5070)+st(5071,"hitshakeover",0)),nt(5071,`type=A
movetype=H
physics=N
ctrl=0`,Le("HitVelSet",`x=1
y=1`,"time=0")+Le("VelAdd","y=gethitvar(yaccel)")+st(5110,"vel y>0 && pos y>=const(movement.air.gethit.trip.groundlevel)",0)),nt(5080,`type=L
movetype=H
physics=N
ctrl=0
velset=0,0`,ut(5080)+st(5030,"hitshakeover && gethitvar(yvel)!=0",0)+st(5081,"hitshakeover && gethitvar(yvel)=0",0)),nt(5081,`type=L
movetype=H
physics=C
ctrl=0`,Le("HitVelSet","x=1","time=0")+Le("VelSet","x=0","hitover")+st(5110,"hitover",0)),nt(5100,`type = L
movetype = H
physics = N
ctrl = 0
velset = 0,0`,Le("PosSet","y = 0")+Le("HitFallDamage","","time=0")+Le("FallEnvShake","","time=0")+ut(5100)+st(5110,"time>=1 && gethitvar(fall.yvel)=0",0)+st(5101,"time>=1 && (animtime=0 || time>=12 || !selfanimexist(5100))",0)),nt(5101,`type=L
movetype=H
physics=N
ctrl=0`,ut(5160)+Le("HitFallVel","","time=0")+Le("PosSet","y=const(movement.down.bounce.offset.y)","time=0")+Le("PosAdd","x=const(movement.down.bounce.offset.x)","time=0")+Le("VelAdd","y=const(movement.down.bounce.yaccel)")+st(5110,"time>0 && vel y>0 && pos y>=const(movement.down.bounce.groundlevel)",0)),nt(5110,`type = L
movetype = H
physics = N
ctrl = 0`,Le("PosSet","y=0","time=0")+Le("VelSet","y=0","time=0")+ut(5110)+st(5150,"!alive",0)+st(5120,"time>=1 && gethitvar(recovertime)<=0",0)),nt(5120,`type = S
movetype = I
physics = S
ctrl = 0`,ut(5120)+Le("SelfState",`value=0
ctrl=1`,"animtime = 0 || !selfanimexist(5120)")),nt(5150,`type = L
movetype = H
physics = N
ctrl = 0
velset = 0,0`,ut(5110)),nt(5210,`type=A
movetype=I
physics=N
ctrl=0`,ut(5210)+Le("PosFreeze","value=1","time<4")+Le("VelMul",n?`x=const(velocity.air.gethit.airrecover.mul.x)
y=const(velocity.air.gethit.airrecover.mul.y)`:`x=.5
y=.2`,"time=4")+Le("VelAdd",n?`x=const(velocity.air.gethit.airrecover.add.x)
y=const(velocity.air.gethit.airrecover.add.y)`:"y=Const240p(-4.5)","time=4")+Le("NotHitBy","value=SCA",n?"time<20":"time<4")+(n?Le("VelAdd","y=const(movement.air.gethit.airrecover.yaccel)","time>=4")+Le("CtrlSet","value=1","time>=20")+st(52,"pos y>=0 && vel y>0",0):st(50,"time>=4")))].join(`
`)}th();function Oa(n=""){if(n=String(n).toUpperCase(),n==="S"||n==="SUB")return{mode:"subtract",source:1,destination:1};if(n==="A"||n==="ADD")return{mode:"add",source:1,destination:1};if(n==="A1"||n==="ADD1")return{mode:"add",source:1,destination:.5};const e=/^AS([\d.]+)D([\d.]+)$/.exec(n);return e?{mode:"add",source:Math.max(0,Math.min(256,+e[1]))/256,destination:Math.max(0,Math.min(256,+e[2]))/256}:{mode:"normal",source:1,destination:0}}function Af(n=0,e=0,t=0){const i=f=>{if(typeof f!="number"||!Number.isFinite(f))throw Error("Sprite angles must be finite numbers.");const u=f%360*Math.PI/180,h=d=>Math.abs(d)<1e-12?0:Math.abs(1-Math.abs(d))<1e-12?Math.sign(d):d;return[h(Math.cos(u)),h(Math.sin(u))]},[s,r]=i(n),[a,o]=i(e),[l,c]=i(t);return{a:l*s,b:o*c*s-a*r,c:l*r,d:a*s+o*c*r}}function Ba(n,e,t=0){var l;const i=n==null?void 0:n.frames[e];if(!i)return null;if(!((l=i.interpolate)!=null&&l.length)||i.ticks<=0)return i;const s=n.frames[e+1]||n.frames[n.loopStart||0];if(!s)return i;const r=Math.max(0,Math.min(1,t/i.ticks)),a={...i},o=(c,f)=>c+(f-c)*r;for(const c of i.interpolate)if(c==="offset"&&(a.x=o(i.x,s.x),a.y=o(i.y,s.y)),c==="scale"&&(a.scaleX=o(i.scaleX??1,s.scaleX??1),a.scaleY=o(i.scaleY??1,s.scaleY??1)),c==="angle"&&(a.angle=o(i.angle||0,s.angle||0)),c==="blend"){const f=Oa(i.blend),u=Oa(s.blend);f.mode==="add"&&u.mode==="add"&&(a.blend=`AS${o(f.source,u.source)*256}D${o(f.destination,u.destination)*256}`)}return a}function ih(n){var r;const e=Ba(n.collisionAnimation??n.animation??((r=n.animations)==null?void 0:r.get(n.anim)),n.collisionFrameIndex??n.frameIndex,n.collisionFrameTime??n.frameTime)??n.collisionFrame??n.currentFrame;if(!e)return null;const t=Kc(n);if(t===n)return e;const i=(a,o)=>{var l,c;return((c=(l=a.program)==null?void 0:l.constants)==null?void 0:c.get(o))??1},s=(a,o)=>{const l=Bt(n)*i(n,o);return l?(e[a]||0)*Bt(t)*i(t,o)/l:0};return{...e,x:s("x","size.xscale"),y:s("y","size.yscale")}}function Cl(n,e,t,i,s,r,a=256){if(!i)return[0];if(!Number.isFinite(t)||t<=0||!Number.isFinite(e)||e<=0)return[];let o=i===1?Math.floor((s-n-e)/t):0,l=i===1?Math.ceil((r-n)/t):Math.max(0,Math.trunc(i)-1);return Math.max(0,l-o+1)>a&&(l=o+a-1),Array.from({length:Math.max(0,l-o+1)},(f,u)=>o+u)}function Pl(n,e,t=0){return n.animated?n.spacing[t]:e+n.spacing[t]}const Rf=(n,e)=>Array.isArray(n)?n.slice(0,3).map((t,i)=>Number(t??e[i])):[...e],Cf=(n,e=0,t=255)=>Math.max(e,Math.min(t,n)),Rn=(n,e={})=>({...e,...n,age:0,remaining:n.time??e.time??1}),Yt=n=>n&&(n.remaining<0||n.remaining>0);function ea(n){n&&(n.age++,n.remaining>0&&n.remaining--)}class Pf{constructor(){this.palettes=new Map,this.afterimages=new Map,this.all=null,this.background=null,this.shake=null,this.environment=null,this.diagnostics=[]}advance({paused:e=()=>!1,backgroundPaused:t=!1}={}){for(const[i,s]of this.palettes)e(i)||ea(s),Yt(s)||this.palettes.delete(i);for(const[i,s]of this.afterimages)e(i)||ea(s),Yt(s)||this.afterimages.delete(i);if(!t)for(const i of[this.all,this.background,this.shake,this.environment])ea(i)}consume(e,{entity:t}={}){for(const i of e||[]){const s=String(i.type).toLowerCase();if(s==="palfx"&&t){const r=cr(t),a=Rn(hr(i));Yt(a)?this.palettes.set(r,a):this.palettes.delete(r)}else if(s==="allpalfx")this.all=Rn(hr(i));else if(s==="bgpalfx")this.background=Rn(hr(i));else if(s==="envshake"){const r=i.coordinateScale??(t==null?void 0:t.coordinateScale)??1;this.shake=Rn(i,{time:0,freq:60,ampl:-4/r,phase:i.freq>=90?90:0,coordinateScale:r})}else if(s==="envcolor")this.environment=Rn(i,{value:[255,255,255],under:0});else if(s==="palettesnapshot"&&i.target)i.target.paletteSnapshot={layers:[],key:"[]"};else if(s==="afterimage"&&t){const r=Rn(i,{time:1,length:20,timegap:1,framegap:4,palcolor:256,palbright:[30,30,30],palcontrast:[120,120,220],palpostbright:[0,0,0],paladd:[10,10,25],palmul:[.65,.65,.75],trans:"none"});r.length=Cf(Math.trunc(r.length),0,60),r.timegap=Math.max(1,Math.trunc(r.timegap)),r.framegap=Math.max(1,Math.trunc(r.framegap)),r.frames=[],Yt(r)&&r.length?this.afterimages.set(t,r):this.afterimages.delete(t)}else if(s==="afterimagetime"&&this.afterimages.has(t)){const r=this.afterimages.get(t);r.remaining=i.time??i.value??0,Yt(r)||this.afterimages.delete(t)}}}capture(e,{paused:t=()=>!1}={}){for(const i of e){const s=this.afterimages.get(i);if(!Yt(s)||t(i)||s.age%s.timegap!==0||s.lastAge===s.age)continue;const r=ih(i);r&&(s.lastAge=s.age,s.frames.unshift({entity:i,frame:{...r},pos:{...i.pos},facing:i.facing,coordinateScale:Bt(i),character:i.character,drawScale:{...i.drawScale},drawOffset:{...i.drawOffset},angle:i.angleDraw?i.angle:0,sizeX:i.constant("size.xscale"),sizeY:i.constant("size.yscale"),paletteRemaps:new Map(i.paletteRemaps)}),s.frames.length=Math.min(s.frames.length,s.length))}}paletteFor(e,{ownpal:t=(e==null?void 0:e.ownPal)??(e==null?void 0:e.ownpal),ignoreLocal:i=!1,includeAll:s=!0}={}){const r=i?null:t?e:cr(e),a=this.palettes.get(r);let o=Yt(a)?[a]:[];return o=[...o,...s&&Yt(this.all)?[this.all]:[]].map(l=>Object.fromEntries(Object.entries(l).map(([c,f])=>[c,Array.isArray(f)?[...f]:f]))),{layers:o,key:JSON.stringify(o.map(({add:l,mul:c,sinadd:f,color:u,invertall:h,age:d})=>({add:l,mul:c,sinadd:f,color:u,invertall:h,age:f?d:0})))}}get backgroundPalette(){const e=[this.background,this.all].filter(Yt);return{layers:e,key:JSON.stringify(e)}}get cameraOffset(){if(!Yt(this.shake))return{x:0,y:0};const e=this.shake;return{x:0,y:-Number(e.ampl)*e.coordinateScale*Math.sin((Number(e.phase)+e.age*Number(e.freq))*Math.PI/180)}}get environmentColor(){return Yt(this.environment)?this.environment:null}trailsFor(e){const t=this.afterimages.get(e);if(!Yt(t))return[];const i=[];for(let s=0;s<t.frames.length;s+=t.framegap){const r=[{color:t.palcolor,invertall:t.palinvertall,add:t.palbright,mul:t.palcontrast,postadd:t.palpostbright}];for(let a=0;a<s;a++)r.push({add:t.paladd,mul:Rf(t.palmul,[1,1,1]).map(o=>o*256)});Yt(this.all)&&r.push(this.all),i.push({...t.frames[s],palette:{layers:r,key:JSON.stringify(r)},trans:t.trans})}return i.reverse()}cleanup(e,{paletteOwners:t=e}={}){const i=new Set(e),s=new Set;for(const r of t){const a=cr(r);a&&s.add(a)}for(const r of this.palettes.keys())s.has(r)||this.palettes.delete(r);for(const r of this.afterimages.keys())i.has(r)||this.afterimages.delete(r)}}const Be=127,Ve=125,Gn=124,If=new Set("time stateno prevstateno anim animtime ctrl life lifemax power powermax facing alive gametime hitpausetime hitshakeover hitover movecontact movehit moveguarded movereversed hitcount uniqhitcount numenemy numpartner numproj roundstate roundno matchno teamside teampower tickspersecond ailevel palno id win lose drawgame inguarddist canrecover roundsexisted hitfall ishometeam winko wintime winperfect loseko losetime loseperfect".split(" ")),Lf=new Set("pos x|pos y|vel x|vel y|p2dist x|p2dist y|p2bodydist x|p2bodydist y|parentdist x|parentdist y|rootdist x|rootdist y|screenpos x|screenpos y|hitvel x|hitvel y|camerapos x|camerapos y|camerazoom|gamewidth|gameheight|screenwidth|screenheight|leftedge|rightedge|topedge|bottomedge|frontedge|backedge|frontedgedist|backedgedist|frontedgebodydist|backedgebodydist".split("|")),Df=new Set("var sysvar animelemtime animelemno animexist selfanimexist numprojid playeridexist projcanceltime projcontacttime projguardedtime projhittime numhelper numexplod numtarget ishelper".split(" ")),Nf=new Set(["fvar","sysfvar","const240p","const480p","const720p"]),Uf=new Set("name authorname p1name p2name p3name p4name statetype movetype physics p2statetype p2movetype teammode".split(" ")),Ff=new Set("xveladd yveladd xoff yoff zoff xvel yvel yaccel fall.xvel fall.yvel fall.envshake.freq fall.envshake.phase".split(" ")),Tr=["sin","cos","tan","asin","acos","atan","exp","ln"],Of=new TextEncoder,vi=n=>{const e=[];do{const t=n&127;n>>>=7,e.push(t|(n?128:0))}while(n);return e},Bf=n=>{n|=0;const e=[];for(;;){const t=n&127;n>>=7;const i=n===0&&!(t&64)||n===-1&&!!(t&64);if(e.push(t|(i?0:128)),i)return e}},ta=n=>{const e=Of.encode(n);return[...vi(e.length),...e]},un=n=>[...vi(n.length),...n.flat()],os=(n,e)=>[n,...vi(e.length),...e],si=n=>[65,...Bf(n)],ka=n=>{const e=new Uint8Array(4);return new DataView(e.buffer).setFloat32(0,n,!0),[67,...e]},ia=[68,0,0,0,0,0,0,0,0],Vn=n=>[16,...vi(n)],ri=n=>[32,...vi(n)],Cn=n=>[33,...vi(n)],ui=(n,e)=>n.type===e?n.code:[...n.code,n.type===Be?e===Ve?178:183:187],Fs=n=>n.type===Be?[...n.code,69,69]:[...n.code,...ka(0),92],ls=n=>[...n,...Vn(2)],ft=(n,e)=>({type:n,code:e});class Ji extends Error{}class cs extends Error{}class kf{constructor(e){this.trigger=e,this.locals=[]}local(e){return this.locals.push(e),this.locals.length-1}read(e,t=[]){const i=Lf.has(e)||Nf.has(e)?Ve:If.has(e)||Df.has(e)?Be:null;if(!i||t.length>2)throw new Ji;const s=[...si(this.trigger(e)),...si(t.length)];for(let r=0;r<2;r++)s.push(...t[r]?ui(this.node(t[r]),Gn):ia);return s.push(...Vn(i===Be?0:1)),ft(i,s)}literal(e,t=Be){return ft(t,[...si(this.trigger(e)),...si(0),...ia,...ia,...Vn(t===Be?0:1)])}node(e){var t;if(e.kind==="number"){if(e.float&&!Number.isFinite(Math.fround(e.value)))throw new Ji;return ft(e.float?Ve:Be,e.float?ka(e.value):si(e.value))}if(e.kind==="name")return e.name==="pi"||e.name==="e"?ft(Ve,ka(e.name==="pi"?Math.PI:Math.E)):this.read(e.name);if(e.kind==="unary"){const i=this.node(e.value);if(e.op==="+")return i;if(e.op==="!")return ft(Be,[...Fs(i),69]);if(e.op==="-")return ft(i.type,i.type===Be?[...si(0),...i.code,107]:[...i.code,140]);if(e.op==="~"&&i.type===Be)return ft(Be,[...i.code,...si(-1),115]);throw new Ji}if(e.kind==="legacyanim")return this.binary(e.op,this.read("animelemtime",[e.element]),this.node(e.time));if(e.kind==="legacytime"){if(e.divisor.value<=0)throw new Ji;return this.binary(e.op,this.binary("%",this.read("time"),this.node(e.divisor)),this.node(e.remainder))}if(e.kind==="range"){const i=[this.node(e.left),this.node(e.low),this.node(e.high)],s=i.some(l=>l.type===Ve)?Ve:Be,r=i.map(()=>this.local(s)),a=[];i.forEach((l,c)=>a.push(...ui(l,s),...Cn(r[c])));const o=l=>ft(s,ri(r[l]));return a.push(...this.binary(e.includeLow?">=":">",o(0),o(1)).code,...this.binary(e.includeHigh?"<=":"<",o(0),o(2)).code,113),e.op==="!="&&a.push(69),ft(Be,a)}if(e.kind==="command"){const i=this.literal({name:"command",args:[e.command]});return e.op==="="?i:ft(Be,[...i.code,69])}if(e.kind==="legacyattribute"){const i=this.literal({name:"hitdefattr",args:e.attributes});return e.op==="="?i:ft(Be,[...i.code,69])}if(e.kind==="binary")return["=","!="].includes(e.op)&&e.left.kind==="name"&&Uf.has(e.left.name)&&e.right.kind==="string"?this.literal({name:e.left.name,match:e.right.value,invert:e.op==="!="}):this.binary(e.op,this.node(e.left),this.node(e.right));if(e.kind==="call"){if(e.name==="cond"){const s=this.node(e.args[0]),r=this.node(e.args[1]),a=this.node(e.args[2]);if(r.type!==a.type)throw new Ji;return ft(r.type,[...Fs(s),4,r.type,...r.code,5,...a.code,11])}if(["const","gethitvar"].includes(e.name)&&["name","string"].includes((t=e.args[0])==null?void 0:t.kind)){const s=e.args[0].name??e.args[0].value,r=e.name==="const"?/^(?:velocity\.|movement\.(?!airjump\.)|size\.[xy]scale$|data\.fall\.defence_mul$)/.test(s)?Ve:Be:Ff.has(s)?Ve:Be;return this.literal({name:e.name,args:[s]},r)}const i=e.args.map(s=>this.node(s));if(e.name==="abs"){const s=i[0];if(s.type===Ve)return ft(Ve,[...s.code,139]);const r=this.local(Be);return ft(Be,[...s.code,...Cn(r),...ri(r),...si(0),72,4,Be,...si(0),...ri(r),107,5,...ri(r),11])}if(e.name==="min"||e.name==="max"){if(i.some(a=>a.type===Ve))return ft(Ve,[...ui(i[0],Ve),...ui(i[1],Ve),e.name==="min"?150:151]);const s=this.local(Be),r=this.local(Be);return ft(Be,[...i[0].code,...Cn(s),...i[1].code,...Cn(r),...ri(s),...ri(r),e.name==="min"?72:74,4,Be,...ri(s),5,...ri(r),11])}return e.name==="ceil"||e.name==="floor"?ft(Be,[...ui(i[0],Ve),e.name==="ceil"?141:142,187,...Vn(3)]):e.name==="sqrt"?ft(Ve,ls([...ui(i[0],Ve),145])):Tr.includes(e.name)?ft(Ve,ls([...ui(i[0],Ve),...Vn(4+Tr.indexOf(e.name))])):e.name==="log"?ft(Ve,ls([...ui(i[0],Ve),...ui(i[1],Ve),...Vn(12)])):this.read(e.name,e.args)}throw new Ji}binary(e,t,i){if(["&&","||","^^"].includes(e))return ft(Be,[...Fs(t),...Fs(i),e==="&&"?113:e==="||"?114:115]);const s=t.type===Ve||i.type===Ve?Ve:Be,r=[...ui(t,s),...ui(i,s)],a={"=":[70,91],"!=":[71,92],"<":[72,93],">":[74,94],"<=":[76,95],">=":[78,96]};if(a[e])return ft(Be,[...r,a[e][+(s===Ve)]]);const o={"+":[106,146],"-":[107,147],"*":[108,148]};if(o[e])return r.push(o[e][+(s===Ve)]),ft(s,s===Ve?ls(r):r);if(e==="/"){if(s===Ve)return ft(Ve,ls([...r,149]));const l=this.local(Be),c=this.local(Be);return ft(Be,[...t.code,...Cn(l),...i.code,...Cn(c),...ri(l),...si(-2147483648),70,...ri(c),...si(-1),70,113,4,Be,...si(-2147483648),5,...ri(l),...ri(c),109,11])}if(s===Be&&["%","&","|","^"].includes(e))return ft(Be,[...r,{"%":111,"&":113,"|":114,"^":115}[e]]);throw new Ji}}function Hf(n){const e=(a,o)=>[96,...un(a.map(l=>[l])),1,o],t=[e([Be,Be,Gn,Gn],Be),e([Be,Be,Gn,Gn],Ve),e([Ve],Ve),e([Gn],Be),e([Ve,Ve],Ve),e([],Be),e([],Ve)],i=[["readInt",0],["readFloat",1],["finite",2],["wrap",3],...Tr.map(a=>[a,2]),["log",4]].map(([a,o])=>[...ta("host"),...ta(a),0,...vi(o)]),s=n.map((a,o)=>[...ta("e"+o),0,...vi(i.length+o)]),r=n.map(a=>{const o=[];for(const c of a.locals){const f=o.at(-1);(f==null?void 0:f[1])===c?f[0]++:o.push([1,c])}const l=[...un(o.map(([c,f])=>[...vi(c),f])),...a.code,11];return[...vi(l.length),...l]});return new Uint8Array([0,97,115,109,1,0,0,0,...os(1,un(t)),...os(2,un(i)),...os(3,un(n.map(a=>vi(a.type===Be?5:6)))),...os(7,un(s)),...os(10,un(r))])}class zf{constructor(e=[],{maxFunctions:t=4096,maxBytes:i=2*1024*1024}={}){if(!Number.isInteger(t)||t<0||t>16384||!Number.isInteger(i)||i<0||i>16*1024*1024)throw RangeError("Invalid numeric compilation budget.");this.context=null,this.entries=new Map,this.triggers=[],this.counts={wasm:0,interpreted:0,deoptimized:0,compiled:0,bytes:0};const s=new Map,r=[],a=[],o=h=>{const d=JSON.stringify(h);return s.has(d)||(s.set(d,this.triggers.length),this.triggers.push(typeof h=="string"?{name:h}:h)),s.get(d)};let l=0;for(const h of new Set(e))if(!(typeof h!="string"||!h.trim()||r.length>=t))try{const d=new kf(o),p=d.node(zc(h));if((l+=p.code.length)>i)break;a.push({source:h,type:p.type}),r.push({...p,locals:d.locals})}catch(d){if(!(d instanceof Ji)&&!(d instanceof dt))throw d}if(!r.length)return;const c=(h,d,p,x,m)=>{if(typeof this.context.resolve!="function")throw new Qi("Trigger resolution is unavailable.");const v=this.triggers[h],M=this.context.resolve(v.name,v.args||(d===0?[]:d===1?[p]:[p,x]),null);let T=M;if(v.match!==void 0)if(M!=null&&M.absent)T=+v.invert;else if(typeof M=="string")T=+(M===v.match!=!!v.invert);else throw new cs;if(typeof M=="boolean")T=+M;else if(M&&typeof M.value=="number"){if(!m&&(M.type==="float"||M.float))throw new cs;T=M.value}if(typeof T!="number")throw new cs;if(!Number.isFinite(T))throw new Lt("Expression produced a non-finite number.");if(!m&&!Number.isInteger(T))throw new cs;if(m){if(T=Math.fround(T),!Number.isFinite(T))throw new Lt("Expression produced a non-finite number.");return T}return T|0},f={readInt:(...h)=>c(...h,!1),readFloat:(...h)=>c(...h,!0),finite:h=>{if(!Number.isFinite(h))throw new Lt("Expression produced a non-finite number.");return h},wrap:h=>h|0};for(const h of Tr)f[h]=Math[h==="ln"?"log":h];f.log=(h,d)=>Math.log(d)/Math.log(h),this.binary=Hf(r);const u=new WebAssembly.Instance(new WebAssembly.Module(this.binary),{host:f});a.forEach((h,d)=>this.entries.set(h.source,{...h,run:u.exports["e"+d]})),this.counts.compiled=this.entries.size,this.counts.bytes=this.binary.length}evaluate(e,t={}){const i=this.entries.get(e);if(!i)return this.counts.interpreted++,(t.typedResult?Na:Da)(e,t);const s=this.context;this.context=t;try{const r=i.run();return this.counts.wasm++,t.typedResult?{value:r,float:i.type===Ve}:r}catch(r){if(r instanceof cs)return this.entries.delete(e),this.counts.deoptimized++,(t.typedResult?Na:Da)(e,t);throw r instanceof WebAssembly.RuntimeError?new Lt("Invalid numeric operation.",e):r instanceof dt?(r.source||(r.source=e),r):r!=null&&r.bottom?new Lt(r.message,e):new dt((r==null?void 0:r.message)||"Trigger evaluation failed.",e)}finally{this.context=s}}get stats(){return{...this.counts,activeFunctions:this.entries.size}}}const Il=th({orderedPhases:!0});function Gf(n){const e=new Set;for(const t of n)for(const i of t.states.values())for(const s of[i,...i.controllers])for(const r of s.entries){e.add(r.value);try{for(const a of gn(r.value))e.add(a)}catch{}}return e}const Vf=(n,e)=>{const t={entity:e};for(const[i,s]of Object.entries(n))(s===null||["number","string","boolean"].includes(typeof s)||Array.isArray(s))&&(t[i]=s);return t},Os=(n,e,t=0)=>{try{return n.constant(e)}catch{return t}};class Wf{constructor(e,t={}){this.files=e,this.selection=t,this.characters=mu(e);const i=this.characters.find(o=>o.path===t.character)||this.characters[0],s=this.characters.find(o=>o.path===t.opponent)||i;if(!i||!s)throw Error("No playable character definition found.");const r=new Map([...new Set([i,s])].map(o=>[o,Qc(o,{commonText:Il,constantDefaults:{"movement.stand.friction.threshold":1}})]));this.expressions=new zf(Gf(r.values())),this.commands=[i,s].map(o=>{var c;const l=(c=o.checks.find(f=>f.key==="cmd"&&f.ok))==null?void 0:c.path;return new _s(Fo(l?wn(e[l]):""))});const a=t.stage&&t.stage!=="builtin/grid"?lf(e).find(o=>o.path===t.stage):null;if(a!=null&&a.invalid)throw Error("Stage definition could not be parsed.");this.match=new Tf(i,{opponentCharacter:s,commonText:Il,programs:r,manageInputs:!0,orderedPhases:!0,expressionEvaluator:(o,l)=>this.expressions.evaluate(o,l),stage:a,playerPalette:t.palette||1,opponentPalette:t.opponentPalette||2,skipIntro:t.mode==="training",playerAILevel:t.mode==="cpu"?t.level||4:0,opponentAILevel:["solo","cpu"].includes(t.mode)?t.level||4:0,rules:t.mode==="training"?null:{roundsToWin:2,preIntro:0,introHold:30}}),this.commands=[this.match.inputBuffers.get(this.match.player),this.match.inputBuffers.get(this.match.opponent)],this.effects=new Pf,this.banks=new Map,this.indices=new Map,this.bankIds=new Map,this.spriteMetadata=new Map,this.sent=new Set,this.assets=[],this.events=[],this.sparks=[],this.issues=new Map,this.closed=!1,this.capabilities={format:"kenjatime-core-coverage-v1",engine:"Kenjatime Core",independentRuntime:!0,universalCompatibility:!1,compiledNumericExpressions:!0,scriptInterpreter:!0,knownGaps:["Extended scripting languages","3D model stages and model shadows","Video background composition","Stage parallax and window clipping","Afterimage palette chains beyond eight layers","Full native moveset parity not yet established"]}}issue(e,t){const i=e+":"+t;this.issues.size<2e3&&this.issues.set(i,{type:e,message:t})}tick(e=new Set,t=new Set){if(this.closed)throw Error("Match is closed.");const i=this.match,s=r=>i.isFrozen(r)||r.hitPauseTime>0;this.effects.advance({paused:s}),i.tick(new Set,new Set,{playerInput:e,opponentInput:t}),this.commands=[i.inputBuffers.get(i.player),i.inputBuffers.get(i.opponent)];for(const r of i.eventEntities){this.effects.consume(r.events,{entity:r});for(const a of r.events)["playsnd","stopsnd","sndpan"].includes(a.type)&&this.events.push({...Vf(a,r.id),character:r.character.path})}for(const r of i.presentationEvents)this.effects.consume([r],{entity:r.entity||r.owner});for(const r of i.events)this.sparks.push({x:r.x,y:r.y,age:0,guarded:r.guarded});return this.sparks=this.sparks.filter(r=>++r.age<12),this.sparks.length>256&&this.sparks.splice(0,this.sparks.length-256),this.effects.capture([...i.entities,...i.drawProjectiles],{paused:s}),this.effects.cleanup(i.entities),this}bank(e){var t;if(!this.banks.has(e)){const i=(t=e.def)!=null&&t.files?Bc(e):Fc(e.files[e.sprite.path]);this.banks.set(e,i),this.bankIds.set(e,this.banks.size),this.indices.set(e,new Map(i.sprites.map((s,r)=>[s.group+","+s.number,r])))}return this.banks.get(e)}asset(e,t,i){var s,r;try{const a=this.bank(e),o=this.indices.get(e).get(t.group+","+t.number);if(o===void 0)return null;const l=this.bankIds.get(e),c=l+":"+o;let f=this.spriteMetadata.get(c);if(!f){const m=((s=a.decodeIndexed)==null?void 0:s.call(a,o))||a.decode(o),v=!!m.indices;f={w:m.w,h:m.h,x:m.x||0,y:m.y||0,palette:m.palette,indexed:v,colors:m.colors},this.assets.push({id:c,width:f.w,height:f.h,indexed:v,pixels:new Uint8Array(v?m.indices:m.rgba)}),this.sent.add(c),this.spriteMetadata.set(c,f),a.clearDecodedCache()}const u=f.indexed,h=a.sprites[o],d=(r=a.palettes)==null?void 0:r.find(m=>m.index===(f.palette??h.palette));let p=d?[d.group,d.number]:[1,1];p=(i==null?void 0:i.get(p.join(",")))||(i==null?void 0:i.get("*"))||p;const x=l+":pal:"+p.join(",");if(u&&!this.sent.has(x)){let m;try{m=a.paletteColors(...p)}catch{if(m=f.colors,!m)throw Error("Sprite palette is missing.");this.issue("palette","Requested palette "+p.join(",")+" is unavailable.")}const v=new Uint8Array(1024);v.set(m.subarray(0,1024)),this.assets.push({id:x,width:256,height:1,pixels:v,indexed:!1}),this.sent.add(x)}return{id:c,paletteId:x,indexed:u,w:f.w,h:f.h,x:f.x||0,y:f.y||0}}catch(a){return this.issue("sprite",a.message),null}}quad(e,t,i,{x:s=0,y:r=0,sx:a=1,sy:o=1,facing:l=1,angle:c=0,xangle:f=0,yangle:u=0,remaps:h=null,palette:d=null,trans:p=null,mask:x=!0,alpha:m=1,clip:v=null,corners:M=null}={}){var O,N,C;if(!i||e.length>=8192)return;const T=this.asset(t,i,h);if(!T)return;a*=l;const E=Af((i.angle||0)+c,f,u),w=(i.flip||"").includes("H")?-1:1,y=(i.flip||"").includes("V")?-1:1,g=a*w*(i.scaleX??1)*E.a,_=o*y*(i.scaleY??1)*E.b,L=a*w*(i.scaleX??1)*E.c,R=o*y*(i.scaleY??1)*E.d;if(![g,_,L,R,s,r,m].every(Number.isFinite)){this.issue("render-transform","A non-finite sprite transform was skipped.");return}((O=d==null?void 0:d.layers)==null?void 0:O.length)>8&&this.issue("palette-limit","This preview can render eight palette layers per sprite.");let A=i.blend||"";return typeof p=="string"?A=p:p&&p.mode!=="default"&&(A=p.mode==="sub"?"S":p.mode==="none"?"":p.mode==="add1"?"A1":`AS${((N=p.alpha)==null?void 0:N[0])??256}D${((C=p.alpha)==null?void 0:C[1])??256}`),e.push({texture:T.id,palette:T.paletteId,indexed:T.indexed,width:T.w,height:T.h,matrix:[g,_,L,R,s+(i.x||0)*a-g*T.x-L*T.y,r+(i.y||0)*o-_*T.x-R*T.y],blend:Oa(A),mask:x,alpha:m,palFX:(d==null?void 0:d.layers)||[],clip:v,corners:M}),T}frame(){var h,d,p,x,m,v,M,T,E,w;const e=this.match,t=e.view,i=Math.min(960/320,540/(t.displayHeight||240)),s=((h=e.stage)==null?void 0:h.camera)||{x:0,y:0,zoom:1},r=(540-(t.displayHeight||240)*i)/2+(t.groundY||200)*i,a=i*s.zoom,o=[];this.assets=[];const l=y=>({x:480+(y.x-s.x)*a,y:r+(y.y-s.y)*a}),c=y=>{const g=e.stage;if(!(g!=null&&g.definition.sprite))return;const _=g.definition,L=_.coordinateScale*(_.backgroundScale||1);for(const[R,A]of g.elements.entries()){if(A.layer!==y||!A.enabled||!A.visible||A.type==="dummy")continue;const O=A.animated?Ba(g.animations.get(A.anim),A.drawFrameIndex??A.frameIndex,A.drawFrameTime??A.frameTime):g.frame(A),N=g.position(R);if(!O)continue;const C=this.asset(_,O);if(!C)continue;const k=1+(s.zoom-1)*A.zoomDelta,B=L*i*k*_.xscale*(A.scaleStart[0]+s.y/L*A.scaleDelta[0]),H=L*i*k*_.yscale*(A.scaleStart[1]+s.y/L*A.scaleDelta[1]),P=480+(N.x*L-s.x*N.delta[0])*a,I=r+(N.y*L-(t.zoffset||0)-s.y*N.delta[1])*a,z=Pl(A,C.w)*Math.abs(B),$=Pl(A,C.h,1)*Math.abs(H),te=Cl(P-C.x*B,C.w*Math.abs(B),z,A.tile[0],0,960),se=Cl(I-C.y*H,C.h*Math.abs(H),$,A.tile[1],0,540);for(const q of se)for(const ne of te){if(o.length>=8192){this.issue("resource-limit","Visible quad budget exceeded.");break}this.quad(o,_,O,{x:P+ne*z,y:I+q*$,sx:B,sy:H,mask:A.mask,trans:A.transSpecified?{mode:A.trans,alpha:A.alpha}:null,palette:this.effects.backgroundPalette})}A.type==="parallax"&&this.issue("stage","Parallax perspective is pending; this preview uses the authored base scale.")}};c(0);const f=[];for(const y of[...e.renderEntities,...e.drawProjectiles]){!y.destroyed&&!y.asserted.has("invisible")&&f.push({priority:y.sprPriority||0,actor:y});for(const g of y.drawExplods||[])f.push({priority:g.ontop?1e3:g.sprpriority||0,actor:y,effect:g})}f.sort((y,g)=>y.priority-g.priority);for(const{actor:y,effect:g}of f){if(g){if(g.common){this.issue("common-effects","Character requested an unavailable shared effect animation.");continue}const L=g.space==="screen"?{x:g.pos.x*i,y:g.pos.y*i}:l(g.pos),R=(g.coordinateScale??Bt(y))*a;this.quad(o,y.character,Ba(g.animation,g.frameIndex,g.frameTime),{...L,sx:R*(((d=g.scale)==null?void 0:d[0])??1),sy:R*(((p=g.scale)==null?void 0:p[1])??1)*(g.vfacing||1),facing:g.facing,angle:g.angle||0,xangle:g.xangle||0,yangle:g.yangle||0,remaps:g.ownpal?g.paletteRemaps:y.paletteRemaps,palette:this.effects.paletteFor(g.source||y),trans:g.trans});continue}for(const L of this.effects.trailsFor(y)){const R=l({x:L.pos.x+(((x=L.drawOffset)==null?void 0:x.x)||0),y:L.pos.y+(((m=L.drawOffset)==null?void 0:m.y)||0)}),A=a*L.coordinateScale;this.quad(o,L.character,L.frame,{...R,sx:A*L.sizeX*(L.drawScale.x??1),sy:A*L.sizeY*(L.drawScale.y??1),facing:L.facing,angle:L.angle,remaps:L.paletteRemaps,palette:L.palette,trans:L.trans})}const _=l({x:y.pos.x+(((v=y.drawOffset)==null?void 0:v.x)||0)+Os(y,"size.draw.offset.x")*Bt(y)*y.facing,y:y.pos.y+(((M=y.drawOffset)==null?void 0:M.y)||0)+Os(y,"size.draw.offset.y")*Bt(y)});this.quad(o,y.character,ih(y),{..._,sx:a*Bt(y)*Os(y,"size.xscale",1)*(((T=y.drawScale)==null?void 0:T.x)??1),sy:a*Bt(y)*Os(y,"size.yscale",1)*(((E=y.drawScale)==null?void 0:E.y)??1),facing:y.facing,angle:y.angleDraw?y.angle:0,remaps:y.paletteRemaps,palette:this.effects.paletteFor(y),trans:y.trans})}c(1);const u=this.sparks.map(y=>({...l(y),age:y.age,guarded:y.guarded}));return{width:960,height:540,draws:o,assets:this.assets,sparks:u,ground:r,grid:!e.stage,players:[e.player,e.opponent].map(y=>({id:y.id,name:y.name,x:y.pos.x,y:y.pos.y,life:y.life,maxLife:y.maxLife,power:y.power,maxPower:y.maxPower,state:y.stateNo,time:y.time,anim:y.anim})),ticks:e.ticks,roundState:((w=e.roundFlow)==null?void 0:w.roundState)??2,paused:!1,expressions:this.expressions.stats}}snapshot(){var e;return{engine:"Kenjatime Core",players:[this.match.player,this.match.opponent].map(t=>({id:t.id,name:t.name,x:t.pos.x,y:t.pos.y,life:t.life,maxLife:t.maxLife,power:t.power,maxPower:t.maxPower,state:t.stateNo,time:t.time,anim:t.anim})),ticks:this.match.ticks,roundState:((e=this.match.roundFlow)==null?void 0:e.roundState)??2,expressions:this.expressions.stats,capabilities:this.capabilities,diagnostics:[...this.match.diagnostics,...this.issues.values()]}}drainEvents(){const e=this.events;return this.events=[],e}close(){this.closed=!0;for(const e of this.banks.values())e.clearDecodedCache();this.banks.clear(),this.sent.clear(),this.events=[]}}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Bo="187",Xf=0,Ll=1,qf=2,mr=1,$f=2,ms=3,_n=0,$t=1,xi=2,Kn=0,ys=1,Dl=2,Nl=3,Ul=4,nh=5,Bi=100,Yf=101,sh=102,Kf=103,Zf=104,Jf=200,Ha=201,jf=202,Qf=203,rh=204,Ar=205,ed=206,td=207,id=208,nd=209,sd=210,rd=211,ad=212,od=213,ld=214,za=0,Ga=1,Va=2,Ss=3,Wa=4,Xa=5,qa=6,$a=7,ah=0,cd=1,hd=2,Hi=0,oh=1,lh=2,ch=3,hh=4,uh=5,fh=6,dh=7,ph=300,jn=301,Ms=302,na=303,sa=304,Ya=1e3,Ai=1001,Ka=1002,Pt=1003,ud=1004,Bs=1005,qt=1006,ra=1007,nn=1008,jt=1009,mh=1010,gh=1011,ws=1012,ko=1013,Pi=1014,Ri=1015,Ii=1016,Ho=1017,zo=1018,Qn=1020,vh=35902,xh=35899,_h=1021,yh=1022,yi=1023,rn=1026,sn=1027,Go=1028,Vo=1029,yn=1030,Wo=1031,Xo=1033,gr=33776,vr=33777,xr=33778,_r=33779,Za=35840,Ja=35841,ja=35842,Qa=35843,eo=36196,to=37492,io=37496,no=37488,so=37489,Rr=37490,ro=37491,ao=37808,oo=37809,lo=37810,co=37811,ho=37812,uo=37813,fo=37814,po=37815,mo=37816,go=37817,vo=37818,xo=37819,_o=37820,yo=37821,So=36492,Mo=36494,wo=36495,bo=36283,Eo=36284,Cr=36285,To=36286,fd=3200,Fl=0,dd=1,en="",oi="srgb",bs="srgb-linear",Pr="linear",ot="srgb",aa=7680,pd=519,md=512,gd=513,vd=514,Sh=515,xd=516,_d=517,Mh=518,wh=519,yd=35044,Ir="300 es",Si=2e3,Lr=2001;function Sd(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Dr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Md(){const n=Dr("canvas");return n.style.display="block",n}const Ol={};function Bl(...n){const e="THREE."+n.shift();console.log(e,...n)}function bh(n){const e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Ne(...n){n=bh(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function et(...n){n=bh(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function yr(...n){const e=n.join(" ");e in Ol||(Ol[e]=!0,Ne(...n))}function wd(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}const bd={[za]:za,[Va]:qa,[Wa]:Wa,[Ss]:Xa,[Ga]:Ga,[qa]:Va,[$a]:$a,[Xa]:Ss};class bn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Ft=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],oa=Math.PI/180,Ao=180/Math.PI;function Ts(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Ft[n&255]+Ft[n>>8&255]+Ft[n>>16&255]+Ft[n>>24&255]+"-"+Ft[e&255]+Ft[e>>8&255]+"-"+Ft[e>>16&15|64]+Ft[e>>24&255]+"-"+Ft[t&63|128]+Ft[t>>8&255]+"-"+Ft[t>>16&255]+Ft[t>>24&255]+Ft[i&255]+Ft[i>>8&255]+Ft[i>>16&255]+Ft[i>>24&255]).toLowerCase()}function Ye(n,e,t){return Math.max(e,Math.min(t,n))}function Ed(n,e){return(n%e+e)%e}function la(n,e,t){return(1-t)*n+t*e}function Td(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function qo(n){switch(n.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function Ad(n,e){if(e.constructor===Float32Array)return n;const t=qo(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(n/t,-1)}function Rd(n,e){if(e.constructor===Float32Array)return n;const t=qo(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(n*t)}const Jo=class Jo{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ye(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ye(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Jo.prototype.isVector2=!0;let tt=Jo;class is{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let l=i[s+0],c=i[s+1],f=i[s+2],u=i[s+3],h=r[a+0],d=r[a+1],p=r[a+2],x=r[a+3];if(u!==x||l!==h||c!==d||f!==p){let m=l*h+c*d+f*p+u*x;m<0&&(h=-h,d=-d,p=-p,x=-x,m=-m);let v=1-o;if(m<.9995){const M=Math.acos(m),T=Math.sin(M);v=Math.sin(v*M)/T,o=Math.sin(o*M)/T,l=l*v+h*o,c=c*v+d*o,f=f*v+p*o,u=u*v+x*o}else{l=l*v+h*o,c=c*v+d*o,f=f*v+p*o,u=u*v+x*o;const M=1/Math.sqrt(l*l+c*c+f*f+u*u);l*=M,c*=M,f*=M,u*=M}}e[t]=l,e[t+1]=c,e[t+2]=f,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,s,r,a){const o=i[s],l=i[s+1],c=i[s+2],f=i[s+3],u=r[a],h=r[a+1],d=r[a+2],p=r[a+3];return e[t]=o*p+f*u+l*d-c*h,e[t+1]=l*p+f*h+c*u-o*d,e[t+2]=c*p+f*d+o*h-l*u,e[t+3]=f*p-o*u-l*h-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),f=o(s/2),u=o(r/2),h=l(i/2),d=l(s/2),p=l(r/2);switch(a){case"XYZ":this._x=h*f*u+c*d*p,this._y=c*d*u-h*f*p,this._z=c*f*p+h*d*u,this._w=c*f*u-h*d*p;break;case"YXZ":this._x=h*f*u+c*d*p,this._y=c*d*u-h*f*p,this._z=c*f*p-h*d*u,this._w=c*f*u+h*d*p;break;case"ZXY":this._x=h*f*u-c*d*p,this._y=c*d*u+h*f*p,this._z=c*f*p+h*d*u,this._w=c*f*u-h*d*p;break;case"ZYX":this._x=h*f*u-c*d*p,this._y=c*d*u+h*f*p,this._z=c*f*p-h*d*u,this._w=c*f*u+h*d*p;break;case"YZX":this._x=h*f*u+c*d*p,this._y=c*d*u+h*f*p,this._z=c*f*p-h*d*u,this._w=c*f*u-h*d*p;break;case"XZY":this._x=h*f*u-c*d*p,this._y=c*d*u-h*f*p,this._z=c*f*p+h*d*u,this._w=c*f*u+h*d*p;break;default:Ne("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],f=t[6],u=t[10],h=i+o+u;if(h>0){const d=.5/Math.sqrt(h+1);this._w=.25/d,this._x=(f-l)*d,this._y=(r-c)*d,this._z=(a-s)*d}else if(i>o&&i>u){const d=2*Math.sqrt(1+i-o-u);this._w=(f-l)/d,this._x=.25*d,this._y=(s+a)/d,this._z=(r+c)/d}else if(o>u){const d=2*Math.sqrt(1+o-i-u);this._w=(r-c)/d,this._x=(s+a)/d,this._y=.25*d,this._z=(l+f)/d}else{const d=2*Math.sqrt(1+u-i-o);this._w=(a-s)/d,this._x=(r+c)/d,this._y=(l+f)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ye(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,f=t._w;return this._x=i*f+a*o+s*c-r*l,this._y=s*f+a*l+r*o-i*c,this._z=r*f+a*c+i*l-s*o,this._w=a*f-i*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let i=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),f=Math.sin(c);l=Math.sin(l*c)/f,t=Math.sin(t*c)/f,this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const jo=class jo{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(kl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(kl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*i),f=2*(o*t-r*s),u=2*(r*i-a*t);return this.x=t+l*c+a*u-o*f,this.y=i+l*f+o*c-r*u,this.z=s+l*u+r*f-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this.z=Ye(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this.z=Ye(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ye(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-i*l,this.z=i*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return ca.copy(this).projectOnVector(e),this.sub(ca)}reflect(e){return this.sub(ca.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ye(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};jo.prototype.isVector3=!0;let K=jo;const ca=new K,kl=new is,Qo=class Qo{constructor(e,t,i,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c)}set(e,t,i,s,r,a,o,l,c){const f=this.elements;return f[0]=e,f[1]=s,f[2]=o,f[3]=t,f[4]=r,f[5]=l,f[6]=i,f[7]=a,f[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],f=i[4],u=i[7],h=i[2],d=i[5],p=i[8],x=s[0],m=s[3],v=s[6],M=s[1],T=s[4],E=s[7],w=s[2],y=s[5],g=s[8];return r[0]=a*x+o*M+l*w,r[3]=a*m+o*T+l*y,r[6]=a*v+o*E+l*g,r[1]=c*x+f*M+u*w,r[4]=c*m+f*T+u*y,r[7]=c*v+f*E+u*g,r[2]=h*x+d*M+p*w,r[5]=h*m+d*T+p*y,r[8]=h*v+d*E+p*g,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],f=e[8];return t*a*f-t*o*c-i*r*f+i*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],f=e[8],u=f*a-o*c,h=o*l-f*r,d=c*r-a*l,p=t*u+i*h+s*d;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/p;return e[0]=u*x,e[1]=(s*c-f*i)*x,e[2]=(o*i-s*a)*x,e[3]=h*x,e[4]=(f*t-s*l)*x,e[5]=(s*r-o*t)*x,e[6]=d*x,e[7]=(i*l-c*t)*x,e[8]=(a*t-i*r)*x,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return yr("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(ha.makeScale(e,t)),this}rotate(e){return yr("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(ha.makeRotation(-e)),this}translate(e,t){return yr("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(ha.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Qo.prototype.isMatrix3=!0;let Fe=Qo;const ha=new Fe,Hl=new Fe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),zl=new Fe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Cd(){const n={enabled:!0,workingColorSpace:bs,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ot&&(s.r=zi(s.r),s.g=zi(s.g),s.b=zi(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ot&&(s.r=Zn(s.r),s.g=Zn(s.g),s.b=Zn(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===en?Pr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[a].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[bs]:{primaries:e,whitePoint:i,transfer:Pr,toXYZ:Hl,fromXYZ:zl,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:oi},outputColorSpaceConfig:{drawingBufferColorSpace:oi}},[oi]:{primaries:e,whitePoint:i,transfer:ot,toXYZ:Hl,fromXYZ:zl,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:oi}}}),n}const $e=Cd();function zi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Zn(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Pn;class Pd{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Pn===void 0&&(Pn=Dr("canvas")),Pn.width=e.width,Pn.height=e.height;const s=Pn.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=Pn}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Dr("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=zi(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(zi(t[i]/255)*255):t[i]=zi(t[i]);return{data:t,width:e.width,height:e.height}}else return Ne("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Id=0;class $o{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Id++}),this.uuid=Ts(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width||0,t.height||0,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(ua(s[a].image)):r.push(ua(s[a]))}else r=ua(s);i.url=r}return t||(e.images[this.uuid]=i),i}}function ua(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Pd.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Ne("Texture: Unable to serialize Texture."),{})}let Ld=0;const fa=new K;class Vt extends bn{constructor(e=Vt.DEFAULT_IMAGE,t=Vt.DEFAULT_MAPPING,i=Ai,s=Ai,r=qt,a=nn,o=yi,l=jt,c=Vt.DEFAULT_ANISOTROPY,f=en){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ld++}),this.uuid=Ts(),this.name="",this.source=new $o(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new tt(0,0),this.repeat=new tt(1,1),this.center=new tt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Fe,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=f,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(fa).x}get height(){return this.source.getSize(fa).y}get depth(){return this.source.getSize(fa).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){Ne(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ne(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==ph)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ya:e.x=e.x-Math.floor(e.x);break;case Ai:e.x=e.x<0?0:1;break;case Ka:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ya:e.y=e.y-Math.floor(e.y);break;case Ai:e.y=e.y<0?0:1;break;case Ka:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Vt.DEFAULT_IMAGE=null;Vt.DEFAULT_MAPPING=ph;Vt.DEFAULT_ANISOTROPY=1;const el=class el{constructor(e=0,t=0,i=0,s=1){this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r;const l=e.elements,c=l[0],f=l[4],u=l[8],h=l[1],d=l[5],p=l[9],x=l[2],m=l[6],v=l[10];if(Math.abs(f-h)<.01&&Math.abs(u-x)<.01&&Math.abs(p-m)<.01){if(Math.abs(f+h)<.1&&Math.abs(u+x)<.1&&Math.abs(p+m)<.1&&Math.abs(c+d+v-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const T=(c+1)/2,E=(d+1)/2,w=(v+1)/2,y=(f+h)/4,g=(u+x)/4,_=(p+m)/4;return T>E&&T>w?T<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(T),s=y/i,r=g/i):E>w?E<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(E),i=y/s,r=_/s):w<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),i=g/r,s=_/r),this.set(i,s,r,t),this}let M=Math.sqrt((m-p)*(m-p)+(u-x)*(u-x)+(h-f)*(h-f));return Math.abs(M)<.001&&(M=1),this.x=(m-p)/M,this.y=(u-x)/M,this.z=(h-f)/M,this.w=Math.acos((c+d+v-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this.z=Ye(this.z,e.z,t.z),this.w=Ye(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this.z=Ye(this.z,e,t),this.w=Ye(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ye(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};el.prototype.isVector4=!0;let _t=el;class Dd extends bn{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:qt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new _t(0,0,e,t),this.scissorTest=!1,this.viewport=new _t(0,0,e,t),this.textures=[];const s=i.count;for(let r=0;r<s;r++)this.textures[r]=new Vt({width:e,height:t,depth:i.depth}),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:qt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new $o(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ci extends Dd{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Eh extends Vt{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Pt,this.minFilter=Pt,this.wrapR=Ai,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Nd extends Vt{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Pt,this.minFilter=Pt,this.wrapR=Ai,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}const Fr=class Fr{constructor(e,t,i,s,r,a,o,l,c,f,u,h,d,p,x,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c,f,u,h,d,p,x,m)}set(e,t,i,s,r,a,o,l,c,f,u,h,d,p,x,m){const v=this.elements;return v[0]=e,v[4]=t,v[8]=i,v[12]=s,v[1]=r,v[5]=a,v[9]=o,v[13]=l,v[2]=c,v[6]=f,v[10]=u,v[14]=h,v[3]=d,v[7]=p,v[11]=x,v[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Fr().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,i=e.elements,s=1/In.setFromMatrixColumn(e,0).length(),r=1/In.setFromMatrixColumn(e,1).length(),a=1/In.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),f=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const h=a*f,d=a*u,p=o*f,x=o*u;t[0]=l*f,t[4]=-l*u,t[8]=c,t[1]=d+p*c,t[5]=h-x*c,t[9]=-o*l,t[2]=x-h*c,t[6]=p+d*c,t[10]=a*l}else if(e.order==="YXZ"){const h=l*f,d=l*u,p=c*f,x=c*u;t[0]=h+x*o,t[4]=p*o-d,t[8]=a*c,t[1]=a*u,t[5]=a*f,t[9]=-o,t[2]=d*o-p,t[6]=x+h*o,t[10]=a*l}else if(e.order==="ZXY"){const h=l*f,d=l*u,p=c*f,x=c*u;t[0]=h-x*o,t[4]=-a*u,t[8]=p+d*o,t[1]=d+p*o,t[5]=a*f,t[9]=x-h*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const h=a*f,d=a*u,p=o*f,x=o*u;t[0]=l*f,t[4]=p*c-d,t[8]=h*c+x,t[1]=l*u,t[5]=x*c+h,t[9]=d*c-p,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const h=a*l,d=a*c,p=o*l,x=o*c;t[0]=l*f,t[4]=x-h*u,t[8]=p*u+d,t[1]=u,t[5]=a*f,t[9]=-o*f,t[2]=-c*f,t[6]=d*u+p,t[10]=h-x*u}else if(e.order==="XZY"){const h=a*l,d=a*c,p=o*l,x=o*c;t[0]=l*f,t[4]=-u,t[8]=c*f,t[1]=h*u+x,t[5]=a*f,t[9]=d*u-p,t[2]=p*u-d,t[6]=o*f,t[10]=x*u+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Ud,e,Fd)}lookAt(e,t,i){const s=this.elements;return Kt.subVectors(e,t),Kt.lengthSq()===0&&(Kt.z=1),Kt.normalize(),qi.crossVectors(i,Kt),qi.lengthSq()===0&&(Math.abs(i.z)===1?Kt.x+=1e-4:Kt.z+=1e-4,Kt.normalize(),qi.crossVectors(i,Kt)),qi.normalize(),ks.crossVectors(Kt,qi),s[0]=qi.x,s[4]=ks.x,s[8]=Kt.x,s[1]=qi.y,s[5]=ks.y,s[9]=Kt.y,s[2]=qi.z,s[6]=ks.z,s[10]=Kt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],f=i[1],u=i[5],h=i[9],d=i[13],p=i[2],x=i[6],m=i[10],v=i[14],M=i[3],T=i[7],E=i[11],w=i[15],y=s[0],g=s[4],_=s[8],L=s[12],R=s[1],A=s[5],O=s[9],N=s[13],C=s[2],k=s[6],B=s[10],H=s[14],P=s[3],I=s[7],z=s[11],$=s[15];return r[0]=a*y+o*R+l*C+c*P,r[4]=a*g+o*A+l*k+c*I,r[8]=a*_+o*O+l*B+c*z,r[12]=a*L+o*N+l*H+c*$,r[1]=f*y+u*R+h*C+d*P,r[5]=f*g+u*A+h*k+d*I,r[9]=f*_+u*O+h*B+d*z,r[13]=f*L+u*N+h*H+d*$,r[2]=p*y+x*R+m*C+v*P,r[6]=p*g+x*A+m*k+v*I,r[10]=p*_+x*O+m*B+v*z,r[14]=p*L+x*N+m*H+v*$,r[3]=M*y+T*R+E*C+w*P,r[7]=M*g+T*A+E*k+w*I,r[11]=M*_+T*O+E*B+w*z,r[15]=M*L+T*N+E*H+w*$,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],f=e[2],u=e[6],h=e[10],d=e[14],p=e[3],x=e[7],m=e[11],v=e[15],M=l*d-c*h,T=o*d-c*u,E=o*h-l*u,w=a*d-c*f,y=a*h-l*f,g=a*u-o*f;return t*(x*M-m*T+v*E)-i*(p*M-m*w+v*y)+s*(p*T-x*w+v*g)-r*(p*E-x*y+m*g)}determinantAffine(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],f=e[10];return t*(a*f-o*c)-i*(r*f-o*l)+s*(r*c-a*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],f=e[8],u=e[9],h=e[10],d=e[11],p=e[12],x=e[13],m=e[14],v=e[15],M=t*o-i*a,T=t*l-s*a,E=t*c-r*a,w=i*l-s*o,y=i*c-r*o,g=s*c-r*l,_=f*x-u*p,L=f*m-h*p,R=f*v-d*p,A=u*m-h*x,O=u*v-d*x,N=h*v-d*m,C=M*N-T*O+E*A+w*R-y*L+g*_;if(C===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const k=1/C;return e[0]=(o*N-l*O+c*A)*k,e[1]=(s*O-i*N-r*A)*k,e[2]=(x*g-m*y+v*w)*k,e[3]=(h*y-u*g-d*w)*k,e[4]=(l*R-a*N-c*L)*k,e[5]=(t*N-s*R+r*L)*k,e[6]=(m*E-p*g-v*T)*k,e[7]=(f*g-h*E+d*T)*k,e[8]=(a*O-o*R+c*_)*k,e[9]=(i*R-t*O-r*_)*k,e[10]=(p*y-x*E+v*M)*k,e[11]=(u*E-f*y-d*M)*k,e[12]=(o*L-a*A-l*_)*k,e[13]=(t*A-i*L+s*_)*k,e[14]=(x*T-p*w-m*M)*k,e[15]=(f*w-u*T+h*M)*k,this}scale(e){const t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,l=e.z,c=r*a,f=r*o;return this.set(c*a+i,c*o-s*l,c*l+s*o,0,c*o+s*l,f*o+i,f*l-s*a,0,c*l-s*o,f*l+s*a,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,f=a+a,u=o+o,h=r*c,d=r*f,p=r*u,x=a*f,m=a*u,v=o*u,M=l*c,T=l*f,E=l*u,w=i.x,y=i.y,g=i.z;return s[0]=(1-(x+v))*w,s[1]=(d+E)*w,s[2]=(p-T)*w,s[3]=0,s[4]=(d-E)*y,s[5]=(1-(h+v))*y,s[6]=(m+M)*y,s[7]=0,s[8]=(p+T)*g,s[9]=(m-M)*g,s[10]=(1-(h+x))*g,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinantAffine();if(r===0)return i.set(1,1,1),t.identity(),this;let a=In.set(s[0],s[1],s[2]).length();const o=In.set(s[4],s[5],s[6]).length(),l=In.set(s[8],s[9],s[10]).length();r<0&&(a=-a),fi.copy(this);const c=1/a,f=1/o,u=1/l;return fi.elements[0]*=c,fi.elements[1]*=c,fi.elements[2]*=c,fi.elements[4]*=f,fi.elements[5]*=f,fi.elements[6]*=f,fi.elements[8]*=u,fi.elements[9]*=u,fi.elements[10]*=u,t.setFromRotationMatrix(fi),i.x=a,i.y=o,i.z=l,this}makePerspective(e,t,i,s,r,a,o=Si,l=!1){const c=this.elements,f=2*r/(t-e),u=2*r/(i-s),h=(t+e)/(t-e),d=(i+s)/(i-s);let p,x;if(l)p=r/(a-r),x=a*r/(a-r);else if(o===Si)p=-(a+r)/(a-r),x=-2*a*r/(a-r);else if(o===Lr)p=-a/(a-r),x=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=f,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=u,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=Si,l=!1){const c=this.elements,f=2/(t-e),u=2/(i-s),h=-(t+e)/(t-e),d=-(i+s)/(i-s);let p,x;if(l)p=1/(a-r),x=a/(a-r);else if(o===Si)p=-2/(a-r),x=-(a+r)/(a-r);else if(o===Lr)p=-1/(a-r),x=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=f,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=u,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=p,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};Fr.prototype.isMatrix4=!0;let yt=Fr;const In=new K,fi=new yt,Ud=new K(0,0,0),Fd=new K(1,1,1),qi=new K,ks=new K,Kt=new K,Gl=new yt,Vl=new is;class Sn{constructor(e=0,t=0,i=0,s=Sn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],f=s[9],u=s[2],h=s[6],d=s[10];switch(t){case"XYZ":this._y=Math.asin(Ye(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-f,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ye(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ye(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ye(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(h,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Ye(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-f,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-Ye(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-f,d),this._y=0);break;default:Ne("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Gl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Gl,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Vl.setFromEuler(this),this.setFromQuaternion(Vl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Sn.DEFAULT_ORDER="XYZ";class Th{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Od=0;const Wl=new K,Ln=new is,Di=new yt,Hs=new K,hs=new K,Bd=new K,kd=new is,Xl=new K(1,0,0),ql=new K(0,1,0),$l=new K(0,0,1),Yl={type:"added"},Hd={type:"removed"},Dn={type:"childadded",child:null},da={type:"childremoved",child:null};class Qt extends bn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Od++}),this.uuid=Ts(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Qt.DEFAULT_UP.clone();const e=new K,t=new Sn,i=new is,s=new K(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new yt},normalMatrix:{value:new Fe}}),this.matrix=new yt,this.matrixWorld=new yt,this.matrixAutoUpdate=Qt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Qt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Th,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ln.setFromAxisAngle(e,t),this.quaternion.multiply(Ln),this}rotateOnWorldAxis(e,t){return Ln.setFromAxisAngle(e,t),this.quaternion.premultiply(Ln),this}rotateX(e){return this.rotateOnAxis(Xl,e)}rotateY(e){return this.rotateOnAxis(ql,e)}rotateZ(e){return this.rotateOnAxis($l,e)}translateOnAxis(e,t){return Wl.copy(e).applyQuaternion(this.quaternion),this.position.add(Wl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Xl,e)}translateY(e){return this.translateOnAxis(ql,e)}translateZ(e){return this.translateOnAxis($l,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Di.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Hs.copy(e):Hs.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),hs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Di.lookAt(hs,Hs,this.up):Di.lookAt(Hs,hs,this.up),this.quaternion.setFromRotationMatrix(Di),s&&(Di.extractRotation(s.matrixWorld),Ln.setFromRotationMatrix(Di),this.quaternion.premultiply(Ln.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(et("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Yl),Dn.child=e,this.dispatchEvent(Dn),Dn.child=null):et("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Hd),da.child=e,this.dispatchEvent(da),da.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Di.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Di.multiply(e.parent.matrixWorld)),e.applyMatrix4(Di),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Yl),Dn.child=e,this.dispatchEvent(Dn),Dn.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(hs,e,Bd),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(hs,kd,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*i-r[8]*s,r[13]+=i-r[1]*t-r[5]*i-r[9]*s,r[14]+=s-r[2]*t-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,i)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,f=l.length;c<f;c++){const u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),f=a(e.images),u=a(e.shapes),h=a(e.skeletons),d=a(e.animations),p=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),f.length>0&&(i.images=f),u.length>0&&(i.shapes=u),h.length>0&&(i.skeletons=h),d.length>0&&(i.animations=d),p.length>0&&(i.nodes=p)}return i.object=s,i;function a(o){const l=[];for(const c in o){const f=o[c];delete f.metadata,l.push(f)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}Qt.DEFAULT_UP=new K(0,1,0);Qt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Qt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class zs extends Qt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const zd={type:"move"};class pa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new zs,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new zs,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new K,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new K),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new zs,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new K,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new K,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const x of e.hand.values()){const m=t.getJointPose(x,i),v=this._getHandJoint(c,x);m!==null&&(v.matrix.fromArray(m.transform.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale),v.matrixWorldNeedsUpdate=!0,v.jointRadius=m.radius),v.visible=m!==null}const f=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],h=f.position.distanceTo(u.position),d=.02,p=.005;c.inputState.pinching&&h>d+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=d-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.quaternion,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(zd)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new zs;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const Ah={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},$i={h:0,s:0,l:0},Gs={h:0,s:0,l:0};function ma(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class rt{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=oi){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,$e.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=$e.workingColorSpace){return this.r=e,this.g=t,this.b=i,$e.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=$e.workingColorSpace){if(e=Ed(e,1),t=Ye(t,0,1),i=Ye(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=ma(a,r,e+1/3),this.g=ma(a,r,e),this.b=ma(a,r,e-1/3)}return $e.colorSpaceToWorking(this,s),this}setStyle(e,t=oi){function i(r){r!==void 0&&parseFloat(r)<1&&Ne("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,t);break;case"hsl":case"hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ne("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Ne("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=oi){const i=Ah[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Ne("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=zi(e.r),this.g=zi(e.g),this.b=zi(e.b),this}copyLinearToSRGB(e){return this.r=Zn(e.r),this.g=Zn(e.g),this.b=Zn(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=oi){return $e.workingToColorSpace(Ot.copy(this),e),Math.round(Ye(Ot.r*255,0,255))*65536+Math.round(Ye(Ot.g*255,0,255))*256+Math.round(Ye(Ot.b*255,0,255))}getHexString(e=oi){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=$e.workingColorSpace){$e.workingToColorSpace(Ot.copy(this),t);const i=Ot.r,s=Ot.g,r=Ot.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let l,c;const f=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=f<=.5?u/(a+o):u/(2-a-o),a){case i:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-i)/u+2;break;case r:l=(i-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=f,e}getRGB(e,t=$e.workingColorSpace){return $e.workingToColorSpace(Ot.copy(this),t),e.r=Ot.r,e.g=Ot.g,e.b=Ot.b,e}getStyle(e=oi){$e.workingToColorSpace(Ot.copy(this),e);const t=Ot.r,i=Ot.g,s=Ot.b;return e!==oi?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL($i),this.setHSL($i.h+e,$i.s+t,$i.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL($i),e.getHSL(Gs);const i=la($i.h,Gs.h,t),s=la($i.s,Gs.s,t),r=la($i.l,Gs.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ot=new rt;rt.NAMES=Ah;class Gd extends Qt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Sn,this.environmentIntensity=1,this.environmentRotation=new Sn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background!==null?e.background.clone():null,this.environment=e.environment!==null?e.environment.clone():null,this.fog=e.fog!==null?e.fog.clone():null,this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial!==null?e.overrideMaterial.clone():null,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}const di=new K,Ni=new K,ga=new K,Ui=new K,Nn=new K,Un=new K,Kl=new K,va=new K,xa=new K,_a=new K,ya=new _t,Sa=new _t,Ma=new _t;class _i{constructor(e=new K,t=new K,i=new K){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),di.subVectors(e,t),s.cross(di);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){di.subVectors(s,t),Ni.subVectors(i,t),ga.subVectors(e,t);const a=di.dot(di),o=di.dot(Ni),l=di.dot(ga),c=Ni.dot(Ni),f=Ni.dot(ga),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;const h=1/u,d=(c*l-o*f)*h,p=(a*f-o*l)*h;return r.set(1-d-p,p,d)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Ui)===null?!1:Ui.x>=0&&Ui.y>=0&&Ui.x+Ui.y<=1}static getInterpolation(e,t,i,s,r,a,o,l){return this.getBarycoord(e,t,i,s,Ui)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Ui.x),l.addScaledVector(a,Ui.y),l.addScaledVector(o,Ui.z),l)}static getInterpolatedAttribute(e,t,i,s,r,a){return ya.setScalar(0),Sa.setScalar(0),Ma.setScalar(0),ya.fromBufferAttribute(e,t),Sa.fromBufferAttribute(e,i),Ma.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(ya,r.x),a.addScaledVector(Sa,r.y),a.addScaledVector(Ma,r.z),a}static isFrontFacing(e,t,i,s){return di.subVectors(i,t),Ni.subVectors(e,t),di.cross(Ni).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return di.subVectors(this.c,this.b),Ni.subVectors(this.a,this.b),di.cross(Ni).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return _i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return _i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return _i.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return _i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return _i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,r=this.c;let a,o;Nn.subVectors(s,i),Un.subVectors(r,i),va.subVectors(e,i);const l=Nn.dot(va),c=Un.dot(va);if(l<=0&&c<=0)return t.copy(i);xa.subVectors(e,s);const f=Nn.dot(xa),u=Un.dot(xa);if(f>=0&&u<=f)return t.copy(s);const h=l*u-f*c;if(h<=0&&l>=0&&f<=0&&l-f>0)return a=l/(l-f),t.copy(i).addScaledVector(Nn,a);_a.subVectors(e,r);const d=Nn.dot(_a),p=Un.dot(_a);if(p>=0&&d<=p)return t.copy(r);const x=d*c-l*p;if(x<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(i).addScaledVector(Un,o);const m=f*p-d*u;if(m<=0&&u-f>=0&&d-p>=0)return Kl.subVectors(r,s),o=(u-f)/(u-f+(d-p)),t.copy(s).addScaledVector(Kl,o);const v=1/(m+x+h);return a=x*v,o=h*v,t.copy(i).addScaledVector(Nn,a).addScaledVector(Un,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class As{constructor(e=new K(1/0,1/0,1/0),t=new K(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(pi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(pi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=pi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,pi):pi.fromBufferAttribute(r,a),pi.applyMatrix4(e.matrixWorld),this.expandByPoint(pi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Vs.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Vs.copy(i.boundingBox)),Vs.applyMatrix4(e.matrixWorld),this.union(Vs)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,pi),pi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(us),Ws.subVectors(this.max,us),Fn.subVectors(e.a,us),On.subVectors(e.b,us),Bn.subVectors(e.c,us),Yi.subVectors(On,Fn),Ki.subVectors(Bn,On),fn.subVectors(Fn,Bn);let t=[0,-Yi.z,Yi.y,0,-Ki.z,Ki.y,0,-fn.z,fn.y,Yi.z,0,-Yi.x,Ki.z,0,-Ki.x,fn.z,0,-fn.x,-Yi.y,Yi.x,0,-Ki.y,Ki.x,0,-fn.y,fn.x,0];return!wa(t,Fn,On,Bn,Ws)||(t=[1,0,0,0,1,0,0,0,1],!wa(t,Fn,On,Bn,Ws))?!1:(Xs.crossVectors(Yi,Ki),t=[Xs.x,Xs.y,Xs.z],wa(t,Fn,On,Bn,Ws))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,pi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(pi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Fi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Fi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Fi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Fi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Fi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Fi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Fi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Fi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Fi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Fi=[new K,new K,new K,new K,new K,new K,new K,new K],pi=new K,Vs=new As,Fn=new K,On=new K,Bn=new K,Yi=new K,Ki=new K,fn=new K,us=new K,Ws=new K,Xs=new K,dn=new K;function wa(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){dn.fromArray(n,r);const o=s.x*Math.abs(dn.x)+s.y*Math.abs(dn.y)+s.z*Math.abs(dn.z),l=e.dot(dn),c=t.dot(dn),f=i.dot(dn);if(Math.max(-Math.max(l,c,f),Math.min(l,c,f))>o)return!1}return!0}const Mt=new K,qs=new tt;let Vd=0;class xn extends bn{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Vd++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=yd,this.updateRanges=[],this.gpuType=Ri,this.version=0,this._normalizationScale=e!==void 0?qo(e):void 0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)qs.fromBufferAttribute(this,t),qs.applyMatrix3(e),this.setXY(t,qs.x,qs.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Mt.fromBufferAttribute(this,t),Mt.applyMatrix3(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Mt.fromBufferAttribute(this,t),Mt.applyMatrix4(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Mt.fromBufferAttribute(this,t),Mt.applyNormalMatrix(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Mt.fromBufferAttribute(this,t),Mt.transformDirection(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=this._denormalize(i)),i}setComponent(e,t,i){return this.normalized&&(i=this._normalize(i)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i),s=this._normalize(s)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i),s=this._normalize(s),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(e){const t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):Ad(e,this.array)}_normalize(e){const t=this._normalizationScale;return t!==void 0?Math.round(e*t):Rd(e,this.array)}}class Rh extends xn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Ch extends xn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class Mi extends xn{constructor(e,t,i){super(new Float32Array(e),t,i)}}const Wd=new As,fs=new K,ba=new K;class Yo{constructor(e=new K,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Wd.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;fs.subVectors(e,this.center);const t=fs.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(fs,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ba.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(fs.copy(e.center).add(ba)),this.expandByPoint(fs.copy(e.center).sub(ba))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let Xd=0;const ai=new yt,Ea=new Qt,kn=new K,Zt=new As,ds=new As,Ct=new K;class an extends bn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Xd++}),this.uuid=Ts(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Sd(e)?Ch:Rh)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new Fe().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return ai.makeRotationFromQuaternion(e),this.applyMatrix4(ai),this}rotateX(e){return ai.makeRotationX(e),this.applyMatrix4(ai),this}rotateY(e){return ai.makeRotationY(e),this.applyMatrix4(ai),this}rotateZ(e){return ai.makeRotationZ(e),this.applyMatrix4(ai),this}translate(e,t,i){return ai.makeTranslation(e,t,i),this.applyMatrix4(ai),this}scale(e,t,i){return ai.makeScale(e,t,i),this.applyMatrix4(ai),this}lookAt(e){return Ea.lookAt(e),Ea.updateMatrix(),this.applyMatrix4(Ea.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(kn).negate(),this.translate(kn.x,kn.y,kn.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Mi(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Ne("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new As);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){et("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new K(-1/0,-1/0,-1/0),new K(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const r=t[i];Zt.setFromBufferAttribute(r),this.morphTargetsRelative?(Ct.addVectors(this.boundingBox.min,Zt.min),this.boundingBox.expandByPoint(Ct),Ct.addVectors(this.boundingBox.max,Zt.max),this.boundingBox.expandByPoint(Ct)):(this.boundingBox.expandByPoint(Zt.min),this.boundingBox.expandByPoint(Zt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&et('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Yo);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){et("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new K,1/0);return}if(e){const i=this.boundingSphere.center;if(Zt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];ds.setFromBufferAttribute(o),this.morphTargetsRelative?(Ct.addVectors(Zt.min,ds.min),Zt.expandByPoint(Ct),Ct.addVectors(Zt.max,ds.max),Zt.expandByPoint(Ct)):(Zt.expandByPoint(ds.min),Zt.expandByPoint(ds.max))}Zt.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)Ct.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(Ct));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,f=o.count;c<f;c++)Ct.fromBufferAttribute(o,c),l&&(kn.fromBufferAttribute(e,c),Ct.add(kn)),s=Math.max(s,i.distanceToSquared(Ct))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&et('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){et("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,r=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==i.count)&&(a=new xn(new Float32Array(4*i.count),4),this.setAttribute("tangent",a));const o=[],l=[],c=new Uint8Array(i.count);for(let L=0;L<i.count;L++)o[L]=new K,l[L]=new K;const f=new K,u=new K,h=new K,d=new tt,p=new tt,x=new tt,m=new K,v=new K;function M(L,R,A){c[L]=c[R]=c[A]=1,f.fromBufferAttribute(i,L),u.fromBufferAttribute(i,R),h.fromBufferAttribute(i,A),d.fromBufferAttribute(r,L),p.fromBufferAttribute(r,R),x.fromBufferAttribute(r,A),u.sub(f),h.sub(f),p.sub(d),x.sub(d);const O=1/(p.x*x.y-x.x*p.y);isFinite(O)&&(m.copy(u).multiplyScalar(x.y).addScaledVector(h,-p.y).multiplyScalar(O),v.copy(h).multiplyScalar(p.x).addScaledVector(u,-x.x).multiplyScalar(O),o[L].add(m),o[R].add(m),o[A].add(m),l[L].add(v),l[R].add(v),l[A].add(v))}let T=this.groups;T.length===0&&(T=[{start:0,count:e.count}]);for(let L=0,R=T.length;L<R;++L){const A=T[L],O=A.start,N=A.count;for(let C=O,k=O+N;C<k;C+=3)M(e.getX(C+0),e.getX(C+1),e.getX(C+2))}const E=new K,w=new K,y=new K,g=new K;function _(L){y.fromBufferAttribute(s,L),g.copy(y);const R=o[L];E.copy(R),E.sub(y.multiplyScalar(y.dot(R))).normalize(),w.crossVectors(g,R);const O=w.dot(l[L])<0?-1:1;a.setXYZW(L,E.x,E.y,E.z,O)}for(let L=0,R=i.count;L<R;++L)c[L]&&_(L);this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new xn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let h=0,d=i.count;h<d;h++)i.setXYZ(h,0,0,0);const s=new K,r=new K,a=new K,o=new K,l=new K,c=new K,f=new K,u=new K;if(e)for(let h=0,d=e.count;h<d;h+=3){const p=e.getX(h+0),x=e.getX(h+1),m=e.getX(h+2);s.fromBufferAttribute(t,p),r.fromBufferAttribute(t,x),a.fromBufferAttribute(t,m),f.subVectors(a,r),u.subVectors(s,r),f.cross(u),o.fromBufferAttribute(i,p),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,m),o.add(f),l.add(f),c.add(f),i.setXYZ(p,o.x,o.y,o.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,d=t.count;h<d;h+=3)s.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),a.fromBufferAttribute(t,h+2),f.subVectors(a,r),u.subVectors(s,r),f.cross(u),i.setXYZ(h+0,f.x,f.y,f.z),i.setXYZ(h+1,f.x,f.y,f.z),i.setXYZ(h+2,f.x,f.y,f.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Ct.fromBufferAttribute(e,t),Ct.normalize(),e.setXYZ(t,Ct.x,Ct.y,Ct.z)}toNonIndexed(){function e(o,l){const c=o.array,f=o.itemSize,u=o.normalized,h=new c.constructor(l.length*f);let d=0,p=0;for(let x=0,m=l.length;x<m;x++){o.isInterleavedBufferAttribute?d=l[x]*o.data.stride+o.offset:d=l[x]*f;for(let v=0;v<f;v++)h[p++]=c[d++]}return new xn(h,f,u)}if(this.index===null)return Ne("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new an,i=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,i);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let f=0,u=c.length;f<u;f++){const h=c[f],d=e(h,i);l.push(d)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],f=[];for(let u=0,h=c.length;u<h;u++){const d=c[u];f.push(d.toJSON(e.data))}f.length>0&&(s[l]=f,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const c in s){const f=s[c];this.setAttribute(c,f.clone(t))}const r=e.morphAttributes;for(const c in r){const f=[],u=r[c];for(let h=0,d=u.length;h<d;h++)f.push(u[h].clone(t));this.morphAttributes[c]=f}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,f=a.length;c<f;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ta=new K,qd=new K,$d=new Fe;class ji{constructor(e=new K(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=Ta.subVectors(i,t).cross(qd.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const s=e.delta(Ta),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return i===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||$d.getNormalMatrix(e),s=this.coplanarPoint(Ta).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let Yd=0;class Br extends bn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Yd++}),this.uuid=Ts(),this.name="",this.type="Material",this.blending=ys,this.side=_n,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=rh,this.blendDst=Ar,this.blendEquation=Bi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new rt(0,0,0),this.blendAlpha=0,this.depthFunc=Ss,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=pd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=aa,this.stencilZFail=aa,this.stencilZPass=aa,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){Ne(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ne(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(i.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(i.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(i.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(i.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new rt().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new ji().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new tt().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new tt().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Oi=new K,Aa=new K,$s=new K,Ys=new K;class Kd{constructor(e=new K,t=new K(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Oi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Oi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Oi.copy(this.origin).addScaledVector(this.direction,t),Oi.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Aa.copy(e).add(t).multiplyScalar(.5),$s.copy(t).sub(e).normalize(),Ys.copy(this.origin).sub(Aa);const r=e.distanceTo(t)*.5,a=-this.direction.dot($s),o=Ys.dot(this.direction),l=-Ys.dot($s),c=Ys.lengthSq(),f=Math.abs(1-a*a);let u,h,d,p;if(f>0)if(u=a*l-o,h=a*o-l,p=r*f,u>=0)if(h>=-p)if(h<=p){const x=1/f;u*=x,h*=x,d=u*(u+a*h+2*o)+h*(a*u+h+2*l)+c}else h=r,u=Math.max(0,-(a*h+o)),d=-u*u+h*(h+2*l)+c;else h=-r,u=Math.max(0,-(a*h+o)),d=-u*u+h*(h+2*l)+c;else h<=-p?(u=Math.max(0,-(-a*r+o)),h=u>0?-r:Math.min(Math.max(-r,-l),r),d=-u*u+h*(h+2*l)+c):h<=p?(u=0,h=Math.min(Math.max(-r,-l),r),d=h*(h+2*l)+c):(u=Math.max(0,-(a*r+o)),h=u>0?r:Math.min(Math.max(-r,-l),r),d=-u*u+h*(h+2*l)+c);else h=a>0?-r:r,u=Math.max(0,-(a*h+o)),d=-u*u+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Aa).addScaledVector($s,h),d}intersectSphere(e,t){if(e.radius<0)return null;Oi.subVectors(e.center,this.origin);const i=Oi.dot(this.direction),s=Oi.dot(Oi)-i*i,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,l;const c=1/this.direction.x,f=1/this.direction.y,u=1/this.direction.z,h=this.origin;return c>=0?(i=(e.min.x-h.x)*c,s=(e.max.x-h.x)*c):(i=(e.max.x-h.x)*c,s=(e.min.x-h.x)*c),f>=0?(r=(e.min.y-h.y)*f,a=(e.max.y-h.y)*f):(r=(e.max.y-h.y)*f,a=(e.min.y-h.y)*f),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-h.z)*u,l=(e.max.z-h.z)*u):(o=(e.max.z-h.z)*u,l=(e.min.z-h.z)*u),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Oi)!==null}intersectTriangle(e,t,i,s,r){const a=this.origin,o=this.direction,l=o.x,c=o.y,f=o.z,u=e.x-a.x,h=e.y-a.y,d=e.z-a.z,p=t.x-a.x,x=t.y-a.y,m=t.z-a.z,v=i.x-a.x,M=i.y-a.y,T=i.z-a.z,E=Math.abs(l),w=Math.abs(c),y=Math.abs(f);let g,_,L,R,A,O,N,C,k,B,H,P;if(E>=w&&E>=y?(L=l,O=u,k=p,P=v,l>=0?(g=c,_=f,R=h,A=d,N=x,C=m,B=M,H=T):(g=f,_=c,R=d,A=h,N=m,C=x,B=T,H=M)):w>=y?(L=c,O=h,k=x,P=M,c>=0?(g=f,_=l,R=d,A=u,N=m,C=p,B=T,H=v):(g=l,_=f,R=u,A=d,N=p,C=m,B=v,H=T)):(L=f,O=d,k=m,P=T,f>=0?(g=l,_=c,R=u,A=h,N=p,C=x,B=v,H=M):(g=c,_=l,R=h,A=u,N=x,C=p,B=M,H=v)),L===0)return null;const I=g/L,z=_/L,$=1/L,te=R-I*O,se=A-z*O,q=N-I*k,ne=C-z*k,fe=B-I*P,we=H-z*P,de=fe*ne-we*q,Pe=te*we-se*fe,je=q*se-ne*te;if(s){if(de<0||Pe<0||je<0)return null}else if((de<0||Pe<0||je<0)&&(de>0||Pe>0||je>0))return null;const Te=de+Pe+je;if(Te===0)return null;const qe=$*(de*O+Pe*k+je*P);return(Te>0?qe<0:qe>0)?null:this.at(qe/Te,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Zd extends Br{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new rt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Sn,this.combine=ah,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Zl=new yt,pn=new Kd,Ks=new Yo,Jl=new K,Zs=new K,Js=new K,js=new K,Ra=new K,Qs=new K,jl=new K,er=new K;class Gi extends Qt{constructor(e=new an,t=new Zd){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Qs.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const f=o[l],u=r[l];f!==0&&(Ra.fromBufferAttribute(u,e),a?Qs.addScaledVector(Ra,f):Qs.addScaledVector(Ra.sub(t),f))}t.add(Qs)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ks.copy(i.boundingSphere),Ks.applyMatrix4(r),pn.copy(e.ray).recast(e.near),!(Ks.containsPoint(pn.origin)===!1&&(pn.intersectSphere(Ks,Jl)===null||pn.origin.distanceToSquared(Jl)>(e.far-e.near)**2))&&(Zl.copy(r).invert(),pn.copy(e.ray).applyMatrix4(Zl),!(i.boundingBox!==null&&pn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,pn)))}_computeIntersections(e,t,i){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,f=r.attributes.uv1,u=r.attributes.normal,h=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,x=h.length;p<x;p++){const m=h[p],v=a[m.materialIndex],M=Math.max(m.start,d.start),T=Math.min(o.count,Math.min(m.start+m.count,d.start+d.count));for(let E=M,w=T;E<w;E+=3){const y=o.getX(E),g=o.getX(E+1),_=o.getX(E+2);s=tr(this,v,e,i,c,f,u,y,g,_),s&&(s.faceIndex=Math.floor(E/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const p=Math.max(0,d.start),x=Math.min(o.count,d.start+d.count);for(let m=p,v=x;m<v;m+=3){const M=o.getX(m),T=o.getX(m+1),E=o.getX(m+2);s=tr(this,a,e,i,c,f,u,M,T,E),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let p=0,x=h.length;p<x;p++){const m=h[p],v=a[m.materialIndex],M=Math.max(m.start,d.start),T=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let E=M,w=T;E<w;E+=3){const y=E,g=E+1,_=E+2;s=tr(this,v,e,i,c,f,u,y,g,_),s&&(s.faceIndex=Math.floor(E/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const p=Math.max(0,d.start),x=Math.min(l.count,d.start+d.count);for(let m=p,v=x;m<v;m+=3){const M=m,T=m+1,E=m+2;s=tr(this,a,e,i,c,f,u,M,T,E),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function Jd(n,e,t,i,s,r,a,o){let l;if(e.side===$t?l=i.intersectTriangle(a,r,s,!0,o):l=i.intersectTriangle(s,r,a,e.side===_n,o),l===null)return null;er.copy(o),er.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(er);return c<t.near||c>t.far?null:{distance:c,point:er.clone(),object:n}}function tr(n,e,t,i,s,r,a,o,l,c){n.getVertexPosition(o,Zs),n.getVertexPosition(l,Js),n.getVertexPosition(c,js);const f=Jd(n,e,t,i,Zs,Js,js,jl);if(f){const u=new K;_i.getBarycoord(jl,Zs,Js,js,u),s&&(f.uv=_i.getInterpolatedAttribute(s,o,l,c,u,new tt)),r&&(f.uv1=_i.getInterpolatedAttribute(r,o,l,c,u,new tt)),a&&(f.normal=_i.getInterpolatedAttribute(a,o,l,c,u,new K),f.normal.dot(i.direction)>0&&f.normal.multiplyScalar(-1));const h={a:o,b:l,c,normal:new K,materialIndex:0};_i.getNormal(Zs,Js,js,h.normal),f.face=h,f.barycoord=u}return f}class Ph extends Vt{constructor(e=null,t=1,i=1,s,r,a,o,l,c=Pt,f=Pt,u,h){super(null,a,o,l,c,f,s,r,u,h),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const mn=new Yo,jd=new tt(.5,.5),ir=new K;class Nr{constructor(e=new ji,t=new ji,i=new ji,s=new ji,r=new ji,a=new ji){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Si,i=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],f=r[4],u=r[5],h=r[6],d=r[7],p=r[8],x=r[9],m=r[10],v=r[11],M=r[12],T=r[13],E=r[14],w=r[15];if(s[0].setComponents(c-a,d-f,v-p,w-M).normalize(),s[1].setComponents(c+a,d+f,v+p,w+M).normalize(),s[2].setComponents(c+o,d+u,v+x,w+T).normalize(),s[3].setComponents(c-o,d-u,v-x,w-T).normalize(),i)s[4].setComponents(l,h,m,E).normalize(),s[5].setComponents(c-l,d-h,v-m,w-E).normalize();else if(s[4].setComponents(c-l,d-h,v-m,w-E).normalize(),t===Si)s[5].setComponents(c+l,d+h,v+m,w+E).normalize();else if(t===Lr)s[5].setComponents(l,h,m,E).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),mn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),mn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(mn)}intersectsSprite(e){mn.center.set(0,0,0);const t=jd.distanceTo(e.center);return mn.radius=.7071067811865476+t,mn.applyMatrix4(e.matrixWorld),this.intersectsSphere(mn)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(ir.x=s.normal.x>0?e.max.x:e.min.x,ir.y=s.normal.y>0?e.max.y:e.min.y,ir.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(ir)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}const Ql=new yt;class Ko{constructor(){this.coordinateSystem=Si,this._frustums=[],this._count=0}setFromArrayCamera(e){const t=e.cameras,i=this._frustums;for(let s=0;s<t.length;s++){const r=t[s];Ql.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),i[s]===void 0&&(i[s]=new Nr),i[s].setFromProjectionMatrix(Ql,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsObject(e))return!0;return!1}intersectsSprite(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsSprite(e))return!0;return!1}intersectsSphere(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsSphere(e))return!0;return!1}intersectsBox(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsBox(e))return!0;return!1}containsPoint(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;const t=this._frustums,i=e._frustums;for(let s=0;s<e._count;s++)t[s]===void 0&&(t[s]=new Nr),t[s].copy(i[s]);return this._count=e._count,this}clone(){return new Ko().copy(this)}}class Ih extends Vt{constructor(e=[],t=jn,i,s,r,a,o,l,c,f){super(e,t,i,s,r,a,o,l,c,f),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class es extends Vt{constructor(e,t,i=Pi,s,r,a,o=Pt,l=Pt,c,f=rn,u=1){if(f!==rn&&f!==sn)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const h={width:e,height:t,depth:u};super(h,s,r,a,o,l,f,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new $o(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class Lh extends es{constructor(e,t=Pi,i=jn,s,r,a=Pt,o=Pt,l,c=rn){const f={width:e,height:e,depth:1},u=[f,f,f,f,f,f];super(e,e,t,i,s,r,a,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Dh extends Vt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Rs extends an{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],f=[],u=[];let h=0,d=0;p("z","y","x",-1,-1,i,t,e,a,r,0),p("z","y","x",1,-1,i,t,-e,a,r,1),p("x","z","y",1,1,e,i,t,s,a,2),p("x","z","y",1,-1,e,i,-t,s,a,3),p("x","y","z",1,-1,e,t,i,s,r,4),p("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new Mi(c,3)),this.setAttribute("normal",new Mi(f,3)),this.setAttribute("uv",new Mi(u,2));function p(x,m,v,M,T,E,w,y,g,_,L){const R=E/g,A=w/_,O=E/2,N=w/2,C=y/2,k=g+1,B=_+1;let H=0,P=0;const I=new K;for(let z=0;z<B;z++){const $=z*A-N;for(let te=0;te<k;te++){const se=te*R-O;I[x]=se*M,I[m]=$*T,I[v]=C,c.push(I.x,I.y,I.z),I[x]=0,I[m]=0,I[v]=y>0?1:-1,f.push(I.x,I.y,I.z),u.push(te/g),u.push(1-z/_),H+=1}}for(let z=0;z<_;z++)for(let $=0;$<g;$++){const te=h+$+k*z,se=h+$+k*(z+1),q=h+($+1)+k*(z+1),ne=h+($+1)+k*z;l.push(te,se,ne),l.push(se,q,ne),P+=6}o.addGroup(d,P,L),d+=P,h+=H}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Rs(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class kr extends an{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(i),l=Math.floor(s),c=o+1,f=l+1,u=e/o,h=t/l,d=[],p=[],x=[],m=[];for(let v=0;v<f;v++){const M=v*h-a;for(let T=0;T<c;T++){const E=T*u-r;p.push(E,-M,0),x.push(0,0,1),m.push(T/o),m.push(1-v/l)}}for(let v=0;v<l;v++)for(let M=0;M<o;M++){const T=M+c*v,E=M+c*(v+1),w=M+1+c*(v+1),y=M+1+c*v;d.push(T,E,y),d.push(E,w,y)}this.setIndex(d),this.setAttribute("position",new Mi(p,3)),this.setAttribute("normal",new Mi(x,3)),this.setAttribute("uv",new Mi(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new kr(e.width,e.height,e.widthSegments,e.heightSegments)}}function ts(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];if(ec(s))s.isRenderTargetTexture?(Ne("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone();else if(Array.isArray(s))if(ec(s[0])){const r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][i]=r}else e[t][i]=s.slice();else e[t][i]=s}}return e}function Gt(n){const e={};for(let t=0;t<n.length;t++){const i=ts(n[t]);for(const s in i)e[s]=i[s]}return e}function ec(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function Qd(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Nh(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:$e.workingColorSpace}const ep={clone:ts,merge:Gt};var tp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ip=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Mn extends Br{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=tp,this.fragmentShader=ip,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ts(e.uniforms),this.uniformsGroups=Qd(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const i in e.uniforms){const s=e.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=t[s.value]||null;break;case"c":this.uniforms[i].value=new rt().setHex(s.value);break;case"v2":this.uniforms[i].value=new tt().fromArray(s.value);break;case"v3":this.uniforms[i].value=new K().fromArray(s.value);break;case"v4":this.uniforms[i].value=new _t().fromArray(s.value);break;case"m3":this.uniforms[i].value=new Fe().fromArray(s.value);break;case"m4":this.uniforms[i].value=new yt().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class Ro extends Mn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class np extends Br{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=fd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class sp extends Br{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const nr=new K,sr=new is,wi=new K;class Uh extends Qt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new yt,this.projectionMatrix=new yt,this.projectionMatrixInverse=new yt,this.coordinateSystem=Si,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(nr,sr,wi),wi.x===1&&wi.y===1&&wi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(nr,sr,wi.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(nr,sr,wi),wi.x===1&&wi.y===1&&wi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(nr,sr,wi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Zi=new K,tc=new tt,ic=new tt;class Ei extends Uh{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Ao*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(oa*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ao*2*Math.atan(Math.tan(oa*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Zi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Zi.x,Zi.y).multiplyScalar(-e/Zi.z),Zi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Zi.x,Zi.y).multiplyScalar(-e/Zi.z)}getViewSize(e,t){return this.getViewBounds(e,tc,ic),t.subVectors(ic,tc)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(oa*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*i/c,s*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class Fh extends Uh{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,f=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=f*this.view.offsetY,l=o-f*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Hn=-90,zn=1;class Co extends Qt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Ei(Hn,zn,e,t);s.layers=this.layers,this.add(s);const r=new Ei(Hn,zn,e,t);r.layers=this.layers,this.add(r);const a=new Ei(Hn,zn,e,t);a.layers=this.layers,this.add(a);const o=new Ei(Hn,zn,e,t);o.layers=this.layers,this.add(o);const l=new Ei(Hn,zn,e,t);l.layers=this.layers,this.add(l);const c=new Ei(Hn,zn,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===Si)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Lr)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,f]=this.children,u=e.getRenderTarget(),h=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;const x=i.texture.mipmapsAutoUpdate;i.texture.mipmapsAutoUpdate=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,1,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,2,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,3,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,4,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),i.texture.mipmapsAutoUpdate=x,e.setRenderTarget(i,5,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,f),e.setRenderTarget(u,h,d),e.xr.enabled=p,i.texture.needsPMREMUpdate=!0}}class rp extends Ei{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}}function nc(n,e,t,i){const s=ap(i);switch(t){case _h:return n*e;case Go:return n*e/s.components*s.byteLength;case Vo:return n*e/s.components*s.byteLength;case yn:return n*e*2/s.components*s.byteLength;case Wo:return n*e*2/s.components*s.byteLength;case yh:return n*e*3/s.components*s.byteLength;case yi:return n*e*4/s.components*s.byteLength;case Xo:return n*e*4/s.components*s.byteLength;case gr:case vr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case xr:case _r:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Ja:case Qa:return Math.max(n,16)*Math.max(e,8)/4;case Za:case ja:return Math.max(n,8)*Math.max(e,8)/2;case eo:case to:case no:case so:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case io:case Rr:case ro:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case ao:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case oo:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case lo:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case co:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case ho:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case uo:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case fo:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case po:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case mo:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case go:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case vo:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case xo:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case _o:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case yo:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case So:case Mo:case wo:return Math.ceil(n/4)*Math.ceil(e/4)*16;case bo:case Eo:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Cr:case To:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function ap(n){switch(n){case jt:case mh:return{byteLength:1,components:1};case ws:case gh:case Ii:return{byteLength:2,components:1};case Ho:case zo:return{byteLength:2,components:4};case Pi:case ko:case Ri:return{byteLength:4,components:1};case vh:case xh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Bo}}));typeof window<"u"&&(window.__THREE__?Ne("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Bo);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Oh(){let n=null,e=!1,t=null,i=null;function s(r,a){i=n.requestAnimationFrame(s),t(r,a)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function op(n){const e=new WeakMap;function t(o,l){const c=o.array,f=o.usage,u=c.byteLength,h=n.createBuffer();n.bindBuffer(l,h),n.bufferData(l,c,f),o.onUploadCallback();let d;if(c instanceof Float32Array)d=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=n.HALF_FLOAT:d=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=n.SHORT;else if(c instanceof Uint32Array)d=n.UNSIGNED_INT;else if(c instanceof Int32Array)d=n.INT;else if(c instanceof Int8Array)d=n.BYTE;else if(c instanceof Uint8Array)d=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,l,c){const f=l.array,u=l.updateRanges;if(n.bindBuffer(c,o),u.length===0)n.bufferSubData(c,0,f);else{u.sort((d,p)=>d.start-p.start);let h=0;for(let d=1;d<u.length;d++){const p=u[h],x=u[d];x.start<=p.start+p.count+1?p.count=Math.max(p.count,x.start+x.count-p.start):(++h,u[h]=x)}u.length=h+1;for(let d=0,p=u.length;d<p;d++){const x=u[d];n.bufferSubData(c,x.start*f.BYTES_PER_ELEMENT,f,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const f=e.get(o);(!f||f.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var lp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,cp=`#ifdef USE_ALPHAHASH
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
#endif`,hp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,up=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,fp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,dp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,pp=`#ifdef USE_AOMAP
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
#endif`,mp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,gp=`#ifdef USE_BATCHING
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
#endif`,vp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,xp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,_p=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,yp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Sp=`#ifdef USE_IRIDESCENCE
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
#endif`,Mp=`#ifdef USE_BUMPMAP
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
#endif`,wp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,bp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ep=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Tp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ap=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Rp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Cp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Pp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Ip=`#define PI 3.141592653589793
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
} // validated`,Lp=`vec3 transformedNormal = objectNormal;
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
#endif`,Dp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Np=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Up=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Fp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Op="gl_FragColor = linearToOutputTexel( gl_FragColor );",Bp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,kp=`#ifdef USE_ENVMAP
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
#endif`,Hp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,zp=`#ifdef USE_ENVMAP
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
#endif`,Gp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Vp=`#ifdef USE_ENVMAP
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
#endif`,Wp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Xp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,qp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,$p=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Yp=`#ifdef USE_GRADIENTMAP
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
}`,Kp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Zp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Jp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,jp=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,Qp=`#ifdef USE_ENVMAP
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
#endif`,em=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,tm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,im=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,nm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,sm=`PhysicalMaterial material;
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
#endif`,rm=`uniform sampler2D dfgLUT;
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
}`,am=`
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
#endif`,om=`#if defined( RE_IndirectDiffuse )
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
#endif`,lm=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,cm=`#if NUM_LIGHT_PROBE_GRIDS > 0
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
#endif`,hm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,um=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,fm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,dm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,pm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,mm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,gm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,vm=`#if defined( USE_POINTS_UV )
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
#endif`,xm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,_m=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ym=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Sm=`#if defined( USE_MORPHCOLORS )
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
#endif`,Mm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,wm=`#ifdef USE_MORPHTARGETS
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
#endif`,bm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Em=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Tm=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Am=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Rm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Cm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Pm=`#ifdef USE_NORMALMAP
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
#endif`,Im=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Lm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Dm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Nm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Um=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Fm=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Om=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Bm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,km=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Hm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,zm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Gm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Vm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Wm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Xm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,qm=`float getShadowMask() {
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
}`,$m=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ym=`#ifdef USE_SKINNING
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
#endif`,Km=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Zm=`#ifdef USE_SKINNING
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
#endif`,Jm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,jm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Qm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,eg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,tg=`#ifdef USE_TRANSMISSION
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
#endif`,ig=`#ifdef USE_TRANSMISSION
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
#endif`,ng=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,sg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,rg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ag=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const og=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,lg=`uniform sampler2D t2D;
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
}`,cg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,hg=`uniform float backgroundBlurriness;
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
}`,ug=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,fg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dg=`#include <common>
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
}`,pg=`#if DEPTH_PACKING == 3200
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
}`,mg=`#define DISTANCE
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
}`,gg=`#define DISTANCE
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
}`,vg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,xg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_g=`uniform float scale;
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
}`,yg=`uniform vec3 diffuse;
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
}`,Sg=`#include <common>
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
}`,Mg=`uniform vec3 diffuse;
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
}`,wg=`#define LAMBERT
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
}`,bg=`#define LAMBERT
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
}`,Eg=`#define MATCAP
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
}`,Tg=`#define MATCAP
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
}`,Ag=`#define NORMAL
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
}`,Rg=`#define NORMAL
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
}`,Cg=`#define PHONG
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
}`,Pg=`#define PHONG
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
}`,Ig=`#define STANDARD
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
}`,Lg=`#define STANDARD
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
}`,Dg=`#define TOON
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
}`,Ng=`#define TOON
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
}`,Ug=`uniform float size;
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
}`,Fg=`uniform vec3 diffuse;
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
}`,Og=`#include <common>
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
}`,Bg=`uniform vec3 color;
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
}`,kg=`uniform float rotation;
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
}`,Hg=`uniform vec3 diffuse;
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
}`,Ge={alphahash_fragment:lp,alphahash_pars_fragment:cp,alphamap_fragment:hp,alphamap_pars_fragment:up,alphatest_fragment:fp,alphatest_pars_fragment:dp,aomap_fragment:pp,aomap_pars_fragment:mp,batching_pars_vertex:gp,batching_vertex:vp,begin_vertex:xp,beginnormal_vertex:_p,bsdfs:yp,iridescence_fragment:Sp,bumpmap_pars_fragment:Mp,clipping_planes_fragment:wp,clipping_planes_pars_fragment:bp,clipping_planes_pars_vertex:Ep,clipping_planes_vertex:Tp,color_fragment:Ap,color_pars_fragment:Rp,color_pars_vertex:Cp,color_vertex:Pp,common:Ip,defaultnormal_vertex:Lp,displacementmap_pars_vertex:Dp,displacementmap_vertex:Np,emissivemap_fragment:Up,emissivemap_pars_fragment:Fp,colorspace_fragment:Op,colorspace_pars_fragment:Bp,envmap_fragment:kp,envmap_common_pars_fragment:Hp,envmap_pars_fragment:zp,envmap_pars_vertex:Gp,envmap_physical_pars_fragment:Qp,envmap_vertex:Vp,fog_vertex:Wp,fog_pars_vertex:Xp,fog_fragment:qp,fog_pars_fragment:$p,gradientmap_pars_fragment:Yp,lightmap_pars_fragment:Kp,lights_lambert_fragment:Zp,lights_lambert_pars_fragment:Jp,lights_pars_begin:jp,lights_toon_fragment:em,lights_toon_pars_fragment:tm,lights_phong_fragment:im,lights_phong_pars_fragment:nm,lights_physical_fragment:sm,lights_physical_pars_fragment:rm,lights_fragment_begin:am,lights_fragment_maps:om,lights_fragment_end:lm,lightprobes_pars_fragment:cm,logdepthbuf_fragment:hm,logdepthbuf_pars_fragment:um,logdepthbuf_pars_vertex:fm,logdepthbuf_vertex:dm,map_fragment:pm,map_pars_fragment:mm,map_particle_fragment:gm,map_particle_pars_fragment:vm,metalnessmap_fragment:xm,metalnessmap_pars_fragment:_m,morphinstance_vertex:ym,morphcolor_vertex:Sm,morphnormal_vertex:Mm,morphtarget_pars_vertex:wm,morphtarget_vertex:bm,normal_fragment_begin:Em,normal_fragment_maps:Tm,normal_pars_fragment:Am,normal_pars_vertex:Rm,normal_vertex:Cm,normalmap_pars_fragment:Pm,clearcoat_normal_fragment_begin:Im,clearcoat_normal_fragment_maps:Lm,clearcoat_pars_fragment:Dm,iridescence_pars_fragment:Nm,opaque_fragment:Um,packing:Fm,premultiplied_alpha_fragment:Om,project_vertex:Bm,dithering_fragment:km,dithering_pars_fragment:Hm,roughnessmap_fragment:zm,roughnessmap_pars_fragment:Gm,shadowmap_pars_fragment:Vm,shadowmap_pars_vertex:Wm,shadowmap_vertex:Xm,shadowmask_pars_fragment:qm,skinbase_vertex:$m,skinning_pars_vertex:Ym,skinning_vertex:Km,skinnormal_vertex:Zm,specularmap_fragment:Jm,specularmap_pars_fragment:jm,tonemapping_fragment:Qm,tonemapping_pars_fragment:eg,transmission_fragment:tg,transmission_pars_fragment:ig,uv_pars_fragment:ng,uv_pars_vertex:sg,uv_vertex:rg,worldpos_vertex:ag,background_vert:og,background_frag:lg,backgroundCube_vert:cg,backgroundCube_frag:hg,cube_vert:ug,cube_frag:fg,depth_vert:dg,depth_frag:pg,distance_vert:mg,distance_frag:gg,equirect_vert:vg,equirect_frag:xg,linedashed_vert:_g,linedashed_frag:yg,meshbasic_vert:Sg,meshbasic_frag:Mg,meshlambert_vert:wg,meshlambert_frag:bg,meshmatcap_vert:Eg,meshmatcap_frag:Tg,meshnormal_vert:Ag,meshnormal_frag:Rg,meshphong_vert:Cg,meshphong_frag:Pg,meshphysical_vert:Ig,meshphysical_frag:Lg,meshtoon_vert:Dg,meshtoon_frag:Ng,points_vert:Ug,points_frag:Fg,shadow_vert:Og,shadow_frag:Bg,sprite_vert:kg,sprite_frag:Hg},_e={common:{diffuse:{value:new rt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Fe}},envmap:{envMap:{value:null},envMapRotation:{value:new Fe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Fe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Fe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Fe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Fe},normalScale:{value:new tt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Fe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Fe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Fe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Fe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new rt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new rt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0},uvTransform:{value:new Fe}},sprite:{diffuse:{value:new rt(16777215)},opacity:{value:1},center:{value:new tt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}}},Ti={basic:{uniforms:Gt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.fog]),vertexShader:Ge.meshbasic_vert,fragmentShader:Ge.meshbasic_frag},lambert:{uniforms:Gt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new rt(0)},envMapIntensity:{value:1}}]),vertexShader:Ge.meshlambert_vert,fragmentShader:Ge.meshlambert_frag},phong:{uniforms:Gt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new rt(0)},specular:{value:new rt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ge.meshphong_vert,fragmentShader:Ge.meshphong_frag},standard:{uniforms:Gt([_e.common,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.roughnessmap,_e.metalnessmap,_e.fog,_e.lights,{emissive:{value:new rt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag},toon:{uniforms:Gt([_e.common,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.gradientmap,_e.fog,_e.lights,{emissive:{value:new rt(0)}}]),vertexShader:Ge.meshtoon_vert,fragmentShader:Ge.meshtoon_frag},matcap:{uniforms:Gt([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,{matcap:{value:null}}]),vertexShader:Ge.meshmatcap_vert,fragmentShader:Ge.meshmatcap_frag},points:{uniforms:Gt([_e.points,_e.fog]),vertexShader:Ge.points_vert,fragmentShader:Ge.points_frag},dashed:{uniforms:Gt([_e.common,_e.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ge.linedashed_vert,fragmentShader:Ge.linedashed_frag},depth:{uniforms:Gt([_e.common,_e.displacementmap]),vertexShader:Ge.depth_vert,fragmentShader:Ge.depth_frag},normal:{uniforms:Gt([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,{opacity:{value:1}}]),vertexShader:Ge.meshnormal_vert,fragmentShader:Ge.meshnormal_frag},sprite:{uniforms:Gt([_e.sprite,_e.fog]),vertexShader:Ge.sprite_vert,fragmentShader:Ge.sprite_frag},background:{uniforms:{uvTransform:{value:new Fe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ge.background_vert,fragmentShader:Ge.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Fe}},vertexShader:Ge.backgroundCube_vert,fragmentShader:Ge.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ge.cube_vert,fragmentShader:Ge.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ge.equirect_vert,fragmentShader:Ge.equirect_frag},distance:{uniforms:Gt([_e.common,_e.displacementmap,{referencePosition:{value:new K},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ge.distance_vert,fragmentShader:Ge.distance_frag},shadow:{uniforms:Gt([_e.lights,_e.fog,{color:{value:new rt(0)},opacity:{value:1}}]),vertexShader:Ge.shadow_vert,fragmentShader:Ge.shadow_frag}};Ti.physical={uniforms:Gt([Ti.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Fe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Fe},clearcoatNormalScale:{value:new tt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Fe},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new Fe},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Fe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Fe},sheen:{value:0},sheenColor:{value:new rt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Fe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Fe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Fe},transmissionSamplerSize:{value:new tt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Fe},attenuationDistance:{value:0},attenuationColor:{value:new rt(0)},specularColor:{value:new rt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Fe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Fe},anisotropyVector:{value:new tt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Fe}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag};const rr={r:0,b:0,g:0},zg=new yt,Bh=new Fe;Bh.set(-1,0,0,0,1,0,0,0,1);function Gg(n,e,t,i,s,r){const a=new rt(0);let o=s===!0?0:1,l,c,f=null,u=0,h=null;function d(M){let T=M.isScene===!0?M.background:null;if(T&&T.isTexture){const E=M.backgroundBlurriness>0;T=e.get(T,E)}return T}function p(M){let T=!1;const E=d(M);E===null?m(a,o):E&&E.isColor&&(m(E,1),T=!0);const w=n.xr.getEnvironmentBlendMode();w==="additive"?t.buffers.color.setClear(0,0,0,1,r):w==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(n.autoClear||T)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function x(M,T){const E=d(T);E&&E.isCubeTexture?(c===void 0&&(c=new Gi(new Rs(1,1,1),new Mn({name:"BackgroundCubeMaterial",uniforms:ts(Ti.backgroundCube.uniforms),vertexShader:Ti.backgroundCube.vertexShader,fragmentShader:Ti.backgroundCube.fragmentShader,side:$t,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(w,y,g){this.matrixWorld.copyPosition(g.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=E,c.material.uniforms.backgroundBlurriness.value=T.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(zg.makeRotationFromEuler(T.backgroundRotation)).transpose(),E.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Bh),c.material.toneMapped=$e.getTransfer(E.colorSpace)!==ot,(f!==E||u!==E.version||h!==n.toneMapping)&&(c.material.needsUpdate=!0,f=E,u=E.version,h=n.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null)):E&&E.isTexture&&(l===void 0&&(l=new Gi(new kr(2,2),new Mn({name:"BackgroundMaterial",uniforms:ts(Ti.background.uniforms),vertexShader:Ti.background.vertexShader,fragmentShader:Ti.background.fragmentShader,side:_n,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=E,l.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,l.material.toneMapped=$e.getTransfer(E.colorSpace)!==ot,E.matrixAutoUpdate===!0&&E.updateMatrix(),l.material.uniforms.uvTransform.value.copy(E.matrix),(f!==E||u!==E.version||h!==n.toneMapping)&&(l.material.needsUpdate=!0,f=E,u=E.version,h=n.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function m(M,T){M.getRGB(rr,Nh(n)),t.buffers.color.setClear(rr.r,rr.g,rr.b,T,r)}function v(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(M,T=1){a.set(M),o=T,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(M){o=M,m(a,o)},render:p,addToRenderList:x,dispose:v}}function Vg(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=h(null);let r=s,a=!1;function o(A,O,N,C,k){let B=!1;const H=u(A,C,N,O);r!==H&&(r=H,c(r.object)),B=d(A,C,N,k),B&&p(A,C,N,k),k!==null&&e.update(k,n.ELEMENT_ARRAY_BUFFER),(B||a)&&(a=!1,E(A,O,N,C),k!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(k).buffer))}function l(){return n.createVertexArray()}function c(A){return n.bindVertexArray(A)}function f(A){return n.deleteVertexArray(A)}function u(A,O,N,C){const k=C.wireframe===!0;let B=i[O.id];B===void 0&&(B={},i[O.id]=B);const H=A.isInstancedMesh===!0?A.id:0;let P=B[H];P===void 0&&(P={},B[H]=P);let I=P[N.id];I===void 0&&(I={},P[N.id]=I);let z=I[k];return z===void 0&&(z=h(l()),I[k]=z),z}function h(A){const O=[],N=[],C=[];for(let k=0;k<t;k++)O[k]=0,N[k]=0,C[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:O,enabledAttributes:N,attributeDivisors:C,object:A,attributes:{},index:null}}function d(A,O,N,C){const k=r.attributes,B=O.attributes;let H=0;const P=N.getAttributes();for(const I in P)if(P[I].location>=0){const $=k[I];let te=B[I];if(te===void 0&&(I==="instanceMatrix"&&A.instanceMatrix&&(te=A.instanceMatrix),I==="instanceColor"&&A.instanceColor&&(te=A.instanceColor)),$===void 0||$.attribute!==te||te&&$.data!==te.data)return!0;H++}return r.attributesNum!==H||r.index!==C}function p(A,O,N,C){const k={},B=O.attributes;let H=0;const P=N.getAttributes();for(const I in P)if(P[I].location>=0){let $=B[I];$===void 0&&(I==="instanceMatrix"&&A.instanceMatrix&&($=A.instanceMatrix),I==="instanceColor"&&A.instanceColor&&($=A.instanceColor));const te={};te.attribute=$,$&&$.data&&(te.data=$.data),k[I]=te,H++}r.attributes=k,r.attributesNum=H,r.index=C}function x(){const A=r.newAttributes;for(let O=0,N=A.length;O<N;O++)A[O]=0}function m(A){v(A,0)}function v(A,O){const N=r.newAttributes,C=r.enabledAttributes,k=r.attributeDivisors;N[A]=1,C[A]===0&&(n.enableVertexAttribArray(A),C[A]=1),k[A]!==O&&(n.vertexAttribDivisor(A,O),k[A]=O)}function M(){const A=r.newAttributes,O=r.enabledAttributes;for(let N=0,C=O.length;N<C;N++)O[N]!==A[N]&&(n.disableVertexAttribArray(N),O[N]=0)}function T(A,O,N,C,k,B,H){H===!0?n.vertexAttribIPointer(A,O,N,k,B):n.vertexAttribPointer(A,O,N,C,k,B)}function E(A,O,N,C){x();const k=C.attributes,B=N.getAttributes(),H=O.defaultAttributeValues;for(const P in B){const I=B[P];if(I.location>=0){let z=k[P];if(z===void 0&&(P==="instanceMatrix"&&A.instanceMatrix&&(z=A.instanceMatrix),P==="instanceColor"&&A.instanceColor&&(z=A.instanceColor)),z!==void 0){const $=z.normalized,te=z.itemSize,se=e.get(z);if(se===void 0)continue;const q=se.buffer,ne=se.type,fe=se.bytesPerElement,we=ne===n.INT||ne===n.UNSIGNED_INT||z.gpuType===ko;if(z.isInterleavedBufferAttribute){const de=z.data,Pe=de.isInterleavedBuffer===!0?de.stride:de.itemSize,je=z.offset;if(de.isInstancedInterleavedBuffer||de.isInstancedBufferAttribute){for(let Te=0;Te<I.locationSize;Te++)v(I.location+Te,de.meshPerAttribute);A.isInstancedMesh!==!0&&C._maxInstanceCount===void 0&&(C._maxInstanceCount=de.meshPerAttribute*de.count)}else for(let Te=0;Te<I.locationSize;Te++)m(I.location+Te);n.bindBuffer(n.ARRAY_BUFFER,q);for(let Te=0;Te<I.locationSize;Te++)T(I.location+Te,te/I.locationSize,ne,$,Pe*fe,(je+te/I.locationSize*Te)*fe,we)}else{if(z.isInstancedBufferAttribute){for(let de=0;de<I.locationSize;de++)v(I.location+de,z.meshPerAttribute);A.isInstancedMesh!==!0&&C._maxInstanceCount===void 0&&(C._maxInstanceCount=z.meshPerAttribute*z.count)}else for(let de=0;de<I.locationSize;de++)m(I.location+de);n.bindBuffer(n.ARRAY_BUFFER,q);for(let de=0;de<I.locationSize;de++)T(I.location+de,te/I.locationSize,ne,$,te*fe,te/I.locationSize*de*fe,we)}}else if(H!==void 0){const $=H[P];if($!==void 0)switch($.length){case 2:n.vertexAttrib2fv(I.location,$);break;case 3:n.vertexAttrib3fv(I.location,$);break;case 4:n.vertexAttrib4fv(I.location,$);break;default:n.vertexAttrib1fv(I.location,$)}}}}M()}function w(){L();for(const A in i){const O=i[A];for(const N in O){const C=O[N];for(const k in C){const B=C[k];for(const H in B)f(B[H].object),delete B[H];delete C[k]}}delete i[A]}}function y(A){if(i[A.id]===void 0)return;const O=i[A.id];for(const N in O){const C=O[N];for(const k in C){const B=C[k];for(const H in B)f(B[H].object),delete B[H];delete C[k]}}delete i[A.id]}function g(A){for(const O in i){const N=i[O];for(const C in N){const k=N[C];if(k[A.id]===void 0)continue;const B=k[A.id];for(const H in B)f(B[H].object),delete B[H];delete k[A.id]}}}function _(A){for(const O in i){const N=i[O],C=A.isInstancedMesh===!0?A.id:0,k=N[C];if(k!==void 0){for(const B in k){const H=k[B];for(const P in H)f(H[P].object),delete H[P];delete k[B]}delete N[C],Object.keys(N).length===0&&delete i[O]}}}function L(){R(),a=!0,r!==s&&(r=s,c(r.object))}function R(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:L,resetDefaultState:R,dispose:w,releaseStatesOfGeometry:y,releaseStatesOfObject:_,releaseStatesOfProgram:g,initAttributes:x,enableAttribute:m,disableUnusedAttributes:M}}function Wg(n,e,t){let i;function s(l){i=l}function r(l,c){n.drawArrays(i,l,c),t.update(c,i,1)}function a(l,c,f){f!==0&&(n.drawArraysInstanced(i,l,c,f),t.update(c,i,f))}function o(l,c,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,f);let h=0;for(let d=0;d<f;d++)h+=c[d];t.update(h,i,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function Xg(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const g=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(g.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(g){return!(g!==yi&&i.convert(g)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(g){const _=g===Ii&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(g!==jt&&g!==Ri&&!_&&i.convert(g)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE))}function l(g){if(g==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";g="mediump"}return g==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const f=l(c);f!==c&&(Ne("WebGLRenderer:",c,"not supported, using",f,"instead."),c=f);const u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),h=t.logarithmicDepthBuffer===!0&&u===!1;t.reversedDepthBuffer===!0&&u===!1&&Ne("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),t.logarithmicDepthBuffer===!0&&u===!0&&Ne("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");const d=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),v=n.getParameter(n.MAX_VERTEX_ATTRIBS),M=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),T=n.getParameter(n.MAX_VARYING_VECTORS),E=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),w=n.getParameter(n.MAX_SAMPLES),y=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:u,maxTextures:d,maxVertexTextures:p,maxTextureSize:x,maxCubemapSize:m,maxAttributes:v,maxVertexUniforms:M,maxVaryings:T,maxFragmentUniforms:E,maxSamples:w,samples:y}}function qg(n){const e=this;let t=null,i=0,s=!1,r=!1;const a=new ji,o=new Fe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,h){const d=u.length!==0||h||i!==0||s;return s=h,i=u.length,d},this.beginShadows=function(){r=!0,f(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,h){t=f(u,h,0)},this.setState=function(u,h,d){const p=u.clippingPlanes,x=u.clipIntersection,m=u.clipShadows,v=n.get(u);if(!s||p===null||p.length===0||r&&!m)r?f(null):c();else{const M=r?0:i,T=M*4;let E=v.clippingState||null;l.value=E,E=f(p,h,T,d);for(let w=0;w!==T;++w)E[w]=t[w];v.clippingState=E,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function f(u,h,d,p){const x=u!==null?u.length:0;let m=null;if(x!==0){if(m=l.value,p!==!0||m===null){const v=d+x*4,M=h.matrixWorldInverse;o.getNormalMatrix(M),(m===null||m.length<v)&&(m=new Float32Array(v));for(let T=0,E=d;T!==x;++T,E+=4)a.copy(u[T]).applyMatrix4(M,o),a.normal.toArray(m,E),m[E+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,m}}class Zo extends Ci{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Ih(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Rs(5,5,5),r=new Mn({name:"CubemapFromEquirect",uniforms:ts(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:$t,blending:Kn});r.uniforms.tEquirect.value=t;const a=new Gi(s,r),o=t.minFilter;return t.minFilter===nn&&(t.minFilter=qt),new Co(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}}const sc=256,$g=3,Yg=20,kh=256,Hh=16,Kg=3,Zg=new K,Jg=new rt;class Ur{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new Co(1,10,null),this._boxMesh=new Gi(new Rs(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,i=.1,s=100,r={}){const{size:a=256,position:o=Zg}=r,l=this._renderer;this._setSize(a);const c=this._allocateTarget(),f=this._getSourceTarget(!0);t>0&&(f.texture.mipmapsAutoUpdate=!1);const u=l.autoClear,h=l.autoClearColor,d=l.autoClearDepth,p=l.autoClearStencil,x=e.background;l.autoClear=!0,l.autoClearColor=!0,l.autoClearDepth=!0,l.autoClearStencil=!0,x===null&&(e.background=l.getClearColor(Jg));const m=new Co(i,s,f);return m.position.copy(o),m.update(l,e),l.autoClear=u,l.autoClearColor=h,l.autoClearDepth=d,l.autoClearStencil=p,e.background=x,t>0&&(f.texture.mipmapsAutoUpdate=!0,this._blur(c,t)),this._applyPMREM(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=oc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ac(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(sc,Td(e))}_fromTexture(e,t){e.mapping===jn||e.mapping===Ms?this._setSize(e.image.length===0?sc:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);const i=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(i),i}_allocateTarget(){const e=this._cubeSize,t=rc(e,!1,!1),i=Math.log2(e)-$g;for(let s=0;s<=i;s++)t.texture.mipmaps.push({width:e>>s,height:e>>s});return t.texture.name="PMREM",t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){const t=this._cubeSize,i=this._sourceTarget;return(i===null||i.width!==t||e&&i.depthBuffer===!1)&&(i!==null&&i.dispose(),this._sourceTarget=rc(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,i){const s=this._boxMesh,r=this._cubeCamera;s.material=i,r.renderTarget=e,r.activeMipmapLevel=t;const a=e.width>>t;e.viewport.set(0,0,a,a),r.update(this._renderer,s),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===jn||e.mapping===Ms?(this._cubemapMaterial===null&&(this._cubemapMaterial=oc()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=ac()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(e){this._ggxMaterial===null&&(this._ggxMaterial=jg(),this._integrationMaterial=Qg());const t=this._cubeSize,i=e.texture.mipmaps.length-1,s=this._ggxMaterial.uniforms;s.envMap.value=this._sourceTarget.texture;const r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(t/Hh);for(let a=0;a<=i;a++){const o=Ur.lodToRoughness(a,i);if(a>i-Kg)r.roughness.value=o,this._renderCube(e,a,this._integrationMaterial);else{const l=o>0?Math.log2(t)+.5*Math.log2(6/(kh*Math.pow(o,4)))+.5:0;s.roughness.value=o,s.lodBias.value=l,this._renderCube(e,a,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=e0());const i=this._blurMaterial,s=i.uniforms,r=this._sourceTarget;s.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,s.envMap.value=r.texture,this._renderCube(e,0,i),s.envMap.value=e.texture,this._renderCube(r,0,i)}}function rc(n,e,t){return new Zo(n,{minFilter:nn,generateMipmaps:e,type:Ii,colorSpace:bs,depthBuffer:t})}function Cs(n,e,t){return new Mn({name:n,uniforms:e,vertexShader:Ge.cube_vert,fragmentShader:t,side:$t,blending:Kn,depthTest:!1,depthWrite:!1})}function jg(){return Cs("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

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
	`)}function Qg(){return Cs("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:Hh}},`

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
	`)}function e0(){return Cs("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${Yg}
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
	`)}function ac(){return Cs("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

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
	`)}function oc(){return Cs("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function t0(n){let e=new WeakMap,t=new WeakMap,i=null;function s(h,d=!1){return h==null?null:d?a(h):r(h)}function r(h){if(h&&h.isTexture){const d=h.mapping;if(d===na||d===sa)if(e.has(h)){const p=e.get(h).texture;return o(p,h.mapping)}else{const p=h.image;if(p&&p.height>0){const x=new Zo(p.height);return x.fromEquirectangularTexture(n,h),e.set(h,x),h.addEventListener("dispose",c),o(x.texture,h.mapping)}else return null}}return h}function a(h){if(h&&h.isTexture&&h.isPMREMTexture!==!0){const d=h.mapping,p=d===na||d===sa,x=d===jn||d===Ms;if(p||x){let m=t.get(h);const v=m!==void 0?m.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==v)return i===null&&(i=new Ur(n)),m=p?i.fromEquirectangular(h,m):i.fromCubemap(h,m),m.texture.pmremVersion=h.pmremVersion,t.set(h,m),m.texture;if(m!==void 0)return m.texture;{const M=h.image;return p&&M&&M.height>0||x&&M&&l(M)?(i===null&&(i=new Ur(n)),m=p?i.fromEquirectangular(h):i.fromCubemap(h),m.texture.pmremVersion=h.pmremVersion,t.set(h,m),h.addEventListener("dispose",f),m.texture):null}}}return h}function o(h,d){return d===na?h.mapping=jn:d===sa&&(h.mapping=Ms),h}function l(h){let d=0;const p=6;for(let x=0;x<p;x++)h[x]!==void 0&&d++;return d===p}function c(h){const d=h.target;d.removeEventListener("dispose",c);const p=e.get(d);p!==void 0&&(e.delete(d),p.dispose())}function f(h){const d=h.target;d.removeEventListener("dispose",f);const p=t.get(d);p!==void 0&&(t.delete(d),p.dispose())}function u(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:u}}function i0(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&yr("WebGLRenderer: "+i+" extension not supported."),s}}}function n0(n,e,t,i){const s={},r=new WeakMap,a=new FinalizationRegistry(p=>delete s[p]);function o(p){l(p.target)}function l(p){p.index!==null&&e.remove(p.index);for(const m in p.attributes)e.remove(p.attributes[m]);p.removeEventListener("dispose",o),delete s[p.id],a.unregister(p);const x=r.get(p);x&&(e.remove(x),r.delete(p)),i.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function c(p,x){return s[x.id]!==void 0||(x.addEventListener("dispose",o),s[x.id]=new WeakRef(x),a.register(x,x.id,x),t.memory.geometries++),x}function f(p){const x=p.attributes;for(const m in x)e.update(x[m],n.ARRAY_BUFFER)}function u(p){const x=p.index,m=p.attributes.position;let v=0;if(m===void 0)return;const M=x!==null?x.array.length:m.array.length/3-1,T=m.count>=65535?Ch:Rh,E=new T(Math.ceil(M/3)*6,1),w=E.array;if(x!==null){const g=x.array;v=x.version;for(let _=0,L=0;_<M;_+=3){const R=g[_+0],A=g[_+1],O=g[_+2];w[L++]=R,w[L++]=A,w[L++]=A,w[L++]=O,w[L++]=O,w[L++]=R}}else{v=m.version;for(let g=0,_=0;g<M;g+=3){const L=g+0,R=g+1,A=g+2;w[_++]=L,w[_++]=R,w[_++]=R,w[_++]=A,w[_++]=A,w[_++]=L}}E.version=v;const y=r.get(p);y&&e.remove(y),r.set(p,E)}function h(p){const x=r.get(p);if(x){const m=p.index;m!==null&&x.version<m.version&&u(p)}else u(p);return r.get(p)}function d(){for(const p in s){const x=s[p].deref();x!==void 0&&l(x)}}return{get:c,update:f,getWireframeAttribute:h,dispose:d}}function s0(n,e,t){let i;function s(u){i=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function l(u,h){n.drawElements(i,h,r,u*a),t.update(h,i,1)}function c(u,h,d){d!==0&&(n.drawElementsInstanced(i,h,r,u*a,d),t.update(h,i,d))}function f(u,h,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,h,0,r,u,0,d);let x=0;for(let m=0;m<d;m++)x+=h[m];t.update(x,i,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=f}function r0(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:et("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function a0(n,e,t){const i=new WeakMap,s=new _t;function r(a,o,l){const c=a.morphTargetInfluences,f=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=f!==void 0?f.length:0;let h=i.get(o);if(h===void 0||h.count!==u){let R=function(){_.dispose(),i.delete(o),o.removeEventListener("dispose",R)};var d=R;h!==void 0&&h.texture.dispose();const p=o.morphAttributes.position!==void 0,x=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,v=o.morphAttributes.position||[],M=o.morphAttributes.normal||[],T=o.morphAttributes.color||[];let E=0;p===!0&&(E=1),x===!0&&(E=2),m===!0&&(E=3);let w=o.attributes.position.count*E,y=1;w>e.maxTextureSize&&(y=Math.ceil(w/e.maxTextureSize),w=e.maxTextureSize);const g=new Float32Array(w*y*4*u),_=new Eh(g,w,y,u);_.type=Ri,_.needsUpdate=!0;const L=E*4;for(let A=0;A<u;A++){const O=v[A],N=M[A],C=T[A],k=w*y*4*A;for(let B=0;B<O.count;B++){const H=B*L;p===!0&&(s.fromBufferAttribute(O,B),g[k+H+0]=s.x,g[k+H+1]=s.y,g[k+H+2]=s.z,g[k+H+3]=0),x===!0&&(s.fromBufferAttribute(N,B),g[k+H+4]=s.x,g[k+H+5]=s.y,g[k+H+6]=s.z,g[k+H+7]=0),m===!0&&(s.fromBufferAttribute(C,B),g[k+H+8]=s.x,g[k+H+9]=s.y,g[k+H+10]=s.z,g[k+H+11]=C.itemSize===4?s.w:1)}}h={count:u,texture:_,size:new tt(w,y)},i.set(o,h),o.addEventListener("dispose",R)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let p=0;for(let m=0;m<c.length;m++)p+=c[m];const x=o.morphTargetsRelative?1:1-p;l.getUniforms().setValue(n,"morphTargetBaseInfluence",x),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:r}}function o0(n,e,t,i,s){let r=new WeakMap;function a(c){const f=s.render.frame,u=c.geometry,h=e.get(c,u);if(r.get(h)!==f&&(e.update(h),r.set(h,f)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==f&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),r.set(c,f))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==f&&(d.update(),r.set(d,f))}return h}function o(){r=new WeakMap}function l(c){const f=c.target;f.removeEventListener("dispose",l),i.releaseStatesOfObject(f),t.remove(f.instanceMatrix),f.instanceColor!==null&&t.remove(f.instanceColor)}return{update:a,dispose:o}}const l0={[oh]:"LINEAR_TONE_MAPPING",[lh]:"REINHARD_TONE_MAPPING",[ch]:"CINEON_TONE_MAPPING",[hh]:"ACES_FILMIC_TONE_MAPPING",[fh]:"AGX_TONE_MAPPING",[dh]:"NEUTRAL_TONE_MAPPING",[uh]:"CUSTOM_TONE_MAPPING"};function c0(n,e,t,i,s,r){const a=new Ci(e,t,{type:n,depthBuffer:s,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,l=null,c=null;const f=new an;f.setAttribute("position",new Mi([-1,3,0,-1,-1,0,3,-1,0],3)),f.setAttribute("uv",new Mi([0,2,0,0,2,0],2));const u=new Ro({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),h=new Gi(f,u),d=new Fh(-1,1,1,-1,0,1);let p=null,x=null,m=!1,v,M=null,T=[],E=!1;this.setSize=function(w,y){a.setSize(w,y),o!==null&&o.setSize(w,y),l!==null&&l.setSize(w,y);for(let g=0;g<T.length;g++){const _=T[g];_.setSize&&_.setSize(w,y)}},this.setEffects=function(w){T=w,E=T.length>0&&T[0].isRenderPass===!0;const y=a.width,g=a.height;T.length>0&&o===null&&(o=new Ci(y,g,{type:Ii,depthBuffer:!1,stencilBuffer:!1}),l=new Ci(y,g,{type:Ii,depthBuffer:!1,stencilBuffer:!1}));const _=s===!0&&T.some(L=>L.needsDepthTexture===!0);_!==(a.depthTexture!==null)&&(_===!0&&c===null&&(c=new es(y,g),r===!0&&(c.format=sn,c.type=Qn)),a.dispose(),a.depthTexture=_?c:null,a.resolveDepthBuffer=_,a.storeMultisampledDepthBuffer=_);for(let L=0;L<T.length;L++){const R=T[L];R.setSize&&R.setSize(y,g),_&&R.needsDepthTexture===!0&&R.setDepthTexture&&R.setDepthTexture(c)}},this.begin=function(w,y){if(m||w.toneMapping===Hi&&T.length===0)return!1;if(M=y,y!==null){const g=y.width,_=y.height;(a.width!==g||a.height!==_)&&this.setSize(g,_)}return E===!1&&w.setRenderTarget(a),v=w.toneMapping,w.toneMapping=Hi,!0},this.hasRenderPass=function(){return E},this.end=function(w,y){w.toneMapping=v,m=!0;let g=a,_=o;for(let L=0;L<T.length;L++){const R=T[L];R.enabled!==!1&&(R.render(w,_,g,y),R.needsSwap!==!1&&(g=_,_=_===o?l:o))}if(p!==w.outputColorSpace||x!==w.toneMapping){p=w.outputColorSpace,x=w.toneMapping,u.defines={},$e.getTransfer(p)===ot&&(u.defines.SRGB_TRANSFER="");const L=l0[x];L&&(u.defines[L]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=g.texture,w.setRenderTarget(M),w.render(h,d),M=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),f.dispose(),u.dispose()}}const zh=new Vt,Gh=new es(1,1),Vh=new Lh(1),Wh=new Eh,Xh=new Nd,qh=new Ih,lc=[],cc=[],hc=new Float32Array(16),uc=new Float32Array(9),fc=new Float32Array(4);function ns(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let r=lc[s];if(r===void 0&&(r=new Float32Array(s),lc[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function Et(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Tt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Hr(n,e){let t=cc[e];t===void 0&&(t=new Int32Array(e),cc[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function h0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function u0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Et(t,e))return;n.uniform2fv(this.addr,e),Tt(t,e)}}function f0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Et(t,e))return;n.uniform3fv(this.addr,e),Tt(t,e)}}function d0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Et(t,e))return;n.uniform4fv(this.addr,e),Tt(t,e)}}function p0(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Et(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Tt(t,e)}else{if(Et(t,i))return;fc.set(i),n.uniformMatrix2fv(this.addr,!1,fc),Tt(t,i)}}function m0(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Et(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Tt(t,e)}else{if(Et(t,i))return;uc.set(i),n.uniformMatrix3fv(this.addr,!1,uc),Tt(t,i)}}function g0(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Et(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Tt(t,e)}else{if(Et(t,i))return;hc.set(i),n.uniformMatrix4fv(this.addr,!1,hc),Tt(t,i)}}function v0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function x0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Et(t,e))return;n.uniform2iv(this.addr,e),Tt(t,e)}}function _0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Et(t,e))return;n.uniform3iv(this.addr,e),Tt(t,e)}}function y0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Et(t,e))return;n.uniform4iv(this.addr,e),Tt(t,e)}}function S0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function M0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Et(t,e))return;n.uniform2uiv(this.addr,e),Tt(t,e)}}function w0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Et(t,e))return;n.uniform3uiv(this.addr,e),Tt(t,e)}}function b0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Et(t,e))return;n.uniform4uiv(this.addr,e),Tt(t,e)}}function zr(n){return n.version===0&&(n.compareFunction=wh,n.needsUpdate=!0),n}function E0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?r=zr(Gh):r=zh,t.setTexture2D(e||r,s)}function T0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||Xh,s)}function A0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_CUBE_SHADOW?r=zr(Vh):r=qh,t.setTextureCube(e||r,s)}function R0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||Wh,s)}function C0(n){switch(n){case 5126:return h0;case 35664:return u0;case 35665:return f0;case 35666:return d0;case 35674:return p0;case 35675:return m0;case 35676:return g0;case 5124:case 35670:return v0;case 35667:case 35671:return x0;case 35668:case 35672:return _0;case 35669:case 35673:return y0;case 5125:return S0;case 36294:return M0;case 36295:return w0;case 36296:return b0;case 35678:case 36198:case 36298:case 36306:case 35682:return E0;case 35679:case 36299:case 36307:return T0;case 35680:case 36300:case 36308:case 36293:return A0;case 36289:case 36303:case 36311:case 36292:return R0}}function P0(n,e){n.uniform1fv(this.addr,e)}function I0(n,e){const t=ns(e,this.size,2);n.uniform2fv(this.addr,t)}function L0(n,e){const t=ns(e,this.size,3);n.uniform3fv(this.addr,t)}function D0(n,e){const t=ns(e,this.size,4);n.uniform4fv(this.addr,t)}function N0(n,e){const t=ns(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function U0(n,e){const t=ns(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function F0(n,e){const t=ns(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function O0(n,e){n.uniform1iv(this.addr,e)}function B0(n,e){n.uniform2iv(this.addr,e)}function k0(n,e){n.uniform3iv(this.addr,e)}function H0(n,e){n.uniform4iv(this.addr,e)}function z0(n,e){n.uniform1uiv(this.addr,e)}function G0(n,e){n.uniform2uiv(this.addr,e)}function V0(n,e){n.uniform3uiv(this.addr,e)}function W0(n,e){n.uniform4uiv(this.addr,e)}function X0(n,e,t){const i=this.cache,s=e.length,r=Hr(t,s);Et(i,r)||(n.uniform1iv(this.addr,r),Tt(i,r));let a;this.type===n.SAMPLER_2D_SHADOW?a=zr(Gh):a=zh;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function q0(n,e,t){const i=this.cache,s=e.length,r=Hr(t,s);Et(i,r)||(n.uniform1iv(this.addr,r),Tt(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Xh,r[a])}function $0(n,e,t){const i=this.cache,s=e.length,r=Hr(t,s);Et(i,r)||(n.uniform1iv(this.addr,r),Tt(i,r));let a;this.type===n.SAMPLER_CUBE_SHADOW?a=zr(Vh):a=qh;for(let o=0;o!==s;++o)t.setTextureCube(e[o]||a,r[o])}function Y0(n,e,t){const i=this.cache,s=e.length,r=Hr(t,s);Et(i,r)||(n.uniform1iv(this.addr,r),Tt(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Wh,r[a])}function K0(n){switch(n){case 5126:return P0;case 35664:return I0;case 35665:return L0;case 35666:return D0;case 35674:return N0;case 35675:return U0;case 35676:return F0;case 5124:case 35670:return O0;case 35667:case 35671:return B0;case 35668:case 35672:return k0;case 35669:case 35673:return H0;case 5125:return z0;case 36294:return G0;case 36295:return V0;case 36296:return W0;case 35678:case 36198:case 36298:case 36306:case 35682:return X0;case 35679:case 36299:case 36307:return q0;case 35680:case 36300:case 36308:case 36293:return $0;case 36289:case 36303:case 36311:case 36292:return Y0}}class Z0{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=C0(t.type)}}class J0{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=K0(t.type)}}class j0{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],i)}}}const Ca=/(\w+)(\])?(\[|\.)?/g;function dc(n,e){n.seq.push(e),n.map[e.id]=e}function Q0(n,e,t){const i=n.name,s=i.length;for(Ca.lastIndex=0;;){const r=Ca.exec(i),a=Ca.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){dc(t,c===void 0?new Z0(o,n,e):new J0(o,n,e));break}else{let u=t.map[o];u===void 0&&(u=new j0(o),dc(t,u)),t=u}}}class Sr{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);Q0(o,l,this)}const s=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&i.push(a)}return i}}function pc(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const ev=37297;let tv=0;function iv(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const mc=new Fe;function nv(n){$e._getMatrix(mc,$e.workingColorSpace,n);const e=`mat3( ${mc.elements.map(t=>t.toFixed(4))} )`;switch($e.getTransfer(n)){case Pr:return[e,"LinearTransferOETF"];case ot:return[e,"sRGBTransferOETF"];default:return Ne("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function gc(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+iv(n.getShaderSource(e),o)}else return r}function sv(n,e){const t=nv(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( ${t[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}const rv={[oh]:"Linear",[lh]:"Reinhard",[ch]:"Cineon",[hh]:"ACESFilmic",[fh]:"AgX",[dh]:"Neutral",[uh]:"Custom"};function av(n,e){const t=rv[e];return t===void 0?(Ne("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const ar=new K;function ov(){$e.getLuminanceCoefficients(ar);const n=ar.x.toFixed(4),e=ar.y.toFixed(4),t=ar.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function lv(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(gs).join(`
`)}function cv(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function hv(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(e,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function gs(n){return n!==""}function vc(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,e.numLightProbeGrids)}function xc(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const uv=/^[ \t]*#include +<([\w\d./]+)>/gm;function Po(n){return n.replace(uv,fv)}function fv(n,e){const t=Ge[e];if(t===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">");return Po(t)}const dv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function _c(n){return n.replace(dv,pv)}function pv(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function yc(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}const mv={[mr]:"SHADOWMAP_TYPE_PCF",[ms]:"SHADOWMAP_TYPE_VSM"};function gv(n){return mv[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const vv={[Ms]:"ENVMAP_MODE_REFRACTION"};function xv(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":vv[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const _v={[ah]:"ENVMAP_BLENDING_MULTIPLY",[cd]:"ENVMAP_BLENDING_MIX",[hd]:"ENVMAP_BLENDING_ADD"};function yv(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":_v[n.combine]||"ENVMAP_BLENDING_NONE"}function Sv(n,e,t,i){const s=n.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=gv(t),c=t.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",f=xv(t),u=yv(t),h=lv(t),d=cv(r),p=s.createProgram();let x,m,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(x=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d].filter(gs).join(`
`),x.length>0&&(x+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d].filter(gs).join(`
`),m.length>0&&(m+=`
`)):(x=[yc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+f:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+t.diffuseRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(gs).join(`
`),m=[yc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+f:"",t.envMap?"#define "+u:"",t.envMapPMREM?"#define ENVMAP_MAX_LOD "+t.envMapMaxLod+".0":"",t.envMapPMREM?"#define ENVMAP_SIZE "+t.envMapSize+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Hi?"#define TONE_MAPPING":"",t.toneMapping!==Hi?Ge.tonemapping_pars_fragment:"",t.toneMapping!==Hi?av("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ge.colorspace_pars_fragment,sv("linearToOutputTexel",t.outputColorSpace),ov(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(gs).join(`
`)),a=Po(a),a=vc(a,t),a=xc(a,t),o=Po(o),o=vc(o,t),o=xc(o,t),a=_c(a),o=_c(o),t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,x=[h,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,m=["#define varying in",t.glslVersion===Ir?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ir?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const M=v+x+a,T=v+m+o,E=pc(s,s.VERTEX_SHADER,M),w=pc(s,s.FRAGMENT_SHADER,T);s.attachShader(p,E),s.attachShader(p,w),t.index0AttributeName!==void 0?s.bindAttribLocation(p,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(p,0,"position"),s.linkProgram(p);function y(R){if(n.debug.checkShaderErrors){const A=s.getProgramInfoLog(p)||"",O=s.getShaderInfoLog(E)||"",N=s.getShaderInfoLog(w)||"",C=A.trim(),k=O.trim(),B=N.trim();let H=!0,P=!0;if(s.getProgramParameter(p,s.LINK_STATUS)===!1)if(H=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,p,E,w);else{const I=gc(s,E,"vertex"),z=gc(s,w,"fragment");et("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(p,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+C+`
`+I+`
`+z)}else C!==""?Ne("WebGLProgram: Program Info Log:",C):(k===""||B==="")&&(P=!1);P&&(R.diagnostics={runnable:H,programLog:C,vertexShader:{log:k,prefix:x},fragmentShader:{log:B,prefix:m}})}s.deleteShader(E),s.deleteShader(w),g=new Sr(s,p),_=hv(s,p)}let g;this.getUniforms=function(){return g===void 0&&y(this),g};let _;this.getAttributes=function(){return _===void 0&&y(this),_};let L=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=s.getProgramParameter(p,ev)),L},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(p),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=tv++,this.cacheKey=e,this.usedTimes=1,this.program=p,this.vertexShader=E,this.fragmentShader=w,this}let Mv=0;class wv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){const s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new bv(e),t.set(e,i)),i}}class bv{constructor(e){this.id=Mv++,this.code=e,this.usedTimes=0}}function Ev(n){return n===yn||n===Rr||n===Cr}function Tv(n,e,t,i,s,r){const a=new Th,o=new wv,l=new Set,c=[],f=new Map,u=i.logarithmicDepthBuffer,h={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function d(g){return l.add(g),g===0?"uv":`uv${g}`}function p(g,_,L,R,A,O){const N=R.fog,C=A.geometry,k=g.isMeshStandardMaterial||g.isMeshLambertMaterial||g.isMeshPhongMaterial?R.environment:null,B=g.isMeshStandardMaterial||g.isMeshLambertMaterial&&!g.envMap||g.isMeshPhongMaterial&&!g.envMap,H=e.get(g.envMap||k,B),P=h[g.type];let I=i.precision;g.precision!==null&&(I=i.getMaxPrecision(g.precision),I!==g.precision&&Ne("WebGLProgram.getParameters:",g.precision,"not supported, using",I,"instead."));const z=C.morphAttributes.position||C.morphAttributes.normal||C.morphAttributes.color,$=z!==void 0?z.length:0;let te=0;C.morphAttributes.position!==void 0&&(te=1),C.morphAttributes.normal!==void 0&&(te=2),C.morphAttributes.color!==void 0&&(te=3);let se,q,ne,fe;if(P){const xe=Ti[P];se=xe.vertexShader,q=xe.fragmentShader}else{se=g.vertexShader,q=g.fragmentShader;const xe=o.getVertexShaderStage(g),at=o.getFragmentShaderStage(g);o.update(g,xe,at),ne=xe.id,fe=at.id}const we=n.getRenderTarget(),de=n.state.buffers.depth.getReversed(),Pe=A.isInstancedMesh===!0,je=A.isBatchedMesh===!0,Te=!!g.map,qe=!!g.matcap,Ke=!!H,ie=Ke&&H.isPMREMTexture===!0,Re=!!g.aoMap,Se=!!g.lightMap,Ze=!!g.bumpMap&&g.wireframe===!1,it=!!g.normalMap,Wt=!!g.displacementMap,He=!!g.emissiveMap,Dt=!!g.metalnessMap,ei=!!g.roughnessMap,ti=g.anisotropy>0,G=g.clearcoat>0,ii=g.diffuseRoughness>0,mt=g.dispersion>0,gt=g.retroreflectivity>0,ve=g.iridescence>0,bt=g.sheen>0,De=g.transmission>0,Ue=ti&&!!g.anisotropyMap,D=G&&!!g.clearcoatMap,S=G&&!!g.clearcoatNormalMap,W=G&&!!g.clearcoatRoughnessMap,re=ii&&!!g.diffuseRoughnessMap,ee=ve&&!!g.iridescenceMap,le=ve&&!!g.iridescenceThicknessMap,me=bt&&!!g.sheenColorMap,J=bt&&!!g.sheenRoughnessMap,j=!!g.specularMap,he=!!g.specularColorMap,U=!!g.specularIntensityMap,Q=De&&!!g.transmissionMap,Z=De&&!!g.thicknessMap,ue=!!g.gradientMap,oe=!!g.alphaMap,ce=g.alphaTest>0,Ce=!!g.alphaHash,ze=!!g.extensions;let ae=Hi;g.toneMapped&&(we===null||we.isXRRenderTarget===!0)&&(ae=n.toneMapping);const Ie=ie?H.isCompressedCubeTexture?H.image[0].mipmaps:H.mipmaps:null,ke={shaderID:P,shaderType:g.type,shaderName:g.name,vertexShader:se,fragmentShader:q,defines:g.defines,customVertexShaderID:ne,customFragmentShaderID:fe,isRawShaderMaterial:g.isRawShaderMaterial===!0,glslVersion:g.glslVersion,precision:I,batching:je,batchingColor:je&&A._colorsTexture!==null,instancing:Pe,instancingColor:Pe&&A.instanceColor!==null,instancingMorph:Pe&&A.morphTexture!==null,outputColorSpace:we===null?n.outputColorSpace:we.isXRRenderTarget===!0?we.texture.colorSpace:$e.workingColorSpace,alphaToCoverage:!!g.alphaToCoverage,map:Te,matcap:qe,envMap:Ke,envMapMode:Ke&&H.mapping,envMapPMREM:ie,envMapMaxLod:ie?Ie.length-1:null,envMapSize:ie?Ie[0].width:null,aoMap:Re,lightMap:Se,bumpMap:Ze,normalMap:it,displacementMap:Wt,emissiveMap:He,normalMapObjectSpace:it&&g.normalMapType===dd,normalMapTangentSpace:it&&g.normalMapType===Fl,packedNormalMap:it&&g.normalMapType===Fl&&Ev(g.normalMap.format),metalnessMap:Dt,roughnessMap:ei,anisotropy:ti,anisotropyMap:Ue,clearcoat:G,clearcoatMap:D,clearcoatNormalMap:S,clearcoatRoughnessMap:W,diffuseRoughness:ii,diffuseRoughnessMap:re,dispersion:mt,retroreflection:gt,iridescence:ve,iridescenceMap:ee,iridescenceThicknessMap:le,sheen:bt,sheenColorMap:me,sheenRoughnessMap:J,specularMap:j,specularColorMap:he,specularIntensityMap:U,transmission:De,transmissionMap:Q,thicknessMap:Z,gradientMap:ue,opaque:g.transparent===!1&&g.blending===ys&&g.alphaToCoverage===!1,alphaMap:oe,alphaTest:ce,alphaHash:Ce,combine:g.combine,mapUv:Te&&d(g.map.channel),aoMapUv:Re&&d(g.aoMap.channel),lightMapUv:Se&&d(g.lightMap.channel),bumpMapUv:Ze&&d(g.bumpMap.channel),normalMapUv:it&&d(g.normalMap.channel),displacementMapUv:Wt&&d(g.displacementMap.channel),emissiveMapUv:He&&d(g.emissiveMap.channel),metalnessMapUv:Dt&&d(g.metalnessMap.channel),roughnessMapUv:ei&&d(g.roughnessMap.channel),anisotropyMapUv:Ue&&d(g.anisotropyMap.channel),clearcoatMapUv:D&&d(g.clearcoatMap.channel),clearcoatNormalMapUv:S&&d(g.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:W&&d(g.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:re&&d(g.diffuseRoughnessMap.channel),iridescenceMapUv:ee&&d(g.iridescenceMap.channel),iridescenceThicknessMapUv:le&&d(g.iridescenceThicknessMap.channel),sheenColorMapUv:me&&d(g.sheenColorMap.channel),sheenRoughnessMapUv:J&&d(g.sheenRoughnessMap.channel),specularMapUv:j&&d(g.specularMap.channel),specularColorMapUv:he&&d(g.specularColorMap.channel),specularIntensityMapUv:U&&d(g.specularIntensityMap.channel),transmissionMapUv:Q&&d(g.transmissionMap.channel),thicknessMapUv:Z&&d(g.thicknessMap.channel),alphaMapUv:oe&&d(g.alphaMap.channel),vertexTangents:!!C.attributes.tangent&&(it||ti),vertexNormals:!!C.attributes.normal,vertexColors:g.vertexColors,vertexAlphas:g.vertexColors===!0&&!!C.attributes.color&&C.attributes.color.itemSize===4,pointsUvs:A.isPoints===!0&&!!C.attributes.uv&&(Te||oe),fog:!!N,useFog:g.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:g.wireframe===!1&&(g.flatShading===!0||C.attributes.normal===void 0&&it===!1&&(g.isMeshLambertMaterial||g.isMeshPhongMaterial||g.isMeshStandardMaterial||g.isMeshPhysicalMaterial)),sizeAttenuation:g.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:de,skinning:A.isSkinnedMesh===!0,hasPositionAttribute:C.attributes.position!==void 0,morphTargets:C.morphAttributes.position!==void 0,morphNormals:C.morphAttributes.normal!==void 0,morphColors:C.morphAttributes.color!==void 0,morphTargetsCount:$,morphTextureStride:te,numSunLights:_.sun.length,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numSunLightShadows:_.sunShadowMap.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numLightProbeGrids:O.filter(xe=>xe.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:g.dithering,shadowMapEnabled:n.shadowMap.enabled&&L.length>0,shadowMapType:n.shadowMap.type,toneMapping:ae,decodeVideoTexture:Te&&g.map.isVideoTexture===!0&&$e.getTransfer(g.map.colorSpace)===ot,decodeVideoTextureEmissive:He&&g.emissiveMap.isVideoTexture===!0&&$e.getTransfer(g.emissiveMap.colorSpace)===ot,premultipliedAlpha:g.premultipliedAlpha,doubleSided:g.side===xi,flipSided:g.side===$t,useDepthPacking:g.depthPacking>=0,depthPacking:g.depthPacking||0,index0AttributeName:g.index0AttributeName,extensionClipCullDistance:ze&&g.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ze&&g.extensions.multiDraw===!0||je)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:g.customProgramCacheKey()};return ke.vertexUv1s=l.has(1),ke.vertexUv2s=l.has(2),ke.vertexUv3s=l.has(3),l.clear(),ke}function x(g){const _=[];if(g.shaderID?_.push(g.shaderID):(_.push(g.customVertexShaderID),_.push(g.customFragmentShaderID)),g.defines!==void 0)for(const L in g.defines)_.push(L),_.push(g.defines[L]);return g.isRawShaderMaterial===!1&&(m(_,g),v(_,g),_.push(n.outputColorSpace)),_.push(g.customProgramCacheKey),_.join()}function m(g,_){g.push(_.precision),g.push(_.outputColorSpace),g.push(_.envMapMode),g.push(_.envMapPMREM),g.push(_.envMapMaxLod),g.push(_.envMapSize),g.push(_.mapUv),g.push(_.alphaMapUv),g.push(_.lightMapUv),g.push(_.aoMapUv),g.push(_.bumpMapUv),g.push(_.normalMapUv),g.push(_.displacementMapUv),g.push(_.emissiveMapUv),g.push(_.metalnessMapUv),g.push(_.roughnessMapUv),g.push(_.anisotropyMapUv),g.push(_.clearcoatMapUv),g.push(_.clearcoatNormalMapUv),g.push(_.clearcoatRoughnessMapUv),g.push(_.diffuseRoughnessMapUv),g.push(_.iridescenceMapUv),g.push(_.iridescenceThicknessMapUv),g.push(_.sheenColorMapUv),g.push(_.sheenRoughnessMapUv),g.push(_.specularMapUv),g.push(_.specularColorMapUv),g.push(_.specularIntensityMapUv),g.push(_.transmissionMapUv),g.push(_.thicknessMapUv),g.push(_.combine),g.push(_.fogExp2),g.push(_.sizeAttenuation),g.push(_.morphTargetsCount),g.push(_.numSunLights),g.push(_.numDirLights),g.push(_.numPointLights),g.push(_.numSpotLights),g.push(_.numSpotLightMaps),g.push(_.numHemiLights),g.push(_.numRectAreaLights),g.push(_.numSunLightShadows),g.push(_.numDirLightShadows),g.push(_.numPointLightShadows),g.push(_.numSpotLightShadows),g.push(_.numSpotLightShadowsWithMaps),g.push(_.numLightProbes),g.push(_.numLightProbeGrids),g.push(_.shadowMapType),g.push(_.toneMapping),g.push(_.numClippingPlanes),g.push(_.numClipIntersection),g.push(_.depthPacking)}function v(g,_){a.disableAll(),_.instancing&&a.enable(0),_.instancingColor&&a.enable(1),_.instancingMorph&&a.enable(2),_.matcap&&a.enable(3),_.envMap&&a.enable(4),_.normalMapObjectSpace&&a.enable(5),_.normalMapTangentSpace&&a.enable(6),_.clearcoat&&a.enable(7),_.iridescence&&a.enable(8),_.alphaTest&&a.enable(9),_.vertexColors&&a.enable(10),_.vertexAlphas&&a.enable(11),_.vertexUv1s&&a.enable(12),_.vertexUv2s&&a.enable(13),_.vertexUv3s&&a.enable(14),_.vertexTangents&&a.enable(15),_.anisotropy&&a.enable(16),_.alphaHash&&a.enable(17),_.batching&&a.enable(18),_.dispersion&&a.enable(19),_.retroreflection&&a.enable(24),_.diffuseRoughness&&a.enable(25),_.batchingColor&&a.enable(20),_.gradientMap&&a.enable(21),_.packedNormalMap&&a.enable(22),_.vertexNormals&&a.enable(23),g.push(a.mask),a.disableAll(),_.fog&&a.enable(0),_.useFog&&a.enable(1),_.flatShading&&a.enable(2),_.logarithmicDepthBuffer&&a.enable(3),_.reversedDepthBuffer&&a.enable(4),_.skinning&&a.enable(5),_.morphTargets&&a.enable(6),_.morphNormals&&a.enable(7),_.morphColors&&a.enable(8),_.premultipliedAlpha&&a.enable(9),_.shadowMapEnabled&&a.enable(10),_.doubleSided&&a.enable(11),_.flipSided&&a.enable(12),_.useDepthPacking&&a.enable(13),_.dithering&&a.enable(14),_.transmission&&a.enable(15),_.sheen&&a.enable(16),_.opaque&&a.enable(17),_.pointsUvs&&a.enable(18),_.decodeVideoTexture&&a.enable(19),_.decodeVideoTextureEmissive&&a.enable(20),_.alphaToCoverage&&a.enable(21),_.numLightProbeGrids>0&&a.enable(22),_.hasPositionAttribute&&a.enable(23),g.push(a.mask)}function M(g){const _=h[g.type];let L;if(_){const R=Ti[_];L=ep.clone(R.uniforms)}else L=g.uniforms;return L}function T(g,_){let L=f.get(_);return L!==void 0?++L.usedTimes:(L=new Sv(n,_,g,s),c.push(L),f.set(_,L)),L}function E(g){if(--g.usedTimes===0){const _=c.indexOf(g);c[_]=c[c.length-1],c.pop(),f.delete(g.cacheKey),g.destroy()}}function w(g){o.remove(g)}function y(){o.dispose()}return{getParameters:p,getProgramCacheKey:x,getUniforms:M,acquireProgram:T,releaseProgram:E,releaseShaderCache:w,programs:c,dispose:y}}function Av(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,l){n.get(a)[o]=l}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function Rv(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function Sc(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Mc(){const n=[];let e=0;const t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(h){let d=0;return h.isInstancedMesh&&(d+=2),h.isSkinnedMesh&&(d+=1),d}function o(h,d,p,x,m,v){let M=n[e];return M===void 0?(M={id:h.id,object:h,geometry:d,material:p,materialVariant:a(h),groupOrder:x,renderOrder:h.renderOrder,z:m,group:v},n[e]=M):(M.id=h.id,M.object=h,M.geometry=d,M.material=p,M.materialVariant=a(h),M.groupOrder=x,M.renderOrder=h.renderOrder,M.z=m,M.group=v),e++,M}function l(h,d,p,x,m,v,M){M.reversedDepth===!0&&(m=-m);const T=o(h,d,p,x,m,v);p.transmission>0?i.push(T):p.transparent===!0?s.push(T):t.push(T)}function c(h,d,p,x,m,v){const M=o(h,d,p,x,m,v);p.transmission>0?i.unshift(M):p.transparent===!0?s.unshift(M):t.unshift(M)}function f(h,d){t.length>1&&t.sort(h||Rv),i.length>1&&i.sort(d||Sc),s.length>1&&s.sort(d||Sc)}function u(){for(let h=e,d=n.length;h<d;h++){const p=n[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:l,unshift:c,finish:u,sort:f}}function Cv(){let n=new WeakMap;function e(i,s){const r=n.get(i);let a;return r===void 0?(a=new Mc,n.set(i,[a])):s>=r.length?(a=new Mc,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function Pv(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new K,color:new rt};break;case"SpotLight":t={position:new K,direction:new K,color:new rt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new K,color:new rt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new K,skyColor:new rt,groundColor:new rt};break;case"RectAreaLight":t={color:new rt,position:new K,halfWidth:new K,halfHeight:new K};break}return n[e.id]=t,t}}}function Iv(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let Lv=0;function Dv(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function Nv(n){const e=new Pv,t=Iv(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new K);const s=new K,r=new yt,a=new yt;function o(c){let f=0,u=0,h=0;for(let O=0;O<9;O++)i.probe[O].set(0,0,0);let d=0,p=0,x=0,m=0,v=0,M=0,T=0,E=0,w=0,y=0,g=0,_=0,L=0,R=0;c.sort(Dv);for(let O=0,N=c.length;O<N;O++){const C=c[O],k=C.color,B=C.intensity,H=C.distance;let P=null;if(C.shadow&&C.shadow.map&&(C.shadow.map.texture.format===yn?P=C.shadow.map.texture:P=C.shadow.map.depthTexture||C.shadow.map.texture),C.isAmbientLight)f+=k.r*B,u+=k.g*B,h+=k.b*B;else if(C.isLightProbe){for(let I=0;I<9;I++)i.probe[I].addScaledVector(C.sh.coefficients[I],B);R++}else if(C.isSunLight){const I=e.get(C);if(I.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const z=C.shadow,$=t.get(C);$.shadowIntensity=z.intensity,$.shadowBias=z.bias,$.shadowNormalBias=z.normalBias,$.shadowRadius=z.radius,$.shadowMapSize.copy(z.mapSize).multiply(z.getFrameExtents()),i.sunShadow[p]=$,i.sunShadowMap[p]=P;const te=z.getViewportCount();for(let se=0;se<te;se++)i.sunShadowMatrix[x+se]=z.getMatrix(se),i.sunShadowCascade[x+se]=z._cascadeData[se];x+=te,p++}i.sun[d]=I,d++}else if(C.isDirectionalLight){const I=e.get(C);if(I.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const z=C.shadow,$=t.get(C);$.shadowIntensity=z.intensity,$.shadowBias=z.bias,$.shadowNormalBias=z.normalBias,$.shadowRadius=z.radius,$.shadowMapSize=z.mapSize,i.directionalShadow[m]=$,i.directionalShadowMap[m]=P,i.directionalShadowMatrix[m]=C.shadow.matrix,w++}i.directional[m]=I,m++}else if(C.isSpotLight){const I=e.get(C);I.position.setFromMatrixPosition(C.matrixWorld),I.color.copy(k).multiplyScalar(B),I.distance=H,I.coneCos=Math.cos(C.angle),I.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),I.decay=C.decay,i.spot[M]=I;const z=C.shadow;if(C.map&&(i.spotLightMap[_]=C.map,_++,z.updateMatrices(C),C.castShadow&&L++),i.spotLightMatrix[M]=z.matrix,C.castShadow){const $=t.get(C);$.shadowIntensity=z.intensity,$.shadowBias=z.bias,$.shadowNormalBias=z.normalBias,$.shadowRadius=z.radius,$.shadowMapSize=z.mapSize,i.spotShadow[M]=$,i.spotShadowMap[M]=P,g++}M++}else if(C.isRectAreaLight){const I=e.get(C);I.color.copy(k).multiplyScalar(B),I.halfWidth.set(C.width*.5,0,0),I.halfHeight.set(0,C.height*.5,0),i.rectArea[T]=I,T++}else if(C.isPointLight){const I=e.get(C);if(I.color.copy(C.color).multiplyScalar(C.intensity),I.distance=C.distance,I.decay=C.decay,C.castShadow){const z=C.shadow,$=t.get(C);$.shadowIntensity=z.intensity,$.shadowBias=z.bias,$.shadowNormalBias=z.normalBias,$.shadowRadius=z.radius,$.shadowMapSize=z.mapSize,$.shadowCameraNear=z.camera.near,$.shadowCameraFar=z.camera.far,i.pointShadow[v]=$,i.pointShadowMap[v]=P,i.pointShadowMatrix[v]=C.shadow.matrix,y++}i.point[v]=I,v++}else if(C.isHemisphereLight){const I=e.get(C);I.skyColor.copy(C.color).multiplyScalar(B),I.groundColor.copy(C.groundColor).multiplyScalar(B),i.hemi[E]=I,E++}}T>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=_e.LTC_FLOAT_1,i.rectAreaLTC2=_e.LTC_FLOAT_2):(i.rectAreaLTC1=_e.LTC_HALF_1,i.rectAreaLTC2=_e.LTC_HALF_2)),i.ambient[0]=f,i.ambient[1]=u,i.ambient[2]=h;const A=i.hash;(A.sunLength!==d||A.directionalLength!==m||A.pointLength!==v||A.spotLength!==M||A.rectAreaLength!==T||A.hemiLength!==E||A.numSunShadows!==p||A.numDirectionalShadows!==w||A.numPointShadows!==y||A.numSpotShadows!==g||A.numSpotMaps!==_||A.numLightProbes!==R)&&(i.sun.length=d,i.directional.length=m,i.spot.length=M,i.rectArea.length=T,i.point.length=v,i.hemi.length=E,i.sunShadow.length=p,i.sunShadowMap.length=p,i.sunShadowMatrix.length=x,i.sunShadowCascade.length=x,i.directionalShadow.length=w,i.directionalShadowMap.length=w,i.directionalShadowMatrix.length=w,i.pointShadow.length=y,i.pointShadowMap.length=y,i.pointShadowMatrix.length=y,i.spotShadow.length=g,i.spotShadowMap.length=g,i.spotLightMatrix.length=g+_-L,i.spotLightMap.length=_,i.numSpotLightShadowsWithMaps=L,i.numLightProbes=R,A.sunLength=d,A.directionalLength=m,A.pointLength=v,A.spotLength=M,A.rectAreaLength=T,A.hemiLength=E,A.numSunShadows=p,A.numDirectionalShadows=w,A.numPointShadows=y,A.numSpotShadows=g,A.numSpotMaps=_,A.numLightProbes=R,i.version=Lv++)}function l(c,f){let u=0,h=0,d=0,p=0,x=0,m=0;const v=f.matrixWorldInverse;for(let M=0,T=c.length;M<T;M++){const E=c[M];if(E.isSunLight){const w=i.sun[u];w.direction.setFromMatrixPosition(E.matrixWorld),w.direction.transformDirection(v),u++}else if(E.isDirectionalLight){const w=i.directional[h];w.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(v),h++}else if(E.isSpotLight){const w=i.spot[p];w.position.setFromMatrixPosition(E.matrixWorld),w.position.applyMatrix4(v),w.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(v),p++}else if(E.isRectAreaLight){const w=i.rectArea[x];w.position.setFromMatrixPosition(E.matrixWorld),w.position.applyMatrix4(v),a.identity(),r.copy(E.matrixWorld),r.premultiply(v),a.extractRotation(r),w.halfWidth.set(E.width*.5,0,0),w.halfHeight.set(0,E.height*.5,0),w.halfWidth.applyMatrix4(a),w.halfHeight.applyMatrix4(a),x++}else if(E.isPointLight){const w=i.point[d];w.position.setFromMatrixPosition(E.matrixWorld),w.position.applyMatrix4(v),d++}else if(E.isHemisphereLight){const w=i.hemi[m];w.direction.setFromMatrixPosition(E.matrixWorld),w.direction.transformDirection(v),m++}}}return{setup:o,setupView:l,state:i}}function wc(n){const e=new Nv(n),t=[],i=[],s=[];function r(u){f.camera=u,t.length=0,i.length=0,s.length=0}function a(u){u.isLightProbeGrid?s.push(u):t.push(u)}function o(u){i.push(u)}function l(){e.setup(t),s.sort((u,h)=>u.priority-h.priority||u.id-h.id)}function c(u){e.setupView(t,u)}const f={lightsArray:t,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:f,setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function Uv(n){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new wc(n),e.set(s,[o])):r>=a.length?(o=new wc(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const Fv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Ov=`uniform sampler2D shadow_pass;
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
}`,Bv=[new K(1,0,0),new K(-1,0,0),new K(0,1,0),new K(0,-1,0),new K(0,0,1),new K(0,0,-1)],kv=[new K(0,-1,0),new K(0,-1,0),new K(0,0,1),new K(0,0,-1),new K(0,-1,0),new K(0,-1,0)],bc=new yt,ps=new K,Pa=new K;function Hv(n,e,t){let i=new Nr;const s=new tt,r=new tt,a=new _t,o=new np,l=new sp,c={},f=t.maxTextureSize,u={[_n]:$t,[$t]:_n,[xi]:xi},h=new Mn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new tt},radius:{value:4}},vertexShader:Fv,fragmentShader:Ov}),d=h.clone();d.defines.HORIZONTAL_PASS=1;const p=new an;p.setAttribute("position",new xn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new Gi(p,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=mr;let v=this.type;this.render=function(y,g,_){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||y.length===0)return;this.type===$f&&(Ne("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=mr);const L=n.getRenderTarget(),R=n.getActiveCubeFace(),A=n.getActiveMipmapLevel(),O=n.state;O.setBlending(Kn),O.buffers.depth.getReversed()===!0?O.buffers.color.setClear(0,0,0,0):O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);const N=v!==this.type;N&&g.traverse(function(C){C.material&&(Array.isArray(C.material)?C.material.forEach(k=>k.needsUpdate=!0):C.material.needsUpdate=!0)});for(let C=0,k=y.length;C<k;C++){const B=y[C],H=B.shadow;if(H===void 0){Ne("WebGLShadowMap:",B,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;s.copy(H.mapSize);const P=H.getFrameExtents();s.multiply(P),r.copy(H.mapSize),(s.x>f||s.y>f)&&(s.x>f&&(r.x=Math.floor(f/P.x),s.x=r.x*P.x,H.mapSize.x=r.x),s.y>f&&(r.y=Math.floor(f/P.y),s.y=r.y*P.y,H.mapSize.y=r.y));const I=n.state.buffers.depth.getReversed();if(H.camera._reversedDepth=I,H.map===null||N===!0){if(H.map!==null&&(H.map.depthTexture!==null&&(H.map.depthTexture.dispose(),H.map.depthTexture=null),H.map.dispose()),this.type===ms){if(B.isPointLight){Ne("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}H.map=new Ci(s.x,s.y,{format:yn,type:Ii,minFilter:qt,magFilter:qt,generateMipmaps:!1}),H.map.texture.name=B.name+".shadowMap",H.map.depthTexture=new es(s.x,s.y,Ri),H.map.depthTexture.name=B.name+".shadowMapDepth",H.map.depthTexture.format=rn,H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Pt,H.map.depthTexture.magFilter=Pt}else B.isPointLight?(H.map=new Zo(s.x),H.map.depthTexture=new Lh(s.x,Pi)):(H.map=new Ci(s.x,s.y),H.map.depthTexture=new es(s.x,s.y,Pi)),H.map.depthTexture.name=B.name+".shadowMap",H.map.depthTexture.format=rn,this.type===mr?(H.map.depthTexture.compareFunction=I?Mh:Sh,H.map.depthTexture.minFilter=qt,H.map.depthTexture.magFilter=qt):(H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Pt,H.map.depthTexture.magFilter=Pt);H.camera.updateProjectionMatrix()}H.map.isWebGLCubeRenderTarget!==!0&&(H.map.width!==s.x||H.map.height!==s.y)&&H.map.setSize(s.x,s.y);const z=H.map.isWebGLCubeRenderTarget?6:H.getViewportCount();B.isPointLight!==!0&&H.updateMatrices(B,_);const $=(H.camera.layers.mask&4294967294)!==0?H.camera.layers:_.layers;for(let te=0;te<z;te++){const se=H.getCamera(te);if(B.isPointLight){const q=H.camera,ne=H.matrix,fe=B.distance||q.far;fe!==q.far&&(q.far=fe,q.updateProjectionMatrix()),ps.setFromMatrixPosition(B.matrixWorld),q.position.copy(ps),Pa.copy(q.position),Pa.add(Bv[te]),q.up.copy(kv[te]),q.lookAt(Pa),q.updateMatrixWorld(),ne.makeTranslation(-ps.x,-ps.y,-ps.z),bc.multiplyMatrices(q.projectionMatrix,q.matrixWorldInverse),H._frustum.setFromProjectionMatrix(bc,q.coordinateSystem,q.reversedDepth)}if(H.map.isWebGLCubeRenderTarget)n.setRenderTarget(H.map,te),n.clear();else{te===0&&(n.setRenderTarget(H.map),n.clear());const q=H.getViewport(te);a.set(r.x*q.x,r.y*q.y,r.x*q.z,r.y*q.w),O.viewport(a)}i=H.getFrustum(te),E(g,_,se,B,$,this.type)}H.isPointLightShadow!==!0&&this.type===ms&&M(H,_),H.needsUpdate=!1}v=this.type,m.needsUpdate=!1,n.setRenderTarget(L,R,A)};function M(y,g){const _=e.update(x);h.defines.VSM_SAMPLES!==y.blurSamples&&(h.defines.VSM_SAMPLES=y.blurSamples,d.defines.VSM_SAMPLES=y.blurSamples,h.needsUpdate=!0,d.needsUpdate=!0),y.mapPass===null?y.mapPass=new Ci(s.x,s.y,{format:yn,type:Ii}):(y.mapPass.width!==y.map.width||y.mapPass.height!==y.map.height)&&y.mapPass.setSize(y.map.width,y.map.height),h.uniforms.shadow_pass.value=y.map.depthTexture,h.uniforms.resolution.value.set(y.map.width,y.map.height),h.uniforms.radius.value=y.radius,n.setRenderTarget(y.mapPass),n.clear(),n.renderBufferDirect(g,null,_,h,x,null),d.uniforms.shadow_pass.value=y.mapPass.texture,d.uniforms.resolution.value.set(y.map.width,y.map.height),d.uniforms.radius.value=y.radius,n.setRenderTarget(y.map),n.clear(),n.renderBufferDirect(g,null,_,d,x,null)}function T(y,g,_,L){let R=null;const A=_.isPointLight===!0?y.customDistanceMaterial:y.customDepthMaterial;if(A!==void 0)R=A;else if(R=_.isPointLight===!0?l:o,n.localClippingEnabled&&g.clipShadows===!0&&Array.isArray(g.clippingPlanes)&&g.clippingPlanes.length!==0||g.displacementMap&&g.displacementScale!==0||g.alphaMap&&g.alphaTest>0||g.map&&g.alphaTest>0||g.alphaToCoverage===!0){const O=R.uuid,N=g.uuid;let C=c[O];C===void 0&&(C={},c[O]=C);let k=C[N];k===void 0&&(k=R.clone(),C[N]=k,g.addEventListener("dispose",w)),R=k}if(R.visible=g.visible,R.wireframe=g.wireframe,L===ms?R.side=g.shadowSide!==null?g.shadowSide:g.side:R.side=g.shadowSide!==null?g.shadowSide:u[g.side],R.alphaMap=g.alphaMap,R.alphaTest=g.alphaToCoverage===!0?.5:g.alphaTest,R.map=g.map,R.clipShadows=g.clipShadows,R.clippingPlanes=g.clippingPlanes,R.clipIntersection=g.clipIntersection,R.displacementMap=g.displacementMap,R.displacementScale=g.displacementScale,R.displacementBias=g.displacementBias,R.wireframeLinewidth=g.wireframeLinewidth,R.linewidth=g.linewidth,_.isPointLight===!0&&R.isMeshDistanceMaterial===!0){const O=n.properties.get(R);O.light=_}return R}function E(y,g,_,L,R,A){if(y.visible===!1)return;if(y.layers.test(R)&&(y.isMesh||y.isLine||y.isPoints)&&(y.castShadow||y.receiveShadow&&A===ms)&&(!y.frustumCulled||y.intersectsFrustum(i))){y.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,y.matrixWorld);const C=e.update(y),k=y.material;if(Array.isArray(k)){const B=C.groups;for(let H=0,P=B.length;H<P;H++){const I=B[H],z=k[I.materialIndex];if(z&&z.visible){const $=T(y,z,L,A);y.onBeforeShadow(n,y,g,_,C,$,I),n.renderBufferDirect(_,null,C,$,y,I),y.onAfterShadow(n,y,g,_,C,$,I)}}}else if(k.visible){const B=T(y,k,L,A);y.onBeforeShadow(n,y,g,_,C,B,null),n.renderBufferDirect(_,null,C,B,y,null),y.onAfterShadow(n,y,g,_,C,B,null)}}const N=y.children;for(let C=0,k=N.length;C<k;C++)E(N[C],g,_,L,R,A)}function w(y){y.target.removeEventListener("dispose",w);for(const _ in c){const L=c[_],R=y.target.uuid;R in L&&(L[R].dispose(),delete L[R])}}}function zv(n,e){function t(){let U=!1;const Q=new _t;let Z=null;const ue=new _t(0,0,0,0);return{setMask:function(oe){Z!==oe&&!U&&(n.colorMask(oe,oe,oe,oe),Z=oe)},setLocked:function(oe){U=oe},setClear:function(oe,ce,Ce,ze,ae){ae===!0&&(oe*=ze,ce*=ze,Ce*=ze),Q.set(oe,ce,Ce,ze),ue.equals(Q)===!1&&(n.clearColor(oe,ce,Ce,ze),ue.copy(Q))},reset:function(){U=!1,Z=null,ue.set(-1,0,0,0)}}}function i(){let U=!1,Q=!1,Z=null,ue=null,oe=null;return{setReversed:function(ce){if(Q!==ce){const Ce=e.get("EXT_clip_control");ce?Ce.clipControlEXT(Ce.LOWER_LEFT_EXT,Ce.ZERO_TO_ONE_EXT):Ce.clipControlEXT(Ce.LOWER_LEFT_EXT,Ce.NEGATIVE_ONE_TO_ONE_EXT),Q=ce;const ze=oe;oe=null,this.setClear(ze)}},getReversed:function(){return Q},setTest:function(ce){ce?de(n.DEPTH_TEST):Pe(n.DEPTH_TEST)},setMask:function(ce){Z!==ce&&!U&&(n.depthMask(ce),Z=ce)},setFunc:function(ce){if(Q&&(ce=bd[ce]),ue!==ce){switch(ce){case za:n.depthFunc(n.NEVER);break;case Ga:n.depthFunc(n.ALWAYS);break;case Va:n.depthFunc(n.LESS);break;case Ss:n.depthFunc(n.LEQUAL);break;case Wa:n.depthFunc(n.EQUAL);break;case Xa:n.depthFunc(n.GEQUAL);break;case qa:n.depthFunc(n.GREATER);break;case $a:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ue=ce}},setLocked:function(ce){U=ce},setClear:function(ce){oe!==ce&&(oe=ce,Q&&(ce=1-ce),n.clearDepth(ce))},reset:function(){U=!1,Z=null,ue=null,oe=null,Q=!1}}}function s(){let U=!1,Q=null,Z=null,ue=null,oe=null,ce=null,Ce=null,ze=null,ae=null;return{setTest:function(Ie){U||(Ie?de(n.STENCIL_TEST):Pe(n.STENCIL_TEST))},setMask:function(Ie){Q!==Ie&&!U&&(n.stencilMask(Ie),Q=Ie)},setFunc:function(Ie,ke,xe){(Z!==Ie||ue!==ke||oe!==xe)&&(n.stencilFunc(Ie,ke,xe),Z=Ie,ue=ke,oe=xe)},setOp:function(Ie,ke,xe){(ce!==Ie||Ce!==ke||ze!==xe)&&(n.stencilOp(Ie,ke,xe),ce=Ie,Ce=ke,ze=xe)},setLocked:function(Ie){U=Ie},setClear:function(Ie){ae!==Ie&&(n.clearStencil(Ie),ae=Ie)},reset:function(){U=!1,Q=null,Z=null,ue=null,oe=null,ce=null,Ce=null,ze=null,ae=null}}}const r=new t,a=new i,o=new s;let l={};const c=new WeakMap;let f={},u={},h={},d=new WeakMap,p=[],x=null,m=!1,v=null,M=null,T=null,E=null,w=null,y=null,g=null,_=new rt(0,0,0),L=0,R=!1,A=null,O=null,N=null,C=null,k=null;const B=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,P=0;const I=n.getParameter(n.VERSION);I.indexOf("WebGL")!==-1?(P=parseFloat(/^WebGL (\d)/.exec(I)[1]),H=P>=1):I.indexOf("OpenGL ES")!==-1&&(P=parseFloat(/^OpenGL ES (\d)/.exec(I)[1]),H=P>=2);let z=null,$={};const te=n.getParameter(n.SCISSOR_BOX),se=n.getParameter(n.VIEWPORT),q=new _t().fromArray(te),ne=new _t().fromArray(se);function fe(U,Q,Z,ue){const oe=new Uint8Array(4),ce=n.createTexture();n.bindTexture(U,ce),n.texParameteri(U,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(U,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ce=0;Ce<Z;Ce++)U===n.TEXTURE_3D||U===n.TEXTURE_2D_ARRAY?n.texImage3D(Q,0,n.RGBA,1,1,ue,0,n.RGBA,n.UNSIGNED_BYTE,oe):n.texImage2D(Q+Ce,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,oe);return ce}const we={};we[n.TEXTURE_2D]=fe(n.TEXTURE_2D,n.TEXTURE_2D,1),we[n.TEXTURE_CUBE_MAP]=fe(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),we[n.TEXTURE_2D_ARRAY]=fe(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),we[n.TEXTURE_3D]=fe(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),de(n.DEPTH_TEST),a.setFunc(Ss),Ze(!1),it(Ll),de(n.CULL_FACE),Re(Kn);function de(U){f[U]!==!0&&(n.enable(U),f[U]=!0)}function Pe(U){f[U]!==!1&&(n.disable(U),f[U]=!1)}function je(U,Q){return h[U]!==Q?(n.bindFramebuffer(U,Q),h[U]=Q,U===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=Q),U===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=Q),!0):!1}function Te(U,Q){let Z=p,ue=!1;if(U){Z=d.get(Q),Z===void 0&&(Z=[],d.set(Q,Z));const oe=U.textures;if(Z.length!==oe.length||Z[0]!==n.COLOR_ATTACHMENT0){for(let ce=0,Ce=oe.length;ce<Ce;ce++)Z[ce]=n.COLOR_ATTACHMENT0+ce;Z.length=oe.length,ue=!0}}else Z[0]!==n.BACK&&(Z[0]=n.BACK,ue=!0);ue&&n.drawBuffers(Z)}function qe(U){return x!==U?(n.useProgram(U),x=U,!0):!1}const Ke={[Bi]:n.FUNC_ADD,[Yf]:n.FUNC_SUBTRACT,[sh]:n.FUNC_REVERSE_SUBTRACT};Ke[Kf]=n.MIN,Ke[Zf]=n.MAX;const ie={[Jf]:n.ZERO,[Ha]:n.ONE,[jf]:n.SRC_COLOR,[rh]:n.SRC_ALPHA,[sd]:n.SRC_ALPHA_SATURATE,[id]:n.DST_COLOR,[ed]:n.DST_ALPHA,[Qf]:n.ONE_MINUS_SRC_COLOR,[Ar]:n.ONE_MINUS_SRC_ALPHA,[nd]:n.ONE_MINUS_DST_COLOR,[td]:n.ONE_MINUS_DST_ALPHA,[rd]:n.CONSTANT_COLOR,[ad]:n.ONE_MINUS_CONSTANT_COLOR,[od]:n.CONSTANT_ALPHA,[ld]:n.ONE_MINUS_CONSTANT_ALPHA};function Re(U,Q,Z,ue,oe,ce,Ce,ze,ae,Ie){if(U===Kn){m===!0&&(Pe(n.BLEND),m=!1);return}if(m===!1&&(de(n.BLEND),m=!0),U!==nh){if(U!==v||Ie!==R){if((M!==Bi||w!==Bi)&&(n.blendEquation(n.FUNC_ADD),M=Bi,w=Bi),Ie)switch(U){case ys:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Dl:n.blendFunc(n.ONE,n.ONE);break;case Nl:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Ul:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:et("WebGLState: Invalid blending: ",U);break}else switch(U){case ys:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Dl:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Nl:et("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Ul:et("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:et("WebGLState: Invalid blending: ",U);break}T=null,E=null,y=null,g=null,_.set(0,0,0),L=0,v=U,R=Ie}return}oe=oe||Q,ce=ce||Z,Ce=Ce||ue,(Q!==M||oe!==w)&&(n.blendEquationSeparate(Ke[Q],Ke[oe]),M=Q,w=oe),(Z!==T||ue!==E||ce!==y||Ce!==g)&&(n.blendFuncSeparate(ie[Z],ie[ue],ie[ce],ie[Ce]),T=Z,E=ue,y=ce,g=Ce),(ze.equals(_)===!1||ae!==L)&&(n.blendColor(ze.r,ze.g,ze.b,ae),_.copy(ze),L=ae),v=U,R=!1}function Se(U,Q){U.side===xi?Pe(n.CULL_FACE):de(n.CULL_FACE);let Z=U.side===$t;Q&&(Z=!Z),Ze(Z),U.blending===ys&&U.transparent===!1?Re(Kn):Re(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),a.setFunc(U.depthFunc),a.setTest(U.depthTest),a.setMask(U.depthWrite),r.setMask(U.colorWrite);const ue=U.stencilWrite;o.setTest(ue),ue&&(o.setMask(U.stencilWriteMask),o.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),o.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),He(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?de(n.SAMPLE_ALPHA_TO_COVERAGE):Pe(n.SAMPLE_ALPHA_TO_COVERAGE)}function Ze(U){A!==U&&(U?n.frontFace(n.CW):n.frontFace(n.CCW),A=U)}function it(U){U!==Xf?(de(n.CULL_FACE),U!==O&&(U===Ll?n.cullFace(n.BACK):U===qf?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Pe(n.CULL_FACE),O=U}function Wt(U){U!==N&&(H&&n.lineWidth(U),N=U)}function He(U,Q,Z){U?(de(n.POLYGON_OFFSET_FILL),(C!==Q||k!==Z)&&(C=Q,k=Z,a.getReversed()&&(Q=-Q,Z=-Z),n.polygonOffset(Q,Z))):Pe(n.POLYGON_OFFSET_FILL)}function Dt(U){U?de(n.SCISSOR_TEST):Pe(n.SCISSOR_TEST)}function ei(U){U===void 0&&(U=n.TEXTURE0+B-1),z!==U&&(n.activeTexture(U),z=U)}function ti(U,Q,Z){Z===void 0&&(z===null?Z=n.TEXTURE0+B-1:Z=z);let ue=$[Z];ue===void 0&&(ue={type:void 0,texture:void 0},$[Z]=ue),(ue.type!==U||ue.texture!==Q)&&(z!==Z&&(n.activeTexture(Z),z=Z),n.bindTexture(U,Q||we[U]),ue.type=U,ue.texture=Q)}function G(){const U=$[z];U!==void 0&&U.type!==void 0&&(n.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function ii(){try{n.compressedTexImage2D(...arguments)}catch(U){et("WebGLState:",U)}}function mt(){try{n.compressedTexImage3D(...arguments)}catch(U){et("WebGLState:",U)}}function gt(){try{n.texSubImage2D(...arguments)}catch(U){et("WebGLState:",U)}}function ve(){try{n.texSubImage3D(...arguments)}catch(U){et("WebGLState:",U)}}function bt(){try{n.compressedTexSubImage2D(...arguments)}catch(U){et("WebGLState:",U)}}function De(){try{n.compressedTexSubImage3D(...arguments)}catch(U){et("WebGLState:",U)}}function Ue(){try{n.texStorage2D(...arguments)}catch(U){et("WebGLState:",U)}}function D(){try{n.texStorage3D(...arguments)}catch(U){et("WebGLState:",U)}}function S(){try{n.texImage2D(...arguments)}catch(U){et("WebGLState:",U)}}function W(){try{n.texImage3D(...arguments)}catch(U){et("WebGLState:",U)}}function re(U){return u[U]!==void 0?u[U]:n.getParameter(U)}function ee(U,Q){u[U]!==Q&&(n.pixelStorei(U,Q),u[U]=Q)}function le(U){q.equals(U)===!1&&(n.scissor(U.x,U.y,U.z,U.w),q.copy(U))}function me(U){ne.equals(U)===!1&&(n.viewport(U.x,U.y,U.z,U.w),ne.copy(U))}function J(U,Q){let Z=c.get(Q);Z===void 0&&(Z=new WeakMap,c.set(Q,Z));let ue=Z.get(U);ue===void 0&&(ue=n.getUniformBlockIndex(Q,U.name),n.uniformBlockBinding(Q,ue,ue),Z.set(U,ue))}function j(U,Q,Z){const oe=c.get(Q).get(U);l[oe]!==Z&&(n.bindBufferBase(n.UNIFORM_BUFFER,oe,Z),l[oe]=Z)}function he(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),f={},u={},z=null,$={},h={},l={},d=new WeakMap,p=[],x=null,m=!1,v=null,M=null,T=null,E=null,w=null,y=null,g=null,_=new rt(0,0,0),L=0,R=!1,A=null,O=null,N=null,C=null,k=null,q.set(0,0,n.canvas.width,n.canvas.height),ne.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:de,disable:Pe,bindFramebuffer:je,drawBuffers:Te,useProgram:qe,setBlending:Re,setMaterial:Se,setFlipSided:Ze,setCullFace:it,setLineWidth:Wt,setPolygonOffset:He,setScissorTest:Dt,activeTexture:ei,bindTexture:ti,unbindTexture:G,compressedTexImage2D:ii,compressedTexImage3D:mt,texImage2D:S,texImage3D:W,pixelStorei:ee,getParameter:re,updateUBOMapping:J,uniformBlockBinding:j,texStorage2D:Ue,texStorage3D:D,texSubImage2D:gt,texSubImage3D:ve,compressedTexSubImage2D:bt,compressedTexSubImage3D:De,scissor:le,viewport:me,reset:he}}function Gv(n,e,t,i,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new tt,f=new WeakMap,u=new Set;let h;const d=new WeakMap,p=new Set,x=new FinalizationRegistry(D=>p.delete(D));let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(D,S){return m?new OffscreenCanvas(D,S):Dr("canvas")}function M(D,S,W){let re=1;const ee=Ue(D);if((ee.width>W||ee.height>W)&&(re=W/Math.max(ee.width,ee.height)),re<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){const le=Math.floor(re*ee.width),me=Math.floor(re*ee.height);h===void 0&&(h=v(le,me));const J=S?v(le,me):h;return J.width=le,J.height=me,J.getContext("2d").drawImage(D,0,0,le,me),Ne("WebGLRenderer: Texture has been resized from ("+ee.width+"x"+ee.height+") to ("+le+"x"+me+")."),J}else return"data"in D&&Ne("WebGLRenderer: Image in DataTexture is too big ("+ee.width+"x"+ee.height+")."),D;return D}function T(D){return D.generateMipmaps}function E(D){n.generateMipmap(D)}function w(D){return D.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:D.isWebGL3DRenderTarget?n.TEXTURE_3D:D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function y(D,S,W,re,ee,le=!1){if(D!==null){if(n[D]!==void 0)return n[D];Ne("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let me;re&&(me=e.get("EXT_texture_norm16"),me||Ne("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let J=S;if(S===n.RED&&(W===n.FLOAT&&(J=n.R32F),W===n.HALF_FLOAT&&(J=n.R16F),W===n.UNSIGNED_BYTE&&(J=n.R8),W===n.UNSIGNED_SHORT&&me&&(J=me.R16_EXT),W===n.SHORT&&me&&(J=me.R16_SNORM_EXT)),S===n.RED_INTEGER&&(W===n.UNSIGNED_BYTE&&(J=n.R8UI),W===n.UNSIGNED_SHORT&&(J=n.R16UI),W===n.UNSIGNED_INT&&(J=n.R32UI),W===n.BYTE&&(J=n.R8I),W===n.SHORT&&(J=n.R16I),W===n.INT&&(J=n.R32I)),S===n.RG&&(W===n.FLOAT&&(J=n.RG32F),W===n.HALF_FLOAT&&(J=n.RG16F),W===n.UNSIGNED_BYTE&&(J=n.RG8),W===n.UNSIGNED_SHORT&&me&&(J=me.RG16_EXT),W===n.SHORT&&me&&(J=me.RG16_SNORM_EXT)),S===n.RG_INTEGER&&(W===n.UNSIGNED_BYTE&&(J=n.RG8UI),W===n.UNSIGNED_SHORT&&(J=n.RG16UI),W===n.UNSIGNED_INT&&(J=n.RG32UI),W===n.BYTE&&(J=n.RG8I),W===n.SHORT&&(J=n.RG16I),W===n.INT&&(J=n.RG32I)),S===n.RGB_INTEGER&&(W===n.UNSIGNED_BYTE&&(J=n.RGB8UI),W===n.UNSIGNED_SHORT&&(J=n.RGB16UI),W===n.UNSIGNED_INT&&(J=n.RGB32UI),W===n.BYTE&&(J=n.RGB8I),W===n.SHORT&&(J=n.RGB16I),W===n.INT&&(J=n.RGB32I)),S===n.RGBA_INTEGER&&(W===n.UNSIGNED_BYTE&&(J=n.RGBA8UI),W===n.UNSIGNED_SHORT&&(J=n.RGBA16UI),W===n.UNSIGNED_INT&&(J=n.RGBA32UI),W===n.BYTE&&(J=n.RGBA8I),W===n.SHORT&&(J=n.RGBA16I),W===n.INT&&(J=n.RGBA32I)),S===n.RGB&&(W===n.UNSIGNED_SHORT&&me&&(J=me.RGB16_EXT),W===n.SHORT&&me&&(J=me.RGB16_SNORM_EXT),W===n.UNSIGNED_INT_5_9_9_9_REV&&(J=n.RGB9_E5),W===n.UNSIGNED_INT_10F_11F_11F_REV&&(J=n.R11F_G11F_B10F)),S===n.RGBA){const j=le?Pr:$e.getTransfer(ee);W===n.FLOAT&&(J=n.RGBA32F),W===n.HALF_FLOAT&&(J=n.RGBA16F),W===n.UNSIGNED_BYTE&&(J=j===ot?n.SRGB8_ALPHA8:n.RGBA8),W===n.UNSIGNED_SHORT&&me&&(J=me.RGBA16_EXT),W===n.SHORT&&me&&(J=me.RGBA16_SNORM_EXT),W===n.UNSIGNED_SHORT_4_4_4_4&&(J=n.RGBA4),W===n.UNSIGNED_SHORT_5_5_5_1&&(J=n.RGB5_A1)}return(J===n.R16F||J===n.R32F||J===n.RG16F||J===n.RG32F||J===n.RGBA16F||J===n.RGBA32F)&&e.get("EXT_color_buffer_float"),J}function g(D,S){let W;return D?S===null||S===Pi||S===Qn?W=n.DEPTH24_STENCIL8:S===Ri?W=n.DEPTH32F_STENCIL8:S===ws&&(W=n.DEPTH24_STENCIL8,Ne("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===Pi||S===Qn?W=n.DEPTH_COMPONENT24:S===Ri?W=n.DEPTH_COMPONENT32F:S===ws&&(W=n.DEPTH_COMPONENT16),W}function _(D,S){return T(D)===!0||D.isFramebufferTexture&&D.minFilter!==Pt&&D.minFilter!==qt?Math.log2(Math.max(S.width,S.height))+1:D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?S.mipmaps.length:1}function L(D){const S=new WeakRef(D);i.get(D).__ref=S,p.add(S),x.register(D,S,S)}function R(D){const S=i.get(D).__ref;S!==void 0&&(p.delete(S),x.unregister(S))}function A(D){N(D.target)}function O(D){C(D.target)}function N(D){D.removeEventListener("dispose",A),R(D),B(D),D.isVideoTexture&&f.delete(D),D.isHTMLTexture&&u.delete(D)}function C(D){D.removeEventListener("dispose",O),R(D),P(D)}function k(){for(const D of p){const S=D.deref();S!==void 0&&(S.isRenderTarget===!0?C(S):N(S))}p.clear(),u.clear()}function B(D){const S=i.get(D);if(S.__webglInit===void 0)return;const W=D.source,re=d.get(W);if(re){const ee=re[S.__cacheKey];ee.usedTimes--,ee.usedTimes===0&&H(D),Object.keys(re).length===0&&d.delete(W)}i.remove(D)}function H(D){const S=i.get(D);n.deleteTexture(S.__webglTexture);const W=D.source,re=d.get(W);delete re[S.__cacheKey],a.memory.textures--}function P(D){const S=i.get(D);S.__depthDisposeCallback&&S.__depthDisposeCallback();const W=D.depthTexture;if(W&&W.renderTarget===D&&N(W),D.isWebGLCubeRenderTarget)for(let ee=0;ee<6;ee++){if(Array.isArray(S.__webglFramebuffer[ee]))for(let le=0;le<S.__webglFramebuffer[ee].length;le++)n.deleteFramebuffer(S.__webglFramebuffer[ee][le]);else n.deleteFramebuffer(S.__webglFramebuffer[ee]);S.__webglDepthbuffer&&n.deleteRenderbuffer(S.__webglDepthbuffer[ee])}else{if(Array.isArray(S.__webglFramebuffer))for(let ee=0;ee<S.__webglFramebuffer.length;ee++)n.deleteFramebuffer(S.__webglFramebuffer[ee]);else n.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&n.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&n.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let ee=0;ee<S.__webglColorRenderbuffer.length;ee++)S.__webglColorRenderbuffer[ee]&&n.deleteRenderbuffer(S.__webglColorRenderbuffer[ee]);S.__webglDepthRenderbuffer&&n.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const re=D.textures;for(let ee=0,le=re.length;ee<le;ee++){const me=i.get(re[ee]);me.__webglTexture&&(n.deleteTexture(me.__webglTexture),a.memory.textures--),i.remove(re[ee])}i.remove(D)}let I=0;function z(){I=0}function $(){return I}function te(D){I=D}function se(){const D=I;return D>=s.maxTextures&&Ne("WebGLTextures: Trying to use "+(D+1)+" texture units while this GPU supports only "+s.maxTextures),I+=1,D}function q(D){const S=[];return S.push(D.wrapS),S.push(D.wrapT),S.push(D.wrapR||0),S.push(D.magFilter),S.push(D.minFilter),S.push(D.anisotropy),S.push(D.internalFormat),S.push(D.format),S.push(D.type),S.push(D.generateMipmaps),S.push(D.mipmapsAutoUpdate),S.push(D.premultiplyAlpha),S.push(D.flipY),S.push(D.unpackAlignment),S.push(D.colorSpace),S.join()}function ne(D,S){const W=i.get(D);if(D.isVideoTexture&&bt(D),D.isRenderTargetTexture===!1&&D.isExternalTexture!==!0&&D.version>0&&W.__version!==D.version){const re=D.image;if(re===null)Ne("WebGLRenderer: Texture marked for update but no image data found.");else if(re.complete===!1)Ne("WebGLRenderer: Texture marked for update but image is incomplete");else{Se(W,D,S);return}}else D.isExternalTexture&&(W.__webglTexture=D.sourceTexture?D.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,W.__webglTexture,n.TEXTURE0+S)}function fe(D,S){const W=i.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&W.__version!==D.version){Se(W,D,S);return}else D.isExternalTexture&&(W.__webglTexture=D.sourceTexture?D.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,W.__webglTexture,n.TEXTURE0+S)}function we(D,S){const W=i.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&W.__version!==D.version){Se(W,D,S);return}t.bindTexture(n.TEXTURE_3D,W.__webglTexture,n.TEXTURE0+S)}function de(D,S){const W=i.get(D);if(D.version>0&&W.__version!==D.version){Ze(W,D,S);return}t.bindTexture(n.TEXTURE_CUBE_MAP,W.__webglTexture,n.TEXTURE0+S)}const Pe={[Ya]:n.REPEAT,[Ai]:n.CLAMP_TO_EDGE,[Ka]:n.MIRRORED_REPEAT},je={[Pt]:n.NEAREST,[ud]:n.NEAREST_MIPMAP_NEAREST,[Bs]:n.NEAREST_MIPMAP_LINEAR,[qt]:n.LINEAR,[ra]:n.LINEAR_MIPMAP_NEAREST,[nn]:n.LINEAR_MIPMAP_LINEAR},Te={[md]:n.NEVER,[wh]:n.ALWAYS,[gd]:n.LESS,[Sh]:n.LEQUAL,[vd]:n.EQUAL,[Mh]:n.GEQUAL,[xd]:n.GREATER,[_d]:n.NOTEQUAL};function qe(D,S){if(S.type===Ri&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===qt||S.magFilter===ra||S.magFilter===Bs||S.magFilter===nn||S.minFilter===qt||S.minFilter===ra||S.minFilter===Bs||S.minFilter===nn)&&Ne("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(D,n.TEXTURE_WRAP_S,Pe[S.wrapS]),n.texParameteri(D,n.TEXTURE_WRAP_T,Pe[S.wrapT]),(D===n.TEXTURE_3D||D===n.TEXTURE_2D_ARRAY)&&n.texParameteri(D,n.TEXTURE_WRAP_R,Pe[S.wrapR]),n.texParameteri(D,n.TEXTURE_MAG_FILTER,je[S.magFilter]),n.texParameteri(D,n.TEXTURE_MIN_FILTER,je[S.minFilter]),S.compareFunction&&(n.texParameteri(D,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(D,n.TEXTURE_COMPARE_FUNC,Te[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===Pt||S.minFilter!==Bs&&S.minFilter!==nn||S.type===Ri&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||i.get(S).__currentAnisotropy){const W=e.get("EXT_texture_filter_anisotropic");n.texParameterf(D,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),i.get(S).__currentAnisotropy=S.anisotropy}}}function Ke(D,S){let W=!1;D.__webglInit===void 0&&(D.__webglInit=!0,S.addEventListener("dispose",A),L(S));const re=S.source;let ee=d.get(re);ee===void 0&&(ee={},d.set(re,ee));const le=q(S);if(le!==D.__cacheKey){ee[le]===void 0&&(ee[le]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,W=!0),ee[le].usedTimes++;const me=ee[D.__cacheKey];me!==void 0&&(ee[D.__cacheKey].usedTimes--,me.usedTimes===0&&H(S)),D.__cacheKey=le,D.__webglTexture=ee[le].texture}return W}function ie(D,S,W){return Math.floor(Math.floor(D/W)/S)}function Re(D,S,W,re){const le=D.updateRanges;if(le.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,S.width,S.height,W,re,S.data);else{le.sort((U,Q)=>U.start-Q.start);let me=0;for(let U=1;U<le.length;U++){const Q=le[me],Z=le[U],ue=Q.start+Q.count,oe=ie(Z.start,S.width,4),ce=ie(Q.start,S.width,4);Z.start<=ue+1&&oe===ce&&ie(Z.start+Z.count-1,S.width,4)===oe?Q.count=Math.max(Q.count,Z.start+Z.count-Q.start):(++me,le[me]=Z)}le.length=me+1;const J=t.getParameter(n.UNPACK_ROW_LENGTH),j=t.getParameter(n.UNPACK_SKIP_PIXELS),he=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,S.width);for(let U=0,Q=le.length;U<Q;U++){const Z=le[U],ue=Math.floor(Z.start/4),oe=Math.ceil(Z.count/4),ce=ue%S.width,Ce=Math.floor(ue/S.width),ze=oe,ae=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,ce),t.pixelStorei(n.UNPACK_SKIP_ROWS,Ce),t.texSubImage2D(n.TEXTURE_2D,0,ce,Ce,ze,ae,W,re,S.data)}D.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,J),t.pixelStorei(n.UNPACK_SKIP_PIXELS,j),t.pixelStorei(n.UNPACK_SKIP_ROWS,he)}}function Se(D,S,W){let re=n.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(re=n.TEXTURE_2D_ARRAY),S.isData3DTexture&&(re=n.TEXTURE_3D);const ee=Ke(D,S),le=S.source;t.bindTexture(re,D.__webglTexture,n.TEXTURE0+W);const me=i.get(le);if(le.version!==me.__version||ee===!0){if(t.activeTexture(n.TEXTURE0+W),(typeof ImageBitmap<"u"&&S.image instanceof ImageBitmap)===!1){const ae=$e.getPrimaries($e.workingColorSpace),Ie=S.colorSpace===en?null:$e.getPrimaries(S.colorSpace),ke=S.colorSpace===en||ae===Ie?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ke)}t.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment);let j=M(S.image,!1,s.maxTextureSize);j=De(S,j);const he=r.convert(S.format,S.colorSpace),U=r.convert(S.type);let Q=y(S.internalFormat,he,U,S.normalized,S.colorSpace,S.isVideoTexture);qe(re,S);let Z;const ue=S.mipmaps,oe=S.isVideoTexture!==!0,ce=me.__version===void 0||ee===!0,Ce=le.dataReady,ze=_(S,j);if(S.isDepthTexture)Q=g(S.format===sn,S.type),ce&&(oe?t.texStorage2D(n.TEXTURE_2D,1,Q,j.width,j.height):t.texImage2D(n.TEXTURE_2D,0,Q,j.width,j.height,0,he,U,null));else if(S.isDataTexture)if(ue.length>0){oe&&ce&&t.texStorage2D(n.TEXTURE_2D,ze,Q,ue[0].width,ue[0].height);for(let ae=0,Ie=ue.length;ae<Ie;ae++)Z=ue[ae],oe?Ce&&t.texSubImage2D(n.TEXTURE_2D,ae,0,0,Z.width,Z.height,he,U,Z.data):t.texImage2D(n.TEXTURE_2D,ae,Q,Z.width,Z.height,0,he,U,Z.data);S.generateMipmaps=!1}else oe?(ce&&t.texStorage2D(n.TEXTURE_2D,ze,Q,j.width,j.height),Ce&&Re(S,j,he,U)):t.texImage2D(n.TEXTURE_2D,0,Q,j.width,j.height,0,he,U,j.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){oe&&ce&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ze,Q,ue[0].width,ue[0].height,j.depth);for(let ae=0,Ie=ue.length;ae<Ie;ae++)if(Z=ue[ae],S.format!==yi)if(he!==null)if(oe){if(Ce)if(S.layerUpdates.size>0){const ke=nc(Z.width,Z.height,S.format,S.type);for(const xe of S.layerUpdates){const at=Z.data.subarray(xe*ke/Z.data.BYTES_PER_ELEMENT,(xe+1)*ke/Z.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ae,0,0,xe,Z.width,Z.height,1,he,at)}}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ae,0,0,0,Z.width,Z.height,j.depth,he,Z.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,ae,Q,Z.width,Z.height,j.depth,0,Z.data,0,0);else Ne("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else oe?Ce&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,ae,0,0,0,Z.width,Z.height,j.depth,he,U,Z.data):t.texImage3D(n.TEXTURE_2D_ARRAY,ae,Q,Z.width,Z.height,j.depth,0,he,U,Z.data);S.layerUpdates.size>0&&S.clearLayerUpdates()}else{oe&&ce&&t.texStorage2D(n.TEXTURE_2D,ze,Q,ue[0].width,ue[0].height);for(let ae=0,Ie=ue.length;ae<Ie;ae++)Z=ue[ae],S.format!==yi?he!==null?oe?Ce&&t.compressedTexSubImage2D(n.TEXTURE_2D,ae,0,0,Z.width,Z.height,he,Z.data):t.compressedTexImage2D(n.TEXTURE_2D,ae,Q,Z.width,Z.height,0,Z.data):Ne("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):oe?Ce&&t.texSubImage2D(n.TEXTURE_2D,ae,0,0,Z.width,Z.height,he,U,Z.data):t.texImage2D(n.TEXTURE_2D,ae,Q,Z.width,Z.height,0,he,U,Z.data)}else if(S.isDataArrayTexture)if(oe){if(ce&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ze,Q,j.width,j.height,j.depth),Ce)if(S.layerUpdates.size>0){const ae=nc(j.width,j.height,S.format,S.type);for(const Ie of S.layerUpdates){const ke=j.data.subarray(Ie*ae/j.data.BYTES_PER_ELEMENT,(Ie+1)*ae/j.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Ie,j.width,j.height,1,he,U,ke)}S.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,j.width,j.height,j.depth,he,U,j.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Q,j.width,j.height,j.depth,0,he,U,j.data);else if(S.isData3DTexture)oe?(ce&&t.texStorage3D(n.TEXTURE_3D,ze,Q,j.width,j.height,j.depth),Ce&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,j.width,j.height,j.depth,he,U,j.data)):t.texImage3D(n.TEXTURE_3D,0,Q,j.width,j.height,j.depth,0,he,U,j.data);else if(S.isFramebufferTexture){if(ce)if(oe)t.texStorage2D(n.TEXTURE_2D,ze,Q,j.width,j.height);else{let ae=j.width,Ie=j.height;for(let ke=0;ke<ze;ke++)t.texImage2D(n.TEXTURE_2D,ke,Q,ae,Ie,0,he,U,null),ae>>=1,Ie>>=1}}else if(S.isHTMLTexture){if("texElementImage2D"in n){const ae=n.canvas;if(ae.hasAttribute("layoutsubtree")||ae.setAttribute("layoutsubtree","true"),j.parentNode!==ae){ae.appendChild(j),u.add(S),ae.onpaint=Ie=>{const ke=Ie.changedElements;for(const xe of u)ke.includes(xe.image)&&(xe.needsUpdate=!0)},ae.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,j);else{const ke=n.RGBA,xe=n.RGBA,at=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,ke,xe,at,j)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(ue.length>0){if(oe&&ce){const ae=Ue(ue[0]);t.texStorage2D(n.TEXTURE_2D,ze,Q,ae.width,ae.height)}for(let ae=0,Ie=ue.length;ae<Ie;ae++)Z=ue[ae],oe?Ce&&t.texSubImage2D(n.TEXTURE_2D,ae,0,0,he,U,Z):t.texImage2D(n.TEXTURE_2D,ae,Q,he,U,Z);S.generateMipmaps=!1}else if(oe){if(ce){const ae=Ue(j);t.texStorage2D(n.TEXTURE_2D,ze,Q,ae.width,ae.height)}Ce&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,he,U,j)}else t.texImage2D(n.TEXTURE_2D,0,Q,he,U,j);T(S)&&S.mipmapsAutoUpdate===!0&&E(re),me.__version=le.version,S.onUpdate&&S.onUpdate(S)}D.__version=S.version}function Ze(D,S,W){if(S.image.length!==6)return;const re=Ke(D,S),ee=S.source;t.bindTexture(n.TEXTURE_CUBE_MAP,D.__webglTexture,n.TEXTURE0+W);const le=i.get(ee);if(ee.version!==le.__version||re===!0){t.activeTexture(n.TEXTURE0+W);const me=$e.getPrimaries($e.workingColorSpace),J=S.colorSpace===en?null:$e.getPrimaries(S.colorSpace),j=S.colorSpace===en||me===J?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,j);const he=S.isCompressedTexture||S.image[0].isCompressedTexture,U=S.image[0]&&S.image[0].isDataTexture,Q=[];for(let xe=0;xe<6;xe++)!he&&!U?Q[xe]=M(S.image[xe],!0,s.maxCubemapSize):Q[xe]=U?S.image[xe].image:S.image[xe],Q[xe]=De(S,Q[xe]);const Z=Q[0],ue=r.convert(S.format,S.colorSpace),oe=r.convert(S.type);let ce=y(S.internalFormat,ue,oe,S.normalized,S.colorSpace);const Ce=S.isVideoTexture!==!0,ze=le.__version===void 0||re===!0,ae=ee.dataReady;let Ie=_(S,Z);qe(n.TEXTURE_CUBE_MAP,S);let ke;if(S.isDepthTexture){if(ce=g(S.format===sn,S.type),ze)if(Ce)t.texStorage2D(n.TEXTURE_CUBE_MAP,1,ce,Z.width,Z.height);else for(let xe=0;xe<6;xe++)t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xe,0,ce,Z.width,Z.height,0,ue,oe,null)}else if(he){Ce&&ze&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Ie,ce,Z.width,Z.height);for(let xe=0;xe<6;xe++){ke=Q[xe].mipmaps;for(let at=0;at<ke.length;at++){const At=ke[at];S.format!==yi?ue!==null?Ce?ae&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xe,at,0,0,At.width,At.height,ue,At.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xe,at,ce,At.width,At.height,0,At.data):Ne("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ce?ae&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xe,at,0,0,At.width,At.height,ue,oe,At.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xe,at,ce,At.width,At.height,0,ue,oe,At.data)}}}else{if(ke=S.mipmaps,Ce&&ze){ke.length>0&&Ie++;const xe=Ue(Q[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Ie,ce,xe.width,xe.height)}for(let xe=0;xe<6;xe++)if(U){Ce?ae&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xe,0,0,0,Q[xe].width,Q[xe].height,ue,oe,Q[xe].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xe,0,ce,Q[xe].width,Q[xe].height,0,ue,oe,Q[xe].data);for(let at=0;at<ke.length;at++){const Vi=ke[at].image[xe].image;Ce?ae&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xe,at+1,0,0,Vi.width,Vi.height,ue,oe,Vi.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xe,at+1,ce,Vi.width,Vi.height,0,ue,oe,Vi.data)}}else{Ce?ae&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xe,0,0,0,ue,oe,Q[xe]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xe,0,ce,ue,oe,Q[xe]);for(let at=0;at<ke.length;at++){const At=ke[at];Ce?ae&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xe,at+1,0,0,ue,oe,At.image[xe]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xe,at+1,ce,ue,oe,At.image[xe])}}}T(S)&&S.mipmapsAutoUpdate===!0&&E(n.TEXTURE_CUBE_MAP),le.__version=ee.version,S.onUpdate&&S.onUpdate(S)}D.__version=S.version}function it(D,S,W,re,ee,le){const me=r.convert(W.format,W.colorSpace),J=r.convert(W.type),j=y(W.internalFormat,me,J,W.normalized,W.colorSpace),he=i.get(S),U=i.get(W);if(U.__renderTarget=S,!he.__hasExternalTextures){const Q=Math.max(1,S.width>>le),Z=Math.max(1,S.height>>le);ee===n.TEXTURE_3D||ee===n.TEXTURE_2D_ARRAY?t.texImage3D(ee,le,j,Q,Z,S.depth,0,me,J,null):t.texImage2D(ee,le,j,Q,Z,0,me,J,null)}t.bindFramebuffer(n.FRAMEBUFFER,D),ve(S)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,re,ee,U.__webglTexture,0,gt(S)):(ee===n.TEXTURE_2D||ee>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ee<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,re,ee,U.__webglTexture,le),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Wt(D,S,W){if(n.bindRenderbuffer(n.RENDERBUFFER,D),S.depthBuffer){const re=S.depthTexture,ee=re&&re.isDepthTexture?re.type:null,le=g(S.stencilBuffer,ee),me=S.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;ve(S)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,gt(S),le,S.width,S.height):W?n.renderbufferStorageMultisample(n.RENDERBUFFER,gt(S),le,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,le,S.width,S.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,me,n.RENDERBUFFER,D)}else{const re=S.textures;for(let ee=0;ee<re.length;ee++){const le=re[ee],me=r.convert(le.format,le.colorSpace),J=r.convert(le.type),j=y(le.internalFormat,me,J,le.normalized,le.colorSpace);ve(S)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,gt(S),j,S.width,S.height):W?n.renderbufferStorageMultisample(n.RENDERBUFFER,gt(S),j,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,j,S.width,S.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function He(D,S,W){const re=S.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,D),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const ee=i.get(S.depthTexture);ee.__renderTarget=S;const le=re?S.depthTexture.image[0]:S.depthTexture.image;(!ee.__webglTexture||le.width!==S.width||le.height!==S.height)&&(le.width=S.width,le.height=S.height,S.depthTexture.needsUpdate=!0),re?de(S.depthTexture,0):ne(S.depthTexture,0);const me=ee.__webglTexture,J=gt(S),j=re?n.TEXTURE_CUBE_MAP_POSITIVE_X+W:n.TEXTURE_2D,he=S.depthTexture.format===sn?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(S.depthTexture.format===rn)ve(S)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,he,j,me,0,J):n.framebufferTexture2D(n.FRAMEBUFFER,he,j,me,0);else if(S.depthTexture.format===sn)ve(S)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,he,j,me,0,J):n.framebufferTexture2D(n.FRAMEBUFFER,he,j,me,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Dt(D){const S=i.get(D),W=D.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==D.depthTexture){const re=D.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),re){const ee=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,re.removeEventListener("dispose",ee)};re.addEventListener("dispose",ee),S.__depthDisposeCallback=ee}S.__boundDepthTexture=re}if(D.depthTexture&&!S.__autoAllocateDepthBuffer)if(W)for(let re=0;re<6;re++)He(S.__webglFramebuffer[re],D,re);else D.texture.mipmaps.length>0?He(S.__webglFramebuffer[0],D,0):He(S.__webglFramebuffer,D,0);else if(W){S.__webglDepthbuffer=[];for(let re=0;re<6;re++)if(t.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer[re]),S.__webglDepthbuffer[re]===void 0)S.__webglDepthbuffer[re]=n.createRenderbuffer(),Wt(S.__webglDepthbuffer[re],D,!1);else{const ee=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,le=S.__webglDepthbuffer[re];n.bindRenderbuffer(n.RENDERBUFFER,le),n.framebufferRenderbuffer(n.FRAMEBUFFER,ee,n.RENDERBUFFER,le)}}else if(D.texture.mipmaps.length>0?t.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=n.createRenderbuffer(),Wt(S.__webglDepthbuffer,D,!1);else{const ee=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,le=S.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,le),n.framebufferRenderbuffer(n.FRAMEBUFFER,ee,n.RENDERBUFFER,le)}t.bindFramebuffer(n.FRAMEBUFFER,null)}function ei(D,S,W){const re=i.get(D);S!==void 0&&it(re.__webglFramebuffer,D,D.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),W!==void 0&&Dt(D)}function ti(D){const S=D.texture,W=i.get(D),re=i.get(S);D.addEventListener("dispose",O),L(D);const ee=D.textures,le=D.isWebGLCubeRenderTarget===!0,me=ee.length>1;if(me||(re.__webglTexture===void 0&&(re.__webglTexture=n.createTexture()),re.__version=S.version,a.memory.textures++),le){W.__webglFramebuffer=[];for(let J=0;J<6;J++)if(S.mipmaps.length>0){W.__webglFramebuffer[J]=[];for(let j=0;j<S.mipmaps.length;j++)W.__webglFramebuffer[J][j]=n.createFramebuffer()}else W.__webglFramebuffer[J]=n.createFramebuffer()}else{if(S.mipmaps.length>0){W.__webglFramebuffer=[];for(let J=0;J<S.mipmaps.length;J++)W.__webglFramebuffer[J]=n.createFramebuffer()}else W.__webglFramebuffer=n.createFramebuffer();if(me)for(let J=0,j=ee.length;J<j;J++){const he=i.get(ee[J]);he.__webglTexture===void 0&&(he.__webglTexture=n.createTexture(),a.memory.textures++)}if(D.samples>0&&ve(D)===!1){W.__webglMultisampledFramebuffer=n.createFramebuffer(),W.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let J=0;J<ee.length;J++){const j=ee[J];W.__webglColorRenderbuffer[J]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,W.__webglColorRenderbuffer[J]);const he=r.convert(j.format,j.colorSpace),U=r.convert(j.type),Q=y(j.internalFormat,he,U,j.normalized,j.colorSpace,D.isXRRenderTarget===!0),Z=gt(D);n.renderbufferStorageMultisample(n.RENDERBUFFER,Z,Q,D.width,D.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+J,n.RENDERBUFFER,W.__webglColorRenderbuffer[J])}n.bindRenderbuffer(n.RENDERBUFFER,null),D.depthBuffer&&(W.__webglDepthRenderbuffer=n.createRenderbuffer(),Wt(W.__webglDepthRenderbuffer,D,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(le){t.bindTexture(n.TEXTURE_CUBE_MAP,re.__webglTexture),qe(n.TEXTURE_CUBE_MAP,S);for(let J=0;J<6;J++)if(S.mipmaps.length>0)for(let j=0;j<S.mipmaps.length;j++)it(W.__webglFramebuffer[J][j],D,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+J,j);else it(W.__webglFramebuffer[J],D,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0);T(S)?E(n.TEXTURE_CUBE_MAP):S.mipmaps.length>0&&n.texParameteri(n.TEXTURE_CUBE_MAP,n.TEXTURE_MAX_LEVEL,S.mipmaps.length-1),t.unbindTexture()}else if(me){for(let J=0,j=ee.length;J<j;J++){const he=ee[J],U=i.get(he);let Q=n.TEXTURE_2D;(D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(Q=D.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Q,U.__webglTexture),qe(Q,he),it(W.__webglFramebuffer,D,he,n.COLOR_ATTACHMENT0+J,Q,0),T(he)&&E(Q)}t.unbindTexture()}else{let J=n.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(J=D.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(J,re.__webglTexture),qe(J,S),S.mipmaps.length>0)for(let j=0;j<S.mipmaps.length;j++)it(W.__webglFramebuffer[j],D,S,n.COLOR_ATTACHMENT0,J,j);else it(W.__webglFramebuffer,D,S,n.COLOR_ATTACHMENT0,J,0);T(S)?E(J):S.mipmaps.length>0&&n.texParameteri(J,n.TEXTURE_MAX_LEVEL,S.mipmaps.length-1),t.unbindTexture()}D.depthBuffer&&Dt(D)}function G(D){const S=D.textures;for(let W=0,re=S.length;W<re;W++){const ee=S[W];if(T(ee)&&ee.mipmapsAutoUpdate===!0){const le=w(D),me=i.get(ee).__webglTexture;t.bindTexture(le,me),E(le),t.unbindTexture()}}}const ii=[];function mt(D){if(D.samples>0){if(ve(D)===!1){const S=D.textures,W=D.width,re=D.height;let ee=n.COLOR_BUFFER_BIT;const le=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,me=i.get(D),J=S.length>1;if(J)for(let he=0;he<S.length;he++)t.bindFramebuffer(n.FRAMEBUFFER,me.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+he,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,me.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+he,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,me.__webglMultisampledFramebuffer),D.texture.mipmaps.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,me.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,me.__webglFramebuffer);for(let he=0;he<S.length;he++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(ee|=n.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(ee|=n.STENCIL_BUFFER_BIT)),J){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,me.__webglColorRenderbuffer[he]);const U=i.get(S[he]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,U,0)}n.blitFramebuffer(0,0,W,re,0,0,W,re,ee,n.NEAREST),l===!0&&(ii.length=0,ii.push(n.COLOR_ATTACHMENT0+he),D.depthBuffer&&D.storeMultisampledDepthBuffer===!1&&ii.push(le),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,ii))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),J)for(let he=0;he<S.length;he++){t.bindFramebuffer(n.FRAMEBUFFER,me.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+he,n.RENDERBUFFER,me.__webglColorRenderbuffer[he]);const U=i.get(S[he]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,me.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+he,n.TEXTURE_2D,U,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,me.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.storeMultisampledDepthBuffer===!1&&l){const S=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[S])}}}function gt(D){return Math.min(s.maxSamples,D.samples)}function ve(D){const S=i.get(D);return D.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function bt(D){const S=a.render.frame;f.get(D)!==S&&(f.set(D,S),D.update())}function De(D,S){const W=D.colorSpace,re=D.format,ee=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||W!==bs&&W!==en&&($e.getTransfer(W)===ot?(re!==yi||ee!==jt)&&Ne("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):et("WebGLTextures: Unsupported texture color space:",W)),S}function Ue(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(c.width=D.naturalWidth||D.width,c.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(c.width=D.displayWidth,c.height=D.displayHeight):(c.width=D.width,c.height=D.height),c}this.allocateTextureUnit=se,this.resetTextureUnits=z,this.getTextureUnits=$,this.setTextureUnits=te,this.setTexture2D=ne,this.setTexture2DArray=fe,this.setTexture3D=we,this.setTextureCube=de,this.rebindTextures=ei,this.setupRenderTarget=ti,this.updateRenderTargetMipmap=G,this.updateMultisampleRenderTarget=mt,this.setupDepthRenderbuffer=Dt,this.setupFrameBufferTexture=it,this.useMultisampledRTT=ve,this.dispose=k}function Vv(n,e){function t(i,s=en){let r;const a=$e.getTransfer(s);if(i===jt)return n.UNSIGNED_BYTE;if(i===Ho)return n.UNSIGNED_SHORT_4_4_4_4;if(i===zo)return n.UNSIGNED_SHORT_5_5_5_1;if(i===vh)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===xh)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===mh)return n.BYTE;if(i===gh)return n.SHORT;if(i===ws)return n.UNSIGNED_SHORT;if(i===ko)return n.INT;if(i===Pi)return n.UNSIGNED_INT;if(i===Ri)return n.FLOAT;if(i===Ii)return n.HALF_FLOAT;if(i===_h)return n.ALPHA;if(i===yh)return n.RGB;if(i===yi)return n.RGBA;if(i===rn)return n.DEPTH_COMPONENT;if(i===sn)return n.DEPTH_STENCIL;if(i===Go)return n.RED;if(i===Vo)return n.RED_INTEGER;if(i===yn)return n.RG;if(i===Wo)return n.RG_INTEGER;if(i===Xo)return n.RGBA_INTEGER;if(i===gr||i===vr||i===xr||i===_r)if(a===ot)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===gr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===vr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===xr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===_r)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===gr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===vr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===xr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===_r)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Za||i===Ja||i===ja||i===Qa)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Za)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Ja)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===ja)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Qa)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===eo||i===to||i===io||i===no||i===so||i===Rr||i===ro)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===eo||i===to)return a===ot?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===io)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===no)return r.COMPRESSED_R11_EAC;if(i===so)return r.COMPRESSED_SIGNED_R11_EAC;if(i===Rr)return r.COMPRESSED_RG11_EAC;if(i===ro)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===ao||i===oo||i===lo||i===co||i===ho||i===uo||i===fo||i===po||i===mo||i===go||i===vo||i===xo||i===_o||i===yo)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===ao)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===oo)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===lo)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===co)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===ho)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===uo)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===fo)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===po)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===mo)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===go)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===vo)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===xo)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===_o)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===yo)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===So||i===Mo||i===wo)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===So)return a===ot?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Mo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===wo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===bo||i===Eo||i===Cr||i===To)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===bo)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Eo)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Cr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===To)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Qn?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const Wv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Xv=`
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

}`;class qv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Dh(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Mn({vertexShader:Wv,fragmentShader:Xv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Gi(new kr(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class $v extends bn{constructor(e,t){super();const i=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,f=null,u=null,h=null,d=null,p=null;const x=typeof XRWebGLBinding<"u",m=new qv,v={},M=t.getContextAttributes();let T=null,E=null;const w=[],y=[],g=new tt;let _=null,L=null;const R=new Ei;R.viewport=new _t;const A=new Ei;A.viewport=new _t;const O=[R,A],N=new rp;let C=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let ne=w[q];return ne===void 0&&(ne=new pa,w[q]=ne),ne.getTargetRaySpace()},this.getControllerGrip=function(q){let ne=w[q];return ne===void 0&&(ne=new pa,w[q]=ne),ne.getGripSpace()},this.getHand=function(q){let ne=w[q];return ne===void 0&&(ne=new pa,w[q]=ne),ne.getHandSpace()};function B(q){const ne=y.indexOf(q.inputSource);if(ne===-1)return;const fe=w[ne];fe!==void 0&&(fe.update(q.inputSource,q.frame,c||a),fe.dispatchEvent({type:q.type,data:q.inputSource}))}function H(){s.removeEventListener("select",B),s.removeEventListener("selectstart",B),s.removeEventListener("selectend",B),s.removeEventListener("squeeze",B),s.removeEventListener("squeezestart",B),s.removeEventListener("squeezeend",B),s.removeEventListener("end",H),s.removeEventListener("inputsourceschange",P);for(let q=0;q<w.length;q++){const ne=y[q];ne!==null&&(y[q]=null,w[q].disconnect(ne))}C=null,k=null,m.reset();for(const q in v)delete v[q];if(e.setRenderTarget(T),d=null,h=null,u=null,s=null,E=null,se.stop(),i.isPresenting=!1,e.setPixelRatio(_),e.setSize(g.width,g.height,!1),L!==null){const q=L.camera;q.fov=L.fov,q.zoom=L.zoom,q.updateProjectionMatrix(),L=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){r=q,i.isPresenting===!0&&Ne("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){o=q,i.isPresenting===!0&&Ne("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(q){c=q},this.getBaseLayer=function(){return h!==null?h:d},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(q){if(s=q,s!==null){if(T=e.getRenderTarget(),s.addEventListener("select",B),s.addEventListener("selectstart",B),s.addEventListener("selectend",B),s.addEventListener("squeeze",B),s.addEventListener("squeezestart",B),s.addEventListener("squeezeend",B),s.addEventListener("end",H),s.addEventListener("inputsourceschange",P),M.xrCompatible!==!0&&await t.makeXRCompatible(),_=e.getPixelRatio(),e.getSize(g),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let fe=null,we=null,de=null;M.depth&&(de=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,fe=M.stencil?sn:rn,we=M.stencil?Qn:Pi);const Pe={colorFormat:t.RGBA8,depthFormat:de,scaleFactor:r};u=this.getBinding(),h=u.createProjectionLayer(Pe),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),E=new Ci(h.textureWidth,h.textureHeight,{format:yi,type:jt,depthTexture:new es(h.textureWidth,h.textureHeight,we,void 0,void 0,void 0,void 0,void 0,void 0,fe),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{const fe={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,t,fe),s.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),E=new Ci(d.framebufferWidth,d.framebufferHeight,{format:yi,type:jt,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}E.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),se.setContext(s),se.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function P(q){for(let ne=0;ne<q.removed.length;ne++){const fe=q.removed[ne],we=y.indexOf(fe);we>=0&&(y[we]=null,w[we].disconnect(fe))}for(let ne=0;ne<q.added.length;ne++){const fe=q.added[ne];let we=y.indexOf(fe);if(we===-1){for(let Pe=0;Pe<w.length;Pe++)if(Pe>=y.length){y.push(fe),we=Pe;break}else if(y[Pe]===null){y[Pe]=fe,we=Pe;break}if(we===-1)break}const de=w[we];de&&de.connect(fe)}}function I(q,ne){ne===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(ne.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(s===null)return;let ne=q.near,fe=q.far;m.texture!==null&&(m.depthNear>0&&(ne=m.depthNear),m.depthFar>0&&(fe=m.depthFar)),N.near=A.near=R.near=ne,N.far=A.far=R.far=fe,(C!==N.near||k!==N.far)&&(s.updateRenderState({depthNear:N.near,depthFar:N.far}),C=N.near,k=N.far),N.layers.mask=q.layers.mask|6,R.layers.mask=N.layers.mask&-5,A.layers.mask=N.layers.mask&-3;const we=q.parent,de=N.cameras;I(N,we);for(let Pe=0;Pe<de.length;Pe++)I(de[Pe],we);N.projectionMatrix.copy(R.projectionMatrix),N.projectionMatrixInverse.copy(R.projectionMatrixInverse),L===null&&q.isPerspectiveCamera&&(L={camera:q,fov:q.fov,zoom:q.zoom}),z(q,N,we)};function z(q,ne,fe){fe===null?q.matrix.copy(ne.matrixWorld):(q.matrix.copy(fe.matrixWorld),q.matrix.invert(),q.matrix.multiply(ne.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(ne.projectionMatrix),q.projectionMatrixInverse.copy(ne.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=Ao*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return N},this.getFoveation=function(){if(!(h===null&&d===null))return l},this.setFoveation=function(q){l=q,h!==null&&(h.fixedFoveation=q),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=q)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(N)},this.getCameraTexture=function(q){return v[q]};let $=null;function te(q,ne){if(f=ne.getViewerPose(c||a),p=ne,f!==null){const fe=f.views;d!==null&&(e.setRenderTargetFramebuffer(E,d.framebuffer),e.setRenderTarget(E));let we=!1;fe.length!==N.cameras.length&&(N.cameras.length=0,we=!0);for(let Te=0;Te<fe.length;Te++){const qe=fe[Te];let Ke=null;if(d!==null)Ke=d.getViewport(qe);else{const Re=u.getViewSubImage(h,qe);Ke=Re.viewport,Te===0&&(e.setRenderTargetTextures(E,Re.colorTexture,Re.depthStencilTexture),e.setRenderTarget(E))}let ie=O[Te];ie===void 0&&(ie=new Ei,ie.layers.enable(Te),ie.viewport=new _t,O[Te]=ie),ie.matrix.fromArray(qe.transform.matrix),ie.matrix.decompose(ie.position,ie.quaternion,ie.scale),ie.projectionMatrix.fromArray(qe.projectionMatrix),ie.projectionMatrixInverse.copy(ie.projectionMatrix).invert(),ie.viewport.set(Ke.x,Ke.y,Ke.width,Ke.height),Te===0&&(N.matrix.copy(ie.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale)),we===!0&&N.cameras.push(ie)}const de=s.enabledFeatures;if(de&&de.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){u=i.getBinding();const Te=u.getDepthInformation(fe[0]);Te&&Te.isValid&&Te.texture&&m.init(Te,s.renderState)}if(de&&de.includes("camera-access")&&x){e.state.unbindTexture(),u=i.getBinding();for(let Te=0;Te<fe.length;Te++){const qe=fe[Te].camera;if(qe){let Ke=v[qe];Ke||(Ke=new Dh,v[qe]=Ke);const ie=u.getCameraImage(qe);Ke.sourceTexture=ie}}}}for(let fe=0;fe<w.length;fe++){const we=y[fe],de=w[fe];we!==null&&de!==void 0&&de.update(we,ne,c||a)}$&&$(q,ne),ne.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ne}),p=null}const se=new Oh;se.setAnimationLoop(te),this.setAnimationLoop=function(q){$=q},this.dispose=function(){}}}const Yv=new yt,$h=new Fe;$h.set(-1,0,0,0,1,0,0,0,1);function Kv(n,e){function t(m,v){m.matrixAutoUpdate===!0&&m.updateMatrix(),v.value.copy(m.matrix)}function i(m,v){v.color.getRGB(m.fogColor.value,Nh(n)),v.isFog?(m.fogNear.value=v.near,m.fogFar.value=v.far):v.isFogExp2&&(m.fogDensity.value=v.density)}function s(m,v,M,T,E){v.isNodeMaterial?v.uniformsNeedUpdate=!1:v.isMeshBasicMaterial?r(m,v):v.isMeshLambertMaterial?(r(m,v),v.envMap&&(m.envMapIntensity.value=v.envMapIntensity)):v.isMeshToonMaterial?(r(m,v),u(m,v)):v.isMeshPhongMaterial?(r(m,v),f(m,v),v.envMap&&(m.envMapIntensity.value=v.envMapIntensity)):v.isMeshStandardMaterial?(r(m,v),h(m,v),v.isMeshPhysicalMaterial&&d(m,v,E)):v.isMeshMatcapMaterial?(r(m,v),p(m,v)):v.isMeshDepthMaterial?r(m,v):v.isMeshDistanceMaterial?(r(m,v),x(m,v)):v.isMeshNormalMaterial?r(m,v):v.isLineBasicMaterial?(a(m,v),v.isLineDashedMaterial&&o(m,v)):v.isPointsMaterial?l(m,v,M,T):v.isSpriteMaterial?c(m,v):v.isShadowMaterial?(m.color.value.copy(v.color),m.opacity.value=v.opacity):v.isShaderMaterial&&(v.uniformsNeedUpdate=!1)}function r(m,v){m.opacity.value=v.opacity,v.color&&m.diffuse.value.copy(v.color),v.emissive&&m.emissive.value.copy(v.emissive).multiplyScalar(v.emissiveIntensity),v.map&&(m.map.value=v.map,t(v.map,m.mapTransform)),v.alphaMap&&(m.alphaMap.value=v.alphaMap,t(v.alphaMap,m.alphaMapTransform)),v.bumpMap&&(m.bumpMap.value=v.bumpMap,t(v.bumpMap,m.bumpMapTransform),m.bumpScale.value=v.bumpScale,v.side===$t&&(m.bumpScale.value*=-1)),v.normalMap&&(m.normalMap.value=v.normalMap,t(v.normalMap,m.normalMapTransform),m.normalScale.value.copy(v.normalScale),v.side===$t&&m.normalScale.value.negate()),v.displacementMap&&(m.displacementMap.value=v.displacementMap,t(v.displacementMap,m.displacementMapTransform),m.displacementScale.value=v.displacementScale,m.displacementBias.value=v.displacementBias),v.emissiveMap&&(m.emissiveMap.value=v.emissiveMap,t(v.emissiveMap,m.emissiveMapTransform)),v.specularMap&&(m.specularMap.value=v.specularMap,t(v.specularMap,m.specularMapTransform)),v.alphaTest>0&&(m.alphaTest.value=v.alphaTest);const M=e.get(v),T=M.envMap,E=M.envMapRotation;T&&(m.envMap.value=T,m.envMapRotation.value.setFromMatrix4(Yv.makeRotationFromEuler(E)).transpose(),T.isCubeTexture&&T.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply($h),m.reflectivity.value=v.reflectivity,m.ior.value=v.ior,m.refractionRatio.value=v.refractionRatio),v.lightMap&&(m.lightMap.value=v.lightMap,m.lightMapIntensity.value=v.lightMapIntensity,t(v.lightMap,m.lightMapTransform)),v.aoMap&&(m.aoMap.value=v.aoMap,m.aoMapIntensity.value=v.aoMapIntensity,t(v.aoMap,m.aoMapTransform))}function a(m,v){m.diffuse.value.copy(v.color),m.opacity.value=v.opacity,v.map&&(m.map.value=v.map,t(v.map,m.mapTransform))}function o(m,v){m.dashSize.value=v.dashSize,m.totalSize.value=v.dashSize+v.gapSize,m.scale.value=v.scale}function l(m,v,M,T){m.diffuse.value.copy(v.color),m.opacity.value=v.opacity,m.size.value=v.size*M,m.scale.value=T*.5,v.map&&(m.map.value=v.map,t(v.map,m.uvTransform)),v.alphaMap&&(m.alphaMap.value=v.alphaMap,t(v.alphaMap,m.alphaMapTransform)),v.alphaTest>0&&(m.alphaTest.value=v.alphaTest)}function c(m,v){m.diffuse.value.copy(v.color),m.opacity.value=v.opacity,m.rotation.value=v.rotation,v.map&&(m.map.value=v.map,t(v.map,m.mapTransform)),v.alphaMap&&(m.alphaMap.value=v.alphaMap,t(v.alphaMap,m.alphaMapTransform)),v.alphaTest>0&&(m.alphaTest.value=v.alphaTest)}function f(m,v){m.specular.value.copy(v.specular),m.shininess.value=Math.max(v.shininess,1e-4)}function u(m,v){v.gradientMap&&(m.gradientMap.value=v.gradientMap)}function h(m,v){m.metalness.value=v.metalness,v.metalnessMap&&(m.metalnessMap.value=v.metalnessMap,t(v.metalnessMap,m.metalnessMapTransform)),m.roughness.value=v.roughness,v.roughnessMap&&(m.roughnessMap.value=v.roughnessMap,t(v.roughnessMap,m.roughnessMapTransform)),v.envMap&&(m.envMapIntensity.value=v.envMapIntensity)}function d(m,v,M){m.ior.value=v.ior,v.diffuseRoughness>0&&(m.diffuseRoughness.value=v.diffuseRoughness,v.diffuseRoughnessMap&&(m.diffuseRoughnessMap.value=v.diffuseRoughnessMap,t(v.diffuseRoughnessMap,m.diffuseRoughnessMapTransform))),v.sheen>0&&(m.sheenColor.value.copy(v.sheenColor).multiplyScalar(v.sheen),m.sheenRoughness.value=v.sheenRoughness,v.sheenColorMap&&(m.sheenColorMap.value=v.sheenColorMap,t(v.sheenColorMap,m.sheenColorMapTransform)),v.sheenRoughnessMap&&(m.sheenRoughnessMap.value=v.sheenRoughnessMap,t(v.sheenRoughnessMap,m.sheenRoughnessMapTransform))),v.clearcoat>0&&(m.clearcoat.value=v.clearcoat,m.clearcoatRoughness.value=v.clearcoatRoughness,v.clearcoatMap&&(m.clearcoatMap.value=v.clearcoatMap,t(v.clearcoatMap,m.clearcoatMapTransform)),v.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=v.clearcoatRoughnessMap,t(v.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),v.clearcoatNormalMap&&(m.clearcoatNormalMap.value=v.clearcoatNormalMap,t(v.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(v.clearcoatNormalScale),v.side===$t&&m.clearcoatNormalScale.value.negate())),v.dispersion>0&&(m.dispersion.value=v.dispersion),v.retroreflectivity>0&&(m.retroreflectivity.value=v.retroreflectivity),v.iridescence>0&&(m.iridescence.value=v.iridescence,m.iridescenceIOR.value=v.iridescenceIOR,m.iridescenceThicknessMinimum.value=v.iridescenceThicknessMinimum,m.iridescenceThicknessMaximum.value=v.iridescenceThicknessMaximum,v.iridescenceMap&&(m.iridescenceMap.value=v.iridescenceMap,t(v.iridescenceMap,m.iridescenceMapTransform)),v.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=v.iridescenceThicknessMap,t(v.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),v.transmission>0&&(m.transmission.value=v.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),v.transmissionMap&&(m.transmissionMap.value=v.transmissionMap,t(v.transmissionMap,m.transmissionMapTransform)),m.thickness.value=v.thickness,v.thicknessMap&&(m.thicknessMap.value=v.thicknessMap,t(v.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=v.attenuationDistance,m.attenuationColor.value.copy(v.attenuationColor)),v.anisotropy>0&&(m.anisotropyVector.value.set(v.anisotropy*Math.cos(v.anisotropyRotation),v.anisotropy*Math.sin(v.anisotropyRotation)),v.anisotropyMap&&(m.anisotropyMap.value=v.anisotropyMap,t(v.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=v.specularIntensity,m.specularColor.value.copy(v.specularColor),v.specularColorMap&&(m.specularColorMap.value=v.specularColorMap,t(v.specularColorMap,m.specularColorMapTransform)),v.specularIntensityMap&&(m.specularIntensityMap.value=v.specularIntensityMap,t(v.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,v){v.matcap&&(m.matcap.value=v.matcap)}function x(m,v){const M=e.get(v).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function Zv(n,e,t,i){let s={},r={};function a(M,T){const E=T.program;i.uniformBlockBinding(M,E,s[M.id])}function o(M,T){let E=s[M.id];E===void 0&&(p(M),E=l(M),s[M.id]=E,M.addEventListener("dispose",m));const w=T.program;i.updateUBOMapping(M,w);const y=e.render.frame;r[M.id]!==y&&(c(M),r[M.id]=y)}function l(M){const T=n.createBuffer(),E=M.__size,w=M.usage;return n.bindBuffer(n.UNIFORM_BUFFER,T),n.bufferData(n.UNIFORM_BUFFER,E,w),n.bindBuffer(n.UNIFORM_BUFFER,null),T}function c(M){const T=s[M.id],E=M.uniforms,w=M.__cache;n.bindBuffer(n.UNIFORM_BUFFER,T);for(let y=0,g=E.length;y<g;y++){const _=E[y];if(Array.isArray(_))for(let L=0,R=_.length;L<R;L++)f(_[L],y,L,w);else f(_,y,0,w)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(M,T,E,w){if(h(M,T,E,w)===!0){const y=M.__offset,g=M.value;if(Array.isArray(g)){let _=0;for(let L=0;L<g.length;L++){const R=g[L],A=x(R,!0);u(R,M.__data,_),_+=A.storage/Float32Array.BYTES_PER_ELEMENT}}else u(g,M.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,y,M.__data)}}function u(M,T,E){typeof M=="number"||typeof M=="boolean"?T[E]=M:M.isMatrix3?(T[E]=M.elements[0],T[E+1]=M.elements[1],T[E+2]=M.elements[2],T[E+3]=0,T[E+4]=M.elements[3],T[E+5]=M.elements[4],T[E+6]=M.elements[5],T[E+7]=0,T[E+8]=M.elements[6],T[E+9]=M.elements[7],T[E+10]=M.elements[8],T[E+11]=0):ArrayBuffer.isView(M)?T.set(M.subarray(0,T.length-E),E):M.toArray(T,E)}function h(M,T,E,w){const y=M.value,g=T+"_"+E;if(Array.isArray(y)){w[g]===void 0&&(w[g]=[]);const _=w[g];let L=!1;for(let R=0;R<y.length;R++)d(y[R],_,R)===!0&&(L=!0);return L}return d(y,w,g)}function d(M,T,E){if(T[E]===void 0)return typeof M=="number"||typeof M=="boolean"?T[E]=M:ArrayBuffer.isView(M)?T[E]=M.slice():T[E]=M.clone(),!0;{const w=T[E];if(typeof M=="number"||typeof M=="boolean"){if(w!==M)return T[E]=M,!0}else{if(ArrayBuffer.isView(M))return!0;if(w.equals(M)===!1)return w.copy(M),!0}}return!1}function p(M){const T=M.uniforms;let E=0;const w=16;for(let g=0,_=T.length;g<_;g++){const L=Array.isArray(T[g])?T[g]:[T[g]];for(let R=0,A=L.length;R<A;R++){const O=L[R],N=Array.isArray(O.value)?O.value:[O.value],C=Array.isArray(T[g])||Array.isArray(O.value);let k=E;for(let H=0,P=N.length;H<P;H++){const I=N[H],z=x(I,C),$=E%w,te=$%z.boundary,se=$+te;E+=te,se!==0&&w-se<z.storage&&(E+=w-se),H===0&&(k=E),E+=z.storage}const B=O.type==="int"?Int32Array:O.type==="uint"?Uint32Array:Float32Array;O.__data=new B((E-k)/Float32Array.BYTES_PER_ELEMENT),O.__offset=k}}const y=E%w;return y>0&&(E+=w-y),M.__size=E,M.__cache={},this}function x(M,T){const E={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(E.boundary=4,E.storage=4):M.isVector2?(E.boundary=8,E.storage=8):M.isVector3||M.isColor?(E.boundary=16,E.storage=12):M.isVector4?(E.boundary=16,E.storage=16):M.isMatrix3?(E.boundary=16,E.storage=48):M.isMatrix4?(E.boundary=16,E.storage=64):M.isTexture?Ne("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(M)?(E.boundary=16,E.storage=M.byteLength):Ne("WebGLRenderer: Unsupported uniform value type.",M),T===!0&&(E.boundary=16,E.storage=Math.ceil(E.storage/16)*16),E}function m(M){const T=M.target;T.removeEventListener("dispose",m),n.deleteBuffer(s[T.id]),delete s[T.id],delete r[T.id]}function v(){for(const M in s)n.deleteBuffer(s[M]);s={},r={}}return{bind:a,update:o,dispose:v}}const Jv=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let bi=null;function jv(){return bi===null&&(bi=new Ph(Jv,16,16,yn,Ii),bi.name="DFG_LUT",bi.minFilter=qt,bi.magFilter=qt,bi.wrapS=Ai,bi.wrapT=Ai,bi.generateMipmaps=!1,bi.needsUpdate=!0),bi}class Qv{constructor(e={}){const{canvas:t=Md(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:f="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:h=!1,outputBufferType:d=jt}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=a;const x=d,m=new Set([Xo,Wo,Vo]),v=new Set([jt,Pi,ws,Qn,Ho,zo]),M=new Uint32Array(4),T=new Int32Array(4),E={textures:[],min:[],max:[],resolution:[]};let w=null,y=null;const g=[],_=[];let L=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Hi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const R=this;let A=!1,O=null,N=null,C=null,k=null;this._outputColorSpace=oi;let B=0,H=0,P=null,I=-1,z=null;const $=new _t,te=new _t;let se=null;const q=new rt(0);let ne=0,fe=t.width,we=t.height,de=1,Pe=null,je=null;const Te=new _t(0,0,fe,we),qe=new _t(0,0,fe,we);let Ke=!1;const ie=new Nr,Re=new Ko;let Se=!1,Ze=!1;const it=new yt,Wt=new K,He=new _t,Dt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ei=!1;function ti(){return P===null?de:1}let G=i;function ii(b,F){return t.getContext(b,F)}let mt,gt,ve,bt,De,Ue,D,S,W,re,ee,le,me,J,j,he,U,Q,Z,ue,oe,ce,Ce;try{const b={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:f,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Bo}`),t.addEventListener("webglcontextlost",Ie,!1),t.addEventListener("webglcontextrestored",ke,!1),t.addEventListener("webglcontextcreationerror",xe,!1),G===null){const F="webgl2";if(G=ii(F,b),G===null)throw ii(F)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}ze()}catch(b){throw t.removeEventListener("webglcontextlost",Ie,!1),t.removeEventListener("webglcontextrestored",ke,!1),t.removeEventListener("webglcontextcreationerror",xe,!1),et("WebGLRenderer: "+b.message),b}function ze(){mt=new i0(G),mt.init(),oe=new Vv(G,mt),gt=new Xg(G,mt,e,oe),ve=new zv(G,mt),gt.reversedDepthBuffer&&h&&ve.buffers.depth.setReversed(!0),N=G.createFramebuffer(),C=G.createFramebuffer(),k=G.createFramebuffer(),bt=new r0(G),De=new Av,Ue=new Gv(G,mt,ve,De,gt,oe,bt),D=new t0(R),S=new op(G),ce=new Vg(G,S),W=new n0(G,S,bt,ce),re=new o0(G,W,S,ce,bt),Q=new a0(G,gt,Ue),j=new qg(De),ee=new Tv(R,D,mt,gt,ce,j),le=new Kv(R,De),me=new Cv,J=new Uv(mt),U=new Gg(R,D,ve,re,p,l),he=new Hv(R,re,gt),Ce=new Zv(G,bt,gt,ve),Z=new Wg(G,mt,bt),ue=new s0(G,mt,bt),bt.programs=ee.programs,R.capabilities=gt,R.extensions=mt,R.properties=De,R.renderLists=me,R.shadowMap=he,R.state=ve,R.info=bt}x!==jt&&(L=new c0(x,t.width,t.height,o,s,r));const ae=new $v(R,G);this.xr=ae,this.getContext=function(){return G},this.getContextAttributes=function(){return G.getContextAttributes()},this.forceContextLoss=function(){const b=mt.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=mt.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return de},this.setPixelRatio=function(b){b!==void 0&&(de=b,this.setSize(fe,we,!1))},this.getSize=function(b){return b.set(fe,we)},this.setSize=function(b,F,Y=!0){if(ae.isPresenting){Ne("WebGLRenderer: Can't change size while VR device is presenting.");return}fe=b,we=F,t.width=Math.floor(b*de),t.height=Math.floor(F*de),Y===!0&&(t.style.width=b+"px",t.style.height=F+"px"),L!==null&&L.setSize(t.width,t.height),this.setViewport(0,0,b,F)},this.getDrawingBufferSize=function(b){return b.set(fe*de,we*de).floor()},this.setDrawingBufferSize=function(b,F,Y){fe=b,we=F,de=Y,t.width=Math.floor(b*Y),t.height=Math.floor(F*Y),this.setViewport(0,0,b,F)},this.setEffects=function(b){if(x===jt){et("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(b){for(let F=0;F<b.length;F++)if(b[F].isOutputPass===!0){Ne("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}L.setEffects(b||[])},this.getCurrentViewport=function(b){return b.copy($)},this.getViewport=function(b){return b.copy(Te)},this.setViewport=function(b,F,Y,V){b.isVector4?Te.set(b.x,b.y,b.z,b.w):Te.set(b,F,Y,V),ve.viewport($.copy(Te).multiplyScalar(ti()).round())},this.getScissor=function(b){return b.copy(qe)},this.setScissor=function(b,F,Y,V){b.isVector4?qe.set(b.x,b.y,b.z,b.w):qe.set(b,F,Y,V),ve.scissor(te.copy(qe).multiplyScalar(ti()).round())},this.getScissorTest=function(){return Ke},this.setScissorTest=function(b){ve.setScissorTest(Ke=b)},this.setOpaqueSort=function(b){Pe=b},this.setTransparentSort=function(b){je=b},this.getClearColor=function(b){return b.copy(U.getClearColor())},this.setClearColor=function(){U.setClearColor(...arguments)},this.getClearAlpha=function(){return U.getClearAlpha()},this.setClearAlpha=function(){U.setClearAlpha(...arguments)},this.clear=function(b=!0,F=!0,Y=!0){let V=0;if(b){let X=!1;if(P!==null){const ge=P.texture.format;X=m.has(ge)}if(X){const ge=P.texture.type,Me=v.has(ge),pe=U.getClearColor(),ye=U.getClearAlpha(),Ae=pe.r,Oe=pe.g,We=pe.b;Me?(M[0]=Ae,M[1]=Oe,M[2]=We,M[3]=ye,G.clearBufferuiv(G.COLOR,0,M)):(T[0]=Ae,T[1]=Oe,T[2]=We,T[3]=ye,G.clearBufferiv(G.COLOR,0,T))}else V|=G.COLOR_BUFFER_BIT}F&&(V|=G.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Y&&(V|=G.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),V!==0&&G.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(b){b.setRenderer(this),O=b},this.dispose=function(){t.removeEventListener("webglcontextlost",Ie,!1),t.removeEventListener("webglcontextrestored",ke,!1),t.removeEventListener("webglcontextcreationerror",xe,!1),U.dispose(),me.dispose(),J.dispose(),Ue.dispose(),De.dispose(),D.dispose(),re.dispose(),W.dispose(),ce.dispose(),Ce.dispose(),ee.dispose(),ae.dispose(),ae.removeEventListener("sessionstart",il),ae.removeEventListener("sessionend",nl),on.stop()};function Ie(b){b.preventDefault(),Bl("WebGLRenderer: Context Lost."),A=!0}function ke(){Bl("WebGLRenderer: Context Restored."),A=!1;const b=bt.autoReset,F=he.enabled,Y=he.autoUpdate,V=he.needsUpdate,X=he.type;ze(),bt.autoReset=b,he.enabled=F,he.autoUpdate=Y,he.needsUpdate=V,he.type=X}function xe(b){et("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function at(b){const F=b.target;F.removeEventListener("dispose",at),At(F)}function At(b){Vi(b),De.remove(b)}function Vi(b){const F=De.get(b).programs;F!==void 0&&(F.forEach(function(Y){ee.releaseProgram(Y)}),b.isShaderMaterial&&ee.releaseShaderCache(b))}this.renderBufferDirect=function(b,F,Y,V,X,ge){F===null&&(F=Dt);const Me=X.isMesh&&X.matrixWorld.determinantAffine()<0,pe=Zh(b,F,Y,V,X);ve.setMaterial(V,Me);let ye=Y.index,Ae=1;if(V.wireframe===!0){if(ye=W.getWireframeAttribute(Y),ye===void 0)return;Ae=2}const Oe=Y.drawRange,We=Y.attributes.position;let be=Oe.start*Ae,Xe=(Oe.start+Oe.count)*Ae;ge!==null&&(be=Math.max(be,ge.start*Ae),Xe=Math.min(Xe,(ge.start+ge.count)*Ae)),ye!==null?(be=Math.max(be,0),Xe=Math.min(Xe,ye.count)):We!=null&&(be=Math.max(be,0),Xe=Math.min(Xe,We.count));const St=Xe-be;if(St<0||St===1/0)return;ce.setup(X,V,pe,Y,ye);let ht,lt=Z;if(ye!==null&&(ht=S.get(ye),lt=ue,lt.setIndex(ht)),X.isMesh)V.wireframe===!0?(ve.setLineWidth(V.wireframeLinewidth*ti()),lt.setMode(G.LINES)):lt.setMode(G.TRIANGLES);else if(X.isLine){let Nt=V.linewidth;Nt===void 0&&(Nt=1),ve.setLineWidth(Nt*ti()),X.isLineSegments?lt.setMode(G.LINES):X.isLineLoop?lt.setMode(G.LINE_LOOP):lt.setMode(G.LINE_STRIP)}else X.isPoints?lt.setMode(G.POINTS):X.isSprite&&lt.setMode(G.TRIANGLES);if(X.isBatchedMesh)if(mt.get("WEBGL_multi_draw"))lt.renderMultiDraw(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount);else{const Nt=X._multiDrawStarts,Ee=X._multiDrawCounts,kt=X._multiDrawCount,Qe=ye?S.get(ye).bytesPerElement:1,ln=De.get(V).currentProgram.getUniforms();for(let Ut=0;Ut<kt;Ut++)ln.setValue(G,"_gl_DrawID",Ut),lt.render(Nt[Ut]/Qe,Ee[Ut])}else if(X.isInstancedMesh)lt.renderInstances(be,St,X.count);else if(Y.isInstancedBufferGeometry){const Nt=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,Ee=Math.min(Y.instanceCount,Nt);lt.renderInstances(be,St,Ee)}else lt.render(be,St)};function tl(b,F,Y,V){O!==null&&b.isNodeMaterial&&O.setObject(V,b),Se===!0&&j.setState(b,Y,!1),b.transparent===!0&&b.side===xi&&b.forceSinglePass===!1?(b.side=$t,b.needsUpdate=!0,ss(b,F,V),b.side=_n,b.needsUpdate=!0,ss(b,F,V),b.side=xi):ss(b,F,V)}this.compile=function(b,F,Y=null){Y===null&&(Y=b),O!==null&&O.renderStart(b,F,Y),y=J.get(Y),y.init(F),_.push(y),Y.traverseVisible(function(X){X.isLight&&X.layers.test(F.layers)&&(y.pushLight(X),X.castShadow&&y.pushShadow(X))}),b!==Y&&b.traverseVisible(function(X){X.isLight&&X.layers.test(F.layers)&&(y.pushLight(X),X.castShadow&&y.pushShadow(X))}),y.setupLights(),O!==null&&O.updateLights(y.state.lightsArray),Ze=this.localClippingEnabled,Se=j.init(this.clippingPlanes,Ze),Se===!0&&j.setGlobalState(this.clippingPlanes,F),O!==null&&he.render(y.state.shadowsArray,Y,F);const V=new Set;return b.traverse(function(X){if(!(X.isMesh||X.isPoints||X.isLine||X.isSprite))return;const ge=X.material;if(ge)if(Array.isArray(ge))for(let Me=0;Me<ge.length;Me++){const pe=ge[Me];tl(pe,Y,F,X),V.add(pe)}else tl(ge,Y,F,X),V.add(ge)}),y=_.pop(),O!==null&&O.renderEnd(),V},this.compileAsync=function(b,F,Y=null){const V=this.compile(b,F,Y);return new Promise(X=>{function ge(){if(V.forEach(function(Me){const ye=De.get(Me).currentProgram;(ye===void 0||ye.isReady())&&V.delete(Me)}),V.size===0){X(b);return}setTimeout(ge,10)}mt.get("KHR_parallel_shader_compile")!==null?ge():setTimeout(ge,10)})};let Gr=null;function Yh(b){Gr&&Gr(b)}function il(){on.stop()}function nl(){on.start()}const on=new Oh;on.setAnimationLoop(Yh),typeof self<"u"&&on.setContext(self),this.setAnimationLoop=function(b){Gr=b,ae.setAnimationLoop(b),b===null?on.stop():on.start()},ae.addEventListener("sessionstart",il),ae.addEventListener("sessionend",nl),this.render=function(b,F){if(F!==void 0&&F.isCamera!==!0){et("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(A===!0)return;O!==null&&O.renderStart(b,F);const Y=ae.enabled===!0&&ae.isPresenting===!0,V=L!==null&&(P===null||Y)&&L.begin(R,P);if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),ae.enabled===!0&&ae.isPresenting===!0&&(L===null||L.isCompositing()===!1)&&(ae.cameraAutoUpdate===!0&&ae.updateCamera(F),F=ae.getCamera()),b.isScene===!0&&b.onBeforeRender(R,b,F,P),y=J.get(b,_.length),y.init(F),y.state.textureUnits=Ue.getTextureUnits(),_.push(y),it.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),F.isArrayCamera?Re.setFromArrayCamera(F):ie.setFromProjectionMatrix(it,Si,F.reversedDepth),Ze=this.localClippingEnabled,Se=j.init(this.clippingPlanes,Ze),w=me.get(b,g.length),w.init(),g.push(w),this.info.render.frame++,ae.enabled===!0&&ae.isPresenting===!0){const Me=R.xr.getDepthSensingMesh();Me!==null&&Vr(Me,F,-1/0,R.sortObjects)}Vr(b,F,0,R.sortObjects),w.finish(),O!==null&&O.updateLights(y.state.lightsArray),R.sortObjects===!0&&w.sort(Pe,je),ei=ae.enabled===!1||ae.isPresenting===!1||ae.hasDepthSensing()===!1,ei&&U.addToRenderList(w,b),this.info.autoReset===!0&&this.info.reset(),Se===!0&&j.beginShadows();const X=y.state.shadowsArray;if(he.render(X,b,F),Se===!0&&j.endShadows(),(V&&L.hasRenderPass())===!1){const Me=w.opaque,pe=w.transmissive;if(y.setupLights(),F.isArrayCamera){const ye=F.cameras;if(pe.length>0)for(let Ae=0,Oe=ye.length;Ae<Oe;Ae++){const We=ye[Ae];rl(Me,pe,b,We)}ei&&U.render(b);for(let Ae=0,Oe=ye.length;Ae<Oe;Ae++){const We=ye[Ae];sl(w,b,We,We.viewport)}}else pe.length>0&&rl(Me,pe,b,F),ei&&U.render(b),sl(w,b,F)}P!==null&&H===0&&(Ue.updateMultisampleRenderTarget(P),Ue.updateRenderTargetMipmap(P)),V&&L.end(R),b.isScene===!0&&b.onAfterRender(R,b,F),ce.resetDefaultState(),I=-1,z=null,_.pop(),_.length>0?(y=_[_.length-1],Ue.setTextureUnits(y.state.textureUnits),Se===!0&&j.setGlobalState(R.clippingPlanes,y.state.camera)):y=null,g.pop(),g.length>0?w=g[g.length-1]:w=null,O!==null&&O.renderEnd()};function Vr(b,F,Y,V){if(b.visible===!1)return;if(b.layers.test(F.layers)){if(b.isGroup)Y=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(F);else if(b.isLight)y.pushLight(b),b.castShadow&&y.pushShadow(b);else if(b.isSprite){const Me=F.isArrayCamera?Re:ie;if(!b.frustumCulled||b.intersectsFrustum(Me)){V&&He.setFromMatrixPosition(b.matrixWorld).applyMatrix4(it);const pe=re.update(b),ye=b.material;ye.visible&&w.push(b,pe,ye,Y,He.z,null,F)}}else if(b.isMesh||b.isLine||b.isPoints){const Me=F.isArrayCamera?Re:ie;if(!b.frustumCulled||b.intersectsFrustum(Me)){const pe=re.update(b),ye=b.material;if(V&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),He.copy(b.boundingSphere.center)):(pe.boundingSphere===null&&pe.computeBoundingSphere(),He.copy(pe.boundingSphere.center)),He.applyMatrix4(b.matrixWorld).applyMatrix4(it)),Array.isArray(ye)){const Ae=pe.groups;for(let Oe=0,We=Ae.length;Oe<We;Oe++){const be=Ae[Oe],Xe=ye[be.materialIndex];Xe&&Xe.visible&&w.push(b,pe,Xe,Y,He.z,be,F)}}else ye.visible&&w.push(b,pe,ye,Y,He.z,null,F)}}}const ge=b.children;for(let Me=0,pe=ge.length;Me<pe;Me++)Vr(ge[Me],F,Y,V)}function sl(b,F,Y,V){const{opaque:X,transmissive:ge,transparent:Me}=b;y.setupLightsView(Y),Se===!0&&j.setGlobalState(R.clippingPlanes,Y),V&&ve.viewport($.copy(V)),X.length>0&&Ps(X,F,Y),ge.length>0&&Ps(ge,F,Y),Me.length>0&&Ps(Me,F,Y),ve.buffers.depth.setTest(!0),ve.buffers.depth.setMask(!0),ve.buffers.color.setMask(!0),ve.setPolygonOffset(!1)}function rl(b,F,Y,V){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;if(y.state.transmissionRenderTarget[V.id]===void 0){const be=mt.has("EXT_color_buffer_half_float")||mt.has("EXT_color_buffer_float");y.state.transmissionRenderTarget[V.id]=new Ci(1,1,{generateMipmaps:!0,type:be?Ii:jt,minFilter:nn,samples:Math.max(4,gt.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:$e.workingColorSpace})}const ge=y.state.transmissionRenderTarget[V.id],Me=V.viewport||$;ge.setSize(Me.z*R.transmissionResolutionScale,Me.w*R.transmissionResolutionScale);const pe=R.getRenderTarget(),ye=R.getActiveCubeFace(),Ae=R.getActiveMipmapLevel();R.setRenderTarget(ge),R.getClearColor(q),ne=R.getClearAlpha(),ne<1&&R.setClearColor(16777215,.5),R.clear(),ei&&U.render(Y);const Oe=R.toneMapping;R.toneMapping=Hi;const We=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),y.setupLightsView(V),Se===!0&&j.setGlobalState(R.clippingPlanes,V),Ps(b,Y,V),Ue.updateMultisampleRenderTarget(ge),Ue.updateRenderTargetMipmap(ge),mt.has("WEBGL_multisampled_render_to_texture")===!1){let be=!1;for(let Xe=0,St=F.length;Xe<St;Xe++){const ht=F[Xe],{object:lt,geometry:Nt,material:Ee,group:kt}=ht;if(Ee.side===xi&&lt.layers.test(V.layers)){const Qe=Ee.side;Ee.side=$t,Ee.needsUpdate=!0,al(lt,Y,V,Nt,Ee,kt),Ee.side=Qe,Ee.needsUpdate=!0,be=!0}}be===!0&&(Ue.updateMultisampleRenderTarget(ge),Ue.updateRenderTargetMipmap(ge))}R.setRenderTarget(pe,ye,Ae),R.setClearColor(q,ne),We!==void 0&&(V.viewport=We),R.toneMapping=Oe}function Ps(b,F,Y){const V=F.isScene===!0?F.overrideMaterial:null;for(let X=0,ge=b.length;X<ge;X++){const Me=b[X],{object:pe,geometry:ye,group:Ae}=Me;let Oe=Me.material;Oe.allowOverride===!0&&V!==null&&(Oe=V),pe.layers.test(Y.layers)&&al(pe,F,Y,ye,Oe,Ae)}}function al(b,F,Y,V,X,ge){O!==null&&X.isNodeMaterial&&O.setObject(b,X),b.onBeforeRender(R,F,Y,V,X,ge),b.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),X.onBeforeRender(R,F,Y,V,b,ge),X.transparent===!0&&X.side===xi&&X.forceSinglePass===!1?(X.side=$t,X.needsUpdate=!0,R.renderBufferDirect(Y,F,V,X,b,ge),X.side=_n,X.needsUpdate=!0,R.renderBufferDirect(Y,F,V,X,b,ge),X.side=xi):R.renderBufferDirect(Y,F,V,X,b,ge),b.onAfterRender(R,F,Y,V,X,ge)}function ol(b){let F=0;for(const Y of b)Y.texture!==null&&F++;return F}function ss(b,F,Y){F.isScene!==!0&&(F=Dt);const V=De.get(b),X=y.state.lights,ge=y.state.shadowsArray,Me=X.state.version,pe=ee.getParameters(b,X.state,ge,F,Y,y.state.lightProbeGridArray),ye=ee.getProgramCacheKey(pe);let Ae=V.programs;V.environment=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?F.environment:null,V.fog=F.fog;const Oe=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap;V.envMap=D.get(b.envMap||V.environment,Oe),V.envMapRotation=V.environment!==null&&b.envMap===null?F.environmentRotation:b.envMapRotation,Ae===void 0&&(b.addEventListener("dispose",at),Ae=new Map,V.programs=Ae,V.programVariants=new Map);let We=Ae.get(ye);if(We!==void 0){if(V.currentProgram===We&&V.lightsStateVersion===Me)return cl(b,pe),We}else pe.uniforms=ee.getUniforms(b),O!==null&&b.isNodeMaterial&&O.build(b,Y,pe),b.onBeforeCompile(pe,R),We=ee.acquireProgram(pe,ye),Ae.set(ye,We),V.uniforms=pe.uniforms;const be=V.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(be.clippingPlanes=j.uniform),cl(b,pe),V.needsLights=jh(b),V.lightsStateVersion=Me,V.needsLights&&(be.ambientLightColor.value=X.state.ambient,be.lightProbe.value=X.state.probe,be.sunLights.value=X.state.sun,be.sunLightShadows.value=X.state.sunShadow,be.directionalLights.value=X.state.directional,be.directionalLightShadows.value=X.state.directionalShadow,be.spotLights.value=X.state.spot,be.spotLightShadows.value=X.state.spotShadow,be.rectAreaLights.value=X.state.rectArea,be.ltc_1.value=X.state.rectAreaLTC1,be.ltc_2.value=X.state.rectAreaLTC2,be.pointLights.value=X.state.point,be.pointLightShadows.value=X.state.pointShadow,be.hemisphereLights.value=X.state.hemi,be.sunShadowMatrix.value=X.state.sunShadowMatrix,be.sunShadowCascade.value=X.state.sunShadowCascade,be.directionalShadowMatrix.value=X.state.directionalShadowMatrix,be.spotLightMatrix.value=X.state.spotLightMatrix,be.spotLightMap.value=X.state.spotLightMap,be.pointShadowMatrix.value=X.state.pointShadowMatrix),V.numLightProbeGrids=ol(y.state.lightProbeGridArray),V.currentProgram=We,V.uniformsList=null,We}function Kh(b,F,Y,V,X){const ge=De.get(b),Me=ge.currentProgram.id+","+V+","+X;let pe=ge.programVariants.get(Me);return pe===void 0?(pe=ss(b,F,Y),ge.programVariants.set(Me,pe)):(ge.currentProgram=pe,ge.uniformsList=null,ge.outputColorSpace=V,ge.toneMapping=X),pe}function ll(b){if(b.uniformsList===null){const F=b.currentProgram.getUniforms();b.uniformsList=Sr.seqWithValue(F.seq,b.uniforms)}return b.uniformsList}function cl(b,F){const Y=De.get(b);Y.outputColorSpace=F.outputColorSpace,Y.batching=F.batching,Y.batchingColor=F.batchingColor,Y.instancing=F.instancing,Y.instancingColor=F.instancingColor,Y.instancingMorph=F.instancingMorph,Y.skinning=F.skinning,Y.morphTargets=F.morphTargets,Y.morphNormals=F.morphNormals,Y.morphColors=F.morphColors,Y.morphTargetsCount=F.morphTargetsCount,Y.numClippingPlanes=F.numClippingPlanes,Y.numIntersection=F.numClipIntersection,Y.vertexAlphas=F.vertexAlphas,Y.vertexTangents=F.vertexTangents,Y.toneMapping=F.toneMapping}function Zh(b,F,Y,V,X){F.isScene!==!0&&(F=Dt),Ue.resetTextureUnits();const ge=F.fog,Me=V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial?F.environment:null,pe=P===null?R.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:$e.workingColorSpace,ye=V.isMeshStandardMaterial||V.isMeshLambertMaterial&&!V.envMap||V.isMeshPhongMaterial&&!V.envMap,Ae=D.get(V.envMap||Me,ye),Oe=V.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,We=!!Y.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),be=!!Y.morphAttributes.position,Xe=!!Y.morphAttributes.normal,St=!!Y.morphAttributes.color;let ht=Hi;V.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(ht=R.toneMapping);const lt=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,Nt=lt!==void 0?lt.length:0,Ee=De.get(V),kt=y.state.lights;if(Se===!0&&(Ze===!0||b!==z)){const xt=b===z&&V.id===I;j.setState(V,b,xt)}let Qe=!1,ln=!1;V.version===Ee.__version?Ee.needsLights&&Ee.lightsStateVersion!==kt.state.version||X.isBatchedMesh&&Ee.batching===!1||!X.isBatchedMesh&&Ee.batching===!0||X.isBatchedMesh&&Ee.batchingColor===!0&&X._colorsTexture===null||X.isBatchedMesh&&Ee.batchingColor===!1&&X._colorsTexture!==null||X.isInstancedMesh&&Ee.instancing===!1||!X.isInstancedMesh&&Ee.instancing===!0||X.isSkinnedMesh&&Ee.skinning===!1||!X.isSkinnedMesh&&Ee.skinning===!0||X.isInstancedMesh&&Ee.instancingColor===!0&&X.instanceColor===null||X.isInstancedMesh&&Ee.instancingColor===!1&&X.instanceColor!==null||X.isInstancedMesh&&Ee.instancingMorph===!0&&X.morphTexture===null||X.isInstancedMesh&&Ee.instancingMorph===!1&&X.morphTexture!==null||Ee.envMap!==Ae||V.fog===!0&&Ee.fog!==ge||Ee.numClippingPlanes!==void 0&&(Ee.numClippingPlanes!==j.numPlanes||Ee.numIntersection!==j.numIntersection)||Ee.vertexAlphas!==Oe||Ee.vertexTangents!==We||Ee.morphTargets!==be||Ee.morphNormals!==Xe||Ee.morphColors!==St||Ee.morphTargetsCount!==Nt||Ee.numLightProbeGrids!==ol(y.state.lightProbeGridArray)?Qe=!0:(Ee.outputColorSpace!==pe||Ee.toneMapping!==ht)&&(ln=!0):(Qe=!0,Ee.__version=V.version);let Ut=Ee.currentProgram;(Qe===!0||ln===!0)&&(Ut=ln===!0?Kh(V,F,X,pe,ht):ss(V,F,X),O&&V.isNodeMaterial&&O.onUpdateProgram(V,Ut,Ee));let Is=!1,Wi=!1,cn=!1;const Je=Ut.getUniforms(),It=Ee.uniforms;if(ve.useProgram(Ut.program)&&(Is=!0,Wi=!0,cn=!0),V.id!==I&&(I=V.id,Wi=!0),Is||z!==b){ve.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),Je.setValue(G,"projectionMatrix",b.projectionMatrix),Je.setValue(G,"viewMatrix",b.matrixWorldInverse);const Rt=Je.map.cameraPosition;Rt!==void 0&&Rt.setValue(G,Wt.setFromMatrixPosition(b.matrixWorld)),gt.logarithmicDepthBuffer&&Je.setValue(G,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&Je.setValue(G,"isOrthographic",b.isOrthographicCamera===!0),z!==b&&(z=b,Wi=!0,cn=!0)}if(Ee.needsLights&&(kt.state.sunShadowMap.length>0&&Je.setValue(G,"sunShadowMap",kt.state.sunShadowMap,Ue),kt.state.directionalShadowMap.length>0&&Je.setValue(G,"directionalShadowMap",kt.state.directionalShadowMap,Ue),kt.state.spotShadowMap.length>0&&Je.setValue(G,"spotShadowMap",kt.state.spotShadowMap,Ue),kt.state.pointShadowMap.length>0&&Je.setValue(G,"pointShadowMap",kt.state.pointShadowMap,Ue)),X.isSkinnedMesh){Je.setOptional(G,X,"bindMatrix"),Je.setOptional(G,X,"bindMatrixInverse");const xt=X.skeleton;xt&&(xt.boneTexture===null&&xt.computeBoneTexture(),Je.setValue(G,"boneTexture",xt.boneTexture,Ue))}X.isBatchedMesh&&(Je.setOptional(G,X,"batchingTexture"),Je.setValue(G,"batchingTexture",X._matricesTexture,Ue),Je.setOptional(G,X,"batchingIdTexture"),Je.setValue(G,"batchingIdTexture",X._indirectTexture,Ue),Je.setOptional(G,X,"batchingColorTexture"),X._colorsTexture!==null&&Je.setValue(G,"batchingColorTexture",X._colorsTexture,Ue));const ci=Y.morphAttributes;if((ci.position!==void 0||ci.normal!==void 0||ci.color!==void 0)&&Q.update(X,Y,Ut),(Wi||Ee.receiveShadow!==X.receiveShadow)&&(Ee.receiveShadow=X.receiveShadow,Je.setValue(G,"receiveShadow",X.receiveShadow)),(V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial)&&V.envMap===null&&F.environment!==null&&(It.envMapIntensity.value=F.environmentIntensity),It.dfgLUT!==void 0&&(It.dfgLUT.value=jv()),Wi){if(Je.setValue(G,"toneMappingExposure",R.toneMappingExposure),Ee.needsLights&&Jh(It,cn),ge&&V.fog===!0&&le.refreshFogUniforms(It,ge),le.refreshMaterialUniforms(It,V,de,we,y.state.transmissionRenderTarget[b.id]),Ee.needsLights&&Ee.numLightProbeGrids>0){const xt=E;let Rt=0;for(const Li of y.state.lightProbeGridArray)Li.texture!==null&&(xt.textures[Rt]=Li.texture,xt.min[Rt]=Li.boundingBox.min,xt.max[Rt]=Li.boundingBox.max,xt.resolution[Rt]=Li.resolution,Rt++);for(const Li in xt)xt[Li].length=Rt;It.probesSH.value=xt.textures,It.probesMin.value=xt.min,It.probesMax.value=xt.max,It.probesResolution.value=xt.resolution}Sr.upload(G,ll(Ee),It,Ue)}if(V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(Sr.upload(G,ll(Ee),It,Ue),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&Je.setValue(G,"center",X.center),Je.setValue(G,"modelViewMatrix",X.modelViewMatrix),Je.setValue(G,"normalMatrix",X.normalMatrix),Je.setValue(G,"modelMatrix",X.matrixWorld),V.uniformsGroups!==void 0){const xt=V.uniformsGroups;for(let Rt=0,Li=xt.length;Rt<Li;Rt++){const ul=xt[Rt];Ce.update(ul,Ut),Ce.bind(ul,Ut)}}return Ut}function Jh(b,F){b.ambientLightColor.needsUpdate=F,b.lightProbe.needsUpdate=F,b.sunLights.needsUpdate=F,b.sunLightShadows.needsUpdate=F,b.directionalLights.needsUpdate=F,b.directionalLightShadows.needsUpdate=F,b.pointLights.needsUpdate=F,b.pointLightShadows.needsUpdate=F,b.spotLights.needsUpdate=F,b.spotLightShadows.needsUpdate=F,b.rectAreaLights.needsUpdate=F,b.hemisphereLights.needsUpdate=F}function jh(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return B},this.getActiveMipmapLevel=function(){return H},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(b,F,Y){const V=De.get(b);V.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,V.__autoAllocateDepthBuffer===!1&&(V.__useRenderToTexture=!1),De.get(b.texture).__webglTexture=F,De.get(b.depthTexture).__webglTexture=V.__autoAllocateDepthBuffer?void 0:Y,V.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,F){const Y=De.get(b);Y.__webglFramebuffer=F,Y.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(b,F=0,Y=0){P=b,B=F,H=Y;let V=null,X=!1,ge=!1;if(b){const pe=De.get(b);if(pe.__useDefaultFramebuffer!==void 0){ve.bindFramebuffer(G.FRAMEBUFFER,pe.__webglFramebuffer),$.copy(b.viewport),te.copy(b.scissor),se=b.scissorTest,ve.viewport($),ve.scissor(te),ve.setScissorTest(se),I=-1;return}else if(pe.__webglFramebuffer===void 0)Ue.setupRenderTarget(b);else if(pe.__hasExternalTextures)Ue.rebindTextures(b,De.get(b.texture).__webglTexture,De.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const Oe=b.depthTexture;if(pe.__boundDepthTexture!==Oe){if(Oe!==null&&De.has(Oe)&&(b.width!==Oe.image.width||b.height!==Oe.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Ue.setupDepthRenderbuffer(b)}}const ye=b.texture;(ye.isData3DTexture||ye.isDataArrayTexture||ye.isCompressedArrayTexture)&&(ge=!0);const Ae=De.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Ae[F])?V=Ae[F][Y]:V=Ae[F],X=!0):b.samples>0&&Ue.useMultisampledRTT(b)===!1?V=De.get(b).__webglMultisampledFramebuffer:Array.isArray(Ae)?V=Ae[Y]:V=Ae,$.copy(b.viewport),te.copy(b.scissor),se=b.scissorTest}else $.copy(Te).multiplyScalar(de).floor(),te.copy(qe).multiplyScalar(de).floor(),se=Ke;if(Y!==0&&(V=N),ve.bindFramebuffer(G.FRAMEBUFFER,V)&&ve.drawBuffers(b,V),ve.viewport($),ve.scissor(te),ve.setScissorTest(se),X){const pe=De.get(b.texture);G.framebufferTexture2D(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_CUBE_MAP_POSITIVE_X+F,pe.__webglTexture,Y)}else if(ge){const pe=F;for(let ye=0;ye<b.textures.length;ye++){const Ae=De.get(b.textures[ye]);G.framebufferTextureLayer(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0+ye,Ae.__webglTexture,Y,pe)}}else if(b!==null&&Y!==0){const pe=De.get(b.texture);G.framebufferTexture2D(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_2D,pe.__webglTexture,Y)}I=-1};function hl(b){const F=De.get(b);return(F.__readFormat!==b.format||F.__readType!==b.type)&&(F.__readFormat=b.format,F.__readType=b.type,F.__formatReadable=gt.textureFormatReadable(b.format),F.__typeReadable=gt.textureTypeReadable(b.type)),F}this.readRenderTargetPixels=function(b,F,Y,V,X,ge,Me,pe=0){if(!(b&&b.isWebGLRenderTarget)){et("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ye=De.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Me!==void 0&&(ye=ye[Me],Array.isArray(ye)&&(ye=ye[0])),ye){ve.bindFramebuffer(G.FRAMEBUFFER,ye);try{const Ae=b.textures[pe],Oe=Ae.format,We=Ae.type;b.textures.length>1&&G.readBuffer(G.COLOR_ATTACHMENT0+pe);const be=hl(Ae);if(be.__formatReadable===!1){et("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(be.__typeReadable===!1){et("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=b.width-V&&Y>=0&&Y<=b.height-X&&G.readPixels(F,Y,V,X,oe.convert(Oe),oe.convert(We),ge)}finally{const Ae=P!==null?De.get(P).__webglFramebuffer:null;ve.bindFramebuffer(G.FRAMEBUFFER,Ae)}}},this.readRenderTargetPixelsAsync=async function(b,F,Y,V,X,ge,Me,pe=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ye=De.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Me!==void 0&&(ye=ye[Me],Array.isArray(ye)&&(ye=ye[0])),ye)if(F>=0&&F<=b.width-V&&Y>=0&&Y<=b.height-X){ve.bindFramebuffer(G.FRAMEBUFFER,ye);const Ae=b.textures[pe],Oe=Ae.format,We=Ae.type;b.textures.length>1&&G.readBuffer(G.COLOR_ATTACHMENT0+pe);const be=hl(Ae);if(be.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(be.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Xe=G.createBuffer();G.bindBuffer(G.PIXEL_PACK_BUFFER,Xe),G.bufferData(G.PIXEL_PACK_BUFFER,ge.byteLength,G.STREAM_READ),G.readPixels(F,Y,V,X,oe.convert(Oe),oe.convert(We),0),G.bindBuffer(G.PIXEL_PACK_BUFFER,null);const St=P!==null?De.get(P).__webglFramebuffer:null;ve.bindFramebuffer(G.FRAMEBUFFER,St);const ht=G.fenceSync(G.SYNC_GPU_COMMANDS_COMPLETE,0);return G.flush(),await wd(G,ht,4),G.bindBuffer(G.PIXEL_PACK_BUFFER,Xe),G.getBufferSubData(G.PIXEL_PACK_BUFFER,0,ge),G.bindBuffer(G.PIXEL_PACK_BUFFER,null),G.deleteBuffer(Xe),G.deleteSync(ht),ge}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,F=null,Y=0){const V=Math.pow(2,-Y),X=Math.floor(b.image.width*V),ge=Math.floor(b.image.height*V),Me=F!==null?F.x:0,pe=F!==null?F.y:0;Ue.setTexture2D(b,0),G.copyTexSubImage2D(G.TEXTURE_2D,Y,0,0,Me,pe,X,ge),ve.unbindTexture()},this.copyTextureToTexture=function(b,F,Y=null,V=null,X=0,ge=0){let Me,pe,ye,Ae,Oe,We,be,Xe,St;const ht=b.isCompressedTexture?b.mipmaps[ge]:b.image;if(Y!==null)Me=Y.max.x-Y.min.x,pe=Y.max.y-Y.min.y,ye=Y.isBox3?Y.max.z-Y.min.z:1,Ae=Y.min.x,Oe=Y.min.y,We=Y.isBox3?Y.min.z:0;else{const Je=Math.pow(2,-X);Me=Math.floor(ht.width*Je),pe=Math.floor(ht.height*Je),b.isDataArrayTexture?ye=ht.depth:b.isData3DTexture?ye=Math.floor(ht.depth*Je):ye=1,Ae=0,Oe=0,We=0}V!==null?(be=V.x,Xe=V.y,St=V.z):(be=0,Xe=0,St=0);const lt=oe.convert(F.format),Nt=oe.convert(F.type);let Ee;F.isData3DTexture?(Ue.setTexture3D(F,0),Ee=G.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(Ue.setTexture2DArray(F,0),Ee=G.TEXTURE_2D_ARRAY):(Ue.setTexture2D(F,0),Ee=G.TEXTURE_2D),ve.activeTexture(G.TEXTURE0),ve.pixelStorei(G.UNPACK_FLIP_Y_WEBGL,F.flipY),ve.pixelStorei(G.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),ve.pixelStorei(G.UNPACK_ALIGNMENT,F.unpackAlignment);const kt=ve.getParameter(G.UNPACK_ROW_LENGTH),Qe=ve.getParameter(G.UNPACK_IMAGE_HEIGHT),ln=ve.getParameter(G.UNPACK_SKIP_PIXELS),Ut=ve.getParameter(G.UNPACK_SKIP_ROWS),Is=ve.getParameter(G.UNPACK_SKIP_IMAGES);ve.pixelStorei(G.UNPACK_ROW_LENGTH,ht.width),ve.pixelStorei(G.UNPACK_IMAGE_HEIGHT,ht.height),ve.pixelStorei(G.UNPACK_SKIP_PIXELS,Ae),ve.pixelStorei(G.UNPACK_SKIP_ROWS,Oe),ve.pixelStorei(G.UNPACK_SKIP_IMAGES,We);const Wi=b.isDataArrayTexture||b.isData3DTexture,cn=F.isDataArrayTexture||F.isData3DTexture;if(b.isDepthTexture){const Je=De.get(b),It=De.get(F),ci=De.get(Je.__renderTarget),xt=De.get(It.__renderTarget);ve.bindFramebuffer(G.READ_FRAMEBUFFER,ci.__webglFramebuffer),ve.bindFramebuffer(G.DRAW_FRAMEBUFFER,xt.__webglFramebuffer);for(let Rt=0;Rt<ye;Rt++)Wi&&(G.framebufferTextureLayer(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,De.get(b).__webglTexture,X,We+Rt),G.framebufferTextureLayer(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,De.get(F).__webglTexture,ge,St+Rt)),G.blitFramebuffer(Ae,Oe,Ae+Me,Oe+pe,be,Xe,be+Me,Xe+pe,G.DEPTH_BUFFER_BIT,G.NEAREST);ve.bindFramebuffer(G.READ_FRAMEBUFFER,null),ve.bindFramebuffer(G.DRAW_FRAMEBUFFER,null)}else if(X!==0||b.isRenderTargetTexture||De.has(b)){const Je=De.get(b),It=De.get(F);ve.bindFramebuffer(G.READ_FRAMEBUFFER,C),ve.bindFramebuffer(G.DRAW_FRAMEBUFFER,k);for(let ci=0;ci<ye;ci++)Wi?G.framebufferTextureLayer(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,Je.__webglTexture,X,We+ci):G.framebufferTexture2D(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_2D,Je.__webglTexture,X),cn?G.framebufferTextureLayer(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,It.__webglTexture,ge,St+ci):G.framebufferTexture2D(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_2D,It.__webglTexture,ge),X!==0?G.blitFramebuffer(Ae,Oe,Ae+Me,Oe+pe,be,Xe,be+Me,Xe+pe,G.COLOR_BUFFER_BIT,G.NEAREST):cn?G.copyTexSubImage3D(Ee,ge,be,Xe,St+ci,Ae,Oe,Me,pe):G.copyTexSubImage2D(Ee,ge,be,Xe,Ae,Oe,Me,pe);ve.bindFramebuffer(G.READ_FRAMEBUFFER,null),ve.bindFramebuffer(G.DRAW_FRAMEBUFFER,null)}else cn?b.isDataTexture||b.isData3DTexture?G.texSubImage3D(Ee,ge,be,Xe,St,Me,pe,ye,lt,Nt,ht.data):F.isCompressedArrayTexture?G.compressedTexSubImage3D(Ee,ge,be,Xe,St,Me,pe,ye,lt,ht.data):G.texSubImage3D(Ee,ge,be,Xe,St,Me,pe,ye,lt,Nt,ht):b.isDataTexture?G.texSubImage2D(G.TEXTURE_2D,ge,be,Xe,Me,pe,lt,Nt,ht.data):b.isCompressedTexture?G.compressedTexSubImage2D(G.TEXTURE_2D,ge,be,Xe,ht.width,ht.height,lt,ht.data):G.texSubImage2D(G.TEXTURE_2D,ge,be,Xe,Me,pe,lt,Nt,ht);ve.pixelStorei(G.UNPACK_ROW_LENGTH,kt),ve.pixelStorei(G.UNPACK_IMAGE_HEIGHT,Qe),ve.pixelStorei(G.UNPACK_SKIP_PIXELS,ln),ve.pixelStorei(G.UNPACK_SKIP_ROWS,Ut),ve.pixelStorei(G.UNPACK_SKIP_IMAGES,Is),ge===0&&F.generateMipmaps===!0&&F.mipmapsAutoUpdate===!0&&G.generateMipmap(Ee),ve.unbindTexture()},this.initRenderTarget=function(b){De.get(b).__webglFramebuffer===void 0&&Ue.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?Ue.setTextureCube(b,0):b.isData3DTexture?Ue.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?Ue.setTexture2DArray(b,0):Ue.setTexture2D(b,0),ve.unbindTexture()},this.resetState=function(){B=0,H=0,P=null,ve.reset(),ce.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Si}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=$e._getDrawingBufferColorSpace(e),t.unpackColorSpace=$e._getUnpackColorSpace()}}const Ec=`precision highp float;
in vec3 position;in vec2 uv;uniform mat4 projectionMatrix,modelViewMatrix;uniform vec2 size;out vec2 texUV;
void main(){texUV=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position.xy*size,0.,1.);}`,ex=`precision highp float;
uniform sampler2D image,palette;uniform bool indexed,maskZero;uniform vec2 coefficients;uniform float opacity;
uniform int fxCount;uniform vec3 fxAdd[8],fxMul[8],fxPost[8];uniform vec2 fxColorInvert[8];in vec2 texUV;out vec4 result;
void main(){vec4 color=texture(image,texUV);if(indexed){float i=floor(color.r*255.+.5);color=texture(palette,vec2((i+.5)/256.,.5));if(i<.5){if(maskZero)discard;color.a=1.;}}if(color.a<=0.)discard;
vec3 rgb=color.rgb*255.;for(int i=0;i<8;i++){if(i>=fxCount)break;float grey=dot(rgb,vec3(.299,.587,.114));rgb=mix(vec3(grey),rgb,fxColorInvert[i].x);if(fxColorInvert[i].y>.5)rgb=255.-rgb;rgb=clamp((rgb+fxAdd[i])*fxMul[i]+fxPost[i],0.,255.);}
rgb=floor(rgb+.00001)/255.;float coverage=color.a*opacity;result=vec4(rgb*coefficients.x*coverage,coverage*(1.-coefficients.y));}`,tx=`precision highp float;uniform float ground;in vec2 texUV;out vec4 result;
void main(){vec2 p=vec2(texUV.x*960.,texUV.y*540.);vec3 color=vec3(.047,.067,.106);float h=ground-105.;if(p.y>h){float distance=p.y-h+16.;float x=(p.x-480.)*100./distance;float lines=min(abs(fract(x/80.+.5)-.5)*distance/100.,abs(fract(log(distance/16.)*3.)-.5)*distance*.18);color=mix(vec3(.105,.153,.215),color,smoothstep(.35,1.1,lines));}if(abs(p.y-ground)<.6)color=vec3(.27,.38,.33);result=vec4(color,1.);}`,ix=()=>({add:Array.from({length:8},()=>[0,0,0]),mul:Array.from({length:8},()=>[1,1,1]),post:Array.from({length:8},()=>[0,0,0]),color:Array.from({length:8},()=>[1,0])});class nx{constructor(e,{maxTextureBytes:t=64*1024*1024,preserveDrawingBuffer:i=!1}={}){this.renderer=new Qv({canvas:e,alpha:!1,antialias:!1,powerPreference:"high-performance",preserveDrawingBuffer:i}),this.renderer.debug.onShaderError=(a,o)=>{throw Error("Sprite shader could not compile: "+a.getProgramInfoLog(o))},this.renderer.outputColorSpace=bs,this.renderer.sortObjects=!1,this.renderer.setClearColor(790811,1),this.canvas=e,this.contextLost=a=>{a.preventDefault(),this.lost=!0},e.addEventListener("webglcontextlost",this.contextLost),this.limit=t,this.textureBytes=0,this.textures=new Map,this.slots=[],this.frames=0,this.scene=new Gd,this.camera=new Fh(0,960,0,540,-10,10),this.camera.position.z=1,this.geometry=new an,this.geometry.setAttribute("position",new Mi([0,0,0,1,0,0,0,1,0,1,1,0],3)),this.geometry.setAttribute("uv",new Mi([0,0,1,0,0,1,1,1],2)),this.geometry.setIndex([0,1,2,2,1,3]);const s=new Ro({glslVersion:Ir,vertexShader:Ec,fragmentShader:tx,uniforms:{size:{value:[960,540]},ground:{value:450}},side:xi,depthTest:!1,depthWrite:!1});this.grid=new Gi(this.geometry,s),this.grid.frustumCulled=!1,this.scene.add(this.grid),this.upload({id:"@white",width:1,height:1,indexed:!1,pixels:new Uint8Array([255,255,255,255])});const r=new Uint8Array(256);for(let a=0;a<8;a++)for(let o=0;o<8;o++)if(o===3||a===3||Math.abs(o-3)===Math.abs(a-3)){const l=(a*8+o)*4;r.set([255,240,130,255],l)}this.upload({id:"@spark",width:8,height:8,pixels:r})}upload(e){if(this.textures.has(e.id))return;const t=e.pixels,i=e.width*e.height*(e.indexed?1:4);if(!Number.isSafeInteger(e.width)||!Number.isSafeInteger(e.height)||e.width<1||e.height<1)throw Error("Invalid GPU asset dimensions.");if(e.width>this.renderer.capabilities.maxTextureSize||e.height>this.renderer.capabilities.maxTextureSize)throw Error("Sprite exceeds this graphics device’s texture limit.");if(!(t instanceof Uint8Array)||t.length!==i)throw Error("Invalid GPU asset dimensions.");if(this.textureBytes+t.length>this.limit)throw Error("GPU texture budget exceeded. Close this match or use a smaller stage.");const s=new Ph(t,e.width,e.height,e.indexed?Go:yi,jt);s.minFilter=s.magFilter=Pt,s.wrapS=s.wrapT=Ai,s.generateMipmaps=!1,s.flipY=!1,s.unpackAlignment=1,s.needsUpdate=!0,this.textures.set(e.id,s),this.textureBytes+=t.length}slot(e){if(this.slots[e])return this.slots[e];const t=ix(),i=new Ro({glslVersion:Ir,vertexShader:Ec,fragmentShader:ex,uniforms:{image:{value:null},palette:{value:null},indexed:{value:!1},maskZero:{value:!0},size:{value:[1,1]},coefficients:{value:[1,0]},opacity:{value:1},fxCount:{value:0},fxAdd:{value:t.add.flat()},fxMul:{value:t.mul.flat()},fxPost:{value:t.post.flat()},fxColorInvert:{value:t.color.flat()}},transparent:!0,depthTest:!1,depthWrite:!1,blending:nh,blendSrc:Ha,blendDst:Ar,blendEquation:Bi,blendEquationAlpha:Bi,blendSrcAlpha:Ha,blendDstAlpha:Ar});i.side=xi,i.forceSinglePass=!0;const s=new Gi(this.geometry,i);return s.matrixAutoUpdate=!1,s.frustumCulled=!1,s.onBeforeRender=()=>{const r=s.userData.clip,a=this.renderer,o=this.canvas.width/960;a.setScissorTest(!!r),r&&a.setScissor(r[0]*o,(540-r[1]-r[3])*o,r[2]*o,r[3]*o),i.uniformsNeedUpdate=!0},this.scene.add(s),this.slots[e]=s,s}render(e,{width:t=960,height:i=540}={}){var r,a,o,l,c,f;if(this.closed)return;if(this.lost)throw Error("Graphics context was lost. Start the match again from your library.");(this.canvas.width!==t||this.canvas.height!==i)&&this.renderer.setSize(t,i,!1);for(const u of e.assets||[])this.upload(u);this.grid.visible=!!e.grid,this.grid.material.uniforms.ground.value=e.ground||450;const s=e.draws.concat((e.sparks||[]).map(u=>{const h=(12-u.age)*.3+1;return{texture:"@spark",indexed:!1,width:8,height:8,matrix:[h,0,0,h,u.x-4*h,u.y-4*h],blend:{mode:"add",source:1,destination:1},alpha:(12-u.age)/12}}));for(let u=0;u<Math.max(s.length,this.slots.length);u++){if(u>=s.length){this.slots[u].visible=!1;continue}const h=s[u],d=this.slot(u),p=d.material.uniforms;d.visible=!0;const x=this.textures.get(h.texture);if(!x)throw Error("GPU texture was not delivered: "+h.texture);p.image.value=x,p.palette.value=this.textures.get(h.palette)||this.textures.get("@white"),p.indexed.value=!!h.indexed,p.maskZero.value=h.mask!==!1,p.size.value[0]=h.width,p.size.value[1]=h.height,p.opacity.value=h.alpha??1,p.coefficients.value[0]=((r=h.blend)==null?void 0:r.source)??1,p.coefficients.value[1]=((a=h.blend)==null?void 0:a.destination)??0;const[m,v,M,T,E,w]=h.matrix;d.matrix.set(m,M,0,E,v,T,0,w,0,0,1,0,0,0,0,1),d.matrixWorldNeedsUpdate=!0,d.userData.clip=h.clip,d.material.blendEquation=((o=h.blend)==null?void 0:o.mode)==="subtract"?sh:Bi;const y=h.palFX||[];p.fxCount.value=Math.min(8,y.length);for(let g=0;g<p.fxCount.value;g++){const _=y[g],L=_.sinadd||[],R=L[3]?Math.sin(2*Math.PI*(_.age||0)/L[3]):0;p.fxColorInvert.value[g*2]=(_.color??256)/256,p.fxColorInvert.value[g*2+1]=_.invertall?1:0;for(let A=0;A<3;A++)p.fxAdd.value[g*3+A]=(((l=_.add)==null?void 0:l[A])||0)+(L[A]||0)*R,p.fxMul.value[g*3+A]=(((c=_.mul)==null?void 0:c[A])??256)/256,p.fxPost.value[g*3+A]=((f=_.postadd)==null?void 0:f[A])||0}}return this.renderer.setScissorTest(!1),this.renderer.render(this.scene,this.camera),this.renderer.setScissorTest(!1),this.frames++,this.stats={backend:"Kenjatime Core · Three.js",frames:this.frames,draws:s.length,textureBytes:this.textureBytes,textures:this.textures.size,width:t,height:i},this.stats}close(){if(!this.closed){this.closed=!0,this.canvas.removeEventListener("webglcontextlost",this.contextLost);for(const e of this.textures.values())e.dispose();for(const e of this.slots)e.material.dispose();this.grid.material.dispose(),this.geometry.dispose(),this.renderer.dispose(),this.renderer.forceContextLoss(),this.textures.clear()}}}const Tc=1e3/60;class sx{constructor({maxTicks:e=12}={}){this.maxTicks=e,this.reset()}reset(){this.last=null,this.debt=0,this.tickCount=0,this.lastRender=null}suspend(){this.last=null,this.debt=0,this.lastRender=null}advance(e,{running:t=!0,speed:i=1}={},s=()=>{}){if(!Number.isFinite(e)||!Number.isFinite(i)||i<=0)throw Error("Invalid frame clock time or speed.");const r=this.last===null?0:Math.max(0,e-this.last);if(this.last=e,!t)return this.debt=0,0;this.debt+=r*i/Tc;let a=0;for(;this.debt>=1-1e-9&&a<this.maxTicks;){const o=e-Math.max(0,this.debt-1)*Tc/i;s(o),this.debt=Math.max(0,this.debt-1),a++,this.tickCount++}return a}renderDue(e,t=60){return this.lastRender===null||e-this.lastRender>=1e3/t-.25?(this.lastRender=e,!0):!1}}class Ac{constructor(){this.reset()}reset(){this.sources=new Map,this.sampled=new Map,this.queue=[],this.offset=0}clearSource(e){this.sources.delete(e),this.sampled.delete(e),this.queue=this.queue.slice(this.offset).filter(t=>t.source!==e),this.offset=0}record(e,t,i){const s=new Set(t),r=this.sources.get(e)||new Set;if(s.size===r.size&&[...s].every(l=>r.has(l)))return;this.sources.set(e,s);const a={source:e,keys:s,time:i};let o=this.queue.length;for(;o>this.offset&&this.queue[o-1].time>i;)o--;this.queue.splice(o,0,a)}sample(e){const t=new Set;for(;this.offset<this.queue.length&&this.queue[this.offset].time<=e;){const s=this.queue[this.offset++],r=this.sampled.get(s.source)||new Set;for(const a of s.keys)r.has(a)||t.add(a);this.sampled.set(s.source,s.keys)}const i=new Set(t);for(const s of this.sampled.values())for(const r of s)i.add(r);return this.offset>128&&(this.queue.splice(0,this.offset),this.offset=0),i}}function rx(n){let e,t,i=!1,s=!1,r=!0,a=0,o=-1/0,l=1,c="auto",f,u,h,d=1,p=!0;const x=new sx,m=[new Ac,new Ac],v=new Map,M=new Set,T=new Map,E=[],w=N=>typeof requestAnimationFrame=="function"?requestAnimationFrame(N):setTimeout(()=>N(performance.now()),16);function y(N){const C=new Float32Array(N);if(C.fill(0),h&&!s){let k=0;for(;k<C.length/2;){let B=h.read(Math.min(2048,C.length/2-k));if(!B&&(!p||(h.seek(0),B=h.read(Math.min(2048,C.length/2-k)),!B)))break;C.set(new Float32Array(h.pcm.buffer,h.pcm.byteOffset,B*2),k*2),k+=B}if(d!==1)for(let B=0;B<C.length;B++)C[B]*=d}f==null||f.postMessage({buffer:N},[N])}function g(){var N,C,k;for(const B of e.drainEvents()){if(B.type==="playsnd")try{const H=e.characters.find($=>$.path===B.character),P=(N=H==null?void 0:H.checks.find($=>$.key==="sound"&&$.ok))==null?void 0:N.path;if(!P||B.common)continue;v.has(P)||v.set(P,gu(e.files[P]));const I=B.group??((C=B.value)==null?void 0:C[0]),z=B.number??((k=B.value)==null?void 0:k[1]);if(B.soundKey=P+":"+I+","+z,T.set(B.soundKey,{path:P,group:I,number:z}),!M.has(B.soundKey)){const $=v.get(P).get(I,z);if(!$)continue;B.bytes=$.slice(),M.add(B.soundKey)}}catch(H){e.issue("sound",H.message);continue}n({type:"sound",event:B},B.bytes?[B.bytes.buffer]:[])}}function _(N){if(!i)try{const C=performance.timeOrigin+N;if(x.advance(C,{running:!s},k=>{e.tick(m[0].sample(k),m[1].sample(k)),g()}),(!s||r)&&x.renderDue(N,60)){const k=performance.now(),B=e.frame();t.render(B,{width:Math.round(960*l),height:Math.round(540*l)});const H=performance.now()-k;if(r=!1,c==="auto"&&!B.assets.length&&!s&&(E.push(H),E.length>=30)){const P=E.reduce((I,z)=>I+z,0)/E.length;P>20?l=Math.max(.5,l-.05):P<9&&(l=Math.min(1,l+.05)),E.length=0}}N-o>=100&&(o=N,n({type:"state",state:{...e.snapshot(),paused:s,simulationDebt:x.debt},gpu:t.stats})),a=w(_)}catch(C){n({type:"error",message:C.message}),A()}}async function L({files:N,selection:C,canvas:k,sampleRate:B=48e3,quality:H="auto"}){var I;c=H,t||O(k),e=new Wf(N,C);const P=(I=e.match.stage)==null?void 0:I.definition.music;if(P!=null&&P.path&&N[P.path])if(/\.(mod|xm|it|s3m)$/i.test(P.path)){const{createModuleMusic:z}=await import("./module-music-C2Wy91BT.js");if(i)return;const $=await z();if(i){$.close();return}u=$,h=u.open(N[P.path],B),d=Math.max(0,Math.min(2,P.volume/100)),p=P.loop,n({type:"audio-init",sampleRate:B})}else{const z=N[P.path].slice();n({type:"music",bytes:z,path:P.path,volume:P.volume,loop:P.loop},[z.buffer])}i||(n({type:"ready",capabilities:e.capabilities}),a=w(_))}function R(N){var C,k;if(!i){if(N.type==="sound-request"){try{const B=T.get(N.key),H=B&&((k=(C=v.get(B.path))==null?void 0:C.get(B.group,B.number))==null?void 0:k.slice());if(!H)throw Error("Sound is unavailable.");n({type:"sound-data",key:N.key,bytes:H},[H.buffer])}catch(B){n({type:"sound-data",key:N.key,error:B.message})}return}N.type==="input"&&Array.isArray(N.keys)&&m[N.side===1?1:0].record(N.source||"keyboard",N.keys,N.time??performance.timeOrigin+performance.now()),N.type==="pause"&&(s=!!N.value,m.forEach(B=>B.reset()),x.suspend(),r=!0),N.type==="quality"&&(c=N.value,l=1,E.length=0,r=!0),N.type==="audio-port"&&(f=N.port,f.onmessage=({data:B})=>{!i&&B.buffer instanceof ArrayBuffer&&B.buffer.byteLength===8192&&y(B.buffer)},f.start()),N.type==="stop"&&A()}}function A(){i||(i=!0,typeof cancelAnimationFrame=="function"?cancelAnimationFrame(a):clearTimeout(a),f==null||f.close(),u==null||u.close(),e==null||e.close(),t==null||t.close(),f=u=h=e=t=null,v.clear(),M.clear(),T.clear(),m.forEach(N=>N.reset()))}function O(N){if(i)throw Error("Match cancelled.");t||(t=new nx(N))}return{start:L,prepare:O,control:R,stop:A,snapshot:()=>e==null?void 0:e.snapshot(),get gpu(){return t==null?void 0:t.stats}}}const or=rx((n,e=[])=>self.postMessage(n,e));self.onmessage=({data:n})=>{if(n.type==="prepare"){try{or.prepare(n.canvas),self.postMessage({type:"renderer-ready"})}catch(e){or.stop(),self.postMessage({type:"renderer-unavailable",message:e.message})}return}n.type==="start"?or.start(n).catch(e=>self.postMessage({type:"error",message:e.message})):or.control(n)};
