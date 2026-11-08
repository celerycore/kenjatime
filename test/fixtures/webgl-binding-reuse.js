import {createThreeSubmitter} from '../../engine/three/submit.js';
import {createWebGLSubmitter} from '../../engine/webgl/submit.js';

// Cache two sprite VAOs, discover an external model index buffer, then reuse
// both sprite VAOs. Metadata queries must not replace the cached second EBO.
export function verifyBindingReuse(){
 function render(three){
  const canvas=document.createElement('canvas');canvas.width=64;canvas.height=32;
  const gl=canvas.getContext('webgl2',{preserveDrawingBuffer:true,antialias:false});
  if(!gl)throw Error('WebGL2 required');
  const shader=(type,text)=>{const s=gl.createShader(type);gl.shaderSource(s,text);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
  const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,'#version 300 es\nlayout(location=0) in vec4 vertex;void main(){gl_Position=vec4(vertex.xy,0.,1.);}'));
  gl.attachShader(program,shader(gl.FRAGMENT_SHADER,'#version 300 es\nprecision highp float;uniform vec4 color;out vec4 result;void main(){result=color;}'));gl.linkProgram(program);
  const sprite=gl.createBuffer(),model=gl.createBuffer(),indices=gl.createBuffer();
  function vao(buffer,data){const v=gl.createVertexArray();gl.bindVertexArray(v);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,4,gl.FLOAT,false,16,0);return v;}
  const spriteVAO=vao(sprite,128),modelVAO=vao(model,new Float32Array([-.1,-.1,0,0,.1,-.1,0,0,0,.1,0,0]));
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indices);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint32Array([0,1,2]),gl.STATIC_DRAW);
  const memory=new WebAssembly.Memory({initial:2}),objects=[sprite,spriteVAO,model,modelVAO,program,null];
  const run=three?createThreeSubmitter(gl,memory,objects):createWebGLSubmitter(gl,memory,objects);
  objects[5]=three?run.context.getUniformLocation(program,'color'):gl.getUniformLocation(program,'color');
  run.stream(spriteVAO,0);
  // Reflect both native VAOs now, but leave the model EBO size undiscovered.
  run.direct('bindVertexArray',modelVAO);run.direct('bindVertexArray',spriteVAO);
  const f=v=>v.map(n=>[n]),quad=(left,right)=>[left,-.8,0,0,right,-.8,1,0,left,.8,0,1,right,.8,1,1],vertices=[...quad(-.9,-.1),...quad(.1,.9)];
  function packet(words){const i=new Int32Array(memory.buffer,64),v=new Float32Array(memory.buffer,64);words.forEach((n,j)=>{if(Array.isArray(n))v[j]=n[0];else i[j]=n;});run(64,words.length);}
  const sprites=[1,4,18,1,9,0,vertices.length,...f(vertices),6,5,...f([1,0,0,1]),10,gl.TRIANGLE_STRIP,0,4,6,5,...f([0,1,0,1]),10,gl.TRIANGLE_STRIP,4,4];
  gl.viewport(0,0,64,32);gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT);packet(sprites);
  packet([1,4,18,3,6,5,...f([0,0,1,1]),26,gl.TRIANGLES,3,0]);
  if(three)run.context.clear(gl.COLOR_BUFFER_BIT);else gl.clear(gl.COLOR_BUFFER_BIT);
  packet(sprites);
  const pixels=new Uint8Array(64*32*4);gl.readPixels(0,0,64,32,gl.RGBA,gl.UNSIGNED_BYTE,pixels);const error=gl.getError();
  const sample=x=>Array.from(pixels.subarray((16*64+x)*4,(16*64+x)*4+4));
  const result={left:sample(16),right:sample(48),error};gl.getExtension('WEBGL_lose_context').loseContext();return result;
 }
 const reference=render(false),three=render(true);
 if(JSON.stringify(reference)!==JSON.stringify(three)||three.error)throw Error('External buffer metadata changed cached sprite VAO: '+JSON.stringify({reference,three}));
 return {matched:true,reference,three};
}
