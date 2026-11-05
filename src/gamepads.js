import {DEFAULT_GAMEPAD_BUTTONS,gamepadKeys} from './input-buffer.js';

export const CONTROLLER_BUTTONS=[[0,'× / A'],[1,'○ / B'],[2,'□ / X'],[3,'△ / Y'],[4,'L1 / LB'],[5,'R1 / RB'],[6,'L2 / LT'],[7,'R2 / RT'],[8,'Create / Select'],[9,'Options / Start']];
const actions=new Set(['','a','b','c','x','y','z','s']);
const defaults=()=>({device:'auto',deadzone:.25,customLayout:false,buttons:{...DEFAULT_GAMEPAD_BUTTONS}});
const browserGamepads=()=>{
  if(typeof globalThis.navigator?.getGamepads!=='function')throw Object.assign(Error('This browser does not support the Gamepad API.'),{code:'unsupported'});
  return navigator.getGamepads();
};
function playerSettings(raw={}){
  if(!raw||typeof raw!=='object')raw={};
  const result=defaults();
  if(['auto','none'].includes(raw.device)||/^\d{1,2}$/.test(String(raw.device)))result.device=String(raw.device);
  if(Number.isFinite(raw.deadzone))result.deadzone=Math.max(.1,Math.min(.9,raw.deadzone));
  result.customLayout=raw.customLayout===true;
  if(raw.buttons&&typeof raw.buttons==='object')for(const [index]of CONTROLLER_BUTTONS)if(actions.has(raw.buttons[index]))result.buttons[index]=raw.buttons[index];
  return result;
}

export function controllerName(pad){
  const id=String(pad?.id||'');
  if(/dualsense|054c.*(?:0ce6|0df2)|(?:0ce6|0df2).*054c/i.test(id))return 'PS5 DualSense';
  if(/dualshock|playstation|sony|054c/i.test(id))return 'PlayStation controller';
  if(/xbox|xinput/i.test(id))return 'Xbox controller';
  return id||'Game controller';
}

/** Stable player roles even when GamepadList has empty slots or reconnects. */
export class ControllerManager{
  constructor({getGamepads=browserGamepads,settings=[],onSave=()=>{}}={}){
    this.getGamepads=getGamepads;this.settings=[0,1].map(i=>playerSettings(settings?.[i]));this.onSave=onSave;this.pads=[];this.autoDevices=[null,null];this.error='';
  }
  poll(){
    try{this.pads=Array.from(this.getGamepads()||[]).map((pad,index)=>({pad,index:pad?.index??index})).filter(row=>row.pad?.connected);this.error='';}
    catch(error){this.pads=[];this.error=error?.code==='unsupported'?error.message:'Controller access is unavailable. Open this site directly in your browser.';}
    return this.assigned();
  }
  assigned(){
    const assigned=[null,null],used=new Set();
    // Reserve explicit choices before filling either automatic player slot.
    for(let side=0;side<2;side++){
      const choice=this.settings[side].device;
      if(choice!=='auto'&&choice!=='none'){
        const row=this.pads.find(row=>String(row.index)===choice);
        if(row&&!used.has(row.index)){assigned[side]=row.pad;used.add(row.index);}
      }
    }
    for(let side=0;side<2;side++)if(this.settings[side].device==='auto'){
      const row=this.pads.find(row=>row.index===this.autoDevices[side]&&!used.has(row.index)&&(row.pad.mapping==='standard'||this.settings[side].customLayout));
      if(row){assigned[side]=row.pad;used.add(row.index);}
    }
    for(let side=0;side<2;side++)if(this.settings[side].device==='auto'&&!assigned[side]){
      const row=this.pads.find(row=>!used.has(row.index)&&(row.pad.mapping==='standard'||this.settings[side].customLayout));
      this.autoDevices[side]=row?.index??null;if(row){assigned[side]=row.pad;used.add(row.index);}
    }
    return assigned;
  }
  keys(side){return gamepadKeys(this.assigned()[side],this.settings[side]);}
  configure(side,patch){
    const current=this.settings[side];this.settings[side]=playerSettings({...current,...patch,buttons:{...current.buttons,...patch.buttons}});
    // One physical controller belongs to only one player.
    const other=1-side,device=this.settings[side].device;
    if(device!=='auto'&&device!=='none'&&this.settings[other].device===device)this.settings[other].device='auto';
    this.onSave(this.settings);
  }
  resetMapping(side){this.settings[side]={...defaults(),device:this.settings[side].device};this.onSave(this.settings);}
  signature(){return JSON.stringify([this.error,this.pads.map(({pad,index})=>[index,pad.id,pad.mapping]),this.settings]);}
}

/** Use native Gamepad APIs only; USB/Bluetooth pairing stays with the device OS. */
export function mountControllerSetup(container,{onChange=()=>{},onCheck=()=>{}}={}){
  let settings=[];try{settings=JSON.parse(localStorage.getItem('kenjatime.controllers')||'[]');}catch{}
  const manager=new ControllerManager({settings,onSave:value=>{try{localStorage.setItem('kenjatime.controllers',JSON.stringify(value));}catch{}}});
  const root=document.createElement('details');root.className='controller-setup';root.innerHTML=`<summary>Controllers <span id="controller-status" aria-live="polite">Connect a controller to play</span></summary>
    <p>PS5 / DualSense: pair by Bluetooth or connect by USB, then press a face button. Use the D-pad or left stick to move. Select Two players or Keyboard / controller P2 for a second player.</p>
    <div class="controller-devices"><label>P1 controller <select id="controller-p1" aria-label="Player 1 controller"></select></label><label>P2 controller <select id="controller-p2" aria-label="Player 2 controller"></select></label><button type="button" id="controller-check" class="secondary">Check controllers</button></div>
    <div class="controller-options"><label>Configure <select id="controller-player"><option value="0">Player 1</option><option value="1">Player 2</option></select></label><label>Stick deadzone <input id="controller-deadzone" type="range" min="0.1" max="0.9" step="0.05"><output id="controller-deadzone-value"></output></label><label><input id="controller-custom" type="checkbox"> Custom nonstandard layout</label><button type="button" class="secondary" id="controller-reset">Reset mappings</button><button type="button" class="secondary" id="controller-rumble">Test vibration</button></div><div class="controller-bindings"></div><p id="controller-feedback" role="status"></p>`;
  container.append(root);const $=s=>root.querySelector(s);let signature='';
  const side=()=>+$('#controller-player').value;
  function render(){
    const assigned=manager.assigned();
    for(let player=0;player<2;player++){
      const select=$(player?'#controller-p2':'#controller-p1'),choice=manager.settings[player].device;
      select.replaceChildren(...[['auto','Auto'],['none','Disabled'],...manager.pads.map(({pad,index},order)=>[String(index),`Controller ${order+1} · ${controllerName(pad)}${pad.mapping==='standard'?'':' (custom mapping required)'}`])].map(([value,label])=>new Option(label,value)));
      if(choice!=='auto'&&choice!=='none'&&!manager.pads.some(row=>String(row.index)===choice))select.add(new Option('Disconnected controller',choice));
      select.value=choice;
    }
    $('#controller-status').textContent=manager.error||assigned.map((pad,i)=>`P${i+1}: ${pad?controllerName(pad):'No controller'}`).join(' · ');
    const config=manager.settings[side()];$('#controller-deadzone').value=config.deadzone;$('#controller-deadzone-value').textContent=`${Math.round(config.deadzone*100)}%`;$('#controller-custom').checked=config.customLayout;
    $('.controller-bindings').replaceChildren(...CONTROLLER_BUTTONS.map(([index,name])=>{
      const label=document.createElement('label');label.append(document.createTextNode(name+' '));const select=document.createElement('select');select.dataset.button=index;select.setAttribute('aria-label',name+' MUGEN action');
      for(const action of ['','x','y','z','a','b','c','s'])select.add(new Option(action==='s'?'Start':action||'Unused',action));select.value=config.buttons[index]||'';
      select.onchange=()=>change(()=>manager.configure(side(),{buttons:{[index]:select.value}}));label.append(select);return label;
    }));signature=manager.signature();
  }
  function change(fn){onChange();fn();render();}
  for(let player=0;player<2;player++)$(player?'#controller-p2':'#controller-p1').onchange=event=>change(()=>manager.configure(player,{device:event.target.value}));
  $('#controller-player').onchange=render;
  $('#controller-deadzone').oninput=event=>change(()=>manager.configure(side(),{deadzone:+event.target.value}));
  $('#controller-custom').onchange=event=>change(()=>manager.configure(side(),{customLayout:event.target.checked}));
  $('#controller-reset').onclick=()=>change(()=>manager.resetMapping(side()));
  $('#controller-check').onclick=()=>{poll();onCheck();};
  $('#controller-rumble').onclick=async()=>{
    const pad=manager.assigned()[side()],actuator=pad?.vibrationActuator||pad?.hapticActuators?.[0];
    try{if(actuator?.playEffect)await actuator.playEffect('dual-rumble',{duration:150,startDelay:0,strongMagnitude:.3,weakMagnitude:.3});else if(actuator?.pulse)await actuator.pulse(.3,150);else throw Error('Vibration is not exposed by this controller/browser.');$('#controller-feedback').textContent='Vibration test sent.';}
    catch(error){$('#controller-feedback').textContent=error.message;}
  };
  function poll(){manager.poll();if(signature!==manager.signature()){onChange();render();}return manager;}
  window.addEventListener('gamepadconnected',poll);window.addEventListener('gamepaddisconnected',poll);poll();return{manager,poll};
}
