import {createRenderTarget} from './render-target.js';
// Kenjatime WebGL2 submission backend. The Go simulation owns command order.
// No async work is allowed while reading a live WASM memory view.
const words=[0,2,3,3,4,5,6,18,3,0,4,2,2,2,3,5,2,2,2,0,3,2,10,11,7,6,4,4,2,2,3,3,5,2,1,2];
const ARRAY=0x8892,STREAM=0x88e0;

export function createWebGLSubmitter(gl,memory,objects){
 let buffer,i32,f32,offsets=new Int32Array(65536),epoch=0,bound=null,vao=null,framebuffer=null;
 const pools=new Map(),vaoBuffers=new Map(),touched=[];
 const stats={backend:'Kenjatime WebGL2',submissions:0,commandBytes:0,commandCopies:0,vertexUploads:0,vertexBytes:0,presents:0,memoryViews:0,vertexReallocations:0};
 const target=createRenderTarget(gl,stats);
 function views(){if(buffer===memory.buffer)return;buffer=memory.buffer;i32=new Int32Array(buffer);f32=new Float32Array(buffer);stats.memoryViews++;}
 function pool(id){let p=pools.get(id);if(!p){p={id,data:new Float32Array(4096),used:0,lastOffset:0,lastCount:0,currentBase:0,epoch:0,gpuCapacity:0,slot:0,base:0};pools.set(id,p);}return p;}
 function size(p,n){if(p.data.length>=n)return;let cap=p.data.length;while(cap<n)cap*=2;const next=new Float32Array(cap);next.set(p.data.subarray(0,p.used));p.data=next;}
 function prepare(start,end){
  epoch++;touched.length=0;
  if(offsets.length<end-start)offsets=new Int32Array(end-start);
  for(let p=start;p<end;){
   const at=p,op=i32[p],fixed=words[op];
   if(op===9||op===19){
    if(p+3>end)throw Error('Invalid GPU vertex packet');
    const id=i32[p+1],n=i32[p+2],v=pool(id);
    if(n<0||n%4||p+3+n>end)throw Error('Invalid GPU vertex packet');
    if(v.epoch!==epoch){
     // The previous buffer contents can be drawn before this stream's first
     // upload (including a capacity flush between upload and draw).
     v.data.copyWithin(0,v.lastOffset,v.lastOffset+v.lastCount);v.used=v.lastCount;v.currentBase=0;v.epoch=epoch;touched.push(v);
    }
    size(v,v.used+n);offsets[at-start]=v.used;
    for(let i=0;i<n;i++)v.data[v.used+i]=f32[p+3+i];
    v.lastOffset=v.used;v.lastCount=n;v.used+=n;p+=3+n;
   }else{if(!fixed||p+fixed>end)throw Error('Invalid GPU opcode '+op);p+=fixed;}
  }
  if(!touched.length)return;
  // State is mirrored at command execution and at the Go escape hatch.
  // Never query GL in the hot path: mobile drivers may synchronize queries.
  for(const v of touched){
   gl.bindBuffer(ARRAY,objects[v.id]);
   if(v.gpuCapacity!==v.data.length){
    v.gpuCapacity=v.data.length;v.slot=0;
    gl.bufferData(ARRAY,v.gpuCapacity*4*3,STREAM);stats.vertexReallocations++;
   }else v.slot=(v.slot+1)%3;
   v.base=v.slot*v.gpuCapacity;v.currentBase=v.base/4;
   gl.bufferSubData(ARRAY,v.base*4,v.data,0,v.used);
   stats.vertexUploads++;stats.vertexBytes+=v.used*4;
  }
  gl.bindBuffer(ARRAY,bound);
 }
 function submit(ptr,n){
  views();const start=ptr>>>2,end=start+n;
  if((ptr&3)||n<0||end>i32.length)throw Error('Invalid GPU command range');
  prepare(start,end);
  let p=start;
  while(p<end){const at=p,op=i32[p++];switch(op){
   case 1:gl.useProgram(objects[i32[p++]]);break;
   case 2:gl.uniform1i(objects[i32[p++]],i32[p++]);break;
   case 3:gl.uniform1f(objects[i32[p++]],f32[p++]);break;
   case 4:gl.uniform2f(objects[i32[p++]],f32[p++],f32[p++]);break;
   case 5:gl.uniform3f(objects[i32[p++]],f32[p++],f32[p++],f32[p++]);break;
   case 6:gl.uniform4f(objects[i32[p++]],f32[p++],f32[p++],f32[p++],f32[p++]);break;
   case 7:gl.uniformMatrix4fv(objects[i32[p++]],false,f32,p,16);p+=16;break;
   case 8:gl.activeTexture(0x84c0+i32[p++]);gl.bindTexture(0x0de1,objects[i32[p++]]);break;
   case 9:case 19:{
    const id=i32[p++],n=i32[p++],v=pool(id),object=objects[id];v.currentBase=(v.base+offsets[at-start])/4;
    if(bound!==object){gl.bindBuffer(ARRAY,object);bound=object;}
    vaoBuffers.set(vao,id);p+=n;break;
   }
   case 10:{const mode=i32[p++],first=i32[p++],count=i32[p++],id=vaoBuffers.get(vao);gl.drawArrays(mode,first+(id===undefined?0:pool(id).currentBase),count);break;}
   case 11:gl.enable(i32[p++]);break;
   case 12:gl.disable(i32[p++]);break;
   case 13:gl.blendEquation(i32[p++]);break;
   case 14:gl.blendFunc(i32[p++],i32[p++]);break;
   case 15:target.scissor(framebuffer,i32[p++],i32[p++],i32[p++],i32[p++]);break;
   case 16:gl.depthMask(i32[p++]!==0);break;
   case 17:gl.depthFunc(i32[p++]);break;
   case 18:vao=objects[i32[p++]];gl.bindVertexArray(vao);break;
   case 20:gl.texParameteri(0x0de1,i32[p++],i32[p++]);break;
   case 21:gl.activeTexture(0x84c0+i32[p++]);break;
   case 22:gl.uniform4fv(objects[i32[p++]],f32,p,8);p+=8;break;
   case 23:gl.uniformMatrix3fv(objects[i32[p++]],false,f32,p,9);p+=9;break;
   case 24:gl.vertexAttribPointer(i32[p++],i32[p++],i32[p++],i32[p++]!==0,i32[p++],i32[p++]);break;
   case 25:{const a=i32[p++];gl.disableVertexAttribArray(a);gl.vertexAttrib4f(a,f32[p++],f32[p++],f32[p++],f32[p++]);break;}
   case 26:gl.drawElements(i32[p++],i32[p++],0x1405,i32[p++]);break;
   case 27:gl.activeTexture(0x84c0+i32[p++]);gl.bindTexture(i32[p++],objects[i32[p++]]);break;
   case 28:gl.frontFace(i32[p++]);break;
   case 29:gl.enableVertexAttribArray(i32[p++]);break;
   case 30:{const target=i32[p++],object=objects[i32[p++]];gl.bindBuffer(target,object);if(target===ARRAY)bound=object;break;}
   case 31:{const binding=i32[p++],object=objects[i32[p++]];if(binding!==0x8ca8)framebuffer=object;gl.bindFramebuffer(binding,object);break;}
   case 32:target.viewport(framebuffer,i32[p++],i32[p++],i32[p++],i32[p++]);break;
   case 33:gl.clear(i32[p++]);break;
   case 34:stats.presents++;target.end();break;
   case 35:target.begin(i32[p++]!==0);break;
   default:throw Error('Invalid GPU opcode '+op);
  }}
  stats.submissions++;stats.commandBytes+=n*4;
 }
 submit.targets=target.configure;submit.quality=target.quality;
 submit.direct=(name,...args)=>{if(name==='readPixels')return target.readPixels(...args);if(name==='viewport')return target.viewport(framebuffer,...args);if(name==='scissor')return target.scissor(framebuffer,...args);if(name==='bindFramebuffer'&&args[0]!==0x8ca8)framebuffer=args[1];if(name==='bindVertexArray')vao=args[0];if(name==='bindBuffer'&&args[0]===ARRAY)bound=args[1];return gl[name](...args);};
 submit.stream=(vao,id)=>{vaoBuffers.set(vao,id);pool(id);};
 submit.present=(scene,width,height,x,y,w,h,linear)=>{
  gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,null);gl.clear(gl.COLOR_BUFFER_BIT);
  gl.bindFramebuffer(gl.READ_FRAMEBUFFER,scene);
  gl.blitFramebuffer(0,0,width,height,x,y,x+w,y+h,gl.COLOR_BUFFER_BIT,linear?gl.LINEAR:gl.NEAREST);
  gl.bindFramebuffer(gl.READ_FRAMEBUFFER,null);stats.presents++;
 };
 submit.stats=stats;return submit;
}
