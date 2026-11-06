import './main.js';
import './mobile.css';
import {Capacitor,registerPlugin} from '@capacitor/core';
import {mountArchiveLibrary} from './mobile-library.js';

const native=Capacitor.isNativePlatform(),device=registerPlugin('ArenaDevice'),$=selector=>document.querySelector(selector);
document.body.classList.add('mobile-app');document.title='Kenjatime';$('.brand small').textContent='KENJATIME';
const libraryHost=document.createElement('section');$('.roster').before(libraryHost);
mountArchiveLibrary({host:libraryHost,onOpen:async(file,options)=>{
  window.dispatchEvent(new CustomEvent('kenjatime:open-archive',{detail:{file,...options,fromLibrary:true}}));
}});
const bar=document.createElement('div');bar.className='mobile-battle-bar';
bar.innerHTML='<button type="button" class="secondary" id="mobile-menu">Menu</button><button type="button" class="secondary" id="mobile-pause">Pause</button>';
$('.viewer').append(bar);
const enter=document.createElement('button');enter.className='secondary';enter.id='mobile-enter';enter.textContent='Full screen fight';$('.arena-launch').append(enter);
let battle=false;
const isPlaying=()=>$('#play').getAttribute('aria-label')==='Pause';
function pause(){if(isPlaying())$('#play').click();$('#mobile-pause').textContent='Resume';}
async function syncDevice(){
  if(native)try{await device.setBattleMode({enabled:battle,awake:battle&&isPlaying()});}catch(error){$('#status').textContent=`Screen mode: ${error.message}`;}
}
function setBattle(enabled){
  battle=enabled;document.body.classList.toggle('mobile-battle',battle);
  if(!battle){pause();$('.arena-launch').scrollIntoView({block:'start'});}
  $('#mobile-pause').textContent=isPlaying()?'Pause':'Resume';void syncDevice();window.dispatchEvent(new Event('resize'));
}
$('#mobile-enter').onclick=()=>{if($('#name').textContent==='No fighter selected')return;$('#training').click();setBattle(true);};
$('#fight-now').addEventListener('click',()=>{if($('#name').textContent!=='No fighter selected')setBattle(true);});
$('#mobile-menu').onclick=()=>setBattle(false);
$('#mobile-pause').onclick=()=>{$('#play').click();$('#mobile-pause').textContent=isPlaying()?'Pause':'Resume';void syncDevice();};
$('#play').addEventListener('click',()=>{void syncDevice();});
window.addEventListener('kenjatime:app-state',()=>{$('#mobile-pause').textContent=isPlaying()?'Pause':'Resume';void syncDevice();});
if(native){
  import('@capacitor/app').then(async({App})=>{
    await App.addListener('appStateChange',({isActive})=>window.dispatchEvent(new CustomEvent('kenjatime:app-state',{detail:{active:isActive}})));
    await App.addListener('backButton',()=>{if(battle)setBattle(false);else void App.minimizeApp();});
    const state=await App.getState();window.dispatchEvent(new CustomEvent('kenjatime:app-state',{detail:{active:state.isActive}}));
  }).catch(error=>{$('#status').textContent=`App lifecycle: ${error.message}`;});
}
