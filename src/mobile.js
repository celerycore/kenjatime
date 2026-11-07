import './main.js';
import './mobile.css';
import {Capacitor,registerPlugin} from '@capacitor/core';
import {App} from '@capacitor/app';
import {libraryDeadline} from './library-recovery.js';
if(Capacitor.isNativePlatform()){
 const device=registerPlugin('ArenaDevice');
 const startup=window.__kenjatimeStartup,step=startup?.begin('native-info',{critical:false});
 libraryDeadline(device.getStartupInfo(),'Android startup details unavailable.',2000).then(info=>{startup?.platform(info);step?.end();}).catch(error=>step?.fail(error));
 window.addEventListener('kenjatime:battle',event=>{device.setBattleMode({enabled:event.detail.active,awake:event.detail.active&&!event.detail.paused}).catch(()=>{});});
 App.addListener('appStateChange',state=>window.dispatchEvent(new CustomEvent('kenjatime:app-state',{detail:{active:state.isActive}})));
 App.addListener('backButton',()=>{const menu=document.querySelector('.kenjatime-battle [data-menu]');if(menu)menu.click();else App.minimizeApp();});
}
