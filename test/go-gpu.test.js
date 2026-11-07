import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createWebGLSubmitter} from '../engine/webgl/submit.js';
import {referenceSource} from './fixtures/webgl-reference.js';

function fakeGL(){
 const gl={ARRAY_BUFFER_BINDING:0x8894,VERTEX_ARRAY_BINDING:0x85b5,draws:[],calls:{},bound:null,vao:null,state:{}};
 const count=name=>gl.calls[name]=(gl.calls[name]||0)+1;
 gl.getParameter=p=>p===gl.ARRAY_BUFFER_BINDING?gl.bound:gl.vao;
 gl.bindBuffer=(target,b)=>{if(target===0x8892)gl.bound=b;count('bindBuffer');};gl.bindVertexArray=v=>gl.vao=v;
 gl.bufferData=(target,data,usage,offset=0,n)=>{gl.bound.data=typeof data==='number'?new Float32Array(data/4):data.slice(offset,offset+(n??data.length));count('bufferData');};
 gl.bufferSubData=(target,offset,data,start=0,n)=>{gl.bound.data.set(data.subarray(start,start+(n??data.length)),offset/4);count('bufferSubData');};
 const capture=(kind,data)=>gl.draws.push({kind,data:[...data],state:structuredClone(gl.state)});
 gl.drawArrays=(mode,first,n)=>capture('arrays',gl.vao.buffer.data.subarray(first*4,(first+n)*4));
 gl.drawElements=(mode,n,type,offset)=>capture('elements',[mode,n,type,offset]);
 for(const name of ['useProgram','activeTexture','bindTexture','enable','disable','blendEquation','blendFunc','scissor','depthMask','depthFunc','texParameteri','frontFace','enableVertexAttribArray','disableVertexAttribArray','vertexAttrib4f'])gl[name]=(...a)=>gl.state[name]=a.map(v=>typeof v==='object'?v?.name:v);
 for(const name of ['uniform1i','uniform1f','uniform2f','uniform3f','uniform4f'])gl[name]=(loc,...v)=>gl.state[loc.name]=v;
 for(const name of ['uniformMatrix4fv','uniformMatrix3fv'])gl[name]=(loc,transpose,data,offset=0,n=data.length)=>gl.state[loc.name]=[...data.subarray(offset,offset+n)];
 gl.uniform4fv=(loc,data,offset=0,n=data.length)=>gl.state[loc.name]=[...data.subarray(offset,offset+n)];
 gl.vertexAttribPointer=(...a)=>gl.state.attribute=[gl.bound.name,...a];
 return gl;
}
function harness(){
 const old=fakeGL(),gpu=fakeGL(),mem=new WebAssembly.Memory({initial:2,maximum:4}),buffer=new ArrayBuffer(262144);
 const objects=()=>{const a={name:'sprite',data:new Float32Array(16)},b={name:'font',data:new Float32Array(24)},model={name:'model',data:new Float32Array(32)};return[a,{name:'spriteVAO',buffer:a},b,{name:'fontVAO',buffer:b},{name:'matrix'},{name:'texture'},model,{name:'modelVAO',buffer:model}];};
 const t1=objects(),t2=objects(),legacy=new Function('gl','buffer','T',referenceSource)(old,buffer,t1),run=createWebGLSubmitter(gpu,mem,t2);
 run.stream(t2[1],0);run.stream(t2[3],2);
 function packet(words){const oldI=new Int32Array(buffer),newI=new Int32Array(mem.buffer,64),oldF=new Float32Array(buffer),newF=new Float32Array(mem.buffer,64);words.forEach((v,i)=>{if(Array.isArray(v)){oldF[i]=newF[i]=v[0];}else oldI[i]=newI[i]=v;});legacy(words.length);run(64,words.length);assert.deepEqual(gpu.draws,old.draws);}
 return{old,gpu,run,mem,packet,t1,t2};
}
const floats=values=>values.map(v=>[v]),quad=base=>Array.from({length:16},(_,i)=>base+i/8),upload=(id,data,op=9)=>[op,id,data.length,...floats(data)];

test('GPU streams preserve ordered vertices, matrices, blend/clip state and font switches',()=>{
 const h=harness(),matrix=Array.from({length:16},(_,i)=>i%5===0?1:0);
 h.packet([18,1,7,4,...floats(matrix),8,0,5,11,0xbe2,14,0x302,0x303,15,3,4,120,80,...upload(0,quad(1)),10,5,0,4,...upload(0,quad(2)),10,5,0,4,18,3,...upload(2,Array.from({length:24},(_,i)=>i/4),19),10,4,0,6,18,1,10,5,0,4]);
 assert.equal(h.gpu.calls.bufferData,2);assert.equal(h.old.calls.bufferData,2);assert.equal(h.gpu.calls.bufferSubData,2);assert.equal(h.run.stats.commandCopies,0);
});
test('a flush between upload and draw retains geometry even when the next packet overwrites that buffer',()=>{
 const h=harness();h.packet([18,1,...upload(0,quad(10))]);h.packet([10,5,0,4,...upload(0,quad(20)),10,5,0,4]);h.packet([10,5,0,4]);
 assert.equal(h.gpu.draws.length,3);assert.deepEqual(h.gpu.draws[0].data,quad(10));
});
test('memory growth refreshes GPU views and bulk upload restores the model attribute buffer',()=>{
 const h=harness();h.packet([18,1,...upload(0,quad(1)),10,5,0,4]);h.mem.grow(1);
 h.old.bindBuffer(0x8892,h.t1[6]);h.gpu.bindBuffer(0x8892,h.t2[6]);
 h.packet([18,7,24,0,3,0x1406,0,12,0,26,4,6,0,18,1,...upload(0,quad(30)),10,5,0,4]);assert.equal(h.run.stats.memoryViews,2);
});
test('GPU decoder rejects incomplete commands, invalid ranges and unaligned vertex packets',()=>{
 const h=harness();assert.throws(()=>h.run(3,1),/range/);const i=new Int32Array(h.mem.buffer,64);i.set([9,0,5,0,0,0,0,0]);assert.throws(()=>h.run(64,8),/vertex/);i.set([30]);assert.throws(()=>h.run(64,1),/opcode/);
});
test('a growing stream keeps hundreds of ordered quads in one vertex transfer',()=>{
 const h=harness(),words=[18,1];
 for(let i=0;i<600;i++)words.push(...upload(0,quad(i)),10,5,0,4);
 h.packet(words);assert.equal(h.gpu.draws.length,600);assert.equal(h.old.calls.bufferData,600);assert.equal(h.gpu.calls.bufferData,1);assert.equal(h.gpu.calls.bufferSubData,1);
});
