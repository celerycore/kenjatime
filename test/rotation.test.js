import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spriteRotation} from '../src/rendering.js';

const close=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-10,`${actual} != ${expected}`);
function point(matrix,x,y){return{x:matrix.a*x+matrix.c*y,y:matrix.b*x+matrix.d*y};}

test('Zero tilt preserves the existing counterclockwise Canvas Z rotation',()=>{
  assert.deepEqual(spriteRotation(),{a:1,b:0,c:0,d:1});
  assert.deepEqual(spriteRotation(90),{a:0,b:-1,c:1,d:0});
  const p=point(spriteRotation(30),10,20);close(p.x,10*Math.cos(Math.PI/6)+10);close(p.y,-5+20*Math.cos(Math.PI/6));
});

test('X/Y quarter turns collapse edge-on planes and half turns show the texture backside',()=>{
  assert.deepEqual(spriteRotation(0,90,0),{a:1,b:0,c:0,d:0});
  assert.deepEqual(spriteRotation(0,0,90),{a:0,b:0,c:0,d:1});
  assert.deepEqual(point(spriteRotation(0,180,0),7,11),{x:7,y:-11});
  assert.deepEqual(point(spriteRotation(0,0,180),7,11),{x:-7,y:11});
});

test('Combined 3D axes retain cross-axis shear instead of independent cosine scales',()=>{
  const p=point(spriteRotation(0,60,60),20,0);close(p.x,10);close(p.y,15);
  const reversed=point(spriteRotation(0,60,-60),20,0);close(reversed.x,10);close(reversed.y,-15);
});

test('Projected sprite points match independent 3D rotations in Z, Y, X order',()=>{
  for(const [z,x,y]of [[35,20,55],[-120,150,-35],[0,45,45],[300,-80,190]]){
    const radians=v=>v*Math.PI/180,[cz,sz,cx,sx,cy,sy]=[Math.cos(radians(z)),Math.sin(radians(z)),Math.cos(radians(x)),Math.sin(radians(x)),Math.cos(radians(y)),Math.sin(radians(y))];
    for(const [u,v]of [[-8,-12],[13,-12],[13,9],[-8,9]]){
      // Work in conventional Y-up coordinates and project back into Canvas Y-down coordinates.
      const rz={x:cz*u+sz*v,y:sz*u-cz*v,z:0};
      const ry={x:cy*rz.x+sy*rz.z,y:rz.y,z:-sy*rz.x+cy*rz.z};
      const rx={x:ry.x,y:cx*ry.y+sx*ry.z,z:-sx*ry.y+cx*ry.z};
      const actual=point(spriteRotation(z,x,y),u,v);close(actual.x,rx.x);close(actual.y,-rx.y);
    }
  }
});

test('Angle wrapping is periodic and remains finite for very large finite values',()=>{
  const a=spriteRotation(35,40,-55),b=spriteRotation(35+360*100,40-360*100,-55+360*200);
  for(const key of ['a','b','c','d'])close(a[key],b[key]);
  const huge=spriteRotation(1e300,-1e300,Number.MAX_VALUE);assert.ok(Object.values(huge).every(Number.isFinite));
  for(const bad of [NaN,Infinity,'45',[45],null])assert.throws(()=>spriteRotation(0,bad,0),/finite numbers/);
});

test('Projection area tracks the visible plane normal and survives reversals past 90 degrees',()=>{
  for(const [z,x,y]of [[0,20,30],[45,90,20],[60,120,-40],[180,180,180]]){
    const r=spriteRotation(z,x,y);close(r.a*r.d-r.b*r.c,Math.cos(x*Math.PI/180)*Math.cos(y*Math.PI/180));
  }
  assert.ok(spriteRotation(0,0,100).a<0);assert.ok(spriteRotation(0,100,0).d<0);
});
