import './style.css';
import './mobile.css';
import {appShell} from './app-shell.js';
import {sff,animations} from './formats.js';
import {libraryResetURL} from './library-recovery.js';

export function mountSetup(engineHost){
document.querySelector('#app').innerHTML=appShell;document.title='Kenjatime';
document.body.classList.add('mobile-app','arena-page');
const $=s=>document.querySelector(s),escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let catalog={characters:[],stages:[],packages:[]},selected=null,busy=false,previewEpoch=0;
window.__kenjatimeNativeProgress=message=>{$('#status').textContent=message;};
const native=(action,data={})=>engineHost.request(action,data);
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
if(engineHost.canResetLibrary){const recovery=document.createElement('p');recovery.className='library-recovery';recovery.innerHTML='<a class="secondary" id="reset-library">Reset library</a> <span>Removes installed fighters, stages and saved archive copies. Your original downloaded files stay intact.</span>';recovery.querySelector('a').href=libraryResetURL();$('.mobile-library').append(recovery);}
$('#drop').innerHTML='<div class="upload-icon">↥</div><div><b>Bring a new challenger.</b><p>Import a character or stage archive, or <button type="button" id="browse">browse files</button></p><small>ZIP / RAR / 7z / TAR and compressed TAR · installed on this device</small><details class="archive-options"><summary>Archive password (optional)</summary><input id="archive-password" type="password" autocomplete="off" aria-label="Archive password"></details></div>';
$('.notice').textContent='Character scripts and matches run in the game engine. Package checks describe installed resources.';
$('#hint').textContent='Select your fighter, opponent and stage, then start a match.';$('.coordinates').innerHTML='X <span id="pos">0</span> &nbsp; Y <span>0</span>';
$('#play').hidden=$('#step').hidden=$('#actions').hidden=$('#speed').hidden=true;$('.frame').textContent='P1 / P2 PREVIEW';
for(const selector of ['.stage-label','.coordinates','.stage-badge'])$(selector).hidden=true;
$('footer').innerHTML='<span>KENJATIME <b>/</b> LOCAL SESSION</span><button class="secondary" id="credits">Credits and source</button>';
$('#credits').onclick=()=>void native('credits').catch(e=>status(e.message));
for(const id of ['palette-select','opponent-palette-select'])$('#'+id).innerHTML=Array.from({length:12},(_,i)=>`<option value="${i+1}">${i+1}</option>`).join('');
$('#opponent-palette-select').value='2';

const canvas=$('canvas'),ctx=canvas.getContext('2d');
function grid(){
 ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#0c111b';ctx.fillRect(0,0,960,540);ctx.strokeStyle='#1b2737';ctx.lineWidth=1;
 for(let x=-700;x<1700;x+=80){ctx.beginPath();ctx.moveTo(480+(x-480)*.3,320);ctx.lineTo(x,540);ctx.stroke();}
 for(let y=330;y<540;y+=(y-300)*.3){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(960,y);ctx.stroke();}
 ctx.strokeStyle='#466055';ctx.beginPath();ctx.moveTo(0,440);ctx.lineTo(960,440);ctx.stroke();
}
const resource=path=>engineHost.resource(path);
function disposePreview(){previewEpoch++;canvas.dataset.previewCount='0';grid();}
async function preview(){
 disposePreview();const epoch=previewEpoch;if(!selected)return;$('#empty').hidden=true;
 const rival=catalog.characters.find(c=>c.id===$('#opponent-select').value)||selected,entries=[selected,rival],banks=new Map();
 const images=await Promise.all(entries.map(async(entry,side)=>{
  try{
   if(!entry.sprite||entry.spriteBytes>64*1024*1024)throw Error('Preview unavailable');
   if(!banks.has(entry.sprite))banks.set(entry.sprite,resource(entry.sprite).then(r=>r.arrayBuffer()).then(b=>sff(new Uint8Array(b))));
   const bank=await banks.get(entry.sprite);if(epoch!==previewEpoch)return null;let frame;
   if(entry.anim)frame=animations(await (await resource(entry.anim)).text()).find(a=>a.id===0)?.frames[0];
   if(epoch!==previewEpoch)return null;
   const index=frame?bank.sprites.findIndex(s=>s.group===frame.group&&s.number===frame.number):bank.sprites.findIndex(s=>s.group===0&&s.number===0);if(index<0)throw Error('No idle preview');
   let sprite=bank.decode(index);try{sprite=bank.decodeWithPalette(index,1,+$(side?'#opponent-palette-select':'#palette-select').value);}catch{}
   const image=document.createElement('canvas');image.width=sprite.w;image.height=sprite.h;image.getContext('2d').putImageData(new ImageData(sprite.rgba,sprite.w,sprite.h),0,0);return image;
  }catch{return null;}
 }));
 for(const promise of banks.values())promise.then(bank=>bank.clearDecodedCache()).catch(()=>{});
 if(epoch!==previewEpoch)return;grid();ctx.imageSmoothingEnabled=false;
 entries.forEach((entry,side)=>{const center=side?690:270,image=images[side];ctx.fillStyle=side?'#8fcfff':'#d3fb8d';ctx.font='28px system-ui';ctx.textAlign='center';ctx.fillText(`P${side+1} · ${entry.name}`,center,68,360);
  if(image){const scale=Math.min(2.2,340/image.width,320/image.height);ctx.save();ctx.translate(center,440);ctx.scale(side?-scale:scale,scale);ctx.drawImage(image,-image.width/2,-image.height);ctx.restore();}
  else{ctx.font='15px system-ui';ctx.fillText('Preview unavailable',center,280);ctx.fillText('Ready to use in a match',center,305);}
 });canvas.dataset.previewCount=String(images.filter(Boolean).length);canvas.setAttribute('aria-label',`Match preview: Player 1 ${selected.name}, Player 2 ${rival.name}`);
}
function remember(){try{localStorage.setItem('kenjatime.native.selection',JSON.stringify({character:selected?.id,opponent:$('#opponent-select').value,stage:$('#stage-select').value,mode:$('#arena-mode').value}));}catch{}}
function choose(id){
 selected=catalog.characters.find(c=>c.id===id)||catalog.characters[0];if(!selected)return;
 $('#name').textContent=selected.name;$('#author').textContent=selected.author||'MUGEN character';$('#version').textContent='SFF / AIR';$('#viewtitle').textContent='MATCH PREVIEW · P1 / P2';
 $('#metadata').innerHTML=`<div class="meta"><span>Definition</span><b>${escape(selected.fileName)}</b></div><div class="meta"><span>Package</span><b>${escape(selected.packageName)}</b></div>`;
 $('#checks').innerHTML=['sprite','anim'].map(key=>`<div><span class="${selected[key]?'ok':'bad'}">${selected[key]?'✓':'!'}</span><b>${key.toUpperCase()}</b><span>${escape(selected[key]||'Not found')}</span></div>`).join('');$('#score').textContent=selected.sprite&&selected.anim?'INSTALLED':'CHECK FILES';
 $('#cards').querySelectorAll('.card').forEach(card=>card.classList.toggle('selected',card.dataset.id===selected.id));remember();void preview();
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
  open.onclick=()=>{if(pkg.legacy){void run('Installing saved archive…',async()=>{applyInstalled(await native('openLegacy',{id:pkg.id,password:$('#archive-password').value}));$('#archive-password').value='';status('Saved archive installed. Select your fighter to play.');});return;}const char=catalog.characters.find(c=>c.packageId===pkg.id),stage=catalog.stages.find(s=>s.packageId===pkg.id);if(char)choose(char.id);if(stage){$('#stage-select').value=stage.id;remember();}status('Package is installed and ready.');};
  remove.onclick=()=>void run('Removing installed package…',async()=>{drawCatalog(await native('remove',{packageId:pkg.id}));status('Package removed from this app. The source archive is unchanged.');});row.append(name,open);if(pkg.downloadable){const save=document.createElement('button');save.textContent='Save archive';save.className='secondary';save.onclick=()=>void run('Preparing your archive…',async()=>{await native('downloadArchive',{packageId:pkg.id});status('Archive is ready to save or share.');});row.append(save);}row.append(remove);$('#library-items').append(row);
 }
 choose(catalog.characters.some(c=>c.id===old)?old:saved.character);grid();
}
function applyInstalled(result){
 const previous=new Set(catalog.packages.map(p=>p.id));drawCatalog(result);const added=catalog.packages.find(p=>!previous.has(p.id));if(!added)return;
 const fighter=catalog.characters.find(c=>c.packageId===added.id),stage=catalog.stages.find(s=>s.packageId===added.id);if(fighter)choose(fighter.id);if(stage){$('#stage-select').value=stage.id;$('.stage-label').textContent=stage.name;remember();}
}
async function pick(kind){await run('Choose a character or stage archive…',async()=>{const result=await native('pickArchive',{kind,password:$('#archive-password').value});$('#archive-password').value='';if(result.cancelled){status('Import cancelled.');return;}applyInstalled(result);status('Archive installed. Your fighters and stages are ready to select.');});}

for(const [id,kind]of [['upload','any'],['add-stage','stage'],['browse','any']]){
 const element=$('#'+id);element.onclick=event=>{event.preventDefault();void pick(kind);};element.onkeydown=event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();void pick(kind);}};
}
if(engineHost.importFile){
 $('#drop').addEventListener('dragover',event=>event.preventDefault());
 $('#drop').addEventListener('drop',event=>{event.preventDefault();const file=event.dataTransfer.files[0];if(file)void run('Reading archive…',async()=>{applyInstalled(await engineHost.importFile(file,{password:$('#archive-password').value}));$('#archive-password').value='';status('Archive installed. Your fighters and stages are ready to select.');});});
}
$('#sample').onclick=()=>choose(catalog.characters.find(c=>!c.packageId)?.id);$('#lab').onclick=()=>{$('.viewer').scrollIntoView({block:'start'});};$('#training').onclick=()=>{$('.arena-launch').scrollIntoView({block:'start'});};
for(const id of ['stage-select','opponent-select','arena-mode','palette-select','opponent-palette-select'])$('#'+id).onchange=()=>{remember();$('.stage-label').textContent=$('#stage-select').selectedOptions[0]?.textContent||'TRAINING GRID';if(id==='opponent-select'||id.includes('palette'))void preview();};
$('#fight-now').onclick=()=>void run('Preparing your match…',async()=>{
 if(!selected)throw Error('Import a character before starting a match.');
 const match={character:selected.id,opponent:$('#opponent-select').value||selected.id,stage:$('#stage-select').value,mode:$('#arena-mode').value,level:+$('#cpu-level').value,palette:+$('#palette-select').value,opponentPalette:+$('#opponent-palette-select').value};remember();disposePreview();await native('launch',match);
});
window.addEventListener('kenjatime:battle',event=>{if(!event.detail.active&&selected){void preview();status('Ready when you are.');}});
grid();void run('Opening your library…',async()=>{const data=await native('catalog');drawCatalog(data);status(data.warning||'Ready when you are.');});

}
