/** Pointer capture plus per-finger state allows directions and attacks together. */
export function mountTouchControls(host,onChange){
  const panel=document.createElement('div');panel.className='touch-controls';panel.hidden=true;panel.setAttribute('aria-label','Touch fight controls');
  const button=(label,input,aria)=>`<button type="button" data-input="${input}" aria-label="${aria||label}">${label}</button>`;
  const arrow=angle=>`<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 20V4M5 11l7-7 7 7" transform="rotate(${angle} 12 12)" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  panel.innerHTML=`<div class="touch-dpad" aria-label="Directions">${button(arrow(-45),'L U','Up left')}${button(arrow(0),'U','Jump')}${button(arrow(45),'R U','Up right')}${button(arrow(-90),'L','Left')}<span></span>${button(arrow(90),'R','Right')}${button(arrow(-135),'L D','Down left')}${button(arrow(180),'D','Crouch')}${button(arrow(135),'R D','Down right')}</div><div class="touch-buttons" aria-label="Attack buttons">${['x','y','z','a','b','c'].map(key=>button(key.toUpperCase(),key,`MUGEN ${key}`)).join('')}${button('START','s','MUGEN start')}</div>`;
  host.append(panel);const active=new Map();
  function update(){const inputs=new Set();for(const button of active.values())if(button)for(const key of button.dataset.input.split(' '))inputs.add(key);for(const button of panel.querySelectorAll('button')){const pressed=[...active.values()].includes(button);button.classList.toggle('pressed',pressed);button.setAttribute('aria-pressed',String(pressed));}onChange(inputs);}
  function release(id){if(active.delete(id))update();}
  panel.addEventListener('pointerdown',event=>{const button=event.target.closest('button[data-input]');if(!button||event.button!==0)return;event.preventDefault();button.setPointerCapture(event.pointerId);active.set(event.pointerId,button);update();});
  panel.addEventListener('pointermove',event=>{if(!active.has(event.pointerId))return;event.preventDefault();const hit=document.elementFromPoint(event.clientX,event.clientY)?.closest('button[data-input]'),button=hit&&panel.contains(hit)?hit:null;if(active.get(event.pointerId)!==button){active.set(event.pointerId,button);update();}});
  for(const name of ['pointerup','pointercancel','lostpointercapture'])panel.addEventListener(name,event=>release(event.pointerId));
  panel.addEventListener('keydown',event=>{if(![' ','Enter'].includes(event.key)||event.repeat||!event.target.matches('button[data-input]'))return;event.preventDefault();active.set(`key:${event.code}`,event.target);update();});
  panel.addEventListener('keyup',event=>{if([' ','Enter'].includes(event.key)){event.preventDefault();release(`key:${event.code}`);}});
  panel.addEventListener('focusout',()=>{for(const id of active.keys())if(typeof id==='string')release(id);});
  const reset=()=>{active.clear();update();};
  window.addEventListener('blur',reset);document.addEventListener('visibilitychange',()=>{if(document.hidden)reset();});
  return {panel,reset};
}
