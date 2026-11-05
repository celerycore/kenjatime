export function mountArena({setMode,setPlaying,configureMatch,status,hasCharacter}){
  const $=selector=>document.querySelector(selector),classic=document.body.dataset.classic==='true';document.body.classList.add('arena-page');
  document.title=classic?'MUGEN / Classic Arena':'MUGEN / Web Arena';$('.brand small').textContent=classic?'MUGEN CLASSIC ARENA':'MUGEN WEB ARENA';
  $('.eyebrow').textContent='BRING YOUR FIGHTER';$('h1').innerHTML='Your next match starts here<span>.</span>';
  $('.heading p').textContent='Import your characters. Choose a rival. Fight using their own scripts.';
  $('header > span').textContent=classic?'PLAY / CLASSIC ARENA':'PLAY / WEB ARENA';
  $('#lab').textContent='Character preview';$('#training').textContent='Arena';
  $('.legacy-arena').href='../';$('.legacy-arena').textContent='Open lab';
  $('.legacy-arena').insertAdjacentHTML('afterend',classic?'<a class="nav legacy-arena" href="../arena/">Web Arena</a>':'<a class="nav legacy-arena" href="../arena-classic/">Classic Arena</a>');
  $('.viewer').insertAdjacentHTML('beforebegin','<section class="arena-launch" aria-label="Match setup"><label>Play mode <select id="arena-mode"><option value="solo">Player vs CPU</option><option value="versus">Two players</option><option value="cpu">Watch CPU match</option><option value="training">Training</option></select></label><button type="button" class="primary" id="fight-now">Fight now</button><span>Choose your fighter in the roster and your rival under Opponent.</span></section>');
  function settings(){const mode=$('#arena-mode').value;$('#player-control').value=mode==='cpu'?'cpu':'keyboard';$('#dummy-mode').value=mode==='cpu'||mode==='solo'?'cpu':mode==='versus'?'keyboard':'stand';$('#match-mode').value=mode==='training'?'training':'match';configureMatch();setMode('training');setPlaying(false);}
  $('#arena-mode').onchange=settings;
  $('#fight-now').onclick=()=>{if(!hasCharacter()){status('Import a character ZIP/RAR or load Kung Fu Man before starting a match.');return;}configureMatch();setMode('training');setPlaying(true);$('canvas').focus();$('.viewer').scrollIntoView({block:'start',behavior:'smooth'});};
  settings();$('#sample').click();
}
