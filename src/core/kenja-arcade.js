/** Kenjatime Arcade identity layer. The archive library and match engine are untouched. */
export const FONT_VARIANTS = Object.freeze({
  slash: 'Slash Circuit', condensed: 'Arcade Condensed',
  digital: 'Digital Arena', industrial: 'Neon Industrial'
});
export const normalizeFont = name => Object.hasOwn(FONT_VARIANTS, name) ? name : 'slash';

export function mountArcadeChrome(doc = document, store = globalThis.localStorage) {
  doc.body.classList.add('kenja-arcade');
  const logo = doc.querySelector('.brand');
  if (logo) {
    logo.setAttribute('aria-label', 'Kenjatime arcade engine');
    logo.innerHTML = '<span class="kenja-wordmark">KENJA<span>TIME</span><i>↗</i></span><small>INDEPENDENT FIGHTING ENGINE</small>';
  }
  const title = doc.querySelector('header > span');
  if (title) title.innerHTML = '<b>KENJATIME</b> / ARCADE ENGINE <span class="kenja-header-tail">· CHARACTER & STAGE LAB</span>';
  const tag = doc.querySelector('header .tag');
  if (tag) tag.innerHTML = 'CORE PREVIEW <i>● LOCAL</i>';
  const heading = doc.querySelector('.heading');
  if (!heading) return;
  const hero = doc.createElement('section');
  hero.className = 'kenja-showcase';
  hero.setAttribute('aria-label', 'Kenjatime fighting game engine home');
  hero.innerHTML = [
    '<div class="kenja-showcase-copy">',
    '<p class="kenja-kicker">● LOCAL ENGINE · MUGEN / IKEMEN GO COMPATIBILITY IN PROGRESS</p>',
    '<div class="kenja-showcase-logo">KENJA<span>TIME</span><b>↗</b></div>',
    '<h2>YOUR FIGHTERS.<br><em>YOUR ARENA.</em></h2>',
    '<p class="kenja-showcase-sub">Import your own characters and stages, build a roster, and fight. Kenjatime stays an engine—not a fixed-character game.</p>',
    '<div class="kenja-showcase-actions">',
    '<button class="kenja-action primary" type="button" data-kenja-action="character">＋ IMPORT FIGHTER</button>',
    '<button class="kenja-action secondary" type="button" data-kenja-action="stage">＋ IMPORT STAGE</button>',
    '<button class="kenja-action secondary" type="button" data-kenja-action="fight">SET UP MATCH ↗</button>',
    '</div>',
    '<p class="kenja-local-note">ZIP · RAR · 7Z · TAR, subject to archive compatibility · Files stay on this device</p>',
    '</div>',
    '<div class="kenja-future-roster" aria-label="Future default character concepts">',
    '<div class="kenja-concept kenja-concept-gart"><img alt="Gart Bernstein arcade variant" decoding="async"><b>GART BERNSTEIN</b><small>FUTURE DEFAULT · ALCHEMIST</small></div>',
    '<div class="kenja-concept kenja-concept-edelweiss"><img alt="Edelweiss arcade variant" decoding="async"><b>EDELWEISS</b><small>FUTURE DEFAULT · GLACIAL BLADE</small></div>',
    '<span class="kenja-vs" aria-hidden="true">VS</span>',
    '<p>Concept roster only. <strong>These fighters are not installed yet.</strong> Import your own playable archives.</p>',
    '</div>'
  ].join('');
  hero.querySelector('.kenja-concept-gart img').src = new URL('./art/gart.webp', import.meta.url).href;
  hero.querySelector('.kenja-concept-edelweiss img').src = new URL('./art/edelweiss.webp', import.meta.url).href;
  heading.before(hero);
  hero.querySelector('[data-kenja-action="character"]').addEventListener('click', () => doc.querySelector('#upload')?.click());
  hero.querySelector('[data-kenja-action="stage"]').addEventListener('click', () => doc.querySelector('#add-stage')?.click());
  hero.querySelector('[data-kenja-action="fight"]').addEventListener('click', () => doc.querySelector('.arena-launch')?.scrollIntoView({behavior:'smooth',block:'center'}));
  const label = doc.querySelector('.heading h1');
  if (label) label.innerHTML = 'FIGHT SETUP <span>/</span> IMPORT LAB';
  const eyebrow = doc.querySelector('.eyebrow');
  if (eyebrow) eyebrow.textContent = '01 / BUILD YOUR MATCH';
  const desc = doc.querySelector('.heading p');
  if (desc) desc.textContent = 'Choose your fighter, rival, stage, controls and palettes. Original archives remain yours.';
  const rosterTitle = doc.querySelector('.roster h2');
  if (rosterTitle) rosterTitle.firstChild.textContent = 'YOUR INSTALLED ROSTER ';
  const header = doc.querySelector('main > header');
  if (header) {
    const wrapper = doc.createElement('label');
    wrapper.className = 'kenja-font-picker';
    wrapper.innerHTML = '<span>DISPLAY FONT</span><select id="kenja-font" aria-label="Display font">' +
      Object.entries(FONT_VARIANTS).map(([id,name]) => '<option value="'+id+'">'+name+'</option>').join('') + '</select>';
    header.insertBefore(wrapper, tag);
    let font = 'slash';
    try { font = normalizeFont(store?.getItem('kenjatime.arcade.font')); } catch {}
    wrapper.querySelector('select').value = font;
    doc.body.dataset.kenjaFont = font;
    wrapper.querySelector('select').addEventListener('change', event => {
      const value = normalizeFont(event.target.value);
      doc.body.dataset.kenjaFont = value;
      try { store?.setItem('kenjatime.arcade.font', value); } catch {}
    });
  }
  doc.title = 'Kenjatime | Arcade Fighting Engine';
}
