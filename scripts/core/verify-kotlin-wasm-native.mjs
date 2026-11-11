/**
 * Loads the actual Kotlin/Wasm executable module, not the JS reference shim.
 * Invoked only after Gradle wasmJsNodeDevelopmentRun has compiled build output.
 */
import {readFileSync,readdirSync,statSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {adaptKotlinWasmCombatModule} from '../../src/core/kotlin-wasm-combat.js';

const base=resolve(process.argv[2]||'kotlin-engine/build');
const matches=[];
function walk(dir,depth=0){
  if(depth>12)return;
  for(const item of readdirSync(dir)){
    const name=join(dir,item),info=statSync(name);
    if(info.isDirectory())walk(name,depth+1);
    else if(item.endsWith('.mjs')&&!item.includes('.test.'))matches.push(name);
  }
}
walk(base);
if(!matches.length)throw Error('Gradle produced no importable .mjs files in '+base);
const reports=[];
let found=null;
for(const filename of matches.sort()){
  try{
    const module=await import(pathToFileURL(filename).href);
    const raw=module?.default&&typeof module.default.createCombatKernel==='function'?module.default:module;
    reports.push({filename,exports:Object.keys(raw||{}).slice(0,30)});
    if(typeof raw?.createCombatKernel==='function'){found=module;break;}
  }catch(error){reports.push({filename,error:String(error?.message||error)});}
}
if(!found)throw Error('Kotlin/Wasm build did not expose combat ABI: '+JSON.stringify(reports).slice(0,6000));

const backend=adaptKotlinWasmCombatModule(found);
assert.equal(backend.kind,'kotlin-wasm-combat-v2');
const kernel=backend.createProjectileKernel(10);
kernel.clear();
kernel.add(0,0,10,10,1,false,false);
kernel.add(9,2,20,7,2,false,false);
kernel.add(30,0,40,10,2,false,false);
kernel.add(10,0,15,10,2,false,false);
assert.equal(kernel.collect(false),1);
assert.deepEqual([kernel.left(0),kernel.right(0)],[0,1]);
assert.equal(kernel.collect(true),2);
assert.deepEqual([kernel.left(0),kernel.right(0)],[0,1]);
assert.deepEqual([kernel.left(1),kernel.right(1)],[0,3]);
assert.equal(kernel.phaseMask(true,true,true,false,false,false),63);
assert.equal(kernel.phaseMask(false,false,false,true,false,false),33);
assert.equal(kernel.dispose(),true);
assert.equal(kernel.dispose(),false);
assert.throws(()=>kernel.collect(false),/disposed/);
console.log(JSON.stringify({status:'pass',kind:backend.kind,module:reports.at(-1).filename,
  checks:['narrowphase candidate ABI','strict/inclusive edges','global schedule','handle cleanup']},null,2));
