/** Native exports use Android's share sheet; browser downloads keep their existing path. */
export async function exportFile(blob,name){
  if(document.body.dataset.mobileApp==='true'&&window.Capacitor?.isNativePlatform()){
    const {shareFile}=await import('./native-export.js');
    return shareFile(blob,name);
  }
  const url=URL.createObjectURL(blob),link=document.createElement('a');
  link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
