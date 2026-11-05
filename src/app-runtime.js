import {FrameClock} from './frame-clock.js';
import {TickInputBuffer,gamepadKeys} from './input-buffer.js';
import {GraphicsQuality} from './graphics.js';
import {CanvasRenderer,compositePlan,spriteBounds} from './canvas-renderer.js';
import {MemoryLRU} from './memory-cache.js';
import {PerformanceMonitor} from './performance.js';
import {sff, soundArchive, decodeText, animations} from './formats.js';
import {parseCommands, CommandBuffer} from './commands.js';
import {TrainingMatch, transformedBoxes} from './combat.js';
import {COMMON_STATES, COMMON_LIMITATIONS} from './common.js';
import {EffectsState,transformRgba} from './effects.js';
import {sampleAnimation,sampleFighterAnimation,tileOffsets,backgroundTileStep,parallaxScale,spriteRotation} from './rendering.js';
import {baseScale} from './coordinates.js';
import {readZipFile,zipAccept,unpackZip} from './uploads.js';
import {ZIP_LIMIT_MB} from './archive-limits.js';
import {characterScriptArchive} from './script-export.js';
import {mountTouchControls} from './touch-controls.js';
import {mountArena} from './arena.js';
import {combatRules as readCombatRules} from './combat-rules.js';
import {musicLoopPoints} from './audio.js';
import {ForceFeedbackState} from './haptics.js';
import {characterSpriteBank} from './palettes.js';

export function mountApp({arena=false}={}) {
  const dom=new Map();const $=selector=>{let element=dom.get(selector);if(!element?.isConnected){element=document.querySelector(selector);if(element)dom.set(selector,element);}return element;};
  const text=(selector,value)=>{const element=$(selector);if(element.textContent!==value)element.textContent=value;};
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  let roster = [], selected, pack, action, previewFrame = 0, previewElapsed = 0, importing=false;
  let playing = true, mode = 'preview', match, commandBuffer, dummyBuffer;
  let stages=[],selectedStage=null,player2Keys=new Set(),systemFiles=null;
  let spriteCache = new MemoryLRU({maxBytes:12*1024*1024,sizeOf:sp=>sp?(sp.w*sp.h*4+sp.rgba.byteLength+(sp.indices?.byteLength||0)+(sp.opaque?sp.w*sp.h*8:0)):0}), keys = new Set(), importDiagnostics = [];
  const clock=new FrameClock(),p1Input=new TickInputBuffer(),p2Input=new TickInputBuffer();let reportVersion='',dirty=true,renderScale=1,raf=0,renderVisible=true,lastPresentationTime=null;
  let savedGraphics='auto';try{savedGraphics=localStorage.getItem('kenjatime.graphics')||'auto';}catch{}
  const graphics=new GraphicsQuality({mode:new URLSearchParams(location.search).get('graphics')||savedGraphics,mobile:matchMedia('(pointer:coarse)').matches});
  let effects = new EffectsState(),commonResource=null,impactEffects=[],packs=new WeakMap(),resourceIds=new WeakMap(),nextResourceId=1;
  const paletteCache=new MemoryLRU({maxBytes:8*1024*1024,maxEntries:128,sizeOf:surface=>surface.width*surface.height*4});
  const decodedBanks=new Set(),parallaxCache=new MemoryLRU({maxBytes:8*1024*1024,maxEntries:4,sizeOf:surface=>surface.width*surface.height*4}),parallaxKeys=new Map();
  const playerPalettes=new WeakMap(),opponentPalettes=new WeakMap();

  $('#upload').textContent = '＋ Import character / stage / engine ZIP';
  $('.heading p').textContent = 'Import a character. Inspect its scripts. Test it in motion.';
  $('.tag i').textContent = '18';
  $('#drop small').textContent=`ZIP up to ${ZIP_LIMIT_MB} MB · nested folders supported · processed locally`;
  $('#file').accept=zipAccept;
  $('.notice').textContent = 'Script execution and collision-based combat are available in training. Character compatibility is incomplete; see the report below.';
  $('#hint').textContent = 'Inspect the character’s SFF sprites and AIR animations. Open training to execute its scripts.';
  $('#hud').innerHTML = '<label>PLAYER 1 <progress id="p1life" max="1000" value="1000"></progress></label><b>VS</b><label>TRAINING DUMMY <progress id="p2life" max="1000" value="1000"></progress></label>';
  $('.coordinates').innerHTML = 'X <span id="pos">0</span> &nbsp; Y <span id="posy">0</span> &nbsp; <span id="state"></span>';
  $('.transport').insertAdjacentHTML('afterend', `<div id="training-tools" class="training-tools" hidden>
    <label><input id="boxes" type="checkbox"> Collision boxes</label><label><input id="sound" type="checkbox" checked> Sound</label>
    <label>P1 control <select id="player-control"><option value="keyboard">Keyboard</option><option value="cpu">CPU</option></select></label>
    <label>P2 control <select id="dummy-mode"><option value="stand">Stand</option><option value="guard">Guard</option><option value="crouch">Crouch</option><option value="crouchguard">Crouch + guard</option><option value="cpu">CPU</option></select></label>
    <label>CPU level <select id="cpu-level" disabled>${Array.from({length:8},(_,i)=>`<option value="${i+1}" ${i===3?'selected':''}>${i+1}</option>`).join('')}</select></label>
    <button class="secondary" id="reset">Reset round</button></div>`);
  $('#training-tools').insertAdjacentHTML('beforeend','<label>Stage <select id="stage-select"><option value="-1">Training grid</option></select></label><label>Opponent <select id="opponent-select"><option value="-1">Mirror character</option></select></label><label>Mode <select id="match-mode"><option value="training">Training</option><option value="match">Match · first to 2</option></select></label>');
  $('#dummy-mode').insertAdjacentHTML('beforeend','<option value="keyboard">Keyboard P2 · numpad</option>');
  $('#training-tools').insertAdjacentHTML('beforeend','<label title="Ctrl+D"><input id="debug-text" type="checkbox"> Debug text</label>');
  $('#training-tools').insertAdjacentHTML('beforeend','<label>P1 palette <select id="palette-select"></select></label><label>P2 palette <select id="opponent-palette-select"></select></label>');
  $('.stage-label').innerHTML='TRAINING GRID <span id="round-status">LOCAL SESSION</span>';
  $('.stage').insertAdjacentHTML('beforeend','<div id="match-banner" aria-live="polite"></div>');
  $('.stage').insertAdjacentHTML('beforeend','<pre id="debug-output" hidden></pre><div id="victory-quote" hidden></div>');
  $('.roster').insertAdjacentHTML('beforebegin', `<section class="runtime-report" aria-label="Character compatibility report">
    <div class="report-heading"><div><h2>Compatibility report <span id="issue-count">—</span></h2><p id="runtime-summary">Select a fighter to inspect its runtime.</p></div><div class="report-actions"><button class="secondary" id="export-report" disabled>Download report</button><button class="secondary" id="export-scripts" title="Download DEF, AIR and state/command scripts without sprites or sound" disabled>Export character scripts</button></div></div>
    <p class="compatibility-note">${escape(COMMON_LIMITATIONS)} Helpers, projectiles, foreign-state throws, pauses and visual effects run in training. Some controller options, combat rules, palettes, stages and match systems remain incomplete. A clean report is not certification of full compatibility.</p>
    <details id="issues"><summary>Controller and trigger diagnostics</summary><div id="diagnostics"><p>No fighter selected.</p></div></details></section>`);
  const performanceMonitor=new PerformanceMonitor({enabled:new URLSearchParams(location.search).get('perf')==='1'});
  const canvas = $('canvas'), ctx = performanceMonitor.track(canvas.getContext('2d'));
  const renderer=new CanvasRenderer(ctx,{track:context=>performanceMonitor.track(context)});
  $('#training-tools').insertAdjacentHTML('beforeend','<label>Graphics <select id=graphics-mode aria-label="Graphics quality"><option value=auto>Auto</option><option value=high>High</option><option value=balanced>Balanced</option><option value=low>Low · 30 FPS</option></select></label><label><input id=performance-toggle type=checkbox> Performance</label>');
  $('#graphics-mode').value=graphics.mode;$('#performance-toggle').checked=performanceMonitor.enabled;
  $('.stage').insertAdjacentHTML('beforeend','<pre id=performance-overlay hidden aria-live=off style="position:absolute;top:36px;right:8px;background:#000c;padding:8px;color:#dfb;font:11px monospace;pointer-events:none"></pre>');
  const touch=mountTouchControls($('.viewer'),value=>{p1Input.record('touch',value,performance.now());dirty=true;});
  canvas.tabIndex = 0; canvas.setAttribute('aria-label', 'Character preview and training stage');
  ctx.imageSmoothingEnabled = false;
  function status(message) { $('#status').textContent = message; }
  function issue(message, type = 'media') {
    if (!importDiagnostics.some(d => d.message === message)) importDiagnostics.push({type, source: selected?.path || '', line: 0, message});
  }

  class CharacterAudio {
    constructor() { this.context = null; this.banks = new WeakMap();this.nextBankId=1; this.buffers = new Map(); this.channels = new Map(); this.panners=new Map(); this.requests = new Map(); this.generation = 0; this.nextChannel = 0; this.requestId = 0;this.musicStage=null;this.musicGeneration=0;this.musicSource=null;this.musicPending=null; }
    stop(channel) {
      for (const key of this.requests.keys()) if (channel === undefined || key === channel || channel.endsWith(':*') && key.startsWith(channel.slice(0, -1))) this.requests.delete(key);
      for (const [key, source] of this.channels) if (channel === undefined || key === channel) {
        try { source.stop(); } catch { /* Already finished. */ }
        this.channels.delete(key);
        this.panners.delete(key);
      }
    }
    reset(character) {
      this.generation++; this.stop(); this.banks = new WeakMap(); this.buffers.clear();this.banksFor(character);
    }
    banksFor(character){
      if(this.banks.has(character))return this.banks.get(character);
      const banks={id:this.nextBankId++};
      const sound = character.checks.find(c => c.key === 'sound' && c.ok);
      const common = Object.keys(character.files).find(path => /(?:^|\/)data\/common\.snd$/.test(path));
      for (const [name, path] of [['character', sound?.path], ['common', common]]) if (path) {
        try { banks[name] = soundArchive(character.files[path]); } catch (error) { issue(`Sound archive: ${error.message}`); }
      }
      banks.common ||= this.systemSound;this.banks.set(character,banks);return banks;
    }
    setSystem(files){this.systemSound=null;const path=Object.keys(files||{}).find(p=>/(?:^|\/)data\/common\.snd$/.test(p));if(path)try{this.systemSound=soundArchive(files[path]);}catch(error){issue(`Common sound bank: ${error.message}`);}this.banks=new WeakMap();}
    stopMusic(){this.musicGeneration++;if(this.musicSource){try{this.musicSource.stop();}catch{}this.musicSource=null;}this.musicPending=null;}
    setMusic(stage){if(stage===this.musicStage)return;this.stopMusic();this.musicStage=stage;if(this.context?.state==='running')void this.startMusic();}
    async startMusic(){
      const stage=this.musicStage;if(!stage?.music.path||!$('#sound').checked||this.musicSource||this.musicPending||this.context?.state!=='running')return;
      if(/\.(?:mid|midi|mod|s3m|xm|it)$/i.test(stage.music.path)){issue(`Stage music ${stage.music.requested} needs a codec not supplied by this browser.`,'unsupported-music');return;}
      const generation=this.musicGeneration,pending={generation};this.musicPending=pending;
      try{
        const buffer=await this.context.decodeAudioData(stage.files[stage.music.path].slice().buffer);
        if(generation!==this.musicGeneration||!$('#sound').checked)return;
        const source=this.context.createBufferSource(),gain=this.context.createGain();source.buffer=buffer;source.loop=stage.music.loop;
        const loop=musicLoopPoints(stage.files[stage.music.path],stage.music,buffer.duration);source.loopStart=loop.start;source.loopEnd=loop.end;
        if(stage.music.loop&&!loop.exact)issue('Stage music loop points could not be resolved; the full track will repeat.','unsupported-music-loop');
        gain.gain.value=Math.max(0,Math.min(4,stage.music.volume/100));source.connect(gain);gain.connect(this.context.destination);source.start();this.musicSource=source;
        source.onended=()=>{if(this.musicSource===source)this.musicSource=null;};
      }catch(error){issue(`Stage music: ${error.message}`,'music');}
      finally{if(this.musicPending===pending)this.musicPending=null;}
    }
    async unlock() {
      if (!$('#sound').checked) return;
      const Context = window.AudioContext || window.webkitAudioContext;
      if (!Context) { issue('This browser does not support Web Audio.'); return; }
      try { this.context ||= new Context(); await this.context.resume();void this.startMusic(); } catch (error) { issue(`Audio: ${error.message}`); }
    }
    async consume(events, player,character=selected) {
      for (const event of events || []) {
        const type = String(event.type).toLowerCase();
        if (type === 'stopsnd') {
          if (event.channel === -1) { for (const channel of new Set([...this.channels.keys(), ...this.requests.keys()])) if (channel.startsWith(player + ':')) this.stop(channel); }
          else this.stop(`${player}:${event.channel ?? 0}`);
          continue;
        }
        if (type === 'hit') { this.stop(`${player}:0`); continue; }
        if (type === 'sndpan') {
          const pan=this.panners.get(`${player}:${event.channel??0}`);if(pan)pan.pan.value=Math.max(-1,Math.min(1,Number(event.abspan??event.pan??0)/240));continue;
        }
        if (type !== 'playsnd' || !$('#sound').checked) continue;
        const bank = event.common ? 'common' : 'character';
        const group = event.group ?? event.value?.[0], number = event.number ?? event.value?.[1];
        const banks=this.banksFor(character),bytes = (banks[bank]||(bank==='common'?this.banks.get(selected)?.common:null))?.get(group, number);
        if (!bytes) { issue(`Sound ${bank} ${group},${number} is unavailable.`); continue; }
        if (!this.context || this.context.state !== 'running') continue;
        const generation = this.generation, key = `${banks.id}:${bank}:${group},${number}`;
        const requestedChannel = Number(event.channel ?? -1);
        const channel = `${player}:${requestedChannel < 0 ? `free-${this.nextChannel++}` : requestedChannel}`;
        if (event.lowpriority && this.channels.has(channel)) continue;
        if (this.requests.size >= 128) { issue('Audio voice limit reached (128 voices).'); continue; }
        this.stop(channel);
        const requestId = ++this.requestId; this.requests.set(channel, requestId);
        try {
          if (!this.buffers.has(key)) this.buffers.set(key, this.context.decodeAudioData(bytes.slice().buffer));
          const buffer = await this.buffers.get(key);
          if (generation !== this.generation || !$('#sound').checked || this.requests.get(channel) !== requestId) continue;
          const source = this.context.createBufferSource(), gain = this.context.createGain();
          source.buffer = buffer; source.loop = Boolean(event.loop);
          source.playbackRate.value = Math.max(0.01, Math.min(16, Number(event.freqMul ?? event.freqmul ?? 1)));
          gain.gain.value = Math.max(0, Math.min(4, event.volumeScale !== undefined ? event.volumeScale / 100 : 1 + (event.volume || 0) / 256));
          source.connect(gain);
          if (this.context.createStereoPanner) { const pan = this.context.createStereoPanner(); pan.pan.value = Math.max(-1, Math.min(1, Number(event.abspan ?? event.pan ?? 0) / 240)); gain.connect(pan); pan.connect(this.context.destination);this.panners.set(channel,pan); }
          else gain.connect(this.context.destination);
          source.start();
          this.channels.set(channel, source);
          source.onended = () => { if (this.channels.get(channel) === source) { this.channels.delete(channel); this.panners.delete(channel);this.requests.delete(channel); } };
        } catch (error) { this.requests.delete(channel); if (generation === this.generation) issue(`Sound ${group},${number}: ${error.message}`); }
      }
    }
  }
  const audio = new CharacterAudio();
  const haptics=new ForceFeedbackState({onIssue:message=>issue(message,'gamepad')});
  async function load(bytes) {
    try {
      const {files,characters,stages:importedStages}=await unpackZip(bytes,{onProgress:status});
      if(!characters.length&&!importedStages.length)throw Error('No character or stage DEF found in the ZIP.');
      if(Object.keys(files).some(path=>/(?:^|\/)data\/(?:fightfx\.sff|common\.snd)$/.test(path))){systemFiles=files;audio.setSystem(files);}
      roster.push(...characters);stages.push(...importedStages);renderStageOptions();renderOpponentOptions();
      if(characters.length){if(!selectedStage&&importedStages.length)selectedStage=importedStages.find(s=>/training/i.test(s.name))||importedStages[0];select(roster.length-characters.length);}
      else if(importedStages.length){selectedStage=importedStages[0];if(selected)configureMatch();renderStageOptions();}
      status(`Imported ${characters.length} character${characters.length!==1?'s':''} and ${importedStages.length} stage${importedStages.length!==1?'s':''}. Files stay on your device.`);
    } catch (error) { status(`Import failed: ${error.message}`); }
  }
  function renderStageOptions(){
    $('#stage-select').innerHTML='<option value="-1">Training grid</option>'+stages.map((s,i)=>`<option value="${i}" ${s===selectedStage?'selected':''}>${escape(s.name)}</option>`).join('');
  }
  function renderOpponentOptions(){
    const prior=$('#opponent-select').value;$('#opponent-select').innerHTML='<option value="-1">Mirror character</option>'+roster.map((c,i)=>`<option value="${i}">${escape(c.def.info.displayname||c.def.info.name||c.path)}</option>`).join('');
    if(roster[+prior])$('#opponent-select').value=prior;
  }
  function configureMatch(){
    dirty=true;if(!selected)return;
    parallaxCache.clear();parallaxKeys.clear();drawPool.length=drawLayers.length=drawActors.length=0;paletteCache.clear();spriteCache.clear();for(const bank of decodedBanks)bank.clearDecodedCache?.();decodedBanks.clear();
    touch.panel.hidden=mode!=='training'||$('#player-control').value==='cpu';
    $('#cpu-level').disabled=$('#player-control').value!=='cpu'&&$('#dummy-mode').value!=='cpu';
    try{
      const opponentCharacter=roster[+$('#opponent-select').value]||selected;
      for(const [character,choices,selector]of [[selected,playerPalettes,'#palette-select'],[opponentCharacter,opponentPalettes,'#opponent-palette-select']]){
        const bank=spriteBank(character);if(!bank.selectablePalettes.includes(choices.get(character)))choices.set(character,bank.defaultPalette);
        $(selector).innerHTML=bank.selectablePalettes.map(number=>`<option value="${number}" ${number===choices.get(character)?'selected':''}>${number}</option>`).join('');
      }
      match=new TrainingMatch(selected,{commonText:COMMON_STATES,commonAnimations:new Map((commonResource?.animations||[]).map(a=>[a.id,a])),stage:selectedStage,skipIntro:$('#match-mode').value!=='match',combatRules:readCombatRules(systemFiles||selected.files),
        opponentCharacter,playerPalette:playerPalettes.get(selected),opponentPalette:opponentPalettes.get(opponentCharacter),playerAILevel:$('#player-control').value==='cpu'?+$('#cpu-level').value:0,opponentAILevel:$('#dummy-mode').value==='cpu'?+$('#cpu-level').value:0,rules:$('#match-mode').value==='match'?{roundsToWin:2}:null});
      const opponent=match.opponent.character,cmd=opponent.checks.find(c=>c.key==='cmd'&&c.ok);
      dummyBuffer=new CommandBuffer(parseCommands(cmd?decodeText(opponent.files[cmd.path]):''));
      keys.clear();p1Input.reset();player2Keys.clear();p2Input.reset();touch.reset();commandBuffer?.reset();effects=new EffectsState();impactEffects=[];audio.stop();haptics.stop();audio.setMusic(selectedStage);clock.suspend();reportVersion='';
      const labels=$('#hud').querySelectorAll('label');labels[0].firstChild.textContent=`P1 · ${match.player.name} `;labels[1].firstChild.textContent=`P2 · ${match.opponent.name} `;
      $('.stage-label').firstChild.textContent=(selectedStage?.name||'TRAINING GRID').toUpperCase()+' ';
      $('#reset').textContent=match.roundFlow?'Restart match':'Reset round';
      renderStageOptions();
      updateHint();
    }catch(error){match=null;issue(`Match setup: ${error.message}`,'stage');status(error.message);}
  }
  function renderCards() {
    $('#count').textContent = String(roster.length).padStart(2, '0');
    $('#cards').innerHTML = roster.map((c, i) => `<button class="card ${c === selected ? 'selected' : ''}" data-id="${i}"><span class="mini">拳</span><span><b>${escape(c.def.info.displayname || c.def.info.name || 'Unnamed')}</b><small>${escape(c.def.info.author || 'Unknown author')}</small></span><span class="card-arrow">↗</span></button>`).join('');
    $('#cards').querySelectorAll('button').forEach(button => button.onclick = () => select(+button.dataset.id));
  }
  function select(index) {
    dirty=true;selected = roster[index];for(const bank of decodedBanks)bank.clearDecodedCache?.();decodedBanks.clear();spriteCache.clear();parallaxCache.clear();parallaxKeys.clear(); keys.clear();p1Input.reset(); importDiagnostics = [];
    audio.stop(); audio.generation++;
    effects=new EffectsState();impactEffects=[];packs=new WeakMap();resourceIds=new WeakMap();paletteCache.clear();commonResource=null;
    pack = null; match = null; commandBuffer = null; dummyBuffer = null; previewFrame = 0; previewElapsed = 0; clock.suspend(); reportVersion = '';
    action = selected.animations.find(a => a.id === 0) || selected.animations[0];
    $('#name').textContent = selected.def.info.displayname || selected.def.info.name || 'Unnamed';
    $('#author').textContent = `by ${selected.def.info.author || 'Unknown author'}`;
    $('#metadata').innerHTML = [['MUGEN version', selected.def.info.mugenversion || 'Unspecified'], ['Coordinates', selected.def.info.localcoord || '320, 240'], ['Animations', selected.animations.length], ['Definition', selected.path]].map(([key, value]) => `<div class="meta"><span>${key}</span><b title="${escape(value)}">${escape(value)}</b></div>`).join('');
    $('#score').textContent = `${selected.checks.filter(c => c.ok).length}/${selected.checks.length}`;
    $('#checks').innerHTML = selected.checks.map(c => `<div><span class="${c.ok ? 'ok' : 'bad'}">${c.ok ? '✓' : '!'}</span><b>${escape(c.key.toUpperCase())}</b><span title="${escape(c.message||c.value)}">${escape(c.value)}</span><small>${c.ok ? 'FOUND' : 'MISSING'}</small></div>`).join('');
    $('#actions').innerHTML = selected.animations.map((a, i) => `<option value="${i}" ${a === action ? 'selected' : ''}>Action ${a.id}${a.id === 0 ? ' · Idle' : ''}</option>`).join('');
    for (const animation of selected.animations) {
      for (const d of animation.diagnostics || []) issue(`AIR action ${animation.id}: ${typeof d === 'string' ? d : d.message}`, 'animation');
    }
    try {
      if (!selected.sprite) throw Error('Sprite file is missing');
      pack = spriteBank(selected);
      packs.set(selected,pack);
      const commonFiles=Object.keys(selected.files).some(path=>/(?:^|\/)data\/fightfx\.sff$/.test(path))?selected.files:systemFiles||selected.files;
      const commonSff=Object.keys(commonFiles).find(path=>/(?:^|\/)data\/fightfx\.sff$/.test(path));
      const commonAir=commonSff?.replace(/\.sff$/,'.air');
      if(commonSff&&commonFiles[commonAir]){
        try{commonResource={path:commonSff,files:commonFiles,sprite:{path:commonSff},animations:animations(decodeText(commonFiles[commonAir]))};
        packs.set(commonResource,sff(commonFiles[commonSff]));}catch(error){commonResource=null;issue(`Common effect bank: ${error.message}`);}
      }
      $('#version').textContent = `SFF v${pack.version} · ${pack.sprites.length} SPRITES`; $('#empty').hidden = true;
    } catch (error) { $('#empty').hidden = false; $('#empty').textContent = error.message; issue(error.message); }
    try {
      const cmd = selected.checks.find(c => c.key === 'cmd' && c.ok);
      const parsed = parseCommands(cmd ? decodeText(selected.files[cmd.path]) : '');
      importDiagnostics.push(...parsed.diagnostics.map(d => ({...d, source: cmd?.path, type: 'command'})));
      commandBuffer = new CommandBuffer(parsed); dummyBuffer = new CommandBuffer(parsed);
      audio.reset(selected);configureMatch();
      status('Character loaded. Open training to test CNS and CMD scripts.');
    } catch (error) { issue(`Runtime initialization: ${error.message}`, 'runtime'); status(`Runtime initialization failed: ${error.message}`); }
    $('#export-report').disabled = $('#export-scripts').disabled = false; renderCards(); updateReport();
  }
  function diagnostics() {
    const all = [...importDiagnostics, ...(match?.diagnostics || []),...effects.diagnostics, ...(commandBuffer?.diagnostics || []), ...(dummyBuffer?.diagnostics || [])], seen = new Set();
    return all.filter(d => { const key = `${d.source}:${d.line}:${d.type}:${d.message}`; if (seen.has(key)) return false; seen.add(key); return true; });
  }
  function updateReport() {
    if (!selected) return;
    const list = diagnostics(), signature = JSON.stringify(list); if (signature === reportVersion) return;
    reportVersion = signature; $('#issue-count').textContent = list.length;
    const states = match?.player.program?.states?.size ?? 0;
    $('#runtime-summary').textContent = `${states} state definitions loaded · ${list.length} reported issue${list.length === 1 ? '' : 's'} · runtime coverage is incomplete.`;
    $('#diagnostics').innerHTML = list.length ? list.map(d => `<div class="diagnostic"><b>${escape(d.type || d.kind || 'runtime')}</b><code>${escape(d.source || selected.path)}${d.line ? ':' + d.line : ''}</code><p>${escape(d.message)}</p></div>`).join('') : '<p>No issues detected yet. Play different moves to exercise additional controllers and triggers.</p>';
  }
  $('#export-report').onclick = () => {
    const explod=e=>({id:e.id,anim:e.anim,space:e.space,pos:{...e.pos},time:e.time,frameIndex:e.frameIndex,bindtime:e.bindtime,ownpal:e.ownpal,coordinateScale:e.coordinateScale,angle:e.angle,xangle:e.xangle,yangle:e.yangle,facing:e.facing,vfacing:e.vfacing,scale:e.scale});
    const snapshot=actor=>actor?{id:actor.id,teamSide:actor.teamSide,name:actor.name,stateNo:actor.stateNo,stateOwner:actor.stateOwner.id,animationOwner:actor.animationOwner.id,coordinateScale:actor.coordinateScale,baseCoordinateScale:actor.baseCoordinateScale,time:actor.time,anim:actor.anim,ctrl:actor.ctrl,stateType:actor.stateType,moveType:actor.moveType,physics:actor.physics,variables:{int:[...actor.vars],float:[...actor.fvars],systemInt:[...actor.sysvars],systemFloat:[...actor.sysfvars]},pos:{...actor.pos},vel:{...actor.vel},getHitVars:{...actor.getHitVars},hitCount:actor.hitCount,uniqHitCount:actor.uniqHitCount,comboHits:actor.comboHits,moveContact:actor.moveContact,moveHit:actor.moveHit,moveGuarded:actor.moveGuarded,moveReversed:actor.moveReversed||0,hitTime:actor.hitTime,hitPauseTime:actor.hitPauseTime,damageMultipliers:{attack:actor.attackMultiplier,defence:actor.defenceMultiplier,fallDefence:actor._fallDefenceMultiplier},hitId:actor.hitId,hitSourceId:actor.hitSourceId,targets:actor.targets.map(target=>target.id),rawInput:[...actor.rawInput],life:actor.life,power:actor.power,aiLevel:actor.aiLevel,commands:[...actor.commands],clipboard:actor.clipboard,victoryQuoteIndex:actor.victoryQuoteIndex,victoryQuote:actor.victoryQuote,paletteNo:actor.paletteNo,paletteRemaps:[...actor.paletteRemaps],explods:actor.explods.map(explod),renderedExplods:actor.drawExplods.map(explod)}:null;
    const data = {graphics:{mode:graphics.mode,preset:graphics.preset,...graphics.settings},performance:performanceMonitor.enabled?performanceMonitor.snapshot():undefined,character: selected?.def.info.name, definition: selected?.path, engine: 'MUGEN Web Lab', completeCompatibility: false, combatRules:match?.combatRules, generatedAt: new Date().toISOString(), issues: diagnostics(), player:snapshot(match?.player),opponent:snapshot(match?.opponent),entities:match?.entities.map(snapshot),helperRelationships:match?.entities.filter(actor=>actor.parent).map(actor=>({id:actor.id,helperId:actor.helperId,parentId:actor.parent.id,parentExists:!actor.parent.destroyed,rootId:actor.root.id,keyctrl:actor.keyCtrl,ownpal:actor.ownPal})),orphanExplods:match?.orphanEffectOwners.flatMap(owner=>owner.drawExplods.map(effect=>({...explod(effect),creatorId:owner.id}))),projectiles:match?.drawProjectiles.map(p=>({id:p.id,projId:p.projId,ownerId:p.owner.id,creatorId:p.creator.id,coordinateScale:p.coordinateScale,baseCoordinateScale:p.baseCoordinateScale,facing:p.facing,time:p.time,pos:{...p.pos},vel:{...p.vel},anim:p.anim,frameIndex:p.collisionFrameIndex,frameTime:p.collisionFrameTime,removing:p.removing,removed:p.removed,remainingHits:p.remainingHits,hitPauseTime:p.hitPauseTime,activeTicks:p.activeTicks,pauseMoveTimeRemaining:p.pauseMoveTime,superMoveTimeRemaining:p.superMoveTime,removalReason:p.removalReason,removalStarted:!!p.removalStarted,misstimeRemaining:Math.max(0,p.nextHitAge-p.activeTicks-1),shadow:!!p.spec.projshadow})),
      paletteState:match?[...match.entities,...match.drawProjectiles].map(p=>({id:p.id,paletteNo:p.paletteNo??p.creator?.paletteNo,ownpal:p.isProjectile?!!p.ownPal:!p.parent||!!p.ownPal,localEffects:effects.paletteFor(p,{includeAll:false}).layers,remaps:[...p.paletteRemaps]})):null,
      interactionState:match?.entities.map(p=>({id:p.id,playerPush:p.playerPush,screenBound:p.screenBound,moveCamera:{...p.moveCamera},inGuardDist:!!p.inGuardDistance,projectileContactShield:!!p._projectileContactShield})),
      stage:match?.stage?{path:match.stage.definition.path,name:match.stage.definition.name,camera:{...match.stage.camera},backgroundTime:match.stage.time}:null,
      match:match?.roundFlow?{roundNo:match.roundFlow.roundNo,phase:match.roundFlow.roundState,timeLeft:match.roundFlow.timeLeft,wins:match.roundFlow.wins,matchOver:match.roundFlow.matchOver}:null};
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], {type:'application/json'}));
    const link = document.createElement('a'); link.href = url; link.download = 'mugen-compatibility-report.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  $('#export-scripts').onclick=()=>{if(!selected)return;try{const bytes=characterScriptArchive(selected),url=URL.createObjectURL(new Blob([bytes],{type:'application/zip'})),link=document.createElement('a');link.href=url;link.download='mugen-character-scripts.zip';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}catch(error){status(`Script export failed: ${error.message}`);}};
  function spriteBank(resource){
    if(!packs.has(resource)){
      const bank=resource.def?.files?.sprite?characterSpriteBank(resource):sff(resource.files[resource.sprite.path]);packs.set(resource,bank);
      for(const diagnostic of bank.diagnostics||[])issue(diagnostic.message,diagnostic.type);
    }const bank=packs.get(resource);decodedBanks.add(bank);return bank;
  }
  function sprite(group, number,resource=selected,remaps=null) {
    if (!resource || group < 0 || number < 0) return null;
    let bank;try{bank=spriteBank(resource);}catch(error){issue(`Sprite bank: ${error.message}`);return null;}if(!resourceIds.has(resource))resourceIds.set(resource,nextResourceId++);
    bank.spriteIndex||=new Map(bank.sprites.map((sp,index)=>[`${sp.group},${sp.number}`,index]));const index=bank.spriteIndex.get(`${group},${number}`)??-1;
    let original;try{if(index>=0)original=bank.decode(index);}catch(error){issue(`Sprite ${group},${number}: ${error.message}`);return null;}
    const sourcePalette=bank.palettes?.[original?.palette],remap=remaps?.get(sourcePalette?`${sourcePalette.group},${sourcePalette.number}`:'')||remaps?.get('*');
    const key = `${resourceIds.get(resource)}:${group},${number}${remap?':pal'+remap.join(','):''}`; if (spriteCache.has(key)) return spriteCache.get(key);
    if (index < 0) { issue(`Missing sprite ${key}.`); spriteCache.set(key, null); return null; }
    try {
      let decoded=original;if(remap)try{decoded=bank.decodeWithPalette(index,...remap);}catch(error){issue(`Palette ${remap.join(',')}: ${error.message}`,'palette');}
      const surface = document.createElement('canvas'); surface.width = decoded.w; surface.height = decoded.h;
      surface.getContext('2d').putImageData(new ImageData(decoded.rgba, decoded.w, decoded.h), 0, 0);
      const result = {...decoded, canvas:surface,key,indexed:bank.version===1||!!decoded.indices}; spriteCache.set(key, result); return result;
    } catch (error) { issue(`Sprite ${key}: ${error.message}`); spriteCache.set(key, null); return null; }
  }
  function constant(fighter, key, fallback = 1) { const value = fighter?.program?.constants?.get(key); return Number.isFinite(Number(value)) ? Number(value) : fallback; }
  const pixelSurface=document.createElement('canvas');pixelSurface.width=960;pixelSurface.height=540;const pixelContext=performanceMonitor.track(pixelSurface.getContext('2d'));
  function writePixels(pixels,left,top){pixelContext.putImageData(pixels,left,top);ctx.save();ctx.resetTransform();ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.drawImage(pixelSurface,left,top,pixels.width,pixels.height,left,top,pixels.width,pixels.height);ctx.restore();}
  function coloredSprite(sp,palette,brightness=1){
    if(!palette?.layers?.length&&brightness===1)return sp.canvas;
    const key=sp.key+':'+(palette?.key||'')+':'+brightness;if(paletteCache.has(key))return paletteCache.get(key);
    const surface=document.createElement('canvas');surface.width=sp.w;surface.height=sp.h;
    const rgba=transformRgba(sp.rgba,palette);if(brightness!==1)for(let i=0;i<rgba.length;i+=4)for(let c=0;c<3;c++)rgba[i+c]=Math.round(rgba[i+c]*brightness);
    surface.getContext('2d').putImageData(new ImageData(rgba,sp.w,sp.h),0,0);
    paletteCache.set(key,surface);
    return surface;
  }
  function opaqueSprite(sp){
    if(!sp.indexed)return sp;if(sp.opaque)return sp.opaque;
    const rgba=new Uint8ClampedArray(sp.rgba);for(let i=3;i<rgba.length;i+=4)if(!sp.indices||sp.indices[(i-3)/4]===0)rgba[i]=255;
    const surface=document.createElement('canvas');surface.width=sp.w;surface.height=sp.h;surface.getContext('2d').putImageData(new ImageData(rgba,sp.w,sp.h),0,0);
    sp.opaque={...sp,rgba,canvas:surface,key:sp.key+':opaque'};spriteCache.set(sp.key,sp);return sp.opaque;
  }
  function drawFrame(frame, x, y, facing = 1, scaleX = 1, scaleY = 1, angle = 0, resource=selected,palette=null,trans=null,remaps=null,opaque=false,xangle=0,yangle=0) {
    if (!frame) return; let sp = sprite(frame.group, frame.number,resource,remaps); if (!sp) return;if(opaque)sp=opaqueSprite(sp);
    const flip = (frame.flip || '').toUpperCase(); ctx.save(); ctx.translate(x, y); ctx.scale(facing * scaleX, scaleY);
    ctx.translate(frame.x, frame.y); ctx.scale((flip.includes('H') ? -1 : 1) * (frame.scaleX ?? 1), (flip.includes('V') ? -1 : 1) * (frame.scaleY ?? 1));
    if(frame.angle||angle||xangle||yangle){
      const rotation=spriteRotation(Number(frame.angle||0)%360+angle%360,xangle,yangle);
      if(Math.abs(rotation.a*rotation.d-rotation.b*rotation.c)<1e-12){ctx.restore();return;}
      ctx.transform(rotation.a,rotation.b,rotation.c,rotation.d,0,0);
    }
    let blend=frame.blend||'';
    if(typeof trans==='string')blend=trans;
    else if(trans&&trans.mode!=='default')blend=trans.mode==='sub'?'S':trans.mode==='none'?'':trans.mode==='add1'?'A1':`AS${trans.alpha?.[0]??256}D${trans.alpha?.[1]??256}`;
    const bounds=spriteBounds(ctx.getTransform(),-sp.x,-sp.y,sp.w,sp.h,canvas.width,canvas.height);
    if(bounds.width&&bounds.height){const plan=compositePlan(blend),surface=coloredSprite(sp,palette,plan.brightness);renderer.draw(surface,-sp.x,-sp.y,plan,bounds);}
    ctx.restore();
  }
  function worldScale() { return 2.2 * 320 / (parseInt(selected?.def.info.localcoord, 10) || 320); }
  function fighterPose(fighter){return sampleFighterAnimation(fighter);}
  function drawFighter(fighter) {
    const scale = 2.2, spriteScale = scale * baseScale(fighter);
    const pose=fighterPose(fighter);
    if (!fighter.asserted.has('invisible')) drawFrame(pose,
      480 + (fighter.pos.x + (fighter.drawOffset?.x || 0) + constant(fighter, 'size.draw.offset.x', 0) * baseScale(fighter) * fighter.facing) * scale,
      440 + (fighter.pos.y + (fighter.drawOffset?.y || 0) + constant(fighter, 'size.draw.offset.y', 0) * baseScale(fighter)) * scale,
      fighter.facing, spriteScale * constant(fighter, 'size.xscale') * (fighter.drawScale?.x ?? 1), spriteScale * constant(fighter, 'size.yscale') * (fighter.drawScale?.y ?? 1), fighter.angleDraw?fighter.angle:0,fighter.character,effects.paletteFor(fighter),fighter.trans,fighter.paletteRemaps);
    if ($('#boxes').checked) for (const [kind, color] of [['clsn2','#58aaff'], ['clsn1','#ff6675']]) {
      ctx.strokeStyle = color; ctx.lineWidth = 2;
      for (const [left, top, right, bottom] of transformedBoxes(fighter, kind)) ctx.strokeRect(480 + left * scale, 440 + top * scale, (right - left) * scale, (bottom - top) * scale);
    }
  }
  function drawExplod(fighter, effect,layout=stageLayout()) {
    const frame = sampleAnimation(effect.animation,effect.frameIndex,effect.frameTime);
    const scale = effect.scale || [1, 1];
    const coordinate=effect.common?1:effect.coordinateScale??fighter.coordinateScale;
    const source=effect.source||effect,remaps=effect.common?null:effect.ownpal?source.paletteRemaps:fighter.paletteRemaps;
    ctx.save();let x=480+effect.pos.x*2.2,y=440+effect.pos.y*2.2,pixels=2.2;
    if(effect.space==='screen'){ctx.setTransform(renderScale,0,0,renderScale,0,0);pixels=layout.px;x=layout.left+effect.pos.x*pixels;y=layout.top+effect.pos.y*pixels;}
    const sx=pixels*coordinate*(scale[0]??1),sy=pixels*coordinate*(scale[1]??1)*(effect.vfacing||1),resource=effect.common?commonResource:fighter.character;
    if(effect.shadow&&effect.space==='stage'){
      const shadow=match.stage?.definition.shadow||{intensity:128,yscale:.4};ctx.save();ctx.globalAlpha=shadow.intensity/256;
      drawFrame(frame,x,440,effect.facing,sx,-sy*shadow.yscale,effect.angle||0,resource,{layers:[{color:0,mul:[0,0,0]}],key:'explod-shadow'},'none',remaps,false,effect.xangle,effect.yangle);ctx.restore();
    }
    drawFrame(frame,x,y,effect.facing,sx,sy,effect.angle||0,resource,effects.paletteFor(source),effect.trans,remaps,false,effect.xangle,effect.yangle);ctx.restore();
  }
  function stageLayout(){
    if(!match)return null;const view=match.view,px=Math.min(960/320,540/view.displayHeight),width=320*px,height=view.displayHeight*px;
    return{view,px,width,height,left:(960-width)/2,top:(540-height)/2,ground:(540-height)/2+view.groundY*px,scale:px*view.zoom,camera:match.stage?.camera||{x:0,y:0,zoom:1}};
  }
  function withWorld(layout,draw){
    ctx.save();if(layout){ctx.translate(480,layout.ground);ctx.scale(layout.scale/2.2,layout.scale/2.2);ctx.translate(-480-layout.camera.x*2.2,-440-layout.camera.y*2.2);}draw();ctx.restore();
  }
  const parallaxSurface=document.createElement('canvas');parallaxSurface.width=960;parallaxSurface.height=540;
  const parallaxContext=performanceMonitor.track(parallaxSurface.getContext('2d'));parallaxContext.imageSmoothingEnabled=false;
  function drawStageLayer(layer,layout){
    const stage=match.stage,d=stage.definition,factor=d.coordinateScale;
    for(const [index,e]of stage.elements.entries()){
      if(e.layer!==layer||!e.enabled||!e.visible||e.type==='dummy'||!d.sprite)continue;
      const frame=e.animated?sampleAnimation(stage.animations.get(e.anim),e.drawFrameIndex??e.frameIndex,e.drawFrameTime??e.frameTime):stage.frame(e);if(!frame)continue;
      let sp=sprite(frame.group,frame.number,d);if(!sp)continue;if(!e.mask)sp=opaqueSprite(sp);
      const pos=stage.position(index),zoom=1+(stage.camera.zoom-1)*e.zoomDelta;
      const x=480+(pos.x*factor-stage.camera.x*pos.delta[0])*layout.px*stage.camera.zoom;
      const y=layout.ground+(pos.y*factor-layout.view.zoffset-stage.camera.y*pos.delta[1])*layout.px*stage.camera.zoom;
      const scaleX=factor*layout.px*zoom*d.xscale*(e.scaleStart[0]+stage.camera.y/factor*e.scaleDelta[0]);
      const scaleY=factor*layout.px*zoom*d.yscale*(e.scaleStart[1]+stage.camera.y/factor*e.scaleDelta[1]);
      const trans=e.transSpecified?{mode:e.trans,alpha:e.alpha}:null,palette=effects.backgroundPalette;
      ctx.save();
      if(e.window?.length===4){const offset=e.windowCentered?480:layout.left,endpoint=e.windowCentered?0:1;const wx=offset+(e.window[0]*factor-stage.camera.x*e.windowDelta[0])*layout.px,wy=layout.top+(e.window[1]*factor-stage.camera.y*e.windowDelta[1]-layout.view.cropTop)*layout.px;ctx.beginPath();ctx.rect(wx,wy,(e.window[2]-e.window[0]+endpoint)*factor*layout.px,(e.window[3]-e.window[1]+endpoint)*factor*layout.px);ctx.clip();}
      if(e.type==='parallax'){
        const blend=e.trans==='default'?frame.blend||'':e.trans==='none'?'':['add','addalpha'].includes(e.trans)?`AS${e.alpha[0]}D${e.alpha[1]}`:e.trans;
        const plan=compositePlan(blend);
        const cacheKey=JSON.stringify([sp.key,palette.key,frame,blend,plan.brightness,x,y,scaleX,scaleY,stage.camera,pos,e.width,e.xscale,e.tile,e.yScaleStart,e.yScaleDelta,layout.left,layout.top,layout.width,layout.height]);
        const cached=parallaxCache.get(cacheKey);if(cached){renderer.draw(cached,0,0,plan,{left:0,top:0,width:canvas.width,height:canvas.height},960,540);ctx.restore();continue;}
        parallaxContext.clearRect(0,0,960,540);const source=coloredSprite(sp,palette,plan.brightness);
        for(let row=0;row<sp.h;row++){
          const scales=parallaxScale(e,sp.w,row,sp.h,stage.camera.y/factor),sx=scaleX*scales.x*(frame.scaleX??1),sy=scaleY*scales.y*(frame.scaleY??1);
          if(!Number.isFinite(sx)||!Number.isFinite(sy)||!sx||!sy)continue;
          const rowX=480+(pos.x*factor-stage.camera.x*pos.delta[0]*scales.delta)*layout.px*stage.camera.zoom+(frame.x||0)*scaleX;
          const axis=e.width?sp.w/2:sp.x,flipX=(frame.flip||'').includes('H')?-1:1,flipY=(frame.flip||'').includes('V')?-1:1;
          const step=sp.w*Math.abs(sx),xs=tileOffsets(rowX-axis*sx,step,step,e.tile[0],layout.left,layout.left+layout.width);
          for(const ix of xs){parallaxContext.save();parallaxContext.translate(rowX+ix*step,y+(frame.y||0)*scaleY);parallaxContext.scale(flipX*sx,flipY*sy);parallaxContext.drawImage(source,0,row,sp.w,1,-axis,row-sp.y,sp.w,1+.02/Math.abs(sy));parallaxContext.restore();}
        }
        if(parallaxKeys.get(index)===cacheKey){const copy=document.createElement('canvas');copy.width=960;copy.height=540;copy.getContext('2d').drawImage(parallaxSurface,0,0);parallaxCache.set(cacheKey,copy);}parallaxKeys.set(index,cacheKey);
        renderer.draw(parallaxSurface,0,0,plan,{left:0,top:0,width:canvas.width,height:canvas.height},960,540);
      }else{
        const stepX=backgroundTileStep(e,sp.w)*Math.abs(scaleX),stepY=backgroundTileStep(e,sp.h,1)*Math.abs(scaleY);
        const xs=tileOffsets(x-sp.x*scaleX,sp.w*Math.abs(scaleX),stepX,e.tile[0],layout.left,layout.left+layout.width);
        const ys=tileOffsets(y-sp.y*scaleY,sp.h*Math.abs(scaleY),stepY,e.tile[1],layout.top,layout.top+layout.height);
        let count=0;for(const iy of ys)for(const ix of xs){if(++count>4096){issue(`Stage background at line ${e.line} exceeds 4096 visible tiles.`,'resource-limit');break;}drawFrame(frame,x+ix*stepX,y+iy*stepY,1,scaleX,scaleY,0,d,palette,trans,null,!e.mask);}
      }
      ctx.restore();
    }
  }
  function drawGroundEffects(fighter){
    const d=match.stage?.definition;if(!d||fighter.asserted.has('invisible')||fighter.asserted.has('noshadow'))return;
    if(fighter.spec&&!fighter.spec.projshadow)return;
    const frame=fighterPose(fighter),scale=2.2*baseScale(fighter);if(!frame)return;
    if(d.reflection){ctx.save();ctx.globalAlpha=d.reflection/256;drawFrame(frame,480+fighter.pos.x*2.2,440-fighter.pos.y*2.2,fighter.facing,scale*constant(fighter,'size.xscale'),-scale*constant(fighter,'size.yscale'),0,fighter.character,effects.paletteFor(fighter),null,fighter.paletteRemaps);ctx.restore();}
    const shadow=d.shadow;if(!shadow.intensity)return;
    let fade=1;if(shadow.fade&&shadow.fade[0]!==shadow.fade[1])fade=Math.max(0,Math.min(1,(fighter.pos.y-shadow.fade[0])/(shadow.fade[1]-shadow.fade[0])));
    if(!fade)return;
    const palette={layers:[{color:0,mul:[0,0,0],postadd:shadow.color}],key:'shadow'+shadow.color.join(',')};
    ctx.save();ctx.globalAlpha=fade*shadow.intensity/256;
    drawFrame(frame,480+fighter.pos.x*2.2,440+constant(fighter,'size.shadowoffset',0)*baseScale(fighter)*2.2,fighter.facing,scale*constant(fighter,'size.xscale'),-scale*constant(fighter,'size.yscale')*shadow.yscale,0,fighter.character,palette,'none');ctx.restore();
  }
  function advancePreview() {
    if (!action?.frames.length) return; const frame = action.frames[previewFrame]; if (frame.ticks === -1) return;
    if (++previewElapsed >= Math.max(1, frame.ticks)) { previewElapsed = 0; if (++previewFrame >= action.frames.length) previewFrame = action.loopStart || 0; }
  }
  function impactAnimation(entity,anim,common,pos,options={}){
    if(anim<0)return;
    const resource=common?commonResource:entity.character,bank=common?entity.commonAnimations:entity.animations;
    if(!resource||!bank?.has(anim)){issue(`${common?'Common ':''}effect animation ${anim} is unavailable.`,'missing-resource');return;}
    impactEffects.push({resource,animation:bank.get(anim),pos:{...pos},facing:entity.facing,coordinateScale:common?1:options.coordinateScale??entity.coordinateScale,frameIndex:0,frameTime:0,age:0,paletteRemaps:common?null:new Map(entity.paletteRemaps),...options});
    if(impactEffects.length>256){impactEffects.shift();issue('Presentation effect limit (256) reached.','resource-limit');}
  }
  function advanceImpacts(paused=false){
    impactEffects=impactEffects.filter(effect=>{
      if(paused&&!effect.ignorePause)return true;
      const frame=effect.animation.frames[effect.frameIndex];if(!frame)return false;effect.age++;
      if(effect.age>3600)return false;
      if(frame.ticks>=0&&++effect.frameTime>=Math.max(1,frame.ticks)){effect.frameTime=0;if(++effect.frameIndex>=effect.animation.frames.length)return false;}
      return effect.duration===undefined||effect.age<effect.duration;
    });
  }
  function contactPresentation(contact){
    if(contact.typeNone)return;
    const {attacker,defender,hitDef:hit,guarded}=contact,scale=hit.coordinateScale??attacker.coordinateScale;
    const spark=guarded?hit['guard.sparkno']:hit.sparkno,sound=guarded?hit.guardsound:hit.hitsound,offset=hit.sparkxy||[0,0];
    impactAnimation(attacker,spark,guarded?hit.guardSparkCommon:hit.sparkCommon,{x:contact.x+(offset[0]||0)*scale*attacker.facing,y:attacker.pos.y+(offset[1]||0)*scale},{coordinateScale:guarded?hit.guardSparkCommon?1:scale:hit.sparkCommon?1:scale});
    if(sound!==undefined){const value=Array.isArray(sound)?sound:[sound,0];if(value[0]>=0)void audio.consume([{type:'playsnd',group:value[0],number:value[1]||0,common:guarded?hit.guardSoundCommon:hit.hitSoundCommon,channel:-1}],String(attacker.id),attacker.character);}
    if(guarded)return;
    if(hit['envshake.time']>0)effects.consume([{type:'envshake',coordinateScale:scale,time:hit['envshake.time'],...Object.fromEntries(['freq','ampl','phase'].filter(k=>hit['envshake.'+k]!==undefined).map(k=>[k,hit['envshake.'+k]]))}],{entity:attacker});
    if(hit['palfx.time'])effects.consume([{type:'palfx',...Object.fromEntries(Object.entries(hit).filter(([k])=>k.startsWith('palfx.')).map(([k,v])=>[k.slice(6),v]))}],{entity:defender});
  }
  function superPresentation(event){
    const owner=event.owner,pos=event.pos||[0,0];
    const coordinate=event.coordinateScale??owner.coordinateScale;
    impactAnimation(owner,event.anim??30,event.animCommon,{x:owner.pos.x+(pos[0]||0)*coordinate*owner.facing,y:owner.pos.y+(pos[1]||0)*coordinate},{duration:event.time,ontop:true,ignorePause:true,coordinateScale:event.animCommon?1:coordinate});
    const sound=Array.isArray(event.sound)?event.sound:[event.sound??-1,0];
    if(sound[0]>=0)void audio.consume([{type:'playsnd',group:sound[0],number:sound[1]||0,common:event.soundCommon,channel:-1}],String(owner.id),owner.character);
  }
  function simulate(sampleTime=performance.now()) {
    if (mode === 'preview') { advancePreview(); return; } if (!match) return;
    try {
      const playerInput=p1Input.sample(sampleTime),sampledP2=p2Input.sample(sampleTime),commands = commandBuffer.update(playerInput, match.player.facing), dummyKeys = new Set(), dummyMode = $('#dummy-mode').value;
      if (dummyMode.includes('guard') && match.player.moveType === 'A') dummyKeys.add(match.opponent.facing === 1 ? 'L' : 'R');
      if (dummyMode.includes('crouch')) dummyKeys.add('D');
      if(dummyMode==='keyboard')for(const key of sampledP2)dummyKeys.add(key);
      const paused=entity=>!entity.destroyed&&(match.isFrozen(entity)||entity.hitPauseTime>0);
      effects.advance({paused,backgroundPaused:!!(match.superPause?.remaining>0||match.pause?.remaining>0&&match.pause.pausebg!==0)});advanceImpacts(!!(match.superPause?.remaining>0||match.pause?.remaining>0));haptics.advance();
      const generation=match.roundGeneration;match.tick(commands, dummyBuffer.update(dummyKeys, match.opponent.facing),{playerInput,opponentInput:dummyKeys});
      if(generation!==match.roundGeneration){commandBuffer.reset();dummyBuffer.reset();effects=new EffectsState();impactEffects=[];audio.stop();haptics.stop();}
      const actors=match.eventEntities||match.entities;
      for(const entity of actors){effects.consume(entity.events,{entity});void audio.consume(entity.events,String(entity.id),entity.character);haptics.consume(entity.events,{entity});for(const event of entity.events||[])if(event.type==='gameanim')impactAnimation(entity,event.anim,true,event.pos,{under:event.under,facing:event.facing});}
      for(const event of match.presentationEvents){if(event.type==='superpause')superPresentation(event);else if(event.type==='round')status(event.event==='fight'?'Fight!':event.event==='next-round'?`Round ${event.roundNo}`:event.winner==='draw'?'Draw round.':`${event.winner==='player'?match.player.name:match.opponent.name} wins${event.matchOver?' the match':''}.`);else effects.consume([event],{entity:event.entity||event.owner});}
      for(const contact of match.events)contactPresentation(contact);
      const liveActors=[...match.entities,...match.drawProjectiles];effects.capture(liveActors,{paused});effects.cleanup(liveActors,{paletteOwners:[...liveActors,...match.orphanEffectOwners]});
      for(const [id,actor]of [['#p1life',match.player],['#p2life',match.opponent]]){const meter=$(id);if(meter.max!==actor.maxLife)meter.max=actor.maxLife;if(meter.value!==actor.life)meter.value=actor.life;}
    } catch (error) { issue(`Simulation stopped: ${error.message}`, 'runtime'); setPlaying(false); status(`Simulation stopped: ${error.message}`); }
  }
  const drawActors=[],drawLayers=[],drawPool=[];let drawCount=0;
  function addDraw(kind,priority,actor,item){const row=drawPool[drawCount]||(drawPool[drawCount]={});row.kind=kind;row.priority=priority;row.actor=actor;row.item=item;row.order=drawCount++;drawLayers.push(row);}
  function drawLayer(row,layout){const fighter=row.actor,item=row.item;if(row.kind==='fighter')drawFighter(fighter);else if(row.kind==='explod')drawExplod(fighter,item,layout);else if(row.kind==='trail')drawFrame(item.frame,480+(item.pos.x+(item.drawOffset?.x||0))*2.2,440+(item.pos.y+(item.drawOffset?.y||0))*2.2,item.facing,2.2*item.coordinateScale*item.sizeX*(item.drawScale?.x??1),2.2*item.coordinateScale*item.sizeY*(item.drawScale?.y??1),item.angle,item.character,item.palette,item.trans,item.paletteRemaps);else drawFrame(sampleAnimation(item.animation,item.frameIndex,item.frameTime),480+item.pos.x*2.2,440+item.pos.y*2.2,item.facing,2.2*item.coordinateScale,2.2*item.coordinateScale,0,item.resource,effects.paletteFor(null),null,item.paletteRemaps);}
  let lastReport = 0,lastUi=0;
  function measureSimulation(sampleTime){const start=performanceMonitor.enabled?performance.now():0;simulate(sampleTime);if(performanceMonitor.enabled)performanceMonitor.simulation(performance.now()-start);}
  function performanceCounts(){return {activeSprites:drawCount,sprites:spriteCache.size,paletteVariants:paletteCache.size,graphicsMode:graphics.mode,graphicsPreset:graphics.preset,renderScale,targetFPS:graphics.settings.fps,simulationDebt:clock.debt,cacheBytes:paletteCache.bytes+spriteCache.bytes+parallaxCache.bytes+[...decodedBanks].reduce((sum,bank)=>sum+(bank.cacheStats?.().bytes||0),0),impacts:impactEffects.length,explods:match?[...match.entities,...match.orphanEffectOwners].reduce((n,a)=>n+a.explods.length,0):0,orphanExplods:match?.orphanEffectOwners.reduce((n,a)=>n+a.explods.length,0)||0,projectiles:match?.projectiles.length||0,helpers:Math.max(0,(match?.entities.length||2)-2),trails:match?.entities.reduce((n,a)=>n+effects.trailsFor(a).length,0)||0};}
  function pollGamepads(time){const pads=navigator.getGamepads?.()||[];p1Input.record('gamepad',gamepadKeys(pads[0]),time);p2Input.record('gamepad',gamepadKeys(pads[1]),time);}
  function draw(t) {
    if(document.hidden)return;
    pollGamepads(t);performanceMonitor.begin(t);
    clock.advance(t,{running:playing&&!!selected,speed:+$('#speed').value},measureSimulation);
    let duration=0;const renderNow=renderVisible&&(dirty||(playing&&!!selected&&clock.renderDue(t,graphics.settings.fps)));
    if(renderNow){const start=performance.now();render(t);duration=performance.now()-start;dirty=false;if(playing&&selected&&graphics.observeFrame(duration,lastPresentationTime===null?1000/graphics.settings.fps:t-lastPresentationTime))dirty=true;lastPresentationTime=t;}
    performanceMonitor.end(duration,performanceMonitor.enabled?performanceCounts():{},renderNow);
    raf=requestAnimationFrame(draw);
  }
  function render(t){
    const settings=graphics.settings,w=Math.round(960*settings.scale),h=Math.round(540*settings.scale);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;ctx.imageSmoothingEnabled=false;}renderScale=settings.scale;ctx.setTransform(renderScale,0,0,renderScale,0,0);
    const layout=mode==='training'?stageLayout():null;
    ctx.clearRect(0,0,960,540); ctx.fillStyle = '#0c111b'; ctx.fillRect(0,0,960,540);ctx.save();
    if(layout){ctx.beginPath();ctx.rect(layout.left,layout.top,layout.width,layout.height);ctx.clip();}
    const shake=mode==='training'?effects.cameraOffset:{x:0,y:0};ctx.translate(shake.x*(layout?.scale||2.2),shake.y*(layout?.scale||2.2));
    if(layout&&match.stage){if(!match.entities.some(e=>e.asserted.has('nobg')))drawStageLayer(0,layout);}
    else{
      ctx.strokeStyle = '#1b2737'; ctx.lineWidth = 1;
      for (let x = -700; x < 1700; x += 80) { ctx.beginPath(); ctx.moveTo(480 + (x - 480) * .3,320); ctx.lineTo(x,540); ctx.stroke(); }
      for (let y = 330; y < 540; y += (y - 300) * .3) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(960,y); ctx.stroke(); }
      ctx.strokeStyle = '#466055'; ctx.beginPath(); ctx.moveTo(0,layout?.ground??440); ctx.lineTo(960,layout?.ground??440); ctx.stroke();
      if(mode==='training'&&effects.backgroundPalette.layers.length){const pixels=ctx.getImageData(0,0,canvas.width,canvas.height);pixels.data.set(transformRgba(pixels.data,effects.backgroundPalette));writePixels(pixels,0,0);}
    }
    const environment=mode==='training'?effects.environmentColor:null;if(environment?.under){ctx.fillStyle=`rgb(${environment.value.join(',')})`;ctx.fillRect(0,0,960,540);}
    if (mode === 'training' && match) {
      drawActors.length=0;drawLayers.length=0;drawCount=0;for(const actor of match.renderEntities)drawActors.push(actor);for(const actor of match.drawProjectiles)drawActors.push(actor);
      for(const fighter of drawActors){if(!fighter.destroyed){for(const trail of effects.trailsFor(fighter))addDraw('trail',(fighter.sprPriority||0)-.1,fighter,trail);addDraw('fighter',fighter.sprPriority||0,fighter,null);}for(const effect of fighter.drawExplods||[])addDraw('explod',effect.ontop?1000:effect.sprpriority||0,fighter,effect);}
      for(const effect of impactEffects)addDraw('impact',effect.ontop?1000:effect.under?-1000:100,null,effect);
      for(let i=drawCount;i<drawPool.length;i++){drawPool[i].actor=null;drawPool[i].item=null;}
      drawLayers.sort((a,b)=>a.priority-b.priority||a.order-b.order);
      withWorld(layout,()=>{for(const fighter of drawActors)if(!fighter.destroyed)drawGroundEffects(fighter);for(const row of drawLayers)if(row.priority<1000)drawLayer(row,layout);});
      if(layout&&match.stage&&!match.entities.some(e=>e.asserted.has('nofg')))drawStageLayer(1,layout);
      if(environment&&!environment.under){ctx.fillStyle=`rgb(${environment.value.join(',')})`;ctx.fillRect(0,0,960,540);}
      if(match.superPause?.remaining>0&&match.superPause.darken!==0){ctx.fillStyle='#0008';ctx.fillRect(0,0,960,540);}
      withWorld(layout,()=>{for(const row of drawLayers)if(row.priority>=1000)drawLayer(row,layout);});
      const flow=match.roundFlow;
      text('#round-status',flow?`ROUND ${flow.roundNo} · ${flow.timeLeft<0?'∞':Math.ceil(flow.timeLeft/60)} · ${flow.wins.player} : ${flow.wins.opponent}`:'LOCAL TRAINING');
      text('#match-banner',!flow?'':flow.roundState===0?`ROUND ${flow.roundNo}`:flow.roundState===1?'READY':flow.roundState===2&&flow.phaseTime<30?'FIGHT':flow.roundState===3?flow.reason==='time'?'TIME OVER':flow.reason==='double-ko'?'DOUBLE KO':'KO':flow.roundState===4?flow.roundWinner==='draw'?'DRAW':`${flow.roundWinner==='player'?match.player.name:match.opponent.name} wins${flow.matchOver?' the match':''}`:'');
      $('#hud').hidden=match.entities.some(e=>e.asserted.has('nobardisplay'));
      $('#debug-output').hidden=!$('#debug-text').checked;if($('#debug-text').checked&&(t-lastUi>=100||!playing))text('#debug-output',match.entities.filter(e=>e.clipboard).map(e=>`${e.parent?'HELPER '+e.id:'P'+e.teamSide} · ${e.name}\n${e.clipboard}`).join('\n\n'));
      const uiDue=t-lastUi>=100||!playing;
      const quote=flow?.matchOver&&flow.roundState===4?match[flow.roundWinner]?.victoryQuote:null;$('#victory-quote').hidden=!quote;text('#victory-quote',quote||'');
      if(uiDue){lastUi=t;text('#state',`STATE ${match.player.stateNo} · T ${match.player.time} · POWER ${Math.round(match.player.power)} · H ${match.entities.length-2} / P ${match.projectiles.length}`);
      text('#pos',match.player.pos.x.toFixed(1)); text('#posy',match.player.pos.y.toFixed(1)); text('#frame',`ANIM ${match.player.anim} · FRAME ${match.player.frameIndex + 1}`);}
    } else { const scale = worldScale(),palette=playerPalettes.get(selected)||1; drawFrame(sampleAnimation(action,previewFrame,previewElapsed),480,440,1,scale,scale,0,selected,null,null,palette===1?null:new Map([['1,1',[1,palette]]])); text('#frame',`FRAME ${action ? previewFrame + 1 : 0} / ${action?.frames.length || 0}`); text('#state',''); text('#pos','0');text('#posy','0');text('#match-banner','');$('#debug-output').hidden=$('#victory-quote').hidden=true; }
    ctx.restore();
    if (t - lastReport >= 250) { updateReport(); lastReport = t; if(performanceMonitor.enabled){const p=performanceMonitor.snapshot(),overlay=$('#performance-overlay');overlay.hidden=false;overlay.textContent=`${p.fps.toFixed(1)} FPS · slow ${(p.slowFrameRate*100).toFixed(1)}%\nframe avg/p95 ${p.frameAverageMs.toFixed(1)}/${p.frameP95Ms.toFixed(1)} ms\nrender ${p.renderAverageMs.toFixed(2)} ms · tick ${p.simulationTickMs.toFixed(2)} ms\n${p.counts.activeSprites||0} sprites · ${p.counts.explods||0} Explods · ${p.counts.projectiles||0} projectiles · ${p.counts.trails||0} trails\n${(p.drawCalls/(p.renderedFrames||1)).toFixed(0)} draws/frame · ${(p.readbacks/(p.renderedFrames||1)).toFixed(1)} reads/frame / ${(p.readbackPixels/1e6/(p.renderedFrames||1)).toFixed(1)} MP\ncache ${(p.counts.cacheBytes/1048576).toFixed(1)} MiB\n${p.counts.graphicsPreset} · ${p.counts.targetFPS} FPS target · debt ${(p.counts.simulationDebt||0).toFixed(1)} ticks`;}}
  }
  function exposePerformance(){window.__kenjatimePerformance=performanceMonitor.enabled?{snapshot:()=>performanceMonitor.snapshot(),reset:()=>performanceMonitor.reset(),benchmark:({frames=60,ticksPerFrame=1}={})=>{setPlaying(false);performanceMonitor.reset();for(let i=0;i<frames;i++){const t=performance.now();performanceMonitor.begin(t);for(let tick=0;tick<ticksPerFrame;tick++)measureSimulation();const start=performance.now();render(t);performanceMonitor.end(performance.now()-start,performanceCounts());}return performanceMonitor.snapshot();}}:undefined;}
  exposePerformance();
  $('#performance-toggle').onchange=()=>{performanceMonitor.setEnabled($('#performance-toggle').checked);$('#performance-overlay').hidden=!performanceMonitor.enabled;exposePerformance();dirty=true;};
  $('#graphics-mode').onchange=()=>{graphics.setMode($('#graphics-mode').value);try{localStorage.setItem('kenjatime.graphics',graphics.mode);}catch{}dirty=true;};
  $('.viewer').addEventListener('change',()=>{dirty=true;});
  window.addEventListener('resize',()=>{dirty=true;});
  if(typeof IntersectionObserver!=='undefined')new IntersectionObserver(entries=>{renderVisible=entries[0].isIntersecting;if(renderVisible){dirty=true;lastPresentationTime=null;}},{rootMargin:'200px'}).observe($('.viewer'));
  document.addEventListener('visibilitychange',()=>{clock.suspend();keys.clear();p1Input.reset();player2Keys.clear();p2Input.reset();touch.reset();p1Input.reset();p2Input.reset();commandBuffer?.reset();dummyBuffer?.reset();audio.stop();haptics.stop();cancelAnimationFrame(raf);if(document.hidden){void audio.context?.suspend().catch(()=>{});}else{if(playing&&$('#sound').checked)void audio.context?.resume().catch(()=>{});dirty=true;raf=requestAnimationFrame(draw);}});
  raf=requestAnimationFrame(draw);
  function setPlaying(value) {lastPresentationTime=null;dirty=true;playing = value; clock.suspend(); $('#play').textContent = playing ? 'Ⅱ' : '▶'; $('#play').setAttribute('aria-label', playing ? 'Pause' : 'Play'); if (!playing){audio.stop();haptics.stop();} }
  function setMode(value) {
    dirty=true;mode = value; keys.clear();p1Input.reset();touch.reset(); clock.suspend(); $('#lab').classList.toggle('active',mode === 'preview'); $('#training').classList.toggle('active',mode === 'training');
    touch.panel.hidden=mode!=='training'||$('#player-control').value==='cpu';
    $('#hud').hidden = $('#training-tools').hidden = mode !== 'training'; $('#actions').disabled = mode === 'training'; $('#viewtitle').textContent = mode === 'preview' ? 'CHARACTER PREVIEW' : arena&&$('#match-mode').value==='match'?'SCRIPTED MATCH':'SCRIPTED TRAINING';
    updateHint();
    if (mode === 'training') { void audio.unlock(); canvas.focus(); } else {audio.stop();audio.stopMusic();haptics.stop();}
  }
  function updateHint(){
    const p1cpu=$('#player-control').value==='cpu',p2=$('#dummy-mode').value,level=$('#cpu-level').value;
    let hint='Inspect the character’s SFF sprites and AIR animations. Open training to execute its scripts.';
    if(mode==='training'){
      if(p1cpu&&p2==='cpu')hint=`CPU vs CPU · Level ${level} · R restarts. Choose Match for scored rounds.`;
      else if(p1cpu)hint=p2==='keyboard'?`P1: CPU level ${level}. P2: numpad 8 2 4 6 to move · 7 9 decimal / 1 3 5 to attack. R restarts.`:`P1: CPU level ${level}. P2: ${$('#dummy-mode').selectedOptions[0].textContent}. Choose Keyboard P2 to play. R restarts.`;
      else if(p2==='keyboard')hint='P1: arrows · Z X C / A S D. P2: numpad 8 2 4 6 to move · 7 9 decimal = x y z · 1 3 5 = a b c · numpad Enter = start. R restarts.';
      else if(p2==='cpu')hint=`P1: arrows · Z X C / A S D · P2: CPU level ${level}. Motions and attacks use the character’s CMD. R restarts.`;
      else hint='Click the stage · Arrows move / jump / crouch · Z X C = x y z · A S D = a b c · Enter = start · R resets. Motions and combos come from the character’s CMD.';
    }
    $('#hint').textContent=hint;
  }
  function resetRound() {dirty=true;keys.clear();p1Input.reset();player2Keys.clear();p2Input.reset();touch.reset(); commandBuffer?.reset(); dummyBuffer?.reset(); match?.reset(); audio.stop();haptics.stop();effects=new EffectsState();impactEffects=[]; clock.suspend(); status(match?.roundFlow?'Match restarted.':'Round reset.'); canvas.focus(); }
  $('#lab').onclick = () => setMode('preview'); $('#training').onclick = () => setMode('training'); $('#reset').onclick = resetRound;
  $('#play').onclick = () => { setPlaying(!playing); void audio.unlock(); canvas.focus(); };
  $('#step').onclick = () => { setPlaying(false); simulate(); updateReport(); canvas.focus(); };
  $('#actions').onchange = event => {dirty=true; action = selected.animations[+event.target.value]; previewFrame = 0; previewElapsed = 0; clock.suspend(); };
  $('#sound').onchange = () => { if ($('#sound').checked) void audio.unlock(); else {audio.stop();audio.stopMusic();} };
  $('#stage-select').onchange=event=>{selectedStage=stages[+event.target.value]||null;configureMatch();canvas.focus();};
  $('#opponent-select').onchange=$('#match-mode').onchange=()=>{configureMatch();canvas.focus();};
  $('#palette-select').onchange=event=>{playerPalettes.set(selected,+event.target.value);configureMatch();canvas.focus();};
  $('#opponent-palette-select').onchange=event=>{opponentPalettes.set(match.opponent.character,+event.target.value);configureMatch();canvas.focus();};
  $('#dummy-mode').onchange=()=>{if($('#dummy-mode').value==='cpu'||match?.opponent.aiLevel)configureMatch();updateHint();player2Keys.clear();p2Input.reset();dummyBuffer?.reset();canvas.focus();};
  $('#player-control').onchange=$('#cpu-level').onchange=()=>{configureMatch();canvas.focus();};
  canvas.onclick = () => { canvas.focus(); void audio.unlock(); };
  for(const label of [$('#upload'),$('#browse')])label.onkeydown=event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();event.stopPropagation();$('#file').click();}};
  async function importSource(read){if(importing){status('A ZIP is already being imported. Please wait for it to finish.');return;}importing=true;$('#file').disabled=$('#sample').disabled=true;$('#drop').setAttribute('aria-busy','true');try{await load(await read());}catch(error){status(`Import failed: ${error.message}`);}finally{importing=false;$('#file').disabled=$('#sample').disabled=false;$('#drop').setAttribute('aria-busy','false');}}
  async function readFile(file) {if(!file)return;await importSource(async()=>{status(`Reading ${file.name||'ZIP archive'}…`);return readZipFile(file);});}
  $('#file').onchange = async event => {try{await readFile(event.target.files[0]);}finally{event.target.value='';} };
  $('#sample').onclick = () => importSource(async()=>{status('Loading Kung Fu Man…');const response=await fetch(new URL(arena?'../kfm.zip':'kfm.zip',document.baseURI));if(!response.ok)throw Error('Sample unavailable');return new Uint8Array(await response.arrayBuffer());});
  for (const eventName of ['dragover','drop']) $('#drop').addEventListener(eventName, async event => { event.preventDefault(); if (eventName === 'drop') await readFile(event.dataTransfer.files[0]); });
  const keymap = {ArrowUp:'U',ArrowDown:'D',ArrowLeft:'L',ArrowRight:'R',KeyZ:'x',KeyX:'y',KeyC:'z',KeyA:'a',KeyS:'b',KeyD:'c',Enter:'s'};
  const keymap2={Numpad8:'U',Numpad2:'D',Numpad4:'L',Numpad6:'R',Numpad1:'a',Numpad3:'b',Numpad5:'c',Numpad7:'x',Numpad9:'y',NumpadDecimal:'z',NumpadEnter:'s'};
  window.addEventListener('keydown', event => { if (event.defaultPrevented || event.target.matches('input,select,button,[role=button],a') || mode !== 'training') return; if(event.ctrlKey&&event.code==='KeyD'){event.preventDefault();if(!event.repeat){$('#debug-text').checked=!$('#debug-text').checked;dirty=true;}return;} if (event.code === 'KeyR' && !event.repeat) { resetRound(); return; } const key = keymap[event.code],key2=keymap2[event.code]; if (!key&&!key2) return; event.preventDefault();if(key){keys.add(key);p1Input.record('keyboard',keys,performance.now());}if(key2){player2Keys.add(key2);p2Input.record('keyboard',player2Keys,performance.now());} void audio.unlock(); });
  window.addEventListener('keyup', event => { if(keymap[event.code]){keys.delete(keymap[event.code]);p1Input.record('keyboard',keys,performance.now());}if(keymap2[event.code]){player2Keys.delete(keymap2[event.code]);p2Input.record('keyboard',player2Keys,performance.now());} });
  window.addEventListener('blur', () => { keys.clear();p1Input.reset();player2Keys.clear();p2Input.reset(); commandBuffer?.reset(); dummyBuffer?.reset(); audio.stop();haptics.stop(); });
  if(arena)mountArena({setMode,setPlaying,configureMatch,status,hasCharacter:()=>!!selected&&!!match});
}
