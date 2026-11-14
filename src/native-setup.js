import './style.css';
import './mobile.css';
import {appShell} from './app-shell.js';
import {sff,animations} from './formats.js';
import {libraryResetURL} from './library-recovery.js';
import {exportFile} from './export-file.js';
import {downloadArchiveFromUrl} from './remote-archive.js';

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
$('.viewer').insertAdjacentHTML('beforebegin','<section class="arena-launch" aria-label="Match setup"><label>Play mode <select id="arena-mode"><option value="solo">Player vs CPU</option><option value="versus">Two players</option><option value="cpu">Watch CPU match</option><option value="training">Training</option></select></label><label>Screen format <select id="presentation-select" aria-label="Match screen format"><option value="widescreen-16-9">16:9 Widescreen</option><option value="native-4-3">4:3 Native-style</option></select></label><button type="button" class="primary" id="fight-now">Fight now</button><span>Choose your fighter in the roster and your rival under Opponent.</span></section>');
// Sprite warmup is a selectable tradeoff: larger decoded CPU caches can
// make heavy imported MUGEN fighters smoother at the cost of slower loading.
const spriteCacheLabel=document.createElement('label');
spriteCacheLabel.className='sprite-cache-setting';
spriteCacheLabel.innerHTML='Sprite cache <select id="sprite-cache-mode" aria-label="Sprite preload and cache size"><option value="legacy">Legacy · 16 MiB CPU · no preload</option><option value="balanced">Balanced · 64 + 16 MiB hot · GPU 96</option><option value="extended" selected>Extended · 128 + 48 MiB hot · GPU 128–160</option><option value="maximum">Maximum · 192 + 64 MiB hot · GPU 160–192 (high RAM)</option></select>';
$('.arena-launch').insertBefore(spriteCacheLabel,$('#fight-now'));
const gameplayFirstLabel=document.createElement('label');
gameplayFirstLabel.className='gameplay-priority-setting';
gameplayFirstLabel.innerHTML='Frame scheduling <select id="gameplay-first-mode" aria-label="Simulation first or balanced rendering"><option value="gameplay" selected>Gameplay first · adaptive frameskip</option><option value="balanced">Balanced · previous 30 FPS backlog cap</option></select>';
$('.arena-launch').insertBefore(gameplayFirstLabel,$('#fight-now'));
// Benchmark-only match control: production pages do not set this flag.
if(document.body.dataset.r8Benchmark==='true'){
 const wrapper=document.createElement('label');wrapper.className='r8-endless-toggle';
 wrapper.innerHTML='<input id="endless-mode" type="checkbox"><span><strong>Endless Mode</strong><small>Unlimited rounds · KO resets fighters · no timer or match-ending win limit</small></span>';
 $('.arena-launch').insertBefore(wrapper,$('#fight-now'));
}
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
$('#drop').innerHTML='<div class="upload-icon">↥</div><div><b>Bring a new challenger.</b><p>Import ZIP / RAR / 7z / TAR from your device.</p><div class="archive-picker-actions"><button type="button" id="browse">Choose archive</button><button type="button" id="browse-split">Select split archive parts</button><button type="button" id="browse-all">Browse all files</button></div><small>Android: select Files / Internal storage / Downloads, not Photos. Use Browse all files if your archive is hidden. Split archives need every part selected together. Archive limit: 256 MiB compressed (512 MiB expanded). For large fighters, close other browser tabs first.</small><details class="archive-options"><summary>Archive password (optional)</summary><input id="archive-password" type="password" autocomplete="off" aria-label="Archive password"></details></div>';
$('#drop').insertAdjacentHTML('beforeend', "<section class=\"archive-alternate-import\" aria-label=\"Alternative ways to import an archive\">\n  <label for=\"direct-archive-file\">Direct device file selector</label>\n  <input id=\"direct-archive-file\" type=\"file\" aria-label=\"Choose a local archive directly\" />\n  <small>Uses a visible browser file control. It may work differently from the automatic Android picker, but Android still determines which storage apps appear.</small>\n  <label for=\"archive-url\">Or import from a direct HTTPS archive download</label>\n  <div class=\"archive-link-fields\">\n    <input id=\"archive-url\" type=\"url\" inputmode=\"url\" autocomplete=\"off\" spellcheck=\"false\" placeholder=\"https://example.com/fighter.zip\" aria-label=\"Direct HTTPS archive link\">\n    <button type=\"button\" id=\"import-archive-url\">Import link</button>\n  </div>\n  <small>The remote server must allow browser downloads (CORS). Google Drive preview/share-page links aren't direct downloads. Archives remain on this device after import.</small>\n</section>");
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
 step?.note({decodedPreviews:images.filter(Boolean).length});
 if(epoch!==previewEpoch)return;grid();ctx.imageSmoothingEnabled=false;
 entries.forEach((entry,side)=>{const center=side?690:270,image=images[side];ctx.fillStyle=side?'#8fcfff':'#d3fb8d';ctx.font='28px system-ui';ctx.textAlign='center';ctx.fillText(`P${side+1} · ${entry.name}`,center,68,360);
  if(image){const scale=Math.min(2.2,340/image.width,320/image.height);ctx.save();ctx.translate(center,440);ctx.scale(side?-scale:scale,scale);ctx.drawImage(image,-image.width/2,-image.height);ctx.restore();}
  else{ctx.font='15px system-ui';ctx.fillText('Preview unavailable',center,280);ctx.fillText('Ready to use in a match',center,305);}
 });canvas.dataset.previewCount=String(images.filter(Boolean).length);canvas.setAttribute('aria-label',`Match preview: Player 1 ${selected.name}, Player 2 ${rival.name}`);
}
function remember(){try{localStorage.setItem(selectionKey,JSON.stringify({character:selected?.id,opponent:$('#opponent-select').value,stage:$('#stage-select').value,fxPackage:$('#effects-select').value,mode:$('#arena-mode').value,presentation:$('#presentation-select').value,spriteCacheMode:$('#sprite-cache-mode').value,gameplayFirst:$('#gameplay-first-mode').value==='gameplay',...($('#endless-mode')?{endless:$('#endless-mode').checked}:{})}));}catch{}}
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
 if(['legacy','balanced','extended','maximum'].includes(saved.spriteCacheMode))
   $('#sprite-cache-mode').value=saved.spriteCacheMode;
 if(saved.gameplayFirst===false)$('#gameplay-first-mode').value='balanced';
 if(['widescreen-16-9','native-4-3'].includes(saved.presentation))$('#presentation-select').value=saved.presentation;
 if($('#endless-mode'))$('#endless-mode').checked=saved.endless===true;
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
async function pick(kind,{multiple=false,allFiles=false}={}){await run('Choose a character or stage archive…',async()=>{
 const result=await native('pickArchive',{kind,multiple,allFiles,password:$('#archive-password').value});
 $('#archive-password').value='';
 if(result.cancelled){status('Import cancelled. If Android only shows Photos, use the Files app or the Browse all files option.');return;}
 applyInstalled(result);status('Archive installed. Your fighters and stages are ready to select.');
});}

for(const [id,kind,options]of [
 ['upload','any',{}],['add-stage','stage',{}],['browse','any',{}],
 ['browse-split','any',{multiple:true}],['browse-all','any',{allFiles:true}]
]){
 const element=$('#'+id);
 element.onclick=event=>{event.preventDefault();void pick(kind,options);};
 element.onkeydown=event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();void pick(kind,options);}};
}
const directArchiveInput=$('#direct-archive-file');
directArchiveInput.addEventListener('change',()=>{
 const files=Array.from(directArchiveInput.files||[]);
 if(!files.length)return;
 void run('Reading the selected device archive…',async()=>{
  if(!engineHost.importFile)throw Error('Local archive import is unavailable.');
  try{
   applyInstalled(await engineHost.importFile(files,{password:$('#archive-password').value}));
   $('#archive-password').value='';
   status('Archive imported from this device. Choose your fighter or stage.');
  }finally{directArchiveInput.value='';}
 });
});
$('#import-archive-url').onclick=()=>void run('Downloading linked archive…',async()=>{
 if(!engineHost.importFile)throw Error('Archive importing is unavailable.');
 const file=await downloadArchiveFromUrl($('#archive-url').value,{onProgress:message=>status(message)});
 applyInstalled(await engineHost.importFile([file],{password:$('#archive-password').value}));
 $('#archive-password').value='';
 status('Archive downloaded and imported. Choose your fighter or stage.');
});
$('#archive-url').onkeydown=event=>{
 if(event.key==='Enter'){event.preventDefault();$('#import-archive-url').click();}
};
if(engineHost.importFile){
 $('#drop').addEventListener('dragover',event=>event.preventDefault());
 $('#drop').addEventListener('drop',event=>{event.preventDefault();const files=Array.from(event.dataTransfer.files);if(files.length)void run('Reading archive…',async()=>{applyInstalled(await engineHost.importFile(files,{password:$('#archive-password').value}));$('#archive-password').value='';status('Archive installed. Your fighters and stages are ready to select.');});});
}
$('#sample').onclick=()=>choose(catalog.characters.find(c=>!c.packageId)?.id);$('#lab').onclick=()=>{$('.viewer').scrollIntoView({block:'start'});};$('#training').onclick=()=>{$('.arena-launch').scrollIntoView({block:'start'});};
for(const id of ['stage-select','effects-select','opponent-select','arena-mode','palette-select','opponent-palette-select','presentation-select','sprite-cache-mode','gameplay-first-mode',...($('#endless-mode')?['endless-mode']:[])])$('#'+id).onchange=()=>{remember();$('.stage-label').textContent=$('#stage-select').selectedOptions[0]?.textContent||'TRAINING GRID';if(id==='opponent-select'||id.includes('palette'))void preview();};
$('#fight-now').onclick=()=>void run('Preparing your match…',async()=>{
 if(!selected)throw Error('Import a character before starting a match.');
 const match={character:selected.id,opponent:$('#opponent-select').value||selected.id,stage:$('#stage-select').value,mode:$('#arena-mode').value,level:+$('#cpu-level').value,palette:+$('#palette-select').value,opponentPalette:+$('#opponent-palette-select').value,presentation:$('#presentation-select').value,spriteCacheMode:$('#sprite-cache-mode').value,gameplayFirst:$('#gameplay-first-mode').value==='gameplay',fightfxPackageId:$('#effects-select').value,...($('#endless-mode')?{endless:$('#endless-mode').checked&&$('#arena-mode').value!=='training'}:{})};remember();disposePreview();await native('launch',match);
});
window.addEventListener('kenjatime:battle',event=>{if(!event.detail.active&&selected){void preview();status('Ready when you are.');}});
grid();void run('Opening your library…',async()=>{try{const data=await native('catalog');if(startup)startup.measure('catalog-render',()=>drawCatalog(data));else drawCatalog(data);startup?.finish(data.warning?'degraded':'ready');status(data.warning||'Ready when you are.');}catch(error){startup?.finish('failed');throw error;}});

}
