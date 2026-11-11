import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sff} from '../../src/formats.js';
import {compactSffV1Preview} from '../../src/core/large-sff-preview.js';

function pcx(withPalette){
 const bytes=new Uint8Array(128+1+(withPalette?769:0));
 bytes[0]=10;bytes[1]=5;bytes[2]=1;bytes[3]=8;
 bytes[65]=1;bytes[66]=1;bytes[128]=1;
 if(withPalette){bytes[129]=12;bytes[133]=255;}
 return bytes;
}
function sffFixture(){
 const base=pcx(true),idle=pcx(false),first=512,second=first+32+base.length;
 const bytes=new Uint8Array(second+32+idle.length);
 bytes.set(new TextEncoder().encode('ElecbyteSpr\0'));
 bytes[15]=1;
 const v=new DataView(bytes.buffer);
 v.setUint32(16,2,true);v.setUint32(20,2,true);v.setUint32(24,first,true);v.setUint32(28,32,true);
 v.setUint32(first,second,true);v.setUint32(first+4,base.length,true);
 v.setUint16(first+12,9000,true);bytes.set(base,first+32);
 v.setUint32(second,bytes.length,true);v.setUint32(second+4,idle.length,true);
 v.setUint16(second+12,0,true);v.setUint16(second+14,0,true);
 bytes[second+18]=1;bytes.set(idle,second+32);
 return bytes;
}
test('large SFF v1 menu preview uses only a bounded prefix and retains palette',async()=>{
 const original=sffFixture();
 const huge=new Blob([original,new Uint8Array(16*1024*1024)]);
 const prefix=await compactSffV1Preview(huge);
 assert.equal(prefix.length,original.length);
 assert.equal(new DataView(prefix.buffer).getUint32(20,true),2);
 const bank=sff(prefix);
 assert.equal(bank.version,1);assert.equal(bank.sprites.length,2);
 assert.equal(bank.sprites[1].group,0);assert.equal(bank.sprites[1].number,0);
 const rgba=bank.decode(1).rgba;
 assert.equal(rgba[0],255);assert.equal(rgba[3],255);
 bank.clearDecodedCache();
});
test('large SFF preview rejects unsupported formats and invalid headers',async()=>{
 const bad=sffFixture();bad[15]=2;
 assert.equal(await compactSffV1Preview(new Blob([bad])),null);
 assert.equal(await compactSffV1Preview(new Blob([new Uint8Array(1024)])),null);
 assert.equal(await compactSffV1Preview(null),null);
});
