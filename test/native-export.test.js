import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {shareFile} from '../src/native-export.js';

test('native archive exports preserve bytes through bounded bridge chunks before sharing',async()=>{
 const original=Uint8Array.from({length:800123},(_,i)=>i*37%256),written=[];let largest=0,shared=false;
 const filesystem={async writeFile({data}){assert.equal(data,'');return{uri:'content://test/archive.7z'};},async appendFile({data}){written.push(Buffer.from(data,'base64'));}};
 await shareFile(new Blob([original]),'archive.7z',{filesystem,encodeChunk:async blob=>{largest=Math.max(largest,blob.size);return Buffer.from(await blob.arrayBuffer()).toString('base64');},share:{async share({files}){assert.equal(written.reduce((n,b)=>n+b.length,0),original.length);assert.deepEqual(files,['content://test/archive.7z']);shared=true;}}});
 assert.ok(shared);assert.ok(largest<=262144);assert.equal(createHash('sha256').update(Buffer.concat(written)).digest('hex'),createHash('sha256').update(original).digest('hex'));
});
test('a failed native export removes partial output and does not share it',async()=>{
 let deleted=false,shared=false;
 await assert.rejects(()=>shareFile(new Blob(['archive']),'archive.rar',{filesystem:{async writeFile(){return{uri:'test'};},async appendFile(){throw Error('No space');},async deleteFile(){deleted=true;}},encodeChunk:async()=>'',share:{async share(){shared=true;}}}),/No space/);
 assert.ok(deleted);assert.equal(shared,false);
});
