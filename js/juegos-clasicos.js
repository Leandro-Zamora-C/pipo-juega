/* =====================================================================
   PIPO JUEGA · 20 MINIJUEGOS CLÁSICOS
   Cada juego: { name: [es, en], icon, theme, make(c) }
   c = { stage, r (azar con semilla), d (dificultad 0-4), W, H, say, done, hint, solve, cleanup }
===================================================================== */
const TYPES = {};
function mk(tag, cls, html, parent, style) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (style) e.style.cssText = style; (parent || G.stage).appendChild(e); return e; }
function emoEl(e, size, parent, style = '') { return mk('div', 'emo', e, parent, `font-size:${size}px;${style}`); }
function artEl(it, size, parent, style = '', mood) { const el = mk('div', 'artbox', art(it, size, mood), parent, style); el.it = it; return el; }
const unit = c => Math.min(c.W, c.H);
const hearAnimal = it => { if (it && it.k) AU.animal(it.k); };
const balloonSVG = (c, dk) => `<svg viewBox="0 0 60 96" width="100%"><path d="M30 74q-7 9 0 20" stroke="#8a8a9a" stroke-width="2" fill="none"/><path d="M30 3C14 3 4 16 4 31c0 19 16 33 26 37 10-4 26-18 26-37C56 16 46 3 30 3z" fill="${c}" stroke="${dk}" stroke-width="2"/><path d="M25 68l5 7 5-7z" fill="${dk}"/><ellipse cx="19" cy="21" rx="6" ry="11" fill="#fff" opacity=".45" transform="rotate(20 19 21)"/></svg>`;

/* 1. GLOBOS ----------------------------------------------------------- */
TYPES.globos = {
  name: ['Globos', 'Balloons'], icon: '🎈', theme: 'cielo',
  make(c) {
    const n = 5 + c.d * 2 + Math.floor(c.r() * 3), target = c.d >= 1 && c.r() < .55 ? pick(c.r, COLORS.slice(0, 6)) : null;
    const others = COLORS.filter(x => !target || x.n !== target.n);
    const cols = Array.from({ length: n }, (_, i) => target && i < Math.max(3, Math.ceil(n / 2)) ? target : pick(c.r, others));
    const size = clamp(unit(c) * .16, 54, 120), cells = shuf(c.r, Array.from({ length: 24 }, (_, i) => i));
    const items = shuf(c.r, cols).map((col, i) => {
      const cell = cells[i % cells.length], cx = (cell % 6 + .5) / 6, cy = (Math.floor(cell / 6) + .5) / 4;
      const el = mk('div', 'choice', balloonSVG(col.h, col.d), c.stage, `position:absolute;width:${size}px;left:${clamp(cx * c.W - size / 2 + (c.r() - .5) * 20, 6, c.W - size - 6)}px;top:${clamp(cy * c.H * .82 - size * .6, 6, c.H - size * 1.7)}px;animation:bob ${2 + c.r() * 1.5}s ease-in-out ${-c.r() * 2}s infinite`);
      el.col = col; el.addEventListener('pointerdown', () => tapB(el)); return el;
    });
    const left = () => items.filter(b => !b.popped && (!target || b.col.n === target.n));
    function tapB(b) {
      if (b.popped || G.finished) return; markAct();
      if (target && b.col.n !== target.n) { AU.sfx('no'); bump(b, 'shake'); VO.say(L(`Ese es ${b.col.n}. Busca el ${target.n}.`, `That one is ${b.col.en}. Find ${target.en}.`), false); return; }
      b.popped = true; AU.sfx('pop'); sparkleEl(b, 10); b.style.transition = 'transform .15s, opacity .15s'; b.style.transform = 'scale(1.5)'; b.style.opacity = '0'; setTimeout(() => b.remove(), 200);
      if (!left().length) c.done();
    }
    c.say(target ? L(`¡Revienta los globos de color ${target.n}!`, `Pop the ${target.en} balloons!`) : L('¡Revienta todos los globos!', 'Pop all the balloons!'));
    c.hint = () => left()[0]; c.solve = () => left().forEach(tapB);
  }
};
/* 2. CLASIFICAR ------------------------------------------------------- */
function basketSVG(col, dk) { return `<svg viewBox="0 0 120 80" width="100%"><path d="M6 14h108l-12 62H18z" fill="${col}" stroke="${dk}" stroke-width="4" stroke-linejoin="round"/><path d="M14 30h92M18 48h84" stroke="${dk}" stroke-width="3" opacity=".35"/><rect x="2" y="8" width="116" height="12" rx="6" fill="${dk}"/></svg>`; }
TYPES.clasificar = {
  name: ['Ordenar frutas', 'Sort fruits'], icon: '🧺', theme: 'cocina',
  make(c) {
    const byColor = c.d >= 1 && c.r() < .5, nb = c.d >= 2 ? 3 : 2;
    let groups;
    if (byColor) groups = sample(c.r, ['rojo', 'amarillo', 'verde'], nb).map(cn => ({ key: cn, col: COLORS.find(x => x.n === cn), items: FRUITS.filter(f => f.c === cn) }));
    else groups = sample(c.r, FRUITS, nb).map((f, i) => ({ key: f.n, icon: f.e, col: COLORS[[2, 0, 3, 5][i]], items: [f] }));
    const per = c.d >= 3 ? 3 : 2 + Math.floor(c.r() * 2);
    const all = shuf(c.r, groups.flatMap(g => Array.from({ length: per }, (_, k) => ({ g, f: g.items[k % g.items.length] }))));
    const U = unit(c), isz = clamp(U * .13, 44, 90);
    const shelf = mk('div', '', '', c.stage, `position:absolute;left:5%;right:5%;top:5%;height:48%;display:flex;flex-wrap:wrap;align-content:center;justify-content:center;gap:${isz * .25}px;background:linear-gradient(#c98a4b,#a96c33);border-radius:24px;border:6px solid #8a5424;padding:10px;box-shadow:inset 0 -10px 0 rgba(0,0,0,.12)`);
    const row = mk('div', '', '', c.stage, 'position:absolute;left:4%;right:4%;bottom:4%;height:38%;display:flex;justify-content:center;align-items:flex-end;gap:4%');
    const baskets = groups.map(g => { const b = mk('div', '', `<div class="bin" style="position:absolute;left:12%;right:12%;top:2%;height:56%;display:flex;flex-wrap:wrap;justify-content:center;align-items:flex-end;gap:2px"></div>${basketSVG(g.col.h, g.col.d)}${g.icon ? `<div class="emo" style="position:absolute;left:50%;top:62%;transform:translate(-50%,-50%);font-size:${isz * .55}px;background:#fff;border-radius:50%;padding:4px">${g.icon}</div>` : ''}`, row, `position:relative;width:${clamp(U * .32, 110, 230)}px`); b.g = g; return b; });
    const items = all.map(o => { const el = emoEl(o.f.e, isz, shelf, 'position:relative;cursor:grab'); el.o = o; draggable(el, { targets: baskets, onDrop: (b, el) => drop(b, el) }); return el; });
    function drop(b, el) {
      if (b.g !== el.o.g) { VO.say(byColor ? L(`Eso es de color ${el.o.f.c}`, `That is ${COLORS.find(x => x.n === el.o.f.c).en}`) : L(`Esa es ${the(el.o.f)}`, `That is ${the(el.o.f)}`), false); return false; }
      el._locked = true; el.style.transform = ''; el.style.fontSize = isz * .55 + 'px'; b.querySelector('.bin').appendChild(el); bump(el); AU.sfx('ok'); sparkleEl(el, 6);
      if (items.every(i => i._locked)) c.done(); return true;
    }
    c.say(byColor ? L('Pon cada fruta en la canasta de su color', 'Put each fruit in the basket of its color') : L('Pon cada fruta en su canasta', 'Put each fruit in its basket'));
    c.hint = () => items.find(i => !i._locked); c.solve = () => items.forEach(i => { if (!i._locked) drop(baskets.find(b => b.g === i.o.g), i); });
  }
};
/* 3. POP-IT ----------------------------------------------------------- */
TYPES.popit = {
  name: ['Pop-it', 'Pop-it'], icon: '🫧', theme: 'dulce',
  make(c) {
    const shape = pick(c.r, SHAPES.filter(s => ['círculo', 'cuadrado', 'corazón', 'estrella', 'rombo', 'triángulo'].includes(s.n)));
    const sp = [17, 15, 13, 12, 11][c.d], rad = sp * .38, p2 = new Path2D(shape.p), cv = document.createElement('canvas').getContext('2d');
    const bubbles = [];
    for (let y = sp / 2; y < 100; y += sp) for (let x = sp / 2; x < 100; x += sp) { let ok = true; for (let a = 0; a < 6.28; a += .785) if (!cv.isPointInPath(p2, x + Math.cos(a) * rad * 1.1, y + Math.sin(a) * rad * 1.1)) ok = false; if (ok) bubbles.push([x, y]); }
    const rainbow = ['#ff4d4d', '#ff9a3c', '#ffd23f', '#4cd964', '#3d8bff', '#a66bff', '#ff7eb6'];
    const bands = rainbow.map((col, i) => `<rect x="0" y="${i * 100 / 7}" width="100" height="${100 / 7 + .5}" fill="${col}"/>`).join('');
    const size = Math.min(c.W * .8, c.H * .86), cid = 'pc' + Math.floor(c.r() * 1e6);
    const box = mk('div', '', `<svg viewBox="-4 -4 108 108" width="100%"><defs><clipPath id="${cid}"><path d="${shape.p}"/></clipPath><radialGradient id="${cid}g" cx=".35" cy=".3"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
      <path d="${shape.p}" fill="#000" opacity=".15" transform="translate(1.5 2.5)"/><g clip-path="url(#${cid})">${bands}</g><path d="${shape.p}" fill="none" stroke="#2b2140" stroke-width="1.6"/>
      ${bubbles.map(([x, y], i) => `<g class="bub" style="cursor:pointer"><circle cx="${x}" cy="${y}" r="${rad}" fill="${rainbow[Math.min(6, Math.floor(y / (100 / 7)))]}" stroke="rgba(0,0,0,.25)" stroke-width=".6"/><circle class="hl" cx="${x}" cy="${y}" r="${rad}" fill="url(#${cid}g)"/></g>`).join('')}</svg>`, c.stage, `position:absolute;width:${size}px;left:${(c.W - size) / 2}px;top:${(c.H - size) / 2}px`);
    const els = [...box.querySelectorAll('.bub')];
    function press(g) { if (g.done) return; g.done = true; markAct(); AU.sfx('pop'); const ci = g.firstChild; ci.setAttribute('r', rad * .82); ci.style.filter = 'brightness(.72)'; g.querySelector('.hl').setAttribute('opacity', '.15'); if (navigator.vibrate) try { navigator.vibrate(12); } catch (e) {} if (els.every(e => e.done)) { sparkleEl(box, 16); c.done(); } }
    els.forEach(g => g.addEventListener('pointerdown', () => press(g)));
    box.addEventListener('pointermove', e => { if (e.buttons || e.pointerType === 'touch') { const t = document.elementFromPoint(e.clientX, e.clientY); const g = t && t.closest && t.closest('.bub'); if (g) press(g); } });
    c.say(L(`¡Aprieta todas las burbujas del ${shape.n}!`, `Press all the bubbles on the ${shape.en}!`));
    c.hint = () => els.find(e => !e.done); c.solve = () => els.forEach(press);
  }
};
/* 4. CONTAR ----------------------------------------------------------- */
TYPES.contar = {
  name: ['Contar', 'Counting'], icon: '🔢', theme: 'aula',
  make(c) {
    const max = [3, 5, 6, 8, 10][c.d], k = 1 + Math.floor(c.r() * max), thing = pick(c.r, [...FRUITS, ...ANIMALS.slice(0, 14), ...THINGS.slice(0, 12)]);
    const area = mk('div', 'card', '', c.stage, 'position:absolute;left:6%;right:6%;top:4%;height:60%;flex-wrap:wrap;align-content:center;justify-content:center;gap:2%;padding:2%');
    const U = unit(c), sz = clamp(U * (k > 6 ? .1 : .14), 38, 100); let counted = 0;
    const objs = Array.from({ length: k }, () => { const el = artEl(thing, sz, area, 'cursor:pointer;transition:transform .2s;position:relative'); el.addEventListener('pointerdown', () => { if (el.cnt) return; markAct(); el.cnt = ++counted; AU.sfx('tap'); VO.say(numw(counted), false); el.style.transform = 'scale(1.2)'; mk('div', 'countbadge', counted, el); }); return el; });
    const opts = shuf(c.r, [k, ...sample(c.r, Array.from({ length: 10 }, (_, i) => i + 1).filter(x => x !== k && Math.abs(x - k) <= 3), 2)]);
    const row = mk('div', '', '', c.stage, 'position:absolute;left:0;right:0;bottom:5%;height:26%;display:flex;justify-content:center;align-items:center;gap:4%');
    const bs = clamp(U * .2, 70, 130);
    const btns = opts.map(v => { const b = mk('button', 'card choice', v, row, `width:${bs}px;height:${bs}px;font-size:${bs * .6}px;font-weight:800;color:#3d8bff`); b.v = v; b.addEventListener('click', () => choose(b)); return b; });
    function choose(b) { if (G.finished) return; markAct(); if (b.v === k) { AU.sfx('ok'); b.style.background = '#c8f7c5'; sparkleEl(b, 10); VO.say(L(`¡Sí! Hay ${numw(k)}`, `Yes! There are ${numw(k)}`), false); c.done(); } else { AU.sfx('no'); bump(b, 'shake'); VO.say(L('Cuenta otra vez', 'Count again'), false); } }
    c.say(L('¿Cuántos hay? ¡Tócalos para contar!', 'How many are there? Touch them to count!'));
    c.hint = () => objs.find(o => !o.cnt) || btns.find(b => b.v === k); c.solve = () => choose(btns.find(b => b.v === k));
  }
};
/* 5. HUEVO SORPRESA --------------------------------------------------- */
const eggSVG = (c1, c2) => `<svg viewBox="0 0 100 124" width="100%"><ellipse cx="50" cy="118" rx="34" ry="5" fill="rgba(0,0,0,.15)"/><path d="M50 4C24 4 8 44 8 72c0 28 18 46 42 46s42-18 42-46C92 44 76 4 50 4z" fill="${c1}" stroke="#b07a00" stroke-width="3"/><path d="M14 60q12-8 24 0t24 0t24 0" stroke="${c2}" stroke-width="7" fill="none" opacity=".8"/><circle cx="34" cy="38" r="5" fill="${c2}"/><circle cx="64" cy="30" r="4" fill="${c2}"/><circle cx="70" cy="88" r="6" fill="${c2}"/><circle cx="32" cy="92" r="4" fill="${c2}"/><ellipse cx="32" cy="30" rx="6" ry="12" fill="#fff" opacity=".4" transform="rotate(25 32 30)"/>
  <g stroke="#5a3a00" stroke-width="3" fill="none" stroke-linejoin="round"><path class="c1" d="M40 20l6 10-5 8 7 8" opacity="0"/><path class="c2" d="M60 40l-6 8 7 6-5 10" opacity="0"/><path class="c3" d="M10 66l12-6 10 8 12-8 12 8 12-8 12 8 10-6" opacity="0"/></g></svg>`;
TYPES.huevo = {
  name: ['Huevo sorpresa', 'Surprise egg'], icon: '🥚', theme: 'granja',
  make(c) {
    const ne = c.d >= 2 ? 2 + Math.floor(c.r() * 2) : 1, hits = 3 + c.d, w = clamp(unit(c) * (ne > 1 ? .28 : .42), 100, 300);
    const pal = [['#ffe066', '#ff8fab'], ['#a0e7ff', '#ffd23f'], ['#c3f584', '#ff9a3c'], ['#ffc4f0', '#7dd3fc'], ['#ffd6a5', '#a66bff']];
    const row = mk('div', '', '', c.stage, 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:5%;padding-bottom:6%');
    const pool = shuf(c.r, ANIMALS);
    const eggs = Array.from({ length: ne }, (_, i) => { const p = pal[(i + Math.floor(c.r() * 5)) % 5]; const e = mk('div', 'choice', eggSVG(p[0], p[1]), row, `width:${w}px;position:relative;animation:bob ${2.2 + i * .3}s ease-in-out infinite`); e.h = 0; e.an = pool[i]; e.addEventListener('pointerdown', () => tap(e)); return e; });
    function tap(e) {
      if (e.open || G.finished) return; markAct(); e.h++; AU.sfx('crack'); bump(e, 'shake');
      const st = Math.ceil(e.h / hits * 3); ['c1', 'c2', 'c3'].forEach((k, i) => { if (i < st) e.querySelector('.' + k).setAttribute('opacity', '1'); });
      if (e.h >= hits) {
        e.open = true; AU.sfx('magic'); e.style.animation = 'none';
        e.innerHTML = `<div class="boing" style="width:${w * .8}px;height:${w * .8}px;margin:auto">${animalSVG(e.an.k, 'joy')}</div><div style="text-align:center;font-weight:800;font-size:${clamp(w * .16, 18, 40)}px">${cap(nm(e.an))}</div>`;
        sparkleEl(e, 14); setTimeout(() => hearAnimal(e.an), 250);
        VO.say(L(`¡Es ${e.an.a === 'el' ? 'un' : 'una'} ${e.an.n}! ${e.an.s || ''}`, `It's a ${e.an.en}! ${e.an.se || ''}`), false);
        if (eggs.every(x => x.open)) setTimeout(c.done, 1400);
      }
    }
    c.say(ne > 1 ? L('¡Toca los huevos para que nazcan!', 'Tap the eggs to hatch them!') : L('¡Toca el huevo! ¿Quién estará adentro?', 'Tap the egg! Who is inside?'));
    c.hint = () => eggs.find(e => !e.open); c.solve = () => eggs.forEach(e => { while (!e.open) tap(e); });
  }
};
/* 6. COLOREAR --------------------------------------------------------- */
const wedge = (a0, a1, r = 80) => { const p = a => [100 + Math.cos(a) * r, 100 + Math.sin(a) * r]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return `M100 100L${x0.toFixed(1)} ${y0.toFixed(1)}A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}Z`; };
const band = (r0, r1) => `M${100 - r1} 160A${r1} ${r1} 0 0 1 ${100 + r1} 160H${100 + r0}A${r0} ${r0} 0 0 0 ${100 - r0} 160Z`;
const circ = (x, y, r) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0Z`;
const ell = (x, y, rx, ry) => `M${x - rx} ${y}a${rx} ${ry} 0 1 0 ${rx * 2} 0a${rx} ${ry} 0 1 0 ${-rx * 2} 0Z`;
const PICS = [
  { n: ['la pelota', 'the ball'], r: [0, 1, 2, 3, 4, 5].map(i => wedge(i * 1.047 - 1.57, (i + 1) * 1.047 - 1.57)), extra: '<circle cx="100" cy="100" r="13" fill="#fff" stroke="#2b2140" stroke-width="4"/>' },
  { n: ['la casa', 'the house'], r: ['M128 46H146V84H128Z', 'M45 100H155V176H45Z', 'M34 103L100 44L166 103Z', 'M88 132H112V176H88Z', 'M56 116H80V140H56Z', 'M120 116H144V140H120Z', circ(32, 34, 16)] },
  { n: ['el helado', 'the ice cream'], r: ['M70 104L100 186L130 104Z', circ(78, 96, 27), circ(122, 96, 27), circ(100, 64, 28), circ(100, 30, 9)] },
  { n: ['el pez', 'the fish'], r: ['M44 100L8 66V134Z', ell(102, 100, 62, 40), 'M92 63Q112 34 130 66Z', 'M88 137Q100 160 118 135Z', circ(136, 92, 9)] },
  { n: ['la flor', 'the flower'], r: ['M96 112H104V190H96Z', 'M104 162Q132 138 154 160Q130 178 104 162Z', ...[0, 1, 2, 3, 4].map(i => circ(100 + Math.cos(i * 1.2566 - 1.57) * 32, 78 + Math.sin(i * 1.2566 - 1.57) * 32, 22)), circ(100, 78, 18)] },
  { n: ['el carro', 'the car'], r: ['M56 104L72 74H128L148 104Z', 'M24 120Q24 104 40 104H160Q176 104 176 120V150H24Z', 'M77 100L86 82H114L126 100Z', circ(60, 152, 18), circ(140, 152, 18), circ(167, 124, 6)] },
  { n: ['el árbol', 'the tree'], r: ['M88 118H112V186H88Z', circ(68, 96, 30), circ(132, 96, 30), circ(100, 66, 44), circ(84, 62, 8), circ(118, 84, 8)] },
  { n: ['la mariposa', 'the butterfly'], r: [ell(64, 76, 38, 32), ell(136, 76, 38, 32), ell(72, 132, 28, 24), ell(128, 132, 28, 24), ell(100, 104, 10, 50)] },
  { n: ['el cohete', 'the rocket'], r: ['M70 120L40 162H70Z', 'M130 120L160 162H130Z', 'M80 150L100 192L120 150Z', 'M70 60Q100 6 130 60V150H70Z', circ(100, 86, 16)] },
  { n: ['el arcoíris', 'the rainbow'], r: [band(75, 90), band(60, 75), band(45, 60), band(30, 45), ell(32, 160, 26, 14), ell(168, 160, 26, 14)] },
  { n: ['la tortuga', 'the turtle'], r: [ell(62, 150, 12, 16), ell(140, 150, 12, 16), circ(166, 118, 18), 'M36 132Q36 58 104 58Q164 58 164 132Z', ell(100, 104, 26, 20)] },
  { n: ['el sol', 'the sun'], r: ['M100 18L110 46H90ZM100 182L90 154H110ZM18 100L46 90V110ZM182 100L154 110V90ZM42 42L68 56L56 68ZM158 158L132 144L144 132ZM158 42L144 68L132 56ZM42 158L56 132L68 144Z', circ(100, 100, 46)] }
];
const crayon = col => `<svg viewBox="0 0 120 40" width="100%"><path d="M26 6H110Q116 6 116 12V28Q116 34 110 34H26Z" fill="${col.h}" stroke="${col.d}" stroke-width="3"/><path d="M26 6L4 20L26 34Z" fill="${col.h}" stroke="${col.d}" stroke-width="3" stroke-linejoin="round"/><path d="M4 20L12 15V25Z" fill="${col.d}"/><rect x="40" y="6" width="10" height="28" fill="rgba(0,0,0,.18)"/><rect x="88" y="6" width="10" height="28" fill="rgba(0,0,0,.18)"/><path d="M30 11H106" stroke="#fff" stroke-width="3" opacity=".45" stroke-linecap="round"/></svg>`;
TYPES.colorear = {
  name: ['Colorear', 'Coloring'], icon: '🖍️', theme: 'aula',
  make(c) {
    const pic = pick(c.r, PICS), land = c.W > c.H * 1.05;
    const cols = COLORS.slice(), size = land ? Math.min(c.H * .92, c.W * .62) : Math.min(c.W * .9, c.H * .66);
    const wrap = mk('div', '', '', c.stage, `position:absolute;inset:0;display:flex;flex-direction:${land ? 'row' : 'column-reverse'};align-items:center;justify-content:center;gap:3%`);
    const pal = mk('div', '', '', wrap, `display:flex;flex-direction:${land ? 'column' : 'row'};flex-wrap:wrap;justify-content:center;gap:6px;${land ? `width:${clamp(c.W * .16, 80, 150)}px` : 'width:96%'}`);
    let cur = cols[0];
    const sel = b => b.style.transform = land ? 'translateX(14px) scale(1.08)' : 'translateY(-10px) scale(1.08)';
    const crs = cols.map(col => { const b = mk('div', 'choice', crayon(col), pal, `width:${land ? '100%' : clamp(c.W * .2, 60, 120) + 'px'};transition:transform .15s`); b.addEventListener('pointerdown', () => { cur = col; AU.sfx('tap'); markAct(); crs.forEach(x => x.style.transform = ''); sel(b); VO.say(colorName(col), false); }); return b; });
    sel(crs[0]);
    const box = mk('div', 'card', `<svg viewBox="0 0 200 200" width="100%" style="display:block">${pic.r.map(d => `<path class="rg" d="${d}" fill="#fff" stroke="#2b2140" stroke-width="4" stroke-linejoin="round" style="cursor:pointer;transition:fill .35s"/>`).join('')}${pic.extra || ''}</svg>`, wrap, `width:${size}px;padding:2%;flex:0 0 auto`);
    const regs = [...box.querySelectorAll('.rg')];
    function paint(rg, col = cur) { markAct(); rg.setAttribute('fill', col.h); rg.filled = true; AU.sfx('drop'); const r = rg.getBoundingClientRect(); sparkle(r.left + r.width / 2, r.top + r.height / 2, 5, ['✨']); if (regs.every(x => x.filled)) { AU.sfx('magic'); c.done(); } }
    regs.forEach(rg => rg.addEventListener('pointerdown', () => paint(rg)));
    c.say(L(`¡Colorea ${pic.n[0]}! Elige un color y toca el dibujo`, `Color ${pic.n[1]}! Pick a color and tap the picture`));
    c.hint = () => regs.find(x => !x.filled); c.solve = () => regs.forEach((x, i) => paint(x, cols[i % cols.length]));
  }
};
/* 7. ENCONTRAR -------------------------------------------------------- */
const shapeSV = (s, col, w = '70%') => `<svg viewBox="0 0 100 100" width="${w}"><path d="${s.p}" fill="${col}" stroke="#2b2140" stroke-width="4" stroke-linejoin="round"/></svg>`;
const bigText = (v, i) => `<span style="font-weight:800;color:${COLORS[i % 8].h};-webkit-text-stroke:2px ${COLORS[i % 8].d}">${v}</span>`;
function findItems(c, cat, n, sz) {
  if (cat === 'animales') return sample(c.r, ANIMALS, n).map(a => ({ k: a.n, html: art(a, sz * .8), it: a, q: L(`Toca ${the(a)}`, `Touch ${the(a)}`), no: L(`Ese es ${the(a)}`, `That is ${the(a)}`) }));
  if (cat === 'frutas') return sample(c.r, FRUITS, n).map(f => ({ k: f.n, html: art(f, sz * .7), q: L(`Toca ${the(f)}`, `Touch ${the(f)}`), no: L(`Esa es ${the(f)}`, `That is ${the(f)}`) }));
  if (cat === 'colores') return sample(c.r, COLORS, n).map(col => ({ k: col.n, html: `<svg viewBox="0 0 100 100" width="70%"><path d="M50 6C70 6 94 22 92 48c-2 22-22 20-24 32-2 10 6 14-4 16C30 100 6 76 8 48 10 22 30 6 50 6z" fill="${col.h}" stroke="${col.d}" stroke-width="4"/></svg>`, q: L(`Toca el color ${col.n}`, `Touch the color ${col.en}`), no: L(`Ese es ${col.n}`, `That is ${col.en}`) }));
  if (cat === 'formas') return sample(c.r, SHAPES, n).map((s, i) => ({ k: s.n, html: shapeSV(s, COLORS[(i * 3 + 1) % 8].h), q: L(`Toca ${the(s)}`, `Touch the ${s.en}`), no: L(`Ese es ${the(s)}`, `That is the ${s.en}`) }));
  if (cat === 'numeros') return sample(c.r, Array.from({ length: c.d >= 2 ? 10 : 5 }, (_, i) => i + 1), n).map((v, i) => ({ k: v, html: bigText(v, i), q: L(`Toca el número ${numw(v)}`, `Touch the number ${numw(v)}`), no: L(`Ese es el ${numw(v)}`, `That is ${numw(v)}`) }));
  if (cat === 'letras') { const Ls = c.d >= 2 ? 'ABCDEFGIJLMNOPRSTUV'.split('') : 'AEIOU'.split(''); return sample(c.r, Ls, n).map((v, i) => ({ k: v, html: bigText(v, i), q: L(`Toca la letra ${v}`, `Touch the letter ${v}`), no: L(`Esa es la ${v}`, `That is ${v}`) })); }
  return sample(c.r, THINGS, n).map(t => ({ k: t.n, html: art(t, sz * .7), q: L(`Toca ${the(t)}`, `Touch ${the(t)}`), no: L(`Eso es ${the(t)}`, `That is ${the(t)}`) }));
}
TYPES.encontrar = {
  name: ['Encuentra', 'Find it'], icon: '🔍', theme: 'jardin',
  make(c) {
    const cats = [['animales', 'frutas', 'colores', 'formas'], ['animales', 'colores', 'formas', 'numeros', 'letras'], ['numeros', 'letras', 'objetos', 'animales', 'formas', 'colores'], ['numeros', 'letras', 'objetos', 'animales', 'frutas'], ['numeros', 'letras', 'objetos', 'formas']][c.d];
    const cat = pick(c.r, cats), n = [3, 4, 4, 5, 6][c.d], rounds = 3; let round = 0, target = null, btns = [];
    const dots = mk('div', 'rounddots', '', c.stage);
    const area = mk('div', '', '', c.stage, 'position:absolute;left:3%;right:3%;top:10%;bottom:16%;display:flex;flex-wrap:wrap;justify-content:center;align-content:center;gap:3%');
    const sz = clamp(unit(c) * (n > 4 ? .24 : .3), 80, 200);
    function next() {
      dots.innerHTML = Array.from({ length: rounds }, (_, i) => `<span class="${i < round ? 'on' : ''}"></span>`).join('');
      if (round >= rounds) { c.done(); return; }
      const items = findItems(c, cat, n, sz); target = pick(c.r, items); area.innerHTML = '';
      btns = items.map(it => { const b = mk('div', 'card choice boing', it.html, area, `width:${sz}px;height:${sz}px;font-size:${sz * .55}px`); b.it = it; b.addEventListener('pointerdown', () => choose(b)); return b; });
      c.say(target.q);
    }
    function choose(b) { if (G.finished || b.busy) return; markAct(); if (b.it === target) { b.busy = true; AU.sfx('ok'); if (b.it.it) hearAnimal(b.it.it); b.style.background = '#c8f7c5'; sparkleEl(b, 10); round++; setTimeout(next, 800); } else { AU.sfx('no'); bump(b, 'shake'); VO.say(b.it.no, false); } }
    next();
    c.hint = () => btns.find(b => b.it === target); c.solve = () => { round = rounds; next(); };
  }
};
/* 8. MEMORIA ---------------------------------------------------------- */
TYPES.memoria = {
  name: ['Memoria', 'Memory'], icon: '🃏', theme: 'dulce',
  make(c) {
    const pairs = [2, 3, 4, 5, 6][c.d], pool = pick(c.r, [ANIMALS, FRUITS, THINGS]), chosen = sample(c.r, pool, pairs);
    const deck = shuf(c.r, [...chosen, ...chosen]), cols = pairs <= 2 ? 2 : pairs <= 4 ? 4 : pairs === 5 ? 5 : 4;
    const rows = Math.ceil(deck.length / cols), gap = 10, cw = Math.min((c.W * .92 - gap * cols) / cols, (c.H * .9 - gap * rows) / rows / 1.25);
    const grid = mk('div', '', '', c.stage, `position:absolute;inset:0;display:grid;grid-template-columns:repeat(${cols},${cw}px);gap:${gap}px;justify-content:center;align-content:center;perspective:900px`);
    const cards = deck.map(it => { const el = mk('div', 'mcard', `<div class="in"><div class="f back emo" style="font-size:${cw * .4}px">⭐</div><div class="f front">${art(it, cw * .7)}</div></div>`, grid, `width:${cw}px;height:${cw * 1.25}px`); el.it = it; el.addEventListener('pointerdown', () => flip(el)); return el; });
    let open = [], lock = false;
    const setF = (el, on) => { el.classList.toggle('up', on); el.up = on; };
    function flip(el) {
      if (lock || el.up || el.done || G.finished) return; markAct(); AU.sfx('tap'); setF(el, true); open.push(el);
      if (open.length === 2) {
        const [a, b] = open; open = []; lock = true;
        if (a.it === b.it) setTimeout(() => { a.done = b.done = true; AU.sfx('ok'); hearAnimal(a.it); [a, b].forEach(x => { sparkleEl(x, 6); x.classList.add('match'); }); VO.say(cap(nm(a.it)), false); lock = false; if (cards.every(x => x.done)) c.done(); }, 400);
        else setTimeout(() => { setF(a, false); setF(b, false); lock = false; }, 900);
      }
    }
    c.say(L('Encuentra las parejas iguales', 'Find the matching pairs'));
    c.hint = () => cards.find(x => !x.done && !x.up); c.solve = () => { cards.forEach(x => { x.done = true; setF(x, true); }); c.done(); };
  }
};
/* 9. ALIMENTAR -------------------------------------------------------- */
const DIET = [['mono', '🍌'], ['conejo', '🥕'], ['perro', '🦴'], ['gato', '🐟'], ['panda', '🎋'], ['raton', '🧀'], ['oso', '🍯'], ['pollito', '🌽'], ['koala', '🌿'], ['pinguino', '🐟'], ['elefante', '🥜'], ['jirafa', '🌿'], ['vaca', '🌾'], ['buho', '🐛']];
TYPES.alimentar = {
  name: ['Dar de comer', 'Feed the animals'], icon: '🍌', theme: 'granja',
  make(c) {
    const rounds = 2 + (c.d >= 2 ? 1 : 0), list = sample(c.r, DIET, rounds).map(([k, f]) => ({ a: ANIMALS.find(x => x.k === k), f })); let i = 0;
    const U = unit(c), land = c.W > c.H;
    const an = mk('div', '', '', c.stage, `position:absolute;${land ? 'left:6%;top:10%;width:40%;bottom:10%' : 'left:0;right:0;top:4%;height:44%'};display:flex;align-items:center;justify-content:center`);
    const table = mk('div', '', '', c.stage, `position:absolute;${land ? 'right:4%;top:18%;width:46%;bottom:14%' : 'left:4%;right:4%;bottom:6%;height:36%'};display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:5%;background:linear-gradient(#d39a5d,#b97a3d);border-radius:26px;border:6px solid #8a5424`);
    let mouth = null, foods = [];
    function next() {
      if (i >= rounds) { c.done(); return; }
      const { a, f } = list[i], sz = clamp(U * .36, 110, 300);
      an.innerHTML = `<div style="position:relative;text-align:center"><div class="animal boing" style="width:${sz}px;height:${sz}px">${animalSVG(a.k, 'happy')}</div>${c.d < 2 ? `<div class="emo thought" style="font-size:${clamp(U * .1, 34, 80)}px">${f}</div>` : ''}</div>`;
      mouth = an.querySelector('.animal');
      const opts = shuf(c.r, [f, ...sample(c.r, [...new Set(DIET.map(x => x[1]))].filter(x => x !== f), c.d >= 3 ? 3 : 2)]);
      table.innerHTML = ''; foods = opts.map(ff => { const el = emoEl(ff, clamp(U * .13, 48, 100), table, 'position:relative;cursor:grab;filter:drop-shadow(0 4px 2px rgba(0,0,0,.2))'); el.f = ff; draggable(el, { targets: () => [mouth], onDrop: (t, el) => eat(el) }); return el; });
      c.say(L(`${cap(the(a))} tiene hambre. ¿Qué come?`, `${cap(the(a))} is hungry. What does it eat?`)); hearAnimal(a);
    }
    function eat(el) {
      const { a, f } = list[i];
      if (el.f !== f) { VO.say(L('¡Puaj! Eso no le gusta', 'Yuck! It does not like that'), false); mouth.innerHTML = animalSVG(a.k, 'angry'); setTimeout(() => mouth && (mouth.innerHTML = animalSVG(a.k, 'happy')), 900); bump(mouth, 'shake'); return false; }
      el._locked = true; el.style.transition = 'transform .3s, opacity .3s'; el.style.opacity = '0'; AU.sfx('chomp'); sparkleEl(mouth, 10); mouth.innerHTML = animalSVG(a.k, 'joy'); bump(mouth);
      VO.say(L('¡Ñam ñam! ¡Le encanta!', 'Yum yum! It loves it!'), false); i++; setTimeout(next, 1300); return true;
    }
    next();
    c.hint = () => foods.find(f => list[i] && f.f === list[i].f); c.solve = () => { i = rounds; next(); };
  }
};
/* 10. COCINAR --------------------------------------------------------- */
const RECIPES = {
  pizza: { n: ['la pizza', 'the pizza'], base: `<svg viewBox="0 0 200 200" width="100%"><circle cx="100" cy="104" r="96" fill="rgba(0,0,0,.12)"/><circle cx="100" cy="100" r="94" fill="#e9a54b" stroke="#b5712a" stroke-width="5"/><circle cx="100" cy="100" r="78" fill="#e0402a"/><path d="M40 90q20-30 50-10t60 0q10 40-20 60t-70-10z" fill="#ffd977" opacity=".9"/></svg>`, ing: ['🍅', '🧀', '🍄', '🌽', '🍍', '🥓', '🌶️'], r: .3 },
  pastel: { n: ['el pastel', 'the cake'], base: `<svg viewBox="0 0 200 200" width="100%"><ellipse cx="100" cy="176" rx="92" ry="16" fill="#cfd8e3"/><path d="M24 92H176V168Q100 186 24 168Z" fill="#ffb3cf" stroke="#d4407f" stroke-width="4"/><path d="M24 92Q100 70 176 92V112Q160 126 150 110Q138 128 124 110Q112 128 100 112Q86 128 74 110Q62 128 50 110Q38 126 24 112Z" fill="#fff" stroke="#e5d5dd" stroke-width="3"/><ellipse cx="100" cy="92" rx="76" ry="16" fill="#fff4f8"/></svg>`, ing: ['🍓', '🍒', '🍫', '🍬', '🍌', '🍪', '🕯️'], r: .22, top: true },
  helado: { n: ['la copa de helado', 'the sundae'], base: `<svg viewBox="0 0 200 200" width="100%"><path d="M30 104H170Q160 160 100 164Q40 160 30 104Z" fill="#bfe9ff" stroke="#5fb4e3" stroke-width="4"/><rect x="92" y="162" width="16" height="20" fill="#bfe9ff" stroke="#5fb4e3" stroke-width="4"/><ellipse cx="100" cy="186" rx="40" ry="8" fill="#bfe9ff" stroke="#5fb4e3" stroke-width="4"/><circle cx="66" cy="96" r="30" fill="#fff0c2"/><circle cx="134" cy="96" r="30" fill="#ffc2dc"/><circle cx="100" cy="74" r="32" fill="#8b5a3c"/></svg>`, ing: ['🍓', '🍌', '🍒', '🍪', '🍫', '🍬'], r: .26, top: true }
};
TYPES.cocinar = {
  name: ['Cocinar', 'Cooking'], icon: '🍕', theme: 'cocina',
  make(c) {
    const R = RECIPES[pick(c.r, ['pizza', 'pizza', 'pastel', 'helado'])], ni = c.d >= 2 ? 4 : 3, ings = sample(c.r, R.ing, ni).map(e => ({ e, need: 2 + Math.floor(c.r() * (c.d >= 1 ? 3 : 2)), have: 0 }));
    const U = unit(c), bs = Math.min(c.W * (c.W > c.H ? .5 : .62), c.H * .78);
    const base = mk('div', '', R.base, c.stage, `position:absolute;width:${bs}px;left:${(c.W - bs) / 2}px;top:${(c.H - bs) / 2 + 10}px`);
    const card = mk('div', 'card recipe', '', c.stage);
    const renderCard = () => { card.innerHTML = ings.map(g => `<span style="${g.have >= g.need ? 'opacity:.45' : ''}"><span class="emo">${g.e}</span>${g.have >= g.need ? '✅' : `×${g.need - g.have}`}</span>`).join(''); };
    renderCard();
    const half = Math.ceil(ni / 2), bw = clamp(U * .17, 64, 120);
    const bowls = ings.map((g, k) => { const left = k < half, idx = left ? k : k - half, cnt = left ? half : ni - half; const b = mk('div', 'choice', `<div class="bowl emo" style="width:${bw}px;height:${bw * .6}px;border-radius:0 0 ${bw}px ${bw}px;font-size:${bw * .42}px"><span style="margin-top:-${bw * .2}px">${g.e}${g.e}</span></div>`, c.stage, `position:absolute;${left ? 'left:3%' : 'right:3%'};top:${((idx + 1) / (cnt + 1)) * 100}%;transform:translateY(-50%)`); b.g = g; b.addEventListener('pointerdown', () => add(b)); return b; });
    function add(b) {
      const g = b.g; if (G.finished) return; markAct();
      if (g.have >= g.need) { AU.sfx('no'); bump(b, 'shake'); VO.say(L('¡Ya tiene suficiente!', 'That is enough!'), false); return; }
      g.have++; AU.sfx('drop');
      const a = c.r() * 6.28, rr = Math.sqrt(c.r()) * R.r * bs, px = bs / 2 + Math.cos(a) * rr, py = (R.top ? bs * .42 : bs / 2) + Math.sin(a) * rr * (R.top ? .35 : 1);
      const [bx, by] = centerOf(b), br = base.getBoundingClientRect();
      const p = emoEl(g.e, bs * .12, base, `position:absolute;left:${px}px;top:${py}px;transform:translate(${bx - br.left - px}px,${by - br.top - py}px) translate(-50%,-50%) scale(1.4);transition:transform .45s cubic-bezier(.3,1.4,.5,1)`);
      requestAnimationFrame(() => requestAnimationFrame(() => { p.style.transform = `translate(-50%,-50%) rotate(${(c.r() - .5) * 60}deg)`; }));
      renderCard();
      if (ings.every(x => x.have >= x.need)) { setTimeout(() => { AU.sfx('magic'); sparkleEl(base, 18); VO.say(L(`¡Qué rica quedó ${R.n[0]}!`, `Yummy, ${R.n[1]} is ready!`), false); }, 450); setTimeout(c.done, 900); }
    }
    c.say(L(`¡Preparemos ${R.n[0]}! Toca los ingredientes`, `Let's make ${R.n[1]}! Tap the ingredients`));
    c.hint = () => bowls.find(b => b.g.have < b.g.need); c.solve = () => bowls.forEach(b => { while (b.g.have < b.g.need) add(b); });
  }
};
/* 11. UNIR PUNTOS ----------------------------------------------------- */
const DOTS = [
  { n: ['un triángulo', 'a triangle'], p: [[50, 12], [88, 84], [12, 84]], col: '#ffd23f' },
  { n: ['un cuadrado', 'a square'], p: [[18, 18], [82, 18], [82, 82], [18, 82]], col: '#5fd3ff' },
  { n: ['una casita', 'a little house'], p: [[20, 88], [20, 46], [50, 14], [80, 46], [80, 88]], col: '#ff9a3c' },
  { n: ['un rombo', 'a diamond'], p: [[50, 8], [88, 50], [50, 92], [12, 50]], col: '#a66bff' },
  { n: ['una estrella', 'a star'], p: [[50, 6], [61, 37], [94, 37], [67, 57], [77, 90], [50, 70], [23, 90], [33, 57], [6, 37], [39, 37]], col: '#ffd23f' },
  { n: ['un corazón', 'a heart'], p: [[50, 90], [16, 60], [8, 36], [18, 16], [36, 12], [50, 26], [64, 12], [82, 16], [92, 36], [84, 60]], col: '#ff4d4d' },
  { n: ['un pez', 'a fish'], p: [[10, 30], [30, 50], [10, 70], [34, 62], [60, 76], [88, 56], [90, 44], [60, 24], [34, 38]], col: '#4cd964' },
  { n: ['un barco', 'a boat'], p: [[8, 60], [92, 60], [76, 84], [24, 84], [8, 60], [48, 60], [48, 10], [80, 52]], col: '#3d8bff' },
  { n: ['un cohete', 'a rocket'], p: [[50, 6], [66, 30], [66, 66], [82, 86], [62, 78], [38, 78], [18, 86], [34, 66], [34, 30]], col: '#ff7eb6' }
];
TYPES.unir = {
  name: ['Unir puntos', 'Connect the dots'], icon: '✏️', theme: 'aula',
  make(c) {
    const pool = DOTS.filter(s => s.p.length <= [4, 5, 9, 10, 10][c.d] && s.p.length >= [3, 3, 4, 5, 8][c.d]);
    const sh = pick(c.r, pool.length ? pool : DOTS), N = sh.p.length, size = Math.min(c.W * .86, c.H * .92);
    const box = mk('div', '', `<svg viewBox="-6 -6 112 112" width="100%" style="overflow:visible"><polygon class="fill" points="${sh.p.map(q => q.join(',')).join(' ')}" fill="${sh.col}" opacity="0" style="transition:opacity .6s"/><g class="lines" stroke="#2b2140" stroke-width="2.4" stroke-linecap="round"></g>
      ${sh.p.map(([x, y], i) => `<g class="dot" data-i="${i}" style="cursor:pointer"><circle cx="${x}" cy="${y}" r="7" fill="transparent"/><circle class="dc" cx="${x}" cy="${y}" r="4.2" fill="#fff" stroke="#2b2140" stroke-width="1.6"/><text x="${x}" y="${y + 1.6}" text-anchor="middle" font-size="5" font-weight="800" font-family="Baloo 2,sans-serif" fill="#2b2140">${i + 1}</text></g>`).join('')}</svg>`, c.stage, `position:absolute;width:${size}px;left:${(c.W - size) / 2}px;top:${(c.H - size) / 2}px`);
    const dots = [...box.querySelectorAll('.dot')], lines = box.querySelector('.lines'); let nx = 0;
    const glow = () => dots.forEach((d, i) => { const ci = d.querySelector('.dc'); ci.setAttribute('fill', i < nx ? '#4cd964' : i === nx ? '#ffd23f' : '#fff'); ci.setAttribute('r', i === nx ? 5.4 : 4.2); });
    const seg = (a, b) => { const l = document.createElementNS('http://www.w3.org/2000/svg', 'line'); l.setAttribute('x1', a[0]); l.setAttribute('y1', a[1]); l.setAttribute('x2', b[0]); l.setAttribute('y2', b[1]); lines.appendChild(l); };
    function tap(d) {
      const i = +d.dataset.i; if (G.finished) return; markAct();
      if (i !== nx) { AU.sfx('no'); VO.say(L(`Busca el número ${numw(nx + 1)}`, `Find number ${numw(nx + 1)}`), false); return; }
      AU.note(Math.min(11, nx)); VO.say(numw(i + 1), false); if (nx > 0) seg(sh.p[nx - 1], sh.p[nx]); nx++; glow();
      if (nx === N) { seg(sh.p[N - 1], sh.p[0]); box.querySelector('.fill').setAttribute('opacity', '1'); AU.sfx('magic'); sparkleEl(box, 18); VO.say(L(`¡Es ${sh.n[0]}!`, `It's ${sh.n[1]}!`), false); setTimeout(c.done, 900); }
    }
    dots.forEach(d => d.addEventListener('pointerdown', () => tap(d))); glow();
    c.say(L('Une los puntos en orden: uno, dos, tres…', 'Connect the dots in order: one, two, three…'));
    c.hint = () => dots[nx]; c.solve = () => { while (nx < N) tap(dots[nx]); };
  }
};
/* utilidad: frotar para limpiar (baño, dentista, lavar) ---------------- */
function rubTool(c, { spots, onClean, tool, radius }) {
  let lastS = 0;
  const cursor = emoEl(tool, 56, c.stage, 'position:absolute;pointer-events:none;display:none;z-index:5;transform:translate(-30%,-60%)');
  const rub = e => {
    const sr = c.stage.getBoundingClientRect(), x = e.clientX - sr.left, y = e.clientY - sr.top;
    cursor.style.display = ''; cursor.style.left = x + 'px'; cursor.style.top = y + 'px';
    spots.forEach(s => {
      if (s.clean) return; const r = s.getBoundingClientRect(), cx = r.left + r.width / 2 - sr.left, cy = r.top + r.height / 2 - sr.top;
      if (Math.hypot(cx - x, cy - y) < radius + r.width / 2) {
        s.dirt -= .09; s.style.opacity = Math.max(0, s.dirt);
        if (Date.now() - lastS > 90) { lastS = Date.now(); AU.sfx('scrub'); if (!LITE()) { const b = mk('div', 'soapbub', '', c.stage, `left:${x + (Math.random() - .5) * 60}px;top:${y + (Math.random() - .5) * 60}px;width:${14 + Math.random() * 22}px`); setTimeout(() => b.remove(), 1200); } }
        if (s.dirt <= .08) { s.clean = true; s.remove(); onClean(s); }
      }
    });
    markAct();
  };
  const layer = mk('div', '', '', c.stage, 'position:absolute;inset:0;z-index:1;touch-action:none'); let on = false;
  layer.addEventListener('pointerdown', e => { on = true; try { layer.setPointerCapture(e.pointerId); } catch (er) {} rub(e); });
  layer.addEventListener('pointermove', e => { if (on || (e.pointerType === 'mouse' && e.buttons)) rub(e); });
  const end = () => { on = false; cursor.style.display = 'none'; };
  layer.addEventListener('pointerup', end); layer.addEventListener('pointercancel', end);
}
function placeSpots(c, rectEl, n, colr, sizeF, z = 3, out) {
  const spots = out || [];
  requestAnimationFrame(() => {
    const r = rectEl.getBoundingClientRect(), sr = c.stage.getBoundingClientRect();
    for (let i = 0; i < n; i++) { const a = c.r() * 6.28, d = Math.sqrt(c.r()) * .32, x = r.left - sr.left + r.width * (.5 + Math.cos(a) * d), y = r.top - sr.top + r.height * (.5 + Math.sin(a) * d * .9), s = clamp(r.width * (sizeF + c.r() * .08), 22, 74); const sp = mk('div', 'mud', '', c.stage, `left:${x - s / 2}px;top:${y - s / 2}px;width:${s}px;height:${s * .8}px;background:${colr};z-index:${z}`); sp.dirt = 1; spots.push(sp); }
  });
  return spots;
}
/* 12. BAÑO ------------------------------------------------------------ */
TYPES.bano = {
  name: ['Hora del baño', 'Bath time'], icon: '🛁', theme: 'bano',
  make(c) {
    const pet = pick(c.r, ANIMALS.filter(a => ['perro', 'gato', 'cerdito', 'panda', 'oso', 'conejo', 'mono', 'koala', 'zorro', 'oveja', 'tigre'].includes(a.k))), ps = clamp(unit(c) * .5, 160, 380);
    const tub = mk('div', '', `<div class="petface" style="width:${ps}px;height:${ps}px;margin:0 auto -${ps * .3}px;position:relative;z-index:1">${animalSVG(pet.k, 'sad')}</div><svg viewBox="0 0 300 120" width="100%" style="position:relative;z-index:2"><path d="M10 20H290Q284 104 220 112H80Q16 104 10 20Z" fill="#c5a3ff" stroke="#8a5cf0" stroke-width="6"/><rect x="0" y="10" width="300" height="20" rx="10" fill="#d9c2ff" stroke="#8a5cf0" stroke-width="5"/><path d="M60 112l-12 8M240 112l12 8" stroke="#8a5cf0" stroke-width="8" stroke-linecap="round"/><g fill="#fff" opacity=".9"><circle cx="40" cy="22" r="16"/><circle cx="70" cy="14" r="20"/><circle cx="110" cy="20" r="14"/><circle cx="210" cy="18" r="18"/><circle cx="250" cy="22" r="15"/></g></svg><div class="emo duck" style="position:absolute;right:8%;bottom:62%;font-size:${ps * .16}px;z-index:3">🦆</div>`, c.stage, `position:absolute;width:${ps * 1.3}px;left:${(c.W - ps * 1.3) / 2}px;bottom:4%`);
    const face = tub.querySelector('.petface');
    const spots = placeSpots(c, face, 5 + c.d * 2, 'radial-gradient(circle at 40% 35%,#8d5a2b,#5e3a17)', .12);
    rubTool(c, { spots, tool: '🧽', radius: ps * .12, onClean: () => { if (spots.every(x => x.clean)) { face.innerHTML = animalSVG(pet.k, 'joy'); AU.sfx('magic'); hearAnimal(pet); sparkleEl(face, 20); VO.say(L('¡Qué limpio quedó!', 'All clean!'), false); setTimeout(c.done, 900); } } });
    c.say(L(`${cap(the(pet))} está muy sucio. ¡Frota con la esponja!`, `${cap(the(pet))} is very dirty. Scrub with the sponge!`));
    c.hint = () => spots.find(s => !s.clean); c.solve = () => { spots.forEach(s => { s.clean = true; s.remove(); }); c.done(); };
  }
};
/* 13. PIANO ----------------------------------------------------------- */
const PIANO_SONGS = [
  { n: 'Estrellita', s: [0, 0, 4, 4, 5, 5, 4, 3, 3, 2, 2, 1, 1, 0] }, { n: 'Los pollitos', s: [0, 1, 2, 3, 4, 4, 5, 5, 5, 5, 4, 3, 3, 3, 3, 2, 2] },
  { n: 'La escalera', s: [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1, 0] }, { n: 'Saltitos', s: [0, 2, 4, 2, 0, 4, 7, 4, 2, 0] }, { n: 'Martinillo', s: [0, 1, 2, 0, 0, 1, 2, 0, 2, 3, 4, 2, 3, 4] }
];
TYPES.piano = {
  name: ['Piano', 'Piano'], icon: '🎹', theme: 'noche',
  make(c) {
    const song = pick(c.r, PIANO_SONGS), len = Math.min(song.s.length, 5 + c.d * 2), seq = song.s.slice(0, len);
    const names = EN() ? ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'] : ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si', 'Do'], kc = ['#ff4d4d', '#ff9a3c', '#ffd23f', '#4cd964', '#5fd3ff', '#3d8bff', '#a66bff', '#ff7eb6'];
    const kb = mk('div', '', '', c.stage, 'position:absolute;left:3%;right:3%;bottom:6%;height:62%;display:flex;gap:1.2%;align-items:stretch');
    const notesRow = mk('div', 'rounddots', '', c.stage, 'flex-wrap:wrap;padding:0 10px');
    let k = 0;
    const keys = names.map((n, i) => { const b = mk('div', 'choice pkey', `<div class="emo star">⭐</div><b>${n}</b>`, kb, `background:linear-gradient(${kc[i]},${kc[i]}dd)`); b.i = i; b.addEventListener('pointerdown', () => press(b)); return b; });
    const draw = () => { notesRow.innerHTML = seq.map((n, i) => `<span style="background:${i < k ? kc[n] : 'rgba(255,255,255,.25)'};border:3px solid #fff"></span>`).join(''); keys.forEach((b, i) => { b.classList.toggle('next', i === seq[k]); }); };
    function press(b) {
      if (G.finished) return; markAct(); AU.note(b.i, .55); b.style.filter = 'brightness(1.3)'; setTimeout(() => b.style.filter = '', 160);
      if (b.i !== seq[k]) return; k++; draw();
      if (k >= seq.length) { sparkleEl(kb, 16); VO.say(L(`¡Tocaste ${song.n}!`, `You played ${song.n}!`), false); setTimeout(c.done, 700); }
    }
    draw();
    c.say(L(`¡Toca las teclas con estrella! Canción: ${song.n}`, `Tap the keys with a star! Song: ${song.n}`));
    c.hint = () => keys[seq[k]]; c.solve = () => { while (k < seq.length) press(keys[seq[k]]); };
  }
};
/* 14. GRANDE Y PEQUEÑO ------------------------------------------------ */
TYPES.tamano = {
  name: ['Grande y pequeño', 'Big and small'], icon: '🐘', theme: 'cielo',
  make(c) {
    const rounds = 3, n = [3, 3, 4, 4, 5][c.d]; let round = 0, items = [], want = null;
    const area = mk('div', '', '', c.stage, 'position:absolute;inset:6% 3% 14%;display:flex;align-items:flex-end;justify-content:center;gap:4%');
    const U = unit(c);
    function next() {
      if (round >= rounds) { c.done(); return; }
      const th = pick(c.r, [...ANIMALS, ...THINGS.slice(0, 14), ...FRUITS]); want = c.r() < .5 ? 'big' : 'small';
      const sizes = shuf(c.r, Array.from({ length: n }, (_, i) => .1 + i * (.3 / (n - 1))));
      area.innerHTML = ''; items = sizes.map(sz => { const el = artEl(th, U * sz, area, 'cursor:pointer;transition:transform .2s'); el.classList.add('choice', 'boing'); el.sz = sz; el.addEventListener('pointerdown', () => choose(el)); return el; });
      c.say(want === 'big' ? L('Toca el más GRANDE', 'Touch the BIGGEST one') : L('Toca el más pequeñito', 'Touch the smallest one'));
    }
    const best = () => items.reduce((a, b) => (want === 'big' ? b.sz > a.sz : b.sz < a.sz) ? b : a);
    function choose(el) { if (G.finished || el.busy) return; markAct(); if (el === best()) { el.busy = true; AU.sfx(want === 'big' ? 'boing' : 'ok'); sparkleEl(el, 10); round++; setTimeout(next, 700); } else { AU.sfx('no'); bump(el, 'shake'); } }
    next();
    c.hint = () => best(); c.solve = () => { round = rounds; next(); };
  }
};
/* 15. DENTISTA -------------------------------------------------------- */
TYPES.dentista = {
  name: ['Dentista', 'Dentist'], icon: '🦷', theme: 'bano',
  make(c) {
    const U = unit(c), w = Math.min(c.W * .74, c.H * 1.05);
    const box = mk('div', '', `<svg viewBox="0 0 300 200" width="100%"><ellipse cx="150" cy="100" rx="146" ry="96" fill="#ffb3c1" stroke="#e05a7a" stroke-width="6"/><ellipse cx="150" cy="104" rx="120" ry="70" fill="#7a1f3d"/><ellipse cx="150" cy="140" rx="70" ry="26" fill="#ff6b8a"/>
      ${[0, 1, 2, 3, 4, 5].map(i => `<path class="tooth" d="M${54 + i * 33} 36h30v34q0 10-15 10t-15-10z" fill="#fff" stroke="#e8dcdc" stroke-width="2"/>`).join('')}${[0, 1, 2, 3, 4, 5].map(i => `<path class="tooth" d="M${62 + i * 30} 168h28v-30q0-10-14-10t-14 10z" fill="#fff" stroke="#e8dcdc" stroke-width="2"/>`).join('')}</svg>`, c.stage, `position:absolute;width:${w}px;left:${(c.W - w) / 2}px;top:${(c.H - w * .667) / 2}px`);
    const patient = pick(c.r, ANIMALS.filter(a => ['mono', 'perro', 'gato', 'oso', 'panda', 'conejo', 'leon', 'tigre'].includes(a.k)));
    const pf = mk('div', '', animalSVG(patient.k, 'wow'), c.stage, `position:absolute;right:2%;top:2%;width:${clamp(U * .2, 60, 140)}px;height:${clamp(U * .2, 60, 140)}px;animation:bob 2s infinite`);
    const teeth = [...box.querySelectorAll('.tooth')], nG = 3 + c.d, nS = 2 + c.d, germs = [], stains = [];
    requestAnimationFrame(() => {
      const sr = c.stage.getBoundingClientRect(), order = shuf(c.r, teeth);
      order.slice(0, nG).forEach(t => { const r = t.getBoundingClientRect(); const g = emoEl('🦠', clamp(r.width * .9, 26, 60), c.stage, `position:absolute;left:${r.left - sr.left + r.width / 2}px;top:${r.top - sr.top + r.height / 2}px;transform:translate(-50%,-50%);cursor:pointer;animation:bob 1s ease-in-out ${-c.r()}s infinite;z-index:3`); g.addEventListener('pointerdown', e => { e.stopPropagation(); zap(g); }); germs.push(g); });
      order.slice(nG, nG + nS).concat(order.slice(0, Math.max(0, nS - (teeth.length - nG)))).forEach(t => { const r = t.getBoundingClientRect(); const s = mk('div', 'mud', '', c.stage, `left:${r.left - sr.left + r.width * .15}px;top:${r.top - sr.top + r.height * .2}px;width:${r.width * .7}px;height:${r.height * .55}px;border-radius:40%;background:#e2c044;z-index:2`); s.dirt = 1; stains.push(s); });
    });
    function zap(g) { if (g.dead || G.finished) return; markAct(); g.dead = true; AU.sfx('zap'); sparkleEl(g, 8); g.style.transition = 'transform .25s, opacity .25s'; g.style.transform = 'translate(-50%,-50%) scale(0)'; g.style.opacity = 0; setTimeout(() => g.remove(), 260); check(); }
    const check = () => { if (germs.length && germs.every(g => g.dead) && stains.every(s => s.clean)) { pf.innerHTML = animalSVG(patient.k, 'joy'); AU.sfx('magic'); VO.say(L('¡Dientes limpios y brillantes!', 'Clean and shiny teeth!'), false); sparkleEl(box, 20); setTimeout(c.done, 700); } };
    rubTool(c, { spots: stains, tool: '🪥', radius: U * .06, onClean: check });
    c.say(L('¡Atrapa los bichitos y cepilla los dientes amarillos!', 'Catch the germs and brush the yellow teeth!'));
    c.hint = () => germs.find(g => !g.dead) || stains.find(s => !s.clean); c.solve = () => { germs.forEach(zap); stains.forEach(s => { s.clean = true; s.remove(); }); check(); };
  }
};
/* 16. SOMBRAS --------------------------------------------------------- */
TYPES.sombras = {
  name: ['Sombras', 'Shadows'], icon: '👤', theme: 'jardin',
  make(c) {
    const n = [3, 3, 4, 4, 5][c.d], its = sample(c.r, [...ANIMALS, ...THINGS, ...FRUITS], n), sz = clamp(Math.min(c.H / (n + .8), c.W * .2) * .8, 40, 130);
    const colL = mk('div', 'col2', '', c.stage, 'left:4%'), colR = mk('div', 'col2', '', c.stage, 'right:4%');
    const shadows = shuf(c.r, its).map(it => { const s = artEl(it, sz, colL, 'filter:brightness(0) opacity(.5);transition:filter .4s'); return s; });
    const pieces = shuf(c.r, its).map(it => { const p = artEl(it, sz, colR, 'cursor:grab;position:relative'); draggable(p, { targets: () => shadows.filter(s => !s.ok), onDrop: (s, p) => drop(s, p) }); return p; });
    function drop(s, p) { if (s.it !== p.it) { VO.say(L('Esa sombra no es', 'Not that shadow'), false); return false; } s.ok = true; p._locked = true; p.style.transition = 'opacity .3s'; p.style.opacity = '0'; s.style.filter = 'none'; bump(s); AU.sfx('ok'); hearAnimal(p.it); sparkleEl(s, 8); VO.say(cap(nm(p.it)), false); if (shadows.every(x => x.ok)) setTimeout(c.done, 400); return true; }
    c.say(L('Lleva cada dibujo a su sombra', 'Drag each picture to its shadow'));
    c.hint = () => pieces.find(p => !p._locked); c.solve = () => pieces.forEach(p => { if (!p._locked) drop(shadows.find(s => s.it === p.it), p); });
  }
};
/* 17. PIÑATA ---------------------------------------------------------- */
const pinataSVG = () => `<svg viewBox="0 0 200 230" width="100%"><path d="M100 0V40" stroke="#8a6a4a" stroke-width="4"/>
  <g stroke="#2b2140" stroke-width="3" stroke-linejoin="round"><circle cx="100" cy="130" r="62" fill="#ffd23f"/><path d="M38 130h124" stroke="#ff4d4d" stroke-width="16"/><path d="M48 98h104M48 162h104" stroke="#4cd964" stroke-width="14"/><path d="M66 74h68M66 186h68" stroke="#3d8bff" stroke-width="12"/><circle cx="100" cy="130" r="62" fill="none"/>
  <path d="M100 68L88 40H112Z" fill="#ff7eb6"/><path d="M162 130L196 118V142Z" fill="#a66bff"/><path d="M38 130L4 118V142Z" fill="#ff9a3c"/><path d="M100 192L88 222H112Z" fill="#5fd3ff"/><path d="M144 86L170 62L160 96Z" fill="#4cd964"/><path d="M56 86L30 62L40 96Z" fill="#ff4d4d"/><path d="M144 174L170 198L160 164Z" fill="#ffd23f"/><path d="M56 174L30 198L40 164Z" fill="#a66bff"/></g>
  <g stroke="#2b2140" stroke-width="3" fill="none"><path class="t1" d="M80 110l10 10-8 8 10 10" opacity="0"/><path class="t2" d="M120 140l-10 8 8 8-10 10" opacity="0"/><path class="t3" d="M90 160l20 -4 -6 12" opacity="0"/></g>
  <circle cx="82" cy="122" r="6" fill="#2b2140"/><circle cx="118" cy="122" r="6" fill="#2b2140"/><path d="M88 144q12 10 24 0" stroke="#2b2140" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`;
TYPES.pinata = {
  name: ['Piñata', 'Piñata'], icon: '🎉', theme: 'dulce',
  make(c) {
    c.noRestart = true;
    const need = 5 + c.d * 2, U = unit(c), w = clamp(U * .5, 160, 360); let hits = 0, broken = false;
    const p = mk('div', 'choice swing', pinataSVG(), c.stage, `position:absolute;width:${w}px;left:${(c.W - w) / 2}px;top:2%`);
    function hit() {
      if (broken || G.finished) return; markAct(); hits++; AU.sfx('crack'); sparkle(...centerOf(p), 5, ['💥', '⭐']);
      p.style.filter = 'brightness(1.3)'; setTimeout(() => p.style.filter = '', 120);
      const st = Math.ceil(hits / need * 3); ['t1', 't2', 't3'].forEach((k, i) => { if (i < st) p.querySelector('.' + k).setAttribute('opacity', '1'); });
      if (hits >= need) {
        broken = true; AU.sfx('win'); confetti(80); p.classList.remove('swing'); p.style.transition = 'opacity .4s'; p.style.opacity = '0';
        const [cx, cy] = centerOf(p), sr = c.stage.getBoundingClientRect();
        for (let i = 0; i < (LITE() ? 10 : 26); i++) emoEl(pick(Math.random, ['🍬', '🍭', '🍫', '🧁', '🍪', '🍩', '⭐']), clamp(U * .07, 26, 54), c.stage, `position:absolute;left:${cx - sr.left + (Math.random() - .5) * w * .6}px;top:${cy - sr.top}px;--fy:${c.H * (.45 + Math.random() * .35)}px;--fr:${(Math.random() - .5) * 720}deg;animation:fall ${.8 + Math.random() * .6}s cubic-bezier(.4,0,.8,.6) forwards`);
        VO.say(L('¡Muchos dulces!', 'So many candies!'), false); setTimeout(c.done, 1500);
      }
    }
    p.addEventListener('pointerdown', hit);
    c.say(L(`¡Golpea la piñata ${numw(need)} veces!`, `Hit the piñata ${numw(need)} times!`));
    c.hint = () => broken ? null : p; c.solve = () => { while (!broken) hit(); };
  }
};
/* 18. BOMBEROS -------------------------------------------------------- */
TYPES.bomberos = {
  name: ['Bomberos', 'Firefighters'], icon: '🚒', theme: 'ciudad',
  make(c) {
    const cols = 3, rows = 2 + (c.d >= 2 ? 1 : 0), nf = Math.min(cols * rows, 3 + c.d);
    const bw = Math.min(c.W * .55, c.H * .9 * (cols / (rows + .9)) * .8), cell = bw / cols;
    const house = mk('div', 'house', '', c.stage, `width:${bw}px;height:${cell * (rows + .25) + 30}px;grid-template-columns:repeat(${cols},1fr);padding:${cell * .25}px 12px 12px`);
    mk('div', '', '', house, `position:absolute;left:-14px;right:-14px;top:-${cell * .55}px;height:${cell * .6}px;background:#b5482a;clip-path:polygon(0 100%,50% 0,100% 100%);`);
    const wins = Array.from({ length: cols * rows }, () => mk('div', 'win', '', house));
    const pets = shuf(c.r, ANIMALS);
    const fires = sample(c.r, wins, nf).map((w, i) => { w.innerHTML = `<div class="pet" style="width:${cell * .62}px;height:${cell * .62}px;opacity:.35">${animalSVG(pets[i].k, 'sad')}</div><span class="emo fire" style="font-size:${cell * .6}px">🔥</span>`; const f = w.querySelector('.fire'); f.hp = 2; f.w = w; f.an = pets[i]; f.addEventListener('pointerdown', () => spray(f)); return f; });
    const truck = mk('div', '', `<svg viewBox="0 0 220 130" width="100%"><rect x="10" y="40" width="150" height="62" rx="10" fill="#e53935" stroke="#9e1d1a" stroke-width="5"/><path d="M160 58h30l22 24v20h-52z" fill="#e53935" stroke="#9e1d1a" stroke-width="5"/><path d="M168 64h20l14 16h-34z" fill="#bfeaff"/><rect x="20" y="52" width="40" height="22" rx="4" fill="#bfeaff"/><rect x="70" y="52" width="70" height="8" fill="#ffd23f"/><path d="M30 34L140 20" stroke="#9aa5b1" stroke-width="8"/><path d="M40 33L44 21M60 31L64 19M80 28L84 16M100 25L104 14M120 23L124 12" stroke="#9aa5b1" stroke-width="4"/><circle cx="50" cy="106" r="17" fill="#2b2140"/><circle cx="50" cy="106" r="7" fill="#ccc"/><circle cx="170" cy="106" r="17" fill="#2b2140"/><circle cx="170" cy="106" r="7" fill="#ccc"/><rect x="176" y="46" width="14" height="10" rx="3" fill="#3d8bff"/></svg>`, c.stage, `position:absolute;right:3%;bottom:6%;width:${clamp(c.W * .32, 140, 320)}px`);
    const water = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); water.setAttribute('style', 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:4'); c.stage.appendChild(water);
    AU.sfx('siren');
    function spray(f) {
      if (f.out || G.finished) return; markAct(); AU.sfx('splash');
      const sr = c.stage.getBoundingClientRect(), tr = truck.getBoundingClientRect(), fr = f.getBoundingClientRect();
      const x1 = tr.left - sr.left + tr.width * .12, y1 = tr.top - sr.top + tr.height * .2, x2 = fr.left - sr.left + fr.width / 2, y2 = fr.top - sr.top + fr.height / 2;
      const pth = document.createElementNS('http://www.w3.org/2000/svg', 'path'); pth.setAttribute('d', `M${x1} ${y1}Q${(x1 + x2) / 2} ${Math.min(y1, y2) - 80} ${x2} ${y2}`); pth.setAttribute('class', 'waterjet'); water.appendChild(pth); setTimeout(() => pth.remove(), 450);
      sparkle(fr.left + fr.width / 2, fr.top + fr.height / 2, 6, ['💧', '💦']);
      f.hp--; f.style.transform = `scale(${.4 + f.hp * .3})`;
      if (f.hp <= 0) { f.out = true; f.remove(); const pt = f.w.querySelector('.pet'); pt.style.opacity = '1'; pt.innerHTML = animalSVG(f.an.k, 'joy'); bump(pt); AU.sfx('ok'); if (fires.every(x => x.out)) { VO.say(L('¡Apagaste el fuego! ¡Todos a salvo!', 'You put out the fire! Everyone is safe!'), false); setTimeout(c.done, 900); } }
    }
    c.say(L('¡Apaga el fuego! Toca las llamas para echar agua', 'Put out the fire! Tap the flames to spray water'));
    c.hint = () => fires.find(f => !f.out); c.solve = () => fires.forEach(f => { while (!f.out) spray(f); });
  }
};
/* 19. TÚNEL DEL CONEJO ------------------------------------------------ */
TYPES.tunel = {
  name: ['Túnel del conejo', 'Bunny tunnel'], icon: '🥕', theme: 'cielo',
  make(c) {
    c.noRestart = true;
    const top = c.H * .19, W = c.W, H = c.H - top, U = unit(c);
    const cv = mk('canvas', '', null, c.stage, `position:absolute;left:0;top:${top}px;width:${W}px;height:${H}px;touch-action:none;z-index:1`); cv.width = W; cv.height = H; const x = cv.getContext('2d', { willReadFrequently: true });
    const gr = x.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#9a6532'); gr.addColorStop(1, '#6b4220'); x.fillStyle = gr; x.fillRect(0, 0, W, H); x.fillStyle = '#5fc24f'; x.fillRect(0, 0, W, 10);
    const R0 = rng(5); for (let i = 0; i < 260; i++) { x.fillStyle = R0() < .5 ? 'rgba(60,30,10,.35)' : 'rgba(180,120,60,.3)'; x.beginPath(); x.arc(R0() * W, R0() * H, 2 + R0() * 6, 0, 7); x.fill(); }
    for (let i = 0; i < 8; i++) { x.fillStyle = '#9a9488'; x.beginPath(); x.ellipse(R0() * W, 20 + R0() * H, 14 + R0() * 16, 10 + R0() * 10, R0(), 0, 7); x.fill(); }
    const left = c.r() < .5, sx = left ? W * .12 : W * .88, sy = H * .14, ex = left ? W * .82 : W * .18, ey = H * .78, rad = clamp(U * .065, 22, 46);
    x.globalCompositeOperation = 'destination-out';
    const hole = (px, py, r) => { x.beginPath(); x.arc(px, py, r, 0, 7); x.fill(); };
    hole(sx, sy, rad * 1.5); hole(ex, ey, rad * 1.9); for (let k = 0; k < 6; k++) hole(sx, sy - k * 12, rad * 1.2);
    const crate = emoEl('🥕', clamp(U * .1, 40, 80), c.stage, `position:absolute;left:${sx}px;top:${top + sy}px;transform:translate(-50%,-60%) rotate(${left ? -20 : 20}deg);z-index:2;pointer-events:none`);
    const bs = clamp(U * .2, 70, 140), bunny = mk('div', '', animalSVG('conejo', 'sad'), c.stage, `position:absolute;left:${ex - bs / 2}px;top:${top + ey - bs * .6}px;width:${bs}px;height:${bs}px;z-index:2;pointer-events:none;animation:bob 2s infinite`);
    mk('div', '', '', c.stage, `position:absolute;left:0;right:0;top:0;height:${top}px;z-index:0`);
    const tool = emoEl('⛏️', 48, c.stage, 'position:absolute;pointer-events:none;display:none;z-index:3;transform:translate(-20%,-70%)');
    let digging = false, lp = null, done = false;
    const dig = e => { const r = cv.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top; tool.style.display = ''; tool.style.left = px + 'px'; tool.style.top = top + py + 'px'; if (lp) { const dx = px - lp[0], dy = py - lp[1], st = Math.max(1, Math.hypot(dx, dy) / (rad * .4)); for (let i = 1; i <= st; i++) hole(lp[0] + dx * i / st, lp[1] + dy * i / st, rad); } else hole(px, py, rad); lp = [px, py]; if (Math.random() < .3) AU.sfx('scrub'); markAct(); };
    cv.addEventListener('pointerdown', e => { digging = true; lp = null; try { cv.setPointerCapture(e.pointerId); } catch (er) {} dig(e); });
    cv.addEventListener('pointermove', e => { if (digging) dig(e); });
    cv.addEventListener('pointerup', () => { digging = false; lp = null; tool.style.display = 'none'; check(); });
    const GX = 32, GY = 22;
    function path() {
      const img = x.getImageData(0, 0, W, H).data, open = (gx, gy) => { const px = Math.floor((gx + .5) * W / GX), py = Math.floor((gy + .5) * H / GY); return img[(py * W + px) * 4 + 3] < 60; };
      const s = [Math.floor(sx / W * GX), Math.floor(sy / H * GY)], e = [Math.floor(ex / W * GX), Math.floor(ey / H * GY)];
      const prev = new Map(), q = [s], key = p => p[0] + ',' + p[1]; prev.set(key(s), null);
      while (q.length) { const p = q.shift(); if (Math.abs(p[0] - e[0]) <= 1 && Math.abs(p[1] - e[1]) <= 1) { const out = []; let k = key(p); while (k) { out.unshift(k.split(',').map(Number)); k = prev.get(k); } return out; } for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) { const n = [p[0] + dx, p[1] + dy]; if (n[0] < 0 || n[1] < 0 || n[0] >= GX || n[1] >= GY || prev.has(key(n)) || !open(n[0], n[1])) continue; prev.set(key(n), key(p)); q.push(n); } }
      return null;
    }
    function check() {
      if (done) return; const p = path(); if (!p) return; done = true; AU.sfx('whoosh');
      let i = 0; crate.style.transition = 'left .045s linear, top .045s linear';
      const roll = () => { if (i >= p.length) { crate.remove(); AU.sfx('chomp'); bunny.innerHTML = animalSVG('conejo', 'joy'); bump(bunny); sparkleEl(bunny, 14); VO.say(L('¡Ñam! ¡El conejo tiene sus zanahorias!', 'Yum! The bunny got its carrots!'), false); setTimeout(c.done, 900); return; } crate.style.left = (p[i][0] + .5) * W / GX + 'px'; crate.style.top = top + (p[i][1] + .5) * H / GY + 'px'; i++; setTimeout(roll, 45); };
      roll();
    }
    const timer = setInterval(() => { if (digging) check(); }, 400); c.cleanup = () => clearInterval(timer);
    c.say(L('Cava un túnel para llevarle las zanahorias al conejo', 'Dig a tunnel to bring the carrots to the bunny'));
    c.hint = () => done ? null : crate;
    c.solve = () => { for (let i = 0; i <= 30; i++) hole(sx + (ex - sx) * i / 30, sy + (ey - sy) * i / 30, rad); check(); };
  }
};
/* 20. ENCAJAR FORMAS -------------------------------------------------- */
TYPES.formas = {
  name: ['Encaja formas', 'Shape puzzle'], icon: '🔺', theme: 'madera',
  make(c) {
    const n = [3, 3, 4, 5, 6][c.d], shapes = sample(c.r, SHAPES, n), sz = clamp(Math.min(c.W / (n + 1), c.H * .3) * .9, 54, 150);
    const board = mk('div', 'woodboard', '', c.stage);
    const tray = mk('div', '', '', c.stage, 'position:absolute;left:4%;right:4%;bottom:5%;height:40%;display:flex;align-items:center;justify-content:space-around');
    const sv = (s, fill, stroke, extra = '') => `<svg viewBox="-4 -4 108 108" width="100%" style="display:block"><path d="${s.p}" fill="${fill}" stroke="${stroke}" stroke-width="5" stroke-linejoin="round" ${extra}/></svg>`;
    const holes = shapes.map(s => { const h = mk('div', '', sv(s, 'rgba(90,50,10,.55)', '#7a4a14', 'stroke-dasharray="6 5"'), board, `width:${sz}px`); h.s = s; return h; });
    const pieces = shuf(c.r, shapes).map((s, i) => { const col = COLORS[(i * 3 + 2) % 8]; const p = mk('div', '', sv(s, col.h, col.d), tray, `width:${sz * .92}px;cursor:grab;position:relative;filter:drop-shadow(0 6px 0 rgba(0,0,0,.15))`); p.s = s; p.col = col; draggable(p, { targets: () => holes.filter(h => !h.ok), onDrop: (h, p) => drop(h, p) }); return p; });
    function drop(h, p) {
      if (h.s !== p.s) { VO.say(L(`Ese es ${the(p.s)}`, `That is the ${p.s.en}`), false); return false; }
      h.ok = true; p._locked = true; p.style.visibility = 'hidden'; h.innerHTML = sv(h.s, p.col.h, p.col.d); bump(h); AU.sfx('ok'); sparkleEl(h, 8); VO.say(cap(nm(h.s)), false);
      if (holes.every(x => x.ok)) setTimeout(c.done, 500); return true;
    }
    c.say(L('Pon cada forma en su lugar', 'Put each shape in its place'));
    c.hint = () => pieces.find(p => !p._locked); c.solve = () => pieces.forEach(p => { if (!p._locked) drop(holes.find(h => h.s === p.s), p); });
  }
};
