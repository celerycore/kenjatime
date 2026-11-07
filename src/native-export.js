import {Filesystem,Directory} from '@capacitor/filesystem';
import {Share} from '@capacitor/share';
import {Capacitor,registerPlugin} from '@capacitor/core';
const device=registerPlugin('ArenaDevice');

const encode=blob=>new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);reader.onerror=()=>reject(reader.error);reader.readAsDataURL(blob);});
export async function shareFile(blob,name,{filesystem=Filesystem,share=Share,encodeChunk=encode}={}){
  const path=`exports/${name}`;
  const {uri}=await filesystem.writeFile({path,data:'',directory:Directory.Cache,recursive:true});
  try{
    // Large RAR/7z exports must not create a base64 copy of the whole archive
    // on the phone. Each bridge message contains at most 256 KiB of bytes.
    for(let offset=0;offset<blob.size;offset+=262144){const data=await encodeChunk(blob.slice(offset,offset+262144));await filesystem.appendFile({path,data,directory:Directory.Cache});}
  }catch(error){await filesystem.deleteFile({path,directory:Directory.Cache}).catch(()=>{});throw error;}
  if(Capacitor.isNativePlatform()&&Capacitor.isPluginAvailable('ArenaDevice'))await device.saveArchive({uri,name});
  else await share.share({title:name,files:[uri],dialogTitle:'Save or share file'});
}
