import {Filesystem,Directory} from '@capacitor/filesystem';
import {Share} from '@capacitor/share';

export async function shareFile(blob,name){
  const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);reader.onerror=()=>reject(reader.error);reader.readAsDataURL(blob);});
  const path=`exports/${name}`;
  const {uri}=await Filesystem.writeFile({path,data,directory:Directory.Cache,recursive:true});
  await Share.share({title:name,files:[uri],dialogTitle:'Save or share file'});
}
