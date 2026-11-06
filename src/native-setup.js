import './style.css';
import './mobile.css';
import {appShell} from './app-shell.js';
import {sff,animations} from './formats.js';

// This is Kenjatime's shared interface. It never imports the browser combat runtime.
document.querySelector('#app').innerHTML=appShell;
document.body.classList.add('mobile-app','arena-page');
const $=s=>document.querySelector(s),escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let catalog={characters:[],stages:[],packages:[]},selected=null,serial=0,busy=false,previewBank=null,previewResource=null,previewEpoch=0;
const pending=new Map();
window.__kenjatimeNativeResult=result=>{const call=pending.get(result.id);if(!call)return;pending.delete(result.id);result.error?call.reject(Error(result.error)):call.resolve(result.data);};
window.__kenjatimeNativeProgress=message=>{$('#status').textContent=message;};
function native(action,data={}){
 if(!window.KenjatimeNative)return Promise.reject(Error('Open this interface in the Kenjatime Android app.'));
 const id=++serial;return new Promise((resolve,reject)=>{pending.set(id,{resolve,reject});window.KenjatimeNative.request(JSON.stringify({id,action,...data}));});
}
function status(message){$('#status').textContent=message;}
async function run(message,action){
 if(busy)return;busy=true;status(message);document.querySelectorAll('button,.import-actions label').forEach(e=>{e.setAttribute('aria-disabled','true');if(e.tagName==='BUTTON')e.disabled=true;});
 try{await action();}catch(error){status(error.message);}finally{busy=false;document.querySelectorAll('button,.import-actions label').forEach(e=>{e.removeAttribute('aria-disabled');if(e.tagName==='BUTTON')e.disabled=false;});}
}
$('.brand small').textContent='KENJATIME';$('header > span').innerHTML='PLAY <b>/</b> YOUR ARENA';$('.tag').textContent='KENJATIME';
$('.eyebrow').textContent='BRING YOUR FIGHTER';$('h1').innerHTML='Your next match starts here<span>.</span>';
$('.heading p').textContent='Import your fighters and stages. Choose a rival. Fight using their own scripts.';
$('#lab').textContent='◈ Character preview';$('#training').textContent='⚔ Arena';$('.legacy-arena').remove();
$('.aside-bottom small').textContent='Your character files stay on this device.';$('.stage-badge').textContent='YOUR ARENA';
$('#upload').textContent='＋ Import character / archive';$('#add-stage').textContent='＋ Add stage';$('#file').remove();$('#stage-file').remove();
$('.heading').insertAdjacentHTML('afterend','<section class="stage-library" aria-label="Stage setup"><label>Stage <select id="stage-select"></select></label><span id="stage-summary"></span></section>');
$('.viewer').insertAdjacentHTML('beforebegin','<section class="arena-launch" aria-label="Match setup"><label>Play mode <select id="arena-mode"><option value="solo">Player vs CPU</option><option value="versus">Two players</option><option value="cpu">Watch CPU match</option><option value="training">Training</option></select></label><button type="button" class="primary" id="fight-now">Fight now</button><span>Choose your fighter in the roster and your rival under Opponent.</span></section>');
$('.transport').insertAdjacentHTML('afterend','<div id="training-tools" class="training-tools"><label>Opponent <select id="opponent-select"></select></label><label>CPU level <select id="cpu-level">'+Array.from({length:8},(_,i)=>`<option value="${i+1}" ${i===3?'selected':''}>${i+1}</option>`).join('')+'</select></label><label>P1 palette <select id="palette-select"></select></label><label>P2 palette <select id="opponent-palette-select"></select></label></div>');
$('.roster').insertAdjacentHTML('beforebegin','<section class="mobile-library"><details open><summary>Saved on this device <span id="library-count">0</span></summary><p id="library-status">Imported archives are installed here and stay available after restarting the app.</p><div id="library-items"></div></details></section>');
$('#drop').innerHTML='<div class="upload-icon">↥</div><div><b>Bring a new challenger.</b><p>Import a character or stage archive, or <button type="button" id="browse">browse files</button></p><small>ZIP / RAR / 7z / TAR and compressed TAR · installed on this device</small><details class="archive-options"><summary>Archive password (optional)</summary><input id="archive-password" type="password" autocomplete="off" aria-label="Archive password"></details></div>';
$('.notice').textContent='Character scripts and matches run in the native engine. Package checks describe installed resources.';
$('#hint').textContent='Select your fighter, opponent and stage, then start a match.';$('.coordinates').innerHTML='X <span id="pos">0</span> &nbsp; Y <span>0</span>';
$('#play').hidden=$('#step').hidden=$('#actions').hidden=$('#speed').hidden=true;$('.frame').textContent='CHARACTER PREVIEW';
$('footer').innerHTML='<span>KENJATIME <b>/</b> LOCAL SESSION</span><button class="secondary" id="credits">Credits and source</button>';
$('#credits').onclick=()=>void native('credits').catch(e=>status(e.message));
for(const id of ['palette-select','opponent-palette-select'])$('#'+id).innerHTML=Array.from({length:12},(_,i)=>`<option value="${i+1}">${i+1}</option>`).join('');

const canvas=$('canvas'),ctx=canvas.getContext('2d');
function grid(){
 ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#0c111b';ctx.fillRect(0,0,960,540);ctx.strokeStyle='#1b2737';ctx.lineWidth=1;
 for(let x=-700;x<1700;x+=80){ctx.beginPath();ctx.moveTo(480+(x-480)*.3,320);ctx.lineTo(x,540);ctx.stroke();}
 for(let y=330;y<540;y+=(y-300)*.3){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(960,y);ctx.stroke();}
 ctx.strokeStyle='#466055';ctx.beginPath();ctx.moveTo(0,440);ctx.lineTo(960,440);ctx.stroke();
}
function resource(path){return new URL('/game/'+path.split('/').map(encodeURIComponent).join('/'),location.href).href;}
function disposePreview(){previewEpoch++;previewBank?.clearDecodedCache();previewBank=previewResource=null;grid();}
async function preview(entry){
 disposePreview();const epoch=previewEpoch;$('#empty').hidden=false;
 if(!entry.sprite||entry.spriteBytes>24*1024*1024){$('#empty').innerHTML='Your fighter is ready<small>Start a match to see it in the arena.</small>';return;}
 try{
  const bytes=new Uint8Array(await (await fetch(resource(entry.sprite))).arrayBuffer());if(epoch!==previewEpoch)return;
  const bank=sff(bytes);let frame;
  if(entry.anim){const actions=animations(await (await fetch(resource(entry.anim))).text());frame=actions.find(a=>a.id===0)?.frames[0];}
  if(epoch!==previewEpoch)return;
  const index=frame?bank.sprites.findIndex(s=>s.group===frame.group&&s.number===frame.number):bank.sprites.findIndex(s=>s.group===0&&s.number===0);
  if(index<0)throw Error('No idle preview');
  const sprite=bank.decode(index),image=document.createElement('canvas');image.width=sprite.w;image.height=sprite.h;image.getContext('2d').putImageData(new ImageData(sprite.rgba,sprite.w,sprite.h),0,0);
  grid();ctx.imageSmoothingEnabled=false;ctx.drawImage(image,480-sprite.x*2.2,440-sprite.y*2.2,sprite.w*2.2,sprite.h*2.2);previewBank=bank;previewResource=bytes;$('#empty').hidden=true;
 }catch{if(epoch===previewEpoch)$('#empty').innerHTML='Your fighter is ready<small>Start a match to see it in the arena.</small>';}
}
function remember(){try{localStorage.setItem('kenjatime.native.selection',JSON.stringify({character:selected?.id,opponent:$('#opponent-select').value,stage:$('#stage-select').value,mode:$('#arena-mode').value}));}catch{}}
function choose(id){
 selected=catalog.characters.find(c=>c.id===id)||catalog.characters[0];if(!selected)return;
 $('#name').textContent=selected.name;$('#author').textContent=selected.author||'MUGEN character';$('#version').textContent='SFF / AIR';$('#viewtitle').textContent='CHARACTER PREVIEW';
 $('#metadata').innerHTML=`<div class="meta"><span>Definition</span><b>${escape(selected.fileName)}</b></div><div class="meta"><span>Package</span><b>${escape(selected.packageName)}</b></div>`;
 $('#checks').innerHTML=['sprite','anim'].map(key=>`<div><span class="${selected[key]?'ok':'bad'}">${selected[key]?'✓':'!'}</span><b>${key.toUpperCase()}</b><span>${escape(selected[key]||'Not found')}</span></div>`).join('');$('#score').textContent=selected.sprite&&selected.anim?'INSTALLED':'CHECK FILES';
 $('#cards').querySelectorAll('.card').forEach(card=>card.classList.toggle('selected',card.dataset.id===selected.id));remember();void preview(selected);
}
function drawCatalog(data){
 catalog=data;const old=selected?.id;let saved={};try{saved=JSON.parse(localStorage.getItem('kenjatime.native.selection')||'{}');}catch{}
 $('#count').textContent=String(catalog.characters.length).padStart(2,'0');$('#cards').replaceChildren();
 for(const entry of catalog.characters){const button=document.createElement('button');button.className='card';button.dataset.id=entry.id;button.innerHTML=`<span class="mini">拳</span><span><b>${escape(entry.name)}</b><small>${escape(entry.author||'MUGEN character')}</small></span><span class="card-arrow">↗</span>`;button.onclick=()=>choose(entry.id);$('#cards').append(button);}
 const options=(list,first)=>first+list.map(e=>`<option value="${escape(e.id)}">${escape(e.name)}</option>`).join('');
 $('#opponent-select').innerHTML=options(catalog.characters,'<option value="">Mirror character</option>');$('#stage-select').innerHTML=options(catalog.stages,'');
 if(catalog.stages.some(s=>s.id===saved.stage))$('#stage-select').value=saved.stage;if(catalog.characters.some(c=>c.id===saved.opponent))$('#opponent-select').value=saved.opponent;
 if(['solo','versus','cpu','training'].includes(saved.mode))$('#arena-mode').value=saved.mode;
 $('#stage-summary').textContent='Your stage selection is used for the next match.';$('.stage-label').textContent=$('#stage-select').selectedOptions[0]?.textContent||'TRAINING GRID';
 $('#library-count').textContent=catalog.packages.length;$('#library-items').replaceChildren();
 for(const pkg of catalog.packages){const row=document.createElement('div');row.className='library-item';const name=document.createElement('span'),open=document.createElement('button'),remove=document.createElement('button');name.textContent=pkg.name;open.textContent='Open';remove.textContent='Delete';open.className=remove.className='secondary';
  open.onclick=()=>{const char=catalog.characters.find(c=>c.packageId===pkg.id),stage=catalog.stages.find(s=>s.packageId===pkg.id);if(char)choose(char.id);if(stage){$('#stage-select').value=stage.id;remember();}status('Package is installed and ready.');};
  remove.onclick=()=>void run('Removing installed package…',async()=>{drawCatalog(await native('remove',{packageId:pkg.id}));status('Package removed from this app. The source archive is unchanged.');});row.append(name,open,remove);$('#library-items').append(row);
 }
 choose(catalog.characters.some(c=>c.id===old)?old:saved.character);grid();
}
async function pick(kind){await run('Choose a character or stage archive…',async()=>{const result=await native('pickArchive',{kind,password:$('#archive-password').value});$('#archive-password').value='';if(result.cancelled){status('Import cancelled.');return;}const previous=new Set(catalog.packages.map(p=>p.id));drawCatalog(result);const added=catalog.packages.find(p=>!previous.has(p.id));if(added){const fighter=catalog.characters.find(c=>c.packageId===added.id),stage=catalog.stages.find(s=>s.packageId===added.id);if(fighter)choose(fighter.id);if(stage){$('#stage-select').value=stage.id;remember();}}status('Archive installed. Your fighters and stages are ready to select.');});}
for(const [id,kind]of [['upload','any'],['add-stage','stage'],['browse','any']]){
 const element=$('#'+id);element.onclick=event=>{event.preventDefault();void pick(kind);};element.onkeydown=event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();void pick(kind);}};
}
$('#sample').onclick=()=>choose(catalog.characters.find(c=>!c.packageId)?.id);$('#lab').onclick=()=>{$('.viewer').scrollIntoView({block:'start'});};$('#training').onclick=()=>{$('.arena-launch').scrollIntoView({block:'start'});};
for(const id of ['stage-select','opponent-select','arena-mode'])$('#'+id).onchange=()=>{remember();$('.stage-label').textContent=$('#stage-select').selectedOptions[0]?.textContent||'TRAINING GRID';};
$('#fight-now').onclick=()=>void run('Preparing your match…',async()=>{
 if(!selected)throw Error('Import a character before starting a match.');
 const match={character:selected.id,opponent:$('#opponent-select').value||selected.id,stage:$('#stage-select').value,mode:$('#arena-mode').value,level:+$('#cpu-level').value,palette:+$('#palette-select').value,opponentPalette:+$('#opponent-palette-select').value};remember();disposePreview();await native('launch',match);
});
grid();void run('Opening your library…',async()=>{drawCatalog(await native('catalog'));status('Ready when you are.');});
