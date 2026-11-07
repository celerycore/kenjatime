function Zl(n={},{onOutput:e=()=>{},maxBytes:t=512*1024*1024}={}){const i=new Map,r=new Map;let s=3,a=0,o="/",u="";const l=(x,c="")=>Object.assign(Error(`${x}: ${c}`),{code:x});function m(x){const c=[];for(const S of String(x).replaceAll("\\","/").normalize("NFC").split("/"))if(!(!S||S==="."))if(S===".."){if(!c.length)throw l("EACCES",x);c.pop()}else{if(S.includes("\0"))throw l("EINVAL",x);c.push(S)}return"/"+c.join("/").toLowerCase()}function h(x){return m(String(x).startsWith("/")?x:o+"/"+x)}function d(x){i.has(x)||(x!=="/"&&d(x.slice(0,x.lastIndexOf("/"))||"/"),i.set(x,{dir:!0,children:new Set,ino:i.size+1}),x!=="/"&&i.get(x.slice(0,x.lastIndexOf("/"))||"/").children.add(x.slice(x.lastIndexOf("/")+1)))}d("/");function g(x,c){const S=i.get(x);if(S!=null&&S.dir)throw l("EISDIR",x);const y=a-((S==null?void 0:S.data.length)||0)+c.length;if(y>t)throw l("ENOSPC",x);d(x.slice(0,x.lastIndexOf("/"))||"/"),i.set(x,{data:c,dir:!1,ino:(S==null?void 0:S.ino)||i.size+1}),i.get(x.slice(0,x.lastIndexOf("/"))||"/").children.add(x.slice(x.lastIndexOf("/")+1)),a=y}for(const[x,c]of Object.entries(n))g(h(x),c instanceof Uint8Array?c:new Uint8Array(c));const _=x=>{const c=i.get(x);if(!c)throw l("ENOENT",x);return c},T=x=>{const c=r.get(x);if(!c)throw l("EBADF",String(x));return c},f=x=>{var c,S;return{dev:1,ino:x.ino,mode:(x.dir?16384:32768)|(x.dir?493:420),nlink:1,uid:0,gid:0,rdev:0,size:((c=x.data)==null?void 0:c.length)||0,blksize:4096,blocks:Math.ceil((((S=x.data)==null?void 0:S.length)||0)/512),atimeMs:0,mtimeMs:0,ctimeMs:0,isDirectory:()=>x.dir,isFile:()=>!x.dir,isSymbolicLink:()=>!1}},p={O_RDONLY:0,O_WRONLY:1,O_RDWR:2,O_CREAT:64,O_EXCL:128,O_TRUNC:512,O_APPEND:1024},E=x=>(...c)=>{const S=c.pop();let y;try{y=x(...c)}catch(P){S(P);return}S(null,y)};function w(x){u+=new TextDecoder().decode(x);let c;for(;(c=u.indexOf(`
`))>=0;)e(u.slice(0,c)),u=u.slice(c+1)}const A={constants:p,open:E((x,c)=>{var L;const S=h(x);let y=i.get(S);if(c&64&&y&&c&128)throw l("EEXIST",S);if(!y){if(!(c&64))throw l("ENOENT",S);g(S,new Uint8Array),y=_(S)}c&512&&(g(S,new Uint8Array),y=_(S));const P=s++;return r.set(P,{path:S,pos:c&1024&&((L=y.data)==null?void 0:L.length)||0}),P}),close:E(x=>{T(x),r.delete(x)}),stat:E(x=>f(_(h(x)))),lstat:E(x=>f(_(h(x)))),fstat:E(x=>f(_(T(x).path))),readdir:E(x=>{const c=_(h(x));if(!c.dir)throw l("ENOTDIR",x);return[...c.children].sort()}),read:E((x,c,S,y,P)=>{const L=T(x),U=_(L.path);if(U.dir)throw l("EISDIR",L.path);const O=P===null?L.pos:P,I=Math.max(0,Math.min(y,U.data.length-O));return c.set(U.data.subarray(O,O+I),S),P===null&&(L.pos+=I),I}),write:E((x,c,S,y,P)=>{if(x===1||x===2)return w(c.subarray(S,S+y)),y;const L=T(x),U=_(L.path),O=P===null?L.pos:P;if(O<0||O+y>t)throw l("ENOSPC",L.path);if(O+y>U.data.length){const I=new Uint8Array(O+y);I.set(U.data),g(L.path,I)}return _(L.path).data.set(c.subarray(S,S+y),O),P===null&&(L.pos=O+y),y}),writeSync(x,c){return w(c),c.length},mkdir:E(x=>{const c=h(x);if(i.has(c))throw l("EEXIST",c);if(!_(c.slice(0,c.lastIndexOf("/"))||"/").dir)throw l("ENOTDIR",x);d(c)}),unlink:E(x=>{const c=h(x),S=_(c);if(S.dir)throw l("EISDIR",c);a-=S.data.length,i.delete(c),i.get(c.slice(0,c.lastIndexOf("/"))||"/").children.delete(c.slice(c.lastIndexOf("/")+1))}),rmdir:E(x=>{const c=h(x),S=_(c);if(!S.dir)throw l("ENOTDIR",c);if(S.children.size)throw l("ENOTEMPTY",c);i.delete(c),i.get(c.slice(0,c.lastIndexOf("/"))||"/").children.delete(c.slice(c.lastIndexOf("/")+1))}),rename:E((x,c)=>{const S=h(x),y=h(c),P=_(S);if(P.dir)throw l("ENOSYS",S);g(y,P.data),a-=P.data.length,i.delete(S),i.get(S.slice(0,S.lastIndexOf("/"))||"/").children.delete(S.slice(S.lastIndexOf("/")+1))})};for(const x of["chmod","fchmod","chown","fchown","lchown","utimes","fsync"])A[x]=E(()=>{});A.truncate=E((x,c)=>{const S=h(x),y=_(S);if(c<0||c>t)throw l("ENOSPC",S);const P=new Uint8Array(c);P.set(y.data.subarray(0,c)),g(S,P)}),A.ftruncate=(x,c,S)=>A.truncate(T(x).path,c,S);for(const x of["readlink","link","symlink"])A[x]=E(()=>{throw l("ENOSYS",x)});return{fs:A,process:{pid:1,ppid:0,getuid:()=>0,getgid:()=>0,geteuid:()=>0,getegid:()=>0,getgroups:()=>[],umask:()=>0,cwd:()=>o,chdir:x=>{const c=h(x);if(!_(c).dir)throw l("ENOTDIR",c);o=c}},readFile:x=>_(h(x)).data,paths:()=>[...i.keys()],get bytes(){return a}}}var zt=Uint8Array,li=Uint16Array,$l=Int32Array,Oo=new zt([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Bo=new zt([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Jl=new zt([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),zo=function(n,e){for(var t=new li(31),i=0;i<31;++i)t[i]=e+=1<<n[i-1];for(var r=new $l(t[30]),i=1;i<30;++i)for(var s=t[i];s<t[i+1];++s)r[s]=s-t[i]<<5|i;return{b:t,r}},Go=zo(Oo,2),Ho=Go.b,Ql=Go.r;Ho[28]=258,Ql[258]=28;var jl=zo(Bo,0),ec=jl.b,Ts=new li(32768);for(var ut=0;ut<32768;++ut){var En=(ut&43690)>>1|(ut&21845)<<1;En=(En&52428)>>2|(En&13107)<<2,En=(En&61680)>>4|(En&3855)<<4,Ts[ut]=((En&65280)>>8|(En&255)<<8)>>1}var Ri=(function(n,e,t){for(var i=n.length,r=0,s=new li(e);r<i;++r)n[r]&&++s[n[r]-1];var a=new li(e);for(r=1;r<e;++r)a[r]=a[r-1]+s[r-1]<<1;var o;if(t){o=new li(1<<e);var u=15-e;for(r=0;r<i;++r)if(n[r])for(var l=r<<4|n[r],m=e-n[r],h=a[n[r]-1]++<<m,d=h|(1<<m)-1;h<=d;++h)o[Ts[h]>>u]=l}else for(o=new li(i),r=0;r<i;++r)n[r]&&(o[r]=Ts[a[n[r]-1]++]>>15-n[r]);return o}),Di=new zt(288);for(var ut=0;ut<144;++ut)Di[ut]=8;for(var ut=144;ut<256;++ut)Di[ut]=9;for(var ut=256;ut<280;++ut)Di[ut]=7;for(var ut=280;ut<288;++ut)Di[ut]=8;var Vo=new zt(32);for(var ut=0;ut<32;++ut)Vo[ut]=5;var tc=Ri(Di,9,1),nc=Ri(Vo,5,1),qr=function(n){for(var e=n[0],t=1;t<n.length;++t)n[t]>e&&(e=n[t]);return e},Xt=function(n,e,t){var i=e/8|0;return(n[i]|n[i+1]<<8)>>(e&7)&t},Yr=function(n,e){var t=e/8|0;return(n[t]|n[t+1]<<8|n[t+2]<<16)>>(e&7)},ic=function(n){return(n+7)/8|0},rc=function(n,e,t){return(t==null||t>n.length)&&(t=n.length),new zt(n.subarray(e,t))},sc=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],Zt=function(n,e,t){var i=new Error(e||sc[n]);if(i.code=n,Error.captureStackTrace&&Error.captureStackTrace(i,Zt),!t)throw i;return i},ac=function(n,e,t,i){var r=n.length,s=0;if(!r||e.f&&!e.l)return t||new zt(0);var a=!t,o=a||e.i!=2,u=e.i;a&&(t=new zt(r*3));var l=function(B){var J=t.length;if(B>J){var se=new zt(Math.max(J*2,B));se.set(t),t=se}},m=e.f||0,h=e.p||0,d=e.b||0,g=e.l,_=e.d,T=e.m,f=e.n,p=r*8;do{if(!g){m=Xt(n,h,1);var E=Xt(n,h+1,3);if(h+=3,E)if(E==1)g=tc,_=nc,T=9,f=5;else if(E==2){var x=Xt(n,h,31)+257,c=Xt(n,h+10,15)+4,S=x+Xt(n,h+5,31)+1;h+=14;for(var y=new zt(S),P=new zt(19),L=0;L<c;++L)P[Jl[L]]=Xt(n,h+L*3,7);h+=c*3;for(var U=qr(P),O=(1<<U)-1,I=Ri(P,U,1),L=0;L<S;){var k=I[Xt(n,h,O)];h+=k&15;var w=k>>4;if(w<16)y[L++]=w;else{var Y=0,z=0;for(w==16?(z=3+Xt(n,h,3),h+=2,Y=y[L-1]):w==17?(z=3+Xt(n,h,7),h+=3):w==18&&(z=11+Xt(n,h,127),h+=7);z--;)y[L++]=Y}}var ne=y.subarray(0,x),q=y.subarray(x);T=qr(ne),f=qr(q),g=Ri(ne,T,1),_=Ri(q,f,1)}else Zt(1);else{var w=ic(h)+4,A=n[w-4]|n[w-3]<<8,R=w+A;if(R>r){u&&Zt(0);break}o&&l(d+A),t.set(n.subarray(w,R),d),e.b=d+=A,e.p=h=R*8,e.f=m;continue}if(h>p){u&&Zt(0);break}}o&&l(d+131072);for(var te=(1<<T)-1,ie=(1<<f)-1,Ae=h;;Ae=h){var Y=g[Yr(n,h)&te],Te=Y>>4;if(h+=Y&15,h>p){u&&Zt(0);break}if(Y||Zt(2),Te<256)t[d++]=Te;else if(Te==256){Ae=h,g=null;break}else{var Z=Te-254;if(Te>264){var L=Te-257,he=Oo[L];Z=Xt(n,h,(1<<he)-1)+Ho[L],h+=he}var ye=_[Yr(n,h)&ie],Pe=ye>>4;ye||Zt(3),h+=ye&15;var q=ec[Pe];if(Pe>3){var he=Bo[Pe];q+=Yr(n,h)&(1<<he)-1,h+=he}if(h>p){u&&Zt(0);break}o&&l(d+131072);var _e=d+Z;if(d<q){var Oe=s-q,C=Math.min(q,_e);for(Oe+d<0&&Zt(3);d<C;++d)t[d]=i[Oe+d]}for(;d<_e;++d)t[d]=t[d-q]}}e.l=g,e.p=Ae,e.b=d,e.f=m,g&&(m=1,e.m=T,e.d=_,e.n=f)}while(!m);return d!=t.length&&a?rc(t,0,d):t.subarray(0,d)},oc=new zt(0),lc=function(n){(n[0]!=31||n[1]!=139||n[2]!=8)&&Zt(6,"invalid gzip data");var e=n[3],t=10;e&4&&(t+=(n[10]|n[11]<<8)+2);for(var i=(e>>3&1)+(e>>4&1);i>0;i-=!n[t++]);return t+(e&2)},cc=function(n){var e=n.length;return(n[e-4]|n[e-3]<<8|n[e-2]<<16|n[e-1]<<24)>>>0};function uc(n,e){var t=lc(n);return t+8>n.length&&Zt(6,"invalid gzip data"),ac(n.subarray(t,-8),{i:2},new zt(cc(n)),e)}var fc=typeof TextDecoder<"u"&&new TextDecoder,dc=0;try{fc.decode(oc,{stream:!0}),dc=1}catch{}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Br="187",hc=0,Oa=1,pc=2,hr=1,mc=2,Ai=3,Dn=0,Ft=1,rn=2,Xn=0,wi=1,Ba=2,za=3,Ga=4,ko=5,Wn=100,Wo=101,Xo=102,gc=103,_c=104,qo=200,Yo=201,Ko=202,Zo=203,oa=204,la=205,$o=206,Jo=207,Qo=208,jo=209,el=210,xc=211,vc=212,Sc=213,Mc=214,Sr=0,Mr=1,Er=2,ui=3,Tr=4,yr=5,Ar=6,br=7,tl=0,Ec=1,Tc=2,on=0,nl=1,il=2,rl=3,sl=4,al=5,ol=6,ll=7,cl=300,fi=301,Ci=302,Kr=303,Zr=304,ys=1e3,_n=1001,As=1002,yt=1003,yc=1004,Gi=1005,Ut=1006,$r=1007,Pn=1008,Vt=1009,ul=1010,fl=1011,Pi=1012,ca=1013,ln=1014,sn=1015,cn=1016,ua=1017,fa=1018,di=1020,dl=35902,hl=35899,pl=1021,ml=1022,an=1023,In=1026,Ln=1027,gl=1028,da=1029,qn=1030,ha=1031,pa=1033,pr=33776,mr=33777,gr=33778,_r=33779,bs=35840,Rs=35841,ws=35842,Cs=35843,Ps=36196,Ls=37492,Ds=37496,Is=37488,Ns=37489,Rr=37490,Us=37491,Fs=37808,Os=37809,Bs=37810,zs=37811,Gs=37812,Hs=37813,Vs=37814,ks=37815,Ws=37816,Xs=37817,qs=37818,Ys=37819,Ks=37820,Zs=37821,$s=36492,Js=36494,Qs=36495,js=36283,ea=36284,wr=36285,ta=36286,Ac=3200,Ha=0,bc=1,Cn="",Ht="srgb",Li="srgb-linear",Cr="linear",st="srgb",Jr=7680,Rc=519,wc=512,Cc=513,Pc=514,_l=515,Lc=516,Dc=517,xl=518,vl=519,Ic=35044,na="300 es",Jt=2e3,Pr=2001;function Nc(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Lr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Uc(){const n=Lr("canvas");return n.style.display="block",n}const Va={};function Dr(...n){const e="THREE."+n.shift();console.log(e,...n)}function Sl(n){const e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function ze(...n){n=Sl(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function nt(...n){n=Sl(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function xr(...n){const e=n.join(" ");e in Va||(Va[e]=!0,ze(...n))}function Fc(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}const Oc={[Sr]:Sr,[Er]:Ar,[Tr]:Tr,[ui]:yr,[Mr]:Mr,[Ar]:Er,[br]:br,[yr]:ui};class Zn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const r=i[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const Rt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Qr=Math.PI/180,ia=180/Math.PI;function Ii(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Rt[n&255]+Rt[n>>8&255]+Rt[n>>16&255]+Rt[n>>24&255]+"-"+Rt[e&255]+Rt[e>>8&255]+"-"+Rt[e>>16&15|64]+Rt[e>>24&255]+"-"+Rt[t&63|128]+Rt[t>>8&255]+"-"+Rt[t>>16&255]+Rt[t>>24&255]+Rt[i&255]+Rt[i>>8&255]+Rt[i>>16&255]+Rt[i>>24&255]).toLowerCase()}function Qe(n,e,t){return Math.max(e,Math.min(t,n))}function Bc(n,e){return(n%e+e)%e}function jr(n,e,t){return(1-t)*n+t*e}function zc(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function zr(n){switch(n.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function Ml(n,e){if(e.constructor===Float32Array)return n;const t=zr(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(n/t,-1)}function El(n,e){if(e.constructor===Float32Array)return n;const t=zr(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(n*t)}const Ea=class Ea{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Qe(this.x,e.x,t.x),this.y=Qe(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Qe(this.x,e,t),this.y=Qe(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Qe(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Qe(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*r+e.x,this.y=s*r+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Ea.prototype.isVector2=!0;let it=Ea;class pi{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,a,o){let u=i[r+0],l=i[r+1],m=i[r+2],h=i[r+3],d=s[a+0],g=s[a+1],_=s[a+2],T=s[a+3];if(h!==T||u!==d||l!==g||m!==_){let f=u*d+l*g+m*_+h*T;f<0&&(d=-d,g=-g,_=-_,T=-T,f=-f);let p=1-o;if(f<.9995){const E=Math.acos(f),w=Math.sin(E);p=Math.sin(p*E)/w,o=Math.sin(o*E)/w,u=u*p+d*o,l=l*p+g*o,m=m*p+_*o,h=h*p+T*o}else{u=u*p+d*o,l=l*p+g*o,m=m*p+_*o,h=h*p+T*o;const E=1/Math.sqrt(u*u+l*l+m*m+h*h);u*=E,l*=E,m*=E,h*=E}}e[t]=u,e[t+1]=l,e[t+2]=m,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,r,s,a){const o=i[r],u=i[r+1],l=i[r+2],m=i[r+3],h=s[a],d=s[a+1],g=s[a+2],_=s[a+3];return e[t]=o*_+m*h+u*g-l*d,e[t+1]=u*_+m*d+l*h-o*g,e[t+2]=l*_+m*g+o*d-u*h,e[t+3]=m*_-o*h-u*d-l*g,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,u=Math.sin,l=o(i/2),m=o(r/2),h=o(s/2),d=u(i/2),g=u(r/2),_=u(s/2);switch(a){case"XYZ":this._x=d*m*h+l*g*_,this._y=l*g*h-d*m*_,this._z=l*m*_+d*g*h,this._w=l*m*h-d*g*_;break;case"YXZ":this._x=d*m*h+l*g*_,this._y=l*g*h-d*m*_,this._z=l*m*_-d*g*h,this._w=l*m*h+d*g*_;break;case"ZXY":this._x=d*m*h-l*g*_,this._y=l*g*h+d*m*_,this._z=l*m*_+d*g*h,this._w=l*m*h-d*g*_;break;case"ZYX":this._x=d*m*h-l*g*_,this._y=l*g*h+d*m*_,this._z=l*m*_-d*g*h,this._w=l*m*h+d*g*_;break;case"YZX":this._x=d*m*h+l*g*_,this._y=l*g*h+d*m*_,this._z=l*m*_-d*g*h,this._w=l*m*h-d*g*_;break;case"XZY":this._x=d*m*h-l*g*_,this._y=l*g*h-d*m*_,this._z=l*m*_+d*g*h,this._w=l*m*h+d*g*_;break;default:ze("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],a=t[1],o=t[5],u=t[9],l=t[2],m=t[6],h=t[10],d=i+o+h;if(d>0){const g=.5/Math.sqrt(d+1);this._w=.25/g,this._x=(m-u)*g,this._y=(s-l)*g,this._z=(a-r)*g}else if(i>o&&i>h){const g=2*Math.sqrt(1+i-o-h);this._w=(m-u)/g,this._x=.25*g,this._y=(r+a)/g,this._z=(s+l)/g}else if(o>h){const g=2*Math.sqrt(1+o-i-h);this._w=(s-l)/g,this._x=(r+a)/g,this._y=.25*g,this._z=(u+m)/g}else{const g=2*Math.sqrt(1+h-i-o);this._w=(a-r)/g,this._x=(s+l)/g,this._y=(u+m)/g,this._z=.25*g}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Qe(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,a=e._w,o=t._x,u=t._y,l=t._z,m=t._w;return this._x=i*m+a*o+r*l-s*u,this._y=r*m+a*u+s*o-i*l,this._z=s*m+a*l+i*u-r*o,this._w=a*m-i*o-r*u-s*l,this._onChangeCallback(),this}slerp(e,t){let i=e._x,r=e._y,s=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,r=-r,s=-s,a=-a,o=-o);let u=1-t;if(o<.9995){const l=Math.acos(o),m=Math.sin(l);u=Math.sin(u*l)/m,t=Math.sin(t*l)/m,this._x=this._x*u+i*t,this._y=this._y*u+r*t,this._z=this._z*u+s*t,this._w=this._w*u+a*t,this._onChangeCallback()}else this._x=this._x*u+i*t,this._y=this._y*u+r*t,this._z=this._z*u+s*t,this._w=this._w*u+a*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Ta=class Ta{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ka.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ka.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,a=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*a,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*a,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,a=e.y,o=e.z,u=e.w,l=2*(a*r-o*i),m=2*(o*t-s*r),h=2*(s*i-a*t);return this.x=t+u*l+a*h-o*m,this.y=i+u*m+o*l-s*h,this.z=r+u*h+s*m-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Qe(this.x,e.x,t.x),this.y=Qe(this.y,e.y,t.y),this.z=Qe(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Qe(this.x,e,t),this.y=Qe(this.y,e,t),this.z=Qe(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Qe(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,a=t.x,o=t.y,u=t.z;return this.x=r*u-s*o,this.y=s*a-i*u,this.z=i*o-r*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return es.copy(this).projectOnVector(e),this.sub(es)}reflect(e){return this.sub(es.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Qe(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Ta.prototype.isVector3=!0;let W=Ta;const es=new W,ka=new pi,ya=class ya{constructor(e,t,i,r,s,a,o,u,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,a,o,u,l)}set(e,t,i,r,s,a,o,u,l){const m=this.elements;return m[0]=e,m[1]=r,m[2]=o,m[3]=t,m[4]=s,m[5]=u,m[6]=i,m[7]=a,m[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,a=i[0],o=i[3],u=i[6],l=i[1],m=i[4],h=i[7],d=i[2],g=i[5],_=i[8],T=r[0],f=r[3],p=r[6],E=r[1],w=r[4],A=r[7],R=r[2],x=r[5],c=r[8];return s[0]=a*T+o*E+u*R,s[3]=a*f+o*w+u*x,s[6]=a*p+o*A+u*c,s[1]=l*T+m*E+h*R,s[4]=l*f+m*w+h*x,s[7]=l*p+m*A+h*c,s[2]=d*T+g*E+_*R,s[5]=d*f+g*w+_*x,s[8]=d*p+g*A+_*c,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],u=e[6],l=e[7],m=e[8];return t*a*m-t*o*l-i*s*m+i*o*u+r*s*l-r*a*u}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],u=e[6],l=e[7],m=e[8],h=m*a-o*l,d=o*u-m*s,g=l*s-a*u,_=t*h+i*d+r*g;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const T=1/_;return e[0]=h*T,e[1]=(r*l-m*i)*T,e[2]=(o*i-r*a)*T,e[3]=d*T,e[4]=(m*t-r*u)*T,e[5]=(r*s-o*t)*T,e[6]=g*T,e[7]=(i*u-l*t)*T,e[8]=(a*t-i*s)*T,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,a,o){const u=Math.cos(s),l=Math.sin(s);return this.set(i*u,i*l,-i*(u*a+l*o)+a+e,-r*l,r*u,-r*(-l*a+u*o)+o+t,0,0,1),this}scale(e,t){return xr("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(ts.makeScale(e,t)),this}rotate(e){return xr("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(ts.makeRotation(-e)),this}translate(e,t){return xr("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(ts.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};ya.prototype.isMatrix3=!0;let He=ya;const ts=new He,Wa=new He().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Xa=new He().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Gc(){const n={enabled:!0,workingColorSpace:Li,spaces:{},convert:function(r,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===st&&(r.r=xn(r.r),r.g=xn(r.g),r.b=xn(r.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===st&&(r.r=ci(r.r),r.g=ci(r.g),r.b=ci(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Cn?Cr:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,a){return r.copy(this.spaces[a].fromXYZ).multiply(this.spaces[s].toXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Li]:{primaries:e,whitePoint:i,transfer:Cr,toXYZ:Wa,fromXYZ:Xa,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Ht},outputColorSpaceConfig:{drawingBufferColorSpace:Ht}},[Ht]:{primaries:e,whitePoint:i,transfer:st,toXYZ:Wa,fromXYZ:Xa,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Ht}}}),n}const Je=Gc();function xn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function ci(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let $n;class Hc{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{$n===void 0&&($n=Lr("canvas")),$n.width=e.width,$n.height=e.height;const r=$n.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=$n}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Lr("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=xn(s[a]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(xn(t[i]/255)*255):t[i]=xn(t[i]);return{data:t,width:e.width,height:e.height}}else return ze("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Vc=0;class ma{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Vc++}),this.uuid=Ii(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width||0,t.height||0,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(ns(r[a].image)):s.push(ns(r[a]))}else s=ns(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function ns(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Hc.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(ze("Texture: Unable to serialize Texture."),{})}let kc=0;const is=new W;class It extends Zn{constructor(e=It.DEFAULT_IMAGE,t=It.DEFAULT_MAPPING,i=_n,r=_n,s=Ut,a=Pn,o=an,u=Vt,l=It.DEFAULT_ANISOTROPY,m=Cn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:kc++}),this.uuid=Ii(),this.name="",this.source=new ma(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=u,this.offset=new it(0,0),this.repeat=new it(1,1),this.center=new it(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new He,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=m,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(is).x}get height(){return this.source.getSize(is).y}get depth(){return this.source.getSize(is).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){ze(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){ze(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==cl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case ys:e.x=e.x-Math.floor(e.x);break;case _n:e.x=e.x<0?0:1;break;case As:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case ys:e.y=e.y-Math.floor(e.y);break;case _n:e.y=e.y<0?0:1;break;case As:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}It.DEFAULT_IMAGE=null;It.DEFAULT_MAPPING=cl;It.DEFAULT_ANISOTROPY=1;const Aa=class Aa{constructor(e=0,t=0,i=0,r=1){this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*r+a[12]*s,this.y=a[1]*t+a[5]*i+a[9]*r+a[13]*s,this.z=a[2]*t+a[6]*i+a[10]*r+a[14]*s,this.w=a[3]*t+a[7]*i+a[11]*r+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const u=e.elements,l=u[0],m=u[4],h=u[8],d=u[1],g=u[5],_=u[9],T=u[2],f=u[6],p=u[10];if(Math.abs(m-d)<.01&&Math.abs(h-T)<.01&&Math.abs(_-f)<.01){if(Math.abs(m+d)<.1&&Math.abs(h+T)<.1&&Math.abs(_+f)<.1&&Math.abs(l+g+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const w=(l+1)/2,A=(g+1)/2,R=(p+1)/2,x=(m+d)/4,c=(h+T)/4,S=(_+f)/4;return w>A&&w>R?w<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(w),r=x/i,s=c/i):A>R?A<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(A),i=x/r,s=S/r):R<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(R),i=c/s,r=S/s),this.set(i,r,s,t),this}let E=Math.sqrt((f-_)*(f-_)+(h-T)*(h-T)+(d-m)*(d-m));return Math.abs(E)<.001&&(E=1),this.x=(f-_)/E,this.y=(h-T)/E,this.z=(d-m)/E,this.w=Math.acos((l+g+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Qe(this.x,e.x,t.x),this.y=Qe(this.y,e.y,t.y),this.z=Qe(this.z,e.z,t.z),this.w=Qe(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Qe(this.x,e,t),this.y=Qe(this.y,e,t),this.z=Qe(this.z,e,t),this.w=Qe(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Qe(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Aa.prototype.isVector4=!0;let pt=Aa;class Wc extends Zn{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ut,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new pt(0,0,e,t),this.scissorTest=!1,this.viewport=new pt(0,0,e,t),this.textures=[];const r=i.count;for(let s=0;s<r;s++)this.textures[s]=new It({width:e,height:t,depth:i.depth}),this.textures[s].isRenderTargetTexture=!0,this.textures[s].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:Ut,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const r=Object.assign({},e.textures[t].image);this.textures[t].source=new ma(r)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class kt extends Wc{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Tl extends It{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=yt,this.minFilter=yt,this.wrapR=_n,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class yl extends It{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=yt,this.minFilter=yt,this.wrapR=_n,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}const Or=class Or{constructor(e,t,i,r,s,a,o,u,l,m,h,d,g,_,T,f){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,a,o,u,l,m,h,d,g,_,T,f)}set(e,t,i,r,s,a,o,u,l,m,h,d,g,_,T,f){const p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=r,p[1]=s,p[5]=a,p[9]=o,p[13]=u,p[2]=l,p[6]=m,p[10]=h,p[14]=d,p[3]=g,p[7]=_,p[11]=T,p[15]=f,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Or().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,i=e.elements,r=1/Jn.setFromMatrixColumn(e,0).length(),s=1/Jn.setFromMatrixColumn(e,1).length(),a=1/Jn.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),u=Math.cos(r),l=Math.sin(r),m=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){const d=a*m,g=a*h,_=o*m,T=o*h;t[0]=u*m,t[4]=-u*h,t[8]=l,t[1]=g+_*l,t[5]=d-T*l,t[9]=-o*u,t[2]=T-d*l,t[6]=_+g*l,t[10]=a*u}else if(e.order==="YXZ"){const d=u*m,g=u*h,_=l*m,T=l*h;t[0]=d+T*o,t[4]=_*o-g,t[8]=a*l,t[1]=a*h,t[5]=a*m,t[9]=-o,t[2]=g*o-_,t[6]=T+d*o,t[10]=a*u}else if(e.order==="ZXY"){const d=u*m,g=u*h,_=l*m,T=l*h;t[0]=d-T*o,t[4]=-a*h,t[8]=_+g*o,t[1]=g+_*o,t[5]=a*m,t[9]=T-d*o,t[2]=-a*l,t[6]=o,t[10]=a*u}else if(e.order==="ZYX"){const d=a*m,g=a*h,_=o*m,T=o*h;t[0]=u*m,t[4]=_*l-g,t[8]=d*l+T,t[1]=u*h,t[5]=T*l+d,t[9]=g*l-_,t[2]=-l,t[6]=o*u,t[10]=a*u}else if(e.order==="YZX"){const d=a*u,g=a*l,_=o*u,T=o*l;t[0]=u*m,t[4]=T-d*h,t[8]=_*h+g,t[1]=h,t[5]=a*m,t[9]=-o*m,t[2]=-l*m,t[6]=g*h+_,t[10]=d-T*h}else if(e.order==="XZY"){const d=a*u,g=a*l,_=o*u,T=o*l;t[0]=u*m,t[4]=-h,t[8]=l*m,t[1]=d*h+T,t[5]=a*m,t[9]=g*h-_,t[2]=_*h-g,t[6]=o*m,t[10]=T*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Xc,e,qc)}lookAt(e,t,i){const r=this.elements;return Ot.subVectors(e,t),Ot.lengthSq()===0&&(Ot.z=1),Ot.normalize(),Tn.crossVectors(i,Ot),Tn.lengthSq()===0&&(Math.abs(i.z)===1?Ot.x+=1e-4:Ot.z+=1e-4,Ot.normalize(),Tn.crossVectors(i,Ot)),Tn.normalize(),Hi.crossVectors(Ot,Tn),r[0]=Tn.x,r[4]=Hi.x,r[8]=Ot.x,r[1]=Tn.y,r[5]=Hi.y,r[9]=Ot.y,r[2]=Tn.z,r[6]=Hi.z,r[10]=Ot.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,a=i[0],o=i[4],u=i[8],l=i[12],m=i[1],h=i[5],d=i[9],g=i[13],_=i[2],T=i[6],f=i[10],p=i[14],E=i[3],w=i[7],A=i[11],R=i[15],x=r[0],c=r[4],S=r[8],y=r[12],P=r[1],L=r[5],U=r[9],O=r[13],I=r[2],k=r[6],Y=r[10],z=r[14],ne=r[3],q=r[7],te=r[11],ie=r[15];return s[0]=a*x+o*P+u*I+l*ne,s[4]=a*c+o*L+u*k+l*q,s[8]=a*S+o*U+u*Y+l*te,s[12]=a*y+o*O+u*z+l*ie,s[1]=m*x+h*P+d*I+g*ne,s[5]=m*c+h*L+d*k+g*q,s[9]=m*S+h*U+d*Y+g*te,s[13]=m*y+h*O+d*z+g*ie,s[2]=_*x+T*P+f*I+p*ne,s[6]=_*c+T*L+f*k+p*q,s[10]=_*S+T*U+f*Y+p*te,s[14]=_*y+T*O+f*z+p*ie,s[3]=E*x+w*P+A*I+R*ne,s[7]=E*c+w*L+A*k+R*q,s[11]=E*S+w*U+A*Y+R*te,s[15]=E*y+w*O+A*z+R*ie,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],a=e[1],o=e[5],u=e[9],l=e[13],m=e[2],h=e[6],d=e[10],g=e[14],_=e[3],T=e[7],f=e[11],p=e[15],E=u*g-l*d,w=o*g-l*h,A=o*d-u*h,R=a*g-l*m,x=a*d-u*m,c=a*h-o*m;return t*(T*E-f*w+p*A)-i*(_*E-f*R+p*x)+r*(_*w-T*R+p*c)-s*(_*A-T*x+f*c)}determinantAffine(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[1],a=e[5],o=e[9],u=e[2],l=e[6],m=e[10];return t*(a*m-o*l)-i*(s*m-o*u)+r*(s*l-a*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],u=e[6],l=e[7],m=e[8],h=e[9],d=e[10],g=e[11],_=e[12],T=e[13],f=e[14],p=e[15],E=t*o-i*a,w=t*u-r*a,A=t*l-s*a,R=i*u-r*o,x=i*l-s*o,c=r*l-s*u,S=m*T-h*_,y=m*f-d*_,P=m*p-g*_,L=h*f-d*T,U=h*p-g*T,O=d*p-g*f,I=E*O-w*U+A*L+R*P-x*y+c*S;if(I===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const k=1/I;return e[0]=(o*O-u*U+l*L)*k,e[1]=(r*U-i*O-s*L)*k,e[2]=(T*c-f*x+p*R)*k,e[3]=(d*x-h*c-g*R)*k,e[4]=(u*P-a*O-l*y)*k,e[5]=(t*O-r*P+s*y)*k,e[6]=(f*A-_*c-p*w)*k,e[7]=(m*c-d*A+g*w)*k,e[8]=(a*U-o*P+l*S)*k,e[9]=(i*P-t*U-s*S)*k,e[10]=(_*x-T*A+p*E)*k,e[11]=(h*A-m*x-g*E)*k,e[12]=(o*y-a*L-u*S)*k,e[13]=(t*L-i*y+r*S)*k,e[14]=(T*w-_*R-f*E)*k,e[15]=(m*R-h*w+d*E)*k,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,a=e.x,o=e.y,u=e.z,l=s*a,m=s*o;return this.set(l*a+i,l*o-r*u,l*u+r*o,0,l*o+r*u,m*o+i,m*u-r*a,0,l*u-r*o,m*u+r*a,s*u*u+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,a){return this.set(1,i,s,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,a=t._y,o=t._z,u=t._w,l=s+s,m=a+a,h=o+o,d=s*l,g=s*m,_=s*h,T=a*m,f=a*h,p=o*h,E=u*l,w=u*m,A=u*h,R=i.x,x=i.y,c=i.z;return r[0]=(1-(T+p))*R,r[1]=(g+A)*R,r[2]=(_-w)*R,r[3]=0,r[4]=(g-A)*x,r[5]=(1-(d+p))*x,r[6]=(f+E)*x,r[7]=0,r[8]=(_+w)*c,r[9]=(f-E)*c,r[10]=(1-(d+T))*c,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];const s=this.determinantAffine();if(s===0)return i.set(1,1,1),t.identity(),this;let a=Jn.set(r[0],r[1],r[2]).length();const o=Jn.set(r[4],r[5],r[6]).length(),u=Jn.set(r[8],r[9],r[10]).length();s<0&&(a=-a),qt.copy(this);const l=1/a,m=1/o,h=1/u;return qt.elements[0]*=l,qt.elements[1]*=l,qt.elements[2]*=l,qt.elements[4]*=m,qt.elements[5]*=m,qt.elements[6]*=m,qt.elements[8]*=h,qt.elements[9]*=h,qt.elements[10]*=h,t.setFromRotationMatrix(qt),i.x=a,i.y=o,i.z=u,this}makePerspective(e,t,i,r,s,a,o=Jt,u=!1){const l=this.elements,m=2*s/(t-e),h=2*s/(i-r),d=(t+e)/(t-e),g=(i+r)/(i-r);let _,T;if(u)_=s/(a-s),T=a*s/(a-s);else if(o===Jt)_=-(a+s)/(a-s),T=-2*a*s/(a-s);else if(o===Pr)_=-a/(a-s),T=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=m,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=g,l[13]=0,l[2]=0,l[6]=0,l[10]=_,l[14]=T,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,r,s,a,o=Jt,u=!1){const l=this.elements,m=2/(t-e),h=2/(i-r),d=-(t+e)/(t-e),g=-(i+r)/(i-r);let _,T;if(u)_=1/(a-s),T=a/(a-s);else if(o===Jt)_=-2/(a-s),T=-(a+s)/(a-s);else if(o===Pr)_=-1/(a-s),T=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=m,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=h,l[9]=0,l[13]=g,l[2]=0,l[6]=0,l[10]=_,l[14]=T,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};Or.prototype.isMatrix4=!0;let ht=Or;const Jn=new W,qt=new ht,Xc=new W(0,0,0),qc=new W(1,1,1),Tn=new W,Hi=new W,Ot=new W,qa=new ht,Ya=new pi;class Yn{constructor(e=0,t=0,i=0,r=Yn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],u=r[1],l=r[5],m=r[9],h=r[2],d=r[6],g=r[10];switch(t){case"XYZ":this._y=Math.asin(Qe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-m,g),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Qe(m,-1,1)),Math.abs(m)<.9999999?(this._y=Math.atan2(o,g),this._z=Math.atan2(u,l)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(Qe(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,g),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(u,s));break;case"ZYX":this._y=Math.asin(-Qe(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,g),this._z=Math.atan2(u,s)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Qe(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(-m,l),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(o,g));break;case"XZY":this._z=Math.asin(-Qe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-m,g),this._y=0);break;default:ze("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return qa.makeRotationFromQuaternion(e),this.setFromRotationMatrix(qa,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Ya.setFromEuler(this),this.setFromQuaternion(Ya,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Yn.DEFAULT_ORDER="XYZ";class Al{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Yc=0;const Ka=new W,Qn=new pi,dn=new ht,Vi=new W,xi=new W,Kc=new W,Zc=new pi,Za=new W(1,0,0),$a=new W(0,1,0),Ja=new W(0,0,1),Qa={type:"added"},$c={type:"removed"},jn={type:"childadded",child:null},rs={type:"childremoved",child:null};class Nt extends Zn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Yc++}),this.uuid=Ii(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Nt.DEFAULT_UP.clone();const e=new W,t=new Yn,i=new pi,r=new W(1,1,1);function s(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ht},normalMatrix:{value:new He}}),this.matrix=new ht,this.matrixWorld=new ht,this.matrixAutoUpdate=Nt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Nt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Al,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Qn.setFromAxisAngle(e,t),this.quaternion.multiply(Qn),this}rotateOnWorldAxis(e,t){return Qn.setFromAxisAngle(e,t),this.quaternion.premultiply(Qn),this}rotateX(e){return this.rotateOnAxis(Za,e)}rotateY(e){return this.rotateOnAxis($a,e)}rotateZ(e){return this.rotateOnAxis(Ja,e)}translateOnAxis(e,t){return Ka.copy(e).applyQuaternion(this.quaternion),this.position.add(Ka.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Za,e)}translateY(e){return this.translateOnAxis($a,e)}translateZ(e){return this.translateOnAxis(Ja,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(dn.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Vi.copy(e):Vi.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),xi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?dn.lookAt(xi,Vi,this.up):dn.lookAt(Vi,xi,this.up),this.quaternion.setFromRotationMatrix(dn),r&&(dn.extractRotation(r.matrixWorld),Qn.setFromRotationMatrix(dn),this.quaternion.premultiply(Qn.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(nt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Qa),jn.child=e,this.dispatchEvent(jn),jn.child=null):nt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent($c),rs.child=e,this.dispatchEvent(rs),rs.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),dn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),dn.multiply(e.parent.matrixWorld)),e.applyMatrix4(dn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Qa),jn.child=e,this.dispatchEvent(jn),jn.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(xi,e,Kc),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(xi,Zc,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,r=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*i-s[8]*r,s[13]+=i-s[1]*t-s[5]*i-s[9]*r,s[14]+=r-s[2]*t-s[6]*i-s[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){const r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){const s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].updateWorldMatrix(!1,!0,i)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(o=>({...o})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(o,u){return o[u.uuid]===void 0&&(o[u.uuid]=u.toJSON(e)),u.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const u=o.shapes;if(Array.isArray(u))for(let l=0,m=u.length;l<m;l++){const h=u[l];s(e.shapes,h)}else s(e.shapes,u)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let u=0,l=this.material.length;u<l;u++)o.push(s(e.materials,this.material[u]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const u=this.animations[o];r.animations.push(s(e.animations,u))}}if(t){const o=a(e.geometries),u=a(e.materials),l=a(e.textures),m=a(e.images),h=a(e.shapes),d=a(e.skeletons),g=a(e.animations),_=a(e.nodes);o.length>0&&(i.geometries=o),u.length>0&&(i.materials=u),l.length>0&&(i.textures=l),m.length>0&&(i.images=m),h.length>0&&(i.shapes=h),d.length>0&&(i.skeletons=d),g.length>0&&(i.animations=g),_.length>0&&(i.nodes=_)}return i.object=r,i;function a(o){const u=[];for(const l in o){const m=o[l];delete m.metadata,u.push(m)}return u}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}Nt.DEFAULT_UP=new W(0,1,0);Nt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Nt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class ki extends Nt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Jc={type:"move"};class ss{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ki,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ki,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new W,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new W),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ki,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new W,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new W,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,a=null;const o=this._targetRay,u=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const T of e.hand.values()){const f=t.getJointPose(T,i),p=this._getHandJoint(l,T);f!==null&&(p.matrix.fromArray(f.transform.matrix),p.matrix.decompose(p.position,p.quaternion,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=f.radius),p.visible=f!==null}const m=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],d=m.position.distanceTo(h.position),g=.02,_=.005;l.inputState.pinching&&d>g+_?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&d<=g-_&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else u!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(u.matrix.fromArray(s.transform.matrix),u.matrix.decompose(u.position,u.quaternion,u.scale),u.matrixWorldNeedsUpdate=!0,s.linearVelocity?(u.hasLinearVelocity=!0,u.linearVelocity.copy(s.linearVelocity)):u.hasLinearVelocity=!1,s.angularVelocity?(u.hasAngularVelocity=!0,u.angularVelocity.copy(s.angularVelocity)):u.hasAngularVelocity=!1,u.eventsEnabled&&u.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Jc)))}return o!==null&&(o.visible=r!==null),u!==null&&(u.visible=s!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new ki;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const bl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},yn={h:0,s:0,l:0},Wi={h:0,s:0,l:0};function as(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class et{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ht){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Je.colorSpaceToWorking(this,t),this}setRGB(e,t,i,r=Je.workingColorSpace){return this.r=e,this.g=t,this.b=i,Je.colorSpaceToWorking(this,r),this}setHSL(e,t,i,r=Je.workingColorSpace){if(e=Bc(e,1),t=Qe(t,0,1),i=Qe(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,a=2*i-s;this.r=as(a,s,e+1/3),this.g=as(a,s,e),this.b=as(a,s,e-1/3)}return Je.colorSpaceToWorking(this,r),this}setStyle(e,t=Ht){function i(s){s!==void 0&&parseFloat(s)<1&&ze("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseFloat(s[1]))/100,Math.min(100,parseFloat(s[2]))/100,Math.min(100,parseFloat(s[3]))/100,t);break;case"hsl":case"hsla":if(s=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:ze("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);ze("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ht){const i=bl[e.toLowerCase()];return i!==void 0?this.setHex(i,t):ze("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=xn(e.r),this.g=xn(e.g),this.b=xn(e.b),this}copyLinearToSRGB(e){return this.r=ci(e.r),this.g=ci(e.g),this.b=ci(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ht){return Je.workingToColorSpace(wt.copy(this),e),Math.round(Qe(wt.r*255,0,255))*65536+Math.round(Qe(wt.g*255,0,255))*256+Math.round(Qe(wt.b*255,0,255))}getHexString(e=Ht){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Je.workingColorSpace){Je.workingToColorSpace(wt.copy(this),t);const i=wt.r,r=wt.g,s=wt.b,a=Math.max(i,r,s),o=Math.min(i,r,s);let u,l;const m=(o+a)/2;if(o===a)u=0,l=0;else{const h=a-o;switch(l=m<=.5?h/(a+o):h/(2-a-o),a){case i:u=(r-s)/h+(r<s?6:0);break;case r:u=(s-i)/h+2;break;case s:u=(i-r)/h+4;break}u/=6}return e.h=u,e.s=l,e.l=m,e}getRGB(e,t=Je.workingColorSpace){return Je.workingToColorSpace(wt.copy(this),t),e.r=wt.r,e.g=wt.g,e.b=wt.b,e}getStyle(e=Ht){Je.workingToColorSpace(wt.copy(this),e);const t=wt.r,i=wt.g,r=wt.b;return e!==Ht?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(yn),this.setHSL(yn.h+e,yn.s+t,yn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(yn),e.getHSL(Wi);const i=jr(yn.h,Wi.h,t),r=jr(yn.s,Wi.s,t),s=jr(yn.l,Wi.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const wt=new et;et.NAMES=bl;class Qc extends Nt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Yn,this.environmentIntensity=1,this.environmentRotation=new Yn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background!==null?e.background.clone():null,this.environment=e.environment!==null?e.environment.clone():null,this.fog=e.fog!==null?e.fog.clone():null,this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial!==null?e.overrideMaterial.clone():null,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Yt=new W,hn=new W,os=new W,pn=new W,ei=new W,ti=new W,ja=new W,ls=new W,cs=new W,us=new W,fs=new pt,ds=new pt,hs=new pt;class $t{constructor(e=new W,t=new W,i=new W){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),Yt.subVectors(e,t),r.cross(Yt);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){Yt.subVectors(r,t),hn.subVectors(i,t),os.subVectors(e,t);const a=Yt.dot(Yt),o=Yt.dot(hn),u=Yt.dot(os),l=hn.dot(hn),m=hn.dot(os),h=a*l-o*o;if(h===0)return s.set(0,0,0),null;const d=1/h,g=(l*u-o*m)*d,_=(a*m-o*u)*d;return s.set(1-g-_,_,g)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,pn)===null?!1:pn.x>=0&&pn.y>=0&&pn.x+pn.y<=1}static getInterpolation(e,t,i,r,s,a,o,u){return this.getBarycoord(e,t,i,r,pn)===null?(u.x=0,u.y=0,"z"in u&&(u.z=0),"w"in u&&(u.w=0),null):(u.setScalar(0),u.addScaledVector(s,pn.x),u.addScaledVector(a,pn.y),u.addScaledVector(o,pn.z),u)}static getInterpolatedAttribute(e,t,i,r,s,a){return fs.setScalar(0),ds.setScalar(0),hs.setScalar(0),fs.fromBufferAttribute(e,t),ds.fromBufferAttribute(e,i),hs.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(fs,s.x),a.addScaledVector(ds,s.y),a.addScaledVector(hs,s.z),a}static isFrontFacing(e,t,i,r){return Yt.subVectors(i,t),hn.subVectors(e,t),Yt.cross(hn).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Yt.subVectors(this.c,this.b),hn.subVectors(this.a,this.b),Yt.cross(hn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return $t.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return $t.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return $t.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return $t.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return $t.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let a,o;ei.subVectors(r,i),ti.subVectors(s,i),ls.subVectors(e,i);const u=ei.dot(ls),l=ti.dot(ls);if(u<=0&&l<=0)return t.copy(i);cs.subVectors(e,r);const m=ei.dot(cs),h=ti.dot(cs);if(m>=0&&h<=m)return t.copy(r);const d=u*h-m*l;if(d<=0&&u>=0&&m<=0&&u-m>0)return a=u/(u-m),t.copy(i).addScaledVector(ei,a);us.subVectors(e,s);const g=ei.dot(us),_=ti.dot(us);if(_>=0&&g<=_)return t.copy(s);const T=g*l-u*_;if(T<=0&&l>=0&&_<=0)return o=l/(l-_),t.copy(i).addScaledVector(ti,o);const f=m*_-g*h;if(f<=0&&h-m>=0&&g-_>=0)return ja.subVectors(s,r),o=(h-m)/(h-m+(g-_)),t.copy(r).addScaledVector(ja,o);const p=1/(f+T+d);return a=T*p,o=d*p,t.copy(i).addScaledVector(ei,a).addScaledVector(ti,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Ni{constructor(e=new W(1/0,1/0,1/0),t=new W(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Kt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Kt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Kt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Kt):Kt.fromBufferAttribute(s,a),Kt.applyMatrix4(e.matrixWorld),this.expandByPoint(Kt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Xi.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Xi.copy(i.boundingBox)),Xi.applyMatrix4(e.matrixWorld),this.union(Xi)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Kt),Kt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(vi),qi.subVectors(this.max,vi),ni.subVectors(e.a,vi),ii.subVectors(e.b,vi),ri.subVectors(e.c,vi),An.subVectors(ii,ni),bn.subVectors(ri,ii),zn.subVectors(ni,ri);let t=[0,-An.z,An.y,0,-bn.z,bn.y,0,-zn.z,zn.y,An.z,0,-An.x,bn.z,0,-bn.x,zn.z,0,-zn.x,-An.y,An.x,0,-bn.y,bn.x,0,-zn.y,zn.x,0];return!ps(t,ni,ii,ri,qi)||(t=[1,0,0,0,1,0,0,0,1],!ps(t,ni,ii,ri,qi))?!1:(Yi.crossVectors(An,bn),t=[Yi.x,Yi.y,Yi.z],ps(t,ni,ii,ri,qi))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Kt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Kt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(mn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),mn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),mn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),mn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),mn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),mn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),mn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),mn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(mn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const mn=[new W,new W,new W,new W,new W,new W,new W,new W],Kt=new W,Xi=new Ni,ni=new W,ii=new W,ri=new W,An=new W,bn=new W,zn=new W,vi=new W,qi=new W,Yi=new W,Gn=new W;function ps(n,e,t,i,r){for(let s=0,a=n.length-3;s<=a;s+=3){Gn.fromArray(n,s);const o=r.x*Math.abs(Gn.x)+r.y*Math.abs(Gn.y)+r.z*Math.abs(Gn.z),u=e.dot(Gn),l=t.dot(Gn),m=i.dot(Gn);if(Math.max(-Math.max(u,l,m),Math.min(u,l,m))>o)return!1}return!0}const gt=new W,Ki=new it;let jc=0;class vn extends Zn{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:jc++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Ic,this.updateRanges=[],this.gpuType=sn,this.version=0,this._normalizationScale=e!==void 0?zr(e):void 0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Ki.fromBufferAttribute(this,t),Ki.applyMatrix3(e),this.setXY(t,Ki.x,Ki.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)gt.fromBufferAttribute(this,t),gt.applyMatrix3(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)gt.fromBufferAttribute(this,t),gt.applyMatrix4(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)gt.fromBufferAttribute(this,t),gt.applyNormalMatrix(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)gt.fromBufferAttribute(this,t),gt.transformDirection(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=this._denormalize(i)),i}setComponent(e,t,i){return this.normalized&&(i=this._normalize(i)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i),r=this._normalize(r),s=this._normalize(s)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(e){const t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):Ml(e,this.array)}_normalize(e){const t=this._normalizationScale;return t!==void 0?Math.round(e*t):El(e,this.array)}}class Rl extends vn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class wl extends vn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class Qt extends vn{constructor(e,t,i){super(new Float32Array(e),t,i)}}const eu=new Ni,Si=new W,ms=new W;class Ui{constructor(e=new W,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):eu.setFromPoints(e).getCenter(i);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Si.subVectors(e,this.center);const t=Si.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(Si,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ms.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Si.copy(e.center).add(ms)),this.expandByPoint(Si.copy(e.center).sub(ms))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let tu=0;const Gt=new ht,gs=new Nt,si=new W,Bt=new Ni,Mi=new Ni,Et=new W;class un extends Zn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:tu++}),this.uuid=Ii(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Nc(e)?wl:Rl)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new He().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Gt.makeRotationFromQuaternion(e),this.applyMatrix4(Gt),this}rotateX(e){return Gt.makeRotationX(e),this.applyMatrix4(Gt),this}rotateY(e){return Gt.makeRotationY(e),this.applyMatrix4(Gt),this}rotateZ(e){return Gt.makeRotationZ(e),this.applyMatrix4(Gt),this}translate(e,t,i){return Gt.makeTranslation(e,t,i),this.applyMatrix4(Gt),this}scale(e,t,i){return Gt.makeScale(e,t,i),this.applyMatrix4(Gt),this}lookAt(e){return gs.lookAt(e),gs.updateMatrix(),this.applyMatrix4(gs.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(si).negate(),this.translate(si.x,si.y,si.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const a=e[r];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Qt(i,3))}else{const i=Math.min(e.length,t.count);for(let r=0;r<i;r++){const s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&ze("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ni);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){nt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new W(-1/0,-1/0,-1/0),new W(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];Bt.setFromBufferAttribute(s),this.morphTargetsRelative?(Et.addVectors(this.boundingBox.min,Bt.min),this.boundingBox.expandByPoint(Et),Et.addVectors(this.boundingBox.max,Bt.max),this.boundingBox.expandByPoint(Et)):(this.boundingBox.expandByPoint(Bt.min),this.boundingBox.expandByPoint(Bt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&nt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ui);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){nt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new W,1/0);return}if(e){const i=this.boundingSphere.center;if(Bt.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];Mi.setFromBufferAttribute(o),this.morphTargetsRelative?(Et.addVectors(Bt.min,Mi.min),Bt.expandByPoint(Et),Et.addVectors(Bt.max,Mi.max),Bt.expandByPoint(Et)):(Bt.expandByPoint(Mi.min),Bt.expandByPoint(Mi.max))}Bt.getCenter(i);let r=0;for(let s=0,a=e.count;s<a;s++)Et.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Et));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],u=this.morphTargetsRelative;for(let l=0,m=o.count;l<m;l++)Et.fromBufferAttribute(o,l),u&&(si.fromBufferAttribute(e,l),Et.add(si)),r=Math.max(r,i.distanceToSquared(Et))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&nt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){nt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,s=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==i.count)&&(a=new vn(new Float32Array(4*i.count),4),this.setAttribute("tangent",a));const o=[],u=[],l=new Uint8Array(i.count);for(let y=0;y<i.count;y++)o[y]=new W,u[y]=new W;const m=new W,h=new W,d=new W,g=new it,_=new it,T=new it,f=new W,p=new W;function E(y,P,L){l[y]=l[P]=l[L]=1,m.fromBufferAttribute(i,y),h.fromBufferAttribute(i,P),d.fromBufferAttribute(i,L),g.fromBufferAttribute(s,y),_.fromBufferAttribute(s,P),T.fromBufferAttribute(s,L),h.sub(m),d.sub(m),_.sub(g),T.sub(g);const U=1/(_.x*T.y-T.x*_.y);isFinite(U)&&(f.copy(h).multiplyScalar(T.y).addScaledVector(d,-_.y).multiplyScalar(U),p.copy(d).multiplyScalar(_.x).addScaledVector(h,-T.x).multiplyScalar(U),o[y].add(f),o[P].add(f),o[L].add(f),u[y].add(p),u[P].add(p),u[L].add(p))}let w=this.groups;w.length===0&&(w=[{start:0,count:e.count}]);for(let y=0,P=w.length;y<P;++y){const L=w[y],U=L.start,O=L.count;for(let I=U,k=U+O;I<k;I+=3)E(e.getX(I+0),e.getX(I+1),e.getX(I+2))}const A=new W,R=new W,x=new W,c=new W;function S(y){x.fromBufferAttribute(r,y),c.copy(x);const P=o[y];A.copy(P),A.sub(x.multiplyScalar(x.dot(P))).normalize(),R.crossVectors(c,P);const U=R.dot(u[y])<0?-1:1;a.setXYZW(y,A.x,A.y,A.z,U)}for(let y=0,P=i.count;y<P;++y)l[y]&&S(y);this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new vn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,g=i.count;d<g;d++)i.setXYZ(d,0,0,0);const r=new W,s=new W,a=new W,o=new W,u=new W,l=new W,m=new W,h=new W;if(e)for(let d=0,g=e.count;d<g;d+=3){const _=e.getX(d+0),T=e.getX(d+1),f=e.getX(d+2);r.fromBufferAttribute(t,_),s.fromBufferAttribute(t,T),a.fromBufferAttribute(t,f),m.subVectors(a,s),h.subVectors(r,s),m.cross(h),o.fromBufferAttribute(i,_),u.fromBufferAttribute(i,T),l.fromBufferAttribute(i,f),o.add(m),u.add(m),l.add(m),i.setXYZ(_,o.x,o.y,o.z),i.setXYZ(T,u.x,u.y,u.z),i.setXYZ(f,l.x,l.y,l.z)}else for(let d=0,g=t.count;d<g;d+=3)r.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),m.subVectors(a,s),h.subVectors(r,s),m.cross(h),i.setXYZ(d+0,m.x,m.y,m.z),i.setXYZ(d+1,m.x,m.y,m.z),i.setXYZ(d+2,m.x,m.y,m.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Et.fromBufferAttribute(e,t),Et.normalize(),e.setXYZ(t,Et.x,Et.y,Et.z)}toNonIndexed(){function e(o,u){const l=o.array,m=o.itemSize,h=o.normalized,d=new l.constructor(u.length*m);let g=0,_=0;for(let T=0,f=u.length;T<f;T++){o.isInterleavedBufferAttribute?g=u[T]*o.data.stride+o.offset:g=u[T]*m;for(let p=0;p<m;p++)d[_++]=l[g++]}return new vn(d,m,h)}if(this.index===null)return ze("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new un,i=this.index.array,r=this.attributes;for(const o in r){const u=r[o],l=e(u,i);t.setAttribute(o,l)}const s=this.morphAttributes;for(const o in s){const u=[],l=s[o];for(let m=0,h=l.length;m<h;m++){const d=l[m],g=e(d,i);u.push(g)}t.morphAttributes[o]=u}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,u=a.length;o<u;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const u=this.parameters;for(const l in u)u[l]!==void 0&&(e[l]=u[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const u in i){const l=i[u];e.data.attributes[u]=l.toJSON(e.data)}const r={};let s=!1;for(const u in this.morphAttributes){const l=this.morphAttributes[u],m=[];for(let h=0,d=l.length;h<d;h++){const g=l[h];m.push(g.toJSON(e.data))}m.length>0&&(r[u]=m,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const r=e.attributes;for(const l in r){const m=r[l];this.setAttribute(l,m.clone(t))}const s=e.morphAttributes;for(const l in s){const m=[],h=s[l];for(let d=0,g=h.length;d<g;d++)m.push(h[d].clone(t));this.morphAttributes[l]=m}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,m=a.length;l<m;l++){const h=a[l];this.addGroup(h.start,h.count,h.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const u=e.boundingSphere;return u!==null&&(this.boundingSphere=u.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Lt=new W;class ga{constructor(e,t,i,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=r,this._normalizationScale=e!==void 0?zr(e.array):void 0}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)Lt.fromBufferAttribute(this,t),Lt.applyMatrix4(e),this.setXYZ(t,Lt.x,Lt.y,Lt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Lt.fromBufferAttribute(this,t),Lt.applyNormalMatrix(e),this.setXYZ(t,Lt.x,Lt.y,Lt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Lt.fromBufferAttribute(this,t),Lt.transformDirection(e),this.setXYZ(t,Lt.x,Lt.y,Lt.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=this._denormalize(i)),i}setComponent(e,t,i){return this.normalized&&(i=this._normalize(i)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=this._denormalize(t)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=this._denormalize(t)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=this._denormalize(t)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=this._denormalize(t)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),i=this._normalize(i)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),i=this._normalize(i),r=this._normalize(r)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),i=this._normalize(i),r=this._normalize(r),s=this._normalize(s)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){Dr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return new vn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new ga(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Dr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}_denormalize(e){const t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):Ml(e,this.data.array)}_normalize(e){const t=this._normalizationScale;return t!==void 0?Math.round(e*t):El(e,this.data.array)}}const _s=new W,nu=new W,iu=new He;class wn{constructor(e=new W(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=_s.subVectors(i,t).cross(nu.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const r=e.delta(_s),s=this.normal.dot(r);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/s;return i===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||iu.getNormalMatrix(e),r=this.coplanarPoint(_s).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let ru=0;class mi extends Zn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ru++}),this.uuid=Ii(),this.name="",this.type="Material",this.blending=wi,this.side=Dn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=oa,this.blendDst=la,this.blendEquation=Wn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new et(0,0,0),this.blendAlpha=0,this.depthFunc=ui,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Rc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Jr,this.stencilZFail=Jr,this.stencilZPass=Jr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){ze(`Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){ze(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector2&&i&&i.isVector2||r&&r.isEuler&&i&&i.isEuler||r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(i.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(i.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(i.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(i.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(s=>s.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const a=[];for(const o in s){const u=s[o];delete u.metadata,a.push(u)}return a}if(t){const s=r(e.textures),a=r(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new et().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new wn().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new it().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new it().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const gn=new W,xs=new W,Zi=new W,$i=new W;class _a{constructor(e=new W,t=new W(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,gn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=gn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(gn.copy(this.origin).addScaledVector(this.direction,t),gn.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){xs.copy(e).add(t).multiplyScalar(.5),Zi.copy(t).sub(e).normalize(),$i.copy(this.origin).sub(xs);const s=e.distanceTo(t)*.5,a=-this.direction.dot(Zi),o=$i.dot(this.direction),u=-$i.dot(Zi),l=$i.lengthSq(),m=Math.abs(1-a*a);let h,d,g,_;if(m>0)if(h=a*u-o,d=a*o-u,_=s*m,h>=0)if(d>=-_)if(d<=_){const T=1/m;h*=T,d*=T,g=h*(h+a*d+2*o)+d*(a*h+d+2*u)+l}else d=s,h=Math.max(0,-(a*d+o)),g=-h*h+d*(d+2*u)+l;else d=-s,h=Math.max(0,-(a*d+o)),g=-h*h+d*(d+2*u)+l;else d<=-_?(h=Math.max(0,-(-a*s+o)),d=h>0?-s:Math.min(Math.max(-s,-u),s),g=-h*h+d*(d+2*u)+l):d<=_?(h=0,d=Math.min(Math.max(-s,-u),s),g=d*(d+2*u)+l):(h=Math.max(0,-(a*s+o)),d=h>0?s:Math.min(Math.max(-s,-u),s),g=-h*h+d*(d+2*u)+l);else d=a>0?-s:s,h=Math.max(0,-(a*d+o)),g=-h*h+d*(d+2*u)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(xs).addScaledVector(Zi,d),g}intersectSphere(e,t){if(e.radius<0)return null;gn.subVectors(e.center,this.origin);const i=gn.dot(this.direction),r=gn.dot(gn)-i*i,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=i-a,u=i+a;return u<0?null:o<0?this.at(u,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,a,o,u;const l=1/this.direction.x,m=1/this.direction.y,h=1/this.direction.z,d=this.origin;return l>=0?(i=(e.min.x-d.x)*l,r=(e.max.x-d.x)*l):(i=(e.max.x-d.x)*l,r=(e.min.x-d.x)*l),m>=0?(s=(e.min.y-d.y)*m,a=(e.max.y-d.y)*m):(s=(e.max.y-d.y)*m,a=(e.min.y-d.y)*m),i>a||s>r||((s>i||isNaN(i))&&(i=s),(a<r||isNaN(r))&&(r=a),h>=0?(o=(e.min.z-d.z)*h,u=(e.max.z-d.z)*h):(o=(e.max.z-d.z)*h,u=(e.min.z-d.z)*h),i>u||o>r)||((o>i||i!==i)&&(i=o),(u<r||r!==r)&&(r=u),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,gn)!==null}intersectTriangle(e,t,i,r,s){const a=this.origin,o=this.direction,u=o.x,l=o.y,m=o.z,h=e.x-a.x,d=e.y-a.y,g=e.z-a.z,_=t.x-a.x,T=t.y-a.y,f=t.z-a.z,p=i.x-a.x,E=i.y-a.y,w=i.z-a.z,A=Math.abs(u),R=Math.abs(l),x=Math.abs(m);let c,S,y,P,L,U,O,I,k,Y,z,ne;if(A>=R&&A>=x?(y=u,U=h,k=_,ne=p,u>=0?(c=l,S=m,P=d,L=g,O=T,I=f,Y=E,z=w):(c=m,S=l,P=g,L=d,O=f,I=T,Y=w,z=E)):R>=x?(y=l,U=d,k=T,ne=E,l>=0?(c=m,S=u,P=g,L=h,O=f,I=_,Y=w,z=p):(c=u,S=m,P=h,L=g,O=_,I=f,Y=p,z=w)):(y=m,U=g,k=f,ne=w,m>=0?(c=u,S=l,P=h,L=d,O=_,I=T,Y=p,z=E):(c=l,S=u,P=d,L=h,O=T,I=_,Y=E,z=p)),y===0)return null;const q=c/y,te=S/y,ie=1/y,Ae=P-q*U,Te=L-te*U,Z=O-q*k,he=I-te*k,ye=Y-q*ne,Pe=z-te*ne,_e=ye*he-Pe*Z,Oe=Ae*Pe-Te*ye,C=Z*Te-he*Ae;if(r){if(_e<0||Oe<0||C<0)return null}else if((_e<0||Oe<0||C<0)&&(_e>0||Oe>0||C>0))return null;const B=_e+Oe+C;if(B===0)return null;const J=ie*(_e*U+Oe*k+C*ne);return(B>0?J<0:J>0)?null:this.at(J/B,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class su extends mi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new et(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yn,this.combine=tl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const eo=new ht,Hn=new _a,Ji=new Ui,to=new W,Qi=new W,ji=new W,er=new W,vs=new W,tr=new W,no=new W,nr=new W;class Nn extends Nt{constructor(e=new un,t=new su){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){tr.set(0,0,0);for(let u=0,l=s.length;u<l;u++){const m=o[u],h=s[u];m!==0&&(vs.fromBufferAttribute(h,e),a?tr.addScaledVector(vs,m):tr.addScaledVector(vs.sub(t),m))}t.add(tr)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ji.copy(i.boundingSphere),Ji.applyMatrix4(s),Hn.copy(e.ray).recast(e.near),!(Ji.containsPoint(Hn.origin)===!1&&(Hn.intersectSphere(Ji,to)===null||Hn.origin.distanceToSquared(to)>(e.far-e.near)**2))&&(eo.copy(s).invert(),Hn.copy(e.ray).applyMatrix4(eo),!(i.boundingBox!==null&&Hn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Hn)))}_computeIntersections(e,t,i){let r;const s=this.geometry,a=this.material,o=s.index,u=s.attributes.position,l=s.attributes.uv,m=s.attributes.uv1,h=s.attributes.normal,d=s.groups,g=s.drawRange;if(o!==null)if(Array.isArray(a))for(let _=0,T=d.length;_<T;_++){const f=d[_],p=a[f.materialIndex],E=Math.max(f.start,g.start),w=Math.min(o.count,Math.min(f.start+f.count,g.start+g.count));for(let A=E,R=w;A<R;A+=3){const x=o.getX(A),c=o.getX(A+1),S=o.getX(A+2);r=ir(this,p,e,i,l,m,h,x,c,S),r&&(r.faceIndex=Math.floor(A/3),r.face.materialIndex=f.materialIndex,t.push(r))}}else{const _=Math.max(0,g.start),T=Math.min(o.count,g.start+g.count);for(let f=_,p=T;f<p;f+=3){const E=o.getX(f),w=o.getX(f+1),A=o.getX(f+2);r=ir(this,a,e,i,l,m,h,E,w,A),r&&(r.faceIndex=Math.floor(f/3),t.push(r))}}else if(u!==void 0)if(Array.isArray(a))for(let _=0,T=d.length;_<T;_++){const f=d[_],p=a[f.materialIndex],E=Math.max(f.start,g.start),w=Math.min(u.count,Math.min(f.start+f.count,g.start+g.count));for(let A=E,R=w;A<R;A+=3){const x=A,c=A+1,S=A+2;r=ir(this,p,e,i,l,m,h,x,c,S),r&&(r.faceIndex=Math.floor(A/3),r.face.materialIndex=f.materialIndex,t.push(r))}}else{const _=Math.max(0,g.start),T=Math.min(u.count,g.start+g.count);for(let f=_,p=T;f<p;f+=3){const E=f,w=f+1,A=f+2;r=ir(this,a,e,i,l,m,h,E,w,A),r&&(r.faceIndex=Math.floor(f/3),t.push(r))}}}}function au(n,e,t,i,r,s,a,o){let u;if(e.side===Ft?u=i.intersectTriangle(a,s,r,!0,o):u=i.intersectTriangle(r,s,a,e.side===Dn,o),u===null)return null;nr.copy(o),nr.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(nr);return l<t.near||l>t.far?null:{distance:l,point:nr.clone(),object:n}}function ir(n,e,t,i,r,s,a,o,u,l){n.getVertexPosition(o,Qi),n.getVertexPosition(u,ji),n.getVertexPosition(l,er);const m=au(n,e,t,i,Qi,ji,er,no);if(m){const h=new W;$t.getBarycoord(no,Qi,ji,er,h),r&&(m.uv=$t.getInterpolatedAttribute(r,o,u,l,h,new it)),s&&(m.uv1=$t.getInterpolatedAttribute(s,o,u,l,h,new it)),a&&(m.normal=$t.getInterpolatedAttribute(a,o,u,l,h,new W),m.normal.dot(i.direction)>0&&m.normal.multiplyScalar(-1));const d={a:o,b:u,c:l,normal:new W,materialIndex:0};$t.getNormal(Qi,ji,er,d.normal),m.face=d,m.barycoord=h}return m}class ou extends It{constructor(e=null,t=1,i=1,r,s,a,o,u,l=yt,m=yt,h,d){super(null,a,o,u,l,m,r,s,h,d),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Vn=new Ui,lu=new it(.5,.5),rr=new W;class Ir{constructor(e=new wn,t=new wn,i=new wn,r=new wn,s=new wn,a=new wn){this.planes=[e,t,i,r,s,a]}set(e,t,i,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Jt,i=!1){const r=this.planes,s=e.elements,a=s[0],o=s[1],u=s[2],l=s[3],m=s[4],h=s[5],d=s[6],g=s[7],_=s[8],T=s[9],f=s[10],p=s[11],E=s[12],w=s[13],A=s[14],R=s[15];if(r[0].setComponents(l-a,g-m,p-_,R-E).normalize(),r[1].setComponents(l+a,g+m,p+_,R+E).normalize(),r[2].setComponents(l+o,g+h,p+T,R+w).normalize(),r[3].setComponents(l-o,g-h,p-T,R-w).normalize(),i)r[4].setComponents(u,d,f,A).normalize(),r[5].setComponents(l-u,g-d,p-f,R-A).normalize();else if(r[4].setComponents(l-u,g-d,p-f,R-A).normalize(),t===Jt)r[5].setComponents(l+u,g+d,p+f,R+A).normalize();else if(t===Pr)r[5].setComponents(u,d,f,A).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Vn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Vn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Vn)}intersectsSprite(e){Vn.center.set(0,0,0);const t=lu.distanceTo(e.center);return Vn.radius=.7071067811865476+t,Vn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Vn)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(rr.x=r.normal.x>0?e.max.x:e.min.x,rr.y=r.normal.y>0?e.max.y:e.min.y,rr.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(rr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}const io=new ht;class xa{constructor(){this.coordinateSystem=Jt,this._frustums=[],this._count=0}setFromArrayCamera(e){const t=e.cameras,i=this._frustums;for(let r=0;r<t.length;r++){const s=t[r];io.multiplyMatrices(s.projectionMatrix,s.matrixWorldInverse),i[r]===void 0&&(i[r]=new Ir),i[r].setFromProjectionMatrix(io,s.coordinateSystem,s.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsObject(e))return!0;return!1}intersectsSprite(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsSprite(e))return!0;return!1}intersectsSphere(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsSphere(e))return!0;return!1}intersectsBox(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsBox(e))return!0;return!1}containsPoint(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;const t=this._frustums,i=e._frustums;for(let r=0;r<e._count;r++)t[r]===void 0&&(t[r]=new Ir),t[r].copy(i[r]);return this._count=e._count,this}clone(){return new xa().copy(this)}}class cu extends mi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new et(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Nr=new W,Ur=new W,ro=new ht,Ei=new _a,sr=new Ui,Ss=new W,so=new W;class va extends Nt{constructor(e=new un,t=new cu){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let r=1,s=t.count;r<s;r++)Nr.fromBufferAttribute(t,r-1),Ur.fromBufferAttribute(t,r),i[r]=i[r-1],i[r]+=Nr.distanceTo(Ur);e.setAttribute("lineDistance",new Qt(i,1))}else ze("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),sr.copy(i.boundingSphere),sr.applyMatrix4(r),sr.radius+=s,e.ray.intersectsSphere(sr)===!1)return;ro.copy(r).invert(),Ei.copy(e.ray).applyMatrix4(ro);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),u=o*o,l=this.isLineSegments?2:1,m=i.index,d=i.attributes.position;if(m!==null){const g=Math.max(0,a.start),_=Math.min(m.count,a.start+a.count);for(let T=g,f=_-1;T<f;T+=l){const p=m.getX(T),E=m.getX(T+1),w=ar(this,e,Ei,u,p,E,T);w&&t.push(w)}if(this.isLineLoop){const T=m.getX(_-1),f=m.getX(g),p=ar(this,e,Ei,u,T,f,_-1);p&&t.push(p)}}else{const g=Math.max(0,a.start),_=Math.min(d.count,a.start+a.count);for(let T=g,f=_-1;T<f;T+=l){const p=ar(this,e,Ei,u,T,T+1,T);p&&t.push(p)}if(this.isLineLoop){const T=ar(this,e,Ei,u,_-1,g,_-1);T&&t.push(T)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function ar(n,e,t,i,r,s,a){const o=n.geometry.attributes.position;if(Nr.fromBufferAttribute(o,r),Ur.fromBufferAttribute(o,s),t.distanceSqToSegment(Nr,Ur,Ss,so)>i)return;Ss.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(Ss);if(!(l<e.near||l>e.far))return{distance:l,point:so.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const ao=new W,oo=new W;class uu extends va{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let r=0,s=t.count;r<s;r+=2)ao.fromBufferAttribute(t,r),oo.fromBufferAttribute(t,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+ao.distanceTo(oo);e.setAttribute("lineDistance",new Qt(i,1))}else ze("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class fu extends va{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class du extends mi{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new et(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const lo=new ht,ra=new _a,or=new Ui,lr=new W;class hu extends Nt{constructor(e=new un,t=new du){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),or.copy(i.boundingSphere),or.applyMatrix4(r),or.radius+=s,e.ray.intersectsSphere(or)===!1)return;lo.copy(r).invert(),ra.copy(e.ray).applyMatrix4(lo);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),u=o*o,l=i.index,h=i.attributes.position;if(l!==null){const d=Math.max(0,a.start),g=Math.min(l.count,a.start+a.count);for(let _=d,T=g;_<T;_++){const f=l.getX(_);lr.fromBufferAttribute(h,f),co(lr,f,u,r,e,t,this)}}else{const d=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let _=d,T=g;_<T;_++)lr.fromBufferAttribute(h,_),co(lr,_,u,r,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function co(n,e,t,i,r,s,a){const o=ra.distanceSqToPoint(n);if(o<t){const u=new W;ra.closestPointToPoint(n,u),u.applyMatrix4(i);const l=r.ray.origin.distanceTo(u);if(l<r.near||l>r.far)return;s.push({distance:l,distanceToRay:Math.sqrt(o),point:u,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class Cl extends It{constructor(e=[],t=fi,i,r,s,a,o,u,l,m){super(e,t,i,r,s,a,o,u,l,m),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Un extends It{constructor(e,t,i=ln,r,s,a,o=yt,u=yt,l,m=In,h=1){if(m!==In&&m!==Ln)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:h};super(d,r,s,a,o,u,m,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new ma(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class Pl extends Un{constructor(e,t=ln,i=fi,r,s,a=yt,o=yt,u,l=In){const m={width:e,height:e,depth:1},h=[m,m,m,m,m,m];super(e,e,t,i,r,s,a,o,u,l),this.image=h,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Sa extends It{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Fi extends un{constructor(e=1,t=1,i=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const u=[],l=[],m=[],h=[];let d=0,g=0;_("z","y","x",-1,-1,i,t,e,a,s,0),_("z","y","x",1,-1,i,t,-e,a,s,1),_("x","z","y",1,1,e,i,t,r,a,2),_("x","z","y",1,-1,e,i,-t,r,a,3),_("x","y","z",1,-1,e,t,i,r,s,4),_("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(u),this.setAttribute("position",new Qt(l,3)),this.setAttribute("normal",new Qt(m,3)),this.setAttribute("uv",new Qt(h,2));function _(T,f,p,E,w,A,R,x,c,S,y){const P=A/c,L=R/S,U=A/2,O=R/2,I=x/2,k=c+1,Y=S+1;let z=0,ne=0;const q=new W;for(let te=0;te<Y;te++){const ie=te*L-O;for(let Ae=0;Ae<k;Ae++){const Te=Ae*P-U;q[T]=Te*E,q[f]=ie*w,q[p]=I,l.push(q.x,q.y,q.z),q[T]=0,q[f]=0,q[p]=x>0?1:-1,m.push(q.x,q.y,q.z),h.push(Ae/c),h.push(1-te/S),z+=1}}for(let te=0;te<S;te++)for(let ie=0;ie<c;ie++){const Ae=d+ie+k*te,Te=d+ie+k*(te+1),Z=d+(ie+1)+k*(te+1),he=d+(ie+1)+k*te;u.push(Ae,Te,he),u.push(Te,Z,he),ne+=6}o.addGroup(g,ne,y),g+=ne,d+=z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Fi(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Gr extends un{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,a=t/2,o=Math.floor(i),u=Math.floor(r),l=o+1,m=u+1,h=e/o,d=t/u,g=[],_=[],T=[],f=[];for(let p=0;p<m;p++){const E=p*d-a;for(let w=0;w<l;w++){const A=w*h-s;_.push(A,-E,0),T.push(0,0,1),f.push(w/o),f.push(1-p/u)}}for(let p=0;p<u;p++)for(let E=0;E<o;E++){const w=E+l*p,A=E+l*(p+1),R=E+1+l*(p+1),x=E+1+l*p;g.push(w,A,x),g.push(A,R,x)}this.setIndex(g),this.setAttribute("position",new Qt(_,3)),this.setAttribute("normal",new Qt(T,3)),this.setAttribute("uv",new Qt(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Gr(e.width,e.height,e.widthSegments,e.heightSegments)}}function hi(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];if(uo(r))r.isRenderTargetTexture?(ze("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone();else if(Array.isArray(r))if(uo(r[0])){const s=[];for(let a=0,o=r.length;a<o;a++)s[a]=r[a].clone();e[t][i]=s}else e[t][i]=r.slice();else e[t][i]=r}}return e}function Dt(n){const e={};for(let t=0;t<n.length;t++){const i=hi(n[t]);for(const r in i)e[r]=i[r]}return e}function uo(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function pu(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Ll(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Je.workingColorSpace}const mu={clone:hi,merge:Dt};var gu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,_u=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Kn extends mi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=gu,this.fragmentShader=_u,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=hi(e.uniforms),this.uniformsGroups=pu(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?t.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[r]={type:"m4",value:a.toArray()}:t.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const i in e.uniforms){const r=e.uniforms[i];switch(this.uniforms[i]={},r.type){case"t":this.uniforms[i].value=t[r.value]||null;break;case"c":this.uniforms[i].value=new et().setHex(r.value);break;case"v2":this.uniforms[i].value=new it().fromArray(r.value);break;case"v3":this.uniforms[i].value=new W().fromArray(r.value);break;case"v4":this.uniforms[i].value=new pt().fromArray(r.value);break;case"m3":this.uniforms[i].value=new He().fromArray(r.value);break;case"m4":this.uniforms[i].value=new ht().fromArray(r.value);break;default:this.uniforms[i].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class Dl extends Kn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class xu extends mi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Ac,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class vu extends mi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const cr=new W,ur=new pi,jt=new W;class Ma extends Nt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ht,this.projectionMatrix=new ht,this.projectionMatrixInverse=new ht,this.coordinateSystem=Jt,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(cr,ur,jt),jt.x===1&&jt.y===1&&jt.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(cr,ur,jt.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(cr,ur,jt),jt.x===1&&jt.y===1&&jt.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(cr,ur,jt.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Rn=new W,fo=new it,ho=new it;class tn extends Ma{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ia*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Qr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ia*2*Math.atan(Math.tan(Qr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Rn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Rn.x,Rn.y).multiplyScalar(-e/Rn.z),Rn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Rn.x,Rn.y).multiplyScalar(-e/Rn.z)}getViewSize(e,t){return this.getViewBounds(e,fo,ho),t.subVectors(ho,fo)}setViewOffset(e,t,i,r,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Qr*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const u=a.fullWidth,l=a.fullHeight;s+=a.offsetX*r/u,t-=a.offsetY*i/l,r*=a.width/u,i*=a.height/l}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class Su extends Ma{constructor(e=-1,t=1,i=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,a=i+e,o=r+t,u=r-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,m=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,a=s+l*this.view.width,o-=m*this.view.offsetY,u=o-m*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,u,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const ai=-90,oi=1;class sa extends Nt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new tn(ai,oi,e,t);r.layers=this.layers,this.add(r);const s=new tn(ai,oi,e,t);s.layers=this.layers,this.add(s);const a=new tn(ai,oi,e,t);a.layers=this.layers,this.add(a);const o=new tn(ai,oi,e,t);o.layers=this.layers,this.add(o);const u=new tn(ai,oi,e,t);u.layers=this.layers,this.add(u);const l=new tn(ai,oi,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,a,o,u]=t;for(const l of t)this.remove(l);if(e===Jt)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),u.up.set(0,1,0),u.lookAt(0,0,-1);else if(e===Pr)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),u.up.set(0,-1,0),u.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,u,l,m]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),g=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const T=i.texture.mipmapsAutoUpdate;i.texture.mipmapsAutoUpdate=!1;let f=!1;e.isWebGLRenderer===!0?f=e.state.buffers.depth.getReversed():f=e.reversedDepthBuffer,e.setRenderTarget(i,0,r),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(i,1,r),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,2,r),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,3,r),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(i,4,r),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),i.texture.mipmapsAutoUpdate=T,e.setRenderTarget(i,5,r),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,m),e.setRenderTarget(h,d,g),e.xr.enabled=_,i.texture.needsPMREMUpdate=!0}}class Mu extends tn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}}class po{constructor(e,t,i,r,s,a=!1){this.isGLBufferAttribute=!0,this.name="",this.buffer=e,this.type=t,this.itemSize=i,this.elementSize=r,this.count=s,this.normalized=a,this.version=0}set needsUpdate(e){e===!0&&this.version++}setBuffer(e){return this.buffer=e,this}setType(e,t){return this.type=e,this.elementSize=t,this}setItemSize(e){return this.itemSize=e,this}setCount(e){return this.count=e,this}}function mo(n,e,t,i){const r=Eu(i);switch(t){case pl:return n*e;case gl:return n*e/r.components*r.byteLength;case da:return n*e/r.components*r.byteLength;case qn:return n*e*2/r.components*r.byteLength;case ha:return n*e*2/r.components*r.byteLength;case ml:return n*e*3/r.components*r.byteLength;case an:return n*e*4/r.components*r.byteLength;case pa:return n*e*4/r.components*r.byteLength;case pr:case mr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case gr:case _r:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Rs:case Cs:return Math.max(n,16)*Math.max(e,8)/4;case bs:case ws:return Math.max(n,8)*Math.max(e,8)/2;case Ps:case Ls:case Is:case Ns:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Ds:case Rr:case Us:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Fs:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Os:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Bs:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case zs:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Gs:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Hs:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Vs:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case ks:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Ws:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Xs:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case qs:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Ys:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Ks:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Zs:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case $s:case Js:case Qs:return Math.ceil(n/4)*Math.ceil(e/4)*16;case js:case ea:return Math.ceil(n/4)*Math.ceil(e/4)*8;case wr:case ta:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Eu(n){switch(n){case Vt:case ul:return{byteLength:1,components:1};case Pi:case fl:case cn:return{byteLength:2,components:1};case ua:case fa:return{byteLength:2,components:4};case ln:case ca:case sn:return{byteLength:4,components:1};case dl:case hl:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Br}}));typeof window<"u"&&(window.__THREE__?ze("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Br);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Il(){let n=null,e=!1,t=null,i=null;function r(s,a){i=n.requestAnimationFrame(r),t(s,a)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function Tu(n){const e=new WeakMap;function t(o,u){const l=o.array,m=o.usage,h=l.byteLength,d=n.createBuffer();n.bindBuffer(u,d),n.bufferData(u,l,m),o.onUploadCallback();let g;if(l instanceof Float32Array)g=n.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)g=n.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?g=n.HALF_FLOAT:g=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)g=n.SHORT;else if(l instanceof Uint32Array)g=n.UNSIGNED_INT;else if(l instanceof Int32Array)g=n.INT;else if(l instanceof Int8Array)g=n.BYTE;else if(l instanceof Uint8Array)g=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)g=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:g,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:h}}function i(o,u,l){const m=u.array,h=u.updateRanges;if(n.bindBuffer(l,o),h.length===0)n.bufferSubData(l,0,m);else{h.sort((g,_)=>g.start-_.start);let d=0;for(let g=1;g<h.length;g++){const _=h[d],T=h[g];T.start<=_.start+_.count+1?_.count=Math.max(_.count,T.start+T.count-_.start):(++d,h[d]=T)}h.length=d+1;for(let g=0,_=h.length;g<_;g++){const T=h[g];n.bufferSubData(l,T.start*m.BYTES_PER_ELEMENT,m,T.start,T.count)}u.clearUpdateRanges()}u.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const u=e.get(o);u&&(n.deleteBuffer(u.buffer),e.delete(o))}function a(o,u){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const m=e.get(o);(!m||m.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,u));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,o,u),l.version=o.version}}return{get:r,remove:s,update:a}}var yu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Au=`#ifdef USE_ALPHAHASH
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
#endif`,bu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ru=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,wu=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Cu=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Pu=`#ifdef USE_AOMAP
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
#endif`,Lu=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Du=`#ifdef USE_BATCHING
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
#endif`,Iu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Nu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Uu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Fu=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Ou=`#ifdef USE_IRIDESCENCE
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
#endif`,Bu=`#ifdef USE_BUMPMAP
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
#endif`,zu=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Gu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Hu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Vu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ku=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Wu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Xu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,qu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Yu=`#define PI 3.141592653589793
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
} // validated`,Ku=`vec3 transformedNormal = objectNormal;
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
#endif`,Zu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,$u=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Ju=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Qu=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,ju="gl_FragColor = linearToOutputTexel( gl_FragColor );",ef=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,tf=`#ifdef USE_ENVMAP
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
#endif`,nf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,rf=`#ifdef USE_ENVMAP
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
#endif`,sf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,af=`#ifdef USE_ENVMAP
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
#endif`,of=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,lf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,cf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,uf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,ff=`#ifdef USE_GRADIENTMAP
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
}`,df=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,hf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,pf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,mf=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,gf=`#ifdef USE_ENVMAP
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
#endif`,_f=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,xf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,vf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Sf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Mf=`PhysicalMaterial material;
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
#endif`,Ef=`uniform sampler2D dfgLUT;
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
}`,Tf=`
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
#endif`,yf=`#if defined( RE_IndirectDiffuse )
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
#endif`,Af=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,bf=`#if NUM_LIGHT_PROBE_GRIDS > 0
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
#endif`,Rf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,wf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Cf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Pf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Lf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Df=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,If=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Nf=`#if defined( USE_POINTS_UV )
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
#endif`,Uf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Ff=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Of=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Bf=`#if defined( USE_MORPHCOLORS )
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
#endif`,zf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Gf=`#ifdef USE_MORPHTARGETS
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
#endif`,Hf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Vf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,kf=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Wf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Xf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,qf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Yf=`#ifdef USE_NORMALMAP
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
#endif`,Kf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Zf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,$f=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Jf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Qf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,jf=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,ed=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,td=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,nd=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,id=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,rd=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,sd=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,ad=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,od=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ld=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,cd=`float getShadowMask() {
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
}`,ud=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,fd=`#ifdef USE_SKINNING
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
#endif`,dd=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,hd=`#ifdef USE_SKINNING
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
#endif`,pd=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,md=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,gd=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,_d=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,xd=`#ifdef USE_TRANSMISSION
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
#endif`,vd=`#ifdef USE_TRANSMISSION
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
#endif`,Sd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Md=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ed=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Td=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const yd=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Ad=`uniform sampler2D t2D;
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
}`,bd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Rd=`uniform float backgroundBlurriness;
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
}`,wd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Cd=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Pd=`#include <common>
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
}`,Ld=`#if DEPTH_PACKING == 3200
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
}`,Dd=`#define DISTANCE
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
}`,Id=`#define DISTANCE
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
}`,Nd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Ud=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Fd=`uniform float scale;
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
}`,Od=`uniform vec3 diffuse;
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
}`,Bd=`#include <common>
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
}`,zd=`uniform vec3 diffuse;
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
}`,Gd=`#define LAMBERT
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
}`,Hd=`#define LAMBERT
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
}`,Vd=`#define MATCAP
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
}`,kd=`#define MATCAP
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
}`,Wd=`#define NORMAL
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
}`,Xd=`#define NORMAL
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
}`,qd=`#define PHONG
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
}`,Yd=`#define PHONG
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
}`,Kd=`#define STANDARD
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
}`,Zd=`#define STANDARD
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
}`,$d=`#define TOON
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
}`,Jd=`#define TOON
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
}`,Qd=`uniform float size;
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
}`,jd=`uniform vec3 diffuse;
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
}`,eh=`#include <common>
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
}`,th=`uniform vec3 color;
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
}`,nh=`uniform float rotation;
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
}`,ih=`uniform vec3 diffuse;
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
}`,qe={alphahash_fragment:yu,alphahash_pars_fragment:Au,alphamap_fragment:bu,alphamap_pars_fragment:Ru,alphatest_fragment:wu,alphatest_pars_fragment:Cu,aomap_fragment:Pu,aomap_pars_fragment:Lu,batching_pars_vertex:Du,batching_vertex:Iu,begin_vertex:Nu,beginnormal_vertex:Uu,bsdfs:Fu,iridescence_fragment:Ou,bumpmap_pars_fragment:Bu,clipping_planes_fragment:zu,clipping_planes_pars_fragment:Gu,clipping_planes_pars_vertex:Hu,clipping_planes_vertex:Vu,color_fragment:ku,color_pars_fragment:Wu,color_pars_vertex:Xu,color_vertex:qu,common:Yu,defaultnormal_vertex:Ku,displacementmap_pars_vertex:Zu,displacementmap_vertex:$u,emissivemap_fragment:Ju,emissivemap_pars_fragment:Qu,colorspace_fragment:ju,colorspace_pars_fragment:ef,envmap_fragment:tf,envmap_common_pars_fragment:nf,envmap_pars_fragment:rf,envmap_pars_vertex:sf,envmap_physical_pars_fragment:gf,envmap_vertex:af,fog_vertex:of,fog_pars_vertex:lf,fog_fragment:cf,fog_pars_fragment:uf,gradientmap_pars_fragment:ff,lightmap_pars_fragment:df,lights_lambert_fragment:hf,lights_lambert_pars_fragment:pf,lights_pars_begin:mf,lights_toon_fragment:_f,lights_toon_pars_fragment:xf,lights_phong_fragment:vf,lights_phong_pars_fragment:Sf,lights_physical_fragment:Mf,lights_physical_pars_fragment:Ef,lights_fragment_begin:Tf,lights_fragment_maps:yf,lights_fragment_end:Af,lightprobes_pars_fragment:bf,logdepthbuf_fragment:Rf,logdepthbuf_pars_fragment:wf,logdepthbuf_pars_vertex:Cf,logdepthbuf_vertex:Pf,map_fragment:Lf,map_pars_fragment:Df,map_particle_fragment:If,map_particle_pars_fragment:Nf,metalnessmap_fragment:Uf,metalnessmap_pars_fragment:Ff,morphinstance_vertex:Of,morphcolor_vertex:Bf,morphnormal_vertex:zf,morphtarget_pars_vertex:Gf,morphtarget_vertex:Hf,normal_fragment_begin:Vf,normal_fragment_maps:kf,normal_pars_fragment:Wf,normal_pars_vertex:Xf,normal_vertex:qf,normalmap_pars_fragment:Yf,clearcoat_normal_fragment_begin:Kf,clearcoat_normal_fragment_maps:Zf,clearcoat_pars_fragment:$f,iridescence_pars_fragment:Jf,opaque_fragment:Qf,packing:jf,premultiplied_alpha_fragment:ed,project_vertex:td,dithering_fragment:nd,dithering_pars_fragment:id,roughnessmap_fragment:rd,roughnessmap_pars_fragment:sd,shadowmap_pars_fragment:ad,shadowmap_pars_vertex:od,shadowmap_vertex:ld,shadowmask_pars_fragment:cd,skinbase_vertex:ud,skinning_pars_vertex:fd,skinning_vertex:dd,skinnormal_vertex:hd,specularmap_fragment:pd,specularmap_pars_fragment:md,tonemapping_fragment:gd,tonemapping_pars_fragment:_d,transmission_fragment:xd,transmission_pars_fragment:vd,uv_pars_fragment:Sd,uv_pars_vertex:Md,uv_vertex:Ed,worldpos_vertex:Td,background_vert:yd,background_frag:Ad,backgroundCube_vert:bd,backgroundCube_frag:Rd,cube_vert:wd,cube_frag:Cd,depth_vert:Pd,depth_frag:Ld,distance_vert:Dd,distance_frag:Id,equirect_vert:Nd,equirect_frag:Ud,linedashed_vert:Fd,linedashed_frag:Od,meshbasic_vert:Bd,meshbasic_frag:zd,meshlambert_vert:Gd,meshlambert_frag:Hd,meshmatcap_vert:Vd,meshmatcap_frag:kd,meshnormal_vert:Wd,meshnormal_frag:Xd,meshphong_vert:qd,meshphong_frag:Yd,meshphysical_vert:Kd,meshphysical_frag:Zd,meshtoon_vert:$d,meshtoon_frag:Jd,points_vert:Qd,points_frag:jd,shadow_vert:eh,shadow_frag:th,sprite_vert:nh,sprite_frag:ih},Me={common:{diffuse:{value:new et(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new He},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new He}},envmap:{envMap:{value:null},envMapRotation:{value:new He},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new He}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new He}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new He},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new He},normalScale:{value:new it(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new He},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new He}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new He}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new He}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new et(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new et(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0},uvTransform:{value:new He}},sprite:{diffuse:{value:new et(16777215)},opacity:{value:1},center:{value:new it(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new He},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0}}},nn={basic:{uniforms:Dt([Me.common,Me.specularmap,Me.envmap,Me.aomap,Me.lightmap,Me.fog]),vertexShader:qe.meshbasic_vert,fragmentShader:qe.meshbasic_frag},lambert:{uniforms:Dt([Me.common,Me.specularmap,Me.envmap,Me.aomap,Me.lightmap,Me.emissivemap,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.fog,Me.lights,{emissive:{value:new et(0)},envMapIntensity:{value:1}}]),vertexShader:qe.meshlambert_vert,fragmentShader:qe.meshlambert_frag},phong:{uniforms:Dt([Me.common,Me.specularmap,Me.envmap,Me.aomap,Me.lightmap,Me.emissivemap,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.fog,Me.lights,{emissive:{value:new et(0)},specular:{value:new et(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:qe.meshphong_vert,fragmentShader:qe.meshphong_frag},standard:{uniforms:Dt([Me.common,Me.envmap,Me.aomap,Me.lightmap,Me.emissivemap,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.roughnessmap,Me.metalnessmap,Me.fog,Me.lights,{emissive:{value:new et(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag},toon:{uniforms:Dt([Me.common,Me.aomap,Me.lightmap,Me.emissivemap,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.gradientmap,Me.fog,Me.lights,{emissive:{value:new et(0)}}]),vertexShader:qe.meshtoon_vert,fragmentShader:qe.meshtoon_frag},matcap:{uniforms:Dt([Me.common,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.fog,{matcap:{value:null}}]),vertexShader:qe.meshmatcap_vert,fragmentShader:qe.meshmatcap_frag},points:{uniforms:Dt([Me.points,Me.fog]),vertexShader:qe.points_vert,fragmentShader:qe.points_frag},dashed:{uniforms:Dt([Me.common,Me.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:qe.linedashed_vert,fragmentShader:qe.linedashed_frag},depth:{uniforms:Dt([Me.common,Me.displacementmap]),vertexShader:qe.depth_vert,fragmentShader:qe.depth_frag},normal:{uniforms:Dt([Me.common,Me.bumpmap,Me.normalmap,Me.displacementmap,{opacity:{value:1}}]),vertexShader:qe.meshnormal_vert,fragmentShader:qe.meshnormal_frag},sprite:{uniforms:Dt([Me.sprite,Me.fog]),vertexShader:qe.sprite_vert,fragmentShader:qe.sprite_frag},background:{uniforms:{uvTransform:{value:new He},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:qe.background_vert,fragmentShader:qe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new He}},vertexShader:qe.backgroundCube_vert,fragmentShader:qe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:qe.cube_vert,fragmentShader:qe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:qe.equirect_vert,fragmentShader:qe.equirect_frag},distance:{uniforms:Dt([Me.common,Me.displacementmap,{referencePosition:{value:new W},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:qe.distance_vert,fragmentShader:qe.distance_frag},shadow:{uniforms:Dt([Me.lights,Me.fog,{color:{value:new et(0)},opacity:{value:1}}]),vertexShader:qe.shadow_vert,fragmentShader:qe.shadow_frag}};nn.physical={uniforms:Dt([nn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new He},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new He},clearcoatNormalScale:{value:new it(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new He},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new He},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new He},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new He},sheen:{value:0},sheenColor:{value:new et(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new He},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new He},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new He},transmissionSamplerSize:{value:new it},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new He},attenuationDistance:{value:0},attenuationColor:{value:new et(0)},specularColor:{value:new et(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new He},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new He},anisotropyVector:{value:new it},anisotropyMap:{value:null},anisotropyMapTransform:{value:new He}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag};const fr={r:0,b:0,g:0},rh=new ht,Nl=new He;Nl.set(-1,0,0,0,1,0,0,0,1);function sh(n,e,t,i,r,s){const a=new et(0);let o=r===!0?0:1,u,l,m=null,h=0,d=null;function g(E){let w=E.isScene===!0?E.background:null;if(w&&w.isTexture){const A=E.backgroundBlurriness>0;w=e.get(w,A)}return w}function _(E){let w=!1;const A=g(E);A===null?f(a,o):A&&A.isColor&&(f(A,1),w=!0);const R=n.xr.getEnvironmentBlendMode();R==="additive"?t.buffers.color.setClear(0,0,0,1,s):R==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,s),(n.autoClear||w)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function T(E,w){const A=g(w);A&&A.isCubeTexture?(l===void 0&&(l=new Nn(new Fi(1,1,1),new Kn({name:"BackgroundCubeMaterial",uniforms:hi(nn.backgroundCube.uniforms),vertexShader:nn.backgroundCube.vertexShader,fragmentShader:nn.backgroundCube.fragmentShader,side:Ft,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(R,x,c){this.matrixWorld.copyPosition(c.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(l)),l.material.uniforms.envMap.value=A,l.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(rh.makeRotationFromEuler(w.backgroundRotation)).transpose(),A.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Nl),l.material.toneMapped=Je.getTransfer(A.colorSpace)!==st,(m!==A||h!==A.version||d!==n.toneMapping)&&(l.material.needsUpdate=!0,m=A,h=A.version,d=n.toneMapping),l.layers.enableAll(),E.unshift(l,l.geometry,l.material,0,0,null)):A&&A.isTexture&&(u===void 0&&(u=new Nn(new Gr(2,2),new Kn({name:"BackgroundMaterial",uniforms:hi(nn.background.uniforms),vertexShader:nn.background.vertexShader,fragmentShader:nn.background.fragmentShader,side:Dn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),Object.defineProperty(u.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(u)),u.material.uniforms.t2D.value=A,u.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,u.material.toneMapped=Je.getTransfer(A.colorSpace)!==st,A.matrixAutoUpdate===!0&&A.updateMatrix(),u.material.uniforms.uvTransform.value.copy(A.matrix),(m!==A||h!==A.version||d!==n.toneMapping)&&(u.material.needsUpdate=!0,m=A,h=A.version,d=n.toneMapping),u.layers.enableAll(),E.unshift(u,u.geometry,u.material,0,0,null))}function f(E,w){E.getRGB(fr,Ll(n)),t.buffers.color.setClear(fr.r,fr.g,fr.b,w,s)}function p(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0)}return{getClearColor:function(){return a},setClearColor:function(E,w=1){a.set(E),o=w,f(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(E){o=E,f(a,o)},render:_,addToRenderList:T,dispose:p}}function ah(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=d(null);let s=r,a=!1;function o(L,U,O,I,k){let Y=!1;const z=h(L,I,O,U);s!==z&&(s=z,l(s.object)),Y=g(L,I,O,k),Y&&_(L,I,O,k),k!==null&&e.update(k,n.ELEMENT_ARRAY_BUFFER),(Y||a)&&(a=!1,A(L,U,O,I),k!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(k).buffer))}function u(){return n.createVertexArray()}function l(L){return n.bindVertexArray(L)}function m(L){return n.deleteVertexArray(L)}function h(L,U,O,I){const k=I.wireframe===!0;let Y=i[U.id];Y===void 0&&(Y={},i[U.id]=Y);const z=L.isInstancedMesh===!0?L.id:0;let ne=Y[z];ne===void 0&&(ne={},Y[z]=ne);let q=ne[O.id];q===void 0&&(q={},ne[O.id]=q);let te=q[k];return te===void 0&&(te=d(u()),q[k]=te),te}function d(L){const U=[],O=[],I=[];for(let k=0;k<t;k++)U[k]=0,O[k]=0,I[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:O,attributeDivisors:I,object:L,attributes:{},index:null}}function g(L,U,O,I){const k=s.attributes,Y=U.attributes;let z=0;const ne=O.getAttributes();for(const q in ne)if(ne[q].location>=0){const ie=k[q];let Ae=Y[q];if(Ae===void 0&&(q==="instanceMatrix"&&L.instanceMatrix&&(Ae=L.instanceMatrix),q==="instanceColor"&&L.instanceColor&&(Ae=L.instanceColor)),ie===void 0||ie.attribute!==Ae||Ae&&ie.data!==Ae.data)return!0;z++}return s.attributesNum!==z||s.index!==I}function _(L,U,O,I){const k={},Y=U.attributes;let z=0;const ne=O.getAttributes();for(const q in ne)if(ne[q].location>=0){let ie=Y[q];ie===void 0&&(q==="instanceMatrix"&&L.instanceMatrix&&(ie=L.instanceMatrix),q==="instanceColor"&&L.instanceColor&&(ie=L.instanceColor));const Ae={};Ae.attribute=ie,ie&&ie.data&&(Ae.data=ie.data),k[q]=Ae,z++}s.attributes=k,s.attributesNum=z,s.index=I}function T(){const L=s.newAttributes;for(let U=0,O=L.length;U<O;U++)L[U]=0}function f(L){p(L,0)}function p(L,U){const O=s.newAttributes,I=s.enabledAttributes,k=s.attributeDivisors;O[L]=1,I[L]===0&&(n.enableVertexAttribArray(L),I[L]=1),k[L]!==U&&(n.vertexAttribDivisor(L,U),k[L]=U)}function E(){const L=s.newAttributes,U=s.enabledAttributes;for(let O=0,I=U.length;O<I;O++)U[O]!==L[O]&&(n.disableVertexAttribArray(O),U[O]=0)}function w(L,U,O,I,k,Y,z){z===!0?n.vertexAttribIPointer(L,U,O,k,Y):n.vertexAttribPointer(L,U,O,I,k,Y)}function A(L,U,O,I){T();const k=I.attributes,Y=O.getAttributes(),z=U.defaultAttributeValues;for(const ne in Y){const q=Y[ne];if(q.location>=0){let te=k[ne];if(te===void 0&&(ne==="instanceMatrix"&&L.instanceMatrix&&(te=L.instanceMatrix),ne==="instanceColor"&&L.instanceColor&&(te=L.instanceColor)),te!==void 0){const ie=te.normalized,Ae=te.itemSize,Te=e.get(te);if(Te===void 0)continue;const Z=Te.buffer,he=Te.type,ye=Te.bytesPerElement,Pe=he===n.INT||he===n.UNSIGNED_INT||te.gpuType===ca;if(te.isInterleavedBufferAttribute){const _e=te.data,Oe=_e.isInterleavedBuffer===!0?_e.stride:_e.itemSize,C=te.offset;if(_e.isInstancedInterleavedBuffer||_e.isInstancedBufferAttribute){for(let B=0;B<q.locationSize;B++)p(q.location+B,_e.meshPerAttribute);L.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=_e.meshPerAttribute*_e.count)}else for(let B=0;B<q.locationSize;B++)f(q.location+B);n.bindBuffer(n.ARRAY_BUFFER,Z);for(let B=0;B<q.locationSize;B++)w(q.location+B,Ae/q.locationSize,he,ie,Oe*ye,(C+Ae/q.locationSize*B)*ye,Pe)}else{if(te.isInstancedBufferAttribute){for(let _e=0;_e<q.locationSize;_e++)p(q.location+_e,te.meshPerAttribute);L.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let _e=0;_e<q.locationSize;_e++)f(q.location+_e);n.bindBuffer(n.ARRAY_BUFFER,Z);for(let _e=0;_e<q.locationSize;_e++)w(q.location+_e,Ae/q.locationSize,he,ie,Ae*ye,Ae/q.locationSize*_e*ye,Pe)}}else if(z!==void 0){const ie=z[ne];if(ie!==void 0)switch(ie.length){case 2:n.vertexAttrib2fv(q.location,ie);break;case 3:n.vertexAttrib3fv(q.location,ie);break;case 4:n.vertexAttrib4fv(q.location,ie);break;default:n.vertexAttrib1fv(q.location,ie)}}}}E()}function R(){y();for(const L in i){const U=i[L];for(const O in U){const I=U[O];for(const k in I){const Y=I[k];for(const z in Y)m(Y[z].object),delete Y[z];delete I[k]}}delete i[L]}}function x(L){if(i[L.id]===void 0)return;const U=i[L.id];for(const O in U){const I=U[O];for(const k in I){const Y=I[k];for(const z in Y)m(Y[z].object),delete Y[z];delete I[k]}}delete i[L.id]}function c(L){for(const U in i){const O=i[U];for(const I in O){const k=O[I];if(k[L.id]===void 0)continue;const Y=k[L.id];for(const z in Y)m(Y[z].object),delete Y[z];delete k[L.id]}}}function S(L){for(const U in i){const O=i[U],I=L.isInstancedMesh===!0?L.id:0,k=O[I];if(k!==void 0){for(const Y in k){const z=k[Y];for(const ne in z)m(z[ne].object),delete z[ne];delete k[Y]}delete O[I],Object.keys(O).length===0&&delete i[U]}}}function y(){P(),a=!0,s!==r&&(s=r,l(s.object))}function P(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:y,resetDefaultState:P,dispose:R,releaseStatesOfGeometry:x,releaseStatesOfObject:S,releaseStatesOfProgram:c,initAttributes:T,enableAttribute:f,disableUnusedAttributes:E}}function oh(n,e,t){let i;function r(u){i=u}function s(u,l){n.drawArrays(i,u,l),t.update(l,i,1)}function a(u,l,m){m!==0&&(n.drawArraysInstanced(i,u,l,m),t.update(l,i,m))}function o(u,l,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,u,0,l,0,m);let d=0;for(let g=0;g<m;g++)d+=l[g];t.update(d,i,1)}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o}function lh(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const c=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(c.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(c){return!(c!==an&&i.convert(c)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(c){const S=c===cn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(c!==Vt&&c!==sn&&!S&&i.convert(c)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE))}function u(c){if(c==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";c="mediump"}return c==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const m=u(l);m!==l&&(ze("WebGLRenderer:",l,"not supported, using",m,"instead."),l=m);const h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),d=t.logarithmicDepthBuffer===!0&&h===!1;t.reversedDepthBuffer===!0&&h===!1&&ze("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),t.logarithmicDepthBuffer===!0&&h===!0&&ze("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");const g=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),T=n.getParameter(n.MAX_TEXTURE_SIZE),f=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),E=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),w=n.getParameter(n.MAX_VARYING_VECTORS),A=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),R=n.getParameter(n.MAX_SAMPLES),x=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:u,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:h,maxTextures:g,maxVertexTextures:_,maxTextureSize:T,maxCubemapSize:f,maxAttributes:p,maxVertexUniforms:E,maxVaryings:w,maxFragmentUniforms:A,maxSamples:R,samples:x}}function ch(n){const e=this;let t=null,i=0,r=!1,s=!1;const a=new wn,o=new He,u={value:null,needsUpdate:!1};this.uniform=u,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const g=h.length!==0||d||i!==0||r;return r=d,i=h.length,g},this.beginShadows=function(){s=!0,m(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,d){t=m(h,d,0)},this.setState=function(h,d,g){const _=h.clippingPlanes,T=h.clipIntersection,f=h.clipShadows,p=n.get(h);if(!r||_===null||_.length===0||s&&!f)s?m(null):l();else{const E=s?0:i,w=E*4;let A=p.clippingState||null;u.value=A,A=m(_,d,w,g);for(let R=0;R!==w;++R)A[R]=t[R];p.clippingState=A,this.numIntersection=T?this.numPlanes:0,this.numPlanes+=E}};function l(){u.value!==t&&(u.value=t,u.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function m(h,d,g,_){const T=h!==null?h.length:0;let f=null;if(T!==0){if(f=u.value,_!==!0||f===null){const p=g+T*4,E=d.matrixWorldInverse;o.getNormalMatrix(E),(f===null||f.length<p)&&(f=new Float32Array(p));for(let w=0,A=g;w!==T;++w,A+=4)a.copy(h[w]).applyMatrix4(E,o),a.normal.toArray(f,A),f[A+3]=a.constant}u.value=f,u.needsUpdate=!0}return e.numPlanes=T,e.numIntersection=0,f}}class Hr extends kt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new Cl(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Fi(5,5,5),s=new Kn({name:"CubemapFromEquirect",uniforms:hi(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Ft,blending:Xn});s.uniforms.tEquirect.value=t;const a=new Nn(r,s),o=t.minFilter;return t.minFilter===Pn&&(t.minFilter=Ut),new sa(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,r=!0){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,r);e.setRenderTarget(s)}}const go=256,uh=3,fh=20,Ul=256,Fl=16,dh=3,hh=new W,ph=new et;class Fr{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new sa(1,10,null),this._boxMesh=new Nn(new Fi(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,i=.1,r=100,s={}){const{size:a=256,position:o=hh}=s,u=this._renderer;this._setSize(a);const l=this._allocateTarget(),m=this._getSourceTarget(!0);t>0&&(m.texture.mipmapsAutoUpdate=!1);const h=u.autoClear,d=u.autoClearColor,g=u.autoClearDepth,_=u.autoClearStencil,T=e.background;u.autoClear=!0,u.autoClearColor=!0,u.autoClearDepth=!0,u.autoClearStencil=!0,T===null&&(e.background=u.getClearColor(ph));const f=new sa(i,r,m);return f.position.copy(o),f.update(u,e),u.autoClear=h,u.autoClearColor=d,u.autoClearDepth=g,u.autoClearStencil=_,e.background=T,t>0&&(m.texture.mipmapsAutoUpdate=!0,this._blur(l,t)),this._applyPMREM(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=vo(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=xo(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(go,zc(e))}_fromTexture(e,t){e.mapping===fi||e.mapping===Ci?this._setSize(e.image.length===0?go:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);const i=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(i),i}_allocateTarget(){const e=this._cubeSize,t=_o(e,!1,!1),i=Math.log2(e)-uh;for(let r=0;r<=i;r++)t.texture.mipmaps.push({width:e>>r,height:e>>r});return t.texture.name="PMREM",t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){const t=this._cubeSize,i=this._sourceTarget;return(i===null||i.width!==t||e&&i.depthBuffer===!1)&&(i!==null&&i.dispose(),this._sourceTarget=_o(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,i){const r=this._boxMesh,s=this._cubeCamera;r.material=i,s.renderTarget=e,s.activeMipmapLevel=t;const a=e.width>>t;e.viewport.set(0,0,a,a),s.update(this._renderer,r),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===fi||e.mapping===Ci?(this._cubemapMaterial===null&&(this._cubemapMaterial=vo()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=xo()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(e){this._ggxMaterial===null&&(this._ggxMaterial=mh(),this._integrationMaterial=gh());const t=this._cubeSize,i=e.texture.mipmaps.length-1,r=this._ggxMaterial.uniforms;r.envMap.value=this._sourceTarget.texture;const s=this._integrationMaterial.uniforms;s.envMap.value=this._sourceTarget.texture,s.sourceLod.value=Math.log2(t/Fl);for(let a=0;a<=i;a++){const o=Fr.lodToRoughness(a,i);if(a>i-dh)s.roughness.value=o,this._renderCube(e,a,this._integrationMaterial);else{const u=o>0?Math.log2(t)+.5*Math.log2(6/(Ul*Math.pow(o,4)))+.5:0;r.roughness.value=o,r.lodBias.value=u,this._renderCube(e,a,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=_h());const i=this._blurMaterial,r=i.uniforms,s=this._sourceTarget;r.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,r.envMap.value=s.texture,this._renderCube(e,0,i),r.envMap.value=e.texture,this._renderCube(s,0,i)}}function _o(n,e,t){return new Hr(n,{minFilter:Pn,generateMipmaps:e,type:cn,colorSpace:Li,depthBuffer:t})}function Oi(n,e,t){return new Kn({name:n,uniforms:e,vertexShader:qe.cube_vert,fragmentShader:t,side:Ft,blending:Xn,depthTest:!1,depthWrite:!1})}function mh(){return Oi("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${Ul}u

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
	`)}function gh(){return Oi("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:Fl}},`

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
	`)}function _h(){return Oi("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${fh}
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
	`)}function xo(){return Oi("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

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
	`)}function vo(){return Oi("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function xh(n){let e=new WeakMap,t=new WeakMap,i=null;function r(d,g=!1){return d==null?null:g?a(d):s(d)}function s(d){if(d&&d.isTexture){const g=d.mapping;if(g===Kr||g===Zr)if(e.has(d)){const _=e.get(d).texture;return o(_,d.mapping)}else{const _=d.image;if(_&&_.height>0){const T=new Hr(_.height);return T.fromEquirectangularTexture(n,d),e.set(d,T),d.addEventListener("dispose",l),o(T.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture&&d.isPMREMTexture!==!0){const g=d.mapping,_=g===Kr||g===Zr,T=g===fi||g===Ci;if(_||T){let f=t.get(d);const p=f!==void 0?f.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==p)return i===null&&(i=new Fr(n)),f=_?i.fromEquirectangular(d,f):i.fromCubemap(d,f),f.texture.pmremVersion=d.pmremVersion,t.set(d,f),f.texture;if(f!==void 0)return f.texture;{const E=d.image;return _&&E&&E.height>0||T&&E&&u(E)?(i===null&&(i=new Fr(n)),f=_?i.fromEquirectangular(d):i.fromCubemap(d),f.texture.pmremVersion=d.pmremVersion,t.set(d,f),d.addEventListener("dispose",m),f.texture):null}}}return d}function o(d,g){return g===Kr?d.mapping=fi:g===Zr&&(d.mapping=Ci),d}function u(d){let g=0;const _=6;for(let T=0;T<_;T++)d[T]!==void 0&&g++;return g===_}function l(d){const g=d.target;g.removeEventListener("dispose",l);const _=e.get(g);_!==void 0&&(e.delete(g),_.dispose())}function m(d){const g=d.target;g.removeEventListener("dispose",m);const _=t.get(g);_!==void 0&&(t.delete(g),_.dispose())}function h(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:h}}function vh(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const r=n.getExtension(i);return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&xr("WebGLRenderer: "+i+" extension not supported."),r}}}function Sh(n,e,t,i){const r={},s=new WeakMap,a=new FinalizationRegistry(_=>delete r[_]);function o(_){u(_.target)}function u(_){_.index!==null&&e.remove(_.index);for(const f in _.attributes)e.remove(_.attributes[f]);_.removeEventListener("dispose",o),delete r[_.id],a.unregister(_);const T=s.get(_);T&&(e.remove(T),s.delete(_)),i.releaseStatesOfGeometry(_),_.isInstancedBufferGeometry===!0&&delete _._maxInstanceCount,t.memory.geometries--}function l(_,T){return r[T.id]!==void 0||(T.addEventListener("dispose",o),r[T.id]=new WeakRef(T),a.register(T,T.id,T),t.memory.geometries++),T}function m(_){const T=_.attributes;for(const f in T)e.update(T[f],n.ARRAY_BUFFER)}function h(_){const T=_.index,f=_.attributes.position;let p=0;if(f===void 0)return;const E=T!==null?T.array.length:f.array.length/3-1,w=f.count>=65535?wl:Rl,A=new w(Math.ceil(E/3)*6,1),R=A.array;if(T!==null){const c=T.array;p=T.version;for(let S=0,y=0;S<E;S+=3){const P=c[S+0],L=c[S+1],U=c[S+2];R[y++]=P,R[y++]=L,R[y++]=L,R[y++]=U,R[y++]=U,R[y++]=P}}else{p=f.version;for(let c=0,S=0;c<E;c+=3){const y=c+0,P=c+1,L=c+2;R[S++]=y,R[S++]=P,R[S++]=P,R[S++]=L,R[S++]=L,R[S++]=y}}A.version=p;const x=s.get(_);x&&e.remove(x),s.set(_,A)}function d(_){const T=s.get(_);if(T){const f=_.index;f!==null&&T.version<f.version&&h(_)}else h(_);return s.get(_)}function g(){for(const _ in r){const T=r[_].deref();T!==void 0&&u(T)}}return{get:l,update:m,getWireframeAttribute:d,dispose:g}}function Mh(n,e,t){let i;function r(h){i=h}let s,a;function o(h){s=h.type,a=h.bytesPerElement}function u(h,d){n.drawElements(i,d,s,h*a),t.update(d,i,1)}function l(h,d,g){g!==0&&(n.drawElementsInstanced(i,d,s,h*a,g),t.update(d,i,g))}function m(h,d,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,s,h,0,g);let T=0;for(let f=0;f<g;f++)T+=d[f];t.update(T,i,1)}this.setMode=r,this.setIndex=o,this.render=u,this.renderInstances=l,this.renderMultiDraw=m}function Eh(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(s/3);break;case n.LINES:t.lines+=o*(s/2);break;case n.LINE_STRIP:t.lines+=o*(s-1);break;case n.LINE_LOOP:t.lines+=o*s;break;case n.POINTS:t.points+=o*s;break;default:nt("WebGLInfo: Unknown draw mode:",a);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function Th(n,e,t){const i=new WeakMap,r=new pt;function s(a,o,u){const l=a.morphTargetInfluences,m=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=m!==void 0?m.length:0;let d=i.get(o);if(d===void 0||d.count!==h){let P=function(){S.dispose(),i.delete(o),o.removeEventListener("dispose",P)};var g=P;d!==void 0&&d.texture.dispose();const _=o.morphAttributes.position!==void 0,T=o.morphAttributes.normal!==void 0,f=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],E=o.morphAttributes.normal||[],w=o.morphAttributes.color||[];let A=0;_===!0&&(A=1),T===!0&&(A=2),f===!0&&(A=3);let R=o.attributes.position.count*A,x=1;R>e.maxTextureSize&&(x=Math.ceil(R/e.maxTextureSize),R=e.maxTextureSize);const c=new Float32Array(R*x*4*h),S=new Tl(c,R,x,h);S.type=sn,S.needsUpdate=!0;const y=A*4;for(let L=0;L<h;L++){const U=p[L],O=E[L],I=w[L],k=R*x*4*L;for(let Y=0;Y<U.count;Y++){const z=Y*y;_===!0&&(r.fromBufferAttribute(U,Y),c[k+z+0]=r.x,c[k+z+1]=r.y,c[k+z+2]=r.z,c[k+z+3]=0),T===!0&&(r.fromBufferAttribute(O,Y),c[k+z+4]=r.x,c[k+z+5]=r.y,c[k+z+6]=r.z,c[k+z+7]=0),f===!0&&(r.fromBufferAttribute(I,Y),c[k+z+8]=r.x,c[k+z+9]=r.y,c[k+z+10]=r.z,c[k+z+11]=I.itemSize===4?r.w:1)}}d={count:h,texture:S,size:new it(R,x)},i.set(o,d),o.addEventListener("dispose",P)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)u.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let _=0;for(let f=0;f<l.length;f++)_+=l[f];const T=o.morphTargetsRelative?1:1-_;u.getUniforms().setValue(n,"morphTargetBaseInfluence",T),u.getUniforms().setValue(n,"morphTargetInfluences",l)}u.getUniforms().setValue(n,"morphTargetsTexture",d.texture,t),u.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:s}}function yh(n,e,t,i,r){let s=new WeakMap;function a(l){const m=r.render.frame,h=l.geometry,d=e.get(l,h);if(s.get(d)!==m&&(e.update(d),s.set(d,m)),l.isInstancedMesh&&(l.hasEventListener("dispose",u)===!1&&l.addEventListener("dispose",u),s.get(l)!==m&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,m))),l.isSkinnedMesh){const g=l.skeleton;s.get(g)!==m&&(g.update(),s.set(g,m))}return d}function o(){s=new WeakMap}function u(l){const m=l.target;m.removeEventListener("dispose",u),i.releaseStatesOfObject(m),t.remove(m.instanceMatrix),m.instanceColor!==null&&t.remove(m.instanceColor)}return{update:a,dispose:o}}const Ah={[nl]:"LINEAR_TONE_MAPPING",[il]:"REINHARD_TONE_MAPPING",[rl]:"CINEON_TONE_MAPPING",[sl]:"ACES_FILMIC_TONE_MAPPING",[ol]:"AGX_TONE_MAPPING",[ll]:"NEUTRAL_TONE_MAPPING",[al]:"CUSTOM_TONE_MAPPING"};function bh(n,e,t,i,r,s){const a=new kt(e,t,{type:n,depthBuffer:r,stencilBuffer:s,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,u=null,l=null;const m=new un;m.setAttribute("position",new Qt([-1,3,0,-1,-1,0,3,-1,0],3)),m.setAttribute("uv",new Qt([0,2,0,0,2,0],2));const h=new Dl({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),d=new Nn(m,h),g=new Su(-1,1,1,-1,0,1);let _=null,T=null,f=!1,p,E=null,w=[],A=!1;this.setSize=function(R,x){a.setSize(R,x),o!==null&&o.setSize(R,x),u!==null&&u.setSize(R,x);for(let c=0;c<w.length;c++){const S=w[c];S.setSize&&S.setSize(R,x)}},this.setEffects=function(R){w=R,A=w.length>0&&w[0].isRenderPass===!0;const x=a.width,c=a.height;w.length>0&&o===null&&(o=new kt(x,c,{type:cn,depthBuffer:!1,stencilBuffer:!1}),u=new kt(x,c,{type:cn,depthBuffer:!1,stencilBuffer:!1}));const S=r===!0&&w.some(y=>y.needsDepthTexture===!0);S!==(a.depthTexture!==null)&&(S===!0&&l===null&&(l=new Un(x,c),s===!0&&(l.format=Ln,l.type=di)),a.dispose(),a.depthTexture=S?l:null,a.resolveDepthBuffer=S,a.storeMultisampledDepthBuffer=S);for(let y=0;y<w.length;y++){const P=w[y];P.setSize&&P.setSize(x,c),S&&P.needsDepthTexture===!0&&P.setDepthTexture&&P.setDepthTexture(l)}},this.begin=function(R,x){if(f||R.toneMapping===on&&w.length===0)return!1;if(E=x,x!==null){const c=x.width,S=x.height;(a.width!==c||a.height!==S)&&this.setSize(c,S)}return A===!1&&R.setRenderTarget(a),p=R.toneMapping,R.toneMapping=on,!0},this.hasRenderPass=function(){return A},this.end=function(R,x){R.toneMapping=p,f=!0;let c=a,S=o;for(let y=0;y<w.length;y++){const P=w[y];P.enabled!==!1&&(P.render(R,S,c,x),P.needsSwap!==!1&&(c=S,S=S===o?u:o))}if(_!==R.outputColorSpace||T!==R.toneMapping){_=R.outputColorSpace,T=R.toneMapping,h.defines={},Je.getTransfer(_)===st&&(h.defines.SRGB_TRANSFER="");const y=Ah[T];y&&(h.defines[y]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=c.texture,R.setRenderTarget(E),R.render(d,g),E=null,f=!1},this.isCompositing=function(){return f},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),u!==null&&u.dispose(),m.dispose(),h.dispose()}}const Ol=new It,Bl=new Un(1,1),zl=new Pl(1),Gl=new Tl,Hl=new yl,Vl=new Cl,So=[],Mo=[],Eo=new Float32Array(16),To=new Float32Array(9),yo=new Float32Array(4);function gi(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=So[r];if(s===void 0&&(s=new Float32Array(r),So[r]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(s,o)}return s}function xt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function vt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Vr(n,e){let t=Mo[e];t===void 0&&(t=new Int32Array(e),Mo[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function Rh(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function wh(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(xt(t,e))return;n.uniform2fv(this.addr,e),vt(t,e)}}function Ch(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(xt(t,e))return;n.uniform3fv(this.addr,e),vt(t,e)}}function Ph(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(xt(t,e))return;n.uniform4fv(this.addr,e),vt(t,e)}}function Lh(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(xt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),vt(t,e)}else{if(xt(t,i))return;yo.set(i),n.uniformMatrix2fv(this.addr,!1,yo),vt(t,i)}}function Dh(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(xt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),vt(t,e)}else{if(xt(t,i))return;To.set(i),n.uniformMatrix3fv(this.addr,!1,To),vt(t,i)}}function Ih(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(xt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),vt(t,e)}else{if(xt(t,i))return;Eo.set(i),n.uniformMatrix4fv(this.addr,!1,Eo),vt(t,i)}}function Nh(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function Uh(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(xt(t,e))return;n.uniform2iv(this.addr,e),vt(t,e)}}function Fh(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(xt(t,e))return;n.uniform3iv(this.addr,e),vt(t,e)}}function Oh(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(xt(t,e))return;n.uniform4iv(this.addr,e),vt(t,e)}}function Bh(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function zh(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(xt(t,e))return;n.uniform2uiv(this.addr,e),vt(t,e)}}function Gh(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(xt(t,e))return;n.uniform3uiv(this.addr,e),vt(t,e)}}function Hh(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(xt(t,e))return;n.uniform4uiv(this.addr,e),vt(t,e)}}function kr(n){return n.version===0&&(n.compareFunction=vl,n.needsUpdate=!0),n}function Vh(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?s=kr(Bl):s=Ol,t.setTexture2D(e||s,r)}function kh(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||Hl,r)}function Wh(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_CUBE_SHADOW?s=kr(zl):s=Vl,t.setTextureCube(e||s,r)}function Xh(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||Gl,r)}function qh(n){switch(n){case 5126:return Rh;case 35664:return wh;case 35665:return Ch;case 35666:return Ph;case 35674:return Lh;case 35675:return Dh;case 35676:return Ih;case 5124:case 35670:return Nh;case 35667:case 35671:return Uh;case 35668:case 35672:return Fh;case 35669:case 35673:return Oh;case 5125:return Bh;case 36294:return zh;case 36295:return Gh;case 36296:return Hh;case 35678:case 36198:case 36298:case 36306:case 35682:return Vh;case 35679:case 36299:case 36307:return kh;case 35680:case 36300:case 36308:case 36293:return Wh;case 36289:case 36303:case 36311:case 36292:return Xh}}function Yh(n,e){n.uniform1fv(this.addr,e)}function Kh(n,e){const t=gi(e,this.size,2);n.uniform2fv(this.addr,t)}function Zh(n,e){const t=gi(e,this.size,3);n.uniform3fv(this.addr,t)}function $h(n,e){const t=gi(e,this.size,4);n.uniform4fv(this.addr,t)}function Jh(n,e){const t=gi(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function Qh(n,e){const t=gi(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function jh(n,e){const t=gi(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function ep(n,e){n.uniform1iv(this.addr,e)}function tp(n,e){n.uniform2iv(this.addr,e)}function np(n,e){n.uniform3iv(this.addr,e)}function ip(n,e){n.uniform4iv(this.addr,e)}function rp(n,e){n.uniform1uiv(this.addr,e)}function sp(n,e){n.uniform2uiv(this.addr,e)}function ap(n,e){n.uniform3uiv(this.addr,e)}function op(n,e){n.uniform4uiv(this.addr,e)}function lp(n,e,t){const i=this.cache,r=e.length,s=Vr(t,r);xt(i,s)||(n.uniform1iv(this.addr,s),vt(i,s));let a;this.type===n.SAMPLER_2D_SHADOW?a=kr(Bl):a=Ol;for(let o=0;o!==r;++o)t.setTexture2D(e[o]||a,s[o])}function cp(n,e,t){const i=this.cache,r=e.length,s=Vr(t,r);xt(i,s)||(n.uniform1iv(this.addr,s),vt(i,s));for(let a=0;a!==r;++a)t.setTexture3D(e[a]||Hl,s[a])}function up(n,e,t){const i=this.cache,r=e.length,s=Vr(t,r);xt(i,s)||(n.uniform1iv(this.addr,s),vt(i,s));let a;this.type===n.SAMPLER_CUBE_SHADOW?a=kr(zl):a=Vl;for(let o=0;o!==r;++o)t.setTextureCube(e[o]||a,s[o])}function fp(n,e,t){const i=this.cache,r=e.length,s=Vr(t,r);xt(i,s)||(n.uniform1iv(this.addr,s),vt(i,s));for(let a=0;a!==r;++a)t.setTexture2DArray(e[a]||Gl,s[a])}function dp(n){switch(n){case 5126:return Yh;case 35664:return Kh;case 35665:return Zh;case 35666:return $h;case 35674:return Jh;case 35675:return Qh;case 35676:return jh;case 5124:case 35670:return ep;case 35667:case 35671:return tp;case 35668:case 35672:return np;case 35669:case 35673:return ip;case 5125:return rp;case 36294:return sp;case 36295:return ap;case 36296:return op;case 35678:case 36198:case 36298:case 36306:case 35682:return lp;case 35679:case 36299:case 36307:return cp;case 35680:case 36300:case 36308:case 36293:return up;case 36289:case 36303:case 36311:case 36292:return fp}}class hp{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=qh(t.type)}}class pp{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=dp(t.type)}}class mp{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,t[o.id],i)}}}const Ms=/(\w+)(\])?(\[|\.)?/g;function Ao(n,e){n.seq.push(e),n.map[e.id]=e}function gp(n,e,t){const i=n.name,r=i.length;for(Ms.lastIndex=0;;){const s=Ms.exec(i),a=Ms.lastIndex;let o=s[1];const u=s[2]==="]",l=s[3];if(u&&(o=o|0),l===void 0||l==="["&&a+2===r){Ao(t,l===void 0?new hp(o,n,e):new pp(o,n,e));break}else{let h=t.map[o];h===void 0&&(h=new mp(o),Ao(t,h)),t=h}}}class vr{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=e.getActiveUniform(t,a),u=e.getUniformLocation(t,o.name);gp(o,u,this)}const r=[],s=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(a):s.push(a);r.length>0&&(this.seq=r.concat(s))}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,a=t.length;s!==a;++s){const o=t[s],u=i[o.id];u.needsUpdate!==!1&&o.setValue(e,u.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in t&&i.push(a)}return i}}function bo(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const _p=37297;let xp=0;function vp(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=r;a<s;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const Ro=new He;function Sp(n){Je._getMatrix(Ro,Je.workingColorSpace,n);const e=`mat3( ${Ro.elements.map(t=>t.toFixed(4))} )`;switch(Je.getTransfer(n)){case Cr:return[e,"LinearTransferOETF"];case st:return[e,"sRGBTransferOETF"];default:return ze("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function wo(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),s=(n.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+s+`

`+vp(n.getShaderSource(e),o)}else return s}function Mp(n,e){const t=Sp(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( ${t[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}const Ep={[nl]:"Linear",[il]:"Reinhard",[rl]:"Cineon",[sl]:"ACESFilmic",[ol]:"AgX",[ll]:"Neutral",[al]:"Custom"};function Tp(n,e){const t=Ep[e];return t===void 0?(ze("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const dr=new W;function yp(){Je.getLuminanceCoefficients(dr);const n=dr.x.toFixed(4),e=dr.y.toFixed(4),t=dr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Ap(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(bi).join(`
`)}function bp(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function Rp(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),a=s.name;let o=1;s.type===n.FLOAT_MAT2&&(o=2),s.type===n.FLOAT_MAT3&&(o=3),s.type===n.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function bi(n){return n!==""}function Co(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,e.numLightProbeGrids)}function Po(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const wp=/^[ \t]*#include +<([\w\d./]+)>/gm;function aa(n){return n.replace(wp,Cp)}function Cp(n,e){const t=qe[e];if(t===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">");return aa(t)}const Pp=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Lo(n){return n.replace(Pp,Lp)}function Lp(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Do(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}const Dp={[hr]:"SHADOWMAP_TYPE_PCF",[Ai]:"SHADOWMAP_TYPE_VSM"};function Ip(n){return Dp[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Np={[Ci]:"ENVMAP_MODE_REFRACTION"};function Up(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":Np[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Fp={[tl]:"ENVMAP_BLENDING_MULTIPLY",[Ec]:"ENVMAP_BLENDING_MIX",[Tc]:"ENVMAP_BLENDING_ADD"};function Op(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":Fp[n.combine]||"ENVMAP_BLENDING_NONE"}function Bp(n,e,t,i){const r=n.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const u=Ip(t),l=t.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",m=Up(t),h=Op(t),d=Ap(t),g=bp(s),_=r.createProgram();let T,f,p=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(T=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(bi).join(`
`),T.length>0&&(T+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(bi).join(`
`),f.length>0&&(f+=`
`)):(T=[Do(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+m:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+t.diffuseRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+u:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(bi).join(`
`),f=[Do(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+m:"",t.envMap?"#define "+h:"",t.envMapPMREM?"#define ENVMAP_MAX_LOD "+t.envMapMaxLod+".0":"",t.envMapPMREM?"#define ENVMAP_SIZE "+t.envMapSize+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+u:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==on?"#define TONE_MAPPING":"",t.toneMapping!==on?qe.tonemapping_pars_fragment:"",t.toneMapping!==on?Tp("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",qe.colorspace_pars_fragment,Mp("linearToOutputTexel",t.outputColorSpace),yp(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(bi).join(`
`)),a=aa(a),a=Co(a,t),a=Po(a,t),o=aa(o),o=Co(o,t),o=Po(o,t),a=Lo(a),o=Lo(o),t.isRawShaderMaterial!==!0&&(p=`#version 300 es
`,T=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+T,f=["#define varying in",t.glslVersion===na?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===na?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const E=p+T+a,w=p+f+o,A=bo(r,r.VERTEX_SHADER,E),R=bo(r,r.FRAGMENT_SHADER,w);r.attachShader(_,A),r.attachShader(_,R),t.index0AttributeName!==void 0?r.bindAttribLocation(_,0,t.index0AttributeName):t.hasPositionAttribute===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_);function x(P){if(n.debug.checkShaderErrors){const L=r.getProgramInfoLog(_)||"",U=r.getShaderInfoLog(A)||"",O=r.getShaderInfoLog(R)||"",I=L.trim(),k=U.trim(),Y=O.trim();let z=!0,ne=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(z=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,_,A,R);else{const q=wo(r,A,"vertex"),te=wo(r,R,"fragment");nt("WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+I+`
`+q+`
`+te)}else I!==""?ze("WebGLProgram: Program Info Log:",I):(k===""||Y==="")&&(ne=!1);ne&&(P.diagnostics={runnable:z,programLog:I,vertexShader:{log:k,prefix:T},fragmentShader:{log:Y,prefix:f}})}r.deleteShader(A),r.deleteShader(R),c=new vr(r,_),S=Rp(r,_)}let c;this.getUniforms=function(){return c===void 0&&x(this),c};let S;this.getAttributes=function(){return S===void 0&&x(this),S};let y=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=r.getProgramParameter(_,_p)),y},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=xp++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=A,this.fragmentShader=R,this}let zp=0;class Gp{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){const r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(i)===!1&&(r.add(i),i.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new Hp(e),t.set(e,i)),i}}class Hp{constructor(e){this.id=zp++,this.code=e,this.usedTimes=0}}function Vp(n){return n===qn||n===Rr||n===wr}function kp(n,e,t,i,r,s){const a=new Al,o=new Gp,u=new Set,l=[],m=new Map,h=i.logarithmicDepthBuffer,d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(c){return u.add(c),c===0?"uv":`uv${c}`}function _(c,S,y,P,L,U){const O=P.fog,I=L.geometry,k=c.isMeshStandardMaterial||c.isMeshLambertMaterial||c.isMeshPhongMaterial?P.environment:null,Y=c.isMeshStandardMaterial||c.isMeshLambertMaterial&&!c.envMap||c.isMeshPhongMaterial&&!c.envMap,z=e.get(c.envMap||k,Y),ne=d[c.type];let q=i.precision;c.precision!==null&&(q=i.getMaxPrecision(c.precision),q!==c.precision&&ze("WebGLProgram.getParameters:",c.precision,"not supported, using",q,"instead."));const te=I.morphAttributes.position||I.morphAttributes.normal||I.morphAttributes.color,ie=te!==void 0?te.length:0;let Ae=0;I.morphAttributes.position!==void 0&&(Ae=1),I.morphAttributes.normal!==void 0&&(Ae=2),I.morphAttributes.color!==void 0&&(Ae=3);let Te,Z,he,ye;if(ne){const Se=nn[ne];Te=Se.vertexShader,Z=Se.fragmentShader}else{Te=c.vertexShader,Z=c.fragmentShader;const Se=o.getVertexShaderStage(c),rt=o.getFragmentShaderStage(c);o.update(c,Se,rt),he=Se.id,ye=rt.id}const Pe=n.getRenderTarget(),_e=n.state.buffers.depth.getReversed(),Oe=L.isInstancedMesh===!0,C=L.isBatchedMesh===!0,B=!!c.map,J=!!c.matcap,se=!!z,re=se&&z.isPMREMTexture===!0,Le=!!c.aoMap,ve=!!c.lightMap,Re=!!c.bumpMap&&c.wireframe===!1,Ie=!!c.normalMap,We=!!c.displacementMap,Ne=!!c.emissiveMap,Ke=!!c.metalnessMap,at=!!c.roughnessMap,ct=c.anisotropy>0,F=c.clearcoat>0,Ct=c.diffuseRoughness>0,Ye=c.dispersion>0,ft=c.retroreflectivity>0,xe=c.iridescence>0,_t=c.sheen>0,Be=c.transmission>0,Ge=ct&&!!c.anisotropyMap,b=F&&!!c.clearcoatMap,v=F&&!!c.clearcoatNormalMap,H=F&&!!c.clearcoatRoughnessMap,ae=Ct&&!!c.diffuseRoughnessMap,ee=xe&&!!c.iridescenceMap,ce=xe&&!!c.iridescenceThicknessMap,me=_t&&!!c.sheenColorMap,$=_t&&!!c.sheenRoughnessMap,Q=!!c.specularMap,fe=!!c.specularColorMap,D=!!c.specularIntensityMap,j=Be&&!!c.transmissionMap,K=Be&&!!c.thicknessMap,de=!!c.gradientMap,le=!!c.alphaMap,ue=c.alphaTest>0,Ue=!!c.alphaHash,Xe=!!c.extensions;let oe=on;c.toneMapped&&(Pe===null||Pe.isXRRenderTarget===!0)&&(oe=n.toneMapping);const Fe=re?z.isCompressedCubeTexture?z.image[0].mipmaps:z.mipmaps:null,ke={shaderID:ne,shaderType:c.type,shaderName:c.name,vertexShader:Te,fragmentShader:Z,defines:c.defines,customVertexShaderID:he,customFragmentShaderID:ye,isRawShaderMaterial:c.isRawShaderMaterial===!0,glslVersion:c.glslVersion,precision:q,batching:C,batchingColor:C&&L._colorsTexture!==null,instancing:Oe,instancingColor:Oe&&L.instanceColor!==null,instancingMorph:Oe&&L.morphTexture!==null,outputColorSpace:Pe===null?n.outputColorSpace:Pe.isXRRenderTarget===!0?Pe.texture.colorSpace:Je.workingColorSpace,alphaToCoverage:!!c.alphaToCoverage,map:B,matcap:J,envMap:se,envMapMode:se&&z.mapping,envMapPMREM:re,envMapMaxLod:re?Fe.length-1:null,envMapSize:re?Fe[0].width:null,aoMap:Le,lightMap:ve,bumpMap:Re,normalMap:Ie,displacementMap:We,emissiveMap:Ne,normalMapObjectSpace:Ie&&c.normalMapType===bc,normalMapTangentSpace:Ie&&c.normalMapType===Ha,packedNormalMap:Ie&&c.normalMapType===Ha&&Vp(c.normalMap.format),metalnessMap:Ke,roughnessMap:at,anisotropy:ct,anisotropyMap:Ge,clearcoat:F,clearcoatMap:b,clearcoatNormalMap:v,clearcoatRoughnessMap:H,diffuseRoughness:Ct,diffuseRoughnessMap:ae,dispersion:Ye,retroreflection:ft,iridescence:xe,iridescenceMap:ee,iridescenceThicknessMap:ce,sheen:_t,sheenColorMap:me,sheenRoughnessMap:$,specularMap:Q,specularColorMap:fe,specularIntensityMap:D,transmission:Be,transmissionMap:j,thicknessMap:K,gradientMap:de,opaque:c.transparent===!1&&c.blending===wi&&c.alphaToCoverage===!1,alphaMap:le,alphaTest:ue,alphaHash:Ue,combine:c.combine,mapUv:B&&g(c.map.channel),aoMapUv:Le&&g(c.aoMap.channel),lightMapUv:ve&&g(c.lightMap.channel),bumpMapUv:Re&&g(c.bumpMap.channel),normalMapUv:Ie&&g(c.normalMap.channel),displacementMapUv:We&&g(c.displacementMap.channel),emissiveMapUv:Ne&&g(c.emissiveMap.channel),metalnessMapUv:Ke&&g(c.metalnessMap.channel),roughnessMapUv:at&&g(c.roughnessMap.channel),anisotropyMapUv:Ge&&g(c.anisotropyMap.channel),clearcoatMapUv:b&&g(c.clearcoatMap.channel),clearcoatNormalMapUv:v&&g(c.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:H&&g(c.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:ae&&g(c.diffuseRoughnessMap.channel),iridescenceMapUv:ee&&g(c.iridescenceMap.channel),iridescenceThicknessMapUv:ce&&g(c.iridescenceThicknessMap.channel),sheenColorMapUv:me&&g(c.sheenColorMap.channel),sheenRoughnessMapUv:$&&g(c.sheenRoughnessMap.channel),specularMapUv:Q&&g(c.specularMap.channel),specularColorMapUv:fe&&g(c.specularColorMap.channel),specularIntensityMapUv:D&&g(c.specularIntensityMap.channel),transmissionMapUv:j&&g(c.transmissionMap.channel),thicknessMapUv:K&&g(c.thicknessMap.channel),alphaMapUv:le&&g(c.alphaMap.channel),vertexTangents:!!I.attributes.tangent&&(Ie||ct),vertexNormals:!!I.attributes.normal,vertexColors:c.vertexColors,vertexAlphas:c.vertexColors===!0&&!!I.attributes.color&&I.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!I.attributes.uv&&(B||le),fog:!!O,useFog:c.fog===!0,fogExp2:!!O&&O.isFogExp2,flatShading:c.wireframe===!1&&(c.flatShading===!0||I.attributes.normal===void 0&&Ie===!1&&(c.isMeshLambertMaterial||c.isMeshPhongMaterial||c.isMeshStandardMaterial||c.isMeshPhysicalMaterial)),sizeAttenuation:c.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:_e,skinning:L.isSkinnedMesh===!0,hasPositionAttribute:I.attributes.position!==void 0,morphTargets:I.morphAttributes.position!==void 0,morphNormals:I.morphAttributes.normal!==void 0,morphColors:I.morphAttributes.color!==void 0,morphTargetsCount:ie,morphTextureStride:Ae,numSunLights:S.sun.length,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numSunLightShadows:S.sunShadowMap.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numLightProbeGrids:U.filter(Se=>Se.texture!==null).length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:c.dithering,shadowMapEnabled:n.shadowMap.enabled&&y.length>0,shadowMapType:n.shadowMap.type,toneMapping:oe,decodeVideoTexture:B&&c.map.isVideoTexture===!0&&Je.getTransfer(c.map.colorSpace)===st,decodeVideoTextureEmissive:Ne&&c.emissiveMap.isVideoTexture===!0&&Je.getTransfer(c.emissiveMap.colorSpace)===st,premultipliedAlpha:c.premultipliedAlpha,doubleSided:c.side===rn,flipSided:c.side===Ft,useDepthPacking:c.depthPacking>=0,depthPacking:c.depthPacking||0,index0AttributeName:c.index0AttributeName,extensionClipCullDistance:Xe&&c.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Xe&&c.extensions.multiDraw===!0||C)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:c.customProgramCacheKey()};return ke.vertexUv1s=u.has(1),ke.vertexUv2s=u.has(2),ke.vertexUv3s=u.has(3),u.clear(),ke}function T(c){const S=[];if(c.shaderID?S.push(c.shaderID):(S.push(c.customVertexShaderID),S.push(c.customFragmentShaderID)),c.defines!==void 0)for(const y in c.defines)S.push(y),S.push(c.defines[y]);return c.isRawShaderMaterial===!1&&(f(S,c),p(S,c),S.push(n.outputColorSpace)),S.push(c.customProgramCacheKey),S.join()}function f(c,S){c.push(S.precision),c.push(S.outputColorSpace),c.push(S.envMapMode),c.push(S.envMapPMREM),c.push(S.envMapMaxLod),c.push(S.envMapSize),c.push(S.mapUv),c.push(S.alphaMapUv),c.push(S.lightMapUv),c.push(S.aoMapUv),c.push(S.bumpMapUv),c.push(S.normalMapUv),c.push(S.displacementMapUv),c.push(S.emissiveMapUv),c.push(S.metalnessMapUv),c.push(S.roughnessMapUv),c.push(S.anisotropyMapUv),c.push(S.clearcoatMapUv),c.push(S.clearcoatNormalMapUv),c.push(S.clearcoatRoughnessMapUv),c.push(S.diffuseRoughnessMapUv),c.push(S.iridescenceMapUv),c.push(S.iridescenceThicknessMapUv),c.push(S.sheenColorMapUv),c.push(S.sheenRoughnessMapUv),c.push(S.specularMapUv),c.push(S.specularColorMapUv),c.push(S.specularIntensityMapUv),c.push(S.transmissionMapUv),c.push(S.thicknessMapUv),c.push(S.combine),c.push(S.fogExp2),c.push(S.sizeAttenuation),c.push(S.morphTargetsCount),c.push(S.numSunLights),c.push(S.numDirLights),c.push(S.numPointLights),c.push(S.numSpotLights),c.push(S.numSpotLightMaps),c.push(S.numHemiLights),c.push(S.numRectAreaLights),c.push(S.numSunLightShadows),c.push(S.numDirLightShadows),c.push(S.numPointLightShadows),c.push(S.numSpotLightShadows),c.push(S.numSpotLightShadowsWithMaps),c.push(S.numLightProbes),c.push(S.numLightProbeGrids),c.push(S.shadowMapType),c.push(S.toneMapping),c.push(S.numClippingPlanes),c.push(S.numClipIntersection),c.push(S.depthPacking)}function p(c,S){a.disableAll(),S.instancing&&a.enable(0),S.instancingColor&&a.enable(1),S.instancingMorph&&a.enable(2),S.matcap&&a.enable(3),S.envMap&&a.enable(4),S.normalMapObjectSpace&&a.enable(5),S.normalMapTangentSpace&&a.enable(6),S.clearcoat&&a.enable(7),S.iridescence&&a.enable(8),S.alphaTest&&a.enable(9),S.vertexColors&&a.enable(10),S.vertexAlphas&&a.enable(11),S.vertexUv1s&&a.enable(12),S.vertexUv2s&&a.enable(13),S.vertexUv3s&&a.enable(14),S.vertexTangents&&a.enable(15),S.anisotropy&&a.enable(16),S.alphaHash&&a.enable(17),S.batching&&a.enable(18),S.dispersion&&a.enable(19),S.retroreflection&&a.enable(24),S.diffuseRoughness&&a.enable(25),S.batchingColor&&a.enable(20),S.gradientMap&&a.enable(21),S.packedNormalMap&&a.enable(22),S.vertexNormals&&a.enable(23),c.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.reversedDepthBuffer&&a.enable(4),S.skinning&&a.enable(5),S.morphTargets&&a.enable(6),S.morphNormals&&a.enable(7),S.morphColors&&a.enable(8),S.premultipliedAlpha&&a.enable(9),S.shadowMapEnabled&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),S.decodeVideoTextureEmissive&&a.enable(20),S.alphaToCoverage&&a.enable(21),S.numLightProbeGrids>0&&a.enable(22),S.hasPositionAttribute&&a.enable(23),c.push(a.mask)}function E(c){const S=d[c.type];let y;if(S){const P=nn[S];y=mu.clone(P.uniforms)}else y=c.uniforms;return y}function w(c,S){let y=m.get(S);return y!==void 0?++y.usedTimes:(y=new Bp(n,S,c,r),l.push(y),m.set(S,y)),y}function A(c){if(--c.usedTimes===0){const S=l.indexOf(c);l[S]=l[l.length-1],l.pop(),m.delete(c.cacheKey),c.destroy()}}function R(c){o.remove(c)}function x(){o.dispose()}return{getParameters:_,getProgramCacheKey:T,getUniforms:E,acquireProgram:w,releaseProgram:A,releaseShaderCache:R,programs:l,dispose:x}}function Wp(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function r(a,o,u){n.get(a)[o]=u}function s(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:s}}function Xp(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function Io(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function No(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function a(d){let g=0;return d.isInstancedMesh&&(g+=2),d.isSkinnedMesh&&(g+=1),g}function o(d,g,_,T,f,p){let E=n[e];return E===void 0?(E={id:d.id,object:d,geometry:g,material:_,materialVariant:a(d),groupOrder:T,renderOrder:d.renderOrder,z:f,group:p},n[e]=E):(E.id=d.id,E.object=d,E.geometry=g,E.material=_,E.materialVariant=a(d),E.groupOrder=T,E.renderOrder=d.renderOrder,E.z=f,E.group=p),e++,E}function u(d,g,_,T,f,p,E){E.reversedDepth===!0&&(f=-f);const w=o(d,g,_,T,f,p);_.transmission>0?i.push(w):_.transparent===!0?r.push(w):t.push(w)}function l(d,g,_,T,f,p){const E=o(d,g,_,T,f,p);_.transmission>0?i.unshift(E):_.transparent===!0?r.unshift(E):t.unshift(E)}function m(d,g){t.length>1&&t.sort(d||Xp),i.length>1&&i.sort(g||Io),r.length>1&&r.sort(g||Io)}function h(){for(let d=e,g=n.length;d<g;d++){const _=n[d];if(_.id===null)break;_.id=null,_.object=null,_.geometry=null,_.material=null,_.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:u,unshift:l,finish:h,sort:m}}function qp(){let n=new WeakMap;function e(i,r){const s=n.get(i);let a;return s===void 0?(a=new No,n.set(i,[a])):r>=s.length?(a=new No,s.push(a)):a=s[r],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function Yp(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new W,color:new et};break;case"SpotLight":t={position:new W,direction:new W,color:new et,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new W,color:new et,distance:0,decay:0};break;case"HemisphereLight":t={direction:new W,skyColor:new et,groundColor:new et};break;case"RectAreaLight":t={color:new et,position:new W,halfWidth:new W,halfHeight:new W};break}return n[e.id]=t,t}}}function Kp(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let Zp=0;function $p(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function Jp(n){const e=new Yp,t=Kp(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new W);const r=new W,s=new ht,a=new ht;function o(l){let m=0,h=0,d=0;for(let U=0;U<9;U++)i.probe[U].set(0,0,0);let g=0,_=0,T=0,f=0,p=0,E=0,w=0,A=0,R=0,x=0,c=0,S=0,y=0,P=0;l.sort($p);for(let U=0,O=l.length;U<O;U++){const I=l[U],k=I.color,Y=I.intensity,z=I.distance;let ne=null;if(I.shadow&&I.shadow.map&&(I.shadow.map.texture.format===qn?ne=I.shadow.map.texture:ne=I.shadow.map.depthTexture||I.shadow.map.texture),I.isAmbientLight)m+=k.r*Y,h+=k.g*Y,d+=k.b*Y;else if(I.isLightProbe){for(let q=0;q<9;q++)i.probe[q].addScaledVector(I.sh.coefficients[q],Y);P++}else if(I.isSunLight){const q=e.get(I);if(q.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){const te=I.shadow,ie=t.get(I);ie.shadowIntensity=te.intensity,ie.shadowBias=te.bias,ie.shadowNormalBias=te.normalBias,ie.shadowRadius=te.radius,ie.shadowMapSize.copy(te.mapSize).multiply(te.getFrameExtents()),i.sunShadow[_]=ie,i.sunShadowMap[_]=ne;const Ae=te.getViewportCount();for(let Te=0;Te<Ae;Te++)i.sunShadowMatrix[T+Te]=te.getMatrix(Te),i.sunShadowCascade[T+Te]=te._cascadeData[Te];T+=Ae,_++}i.sun[g]=q,g++}else if(I.isDirectionalLight){const q=e.get(I);if(q.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){const te=I.shadow,ie=t.get(I);ie.shadowIntensity=te.intensity,ie.shadowBias=te.bias,ie.shadowNormalBias=te.normalBias,ie.shadowRadius=te.radius,ie.shadowMapSize=te.mapSize,i.directionalShadow[f]=ie,i.directionalShadowMap[f]=ne,i.directionalShadowMatrix[f]=I.shadow.matrix,R++}i.directional[f]=q,f++}else if(I.isSpotLight){const q=e.get(I);q.position.setFromMatrixPosition(I.matrixWorld),q.color.copy(k).multiplyScalar(Y),q.distance=z,q.coneCos=Math.cos(I.angle),q.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),q.decay=I.decay,i.spot[E]=q;const te=I.shadow;if(I.map&&(i.spotLightMap[S]=I.map,S++,te.updateMatrices(I),I.castShadow&&y++),i.spotLightMatrix[E]=te.matrix,I.castShadow){const ie=t.get(I);ie.shadowIntensity=te.intensity,ie.shadowBias=te.bias,ie.shadowNormalBias=te.normalBias,ie.shadowRadius=te.radius,ie.shadowMapSize=te.mapSize,i.spotShadow[E]=ie,i.spotShadowMap[E]=ne,c++}E++}else if(I.isRectAreaLight){const q=e.get(I);q.color.copy(k).multiplyScalar(Y),q.halfWidth.set(I.width*.5,0,0),q.halfHeight.set(0,I.height*.5,0),i.rectArea[w]=q,w++}else if(I.isPointLight){const q=e.get(I);if(q.color.copy(I.color).multiplyScalar(I.intensity),q.distance=I.distance,q.decay=I.decay,I.castShadow){const te=I.shadow,ie=t.get(I);ie.shadowIntensity=te.intensity,ie.shadowBias=te.bias,ie.shadowNormalBias=te.normalBias,ie.shadowRadius=te.radius,ie.shadowMapSize=te.mapSize,ie.shadowCameraNear=te.camera.near,ie.shadowCameraFar=te.camera.far,i.pointShadow[p]=ie,i.pointShadowMap[p]=ne,i.pointShadowMatrix[p]=I.shadow.matrix,x++}i.point[p]=q,p++}else if(I.isHemisphereLight){const q=e.get(I);q.skyColor.copy(I.color).multiplyScalar(Y),q.groundColor.copy(I.groundColor).multiplyScalar(Y),i.hemi[A]=q,A++}}w>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Me.LTC_FLOAT_1,i.rectAreaLTC2=Me.LTC_FLOAT_2):(i.rectAreaLTC1=Me.LTC_HALF_1,i.rectAreaLTC2=Me.LTC_HALF_2)),i.ambient[0]=m,i.ambient[1]=h,i.ambient[2]=d;const L=i.hash;(L.sunLength!==g||L.directionalLength!==f||L.pointLength!==p||L.spotLength!==E||L.rectAreaLength!==w||L.hemiLength!==A||L.numSunShadows!==_||L.numDirectionalShadows!==R||L.numPointShadows!==x||L.numSpotShadows!==c||L.numSpotMaps!==S||L.numLightProbes!==P)&&(i.sun.length=g,i.directional.length=f,i.spot.length=E,i.rectArea.length=w,i.point.length=p,i.hemi.length=A,i.sunShadow.length=_,i.sunShadowMap.length=_,i.sunShadowMatrix.length=T,i.sunShadowCascade.length=T,i.directionalShadow.length=R,i.directionalShadowMap.length=R,i.directionalShadowMatrix.length=R,i.pointShadow.length=x,i.pointShadowMap.length=x,i.pointShadowMatrix.length=x,i.spotShadow.length=c,i.spotShadowMap.length=c,i.spotLightMatrix.length=c+S-y,i.spotLightMap.length=S,i.numSpotLightShadowsWithMaps=y,i.numLightProbes=P,L.sunLength=g,L.directionalLength=f,L.pointLength=p,L.spotLength=E,L.rectAreaLength=w,L.hemiLength=A,L.numSunShadows=_,L.numDirectionalShadows=R,L.numPointShadows=x,L.numSpotShadows=c,L.numSpotMaps=S,L.numLightProbes=P,i.version=Zp++)}function u(l,m){let h=0,d=0,g=0,_=0,T=0,f=0;const p=m.matrixWorldInverse;for(let E=0,w=l.length;E<w;E++){const A=l[E];if(A.isSunLight){const R=i.sun[h];R.direction.setFromMatrixPosition(A.matrixWorld),R.direction.transformDirection(p),h++}else if(A.isDirectionalLight){const R=i.directional[d];R.direction.setFromMatrixPosition(A.matrixWorld),r.setFromMatrixPosition(A.target.matrixWorld),R.direction.sub(r),R.direction.transformDirection(p),d++}else if(A.isSpotLight){const R=i.spot[_];R.position.setFromMatrixPosition(A.matrixWorld),R.position.applyMatrix4(p),R.direction.setFromMatrixPosition(A.matrixWorld),r.setFromMatrixPosition(A.target.matrixWorld),R.direction.sub(r),R.direction.transformDirection(p),_++}else if(A.isRectAreaLight){const R=i.rectArea[T];R.position.setFromMatrixPosition(A.matrixWorld),R.position.applyMatrix4(p),a.identity(),s.copy(A.matrixWorld),s.premultiply(p),a.extractRotation(s),R.halfWidth.set(A.width*.5,0,0),R.halfHeight.set(0,A.height*.5,0),R.halfWidth.applyMatrix4(a),R.halfHeight.applyMatrix4(a),T++}else if(A.isPointLight){const R=i.point[g];R.position.setFromMatrixPosition(A.matrixWorld),R.position.applyMatrix4(p),g++}else if(A.isHemisphereLight){const R=i.hemi[f];R.direction.setFromMatrixPosition(A.matrixWorld),R.direction.transformDirection(p),f++}}}return{setup:o,setupView:u,state:i}}function Uo(n){const e=new Jp(n),t=[],i=[],r=[];function s(h){m.camera=h,t.length=0,i.length=0,r.length=0}function a(h){h.isLightProbeGrid?r.push(h):t.push(h)}function o(h){i.push(h)}function u(){e.setup(t),r.sort((h,d)=>h.priority-d.priority||h.id-d.id)}function l(h){e.setupView(t,h)}const m={lightsArray:t,shadowsArray:i,lightProbeGridArray:r,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:m,setupLights:u,setupLightsView:l,pushLight:a,pushShadow:o}}function Qp(n){let e=new WeakMap;function t(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new Uo(n),e.set(r,[o])):s>=a.length?(o=new Uo(n),a.push(o)):o=a[s],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const jp=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,em=`uniform sampler2D shadow_pass;
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
}`,tm=[new W(1,0,0),new W(-1,0,0),new W(0,1,0),new W(0,-1,0),new W(0,0,1),new W(0,0,-1)],nm=[new W(0,-1,0),new W(0,-1,0),new W(0,0,1),new W(0,0,-1),new W(0,-1,0),new W(0,-1,0)],Fo=new ht,Ti=new W,Es=new W;function im(n,e,t){let i=new Ir;const r=new it,s=new it,a=new pt,o=new xu,u=new vu,l={},m=t.maxTextureSize,h={[Dn]:Ft,[Ft]:Dn,[rn]:rn},d=new Kn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new it},radius:{value:4}},vertexShader:jp,fragmentShader:em}),g=d.clone();g.defines.HORIZONTAL_PASS=1;const _=new un;_.setAttribute("position",new vn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const T=new Nn(_,d),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=hr;let p=this.type;this.render=function(x,c,S){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||x.length===0)return;this.type===mc&&(ze("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=hr);const y=n.getRenderTarget(),P=n.getActiveCubeFace(),L=n.getActiveMipmapLevel(),U=n.state;U.setBlending(Xn),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const O=p!==this.type;O&&c.traverse(function(I){I.material&&(Array.isArray(I.material)?I.material.forEach(k=>k.needsUpdate=!0):I.material.needsUpdate=!0)});for(let I=0,k=x.length;I<k;I++){const Y=x[I],z=Y.shadow;if(z===void 0){ze("WebGLShadowMap:",Y,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;r.copy(z.mapSize);const ne=z.getFrameExtents();r.multiply(ne),s.copy(z.mapSize),(r.x>m||r.y>m)&&(r.x>m&&(s.x=Math.floor(m/ne.x),r.x=s.x*ne.x,z.mapSize.x=s.x),r.y>m&&(s.y=Math.floor(m/ne.y),r.y=s.y*ne.y,z.mapSize.y=s.y));const q=n.state.buffers.depth.getReversed();if(z.camera._reversedDepth=q,z.map===null||O===!0){if(z.map!==null&&(z.map.depthTexture!==null&&(z.map.depthTexture.dispose(),z.map.depthTexture=null),z.map.dispose()),this.type===Ai){if(Y.isPointLight){ze("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}z.map=new kt(r.x,r.y,{format:qn,type:cn,minFilter:Ut,magFilter:Ut,generateMipmaps:!1}),z.map.texture.name=Y.name+".shadowMap",z.map.depthTexture=new Un(r.x,r.y,sn),z.map.depthTexture.name=Y.name+".shadowMapDepth",z.map.depthTexture.format=In,z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=yt,z.map.depthTexture.magFilter=yt}else Y.isPointLight?(z.map=new Hr(r.x),z.map.depthTexture=new Pl(r.x,ln)):(z.map=new kt(r.x,r.y),z.map.depthTexture=new Un(r.x,r.y,ln)),z.map.depthTexture.name=Y.name+".shadowMap",z.map.depthTexture.format=In,this.type===hr?(z.map.depthTexture.compareFunction=q?xl:_l,z.map.depthTexture.minFilter=Ut,z.map.depthTexture.magFilter=Ut):(z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=yt,z.map.depthTexture.magFilter=yt);z.camera.updateProjectionMatrix()}z.map.isWebGLCubeRenderTarget!==!0&&(z.map.width!==r.x||z.map.height!==r.y)&&z.map.setSize(r.x,r.y);const te=z.map.isWebGLCubeRenderTarget?6:z.getViewportCount();Y.isPointLight!==!0&&z.updateMatrices(Y,S);const ie=(z.camera.layers.mask&4294967294)!==0?z.camera.layers:S.layers;for(let Ae=0;Ae<te;Ae++){const Te=z.getCamera(Ae);if(Y.isPointLight){const Z=z.camera,he=z.matrix,ye=Y.distance||Z.far;ye!==Z.far&&(Z.far=ye,Z.updateProjectionMatrix()),Ti.setFromMatrixPosition(Y.matrixWorld),Z.position.copy(Ti),Es.copy(Z.position),Es.add(tm[Ae]),Z.up.copy(nm[Ae]),Z.lookAt(Es),Z.updateMatrixWorld(),he.makeTranslation(-Ti.x,-Ti.y,-Ti.z),Fo.multiplyMatrices(Z.projectionMatrix,Z.matrixWorldInverse),z._frustum.setFromProjectionMatrix(Fo,Z.coordinateSystem,Z.reversedDepth)}if(z.map.isWebGLCubeRenderTarget)n.setRenderTarget(z.map,Ae),n.clear();else{Ae===0&&(n.setRenderTarget(z.map),n.clear());const Z=z.getViewport(Ae);a.set(s.x*Z.x,s.y*Z.y,s.x*Z.z,s.y*Z.w),U.viewport(a)}i=z.getFrustum(Ae),A(c,S,Te,Y,ie,this.type)}z.isPointLightShadow!==!0&&this.type===Ai&&E(z,S),z.needsUpdate=!1}p=this.type,f.needsUpdate=!1,n.setRenderTarget(y,P,L)};function E(x,c){const S=e.update(T);d.defines.VSM_SAMPLES!==x.blurSamples&&(d.defines.VSM_SAMPLES=x.blurSamples,g.defines.VSM_SAMPLES=x.blurSamples,d.needsUpdate=!0,g.needsUpdate=!0),x.mapPass===null?x.mapPass=new kt(r.x,r.y,{format:qn,type:cn}):(x.mapPass.width!==x.map.width||x.mapPass.height!==x.map.height)&&x.mapPass.setSize(x.map.width,x.map.height),d.uniforms.shadow_pass.value=x.map.depthTexture,d.uniforms.resolution.value.set(x.map.width,x.map.height),d.uniforms.radius.value=x.radius,n.setRenderTarget(x.mapPass),n.clear(),n.renderBufferDirect(c,null,S,d,T,null),g.uniforms.shadow_pass.value=x.mapPass.texture,g.uniforms.resolution.value.set(x.map.width,x.map.height),g.uniforms.radius.value=x.radius,n.setRenderTarget(x.map),n.clear(),n.renderBufferDirect(c,null,S,g,T,null)}function w(x,c,S,y){let P=null;const L=S.isPointLight===!0?x.customDistanceMaterial:x.customDepthMaterial;if(L!==void 0)P=L;else if(P=S.isPointLight===!0?u:o,n.localClippingEnabled&&c.clipShadows===!0&&Array.isArray(c.clippingPlanes)&&c.clippingPlanes.length!==0||c.displacementMap&&c.displacementScale!==0||c.alphaMap&&c.alphaTest>0||c.map&&c.alphaTest>0||c.alphaToCoverage===!0){const U=P.uuid,O=c.uuid;let I=l[U];I===void 0&&(I={},l[U]=I);let k=I[O];k===void 0&&(k=P.clone(),I[O]=k,c.addEventListener("dispose",R)),P=k}if(P.visible=c.visible,P.wireframe=c.wireframe,y===Ai?P.side=c.shadowSide!==null?c.shadowSide:c.side:P.side=c.shadowSide!==null?c.shadowSide:h[c.side],P.alphaMap=c.alphaMap,P.alphaTest=c.alphaToCoverage===!0?.5:c.alphaTest,P.map=c.map,P.clipShadows=c.clipShadows,P.clippingPlanes=c.clippingPlanes,P.clipIntersection=c.clipIntersection,P.displacementMap=c.displacementMap,P.displacementScale=c.displacementScale,P.displacementBias=c.displacementBias,P.wireframeLinewidth=c.wireframeLinewidth,P.linewidth=c.linewidth,S.isPointLight===!0&&P.isMeshDistanceMaterial===!0){const U=n.properties.get(P);U.light=S}return P}function A(x,c,S,y,P,L){if(x.visible===!1)return;if(x.layers.test(P)&&(x.isMesh||x.isLine||x.isPoints)&&(x.castShadow||x.receiveShadow&&L===Ai)&&(!x.frustumCulled||x.intersectsFrustum(i))){x.modelViewMatrix.multiplyMatrices(S.matrixWorldInverse,x.matrixWorld);const I=e.update(x),k=x.material;if(Array.isArray(k)){const Y=I.groups;for(let z=0,ne=Y.length;z<ne;z++){const q=Y[z],te=k[q.materialIndex];if(te&&te.visible){const ie=w(x,te,y,L);x.onBeforeShadow(n,x,c,S,I,ie,q),n.renderBufferDirect(S,null,I,ie,x,q),x.onAfterShadow(n,x,c,S,I,ie,q)}}}else if(k.visible){const Y=w(x,k,y,L);x.onBeforeShadow(n,x,c,S,I,Y,null),n.renderBufferDirect(S,null,I,Y,x,null),x.onAfterShadow(n,x,c,S,I,Y,null)}}const O=x.children;for(let I=0,k=O.length;I<k;I++)A(O[I],c,S,y,P,L)}function R(x){x.target.removeEventListener("dispose",R);for(const S in l){const y=l[S],P=x.target.uuid;P in y&&(y[P].dispose(),delete y[P])}}}function rm(n,e){function t(){let D=!1;const j=new pt;let K=null;const de=new pt(0,0,0,0);return{setMask:function(le){K!==le&&!D&&(n.colorMask(le,le,le,le),K=le)},setLocked:function(le){D=le},setClear:function(le,ue,Ue,Xe,oe){oe===!0&&(le*=Xe,ue*=Xe,Ue*=Xe),j.set(le,ue,Ue,Xe),de.equals(j)===!1&&(n.clearColor(le,ue,Ue,Xe),de.copy(j))},reset:function(){D=!1,K=null,de.set(-1,0,0,0)}}}function i(){let D=!1,j=!1,K=null,de=null,le=null;return{setReversed:function(ue){if(j!==ue){const Ue=e.get("EXT_clip_control");ue?Ue.clipControlEXT(Ue.LOWER_LEFT_EXT,Ue.ZERO_TO_ONE_EXT):Ue.clipControlEXT(Ue.LOWER_LEFT_EXT,Ue.NEGATIVE_ONE_TO_ONE_EXT),j=ue;const Xe=le;le=null,this.setClear(Xe)}},getReversed:function(){return j},setTest:function(ue){ue?_e(n.DEPTH_TEST):Oe(n.DEPTH_TEST)},setMask:function(ue){K!==ue&&!D&&(n.depthMask(ue),K=ue)},setFunc:function(ue){if(j&&(ue=Oc[ue]),de!==ue){switch(ue){case Sr:n.depthFunc(n.NEVER);break;case Mr:n.depthFunc(n.ALWAYS);break;case Er:n.depthFunc(n.LESS);break;case ui:n.depthFunc(n.LEQUAL);break;case Tr:n.depthFunc(n.EQUAL);break;case yr:n.depthFunc(n.GEQUAL);break;case Ar:n.depthFunc(n.GREATER);break;case br:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}de=ue}},setLocked:function(ue){D=ue},setClear:function(ue){le!==ue&&(le=ue,j&&(ue=1-ue),n.clearDepth(ue))},reset:function(){D=!1,K=null,de=null,le=null,j=!1}}}function r(){let D=!1,j=null,K=null,de=null,le=null,ue=null,Ue=null,Xe=null,oe=null;return{setTest:function(Fe){D||(Fe?_e(n.STENCIL_TEST):Oe(n.STENCIL_TEST))},setMask:function(Fe){j!==Fe&&!D&&(n.stencilMask(Fe),j=Fe)},setFunc:function(Fe,ke,Se){(K!==Fe||de!==ke||le!==Se)&&(n.stencilFunc(Fe,ke,Se),K=Fe,de=ke,le=Se)},setOp:function(Fe,ke,Se){(ue!==Fe||Ue!==ke||Xe!==Se)&&(n.stencilOp(Fe,ke,Se),ue=Fe,Ue=ke,Xe=Se)},setLocked:function(Fe){D=Fe},setClear:function(Fe){oe!==Fe&&(n.clearStencil(Fe),oe=Fe)},reset:function(){D=!1,j=null,K=null,de=null,le=null,ue=null,Ue=null,Xe=null,oe=null}}}const s=new t,a=new i,o=new r;let u={};const l=new WeakMap;let m={},h={},d={},g=new WeakMap,_=[],T=null,f=!1,p=null,E=null,w=null,A=null,R=null,x=null,c=null,S=new et(0,0,0),y=0,P=!1,L=null,U=null,O=null,I=null,k=null;const Y=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let z=!1,ne=0;const q=n.getParameter(n.VERSION);q.indexOf("WebGL")!==-1?(ne=parseFloat(/^WebGL (\d)/.exec(q)[1]),z=ne>=1):q.indexOf("OpenGL ES")!==-1&&(ne=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),z=ne>=2);let te=null,ie={};const Ae=n.getParameter(n.SCISSOR_BOX),Te=n.getParameter(n.VIEWPORT),Z=new pt().fromArray(Ae),he=new pt().fromArray(Te);function ye(D,j,K,de){const le=new Uint8Array(4),ue=n.createTexture();n.bindTexture(D,ue),n.texParameteri(D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(D,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ue=0;Ue<K;Ue++)D===n.TEXTURE_3D||D===n.TEXTURE_2D_ARRAY?n.texImage3D(j,0,n.RGBA,1,1,de,0,n.RGBA,n.UNSIGNED_BYTE,le):n.texImage2D(j+Ue,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,le);return ue}const Pe={};Pe[n.TEXTURE_2D]=ye(n.TEXTURE_2D,n.TEXTURE_2D,1),Pe[n.TEXTURE_CUBE_MAP]=ye(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Pe[n.TEXTURE_2D_ARRAY]=ye(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Pe[n.TEXTURE_3D]=ye(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),_e(n.DEPTH_TEST),a.setFunc(ui),Re(!1),Ie(Oa),_e(n.CULL_FACE),Le(Xn);function _e(D){m[D]!==!0&&(n.enable(D),m[D]=!0)}function Oe(D){m[D]!==!1&&(n.disable(D),m[D]=!1)}function C(D,j){return d[D]!==j?(n.bindFramebuffer(D,j),d[D]=j,D===n.DRAW_FRAMEBUFFER&&(d[n.FRAMEBUFFER]=j),D===n.FRAMEBUFFER&&(d[n.DRAW_FRAMEBUFFER]=j),!0):!1}function B(D,j){let K=_,de=!1;if(D){K=g.get(j),K===void 0&&(K=[],g.set(j,K));const le=D.textures;if(K.length!==le.length||K[0]!==n.COLOR_ATTACHMENT0){for(let ue=0,Ue=le.length;ue<Ue;ue++)K[ue]=n.COLOR_ATTACHMENT0+ue;K.length=le.length,de=!0}}else K[0]!==n.BACK&&(K[0]=n.BACK,de=!0);de&&n.drawBuffers(K)}function J(D){return T!==D?(n.useProgram(D),T=D,!0):!1}const se={[Wn]:n.FUNC_ADD,[Wo]:n.FUNC_SUBTRACT,[Xo]:n.FUNC_REVERSE_SUBTRACT};se[gc]=n.MIN,se[_c]=n.MAX;const re={[qo]:n.ZERO,[Yo]:n.ONE,[Ko]:n.SRC_COLOR,[oa]:n.SRC_ALPHA,[el]:n.SRC_ALPHA_SATURATE,[Qo]:n.DST_COLOR,[$o]:n.DST_ALPHA,[Zo]:n.ONE_MINUS_SRC_COLOR,[la]:n.ONE_MINUS_SRC_ALPHA,[jo]:n.ONE_MINUS_DST_COLOR,[Jo]:n.ONE_MINUS_DST_ALPHA,[xc]:n.CONSTANT_COLOR,[vc]:n.ONE_MINUS_CONSTANT_COLOR,[Sc]:n.CONSTANT_ALPHA,[Mc]:n.ONE_MINUS_CONSTANT_ALPHA};function Le(D,j,K,de,le,ue,Ue,Xe,oe,Fe){if(D===Xn){f===!0&&(Oe(n.BLEND),f=!1);return}if(f===!1&&(_e(n.BLEND),f=!0),D!==ko){if(D!==p||Fe!==P){if((E!==Wn||R!==Wn)&&(n.blendEquation(n.FUNC_ADD),E=Wn,R=Wn),Fe)switch(D){case wi:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ba:n.blendFunc(n.ONE,n.ONE);break;case za:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Ga:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:nt("WebGLState: Invalid blending: ",D);break}else switch(D){case wi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ba:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case za:nt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Ga:nt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:nt("WebGLState: Invalid blending: ",D);break}w=null,A=null,x=null,c=null,S.set(0,0,0),y=0,p=D,P=Fe}return}le=le||j,ue=ue||K,Ue=Ue||de,(j!==E||le!==R)&&(n.blendEquationSeparate(se[j],se[le]),E=j,R=le),(K!==w||de!==A||ue!==x||Ue!==c)&&(n.blendFuncSeparate(re[K],re[de],re[ue],re[Ue]),w=K,A=de,x=ue,c=Ue),(Xe.equals(S)===!1||oe!==y)&&(n.blendColor(Xe.r,Xe.g,Xe.b,oe),S.copy(Xe),y=oe),p=D,P=!1}function ve(D,j){D.side===rn?Oe(n.CULL_FACE):_e(n.CULL_FACE);let K=D.side===Ft;j&&(K=!K),Re(K),D.blending===wi&&D.transparent===!1?Le(Xn):Le(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),s.setMask(D.colorWrite);const de=D.stencilWrite;o.setTest(de),de&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),Ne(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?_e(n.SAMPLE_ALPHA_TO_COVERAGE):Oe(n.SAMPLE_ALPHA_TO_COVERAGE)}function Re(D){L!==D&&(D?n.frontFace(n.CW):n.frontFace(n.CCW),L=D)}function Ie(D){D!==hc?(_e(n.CULL_FACE),D!==U&&(D===Oa?n.cullFace(n.BACK):D===pc?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Oe(n.CULL_FACE),U=D}function We(D){D!==O&&(z&&n.lineWidth(D),O=D)}function Ne(D,j,K){D?(_e(n.POLYGON_OFFSET_FILL),(I!==j||k!==K)&&(I=j,k=K,a.getReversed()&&(j=-j,K=-K),n.polygonOffset(j,K))):Oe(n.POLYGON_OFFSET_FILL)}function Ke(D){D?_e(n.SCISSOR_TEST):Oe(n.SCISSOR_TEST)}function at(D){D===void 0&&(D=n.TEXTURE0+Y-1),te!==D&&(n.activeTexture(D),te=D)}function ct(D,j,K){K===void 0&&(te===null?K=n.TEXTURE0+Y-1:K=te);let de=ie[K];de===void 0&&(de={type:void 0,texture:void 0},ie[K]=de),(de.type!==D||de.texture!==j)&&(te!==K&&(n.activeTexture(K),te=K),n.bindTexture(D,j||Pe[D]),de.type=D,de.texture=j)}function F(){const D=ie[te];D!==void 0&&D.type!==void 0&&(n.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function Ct(){try{n.compressedTexImage2D(...arguments)}catch(D){nt("WebGLState:",D)}}function Ye(){try{n.compressedTexImage3D(...arguments)}catch(D){nt("WebGLState:",D)}}function ft(){try{n.texSubImage2D(...arguments)}catch(D){nt("WebGLState:",D)}}function xe(){try{n.texSubImage3D(...arguments)}catch(D){nt("WebGLState:",D)}}function _t(){try{n.compressedTexSubImage2D(...arguments)}catch(D){nt("WebGLState:",D)}}function Be(){try{n.compressedTexSubImage3D(...arguments)}catch(D){nt("WebGLState:",D)}}function Ge(){try{n.texStorage2D(...arguments)}catch(D){nt("WebGLState:",D)}}function b(){try{n.texStorage3D(...arguments)}catch(D){nt("WebGLState:",D)}}function v(){try{n.texImage2D(...arguments)}catch(D){nt("WebGLState:",D)}}function H(){try{n.texImage3D(...arguments)}catch(D){nt("WebGLState:",D)}}function ae(D){return h[D]!==void 0?h[D]:n.getParameter(D)}function ee(D,j){h[D]!==j&&(n.pixelStorei(D,j),h[D]=j)}function ce(D){Z.equals(D)===!1&&(n.scissor(D.x,D.y,D.z,D.w),Z.copy(D))}function me(D){he.equals(D)===!1&&(n.viewport(D.x,D.y,D.z,D.w),he.copy(D))}function $(D,j){let K=l.get(j);K===void 0&&(K=new WeakMap,l.set(j,K));let de=K.get(D);de===void 0&&(de=n.getUniformBlockIndex(j,D.name),n.uniformBlockBinding(j,de,de),K.set(D,de))}function Q(D,j,K){const le=l.get(j).get(D);u[le]!==K&&(n.bindBufferBase(n.UNIFORM_BUFFER,le,K),u[le]=K)}function fe(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),m={},h={},te=null,ie={},d={},u={},g=new WeakMap,_=[],T=null,f=!1,p=null,E=null,w=null,A=null,R=null,x=null,c=null,S=new et(0,0,0),y=0,P=!1,L=null,U=null,O=null,I=null,k=null,Z.set(0,0,n.canvas.width,n.canvas.height),he.set(0,0,n.canvas.width,n.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:_e,disable:Oe,bindFramebuffer:C,drawBuffers:B,useProgram:J,setBlending:Le,setMaterial:ve,setFlipSided:Re,setCullFace:Ie,setLineWidth:We,setPolygonOffset:Ne,setScissorTest:Ke,activeTexture:at,bindTexture:ct,unbindTexture:F,compressedTexImage2D:Ct,compressedTexImage3D:Ye,texImage2D:v,texImage3D:H,pixelStorei:ee,getParameter:ae,updateUBOMapping:$,uniformBlockBinding:Q,texStorage2D:Ge,texStorage3D:b,texSubImage2D:ft,texSubImage3D:xe,compressedTexSubImage2D:_t,compressedTexSubImage3D:Be,scissor:ce,viewport:me,reset:fe}}function sm(n,e,t,i,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,u=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new it,m=new WeakMap,h=new Set;let d;const g=new WeakMap,_=new Set,T=new FinalizationRegistry(b=>_.delete(b));let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(b,v){return f?new OffscreenCanvas(b,v):Lr("canvas")}function E(b,v,H){let ae=1;const ee=Ge(b);if((ee.width>H||ee.height>H)&&(ae=H/Math.max(ee.width,ee.height)),ae<1)if(typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&b instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&b instanceof ImageBitmap||typeof VideoFrame<"u"&&b instanceof VideoFrame){const ce=Math.floor(ae*ee.width),me=Math.floor(ae*ee.height);d===void 0&&(d=p(ce,me));const $=v?p(ce,me):d;return $.width=ce,$.height=me,$.getContext("2d").drawImage(b,0,0,ce,me),ze("WebGLRenderer: Texture has been resized from ("+ee.width+"x"+ee.height+") to ("+ce+"x"+me+")."),$}else return"data"in b&&ze("WebGLRenderer: Image in DataTexture is too big ("+ee.width+"x"+ee.height+")."),b;return b}function w(b){return b.generateMipmaps}function A(b){n.generateMipmap(b)}function R(b){return b.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:b.isWebGL3DRenderTarget?n.TEXTURE_3D:b.isWebGLArrayRenderTarget||b.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function x(b,v,H,ae,ee,ce=!1){if(b!==null){if(n[b]!==void 0)return n[b];ze("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+b+"'")}let me;ae&&(me=e.get("EXT_texture_norm16"),me||ze("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let $=v;if(v===n.RED&&(H===n.FLOAT&&($=n.R32F),H===n.HALF_FLOAT&&($=n.R16F),H===n.UNSIGNED_BYTE&&($=n.R8),H===n.UNSIGNED_SHORT&&me&&($=me.R16_EXT),H===n.SHORT&&me&&($=me.R16_SNORM_EXT)),v===n.RED_INTEGER&&(H===n.UNSIGNED_BYTE&&($=n.R8UI),H===n.UNSIGNED_SHORT&&($=n.R16UI),H===n.UNSIGNED_INT&&($=n.R32UI),H===n.BYTE&&($=n.R8I),H===n.SHORT&&($=n.R16I),H===n.INT&&($=n.R32I)),v===n.RG&&(H===n.FLOAT&&($=n.RG32F),H===n.HALF_FLOAT&&($=n.RG16F),H===n.UNSIGNED_BYTE&&($=n.RG8),H===n.UNSIGNED_SHORT&&me&&($=me.RG16_EXT),H===n.SHORT&&me&&($=me.RG16_SNORM_EXT)),v===n.RG_INTEGER&&(H===n.UNSIGNED_BYTE&&($=n.RG8UI),H===n.UNSIGNED_SHORT&&($=n.RG16UI),H===n.UNSIGNED_INT&&($=n.RG32UI),H===n.BYTE&&($=n.RG8I),H===n.SHORT&&($=n.RG16I),H===n.INT&&($=n.RG32I)),v===n.RGB_INTEGER&&(H===n.UNSIGNED_BYTE&&($=n.RGB8UI),H===n.UNSIGNED_SHORT&&($=n.RGB16UI),H===n.UNSIGNED_INT&&($=n.RGB32UI),H===n.BYTE&&($=n.RGB8I),H===n.SHORT&&($=n.RGB16I),H===n.INT&&($=n.RGB32I)),v===n.RGBA_INTEGER&&(H===n.UNSIGNED_BYTE&&($=n.RGBA8UI),H===n.UNSIGNED_SHORT&&($=n.RGBA16UI),H===n.UNSIGNED_INT&&($=n.RGBA32UI),H===n.BYTE&&($=n.RGBA8I),H===n.SHORT&&($=n.RGBA16I),H===n.INT&&($=n.RGBA32I)),v===n.RGB&&(H===n.UNSIGNED_SHORT&&me&&($=me.RGB16_EXT),H===n.SHORT&&me&&($=me.RGB16_SNORM_EXT),H===n.UNSIGNED_INT_5_9_9_9_REV&&($=n.RGB9_E5),H===n.UNSIGNED_INT_10F_11F_11F_REV&&($=n.R11F_G11F_B10F)),v===n.RGBA){const Q=ce?Cr:Je.getTransfer(ee);H===n.FLOAT&&($=n.RGBA32F),H===n.HALF_FLOAT&&($=n.RGBA16F),H===n.UNSIGNED_BYTE&&($=Q===st?n.SRGB8_ALPHA8:n.RGBA8),H===n.UNSIGNED_SHORT&&me&&($=me.RGBA16_EXT),H===n.SHORT&&me&&($=me.RGBA16_SNORM_EXT),H===n.UNSIGNED_SHORT_4_4_4_4&&($=n.RGBA4),H===n.UNSIGNED_SHORT_5_5_5_1&&($=n.RGB5_A1)}return($===n.R16F||$===n.R32F||$===n.RG16F||$===n.RG32F||$===n.RGBA16F||$===n.RGBA32F)&&e.get("EXT_color_buffer_float"),$}function c(b,v){let H;return b?v===null||v===ln||v===di?H=n.DEPTH24_STENCIL8:v===sn?H=n.DEPTH32F_STENCIL8:v===Pi&&(H=n.DEPTH24_STENCIL8,ze("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===ln||v===di?H=n.DEPTH_COMPONENT24:v===sn?H=n.DEPTH_COMPONENT32F:v===Pi&&(H=n.DEPTH_COMPONENT16),H}function S(b,v){return w(b)===!0||b.isFramebufferTexture&&b.minFilter!==yt&&b.minFilter!==Ut?Math.log2(Math.max(v.width,v.height))+1:b.mipmaps.length>0?b.mipmaps.length:b.isCompressedTexture&&Array.isArray(b.image)?v.mipmaps.length:1}function y(b){const v=new WeakRef(b);i.get(b).__ref=v,_.add(v),T.register(b,v,v)}function P(b){const v=i.get(b).__ref;v!==void 0&&(_.delete(v),T.unregister(v))}function L(b){O(b.target)}function U(b){I(b.target)}function O(b){b.removeEventListener("dispose",L),P(b),Y(b),b.isVideoTexture&&m.delete(b),b.isHTMLTexture&&h.delete(b)}function I(b){b.removeEventListener("dispose",U),P(b),ne(b)}function k(){for(const b of _){const v=b.deref();v!==void 0&&(v.isRenderTarget===!0?I(v):O(v))}_.clear(),h.clear()}function Y(b){const v=i.get(b);if(v.__webglInit===void 0)return;const H=b.source,ae=g.get(H);if(ae){const ee=ae[v.__cacheKey];ee.usedTimes--,ee.usedTimes===0&&z(b),Object.keys(ae).length===0&&g.delete(H)}i.remove(b)}function z(b){const v=i.get(b);n.deleteTexture(v.__webglTexture);const H=b.source,ae=g.get(H);delete ae[v.__cacheKey],a.memory.textures--}function ne(b){const v=i.get(b);v.__depthDisposeCallback&&v.__depthDisposeCallback();const H=b.depthTexture;if(H&&H.renderTarget===b&&O(H),b.isWebGLCubeRenderTarget)for(let ee=0;ee<6;ee++){if(Array.isArray(v.__webglFramebuffer[ee]))for(let ce=0;ce<v.__webglFramebuffer[ee].length;ce++)n.deleteFramebuffer(v.__webglFramebuffer[ee][ce]);else n.deleteFramebuffer(v.__webglFramebuffer[ee]);v.__webglDepthbuffer&&n.deleteRenderbuffer(v.__webglDepthbuffer[ee])}else{if(Array.isArray(v.__webglFramebuffer))for(let ee=0;ee<v.__webglFramebuffer.length;ee++)n.deleteFramebuffer(v.__webglFramebuffer[ee]);else n.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&n.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&n.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let ee=0;ee<v.__webglColorRenderbuffer.length;ee++)v.__webglColorRenderbuffer[ee]&&n.deleteRenderbuffer(v.__webglColorRenderbuffer[ee]);v.__webglDepthRenderbuffer&&n.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const ae=b.textures;for(let ee=0,ce=ae.length;ee<ce;ee++){const me=i.get(ae[ee]);me.__webglTexture&&(n.deleteTexture(me.__webglTexture),a.memory.textures--),i.remove(ae[ee])}i.remove(b)}let q=0;function te(){q=0}function ie(){return q}function Ae(b){q=b}function Te(){const b=q;return b>=r.maxTextures&&ze("WebGLTextures: Trying to use "+(b+1)+" texture units while this GPU supports only "+r.maxTextures),q+=1,b}function Z(b){const v=[];return v.push(b.wrapS),v.push(b.wrapT),v.push(b.wrapR||0),v.push(b.magFilter),v.push(b.minFilter),v.push(b.anisotropy),v.push(b.internalFormat),v.push(b.format),v.push(b.type),v.push(b.generateMipmaps),v.push(b.mipmapsAutoUpdate),v.push(b.premultiplyAlpha),v.push(b.flipY),v.push(b.unpackAlignment),v.push(b.colorSpace),v.join()}function he(b,v){const H=i.get(b);if(b.isVideoTexture&&_t(b),b.isRenderTargetTexture===!1&&b.isExternalTexture!==!0&&b.version>0&&H.__version!==b.version){const ae=b.image;if(ae===null)ze("WebGLRenderer: Texture marked for update but no image data found.");else if(ae.complete===!1)ze("WebGLRenderer: Texture marked for update but image is incomplete");else{ve(H,b,v);return}}else b.isExternalTexture&&(H.__webglTexture=b.sourceTexture?b.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,H.__webglTexture,n.TEXTURE0+v)}function ye(b,v){const H=i.get(b);if(b.isRenderTargetTexture===!1&&b.version>0&&H.__version!==b.version){ve(H,b,v);return}else b.isExternalTexture&&(H.__webglTexture=b.sourceTexture?b.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,H.__webglTexture,n.TEXTURE0+v)}function Pe(b,v){const H=i.get(b);if(b.isRenderTargetTexture===!1&&b.version>0&&H.__version!==b.version){ve(H,b,v);return}t.bindTexture(n.TEXTURE_3D,H.__webglTexture,n.TEXTURE0+v)}function _e(b,v){const H=i.get(b);if(b.version>0&&H.__version!==b.version){Re(H,b,v);return}t.bindTexture(n.TEXTURE_CUBE_MAP,H.__webglTexture,n.TEXTURE0+v)}const Oe={[ys]:n.REPEAT,[_n]:n.CLAMP_TO_EDGE,[As]:n.MIRRORED_REPEAT},C={[yt]:n.NEAREST,[yc]:n.NEAREST_MIPMAP_NEAREST,[Gi]:n.NEAREST_MIPMAP_LINEAR,[Ut]:n.LINEAR,[$r]:n.LINEAR_MIPMAP_NEAREST,[Pn]:n.LINEAR_MIPMAP_LINEAR},B={[wc]:n.NEVER,[vl]:n.ALWAYS,[Cc]:n.LESS,[_l]:n.LEQUAL,[Pc]:n.EQUAL,[xl]:n.GEQUAL,[Lc]:n.GREATER,[Dc]:n.NOTEQUAL};function J(b,v){if(v.type===sn&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===Ut||v.magFilter===$r||v.magFilter===Gi||v.magFilter===Pn||v.minFilter===Ut||v.minFilter===$r||v.minFilter===Gi||v.minFilter===Pn)&&ze("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(b,n.TEXTURE_WRAP_S,Oe[v.wrapS]),n.texParameteri(b,n.TEXTURE_WRAP_T,Oe[v.wrapT]),(b===n.TEXTURE_3D||b===n.TEXTURE_2D_ARRAY)&&n.texParameteri(b,n.TEXTURE_WRAP_R,Oe[v.wrapR]),n.texParameteri(b,n.TEXTURE_MAG_FILTER,C[v.magFilter]),n.texParameteri(b,n.TEXTURE_MIN_FILTER,C[v.minFilter]),v.compareFunction&&(n.texParameteri(b,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(b,n.TEXTURE_COMPARE_FUNC,B[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===yt||v.minFilter!==Gi&&v.minFilter!==Pn||v.type===sn&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||i.get(v).__currentAnisotropy){const H=e.get("EXT_texture_filter_anisotropic");n.texParameterf(b,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,r.getMaxAnisotropy())),i.get(v).__currentAnisotropy=v.anisotropy}}}function se(b,v){let H=!1;b.__webglInit===void 0&&(b.__webglInit=!0,v.addEventListener("dispose",L),y(v));const ae=v.source;let ee=g.get(ae);ee===void 0&&(ee={},g.set(ae,ee));const ce=Z(v);if(ce!==b.__cacheKey){ee[ce]===void 0&&(ee[ce]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,H=!0),ee[ce].usedTimes++;const me=ee[b.__cacheKey];me!==void 0&&(ee[b.__cacheKey].usedTimes--,me.usedTimes===0&&z(v)),b.__cacheKey=ce,b.__webglTexture=ee[ce].texture}return H}function re(b,v,H){return Math.floor(Math.floor(b/H)/v)}function Le(b,v,H,ae){const ce=b.updateRanges;if(ce.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,v.width,v.height,H,ae,v.data);else{ce.sort((D,j)=>D.start-j.start);let me=0;for(let D=1;D<ce.length;D++){const j=ce[me],K=ce[D],de=j.start+j.count,le=re(K.start,v.width,4),ue=re(j.start,v.width,4);K.start<=de+1&&le===ue&&re(K.start+K.count-1,v.width,4)===le?j.count=Math.max(j.count,K.start+K.count-j.start):(++me,ce[me]=K)}ce.length=me+1;const $=t.getParameter(n.UNPACK_ROW_LENGTH),Q=t.getParameter(n.UNPACK_SKIP_PIXELS),fe=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,v.width);for(let D=0,j=ce.length;D<j;D++){const K=ce[D],de=Math.floor(K.start/4),le=Math.ceil(K.count/4),ue=de%v.width,Ue=Math.floor(de/v.width),Xe=le,oe=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,ue),t.pixelStorei(n.UNPACK_SKIP_ROWS,Ue),t.texSubImage2D(n.TEXTURE_2D,0,ue,Ue,Xe,oe,H,ae,v.data)}b.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,$),t.pixelStorei(n.UNPACK_SKIP_PIXELS,Q),t.pixelStorei(n.UNPACK_SKIP_ROWS,fe)}}function ve(b,v,H){let ae=n.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(ae=n.TEXTURE_2D_ARRAY),v.isData3DTexture&&(ae=n.TEXTURE_3D);const ee=se(b,v),ce=v.source;t.bindTexture(ae,b.__webglTexture,n.TEXTURE0+H);const me=i.get(ce);if(ce.version!==me.__version||ee===!0){if(t.activeTexture(n.TEXTURE0+H),(typeof ImageBitmap<"u"&&v.image instanceof ImageBitmap)===!1){const oe=Je.getPrimaries(Je.workingColorSpace),Fe=v.colorSpace===Cn?null:Je.getPrimaries(v.colorSpace),ke=v.colorSpace===Cn||oe===Fe?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ke)}t.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment);let Q=E(v.image,!1,r.maxTextureSize);Q=Be(v,Q);const fe=s.convert(v.format,v.colorSpace),D=s.convert(v.type);let j=x(v.internalFormat,fe,D,v.normalized,v.colorSpace,v.isVideoTexture);J(ae,v);let K;const de=v.mipmaps,le=v.isVideoTexture!==!0,ue=me.__version===void 0||ee===!0,Ue=ce.dataReady,Xe=S(v,Q);if(v.isDepthTexture)j=c(v.format===Ln,v.type),ue&&(le?t.texStorage2D(n.TEXTURE_2D,1,j,Q.width,Q.height):t.texImage2D(n.TEXTURE_2D,0,j,Q.width,Q.height,0,fe,D,null));else if(v.isDataTexture)if(de.length>0){le&&ue&&t.texStorage2D(n.TEXTURE_2D,Xe,j,de[0].width,de[0].height);for(let oe=0,Fe=de.length;oe<Fe;oe++)K=de[oe],le?Ue&&t.texSubImage2D(n.TEXTURE_2D,oe,0,0,K.width,K.height,fe,D,K.data):t.texImage2D(n.TEXTURE_2D,oe,j,K.width,K.height,0,fe,D,K.data);v.generateMipmaps=!1}else le?(ue&&t.texStorage2D(n.TEXTURE_2D,Xe,j,Q.width,Q.height),Ue&&Le(v,Q,fe,D)):t.texImage2D(n.TEXTURE_2D,0,j,Q.width,Q.height,0,fe,D,Q.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){le&&ue&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Xe,j,de[0].width,de[0].height,Q.depth);for(let oe=0,Fe=de.length;oe<Fe;oe++)if(K=de[oe],v.format!==an)if(fe!==null)if(le){if(Ue)if(v.layerUpdates.size>0){const ke=mo(K.width,K.height,v.format,v.type);for(const Se of v.layerUpdates){const rt=K.data.subarray(Se*ke/K.data.BYTES_PER_ELEMENT,(Se+1)*ke/K.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,oe,0,0,Se,K.width,K.height,1,fe,rt)}}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,oe,0,0,0,K.width,K.height,Q.depth,fe,K.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,oe,j,K.width,K.height,Q.depth,0,K.data,0,0);else ze("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else le?Ue&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,oe,0,0,0,K.width,K.height,Q.depth,fe,D,K.data):t.texImage3D(n.TEXTURE_2D_ARRAY,oe,j,K.width,K.height,Q.depth,0,fe,D,K.data);v.layerUpdates.size>0&&v.clearLayerUpdates()}else{le&&ue&&t.texStorage2D(n.TEXTURE_2D,Xe,j,de[0].width,de[0].height);for(let oe=0,Fe=de.length;oe<Fe;oe++)K=de[oe],v.format!==an?fe!==null?le?Ue&&t.compressedTexSubImage2D(n.TEXTURE_2D,oe,0,0,K.width,K.height,fe,K.data):t.compressedTexImage2D(n.TEXTURE_2D,oe,j,K.width,K.height,0,K.data):ze("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):le?Ue&&t.texSubImage2D(n.TEXTURE_2D,oe,0,0,K.width,K.height,fe,D,K.data):t.texImage2D(n.TEXTURE_2D,oe,j,K.width,K.height,0,fe,D,K.data)}else if(v.isDataArrayTexture)if(le){if(ue&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Xe,j,Q.width,Q.height,Q.depth),Ue)if(v.layerUpdates.size>0){const oe=mo(Q.width,Q.height,v.format,v.type);for(const Fe of v.layerUpdates){const ke=Q.data.subarray(Fe*oe/Q.data.BYTES_PER_ELEMENT,(Fe+1)*oe/Q.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Fe,Q.width,Q.height,1,fe,D,ke)}v.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,fe,D,Q.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,j,Q.width,Q.height,Q.depth,0,fe,D,Q.data);else if(v.isData3DTexture)le?(ue&&t.texStorage3D(n.TEXTURE_3D,Xe,j,Q.width,Q.height,Q.depth),Ue&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,fe,D,Q.data)):t.texImage3D(n.TEXTURE_3D,0,j,Q.width,Q.height,Q.depth,0,fe,D,Q.data);else if(v.isFramebufferTexture){if(ue)if(le)t.texStorage2D(n.TEXTURE_2D,Xe,j,Q.width,Q.height);else{let oe=Q.width,Fe=Q.height;for(let ke=0;ke<Xe;ke++)t.texImage2D(n.TEXTURE_2D,ke,j,oe,Fe,0,fe,D,null),oe>>=1,Fe>>=1}}else if(v.isHTMLTexture){if("texElementImage2D"in n){const oe=n.canvas;if(oe.hasAttribute("layoutsubtree")||oe.setAttribute("layoutsubtree","true"),Q.parentNode!==oe){oe.appendChild(Q),h.add(v),oe.onpaint=Fe=>{const ke=Fe.changedElements;for(const Se of h)ke.includes(Se.image)&&(Se.needsUpdate=!0)},oe.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,Q);else{const ke=n.RGBA,Se=n.RGBA,rt=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,ke,Se,rt,Q)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(de.length>0){if(le&&ue){const oe=Ge(de[0]);t.texStorage2D(n.TEXTURE_2D,Xe,j,oe.width,oe.height)}for(let oe=0,Fe=de.length;oe<Fe;oe++)K=de[oe],le?Ue&&t.texSubImage2D(n.TEXTURE_2D,oe,0,0,fe,D,K):t.texImage2D(n.TEXTURE_2D,oe,j,fe,D,K);v.generateMipmaps=!1}else if(le){if(ue){const oe=Ge(Q);t.texStorage2D(n.TEXTURE_2D,Xe,j,oe.width,oe.height)}Ue&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,fe,D,Q)}else t.texImage2D(n.TEXTURE_2D,0,j,fe,D,Q);w(v)&&v.mipmapsAutoUpdate===!0&&A(ae),me.__version=ce.version,v.onUpdate&&v.onUpdate(v)}b.__version=v.version}function Re(b,v,H){if(v.image.length!==6)return;const ae=se(b,v),ee=v.source;t.bindTexture(n.TEXTURE_CUBE_MAP,b.__webglTexture,n.TEXTURE0+H);const ce=i.get(ee);if(ee.version!==ce.__version||ae===!0){t.activeTexture(n.TEXTURE0+H);const me=Je.getPrimaries(Je.workingColorSpace),$=v.colorSpace===Cn?null:Je.getPrimaries(v.colorSpace),Q=v.colorSpace===Cn||me===$?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Q);const fe=v.isCompressedTexture||v.image[0].isCompressedTexture,D=v.image[0]&&v.image[0].isDataTexture,j=[];for(let Se=0;Se<6;Se++)!fe&&!D?j[Se]=E(v.image[Se],!0,r.maxCubemapSize):j[Se]=D?v.image[Se].image:v.image[Se],j[Se]=Be(v,j[Se]);const K=j[0],de=s.convert(v.format,v.colorSpace),le=s.convert(v.type);let ue=x(v.internalFormat,de,le,v.normalized,v.colorSpace);const Ue=v.isVideoTexture!==!0,Xe=ce.__version===void 0||ae===!0,oe=ee.dataReady;let Fe=S(v,K);J(n.TEXTURE_CUBE_MAP,v);let ke;if(v.isDepthTexture){if(ue=c(v.format===Ln,v.type),Xe)if(Ue)t.texStorage2D(n.TEXTURE_CUBE_MAP,1,ue,K.width,K.height);else for(let Se=0;Se<6;Se++)t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Se,0,ue,K.width,K.height,0,de,le,null)}else if(fe){Ue&&Xe&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Fe,ue,K.width,K.height);for(let Se=0;Se<6;Se++){ke=j[Se].mipmaps;for(let rt=0;rt<ke.length;rt++){const St=ke[rt];v.format!==an?de!==null?Ue?oe&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Se,rt,0,0,St.width,St.height,de,St.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Se,rt,ue,St.width,St.height,0,St.data):ze("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ue?oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Se,rt,0,0,St.width,St.height,de,le,St.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Se,rt,ue,St.width,St.height,0,de,le,St.data)}}}else{if(ke=v.mipmaps,Ue&&Xe){ke.length>0&&Fe++;const Se=Ge(j[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Fe,ue,Se.width,Se.height)}for(let Se=0;Se<6;Se++)if(D){Ue?oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Se,0,0,0,j[Se].width,j[Se].height,de,le,j[Se].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Se,0,ue,j[Se].width,j[Se].height,0,de,le,j[Se].data);for(let rt=0;rt<ke.length;rt++){const Sn=ke[rt].image[Se].image;Ue?oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Se,rt+1,0,0,Sn.width,Sn.height,de,le,Sn.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Se,rt+1,ue,Sn.width,Sn.height,0,de,le,Sn.data)}}else{Ue?oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Se,0,0,0,de,le,j[Se]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Se,0,ue,de,le,j[Se]);for(let rt=0;rt<ke.length;rt++){const St=ke[rt];Ue?oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Se,rt+1,0,0,de,le,St.image[Se]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Se,rt+1,ue,de,le,St.image[Se])}}}w(v)&&v.mipmapsAutoUpdate===!0&&A(n.TEXTURE_CUBE_MAP),ce.__version=ee.version,v.onUpdate&&v.onUpdate(v)}b.__version=v.version}function Ie(b,v,H,ae,ee,ce){const me=s.convert(H.format,H.colorSpace),$=s.convert(H.type),Q=x(H.internalFormat,me,$,H.normalized,H.colorSpace),fe=i.get(v),D=i.get(H);if(D.__renderTarget=v,!fe.__hasExternalTextures){const j=Math.max(1,v.width>>ce),K=Math.max(1,v.height>>ce);ee===n.TEXTURE_3D||ee===n.TEXTURE_2D_ARRAY?t.texImage3D(ee,ce,Q,j,K,v.depth,0,me,$,null):t.texImage2D(ee,ce,Q,j,K,0,me,$,null)}t.bindFramebuffer(n.FRAMEBUFFER,b),xe(v)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ae,ee,D.__webglTexture,0,ft(v)):(ee===n.TEXTURE_2D||ee>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ee<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ae,ee,D.__webglTexture,ce),t.bindFramebuffer(n.FRAMEBUFFER,null)}function We(b,v,H){if(n.bindRenderbuffer(n.RENDERBUFFER,b),v.depthBuffer){const ae=v.depthTexture,ee=ae&&ae.isDepthTexture?ae.type:null,ce=c(v.stencilBuffer,ee),me=v.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;xe(v)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ft(v),ce,v.width,v.height):H?n.renderbufferStorageMultisample(n.RENDERBUFFER,ft(v),ce,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,ce,v.width,v.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,me,n.RENDERBUFFER,b)}else{const ae=v.textures;for(let ee=0;ee<ae.length;ee++){const ce=ae[ee],me=s.convert(ce.format,ce.colorSpace),$=s.convert(ce.type),Q=x(ce.internalFormat,me,$,ce.normalized,ce.colorSpace);xe(v)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ft(v),Q,v.width,v.height):H?n.renderbufferStorageMultisample(n.RENDERBUFFER,ft(v),Q,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,Q,v.width,v.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Ne(b,v,H){const ae=v.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,b),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const ee=i.get(v.depthTexture);ee.__renderTarget=v;const ce=ae?v.depthTexture.image[0]:v.depthTexture.image;(!ee.__webglTexture||ce.width!==v.width||ce.height!==v.height)&&(ce.width=v.width,ce.height=v.height,v.depthTexture.needsUpdate=!0),ae?_e(v.depthTexture,0):he(v.depthTexture,0);const me=ee.__webglTexture,$=ft(v),Q=ae?n.TEXTURE_CUBE_MAP_POSITIVE_X+H:n.TEXTURE_2D,fe=v.depthTexture.format===Ln?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(v.depthTexture.format===In)xe(v)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,fe,Q,me,0,$):n.framebufferTexture2D(n.FRAMEBUFFER,fe,Q,me,0);else if(v.depthTexture.format===Ln)xe(v)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,fe,Q,me,0,$):n.framebufferTexture2D(n.FRAMEBUFFER,fe,Q,me,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Ke(b){const v=i.get(b),H=b.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==b.depthTexture){const ae=b.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),ae){const ee=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,ae.removeEventListener("dispose",ee)};ae.addEventListener("dispose",ee),v.__depthDisposeCallback=ee}v.__boundDepthTexture=ae}if(b.depthTexture&&!v.__autoAllocateDepthBuffer)if(H)for(let ae=0;ae<6;ae++)Ne(v.__webglFramebuffer[ae],b,ae);else b.texture.mipmaps.length>0?Ne(v.__webglFramebuffer[0],b,0):Ne(v.__webglFramebuffer,b,0);else if(H){v.__webglDepthbuffer=[];for(let ae=0;ae<6;ae++)if(t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer[ae]),v.__webglDepthbuffer[ae]===void 0)v.__webglDepthbuffer[ae]=n.createRenderbuffer(),We(v.__webglDepthbuffer[ae],b,!1);else{const ee=b.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ce=v.__webglDepthbuffer[ae];n.bindRenderbuffer(n.RENDERBUFFER,ce),n.framebufferRenderbuffer(n.FRAMEBUFFER,ee,n.RENDERBUFFER,ce)}}else if(b.texture.mipmaps.length>0?t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=n.createRenderbuffer(),We(v.__webglDepthbuffer,b,!1);else{const ee=b.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ce=v.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ce),n.framebufferRenderbuffer(n.FRAMEBUFFER,ee,n.RENDERBUFFER,ce)}t.bindFramebuffer(n.FRAMEBUFFER,null)}function at(b,v,H){const ae=i.get(b);v!==void 0&&Ie(ae.__webglFramebuffer,b,b.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),H!==void 0&&Ke(b)}function ct(b){const v=b.texture,H=i.get(b),ae=i.get(v);b.addEventListener("dispose",U),y(b);const ee=b.textures,ce=b.isWebGLCubeRenderTarget===!0,me=ee.length>1;if(me||(ae.__webglTexture===void 0&&(ae.__webglTexture=n.createTexture()),ae.__version=v.version,a.memory.textures++),ce){H.__webglFramebuffer=[];for(let $=0;$<6;$++)if(v.mipmaps.length>0){H.__webglFramebuffer[$]=[];for(let Q=0;Q<v.mipmaps.length;Q++)H.__webglFramebuffer[$][Q]=n.createFramebuffer()}else H.__webglFramebuffer[$]=n.createFramebuffer()}else{if(v.mipmaps.length>0){H.__webglFramebuffer=[];for(let $=0;$<v.mipmaps.length;$++)H.__webglFramebuffer[$]=n.createFramebuffer()}else H.__webglFramebuffer=n.createFramebuffer();if(me)for(let $=0,Q=ee.length;$<Q;$++){const fe=i.get(ee[$]);fe.__webglTexture===void 0&&(fe.__webglTexture=n.createTexture(),a.memory.textures++)}if(b.samples>0&&xe(b)===!1){H.__webglMultisampledFramebuffer=n.createFramebuffer(),H.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let $=0;$<ee.length;$++){const Q=ee[$];H.__webglColorRenderbuffer[$]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,H.__webglColorRenderbuffer[$]);const fe=s.convert(Q.format,Q.colorSpace),D=s.convert(Q.type),j=x(Q.internalFormat,fe,D,Q.normalized,Q.colorSpace,b.isXRRenderTarget===!0),K=ft(b);n.renderbufferStorageMultisample(n.RENDERBUFFER,K,j,b.width,b.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+$,n.RENDERBUFFER,H.__webglColorRenderbuffer[$])}n.bindRenderbuffer(n.RENDERBUFFER,null),b.depthBuffer&&(H.__webglDepthRenderbuffer=n.createRenderbuffer(),We(H.__webglDepthRenderbuffer,b,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ce){t.bindTexture(n.TEXTURE_CUBE_MAP,ae.__webglTexture),J(n.TEXTURE_CUBE_MAP,v);for(let $=0;$<6;$++)if(v.mipmaps.length>0)for(let Q=0;Q<v.mipmaps.length;Q++)Ie(H.__webglFramebuffer[$][Q],b,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+$,Q);else Ie(H.__webglFramebuffer[$],b,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+$,0);w(v)?A(n.TEXTURE_CUBE_MAP):v.mipmaps.length>0&&n.texParameteri(n.TEXTURE_CUBE_MAP,n.TEXTURE_MAX_LEVEL,v.mipmaps.length-1),t.unbindTexture()}else if(me){for(let $=0,Q=ee.length;$<Q;$++){const fe=ee[$],D=i.get(fe);let j=n.TEXTURE_2D;(b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)&&(j=b.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(j,D.__webglTexture),J(j,fe),Ie(H.__webglFramebuffer,b,fe,n.COLOR_ATTACHMENT0+$,j,0),w(fe)&&A(j)}t.unbindTexture()}else{let $=n.TEXTURE_2D;if((b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)&&($=b.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture($,ae.__webglTexture),J($,v),v.mipmaps.length>0)for(let Q=0;Q<v.mipmaps.length;Q++)Ie(H.__webglFramebuffer[Q],b,v,n.COLOR_ATTACHMENT0,$,Q);else Ie(H.__webglFramebuffer,b,v,n.COLOR_ATTACHMENT0,$,0);w(v)?A($):v.mipmaps.length>0&&n.texParameteri($,n.TEXTURE_MAX_LEVEL,v.mipmaps.length-1),t.unbindTexture()}b.depthBuffer&&Ke(b)}function F(b){const v=b.textures;for(let H=0,ae=v.length;H<ae;H++){const ee=v[H];if(w(ee)&&ee.mipmapsAutoUpdate===!0){const ce=R(b),me=i.get(ee).__webglTexture;t.bindTexture(ce,me),A(ce),t.unbindTexture()}}}const Ct=[];function Ye(b){if(b.samples>0){if(xe(b)===!1){const v=b.textures,H=b.width,ae=b.height;let ee=n.COLOR_BUFFER_BIT;const ce=b.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,me=i.get(b),$=v.length>1;if($)for(let fe=0;fe<v.length;fe++)t.bindFramebuffer(n.FRAMEBUFFER,me.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+fe,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,me.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+fe,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,me.__webglMultisampledFramebuffer),b.texture.mipmaps.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,me.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,me.__webglFramebuffer);for(let fe=0;fe<v.length;fe++){if(b.resolveDepthBuffer&&(b.depthBuffer&&(ee|=n.DEPTH_BUFFER_BIT),b.stencilBuffer&&b.resolveStencilBuffer&&(ee|=n.STENCIL_BUFFER_BIT)),$){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,me.__webglColorRenderbuffer[fe]);const D=i.get(v[fe]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,D,0)}n.blitFramebuffer(0,0,H,ae,0,0,H,ae,ee,n.NEAREST),u===!0&&(Ct.length=0,Ct.push(n.COLOR_ATTACHMENT0+fe),b.depthBuffer&&b.storeMultisampledDepthBuffer===!1&&Ct.push(ce),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Ct))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),$)for(let fe=0;fe<v.length;fe++){t.bindFramebuffer(n.FRAMEBUFFER,me.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+fe,n.RENDERBUFFER,me.__webglColorRenderbuffer[fe]);const D=i.get(v[fe]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,me.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+fe,n.TEXTURE_2D,D,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,me.__webglMultisampledFramebuffer)}else if(b.depthBuffer&&b.storeMultisampledDepthBuffer===!1&&u){const v=b.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[v])}}}function ft(b){return Math.min(r.maxSamples,b.samples)}function xe(b){const v=i.get(b);return b.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function _t(b){const v=a.render.frame;m.get(b)!==v&&(m.set(b,v),b.update())}function Be(b,v){const H=b.colorSpace,ae=b.format,ee=b.type;return b.isCompressedTexture===!0||b.isVideoTexture===!0||H!==Li&&H!==Cn&&(Je.getTransfer(H)===st?(ae!==an||ee!==Vt)&&ze("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):nt("WebGLTextures: Unsupported texture color space:",H)),v}function Ge(b){return typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement?(l.width=b.naturalWidth||b.width,l.height=b.naturalHeight||b.height):typeof VideoFrame<"u"&&b instanceof VideoFrame?(l.width=b.displayWidth,l.height=b.displayHeight):(l.width=b.width,l.height=b.height),l}this.allocateTextureUnit=Te,this.resetTextureUnits=te,this.getTextureUnits=ie,this.setTextureUnits=Ae,this.setTexture2D=he,this.setTexture2DArray=ye,this.setTexture3D=Pe,this.setTextureCube=_e,this.rebindTextures=at,this.setupRenderTarget=ct,this.updateRenderTargetMipmap=F,this.updateMultisampleRenderTarget=Ye,this.setupDepthRenderbuffer=Ke,this.setupFrameBufferTexture=Ie,this.useMultisampledRTT=xe,this.dispose=k}function am(n,e){function t(i,r=Cn){let s;const a=Je.getTransfer(r);if(i===Vt)return n.UNSIGNED_BYTE;if(i===ua)return n.UNSIGNED_SHORT_4_4_4_4;if(i===fa)return n.UNSIGNED_SHORT_5_5_5_1;if(i===dl)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===hl)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===ul)return n.BYTE;if(i===fl)return n.SHORT;if(i===Pi)return n.UNSIGNED_SHORT;if(i===ca)return n.INT;if(i===ln)return n.UNSIGNED_INT;if(i===sn)return n.FLOAT;if(i===cn)return n.HALF_FLOAT;if(i===pl)return n.ALPHA;if(i===ml)return n.RGB;if(i===an)return n.RGBA;if(i===In)return n.DEPTH_COMPONENT;if(i===Ln)return n.DEPTH_STENCIL;if(i===gl)return n.RED;if(i===da)return n.RED_INTEGER;if(i===qn)return n.RG;if(i===ha)return n.RG_INTEGER;if(i===pa)return n.RGBA_INTEGER;if(i===pr||i===mr||i===gr||i===_r)if(a===st)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===pr)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===mr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===gr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===_r)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===pr)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===mr)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===gr)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===_r)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===bs||i===Rs||i===ws||i===Cs)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===bs)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Rs)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===ws)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Cs)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Ps||i===Ls||i===Ds||i===Is||i===Ns||i===Rr||i===Us)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Ps||i===Ls)return a===st?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Ds)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(i===Is)return s.COMPRESSED_R11_EAC;if(i===Ns)return s.COMPRESSED_SIGNED_R11_EAC;if(i===Rr)return s.COMPRESSED_RG11_EAC;if(i===Us)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Fs||i===Os||i===Bs||i===zs||i===Gs||i===Hs||i===Vs||i===ks||i===Ws||i===Xs||i===qs||i===Ys||i===Ks||i===Zs)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Fs)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Os)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Bs)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===zs)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Gs)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Hs)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Vs)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===ks)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Ws)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Xs)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===qs)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Ys)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Ks)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Zs)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===$s||i===Js||i===Qs)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===$s)return a===st?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Js)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Qs)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===js||i===ea||i===wr||i===ta)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===js)return s.COMPRESSED_RED_RGTC1_EXT;if(i===ea)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===wr)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===ta)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===di?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const om=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,lm=`
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

}`;class cm{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Sa(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Kn({vertexShader:om,fragmentShader:lm,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Nn(new Gr(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class um extends Zn{constructor(e,t){super();const i=this;let r=null,s=1,a=null,o="local-floor",u=1,l=null,m=null,h=null,d=null,g=null,_=null;const T=typeof XRWebGLBinding<"u",f=new cm,p={},E=t.getContextAttributes();let w=null,A=null;const R=[],x=[],c=new it;let S=null,y=null;const P=new tn;P.viewport=new pt;const L=new tn;L.viewport=new pt;const U=[P,L],O=new Mu;let I=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let he=R[Z];return he===void 0&&(he=new ss,R[Z]=he),he.getTargetRaySpace()},this.getControllerGrip=function(Z){let he=R[Z];return he===void 0&&(he=new ss,R[Z]=he),he.getGripSpace()},this.getHand=function(Z){let he=R[Z];return he===void 0&&(he=new ss,R[Z]=he),he.getHandSpace()};function Y(Z){const he=x.indexOf(Z.inputSource);if(he===-1)return;const ye=R[he];ye!==void 0&&(ye.update(Z.inputSource,Z.frame,l||a),ye.dispatchEvent({type:Z.type,data:Z.inputSource}))}function z(){r.removeEventListener("select",Y),r.removeEventListener("selectstart",Y),r.removeEventListener("selectend",Y),r.removeEventListener("squeeze",Y),r.removeEventListener("squeezestart",Y),r.removeEventListener("squeezeend",Y),r.removeEventListener("end",z),r.removeEventListener("inputsourceschange",ne);for(let Z=0;Z<R.length;Z++){const he=x[Z];he!==null&&(x[Z]=null,R[Z].disconnect(he))}I=null,k=null,f.reset();for(const Z in p)delete p[Z];if(e.setRenderTarget(w),g=null,d=null,h=null,r=null,A=null,Te.stop(),i.isPresenting=!1,e.setPixelRatio(S),e.setSize(c.width,c.height,!1),y!==null){const Z=y.camera;Z.fov=y.fov,Z.zoom=y.zoom,Z.updateProjectionMatrix(),y=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){s=Z,i.isPresenting===!0&&ze("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,i.isPresenting===!0&&ze("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(Z){l=Z},this.getBaseLayer=function(){return d!==null?d:g},this.getBinding=function(){return h===null&&T&&(h=new XRWebGLBinding(r,t)),h},this.getFrame=function(){return _},this.getSession=function(){return r},this.setSession=async function(Z){if(r=Z,r!==null){if(w=e.getRenderTarget(),r.addEventListener("select",Y),r.addEventListener("selectstart",Y),r.addEventListener("selectend",Y),r.addEventListener("squeeze",Y),r.addEventListener("squeezestart",Y),r.addEventListener("squeezeend",Y),r.addEventListener("end",z),r.addEventListener("inputsourceschange",ne),E.xrCompatible!==!0&&await t.makeXRCompatible(),S=e.getPixelRatio(),e.getSize(c),T&&"createProjectionLayer"in XRWebGLBinding.prototype){let ye=null,Pe=null,_e=null;E.depth&&(_e=E.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ye=E.stencil?Ln:In,Pe=E.stencil?di:ln);const Oe={colorFormat:t.RGBA8,depthFormat:_e,scaleFactor:s};h=this.getBinding(),d=h.createProjectionLayer(Oe),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),A=new kt(d.textureWidth,d.textureHeight,{format:an,type:Vt,depthTexture:new Un(d.textureWidth,d.textureHeight,Pe,void 0,void 0,void 0,void 0,void 0,void 0,ye),stencilBuffer:E.stencil,colorSpace:e.outputColorSpace,samples:E.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{const ye={antialias:E.antialias,alpha:!0,depth:E.depth,stencil:E.stencil,framebufferScaleFactor:s};g=new XRWebGLLayer(r,t,ye),r.updateRenderState({baseLayer:g}),e.setPixelRatio(1),e.setSize(g.framebufferWidth,g.framebufferHeight,!1),A=new kt(g.framebufferWidth,g.framebufferHeight,{format:an,type:Vt,colorSpace:e.outputColorSpace,stencilBuffer:E.stencil,resolveDepthBuffer:g.ignoreDepthValues===!1,resolveStencilBuffer:g.ignoreDepthValues===!1,storeMultisampledDepthBuffer:g.ignoreDepthValues===!1,storeMultisampledStencilBuffer:g.ignoreDepthValues===!1})}A.isXRRenderTarget=!0,this.setFoveation(u),l=null,a=await r.requestReferenceSpace(o),Te.setContext(r),Te.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return f.getDepthTexture()};function ne(Z){for(let he=0;he<Z.removed.length;he++){const ye=Z.removed[he],Pe=x.indexOf(ye);Pe>=0&&(x[Pe]=null,R[Pe].disconnect(ye))}for(let he=0;he<Z.added.length;he++){const ye=Z.added[he];let Pe=x.indexOf(ye);if(Pe===-1){for(let Oe=0;Oe<R.length;Oe++)if(Oe>=x.length){x.push(ye),Pe=Oe;break}else if(x[Oe]===null){x[Oe]=ye,Pe=Oe;break}if(Pe===-1)break}const _e=R[Pe];_e&&_e.connect(ye)}}function q(Z,he){he===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(he.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(r===null)return;let he=Z.near,ye=Z.far;f.texture!==null&&(f.depthNear>0&&(he=f.depthNear),f.depthFar>0&&(ye=f.depthFar)),O.near=L.near=P.near=he,O.far=L.far=P.far=ye,(I!==O.near||k!==O.far)&&(r.updateRenderState({depthNear:O.near,depthFar:O.far}),I=O.near,k=O.far),O.layers.mask=Z.layers.mask|6,P.layers.mask=O.layers.mask&-5,L.layers.mask=O.layers.mask&-3;const Pe=Z.parent,_e=O.cameras;q(O,Pe);for(let Oe=0;Oe<_e.length;Oe++)q(_e[Oe],Pe);O.projectionMatrix.copy(P.projectionMatrix),O.projectionMatrixInverse.copy(P.projectionMatrixInverse),y===null&&Z.isPerspectiveCamera&&(y={camera:Z,fov:Z.fov,zoom:Z.zoom}),te(Z,O,Pe)};function te(Z,he,ye){ye===null?Z.matrix.copy(he.matrixWorld):(Z.matrix.copy(ye.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(he.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(he.projectionMatrix),Z.projectionMatrixInverse.copy(he.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=ia*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(!(d===null&&g===null))return u},this.setFoveation=function(Z){u=Z,d!==null&&(d.fixedFoveation=Z),g!==null&&g.fixedFoveation!==void 0&&(g.fixedFoveation=Z)},this.hasDepthSensing=function(){return f.texture!==null},this.getDepthSensingMesh=function(){return f.getMesh(O)},this.getCameraTexture=function(Z){return p[Z]};let ie=null;function Ae(Z,he){if(m=he.getViewerPose(l||a),_=he,m!==null){const ye=m.views;g!==null&&(e.setRenderTargetFramebuffer(A,g.framebuffer),e.setRenderTarget(A));let Pe=!1;ye.length!==O.cameras.length&&(O.cameras.length=0,Pe=!0);for(let B=0;B<ye.length;B++){const J=ye[B];let se=null;if(g!==null)se=g.getViewport(J);else{const Le=h.getViewSubImage(d,J);se=Le.viewport,B===0&&(e.setRenderTargetTextures(A,Le.colorTexture,Le.depthStencilTexture),e.setRenderTarget(A))}let re=U[B];re===void 0&&(re=new tn,re.layers.enable(B),re.viewport=new pt,U[B]=re),re.matrix.fromArray(J.transform.matrix),re.matrix.decompose(re.position,re.quaternion,re.scale),re.projectionMatrix.fromArray(J.projectionMatrix),re.projectionMatrixInverse.copy(re.projectionMatrix).invert(),re.viewport.set(se.x,se.y,se.width,se.height),B===0&&(O.matrix.copy(re.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),Pe===!0&&O.cameras.push(re)}const _e=r.enabledFeatures;if(_e&&_e.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&T){h=i.getBinding();const B=h.getDepthInformation(ye[0]);B&&B.isValid&&B.texture&&f.init(B,r.renderState)}if(_e&&_e.includes("camera-access")&&T){e.state.unbindTexture(),h=i.getBinding();for(let B=0;B<ye.length;B++){const J=ye[B].camera;if(J){let se=p[J];se||(se=new Sa,p[J]=se);const re=h.getCameraImage(J);se.sourceTexture=re}}}}for(let ye=0;ye<R.length;ye++){const Pe=x[ye],_e=R[ye];Pe!==null&&_e!==void 0&&_e.update(Pe,he,l||a)}ie&&ie(Z,he),he.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:he}),_=null}const Te=new Il;Te.setAnimationLoop(Ae),this.setAnimationLoop=function(Z){ie=Z},this.dispose=function(){}}}const fm=new ht,kl=new He;kl.set(-1,0,0,0,1,0,0,0,1);function dm(n,e){function t(f,p){f.matrixAutoUpdate===!0&&f.updateMatrix(),p.value.copy(f.matrix)}function i(f,p){p.color.getRGB(f.fogColor.value,Ll(n)),p.isFog?(f.fogNear.value=p.near,f.fogFar.value=p.far):p.isFogExp2&&(f.fogDensity.value=p.density)}function r(f,p,E,w,A){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?s(f,p):p.isMeshLambertMaterial?(s(f,p),p.envMap&&(f.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(s(f,p),h(f,p)):p.isMeshPhongMaterial?(s(f,p),m(f,p),p.envMap&&(f.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(s(f,p),d(f,p),p.isMeshPhysicalMaterial&&g(f,p,A)):p.isMeshMatcapMaterial?(s(f,p),_(f,p)):p.isMeshDepthMaterial?s(f,p):p.isMeshDistanceMaterial?(s(f,p),T(f,p)):p.isMeshNormalMaterial?s(f,p):p.isLineBasicMaterial?(a(f,p),p.isLineDashedMaterial&&o(f,p)):p.isPointsMaterial?u(f,p,E,w):p.isSpriteMaterial?l(f,p):p.isShadowMaterial?(f.color.value.copy(p.color),f.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(f,p){f.opacity.value=p.opacity,p.color&&f.diffuse.value.copy(p.color),p.emissive&&f.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(f.map.value=p.map,t(p.map,f.mapTransform)),p.alphaMap&&(f.alphaMap.value=p.alphaMap,t(p.alphaMap,f.alphaMapTransform)),p.bumpMap&&(f.bumpMap.value=p.bumpMap,t(p.bumpMap,f.bumpMapTransform),f.bumpScale.value=p.bumpScale,p.side===Ft&&(f.bumpScale.value*=-1)),p.normalMap&&(f.normalMap.value=p.normalMap,t(p.normalMap,f.normalMapTransform),f.normalScale.value.copy(p.normalScale),p.side===Ft&&f.normalScale.value.negate()),p.displacementMap&&(f.displacementMap.value=p.displacementMap,t(p.displacementMap,f.displacementMapTransform),f.displacementScale.value=p.displacementScale,f.displacementBias.value=p.displacementBias),p.emissiveMap&&(f.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,f.emissiveMapTransform)),p.specularMap&&(f.specularMap.value=p.specularMap,t(p.specularMap,f.specularMapTransform)),p.alphaTest>0&&(f.alphaTest.value=p.alphaTest);const E=e.get(p),w=E.envMap,A=E.envMapRotation;w&&(f.envMap.value=w,f.envMapRotation.value.setFromMatrix4(fm.makeRotationFromEuler(A)).transpose(),w.isCubeTexture&&w.isRenderTargetTexture===!1&&f.envMapRotation.value.premultiply(kl),f.reflectivity.value=p.reflectivity,f.ior.value=p.ior,f.refractionRatio.value=p.refractionRatio),p.lightMap&&(f.lightMap.value=p.lightMap,f.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,f.lightMapTransform)),p.aoMap&&(f.aoMap.value=p.aoMap,f.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,f.aoMapTransform))}function a(f,p){f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,p.map&&(f.map.value=p.map,t(p.map,f.mapTransform))}function o(f,p){f.dashSize.value=p.dashSize,f.totalSize.value=p.dashSize+p.gapSize,f.scale.value=p.scale}function u(f,p,E,w){f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,f.size.value=p.size*E,f.scale.value=w*.5,p.map&&(f.map.value=p.map,t(p.map,f.uvTransform)),p.alphaMap&&(f.alphaMap.value=p.alphaMap,t(p.alphaMap,f.alphaMapTransform)),p.alphaTest>0&&(f.alphaTest.value=p.alphaTest)}function l(f,p){f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,f.rotation.value=p.rotation,p.map&&(f.map.value=p.map,t(p.map,f.mapTransform)),p.alphaMap&&(f.alphaMap.value=p.alphaMap,t(p.alphaMap,f.alphaMapTransform)),p.alphaTest>0&&(f.alphaTest.value=p.alphaTest)}function m(f,p){f.specular.value.copy(p.specular),f.shininess.value=Math.max(p.shininess,1e-4)}function h(f,p){p.gradientMap&&(f.gradientMap.value=p.gradientMap)}function d(f,p){f.metalness.value=p.metalness,p.metalnessMap&&(f.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,f.metalnessMapTransform)),f.roughness.value=p.roughness,p.roughnessMap&&(f.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,f.roughnessMapTransform)),p.envMap&&(f.envMapIntensity.value=p.envMapIntensity)}function g(f,p,E){f.ior.value=p.ior,p.diffuseRoughness>0&&(f.diffuseRoughness.value=p.diffuseRoughness,p.diffuseRoughnessMap&&(f.diffuseRoughnessMap.value=p.diffuseRoughnessMap,t(p.diffuseRoughnessMap,f.diffuseRoughnessMapTransform))),p.sheen>0&&(f.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),f.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(f.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,f.sheenColorMapTransform)),p.sheenRoughnessMap&&(f.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,f.sheenRoughnessMapTransform))),p.clearcoat>0&&(f.clearcoat.value=p.clearcoat,f.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(f.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,f.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(f.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,f.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(f.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,f.clearcoatNormalMapTransform),f.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ft&&f.clearcoatNormalScale.value.negate())),p.dispersion>0&&(f.dispersion.value=p.dispersion),p.retroreflectivity>0&&(f.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(f.iridescence.value=p.iridescence,f.iridescenceIOR.value=p.iridescenceIOR,f.iridescenceThicknessMinimum.value=p.iridescenceThicknessMinimum,f.iridescenceThicknessMaximum.value=p.iridescenceThicknessMaximum,p.iridescenceMap&&(f.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,f.iridescenceMapTransform)),p.iridescenceThicknessMap&&(f.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,f.iridescenceThicknessMapTransform))),p.transmission>0&&(f.transmission.value=p.transmission,f.transmissionSamplerMap.value=E.texture,f.transmissionSamplerSize.value.set(E.width,E.height),p.transmissionMap&&(f.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,f.transmissionMapTransform)),f.thickness.value=p.thickness,p.thicknessMap&&(f.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,f.thicknessMapTransform)),f.attenuationDistance.value=p.attenuationDistance,f.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(f.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(f.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,f.anisotropyMapTransform))),f.specularIntensity.value=p.specularIntensity,f.specularColor.value.copy(p.specularColor),p.specularColorMap&&(f.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,f.specularColorMapTransform)),p.specularIntensityMap&&(f.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,f.specularIntensityMapTransform))}function _(f,p){p.matcap&&(f.matcap.value=p.matcap)}function T(f,p){const E=e.get(p).light;f.referencePosition.value.setFromMatrixPosition(E.matrixWorld),f.nearDistance.value=E.shadow.camera.near,f.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function hm(n,e,t,i){let r={},s={};function a(E,w){const A=w.program;i.uniformBlockBinding(E,A,r[E.id])}function o(E,w){let A=r[E.id];A===void 0&&(_(E),A=u(E),r[E.id]=A,E.addEventListener("dispose",f));const R=w.program;i.updateUBOMapping(E,R);const x=e.render.frame;s[E.id]!==x&&(l(E),s[E.id]=x)}function u(E){const w=n.createBuffer(),A=E.__size,R=E.usage;return n.bindBuffer(n.UNIFORM_BUFFER,w),n.bufferData(n.UNIFORM_BUFFER,A,R),n.bindBuffer(n.UNIFORM_BUFFER,null),w}function l(E){const w=r[E.id],A=E.uniforms,R=E.__cache;n.bindBuffer(n.UNIFORM_BUFFER,w);for(let x=0,c=A.length;x<c;x++){const S=A[x];if(Array.isArray(S))for(let y=0,P=S.length;y<P;y++)m(S[y],x,y,R);else m(S,x,0,R)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function m(E,w,A,R){if(d(E,w,A,R)===!0){const x=E.__offset,c=E.value;if(Array.isArray(c)){let S=0;for(let y=0;y<c.length;y++){const P=c[y],L=T(P,!0);h(P,E.__data,S),S+=L.storage/Float32Array.BYTES_PER_ELEMENT}}else h(c,E.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,x,E.__data)}}function h(E,w,A){typeof E=="number"||typeof E=="boolean"?w[A]=E:E.isMatrix3?(w[A]=E.elements[0],w[A+1]=E.elements[1],w[A+2]=E.elements[2],w[A+3]=0,w[A+4]=E.elements[3],w[A+5]=E.elements[4],w[A+6]=E.elements[5],w[A+7]=0,w[A+8]=E.elements[6],w[A+9]=E.elements[7],w[A+10]=E.elements[8],w[A+11]=0):ArrayBuffer.isView(E)?w.set(E.subarray(0,w.length-A),A):E.toArray(w,A)}function d(E,w,A,R){const x=E.value,c=w+"_"+A;if(Array.isArray(x)){R[c]===void 0&&(R[c]=[]);const S=R[c];let y=!1;for(let P=0;P<x.length;P++)g(x[P],S,P)===!0&&(y=!0);return y}return g(x,R,c)}function g(E,w,A){if(w[A]===void 0)return typeof E=="number"||typeof E=="boolean"?w[A]=E:ArrayBuffer.isView(E)?w[A]=E.slice():w[A]=E.clone(),!0;{const R=w[A];if(typeof E=="number"||typeof E=="boolean"){if(R!==E)return w[A]=E,!0}else{if(ArrayBuffer.isView(E))return!0;if(R.equals(E)===!1)return R.copy(E),!0}}return!1}function _(E){const w=E.uniforms;let A=0;const R=16;for(let c=0,S=w.length;c<S;c++){const y=Array.isArray(w[c])?w[c]:[w[c]];for(let P=0,L=y.length;P<L;P++){const U=y[P],O=Array.isArray(U.value)?U.value:[U.value],I=Array.isArray(w[c])||Array.isArray(U.value);let k=A;for(let z=0,ne=O.length;z<ne;z++){const q=O[z],te=T(q,I),ie=A%R,Ae=ie%te.boundary,Te=ie+Ae;A+=Ae,Te!==0&&R-Te<te.storage&&(A+=R-Te),z===0&&(k=A),A+=te.storage}const Y=U.type==="int"?Int32Array:U.type==="uint"?Uint32Array:Float32Array;U.__data=new Y((A-k)/Float32Array.BYTES_PER_ELEMENT),U.__offset=k}}const x=A%R;return x>0&&(A+=R-x),E.__size=A,E.__cache={},this}function T(E,w){const A={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(A.boundary=4,A.storage=4):E.isVector2?(A.boundary=8,A.storage=8):E.isVector3||E.isColor?(A.boundary=16,A.storage=12):E.isVector4?(A.boundary=16,A.storage=16):E.isMatrix3?(A.boundary=16,A.storage=48):E.isMatrix4?(A.boundary=16,A.storage=64):E.isTexture?ze("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(E)?(A.boundary=16,A.storage=E.byteLength):ze("WebGLRenderer: Unsupported uniform value type.",E),w===!0&&(A.boundary=16,A.storage=Math.ceil(A.storage/16)*16),A}function f(E){const w=E.target;w.removeEventListener("dispose",f),n.deleteBuffer(r[w.id]),delete r[w.id],delete s[w.id]}function p(){for(const E in r)n.deleteBuffer(r[E]);r={},s={}}return{bind:a,update:o,dispose:p}}const pm=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let en=null;function mm(){return en===null&&(en=new ou(pm,16,16,qn,cn),en.name="DFG_LUT",en.minFilter=Ut,en.magFilter=Ut,en.wrapS=_n,en.wrapT=_n,en.generateMipmaps=!1,en.needsUpdate=!0),en}class gm{constructor(e={}){const{canvas:t=Uc(),context:i=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:u=!0,preserveDrawingBuffer:l=!1,powerPreference:m="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1,outputBufferType:g=Vt}=e;this.isWebGLRenderer=!0;let _;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");_=i.getContextAttributes().alpha}else _=a;const T=g,f=new Set([pa,ha,da]),p=new Set([Vt,ln,Pi,di,ua,fa]),E=new Uint32Array(4),w=new Int32Array(4),A={textures:[],min:[],max:[],resolution:[]};let R=null,x=null;const c=[],S=[];let y=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=on,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const P=this;let L=!1,U=null,O=null,I=null,k=null;this._outputColorSpace=Ht;let Y=0,z=0,ne=null,q=-1,te=null;const ie=new pt,Ae=new pt;let Te=null;const Z=new et(0);let he=0,ye=t.width,Pe=t.height,_e=1,Oe=null,C=null;const B=new pt(0,0,ye,Pe),J=new pt(0,0,ye,Pe);let se=!1;const re=new Ir,Le=new xa;let ve=!1,Re=!1;const Ie=new ht,We=new W,Ne=new pt,Ke={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let at=!1;function ct(){return ne===null?_e:1}let F=i;function Ct(M,N){return t.getContext(M,N)}let Ye,ft,xe,_t,Be,Ge,b,v,H,ae,ee,ce,me,$,Q,fe,D,j,K,de,le,ue,Ue;try{const M={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:u,preserveDrawingBuffer:l,powerPreference:m,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Br}`),t.addEventListener("webglcontextlost",Fe,!1),t.addEventListener("webglcontextrestored",ke,!1),t.addEventListener("webglcontextcreationerror",Se,!1),F===null){const N="webgl2";if(F=Ct(N,M),F===null)throw Ct(N)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Xe()}catch(M){throw t.removeEventListener("webglcontextlost",Fe,!1),t.removeEventListener("webglcontextrestored",ke,!1),t.removeEventListener("webglcontextcreationerror",Se,!1),nt("WebGLRenderer: "+M.message),M}function Xe(){Ye=new vh(F),Ye.init(),le=new am(F,Ye),ft=new lh(F,Ye,e,le),xe=new rm(F,Ye),ft.reversedDepthBuffer&&d&&xe.buffers.depth.setReversed(!0),O=F.createFramebuffer(),I=F.createFramebuffer(),k=F.createFramebuffer(),_t=new Eh(F),Be=new Wp,Ge=new sm(F,Ye,xe,Be,ft,le,_t),b=new xh(P),v=new Tu(F),ue=new ah(F,v),H=new Sh(F,v,_t,ue),ae=new yh(F,H,v,ue,_t),j=new Th(F,ft,Ge),Q=new ch(Be),ee=new kp(P,b,Ye,ft,ue,Q),ce=new dm(P,Be),me=new qp,$=new Qp(Ye),D=new sh(P,b,xe,ae,_,u),fe=new im(P,ae,ft),Ue=new hm(F,_t,ft,xe),K=new oh(F,Ye,_t),de=new Mh(F,Ye,_t),_t.programs=ee.programs,P.capabilities=ft,P.extensions=Ye,P.properties=Be,P.renderLists=me,P.shadowMap=fe,P.state=xe,P.info=_t}T!==Vt&&(y=new bh(T,t.width,t.height,o,r,s));const oe=new um(P,F);this.xr=oe,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const M=Ye.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){const M=Ye.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return _e},this.setPixelRatio=function(M){M!==void 0&&(_e=M,this.setSize(ye,Pe,!1))},this.getSize=function(M){return M.set(ye,Pe)},this.setSize=function(M,N,X=!0){if(oe.isPresenting){ze("WebGLRenderer: Can't change size while VR device is presenting.");return}ye=M,Pe=N,t.width=Math.floor(M*_e),t.height=Math.floor(N*_e),X===!0&&(t.style.width=M+"px",t.style.height=N+"px"),y!==null&&y.setSize(t.width,t.height),this.setViewport(0,0,M,N)},this.getDrawingBufferSize=function(M){return M.set(ye*_e,Pe*_e).floor()},this.setDrawingBufferSize=function(M,N,X){ye=M,Pe=N,_e=X,t.width=Math.floor(M*X),t.height=Math.floor(N*X),this.setViewport(0,0,M,N)},this.setEffects=function(M){if(T===Vt){nt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(M){for(let N=0;N<M.length;N++)if(M[N].isOutputPass===!0){ze("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}y.setEffects(M||[])},this.getCurrentViewport=function(M){return M.copy(ie)},this.getViewport=function(M){return M.copy(B)},this.setViewport=function(M,N,X,G){M.isVector4?B.set(M.x,M.y,M.z,M.w):B.set(M,N,X,G),xe.viewport(ie.copy(B).multiplyScalar(ct()).round())},this.getScissor=function(M){return M.copy(J)},this.setScissor=function(M,N,X,G){M.isVector4?J.set(M.x,M.y,M.z,M.w):J.set(M,N,X,G),xe.scissor(Ae.copy(J).multiplyScalar(ct()).round())},this.getScissorTest=function(){return se},this.setScissorTest=function(M){xe.setScissorTest(se=M)},this.setOpaqueSort=function(M){Oe=M},this.setTransparentSort=function(M){C=M},this.getClearColor=function(M){return M.copy(D.getClearColor())},this.setClearColor=function(){D.setClearColor(...arguments)},this.getClearAlpha=function(){return D.getClearAlpha()},this.setClearAlpha=function(){D.setClearAlpha(...arguments)},this.clear=function(M=!0,N=!0,X=!0){let G=0;if(M){let V=!1;if(ne!==null){const ge=ne.texture.format;V=f.has(ge)}if(V){const ge=ne.texture.type,be=p.has(ge),pe=D.getClearColor(),Ee=D.getClearAlpha(),De=pe.r,Ve=pe.g,Ze=pe.b;be?(E[0]=De,E[1]=Ve,E[2]=Ze,E[3]=Ee,F.clearBufferuiv(F.COLOR,0,E)):(w[0]=De,w[1]=Ve,w[2]=Ze,w[3]=Ee,F.clearBufferiv(F.COLOR,0,w))}else G|=F.COLOR_BUFFER_BIT}N&&(G|=F.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),X&&(G|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G!==0&&F.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(M){M.setRenderer(this),U=M},this.dispose=function(){t.removeEventListener("webglcontextlost",Fe,!1),t.removeEventListener("webglcontextrestored",ke,!1),t.removeEventListener("webglcontextcreationerror",Se,!1),D.dispose(),me.dispose(),$.dispose(),Ge.dispose(),Be.dispose(),b.dispose(),ae.dispose(),H.dispose(),ue.dispose(),Ue.dispose(),ee.dispose(),oe.dispose(),oe.removeEventListener("sessionstart",Ra),oe.removeEventListener("sessionend",wa),Fn.stop()};function Fe(M){M.preventDefault(),Dr("WebGLRenderer: Context Lost."),L=!0}function ke(){Dr("WebGLRenderer: Context Restored."),L=!1;const M=_t.autoReset,N=fe.enabled,X=fe.autoUpdate,G=fe.needsUpdate,V=fe.type;Xe(),_t.autoReset=M,fe.enabled=N,fe.autoUpdate=X,fe.needsUpdate=G,fe.type=V}function Se(M){nt("WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function rt(M){const N=M.target;N.removeEventListener("dispose",rt),St(N)}function St(M){Sn(M),Be.remove(M)}function Sn(M){const N=Be.get(M).programs;N!==void 0&&(N.forEach(function(X){ee.releaseProgram(X)}),M.isShaderMaterial&&ee.releaseShaderCache(M))}this.renderBufferDirect=function(M,N,X,G,V,ge){N===null&&(N=Ke);const be=V.isMesh&&V.matrixWorld.determinantAffine()<0,pe=ql(M,N,X,G,V);xe.setMaterial(G,be);let Ee=X.index,De=1;if(G.wireframe===!0){if(Ee=H.getWireframeAttribute(X),Ee===void 0)return;De=2}const Ve=X.drawRange,Ze=X.attributes.position;let we=Ve.start*De,$e=(Ve.start+Ve.count)*De;ge!==null&&(we=Math.max(we,ge.start*De),$e=Math.min($e,(ge.start+ge.count)*De)),Ee!==null?(we=Math.max(we,0),$e=Math.min($e,Ee.count)):Ze!=null&&(we=Math.max(we,0),$e=Math.min($e,Ze.count));const mt=$e-we;if(mt<0||mt===1/0)return;ue.setup(V,G,pe,X,Ee);let lt,ot=K;if(Ee!==null&&(lt=v.get(Ee),ot=de,ot.setIndex(lt)),V.isMesh)G.wireframe===!0?(xe.setLineWidth(G.wireframeLinewidth*ct()),ot.setMode(F.LINES)):ot.setMode(F.TRIANGLES);else if(V.isLine){let At=G.linewidth;At===void 0&&(At=1),xe.setLineWidth(At*ct()),V.isLineSegments?ot.setMode(F.LINES):V.isLineLoop?ot.setMode(F.LINE_LOOP):ot.setMode(F.LINE_STRIP)}else V.isPoints?ot.setMode(F.POINTS):V.isSprite&&ot.setMode(F.TRIANGLES);if(V.isBatchedMesh)if(Ye.get("WEBGL_multi_draw"))ot.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{const At=V._multiDrawStarts,Ce=V._multiDrawCounts,Pt=V._multiDrawCount,tt=Ee?v.get(Ee).bytesPerElement:1,On=Be.get(G).currentProgram.getUniforms();for(let bt=0;bt<Pt;bt++)On.setValue(F,"_gl_DrawID",bt),ot.render(At[bt]/tt,Ce[bt])}else if(V.isInstancedMesh)ot.renderInstances(we,mt,V.count);else if(X.isInstancedBufferGeometry){const At=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,Ce=Math.min(X.instanceCount,At);ot.renderInstances(we,mt,Ce)}else ot.render(we,mt)};function ba(M,N,X,G){U!==null&&M.isNodeMaterial&&U.setObject(G,M),ve===!0&&Q.setState(M,X,!1),M.transparent===!0&&M.side===rn&&M.forceSinglePass===!1?(M.side=Ft,M.needsUpdate=!0,_i(M,N,G),M.side=Dn,M.needsUpdate=!0,_i(M,N,G),M.side=rn):_i(M,N,G)}this.compile=function(M,N,X=null){X===null&&(X=M),U!==null&&U.renderStart(M,N,X),x=$.get(X),x.init(N),S.push(x),X.traverseVisible(function(V){V.isLight&&V.layers.test(N.layers)&&(x.pushLight(V),V.castShadow&&x.pushShadow(V))}),M!==X&&M.traverseVisible(function(V){V.isLight&&V.layers.test(N.layers)&&(x.pushLight(V),V.castShadow&&x.pushShadow(V))}),x.setupLights(),U!==null&&U.updateLights(x.state.lightsArray),Re=this.localClippingEnabled,ve=Q.init(this.clippingPlanes,Re),ve===!0&&Q.setGlobalState(this.clippingPlanes,N),U!==null&&fe.render(x.state.shadowsArray,X,N);const G=new Set;return M.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;const ge=V.material;if(ge)if(Array.isArray(ge))for(let be=0;be<ge.length;be++){const pe=ge[be];ba(pe,X,N,V),G.add(pe)}else ba(ge,X,N,V),G.add(ge)}),x=S.pop(),U!==null&&U.renderEnd(),G},this.compileAsync=function(M,N,X=null){const G=this.compile(M,N,X);return new Promise(V=>{function ge(){if(G.forEach(function(be){const Ee=Be.get(be).currentProgram;(Ee===void 0||Ee.isReady())&&G.delete(be)}),G.size===0){V(M);return}setTimeout(ge,10)}Ye.get("KHR_parallel_shader_compile")!==null?ge():setTimeout(ge,10)})};let Wr=null;function Wl(M){Wr&&Wr(M)}function Ra(){Fn.stop()}function wa(){Fn.start()}const Fn=new Il;Fn.setAnimationLoop(Wl),typeof self<"u"&&Fn.setContext(self),this.setAnimationLoop=function(M){Wr=M,oe.setAnimationLoop(M),M===null?Fn.stop():Fn.start()},oe.addEventListener("sessionstart",Ra),oe.addEventListener("sessionend",wa),this.render=function(M,N){if(N!==void 0&&N.isCamera!==!0){nt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;U!==null&&U.renderStart(M,N);const X=oe.enabled===!0&&oe.isPresenting===!0,G=y!==null&&(ne===null||X)&&y.begin(P,ne);if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),oe.enabled===!0&&oe.isPresenting===!0&&(y===null||y.isCompositing()===!1)&&(oe.cameraAutoUpdate===!0&&oe.updateCamera(N),N=oe.getCamera()),M.isScene===!0&&M.onBeforeRender(P,M,N,ne),x=$.get(M,S.length),x.init(N),x.state.textureUnits=Ge.getTextureUnits(),S.push(x),Ie.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),N.isArrayCamera?Le.setFromArrayCamera(N):re.setFromProjectionMatrix(Ie,Jt,N.reversedDepth),Re=this.localClippingEnabled,ve=Q.init(this.clippingPlanes,Re),R=me.get(M,c.length),R.init(),c.push(R),this.info.render.frame++,oe.enabled===!0&&oe.isPresenting===!0){const be=P.xr.getDepthSensingMesh();be!==null&&Xr(be,N,-1/0,P.sortObjects)}Xr(M,N,0,P.sortObjects),R.finish(),U!==null&&U.updateLights(x.state.lightsArray),P.sortObjects===!0&&R.sort(Oe,C),at=oe.enabled===!1||oe.isPresenting===!1||oe.hasDepthSensing()===!1,at&&D.addToRenderList(R,M),this.info.autoReset===!0&&this.info.reset(),ve===!0&&Q.beginShadows();const V=x.state.shadowsArray;if(fe.render(V,M,N),ve===!0&&Q.endShadows(),(G&&y.hasRenderPass())===!1){const be=R.opaque,pe=R.transmissive;if(x.setupLights(),N.isArrayCamera){const Ee=N.cameras;if(pe.length>0)for(let De=0,Ve=Ee.length;De<Ve;De++){const Ze=Ee[De];Pa(be,pe,M,Ze)}at&&D.render(M);for(let De=0,Ve=Ee.length;De<Ve;De++){const Ze=Ee[De];Ca(R,M,Ze,Ze.viewport)}}else pe.length>0&&Pa(be,pe,M,N),at&&D.render(M),Ca(R,M,N)}ne!==null&&z===0&&(Ge.updateMultisampleRenderTarget(ne),Ge.updateRenderTargetMipmap(ne)),G&&y.end(P),M.isScene===!0&&M.onAfterRender(P,M,N),ue.resetDefaultState(),q=-1,te=null,S.pop(),S.length>0?(x=S[S.length-1],Ge.setTextureUnits(x.state.textureUnits),ve===!0&&Q.setGlobalState(P.clippingPlanes,x.state.camera)):x=null,c.pop(),c.length>0?R=c[c.length-1]:R=null,U!==null&&U.renderEnd()};function Xr(M,N,X,G){if(M.visible===!1)return;if(M.layers.test(N.layers)){if(M.isGroup)X=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(N);else if(M.isLight)x.pushLight(M),M.castShadow&&x.pushShadow(M);else if(M.isSprite){const be=N.isArrayCamera?Le:re;if(!M.frustumCulled||M.intersectsFrustum(be)){G&&Ne.setFromMatrixPosition(M.matrixWorld).applyMatrix4(Ie);const pe=ae.update(M),Ee=M.material;Ee.visible&&R.push(M,pe,Ee,X,Ne.z,null,N)}}else if(M.isMesh||M.isLine||M.isPoints){const be=N.isArrayCamera?Le:re;if(!M.frustumCulled||M.intersectsFrustum(be)){const pe=ae.update(M),Ee=M.material;if(G&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),Ne.copy(M.boundingSphere.center)):(pe.boundingSphere===null&&pe.computeBoundingSphere(),Ne.copy(pe.boundingSphere.center)),Ne.applyMatrix4(M.matrixWorld).applyMatrix4(Ie)),Array.isArray(Ee)){const De=pe.groups;for(let Ve=0,Ze=De.length;Ve<Ze;Ve++){const we=De[Ve],$e=Ee[we.materialIndex];$e&&$e.visible&&R.push(M,pe,$e,X,Ne.z,we,N)}}else Ee.visible&&R.push(M,pe,Ee,X,Ne.z,null,N)}}}const ge=M.children;for(let be=0,pe=ge.length;be<pe;be++)Xr(ge[be],N,X,G)}function Ca(M,N,X,G){const{opaque:V,transmissive:ge,transparent:be}=M;x.setupLightsView(X),ve===!0&&Q.setGlobalState(P.clippingPlanes,X),G&&xe.viewport(ie.copy(G)),V.length>0&&Bi(V,N,X),ge.length>0&&Bi(ge,N,X),be.length>0&&Bi(be,N,X),xe.buffers.depth.setTest(!0),xe.buffers.depth.setMask(!0),xe.buffers.color.setMask(!0),xe.setPolygonOffset(!1)}function Pa(M,N,X,G){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;if(x.state.transmissionRenderTarget[G.id]===void 0){const we=Ye.has("EXT_color_buffer_half_float")||Ye.has("EXT_color_buffer_float");x.state.transmissionRenderTarget[G.id]=new kt(1,1,{generateMipmaps:!0,type:we?cn:Vt,minFilter:Pn,samples:Math.max(4,ft.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Je.workingColorSpace})}const ge=x.state.transmissionRenderTarget[G.id],be=G.viewport||ie;ge.setSize(be.z*P.transmissionResolutionScale,be.w*P.transmissionResolutionScale);const pe=P.getRenderTarget(),Ee=P.getActiveCubeFace(),De=P.getActiveMipmapLevel();P.setRenderTarget(ge),P.getClearColor(Z),he=P.getClearAlpha(),he<1&&P.setClearColor(16777215,.5),P.clear(),at&&D.render(X);const Ve=P.toneMapping;P.toneMapping=on;const Ze=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),x.setupLightsView(G),ve===!0&&Q.setGlobalState(P.clippingPlanes,G),Bi(M,X,G),Ge.updateMultisampleRenderTarget(ge),Ge.updateRenderTargetMipmap(ge),Ye.has("WEBGL_multisampled_render_to_texture")===!1){let we=!1;for(let $e=0,mt=N.length;$e<mt;$e++){const lt=N[$e],{object:ot,geometry:At,material:Ce,group:Pt}=lt;if(Ce.side===rn&&ot.layers.test(G.layers)){const tt=Ce.side;Ce.side=Ft,Ce.needsUpdate=!0,La(ot,X,G,At,Ce,Pt),Ce.side=tt,Ce.needsUpdate=!0,we=!0}}we===!0&&(Ge.updateMultisampleRenderTarget(ge),Ge.updateRenderTargetMipmap(ge))}P.setRenderTarget(pe,Ee,De),P.setClearColor(Z,he),Ze!==void 0&&(G.viewport=Ze),P.toneMapping=Ve}function Bi(M,N,X){const G=N.isScene===!0?N.overrideMaterial:null;for(let V=0,ge=M.length;V<ge;V++){const be=M[V],{object:pe,geometry:Ee,group:De}=be;let Ve=be.material;Ve.allowOverride===!0&&G!==null&&(Ve=G),pe.layers.test(X.layers)&&La(pe,N,X,Ee,Ve,De)}}function La(M,N,X,G,V,ge){U!==null&&V.isNodeMaterial&&U.setObject(M,V),M.onBeforeRender(P,N,X,G,V,ge),M.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),V.onBeforeRender(P,N,X,G,M,ge),V.transparent===!0&&V.side===rn&&V.forceSinglePass===!1?(V.side=Ft,V.needsUpdate=!0,P.renderBufferDirect(X,N,G,V,M,ge),V.side=Dn,V.needsUpdate=!0,P.renderBufferDirect(X,N,G,V,M,ge),V.side=rn):P.renderBufferDirect(X,N,G,V,M,ge),M.onAfterRender(P,N,X,G,V,ge)}function Da(M){let N=0;for(const X of M)X.texture!==null&&N++;return N}function _i(M,N,X){N.isScene!==!0&&(N=Ke);const G=Be.get(M),V=x.state.lights,ge=x.state.shadowsArray,be=V.state.version,pe=ee.getParameters(M,V.state,ge,N,X,x.state.lightProbeGridArray),Ee=ee.getProgramCacheKey(pe);let De=G.programs;G.environment=M.isMeshStandardMaterial||M.isMeshLambertMaterial||M.isMeshPhongMaterial?N.environment:null,G.fog=N.fog;const Ve=M.isMeshStandardMaterial||M.isMeshLambertMaterial&&!M.envMap||M.isMeshPhongMaterial&&!M.envMap;G.envMap=b.get(M.envMap||G.environment,Ve),G.envMapRotation=G.environment!==null&&M.envMap===null?N.environmentRotation:M.envMapRotation,De===void 0&&(M.addEventListener("dispose",rt),De=new Map,G.programs=De,G.programVariants=new Map);let Ze=De.get(Ee);if(Ze!==void 0){if(G.currentProgram===Ze&&G.lightsStateVersion===be)return Na(M,pe),Ze}else pe.uniforms=ee.getUniforms(M),U!==null&&M.isNodeMaterial&&U.build(M,X,pe),M.onBeforeCompile(pe,P),Ze=ee.acquireProgram(pe,Ee),De.set(Ee,Ze),G.uniforms=pe.uniforms;const we=G.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(we.clippingPlanes=Q.uniform),Na(M,pe),G.needsLights=Kl(M),G.lightsStateVersion=be,G.needsLights&&(we.ambientLightColor.value=V.state.ambient,we.lightProbe.value=V.state.probe,we.sunLights.value=V.state.sun,we.sunLightShadows.value=V.state.sunShadow,we.directionalLights.value=V.state.directional,we.directionalLightShadows.value=V.state.directionalShadow,we.spotLights.value=V.state.spot,we.spotLightShadows.value=V.state.spotShadow,we.rectAreaLights.value=V.state.rectArea,we.ltc_1.value=V.state.rectAreaLTC1,we.ltc_2.value=V.state.rectAreaLTC2,we.pointLights.value=V.state.point,we.pointLightShadows.value=V.state.pointShadow,we.hemisphereLights.value=V.state.hemi,we.sunShadowMatrix.value=V.state.sunShadowMatrix,we.sunShadowCascade.value=V.state.sunShadowCascade,we.directionalShadowMatrix.value=V.state.directionalShadowMatrix,we.spotLightMatrix.value=V.state.spotLightMatrix,we.spotLightMap.value=V.state.spotLightMap,we.pointShadowMatrix.value=V.state.pointShadowMatrix),G.numLightProbeGrids=Da(x.state.lightProbeGridArray),G.currentProgram=Ze,G.uniformsList=null,Ze}function Xl(M,N,X,G,V){const ge=Be.get(M),be=ge.currentProgram.id+","+G+","+V;let pe=ge.programVariants.get(be);return pe===void 0?(pe=_i(M,N,X),ge.programVariants.set(be,pe)):(ge.currentProgram=pe,ge.uniformsList=null,ge.outputColorSpace=G,ge.toneMapping=V),pe}function Ia(M){if(M.uniformsList===null){const N=M.currentProgram.getUniforms();M.uniformsList=vr.seqWithValue(N.seq,M.uniforms)}return M.uniformsList}function Na(M,N){const X=Be.get(M);X.outputColorSpace=N.outputColorSpace,X.batching=N.batching,X.batchingColor=N.batchingColor,X.instancing=N.instancing,X.instancingColor=N.instancingColor,X.instancingMorph=N.instancingMorph,X.skinning=N.skinning,X.morphTargets=N.morphTargets,X.morphNormals=N.morphNormals,X.morphColors=N.morphColors,X.morphTargetsCount=N.morphTargetsCount,X.numClippingPlanes=N.numClippingPlanes,X.numIntersection=N.numClipIntersection,X.vertexAlphas=N.vertexAlphas,X.vertexTangents=N.vertexTangents,X.toneMapping=N.toneMapping}function ql(M,N,X,G,V){N.isScene!==!0&&(N=Ke),Ge.resetTextureUnits();const ge=N.fog,be=G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial?N.environment:null,pe=ne===null?P.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:Je.workingColorSpace,Ee=G.isMeshStandardMaterial||G.isMeshLambertMaterial&&!G.envMap||G.isMeshPhongMaterial&&!G.envMap,De=b.get(G.envMap||be,Ee),Ve=G.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,Ze=!!X.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),we=!!X.morphAttributes.position,$e=!!X.morphAttributes.normal,mt=!!X.morphAttributes.color;let lt=on;G.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(lt=P.toneMapping);const ot=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,At=ot!==void 0?ot.length:0,Ce=Be.get(G),Pt=x.state.lights;if(ve===!0&&(Re===!0||M!==te)){const dt=M===te&&G.id===q;Q.setState(G,M,dt)}let tt=!1,On=!1;G.version===Ce.__version?Ce.needsLights&&Ce.lightsStateVersion!==Pt.state.version||V.isBatchedMesh&&Ce.batching===!1||!V.isBatchedMesh&&Ce.batching===!0||V.isBatchedMesh&&Ce.batchingColor===!0&&V._colorsTexture===null||V.isBatchedMesh&&Ce.batchingColor===!1&&V._colorsTexture!==null||V.isInstancedMesh&&Ce.instancing===!1||!V.isInstancedMesh&&Ce.instancing===!0||V.isSkinnedMesh&&Ce.skinning===!1||!V.isSkinnedMesh&&Ce.skinning===!0||V.isInstancedMesh&&Ce.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&Ce.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&Ce.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&Ce.instancingMorph===!1&&V.morphTexture!==null||Ce.envMap!==De||G.fog===!0&&Ce.fog!==ge||Ce.numClippingPlanes!==void 0&&(Ce.numClippingPlanes!==Q.numPlanes||Ce.numIntersection!==Q.numIntersection)||Ce.vertexAlphas!==Ve||Ce.vertexTangents!==Ze||Ce.morphTargets!==we||Ce.morphNormals!==$e||Ce.morphColors!==mt||Ce.morphTargetsCount!==At||Ce.numLightProbeGrids!==Da(x.state.lightProbeGridArray)?tt=!0:(Ce.outputColorSpace!==pe||Ce.toneMapping!==lt)&&(On=!0):(tt=!0,Ce.__version=G.version);let bt=Ce.currentProgram;(tt===!0||On===!0)&&(bt=On===!0?Xl(G,N,V,pe,lt):_i(G,N,V),U&&G.isNodeMaterial&&U.onUpdateProgram(G,bt,Ce));let zi=!1,Mn=!1,Bn=!1;const je=bt.getUniforms(),Tt=Ce.uniforms;if(xe.useProgram(bt.program)&&(zi=!0,Mn=!0,Bn=!0),G.id!==q&&(q=G.id,Mn=!0),zi||te!==M){xe.buffers.depth.getReversed()&&M.reversedDepth!==!0&&(M._reversedDepth=!0,M.updateProjectionMatrix()),je.setValue(F,"projectionMatrix",M.projectionMatrix),je.setValue(F,"viewMatrix",M.matrixWorldInverse);const Mt=je.map.cameraPosition;Mt!==void 0&&Mt.setValue(F,We.setFromMatrixPosition(M.matrixWorld)),ft.logarithmicDepthBuffer&&je.setValue(F,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&je.setValue(F,"isOrthographic",M.isOrthographicCamera===!0),te!==M&&(te=M,Mn=!0,Bn=!0)}if(Ce.needsLights&&(Pt.state.sunShadowMap.length>0&&je.setValue(F,"sunShadowMap",Pt.state.sunShadowMap,Ge),Pt.state.directionalShadowMap.length>0&&je.setValue(F,"directionalShadowMap",Pt.state.directionalShadowMap,Ge),Pt.state.spotShadowMap.length>0&&je.setValue(F,"spotShadowMap",Pt.state.spotShadowMap,Ge),Pt.state.pointShadowMap.length>0&&je.setValue(F,"pointShadowMap",Pt.state.pointShadowMap,Ge)),V.isSkinnedMesh){je.setOptional(F,V,"bindMatrix"),je.setOptional(F,V,"bindMatrixInverse");const dt=V.skeleton;dt&&(dt.boneTexture===null&&dt.computeBoneTexture(),je.setValue(F,"boneTexture",dt.boneTexture,Ge))}V.isBatchedMesh&&(je.setOptional(F,V,"batchingTexture"),je.setValue(F,"batchingTexture",V._matricesTexture,Ge),je.setOptional(F,V,"batchingIdTexture"),je.setValue(F,"batchingIdTexture",V._indirectTexture,Ge),je.setOptional(F,V,"batchingColorTexture"),V._colorsTexture!==null&&je.setValue(F,"batchingColorTexture",V._colorsTexture,Ge));const Wt=X.morphAttributes;if((Wt.position!==void 0||Wt.normal!==void 0||Wt.color!==void 0)&&j.update(V,X,bt),(Mn||Ce.receiveShadow!==V.receiveShadow)&&(Ce.receiveShadow=V.receiveShadow,je.setValue(F,"receiveShadow",V.receiveShadow)),(G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial)&&G.envMap===null&&N.environment!==null&&(Tt.envMapIntensity.value=N.environmentIntensity),Tt.dfgLUT!==void 0&&(Tt.dfgLUT.value=mm()),Mn){if(je.setValue(F,"toneMappingExposure",P.toneMappingExposure),Ce.needsLights&&Yl(Tt,Bn),ge&&G.fog===!0&&ce.refreshFogUniforms(Tt,ge),ce.refreshMaterialUniforms(Tt,G,_e,Pe,x.state.transmissionRenderTarget[M.id]),Ce.needsLights&&Ce.numLightProbeGrids>0){const dt=A;let Mt=0;for(const fn of x.state.lightProbeGridArray)fn.texture!==null&&(dt.textures[Mt]=fn.texture,dt.min[Mt]=fn.boundingBox.min,dt.max[Mt]=fn.boundingBox.max,dt.resolution[Mt]=fn.resolution,Mt++);for(const fn in dt)dt[fn].length=Mt;Tt.probesSH.value=dt.textures,Tt.probesMin.value=dt.min,Tt.probesMax.value=dt.max,Tt.probesResolution.value=dt.resolution}vr.upload(F,Ia(Ce),Tt,Ge)}if(G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(vr.upload(F,Ia(Ce),Tt,Ge),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&je.setValue(F,"center",V.center),je.setValue(F,"modelViewMatrix",V.modelViewMatrix),je.setValue(F,"normalMatrix",V.normalMatrix),je.setValue(F,"modelMatrix",V.matrixWorld),G.uniformsGroups!==void 0){const dt=G.uniformsGroups;for(let Mt=0,fn=dt.length;Mt<fn;Mt++){const Fa=dt[Mt];Ue.update(Fa,bt),Ue.bind(Fa,bt)}}return bt}function Yl(M,N){M.ambientLightColor.needsUpdate=N,M.lightProbe.needsUpdate=N,M.sunLights.needsUpdate=N,M.sunLightShadows.needsUpdate=N,M.directionalLights.needsUpdate=N,M.directionalLightShadows.needsUpdate=N,M.pointLights.needsUpdate=N,M.pointLightShadows.needsUpdate=N,M.spotLights.needsUpdate=N,M.spotLightShadows.needsUpdate=N,M.rectAreaLights.needsUpdate=N,M.hemisphereLights.needsUpdate=N}function Kl(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return Y},this.getActiveMipmapLevel=function(){return z},this.getRenderTarget=function(){return ne},this.setRenderTargetTextures=function(M,N,X){const G=Be.get(M);G.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),Be.get(M.texture).__webglTexture=N,Be.get(M.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:X,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,N){const X=Be.get(M);X.__webglFramebuffer=N,X.__useDefaultFramebuffer=N===void 0},this.setRenderTarget=function(M,N=0,X=0){ne=M,Y=N,z=X;let G=null,V=!1,ge=!1;if(M){const pe=Be.get(M);if(pe.__useDefaultFramebuffer!==void 0){xe.bindFramebuffer(F.FRAMEBUFFER,pe.__webglFramebuffer),ie.copy(M.viewport),Ae.copy(M.scissor),Te=M.scissorTest,xe.viewport(ie),xe.scissor(Ae),xe.setScissorTest(Te),q=-1;return}else if(pe.__webglFramebuffer===void 0)Ge.setupRenderTarget(M);else if(pe.__hasExternalTextures)Ge.rebindTextures(M,Be.get(M.texture).__webglTexture,Be.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){const Ve=M.depthTexture;if(pe.__boundDepthTexture!==Ve){if(Ve!==null&&Be.has(Ve)&&(M.width!==Ve.image.width||M.height!==Ve.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Ge.setupDepthRenderbuffer(M)}}const Ee=M.texture;(Ee.isData3DTexture||Ee.isDataArrayTexture||Ee.isCompressedArrayTexture)&&(ge=!0);const De=Be.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(De[N])?G=De[N][X]:G=De[N],V=!0):M.samples>0&&Ge.useMultisampledRTT(M)===!1?G=Be.get(M).__webglMultisampledFramebuffer:Array.isArray(De)?G=De[X]:G=De,ie.copy(M.viewport),Ae.copy(M.scissor),Te=M.scissorTest}else ie.copy(B).multiplyScalar(_e).floor(),Ae.copy(J).multiplyScalar(_e).floor(),Te=se;if(X!==0&&(G=O),xe.bindFramebuffer(F.FRAMEBUFFER,G)&&xe.drawBuffers(M,G),xe.viewport(ie),xe.scissor(Ae),xe.setScissorTest(Te),V){const pe=Be.get(M.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+N,pe.__webglTexture,X)}else if(ge){const pe=N;for(let Ee=0;Ee<M.textures.length;Ee++){const De=Be.get(M.textures[Ee]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+Ee,De.__webglTexture,X,pe)}}else if(M!==null&&X!==0){const pe=Be.get(M.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,pe.__webglTexture,X)}q=-1};function Ua(M){const N=Be.get(M);return(N.__readFormat!==M.format||N.__readType!==M.type)&&(N.__readFormat=M.format,N.__readType=M.type,N.__formatReadable=ft.textureFormatReadable(M.format),N.__typeReadable=ft.textureTypeReadable(M.type)),N}this.readRenderTargetPixels=function(M,N,X,G,V,ge,be,pe=0){if(!(M&&M.isWebGLRenderTarget)){nt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ee=Be.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&be!==void 0&&(Ee=Ee[be],Array.isArray(Ee)&&(Ee=Ee[0])),Ee){xe.bindFramebuffer(F.FRAMEBUFFER,Ee);try{const De=M.textures[pe],Ve=De.format,Ze=De.type;M.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+pe);const we=Ua(De);if(we.__formatReadable===!1){nt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(we.__typeReadable===!1){nt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=M.width-G&&X>=0&&X<=M.height-V&&F.readPixels(N,X,G,V,le.convert(Ve),le.convert(Ze),ge)}finally{const De=ne!==null?Be.get(ne).__webglFramebuffer:null;xe.bindFramebuffer(F.FRAMEBUFFER,De)}}},this.readRenderTargetPixelsAsync=async function(M,N,X,G,V,ge,be,pe=0){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ee=Be.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&be!==void 0&&(Ee=Ee[be],Array.isArray(Ee)&&(Ee=Ee[0])),Ee)if(N>=0&&N<=M.width-G&&X>=0&&X<=M.height-V){xe.bindFramebuffer(F.FRAMEBUFFER,Ee);const De=M.textures[pe],Ve=De.format,Ze=De.type;M.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+pe);const we=Ua(De);if(we.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(we.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const $e=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,$e),F.bufferData(F.PIXEL_PACK_BUFFER,ge.byteLength,F.STREAM_READ),F.readPixels(N,X,G,V,le.convert(Ve),le.convert(Ze),0),F.bindBuffer(F.PIXEL_PACK_BUFFER,null);const mt=ne!==null?Be.get(ne).__webglFramebuffer:null;xe.bindFramebuffer(F.FRAMEBUFFER,mt);const lt=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await Fc(F,lt,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,$e),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,ge),F.bindBuffer(F.PIXEL_PACK_BUFFER,null),F.deleteBuffer($e),F.deleteSync(lt),ge}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,N=null,X=0){const G=Math.pow(2,-X),V=Math.floor(M.image.width*G),ge=Math.floor(M.image.height*G),be=N!==null?N.x:0,pe=N!==null?N.y:0;Ge.setTexture2D(M,0),F.copyTexSubImage2D(F.TEXTURE_2D,X,0,0,be,pe,V,ge),xe.unbindTexture()},this.copyTextureToTexture=function(M,N,X=null,G=null,V=0,ge=0){let be,pe,Ee,De,Ve,Ze,we,$e,mt;const lt=M.isCompressedTexture?M.mipmaps[ge]:M.image;if(X!==null)be=X.max.x-X.min.x,pe=X.max.y-X.min.y,Ee=X.isBox3?X.max.z-X.min.z:1,De=X.min.x,Ve=X.min.y,Ze=X.isBox3?X.min.z:0;else{const je=Math.pow(2,-V);be=Math.floor(lt.width*je),pe=Math.floor(lt.height*je),M.isDataArrayTexture?Ee=lt.depth:M.isData3DTexture?Ee=Math.floor(lt.depth*je):Ee=1,De=0,Ve=0,Ze=0}G!==null?(we=G.x,$e=G.y,mt=G.z):(we=0,$e=0,mt=0);const ot=le.convert(N.format),At=le.convert(N.type);let Ce;N.isData3DTexture?(Ge.setTexture3D(N,0),Ce=F.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?(Ge.setTexture2DArray(N,0),Ce=F.TEXTURE_2D_ARRAY):(Ge.setTexture2D(N,0),Ce=F.TEXTURE_2D),xe.activeTexture(F.TEXTURE0),xe.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,N.flipY),xe.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),xe.pixelStorei(F.UNPACK_ALIGNMENT,N.unpackAlignment);const Pt=xe.getParameter(F.UNPACK_ROW_LENGTH),tt=xe.getParameter(F.UNPACK_IMAGE_HEIGHT),On=xe.getParameter(F.UNPACK_SKIP_PIXELS),bt=xe.getParameter(F.UNPACK_SKIP_ROWS),zi=xe.getParameter(F.UNPACK_SKIP_IMAGES);xe.pixelStorei(F.UNPACK_ROW_LENGTH,lt.width),xe.pixelStorei(F.UNPACK_IMAGE_HEIGHT,lt.height),xe.pixelStorei(F.UNPACK_SKIP_PIXELS,De),xe.pixelStorei(F.UNPACK_SKIP_ROWS,Ve),xe.pixelStorei(F.UNPACK_SKIP_IMAGES,Ze);const Mn=M.isDataArrayTexture||M.isData3DTexture,Bn=N.isDataArrayTexture||N.isData3DTexture;if(M.isDepthTexture){const je=Be.get(M),Tt=Be.get(N),Wt=Be.get(je.__renderTarget),dt=Be.get(Tt.__renderTarget);xe.bindFramebuffer(F.READ_FRAMEBUFFER,Wt.__webglFramebuffer),xe.bindFramebuffer(F.DRAW_FRAMEBUFFER,dt.__webglFramebuffer);for(let Mt=0;Mt<Ee;Mt++)Mn&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Be.get(M).__webglTexture,V,Ze+Mt),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Be.get(N).__webglTexture,ge,mt+Mt)),F.blitFramebuffer(De,Ve,De+be,Ve+pe,we,$e,we+be,$e+pe,F.DEPTH_BUFFER_BIT,F.NEAREST);xe.bindFramebuffer(F.READ_FRAMEBUFFER,null),xe.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(V!==0||M.isRenderTargetTexture||Be.has(M)){const je=Be.get(M),Tt=Be.get(N);xe.bindFramebuffer(F.READ_FRAMEBUFFER,I),xe.bindFramebuffer(F.DRAW_FRAMEBUFFER,k);for(let Wt=0;Wt<Ee;Wt++)Mn?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,je.__webglTexture,V,Ze+Wt):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,je.__webglTexture,V),Bn?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Tt.__webglTexture,ge,mt+Wt):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Tt.__webglTexture,ge),V!==0?F.blitFramebuffer(De,Ve,De+be,Ve+pe,we,$e,we+be,$e+pe,F.COLOR_BUFFER_BIT,F.NEAREST):Bn?F.copyTexSubImage3D(Ce,ge,we,$e,mt+Wt,De,Ve,be,pe):F.copyTexSubImage2D(Ce,ge,we,$e,De,Ve,be,pe);xe.bindFramebuffer(F.READ_FRAMEBUFFER,null),xe.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else Bn?M.isDataTexture||M.isData3DTexture?F.texSubImage3D(Ce,ge,we,$e,mt,be,pe,Ee,ot,At,lt.data):N.isCompressedArrayTexture?F.compressedTexSubImage3D(Ce,ge,we,$e,mt,be,pe,Ee,ot,lt.data):F.texSubImage3D(Ce,ge,we,$e,mt,be,pe,Ee,ot,At,lt):M.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,ge,we,$e,be,pe,ot,At,lt.data):M.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,ge,we,$e,lt.width,lt.height,ot,lt.data):F.texSubImage2D(F.TEXTURE_2D,ge,we,$e,be,pe,ot,At,lt);xe.pixelStorei(F.UNPACK_ROW_LENGTH,Pt),xe.pixelStorei(F.UNPACK_IMAGE_HEIGHT,tt),xe.pixelStorei(F.UNPACK_SKIP_PIXELS,On),xe.pixelStorei(F.UNPACK_SKIP_ROWS,bt),xe.pixelStorei(F.UNPACK_SKIP_IMAGES,zi),ge===0&&N.generateMipmaps===!0&&N.mipmapsAutoUpdate===!0&&F.generateMipmap(Ce),xe.unbindTexture()},this.initRenderTarget=function(M){Be.get(M).__webglFramebuffer===void 0&&Ge.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?Ge.setTextureCube(M,0):M.isData3DTexture?Ge.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?Ge.setTexture2DArray(M,0):Ge.setTexture2D(M,0),xe.unbindTexture()},this.resetState=function(){Y=0,z=0,ne=null,xe.reset(),ue.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Jt}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Je._getDrawingBufferColorSpace(e),t.unpackColorSpace=Je._getUnpackColorSpace()}}function _m(n,e,t=()=>performance.now()){let i,r,s,a,o,u=0,l=0,m=1,h="auto",d=!0,g=0,_=0,T=0,f=0,p=!1;const E=t;function w(R){if(!p||m===R)return;m=R;const x=Math.max(1,Math.round(u*m)),c=Math.max(1,Math.round(l*m)),S=n.getParameter(n.ACTIVE_TEXTURE);n.activeTexture(n.TEXTURE0);const y=n.getParameter(n.TEXTURE_BINDING_2D),P=n.getParameter(n.RENDERBUFFER_BINDING);for(const L of[s,o])n.bindTexture(n.TEXTURE_2D,L),n.texImage2D(n.TEXTURE_2D,0,n.RGBA,x,c,0,n.RGBA,n.UNSIGNED_BYTE,null);n.bindRenderbuffer(n.RENDERBUFFER,a),n.renderbufferStorage(n.RENDERBUFFER,n.DEPTH_COMPONENT24,x,c),n.bindRenderbuffer(n.RENDERBUFFER,P),n.bindTexture(n.TEXTURE_2D,y),n.activeTexture(S),i.width=x,i.height=c,e.renderWidth=x,e.renderHeight=c,e.renderScale=m}function A(R){if(!p)return;if(d=!!R,h==="sharp"||!d){w(1);return}const x=E();if(!g){g=x;return}if(x-g<2e3||_<10)return;const c=(x-g)/_;g=x,_=0,c>23&&m>.5?(w(m===1?.75:.5),T=0,f=x+3e4):c<17.5&&m<1&&x>f?++T>=5&&(w(m===.5?.75:1),T=0):T=0}return{configure(R,x,c,S,y,P,L,U){i=R,r=x,s=c,a=S,o=y,u=P,l=L,h=U==="sharp"?"sharp":"auto",p=!0,Object.assign(e,{renderWidth:P,renderHeight:L,renderScale:1,quality:h})},begin:A,end(){_++},quality(R){h=R==="sharp"?"sharp":"auto",e.quality=h,g=0,_=0,T=0},viewport(R,x,c,S,y){if(p&&(R===r||R===null)){const P=i.width/u,L=i.height/l;n.viewport(Math.round(x*P),Math.round(c*L),Math.round(S*P),Math.round(y*L))}else n.viewport(x,c,S,y)},scissor(R,x,c,S,y){if(p&&R===r){const P=i.width/u,L=i.height/l,U=Math.floor(x*P),O=Math.floor(c*L);n.scissor(U,O,Math.ceil((x+S)*P)-U,Math.ceil((c+y)*L)-O)}else n.scissor(x,c,S,y)},readPixels(R,x,c,S,y,P,L){if(!p||m===1){n.readPixels(R,x,c,S,y,P,L);return}const U=i.width,O=i.height,I=new Uint8Array(U*O*4);n.readPixels(0,0,U,O,y,P,I);for(let k=0;k<S;k++)for(let Y=0;Y<c;Y++){const z=(Math.min(O-1,Math.floor((k+x)*O/l))*U+Math.min(U-1,Math.floor((Y+R)*U/u)))*4,ne=(k*c+Y)*4;L[ne]=I[z],L[ne+1]=I[z+1],L[ne+2]=I[z+2],L[ne+3]=I[z+3]}}}}const xm=[0,2,3,3,4,5,6,18,3,0,4,2,2,2,3,5,2,2,2,0,3,2,10,11,7,6,4,4,2,2,3,3,5,2,1,2],kn=34962,vm=35040;function Sm(n,e,t){let i,r,s,a=new Int32Array(65536),o=0,u=null,l=null,m=null;const h=new Map,d=new Map,g=[],_={backend:"Kenjatime WebGL2",submissions:0,commandBytes:0,commandCopies:0,vertexUploads:0,vertexBytes:0,presents:0,memoryViews:0,vertexReallocations:0},T=_m(n,_);function f(){i!==e.buffer&&(i=e.buffer,r=new Int32Array(i),s=new Float32Array(i),_.memoryViews++)}function p(R){let x=h.get(R);return x||(x={id:R,data:new Float32Array(4096),used:0,lastOffset:0,lastCount:0,currentBase:0,epoch:0,gpuCapacity:0,slot:0,base:0},h.set(R,x)),x}function E(R,x){if(R.data.length>=x)return;let c=R.data.length;for(;c<x;)c*=2;const S=new Float32Array(c);S.set(R.data.subarray(0,R.used)),R.data=S}function w(R,x){o++,g.length=0,a.length<x-R&&(a=new Int32Array(x-R));for(let c=R;c<x;){const S=c,y=r[c],P=xm[y];if(y===9||y===19){if(c+3>x)throw Error("Invalid GPU vertex packet");const L=r[c+1],U=r[c+2],O=p(L);if(U<0||U%4||c+3+U>x)throw Error("Invalid GPU vertex packet");O.epoch!==o&&(O.data.copyWithin(0,O.lastOffset,O.lastOffset+O.lastCount),O.used=O.lastCount,O.currentBase=0,O.epoch=o,g.push(O)),E(O,O.used+U),a[S-R]=O.used;for(let I=0;I<U;I++)O.data[O.used+I]=s[c+3+I];O.lastOffset=O.used,O.lastCount=U,O.used+=U,c+=3+U}else{if(!P||c+P>x)throw Error("Invalid GPU opcode "+y);c+=P}}if(g.length){for(const c of g)n.bindBuffer(kn,t[c.id]),c.gpuCapacity!==c.data.length?(c.gpuCapacity=c.data.length,c.slot=0,n.bufferData(kn,c.gpuCapacity*4*3,vm),_.vertexReallocations++):c.slot=(c.slot+1)%3,c.base=c.slot*c.gpuCapacity,c.currentBase=c.base/4,n.bufferSubData(kn,c.base*4,c.data,0,c.used),_.vertexUploads++,_.vertexBytes+=c.used*4;n.bindBuffer(kn,u)}}function A(R,x){f();const c=R>>>2,S=c+x;if(R&3||x<0||S>r.length)throw Error("Invalid GPU command range");w(c,S);let y=c;for(;y<S;){const P=y,L=r[y++];switch(L){case 1:n.useProgram(t[r[y++]]);break;case 2:n.uniform1i(t[r[y++]],r[y++]);break;case 3:n.uniform1f(t[r[y++]],s[y++]);break;case 4:n.uniform2f(t[r[y++]],s[y++],s[y++]);break;case 5:n.uniform3f(t[r[y++]],s[y++],s[y++],s[y++]);break;case 6:n.uniform4f(t[r[y++]],s[y++],s[y++],s[y++],s[y++]);break;case 7:n.uniformMatrix4fv(t[r[y++]],!1,s,y,16),y+=16;break;case 8:n.activeTexture(33984+r[y++]),n.bindTexture(3553,t[r[y++]]);break;case 9:case 19:{const U=r[y++],O=r[y++],I=p(U),k=t[U];I.currentBase=(I.base+a[P-c])/4,u!==k&&(n.bindBuffer(kn,k),u=k),d.set(l,U),y+=O;break}case 10:{const U=r[y++],O=r[y++],I=r[y++],k=d.get(l);n.drawArrays(U,O+(k===void 0?0:p(k).currentBase),I);break}case 11:n.enable(r[y++]);break;case 12:n.disable(r[y++]);break;case 13:n.blendEquation(r[y++]);break;case 14:n.blendFunc(r[y++],r[y++]);break;case 15:T.scissor(m,r[y++],r[y++],r[y++],r[y++]);break;case 16:n.depthMask(r[y++]!==0);break;case 17:n.depthFunc(r[y++]);break;case 18:l=t[r[y++]],n.bindVertexArray(l);break;case 20:n.texParameteri(3553,r[y++],r[y++]);break;case 21:n.activeTexture(33984+r[y++]);break;case 22:n.uniform4fv(t[r[y++]],s,y,8),y+=8;break;case 23:n.uniformMatrix3fv(t[r[y++]],!1,s,y,9),y+=9;break;case 24:n.vertexAttribPointer(r[y++],r[y++],r[y++],r[y++]!==0,r[y++],r[y++]);break;case 25:{const U=r[y++];n.disableVertexAttribArray(U),n.vertexAttrib4f(U,s[y++],s[y++],s[y++],s[y++]);break}case 26:n.drawElements(r[y++],r[y++],5125,r[y++]);break;case 27:n.activeTexture(33984+r[y++]),n.bindTexture(r[y++],t[r[y++]]);break;case 28:n.frontFace(r[y++]);break;case 29:n.enableVertexAttribArray(r[y++]);break;case 30:{const U=r[y++],O=t[r[y++]];n.bindBuffer(U,O),U===kn&&(u=O);break}case 31:{const U=r[y++],O=t[r[y++]];U!==36008&&(m=O),n.bindFramebuffer(U,O);break}case 32:T.viewport(m,r[y++],r[y++],r[y++],r[y++]);break;case 33:n.clear(r[y++]);break;case 34:_.presents++,T.end();break;case 35:T.begin(r[y++]!==0);break;default:throw Error("Invalid GPU opcode "+L)}}_.submissions++,_.commandBytes+=x*4}return A.targets=T.configure,A.quality=T.quality,A.direct=(R,...x)=>R==="readPixels"?T.readPixels(...x):R==="viewport"?T.viewport(m,...x):R==="scissor"?T.scissor(m,...x):(R==="bindFramebuffer"&&x[0]!==36008&&(m=x[1]),R==="bindVertexArray"&&(l=x[0]),R==="bindBuffer"&&x[0]===kn&&(u=x[1]),n[R](...x)),A.stream=(R,x)=>{d.set(R,x),p(x)},A.present=(R,x,c,S,y,P,L,U)=>{n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.clear(n.COLOR_BUFFER_BIT),n.bindFramebuffer(n.READ_FRAMEBUFFER,R),n.blitFramebuffer(0,0,x,c,S,y,S+P,y+L,n.COLOR_BUFFER_BIT,U?n.LINEAR:n.NEAREST),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),_.presents++},A.stats=_,A}function Mm(n,e,t){const i=new gm({canvas:n.canvas,context:n,alpha:!1,antialias:!1});i.debug.onShaderError=(C,B,J,se)=>{throw Error("Three shader compilation failed: "+C.getProgramInfoLog(B)+" "+C.getShaderInfoLog(J)+" "+C.getShaderInfoLog(se))},i.autoClear=!1,i.sortObjects=!1,i.info.autoReset=!1,i.outputColorSpace=Li,i.toneMapping=on,i.resetState();const r=new Qc,s=new Ma,a=[],o=[],u=new Map,l=new WeakMap,m=new WeakMap,h=new Map,d=new Map,g=new WeakMap,_=new Map,T=new Map,f={program:null,vao:null,array:null,draw:null,read:null,unit:n.TEXTURE0,units:new Map,caps:new Set,equation:n.FUNC_ADD,src:n.ONE,dst:n.ZERO,depthWrite:!0,depthFunc:n.LESS,front:n.CCW,viewport:[0,0,n.canvas.width,n.canvas.height],scissor:[0,0,n.canvas.width,n.canvas.height],clear:[0,0,0,0],pixels:new Map,constants:new Map};let p=!1,E=!1,w=0,A,R=0,x=0;const c=C=>{if(!C)return 0;let B=d.get(C);return B||(B={id:++w,bytes:0},d.set(C,B)),B.id},S=new Map([[n.ZERO,qo],[n.ONE,Yo],[n.SRC_COLOR,Ko],[n.ONE_MINUS_SRC_COLOR,Zo],[n.SRC_ALPHA,oa],[n.ONE_MINUS_SRC_ALPHA,la],[n.DST_ALPHA,$o],[n.ONE_MINUS_DST_ALPHA,Jo],[n.DST_COLOR,Qo],[n.ONE_MINUS_DST_COLOR,jo],[n.SRC_ALPHA_SATURATE,el]]),y=new Map([[n.FUNC_ADD,Wn],[n.FUNC_SUBTRACT,Wo],[n.FUNC_REVERSE_SUBTRACT,Xo]]),P=new Map([[n.NEVER,Sr],[n.ALWAYS,Mr],[n.LESS,Er],[n.LEQUAL,ui],[n.EQUAL,Tr],[n.GEQUAL,yr],[n.GREATER,Ar],[n.NOTEQUAL,br]]),L=new Map([[n.FLOAT_VEC2,2],[n.FLOAT_VEC3,3],[n.FLOAT_VEC4,4],[n.INT_VEC2,2],[n.INT_VEC3,3],[n.INT_VEC4,4],[n.BOOL_VEC2,2],[n.BOOL_VEC3,3],[n.BOOL_VEC4,4],[n.FLOAT_MAT2,4],[n.FLOAT_MAT3,9],[n.FLOAT_MAT4,16]]),U=["projectionMatrix","viewMatrix","modelViewMatrix","modelMatrix","normalMatrix","cameraPosition","isOrthographic","toneMappingExposure"],O=C=>U.includes(C)?"kt_native_"+C:C,I=C=>{C=C.replace(/^\s*#version[^\n]*\n/,"");for(const B of U)C=C.replace(new RegExp("\\b"+B+"\\b","g"),O(B));return C};function k(C){if(u.has(C))return u.get(C);const B=n.getAttachedShaders(C),J=B.find(Le=>n.getShaderParameter(Le,n.SHADER_TYPE)===n.VERTEX_SHADER),se=B.find(Le=>n.getShaderParameter(Le,n.SHADER_TYPE)===n.FRAGMENT_SHADER),re={id:++w,vertex:I(m.get(J)||n.getShaderSource(J)),fragment:I(m.get(se)||n.getShaderSource(se)),revision:0,attributes:[],uniforms:new Map};for(let Le=0,ve=n.getProgramParameter(C,n.ACTIVE_ATTRIBUTES);Le<ve;Le++){const Re=n.getActiveAttrib(C,Le);re.attributes.push({name:Re.name,location:n.getAttribLocation(C,Re.name)})}for(let Le=0,ve=n.getProgramParameter(C,n.ACTIVE_UNIFORMS);Le<ve;Le++){const Re=n.getActiveUniform(C,Le);if(!Re)continue;const Ie=Re.name.replace(/\[0\]$/,""),We=n.getUniformLocation(C,Re.name);if(We==null)continue;const Ne=n.getUniform(C,We),Ke=L.get(Re.type)||1,at=Ke*Re.size;let ct=Ne;at>1&&(ct=new Float32Array(at),typeof Ne=="number"||typeof Ne=="boolean"?ct[0]=Number(Ne):Ne&&ct.set(Ne)),re.uniforms.set(Ie,{name:Ie,type:Re.type,components:Ke,size:Re.size,value:ct,sampler:[n.SAMPLER_2D,n.SAMPLER_CUBE,n.SAMPLER_2D_ARRAY,n.SAMPLER_3D,n.SAMPLER_2D_SHADOW].includes(Re.type)})}return u.set(C,re),re}function Y(C){if(h.has(C))return h.get(C);const B={id:++w,attrs:new Map,element:null};if(h.set(C,B),C){n.bindVertexArray(C);for(let J=0,se=n.getParameter(n.MAX_VERTEX_ATTRIBS);J<se;J++)if(n.getVertexAttrib(J,n.VERTEX_ATTRIB_ARRAY_ENABLED)){const re=n.getVertexAttrib(J,n.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);B.attrs.set(J,{buffer:re,size:n.getVertexAttrib(J,n.VERTEX_ATTRIB_ARRAY_SIZE),type:n.getVertexAttrib(J,n.VERTEX_ATTRIB_ARRAY_TYPE),normalized:n.getVertexAttrib(J,n.VERTEX_ATTRIB_ARRAY_NORMALIZED),stride:n.getVertexAttrib(J,n.VERTEX_ATTRIB_ARRAY_STRIDE),offset:n.getVertexAttribOffset(J,n.VERTEX_ATTRIB_ARRAY_POINTER),enabled:!0})}B.element=n.getParameter(n.ELEMENT_ARRAY_BUFFER_BINDING)}return B}function z(C,B){let J=d.get(C);if(!J||!J.bytes){n.bindBuffer(B,C);const se=n.getBufferParameter(B,n.BUFFER_SIZE);c(C),J=d.get(C),J.bytes=se}return J.bytes}function ne(C,B){if(!C)return null;let J=g.get(C);if(!J){if(J=new Sa(C),J.colorSpace="",B===n.SAMPLER_CUBE){const se=new Hr(1);se.depthTexture=new Un(1,1),i.setRenderTargetTextures(se,C,null),J=se.texture,J.colorSpace=""}if(B===n.SAMPLER_2D_ARRAY&&(J.isDataArrayTexture=!0),B===n.SAMPLER_3D){const se=new kt(1,1);se.texture=new yl,se.depthTexture=new Un(1,1),i.setRenderTargetTextures(se,C,null),J=se.texture,J.colorSpace=""}g.set(C,J)}return J}function q(C){if(!C.sampler)return C.value;const B=C.type===n.SAMPLER_CUBE?n.TEXTURE_CUBE_MAP:C.type===n.SAMPLER_2D_ARRAY?n.TEXTURE_2D_ARRAY:C.type===n.SAMPLER_3D?n.TEXTURE_3D:n.TEXTURE_2D,J=se=>{var re;return ne((re=f.units.get(n.TEXTURE0+Number(se)))==null?void 0:re.get(B),C.type)};return ArrayBuffer.isView(C.value)?Array.from(C.value,J):J(C.value)}function te(C,B){var J,se,re;for(const[Le,ve]of C.uniforms){const Re=Le.match(/[^.\[\]]+/g).map(O),Ie=q(ve);let We,Ne;if(Re.length===1)B.uniforms[Re[0]]||(B.uniforms[Re[0]]={value:null}),We=B.uniforms[Re[0]],Ne="value";else{We=((J=B.uniforms)[se=Re[0]]??(J[se]={value:/^\d+$/.test(Re[1])?[]:{}})).value;for(let ct=1;ct<Re.length-1;ct++)We=We[re=Re[ct]]??(We[re]=/^\d+$/.test(Re[ct+1])?[]:{});Ne=Re.at(-1)}const Ke=We[Ne];ArrayBuffer.isView(Ie)&&ArrayBuffer.isView(Ke)&&Ke.length===Ie.length?Ke.set(Ie):ArrayBuffer.isView(Ie)?We[Ne]=new Float32Array(Ie):Array.isArray(Ie)?We[Ne]=Ie.slice():We[Ne]=Ie}}function ie(){let C=_.get(f.draw);return C||(C=new kt(1,1,{depthBuffer:!1,stencilBuffer:!1}),i.setRenderTargetFramebuffer(C,f.draw),_.set(f.draw,C)),C.viewport.set(...f.viewport),C.scissor.set(...f.scissor),C.scissorTest=f.caps.has(n.SCISSOR_TEST),C}function Ae(){a.length&&(i.resetState(),p=!0,i.setRenderTarget(ie()),r.children=a,i.render(r,s),A.stats.threeBatches++,a.length=0)}function Te(){if(Ae(),!!p){i.resetState(),p=!1,n.useProgram(f.program),n.bindVertexArray(f.vao),n.bindBuffer(n.ARRAY_BUFFER,f.array),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,f.draw),n.bindFramebuffer(n.READ_FRAMEBUFFER,f.read),n.activeTexture(f.unit);for(const[C,B]of f.units.get(f.unit)||[])n.bindTexture(C,B);for(const C of[n.BLEND,n.CULL_FACE,n.DEPTH_TEST,n.SCISSOR_TEST,n.POLYGON_OFFSET_FILL,n.STENCIL_TEST])n[f.caps.has(C)?"enable":"disable"](C);n.blendEquation(f.equation),n.blendFunc(f.src,f.dst),n.depthMask(f.depthWrite),n.depthFunc(f.depthFunc),n.frontFace(f.front),n.viewport(...f.viewport),n.scissor(...f.scissor),n.clearColor(...f.clear);for(const[C,B]of f.pixels)n.pixelStorei(C,B)}}function Z(C,B,J,se){const re=new un;for(const Le of C.attributes){const ve=B.attrs.get(Le.location);if(!(ve!=null&&ve.enabled))continue;const Re=ve.type===n.FLOAT||ve.type===n.UNSIGNED_INT||ve.type===n.INT?4:ve.type===n.SHORT||ve.type===n.UNSIGNED_SHORT?2:1,Ie=ve.stride||ve.size*Re,We=new po(ve.buffer,ve.type,Ie/Re,Re,Math.floor(z(ve.buffer,n.ARRAY_BUFFER)/Ie),ve.normalized),Ne=ve.type===n.FLOAT?Float32Array:ve.type===n.UNSIGNED_INT?Uint32Array:ve.type===n.INT?Int32Array:ve.type===n.UNSIGNED_SHORT?Uint16Array:ve.type===n.SHORT?Int16Array:ve.type===n.UNSIGNED_BYTE?Uint8Array:Int8Array;We.array=new Ne(0),re.setAttribute(Le.name,new ga(We,ve.size,ve.offset/Re,ve.normalized))}if(se)re.setIndex(new po(B.element,n.UNSIGNED_INT,1,4,z(B.element,n.ELEMENT_ARRAY_BUFFER)/4));else if(J===n.TRIANGLE_STRIP){const Le=Math.max(...Object.values(re.attributes).map(Re=>Re.count));let ve=T.get(Le);if(!ve){const Re=new Uint32Array(Math.ceil(Le/4)*6);for(let Ie=0,We=0;Ie<Le;Ie+=4)Re[We++]=Ie,Re[We++]=Ie+1,Re[We++]=Ie+2,Re[We++]=Ie+2,Re[We++]=Ie+1,Re[We++]=Ie+3;ve=new vn(Re,1),T.set(Le,ve)}re.setIndex(ve)}return re}function he(C,B,J,se){let re=C.id+":"+J+":"+(se?c(B.element):0);for(const Le of C.attributes){const ve=B.attrs.get(Le.location);re+="|"+Le.name+":"+(ve!=null&&ve.enabled?[c(ve.buffer),z(ve.buffer,n.ARRAY_BUFFER),ve.size,ve.type,ve.stride,ve.offset,ve.normalized].join(","):"c"+(f.constants.get(Le.location)||[0,0,0,1]).join(","))}return re}function ye(C,B,J,se=!1){var ct,F,Ct;const re=k(f.program),Le=Y(f.vao),ve=he(re,Le,C,se),Re=ve+":"+re.revision+":"+R+":"+x,Ie=a.at(-1);if(A.stats.goDraws++,!se&&C===n.TRIANGLE_STRIP&&(Ie==null?void 0:Ie.userData.signature)===Re&&Ie.geometry.drawRange.start+Ie.geometry.drawRange.count===B/4*6){Ie.geometry.drawRange.count+=J/4*6,A.stats.mergedDraws++;return}const We=o[ct=a.length]??(o[ct]=new Map);let Ne=We.get(ve);if(!Ne){const Ye=new Dl({glslVersion:na,vertexShader:re.vertex,fragmentShader:re.fragment,uniforms:{},transparent:!0,forceSinglePass:!0,toneMapped:!1});Ne=C===n.LINES?new uu(Z(re,Le,C,se),Ye):C===n.LINE_STRIP?new va(Z(re,Le,C,se),Ye):C===n.LINE_LOOP?new fu(Z(re,Le,C,se),Ye):C===n.POINTS?new hu(Z(re,Le,C,se),Ye):new Nn(Z(re,Le,C,se),Ye),Ne.frustumCulled=!1,Ne.matrixAutoUpdate=!1,Ne.matrixWorldAutoUpdate=!1,Ne.parent=r,Ne.onBeforeRender=()=>{i.setScissor(...Ne.userData.scissor),i.setScissorTest(Ne.userData.clip),Ne.material.uniformsNeedUpdate=!0},We.set(ve,Ne)}const Ke=Ne.material;Ke.blending=f.caps.has(n.BLEND)?ko:Xn,Ke.blendEquation=y.get(f.equation),Ke.blendSrc=S.get(f.src),Ke.blendDst=S.get(f.dst),Ke.blendEquationAlpha=null,Ke.blendSrcAlpha=null,Ke.blendDstAlpha=null,Ke.premultipliedAlpha=!1,Ke.depthTest=f.caps.has(n.DEPTH_TEST),Ke.depthWrite=f.depthWrite,Ke.depthFunc=P.get(f.depthFunc),Ke.side=f.caps.has(n.CULL_FACE)?Dn:rn,Ne.matrixWorld.elements[0]=f.front===n.CW?-1:1;for(const Ye of re.attributes)(F=Le.attrs.get(Ye.location))!=null&&F.enabled||(Ke.defaultAttributeValues[Ye.name]=f.constants.get(Ye.location)||[0,0,0,1]);te(re,Ke),Ne.userData.signature=Re;const at=(Ct=Ne.userData).scissor??(Ct.scissor=[0,0,0,0]);for(let Ye=0;Ye<4;Ye++)at[Ye]=f.scissor[Ye];Ne.userData.clip=f.caps.has(n.SCISSOR_TEST),Ne.geometry.setDrawRange(C===n.TRIANGLE_STRIP?B/4*6:se?B/4:B,C===n.TRIANGLE_STRIP?J/4*6:J),a.push(Ne),A.stats.threeDraws++}const Pe={createVertexArray(){Te();const C=n.createVertexArray();return h.set(C,{id:++w,attrs:new Map,element:null}),C},shaderSource(C,B){m.set(C,B),Te(),n.shaderSource(C,B)},getUniformLocation(C,B){Te();const J=n.getUniformLocation(C,B);if(J){const se=k(C),re=B.match(/^(\w+)\[(\d+)\]$/),Le=re&&se.uniforms.has(re[1])?re[1]:B;l.set(J,{p:se,key:Le,index:re?Number(re[2]):0})}return J},useProgram(C){f.program=C,E&&(Te(),n.useProgram(C))},bindVertexArray(C){f.vao=C,Y(C),p||n.bindVertexArray(C)},bindBuffer(C,B){C===n.ARRAY_BUFFER?f.array=B:C===n.ELEMENT_ARRAY_BUFFER&&(Y(f.vao).element=B),p||n.bindBuffer(C,B)},bufferData(C,B,...J){Te();const se=C===n.ARRAY_BUFFER?f.array:Y(f.vao).element;c(se),d.get(se).bytes=typeof B=="number"?B:B.byteLength,n.bufferData(C,B,...J)},activeTexture(C){f.unit=C,(E||!p)&&n.activeTexture(C)},bindTexture(C,B){let J=f.units.get(f.unit);J||(J=new Map,f.units.set(f.unit,J)),J.get(C)!==B&&x++,J.set(C,B),E&&(Te(),n.activeTexture(f.unit),n.bindTexture(C,B))},bindFramebuffer(C,B){Te(),C!==n.READ_FRAMEBUFFER&&(f.draw=B),C!==n.DRAW_FRAMEBUFFER&&(f.read=B),n.bindFramebuffer(C,B)},viewport(...C){Ae(),f.viewport=C,Te(),n.viewport(...C)},scissor(...C){C.some((B,J)=>B!==f.scissor[J])&&R++,f.scissor=C,E&&(Te(),n.scissor(...C))},enable(C){f.caps.has(C)||R++,f.caps.add(C),E&&(Te(),n.enable(C))},disable(C){f.caps.has(C)&&R++,f.caps.delete(C),E&&(Te(),n.disable(C))},blendEquation(C){C!==f.equation&&R++,f.equation=C},blendFunc(C,B){(C!==f.src||B!==f.dst)&&R++,f.src=C,f.dst=B},depthMask(C){C!==f.depthWrite&&R++,f.depthWrite=C},depthFunc(C){C!==f.depthFunc&&R++,f.depthFunc=C},frontFace(C){C!==f.front&&R++,f.front=C},clearColor(...C){f.clear=C,Te(),n.clearColor(...C)},clear(C){Te(),n.depthMask(f.depthWrite),n[f.caps.has(n.SCISSOR_TEST)?"enable":"disable"](n.SCISSOR_TEST),n.scissor(...f.scissor),n.clear(C)},pixelStorei(C,B){f.pixels.set(C,B),Te(),n.pixelStorei(C,B)},vertexAttribPointer(C,B,J,se,re,Le){const ve=Y(f.vao),Re=ve.attrs.get(C);ve.attrs.set(C,{buffer:f.array,size:B,type:J,normalized:se,stride:re,offset:Le,enabled:(Re==null?void 0:Re.enabled)??!1}),E&&(Te(),n.vertexAttribPointer(C,B,J,se,re,Le))},enableVertexAttribArray(C){const B=Y(f.vao),J=B.attrs.get(C)||{};J.enabled=!0,B.attrs.set(C,J),E&&(Te(),n.enableVertexAttribArray(C))},disableVertexAttribArray(C){const B=Y(f.vao).attrs.get(C);B&&(B.enabled=!1)},vertexAttrib4f(C,...B){f.constants.set(C,B)},drawArrays(C,B,J){ye(C,B,J)},drawElements(C,B,J,se){if(J!==n.UNSIGNED_INT)throw Error("Unsupported index format");ye(C,se,B,!0)},getParameter(C){var B;return C===n.ACTIVE_TEXTURE?f.unit:C===n.TEXTURE_BINDING_2D?((B=f.units.get(f.unit))==null?void 0:B.get(n.TEXTURE_2D))||null:C===n.VERTEX_ARRAY_BINDING?f.vao:C===n.ARRAY_BUFFER_BINDING?f.array:C===n.READ_FRAMEBUFFER_BINDING?f.read:n.getParameter(C)}};for(const C of["uniform1i","uniform1f","uniform2f","uniform3f","uniform4f","uniform1fv","uniform2fv","uniform3fv","uniform4fv","uniform1iv","uniform2iv","uniform3iv","uniform4iv","uniformMatrix2fv","uniformMatrix4fv","uniformMatrix3fv"])Pe[C]=(B,...J)=>{if(!B)return;const se=l.get(B);if(!se)throw Error("Three uniform metadata missing");let re=se.p.uniforms.get(se.key);if(re||(re={name:se.key,type:0,sampler:!1,value:0},se.p.uniforms.set(se.key,re)),C==="uniform1i"||C==="uniform1f"){if(ArrayBuffer.isView(re.value)){const at=se.index*(re.components||1);re.value[at]!==J[0]&&se.p.revision++,re.value[at]=J[0]}else re.value!==J[0]&&se.p.revision++,re.value=J[0];return}const Le=C.includes("Matrix"),ve=/v$/.test(C),Re=Le?J[1]:ve?J[0]:J,Ie=(Le?J[2]:ve?J[1]:0)||0,We=(Le?J[3]:ve?J[2]:void 0)??Re.length,Ne=se.index*(re.components||1),Ke=Math.max(We+Ne,(re.components||1)*(re.size||1));(!ArrayBuffer.isView(re.value)||re.value.length<Ke)&&(re.value=new Float32Array(Ke));for(let at=0;at<We;at++)re.value[Ne+at]!==Re[Ie+at]&&se.p.revision++,re.value[Ne+at]=Re[Ie+at]};for(const C of["texImage2D","texImage3D","texSubImage2D","texSubImage3D","texStorage2D","texStorage3D","texParameteri","generateMipmap","copyTexSubImage2D"])Pe[C]=(...B)=>{Te(),n.activeTexture(f.unit);for(const[J,se]of f.units.get(f.unit)||[])n.bindTexture(J,se);return n[C](...B)};const _e=new Proxy(n,{get(C,B){if(Pe[B])return Pe[B];const J=C[B];return typeof J!="function"?J:(...se)=>(Te(),J.apply(C,se))}});A=Sm(_e,e,t),Object.assign(A.stats,{backend:"Three.js r"+Br,threeDraws:0,threeBatches:0,goDraws:0,mergedDraws:0});const Oe=(C,B)=>{A(C,B),Ae()};for(const C of["stream","targets","quality","present"])Oe[C]=(...B)=>A[C](...B);return Oe.direct=(C,...B)=>{Te(),E=!0;try{return A.direct(C,...B)}finally{E=!1}},Oe.stats=A.stats,Oe.context=new Proxy(n,{get(C,B){const J=C[B];return typeof J=="function"?((...se)=>Oe.direct(B,...se)):J}}),Oe}function Em(n){let e=!1,t,i,r=!1;globalThis.__kenjatimeCreateGPU=(...o)=>{const u=Mm(...o);return globalThis.__kenjatimeGPUControl=u,u},globalThis.alert=o=>n({type:"error",message:String(o).replace(/^I\.K\.E\.M\.E\.N Error\s*/,"")}),globalThis.__kenjatimePublish=o=>{e||o.matchTime<=0||(!r&&o.players.length===2&&(r=!0,n({type:"ready"})),n({type:"state",state:o,gpu:globalThis.__kenjatimeGPU?{...globalThis.__kenjatimeGPU}:null}))},globalThis.__kenjatimeAudioInit=o=>n({type:"audio-init",sampleRate:o}),globalThis.__kenjatimeWriteAudio=(o,u)=>{if(!i||e)return;new Float32Array(i).set(new Float32Array(globalThis.__kenjatimeWasmMemory.buffer,o,u)),t.postMessage({buffer:i},[i]),i=null};function s(o){var u,l,m;e||(o.type==="quality"&&((u=globalThis.__kenjatimeCreateGPUControl)==null||u.call(globalThis,o.value)),o.type==="key"&&((l=globalThis.kenjatimeEngineKey)==null||l.call(globalThis,o.code,o.down,o.mods||0,o.text||"")),o.type==="pause"&&((m=globalThis.kenjatimeEnginePause)==null||m.call(globalThis,o.value)),o.type==="pads"&&(globalThis.__kenjatimeGamepads=o.pads.map(h=>h&&{...h,vibrationActuator:h.rumble?{playEffect:(d,g)=>(n({type:"rumble",index:h.index,kind:d,options:g}),Promise.resolve())}:null})),o.type==="audio-port"&&(t=o.port,t.onmessage=h=>{var d;e||(i=h.data.buffer,(d=globalThis.kenjatimeAudioPull)==null||d.call(globalThis))},t.start()))}async function a({files:o,args:u,canvas:l,urls:m,quality:h}){l.addEventListener("webglcontextlost",E=>{E.preventDefault(),e||n({type:"error",message:"The graphics device reset. Start the match again."})},{once:!0}),globalThis.__kenjatimeCanvas=l,globalThis.__kenjatimeQuality=h,globalThis.__kenjatimeCreateGPUControl=E=>{var w;globalThis.__kenjatimeQuality=E,(w=globalThis.__kenjatimeGPUControl)==null||w.quality(E)},o["save/config.ini"]=o["data/kenjatime/config.ini"].slice(),o["save/kenjatime-match.json"]=new TextEncoder().encode(JSON.stringify(Object.fromEntries(Array.from({length:u.length/2},(E,w)=>[u[w*2],u[w*2+1]]))));const d=Zl(o,{onOutput:E=>{console.log(E),/panic:|Error executing|LUA OPEN FAILED/i.test(E)&&n({type:"error",message:E})}});globalThis.fs=d.fs,globalThis.process=d.process,await import(m.runtime),n({type:"progress",message:"Loading the game engine…"});const g=await fetch(m.wasm);if(!g.ok)throw Error("The game engine could not load.");const _=new Uint8Array(await g.arrayBuffer()),T=_[0]===31&&_[1]===139?typeof DecompressionStream=="function"?await new Response(new Blob([_]).stream().pipeThrough(new DecompressionStream("gzip"))).arrayBuffer():uc(_):_;if(e)return;const f=new globalThis.Go;f.argv=["kenjatime"],f.env={GOGC:"200"},f.exit=E=>{e||(e=!0,n(E?{type:"error",message:"The game engine stopped."}:{type:"end"}))};const{instance:p}=await WebAssembly.instantiate(T,f.importObject);globalThis.__kenjatimeWasmMemory=p.exports.mem,n({type:"progress",message:"Preparing fighters and stage…"}),f.run(p).then(()=>{e||n({type:"end"})}).catch(E=>{e||n({type:"error",message:E.message})})}return{start:a,control:s,stop(){e=!0,t==null||t.close()}}}let yi;self.onmessage=async({data:n})=>{var e;try{if(n.type==="probe"){let t=!1;if(typeof OffscreenCanvas=="function"&&typeof requestAnimationFrame=="function"){const i=new OffscreenCanvas(1,1),r=i.getContext("webgl2",{antialias:!1});t=!!r,(e=r==null?void 0:r.getExtension("WEBGL_lose_context"))==null||e.loseContext()}self.postMessage({type:"capabilities",supported:t});return}if(n.type==="start"){yi=Em(t=>self.postMessage(t)),await yi.start(n);return}yi==null||yi.control(n)}catch(t){self.postMessage({type:"error",message:t.message})}};
