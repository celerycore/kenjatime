import {mountTouchControls} from './touch-controls.js';
import './go-battle.css';
const mapping={U:'ArrowUp',D:'ArrowDown',L:'ArrowLeft',R:'ArrowRight',a:'KeyZ',b:'KeyX',c:'KeyC',x:'KeyA',y:'KeyS',z:'KeyD',s:'Enter'};
let active;
export async function openGoBattle({files,args,onProgress=()=>{}}){
 active?.close();window.__kenjatimeGoState=undefined;
 const host=document.createElement('section');host.className='kenjatime-battle';host.setAttribute('aria-label','Kenjatime arena');
 host.innerHTML='<iframe title="Kenjatime fight" allow="autoplay; gamepad"></iframe><div class="kenjatime-battle-bar"><button type="button" class="secondary" data-menu>Menu</button><button type="button" class="secondary" data-pause>Pause</button><button type="button" class="secondary" data-sound aria-pressed="false">Enable sound</button></div><p class="kenjatime-battle-status">Preparing your match…</p>';
 const frame=host.querySelector('iframe'),status=host.querySelector('p');let held=new Set(),paused=false,settled=false,audioRunning=false,closing=false;
 const api=()=>frame.contentWindow?.__kenjatimeFrame;
 function keys(inputs){if(closing){held.clear();return;}const next=new Set([...inputs].map(k=>mapping[k]).filter(Boolean));for(const k of held)if(!next.has(k))api()?.key(k,false);for(const k of next)if(!held.has(k))api()?.key(k,true);held=next;}
 const touch=mountTouchControls(host,keys);touch.panel.hidden=false;
 let resolve,reject;const ready=new Promise((a,b)=>{resolve=a;reject=b;});
 const close=(reason)=>{if(closing)return;closing=true;if(document.fullscreenElement===host)document.exitFullscreen().catch(()=>{});touch.dispose();api()?.dispose();window.removeEventListener('message',message);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('kenjatime:app-state',appState);host.remove();document.body.classList.remove('kenjatime-playing');window.__kenjatimeGoState=undefined;window.dispatchEvent(new CustomEvent('kenjatime:battle',{detail:{active:false,paused:true}}));if(!settled){settled=true;reject(Error(typeof reason==='string'?reason:'Match cancelled.'));}if(active?.host===host)active=null;};
 const pause=()=>{touch.reset();paused=!paused;api()?.pause(paused);host.querySelector('[data-pause]').textContent=paused?'Resume':'Pause';window.dispatchEvent(new CustomEvent('kenjatime:battle',{detail:{active:true,paused}}));};
 const appState=event=>{if(!event.detail.active&&!paused)pause();};
 const visibility=()=>{touch.reset();if(document.hidden&&!paused)pause();};
 function message(event){if(event.source!==frame.contentWindow||event.origin!==location.origin||!event.data?.kenjatimeEngine)return;const data=event.data;
  if(data.type==='frame-ready'){frame.contentWindow.postMessage({type:'kenjatime-start',files,args},location.origin,[...new Set(Object.values(files).map(b=>b.buffer))]);}
  if(data.type==='progress'){status.textContent=data.message;onProgress(data.message);}
  if(data.type==='ready'){status.hidden=true;frame.focus();if(!settled){settled=true;resolve();}}
  if(data.type==='state'){window.__kenjatimeGoState=data.state;}
  if(data.type==='audio'){audioRunning=data.running;const button=host.querySelector('[data-sound]');button.textContent=data.paused&&data.enabled?'Sound paused':data.running?'Sound on':data.enabled?'Enable sound':'Sound off';button.setAttribute('aria-pressed',String(data.enabled&&data.running));}
  if(data.type==='end')close();
  if(data.type==='error'){const text=data.message||'The match could not start.';close(text);onProgress(text);}
 }
 window.addEventListener('message',message);window.addEventListener('kenjatime:app-state',appState);document.addEventListener('visibilitychange',visibility);
 host.querySelector('[data-menu]').onclick=()=>close();host.querySelector('[data-pause]').onclick=pause;host.querySelector('[data-sound]').onclick=()=>api()?.audio(!audioRunning);document.body.append(host);document.body.classList.add('kenjatime-playing');active={host,close};window.dispatchEvent(new CustomEvent('kenjatime:battle',{detail:{active:true,paused:false}}));if(navigator.userActivation?.isActive&&matchMedia('(pointer:coarse)').matches&&host.requestFullscreen)host.requestFullscreen().then(()=>screen.orientation?.lock?.('landscape')).catch(()=>{});
 frame.src=new URL('engine/index.html?v='+__KENJATIME_ENGINE_REVISION__,new URL('../',import.meta.url)).href;return ready;
}
