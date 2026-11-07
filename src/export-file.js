/** Native exports use Android's share sheet; browser downloads keep their existing path. */
export async function exportFile(blob,name){
  name=String(name||'archive').normalize('NFC').split(/[\\/]/).at(-1).replace(/[\u0000-\u001f\u007f]/g,'').trim();if(!name||/^\.+$/.test(name))name='archive';
  if(document.body.dataset.mobileApp==='true'&&window.Capacitor?.isNativePlatform()){
    const {shareFile}=await import('./native-export.js');
    return shareFile(blob,name);
  }
  const url=URL.createObjectURL(blob),link=document.createElement('a');
  link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
