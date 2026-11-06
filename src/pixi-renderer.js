import {WebGLRenderer,Container,Geometry,Mesh,Shader,GlProgram,UniformGroup,Texture,CanvasSource,BufferImageSource,State} from 'pixi.js';
import {blendCoefficients} from './rendering.js';

export const GPU_TEXTURE_LIMIT=16*1024*1024;
const MAX_FX=8,MAX_BATCH_QUADS=4096;
const vertex=`#version 300 es
precision highp float;
in vec2 aPosition;
in vec2 aUV;
in vec4 aBlend;
uniform vec2 uSize;
out vec2 vUV;
out vec4 vBlend;
void main(){vUV=aUV;vBlend=aBlend;gl_Position=vec4(aPosition.x/uSize.x*2.0-1.0,1.0-aPosition.y/uSize.y*2.0,0.0,1.0);}`;
const fragment=`#version 300 es
precision highp float;
in vec2 vUV;
in vec4 vBlend;
uniform sampler2D uTexture;
uniform sampler2D uPalette;
uniform vec2 uSize;
uniform vec4 uClip;
uniform vec4 uFxColor[8];
uniform vec4 uFxAdd[8];
uniform vec4 uFxMul[8];
uniform vec4 uFxPost[8];
uniform float uFxCount;
out vec4 finalColor;
void main(){
 vec4 s=texture(uTexture,vUV);
 if(vBlend.w>1.5)s=texture(uPalette,vec2((floor(s.r*255.0+.5)+.5)/256.0,.5));
 vec3 rgb=vBlend.w>0.5&&vBlend.w<1.5?(s.a>0.0?s.rgb/s.a:vec3(0.0)):s.rgb;
 rgb*=255.0;
 for(int i=0;i<8;i++){
  if(float(i)>=uFxCount)break;
  float grey=dot(rgb,vec3(.299,.587,.114));
  rgb=vec3(grey)+(rgb-vec3(grey))*uFxColor[i].x;
  if(uFxColor[i].y>0.5)rgb=255.0-rgb;
  rgb=clamp((rgb+uFxAdd[i].rgb)*uFxMul[i].rgb+uFxPost[i].rgb,0.0,255.0);
 }
 if(uFxCount>0.0)rgb=floor(rgb+0.00001);
 vec2 p=vec2(gl_FragCoord.x,uSize.y-gl_FragCoord.y);
 vec2 coverage=clamp(min(p-uClip.xy, uClip.zw-p)+vec2(.5),0.0,1.0);
 float alpha=s.a*vBlend.z*min(coverage.x,coverage.y);
 finalColor=vec4(rgb/255.0*alpha*vBlend.x,alpha*(1.0-vBlend.y));
}`;

function paletteUniforms(palette){
 const layers=palette?.layers||[];if(layers.length>MAX_FX)throw Error('More than eight simultaneous palette layers');
 const color=new Float32Array(32),add=new Float32Array(32),mul=new Float32Array(32),post=new Float32Array(32);
 for(let i=0;i<layers.length;i++){
  const fx=layers[i],s=fx.sinadd||[],wave=s[3]?Math.sin(2*Math.PI*(fx.age||0)/s[3]):0,o=i*4;
  color[o]=Math.max(0,Math.min(256,fx.color??256))/256;color[o+1]=fx.invertall?1:0;
  for(let c=0;c<3;c++){add[o+c]=Number(fx.add?.[c]??0)+Number(s[c]||0)*wave;mul[o+c]=Number(fx.mul?.[c]??256)/256;post[o+c]=Number(fx.postadd?.[c]??0);}
 }
 return{color,add,mul,post,count:layers.length};
}

/** Experimental WebGL2 sprite batches. Combat and painter order stay outside this module. */
export class PixiSpriteRenderer{
 async init({canvas,onLost=()=>{},maxTextureBytes=GPU_TEXTURE_LIMIT}={}){
  this.canvas=canvas;this.limit=maxTextureBytes;this.textures=new Map();this.textureBytes=0;this.frame=0;this.pool=[];this.commands=[];this.records=[];this.fxCache=new Map();
  this.renderer=new WebGLRenderer();
  await this.renderer.init({canvas,width:canvas.width,height:canvas.height,preferWebGLVersion:2,antialias:false,resolution:1,backgroundAlpha:1,backgroundColor:0x0c111b,autoDensity:false,powerPreference:'high-performance',preserveDrawingBuffer:false});
  const gl=this.renderer.gl;
  if(!(gl instanceof WebGL2RenderingContext))throw Error('WebGL2 is unavailable');
  // R8 rows can have any width; RGBA sources are also valid with alignment 1.
  gl.pixelStorei(gl.UNPACK_ALIGNMENT,1);
  this.maximum=gl.getParameter(gl.MAX_TEXTURE_SIZE);this.stage=new Container();
  this.renderer.state.blendModesMap['mugen-subtract']=[gl.ONE,gl.ONE,gl.ZERO,gl.ONE,gl.FUNC_REVERSE_SUBTRACT,gl.FUNC_ADD];
  this.program=GlProgram.from({vertex,fragment,name:'mugen-sprites'});
  this.lost=event=>{event.preventDefault();onLost('WebGL context was lost');};canvas.addEventListener('webglcontextlost',this.lost);
  this.beginFrame(canvas.width,canvas.height);return this;
 }
 beginFrame(width,height){
  this.frame++;this.commands.length=0;this.stage.removeChildren();this.frameSources=new Map();this.frameBytes=0;this.stats={sprites:0,batches:0,uploads:0,uploadBytes:0,textureBytes:this.textureBytes};
  if(this.renderer.width!==width||this.renderer.height!==height)this.renderer.resize(width,height);
 }
 texture(key,surface,pixels=null,{mutable=false,indexed=false}={}){
  let entry=this.textures.get(key);
  if(entry&&(entry.width!==surface.width||entry.height!==surface.height||entry.indexed!==indexed)){this.removeTexture(key);entry=null;}
  if(entry&&!mutable){entry.used=this.frame;this.textures.delete(key);this.textures.set(key,entry);return entry;}
  const width=surface.width,height=surface.height,bytes=width*height*(indexed?1:4);
  if(width>this.maximum||height>this.maximum||bytes>this.limit)throw Error('Sprite exceeds the GPU texture limit');
  if(!entry){
   while(this.textureBytes+bytes>this.limit){const candidate=[...this.textures].find(([key,value])=>value.used!==this.frame&&!this.frameSources.has(key));if(!candidate)throw Error('This frame exceeds the GPU texture budget');this.removeTexture(candidate[0]);}
   const source=pixels?new BufferImageSource({resource:typeof pixels==='function'?pixels():pixels,width,height,format:indexed?'r8unorm':'rgba8unorm',alphaMode:'no-premultiply-alpha',scaleMode:'nearest',autoGenerateMipmaps:false}):new CanvasSource({resource:surface,scaleMode:'nearest',autoGenerateMipmaps:false});
   entry={texture:new Texture({source}),bytes,width,height,indexed,used:this.frame,premultiplied:!pixels};this.textures.set(key,entry);this.textureBytes+=bytes;
  }else{entry.used=this.frame;entry.texture.source.update();}
  this.stats.uploads++;this.stats.uploadBytes+=bytes;this.stats.textureBytes=this.textureBytes;return entry;
 }
 removeTexture(key){const entry=this.textures.get(key);if(entry){entry.texture.destroy(true);this.textureBytes-=entry.bytes;this.textures.delete(key);}}
 registerSource(key,surface,pixels,{mutable=false,indexed=false}={}){
  let entry=this.frameSources.get(key);if(entry)return entry;
  const bytes=surface.width*surface.height*(indexed?1:4);if(surface.width>this.maximum||surface.height>this.maximum||bytes>this.limit)throw Error('Sprite exceeds the GPU texture limit');if(this.frameBytes+bytes>this.limit)throw Error('This frame exceeds the GPU texture budget');
  entry={key,surface,pixels:pixels&&!this.textures.has(key)?(typeof pixels==='function'?pixels():pixels):pixels,mutable,indexed,premultiplied:!pixels};this.frameSources.set(key,entry);this.frameBytes+=bytes;return entry;
 }
 draw({surface,pixels=null,key=surface,indexPalette=null,matrix,x=0,y=0,width=surface.width,height=surface.height,clip,alpha=1,blend='',palette=null,mutable=false}){
  // Canvas exposes float32 transform noise after resolution changes (e.g. .6).
  clip=clip?.map(value=>Math.abs(value-Math.round(value))<=1e-3?Math.round(value):value);
  if(clip?.some(value=>Math.abs(value-Math.round(value))>1e-5))throw Error(`Fractional clipping needs Canvas in this prototype (${clip.map(value=>value.toFixed(2)).join(', ')})`);
  const entry=this.registerSource(key,surface,pixels,{mutable,indexed:!!indexPalette}),paletteEntry=indexPalette?this.registerSource(indexPalette,{width:256,height:1},indexPalette):null;
  const c=typeof blend==='string'?blendCoefficients(blend):blend;
  const fxKey=palette?.key||JSON.stringify(palette?.layers||[]),mode=c.mode==='subtract'?'mugen-subtract':'normal';
  const signature=JSON.stringify([mode,fxKey,clip]);let batch=this.commands.at(-1);
  if(!batch||batch.entry!==entry||batch.paletteEntry!==paletteEntry||batch.signature!==signature||batch.count>=MAX_BATCH_QUADS){
   if(this.commands.length>=2048)throw Error('This frame exceeds the GPU batch limit');
   let fx=this.fxCache.get(fxKey);if(!fx){fx=paletteUniforms(palette);if(this.fxCache.size>=256)this.fxCache.delete(this.fxCache.keys().next().value);this.fxCache.set(fxKey,fx);}
   batch=this.records[this.commands.length]||={positions:[],uvs:[],blends:[]};Object.assign(batch,{entry,paletteEntry,signature,mode,clip,fx,count:0});batch.positions.length=batch.uvs.length=batch.blends.length=0;this.commands.push(batch);
  }
  for(const [px,py]of [[x,y],[x+width,y],[x+width,y+height],[x,y+height]])batch.positions.push(matrix.a*px+matrix.c*py+matrix.e,matrix.b*px+matrix.d*py+matrix.f);
  const blendData=[c.mode==='normal'||c.mode==='subtract'?1:c.source,c.mode==='normal'?0:c.mode==='subtract'?1:c.destination,alpha,entry.indexed?2:entry.premultiplied?1:0];for(let i=0;i<4;i++)batch.blends.push(...blendData);
  batch.uvs.push(0,0,1,0,1,1,0,1);batch.count++;this.stats.sprites++;
 }
 createBatch(){
  const geometry=new Geometry({attributes:{aPosition:{buffer:new Float32Array(8),format:'float32x2'},aUV:{buffer:new Float32Array(8),format:'float32x2'},aBlend:{buffer:new Float32Array(16),format:'float32x4'}},indexBuffer:new Uint16Array([0,1,2,0,2,3])});
  const group=new UniformGroup({uSize:{value:new Float32Array(2),type:'vec2<f32>'},uClip:{value:new Float32Array(4),type:'vec4<f32>'},uFxCount:{value:0,type:'f32'},...Object.fromEntries(['Color','Add','Mul','Post'].map(name=>['uFx'+name,{value:new Float32Array(32),type:'vec4<f32>',size:8}]))});
  const shader=new Shader({glProgram:this.program,resources:{mugen:group,uTexture:Texture.WHITE.source,uPalette:Texture.WHITE.source}}),state=State.for2d(),mesh=new Mesh({geometry,shader,state});
  return{geometry,shader,group,mesh,capacity:0};
 }
 endFrame(){
  // Pin the complete visible set before choosing evictions. Otherwise a new
  // animated background can evict a large static layer drawn later this frame.
  for(const source of this.frameSources.values())source.cached=this.texture(source.key,source.surface,source.pixels,{mutable:source.mutable,indexed:source.indexed});
  for(let i=0;i<this.commands.length;i++){
   const batch=this.commands[i],item=this.pool[i]||=this.createBatch(),u=item.group.uniforms;
   if(item.capacity<batch.count){item.capacity=2**Math.ceil(Math.log2(batch.count));for(const [name,size]of [['aPosition',8],['aUV',8],['aBlend',16]])item.geometry.getBuffer(name).data=new Float32Array(item.capacity*size);const indices=new Uint16Array(item.capacity*6);for(let q=0;q<item.capacity;q++)indices.set([q*4,q*4+1,q*4+2,q*4,q*4+2,q*4+3],q*6);item.geometry.getIndex().data=indices;}
   for(const [name,values]of [['aPosition',batch.positions],['aUV',batch.uvs],['aBlend',batch.blends]]){const buffer=item.geometry.getBuffer(name);buffer.data.set(values);buffer.update();}item.geometry.indexCount=batch.count*6;
   u.uSize.set([this.canvas.width,this.canvas.height]);u.uClip.set(batch.clip||[0,0,this.canvas.width,this.canvas.height]);
   u.uFxCount=batch.fx.count;u.uFxColor.set(batch.fx.color);u.uFxAdd.set(batch.fx.add);u.uFxMul.set(batch.fx.mul);u.uFxPost.set(batch.fx.post);item.group.update();
   item.shader.resources.uTexture=batch.entry.cached.texture.source;item.shader.resources.uPalette=batch.paletteEntry?.cached.texture.source||Texture.WHITE.source;item.mesh.blendMode=batch.mode;item.mesh.state.blendMode=batch.mode;this.stage.addChild(item.mesh);
  }
  this.renderer.render({container:this.stage});this.stats.batches=this.commands.length;for(const source of this.frameSources.values()){source.pixels=null;source.surface=null;}
  return this.stats;
 }
 readPixels(){this.renderer.render({container:this.stage});const gl=this.renderer.gl,w=this.canvas.width,h=this.canvas.height,raw=new Uint8Array(w*h*4),out=new Uint8ClampedArray(raw.length);gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,raw);for(let y=0;y<h;y++)out.set(raw.subarray(y*w*4,(y+1)*w*4),(h-1-y)*w*4);return out;}
 clearTextures(){for(const key of this.textures.keys())this.removeTexture(key);this.commands.length=this.records.length=0;this.frameSources?.clear();this.fxCache.clear();}
 destroy(){this.canvas?.removeEventListener('webglcontextlost',this.lost);this.clearTextures();for(const item of this.pool){item.mesh.destroy();item.geometry.destroy();item.shader.destroy();}this.renderer?.destroy();}
}
