/* =====================================================================
   PIPO JUEGA · PANTALLAS Y FLUJO
   inicio · mapa de mundos · juego · festejo · cofres · papás · perfiles
===================================================================== */
const G = { stage: null, n: 1, type: '', ctx: null, finished: false, mode: 'main', freeType: null, nextT: null, winT: null, err: 0, t0: 0 };
const ORDER_BASE = ['globos', 'clasificar', 'popit', 'emociones', 'contar', 'huevo', 'rompecabezas', 'colorear', 'encontrar', 'granja', 'memoria', 'alimentar', 'trazar', 'cocinar', 'unir', 'vehiculos', 'bano', 'piano', 'laberinto', 'tamano', 'dentista', 'patrones', 'sombras', 'pinata', 'pescar', 'bomberos', 'clima', 'tunel', 'jardin', 'formas', 'diferencias', 'lavar', 'vestir'];
/* 33 juegos base + los juegos nuevos (MAS_ORDER), mezclados de forma fija para que no se repitan seguidos */
const ORDER = (() => {
  const nw = typeof MAS_ORDER !== 'undefined' ? shuf(rng(20261016), MAS_ORDER) : [], base = ORDER_BASE, total = base.length + nw.length, out = [base[0]]; let b = 1, m = 0;
  for (let i = 1; i < total; i++) { if ((b < base.length && Math.floor(i * base.length / total) >= b) || m >= nw.length) out.push(base[b++]); else out.push(nw[m++]); }
  return out;
})();
const WORLDS = [
  { n: ['Granja', 'Farm'], icon: '🐮', theme: 'granja' }, { n: ['Bosque', 'Forest'], icon: '🌳', theme: 'bosque' }, { n: ['Mar', 'Sea'], icon: '🐠', theme: 'mar' },
  { n: ['Jardín', 'Garden'], icon: '🌻', theme: 'jardin' }, { n: ['Ciudad', 'City'], icon: '🏙️', theme: 'ciudad' }, { n: ['Dulces', 'Candy'], icon: '🍭', theme: 'dulce' },
  { n: ['Cocina', 'Kitchen'], icon: '🍕', theme: 'cocina' }, { n: ['Noche', 'Night'], icon: '🌙', theme: 'noche' }, { n: ['Espacio', 'Space'], icon: '🚀', theme: 'espacio' },
  { n: ['Arcoíris', 'Rainbow'], icon: '🌈', theme: 'cielo' }, { n: ['Juguetería', 'Toy shop'], icon: '🧸', theme: 'madera' }, { n: ['Burbujas', 'Bubbles'], icon: '🛁', theme: 'bano' },
  { n: ['Escuela', 'School'], icon: '🏫', theme: 'aula' }, { n: ['Playa', 'Beach'], icon: '🏖️', theme: 'mar' }, { n: ['Estrellas', 'Stars'], icon: '✨', theme: 'noche' }, { n: ['Fiesta', 'Party'], icon: '🎉', theme: 'dulce' }
];
const tName = t => L(TYPES[t].name[0], TYPES[t].name[1]);
const enabledTypes = () => { const on = ORDER.filter(t => !GL.set.off.includes(t)); return on.length ? on : ORDER; };
function ageAdj() { const a = curProfile().age || 4; return a <= 2 ? -1 : a <= 4 ? 0 : a <= 6 ? 1 : 2; }
/* =====================================================================
   ORDEN POR DIFICULTAD (800 niveles)
   1-300: solo juegos fáciles (2 años) · 301-560: se suman los medianos ·
   561-800: llegan los difíciles (números, letras y lógica), poco a poco.
   Cada juego empieza en su nivel más fácil y sube un poquito cada vez que vuelve.
===================================================================== */
const NUM_GAMES = ['contar', 'unir', 'numeros', 'masmenos', 'sumas', 'restas', 'quefalta', 'dados', 'reloj', 'domino', 'numcantidad', 'burbujas', 'cohete', 'tren', 'cartero', 'tiendita', 'mercado'];
const HARD_GAMES = [...NUM_GAMES, 'vocales', 'letrainicial', 'abc', 'mayusminus', 'minombre', 'trazar', 'granja', 'patrones', 'diferencias', 'intruso', 'antesdespues', 'mezclas', 'balanza', 'herramientas', 'oficios', 'rutina', 'crecer', 'mariposa', 'banda', 'pintanumeros', 'opuestos', 'eldiferente', 'gemelos', 'laberinto'];
const EASY_OLD = ['globos', 'popit', 'huevo', 'bano', 'pinata', 'bomberos', 'lavar', 'dentista', 'jardin', 'topos', 'velas', 'acuario', 'pizarra', 'luciernagas', 'carita', 'regalos', 'colorear', 'sonidos'];
const TIER = t => (typeof BEBE !== 'undefined' && BEBE.includes(t)) || EASY_OLD.includes(t) ? 1 : HARD_GAMES.includes(t) ? 3 : 2;
const LEVEL_SEQ = (() => {
  const R = rng(4242), byT = { 1: [], 2: [], 3: [] }; ORDER.forEach(t => byT[TIER(t)].push(t));
  const T1 = ['globos', ...shuf(R, byT[1].filter(t => t !== 'globos'))], T2 = shuf(R, byT[2]), T3 = shuf(R, byT[3]), idx = { 1: 0, 2: 0, 3: 0 }, L1 = { 1: T1, 2: T2, 3: T3 }, out = [];
  const take = k => { const l = L1[k].length ? L1[k] : T1; return l[idx[k]++ % l.length]; };
  for (let i = 0; i < TOTAL; i++) { const k = i < 300 ? 1 : i < 560 ? [2, 1, 2][i % 3] : [3, 2, 3, 1][i % 4]; out.push(take(k)); }
  return out;
})();
const LEVEL_OCC = (() => { const seen = {}; return LEVEL_SEQ.map(t => (seen[t] = (seen[t] || 0) + 1) - 1); })();
function levelSpec(n) {
  const i = n - 1, en = enabledTypes(); let type = LEVEL_SEQ[i] || ORDER[i % ORDER.length], occ = LEVEL_OCC[i] || 0;
  if (!en.includes(type)) { const pool = ORDER.filter(t => TIER(t) === TIER(type) && en.includes(t)), alt = pool.length ? pool : en; type = alt[i % alt.length]; }
  return { type, round: occ, d: clamp(occ + ageAdj(), 0, 4), seed: hashN(n * 7919 + 13) };
}
function show(id) { document.querySelectorAll('.screen').forEach(s => s.classList.toggle('on', s.id === id)); }
function say(t) {
  const b = $('#bubble'); b.textContent = t; b.classList.remove('hide'); b.style.animation = 'none'; void b.offsetWidth; b.style.animation = '';
  clearTimeout(say.t); say.t = setTimeout(() => b.classList.add('hide'), 5200);
  $('#guide').classList.remove('talk'); void $('#guide').offsetWidth; $('#guide').classList.add('talk'); VO.say(t);
}
function repeatSay() { AU.init(); const b = $('#bubble'); b.classList.remove('hide'); clearTimeout(say.t); say.t = setTimeout(() => b.classList.add('hide'), 5200); VO.say(VO.last || b.textContent, false); $('#guide').classList.remove('talk'); void $('#guide').offsetWidth; $('#guide').classList.add('talk'); }
function setMascot(el, mood) { el.innerHTML = pipoSVG(mood, S.outfit, curProfile().color); }
function onMistake() { G.err++; const gm = $('#guideMascot'); if (gm && G.ctx) { setMascot(gm, 'sad'); clearTimeout(onMistake.t); onMistake.t = setTimeout(() => G.ctx && !G.finished && setMascot(gm, 'happy'), 1100); } }

/* ---------- transición entre niveles ---------- */
let transTok = 0;
function trans(cb) {
  const t = $('#trans'), my = ++transTok; if (LITE()) { cb(); return; }
  t.classList.add('close'); setTimeout(() => { if (my === transTok) cb(); t.classList.remove('close'); t.classList.add('open'); setTimeout(() => t.classList.remove('open'), 420); }, 380);
}
/* ---------- iniciar un nivel ---------- */
function startLevel(n, spec) {
  clearTimeout(G.nextT); clearTimeout(G.winT); $('#win').classList.remove('on'); $('#hand').classList.remove('on');
  if (G.ctx && G.ctx.cleanup) try { G.ctx.cleanup(); } catch (e) {}
  const st = $('#stage'); st.innerHTML = ''; G.stage = st; G.finished = false; G.n = n; G.err = 0; G.t0 = Date.now();
  spec = spec || levelSpec(n); G.type = spec.type; G.spec = spec;
  const T = TYPES[spec.type], free = G.mode === 'free';
  const theme = free ? T.theme : (n % 3 === 0 ? WORLDS[Math.floor((n - 1) / 50)].theme : T.theme);
  $('#gameBg').innerHTML = bgSVG(theme); setMascot($('#guideMascot'), 'happy');
  $('#lvlBadge').innerHTML = free ? `<span class="emo">${T.icon}</span> ${tName(spec.type)}` : `<span class="emo">${WORLDS[Math.floor((n - 1) / 50)].icon}</span> ${L('Nivel', 'Level')} ${n}`;
  $('#lvlBar').style.visibility = free ? 'hidden' : ''; $('#lvlBar > i').style.width = ((n - 1) % 50 + 1) / 50 * 100 + '%';
  $('#starCount').textContent = '⭐ ' + S.stars;
  const ctx = { stage: st, r: rng(spec.seed), d: spec.d, W: st.clientWidth, H: st.clientHeight, hint: null, solve: null, cleanup: null, noRestart: false };
  ctx.say = t => { if (G.ctx === ctx) say(t); }; ctx.done = () => { if (G.ctx === ctx) win(); };
  G.ctx = ctx; markAct();
  try { T.make(ctx); } catch (e) { console.error('Nivel', n, spec.type, e); setTimeout(() => ctx.done(), 300); }
}
/* ---------- festejo ---------- */
function win() {
  if (G.finished) return; G.finished = true; $('#hand').classList.remove('on'); $('#bubble').classList.add('hide');
  const myCtx = G.ctx, n = G.n, type = G.type;
  const st = S.stats[type] = S.stats[type] || { p: 0, e: 0, t: 0 }; st.p++; st.e += G.err; st.t += Math.min(600000, Date.now() - G.t0);
  let sticker = null, chest = false;
  S.stars++;
  if (G.mode === 'main') {
    const first = !isDone(n); markDone(n);
    if (n >= S.best) S.best = Math.min(TOTAL + 1, n + 1);
    if (first && n % 10 === 0) { const k = n / 10 - 1; if (STICKERS[k] && !S.stickers.includes(k)) { S.stickers.push(k); sticker = STICKERS[k]; } }
    if (first && n % 25 === 0 && !S.chests.includes(n)) chest = true;
  }
  save();
  G.winT = setTimeout(() => {
    if (G.ctx !== myCtx) return;
    AU.sfx('win'); confetti();
    if (!LITE()) [0, 350, 700].forEach(t => setTimeout(() => firework(innerWidth * (.2 + Math.random() * .6), innerHeight * (.15 + Math.random() * .25)), t));
    const name = curProfile().name, pr = (EN() ? PRAISE.en : PRAISE.es)[Math.floor(Math.random() * 10)];
    const praise = name && Math.random() < .5 ? pr.replace(/!$/, `, ${name}!`) : pr;
    $('#winTxt').textContent = praise; $('#winPipo').innerHTML = pipoSVG('joy', S.outfit, curProfile().color);
    $('#winSub').innerHTML = sticker ? `<span class="emo">🎁</span> ${L('¡Sticker nuevo!', 'New sticker!')} <span class="emo bigstk">${sticker}</span>` : '';
    $('#win').classList.add('on'); flyStars([innerWidth / 2, innerHeight / 2], $('#starCount'), LITE() ? 2 : 5);
    setTimeout(() => $('#starCount').textContent = '⭐ ' + S.stars, 900);
    const recId = sticker ? 'sticker' : pick(Math.random, ['muybien', 'excelente', 'bravo']);
    VDB.get(recId).then(b => { if (b && Math.random() < .7) VDB.play(recId); else VO.say(sticker ? praise + ' ' + L('¡Ganaste un sticker nuevo!', 'You got a new sticker!') : praise, false); });
    G.nextT = setTimeout(() => chest ? openChest(n) : nextLevel(), sticker ? 3600 : 2700);
  }, 450);
}
function nextLevel() {
  clearTimeout(G.nextT); AU.init(); $('#win').classList.remove('on');
  if (G.mode === 'free') { trans(() => startFree(G.freeType, true)); return; }
  const n = G.n + 1; if (n > TOTAL) { finale(); return; }
  if ((n - 1) % 50 === 0) { worldIntro(Math.floor((n - 1) / 50), () => trans(() => startLevel(n))); return; }
  trans(() => startLevel(n));
}
function worldIntro(w, cb) {
  const W = WORLDS[w], o = $('#worldIntro'); o.innerHTML = `<div class="bgwrap">${bgSVG(W.theme)}</div><div class="wi-card"><div class="emo" style="font-size:80px">${W.icon}</div><h2>${L('¡Nuevo mundo!', 'New world!')}</h2><p>${L(W.n[0], W.n[1])}</p></div>`;
  o.classList.add('on'); AU.sfx('chest'); confetti(100); VO.say(L(`¡Bienvenido al mundo ${W.n[0]}!`, `Welcome to the ${W.n[1]} world!`), false); MUSIC.stopSynth(); MUSIC.start(w);
  setTimeout(() => { o.classList.remove('on'); cb && cb(); }, 2600);
}
function finale() {
  $('#win').classList.add('on'); $('#winTxt').textContent = L('¡Completaste los 500 juegos!', 'You finished all 500 games!'); $('#winSub').innerHTML = '<span class="emo" style="font-size:60px">🏆👑🏆</span>';
  confetti(260); [0, 300, 600, 900].forEach(t => setTimeout(() => firework(innerWidth * Math.random(), innerHeight * .3), t)); AU.sfx('win');
  VO.say(L('¡Felicidades! ¡Completaste los quinientos juegos! ¡Eres una estrella!', 'Congratulations! You finished all five hundred games! You are a star!'), false); clearTimeout(G.nextT);
}
/* ---------- cofre sorpresa cada 25 niveles ---------- */
function openChest(n) {
  $('#win').classList.remove('on'); const o = $('#chest'); let taps = 0;
  const locked = ACC_ALL.filter(id => !S.acc.includes(id)), prize = locked.length ? pick(Math.random, locked) : null, extra = Math.floor(Math.random() * 3) + 3;
  o.innerHTML = `<div class="chest-wrap"><div class="chest-box choice" id="chestBox"><svg viewBox="0 0 200 170" width="100%"><rect x="20" y="70" width="160" height="90" rx="12" fill="#c97a2b" stroke="#7a4210" stroke-width="6"/><path class="lid" d="M20 76q0-56 80-56t80 56z" fill="#e0943c" stroke="#7a4210" stroke-width="6"/><rect x="88" y="66" width="24" height="34" rx="5" fill="#ffd23f" stroke="#a8740a" stroke-width="4"/><path d="M20 110h160" stroke="#7a4210" stroke-width="6"/></svg></div><p class="chest-txt">${L('¡Un cofre sorpresa! Tócalo 3 veces', 'A surprise chest! Tap it 3 times')}</p></div>`;
  o.classList.add('on'); AU.sfx('chest'); VO.say(L('¡Un cofre sorpresa! Tócalo tres veces', 'A surprise chest! Tap it three times'), false);
  const box = $('#chestBox');
  box.addEventListener('pointerdown', () => {
    taps++; AU.sfx('crack'); bump(box, 'shake');
    if (taps >= 3) {
      S.chests.push(n); if (prize) S.acc.push(prize); S.stars += extra; save(); AU.sfx('chest'); confetti(160); firework(innerWidth / 2, innerHeight * .3);
      const col = curProfile().color;
      o.querySelector('.chest-wrap').innerHTML = `<div class="prize boing">${prize ? `<div style="width:min(60vmin,320px)">${pipoSVG('joy', Object.assign({}, S.outfit, { [accSlot(prize)]: prize }), col)}</div><p class="chest-txt">${L('¡Nuevo accesorio para Pipo:', 'New outfit for Pipo:')} <b>${ACC[accSlot(prize)][prize].n}</b>! +${extra} ⭐</p>` : `<div class="emo" style="font-size:120px">⭐</div><p class="chest-txt">+${extra} ⭐</p>`}<button class="bigbtn" onclick="closeChest()">${L('¡Genial!', 'Great!')} ▶</button></div>`;
      VO.say(L('¡Ganaste un regalo nuevo para Pipo! Úsalo en el juego de vestir', 'You won a new gift for Pipo!'), false);
      G.nextT = setTimeout(closeChest, 6000);
    }
  });
}
function closeChest() { clearTimeout(G.nextT); $('#chest').classList.remove('on'); nextLevel(); }

/* ---------- modos de juego ---------- */
function playLevel(n) { AU.init(); checkStreak(); G.mode = 'main'; closePanels(); show('game'); MUSIC.start(Math.floor((n - 1) / 50)); trans(() => startLevel(n)); }
function startFree(type, keep) {
  AU.init(); MUSIC.start(ORDER.indexOf(type)); G.mode = 'free'; G.freeType = type; closePanels(); if (!keep) checkStreak(); show('game');
  const d = clamp(Math.floor((S.best - 1) / 160) + Math.floor(Math.random() * 2) + ageAdj(), 0, 4);
  startLevel(0, { type, d, round: 0, seed: Math.floor(Math.random() * 1e9) });
}
function goHome() { transTok++; clearTimeout(G.nextT); clearTimeout(G.winT); if (G.ctx && G.ctx.cleanup) try { G.ctx.cleanup(); } catch (e) {} G.ctx = null; if ('speechSynthesis' in window) speechSynthesis.cancel(); $('#chest').classList.remove('on'); show('home'); renderHome(); }
/* ---------- racha diaria ---------- */
function checkStreak() {
  const t = today(); if (S.lastDay === t) return;
  const y = new Date(); y.setDate(y.getDate() - 1); const yd = `${y.getFullYear()}-${y.getMonth() + 1}-${y.getDate()}`;
  S.streak = S.lastDay === yd ? (S.streak || 0) + 1 : 1; S.lastDay = t; save();
  if (S.streak > 1) { const s = $('#streakToast'); s.innerHTML = `<span class="emo">🔥</span> ${L(`¡${S.streak} días seguidos jugando!`, `${S.streak} days in a row!`)}`; s.classList.add('on'); setTimeout(() => s.classList.remove('on'), 3200); VO.say(L(`¡Llevas ${numw(Math.min(12, S.streak))} días seguidos! ¡Sigue así!`, `${numw(Math.min(12, S.streak))} days in a row! Keep going!`), false); }
}
/* =====================================================================
   INICIO
===================================================================== */
function renderHome() {
  const p = curProfile(); setMascot($('#homeMascot'), 'happy');
  document.documentElement.style.setProperty('--acc', p.color);
  $('#homeTitle').textContent = 'Pipo Juega'; $('#homeSub').textContent = L('200 juegos · 800 niveles para aprender jugando', '200 games · 800 levels to learn and play');
  const lv = Math.min(S.best, TOTAL), done = doneCount();
  $('#playLbl').textContent = done ? `${L('Seguir', 'Continue')} · ${L('Nivel', 'Level')} ${lv}` : L('¡A jugar!', "Let's play!");
  $('#homeBar').style.width = (done / TOTAL * 100) + '%'; $('#homeTxt').textContent = `${done} ${L('de', 'of')} ${TOTAL} · ⭐ ${S.stars}`;
  $('#profChip').innerHTML = `<span class="chipav">${animalSVG(p.avatar || 'pollito', 'happy')}</span><b>${p.name || L('Mi peque', 'My kid')}</b>`;
  $('#streakBadge').innerHTML = S.streak > 1 && S.lastDay === today() ? `<span class="emo">🔥</span> ${S.streak}` : '';
  $('#btnMap').innerHTML = `<span class="emo">🗺️</span> ${L('Mapa', 'Map')}`; $('#btnCats').innerHTML = `<span class="emo">🎲</span> ${L('Elegir juego', 'Pick a game')}`;
  $('#btnAlbum').innerHTML = `<span class="emo">📒</span> ${L('Stickers', 'Stickers')}`; $('#btnParents').innerHTML = `<span class="emo">⚙️</span> ${L('Papás', 'Parents')}`;
  $('#credit').textContent = L('Hecho con cariño por Leandro Zamora', 'Made with love by Leandro Zamora');
}
function homePoke(el) { AU.init(); AU.sfx('boing'); el.innerHTML = pipoSVG('joy', S.outfit, curProfile().color); bump(el); VDB.get('hola').then(b => { if (b) VDB.play('hola'); else { const nm0 = curProfile().name; VO.say(L(`¡Hola${nm0 ? ' ' + nm0 : ''}! Soy Pipo. ¡Vamos a jugar!`, `Hi${nm0 ? ' ' + nm0 : ''}! I'm Pipo. Let's play!`), false); } }); setTimeout(() => setMascot(el, 'happy'), 1300); }
/* =====================================================================
   MAPA DE MUNDOS
===================================================================== */
let mapWorld = 0;
function openMap(w) {
  AU.init(); MUSIC.start(); show('map');
  mapWorld = w != null ? w : Math.min(WORLDS.length - 1, Math.floor((Math.min(S.best, TOTAL) - 1) / 50)); renderMap();
}
function renderMap() {
  const W = WORLDS[mapWorld], unlockedW = Math.floor((Math.min(S.best, TOTAL) - 1) / 50);
  $('#mapBg').innerHTML = bgSVG(W.theme);
  $('#mapTitle').innerHTML = `<span class="emo">${W.icon}</span> ${L('Mundo', 'World')} ${mapWorld + 1}: ${L(W.n[0], W.n[1])}`;
  $('#mapTabs').innerHTML = WORLDS.map((w, i) => `<button class="wtab ${i === mapWorld ? 'on' : ''} ${i > unlockedW ? 'lock' : ''}" onclick="${i > unlockedW ? 'AU.sfx(\'no\')' : `mapWorld=${i};renderMap()`}"><span class="emo">${i > unlockedW ? '🔒' : w.icon}</span></button>`).join('');
  const land = innerWidth > innerHeight, cols = land ? 10 : 5, box = $('#mapPath'), start = mapWorld * 50 + 1;
  let html = '', pts = [];
  for (let k = 0; k < 50; k++) {
    const n = start + k, row = Math.floor(k / cols), colRaw = k % cols, col = row % 2 ? cols - 1 - colRaw : colRaw;
    const x = (col + .5) / cols * 100, y = (row + .5) / (50 / cols) * 100; pts.push([x, y]);
    const done = isDone(n), cur = n === Math.min(S.best, TOTAL), lock = n > S.best;
    const icon = n % 25 === 0 ? '🎁' : n % 10 === 0 ? '🎟️' : '';
    html += `<button class="node ${done ? 'done' : ''} ${cur ? 'cur' : ''} ${lock ? 'lock' : ''}" style="left:${x}%;top:${y}%" onclick="${lock ? 'AU.sfx(\'no\')' : `playLevel(${n})`}" aria-label="${L('Nivel', 'Level')} ${n}">${lock ? '🔒' : n}${icon ? `<i class="emo">${icon}</i>` : ''}${done ? '<s class="emo">⭐</s>' : ''}${cur ? `<span class="nodepipo">${pipoSVG('joy', S.outfit, curProfile().color)}</span>` : ''}</button>`;
  }
  box.style.aspectRatio = land ? '10 / 5.4' : '5 / 10.8';
  box.innerHTML = `<svg viewBox="0 0 100 100" preserveAspectRatio="none" class="mappath"><polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" stroke-dasharray="2 10"/></svg>${html}`;
  const c = box.querySelector('.cur'); if (c) setTimeout(() => c.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' }), 120);
}
/* =====================================================================
   PANELES: categorías, álbum, perfiles
===================================================================== */
function closePanels() { document.querySelectorAll('.panel').forEach(p => p.classList.remove('on')); }
function openCats() { AU.init(); $('#catTitle').textContent = L('¿A qué jugamos?', 'What shall we play?'); $('#catGrid').innerHTML = enabledTypes().slice().sort((x, y) => TIER(x) - TIER(y)).map(k => `<button class="cat" onclick="startFree('${k}')"><span class="emo">${TYPES[k].icon}</span>${tName(k)}</button>`).join(''); $('#catPanel').classList.add('on'); }
function openAlbum() {
  AU.init(); $('#albumTitle').innerHTML = `${L('Mis stickers', 'My stickers')} <small>(${S.stickers.length}/${STICKERS.length})</small>`;
  $('#albumHelp').textContent = L('¡Ganas un sticker nuevo cada 10 niveles! Tócalos para jugar con ellos.', 'You get a new sticker every 10 levels! Tap them to play.');
  $('#albumGrid').innerHTML = STICKERS.map((s, i) => `<div class="stk ${S.stickers.includes(i) ? '' : 'lock'} emo" ${S.stickers.includes(i) ? `onclick="stickerTap(this)"` : ''} style="animation-delay:${-(i % 7) * .4}s">${S.stickers.includes(i) ? s : '🔒'}</div>`).join('');
  $('#albumPanel').classList.add('on');
}
function stickerTap(el) { AU.init(); el.classList.remove('spin1'); void el.offsetWidth; el.classList.add('spin1'); AU.tone([523, 659, 784, 988][Math.floor(Math.random() * 4)], .3, 'triangle', .2); sparkleEl(el, 6); }
const AVATARS = ['pollito', 'perro', 'gato', 'conejo', 'oso', 'panda', 'mono', 'leon', 'zorro', 'koala', 'tigre', 'elefante', 'jirafa', 'pinguino', 'buho', 'rana'];
const FAVCOLS = ['#ff6fa8', '#ff4d4d', '#ff9a3c', '#ffd23f', '#4cd964', '#3d8bff', '#a66bff', '#5fd3ff'];
function openProfiles() {
  AU.init();
  $('#profList').innerHTML = GL.profiles.map(p => `<button class="profrow ${p.id === GL.cur ? 'on' : ''}" onclick="switchProfile('${p.id}')"><span class="chipav big">${animalSVG(p.avatar || 'pollito', 'happy')}</span><b>${p.name || L('Mi peque', 'My kid')}</b><small>${p.age} ${L('años', 'years')}</small></button>`).join('') + `<button class="profrow add" onclick="editProfile(null)"><span class="emo" style="font-size:40px">➕</span><b>${L('Agregar niño o niña', 'Add a child')}</b></button>`;
  $('#profTitle').textContent = L('¿Quién juega?', "Who's playing?"); $('#profEditBtn').textContent = L('✏️ Editar perfil actual', '✏️ Edit current profile');
  $('#profPanel').classList.add('on');
}
function switchProfile(id) { loadProfile(id); renderHome(); closePanels(); AU.sfx('ok'); VO.say(L(`¡Hola ${curProfile().name || ''}!`, `Hi ${curProfile().name || ''}!`), false); }
let editing = null;
function editProfile(id) {
  editing = id; const p = id ? GL.profiles.find(x => x.id === id) : { name: '', age: 4, color: '#ff6fa8', avatar: 'pollito' };
  closePanels(); const f = $('#editPanel'); f.classList.add('on'); f.dataset.age = p.age; f.dataset.color = p.color; f.dataset.avatar = p.avatar;
  $('#editTitle').textContent = id ? L('Editar perfil', 'Edit profile') : (GL.profiles.length === 1 && !GL.profiles[0].name ? L('¡Bienvenido! ¿Cómo se llama tu peque?', "Welcome! What's your kid's name?") : L('Nuevo perfil', 'New profile'));
  $('#editName').value = p.name || ''; $('#editName').placeholder = L('Nombre', 'Name');
  const ages = [2, 3, 4, 5, 6, 7];
  $('#editAges').innerHTML = ages.map(a => `<button class="agebtn ${a === p.age ? 'on' : ''}" onclick="pickEdit('age',${a},this)">${a}${a === 7 ? '+' : ''}</button>`).join('');
  $('#editColors').innerHTML = FAVCOLS.map(cl => `<button class="colbtn ${cl === p.color ? 'on' : ''}" style="background:${cl}" onclick="pickEdit('color','${cl}',this)"></button>`).join('');
  $('#editAvatars').innerHTML = AVATARS.map(a => `<button class="avbtn ${a === p.avatar ? 'on' : ''}" onclick="pickEdit('avatar','${a}',this)">${animalSVG(a, 'happy')}</button>`).join('');
  $('#editDel').style.display = id && GL.profiles.length > 1 ? '' : 'none';
  $('#editAgeL').textContent = L('Edad', 'Age'); $('#editColL').textContent = L('Color favorito', 'Favorite color'); $('#editAvL').textContent = L('Elige su personaje', 'Pick an avatar'); $('#editSave').textContent = L('Guardar', 'Save'); $('#editDel').textContent = L('Borrar perfil', 'Delete profile');
}
function pickEdit(k, v, el) { const f = $('#editPanel'); f.dataset[k] = v; el.parentNode.querySelectorAll('button').forEach(b => b.classList.remove('on')); el.classList.add('on'); AU.init(); AU.sfx('tap'); if (k === 'avatar') AU.animal(v); }
function saveProfile() {
  const f = $('#editPanel'), data = { name: $('#editName').value.trim().slice(0, 18), age: +f.dataset.age || 4, color: f.dataset.color || '#ff6fa8', avatar: f.dataset.avatar || 'pollito' };
  if (editing) Object.assign(GL.profiles.find(x => x.id === editing), data); else if (GL.profiles.length === 1 && !GL.profiles[0].name && !GL.welcomed) Object.assign(GL.profiles[0], data); else createProfile(data.name, data.age, data.color, data.avatar);
  GL.welcomed = true; saveGL(); closePanels(); renderHome(); AU.sfx('ok');
}
function deleteProfile() { if (!editing || GL.profiles.length < 2 || !confirm(L('¿Borrar este perfil y su avance?', 'Delete this profile and its progress?'))) return; GL.profiles = GL.profiles.filter(p => p.id !== editing); try { localStorage.removeItem(pkey(editing)); } catch (e) {} loadProfile(GL.profiles[0].id); closePanels(); renderHome(); }
/* =====================================================================
   PAPÁS: candado, ajustes, tiempo, juegos, reporte, voz, nube
===================================================================== */
let gateNext = null, gateAns = 0, gateIn = '';
function parentGate(next) {
  AU.init(); gateNext = next; const a = 3 + Math.floor(Math.random() * 7), b = 4 + Math.floor(Math.random() * 6); gateAns = a + b; gateIn = '';
  $('#gateQ').textContent = `${L('Solo para papás', 'Grown-ups only')}: ${a} + ${b} = ?`; $('#gateIn').textContent = '_';
  $('#gateKeys').innerHTML = [1, 2, 3, 4, 5, 6, 7, 8, 9, '⌫', 0, '✓'].map(k => `<button class="gk" onclick="gateKey('${k}')">${k}</button>`).join('');
  closePanels(); $('#gatePanel').classList.add('on');
}
function gateKey(k) { if (k === '⌫') gateIn = gateIn.slice(0, -1); else if (k === '✓') { if (+gateIn === gateAns) { closePanels(); const n = gateNext; gateNext = null; n && n(); } else { AU.sfx('no'); bump($('#gateIn'), 'shake'); gateIn = ''; } } else if (gateIn.length < 2) gateIn += k; $('#gateIn').textContent = gateIn || '_'; }
function openParents(tab = 'ajustes') {
  const tabs = [['ajustes', L('Ajustes', 'Settings')], ['tiempo', L('Tiempo', 'Time')], ['juegos', L('Juegos', 'Games')], ['reporte', L('Reporte', 'Report')], ['voz', L('Tu voz', 'Your voice')], ['nube', L('Nube', 'Cloud')]];
  $('#parTabs').innerHTML = tabs.map(([k, l]) => `<button class="ptab ${k === tab ? 'on' : ''}" onclick="openParents('${k}')">${l}</button>`).join('');
  $('#parTitle').textContent = L('Para papás', 'For parents');
  const box = $('#parBody'), T = (k, label, icon) => `<button class="pill" onclick="toggleSet('${k}')"><span class="emo">${icon}</span> ${label}: <b>${GL.set[k] === true ? L('Sí', 'On') : L('No', 'Off')}</b></button>`;
  if (tab === 'ajustes') box.innerHTML = `<div class="toggles">${T('sound', L('Efectos', 'Sound effects'), '🔔')}${T('voice', L('Voz', 'Voice'), '🗣️')}${T('music', L('Música', 'Music'), '🎵')}${T('night', L('Modo noche', 'Night mode'), '🌙')}<button class="pill" onclick="GL.set.lite=!LITE();saveGL();openParents('ajustes')"><span class="emo">🪶</span> ${L('Modo liviano', 'Light mode')}: <b>${LITE() ? L('Sí', 'On') : L('No', 'Off')}</b></button></div>
    <p class="ph">${L('Idioma del juego', 'Game language')}</p><div class="toggles"><button class="pill ${!EN() ? 'sel' : ''}" onclick="setLang('es')">🇵🇪 Español</button><button class="pill ${EN() ? 'sel' : ''}" onclick="setLang('en')">🇺🇸 English</button></div>
    <p class="ph">${L('Avance', 'Progress')}</p><div class="toggles"><button class="pill" onclick="askLevel()"><span class="emo">🔢</span> ${L('Ir a un nivel', 'Go to level')}</button><button class="pill" onclick="resetAll()"><span class="emo">♻️</span> ${L('Empezar de cero', 'Start over')}</button><button class="pill" onclick="fullScreen()"><span class="emo">⛶</span> ${L('Pantalla completa', 'Full screen')}</button></div>
    <p class="note">${L('En modo liviano hay menos animaciones; úsalo en celulares o tablets lentas.', 'Light mode reduces animations for slower devices.')}</p>`;
  if (tab === 'tiempo') { const mins = Math.floor((S.todayDate === today() ? S.todayMs : 0) / 60000); box.innerHTML = `<p class="ph">${L('Límite de juego por día', 'Daily play limit')}</p><div class="toggles">${[0, 15, 20, 30, 45, 60].map(m => `<button class="pill ${GL.set.limit === m ? 'sel' : ''}" onclick="GL.set.limit=${m};saveGL();openParents('tiempo')">${m ? m + ' min' : L('Sin límite', 'No limit')}</button>`).join('')}</div><p class="note">${L(`Hoy lleva jugando <b>${mins} min</b>. Al llegar al límite, Pipo se va a dormir y pide descansar. Solo un adulto puede seguir.`, `Played today: <b>${mins} min</b>. When the limit is reached, Pipo goes to sleep.`)}</p><div class="toggles"><button class="pill" onclick="S.todayMs=0;save();openParents('tiempo')">${L('Reiniciar el tiempo de hoy', "Reset today's time")}</button></div>`; }
  if (tab === 'juegos') box.innerHTML = `<p class="ph">${L('Elige qué juegos salen (toca para quitar o poner)', 'Choose which games appear')}</p><div class="grid">${ORDER.map(k => `<button class="cat ${GL.set.off.includes(k) ? 'off' : ''}" onclick="toggleType('${k}')"><span class="emo">${TYPES[k].icon}</span>${tName(k)}<br><small>${GL.set.off.includes(k) ? L('Apagado', 'Off') : '✔'}</small></button>`).join('')}</div>`;
  if (tab === 'reporte') {
    const rows = ORDER.map(k => { const s = S.stats[k]; if (!s || !s.p) return null; const acc = Math.max(0, Math.round(100 - s.e / s.p * 25)); return { k, p: s.p, acc, t: Math.round(s.t / s.p / 1000) }; }).filter(Boolean).sort((a, b) => b.acc - a.acc);
    const good = rows.filter(r => r.acc >= 80).slice(0, 4).map(r => tName(r.k)), hard = rows.filter(r => r.acc < 60).slice(-4).map(r => tName(r.k));
    box.innerHTML = rows.length ? `<div class="repsum"><div><b>${doneCount()}</b><small>${L('niveles', 'levels')}</small></div><div><b>⭐ ${S.stars}</b><small>${L('estrellas', 'stars')}</small></div><div><b>🔥 ${S.streak || 0}</b><small>${L('días seguidos', 'day streak')}</small></div><div><b>${S.stickers.length}</b><small>stickers</small></div></div>
      ${good.length ? `<p class="ph">💪 ${L('Domina', 'Strong at')}: ${good.join(', ')}</p>` : ''}${hard.length ? `<p class="ph">🌱 ${L('Practicar más', 'Needs practice')}: ${hard.join(', ')}</p>` : ''}
      <div class="bars">${rows.map(r => `<div class="bar"><span class="emo">${TYPES[r.k].icon}</span><em>${tName(r.k)}</em><i><b style="width:${r.acc}%;background:${r.acc >= 80 ? '#4cd964' : r.acc >= 60 ? '#ffd23f' : '#ff9a3c'}"></b></i><small>${r.acc}% · ${r.p}× · ${r.t}s</small></div>`).join('')}</div><p class="note">${L('El porcentaje baja con cada error dentro del juego. Es solo una guía.', 'Accuracy goes down with each mistake. Just a guide.')}</p>`
      : `<p class="note">${L('Aún no hay datos. ¡Juega unos niveles y vuelve!', 'No data yet. Play some levels!')}</p>`;
  }
  if (tab === 'voz') {
    box.innerHTML = `<p class="ph">${L('Graba tu voz para felicitar a tu peque', 'Record your voice to cheer your kid')}</p><p class="note">${L('Se guarda solo en este dispositivo. Pipo usará tu voz al festejar.', 'Saved only on this device.')}</p><div class="recs">${REC_PHRASES.map(p => `<div class="rec" id="rec-${p.id}"><b>${p.es}</b><button class="pill" onclick="recVoice('${p.id}',this)">🎙️ ${L('Grabar', 'Record')}</button><button class="pill" onclick="VDB.play('${p.id}').then(ok=>ok||AU.sfx('no'))">▶</button><button class="pill" onclick="VDB.del('${p.id}').then(()=>openParents('voz'))">🗑️</button><small class="has"></small></div>`).join('')}</div>`;
    REC_PHRASES.forEach(p => VDB.get(p.id).then(b => { const el = document.querySelector(`#rec-${p.id} .has`); if (el) el.textContent = b ? '✔ ' + L('grabado', 'saved') : ''; }));
  }
  if (tab === 'nube') {
    const ok = CONFIG.SUPABASE_URL && CONFIG.SUPABASE_KEY;
    box.innerHTML = ok ? `<p class="ph">${L('Guardar el avance en la nube', 'Cloud save')}</p><p class="note">${L('Usa el mismo código en otra tablet o celular para continuar donde se quedó.', 'Use the same code on another device to continue.')}</p>
      ${GL.cloud ? `<div class="cloudcode">${GL.cloud}</div><div class="toggles"><button class="pill" onclick="cloudSave(true)">☁️⬆ ${L('Guardar ahora', 'Save now')}</button></div>` : `<div class="toggles"><button class="pill" onclick="cloudCreate()">☁️ ${L('Crear código familiar', 'Create family code')}</button></div>`}
      <p class="ph">${L('¿Ya tienes un código?', 'Have a code?')}</p><div class="toggles"><input id="cloudIn" maxlength="8" placeholder="ABCD1234" class="inp" style="width:160px;text-transform:uppercase"><button class="pill" onclick="cloudLoad($('#cloudIn').value)">☁️⬇ ${L('Cargar', 'Load')}</button></div><p class="note" id="cloudMsg"></p>`
      : `<p class="note">${L('La nube está apagada. Para activarla, el creador de la página debe poner sus llaves de Supabase en js/motor.js (ver README).', 'Cloud is disabled. Add Supabase keys in js/motor.js (see README).')}</p>`;
  }
  $('#parentPanel').classList.add('on');
}
function toggleSet(k) { GL.set[k] = !GL.set[k]; saveGL(); if (k === 'music') GL.set.music ? MUSIC.start() : MUSIC.stop(); if (k === 'night') document.documentElement.classList.toggle('night', GL.set.night); if (k === 'voice' && !GL.set.voice && 'speechSynthesis' in window) speechSynthesis.cancel(); openParents('ajustes'); }
function toggleType(k) { const i = GL.set.off.indexOf(k); if (i >= 0) GL.set.off.splice(i, 1); else if (GL.set.off.length < ORDER.length - 1) GL.set.off.push(k); saveGL(); openParents('juegos'); }
function setLang(l) { GL.set.lang = l; saveGL(); VO.pickVoice(); openParents('ajustes'); renderHome(); VO.say(L('¡Hola! Ahora jugamos en español', "Hi! Now we play in English"), false); }
function askLevel() { const v = parseInt(prompt(L(`¿A qué nivel quieres ir? (1 a ${TOTAL})`, `Which level? (1 to ${TOTAL})`), S.best), 10); if (v >= 1 && v <= TOTAL) { S.best = Math.max(S.best, v); save(); closePanels(); playLevel(v); } }
function resetAll() { if (confirm(L('¿Borrar el avance de este perfil y empezar desde el nivel 1?', 'Erase this profile progress?'))) { const keep = { acc: S.acc }; S = blankProfile(); save(); renderHome(); closePanels(); } }
function fullScreen() { const d = document.documentElement; (d.requestFullscreen || d.webkitRequestFullscreen || (() => {})).call(d); closePanels(); }
function toggleSound() { const on = !(GL.set.sound || GL.set.music || GL.set.voice); GL.set.sound = GL.set.music = GL.set.voice = on; saveGL(); $('#sndBtn').innerHTML = `<span class="emo">${on ? '🔊' : '🔇'}</span>`; if (on) MUSIC.start(); else { MUSIC.stop(); if ('speechSynthesis' in window) speechSynthesis.cancel(); } }
/* grabadora de voz */
let recorder = null;
async function recVoice(id, btn) {
  if (recorder) { recorder.stop(); return; }
  if (!navigator.mediaDevices || !window.MediaRecorder) { alert(L('Tu navegador no permite grabar audio.', 'Recording not supported.')); return; }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true }), chunks = []; recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = async () => { stream.getTracks().forEach(t => t.stop()); recorder = null; clearTimeout(recVoice.t); await VDB.put(id, new Blob(chunks, { type: chunks[0] ? chunks[0].type : 'audio/webm' })); AU.sfx('ok'); openParents('voz'); };
    recorder.start(); btn.innerHTML = '⏹ ' + L('Detener', 'Stop'); btn.classList.add('rec-on'); recVoice.t = setTimeout(() => recorder && recorder.stop(), 4000);
  } catch (e) { alert(L('No se pudo usar el micrófono.', 'Microphone not available.')); recorder = null; }
}
/* nube con Supabase (opcional) */
const CLOUD_FIELDS = () => ({ profiles: GL.profiles, cur: GL.cur, data: Object.fromEntries(GL.profiles.map(p => [p.id, JSON.parse(localStorage.getItem(pkey(p.id)) || '{}')])) });
async function rpcCall(fn, body) { const r = await fetch(`${CONFIG.SUPABASE_URL.replace(/\/$/, '')}/rest/v1/rpc/${fn}`, { method: 'POST', headers: { apikey: CONFIG.SUPABASE_KEY, Authorization: 'Bearer ' + CONFIG.SUPABASE_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); if (!r.ok) throw new Error(r.status); return r.json(); }
let cloudT = null;
function cloudSoon() { if (!GL.cloud || !CONFIG.SUPABASE_URL) return; clearTimeout(cloudT); cloudT = setTimeout(() => cloudSave(false), 5000); }
async function cloudSave(manual) { if (!GL.cloud) return; try { await rpcCall('pipo_guardar', { p_codigo: GL.cloud, p_datos: CLOUD_FIELDS() }); if (manual) { const m = $('#cloudMsg'); if (m) m.textContent = '✔ ' + L('Guardado en la nube', 'Saved to cloud'); } } catch (e) { if (manual) { const m = $('#cloudMsg'); if (m) m.textContent = '✖ ' + L('No se pudo guardar. Revisa internet.', 'Could not save.'); } } }
function cloudCreate() { const ch = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; GL.cloud = Array.from({ length: 8 }, () => ch[Math.floor(Math.random() * ch.length)]).join(''); saveGL(); cloudSave(true); openParents('nube'); }
async function cloudLoad(code) {
  code = (code || '').trim().toUpperCase(); const m = $('#cloudMsg'); if (code.length < 6) return;
  try { const d = await rpcCall('pipo_cargar', { p_codigo: code }); if (!d || !d.profiles) { m.textContent = '✖ ' + L('Código no encontrado', 'Code not found'); return; } if (!confirm(L('¿Reemplazar el avance de este dispositivo con el de la nube?', 'Replace local progress with cloud data?'))) return;
    GL.profiles = d.profiles; GL.cloud = code; Object.entries(d.data || {}).forEach(([id, v]) => localStorage.setItem(pkey(id), JSON.stringify(v))); saveGL(); loadProfile(d.cur || d.profiles[0].id); renderHome(); m.textContent = '✔ ' + L('¡Avance cargado!', 'Progress loaded!');
  } catch (e) { m.textContent = '✖ ' + L('No se pudo cargar. Revisa internet.', 'Could not load.'); }
}
/* ---------- control de tiempo ---------- */
setInterval(() => {
  if (!$('#game').classList.contains('on') || document.hidden || $('#rest').classList.contains('on')) return;
  if (S.todayDate !== today()) { S.todayDate = today(); S.todayMs = 0; }
  S.todayMs += 1000; if (S.todayMs % 15000 === 0) save();
  if (GL.set.limit && S.todayMs >= GL.set.limit * 60000) showRest();
}, 1000);
function showRest() {
  clearTimeout(G.nextT); if (G.ctx && G.ctx.cleanup) try { G.ctx.cleanup(); } catch (e) {} G.ctx = null; MUSIC.stop(); save();
  $('#restPipo').innerHTML = pipoSVG('sleepy', S.outfit, curProfile().color); $('#restTxt').textContent = L('¡Hora de descansar! Pipo se fue a dormir. Mañana jugamos más.', 'Time to rest! Pipo went to sleep. Let us play more tomorrow.');
  $('#restBtn').textContent = L('Soy adulto: seguir jugando', "I'm a grown-up: keep playing");
  $('#rest').classList.add('on'); VDB.get('descanso').then(b => b ? VDB.play('descanso') : VO.say($('#restTxt').textContent, false));
}
function unlockRest() { parentGate(() => { S.todayMs = 0; GL.set.limit = GL.set.limit; save(); $('#rest').classList.remove('on'); goHome(); }); }
/* ---------- ayuda (manito) y repetición ---------- */
setInterval(() => {
  if (!G.ctx || G.finished || !$('#game').classList.contains('on')) return;
  const idle = Date.now() - lastAct;
  if (idle > 6000 && G.ctx.hint) { const el = G.ctx.hint(); if (el) showHand(el); }
  if (idle > 16000 && idle < 17100) VO.say(VO.last, false);
}, 1000);
let rsT = null;
addEventListener('resize', () => { clearTimeout(rsT); rsT = setTimeout(() => { if ($('#map').classList.contains('on')) renderMap(); if (G.ctx && !G.finished && $('#game').classList.contains('on') && !G.ctx.noRestart) startLevel(G.n, G.spec); }, 450); });
/* =====================================================================
   ARRANQUE
===================================================================== */
fxInit();
document.documentElement.classList.toggle('night', !!GL.set.night);
renderHome();
$('#sndBtn').innerHTML = `<span class="emo">${GL.set.sound || GL.set.music ? '🔊' : '🔇'}</span>`;
$('#stage').addEventListener('pointerdown', e => { markAct(); AU.init(); $('#bubble').classList.add('hide'); ripple(e.clientX, e.clientY); }, true);
document.addEventListener('visibilitychange', () => { if (document.hidden) { MUSIC.stop(); save(); } else if ($('#game').classList.contains('on') || $('#map').classList.contains('on')) MUSIC.start(); });
if (!GL.welcomed && !curProfile().name) setTimeout(() => editProfile(null), 600);
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
window.__test = { solve: () => G.ctx && G.ctx.solve && G.ctx.solve(), level: n => { G.mode = 'main'; show('game'); startLevel(n); }, free: t => startFree(t) };
