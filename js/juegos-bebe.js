/* =====================================================================
   PIPO JUEGA · JUEGOS PARA LOS MÁS PEQUEÑOS (2 años) · v4
   Grandes, de una sola acción y sin forma de "perder":
   tocar y ver magia · ¿dónde está? · llevar a su lugar · frotar y descubrir ·
   pintar con un toque · encajar · atrapar lo que se mueve · clasificar en 2
===================================================================== */
const BEBE = [];
function bReg(key, name, icon, theme, make) { mReg(key, name, icon, theme, make); BEBE.push(key); }
const bArt = (k, mood = 'happy', pct = 92) => `<span class="art" style="width:${pct}%;height:${pct}%">${animalSVG(k, mood)}</span>`;
const bAn = k => ANIMALS.find(a => a.k === k) || { k, n: k, en: k, a: 'el' };
const chirp = () => [0, .12, .24].forEach(t => AU.tone(2200 + Math.random() * 600, .08, 'sine', .12, t, 2900));
const giggle = () => [0, 1, 2, 3].forEach(i => AU.tone(520 + i * 110, .12, 'triangle', .14, i * .09));
const roar = () => AU.voc({ type: 'sawtooth', f: [[0, 140], [.4, 90], [1, 70]], dur: .8, vol: .2, filt: ['lowpass', 700, 2], vib: [18, 10] });
const drum = () => { AU.noise(.22, .6, 140, 0, 1, 'lowpass'); AU.tone(90, .28, 'sine', .45, 0, 50); };
const bell = i => { const f = 523 * Math.pow(2, [0, 2, 4, 7, 9, 12][i % 6] / 12); AU.tone(f, 1.2, 'sine', .22); AU.tone(f * 2.76, .6, 'sine', .05); };

/* ---------- MOTOR B1 · TOCAR Y VER MAGIA ----------
   gen(c) → { say, good, items:[{html, after, sound, fx, gone, say, x, y, taps}], scene(c), size(c), end(c), done1(el, c) } */
function bTap(key, name, icon, theme, gen) {
  bReg(key, name, icon, theme, function (c) {
    const g = gen(c), n = g.items.length; let got = 0;
    if (g.scene) mk('div', '', g.scene(c), c.stage, 'position:absolute;inset:0;z-index:0;pointer-events:none');
    let pos, s;
    if (g.items[0].x != null) { pos = g.items.map(it => [it.x * c.W, it.y * c.H]); s = g.size ? g.size(c) : clamp(unit(c) * .17, 56, 150); }
    else {
      const t0 = c.H * (g.top || .1), t1 = c.H * (g.bottom || .84), cols = Math.max(1, Math.round(Math.sqrt(n * c.W / (t1 - t0)))), rows = Math.ceil(n / cols), cw = c.W * .92 / cols, ch = (t1 - t0) / rows;
      s = g.size ? g.size(c) : clamp(Math.min(cw, ch) * .76, 64, 210);
      pos = g.items.map((_, i) => { const r = Math.floor(i / cols), inRow = Math.min(cols, n - r * cols); return [c.W / 2 + (i % cols - (inRow - 1) / 2) * cw + (c.r() - .5) * cw * .12, t0 + (r + .5) * ch + (c.r() - .5) * ch * .12]; });
    }
    const els = g.items.map((it, i) => {
      const [x, y] = pos[i], el = mk('div', 'btap', it.html, c.stage, `left:${x - s / 2}px;top:${y - s / 2}px;width:${s}px;height:${s}px;font-size:${s * .78}px;animation-delay:${i * .07}s;${it.style || ''}`);
      el.it = it; el.taps = 0; el.addEventListener('pointerdown', () => tap(el)); return el;
    });
    function tap(el) {
      if (G.finished || el.done) return; markAct(); el.taps++; const it = el.it;
      if (it.sound) it.sound(el); else AU.sfx('pop');
      bump(el, it.fx || g.fx || 'squash');
      if (el.taps < (it.taps || g.taps || 1)) { if (g.onTap) g.onTap(el, el.taps); return; }
      el.done = true; if (it.after != null) el.innerHTML = it.after; sparkleEl(el, 8); got++;
      if (g.done1) g.done1(el, c); if (it.say) VO.say(it.say, false);
      const gone = it.gone || g.gone; if (gone) setTimeout(() => el.classList.add(gone), 350);
      if (got === n) { setTimeout(() => { if (G.ctx !== c) return; if (g.end) g.end(c, els); VO.say(g.good || L('¡Muy bien!', 'Great job!'), false); }, 750); setTimeout(c.done, g.endWait || 1700); }
    }
    c.say(g.say);
    c.hint = () => els.find(e => !e.done); c.solve = () => els.forEach(e => { for (let k = 0; k < 12 && !e.done; k++) tap(e); });
  });
}
const boxSV = col => `<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M10 34H90V92H10Z" fill="${col.h}" stroke="${col.d}" stroke-width="4" stroke-linejoin="round"/><path d="M4 22H96V38H4Z" fill="${col.h}" stroke="${col.d}" stroke-width="4" stroke-linejoin="round"/><rect x="44" y="22" width="12" height="70" fill="#fff" opacity=".8"/><text x="50" y="76" text-anchor="middle" font-size="34" font-weight="800" fill="#fff" font-family="Baloo 2,Arial">?</text></svg>`;
const doorSV = col => `<svg viewBox="0 0 80 110" width="80%" height="100%"><rect x="4" y="4" width="72" height="104" rx="34" ry="30" fill="${col.h}" stroke="${col.d}" stroke-width="5"/><rect x="16" y="20" width="48" height="30" rx="14" fill="#fff" opacity=".35"/><circle cx="60" cy="64" r="5" fill="#ffd23f" stroke="#d19b00" stroke-width="2"/></svg>`;
const winSV = (lit, k) => `<div style="width:100%;height:100%;border-radius:14px;border:6px solid #fff;background:${lit ? 'radial-gradient(circle,#fff6b0,#ffd23f)' : 'linear-gradient(#2a3a7a,#1b2450)'};display:flex;align-items:flex-end;justify-content:center;overflow:hidden;box-shadow:inset 0 0 0 3px rgba(0,0,0,.15)">${lit ? `<span class="art" style="width:82%;height:82%">${animalSVG(k, 'joy')}</span>` : ''}</div>`;

bTap('cucu', ['¡Cucú!', 'Peekaboo!'], '🙈', 'dulce', c => { const ks = sample(c.r, SND_K, [2, 3, 3, 4, 4][c.d]), cs = sample(c.r, COLORS, ks.length);
  return { say: L('¿Quién está en las cajas? ¡Tócalas!', "Who's in the boxes? Tap them!"), good: L('¡Los encontraste a todos!', 'You found them all!'), fx: 'jumpup',
    items: ks.map((k, i) => ({ html: boxSV(cs[i]), after: bArt(k, 'joy'), sound: () => { AU.sfx('magic'); setTimeout(() => AU.animal(k), 250); }, say: L(`¡Cucú! ${cap(the(bAn(k)))}`, `Peekaboo! ${cap(the(bAn(k)))}`) })) }; });
bTap('puertas', ['Toc, toc', 'Knock knock'], '🚪', 'ciudad', c => { const ks = sample(c.r, SND_K, [2, 3, 3, 4, 4][c.d]), cs = sample(c.r, COLORS, ks.length);
  return { say: L('Toc, toc. ¿Quién vive aquí? Toca las puertas', 'Knock knock. Who lives here? Tap the doors'), good: L('¡Hola, amigos!', 'Hello, friends!'),
    items: ks.map((k, i) => ({ html: doorSV(cs[i]), after: bArt(k, 'joy', 86), sound: () => { AU.sfx('tap'); setTimeout(() => AU.animal(k), 300); }, say: L(`¡Hola, ${bAn(k).n}!`, `Hello, ${bAn(k).en}!`) })) }; });
bTap('luces', ['Prende las luces', 'Lights on'], '💡', 'noche', c => { const n = [2, 4, 4, 6, 6][c.d], cols = n <= 2 ? 2 : n === 4 ? 2 : 3, rows = Math.ceil(n / cols), ks = shuf(c.r, Object.keys(AN));
  const hx0 = .5 - (c.W > c.H ? .26 : .42), hx1 = 1 - hx0, hy0 = .28, hy1 = .9;
  return { say: L('Está oscuro. Toca las ventanas para prender la luz', 'It is dark. Tap the windows to turn on the lights'), good: L('¡La casa está llena de luz!', 'The house is full of light!'),
    size: c2 => Math.min((hx1 - hx0) * c2.W / cols, (hy1 - hy0) * c2.H / rows) * .62,
    scene: c2 => `<div style="position:absolute;left:${hx0 * 100}%;right:${hx0 * 100}%;top:${hy0 * 100}%;bottom:${(1 - hy1) * 100}%;background:linear-gradient(#ffb27a,#e98a52);border:6px solid #a8481b;border-radius:10px;box-shadow:0 14px 0 rgba(0,0,0,.18)"></div><svg viewBox="0 0 100 30" preserveAspectRatio="none" style="position:absolute;left:${(hx0 - .04) * 100}%;width:${(hx1 - hx0 + .08) * 100}%;top:${(hy0 - .17) * 100}%;height:${.18 * 100}%"><path d="M0 30L50 0L100 30Z" fill="#e9573f" stroke="#a8481b" stroke-width="2"/></svg>`,
    items: mRange(0, n - 1).map(i => ({ x: hx0 + (hx1 - hx0) * ((i % cols) + .5) / cols, y: hy0 + (hy1 - hy0) * (Math.floor(i / cols) + .5) / rows, html: winSV(false), after: winSV(true, ks[i]), sound: () => { AU.sfx('zap'); AU.note(i % 8, .3); } })) }; });
bTap('adormir', ['A dormir', 'Bedtime'], '😴', 'noche', c => { const ks = sample(c.r, Object.keys(AN), [2, 3, 4, 4, 5][c.d]);
  return { say: L('Es de noche. Toca a cada animalito para que se duerma', 'It is night time. Tap each animal so it falls asleep'), good: L('Shhh... todos duermen. ¡Buenas noches!', 'Shhh... everyone is asleep. Good night!'), fx: 'squash',
    items: ks.map((k, i) => ({ html: bArt(k, 'happy'), after: `${bArt(k, 'sleepy')}<span class="zz">z<small>z</small></span>`, sound: () => AU.tone(392 - i * 30, .6, 'sine', .14, 0, 300), say: L('Buenas noches', 'Good night') })) }; });
bTap('despertar', ['¡Buenos días!', 'Good morning!'], '🌅', 'cielo', c => { const ks = sample(c.r, SND_K, [2, 3, 4, 4, 5][c.d]);
  return { say: L('¡Ya salió el sol! Despierta a los animalitos', 'The sun is up! Wake up the animals'), good: L('¡Buenos días a todos!', 'Good morning, everyone!'), fx: 'jumpup',
    items: ks.map(k => ({ html: bArt(k, 'sleepy'), after: bArt(k, 'joy'), sound: () => AU.animal(k), say: L('¡Buenos días!', 'Good morning!') })) }; });
bTap('estrellitas', ['Estrellitas', 'Little stars'], '⭐', 'noche', c => ({ say: L('Toca las estrellitas para que brillen', 'Tap the little stars to make them shine'), good: L('¡Qué cielo tan brillante!', 'What a bright sky!'), fx: 'spin1',
  items: mRange(0, [3, 4, 5, 6, 7][c.d] - 1).map(i => ({ html: `<span class="emo" style="filter:grayscale(1) brightness(.55)">⭐</span>`, after: `<span class="emo glow">🌟</span>`, sound: () => AU.note(i % 8, .5) })) }));
bTap('florecer', ['Flores que crecen', 'Blooming flowers'], '🌷', 'jardin', c => ({ say: L('Toca las plantitas para que salgan flores', 'Tap the little plants to make flowers bloom'), good: L('¡Un jardín lleno de flores!', 'A garden full of flowers!'), fx: 'grow',
  items: mRange(0, [3, 4, 5, 5, 6][c.d] - 1).map(i => ({ html: mE('🌱'), after: mE(pick(c.r, ['🌷', '🌻', '🌸', '🌼', '🌹', '💐'])), sound: () => { AU.sfx('magic'); AU.note(i % 8, .3); } })) }));
bTap('palomitas', ['Palomitas', 'Popcorn'], '🍿', 'cocina', c => ({ say: L('Toca los maicitos y... ¡pop! Salen palomitas', 'Tap the corn kernels and... pop! Popcorn!'), good: L('¡Ñam, ñam, palomitas!', 'Yum, popcorn!'), fx: 'jumpup', bottom: .8,
  items: mRange(0, [4, 5, 6, 7, 8][c.d] - 1).map(() => ({ html: `<svg viewBox="0 0 60 70" width="46%"><path d="M30 4C48 10 54 36 46 56Q30 70 14 56C6 36 12 10 30 4Z" fill="#ffd23f" stroke="#d19b00" stroke-width="4"/><ellipse cx="24" cy="24" rx="5" ry="9" fill="#fff" opacity=".5"/></svg>`, after: mE('🍿'), sound: () => { AU.sfx('pop'); AU.tone(900, .06, 'square', .08); } })) }));
bTap('fuegos', ['Fuegos artificiales', 'Fireworks'], '🎆', 'noche', c => ({ say: L('Toca los cohetitos para hacer fuegos artificiales', 'Tap the little rockets to make fireworks'), good: L('¡Qué lindo! ¡Oooh!', 'So pretty! Ooooh!'), top: .5, bottom: .9, gone: 'goneup',
  items: mRange(0, [3, 3, 4, 5, 5][c.d] - 1).map(() => ({ html: mE('🚀'), style: 'transform:rotate(-45deg)', sound: () => AU.sfx('whoosh') })),
  done1: (el, c2) => { const r = el.getBoundingClientRect(); setTimeout(() => { if (G.ctx === c2) { firework(r.left + r.width / 2, Math.max(60, r.top - c2.H * .45)); AU.sfx('firework'); } }, 900); } }));
bTap('hojas', ['Hojas que caen', 'Falling leaves'], '🍂', 'bosque', c => { const n = [4, 5, 6, 7, 8][c.d], land = c.W > c.H, cx = .5, cy = land ? .38 : .34, rx = land ? .22 : .34, ry = .24;
  return { say: L('Toca las hojitas del árbol para que caigan', 'Tap the leaves on the tree to make them fall'), good: L('¡Llegó el otoño!', 'Autumn is here!'), gone: 'gonedown', fx: 'wiggle', size: c2 => clamp(unit(c2) * .13, 46, 110),
    scene: c2 => `<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%"><rect x="46" y="${(cy + .1) * 100}" width="8" height="${(.9 - cy) * 100}" rx="2" fill="#8a5424"/><ellipse cx="50" cy="${cy * 100}" rx="${rx * 100 + 6}" ry="${ry * 100 + 8}" fill="#e0a238"/><ellipse cx="${50 - rx * 50}" cy="${cy * 100 + 6}" rx="${rx * 60}" ry="${ry * 60}" fill="#d48a2a"/></svg>`,
    items: mRange(0, n - 1).map(i => { const a = i / n * 6.28 + c.r() * .5, d = .35 + c.r() * .55; return { x: cx + Math.cos(a) * rx * d, y: cy + Math.sin(a) * ry * d, html: mE(pick(c.r, ['🍂', '🍁'])), sound: () => AU.sfx('whoosh') }; }) }; });
bTap('nubes', ['Sopla las nubes', 'Blow the clouds'], '☁️', 'cielo', c => { const n = [3, 4, 5, 5, 6][c.d];
  return { say: L('El sol está escondido. Toca las nubes para que se vayan', 'The sun is hiding. Tap the clouds to blow them away'), good: L('¡Salió el sol!', 'The sun came out!'), gone: 'goneright', size: c2 => clamp(unit(c2) * .3, 90, 230),
    scene: c2 => `<div id="bsun" class="emo" style="position:absolute;left:50%;top:45%;transform:translate(-50%,-50%);font-size:${unit(c2) * .42}px;filter:saturate(.4) brightness(.85);transition:filter .8s">🌞</div>`,
    items: mRange(0, n - 1).map(i => { const a = i / n * 6.28; return { x: .5 + Math.cos(a) * .16, y: .45 + Math.sin(a) * .16, html: mE('☁️'), sound: () => AU.sfx('whoosh') }; }),
    end: () => { const s = document.getElementById('bsun'); if (s) { s.style.filter = 'drop-shadow(0 0 30px #ffd23f)'; bump(s, 'spin1'); } } }; });
bTap('campanas', ['Campanitas', 'Little bells'], '🔔', 'dulce', c => ({ say: L('Toca las campanitas: ¡tilín, tilín!', 'Tap the little bells: ding, ding!'), good: L('¡Qué lindo suena!', 'That sounds lovely!'), fx: 'wiggle',
  items: mRange(0, [3, 4, 5, 6, 6][c.d] - 1).map(i => ({ html: `<span class="emo" style="filter:hue-rotate(${i * 55}deg)">🔔</span>`, sound: () => bell(i) })) }));
bTap('tambores', ['Tambores', 'Drums'], '🥁', 'madera', c => ({ say: L('¡Bum, bum! Toca los tambores', 'Boom, boom! Tap the drums'), good: L('¡Qué ritmo!', 'What a beat!'), taps: 2,
  items: mRange(0, [2, 3, 4, 4, 5][c.d] - 1).map(() => ({ html: mE('🥁'), sound: drum })) }));
bTap('granjacoro', ['Coro de la granja', 'Farm choir'], '🐮', 'granja', c => ({ say: L('Toca a cada animalito para escuchar cómo canta', 'Tap each animal to hear it sing'), good: L('¡Qué lindo coro!', 'What a lovely choir!'), fx: 'jumpup',
  items: sample(c.r, ['vaca', 'cerdito', 'oveja', 'pato', 'pollito', 'perro', 'gato'], [3, 4, 4, 5, 5][c.d]).map(k => ({ html: bArt(k), after: bArt(k, 'joy'), sound: () => AU.animal(k), say: L(cap(bAn(k).s || bAn(k).n), cap(bAn(k).se || bAn(k).en)) })) }));
bTap('selvacoro', ['Sonidos de la selva', 'Jungle sounds'], '🦁', 'bosque', c => ({ say: L('¿Cómo suenan los animales de la selva? ¡Tócalos!', 'How do jungle animals sound? Tap them!'), good: L('¡Qué fuerte suena la selva!', 'The jungle is so loud!'), fx: 'jumpup',
  items: sample(c.r, ['leon', 'mono', 'elefante', 'tigre', 'buho', 'oso'], [3, 4, 4, 5, 5][c.d]).map(k => ({ html: bArt(k), after: bArt(k, 'joy'), sound: () => AU.animal(k), say: cap(bAn(k).n) })) }));
bTap('bocinas', ['¡Pip, pip!', 'Beep beep!'], '🚗', 'ciudad', c => ({ say: L('Toca los carritos para que toquen la bocina y se vayan', 'Tap the cars to honk and drive away'), good: L('¡Chau, carritos!', 'Bye, cars!'), gone: 'goneleft', top: .4, bottom: .9,
  items: sample(c.r, ['🚗', '🚕', '🚙', '🚌', '🚓', '🚑', '🚒'], [2, 3, 4, 4, 5][c.d]).map(e => ({ html: mE(e), sound: () => AU.sfx(e === '🚓' || e === '🚑' || e === '🚒' ? 'siren' : 'horn') })) }));
bTap('gallinas', ['Gallinitas', 'Little hens'], '🐔', 'granja', c => ({ say: L('Toca a las gallinitas. ¿Qué pondrán?', 'Tap the hens. What will they lay?'), good: L('¡Cuántos huevitos!', 'So many eggs!'), fx: 'squash',
  items: mRange(0, [2, 3, 4, 4, 5][c.d] - 1).map(() => ({ html: mE('🐔'), after: `<div style="position:relative;line-height:1">${mE('🐔')}<span class="emo" style="position:absolute;right:-.15em;bottom:-.1em;font-size:.5em;animation:popin .5s">🥚</span></div>`, sound: () => { AU.animal('pollito'); setTimeout(() => AU.sfx('pop'), 300); }, say: L('¡Puso un huevito!', 'She laid an egg!') })) }));
bTap('monos', ['Monitos', 'Little monkeys'], '🐒', 'bosque', c => ({ say: L('Los monitos tienen hambre. Tócalos y les damos un plátano', 'The monkeys are hungry. Tap them to give a banana'), good: L('¡Monitos felices!', 'Happy monkeys!'), fx: 'jumpup',
  items: mRange(0, [2, 3, 4, 4, 5][c.d] - 1).map(() => ({ html: bArt('mono', 'sad'), after: `<div style="position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center">${bArt('mono', 'joy')}<span class="emo" style="position:absolute;right:0;bottom:0;font-size:.45em">🍌</span></div>`, sound: () => AU.animal('mono') })) }));
bTap('pajaritos', ['Pajaritos', 'Little birds'], '🐦', 'cielo', c => { const n = [3, 4, 5, 5, 6][c.d];
  return { say: L('Toca a los pajaritos para que canten', 'Tap the birds to make them sing'), good: L('¡Pío, pío, qué lindo!', 'Tweet tweet, lovely!'), fx: 'jumpup', size: c2 => clamp(Math.min(c2.W * .8 / n, c2.H * .2), 50, 140),
    scene: () => `<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%"><rect x="2" y="30" width="2.5" height="70" fill="#8a5424"/><rect x="95.5" y="30" width="2.5" height="70" fill="#8a5424"/><path d="M3 50Q50 62 97 50" stroke="#3a2c5c" stroke-width=".8" fill="none"/></svg>`,
    items: mRange(0, n - 1).map(i => { const x = .12 + .76 * (i + .5) / n; return { x, y: .5 + .12 * (1 - Math.pow((x - .5) / .47, 2)) - .1, html: mE('🐦'), sound: chirp }; }) }; });
const frogPad = m => `<div style="position:relative;width:100%;height:100%"><svg viewBox="0 0 100 40" style="position:absolute;left:-6%;width:112%;bottom:-4%"><ellipse cx="50" cy="20" rx="47" ry="16" fill="#4cbb4a" stroke="#2f8a35" stroke-width="3"/><path d="M50 20L95 12L92 26Z" fill="#79d2ff"/></svg><span class="art" style="position:absolute;left:8%;top:0;width:84%;height:84%">${animalSVG('rana', m)}</span></div>`;
bTap('ranas', ['Ranitas saltarinas', 'Jumping frogs'], '🐸', 'jardin', c => { const n = [2, 3, 4, 4, 5][c.d];
  return { say: L('Toca las ranitas para que salten', 'Tap the frogs to make them jump'), good: L('¡Croac, croac!', 'Ribbit, ribbit!'), fx: 'jumpup', taps: 2, size: c2 => clamp(Math.min(c2.W * .8 / n, c2.H * .28), 70, 170),
    scene: () => `<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%"><ellipse cx="50" cy="66" rx="48" ry="26" fill="#5fc4ff"/><ellipse cx="50" cy="66" rx="44" ry="22" fill="#79d2ff"/></svg>`,
    items: mRange(0, n - 1).map(i => ({ x: .14 + .72 * (i + .5) / n, y: .62 + (i % 2) * .08, html: frogPad('happy'), after: frogPad('joy'), sound: () => AU.animal('rana') })) }; });
bTap('globosvuelan', ['Globos al cielo', 'Balloons up high'], '🎈', 'cielo', c => ({ say: L('Toca los globos para que vuelen alto', 'Tap the balloons to send them up high'), good: L('¡Adiós, globitos!', 'Bye, balloons!'), gone: 'goneup', top: .3,
  items: sample(c.r, COLORS, [3, 4, 5, 5, 6][c.d]).map(col => ({ html: balloonSVG(col.h, col.d), sound: () => AU.sfx('whoosh'), say: L(cap(colorName(col)), cap(colorName(col))) })) }));
bTap('juguetes', ['Juguetes locos', 'Silly toys'], '🧸', 'madera', c => ({ say: L('Toca los juguetes para que bailen', 'Tap the toys to make them dance'), good: L('¡A jugar!', "Let's play!"), fx: 'wiggle', taps: 2,
  items: sample(c.r, ['🧸', '🤖', '🚂', '🎈', '🦖', '🎠', '🚁', '🦄', '⚽'], [3, 4, 4, 5, 6][c.d]).map(e => ({ html: mE(e), sound: () => AU.sfx('boing') })) }));
bTap('cosquillas', ['Cosquillas', 'Tickles'], '🤭', 'dulce', c => { const k = pick(c.r, Object.keys(AN)), moods = ['joy', 'wow', 'joy', 'happy'];
  return { say: L(`¡Hazle cosquillas ${the(bAn(k))}! Tócalo muchas veces`, `Tickle ${the(bAn(k))}! Tap many times`), good: L('¡Ja, ja, ja! ¡Qué risa!', 'Ha ha ha! So funny!'), taps: [4, 5, 6, 6, 7][c.d], fx: 'wiggle', size: c2 => unit(c2) * .58, top: .12, bottom: .86,
    onTap: (el, t) => { el.innerHTML = bArt(k, moods[t % 4]); }, items: [{ html: bArt(k, 'happy'), after: bArt(k, 'joy'), sound: giggle }] }; });
bTap('alegrar', ['Dales alegría', 'Cheer them up'], '😊', 'dulce', c => ({ say: L('Los animalitos están tristes. Tócalos para darles un abrazo', 'The animals are sad. Tap them to give a hug'), good: L('¡Todos están felices!', 'Everyone is happy!'), fx: 'squash',
  items: sample(c.r, Object.keys(AN), [2, 3, 4, 4, 5][c.d]).map(k => ({ html: bArt(k, 'sad'), after: bArt(k, 'joy'), sound: () => AU.sfx('magic'), say: L('¡Un abrazo!', 'A hug!') })) }));
bTap('lluvia', ['Lluvia para las flores', 'Rain for flowers'], '🌧️', 'jardin', c => { const n = [2, 3, 3, 4, 4][c.d];
  return { say: L('Las plantitas tienen sed. Toca las nubes para que llueva', 'The plants are thirsty. Tap the clouds to make it rain'), good: L('¡Gracias, lluvia!', 'Thank you, rain!'), size: c2 => clamp(Math.min(c2.W * .8 / n, c2.H * .24), 70, 170),
    items: mRange(0, n - 1).map(i => ({ x: .1 + .8 * (i + .5) / n, y: .26, html: mE('☁️'), after: mE('🌧️'), sound: () => AU.noise(1.2, .18, 3000, 0, .5, 'highpass') })),
    done1: (el, c2) => { const sr = c2.stage.getBoundingClientRect(), r = el.getBoundingClientRect(), f = emoEl(pick(Math.random, ['🌷', '🌻', '🌸']), r.width * .7, c2.stage, `position:absolute;left:${r.left - sr.left + r.width * .15}px;top:${c2.H * .62}px;z-index:2;animation:growup 1.2s ease-out both`); } }; });
bTap('xilofono', ['Xilófono', 'Xylophone'], '🎼', 'dulce', c => { const n = [5, 6, 7, 8, 8][c.d], w = Math.min(c.W * .9 / n, 110);
  return { say: L('Toca todas las teclitas de colores', 'Tap all the colorful keys'), good: L('¡Qué linda música!', 'What lovely music!'), fx: 'squash', size: () => w * .92,
    items: mRange(0, n - 1).map(i => ({ x: .5 + (i - (n - 1) / 2) * w / c.W, y: .5, html: `<div style="width:80%;height:${150 - i * 9}%;border-radius:14px;background:linear-gradient(90deg,${PAL[i % 8]},${shade(PAL[i % 8], .8)});box-shadow:inset 0 6px 0 rgba(255,255,255,.4),0 6px 0 rgba(0,0,0,.2)"></div>`, sound: () => AU.note(i, .5) })) }; });
bTap('pecesburbujas', ['Burbujas de peces', 'Fish bubbles'], '🐠', 'mar', c => ({ say: L('Toca a los pececitos para que hagan burbujas', 'Tap the fish to make bubbles'), good: L('¡Glu, glu, glu!', 'Blub blub blub!'), fx: 'wiggle',
  items: sample(c.r, COLORS, [2, 3, 4, 4, 5][c.d]).map(col => ({ html: fishSVG(col.h, col.d), sound: () => AU.sfx('pop') })),
  done1: (el, c2) => { const sr = c2.stage.getBoundingClientRect(), r = el.getBoundingClientRect(); for (let i = 0; i < 6; i++) { const b = mk('div', 'soapbub', '', c2.stage, `left:${r.left - sr.left + r.width * (.1 + Math.random() * .3)}px;top:${r.top - sr.top + r.height * .2}px;width:${14 + Math.random() * 18}px;--dy:-${120 + Math.random() * 80}px;animation-delay:${i * .12}s`); setTimeout(() => b.remove(), 2000); } } }));
bTap('dinos', ['Dinosaurios', 'Dinosaurs'], '🦖', 'bosque', c => ({ say: L('¡Despierta a los dinosaurios! Tócalos', 'Wake up the dinosaurs! Tap them'), good: L('¡Grrr! ¡Qué dinos tan simpáticos!', 'Roar! Such friendly dinos!'), fx: 'shake',
  items: mRange(0, [2, 3, 3, 4, 4][c.d] - 1).map(i => ({ html: mE(i % 2 ? '🦕' : '🦖'), sound: roar })) }));
bTap('trencito', ['El trencito', 'Little train'], '🚂', 'ciudad', c => { const n = [2, 3, 4, 4, 5][c.d], ks = sample(c.r, Object.keys(AN), n), w = Math.min(c.W * .86 / (n + 1), c.H * .26);
  return { say: L('Toca los vagones para que suban los animalitos', 'Tap the wagons so the animals get on'), good: L('¡Chu, chu! ¡Vámonos!', 'Choo choo! Let us go!'), size: () => w * .95,
    scene: c2 => `<div style="position:absolute;left:0;right:0;top:${c2.H * .5 + w * .45}px;height:10px;background:repeating-linear-gradient(90deg,#8a5424 0 14px,transparent 14px 26px),linear-gradient(#666,#666) bottom/100% 4px no-repeat"></div><div class="emo" style="position:absolute;left:${c2.W / 2 - (n / 2 + .5) * w - w * .5}px;top:${c2.H * .5 - w * .5}px;font-size:${w * .9}px;transform:scaleX(-1)">🚂</div>`,
    items: mRange(0, n - 1).map(i => ({ x: .5 + (i - (n - 1) / 2 + .5) * w / c.W, y: .5, html: `<div class="emo" style="font-size:.95em">🚃</div>`, after: `<div style="position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center"><span class="emo" style="font-size:.95em">🚃</span><span class="art" style="position:absolute;width:52%;height:52%;top:4%">${animalSVG(ks[i], 'joy')}</span></div>`, sound: () => AU.animal(ks[i]) })),
    end: (c2, els) => { AU.sfx('train'); els.forEach(e => e.classList.add('goneleft')); } }; });

/* ---------- MOTOR B2 · ¿DÓNDE ESTÁ? (2 opciones grandes) ---------- */
const E2 = (e, n, en, a = 'el') => ({ e, n, en, a });
function bWhere(key, name, icon, theme, pool, o = {}) {
  bReg(key, name, icon, theme, function (c) {
    const rounds = 3, dots = mDots(c, rounds), P = typeof pool === 'function' ? pool(c) : pool, order = shuf(c.r, P); let round = 0, btns = [], busy = false;
    const area = mk('div', '', '', c.stage, 'position:absolute;left:2%;right:2%;top:9%;bottom:12%;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;align-content:center;gap:4%');
    function next() {
      dots(round); if (round >= rounds) { c.done(); return; } busy = false;
      const t = order[round % order.length], n = [2, 2, 2, 3, 3][c.d], others = sample(c.r, P.filter(x => x !== t && (!o.same || o.same(x, t))), n - 1), opts = shuf(c.r, [t, ...others]);
      const sz = mFit(n, n, c.W * .94, c.H * .74, 260); area.innerHTML = '';
      btns = opts.map(it => { const b = mk('div', 'card choice bwhere', o.html ? o.html(it, t) : it.k ? bArt(it.k) : mE(it.e), area, `width:${sz}px;height:${sz}px;font-size:${sz * .6}px`); b.it = it; b.addEventListener('pointerdown', () => tap(b, t)); return b; });
      c.say(o.q ? o.q(t) : L(`¿Dónde está ${the(t)}?`, `Where is ${the(t)}?`)); if (o.onShow) o.onShow(t);
    }
    function tap(b, t) {
      if (G.finished || busy) return; markAct();
      if (b.it === t) { busy = true; mOk(b, o.ok ? o.ok(t) : L(`¡Aquí está ${the(t)}!`, `Here is ${the(t)}!`)); bump(b, 'jumpup'); if (t.k) AU.animal(t.k); round++; setTimeout(next, 1300); }
      else { mNo(b, o.no ? o.no(b.it, t) : L(`Ese es ${the(b.it)}. Busca ${the(t)}`, `That is ${the(b.it)}. Find ${the(t)}`)); }
    }
    next();
    c.hint = () => btns.find(b => b.it === order[round % order.length]); c.solve = () => { round = rounds; next(); };
  });
}
bWhere('dondeanimal', ['¿Dónde está el animal?', 'Find the animal'], '🐶', 'granja', ANIMALS.filter(a => AN[a.k]));
bWhere('dondefruta', ['¿Dónde está la fruta?', 'Find the fruit'], '🍎', 'cocina', FRUITS);
bWhere('dondevehiculo', ['¿Dónde está el carro?', 'Find the vehicle'], '🚌', 'ciudad', [E2('🚗', 'carro', 'car'), E2('🚌', 'bus', 'bus'), E2('🚂', 'tren', 'train'), E2('✈️', 'avión', 'airplane'), E2('🚲', 'bicicleta', 'bicycle', 'la'), E2('⛵', 'barco', 'boat'), E2('🚒', 'camión de bomberos', 'fire truck'), E2('🚁', 'helicóptero', 'helicopter'), E2('🚜', 'tractor', 'tractor'), E2('🚀', 'cohete', 'rocket')]);
bWhere('dondejuguete', ['¿Dónde está el juguete?', 'Find the toy'], '🧸', 'madera', [E2('🧸', 'osito', 'teddy bear'), E2('⚽', 'pelota', 'ball', 'la'), E2('🎈', 'globo', 'balloon'), E2('🎲', 'dado', 'die'), E2('🤖', 'robot', 'robot'), E2('🧩', 'rompecabezas', 'puzzle'), E2('🥁', 'tambor', 'drum'), E2('🎠', 'caballito', 'carousel horse')]);
bWhere('dondecomida', ['¿Dónde está la comida?', 'Find the food'], '🍕', 'cocina', [E2('🍞', 'pan', 'bread'), E2('🧀', 'queso', 'cheese'), E2('🥚', 'huevo', 'egg'), E2('🍕', 'pizza', 'pizza', 'la'), E2('🍪', 'galleta', 'cookie', 'la'), E2('🥛', 'leche', 'milk', 'la'), E2('🍦', 'helado', 'ice cream'), E2('🍰', 'pastel', 'cake'), E2('🍗', 'pollito', 'chicken')]);
bWhere('donderopa', ['¿Dónde está la ropa?', 'Find the clothes'], '👕', 'madera', [E2('👕', 'polo', 't-shirt'), E2('👖', 'pantalón', 'pants'), E2('👗', 'vestido', 'dress'), E2('🧦', 'medias', 'socks', 'las'), E2('👟', 'zapatillas', 'sneakers', 'las'), E2('🧢', 'gorra', 'cap', 'la'), E2('🧤', 'guantes', 'gloves', 'los'), E2('🧣', 'chalina', 'scarf', 'la'), E2('🧥', 'casaca', 'jacket', 'la')]);
bWhere('dondecuerpo', ['Mi carita y mi cuerpo', 'My face and body'], '👃', 'dulce', [E2('👀', 'ojos', 'eyes', 'los'), E2('👃', 'nariz', 'nose', 'la'), E2('👂', 'oreja', 'ear', 'la'), E2('👄', 'boca', 'mouth', 'la'), E2('✋', 'mano', 'hand', 'la'), E2('🦶', 'pie', 'foot'), E2('🦷', 'diente', 'tooth'), E2('💪', 'brazo', 'arm')], { ok: t => L(`¡Sí! ${cap(the(t))}`, `Yes! ${cap(the(t))}`) });
bWhere('dondecolor', ['¿Dónde está el color?', 'Find the color'], '🎨', 'dulce', COLORS.slice(0, 7), { html: it => blobSV(it, '82%'), q: t => L(`¿Dónde está el color ${colorName(t)}?`, `Where is ${colorName(t)}?`), ok: t => L(`¡${cap(colorName(t))}!`, `${cap(colorName(t))}!`), no: (x, t) => L(`Ese es ${colorName(x)}. Busca el ${colorName(t)}`, `That is ${colorName(x)}. Find ${colorName(t)}`) });
bWhere('dondeforma', ['¿Dónde está la forma?', 'Find the shape'], '🔷', 'jardin', SHAPES.slice(0, 5), { html: (it, t) => shapeSV(it, PAL[SHAPES.indexOf(it)], '78%'), q: t => L(`¿Dónde está ${the(t)}?`, `Where is the ${t.en}?`), ok: t => L(`¡${cap(the(t))}!`, `The ${t.en}!`), no: (x, t) => L(`Ese es ${the(x)}`, `That is the ${x.en}`) });
bWhere('dondegrande', ['Grande y pequeño', 'Big and small'], '🐘', 'jardin', c => ['🐻', '🍎', '🎈', '🐶', '⭐', '🌳', '🚗', '🐟'].flatMap(e => [{ e, big: 1, n: 'grande', en: 'big' }, { e, big: 0, n: 'pequeño', en: 'small' }]),
  { same: (x, t) => x.e === t.e, html: it => `<span class="emo" style="font-size:${it.big ? 1.05 : .42}em">${it.e}</span>`, q: t => t.big ? L('¿Cuál es el grande?', 'Which one is big?') : L('¿Cuál es el pequeño?', 'Which one is small?'), ok: t => t.big ? L('¡El grande!', 'The big one!') : L('¡El pequeñito!', 'The little one!'), no: (x, t) => t.big ? L('Ese es pequeño. Busca el grande', 'That one is small. Find the big one') : L('Ese es grande. Busca el pequeño', 'That one is big. Find the small one') });
bWhere('dondebichito', ['Bichitos', 'Little bugs'], '🐞', 'jardin', [E2('🐞', 'mariquita', 'ladybug', 'la'), E2('🐝', 'abeja', 'bee', 'la'), E2('🦋', 'mariposa', 'butterfly', 'la'), E2('🐛', 'gusanito', 'caterpillar'), E2('🐜', 'hormiga', 'ant', 'la'), E2('🐌', 'caracol', 'snail'), E2('🐢', 'tortuga', 'turtle', 'la')]);
bWhere('dondecasa', ['En mi casa', 'In my house'], '🏠', 'madera', [E2('🛏️', 'cama', 'bed', 'la'), E2('🚪', 'puerta', 'door', 'la'), E2('📺', 'tele', 'TV', 'la'), E2('🛋️', 'sofá', 'sofa'), E2('🛁', 'tina', 'bathtub', 'la'), E2('💡', 'foco', 'light bulb'), E2('⏰', 'reloj', 'clock'), E2('📚', 'libros', 'books', 'los')]);
bWhere('dondemar', ['Animales del mar', 'Sea animals'], '🐙', 'mar', [E2('🐟', 'pez', 'fish'), E2('🐙', 'pulpo', 'octopus'), E2('🐳', 'ballena', 'whale', 'la'), E2('🦀', 'cangrejo', 'crab'), E2('🐢', 'tortuga', 'turtle', 'la'), E2('🐬', 'delfín', 'dolphin'), E2('🦈', 'tiburón', 'shark'), E2('🐚', 'concha', 'shell', 'la')]);
bWhere('dondeclima', ['El cielo', 'The sky'], '🌈', 'cielo', [E2('☀️', 'sol', 'sun'), E2('🌧️', 'lluvia', 'rain', 'la'), E2('❄️', 'nieve', 'snow', 'la'), E2('🌈', 'arcoíris', 'rainbow'), E2('☁️', 'nube', 'cloud', 'la'), E2('⚡', 'rayo', 'lightning'), E2('🌙', 'luna', 'moon', 'la'), E2('⭐', 'estrella', 'star', 'la')]);
bWhere('dondeverdura', ['Las verduras', 'Vegetables'], '🥕', 'cocina', [E2('🥕', 'zanahoria', 'carrot', 'la'), E2('🥦', 'brócoli', 'broccoli'), E2('🌽', 'choclo', 'corn'), E2('🍅', 'tomate', 'tomato'), E2('🥔', 'papa', 'potato', 'la'), E2('🥒', 'pepino', 'cucumber'), E2('🍆', 'berenjena', 'eggplant', 'la'), E2('🥬', 'lechuga', 'lettuce', 'la')]);
bWhere('dondebano', ['En el baño', 'In the bathroom'], '🛁', 'bano', [E2('🛁', 'tina', 'bathtub', 'la'), E2('🚽', 'inodoro', 'toilet'), E2('🧻', 'papel', 'toilet paper'), E2('🧼', 'jabón', 'soap'), E2('🧴', 'champú', 'shampoo'), E2('🦆', 'patito', 'rubber duck'), E2('🧽', 'esponja', 'sponge', 'la')]);
bWhere('dondecocina', ['En la cocina', 'In the kitchen'], '🍳', 'cocina', [E2('🍳', 'sartén', 'pan', 'la'), E2('🥄', 'cuchara', 'spoon', 'la'), E2('🍴', 'tenedor', 'fork'), E2('🍽️', 'plato', 'plate'), E2('☕', 'taza', 'cup', 'la'), E2('🥛', 'vaso de leche', 'glass of milk')]);

/* ---------- MOTOR B3 · LLEVAR UNA COSA A SU LUGAR ----------
   gen(c) → { target(sz) html, items:[{html, inHtml, q, ok}], slot: css, good } */
function bCarry(key, name, icon, theme, gen) {
  bReg(key, name, icon, theme, function (c) {
    const g = gen(c), rounds = g.items.length, dots = mDots(c, rounds), land = c.W > c.H; let round = 0, item = null;
    const ts = clamp(Math.min(land ? c.W * .42 : c.W * .84, c.H * (land ? .7 : .42)), 140, 380), is = clamp(unit(c) * .27, 80, 200);
    const tx = land ? c.W * .66 : c.W / 2, ty = land ? c.H * .5 : c.H * .7, sx = land ? c.W * .2 : c.W / 2, sy = land ? c.H * .48 : c.H * .22;
    const tgt = mk('div', 'bcarry', `<div class="btgt">${g.target(ts)}</div><div class="bslot" style="${g.slot || 'left:25%;top:20%;width:50%;height:50%'}"></div>`, c.stage, `left:${tx - ts / 2}px;top:${ty - ts / 2}px;width:${ts}px;height:${ts}px`);
    const slot = tgt.querySelector('.bslot');
    const arrow = mk('div', 'barrow', '', c.stage, `left:${Math.min(sx, tx)}px;top:${Math.min(sy, ty)}px;width:${Math.abs(tx - sx) || 6}px;height:${Math.abs(ty - sy) || 6}px`);
    arrow.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M${sx < tx ? 8 : 50} ${sy < ty ? 8 : 50} L${sx < tx ? 92 : 50} ${sy < ty ? 92 : 50}" stroke="#fff" stroke-width="3" stroke-dasharray="6 6" vector-effect="non-scaling-stroke" fill="none" opacity=".8"/></svg>`;
    function next() {
      dots(round); if (round >= rounds) { c.done(); return; }
      const it = g.items[round]; if (it.tgt) tgt.querySelector('.btgt').innerHTML = it.tgt(ts);
      item = mk('div', 'bitem', it.html, c.stage, `left:${sx - is / 2}px;top:${sy - is / 2}px;width:${is}px;height:${is}px;font-size:${is * .8}px`); item.it = it;
      draggable(item, { targets: () => [tgt], onDrop: (t, e) => put(e) }); c.say(it.q || g.say);
    }
    function put(e) {
      e._locked = true; e.remove(); const it = e.it; slot.innerHTML = it.inHtml != null ? it.inHtml : it.html; if (it.tgt && it.tgtOk) tgt.querySelector('.btgt').innerHTML = it.tgtOk(ts); bump(slot, 'popin2'); bump(tgt, 'squash'); AU.sfx('ok'); if (it.sound) it.sound(); sparkleEl(tgt, 10);
      VO.say(it.ok || g.good1 || L('¡Muy bien!', 'Well done!'), false); round++;
      setTimeout(() => { if (G.ctx !== c) return; if (round < rounds && !g.keep) slot.innerHTML = ''; next(); }, 1400); return true;
    }
    next();
    c.hint = () => item && !item._locked ? item : null; c.solve = () => { round = rounds; next(); };
  });
}
const bedSV = sz => `<svg viewBox="0 0 120 100" width="${sz}" height="${sz}"><rect x="8" y="30" width="10" height="64" rx="4" fill="#a8641b"/><rect x="102" y="46" width="10" height="48" rx="4" fill="#a8641b"/><rect x="12" y="58" width="96" height="22" rx="6" fill="#ff9ec8" stroke="#d4407f" stroke-width="3"/><rect x="14" y="48" width="30" height="14" rx="7" fill="#fff" stroke="#ddd" stroke-width="2"/><path d="M44 52H106V64H44Z" fill="#9fdcff" stroke="#3d8bff" stroke-width="2.5"/></svg>`;
bCarry('acostar', ['A la camita', 'Off to bed'], '🛏️', 'noche', c => { const ks = sample(c.r, Object.keys(AN), 3);
  return { target: bedSV, slot: 'left:14%;top:14%;width:40%;height:40%', say: L('Lleva al animalito a su camita', 'Take the animal to its bed'),
    items: ks.map(k => ({ html: bArt(k, 'sleepy', 100), inHtml: bArt(k, 'sleepy', 100), q: L(`${cap(the(bAn(k)))} tiene sueño. Llévalo a la camita`, `${cap(the(bAn(k)))} is sleepy. Take it to bed`), ok: L('Shhh... ¡a dormir!', 'Shhh... sleep tight!'), sound: () => AU.tone(330, .8, 'sine', .12, 0, 220) })) }; });
bCarry('pezagua', ['Pececitos al agua', 'Fish in the water'], '🐟', 'mar', c => ({ target: sz => `<svg viewBox="0 0 100 100" width="${sz}" height="${sz}"><path d="M14 30Q4 60 20 84Q50 100 80 84Q96 60 86 30Z" fill="#8fdcff" stroke="#fff" stroke-width="5"/><path d="M16 46Q50 54 84 46" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/><ellipse cx="50" cy="30" rx="36" ry="7" fill="none" stroke="#fff" stroke-width="5"/></svg>`, slot: 'left:24%;top:40%;width:52%;height:40%',
  say: L('Lleva al pececito a la pecera', 'Put the fish in the fishbowl'), items: sample(c.r, COLORS, 3).map(col => ({ html: fishSVG(col.h, col.d), ok: L('¡Glu, glu! ¡Al agua!', 'Splash! Into the water!'), sound: () => AU.sfx('splash') })) }));
bCarry('garaje', ['Al garaje', 'Into the garage'], '🚗', 'ciudad', c => ({ target: sz => `<svg viewBox="0 0 100 100" width="${sz}" height="${sz}"><path d="M6 40L50 8L94 40V94H6Z" fill="#ffcf8a" stroke="#a8481b" stroke-width="4"/><rect x="18" y="44" width="64" height="50" fill="#5b606b"/>${[0, 1, 2, 3].map(i => `<rect x="18" y="${46 + i * 6}" width="64" height="2" fill="#7a808c"/>`).join('')}</svg>`, slot: 'left:20%;top:52%;width:60%;height:40%',
  say: L('Lleva el carrito al garaje', 'Take the car to the garage'), items: sample(c.r, COLORS, 3).map(col => ({ html: carSV(col), ok: L('¡Bien estacionado!', 'Parked!'), sound: () => AU.sfx('horn') })) }));
bCarry('nido', ['Al nido', 'Back to the nest'], '🐣', 'bosque', c => ({ target: sz => `<svg viewBox="0 0 100 100" width="${sz}" height="${sz}"><rect x="0" y="60" width="100" height="10" rx="5" fill="#8a5424"/><path d="M12 56Q50 92 88 56Z" fill="#c98a2b" stroke="#8a5424" stroke-width="4"/><path d="M16 60Q50 70 84 60M20 66Q50 78 80 66" stroke="#8a5424" stroke-width="2.5" fill="none"/></svg>`, slot: 'left:28%;top:22%;width:44%;height:42%',
  say: L('El pajarito quiere volver a su nido', 'The bird wants to go back to its nest'), items: ['🐦', '🐥', '🐤'].map(e => ({ html: mE(e), ok: L('¡Pío, pío! ¡En casita!', 'Tweet! Home sweet home!'), sound: chirp })) }));
bCarry('abejaflor', ['Abejita a la flor', 'Bee to the flower'], '🐝', 'jardin', c => ({ target: sz => flowerSV(COLORS[pick(c.r, [0, 5, 6])], sz + 'px'), slot: 'left:30%;top:22%;width:40%;height:36%',
  say: L('Lleva a la abejita a la flor', 'Take the bee to the flower'), items: [1, 2, 3].map(() => ({ html: mE('🐝'), ok: L('¡Bzzz! ¡Qué rico néctar!', 'Buzz! Yummy nectar!'), sound: () => AU.voc({ type: 'sawtooth', f: [[0, 220], [1, 240]], dur: .6, vol: .08, vib: [30, 15], filt: ['lowpass', 900, 1] }) })) }));
bCarry('casitas', ['A su casita', 'Home sweet home'], '🏡', 'jardin', c => ({ target: sz => houseNum('', sz), slot: 'left:30%;top:52%;width:40%;height:40%', keep: false,
  say: L('Lleva al animalito a su casita', 'Take the animal home'), items: sample(c.r, ['perro', 'gato', 'conejo', 'raton', 'cerdito'], 3).map(k => ({ html: bArt(k, 'happy', 100), inHtml: bArt(k, 'joy', 100), ok: L('¡Ya está en casa!', 'Home at last!'), sound: () => AU.animal(k) })) }));
const binSV = sz => `<svg viewBox="0 0 100 100" width="${sz}" height="${sz}"><path d="M18 30H82L76 94H24Z" fill="#4cbb4a" stroke="#2f8a35" stroke-width="4"/><rect x="12" y="20" width="76" height="12" rx="4" fill="#3aa13a"/><path d="M40 52l10-10 10 10M50 42v26" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`;
bCarry('basura', ['Al tacho', 'In the bin'], '🗑️', 'ciudad', c => ({ target: binSV, slot: 'left:30%;top:4%;width:40%;height:30%', say: L('Ayuda a limpiar: lleva la basura al tacho', 'Help clean up: put the trash in the bin'),
  items: sample(c.r, ['🍌', '📰', '🥤', '📦', '🍂'], 3).map(e => ({ html: mE(e), ok: L('¡Todo limpio!', 'All clean!'), sound: () => AU.sfx('drop') })) }));
bCarry('lavadora', ['A lavar la ropa', 'Laundry time'], '👕', 'bano', c => ({ target: sz => `<svg viewBox="0 0 100 100" width="${sz}" height="${sz}"><rect x="10" y="6" width="80" height="90" rx="10" fill="#eef4fb" stroke="#9aa3ad" stroke-width="4"/><rect x="10" y="6" width="80" height="16" rx="8" fill="#d6e0ea"/><circle cx="24" cy="14" r="3.5" fill="#ff5f7a"/><circle cx="50" cy="58" r="28" fill="#8fdcff" stroke="#9aa3ad" stroke-width="5"/><path d="M30 64Q50 52 70 64" stroke="#fff" stroke-width="4" fill="none"/></svg>`, slot: 'left:32%;top:40%;width:36%;height:36%',
  say: L('La ropa está sucia. ¡A la lavadora!', 'The clothes are dirty. Into the washer!'), items: sample(c.r, ['👕', '👗', '🧦', '👖', '🧢'], 3).map(e => ({ html: mE(e), ok: L('¡Shhh, shhh, a lavar!', 'Swish swish, washing!'), sound: () => AU.sfx('splash') })) }));
bCarry('buzon', ['El buzón', 'The mailbox'], '📮', 'ciudad', c => ({ target: sz => `<svg viewBox="0 0 100 100" width="${sz}" height="${sz}"><rect x="44" y="60" width="12" height="38" fill="#8a5424"/><path d="M14 30Q14 10 40 10H60Q86 10 86 30V64H14Z" fill="#ff4d4d" stroke="#b02a2a" stroke-width="4"/><rect x="28" y="30" width="44" height="8" rx="4" fill="#2b2140"/><rect x="82" y="22" width="4" height="22" fill="#ffd23f"/></svg>`, slot: 'left:30%;top:6%;width:40%;height:26%',
  say: L('Lleva la carta al buzón', 'Take the letter to the mailbox'), items: [1, 2, 3].map(i => ({ html: envNum(i), ok: L('¡Carta enviada!', 'Letter sent!'), sound: () => AU.sfx('drop') })) }));
bCarry('canasta', ['¡Encesta!', 'Shoot hoops!'], '🏀', 'jardin', c => ({ target: sz => `<svg viewBox="0 0 100 100" width="${sz}" height="${sz}"><rect x="10" y="4" width="80" height="50" rx="6" fill="#fff" stroke="#ff6fa8" stroke-width="4"/><rect x="34" y="18" width="32" height="24" fill="none" stroke="#ff6fa8" stroke-width="3"/><ellipse cx="50" cy="56" rx="22" ry="5" fill="none" stroke="#ff7a1a" stroke-width="5"/><path d="M30 56L36 86H64L70 56M38 58L44 86M62 58L56 86M48 58V86" stroke="#ccc" stroke-width="2" fill="none"/></svg>`, slot: 'left:32%;top:46%;width:36%;height:36%',
  say: L('Lleva la pelota a la canasta', 'Put the ball in the hoop'), items: ['🏀', '⚽', '🎾'].map(e => ({ html: mE(e), ok: L('¡Encestaste!', 'You scored!'), sound: () => AU.sfx('win') })) }));
bCarry('monstruo', ['Monstruo comegalletas', 'Cookie monster'], '🍪', 'dulce', c => ({ target: sz => `<svg viewBox="0 0 100 100" width="${sz}" height="${sz}"><circle cx="50" cy="56" r="42" fill="#5fa8ff" stroke="#2f6fcf" stroke-width="4"/><circle cx="34" cy="30" r="13" fill="#fff" stroke="#2b2140" stroke-width="3"/><circle cx="66" cy="30" r="13" fill="#fff" stroke="#2b2140" stroke-width="3"/><circle cx="36" cy="32" r="6" fill="#2b2140"/><circle cx="64" cy="28" r="6" fill="#2b2140"/><path d="M22 62Q50 92 78 62Z" fill="#3a1030"/></svg>`, slot: 'left:34%;top:58%;width:32%;height:28%',
  say: L('El monstruo tiene hambre. Dale una galleta', 'The monster is hungry. Give it a cookie'), items: ['🍪', '🧁', '🍩'].map(e => ({ html: mE(e), inHtml: '', ok: L('¡Ñam, ñam, ñam!', 'Nom nom nom!'), sound: () => AU.sfx('chomp') })) }));
bCarry('cajajuguetes', ['Guarda los juguetes', 'Toy box'], '📦', 'madera', c => ({ target: sz => `<svg viewBox="0 0 100 100" width="${sz}" height="${sz}"><rect x="8" y="40" width="84" height="54" rx="6" fill="#ff9a3c" stroke="#c96a12" stroke-width="4"/><path d="M8 40L18 20H82L92 40" fill="#ffb366" stroke="#c96a12" stroke-width="4"/><circle cx="50" cy="66" r="10" fill="#ffd23f" stroke="#c96a12" stroke-width="3"/></svg>`, slot: 'left:28%;top:6%;width:44%;height:36%',
  say: L('Guarda el juguete en la caja', 'Put the toy in the box'), items: sample(c.r, ['🧸', '🚂', '🎲', '🤖', '🦖', '⚽'], 3).map(e => ({ html: mE(e), ok: L('¡Guardado!', 'Put away!'), sound: () => AU.sfx('drop') })) }));
const FOODOF2 = [['conejo', '🥕'], ['mono', '🍌'], ['raton', '🧀'], ['perro', '🦴'], ['gato', '🐟'], ['panda', '🎋'], ['oso', '🍯'], ['pollito', '🌽']];
bCarry('comidita', ['Dale de comer', 'Feed me'], '🥕', 'granja', c => { const fs = sample(c.r, FOODOF2, 3); let i = 0;
  const face = (k, m) => sz => `<div style="width:${sz}px;height:${sz}px;display:flex;align-items:center;justify-content:center">${bArt(k, m, 84)}</div>`;
  return { target: face(fs[0][0], 'sad'), slot: 'left:34%;top:62%;width:32%;height:30%', say: '',
    items: fs.map(f => ({ tgt: face(f[0], 'sad'), tgtOk: face(f[0], 'joy'), html: mE(f[1]), inHtml: '', q: L(`${cap(the(bAn(f[0])))} tiene hambre. Dale su comida`, `${cap(the(bAn(f[0])))} is hungry. Give it food`), ok: L('¡Ñam! ¡Gracias!', 'Yum! Thank you!'), sound: () => { AU.sfx('chomp'); setTimeout(() => AU.animal(f[0]), 300); } })) };
});
bCarry('sombreros', ['Ponle un sombrero', 'Hat time'], '🎩', 'dulce', c => { const k = pick(c.r, Object.keys(AN));
  return { target: sz => `<div style="width:${sz}px;height:${sz}px;display:flex;align-items:flex-end;justify-content:center">${bArt(k, 'joy', 78)}</div>`, slot: 'left:28%;top:0;width:44%;height:30%',
    say: L(`Ponle un sombrero ${the(bAn(k)).replace(/^el /, 'al ').replace(/^la /, 'a la ')}`, `Put a hat on ${the(bAn(k))}`), items: ['🎩', '👒', '👑'].map(e => ({ html: mE(e), ok: L('¡Qué elegante!', 'So fancy!'), sound: () => AU.sfx('magic') })) }; });

/* ---------- MOTOR B4 · FROTA Y DESCUBRE ---------- */
function bScratch(key, name, icon, theme, gen) {
  bReg(key, name, icon, theme, function (c) {
    c.noRestart = true; const g = gen(c), rounds = 2, dots = mDots(c, rounds), S = Math.floor(Math.min(c.W * .82, c.H * .74)); let round = 0, cv = null, x = null, on = false, cleared = false, lp = null;
    const box = mk('div', 'card bscratch', '', c.stage, `position:absolute;left:${(c.W - S) / 2}px;top:${c.H * .08}px;width:${S}px;height:${S}px;overflow:hidden;z-index:2`);
    function next() {
      dots(round); if (round >= rounds) { c.done(); return; } cleared = false;
      const it = g.items[round]; box.innerHTML = `<div style="position:absolute;inset:6%;display:flex;align-items:center;justify-content:center;font-size:${S * .6}px">${it.html}</div>`;
      cv = mk('canvas', '', null, box, `position:absolute;inset:0;width:${S}px;height:${S}px;touch-action:none;transition:opacity .6s`); cv.width = S; cv.height = S; x = cv.getContext('2d', { willReadFrequently: true }); g.cover(x, S, c.r);
      x.globalCompositeOperation = 'destination-out'; x.lineCap = x.lineJoin = 'round'; x.lineWidth = S * .17;
      cv.addEventListener('pointerdown', e => { on = true; lp = null; try { cv.setPointerCapture(e.pointerId); } catch (er) {} rub(e); });
      cv.addEventListener('pointermove', e => { if (on || (e.pointerType === 'mouse' && e.buttons)) rub(e); });
      cv.addEventListener('pointerup', () => { on = false; lp = null; check(); });
      c.say(g.say);
    }
    let lastS = 0;
    function rub(e) { if (cleared) return; markAct(); const r = cv.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top; x.beginPath(); x.moveTo(...(lp || [px + .1, py])); x.lineTo(px, py); x.stroke(); lp = [px, py]; if (Date.now() - lastS > 120) { lastS = Date.now(); AU.sfx('scrub'); check(); } }
    function check() { if (cleared || !x) return; const d = x.getImageData(0, 0, S, S).data; let t = 0, k = 0; for (let i = 3; i < d.length; i += 4 * 97) { t++; if (d[i] < 30) k++; } if (k / t > .5) reveal(); }
    function reveal() { cleared = true; cv.style.opacity = 0; AU.sfx('magic'); sparkleEl(box, 16); const it = g.items[round]; if (it.sound) it.sound(); VO.say(it.say || g.good, false); round++; setTimeout(() => { if (G.ctx === c) next(); }, 2000); }
    next();
    c.hint = () => cv; c.solve = () => { round = rounds; next(); };
  });
}
bScratch('ventana', ['Ventana empañada', 'Foggy window'], '🌫️', 'cielo', c => ({ say: L('La ventana está empañada. Frótala con tu dedito', 'The window is foggy. Rub it with your finger'),
  cover: (x, S, r) => { const g = x.createLinearGradient(0, 0, S, S); g.addColorStop(0, '#dfe8f2'); g.addColorStop(1, '#b8c8da'); x.fillStyle = g; x.fillRect(0, 0, S, S); x.fillStyle = 'rgba(255,255,255,.6)'; for (let i = 0; i < 40; i++) { x.beginPath(); x.arc(r() * S, r() * S, 2 + r() * 6, 0, 7); x.fill(); } },
  items: sample(c.r, SND_K, 2).map(k => ({ html: bArt(k, 'joy', 100), sound: () => AU.animal(k), say: L(`¡Hola, ${bAn(k).n}!`, `Hello, ${bAn(k).en}!`) })) }));
bScratch('raspa', ['Raspa y descubre', 'Scratch and see'], '✨', 'dulce', c => ({ say: L('¿Qué hay escondido? ¡Raspa con tu dedito!', "What's hidden? Scratch with your finger!"), good: L('¡Sorpresa!', 'Surprise!'),
  cover: (x, S) => { const g = x.createLinearGradient(0, 0, S, S); g.addColorStop(0, '#c9ccd6'); g.addColorStop(.5, '#f2f3f7'); g.addColorStop(1, '#a9adba'); x.fillStyle = g; x.fillRect(0, 0, S, S); x.font = `800 ${S * .16}px Baloo 2, Arial`; x.fillStyle = 'rgba(120,110,170,.45)'; x.textAlign = 'center'; for (let i = 0; i < 9; i++) x.fillText('?', (i % 3 + .5) * S / 3, (Math.floor(i / 3) + .7) * S / 3); },
  items: sample(c.r, STICKERS.slice(0, 30), 2).map(e => ({ html: mE(e) })) }));
bScratch('arena', ['Tesoro en la arena', 'Sand treasure'], '🏖️', 'mar', c => ({ say: L('¡Hay un tesoro escondido en la arena! Cava con tu dedito', 'There is treasure in the sand! Dig with your finger'), good: L('¡Encontraste un tesoro!', 'You found treasure!'),
  cover: (x, S, r) => { x.fillStyle = '#f2d48a'; x.fillRect(0, 0, S, S); for (let i = 0; i < 400; i++) { x.fillStyle = r() < .5 ? '#e0bd6a' : '#fbe6b0'; x.fillRect(r() * S, r() * S, 3, 3); } },
  items: sample(c.r, ['💎', '👑', '🐚', '⭐', '🏆', '💍'], 2).map(e => ({ html: mE(e) })) }));
bScratch('nieve', ['Quita la nieve', 'Clear the snow'], '❄️', 'cielo', c => ({ say: L('Algo quedó tapado de nieve. ¡Quítala con tu dedito!', 'Something is covered in snow. Clear it with your finger!'), good: L('¡Ahí estaba!', 'There it is!'),
  cover: (x, S, r) => { x.fillStyle = '#f7fbff'; x.fillRect(0, 0, S, S); x.fillStyle = '#dbeeff'; for (let i = 0; i < 60; i++) { x.beginPath(); x.arc(r() * S, r() * S, 4 + r() * 10, 0, 7); x.fill(); } },
  items: sample(c.r, ['🚗', '⛄', '🧸', '🛷', '🐧', '🎄'], 2).map(e => ({ html: mE(e) })) }));
bScratch('espuma', ['Mucha espuma', 'Bubble bath'], '🛁', 'bano', c => ({ say: L('¡Cuánta espuma! Frota para encontrar al animalito', 'So many bubbles! Rub to find the animal'),
  cover: (x, S, r) => { x.fillStyle = '#eaf6ff'; x.fillRect(0, 0, S, S); for (let i = 0; i < 70; i++) { const R = 10 + r() * 26, X = r() * S, Y = r() * S, g = x.createRadialGradient(X - R * .3, Y - R * .3, 1, X, Y, R); g.addColorStop(0, '#fff'); g.addColorStop(1, '#bfe4ff'); x.fillStyle = g; x.beginPath(); x.arc(X, Y, R, 0, 7); x.fill(); } },
  items: sample(c.r, Object.keys(AN), 2).map(k => ({ html: bArt(k, 'joy', 100), sound: () => AU.animal(k), say: L(`¡${cap(bAn(k).n)} está limpiecito!`, `The ${bAn(k).en} is all clean!`) })) }));

/* ---------- MOTOR B5 · PINTA CON UN TOQUE ---------- */
function bPaint(key, name, icon, theme, pic, o = {}) {
  bReg(key, name, icon, theme, function (c) {
    const regs = pic.r, S = Math.min(c.W * .9, c.H * .82); let k = 0, done = 0; const cols = shuf(c.r, PAL);
    const wrap = mk('div', 'card bpaint', `<svg viewBox="${pic.vb}" width="${S * .94}" height="${S * .94}">${regs.map((p, i) => `<path data-i="${i}" d="${p}" fill="#fff" stroke="#2b2140" stroke-width="3.5" stroke-linejoin="round" style="cursor:pointer;transition:fill .45s"/>`).join('')}${pic.extra || ''}</svg>`, c.stage, `position:absolute;left:${(c.W - S) / 2}px;top:${c.H * .06}px;width:${S}px;height:${S}px;z-index:2`);
    const ps = [...wrap.querySelectorAll('[data-i]')];
    ps.forEach(p => p.addEventListener('pointerdown', () => paint(p)));
    function paint(p) { if (G.finished || p.done) return; markAct(); p.done = true; p.setAttribute('fill', (pic.fix && pic.fix[+p.dataset.i]) || cols[k++ % cols.length]); AU.note(done % 8, .35); AU.sfx('pop'); done++;
      const r = p.getBoundingClientRect(); sparkle(r.left + r.width / 2, r.top + r.height / 2, 5);
      if (done === regs.length) { setTimeout(() => { AU.sfx('magic'); bump(wrap, 'squash'); sparkleEl(wrap, 16); VO.say(o.good ? L(o.good[0], o.good[1]) : L('¡Qué lindo te quedó!', 'It looks beautiful!'), false); }, 300); setTimeout(c.done, 1500); } }
    c.say(o.say ? L(o.say[0], o.say[1]) : L('Toca cada parte del dibujo para pintarla', 'Tap each part of the picture to paint it'));
    c.hint = () => ps.find(p => !p.done); c.solve = () => ps.forEach(p => !p.done && paint(p));
  });
}
const eye = (x, y, r = 6) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#2b2140" pointer-events="none"/><circle cx="${x + r * .3}" cy="${y - r * .35}" r="${r * .35}" fill="#fff" pointer-events="none"/>`;
bPaint('pintapez', ['Pinta el pez', 'Paint the fish'], '🐟', 'mar', { vb: '0 0 200 160', r: ['M150 80L196 44L196 116Z', 'M30 80Q60 30 120 38Q160 46 166 80Q160 114 120 122Q60 130 30 80Z', 'M84 40Q100 10 128 40Z', 'M84 120Q100 150 128 120Z', 'M98 42Q86 80 98 118Q112 80 98 42Z'], extra: eye(62, 72, 8) + '<path d="M40 92Q48 98 56 94" stroke="#2b2140" stroke-width="3" fill="none" pointer-events="none"/>' }, { say: ['Toca el pez para pintarlo de colores', 'Tap the fish to paint it'] });
bPaint('pintaflor', ['Pinta la flor', 'Paint the flower'], '🌸', 'jardin', { vb: '0 0 200 200', r: [...[0, 72, 144, 216, 288].map(a => { const t = a * Math.PI / 180, x = 100 + Math.sin(t) * 38, y = 72 - Math.cos(t) * 38; return `M${x - 26} ${y}a26 26 0 1 0 52 0a26 26 0 1 0 -52 0Z`; }), 'M80 72a20 20 0 1 0 40 0a20 20 0 1 0 -40 0Z', 'M95 110H105V194H95Z', 'M100 160Q66 136 52 158Q74 178 100 168Z'], extra: '', fix: { 6: '#4cbb4a', 7: '#6fd86a' } }, { say: ['Toca los pétalos para pintar la flor', 'Tap the petals to paint the flower'] });
bPaint('pintacarro', ['Pinta el carro', 'Paint the car'], '🚙', 'ciudad', { vb: '0 0 200 160', r: ['M14 112Q14 92 34 90L56 58Q62 50 76 50H128Q140 50 148 60L168 90Q188 92 188 112V126H14Z', 'M66 60H100V88H50Z', 'M108 60H132L150 88H108Z', 'M30 130a20 20 0 1 0 40 0a20 20 0 1 0 -40 0Z', 'M134 130a20 20 0 1 0 40 0a20 20 0 1 0 -40 0Z', 'M176 100a8 8 0 1 0 16 0a8 8 0 1 0 -16 0Z'] }, { say: ['Toca el carro para pintarlo', 'Tap the car to paint it'] });
bPaint('pintahelado', ['Pinta el helado', 'Paint the ice cream'], '🍦', 'dulce', { vb: '0 0 200 200', r: ['M66 104L100 194L134 104Z', 'M64 98a36 32 0 1 0 72 0a36 32 0 1 0 -72 0Z', 'M70 56a30 28 0 1 0 60 0a30 28 0 1 0 -60 0Z', 'M90 20a10 10 0 1 0 20 0a10 10 0 1 0 -20 0Z'], fix: { 0: '#f2b25a' } }, { say: ['Pinta el helado con un toque', 'Paint the ice cream with a tap'], good: ['¡Qué rico se ve!', 'Looks yummy!'] });
bPaint('pintacasita', ['Pinta la casita', 'Paint the house'], '🏠', 'jardin', { vb: '0 0 200 200', r: PNR.map(p => p.p) }, { say: ['Toca cada parte de la casita para pintarla', 'Tap each part of the house to paint it'] });
bPaint('pintamariposa', ['Pinta la mariposa', 'Paint the butterfly'], '🦋', 'jardin', { vb: '0 0 200 170', r: ['M98 80C70 10 10 4 14 50C16 86 60 92 98 84Z', 'M102 80C130 10 190 4 186 50C184 86 140 92 102 84Z', 'M98 88C70 100 40 140 62 152C84 160 96 120 98 92Z', 'M102 88C130 100 160 140 138 152C116 160 104 120 102 92Z', 'M94 40H106V150H94Z'], fix: { 4: '#2b2140' } }, { say: ['Toca las alas para pintar la mariposa', 'Tap the wings to paint the butterfly'] });
bPaint('pintapastel', ['Pinta el pastel', 'Paint the cake'], '🎂', 'dulce', { vb: '0 0 200 200', r: ['M10 186a90 10 0 1 0 180 0a90 10 0 1 0 -180 0Z', 'M30 120H170V180H30Z', 'M30 120Q45 140 60 120T90 120T120 120T150 120T170 120V110H30Z', 'M50 76H150V112H50Z', 'M95 40H105V76H95Z', 'M100 10Q112 26 100 36Q88 26 100 10Z'], fix: { 5: '#ffb400' } }, { say: ['¡Pintemos el pastel de cumpleaños!', "Let's paint the birthday cake!"], good: ['¡Feliz cumpleaños!', 'Happy birthday!'] });

/* ---------- MOTOR B6 · ENCAJA UNA PIEZA ---------- */
function bFit(key, name, icon, theme, gen) {
  bReg(key, name, icon, theme, function (c) {
    const rounds = 3, dots = mDots(c, rounds), land = c.W > c.H; let round = 0, pieces = [];
    const hs = clamp(Math.min(c.W * (land ? .4 : .7), c.H * (land ? .62 : .4)), 130, 340), ps = hs * .8;
    const hole = mk('div', 'card', '', c.stage, `position:absolute;left:${land ? c.W * .62 - hs / 2 : c.W / 2 - hs / 2}px;top:${land ? c.H * .48 - hs / 2 : c.H * .06}px;width:${hs}px;height:${hs}px;z-index:1;background:linear-gradient(#ffe2b8,#f7c98a)`);
    function next() {
      dots(round); if (round >= rounds) { c.done(); return; }
      const q = gen(c, round); hole.innerHTML = q.hole; pieces.forEach(p => p.remove());
      const n = q.pieces.length, s0 = land ? Math.min(ps, c.H * .86 / n / 1.08, c.W * .34) : Math.min(ps, c.W * .9 / n / 1.1, c.H * .4); pieces = shuf(c.r, q.pieces).map((pc, i) => { const x = land ? c.W * .2 : c.W / 2 + (i - (n - 1) / 2) * s0 * 1.1, y = land ? c.H / 2 + (i - (n - 1) / 2) * s0 * 1.08 : c.H * .74;
        const el = mk('div', 'bitem', pc.html, c.stage, `left:${x - s0 / 2}px;top:${y - s0 / 2}px;width:${s0}px;height:${s0}px`); el.ok = pc.ok;
        draggable(el, { targets: () => [hole], onDrop: (t, e) => fit(e, q) }); return el; });
      c.say(q.say);
    }
    function fit(e, q) { if (!e.ok) { VO.say(L('Esa no encaja. ¡Prueba la otra!', "That one doesn't fit. Try the other!"), false); return false; }
      e._locked = true; e.remove(); hole.innerHTML = q.done; bump(hole, 'squash'); AU.sfx('ok'); AU.sfx('magic'); sparkleEl(hole, 12); VO.say(q.ok || L('¡Encajó!', 'It fits!'), false); round++; setTimeout(() => G.ctx === c && next(), 1500); return true; }
    next();
    c.hint = () => pieces.find(p => p.ok && p.isConnected); c.solve = () => { round = rounds; next(); };
  });
}
bFit('encajafacil', ['Encaja la forma', 'Fit the shape'], '🟡', 'madera', (c, round) => { const ids = [0, 1, 2, 3, 4], si = shuf(c.r, ids)[round], col = PAL[si], other = pick(c.r, ids.filter(i => i !== si));
  const holeSV = `<svg viewBox="0 0 100 100" width="82%" height="82%"><path d="${SHAPES[si].p}" fill="#a86b2c" opacity=".45" stroke="#8a5424" stroke-width="4" stroke-dasharray="8 6"/></svg>`;
  return { hole: holeSV, done: shapeSV(SHAPES[si], col, '82%'), say: L(`Lleva ${the(SHAPES[si])} a su hueco`, `Put the ${SHAPES[si].en} in its hole`), ok: L(`¡${cap(the(SHAPES[si]))}!`, `The ${SHAPES[si].en}!`),
    pieces: [{ html: shapeSV(SHAPES[si], col, '100%'), ok: true }, ...(c.d >= 1 ? [{ html: shapeSV(SHAPES[other], PAL[other], '100%'), ok: false }] : [])] }; });
bFit('mitadanimal', ['La otra mitad', 'The other half'], '🐼', 'dulce', (c, round) => { const ks = sample(c.r, Object.keys(AN), 2), k = ks[0];
  const half = (kk, right, op = 1) => `<div style="position:absolute;inset:6%;clip-path:inset(0 ${right ? 0 : 50}% 0 ${right ? 50 : 0}%);opacity:${op}">${animalSVG(kk, 'happy')}</div>`;
  return { hole: `<div style="position:relative;width:100%;height:100%">${half(k, false)}<div style="position:absolute;left:50%;top:6%;bottom:6%;right:6%;border:4px dashed #a86b2c;border-left:none;border-radius:0 50% 50% 0;opacity:.6"></div></div>`, done: `<div style="position:relative;width:100%;height:100%">${half(k, false)}${half(k, true)}</div>`,
    say: L(`¡Al ${bAn(k).n} le falta la otra mitad! Encuéntrala`, `The ${bAn(k).en} is missing a half! Find it`), ok: L(`¡${cap(the(bAn(k)))} completito!`, `The whole ${bAn(k).en}!`),
    pieces: [{ html: `<div style="position:relative;width:100%;height:100%">${half(k, true)}</div>`, ok: true }, ...(c.d >= 1 ? [{ html: `<div style="position:relative;width:100%;height:100%">${half(ks[1], true)}</div>`, ok: false }] : [])] }; });

/* ---------- MOTOR B7 · ATRAPA LO QUE SE MUEVE (lento y grande) ---------- */
function bChase(key, name, icon, theme, gen) {
  bReg(key, name, icon, theme, function (c) {
    c.noRestart = true; const g = gen(c), N = g.n, sz = clamp(unit(c) * (g.size || .2), 64, 170), set = mCounter(c, g.icon || icon, N); let got = 0, live = [], raf, last = 0, prev = performance.now();
    function spawn(first) { const o = g.spawn(c, sz); if (first) { o.x = sz * .3 + Math.random() * (c.W - sz * 1.6); o.y = c.H * (.15 + Math.random() * .5); }
      const _o = o, el = mk('div', 'bchase', _o.html, c.stage, `width:${sz}px;height:${sz}px;font-size:${sz * .8}px`); const it = Object.assign({ el, t: 0 }, o); el.addEventListener('pointerdown', () => hit(it)); live.push(it); }
    function hit(it) { if (G.finished || it.hit) return; markAct(); it.hit = true; got++; set(got); (g.sound || (() => AU.sfx('pop')))(); VO.say(numw(got), false);
      const r = it.el.getBoundingClientRect(); sparkle(r.left + r.width / 2, r.top + r.height / 2, 8, g.spark); it.el.classList.add('bcaught'); setTimeout(() => it.el.remove(), 450); live = live.filter(x => x !== it);
      if (got >= N) { setTimeout(() => VO.say(g.good || L('¡Los atrapaste a todos!', 'You caught them all!'), false), 500); setTimeout(c.done, 1200); } }
    function loop(ts) { if (G.ctx !== c) return; const dt = Math.min(48, ts - prev); prev = ts;
      if (!G.finished && live.length < g.max && ts - last > (g.every || 900)) { last = ts; spawn(); }
      live = live.filter(it => { it.t += dt; it.x += it.vx * dt * .06; it.y += it.vy * dt * .06; const w = Math.sin(it.t / 500 + it.ph) * (it.wob || 0);
        it.el.style.transform = `translate(${it.x + w}px,${it.y}px) rotate(${it.rot ? Math.sin(it.t / 400) * it.rot : 0}deg)`;
        if (it.x < -sz * 1.5 || it.x > c.W + sz * .5 || it.y < -sz * 1.5 || it.y > c.H + sz * .5) { it.el.remove(); return false; } return true; });
      raf = requestAnimationFrame(loop); }
    for (let i = 0; i < Math.min(2, g.max); i++) spawn(true); raf = requestAnimationFrame(loop); c.cleanup = () => cancelAnimationFrame(raf);
    c.say(g.say);
    c.hint = () => (live.find(x => !x.hit && x.x > 0 && x.x < c.W - sz && x.y > 0 && x.y < c.H - sz) || {}).el; c.solve = () => { got = N; set(N); c.done(); };
  });
}
const bubSV = `<div style="width:92%;height:92%;border-radius:50%;background:radial-gradient(circle at 32% 28%,#fff 0 12%,rgba(255,255,255,.35) 22%,rgba(170,220,255,.35) 60%,rgba(255,140,220,.45) 100%);border:2px solid rgba(255,255,255,.9);box-shadow:inset -6px -8px 14px rgba(120,80,255,.25)"></div>`;
bChase('burbujasjabon', ['Burbujas de jabón', 'Soap bubbles'], '🔵', 'cielo', c => ({ n: [5, 6, 7, 8, 8][c.d], max: 4, size: .2, say: L('¡Revienta las burbujas de jabón!', 'Pop the soap bubbles!'), spark: ['💧', '✨'],
  spawn: (c2, sz) => ({ html: bubSV, x: sz * .2 + Math.random() * (c2.W - sz * 1.4), y: c2.H + sz * .2, vx: (Math.random() - .5) * .3, vy: -(.6 + Math.random() * .4), ph: Math.random() * 6, wob: 26 }) }));
bChase('mariposasvuelan', ['Mariposas', 'Butterflies'], '🦋', 'jardin', c => ({ n: [4, 5, 6, 6, 7][c.d], max: 3, size: .2, say: L('Toca a las mariposas que vuelan', 'Tap the flying butterflies'), sound: () => AU.sfx('magic'), spark: ['🌸', '✨'],
  spawn: (c2, sz) => { const l = Math.random() < .5; return { html: flySV(pick(Math.random, COLORS.slice(0, 7)), '100%'), x: l ? -sz : c2.W, y: c2.H * (.15 + Math.random() * .5), vx: (l ? 1 : -1) * (.45 + Math.random() * .25), vy: (Math.random() - .5) * .2, ph: Math.random() * 6, wob: 0, rot: 12 }; } }));
bChase('mariquitas', ['Mariquitas', 'Ladybugs'], '🐞', 'jardin', c => ({ n: [4, 5, 6, 6, 7][c.d], max: 3, size: .17, say: L('Atrapa a las mariquitas que caminan', 'Catch the walking ladybugs'), sound: () => AU.sfx('boing'),
  spawn: (c2, sz) => { const l = Math.random() < .5; return { html: mE('🐞'), x: l ? -sz : c2.W, y: c2.H * (.2 + Math.random() * .55), vx: (l ? 1 : -1) * (.35 + Math.random() * .2), vy: 0, ph: 0, wob: 0, rot: 8 }; } }));
bChase('copos', ['Copos de nieve', 'Snowflakes'], '❄️', 'cielo', c => ({ n: [5, 6, 7, 8, 8][c.d], max: 4, size: .16, every: 800, say: L('¡Está nevando! Atrapa los copos de nieve', "It's snowing! Catch the snowflakes"), sound: () => AU.note(Math.floor(Math.random() * 8), .4),
  spawn: (c2, sz) => ({ html: mE('❄️'), x: Math.random() * (c2.W - sz), y: -sz, vx: (Math.random() - .5) * .2, vy: .4 + Math.random() * .25, ph: Math.random() * 6, wob: 30, rot: 40 }) }));
bChase('estrellasfugaces', ['Estrellas fugaces', 'Shooting stars'], '🌠', 'noche', c => ({ n: [4, 5, 6, 6, 7][c.d], max: 2, size: .18, every: 1300, say: L('Toca las estrellas fugaces y pide un deseo', 'Tap the shooting stars and make a wish'), sound: () => AU.sfx('magic'), spark: ['⭐', '✨'],
  spawn: (c2, sz) => ({ html: `<span class="emo glow">⭐</span>`, x: Math.random() * c2.W * .5, y: -sz, vx: .45 + Math.random() * .2, vy: .3 + Math.random() * .15, ph: 0, wob: 0, rot: 30 }) }));
bChase('pollitos', ['Pollitos', 'Little chicks'], '🐥', 'granja', c => ({ n: [4, 5, 6, 6, 7][c.d], max: 3, size: .17, say: L('Los pollitos se escaparon. ¡Atrápalos!', 'The chicks ran away. Catch them!'), sound: () => AU.animal('pollito'),
  spawn: (c2, sz) => { const l = Math.random() < .5; return { html: `<span class="emo" style="display:inline-block;transform:scaleX(${l ? -1 : 1})">🐥</span>`, x: l ? -sz : c2.W, y: c2.H * (.45 + Math.random() * .3), vx: (l ? 1 : -1) * (.4 + Math.random() * .2), vy: 0, ph: Math.random() * 6, wob: 0, rot: 10 }; } }));

/* ---------- MOTOR B8 · CLASIFICAR EN 2 (cajas grandes) ---------- */
mSort('ordenacolores', ['Rojo y azul', 'Red and blue'], '🔴', 'madera', c => { const A = COLORS[0], B = pick(c.r, [COLORS[1], COLORS[2], COLORS[3]]), n = [2, 2, 3, 3, 4][c.d], pool = ['⚽', '🎈', '⭐', '❤️'];
  const ball = col => `<svg viewBox="0 0 100 100" width="88%"><circle cx="50" cy="50" r="44" fill="${col.h}" stroke="${col.d}" stroke-width="5"/><ellipse cx="34" cy="32" rx="12" ry="8" fill="#fff" opacity=".55"/></svg>`;
  return { say: L('Pon cada pelota en la caja de su color', 'Put each ball in the box of its color'), binH: .4,
    bins: [A, B].map(col => ({ k: col.n, html: lab => `<svg viewBox="0 0 100 70" width="${lab * 1.6}"><path d="M6 14H94L86 66H14Z" fill="${col.h}" stroke="${col.d}" stroke-width="5"/></svg>`, style: `background:${col.h}22` })),
    items: [A, B].flatMap(col => mRange(1, n).map(() => ({ k: col.n, html: ball(col) }))) }; });
BEBE.push('ordenacolores');
mSort('grandechico', ['Cajas grande y chica', 'Big box, small box'], '📦', 'madera', c => { const e = pick(c.r, ['🐻', '🍎', '⭐', '🚗', '🎈']), n = [2, 2, 3, 3, 3][c.d];
  return { say: L('Los grandes van a la caja grande y los pequeños a la caja pequeña', 'Big ones in the big box, small ones in the small box'), binH: .42,
    bins: [{ k: 'g', html: lab => `${mE('📦', lab * 1.4)}<span>${L('Grande', 'Big')}</span>` }, { k: 'p', html: lab => `${mE('📦', lab * .7)}<span>${L('Pequeña', 'Small')}</span>` }],
    items: [...mRange(1, n).map(() => ({ k: 'g', html: `<span class="emo" style="font-size:1em">${e}</span>` })), ...mRange(1, n).map(() => ({ k: 'p', html: `<span class="emo" style="font-size:.45em">${e}</span>` }))] }; });
BEBE.push('grandechico');

/* ---------- 4 más ---------- */
bTap('patitos', ['Patitos al agua', 'Little ducks'], '🦆', 'mar', c => { const n = [2, 3, 4, 4, 5][c.d];
  return { say: L('Toca a los patitos para que naden', 'Tap the ducks so they swim'), good: L('¡Cuac, cuac! ¡Qué rico nadar!', 'Quack quack! Swimming is fun!'), fx: 'jumpup', taps: 2, size: c2 => clamp(Math.min(c2.W * .8 / n, c2.H * .26), 70, 170),
    scene: () => `<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%"><ellipse cx="50" cy="68" rx="48" ry="24" fill="#5fc4ff"/><path d="M8 66Q20 62 32 66T56 66T80 66T96 66" stroke="#fff" stroke-width=".8" fill="none" opacity=".7"/></svg>`,
    items: mRange(0, n - 1).map(i => ({ x: .14 + .72 * (i + .5) / n, y: .6 + (i % 2) * .07, html: bArt('pato'), after: bArt('pato', 'joy'), sound: () => AU.animal('pato') })) }; });
bWhere('dondeinstrumento', ['¿Qué suena?', 'Music time'], '🎸', 'noche', INST.slice(0, 4).map(x => Object.assign(E2(x.e, x.n[0].replace(/^(el|la) /, ''), x.n[1].replace(/^the /, ''), x.n[0].startsWith('la') ? 'la' : 'el'), { s: x.s })),
  { onShow: t => setTimeout(() => G.ctx && t.s(), 900), ok: t => { t.s(); return L(`¡${cap(the(t))}!`, `${cap(the(t))}!`); } });
bWhere('dondedulce', ['Dulces', 'Sweets'], '🍭', 'dulce', [E2('🍭', 'chupetín', 'lollipop'), E2('🍬', 'caramelo', 'candy'), E2('🍫', 'chocolate', 'chocolate'), E2('🍩', 'dona', 'donut', 'la'), E2('🧁', 'quequito', 'cupcake'), E2('🍰', 'pastel', 'cake'), E2('🍦', 'helado', 'ice cream')]);
bChase('pececitos', ['Pececitos', 'Little fish'], '🐠', 'mar', c => ({ n: [4, 5, 6, 6, 7][c.d], max: 3, size: .2, say: L('Toca a los pececitos que nadan', 'Tap the swimming fish'), sound: () => AU.sfx('splash'), spark: ['💧', '✨'],
  spawn: (c2, sz) => { const l = Math.random() < .5, col = pick(Math.random, COLORS); return { html: `<div style="width:100%;transform:scaleX(${l ? -1 : 1})">${fishSVG(col.h, col.d)}</div>`, x: l ? -sz : c2.W, y: c2.H * (.2 + Math.random() * .55), vx: (l ? 1 : -1) * (.4 + Math.random() * .2), vy: 0, ph: Math.random() * 6, wob: 0 }; } }));
