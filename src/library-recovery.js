const databases=['kenjatime.engine.library','kenjatime.archives'];

export function libraryDeadline(promise,message,timeout=8000,onTimeout=()=>{}){
 return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{onTimeout();reject(Error(message));},timeout);Promise.resolve(promise).then(value=>{clearTimeout(timer);resolve(value);},error=>{clearTimeout(timer);reject(error);});});
}

export function libraryResetURL(href=location.href){const url=new URL(href);url.searchParams.set('reset-library','1');return url.href;}

export async function purgeLibraryStorage(storage=globalThis.indexedDB){
 if(!storage)throw Error('Library storage is unavailable.');
 await Promise.all(databases.map(name=>libraryDeadline(new Promise((resolve,reject)=>{
  const request=storage.deleteDatabase(name);
  request.onsuccess=()=>resolve();request.onerror=()=>reject(request.error||Error('The library could not be reset.'));
 }), 'Close other Kenjatime windows, then try Reset library again.')));
 try{localStorage.removeItem('kenjatime.native.selection');}catch{}
}
