import {MAX_ARCHIVE_BYTES} from './archive-limits.js';

/** Store original archive Blobs on disk; no base64 copy or character media in localStorage. */
export class ArchiveLibrary{
  constructor(indexedDB=globalThis.indexedDB){this.indexedDB=indexedDB;this.pending=null;}
  open(){
    if(!this.pending)this.pending=new Promise((resolve,reject)=>{
      if(!this.indexedDB){reject(Error('Local library storage is unavailable.'));return;}
      const request=this.indexedDB.open('kenjatime.archives',1);
      request.onupgradeneeded=()=>{for(const name of ['archives','metadata'])request.result.createObjectStore(name,{keyPath:'id'});};
      request.onerror=()=>reject(request.error);
      request.onblocked=()=>reject(Error('Close other Kenjatime windows and reopen the library.'));
      request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>{db.close();this.pending=null;};resolve(db);};
    }).catch(error=>{this.pending=null;throw error;});
    return this.pending;
  }
  async operation(mode,operation,storeName='archives'){
    const db=await this.open();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(storeName,mode),request=operation(tx.objectStore(storeName));let result;
      request.onsuccess=()=>{result=request.result;};
      tx.oncomplete=()=>resolve(result);tx.onabort=tx.onerror=()=>reject(tx.error||request.error||Error('Library storage failed.'));
    });
  }
  async save(file,{stageOnly=false}={}){
    if(file.size>MAX_ARCHIVE_BYTES)throw Error('Archive exceeds the import size limit.');
    // Name/size/time identify repeated imports without hashing another large buffer.
    const id=JSON.stringify([file.name,file.size,file.lastModified||0,stageOnly]);
    const metadata={id,name:file.name,size:file.size,lastModified:file.lastModified||0,stageOnly,savedAt:Date.now()};
    const db=await this.open();
    await new Promise((resolve,reject)=>{
      const tx=db.transaction(['archives','metadata'],'readwrite');
      tx.objectStore('archives').put({id,metadata,blob:file});tx.objectStore('metadata').put(metadata);
      tx.oncomplete=resolve;tx.onabort=tx.onerror=()=>reject(tx.error||Error('Library storage failed.'));
    });return metadata;
  }
  async list(){
    // List metadata without materializing every stored archive Blob.
    return(await this.operation('readonly',store=>store.getAll(),'metadata')).sort((a,b)=>b.savedAt-a.savedAt);
  }
  async read(id){const row=await this.operation('readonly',store=>store.get(id));if(!row)throw Error('This archive is no longer in the library.');return{...row.metadata,file:new File([row.blob],row.metadata.name,{lastModified:row.metadata.lastModified})};}
  async remove(id){
    const db=await this.open();return new Promise((resolve,reject)=>{
      const tx=db.transaction(['archives','metadata'],'readwrite');for(const name of ['archives','metadata'])tx.objectStore(name).delete(id);
      tx.oncomplete=resolve;tx.onabort=tx.onerror=()=>reject(tx.error||Error('Library delete failed.'));
    });
  }
}

export function mountArchiveLibrary({host,library=new ArchiveLibrary(),onOpen}){
  host.innerHTML='<details class="mobile-library"><summary>Saved on this device <span id="library-count">0</span></summary><label><input id="library-remember" type="checkbox" checked> Keep imported archives in this app</label><p id="library-status" role="status">Your files stay on this device. Open a saved archive to add it to the current session.</p><div id="library-items"></div></details>';
  const list=host.querySelector('#library-items'),status=host.querySelector('#library-status'),remember=host.querySelector('#library-remember');let busy=false;
  async function refresh(){
    const rows=await library.list();host.querySelector('#library-count').textContent=rows.length;list.replaceChildren();
    for(const row of rows){
      const item=document.createElement('div'),name=document.createElement('span'),open=document.createElement('button'),remove=document.createElement('button');
      item.className='library-item';name.textContent=`${row.name} · ${(row.size/1048576).toFixed(1)} MB`;open.textContent='Open';remove.textContent='Delete';open.className=remove.className='secondary';remove.setAttribute('aria-label',`Delete ${row.name}`);
      open.onclick=()=>run(async()=>{const saved=await library.read(row.id);await onOpen(saved.file,{stageOnly:saved.stageOnly});});
      remove.onclick=()=>run(async()=>{await library.remove(row.id);await refresh();status.textContent='Archive deleted from this app. The source file is unchanged.';});
      item.append(name,open,remove);list.append(item);
    }
  }
  async function run(action){
    if(busy)return;busy=true;list.querySelectorAll('button').forEach(button=>{button.disabled=true;});
    try{await action();}catch(error){status.textContent=`Library: ${error.message}`;}finally{busy=false;list.querySelectorAll('button').forEach(button=>{button.disabled=false;});}
  }
  window.addEventListener('kenjatime:archive-imported',event=>{
    if(!remember.checked||event.detail.fromLibrary)return;
    const {file,stageOnly}=event.detail;
    void library.save(file,{stageOnly}).then(()=>refresh()).then(()=>{status.textContent='Archive saved on this device.';}).catch(()=>{status.textContent='The archive was imported for this session, but could not be saved. Free device storage and try again.';});
  });
  void refresh().catch(error=>{status.textContent=`Library: ${error.message} You can still import files for this session.`;});
}
