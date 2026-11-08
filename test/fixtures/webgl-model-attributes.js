import {createThreeSubmitter} from '../../engine/three/submit.js';
import {createWebGLSubmitter} from '../../engine/webgl/submit.js';

// Native glTF vertex IDs are integer storage consumed by float shader inputs.
// GL must perform conversion, including normalization when explicitly requested.
export function verifyModelAttributes(){
 function render(three,normalized){
  const canvas=document.createElement('canvas');canvas.width=32;canvas.height=32;
  const raw=canvas.getContext('webgl2',{preserveDrawingBuffer:true,antialias:false}),memory=new WebAssembly.Memory({initial:1}),objects=[];
  const run=three?createThreeSubmitter(raw,memory,objects):createWebGLSubmitter(raw,memory,objects),gl=run.context||raw;
  const compile=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
  const p=gl.createProgram();gl.attachShader(p,compile(gl.VERTEX_SHADER,'#version 300 es\nlayout(location=0) in vec2 point;layout(location=1) in float id;out float value;void main(){gl_Position=vec4(point,0.,1.);value=id;}'));gl.attachShader(p,compile(gl.FRAGMENT_SHADER,'#version 300 es\nprecision highp float;in float value;out vec4 result;void main(){result=vec4(0.,value,0.,1.);}'));gl.linkProgram(p);
  if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));
  const vao=gl.createVertexArray();gl.bindVertexArray(vao);gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-.9,-.9,.9,-.9,0,.9]),gl.STATIC_DRAW);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(0);
  gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,normalized?new Uint32Array([0xffffffff,0xffffffff,0xffffffff]):new Int32Array([1,1,1]),gl.STATIC_DRAW);gl.vertexAttribPointer(1,1,normalized?gl.UNSIGNED_INT:gl.INT,normalized,0,0);gl.enableVertexAttribArray(1);
  objects.push(p,vao);const words=new Int32Array(memory.buffer,64);words.set([1,0,18,1,10,gl.TRIANGLES,0,3]);gl.viewport(0,0,32,32);gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT);run(64,8);
  // Only the eight packet words above are commands.
  const pixel=new Uint8Array(4);raw.readPixels(16,16,1,1,raw.RGBA,raw.UNSIGNED_BYTE,pixel);const result={pixel:Array.from(pixel),error:raw.getError()};raw.getExtension('WEBGL_lose_context').loseContext();return result;
 }
 const results=[];for(const normalized of [false,true]){const native=render(false,normalized),three=render(true,normalized);if(native.error||three.error||native.pixel[1]!==255||JSON.stringify(native)!==JSON.stringify(three))throw Error('Integer VBO/float shader mismatch: '+JSON.stringify({normalized,native,three}));results.push({normalized,native,three});}return results;
}
