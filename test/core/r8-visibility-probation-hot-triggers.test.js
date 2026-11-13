import test from 'node:test';
import assert from 'node:assert/strict';
import {quadVisibleInArena,visibleArenaDraws} from '../../src/core/quad-visibility.js';
import {SpriteRestoreCache} from '../../src/core/sprite-restore-cache.js';
import {FighterRuntime} from '../../src/runtime.js';

const quad=(matrix,other={})=>({
  texture:'sprite',indexed:true,palette:'palette',width:80,height:100,
  matrix,pass:1,...other,
});

test('R8 visibility rejects only wholly offscreen affine sprites',()=>{
  const inside=quad([1,0,0,1,200,100]);
  const outside=quad([1,0,0,1,1200,100]);
  const flipped=quad([-1,0,0,1,1020,120]);
  const rotated=quad([0,1,-1,0,1050,200]);
  const clipped=quad([1,0,0,1,200,100],{clip:[500,500,100,40]});
  const warped=quad([1,0,0,1,1200,100],{warp:[0,100,0,100]});
  const malformed=quad([NaN,0,0,1,1200,100]);
  assert.equal(quadVisibleInArena(inside),true);
  assert.equal(quadVisibleInArena(outside),false);
  assert.equal(quadVisibleInArena(flipped),true,'negative scale is visible');
  assert.equal(quadVisibleInArena(rotated),false,'rotated bounds are tested');
  assert.equal(quadVisibleInArena(clipped),false,'authored clip window is respected');
  assert.equal(quadVisibleInArena(warped),true,'complex warp cannot be safely culled');
  assert.equal(quadVisibleInArena(malformed),true,'invalid matrix deferred to original renderer');
  assert.equal(quadVisibleInArena(quad([1,0,0,1,960.25,100])),true,
    '1px guard band avoids fractional edge under-cull');
});

test('Visibility preserves painter order and original draw records',()=>{
  const a=quad([1,0,0,1,100,100],{texture:'a'});
  const b=quad([1,0,0,1,-400,100],{texture:'b'});
  const c=quad([1,0,0,1,500,300],{texture:'c'});
  const d=quad([1,0,0,1,1200,100],{texture:'d'});
  const input=[a,b,c,d];
  const result=visibleArenaDraws(input);
  assert.deepEqual(result.visible,[a,c]);
  assert.strictEqual(result.visible[0],a);
  assert.strictEqual(result.visible[1],c);
  assert.equal(result.culled,2);
  assert.equal(input.length,4,'source draw packet stays unmodified');
});

test('Large one-shot sprite stream consumes zero retained CPU pixel memory',()=>{
  const cache=new SpriteRestoreCache({
    maxBytes:64,requireRepeat:true,probationLimit:32,
  });
  const pixels=new Uint8Array(16).fill(8);
  for(let i=0;i<500;i++){
    assert.equal(cache.get('s'+i),null);
    assert.equal(cache.put('s'+i,pixels),false);
  }
  assert.equal(cache.bytes,0);
  assert.equal(cache.stores,0);
  assert.equal(cache.evictions,0);
  assert.equal(cache.deferredAdmissions,500);
  assert.equal(cache.probation.size,32);
  assert.equal(cache.stats.probationEntries,32);
});

test('Second-chance admission retains repeated sprites, not one-off images',()=>{
  const cache=new SpriteRestoreCache({maxBytes:32,requireRepeat:true});
  const pixels=new Uint8Array([3,4,5,6]);
  assert.equal(cache.put('reused',pixels),false);
  assert.equal(cache.stats.deferredAdmissions,1);
  assert.equal(cache.get('reused'),null);
  assert.equal(cache.put('reused',pixels),true);
  pixels[0]=99;
  assert.deepEqual([...cache.get('reused')],[3,4,5,6]);
  assert.equal(cache.promotions,1);
  assert.equal(cache.hits,1);
  assert.equal(cache.bytes,4);
  cache.clear();
  assert.equal(cache.bytes,0);
  assert.equal(cache.stats.probationEntries,0);
});

test('NumHelper/NumTarget/NumProj count live owners without allocating arrays',()=>{
  const root=Object.create(FighterRuntime.prototype);
  root.world={entities:[],projectiles:[]};
  root.root=root;root.parent=null;
  root.helpers=[];root.targets=[];root.explods=[];
  root.targetHitIds=new Map();root.coordinateScale=1;
  root.opponent={teamSide:2};root.teamSide=1;
  const h1={id:4,parent:root,root,helperId:5,destroyed:false};
  const h2={id:5,parent:root,root,helperId:5,destroyed:false};
  const h3={id:6,parent:root,root,helperId:8,destroyed:true};
  const another={id:7,parent:{},root:{},helperId:5,destroyed:false};
  root.world.entities=[root,h1,h2,h3,another];
  const t1={id:20,hitId:8,destroyed:false};
  const t2={id:21,hitId:8,destroyed:false};
  const t3={id:22,hitId:12,destroyed:true};
  root.targets=[t1,t2,t3];
  root.targetHitIds.set(21,9);
  root.explods=[{id:4},{id:4},{id:7}];
  root.world.projectiles=[
    {owner:root,projId:3,removing:false,removed:false},
    {owner:root,projId:3,removing:false,removed:true},
    {owner:root,projId:4,removing:false,removed:false},
    {owner:{},projId:3,removing:false,removed:false},
  ];
  assert.equal(root.countOwnedHelpers(),2);
  assert.equal(root.countOwnedHelpers(5),2);
  assert.equal(root.countOwnedHelpers(8),0);
  assert.equal(root.resolveTrigger('numhelper'),2);
  assert.equal(root.resolveTrigger('numhelper',[5]),2);
  assert.equal(root.resolveTrigger('numhelper',[0]),2);
  assert.equal(root.resolveTrigger('numtarget'),2);
  assert.equal(root.resolveTrigger('numtarget',[8]),1);
  assert.equal(root.resolveTrigger('numtarget',[9]),1);
  assert.equal(root.resolveTrigger('numtarget',[-1]),2);
  assert.equal(root.resolveTrigger('numproj'),2);
  assert.equal(root.resolveTrigger('numprojid',[3]),1);
  assert.equal(root.resolveTrigger('numexplod',[4]),2);
});
