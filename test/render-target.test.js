import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRenderTarget} from '../engine/webgl/render-target.js';
function harness(){
 let time=1000;const stats={},canvas={width:854,height:480},scene={},color={},depth={},grab={},texture={},savedDepth={},calls=[];
 const gl={ACTIVE_TEXTURE:1,TEXTURE_BINDING_2D:2,RENDERBUFFER_BINDING:3,TEXTURE0:10,TEXTURE_2D:11,RENDERBUFFER:12,RGBA:13,UNSIGNED_BYTE:14,DEPTH_COMPONENT24:15,active:19,textures:new Map([[10,texture]]),depth:savedDepth};
 gl.getParameter=p=>p===1?gl.active:p===2?gl.textures.get(gl.active):gl.depth;gl.activeTexture=n=>gl.active=n;gl.bindTexture=(t,n)=>gl.textures.set(gl.active,n);gl.bindRenderbuffer=(t,n)=>gl.depth=n;
 for(const name of ['texImage2D','renderbufferStorage','viewport','scissor'])gl[name]=(...args)=>calls.push([name,...args]);
 const target=createRenderTarget(gl,stats,()=>time);target.configure(canvas,scene,color,depth,grab,854,480,'auto');
 return{target,stats,canvas,scene,calls,gl,texture,savedDepth,tick(n=120){for(let i=0;i<n;i++){target.begin(true);target.end();time+=42;}}};
}
test('adaptive targets reduce backing pixels and preserve viewport/scissor coordinate coverage',()=>{
 const h=harness();h.tick();assert.equal(h.stats.renderScale,.5);assert.deepEqual(h.canvas,{width:427,height:240});
 h.target.viewport(h.scene,0,0,854,480);assert.deepEqual(h.calls.at(-1),['viewport',0,0,427,240]);
 h.target.scissor(h.scene,19,31,101,55);assert.deepEqual(h.calls.at(-1),['scissor',9,15,51,28]);
 h.target.viewport({},0,0,512,512);assert.deepEqual(h.calls.at(-1),['viewport',0,0,512,512]);
 assert.equal(h.gl.active,19);assert.equal(h.gl.textures.get(10),h.texture);assert.equal(h.gl.depth,h.savedDepth);
});
test('Sharp and custom-shader frames restore full resolution without more per-frame GL queries',()=>{
 const h=harness();h.tick();h.target.quality('sharp');h.target.begin(true);assert.equal(h.stats.renderScale,1);
 h.gl.getParameter=()=>{throw Error('hot GL query');};for(let i=0;i<20;i++)h.target.begin(true);
 const custom=harness();custom.tick();custom.target.begin(false);assert.equal(custom.stats.renderScale,1);
});
