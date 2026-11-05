import { unzipSync, unzlibSync } from 'fflate';
import {MAX_ZIP_BYTES,MAX_EXPANDED_BYTES,MAX_ARCHIVE_FILES,ZIP_LIMIT_MB} from './archive-limits.js';

/** MUGEN packages commonly mix legacy ANSI files with BOM-marked UTF-8. */
export function decodeText(bytes) {
 if (!(bytes instanceof Uint8Array)) throw Error('Text file is missing');
 if (bytes[0] === 0xff && bytes[1] === 0xfe) return new TextDecoder('utf-16le').decode(bytes);
 if (bytes[0] === 0xfe && bytes[1] === 0xff) return new TextDecoder('utf-16be').decode(bytes);
 try { return new TextDecoder('utf-8', {fatal: true}).decode(bytes); }
 catch { return new TextDecoder('windows-1252').decode(bytes); }
}

export function packagePath(name, base = '', allowParent = false) {
 const path = String(name).normalize('NFC').replaceAll('\\', '/');
 if (path.startsWith('/') || /^[a-z]:/i.test(path) || path.includes('\0')) throw Error('Unsafe archive path.');
 const parts = base.split('/').filter(Boolean);
 for (const part of path.split('/')) {
  if (!part || part === '.') continue;
  if (part === '..') {
   if (!allowParent || !parts.length) throw Error('Unsafe archive path.');
   parts.pop();
  } else parts.push(part);
 }
 return parts.join('/').toLowerCase();
}
export function ini(text) {
 const result={}; let section='';
 for(const raw of text.replace(/^\uFEFF/,'').split(/\r?\n/)){const line=raw.replace(/;(?=(?:[^"']*["'][^"']*["'])*[^"']*$).*$/,'').trim(); const s=line.match(/^\[(.+)\]$/); if(s){section=s[1].toLowerCase();result[section]??={};continue;} const eq=line.indexOf('=');if(eq>0&&section)result[section][line.slice(0,eq).trim().toLowerCase()]=line.slice(eq+1).trim().replace(/^"(.*)"$/,'$1');}return result;
}
export function packageFiles(bytes){
 if(bytes.length>MAX_ZIP_BYTES)throw Error(`ZIP exceeds the ${ZIP_LIMIT_MB} MB limit.`);
 let total=0,count=0;
 const files=unzipSync(bytes,{filter:f=>{total+=f.originalSize;count++;if(total>MAX_EXPANDED_BYTES||count>MAX_ARCHIVE_FILES)throw Error('Archive exceeds 512 MB expanded or 5,000 files.');return true;}});
 const normalized=Object.create(null);for(const [name,data] of Object.entries(files)){
  // ZIP paths are a virtual namespace, never phone or server filesystem paths.
  const entry=name.replaceAll('\\','/');if(entry.endsWith('/'))continue;
  let path;try{path=packagePath(entry.replace(/^\/+/,''),'',true);}catch{throw Error(`Unsafe archive path: ${name}. A file points outside the ZIP's folders.`);}
  if(!path||path.split('/').some(part=>part==='__macosx'||part==='.ds_store'||part.startsWith('._')))continue;
  if(Object.hasOwn(normalized,path)){
   if(normalized[path].length===data.length&&normalized[path].every((value,index)=>value===data[index]))continue;
   throw Error('Duplicate archive path with different contents: '+path);
  }
  normalized[path]=data;
 }
 return normalized;
}
export function charactersFromFiles(normalized){
 const text=p=>decodeText(normalized[p]);
 const characters=Object.keys(normalized).filter(p=>p.endsWith('.def')).map(path=>({path,def:ini(text(path))})).filter(c=>c.def.info&&c.def.files?.sprite).map(c=>{
 const base=c.path.slice(0,c.path.lastIndexOf('/')+1);const resolve=v=>packagePath(v,base,true);
 const reference=(key,value)=>{
  let local;try{local=resolve(value);}catch{local=null;}
  // Relocated Windows/engine-folder references may still name an adjacent ZIP asset.
  const filename=String(value).replaceAll('\\','/').split('/').at(-1);
  if(!local&&filename&&filename!=='.'&&filename!=='..'){try{const adjacent=resolve(filename);if(normalized[adjacent])local=adjacent;}catch{/* Keep an unavailable reference as a package-check failure. */}}
  if(key!=='stcommon'||normalized[local])return local;
  // In an engine distribution, shared states live in data/ beside chars/.
  // A standalone character archive can also supply data/ at its own root.
  const marker=c.path.indexOf('/chars/'),engineRoot=marker>=0?c.path.slice(0,marker+1):'';
  const candidates=[engineRoot+'data/',engineRoot].flatMap(root=>{try{return [packagePath(value,root,true)];}catch{return [];}});
  if(filename?.toLowerCase()==='common1.cns')candidates.push(engineRoot+'data/common1.cns','data/common1.cns');
  return candidates.find(path=>normalized[path])||local;
 };
 const checks=Object.entries(c.def.files).filter(([k,v])=>v&&/^(sprite|anim|cmd|cns|sound|stcommon|st\d*|pal\d+)$/.test(k)).map(([key,value])=>{const path=reference(key,value);return {key,value,path,ok:!!path&&!!normalized[path],...(!path?{message:'This resource is outside the ZIP. Include it in the package or use an in-package relative path.'}:{})};});
 const air=checks.find(c=>c.key==='anim'&&c.ok);return {...c,checks,files:normalized,animations:air?animations(text(air.path)):[],sprite:checks.find(c=>c.key==='sprite'&&c.ok),palettes:checks.filter(c=>/^pal\d+$/.test(c.key)).map(c=>({...c,number:Number(c.key.slice(3))}))};
 });return characters;
}
export function archive(bytes){const characters=charactersFromFiles(packageFiles(bytes));if(!characters.length)throw Error('No character DEF found. Include a [Info] and [Files] section with a sprite reference.');return characters;}
export function animations(text) {
 const list=[];
 let current, defaults, pending, definition;
 for (const [lineIndex,raw] of text.replace(/^\uFEFF/,'').split(/\r?\n/).entries()) {
  const line=raw.split(';')[0].trim();
  const action=line.match(/^\[begin action\s+(-?\d+)\]\s*$/i);
  if (action) {
   current={id:+action[1],frames:[],loopStart:0};list.push(current);
   defaults={1:[],2:[]};pending={};definition={};continue;
  }
  if (!current || !line) continue;
  if (/^loopstart\s*$/i.test(line)) {current.loopStart=current.frames.length;continue;}
  const header=line.match(/^clsn([12])(default)?\s*:\s*(\d+)\s*$/i);
  if (header) {
   const kind=+header[1],count=+header[3];
   if (count>1024) throw Error(`AIR collision box limit exceeded on line ${lineIndex+1}`);
   const boxes=new Array(count);
   definition[kind]=boxes;
   if (header[2]) {defaults[kind]=boxes;delete pending[kind];} else pending[kind]=boxes;
   continue;
  }
  const box=line.match(/^clsn([12])\s*\[\s*(\d+)\s*\]\s*=\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*$/i);
  if (box) {
   const boxes=definition[+box[1]],index=+box[2];
   if (!boxes || index>=boxes.length) {
    (current.diagnostics??=[]).push({line:lineIndex+1,message:'AIR collision box index out of range; box ignored'});continue;
   }
   boxes[index]=box.slice(3).map(Number);continue;
  }
  const interpolation=line.match(/^interpolate\s+(offset|blend|scale|angle)\s*$/i);
  if (interpolation) {
   // Interpolation lines refer to the transition into the following element.
   const key=interpolation[1].toLowerCase();
   if (current.frames.length) (current.frames.at(-1).interpolate??=[]).push(key);
   else (current.loopInterpolate??=[]).push(key);
   continue;
  }
  if (!/^-?\d+\s*,/.test(line)) continue;
  const a=line.split(',').map(x=>x.trim());
  const numbers=a.slice(0,5).map(Number);
  if(a.length<5||numbers.some(x=>!Number.isFinite(x))||numbers[4]<-1) throw Error(`Invalid AIR frame on line ${lineIndex+1}`);
  const boxes=kind=>{
   const source=pending[kind]??defaults[kind];
   if (Object.keys(source).length!==source.length) (current.diagnostics??=[]).push({line:lineIndex+1,message:`Incomplete Clsn${kind} definition; missing boxes ignored`});
   return source.filter(Boolean).map(b=>b.slice());
  };
  const optional=(index,fallback)=>a[index]?Number(a[index]):fallback;
  const scaleX=optional(7,1),scaleY=optional(8,1),angle=optional(9,0);
  if (![scaleX,scaleY,angle].every(Number.isFinite)) throw Error(`Invalid AIR transform on line ${lineIndex+1}`);
  current.frames.push({group:numbers[0],number:numbers[1],x:numbers[2],y:numbers[3],ticks:numbers[4],flip:(a[5]||'').toUpperCase(),blend:(a[6]||'').toUpperCase(),scaleX,scaleY,angle,clsn1:boxes(1),clsn2:boxes(2)});
  pending={};
 }
 return list.filter(a=>a.frames.length).map(a=>{
  if(a.loopStart>=a.frames.length)a.loopStart=0;
  if(a.loopInterpolate)a.frames.at(-1).interpolate=[...new Set([...(a.frames.at(-1).interpolate||[]),...a.loopInterpolate])];
  delete a.loopInterpolate;return a;
 });
}

/** Parse SND's linked sample table. WAV decoding remains the audio subsystem's job. */
export function soundArchive(bytes) {
 if (!(bytes instanceof Uint8Array) || bytes.length<24 || new TextDecoder().decode(bytes.subarray(0,12))!=='ElecbyteSnd\0') throw Error('Invalid SND signature');
 const v=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
 const count=v.getUint32(16,true),samples=[],lookup=new Map(),visited=new Set();
 if(count>10000)throw Error('SND sample table too large');
 let offset=v.getUint32(20,true);
 for(let i=0;i<count;i++) {
  if(offset<24||offset+16>bytes.length||visited.has(offset))throw Error('Invalid SND sample link');
  visited.add(offset);
  const next=v.getUint32(offset,true),size=v.getUint32(offset+4,true),group=v.getUint32(offset+8,true),number=v.getUint32(offset+12,true),start=offset+16;
  if(size<12||size>32*1024*1024||start+size>bytes.length)throw Error('Invalid SND sample length');
  const data=bytes.subarray(start,start+size);
  if(new TextDecoder().decode(data.subarray(0,4))!=='RIFF'||new TextDecoder().decode(data.subarray(8,12))!=='WAVE')throw Error('Unsupported SND sample: expected WAV');
  if(new DataView(data.buffer,data.byteOffset,data.byteLength).getUint32(4,true)+8>size)throw Error('Truncated SND WAV');
  const sample={group,number,data};samples.push(sample);
  if(!lookup.has(`${group},${number}`))lookup.set(`${group},${number}`,data);
  offset=next;
 }
 return {samples,get:(group,number)=>lookup.get(`${group},${number}`)};
}

/** SFF 2.1's PNG payloads use non-interlaced PNG8, PNG24, or PNG32 images. */
export function decodePng(bytes, expectedWidth, expectedHeight, indexedPalette) {
 const signature=[137,80,78,71,13,10,26,10];
 if(bytes.length<33||!signature.every((b,i)=>bytes[i]===b))throw Error('Invalid PNG signature');
 const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
 let width,height,channels,colorType,palette,alpha,offset=8,ended=false,idatSize=0;
 const idat=[];
 while(offset+12<=bytes.length) {
  const size=view.getUint32(offset),start=offset+8,end=start+size;
  if(size>64*1024*1024||end+4>bytes.length)throw Error('Invalid PNG chunk length');
  const type=String.fromCharCode(...bytes.subarray(offset+4,offset+8));
  if(type==='IHDR') {
   if(offset!==8||size!==13||width!==undefined)throw Error('Invalid PNG header');
   width=view.getUint32(start);height=view.getUint32(start+4);colorType=bytes[start+9];
   channels=({0:1,2:3,3:1,4:2,6:4})[colorType];
   if(!width||!height||width*height>4e6||(expectedWidth!==undefined&&width!==expectedWidth)||(expectedHeight!==undefined&&height!==expectedHeight))throw Error('Invalid PNG dimensions');
   if(bytes[start+8]!==8||!channels||bytes[start+10]||bytes[start+11]||bytes[start+12])throw Error('Unsupported PNG encoding: requires non-interlaced 8-bit channels');
  } else if(width===undefined)throw Error('PNG header must be first');
  else if(type==='PLTE') {
   if(!size||size>768||size%3)throw Error('Invalid PNG palette');
   palette=bytes.subarray(start,end);
  } else if(type==='tRNS')alpha=bytes.subarray(start,end);
  else if(type==='IDAT') {
   idatSize+=size;if(idatSize>64*1024*1024)throw Error('PNG compressed data too large');
   idat.push(bytes.subarray(start,end));
  } else if(type==='IEND') {if(size)throw Error('Invalid PNG end chunk');ended=true;break;}
  else if(type[0]===type[0].toUpperCase())throw Error('Unsupported PNG critical chunk: '+type);
  offset=end+4;
 }
 if(!ended||!idat.length)throw Error('Truncated PNG');
 if(colorType===3&&!indexedPalette&&!palette)throw Error('PNG palette missing');
 const compressed=new Uint8Array(idatSize);let cursor=0;
 for(const part of idat){compressed.set(part,cursor);cursor+=part.length;}
 const stride=width*channels,expected=(stride+1)*height;
 const filtered=unzlibSync(compressed,{out:new Uint8Array(expected+1)});
 if(filtered.length!==expected)throw Error('Invalid PNG pixel data length');
 const pixels=new Uint8Array(stride*height);
 const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
 for(let y=0;y<height;y++) {
  const mode=filtered[y*(stride+1)];if(mode>4)throw Error('Invalid PNG scanline filter');
  for(let x=0;x<stride;x++) {
   const i=y*stride+x,left=x>=channels?pixels[i-channels]:0,up=y?pixels[i-stride]:0,corner=y&&x>=channels?pixels[i-stride-channels]:0;
   const prediction=mode===0?0:mode===1?left:mode===2?up:mode===3?Math.floor((left+up)/2):paeth(left,up,corner);
   pixels[i]=(filtered[y*(stride+1)+1+x]+prediction)&255;
  }
 }
 const rgba=new Uint8ClampedArray(width*height*4);
 for(let i=0;i<width*height;i++) {
  const source=i*channels,target=i*4;
  if(colorType===3) {
   const index=pixels[source],p=index*(indexedPalette?4:3),colors=indexedPalette||palette;
   if(p+2>=colors.length)throw Error('PNG palette index out of range');
   rgba.set([colors[p],colors[p+1],colors[p+2],indexedPalette?colors[p+3]:(alpha?.[index]??255)],target);
  } else if(colorType===0||colorType===4) {
   const gray=pixels[source];let a=colorType===4?pixels[source+1]:255;
   if(colorType===0&&alpha?.length===2&&gray===((alpha[0]<<8)|alpha[1]))a=0;
   rgba.set([gray,gray,gray,a],target);
  } else {
   const r=pixels[source],g=pixels[source+1],b=pixels[source+2];let a=colorType===6?pixels[source+3]:255;
   if(colorType===2&&alpha?.length===6&&r===((alpha[0]<<8)|alpha[1])&&g===((alpha[2]<<8)|alpha[3])&&b===((alpha[4]<<8)|alpha[5]))a=0;
   rgba.set([r,g,b,a],target);
  }
 }
 return {w:width,h:height,rgba,...(colorType===3?{indices:pixels}: {})};
}
export function decodePixels(data,size,format){const out=new Uint8Array(size);let i=0,j=0,rb=0,rbc=0;const read=()=>{if(i>=data.length)throw Error('Truncated sprite data');return data[i++];};const run=(n,c)=>{if(n<1||j+n>size)throw Error('Invalid sprite run');out.fill(c,j,j+n);j+=n;};if(format===0){if(data.length<size)throw Error('Truncated raw sprite');return data.slice(0,size);}if(format===2){while(j<size){let d=read();if((d&192)===64){let n=d&63;run(n,read());}else run(1,d);}return out;}if(format===3){while(j<size){let n=read()+1,d=read(),pack=d&127,c=d&128?read():0;run(n,c);while(pack--){let v=read();run((v>>5)+1,v&31);}}return out;}if(format!==4)throw Error('Unsupported sprite compression '+format);while(j<size){let control=read();for(let bit=0;bit<8&&j<size;bit++){let d=read();if(control&(1<<bit)){let n,offset;if((d&63)===0){offset=((d<<2)|read())+1;n=read()+3;}else{rb|=(d&192)>>rbc;rbc+=2;n=(d&63)+1;if(rbc<8)offset=read()+1;else{offset=rb+1;rb=0;rbc=0;}}if(offset>j||j+n>size)throw Error('Invalid sprite backreference');while(n--){out[j]=out[j-offset];j++;}}else{let n;if(!(d&224))n=read()+8;else{n=d>>5;d&=31;}run(n,d);}}}return out;}
export function sff(bytes,options={}) {
 if (!(bytes instanceof Uint8Array) || bytes.length<32 || new TextDecoder().decode(bytes.subarray(0,12))!=='ElecbyteSpr\0') throw Error('Invalid SFF signature');
 if(bytes[15]===1)return sffV1(bytes,options);
 if(bytes[15]!==2)throw Error('Unsupported SFF version');
 if(bytes.length<68)throw Error('Truncated SFF header');
 const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
 const u=p=>view.getUint32(p,true),signed=p=>view.getInt16(p,true),h=p=>view.getUint16(p,true);
 const offset=u(36),count=u(40),paloff=u(44),palcount=u(48),ldata=u(52),tdata=u(60);
 if(count>20000||palcount>4096)throw Error('SFF table too large');
 if(offset+count*28>bytes.length||paloff+palcount*16>bytes.length)throw Error('Truncated SFF table');
 const sprites=[],cache=new Map(),paletteCache=new Map();
 const palettes=Array.from({length:palcount},(_,index)=>({index,group:h(paloff+index*16),number:h(paloff+index*16+2),colors:h(paloff+index*16+4)}));
 for(let i=0;i<count;i++) {
  const p=offset+i*28;
  sprites.push({group:h(p),number:h(p+2),w:h(p+4),h:h(p+6),x:signed(p+8),y:signed(p+10),link:h(p+12),format:bytes[p+14],depth:bytes[p+15],offset:u(p+16),length:u(p+20),palette:h(p+24),flags:h(p+26)});
 }
 function palette(index,seen=new Set()) {
  if(paletteCache.has(index))return paletteCache.get(index);
  if(index>=palcount||seen.has(index))throw Error('Invalid palette link');
  seen.add(index);const p=paloff+index*16,length=u(p+12);
  if(!length)return palette(h(p+6),seen);
  const start=ldata+u(p+8);
  if(length%4||start+length>bytes.length)throw Error('Invalid SFF palette length');
  const result=bytes.slice(start,start+length);if(!bytes[13]&&!bytes[14])for(let c=0;c<result.length/4;c++)result[c*4+3]=c?255:0;
  paletteCache.set(index,result);return result;
 }
 function decode(index,seen=new Set()) {
  if(cache.has(index))return cache.get(index);
  if(!Number.isInteger(index)||index<0||index>=sprites.length||seen.has(index))throw Error('Invalid sprite link');
  seen.add(index);const sp=sprites[index];
  if(!sp.length) {
   const linked=decode(sp.link,seen),result={...linked,...sp,w:linked.w,h:linked.h,rgba:linked.rgba};
   if(linked.indices&&sp.palette!==linked.palette){const colors=palette(sp.palette),rgba=new Uint8ClampedArray(linked.rgba.length);for(let i=0;i<linked.indices.length;i++){const c=linked.indices[i],p=c*4;if(p+2>=colors.length)throw Error('Linked sprite palette index out of range');rgba.set(colors.subarray(p,p+4),i*4);}result.rgba=rgba;}
   cache.set(index,result);return result;
  }
  if(!sp.w||!sp.h||sp.w*sp.h>4e6)throw Error('Invalid SFF sprite dimensions');
  const start=(sp.flags&1?tdata:ldata)+sp.offset;
  if(start+sp.length>bytes.length||sp.length<(sp.format?4:0))throw Error('Truncated SFF sprite data');
  const raw=bytes.subarray(start+(sp.format?4:0),start+sp.length);
  let result;
  if(sp.format>=10&&sp.format<=12)result={...sp,...decodePng(raw,sp.w,sp.h,sp.format===10&&palcount?palette(sp.palette):undefined)};
  else {
   if(sp.depth!==8&&sp.depth!==5)throw Error('Unsupported non-indexed SFF compression: '+sp.format);
   const pixels=decodePixels(raw,sp.w*sp.h,sp.format),pal=palette(sp.palette),rgba=new Uint8ClampedArray(pixels.length*4);
   for(let i=0;i<pixels.length;i++) {
    const c=pixels[i];if(c*4+2>=pal.length)throw Error('SFF palette index out of range');
    rgba.set(pal.subarray(c*4,c*4+4),i*4);
   }
   result={...sp,rgba,indices:pixels};
  }
  cache.set(index,result);return result;
 }
 function decodeWithPalette(index,group,number){
  const original=decode(index);if(!original.indices)return original;
  const target=palettes.find(p=>p.group===group&&p.number===number);if(!target)throw Error(`Palette ${group},${number} does not exist`);
  const source=palettes[original.palette];if(source&&Math.ceil(Math.log2(source.colors))!==Math.ceil(Math.log2(target.colors)))return original;
  const colors=palette(target.index),rgba=new Uint8ClampedArray(original.rgba.length);
  for(let i=0;i<original.indices.length;i++){const c=original.indices[i],p=c*4;if(p+2>=colors.length)throw Error('Palette depth does not match indexed sprite');rgba.set(colors.subarray(p,p+4),i*4);}
  return{...original,rgba};
 }
 return {sprites,decode,decodeWithPalette,palettes,version:2};
}

function sffV1(bytes,{externalPalettes=new Map()}={}){
 const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),u=p=>view.getUint32(p,true),h=p=>view.getUint16(p,true),signed=p=>view.getInt16(p,true);
 const sprites=[],palettes=[],colors=[],visited=new Set(),count=u(20);let offset=u(24),previous=-1,base=-1;
 if(count>20000)throw Error('SFF table too large');
 const addPalette=rgb=>{const rgba=new Uint8Array(1024);for(let i=0;i<256;i++)rgba.set([rgb[i*3],rgb[i*3+1],rgb[i*3+2],i?255:0],i*4);colors.push(rgba);return colors.length-1;};
 for(let i=0;i<count;i++){
  if(offset<32||offset+32>bytes.length||visited.has(offset))throw Error('Invalid SFF v1 sprite table link');visited.add(offset);
  const length=u(offset+4),sp={group:h(offset+12),number:h(offset+14),x:signed(offset+8),y:signed(offset+10),link:h(offset+16),offset:offset+32,length,shared:bytes[offset+18],palette:previous};
  if(sp.offset+length>bytes.length)throw Error('Truncated SFF v1 sprite');
  if(length){
   const embedded=length>=897&&bytes[sp.offset+length-769]===12;
   if((!sp.shared||previous<0)&&embedded)sp.palette=addPalette(bytes.subarray(sp.offset+length-768,sp.offset+length));
   if(sp.palette<0&&externalPalettes.has(1)){colors.push(externalPalettes.get(1));sp.palette=colors.length-1;}
   if(sp.palette>=0&&base<0)base=sp.palette;
   if(sp.group===0&&sp.number===0&&sp.palette>=0)base=sp.palette;
   previous=sp.palette;
  }else sp.palette=undefined;
  sprites.push(sp);offset=u(offset);
  if(!offset&&i+1<count)throw Error('Truncated SFF v1 sprite table');
 }
 // Independent PCX entries with the character's base colors also participate in palette selection.
 const originalBase=colors[base];if(originalBase)for(const sp of sprites)if(sp.palette>=0&&colors[sp.palette]?.every((c,i)=>c===originalBase[i]))sp.palette=base;
 for(let i=0;i<colors.length;i++)palettes.push({index:i,group:i===base?1:0,number:i===base?1:i+1,colors:256});
 for(const [number,rgba]of externalPalettes){
  if(!(rgba instanceof Uint8Array)||rgba.length!==1024||!Number.isInteger(number)||number<1||number>256)throw Error('Invalid external SFF palette');
  if(number===1&&base>=0)colors[base]=rgba;
  else{const index=colors.length;colors.push(rgba);palettes.push({index,group:1,number,colors:256});}
 }
 const cache=new Map();
 function recolor(original,rgba){const out=new Uint8ClampedArray(original.indices.length*4);for(let i=0;i<original.indices.length;i++)out.set(rgba.subarray(original.indices[i]*4,original.indices[i]*4+4),i*4);return{...original,rgba:out};}
 function decode(index,seen=new Set()){
  if(cache.has(index))return cache.get(index);
  if(!Number.isInteger(index)||index<0||index>=sprites.length||seen.has(index))throw Error('Invalid SFF v1 sprite link');seen.add(index);const sp=sprites[index];
  if(!sp.length){const source=decode(sp.link,seen);sp.palette=source.palette;const linked={...source,...sp,w:source.w,h:source.h};cache.set(index,linked);return linked;}
  const data=bytes.subarray(sp.offset,sp.offset+sp.length);if(data.length<128||data[0]!==10||data[2]!==1||data[3]!==8||data[65]!==1)throw Error('Only indexed 8-bit PCX sprites are supported');
  const d=new DataView(data.buffer,data.byteOffset,data.byteLength),w=d.getUint16(8,true)-d.getUint16(4,true)+1,height=d.getUint16(10,true)-d.getUint16(6,true)+1,stride=d.getUint16(66,true);
  if(w<=0||height<=0||w*height>4e6||stride*height>8e6||stride<w)throw Error('Invalid PCX dimensions');
  const palette=colors[sp.palette];if(!palette)throw Error('PCX palette missing');
  const end=data.length>=897&&data[data.length-769]===12?data.length-769:data.length,pixels=new Uint8Array(stride*height);let pos=128,cursor=0;
  while(cursor<pixels.length){if(pos>=end)throw Error('Truncated PCX');let value=data[pos++],run=1;if((value&192)===192){run=value&63;if(pos>=end)throw Error('Truncated PCX run');value=data[pos++];}if(!run||cursor+run>pixels.length)throw Error('Invalid PCX run');pixels.fill(value,cursor,cursor+run);cursor+=run;}
  const indices=new Uint8Array(w*height);for(let y=0;y<height;y++)indices.set(pixels.subarray(y*stride,y*stride+w),y*w);
  const result=recolor({...sp,w,h:height,indices},palette);cache.set(index,result);return result;
 }
 function decodeWithPalette(index,group,number){const original=decode(index),target=palettes.find(p=>p.group===group&&p.number===number);if(!target)throw Error(`Palette ${group},${number} does not exist`);return recolor(original,colors[target.index]);}
 return{sprites,palettes,decode,decodeWithPalette,version:1};
}

export function decodeAct(bytes){
 if(!(bytes instanceof Uint8Array)||![768,772].includes(bytes.length))throw Error('ACT palette must contain 768 RGB bytes, with an optional 4-byte footer.');
 const rgba=new Uint8Array(1024);for(let i=0;i<256;i++){const source=(255-i)*3;rgba.set([bytes[source],bytes[source+1],bytes[source+2],i?255:0],i*4);}return rgba;
}
