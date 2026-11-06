import {mountSetup} from './native-setup.js';
let serial=0;const pending=new Map();
window.__kenjatimeNativeResult=result=>{const call=pending.get(result.id);if(!call)return;pending.delete(result.id);result.error?call.reject(Error(result.error)):call.resolve(result.data);};
mountSetup({
 request(action,data={}){return new Promise((resolve,reject)=>{
  const id=++serial;pending.set(id,{resolve,reject});window.KenjatimeNative.request(JSON.stringify({id,action,...data}));
 });},
 resource(path){return fetch(new URL('/game/'+path.split('/').map(encodeURIComponent).join('/'),location.href));}
});
