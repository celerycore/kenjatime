class Cc{constructor({maxBytes:e=16*1024*1024,maxEntries:t=512,sizeOf:i=s=>{var r;return((r=s==null?void 0:s.rgba)==null?void 0:r.byteLength)||0}}={}){this.maxBytes=e,this.maxEntries=t,this.sizeOf=i,this.entries=new Map,this.bytes=0,this.hits=0,this.misses=0,this.evictions=0}get size(){return this.entries.size}has(e){return this.entries.has(e)}get(e){const t=this.entries.get(e);if(!t){this.misses++;return}return this.hits++,this.entries.delete(e),this.entries.set(e,t),t.value}set(e,t){this.delete(e);const i=Math.max(0,this.sizeOf(t)||0);if(i>this.maxBytes||this.maxEntries<1)return this;for(this.entries.set(e,{value:t,bytes:i}),this.bytes+=i;this.bytes>this.maxBytes||this.size>this.maxEntries;)this.delete(this.entries.keys().next().value),this.evictions++;return this}delete(e){const t=this.entries.get(e);return t?(this.bytes-=t.bytes,this.entries.delete(e)):!1}clear(){this.entries.clear(),this.bytes=0}}var ci=Uint8Array,Xn=Uint16Array,Qh=Int32Array,Pc=new ci([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Ic=new ci([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),eu=new ci([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Lc=function(n,e){for(var t=new Xn(31),i=0;i<31;++i)t[i]=e+=1<<n[i-1];for(var s=new Qh(t[30]),i=1;i<30;++i)for(var r=t[i];r<t[i+1];++r)s[r]=r-t[i]<<5|i;return{b:t,r:s}},Dc=Lc(Pc,2),Nc=Dc.b,tu=Dc.r;Nc[28]=258,tu[258]=28;var iu=Lc(Ic,0),nu=iu.b,La=new Xn(32768);for(var pt=0;pt<32768;++pt){var Xi=(pt&43690)>>1|(pt&21845)<<1;Xi=(Xi&52428)>>2|(Xi&13107)<<2,Xi=(Xi&61680)>>4|(Xi&3855)<<4,La[pt]=((Xi&65280)>>8|(Xi&255)<<8)>>1}var xs=(function(n,e,t){for(var i=n.length,s=0,r=new Xn(e);s<i;++s)n[s]&&++r[n[s]-1];var a=new Xn(e);for(s=1;s<e;++s)a[s]=a[s-1]+r[s-1]<<1;var o;if(t){o=new Xn(1<<e);var l=15-e;for(s=0;s<i;++s)if(n[s])for(var c=s<<4|n[s],f=e-n[s],u=a[n[s]-1]++<<f,h=u|(1<<f)-1;u<=h;++u)o[La[u]>>l]=c}else for(o=new Xn(i),s=0;s<i;++s)n[s]&&(o[s]=La[a[n[s]-1]++]>>15-n[s]);return o}),Ts=new ci(288);for(var pt=0;pt<144;++pt)Ts[pt]=8;for(var pt=144;pt<256;++pt)Ts[pt]=9;for(var pt=256;pt<280;++pt)Ts[pt]=7;for(var pt=280;pt<288;++pt)Ts[pt]=8;var Uc=new ci(32);for(var pt=0;pt<32;++pt)Uc[pt]=5;var su=xs(Ts,9,1),ru=xs(Uc,5,1),Xr=function(n){for(var e=n[0],t=1;t<n.length;++t)n[t]>e&&(e=n[t]);return e},ui=function(n,e,t){var i=e/8|0;return(n[i]|n[i+1]<<8)>>(e&7)&t},qr=function(n,e){var t=e/8|0;return(n[t]|n[t+1]<<8|n[t+2]<<16)>>(e&7)},au=function(n){return(n+7)/8|0},ou=function(n,e,t){return(t==null||t>n.length)&&(t=n.length),new ci(n.subarray(e,t))},lu=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],gi=function(n,e,t){var i=new Error(e||lu[n]);if(i.code=n,Error.captureStackTrace&&Error.captureStackTrace(i,gi),!t)throw i;return i},cu=function(n,e,t,i){var s=n.length,r=i?i.length:0;if(!s||e.f&&!e.l)return t||new ci(0);var a=!t,o=a||e.i!=2,l=e.i;a&&(t=new ci(s*3));var c=function(Re){var Ve=t.length;if(Re>Ve){var Xe=new ci(Math.max(Ve*2,Re));Xe.set(t),t=Xe}},f=e.f||0,u=e.p||0,h=e.b||0,d=e.l,p=e.d,_=e.m,m=e.n,v=s*8;do{if(!d){f=ui(n,u,1);var S=ui(n,u+1,3);if(u+=3,S)if(S==1)d=su,p=ru,_=9,m=5;else if(S==2){var y=ui(n,u,31)+257,g=ui(n,u+10,15)+4,x=y+ui(n,u+5,31)+1;u+=14;for(var I=new ci(x),R=new ci(19),A=0;A<g;++A)R[eu[A]]=ui(n,u+A*3,7);u+=g*3;for(var F=Xr(R),N=(1<<F)-1,P=xs(R,F,1),A=0;A<x;){var k=P[ui(n,u,N)];u+=k&15;var T=k>>4;if(T<16)I[A++]=T;else{var H=0,B=0;for(T==16?(B=3+ui(n,u,3),u+=2,H=I[A-1]):T==17?(B=3+ui(n,u,7),u+=3):T==18&&(B=11+ui(n,u,127),u+=7);B--;)I[A++]=H}}var C=I.subarray(0,y),L=I.subarray(y);_=Xr(C),m=Xr(L),d=xs(C,_,1),p=xs(L,m,1)}else gi(1);else{var T=au(u)+4,E=n[T-4]|n[T-3]<<8,b=T+E;if(b>s){l&&gi(0);break}o&&c(h+E),t.set(n.subarray(T,b),h),e.b=h+=E,e.p=u=b*8,e.f=f;continue}if(u>v){l&&gi(0);break}}o&&c(h+131072);for(var V=(1<<_)-1,$=(1<<m)-1,ie=u;;ie=u){var H=d[qr(n,u)&V],ne=H>>4;if(u+=H&15,u>v){l&&gi(0);break}if(H||gi(2),ne<256)t[h++]=ne;else if(ne==256){ie=u,d=null;break}else{var G=ne-254;if(ne>264){var A=ne-257,se=Pc[A];G=ui(n,u,(1<<se)-1)+Nc[A],u+=se}var ge=p[qr(n,u)&$],Se=ge>>4;ge||gi(3),u+=ge&15;var L=nu[Se];if(Se>3){var se=Ic[Se];L+=qr(n,u)&(1<<se)-1,u+=se}if(u>v){l&&gi(0);break}o&&c(h+131072);var ae=h+G;if(h<L){var Le=r-L,lt=Math.min(L,ae);for(Le+h<0&&gi(3);h<lt;++h)t[h]=i[Le+h]}for(;h<ae;++h)t[h]=t[h-L]}}e.l=d,e.p=ie,e.b=h,e.f=f,d&&(f=1,e.m=_,e.d=p,e.n=m)}while(!f);return h!=t.length&&a?ou(t,0,h):t.subarray(0,h)},hu=new ci(0),uu=function(n,e){return((n[0]&15)!=8||n[0]>>4>7||(n[0]<<8|n[1])%31)&&gi(6,"invalid zlib data"),(n[1]>>5&1)==+!e&&gi(6,"invalid zlib data: "+(n[1]&32?"need":"unexpected")+" dictionary"),(n[1]>>3&4)+2};function fu(n,e){return cu(n.subarray(uu(n,e&&e.dictionary),-4),{i:2},e&&e.out,e&&e.dictionary)}var du=typeof TextDecoder<"u"&&new TextDecoder,pu=0;try{du.decode(hu,{stream:!0}),pu=1}catch{}function bn(n){if(!(n instanceof Uint8Array))throw Error("Text file is missing");if(n[0]===255&&n[1]===254)return new TextDecoder("utf-16le").decode(n);if(n[0]===254&&n[1]===255)return new TextDecoder("utf-16be").decode(n);try{return new TextDecoder("utf-8",{fatal:!0}).decode(n)}catch{return new TextDecoder("windows-1252").decode(n)}}function Jn(n,e="",t=!1){const i=String(n).normalize("NFC").replaceAll("\\","/");if(i.startsWith("/")||/^[a-z]:/i.test(i)||i.includes("\0"))throw Error("Unsafe archive path.");const s=e.split("/").filter(Boolean);for(const r of i.split("/"))if(!(!r||r==="."))if(r===".."){if(!t||!s.length)throw Error("Unsafe archive path.");s.pop()}else s.push(r);return s.join("/").toLowerCase()}function kr(n){const e={};let t="";for(const i of n.replace(/^\uFEFF/,"").split(/\r?\n/)){const s=i.replace(/;(?=(?:[^"']*["'][^"']*["'])*[^"']*$).*$/,"").trim(),r=s.match(/^\[(.+)\]$/);if(r){t=r[1].toLowerCase(),e[t]??(e[t]={});continue}const a=s.indexOf("=");a>0&&t&&(e[t][s.slice(0,a).trim().toLowerCase()]=s.slice(a+1).trim().replace(/^"(.*)"$/,"$1"))}return e}function mu(n){const e=i=>bn(n[i]);return Object.keys(n).filter(i=>i.endsWith(".def")).map(i=>({path:i,def:kr(e(i))})).filter(i=>{var s;return i.def.info&&((s=i.def.files)==null?void 0:s.sprite)}).map(i=>{const s=i.path.slice(0,i.path.lastIndexOf("/")+1),r=c=>Jn(c,s,!0),a=(c,f)=>{let u;try{u=r(f)}catch{u=null}const h=String(f).replaceAll("\\","/").split("/").at(-1);if(!u&&h&&h!=="."&&h!=="..")try{const m=r(h);n[m]&&(u=m)}catch{}if(c!=="stcommon"||n[u])return u;const d=i.path.indexOf("/chars/"),p=d>=0?i.path.slice(0,d+1):"",_=[p+"data/",p].flatMap(m=>{try{return[Jn(f,m,!0)]}catch{return[]}});return(h==null?void 0:h.toLowerCase())==="common1.cns"&&_.push(p+"data/common1.cns","data/common1.cns"),_.find(m=>n[m])||u},o=Object.entries(i.def.files).filter(([c,f])=>f&&/^(sprite|anim|cmd|cns|sound|stcommon|st\d*|pal\d+)$/.test(c)).map(([c,f])=>{const u=a(c,f);return{key:c,value:f,path:u,ok:!!u&&!!n[u],...u?{}:{message:"This resource is outside the ZIP. Include it in the package or use an in-package relative path."}}}),l=o.find(c=>c.key==="anim"&&c.ok);return{...i,checks:o,files:n,animations:l?Fc(e(l.path)):[],sprite:o.find(c=>c.key==="sprite"&&c.ok),palettes:o.filter(c=>/^pal\d+$/.test(c.key)).map(c=>({...c,number:Number(c.key.slice(3))}))}})}function Fc(n){var a;const e=[];let t,i,s,r;for(const[o,l]of n.replace(/^\uFEFF/,"").split(/\r?\n/).entries()){const c=l.split(";")[0].trim(),f=c.match(/^\[begin action\s+(-?\d+)\]\s*$/i);if(f){t={id:+f[1],frames:[],loopStart:0},e.push(t),i={1:[],2:[]},s={},r={};continue}if(!t||!c)continue;if(/^loopstart\s*$/i.test(c)){t.loopStart=t.frames.length;continue}const u=c.match(/^clsn([12])(default)?\s*:\s*(\d+)\s*$/i);if(u){const b=+u[1],y=+u[3];if(y>1024)throw Error(`AIR collision box limit exceeded on line ${o+1}`);const g=new Array(y);r[b]=g,u[2]?(i[b]=g,delete s[b]):s[b]=g;continue}const h=c.match(/^clsn([12])\s*\[\s*(\d+)\s*\]\s*=\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*$/i);if(h){const b=r[+h[1]],y=+h[2];if(!b||y>=b.length){(t.diagnostics??(t.diagnostics=[])).push({line:o+1,message:"AIR collision box index out of range; box ignored"});continue}b[y]=h.slice(3).map(Number);continue}const d=c.match(/^interpolate\s+(offset|blend|scale|angle)\s*$/i);if(d){const b=d[1].toLowerCase();t.frames.length?((a=t.frames.at(-1)).interpolate??(a.interpolate=[])).push(b):(t.loopInterpolate??(t.loopInterpolate=[])).push(b);continue}if(!/^-?\d+\s*,/.test(c))continue;const p=c.split(",").map(b=>b.trim()),_=p.slice(0,5).map(Number);if(p.length<5||_.some(b=>!Number.isFinite(b))||_[4]<-1)throw Error(`Invalid AIR frame on line ${o+1}`);const m=b=>{const y=s[b]??i[b];return Object.keys(y).length!==y.length&&(t.diagnostics??(t.diagnostics=[])).push({line:o+1,message:`Incomplete Clsn${b} definition; missing boxes ignored`}),y.filter(Boolean).map(g=>g.slice())},v=(b,y,g)=>{if(!p[b])return y;const x=Number(p[b]);return Number.isFinite(x)?x:((t.diagnostics??(t.diagnostics=[])).push({line:o+1,message:`Invalid AIR ${g} ignored; using ${y}`}),y)},S=v(7,1,"x-scale"),T=v(8,1,"y-scale"),E=v(9,0,"angle");t.frames.push({group:_[0],number:_[1],x:_[2],y:_[3],ticks:_[4],flip:(p[5]||"").toUpperCase(),blend:(p[6]||"").toUpperCase(),scaleX:S,scaleY:T,angle:E,clsn1:m(1),clsn2:m(2)}),s={}}return e.filter(o=>o.frames.length).map(o=>(o.loopStart>=o.frames.length&&(o.loopStart=0),o.loopInterpolate&&(o.frames.at(-1).interpolate=[...new Set([...o.frames.at(-1).interpolate||[],...o.loopInterpolate])]),delete o.loopInterpolate,o))}function gu(n){if(!(n instanceof Uint8Array)||n.length<24||new TextDecoder().decode(n.subarray(0,12))!=="ElecbyteSnd\0")throw Error("Invalid SND signature");const e=new DataView(n.buffer,n.byteOffset,n.byteLength),t=e.getUint32(16,!0),i=[],s=new Map,r=new Set;if(t>1e4)throw Error("SND sample table too large");let a=e.getUint32(20,!0);for(let o=0;o<t;o++){if(a<24||a+16>n.length||r.has(a))throw Error("Invalid SND sample link");r.add(a);const l=e.getUint32(a,!0),c=e.getUint32(a+4,!0),f=e.getUint32(a+8,!0),u=e.getUint32(a+12,!0),h=a+16;if(c<12||c>32*1024*1024||h+c>n.length)throw Error("Invalid SND sample length");const d=n.subarray(h,h+c);if(new TextDecoder().decode(d.subarray(0,4))!=="RIFF"||new TextDecoder().decode(d.subarray(8,12))!=="WAVE")throw Error("Unsupported SND sample: expected WAV");if(new DataView(d.buffer,d.byteOffset,d.byteLength).getUint32(4,!0)+8>c)throw Error("Truncated SND WAV");const p={group:f,number:u,data:d};i.push(p),s.has(`${f},${u}`)||s.set(`${f},${u}`,d),a=l}return{samples:i,get:(o,l)=>s.get(`${o},${l}`)}}function vu(n,e,t,i){const s=[137,80,78,71,13,10,26,10];if(n.length<33||!s.every((x,I)=>n[I]===x))throw Error("Invalid PNG signature");const r=new DataView(n.buffer,n.byteOffset,n.byteLength);let a,o,l,c,f,u,h=8,d=!1,p=0;const _=[];for(;h+12<=n.length;){const x=r.getUint32(h),I=h+8,R=I+x;if(x>64*1024*1024||R+4>n.length)throw Error("Invalid PNG chunk length");const A=String.fromCharCode(...n.subarray(h+4,h+8));if(A==="IHDR"){if(h!==8||x!==13||a!==void 0)throw Error("Invalid PNG header");if(a=r.getUint32(I),o=r.getUint32(I+4),c=n[I+9],l={0:1,2:3,3:1,4:2,6:4}[c],!a||!o||a*o>4e6||e!==void 0&&a!==e||t!==void 0&&o!==t)throw Error("Invalid PNG dimensions");if(n[I+8]!==8||!l||n[I+10]||n[I+11]||n[I+12])throw Error("Unsupported PNG encoding: requires non-interlaced 8-bit channels")}else{if(a===void 0)throw Error("PNG header must be first");if(A==="PLTE"){if(!x||x>768||x%3)throw Error("Invalid PNG palette");f=n.subarray(I,R)}else if(A==="tRNS")u=n.subarray(I,R);else if(A==="IDAT"){if(p+=x,p>64*1024*1024)throw Error("PNG compressed data too large");_.push(n.subarray(I,R))}else if(A==="IEND"){if(x)throw Error("Invalid PNG end chunk");d=!0;break}else if(A[0]===A[0].toUpperCase())throw Error("Unsupported PNG critical chunk: "+A)}h=R+4}if(!d||!_.length)throw Error("Truncated PNG");if(c===3&&!i&&!f)throw Error("PNG palette missing");const m=new Uint8Array(p);let v=0;for(const x of _)m.set(x,v),v+=x.length;const S=a*l,T=(S+1)*o,E=fu(m,{out:new Uint8Array(T+1)});if(E.length!==T)throw Error("Invalid PNG pixel data length");const b=new Uint8Array(S*o),y=(x,I,R)=>{const A=x+I-R,F=Math.abs(A-x),N=Math.abs(A-I),P=Math.abs(A-R);return F<=N&&F<=P?x:N<=P?I:R};for(let x=0;x<o;x++){const I=E[x*(S+1)];if(I>4)throw Error("Invalid PNG scanline filter");for(let R=0;R<S;R++){const A=x*S+R,F=R>=l?b[A-l]:0,N=x?b[A-S]:0,P=x&&R>=l?b[A-S-l]:0,k=I===0?0:I===1?F:I===2?N:I===3?Math.floor((F+N)/2):y(F,N,P);b[A]=E[x*(S+1)+1+R]+k&255}}const g=new Uint8ClampedArray(a*o*4);for(let x=0;x<a*o;x++){const I=x*l,R=x*4;if(c===3){const A=b[I],F=A*(i?4:3),N=i||f;if(F+2>=N.length)throw Error("PNG palette index out of range");g[R]=N[F],g[R+1]=N[F+1],g[R+2]=N[F+2],g[R+3]=i?N[F+3]:(u==null?void 0:u[A])??255}else if(c===0||c===4){const A=b[I];let F=c===4?b[I+1]:255;c===0&&(u==null?void 0:u.length)===2&&A===(u[0]<<8|u[1])&&(F=0),g[R]=A,g[R+1]=A,g[R+2]=A,g[R+3]=F}else{const A=b[I],F=b[I+1],N=b[I+2];let P=c===6?b[I+3]:255;c===2&&(u==null?void 0:u.length)===6&&A===(u[0]<<8|u[1])&&F===(u[2]<<8|u[3])&&N===(u[4]<<8|u[5])&&(P=0),g[R]=A,g[R+1]=F,g[R+2]=N,g[R+3]=P}}return{w:a,h:o,rgba:g,...c===3?{indices:b}:{}}}function dl(n,e,t){const i=new Uint8Array(e);let s=0,r=0,a=0,o=0;const l=()=>{if(s>=n.length)throw Error("Truncated sprite data");return n[s++]},c=(f,u)=>{if(f<1||r+f>e)throw Error("Invalid sprite run");i.fill(u,r,r+f),r+=f};if(t===0){if(n.length<e)throw Error("Truncated raw sprite");return n.slice(0,e)}if(t===2){for(;r<e;){let f=l();if((f&192)===64){let u=f&63;c(u,l())}else c(1,f)}return i}if(t===3){for(;r<e;){let f=l()+1,u=l(),h=u&127,d=u&128?l():0;for(c(f,d);h--;){let p=l();c((p>>5)+1,p&31)}}return i}if(t!==4)throw Error("Unsupported sprite compression "+t);for(;r<e;){let f=l();for(let u=0;u<8&&r<e;u++){let h=l();if(f&1<<u){let d,p;if((h&63)===0?(p=(h<<2|l())+1,d=l()+3):(a|=(h&192)>>o,o+=2,d=(h&63)+1,o<8?p=l()+1:(p=a+1,a=0,o=0)),p>r||r+d>e)throw Error("Invalid sprite backreference");for(;d--;)i[r]=i[r-p],r++}else{let d;h&224?(d=h>>5,h&=31):d=l()+8,c(d,h)}}}return i}function cr(n,e,t="SFF palette index out of range"){const i=new Uint32Array(Math.ceil(e.length/4));new Uint8Array(i.buffer).set(e);const s=new Uint8ClampedArray(n.length*4),r=new Uint32Array(s.buffer);for(let a=0;a<n.length;a++){const o=n[a];if(o*4+2>=e.length)throw Error(t);r[a]=i[o]}return s}function Oc(n,e={}){if(!(n instanceof Uint8Array)||n.length<32||new TextDecoder().decode(n.subarray(0,12))!=="ElecbyteSpr\0")throw Error("Invalid SFF signature");if(n[15]===1)return xu(n,e);if(n[15]!==2)throw Error("Unsupported SFF version");if(n.length<68)throw Error("Truncated SFF header");const t=new DataView(n.buffer,n.byteOffset,n.byteLength),i=b=>t.getUint32(b,!0),s=b=>t.getInt16(b,!0),r=b=>t.getUint16(b,!0),a=i(36),o=i(40),l=i(44),c=i(48),f=i(52),u=i(60);if(o>2e4||c>4096)throw Error("SFF table too large");if(a+o*28>n.length||l+c*16>n.length)throw Error("Truncated SFF table");const h=[],d=new Cc({maxBytes:e.cacheBytes??16*1024*1024,sizeOf:b=>{var y;return b.rgba.byteLength+(((y=b.indices)==null?void 0:y.byteLength)||0)}}),p=new Map,_=Array.from({length:c},(b,y)=>({index:y,group:r(l+y*16),number:r(l+y*16+2),colors:r(l+y*16+4)}));for(let b=0;b<o;b++){const y=a+b*28;h.push({group:r(y),number:r(y+2),w:r(y+4),h:r(y+6),x:s(y+8),y:s(y+10),link:r(y+12),format:n[y+14],depth:n[y+15],offset:i(y+16),length:i(y+20),palette:r(y+24),flags:r(y+26)})}function m(b,y=new Set){if(p.has(b))return p.get(b);if(b>=c||y.has(b))throw Error("Invalid palette link");y.add(b);const g=l+b*16,x=i(g+12);if(!x)return m(r(g+6),y);const I=f+i(g+8);if(x%4||I+x>n.length)throw Error("Invalid SFF palette length");const R=n.slice(I,I+x);if(!n[13]&&!n[14])for(let A=0;A<R.length/4;A++)R[A*4+3]=A?255:0;return p.set(b,R),R}function v(b,y=new Set){if(d.has(b))return d.get(b);if(!Number.isInteger(b)||b<0||b>=h.length||y.has(b))throw Error("Invalid sprite link");y.add(b);const g=h[b];if(!g.length){const A=v(g.link,y),F={...A,...g,w:A.w,h:A.h,rgba:A.rgba};return A.indices&&g.palette!==A.palette&&(F.rgba=cr(A.indices,m(g.palette),"Linked sprite palette index out of range")),d.set(b,F),F}if(!g.w||!g.h||g.w*g.h>4e6)throw Error("Invalid SFF sprite dimensions");const x=(g.flags&1?u:f)+g.offset;if(x+g.length>n.length||g.length<(g.format?4:0))throw Error("Truncated SFF sprite data");const I=n.subarray(x+(g.format?4:0),x+g.length);let R;if(g.format>=10&&g.format<=12)R={...g,...vu(I,g.w,g.h,g.format===10&&c?m(g.palette):void 0)};else{if(g.depth!==8&&g.depth!==5)throw Error("Unsupported non-indexed SFF compression: "+g.format);const A=dl(I,g.w*g.h,g.format),F=cr(A,m(g.palette));R={...g,rgba:F,indices:A}}return d.set(b,R),R}function S(b,y,g){const x=v(b);if(!x.indices)return x;const I=_.find(F=>F.group===y&&F.number===g);if(!I)throw Error(`Palette ${y},${g} does not exist`);const R=_[x.palette];if(R&&Math.ceil(Math.log2(R.colors))!==Math.ceil(Math.log2(I.colors)))return x;const A=cr(x.indices,m(I.index),"Palette depth does not match indexed sprite");return{...x,rgba:A}}function T(b,y=new Set){if(!Number.isInteger(b)||b<0||b>=h.length||y.has(b))throw Error("Invalid sprite link");y.add(b);const g=h[b];if(!g.length){const I=T(g.link,y);return I?{...I,...g,w:I.w,h:I.h,colors:m(g.palette)}:null}if(!g.w||!g.h||g.w*g.h>4e6)throw Error("Invalid SFF sprite dimensions");if(g.format>=10||![5,8].includes(g.depth))return null;const x=(g.flags&1?u:f)+g.offset;if(x+g.length>n.length||g.length<(g.format?4:0))throw Error("Truncated SFF sprite data");return{...g,indices:dl(n.subarray(x+(g.format?4:0),x+g.length),g.w*g.h,g.format),colors:m(g.palette)}}return{sprites:h,decode:v,decodeIndexed:T,decodeWithPalette:S,paletteColors:(b,y)=>{const g=_.find(x=>x.group===b&&x.number===y);if(!g)throw Error(`Palette ${b},${y} does not exist`);return m(g.index).slice()},palettes:_,version:2,clearDecodedCache:()=>d.clear(),cacheStats:()=>({bytes:d.bytes,entries:d.size,evictions:d.evictions})}}function xu(n,{externalPalettes:e=new Map,cacheBytes:t=16*1024*1024}={}){var g;const i=new DataView(n.buffer,n.byteOffset,n.byteLength),s=x=>i.getUint32(x,!0),r=x=>i.getUint16(x,!0),a=x=>i.getInt16(x,!0),o=[],l=[],c=[],f=new Set,u=s(20);let h=s(24),d=-1,p=-1;if(u>2e4)throw Error("SFF table too large");const _=x=>{const I=new Uint8Array(1024);for(let R=0;R<256;R++)I.set([x[R*3],x[R*3+1],x[R*3+2],R?255:0],R*4);return c.push(I),c.length-1};for(let x=0;x<u;x++){if(h<32||h+32>n.length||f.has(h))throw Error("Invalid SFF v1 sprite table link");f.add(h);const I=s(h+4),R={group:r(h+12),number:r(h+14),x:a(h+8),y:a(h+10),link:r(h+16),offset:h+32,length:I,shared:n[h+18],palette:d};if(R.offset+I>n.length)throw Error("Truncated SFF v1 sprite");if(I){const A=I>=897&&n[R.offset+I-769]===12;(!R.shared||d<0)&&A&&(R.palette=_(n.subarray(R.offset+I-768,R.offset+I))),R.palette<0&&e.has(1)&&(c.push(e.get(1)),R.palette=c.length-1),R.palette>=0&&p<0&&(p=R.palette),R.group===0&&R.number===0&&R.palette>=0&&(p=R.palette),d=R.palette}else R.palette=void 0;if(o.push(R),h=s(h),!h&&x+1<u)throw Error("Truncated SFF v1 sprite table")}const m=c[p];if(m)for(const x of o)x.palette>=0&&((g=c[x.palette])!=null&&g.every((I,R)=>I===m[R]))&&(x.palette=p);for(let x=0;x<c.length;x++)l.push({index:x,group:x===p?1:0,number:x===p?1:x+1,colors:256});for(const[x,I]of e){if(!(I instanceof Uint8Array)||I.length!==1024||!Number.isInteger(x)||x<1||x>256)throw Error("Invalid external SFF palette");if(x===1&&p>=0)c[p]=I;else{const R=c.length;c.push(I),l.push({index:R,group:1,number:x,colors:256})}}const v=new Cc({maxBytes:t,sizeOf:x=>{var I;return x.rgba.byteLength+(((I=x.indices)==null?void 0:I.byteLength)||0)}});function S(x,I){return{...x,rgba:cr(x.indices,I)}}function T(x,I=new Set){if(v.has(x))return v.get(x);if(!Number.isInteger(x)||x<0||x>=o.length||I.has(x))throw Error("Invalid SFF v1 sprite link");I.add(x);const R=o[x];if(!R.length){const ne=T(R.link,I);R.palette=ne.palette;const G={...ne,...R,w:ne.w,h:ne.h};return v.set(x,G),G}const A=n.subarray(R.offset,R.offset+R.length);if(A.length<128||A[0]!==10||A[2]!==1||A[3]!==8||A[65]!==1)throw Error("Only indexed 8-bit PCX sprites are supported");const F=new DataView(A.buffer,A.byteOffset,A.byteLength),N=F.getUint16(8,!0)-F.getUint16(4,!0)+1,P=F.getUint16(10,!0)-F.getUint16(6,!0)+1,k=F.getUint16(66,!0);if(N<=0||P<=0||N*P>4e6||k*P>8e6||k<N)throw Error("Invalid PCX dimensions");const H=c[R.palette];if(!H)throw Error("PCX palette missing");const B=A.length>=897&&A[A.length-769]===12?A.length-769:A.length,C=new Uint8Array(k*P);let L=128,V=0;for(;V<C.length;){if(L>=B)throw Error("Truncated PCX");let ne=A[L++],G=1;if((ne&192)===192){if(G=ne&63,L>=B)throw Error("Truncated PCX run");ne=A[L++]}if(!G||V+G>C.length)throw Error("Invalid PCX run");C.fill(ne,V,V+G),V+=G}const $=new Uint8Array(N*P);for(let ne=0;ne<P;ne++)$.set(C.subarray(ne*k,ne*k+N),ne*N);const ie=S({...R,w:N,h:P,indices:$},H);return v.set(x,ie),ie}function E(x,I,R){const A=T(x),F=l.find(N=>N.group===I&&N.number===R);if(!F)throw Error(`Palette ${I},${R} does not exist`);return S(A,c[F.index])}return{sprites:o,palettes:l,decode:T,decodeIndexed:x=>{const I=T(x);return{...I,colors:c[I.palette]}},decodeWithPalette:E,paletteColors:(x,I)=>{const R=l.find(A=>A.group===x&&A.number===I);if(!R)throw Error(`Palette ${x},${I} does not exist`);return c[R.index].slice()},version:1,clearDecodedCache:()=>v.clear(),cacheStats:()=>({bytes:v.bytes,entries:v.size,evictions:v.evictions})}}function _u(n){if(!(n instanceof Uint8Array)||![768,772].includes(n.length))throw Error("ACT palette must contain 768 RGB bytes, with an optional 4-byte footer.");const e=new Uint8Array(1024);for(let t=0;t<256;t++){const i=(255-t)*3;e.set([n[i],n[i+1],n[i+2],t?255:0],t*4)}return e}const $r=new WeakMap;function hr(n){let e=n,t=0;for(;e&&t++<256;){if(e.ownPal||e.ownpal)return e;const i=e.paletteParent||e.parent||e.owner;if(!i||i===e)return e;e=i}return e}const Lo=n=>new Map([...n||[]].map(([e,t])=>[e,[...t]]));function ur(n){const e={...n};for(const[t,i]of[["add",[0,0,0]],["mul",[256,256,256]],["sinadd",[0,0,0,0]]])if(e[t]!==void 0){const s=Array.isArray(e[t])?e[t]:[e[t]];e[t]=i.map((r,a)=>{const o=Math.trunc(Number(s[a]??r));return t==="mul"?Math.max(0,o):o})}return e.time!==void 0&&(e.time=Math.trunc(Number(e.time))),e.color!==void 0&&(e.color=Math.max(0,Math.min(256,Math.trunc(Number(e.color))))),e.invertall!==void 0&&(e.invertall=+!!e.invertall),e}function Do(n,e,t){const i=Array.isArray(t)?t:[t],s=[Math.trunc(Number(i[0]??-1)),Math.trunc(Number(i[1]??0))];if(s[0]!==-1){if(s[0]<0||s[1]<0)throw Error("Invalid RemapPal palette pair.");kc(e,[-1,0],s),n.clear(),n.set("*",s)}}function kc(n,e,t){var a,o;if(!((a=n.sprite)!=null&&a.path)||!((o=n.files)!=null&&o[n.sprite.path]))return;const i=Bc(n),s=l=>i.palettes.find(c=>c.group===l[0]&&c.number===l[1]),r=s(t);if(!r)throw Error(`RemapPal destination palette ${t.join(",")} does not exist.`);if(e[0]!==-1){const l=s(e);if(!l)throw Error(`RemapPal source palette ${e.join(",")} does not exist.`);if(l.colors&&r.colors&&Math.ceil(Math.log2(l.colors))!==Math.ceil(Math.log2(r.colors)))throw Error("RemapPal source and destination color depths differ.")}}function Bc(n){var o,l;if($r.has(n))return $r.get(n);const e=[],t=new Map,i=n.files,s=n.path.slice(0,n.path.lastIndexOf("/")+1);for(const[c,f]of Object.entries(n.def.files||{}))if(/^pal\d+$/.test(c)&&f)try{const u=Number(c.slice(3));if(u<1||u>256)throw Error(`Invalid palette number ${u}.`);const h=(o=n.checks)==null?void 0:o.find(p=>p.key===c);let d;if(h)d=h.ok?h.path:null;else try{d=Jn(f,s,!0)}catch{d=null}if(!d||!i[d])throw Error(`Palette file is missing from the ZIP: ${f}`);t.set(u,_u(i[d]))}catch(u){e.push({type:"palette",source:n.path,line:0,message:u.message})}const r=Oc(i[n.sprite.path],{externalPalettes:t});r.diagnostics=e,r.selectablePalettes=[...new Set((r.palettes||[]).filter(c=>c.group===1&&c.number>=1&&c.number<=12).map(c=>c.number))].sort((c,f)=>c-f),r.selectablePalettes.length||(r.selectablePalettes=[1]);const a=String(((l=n.def.info)==null?void 0:l["pal.defaults"])||"1").split(",").map(Number);return r.defaultPalette=a.find(c=>r.selectablePalettes.includes(c))??r.selectablePalettes[0],$r.set(n,r),r}function yu(n,e){var c,f;const t=((c=n.world)==null?void 0:c.orderedPhases)&&n.isProjectile&&n.removalReason==="expire",i=n.hitDef||(t?n.proximityHitDef:null);if(n===e||n.destroyed||!i&&(!((f=n.world)!=null&&f.orderedPhases)||n.isProjectile)||n.moveType!=="A"||n.isProjectile&&((n.removed||n.removing)&&!(t&&n.drawVisible)||n.remainingHits<=0||n.owner===e||!/^[SCA]\s*,\s*[NSH][ATP]$/i.test(String(i.attr??"").trim())))return!1;const s=String((i==null?void 0:i.affectteam)??"E").trim().toUpperCase(),r=!!(n.world&&e.world&&n.teamSide===e.teamSide);if(s==="E"&&r||s==="F"&&!r)return!1;const a=(i==null?void 0:i.coordinateScale)??n.coordinateScale??1;let o;(i==null?void 0:i["guard.dist"])!==void 0?o=i["guard.dist"]*a:n.isProjectile?o=n.guardDistance:n.attackDist!==void 0?o=n.attackDist*n.coordinateScale:o=n.constant("size.attack.dist")*n.coordinateScale;const l=(e.pos.x-n.pos.x)*n.facing;return l>0&&l<o}function Hc(n,e){for(const t of e)if(yu(t,n))return!0;return!1}class dt extends Error{constructor(e,t=""){super(e),this.name="ExpressionError",this.source=t}}class Qi extends dt{constructor(e,t=""){super(e,t),this.name="UnsupportedExpressionError"}}class Lt extends dt{constructor(e,t=""){super(e,t),this.name="BottomError",this.bottom=!0}}const Da=8192,pl=2048,ml=96,Su=8192,Tn=new Map,Mu={"||":1,"^^":2,"&&":3,"|":4,"^":5,"&":6,":=":7,"=":8,"!=":8,"<":9,">":9,"<=":9,">=":9,"+":10,"-":10,"*":11,"/":11,"%":11,"**":12},fr=new Set(["=","!=","<","<=",">",">="]),wu=new Set(["parent","root","helper","target","partner","enemy","enemynear","playerid","p2"]),bu=new Set(["pos","vel","p2dist","p2bodydist","parentdist","rootdist","screenpos","hitvel","camerapos"]),zc=new Set(["s","c","a","h","l","i","n","v","u"]),Eu=new Set(["const","gethitvar","stagevar"]),Tu=new Set(["xveladd","yveladd","xoff","yoff","zoff","xvel","yvel","yaccel","fall.xvel","fall.yvel","fall.envshake.freq","fall.envshake.phase"]),Au=/^(?:fvar|sysfvar|const240p|const480p|const720p|pos [xy]|vel [xy]|p2dist [xy]|p2bodydist [xy]|parentdist [xy]|rootdist [xy]|screenpos [xy]|hitvel [xy]|camerapos [xy]|camerazoom|gamewidth|gameheight|screenwidth|screenheight|leftedge|rightedge|topedge|bottomedge|(?:front|back)edge(?:body)?dist|frontedge|backedge)$/,Ru=n=>/^(?:velocity\.|movement\.(?!airjump\.)|size\.[xy]scale$|data\.fall\.defence_mul$)/.test(n),wr={abs:[1,Math.abs],ceil:[1,Math.ceil],floor:[1,Math.floor],exp:[1,Math.exp],ln:[1,Math.log],log:[2,(n,e)=>Math.log(e)/Math.log(n)],sin:[1,Math.sin],cos:[1,Math.cos],tan:[1,Math.tan],asin:[1,Math.asin],acos:[1,Math.acos],atan:[1,Math.atan],sqrt:[1,Math.sqrt],min:[2,Math.min],max:[2,Math.max]},gl=new Set(["var","fvar","sysvar","sysfvar","animelemtime","animelemno","animexist","selfanimexist","const","const240p","const480p","const720p","gethitvar","stagevar","numprojid","playeridexist","projcanceltime","projcontacttime","projguardedtime","projhittime"]),Cu=new Set(["numhelper","numexplod","numtarget","ishelper"]),Pu=new Set(["name","authorname","p1name","p2name","p3name","p4name"]),Iu=new Set("time stateno prevstateno anim animtime ctrl statetype movetype physics life lifemax power powermax facing alive gametime hitpausetime hitshakeover hitover movecontact movehit moveguarded movereversed hitcount uniqhitcount numenemy numpartner numproj roundstate roundno matchno teamside teampower tickspersecond ailevel palno id name authorname p1name p2name p3name p4name win lose drawgame inguarddist canrecover roundsexisted hitfall ishometeam teammode leftedge rightedge topedge bottomedge frontedge backedge frontedgedist backedgedist frontedgebodydist backedgebodydist gamewidth gameheight screenwidth screenheight camerazoom winko wintime winperfect loseko losetime loseperfect random pi e".split(" "));function Lu(n){if(typeof n!="string")throw new dt("Expression must be text.");if(n.length>Da)throw new dt(`Expression exceeds ${Da} characters.`);const e=[];let t=0;for(;t<n.length;){if(/\s/.test(n[t])){t++;continue}const i=t,s=n.slice(t);let r;if(n[t]==='"'){t++;let a="",o=!1;for(;t<n.length;){const l=n[t++];if(l==='"'){o=!0;break}l==="\\"&&n[t]==='"'?(a+='"',t++):a+=l}if(!o)throw new dt(`Unterminated string at ${i}.`,n);e.push({type:"string",value:a,position:i})}else if(r=s.match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/)){const a=Number(r[0]);if(!Number.isFinite(a))throw new dt(`Invalid number at ${i}.`,n);e.push({type:"number",value:a,float:/[.eE]/.test(r[0]),position:i}),t+=r[0].length}else if(r=s.match(/^[a-z_][a-z0-9_.]*/i))e.push({type:"name",value:r[0].toLowerCase(),position:i}),t+=r[0].length;else if(r=s.match(/^(?:\*\*|:=|<=|>=|!=|&&|\|\||\^\^|[+\-*/%!~&|^=<>()[\],])/))e.push({type:"operator",value:r[0],position:i}),t+=r[0].length;else throw new Qi(`Unsupported token at ${i}: ${n[t]}`,n);if(e.length>pl)throw new dt(`Expression exceeds ${pl} tokens.`,n)}return e.push({type:"end",value:"",position:t}),e}class Du{constructor(e){this.source=e,this.tokens=Lu(e),this.index=0,this.depth=0}peek(e=0){return this.tokens[this.index+e]||this.tokens.at(-1)}take(){return this.tokens[this.index++]}accept(e){return this.peek().value!==e?!1:(this.index++,!0)}expect(e){this.accept(e)||this.fail(`Expected "${e}"`)}fail(e){throw new dt(`${e} at ${this.peek().position}.`,this.source)}signedInteger(){const e=this.accept("-")?-1:(this.accept("+"),1),t=this.take();return(t.type!=="number"||t.float)&&this.fail("Expected an integer literal"),{kind:"number",value:e*t.value,float:!1}}parse(e=0){++this.depth>ml&&this.fail(`Expression nesting exceeds ${ml}`);let t=this.prefix();for(;;){const i=this.peek().value,s=Mu[i];if(s===void 0||s<e)break;if(this.take(),(i==="="||i==="!=")&&(this.peek().value==="["||this.isOpenInterval())){const r=this.take().value,a=this.parse();this.expect(",");const o=this.parse(),l=this.take().value;l!=="]"&&l!==")"&&this.fail("Expected an interval endpoint"),t={kind:"range",op:i,left:t,low:a,high:o,includeLow:r==="[",includeHigh:l==="]"}}else{const r=this.parse(s+(i===":="?0:1));i===":="?((t.kind!=="call"||!["var","fvar"].includes(t.name)||t.args.length!==1)&&this.fail("Assignment requires var(index) or fvar(index)"),t={kind:"assign",left:t,right:r}):t={kind:"binary",op:i,left:t,right:r}}}return this.depth--,t}isOpenInterval(){if(this.peek().value!=="(")return!1;const e=this.index,t=this.depth;try{return this.prefix(),!1}catch{}finally{this.index=e,this.depth=t}let i=0;for(let s=this.index;s<this.tokens.length;s++){const r=this.tokens[s].value;if(r==="("||r==="[")i++;else if(r===")"||r==="]"){if(--i===0)return!1}else if(r===","&&i===1)return!0}return!1}prefix(){const e=this.take();if(e.type==="number")return{kind:"number",value:e.value,float:e.float};if(e.type==="string")return{kind:"string",value:e.value};if(["+","-","!","~"].includes(e.value))return{kind:"unary",op:e.value,value:this.parse(13)};if(e.value==="("){const r=this.parse();return this.expect(")"),r}e.type!=="name"&&this.fail("Expected a value");const t=e.value;if(Pu.has(t)&&["=","!="].includes(this.peek().value)){const r=this.take().value,a=this.take();return a.type!=="string"&&this.fail(`${t} comparison requires a quoted name`),{kind:"binary",op:r,left:{kind:"name",name:t},right:{kind:"string",value:a.value}}}if(["statetype","movetype","p2statetype","p2movetype"].includes(t)&&["=","!="].includes(this.peek().value)&&this.peek(1).type==="name"&&zc.has(this.peek(1).value)){const r=this.take().value,a=this.take().value;return{kind:"binary",op:r,left:{kind:"name",name:t},right:{kind:"string",value:a.toUpperCase()}}}if(t==="teammode"&&["=","!="].includes(this.peek().value)){const r=this.take().value,a=this.take();return(a.type!=="name"||!["single","simul","turns"].includes(a.value))&&this.fail("TeamMode requires Single, Simul or Turns"),{kind:"binary",op:r,left:{kind:"name",name:t},right:{kind:"string",value:a.value}}}const i=t.match(/^proj(hit|contact|guarded)(\d*)$/);if(i&&this.accept("=")){const r=this.signedInteger();[0,1].includes(r.value)||this.fail("Projectile condition requires 0 or 1");let a="=",o={kind:"number",value:1,float:!1};return this.accept(",")&&(fr.has(this.peek().value)&&(a=this.take().value),o=this.signedInteger()),{kind:"legacyprojectile",name:`proj${i[1]}time`,id:Number(i[2]||0),expected:r.value,op:a,time:o}}if(t==="command"&&["=","!="].includes(this.peek().value)){const r=this.take().value,a=this.take();return a.type!=="string"&&this.fail("Command comparison requires a quoted name"),{kind:"command",op:r,command:a.value}}if(t==="animelem"&&this.accept("=")){const r=this.signedInteger();let a="=",o={kind:"number",value:0,float:!1};return this.accept(",")&&(fr.has(this.peek().value)&&(a=this.take().value),o=this.signedInteger()),{kind:"legacyanim",element:r,op:a,time:o}}if(t==="timemod"&&fr.has(this.peek().value)){const r=this.take().value,a=this.signedInteger();return this.expect(","),{kind:"legacytime",op:r,divisor:a,remainder:this.signedInteger()}}if(t==="hitdefattr"&&["=","!="].includes(this.peek().value)){const r=this.take().value,a=this.take();(a.type!=="name"||!/^[sca]+$/.test(a.value))&&this.fail("HitDefAttr requires state letters S, C or A");const o=[a.value.toUpperCase()];this.expect(",");do{const l=this.take();(l.type!=="name"||!/^[nsha][atp]$/.test(l.value))&&this.fail("HitDefAttr requires attack attributes such as NA or ST"),o.push(l.value.toUpperCase())}while(this.peek().value===","&&this.peek(1).type==="name"&&/^[nsha][atp]$/.test(this.peek(1).value)&&this.accept(","));return{kind:"legacyattribute",op:r,attributes:o}}let s;if(this.accept("(")){const r=[];if(!this.accept(")")){do r.push(this.parse());while(this.accept(","));this.expect(")")}(gl.has(t)||Cu.has(t))&&r.length!==1&&this.fail(`${t} requires one argument`),Iu.has(t)&&r.length&&this.fail(`${t} requires no arguments`);const a=Object.hasOwn(wr,t)?wr[t][0]:["cond","ifelse"].includes(t)?3:null;a!==null&&r.length!==a&&this.fail(`${t} requires ${a} argument(s)`),s={kind:"call",name:t,args:r}}else{gl.has(t)&&this.fail(`${t} requires a parameter list`);let r=t;bu.has(t)&&this.peek().type==="name"&&/^[xy]$/.test(this.peek().value)&&(r+=" "+this.take().value),s={kind:"name",name:r}}return wu.has(t)&&this.accept(",")?{kind:"redirect",target:s,value:this.prefix()}:s}}function gn(n){if(typeof n!="string"||n.length>Da)throw new dt("Invalid or oversized argument list.");const e=[];let t=0,i=!1,s=!1,r=0;for(let a=0;a<n.length;a++){const o=n[a];if(o==='"'&&!s&&(i=!i),s=o==="\\"&&!s,!i)if(o==="("||o==="[")t++;else if(o===")"||o==="]"){if(--t<0)throw new dt("Unbalanced argument list.")}else o===","&&t===0&&(e.push(n.slice(r,a).trim()),r=a+1)}if(i||t)throw new dt("Unbalanced argument list.");return e.push(n.slice(r).trim()),e}function Gc(n){const e=new Du(n),t=e.parse();e.peek().type!=="end"&&e.fail("Unexpected token");const i=s=>{for(const r of Object.values(s))Array.isArray(r)?(r.forEach(a=>a&&typeof a=="object"&&i(a)),Object.freeze(r)):r&&typeof r=="object"&&i(r);return Object.freeze(s)};return i(t)}function Vc(n){if(Tn.has(n))return Tn.get(n);const e=Gc(n),t=i=>Nu(e,i||{},n);return Tn.size>=512&&Tn.delete(Tn.keys().next().value),Tn.set(n,t),t}function Na(n,e={}){return Vc(n)(e)}function Ua(n,e={}){return Vc(n)({...e,typedResult:!0})}const qt=(n,e=!1)=>{if(typeof n!="number"||!Number.isFinite(n))throw new Lt("Expression produced a non-finite number.");const t=e?Math.fround(n):n|0;if(!Number.isFinite(t))throw new Lt("Expression produced a non-finite number.");return{value:t,float:e}},wt=n=>qt(n,!1);function zt(n){if(n.bottom)throw n.error;if(typeof n.value!="number")throw new Lt("A numeric value is required.");return n.value}function rs(n){return zt(n)!==0}function Ds(n,e,t){if(e.bottom||t.bottom)throw(e.bottom?e:t).error;if(e.absent||t.absent){if(!["=","!="].includes(n))throw new dt("Only equality comparisons are allowed for strings.");return wt(+(n==="!="))}if(typeof e.value!=typeof t.value)throw new Lt("Cannot compare a string with a number.");if(typeof e.value=="string"&&!["=","!="].includes(n))throw new dt("Only equality comparisons are allowed for strings.");switch(typeof e.value=="number"&&(e.float||t.float)&&(e={value:Math.fround(e.value)},t={value:Math.fround(t.value)}),n){case"=":return wt(+(e.value===t.value));case"!=":return wt(+(e.value!==t.value));case"<":return wt(+(e.value<t.value));case"<=":return wt(+(e.value<=t.value));case">":return wt(+(e.value>t.value));case">=":return wt(+(e.value>=t.value))}}function Nu(n,e,t){let i=0;const s=(a,o,l)=>{if(typeof e.resolve!="function")throw new Qi(`Unsupported trigger: ${a}.`,t);const c=e.resolve(a,o,l);if(typeof c=="number")return qt(c,Au.test(a)||a==="gethitvar"&&Tu.has(String(o[0]).toLowerCase())||a==="const"&&Ru(String(o[0]).toLowerCase())||!Number.isInteger(c));if(typeof c=="boolean")return wt(Number(c));if(typeof c=="string")return{value:c};if(c!=null&&c.absent)return{value:"",absent:!0};if(c&&typeof c.value=="number")return qt(c.value,c.type==="float"||c.float);throw new Qi(`Trigger ${a} returned no supported value.`,t)},r=(a,o=null)=>{var l,c,f;if(++i>Su)throw new dt("Expression evaluation budget exceeded.",t);try{switch(a.kind){case"number":return qt(a.value,a.float);case"string":return{value:a.value};case"name":return a.name==="pi"?qt(Math.PI,!0):a.name==="e"?qt(Math.E,!0):zc.has(a.name)?{value:a.name.toUpperCase()}:s(a.name,[],o);case"unary":{const u=r(a.value,o),h=zt(u);if(a.op==="+")return u;if(a.op==="-")return qt(-h,u.float);if(a.op==="!")return wt(+(h===0));if(u.float)throw new Lt("Bitwise operators require integers.",t);return wt(~h)}case"redirect":{if(o)throw new Qi("Recursive trigger redirection is unsupported by MUGEN 1.1.",t);const u=((l=a.target.args)==null?void 0:l.map(h=>zt(r(h))))||[];return r(a.value,{name:a.target.name,args:u})}case"assign":{if(o)throw new dt("Variable assignment cannot be redirected.",t);if(typeof e.assign!="function")throw new Qi("Variable assignment is unavailable.",t);const u=a.left.args.map(m=>zt(r(m))),h=r(a.right),d=zt(h),p=a.left.name==="var"?Math.trunc(d)|0:Math.fround(d),_=e.assign(a.left.name,u,p);return qt(typeof _=="number"?_:p,a.left.name==="fvar")}case"range":{const u=[r(a.left,o),r(a.low,o),r(a.high,o)],h=u.some(v=>v.float),[d,p,_]=u.map(v=>h?Math.fround(zt(v)):zt(v)),m=(a.includeLow?d>=p:d>p)&&(a.includeHigh?d<=_:d<_);return wt(Number(a.op==="="?m:!m))}case"legacyanim":return Ds(a.op,s("animelemtime",[a.element.value],o),r(a.time,o));case"legacytime":{const u=a.divisor.value;if(u<=0)throw new dt("TimeMod divisor must be positive.",t);return Ds(a.op,wt(zt(s("time",[],o))%u),r(a.remainder,o))}case"legacyprojectile":{const u=s(a.name,[a.id],o),h=zt(u)>=0&&rs(Ds(a.op,u,r(a.time,o)));return wt(Number(a.expected?h:!h))}case"legacyattribute":{const u=rs(s("hitdefattr",a.attributes,o));return wt(Number(a.op==="="?u:!u))}case"command":{const u=rs(s("command",[a.command],o));return wt(Number(a.op==="="?u:!u))}case"call":{if(a.name==="cond"||a.name==="ifelse"){if(a.args.length!==3)throw new dt(`${a.name} requires three arguments.`,t);const p=r(a.args[0],o);if(a.name==="cond")return r(a.args[rs(p)?1:2],o);const _=[r(a.args[1],o),r(a.args[2],o)];for(const v of _)v.bottom&&((c=e.onWarning)==null||c.call(e,v.error));const m=rs(p)?0:1;return _[m]}if(Object.hasOwn(wr,a.name)){const[p,_]=wr[a.name];if(a.args.length!==p)throw new dt(`${a.name} requires ${p} argument(s).`,t);const m=a.args.map(T=>r(T,o)),v=_(...m.map(T=>["abs","min","max"].includes(a.name)?zt(T):Math.fround(zt(T)))),S=!["ceil","floor"].includes(a.name)&&(a.name!=="abs"||m[0].float)&&(!["min","max"].includes(a.name)||m.some(T=>T.float));return qt(v,S)}const u=a.args.map(p=>Eu.has(a.name)&&p.kind==="name"?{value:p.name}:r(p,o)),h=u.find(p=>p.bottom);if(h)throw h.error;const d=u.map(p=>p.value);return s(a.name,d,o)}case"binary":{const u=r(a.left,o),h=r(a.right,o);if(fr.has(a.op))return Ds(a.op,u,h);const d=u.float||h.float,p=d?Math.fround(zt(u)):zt(u),_=d?Math.fround(zt(h)):zt(h);switch(a.op){case"+":return qt(p+_,d);case"-":return qt(p-_,d);case"*":return qt(d?p*_:Math.imul(p,_),d);case"/":if(_===0)throw new Lt("Division by zero.",t);return qt(d?p/_:Math.trunc(p/_),d);case"%":if(d||_===0)throw new Lt("Remainder requires integers and a nonzero divisor.",t);return wt(p%_);case"**":{const m=d||p<0||_<0;let v=p**_;return!m&&v>2147483647&&(v=2147483647,(f=e.onWarning)==null||f.call(e,new dt("Integer exponent overflow.",t))),qt(v,m)}case"&&":return wt(+(p!==0&&_!==0));case"||":return wt(+(p!==0||_!==0));case"^^":return wt(+(p!==0!=(_!==0)));case"&":case"|":case"^":if(d)throw new Lt("Bitwise operators require integers.",t);return wt(a.op==="&"?p&_:a.op==="|"?p|_:p^_);default:throw new Qi(`Unsupported operator ${a.op}.`,t)}}default:throw new dt("Invalid compiled expression.",t)}}catch(u){if(u!=null&&u.bottom)return{bottom:!0,error:u};throw u}};try{const a=r(n);if(a.bottom)throw a.error;return e.typedResult?a:a.value}catch(a){throw a instanceof dt?(a.source||(a.source=t),a):a!=null&&a.bottom?new Lt(a.message||"Expression evaluated to bottom.",t):new dt((a==null?void 0:a.message)||"Trigger evaluation failed.",t)}}function Wc(n,e={},t=!1){var d,p,_,m;const i=n.coordinateScale||1,[s=0,r=0]=e[t?"offset":"pos"]||[0,0],a=String(e.postype||"p1").toLowerCase(),o=((d=n.world)==null?void 0:d.view.left)??((p=n.world)==null?void 0:p.leftBound)??-160,l=((_=n.world)==null?void 0:_.view.right)??((m=n.world)==null?void 0:m.rightBound)??160,c=n.opponent||n;let f=n.pos.x,u=n.facing,h=n.facing;if(a==="p2")f=c.pos.x,t||(u=h=c.facing);else if(a==="front")f=n.facing>0?l:o;else if(a==="back")f=n.facing>0?o:l,t||(u=n.facing);else if(a==="left"||a==="right")f=a==="left"?o:l,t||(u=h=1);else if(a!=="p1")throw Error(`Unsupported spawn postype: ${a}`);return{pos:{x:f+Number(s)*i*u,y:n.pos.y+Number(r)*i},facing:h*(Number(e.facing??1)<0?-1:1)}}const Xc=8192;function qc(n){if(!/^"[\s\S]*"$/.test(n))throw Error("Text must be enclosed in double quotes.");if(n.length>Xc)throw Error("Debug text exceeds 8192 characters.");return n.slice(1,-1).replace(/\\([\s\S])/g,(e,t)=>{if(t==="n")return`
`;if(t==="t")return"    ";if(t==="\\"||t==='"')return t;throw Error(`Unsupported text escape \\${t}.`)})}function Uu(n){const e=qc(n),t=[];let i=0,s=0;for(let r=0;r<e.length;r++)if(e[r]==="%"){if(t.push(e.slice(i,r)),e[r+1]==="%"){t.push("%"),r++,i=r+1;continue}const a=/^%([-+ #0]*)(\d*)(?:\.(\d*))?([difFeEgG])/.exec(e.slice(r));if(!a)throw Error("Unsupported clipboard format specifier.");const o=Number(a[2]||0),l=a[3]===void 0?void 0:Number(a[3]||0);if(o>512||l>20)throw Error("Clipboard format width or precision exceeds supported bounds.");t.push({flags:a[1],width:o,precision:l,spec:a[4]}),s++,r+=a[0].length-1,i=r+1}if(t.push(e.slice(i)),s>6)throw Error("Clipboard format accepts at most 6 numeric parameters.");return{parts:t,count:s}}function Fu({flags:n,width:e,precision:t,spec:i},{value:s,float:r}){if(typeof s!="number"||!Number.isFinite(s))throw Error("Clipboard parameters must be finite numbers.");r===void 0&&(r=!Number.isInteger(s)),/[di]/.test(i)===!!r&&(i=r?"f":"d",n="",e=0,t=void 0);const a=s<0||Object.is(s,-0),o=Math.abs(s);let l;if(/[di]/.test(i))l=t===0&&o===0?"":Math.trunc(o).toString().padStart(t??0,"0");else if(/[fF]/.test(i))l=o.toFixed(t??6);else if(/[eE]/.test(i))l=o.toExponential(t??6);else{const f=Math.max(1,t??6),u=Number(o.toPrecision(f)),h=u?Math.floor(Math.log10(u)):0;l=h<-4||h>=f?o.toExponential(f-1):o.toFixed(Math.max(0,f-h-1)),n.includes("#")||(l=l.replace(/(\.\d*?[1-9])0+(?=e|$)/,"$1").replace(/\.0*(?=e|$)/,""))}n.includes("#")&&!l.includes(".")&&(l=l.replace(/e|$/i,"."+(l.includes("e")?"e":""))),l=l.replace(/e([+-])(\d+)$/i,(f,u,h)=>"e"+u+h.padStart(2,"0")),/[FEG]/.test(i)&&(l=l.toUpperCase());const c=a?"-":n.includes("+")?"+":n.includes(" ")?" ":"";return n.includes("0")&&!n.includes("-")&&(t===void 0||!/[di]/.test(i))?c+l.padStart(Math.max(0,e-c.length),"0"):(l=c+l,n.includes("-")?l.padEnd(e):l.padStart(e))}function Ou(n,e){if(e.length!==n.count)throw Error(`Clipboard format requires ${n.count} parameters, received ${e.length}.`);let t=0;const i=n.parts.map(s=>typeof s=="string"?s:Fu(s,e[t++])).join("");if(i.length>Xc)throw Error("Formatted clipboard exceeds 8192 characters.");return i}const Yr=n=>{if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(String(n).trim()))throw Error("ForceFeedback parameters require numeric constants.");const e=Number(n);if(!Number.isFinite(e))throw Error("ForceFeedback requires finite constants.");return e};function ku(n){const e=String(n.waveform??"sine").replace(/^"(.*)"$/,"$1").toLowerCase();if(!["sine","square","sinesquare","off"].includes(e))throw Error(`Invalid ForceFeedback waveform ${e}.`);const t=Yr(n.time??60),i=Yr(n.self??1);if(!Number.isInteger(t)||t<0||t>36e4||![0,1].includes(i))throw Error("Invalid ForceFeedback time or self parameter.");const s={waveform:e,time:t,self:i};for(const r of["freq","ampl"]){const a=String(n[r]??"128").split(",").map(Yr);if(a.length>4||!Number.isInteger(a[0]))throw Error(`Invalid ForceFeedback ${r} coefficients.`);s[r]=Array.from({length:4},(o,l)=>a[l]??0)}return s}const qn=(n,e=[0,0])=>n===void 0?[...e]:Array.isArray(n)?[n[0]??e[0],n[1]??e[1]]:[n,e[1]],br=n=>n<0?-1:1,tn=n=>Math.trunc(Number(n)),$c=n=>/^\s*f(?=\s|[\d(+.-])/i.test(n||""),Bu=new Set(["anim","id","space","pos","facing","vfacing","bindid","bindtime","vel","velocity","accel","removetime","supermovetime","pausemovetime","scale","angle","xangle","yangle","sprpriority","ontop","shadow","ownpal","remappal","removeongethit","ignorehitpause","trans","alpha","postype","random","supermove"]);function Hu(n,e,t,i=!1){const s=t.ownpal===void 0?i?e.common:e.ownpal:!!t.ownpal;if(s&&(i||!e.ownpal)&&(e.paletteRemaps=e.common?new Map:Lo(n.paletteRemaps),n.events.push({type:"palettesnapshot",target:e,common:e.common})),s||(e.paletteRemaps=null,e.paletteSnapshot=null),e.ownpal=s,s&&!e.common&&t.remappal!==void 0)try{Do(e.paletteRemaps,n.character,t.remappal)}catch(r){n.diagnostic("palette",r.message)}}function zu(n,e,t,i){var f,u,h,d,p,_;const s=e.config,r=((f=n.world)==null?void 0:f.view)||{displayHeight:240};if(i||t.random!==void 0){const m=qn(s.random);e.randomOffset=m.map(v=>v>0?Math.floor(n.resolveTrigger("random")/1e3*v)-Math.floor(v/2):0)}const a=qn(s.pos).map((m,v)=>(m+e.randomOffset[v])*n.coordinateScale);e.bindOffset=a,e.relativeFacing=br(s.facing??1),e.vfacing=br(s.vfacing??1);const o=s.space!==void 0||s.bindid!==void 0,l=/^1\.(\d+)/.exec(((h=(u=n.character.def)==null?void 0:u.info)==null?void 0:h.mugenversion)||"");if(e.postype=o?null:String(s.postype??(l&&Number(l[1])>=1?"none":"p1")).toLowerCase(),e.bindID=tn(s.bindid??-2),e.bindingTarget=null,o){if(e.space=String(s.space||"stage").toLowerCase(),!["stage","screen"].includes(e.space))throw Error(`Unsupported Explod space ${e.space}.`);if(e.space==="screen"&&e.bindID!==-2)throw Error("Screen-space Explods cannot be bound.");if(e.bindID!==-2&&s.bindtime===void 0)throw Error("Explod bindID requires bindtime.");e.pos={x:a[0],y:a[1]},e.facing=e.relativeFacing}else if(["p1","p2"].includes(e.postype))e.space="stage",e.bindingTarget=e.postype==="p2"?n.opponent:n,e.pos={x:((d=e.bindingTarget)==null?void 0:d.pos.x)??n.pos.x,y:((p=e.bindingTarget)==null?void 0:p.pos.y)??n.pos.y},e.facing=e.relativeFacing*(((_=e.bindingTarget)==null?void 0:_.facing)??n.facing);else if(["front","back","left","right"].includes(e.postype)){e.space="screen";const m=e.postype==="right"||e.postype==="front"&&n.facing>0||e.postype==="back"&&n.facing<0,v=e.postype==="back"?n.facing:1;e.pos={x:(m?320:0)+a[0]*v,y:a[1]},e.facing=e.relativeFacing*v}else if(e.postype==="none")e.space="stage",e.pos={x:a[0],y:a[1]},e.facing=e.relativeFacing;else throw Error(`Unsupported Explod postype ${e.postype}.`);const c=e.postype==="p1"||e.postype==="p2"||e.bindID!==-2;if(e.bindtime=e.space==="stage"&&c?tn(s.bindtime??1):0,e.initialBinding=c,e.positioned=!e.initialBinding,!Number.isFinite(r.displayHeight))throw Error("Invalid Explod viewport.")}function vl(n,e,t,i,s){var r,a;for(const o of["angle","xangle","yangle"])if(t[o]!==void 0&&(typeof t[o]!="number"||!Number.isFinite(t[o])))throw Error(`Explod ${o} must be a finite number.`);if(e.config={...e.config,...t},t.anim!==void 0||i){const o=t.anim===void 0?e.common:$c(s.values.anim),l=tn(t.anim??e.anim),c=o?n.commonAnimations:n.animations;if(!c.has(l)||!((r=c.get(l).frames)!=null&&r.length))throw Error(`Explod ${o?"common ":""}animation ${l} does not exist or has no frames.`);e.anim=l,e.common=o,e.animation=c.get(l),e.frameIndex=0,e.frameTime=0}for(const o of["removetime","supermovetime","pausemovetime","sprpriority","angle","xangle","yangle","ontop","shadow","removeongethit","ignorehitpause","supermove"])t[o]!==void 0&&(e[o]=t[o]);for(const o of["removetime","supermovetime","pausemovetime","sprpriority"])e[o]=tn(e[o]??0);if(e.removetime<-2||tn(e.config.bindtime??0)<-1)throw Error("Invalid Explod removal or binding time.");t.scale!==void 0&&(e.scale=qn(t.scale,[1,1])),(t.trans!==void 0||t.alpha!==void 0)&&(e.trans={mode:String(e.config.trans||"default").toLowerCase(),alpha:qn(e.config.alpha,[256,0])}),(t.vel!==void 0||t.velocity!==void 0||i)&&(e.velocity=qn(e.config.vel??e.config.velocity).map(o=>o*n.coordinateScale)),(t.accel!==void 0||i)&&(e.accel=qn(e.config.accel).map(o=>o*n.coordinateScale)),Hu(n,e,t,i),i||["space","postype","pos","bindid","random"].some(o=>t[o]!==void 0)?zu(n,e,t,i):(t.facing!==void 0&&(e.relativeFacing=br(t.facing),e.facing=e.relativeFacing*(((a=e.bindingTarget)==null?void 0:a.facing)??(e.postype==="back"?n.facing:1))),t.vfacing!==void 0&&(e.vfacing=br(t.vfacing)),t.bindtime!==void 0&&(e.bindtime=tn(t.bindtime)))}function Gu(n,e){const t=tn(n.value(e,"id",-1)),i=n.explods.filter(o=>t===-1||o.id===t);if(e.type==="removeexplod"){n.explods=n.explods.filter(o=>!i.includes(o)),n.drawExplods=n.drawExplods.filter(o=>t!==-1&&o.id!==t);return}if(e.type==="explodbindtime"){const o=tn(n.value(e,e.values.time===void 0?"value":"time",1));if(o<-1)throw Error("ExplodBindTime must be -1 or greater.");for(const l of i)l.bindtime=o;return}const s=$c(e.values.anim)?e.entries.map(o=>o.key==="anim"?{...o,value:o.value.replace(/^\s*f\s*/i,"")}:o):e.entries,r=n.effectParameters({...e,entries:s});e.values.ignorehitpause!==void 0&&(r.ignorehitpause=n.value(e,"ignorehitpause",1));for(const o of Object.keys(r))Bu.has(o)||n.diagnostic("unsupported-explod-parameter",`Explod parameter ${o} is not implemented.`,e);for(const o of["pos","vel","velocity","accel","scale","random","remappal","alpha"])if(Array.isArray(r[o])&&r[o].length>2)throw Error(`Explod ${o} takes at most two components.`);if(e.type==="modifyexplod"){for(const o of i){const l=n.events.length,c={...o,config:{...o.config},paletteRemaps:o.paletteRemaps?new Map(o.paletteRemaps):null};try{vl(n,c,r,!1,e)}catch(f){throw n.events.length=l,f}Object.assign(o,c);for(const f of n.events.slice(l))f.target===c&&(f.target=o)}return}if(e.values.anim===void 0)throw Error("Explod requires anim.");if(n.explods.length>=512){n.diagnostic("resource-limit","Explod limit (512 per entity) reached.",e);return}const a={owner:n,creator:n,id:t,coordinateScale:n.coordinateScale,time:0,frameIndex:0,frameTime:0,config:{},removetime:-2,bindtime:0,ignorehitpause:1,supermovetime:0,pausemovetime:0,scale:[1,1],angle:0,xangle:0,yangle:0,vfacing:1};vl(n,a,r,!0,e),n.explods.push(a)}function xl(n,e,t){if(!(e!=null&&e.remaining)||(n[t]!==e&&(n[t]=e,n[t+"Moved"]=0),t==="superPause"&&n.supermove))return!0;const i=t==="superPause"?"supermovetime":"pausemovetime";return n[t+"Moved"]>=Math.max(0,n[i]||0)?!1:(n[t+"Moved"]++,!0)}function Vu(n,e){for(const t of n.explods)!(t.bindingTarget===e||!t.bindingTarget&&(t.postype==="p1"&&n===e||t.postype==="p2"&&n.opponent===e||t.bindID===e.id||t.bindID===-1&&n.root===e))||!t.initialBinding&&t.bindtime===0||((t.initialBinding||!t.positioned)&&(t.pos={x:e.pos.x+t.bindOffset[0]*e.facing,y:e.pos.y+t.bindOffset[1]},t.facing=t.relativeFacing*e.facing),t.bindingTarget=null,t.bindtime=0,t.initialBinding=!1,t.positioned=!0)}function Wu(n,{hitPaused:e=!1,pause:t=null,superPause:i=null,forceFrozen:s=!1}={}){var a,o;const r=[];for(const l of n.explods){if(l.removetime===0||l.pendingRemoval&&!(i!=null&&i.remaining)){l.removed=!0;continue}!l.bindingTarget&&(l.bindtime||l.initialBinding)&&(l.postype==="p2"?l.bindingTarget=n.opponent:l.postype==="p1"?l.bindingTarget=n:l.bindID!==-2&&(l.bindingTarget=l.bindID===-1?n.root:l.bindID===n.id?n:(a=n.world)==null?void 0:a.findPlayer(l.bindID))),(o=l.bindingTarget)!=null&&o.destroyed&&(l.bindingTarget=null,l.bindtime=0,l.initialBinding=!1);const c=l.space==="stage"&&!!l.bindingTarget&&(l.initialBinding||l.bindtime!==0);if(l.initialBinding&&!l.bindingTarget){n.diagnostic("missing-player",`Explod binding player ${l.bindID} is unavailable.`),l.removed=!0;continue}let f=s||e&&!l.ignorehitpause;if(f||(f=i!=null&&i.remaining?!xl(l,i,"superPause"):!xl(l,t,"pause")),c?(l.facing=l.relativeFacing*l.bindingTarget.facing,l.pos={x:l.bindingTarget.pos.x+l.bindOffset[0]*l.bindingTarget.facing,y:l.bindingTarget.pos.y+l.bindOffset[1]},l.positioned=!0):!f&&l.time>0&&(l.pos.x+=l.velocity[0]*l.facing,l.pos.y+=l.velocity[1]),r.push({...l,pos:{...l.pos},source:l}),f)continue;l.time>0&&(l.velocity[0]+=l.accel[0],l.velocity[1]+=l.accel[1]),l.initialBinding=!1,l.bindtime>0&&l.bindtime--;const u=l.animation.frames[l.frameIndex];u&&u.ticks>=0&&++l.frameTime>=Math.max(1,u.ticks)&&(l.frameTime=0,++l.frameIndex>=l.animation.frames.length&&(l.removetime===-2&&(l.removed=!0),l.frameIndex=l.animation.loopStart||0)),l.time++,l.removetime>0&&l.time>=l.removetime&&(l.removed=!0),l.removed&&l.supermove&&(i!=null&&i.remaining)&&(l.removed=!1,l.pendingRemoval=!0)}n.drawExplods=r,n.explods=n.explods.filter(l=>!l.removed)}const An=new Map,Xu=["N","S","H"];function _s(n){const e=String(n??"").toUpperCase().replace(/\s/g,"");if(An.has(e))return An.get(e);const[t,...i]=e.split(",");if(!/^[SCA]*$/.test(t))throw Error(`Invalid hit attribute states: ${t}`);const s=new Set;for(const a of i)if(a){if(!/^[NSHA][ATP]$/.test(a))throw Error(`Invalid hit attack attribute: ${a}`);for(const o of a[0]==="A"?Xu:[a[0]])s.add(o+a[1])}const r={states:new Set(t),attacks:s};return An.size>=512&&An.delete(An.keys().next().value),An.set(e,r),r}function Yc(n,e){const t=typeof n=="string"?_s(n):n,i=typeof e=="string"?_s(e):e;return{state:[...i.states].some(s=>t.states.has(s)),attack:[...i.attacks].some(s=>t.attacks.has(s))}}function Kr(n,e){const t=Yc(n,e);return t.state&&t.attack}function qu(n,e){const t=Yc(n.attribute,e);return n.exclude?!t.state&&!t.attack:t.state&&t.attack}function Dt(n){var t,i,s;if((n==null?void 0:n.baseCoordinateScale)>0)return n.baseCoordinateScale;const e=Number(String(((s=(i=(t=n==null?void 0:n.character)==null?void 0:t.def)==null?void 0:i.info)==null?void 0:s.localcoord)||"320,240").split(",")[0]);return e>0?320/e:1}function dr(n,e,{edge:t=!1}={}){var o,l,c,f,u,h;const i=n.facing===e,s=i?"front":"back",r=t?(l=(o=n.width)==null?void 0:o.edge)==null?void 0:l[i?0:1]:(c=n.width)==null?void 0:c[s],a=((u=(f=n.program)==null?void 0:f.constants)==null?void 0:u.get(`size.${n.stateType==="A"?"air":"ground"}.${s}`))??15;if(r!==void 0){const d=(Number(r)||0)*(n.coordinateScale||Dt(n));return Math.max(0,d+((h=n.world)!=null&&h.orderedPhases?Math.max(0,Number(a)||0)*Dt(n):0))}return Math.max(0,Number(a)||0)*Dt(n)}function _l(n){return n.startsWith("velocity.")?!/\.mul(?:\.|$)/.test(n):n.startsWith("size.")?!["size.xscale","size.yscale","size.proj.doscale"].includes(n):n.startsWith("movement.")&&!/(?:\.friction$|\.num$|\.time$|\.mul(?:\.|$))/.test(n)}const Kc=new Set(["xoff","yoff","zoff","xvel","yvel","xveladd","yveladd","yaccel","fall.xvel","fall.yvel","fall.envshake.ampl"]);function $u(n,e){const t=n.coordinateScale,i=t/e;if(n.coordinateScale=e,i!==1){for(const s of Kc)typeof n.getHitVars[s]=="number"&&(n.getHitVars[s]*=i);if(n.width){for(const s of["front","back"])typeof n.width[s]=="number"&&(n.width[s]*=i);n.width.edge&&(n.width.edge=n.width.edge.map(s=>s*i))}n.attackDist!==void 0&&(n.attackDist*=i)}}function Zc(n){return n.collisionFrame?n.collisionAnimationOwner||n.animationOwner||n:n.animationOwner||n}const Fa=n=>{var e;return n!=null&&n.isProjectile?(e=n.owner)==null?void 0:e.id:n==null?void 0:n.id},Jc=(n,e)=>!(e!=null&&e.isProjectile)&&(n.hitonce===void 0?/^[SCA]\s*,\s*[NSH]T$/i.test(n.attr||""):Number(n.hitonce)!==0);function Yu(n,e,t){const i=n.hitId??-1,s=e.chainid??-1;if(s>=0&&i!==s)return!1;const r=Array.isArray(e.nochainid)?e.nochainid:[e.nochainid??-1];return!(n.hitSourceId===Fa(t)&&Fa(t)!==void 0&&r.some(a=>a>=0&&a===i&&a!==s))}function Ku(n,e,t){var i;return Yu(n,e,t)&&!(Jc(e,t)&&((i=t==null?void 0:t._spentHitDefs)!=null&&i.has(e)))}function Zu(n,e,t){!t||!Jc(e,t)||(t._spentHitDefs??(t._spentHitDefs=new WeakSet),t._spentHitDefs.add(e),t.targets.splice(0,t.targets.length,n),t.targetHitIds.clear())}function yl(n,e,t,{count:i=!0}={}){var r,a;if(!n||(n.moveContact=1,n.moveHit=t?0:1,n.moveGuarded=t?1:0,n.moveReversed=0,t||!i||(r=n.world)!=null&&r.orderedPhases&&e.numhits===0))return;const s=((a=n.world)==null?void 0:a.ticks)??n.gameTime??0;n._lastHitCountTick!==s&&(n.hitCount=(n.hitCount||0)+1,n._lastHitCountTick=s),n.uniqHitCount=(n.uniqHitCount||0)+1}const Ju=new Set(["xveladd","yveladd","type","animtype","airtype","groundtype","damage","hitcount","fallcount","hitshaketime","hittime","slidetime","ctrltime","recovertime","xoff","yoff","zoff","xvel","yvel","yaccel","hitid","chainid","guarded","isbound","fall","fall.damage","fall.xvel","fall.yvel","fall.recover","fall.time","fall.recovertime","fall.kill","fall.envshake.time","fall.envshake.freq","fall.envshake.ampl","fall.envshake.phase"]);function ju(n){var e;return{type:0,hitid:-1,chainid:0,hitcount:0,fallcount:0,hittime:-1,recovertime:n.constant("data.liedown.time"),xveladd:0,yveladd:0,zoff:0,fall:0,"fall.time":0,"fall.recover":(e=n.world)!=null&&e.orderedPhases?0:1,"fall.recovertime":4}}const Sl=new Set(["a","b","c","x","y","z","s","U","D","L","R"]);function Qu(n,e,t){const i=e===null?new Set([...t].filter(s=>Sl.has(s))):new Set([...e].filter(s=>Sl.has(s)));if(e===null)for(const[s,r]of[["holdup","U"],["holddown","D"],["holdfwd",n.facing<0?"L":"R"],["holdback",n.facing<0?"R":"L"]])t.has(s)&&i.add(r);n._recoveryPressed=[...i].some(s=>!n._previousInput.has(s)),n._previousInput=i,n.rawInput=i}function Ml(n,{hitPaused:e=!1}={}){var i;const t=n.getHitVars;if(n.moveType==="H"){if(t.fall&&(t["fall.time"]=(t["fall.time"]||0)+1),e||(n.hitTime>=0&&n.hitTime--,[5070,5100].includes(n.stateNo)&&n._fallEntry!==n._entrySerial&&(t.fallcount=(t.fallcount||0)+1,n._fallEntry=n._entrySerial,n._fallDefenceMultiplier*=n.constant("data.fall.defence_mul")),n.stateNo===5110&&(t.recovertime=Math.max(0,(t.recovertime??n.constant("data.liedown.time"))-1))),n._recoveryPressed&&n.alive&&(n.stateType==="L"||t.fallcount>0)&&t.recovertime>0){const s=Math.max(1,Math.ceil(t.recovertime/2));t.recovertime=Math.max(0,t.recovertime-1-Math.floor(n.resolveTrigger("random")/1e3*s))}}else n.comboHits=0,n.hitTime=-1,n.hitId=n.hitId<0?-1:0,n.hitSourceId=void 0,t.fall=0,t.fallcount=0,(i=n.world)!=null&&i.orderedPhases||(t["fall.time"]=0),t["fall.envshake.time"]=0,n._fallDefenceMultiplier=1,t.recovertime=n.constant("data.liedown.time");t.hittime=n.hitTime,t.hitid=n.hitId,t.chainid=Math.max(0,n.hitId)}const jc=Object.freeze({attackLifeToPower:.7,getHitLifeToPower:.6,superTargetDefence:1.5});function ef(n={},e={}){const t=Object.keys(n).find(r=>/(?:^|\/)data\/mugen\.cfg$/i.test(r)),i=t?kr(bn(n[t])).rules||{}:{},s={...jc};for(const[r,a]of[["attackLifeToPower","default.attack.lifetopowermul"],["getHitLifeToPower","default.gethit.lifetopowermul"],["superTargetDefence","super.targetdefencemul"]]){const o=Number(e[r]??i[a]??s[r]);if(!Number.isFinite(o)||o<0)throw Error(`Invalid combat rule ${a}.`);s[r]=o}return s}function Ns(n,e,t,{absolute:i=!1}={}){let s=Number(n);if(!Number.isFinite(s))throw Error("Damage must be finite.");if(!i){const r=e?Math.max(0,e.constant("data.attack")/100*(e.attackMultiplier??1)):1,a=Math.max(.01,t.constant("data.defence")/100);s*=r*Math.max(0,t.defenceMultiplier??1)*Math.max(0,t._fallDefenceMultiplier??1)/a}return s>0?Math.max(1,Math.round(s)):Math.round(s)}function tf(n,e=jc){var s;const t=Math.max(0,Math.trunc(((s=n.damage)==null?void 0:s[0])||0)),i=(r,a)=>{const o=Array.isArray(r)?r:r===void 0?[Math.trunc(Math.fround(Math.fround(t)*Math.fround(a)))]:[r],l=Math.trunc(o[0]||0);return[l,Math.trunc(o[1]??l/2)]};return{get:i(n.getpower,e.attackLifeToPower),give:i(n.givepower,e.getHitLifeToPower)}}function nf(n,e,t,i=1){const s=n,r=e;return t!=="L"&&(t!=="A"&&e===0&&(n*=.66),n&&(n+=Math.sign(n)*2.5/i),e<=0&&(e=Math.min(e-2/i,(t==="A"?-3:-6)/i))),{x:n,y:e,xadd:n-s,yadd:e-r}}function Qc(n,e="<script>"){const t=[];let i;for(const[s,r]of String(n).replace(/^\uFEFF/,"").split(/\r?\n/).entries()){let a=!1,o=!1,l="";for(let v=0;v<r.length;v++){const S=r[v];if(S==='"'&&!o&&(a=!a),S===";"&&!a)break;l+=S,o=S==="\\"&&!o}const c=l.trim();if(!c)continue;const f=c.match(/^\[([^\]]+)\]/);if(f){i={name:f[1].trim().toLowerCase(),source:e,line:s+1,entries:[],values:{}},t.push(i);continue}let u=-1,h=0,d=!1,p=!1;for(let v=0;v<c.length;v++){const S=c[v];if(S==='"'&&!p&&(d=!d),!d){if(S==="("||S==="[")h++;else if(S===")"||S==="]")h--;else if(S==="="&&h===0){u=v;break}}p=S==="\\"&&!p}if(!i||u<1)continue;const _=c.slice(0,u).trim().toLowerCase(),m=c.slice(u+1).trim();i.entries.push({key:_,value:m,line:s+1}),i.values[_]=m}return t}const sf={"data.life":1e3,"data.power":3e3,"data.attack":100,"data.defence":100,"data.airjuggle":15,"data.liedown.time":60,"data.sparkno":2,"data.guard.sparkno":40,"data.fall.defence_up":50,"data.ko.echo":0,"data.intpersistindex":60,"data.floatpersistindex":40,"size.xscale":1,"size.yscale":1,"size.ground.back":15,"size.ground.front":16,"size.air.back":12,"size.air.front":12,"size.height":60,"size.attack.dist":160,"size.proj.doscale":0,"size.proj.attack.dist":90,"size.head.pos.x":0,"size.head.pos.y":-90,"size.mid.pos.x":0,"size.mid.pos.y":-60,"size.draw.offset.x":0,"size.draw.offset.y":0,"size.shadowoffset":0,"velocity.walk.fwd.x":2.4,"velocity.walk.back.x":-2.2,"velocity.run.fwd.x":4.6,"velocity.run.fwd.y":0,"velocity.run.back.x":-4.5,"velocity.run.back.y":-3.8,"velocity.jump.neu.x":0,"velocity.jump.neu.y":-8.4,"velocity.jump.y":-8.4,"velocity.jump.fwd.x":2.5,"velocity.jump.back.x":-2.55,"velocity.runjump.fwd.x":4,"velocity.runjump.fwd.y":-8.1,"velocity.runjump.back.x":-2.55,"velocity.runjump.back.y":-8.1,"velocity.airjump.neu.x":0,"velocity.airjump.neu.y":-8.1,"velocity.airjump.y":-8.1,"velocity.airjump.fwd.x":2.5,"velocity.airjump.back.x":-2.55,"velocity.air.gethit.groundrecover.x":-.15,"velocity.air.gethit.groundrecover.y":-3.5,"velocity.air.gethit.airrecover.mul.x":.5,"velocity.air.gethit.airrecover.mul.y":.2,"velocity.air.gethit.airrecover.add.x":0,"velocity.air.gethit.airrecover.add.y":-4.5,"velocity.air.gethit.airrecover.back":-1,"velocity.air.gethit.airrecover.fwd":0,"velocity.air.gethit.airrecover.up":-2,"velocity.air.gethit.airrecover.down":1.5,"movement.yaccel":.44,"movement.stand.friction":.85,"movement.crouch.friction":.82,"movement.stand.friction.threshold":2,"movement.crouch.friction.threshold":.05,"movement.airjump.num":1,"movement.airjump.height":35,"movement.air.gethit.groundlevel":25,"movement.air.gethit.groundrecover.ground.threshold":-20,"movement.air.gethit.groundrecover.groundlevel":10,"movement.air.gethit.airrecover.threshold":-1,"movement.air.gethit.airrecover.yaccel":.35,"movement.air.gethit.trip.groundlevel":15,"movement.down.bounce.offset.x":0,"movement.down.bounce.offset.y":20,"movement.down.bounce.yaccel":.4,"movement.down.bounce.groundlevel":12,"movement.down.friction.threshold":.05},No=new Set(["null","changestate","selfstate","changeanim","changeanim2","ctrlset","statetypeset","velset","veladd","velmul","posset","posadd","posfreeze","gravity","turn","varset","varadd","varmul","varrandom","varrangeset","parentvarset","parentvaradd","lifeadd","lifeset","poweradd","powerset","hitvelset","hitdef","hitby","nothitby","hitoverride","sprpriority","width","screenbound","playerpush","assertspecial","assertinput","playsnd","stopsnd","sndpan","envshake","palfx","allpalfx","bgpalfx","explod","modifyexplod","removeexplod","explodbindtime","targetbind","targetfacing","targetlifeadd","targetpoweradd","targetvelset","targetveladd","targetstate","targetdrop","bindtoroot","bindtoparent","bindtotarget","attackmulset","defencemulset","hitadd","hitcount","hitfallset","hitfallvel","hitfallDamage".toLowerCase(),"angleadd","angleset","anglemul","angledraw","offset","destroyself","helper","projectile","pause","superpause","afterimage","afterimagetime","trans","movehitreset","attackdist","reversaldef","envcolor","fallenvshake","remappal","makedust","gamemakeanim","forcefeedback","displaytoclipboard","appendtoclipboard","clearclipboard","victoryquote"]);new Set(No);const Uo=new Set(["time","stateno","prevstateno","anim","animelem","animtime","ctrl","statetype","movetype","physics","life","lifemax","power","powermax","facing","alive","gametime","hitpausetime","hitshakeover","hitover","movecontact","movehit","moveguarded","movereversed","hitcount","uniqhitcount","numhelper","numexplod","numtarget","numenemy","numpartner","ishelper","roundstate","roundno","matchno","teamside","teampower","tickspersecond","ailevel","palno","id","name","authorname","numproj","win","lose","drawgame","inguarddist","canrecover","pos x","pos y","vel x","vel y","screenpos x","screenpos y","command","const","const240p","const480p","const720p","random","animexist","selfanimexist","animelemtime","animelemno","gethitvar","playeridexist","p2name","p2life","p2stateno","p2statetype","p2movetype","p2bodydist x","p2dist x","p2bodydist y","p2dist y","hitdefattr","roundsexisted","camerapos x","camerapos y","hitfall","hitvel x","hitvel y","frontedgedist","backedgedist","frontedgebodydist","backedgebodydist","var","fvar","sysvar","sysfvar"]);Uo.add("teammode");Uo.add("ishometeam");for(const n of["p1name","p3name","p4name","frontedge","backedge","const240p","const480p","const720p"])Uo.add(n);const rf=new Set(["playsnd","stopsnd","sndpan","envshake","envcolor","palfx","allpalfx","bgpalfx","afterimage","afterimagetime"]),Zr=n=>vn(n).replaceAll("\\","/").toLowerCase().replace(/^\.\//,""),vn=n=>String(n??"").replace(/^"(.*)"$/,"$1"),Jr=bn,Fo=new Map;for(const n of["attackdist","attackmulset","changeanim","changeanim2","changestate","selfstate","ctrlset","defencemulset","hitadd","lifeadd","lifeset","playerpush","playsnd","poweradd","powerset","targetfacing","targetlifeadd","targetpoweradd","targetstate"])Fo.set(n,["value"]);for(const[n,e]of Object.entries({afterimagetime:["time"],assertspecial:["flag"],assertinput:["flag"],displaytoclipboard:["text"],appendtoclipboard:["text"],envshake:["time"],explod:["anim"],hitdef:["attr"],pause:["time"],reversaldef:["reversal.attr"],sndpan:["channel"],stopsnd:["channel"],trans:["trans"],varrandom:["v"]}))Fo.set(n,e);const jr=new WeakMap;function pr(n){var i;if(jr.has(n))return jr.get(n);const e={ignorehitpause:0,persistent:1,groups:new Map,errors:[],warnings:[]};for(const s of Fo.get(n.type)||[])n.values[s]===void 0&&e.errors.push({line:n.line,message:`${n.type} requires ${s}.`});["varset","varadd","varmul","parentvarset","parentvaradd"].includes(n.type)&&!n.entries.some(s=>/^(?:var|fvar|sysvar|sysfvar)\s*\(/.test(s.key))&&(n.values.v===void 0&&n.values.fv===void 0&&e.errors.push({line:n.line,message:`${n.type} requires v or fv (or alternate variable assignment syntax).`}),n.values.value===void 0&&e.errors.push({line:n.line,message:`${n.type} requires value.`})),n.type==="varrangeset"&&n.values.value===void 0&&n.values.fvalue===void 0&&e.errors.push({line:n.line,message:"VarRangeSet requires value or fvalue."}),n.type==="sndpan"&&n.values.pan===void 0&&n.values.abspan===void 0&&e.errors.push({line:n.line,message:"SndPan requires pan or abspan."});for(const s of["ignorehitpause","persistent"])if(n.values[s]!==void 0){const r=n.values[s],a=Number(r);!/^[+-]?\d+$/.test(r)||!Number.isSafeInteger(a)||a<-2147483648||a>2147483647||s==="persistent"&&a<0?e.errors.push({line:((i=n.entries.find(o=>o.key===s))==null?void 0:i.line)||n.line,message:`${s} requires ${s==="persistent"?"a nonnegative":"a signed 32-bit"} integer constant; expressions are not allowed.`}):e[s]=a}for(const s of n.entries){const r=/^trigger([1-9]\d*)$/.exec(s.key);if(r){const a=Number(r[1]);e.groups.has(a)||e.groups.set(a,[]),e.groups.get(a).push(s)}}e.groups.has(1)||e.errors.push({line:n.line,message:"A state controller requires at least one trigger1."});let t=1;for(;e.groups.has(t);)t++;for(const[s,r]of e.groups)s>=t&&(e.groups.delete(s),e.warnings.push({line:r[0].line,message:`trigger${s} is ignored because trigger${t} is missing.`}));return jr.set(n,e),e}function eh(n,{commonText:e="",constantDefaults:t={},constantsFromCnsOnly:i=!1}={}){var p,_,m;const s={states:new Map,constants:new Map(Object.entries({...sf,...t})),quotes:new Map,diagnostics:[],sources:[],controllerTypes:new Set},r=[];e&&r.push(["<common states>",e]);const a=n.files||{},o=((p=n.path)==null?void 0:p.slice(0,n.path.lastIndexOf("/")+1))||"",l=v=>{const S=Zr(v),T=o.lastIndexOf("/chars/"),E=T<0?"":o.slice(0,T+1),b=(n.checks||[]).find(y=>y.ok&&y.path&&Zr(y.value||"")===S&&a[y.path]);return[b==null?void 0:b.path,o+S,S,E+"data/"+S,"data/"+S].find(y=>y&&a[y])},c=((_=n.def)==null?void 0:_.files)||{},f=c.cns?l(c.cns):(m=(n.checks||[]).find(v=>v.key==="cns"&&v.ok))==null?void 0:m.path,u=c.stcommon&&l(c.stcommon);u?r.push([u,Jr(a[u])]):c.stcommon&&Zr(c.stcommon).split("/").at(-1)!=="common1.cns"&&s.diagnostics.push({source:n.path,line:0,type:"missing-file",message:`Common state file not found: ${c.stcommon}`});const h=new Set;for(const[v,S]of Object.entries(c)){if(!/^(cns|cmd|st\d*)$/.test(v)||!S)continue;const T=l(S);T&&!h.has(T)?(h.add(T),r.push([T,Jr(a[T])])):T||s.diagnostics.push({source:n.path,line:0,type:"missing-file",message:`${v}: ${S}`})}for(const v of n.checks||[])/^(cns|cmd|st\d*)$/.test(v.key)&&v.ok&&a[v.path]&&!h.has(v.path)&&(h.add(v.path),r.push([v.path,Jr(a[v.path])]));let d=0;for(const[v,S]of r){s.sources.push(v);let T;for(const E of Qc(S,v)){const b=E.name.match(/^statedef\s+(-?\d+)\s*$/);if(b){T={id:+b[1],...E,controllers:[]},s.states.set(T.id,T);const y=new Set(["type","movetype","physics","anim","velset","ctrl","poweradd","facep2","hitdefpersist","movehitpersist","hitcountpersist","sprpriority","juggle"]);for(const g of E.entries)y.has(g.key)||s.diagnostics.push({source:v,line:g.line,type:"unsupported-state-parameter",message:`Statedef parameter ${g.key} is not implemented.`})}else if(/^state(?:\s|$)/.test(E.name)){if(!T){s.diagnostics.push({source:v,line:E.line,type:"parse",message:"State controller has no preceding Statedef."});continue}const y=vn(E.values.type||"").toLowerCase(),g={...E,id:++d,type:y,state:T.id};T.controllers.push(g),s.controllerTypes.add(y);const x=pr(g);for(const[I,R]of[["controller-parameter",x.errors],["trigger-numbering",x.warnings]])for(const A of R)s.diagnostics.push({source:v,line:A.line,type:I,message:A.message});No.has(y)||s.diagnostics.push({source:v,line:E.line,type:"unsupported-controller",name:y||"(missing type)",message:`Controller ${y||"(missing type)"} is not implemented.`})}else if(E.name==="quotes")for(const y of E.entries){const g=/^victory(\d{1,2})$/.exec(y.key);if(g)try{s.quotes.set(+g[1],qc(y.value))}catch(x){s.diagnostics.push({source:v,line:y.line,type:"quote",message:x.message})}}else if(/^(data|size|velocity|movement)$/.test(E.name)){if(i&&v!==f)continue;for(const y of E.entries){const g=`${E.name}.${y.key}`,x=y.value.split(",").map(I=>Number(I.trim()));x.some(I=>!Number.isFinite(I))||(s.constants.set(g,x.length===1?x[0]:x),(x.length>1||E.name==="velocity")&&(s.constants.set(g+".x",x[0]),x.length>1&&s.constants.set(g+".y",x[1])),g==="velocity.jump.neu"&&x.length>1&&s.constants.set("velocity.jump.y",x[1]),g==="velocity.airjump.neu"&&x.length>1&&s.constants.set("velocity.airjump.y",x[1]))}}}}return s}const jt=n=>{const e=Number(n);if(!Number.isFinite(e))throw new Error(`Expected finite number, received ${String(n)}`);return e},ht=n=>Math.trunc(jt(n)),Ht=n=>typeof n=="number"&&Number.isFinite(n)&&n!==0,si=(n,e,t)=>Math.min(t,Math.max(e,n));class Er{constructor(e,t={}){var s,r,a,o,l;this.character=e,this.options=t,this.program=t.program||eh(e,t),this.animations=new Map((e.animations||[]).map(c=>[c.id,c])),this.diagnostics=[...this.program.diagnostics],this._diagnosticKeys=new Set(this.diagnostics.map(c=>`${c.source}:${c.line}:${c.type}:${c.message}`)),this._seed=t.seed??439041101,this.id=t.id??1,this.name=((r=(s=e.def)==null?void 0:s.info)==null?void 0:r.name)||"Character";const i=(((o=(a=e.def)==null?void 0:a.info)==null?void 0:o.localcoord)||"320,240").split(",").map(Number);this.localcoord={x:i[0]||320,y:i[1]||240},this.coordinateScale=320/this.localcoord.x,this.baseCoordinateScale=this.coordinateScale,this.world=t.world||null,this.parent=t.parent||null,this.root=t.root||this,this.helperId=t.helperId??0,this.keyCtrl=t.keyCtrl??!this.parent,this.ownPal=t.ownPal??!1,this.teamSide=t.teamSide??((l=this.root.options)==null?void 0:l.teamSide)??1,this.commonAnimations=t.commonAnimations||new Map,this.reset()}reset(){var e,t,i;this.vars=new Int32Array(60),this.fvars=new Float32Array(40),this.stateOwner=this,this.animationOwner=this,this.destroyed=!1,this.coordinateScale=this.baseCoordinateScale,this._scriptOwner=null,this.sysvars=new Int32Array(5),this.sysfvars=new Float32Array(5),this.maxLife=this.constant("data.life"),this.life=this.maxLife,this.maxPower=this.constant("data.power"),this._power=0,this.parent||(this.power=0),this.pos={x:((e=this.options.position)==null?void 0:e.x)||0,y:((t=this.options.position)==null?void 0:t.y)||0},this.vel={x:0,y:0},this.facing=this.options.facing===-1?-1:1,this.ctrl=1,this.stateType="S",this.moveType="I",this.physics="S",this.stateNo=0,this.prevStateNo=0,this.time=0,this.gameTime=0,this.anim=0,this.frameIndex=0,this.frameTime=0,this.animationTime=0,this.animationCycleTime=0,this.animationLooped=!1,this.animationEnded=!1,this.collisionFrame=null,this.collisionAnimationOwner=null,this.collisionAnimation=null,this.collisionFrameIndex=0,this.collisionFrameTime=0,this.hitDef=null,this.reversalDef=null,this.moveReversed=0,this._hitSerial=0,this.hitPauseTime=0,this.hitTime=-1,this.hitId=-1,this.hitSourceId=void 0,this._spentHitDefs=new WeakSet,this.inGuardDistance=!1,this._projectileContactShield=!1,this.moveContact=0,this.moveHit=0,this.moveGuarded=0,this.hitCount=0,this.uniqHitCount=0,this.comboHits=0,this._lastHitCountTick=null,this.getHitVars=ju(this),this._fallXVelocityDefined=!1,this._fallDefenceMultiplier=1,this._previousInput=new Set,this.rawInput=new Set,this._fallEntry=-1,this.targets=[],this.targetHitIds=new Map,this.helpers=[],this.explods=[],this.drawExplods=[],this.events=[],this.commands=new Set,this.asserted=new Set,this.opponent=null,this.pendingAssertedInputs=new Set,this._pendingStateEntry=null,this._pendingHitTransform=null,this.attackMultiplier=1,this.defenceMultiplier=1,this.sprPriority=0,this.angle=0,this.drawScale={x:1,y:1},this.drawOffset={x:0,y:0},this.playerPush=!this.parent,this.screenBound=!this.parent,this.moveCamera={x:!this.parent,y:!this.parent},this.posFrozen=!1,this.width=null,this.hitFilters=[null,null],this.hitOverrides=new Map,this.bound=null,this._controllerCounts=new Map,this._entrySerial=0,this.pauseMoveTime=this.options.pauseMoveTime||0,this.superMoveTime=this.options.superMoveTime||0,this.projectileHistory=[],this.trans=null,this.angleDraw=!1,this.juggleCost=0,this._juggleSerial=0,this._paletteRemaps=new Map,this.paletteNo=Math.max(1,Math.min(256,Math.trunc(this.options.paletteNo??((i=this.parent)==null?void 0:i.paletteNo)??1))),this.paletteNo!==1&&this._paletteRemaps.set("1,1",[1,this.paletteNo]),this._initializing=!1,this.aiLevel=this.parent?this.root.aiLevel:Math.max(0,Math.min(8,Math.trunc(Number.isFinite(Number(this.options.aiLevel))?Number(this.options.aiLevel):0))),this.clipboard="",this.victoryQuoteIndex=-1,this.victoryQuote=null,this._dustTicks=new Map,this.cornerPush=0,this._previousUp=!1,this.airJumps=0,this._changeCount=0,this._executing=null,this.attackDist=void 0,this.changeState(0),this.events=[]}diagnostic(e,t,i=this._executing){const s={source:(i==null?void 0:i.source)||this.character.path||"<character>",line:(i==null?void 0:i.line)||0,type:e,message:t};i&&(s.controller=i.type,s.state=i.state);const r=`${s.source}:${s.line}:${s.type}:${s.message}`;return this._diagnosticKeys.has(r)||(this._diagnosticKeys.add(r),this.diagnostics.push(s)),s}constant(e,t=this.coordinateScale){if(e=String(e).toLowerCase(),e==="data.fall.defence_mul")return 100/(100+this.constant("data.fall.defence_up",t));if(!this.program.constants.has(e))throw new Error(`Unknown character constant: ${e}`);const i=this.program.constants.get(e);return(Array.isArray(i)?i[0]:i)*(_l(e)?this.baseCoordinateScale/t:1)}get animation(){return(this.animationOwner||this).animations.get(this.anim)}get currentFrame(){var e;return((e=this.animation)==null?void 0:e.frames[this.frameIndex])||null}get animElemTime(){return this.frameTime}get animTime(){var t;const e=(t=this.animation)==null?void 0:t.frames;return!(e!=null&&e.length)||this.animationEnded?0:e.some(i=>i.ticks<0)?-1:this.animationCycleTime-e.reduce((i,s)=>i+Math.max(1,s.ticks),0)}get alive(){return this.life>0}get paletteRemaps(){return this.parent&&!this.ownPal?this.parent.paletteRemaps:this._paletteRemaps}ownedHelpers(){return this.world?this.world.entities.filter(e=>e.parent&&!e.destroyed&&(this===this.root?e.root===this:e.parent===this)):this.helpers.filter(e=>!e.destroyed)}get power(){return this.parent?this.root.power:this._power}set power(e){this.parent?this.root.power=e:this._power=e}evaluate(e,t=this._executing,i=!1){try{return(this.options.expressionEvaluator||(i?Ua:Na))(e,{resolve:(s,r=[],a=null)=>this.resolveTrigger(s,r,a),assign:(s,r,a)=>this.assignVariable(s,r,a),onWarning:s=>{s.bottom||this.diagnostic("expression-warning",`${e}: ${s.message}`,t)},typedResult:i})}catch(s){throw s.bottom||this.diagnostic("expression",`${e}: ${s.message}`,t),s}}variableArray(e){const t={var:this.vars,fvar:this.fvars,sysvar:this.sysvars,sysfvar:this.sysfvars};if(!t[e])throw new Error(`Unsupported assignable variable: ${e}`);return t[e]}assignVariable(e,t,i){const s=this.variableArray(e.toLowerCase()),r=ht(t[0]);if(r<0||r>=s.length)throw new Lt(`${e} index out of range: ${r}`);return s[r]=jt(i),s[r]}resolveTrigger(e,t=[],i=null,s=this.coordinateScale){var u,h,d,p,_,m,v,S,T,E,b,y,g,x,I,R,A,F,N,P,k,H,B,C,L,V,$,ie,ne,G,se,ge,Se,ae,Le,lt,Re,Ve,Xe;if(e=e.toLowerCase(),i){let ee;const Ee=i.name.toLowerCase();if(["enemynear","enemy","p2"].includes(Ee)){const we=(((u=this.world)==null?void 0:u.entities)||[this.opponent]).filter(Ze=>Ze&&!Ze.destroyed&&!Ze.parent&&Ze.teamSide!==this.teamSide);Ee==="enemynear"&&we.sort((Ze,st)=>Math.abs(Ze.pos.x-this.pos.x)-Math.abs(st.pos.x-this.pos.x)),ee=we[Math.trunc(i.args[0]||0)]}else if(Ee==="root")ee=this.root||this;else if(Ee==="parent")ee=this.parent;else if(Ee==="partner")ee=(((h=this.world)==null?void 0:h.entities)||[]).filter(we=>!we.parent&&we!==this.root&&we.teamSide===this.teamSide)[Math.trunc(i.args[0]||0)];else if(Ee==="helper")ee=this.ownedHelpers().find(we=>!i.args.length||we.helperId===+i.args[0]);else if(Ee==="target")ee=this.targets.find(we=>!i.args.length||(this.targetHitIds.get(we.id)??we.hitId)===+i.args[0]);else if(Ee==="playerid")ee=((d=this.world)==null?void 0:d.findPlayer(+i.args[0]))||[this,this.opponent,...this.helpers].find(we=>(we==null?void 0:we.id)===+i.args[0]);else throw new Error(`Unsupported redirection: ${Ee}`);if(!ee||ee.destroyed){const we=new Error(`Redirection ${Ee} has no matching player`);throw we.bottom=!0,we}return ee.resolveTrigger(e,t,null,s)}if(["var","fvar","sysvar","sysfvar"].includes(e)){const ee=this.variableArray(e),Ee=ht(t[0]);if(Ee<0||Ee>=ee.length)throw new Lt(`${e} index out of range: ${Ee}`);return ee[Ee]}if(e==="inguarddist")return+(this.world?this.inGuardDistance||!1:Hc(this,this.opponent?[this.opponent]:[]));const r=this.opponent,a=(p=this.world)==null?void 0:p.roundFlow,o=this.root===((_=this.world)==null?void 0:_.player)?"player":"opponent",l=!!(a!=null&&a.roundWinner)&&a.roundWinner===o,c=!!(a!=null&&a.roundWinner)&&a.roundWinner!=="draw"&&!l,f={time:this.time,stateno:this.stateNo,prevstateno:this.prevStateNo,anim:this.anim,animelem:this.frameIndex+1,animtime:this.animTime,ctrl:this.ctrl,statetype:this.stateType,movetype:this.moveType,physics:this.physics,life:this.life,lifemax:this.maxLife,power:this.power,powermax:this.maxPower,facing:this.facing,alive:+this.alive,gametime:((m=this.world)==null?void 0:m.ticks)??this.gameTime,hitpausetime:this.hitPauseTime,hitshakeover:+(((v=this.world)!=null&&v.orderedPhases?this.getHitVars.hitshaketime||0:this.hitPauseTime)===0),hitover:+(this.hitTime<0),movecontact:this.moveContact,movehit:this.moveHit,moveguarded:this.moveGuarded,movereversed:this.moveReversed||0,hitcount:this.hitCount,uniqhitcount:this.uniqHitCount,numhelper:this.ownedHelpers().length,numexplod:this.explods.length,numtarget:this.targets.length,numenemy:r?1:0,numpartner:0,ishelper:+!!this.parent,roundstate:this.roundState??2,roundsexisted:this.roundsExisted??0,roundno:this.roundNo??1,matchno:this.matchNo??1,matchover:+!!((S=this.world)!=null&&S.matchOver),teamside:this.teamSide??this.id,teampower:this.power,tickspersecond:60,aiLevel:this.aiLevel||0,ailevel:this.aiLevel||0,palno:this.paletteNo||1,teammode:"single",ishometeam:+(this.teamSide===1),id:this.id,name:this.name,authorname:((E=(T=this.character.def)==null?void 0:T.info)==null?void 0:E.author)||"",numproj:(((b=this.world)==null?void 0:b.projectiles)||[]).filter(ee=>ee.owner===this&&!ee.removing&&!ee.removed).length,win:a?+l:+(this.roundState===4&&this.alive&&(r==null?void 0:r.life)<=0),lose:a?+c:+(this.roundState===4&&!this.alive),drawgame:a?+(a.roundWinner==="draw"):+(this.roundState===4&&!this.alive&&(r==null?void 0:r.life)<=0),winko:+(l&&a.reason!=="time"),wintime:+(l&&a.reason==="time"),winperfect:+(l&&this.life===this.maxLife),loseko:+(c&&a.reason!=="time"),losetime:+(c&&a.reason==="time"),loseperfect:+(c&&(r==null?void 0:r.life)===(r==null?void 0:r.maxLife)),camerazoom:this.cameraZoom??1,gamewidth:(((y=this.world)==null?void 0:y.view.width)??320)/s,gameheight:(((g=this.world)==null?void 0:g.view.height)??240)/s,screenwidth:320/s,screenheight:(((x=this.world)==null?void 0:x.view.displayHeight)??240)/s,leftedge:(((I=this.world)==null?void 0:I.view.left)??-160)/s,rightedge:(((R=this.world)==null?void 0:R.view.right)??160)/s,topedge:(((A=this.world)==null?void 0:A.view.top)??-240)/s,bottomedge:(((F=this.world)==null?void 0:F.view.bottom)??0)/s,frontedge:(this.facing===1?((N=this.world)==null?void 0:N.view.right)??160:((P=this.world)==null?void 0:P.view.left)??-160)/s,backedge:(this.facing===1?((k=this.world)==null?void 0:k.view.left)??-160:((H=this.world)==null?void 0:H.view.right)??160)/s,canrecover:+(!!this.getHitVars.fall&&this.getHitVars["fall.recover"]!==0&&(this.getHitVars["fall.time"]||0)>=(this.getHitVars["fall.recovertime"]??4)),hitfall:this.getHitVars.fall||0,"hitvel x":(this.getHitVars.xvel||0)*this.coordinateScale/s,"hitvel y":(this.getHitVars.yvel||0)*this.coordinateScale/s,"pos x":(this.pos.x-(((B=this.cameraPos)==null?void 0:B.x)||0))/s,"pos y":this.pos.y/s,"vel x":this.vel.x/s,"vel y":this.vel.y/s,"screenpos x":(this.pos.x-(((C=this.world)==null?void 0:C.view.left)??-160))/s,"screenpos y":(this.pos.y-(((L=this.world)==null?void 0:L.view.top)??-240))/s,"camerapos x":(((V=this.cameraPos)==null?void 0:V.x)||0)/s,"camerapos y":((($=this.cameraPos)==null?void 0:$.y)||0)/s};if(e==="command")return+this.commands.has(String(t[0]));if(e==="stagevar"){if(!((ie=this.world)!=null&&ie.stage))throw Error("StageVar requires an imported stage.");return this.world.stage.variable(t[0])}if(e==="ishelper"&&t.length)return+(!!this.parent&&this.helperId===+t[0]);if(e==="numprojid")return(((ne=this.world)==null?void 0:ne.projectiles)||[]).filter(ee=>ee.owner===this&&!ee.removing&&!ee.removed&&ee.projId===Math.max(0,Math.trunc(+t[0]))).length;if(/^proj(contact|hit|guarded|cancel)time$/.test(e)){const ee=e.slice(4,-4),Ee=Math.max(0,+t[0]||0),we=this.projectileHistory.at(-1);return we&&(!Ee||we.projId===Ee)&&(ee==="contact"?["hit","guarded"].includes(we.type):we.type===ee)?(((G=this.world)==null?void 0:G.ticks)??this.gameTime)-we.tick:-1}if(/^(parentdist|rootdist) [xy]$/.test(e)){const ee=this.parent?e.startsWith("parent")?this.parent:this.root:null;if(!ee||ee.destroyed||e.startsWith("parent")&&!ee.alive){const we=Error("No live parent or root");throw we.bottom=!0,we}const Ee=e.at(-1);return(ee.pos[Ee]-this.pos[Ee])*(Ee==="x"?this.facing:1)/s}if(e==="const")return this.constant(t[0],s);if(e==="const240p")return jt(t[0])/this.coordinateScale;if(e==="const480p")return jt(t[0])/(2*this.coordinateScale);if(e==="const720p")return jt(t[0])/(4*this.coordinateScale);if(e==="random")return this._seed^=this._seed<<13,this._seed^=this._seed>>>17,this._seed^=this._seed<<5,(this._seed>>>0)%1e3;if(e==="animexist"||e==="selfanimexist")return+(e==="selfanimexist"?this:this.animationOwner).animations.has(ht(t[0]));if(e==="animelemtime"){const ee=ht(t[0])-1,Ee=((se=this.animation)==null?void 0:se.frames)||[];if(ee<0||ee>=Ee.length){const Ze=new Error(`Animation element out of range: ${ee+1}`);throw Ze.bottom=!0,Ze}const we=Ee.slice(0,ee).reduce((Ze,st)=>Ze+Math.max(1,st.ticks),0);return this.animationTime-we}if(e==="animelemno"){let ee=this.animationCycleTime+jt(t[0]||0),Ee=((ge=this.animation)==null?void 0:ge.frames)||[];if(!Ee.length){const He=new Error("Animation has no elements");throw He.bottom=!0,He}const we=Ee.map(He=>He.ticks<0?1/0:Math.max(1,He.ticks)),Ze=we.reduce((He,Nt)=>He+Nt,0),st=((Se=this.animation)==null?void 0:Se.loopStart)??0,Xt=we.slice(0,st).reduce((He,Nt)=>He+Nt,0);if(Number.isFinite(Ze)&&(this.animationLooped||this.frameIndex>=st||ee>=Ze)){const He=Ze-Xt;ee=Xt+((ee-Xt)%He+He)%He}else if(ee<0){const He=new Error("Animation offset precedes its start");throw He.bottom=!0,He}for(let He=0;He<Ee.length;He++)if(ee-=we[He],ee<0)return He+1}if(e==="gethitvar"){const ee=String(t[0]).toLowerCase();if(ee==="isbound")return+(!!this.bound&&!this.bound.target.destroyed);if(ee==="hittime")return this.hitTime;if(ee==="hitshaketime")return(ae=this.world)!=null&&ae.orderedPhases?this.getHitVars.hitshaketime||0:this.hitPauseTime;if(ee in this.getHitVars)return this.getHitVars[ee]*(Kc.has(ee)?this.coordinateScale/s:1);if(Ju.has(ee))return 0;throw new Error(`Unsupported GetHitVar field: ${ee}`)}if(e==="numexplod"&&t.length)return this.explods.filter(ee=>ee.id===+t[0]).length;if(e==="numhelper"&&t.length)return this.ownedHelpers().filter(ee=>+t[0]<=0||ee.helperId===+t[0]).length;if(e==="numtarget"&&t.length)return this.targets.filter(ee=>!ee.destroyed&&(+t[0]<0||(this.targetHitIds.get(ee.id)??ee.hitId)===+t[0])).length;if(e==="playeridexist")return+((Le=this.world)!=null&&Le.findPlayer(+t[0])||[this,r,...this.helpers].find(ee=>(ee==null?void 0:ee.id)===+t[0]&&!ee.destroyed)?1:0);if(["frontedgedist","backedgedist","frontedgebodydist","backedgebodydist"].includes(e)){const ee=e.startsWith("front"),Ee=this.facing*(ee?1:-1),we=Ee>0?((lt=this.world)==null?void 0:lt.view.right)??this.options.rightBound??160:((Re=this.world)==null?void 0:Re.view.left)??this.options.leftBound??-160;let Ze=(Ee>0?we-this.pos.x:this.pos.x-we)/s;return e.includes("body")&&(Ze-=dr(this,Ee,{edge:!0})/s),Ze}if(e==="p1name")return this.name;if(["p2name","p3name","p4name"].includes(e)){const ee=(((Ve=this.world)==null?void 0:Ve.entities)||[this,r]).filter(we=>we&&!we.destroyed&&!we.parent),Ee=e==="p2name"?r:e==="p3name"?ee.find(we=>we!==this.root&&we.teamSide===this.teamSide):ee.filter(we=>we.teamSide!==this.teamSide)[1];return(Ee==null?void 0:Ee.name)??{absent:!0}}if(["p2life","p2stateno","p2statetype","p2movetype","p2bodydist x","p2dist x","p2bodydist y","p2dist y"].includes(e)&&!r)throw new Lt(`${e}: P2 does not exist.`);if(e==="p2life")return r.life;if(e==="p2stateno")return r.stateNo;if(e==="p2statetype")return r.stateType;if(e==="p2movetype")return r.moveType;if(e==="p2bodydist x"||e==="p2dist x"){if(!r)return 0;let ee=(r.pos.x-this.pos.x)*this.facing/s;if(e==="p2bodydist x"){const Ee=ee>=0;ee-=dr(this,this.facing)/s+(Ee?1:-1)*dr(r,Ee?-this.facing:this.facing)/s}return ee}if(e==="p2bodydist y"||e==="p2dist y")return r?(r.pos.y-this.pos.y)/s:0;if(e==="hitdefattr")return this.moveType!=="A"||!((Xe=this.hitDef)!=null&&Xe.attr)?0:+Kr(t.map(String).join(","),this.hitDef.attr);if(Object.hasOwn(f,e))return f[e];throw new Qi(`Unsupported trigger: ${e}`)}parameter(e,t=this._executing,i=!1){try{return this.evaluate(e,t,i)}catch(s){if(!s.bottom)throw s;return this.diagnostic("parameter-bottom",`${e}: ${s.message} Parameter set to 0.`,t),i?{value:0,float:!1}:0}}value(e,t,i){var o;const s=e.values[t];if(s===void 0)return i;if(t==="ignorehitpause"||t==="persistent"){const l=pr(e);if(l.errors.some(c=>c.message.startsWith(t)))throw Error(l.errors.find(c=>c.message.startsWith(t)).message);return l[t]}let r=(o=this._parameterCache)==null?void 0:o.get(e);if(this._parameterCache&&!r&&this._parameterCache.set(e,r=new Map),r!=null&&r.has(t))return r.get(t);const a=this.parameter(s,e);return r==null||r.set(t,a),a}vector(e,t,i=[0,0]){var o;const s=e.values[t];if(s===void 0)return[...i];let r=(o=this._parameterCache)==null?void 0:o.get(e);if(this._parameterCache&&!r&&this._parameterCache.set(e,r=new Map),r!=null&&r.has(t))return[...r.get(t)];const a=gn(s).map(l=>jt(this.parameter(l,e)));return r==null||r.set(t,a),a}text(e,t,i=""){return vn(e.values[t]??i)}changeAnimation(e,t=1,i=this){if(e=ht(e),e<0&&(this.diagnostic("animation-value","Negative animation number; using action 0."),e=0),!i.animations.has(e))return this.diagnostic("missing-animation",`Animation ${e} does not exist.`),!1;const s=i.animations.get(e).frames,r=ht(t)-1,a=r>=0&&r<s.length?r:0;return this.animationOwner=i,this.anim=e,this.frameIndex=a,this.frameTime=0,this.animationEnded=!1,this.animationTime=s.slice(0,a).reduce((o,l)=>o+Math.max(1,l.ticks),0),this.animationCycleTime=this.animationTime,this.animationLooped=!1,!0}changeState(e,t,i=this.stateOwner||this){var f,u,h,d;e=ht(e);const s=i.program.states.get(e);if(!s)return this.diagnostic("missing-state",`State ${e} does not exist.`),!1;if((f=this.world)!=null&&f.orderedPhases&&(this.world.contactPhase||this.world.activeActor!==this&&((u=this.world._entities)!=null&&u.includes(this))))return this._pendingStateEntry={number:e,ctrl:t,owner:i,oldState:((h=this._pendingStateEntry)==null?void 0:h.oldState)??this.stateNo,oldOwner:((d=this._pendingStateEntry)==null?void 0:d.oldOwner)??this.stateOwner},this.prevStateNo=this.stateNo,this.stateNo=e,this.stateOwner=i,this.time=0,!0;if(++this._changeCount>64)return this.diagnostic("state-loop","More than 64 state changes in one tick; execution stopped."),!1;const r=this.stateOwner.program.states.get(this.stateNo);this.stateOwner=i,$u(this,Dt(i)),this.prevStateNo=this.stateNo,this.stateNo=e,this.time=0,t!==void 0&&ht(t)>=0&&(this.ctrl=+Ht(ht(t))),this._entrySerial++,this._controllerCounts.clear();let a=!1,o=!1,l=!1;try{a=Ht(this.value(s,"hitdefpersist",0)),o=Ht(this.value(s,"movehitpersist",0)),l=Ht(this.value(s,"hitcountpersist",0))}catch{}a||(this.hitDef=null,this.reversalDef=null),o||(this.moveContact=0,this.moveHit=0,this.moveGuarded=0,this.moveReversed=0),l||(this.hitCount=0,this.uniqHitCount=0,this._lastHitCountTick=null);const c=this.moveType;this.moveType="I",this._executing=s;try{const p=this.text(s,"type","S").toUpperCase(),_=this.text(s,"physics","N").toUpperCase();if(p!=="U"&&(this.stateType=p),_!=="U"&&(this.physics=_),s.values.movetype){const m=this.text(s,"movetype").toUpperCase();this.moveType=m==="U"?c:m}if(s.values.ctrl!==void 0&&(this.ctrl=+Ht(this.value(s,"ctrl",this.ctrl))),s.values.anim!==void 0){const m=ht(this.value(s,"anim",-1));m!==-1&&this.changeAnimation(m)}if(s.values.velset!==void 0){const[m=0,v=0]=this.vector(s,"velset");this.vel={x:m*this.coordinateScale,y:v*this.coordinateScale}}s.values.sprpriority!==void 0&&(this.sprPriority=ht(this.value(s,"sprpriority",0))),s.values.juggle!==void 0&&(this.juggleCost=Math.max(0,ht(this.value(s,"juggle",0))),this._juggleSerial++),s.values.poweradd!==void 0&&(this.power=si(this.power+this.value(s,"poweradd",0),0,this.maxPower)),Ht(this.value(s,"facep2",0))&&this.opponent&&(this.facing=this.opponent.pos.x>=this.pos.x?1:-1)}catch{}return this._executing=null,this.events.push({type:"state",state:e,previous:r==null?void 0:r.id}),!0}shouldRun(e,t){const i=pr(e);if(i.errors.length||t&&!i.ignorehitpause)return!1;const s=e.entries.filter(c=>c.key==="triggerall");for(const c of s)try{if(!Ht(this.evaluate(c.value,{...e,line:c.line})))return!1}catch{return!1}const r=i.groups;let a=!1;for(const[,c]of[...r].sort(([f],[u])=>f-u)){let f=!0;for(const u of c)try{if(!Ht(this.evaluate(u.value,{...e,line:u.line}))){f=!1;break}}catch{f=!1;break}if(f){a=!0;break}}if(!a)return!1;const o=i.persistent,l=this._controllerCounts.get(e)||0;return this._controllerCounts.set(e,l+1),o===0?l===0:l%o===0}runState(e,t,i=this.stateOwner){const s=i.program.states.get(e);if(!s)return;const r=this._entrySerial;for(const a of s.controllers){const o=this._scriptOwner;this._scriptOwner=i,this._executing=a;try{this.shouldRun(a,t)&&this.execute(a)}catch(l){this.diagnostics.some(c=>c.message.includes(l.message)&&c.source===a.source)||this.diagnostic("controller",l.message,a)}if(this._executing=null,this._scriptOwner=o,this.destroyed||this._entrySerial!==r)break}}movementHeld(e){var r;if(!((r=this.world)!=null&&r.manageInputs))return this.commands.has(e);const t=this.rawInput,i=this.facing<0?"L":"R",s=this.facing<0?"R":"L";return e==="holdup"?t.has("U")&&!t.has("D"):e==="holddown"?t.has("D")&&!t.has("U"):e==="holdfwd"?t.has(i)&&!t.has(s):e==="holdback"?t.has(s)&&!t.has(i):!1}automaticTransitions(){var r,a,o,l,c,f;if(!this.ctrl||this.moveType==="H"||!this.alive||this.stateOwner!==this||this.parent&&!this.keyCtrl||(r=this.world)!=null&&r.roundFlow&&this.world.roundFlow.roundState!==2)return;const e=this.movementHeld("holddown"),t=this.movementHeld("holdup"),i=this.movementHeld("holdfwd")||this.movementHeld("holdback"),s=this.movementHeld("holdback")&&!this.asserted.has("noautoguard")&&!!this.resolveTrigger("inguarddist");if(!(s&&((a=this.world)!=null&&a.orderedPhases)&&[120,130,131,132,140].includes(this.stateNo))){if(s&&![120,130,131,132,140].includes(this.stateNo)){const u=this.stateType==="A"?"noairguard":this.stateType==="C"?"nocrouchguard":"nostandguard",h=this.stateType==="A"?132:this.stateType==="C"?131:120;if(!this.asserted.has(u)&&this.program.states.has(h)){this.changeState(h);return}}if(!this.asserted.has("noautoturn")&&((l=(o=this.world)==null?void 0:o.stage)==null?void 0:l.definition.autoturn)!==!1&&this.stateType!=="A"&&this.opponent&&[0,10,11,12,20].includes(this.stateNo)){const u=this.opponent.pos.x>=this.pos.x?1:-1;u!==this.facing&&(this.facing=u)}if(this.stateType==="A"){t&&!this._previousUp&&this.airJumps<this.constant("movement.airjump.num")&&-this.pos.y>=this.constant("movement.airjump.height")&&this.program.states.has(45)&&(this.airJumps++,this.changeState(45));return}if(t&&!this.asserted.has("nojump")&&this.program.states.has(40)){this.changeState(40);return}if(e&&this.stateType==="S"&&!this.asserted.has("nocrouch")&&this.program.states.has(10)){this.changeState(10);return}if(!e&&this.stateType==="C"&&((c=this.world)!=null&&c.orderedPhases||[10,11].includes(this.stateNo))&&this.program.states.has(12)){this.changeState(12);return}!this.asserted.has("nowalk")&&this.stateType==="S"&&this.moveType==="I"&&(i&&((f=this.world)!=null&&f.orderedPhases?this.stateNo!==20&&this.stateNo!==100:this.stateNo===0)&&this.program.states.has(20)?this.changeState(20):!i&&this.stateNo===20&&this.changeState(0))}}tick({commands:e=new Set,opponent:t=null,paused:i=!1,input:s=null}={}){var f;const r=(f=this.world)==null?void 0:f.orderedPhases;if(r&&!i&&this._pendingHitTransform){const u=this._pendingHitTransform;this._pendingHitTransform=null,u.facing!==void 0&&(this.facing=u.facing);for(const h of["x","y"])u[h]!==void 0&&(this.pos[h]=u[h])}const a=r&&!!this._pendingStateEntry&&!i;if(r&&this._pendingStateEntry&&!i){const u=this._pendingStateEntry;this._pendingStateEntry=null,this.stateNo=u.oldState,this.stateOwner=u.oldOwner,this.changeState(u.number,u.ctrl,u.owner)}if(this.events=[],this.commands=e,this.opponent=t,Qu(this,s,e),i||this.destroyed)return this.world||this.updateExplods({forceFrozen:!0}),this.gameTime++,this.events;this._changeCount=0,this._executing=null;const o=this.hitPauseTime>0,l=r&&(this.getHitVars.hitshaketime||0)>0&&this.moveType==="H";r&&!a&&!o&&!l&&this.advanceAnimation(),this.asserted=new Set,this.posFrozen=!1,o||(this.playerPush=!this.parent,this.screenBound=!this.parent,this.moveCamera={x:!this.parent,y:!this.parent},this.width=null),this.drawOffset={x:0,y:0},this.drawScale={x:1,y:1},this.trans=null,this.angleDraw=!1,this.moveContact>0&&!o&&this.moveContact++,this.moveHit>0&&!o&&this.moveHit++,this.moveGuarded>0&&!o&&this.moveGuarded++,this.moveReversed>0&&!o&&this.moveReversed++;for(let u=0;u<2;u++){const h=this.hitFilters[u];(h==null?void 0:h.time)>0&&--h.time===0&&(this.hitFilters[u]=null)}for(const[u,h]of this.hitOverrides)h.time>0&&--h.time===0&&this.hitOverrides.delete(u);if(this.parent||(this.stateOwner===this&&this.runState(-3,o,this),this.runState(-2,o,this)),this.keyCtrl&&this.stateOwner===this&&!this._initializing&&this.runState(-1,o,this.parent?this.root:this),this.destroyed)return this.gameTime++,this.events;!o&&!this._initializing&&this.automaticTransitions(),!o&&this.stateNo===5110&&this.time>=1&&this.alive&&(this.getHitVars.recovertime??1)<=0&&this.stateOwner.program.states.has(5120)&&this.changeState(5120);let c;do c=this._entrySerial,this._initializing&&this.options.skipIntro&&[190,191].includes(this.stateNo)?(this.changeState(0),this.ctrl=1):this.runState(this.stateNo,o);while(c!==this._entrySerial&&this._changeCount<=64);if(this.destroyed)return this.gameTime++,this.events;if(o||(this._initializing=!1),this.collisionFrame=this.currentFrame,this.collisionAnimationOwner=this.animationOwner,o)return Ml(this,{hitPaused:!0}),this.world||this.updateExplods({hitPaused:!0}),this.hitPauseTime=Math.max(0,this.hitPauseTime-1),this.gameTime++,this.events;if(!this.posFrozen&&!this.bound&&!l&&(this.pos.x+=this.vel.x*this.facing+this.cornerPush,this.pos.y+=this.vel.y,r&&(this.pos.x=Math.fround(this.pos.x),this.pos.y=Math.fround(this.pos.y))),this.cornerPush*=si(this.constant("movement.stand.friction"),0,1),Math.abs(this.cornerPush)<.01&&(this.cornerPush=0),!l&&this.physics==="A")this.vel.y+=(r?Math.fround(this.constant("movement.yaccel")):this.constant("movement.yaccel"))*this.coordinateScale,r&&(this.vel.y=Math.fround(this.vel.y)),this.pos.y>=0&&this.vel.y>0&&!(r&&this.stateNo===105)&&(this.pos.y=0,this.vel.y=0,this.airJumps=0,this.program.states.has(52)&&this.changeState(52));else if(!l&&(this.physics==="S"||this.physics==="C")&&(r||![20,100].includes(this.stateNo))){const u=this.physics==="C"?"crouch":"stand",h=this.constant("movement."+u+".friction");if(this.vel.x*=r?Math.fround(h):h,r&&(this.vel.x=Math.fround(this.vel.x)),r){const d=u==="stand"?1:this.constant("movement.crouch.friction.threshold");Math.abs(this.vel.x)<d*this.coordinateScale&&(this.vel.x=0)}}return this.updateBinding(),this.collisionFrame=this.currentFrame,this.collisionAnimationOwner=this.animationOwner,this.collisionAnimation=this.animation,this.collisionFrameIndex=this.frameIndex,this.collisionFrameTime=this.frameTime,r||this.advanceAnimation(),this.world||this.updateExplods(),l&&(this.getHitVars.hitshaketime=Math.max(0,this.getHitVars.hitshaketime-1)),Ml(this,{hitPaused:r&&(this.getHitVars.hitshaketime||0)>0}),this.time++,this.gameTime++,this._previousUp=this.movementHeld("holdup"),this.events}advanceAnimation(){var i;const e=this.animation,t=this.currentFrame;if(t){if(t.ticks<0){(i=this.world)!=null&&i.orderedPhases&&(this.frameTime++,this.animationTime++,this.animationCycleTime++);return}this.animationEnded&&(this.animationEnded=!1),this.frameTime++,this.animationTime++,this.animationCycleTime++,this.frameTime>=Math.max(1,t.ticks)&&(this.frameTime=0,this.frameIndex++,this.frameIndex>=e.frames.length&&(this.frameIndex=e.loopStart??e.loopstart??0,this.animationEnded=!0,this.animationLooped=!0,this.animationCycleTime=e.frames.slice(0,this.frameIndex).reduce((s,r)=>s+Math.max(1,r.ticks),0)))}}execute(e){const t=pr(e).errors.find(s=>!s.message.includes("trigger1"));if(t)throw Error(t.message);const i=this._parameterCache;this._parameterCache=new WeakMap;try{return this.executeController(e)}finally{this._parameterCache=i}}executeController(e){var o,l,c,f,u;const t=e.type,i=(h,d=0)=>jt(this.value(e,h,d)),s=(h,d=0)=>ht(this.value(e,h,d)),r=(h,d=[0,0])=>this.vector(e,h,d),a=(h,d="")=>this.text(e,h,d);if(!No.has(t)){this.diagnostic("unsupported-controller",`Controller ${t||"(missing type)"} is not implemented.`,e);return}if(t!=="null"){if(t==="assertinput"){if(!((o=this.world)!=null&&o.manageInputs)){this.diagnostic("unsupported-input-routing","AssertInput needs the independent input scheduler.");return}for(const h of e.entries)if(/^flag\d*$/.test(h.key))for(const d of this.text(e,h.key).split(/[+|\s,]+/).filter(Boolean)){const p={up:"U",down:"D",forward:"F",fwd:"F",back:"B",start:"s"},_=p[d.toLowerCase()]||d;if(!["U","D","F","B","a","b","c","x","y","z","s"].includes(_)){this.diagnostic("unsupported-input",`Input flag ${d} is not implemented.`,e);continue}this.pendingAssertedInputs.add(_)}return}if(["displaytoclipboard","appendtoclipboard","clearclipboard"].includes(t)){if(t==="clearclipboard"){this.clipboard="";return}const h=Uu(e.values.text||""),d=e.values.params===void 0?[]:gn(e.values.params);if(d.length!==h.count)throw Error(`Clipboard format requires ${h.count} parameters, received ${d.length}.`);const p=Ou(h,d.map(_=>this.parameter(_,e,!0)));this.clipboard=(t==="appendtoclipboard"&&this.clipboard?this.clipboard+`
`+p:p).slice(-8192);return}if(t==="victoryquote"){if(!this.parent){const h=s("value",-1);h!==this.victoryQuoteIndex&&(this.victoryQuote=null),this.victoryQuoteIndex=h}return}if(t==="forcefeedback"){this.events.push({type:t,...ku(e.values)});return}if(t==="gamemakeanim"||t==="makedust"){if(t==="makedust"){const h=s("spacing",3);if(h<1)throw Error("MakeDust spacing must be at least 1.");const d=this._dustTicks.get(e);if((d==null?void 0:d.entry)===this._entrySerial&&this.gameTime-d.time<h)return;this._dustTicks.set(e,{entry:this._entrySerial,time:this.gameTime}),this.gameAnimation(120,r("pos"),!0,0,e),e.values.pos2!==void 0&&this.gameAnimation(120,r("pos2"),!0,0,e)}else this.gameAnimation(s("value",0),r("pos"),!!i("under"),Math.max(0,s("random")),e);return}if(t==="changestate"||t==="selfstate"){const h=s("value"),d=e.values.ctrl===void 0?void 0:s("ctrl"),p=e.values.anim===void 0?void 0:s("anim"),_=t==="selfstate"?this:this.stateOwner;_.program.states.has(h)&&p!==void 0&&p!==-1&&this.changeAnimation(p),this.changeState(h,d,_);return}if(t==="changeanim"||t==="changeanim2"){this.changeAnimation(s("value"),s("elem",1),t==="changeanim2"?this.stateOwner:this);return}if(t==="ctrlset"){this.ctrl=+Ht(i("value"));return}if(t==="statetypeset"){for(const[h,d]of[["statetype","stateType"],["movetype","moveType"],["physics","physics"]])if(e.values[h]!==void 0){const p=a(h).toUpperCase();p!=="U"&&(this[d]=p)}return}if(/^(vel|pos)(set|add|mul)$/.test(t)){const h=t.startsWith("vel")?this.vel:this.pos,d=t.slice(3);for(const p of["x","y"])if(e.values[p]!==void 0){const _=i(p)*(d==="mul"?1:this.coordinateScale);d==="set"?h[p]=_+(t==="posset"&&p==="x"&&((l=this.cameraPos)==null?void 0:l.x)||0):d==="add"?h[p]+=_*(t==="posadd"&&p==="x"?this.facing:1):h[p]*=_,(c=this.world)!=null&&c.orderedPhases&&(h[p]=Math.fround(h[p]))}return}if(t==="gravity"){this.vel.y+=this.constant("movement.yaccel")*this.coordinateScale;return}if(t==="turn"){this.facing*=-1;return}if(t==="posfreeze"){this.posFrozen=Ht(i("value",1));return}if(t==="helper"){if(!this.world)throw Error("Helper requires a match world.");this.world.spawnHelper(this,this.entityParameters(e));return}if(t==="projectile"){if(!this.world)throw Error("Projectile requires a match world.");const h=new Set(["velocity","remvelocity","accel","velmul","offset","postype","supermovetime","pausemovetime","ownpal","remappal"]),d=e.entries.filter(_=>!_.key.startsWith("proj")&&!_.key.startsWith("afterimage.")&&!h.has(_.key)),p=this.parseHitDef({...e,entries:d,values:Object.fromEntries(d.map(_=>[_.key,_.value]))});this.world.spawnProjectile(this,{...this.entityParameters(e,!0),hitDef:p});return}if(t==="pause"||t==="superpause"){if(!this.world)throw Error(`${t} requires a match world.`);const h=this.entityParameters(e);h.coordinateScale=this.coordinateScale,h.type=t,h.time??(h.time=t==="superpause"?30:0),h.animCommon=!/^s/i.test(e.values.anim||""),h.soundCommon=!/^s/i.test(e.values.sound||""),this.world.requestPause(this,h);return}if(t==="trans"){this.trans={mode:a("trans","default").toLowerCase(),alpha:r("alpha",[256,0])};return}if(t==="movehitreset"){this.moveContact=this.moveHit=this.moveGuarded=0;return}if(t==="attackdist"){this.attackDist=i("value"),this.hitDef&&(this.hitDef["guard.dist"]=this.attackDist*this.coordinateScale/(this.hitDef.coordinateScale??this.coordinateScale));return}if(t==="remappal"){const h=S=>{const T=r(S,[-1,0]);return[ht(T[0]),ht(T[1]??0)]},d=h("source"),p=h("dest"),_=d[0]===-1?"*":d.join(",");if(d[0]===-1&&p[0]===-1){this.paletteRemaps.clear();return}if(d[0]<-1||d[0]!==-1&&d[1]<0||p[0]<-1||p[0]!==-1&&p[1]<0)throw Error("Invalid RemapPal palette pair.");const m=p[0]===-1||d.join(",")===p.join(",");m||kc(this.character,d,p);const v=m&&this.paletteRemaps.has("*")&&d[0]!==-1;if(d[0]!==-1&&(!m||v)&&!this.paletteRemaps.has(_)&&this.paletteRemaps.size>=8){this.diagnostic("resource-limit","RemapPal supports at most 8 simultaneous mappings.",e);return}d[0]===-1&&this.paletteRemaps.clear(),v?this.paletteRemaps.set(_,d):m?this.paletteRemaps.delete(_):this.paletteRemaps.set(_,p);return}if(t==="fallenvshake"){const h=this.getHitVars["fall.envshake.time"]||0;h>0&&this.events.push({type:"envshake",time:h,coordinateScale:this.coordinateScale,...Object.fromEntries(["ampl","freq","phase"].map(d=>[d,this.getHitVars["fall.envshake."+d]]))}),this.getHitVars["fall.envshake.time"]=0;return}if(["varset","varadd","varmul","parentvarset","parentvaradd"].includes(t)){const h=t.startsWith("parent")?this.parent:this;if(!h||h.destroyed)return;let d=e.entries.filter(p=>/^(var|fvar|sysvar|sysfvar)\s*\(/.test(p.key));if(!d.length){const p=e.values.fv!==void 0?"fvar":"var";d=[{key:`${p}(${s(p==="fvar"?"fv":"v")})`,value:e.values.value??"0"}]}for(const p of d){const _=p.key.match(/^(var|fvar|sysvar|sysfvar)\s*\((.*)\)$/);if(!_)throw new Error(`Malformed variable target: ${p.key}`);const m=ht(this.parameter(_[2],e));let v=jt(this.parameter(p.value,e));v=_[1].includes("fvar")?Math.fround(v):ht(v)|0;const S=h.resolveTrigger(_[1],[m]);t.endsWith("add")&&(v+=S),t.endsWith("mul")&&(v*=S),h.assignVariable(_[1],[m],v)}return}if(t==="varrandom"){const h=s("v"),d=r("range",[0,1e3]),[p,_]=d.length===1?[0,ht(d[0])]:d.map(ht);if(p>_)throw Error("VarRandom range requires least_val <= greatest_val.");this.resolveTrigger("random"),this.assignVariable("var",[h],p+Math.floor((this._seed>>>0)/4294967296*(_-p+1)));return}if(t==="varrangeset"){const h=e.values.fvalue!==void 0,d=h?this.fvars:this.vars,p=si(s("first"),0,d.length-1),_=si(s("last",d.length-1),0,d.length-1),m=i(h?"fvalue":"value");for(let v=p;v<=_;v++)this.assignVariable(h?"fvar":"var",[v],m);return}if(t==="lifeadd"||t==="lifeset"){let h=s("value");t==="lifeadd"&&(h=-Ns(-h,null,this,{absolute:!!i("absolute")}),h+=this.life),this.life=si(h,i("kill",1)?0:1,this.maxLife);return}if(t==="poweradd"||t==="powerset"){this.power=si(s("value")+(t==="poweradd"?this.power:0),0,this.maxPower);return}if(t==="attackmulset"){this.attackMultiplier=i("value",1);return}if(t==="defencemulset"){this.defenceMultiplier=i("value",1);return}if(t==="sprpriority"){this.sprPriority=s("value");return}if(t==="screenbound"){this.screenBound=Ht(i("value",0));const[h,d]=r("movecamera");this.moveCamera={x:!!h,y:!!d};return}if(t==="playerpush"){this.playerPush=Ht(i("value",1));return}if(t==="width"){if(e.values.value!==void 0&&(e.values.player!==void 0||e.values.edge!==void 0))throw Error("Width value cannot be combined with player or edge.");const h=e.values.value===void 0?[0,0]:r("value"),[d=0,p=0]=r("player",h),_=r("edge",h);this.width={front:ht(d),back:ht(p),edge:[ht(_[0]??0),ht(_[1]??0)]};return}if(t==="assertspecial"){const h=new Set(["nowalk","nojump","nocrouch","noautoturn","invisible","noshadow","unguardable","noairguard","nostandguard","nocrouchguard","nojugglecheck","intro","roundnotover","timerfreeze","noko","nobardisplay","nobg","nofg"]);for(const d of["flag","flag2","flag3"])if(e.values[d]){const p=a(d).toLowerCase();this.asserted.add(p),h.has(p)||this.diagnostic("unsupported-flag",`AssertSpecial flag ${p} is not implemented.`,e)}return}if(t==="hitvelset"){i("x")&&(this.vel.x=(this.getHitVars.xvel||0)*this.coordinateScale),i("y")&&(this.vel.y=(this.getHitVars.yvel||0)*this.coordinateScale);return}if(t==="hitdef"){this.hitDef=null,this.reversalDef=null,this.hitDef=this.parseHitDef(e),this.events.push({type:"hitdef",hitDef:this.hitDef});return}if(t==="reversaldef"){if(this.reversalDef=null,e.values["reversal.attr"]===void 0)throw Error("ReversalDef requires reversal.attr.");if(!e.values["reversal.attr"].trim())return;_s(a("reversal.attr")),this.reversalDef=this.parseHitDef(e);return}if(t==="hitby"||t==="nothitby"){const h=["value","value2"].filter(_=>e.values[_]!==void 0);if(h.length!==1)throw Error(`${t} requires exactly one of value or value2.`);const d=s("time",1);if(d<-1||d>36e4)throw Error("Invalid hit-filter duration.");const p=_s(a(h[0]));this.hitFilters[h[0]==="value"?0:1]=d?{attribute:p,time:d,exclude:t==="nothitby"}:null;return}if(t==="hitoverride"){const h=s("slot"),d=s("time",1);if(h<0||h>7||d<-1||d>36e4)throw Error("HitOverride requires slot 0–7 and time -1 or greater.");if(!d||((f=e.values.attr)==null?void 0:f.trim())===""){this.hitOverrides.delete(h);return}if(e.values.attr===void 0||e.values.stateno===void 0)throw Error("HitOverride requires attr and stateno.");const p=a("attr"),_=_s(p);d?this.hitOverrides.set(h,{attr:p,attribute:_,stateNo:s("stateno"),time:d,forceAir:Ht(i("forceair"))}):this.hitOverrides.delete(h);return}if(rf.has(t)){if(t==="palfx"&&this.parent&&!this.ownPal)return;let h=this.effectParameters(e);if(["palfx","allpalfx","bgpalfx"].includes(t)&&(h=ur(h)),t==="playsnd"){const[d=0,p=0]=Array.isArray(h.value)?h.value:[h.value||0,0];Object.assign(h,{group:d,number:p,common:/^\s*f/i.test(e.values.value||""),volumeScale:h.volumescale,freqMul:h.freqmul})}this.events.push({type:t,...h,coordinateScale:this.coordinateScale,source:e.source,line:e.line});return}if(["explod","modifyexplod","removeexplod","explodbindtime"].includes(t)){this.explodController(e);return}if(t.startsWith("target")){const h=s("id",-1),d=this.targets.filter(E=>h===-1||(this.targetHitIds.get(E.id)??E.hitId)===h);if(t==="targetdrop"){const E=s("excludeid",-1),b=E<0?[]:this.targets.filter(g=>(this.targetHitIds.get(g.id)??g.hitId)===E);this.targets=i("keepone",1)?b.slice(0,1):b;const y=new Set(this.targets.map(g=>g.id));for(const g of this.targetHitIds.keys())y.has(g)||this.targetHitIds.delete(g);return}const p=["targetfacing","targetlifeadd","targetpoweradd","targetstate"].includes(t)?s("value"):void 0,_=t==="targetlifeadd"?i("kill",1):1,m=t==="targetlifeadd"?i("absolute"):0,v=t==="targetstate"&&e.values.ctrl!==void 0?i("ctrl"):void 0,S=t==="targetbind"?{pos:r("pos"),time:s("time",1)}:null,T=t==="targetvelset"||t==="targetveladd"?Object.fromEntries(["x","y"].filter(E=>e.values[E]!==void 0).map(E=>[E,i(E)*this.coordinateScale])):null;for(const E of d)if(t==="targetfacing")p&&(E.facing=this.facing*(p<0?-1:1));else if(t==="targetlifeadd"){const b=-Ns(-p,this,E,{absolute:!!m});E.life=si(E.life+b,_?0:1,E.maxLife)}else if(t==="targetpoweradd")E.power=si(E.power+p,0,E.maxPower);else if(t==="targetstate")E.changeState(p,v,this._scriptOwner||this.stateOwner);else if(S){const[b=0,y=0]=S.pos;E.bound={target:this,x:b*this.coordinateScale,y:y*this.coordinateScale,time:S.time}}else for(const[b,y]of Object.entries(T||{}))E.vel[b]=y+(t==="targetveladd"?E.vel[b]:0);return}if(["bindtoroot","bindtoparent","bindtotarget"].includes(t)){if(t!=="bindtotarget"&&!this.parent)return;const h=s("id",-1),d=t==="bindtoroot"?this.root:t==="bindtoparent"?this.parent:this.targets.find(v=>h<0||(this.targetHitIds.get(v.id)??v.hitId)===h);if(!d||d.destroyed){if(t==="bindtoparent"&&this.parent){this.bound=null;return}throw new Error(`${t} has no matching player`)}let p=[0,0],_,m;if(t==="bindtotarget"){const v=gn(e.values.pos||"0,0"),S=vn(v[2]||"foot").toLowerCase();if(v.length>3||!["foot","head","mid"].includes(S))throw Error("BindToTarget pos requires x, y, and Foot, Head or Mid.");[_,m]=v.slice(0,2).map(T=>jt(this.evaluate(T,e))),_??(_=0),m??(m=0),S!=="foot"&&(p=["x","y"].map(T=>d.constant(`size.${S}.pos.${T}`)*d.coordinateScale))}else[_=0,m=0]=r("pos");this.bound={target:d,x:_*this.coordinateScale+p[0],y:m*this.coordinateScale+p[1],time:s("time",1),facing:i("facing")};return}if(t==="hitadd"){const h=s("value");this.hitCount=Math.max(0,this.hitCount+h),this.uniqHitCount=Math.max(0,this.uniqHitCount+h);const d=this.targets.at(-1)||(((u=this.opponent)==null?void 0:u.moveType)==="H"?this.opponent:null);d&&(d.comboHits=Math.max(0,(d.comboHits||0)+h));return}if(t==="hitcount"){this.hitCount=s("value");return}if(t==="hitfallset"){if(e.values.value!==void 0){const h=s("value",-1);h!==-1&&(h&&!this.getHitVars.fall&&(this.getHitVars["fall.time"]=0),this.getHitVars.fall=+!!h)}e.values.xvel!==void 0&&(this.getHitVars["fall.xvel"]=i("xvel"),this._fallXVelocityDefined=!0),e.values.yvel!==void 0&&(this.getHitVars["fall.yvel"]=i("yvel"));return}if(t==="hitfallvel"){if(this.moveType!=="H")return;this._fallXVelocityDefined&&(this.vel.x=(this.getHitVars["fall.xvel"]||0)*this.coordinateScale),this.vel.y=(this.getHitVars["fall.yvel"]||0)*this.coordinateScale;return}if(t==="hitfalldamage"){if(this.moveType==="H"){const h=Ns(this.getHitVars["fall.damage"]||0,null,this);this.life=si(this.life-h,this.life>0&&this.getHitVars["fall.kill"]===0?1:0,this.maxLife),this.getHitVars["fall.damage"]=0}return}if(t==="angleadd"){this.angle+=i("value");return}if(t==="angleset"){this.angle=i("value");return}if(t==="anglemul"){this.angle*=i("value",1);return}if(t==="angledraw"){this.angleDraw=!0;const[h=1,d=1]=r("scale",[1,1]);this.drawScale={x:h,y:d},e.values.value&&(this.angle=i("value"));return}if(t==="offset"){this.drawOffset={x:i("x")*this.coordinateScale,y:i("y")*this.coordinateScale};return}if(t==="destroyself"){if(!this.parent){this.diagnostic("unsupported-controller","DestroySelf is valid only for helpers.",e);return}const h=!!i("recursive"),d=!!i("removeexplods");this.world?this.world.destroyHelper(this,{recursive:h,removeExplods:d}):(this.destroyed=!0,d&&(this.explods=this.drawExplods=[]));return}this.diagnostic("unsupported-controller",`Controller ${t} is not implemented.`,e)}}selectVictoryQuote(){if(this.parent||this.victoryQuote!==null)return this.victoryQuote;const e=this.program.quotes;if(!(e!=null&&e.size))return null;const t=[...e.keys()],i=e.has(this.victoryQuoteIndex)?this.victoryQuoteIndex:t[Math.floor(this.resolveTrigger("random")/1e3*t.length)];return this.victoryQuote=e.get(i)}gameAnimation(e,t,i,s,r){if(e<0)return;if(!this.commonAnimations.has(e)){this.diagnostic("missing-animation",`Common effect animation ${e} is unavailable. Import its fightfx resources.`,r);return}const a=()=>s?(this.resolveTrigger("random")/999-.5)*s:0;this.events.push({type:"gameanim",anim:e,under:i,common:!0,facing:this.facing,pos:{x:this.pos.x+((t[0]||0)*this.facing+a())*this.coordinateScale,y:this.pos.y+((t[1]||0)+a())*this.coordinateScale}})}effectParameters(e){const t={},i=new Set(["waveform","postype","trans","helpertype","name","space"]);for(const s of e.entries){if(/^(type|triggerall|trigger\d+|persistent|ignorehitpause)$/.test(s.key))continue;if(i.has(s.key)&&!/^-?[\d.]+$/.test(s.value)){t[s.key]=vn(s.value);continue}const a=gn(s.value).map(o=>{const l=o.trim().replace(/^[sSfF](?=[\d(-])/,"");return this.parameter(l,e)});t[s.key]=a.length===1?a[0]:a}return t}entityParameters(e,t=!1){const i=new Set(["velocity","remvelocity","accel","velmul","offset","postype","supermovetime","pausemovetime","ownpal","remappal"]),s=t?e.entries.filter(r=>r.key.startsWith("proj")||r.key.startsWith("afterimage.")||i.has(r.key)):e.entries;if(t){const r=new Set(["projid","projanim","projhitanim","projremanim","projcancelanim","projscale","projremove","projremovetime","projhits","projmisstime","projpriority","projsprpriority","projedgebound","projstagebound","projheightbound","projshadow"]);for(const a of s)a.key.startsWith("proj")&&!r.has(a.key)&&this.diagnostic("unsupported-projectile",`Projectile parameter ${a.key} is not implemented.`,{...e,line:a.line})}return{...this.effectParameters({...e,entries:s}),source:e.source,line:e.line}}createHelper(e,{id:t}={}){e.helpertype&&e.helpertype!=="normal"&&this.diagnostic("unsupported-helper","Player-type helpers are deprecated by MUGEN 1.1; using a normal helper.");const{pos:i,facing:s}=Wc(this,e),r={...this.program,constants:new Map(this.program.constants)};for(const[l,c]of Object.entries(e))if(l.startsWith("size.")){const f=_l(l)?this.coordinateScale/this.baseCoordinateScale:1,u=Array.isArray(c)?c.map(h=>h*f):c*f;r.constants.set(l,u),Array.isArray(u)&&(r.constants.set(l+".x",u[0]),r.constants.set(l+".y",u[1]))}const a=new Er(this.character,{program:r,expressionEvaluator:this.options.expressionEvaluator,commonAnimations:this.commonAnimations,world:this.world,id:t,position:i,facing:s,parent:this,root:this.root,helperId:Math.trunc(e.id||0),keyCtrl:!!e.keyctrl,ownPal:!!e.ownpal,teamSide:this.teamSide,pauseMoveTime:e.pausemovetime||0,superMoveTime:e.supermovetime||0});a.name=e.name||`${this.name}'s helper`,a.opponent=this.opponent,e.ownpal&&(a._paletteRemaps=Lo(this.paletteRemaps)),e.ownpal&&this.events.push({type:"palettesnapshot",target:a});const o=new Set(["id","name","stateno","postype","pos","facing","helpertype","keyctrl","ownpal","pausemovetime","supermovetime","remappal","source","line"]);for(const l of Object.keys(e))!o.has(l)&&!l.startsWith("size.")&&a.diagnostic("unsupported-helper",`Helper parameter ${l} is not implemented.`);if(e.ownpal&&e.remappal!==void 0)try{Do(a.paletteRemaps,a.character,e.remappal)}catch(l){a.diagnostic("palette",l.message)}return a.changeState(e.stateno??0)?(this.helpers.push(a),a):(a.destroyed=!0,a)}parseHitDef(e){var l,c;const t=e.values,i={serial:++this._hitSerial,coordinateScale:this.coordinateScale,stateOwner:this._scriptOwner||this.stateOwner},s=new Set(["attr","reversal.attr","hitflag","guardflag","animtype","air.animtype","fall.animtype","ground.type","air.type","affectteam","priority"]);for(const f of e.entries)if(!/^(type|triggerall|trigger\d+|persistent|ignorehitpause)$/.test(f.key)){if(f.key==="priority"){const[u,h="Hit"]=gn(f.value);i.priority=[ht(this.parameter(u,e)),vn(h)];continue}if(s.has(f.key)){i[f.key]=vn(f.value);continue}try{const u=gn(f.value).map(h=>this.parameter(h.trim().replace(/^[sSfF](?=[\d(-])/,""),e));i[f.key]=u.length===1?u[0]:u}catch{throw new Error(`HitDef parameter ${f.key} could not be evaluated; attack disabled.`)}}const r=(f,u)=>Array.isArray(i[f])?i[f]:i[f]===void 0?[...u]:[i[f],u[1]??0];i.attr=i.attr??`${this.stateType}, NA`,i.id=ht(i.id??0),i.chainid=ht(i.chainid??-1);const a=i.nochainid===void 0?[-1,-1]:Array.isArray(i.nochainid)?i.nochainid:[i.nochainid,-1];if(a.length>2)throw Error("HitDef nochainID takes at most two IDs.");i.nochainid=a.map(ht),i.hitonce=i.hitonce===void 0?+/^[SCA]\s*,\s*[NSH]T$/i.test(i.attr):+Ht(jt(i.hitonce)),i.damage=r("damage",[0,0]),i.pauseTime=r("pausetime",[0,0]),i.guardPauseTime=r("guard.pausetime",i.pauseTime),i.groundVelocity=r("ground.velocity",[0,0]),i.airVelocity=r("air.velocity",[0,0]),i.guardVelocity=r("guard.velocity",[i.groundVelocity[0],0]),i.airGuardVelocity=r("airguard.velocity",[i.airVelocity[0]*1.5,i.airVelocity[1]/2]),i.guardVelocity[1]=0,i["air.type"]??(i["air.type"]=i["ground.type"]??"high"),i.forcestand??(i.forcestand=+(i.groundVelocity[1]!==0)),i["down.velocity"]??(i["down.velocity"]=[...i.airVelocity]),i["down.hittime"]??(i["down.hittime"]=20),i["down.bounce"]??(i["down.bounce"]=0),i["ground.cornerpush.veloff"]??(i["ground.cornerpush.veloff"]=/^A\s*,/i.test(i.attr)?0:1.3*i.guardVelocity[0]);for(const f of["air","down","guard"])i[l=f+".cornerpush.veloff"]??(i[l]=i["ground.cornerpush.veloff"]);i["airguard.cornerpush.veloff"]??(i["airguard.cornerpush.veloff"]=i["guard.cornerpush.veloff"]),i.groundHitTime=i["ground.hittime"]??0,i.airHitTime=i["air.hittime"]??20,i.guardHitTime=i["guard.hittime"]??((c=this.world)!=null&&c.orderedPhases?i["ground.slidetime"]??0:i.groundHitTime),i["ground.slidetime"]??(i["ground.slidetime"]=0),i["guard.slidetime"]??(i["guard.slidetime"]=i.guardHitTime),i["guard.ctrltime"]??(i["guard.ctrltime"]=i["guard.slidetime"]),i["airguard.ctrltime"]??(i["airguard.ctrltime"]=i["guard.ctrltime"]),i.hitFlag=String(i.hitflag??"MAF").toUpperCase(),i.guardFlag=String(i.guardflag??"").toUpperCase(),i.fall=i.fall??0,i.kill=i.kill??1,i["guard.kill"]=i["guard.kill"]??1,i.source=e.source,i.line=e.line,i.juggleCost=this.juggleCost,i.juggleGroup=`${this.id}:${this._juggleSerial}`,i.sparkCommon=!/^s/i.test(t.sparkno||""),i.guardSparkCommon=!/^s/i.test(t["guard.sparkno"]||""),i.hitSoundCommon=!/^s/i.test(t.hitsound||""),i.guardSoundCommon=!/^s/i.test(t.guardsound||""),i.sparkno??(i.sparkno=this.constant("data.sparkno")),i["guard.sparkno"]??(i["guard.sparkno"]=this.constant("data.guard.sparkno"));const o=new Set(["attr","damage","pausetime","guard.pausetime","ground.velocity","air.velocity","guard.velocity","airguard.velocity","ground.hittime","air.hittime","guard.hittime","ground.slidetime","guard.slidetime","ground.ctrltime","guard.ctrltime","guardflag","hitflag","fall","forcenofall","kill","guard.kill","fall.kill","fall.damage","fall.xvelocity","fall.yvelocity","fall.recover","fall.recovertime","yaccel","animtype","air.animtype","ground.type","air.type","chainid","id","p1stateno","p2stateno","p2getp1state","p1facing","p1getp2facing","p2facing","p1sprpriority","p2sprpriority","numhits","getpower","givepower","priority","affectteam","guard.dist","down.velocity","down.hittime","air.fall","forcestand","air.juggle","fall.envshake.time","fall.envshake.ampl","fall.envshake.freq","fall.envshake.phase","sparkno","guard.sparkno","sparkxy","hitsound","guardsound","envshake.time","envshake.freq","envshake.ampl","envshake.phase","palfx.time","palfx.add","palfx.mul","palfx.sinadd","palfx.color","palfx.invertall"]);for(const f of["fall.animtype","mindist","maxdist","snap","ground.cornerpush.veloff","air.cornerpush.veloff","down.cornerpush.veloff","guard.cornerpush.veloff","airguard.cornerpush.veloff","airguard.ctrltime"])o.add(f);o.add("hitonce"),o.add("nochainid"),o.add("down.bounce");for(const f of e.entries)/^(type|triggerall|trigger\d+|persistent|ignorehitpause)$/.test(f.key)||o.has(f.key)||f.key==="reversal.attr"||this.diagnostic("unsupported-hitdef-parameter",`HitDef parameter ${f.key} is parsed but its engine behavior is not implemented.`,{...e,line:f.line});return i}receiveHit(e,t,{guarded:i=!1}={}){var ne,G,se,ge;if(!this.canBeHit(e,t))return{damage:0,guarded:!1,rejected:!0};const s=!i&&String(e[this.stateType==="A"?"air.type":"ground.type"]??e["ground.type"]??"high").toLowerCase()==="none",r=i?null:this.matchingHitOverride(e),a=e.p2getp1state===0?this:e.stateOwner||t;if(!s&&!i&&!r&&e.p2stateno>=0&&!(a!=null&&a.program.states.has(e.p2stateno)))return this.diagnostic("missing-state",`HitDef target state ${e.p2stateno} does not exist; hit rejected.`),{damage:0,guarded:!1,rejected:!0};Zu(this,e,t);const o=i?e.guardPauseTime:e.pauseTime,l=this.stateType,c=(t==null?void 0:t.facing)??-this.facing,f=this.facing;if(s)return yl(t,e,!1,{count:!1}),{damage:0,guarded:!1,typeNone:!0,cornerPush:0};this.explods=this.explods.filter(Se=>!Se.removeongethit),this.drawExplods=this.drawExplods.filter(Se=>!Se.removeongethit);const u=this.stateType==="A"||!!(r!=null&&r.forceAir),h=this.stateType==="L"&&!(r!=null&&r.forceAir),d=u&&!!this.getHitVars.fall,p=this.getHitVars,_=this.moveType==="H"&&!p.guarded,m=e[(i?u?"airguard":"guard":h?"down":u?"air":"ground")+".cornerpush.veloff"]||0;e.forcestand&&this.stateType==="C"&&(this.stateType="S");const v=jt(((ne=e.damage)==null?void 0:ne[i?1:0])||0),S=Math.max(0,Ns(v,t,this)),T=(G=this.world)==null?void 0:G.orderedPhases,E=(i?e["guard.kill"]:e.kill)===0?1:0,b=si((this._projectedLife??this.life)-S,E,this.maxLife);T?this._projectedLife=b:this.life=b;const y={},g=t&&e.p2facing?(T?-1:1)*c*(e.p2facing<0?-1:1):this.facing;t&&e.p2facing&&(T?y.facing=g:this.facing=g),t&&e.p1getp2facing?t.facing=g*(e.p1getp2facing<0?-1:1):t&&e.p1facing===-1&&(t.facing*=-1);const x=i?u?e.airGuardVelocity:e.guardVelocity:h&&e["down.velocity"]!==void 0?Array.isArray(e["down.velocity"])?e["down.velocity"]:[e["down.velocity"],0]:u?e.airVelocity:e.groundVelocity,I=e.coordinateScale??(t==null?void 0:t.coordinateScale)??this.coordinateScale,R=I/this.coordinateScale;let A=((x==null?void 0:x[0])||0)*R*-c*g,F=((x==null?void 0:x[1])||0)*R;const N=b<=0,P=N?nf(A,F,l,this.coordinateScale):{x:A,y:F};A=P.x,F=P.y;const k=i?e.guardHitTime:h&&F===0?e["down.hittime"]??20:u||F!==0||T&&e.fall?e.airHitTime??20:e.groundHitTime??0,H={light:0,medium:1,med:1,hard:2,back:3,up:4,diagup:5},B={high:1,low:2,trip:3,none:0};let C=B[String(e["ground.type"]||"high").toLowerCase()]??1;t&&(t.pos.x-this.pos.x)*f<0&&(C===1||C===2)&&(C=3-C);const L=e["air.animtype"]||e.animtype||"light",V=e["fall.animtype"]||(String(L).toLowerCase()==="up"?"up":"back"),$=N?1:i?0:+((!e.forcenofall||e.fall)&&!!p.fall||Ht(jt(u?e["air.fall"]??e.fall??0:e.fall||0)));if(this.getHitVars={animtype:H[String(d?V:u?L:e.animtype||"light").toLowerCase()]??0,groundtype:C,airtype:B[String(e["air.type"]||"high").toLowerCase()]??1,type:u?B[String(e["air.type"]||e["ground.type"]||"high").toLowerCase()]??1:C,damage:S,hitcount:i?0:(_&&p.hitcount||0)+1,fallcount:_&&p.fallcount||0,hitshaketime:(o==null?void 0:o[1])||0,hittime:k,slidetime:e[i?"guard.slidetime":"ground.slidetime"]??(i?k:0),ctrltime:(i&&u?e["airguard.ctrltime"]:void 0)??e[i?"guard.ctrltime":"ground.ctrltime"]??k,xvel:A,yvel:F,yaccel:e.yaccel===void 0?.35/this.coordinateScale:e.yaccel*R,xoff:0,yoff:0,guarded:+i,fall:$,hitid:e.id??0,chainid:Math.max(0,e.id??0),isbound:0,xveladd:0,yveladd:0,zoff:0,recovertime:h?Math.min(p.recovertime??this.constant("data.liedown.time"),this.constant("data.liedown.time")):this.constant("data.liedown.time"),"fall.time":T&&i&&p["fall.time"]||0,"fall.damage":e["fall.damage"]||0,"fall.xvel":e["fall.xvelocity"]===void 0?A:e["fall.xvelocity"]*R*-c*g,"fall.yvel":h&&!e["down.bounce"]&&F!==0?0:e["fall.yvelocity"]===void 0?-4.5/this.coordinateScale:e["fall.yvelocity"]*R,"fall.recover":N||T&&i?0:e["fall.recover"]??1,"fall.recovertime":e["fall.recovertime"]??4,"fall.kill":e["fall.kill"]??1,"fall.envshake.time":e["fall.envshake.time"]||0,"fall.envshake.freq":e["fall.envshake.freq"]??60,"fall.envshake.ampl":e["fall.envshake.ampl"]===void 0?-4/this.coordinateScale:e["fall.envshake.ampl"]*R,"fall.envshake.phase":e["fall.envshake.phase"]??0},this.comboHits=i?0:(_&&this.comboHits||0)+Math.max(0,Math.trunc(e.numhits??1)),this._fallXVelocityDefined=e["fall.xvelocity"]!==void 0,this.hitTime=Math.max(0,k||0)+(T&&!i&&k>0?1:0),this.hitPauseTime=T?0:Math.max(0,(o==null?void 0:o[1])||0),this.ctrl=0,this.moveType="H",this.hitId=e.id??0,this.hitSourceId=Fa(t),T||(this.vel={x:0,y:0}),this.cornerPush=0,t&&(!i||T)){const Se=I;for(const[ae,Le]of[["x",0],["y",1]]){const lt=ae==="x"?t.facing:1;let Re=(this.pos[ae]-t.pos[ae])*lt/Se;const Ve=i?ae==="x"?["mindist","maxdist"]:[]:["mindist","maxdist","snap"];for(const ee of Ve)if(e[ee]!==void 0){const Ee=Array.isArray(e[ee])?e[ee][Le]:Le===0?e[ee]:void 0;if(Ee===void 0)continue;Re=ee==="mindist"?Math.max(Re,Ee):ee==="maxdist"?Math.min(Re,Ee):Ee}const Xe=t.pos[ae]+Re*lt*Se;T?Ve.some(ee=>e[ee]!==void 0)&&(y[ae]=Math.fround(Xe)):this.pos[ae]=Xe}}T&&Object.keys(y).length&&(this._pendingHitTransform=y);const ie=r?r.stateNo:!i&&e.p2stateno>=0?e.p2stateno:i&&!N?u?154:this.stateType==="C"?152:150:h?5080:!u&&this.getHitVars.groundtype===3?5070:u?5020:this.stateType==="C"?5010:5e3;if(r!=null&&r.forceAir&&(this.stateType="A"),this.changeState(ie,void 0,!i&&!r&&e.p2stateno>=0?a:this)||(this.moveType="H",this.vel={x:A*this.coordinateScale,y:F*this.coordinateScale},this.diagnostic("missing-hit-state",`Hit state ${ie} is missing; full hit reaction cannot execute.`)),this.moveType="H",t){yl(t,e,i),t.hitPauseTime=Math.max(t.hitPauseTime,(o==null?void 0:o[0])||0),t.targets.includes(this)||t.targets.push(this),(se=t.targetHitIds)==null||se.set(this.id,e.id??0);const{get:Se,give:ae}=tf(e,(ge=this.world)==null?void 0:ge.combatRules);T?this.world.pendingCombatEffects.push({defender:this,attacker:t,damage:S,minimum:E,get:Se[i?1:0]||0,give:ae[i?1:0]||0}):(t.power=si(t.power+(Se[i?1:0]||0),0,t.maxPower),this.power=si(this.power+(ae[i?1:0]||0),0,this.maxPower))}return t&&(t.sprPriority=e.p1sprpriority??1,this.sprPriority=e.p2sprpriority??0,!i&&e.p1stateno>=0&&t.changeState(e.p1stateno,void 0,e.stateOwner||t.stateOwner)),this.events.push({type:"hit",damage:S,guarded:i,attacker:t==null?void 0:t.id}),{damage:S,guarded:i,cornerPush:m}}attributeMatches(e,t){return Kr(e,t)}matchingHitOverride(e){for(let t=0;t<8;t++){const i=this.hitOverrides.get(t);if(i!=null&&i.time&&Kr(i.attribute||i.attr,e.attr))return i}return null}canBeHit(e,t){var s;if(!Ku(this,e,t)||(s=this.world)!=null&&s.isSuperUnhittable(this))return!1;for(const r of this.hitFilters)if(r!=null&&r.time&&!qu(r,e.attr))return!1;return!(String(e[this.stateType==="A"?"air.type":"ground.type"]??e["ground.type"]??"high").toLowerCase()==="none")&&this.matchingHitOverride(e)&&(e.p1stateno>=0||e.p2getp1state===1||e.p2stateno>=0&&e.p2getp1state!==0)?!1:!this.asserted.has("unhittable")}explodController(e){return Gu(this,e)}updateExplods(e={}){return Wu(this,e)}updateBinding(){const e=this.bound;if(e){if(e.target.destroyed){this.bound=null;return}this.pos.x=e.target.pos.x+e.x*e.target.facing,this.pos.y=e.target.pos.y+e.y,e.facing&&(this.facing=e.target.facing*(e.facing<0?-1:1)),e.time>0&&--e.time===0&&(this.bound=null)}}}const Rn=(n,e=[0,0])=>Array.isArray(n)?[Number(n[0]??e[0]),Number(n[1]??e[1])]:n===void 0?[...e]:[Number(n),e[1]];class as{constructor(e,t,{id:i}={}){var o;this.creator=e,this.owner=e.root||e,this.root=this.owner,this.isProjectile=!0,this.world=e.world,this.id=i,this.projId=Math.max(0,Math.trunc(t.projid??0)),this.teamSide=e.teamSide,this.character=e.character,this.coordinateScale=e.coordinateScale,this.baseCoordinateScale=this.coordinateScale,this.paletteParent=hr(e),this.guardDistance=e.constant("size.proj.attack.dist")*e.coordinateScale,this.animations=e.animations,this.program={...e.program,constants:new Map(e.program.constants)},this.spec=t,this.events=[],this.diagnostics=[],this.asserted=new Set,Number(t.projid)<0&&this.diagnostic("projectile-id","Negative ProjID was clamped to 0."),Object.assign(this,Wc(e,t,!0));const s=Rn(t.projscale,[1,1]),r=e.constant("size.proj.doscale")!==0;this.program.constants.set("size.xscale",s[0]*(r?e.constant("size.xscale"):1)),this.program.constants.set("size.yscale",s[1]*(r?e.constant("size.yscale"):1)),this.program.constants.set("size.draw.offset.x",0),this.program.constants.set("size.draw.offset.y",0);const a=Rn(t.velocity);if(this.vel={x:a[0]*this.coordinateScale,y:a[1]*this.coordinateScale},this.accel=Rn(t.accel).map(l=>l*this.coordinateScale),this.velmul=Rn(t.velmul,[1,1]),this.anim=Math.trunc(t.projanim??0),this.frameIndex=0,this.frameTime=0,this.collisionFrame=null,this.hitDef=t.hitDef,this.proximityHitDef=t.hitDef,this.hitPauseTime=0,this.hitCount=0,this.moveType="A",this.stateType=(((o=this.hitDef)==null?void 0:o.attr)||"S")[0].toUpperCase(),this.priority=Math.max(1,Math.trunc(t.projpriority??1)),this.sprPriority=t.projsprpriority??3,this.remainingHits=Math.max(0,Math.trunc(t.projhits??1)),this.missTime=Math.max(0,Math.trunc(t.projmisstime??0)),this.pauseMoveTime=Math.max(0,t.pausemovetime||0),this.superMoveTime=Math.max(0,t.supermovetime||0),this.ownPal=!!t.ownpal,this.time=0,this.removing=!1,this.removed=!1,this.activeTicks=0,this.nextHitAge=0,this.drawVisible=!0,this._inTick=!1,this._paletteRemaps=Lo(e.paletteRemaps),this.ownPal&&t.remappal!==void 0)try{Do(this._paletteRemaps,this.character,t.remappal)}catch(l){this.diagnostic("palette",l.message)}this.attackMultiplier=e.attackMultiplier,this.animations.has(this.anim)||(this.diagnostic("missing-animation",`Projectile animation ${this.anim} does not exist.`),this.removed=!0)}get currentFrame(){var e;return((e=this.animations.get(this.anim))==null?void 0:e.frames[this.frameIndex])||null}get life(){return this.removed||this.removing?0:1}get power(){return this.owner.power}set power(e){this.owner.power=e}get maxPower(){return this.owner.maxPower}get targets(){return this.owner.targets}get targetHitIds(){return this.owner.targetHitIds}get paletteRemaps(){return this.ownPal?this._paletteRemaps:this.paletteParent.paletteRemaps}constant(e){const t=this.program.constants.get(e);return Array.isArray(t)?t[0]:t}changeState(){return this.diagnostic("unsupported-projectile","A projectile cannot enter a player state."),!1}diagnostic(e,t){this.diagnostics.some(i=>i.message===t)||this.diagnostics.push({type:e,message:t,source:this.spec.source,line:this.spec.line})}record(e){var i;const t=this.owner.projectileHistory;t.push({type:e,projId:this.projId,tick:((i=this.world)==null?void 0:i.ticks)??this.time});for(let s=t.length-2;s>=0;s--)t[s].type===e&&t[s].projId===this.projId&&t.splice(s,1);t.length>4096&&(t.shift(),this.diagnostic("resource-limit","Projectile history exceeded 4096 distinct ID/event pairs."))}canHit(){return!this.removed&&!this.removing&&!!this.hitDef&&this.activeTicks>=this.nextHitAge&&this.remainingHits>0}onContact({guarded:e=!1,defer:t=!1}={}){this.record(e?"guarded":"hit"),this._contactPending=!0,this.hitPauseTime>0&&(this._holdCollisionFrame=!0),t||this.finishContacts()}finishContacts(){var e;this._contactPending&&(this._contactPending=!1,this.remainingHits--,this.nextHitAge=this.activeTicks+((e=this.world)!=null&&e.orderedPhases?Math.max(1,this.missTime):this.missTime+1),this.spec.projremove!==0&&this.remainingHits<=0&&this.remove("hit"))}cancel(){!this.removing&&!this.removed&&(this.record("cancel"),this.hitPauseTime=0,this.remove("cancel"))}clash(e){var t,i;this.priority>e.priority?this.priority--:this.remainingHits--,this.remainingHits<=0?this.cancel():this.hitPauseTime=Math.max(this.hitPauseTime,((i=(t=this.hitDef)==null?void 0:t.pauseTime)==null?void 0:i[0])||0)}remove(e="expire"){if(!(this.removing||this.removed)){if(this.removing=!0,this.hitDef=null,this.removalReason=e,this._removeAtLoopEnd=this._loopedThisTick,this.hitPauseTime>0){this._holdCollisionFrame=!0;return}this.beginRemoval()}}beginRemoval(){var l;this.removalStarted=!0;const e=this.removalReason,t=this.spec.projhitanim??-1,i=this.spec.projremanim??t,s=e==="hit"?t:e==="cancel"?this.spec.projcancelanim??i:i,r=Rn(this.spec.remvelocity);if(this.vel={x:r[0]*this.coordinateScale,y:r[1]*this.coordinateScale},s<0){this.removed=!0,this.drawVisible=!1;return}let a=!1;if(this.animations.has(s)?Math.trunc(s)!==this.anim&&(a=!0,this._loopedThisTick=!1,this.anim=Math.trunc(s),this.frameIndex=this.frameTime=0):this.diagnostic("missing-animation",`Projectile removal animation ${s} does not exist; retaining action ${this.anim}.`),(a||!this.collisionFrame)&&(this.collisionFrame=this.currentFrame,this.collisionAnimation=this.animations.get(this.anim),this.collisionFrameIndex=this.frameIndex,this.collisionFrameTime=this.frameTime),!a&&this._removeAtLoopEnd&&this._inTick){this.removed=!0,this.drawVisible=!1;return}const o=((l=this.animations.get(this.anim))==null?void 0:l.frames)||[];if(o.some(c=>c.ticks<0)||o.reduce((c,f)=>c+f.ticks,0)<=0){this.removed=!0,this.drawVisible=!1;return}this.drawVisible=!!this.collisionFrame,a&&!this._inTick?this.advanceFrame():!a&&!this._inTick&&this._loopedThisTick&&(this.removed=!0)}advanceFrame(){const e=this.currentFrame,t=this.animations.get(this.anim);e&&e.ticks>=0&&++this.frameTime>=Math.max(1,e.ticks)&&(this.frameTime=0,this.frameIndex++,this.frameIndex>=t.frames.length&&(this._loopedThisTick=!0,this.animationLooped=!0,this.removing&&(this.removed=!0),this.frameIndex=t.loopStart||0))}tick({paused:e=!1}={}){var t,i,s,r;if(this.events=[],this._activeThisTick=!1,this.removed){this.drawVisible=!1;return}if(!e){if(this.drawVisible=!0,this._holdCollisionFrame||this.captureFrame(),this.hitPauseTime>0){this.hitPauseTime--;return}if(this._holdCollisionFrame=!1,this._inTick=!0,this._loopedThisTick=!1,this.removing&&!this.removalStarted&&this.beginRemoval(),!this.removing){const a=Rn(this.spec.projheightbound,[-240/this.coordinateScale,1/this.coordinateScale]).map(_=>_*this.coordinateScale),o=(this.spec.projedgebound??40/this.coordinateScale)*this.coordinateScale,l=(this.spec.projstagebound??40/this.coordinateScale)*this.coordinateScale,c=((t=this.world)==null?void 0:t.leftBound)??-160,f=((i=this.world)==null?void 0:i.rightBound)??160,u=((s=this.world)==null?void 0:s.view.left)??c,h=((r=this.world)==null?void 0:r.view.right)??f,d=this.spec.projremovetime??-1,p=this.vel.x*this.facing;(d>=0&&this.time>=d||d<=-2&&this.animationLooped||this.pos.x<u-o||this.pos.x>h+o||p<0&&this.pos.x<c-l||p>0&&this.pos.x>f+l||this.vel.y<0&&this.pos.y<a[0]||this.vel.y>0&&this.pos.y>a[1])&&this.remove()}this.removed||(this.captureFrame(),this._activeThisTick=!0,this.activeTicks++,this.pos.x+=this.vel.x*this.facing,this.pos.y+=this.vel.y,this.removing||(this.vel.x=(this.vel.x+this.accel[0])*this.velmul[0],this.vel.y=(this.vel.y+this.accel[1])*this.velmul[1]),this.advanceFrame(),this.time++),this._inTick=!1}}finishMovementAllowance({paused:e=!1}={}){var t,i,s;if(!(e||!this._activeThisTick||this._hitPausedThisTick||this.hitPauseTime>0)){if((t=this.world)!=null&&t.orderedPhases){((i=this.world.pause)==null?void 0:i.remaining)>0&&(this.pauseMoveTime=Math.max(0,this.pauseMoveTime-1)),((s=this.world.superPause)==null?void 0:s.remaining)>0&&(this.superMoveTime=Math.max(0,this.superMoveTime-1));return}this.pauseMoveTime=Math.max(0,this.pauseMoveTime-1),this.superMoveTime=Math.max(0,this.superMoveTime-1)}}captureFrame(){this.collisionFrame=this.currentFrame,this.collisionAnimation=this.animations.get(this.anim),this.collisionFrameIndex=this.frameIndex,this.collisionFrameTime=this.frameTime}}const vi=(n,e,t)=>Math.max(e,Math.min(t,n)),$n=(n,e=0)=>n===void 0||n===""?e:Number(n),vt=(n,e=[0,0])=>n===void 0?[...e]:String(n).split(",").map((t,i)=>$n(t.trim(),e[i]??0)),mr=n=>String(n??"").replace(/^"(.*)"$/,"$1"),af=new Set(["normal","anim","parallax","dummy"]),of=new Set(["null","anim","visible","enable","posset","posadd","velset","veladd","sinx","siny"]);function lf(n){var t,i;const e=[];for(const s of Object.keys(n).filter(r=>r.endsWith(".def"))){const r=bn(n[s]),a=kr(r);if(a.bgdef)try{e.push(cf(s,n,r,a))}catch(o){e.push({path:s,name:((t=a.info)==null?void 0:t.displayname)||((i=a.info)==null?void 0:i.name)||s,files:n,invalid:!0,diagnostics:[{source:s,line:0,type:"stage",message:o.message}]})}}return e}function cf(n,e,t=bn(e[n]),i=kr(t)){var x,I,R,A,F;const s=[],r=(N,P,k="stage")=>s.push({source:n,line:(P==null?void 0:P.line)||0,type:k,message:N}),a=n.slice(0,n.lastIndexOf("/")+1),o=n.indexOf("/stages/"),l=o>=0?n.slice(0,o+1):"",c=N=>{const P=[...new Set([a,l,""])],k=String(N).replaceAll("\\","/").split("/").at(-1),B=P.map(C=>{try{return Jn(N,C,!0)}catch{return null}}).find(C=>C&&e[C]);if(B)return B;if(k&&k!=="."&&k!=="..")try{const C=Jn(k,a);if(e[C])return C}catch{}return null},f=vt((x=i.stageinfo)==null?void 0:x.localcoord,[320,240]);if(f.length!==2||f.some(N=>!Number.isFinite(N)||N<=0))throw Error("Invalid stage localcoord.");const u=320/f[0],h=i.camera||{},d=i.playerinfo||{},p=i.bound||{},_=i.stageinfo||{},m=(N,P,k)=>{const H=$n(N[P],k);if(!Number.isFinite(H))throw Error(`Invalid stage numeric value ${P}.`);return H},v={startX:m(h,"startx",0)*u,startY:m(h,"starty",0)*u,left:m(h,"boundleft",0)*u,right:m(h,"boundright",0)*u,high:m(h,"boundhigh",-25)*u,low:m(h,"boundlow",0)*u,tension:Math.max(0,m(h,"tension",60)*u),floorTension:m(h,"floortension",0)*u,verticalFollow:vi(m(h,"verticalfollow",.2),0,1),zoomIn:m(h,"zoomin",1),zoomOut:m(h,"zoomout",1),startZoom:m(h,"startzoom",1)};if(v.left>v.right||v.high>v.low||v.zoomOut<=0||v.zoomIn<v.zoomOut)throw Error("Invalid stage camera bounds or zoom limits.");const S=i.bgdef.spr?c(i.bgdef.spr):null;S||r(`Stage sprite file is missing: ${i.bgdef.spr||"(unspecified)"}`);const T=i.music||{},E=T.bgmvolume!==void 0?m(T,"bgmvolume",100):100*(1+vi(m(T,"bgvolume",0),-255,255)/256),b={path:n,name:((I=i.info)==null?void 0:I.displayname)||((R=i.info)==null?void 0:R.name)||n,files:e,def:i,localcoord:f,coordinateScale:u,camera:v,sprite:S?{path:S}:null,animations:Fc(t),elements:[],controllers:[],diagnostics:s,leftBound:m(d,"leftbound",-1e3)*u,rightBound:m(d,"rightbound",1e3)*u,starts:[1,2].map(N=>({x:m(d,`p${N}startx`,N===1?-70:70)*u,y:m(d,`p${N}starty`,0)*u,facing:m(d,`p${N}facing`,N===1?1:-1)<0?-1:1})),screenLeft:Math.max(0,m(p,"screenleft",15)*u),screenRight:Math.max(0,m(p,"screenright",15)*u),zoffset:m(_,"zoffset",200)*u,resetBG:m(_,"resetbg",1)!==0,autoturn:m(_,"autoturn",1)!==0,xscale:m(_,"xscale",1),yscale:m(_,"yscale",1),backgroundScale:m(_,"hires",0)!==0?.5:1,zoffsetlink:_.zoffsetlink===void 0?null:m(_,"zoffsetlink",0),cropHigh:Math.max(0,m(h,"cuthigh",0)*u),cropLow:Math.max(0,m(h,"cutlow",0)*u),music:{path:T.bgmusic?c(T.bgmusic):null,requested:T.bgmusic||"",volume:E,loop:m(T,"bgmloop",1)!==0,loopStart:m(T,"bgmloopstart",0),loopEnd:m(T,"bgmloopend",0)}};if(b.shadow={intensity:vi(m(i.shadow||{},"intensity",128),0,256),color:vt((A=i.shadow)==null?void 0:A.color,[0,0,0]),yscale:m(i.shadow||{},"yscale",.4),fade:(F=i.shadow)!=null&&F["fade.range"]?vt(i.shadow["fade.range"]):null},b.reflection=vi(m(i.reflection||{},"intensity",0),0,256),b.leftBound>=b.rightBound)throw Error("Invalid stage player bounds.");b.music.requested&&!b.music.path&&r(`Stage music is missing: ${b.music.requested}`);let y={ids:null,loop:-1};const g=new Set(["type","spriteno","actionno","id","layerno","start","delta","trans","alpha","mask","velocity","tile","tilespacing","positionlink","sin.x","sin.y","window","maskwindow","windowdelta","xscale","width","yscalestart","yscaledelta","scalestart","scaledelta","zoomdelta"]);for(const N of Qc(t,n)){const P=N.values;if(/^bgctrldef(?:\s|$)/.test(N.name))y={ids:P.ctrlid===void 0?null:vt(P.ctrlid,[]),loop:m(P,"looptime",-1)};else if(/^bgctrl(?:\s|$)/.test(N.name)){const k=mr(P.type).toLowerCase();if(!of.has(k)){r(`Background controller ${k} is not implemented.`,N,"unsupported-stage-controller");continue}const H=vt(P.time,[0]);for(const[B,C]of Object.entries(P))if(B!=="type"&&vt(C,[]).some(L=>!Number.isFinite(L)))throw Error(`Invalid background controller ${B} at line ${N.line}.`);b.controllers.push({type:k,time:[H[0],H[1]??H[0],H[2]??-1],groupLoop:y.loop,ids:P.ctrlid===void 0?y.ids:vt(P.ctrlid,[]),values:P,line:N.line})}else if(/^bg(?:\s|$)/.test(N.name)){const k=mr(P.type||"normal").toLowerCase();if(!af.has(k)){r(`Background type ${k} is not implemented.`,N,"unsupported-stage");continue}const H=k==="anim"||k==="parallax"&&P.actionno!==void 0,B=mr(P.trans||"default").toLowerCase(),C={type:k,animated:H,id:m(P,"id",0),layer:m(P,"layerno",0),start:vt(P.start),delta:vt(P.delta,[1,1]),velocity:vt(P.velocity),spriteno:vt(P.spriteno),anim:m(P,"actionno",0),mask:H||m(P,"mask",["add","sub"].includes(B)?1:0)!==0,trans:B,alpha:vt(P.alpha,B==="addalpha"?[256,0]:[256,256]),tile:vt(P.tile),spacing:vt(P.tilespacing),link:m(P,"positionlink",0)!==0,sinX:vt(P["sin.x"],[0,0,0]),sinY:vt(P["sin.y"],[0,0,0]),xscale:vt(P.xscale,[1,1]),width:P.width===void 0?null:vt(P.width),yScaleStart:m(P,"yscalestart",100)/100,yScaleDelta:m(P,"yscaledelta",0)/100,scaleStart:vt(P.scalestart,[1,1]),scaleDelta:vt(P.scaledelta),zoomDelta:m(P,"zoomdelta",1),window:P.maskwindow?vt(P.maskwindow,[]):P.window?vt(P.window,[]):null,windowCentered:!!P.maskwindow,windowDelta:vt(P.windowdelta),transSpecified:P.trans!==void 0,line:N.line};for(const[L,V]of Object.entries(C))if(Array.isArray(V)&&V.some($=>!Number.isFinite($)))throw Error(`Invalid background ${L} at line ${N.line}.`);for(const L of["start","delta","velocity","spriteno","alpha","tile","spacing","xscale","scaleStart","scaleDelta","windowDelta"])if(C[L].length!==2)throw Error(`Invalid background ${L} at line ${N.line}.`);if(C.width&&C.width.length!==2||C.window&&C.window.length!==4)throw Error(`Invalid background dimensions at line ${N.line}.`);if(H&&!b.animations.some(L=>L.id===C.anim)&&r(`Stage action ${C.anim} is missing.`,N),H&&C.tile.some((L,V)=>L&&C.spacing[V]<=0)&&k!=="parallax"&&r("Animated background tiling requires positive tilespacing.",N),k==="parallax"&&P.xscale!==void 0&&(H||C.width))throw Error(`Parallax xscale cannot be combined with width or animation at line ${N.line}.`);for(const L of Object.keys(P))g.has(L)||r(`Background parameter ${L} is not implemented.`,N,"unsupported-stage-parameter");b.elements.push(C)}}if(b.elements.length>2048||b.controllers.length>4096)throw Error("Stage background/controller limit exceeded.");return b}function wl(n,e){return n[1]>0?n[0]*Math.sin(2*Math.PI*e/n[1]+(n[2]||0)*Math.PI/180):0}class hf{constructor(e){if(e.invalid)throw Error(e.diagnostics[0].message);this.definition=e,this.animations=new Map(e.animations.map(t=>[t.id,t])),this.diagnostics=[...e.diagnostics],this.reset()}reset({backgrounds:e=!0}={}){const t=this.definition;this.camera={x:vi(t.camera.startX,t.camera.left,t.camera.right),y:vi(t.camera.startY,t.camera.high,t.camera.low),zoom:vi(t.camera.startZoom,t.camera.zoomOut,t.camera.zoomIn)},(e||!this.elements)&&(this.time=0,this.elements=t.elements.map(i=>({...i,start:[...i.start],motion:[0,0],velocity:[...i.velocity],sinX:[...i.sinX],sinY:[...i.sinY],sinStartX:0,sinStartY:0,anim:i.anim,frameIndex:0,frameTime:0,visible:!0,enabled:!0})))}updateCamera(e){e=e.filter(a=>!a.destroyed&&!a.isProjectile);const t=this.definition,i=t.camera,s=e.filter(a=>{var o;return((o=a.moveCamera)==null?void 0:o.x)!==!1}),r=e.filter(a=>{var o;return((o=a.moveCamera)==null?void 0:o.y)!==!1});if(s.length){const a=Math.min(...s.map(u=>u.pos.x)),o=Math.max(...s.map(u=>u.pos.x));this.camera.zoom=vi(320/Math.max(1,o-a+2*i.tension),i.zoomOut,i.zoomIn);const l=Math.max(1,160/this.camera.zoom-i.tension),c=o-l,f=a+l;this.camera.x=vi(c<=f?vi(this.camera.x,c,f):(a+o)/2,i.left,i.right)}r.length&&(this.camera.y=vi(Math.min(0,Math.min(...r.map(a=>a.pos.y))+i.floorTension)*i.verticalFollow,i.high,i.low))}view(e=16/9){const t=this.definition,i=t.cropHigh+t.cropLow?320/e:t.localcoord[1]*t.coordinateScale,s=Math.max(0,t.localcoord[1]*t.coordinateScale-i),r=t.cropHigh+t.cropLow?t.cropHigh/(t.cropHigh+t.cropLow):.5;let a=t.zoffset;if(t.zoffsetlink!==null){const f=this.elements.findIndex(u=>u.id===t.zoffsetlink);f>=0&&(a=this.position(f).y*t.coordinateScale)}const o=a-s*r,l=320/this.camera.zoom,c=i/this.camera.zoom;return{left:this.camera.x-l/2,right:this.camera.x+l/2,top:this.camera.y-o/this.camera.zoom,bottom:this.camera.y+(i-o)/this.camera.zoom,width:l,height:c,displayHeight:i,groundY:o,zoffset:a,cropTop:s*r,zoom:this.camera.zoom}}position(e){let t=0,i=0,s=[1,1],r=0;for(let a=e;a>=0&&r++<2048;a--){const o=this.elements[a];if(t+=o.start[0]+o.motion[0]+wl(o.sinX,this.time-o.sinStartX),i+=o.start[1]+o.motion[1]+wl(o.sinY,this.time-o.sinStartY),s=o.delta,!o.link)break}return{x:t,y:i,delta:s}}tick({paused:e=!1}={}){if(!e){for(const t of this.definition.controllers){let i=t.groupLoop>0?this.time%t.groupLoop:this.time;if(t.time[2]>0&&(i%=t.time[2]),!(i<t.time[0]||i>t.time[1]))for(const s of this.elements){if(t.ids&&!t.ids.includes(s.id)&&!t.ids.includes(-1))continue;const r=t.values;if(t.type==="visible")s.visible=$n(r.value,1)!==0;else if(t.type==="enable")s.enabled=$n(r.value,1)!==0;else if(t.type==="anim")s.anim=$n(r.value,0),s.frameIndex=s.frameTime=0;else if(t.type==="sinx"||t.type==="siny"){const a=t.type==="sinx"?"sinX":"sinY";s[a]=vt(r.value,[0,0,0]),s[a==="sinX"?"sinStartX":"sinStartY"]=this.time}else if(/^(pos|vel)(set|add)$/.test(t.type)){for(const[a,o]of[["x",0],["y",1]])if(r[a]!==void 0){const l=$n(r[a]),c=t.type.startsWith("pos")?s.motion:s.velocity;t.type.endsWith("set")?c[o]=l-(c===s.motion?s.start[o]:0):c[o]+=l}}}}for(const t of this.elements)if(t.enabled){for(let r=0;r<2;r++)t.motion[r]+=t.velocity[r];t.drawFrameIndex=t.frameIndex,t.drawFrameTime=t.frameTime;const i=this.animations.get(t.anim),s=i==null?void 0:i.frames[t.frameIndex];t.animated&&s&&s.ticks>=0&&++t.frameTime>=Math.max(1,s.ticks)&&(t.frameTime=0,++t.frameIndex>=i.frames.length&&(t.frameIndex=i.loopStart||0))}this.time++}}frame(e){var t;return e.animated?(t=this.animations.get(e.anim))==null?void 0:t.frames[e.drawFrameIndex??e.frameIndex]:{group:e.spriteno[0],number:e.spriteno[1],x:0,y:0,flip:"",ticks:-1}}variable(e){var a;const[t,...i]=String(e).toLowerCase().split("."),s=(a=this.definition.def[t])==null?void 0:a[i.join(".")];if(s===void 0)throw Error(`StageVar ${e} is not implemented or missing.`);const r=Number(s);return Number.isFinite(r)?r:mr(s)}}const uf=n=>{if(n[0].life<=0&&n[1].life<=0)return"draw";if(n[0].life<=0)return"opponent";if(n[1].life<=0)return"player";const e=n[0].life*n[1].maxLife-n[1].life*n[0].maxLife;return e===0?"draw":e>0?"player":"opponent"};class ff{constructor({roundsToWin:e=2,roundTime:t=99,preIntro:i=30,introHold:s=30,overTime:r=60,resultTime:a=90,autoAdvance:o=!0}={}){for(const[l,c]of Object.entries({roundsToWin:e,roundTime:t,preIntro:i,introHold:s,overTime:r,resultTime:a}))if(!Number.isFinite(c)||c<0)throw Error(`Invalid match rule ${l}.`);if(e<1||e>99||t>3600)throw Error("Match rule exceeds supported bounds.");this.rules={roundsToWin:Math.trunc(e),roundTime:t,preIntro:Math.trunc(i),introHold:Math.trunc(s),overTime:Math.trunc(r),resultTime:Math.trunc(a),autoAdvance:o},this.roundNo=1,this.roundsExisted=0,this.wins={player:0,opponent:0},this.matchOver=!1,this.roundWinner=null,this.reason=null,this.startRound()}startRound(){this.roundState=0,this.phaseTime=0,this.timeLeft=this.rules.roundTime?Math.round(this.rules.roundTime*60):-1,this.roundWinner=null,this.reason=null,this._awarded=!1}step({players:e,paused:t=!1,intro:i=!1,roundNotOver:s=!1,timerFreeze:r=!1,noKO:a=[!1,!1]}={}){const o=[];if(t)return o;if(this.roundState===0)return++this.phaseTime>=this.rules.preIntro&&(this.roundState=1,this.phaseTime=0),o;if(this.roundState===1)return this.phaseTime++,!i&&this.phaseTime>=this.rules.introHold&&(this.roundState=2,this.phaseTime=0,o.push({type:"fight"})),o;if(this.roundState===2){this.phaseTime++;const l=e.some((c,f)=>c.life<=0&&!a[f]);return!r&&this.timeLeft>0&&this.timeLeft--,(l||this.timeLeft===0)&&(this.roundWinner=uf(e),this.reason=l?e.every(c=>c.life<=0)?"double-ko":"ko":"time",this.roundState=3,this.phaseTime=0,o.push({type:"round-over",winner:this.roundWinner,reason:this.reason})),o}return this.roundState===3?(s||++this.phaseTime>=this.rules.overTime&&(!this._awarded&&this.roundWinner!=="draw"&&(this.wins[this.roundWinner]++,this._awarded=!0),this.matchOver=Object.values(this.wins).some(l=>l>=this.rules.roundsToWin),this.roundState=4,this.phaseTime=0,o.push({type:"result",winner:this.roundWinner,reason:this.reason,matchOver:this.matchOver})),o):(this.roundState===4&&!s&&!this.matchOver&&this.rules.autoAdvance&&++this.phaseTime>=this.rules.resultTime&&(this.roundNo++,this.roundsExisted++,this.startRound(),o.push({type:"next-round",roundNo:this.roundNo})),o)}}const Vt=["a","b","c","x","y","z","s"],ms=["U","D","B","F","UB","UF","DB","DF"],df=new Set(["U","D","L","R",...Vt]),Tr=3600,bl=128,El=4096;function pf(n){let e=null;for(let t=0;t<n.length;t++){const i=n[t];if((i==='"'||i==="'")&&(!e||e===i))e=e?null:i;else if(i===";"&&!e)return n.slice(0,t).trim()}return n.trim()}function Qr(n){const e=n.match(/^(?:"([\s\S]*)"|'([\s\S]*)')$/);return e?e[1]??e[2]:n}function mf(n){let e=n.replace(/\s/g,"");if(!e)throw Error("Empty command symbol.");const t={source:n,strict:!1,hold:!1,release:!1,charge:0,tolerant:!1},i=new Set;for(;/^[>\/~$]/.test(e);){const r=e[0];if(i.has(r))throw Error(`Repeated ${r} modifier in ${n}.`);if(i.add(r),e=e.slice(1),r===">"&&(t.strict=!0),r==="/"&&(t.hold=!0),r==="$"&&(t.tolerant=!0),r==="~"){t.release=!0;const a=e.match(/^\d+/);if(a){if(t.charge=Number(a[0]),!Number.isSafeInteger(t.charge)||t.charge>Tr)throw Error(`Charge duration exceeds the ${Tr}-tick runtime limit.`);e=e.slice(a[0].length)}}}if(t.hold&&t.release)throw Error(`Hold and release cannot be combined in ${n}.`);const s=e.split("+");if(s.some(r=>!r)||new Set(s).size!==s.length)throw Error(`Invalid simultaneous input ${n}.`);if(s.length===1&&ms.includes(s[0]))t.kind="direction",t.keys=s,t.key=(t.tolerant?"$":"")+s[0];else if(s.every(r=>Vt.includes(r))){if(t.tolerant)throw Error(`The $ modifier is only valid on directions: ${n}.`);t.kind="button",t.keys=s}else if(s.filter(r=>ms.includes(r)).length===1&&s.every(r=>ms.includes(r)||Vt.includes(r)))t.kind="chord",t.keys=s.map(r=>ms.includes(r)&&t.tolerant?"$"+r:r);else throw Error(`Unsupported command symbol ${n}. Directions are uppercase and buttons are lowercase.`);return t}function gf(n){const e=n.split(",").map(mf),t=[];for(const i of e){const s=t.at(-1);(s==null?void 0:s.kind)==="direction"&&i.kind==="direction"&&s.key===i.key&&!s.hold&&!s.release&&!i.hold&&!i.release?(t.push({...i,source:`>~${i.key}`,strict:!0,release:!0,charge:0}),t.push({...i,strict:!0})):t.push(i)}if(t.length>bl)throw Error(`Command exceeds the ${bl}-symbol runtime limit.`);return t}function Oo(n){const e=[];let t;for(const[c,f]of String(n).replace(/^\uFEFF|^ï»¿/,"").split(/\r?\n/).entries()){const u=pf(f),h=u.match(/^\[([^\]]+)\]$/);if(h)t={name:h[1].trim().toLowerCase(),line:c+1,values:{}},e.push(t);else if(t){const d=u.indexOf("=");d>0&&(t.values[u.slice(0,d).trim().toLowerCase()]=u.slice(d+1).trim())}}const i=[],s={time:15,bufferTime:1},r=Object.fromEntries(Vt.map(c=>[c,c])),a=(c,f,u=Qr(c.values.name??""))=>{i.push({kind:"command",name:u,line:c.line,message:f})};function o(c,f,u,h,d){if(c==null)return f;if(!/^[-+]?\d+$/.test(c.trim())||!Number.isSafeInteger(Number(c)))throw Error(`${h} must be an integer.`);const p=Math.max(1,Number(c));if(p>d){if(h==="buffer.time"||h==="command.buffer.time")return d;throw Error(`${h} exceeds the ${d}-tick runtime limit.`)}return p}for(const c of e){if(c.name==="defaults")try{s.time=o(c.values["command.time"],s.time,c,"command.time",Tr),s.bufferTime=o(c.values["command.buffer.time"],s.bufferTime,c,"command.buffer.time",30)}catch(f){a(c,f.message)}if(c.name==="remap")for(const[f,u]of Object.entries(c.values)){const h=Qr(u);!Vt.includes(f)||h&&!Vt.includes(h)?a(c,`Unsupported button remap ${f} = ${u}.`):r[f]=h}}const l=[];for(const c of e){if(c.name!=="command")continue;if(l.length>=El){a(c,`Command count exceeds the ${El}-command runtime limit.`);break}const{values:f}=c,u=Qr(f.name??"");try{if(!u)throw Error("Command is missing its name.");if(!f.command)throw Error("Command is missing its input sequence.");const h=gf(f.command);l.push({name:u,command:f.command,sequence:h,time:o(f.time,s.time,c,"time",Tr),bufferTime:o(f["buffer.time"],s.bufferTime,c,"buffer.time",30),line:c.line,holdOnly:h.every(d=>d.hold)})}catch(h){a(c,h.message,u)}}return{commands:l,defaults:s,remap:r,diagnostics:i}}function vf(n,e,t){const i=new Set;n.has("U")!==n.has("D")&&i.add(n.has("U")?"U":"D"),n.has("L")!==n.has("R")&&i.add(n.has(e<0?"L":"R")?"F":"B");for(const s of Vt)n.has(s)&&t[s]&&i.add(t[s]);return i}function xf(n){const e=new Set(Vt.filter(i=>n.has(i))),t=(n.has("U")?"U":n.has("D")?"D":"")+(n.has("B")?"B":n.has("F")?"F":"");t&&e.add(t);for(const i of ms)[...i].every(s=>n.has(s))&&e.add("$"+i);return e}function _f(n){return n.kind==="direction"?[n.key]:n.keys}function Us(n,e){const t=_f(n);return n.hold?t.every(i=>e.held.has(i)):n.release?t.every(i=>e.released.has(i)&&(e.previousDurations.get(i)??0)>=n.charge):t.every(i=>n.kind==="chord"&&!Vt.includes(i)?e.held.has(i):e.pressed.has(i))}function yf(n){if(n.hold)return[];const e=n.release?"release:":"press:";return n.kind==="chord"?n.keys.filter(t=>Vt.includes(t)||n.release).map(t=>e+(Vt.includes(t)?t:"direction")):n.kind==="direction"?[e+"direction"]:n.keys.map(t=>e+t)}function Tl(n,e,t){if(n.kind==="chord"){const i=new Set;for(const s of n.keys)if(Vt.includes(s))for(const r of Vt)t[r]===s&&i.add(r);else for(const r of s.replace("$",""))i.add(r==="F"?e.facing<0?"L":"R":r==="B"?e.facing<0?"R":"L":r);return i}return n.kind==="button"?new Set(Vt.filter(i=>n.keys.includes(t[i]))):new Set([...n.keys[0]].map(i=>i==="F"?e.facing<0?"L":"R":i==="B"?e.facing<0?"R":"L":i))}class ys{constructor(e={commands:[]}){typeof e=="string"&&(e=Oo(e)),this.commands=e.commands??[],this.remap=e.remap??Object.fromEntries(Vt.map(t=>[t,t])),this.diagnostics=[...e.diagnostics??[]],this.historyLimit=Math.max(1,...this.commands.map(t=>t.time+1)),this.reset()}reset(){this.tick=-1,this.history=[],this.buffered=new Map,this.active=new Set,this.previous={raw:new Set,held:new Set,durations:new Map}}update(e,t=1){this.tick++;const i=new Set([...e].filter(l=>df.has(l))),s=xf(vf(i,t,this.remap)),r=this.previous,a={tick:this.tick,raw:i,facing:t,held:s,pressed:new Set([...s].filter(l=>!r.held.has(l))),released:new Set([...r.held].filter(l=>!s.has(l))),previousDurations:r.durations,durations:new Map([...s].map(l=>[l,(r.durations.get(l)??0)+1])),changes:new Set([...i,...r.raw].filter(l=>i.has(l)!==r.raw.has(l)))};this.previous=a,this.history.push(a),this.history.length>this.historyLimit&&this.history.shift(),this.active=new Set;let o=25e4;for(const l of this.commands){if(l.holdOnly){l.sequence.every(f=>Us(f,a))&&this.active.add(l.name);continue}if(l.sequence.every(f=>!f.hold||Us(f,a))&&Us(l.sequence.at(-1),a)&&this.matchSequence(l,()=>--o>=0)&&this.buffered.set(l.name,this.tick+l.bufferTime-1),(this.buffered.get(l.name)??-1)>=this.tick&&this.active.add(l.name),o<0){this.diagnostics.some(f=>f.message==="Input matching work limit reached.")||this.diagnostics.push({kind:"command",message:"Input matching work limit reached."});break}}for(const[l,c]of this.buffered)c<this.tick&&this.buffered.delete(l);return this.active}matchSequence(e,t){const i=this.history.length-1,s=this.tick-e.time;let r=i,a=null,o=new Set;for(let l=e.sequence.length-1;l>=0;l--){const c=e.sequence[l],f=yf(c);let u=-1;for(let h=r;h>=0&&this.history[h].tick>=s;h--){if(!t())return!1;if(h<r&&(o=new Set),!(!Us(c,this.history[h])||f.some(d=>o.has(d)))&&!(a!=null&&a.symbol.strict&&!this.strictBetween(h,a.index,c,a.symbol))){u=h;break}}if(u<0)return!1;u!==r&&(o=new Set);for(const h of f)o.add(h);r=u,a={index:u,symbol:c}}return!0}strictBetween(e,t,i,s){const r=this.history[t],a=Tl(s,r,this.remap);if(e===t){for(const o of Tl(i,r,this.remap))a.add(o);return[...r.changes].every(o=>a.has(o))}for(let o=e+1;o<t;o++)if(this.history[o].changes.size)return!1;return[...r.changes].every(o=>a.has(o))}}const Al=["a","b","c","x","y","z","s"];function Oa(n){return Number.isFinite(Number(n))?Math.max(0,Math.min(8,Math.trunc(Number(n)))):0}function ea(n){var t,i,s,r,a,o;let e=(i=(t=n.checks)==null?void 0:t.find(l=>l.key==="cmd"&&l.ok))==null?void 0:i.path;if(!e&&((r=(s=n.def)==null?void 0:s.files)!=null&&r.cmd))try{e=Jn(n.def.files.cmd,((a=n.path)==null?void 0:a.slice(0,n.path.lastIndexOf("/")+1))||"",!0)}catch{}return Oo(e&&((o=n.files)!=null&&o[e])?bn(n.files[e]):"")}function Rl(n){const e=[];let t=new Set,i=new Set,s=new Set;const r=(a=1,o=[])=>{const l=new Set([...t,...i,...o]),c=e.at(-1);c&&l.size===c.keys.size&&[...l].every(f=>c.keys.has(f))?c.duration+=a:e.push({keys:l,duration:a}),s=l};r();for(const a of n.sequence)if(a.kind==="direction"){const o=new Set(a.keys[0]);a.release?(t=o,r(Math.max(1,a.charge)),t=new Set,r()):(!a.hold&&o.size===t.size&&[...o].every(l=>t.has(l))&&(t=new Set,r()),t=o,r())}else if(a.release){r(Math.max(1,a.charge),a.keys);for(const o of a.keys)i.delete(o);r()}else{if(a.keys.some(o=>s.has(o))&&!a.hold&&r(),a.hold)for(const o of a.keys)i.add(o);r(1,a.keys)}return t=new Set,i=new Set,r(),e}class Sf{constructor(e,{level:t=4,seed:i=1831565813}={}){var r;this.level=Oa(t),this.seed=i>>>0||1,this.buffer=new ys(e),this.inverse=new Map;for(const a of Al){const o=((r=e.remap)==null?void 0:r[a])??a;o&&!this.inverse.has(o)&&this.inverse.set(o,a)}const s=e.commands.filter(a=>a.sequence.every(o=>o.kind!=="button"||o.keys.every(l=>this.inverse.has(l))));this.attacks=s.filter(a=>!a.holdOnly&&a.sequence.some(o=>o.kind==="button"&&o.keys.some(l=>l!=="s"))).slice(0,512),this.byName=new Map;for(const a of s)this.byName.has(a.name)||this.byName.set(a.name,[]),this.byName.get(a.name).push(a);this.recoveries=s.filter(a=>a.name.toLowerCase()==="recovery"),this.recoveryNames=new WeakMap,this.recoveryButton=0,this.recovering=!1,this.normal=this.attacks.filter(a=>a.sequence.length===1&&!a.sequence[0].release),this.special=this.attacks.filter(a=>!this.normal.includes(a)),this.plan=[],this.index=0,this.remaining=0,this.cooldown=0,this.raw=new Set,this.lastCommand=null}random(){let e=this.seed;return e^=e<<13,e^=e>>>17,e^=e<<5,this.seed=e>>>0,this.seed/4294967296}physical(e,t){return new Set([...e].map(i=>i==="F"?t<0?"L":"R":i==="B"?t<0?"R":"L":this.inverse.get(i)||i))}queue(e,t){this.plan=[{keys:new Set(e),duration:t}],this.index=0,this.remaining=0}chooseRecovery(e){var a;const t=(a=e.stateOwner)==null?void 0:a.program.states.get(e.stateNo);let i=t&&this.recoveryNames.get(t);if(t&&!i){i=new Set;for(const o of t.controllers){if(!["changestate","selfstate"].includes(o.type))continue;const l=o.entries.filter(c=>/^trigger(?:all|[1-9]\d*)$/.test(c.key)).map(c=>c.value).join(`
`);if(/\bcanrecover\b/i.test(l))for(const c of l.matchAll(/\bcommand\s*=\s*"([^"\\]*)"/gi))i.add(c[1])}this.recoveryNames.set(t,i)}const s=[...i||[]].flatMap(o=>this.byName.get(o)||[]),r=s.length?s:this.recoveries;if(r.length){const o=r[Math.floor(this.random()*r.length)];this.lastCommand=o.name,this.plan=Rl(o),this.index=0,this.remaining=0}else{const o=Al.filter(l=>l!=="s"&&this.inverse.has(l));o.length&&this.queue([o[this.recoveryButton++%o.length]],1)}}choose(e,t){if(!e.ctrl||e.moveType==="H")return;const i=Math.abs(t.pos.x-e.pos.x),s=e.coordinateScale||1,r=e.constant("size.ground.front")*s+t.constant("size.ground.front")*(t.coordinateScale||1)+20*s;if(i>r){this.queue(["F"],4+Math.floor(this.random()*9));return}if(t.moveType==="A"&&this.random()<.12+.07*this.level){this.queue(this.random()<.3?["D","B"]:["B"],4+this.level);return}if(this.attacks.length){const a=this.special.length&&this.random()<.08+.055*this.level?this.special:this.normal.length?this.normal:this.attacks,o=a[Math.floor(this.random()*a.length)];this.lastCommand=o.name,this.plan=Rl(o),this.index=0,this.remaining=0}else this.queue([],2)}tick(e,t,{paused:i=!1,enabled:s=!0}={}){var r,a;if(!this.level||!s||!e.alive||!(t!=null&&t.alive))this.plan=[],this.index=0,this.remaining=0,this.cooldown=0,this.raw=new Set,this.recovering=!1;else if(!i){const o=e.moveType==="H"&&!!((r=e.getHitVars)!=null&&r.fall);o!==this.recovering&&(this.plan=[],this.index=0,this.remaining=0,this.cooldown=o?10-this.level:0,this.raw=new Set,this.recovering=o);const l=o&&["A","L"].includes(e.stateType)&&!!((a=e.resolveTrigger)!=null&&a.call(e,"canrecover"));o&&!l&&(this.plan=[],this.index=0,this.remaining=0,this.cooldown=10-this.level,this.raw=new Set),this.index>=this.plan.length&&(this.cooldown>0?this.cooldown--:o?(l&&this.chooseRecovery(e),this.cooldown=14-this.level):(this.choose(e,t),this.cooldown=Math.max(1,15-this.level*1.5)));const c=this.plan[this.index];c?(this.remaining<=0&&(this.remaining=c.duration),this.raw=this.physical(c.keys,e.facing),--this.remaining<=0&&this.index++):this.raw=new Set}return this.buffer.update(this.raw,e.facing)}}const xn=(n,e=0)=>Number.isFinite(Number(n))?Number(n):e,ko=n=>String(n??"").toUpperCase().replace(/\s/g,"");function Yn(n,e,t){var r;const i=(r=n.program)==null?void 0:r.constants,s=i instanceof Map?i.get(e):i==null?void 0:i[e];return s===void 0?t:xn(s,t)}function hn(n,e="clsn1",t=n.collisionFrame??n.currentFrame){var f,u,h,d;if(!t||!Array.isArray(t[e]))return[];const i=Zc(n),s=Dt(i),r=n.facing<0?-1:1,a=Yn(i,"size.xscale",1)*s*r,o=Yn(i,"size.yscale",1)*s,l=xn((f=n.pos)==null?void 0:f.x)+Yn(n,"size.draw.offset.x",0)*Dt(n)*r+xn((u=n.drawOffset)==null?void 0:u.x),c=xn((h=n.pos)==null?void 0:h.y)+Yn(n,"size.draw.offset.y",0)*Dt(n)+xn((d=n.drawOffset)==null?void 0:d.y);return t[e].filter(p=>Array.isArray(p)&&p.length>=4&&p.slice(0,4).every(_=>Number.isFinite(Number(_)))).map(p=>{const _=l+Number(p[0])*a,m=l+Number(p[2])*a,v=c+Number(p[1])*o,S=c+Number(p[3])*o;return[Math.min(_,m),Math.min(v,S),Math.max(_,m),Math.max(v,S)]})}function Mf(n,e,t=!1){return t?n[0]<=e[2]&&n[2]>=e[0]&&n[1]<=e[3]&&n[3]>=e[1]:n[0]<e[2]&&n[2]>e[0]&&n[1]<e[3]&&n[3]>e[1]}function Fs(n,e,t=!1){for(const i of n)for(const s of e)if(Mf(i,s,t))return[Math.max(i[0],s[0]),Math.max(i[1],s[1]),Math.min(i[2],s[2]),Math.min(i[3],s[3])];return null}function wf(n,e){var s;const t=ko(n.hitFlag??n.hitflag??"MAF");if(!/[HLAMFD]/.test(t)||t.includes("+")&&t.includes("-"))return!1;const i=e.moveType==="H";return t.includes("+")&&!i||t.includes("-")&&i?!1:e.stateType==="L"?t.includes("D"):e.stateType==="A"?t.includes(e.moveType==="H"&&((s=e.getHitVars)!=null&&s.fall)?"F":"A"):e.stateType==="C"?/[LM]/.test(t):/[HM]/.test(t)}function bf(n,e,t,i){var l,c,f,u;const s=t.moveType==="H"&&!!((l=t.getHitVars)!=null&&l.guarded);if(!t.ctrl&&!s||t.moveType==="H"&&!s||!["S","C","A"].includes(t.stateType)||(c=e.asserted)!=null&&c.has("unguardable"))return!1;const r=t.stateType==="A"?"noairguard":t.stateType==="C"?"nocrouchguard":"nostandguard";if((f=t.asserted)!=null&&f.has(r))return!1;const a=new Set([...i].map(h=>String(h).toLowerCase()));if(!((u=t.world)!=null&&u.manageInputs?t.movementHeld("holdback"):a.has("holdback")))return!1;const o=ko(n.guardFlag??n.guardflag);return t.stateType==="A"?o.includes("A"):t.stateType==="C"?/[LM]/.test(o):/[HM]/.test(o)}function Cl(n){const e=Array.isArray(n.priority)?n.priority:String(n.priority??"4,Hit").split(","),t=String(e[1]??"Hit").trim().toLowerCase();return{level:Math.max(1,Math.min(7,xn(e[0],4))),type:["hit","miss","dodge"].includes(t)?t:"hit"}}function Ef(n){if(n.length<2)return n;const e=Cl(n[0].hit),t=Cl(n[1].hit);return e.level!==t.level?[n[e.level>t.level?0:1]]:e.type==="dodge"||t.type==="dodge"?[]:e.type==="miss"&&t.type==="miss"?[]:n.filter((i,s)=>(s?t:e).type==="hit")}class Tf{constructor(e,{commonText:t="",commonAnimations:i=new Map,opponentCharacter:s=e,leftBound:r=-150,rightBound:a=150,pushboxes:o=!0,maxHelpers:l=56,maxProjectiles:c=256,initialize:f=!0,skipIntro:u=!0,stage:h=null,rules:d=null,combatRules:p={},playerPalette:_=1,opponentPalette:m=1,playerAILevel:v=0,opponentAILevel:S=0,expressionEvaluator:T=null,programs:E=null,manageInputs:b=!1,orderedPhases:y=!1}={}){if(this.expressionEvaluator=T,this.programs=E,this.manageInputs=b,this.orderedPhases=y,this.combatRules=ef(e.files,p),!Number.isFinite(r)||!Number.isFinite(a)||r>=a)throw Error("Invalid training stage bounds.");this.character=e,this.opponentCharacter=s,this.commonText=t,this.leftBound=r,this.rightBound=a,this.pushboxes=o,this.commonAnimations=i,this.maxHelpers=Math.min(256,Math.max(0,l)),this.maxProjectiles=Math.min(1024,Math.max(0,c)),this.initialize=f,this.skipIntro=u,this.playerPalette=_,this.opponentPalette=m,this.playerAILevel=Oa(v),this.opponentAILevel=Oa(S),this.stage=h?new hf(h):null,this.rules=d,this.stage&&(this.leftBound=h.leftBound,this.rightBound=h.rightBound),this.reset()}reset({preserveMatch:e=!1}={}){var s,r,a,o;const t=e?{players:[this.player,this.opponent],flow:this.roundFlow,ticks:this.ticks,diagnostics:this.diagnostics}:null;this.roundFlow=(t==null?void 0:t.flow)||(this.rules?new ff(this.rules):null),this.roundGeneration=(this.roundGeneration||0)+1,this.stage&&this.stage.reset({backgrounds:!e||this.stage.definition.resetBG});const i=((s=this.stage)==null?void 0:s.definition.starts)||[{x:-70,y:0,facing:1},{x:70,y:0,facing:-1}];if(this.player=new Er(this.character,{world:this,program:(r=this.programs)==null?void 0:r.get(this.character),expressionEvaluator:this.expressionEvaluator,commonAnimations:this.commonAnimations,commonText:this.commonText,position:i[0],facing:i[0].facing,id:1,teamSide:1,paletteNo:this.playerPalette,aiLevel:this.playerAILevel}),this.opponent=new Er(this.opponentCharacter,{world:this,program:(a=this.programs)==null?void 0:a.get(this.opponentCharacter),expressionEvaluator:this.expressionEvaluator,commonAnimations:this.commonAnimations,commonText:this.commonText,position:i[1],facing:i[1].facing,id:2,teamSide:2,paletteNo:this.opponentPalette,aiLevel:this.opponentAILevel}),this.player.teamSide=1,this.opponent.teamSide=2,this.player.opponent=this.opponent,this.opponent.opponent=this.player,this._entities=[this.player,this.opponent],this.projectiles=[],this.nextEntityId=3,this.orphanEffectOwners=[],this.renderEntities=[...this._entities],this.drawProjectiles=[],this.helperCommands=new Map,this.usedHits=new Map,this.juggles=new Map,this.archivedDiagnostics=[],this.archivedDiagnosticKeys=new Set,this.pendingPauses=[],this.pause=null,this.superPause=null,this.commandBuffers=new Map,this.presentationEvents=[],this.eventEntities=[],this.pendingCombatEffects=[],this.activeActor=null,this.contactPhase=!1,this.inputBuffers=new Map,this.inputProfiles=new Map,this.manageInputs)for(const l of this._entities)this.inputProfiles.has(l.character)||this.inputProfiles.set(l.character,ea(l.character)),this.inputBuffers.set(l,new ys(this.inputProfiles.get(l.character)));this.events=[],this.cpus=new Map;for(const l of this._entities)if(l.aiLevel){const c=ea(l.character);this.cpus.set(l,new Sf(c,{level:l.aiLevel,seed:1831565813^l.id*2654435769^(((o=this.roundFlow)==null?void 0:o.roundNo)||1)}));for(const f of c.diagnostics)l.diagnostic("command",f.message,{source:l.character.def.files.cmd,line:f.line})}if(this.ticks=(t==null?void 0:t.ticks)||0,this.winner=null,t){this.archiveDiagnostics(t.diagnostics);for(const[l,c]of[this.player,this.opponent].entries()){const f=t.players[l];c.power=f.power,c.victoryQuoteIndex=f.victoryQuoteIndex;const u=Math.max(0,Math.min(60,Math.trunc(c.program.constants.get("data.intpersistindex")??60))),h=Math.max(0,Math.min(40,Math.trunc(c.program.constants.get("data.floatpersistindex")??40)));c.vars.set(f.vars.subarray(u),u),c.fvars.set(f.fvars.subarray(h),h)}}if(this.syncEnvironment(),this.initialize)for(const l of this._entities)l.program.states.has(5900)&&(l._initializing=!0,l.options.skipIntro=this.skipIntro,l.changeState(5900));return this}get diagnostics(){var i;const e=[...this.archivedDiagnostics,...((i=this.stage)==null?void 0:i.diagnostics)||[],...this.entities.flatMap(s=>s.diagnostics||[]),...this.orphanEffectOwners.flatMap(s=>s.diagnostics||[]),...this.projectiles.flatMap(s=>s.diagnostics||[]),...[...this.cpus||new Map].flatMap(([s,r])=>r.buffer.diagnostics.map(a=>({...a,source:s.character.def.files.cmd})))],t=new Set;return e.filter(s=>{const r=typeof s=="string"?s:JSON.stringify(s);return t.has(r)?!1:(t.add(r),!0)})}get entities(){return this._entities.filter(e=>!e.destroyed)}get view(){var e;return((e=this.stage)==null?void 0:e.view())||{left:-160,right:160,top:-200,bottom:40,width:320,height:240,displayHeight:240,groundY:200,zoom:1}}get matchOver(){var e;return((e=this.roundFlow)==null?void 0:e.matchOver)||!1}syncEnvironment(){for(const e of this._entities||[])this.stage&&(e.cameraPos=this.stage.camera,e.cameraZoom=this.stage.camera.zoom),this.roundFlow&&(e.roundState=this.roundFlow.roundState,e.roundNo=this.roundFlow.roundNo,e.roundsExisted=this.roundFlow.roundsExisted)}findPlayer(e){return this.entities.find(t=>t.id===e)}spawnHelper(e,t){if(this.entities.filter(s=>s.parent).length>=this.maxHelpers)return e.diagnostic("resource-limit",`Helper limit (${this.maxHelpers}) reached.`),null;const i=e.createHelper(t,{id:this.nextEntityId++});return i.destroyed?this.archiveDiagnostics(i.diagnostics):(this._entities.push(i),i.keyCtrl&&this.helperCommands.set(i,new ys(ea(i.root.character))),this.syncEnvironment()),i}spawnProjectile(e,t){if(this.projectiles.length>=this.maxProjectiles)return e.diagnostic("resource-limit",`Projectile limit (${this.maxProjectiles}) reached.`),null;const i=new as(e,t,{id:this.nextEntityId++});if(i.removed)return this.archiveDiagnostics(i.diagnostics),i;const s=Object.fromEntries(Object.entries(t).filter(([r])=>r.startsWith("afterimage.")).map(([r,a])=>[r.slice(11),a]));return Object.keys(s).length&&this.presentationEvents.push({...s,type:"afterimage",entity:i}),this.projectiles.push(i),i}retireEffects(e,{removeExplods:t=!1}={}){var i;if(!e._effectsDetached){if(e._effectsDetached=!0,t)e.explods=[],e.drawExplods=[];else if(e.drawExplods=[],e.explods.length){for(const s of e.explods)s.orphaned=!0;this.orphanEffectOwners.push(e)}for(const s of new Set([...this._entities,...this.orphanEffectOwners]))((i=s.bound)==null?void 0:i.target)===e&&(s.bound=null),Vu(s,e)}}destroyHelper(e,{recursive:t=!1,removeExplods:i=!1}={}){const s=[e];if(t)for(const r of this._entities){let a=r.parent,o=0;for(;a&&o++<256;){if(a===e){s.push(r);break}a=a.parent}}for(const r of s)r.destroyed=!0;for(const r of s)this.retireEffects(r,{removeExplods:i})}requestPause(e,t){const i=Math.max(0,Math.trunc(t.time));if(!Number.isFinite(i)||i>36e4){e.diagnostic("resource-limit","Pause time must be between 0 and 360000 ticks.");return}const s={...t,owner:e,time:i,remaining:i,elapsed:0,moved:new Map,movetime:Math.max(0,Math.min(i,t.movetime||0)),endcmdbuftime:Math.max(0,Math.min(i,t.endcmdbuftime||0))};this.pendingPauses.push(s),t.type==="superpause"&&(e.power=Math.max(0,Math.min(e.maxPower,e.power+(t.poweradd||0))),this.presentationEvents.push({...s,type:"superpause"}))}isFrozen(e){var s,r;const t=((s=this.superPause)==null?void 0:s.remaining)>0?this.superPause:((r=this.pause)==null?void 0:r.remaining)>0?this.pause:null;if(!t)return!1;const i=e===t.owner?t.movetime:t.type==="superpause"?e.superMoveTime||0:e.pauseMoveTime||0;return e.isProjectile?i<=0:(t.moved.get(e)||0)>=i}isSuperUnhittable(e){var t;return((t=this.superPause)==null?void 0:t.remaining)>0&&this.superPause.owner===e&&this.superPause.unhittable!==0}advancePause(){var i,s;const e=((i=this.superPause)==null?void 0:i.remaining)>0?this.superPause:((s=this.pause)==null?void 0:s.remaining)>0?this.pause:null,t=r=>{for(const[a,{before:o,applied:l}]of(r==null?void 0:r.defence)||[])a.defenceMultiplier===l&&(a.defenceMultiplier=o)};if(e){for(const r of[...this.entities,...this.projectiles])!this.isFrozen(r)&&!r._hitPausedThisTick&&e.moved.set(r,(e.moved.get(r)||0)+1);e.remaining--,e.elapsed++,e.remaining||t(e)}for(const r of this.pendingPauses){const a=r.type==="superpause"?"superPause":"pause";if(t(this[a]),this[a]=r,a==="superPause"&&r.remaining>0){const o=r.p2defmul>0?r.p2defmul:this.combatRules.superTargetDefence||1.5;r.defence=new Map;for(const l of r.owner.targets){const c=l.defenceMultiplier,f=c/o;r.defence.set(l,{before:c,applied:f}),l.defenceMultiplier=f}}}this.pendingPauses=[]}tick(e=new Set,t=new Set,{playerInput:i=null,opponentInput:s=null}={}){var x,I,R,A,F,N,P,k,H,B;if(this.orderedPhases){for(const C of this.pendingCombatEffects){const{defender:L,attacker:V,damage:$,minimum:ie,get:ne,give:G}=C;L.life=Math.max(ie,Math.min(L.maxLife,L.life-$)),V&&(V.power=Math.max(0,Math.min(V.maxPower,V.power+ne)),L.power=Math.max(0,Math.min(L.maxPower,L.power+G)))}this.pendingCombatEffects=[];for(const C of this._entities)C._projectedLife=void 0}this.events=[],this.presentationEvents=[],e=e instanceof Set?e:new Set(e),t=t instanceof Set?t:new Set(t);const r=((x=this.superPause)==null?void 0:x.remaining)>0||((I=this.pause)==null?void 0:I.remaining)>0&&this.pause.pausebg!==0,a=((R=this.superPause)==null?void 0:R.remaining)>0||((A=this.pause)==null?void 0:A.remaining)>0,o=((F=this.pause)==null?void 0:F.remaining)>0?this.pause:null,l=((N=this.superPause)==null?void 0:N.remaining)>0?this.superPause:null;this.syncEnvironment(),this.cpus.has(this.player)&&(e=this.cpus.get(this.player).tick(this.player,this.opponent,{paused:this.isFrozen(this.player)||this.player.hitPauseTime>0,enabled:!this.roundFlow||this.roundFlow.roundState===2})),this.cpus.has(this.opponent)&&(t=this.cpus.get(this.opponent).tick(this.opponent,this.player,{paused:this.isFrozen(this.opponent)||this.opponent.hitPauseTime>0,enabled:!this.roundFlow||this.roundFlow.roundState===2})),this.cpus.has(this.player)&&(i=this.cpus.get(this.player).raw),this.cpus.has(this.opponent)&&(s=this.cpus.get(this.opponent).raw);const c=new Set([...this.entities,...this.projectiles].filter(C=>C.hitPauseTime>0)),f=new Set,u=[];for(let C=0;C<this._entities.length;C++){const L=this._entities[C];if(L.destroyed)continue;u.push(L);let V=L.root===this.player?e:t,$=L.root===this.player?i:s;if(this.manageInputs&&L.keyCtrl){$=new Set($||[]);for(const G of L.pendingAssertedInputs)$.add(G==="F"?L.facing===1?"R":"L":G==="B"?L.facing===1?"L":"R":G);this.isFrozen(L)||L.pendingAssertedInputs.clear(),this.inputBuffers.has(L)||this.inputBuffers.set(L,new ys(this.inputProfiles.get(L.root.character))),V=this.inputBuffers.get(L).update($,L.facing)}else L.parent&&L.keyCtrl&&$!==null&&(V=this.helperCommands.get(L).update($,L.facing));(!L.keyCtrl||this.roundFlow&&this.roundFlow.roundState!==2)&&(V=new Set);const ie=L.teamSide===this.player.teamSide?this.opponent:this.player,ne=this.isFrozen(L);if(L._hitPausedThisTick=L.hitPauseTime>0,!ne&&!L._hitPausedThisTick&&(L._projectileContactShield=!1),ne){f.add(L);const G=((P=this.superPause)==null?void 0:P.remaining)>0?this.superPause:this.pause;if(G&&G.remaining<=G.endcmdbuftime){this.commandBuffers.has(L)||this.commandBuffers.set(L,new Set);for(const se of V)this.commandBuffers.get(L).add(se)}}else this.commandBuffers.has(L)&&(V=new Set([...V,...this.commandBuffers.get(L)]),this.commandBuffers.delete(L));this.activeActor=L;try{L.tick({commands:V,opponent:ie,paused:ne,input:L.keyCtrl?$:new Set})}finally{this.activeActor=null}}for(const C of this.projectiles){const L=this.isFrozen(C);L&&f.add(C),C._hitPausedThisTick=C.hitPauseTime>0,C.tick({paused:L})}if(this.stage){for(const C of this.entities)C.screenBound!==!1&&(C.pos.x=Math.max(this.leftBound,Math.min(this.rightBound,C.pos.x)));this.stage.updateCamera(this.entities),this.syncEnvironment(),this.stage.tick({paused:r})}this.constrainPositions()&&this.stage&&(this.stage.updateCamera(this.entities),this.syncEnvironment(),this.constrainPositions({push:!1}));const d=this.entities;for(const C of d)if(C.moveType!=="H"&&C.stateType!=="L")for(const L of this.juggles.values())L.delete(C.id);const p=this.projectiles.filter(C=>!C.removed&&!C.removing),_=p.map(C=>hn(C,"clsn2"));for(let C=0;C<p.length;C++){const L=p[C];if(L.removing||!_[C].length)continue;const V=[];for(let ie=C+1;ie<p.length;ie++){const ne=p[ie];L.teamSide===ne.teamSide||ne.removing||f.has(L)&&f.has(ne)||!Fs(_[C],_[ie],this.orderedPhases)||V.push(ne)}const $=ie=>(ie.pos.x-L.pos.x)**2+(ie.pos.y-L.pos.y)**2;V.sort((ie,ne)=>$(ie)-$(ne)||ie.id-ne.id);for(const ie of V){if(L.removing)break;ie.removing||(L.clash(ie),ie.clash(L))}}const m=this.orderedPhases?this.projectiles.filter(C=>!C.removed||C.drawVisible):p,v=[...d,...m];for(const C of d)C.inGuardDistance=Hc(C,v);const S=[],T=new Set;for(const C of d)if(!(!C.reversalDef||f.has(C)||c.has(C)||this.roundFlow&&this.roundFlow.roundState!==2))for(const L of d){const V=C.reversalDef;if(!V)break;const $=L.hitDef;if(!$||L===C||L.teamSide===C.teamSide||c.has(L)||T.has(L)||!C.attributeMatches(V["reversal.attr"],$.attr)||((k=this.usedHits.get(C))==null?void 0:k.get(L.id))===V.serial)continue;const ie=Fs(hn(C),hn(L),this.orderedPhases);if(!ie)continue;const ne=L.receiveHit(V,C);ne.rejected||(this.applyCornerPush(C,L,ne.cornerPush,V.coordinateScale),L.moveContact=L.moveHit=L.moveGuarded=0,L.moveReversed=1,L.hitDef=null,T.add(L),this.usedHits.has(C)||this.usedHits.set(C,new Map),this.usedHits.get(C).set(L.id,V.serial),this.events.push({type:"reversal",attacker:C,defender:L,hitDef:V,damage:ne.damage,guarded:!1,x:(ie[0]+ie[2])/2,y:(ie[1]+ie[3])/2,tick:this.ticks}))}const E=d.length>2?new Map:null;for(const C of[...d,...p]){if(this.winner||this.roundFlow&&this.roundFlow.roundState!==2||C.destroyed||f.has(C)||T.has(C)||c.has(C)||C.life<=0||C.moveType!=="A")continue;const L=C.hitDef;if(!L||!/^[SCA]\s*,\s*[NSH][ATP]$/i.test(String(L.attr??"").trim()))continue;const V=ko(L.affectteam??"E"),$=L.serial??L,ie=this.usedHits.get(C);let ne;for(const G of[...d].sort((se,ge)=>Math.abs(se.pos.x-C.pos.x)-Math.abs(ge.pos.x-C.pos.x))){if(C===G||C.isProjectile&&C.owner===G||G.life<=0||c.has(G)||!wf(L,G))continue;const se=C.teamSide===G.teamSide;if(V==="E"&&se||V==="F"&&!se||typeof G.canBeHit=="function"&&!G.canBeHit(L,C)||String(L[G.stateType==="A"?"air.type":"ground.type"]??L["ground.type"]??"high").toLowerCase()!=="none"&&!this.canJuggle(C,G,L)||(C instanceof as?!C.canHit(G,this.ticks):(ie==null?void 0:ie.get(G.id))===$))continue;if(ne??(ne=hn(C)),!ne.length)break;let ge=E==null?void 0:E.get(G);ge||(ge=hn(G,"clsn2"),E==null||E.set(G,ge));const Se=Fs(ne,ge,this.orderedPhases);if(!Se)continue;const ae=this.manageInputs||G.parent?G.commands:G===this.player?e:t;S.push({attacker:C,defender:G,hit:L,activation:$,overlap:Se,wasFalling:G.stateType==="L"||G.stateType==="A"&&G.moveType==="H"&&!!((H=G.getHitVars)!=null&&H.fall),guarded:bf(L,C,G,ae)})}}const b=S.filter(C=>{const L=S.find(V=>V.attacker===C.defender&&V.defender===C.attacker);return!L||Ef([C,L]).includes(C)}),y=new Set;for(const C of b){if(C.attacker instanceof as&&(C.defender._projectileContactShield||!C.attacker.canHit()))continue;let L;this.contactPhase=!0;try{L=C.defender.receiveHit(C.hit,C.attacker,{guarded:C.guarded})}finally{this.contactPhase=!1}L!=null&&L.rejected||(this.applyCornerPush(C.attacker,C.defender,L.cornerPush,C.hit.coordinateScale),!C.guarded&&!L.typeNone&&this.recordJuggle(C.attacker,C.defender,C.hit,{wasFalling:C.wasFalling}),this.usedHits.has(C.attacker)||this.usedHits.set(C.attacker,new Map),this.usedHits.get(C.attacker).set(C.defender.id,C.activation),C.attacker instanceof as&&(C.defender._projectileContactShield=!0,C.attacker.onContact({guarded:C.guarded,defer:!0}),y.add(C.attacker)),this.events.push({type:C.guarded?"guard":"hit",attacker:C.attacker,defender:C.defender,hitDef:C.hit,damage:(L==null?void 0:L.damage)??0,guarded:C.guarded,typeNone:!!L.typeNone,x:(C.overlap[0]+C.overlap[2])/2,y:(C.overlap[1]+C.overlap[3])/2,tick:this.ticks}))}for(const C of y)C.finishContacts();for(const C of this.projectiles)C.finishMovementAllowance({paused:f.has(C)});for(const C of this.entities)C.updateExplods({hitPaused:c.has(C),pause:o,superPause:l});for(const C of this._entities)C.destroyed&&!C._effectsDetached&&this.retireEffects(C);for(const C of this.orphanEffectOwners)C.updateExplods({pause:o,superPause:l});this.orphanEffectOwners=this.orphanEffectOwners.filter(C=>C.explods.length||C.drawExplods.length),this.drawProjectiles=this.projectiles.filter(C=>C.drawVisible),this.eventEntities=[...u,...this.projectiles],this.cleanupEntities(),this.advancePause(),this.ticks++;const g=C=>this.entities.some(L=>L.asserted.has(C));if(!this.roundFlow&&!g("noko")&&(this.player.life<=0||this.opponent.life<=0)&&(this.winner=this.player.life<=0&&this.opponent.life<=0?"draw":this.player.life<=0?"opponent":"player"),this.roundFlow){const C=this.roundFlow,L=[this.player,this.opponent],V=C.step({players:L,paused:a,intro:g("intro"),roundNotOver:g("roundnotover"),timerFreeze:g("timerfreeze"),noKO:L.map(()=>g("noko"))});this.syncEnvironment();for(const $ of V){if($.type==="fight")for(const ie of L)ie.stateNo===0&&(ie.ctrl=1);if($.type==="round-over"&&(this.winner=$.winner),$.type==="result")for(const ie of L){const ne=$.winner===(ie===this.player?"player":"opponent"),G=ne?180:$.reason==="time"?170:null;G!==null&&ie.program.states.has(G)&&ie.changeState(G,0,ie)}$.type==="next-round"&&this.reset({preserveMatch:!0}),this.presentationEvents.push({...$,type:"round",event:$.type})}C.matchOver&&C.roundWinner!=="draw"&&((B=this[C.roundWinner])==null||B.selectVictoryQuote())}return this.events}cleanupEntities(){var t;const e=this._entities.filter(i=>i.destroyed);for(const i of e)i._effectsDetached||this.retireEffects(i);for(const i of[...e,...this.projectiles.filter(s=>s.removed)]){this.archiveDiagnostics(i.diagnostics),this.usedHits.delete(i),this.commandBuffers.delete(i),this.inputBuffers.delete(i),this.helperCommands.delete(i),this.juggles.delete(i);for(const s of this.juggles.values())s.delete(i.id)}this._entities=this._entities.filter(i=>!i.destroyed),this.projectiles=this.projectiles.filter(i=>!i.removed);for(const i of this._entities){i.helpers=i.helpers.filter(s=>!s.destroyed),i.targets=i.targets.filter(s=>!s.destroyed&&(!this.orderedPhases||s.moveType==="H"));for(const s of i.targetHitIds.keys())i.targets.some(r=>r.id===s)||i.targetHitIds.delete(s);(t=i.bound)!=null&&t.target.destroyed&&(i.bound=null)}this.renderEntities=[...this._entities,...this.orphanEffectOwners].sort((i,s)=>i.id-s.id)}archiveDiagnostics(e){for(const t of e){const i=JSON.stringify(t);this.archivedDiagnosticKeys.has(i)||(this.archivedDiagnosticKeys.add(i),this.archivedDiagnostics.push(t))}}canJuggle(e,t,i){var c,f,u;if((c=(e.isProjectile?e.creator:e).asserted)!=null&&c.has("nojugglecheck")||!(t.stateType==="L"||t.stateType==="A"&&t.moveType==="H"&&((f=t.getHitVars)==null?void 0:f.fall)))return!0;const r=e.isProjectile?e.owner:e,a=(u=this.juggles.get(r))==null?void 0:u.get(t.id),o=(a==null?void 0:a.remaining)??r.constant("data.airjuggle"),l=e.isProjectile?i["air.juggle"]||0:(a==null?void 0:a.group)===i.juggleGroup?0:i.juggleCost||0;return o>=l}recordJuggle(e,t,i,{wasFalling:s=!1}={}){var f,u;if(!s&&!((f=t.getHitVars)!=null&&f.fall)&&t.stateType!=="L")return;const r=e.isProjectile?e.owner:e;this.juggles.has(r)||this.juggles.set(r,new Map);const a=this.juggles.get(r),o=a.get(t.id),l=(u=(e.isProjectile?e.creator:e).asserted)==null?void 0:u.has("nojugglecheck"),c=l?0:e.isProjectile?i["air.juggle"]||0:(o==null?void 0:o.group)===i.juggleGroup?0:i.juggleCost||0;a.set(t.id,{remaining:Math.max(0,((o==null?void 0:o.remaining)??r.constant("data.airjuggle"))-c),group:i.juggleGroup})}bodyWidth(e,t,i=!1){return dr(e,t,{edge:i})}horizontalLimits(e){var a,o;const t=l=>{var c,f;return xn((f=(c=e.width)==null?void 0:c.edge)==null?void 0:f[e.facing===l?0:1])*e.coordinateScale},i=this.view;let s=this.orderedPhases?Math.max(this.leftBound,i.left+(((a=this.stage)==null?void 0:a.definition.screenLeft)||0)+t(-1)):this.stage?Math.max(this.leftBound,i.left+Math.max(this.stage.definition.screenLeft,this.bodyWidth(e,-1,!0))):this.leftBound+this.bodyWidth(e,-1,!0),r=this.orderedPhases?Math.min(this.rightBound,i.right-(((o=this.stage)==null?void 0:o.definition.screenRight)||0)-t(1)):this.stage?Math.min(this.rightBound,i.right-Math.max(this.stage.definition.screenRight,this.bodyWidth(e,1,!0))):this.rightBound-this.bodyWidth(e,1,!0);return s>r&&(s=r=(this.leftBound+this.rightBound)/2),{min:s,max:r}}applyCornerPush(e,t,i=0,s=e.coordinateScale){if(!i||e instanceof as||t.screenBound===!1)return;const{min:r,max:a}=this.horizontalLimits(t),o=t.pos.x===e.pos.x?e.facing:Math.sign(t.pos.x-e.pos.x);(o>0?t.pos.x<a-.01:t.pos.x>r+.01)||(e.cornerPush=i*s*o)}constrainPositions({push:e=!0}={}){const t=this.entities,i=new Map(t.map(o=>[o,this.horizontalLimits(o)])),s=o=>{if(o.screenBound!==!1){const{min:l,max:c}=i.get(o);o.pos.x=Math.max(l,Math.min(c,o.pos.x))}};if(t.forEach(s),!this.pushboxes||!e)return!1;let r=!1;const a=t.filter(o=>o.playerPush!==!1).sort((o,l)=>o.id-l.id);for(let o=0;o<a.length;o++)for(let l=o+1;l<a.length;l++){const c=a[o],f=a[l];if(c.teamSide===f.teamSide)continue;const u=c.pos.y-Yn(c,"size.height",60)*Dt(c),h=f.pos.y-Yn(f,"size.height",60)*Dt(f);if(u>=f.pos.y||h>=c.pos.y||!Fs(hn(c,"clsn2"),hn(f,"clsn2")))continue;const[d,p]=c.pos.x<=f.pos.x?[c,f]:[f,c],_=d.pos.x+this.bodyWidth(d,1)-p.pos.x+this.bodyWidth(p,-1);if(_<=0)continue;const m=d.screenBound===!1?1/0:Math.max(0,d.pos.x-i.get(d).min),v=p.screenBound===!1?1/0:Math.max(0,i.get(p).max-p.pos.x),S=Math.min(_/2,m),T=Math.min(_-S,v);d.pos.x-=Math.min(_-T,m),p.pos.x+=T,this.orderedPhases&&(d.pos.x=Math.fround(d.pos.x),p.pos.x=Math.fround(p.pos.x)),s(d),s(p),r=!0}return r}}const tt=(n,e,t="")=>`
[Statedef ${n}]
${e}
${t}
`,Me=(n,e,t="1")=>`
[State 0, ${n}]
type = ${n}
trigger1 = ${t}
${e}
`,Qe=(n,e,t=1)=>Me("ChangeState",`value = ${n}
ctrl = ${t}`,e),je=(n,e="time = 0")=>Me("ChangeAnim",`value = ${n}`,`(${e}) && selfanimexist(${n})`);function th({orderedPhases:n=!1}={}){return[tt(0,`type = S
movetype = I
physics = S
ctrl = 1`,je(0,"anim != 0")+Me("VelSet","y = 0","time = 0")+(n?Me("VelSet","x=0","abs(vel x)<const(movement.stand.friction.threshold)"):"")),tt(10,`type = C
movetype = I
physics = C`+(n?`
velset=0,0`:""),je(10)+Qe(11,"animtime = 0 || !selfanimexist(10)")),tt(11,`type = C
movetype = I
physics = C
ctrl = 1`,je(11)),tt(12,`type = S
movetype = I
physics = S`,je(12)+Qe(0,"animtime = 0 || !selfanimexist(12)")),tt(20,`type = S
movetype = I
physics = S
ctrl = 1`,Me("VelSet","x = const(velocity.walk.fwd.x)",'command = "holdfwd"')+Me("VelSet","x = const(velocity.walk.back.x)",'command = "holdback"')+je(20,"vel x > 0 && anim != 20")+je(21,"vel x < 0 && anim != 21")),tt(40,`type = S
movetype = I
physics = S
ctrl = 0`,je(40)+Me("VelSet",`x = ifelse(command = "holdfwd", const(velocity.jump.fwd.x), ifelse(command = "holdback", const(velocity.jump.back.x), const(velocity.jump.neu.x)))
y = const(velocity.jump.y)`,"animtime = 0 || !selfanimexist(40)")+Qe(50,"animtime = 0 || !selfanimexist(40)")),tt(45,`type = A
movetype = I
physics = A
ctrl = 1`,Me("VelSet",`x = ifelse(command = "holdfwd", const(velocity.airjump.fwd.x), ifelse(command = "holdback", const(velocity.airjump.back.x), const(velocity.airjump.neu.x)))
y = const(velocity.airjump.y)`,"time = 0")+Qe(50,"time > 0")),tt(50,`type = A
movetype = I
physics = A
ctrl = 1`,je("ifelse(vel x = 0, 41, ifelse(vel x > 0, 42, 43))")+Qe(52,"pos y >= 0 && vel y > 0",0)),tt(51,`type = A
movetype = I
physics = A`),tt(52,`type = S
movetype = I
physics = S
ctrl = 0`+(n?`
velset=0,0
anim=47`:""),je(47)+Me("PosSet","y = 0","time = 0")+Me("VelSet","y = 0","time = 0")+(n?Me("CtrlSet","value=1","time>=3"):"")+Qe(0,"time >= 3 && (animtime = 0 || !selfanimexist(47))")),tt(100,`type = S
movetype = I
physics = `+(n?"S":"N")+`
ctrl = 1`,je(100)+Me("VelSet","x = const(velocity.run.fwd.x)")+Me("AssertSpecial",`flag = nowalk
flag2 = noautoturn`)+Qe(0,'command != "holdfwd"')),tt(105,`type = A
movetype = I
physics = A
ctrl = 0`,je(105)+(n?Me("CtrlSet","value=1","time>=2"):"")+Me("VelSet",`x = const(velocity.run.back.x)
y = const(velocity.run.back.y)`,"time = 0")+Qe(n?106:52,"pos y >= 0 && vel y > 0",0)),...n?[tt(106,`type=S
movetype=I
physics=S
ctrl=0`,je(47)+Me("PosSet","y=0")+Me("VelSet","y=0")+Me("VelSet","x=0","abs(vel x)<const(movement.stand.friction.threshold)")+Qe(0,"time>=7"))]:[],...[[120,"S",n?120:130],[130,"S",130],[131,"C",131],[132,"A",132],[140,"S",130]].map(([e,t,i])=>tt(e,`type = ${t}
movetype = I
physics = ${t}
ctrl = 1${t==="A"?"":`
velset = 0,0`}`,je(i)+Qe(t==="A"?50:t==="C"?11:0,'command != "holdback"')+(n&&e===120?Qe(130,"animtime=0 || !selfanimexist(120)"):""))),...[[150,"S",150,151],[152,"C",151,153],[154,"A",152,155]].map(([e,t,i,s])=>tt(e,`type=${t}
movetype=H
physics=N
ctrl=0
velset=0,0`,je(i)+Qe(s,"hitshakeover",0))),...[[151,"S",150],[153,"C",151],[155,"A",152]].map(([e,t,i])=>tt(e,`type=${t}
movetype=H
physics=${t==="A"?"N":t}
ctrl=0`,je(i)+Me("HitVelSet",`x=1
y=1`,"time=0")+Me("CtrlSet","value=1","time>=gethitvar(ctrltime)")+(t==="A"?Me("Gravity","")+Qe(52,"pos y>=0 && vel y>0",0)+Qe(132,"time>=gethitvar(ctrltime)"):Me("VelSet","x=0","time>=gethitvar(slidetime)||hitover")+Me("StateTypeSet",`statetype=C
physics=C`,'command="holddown"')+Me("StateTypeSet",`statetype=S
physics=S`,'command!="holddown"')+Me("ChangeState",`value=ifelse(statetype=C,131,130)
ctrl=1`,"hitover")))),...[[5e3,"S","ifelse(gethitvar(groundtype)=2,5010,5000)"],[5010,"C","5020"],[5020,"A","5030"]].map(([e,t,i])=>{const s="5030+gethitvar(animtype)",r="5050+gethitvar(animtype)-3",a=n?`ifelse(gethitvar(animtype)>=3,ifelse(selfanimexist(${r}),${r},5030),ifelse((gethitvar(fall)||gethitvar(yvel)!=0)&&selfanimexist(${s}),${s},${i}+gethitvar(animtype)))`:`ifelse(gethitvar(animtype)>=3,5030,${i}+gethitvar(animtype))`;return tt(e,`type=${t}
movetype=H
physics=N
ctrl=0
velset=0,0`,Me("ChangeAnim",`value=${a}`,`time=0 && selfanimexist(${a})`)+(n?Me("StateTypeSet","statetype=A","gethitvar(yvel)!=0 || pos y!=0"):"")+Me("ChangeState",`value=${t==="A"?"5030":`ifelse(gethitvar(fall)||gethitvar(yvel)!=0||pos y!=0,5030,${e+1})`}
ctrl=0`,"hitshakeover"))}),...[[5001,"S"],[5011,"C"]].map(([e,t])=>tt(e,`type=${t}
movetype=H
physics=${t}
ctrl=0`,(n?je("anim"):"")+Me("HitVelSet","x=1","time=0")+Me("VelMul","x=.6","time>=gethitvar(slidetime)")+(n?je("anim+5","animtime=0 && (anim=[5000,5002] || anim=[5010,5012] || anim=[5020,5022])"):"")+Me("VelSet","x=0","hitover")+Me("DefenceMulSet","value=1","hitover")+Qe(0,"hitover"))),...[5030,5035].map(e=>{const t=Me("VelAdd","y=gethitvar(yaccel)",e===5030?"time>0":n?"time>0 || prevstateno!=5030":"1"),i=Me("ChangeState",`value=ifelse(gethitvar(fall),5050,5040)
ctrl=0`,"hitover || (vel y>0 && pos y>=0)")+(e===5030?n?Me("ChangeState",`value=ifelse(anim=[5050,5059],5050,5035)
ctrl=0`,"animtime=0"):Qe(5035,"animtime=0",0):Me("ChangeState",`value=ifelse(gethitvar(fall),5050,5040)
ctrl=0`,"animtime=0 || !selfanimexist(5035)"));return tt(e,`type=A
movetype=H
physics=N
ctrl=0`,(e===5030?(n?je("anim"):"")+Me("HitVelSet",`x=1
y=1`,"time=0"):je(5035))+t+i)}),tt(5040,`type=A
movetype=H
physics=N
ctrl=1`,je(5040)+Me("VelAdd","y=gethitvar(yaccel)")+Qe(5050,"!alive",0)+Qe(52,"pos y>=0 && vel y>0",0)+Qe(50,"animtime=0 || !selfanimexist(5040)")),tt(5050,`type=A
movetype=H
physics=N
ctrl=0`,(n?je("5050+ifelse(gethitvar(animtype)>=3,gethitvar(animtype)-3,0)","(time=0 && anim=5030) || (animtime=0 && (anim<5050 || anim>5069))")+je("anim+10","vel y>Const240p(-2) && anim=[5051,5052]"):je(5050))+Me("SelfState","value=5210",'alive && CanRecover && command="recovery"')+Qe(5100,n?"vel y>0 && pos y>=ifelse(anim=5050 || anim=5035,const(movement.air.gethit.groundlevel),0)":"pos y>=0 && vel y>0",0)+Me("VelAdd","y=gethitvar(yaccel)",n?"time>0 || (prevstateno!=5030 && prevstateno!=5035)":"1")),tt(5070,`type=A
movetype=H
physics=N
ctrl=0
velset=0,0`,je(5070)+Qe(5071,"hitshakeover",0)),tt(5071,`type=A
movetype=H
physics=N
ctrl=0`,Me("HitVelSet",`x=1
y=1`,"time=0")+Me("VelAdd","y=gethitvar(yaccel)")+Qe(5110,"vel y>0 && pos y>=const(movement.air.gethit.trip.groundlevel)",0)),tt(5080,`type=L
movetype=H
physics=N
ctrl=0
velset=0,0`,je(5080)+Qe(5030,"hitshakeover && gethitvar(yvel)!=0",0)+Qe(5081,"hitshakeover && gethitvar(yvel)=0",0)),tt(5081,`type=L
movetype=H
physics=C
ctrl=0`,Me("HitVelSet","x=1","time=0")+Me("VelSet","x=0","hitover")+Qe(5110,"hitover",0)),tt(5100,`type = L
movetype = H
physics = N
ctrl = 0`+(n?"":`
velset = 0,0`),Me("PosSet","y = 0")+(n?Me("PosFreeze","value=1")+Me("VelMul","x=.75","time=0")+Me("VelSet","y=0","time=0"):"")+Me("HitFallDamage","",n?"time=3":"time=0")+Me("FallEnvShake","","time=0")+je(n?"ifelse(selfanimexist(5100+ifelse(gethitvar(animtype)>=3,gethitvar(animtype)-3,0)),5100+ifelse(gethitvar(animtype)>=3,gethitvar(animtype)-3,0),5100)":5100)+Qe(5110,"time>=1 && gethitvar(fall.yvel)=0",0)+Qe(5101,"time>=1 && (animtime=0 || time>=12 || !selfanimexist(5100))",0)),tt(5101,`type=L
movetype=H
physics=N
ctrl=0`,je(5160)+Me("HitFallVel","","time=0")+Me("PosSet","y=const(movement.down.bounce.offset.y)","time=0")+Me("PosAdd","x=const(movement.down.bounce.offset.x)","time=0")+(n?Me("PosFreeze","value=1","time=0"):"")+Me("VelAdd","y=const(movement.down.bounce.yaccel)",n?"time>0":"1")+Qe(5110,"time>0 && vel y>0 && pos y>=const(movement.down.bounce.groundlevel)",0)),tt(5110,`type = L
movetype = H
physics = N
ctrl = 0`,Me("PosSet","y=0","time=0")+Me("VelSet","y=0","time=0")+(n?je("ifelse(selfanimexist(5170),5170,5110)")+je(5110,"animtime=0 && anim!=5110")+Me("VelMul","x=const(movement.stand.friction)")+Me("VelSet","x=0","abs(vel x)<const(movement.down.friction.threshold)"):je(5110))+Qe(5150,"!alive",0)+Qe(5120,"time>=1 && gethitvar(recovertime)<=0",0)),tt(5120,(n?`type=L
physics=N`:`type=S
physics=S`)+`
movetype=I
ctrl=0`,je(5120)+Me("SelfState",`value=0
ctrl=1`,"animtime = 0 || !selfanimexist(5120)")),tt(5150,`type = L
movetype = H
physics = N
ctrl = 0
velset = 0,0`,je(5110)),tt(5210,`type=A
movetype=I
physics=N
ctrl=0`,je(5210)+Me("PosFreeze","value=1","time<4")+Me("VelMul",n?`x=const(velocity.air.gethit.airrecover.mul.x)
y=const(velocity.air.gethit.airrecover.mul.y)`:`x=.5
y=.2`,"time=4")+Me("VelAdd",n?`x=const(velocity.air.gethit.airrecover.add.x)
y=const(velocity.air.gethit.airrecover.add.y)`:"y=Const240p(-4.5)","time=4")+Me("NotHitBy","value=SCA",n?"time<20":"time<4")+(n?Me("VelAdd","y=const(movement.air.gethit.airrecover.yaccel)","time>=4")+Me("CtrlSet","value=1","time>=20")+Qe(52,"pos y>=0 && vel y>0",0):Qe(50,"time>=4")))].join(`
`)}th();function ka(n=""){if(n=String(n).toUpperCase(),n==="S"||n==="SUB")return{mode:"subtract",source:1,destination:1};if(n==="A"||n==="ADD")return{mode:"add",source:1,destination:1};if(n==="A1"||n==="ADD1")return{mode:"add",source:1,destination:.5};const e=/^AS([\d.]+)D([\d.]+)$/.exec(n);return e?{mode:"add",source:Math.max(0,Math.min(256,+e[1]))/256,destination:Math.max(0,Math.min(256,+e[2]))/256}:{mode:"normal",source:1,destination:0}}function Af(n=0,e=0,t=0){const i=f=>{if(typeof f!="number"||!Number.isFinite(f))throw Error("Sprite angles must be finite numbers.");const u=f%360*Math.PI/180,h=d=>Math.abs(d)<1e-12?0:Math.abs(1-Math.abs(d))<1e-12?Math.sign(d):d;return[h(Math.cos(u)),h(Math.sin(u))]},[s,r]=i(n),[a,o]=i(e),[l,c]=i(t);return{a:l*s,b:o*c*s-a*r,c:l*r,d:a*s+o*c*r}}function Ba(n,e,t=0){var l;const i=n==null?void 0:n.frames[e];if(!i)return null;if(!((l=i.interpolate)!=null&&l.length)||i.ticks<=0)return i;const s=n.frames[e+1]||n.frames[n.loopStart||0];if(!s)return i;const r=Math.max(0,Math.min(1,t/i.ticks)),a={...i},o=(c,f)=>c+(f-c)*r;for(const c of i.interpolate)if(c==="offset"&&(a.x=o(i.x,s.x),a.y=o(i.y,s.y)),c==="scale"&&(a.scaleX=o(i.scaleX??1,s.scaleX??1),a.scaleY=o(i.scaleY??1,s.scaleY??1)),c==="angle"&&(a.angle=o(i.angle||0,s.angle||0)),c==="blend"){const f=ka(i.blend),u=ka(s.blend);f.mode==="add"&&u.mode==="add"&&(a.blend=`AS${o(f.source,u.source)*256}D${o(f.destination,u.destination)*256}`)}return a}function ih(n){var r;const e=Ba(n.collisionAnimation??n.animation??((r=n.animations)==null?void 0:r.get(n.anim)),n.collisionFrameIndex??n.frameIndex,n.collisionFrameTime??n.frameTime)??n.collisionFrame??n.currentFrame;if(!e)return null;const t=Zc(n);if(t===n)return e;const i=(a,o)=>{var l,c;return((c=(l=a.program)==null?void 0:l.constants)==null?void 0:c.get(o))??1},s=(a,o)=>{const l=Dt(n)*i(n,o);return l?(e[a]||0)*Dt(t)*i(t,o)/l:0};return{...e,x:s("x","size.xscale"),y:s("y","size.yscale")}}function Pl(n,e,t,i,s,r,a=256){if(!i)return[0];if(!Number.isFinite(t)||t<=0||!Number.isFinite(e)||e<=0)return[];let o=i===1?Math.floor((s-n-e)/t):0,l=i===1?Math.ceil((r-n)/t):Math.max(0,Math.trunc(i)-1);return Math.max(0,l-o+1)>a&&(l=o+a-1),Array.from({length:Math.max(0,l-o+1)},(f,u)=>o+u)}function Il(n,e,t=0){return n.animated?n.spacing[t]:e+n.spacing[t]}const Rf=(n,e)=>Array.isArray(n)?n.slice(0,3).map((t,i)=>Number(t??e[i])):[...e],Cf=(n,e=0,t=255)=>Math.max(e,Math.min(t,n)),Cn=(n,e={})=>({...e,...n,age:0,remaining:n.time??e.time??1}),Kt=n=>n&&(n.remaining<0||n.remaining>0);function ta(n){n&&(n.age++,n.remaining>0&&n.remaining--)}class Pf{constructor(){this.palettes=new Map,this.afterimages=new Map,this.all=null,this.background=null,this.shake=null,this.environment=null,this.diagnostics=[]}advance({paused:e=()=>!1,backgroundPaused:t=!1}={}){for(const[i,s]of this.palettes)e(i)||ta(s),Kt(s)||this.palettes.delete(i);for(const[i,s]of this.afterimages)e(i)||ta(s),Kt(s)||this.afterimages.delete(i);if(!t)for(const i of[this.all,this.background,this.shake,this.environment])ta(i)}consume(e,{entity:t}={}){for(const i of e||[]){const s=String(i.type).toLowerCase();if(s==="palfx"&&t){const r=hr(t),a=Cn(ur(i));Kt(a)?this.palettes.set(r,a):this.palettes.delete(r)}else if(s==="allpalfx")this.all=Cn(ur(i));else if(s==="bgpalfx")this.background=Cn(ur(i));else if(s==="envshake"){const r=i.coordinateScale??(t==null?void 0:t.coordinateScale)??1;this.shake=Cn(i,{time:0,freq:60,ampl:-4/r,phase:i.freq>=90?90:0,coordinateScale:r})}else if(s==="envcolor")this.environment=Cn(i,{value:[255,255,255],under:0});else if(s==="palettesnapshot"&&i.target)i.target.paletteSnapshot={layers:[],key:"[]"};else if(s==="afterimage"&&t){const r=Cn(i,{time:1,length:20,timegap:1,framegap:4,palcolor:256,palbright:[30,30,30],palcontrast:[120,120,220],palpostbright:[0,0,0],paladd:[10,10,25],palmul:[.65,.65,.75],trans:"none"});r.length=Cf(Math.trunc(r.length),0,60),r.timegap=Math.max(1,Math.trunc(r.timegap)),r.framegap=Math.max(1,Math.trunc(r.framegap)),r.frames=[],Kt(r)&&r.length?this.afterimages.set(t,r):this.afterimages.delete(t)}else if(s==="afterimagetime"&&this.afterimages.has(t)){const r=this.afterimages.get(t);r.remaining=i.time??i.value??0,Kt(r)||this.afterimages.delete(t)}}}capture(e,{paused:t=()=>!1}={}){for(const i of e){const s=this.afterimages.get(i);if(!Kt(s)||t(i)||s.age%s.timegap!==0||s.lastAge===s.age)continue;const r=ih(i);r&&(s.lastAge=s.age,s.frames.unshift({entity:i,frame:{...r},pos:{...i.pos},facing:i.facing,coordinateScale:Dt(i),character:i.character,drawScale:{...i.drawScale},drawOffset:{...i.drawOffset},angle:i.angleDraw?i.angle:0,sizeX:i.constant("size.xscale"),sizeY:i.constant("size.yscale"),paletteRemaps:new Map(i.paletteRemaps)}),s.frames.length=Math.min(s.frames.length,s.length))}}paletteFor(e,{ownpal:t=(e==null?void 0:e.ownPal)??(e==null?void 0:e.ownpal),ignoreLocal:i=!1,includeAll:s=!0}={}){const r=i?null:t?e:hr(e),a=this.palettes.get(r);let o=Kt(a)?[a]:[];return o=[...o,...s&&Kt(this.all)?[this.all]:[]].map(l=>Object.fromEntries(Object.entries(l).map(([c,f])=>[c,Array.isArray(f)?[...f]:f]))),{layers:o,key:JSON.stringify(o.map(({add:l,mul:c,sinadd:f,color:u,invertall:h,age:d})=>({add:l,mul:c,sinadd:f,color:u,invertall:h,age:f?d:0})))}}get backgroundPalette(){const e=[this.background,this.all].filter(Kt);return{layers:e,key:JSON.stringify(e)}}get cameraOffset(){if(!Kt(this.shake))return{x:0,y:0};const e=this.shake;return{x:0,y:-Number(e.ampl)*e.coordinateScale*Math.sin((Number(e.phase)+e.age*Number(e.freq))*Math.PI/180)}}get environmentColor(){return Kt(this.environment)?this.environment:null}trailsFor(e){const t=this.afterimages.get(e);if(!Kt(t))return[];const i=[];for(let s=0;s<t.frames.length;s+=t.framegap){const r=[{color:t.palcolor,invertall:t.palinvertall,add:t.palbright,mul:t.palcontrast,postadd:t.palpostbright}];for(let a=0;a<s;a++)r.push({add:t.paladd,mul:Rf(t.palmul,[1,1,1]).map(o=>o*256)});Kt(this.all)&&r.push(this.all),i.push({...t.frames[s],palette:{layers:r,key:JSON.stringify(r)},trans:t.trans})}return i.reverse()}cleanup(e,{paletteOwners:t=e}={}){const i=new Set(e),s=new Set;for(const r of t){const a=hr(r);a&&s.add(a)}for(const r of this.palettes.keys())s.has(r)||this.palettes.delete(r);for(const r of this.afterimages.keys())i.has(r)||this.afterimages.delete(r)}}const ke=127,We=125,Vn=124,If=new Set("time stateno prevstateno anim animtime ctrl life lifemax power powermax facing alive gametime hitpausetime hitshakeover hitover movecontact movehit moveguarded movereversed hitcount uniqhitcount numenemy numpartner numproj roundstate roundno matchno teamside teampower tickspersecond ailevel palno id win lose drawgame inguarddist canrecover roundsexisted hitfall ishometeam winko wintime winperfect loseko losetime loseperfect".split(" ")),Lf=new Set("pos x|pos y|vel x|vel y|p2dist x|p2dist y|p2bodydist x|p2bodydist y|parentdist x|parentdist y|rootdist x|rootdist y|screenpos x|screenpos y|hitvel x|hitvel y|camerapos x|camerapos y|camerazoom|gamewidth|gameheight|screenwidth|screenheight|leftedge|rightedge|topedge|bottomedge|frontedge|backedge|frontedgedist|backedgedist|frontedgebodydist|backedgebodydist".split("|")),Df=new Set("var sysvar animelemtime animelemno animexist selfanimexist numprojid playeridexist projcanceltime projcontacttime projguardedtime projhittime numhelper numexplod numtarget ishelper".split(" ")),Nf=new Set(["fvar","sysfvar","const240p","const480p","const720p"]),Uf=new Set("name authorname p1name p2name p3name p4name statetype movetype physics p2statetype p2movetype teammode".split(" ")),Ff=new Set("xveladd yveladd xoff yoff zoff xvel yvel yaccel fall.xvel fall.yvel fall.envshake.freq fall.envshake.phase".split(" ")),Ar=["sin","cos","tan","asin","acos","atan","exp","ln"],Of=new TextEncoder,xi=n=>{const e=[];do{const t=n&127;n>>>=7,e.push(t|(n?128:0))}while(n);return e},kf=n=>{n|=0;const e=[];for(;;){const t=n&127;n>>=7;const i=n===0&&!(t&64)||n===-1&&!!(t&64);if(e.push(t|(i?0:128)),i)return e}},ia=n=>{const e=Of.encode(n);return[...xi(e.length),...e]},un=n=>[...xi(n.length),...n.flat()],os=(n,e)=>[n,...xi(e.length),...e],ri=n=>[65,...kf(n)],Ha=n=>{const e=new Uint8Array(4);return new DataView(e.buffer).setFloat32(0,n,!0),[67,...e]},na=[68,0,0,0,0,0,0,0,0],Wn=n=>[16,...xi(n)],ai=n=>[32,...xi(n)],Pn=n=>[33,...xi(n)],fi=(n,e)=>n.type===e?n.code:[...n.code,n.type===ke?e===We?178:183:187],Os=n=>n.type===ke?[...n.code,69,69]:[...n.code,...Ha(0),92],ls=n=>[...n,...Wn(2)],ft=(n,e)=>({type:n,code:e});class Ji extends Error{}class cs extends Error{}class Bf{constructor(e){this.trigger=e,this.locals=[]}local(e){return this.locals.push(e),this.locals.length-1}read(e,t=[]){const i=Lf.has(e)||Nf.has(e)?We:If.has(e)||Df.has(e)?ke:null;if(!i||t.length>2)throw new Ji;const s=[...ri(this.trigger(e)),...ri(t.length)];for(let r=0;r<2;r++)s.push(...t[r]?fi(this.node(t[r]),Vn):na);return s.push(...Wn(i===ke?0:1)),ft(i,s)}literal(e,t=ke){return ft(t,[...ri(this.trigger(e)),...ri(0),...na,...na,...Wn(t===ke?0:1)])}node(e){var t;if(e.kind==="number"){if(e.float&&!Number.isFinite(Math.fround(e.value)))throw new Ji;return ft(e.float?We:ke,e.float?Ha(e.value):ri(e.value))}if(e.kind==="name")return e.name==="pi"||e.name==="e"?ft(We,Ha(e.name==="pi"?Math.PI:Math.E)):this.read(e.name);if(e.kind==="unary"){const i=this.node(e.value);if(e.op==="+")return i;if(e.op==="!")return ft(ke,[...Os(i),69]);if(e.op==="-")return ft(i.type,i.type===ke?[...ri(0),...i.code,107]:[...i.code,140]);if(e.op==="~"&&i.type===ke)return ft(ke,[...i.code,...ri(-1),115]);throw new Ji}if(e.kind==="legacyanim")return this.binary(e.op,this.read("animelemtime",[e.element]),this.node(e.time));if(e.kind==="legacytime"){if(e.divisor.value<=0)throw new Ji;return this.binary(e.op,this.binary("%",this.read("time"),this.node(e.divisor)),this.node(e.remainder))}if(e.kind==="range"){const i=[this.node(e.left),this.node(e.low),this.node(e.high)],s=i.some(l=>l.type===We)?We:ke,r=i.map(()=>this.local(s)),a=[];i.forEach((l,c)=>a.push(...fi(l,s),...Pn(r[c])));const o=l=>ft(s,ai(r[l]));return a.push(...this.binary(e.includeLow?">=":">",o(0),o(1)).code,...this.binary(e.includeHigh?"<=":"<",o(0),o(2)).code,113),e.op==="!="&&a.push(69),ft(ke,a)}if(e.kind==="command"){const i=this.literal({name:"command",args:[e.command]});return e.op==="="?i:ft(ke,[...i.code,69])}if(e.kind==="legacyattribute"){const i=this.literal({name:"hitdefattr",args:e.attributes});return e.op==="="?i:ft(ke,[...i.code,69])}if(e.kind==="binary")return["=","!="].includes(e.op)&&e.left.kind==="name"&&Uf.has(e.left.name)&&e.right.kind==="string"?this.literal({name:e.left.name,match:e.right.value,invert:e.op==="!="}):this.binary(e.op,this.node(e.left),this.node(e.right));if(e.kind==="call"){if(e.name==="cond"){const s=this.node(e.args[0]),r=this.node(e.args[1]),a=this.node(e.args[2]);if(r.type!==a.type)throw new Ji;return ft(r.type,[...Os(s),4,r.type,...r.code,5,...a.code,11])}if(["const","gethitvar"].includes(e.name)&&["name","string"].includes((t=e.args[0])==null?void 0:t.kind)){const s=e.args[0].name??e.args[0].value,r=e.name==="const"?/^(?:velocity\.|movement\.(?!airjump\.)|size\.[xy]scale$|data\.fall\.defence_mul$)/.test(s)?We:ke:Ff.has(s)?We:ke;return this.literal({name:e.name,args:[s]},r)}const i=e.args.map(s=>this.node(s));if(e.name==="abs"){const s=i[0];if(s.type===We)return ft(We,[...s.code,139]);const r=this.local(ke);return ft(ke,[...s.code,...Pn(r),...ai(r),...ri(0),72,4,ke,...ri(0),...ai(r),107,5,...ai(r),11])}if(e.name==="min"||e.name==="max"){if(i.some(a=>a.type===We))return ft(We,[...fi(i[0],We),...fi(i[1],We),e.name==="min"?150:151]);const s=this.local(ke),r=this.local(ke);return ft(ke,[...i[0].code,...Pn(s),...i[1].code,...Pn(r),...ai(s),...ai(r),e.name==="min"?72:74,4,ke,...ai(s),5,...ai(r),11])}return e.name==="ceil"||e.name==="floor"?ft(ke,[...fi(i[0],We),e.name==="ceil"?141:142,187,...Wn(3)]):e.name==="sqrt"?ft(We,ls([...fi(i[0],We),145])):Ar.includes(e.name)?ft(We,ls([...fi(i[0],We),...Wn(4+Ar.indexOf(e.name))])):e.name==="log"?ft(We,ls([...fi(i[0],We),...fi(i[1],We),...Wn(12)])):this.read(e.name,e.args)}throw new Ji}binary(e,t,i){if(["&&","||","^^"].includes(e))return ft(ke,[...Os(t),...Os(i),e==="&&"?113:e==="||"?114:115]);const s=t.type===We||i.type===We?We:ke,r=[...fi(t,s),...fi(i,s)],a={"=":[70,91],"!=":[71,92],"<":[72,93],">":[74,94],"<=":[76,95],">=":[78,96]};if(a[e])return ft(ke,[...r,a[e][+(s===We)]]);const o={"+":[106,146],"-":[107,147],"*":[108,148]};if(o[e])return r.push(o[e][+(s===We)]),ft(s,s===We?ls(r):r);if(e==="/"){if(s===We)return ft(We,ls([...r,149]));const l=this.local(ke),c=this.local(ke);return ft(ke,[...t.code,...Pn(l),...i.code,...Pn(c),...ai(l),...ri(-2147483648),70,...ai(c),...ri(-1),70,113,4,ke,...ri(-2147483648),5,...ai(l),...ai(c),109,11])}if(s===ke&&["%","&","|","^"].includes(e))return ft(ke,[...r,{"%":111,"&":113,"|":114,"^":115}[e]]);throw new Ji}}function Hf(n){const e=(a,o)=>[96,...un(a.map(l=>[l])),1,o],t=[e([ke,ke,Vn,Vn],ke),e([ke,ke,Vn,Vn],We),e([We],We),e([Vn],ke),e([We,We],We),e([],ke),e([],We)],i=[["readInt",0],["readFloat",1],["finite",2],["wrap",3],...Ar.map(a=>[a,2]),["log",4]].map(([a,o])=>[...ia("host"),...ia(a),0,...xi(o)]),s=n.map((a,o)=>[...ia("e"+o),0,...xi(i.length+o)]),r=n.map(a=>{const o=[];for(const c of a.locals){const f=o.at(-1);(f==null?void 0:f[1])===c?f[0]++:o.push([1,c])}const l=[...un(o.map(([c,f])=>[...xi(c),f])),...a.code,11];return[...xi(l.length),...l]});return new Uint8Array([0,97,115,109,1,0,0,0,...os(1,un(t)),...os(2,un(i)),...os(3,un(n.map(a=>xi(a.type===ke?5:6)))),...os(7,un(s)),...os(10,un(r))])}class zf{constructor(e=[],{maxFunctions:t=4096,maxBytes:i=2*1024*1024}={}){if(!Number.isInteger(t)||t<0||t>16384||!Number.isInteger(i)||i<0||i>16*1024*1024)throw RangeError("Invalid numeric compilation budget.");this.context=null,this.entries=new Map,this.triggers=[],this.counts={wasm:0,interpreted:0,deoptimized:0,compiled:0,bytes:0};const s=new Map,r=[],a=[],o=h=>{const d=JSON.stringify(h);return s.has(d)||(s.set(d,this.triggers.length),this.triggers.push(typeof h=="string"?{name:h}:h)),s.get(d)};let l=0;for(const h of new Set(e))if(!(typeof h!="string"||!h.trim()||r.length>=t))try{const d=new Bf(o),p=d.node(Gc(h));if((l+=p.code.length)>i)break;a.push({source:h,type:p.type}),r.push({...p,locals:d.locals})}catch(d){if(!(d instanceof Ji)&&!(d instanceof dt))throw d}if(!r.length)return;const c=(h,d,p,_,m)=>{if(typeof this.context.resolve!="function")throw new Qi("Trigger resolution is unavailable.");const v=this.triggers[h],S=this.context.resolve(v.name,v.args||(d===0?[]:d===1?[p]:[p,_]),null);let T=S;if(v.match!==void 0)if(S!=null&&S.absent)T=+v.invert;else if(typeof S=="string")T=+(S===v.match!=!!v.invert);else throw new cs;if(typeof S=="boolean")T=+S;else if(S&&typeof S.value=="number"){if(!m&&(S.type==="float"||S.float))throw new cs;T=S.value}if(typeof T!="number")throw new cs;if(!Number.isFinite(T))throw new Lt("Expression produced a non-finite number.");if(!m&&!Number.isInteger(T))throw new cs;if(m){if(T=Math.fround(T),!Number.isFinite(T))throw new Lt("Expression produced a non-finite number.");return T}return T|0},f={readInt:(...h)=>c(...h,!1),readFloat:(...h)=>c(...h,!0),finite:h=>{if(!Number.isFinite(h))throw new Lt("Expression produced a non-finite number.");return h},wrap:h=>h|0};for(const h of Ar)f[h]=Math[h==="ln"?"log":h];f.log=(h,d)=>Math.log(d)/Math.log(h),this.binary=Hf(r);const u=new WebAssembly.Instance(new WebAssembly.Module(this.binary),{host:f});a.forEach((h,d)=>this.entries.set(h.source,{...h,run:u.exports["e"+d]})),this.counts.compiled=this.entries.size,this.counts.bytes=this.binary.length}evaluate(e,t={}){const i=this.entries.get(e);if(!i)return this.counts.interpreted++,(t.typedResult?Ua:Na)(e,t);const s=this.context;this.context=t;try{const r=i.run();return this.counts.wasm++,t.typedResult?{value:r,float:i.type===We}:r}catch(r){if(r instanceof cs)return this.entries.delete(e),this.counts.deoptimized++,(t.typedResult?Ua:Na)(e,t);throw r instanceof WebAssembly.RuntimeError?new Lt("Invalid numeric operation.",e):r instanceof dt?(r.source||(r.source=e),r):r!=null&&r.bottom?new Lt(r.message,e):new dt((r==null?void 0:r.message)||"Trigger evaluation failed.",e)}finally{this.context=s}}get stats(){return{...this.counts,activeFunctions:this.entries.size}}}const Ll=th({orderedPhases:!0});function Gf(n){const e=new Set;for(const t of n)for(const i of t.states.values())for(const s of[i,...i.controllers])for(const r of s.entries){e.add(r.value);try{for(const a of gn(r.value))e.add(a)}catch{}}return e}const Vf=(n,e)=>{const t={entity:e};for(const[i,s]of Object.entries(n))(s===null||["number","string","boolean"].includes(typeof s)||Array.isArray(s))&&(t[i]=s);return t},ks=(n,e,t=0)=>{try{return n.constant(e)}catch{return t}};class Wf{constructor(e,t={}){this.files=e,this.selection=t,this.characters=mu(e);const i=this.characters.find(o=>o.path===t.character)||this.characters[0],s=this.characters.find(o=>o.path===t.opponent)||i;if(!i||!s)throw Error("No playable character definition found.");const r=new Map([...new Set([i,s])].map(o=>[o,eh(o,{commonText:Ll,constantsFromCnsOnly:!0})]));this.expressions=new zf(Gf(r.values())),this.commands=[i,s].map(o=>{var c;const l=(c=o.checks.find(f=>f.key==="cmd"&&f.ok))==null?void 0:c.path;return new ys(Oo(l?bn(e[l]):""))});const a=t.stage&&t.stage!=="builtin/grid"?lf(e).find(o=>o.path===t.stage):null;if(a!=null&&a.invalid)throw Error("Stage definition could not be parsed.");this.match=new Tf(i,{opponentCharacter:s,commonText:Ll,programs:r,manageInputs:!0,orderedPhases:!0,expressionEvaluator:(o,l)=>this.expressions.evaluate(o,l),stage:a,playerPalette:t.palette||1,opponentPalette:t.opponentPalette||2,skipIntro:t.mode==="training",playerAILevel:t.mode==="cpu"?t.level||4:0,opponentAILevel:["solo","cpu"].includes(t.mode)?t.level||4:0,rules:t.mode==="training"?null:{roundsToWin:2,preIntro:0,introHold:30}}),this.commands=[this.match.inputBuffers.get(this.match.player),this.match.inputBuffers.get(this.match.opponent)],this.effects=new Pf,this.banks=new Map,this.indices=new Map,this.bankIds=new Map,this.spriteMetadata=new Map,this.sent=new Set,this.assets=[],this.events=[],this.sparks=[],this.issues=new Map,this.closed=!1,this.capabilities={format:"kenjatime-core-coverage-v1",engine:"Kenjatime Core",independentRuntime:!0,universalCompatibility:!1,compiledNumericExpressions:!0,scriptInterpreter:!0,knownGaps:["Extended scripting languages","3D model stages and model shadows","Video background composition","Stage parallax and window clipping","Afterimage palette chains beyond eight layers","Full native moveset parity not yet established"]}}issue(e,t){const i=e+":"+t;this.issues.size<2e3&&this.issues.set(i,{type:e,message:t})}tick(e=new Set,t=new Set){if(this.closed)throw Error("Match is closed.");const i=this.match,s=r=>i.isFrozen(r)||r.hitPauseTime>0;this.effects.advance({paused:s}),i.tick(new Set,new Set,{playerInput:e,opponentInput:t}),this.commands=[i.inputBuffers.get(i.player),i.inputBuffers.get(i.opponent)];for(const r of i.eventEntities){this.effects.consume(r.events,{entity:r});for(const a of r.events)["playsnd","stopsnd","sndpan"].includes(a.type)&&this.events.push({...Vf(a,r.id),character:r.character.path})}for(const r of i.presentationEvents)this.effects.consume([r],{entity:r.entity||r.owner});for(const r of i.events)this.sparks.push({x:r.x,y:r.y,age:0,guarded:r.guarded});return this.sparks=this.sparks.filter(r=>++r.age<12),this.sparks.length>256&&this.sparks.splice(0,this.sparks.length-256),this.effects.capture([...i.entities,...i.drawProjectiles],{paused:s}),this.effects.cleanup(i.entities),this}bank(e){var t;if(!this.banks.has(e)){const i=(t=e.def)!=null&&t.files?Bc(e):Oc(e.files[e.sprite.path]);this.banks.set(e,i),this.bankIds.set(e,this.banks.size),this.indices.set(e,new Map(i.sprites.map((s,r)=>[s.group+","+s.number,r])))}return this.banks.get(e)}asset(e,t,i){var s,r;try{const a=this.bank(e),o=this.indices.get(e).get(t.group+","+t.number);if(o===void 0)return null;const l=this.bankIds.get(e),c=l+":"+o;let f=this.spriteMetadata.get(c);if(!f){const m=((s=a.decodeIndexed)==null?void 0:s.call(a,o))||a.decode(o),v=!!m.indices;f={w:m.w,h:m.h,x:m.x||0,y:m.y||0,palette:m.palette,indexed:v,colors:m.colors},this.assets.push({id:c,width:f.w,height:f.h,indexed:v,pixels:new Uint8Array(v?m.indices:m.rgba)}),this.sent.add(c),this.spriteMetadata.set(c,f),a.clearDecodedCache()}const u=f.indexed,h=a.sprites[o],d=(r=a.palettes)==null?void 0:r.find(m=>m.index===(f.palette??h.palette));let p=d?[d.group,d.number]:[1,1];p=(i==null?void 0:i.get(p.join(",")))||(i==null?void 0:i.get("*"))||p;const _=l+":pal:"+p.join(",");if(u&&!this.sent.has(_)){let m;try{m=a.paletteColors(...p)}catch{if(m=f.colors,!m)throw Error("Sprite palette is missing.");this.issue("palette","Requested palette "+p.join(",")+" is unavailable.")}const v=new Uint8Array(1024);v.set(m.subarray(0,1024)),this.assets.push({id:_,width:256,height:1,pixels:v,indexed:!1}),this.sent.add(_)}return{id:c,paletteId:_,indexed:u,w:f.w,h:f.h,x:f.x||0,y:f.y||0}}catch(a){return this.issue("sprite",a.message),null}}quad(e,t,i,{x:s=0,y:r=0,sx:a=1,sy:o=1,facing:l=1,angle:c=0,xangle:f=0,yangle:u=0,remaps:h=null,palette:d=null,trans:p=null,mask:_=!0,alpha:m=1,clip:v=null,corners:S=null}={}){var F,N,P;if(!i||e.length>=8192)return;const T=this.asset(t,i,h);if(!T)return;a*=l;const E=Af((i.angle||0)+c,f,u),b=(i.flip||"").includes("H")?-1:1,y=(i.flip||"").includes("V")?-1:1,g=a*b*(i.scaleX??1)*E.a,x=o*y*(i.scaleY??1)*E.b,I=a*b*(i.scaleX??1)*E.c,R=o*y*(i.scaleY??1)*E.d;if(![g,x,I,R,s,r,m].every(Number.isFinite)){this.issue("render-transform","A non-finite sprite transform was skipped.");return}((F=d==null?void 0:d.layers)==null?void 0:F.length)>8&&this.issue("palette-limit","This preview can render eight palette layers per sprite.");let A=i.blend||"";return typeof p=="string"?A=p:p&&p.mode!=="default"&&(A=p.mode==="sub"?"S":p.mode==="none"?"":p.mode==="add1"?"A1":`AS${((N=p.alpha)==null?void 0:N[0])??256}D${((P=p.alpha)==null?void 0:P[1])??256}`),e.push({texture:T.id,palette:T.paletteId,indexed:T.indexed,width:T.w,height:T.h,matrix:[g,x,I,R,s+(i.x||0)*a-g*T.x-I*T.y,r+(i.y||0)*o-x*T.x-R*T.y],blend:ka(A),mask:_,alpha:m,palFX:(d==null?void 0:d.layers)||[],clip:v,corners:S}),T}frame(){var h,d,p,_,m,v,S,T,E,b;const e=this.match,t=e.view,i=Math.min(960/320,540/(t.displayHeight||240)),s=((h=e.stage)==null?void 0:h.camera)||{x:0,y:0,zoom:1},r=(540-(t.displayHeight||240)*i)/2+(t.groundY||200)*i,a=i*s.zoom,o=[];this.assets=[];const l=y=>({x:480+(y.x-s.x)*a,y:r+(y.y-s.y)*a}),c=y=>{const g=e.stage;if(!(g!=null&&g.definition.sprite))return;const x=g.definition,I=x.coordinateScale*(x.backgroundScale||1);for(const[R,A]of g.elements.entries()){if(A.layer!==y||!A.enabled||!A.visible||A.type==="dummy")continue;const F=A.animated?Ba(g.animations.get(A.anim),A.drawFrameIndex??A.frameIndex,A.drawFrameTime??A.frameTime):g.frame(A),N=g.position(R);if(!F)continue;const P=this.asset(x,F);if(!P)continue;const k=1+(s.zoom-1)*A.zoomDelta,H=I*i*k*x.xscale*(A.scaleStart[0]+s.y/I*A.scaleDelta[0]),B=I*i*k*x.yscale*(A.scaleStart[1]+s.y/I*A.scaleDelta[1]),C=480+(N.x*I-s.x*N.delta[0])*a,L=r+(N.y*I-(t.zoffset||0)-s.y*N.delta[1])*a,V=Il(A,P.w)*Math.abs(H),$=Il(A,P.h,1)*Math.abs(B),ie=Pl(C-P.x*H,P.w*Math.abs(H),V,A.tile[0],0,960),ne=Pl(L-P.y*B,P.h*Math.abs(B),$,A.tile[1],0,540);for(const G of ne)for(const se of ie){if(o.length>=8192){this.issue("resource-limit","Visible quad budget exceeded.");break}this.quad(o,x,F,{x:C+se*V,y:L+G*$,sx:H,sy:B,mask:A.mask,trans:A.transSpecified?{mode:A.trans,alpha:A.alpha}:null,palette:this.effects.backgroundPalette})}A.type==="parallax"&&this.issue("stage","Parallax perspective is pending; this preview uses the authored base scale.")}};c(0);const f=[];for(const y of[...e.renderEntities,...e.drawProjectiles]){!y.destroyed&&!y.asserted.has("invisible")&&f.push({priority:y.sprPriority||0,actor:y});for(const g of y.drawExplods||[])f.push({priority:g.ontop?1e3:g.sprpriority||0,actor:y,effect:g})}f.sort((y,g)=>y.priority-g.priority);for(const{actor:y,effect:g}of f){if(g){if(g.common){this.issue("common-effects","Character requested an unavailable shared effect animation.");continue}const I=g.space==="screen"?{x:g.pos.x*i,y:g.pos.y*i}:l(g.pos),R=(g.coordinateScale??Dt(y))*a;this.quad(o,y.character,Ba(g.animation,g.frameIndex,g.frameTime),{...I,sx:R*(((d=g.scale)==null?void 0:d[0])??1),sy:R*(((p=g.scale)==null?void 0:p[1])??1)*(g.vfacing||1),facing:g.facing,angle:g.angle||0,xangle:g.xangle||0,yangle:g.yangle||0,remaps:g.ownpal?g.paletteRemaps:y.paletteRemaps,palette:this.effects.paletteFor(g.source||y),trans:g.trans});continue}for(const I of this.effects.trailsFor(y)){const R=l({x:I.pos.x+(((_=I.drawOffset)==null?void 0:_.x)||0),y:I.pos.y+(((m=I.drawOffset)==null?void 0:m.y)||0)}),A=a*I.coordinateScale;this.quad(o,I.character,I.frame,{...R,sx:A*I.sizeX*(I.drawScale.x??1),sy:A*I.sizeY*(I.drawScale.y??1),facing:I.facing,angle:I.angle,remaps:I.paletteRemaps,palette:I.palette,trans:I.trans})}const x=l({x:y.pos.x+(((v=y.drawOffset)==null?void 0:v.x)||0)+ks(y,"size.draw.offset.x")*Dt(y)*y.facing,y:y.pos.y+(((S=y.drawOffset)==null?void 0:S.y)||0)+ks(y,"size.draw.offset.y")*Dt(y)});this.quad(o,y.character,ih(y),{...x,sx:a*Dt(y)*ks(y,"size.xscale",1)*(((T=y.drawScale)==null?void 0:T.x)??1),sy:a*Dt(y)*ks(y,"size.yscale",1)*(((E=y.drawScale)==null?void 0:E.y)??1),facing:y.facing,angle:y.angleDraw?y.angle:0,remaps:y.paletteRemaps,palette:this.effects.paletteFor(y),trans:y.trans})}c(1);const u=this.sparks.map(y=>({...l(y),age:y.age,guarded:y.guarded}));return{width:960,height:540,draws:o,assets:this.assets,sparks:u,ground:r,grid:!e.stage,players:[e.player,e.opponent].map(y=>({id:y.id,name:y.name,x:y.pos.x,y:y.pos.y,life:y.life,maxLife:y.maxLife,power:y.power,maxPower:y.maxPower,state:y.stateNo,time:y.time,anim:y.anim})),ticks:e.ticks,roundState:((b=e.roundFlow)==null?void 0:b.roundState)??2,paused:!1,expressions:this.expressions.stats}}snapshot(){var e;return{engine:"Kenjatime Core",players:[this.match.player,this.match.opponent].map(t=>({id:t.id,name:t.name,x:t.pos.x,y:t.pos.y,life:t.life,maxLife:t.maxLife,power:t.power,maxPower:t.maxPower,state:t.stateNo,time:t.time,anim:t.anim})),ticks:this.match.ticks,roundState:((e=this.match.roundFlow)==null?void 0:e.roundState)??2,expressions:this.expressions.stats,capabilities:this.capabilities,diagnostics:[...this.match.diagnostics,...this.issues.values()]}}drainEvents(){const e=this.events;return this.events=[],e}close(){this.closed=!0;for(const e of this.banks.values())e.clearDecodedCache();this.banks.clear(),this.sent.clear(),this.events=[]}}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Bo="187",Xf=0,Dl=1,qf=2,gr=1,$f=2,gs=3,yn=0,Yt=1,_i=2,Kn=0,Ss=1,Nl=2,Ul=3,Fl=4,nh=5,Bi=100,Yf=101,sh=102,Kf=103,Zf=104,Jf=200,za=201,jf=202,Qf=203,rh=204,Rr=205,ed=206,td=207,id=208,nd=209,sd=210,rd=211,ad=212,od=213,ld=214,Ga=0,Va=1,Wa=2,Ms=3,Xa=4,qa=5,$a=6,Ya=7,ah=0,cd=1,hd=2,Hi=0,oh=1,lh=2,ch=3,hh=4,uh=5,fh=6,dh=7,ph=300,jn=301,ws=302,sa=303,ra=304,Ka=1e3,Ri=1001,Za=1002,Pt=1003,ud=1004,Bs=1005,$t=1006,aa=1007,nn=1008,Qt=1009,mh=1010,gh=1011,bs=1012,Ho=1013,Ii=1014,Ci=1015,Li=1016,zo=1017,Go=1018,Qn=1020,vh=35902,xh=35899,_h=1021,yh=1022,Si=1023,rn=1026,sn=1027,Vo=1028,Wo=1029,Sn=1030,Xo=1031,qo=1033,vr=33776,xr=33777,_r=33778,yr=33779,Ja=35840,ja=35841,Qa=35842,eo=35843,to=36196,io=37492,no=37496,so=37488,ro=37489,Cr=37490,ao=37491,oo=37808,lo=37809,co=37810,ho=37811,uo=37812,fo=37813,po=37814,mo=37815,go=37816,vo=37817,xo=37818,_o=37819,yo=37820,So=37821,Mo=36492,wo=36494,bo=36495,Eo=36283,To=36284,Pr=36285,Ao=36286,fd=3200,Ol=0,dd=1,en="",li="srgb",Es="srgb-linear",Ir="linear",ot="srgb",oa=7680,pd=519,md=512,gd=513,vd=514,Sh=515,xd=516,_d=517,Mh=518,wh=519,yd=35044,Lr="300 es",Mi=2e3,Dr=2001;function Sd(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Nr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Md(){const n=Nr("canvas");return n.style.display="block",n}const kl={};function Bl(...n){const e="THREE."+n.shift();console.log(e,...n)}function bh(n){const e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Ne(...n){n=bh(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function it(...n){n=bh(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function Sr(...n){const e=n.join(" ");e in kl||(kl[e]=!0,Ne(...n))}function wd(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}const bd={[Ga]:Ga,[Wa]:$a,[Xa]:Xa,[Ms]:qa,[Va]:Va,[$a]:Wa,[Ya]:Ya,[qa]:Ms};class En{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Ot=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],la=Math.PI/180,Ro=180/Math.PI;function As(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Ot[n&255]+Ot[n>>8&255]+Ot[n>>16&255]+Ot[n>>24&255]+"-"+Ot[e&255]+Ot[e>>8&255]+"-"+Ot[e>>16&15|64]+Ot[e>>24&255]+"-"+Ot[t&63|128]+Ot[t>>8&255]+"-"+Ot[t>>16&255]+Ot[t>>24&255]+Ot[i&255]+Ot[i>>8&255]+Ot[i>>16&255]+Ot[i>>24&255]).toLowerCase()}function Ke(n,e,t){return Math.max(e,Math.min(t,n))}function Ed(n,e){return(n%e+e)%e}function ca(n,e,t){return(1-t)*n+t*e}function Td(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function $o(n){switch(n.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function Ad(n,e){if(e.constructor===Float32Array)return n;const t=$o(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(n/t,-1)}function Rd(n,e){if(e.constructor===Float32Array)return n;const t=$o(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(n*t)}const jo=class jo{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ke(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ke(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};jo.prototype.isVector2=!0;let nt=jo;class is{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let l=i[s+0],c=i[s+1],f=i[s+2],u=i[s+3],h=r[a+0],d=r[a+1],p=r[a+2],_=r[a+3];if(u!==_||l!==h||c!==d||f!==p){let m=l*h+c*d+f*p+u*_;m<0&&(h=-h,d=-d,p=-p,_=-_,m=-m);let v=1-o;if(m<.9995){const S=Math.acos(m),T=Math.sin(S);v=Math.sin(v*S)/T,o=Math.sin(o*S)/T,l=l*v+h*o,c=c*v+d*o,f=f*v+p*o,u=u*v+_*o}else{l=l*v+h*o,c=c*v+d*o,f=f*v+p*o,u=u*v+_*o;const S=1/Math.sqrt(l*l+c*c+f*f+u*u);l*=S,c*=S,f*=S,u*=S}}e[t]=l,e[t+1]=c,e[t+2]=f,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,s,r,a){const o=i[s],l=i[s+1],c=i[s+2],f=i[s+3],u=r[a],h=r[a+1],d=r[a+2],p=r[a+3];return e[t]=o*p+f*u+l*d-c*h,e[t+1]=l*p+f*h+c*u-o*d,e[t+2]=c*p+f*d+o*h-l*u,e[t+3]=f*p-o*u-l*h-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),f=o(s/2),u=o(r/2),h=l(i/2),d=l(s/2),p=l(r/2);switch(a){case"XYZ":this._x=h*f*u+c*d*p,this._y=c*d*u-h*f*p,this._z=c*f*p+h*d*u,this._w=c*f*u-h*d*p;break;case"YXZ":this._x=h*f*u+c*d*p,this._y=c*d*u-h*f*p,this._z=c*f*p-h*d*u,this._w=c*f*u+h*d*p;break;case"ZXY":this._x=h*f*u-c*d*p,this._y=c*d*u+h*f*p,this._z=c*f*p+h*d*u,this._w=c*f*u-h*d*p;break;case"ZYX":this._x=h*f*u-c*d*p,this._y=c*d*u+h*f*p,this._z=c*f*p-h*d*u,this._w=c*f*u+h*d*p;break;case"YZX":this._x=h*f*u+c*d*p,this._y=c*d*u+h*f*p,this._z=c*f*p-h*d*u,this._w=c*f*u-h*d*p;break;case"XZY":this._x=h*f*u-c*d*p,this._y=c*d*u-h*f*p,this._z=c*f*p+h*d*u,this._w=c*f*u+h*d*p;break;default:Ne("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],f=t[6],u=t[10],h=i+o+u;if(h>0){const d=.5/Math.sqrt(h+1);this._w=.25/d,this._x=(f-l)*d,this._y=(r-c)*d,this._z=(a-s)*d}else if(i>o&&i>u){const d=2*Math.sqrt(1+i-o-u);this._w=(f-l)/d,this._x=.25*d,this._y=(s+a)/d,this._z=(r+c)/d}else if(o>u){const d=2*Math.sqrt(1+o-i-u);this._w=(r-c)/d,this._x=(s+a)/d,this._y=.25*d,this._z=(l+f)/d}else{const d=2*Math.sqrt(1+u-i-o);this._w=(a-s)/d,this._x=(r+c)/d,this._y=(l+f)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ke(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,f=t._w;return this._x=i*f+a*o+s*c-r*l,this._y=s*f+a*l+r*o-i*c,this._z=r*f+a*c+i*l-s*o,this._w=a*f-i*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let i=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),f=Math.sin(c);l=Math.sin(l*c)/f,t=Math.sin(t*c)/f,this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Qo=class Qo{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Hl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Hl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*i),f=2*(o*t-r*s),u=2*(r*i-a*t);return this.x=t+l*c+a*u-o*f,this.y=i+l*f+o*c-r*u,this.z=s+l*u+r*f-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this.z=Ke(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this.z=Ke(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ke(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-i*l,this.z=i*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return ha.copy(this).projectOnVector(e),this.sub(ha)}reflect(e){return this.sub(ha.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ke(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Qo.prototype.isVector3=!0;let K=Qo;const ha=new K,Hl=new is,el=class el{constructor(e,t,i,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c)}set(e,t,i,s,r,a,o,l,c){const f=this.elements;return f[0]=e,f[1]=s,f[2]=o,f[3]=t,f[4]=r,f[5]=l,f[6]=i,f[7]=a,f[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],f=i[4],u=i[7],h=i[2],d=i[5],p=i[8],_=s[0],m=s[3],v=s[6],S=s[1],T=s[4],E=s[7],b=s[2],y=s[5],g=s[8];return r[0]=a*_+o*S+l*b,r[3]=a*m+o*T+l*y,r[6]=a*v+o*E+l*g,r[1]=c*_+f*S+u*b,r[4]=c*m+f*T+u*y,r[7]=c*v+f*E+u*g,r[2]=h*_+d*S+p*b,r[5]=h*m+d*T+p*y,r[8]=h*v+d*E+p*g,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],f=e[8];return t*a*f-t*o*c-i*r*f+i*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],f=e[8],u=f*a-o*c,h=o*l-f*r,d=c*r-a*l,p=t*u+i*h+s*d;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/p;return e[0]=u*_,e[1]=(s*c-f*i)*_,e[2]=(o*i-s*a)*_,e[3]=h*_,e[4]=(f*t-s*l)*_,e[5]=(s*r-o*t)*_,e[6]=d*_,e[7]=(i*l-c*t)*_,e[8]=(a*t-i*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return Sr("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(ua.makeScale(e,t)),this}rotate(e){return Sr("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(ua.makeRotation(-e)),this}translate(e,t){return Sr("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(ua.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};el.prototype.isMatrix3=!0;let Fe=el;const ua=new Fe,zl=new Fe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Gl=new Fe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Cd(){const n={enabled:!0,workingColorSpace:Es,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ot&&(s.r=zi(s.r),s.g=zi(s.g),s.b=zi(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ot&&(s.r=Zn(s.r),s.g=Zn(s.g),s.b=Zn(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===en?Ir:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[a].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Es]:{primaries:e,whitePoint:i,transfer:Ir,toXYZ:zl,fromXYZ:Gl,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:li},outputColorSpaceConfig:{drawingBufferColorSpace:li}},[li]:{primaries:e,whitePoint:i,transfer:ot,toXYZ:zl,fromXYZ:Gl,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:li}}}),n}const Ye=Cd();function zi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Zn(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let In;class Pd{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{In===void 0&&(In=Nr("canvas")),In.width=e.width,In.height=e.height;const s=In.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=In}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Nr("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=zi(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(zi(t[i]/255)*255):t[i]=zi(t[i]);return{data:t,width:e.width,height:e.height}}else return Ne("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Id=0;class Yo{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Id++}),this.uuid=As(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width||0,t.height||0,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(fa(s[a].image)):r.push(fa(s[a]))}else r=fa(s);i.url=r}return t||(e.images[this.uuid]=i),i}}function fa(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Pd.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Ne("Texture: Unable to serialize Texture."),{})}let Ld=0;const da=new K;class Wt extends En{constructor(e=Wt.DEFAULT_IMAGE,t=Wt.DEFAULT_MAPPING,i=Ri,s=Ri,r=$t,a=nn,o=Si,l=Qt,c=Wt.DEFAULT_ANISOTROPY,f=en){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ld++}),this.uuid=As(),this.name="",this.source=new Yo(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new nt(0,0),this.repeat=new nt(1,1),this.center=new nt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Fe,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=f,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(da).x}get height(){return this.source.getSize(da).y}get depth(){return this.source.getSize(da).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){Ne(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ne(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==ph)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ka:e.x=e.x-Math.floor(e.x);break;case Ri:e.x=e.x<0?0:1;break;case Za:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ka:e.y=e.y-Math.floor(e.y);break;case Ri:e.y=e.y<0?0:1;break;case Za:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Wt.DEFAULT_IMAGE=null;Wt.DEFAULT_MAPPING=ph;Wt.DEFAULT_ANISOTROPY=1;const tl=class tl{constructor(e=0,t=0,i=0,s=1){this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r;const l=e.elements,c=l[0],f=l[4],u=l[8],h=l[1],d=l[5],p=l[9],_=l[2],m=l[6],v=l[10];if(Math.abs(f-h)<.01&&Math.abs(u-_)<.01&&Math.abs(p-m)<.01){if(Math.abs(f+h)<.1&&Math.abs(u+_)<.1&&Math.abs(p+m)<.1&&Math.abs(c+d+v-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const T=(c+1)/2,E=(d+1)/2,b=(v+1)/2,y=(f+h)/4,g=(u+_)/4,x=(p+m)/4;return T>E&&T>b?T<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(T),s=y/i,r=g/i):E>b?E<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(E),i=y/s,r=x/s):b<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(b),i=g/r,s=x/r),this.set(i,s,r,t),this}let S=Math.sqrt((m-p)*(m-p)+(u-_)*(u-_)+(h-f)*(h-f));return Math.abs(S)<.001&&(S=1),this.x=(m-p)/S,this.y=(u-_)/S,this.z=(h-f)/S,this.w=Math.acos((c+d+v-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this.z=Ke(this.z,e.z,t.z),this.w=Ke(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this.z=Ke(this.z,e,t),this.w=Ke(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ke(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};tl.prototype.isVector4=!0;let _t=tl;class Dd extends En{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:$t,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new _t(0,0,e,t),this.scissorTest=!1,this.viewport=new _t(0,0,e,t),this.textures=[];const s=i.count;for(let r=0;r<s;r++)this.textures[r]=new Wt({width:e,height:t,depth:i.depth}),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:$t,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Yo(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Pi extends Dd{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Eh extends Wt{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Pt,this.minFilter=Pt,this.wrapR=Ri,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Nd extends Wt{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Pt,this.minFilter=Pt,this.wrapR=Ri,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}const Or=class Or{constructor(e,t,i,s,r,a,o,l,c,f,u,h,d,p,_,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c,f,u,h,d,p,_,m)}set(e,t,i,s,r,a,o,l,c,f,u,h,d,p,_,m){const v=this.elements;return v[0]=e,v[4]=t,v[8]=i,v[12]=s,v[1]=r,v[5]=a,v[9]=o,v[13]=l,v[2]=c,v[6]=f,v[10]=u,v[14]=h,v[3]=d,v[7]=p,v[11]=_,v[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Or().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,i=e.elements,s=1/Ln.setFromMatrixColumn(e,0).length(),r=1/Ln.setFromMatrixColumn(e,1).length(),a=1/Ln.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),f=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const h=a*f,d=a*u,p=o*f,_=o*u;t[0]=l*f,t[4]=-l*u,t[8]=c,t[1]=d+p*c,t[5]=h-_*c,t[9]=-o*l,t[2]=_-h*c,t[6]=p+d*c,t[10]=a*l}else if(e.order==="YXZ"){const h=l*f,d=l*u,p=c*f,_=c*u;t[0]=h+_*o,t[4]=p*o-d,t[8]=a*c,t[1]=a*u,t[5]=a*f,t[9]=-o,t[2]=d*o-p,t[6]=_+h*o,t[10]=a*l}else if(e.order==="ZXY"){const h=l*f,d=l*u,p=c*f,_=c*u;t[0]=h-_*o,t[4]=-a*u,t[8]=p+d*o,t[1]=d+p*o,t[5]=a*f,t[9]=_-h*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const h=a*f,d=a*u,p=o*f,_=o*u;t[0]=l*f,t[4]=p*c-d,t[8]=h*c+_,t[1]=l*u,t[5]=_*c+h,t[9]=d*c-p,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const h=a*l,d=a*c,p=o*l,_=o*c;t[0]=l*f,t[4]=_-h*u,t[8]=p*u+d,t[1]=u,t[5]=a*f,t[9]=-o*f,t[2]=-c*f,t[6]=d*u+p,t[10]=h-_*u}else if(e.order==="XZY"){const h=a*l,d=a*c,p=o*l,_=o*c;t[0]=l*f,t[4]=-u,t[8]=c*f,t[1]=h*u+_,t[5]=a*f,t[9]=d*u-p,t[2]=p*u-d,t[6]=o*f,t[10]=_*u+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Ud,e,Fd)}lookAt(e,t,i){const s=this.elements;return Zt.subVectors(e,t),Zt.lengthSq()===0&&(Zt.z=1),Zt.normalize(),qi.crossVectors(i,Zt),qi.lengthSq()===0&&(Math.abs(i.z)===1?Zt.x+=1e-4:Zt.z+=1e-4,Zt.normalize(),qi.crossVectors(i,Zt)),qi.normalize(),Hs.crossVectors(Zt,qi),s[0]=qi.x,s[4]=Hs.x,s[8]=Zt.x,s[1]=qi.y,s[5]=Hs.y,s[9]=Zt.y,s[2]=qi.z,s[6]=Hs.z,s[10]=Zt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],f=i[1],u=i[5],h=i[9],d=i[13],p=i[2],_=i[6],m=i[10],v=i[14],S=i[3],T=i[7],E=i[11],b=i[15],y=s[0],g=s[4],x=s[8],I=s[12],R=s[1],A=s[5],F=s[9],N=s[13],P=s[2],k=s[6],H=s[10],B=s[14],C=s[3],L=s[7],V=s[11],$=s[15];return r[0]=a*y+o*R+l*P+c*C,r[4]=a*g+o*A+l*k+c*L,r[8]=a*x+o*F+l*H+c*V,r[12]=a*I+o*N+l*B+c*$,r[1]=f*y+u*R+h*P+d*C,r[5]=f*g+u*A+h*k+d*L,r[9]=f*x+u*F+h*H+d*V,r[13]=f*I+u*N+h*B+d*$,r[2]=p*y+_*R+m*P+v*C,r[6]=p*g+_*A+m*k+v*L,r[10]=p*x+_*F+m*H+v*V,r[14]=p*I+_*N+m*B+v*$,r[3]=S*y+T*R+E*P+b*C,r[7]=S*g+T*A+E*k+b*L,r[11]=S*x+T*F+E*H+b*V,r[15]=S*I+T*N+E*B+b*$,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],f=e[2],u=e[6],h=e[10],d=e[14],p=e[3],_=e[7],m=e[11],v=e[15],S=l*d-c*h,T=o*d-c*u,E=o*h-l*u,b=a*d-c*f,y=a*h-l*f,g=a*u-o*f;return t*(_*S-m*T+v*E)-i*(p*S-m*b+v*y)+s*(p*T-_*b+v*g)-r*(p*E-_*y+m*g)}determinantAffine(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],f=e[10];return t*(a*f-o*c)-i*(r*f-o*l)+s*(r*c-a*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],f=e[8],u=e[9],h=e[10],d=e[11],p=e[12],_=e[13],m=e[14],v=e[15],S=t*o-i*a,T=t*l-s*a,E=t*c-r*a,b=i*l-s*o,y=i*c-r*o,g=s*c-r*l,x=f*_-u*p,I=f*m-h*p,R=f*v-d*p,A=u*m-h*_,F=u*v-d*_,N=h*v-d*m,P=S*N-T*F+E*A+b*R-y*I+g*x;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const k=1/P;return e[0]=(o*N-l*F+c*A)*k,e[1]=(s*F-i*N-r*A)*k,e[2]=(_*g-m*y+v*b)*k,e[3]=(h*y-u*g-d*b)*k,e[4]=(l*R-a*N-c*I)*k,e[5]=(t*N-s*R+r*I)*k,e[6]=(m*E-p*g-v*T)*k,e[7]=(f*g-h*E+d*T)*k,e[8]=(a*F-o*R+c*x)*k,e[9]=(i*R-t*F-r*x)*k,e[10]=(p*y-_*E+v*S)*k,e[11]=(u*E-f*y-d*S)*k,e[12]=(o*I-a*A-l*x)*k,e[13]=(t*A-i*I+s*x)*k,e[14]=(_*T-p*b-m*S)*k,e[15]=(f*b-u*T+h*S)*k,this}scale(e){const t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,l=e.z,c=r*a,f=r*o;return this.set(c*a+i,c*o-s*l,c*l+s*o,0,c*o+s*l,f*o+i,f*l-s*a,0,c*l-s*o,f*l+s*a,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,f=a+a,u=o+o,h=r*c,d=r*f,p=r*u,_=a*f,m=a*u,v=o*u,S=l*c,T=l*f,E=l*u,b=i.x,y=i.y,g=i.z;return s[0]=(1-(_+v))*b,s[1]=(d+E)*b,s[2]=(p-T)*b,s[3]=0,s[4]=(d-E)*y,s[5]=(1-(h+v))*y,s[6]=(m+S)*y,s[7]=0,s[8]=(p+T)*g,s[9]=(m-S)*g,s[10]=(1-(h+_))*g,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinantAffine();if(r===0)return i.set(1,1,1),t.identity(),this;let a=Ln.set(s[0],s[1],s[2]).length();const o=Ln.set(s[4],s[5],s[6]).length(),l=Ln.set(s[8],s[9],s[10]).length();r<0&&(a=-a),di.copy(this);const c=1/a,f=1/o,u=1/l;return di.elements[0]*=c,di.elements[1]*=c,di.elements[2]*=c,di.elements[4]*=f,di.elements[5]*=f,di.elements[6]*=f,di.elements[8]*=u,di.elements[9]*=u,di.elements[10]*=u,t.setFromRotationMatrix(di),i.x=a,i.y=o,i.z=l,this}makePerspective(e,t,i,s,r,a,o=Mi,l=!1){const c=this.elements,f=2*r/(t-e),u=2*r/(i-s),h=(t+e)/(t-e),d=(i+s)/(i-s);let p,_;if(l)p=r/(a-r),_=a*r/(a-r);else if(o===Mi)p=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===Dr)p=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=f,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=u,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=Mi,l=!1){const c=this.elements,f=2/(t-e),u=2/(i-s),h=-(t+e)/(t-e),d=-(i+s)/(i-s);let p,_;if(l)p=1/(a-r),_=a/(a-r);else if(o===Mi)p=-2/(a-r),_=-(a+r)/(a-r);else if(o===Dr)p=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=f,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=u,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};Or.prototype.isMatrix4=!0;let yt=Or;const Ln=new K,di=new yt,Ud=new K(0,0,0),Fd=new K(1,1,1),qi=new K,Hs=new K,Zt=new K,Vl=new yt,Wl=new is;class Mn{constructor(e=0,t=0,i=0,s=Mn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],f=s[9],u=s[2],h=s[6],d=s[10];switch(t){case"XYZ":this._y=Math.asin(Ke(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-f,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ke(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ke(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ke(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(h,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Ke(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-f,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-Ke(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-f,d),this._y=0);break;default:Ne("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Vl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Vl,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Wl.setFromEuler(this),this.setFromQuaternion(Wl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Mn.DEFAULT_ORDER="XYZ";class Th{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Od=0;const Xl=new K,Dn=new is,Ni=new yt,zs=new K,hs=new K,kd=new K,Bd=new is,ql=new K(1,0,0),$l=new K(0,1,0),Yl=new K(0,0,1),Kl={type:"added"},Hd={type:"removed"},Nn={type:"childadded",child:null},pa={type:"childremoved",child:null};class ei extends En{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Od++}),this.uuid=As(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ei.DEFAULT_UP.clone();const e=new K,t=new Mn,i=new is,s=new K(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new yt},normalMatrix:{value:new Fe}}),this.matrix=new yt,this.matrixWorld=new yt,this.matrixAutoUpdate=ei.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ei.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Th,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Dn.setFromAxisAngle(e,t),this.quaternion.multiply(Dn),this}rotateOnWorldAxis(e,t){return Dn.setFromAxisAngle(e,t),this.quaternion.premultiply(Dn),this}rotateX(e){return this.rotateOnAxis(ql,e)}rotateY(e){return this.rotateOnAxis($l,e)}rotateZ(e){return this.rotateOnAxis(Yl,e)}translateOnAxis(e,t){return Xl.copy(e).applyQuaternion(this.quaternion),this.position.add(Xl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(ql,e)}translateY(e){return this.translateOnAxis($l,e)}translateZ(e){return this.translateOnAxis(Yl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ni.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?zs.copy(e):zs.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),hs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ni.lookAt(hs,zs,this.up):Ni.lookAt(zs,hs,this.up),this.quaternion.setFromRotationMatrix(Ni),s&&(Ni.extractRotation(s.matrixWorld),Dn.setFromRotationMatrix(Ni),this.quaternion.premultiply(Dn.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(it("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Kl),Nn.child=e,this.dispatchEvent(Nn),Nn.child=null):it("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Hd),pa.child=e,this.dispatchEvent(pa),pa.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ni.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ni.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ni),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Kl),Nn.child=e,this.dispatchEvent(Nn),Nn.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(hs,e,kd),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(hs,Bd,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*i-r[8]*s,r[13]+=i-r[1]*t-r[5]*i-r[9]*s,r[14]+=s-r[2]*t-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,i)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,f=l.length;c<f;c++){const u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),f=a(e.images),u=a(e.shapes),h=a(e.skeletons),d=a(e.animations),p=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),f.length>0&&(i.images=f),u.length>0&&(i.shapes=u),h.length>0&&(i.skeletons=h),d.length>0&&(i.animations=d),p.length>0&&(i.nodes=p)}return i.object=s,i;function a(o){const l=[];for(const c in o){const f=o[c];delete f.metadata,l.push(f)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}ei.DEFAULT_UP=new K(0,1,0);ei.DEFAULT_MATRIX_AUTO_UPDATE=!0;ei.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Gs extends ei{constructor(){super(),this.isGroup=!0,this.type="Group"}}const zd={type:"move"};class ma{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Gs,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Gs,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new K,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new K),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Gs,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new K,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new K,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const _ of e.hand.values()){const m=t.getJointPose(_,i),v=this._getHandJoint(c,_);m!==null&&(v.matrix.fromArray(m.transform.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale),v.matrixWorldNeedsUpdate=!0,v.jointRadius=m.radius),v.visible=m!==null}const f=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],h=f.position.distanceTo(u.position),d=.02,p=.005;c.inputState.pinching&&h>d+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=d-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.quaternion,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(zd)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Gs;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const Ah={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},$i={h:0,s:0,l:0},Vs={h:0,s:0,l:0};function ga(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class rt{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=li){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ye.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=Ye.workingColorSpace){return this.r=e,this.g=t,this.b=i,Ye.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=Ye.workingColorSpace){if(e=Ed(e,1),t=Ke(t,0,1),i=Ke(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=ga(a,r,e+1/3),this.g=ga(a,r,e),this.b=ga(a,r,e-1/3)}return Ye.colorSpaceToWorking(this,s),this}setStyle(e,t=li){function i(r){r!==void 0&&parseFloat(r)<1&&Ne("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,t);break;case"hsl":case"hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ne("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Ne("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=li){const i=Ah[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Ne("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=zi(e.r),this.g=zi(e.g),this.b=zi(e.b),this}copyLinearToSRGB(e){return this.r=Zn(e.r),this.g=Zn(e.g),this.b=Zn(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=li){return Ye.workingToColorSpace(kt.copy(this),e),Math.round(Ke(kt.r*255,0,255))*65536+Math.round(Ke(kt.g*255,0,255))*256+Math.round(Ke(kt.b*255,0,255))}getHexString(e=li){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ye.workingColorSpace){Ye.workingToColorSpace(kt.copy(this),t);const i=kt.r,s=kt.g,r=kt.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let l,c;const f=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=f<=.5?u/(a+o):u/(2-a-o),a){case i:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-i)/u+2;break;case r:l=(i-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=f,e}getRGB(e,t=Ye.workingColorSpace){return Ye.workingToColorSpace(kt.copy(this),t),e.r=kt.r,e.g=kt.g,e.b=kt.b,e}getStyle(e=li){Ye.workingToColorSpace(kt.copy(this),e);const t=kt.r,i=kt.g,s=kt.b;return e!==li?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL($i),this.setHSL($i.h+e,$i.s+t,$i.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL($i),e.getHSL(Vs);const i=ca($i.h,Vs.h,t),s=ca($i.s,Vs.s,t),r=ca($i.l,Vs.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const kt=new rt;rt.NAMES=Ah;class Gd extends ei{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Mn,this.environmentIntensity=1,this.environmentRotation=new Mn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background!==null?e.background.clone():null,this.environment=e.environment!==null?e.environment.clone():null,this.fog=e.fog!==null?e.fog.clone():null,this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial!==null?e.overrideMaterial.clone():null,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}const pi=new K,Ui=new K,va=new K,Fi=new K,Un=new K,Fn=new K,Zl=new K,xa=new K,_a=new K,ya=new K,Sa=new _t,Ma=new _t,wa=new _t;class yi{constructor(e=new K,t=new K,i=new K){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),pi.subVectors(e,t),s.cross(pi);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){pi.subVectors(s,t),Ui.subVectors(i,t),va.subVectors(e,t);const a=pi.dot(pi),o=pi.dot(Ui),l=pi.dot(va),c=Ui.dot(Ui),f=Ui.dot(va),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;const h=1/u,d=(c*l-o*f)*h,p=(a*f-o*l)*h;return r.set(1-d-p,p,d)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Fi)===null?!1:Fi.x>=0&&Fi.y>=0&&Fi.x+Fi.y<=1}static getInterpolation(e,t,i,s,r,a,o,l){return this.getBarycoord(e,t,i,s,Fi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Fi.x),l.addScaledVector(a,Fi.y),l.addScaledVector(o,Fi.z),l)}static getInterpolatedAttribute(e,t,i,s,r,a){return Sa.setScalar(0),Ma.setScalar(0),wa.setScalar(0),Sa.fromBufferAttribute(e,t),Ma.fromBufferAttribute(e,i),wa.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Sa,r.x),a.addScaledVector(Ma,r.y),a.addScaledVector(wa,r.z),a}static isFrontFacing(e,t,i,s){return pi.subVectors(i,t),Ui.subVectors(e,t),pi.cross(Ui).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return pi.subVectors(this.c,this.b),Ui.subVectors(this.a,this.b),pi.cross(Ui).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return yi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return yi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return yi.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return yi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return yi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,r=this.c;let a,o;Un.subVectors(s,i),Fn.subVectors(r,i),xa.subVectors(e,i);const l=Un.dot(xa),c=Fn.dot(xa);if(l<=0&&c<=0)return t.copy(i);_a.subVectors(e,s);const f=Un.dot(_a),u=Fn.dot(_a);if(f>=0&&u<=f)return t.copy(s);const h=l*u-f*c;if(h<=0&&l>=0&&f<=0&&l-f>0)return a=l/(l-f),t.copy(i).addScaledVector(Un,a);ya.subVectors(e,r);const d=Un.dot(ya),p=Fn.dot(ya);if(p>=0&&d<=p)return t.copy(r);const _=d*c-l*p;if(_<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(i).addScaledVector(Fn,o);const m=f*p-d*u;if(m<=0&&u-f>=0&&d-p>=0)return Zl.subVectors(r,s),o=(u-f)/(u-f+(d-p)),t.copy(s).addScaledVector(Zl,o);const v=1/(m+_+h);return a=_*v,o=h*v,t.copy(i).addScaledVector(Un,a).addScaledVector(Fn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Rs{constructor(e=new K(1/0,1/0,1/0),t=new K(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(mi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(mi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=mi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,mi):mi.fromBufferAttribute(r,a),mi.applyMatrix4(e.matrixWorld),this.expandByPoint(mi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ws.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Ws.copy(i.boundingBox)),Ws.applyMatrix4(e.matrixWorld),this.union(Ws)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,mi),mi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(us),Xs.subVectors(this.max,us),On.subVectors(e.a,us),kn.subVectors(e.b,us),Bn.subVectors(e.c,us),Yi.subVectors(kn,On),Ki.subVectors(Bn,kn),fn.subVectors(On,Bn);let t=[0,-Yi.z,Yi.y,0,-Ki.z,Ki.y,0,-fn.z,fn.y,Yi.z,0,-Yi.x,Ki.z,0,-Ki.x,fn.z,0,-fn.x,-Yi.y,Yi.x,0,-Ki.y,Ki.x,0,-fn.y,fn.x,0];return!ba(t,On,kn,Bn,Xs)||(t=[1,0,0,0,1,0,0,0,1],!ba(t,On,kn,Bn,Xs))?!1:(qs.crossVectors(Yi,Ki),t=[qs.x,qs.y,qs.z],ba(t,On,kn,Bn,Xs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,mi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(mi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Oi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Oi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Oi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Oi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Oi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Oi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Oi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Oi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Oi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Oi=[new K,new K,new K,new K,new K,new K,new K,new K],mi=new K,Ws=new Rs,On=new K,kn=new K,Bn=new K,Yi=new K,Ki=new K,fn=new K,us=new K,Xs=new K,qs=new K,dn=new K;function ba(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){dn.fromArray(n,r);const o=s.x*Math.abs(dn.x)+s.y*Math.abs(dn.y)+s.z*Math.abs(dn.z),l=e.dot(dn),c=t.dot(dn),f=i.dot(dn);if(Math.max(-Math.max(l,c,f),Math.min(l,c,f))>o)return!1}return!0}const Mt=new K,$s=new nt;let Vd=0;class _n extends En{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Vd++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=yd,this.updateRanges=[],this.gpuType=Ci,this.version=0,this._normalizationScale=e!==void 0?$o(e):void 0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)$s.fromBufferAttribute(this,t),$s.applyMatrix3(e),this.setXY(t,$s.x,$s.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Mt.fromBufferAttribute(this,t),Mt.applyMatrix3(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Mt.fromBufferAttribute(this,t),Mt.applyMatrix4(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Mt.fromBufferAttribute(this,t),Mt.applyNormalMatrix(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Mt.fromBufferAttribute(this,t),Mt.transformDirection(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=this._denormalize(i)),i}setComponent(e,t,i){return this.normalized&&(i=this._normalize(i)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i),s=this._normalize(s)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i),s=this._normalize(s),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(e){const t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):Ad(e,this.array)}_normalize(e){const t=this._normalizationScale;return t!==void 0?Math.round(e*t):Rd(e,this.array)}}class Rh extends _n{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Ch extends _n{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class wi extends _n{constructor(e,t,i){super(new Float32Array(e),t,i)}}const Wd=new Rs,fs=new K,Ea=new K;class Ko{constructor(e=new K,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Wd.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;fs.subVectors(e,this.center);const t=fs.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(fs,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ea.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(fs.copy(e.center).add(Ea)),this.expandByPoint(fs.copy(e.center).sub(Ea))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let Xd=0;const oi=new yt,Ta=new ei,Hn=new K,Jt=new Rs,ds=new Rs,Ct=new K;class an extends En{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Xd++}),this.uuid=As(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Sd(e)?Ch:Rh)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new Fe().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return oi.makeRotationFromQuaternion(e),this.applyMatrix4(oi),this}rotateX(e){return oi.makeRotationX(e),this.applyMatrix4(oi),this}rotateY(e){return oi.makeRotationY(e),this.applyMatrix4(oi),this}rotateZ(e){return oi.makeRotationZ(e),this.applyMatrix4(oi),this}translate(e,t,i){return oi.makeTranslation(e,t,i),this.applyMatrix4(oi),this}scale(e,t,i){return oi.makeScale(e,t,i),this.applyMatrix4(oi),this}lookAt(e){return Ta.lookAt(e),Ta.updateMatrix(),this.applyMatrix4(Ta.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Hn).negate(),this.translate(Hn.x,Hn.y,Hn.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new wi(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Ne("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Rs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){it("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new K(-1/0,-1/0,-1/0),new K(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const r=t[i];Jt.setFromBufferAttribute(r),this.morphTargetsRelative?(Ct.addVectors(this.boundingBox.min,Jt.min),this.boundingBox.expandByPoint(Ct),Ct.addVectors(this.boundingBox.max,Jt.max),this.boundingBox.expandByPoint(Ct)):(this.boundingBox.expandByPoint(Jt.min),this.boundingBox.expandByPoint(Jt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&it('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ko);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){it("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new K,1/0);return}if(e){const i=this.boundingSphere.center;if(Jt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];ds.setFromBufferAttribute(o),this.morphTargetsRelative?(Ct.addVectors(Jt.min,ds.min),Jt.expandByPoint(Ct),Ct.addVectors(Jt.max,ds.max),Jt.expandByPoint(Ct)):(Jt.expandByPoint(ds.min),Jt.expandByPoint(ds.max))}Jt.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)Ct.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(Ct));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,f=o.count;c<f;c++)Ct.fromBufferAttribute(o,c),l&&(Hn.fromBufferAttribute(e,c),Ct.add(Hn)),s=Math.max(s,i.distanceToSquared(Ct))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&it('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){it("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,r=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==i.count)&&(a=new _n(new Float32Array(4*i.count),4),this.setAttribute("tangent",a));const o=[],l=[],c=new Uint8Array(i.count);for(let I=0;I<i.count;I++)o[I]=new K,l[I]=new K;const f=new K,u=new K,h=new K,d=new nt,p=new nt,_=new nt,m=new K,v=new K;function S(I,R,A){c[I]=c[R]=c[A]=1,f.fromBufferAttribute(i,I),u.fromBufferAttribute(i,R),h.fromBufferAttribute(i,A),d.fromBufferAttribute(r,I),p.fromBufferAttribute(r,R),_.fromBufferAttribute(r,A),u.sub(f),h.sub(f),p.sub(d),_.sub(d);const F=1/(p.x*_.y-_.x*p.y);isFinite(F)&&(m.copy(u).multiplyScalar(_.y).addScaledVector(h,-p.y).multiplyScalar(F),v.copy(h).multiplyScalar(p.x).addScaledVector(u,-_.x).multiplyScalar(F),o[I].add(m),o[R].add(m),o[A].add(m),l[I].add(v),l[R].add(v),l[A].add(v))}let T=this.groups;T.length===0&&(T=[{start:0,count:e.count}]);for(let I=0,R=T.length;I<R;++I){const A=T[I],F=A.start,N=A.count;for(let P=F,k=F+N;P<k;P+=3)S(e.getX(P+0),e.getX(P+1),e.getX(P+2))}const E=new K,b=new K,y=new K,g=new K;function x(I){y.fromBufferAttribute(s,I),g.copy(y);const R=o[I];E.copy(R),E.sub(y.multiplyScalar(y.dot(R))).normalize(),b.crossVectors(g,R);const F=b.dot(l[I])<0?-1:1;a.setXYZW(I,E.x,E.y,E.z,F)}for(let I=0,R=i.count;I<R;++I)c[I]&&x(I);this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new _n(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let h=0,d=i.count;h<d;h++)i.setXYZ(h,0,0,0);const s=new K,r=new K,a=new K,o=new K,l=new K,c=new K,f=new K,u=new K;if(e)for(let h=0,d=e.count;h<d;h+=3){const p=e.getX(h+0),_=e.getX(h+1),m=e.getX(h+2);s.fromBufferAttribute(t,p),r.fromBufferAttribute(t,_),a.fromBufferAttribute(t,m),f.subVectors(a,r),u.subVectors(s,r),f.cross(u),o.fromBufferAttribute(i,p),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,m),o.add(f),l.add(f),c.add(f),i.setXYZ(p,o.x,o.y,o.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,d=t.count;h<d;h+=3)s.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),a.fromBufferAttribute(t,h+2),f.subVectors(a,r),u.subVectors(s,r),f.cross(u),i.setXYZ(h+0,f.x,f.y,f.z),i.setXYZ(h+1,f.x,f.y,f.z),i.setXYZ(h+2,f.x,f.y,f.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Ct.fromBufferAttribute(e,t),Ct.normalize(),e.setXYZ(t,Ct.x,Ct.y,Ct.z)}toNonIndexed(){function e(o,l){const c=o.array,f=o.itemSize,u=o.normalized,h=new c.constructor(l.length*f);let d=0,p=0;for(let _=0,m=l.length;_<m;_++){o.isInterleavedBufferAttribute?d=l[_]*o.data.stride+o.offset:d=l[_]*f;for(let v=0;v<f;v++)h[p++]=c[d++]}return new _n(h,f,u)}if(this.index===null)return Ne("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new an,i=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,i);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let f=0,u=c.length;f<u;f++){const h=c[f],d=e(h,i);l.push(d)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],f=[];for(let u=0,h=c.length;u<h;u++){const d=c[u];f.push(d.toJSON(e.data))}f.length>0&&(s[l]=f,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const c in s){const f=s[c];this.setAttribute(c,f.clone(t))}const r=e.morphAttributes;for(const c in r){const f=[],u=r[c];for(let h=0,d=u.length;h<d;h++)f.push(u[h].clone(t));this.morphAttributes[c]=f}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,f=a.length;c<f;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Aa=new K,qd=new K,$d=new Fe;class ji{constructor(e=new K(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=Aa.subVectors(i,t).cross(qd.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const s=e.delta(Aa),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return i===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||$d.getNormalMatrix(e),s=this.coplanarPoint(Aa).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let Yd=0;class Br extends En{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Yd++}),this.uuid=As(),this.name="",this.type="Material",this.blending=Ss,this.side=yn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=rh,this.blendDst=Rr,this.blendEquation=Bi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new rt(0,0,0),this.blendAlpha=0,this.depthFunc=Ms,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=pd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=oa,this.stencilZFail=oa,this.stencilZPass=oa,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){Ne(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ne(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(i.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(i.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(i.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(i.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new rt().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new ji().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new nt().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new nt().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const ki=new K,Ra=new K,Ys=new K,Ks=new K;class Kd{constructor(e=new K,t=new K(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ki)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=ki.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ki.copy(this.origin).addScaledVector(this.direction,t),ki.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Ra.copy(e).add(t).multiplyScalar(.5),Ys.copy(t).sub(e).normalize(),Ks.copy(this.origin).sub(Ra);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Ys),o=Ks.dot(this.direction),l=-Ks.dot(Ys),c=Ks.lengthSq(),f=Math.abs(1-a*a);let u,h,d,p;if(f>0)if(u=a*l-o,h=a*o-l,p=r*f,u>=0)if(h>=-p)if(h<=p){const _=1/f;u*=_,h*=_,d=u*(u+a*h+2*o)+h*(a*u+h+2*l)+c}else h=r,u=Math.max(0,-(a*h+o)),d=-u*u+h*(h+2*l)+c;else h=-r,u=Math.max(0,-(a*h+o)),d=-u*u+h*(h+2*l)+c;else h<=-p?(u=Math.max(0,-(-a*r+o)),h=u>0?-r:Math.min(Math.max(-r,-l),r),d=-u*u+h*(h+2*l)+c):h<=p?(u=0,h=Math.min(Math.max(-r,-l),r),d=h*(h+2*l)+c):(u=Math.max(0,-(a*r+o)),h=u>0?r:Math.min(Math.max(-r,-l),r),d=-u*u+h*(h+2*l)+c);else h=a>0?-r:r,u=Math.max(0,-(a*h+o)),d=-u*u+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Ra).addScaledVector(Ys,h),d}intersectSphere(e,t){if(e.radius<0)return null;ki.subVectors(e.center,this.origin);const i=ki.dot(this.direction),s=ki.dot(ki)-i*i,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,l;const c=1/this.direction.x,f=1/this.direction.y,u=1/this.direction.z,h=this.origin;return c>=0?(i=(e.min.x-h.x)*c,s=(e.max.x-h.x)*c):(i=(e.max.x-h.x)*c,s=(e.min.x-h.x)*c),f>=0?(r=(e.min.y-h.y)*f,a=(e.max.y-h.y)*f):(r=(e.max.y-h.y)*f,a=(e.min.y-h.y)*f),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-h.z)*u,l=(e.max.z-h.z)*u):(o=(e.max.z-h.z)*u,l=(e.min.z-h.z)*u),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,ki)!==null}intersectTriangle(e,t,i,s,r){const a=this.origin,o=this.direction,l=o.x,c=o.y,f=o.z,u=e.x-a.x,h=e.y-a.y,d=e.z-a.z,p=t.x-a.x,_=t.y-a.y,m=t.z-a.z,v=i.x-a.x,S=i.y-a.y,T=i.z-a.z,E=Math.abs(l),b=Math.abs(c),y=Math.abs(f);let g,x,I,R,A,F,N,P,k,H,B,C;if(E>=b&&E>=y?(I=l,F=u,k=p,C=v,l>=0?(g=c,x=f,R=h,A=d,N=_,P=m,H=S,B=T):(g=f,x=c,R=d,A=h,N=m,P=_,H=T,B=S)):b>=y?(I=c,F=h,k=_,C=S,c>=0?(g=f,x=l,R=d,A=u,N=m,P=p,H=T,B=v):(g=l,x=f,R=u,A=d,N=p,P=m,H=v,B=T)):(I=f,F=d,k=m,C=T,f>=0?(g=l,x=c,R=u,A=h,N=p,P=_,H=v,B=S):(g=c,x=l,R=h,A=u,N=_,P=p,H=S,B=v)),I===0)return null;const L=g/I,V=x/I,$=1/I,ie=R-L*F,ne=A-V*F,G=N-L*k,se=P-V*k,ge=H-L*C,Se=B-V*C,ae=ge*se-Se*G,Le=ie*Se-ne*ge,lt=G*ne-se*ie;if(s){if(ae<0||Le<0||lt<0)return null}else if((ae<0||Le<0||lt<0)&&(ae>0||Le>0||lt>0))return null;const Re=ae+Le+lt;if(Re===0)return null;const Ve=$*(ae*F+Le*k+lt*C);return(Re>0?Ve<0:Ve>0)?null:this.at(Ve/Re,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Zd extends Br{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new rt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Mn,this.combine=ah,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Jl=new yt,pn=new Kd,Zs=new Ko,jl=new K,Js=new K,js=new K,Qs=new K,Ca=new K,er=new K,Ql=new K,tr=new K;class Gi extends ei{constructor(e=new an,t=new Zd){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){er.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const f=o[l],u=r[l];f!==0&&(Ca.fromBufferAttribute(u,e),a?er.addScaledVector(Ca,f):er.addScaledVector(Ca.sub(t),f))}t.add(er)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Zs.copy(i.boundingSphere),Zs.applyMatrix4(r),pn.copy(e.ray).recast(e.near),!(Zs.containsPoint(pn.origin)===!1&&(pn.intersectSphere(Zs,jl)===null||pn.origin.distanceToSquared(jl)>(e.far-e.near)**2))&&(Jl.copy(r).invert(),pn.copy(e.ray).applyMatrix4(Jl),!(i.boundingBox!==null&&pn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,pn)))}_computeIntersections(e,t,i){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,f=r.attributes.uv1,u=r.attributes.normal,h=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,_=h.length;p<_;p++){const m=h[p],v=a[m.materialIndex],S=Math.max(m.start,d.start),T=Math.min(o.count,Math.min(m.start+m.count,d.start+d.count));for(let E=S,b=T;E<b;E+=3){const y=o.getX(E),g=o.getX(E+1),x=o.getX(E+2);s=ir(this,v,e,i,c,f,u,y,g,x),s&&(s.faceIndex=Math.floor(E/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const p=Math.max(0,d.start),_=Math.min(o.count,d.start+d.count);for(let m=p,v=_;m<v;m+=3){const S=o.getX(m),T=o.getX(m+1),E=o.getX(m+2);s=ir(this,a,e,i,c,f,u,S,T,E),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let p=0,_=h.length;p<_;p++){const m=h[p],v=a[m.materialIndex],S=Math.max(m.start,d.start),T=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let E=S,b=T;E<b;E+=3){const y=E,g=E+1,x=E+2;s=ir(this,v,e,i,c,f,u,y,g,x),s&&(s.faceIndex=Math.floor(E/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const p=Math.max(0,d.start),_=Math.min(l.count,d.start+d.count);for(let m=p,v=_;m<v;m+=3){const S=m,T=m+1,E=m+2;s=ir(this,a,e,i,c,f,u,S,T,E),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function Jd(n,e,t,i,s,r,a,o){let l;if(e.side===Yt?l=i.intersectTriangle(a,r,s,!0,o):l=i.intersectTriangle(s,r,a,e.side===yn,o),l===null)return null;tr.copy(o),tr.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(tr);return c<t.near||c>t.far?null:{distance:c,point:tr.clone(),object:n}}function ir(n,e,t,i,s,r,a,o,l,c){n.getVertexPosition(o,Js),n.getVertexPosition(l,js),n.getVertexPosition(c,Qs);const f=Jd(n,e,t,i,Js,js,Qs,Ql);if(f){const u=new K;yi.getBarycoord(Ql,Js,js,Qs,u),s&&(f.uv=yi.getInterpolatedAttribute(s,o,l,c,u,new nt)),r&&(f.uv1=yi.getInterpolatedAttribute(r,o,l,c,u,new nt)),a&&(f.normal=yi.getInterpolatedAttribute(a,o,l,c,u,new K),f.normal.dot(i.direction)>0&&f.normal.multiplyScalar(-1));const h={a:o,b:l,c,normal:new K,materialIndex:0};yi.getNormal(Js,js,Qs,h.normal),f.face=h,f.barycoord=u}return f}class Ph extends Wt{constructor(e=null,t=1,i=1,s,r,a,o,l,c=Pt,f=Pt,u,h){super(null,a,o,l,c,f,s,r,u,h),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const mn=new Ko,jd=new nt(.5,.5),nr=new K;class Ur{constructor(e=new ji,t=new ji,i=new ji,s=new ji,r=new ji,a=new ji){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Mi,i=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],f=r[4],u=r[5],h=r[6],d=r[7],p=r[8],_=r[9],m=r[10],v=r[11],S=r[12],T=r[13],E=r[14],b=r[15];if(s[0].setComponents(c-a,d-f,v-p,b-S).normalize(),s[1].setComponents(c+a,d+f,v+p,b+S).normalize(),s[2].setComponents(c+o,d+u,v+_,b+T).normalize(),s[3].setComponents(c-o,d-u,v-_,b-T).normalize(),i)s[4].setComponents(l,h,m,E).normalize(),s[5].setComponents(c-l,d-h,v-m,b-E).normalize();else if(s[4].setComponents(c-l,d-h,v-m,b-E).normalize(),t===Mi)s[5].setComponents(c+l,d+h,v+m,b+E).normalize();else if(t===Dr)s[5].setComponents(l,h,m,E).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),mn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),mn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(mn)}intersectsSprite(e){mn.center.set(0,0,0);const t=jd.distanceTo(e.center);return mn.radius=.7071067811865476+t,mn.applyMatrix4(e.matrixWorld),this.intersectsSphere(mn)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(nr.x=s.normal.x>0?e.max.x:e.min.x,nr.y=s.normal.y>0?e.max.y:e.min.y,nr.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(nr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}const ec=new yt;class Zo{constructor(){this.coordinateSystem=Mi,this._frustums=[],this._count=0}setFromArrayCamera(e){const t=e.cameras,i=this._frustums;for(let s=0;s<t.length;s++){const r=t[s];ec.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),i[s]===void 0&&(i[s]=new Ur),i[s].setFromProjectionMatrix(ec,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsObject(e))return!0;return!1}intersectsSprite(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsSprite(e))return!0;return!1}intersectsSphere(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsSphere(e))return!0;return!1}intersectsBox(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsBox(e))return!0;return!1}containsPoint(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;const t=this._frustums,i=e._frustums;for(let s=0;s<e._count;s++)t[s]===void 0&&(t[s]=new Ur),t[s].copy(i[s]);return this._count=e._count,this}clone(){return new Zo().copy(this)}}class Ih extends Wt{constructor(e=[],t=jn,i,s,r,a,o,l,c,f){super(e,t,i,s,r,a,o,l,c,f),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class es extends Wt{constructor(e,t,i=Ii,s,r,a,o=Pt,l=Pt,c,f=rn,u=1){if(f!==rn&&f!==sn)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const h={width:e,height:t,depth:u};super(h,s,r,a,o,l,f,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Yo(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class Lh extends es{constructor(e,t=Ii,i=jn,s,r,a=Pt,o=Pt,l,c=rn){const f={width:e,height:e,depth:1},u=[f,f,f,f,f,f];super(e,e,t,i,s,r,a,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Dh extends Wt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Cs extends an{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],f=[],u=[];let h=0,d=0;p("z","y","x",-1,-1,i,t,e,a,r,0),p("z","y","x",1,-1,i,t,-e,a,r,1),p("x","z","y",1,1,e,i,t,s,a,2),p("x","z","y",1,-1,e,i,-t,s,a,3),p("x","y","z",1,-1,e,t,i,s,r,4),p("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new wi(c,3)),this.setAttribute("normal",new wi(f,3)),this.setAttribute("uv",new wi(u,2));function p(_,m,v,S,T,E,b,y,g,x,I){const R=E/g,A=b/x,F=E/2,N=b/2,P=y/2,k=g+1,H=x+1;let B=0,C=0;const L=new K;for(let V=0;V<H;V++){const $=V*A-N;for(let ie=0;ie<k;ie++){const ne=ie*R-F;L[_]=ne*S,L[m]=$*T,L[v]=P,c.push(L.x,L.y,L.z),L[_]=0,L[m]=0,L[v]=y>0?1:-1,f.push(L.x,L.y,L.z),u.push(ie/g),u.push(1-V/x),B+=1}}for(let V=0;V<x;V++)for(let $=0;$<g;$++){const ie=h+$+k*V,ne=h+$+k*(V+1),G=h+($+1)+k*(V+1),se=h+($+1)+k*V;l.push(ie,ne,se),l.push(ne,G,se),C+=6}o.addGroup(d,C,I),d+=C,h+=B}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Cs(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Hr extends an{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(i),l=Math.floor(s),c=o+1,f=l+1,u=e/o,h=t/l,d=[],p=[],_=[],m=[];for(let v=0;v<f;v++){const S=v*h-a;for(let T=0;T<c;T++){const E=T*u-r;p.push(E,-S,0),_.push(0,0,1),m.push(T/o),m.push(1-v/l)}}for(let v=0;v<l;v++)for(let S=0;S<o;S++){const T=S+c*v,E=S+c*(v+1),b=S+1+c*(v+1),y=S+1+c*v;d.push(T,E,y),d.push(E,b,y)}this.setIndex(d),this.setAttribute("position",new wi(p,3)),this.setAttribute("normal",new wi(_,3)),this.setAttribute("uv",new wi(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Hr(e.width,e.height,e.widthSegments,e.heightSegments)}}function ts(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];if(tc(s))s.isRenderTargetTexture?(Ne("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone();else if(Array.isArray(s))if(tc(s[0])){const r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][i]=r}else e[t][i]=s.slice();else e[t][i]=s}}return e}function Gt(n){const e={};for(let t=0;t<n.length;t++){const i=ts(n[t]);for(const s in i)e[s]=i[s]}return e}function tc(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function Qd(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Nh(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ye.workingColorSpace}const ep={clone:ts,merge:Gt};var tp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ip=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class wn extends Br{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=tp,this.fragmentShader=ip,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ts(e.uniforms),this.uniformsGroups=Qd(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const i in e.uniforms){const s=e.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=t[s.value]||null;break;case"c":this.uniforms[i].value=new rt().setHex(s.value);break;case"v2":this.uniforms[i].value=new nt().fromArray(s.value);break;case"v3":this.uniforms[i].value=new K().fromArray(s.value);break;case"v4":this.uniforms[i].value=new _t().fromArray(s.value);break;case"m3":this.uniforms[i].value=new Fe().fromArray(s.value);break;case"m4":this.uniforms[i].value=new yt().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class Co extends wn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class np extends Br{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=fd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class sp extends Br{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const sr=new K,rr=new is,bi=new K;class Uh extends ei{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new yt,this.projectionMatrix=new yt,this.projectionMatrixInverse=new yt,this.coordinateSystem=Mi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(sr,rr,bi),bi.x===1&&bi.y===1&&bi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(sr,rr,bi.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(sr,rr,bi),bi.x===1&&bi.y===1&&bi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(sr,rr,bi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Zi=new K,ic=new nt,nc=new nt;class Ti extends Uh{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Ro*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(la*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ro*2*Math.atan(Math.tan(la*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Zi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Zi.x,Zi.y).multiplyScalar(-e/Zi.z),Zi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Zi.x,Zi.y).multiplyScalar(-e/Zi.z)}getViewSize(e,t){return this.getViewBounds(e,ic,nc),t.subVectors(nc,ic)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(la*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*i/c,s*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class Fh extends Uh{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,f=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=f*this.view.offsetY,l=o-f*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const zn=-90,Gn=1;class Po extends ei{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Ti(zn,Gn,e,t);s.layers=this.layers,this.add(s);const r=new Ti(zn,Gn,e,t);r.layers=this.layers,this.add(r);const a=new Ti(zn,Gn,e,t);a.layers=this.layers,this.add(a);const o=new Ti(zn,Gn,e,t);o.layers=this.layers,this.add(o);const l=new Ti(zn,Gn,e,t);l.layers=this.layers,this.add(l);const c=new Ti(zn,Gn,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===Mi)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Dr)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,f]=this.children,u=e.getRenderTarget(),h=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;const _=i.texture.mipmapsAutoUpdate;i.texture.mipmapsAutoUpdate=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,1,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,2,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,3,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,4,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),i.texture.mipmapsAutoUpdate=_,e.setRenderTarget(i,5,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,f),e.setRenderTarget(u,h,d),e.xr.enabled=p,i.texture.needsPMREMUpdate=!0}}class rp extends Ti{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}}function sc(n,e,t,i){const s=ap(i);switch(t){case _h:return n*e;case Vo:return n*e/s.components*s.byteLength;case Wo:return n*e/s.components*s.byteLength;case Sn:return n*e*2/s.components*s.byteLength;case Xo:return n*e*2/s.components*s.byteLength;case yh:return n*e*3/s.components*s.byteLength;case Si:return n*e*4/s.components*s.byteLength;case qo:return n*e*4/s.components*s.byteLength;case vr:case xr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case _r:case yr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case ja:case eo:return Math.max(n,16)*Math.max(e,8)/4;case Ja:case Qa:return Math.max(n,8)*Math.max(e,8)/2;case to:case io:case so:case ro:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case no:case Cr:case ao:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case oo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case lo:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case co:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case ho:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case uo:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case fo:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case po:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case mo:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case go:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case vo:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case xo:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case _o:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case yo:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case So:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Mo:case wo:case bo:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Eo:case To:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Pr:case Ao:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function ap(n){switch(n){case Qt:case mh:return{byteLength:1,components:1};case bs:case gh:case Li:return{byteLength:2,components:1};case zo:case Go:return{byteLength:2,components:4};case Ii:case Ho:case Ci:return{byteLength:4,components:1};case vh:case xh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Bo}}));typeof window<"u"&&(window.__THREE__?Ne("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Bo);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Oh(){let n=null,e=!1,t=null,i=null;function s(r,a){i=n.requestAnimationFrame(s),t(r,a)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function op(n){const e=new WeakMap;function t(o,l){const c=o.array,f=o.usage,u=c.byteLength,h=n.createBuffer();n.bindBuffer(l,h),n.bufferData(l,c,f),o.onUploadCallback();let d;if(c instanceof Float32Array)d=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=n.HALF_FLOAT:d=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=n.SHORT;else if(c instanceof Uint32Array)d=n.UNSIGNED_INT;else if(c instanceof Int32Array)d=n.INT;else if(c instanceof Int8Array)d=n.BYTE;else if(c instanceof Uint8Array)d=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,l,c){const f=l.array,u=l.updateRanges;if(n.bindBuffer(c,o),u.length===0)n.bufferSubData(c,0,f);else{u.sort((d,p)=>d.start-p.start);let h=0;for(let d=1;d<u.length;d++){const p=u[h],_=u[d];_.start<=p.start+p.count+1?p.count=Math.max(p.count,_.start+_.count-p.start):(++h,u[h]=_)}u.length=h+1;for(let d=0,p=u.length;d<p;d++){const _=u[d];n.bufferSubData(c,_.start*f.BYTES_PER_ELEMENT,f,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const f=e.get(o);(!f||f.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var lp=`#ifdef USE_ALPHAHASH
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
#endif`,Op="gl_FragColor = linearToOutputTexel( gl_FragColor );",kp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Bp=`#ifdef USE_ENVMAP
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
#endif`,km=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Bm=`#ifdef DITHERING
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
}`,kg=`uniform vec3 color;
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
}`,Bg=`uniform float rotation;
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
}`,Ge={alphahash_fragment:lp,alphahash_pars_fragment:cp,alphamap_fragment:hp,alphamap_pars_fragment:up,alphatest_fragment:fp,alphatest_pars_fragment:dp,aomap_fragment:pp,aomap_pars_fragment:mp,batching_pars_vertex:gp,batching_vertex:vp,begin_vertex:xp,beginnormal_vertex:_p,bsdfs:yp,iridescence_fragment:Sp,bumpmap_pars_fragment:Mp,clipping_planes_fragment:wp,clipping_planes_pars_fragment:bp,clipping_planes_pars_vertex:Ep,clipping_planes_vertex:Tp,color_fragment:Ap,color_pars_fragment:Rp,color_pars_vertex:Cp,color_vertex:Pp,common:Ip,defaultnormal_vertex:Lp,displacementmap_pars_vertex:Dp,displacementmap_vertex:Np,emissivemap_fragment:Up,emissivemap_pars_fragment:Fp,colorspace_fragment:Op,colorspace_pars_fragment:kp,envmap_fragment:Bp,envmap_common_pars_fragment:Hp,envmap_pars_fragment:zp,envmap_pars_vertex:Gp,envmap_physical_pars_fragment:Qp,envmap_vertex:Vp,fog_vertex:Wp,fog_pars_vertex:Xp,fog_fragment:qp,fog_pars_fragment:$p,gradientmap_pars_fragment:Yp,lightmap_pars_fragment:Kp,lights_lambert_fragment:Zp,lights_lambert_pars_fragment:Jp,lights_pars_begin:jp,lights_toon_fragment:em,lights_toon_pars_fragment:tm,lights_phong_fragment:im,lights_phong_pars_fragment:nm,lights_physical_fragment:sm,lights_physical_pars_fragment:rm,lights_fragment_begin:am,lights_fragment_maps:om,lights_fragment_end:lm,lightprobes_pars_fragment:cm,logdepthbuf_fragment:hm,logdepthbuf_pars_fragment:um,logdepthbuf_pars_vertex:fm,logdepthbuf_vertex:dm,map_fragment:pm,map_pars_fragment:mm,map_particle_fragment:gm,map_particle_pars_fragment:vm,metalnessmap_fragment:xm,metalnessmap_pars_fragment:_m,morphinstance_vertex:ym,morphcolor_vertex:Sm,morphnormal_vertex:Mm,morphtarget_pars_vertex:wm,morphtarget_vertex:bm,normal_fragment_begin:Em,normal_fragment_maps:Tm,normal_pars_fragment:Am,normal_pars_vertex:Rm,normal_vertex:Cm,normalmap_pars_fragment:Pm,clearcoat_normal_fragment_begin:Im,clearcoat_normal_fragment_maps:Lm,clearcoat_pars_fragment:Dm,iridescence_pars_fragment:Nm,opaque_fragment:Um,packing:Fm,premultiplied_alpha_fragment:Om,project_vertex:km,dithering_fragment:Bm,dithering_pars_fragment:Hm,roughnessmap_fragment:zm,roughnessmap_pars_fragment:Gm,shadowmap_pars_fragment:Vm,shadowmap_pars_vertex:Wm,shadowmap_vertex:Xm,shadowmask_pars_fragment:qm,skinbase_vertex:$m,skinning_pars_vertex:Ym,skinning_vertex:Km,skinnormal_vertex:Zm,specularmap_fragment:Jm,specularmap_pars_fragment:jm,tonemapping_fragment:Qm,tonemapping_pars_fragment:eg,transmission_fragment:tg,transmission_pars_fragment:ig,uv_pars_fragment:ng,uv_pars_vertex:sg,uv_vertex:rg,worldpos_vertex:ag,background_vert:og,background_frag:lg,backgroundCube_vert:cg,backgroundCube_frag:hg,cube_vert:ug,cube_frag:fg,depth_vert:dg,depth_frag:pg,distance_vert:mg,distance_frag:gg,equirect_vert:vg,equirect_frag:xg,linedashed_vert:_g,linedashed_frag:yg,meshbasic_vert:Sg,meshbasic_frag:Mg,meshlambert_vert:wg,meshlambert_frag:bg,meshmatcap_vert:Eg,meshmatcap_frag:Tg,meshnormal_vert:Ag,meshnormal_frag:Rg,meshphong_vert:Cg,meshphong_frag:Pg,meshphysical_vert:Ig,meshphysical_frag:Lg,meshtoon_vert:Dg,meshtoon_frag:Ng,points_vert:Ug,points_frag:Fg,shadow_vert:Og,shadow_frag:kg,sprite_vert:Bg,sprite_frag:Hg},_e={common:{diffuse:{value:new rt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Fe}},envmap:{envMap:{value:null},envMapRotation:{value:new Fe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Fe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Fe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Fe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Fe},normalScale:{value:new nt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Fe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Fe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Fe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Fe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new rt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new rt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0},uvTransform:{value:new Fe}},sprite:{diffuse:{value:new rt(16777215)},opacity:{value:1},center:{value:new nt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}}},Ai={basic:{uniforms:Gt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.fog]),vertexShader:Ge.meshbasic_vert,fragmentShader:Ge.meshbasic_frag},lambert:{uniforms:Gt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new rt(0)},envMapIntensity:{value:1}}]),vertexShader:Ge.meshlambert_vert,fragmentShader:Ge.meshlambert_frag},phong:{uniforms:Gt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new rt(0)},specular:{value:new rt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ge.meshphong_vert,fragmentShader:Ge.meshphong_frag},standard:{uniforms:Gt([_e.common,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.roughnessmap,_e.metalnessmap,_e.fog,_e.lights,{emissive:{value:new rt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag},toon:{uniforms:Gt([_e.common,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.gradientmap,_e.fog,_e.lights,{emissive:{value:new rt(0)}}]),vertexShader:Ge.meshtoon_vert,fragmentShader:Ge.meshtoon_frag},matcap:{uniforms:Gt([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,{matcap:{value:null}}]),vertexShader:Ge.meshmatcap_vert,fragmentShader:Ge.meshmatcap_frag},points:{uniforms:Gt([_e.points,_e.fog]),vertexShader:Ge.points_vert,fragmentShader:Ge.points_frag},dashed:{uniforms:Gt([_e.common,_e.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ge.linedashed_vert,fragmentShader:Ge.linedashed_frag},depth:{uniforms:Gt([_e.common,_e.displacementmap]),vertexShader:Ge.depth_vert,fragmentShader:Ge.depth_frag},normal:{uniforms:Gt([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,{opacity:{value:1}}]),vertexShader:Ge.meshnormal_vert,fragmentShader:Ge.meshnormal_frag},sprite:{uniforms:Gt([_e.sprite,_e.fog]),vertexShader:Ge.sprite_vert,fragmentShader:Ge.sprite_frag},background:{uniforms:{uvTransform:{value:new Fe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ge.background_vert,fragmentShader:Ge.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Fe}},vertexShader:Ge.backgroundCube_vert,fragmentShader:Ge.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ge.cube_vert,fragmentShader:Ge.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ge.equirect_vert,fragmentShader:Ge.equirect_frag},distance:{uniforms:Gt([_e.common,_e.displacementmap,{referencePosition:{value:new K},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ge.distance_vert,fragmentShader:Ge.distance_frag},shadow:{uniforms:Gt([_e.lights,_e.fog,{color:{value:new rt(0)},opacity:{value:1}}]),vertexShader:Ge.shadow_vert,fragmentShader:Ge.shadow_frag}};Ai.physical={uniforms:Gt([Ai.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Fe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Fe},clearcoatNormalScale:{value:new nt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Fe},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new Fe},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Fe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Fe},sheen:{value:0},sheenColor:{value:new rt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Fe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Fe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Fe},transmissionSamplerSize:{value:new nt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Fe},attenuationDistance:{value:0},attenuationColor:{value:new rt(0)},specularColor:{value:new rt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Fe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Fe},anisotropyVector:{value:new nt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Fe}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag};const ar={r:0,b:0,g:0},zg=new yt,kh=new Fe;kh.set(-1,0,0,0,1,0,0,0,1);function Gg(n,e,t,i,s,r){const a=new rt(0);let o=s===!0?0:1,l,c,f=null,u=0,h=null;function d(S){let T=S.isScene===!0?S.background:null;if(T&&T.isTexture){const E=S.backgroundBlurriness>0;T=e.get(T,E)}return T}function p(S){let T=!1;const E=d(S);E===null?m(a,o):E&&E.isColor&&(m(E,1),T=!0);const b=n.xr.getEnvironmentBlendMode();b==="additive"?t.buffers.color.setClear(0,0,0,1,r):b==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(n.autoClear||T)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function _(S,T){const E=d(T);E&&E.isCubeTexture?(c===void 0&&(c=new Gi(new Cs(1,1,1),new wn({name:"BackgroundCubeMaterial",uniforms:ts(Ai.backgroundCube.uniforms),vertexShader:Ai.backgroundCube.vertexShader,fragmentShader:Ai.backgroundCube.fragmentShader,side:Yt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(b,y,g){this.matrixWorld.copyPosition(g.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=E,c.material.uniforms.backgroundBlurriness.value=T.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(zg.makeRotationFromEuler(T.backgroundRotation)).transpose(),E.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(kh),c.material.toneMapped=Ye.getTransfer(E.colorSpace)!==ot,(f!==E||u!==E.version||h!==n.toneMapping)&&(c.material.needsUpdate=!0,f=E,u=E.version,h=n.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null)):E&&E.isTexture&&(l===void 0&&(l=new Gi(new Hr(2,2),new wn({name:"BackgroundMaterial",uniforms:ts(Ai.background.uniforms),vertexShader:Ai.background.vertexShader,fragmentShader:Ai.background.fragmentShader,side:yn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=E,l.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,l.material.toneMapped=Ye.getTransfer(E.colorSpace)!==ot,E.matrixAutoUpdate===!0&&E.updateMatrix(),l.material.uniforms.uvTransform.value.copy(E.matrix),(f!==E||u!==E.version||h!==n.toneMapping)&&(l.material.needsUpdate=!0,f=E,u=E.version,h=n.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function m(S,T){S.getRGB(ar,Nh(n)),t.buffers.color.setClear(ar.r,ar.g,ar.b,T,r)}function v(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(S,T=1){a.set(S),o=T,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(S){o=S,m(a,o)},render:p,addToRenderList:_,dispose:v}}function Vg(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=h(null);let r=s,a=!1;function o(A,F,N,P,k){let H=!1;const B=u(A,P,N,F);r!==B&&(r=B,c(r.object)),H=d(A,P,N,k),H&&p(A,P,N,k),k!==null&&e.update(k,n.ELEMENT_ARRAY_BUFFER),(H||a)&&(a=!1,E(A,F,N,P),k!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(k).buffer))}function l(){return n.createVertexArray()}function c(A){return n.bindVertexArray(A)}function f(A){return n.deleteVertexArray(A)}function u(A,F,N,P){const k=P.wireframe===!0;let H=i[F.id];H===void 0&&(H={},i[F.id]=H);const B=A.isInstancedMesh===!0?A.id:0;let C=H[B];C===void 0&&(C={},H[B]=C);let L=C[N.id];L===void 0&&(L={},C[N.id]=L);let V=L[k];return V===void 0&&(V=h(l()),L[k]=V),V}function h(A){const F=[],N=[],P=[];for(let k=0;k<t;k++)F[k]=0,N[k]=0,P[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:N,attributeDivisors:P,object:A,attributes:{},index:null}}function d(A,F,N,P){const k=r.attributes,H=F.attributes;let B=0;const C=N.getAttributes();for(const L in C)if(C[L].location>=0){const $=k[L];let ie=H[L];if(ie===void 0&&(L==="instanceMatrix"&&A.instanceMatrix&&(ie=A.instanceMatrix),L==="instanceColor"&&A.instanceColor&&(ie=A.instanceColor)),$===void 0||$.attribute!==ie||ie&&$.data!==ie.data)return!0;B++}return r.attributesNum!==B||r.index!==P}function p(A,F,N,P){const k={},H=F.attributes;let B=0;const C=N.getAttributes();for(const L in C)if(C[L].location>=0){let $=H[L];$===void 0&&(L==="instanceMatrix"&&A.instanceMatrix&&($=A.instanceMatrix),L==="instanceColor"&&A.instanceColor&&($=A.instanceColor));const ie={};ie.attribute=$,$&&$.data&&(ie.data=$.data),k[L]=ie,B++}r.attributes=k,r.attributesNum=B,r.index=P}function _(){const A=r.newAttributes;for(let F=0,N=A.length;F<N;F++)A[F]=0}function m(A){v(A,0)}function v(A,F){const N=r.newAttributes,P=r.enabledAttributes,k=r.attributeDivisors;N[A]=1,P[A]===0&&(n.enableVertexAttribArray(A),P[A]=1),k[A]!==F&&(n.vertexAttribDivisor(A,F),k[A]=F)}function S(){const A=r.newAttributes,F=r.enabledAttributes;for(let N=0,P=F.length;N<P;N++)F[N]!==A[N]&&(n.disableVertexAttribArray(N),F[N]=0)}function T(A,F,N,P,k,H,B){B===!0?n.vertexAttribIPointer(A,F,N,k,H):n.vertexAttribPointer(A,F,N,P,k,H)}function E(A,F,N,P){_();const k=P.attributes,H=N.getAttributes(),B=F.defaultAttributeValues;for(const C in H){const L=H[C];if(L.location>=0){let V=k[C];if(V===void 0&&(C==="instanceMatrix"&&A.instanceMatrix&&(V=A.instanceMatrix),C==="instanceColor"&&A.instanceColor&&(V=A.instanceColor)),V!==void 0){const $=V.normalized,ie=V.itemSize,ne=e.get(V);if(ne===void 0)continue;const G=ne.buffer,se=ne.type,ge=ne.bytesPerElement,Se=se===n.INT||se===n.UNSIGNED_INT||V.gpuType===Ho;if(V.isInterleavedBufferAttribute){const ae=V.data,Le=ae.isInterleavedBuffer===!0?ae.stride:ae.itemSize,lt=V.offset;if(ae.isInstancedInterleavedBuffer||ae.isInstancedBufferAttribute){for(let Re=0;Re<L.locationSize;Re++)v(L.location+Re,ae.meshPerAttribute);A.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let Re=0;Re<L.locationSize;Re++)m(L.location+Re);n.bindBuffer(n.ARRAY_BUFFER,G);for(let Re=0;Re<L.locationSize;Re++)T(L.location+Re,ie/L.locationSize,se,$,Le*ge,(lt+ie/L.locationSize*Re)*ge,Se)}else{if(V.isInstancedBufferAttribute){for(let ae=0;ae<L.locationSize;ae++)v(L.location+ae,V.meshPerAttribute);A.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=V.meshPerAttribute*V.count)}else for(let ae=0;ae<L.locationSize;ae++)m(L.location+ae);n.bindBuffer(n.ARRAY_BUFFER,G);for(let ae=0;ae<L.locationSize;ae++)T(L.location+ae,ie/L.locationSize,se,$,ie*ge,ie/L.locationSize*ae*ge,Se)}}else if(B!==void 0){const $=B[C];if($!==void 0)switch($.length){case 2:n.vertexAttrib2fv(L.location,$);break;case 3:n.vertexAttrib3fv(L.location,$);break;case 4:n.vertexAttrib4fv(L.location,$);break;default:n.vertexAttrib1fv(L.location,$)}}}}S()}function b(){I();for(const A in i){const F=i[A];for(const N in F){const P=F[N];for(const k in P){const H=P[k];for(const B in H)f(H[B].object),delete H[B];delete P[k]}}delete i[A]}}function y(A){if(i[A.id]===void 0)return;const F=i[A.id];for(const N in F){const P=F[N];for(const k in P){const H=P[k];for(const B in H)f(H[B].object),delete H[B];delete P[k]}}delete i[A.id]}function g(A){for(const F in i){const N=i[F];for(const P in N){const k=N[P];if(k[A.id]===void 0)continue;const H=k[A.id];for(const B in H)f(H[B].object),delete H[B];delete k[A.id]}}}function x(A){for(const F in i){const N=i[F],P=A.isInstancedMesh===!0?A.id:0,k=N[P];if(k!==void 0){for(const H in k){const B=k[H];for(const C in B)f(B[C].object),delete B[C];delete k[H]}delete N[P],Object.keys(N).length===0&&delete i[F]}}}function I(){R(),a=!0,r!==s&&(r=s,c(r.object))}function R(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:I,resetDefaultState:R,dispose:b,releaseStatesOfGeometry:y,releaseStatesOfObject:x,releaseStatesOfProgram:g,initAttributes:_,enableAttribute:m,disableUnusedAttributes:S}}function Wg(n,e,t){let i;function s(l){i=l}function r(l,c){n.drawArrays(i,l,c),t.update(c,i,1)}function a(l,c,f){f!==0&&(n.drawArraysInstanced(i,l,c,f),t.update(c,i,f))}function o(l,c,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,f);let h=0;for(let d=0;d<f;d++)h+=c[d];t.update(h,i,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function Xg(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const g=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(g.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(g){return!(g!==Si&&i.convert(g)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(g){const x=g===Li&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(g!==Qt&&g!==Ci&&!x&&i.convert(g)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE))}function l(g){if(g==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";g="mediump"}return g==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const f=l(c);f!==c&&(Ne("WebGLRenderer:",c,"not supported, using",f,"instead."),c=f);const u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),h=t.logarithmicDepthBuffer===!0&&u===!1;t.reversedDepthBuffer===!0&&u===!1&&Ne("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),t.logarithmicDepthBuffer===!0&&u===!0&&Ne("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");const d=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),v=n.getParameter(n.MAX_VERTEX_ATTRIBS),S=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),T=n.getParameter(n.MAX_VARYING_VECTORS),E=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),b=n.getParameter(n.MAX_SAMPLES),y=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:u,maxTextures:d,maxVertexTextures:p,maxTextureSize:_,maxCubemapSize:m,maxAttributes:v,maxVertexUniforms:S,maxVaryings:T,maxFragmentUniforms:E,maxSamples:b,samples:y}}function qg(n){const e=this;let t=null,i=0,s=!1,r=!1;const a=new ji,o=new Fe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,h){const d=u.length!==0||h||i!==0||s;return s=h,i=u.length,d},this.beginShadows=function(){r=!0,f(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,h){t=f(u,h,0)},this.setState=function(u,h,d){const p=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,v=n.get(u);if(!s||p===null||p.length===0||r&&!m)r?f(null):c();else{const S=r?0:i,T=S*4;let E=v.clippingState||null;l.value=E,E=f(p,h,T,d);for(let b=0;b!==T;++b)E[b]=t[b];v.clippingState=E,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function f(u,h,d,p){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=l.value,p!==!0||m===null){const v=d+_*4,S=h.matrixWorldInverse;o.getNormalMatrix(S),(m===null||m.length<v)&&(m=new Float32Array(v));for(let T=0,E=d;T!==_;++T,E+=4)a.copy(u[T]).applyMatrix4(S,o),a.normal.toArray(m,E),m[E+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}class Jo extends Pi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Ih(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Cs(5,5,5),r=new wn({name:"CubemapFromEquirect",uniforms:ts(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Yt,blending:Kn});r.uniforms.tEquirect.value=t;const a=new Gi(s,r),o=t.minFilter;return t.minFilter===nn&&(t.minFilter=$t),new Po(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}}const rc=256,$g=3,Yg=20,Bh=256,Hh=16,Kg=3,Zg=new K,Jg=new rt;class Fr{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new Po(1,10,null),this._boxMesh=new Gi(new Cs(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,i=.1,s=100,r={}){const{size:a=256,position:o=Zg}=r,l=this._renderer;this._setSize(a);const c=this._allocateTarget(),f=this._getSourceTarget(!0);t>0&&(f.texture.mipmapsAutoUpdate=!1);const u=l.autoClear,h=l.autoClearColor,d=l.autoClearDepth,p=l.autoClearStencil,_=e.background;l.autoClear=!0,l.autoClearColor=!0,l.autoClearDepth=!0,l.autoClearStencil=!0,_===null&&(e.background=l.getClearColor(Jg));const m=new Po(i,s,f);return m.position.copy(o),m.update(l,e),l.autoClear=u,l.autoClearColor=h,l.autoClearDepth=d,l.autoClearStencil=p,e.background=_,t>0&&(f.texture.mipmapsAutoUpdate=!0,this._blur(c,t)),this._applyPMREM(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=lc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=oc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(rc,Td(e))}_fromTexture(e,t){e.mapping===jn||e.mapping===ws?this._setSize(e.image.length===0?rc:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);const i=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(i),i}_allocateTarget(){const e=this._cubeSize,t=ac(e,!1,!1),i=Math.log2(e)-$g;for(let s=0;s<=i;s++)t.texture.mipmaps.push({width:e>>s,height:e>>s});return t.texture.name="PMREM",t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){const t=this._cubeSize,i=this._sourceTarget;return(i===null||i.width!==t||e&&i.depthBuffer===!1)&&(i!==null&&i.dispose(),this._sourceTarget=ac(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,i){const s=this._boxMesh,r=this._cubeCamera;s.material=i,r.renderTarget=e,r.activeMipmapLevel=t;const a=e.width>>t;e.viewport.set(0,0,a,a),r.update(this._renderer,s),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===jn||e.mapping===ws?(this._cubemapMaterial===null&&(this._cubemapMaterial=lc()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=oc()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(e){this._ggxMaterial===null&&(this._ggxMaterial=jg(),this._integrationMaterial=Qg());const t=this._cubeSize,i=e.texture.mipmaps.length-1,s=this._ggxMaterial.uniforms;s.envMap.value=this._sourceTarget.texture;const r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(t/Hh);for(let a=0;a<=i;a++){const o=Fr.lodToRoughness(a,i);if(a>i-Kg)r.roughness.value=o,this._renderCube(e,a,this._integrationMaterial);else{const l=o>0?Math.log2(t)+.5*Math.log2(6/(Bh*Math.pow(o,4)))+.5:0;s.roughness.value=o,s.lodBias.value=l,this._renderCube(e,a,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=e0());const i=this._blurMaterial,s=i.uniforms,r=this._sourceTarget;s.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,s.envMap.value=r.texture,this._renderCube(e,0,i),s.envMap.value=e.texture,this._renderCube(r,0,i)}}function ac(n,e,t){return new Jo(n,{minFilter:nn,generateMipmaps:e,type:Li,colorSpace:Es,depthBuffer:t})}function Ps(n,e,t){return new wn({name:n,uniforms:e,vertexShader:Ge.cube_vert,fragmentShader:t,side:Yt,blending:Kn,depthTest:!1,depthWrite:!1})}function jg(){return Ps("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${Bh}u

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
	`)}function Qg(){return Ps("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:Hh}},`

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
	`)}function e0(){return Ps("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

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
	`)}function t0(n){let e=new WeakMap,t=new WeakMap,i=null;function s(h,d=!1){return h==null?null:d?a(h):r(h)}function r(h){if(h&&h.isTexture){const d=h.mapping;if(d===sa||d===ra)if(e.has(h)){const p=e.get(h).texture;return o(p,h.mapping)}else{const p=h.image;if(p&&p.height>0){const _=new Jo(p.height);return _.fromEquirectangularTexture(n,h),e.set(h,_),h.addEventListener("dispose",c),o(_.texture,h.mapping)}else return null}}return h}function a(h){if(h&&h.isTexture&&h.isPMREMTexture!==!0){const d=h.mapping,p=d===sa||d===ra,_=d===jn||d===ws;if(p||_){let m=t.get(h);const v=m!==void 0?m.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==v)return i===null&&(i=new Fr(n)),m=p?i.fromEquirectangular(h,m):i.fromCubemap(h,m),m.texture.pmremVersion=h.pmremVersion,t.set(h,m),m.texture;if(m!==void 0)return m.texture;{const S=h.image;return p&&S&&S.height>0||_&&S&&l(S)?(i===null&&(i=new Fr(n)),m=p?i.fromEquirectangular(h):i.fromCubemap(h),m.texture.pmremVersion=h.pmremVersion,t.set(h,m),h.addEventListener("dispose",f),m.texture):null}}}return h}function o(h,d){return d===sa?h.mapping=jn:d===ra&&(h.mapping=ws),h}function l(h){let d=0;const p=6;for(let _=0;_<p;_++)h[_]!==void 0&&d++;return d===p}function c(h){const d=h.target;d.removeEventListener("dispose",c);const p=e.get(d);p!==void 0&&(e.delete(d),p.dispose())}function f(h){const d=h.target;d.removeEventListener("dispose",f);const p=t.get(d);p!==void 0&&(t.delete(d),p.dispose())}function u(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:u}}function i0(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&Sr("WebGLRenderer: "+i+" extension not supported."),s}}}function n0(n,e,t,i){const s={},r=new WeakMap,a=new FinalizationRegistry(p=>delete s[p]);function o(p){l(p.target)}function l(p){p.index!==null&&e.remove(p.index);for(const m in p.attributes)e.remove(p.attributes[m]);p.removeEventListener("dispose",o),delete s[p.id],a.unregister(p);const _=r.get(p);_&&(e.remove(_),r.delete(p)),i.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function c(p,_){return s[_.id]!==void 0||(_.addEventListener("dispose",o),s[_.id]=new WeakRef(_),a.register(_,_.id,_),t.memory.geometries++),_}function f(p){const _=p.attributes;for(const m in _)e.update(_[m],n.ARRAY_BUFFER)}function u(p){const _=p.index,m=p.attributes.position;let v=0;if(m===void 0)return;const S=_!==null?_.array.length:m.array.length/3-1,T=m.count>=65535?Ch:Rh,E=new T(Math.ceil(S/3)*6,1),b=E.array;if(_!==null){const g=_.array;v=_.version;for(let x=0,I=0;x<S;x+=3){const R=g[x+0],A=g[x+1],F=g[x+2];b[I++]=R,b[I++]=A,b[I++]=A,b[I++]=F,b[I++]=F,b[I++]=R}}else{v=m.version;for(let g=0,x=0;g<S;g+=3){const I=g+0,R=g+1,A=g+2;b[x++]=I,b[x++]=R,b[x++]=R,b[x++]=A,b[x++]=A,b[x++]=I}}E.version=v;const y=r.get(p);y&&e.remove(y),r.set(p,E)}function h(p){const _=r.get(p);if(_){const m=p.index;m!==null&&_.version<m.version&&u(p)}else u(p);return r.get(p)}function d(){for(const p in s){const _=s[p].deref();_!==void 0&&l(_)}}return{get:c,update:f,getWireframeAttribute:h,dispose:d}}function s0(n,e,t){let i;function s(u){i=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function l(u,h){n.drawElements(i,h,r,u*a),t.update(h,i,1)}function c(u,h,d){d!==0&&(n.drawElementsInstanced(i,h,r,u*a,d),t.update(h,i,d))}function f(u,h,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,h,0,r,u,0,d);let _=0;for(let m=0;m<d;m++)_+=h[m];t.update(_,i,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=f}function r0(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:it("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function a0(n,e,t){const i=new WeakMap,s=new _t;function r(a,o,l){const c=a.morphTargetInfluences,f=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=f!==void 0?f.length:0;let h=i.get(o);if(h===void 0||h.count!==u){let R=function(){x.dispose(),i.delete(o),o.removeEventListener("dispose",R)};var d=R;h!==void 0&&h.texture.dispose();const p=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,v=o.morphAttributes.position||[],S=o.morphAttributes.normal||[],T=o.morphAttributes.color||[];let E=0;p===!0&&(E=1),_===!0&&(E=2),m===!0&&(E=3);let b=o.attributes.position.count*E,y=1;b>e.maxTextureSize&&(y=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);const g=new Float32Array(b*y*4*u),x=new Eh(g,b,y,u);x.type=Ci,x.needsUpdate=!0;const I=E*4;for(let A=0;A<u;A++){const F=v[A],N=S[A],P=T[A],k=b*y*4*A;for(let H=0;H<F.count;H++){const B=H*I;p===!0&&(s.fromBufferAttribute(F,H),g[k+B+0]=s.x,g[k+B+1]=s.y,g[k+B+2]=s.z,g[k+B+3]=0),_===!0&&(s.fromBufferAttribute(N,H),g[k+B+4]=s.x,g[k+B+5]=s.y,g[k+B+6]=s.z,g[k+B+7]=0),m===!0&&(s.fromBufferAttribute(P,H),g[k+B+8]=s.x,g[k+B+9]=s.y,g[k+B+10]=s.z,g[k+B+11]=P.itemSize===4?s.w:1)}}h={count:u,texture:x,size:new nt(b,y)},i.set(o,h),o.addEventListener("dispose",R)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let p=0;for(let m=0;m<c.length;m++)p+=c[m];const _=o.morphTargetsRelative?1:1-p;l.getUniforms().setValue(n,"morphTargetBaseInfluence",_),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:r}}function o0(n,e,t,i,s){let r=new WeakMap;function a(c){const f=s.render.frame,u=c.geometry,h=e.get(c,u);if(r.get(h)!==f&&(e.update(h),r.set(h,f)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==f&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),r.set(c,f))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==f&&(d.update(),r.set(d,f))}return h}function o(){r=new WeakMap}function l(c){const f=c.target;f.removeEventListener("dispose",l),i.releaseStatesOfObject(f),t.remove(f.instanceMatrix),f.instanceColor!==null&&t.remove(f.instanceColor)}return{update:a,dispose:o}}const l0={[oh]:"LINEAR_TONE_MAPPING",[lh]:"REINHARD_TONE_MAPPING",[ch]:"CINEON_TONE_MAPPING",[hh]:"ACES_FILMIC_TONE_MAPPING",[fh]:"AGX_TONE_MAPPING",[dh]:"NEUTRAL_TONE_MAPPING",[uh]:"CUSTOM_TONE_MAPPING"};function c0(n,e,t,i,s,r){const a=new Pi(e,t,{type:n,depthBuffer:s,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,l=null,c=null;const f=new an;f.setAttribute("position",new wi([-1,3,0,-1,-1,0,3,-1,0],3)),f.setAttribute("uv",new wi([0,2,0,0,2,0],2));const u=new Co({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),h=new Gi(f,u),d=new Fh(-1,1,1,-1,0,1);let p=null,_=null,m=!1,v,S=null,T=[],E=!1;this.setSize=function(b,y){a.setSize(b,y),o!==null&&o.setSize(b,y),l!==null&&l.setSize(b,y);for(let g=0;g<T.length;g++){const x=T[g];x.setSize&&x.setSize(b,y)}},this.setEffects=function(b){T=b,E=T.length>0&&T[0].isRenderPass===!0;const y=a.width,g=a.height;T.length>0&&o===null&&(o=new Pi(y,g,{type:Li,depthBuffer:!1,stencilBuffer:!1}),l=new Pi(y,g,{type:Li,depthBuffer:!1,stencilBuffer:!1}));const x=s===!0&&T.some(I=>I.needsDepthTexture===!0);x!==(a.depthTexture!==null)&&(x===!0&&c===null&&(c=new es(y,g),r===!0&&(c.format=sn,c.type=Qn)),a.dispose(),a.depthTexture=x?c:null,a.resolveDepthBuffer=x,a.storeMultisampledDepthBuffer=x);for(let I=0;I<T.length;I++){const R=T[I];R.setSize&&R.setSize(y,g),x&&R.needsDepthTexture===!0&&R.setDepthTexture&&R.setDepthTexture(c)}},this.begin=function(b,y){if(m||b.toneMapping===Hi&&T.length===0)return!1;if(S=y,y!==null){const g=y.width,x=y.height;(a.width!==g||a.height!==x)&&this.setSize(g,x)}return E===!1&&b.setRenderTarget(a),v=b.toneMapping,b.toneMapping=Hi,!0},this.hasRenderPass=function(){return E},this.end=function(b,y){b.toneMapping=v,m=!0;let g=a,x=o;for(let I=0;I<T.length;I++){const R=T[I];R.enabled!==!1&&(R.render(b,x,g,y),R.needsSwap!==!1&&(g=x,x=x===o?l:o))}if(p!==b.outputColorSpace||_!==b.toneMapping){p=b.outputColorSpace,_=b.toneMapping,u.defines={},Ye.getTransfer(p)===ot&&(u.defines.SRGB_TRANSFER="");const I=l0[_];I&&(u.defines[I]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=g.texture,b.setRenderTarget(S),b.render(h,d),S=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),f.dispose(),u.dispose()}}const zh=new Wt,Gh=new es(1,1),Vh=new Lh(1),Wh=new Eh,Xh=new Nd,qh=new Ih,cc=[],hc=[],uc=new Float32Array(16),fc=new Float32Array(9),dc=new Float32Array(4);function ns(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let r=cc[s];if(r===void 0&&(r=new Float32Array(s),cc[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function Et(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Tt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function zr(n,e){let t=hc[e];t===void 0&&(t=new Int32Array(e),hc[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function h0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function u0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Et(t,e))return;n.uniform2fv(this.addr,e),Tt(t,e)}}function f0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Et(t,e))return;n.uniform3fv(this.addr,e),Tt(t,e)}}function d0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Et(t,e))return;n.uniform4fv(this.addr,e),Tt(t,e)}}function p0(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Et(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Tt(t,e)}else{if(Et(t,i))return;dc.set(i),n.uniformMatrix2fv(this.addr,!1,dc),Tt(t,i)}}function m0(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Et(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Tt(t,e)}else{if(Et(t,i))return;fc.set(i),n.uniformMatrix3fv(this.addr,!1,fc),Tt(t,i)}}function g0(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Et(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Tt(t,e)}else{if(Et(t,i))return;uc.set(i),n.uniformMatrix4fv(this.addr,!1,uc),Tt(t,i)}}function v0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function x0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Et(t,e))return;n.uniform2iv(this.addr,e),Tt(t,e)}}function _0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Et(t,e))return;n.uniform3iv(this.addr,e),Tt(t,e)}}function y0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Et(t,e))return;n.uniform4iv(this.addr,e),Tt(t,e)}}function S0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function M0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Et(t,e))return;n.uniform2uiv(this.addr,e),Tt(t,e)}}function w0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Et(t,e))return;n.uniform3uiv(this.addr,e),Tt(t,e)}}function b0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Et(t,e))return;n.uniform4uiv(this.addr,e),Tt(t,e)}}function Gr(n){return n.version===0&&(n.compareFunction=wh,n.needsUpdate=!0),n}function E0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?r=Gr(Gh):r=zh,t.setTexture2D(e||r,s)}function T0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||Xh,s)}function A0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_CUBE_SHADOW?r=Gr(Vh):r=qh,t.setTextureCube(e||r,s)}function R0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||Wh,s)}function C0(n){switch(n){case 5126:return h0;case 35664:return u0;case 35665:return f0;case 35666:return d0;case 35674:return p0;case 35675:return m0;case 35676:return g0;case 5124:case 35670:return v0;case 35667:case 35671:return x0;case 35668:case 35672:return _0;case 35669:case 35673:return y0;case 5125:return S0;case 36294:return M0;case 36295:return w0;case 36296:return b0;case 35678:case 36198:case 36298:case 36306:case 35682:return E0;case 35679:case 36299:case 36307:return T0;case 35680:case 36300:case 36308:case 36293:return A0;case 36289:case 36303:case 36311:case 36292:return R0}}function P0(n,e){n.uniform1fv(this.addr,e)}function I0(n,e){const t=ns(e,this.size,2);n.uniform2fv(this.addr,t)}function L0(n,e){const t=ns(e,this.size,3);n.uniform3fv(this.addr,t)}function D0(n,e){const t=ns(e,this.size,4);n.uniform4fv(this.addr,t)}function N0(n,e){const t=ns(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function U0(n,e){const t=ns(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function F0(n,e){const t=ns(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function O0(n,e){n.uniform1iv(this.addr,e)}function k0(n,e){n.uniform2iv(this.addr,e)}function B0(n,e){n.uniform3iv(this.addr,e)}function H0(n,e){n.uniform4iv(this.addr,e)}function z0(n,e){n.uniform1uiv(this.addr,e)}function G0(n,e){n.uniform2uiv(this.addr,e)}function V0(n,e){n.uniform3uiv(this.addr,e)}function W0(n,e){n.uniform4uiv(this.addr,e)}function X0(n,e,t){const i=this.cache,s=e.length,r=zr(t,s);Et(i,r)||(n.uniform1iv(this.addr,r),Tt(i,r));let a;this.type===n.SAMPLER_2D_SHADOW?a=Gr(Gh):a=zh;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function q0(n,e,t){const i=this.cache,s=e.length,r=zr(t,s);Et(i,r)||(n.uniform1iv(this.addr,r),Tt(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Xh,r[a])}function $0(n,e,t){const i=this.cache,s=e.length,r=zr(t,s);Et(i,r)||(n.uniform1iv(this.addr,r),Tt(i,r));let a;this.type===n.SAMPLER_CUBE_SHADOW?a=Gr(Vh):a=qh;for(let o=0;o!==s;++o)t.setTextureCube(e[o]||a,r[o])}function Y0(n,e,t){const i=this.cache,s=e.length,r=zr(t,s);Et(i,r)||(n.uniform1iv(this.addr,r),Tt(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Wh,r[a])}function K0(n){switch(n){case 5126:return P0;case 35664:return I0;case 35665:return L0;case 35666:return D0;case 35674:return N0;case 35675:return U0;case 35676:return F0;case 5124:case 35670:return O0;case 35667:case 35671:return k0;case 35668:case 35672:return B0;case 35669:case 35673:return H0;case 5125:return z0;case 36294:return G0;case 36295:return V0;case 36296:return W0;case 35678:case 36198:case 36298:case 36306:case 35682:return X0;case 35679:case 36299:case 36307:return q0;case 35680:case 36300:case 36308:case 36293:return $0;case 36289:case 36303:case 36311:case 36292:return Y0}}class Z0{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=C0(t.type)}}class J0{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=K0(t.type)}}class j0{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],i)}}}const Pa=/(\w+)(\])?(\[|\.)?/g;function pc(n,e){n.seq.push(e),n.map[e.id]=e}function Q0(n,e,t){const i=n.name,s=i.length;for(Pa.lastIndex=0;;){const r=Pa.exec(i),a=Pa.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){pc(t,c===void 0?new Z0(o,n,e):new J0(o,n,e));break}else{let u=t.map[o];u===void 0&&(u=new j0(o),pc(t,u)),t=u}}}class Mr{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);Q0(o,l,this)}const s=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&i.push(a)}return i}}function mc(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const ev=37297;let tv=0;function iv(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const gc=new Fe;function nv(n){Ye._getMatrix(gc,Ye.workingColorSpace,n);const e=`mat3( ${gc.elements.map(t=>t.toFixed(4))} )`;switch(Ye.getTransfer(n)){case Ir:return[e,"LinearTransferOETF"];case ot:return[e,"sRGBTransferOETF"];default:return Ne("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function vc(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+iv(n.getShaderSource(e),o)}else return r}function sv(n,e){const t=nv(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( ${t[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}const rv={[oh]:"Linear",[lh]:"Reinhard",[ch]:"Cineon",[hh]:"ACESFilmic",[fh]:"AgX",[dh]:"Neutral",[uh]:"Custom"};function av(n,e){const t=rv[e];return t===void 0?(Ne("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const or=new K;function ov(){Ye.getLuminanceCoefficients(or);const n=or.x.toFixed(4),e=or.y.toFixed(4),t=or.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function lv(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(vs).join(`
`)}function cv(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function hv(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(e,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function vs(n){return n!==""}function xc(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,e.numLightProbeGrids)}function _c(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const uv=/^[ \t]*#include +<([\w\d./]+)>/gm;function Io(n){return n.replace(uv,fv)}function fv(n,e){const t=Ge[e];if(t===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">");return Io(t)}const dv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function yc(n){return n.replace(dv,pv)}function pv(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Sc(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}const mv={[gr]:"SHADOWMAP_TYPE_PCF",[gs]:"SHADOWMAP_TYPE_VSM"};function gv(n){return mv[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const vv={[ws]:"ENVMAP_MODE_REFRACTION"};function xv(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":vv[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const _v={[ah]:"ENVMAP_BLENDING_MULTIPLY",[cd]:"ENVMAP_BLENDING_MIX",[hd]:"ENVMAP_BLENDING_ADD"};function yv(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":_v[n.combine]||"ENVMAP_BLENDING_NONE"}function Sv(n,e,t,i){const s=n.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=gv(t),c=t.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",f=xv(t),u=yv(t),h=lv(t),d=cv(r),p=s.createProgram();let _,m,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(_=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d].filter(vs).join(`
`),_.length>0&&(_+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d].filter(vs).join(`
`),m.length>0&&(m+=`
`)):(_=[Sc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+f:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+t.diffuseRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(vs).join(`
`),m=[Sc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+f:"",t.envMap?"#define "+u:"",t.envMapPMREM?"#define ENVMAP_MAX_LOD "+t.envMapMaxLod+".0":"",t.envMapPMREM?"#define ENVMAP_SIZE "+t.envMapSize+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Hi?"#define TONE_MAPPING":"",t.toneMapping!==Hi?Ge.tonemapping_pars_fragment:"",t.toneMapping!==Hi?av("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ge.colorspace_pars_fragment,sv("linearToOutputTexel",t.outputColorSpace),ov(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(vs).join(`
`)),a=Io(a),a=xc(a,t),a=_c(a,t),o=Io(o),o=xc(o,t),o=_c(o,t),a=yc(a),o=yc(o),t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,_=[h,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+_,m=["#define varying in",t.glslVersion===Lr?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Lr?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const S=v+_+a,T=v+m+o,E=mc(s,s.VERTEX_SHADER,S),b=mc(s,s.FRAGMENT_SHADER,T);s.attachShader(p,E),s.attachShader(p,b),t.index0AttributeName!==void 0?s.bindAttribLocation(p,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(p,0,"position"),s.linkProgram(p);function y(R){if(n.debug.checkShaderErrors){const A=s.getProgramInfoLog(p)||"",F=s.getShaderInfoLog(E)||"",N=s.getShaderInfoLog(b)||"",P=A.trim(),k=F.trim(),H=N.trim();let B=!0,C=!0;if(s.getProgramParameter(p,s.LINK_STATUS)===!1)if(B=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,p,E,b);else{const L=vc(s,E,"vertex"),V=vc(s,b,"fragment");it("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(p,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+P+`
`+L+`
`+V)}else P!==""?Ne("WebGLProgram: Program Info Log:",P):(k===""||H==="")&&(C=!1);C&&(R.diagnostics={runnable:B,programLog:P,vertexShader:{log:k,prefix:_},fragmentShader:{log:H,prefix:m}})}s.deleteShader(E),s.deleteShader(b),g=new Mr(s,p),x=hv(s,p)}let g;this.getUniforms=function(){return g===void 0&&y(this),g};let x;this.getAttributes=function(){return x===void 0&&y(this),x};let I=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return I===!1&&(I=s.getProgramParameter(p,ev)),I},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(p),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=tv++,this.cacheKey=e,this.usedTimes=1,this.program=p,this.vertexShader=E,this.fragmentShader=b,this}let Mv=0;class wv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){const s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new bv(e),t.set(e,i)),i}}class bv{constructor(e){this.id=Mv++,this.code=e,this.usedTimes=0}}function Ev(n){return n===Sn||n===Cr||n===Pr}function Tv(n,e,t,i,s,r){const a=new Th,o=new wv,l=new Set,c=[],f=new Map,u=i.logarithmicDepthBuffer,h={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function d(g){return l.add(g),g===0?"uv":`uv${g}`}function p(g,x,I,R,A,F){const N=R.fog,P=A.geometry,k=g.isMeshStandardMaterial||g.isMeshLambertMaterial||g.isMeshPhongMaterial?R.environment:null,H=g.isMeshStandardMaterial||g.isMeshLambertMaterial&&!g.envMap||g.isMeshPhongMaterial&&!g.envMap,B=e.get(g.envMap||k,H),C=h[g.type];let L=i.precision;g.precision!==null&&(L=i.getMaxPrecision(g.precision),L!==g.precision&&Ne("WebGLProgram.getParameters:",g.precision,"not supported, using",L,"instead."));const V=P.morphAttributes.position||P.morphAttributes.normal||P.morphAttributes.color,$=V!==void 0?V.length:0;let ie=0;P.morphAttributes.position!==void 0&&(ie=1),P.morphAttributes.normal!==void 0&&(ie=2),P.morphAttributes.color!==void 0&&(ie=3);let ne,G,se,ge;if(C){const xe=Ai[C];ne=xe.vertexShader,G=xe.fragmentShader}else{ne=g.vertexShader,G=g.fragmentShader;const xe=o.getVertexShaderStage(g),at=o.getFragmentShaderStage(g);o.update(g,xe,at),se=xe.id,ge=at.id}const Se=n.getRenderTarget(),ae=n.state.buffers.depth.getReversed(),Le=A.isInstancedMesh===!0,lt=A.isBatchedMesh===!0,Re=!!g.map,Ve=!!g.matcap,Xe=!!B,ee=Xe&&B.isPMREMTexture===!0,Ee=!!g.aoMap,we=!!g.lightMap,Ze=!!g.bumpMap&&g.wireframe===!1,st=!!g.normalMap,Xt=!!g.displacementMap,He=!!g.emissiveMap,Nt=!!g.metalnessMap,ti=!!g.roughnessMap,ii=g.anisotropy>0,z=g.clearcoat>0,ni=g.diffuseRoughness>0,mt=g.dispersion>0,gt=g.retroreflectivity>0,ve=g.iridescence>0,bt=g.sheen>0,De=g.transmission>0,Ue=ii&&!!g.anisotropyMap,D=z&&!!g.clearcoatMap,M=z&&!!g.clearcoatNormalMap,X=z&&!!g.clearcoatRoughnessMap,re=ni&&!!g.diffuseRoughnessMap,te=ve&&!!g.iridescenceMap,ce=ve&&!!g.iridescenceThicknessMap,pe=bt&&!!g.sheenColorMap,J=bt&&!!g.sheenRoughnessMap,j=!!g.specularMap,ue=!!g.specularColorMap,U=!!g.specularIntensityMap,Q=De&&!!g.transmissionMap,Z=De&&!!g.thicknessMap,fe=!!g.gradientMap,le=!!g.alphaMap,he=g.alphaTest>0,Pe=!!g.alphaHash,ze=!!g.extensions;let oe=Hi;g.toneMapped&&(Se===null||Se.isXRRenderTarget===!0)&&(oe=n.toneMapping);const Ie=ee?B.isCompressedCubeTexture?B.image[0].mipmaps:B.mipmaps:null,Be={shaderID:C,shaderType:g.type,shaderName:g.name,vertexShader:ne,fragmentShader:G,defines:g.defines,customVertexShaderID:se,customFragmentShaderID:ge,isRawShaderMaterial:g.isRawShaderMaterial===!0,glslVersion:g.glslVersion,precision:L,batching:lt,batchingColor:lt&&A._colorsTexture!==null,instancing:Le,instancingColor:Le&&A.instanceColor!==null,instancingMorph:Le&&A.morphTexture!==null,outputColorSpace:Se===null?n.outputColorSpace:Se.isXRRenderTarget===!0?Se.texture.colorSpace:Ye.workingColorSpace,alphaToCoverage:!!g.alphaToCoverage,map:Re,matcap:Ve,envMap:Xe,envMapMode:Xe&&B.mapping,envMapPMREM:ee,envMapMaxLod:ee?Ie.length-1:null,envMapSize:ee?Ie[0].width:null,aoMap:Ee,lightMap:we,bumpMap:Ze,normalMap:st,displacementMap:Xt,emissiveMap:He,normalMapObjectSpace:st&&g.normalMapType===dd,normalMapTangentSpace:st&&g.normalMapType===Ol,packedNormalMap:st&&g.normalMapType===Ol&&Ev(g.normalMap.format),metalnessMap:Nt,roughnessMap:ti,anisotropy:ii,anisotropyMap:Ue,clearcoat:z,clearcoatMap:D,clearcoatNormalMap:M,clearcoatRoughnessMap:X,diffuseRoughness:ni,diffuseRoughnessMap:re,dispersion:mt,retroreflection:gt,iridescence:ve,iridescenceMap:te,iridescenceThicknessMap:ce,sheen:bt,sheenColorMap:pe,sheenRoughnessMap:J,specularMap:j,specularColorMap:ue,specularIntensityMap:U,transmission:De,transmissionMap:Q,thicknessMap:Z,gradientMap:fe,opaque:g.transparent===!1&&g.blending===Ss&&g.alphaToCoverage===!1,alphaMap:le,alphaTest:he,alphaHash:Pe,combine:g.combine,mapUv:Re&&d(g.map.channel),aoMapUv:Ee&&d(g.aoMap.channel),lightMapUv:we&&d(g.lightMap.channel),bumpMapUv:Ze&&d(g.bumpMap.channel),normalMapUv:st&&d(g.normalMap.channel),displacementMapUv:Xt&&d(g.displacementMap.channel),emissiveMapUv:He&&d(g.emissiveMap.channel),metalnessMapUv:Nt&&d(g.metalnessMap.channel),roughnessMapUv:ti&&d(g.roughnessMap.channel),anisotropyMapUv:Ue&&d(g.anisotropyMap.channel),clearcoatMapUv:D&&d(g.clearcoatMap.channel),clearcoatNormalMapUv:M&&d(g.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:X&&d(g.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:re&&d(g.diffuseRoughnessMap.channel),iridescenceMapUv:te&&d(g.iridescenceMap.channel),iridescenceThicknessMapUv:ce&&d(g.iridescenceThicknessMap.channel),sheenColorMapUv:pe&&d(g.sheenColorMap.channel),sheenRoughnessMapUv:J&&d(g.sheenRoughnessMap.channel),specularMapUv:j&&d(g.specularMap.channel),specularColorMapUv:ue&&d(g.specularColorMap.channel),specularIntensityMapUv:U&&d(g.specularIntensityMap.channel),transmissionMapUv:Q&&d(g.transmissionMap.channel),thicknessMapUv:Z&&d(g.thicknessMap.channel),alphaMapUv:le&&d(g.alphaMap.channel),vertexTangents:!!P.attributes.tangent&&(st||ii),vertexNormals:!!P.attributes.normal,vertexColors:g.vertexColors,vertexAlphas:g.vertexColors===!0&&!!P.attributes.color&&P.attributes.color.itemSize===4,pointsUvs:A.isPoints===!0&&!!P.attributes.uv&&(Re||le),fog:!!N,useFog:g.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:g.wireframe===!1&&(g.flatShading===!0||P.attributes.normal===void 0&&st===!1&&(g.isMeshLambertMaterial||g.isMeshPhongMaterial||g.isMeshStandardMaterial||g.isMeshPhysicalMaterial)),sizeAttenuation:g.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:ae,skinning:A.isSkinnedMesh===!0,hasPositionAttribute:P.attributes.position!==void 0,morphTargets:P.morphAttributes.position!==void 0,morphNormals:P.morphAttributes.normal!==void 0,morphColors:P.morphAttributes.color!==void 0,morphTargetsCount:$,morphTextureStride:ie,numSunLights:x.sun.length,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numSunLightShadows:x.sunShadowMap.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numLightProbeGrids:F.filter(xe=>xe.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:g.dithering,shadowMapEnabled:n.shadowMap.enabled&&I.length>0,shadowMapType:n.shadowMap.type,toneMapping:oe,decodeVideoTexture:Re&&g.map.isVideoTexture===!0&&Ye.getTransfer(g.map.colorSpace)===ot,decodeVideoTextureEmissive:He&&g.emissiveMap.isVideoTexture===!0&&Ye.getTransfer(g.emissiveMap.colorSpace)===ot,premultipliedAlpha:g.premultipliedAlpha,doubleSided:g.side===_i,flipSided:g.side===Yt,useDepthPacking:g.depthPacking>=0,depthPacking:g.depthPacking||0,index0AttributeName:g.index0AttributeName,extensionClipCullDistance:ze&&g.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ze&&g.extensions.multiDraw===!0||lt)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:g.customProgramCacheKey()};return Be.vertexUv1s=l.has(1),Be.vertexUv2s=l.has(2),Be.vertexUv3s=l.has(3),l.clear(),Be}function _(g){const x=[];if(g.shaderID?x.push(g.shaderID):(x.push(g.customVertexShaderID),x.push(g.customFragmentShaderID)),g.defines!==void 0)for(const I in g.defines)x.push(I),x.push(g.defines[I]);return g.isRawShaderMaterial===!1&&(m(x,g),v(x,g),x.push(n.outputColorSpace)),x.push(g.customProgramCacheKey),x.join()}function m(g,x){g.push(x.precision),g.push(x.outputColorSpace),g.push(x.envMapMode),g.push(x.envMapPMREM),g.push(x.envMapMaxLod),g.push(x.envMapSize),g.push(x.mapUv),g.push(x.alphaMapUv),g.push(x.lightMapUv),g.push(x.aoMapUv),g.push(x.bumpMapUv),g.push(x.normalMapUv),g.push(x.displacementMapUv),g.push(x.emissiveMapUv),g.push(x.metalnessMapUv),g.push(x.roughnessMapUv),g.push(x.anisotropyMapUv),g.push(x.clearcoatMapUv),g.push(x.clearcoatNormalMapUv),g.push(x.clearcoatRoughnessMapUv),g.push(x.diffuseRoughnessMapUv),g.push(x.iridescenceMapUv),g.push(x.iridescenceThicknessMapUv),g.push(x.sheenColorMapUv),g.push(x.sheenRoughnessMapUv),g.push(x.specularMapUv),g.push(x.specularColorMapUv),g.push(x.specularIntensityMapUv),g.push(x.transmissionMapUv),g.push(x.thicknessMapUv),g.push(x.combine),g.push(x.fogExp2),g.push(x.sizeAttenuation),g.push(x.morphTargetsCount),g.push(x.numSunLights),g.push(x.numDirLights),g.push(x.numPointLights),g.push(x.numSpotLights),g.push(x.numSpotLightMaps),g.push(x.numHemiLights),g.push(x.numRectAreaLights),g.push(x.numSunLightShadows),g.push(x.numDirLightShadows),g.push(x.numPointLightShadows),g.push(x.numSpotLightShadows),g.push(x.numSpotLightShadowsWithMaps),g.push(x.numLightProbes),g.push(x.numLightProbeGrids),g.push(x.shadowMapType),g.push(x.toneMapping),g.push(x.numClippingPlanes),g.push(x.numClipIntersection),g.push(x.depthPacking)}function v(g,x){a.disableAll(),x.instancing&&a.enable(0),x.instancingColor&&a.enable(1),x.instancingMorph&&a.enable(2),x.matcap&&a.enable(3),x.envMap&&a.enable(4),x.normalMapObjectSpace&&a.enable(5),x.normalMapTangentSpace&&a.enable(6),x.clearcoat&&a.enable(7),x.iridescence&&a.enable(8),x.alphaTest&&a.enable(9),x.vertexColors&&a.enable(10),x.vertexAlphas&&a.enable(11),x.vertexUv1s&&a.enable(12),x.vertexUv2s&&a.enable(13),x.vertexUv3s&&a.enable(14),x.vertexTangents&&a.enable(15),x.anisotropy&&a.enable(16),x.alphaHash&&a.enable(17),x.batching&&a.enable(18),x.dispersion&&a.enable(19),x.retroreflection&&a.enable(24),x.diffuseRoughness&&a.enable(25),x.batchingColor&&a.enable(20),x.gradientMap&&a.enable(21),x.packedNormalMap&&a.enable(22),x.vertexNormals&&a.enable(23),g.push(a.mask),a.disableAll(),x.fog&&a.enable(0),x.useFog&&a.enable(1),x.flatShading&&a.enable(2),x.logarithmicDepthBuffer&&a.enable(3),x.reversedDepthBuffer&&a.enable(4),x.skinning&&a.enable(5),x.morphTargets&&a.enable(6),x.morphNormals&&a.enable(7),x.morphColors&&a.enable(8),x.premultipliedAlpha&&a.enable(9),x.shadowMapEnabled&&a.enable(10),x.doubleSided&&a.enable(11),x.flipSided&&a.enable(12),x.useDepthPacking&&a.enable(13),x.dithering&&a.enable(14),x.transmission&&a.enable(15),x.sheen&&a.enable(16),x.opaque&&a.enable(17),x.pointsUvs&&a.enable(18),x.decodeVideoTexture&&a.enable(19),x.decodeVideoTextureEmissive&&a.enable(20),x.alphaToCoverage&&a.enable(21),x.numLightProbeGrids>0&&a.enable(22),x.hasPositionAttribute&&a.enable(23),g.push(a.mask)}function S(g){const x=h[g.type];let I;if(x){const R=Ai[x];I=ep.clone(R.uniforms)}else I=g.uniforms;return I}function T(g,x){let I=f.get(x);return I!==void 0?++I.usedTimes:(I=new Sv(n,x,g,s),c.push(I),f.set(x,I)),I}function E(g){if(--g.usedTimes===0){const x=c.indexOf(g);c[x]=c[c.length-1],c.pop(),f.delete(g.cacheKey),g.destroy()}}function b(g){o.remove(g)}function y(){o.dispose()}return{getParameters:p,getProgramCacheKey:_,getUniforms:S,acquireProgram:T,releaseProgram:E,releaseShaderCache:b,programs:c,dispose:y}}function Av(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,l){n.get(a)[o]=l}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function Rv(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function Mc(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function wc(){const n=[];let e=0;const t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(h){let d=0;return h.isInstancedMesh&&(d+=2),h.isSkinnedMesh&&(d+=1),d}function o(h,d,p,_,m,v){let S=n[e];return S===void 0?(S={id:h.id,object:h,geometry:d,material:p,materialVariant:a(h),groupOrder:_,renderOrder:h.renderOrder,z:m,group:v},n[e]=S):(S.id=h.id,S.object=h,S.geometry=d,S.material=p,S.materialVariant=a(h),S.groupOrder=_,S.renderOrder=h.renderOrder,S.z=m,S.group=v),e++,S}function l(h,d,p,_,m,v,S){S.reversedDepth===!0&&(m=-m);const T=o(h,d,p,_,m,v);p.transmission>0?i.push(T):p.transparent===!0?s.push(T):t.push(T)}function c(h,d,p,_,m,v){const S=o(h,d,p,_,m,v);p.transmission>0?i.unshift(S):p.transparent===!0?s.unshift(S):t.unshift(S)}function f(h,d){t.length>1&&t.sort(h||Rv),i.length>1&&i.sort(d||Mc),s.length>1&&s.sort(d||Mc)}function u(){for(let h=e,d=n.length;h<d;h++){const p=n[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:l,unshift:c,finish:u,sort:f}}function Cv(){let n=new WeakMap;function e(i,s){const r=n.get(i);let a;return r===void 0?(a=new wc,n.set(i,[a])):s>=r.length?(a=new wc,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function Pv(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new K,color:new rt};break;case"SpotLight":t={position:new K,direction:new K,color:new rt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new K,color:new rt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new K,skyColor:new rt,groundColor:new rt};break;case"RectAreaLight":t={color:new rt,position:new K,halfWidth:new K,halfHeight:new K};break}return n[e.id]=t,t}}}function Iv(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let Lv=0;function Dv(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function Nv(n){const e=new Pv,t=Iv(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new K);const s=new K,r=new yt,a=new yt;function o(c){let f=0,u=0,h=0;for(let F=0;F<9;F++)i.probe[F].set(0,0,0);let d=0,p=0,_=0,m=0,v=0,S=0,T=0,E=0,b=0,y=0,g=0,x=0,I=0,R=0;c.sort(Dv);for(let F=0,N=c.length;F<N;F++){const P=c[F],k=P.color,H=P.intensity,B=P.distance;let C=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===Sn?C=P.shadow.map.texture:C=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)f+=k.r*H,u+=k.g*H,h+=k.b*H;else if(P.isLightProbe){for(let L=0;L<9;L++)i.probe[L].addScaledVector(P.sh.coefficients[L],H);R++}else if(P.isSunLight){const L=e.get(P);if(L.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const V=P.shadow,$=t.get(P);$.shadowIntensity=V.intensity,$.shadowBias=V.bias,$.shadowNormalBias=V.normalBias,$.shadowRadius=V.radius,$.shadowMapSize.copy(V.mapSize).multiply(V.getFrameExtents()),i.sunShadow[p]=$,i.sunShadowMap[p]=C;const ie=V.getViewportCount();for(let ne=0;ne<ie;ne++)i.sunShadowMatrix[_+ne]=V.getMatrix(ne),i.sunShadowCascade[_+ne]=V._cascadeData[ne];_+=ie,p++}i.sun[d]=L,d++}else if(P.isDirectionalLight){const L=e.get(P);if(L.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const V=P.shadow,$=t.get(P);$.shadowIntensity=V.intensity,$.shadowBias=V.bias,$.shadowNormalBias=V.normalBias,$.shadowRadius=V.radius,$.shadowMapSize=V.mapSize,i.directionalShadow[m]=$,i.directionalShadowMap[m]=C,i.directionalShadowMatrix[m]=P.shadow.matrix,b++}i.directional[m]=L,m++}else if(P.isSpotLight){const L=e.get(P);L.position.setFromMatrixPosition(P.matrixWorld),L.color.copy(k).multiplyScalar(H),L.distance=B,L.coneCos=Math.cos(P.angle),L.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),L.decay=P.decay,i.spot[S]=L;const V=P.shadow;if(P.map&&(i.spotLightMap[x]=P.map,x++,V.updateMatrices(P),P.castShadow&&I++),i.spotLightMatrix[S]=V.matrix,P.castShadow){const $=t.get(P);$.shadowIntensity=V.intensity,$.shadowBias=V.bias,$.shadowNormalBias=V.normalBias,$.shadowRadius=V.radius,$.shadowMapSize=V.mapSize,i.spotShadow[S]=$,i.spotShadowMap[S]=C,g++}S++}else if(P.isRectAreaLight){const L=e.get(P);L.color.copy(k).multiplyScalar(H),L.halfWidth.set(P.width*.5,0,0),L.halfHeight.set(0,P.height*.5,0),i.rectArea[T]=L,T++}else if(P.isPointLight){const L=e.get(P);if(L.color.copy(P.color).multiplyScalar(P.intensity),L.distance=P.distance,L.decay=P.decay,P.castShadow){const V=P.shadow,$=t.get(P);$.shadowIntensity=V.intensity,$.shadowBias=V.bias,$.shadowNormalBias=V.normalBias,$.shadowRadius=V.radius,$.shadowMapSize=V.mapSize,$.shadowCameraNear=V.camera.near,$.shadowCameraFar=V.camera.far,i.pointShadow[v]=$,i.pointShadowMap[v]=C,i.pointShadowMatrix[v]=P.shadow.matrix,y++}i.point[v]=L,v++}else if(P.isHemisphereLight){const L=e.get(P);L.skyColor.copy(P.color).multiplyScalar(H),L.groundColor.copy(P.groundColor).multiplyScalar(H),i.hemi[E]=L,E++}}T>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=_e.LTC_FLOAT_1,i.rectAreaLTC2=_e.LTC_FLOAT_2):(i.rectAreaLTC1=_e.LTC_HALF_1,i.rectAreaLTC2=_e.LTC_HALF_2)),i.ambient[0]=f,i.ambient[1]=u,i.ambient[2]=h;const A=i.hash;(A.sunLength!==d||A.directionalLength!==m||A.pointLength!==v||A.spotLength!==S||A.rectAreaLength!==T||A.hemiLength!==E||A.numSunShadows!==p||A.numDirectionalShadows!==b||A.numPointShadows!==y||A.numSpotShadows!==g||A.numSpotMaps!==x||A.numLightProbes!==R)&&(i.sun.length=d,i.directional.length=m,i.spot.length=S,i.rectArea.length=T,i.point.length=v,i.hemi.length=E,i.sunShadow.length=p,i.sunShadowMap.length=p,i.sunShadowMatrix.length=_,i.sunShadowCascade.length=_,i.directionalShadow.length=b,i.directionalShadowMap.length=b,i.directionalShadowMatrix.length=b,i.pointShadow.length=y,i.pointShadowMap.length=y,i.pointShadowMatrix.length=y,i.spotShadow.length=g,i.spotShadowMap.length=g,i.spotLightMatrix.length=g+x-I,i.spotLightMap.length=x,i.numSpotLightShadowsWithMaps=I,i.numLightProbes=R,A.sunLength=d,A.directionalLength=m,A.pointLength=v,A.spotLength=S,A.rectAreaLength=T,A.hemiLength=E,A.numSunShadows=p,A.numDirectionalShadows=b,A.numPointShadows=y,A.numSpotShadows=g,A.numSpotMaps=x,A.numLightProbes=R,i.version=Lv++)}function l(c,f){let u=0,h=0,d=0,p=0,_=0,m=0;const v=f.matrixWorldInverse;for(let S=0,T=c.length;S<T;S++){const E=c[S];if(E.isSunLight){const b=i.sun[u];b.direction.setFromMatrixPosition(E.matrixWorld),b.direction.transformDirection(v),u++}else if(E.isDirectionalLight){const b=i.directional[h];b.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(v),h++}else if(E.isSpotLight){const b=i.spot[p];b.position.setFromMatrixPosition(E.matrixWorld),b.position.applyMatrix4(v),b.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(v),p++}else if(E.isRectAreaLight){const b=i.rectArea[_];b.position.setFromMatrixPosition(E.matrixWorld),b.position.applyMatrix4(v),a.identity(),r.copy(E.matrixWorld),r.premultiply(v),a.extractRotation(r),b.halfWidth.set(E.width*.5,0,0),b.halfHeight.set(0,E.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),_++}else if(E.isPointLight){const b=i.point[d];b.position.setFromMatrixPosition(E.matrixWorld),b.position.applyMatrix4(v),d++}else if(E.isHemisphereLight){const b=i.hemi[m];b.direction.setFromMatrixPosition(E.matrixWorld),b.direction.transformDirection(v),m++}}}return{setup:o,setupView:l,state:i}}function bc(n){const e=new Nv(n),t=[],i=[],s=[];function r(u){f.camera=u,t.length=0,i.length=0,s.length=0}function a(u){u.isLightProbeGrid?s.push(u):t.push(u)}function o(u){i.push(u)}function l(){e.setup(t),s.sort((u,h)=>u.priority-h.priority||u.id-h.id)}function c(u){e.setupView(t,u)}const f={lightsArray:t,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:f,setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function Uv(n){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new bc(n),e.set(s,[o])):r>=a.length?(o=new bc(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const Fv=`void main() {
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
}`,kv=[new K(1,0,0),new K(-1,0,0),new K(0,1,0),new K(0,-1,0),new K(0,0,1),new K(0,0,-1)],Bv=[new K(0,-1,0),new K(0,-1,0),new K(0,0,1),new K(0,0,-1),new K(0,-1,0),new K(0,-1,0)],Ec=new yt,ps=new K,Ia=new K;function Hv(n,e,t){let i=new Ur;const s=new nt,r=new nt,a=new _t,o=new np,l=new sp,c={},f=t.maxTextureSize,u={[yn]:Yt,[Yt]:yn,[_i]:_i},h=new wn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new nt},radius:{value:4}},vertexShader:Fv,fragmentShader:Ov}),d=h.clone();d.defines.HORIZONTAL_PASS=1;const p=new an;p.setAttribute("position",new _n(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Gi(p,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=gr;let v=this.type;this.render=function(y,g,x){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||y.length===0)return;this.type===$f&&(Ne("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=gr);const I=n.getRenderTarget(),R=n.getActiveCubeFace(),A=n.getActiveMipmapLevel(),F=n.state;F.setBlending(Kn),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const N=v!==this.type;N&&g.traverse(function(P){P.material&&(Array.isArray(P.material)?P.material.forEach(k=>k.needsUpdate=!0):P.material.needsUpdate=!0)});for(let P=0,k=y.length;P<k;P++){const H=y[P],B=H.shadow;if(B===void 0){Ne("WebGLShadowMap:",H,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;s.copy(B.mapSize);const C=B.getFrameExtents();s.multiply(C),r.copy(B.mapSize),(s.x>f||s.y>f)&&(s.x>f&&(r.x=Math.floor(f/C.x),s.x=r.x*C.x,B.mapSize.x=r.x),s.y>f&&(r.y=Math.floor(f/C.y),s.y=r.y*C.y,B.mapSize.y=r.y));const L=n.state.buffers.depth.getReversed();if(B.camera._reversedDepth=L,B.map===null||N===!0){if(B.map!==null&&(B.map.depthTexture!==null&&(B.map.depthTexture.dispose(),B.map.depthTexture=null),B.map.dispose()),this.type===gs){if(H.isPointLight){Ne("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}B.map=new Pi(s.x,s.y,{format:Sn,type:Li,minFilter:$t,magFilter:$t,generateMipmaps:!1}),B.map.texture.name=H.name+".shadowMap",B.map.depthTexture=new es(s.x,s.y,Ci),B.map.depthTexture.name=H.name+".shadowMapDepth",B.map.depthTexture.format=rn,B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=Pt,B.map.depthTexture.magFilter=Pt}else H.isPointLight?(B.map=new Jo(s.x),B.map.depthTexture=new Lh(s.x,Ii)):(B.map=new Pi(s.x,s.y),B.map.depthTexture=new es(s.x,s.y,Ii)),B.map.depthTexture.name=H.name+".shadowMap",B.map.depthTexture.format=rn,this.type===gr?(B.map.depthTexture.compareFunction=L?Mh:Sh,B.map.depthTexture.minFilter=$t,B.map.depthTexture.magFilter=$t):(B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=Pt,B.map.depthTexture.magFilter=Pt);B.camera.updateProjectionMatrix()}B.map.isWebGLCubeRenderTarget!==!0&&(B.map.width!==s.x||B.map.height!==s.y)&&B.map.setSize(s.x,s.y);const V=B.map.isWebGLCubeRenderTarget?6:B.getViewportCount();H.isPointLight!==!0&&B.updateMatrices(H,x);const $=(B.camera.layers.mask&4294967294)!==0?B.camera.layers:x.layers;for(let ie=0;ie<V;ie++){const ne=B.getCamera(ie);if(H.isPointLight){const G=B.camera,se=B.matrix,ge=H.distance||G.far;ge!==G.far&&(G.far=ge,G.updateProjectionMatrix()),ps.setFromMatrixPosition(H.matrixWorld),G.position.copy(ps),Ia.copy(G.position),Ia.add(kv[ie]),G.up.copy(Bv[ie]),G.lookAt(Ia),G.updateMatrixWorld(),se.makeTranslation(-ps.x,-ps.y,-ps.z),Ec.multiplyMatrices(G.projectionMatrix,G.matrixWorldInverse),B._frustum.setFromProjectionMatrix(Ec,G.coordinateSystem,G.reversedDepth)}if(B.map.isWebGLCubeRenderTarget)n.setRenderTarget(B.map,ie),n.clear();else{ie===0&&(n.setRenderTarget(B.map),n.clear());const G=B.getViewport(ie);a.set(r.x*G.x,r.y*G.y,r.x*G.z,r.y*G.w),F.viewport(a)}i=B.getFrustum(ie),E(g,x,ne,H,$,this.type)}B.isPointLightShadow!==!0&&this.type===gs&&S(B,x),B.needsUpdate=!1}v=this.type,m.needsUpdate=!1,n.setRenderTarget(I,R,A)};function S(y,g){const x=e.update(_);h.defines.VSM_SAMPLES!==y.blurSamples&&(h.defines.VSM_SAMPLES=y.blurSamples,d.defines.VSM_SAMPLES=y.blurSamples,h.needsUpdate=!0,d.needsUpdate=!0),y.mapPass===null?y.mapPass=new Pi(s.x,s.y,{format:Sn,type:Li}):(y.mapPass.width!==y.map.width||y.mapPass.height!==y.map.height)&&y.mapPass.setSize(y.map.width,y.map.height),h.uniforms.shadow_pass.value=y.map.depthTexture,h.uniforms.resolution.value.set(y.map.width,y.map.height),h.uniforms.radius.value=y.radius,n.setRenderTarget(y.mapPass),n.clear(),n.renderBufferDirect(g,null,x,h,_,null),d.uniforms.shadow_pass.value=y.mapPass.texture,d.uniforms.resolution.value.set(y.map.width,y.map.height),d.uniforms.radius.value=y.radius,n.setRenderTarget(y.map),n.clear(),n.renderBufferDirect(g,null,x,d,_,null)}function T(y,g,x,I){let R=null;const A=x.isPointLight===!0?y.customDistanceMaterial:y.customDepthMaterial;if(A!==void 0)R=A;else if(R=x.isPointLight===!0?l:o,n.localClippingEnabled&&g.clipShadows===!0&&Array.isArray(g.clippingPlanes)&&g.clippingPlanes.length!==0||g.displacementMap&&g.displacementScale!==0||g.alphaMap&&g.alphaTest>0||g.map&&g.alphaTest>0||g.alphaToCoverage===!0){const F=R.uuid,N=g.uuid;let P=c[F];P===void 0&&(P={},c[F]=P);let k=P[N];k===void 0&&(k=R.clone(),P[N]=k,g.addEventListener("dispose",b)),R=k}if(R.visible=g.visible,R.wireframe=g.wireframe,I===gs?R.side=g.shadowSide!==null?g.shadowSide:g.side:R.side=g.shadowSide!==null?g.shadowSide:u[g.side],R.alphaMap=g.alphaMap,R.alphaTest=g.alphaToCoverage===!0?.5:g.alphaTest,R.map=g.map,R.clipShadows=g.clipShadows,R.clippingPlanes=g.clippingPlanes,R.clipIntersection=g.clipIntersection,R.displacementMap=g.displacementMap,R.displacementScale=g.displacementScale,R.displacementBias=g.displacementBias,R.wireframeLinewidth=g.wireframeLinewidth,R.linewidth=g.linewidth,x.isPointLight===!0&&R.isMeshDistanceMaterial===!0){const F=n.properties.get(R);F.light=x}return R}function E(y,g,x,I,R,A){if(y.visible===!1)return;if(y.layers.test(R)&&(y.isMesh||y.isLine||y.isPoints)&&(y.castShadow||y.receiveShadow&&A===gs)&&(!y.frustumCulled||y.intersectsFrustum(i))){y.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,y.matrixWorld);const P=e.update(y),k=y.material;if(Array.isArray(k)){const H=P.groups;for(let B=0,C=H.length;B<C;B++){const L=H[B],V=k[L.materialIndex];if(V&&V.visible){const $=T(y,V,I,A);y.onBeforeShadow(n,y,g,x,P,$,L),n.renderBufferDirect(x,null,P,$,y,L),y.onAfterShadow(n,y,g,x,P,$,L)}}}else if(k.visible){const H=T(y,k,I,A);y.onBeforeShadow(n,y,g,x,P,H,null),n.renderBufferDirect(x,null,P,H,y,null),y.onAfterShadow(n,y,g,x,P,H,null)}}const N=y.children;for(let P=0,k=N.length;P<k;P++)E(N[P],g,x,I,R,A)}function b(y){y.target.removeEventListener("dispose",b);for(const x in c){const I=c[x],R=y.target.uuid;R in I&&(I[R].dispose(),delete I[R])}}}function zv(n,e){function t(){let U=!1;const Q=new _t;let Z=null;const fe=new _t(0,0,0,0);return{setMask:function(le){Z!==le&&!U&&(n.colorMask(le,le,le,le),Z=le)},setLocked:function(le){U=le},setClear:function(le,he,Pe,ze,oe){oe===!0&&(le*=ze,he*=ze,Pe*=ze),Q.set(le,he,Pe,ze),fe.equals(Q)===!1&&(n.clearColor(le,he,Pe,ze),fe.copy(Q))},reset:function(){U=!1,Z=null,fe.set(-1,0,0,0)}}}function i(){let U=!1,Q=!1,Z=null,fe=null,le=null;return{setReversed:function(he){if(Q!==he){const Pe=e.get("EXT_clip_control");he?Pe.clipControlEXT(Pe.LOWER_LEFT_EXT,Pe.ZERO_TO_ONE_EXT):Pe.clipControlEXT(Pe.LOWER_LEFT_EXT,Pe.NEGATIVE_ONE_TO_ONE_EXT),Q=he;const ze=le;le=null,this.setClear(ze)}},getReversed:function(){return Q},setTest:function(he){he?ae(n.DEPTH_TEST):Le(n.DEPTH_TEST)},setMask:function(he){Z!==he&&!U&&(n.depthMask(he),Z=he)},setFunc:function(he){if(Q&&(he=bd[he]),fe!==he){switch(he){case Ga:n.depthFunc(n.NEVER);break;case Va:n.depthFunc(n.ALWAYS);break;case Wa:n.depthFunc(n.LESS);break;case Ms:n.depthFunc(n.LEQUAL);break;case Xa:n.depthFunc(n.EQUAL);break;case qa:n.depthFunc(n.GEQUAL);break;case $a:n.depthFunc(n.GREATER);break;case Ya:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}fe=he}},setLocked:function(he){U=he},setClear:function(he){le!==he&&(le=he,Q&&(he=1-he),n.clearDepth(he))},reset:function(){U=!1,Z=null,fe=null,le=null,Q=!1}}}function s(){let U=!1,Q=null,Z=null,fe=null,le=null,he=null,Pe=null,ze=null,oe=null;return{setTest:function(Ie){U||(Ie?ae(n.STENCIL_TEST):Le(n.STENCIL_TEST))},setMask:function(Ie){Q!==Ie&&!U&&(n.stencilMask(Ie),Q=Ie)},setFunc:function(Ie,Be,xe){(Z!==Ie||fe!==Be||le!==xe)&&(n.stencilFunc(Ie,Be,xe),Z=Ie,fe=Be,le=xe)},setOp:function(Ie,Be,xe){(he!==Ie||Pe!==Be||ze!==xe)&&(n.stencilOp(Ie,Be,xe),he=Ie,Pe=Be,ze=xe)},setLocked:function(Ie){U=Ie},setClear:function(Ie){oe!==Ie&&(n.clearStencil(Ie),oe=Ie)},reset:function(){U=!1,Q=null,Z=null,fe=null,le=null,he=null,Pe=null,ze=null,oe=null}}}const r=new t,a=new i,o=new s;let l={};const c=new WeakMap;let f={},u={},h={},d=new WeakMap,p=[],_=null,m=!1,v=null,S=null,T=null,E=null,b=null,y=null,g=null,x=new rt(0,0,0),I=0,R=!1,A=null,F=null,N=null,P=null,k=null;const H=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,C=0;const L=n.getParameter(n.VERSION);L.indexOf("WebGL")!==-1?(C=parseFloat(/^WebGL (\d)/.exec(L)[1]),B=C>=1):L.indexOf("OpenGL ES")!==-1&&(C=parseFloat(/^OpenGL ES (\d)/.exec(L)[1]),B=C>=2);let V=null,$={};const ie=n.getParameter(n.SCISSOR_BOX),ne=n.getParameter(n.VIEWPORT),G=new _t().fromArray(ie),se=new _t().fromArray(ne);function ge(U,Q,Z,fe){const le=new Uint8Array(4),he=n.createTexture();n.bindTexture(U,he),n.texParameteri(U,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(U,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Pe=0;Pe<Z;Pe++)U===n.TEXTURE_3D||U===n.TEXTURE_2D_ARRAY?n.texImage3D(Q,0,n.RGBA,1,1,fe,0,n.RGBA,n.UNSIGNED_BYTE,le):n.texImage2D(Q+Pe,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,le);return he}const Se={};Se[n.TEXTURE_2D]=ge(n.TEXTURE_2D,n.TEXTURE_2D,1),Se[n.TEXTURE_CUBE_MAP]=ge(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Se[n.TEXTURE_2D_ARRAY]=ge(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Se[n.TEXTURE_3D]=ge(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ae(n.DEPTH_TEST),a.setFunc(Ms),Ze(!1),st(Dl),ae(n.CULL_FACE),Ee(Kn);function ae(U){f[U]!==!0&&(n.enable(U),f[U]=!0)}function Le(U){f[U]!==!1&&(n.disable(U),f[U]=!1)}function lt(U,Q){return h[U]!==Q?(n.bindFramebuffer(U,Q),h[U]=Q,U===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=Q),U===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=Q),!0):!1}function Re(U,Q){let Z=p,fe=!1;if(U){Z=d.get(Q),Z===void 0&&(Z=[],d.set(Q,Z));const le=U.textures;if(Z.length!==le.length||Z[0]!==n.COLOR_ATTACHMENT0){for(let he=0,Pe=le.length;he<Pe;he++)Z[he]=n.COLOR_ATTACHMENT0+he;Z.length=le.length,fe=!0}}else Z[0]!==n.BACK&&(Z[0]=n.BACK,fe=!0);fe&&n.drawBuffers(Z)}function Ve(U){return _!==U?(n.useProgram(U),_=U,!0):!1}const Xe={[Bi]:n.FUNC_ADD,[Yf]:n.FUNC_SUBTRACT,[sh]:n.FUNC_REVERSE_SUBTRACT};Xe[Kf]=n.MIN,Xe[Zf]=n.MAX;const ee={[Jf]:n.ZERO,[za]:n.ONE,[jf]:n.SRC_COLOR,[rh]:n.SRC_ALPHA,[sd]:n.SRC_ALPHA_SATURATE,[id]:n.DST_COLOR,[ed]:n.DST_ALPHA,[Qf]:n.ONE_MINUS_SRC_COLOR,[Rr]:n.ONE_MINUS_SRC_ALPHA,[nd]:n.ONE_MINUS_DST_COLOR,[td]:n.ONE_MINUS_DST_ALPHA,[rd]:n.CONSTANT_COLOR,[ad]:n.ONE_MINUS_CONSTANT_COLOR,[od]:n.CONSTANT_ALPHA,[ld]:n.ONE_MINUS_CONSTANT_ALPHA};function Ee(U,Q,Z,fe,le,he,Pe,ze,oe,Ie){if(U===Kn){m===!0&&(Le(n.BLEND),m=!1);return}if(m===!1&&(ae(n.BLEND),m=!0),U!==nh){if(U!==v||Ie!==R){if((S!==Bi||b!==Bi)&&(n.blendEquation(n.FUNC_ADD),S=Bi,b=Bi),Ie)switch(U){case Ss:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Nl:n.blendFunc(n.ONE,n.ONE);break;case Ul:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Fl:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:it("WebGLState: Invalid blending: ",U);break}else switch(U){case Ss:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Nl:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Ul:it("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Fl:it("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:it("WebGLState: Invalid blending: ",U);break}T=null,E=null,y=null,g=null,x.set(0,0,0),I=0,v=U,R=Ie}return}le=le||Q,he=he||Z,Pe=Pe||fe,(Q!==S||le!==b)&&(n.blendEquationSeparate(Xe[Q],Xe[le]),S=Q,b=le),(Z!==T||fe!==E||he!==y||Pe!==g)&&(n.blendFuncSeparate(ee[Z],ee[fe],ee[he],ee[Pe]),T=Z,E=fe,y=he,g=Pe),(ze.equals(x)===!1||oe!==I)&&(n.blendColor(ze.r,ze.g,ze.b,oe),x.copy(ze),I=oe),v=U,R=!1}function we(U,Q){U.side===_i?Le(n.CULL_FACE):ae(n.CULL_FACE);let Z=U.side===Yt;Q&&(Z=!Z),Ze(Z),U.blending===Ss&&U.transparent===!1?Ee(Kn):Ee(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),a.setFunc(U.depthFunc),a.setTest(U.depthTest),a.setMask(U.depthWrite),r.setMask(U.colorWrite);const fe=U.stencilWrite;o.setTest(fe),fe&&(o.setMask(U.stencilWriteMask),o.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),o.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),He(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?ae(n.SAMPLE_ALPHA_TO_COVERAGE):Le(n.SAMPLE_ALPHA_TO_COVERAGE)}function Ze(U){A!==U&&(U?n.frontFace(n.CW):n.frontFace(n.CCW),A=U)}function st(U){U!==Xf?(ae(n.CULL_FACE),U!==F&&(U===Dl?n.cullFace(n.BACK):U===qf?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Le(n.CULL_FACE),F=U}function Xt(U){U!==N&&(B&&n.lineWidth(U),N=U)}function He(U,Q,Z){U?(ae(n.POLYGON_OFFSET_FILL),(P!==Q||k!==Z)&&(P=Q,k=Z,a.getReversed()&&(Q=-Q,Z=-Z),n.polygonOffset(Q,Z))):Le(n.POLYGON_OFFSET_FILL)}function Nt(U){U?ae(n.SCISSOR_TEST):Le(n.SCISSOR_TEST)}function ti(U){U===void 0&&(U=n.TEXTURE0+H-1),V!==U&&(n.activeTexture(U),V=U)}function ii(U,Q,Z){Z===void 0&&(V===null?Z=n.TEXTURE0+H-1:Z=V);let fe=$[Z];fe===void 0&&(fe={type:void 0,texture:void 0},$[Z]=fe),(fe.type!==U||fe.texture!==Q)&&(V!==Z&&(n.activeTexture(Z),V=Z),n.bindTexture(U,Q||Se[U]),fe.type=U,fe.texture=Q)}function z(){const U=$[V];U!==void 0&&U.type!==void 0&&(n.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function ni(){try{n.compressedTexImage2D(...arguments)}catch(U){it("WebGLState:",U)}}function mt(){try{n.compressedTexImage3D(...arguments)}catch(U){it("WebGLState:",U)}}function gt(){try{n.texSubImage2D(...arguments)}catch(U){it("WebGLState:",U)}}function ve(){try{n.texSubImage3D(...arguments)}catch(U){it("WebGLState:",U)}}function bt(){try{n.compressedTexSubImage2D(...arguments)}catch(U){it("WebGLState:",U)}}function De(){try{n.compressedTexSubImage3D(...arguments)}catch(U){it("WebGLState:",U)}}function Ue(){try{n.texStorage2D(...arguments)}catch(U){it("WebGLState:",U)}}function D(){try{n.texStorage3D(...arguments)}catch(U){it("WebGLState:",U)}}function M(){try{n.texImage2D(...arguments)}catch(U){it("WebGLState:",U)}}function X(){try{n.texImage3D(...arguments)}catch(U){it("WebGLState:",U)}}function re(U){return u[U]!==void 0?u[U]:n.getParameter(U)}function te(U,Q){u[U]!==Q&&(n.pixelStorei(U,Q),u[U]=Q)}function ce(U){G.equals(U)===!1&&(n.scissor(U.x,U.y,U.z,U.w),G.copy(U))}function pe(U){se.equals(U)===!1&&(n.viewport(U.x,U.y,U.z,U.w),se.copy(U))}function J(U,Q){let Z=c.get(Q);Z===void 0&&(Z=new WeakMap,c.set(Q,Z));let fe=Z.get(U);fe===void 0&&(fe=n.getUniformBlockIndex(Q,U.name),n.uniformBlockBinding(Q,fe,fe),Z.set(U,fe))}function j(U,Q,Z){const le=c.get(Q).get(U);l[le]!==Z&&(n.bindBufferBase(n.UNIFORM_BUFFER,le,Z),l[le]=Z)}function ue(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),f={},u={},V=null,$={},h={},l={},d=new WeakMap,p=[],_=null,m=!1,v=null,S=null,T=null,E=null,b=null,y=null,g=null,x=new rt(0,0,0),I=0,R=!1,A=null,F=null,N=null,P=null,k=null,G.set(0,0,n.canvas.width,n.canvas.height),se.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ae,disable:Le,bindFramebuffer:lt,drawBuffers:Re,useProgram:Ve,setBlending:Ee,setMaterial:we,setFlipSided:Ze,setCullFace:st,setLineWidth:Xt,setPolygonOffset:He,setScissorTest:Nt,activeTexture:ti,bindTexture:ii,unbindTexture:z,compressedTexImage2D:ni,compressedTexImage3D:mt,texImage2D:M,texImage3D:X,pixelStorei:te,getParameter:re,updateUBOMapping:J,uniformBlockBinding:j,texStorage2D:Ue,texStorage3D:D,texSubImage2D:gt,texSubImage3D:ve,compressedTexSubImage2D:bt,compressedTexSubImage3D:De,scissor:ce,viewport:pe,reset:ue}}function Gv(n,e,t,i,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new nt,f=new WeakMap,u=new Set;let h;const d=new WeakMap,p=new Set,_=new FinalizationRegistry(D=>p.delete(D));let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(D,M){return m?new OffscreenCanvas(D,M):Nr("canvas")}function S(D,M,X){let re=1;const te=Ue(D);if((te.width>X||te.height>X)&&(re=X/Math.max(te.width,te.height)),re<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){const ce=Math.floor(re*te.width),pe=Math.floor(re*te.height);h===void 0&&(h=v(ce,pe));const J=M?v(ce,pe):h;return J.width=ce,J.height=pe,J.getContext("2d").drawImage(D,0,0,ce,pe),Ne("WebGLRenderer: Texture has been resized from ("+te.width+"x"+te.height+") to ("+ce+"x"+pe+")."),J}else return"data"in D&&Ne("WebGLRenderer: Image in DataTexture is too big ("+te.width+"x"+te.height+")."),D;return D}function T(D){return D.generateMipmaps}function E(D){n.generateMipmap(D)}function b(D){return D.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:D.isWebGL3DRenderTarget?n.TEXTURE_3D:D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function y(D,M,X,re,te,ce=!1){if(D!==null){if(n[D]!==void 0)return n[D];Ne("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let pe;re&&(pe=e.get("EXT_texture_norm16"),pe||Ne("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let J=M;if(M===n.RED&&(X===n.FLOAT&&(J=n.R32F),X===n.HALF_FLOAT&&(J=n.R16F),X===n.UNSIGNED_BYTE&&(J=n.R8),X===n.UNSIGNED_SHORT&&pe&&(J=pe.R16_EXT),X===n.SHORT&&pe&&(J=pe.R16_SNORM_EXT)),M===n.RED_INTEGER&&(X===n.UNSIGNED_BYTE&&(J=n.R8UI),X===n.UNSIGNED_SHORT&&(J=n.R16UI),X===n.UNSIGNED_INT&&(J=n.R32UI),X===n.BYTE&&(J=n.R8I),X===n.SHORT&&(J=n.R16I),X===n.INT&&(J=n.R32I)),M===n.RG&&(X===n.FLOAT&&(J=n.RG32F),X===n.HALF_FLOAT&&(J=n.RG16F),X===n.UNSIGNED_BYTE&&(J=n.RG8),X===n.UNSIGNED_SHORT&&pe&&(J=pe.RG16_EXT),X===n.SHORT&&pe&&(J=pe.RG16_SNORM_EXT)),M===n.RG_INTEGER&&(X===n.UNSIGNED_BYTE&&(J=n.RG8UI),X===n.UNSIGNED_SHORT&&(J=n.RG16UI),X===n.UNSIGNED_INT&&(J=n.RG32UI),X===n.BYTE&&(J=n.RG8I),X===n.SHORT&&(J=n.RG16I),X===n.INT&&(J=n.RG32I)),M===n.RGB_INTEGER&&(X===n.UNSIGNED_BYTE&&(J=n.RGB8UI),X===n.UNSIGNED_SHORT&&(J=n.RGB16UI),X===n.UNSIGNED_INT&&(J=n.RGB32UI),X===n.BYTE&&(J=n.RGB8I),X===n.SHORT&&(J=n.RGB16I),X===n.INT&&(J=n.RGB32I)),M===n.RGBA_INTEGER&&(X===n.UNSIGNED_BYTE&&(J=n.RGBA8UI),X===n.UNSIGNED_SHORT&&(J=n.RGBA16UI),X===n.UNSIGNED_INT&&(J=n.RGBA32UI),X===n.BYTE&&(J=n.RGBA8I),X===n.SHORT&&(J=n.RGBA16I),X===n.INT&&(J=n.RGBA32I)),M===n.RGB&&(X===n.UNSIGNED_SHORT&&pe&&(J=pe.RGB16_EXT),X===n.SHORT&&pe&&(J=pe.RGB16_SNORM_EXT),X===n.UNSIGNED_INT_5_9_9_9_REV&&(J=n.RGB9_E5),X===n.UNSIGNED_INT_10F_11F_11F_REV&&(J=n.R11F_G11F_B10F)),M===n.RGBA){const j=ce?Ir:Ye.getTransfer(te);X===n.FLOAT&&(J=n.RGBA32F),X===n.HALF_FLOAT&&(J=n.RGBA16F),X===n.UNSIGNED_BYTE&&(J=j===ot?n.SRGB8_ALPHA8:n.RGBA8),X===n.UNSIGNED_SHORT&&pe&&(J=pe.RGBA16_EXT),X===n.SHORT&&pe&&(J=pe.RGBA16_SNORM_EXT),X===n.UNSIGNED_SHORT_4_4_4_4&&(J=n.RGBA4),X===n.UNSIGNED_SHORT_5_5_5_1&&(J=n.RGB5_A1)}return(J===n.R16F||J===n.R32F||J===n.RG16F||J===n.RG32F||J===n.RGBA16F||J===n.RGBA32F)&&e.get("EXT_color_buffer_float"),J}function g(D,M){let X;return D?M===null||M===Ii||M===Qn?X=n.DEPTH24_STENCIL8:M===Ci?X=n.DEPTH32F_STENCIL8:M===bs&&(X=n.DEPTH24_STENCIL8,Ne("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===Ii||M===Qn?X=n.DEPTH_COMPONENT24:M===Ci?X=n.DEPTH_COMPONENT32F:M===bs&&(X=n.DEPTH_COMPONENT16),X}function x(D,M){return T(D)===!0||D.isFramebufferTexture&&D.minFilter!==Pt&&D.minFilter!==$t?Math.log2(Math.max(M.width,M.height))+1:D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?M.mipmaps.length:1}function I(D){const M=new WeakRef(D);i.get(D).__ref=M,p.add(M),_.register(D,M,M)}function R(D){const M=i.get(D).__ref;M!==void 0&&(p.delete(M),_.unregister(M))}function A(D){N(D.target)}function F(D){P(D.target)}function N(D){D.removeEventListener("dispose",A),R(D),H(D),D.isVideoTexture&&f.delete(D),D.isHTMLTexture&&u.delete(D)}function P(D){D.removeEventListener("dispose",F),R(D),C(D)}function k(){for(const D of p){const M=D.deref();M!==void 0&&(M.isRenderTarget===!0?P(M):N(M))}p.clear(),u.clear()}function H(D){const M=i.get(D);if(M.__webglInit===void 0)return;const X=D.source,re=d.get(X);if(re){const te=re[M.__cacheKey];te.usedTimes--,te.usedTimes===0&&B(D),Object.keys(re).length===0&&d.delete(X)}i.remove(D)}function B(D){const M=i.get(D);n.deleteTexture(M.__webglTexture);const X=D.source,re=d.get(X);delete re[M.__cacheKey],a.memory.textures--}function C(D){const M=i.get(D);M.__depthDisposeCallback&&M.__depthDisposeCallback();const X=D.depthTexture;if(X&&X.renderTarget===D&&N(X),D.isWebGLCubeRenderTarget)for(let te=0;te<6;te++){if(Array.isArray(M.__webglFramebuffer[te]))for(let ce=0;ce<M.__webglFramebuffer[te].length;ce++)n.deleteFramebuffer(M.__webglFramebuffer[te][ce]);else n.deleteFramebuffer(M.__webglFramebuffer[te]);M.__webglDepthbuffer&&n.deleteRenderbuffer(M.__webglDepthbuffer[te])}else{if(Array.isArray(M.__webglFramebuffer))for(let te=0;te<M.__webglFramebuffer.length;te++)n.deleteFramebuffer(M.__webglFramebuffer[te]);else n.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&n.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&n.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let te=0;te<M.__webglColorRenderbuffer.length;te++)M.__webglColorRenderbuffer[te]&&n.deleteRenderbuffer(M.__webglColorRenderbuffer[te]);M.__webglDepthRenderbuffer&&n.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const re=D.textures;for(let te=0,ce=re.length;te<ce;te++){const pe=i.get(re[te]);pe.__webglTexture&&(n.deleteTexture(pe.__webglTexture),a.memory.textures--),i.remove(re[te])}i.remove(D)}let L=0;function V(){L=0}function $(){return L}function ie(D){L=D}function ne(){const D=L;return D>=s.maxTextures&&Ne("WebGLTextures: Trying to use "+(D+1)+" texture units while this GPU supports only "+s.maxTextures),L+=1,D}function G(D){const M=[];return M.push(D.wrapS),M.push(D.wrapT),M.push(D.wrapR||0),M.push(D.magFilter),M.push(D.minFilter),M.push(D.anisotropy),M.push(D.internalFormat),M.push(D.format),M.push(D.type),M.push(D.generateMipmaps),M.push(D.mipmapsAutoUpdate),M.push(D.premultiplyAlpha),M.push(D.flipY),M.push(D.unpackAlignment),M.push(D.colorSpace),M.join()}function se(D,M){const X=i.get(D);if(D.isVideoTexture&&bt(D),D.isRenderTargetTexture===!1&&D.isExternalTexture!==!0&&D.version>0&&X.__version!==D.version){const re=D.image;if(re===null)Ne("WebGLRenderer: Texture marked for update but no image data found.");else if(re.complete===!1)Ne("WebGLRenderer: Texture marked for update but image is incomplete");else{we(X,D,M);return}}else D.isExternalTexture&&(X.__webglTexture=D.sourceTexture?D.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,X.__webglTexture,n.TEXTURE0+M)}function ge(D,M){const X=i.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&X.__version!==D.version){we(X,D,M);return}else D.isExternalTexture&&(X.__webglTexture=D.sourceTexture?D.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,X.__webglTexture,n.TEXTURE0+M)}function Se(D,M){const X=i.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&X.__version!==D.version){we(X,D,M);return}t.bindTexture(n.TEXTURE_3D,X.__webglTexture,n.TEXTURE0+M)}function ae(D,M){const X=i.get(D);if(D.version>0&&X.__version!==D.version){Ze(X,D,M);return}t.bindTexture(n.TEXTURE_CUBE_MAP,X.__webglTexture,n.TEXTURE0+M)}const Le={[Ka]:n.REPEAT,[Ri]:n.CLAMP_TO_EDGE,[Za]:n.MIRRORED_REPEAT},lt={[Pt]:n.NEAREST,[ud]:n.NEAREST_MIPMAP_NEAREST,[Bs]:n.NEAREST_MIPMAP_LINEAR,[$t]:n.LINEAR,[aa]:n.LINEAR_MIPMAP_NEAREST,[nn]:n.LINEAR_MIPMAP_LINEAR},Re={[md]:n.NEVER,[wh]:n.ALWAYS,[gd]:n.LESS,[Sh]:n.LEQUAL,[vd]:n.EQUAL,[Mh]:n.GEQUAL,[xd]:n.GREATER,[_d]:n.NOTEQUAL};function Ve(D,M){if(M.type===Ci&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===$t||M.magFilter===aa||M.magFilter===Bs||M.magFilter===nn||M.minFilter===$t||M.minFilter===aa||M.minFilter===Bs||M.minFilter===nn)&&Ne("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(D,n.TEXTURE_WRAP_S,Le[M.wrapS]),n.texParameteri(D,n.TEXTURE_WRAP_T,Le[M.wrapT]),(D===n.TEXTURE_3D||D===n.TEXTURE_2D_ARRAY)&&n.texParameteri(D,n.TEXTURE_WRAP_R,Le[M.wrapR]),n.texParameteri(D,n.TEXTURE_MAG_FILTER,lt[M.magFilter]),n.texParameteri(D,n.TEXTURE_MIN_FILTER,lt[M.minFilter]),M.compareFunction&&(n.texParameteri(D,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(D,n.TEXTURE_COMPARE_FUNC,Re[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===Pt||M.minFilter!==Bs&&M.minFilter!==nn||M.type===Ci&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||i.get(M).__currentAnisotropy){const X=e.get("EXT_texture_filter_anisotropic");n.texParameterf(D,X.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,s.getMaxAnisotropy())),i.get(M).__currentAnisotropy=M.anisotropy}}}function Xe(D,M){let X=!1;D.__webglInit===void 0&&(D.__webglInit=!0,M.addEventListener("dispose",A),I(M));const re=M.source;let te=d.get(re);te===void 0&&(te={},d.set(re,te));const ce=G(M);if(ce!==D.__cacheKey){te[ce]===void 0&&(te[ce]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,X=!0),te[ce].usedTimes++;const pe=te[D.__cacheKey];pe!==void 0&&(te[D.__cacheKey].usedTimes--,pe.usedTimes===0&&B(M)),D.__cacheKey=ce,D.__webglTexture=te[ce].texture}return X}function ee(D,M,X){return Math.floor(Math.floor(D/X)/M)}function Ee(D,M,X,re){const ce=D.updateRanges;if(ce.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,M.width,M.height,X,re,M.data);else{ce.sort((U,Q)=>U.start-Q.start);let pe=0;for(let U=1;U<ce.length;U++){const Q=ce[pe],Z=ce[U],fe=Q.start+Q.count,le=ee(Z.start,M.width,4),he=ee(Q.start,M.width,4);Z.start<=fe+1&&le===he&&ee(Z.start+Z.count-1,M.width,4)===le?Q.count=Math.max(Q.count,Z.start+Z.count-Q.start):(++pe,ce[pe]=Z)}ce.length=pe+1;const J=t.getParameter(n.UNPACK_ROW_LENGTH),j=t.getParameter(n.UNPACK_SKIP_PIXELS),ue=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,M.width);for(let U=0,Q=ce.length;U<Q;U++){const Z=ce[U],fe=Math.floor(Z.start/4),le=Math.ceil(Z.count/4),he=fe%M.width,Pe=Math.floor(fe/M.width),ze=le,oe=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,he),t.pixelStorei(n.UNPACK_SKIP_ROWS,Pe),t.texSubImage2D(n.TEXTURE_2D,0,he,Pe,ze,oe,X,re,M.data)}D.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,J),t.pixelStorei(n.UNPACK_SKIP_PIXELS,j),t.pixelStorei(n.UNPACK_SKIP_ROWS,ue)}}function we(D,M,X){let re=n.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(re=n.TEXTURE_2D_ARRAY),M.isData3DTexture&&(re=n.TEXTURE_3D);const te=Xe(D,M),ce=M.source;t.bindTexture(re,D.__webglTexture,n.TEXTURE0+X);const pe=i.get(ce);if(ce.version!==pe.__version||te===!0){if(t.activeTexture(n.TEXTURE0+X),(typeof ImageBitmap<"u"&&M.image instanceof ImageBitmap)===!1){const oe=Ye.getPrimaries(Ye.workingColorSpace),Ie=M.colorSpace===en?null:Ye.getPrimaries(M.colorSpace),Be=M.colorSpace===en||oe===Ie?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Be)}t.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment);let j=S(M.image,!1,s.maxTextureSize);j=De(M,j);const ue=r.convert(M.format,M.colorSpace),U=r.convert(M.type);let Q=y(M.internalFormat,ue,U,M.normalized,M.colorSpace,M.isVideoTexture);Ve(re,M);let Z;const fe=M.mipmaps,le=M.isVideoTexture!==!0,he=pe.__version===void 0||te===!0,Pe=ce.dataReady,ze=x(M,j);if(M.isDepthTexture)Q=g(M.format===sn,M.type),he&&(le?t.texStorage2D(n.TEXTURE_2D,1,Q,j.width,j.height):t.texImage2D(n.TEXTURE_2D,0,Q,j.width,j.height,0,ue,U,null));else if(M.isDataTexture)if(fe.length>0){le&&he&&t.texStorage2D(n.TEXTURE_2D,ze,Q,fe[0].width,fe[0].height);for(let oe=0,Ie=fe.length;oe<Ie;oe++)Z=fe[oe],le?Pe&&t.texSubImage2D(n.TEXTURE_2D,oe,0,0,Z.width,Z.height,ue,U,Z.data):t.texImage2D(n.TEXTURE_2D,oe,Q,Z.width,Z.height,0,ue,U,Z.data);M.generateMipmaps=!1}else le?(he&&t.texStorage2D(n.TEXTURE_2D,ze,Q,j.width,j.height),Pe&&Ee(M,j,ue,U)):t.texImage2D(n.TEXTURE_2D,0,Q,j.width,j.height,0,ue,U,j.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){le&&he&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ze,Q,fe[0].width,fe[0].height,j.depth);for(let oe=0,Ie=fe.length;oe<Ie;oe++)if(Z=fe[oe],M.format!==Si)if(ue!==null)if(le){if(Pe)if(M.layerUpdates.size>0){const Be=sc(Z.width,Z.height,M.format,M.type);for(const xe of M.layerUpdates){const at=Z.data.subarray(xe*Be/Z.data.BYTES_PER_ELEMENT,(xe+1)*Be/Z.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,oe,0,0,xe,Z.width,Z.height,1,ue,at)}}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,oe,0,0,0,Z.width,Z.height,j.depth,ue,Z.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,oe,Q,Z.width,Z.height,j.depth,0,Z.data,0,0);else Ne("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else le?Pe&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,oe,0,0,0,Z.width,Z.height,j.depth,ue,U,Z.data):t.texImage3D(n.TEXTURE_2D_ARRAY,oe,Q,Z.width,Z.height,j.depth,0,ue,U,Z.data);M.layerUpdates.size>0&&M.clearLayerUpdates()}else{le&&he&&t.texStorage2D(n.TEXTURE_2D,ze,Q,fe[0].width,fe[0].height);for(let oe=0,Ie=fe.length;oe<Ie;oe++)Z=fe[oe],M.format!==Si?ue!==null?le?Pe&&t.compressedTexSubImage2D(n.TEXTURE_2D,oe,0,0,Z.width,Z.height,ue,Z.data):t.compressedTexImage2D(n.TEXTURE_2D,oe,Q,Z.width,Z.height,0,Z.data):Ne("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):le?Pe&&t.texSubImage2D(n.TEXTURE_2D,oe,0,0,Z.width,Z.height,ue,U,Z.data):t.texImage2D(n.TEXTURE_2D,oe,Q,Z.width,Z.height,0,ue,U,Z.data)}else if(M.isDataArrayTexture)if(le){if(he&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ze,Q,j.width,j.height,j.depth),Pe)if(M.layerUpdates.size>0){const oe=sc(j.width,j.height,M.format,M.type);for(const Ie of M.layerUpdates){const Be=j.data.subarray(Ie*oe/j.data.BYTES_PER_ELEMENT,(Ie+1)*oe/j.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Ie,j.width,j.height,1,ue,U,Be)}M.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,j.width,j.height,j.depth,ue,U,j.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Q,j.width,j.height,j.depth,0,ue,U,j.data);else if(M.isData3DTexture)le?(he&&t.texStorage3D(n.TEXTURE_3D,ze,Q,j.width,j.height,j.depth),Pe&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,j.width,j.height,j.depth,ue,U,j.data)):t.texImage3D(n.TEXTURE_3D,0,Q,j.width,j.height,j.depth,0,ue,U,j.data);else if(M.isFramebufferTexture){if(he)if(le)t.texStorage2D(n.TEXTURE_2D,ze,Q,j.width,j.height);else{let oe=j.width,Ie=j.height;for(let Be=0;Be<ze;Be++)t.texImage2D(n.TEXTURE_2D,Be,Q,oe,Ie,0,ue,U,null),oe>>=1,Ie>>=1}}else if(M.isHTMLTexture){if("texElementImage2D"in n){const oe=n.canvas;if(oe.hasAttribute("layoutsubtree")||oe.setAttribute("layoutsubtree","true"),j.parentNode!==oe){oe.appendChild(j),u.add(M),oe.onpaint=Ie=>{const Be=Ie.changedElements;for(const xe of u)Be.includes(xe.image)&&(xe.needsUpdate=!0)},oe.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,j);else{const Be=n.RGBA,xe=n.RGBA,at=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,Be,xe,at,j)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(fe.length>0){if(le&&he){const oe=Ue(fe[0]);t.texStorage2D(n.TEXTURE_2D,ze,Q,oe.width,oe.height)}for(let oe=0,Ie=fe.length;oe<Ie;oe++)Z=fe[oe],le?Pe&&t.texSubImage2D(n.TEXTURE_2D,oe,0,0,ue,U,Z):t.texImage2D(n.TEXTURE_2D,oe,Q,ue,U,Z);M.generateMipmaps=!1}else if(le){if(he){const oe=Ue(j);t.texStorage2D(n.TEXTURE_2D,ze,Q,oe.width,oe.height)}Pe&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ue,U,j)}else t.texImage2D(n.TEXTURE_2D,0,Q,ue,U,j);T(M)&&M.mipmapsAutoUpdate===!0&&E(re),pe.__version=ce.version,M.onUpdate&&M.onUpdate(M)}D.__version=M.version}function Ze(D,M,X){if(M.image.length!==6)return;const re=Xe(D,M),te=M.source;t.bindTexture(n.TEXTURE_CUBE_MAP,D.__webglTexture,n.TEXTURE0+X);const ce=i.get(te);if(te.version!==ce.__version||re===!0){t.activeTexture(n.TEXTURE0+X);const pe=Ye.getPrimaries(Ye.workingColorSpace),J=M.colorSpace===en?null:Ye.getPrimaries(M.colorSpace),j=M.colorSpace===en||pe===J?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,j);const ue=M.isCompressedTexture||M.image[0].isCompressedTexture,U=M.image[0]&&M.image[0].isDataTexture,Q=[];for(let xe=0;xe<6;xe++)!ue&&!U?Q[xe]=S(M.image[xe],!0,s.maxCubemapSize):Q[xe]=U?M.image[xe].image:M.image[xe],Q[xe]=De(M,Q[xe]);const Z=Q[0],fe=r.convert(M.format,M.colorSpace),le=r.convert(M.type);let he=y(M.internalFormat,fe,le,M.normalized,M.colorSpace);const Pe=M.isVideoTexture!==!0,ze=ce.__version===void 0||re===!0,oe=te.dataReady;let Ie=x(M,Z);Ve(n.TEXTURE_CUBE_MAP,M);let Be;if(M.isDepthTexture){if(he=g(M.format===sn,M.type),ze)if(Pe)t.texStorage2D(n.TEXTURE_CUBE_MAP,1,he,Z.width,Z.height);else for(let xe=0;xe<6;xe++)t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xe,0,he,Z.width,Z.height,0,fe,le,null)}else if(ue){Pe&&ze&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Ie,he,Z.width,Z.height);for(let xe=0;xe<6;xe++){Be=Q[xe].mipmaps;for(let at=0;at<Be.length;at++){const At=Be[at];M.format!==Si?fe!==null?Pe?oe&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xe,at,0,0,At.width,At.height,fe,At.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xe,at,he,At.width,At.height,0,At.data):Ne("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Pe?oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xe,at,0,0,At.width,At.height,fe,le,At.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xe,at,he,At.width,At.height,0,fe,le,At.data)}}}else{if(Be=M.mipmaps,Pe&&ze){Be.length>0&&Ie++;const xe=Ue(Q[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Ie,he,xe.width,xe.height)}for(let xe=0;xe<6;xe++)if(U){Pe?oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xe,0,0,0,Q[xe].width,Q[xe].height,fe,le,Q[xe].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xe,0,he,Q[xe].width,Q[xe].height,0,fe,le,Q[xe].data);for(let at=0;at<Be.length;at++){const Vi=Be[at].image[xe].image;Pe?oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xe,at+1,0,0,Vi.width,Vi.height,fe,le,Vi.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xe,at+1,he,Vi.width,Vi.height,0,fe,le,Vi.data)}}else{Pe?oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xe,0,0,0,fe,le,Q[xe]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xe,0,he,fe,le,Q[xe]);for(let at=0;at<Be.length;at++){const At=Be[at];Pe?oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xe,at+1,0,0,fe,le,At.image[xe]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xe,at+1,he,fe,le,At.image[xe])}}}T(M)&&M.mipmapsAutoUpdate===!0&&E(n.TEXTURE_CUBE_MAP),ce.__version=te.version,M.onUpdate&&M.onUpdate(M)}D.__version=M.version}function st(D,M,X,re,te,ce){const pe=r.convert(X.format,X.colorSpace),J=r.convert(X.type),j=y(X.internalFormat,pe,J,X.normalized,X.colorSpace),ue=i.get(M),U=i.get(X);if(U.__renderTarget=M,!ue.__hasExternalTextures){const Q=Math.max(1,M.width>>ce),Z=Math.max(1,M.height>>ce);te===n.TEXTURE_3D||te===n.TEXTURE_2D_ARRAY?t.texImage3D(te,ce,j,Q,Z,M.depth,0,pe,J,null):t.texImage2D(te,ce,j,Q,Z,0,pe,J,null)}t.bindFramebuffer(n.FRAMEBUFFER,D),ve(M)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,re,te,U.__webglTexture,0,gt(M)):(te===n.TEXTURE_2D||te>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&te<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,re,te,U.__webglTexture,ce),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Xt(D,M,X){if(n.bindRenderbuffer(n.RENDERBUFFER,D),M.depthBuffer){const re=M.depthTexture,te=re&&re.isDepthTexture?re.type:null,ce=g(M.stencilBuffer,te),pe=M.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;ve(M)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,gt(M),ce,M.width,M.height):X?n.renderbufferStorageMultisample(n.RENDERBUFFER,gt(M),ce,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,ce,M.width,M.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,pe,n.RENDERBUFFER,D)}else{const re=M.textures;for(let te=0;te<re.length;te++){const ce=re[te],pe=r.convert(ce.format,ce.colorSpace),J=r.convert(ce.type),j=y(ce.internalFormat,pe,J,ce.normalized,ce.colorSpace);ve(M)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,gt(M),j,M.width,M.height):X?n.renderbufferStorageMultisample(n.RENDERBUFFER,gt(M),j,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,j,M.width,M.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function He(D,M,X){const re=M.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,D),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const te=i.get(M.depthTexture);te.__renderTarget=M;const ce=re?M.depthTexture.image[0]:M.depthTexture.image;(!te.__webglTexture||ce.width!==M.width||ce.height!==M.height)&&(ce.width=M.width,ce.height=M.height,M.depthTexture.needsUpdate=!0),re?ae(M.depthTexture,0):se(M.depthTexture,0);const pe=te.__webglTexture,J=gt(M),j=re?n.TEXTURE_CUBE_MAP_POSITIVE_X+X:n.TEXTURE_2D,ue=M.depthTexture.format===sn?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(M.depthTexture.format===rn)ve(M)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ue,j,pe,0,J):n.framebufferTexture2D(n.FRAMEBUFFER,ue,j,pe,0);else if(M.depthTexture.format===sn)ve(M)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ue,j,pe,0,J):n.framebufferTexture2D(n.FRAMEBUFFER,ue,j,pe,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Nt(D){const M=i.get(D),X=D.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==D.depthTexture){const re=D.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),re){const te=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,re.removeEventListener("dispose",te)};re.addEventListener("dispose",te),M.__depthDisposeCallback=te}M.__boundDepthTexture=re}if(D.depthTexture&&!M.__autoAllocateDepthBuffer)if(X)for(let re=0;re<6;re++)He(M.__webglFramebuffer[re],D,re);else D.texture.mipmaps.length>0?He(M.__webglFramebuffer[0],D,0):He(M.__webglFramebuffer,D,0);else if(X){M.__webglDepthbuffer=[];for(let re=0;re<6;re++)if(t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer[re]),M.__webglDepthbuffer[re]===void 0)M.__webglDepthbuffer[re]=n.createRenderbuffer(),Xt(M.__webglDepthbuffer[re],D,!1);else{const te=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ce=M.__webglDepthbuffer[re];n.bindRenderbuffer(n.RENDERBUFFER,ce),n.framebufferRenderbuffer(n.FRAMEBUFFER,te,n.RENDERBUFFER,ce)}}else if(D.texture.mipmaps.length>0?t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=n.createRenderbuffer(),Xt(M.__webglDepthbuffer,D,!1);else{const te=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ce=M.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ce),n.framebufferRenderbuffer(n.FRAMEBUFFER,te,n.RENDERBUFFER,ce)}t.bindFramebuffer(n.FRAMEBUFFER,null)}function ti(D,M,X){const re=i.get(D);M!==void 0&&st(re.__webglFramebuffer,D,D.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),X!==void 0&&Nt(D)}function ii(D){const M=D.texture,X=i.get(D),re=i.get(M);D.addEventListener("dispose",F),I(D);const te=D.textures,ce=D.isWebGLCubeRenderTarget===!0,pe=te.length>1;if(pe||(re.__webglTexture===void 0&&(re.__webglTexture=n.createTexture()),re.__version=M.version,a.memory.textures++),ce){X.__webglFramebuffer=[];for(let J=0;J<6;J++)if(M.mipmaps.length>0){X.__webglFramebuffer[J]=[];for(let j=0;j<M.mipmaps.length;j++)X.__webglFramebuffer[J][j]=n.createFramebuffer()}else X.__webglFramebuffer[J]=n.createFramebuffer()}else{if(M.mipmaps.length>0){X.__webglFramebuffer=[];for(let J=0;J<M.mipmaps.length;J++)X.__webglFramebuffer[J]=n.createFramebuffer()}else X.__webglFramebuffer=n.createFramebuffer();if(pe)for(let J=0,j=te.length;J<j;J++){const ue=i.get(te[J]);ue.__webglTexture===void 0&&(ue.__webglTexture=n.createTexture(),a.memory.textures++)}if(D.samples>0&&ve(D)===!1){X.__webglMultisampledFramebuffer=n.createFramebuffer(),X.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,X.__webglMultisampledFramebuffer);for(let J=0;J<te.length;J++){const j=te[J];X.__webglColorRenderbuffer[J]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,X.__webglColorRenderbuffer[J]);const ue=r.convert(j.format,j.colorSpace),U=r.convert(j.type),Q=y(j.internalFormat,ue,U,j.normalized,j.colorSpace,D.isXRRenderTarget===!0),Z=gt(D);n.renderbufferStorageMultisample(n.RENDERBUFFER,Z,Q,D.width,D.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+J,n.RENDERBUFFER,X.__webglColorRenderbuffer[J])}n.bindRenderbuffer(n.RENDERBUFFER,null),D.depthBuffer&&(X.__webglDepthRenderbuffer=n.createRenderbuffer(),Xt(X.__webglDepthRenderbuffer,D,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ce){t.bindTexture(n.TEXTURE_CUBE_MAP,re.__webglTexture),Ve(n.TEXTURE_CUBE_MAP,M);for(let J=0;J<6;J++)if(M.mipmaps.length>0)for(let j=0;j<M.mipmaps.length;j++)st(X.__webglFramebuffer[J][j],D,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+J,j);else st(X.__webglFramebuffer[J],D,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0);T(M)?E(n.TEXTURE_CUBE_MAP):M.mipmaps.length>0&&n.texParameteri(n.TEXTURE_CUBE_MAP,n.TEXTURE_MAX_LEVEL,M.mipmaps.length-1),t.unbindTexture()}else if(pe){for(let J=0,j=te.length;J<j;J++){const ue=te[J],U=i.get(ue);let Q=n.TEXTURE_2D;(D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(Q=D.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Q,U.__webglTexture),Ve(Q,ue),st(X.__webglFramebuffer,D,ue,n.COLOR_ATTACHMENT0+J,Q,0),T(ue)&&E(Q)}t.unbindTexture()}else{let J=n.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(J=D.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(J,re.__webglTexture),Ve(J,M),M.mipmaps.length>0)for(let j=0;j<M.mipmaps.length;j++)st(X.__webglFramebuffer[j],D,M,n.COLOR_ATTACHMENT0,J,j);else st(X.__webglFramebuffer,D,M,n.COLOR_ATTACHMENT0,J,0);T(M)?E(J):M.mipmaps.length>0&&n.texParameteri(J,n.TEXTURE_MAX_LEVEL,M.mipmaps.length-1),t.unbindTexture()}D.depthBuffer&&Nt(D)}function z(D){const M=D.textures;for(let X=0,re=M.length;X<re;X++){const te=M[X];if(T(te)&&te.mipmapsAutoUpdate===!0){const ce=b(D),pe=i.get(te).__webglTexture;t.bindTexture(ce,pe),E(ce),t.unbindTexture()}}}const ni=[];function mt(D){if(D.samples>0){if(ve(D)===!1){const M=D.textures,X=D.width,re=D.height;let te=n.COLOR_BUFFER_BIT;const ce=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,pe=i.get(D),J=M.length>1;if(J)for(let ue=0;ue<M.length;ue++)t.bindFramebuffer(n.FRAMEBUFFER,pe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ue,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,pe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ue,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,pe.__webglMultisampledFramebuffer),D.texture.mipmaps.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,pe.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,pe.__webglFramebuffer);for(let ue=0;ue<M.length;ue++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(te|=n.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(te|=n.STENCIL_BUFFER_BIT)),J){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,pe.__webglColorRenderbuffer[ue]);const U=i.get(M[ue]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,U,0)}n.blitFramebuffer(0,0,X,re,0,0,X,re,te,n.NEAREST),l===!0&&(ni.length=0,ni.push(n.COLOR_ATTACHMENT0+ue),D.depthBuffer&&D.storeMultisampledDepthBuffer===!1&&ni.push(ce),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,ni))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),J)for(let ue=0;ue<M.length;ue++){t.bindFramebuffer(n.FRAMEBUFFER,pe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ue,n.RENDERBUFFER,pe.__webglColorRenderbuffer[ue]);const U=i.get(M[ue]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,pe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ue,n.TEXTURE_2D,U,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,pe.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.storeMultisampledDepthBuffer===!1&&l){const M=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[M])}}}function gt(D){return Math.min(s.maxSamples,D.samples)}function ve(D){const M=i.get(D);return D.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function bt(D){const M=a.render.frame;f.get(D)!==M&&(f.set(D,M),D.update())}function De(D,M){const X=D.colorSpace,re=D.format,te=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||X!==Es&&X!==en&&(Ye.getTransfer(X)===ot?(re!==Si||te!==Qt)&&Ne("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):it("WebGLTextures: Unsupported texture color space:",X)),M}function Ue(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(c.width=D.naturalWidth||D.width,c.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(c.width=D.displayWidth,c.height=D.displayHeight):(c.width=D.width,c.height=D.height),c}this.allocateTextureUnit=ne,this.resetTextureUnits=V,this.getTextureUnits=$,this.setTextureUnits=ie,this.setTexture2D=se,this.setTexture2DArray=ge,this.setTexture3D=Se,this.setTextureCube=ae,this.rebindTextures=ti,this.setupRenderTarget=ii,this.updateRenderTargetMipmap=z,this.updateMultisampleRenderTarget=mt,this.setupDepthRenderbuffer=Nt,this.setupFrameBufferTexture=st,this.useMultisampledRTT=ve,this.dispose=k}function Vv(n,e){function t(i,s=en){let r;const a=Ye.getTransfer(s);if(i===Qt)return n.UNSIGNED_BYTE;if(i===zo)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Go)return n.UNSIGNED_SHORT_5_5_5_1;if(i===vh)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===xh)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===mh)return n.BYTE;if(i===gh)return n.SHORT;if(i===bs)return n.UNSIGNED_SHORT;if(i===Ho)return n.INT;if(i===Ii)return n.UNSIGNED_INT;if(i===Ci)return n.FLOAT;if(i===Li)return n.HALF_FLOAT;if(i===_h)return n.ALPHA;if(i===yh)return n.RGB;if(i===Si)return n.RGBA;if(i===rn)return n.DEPTH_COMPONENT;if(i===sn)return n.DEPTH_STENCIL;if(i===Vo)return n.RED;if(i===Wo)return n.RED_INTEGER;if(i===Sn)return n.RG;if(i===Xo)return n.RG_INTEGER;if(i===qo)return n.RGBA_INTEGER;if(i===vr||i===xr||i===_r||i===yr)if(a===ot)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===vr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===xr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===_r)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===yr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===vr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===xr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===_r)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===yr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Ja||i===ja||i===Qa||i===eo)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Ja)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===ja)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Qa)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===eo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===to||i===io||i===no||i===so||i===ro||i===Cr||i===ao)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===to||i===io)return a===ot?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===no)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===so)return r.COMPRESSED_R11_EAC;if(i===ro)return r.COMPRESSED_SIGNED_R11_EAC;if(i===Cr)return r.COMPRESSED_RG11_EAC;if(i===ao)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===oo||i===lo||i===co||i===ho||i===uo||i===fo||i===po||i===mo||i===go||i===vo||i===xo||i===_o||i===yo||i===So)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===oo)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===lo)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===co)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===ho)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===uo)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===fo)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===po)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===mo)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===go)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===vo)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===xo)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===_o)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===yo)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===So)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Mo||i===wo||i===bo)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===Mo)return a===ot?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===wo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===bo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Eo||i===To||i===Pr||i===Ao)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Eo)return r.COMPRESSED_RED_RGTC1_EXT;if(i===To)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Pr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Ao)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Qn?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const Wv=`
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

}`;class qv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Dh(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new wn({vertexShader:Wv,fragmentShader:Xv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Gi(new Hr(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class $v extends En{constructor(e,t){super();const i=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,f=null,u=null,h=null,d=null,p=null;const _=typeof XRWebGLBinding<"u",m=new qv,v={},S=t.getContextAttributes();let T=null,E=null;const b=[],y=[],g=new nt;let x=null,I=null;const R=new Ti;R.viewport=new _t;const A=new Ti;A.viewport=new _t;const F=[R,A],N=new rp;let P=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(G){let se=b[G];return se===void 0&&(se=new ma,b[G]=se),se.getTargetRaySpace()},this.getControllerGrip=function(G){let se=b[G];return se===void 0&&(se=new ma,b[G]=se),se.getGripSpace()},this.getHand=function(G){let se=b[G];return se===void 0&&(se=new ma,b[G]=se),se.getHandSpace()};function H(G){const se=y.indexOf(G.inputSource);if(se===-1)return;const ge=b[se];ge!==void 0&&(ge.update(G.inputSource,G.frame,c||a),ge.dispatchEvent({type:G.type,data:G.inputSource}))}function B(){s.removeEventListener("select",H),s.removeEventListener("selectstart",H),s.removeEventListener("selectend",H),s.removeEventListener("squeeze",H),s.removeEventListener("squeezestart",H),s.removeEventListener("squeezeend",H),s.removeEventListener("end",B),s.removeEventListener("inputsourceschange",C);for(let G=0;G<b.length;G++){const se=y[G];se!==null&&(y[G]=null,b[G].disconnect(se))}P=null,k=null,m.reset();for(const G in v)delete v[G];if(e.setRenderTarget(T),d=null,h=null,u=null,s=null,E=null,ne.stop(),i.isPresenting=!1,e.setPixelRatio(x),e.setSize(g.width,g.height,!1),I!==null){const G=I.camera;G.fov=I.fov,G.zoom=I.zoom,G.updateProjectionMatrix(),I=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(G){r=G,i.isPresenting===!0&&Ne("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(G){o=G,i.isPresenting===!0&&Ne("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(G){c=G},this.getBaseLayer=function(){return h!==null?h:d},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(G){if(s=G,s!==null){if(T=e.getRenderTarget(),s.addEventListener("select",H),s.addEventListener("selectstart",H),s.addEventListener("selectend",H),s.addEventListener("squeeze",H),s.addEventListener("squeezestart",H),s.addEventListener("squeezeend",H),s.addEventListener("end",B),s.addEventListener("inputsourceschange",C),S.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(g),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let ge=null,Se=null,ae=null;S.depth&&(ae=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ge=S.stencil?sn:rn,Se=S.stencil?Qn:Ii);const Le={colorFormat:t.RGBA8,depthFormat:ae,scaleFactor:r};u=this.getBinding(),h=u.createProjectionLayer(Le),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),E=new Pi(h.textureWidth,h.textureHeight,{format:Si,type:Qt,depthTexture:new es(h.textureWidth,h.textureHeight,Se,void 0,void 0,void 0,void 0,void 0,void 0,ge),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{const ge={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,t,ge),s.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),E=new Pi(d.framebufferWidth,d.framebufferHeight,{format:Si,type:Qt,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}E.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),ne.setContext(s),ne.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function C(G){for(let se=0;se<G.removed.length;se++){const ge=G.removed[se],Se=y.indexOf(ge);Se>=0&&(y[Se]=null,b[Se].disconnect(ge))}for(let se=0;se<G.added.length;se++){const ge=G.added[se];let Se=y.indexOf(ge);if(Se===-1){for(let Le=0;Le<b.length;Le++)if(Le>=y.length){y.push(ge),Se=Le;break}else if(y[Le]===null){y[Le]=ge,Se=Le;break}if(Se===-1)break}const ae=b[Se];ae&&ae.connect(ge)}}function L(G,se){se===null?G.matrixWorld.copy(G.matrix):G.matrixWorld.multiplyMatrices(se.matrixWorld,G.matrix),G.matrixWorldInverse.copy(G.matrixWorld).invert()}this.updateCamera=function(G){if(s===null)return;let se=G.near,ge=G.far;m.texture!==null&&(m.depthNear>0&&(se=m.depthNear),m.depthFar>0&&(ge=m.depthFar)),N.near=A.near=R.near=se,N.far=A.far=R.far=ge,(P!==N.near||k!==N.far)&&(s.updateRenderState({depthNear:N.near,depthFar:N.far}),P=N.near,k=N.far),N.layers.mask=G.layers.mask|6,R.layers.mask=N.layers.mask&-5,A.layers.mask=N.layers.mask&-3;const Se=G.parent,ae=N.cameras;L(N,Se);for(let Le=0;Le<ae.length;Le++)L(ae[Le],Se);N.projectionMatrix.copy(R.projectionMatrix),N.projectionMatrixInverse.copy(R.projectionMatrixInverse),I===null&&G.isPerspectiveCamera&&(I={camera:G,fov:G.fov,zoom:G.zoom}),V(G,N,Se)};function V(G,se,ge){ge===null?G.matrix.copy(se.matrixWorld):(G.matrix.copy(ge.matrixWorld),G.matrix.invert(),G.matrix.multiply(se.matrixWorld)),G.matrix.decompose(G.position,G.quaternion,G.scale),G.updateMatrixWorld(!0),G.projectionMatrix.copy(se.projectionMatrix),G.projectionMatrixInverse.copy(se.projectionMatrixInverse),G.isPerspectiveCamera&&(G.fov=Ro*2*Math.atan(1/G.projectionMatrix.elements[5]),G.zoom=1)}this.getCamera=function(){return N},this.getFoveation=function(){if(!(h===null&&d===null))return l},this.setFoveation=function(G){l=G,h!==null&&(h.fixedFoveation=G),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=G)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(N)},this.getCameraTexture=function(G){return v[G]};let $=null;function ie(G,se){if(f=se.getViewerPose(c||a),p=se,f!==null){const ge=f.views;d!==null&&(e.setRenderTargetFramebuffer(E,d.framebuffer),e.setRenderTarget(E));let Se=!1;ge.length!==N.cameras.length&&(N.cameras.length=0,Se=!0);for(let Re=0;Re<ge.length;Re++){const Ve=ge[Re];let Xe=null;if(d!==null)Xe=d.getViewport(Ve);else{const Ee=u.getViewSubImage(h,Ve);Xe=Ee.viewport,Re===0&&(e.setRenderTargetTextures(E,Ee.colorTexture,Ee.depthStencilTexture),e.setRenderTarget(E))}let ee=F[Re];ee===void 0&&(ee=new Ti,ee.layers.enable(Re),ee.viewport=new _t,F[Re]=ee),ee.matrix.fromArray(Ve.transform.matrix),ee.matrix.decompose(ee.position,ee.quaternion,ee.scale),ee.projectionMatrix.fromArray(Ve.projectionMatrix),ee.projectionMatrixInverse.copy(ee.projectionMatrix).invert(),ee.viewport.set(Xe.x,Xe.y,Xe.width,Xe.height),Re===0&&(N.matrix.copy(ee.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale)),Se===!0&&N.cameras.push(ee)}const ae=s.enabledFeatures;if(ae&&ae.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){u=i.getBinding();const Re=u.getDepthInformation(ge[0]);Re&&Re.isValid&&Re.texture&&m.init(Re,s.renderState)}if(ae&&ae.includes("camera-access")&&_){e.state.unbindTexture(),u=i.getBinding();for(let Re=0;Re<ge.length;Re++){const Ve=ge[Re].camera;if(Ve){let Xe=v[Ve];Xe||(Xe=new Dh,v[Ve]=Xe);const ee=u.getCameraImage(Ve);Xe.sourceTexture=ee}}}}for(let ge=0;ge<b.length;ge++){const Se=y[ge],ae=b[ge];Se!==null&&ae!==void 0&&ae.update(Se,se,c||a)}$&&$(G,se),se.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:se}),p=null}const ne=new Oh;ne.setAnimationLoop(ie),this.setAnimationLoop=function(G){$=G},this.dispose=function(){}}}const Yv=new yt,$h=new Fe;$h.set(-1,0,0,0,1,0,0,0,1);function Kv(n,e){function t(m,v){m.matrixAutoUpdate===!0&&m.updateMatrix(),v.value.copy(m.matrix)}function i(m,v){v.color.getRGB(m.fogColor.value,Nh(n)),v.isFog?(m.fogNear.value=v.near,m.fogFar.value=v.far):v.isFogExp2&&(m.fogDensity.value=v.density)}function s(m,v,S,T,E){v.isNodeMaterial?v.uniformsNeedUpdate=!1:v.isMeshBasicMaterial?r(m,v):v.isMeshLambertMaterial?(r(m,v),v.envMap&&(m.envMapIntensity.value=v.envMapIntensity)):v.isMeshToonMaterial?(r(m,v),u(m,v)):v.isMeshPhongMaterial?(r(m,v),f(m,v),v.envMap&&(m.envMapIntensity.value=v.envMapIntensity)):v.isMeshStandardMaterial?(r(m,v),h(m,v),v.isMeshPhysicalMaterial&&d(m,v,E)):v.isMeshMatcapMaterial?(r(m,v),p(m,v)):v.isMeshDepthMaterial?r(m,v):v.isMeshDistanceMaterial?(r(m,v),_(m,v)):v.isMeshNormalMaterial?r(m,v):v.isLineBasicMaterial?(a(m,v),v.isLineDashedMaterial&&o(m,v)):v.isPointsMaterial?l(m,v,S,T):v.isSpriteMaterial?c(m,v):v.isShadowMaterial?(m.color.value.copy(v.color),m.opacity.value=v.opacity):v.isShaderMaterial&&(v.uniformsNeedUpdate=!1)}function r(m,v){m.opacity.value=v.opacity,v.color&&m.diffuse.value.copy(v.color),v.emissive&&m.emissive.value.copy(v.emissive).multiplyScalar(v.emissiveIntensity),v.map&&(m.map.value=v.map,t(v.map,m.mapTransform)),v.alphaMap&&(m.alphaMap.value=v.alphaMap,t(v.alphaMap,m.alphaMapTransform)),v.bumpMap&&(m.bumpMap.value=v.bumpMap,t(v.bumpMap,m.bumpMapTransform),m.bumpScale.value=v.bumpScale,v.side===Yt&&(m.bumpScale.value*=-1)),v.normalMap&&(m.normalMap.value=v.normalMap,t(v.normalMap,m.normalMapTransform),m.normalScale.value.copy(v.normalScale),v.side===Yt&&m.normalScale.value.negate()),v.displacementMap&&(m.displacementMap.value=v.displacementMap,t(v.displacementMap,m.displacementMapTransform),m.displacementScale.value=v.displacementScale,m.displacementBias.value=v.displacementBias),v.emissiveMap&&(m.emissiveMap.value=v.emissiveMap,t(v.emissiveMap,m.emissiveMapTransform)),v.specularMap&&(m.specularMap.value=v.specularMap,t(v.specularMap,m.specularMapTransform)),v.alphaTest>0&&(m.alphaTest.value=v.alphaTest);const S=e.get(v),T=S.envMap,E=S.envMapRotation;T&&(m.envMap.value=T,m.envMapRotation.value.setFromMatrix4(Yv.makeRotationFromEuler(E)).transpose(),T.isCubeTexture&&T.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply($h),m.reflectivity.value=v.reflectivity,m.ior.value=v.ior,m.refractionRatio.value=v.refractionRatio),v.lightMap&&(m.lightMap.value=v.lightMap,m.lightMapIntensity.value=v.lightMapIntensity,t(v.lightMap,m.lightMapTransform)),v.aoMap&&(m.aoMap.value=v.aoMap,m.aoMapIntensity.value=v.aoMapIntensity,t(v.aoMap,m.aoMapTransform))}function a(m,v){m.diffuse.value.copy(v.color),m.opacity.value=v.opacity,v.map&&(m.map.value=v.map,t(v.map,m.mapTransform))}function o(m,v){m.dashSize.value=v.dashSize,m.totalSize.value=v.dashSize+v.gapSize,m.scale.value=v.scale}function l(m,v,S,T){m.diffuse.value.copy(v.color),m.opacity.value=v.opacity,m.size.value=v.size*S,m.scale.value=T*.5,v.map&&(m.map.value=v.map,t(v.map,m.uvTransform)),v.alphaMap&&(m.alphaMap.value=v.alphaMap,t(v.alphaMap,m.alphaMapTransform)),v.alphaTest>0&&(m.alphaTest.value=v.alphaTest)}function c(m,v){m.diffuse.value.copy(v.color),m.opacity.value=v.opacity,m.rotation.value=v.rotation,v.map&&(m.map.value=v.map,t(v.map,m.mapTransform)),v.alphaMap&&(m.alphaMap.value=v.alphaMap,t(v.alphaMap,m.alphaMapTransform)),v.alphaTest>0&&(m.alphaTest.value=v.alphaTest)}function f(m,v){m.specular.value.copy(v.specular),m.shininess.value=Math.max(v.shininess,1e-4)}function u(m,v){v.gradientMap&&(m.gradientMap.value=v.gradientMap)}function h(m,v){m.metalness.value=v.metalness,v.metalnessMap&&(m.metalnessMap.value=v.metalnessMap,t(v.metalnessMap,m.metalnessMapTransform)),m.roughness.value=v.roughness,v.roughnessMap&&(m.roughnessMap.value=v.roughnessMap,t(v.roughnessMap,m.roughnessMapTransform)),v.envMap&&(m.envMapIntensity.value=v.envMapIntensity)}function d(m,v,S){m.ior.value=v.ior,v.diffuseRoughness>0&&(m.diffuseRoughness.value=v.diffuseRoughness,v.diffuseRoughnessMap&&(m.diffuseRoughnessMap.value=v.diffuseRoughnessMap,t(v.diffuseRoughnessMap,m.diffuseRoughnessMapTransform))),v.sheen>0&&(m.sheenColor.value.copy(v.sheenColor).multiplyScalar(v.sheen),m.sheenRoughness.value=v.sheenRoughness,v.sheenColorMap&&(m.sheenColorMap.value=v.sheenColorMap,t(v.sheenColorMap,m.sheenColorMapTransform)),v.sheenRoughnessMap&&(m.sheenRoughnessMap.value=v.sheenRoughnessMap,t(v.sheenRoughnessMap,m.sheenRoughnessMapTransform))),v.clearcoat>0&&(m.clearcoat.value=v.clearcoat,m.clearcoatRoughness.value=v.clearcoatRoughness,v.clearcoatMap&&(m.clearcoatMap.value=v.clearcoatMap,t(v.clearcoatMap,m.clearcoatMapTransform)),v.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=v.clearcoatRoughnessMap,t(v.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),v.clearcoatNormalMap&&(m.clearcoatNormalMap.value=v.clearcoatNormalMap,t(v.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(v.clearcoatNormalScale),v.side===Yt&&m.clearcoatNormalScale.value.negate())),v.dispersion>0&&(m.dispersion.value=v.dispersion),v.retroreflectivity>0&&(m.retroreflectivity.value=v.retroreflectivity),v.iridescence>0&&(m.iridescence.value=v.iridescence,m.iridescenceIOR.value=v.iridescenceIOR,m.iridescenceThicknessMinimum.value=v.iridescenceThicknessMinimum,m.iridescenceThicknessMaximum.value=v.iridescenceThicknessMaximum,v.iridescenceMap&&(m.iridescenceMap.value=v.iridescenceMap,t(v.iridescenceMap,m.iridescenceMapTransform)),v.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=v.iridescenceThicknessMap,t(v.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),v.transmission>0&&(m.transmission.value=v.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),v.transmissionMap&&(m.transmissionMap.value=v.transmissionMap,t(v.transmissionMap,m.transmissionMapTransform)),m.thickness.value=v.thickness,v.thicknessMap&&(m.thicknessMap.value=v.thicknessMap,t(v.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=v.attenuationDistance,m.attenuationColor.value.copy(v.attenuationColor)),v.anisotropy>0&&(m.anisotropyVector.value.set(v.anisotropy*Math.cos(v.anisotropyRotation),v.anisotropy*Math.sin(v.anisotropyRotation)),v.anisotropyMap&&(m.anisotropyMap.value=v.anisotropyMap,t(v.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=v.specularIntensity,m.specularColor.value.copy(v.specularColor),v.specularColorMap&&(m.specularColorMap.value=v.specularColorMap,t(v.specularColorMap,m.specularColorMapTransform)),v.specularIntensityMap&&(m.specularIntensityMap.value=v.specularIntensityMap,t(v.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,v){v.matcap&&(m.matcap.value=v.matcap)}function _(m,v){const S=e.get(v).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function Zv(n,e,t,i){let s={},r={};function a(S,T){const E=T.program;i.uniformBlockBinding(S,E,s[S.id])}function o(S,T){let E=s[S.id];E===void 0&&(p(S),E=l(S),s[S.id]=E,S.addEventListener("dispose",m));const b=T.program;i.updateUBOMapping(S,b);const y=e.render.frame;r[S.id]!==y&&(c(S),r[S.id]=y)}function l(S){const T=n.createBuffer(),E=S.__size,b=S.usage;return n.bindBuffer(n.UNIFORM_BUFFER,T),n.bufferData(n.UNIFORM_BUFFER,E,b),n.bindBuffer(n.UNIFORM_BUFFER,null),T}function c(S){const T=s[S.id],E=S.uniforms,b=S.__cache;n.bindBuffer(n.UNIFORM_BUFFER,T);for(let y=0,g=E.length;y<g;y++){const x=E[y];if(Array.isArray(x))for(let I=0,R=x.length;I<R;I++)f(x[I],y,I,b);else f(x,y,0,b)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(S,T,E,b){if(h(S,T,E,b)===!0){const y=S.__offset,g=S.value;if(Array.isArray(g)){let x=0;for(let I=0;I<g.length;I++){const R=g[I],A=_(R,!0);u(R,S.__data,x),x+=A.storage/Float32Array.BYTES_PER_ELEMENT}}else u(g,S.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,y,S.__data)}}function u(S,T,E){typeof S=="number"||typeof S=="boolean"?T[E]=S:S.isMatrix3?(T[E]=S.elements[0],T[E+1]=S.elements[1],T[E+2]=S.elements[2],T[E+3]=0,T[E+4]=S.elements[3],T[E+5]=S.elements[4],T[E+6]=S.elements[5],T[E+7]=0,T[E+8]=S.elements[6],T[E+9]=S.elements[7],T[E+10]=S.elements[8],T[E+11]=0):ArrayBuffer.isView(S)?T.set(S.subarray(0,T.length-E),E):S.toArray(T,E)}function h(S,T,E,b){const y=S.value,g=T+"_"+E;if(Array.isArray(y)){b[g]===void 0&&(b[g]=[]);const x=b[g];let I=!1;for(let R=0;R<y.length;R++)d(y[R],x,R)===!0&&(I=!0);return I}return d(y,b,g)}function d(S,T,E){if(T[E]===void 0)return typeof S=="number"||typeof S=="boolean"?T[E]=S:ArrayBuffer.isView(S)?T[E]=S.slice():T[E]=S.clone(),!0;{const b=T[E];if(typeof S=="number"||typeof S=="boolean"){if(b!==S)return T[E]=S,!0}else{if(ArrayBuffer.isView(S))return!0;if(b.equals(S)===!1)return b.copy(S),!0}}return!1}function p(S){const T=S.uniforms;let E=0;const b=16;for(let g=0,x=T.length;g<x;g++){const I=Array.isArray(T[g])?T[g]:[T[g]];for(let R=0,A=I.length;R<A;R++){const F=I[R],N=Array.isArray(F.value)?F.value:[F.value],P=Array.isArray(T[g])||Array.isArray(F.value);let k=E;for(let B=0,C=N.length;B<C;B++){const L=N[B],V=_(L,P),$=E%b,ie=$%V.boundary,ne=$+ie;E+=ie,ne!==0&&b-ne<V.storage&&(E+=b-ne),B===0&&(k=E),E+=V.storage}const H=F.type==="int"?Int32Array:F.type==="uint"?Uint32Array:Float32Array;F.__data=new H((E-k)/Float32Array.BYTES_PER_ELEMENT),F.__offset=k}}const y=E%b;return y>0&&(E+=b-y),S.__size=E,S.__cache={},this}function _(S,T){const E={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(E.boundary=4,E.storage=4):S.isVector2?(E.boundary=8,E.storage=8):S.isVector3||S.isColor?(E.boundary=16,E.storage=12):S.isVector4?(E.boundary=16,E.storage=16):S.isMatrix3?(E.boundary=16,E.storage=48):S.isMatrix4?(E.boundary=16,E.storage=64):S.isTexture?Ne("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(S)?(E.boundary=16,E.storage=S.byteLength):Ne("WebGLRenderer: Unsupported uniform value type.",S),T===!0&&(E.boundary=16,E.storage=Math.ceil(E.storage/16)*16),E}function m(S){const T=S.target;T.removeEventListener("dispose",m),n.deleteBuffer(s[T.id]),delete s[T.id],delete r[T.id]}function v(){for(const S in s)n.deleteBuffer(s[S]);s={},r={}}return{bind:a,update:o,dispose:v}}const Jv=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Ei=null;function jv(){return Ei===null&&(Ei=new Ph(Jv,16,16,Sn,Li),Ei.name="DFG_LUT",Ei.minFilter=$t,Ei.magFilter=$t,Ei.wrapS=Ri,Ei.wrapT=Ri,Ei.generateMipmaps=!1,Ei.needsUpdate=!0),Ei}class Qv{constructor(e={}){const{canvas:t=Md(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:f="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:h=!1,outputBufferType:d=Qt}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=a;const _=d,m=new Set([qo,Xo,Wo]),v=new Set([Qt,Ii,bs,Qn,zo,Go]),S=new Uint32Array(4),T=new Int32Array(4),E={textures:[],min:[],max:[],resolution:[]};let b=null,y=null;const g=[],x=[];let I=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Hi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const R=this;let A=!1,F=null,N=null,P=null,k=null;this._outputColorSpace=li;let H=0,B=0,C=null,L=-1,V=null;const $=new _t,ie=new _t;let ne=null;const G=new rt(0);let se=0,ge=t.width,Se=t.height,ae=1,Le=null,lt=null;const Re=new _t(0,0,ge,Se),Ve=new _t(0,0,ge,Se);let Xe=!1;const ee=new Ur,Ee=new Zo;let we=!1,Ze=!1;const st=new yt,Xt=new K,He=new _t,Nt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ti=!1;function ii(){return C===null?ae:1}let z=i;function ni(w,O){return t.getContext(w,O)}let mt,gt,ve,bt,De,Ue,D,M,X,re,te,ce,pe,J,j,ue,U,Q,Z,fe,le,he,Pe;try{const w={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:f,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Bo}`),t.addEventListener("webglcontextlost",Ie,!1),t.addEventListener("webglcontextrestored",Be,!1),t.addEventListener("webglcontextcreationerror",xe,!1),z===null){const O="webgl2";if(z=ni(O,w),z===null)throw ni(O)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}ze()}catch(w){throw t.removeEventListener("webglcontextlost",Ie,!1),t.removeEventListener("webglcontextrestored",Be,!1),t.removeEventListener("webglcontextcreationerror",xe,!1),it("WebGLRenderer: "+w.message),w}function ze(){mt=new i0(z),mt.init(),le=new Vv(z,mt),gt=new Xg(z,mt,e,le),ve=new zv(z,mt),gt.reversedDepthBuffer&&h&&ve.buffers.depth.setReversed(!0),N=z.createFramebuffer(),P=z.createFramebuffer(),k=z.createFramebuffer(),bt=new r0(z),De=new Av,Ue=new Gv(z,mt,ve,De,gt,le,bt),D=new t0(R),M=new op(z),he=new Vg(z,M),X=new n0(z,M,bt,he),re=new o0(z,X,M,he,bt),Q=new a0(z,gt,Ue),j=new qg(De),te=new Tv(R,D,mt,gt,he,j),ce=new Kv(R,De),pe=new Cv,J=new Uv(mt),U=new Gg(R,D,ve,re,p,l),ue=new Hv(R,re,gt),Pe=new Zv(z,bt,gt,ve),Z=new Wg(z,mt,bt),fe=new s0(z,mt,bt),bt.programs=te.programs,R.capabilities=gt,R.extensions=mt,R.properties=De,R.renderLists=pe,R.shadowMap=ue,R.state=ve,R.info=bt}_!==Qt&&(I=new c0(_,t.width,t.height,o,s,r));const oe=new $v(R,z);this.xr=oe,this.getContext=function(){return z},this.getContextAttributes=function(){return z.getContextAttributes()},this.forceContextLoss=function(){const w=mt.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=mt.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return ae},this.setPixelRatio=function(w){w!==void 0&&(ae=w,this.setSize(ge,Se,!1))},this.getSize=function(w){return w.set(ge,Se)},this.setSize=function(w,O,Y=!0){if(oe.isPresenting){Ne("WebGLRenderer: Can't change size while VR device is presenting.");return}ge=w,Se=O,t.width=Math.floor(w*ae),t.height=Math.floor(O*ae),Y===!0&&(t.style.width=w+"px",t.style.height=O+"px"),I!==null&&I.setSize(t.width,t.height),this.setViewport(0,0,w,O)},this.getDrawingBufferSize=function(w){return w.set(ge*ae,Se*ae).floor()},this.setDrawingBufferSize=function(w,O,Y){ge=w,Se=O,ae=Y,t.width=Math.floor(w*Y),t.height=Math.floor(O*Y),this.setViewport(0,0,w,O)},this.setEffects=function(w){if(_===Qt){it("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(w){for(let O=0;O<w.length;O++)if(w[O].isOutputPass===!0){Ne("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}I.setEffects(w||[])},this.getCurrentViewport=function(w){return w.copy($)},this.getViewport=function(w){return w.copy(Re)},this.setViewport=function(w,O,Y,W){w.isVector4?Re.set(w.x,w.y,w.z,w.w):Re.set(w,O,Y,W),ve.viewport($.copy(Re).multiplyScalar(ii()).round())},this.getScissor=function(w){return w.copy(Ve)},this.setScissor=function(w,O,Y,W){w.isVector4?Ve.set(w.x,w.y,w.z,w.w):Ve.set(w,O,Y,W),ve.scissor(ie.copy(Ve).multiplyScalar(ii()).round())},this.getScissorTest=function(){return Xe},this.setScissorTest=function(w){ve.setScissorTest(Xe=w)},this.setOpaqueSort=function(w){Le=w},this.setTransparentSort=function(w){lt=w},this.getClearColor=function(w){return w.copy(U.getClearColor())},this.setClearColor=function(){U.setClearColor(...arguments)},this.getClearAlpha=function(){return U.getClearAlpha()},this.setClearAlpha=function(){U.setClearAlpha(...arguments)},this.clear=function(w=!0,O=!0,Y=!0){let W=0;if(w){let q=!1;if(C!==null){const me=C.texture.format;q=m.has(me)}if(q){const me=C.texture.type,be=v.has(me),de=U.getClearColor(),ye=U.getClearAlpha(),Ce=de.r,Oe=de.g,qe=de.b;be?(S[0]=Ce,S[1]=Oe,S[2]=qe,S[3]=ye,z.clearBufferuiv(z.COLOR,0,S)):(T[0]=Ce,T[1]=Oe,T[2]=qe,T[3]=ye,z.clearBufferiv(z.COLOR,0,T))}else W|=z.COLOR_BUFFER_BIT}O&&(W|=z.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Y&&(W|=z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),W!==0&&z.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(w){w.setRenderer(this),F=w},this.dispose=function(){t.removeEventListener("webglcontextlost",Ie,!1),t.removeEventListener("webglcontextrestored",Be,!1),t.removeEventListener("webglcontextcreationerror",xe,!1),U.dispose(),pe.dispose(),J.dispose(),Ue.dispose(),De.dispose(),D.dispose(),re.dispose(),X.dispose(),he.dispose(),Pe.dispose(),te.dispose(),oe.dispose(),oe.removeEventListener("sessionstart",nl),oe.removeEventListener("sessionend",sl),on.stop()};function Ie(w){w.preventDefault(),Bl("WebGLRenderer: Context Lost."),A=!0}function Be(){Bl("WebGLRenderer: Context Restored."),A=!1;const w=bt.autoReset,O=ue.enabled,Y=ue.autoUpdate,W=ue.needsUpdate,q=ue.type;ze(),bt.autoReset=w,ue.enabled=O,ue.autoUpdate=Y,ue.needsUpdate=W,ue.type=q}function xe(w){it("WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function at(w){const O=w.target;O.removeEventListener("dispose",at),At(O)}function At(w){Vi(w),De.remove(w)}function Vi(w){const O=De.get(w).programs;O!==void 0&&(O.forEach(function(Y){te.releaseProgram(Y)}),w.isShaderMaterial&&te.releaseShaderCache(w))}this.renderBufferDirect=function(w,O,Y,W,q,me){O===null&&(O=Nt);const be=q.isMesh&&q.matrixWorld.determinantAffine()<0,de=Zh(w,O,Y,W,q);ve.setMaterial(W,be);let ye=Y.index,Ce=1;if(W.wireframe===!0){if(ye=X.getWireframeAttribute(Y),ye===void 0)return;Ce=2}const Oe=Y.drawRange,qe=Y.attributes.position;let Te=Oe.start*Ce,$e=(Oe.start+Oe.count)*Ce;me!==null&&(Te=Math.max(Te,me.start*Ce),$e=Math.min($e,(me.start+me.count)*Ce)),ye!==null?(Te=Math.max(Te,0),$e=Math.min($e,ye.count)):qe!=null&&(Te=Math.max(Te,0),$e=Math.min($e,qe.count));const St=$e-Te;if(St<0||St===1/0)return;he.setup(q,W,de,Y,ye);let ut,ct=Z;if(ye!==null&&(ut=M.get(ye),ct=fe,ct.setIndex(ut)),q.isMesh)W.wireframe===!0?(ve.setLineWidth(W.wireframeLinewidth*ii()),ct.setMode(z.LINES)):ct.setMode(z.TRIANGLES);else if(q.isLine){let Ut=W.linewidth;Ut===void 0&&(Ut=1),ve.setLineWidth(Ut*ii()),q.isLineSegments?ct.setMode(z.LINES):q.isLineLoop?ct.setMode(z.LINE_LOOP):ct.setMode(z.LINE_STRIP)}else q.isPoints?ct.setMode(z.POINTS):q.isSprite&&ct.setMode(z.TRIANGLES);if(q.isBatchedMesh)if(mt.get("WEBGL_multi_draw"))ct.renderMultiDraw(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount);else{const Ut=q._multiDrawStarts,Ae=q._multiDrawCounts,Bt=q._multiDrawCount,et=ye?M.get(ye).bytesPerElement:1,ln=De.get(W).currentProgram.getUniforms();for(let Ft=0;Ft<Bt;Ft++)ln.setValue(z,"_gl_DrawID",Ft),ct.render(Ut[Ft]/et,Ae[Ft])}else if(q.isInstancedMesh)ct.renderInstances(Te,St,q.count);else if(Y.isInstancedBufferGeometry){const Ut=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,Ae=Math.min(Y.instanceCount,Ut);ct.renderInstances(Te,St,Ae)}else ct.render(Te,St)};function il(w,O,Y,W){F!==null&&w.isNodeMaterial&&F.setObject(W,w),we===!0&&j.setState(w,Y,!1),w.transparent===!0&&w.side===_i&&w.forceSinglePass===!1?(w.side=Yt,w.needsUpdate=!0,ss(w,O,W),w.side=yn,w.needsUpdate=!0,ss(w,O,W),w.side=_i):ss(w,O,W)}this.compile=function(w,O,Y=null){Y===null&&(Y=w),F!==null&&F.renderStart(w,O,Y),y=J.get(Y),y.init(O),x.push(y),Y.traverseVisible(function(q){q.isLight&&q.layers.test(O.layers)&&(y.pushLight(q),q.castShadow&&y.pushShadow(q))}),w!==Y&&w.traverseVisible(function(q){q.isLight&&q.layers.test(O.layers)&&(y.pushLight(q),q.castShadow&&y.pushShadow(q))}),y.setupLights(),F!==null&&F.updateLights(y.state.lightsArray),Ze=this.localClippingEnabled,we=j.init(this.clippingPlanes,Ze),we===!0&&j.setGlobalState(this.clippingPlanes,O),F!==null&&ue.render(y.state.shadowsArray,Y,O);const W=new Set;return w.traverse(function(q){if(!(q.isMesh||q.isPoints||q.isLine||q.isSprite))return;const me=q.material;if(me)if(Array.isArray(me))for(let be=0;be<me.length;be++){const de=me[be];il(de,Y,O,q),W.add(de)}else il(me,Y,O,q),W.add(me)}),y=x.pop(),F!==null&&F.renderEnd(),W},this.compileAsync=function(w,O,Y=null){const W=this.compile(w,O,Y);return new Promise(q=>{function me(){if(W.forEach(function(be){const ye=De.get(be).currentProgram;(ye===void 0||ye.isReady())&&W.delete(be)}),W.size===0){q(w);return}setTimeout(me,10)}mt.get("KHR_parallel_shader_compile")!==null?me():setTimeout(me,10)})};let Vr=null;function Yh(w){Vr&&Vr(w)}function nl(){on.stop()}function sl(){on.start()}const on=new Oh;on.setAnimationLoop(Yh),typeof self<"u"&&on.setContext(self),this.setAnimationLoop=function(w){Vr=w,oe.setAnimationLoop(w),w===null?on.stop():on.start()},oe.addEventListener("sessionstart",nl),oe.addEventListener("sessionend",sl),this.render=function(w,O){if(O!==void 0&&O.isCamera!==!0){it("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(A===!0)return;F!==null&&F.renderStart(w,O);const Y=oe.enabled===!0&&oe.isPresenting===!0,W=I!==null&&(C===null||Y)&&I.begin(R,C);if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),oe.enabled===!0&&oe.isPresenting===!0&&(I===null||I.isCompositing()===!1)&&(oe.cameraAutoUpdate===!0&&oe.updateCamera(O),O=oe.getCamera()),w.isScene===!0&&w.onBeforeRender(R,w,O,C),y=J.get(w,x.length),y.init(O),y.state.textureUnits=Ue.getTextureUnits(),x.push(y),st.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),O.isArrayCamera?Ee.setFromArrayCamera(O):ee.setFromProjectionMatrix(st,Mi,O.reversedDepth),Ze=this.localClippingEnabled,we=j.init(this.clippingPlanes,Ze),b=pe.get(w,g.length),b.init(),g.push(b),this.info.render.frame++,oe.enabled===!0&&oe.isPresenting===!0){const be=R.xr.getDepthSensingMesh();be!==null&&Wr(be,O,-1/0,R.sortObjects)}Wr(w,O,0,R.sortObjects),b.finish(),F!==null&&F.updateLights(y.state.lightsArray),R.sortObjects===!0&&b.sort(Le,lt),ti=oe.enabled===!1||oe.isPresenting===!1||oe.hasDepthSensing()===!1,ti&&U.addToRenderList(b,w),this.info.autoReset===!0&&this.info.reset(),we===!0&&j.beginShadows();const q=y.state.shadowsArray;if(ue.render(q,w,O),we===!0&&j.endShadows(),(W&&I.hasRenderPass())===!1){const be=b.opaque,de=b.transmissive;if(y.setupLights(),O.isArrayCamera){const ye=O.cameras;if(de.length>0)for(let Ce=0,Oe=ye.length;Ce<Oe;Ce++){const qe=ye[Ce];al(be,de,w,qe)}ti&&U.render(w);for(let Ce=0,Oe=ye.length;Ce<Oe;Ce++){const qe=ye[Ce];rl(b,w,qe,qe.viewport)}}else de.length>0&&al(be,de,w,O),ti&&U.render(w),rl(b,w,O)}C!==null&&B===0&&(Ue.updateMultisampleRenderTarget(C),Ue.updateRenderTargetMipmap(C)),W&&I.end(R),w.isScene===!0&&w.onAfterRender(R,w,O),he.resetDefaultState(),L=-1,V=null,x.pop(),x.length>0?(y=x[x.length-1],Ue.setTextureUnits(y.state.textureUnits),we===!0&&j.setGlobalState(R.clippingPlanes,y.state.camera)):y=null,g.pop(),g.length>0?b=g[g.length-1]:b=null,F!==null&&F.renderEnd()};function Wr(w,O,Y,W){if(w.visible===!1)return;if(w.layers.test(O.layers)){if(w.isGroup)Y=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(O);else if(w.isLight)y.pushLight(w),w.castShadow&&y.pushShadow(w);else if(w.isSprite){const be=O.isArrayCamera?Ee:ee;if(!w.frustumCulled||w.intersectsFrustum(be)){W&&He.setFromMatrixPosition(w.matrixWorld).applyMatrix4(st);const de=re.update(w),ye=w.material;ye.visible&&b.push(w,de,ye,Y,He.z,null,O)}}else if(w.isMesh||w.isLine||w.isPoints){const be=O.isArrayCamera?Ee:ee;if(!w.frustumCulled||w.intersectsFrustum(be)){const de=re.update(w),ye=w.material;if(W&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),He.copy(w.boundingSphere.center)):(de.boundingSphere===null&&de.computeBoundingSphere(),He.copy(de.boundingSphere.center)),He.applyMatrix4(w.matrixWorld).applyMatrix4(st)),Array.isArray(ye)){const Ce=de.groups;for(let Oe=0,qe=Ce.length;Oe<qe;Oe++){const Te=Ce[Oe],$e=ye[Te.materialIndex];$e&&$e.visible&&b.push(w,de,$e,Y,He.z,Te,O)}}else ye.visible&&b.push(w,de,ye,Y,He.z,null,O)}}}const me=w.children;for(let be=0,de=me.length;be<de;be++)Wr(me[be],O,Y,W)}function rl(w,O,Y,W){const{opaque:q,transmissive:me,transparent:be}=w;y.setupLightsView(Y),we===!0&&j.setGlobalState(R.clippingPlanes,Y),W&&ve.viewport($.copy(W)),q.length>0&&Is(q,O,Y),me.length>0&&Is(me,O,Y),be.length>0&&Is(be,O,Y),ve.buffers.depth.setTest(!0),ve.buffers.depth.setMask(!0),ve.buffers.color.setMask(!0),ve.setPolygonOffset(!1)}function al(w,O,Y,W){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;if(y.state.transmissionRenderTarget[W.id]===void 0){const Te=mt.has("EXT_color_buffer_half_float")||mt.has("EXT_color_buffer_float");y.state.transmissionRenderTarget[W.id]=new Pi(1,1,{generateMipmaps:!0,type:Te?Li:Qt,minFilter:nn,samples:Math.max(4,gt.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Ye.workingColorSpace})}const me=y.state.transmissionRenderTarget[W.id],be=W.viewport||$;me.setSize(be.z*R.transmissionResolutionScale,be.w*R.transmissionResolutionScale);const de=R.getRenderTarget(),ye=R.getActiveCubeFace(),Ce=R.getActiveMipmapLevel();R.setRenderTarget(me),R.getClearColor(G),se=R.getClearAlpha(),se<1&&R.setClearColor(16777215,.5),R.clear(),ti&&U.render(Y);const Oe=R.toneMapping;R.toneMapping=Hi;const qe=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),y.setupLightsView(W),we===!0&&j.setGlobalState(R.clippingPlanes,W),Is(w,Y,W),Ue.updateMultisampleRenderTarget(me),Ue.updateRenderTargetMipmap(me),mt.has("WEBGL_multisampled_render_to_texture")===!1){let Te=!1;for(let $e=0,St=O.length;$e<St;$e++){const ut=O[$e],{object:ct,geometry:Ut,material:Ae,group:Bt}=ut;if(Ae.side===_i&&ct.layers.test(W.layers)){const et=Ae.side;Ae.side=Yt,Ae.needsUpdate=!0,ol(ct,Y,W,Ut,Ae,Bt),Ae.side=et,Ae.needsUpdate=!0,Te=!0}}Te===!0&&(Ue.updateMultisampleRenderTarget(me),Ue.updateRenderTargetMipmap(me))}R.setRenderTarget(de,ye,Ce),R.setClearColor(G,se),qe!==void 0&&(W.viewport=qe),R.toneMapping=Oe}function Is(w,O,Y){const W=O.isScene===!0?O.overrideMaterial:null;for(let q=0,me=w.length;q<me;q++){const be=w[q],{object:de,geometry:ye,group:Ce}=be;let Oe=be.material;Oe.allowOverride===!0&&W!==null&&(Oe=W),de.layers.test(Y.layers)&&ol(de,O,Y,ye,Oe,Ce)}}function ol(w,O,Y,W,q,me){F!==null&&q.isNodeMaterial&&F.setObject(w,q),w.onBeforeRender(R,O,Y,W,q,me),w.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),q.onBeforeRender(R,O,Y,W,w,me),q.transparent===!0&&q.side===_i&&q.forceSinglePass===!1?(q.side=Yt,q.needsUpdate=!0,R.renderBufferDirect(Y,O,W,q,w,me),q.side=yn,q.needsUpdate=!0,R.renderBufferDirect(Y,O,W,q,w,me),q.side=_i):R.renderBufferDirect(Y,O,W,q,w,me),w.onAfterRender(R,O,Y,W,q,me)}function ll(w){let O=0;for(const Y of w)Y.texture!==null&&O++;return O}function ss(w,O,Y){O.isScene!==!0&&(O=Nt);const W=De.get(w),q=y.state.lights,me=y.state.shadowsArray,be=q.state.version,de=te.getParameters(w,q.state,me,O,Y,y.state.lightProbeGridArray),ye=te.getProgramCacheKey(de);let Ce=W.programs;W.environment=w.isMeshStandardMaterial||w.isMeshLambertMaterial||w.isMeshPhongMaterial?O.environment:null,W.fog=O.fog;const Oe=w.isMeshStandardMaterial||w.isMeshLambertMaterial&&!w.envMap||w.isMeshPhongMaterial&&!w.envMap;W.envMap=D.get(w.envMap||W.environment,Oe),W.envMapRotation=W.environment!==null&&w.envMap===null?O.environmentRotation:w.envMapRotation,Ce===void 0&&(w.addEventListener("dispose",at),Ce=new Map,W.programs=Ce,W.programVariants=new Map);let qe=Ce.get(ye);if(qe!==void 0){if(W.currentProgram===qe&&W.lightsStateVersion===be)return hl(w,de),qe}else de.uniforms=te.getUniforms(w),F!==null&&w.isNodeMaterial&&F.build(w,Y,de),w.onBeforeCompile(de,R),qe=te.acquireProgram(de,ye),Ce.set(ye,qe),W.uniforms=de.uniforms;const Te=W.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Te.clippingPlanes=j.uniform),hl(w,de),W.needsLights=jh(w),W.lightsStateVersion=be,W.needsLights&&(Te.ambientLightColor.value=q.state.ambient,Te.lightProbe.value=q.state.probe,Te.sunLights.value=q.state.sun,Te.sunLightShadows.value=q.state.sunShadow,Te.directionalLights.value=q.state.directional,Te.directionalLightShadows.value=q.state.directionalShadow,Te.spotLights.value=q.state.spot,Te.spotLightShadows.value=q.state.spotShadow,Te.rectAreaLights.value=q.state.rectArea,Te.ltc_1.value=q.state.rectAreaLTC1,Te.ltc_2.value=q.state.rectAreaLTC2,Te.pointLights.value=q.state.point,Te.pointLightShadows.value=q.state.pointShadow,Te.hemisphereLights.value=q.state.hemi,Te.sunShadowMatrix.value=q.state.sunShadowMatrix,Te.sunShadowCascade.value=q.state.sunShadowCascade,Te.directionalShadowMatrix.value=q.state.directionalShadowMatrix,Te.spotLightMatrix.value=q.state.spotLightMatrix,Te.spotLightMap.value=q.state.spotLightMap,Te.pointShadowMatrix.value=q.state.pointShadowMatrix),W.numLightProbeGrids=ll(y.state.lightProbeGridArray),W.currentProgram=qe,W.uniformsList=null,qe}function Kh(w,O,Y,W,q){const me=De.get(w),be=me.currentProgram.id+","+W+","+q;let de=me.programVariants.get(be);return de===void 0?(de=ss(w,O,Y),me.programVariants.set(be,de)):(me.currentProgram=de,me.uniformsList=null,me.outputColorSpace=W,me.toneMapping=q),de}function cl(w){if(w.uniformsList===null){const O=w.currentProgram.getUniforms();w.uniformsList=Mr.seqWithValue(O.seq,w.uniforms)}return w.uniformsList}function hl(w,O){const Y=De.get(w);Y.outputColorSpace=O.outputColorSpace,Y.batching=O.batching,Y.batchingColor=O.batchingColor,Y.instancing=O.instancing,Y.instancingColor=O.instancingColor,Y.instancingMorph=O.instancingMorph,Y.skinning=O.skinning,Y.morphTargets=O.morphTargets,Y.morphNormals=O.morphNormals,Y.morphColors=O.morphColors,Y.morphTargetsCount=O.morphTargetsCount,Y.numClippingPlanes=O.numClippingPlanes,Y.numIntersection=O.numClipIntersection,Y.vertexAlphas=O.vertexAlphas,Y.vertexTangents=O.vertexTangents,Y.toneMapping=O.toneMapping}function Zh(w,O,Y,W,q){O.isScene!==!0&&(O=Nt),Ue.resetTextureUnits();const me=O.fog,be=W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial?O.environment:null,de=C===null?R.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:Ye.workingColorSpace,ye=W.isMeshStandardMaterial||W.isMeshLambertMaterial&&!W.envMap||W.isMeshPhongMaterial&&!W.envMap,Ce=D.get(W.envMap||be,ye),Oe=W.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,qe=!!Y.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Te=!!Y.morphAttributes.position,$e=!!Y.morphAttributes.normal,St=!!Y.morphAttributes.color;let ut=Hi;W.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(ut=R.toneMapping);const ct=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,Ut=ct!==void 0?ct.length:0,Ae=De.get(W),Bt=y.state.lights;if(we===!0&&(Ze===!0||w!==V)){const xt=w===V&&W.id===L;j.setState(W,w,xt)}let et=!1,ln=!1;W.version===Ae.__version?Ae.needsLights&&Ae.lightsStateVersion!==Bt.state.version||q.isBatchedMesh&&Ae.batching===!1||!q.isBatchedMesh&&Ae.batching===!0||q.isBatchedMesh&&Ae.batchingColor===!0&&q._colorsTexture===null||q.isBatchedMesh&&Ae.batchingColor===!1&&q._colorsTexture!==null||q.isInstancedMesh&&Ae.instancing===!1||!q.isInstancedMesh&&Ae.instancing===!0||q.isSkinnedMesh&&Ae.skinning===!1||!q.isSkinnedMesh&&Ae.skinning===!0||q.isInstancedMesh&&Ae.instancingColor===!0&&q.instanceColor===null||q.isInstancedMesh&&Ae.instancingColor===!1&&q.instanceColor!==null||q.isInstancedMesh&&Ae.instancingMorph===!0&&q.morphTexture===null||q.isInstancedMesh&&Ae.instancingMorph===!1&&q.morphTexture!==null||Ae.envMap!==Ce||W.fog===!0&&Ae.fog!==me||Ae.numClippingPlanes!==void 0&&(Ae.numClippingPlanes!==j.numPlanes||Ae.numIntersection!==j.numIntersection)||Ae.vertexAlphas!==Oe||Ae.vertexTangents!==qe||Ae.morphTargets!==Te||Ae.morphNormals!==$e||Ae.morphColors!==St||Ae.morphTargetsCount!==Ut||Ae.numLightProbeGrids!==ll(y.state.lightProbeGridArray)?et=!0:(Ae.outputColorSpace!==de||Ae.toneMapping!==ut)&&(ln=!0):(et=!0,Ae.__version=W.version);let Ft=Ae.currentProgram;(et===!0||ln===!0)&&(Ft=ln===!0?Kh(W,O,q,de,ut):ss(W,O,q),F&&W.isNodeMaterial&&F.onUpdateProgram(W,Ft,Ae));let Ls=!1,Wi=!1,cn=!1;const Je=Ft.getUniforms(),It=Ae.uniforms;if(ve.useProgram(Ft.program)&&(Ls=!0,Wi=!0,cn=!0),W.id!==L&&(L=W.id,Wi=!0),Ls||V!==w){ve.buffers.depth.getReversed()&&w.reversedDepth!==!0&&(w._reversedDepth=!0,w.updateProjectionMatrix()),Je.setValue(z,"projectionMatrix",w.projectionMatrix),Je.setValue(z,"viewMatrix",w.matrixWorldInverse);const Rt=Je.map.cameraPosition;Rt!==void 0&&Rt.setValue(z,Xt.setFromMatrixPosition(w.matrixWorld)),gt.logarithmicDepthBuffer&&Je.setValue(z,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&Je.setValue(z,"isOrthographic",w.isOrthographicCamera===!0),V!==w&&(V=w,Wi=!0,cn=!0)}if(Ae.needsLights&&(Bt.state.sunShadowMap.length>0&&Je.setValue(z,"sunShadowMap",Bt.state.sunShadowMap,Ue),Bt.state.directionalShadowMap.length>0&&Je.setValue(z,"directionalShadowMap",Bt.state.directionalShadowMap,Ue),Bt.state.spotShadowMap.length>0&&Je.setValue(z,"spotShadowMap",Bt.state.spotShadowMap,Ue),Bt.state.pointShadowMap.length>0&&Je.setValue(z,"pointShadowMap",Bt.state.pointShadowMap,Ue)),q.isSkinnedMesh){Je.setOptional(z,q,"bindMatrix"),Je.setOptional(z,q,"bindMatrixInverse");const xt=q.skeleton;xt&&(xt.boneTexture===null&&xt.computeBoneTexture(),Je.setValue(z,"boneTexture",xt.boneTexture,Ue))}q.isBatchedMesh&&(Je.setOptional(z,q,"batchingTexture"),Je.setValue(z,"batchingTexture",q._matricesTexture,Ue),Je.setOptional(z,q,"batchingIdTexture"),Je.setValue(z,"batchingIdTexture",q._indirectTexture,Ue),Je.setOptional(z,q,"batchingColorTexture"),q._colorsTexture!==null&&Je.setValue(z,"batchingColorTexture",q._colorsTexture,Ue));const hi=Y.morphAttributes;if((hi.position!==void 0||hi.normal!==void 0||hi.color!==void 0)&&Q.update(q,Y,Ft),(Wi||Ae.receiveShadow!==q.receiveShadow)&&(Ae.receiveShadow=q.receiveShadow,Je.setValue(z,"receiveShadow",q.receiveShadow)),(W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial)&&W.envMap===null&&O.environment!==null&&(It.envMapIntensity.value=O.environmentIntensity),It.dfgLUT!==void 0&&(It.dfgLUT.value=jv()),Wi){if(Je.setValue(z,"toneMappingExposure",R.toneMappingExposure),Ae.needsLights&&Jh(It,cn),me&&W.fog===!0&&ce.refreshFogUniforms(It,me),ce.refreshMaterialUniforms(It,W,ae,Se,y.state.transmissionRenderTarget[w.id]),Ae.needsLights&&Ae.numLightProbeGrids>0){const xt=E;let Rt=0;for(const Di of y.state.lightProbeGridArray)Di.texture!==null&&(xt.textures[Rt]=Di.texture,xt.min[Rt]=Di.boundingBox.min,xt.max[Rt]=Di.boundingBox.max,xt.resolution[Rt]=Di.resolution,Rt++);for(const Di in xt)xt[Di].length=Rt;It.probesSH.value=xt.textures,It.probesMin.value=xt.min,It.probesMax.value=xt.max,It.probesResolution.value=xt.resolution}Mr.upload(z,cl(Ae),It,Ue)}if(W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(Mr.upload(z,cl(Ae),It,Ue),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&Je.setValue(z,"center",q.center),Je.setValue(z,"modelViewMatrix",q.modelViewMatrix),Je.setValue(z,"normalMatrix",q.normalMatrix),Je.setValue(z,"modelMatrix",q.matrixWorld),W.uniformsGroups!==void 0){const xt=W.uniformsGroups;for(let Rt=0,Di=xt.length;Rt<Di;Rt++){const fl=xt[Rt];Pe.update(fl,Ft),Pe.bind(fl,Ft)}}return Ft}function Jh(w,O){w.ambientLightColor.needsUpdate=O,w.lightProbe.needsUpdate=O,w.sunLights.needsUpdate=O,w.sunLightShadows.needsUpdate=O,w.directionalLights.needsUpdate=O,w.directionalLightShadows.needsUpdate=O,w.pointLights.needsUpdate=O,w.pointLightShadows.needsUpdate=O,w.spotLights.needsUpdate=O,w.spotLightShadows.needsUpdate=O,w.rectAreaLights.needsUpdate=O,w.hemisphereLights.needsUpdate=O}function jh(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return H},this.getActiveMipmapLevel=function(){return B},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(w,O,Y){const W=De.get(w);W.__autoAllocateDepthBuffer=w.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),De.get(w.texture).__webglTexture=O,De.get(w.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:Y,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(w,O){const Y=De.get(w);Y.__webglFramebuffer=O,Y.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(w,O=0,Y=0){C=w,H=O,B=Y;let W=null,q=!1,me=!1;if(w){const de=De.get(w);if(de.__useDefaultFramebuffer!==void 0){ve.bindFramebuffer(z.FRAMEBUFFER,de.__webglFramebuffer),$.copy(w.viewport),ie.copy(w.scissor),ne=w.scissorTest,ve.viewport($),ve.scissor(ie),ve.setScissorTest(ne),L=-1;return}else if(de.__webglFramebuffer===void 0)Ue.setupRenderTarget(w);else if(de.__hasExternalTextures)Ue.rebindTextures(w,De.get(w.texture).__webglTexture,De.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const Oe=w.depthTexture;if(de.__boundDepthTexture!==Oe){if(Oe!==null&&De.has(Oe)&&(w.width!==Oe.image.width||w.height!==Oe.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Ue.setupDepthRenderbuffer(w)}}const ye=w.texture;(ye.isData3DTexture||ye.isDataArrayTexture||ye.isCompressedArrayTexture)&&(me=!0);const Ce=De.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Ce[O])?W=Ce[O][Y]:W=Ce[O],q=!0):w.samples>0&&Ue.useMultisampledRTT(w)===!1?W=De.get(w).__webglMultisampledFramebuffer:Array.isArray(Ce)?W=Ce[Y]:W=Ce,$.copy(w.viewport),ie.copy(w.scissor),ne=w.scissorTest}else $.copy(Re).multiplyScalar(ae).floor(),ie.copy(Ve).multiplyScalar(ae).floor(),ne=Xe;if(Y!==0&&(W=N),ve.bindFramebuffer(z.FRAMEBUFFER,W)&&ve.drawBuffers(w,W),ve.viewport($),ve.scissor(ie),ve.setScissorTest(ne),q){const de=De.get(w.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_CUBE_MAP_POSITIVE_X+O,de.__webglTexture,Y)}else if(me){const de=O;for(let ye=0;ye<w.textures.length;ye++){const Ce=De.get(w.textures[ye]);z.framebufferTextureLayer(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0+ye,Ce.__webglTexture,Y,de)}}else if(w!==null&&Y!==0){const de=De.get(w.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,de.__webglTexture,Y)}L=-1};function ul(w){const O=De.get(w);return(O.__readFormat!==w.format||O.__readType!==w.type)&&(O.__readFormat=w.format,O.__readType=w.type,O.__formatReadable=gt.textureFormatReadable(w.format),O.__typeReadable=gt.textureTypeReadable(w.type)),O}this.readRenderTargetPixels=function(w,O,Y,W,q,me,be,de=0){if(!(w&&w.isWebGLRenderTarget)){it("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ye=De.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&be!==void 0&&(ye=ye[be],Array.isArray(ye)&&(ye=ye[0])),ye){ve.bindFramebuffer(z.FRAMEBUFFER,ye);try{const Ce=w.textures[de],Oe=Ce.format,qe=Ce.type;w.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+de);const Te=ul(Ce);if(Te.__formatReadable===!1){it("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Te.__typeReadable===!1){it("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=w.width-W&&Y>=0&&Y<=w.height-q&&z.readPixels(O,Y,W,q,le.convert(Oe),le.convert(qe),me)}finally{const Ce=C!==null?De.get(C).__webglFramebuffer:null;ve.bindFramebuffer(z.FRAMEBUFFER,Ce)}}},this.readRenderTargetPixelsAsync=async function(w,O,Y,W,q,me,be,de=0){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ye=De.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&be!==void 0&&(ye=ye[be],Array.isArray(ye)&&(ye=ye[0])),ye)if(O>=0&&O<=w.width-W&&Y>=0&&Y<=w.height-q){ve.bindFramebuffer(z.FRAMEBUFFER,ye);const Ce=w.textures[de],Oe=Ce.format,qe=Ce.type;w.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+de);const Te=ul(Ce);if(Te.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Te.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const $e=z.createBuffer();z.bindBuffer(z.PIXEL_PACK_BUFFER,$e),z.bufferData(z.PIXEL_PACK_BUFFER,me.byteLength,z.STREAM_READ),z.readPixels(O,Y,W,q,le.convert(Oe),le.convert(qe),0),z.bindBuffer(z.PIXEL_PACK_BUFFER,null);const St=C!==null?De.get(C).__webglFramebuffer:null;ve.bindFramebuffer(z.FRAMEBUFFER,St);const ut=z.fenceSync(z.SYNC_GPU_COMMANDS_COMPLETE,0);return z.flush(),await wd(z,ut,4),z.bindBuffer(z.PIXEL_PACK_BUFFER,$e),z.getBufferSubData(z.PIXEL_PACK_BUFFER,0,me),z.bindBuffer(z.PIXEL_PACK_BUFFER,null),z.deleteBuffer($e),z.deleteSync(ut),me}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(w,O=null,Y=0){const W=Math.pow(2,-Y),q=Math.floor(w.image.width*W),me=Math.floor(w.image.height*W),be=O!==null?O.x:0,de=O!==null?O.y:0;Ue.setTexture2D(w,0),z.copyTexSubImage2D(z.TEXTURE_2D,Y,0,0,be,de,q,me),ve.unbindTexture()},this.copyTextureToTexture=function(w,O,Y=null,W=null,q=0,me=0){let be,de,ye,Ce,Oe,qe,Te,$e,St;const ut=w.isCompressedTexture?w.mipmaps[me]:w.image;if(Y!==null)be=Y.max.x-Y.min.x,de=Y.max.y-Y.min.y,ye=Y.isBox3?Y.max.z-Y.min.z:1,Ce=Y.min.x,Oe=Y.min.y,qe=Y.isBox3?Y.min.z:0;else{const Je=Math.pow(2,-q);be=Math.floor(ut.width*Je),de=Math.floor(ut.height*Je),w.isDataArrayTexture?ye=ut.depth:w.isData3DTexture?ye=Math.floor(ut.depth*Je):ye=1,Ce=0,Oe=0,qe=0}W!==null?(Te=W.x,$e=W.y,St=W.z):(Te=0,$e=0,St=0);const ct=le.convert(O.format),Ut=le.convert(O.type);let Ae;O.isData3DTexture?(Ue.setTexture3D(O,0),Ae=z.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(Ue.setTexture2DArray(O,0),Ae=z.TEXTURE_2D_ARRAY):(Ue.setTexture2D(O,0),Ae=z.TEXTURE_2D),ve.activeTexture(z.TEXTURE0),ve.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,O.flipY),ve.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),ve.pixelStorei(z.UNPACK_ALIGNMENT,O.unpackAlignment);const Bt=ve.getParameter(z.UNPACK_ROW_LENGTH),et=ve.getParameter(z.UNPACK_IMAGE_HEIGHT),ln=ve.getParameter(z.UNPACK_SKIP_PIXELS),Ft=ve.getParameter(z.UNPACK_SKIP_ROWS),Ls=ve.getParameter(z.UNPACK_SKIP_IMAGES);ve.pixelStorei(z.UNPACK_ROW_LENGTH,ut.width),ve.pixelStorei(z.UNPACK_IMAGE_HEIGHT,ut.height),ve.pixelStorei(z.UNPACK_SKIP_PIXELS,Ce),ve.pixelStorei(z.UNPACK_SKIP_ROWS,Oe),ve.pixelStorei(z.UNPACK_SKIP_IMAGES,qe);const Wi=w.isDataArrayTexture||w.isData3DTexture,cn=O.isDataArrayTexture||O.isData3DTexture;if(w.isDepthTexture){const Je=De.get(w),It=De.get(O),hi=De.get(Je.__renderTarget),xt=De.get(It.__renderTarget);ve.bindFramebuffer(z.READ_FRAMEBUFFER,hi.__webglFramebuffer),ve.bindFramebuffer(z.DRAW_FRAMEBUFFER,xt.__webglFramebuffer);for(let Rt=0;Rt<ye;Rt++)Wi&&(z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,De.get(w).__webglTexture,q,qe+Rt),z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,De.get(O).__webglTexture,me,St+Rt)),z.blitFramebuffer(Ce,Oe,Ce+be,Oe+de,Te,$e,Te+be,$e+de,z.DEPTH_BUFFER_BIT,z.NEAREST);ve.bindFramebuffer(z.READ_FRAMEBUFFER,null),ve.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else if(q!==0||w.isRenderTargetTexture||De.has(w)){const Je=De.get(w),It=De.get(O);ve.bindFramebuffer(z.READ_FRAMEBUFFER,P),ve.bindFramebuffer(z.DRAW_FRAMEBUFFER,k);for(let hi=0;hi<ye;hi++)Wi?z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,Je.__webglTexture,q,qe+hi):z.framebufferTexture2D(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,Je.__webglTexture,q),cn?z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,It.__webglTexture,me,St+hi):z.framebufferTexture2D(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,It.__webglTexture,me),q!==0?z.blitFramebuffer(Ce,Oe,Ce+be,Oe+de,Te,$e,Te+be,$e+de,z.COLOR_BUFFER_BIT,z.NEAREST):cn?z.copyTexSubImage3D(Ae,me,Te,$e,St+hi,Ce,Oe,be,de):z.copyTexSubImage2D(Ae,me,Te,$e,Ce,Oe,be,de);ve.bindFramebuffer(z.READ_FRAMEBUFFER,null),ve.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else cn?w.isDataTexture||w.isData3DTexture?z.texSubImage3D(Ae,me,Te,$e,St,be,de,ye,ct,Ut,ut.data):O.isCompressedArrayTexture?z.compressedTexSubImage3D(Ae,me,Te,$e,St,be,de,ye,ct,ut.data):z.texSubImage3D(Ae,me,Te,$e,St,be,de,ye,ct,Ut,ut):w.isDataTexture?z.texSubImage2D(z.TEXTURE_2D,me,Te,$e,be,de,ct,Ut,ut.data):w.isCompressedTexture?z.compressedTexSubImage2D(z.TEXTURE_2D,me,Te,$e,ut.width,ut.height,ct,ut.data):z.texSubImage2D(z.TEXTURE_2D,me,Te,$e,be,de,ct,Ut,ut);ve.pixelStorei(z.UNPACK_ROW_LENGTH,Bt),ve.pixelStorei(z.UNPACK_IMAGE_HEIGHT,et),ve.pixelStorei(z.UNPACK_SKIP_PIXELS,ln),ve.pixelStorei(z.UNPACK_SKIP_ROWS,Ft),ve.pixelStorei(z.UNPACK_SKIP_IMAGES,Ls),me===0&&O.generateMipmaps===!0&&O.mipmapsAutoUpdate===!0&&z.generateMipmap(Ae),ve.unbindTexture()},this.initRenderTarget=function(w){De.get(w).__webglFramebuffer===void 0&&Ue.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?Ue.setTextureCube(w,0):w.isData3DTexture?Ue.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?Ue.setTexture2DArray(w,0):Ue.setTexture2D(w,0),ve.unbindTexture()},this.resetState=function(){H=0,B=0,C=null,ve.reset(),he.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Mi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Ye._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ye._getUnpackColorSpace()}}const Tc=`precision highp float;
in vec3 position;in vec2 uv;uniform mat4 projectionMatrix,modelViewMatrix;uniform vec2 size;out vec2 texUV;
void main(){texUV=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position.xy*size,0.,1.);}`,ex=`precision highp float;
uniform sampler2D image,palette;uniform bool indexed,maskZero;uniform vec2 coefficients;uniform float opacity;
uniform int fxCount;uniform vec3 fxAdd[8],fxMul[8],fxPost[8];uniform vec2 fxColorInvert[8];in vec2 texUV;out vec4 result;
void main(){vec4 color=texture(image,texUV);if(indexed){float i=floor(color.r*255.+.5);color=texture(palette,vec2((i+.5)/256.,.5));if(i<.5){if(maskZero)discard;color.a=1.;}}if(color.a<=0.)discard;
vec3 rgb=color.rgb*255.;for(int i=0;i<8;i++){if(i>=fxCount)break;float grey=dot(rgb,vec3(.299,.587,.114));rgb=mix(vec3(grey),rgb,fxColorInvert[i].x);if(fxColorInvert[i].y>.5)rgb=255.-rgb;rgb=clamp((rgb+fxAdd[i])*fxMul[i]+fxPost[i],0.,255.);}
rgb=floor(rgb+.00001)/255.;float coverage=color.a*opacity;result=vec4(rgb*coefficients.x*coverage,coverage*(1.-coefficients.y));}`,tx=`precision highp float;uniform float ground;in vec2 texUV;out vec4 result;
void main(){vec2 p=vec2(texUV.x*960.,texUV.y*540.);vec3 color=vec3(.047,.067,.106);float h=ground-105.;if(p.y>h){float distance=p.y-h+16.;float x=(p.x-480.)*100./distance;float lines=min(abs(fract(x/80.+.5)-.5)*distance/100.,abs(fract(log(distance/16.)*3.)-.5)*distance*.18);color=mix(vec3(.105,.153,.215),color,smoothstep(.35,1.1,lines));}if(abs(p.y-ground)<.6)color=vec3(.27,.38,.33);result=vec4(color,1.);}`,ix=()=>({add:Array.from({length:8},()=>[0,0,0]),mul:Array.from({length:8},()=>[1,1,1]),post:Array.from({length:8},()=>[0,0,0]),color:Array.from({length:8},()=>[1,0])});class nx{constructor(e,{maxTextureBytes:t=64*1024*1024,preserveDrawingBuffer:i=!1}={}){this.renderer=new Qv({canvas:e,alpha:!1,antialias:!1,powerPreference:"high-performance",preserveDrawingBuffer:i}),this.renderer.debug.onShaderError=(a,o)=>{throw Error("Sprite shader could not compile: "+a.getProgramInfoLog(o))},this.renderer.outputColorSpace=Es,this.renderer.sortObjects=!1,this.renderer.setClearColor(790811,1),this.canvas=e,this.contextLost=a=>{a.preventDefault(),this.lost=!0},e.addEventListener("webglcontextlost",this.contextLost),this.limit=t,this.textureBytes=0,this.textures=new Map,this.slots=[],this.frames=0,this.scene=new Gd,this.camera=new Fh(0,960,0,540,-10,10),this.camera.position.z=1,this.geometry=new an,this.geometry.setAttribute("position",new wi([0,0,0,1,0,0,0,1,0,1,1,0],3)),this.geometry.setAttribute("uv",new wi([0,0,1,0,0,1,1,1],2)),this.geometry.setIndex([0,1,2,2,1,3]);const s=new Co({glslVersion:Lr,vertexShader:Tc,fragmentShader:tx,uniforms:{size:{value:[960,540]},ground:{value:450}},side:_i,depthTest:!1,depthWrite:!1});this.grid=new Gi(this.geometry,s),this.grid.frustumCulled=!1,this.scene.add(this.grid),this.upload({id:"@white",width:1,height:1,indexed:!1,pixels:new Uint8Array([255,255,255,255])});const r=new Uint8Array(256);for(let a=0;a<8;a++)for(let o=0;o<8;o++)if(o===3||a===3||Math.abs(o-3)===Math.abs(a-3)){const l=(a*8+o)*4;r.set([255,240,130,255],l)}this.upload({id:"@spark",width:8,height:8,pixels:r})}upload(e){if(this.textures.has(e.id))return;const t=e.pixels,i=e.width*e.height*(e.indexed?1:4);if(!Number.isSafeInteger(e.width)||!Number.isSafeInteger(e.height)||e.width<1||e.height<1)throw Error("Invalid GPU asset dimensions.");if(e.width>this.renderer.capabilities.maxTextureSize||e.height>this.renderer.capabilities.maxTextureSize)throw Error("Sprite exceeds this graphics device’s texture limit.");if(!(t instanceof Uint8Array)||t.length!==i)throw Error("Invalid GPU asset dimensions.");if(this.textureBytes+t.length>this.limit)throw Error("GPU texture budget exceeded. Close this match or use a smaller stage.");const s=new Ph(t,e.width,e.height,e.indexed?Vo:Si,Qt);s.minFilter=s.magFilter=Pt,s.wrapS=s.wrapT=Ri,s.generateMipmaps=!1,s.flipY=!1,s.unpackAlignment=1,s.needsUpdate=!0,this.textures.set(e.id,s),this.textureBytes+=t.length}slot(e){if(this.slots[e])return this.slots[e];const t=ix(),i=new Co({glslVersion:Lr,vertexShader:Tc,fragmentShader:ex,uniforms:{image:{value:null},palette:{value:null},indexed:{value:!1},maskZero:{value:!0},size:{value:[1,1]},coefficients:{value:[1,0]},opacity:{value:1},fxCount:{value:0},fxAdd:{value:t.add.flat()},fxMul:{value:t.mul.flat()},fxPost:{value:t.post.flat()},fxColorInvert:{value:t.color.flat()}},transparent:!0,depthTest:!1,depthWrite:!1,blending:nh,blendSrc:za,blendDst:Rr,blendEquation:Bi,blendEquationAlpha:Bi,blendSrcAlpha:za,blendDstAlpha:Rr});i.side=_i,i.forceSinglePass=!0;const s=new Gi(this.geometry,i);return s.matrixAutoUpdate=!1,s.frustumCulled=!1,s.onBeforeRender=()=>{const r=s.userData.clip,a=this.renderer,o=this.canvas.width/960;a.setScissorTest(!!r),r&&a.setScissor(r[0]*o,(540-r[1]-r[3])*o,r[2]*o,r[3]*o),i.uniformsNeedUpdate=!0},this.scene.add(s),this.slots[e]=s,s}render(e,{width:t=960,height:i=540}={}){var r,a,o,l,c,f;if(this.closed)return;if(this.lost)throw Error("Graphics context was lost. Start the match again from your library.");(this.canvas.width!==t||this.canvas.height!==i)&&this.renderer.setSize(t,i,!1);for(const u of e.assets||[])this.upload(u);this.grid.visible=!!e.grid,this.grid.material.uniforms.ground.value=e.ground||450;const s=e.draws.concat((e.sparks||[]).map(u=>{const h=(12-u.age)*.3+1;return{texture:"@spark",indexed:!1,width:8,height:8,matrix:[h,0,0,h,u.x-4*h,u.y-4*h],blend:{mode:"add",source:1,destination:1},alpha:(12-u.age)/12}}));for(let u=0;u<Math.max(s.length,this.slots.length);u++){if(u>=s.length){this.slots[u].visible=!1;continue}const h=s[u],d=this.slot(u),p=d.material.uniforms;d.visible=!0;const _=this.textures.get(h.texture);if(!_)throw Error("GPU texture was not delivered: "+h.texture);p.image.value=_,p.palette.value=this.textures.get(h.palette)||this.textures.get("@white"),p.indexed.value=!!h.indexed,p.maskZero.value=h.mask!==!1,p.size.value[0]=h.width,p.size.value[1]=h.height,p.opacity.value=h.alpha??1,p.coefficients.value[0]=((r=h.blend)==null?void 0:r.source)??1,p.coefficients.value[1]=((a=h.blend)==null?void 0:a.destination)??0;const[m,v,S,T,E,b]=h.matrix;d.matrix.set(m,S,0,E,v,T,0,b,0,0,1,0,0,0,0,1),d.matrixWorldNeedsUpdate=!0,d.userData.clip=h.clip,d.material.blendEquation=((o=h.blend)==null?void 0:o.mode)==="subtract"?sh:Bi;const y=h.palFX||[];p.fxCount.value=Math.min(8,y.length);for(let g=0;g<p.fxCount.value;g++){const x=y[g],I=x.sinadd||[],R=I[3]?Math.sin(2*Math.PI*(x.age||0)/I[3]):0;p.fxColorInvert.value[g*2]=(x.color??256)/256,p.fxColorInvert.value[g*2+1]=x.invertall?1:0;for(let A=0;A<3;A++)p.fxAdd.value[g*3+A]=(((l=x.add)==null?void 0:l[A])||0)+(I[A]||0)*R,p.fxMul.value[g*3+A]=(((c=x.mul)==null?void 0:c[A])??256)/256,p.fxPost.value[g*3+A]=((f=x.postadd)==null?void 0:f[A])||0}}return this.renderer.setScissorTest(!1),this.renderer.render(this.scene,this.camera),this.renderer.setScissorTest(!1),this.frames++,this.stats={backend:"Kenjatime Core · Three.js",frames:this.frames,draws:s.length,textureBytes:this.textureBytes,textures:this.textures.size,width:t,height:i},this.stats}close(){if(!this.closed){this.closed=!0,this.canvas.removeEventListener("webglcontextlost",this.contextLost);for(const e of this.textures.values())e.dispose();for(const e of this.slots)e.material.dispose();this.grid.material.dispose(),this.geometry.dispose(),this.renderer.dispose(),this.renderer.forceContextLoss(),this.textures.clear()}}}const Ac=1e3/60;class sx{constructor({maxTicks:e=12}={}){this.maxTicks=e,this.reset()}reset(){this.last=null,this.debt=0,this.tickCount=0,this.lastRender=null}suspend(){this.last=null,this.debt=0,this.lastRender=null}advance(e,{running:t=!0,speed:i=1}={},s=()=>{}){if(!Number.isFinite(e)||!Number.isFinite(i)||i<=0)throw Error("Invalid frame clock time or speed.");const r=this.last===null?0:Math.max(0,e-this.last);if(this.last=e,!t)return this.debt=0,0;this.debt+=r*i/Ac;let a=0;for(;this.debt>=1-1e-9&&a<this.maxTicks;){const o=e-Math.max(0,this.debt-1)*Ac/i;s(o),this.debt=Math.max(0,this.debt-1),a++,this.tickCount++}return a}renderDue(e,t=60){return this.lastRender===null||e-this.lastRender>=1e3/t-.25?(this.lastRender=e,!0):!1}}class Rc{constructor(){this.reset()}reset(){this.sources=new Map,this.sampled=new Map,this.queue=[],this.offset=0}clearSource(e){this.sources.delete(e),this.sampled.delete(e),this.queue=this.queue.slice(this.offset).filter(t=>t.source!==e),this.offset=0}record(e,t,i){const s=new Set(t),r=this.sources.get(e)||new Set;if(s.size===r.size&&[...s].every(l=>r.has(l)))return;this.sources.set(e,s);const a={source:e,keys:s,time:i};let o=this.queue.length;for(;o>this.offset&&this.queue[o-1].time>i;)o--;this.queue.splice(o,0,a)}sample(e){const t=new Set;for(;this.offset<this.queue.length&&this.queue[this.offset].time<=e;){const s=this.queue[this.offset++],r=this.sampled.get(s.source)||new Set;for(const a of s.keys)r.has(a)||t.add(a);this.sampled.set(s.source,s.keys)}const i=new Set(t);for(const s of this.sampled.values())for(const r of s)i.add(r);return this.offset>128&&(this.queue.splice(0,this.offset),this.offset=0),i}}function rx(n){let e,t,i=!1,s=!1,r=!0,a=0,o=-1/0,l=1,c="auto",f,u,h,d=1,p=!0;const _=new sx,m=[new Rc,new Rc],v=new Map,S=new Set,T=new Map,E=[],b=N=>typeof requestAnimationFrame=="function"?requestAnimationFrame(N):setTimeout(()=>N(performance.now()),16);function y(N){const P=new Float32Array(N);if(P.fill(0),h&&!s){let k=0;for(;k<P.length/2;){let H=h.read(Math.min(2048,P.length/2-k));if(!H&&(!p||(h.seek(0),H=h.read(Math.min(2048,P.length/2-k)),!H)))break;P.set(new Float32Array(h.pcm.buffer,h.pcm.byteOffset,H*2),k*2),k+=H}if(d!==1)for(let H=0;H<P.length;H++)P[H]*=d}f==null||f.postMessage({buffer:N},[N])}function g(){var N,P,k;for(const H of e.drainEvents()){if(H.type==="playsnd")try{const B=e.characters.find($=>$.path===H.character),C=(N=B==null?void 0:B.checks.find($=>$.key==="sound"&&$.ok))==null?void 0:N.path;if(!C||H.common)continue;v.has(C)||v.set(C,gu(e.files[C]));const L=H.group??((P=H.value)==null?void 0:P[0]),V=H.number??((k=H.value)==null?void 0:k[1]);if(H.soundKey=C+":"+L+","+V,T.set(H.soundKey,{path:C,group:L,number:V}),!S.has(H.soundKey)){const $=v.get(C).get(L,V);if(!$)continue;H.bytes=$.slice(),S.add(H.soundKey)}}catch(B){e.issue("sound",B.message);continue}n({type:"sound",event:H},H.bytes?[H.bytes.buffer]:[])}}function x(N){if(!i)try{const P=performance.timeOrigin+N;if(_.advance(P,{running:!s},k=>{e.tick(m[0].sample(k),m[1].sample(k)),g()}),(!s||r)&&_.renderDue(N,60)){const k=performance.now(),H=e.frame();t.render(H,{width:Math.round(960*l),height:Math.round(540*l)});const B=performance.now()-k;if(r=!1,c==="auto"&&!H.assets.length&&!s&&(E.push(B),E.length>=30)){const C=E.reduce((L,V)=>L+V,0)/E.length;C>20?l=Math.max(.5,l-.05):C<9&&(l=Math.min(1,l+.05)),E.length=0}}N-o>=100&&(o=N,n({type:"state",state:{...e.snapshot(),paused:s,simulationDebt:_.debt},gpu:t.stats})),a=b(x)}catch(P){n({type:"error",message:P.message}),A()}}async function I({files:N,selection:P,canvas:k,sampleRate:H=48e3,quality:B="auto"}){var L;c=B,t||F(k),e=new Wf(N,P);const C=(L=e.match.stage)==null?void 0:L.definition.music;if(C!=null&&C.path&&N[C.path])if(/\.(mod|xm|it|s3m)$/i.test(C.path)){const{createModuleMusic:V}=await import("./module-music-C2Wy91BT.js");if(i)return;const $=await V();if(i){$.close();return}u=$,h=u.open(N[C.path],H),d=Math.max(0,Math.min(2,C.volume/100)),p=C.loop,n({type:"audio-init",sampleRate:H})}else{const V=N[C.path].slice();n({type:"music",bytes:V,path:C.path,volume:C.volume,loop:C.loop},[V.buffer])}i||(n({type:"ready",capabilities:e.capabilities}),a=b(x))}function R(N){var P,k;if(!i){if(N.type==="sound-request"){try{const H=T.get(N.key),B=H&&((k=(P=v.get(H.path))==null?void 0:P.get(H.group,H.number))==null?void 0:k.slice());if(!B)throw Error("Sound is unavailable.");n({type:"sound-data",key:N.key,bytes:B},[B.buffer])}catch(H){n({type:"sound-data",key:N.key,error:H.message})}return}N.type==="input"&&Array.isArray(N.keys)&&m[N.side===1?1:0].record(N.source||"keyboard",N.keys,N.time??performance.timeOrigin+performance.now()),N.type==="pause"&&(s=!!N.value,m.forEach(H=>H.reset()),_.suspend(),r=!0),N.type==="quality"&&(c=N.value,l=1,E.length=0,r=!0),N.type==="audio-port"&&(f=N.port,f.onmessage=({data:H})=>{!i&&H.buffer instanceof ArrayBuffer&&H.buffer.byteLength===8192&&y(H.buffer)},f.start()),N.type==="stop"&&A()}}function A(){i||(i=!0,typeof cancelAnimationFrame=="function"?cancelAnimationFrame(a):clearTimeout(a),f==null||f.close(),u==null||u.close(),e==null||e.close(),t==null||t.close(),f=u=h=e=t=null,v.clear(),S.clear(),T.clear(),m.forEach(N=>N.reset()))}function F(N){if(i)throw Error("Match cancelled.");t||(t=new nx(N))}return{start:I,prepare:F,control:R,stop:A,snapshot:()=>e==null?void 0:e.snapshot(),get gpu(){return t==null?void 0:t.stats}}}const lr=rx((n,e=[])=>self.postMessage(n,e));self.onmessage=({data:n})=>{if(n.type==="prepare"){try{lr.prepare(n.canvas),self.postMessage({type:"renderer-ready"})}catch(e){lr.stop(),self.postMessage({type:"renderer-unavailable",message:e.message})}return}n.type==="start"?lr.start(n).catch(e=>self.postMessage({type:"error",message:e.message})):lr.control(n)};
