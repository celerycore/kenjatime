import './main.js';
import './mobile.css';
import {Capacitor,registerPlugin} from '@capacitor/core';
import {App} from '@capacitor/app';
if(Capacitor.isNativePlatform()){
 const device=registerPlugin('ArenaDevice');
 window.addEventListener('kenjatime:battle',event=>{device.setBattleMode({enabled:event.detail.active,awake:event.detail.active&&!event.detail.paused}).catch(()=>{});});
 App.addListener('appStateChange',state=>window.dispatchEvent(new CustomEvent('kenjatime:app-state',{detail:{active:state.isActive}})));
 App.addListener('backButton',()=>{const menu=document.querySelector('.kenjatime-battle [data-menu]');if(menu)menu.click();else App.minimizeApp();});
}
