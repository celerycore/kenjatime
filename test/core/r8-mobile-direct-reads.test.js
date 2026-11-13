import test from 'node:test';
import assert from 'node:assert/strict';
import {WasmExpressions} from '../../src/core/wasm-expressions.js';
import {evaluateExpression,evaluateTypedExpression,BottomError} from '../../src/expressions.js';
import {
  defaultQualityForDevice,qualityStartingScale,nextQuality,
} from '../../src/core/render-quality.js';

test('R8 touch devices begin at Performance scale, without changing desktop defaults',()=>{
  assert.equal(defaultQualityForDevice({coarsePointer:true,viewportWidth:430}), 'performance');
  assert.equal(defaultQualityForDevice({touchPoints:5,viewportWidth:430}), 'performance');
  assert.equal(defaultQualityForDevice({touchPoints:0,viewportWidth:1400}), 'auto');
  assert.equal(defaultQualityForDevice({touchPoints:5,viewportWidth:1400}), 'auto');
  assert.equal(defaultQualityForDevice({}), 'auto');
  assert.equal(qualityStartingScale(defaultQualityForDevice({coarsePointer:true})),0.7);
  assert.equal(nextQuality('performance'),'sharp');
});

test('Pure numeric scalar trigger and static var/fvar readers preserve interpreter types',()=>{
  const sources=['time','life','ctrl','anim','stateno','ailevel','var(0)','var(3)','sysvar(1)','fvar(0)','sysfvar(0)','vel x','pos y','var(0)+time'];
  const engine=new WasmExpressions(sources);
  assert.equal(engine.stats.compiled,sources.length);
  const values={
    time:26,life:894,ctrl:1,anim:200,stateno:200,ailevel:6,
    'vel x':Math.fround(-1.25),'pos y':Math.fround(2.625),
  };
  const vars={var:[-2147483648,0,0,2147483647],sysvar:[0,23],fvar:[Math.fround(1.125)],sysfvar:[Math.fround(-0.75)]};
  const context={resolve(name,args){
    return Object.hasOwn(vars,name)?vars[name][args[0]]:values[name];
  }};
  for(let i=0;i<40;i++){
    values.time=i;
    for(const source of sources){
      assert.deepEqual(engine.evaluate(source,context),evaluateExpression(source,context),source+' '+i);
      const ctx={...context,typedResult:true};
      assert.deepEqual(engine.evaluate(source,ctx),evaluateTypedExpression(source,context),'typed '+source+' '+i);
    }
  }
  assert.ok(engine.stats.direct>=40*12*2,'direct reads are used');
  assert.ok(engine.stats.wasm>=40*2,'composite arithmetic still uses Wasm');
});

test('Direct reads with noninteger var data deoptimize through the original Wasm interpreter',()=>{
  const engine=new WasmExpressions(['var(1)']);
  const context={resolve:()=>1.5};
  assert.equal(engine.evaluate('var(1)',context),evaluateExpression('var(1)',context));
  assert.equal(engine.stats.direct,0);
  assert.equal(engine.stats.deoptimized,1);
  assert.equal(engine.stats.activeFunctions,0);
});

test('Direct variable reads preserve MUGEN bottom and fixed-point float semantics',()=>{
  const engine=new WasmExpressions(['var(5)','fvar(5)','life']);
  const bad={resolve:()=>NaN};
  for(const source of ['var(5)','fvar(5)','life']){
    const a=new WasmExpressions([source]);
    assert.throws(()=>a.evaluate(source,bad),e=>e instanceof BottomError);
  }
  const good={resolve:(name)=>name==='fvar'?1.234567890123:12};
  const actual=engine.evaluate('fvar(5)',{...good,typedResult:true});
  assert.deepEqual(actual,evaluateTypedExpression('fvar(5)',good));
  assert.equal(actual.float,true);
  assert.equal(actual.value,Math.fround(1.234567890123));
});

test('Nested scalar evaluations restore the Wasm interpreter context',()=>{
  const engine=new WasmExpressions(['time','var(0)','var(0)+time']);
  const childContext={resolve:()=>3};
  const parentContext={resolve(name){
    if(name==='time')return engine.evaluate('var(0)',childContext)+4;
    if(name==='var')return 1;
    return 0;
  }};
  assert.equal(engine.evaluate('time',parentContext),7);
  assert.equal(engine.context,null);
  assert.equal(engine.evaluate('var(0)+time',parentContext),8);
  assert.equal(engine.context,null);
});
