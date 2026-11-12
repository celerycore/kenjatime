import './style.css';
import './mobile.css';
import {appShell} from './app-shell.js';
import {sff,animations} from './formats.js';
import {compactSffV1Preview} from './core/large-sff-preview.js';
import {libraryResetURL} from './library-recovery.js';
import {exportFile} from './export-file.js';

export function mountSetup(engineHost){
document.querySelector('#app').innerHTML=appShell;document.title='Kenjatime';
document.body.classList.add('mobile-app','arena-page');
const $=s=>document.querySelector(s),escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let catalog={characters:[],stages:[],packages:[]},selected=null,busy=false,previewEpoch=0;
window.__kenjatimeNativeProgress=message=>{$('#status').textContent=message;};
const native=(action,data={})=>engineHost.request(action,data);
const selectionKey=engineHost.selectionKey||'kenjatime.native.selection';
const startup=engineHost.diagnostics;
function status(message){$('#status').textContent=message;}
async function run(message,action){
 if(busy)return;busy=true;status(message);document.querySelectorAll('button:not([data-startup-action]),.import-actions label').forEach(e=>{e.setAttribute('aria-disabled','true');if(e.tagName==='BUTTON')e.disabled=true;});
 try{await action();}catch(error){status(error.message);}finally{busy=false;document.querySelectorAll('button:not([data-startup-action]),.import-actions label').forEach(e=>{e.removeAttribute('aria-disabled');if(e.tagName==='BUTTON')e.disabled=false;});}
}
$('.brand small').textContent='KENJATIME';$('header > span').innerHTML='PLAY <b>/</b> YOUR ARENA';$('.tag').textContent='KENJATIME';
$('.eyebrow').textContent='BRING YOUR FIGHTER';$('h1').innerHTML='Your next match starts here<span>.</span>';
$('.heading p').textContent='Import your fighters and stages. Choose a rival. Fight using their own scripts.';
$('#lab').textContent='◈ Character preview';$('#training').textContent='⚔ Arena';$('.legacy-arena').remove();
$('.aside-bottom small').textContent='Your character files stay on this device.';$('.stage-badge').textContent='YOUR ARENA';
$('#upload').textContent='＋ Import character / archive';$('#add-stage').textContent='＋ Add stage';$('#file').remove();$('#stage-file').remove();
$('.heading').insertAdjacentHTML('afterend','<section class="stage-library" aria-label="Stage setup"><label>Stage <select id="stage-select"></select></label><span id="stage-summary"></span></section>');
$('.stage-library').insertAdjacentHTML('afterend','<section class="stage-library" aria-label="Common effects"><label>Common effects <select id="effects-select"><option value="">From chosen stage / fighter (if included)</option></select></label><span>Optional original fightfx AIR/SFF pack</span></section>');
$('.viewer').insertAdjacentHTML('beforebegin','<section class="arena-launch" aria-label="Match setup"><label>Play mode <select id="arena-mode"><option value="solo">Player vs CPU</option><option value="versus">Two players</option><option value="cpu">Watch CPU match</option><option value="training">Training</option></select></label><label>Screen format <select id="presentation-select" aria-label="Match screen format"><option value="widescreen-16-9">16:9 Widescreen</option><option value="native-4-3">4:3 Native-style</option></select></label><label class="endless-rounds-option"><input type="checkbox" id="endless-rounds" aria-describedby="endless-rounds-note"><b>∞ Endless Rounds</b></label><button type="button" class="primary" id="fight-now">Fight now</button><span>Choose your fighter in the roster and your rival under Opponent.</span><small id="endless-rounds-note" class="endless-rounds-note">Automatically starts the next round after KO or time-out. Use Watch CPU match for unattended benchmarking.</small></section>');
$('.transport').insertAdjacentHTML('afterend','<div id="training-tools" class="training-tools"><label>Opponent <select id="opponent-select"></select></label><label>CPU level <select id="cpu-level">'+Array.from({length:8},(_,i)=>`<option value="${i+1}" ${i===3?'selected':''}>${i+1}</option>`).join('')+'</select></label><label>P1 palette <select id="palette-select"></select></label><label>P2 palette <select id="opponent-palette-select"></select></label></div>');
$('.roster').insertAdjacentHTML('beforebegin','<section class="mobile-library"><details open><summary>Saved on this device <span id="library-count">0</span></summary><p id="library-status">Imported archives are installed here and stay available after restarting the app.</p><div id="library-items"></div></details></section>');
if(engineHost.canResetLibrary){const recovery=document.createElement('p');recovery.className='library-recovery';recovery.innerHTML='<a class="secondary" id="reset-library">Reset library</a> <span>Removes installed fighters, stages and saved archive copies. Your original downloaded files stay intact.</span>';recovery.querySelector('a').href=libraryResetURL();$('.mobile-library').append(recovery);}
if(startup){
 const panel=document.createElement('details');panel.className='startup-diagnostics';panel.id='startup-diagnostics';panel.innerHTML='<summary>Startup report</summary><p id="startup-progress" role="status"></p><ol id="startup-phases"></ol><button class="secondary" type="button" data-startup-action id="export-startup">Save startup report</button><p>Contains loading timings, device details and library counts. Character files, archive names and passwords are excluded.</p>';
 $('.mobile-library').append(panel);
 let refresh;const render=()=>{const r=startup.snapshot().sessions[0],active=r.phases.filter(p=>p.status==='pending'&&p.critical);panel.querySelector('#startup-progress').textContent=r.status==='loading'?(active.map(p=>p.label).join(' · ')||'Starting Kenjatime…'):`Startup ${r.status} in ${(r.elapsedMs/1000).toFixed(2)} s`;if(r.status==='loading'&&active.length)status(active.map(p=>p.label).join(' · '));const list=panel.querySelector('ol');list.replaceChildren(...r.phases.map(p=>{const li=document.createElement('li');li.textContent=`${p.label}: ${p.status} · ${p.durationMs} ms`;return li;}));if(r.status!=='loading'&&!r.phases.some(p=>p.status==='pending'))clearInterval(refresh);};
 startup.subscribe(render);render();panel.addEventListener('toggle',()=>{clearInterval(refresh);if(panel.open){render();if(startup.snapshot().sessions[0].status==='loading')refresh=setInterval(render,1000);}});
 panel.querySelector('#export-startup').onclick=async event=>{const button=event.currentTarget;button.disabled=true;try{await exportFile(new Blob([JSON.stringify(startup.snapshot(),null,2)],{type:'application/json'}),'kenjatime-startup-report.json');}catch(error){panel.querySelector('#startup-progress').textContent=error.message;}finally{button.disabled=false;}};
}
$('#drop').innerHTML='<div class="upload-icon">↥</div><div><b>Bring a new challenger.</b><p>Import a character or stage archive, or <button type="button" id="browse">browse files</button></p><small>ZIP / RAR / 7z / TAR · for split archives, select every part together</small><details class="archive-options"><summary>Archive password (optional)</summary><input id="archive-password" type="password" autocomplete="off" aria-label="Archive password"></details></div>';
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
 const step=startup?.begin('preview',{critical:false});try{await drawPreview(step);step?.end();}catch(error){step?.fail(error);throw error;}
}
async function drawPreview(step){
 disposePreview();const epoch=previewEpoch;if(!selected)return;$('#empty').hidden=true;
 const rival=catalog.characters.find(c=>c.id===$('#opponent-select').value)||selected,entries=[selected,rival],banks=new Map(),previewProblems=[];
 const images=await Promise.all(entries.map(async(entry,side)=>{
  try{
   if(!entry.sprite)throw Error('Missing SFF file');
   if(!banks.has(entry.sprite))banks.set(entry.sprite,resource(entry.sprite).then(async blob=>{
    // Preview giant SFF v1 banks through a bounded prefix; the full original
    // archive remains intact and is handed to the actual match renderer.
    const bytes=entry.spriteBytes>64*1024*1024
      ? await compactSffV1Preview(blob)
      : new Uint8Array(await blob.arrayBuffer());
    if(!bytes)throw Error('Large SFF preview unavailable');
    return sff(bytes);
   }));
   const bank=await banks.get(entry.sprite);if(epoch!==previewEpoch)return null;let frame;
   if(entry.anim)frame=animations(await (await resource(entry.anim)).text()).find(a=>a.id===0)?.frames[0];
   if(epoch!==previewEpoch)return null;
   const index=frame?bank.sprites.findIndex(s=>s.group===frame.group&&s.number===frame.number):bank.sprites.findIndex(s=>s.group===0&&s.number===0);if(index<0)throw Error('No idle preview');
   let sprite=bank.decode(index);try{sprite=bank.decodeWithPalette(index,1,+$(side?'#opponent-palette-select':'#palette-select').value);}catch{}
   const image=document.createElement('canvas');image.width=sprite.w;image.height=sprite.h;image.getContext('2d').putImageData(new ImageData(sprite.rgba,sprite.w,sprite.h),0,0);return image;
  }catch(error){previewProblems[side]=String(error?.message||error);return null;}
 }));
 for(const promise of banks.values())promise.then(bank=>bank.clearDecodedCache()).catch(()=>{});
 step?.note({decodedPreviews:images.filter(Boolean).length});
 if(epoch!==previewEpoch)return;grid();ctx.imageSmoothingEnabled=false;
 entries.forEach((entry,side)=>{const center=side?690:270,image=images[side];ctx.fillStyle=side?'#8fcfff':'#d3fb8d';ctx.font='28px system-ui';ctx.textAlign='center';ctx.fillText(`P${side+1} · ${entry.name}`,center,68,360);
  if(image){const scale=Math.min(2.2,340/image.width,320/image.height);ctx.save();ctx.translate(center,440);ctx.scale(side?-scale:scale,scale);ctx.drawImage(image,-image.width/2,-image.height);ctx.restore();}
  else{ctx.font='15px system-ui';const cause=previewProblems[side]||'Unknown sprite error';
   ctx.fillText(!entry.sprite?'Missing SFF sprite bank':entry.spriteBytes>64*1024*1024?'Large SFF preview unavailable':'Sprite preview unavailable',center,280);
   ctx.font='12px system-ui';ctx.fillText(!entry.sprite?'Reimport a complete character archive':entry.spriteBytes>64*1024*1024?'Full sprite bank remains available in fights':cause.slice(0,46),center,305);
  }
 });canvas.dataset.previewCount=String(images.filter(Boolean).length);canvas.setAttribute('aria-label',`Match preview: Player 1 ${selected.name}, Player 2 ${rival.name}`);
}
function remember(){try{localStorage.setItem(selectionKey,JSON.stringify({character:selected?.id,opponent:$('#opponent-select').value,stage:$('#stage-select').value,fxPackage:$('#effects-select').value,mode:$('#arena-mode').value,presentation:$('#presentation-select').value,endlessRounds:$('#endless-rounds').checked}));}catch{}}
function updateEndlessOption(){
 const training=$('#arena-mode').value==='training';
 $('#endless-rounds').disabled=training;
 $('#endless-rounds-note').textContent=training
   ? 'Endless Rounds requires a regular match, not Training mode.'
   : 'Automatically starts the next round after KO or time-out. Use Watch CPU match for unattended benchmarking.';
}
function choose(id){
 selected=catalog.characters.find(c=>c.id===id)||catalog.characters[0];if(!selected)return;
 $('#name').textContent=selected.name;$('#author').textContent=selected.author||'MUGEN character';$('#version').textContent=selected.version||'SFF / AIR';$('#viewtitle').textContent='MATCH PREVIEW · P1 / P2';
 $('#metadata').innerHTML=`<div class="meta"><span>Definition</span><b>${escape(selected.fileName)}</b></div><div class="meta"><span>Package</span><b>${escape(selected.packageName)}</b></div>`;
 $('#checks').innerHTML=['sprite','anim'].map(key=>`<div><span class="${selected[key]?'ok':'bad'}">${selected[key]?'✓':'!'}</span><b>${key.toUpperCase()}</b><span>${escape(selected[key]||'Not found')}</span></div>`).join('');$('#score').textContent=selected.sprite&&selected.anim?'INSTALLED':'CHECK FILES';
 $('#cards').querySelectorAll('.card').forEach(card=>card.classList.toggle('selected',card.dataset.id===selected.id));remember();void preview();
}
function drawCatalog(data){
 catalog=data;const old=selected?.id;let saved={};try{saved=JSON.parse(localStorage.getItem(selectionKey)||'{}');}catch{}
 $('#count').textContent=String(catalog.characters.length).padStart(2,'0');$('#cards').replaceChildren();
 const counts=new Map();for(const entry of catalog.characters)counts.set(entry.name,(counts.get(entry.name)||0)+1);
 const label=entry=>counts.get(entry.name)>1
   ? entry.name+' · '+((entry.version||'').match(/(?:19|20)\d{2}/)?.[0]||entry.packageName||entry.fileName)
   : entry.name;
 for(const entry of catalog.characters){const button=document.createElement('button');button.className='card';button.dataset.id=entry.id;button.innerHTML=`<span class="mini">拳</span><span><b>${escape(label(entry))}</b><small>${escape(entry.author||'MUGEN character')}</small></span><span class="card-arrow">↗</span>`;button.onclick=()=>choose(entry.id);$('#cards').append(button);}
 const options=(list,first)=>first+list.map(e=>`<option value="${escape(e.id)}">${escape(list===catalog.characters?label(e):e.name)}</option>`).join('');
 $('#opponent-select').innerHTML=options(catalog.characters,'<option value="">Mirror character</option>');$('#stage-select').innerHTML=options(catalog.stages,'');
 $('#effects-select').innerHTML='<option value="">From chosen stage / fighter (if included)</option>'+catalog.packages.filter(p=>p.commonEffects).map(p=>`<option value="${escape(p.id)}">${escape(p.name)}</option>`).join('');
 if(catalog.stages.some(s=>s.id===saved.stage))$('#stage-select').value=saved.stage;if(catalog.characters.some(c=>c.id===saved.opponent))$('#opponent-select').value=saved.opponent;if(catalog.packages.some(p=>p.id===saved.fxPackage&&p.commonEffects))$('#effects-select').value=saved.fxPackage;
 if(['solo','versus','cpu','training'].includes(saved.mode))$('#arena-mode').value=saved.mode;
 if(['widescreen-16-9','native-4-3'].includes(saved.presentation))$('#presentation-select').value=saved.presentation;
 $('#endless-rounds').checked=saved.endlessRounds===true;updateEndlessOption();
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
 $('#drop').addEventListener('drop',event=>{event.preventDefault();const files=Array.from(event.dataTransfer.files);if(files.length)void run('Reading archive…',async()=>{applyInstalled(await engineHost.importFile(files,{password:$('#archive-password').value}));$('#archive-password').value='';status('Archive installed. Your fighters and stages are ready to select.');});});
}
$('#sample').onclick=()=>choose(catalog.characters.find(c=>!c.packageId)?.id);$('#lab').onclick=()=>{$('.viewer').scrollIntoView({block:'start'});};$('#training').onclick=()=>{$('.arena-launch').scrollIntoView({block:'start'});};
for(const id of ['stage-select','effects-select','opponent-select','arena-mode','endless-rounds','palette-select','opponent-palette-select','presentation-select'])$('#'+id).onchange=()=>{if(id==='arena-mode')updateEndlessOption();remember();$('.stage-label').textContent=$('#stage-select').selectedOptions[0]?.textContent||'TRAINING GRID';if(id==='opponent-select'||id.includes('palette'))void preview();};
$('#fight-now').onclick=()=>void run('Preparing your match…',async()=>{
 if(!selected)throw Error('Import a character before starting a match.');
 const match={character:selected.id,opponent:$('#opponent-select').value||selected.id,stage:$('#stage-select').value,mode:$('#arena-mode').value,level:+$('#cpu-level').value,palette:+$('#palette-select').value,opponentPalette:+$('#opponent-palette-select').value,presentation:$('#presentation-select').value,endlessRounds:$('#endless-rounds').checked&&$('#arena-mode').value!=='training',fightfxPackageId:$('#effects-select').value};remember();disposePreview();await native('launch',match);
});
window.addEventListener('kenjatime:battle',event=>{if(!event.detail.active&&selected){void preview();status('Ready when you are.');}});
grid();void run('Opening your library…',async()=>{try{const data=await native('catalog');if(startup)startup.measure('catalog-render',()=>drawCatalog(data));else drawCatalog(data);startup?.finish(data.warning?'degraded':'ready');status(data.warning||'Ready when you are.');}catch(error){startup?.finish('failed');throw error;}});

}
