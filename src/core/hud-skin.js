/** Kenjatime reference lifebar: UI only; never touches combat or GPU rendering. */
/**
 * Toggle SVG fallback with real DOM attributes. SVGElement.hidden is not a
 * reliable reflected attribute in all browsers: assigning it can create an
 * inert property, leaving the silhouette painted over a loaded portrait.
 * This helper is intentionally DOM-only; no character image is altered.
 */
export function setKenjatimeHudPortrait(frame, src) {
  const image = frame?.querySelector('img');
  const silhouette = frame?.querySelector('svg');
  if (!image || !silhouette) return;
  const fallback = () => {
    image.hidden = true;
    image.removeAttribute('src');
    silhouette.removeAttribute('hidden');
    frame.classList.remove('kt-hud-has-image');
  };
  image.onerror = null;
  if (typeof src !== 'string' || !src.startsWith('data:image/')) {
    fallback();
    return;
  }
  image.onerror = () => {
    if (image.src !== src) return; // ignore stale loading errors
    fallback();
  };
  // Keep this order: load the actual artwork, disable the decorative SVG,
  // then expose the image. CSS provides a second safeguard.
  image.src = src;
  silhouette.setAttribute('hidden', '');
  frame.classList.add('kt-hud-has-image');
  image.hidden = false;
}
export function mountKenjatimeReferenceHud(hud) {
  if (!hud) return {update() {}};
  if (hud.classList.contains('kt-reference-hud')) return hud.__kenjaHudSkin;
  hud.classList.add('kt-reference-hud');
  const backdrop = document.createElement('div');
  backdrop.className = 'kt-hud-backdrop';
  backdrop.setAttribute('aria-hidden', 'true');
  backdrop.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1350 191" preserveAspectRatio="none">
  <defs>
    <linearGradient id="kh-green" x1="0" x2="1" y1="0" y2="0"><stop stop-color="#00702c"/><stop offset=".5" stop-color="#00351c"/><stop offset="1" stop-color="#00772e"/></linearGradient>
    <pattern id="kh-dots" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="#c0ff00" opacity=".65"/></pattern>
  </defs>
  <rect width="1350" height="191" fill="url(#kh-green)"/>
  <path d="M0 0H1350V14L1230 88 1060 88 978 0H829L758 64H592L530 0H387L274 88H114L0 17Z" fill="#032619" opacity=".85"/>
  <path d="M0 0H175L93 88H0ZM1175 0H1350V90H1284Z" fill="url(#kh-dots)"/>
  <path d="M195 0H264L195 85H153ZM276 0H296L221 86H202ZM994 0H1037L965 88H925ZM1051 0H1072L1005 85H984Z" fill="#a5ff00"/>
  <path d="M0 0H1350" stroke="#ccff00" stroke-width="3"/>
  <path d="M417 30L468 0M433 45L483 0M456 58L505 0" stroke="#b3ff00" stroke-width="1.5" stroke-dasharray="3 5"/>
  <path d="M486 0H864L814 60H763L744 75H604L576 58H533Z" fill="#03170e" opacity=".95"/>
  <!-- White chrome portrait frame wells. -->
  <path d="M29 24L95 0 150 11 183 78 137 173 41 183 0 131 0 76Z" fill="#080e10" stroke="#f4f9fa" stroke-width="9"/>
  <path d="M27 30L96 9 142 19 173 78 128 164 47 173 9 127 10 78Z" fill="#102819" stroke="#090f0f" stroke-width="6"/>
  <path d="M1321 24L1255 0 1200 11 1167 78 1213 173 1309 183 1350 131 1350 76Z" fill="#080e10" stroke="#f4f9fa" stroke-width="9"/>
  <path d="M1323 30L1254 9 1208 19 1177 78 1222 164 1303 173 1341 127 1340 78Z" fill="#102819" stroke="#090f0f" stroke-width="6"/>
  <path d="M10 126L49 181 137 178 158 147M1340 126L1301 181 1213 178 1192 147" fill="none" stroke="#baff18" stroke-width="3"/>
  <!-- Angular black chrome spines. -->
  <path d="M153 56L324 53 346 75 522 76 566 69 607 93 633 122 609 156 573 166 378 166 351 184 145 184 122 162 157 126Z" fill="#07090f" stroke="#f5f8f7" stroke-width="5"/>
  <path d="M1197 56L1026 53 1004 75 828 76 784 69 743 93 717 122 741 156 777 166 972 166 999 184 1205 184 1228 162 1193 126Z" fill="#07090f" stroke="#f5f8f7" stroke-width="5"/>
  <path d="M165 82H589L611 116 591 149H160L142 132Z" fill="#eaffdb" stroke="#091316" stroke-width="8"/>
  <path d="M1185 82H761L739 116 759 149H1190L1208 132Z" fill="#eaffdb" stroke="#091316" stroke-width="8"/>
  <path d="M181 96H581L592 116 578 136H179L166 125Z" fill="#22510a" stroke="#b4ff0e" stroke-width="5"/>
  <path d="M1169 96H769L758 116 772 136H1171L1184 125Z" fill="#22510a" stroke="#b4ff0e" stroke-width="5"/>
  <path d="M179 54H322L346 80H185L169 72Z" fill="#060b10" stroke="#edf6f2" stroke-width="3"/>
  <path d="M1171 54H1028L1004 80H1165L1181 72Z" fill="#060b10" stroke="#edf6f2" stroke-width="3"/>
  <path d="M330 73H346L360 89H344ZM351 73H366L381 89H365ZM991 73H1007L993 89H977ZM970 73H986L972 89H956Z" fill="#ff168e"/>
  <!-- Name plates and magenta lower tabs. -->
  <path d="M154 141H369L347 181H136Z" fill="#080a0e" stroke="#f7faff" stroke-width="4"/>
  <path d="M1196 141H981L1003 181H1214Z" fill="#080a0e" stroke="#f7faff" stroke-width="4"/>
  <path d="M322 164H350L338 179H310ZM348 164H376L363 179H336ZM1000 164H1028L1016 179H988ZM974 164H1002L990 179H964Z" fill="#ff168e"/>
  <path d="M464 144H593L577 186H465L446 162ZM886 144H757L773 186H885L904 162Z" fill="#05090f" stroke="#3e4344" stroke-width="3"/>
  <!-- Timer's central black/white hexagon and magenta side fins. -->
  <path d="M615 61H735L768 100 737 169H613L582 100Z" fill="#06080f" stroke="#eff9f1" stroke-width="6"/>
  <path d="M628 66H723L746 101 724 160H626L603 101Z" fill="#171923" stroke="#253527" stroke-width="3"/>
  <path d="M604 90L620 111 603 155 593 133ZM746 90L730 111 747 155 757 133Z" fill="#ff168e"/>
  <path d="M631 62H719L706 75H644Z" fill="#e4ffe1"/>
  <path d="M555 61L577 82 597 82 610 63M795 61L773 82 753 82 740 63" fill="none" stroke="#c4ff12" stroke-width="6"/>
  </svg>`;
  hud.prepend(backdrop);
  const logo = document.createElement('div');
  logo.className = 'kt-hud-logo';
  logo.setAttribute('aria-hidden', 'true');
  logo.innerHTML = '<span class="kt-hud-burst">◢◢◢</span><span>Kenjatime</span><i></i>';
  hud.append(logo);
  const clock = document.createElement('div');
  clock.className = 'kt-hud-clock';
  clock.setAttribute('aria-label', 'Round timer');
  clock.innerHTML = '<span>TIME</span><strong>99</strong>';
  hud.append(clock);
  const clockValue = clock.querySelector('strong');
  const sides = [0, 1].map(side => {
    const row = hud.querySelector('[data-player="' + side + '"]');
    if (!row) return null;
    const frame = document.createElement('div');
    frame.className = 'kt-hud-portrait';
    frame.setAttribute('aria-hidden', 'true');
    frame.innerHTML = '<img alt="" hidden><svg viewBox="0 0 96 120" aria-hidden="true" focusable="false"><circle cx="48" cy="40" r="21" fill="#adc9b0"/><path d="M13 111c0-30 14-46 35-46s35 16 35 46Z" fill="#adc9b0"/><path d="M27 35q21-39 42 0" fill="none" stroke="#263d2d" stroke-width="8"/></svg>';
    row.prepend(frame);
    const tag = document.createElement('span');
    tag.className = 'kt-hud-player-tag';
    tag.textContent = side === 0 ? 'PLAYER 1' : 'CPU';
    row.append(tag);
    const rounds = document.createElement('span');
    rounds.className = 'kt-hud-rounds';
    rounds.setAttribute('aria-label', 'Round wins');
    rounds.innerHTML = '<i></i><i></i><i></i>';
    row.append(rounds);
    return {row, frame, rounds, name: null, wins: 0};
  });
  function update(state) {
    if (!state) return;
    const left = Number(state.roundTimeLeft);
    const value = state.roundTimeLeft == null || left < 0 || !Number.isFinite(left) ? '∞' : String(Math.max(0, Math.ceil(left / 60)));
    if (clockValue.textContent !== value) clockValue.textContent = value;
    clockValue.classList.toggle('kt-time-long', value.length > 2);
    // Fixed-size HUD markers: never retain per-round keys in endless matches.
    if (state.roundWins) sides.forEach((slot, side) => {
      if (!slot) return;
      const wins = Number(side ? state.roundWins.opponent : state.roundWins.player);
      const filled = Number.isFinite(wins) ? Math.min(3, Math.max(0, Math.floor(wins))) : 0;
      slot.rounds.querySelectorAll('i').forEach((dot, i) =>
        dot.classList.toggle('kt-round-won', i < filled));
    });
  }
  function setPortraits(portraits = []) {
    sides.forEach((slot, side) => {
      if (slot) setKenjatimeHudPortrait(slot.frame, portraits[side]);
    });
  }
  return (hud.__kenjaHudSkin = {update, setPortraits});
}
