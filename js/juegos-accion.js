/* =====================================================================
   PIPO JUEGA · JUEGOS DE ARMAR, APILAR Y ACCIÓN (v3)
===================================================================== */
const mAlive = c => G.ctx === c && !G.finished;
const circSV = (fill, stroke, extra = '') => `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="50" r="46" fill="${fill}" stroke="${stroke}" stroke-width="4"/>${extra}</svg>`;
const coinSV = `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="50" r="44" fill="#ffd23f" stroke="#d19b00" stroke-width="7"/><circle cx="50" cy="50" r="30" fill="none" stroke="#e8b200" stroke-width="3"/><text x="50" y="65" text-anchor="middle" font-size="42" font-weight="800" fill="#b07a00" font-family="Baloo 2,Arial">1</text></svg>`;
function mCounter(c, icon, total) { const el = mk('div', 'card bucket', '', c.stage, 'z-index:6'); const set = n => el.innerHTML = `${mE(icon)} ${n}/${total}`; set(0); return n => { set(n); bump(el); }; }

/* =====================================================================
   ARMAR (3)
===================================================================== */
mPlace('munecodenieve', ['Muñeco de nieve', 'Snowman'], '⛄', 'cielo', c => {
  const P = [{ html: circSV('#fff', '#8cc4e8'), x: .2, y: .55, w: .6, h: .42, say: L('La bola grande', 'The big ball') },
    { html: circSV('#fff', '#8cc4e8', '<circle cx="50" cy="35" r="6" fill="#2b2140"/><circle cx="50" cy="62" r="6" fill="#2b2140"/>'), x: .29, y: .32, w: .42, h: .3, say: L('La bola del medio', 'The middle ball') },
    { html: circSV('#fff', '#8cc4e8', '<circle cx="36" cy="42" r="6" fill="#2b2140"/><circle cx="64" cy="42" r="6" fill="#2b2140"/><path d="M34 66Q50 78 66 66" stroke="#2b2140" stroke-width="5" fill="none" stroke-linecap="round"/>'), x: .35, y: .12, w: .3, h: .23, say: L('La cabeza', 'The head') },
    { html: mE('🎩'), x: .36, y: 0, w: .28, h: .16, say: L('El sombrero', 'The hat') }, { html: mE('🥕'), x: .45, y: .19, w: .13, h: .09, say: L('La nariz de zanahoria', 'The carrot nose') }, { html: mE('🧣'), x: .3, y: .31, w: .4, h: .13, say: L('La bufanda', 'The scarf') }];
  return { say: L('¡Armemos un muñeco de nieve! Lleva cada parte a su lugar', "Let's build a snowman! Put each part in its place"), good: L('¡Hola, muñeco de nieve!', 'Hello, snowman!'), parts: P.slice(0, [3, 4, 5, 6, 6][c.d]),
    board: `<svg viewBox="0 0 100 100" width="100%" height="100%" style="position:absolute;inset:0"><rect width="100" height="100" rx="8" fill="#cfeeff"/><ellipse cx="50" cy="97" rx="50" ry="9" fill="#fff"/>${mRange(0, 14).map(i => `<circle cx="${(i * 37) % 100}" cy="${(i * 53) % 80}" r="1.6" fill="#fff"/>`).join('')}</svg>` };
});
mPlace('ponermesa', ['Poner la mesa', 'Set the table'], '🍽️', 'cocina', c => {
  const P = [{ html: mE('🍽️'), x: .3, y: .3, w: .4, h: .4, say: L('El plato', 'The plate') }, { html: mE('🍴'), x: .1, y: .32, w: .16, h: .34, say: L('El tenedor', 'The fork') }, { html: mE('🥄'), x: .74, y: .32, w: .16, h: .34, say: L('La cuchara', 'The spoon') }, { html: mE('🥛'), x: .72, y: .08, w: .18, h: .2, say: L('El vaso de leche', 'The glass of milk') }, { html: mE('🍰'), x: .1, y: .08, w: .18, h: .2, say: L('¡El postre!', 'Dessert!') }];
  return { say: L('Pongamos la mesa para comer. Lleva cada cosa a su lugar', "Let's set the table. Put everything in its place"), good: L('¡A comer!', "Let's eat!"), parts: P.slice(0, [3, 3, 4, 5, 5][c.d]),
    board: `<svg viewBox="0 0 100 100" width="100%" height="100%" style="position:absolute;inset:0"><rect x="2" y="2" width="96" height="96" rx="10" fill="#ff8c8c"/>${mRange(0, 7).map(i => `<rect x="${4 + i * 12}" y="2" width="6" height="96" fill="#fff" opacity=".35"/>`).join('')}</svg>` };
});
mPlace('carita', ['Arma la carita', 'Build a face'], '😊', 'dulce', c => {
  const P = [{ html: mE('👀'), x: .27, y: .3, w: .46, h: .18, say: L('Los ojos', 'The eyes') }, { html: mE('👃'), x: .42, y: .47, w: .16, h: .16, say: L('La nariz', 'The nose') }, { html: mE('👄'), x: .35, y: .65, w: .3, h: .15, say: L('La boca', 'The mouth') }, { html: mE('👂'), x: .02, y: .4, w: .14, h: .2, style: 'transform:scaleX(-1)', say: L('Una oreja', 'An ear') }, { html: mE('👂'), x: .84, y: .4, w: .14, h: .2, say: L('La otra oreja', 'The other ear') }, { html: mE('🎀'), x: .58, y: .02, w: .26, h: .17, say: L('¡Un moño!', 'A bow!') }];
  return { say: L('Arma la carita: pon los ojos, la nariz y la boca', 'Build the face: eyes, nose and mouth'), good: L('¡Qué carita tan linda!', 'What a cute face!'), parts: P.slice(0, [3, 4, 5, 6, 6][c.d]),
    board: `<svg viewBox="0 0 100 100" width="100%" height="100%" style="position:absolute;inset:0"><circle cx="50" cy="54" r="40" fill="#ffd9b3" stroke="#e0a374" stroke-width="3"/><path d="M12 46Q14 10 50 10Q86 10 88 46Q80 26 50 24Q20 26 12 46Z" fill="#8a5424"/><circle cx="30" cy="64" r="6" fill="#ffaaa0" opacity=".7"/><circle cx="70" cy="64" r="6" fill="#ffaaa0" opacity=".7"/></svg>` };
});

/* =====================================================================
   APILAR (2)
===================================================================== */
const FLAV = [['fresa', 'strawberry', '#ff8fb8'], ['chocolate', 'chocolate', '#8b5a3c'], ['vainilla', 'vanilla', '#fff1c9'], ['menta', 'mint', '#9ff0c8'], ['limón', 'lemon', '#fff07a'], ['mora', 'blackberry', '#b78cff']];
const scoopSV = col => w => `<svg viewBox="0 0 100 70" width="${w * .86}"><path d="M8 50Q4 10 50 8Q96 10 92 50Q84 66 72 58Q62 70 50 60Q38 70 28 58Q16 66 8 50Z" fill="${col}" stroke="#2b2140" stroke-width="3"/><ellipse cx="34" cy="26" rx="10" ry="6" fill="#fff" opacity=".55"/></svg>`;
mStack('heladeria', ['Heladería', 'Ice cream shop'], '🍦', 'dulce', (c, round) => {
  const n = [2, 2, 3, 3, 4][c.d] + (round && c.d > 1 ? 1 : 0), fl = sample(c.r, FLAV, Math.min(6, n + 2)), ord = fl.slice(0, n), layers = {};
  fl.forEach(f => layers[f[0]] = { html: scoopSV(f[2]), n: L(f[0], f[1]), ov: .14 });
  return { say: L(`Prepara el helado del pedido: ${ord.map(f => f[0]).join(', ')}`, `Make the ice cream from the order: ${ord.map(f => f[1]).join(', ')}`), good: L('¡Un helado delicioso!', 'A yummy ice cream!'),
    base: w => `<svg viewBox="0 0 100 110" width="${w * .62}"><path d="M10 6L50 106L90 6Z" fill="#f2b25a" stroke="#a8641b" stroke-width="4" stroke-linejoin="round"/><path d="M22 18L66 70M42 10L78 46M30 40L58 14M24 62L70 26" stroke="#c98a2b" stroke-width="3"/></svg>`,
    layers, order: ord.map(f => f[0]), btns: shuf(c.r, fl.map(f => f[0])) };
});
const BURG = { panb: [['pan', 'bun'], w => `<svg viewBox="0 0 120 30" width="${w}"><path d="M6 4H114Q114 26 92 26H28Q6 26 6 4Z" fill="#f2b25a" stroke="#a8641b" stroke-width="3"/></svg>`],
  carne: [['carne', 'patty'], w => `<svg viewBox="0 0 120 24" width="${w * .98}"><rect x="4" y="3" width="112" height="18" rx="9" fill="#7a4325" stroke="#4a2614" stroke-width="3"/></svg>`],
  queso: [['queso', 'cheese'], w => `<svg viewBox="0 0 120 22" width="${w}"><path d="M2 4H118L108 20L96 8L84 20L72 8L60 20L48 8L36 20L24 8L12 20Z" fill="#ffd23f" stroke="#d19b00" stroke-width="2.5" stroke-linejoin="round"/></svg>`],
  lechuga: [['lechuga', 'lettuce'], w => `<svg viewBox="0 0 120 20" width="${w * 1.02}"><path d="M2 8Q12 0 22 8T42 8T62 8T82 8T102 8T118 8V14Q108 20 98 14T78 14T58 14T38 14T18 14T2 14Z" fill="#6fd86a" stroke="#2f8a35" stroke-width="2.5"/></svg>`],
  tomate: [['tomate', 'tomato'], w => `<svg viewBox="0 0 120 18" width="${w * .92}"><rect x="6" y="3" width="50" height="12" rx="6" fill="#ff4d4d" stroke="#b02a2a" stroke-width="2.5"/><rect x="64" y="3" width="50" height="12" rx="6" fill="#ff4d4d" stroke="#b02a2a" stroke-width="2.5"/></svg>`],
  pant: [['pan de arriba', 'top bun'], w => `<svg viewBox="0 0 120 46" width="${w}"><path d="M6 42Q6 4 60 4Q114 4 114 42Z" fill="#f2b25a" stroke="#a8641b" stroke-width="3"/><ellipse cx="40" cy="18" rx="3" ry="2" fill="#fff"/><ellipse cx="62" cy="13" rx="3" ry="2" fill="#fff"/><ellipse cx="82" cy="20" rx="3" ry="2" fill="#fff"/></svg>`] };
mStack('hamburguesa', ['Hamburguesas', 'Burger stand'], '🍔', 'cocina', c => {
  const mids = sample(c.r, ['carne', 'queso', 'lechuga', 'tomate'], [1, 2, 2, 3, 4][c.d]), ord = ['panb', ...mids, 'pant'], layers = {};
  Object.keys(BURG).forEach(k => layers[k] = { html: BURG[k][1], n: L(BURG[k][0][0], BURG[k][0][1]) });
  const extra = ['carne', 'queso', 'lechuga', 'tomate'].filter(k => !mids.includes(k)).slice(0, 1);
  return { say: L('Prepara la hamburguesa igual que el pedido, de abajo hacia arriba', 'Build the burger like the order, from bottom to top'), good: L('¡Hamburguesa lista!', 'Burger ready!'),
    base: w => `<svg viewBox="0 0 120 14" width="${w * 1.2}"><ellipse cx="60" cy="7" rx="58" ry="6" fill="#fff" stroke="#c9b8ef" stroke-width="2.5"/></svg>`, layers, order: ord, btns: shuf(c.r, [...new Set([...ord, ...extra])]) };
});

/* =====================================================================
   ACCIÓN (15)
===================================================================== */
mReg('atrapafrutas', ['Atrapa la fruta', 'Catch the fruit'], '🧺', 'granja', function (c) {
  c.noRestart = true; const N = [4, 5, 6, 8, 10][c.d], U = unit(c), bs = clamp(U * .22, 74, 160), fs = clamp(U * .11, 42, 84), sp = c.H * (.0036 + c.d * .0008);
  const set = mCounter(c, '🧺', N), layer = mk('div', '', '', c.stage, 'position:absolute;inset:0;z-index:2;touch-action:none');
  const basket = emoEl('🧺', bs, c.stage, `position:absolute;top:${c.H - bs * 1.05}px;left:0;z-index:4;pointer-events:none;transition:none`);
  let bx = c.W / 2, tx = c.W / 2, got = 0, fr = [], last = 0, nextSpawn = 600, raf, prev = performance.now();
  const mv = e => { const r = c.stage.getBoundingClientRect(); tx = clamp(e.clientX - r.left, bs / 2, c.W - bs / 2); markAct(); };
  layer.addEventListener('pointermove', mv); layer.addEventListener('pointerdown', mv);
  function loop(ts) {
    if (G.ctx !== c) return; const dt = Math.min(48, ts - prev); prev = ts;
    bx += (tx - bx) * Math.min(1, dt / 70); basket.style.transform = `translateX(${bx - bs / 2}px)`;
    if (!G.finished && ts - last > nextSpawn && fr.length < 2 + (c.d > 2)) { last = ts; nextSpawn = 900 + c.r() * 900 - c.d * 120; const e = pick(c.r, FRUITS).e, x = fs / 2 + c.r() * (c.W - fs); fr.push({ e, x, y: -fs, el: emoEl(e, fs, c.stage, `position:absolute;left:0;top:0;z-index:3;pointer-events:none`) }); }
    fr = fr.filter(f => {
      f.y += sp * dt; f.el.style.transform = `translate(${f.x - fs / 2}px,${f.y}px) rotate(${f.y * .3}deg)`;
      if (f.y + fs * .8 > c.H - bs * .95 && f.y < c.H - bs * .4 && Math.abs(f.x - bx) < bs * .58) { f.el.remove(); if (!G.finished) { got++; set(got); AU.sfx('coin'); VO.say(numw(got), false); sparkle(c.stage.getBoundingClientRect().left + bx, c.stage.getBoundingClientRect().top + c.H - bs, 6); if (got >= N) { VO.say(L('¡Atrapaste todas las frutas!', 'You caught all the fruit!'), false); setTimeout(c.done, 700); } } return false; }
      if (f.y > c.H) { f.el.remove(); return false; } return true;
    });
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame(loop); c.cleanup = () => cancelAnimationFrame(raf);
  c.say(L('Mueve la canasta con tu dedo y atrapa las frutas que caen', 'Move the basket with your finger and catch the falling fruit'));
  c.hint = () => fr[0] ? fr[0].el : basket; c.solve = () => { got = N; set(N); c.done(); };
});
mReg('topos', ['¿Quién sale?', 'Pop-up friends'], '🕳️', 'jardin', function (c) {
  c.noRestart = true; const nh = [3, 3, 4, 5, 6][c.d], N = [4, 5, 6, 6, 7][c.d], up = [1900, 1700, 1500, 1300, 1100][c.d], cols = nh <= 3 ? 3 : Math.ceil(nh / 2), rows = Math.ceil(nh / cols);
  const hs = Math.min(c.W * .86 / cols, c.H * .66 / rows) * .78, set = mCounter(c, '⭐', N); let got = 0, cur = null, t1, t2;
  const holes = mRange(0, nh - 1).map(i => { const r = Math.floor(i / cols), inRow = Math.min(cols, nh - r * cols), x = c.W / 2 + (i % cols - (inRow - 1) / 2) * hs * 1.25, y = c.H * .2 + (r + .5) * c.H * .66 / rows;
    const h = mk('div', '', `<div style="position:absolute;left:5%;right:5%;bottom:0;height:30%;background:#5a3416;border-radius:50%"></div><div class="tclip" style="position:absolute;left:0;right:0;top:0;bottom:12%;overflow:hidden;border-radius:0 0 40% 40%"><div class="tan" style="position:absolute;left:10%;width:80%;height:80%;bottom:0;transform:translateY(105%);transition:transform .25s"></div></div><div style="position:absolute;left:0;right:0;bottom:-4%;height:22%;background:#8a5424;border-radius:50%;box-shadow:inset 0 6px 0 rgba(0,0,0,.25)"></div>`, c.stage, `position:absolute;left:${x - hs / 2}px;top:${y - hs / 2}px;width:${hs}px;height:${hs}px;z-index:3`);
    h.an = h.querySelector('.tan'); h.addEventListener('pointerdown', () => hit(h)); return h; });
  function pop() { if (!mAlive(c)) return; const free = holes.filter(h => h !== cur); const h = pick(Math.random, free); const k = pick(Math.random, Object.keys(AN)); h.k = k; h.an.innerHTML = animalSVG(k, 'wow'); h.an.style.transform = 'translateY(8%)'; cur = h; AU.sfx('boing'); t1 = setTimeout(() => { if (cur === h) { h.an.style.transform = 'translateY(105%)'; cur = null; } t2 = setTimeout(pop, 350 + Math.random() * 500); }, up); }
  function hit(h) { if (G.finished || h !== cur) return; markAct(); cur = null; clearTimeout(t1); h.an.innerHTML = animalSVG(h.k, 'joy'); AU.animal(h.k); sparkleEl(h, 8); got++; set(got); VO.say(L('¡Te encontré!', 'Found you!'), false); setTimeout(() => h.an.style.transform = 'translateY(105%)', 380);
    if (got >= N) setTimeout(c.done, 700); else t2 = setTimeout(pop, 700); }
  t2 = setTimeout(pop, 1200); c.cleanup = () => { clearTimeout(t1); clearTimeout(t2); };
  c.say(L('¡Toca a los animalitos cuando salgan del hoyo!', 'Tap the animals when they pop out!'));
  c.hint = () => cur; c.solve = () => { got = N; set(N); c.done(); };
});
mReg('escondidas', ['Las escondidas', 'Hide and seek'], '🙈', 'bosque', function (c) {
  const nb = [3, 4, 5, 6, 6][c.d], rounds = 3, dots = mDots(c, rounds), cols = nb <= 3 ? nb : Math.ceil(nb / 2), rows = Math.ceil(nb / cols), bs = Math.min(c.W * .9 / cols, c.H * .7 / rows) * .82;
  let round = 0, target = null, busy = false;
  const bushes = mRange(0, nb - 1).map(i => { const r = Math.floor(i / cols), inRow = Math.min(cols, nb - r * cols), x = c.W / 2 + (i % cols - (inRow - 1) / 2) * bs * 1.18, y = c.H * .14 + (r + .5) * c.H * .72 / rows;
    const b = mk('div', '', `<div class="an" style="position:absolute;left:18%;width:64%;height:64%;top:20%;transition:transform .35s cubic-bezier(.3,1.5,.5,1);transform:translateY(25%)"></div>${bushSV.replace('class="bush"', 'class="bush" ')}`, c.stage, `position:absolute;left:${x - bs / 2}px;top:${y - bs / 2}px;width:${bs}px;height:${bs}px;z-index:3;cursor:pointer`);
    b.an = b.querySelector('.an'); b.addEventListener('pointerdown', () => tap(b)); return b; });
  function next() { dots(round); if (round >= rounds) { c.done(); return; }
    const ks = sample(c.r, Object.keys(AN), Math.min(nb, 2 + c.d)); bushes.forEach(b => { b.k = null; b.an.innerHTML = ''; b.an.style.transform = 'translateY(25%)'; });
    sample(c.r, bushes, ks.length).forEach((b, i) => { b.k = ks[i]; b.an.innerHTML = animalSVG(ks[i], 'happy'); });
    target = ks[0]; const it = ANIMALS.find(a => a.k === target) || { n: target, en: target, a: 'el' }; busy = false; c.say(L(`¿Dónde está ${the(it)}? Busca detrás de los arbustos`, `Where is ${the(it)}? Look behind the bushes`)); }
  function tap(b) { if (G.finished || busy || b.open) return; markAct(); b.open = true; b.an.style.transform = 'translateY(-48%)'; AU.sfx('pop');
    if (b.k === target) { busy = true; b.an.innerHTML = animalSVG(b.k, 'joy'); AU.animal(b.k); sparkleEl(b, 10); VO.say(L('¡Te encontré!', 'Found you!'), false); round++; setTimeout(() => { bushes.forEach(x => x.open = false); next(); }, 1500); }
    else { VO.say(b.k ? L('¡Ese no es! Sigue buscando', 'Not that one! Keep looking') : L('Aquí no hay nadie', 'Nobody here'), false); setTimeout(() => { b.an.style.transform = 'translateY(25%)'; b.open = false; }, 1000); } }
  next();
  c.hint = () => bushes.find(b => b.k === target && !b.open); c.solve = () => { round = rounds; next(); };
});
mReg('cosecha', ['La cosecha', 'Apple harvest'], '🍎', 'granja', function (c) {
  const R = [3, 4, 5, 6, 7][c.d], Gn = [1, 2, 3, 3, 4][c.d], land = c.W > c.H, T = Math.min(land ? c.W * .6 : c.W * .95, c.H * .82), tx = land ? c.W * .08 : (c.W - T) / 2, ty = c.H * .05;
  mk('div', '', `<svg viewBox="0 0 200 200" width="${T}" height="${T}"><rect x="88" y="110" width="24" height="88" rx="6" fill="#8a5424"/><circle cx="100" cy="78" r="70" fill="#4cbb4a"/><circle cx="54" cy="96" r="40" fill="#45b043"/><circle cx="146" cy="96" r="40" fill="#45b043"/><circle cx="100" cy="46" r="44" fill="#56c454"/></svg>`, c.stage, `position:absolute;left:${tx}px;top:${ty}px;z-index:1`);
  const set = mCounter(c, '🍎', R), bk = emoEl('🧺', clamp(unit(c) * .2, 64, 140), c.stage, `position:absolute;right:${land ? 6 : 4}%;bottom:6%;z-index:2`), as = clamp(T * .11, 30, 64); let got = 0;
  const spots = shuf(c.r, mRange(0, 15)).slice(0, R + Gn).map(i => { const a = i / 16 * 6.28 + c.r() * .3, d = .2 + (i % 3) * .1; return [tx + T * (.5 + Math.cos(a) * d * 1.05), ty + T * (.42 + Math.sin(a) * d * .9)]; });
  const apples = spots.map(([x, y], i) => { const red = i < R, el = emoEl(red ? '🍎' : '🍏', as, c.stage, `position:absolute;left:${x - as / 2}px;top:${y - as / 2}px;z-index:3;cursor:pointer;transition:left .6s ease-in,top .6s cubic-bezier(.5,-.6,.7,1),transform .6s`); el.red = red; el.addEventListener('pointerdown', () => tap(el)); return el; });
  function tap(el) { if (G.finished || el.done) return; markAct();
    if (!el.red) { mNo(el, L('Esa todavía está verde. ¡Busca las rojas!', 'That one is still green. Find the red ones!')); return; }
    el.done = true; const sr = c.stage.getBoundingClientRect(), br = bk.getBoundingClientRect(); el.style.left = br.left - sr.left + br.width * .3 + 'px'; el.style.top = br.top - sr.top + 'px'; el.style.transform = 'scale(.6)'; AU.sfx('drop'); got++; set(got); VO.say(numw(got), false); setTimeout(() => el.remove(), 650);
    if (got >= R) { setTimeout(() => VO.say(L('¡Una canasta llena de manzanas!', 'A basket full of apples!'), false), 700); setTimeout(c.done, 1200); } }
  c.say(L(`Recoge las ${numw(R)} manzanas rojas. Las verdes aún no están maduras`, `Pick the ${numw(R)} red apples. The green ones are not ripe yet`));
  c.hint = () => apples.find(a => a.red && !a.done); c.solve = () => apples.filter(a => a.red && !a.done).forEach(tap);
});
mReg('velas', ['Sopla las velitas', 'Blow the candles'], '🎂', 'dulce', function (c) {
  const p = curProfile(), N = p.age && p.age >= 2 && p.age <= 7 && c.d < 3 ? p.age : [3, 4, 5, 6, 7][c.d], W = Math.min(c.W * .8, c.H * .9), cx = (c.W - W) / 2, cy = c.H * .03;
  mk('div', '', `<svg viewBox="0 0 200 130" width="${W}"><ellipse cx="100" cy="122" rx="96" ry="8" fill="#e3d9fb"/><rect x="20" y="62" width="160" height="58" rx="12" fill="#ff9ec8" stroke="#d4407f" stroke-width="4"/><path d="M20 76Q30 92 40 76T60 76T80 76T100 76T120 76T140 76T160 76T180 76" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/><rect x="34" y="40" width="132" height="28" rx="10" fill="#ffe08a" stroke="#d19b00" stroke-width="4"/></svg>`, c.stage, `position:absolute;left:${cx}px;top:${cy + W * .2}px;z-index:1`);
  let off = 0; const cw = W * .66 / N;
  const fl = mRange(0, N - 1).map(i => { const x = cx + W * .17 + (i + .5) * cw, y = cy + W * .2;
    mk('div', '', '', c.stage, `position:absolute;left:${x - W * .018}px;top:${y + W * .06}px;width:${W * .036}px;height:${W * .14}px;background:repeating-linear-gradient(45deg,#fff 0 6px,${PAL[i % 8]} 6px 12px);border-radius:4px;z-index:2`);
    const f = mk('div', '', '', c.stage, `position:absolute;left:${x - W * .04}px;top:${y - W * .03}px;width:${W * .08}px;height:${W * .1}px;z-index:3;cursor:pointer;display:flex;align-items:flex-end;justify-content:center`);
    f.innerHTML = `<div style="width:60%;height:90%;background:radial-gradient(ellipse at 50% 70%,#fff6a8,#ffb400 55%,#ff6a00);border-radius:50% 50% 50% 50%/60% 60% 40% 40%;animation:talk .4s ease-in-out infinite;box-shadow:0 0 18px 6px rgba(255,200,60,.6)"></div>`;
    f.addEventListener('pointerdown', () => blow(f)); return f; });
  function blow(f) { if (G.finished || f.off) return; markAct(); f.off = true; f.innerHTML = mE('💨', W * .05); AU.sfx('whoosh'); off++; VO.say(numw(off), false); setTimeout(() => f.innerHTML = '', 600);
    if (off === N) { const nm0 = p.name; setTimeout(() => { confetti(160); VO.say(L(`¡Feliz cumpleaños${nm0 ? ' ' + nm0 : ''}!`, `Happy birthday${nm0 ? ' ' + nm0 : ''}!`), false); [0, 0, 1, 0, 3, 2, 0, 0, 1, 0, 4, 3].forEach((n, i) => setTimeout(() => G.ctx === c && AU.note(n, .4), 900 + i * 330)); }, 500); setTimeout(c.done, 5200); } }
  c.say(L(`¡Es un cumpleaños! Sopla las ${numw(N)} velitas tocando cada llamita`, `It's a birthday! Blow out the ${numw(N)} candles by tapping each flame`));
  c.hint = () => fl.find(f => !f.off); c.solve = () => { off = N - 1; const f = fl.find(x => !x.off); if (f) { fl.forEach(x => x.off = true); f.off = false; blow(f); } };
});
mReg('acuario', ['El acuario', 'The aquarium'], '🐠', 'mar', function (c) {
  c.noRestart = true; const N = [2, 3, 3, 4, 5][c.d], U = unit(c), fw = clamp(U * .2, 70, 150), top = c.H * .12;
  const water = mk('div', '', '', c.stage, `position:absolute;left:3%;right:3%;top:${top}px;bottom:4%;background:linear-gradient(#8fe0ff,#2b8fd6);border:6px solid #fff;border-radius:26px;box-shadow:0 8px 0 rgba(0,0,0,.12);overflow:hidden;z-index:1;touch-action:none`);
  const Wd = c.W * .94, Hd = c.H - top - c.H * .04, cols = shuf(c.r, COLORS); let fed = 0, food = [], raf;
  mk('div', '', `<svg viewBox="0 0 300 40" width="100%" preserveAspectRatio="none" style="position:absolute;bottom:0;height:16%"><path d="M0 40V20Q40 0 80 18T160 16T240 20T300 14V40Z" fill="#f2d48a"/></svg>${mE('🌿', fw * .5)}`, water, 'position:absolute;inset:0;pointer-events:none');
  const fish = mRange(0, N - 1).map(i => { const el = mk('div', '', fishSVG(cols[i].h, cols[i].d), water, `position:absolute;left:0;top:0;width:${fw}px;pointer-events:none;transition:filter .3s`); return { el, x: c.r() * (Wd - fw), y: Hd * .1 + c.r() * Hd * .6, vx: (c.r() < .5 ? -1 : 1) * (.5 + c.r() * .5), fed: false, t: null }; });
  water.addEventListener('pointerdown', e => { if (G.finished) return; markAct(); const r = water.getBoundingClientRect(), x = e.clientX - r.left, y = Math.min(e.clientY - r.top, Hd * .7);
    const f = { x, y, el: mk('div', '', '', water, `position:absolute;left:0;top:0;width:12px;height:12px;border-radius:50%;background:#a8641b;box-shadow:8px 4px 0 #c98a2b,-6px 6px 0 #8a5424;pointer-events:none`) }; food.push(f); AU.sfx('drop');
    const hungry = fish.filter(h => !h.fed && !h.t).sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y))[0]; if (hungry) hungry.t = f; });
  function loop() { if (G.ctx !== c) return;
    food.forEach(f => { f.y = Math.min(Hd * .82, f.y + .5); f.el.style.transform = `translate(${f.x}px,${f.y}px)`; });
    fish.forEach(h => {
      if (h.t) { const dx = h.t.x - (h.x + fw / 2), dy = h.t.y - (h.y + fw * .3), d = Math.hypot(dx, dy); h.vx = dx / (d || 1) * 3.2; h.x += h.vx; h.y += dy / (d || 1) * 3.2;
        if (d < 14) { h.t.el.remove(); food = food.filter(f => f !== h.t); h.t = null; if (!h.fed) { h.fed = true; fed++; AU.sfx('chomp'); const sr = water.getBoundingClientRect(); sparkle(sr.left + h.x + fw / 2, sr.top + h.y, 8, ['💖', '✨']); h.el.style.filter = 'drop-shadow(0 0 10px #fff)'; VO.say(L('¡Ñam!', 'Yum!'), false); if (fed === N && !G.finished) { setTimeout(() => VO.say(L('¡Todos los peces comieron!', 'All the fish have eaten!'), false), 500); setTimeout(c.done, 1100); } }
          const nf = food.find(f => !fish.some(o => o.t === f)); if (nf) { const o = fish.find(o2 => !o2.fed && !o2.t); if (o) o.t = nf; } } }
      else { h.x += h.vx; if (h.x < 0 || h.x > Wd - fw) h.vx *= -1; h.y += Math.sin(performance.now() / 700 + h.x * .01) * .3; }
      h.x = clamp(h.x, 0, Wd - fw); h.y = clamp(h.y, 0, Hd - fw * .6);
      h.el.style.transform = `translate(${h.x}px,${h.y}px) scaleX(${h.vx > 0 ? -1 : 1})`;
    });
    raf = requestAnimationFrame(loop); }
  raf = requestAnimationFrame(loop); c.cleanup = () => cancelAnimationFrame(raf);
  c.say(L('Los peces tienen hambre. Toca el agua para darles comida', 'The fish are hungry. Tap the water to feed them'));
  c.hint = () => water; c.solve = () => { fish.forEach(h => h.fed = true); fed = N; c.done(); };
});
mReg('goles', ['¡Gol!', 'Goal!'], '⚽', 'jardin', function (c) {
  c.noRestart = true; const N = [2, 3, 3, 4, 5][c.d], gw = Math.min(c.W * .78, c.H * 1.3), gh = gw * .42, gx = (c.W - gw) / 2, gy = c.H * .1, kw = gw * [.2, .22, .24, .26, .28][c.d], spd = [.0011, .0014, .0017, .002, .0024][c.d];
  const set = mCounter(c, '⚽', N), goal = mk('div', '', `<svg viewBox="0 0 300 126" width="100%" height="100%" preserveAspectRatio="none"><defs><pattern id="net" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M0 0L12 12M12 0L0 12" stroke="#fff" stroke-width="1.2" opacity=".7"/></pattern></defs><rect x="6" y="6" width="288" height="120" fill="url(#net)"/><path d="M6 126V6H294V126" fill="none" stroke="#fff" stroke-width="10"/></svg>`, c.stage, `position:absolute;left:${gx}px;top:${gy}px;width:${gw}px;height:${gh}px;z-index:2;cursor:crosshair`);
  const keeper = mk('div', '', mA('oso', 'happy', 100), c.stage, `position:absolute;top:${gy + gh - kw * 1.05}px;left:0;width:${kw}px;height:${kw}px;z-index:3;pointer-events:none`);
  const bs = clamp(unit(c) * .12, 44, 90), ball = emoEl('⚽', bs, c.stage, `position:absolute;left:${c.W / 2 - bs / 2}px;top:${c.H * .78}px;z-index:4;transition:left .5s ease-out,top .5s ease-out,transform .5s;pointer-events:none`);
  let got = 0, shooting = false, kx = gw / 2, raf;
  function loop(ts) { if (G.ctx !== c) return; kx = gw / 2 + Math.sin(ts * spd) * (gw / 2 - kw / 2); keeper.style.transform = `translateX(${gx + kx - kw / 2}px)`; raf = requestAnimationFrame(loop); }
  raf = requestAnimationFrame(loop); c.cleanup = () => cancelAnimationFrame(raf);
  goal.addEventListener('pointerdown', e => { if (G.finished || shooting) return; markAct(); const r = goal.getBoundingClientRect(), x = e.clientX - r.left; shoot(x); });
  function shoot(x) { shooting = true; AU.sfx('boing'); ball.style.left = gx + x - bs / 2 + 'px'; ball.style.top = gy + gh * .5 + 'px'; ball.style.transform = 'scale(.7) rotate(360deg)';
    setTimeout(() => { if (G.ctx !== c) return; const saved = Math.abs(x - kx) < kw * .45;
      if (saved) { AU.sfx('no'); keeper.innerHTML = mA('oso', 'joy', 100); VO.say(L('¡Atajó! Intenta por el otro lado', 'Saved! Try the other side'), false); }
      else { got++; set(got); AU.sfx('win'); confetti(40); VO.say(L('¡Goooool!', 'Goooal!'), false); }
      setTimeout(() => { keeper.innerHTML = mA('oso', 'happy', 100); ball.style.transition = 'none'; ball.style.left = c.W / 2 - bs / 2 + 'px'; ball.style.top = c.H * .78 + 'px'; ball.style.transform = ''; void ball.offsetWidth; ball.style.transition = 'left .5s ease-out,top .5s ease-out,transform .5s'; shooting = false; if (got >= N && !G.finished) c.done(); }, 1000); }, 520); }
  c.say(L('Toca el arco donde quieres patear. ¡Que no la ataje el oso!', "Tap the goal where you want to kick. Don't let the bear catch it!"));
  c.hint = () => goal; c.solve = () => { got = N; set(N); c.done(); };
});
mReg('tiendita', ['La tiendita', 'The little shop'], '🏪', 'ciudad', function (c) {
  const rounds = 2, dots = mDots(c, rounds), U = unit(c), cs = clamp(U * .13, 46, 90); let round = 0, price = 0, paid = 0, coins = [], prod = null;
  const shelf = mk('div', 'card', '', c.stage, `position:absolute;left:6%;top:12%;width:${clamp(U * .42, 150, 300)}px;height:${clamp(U * .42, 150, 300)}px;flex-direction:column;z-index:2`);
  const tray = mk('div', 'card', '', c.stage, `position:absolute;right:6%;top:12%;width:${clamp(U * .42, 150, 300)}px;height:${clamp(U * .42, 150, 300)}px;flex-direction:column;background:#fff8d6;border:4px dashed #d19b00;z-index:2`);
  function next() { dots(round); if (round >= rounds) { c.done(); return; }
    price = 1 + Math.floor(c.r() * [3, 4, 5, 7, 9][c.d]) + (c.d > 1 ? 1 : 0); paid = 0; prod = pick(c.r, ['🧸', '🍦', '🎈', '🍎', '🚗', '📕', '🍪', '🦖']);
    shelf.innerHTML = `${mE(prod, U * .2)}<div style="background:#ff6fa8;color:#fff;border-radius:999px;padding:2px 14px;font-weight:800;font-size:${U * .06}px;display:flex;align-items:center;gap:6px"><span style="width:${U * .06}px;height:${U * .06}px;display:inline-block">${coinSV}</span> ${price}</div>`;
    tray.innerHTML = `<b style="font-size:${clamp(U * .045, 14, 24)}px">${L('Paga aquí', 'Pay here')}</b><div class="got" style="display:flex;flex-wrap:wrap;justify-content:center;gap:4px;padding:6px"></div><b class="cnt" style="font-size:${U * .07}px;color:#b07a00">0</b>`;
    coins.forEach(x => x.remove()); const n = price + 2, per = Math.ceil(n / 2);
    coins = mRange(0, n - 1).map(i => { const el = mk('div', '', coinSV, c.stage, `position:absolute;left:${c.W / 2 - (per / 2) * cs * 1.15 + (i % per) * cs * 1.15}px;top:${c.H * .66 + Math.floor(i / per) * cs * 1.15}px;width:${cs}px;height:${cs}px;z-index:4;cursor:grab`); draggable(el, { targets: () => [tray], onDrop: (t, e) => pay(e) }); return el; });
    c.say(L(`Esto cuesta ${numw(price)} ${price === 1 ? 'moneda' : 'monedas'}. Arrastra las monedas para pagar`, `This costs ${numw(price)} ${price === 1 ? 'coin' : 'coins'}. Drag the coins to pay`)); }
  function pay(e) { if (paid >= price) return false; e._locked = true; e.remove(); paid++; tray.querySelector('.got').insertAdjacentHTML('beforeend', `<span style="width:${cs * .5}px;height:${cs * .5}px;display:inline-block">${coinSV}</span>`); tray.querySelector('.cnt').textContent = paid; AU.sfx('coin'); VO.say(numw(paid), false);
    if (paid === price) { AU.sfx('magic'); sparkleEl(shelf, 12); setTimeout(() => VO.say(L('¡Justo! ¡Gracias por tu compra!', 'Exactly right! Thanks for shopping!'), false), 400); round++; setTimeout(next, 1700); } return true; }
  next();
  c.hint = () => paid < price ? coins.find(x => !x._locked) : null; c.solve = () => { round = rounds; next(); };
});
mReg('bus', ['El bus', 'The bus'], '🚌', 'ciudad', function (c) {
  const N = [2, 3, 4, 5, 6][c.d], ks = sample(c.r, Object.keys(AN), N + 2), land = c.W > c.H, bw = Math.min(c.W * (land ? .55 : .92), c.H * .9), bh = bw * .5, bx = land ? c.W * .42 : (c.W - bw) / 2, by = land ? c.H * .5 - bh / 2 : c.H * .52;
  const bus = mk('div', '', `<svg viewBox="0 0 300 150" width="100%" height="100%"><rect x="6" y="10" width="288" height="110" rx="22" fill="#ffd23f" stroke="#d19b00" stroke-width="5"/><rect x="6" y="88" width="288" height="12" fill="#ff9a3c"/><circle cx="70" cy="124" r="20" fill="#2b2140"/><circle cx="230" cy="124" r="20" fill="#2b2140"/><circle cx="70" cy="124" r="8" fill="#ccc"/><circle cx="230" cy="124" r="8" fill="#ccc"/><rect x="270" y="30" width="18" height="50" rx="4" fill="#bfeaff"/></svg>`, c.stage, `position:absolute;left:${bx}px;top:${by}px;width:${bw}px;height:${bh}px;z-index:1;transition:transform 2s ease-in`);
  const ww = bw * .84 / N, wins = mRange(0, N - 1).map(i => mk('div', '', '', bus, `position:absolute;left:${bw * .05 + i * ww}px;top:${bh * .16}px;width:${ww * .86}px;height:${bh * .4}px;background:#bfeaff;border-radius:10px;overflow:hidden;display:flex;align-items:flex-end;justify-content:center`));
  const as = clamp(Math.min(land ? c.W * .36 / Math.ceil((N + 2) / 2) : c.W * .9 / (N + 2), c.H * .2), 50, 120); let got = 0;
  const pax = ks.map((k, i) => { const per = land ? Math.ceil((N + 2) / 2) : N + 2, x = land ? c.W * .04 + (i % per) * as * 1.08 : c.W * .05 + i * as * 1.02, y = land ? c.H * .3 + Math.floor(i / per) * as * 1.15 : c.H * .2;
    const el = mk('div', 'artbox', animalSVG(k, 'happy'), c.stage, `position:absolute;left:${x}px;top:${y}px;width:${as}px;height:${as}px;z-index:3;cursor:pointer;transition:left .6s ease-in-out,top .6s cubic-bezier(.4,-.5,.6,1),width .6s,height .6s`); el.k = k; el.addEventListener('pointerdown', () => board(el)); return el; });
  function board(el) { if (G.finished || el.on || got >= N) return; markAct(); el.on = true; const w = wins[got], sr = c.stage.getBoundingClientRect(), r = w.getBoundingClientRect(), s = r.height * 1.05;
    el.style.left = r.left - sr.left + (r.width - s) / 2 + 'px'; el.style.top = r.top - sr.top + 'px'; el.style.width = el.style.height = s + 'px'; AU.animal(el.k); got++; VO.say(numw(got), false);
    setTimeout(() => { el.remove(); w.innerHTML = `<span class="art" style="width:95%;height:105%">${animalSVG(el.k, 'joy')}</span>`; }, 620);
    if (got === N) setTimeout(() => { AU.sfx('horn'); VO.say(L('¡Todos a bordo! ¡Chau!', 'All aboard! Bye!'), false); bus.style.transform = `translateX(${c.W * 1.2}px)`; setTimeout(c.done, 1700); }, 900); }
  c.say(L(`En el bus caben ${numw(N)} animalitos. ¡Súbelos uno por uno!`, `${cap(numw(N))} animals fit on the bus. Get them on one by one!`));
  c.hint = () => got < N ? pax.find(p => !p.on) : null; c.solve = () => { while (got < N) board(pax.find(p => !p.on)); };
});
mReg('pizarra', ['Pizarra mágica', 'Magic board'], '🖌️', 'aula', function (c) {
  c.noRestart = true; const W = c.W, H = c.H, cs = ['rainbow', ...COLORS.slice(0, 7).map(x => x.h)]; let col = 'rainbow', hue = 0, on = false, lp = null, strokes = 0, len = 0;
  const cv = mk('canvas', '', null, c.stage, `position:absolute;left:3%;top:4%;width:${W * .94}px;height:${H * .76}px;background:#fff;border-radius:22px;box-shadow:0 7px 0 rgba(0,0,0,.12);touch-action:none;z-index:2`); cv.width = W * .94; cv.height = H * .76; const x = cv.getContext('2d'); x.lineCap = x.lineJoin = 'round'; x.lineWidth = clamp(unit(c) * .035, 10, 26);
  const bar = mk('div', '', '', c.stage, 'position:absolute;left:2%;right:2%;bottom:2%;height:15%;display:flex;justify-content:center;align-items:center;gap:1.5%;z-index:3');
  const bs = clamp(Math.min(H * .12, W * .9 / 9.5), 34, 72);
  const btns = cs.map(h => { const b = mk('div', 'choice', '', bar, `width:${bs}px;height:${bs}px;border-radius:50%;background:${h === 'rainbow' ? 'conic-gradient(red,orange,yellow,lime,cyan,blue,violet,red)' : h};box-shadow:0 4px 0 rgba(0,0,0,.2);${h === col ? 'outline:5px solid #2b2140' : ''}`); b.h = h; b.addEventListener('pointerdown', () => { col = h; btns.forEach(o => o.style.outline = o === b ? '5px solid #2b2140' : ''); AU.sfx('tap'); }); return b; });
  const ok = mk('button', 'pill', `✔ ${L('¡Listo!', 'Done!')}`, bar, 'display:none;font-size:20px;background:#4cd964;color:#fff;box-shadow:0 5px 0 #21963a'); ok.addEventListener('pointerdown', finish);
  const pos = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  const st = (px, py) => { hue = (hue + 5) % 360; x.strokeStyle = col === 'rainbow' ? `hsl(${hue},90%,58%)` : col; x.beginPath(); x.moveTo(...(lp || [px + .1, py])); x.lineTo(px, py); x.stroke(); if (lp) len += Math.hypot(px - lp[0], py - lp[1]); lp = [px, py]; };
  cv.addEventListener('pointerdown', e => { on = true; lp = null; try { cv.setPointerCapture(e.pointerId); } catch (er) {} st(...pos(e)); markAct(); });
  cv.addEventListener('pointermove', e => { if (on) { st(...pos(e)); markAct(); } });
  const up = () => { if (!on) return; on = false; lp = null; strokes++; if (strokes >= 2 || len > 600) ok.style.display = ''; if (len > Math.max(W, H) * 5 && strokes >= 4) finish(); };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  function finish() { if (G.finished) return; AU.sfx('magic'); sparkleEl(cv, 16); VO.say(L('¡Qué lindo dibujo! ¡Eres una artista!', 'What a lovely drawing! You are an artist!'), false); setTimeout(c.done, 900); }
  c.say(L('¡Dibuja lo que quieras con tu dedito! Elige un color abajo', 'Draw anything you like with your finger! Pick a color below'));
  c.hint = () => strokes >= 2 ? ok : cv; c.solve = finish;
});
mReg('mariposa', ['Mariposa espejo', 'Mirror butterfly'], '🦋', 'jardin', function (c) {
  const n = [2, 3, 3, 4, 5][c.d], SP = [[62, 46, 13], [44, 72, 11], [74, 100, 10], [40, 112, 9], [58, 128, 8]].slice(0, n), cols = SP.map(() => pick(c.r, COLORS.slice(0, 7))), pal = shuf(c.r, [...new Set([...cols, ...sample(c.r, COLORS.slice(0, 7), 2)])]);
  const S = Math.min(c.W * .8, c.H * .66); let sel = null, done = 0;
  const wrap = mk('div', '', `<svg viewBox="0 0 200 170" width="${S * 1.18}" height="${S}"><path d="M98 80C70 10 10 4 14 50C16 86 60 92 98 84ZM102 80C130 10 190 4 186 50C184 86 140 92 102 84Z" fill="#fff" stroke="#2b2140" stroke-width="4"/><path d="M98 88C70 100 40 140 62 152C84 160 96 120 98 92ZM102 88C130 100 160 140 138 152C116 160 104 120 102 92Z" fill="#fff" stroke="#2b2140" stroke-width="4"/><rect x="94" y="40" width="12" height="110" rx="6" fill="#2b2140"/><path d="M96 44Q86 18 76 14M104 44Q114 18 124 14" stroke="#2b2140" stroke-width="3" fill="none"/><line x1="100" y1="6" x2="100" y2="166" stroke="#ff6fa8" stroke-width="2" stroke-dasharray="5 5"/>${SP.map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${cols[i].h}" stroke="${cols[i].d}" stroke-width="2.5"/><circle data-i="${i}" cx="${200 - x}" cy="${y}" r="${r + 1}" fill="#f4f1fb" stroke="#a66bff" stroke-width="2.5" stroke-dasharray="4 3" style="cursor:pointer"/>`).join('')}</svg>`, c.stage, `position:absolute;left:50%;top:5%;transform:translateX(-50%);z-index:2`);
  const spots = [...wrap.querySelectorAll('[data-i]')]; spots.forEach(s => s.addEventListener('pointerdown', () => paint(s)));
  const bar = mk('div', '', '', c.stage, 'position:absolute;left:2%;right:2%;bottom:3%;height:20%;display:flex;justify-content:center;align-items:center;gap:2%;z-index:3'), bs = clamp(Math.min(c.H * .16, c.W * .9 / (pal.length + 1)), 44, 100);
  const pbs = pal.map(col => { const b = mk('div', 'choice', blobSV(col, '100%'), bar, `width:${bs}px;height:${bs}px;border-radius:50%`); b.col = col; b.addEventListener('pointerdown', () => { sel = col; pbs.forEach(o => o.style.outline = o === b ? '5px solid #2b2140' : ''); AU.sfx('tap'); markAct(); }); return b; });
  function paint(s) { if (G.finished || s.done) return; markAct(); const i = +s.dataset.i;
    if (!sel) { VO.say(L('Primero elige un color abajo', 'First pick a color below'), false); bump(bar, 'shake'); return; }
    if (sel !== cols[i]) { AU.sfx('no'); VO.say(L(`Mira el otro lado: ese es ${colorName(cols[i])}`, `Look at the other side: that one is ${colorName(cols[i])}`), false); return; }
    s.done = true; s.setAttribute('fill', sel.h); s.setAttribute('stroke', sel.d); s.removeAttribute('stroke-dasharray'); AU.sfx('ok'); done++;
    if (done === n) { setTimeout(() => { AU.sfx('magic'); VO.say(L('¡Las dos alas son iguales! ¡Qué hermosa!', 'Both wings match! How beautiful!'), false); wrap.style.transition = 'transform 1.2s'; wrap.style.transform = 'translateX(-50%) translateY(-6%) rotate(-4deg)'; }, 300); setTimeout(c.done, 1500); } }
  c.say(L('Pinta las manchitas del ala derecha igual que las del ala izquierda', 'Paint the spots on the right wing like the left wing'));
  c.hint = () => { const s = spots.find(x => !x.done); if (!s) return null; const need = cols[+s.dataset.i]; return sel === need ? s : pbs.find(b => b.col === need); };
  c.solve = () => spots.forEach(s => { if (!s.done) { sel = cols[+s.dataset.i]; paint(s); } });
});
mReg('banda', ['Banda musical', 'Music band'], '🥁', 'noche', function (c) {
  c.noRestart = true; const ins = sample(c.r, INST, [3, 3, 4, 4, 4][c.d]), rounds = 2, dots = mDots(c, rounds), sz = clamp(Math.min(c.W * .9 / ins.length * .82, c.H * .42), 80, 200);
  let round = 0, seq = [], pos = 0, listen = false, tm = [];
  const row = mk('div', '', '', c.stage, 'position:absolute;left:2%;right:2%;top:20%;bottom:22%;display:flex;justify-content:center;align-items:center;gap:3%');
  const cards = ins.map((x, i) => { const b = mk('div', 'card choice farmcard', mE(x.e), row, `width:${sz}px;height:${sz}px;font-size:${sz * .6}px;background:${['#ffd6e8', '#d6ecff', '#fff3b0', '#d7f5d0'][i]}`); b.x = x; b.addEventListener('pointerdown', () => tap(b)); return b; });
  const light = b => { b.classList.add('lit'); b.x.s(); setTimeout(() => b.classList.remove('lit'), 520); };
  function play() { listen = false; pos = 0; c.say(L('Escucha la banda y repite', 'Listen to the band and repeat')); tm.forEach(clearTimeout); tm = seq.map((b, i) => setTimeout(() => G.ctx === c && light(b), 1700 + i * 950)); tm.push(setTimeout(() => { if (G.ctx === c) { listen = true; VO.say(L('¡Ahora tú!', 'Your turn!'), false); } }, 1700 + seq.length * 950)); }
  function next() { dots(round); if (round >= rounds) { c.done(); return; } seq = mRange(1, [2, 3, 3, 4, 5][c.d] + round).map(() => pick(c.r, cards)); play(); }
  function tap(b) { if (G.finished) return; markAct(); light(b); if (!listen) return;
    if (b === seq[pos]) { pos++; if (pos === seq.length) { listen = false; AU.sfx('ok'); sparkleEl(row, 10); VO.say(L('¡Qué buena banda!', 'What a great band!'), false); round++; setTimeout(next, 1500); } }
    else { listen = false; AU.sfx('no'); VO.say(L('Casi. Escucha otra vez', 'Almost. Listen again'), false); setTimeout(play, 900); } }
  c.cleanup = () => tm.forEach(clearTimeout); setTimeout(next, 100);
  c.hint = () => listen ? seq[pos] : null; c.solve = () => { round = rounds; listen = false; next(); };
});
const PNR = [{ p: 'M40 92H160V170H40Z', n: 1, t: [62, 160] }, { p: 'M28 94L100 34L172 94Z', n: 2, t: [100, 76] }, { p: 'M88 122H112V170H88Z', n: 3, t: [100, 152] }, { p: 'M0 170H200V200H0Z', n: 4, t: [180, 190] }, { p: 'M52 106H76V130H52Z', n: 2, t: [64, 123] }, { p: 'M124 106H148V130H124Z', n: 2, t: [136, 123] }, { p: 'M150 8A18 18 0 1 0 150.1 8Z', n: 3, t: [150, 33] }];
mReg('pintanumeros', ['Pinta por números', 'Paint by numbers'], '🖍️', 'dulce', function (c) {
  const regs = PNR.slice(0, [4, 5, 6, 7, 7][c.d]), cmap = { 1: COLORS[0], 2: COLORS[1], 3: COLORS[2], 4: COLORS[3] }, S = Math.min(c.W * (c.W > c.H ? .55 : .9), c.H * .7); let sel = 0, done = 0;
  const wrap = mk('div', 'card', `<svg viewBox="0 0 200 200" width="${S * .94}" height="${S * .94}">${regs.map((r, i) => `<path data-i="${i}" d="${r.p}" fill="#fff" stroke="#2b2140" stroke-width="3" stroke-linejoin="round" style="cursor:pointer"/>`).join('')}${regs.map((r, i) => `<text data-t="${i}" x="${r.t[0]}" y="${r.t[1]}" text-anchor="middle" font-size="15" font-weight="800" fill="#2b2140" font-family="Baloo 2,Arial" pointer-events="none">${r.n}</text>`).join('')}</svg>`, c.stage, `position:absolute;left:${c.W > c.H ? '6%' : (c.W - S) / 2 + 'px'};top:5%;width:${S}px;height:${S}px;z-index:2`);
  const ps = [...wrap.querySelectorAll('[data-i]')]; ps.forEach(p => p.addEventListener('pointerdown', () => paint(p)));
  const nums = [...new Set(regs.map(r => r.n))].sort(), land = c.W > c.H, bar = mk('div', '', '', c.stage, land ? 'position:absolute;right:4%;top:8%;bottom:16%;width:22%;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:3%;z-index:3' : 'position:absolute;left:2%;right:2%;bottom:14%;height:16%;display:flex;justify-content:center;align-items:center;gap:3%;z-index:3'), bs = clamp(Math.min(c.H * .17, c.W * .2), 50, 110);
  const pbs = nums.map(n => { const b = mk('div', 'choice', `<div style="position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center">${blobSV(cmap[n], '100%')}<b style="position:absolute;font-size:${bs * .4}px;color:#fff;text-shadow:0 2px 0 rgba(0,0,0,.4)">${n}</b></div>`, bar, `width:${bs}px;height:${bs}px`); b.n = n; b.addEventListener('pointerdown', () => { sel = n; pbs.forEach(o => o.style.outline = o === b ? '5px solid #2b2140' : ''); o2(); }); return b; });
  function o2() { AU.sfx('tap'); markAct(); VO.say(L(`El ${numw(sel)} es ${colorName(cmap[sel])}`, `${cap(numw(sel))} is ${colorName(cmap[sel])}`), false); }
  function paint(p) { if (G.finished || p.done) return; markAct(); const r = regs[+p.dataset.i];
    if (!sel) { VO.say(L('Elige un color con número', 'Pick a numbered color'), false); bump(bar, 'shake'); return; }
    if (r.n !== sel) { AU.sfx('no'); VO.say(L(`Ese espacio tiene el número ${numw(r.n)}`, `That space has number ${numw(r.n)}`), false); return; }
    p.done = true; p.setAttribute('fill', cmap[sel].h); wrap.querySelector(`[data-t="${p.dataset.i}"]`).setAttribute('opacity', '0'); AU.sfx('ok'); done++;
    if (done === regs.length) { setTimeout(() => { AU.sfx('magic'); sparkleEl(wrap, 14); VO.say(L('¡Una casita preciosa!', 'A beautiful little house!'), false); }, 300); setTimeout(c.done, 1300); } }
  c.say(L('Pinta cada espacio con el color de su número', 'Paint each space with the color of its number'));
  c.hint = () => { const p = ps.find(x => !x.done); if (!p) return null; const n = regs[+p.dataset.i].n; return sel === n ? p : pbs.find(b => b.n === n); };
  c.solve = () => ps.forEach(p => { if (!p.done) { sel = regs[+p.dataset.i].n; paint(p); } });
});
mReg('cruzar', ['Cruzar la calle', 'Crossing the street'], '🚸', 'ciudad', function (c) {
  c.noRestart = true; const rounds = 2, dots = mDots(c, rounds), sy = c.H * .34, sh = c.H * .34, ps = clamp(unit(c) * .2, 70, 150), tl = clamp(unit(c) * .2, 70, 150); let round = 0, green = false, walking = false, side = 0, t1, cars = [];
  mk('div', '', '', c.stage, `position:absolute;left:0;right:0;top:${sy}px;height:${sh}px;background:#5b606b;z-index:1`);
  mk('div', '', '', c.stage, `position:absolute;left:30%;width:22%;top:${sy}px;height:${sh}px;background:repeating-linear-gradient(90deg,#fff 0 18%,transparent 18% 32%);opacity:.9;z-index:1`);
  const light = mk('div', 'card', '', c.stage, `position:absolute;right:4%;top:${c.H * .06}px;width:${tl * .8}px;height:${tl * 1.1}px;background:#2b2140;flex-direction:column;gap:2px;z-index:3;font-size:${tl * .42}px`);
  const chick = mk('div', '', pipoSVG('happy', S.outfit, curProfile().color), c.stage, `position:absolute;left:${c.W * .41 - ps / 2}px;top:${sy + sh + c.H * .02}px;width:${ps}px;height:${ps}px;z-index:4;cursor:pointer;transition:top 2.2s linear`);
  chick.addEventListener('pointerdown', go);
  function setL(g) { green = g; light.innerHTML = `<div style="opacity:${g ? .2 : 1};filter:${g ? 'grayscale(1)' : 'none'}">🧍</div><div style="opacity:${g ? 1 : .2};filter:${g ? 'none' : 'grayscale(1)'}">🚶</div>`; light.style.boxShadow = g ? '0 0 0 6px #2ee06b' : '0 0 0 6px #ff3b3b';
    if (g) VO.say(L('¡Verde! Mira a los lados y cruza', 'Green! Look both ways and cross'), false); }
  function cycle() { if (G.ctx !== c) return; if (!walking) setL(!green); if (!green) spawnCar(); t1 = setTimeout(cycle, green ? 3600 : 2800); }
  function spawnCar() { const e = pick(Math.random, ['🚗', '🚕', '🚙', '🚌']), y = sy + sh * (.15 + Math.random() * .4), el = emoEl(e, sh * .4, c.stage, `position:absolute;left:${c.W}px;top:${y}px;z-index:2;transition:left 2.4s linear;transform:scaleX(-1)`); requestAnimationFrame(() => requestAnimationFrame(() => el.style.left = -sh + 'px')); setTimeout(() => el.remove(), 2600); }
  function go() { if (G.finished || walking) return; markAct();
    if (!green) { AU.sfx('horn'); bump(chick, 'shake'); VO.say(L('¡Alto! Espera la luz verde', 'Stop! Wait for the green light'), false); return; }
    walking = true; AU.sfx('ok'); side = 1 - side; chick.style.top = (side ? c.H * .05 : sy + sh + c.H * .02) + 'px';
    setTimeout(() => { if (G.ctx !== c) return; walking = false; round++; dots(round); sparkleEl(chick, 10); VO.say(L('¡Cruzaste con cuidado! ¡Muy bien!', 'You crossed safely! Well done!'), false); if (round >= rounds) setTimeout(c.done, 800); else { setL(false); clearTimeout(t1); t1 = setTimeout(cycle, 2600); spawnCar(); } }, 2300); }
  dots(0); setL(false); spawnCar(); t1 = setTimeout(cycle, 2800); c.cleanup = () => clearTimeout(t1);
  c.say(L('Ayuda a Pipo a cruzar. Solo se cruza con la luz verde', 'Help Pipo cross. We only cross on green'));
  c.hint = () => green && !walking ? chick : light; c.solve = () => { round = rounds; c.done(); };
});
mReg('luciernagas', ['Luciérnagas', 'Fireflies'], '✨', 'noche', function (c) {
  c.noRestart = true; const N = [4, 5, 6, 7, 8][c.d], sp = [.6, .8, 1, 1.2, 1.4][c.d], fs = clamp(unit(c) * .12, 44, 80), js = clamp(unit(c) * .26, 90, 180); let got = 0, raf;
  const jar = mk('div', '', `<svg viewBox="0 0 100 120" width="100%"><rect x="26" y="4" width="48" height="14" rx="4" fill="#c9822b"/><path d="M22 18H78Q92 30 92 50V104Q92 116 78 116H22Q8 116 8 104V50Q8 30 22 18Z" fill="rgba(200,240,255,.35)" stroke="#fff" stroke-width="4"/><path d="M20 40V96" stroke="#fff" stroke-width="5" opacity=".6"/></svg>`, c.stage, `position:absolute;left:${c.W / 2 - js / 2}px;bottom:3%;width:${js}px;z-index:2;transition:filter .4s`);
  const set = mCounter(c, '✨', N), Wd = c.W - fs, Hd = c.H * .62;
  const fl = mRange(0, N - 1).map(() => { const el = mk('div', '', `<div style="width:56%;height:56%;border-radius:50%;background:radial-gradient(circle,#fffbe0,#ffe14d 45%,rgba(255,225,77,0) 72%);box-shadow:0 0 22px 10px rgba(255,230,90,.55);animation:breathe 1s infinite"></div>`, c.stage, `position:absolute;left:0;top:0;width:${fs}px;height:${fs}px;display:flex;align-items:center;justify-content:center;z-index:3;cursor:pointer`); const f = { el, x: c.r() * Wd, y: c.H * .06 + c.r() * Hd, a: c.r() * 6.28 }; el.addEventListener('pointerdown', () => catchF(f)); return f; });
  function loop(ts) { if (G.ctx !== c) return; fl.forEach(f => { if (f.got) return; f.a += (Math.random() - .5) * .3; f.x += Math.cos(f.a) * sp; f.y += Math.sin(f.a) * sp; if (f.x < 0 || f.x > Wd) f.a = Math.PI - f.a; if (f.y < c.H * .05 || f.y > c.H * .05 + Hd) f.a = -f.a; f.x = clamp(f.x, 0, Wd); f.y = clamp(f.y, c.H * .05, c.H * .05 + Hd); f.el.style.transform = `translate(${f.x}px,${f.y}px)`; }); raf = requestAnimationFrame(loop); }
  raf = requestAnimationFrame(loop); c.cleanup = () => cancelAnimationFrame(raf);
  function catchF(f) { if (G.finished || f.got) return; markAct(); f.got = true; const sr = c.stage.getBoundingClientRect(), jr = jar.getBoundingClientRect(); f.el.style.transition = 'transform .7s ease-in'; f.el.style.transform = `translate(${jr.left - sr.left + jr.width * (.25 + Math.random() * .3)}px,${jr.top - sr.top + jr.height * (.35 + Math.random() * .4)}px) scale(.55)`; f.el.style.pointerEvents = 'none';
    AU.sfx('magic'); got++; set(got); VO.say(numw(got), false); jar.style.filter = `drop-shadow(0 0 ${6 + got * 4}px rgba(255,230,90,.9))`;
    if (got >= N) { setTimeout(() => VO.say(L('¡Un frasco lleno de luz! Ahora las dejamos volar', 'A jar full of light! Now we let them fly free'), false), 700); setTimeout(c.done, 1500); } }
  c.say(L(`Atrapa ${numw(N)} luciérnagas tocándolas con tu dedito`, `Catch ${numw(N)} fireflies by tapping them`));
  c.hint = () => (fl.find(f => !f.got) || {}).el; c.solve = () => fl.forEach(f => !f.got && catchF(f));
});
