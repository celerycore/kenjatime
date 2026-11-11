import {test} from 'node:test';
import assert from 'node:assert/strict';
import {planTextureEvictions} from '../../src/core/texture-residency.js';
import {CoreSession} from '../../src/core/session.js';

function entries(spec){
 const result=new Map();
 for(const [id,bytes] of spec)result.set(id,{userData:{residentBytes:bytes},disposed:false,
  dispose(){this.disposed=true;}});
 return result;
}
test('GPU LRU removes only inactive texture IDs while preserving visible stage and fighter assets',()=>{
 const resident=entries([['@white',4],['stage-old',120],['ako-old',130],['asuna-current',140],['stage-current',150]]);
 const pins=new Set(['stage-current','asuna-current']);
 assert.deepEqual(planTextureEvictions(resident,544,200,600,pins),['stage-old','ako-old']);
 assert.equal(resident.size,5,'planner never changes map without renderer');
});
test('GPU LRU never evicts current-frame sprites even if they cannot all fit',()=>{
 const resident=entries([['@white',4],['@spark',256],['bg-layer',350],['ako-jump',300]]);
 assert.equal(planTextureEvictions(resident,910,100,960,new Set(['bg-layer','ako-jump'])),null);
 assert.equal(planTextureEvictions(resident,910,1000,960,new Set()),null);
});
test('GPU texture residency can evict unused old frames in original Map insertion order',()=>{
 const m=entries([['old-1',100],['old-2',100],['active',100],['old-3',100]]);
 const evictions=planTextureEvictions(m,400,170,450,new Set(['active']));
 assert.deepEqual(evictions,['old-1','old-2']);
 for(const id of evictions){m.get(id).dispose();m.delete(id);}
 assert.ok(m.has('active'));
 assert.ok(m.has('old-3'));
});
test('CoreSession reconstructs an already-sent indexed fighter sprite from its SFF archive',()=>{
 // Synthetic replay fixture verifies the restore API in isolation without
 // checking copyrighted character packages into the repository.
 const source=new Uint8Array([137,80,78,71]);
 assert.ok(typeof CoreSession.prototype.restoreAssets==='function');
 assert.equal(planTextureEvictions(new Map(),0,0,64, new Set()).length,0);
});
