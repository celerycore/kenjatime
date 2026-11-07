import {WebGLRenderer,Scene,Camera,Mesh,LineSegments,LineLoop,Line,Points,BufferGeometry,BufferAttribute,GLBufferAttribute,InterleavedBufferAttribute,RawShaderMaterial,ExternalTexture,WebGLRenderTarget,WebGLCubeRenderTarget,DepthTexture,Data3DTexture,GLSL3,DoubleSide,FrontSide,CustomBlending,NoBlending,AddEquation,SubtractEquation,ReverseSubtractEquation,ZeroFactor,OneFactor,SrcColorFactor,OneMinusSrcColorFactor,SrcAlphaFactor,OneMinusSrcAlphaFactor,DstAlphaFactor,OneMinusDstAlphaFactor,DstColorFactor,OneMinusDstColorFactor,SrcAlphaSaturateFactor,NeverDepth,AlwaysDepth,LessDepth,LessEqualDepth,EqualDepth,GreaterEqualDepth,GreaterDepth,NotEqualDepth,LinearSRGBColorSpace,NoToneMapping,REVISION} from 'three';
import {createWebGLSubmitter} from '../webgl/submit.js';

// Three owns geometry, shader materials, external textures and every draw.
// Go owns MUGEN semantics and resource data. Its GL-shaped ABI is decoded into
// ordered Three scene batches; it is never used to sort transparent effects.
export function createThreeSubmitter(raw,memory,objects){
 const renderer=new WebGLRenderer({canvas:raw.canvas,context:raw,alpha:false,antialias:false});
 renderer.debug.onShaderError=(gl,p,v,f)=>{throw Error('Three shader compilation failed: '+gl.getProgramInfoLog(p)+' '+gl.getShaderInfoLog(v)+' '+gl.getShaderInfoLog(f));};
 renderer.autoClear=false;renderer.sortObjects=false;renderer.info.autoReset=false;renderer.outputColorSpace=LinearSRGBColorSpace;renderer.toneMapping=NoToneMapping;renderer.resetState();
 const scene=new Scene(),camera=new Camera(),queue=[],slots=[],programs=new Map(),locations=new WeakMap(),shaders=new WeakMap(),vaos=new Map(),buffers=new Map(),textures=new WeakMap(),targets=new Map(),stripIndices=new Map();
 const state={program:null,vao:null,array:null,draw:null,read:null,unit:raw.TEXTURE0,units:new Map(),caps:new Set(),equation:raw.FUNC_ADD,src:raw.ONE,dst:raw.ZERO,depthWrite:true,depthFunc:raw.LESS,front:raw.CCW,viewport:[0,0,raw.canvas.width,raw.canvas.height],scissor:[0,0,raw.canvas.width,raw.canvas.height],clear:[0,0,0,0],pixels:new Map(),constants:new Map()};
 let active=false,direct=false,serial=0,bridge,stateVersion=0,textureVersion=0;
 const id=o=>{if(!o)return 0;let b=buffers.get(o);if(!b){b={id:++serial,bytes:0};buffers.set(o,b);}return b.id;};
 const factors=new Map([[raw.ZERO,ZeroFactor],[raw.ONE,OneFactor],[raw.SRC_COLOR,SrcColorFactor],[raw.ONE_MINUS_SRC_COLOR,OneMinusSrcColorFactor],[raw.SRC_ALPHA,SrcAlphaFactor],[raw.ONE_MINUS_SRC_ALPHA,OneMinusSrcAlphaFactor],[raw.DST_ALPHA,DstAlphaFactor],[raw.ONE_MINUS_DST_ALPHA,OneMinusDstAlphaFactor],[raw.DST_COLOR,DstColorFactor],[raw.ONE_MINUS_DST_COLOR,OneMinusDstColorFactor],[raw.SRC_ALPHA_SATURATE,SrcAlphaSaturateFactor]]);
 const equations=new Map([[raw.FUNC_ADD,AddEquation],[raw.FUNC_SUBTRACT,SubtractEquation],[raw.FUNC_REVERSE_SUBTRACT,ReverseSubtractEquation]]);
 const depths=new Map([[raw.NEVER,NeverDepth],[raw.ALWAYS,AlwaysDepth],[raw.LESS,LessDepth],[raw.LEQUAL,LessEqualDepth],[raw.EQUAL,EqualDepth],[raw.GEQUAL,GreaterEqualDepth],[raw.GREATER,GreaterDepth],[raw.NOTEQUAL,NotEqualDepth]]);
 const components=new Map([[raw.FLOAT_VEC2,2],[raw.FLOAT_VEC3,3],[raw.FLOAT_VEC4,4],[raw.INT_VEC2,2],[raw.INT_VEC3,3],[raw.INT_VEC4,4],[raw.BOOL_VEC2,2],[raw.BOOL_VEC3,3],[raw.BOOL_VEC4,4],[raw.FLOAT_MAT2,4],[raw.FLOAT_MAT3,9],[raw.FLOAT_MAT4,16]]);
 const builtin=['projectionMatrix','viewMatrix','modelViewMatrix','modelMatrix','normalMatrix','cameraPosition','isOrthographic','toneMappingExposure'];
 const alias=name=>builtin.includes(name)?'kt_native_'+name:name;
 const source=s=>{s=s.replace(/^\s*#version[^\n]*\n/,'');for(const name of builtin)s=s.replace(new RegExp('\\b'+name+'\\b','g'),alias(name));return s;};
 function program(p){
  if(programs.has(p))return programs.get(p);
  const attached=raw.getAttachedShaders(p),vs=attached.find(s=>raw.getShaderParameter(s,raw.SHADER_TYPE)===raw.VERTEX_SHADER),fs=attached.find(s=>raw.getShaderParameter(s,raw.SHADER_TYPE)===raw.FRAGMENT_SHADER);
  const info={id:++serial,vertex:source(shaders.get(vs)||raw.getShaderSource(vs)),fragment:source(shaders.get(fs)||raw.getShaderSource(fs)),revision:0,attributes:[],uniforms:new Map()};
  for(let i=0,n=raw.getProgramParameter(p,raw.ACTIVE_ATTRIBUTES);i<n;i++){const a=raw.getActiveAttrib(p,i);info.attributes.push({name:a.name,location:raw.getAttribLocation(p,a.name)});}
  for(let i=0,n=raw.getProgramParameter(p,raw.ACTIVE_UNIFORMS);i<n;i++){
   const u=raw.getActiveUniform(p,i),name=u.name.replace(/\[0\]$/,''),loc=raw.getUniformLocation(p,u.name),value=raw.getUniform(p,loc);
   const count=components.get(u.type)||1,total=count*u.size;let initial=value;if(total>1){initial=new Float32Array(total);if(typeof value==='number'||typeof value==='boolean')initial[0]=Number(value);else if(value)initial.set(value);}
   info.uniforms.set(name,{name,type:u.type,components:count,size:u.size,value:initial,sampler:[raw.SAMPLER_2D,raw.SAMPLER_CUBE,raw.SAMPLER_2D_ARRAY,raw.SAMPLER_3D,raw.SAMPLER_2D_SHADOW].includes(u.type)});
  }
  programs.set(p,info);return info;
 }
 function vao(v){
  if(vaos.has(v))return vaos.get(v);
  const a={id:++serial,attrs:new Map(),element:null};vaos.set(v,a);
  if(v){raw.bindVertexArray(v);for(let i=0,n=raw.getParameter(raw.MAX_VERTEX_ATTRIBS);i<n;i++)if(raw.getVertexAttrib(i,raw.VERTEX_ATTRIB_ARRAY_ENABLED)){const buffer=raw.getVertexAttrib(i,raw.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);a.attrs.set(i,{buffer,size:raw.getVertexAttrib(i,raw.VERTEX_ATTRIB_ARRAY_SIZE),type:raw.getVertexAttrib(i,raw.VERTEX_ATTRIB_ARRAY_TYPE),normalized:raw.getVertexAttrib(i,raw.VERTEX_ATTRIB_ARRAY_NORMALIZED),stride:raw.getVertexAttrib(i,raw.VERTEX_ATTRIB_ARRAY_STRIDE),offset:raw.getVertexAttribOffset(i,raw.VERTEX_ATTRIB_ARRAY_POINTER),enabled:true});}a.element=raw.getParameter(raw.ELEMENT_ARRAY_BUFFER_BINDING);}
  return a;
 }
 function bytes(buffer,target){let b=buffers.get(buffer);if(!b||!b.bytes){raw.bindBuffer(target,buffer);const size=raw.getBufferParameter(target,raw.BUFFER_SIZE);id(buffer);b=buffers.get(buffer);b.bytes=size;}return b.bytes;}
 function external(handle,type){
  if(!handle)return null;let texture=textures.get(handle);if(!texture){texture=new ExternalTexture(handle);texture.colorSpace='';if(type===raw.SAMPLER_CUBE){const owner=new WebGLCubeRenderTarget(1);owner.depthTexture=new DepthTexture(1,1);renderer.setRenderTargetTextures(owner,handle,null);texture=owner.texture;texture.colorSpace='';}if(type===raw.SAMPLER_2D_ARRAY)texture.isDataArrayTexture=true;if(type===raw.SAMPLER_3D){const owner=new WebGLRenderTarget(1,1);owner.texture=new Data3DTexture();owner.depthTexture=new DepthTexture(1,1);renderer.setRenderTargetTextures(owner,handle,null);texture=owner.texture;texture.colorSpace='';}textures.set(handle,texture);}return texture;
 }
 function valueOf(u){
  if(!u.sampler)return u.value;const target=u.type===raw.SAMPLER_CUBE?raw.TEXTURE_CUBE_MAP:u.type===raw.SAMPLER_2D_ARRAY?raw.TEXTURE_2D_ARRAY:u.type===raw.SAMPLER_3D?raw.TEXTURE_3D:raw.TEXTURE_2D;
  const get=unit=>external(state.units.get(raw.TEXTURE0+Number(unit))?.get(target),u.type);
  return ArrayBuffer.isView(u.value)?Array.from(u.value,get):get(u.value);
 }
 function uniformValues(p,material){
  for(const [name,u]of p.uniforms){
   const path=name.match(/[^.\[\]]+/g).map(alias);const value=valueOf(u);let parent,key;
   if(path.length===1){if(!material.uniforms[path[0]])material.uniforms[path[0]]={value:null};parent=material.uniforms[path[0]];key='value';}
   else{const root=material.uniforms[path[0]]??=( {value:/^\d+$/.test(path[1])?[]:{}} );parent=root.value;for(let i=1;i<path.length-1;i++)parent=parent[path[i]]??=( /^\d+$/.test(path[i+1])?[]:{} );key=path.at(-1);}
   const old=parent[key];if(ArrayBuffer.isView(value)&&ArrayBuffer.isView(old)&&old.length===value.length)old.set(value);
   else if(ArrayBuffer.isView(value))parent[key]=new Float32Array(value);else if(Array.isArray(value))parent[key]=value.slice();else parent[key]=value;
  }
 }
 function renderTarget(){
  let target=targets.get(state.draw);if(!target){target=new WebGLRenderTarget(1,1,{depthBuffer:false,stencilBuffer:false});renderer.setRenderTargetFramebuffer(target,state.draw);targets.set(state.draw,target);}
  target.viewport.set(...state.viewport);target.scissor.set(...state.scissor);target.scissorTest=state.caps.has(raw.SCISSOR_TEST);return target;
 }
 function flush(){
  if(!queue.length)return;
  renderer.resetState();active=true;renderer.setRenderTarget(renderTarget());
  scene.children=queue;renderer.render(scene,camera);bridge.stats.threeBatches++;queue.length=0;
 }
 function ensureRaw(){
  flush();if(!active)return;
  renderer.resetState();active=false;
  raw.useProgram(state.program);raw.bindVertexArray(state.vao);raw.bindBuffer(raw.ARRAY_BUFFER,state.array);
  raw.bindFramebuffer(raw.DRAW_FRAMEBUFFER,state.draw);raw.bindFramebuffer(raw.READ_FRAMEBUFFER,state.read);
  raw.activeTexture(state.unit);for(const [target,t]of state.units.get(state.unit)||[])raw.bindTexture(target,t);
  for(const cap of [raw.BLEND,raw.CULL_FACE,raw.DEPTH_TEST,raw.SCISSOR_TEST,raw.POLYGON_OFFSET_FILL,raw.STENCIL_TEST])raw[state.caps.has(cap)?'enable':'disable'](cap);
  raw.blendEquation(state.equation);raw.blendFunc(state.src,state.dst);raw.depthMask(state.depthWrite);raw.depthFunc(state.depthFunc);raw.frontFace(state.front);raw.viewport(...state.viewport);raw.scissor(...state.scissor);raw.clearColor(...state.clear);
  for(const [key,value]of state.pixels)raw.pixelStorei(key,value);
 }
 function geometry(p,a,mode,indexed){
  const g=new BufferGeometry();
  for(const attr of p.attributes){const d=a.attrs.get(attr.location);if(!d?.enabled)continue;const element=d.type===raw.FLOAT||d.type===raw.UNSIGNED_INT||d.type===raw.INT?4:d.type===raw.SHORT||d.type===raw.UNSIGNED_SHORT?2:1,stride=d.stride||d.size*element;
   const data=new GLBufferAttribute(d.buffer,d.type,stride/element,element,Math.floor(bytes(d.buffer,raw.ARRAY_BUFFER)/stride),d.normalized);
   // InterleavedBufferAttribute needs a typed-array descriptor for normalized
   // integer metadata; the actual vertex storage remains the external GL VBO.
   const ArrayType=d.type===raw.FLOAT?Float32Array:d.type===raw.UNSIGNED_INT?Uint32Array:d.type===raw.INT?Int32Array:d.type===raw.UNSIGNED_SHORT?Uint16Array:d.type===raw.SHORT?Int16Array:d.type===raw.UNSIGNED_BYTE?Uint8Array:Int8Array;
   data.array=new ArrayType(0);
   g.setAttribute(attr.name,new InterleavedBufferAttribute(data,d.size,d.offset/element,d.normalized));
  }
  if(indexed)g.setIndex(new GLBufferAttribute(a.element,raw.UNSIGNED_INT,1,4,bytes(a.element,raw.ELEMENT_ARRAY_BUFFER)/4));
  else if(mode===raw.TRIANGLE_STRIP){const count=Math.max(...Object.values(g.attributes).map(a=>a.count));let index=stripIndices.get(count);if(!index){const indices=new Uint32Array(Math.ceil(count/4)*6);for(let i=0,j=0;i<count;i+=4){indices[j++]=i;indices[j++]=i+1;indices[j++]=i+2;indices[j++]=i+2;indices[j++]=i+1;indices[j++]=i+3;}index=new BufferAttribute(indices,1);stripIndices.set(count,index);}g.setIndex(index);}
  return g;
 }
 function layout(p,a,mode,indexed){let key=p.id+':'+mode+':'+(indexed?id(a.element):0);for(const attr of p.attributes){const d=a.attrs.get(attr.location);key+='|'+attr.name+':'+(d?.enabled?[id(d.buffer),bytes(d.buffer,raw.ARRAY_BUFFER),d.size,d.type,d.stride,d.offset,d.normalized].join(','):'c'+(state.constants.get(attr.location)||[0,0,0,1]).join(','));}return key;}
 function draw(mode,first,count,indexed=false){
  const p=program(state.program),a=vao(state.vao),key=layout(p,a,mode,indexed),signature=key+':'+p.revision+':'+stateVersion+':'+textureVersion,previous=queue.at(-1);
  bridge.stats.goDraws++;
  if(!indexed&&mode===raw.TRIANGLE_STRIP&&previous?.userData.signature===signature&&previous.geometry.drawRange.start+previous.geometry.drawRange.count===first/4*6){previous.geometry.drawRange.count+=count/4*6;bridge.stats.mergedDraws++;return;}
  const slot=slots[queue.length]??=(new Map());let object=slot.get(key);
  if(!object){
   const material=new RawShaderMaterial({glslVersion:GLSL3,vertexShader:p.vertex,fragmentShader:p.fragment,uniforms:{},transparent:true,forceSinglePass:true,toneMapped:false});
   object=mode===raw.LINES?new LineSegments(geometry(p,a,mode,indexed),material):mode===raw.LINE_STRIP?new Line(geometry(p,a,mode,indexed),material):mode===raw.LINE_LOOP?new LineLoop(geometry(p,a,mode,indexed),material):mode===raw.POINTS?new Points(geometry(p,a,mode,indexed),material):new Mesh(geometry(p,a,mode,indexed),material);
   object.frustumCulled=false;object.matrixAutoUpdate=false;object.matrixWorldAutoUpdate=false;object.parent=scene;
   object.onBeforeRender=()=>{renderer.setScissor(...object.userData.scissor);renderer.setScissorTest(object.userData.clip);object.material.uniformsNeedUpdate=true;};slot.set(key,object);
  }
  const m=object.material;m.blending=state.caps.has(raw.BLEND)?CustomBlending:NoBlending;m.blendEquation=equations.get(state.equation);m.blendSrc=factors.get(state.src);m.blendDst=factors.get(state.dst);m.blendEquationAlpha=null;m.blendSrcAlpha=null;m.blendDstAlpha=null;m.premultipliedAlpha=false;
  m.depthTest=state.caps.has(raw.DEPTH_TEST);m.depthWrite=state.depthWrite;m.depthFunc=depths.get(state.depthFunc);m.side=state.caps.has(raw.CULL_FACE)?FrontSide:DoubleSide;
  object.matrixWorld.elements[0]=state.front===raw.CW?-1:1;
  for(const attr of p.attributes)if(!a.attrs.get(attr.location)?.enabled)m.defaultAttributeValues[attr.name]=state.constants.get(attr.location)||[0,0,0,1];
  uniformValues(p,m);object.userData.signature=signature;const clip=object.userData.scissor??=[0,0,0,0];for(let i=0;i<4;i++)clip[i]=state.scissor[i];object.userData.clip=state.caps.has(raw.SCISSOR_TEST);
  object.geometry.setDrawRange(mode===raw.TRIANGLE_STRIP?first/4*6:indexed?first/4:first,mode===raw.TRIANGLE_STRIP?count/4*6:count);
  queue.push(object);bridge.stats.threeDraws++;
 }
 const hooks={
  createVertexArray(){ensureRaw();const v=raw.createVertexArray();vaos.set(v,{id:++serial,attrs:new Map(),element:null});return v;},
  shaderSource(s,text){shaders.set(s,text);ensureRaw();raw.shaderSource(s,text);},
  getUniformLocation(p,name){ensureRaw();const loc=raw.getUniformLocation(p,name);if(loc){const info=program(p),match=name.match(/^(\w+)\[(\d+)\]$/),key=match&&info.uniforms.has(match[1])?match[1]:name;locations.set(loc,{p:info,key,index:match?Number(match[2]):0});}return loc;},
  useProgram(p){state.program=p;if(direct){ensureRaw();raw.useProgram(p);}},
  bindVertexArray(v){state.vao=v;vao(v);if(!active)raw.bindVertexArray(v);},
  bindBuffer(target,b){if(target===raw.ARRAY_BUFFER)state.array=b;else if(target===raw.ELEMENT_ARRAY_BUFFER)vao(state.vao).element=b;if(!active)raw.bindBuffer(target,b);},
  bufferData(target,data,...rest){ensureRaw();const b=target===raw.ARRAY_BUFFER?state.array:vao(state.vao).element;id(b);buffers.get(b).bytes=typeof data==='number'?data:data.byteLength;raw.bufferData(target,data,...rest);},
  activeTexture(unit){state.unit=unit;if(direct||!active)raw.activeTexture(unit);},
  bindTexture(target,t){let unit=state.units.get(state.unit);if(!unit){unit=new Map();state.units.set(state.unit,unit);}if(unit.get(target)!==t)textureVersion++;unit.set(target,t);if(direct){ensureRaw();raw.activeTexture(state.unit);raw.bindTexture(target,t);}},
  bindFramebuffer(target,f){ensureRaw();if(target!==raw.READ_FRAMEBUFFER)state.draw=f;if(target!==raw.DRAW_FRAMEBUFFER)state.read=f;raw.bindFramebuffer(target,f);},
  viewport(...v){flush();state.viewport=v;ensureRaw();raw.viewport(...v);},
  scissor(...v){if(v.some((x,i)=>x!==state.scissor[i]))stateVersion++;state.scissor=v;if(direct){ensureRaw();raw.scissor(...v);}},
  enable(cap){if(!state.caps.has(cap))stateVersion++;state.caps.add(cap);if(direct){ensureRaw();raw.enable(cap);}},disable(cap){if(state.caps.has(cap))stateVersion++;state.caps.delete(cap);if(direct){ensureRaw();raw.disable(cap);}},
  blendEquation(v){if(v!==state.equation)stateVersion++;state.equation=v;},blendFunc(a,b){if(a!==state.src||b!==state.dst)stateVersion++;state.src=a;state.dst=b;},depthMask(v){if(v!==state.depthWrite)stateVersion++;state.depthWrite=v;},depthFunc(v){if(v!==state.depthFunc)stateVersion++;state.depthFunc=v;},frontFace(v){if(v!==state.front)stateVersion++;state.front=v;},
  clearColor(...v){state.clear=v;ensureRaw();raw.clearColor(...v);},clear(mask){ensureRaw();raw.depthMask(state.depthWrite);raw[state.caps.has(raw.SCISSOR_TEST)?'enable':'disable'](raw.SCISSOR_TEST);raw.scissor(...state.scissor);raw.clear(mask);},
  pixelStorei(k,v){state.pixels.set(k,v);ensureRaw();raw.pixelStorei(k,v);},
  vertexAttribPointer(location,size,type,normalized,stride,offset){const a=vao(state.vao),previous=a.attrs.get(location);a.attrs.set(location,{buffer:state.array,size,type,normalized,stride,offset,enabled:previous?.enabled??false});if(direct){ensureRaw();raw.vertexAttribPointer(location,size,type,normalized,stride,offset);}},
  enableVertexAttribArray(i){const a=vao(state.vao),d=a.attrs.get(i)||{};d.enabled=true;a.attrs.set(i,d);if(direct){ensureRaw();raw.enableVertexAttribArray(i);}},
  disableVertexAttribArray(i){const d=vao(state.vao).attrs.get(i);if(d)d.enabled=false;},vertexAttrib4f(i,...v){state.constants.set(i,v);},
  drawArrays(mode,first,count){draw(mode,first,count);},drawElements(mode,count,type,offset){if(type!==raw.UNSIGNED_INT)throw Error('Unsupported index format');draw(mode,offset,count,true);},
  getParameter(p){if(p===raw.ACTIVE_TEXTURE)return state.unit;if(p===raw.TEXTURE_BINDING_2D)return state.units.get(state.unit)?.get(raw.TEXTURE_2D)||null;if(p===raw.VERTEX_ARRAY_BINDING)return state.vao;if(p===raw.ARRAY_BUFFER_BINDING)return state.array;if(p===raw.READ_FRAMEBUFFER_BINDING)return state.read;return raw.getParameter(p);}
 };
 for(const name of ['uniform1i','uniform1f','uniform2f','uniform3f','uniform4f','uniform1fv','uniform2fv','uniform3fv','uniform4fv','uniform1iv','uniform2iv','uniform3iv','uniform4iv','uniformMatrix2fv','uniformMatrix4fv','uniformMatrix3fv'])hooks[name]=(loc,...args)=>{
  if(!loc)return;const meta=locations.get(loc);if(!meta)throw Error('Three uniform metadata missing');let u=meta.p.uniforms.get(meta.key);if(!u){u={name:meta.key,type:0,sampler:false,value:0};meta.p.uniforms.set(meta.key,u);}
  if(name==='uniform1i'||name==='uniform1f'){if(ArrayBuffer.isView(u.value)){const index=meta.index*(u.components||1);if(u.value[index]!==args[0])meta.p.revision++;u.value[index]=args[0];}else{if(u.value!==args[0])meta.p.revision++;u.value=args[0];}return;}
  const matrix=name.includes('Matrix'),vector=/v$/.test(name),values=matrix?args[1]:vector?args[0]:args,offset=(matrix?args[2]:vector?args[1]:0)||0,n=(matrix?args[3]:vector?args[2]:undefined)??values.length;
  const start=meta.index*(u.components||1),length=Math.max(n+start,(u.components||1)*(u.size||1));if(!ArrayBuffer.isView(u.value)||u.value.length<length)u.value=new Float32Array(length);for(let i=0;i<n;i++){if(u.value[start+i]!==values[offset+i])meta.p.revision++;u.value[start+i]=values[offset+i];}
 };
 for(const name of ['texImage2D','texImage3D','texSubImage2D','texSubImage3D','texStorage2D','texStorage3D','texParameteri','generateMipmap','copyTexSubImage2D'])hooks[name]=(...args)=>{
  ensureRaw();raw.activeTexture(state.unit);for(const [target,texture]of state.units.get(state.unit)||[])raw.bindTexture(target,texture);return raw[name](...args);
 };
 const proxy=new Proxy(raw,{get(target,name){if(hooks[name])return hooks[name];const value=target[name];if(typeof value!=='function')return value;return(...args)=>{ensureRaw();return value.apply(target,args);};}});
 bridge=createWebGLSubmitter(proxy,memory,objects);Object.assign(bridge.stats,{backend:'Three.js r'+REVISION,threeDraws:0,threeBatches:0,goDraws:0,mergedDraws:0});
 const submit=(ptr,n)=>{bridge(ptr,n);flush();};
 for(const name of ['stream','targets','quality','present'])submit[name]=(...args)=>bridge[name](...args);
 submit.direct=(name,...args)=>{ensureRaw();direct=true;try{return bridge.direct(name,...args);}finally{direct=false;}};
 submit.stats=bridge.stats;submit.context=new Proxy(raw,{get(target,name){const value=target[name];return typeof value==='function'?((...args)=>submit.direct(name,...args)):value;}});return submit;
}
