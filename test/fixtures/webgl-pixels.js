// Real WebGL2 regression: exercise the same ordered packets on both backends.
import {createThreeSubmitter} from '../../engine/three/submit.js';
import {createWebGLSubmitter} from '../../engine/webgl/submit.js';
import {referenceSource} from './webgl-reference.js';

export function verifyPixels(three=false){
 const F=values=>values.map(x=>[x]),quad=(x,y,w,h)=>F([x,y,0,0,x+w,y,1,0,x,y+h,0,1,x+w,y+h,1,1]);
 const identity=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],rot=[.87,.5,0,0,-.5,.87,0,0,0,0,1,0,0,0,0,1];
 function render(optimized){
  const canvas=document.createElement('canvas');canvas.width=128;canvas.height=96;
  const raw=canvas.getContext('webgl2',{antialias:false,alpha:false,preserveDrawingBuffer:true});if(!raw)throw Error('WebGL2 unavailable');
  const memory=new WebAssembly.Memory({initial:2,maximum:4}),copy=new ArrayBuffer(65536),objects=[];
  const threeRun=optimized&&three?createThreeSubmitter(raw,memory,objects):null,gl=threeRun?.context||raw;
  const shader=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
  const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,`#version 300 es
   layout(location=0) in vec4 point;layout(location=1) in vec4 extra;
   uniform mat4 transform;uniform mat4 bones[2];uniform mat3 shear;uniform vec2 shift;out vec2 uv;
   void main(){gl_Position=transform*bones[0]*bones[1]*vec4((shear*vec3(point.xy,1.)).xy+shift,0.,1.);gl_Position.xy+=extra.xy*.01;uv=point.zw;}`));
  gl.attachShader(program,shader(gl.FRAGMENT_SHADER,`#version 300 es
   precision highp float;uniform sampler2D image;uniform vec4 tint;uniform vec3 bias;
   uniform float factor;uniform vec4 pair[2];struct Light{vec3 color;float intensity;};uniform Light lights[2];uniform vec3 cameraPosition;in vec2 uv;out vec4 color;
   void main(){color=texture(image,uv)*tint*factor+vec4(bias,0.)+pair[0]+pair[1]+vec4(lights[0].color*lights[0].intensity+lights[1].color*lights[1].intensity+cameraPosition*.01,0.);}`));
  gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
  const sprite=gl.createBuffer(),font=gl.createBuffer(),model=gl.createBuffer();
  const vao=b=>{const v=gl.createVertexArray();gl.bindVertexArray(v);gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,128,gl.STREAM_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,4,gl.FLOAT,false,16,0);return v;};
  const spriteVAO=vao(sprite),fontVAO=vao(font),modelVAO=vao(model),indices=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,model);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-.7,-.7,0,0,.7,-.7,1,0,0,.7,.5,1]),gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indices);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint32Array([0,1,2]),gl.STATIC_DRAW);
  const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,2,2,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([190,40,80,170,20,220,90,255,80,110,240,210,240,180,60,128]));gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
  const names=['transform','shear','shift','image','tint','bias','factor','pair','lights[0].color','lights[0].intensity','lights[1].color','lights[1].intensity','bones[0]','bones[1]','cameraPosition'];
  objects.push(sprite,spriteVAO,font,fontVAO,model,modelVAO,texture,program,...names.map(n=>gl.getUniformLocation(program,n)));
  const run=threeRun||(optimized?createWebGLSubmitter(gl,memory,objects):new Function('gl','buffer','T',referenceSource)(gl,copy,objects));
  if(optimized){run.stream(spriteVAO,0);run.stream(fontVAO,2);run.direct('bindBuffer',gl.ARRAY_BUFFER,model);run.direct('bindVertexArray',modelVAO);}
  function packet(words){const data=optimized?memory.buffer:copy,offset=optimized?64:0,i=new Int32Array(data,offset),f=new Float32Array(data,offset);words.forEach((x,n)=>{if(Array.isArray(x))f[n]=x[0];else i[n]=x;});if(optimized)run(64,words.length);else run(words.length);}
  const upload=(id,q,op=9)=>[op,id,q.length,...q],matrix=m=>[7,8,...F(m)],tint=v=>[6,12,...F(v)];
  gl.viewport(0,0,128,96);gl.clearColor(.2,.3,.4,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  packet([1,7,7,20,...F(identity),7,21,...F(identity),5,16,...F([.1,.05,.025]),3,17,[.2],5,18,...F([.025,.05,.1]),3,19,[.15],5,22,...F([.03,.02,.01]),2,11,0,3,14,[.85],4,10,[.01],[-.02],5,13,[.01],[.02],[.03],22,15,...F([0,0,0,0,.01,0,0,0]),23,9,...F([1,0,0,.15,1,0,0,0,1]),...matrix(identity),8,0,6,20,gl.TEXTURE_MAG_FILTER,gl.NEAREST,21,0,11,gl.BLEND,13,gl.FUNC_ADD,14,gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,18,1,...tint([1,.8,.9,.8]),...upload(0,quad(-.9,-.9,1.2,1.3)),10,gl.TRIANGLE_STRIP,0,4,...matrix(rot),...tint([.5,1,.8,.65]),...upload(0,quad(-.5,-.5,1,1)),10,gl.TRIANGLE_STRIP,0,4,11,gl.SCISSOR_TEST,15,24,13,72,65,13,gl.FUNC_REVERSE_SUBTRACT,14,gl.ONE,gl.ONE,...upload(0,quad(-.8,-.4,1.5,.8)),10,gl.TRIANGLE_STRIP,0,4,12,gl.SCISSOR_TEST,13,gl.FUNC_ADD,14,gl.ONE,gl.ONE,18,3,...matrix(identity),...tint([.4,.3,.2,.4]),...upload(2,F([-.9,.6,0,0,-.3,.6,1,0,-.6,.9,.5,1]),19),10,gl.TRIANGLES,0,3,18,1,10,gl.TRIANGLE_STRIP,0,4]);
  // Force a memory-view refresh, and a capacity-style flush before the draw.
  if(optimized)memory.grow(1);
  packet([18,1,...upload(0,quad(.3,-.9,.6,.5))]);
  packet([12,gl.BLEND,10,gl.TRIANGLE_STRIP,0,4,...upload(0,quad(.3,.3,.6,.5)),10,gl.TRIANGLE_STRIP,0,4]);
  // Exercise indexed models after streamed sprite/font geometry.
  packet([18,5,30,gl.ARRAY_BUFFER,4,24,0,4,gl.FLOAT,0,16,0,29,0,25,1,[.1],[.2],[0],[1],28,gl.CW,16,1,17,gl.LEQUAL,27,0,gl.TEXTURE_2D,6,...matrix(rot),...tint([.4,.5,.7,.7]),26,gl.TRIANGLES,3,0]);
  packet([18,1,...matrix(identity),...upload(0,quad(-.7,-.2,.6,.5)),10,gl.TRIANGLE_STRIP,0,4,...upload(0,quad(-.3,-.1,.6,.5)),10,gl.TRIANGLE_STRIP,0,4]);
  if(optimized&&three&&run.stats.mergedDraws<1)throw Error('Compatible quads were not batched');
  const pixels=new Uint8Array(128*96*4);gl.readPixels(0,0,128,96,gl.RGBA,gl.UNSIGNED_BYTE,pixels);const error=gl.getError();if(error!==gl.NO_ERROR)throw Error('GL error '+error);
  // Validate the direct presentation path without changing its pixel output.
  if(optimized){
   const fbo=gl.createFramebuffer(),target=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,target);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,128,96,0,gl.RGBA,gl.UNSIGNED_BYTE,null);gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,target,0);
   gl.bindFramebuffer(gl.READ_FRAMEBUFFER,null);gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,fbo);gl.blitFramebuffer(0,0,128,96,0,0,128,96,gl.COLOR_BUFFER_BIT,gl.NEAREST);gl.disable(gl.SCISSOR_TEST);gl.clearColor(0,0,0,1);run.present(fbo,128,96,0,0,128,96,false);
   const presented=new Uint8Array(pixels.length);gl.readPixels(0,0,128,96,gl.RGBA,gl.UNSIGNED_BYTE,presented);if(pixels.some((v,i)=>v!==presented[i]))throw Error('Presentation pixels changed');
  }
  gl.getExtension('WEBGL_lose_context').loseContext();return{pixels,stats:run.stats};
 }
 const reference=render(false),current=render(true);let different=0;for(let i=0;i<reference.pixels.length;i++)if(reference.pixels[i]!==current.pixels[i])different++;
 if(different)throw Error(different+' GPU pixel channels changed');
 return{pixelChannels:reference.pixels.length,differentChannels:different,commandCopies:current.stats.commandCopies,memoryViews:current.stats.memoryViews,vertexUploads:current.stats.vertexUploads,allOpcodes:true,backend:current.stats.backend,threeDraws:current.stats.threeDraws||0,mergedDraws:current.stats.mergedDraws||0};
}
