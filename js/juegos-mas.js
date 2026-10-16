/* =====================================================================
   PIPO JUEGA · JUEGOS MÁS (v3)
   Motores reutilizables: preguntas, clasificar, unir parejas, ordenar,
   armar (colocar piezas) y apilar. Cada juego se registra con mReg.
===================================================================== */
const MAS_ORDER = [];
const mE = (e, px) => `<span class="emo"${px ? ` style="font-size:${px}px"` : ''}>${e}</span>`;
const mA = (k, mood = 'happy', pct = 84) => `<span class="art" style="width:${pct}%;height:${pct}%">${animalSVG(k, mood)}</span>`;
const mT = (t, col = '#3d8bff', f = 1) => `<b style="font-size:${f}em;color:${col};line-height:1;font-weight:800">${t}</b>`;
const PAL = ['#ff4d4d', '#3d8bff', '#ffb400', '#21b04a', '#ff7a1a', '#9b59ff', '#ff5fa2', '#16b5e8'];
const WHITE = { n: 'blanco', en: 'white', h: '#ffffff', d: '#b9c2cc' };
const mCol = n => COLORS.find(x => x.n === n);
const mRange = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
function mDots(c, n) { const d = mk('div', 'rounddots', '', c.stage); return k => d.innerHTML = Array.from({ length: n }, (_, i) => `<span class="${i < k ? 'on' : ''}"></span>`).join(''); }
function mOk(el, t) { AU.sfx('ok'); if (el) { sparkleEl(el, 10); el.style.background = '#c8f7c5'; } if (t) VO.say(t, false); }
function mNo(el, t) { AU.sfx('no'); if (el) bump(el, 'shake'); if (t) VO.say(t, false); }
function mReg(key, name, icon, theme, make) { TYPES[key] = { name, icon, theme, make }; MAS_ORDER.push(key); }
function mNums(c, ans, n, lo, hi) { const pool = mRange(lo, hi).filter(x => x !== ans); return shuf(c.r, [ans, ...sample(c.r, pool, n - 1)]); }
function mFit(n, wsum, avW, avH, mx = 200) { let best = 0; for (let rows = 1; rows <= 3; rows++) { const per = Math.ceil(n / rows), w = wsum / n * per, s = Math.min(avH / (rows * 1.14), avW / (w * 1.14)); if (s > best) best = s; } return clamp(best, 46, mx); }
/* ---------- dibujos simples ---------- */
const blobSV = (col, w = '78%') => `<svg viewBox="0 0 100 100" width="${w}" height="${w}"><path d="M50 8C66 6 80 14 86 28C94 42 92 60 84 72C74 88 56 94 40 90C24 86 10 74 8 56C6 40 14 22 28 14C35 10 42 9 50 8Z" fill="${col.h}" stroke="${col.d}" stroke-width="4"/><ellipse cx="36" cy="32" rx="10" ry="6" fill="#fff" opacity=".55"/></svg>`;
const dieSV = (n, w = '76%', col = '#fff') => { const P = { 1: [[50, 50]], 2: [[28, 28], [72, 72]], 3: [[26, 26], [50, 50], [74, 74]], 4: [[28, 28], [72, 28], [28, 72], [72, 72]], 5: [[26, 26], [74, 26], [50, 50], [26, 74], [74, 74]], 6: [[28, 24], [72, 24], [28, 50], [72, 50], [28, 76], [72, 76]] }; return `<svg viewBox="0 0 100 100" width="${w}" height="${w}"><rect x="5" y="5" width="90" height="90" rx="18" fill="${col}" stroke="#2b2140" stroke-width="4"/>${(P[n] || []).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#2b2140"/>`).join('')}</svg>`; };
const giftSV = (col, w = '80%') => `<svg viewBox="0 0 100 100" width="${w}" height="${w}"><rect x="12" y="38" width="76" height="56" rx="6" fill="${col.h}" stroke="${col.d}" stroke-width="4"/><rect x="6" y="26" width="88" height="18" rx="5" fill="${col.h}" stroke="${col.d}" stroke-width="4"/><rect x="44" y="26" width="12" height="68" fill="#fff" opacity=".85"/><path d="M50 26C36 6 22 14 30 24ZM50 26C64 6 78 14 70 24Z" fill="#fff" stroke="${col.d}" stroke-width="3"/></svg>`;
const glassSV = (lv, w = '70%') => `<svg viewBox="0 0 80 100" width="${w}" height="${w}"><defs><clipPath id="gc${Math.round(lv * 100)}"><path d="M10 8H70L62 94H18Z"/></clipPath></defs><rect x="0" y="${8 + 86 * (1 - lv)}" width="80" height="100" fill="#5fc4ff" clip-path="url(#gc${Math.round(lv * 100)})"/>${lv > 0 ? `<rect x="0" y="${8 + 86 * (1 - lv)}" width="80" height="5" fill="#9ee0ff" clip-path="url(#gc${Math.round(lv * 100)})"/>` : ''}<path d="M10 8H70L62 94H18Z" fill="none" stroke="#2b2140" stroke-width="4" stroke-linejoin="round"/><path d="M18 16L22 80" stroke="#fff" stroke-width="4" opacity=".7"/></svg>`;
const towerSV = (h, mx, w = '80%') => `<svg viewBox="0 0 60 ${mx * 20 + 8}" width="${w}" height="88%" preserveAspectRatio="xMidYMax meet">${Array.from({ length: h }, (_, i) => `<rect x="8" y="${mx * 20 - (i + 1) * 20 + 6}" width="44" height="19" rx="4" fill="${PAL[i % 8]}" stroke="#2b2140" stroke-width="2.5"/>`).join('')}</svg>`;
const wormSV = (len, col) => `<svg viewBox="0 0 ${len * 22 + 30} 44" width="${(len * 22 + 30) / 2.4}%" style="max-width:96%"> ${Array.from({ length: len }, (_, i) => `<circle cx="${18 + i * 22}" cy="22" r="15" fill="${col}" stroke="#2b2140" stroke-width="2.5"/>`).join('')}<circle cx="${18 + (len - 1) * 22 + 4}" cy="17" r="3.5" fill="#2b2140"/><path d="M${18 + (len - 1) * 22 - 2} 27q5 4 10 0" stroke="#2b2140" stroke-width="2" fill="none"/></svg>`;
const clockSV = (h, m, px) => { const ha = ((h % 12) + m / 60) * 30, ma = m * 6; return `<svg viewBox="0 0 100 100" width="${px}" height="${px}"><circle cx="50" cy="50" r="46" fill="#fff" stroke="#ff6fa8" stroke-width="6"/>${mRange(1, 12).map(i => { const a = i * 30 * Math.PI / 180; return `<text x="${50 + Math.sin(a) * 35}" y="${50 - Math.cos(a) * 35 + 4.5}" text-anchor="middle" font-size="12" font-weight="800" fill="#2b2140" font-family="Baloo 2,Arial">${i}</text>`; }).join('')}<line x1="50" y1="50" x2="${50 + Math.sin(ha * Math.PI / 180) * 22}" y2="${50 - Math.cos(ha * Math.PI / 180) * 22}" stroke="#2b2140" stroke-width="6" stroke-linecap="round"/><line x1="50" y1="50" x2="${50 + Math.sin(ma * Math.PI / 180) * 32}" y2="${50 - Math.cos(ma * Math.PI / 180) * 32}" stroke="#3d8bff" stroke-width="4" stroke-linecap="round"/><circle cx="50" cy="50" r="4" fill="#2b2140"/></svg>`; };
const tlightSV = (lit, px) => `<svg viewBox="0 0 60 150" height="${px}"><rect x="22" y="120" width="16" height="30" fill="#555"/><rect x="5" y="5" width="50" height="120" rx="14" fill="#2b2140"/>${['#ff3b3b', '#ffcc00', '#2ee06b'].map((col, i) => `<circle cx="30" cy="${28 + i * 37}" r="14" fill="${col}" opacity="${lit === i ? 1 : .22}"/>`).join('')}</svg>`;
const sockSV = (col, pat, flip) => `<svg viewBox="0 0 70 100" width="62%" height="88%" style="${flip ? 'transform:scaleX(-1)' : ''}"><path d="M14 6H48V58L62 74Q70 84 60 92Q52 98 42 90L18 70Q12 64 14 56Z" fill="${col.h}" stroke="${col.d}" stroke-width="3.5" stroke-linejoin="round"/><rect x="14" y="6" width="34" height="12" fill="#fff" opacity=".8"/>${pat === 1 ? '<path d="M14 30H48M14 42H48" stroke="#fff" stroke-width="6"/>' : pat === 2 ? '<circle cx="24" cy="32" r="4" fill="#fff"/><circle cx="38" cy="44" r="4" fill="#fff"/><circle cx="26" cy="54" r="4" fill="#fff"/>' : pat === 3 ? '<path d="M31 46c-6-6-12 2-6 7l6 5 6-5c6-5 0-13-6-7z" fill="#fff"/>' : ''}</svg>`;
const keySV = col => `<svg viewBox="0 0 100 60" width="82%"><circle cx="24" cy="30" r="18" fill="${col.h}" stroke="${col.d}" stroke-width="4"/><circle cx="24" cy="30" r="7" fill="#fff"/><path d="M40 26H92V36H84V46H76V36H66V44H58V36H40Z" fill="${col.h}" stroke="${col.d}" stroke-width="3.5" stroke-linejoin="round"/></svg>`;
const lockSV = col => `<svg viewBox="0 0 80 100" width="62%"><path d="M20 44V30a20 20 0 0 1 40 0V44" fill="none" stroke="#9aa3ad" stroke-width="9"/><rect x="8" y="42" width="64" height="52" rx="10" fill="${col.h}" stroke="${col.d}" stroke-width="4"/><circle cx="40" cy="62" r="7" fill="#2b2140"/><rect x="37" y="64" width="6" height="16" rx="2" fill="#2b2140"/></svg>`;
const carSV = col => `<svg viewBox="0 0 220 130" width="88%"><path d="M30 70q4-34 40-38h70q30 2 48 38z" fill="${col.h}" stroke="${col.d}" stroke-width="5"/><path d="M10 74q0-10 12-10h176q14 0 14 12v26H10z" fill="${col.h}" stroke="${col.d}" stroke-width="5"/><path d="M62 64l14-24h34v24zM118 64V40h22l26 24z" fill="#bfeaff"/><circle cx="56" cy="106" r="18" fill="#2b2140"/><circle cx="56" cy="106" r="7" fill="#ccc"/><circle cx="166" cy="106" r="18" fill="#2b2140"/><circle cx="166" cy="106" r="7" fill="#ccc"/></svg>`;
const flySV = (col, w = '86%') => `<svg viewBox="0 0 100 80" width="${w}"><path d="M48 40C30 6 6 8 8 28C10 42 30 44 48 40ZM52 40C70 6 94 8 92 28C90 42 70 44 52 40Z" fill="${col.h}" stroke="${col.d}" stroke-width="3"/><path d="M48 42C34 52 22 70 34 74C44 76 48 58 48 42ZM52 42C66 52 78 70 66 74C56 76 52 58 52 42Z" fill="${col.h}" stroke="${col.d}" stroke-width="3" opacity=".85"/><rect x="46" y="22" width="8" height="44" rx="4" fill="#2b2140"/><path d="M48 24Q44 10 38 8M52 24Q56 10 62 8" stroke="#2b2140" stroke-width="2.5" fill="none"/></svg>`;
const flowerSV = (col, w = '70%') => `<svg viewBox="0 0 100 110" width="${w}"><path d="M50 60V108" stroke="#21963a" stroke-width="7"/><path d="M50 88Q30 76 24 88Q36 98 50 92" fill="#4cd964"/>${[0, 72, 144, 216, 288].map(a => `<ellipse cx="50" cy="22" rx="15" ry="20" fill="${col.h}" stroke="${col.d}" stroke-width="3" transform="rotate(${a} 50 44)"/>`).join('')}<circle cx="50" cy="44" r="13" fill="#ffd23f" stroke="#d19b00" stroke-width="3"/></svg>`;
const houseNum = (n, px) => `<svg viewBox="0 0 100 100" width="${px}" height="${px}"><path d="M10 46L50 10L90 46V92H10Z" fill="#ffcf8a" stroke="#a8481b" stroke-width="5" stroke-linejoin="round"/><path d="M4 50L50 8L96 50" fill="none" stroke="#e9573f" stroke-width="9" stroke-linecap="round"/><rect x="40" y="62" width="20" height="30" fill="#a8481b"/><circle cx="50" cy="40" r="15" fill="#fff" stroke="#a8481b" stroke-width="3"/><text x="50" y="47" text-anchor="middle" font-size="19" font-weight="800" fill="#2b2140" font-family="Baloo 2,Arial">${n}</text></svg>`;
const envNum = n => `<svg viewBox="0 0 100 70" width="90%"><rect x="4" y="6" width="92" height="60" rx="8" fill="#fff" stroke="#3d8bff" stroke-width="4"/><path d="M6 10L50 42L94 10" fill="none" stroke="#3d8bff" stroke-width="4"/><circle cx="76" cy="50" r="13" fill="#ff5fa2"/><text x="76" y="56" text-anchor="middle" font-size="17" font-weight="800" fill="#fff" font-family="Baloo 2,Arial">${n}</text></svg>`;

/* =====================================================================
   MOTOR 1 · PREGUNTAS (tocar la respuesta correcta)
   gen(c, ronda) → { id, say, top, opts:[{html, ok, no, w, bg}], good, onOk, onShow, replay }
===================================================================== */
function mQuiz(key, name, icon, theme, gen, o = {}) {
  mReg(key, name, icon, theme, function (c) {
    const rounds = o.rounds || 3, used = new Set(); let round = 0, cur = null, btns = [];
    const dots = mDots(c, rounds); c.TH = c.H * .38;
    const top = mk('div', '', '', c.stage, 'position:absolute;left:3%;right:3%;top:8%;height:40%;display:flex;align-items:center;justify-content:center;gap:3%;flex-wrap:nowrap');
    const area = mk('div', '', '', c.stage, 'position:absolute;left:2%;right:2%;bottom:13%;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;align-content:center;gap:2.5%');
    function next() {
      dots(round); if (round >= rounds) { c.done(); return; }
      let q, tries = 0; do { q = gen(c, round); tries++; } while (q.id != null && used.has(q.id) && tries < 40); if (q.id != null) used.add(q.id);
      cur = q; top.innerHTML = q.top || ''; top.style.display = q.top ? 'flex' : 'none'; top.onclick = q.replay || null; top.style.cursor = q.replay ? 'pointer' : '';
      area.style.top = q.top ? '50%' : '11%'; area.innerHTML = '';
      const n = q.opts.length, ws = q.opts.reduce((s, x) => s + (x.w || 1), 0), sz = mFit(n, ws, c.W * .94, c.H * (q.top ? .35 : .72), q.top ? 190 : 210);
      btns = q.opts.map(op => { const b = mk('div', 'card choice boing', op.html, area, `width:${sz * (op.w || 1)}px;height:${sz}px;font-size:${sz * .55}px;position:relative;overflow:hidden;${op.bg ? 'background:' + op.bg + ';' : ''}`); b.o = op; b.addEventListener('pointerdown', () => choose(b)); return b; });
      c.say(q.say); if (q.onShow) q.onShow(top, btns);
    }
    function choose(b) {
      if (G.finished || b.busy || !cur) return; markAct(); if (b.o.tap) b.o.tap();
      if (b.o.ok) { b.busy = true; const q = cur; cur = null; mOk(b, q.good); if (q.onOk) q.onOk(b, top); round++; setTimeout(next, q.wait || o.wait || 1250); }
      else mNo(b, b.o.no || o.no);
    }
    next();
    c.hint = () => btns.find(b => b.o.ok && b.isConnected); c.solve = () => { round = rounds; cur = null; next(); };
  });
}

/* =====================================================================
   MOTOR 2 · CLASIFICAR (arrastrar cada cosa a su caja)
   gen(c) → { say, bins:[{k, html, style}], items:[{k, html, no}], good, accept, isDone, needed, extra }
===================================================================== */
function mSort(key, name, icon, theme, gen) {
  mReg(key, name, icon, theme, function (c) {
    const g = gen(c), nb = g.bins.length, bh = c.H * (g.binH || .36), bw = Math.min(c.W * .95 / nb - 12, bh * 1.45, 300);
    const row = mk('div', '', '', c.stage, `position:absolute;left:1%;right:1%;bottom:2%;height:${bh}px;display:flex;justify-content:space-evenly;align-items:flex-end;z-index:1`);
    const lab = clamp(bh * .28, 34, 90), fs = clamp(bh * .1, 13, 22), gs = clamp(Math.min(bw / 4.2, bh * .2), 22, 54);
    const bins = g.bins.map(b => { const el = mk('div', 'sbin', `<div class="sblab" style="font-size:${fs}px">${typeof b.html === 'function' ? b.html(lab) : b.html}</div><div class="sgot"></div>`, row, `width:${bw}px;height:100%;${b.style || ''}`); el.k = b.k; el.got = el.lastChild; return el; });
    if (g.extra) g.extra(bins, lab);
    const list = shuf(c.r, g.items), n = list.length, aT = c.H * (g.top || .09), aH = c.H - bh - c.H * .05 - aT;
    let best = 0, per = n, rows = 1; for (let r = 1; r <= 4; r++) { const p = Math.ceil(n / r), s = Math.min(aH / r * .86, c.W * .92 / p * .86); if (s > best) { best = s; per = p; rows = r; } }
    const s = clamp(best, 40, 128);
    const items = list.map((it, i) => {
      const r = Math.floor(i / per), inRow = Math.min(per, n - r * per), col = i % per, x = c.W / 2 + (col - (inRow - 1) / 2) * s * 1.14 + (c.r() - .5) * s * .12, y = aT + (r + .5) * aH / rows;
      const el = mk('div', 'sitem', it.html, c.stage, `position:absolute;left:${x - s / 2}px;top:${y - s / 2}px;width:${s}px;height:${s}px;font-size:${s * .78}px;z-index:3`);
      el.it = it; draggable(el, { targets: () => bins, onDrop: (t, e) => drop(t, e) }); return el;
    });
    const needed = it => g.needed ? g.needed(it) : it.k != null;
    const isDone = () => g.isDone ? g.isDone() : items.every(e => e._locked || !needed(e.it));
    function drop(t, el) {
      const ok = g.accept ? g.accept(t, el.it) : t.k === el.it.k;
      if (!ok) { VO.say(el.it.no || (g.no && g.no(el.it, t)) || L('Ahí no va. ¡Prueba otra caja!', 'Not there. Try another box!'), false); return false; }
      el._locked = true; el.remove(); const m = mk('div', '', el.it.html, t.got, `width:${gs}px;height:${gs}px;font-size:${gs * .82}px;display:flex;align-items:center;justify-content:center`); bump(m);
      AU.sfx('ok'); sparkleEl(t, 6); if (g.onPut) g.onPut(t, el.it);
      if (isDone()) { G.stage && items.forEach(e => !e._locked && (e.style.opacity = .35)); VO.say(g.good || L('¡Todo en su lugar!', 'Everything in its place!'), false); setTimeout(c.done, 950); }
      return true;
    }
    c.say(g.say);
    c.hint = () => items.find(e => !e._locked && needed(e.it) && bins.some(b => g.accept ? g.accept(b, e.it, true) : b.k === e.it.k));
    c.solve = () => { let k = 0; while (!isDone() && k++ < 60) { const e = c.hint(); if (!e) break; drop(bins.find(b => g.accept ? g.accept(b, e.it, true) : b.k === e.it.k), e); } if (!G.finished) c.done(); };
  });
}

/* =====================================================================
   MOTOR 3 · PAREJAS (arrastrar de la izquierda a su pareja de la derecha)
   gen(c) → { say, pairs:[{a, b, say}], good, no }
===================================================================== */
function mPair(key, name, icon, theme, gen) {
  mReg(key, name, icon, theme, function (c) {
    const g = gen(c), n = g.pairs.length, gap = c.H * .86 / n, sz = clamp(Math.min(gap * .82, c.W * .22), 46, 150), ys = i => c.H * .07 + (i + .5) * gap;
    const svg = mk('div', '', `<svg width="${c.W}" height="${c.H}"></svg>`, c.stage, 'position:absolute;inset:0;pointer-events:none;z-index:2').firstChild;
    const lx = c.W * (c.W > c.H ? .24 : .2), rx = c.W * (c.W > c.H ? .76 : .8);
    const R = shuf(c.r, mRange(0, n - 1)).map((i, k) => { const el = mk('div', 'card', g.pairs[i].b, c.stage, `position:absolute;left:${rx - sz / 2}px;top:${ys(k) - sz / 2}px;width:${sz}px;height:${sz}px;font-size:${sz * .6}px;z-index:1`); el.i = i; return el; });
    const Lf = g.pairs.map((p, i) => { const el = mk('div', 'card', p.a, c.stage, `position:absolute;left:${lx - sz / 2}px;top:${ys(i) - sz / 2}px;width:${sz}px;height:${sz}px;font-size:${sz * .6}px;z-index:3;cursor:grab`); el.i = i; draggable(el, { targets: () => R.filter(r => !r.ok), onDrop: (t, e) => match(t, e) }); return el; });
    let got = 0;
    function match(t, el) {
      if (t.i !== el.i) { VO.say(g.no || L('Esa no es su pareja', 'That is not its match'), false); return false; }
      t.ok = true; el._locked = true; el.style.transform = ''; el.classList.remove('dragging');
      const s = c.stage.getBoundingClientRect(), a = el.getBoundingClientRect(), b = t.getBoundingClientRect(), col = PAL[got % 8];
      svg.insertAdjacentHTML('beforeend', `<line x1="${a.right - s.left}" y1="${a.top + a.height / 2 - s.top}" x2="${b.left - s.left}" y2="${b.top + b.height / 2 - s.top}" stroke="${col}" stroke-width="8" stroke-linecap="round" stroke-dasharray="2 14"/>`);
      el.style.background = t.style.background = '#c8f7c5'; AU.note(got % 8, .35); sparkleEl(t, 8); got++;
      if (g.pairs[el.i].say) VO.say(g.pairs[el.i].say, false);
      if (got === n) { setTimeout(() => VO.say(g.good || L('¡Todas las parejas juntas!', 'All matched!'), false), 600); setTimeout(c.done, 1100); }
      return true;
    }
    c.say(g.say);
    c.hint = () => Lf.find(e => !e._locked); c.solve = () => { Lf.forEach(e => { if (!e._locked) match(R.find(r => r.i === e.i), e); }); };
  });
}

/* =====================================================================
   MOTOR 4 · ORDENAR (tocar en el orden correcto)
   gen(c) → { say, seq:[{html, key, say}], top(c,n) → {fill(i)}, end(done), good, no, bubble, ghost }
===================================================================== */
function mOrder(key, name, icon, theme, gen) {
  mReg(key, name, icon, theme, function (c) {
    const g = gen(c), seq = g.seq, n = seq.length; let k = 0;
    let slots = [], custom = null;
    if (g.top) custom = g.top(c, n);
    else {
      const sw = Math.min(c.W * .9 / n * .9, c.H * .19, 110);
      const row = mk('div', '', '', c.stage, `position:absolute;left:2%;right:2%;top:8%;height:${sw}px;display:flex;justify-content:center;gap:${sw * .1}px`);
      slots = seq.map(it => mk('div', 'qslot', g.ghost ? `<span style="opacity:.25">${it.html}</span>` : '', row, `width:${sw}px;height:${sw}px;font-size:${sw * .6}px;border-radius:18px`));
    }
    const aT = c.H * (g.areaTop || .33), aH = c.H * .86 - aT, cols = Math.ceil(Math.sqrt(n * c.W / aH)), rows = Math.ceil(n / cols), cw = c.W * .92 / cols, ch = aH / rows, s = clamp(Math.min(cw, ch) * .76, 46, 130);
    const cells = shuf(c.r, mRange(0, cols * rows - 1)).slice(0, n);
    const items = shuf(c.r, seq).map((it, i) => {
      const cc = cells[i], x = c.W * .04 + (cc % cols + .5) * cw + (c.r() - .5) * (cw - s) * .5, y = aT + (Math.floor(cc / cols) + .5) * ch + (c.r() - .5) * (ch - s) * .4;
      const el = mk('div', 'card choice', it.html, c.stage, `position:absolute;left:${x - s / 2}px;top:${y - s / 2}px;width:${s}px;height:${s}px;font-size:${s * .58}px;z-index:3;${g.bubble ? `border-radius:50%;background:radial-gradient(circle at 30% 28%,#fff,${g.bubble});animation:bob ${2 + c.r() * 1.5}s ease-in-out ${-c.r() * 2}s infinite;` : ''}`);
      el.it = it; el.addEventListener('pointerdown', () => tap(el)); return el;
    });
    const same = (a, b) => (a.key != null ? a.key : a) === (b.key != null ? b.key : b);
    function tap(el) {
      if (G.finished || el._done || k >= n) return; markAct();
      if (!same(el.it, seq[k])) { mNo(el, g.no ? g.no(seq[k]) : L('Ese no va ahora', 'Not that one yet')); return; }
      el._done = true; AU.sfx(g.bubble ? 'pop' : 'ok'); AU.note(k % 12, .3); sparkleEl(el, 6); el.remove();
      if (custom) custom.fill(k, el.it); else { slots[k].innerHTML = el.it.html; slots[k].classList.add('ok'); bump(slots[k]); }
      if (el.it.say) VO.say(el.it.say, false); k++;
      if (k === n) { if (g.end) g.end(() => c.done()); else { setTimeout(() => VO.say(g.good || L('¡En orden!', 'In order!'), false), 500); setTimeout(c.done, 1000); } }
    }
    c.say(g.say);
    c.hint = () => k < n ? items.find(e => !e._done && same(e.it, seq[k])) : null;
    c.solve = () => { let t = 0; while (k < n && t++ < 50) { const e = c.hint(); if (!e) break; tap(e); } };
  });
}

/* =====================================================================
   MOTOR 5 · ARMAR (llevar cada pieza a su silueta)
   gen(c, S) → { say, board, parts:[{html, x, y, w, h, say, style}], good }
===================================================================== */
function mPlace(key, name, icon, theme, gen) {
  mReg(key, name, icon, theme, function (c) {
    const land = c.W > c.H, S = Math.floor(land ? Math.min(c.W * .54, c.H * .94) : Math.min(c.W * .94, c.H * .55));
    const bx = land ? c.W * .05 : (c.W - S) / 2, by = land ? (c.H - S) / 2 : c.H * .03;
    const board = mk('div', '', '', c.stage, `position:absolute;left:${bx}px;top:${by}px;width:${S}px;height:${S}px`);
    const g = gen(c, S); board.innerHTML = g.board || '';
    const ghosts = g.parts.map((p, i) => { const el = mk('div', 'pghost', p.html, board, `position:absolute;left:${p.x * S}px;top:${p.y * S}px;width:${p.w * S}px;height:${p.h * S}px;font-size:${Math.min(p.w, p.h) * S * .86}px;${p.style || ''}`); el.i = i; return el; });
    const tr = land ? { x: bx + S + c.W * .03, y: c.H * .05, w: c.W - bx - S - c.W * .05, h: c.H * .9 } : { x: c.W * .03, y: by + S + c.H * .02, w: c.W * .94, h: c.H - by - S - c.H * .1 };
    const n = g.parts.length, cols = Math.max(1, Math.round(Math.sqrt(n * tr.w / tr.h))), rows = Math.ceil(n / cols), cw = tr.w / cols, ch = tr.h / rows;
    const order = shuf(c.r, mRange(0, n - 1)); let got = 0;
    const pieces = order.map((i, k) => {
      const p = g.parts[i], sc = Math.min(1, cw * .86 / (p.w * S), ch * .86 / (p.h * S)), w = p.w * S * sc, h = p.h * S * sc, x = tr.x + (k % cols + .5) * cw, y = tr.y + (Math.floor(k / cols) + .5) * ch;
      const el = mk('div', 'ppiece', p.html, c.stage, `position:absolute;left:${x - w / 2}px;top:${y - h / 2}px;width:${w}px;height:${h}px;font-size:${Math.min(w, h) * .86}px;z-index:4;${p.style || ''}`);
      el.i = i; draggable(el, { targets: () => free(p), onDrop: (t, e) => put(t, e) }); return el;
    });
    function free(p) { return ghosts.filter(gh => !gh.classList.contains('on') && g.parts[gh.i].html === p.html); }
    function put(t, el) {
      el._locked = true; el.remove(); t.classList.add('on'); bump(t); AU.sfx('ok'); sparkleEl(t, 8); got++;
      if (g.parts[t.i].say) VO.say(g.parts[t.i].say, false);
      if (got === n) { setTimeout(() => { AU.sfx('magic'); VO.say(g.good || L('¡Quedó perfecto!', 'Perfect!'), false); }, 450); setTimeout(c.done, 1300); }
      return true;
    }
    c.say(g.say);
    c.hint = () => pieces.find(e => !e._locked); c.solve = () => pieces.forEach(e => { if (!e._locked) { const t = free(g.parts[e.i])[0]; if (t) put(t, e); } });
  });
}

/* =====================================================================
   MOTOR 6 · APILAR (preparar el pedido en orden)
   gen(c, ronda) → { say, layers:{id:{html(w), h, n}}, order:[ids], base(w), btns:[ids] }
===================================================================== */
function mStack(key, name, icon, theme, gen) {
  mReg(key, name, icon, theme, function (c) {
    const rounds = 2, dots = mDots(c, rounds); let round = 0, cur = null, k = 0, btns = [];
    const land = c.W > c.H, W0 = clamp(Math.min(c.W * (land ? .2 : .36), c.H * .26), 90, 220);
    const ord = mk('div', 'card', '', c.stage, `position:absolute;left:3%;top:8%;width:${W0 * .62}px;padding:8px 6px;flex-direction:column;z-index:2`);
    const build = mk('div', '', '', c.stage, `position:absolute;left:50%;bottom:${land ? 26 : 30}%;transform:translateX(-50%);width:${W0}px;display:flex;flex-direction:column-reverse;align-items:center`);
    const bar = mk('div', '', '', c.stage, 'position:absolute;left:2%;right:2%;bottom:3%;height:21%;display:flex;justify-content:center;align-items:center;gap:2%;z-index:3');
    function next() {
      dots(round); if (round >= rounds) { c.done(); return; }
      cur = gen(c, round); k = 0; build.innerHTML = '';
      const lay = id => cur.layers[id];
      ord.innerHTML = `<b style="font-size:13px;margin-bottom:4px">${L('Pedido', 'Order')}</b><div style="display:flex;flex-direction:column-reverse;align-items:center;width:100%">${cur.base ? `<div style="width:100%;line-height:0">${cur.base(W0 * .5)}</div>` : ''}${cur.order.map(id => `<div style="width:100%;line-height:0;display:flex;justify-content:center;margin-bottom:${lay(id).ov ? -lay(id).ov * W0 * .5 : 0}px">${lay(id).html(W0 * .5)}</div>`).join('')}</div>`;
      if (cur.base) mk('div', '', cur.base(W0), build, 'line-height:0');
      bar.innerHTML = ''; const bs = clamp(Math.min(c.H * .19, c.W * .9 / cur.btns.length * .85), 52, 120);
      btns = cur.btns.map(id => { const b = mk('div', 'card choice', `<div style="line-height:0;width:84%;display:flex;justify-content:center">${lay(id).html(bs * .8)}</div>`, bar, `width:${bs}px;height:${bs}px;flex-direction:column`); b.id = id; b.addEventListener('pointerdown', () => tap(b)); return b; });
      c.say(cur.say);
    }
    function tap(b) {
      if (G.finished || !cur || k >= cur.order.length) return; markAct();
      if (b.id !== cur.order[k]) { mNo(b, L('Mira el pedido: ¿qué va ahora?', 'Look at the order: what comes next?')); return; }
      const L0 = cur.layers[b.id]; const el = mk('div', '', L0.html(W0), build, `line-height:0;display:flex;justify-content:center;margin-bottom:${L0.ov ? -L0.ov * W0 : 0}px;animation:stackin .35s cubic-bezier(.3,1.5,.5,1)`);
      AU.sfx('drop'); AU.note(k % 8, .25); if (L0.n) VO.say(L0.n, false); k++;
      if (k === cur.order.length) { const q = cur; cur = null; setTimeout(() => { AU.sfx('magic'); sparkleEl(build, 14); VO.say(q.good || L('¡Pedido listo!', 'Order ready!'), false); }, 300); round++; setTimeout(next, 1700); }
    }
    next();
    c.hint = () => cur ? btns.find(b => b.id === cur.order[k]) : null;
    c.solve = () => { round = rounds; cur = null; next(); };
  });
}

/* =====================================================================
   JUEGOS DE PREGUNTAS (31)
===================================================================== */
const VOW = [['A', '🐝', 'abeja', '🍎', 'apple'], ['E', '🐘', 'elefante', '🥚', 'egg'], ['I', '🦎', 'iguana', '🍦', 'ice cream'], ['O', '🐻', 'oso', '🐙', 'octopus'], ['U', '🍇', 'uvas', '☂️', 'umbrella']];
mQuiz('vocales', ['Vocales', 'Vowels'], '🅰️', 'dulce', c => {
  const v = pick(c.r, VOW), n = [3, 3, 4, 4, 5][c.d];
  const others = c.d < 2 ? VOW.filter(x => x !== v).map(x => x[0]) : 'AEIOUBCDFGLMNPRST'.split('').filter(x => x !== v[0]);
  return { id: v[0], say: L(`Toca la vocal ${v[0]}`, `Touch the letter ${v[0]}`), good: L(`¡${v[0]} de ${v[2]}!`, `${v[0]} for ${v[4]}!`),
    opts: shuf(c.r, [v[0], ...sample(c.r, others, n - 1)]).map((t, i) => ({ html: mT(t, PAL[i % 8], 1.3), ok: t === v[0], no: L(`Esa es la ${t}`, `That is ${t}`) })),
    onOk: (b, top) => { top.style.display = 'flex'; top.innerHTML = mE(EN() ? v[3] : v[1], c.TH * .7) + mT(v[0], '#ff6fa8', 1); top.style.fontSize = c.TH * .6 + 'px'; bump(top); } };
});
const WORDS_ES = [['🐝', 'abeja'], ['⛵', 'barco'], ['🏠', 'casa'], ['🎲', 'dado'], ['🐘', 'elefante'], ['🍓', 'fresa'], ['🐱', 'gato'], ['🍦', 'helado'], ['🦎', 'iguana'], ['🦒', 'jirafa'], ['🥝', 'kiwi'], ['🌙', 'luna'], ['✋', 'mano'], ['☁️', 'nube'], ['🐻', 'oso'], ['🦆', 'pato'], ['🧀', 'queso'], ['🐭', 'ratón'], ['☀️', 'sol'], ['🚂', 'tren'], ['🍇', 'uvas'], ['🐄', 'vaca'], ['👞', 'zapato']];
const WORDS_EN = [['🍎', 'apple'], ['⚽', 'ball'], ['🐱', 'cat'], ['🐶', 'dog'], ['🥚', 'egg'], ['🐟', 'fish'], ['🐐', 'goat'], ['🎩', 'hat'], ['🍦', 'ice cream'], ['🎃', 'jack-o-lantern'], ['🔑', 'key'], ['🦁', 'lion'], ['🌙', 'moon'], ['👃', 'nose'], ['🦉', 'owl'], ['🐷', 'pig'], ['👸', 'queen'], ['🌈', 'rainbow'], ['☀️', 'sun'], ['🌳', 'tree'], ['☂️', 'umbrella'], ['🚐', 'van'], ['🐳', 'whale'], ['🦓', 'zebra']];
mQuiz('letrainicial', ['Primera letra', 'First letter'], '🔤', 'jardin', c => {
  const W = EN() ? WORDS_EN : WORDS_ES, w = pick(c.r, W), lt = w[1][0].toUpperCase(), n = [2, 3, 3, 4, 4][c.d];
  const others = [...new Set(W.map(x => x[1][0].toUpperCase()))].filter(x => x !== lt);
  return { id: w[1], top: mE(w[0], c.TH * .78), say: L(`¿Con qué letra empieza ${w[1]}?`, `What letter does ${w[1]} start with?`), good: L(`¡${cap(w[1])} empieza con ${lt}!`, `${cap(w[1])} starts with ${lt}!`),
    opts: shuf(c.r, [lt, ...sample(c.r, others, n - 1)]).map((t, i) => ({ html: mT(t, PAL[(i + 2) % 8], 1.25), ok: t === lt, no: L(`Esa es la ${t}`, `That is ${t}`) })) };
});
mQuiz('numeros', ['Números', 'Numbers'], '🔢', 'cielo', c => {
  const mx = [5, 9, 10, 12, 20][c.d], t = 1 + Math.floor(c.r() * mx), n = [3, 4, 4, 5, 5][c.d];
  return { id: t, say: L(`Toca el número ${numw(t)}`, `Touch number ${numw(t)}`), good: L(`¡El ${numw(t)}!`, `Number ${numw(t)}!`),
    opts: mNums(c, t, n, 1, mx).map((x, i) => ({ html: mT(x, PAL[(i * 3 + 1) % 8], x > 9 ? .95 : 1.3), ok: x === t, no: L(`Ese es el ${numw(x)}`, `That is ${numw(x)}`) })) };
});
mQuiz('masmenos', ['Más y menos', 'More or less'], '⚖️', 'jardin', c => {
  const n = [2, 2, 3, 3, 3][c.d], mx = [5, 6, 8, 9, 10][c.d], e = pick(c.r, ['🍎', '⭐', '🐟', '🎈', '🍪', '🌸', '🐞', '🚗']);
  let cs; do { cs = Array.from({ length: n }, () => 1 + Math.floor(c.r() * mx)); } while (new Set(cs).size < n);
  const more = c.d === 0 || c.r() < .5, t = more ? Math.max(...cs) : Math.min(...cs);
  return { say: more ? L('¿Dónde hay más?', 'Where are there more?') : L('¿Dónde hay menos?', 'Where are there fewer?'), good: L(`¡Sí! Aquí hay ${numw(t)}`, `Yes! There are ${numw(t)}`),
    opts: cs.map(k => ({ w: 1.3, ok: k === t, no: L(`Aquí hay ${numw(k)}`, `There are ${numw(k)} here`), html: `<div style="display:flex;flex-wrap:wrap;justify-content:center;align-content:center;gap:.06em;font-size:${k > 6 ? .27 : .34}em;width:94%;height:94%">${mE(e).repeat(k)}</div>` })) };
});
const mGroup = (e, k, px) => `<div style="display:flex;flex-wrap:wrap;justify-content:center;align-content:center;gap:4px;width:${px * 3.3}px">${mE(e, px).repeat(k)}</div>`;
mQuiz('sumas', ['Sumas', 'Adding'], '➕', 'granja', c => {
  const mx = [3, 5, 7, 10, 10][c.d], a = 1 + Math.floor(c.r() * (mx - 1)), b = 1 + Math.floor(c.r() * (mx - a)), s = a + b, e = pick(c.r, ['🍎', '🐥', '⭐', '🍓', '🐞', '🎈']), px = Math.min(c.TH * .26, c.W * .07);
  return { id: a + '+' + b, top: `${mGroup(e, a, px)}<b style="font-size:${px * 1.5}px;color:#ff6fa8">+</b>${mGroup(e, b, px)}`, say: L(`¿Cuánto es ${numw(a)} más ${numw(b)}?`, `What is ${numw(a)} plus ${numw(b)}?`), good: L(`¡${cap(numw(a))} más ${numw(b)} son ${numw(s)}!`, `${cap(numw(a))} plus ${numw(b)} is ${numw(s)}!`),
    opts: mNums(c, s, [3, 3, 4, 4, 4][c.d], 1, Math.max(5, s + 2)).map((x, i) => ({ html: mT(x, PAL[(i * 3 + 2) % 8], 1.2), ok: x === s, no: L('Cuenta otra vez', 'Count again') })) };
});
mQuiz('restas', ['Se fueron volando', 'Flying away'], '🐦', 'cielo', c => {
  const mx = [3, 5, 6, 8, 10][c.d], t = 2 + Math.floor(c.r() * (mx - 1)), k = 1 + Math.floor(c.r() * (t - 1)), res = t - k, px = Math.min(c.TH * .3, c.W * .8 / t / 1.2);
  return { id: t + '-' + k, top: `<div style="display:flex;gap:${px * .15}px;align-items:flex-end">${mRange(1, t).map(i => `<span class="emo fbird" style="font-size:${px}px;display:inline-block;transition:transform 1.2s ease-in,opacity 1.2s" data-fly="${i > res ? 1 : 0}">🐦</span>`).join('')}</div>`,
    say: L(`Había ${numw(t)} pajaritos y se fueron ${numw(k)} volando. ¿Cuántos quedan?`, `There were ${numw(t)} birds and ${numw(k)} flew away. How many are left?`), good: L(`¡Quedan ${numw(res)}!`, `${cap(numw(res))} left!`),
    onShow: top => setTimeout(() => top.querySelectorAll('[data-fly="1"]').forEach(b => { b.style.transform = `translate(${c.W * .3}px,-${c.H * .4}px) rotate(-20deg)`; b.style.opacity = '0'; AU.sfx('whoosh'); }), 1100),
    opts: mNums(c, res, [3, 3, 4, 4, 4][c.d], 0, Math.max(4, t)).map((x, i) => ({ html: mT(x, PAL[(i + 5) % 8], 1.2), ok: x === res, no: L('Cuenta los que se quedaron', 'Count the ones left') })) };
});
mQuiz('quefalta', ['¿Qué falta?', "What's missing?"], '❓', 'madera', c => {
  let seq; const d = c.d;
  if (d === 3) { const s0 = Math.floor(c.r() * 20); seq = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice(s0, s0 + 5).split(''); }
  else { const st = d === 4 ? 2 : 1, len = d === 0 ? 4 : 5, s0 = 1 + Math.floor(c.r() * (d < 2 ? 3 : 8)); seq = mRange(0, len - 1).map(i => s0 + i * st); }
  const mi = 1 + Math.floor(c.r() * (seq.length - 1)), ans = seq[mi], px = Math.min(c.TH * .55, c.W * .8 / seq.length / 1.2);
  const pool = typeof ans === 'number' ? mRange(Math.max(0, ans - 4), ans + 4).filter(x => x !== ans) : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(x => x !== ans && !seq.includes(x));
  return { id: seq.join(','), top: seq.map((x, i) => `<div class="qslot" style="width:${px}px;height:${px}px;font-size:${px * .55}px;${i === mi ? '' : 'border-style:solid;border-color:#c9b8ef;background:#fff;color:#3a2c5c'}" ${i === mi ? 'data-miss' : ''}>${i === mi ? '?' : x}</div>`).join(''),
    say: typeof ans === 'number' ? L('¿Qué número falta?', 'Which number is missing?') : L('¿Qué letra falta?', 'Which letter is missing?'), good: L(`¡Falta el ${typeof ans === 'number' ? numw(ans) : ans}!`, `${typeof ans === 'number' ? cap(numw(ans)) : ans} is missing!`),
    onOk: (b, top) => { const m = top.querySelector('[data-miss]'); m.textContent = ans; m.classList.add('ok'); bump(m); },
    opts: shuf(c.r, [ans, ...sample(c.r, pool, [2, 3, 3, 4, 4][d] - 1)]).map((x, i) => ({ html: mT(x, PAL[(i + 1) % 8], 1.15), ok: x === ans, no: L('Mira la fila otra vez', 'Look at the row again') })) };
});
const OPP = [[['🔥', 'caliente', 'hot'], ['❄️', 'frío', 'cold']], [['☀️', 'día', 'day'], ['🌙', 'noche', 'night']], [['😀', 'feliz', 'happy'], ['😢', 'triste', 'sad']], [['🐘', 'grande', 'big'], ['🐭', 'pequeño', 'small']], [['🐇', 'rápido', 'fast'], ['🐢', 'lento', 'slow']], [['⬆️', 'arriba', 'up'], ['⬇️', 'abajo', 'down']], [['👶', 'joven', 'young'], ['👴', 'viejo', 'old']]];
mQuiz('opuestos', ['Opuestos', 'Opposites'], '🔄', 'dulce', c => {
  const p = pick(c.r, OPP), dir = c.r() < .5 ? 0 : 1, q = p[dir], a = p[1 - dir], w = EN() ? q[2] : q[1], aw = EN() ? a[2] : a[1];
  const others = OPP.filter(x => x !== p).flat().map(x => x[0]);
  return { id: q[1], top: `<div style="display:flex;flex-direction:column;align-items:center">${mE(q[0], c.TH * .62)}<b style="font-size:${c.TH * .16}px;background:#fff;border-radius:999px;padding:0 16px;margin-top:4px">${w}</b></div>`,
    say: L(`¿Qué es lo contrario de ${w}?`, `What is the opposite of ${w}?`), good: L(`¡${cap(aw)}!`, `${cap(aw)}!`),
    opts: shuf(c.r, [a[0], ...sample(c.r, others, [2, 3, 3, 4, 4][c.d] - 1)]).map(e => ({ html: mE(e), ok: e === a[0] })) };
});
const SND_K = ['perro', 'gato', 'vaca', 'oveja', 'cerdito', 'pato', 'pollito', 'rana', 'leon', 'raton', 'elefante', 'buho', 'mono', 'tigre', 'oso'];
mQuiz('sonidos', ['¿Quién suena?', "Who's that sound?"], '👂', 'granja', c => {
  const ks = sample(c.r, SND_K, [2, 3, 3, 4, 4][c.d]), k = ks[0], an = ANIMALS.find(a => a.k === k);
  return { id: k, top: `<div class="card" style="width:${c.TH * .62}px;height:${c.TH * .62}px;border-radius:50%;font-size:${c.TH * .36}px;animation:breathe 1.2s infinite">${mE('🔊')}</div>`,
    say: L('¿Quién hace este sonido? Escucha', 'Who makes this sound? Listen'), good: L(`¡Es ${the(an)}! ${an.s}`, `It's ${the(an)}! ${an.se}`), replay: () => AU.animal(k), onShow: () => setTimeout(() => AU.animal(k), 1600),
    opts: shuf(c.r, ks).map(x => ({ html: mA(x), ok: x === k, tap: () => AU.animal(x), no: L('Escucha otra vez: toca el parlante', 'Listen again: tap the speaker') })) };
});
const HAB = [{ e: '🌊', n: ['el mar', 'the sea'], a: ['🐟', '🐙', '🐬', '🦀', '🐳', '🦈'] }, { e: '🚜', n: ['la granja', 'the farm'], a: ['🐄', '🐖', '🐔', '🐑', '🐴'] }, { e: '🌴', n: ['la selva', 'the jungle'], a: ['🐒', '🦁', '🐯', '🐘', '🦜'] }, { e: '🌲', n: ['el bosque', 'the forest'], a: ['🦉', '🐿️', '🦊', '🦌', '🐻'] }, { e: '❄️', n: ['el hielo', 'the ice'], a: ['🐧'] }];
mQuiz('habitat', ['¿Dónde vive?', 'Where does it live?'], '🏝️', 'bosque', c => {
  const hs = sample(c.r, HAB, [2, 3, 3, 4, 5][c.d]), h = hs[0], e = pick(c.r, h.a);
  return { id: e, top: mE(e, c.TH * .75), say: L('¿Dónde vive este animal?', 'Where does this animal live?'), good: L(`¡Vive en ${h.n[0]}!`, `It lives in ${h.n[1]}!`),
    opts: shuf(c.r, hs).map(x => ({ ok: x === h, html: `<div style="display:flex;flex-direction:column;align-items:center">${mE(x.e)}<small style="font-size:.26em;font-weight:800;color:#3a2c5c">${L(x.n[0], x.n[1])}</small></div>`, no: L(`No vive en ${x.n[0]}`, `It doesn't live in ${x.n[1]}`) })) };
});
const MIX = [[0, 2, 4], [1, 2, 3], [0, 1, 5], [0, 'W', 6], [1, 'W', 7]];
mQuiz('mezclas', ['Mezcla colores', 'Mix colors'], '🎨', 'dulce', c => {
  const m = pick(c.r, MIX.slice(0, c.d < 2 ? 3 : 5)), A = COLORS[m[0]], B = m[1] === 'W' ? WHITE : COLORS[m[1]], R = COLORS[m[2]], px = c.TH * .5;
  const pool = COLORS.filter(x => x !== R && x !== A && x !== B);
  return { id: m.join(), top: `${blobSV(A, px + 'px')}<b style="font-size:${px * .6}px;color:#3a2c5c">+</b>${blobSV(B, px + 'px')}<b style="font-size:${px * .6}px;color:#3a2c5c">=</b><div data-res class="qslot" style="width:${px}px;height:${px}px;font-size:${px * .5}px">?</div>`,
    say: L(`Si mezclamos ${colorName(A)} y ${colorName(B)}, ¿qué color sale?`, `If we mix ${colorName(A)} and ${colorName(B)}, what color do we get?`), good: L(`¡Sale ${colorName(R)}!`, `We get ${colorName(R)}!`),
    onOk: (b, top) => { const s = top.querySelector('[data-res]'); s.outerHTML = blobSV(R, px + 'px'); },
    opts: shuf(c.r, [R, ...sample(c.r, pool, [2, 3, 3, 4, 4][c.d] - 1)]).map(x => ({ html: blobSV(x), ok: x === R, no: L(`Ese es ${colorName(x)}`, `That is ${colorName(x)}`) })) };
});
const BODY = [['👂', ['escuchamos', 'hear'], ['las orejas', 'our ears']], ['👃', ['olemos', 'smell'], ['la nariz', 'our nose']], ['👀', ['vemos', 'see'], ['los ojos', 'our eyes']], ['👄', ['comemos', 'eat'], ['la boca', 'our mouth']], ['✋', ['aplaudimos', 'clap'], ['las manos', 'our hands']], ['🦶', ['caminamos', 'walk'], ['los pies', 'our feet']]];
mQuiz('cuerpo', ['Mi cuerpo', 'My body'], '🧒', 'dulce', c => {
  const bs = sample(c.r, BODY, [3, 3, 4, 5, 6][c.d]), b = bs[0];
  return { id: b[0], say: L(`¿Con qué ${b[1][0]}?`, `What do we ${b[1][1]} with?`), good: L(`¡Con ${b[2][0]}!`, `With ${b[2][1]}!`), opts: shuf(c.r, bs).map(x => ({ html: mE(x[0]), ok: x === b })) };
});
const JOBS = [['👩‍🚒', '🔥', ['¿Quién apaga el fuego?', 'Who puts out fires?'], ['la bombera', 'the firefighter']], ['👨‍🍳', '🍳', ['¿Quién cocina en el restaurante?', 'Who cooks at the restaurant?'], ['el cocinero', 'the chef']], ['👩‍⚕️', '🤒', ['¿Quién nos cura cuando estamos enfermos?', 'Who helps us when we are sick?'], ['la doctora', 'the doctor']], ['👨‍🌾', '🌽', ['¿Quién siembra las verduras?', 'Who grows vegetables?'], ['el granjero', 'the farmer']], ['👮', '🚦', ['¿Quién cuida la calle?', 'Who keeps the street safe?'], ['el policía', 'the police officer']], ['👷', '🧱', ['¿Quién construye las casas?', 'Who builds houses?'], ['el obrero', 'the builder']], ['👩‍🏫', '📚', ['¿Quién enseña en la escuela?', 'Who teaches at school?'], ['la profesora', 'the teacher']], ['👨‍🚀', '🚀', ['¿Quién viaja al espacio?', 'Who travels to space?'], ['el astronauta', 'the astronaut']]];
mQuiz('oficios', ['Oficios', 'Jobs'], '👩‍🚒', 'ciudad', c => {
  const js = sample(c.r, JOBS, [2, 3, 3, 4, 4][c.d]), j = js[0];
  return { id: j[0], top: mE(j[1], c.TH * .6), say: L(j[2][0], j[2][1]), good: L(`¡${cap(j[3][0])}!`, `${cap(j[3][1])}!`), opts: shuf(c.r, js).map(x => ({ html: mE(x[0]), ok: x === j })) };
});
const GRP = { fruta: { n: ['una fruta', 'a fruit'], e: ['🍎', '🍌', '🍓', '🍍', '🍊', '🍇', '🍐', '🍉', '🍒'] }, animal: { n: ['un animal', 'an animal'], e: ['🐶', '🐱', '🐮', '🐷', '🐸', '🐵', '🐰', '🐻'] }, vehiculo: { n: ['un vehículo', 'a vehicle'], e: ['🚗', '🚌', '🚂', '✈️', '🚲', '⛵', '🚒', '🚜'] }, ropa: { n: ['ropa', 'clothing'], e: ['👕', '👖', '👗', '🧦', '👟', '🎩', '🧣', '🧤'] } };
mQuiz('intruso', ['El que no va', 'Odd one out'], '🕵️', 'jardin', c => {
  const ks = Object.keys(GRP), gk = pick(c.r, ks), g2 = pick(c.r, ks.filter(x => x !== gk)), n = [3, 4, 4, 5, 5][c.d], odd = pick(c.r, GRP[g2].e);
  return { say: L(`¿Cuál no es ${GRP[gk].n[0]}?`, `Which one is not ${GRP[gk].n[1]}?`), good: L('¡Ese no va con los demás!', 'That one does not belong!'),
    opts: shuf(c.r, [odd, ...sample(c.r, GRP[gk].e, n - 1)]).map(e => ({ html: mE(e), ok: e === odd, no: L(`Ese sí es ${GRP[gk].n[0]}`, `That one is ${GRP[gk].n[1]}`) })) };
});
const TLQ = [{ k: 0, s: ['¿Qué color nos dice ALTO?', 'Which color means STOP?'], g: ['¡Rojo! Nos detenemos', 'Red! We stop'] }, { k: 1, s: ['¿Qué color nos dice CUIDADO?', 'Which color means CAREFUL?'], g: ['¡Amarillo! Con mucho cuidado', 'Yellow! Be careful'] }, { k: 2, s: ['¿Qué color nos dice que podemos AVANZAR?', 'Which color means GO?'], g: ['¡Verde! Ahora sí avanzamos', 'Green! Now we go'] }];
mQuiz('semaforo', ['El semáforo', 'Traffic light'], '🚦', 'ciudad', c => {
  const q = pick(c.r, TLQ), cols = ['#ff3b3b', '#ffcc00', '#2ee06b'];
  return { id: q.k, top: tlightSV(-1, c.TH * .95), say: L(q.s[0], q.s[1]), good: L(q.g[0], q.g[1]), onOk: (b, top) => { top.innerHTML = tlightSV(q.k, c.TH * .95); },
    opts: shuf(c.r, [0, 1, 2]).map(i => ({ ok: i === q.k, html: `<div style="width:70%;height:70%;border-radius:50%;background:${cols[i]};box-shadow:inset 0 -8px 0 rgba(0,0,0,.2)"></div>` })) };
});
const HEALTHY = ['🍎', '🥦', '🥕', '🍌', '🥛', '🥗', '🍇', '🐟', '🍓', '🥑'], TREATS = ['🍭', '🍟', '🍩', '🍬', '🥤', '🍔', '🍰', '🍫'];
mQuiz('saludable', ['Comida sana', 'Healthy food'], '🥦', 'cocina', c => {
  const h = pick(c.r, HEALTHY);
  return { id: h, say: L('¿Cuál es más saludable?', 'Which one is healthier?'), good: L('¡Sí! Eso nos hace fuertes', 'Yes! That makes us strong'),
    opts: shuf(c.r, [h, ...sample(c.r, TREATS, [1, 1, 2, 2, 3][c.d])]).map(e => ({ html: mE(e), ok: e === h, no: L('Esa es una golosina, solo de vez en cuando', 'That is a treat, just once in a while') })) };
});
mQuiz('reloj', ['El reloj', 'Telling time'], '🕒', 'cielo', c => {
  const h = 1 + Math.floor(c.r() * 12), half = c.d >= 3 && c.r() < .5, m = half ? 30 : 0, hs = [h, ...sample(c.r, mRange(1, 12).filter(x => x !== h), [2, 3, 3, 4, 4][c.d] - 1)];
  const es = h === 1 ? `¡Es la una${half ? ' y media' : ' en punto'}!` : `¡Son las ${numw(h)}${half ? ' y media' : ' en punto'}!`;
  return { id: h + ':' + m, top: clockSV(h, m, c.TH * .95), say: L('¿Qué hora marca el reloj?', 'What time does the clock show?'), good: L(es, `It's ${numw(h)}${half ? ' thirty' : " o'clock"}!`),
    opts: shuf(c.r, hs).map((x, i) => ({ w: 1.5, html: mT(`${x}:${half ? '30' : '00'}`, PAL[(i + 3) % 8], .78), ok: x === h, no: L('Mira la aguja corta', 'Look at the short hand') })) };
});
mQuiz('dados', ['Dados', 'Dice'], '🎲', 'madera', c => {
  const two = c.d >= 2, a = 1 + Math.floor(c.r() * (c.d === 0 ? 3 : 6)), b = two ? 1 + Math.floor(c.r() * 6) : 0, s = a + b, px = c.TH * .7;
  return { id: a + '-' + b, top: dieSV(a, px + 'px') + (two ? dieSV(b, px + 'px', '#ffe1ef') : ''), say: two ? L('¿Cuántos puntos hay en total?', 'How many dots in total?') : L('¿Cuántos puntos tiene el dado?', 'How many dots are on the die?'), good: L(`¡${cap(numw(s))} puntos!`, `${cap(numw(s))} dots!`),
    opts: mNums(c, s, [3, 3, 4, 4, 4][c.d], 1, two ? 12 : 6).map((x, i) => ({ html: mT(x, PAL[(i + 4) % 8], 1.2), ok: x === s, no: L('Cuenta los puntitos', 'Count the dots') })) };
});
const SHOBJ = [['⚽', '🍪', '🌕', '🍩', '🏀', '🍊'], ['🎁', '📦', '🖼️', '🔲'], ['🍕', '⛺', '🔺', '📐'], ['⭐', '🌟'], ['❤️', '💖', '💝']];
mQuiz('formasobjetos', ['Formas a mi alrededor', 'Shapes around me'], '🔺', 'ciudad', c => {
  const ids = sample(c.r, [0, 1, 2, 3, 4], [2, 3, 3, 4, 4][c.d]), si = ids[0], col = PAL[si];
  return { id: si, top: shapeSV(SHAPES[si], col, c.TH * .78 + 'px'), say: L(`¿Qué tiene forma de ${SHAPES[si].n}?`, `What is shaped like a ${SHAPES[si].en}?`), good: L(`¡Sí! Parece ${the(SHAPES[si])}`, `Yes! Like a ${SHAPES[si].en}!`),
    opts: shuf(c.r, ids).map(i => ({ html: mE(pick(c.r, SHOBJ[i])), ok: i === si })) };
});
const INST = [{ e: '🥁', n: ['el tambor', 'the drum'], s: () => { AU.noise(.25, .7, 130, 0, 1, 'lowpass'); AU.tone(80, .3, 'sine', .45, 0, 45); AU.noise(.2, .5, 150, .28, 1, 'lowpass'); AU.tone(80, .25, 'sine', .4, .28, 45); } },
  { e: '🎸', n: ['la guitarra', 'the guitar'], s: () => [196, 247, 294, 392].forEach((f, i) => AU.tone(f, .9, 'triangle', .22, i * .09)) },
  { e: '🎺', n: ['la trompeta', 'the trumpet'], s: () => { AU.voc({ type: 'sawtooth', f: [[0, 392], [.4, 392], [.45, 523]], dur: .8, vol: .16, filt: ['lowpass', 1800, 2] }); } },
  { e: '🎹', n: ['el piano', 'the piano'], s: () => [0, 2, 4, 7].forEach((n, i) => setTimeout(() => AU.note(n, .45), i * 160)) },
  { e: '🎻', n: ['el violín', 'the violin'], s: () => AU.voc({ type: 'sawtooth', f: [[0, 440], [.5, 494], [1, 523]], dur: 1, vol: .13, vib: [6, 7], filt: ['lowpass', 2600, 1], att: .15 }) },
  { e: '🎷', n: ['el saxofón', 'the saxophone'], s: () => AU.voc({ type: 'square', f: [[0, 233], [.35, 262], [.7, 233]], dur: .9, vol: .11, filt: ['lowpass', 1100, 3], vib: [5, 4] }) }];
mQuiz('instrumentos', ['Instrumentos', 'Instruments'], '🎺', 'noche', c => {
  const is = sample(c.r, INST, [2, 3, 3, 4, 4][c.d]), t = is[0];
  return { id: t.e, top: `<div class="card" style="width:${c.TH * .62}px;height:${c.TH * .62}px;border-radius:50%;font-size:${c.TH * .36}px;animation:breathe 1.2s infinite">${mE('🔊')}</div>`, replay: () => { AU.init(); t.s(); }, onShow: () => setTimeout(() => t.s(), 1800),
    say: L('¿Qué instrumento suena así? Escucha', 'Which instrument sounds like this? Listen'), good: L(`¡Es ${t.n[0]}!`, `It's ${t.n[1]}!`),
    opts: shuf(c.r, is).map(x => ({ html: mE(x.e), ok: x === t, tap: () => x.s(), no: L(`Ese es ${x.n[0]}`, `That is ${x.n[1]}`) })) };
});
const HEAVY = [['🐘', '🐭'], ['🚚', '⚽'], ['🏠', '🎈'], ['🐻', '🐝'], ['🍉', '🍒'], ['📚', '✏️'], ['🐄', '🐥'], ['🚂', '🧸']];
mQuiz('balanza', ['La balanza', 'The scale'], '⚖️', 'madera', c => {
  const p = pick(c.r, HEAVY), more = c.d === 0 || c.r() < .55, flip = c.r() < .5, L0 = flip ? p[1] : p[0], R0 = flip ? p[0] : p[1], tilt = flip ? 12 : -12, px = c.TH;
  const svg = `<svg viewBox="0 0 200 120" width="${px * 1.7}" height="${px}"><path d="M92 112H108L100 40Z" fill="#a8481b"/><rect x="70" y="108" width="60" height="10" rx="4" fill="#8a3d16"/><g transform="rotate(${tilt} 100 40)"><rect x="20" y="36" width="160" height="8" rx="4" fill="#c9822b"/><path d="M28 44L14 70H54L40 44M160 44L146 70H186L172 44" stroke="#8a3d16" stroke-width="2" fill="none"/><path d="M8 70H60Q56 82 34 82Q12 82 8 70ZM140 70H192Q188 82 166 82Q144 82 140 70Z" fill="#ffd23f" stroke="#d19b00" stroke-width="3"/><text x="34" y="68" font-size="30" text-anchor="middle">${L0}</text><text x="166" y="68" font-size="30" text-anchor="middle">${R0}</text></g><circle cx="100" cy="40" r="6" fill="#8a3d16"/></svg>`;
  return { id: p[0] + more, top: svg, say: more ? L('¿Qué pesa más?', 'Which one is heavier?') : L('¿Qué pesa menos?', 'Which one is lighter?'), good: more ? L('¡Sí! Por eso baja la balanza', 'Yes! That side goes down') : L('¡Sí! Por eso sube la balanza', 'Yes! That side goes up'),
    opts: shuf(c.r, p).map(e => ({ html: mE(e), ok: e === (more ? p[0] : p[1]), no: L('Mira hacia dónde baja la balanza', 'Look which side goes down') })) };
});
mQuiz('vasos', ['Vasos de agua', 'Glasses of water'], '🥛', 'cocina', c => {
  const n = [2, 3, 3, 4, 4][c.d], kinds = c.d === 0 ? ['lleno', 'vacio'] : ['lleno', 'vacio', 'mas', 'menos'], kd = pick(c.r, kinds);
  let lv; if (kd === 'lleno') lv = [1, ...sample(c.r, [.15, .35, .55, .7], n - 1)]; else if (kd === 'vacio') lv = [0, ...sample(c.r, [.3, .5, .7, 1], n - 1)]; else lv = sample(c.r, [.1, .3, .5, .7, .9], n);
  const t = kd === 'lleno' ? 1 : kd === 'vacio' ? 0 : kd === 'mas' ? Math.max(...lv) : Math.min(...lv);
  const S2 = { lleno: ['Toca el vaso lleno', 'Touch the full glass'], vacio: ['Toca el vaso vacío', 'Touch the empty glass'], mas: ['¿Cuál tiene más agua?', 'Which has more water?'], menos: ['¿Cuál tiene menos agua?', 'Which has less water?'] }[kd];
  return { id: kd, say: L(S2[0], S2[1]), good: L('¡Muy bien observado!', 'Well spotted!'), opts: shuf(c.r, lv).map(x => ({ html: glassSV(x), ok: x === t, no: L('Mira el agua de cada vaso', 'Look at the water in each glass') })) };
});
mQuiz('torres', ['Torres de bloques', 'Block towers'], '🧱', 'madera', c => {
  const mx = [4, 5, 6, 7, 8][c.d], n = [2, 3, 3, 4, 4][c.d], hs = sample(c.r, mRange(1, mx), n), hi = c.r() < .5 || c.d === 0, t = hi ? Math.max(...hs) : Math.min(...hs);
  return { say: hi ? L('Toca la torre más alta', 'Touch the tallest tower') : L('Toca la torre más baja', 'Touch the shortest tower'), good: L(`¡Esa tiene ${numw(t)} bloques!`, `That one has ${numw(t)} blocks!`),
    opts: hs.map(h => ({ html: towerSV(h, mx), ok: h === t, w: .8, no: L('Compara las alturas', 'Compare the heights') })) };
});
mQuiz('gusanos', ['Gusanitos', 'Little worms'], '🐛', 'jardin', c => {
  const n = [2, 3, 3, 3, 4][c.d], ls = sample(c.r, mRange(2, 8), n), lg = c.r() < .5 || c.d === 0, t = lg ? Math.max(...ls) : Math.min(...ls);
  return { say: lg ? L('Toca el gusanito más largo', 'Touch the longest worm') : L('Toca el gusanito más corto', 'Touch the shortest worm'), good: L('¡Ese es!', "That's it!"),
    opts: ls.map((l, i) => ({ w: 2.4, html: wormSV(l, PAL[(i * 3 + 3) % 8]), ok: l === t, no: L('Compara lo largos que son', 'Compare their length') })) };
});
const MOODK = ['happy', 'joy', 'sad', 'angry', 'wow', 'sleepy'];
mQuiz('gemelos', ['Gemelos', 'Twins'], '👯', 'dulce', c => {
  const k = pick(c.r, Object.keys(AN)), ms = sample(c.r, MOODK, [3, 3, 4, 4, 5][c.d]), m = ms[0];
  return { top: `<div class="card" style="width:${c.TH * .82}px;height:${c.TH * .82}px;box-shadow:0 0 0 6px #ffd23f,0 7px 0 rgba(0,0,0,.12)">${mA(k, m)}</div>`, say: L('Encuentra el que es igualito', 'Find the exact twin'), good: L('¡Son gemelos!', "They're twins!"),
    opts: shuf(c.r, ms).map(x => ({ html: mA(k, x), ok: x === m, no: L('Mira bien su carita', 'Look closely at the face') })) };
});
const AD = [['🥚', '🐣'], ['🌱', '🌻'], ['🌧️', '🌈'], ['🐛', '🦋'], ['🌙', '☀️'], ['⛄', '💧'], ['👶', '🧒'], ['🌰', '🌳'], ['🍞', '🥪'], ['🎈', '💥']];
mQuiz('antesdespues', ['¿Qué pasa después?', 'What happens next?'], '⏭️', 'jardin', c => {
  const p = pick(c.r, AD), others = AD.filter(x => x !== p).map(x => x[1]), px = c.TH * .62;
  return { id: p[0], top: `${mE(p[0], px)}<b style="font-size:${px * .5}px;color:#ff6fa8">➜</b><div data-res class="qslot" style="width:${px}px;height:${px}px;font-size:${px * .5}px">?</div>`, say: L('¿Qué pasa después?', 'What happens next?'), good: L('¡Así es!', "That's right!"),
    onOk: (b, top) => { const s = top.querySelector('[data-res]'); s.innerHTML = mE(p[1], px * .7); s.classList.add('ok'); },
    opts: shuf(c.r, [p[1], ...sample(c.r, others, [2, 3, 3, 4, 4][c.d] - 1)]).map(e => ({ html: mE(e), ok: e === p[1] })) };
});
const bushSV = `<svg viewBox="0 0 200 110" width="100%" style="position:absolute;left:-8%;width:116%;bottom:-4%;transition:transform .8s cubic-bezier(.5,-.3,.6,1)" class="bush"><path d="M10 110Q0 70 30 62Q30 30 66 34Q80 6 112 20Q140 4 158 34Q196 34 188 70Q204 92 190 110Z" fill="#4cbb4a" stroke="#2f8a35" stroke-width="5"/><circle cx="60" cy="70" r="6" fill="#ff5f7a"/><circle cx="120" cy="56" r="6" fill="#ff5f7a"/><circle cx="160" cy="82" r="6" fill="#ff5f7a"/></svg>`;
mQuiz('escondido', ['¿Quién se esconde?', "Who's hiding?"], '🌳', 'bosque', c => {
  const ks = sample(c.r, Object.keys(AN), [2, 3, 3, 4, 4][c.d]), k = ks[0], it = ANIMALS.find(a => a.k === k) || { n: k, en: k, a: 'el' }, px = c.TH * .95;
  return { id: k, top: `<div style="position:relative;width:${px}px;height:${px}px;overflow:hidden"><div style="position:absolute;inset:0;transform:translateY(${c.d > 2 ? 30 : 18}%)" data-an>${animalSVG(k, 'wow')}</div>${bushSV}</div>`,
    say: L('¿Quién se esconde detrás del arbusto?', 'Who is hiding behind the bush?'), good: L(`¡Es ${the(it)}!`, `It's ${the(it)}!`),
    onOk: (b, top) => { top.querySelector('.bush').style.transform = 'translateY(110%)'; top.querySelector('[data-an]').innerHTML = animalSVG(k, 'joy'); top.querySelector('[data-an]').style.transform = ''; AU.animal(k); },
    opts: shuf(c.r, ks).map(x => ({ html: mA(x), ok: x === k, no: L('Mira las orejitas', 'Look at the ears') })) };
});
const CITEMS = [...FRUITS, { e: '🥕', n: 'zanahoria', en: 'carrot', a: 'la', c: 'naranja' }, { e: '🍆', n: 'berenjena', en: 'eggplant', a: 'la', c: 'morado' }, { e: '🥦', n: 'brócoli', en: 'broccoli', a: 'el', c: 'verde' }, { e: '🌽', n: 'choclo', en: 'corn', a: 'el', c: 'amarillo' }, { e: '🌸', n: 'flor', en: 'flower', a: 'la', c: 'rosado' }, { e: '💙', n: 'corazón', en: 'heart', a: 'el', c: 'azul' }, { e: '🐳', n: 'ballena', en: 'whale', a: 'la', c: 'celeste' }];
mQuiz('colorobjeto', ['¿De qué color es?', 'What color is it?'], '🌈', 'jardin', c => {
  const it = pick(c.r, CITEMS), col = mCol(it.c), pool = COLORS.filter(x => x !== col);
  return { id: it.e, top: mE(it.e, c.TH * .78), say: L(`¿De qué color es ${the(it)}?`, `What color is ${the(it)}?`), good: L(`¡${cap(colorName(col))}!`, `${cap(colorName(col))}!`),
    opts: shuf(c.r, [col, ...sample(c.r, pool, [2, 3, 3, 4, 4][c.d] - 1)]).map(x => ({ html: blobSV(x), ok: x === col, no: L(`Ese es ${colorName(x)}`, `That is ${colorName(x)}`) })) };
});
const TOYS = ['🧸', '🚂', '⚽', '🎨', '🦄', '🚀', '🎺', '🪁', '🤖', '🎈', '🦖', '🏆'].filter(e => e !== '🪁');
mQuiz('regalos', ['Regalos sorpresa', 'Surprise gifts'], '🎁', 'dulce', c => {
  const cs = sample(c.r, COLORS, [2, 3, 3, 4, 5][c.d]), t = cs[0], toy = pick(c.r, TOYS);
  return { id: t.n, say: L(`Abre el regalo ${colorName(t)}`, `Open the ${colorName(t)} gift`), good: L('¡Sorpresa!', 'Surprise!'), wait: 1600,
    onOk: b => { AU.sfx('magic'); b.innerHTML = mE(toy); bump(b, 'spin1'); },
    opts: shuf(c.r, cs).map(x => ({ html: giftSV(x), ok: x === t, no: L(`Ese regalo es ${colorName(x)}`, `That gift is ${colorName(x)}`) })) };
});
mQuiz('domino', ['Dominó', 'Dominoes'], '🁫', 'madera', c => {
  const k = 1 + Math.floor(c.r() * [3, 4, 6, 6, 6][c.d]), px = Math.min(c.TH * .7, c.W * .34);
  return { id: k, top: `<div style="display:flex;background:#fff;border:5px solid #2b2140;border-radius:18px;padding:6px;gap:6px">${dieSV(k, px + 'px', '#fff')}<div style="width:4px;background:#2b2140"></div><div data-res class="qslot" style="width:${px}px;height:${px}px;font-size:${px * .5}px">?</div></div>`,
    say: L('Completa el dominó: busca el mismo número de puntos', 'Complete the domino: find the same number of dots'), good: L(`¡${cap(numw(k))} y ${numw(k)}!`, `${cap(numw(k))} and ${numw(k)}!`),
    onOk: (b, top) => { top.querySelector('[data-res]').outerHTML = dieSV(k, px + 'px', '#fff'); },
    opts: mNums(c, k, [3, 3, 4, 4, 5][c.d], 1, 6).map(x => ({ html: dieSV(x), ok: x === k, no: L('Cuenta los puntos', 'Count the dots') })) };
});
mQuiz('eldiferente', ['El diferente', 'The different one'], '🔎', 'dulce', c => {
  const n = [3, 4, 4, 5, 6][c.d], ks = sample(c.r, Object.keys(AN), 2), subtle = c.d >= 2, m = pick(c.r, MOODK), m2 = pick(c.r, MOODK.filter(x => x !== m)), odd = Math.floor(c.r() * n);
  return { say: L('¿Cuál es diferente?', 'Which one is different?'), good: L('¡Lo encontraste!', 'You found it!'),
    opts: mRange(0, n - 1).map(i => ({ html: i === odd ? (subtle ? mA(ks[0], m2) : mA(ks[1], m)) : mA(ks[0], m), ok: i === odd, no: L('Ese es igual a los otros', 'That one is the same') })) };
});

/* =====================================================================
   JUEGOS DE CLASIFICAR (13)
===================================================================== */
const bl = (e, es, en) => lab => `${mE(e, lab)}<span>${L(es, en)}</span>`;
const itemsOf = (c, list, k, n) => sample(c.r, list, n).map(e => ({ k, html: typeof e === 'string' && !e.startsWith('<') ? mE(e) : e }));
mSort('frutasverduras', ['Frutas y verduras', 'Fruits and veggies'], '🥕', 'cocina', c => { const n = [2, 3, 3, 4, 4][c.d];
  return { say: L('Pon las frutas en una canasta y las verduras en la otra', 'Fruits in one basket, vegetables in the other'), bins: [{ k: 'f', html: bl('🧺', 'Frutas', 'Fruits') }, { k: 'v', html: bl('🥬', 'Verduras', 'Veggies') }],
    items: [...itemsOf(c, FRUITS.map(f => f.e), 'f', n), ...itemsOf(c, ['🥕', '🥦', '🌽', '🥒', '🍆', '🥔', '🥬'], 'v', n)] }; });
mSort('reciclaje', ['Reciclar', 'Recycling'], '♻️', 'ciudad', c => { const three = c.d >= 2, n = [2, 3, 2, 3, 3][c.d];
  const B = [{ k: 'p', html: bl('📦', 'Papel', 'Paper'), style: 'background:#d6e8ff' }, { k: 'l', html: bl('🧴', 'Plástico', 'Plastic'), style: 'background:#fff3b0' }, { k: 'o', html: bl('🍂', 'Orgánico', 'Organic'), style: 'background:#d7f5d0' }];
  const I = { p: ['📰', '📦', '✉️', '📄', '🧻'], l: ['🧴', '🥤', '🍼', '🛍️'], o: ['🍌', '🍎', '🥚', '🍂', '🌽'] }, ks = three ? ['p', 'l', 'o'] : ['l', 'o'];
  return { say: L('Ayuda al planeta: pon cada basura en su tacho', 'Help the planet: put each piece of trash in its bin'), good: L('¡Gracias por reciclar!', 'Thanks for recycling!'), bins: B.filter(b => ks.includes(b.k)), items: ks.flatMap(k => itemsOf(c, I[k], k, n)) }; });
mSort('dianoche', ['Día y noche', 'Day and night'], '🌗', 'cielo', c => { const n = [2, 3, 3, 4, 4][c.d];
  return { say: L('¿Esto es del día o de la noche?', 'Is it from the day or the night?'), bins: [{ k: 'd', html: bl('☀️', 'Día', 'Day'), style: 'background:#fff3b0' }, { k: 'n', html: bl('🌙', 'Noche', 'Night'), style: 'background:#3d3a7a;color:#fff' }],
    items: [...itemsOf(c, ['🌞', '🌈', '🦋', '🌻', '🐓', '🏖️'], 'd', n), ...itemsOf(c, ['🌙', '⭐', '🦉', '🦇', '😴', '🌌'], 'n', n)] }; });
mSort('transportes', ['¿Por dónde va?', 'Where does it go?'], '🚁', 'ciudad', c => { const three = c.d >= 1, n = [2, 2, 2, 3, 3][c.d];
  const B = [{ k: 't', html: bl('🛣️', 'Tierra', 'Land'), style: 'background:#ffe3c2' }, { k: 'a', html: bl('🌊', 'Agua', 'Water'), style: 'background:#c9ecff' }, { k: 'i', html: bl('☁️', 'Aire', 'Air'), style: 'background:#eef7ff' }];
  const I = { t: ['🚗', '🚌', '🚂', '🚲', '🚜', '🚒'], a: ['⛵', '🚢', '🛶', '🚤'], i: ['✈️', '🚁', '🚀', '🎈'] }, ks = three ? ['t', 'a', 'i'] : ['t', 'i'];
  return { say: L('¿Va por tierra, por agua o por el aire?', 'Does it go on land, water or air?'), bins: B.filter(b => ks.includes(b.k)), items: ks.flatMap(k => itemsOf(c, I[k], k, n)) }; });
mSort('maleta', ['Maletas de viaje', 'Travel suitcases'], '🧳', 'cielo', c => { const n = [2, 3, 3, 4, 4][c.d];
  return { say: L('Una maleta va a la playa y otra a la nieve. ¿Qué llevamos?', 'One suitcase goes to the beach, one to the snow. What do we pack?'), bins: [{ k: 'h', html: bl('🏖️', 'Playa', 'Beach'), style: 'background:#fff3b0' }, { k: 'c', html: bl('⛄', 'Nieve', 'Snow'), style: 'background:#e3f4ff' }],
    items: [...itemsOf(c, ['🕶️', '👒', '👙', '🩴', '⛱️', '🍉'].filter(e => e !== '🩴'), 'h', n), ...itemsOf(c, ['🧣', '🧤', '🧥', '🥾', '☕'], 'c', n)] }; });
mSort('mascotas', ['Mascota o salvaje', 'Pet or wild'], '🐶', 'bosque', c => { const n = [2, 2, 3, 3, 4][c.d];
  return { say: L('¿Vive en casa o en la selva?', 'Does it live at home or in the jungle?'), bins: [{ k: 'm', html: bl('🏠', 'Casa', 'Home'), style: 'background:#ffe6f0' }, { k: 's', html: bl('🌴', 'Selva', 'Jungle'), style: 'background:#d7f5d0' }],
    items: [...sample(c.r, ['perro', 'gato', 'conejo', 'raton'], n).map(k => ({ k: 'm', html: mA(k, 'happy', 100) })), ...sample(c.r, ['leon', 'tigre', 'mono', 'elefante', 'jirafa'], n).map(k => ({ k: 's', html: mA(k, 'happy', 100) }))] }; });
mSort('vuelannadan', ['Vuelan, nadan, caminan', 'Fly, swim, walk'], '🐟', 'mar', c => { const three = c.d >= 2, n = [2, 3, 2, 3, 3][c.d];
  const B = [{ k: 'v', html: bl('☁️', 'Vuelan', 'Fly'), style: 'background:#eef7ff' }, { k: 'n', html: bl('🌊', 'Nadan', 'Swim'), style: 'background:#c9ecff' }, { k: 'c', html: bl('🌿', 'Caminan', 'Walk'), style: 'background:#d7f5d0' }];
  const I = { v: ['🐦', '🦋', '🐝', '🦅', '🦜', '🦉'], n: ['🐟', '🐬', '🐙', '🐳', '🐠', '🦈'], c: ['🐕', '🐘', '🐄', '🐎', '🦒'] }, ks = three ? ['v', 'n', 'c'] : ['v', 'n'];
  return { say: three ? L('¿Este animal vuela, nada o camina?', 'Does it fly, swim or walk?') : L('¿Este animal vuela o nada?', 'Does it fly or swim?'), bins: B.filter(b => ks.includes(b.k)), items: ks.flatMap(k => itemsOf(c, I[k], k, n)) }; });
mSort('ordenarcuarto', ['Ordena el cuarto', 'Tidy the room'], '🧸', 'madera', c => { const n = [2, 3, 3, 4, 4][c.d];
  return { say: L('¡A ordenar! Los juguetes al baúl y la ropa al cajón', 'Tidy up! Toys in the chest, clothes in the drawer'), good: L('¡Qué cuarto tan ordenado!', 'Such a tidy room!'), bins: [{ k: 't', html: bl('🧸', 'Juguetes', 'Toys'), style: 'background:#ffe3c2' }, { k: 'r', html: bl('👕', 'Ropa', 'Clothes'), style: 'background:#e3e9ff' }],
    items: [...itemsOf(c, ['🧸', '⚽', '🎲', '🚂', '🎨', '🏀', '🤖'], 't', n), ...itemsOf(c, ['👕', '👖', '🧦', '👗', '🧢', '🧥'], 'r', n)] }; });
mSort('cajasformas', ['Cajas de formas', 'Shape boxes'], '🔷', 'madera', c => { const ids = sample(c.r, [0, 1, 2, 3, 4], [2, 2, 3, 3, 3][c.d]), n = [2, 2, 2, 3, 3][c.d];
  const out = s => lab => `<svg viewBox="0 0 100 100" width="${lab}" height="${lab}"><path d="${s.p}" fill="#f4efff" stroke="#a66bff" stroke-width="6" stroke-dasharray="10 6" stroke-linejoin="round"/></svg>`;
  return { say: L('Guarda cada forma en su caja', 'Put each shape in its box'), bins: ids.map(i => ({ k: i, html: out(SHAPES[i]) })), items: ids.flatMap(i => mRange(1, n).map(() => ({ k: i, html: shapeSV(SHAPES[i], pick(c.r, PAL), '86%') }))) }; });
mSort('mercado', ['De compras', 'Shopping'], '🛒', 'ciudad', c => {
  const kinds = sample(c.r, ['🍎', '🍌', '🥕', '🥛', '🍞', '🧀', '🥚', '🍇'], [2, 2, 3, 3, 3][c.d]), need = {}, chips = {};
  kinds.forEach(e => need[e] = 1 + Math.floor(c.r() * [1, 2, 2, 3, 3][c.d]));
  const extra = sample(c.r, ['🍩', '🍭', '🧃', '🍪', '🥫'].filter(e => e !== '🧃'), 2);
  const items = [...kinds.flatMap(e => mRange(1, need[e]).map(() => ({ k: 'c', e, html: mE(e) }))), ...kinds.map(e => ({ k: 'c', e, html: mE(e) })), ...extra.map(e => ({ k: 'c', e, html: mE(e) }))];
  return { say: L('Compra lo que dice la lista y arrástralo al carrito', 'Buy what is on the list and drag it to the cart'), binH: .4,
    bins: [{ k: 'c', html: lab => `${mE('🛒', lab * 1.1)}` }],
    extra: (bins, lab) => { const box = mk('div', 'card', `<b style="font-size:15px">${L('Lista', 'List')} 📝</b>`, c.stage, 'position:absolute;right:3%;top:8%;flex-direction:column;padding:8px 14px;gap:2px;z-index:2'); kinds.forEach(e => { chips[e] = mk('div', '', '', box, 'font-size:26px;font-weight:800;display:flex;align-items:center;gap:6px'); upd(e); }); },
    accept: (t, it, test) => need[it.e] > 0 && (test || (need[it.e]--, upd(it.e), true)),
    no: it => need[it.e] === 0 ? L('¡Ya tenemos suficientes!', 'We have enough!') : L('Eso no está en la lista', 'That is not on the list'),
    isDone: () => kinds.every(e => need[e] === 0), needed: it => need[it.e] > 0, good: L('¡Compraste todo! ¡Gracias!', 'You bought everything! Thanks!'), items };
  function upd(e) { if (chips[e]) chips[e].innerHTML = `${mE(e, 28)} × ${need[e]}${need[e] === 0 ? ' ✅' : ''}`; }
});
mSort('estacionamiento', ['Estacionamiento', 'Parking lot'], '🅿️', 'ciudad', c => { const cs = sample(c.r, COLORS, [2, 3, 3, 4, 4][c.d]);
  return { say: L('Estaciona cada carro en el lugar de su color', 'Park each car in the spot of its color'), good: L('¡Todos estacionados!', 'All parked!'), binH: .32,
    bins: cs.map(x => ({ k: x.n, style: 'background:#5b606b;color:#fff', html: lab => `<div style="width:${lab * 1.6}px;height:${lab}px;border:5px dashed ${x.h};border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:${lab * .6}px;color:${x.h}">P</div>` })),
    items: cs.map(x => ({ k: x.n, html: carSV(x) })) }; });
mSort('cartero', ['El cartero', 'The mail carrier'], '✉️', 'ciudad', c => { const mx = [3, 5, 9, 12, 20][c.d], ns = sample(c.r, mRange(1, mx), [2, 3, 3, 4, 4][c.d]);
  return { say: L('Lleva cada carta a la casa con su mismo número', 'Take each letter to the house with the same number'), good: L('¡Cartas entregadas!', 'Mail delivered!'), bins: ns.map(n => ({ k: n, html: lab => houseNum(n, lab * 1.5) })), items: ns.map(n => ({ k: n, html: envNum(n), no: L(`Esa carta es para la casa ${numw(n)}`, `That letter is for house ${numw(n)}`) })) }; });
mSort('mariposas', ['Mariposas y flores', 'Butterflies'], '🦋', 'jardin', c => { const cs = sample(c.r, COLORS, [2, 3, 3, 4, 4][c.d]), two = c.d >= 3;
  return { say: L('Lleva cada mariposa a la flor de su color', 'Take each butterfly to the flower of its color'), good: L('¡Qué jardín tan lindo!', 'What a pretty garden!'), bins: cs.map(x => ({ k: x.n, html: lab => flowerSV(x, lab * 1.3 + 'px'), style: 'background:rgba(255,255,255,.6)' })), items: cs.flatMap(x => mRange(1, two ? 2 : 1).map(() => ({ k: x.n, html: flySV(x) }))) }; });

/* =====================================================================
   JUEGOS DE PAREJAS (8)
===================================================================== */
mPair('mayusminus', ['Grande y pequeña', 'Big and small letters'], '🔡', 'aula', c => { const ls = sample(c.r, 'ABDEFGHLMNRT'.split(''), [3, 3, 4, 4, 5][c.d]);
  return { say: L('Une cada letra grande con su letra pequeña', 'Match each capital letter with its small letter'), pairs: ls.map((l, i) => ({ a: mT(l, PAL[i], 1.2), b: mT(l.toLowerCase(), PAL[i], 1.2), say: L(`${l} y ${l.toLowerCase()}`, `${l} and ${l.toLowerCase()}`) })) }; });
mPair('numcantidad', ['Número y cantidad', 'Number and amount'], '🔟', 'jardin', c => { const ns = sample(c.r, mRange(1, [3, 5, 6, 8, 9][c.d]), [3, 3, 4, 4, 5][c.d]), e = pick(c.r, ['🍎', '⭐', '🐞', '🌸']);
  return { say: L('Une cada número con su cantidad', 'Match each number with its amount'), pairs: ns.map((x, i) => ({ a: mT(x, PAL[i], 1.2), b: `<div style="display:flex;flex-wrap:wrap;justify-content:center;font-size:${x > 4 ? .28 : .36}em;width:90%">${mE(e).repeat(x)}</div>`, say: numw(x) })) }; });
const TOOLS = [['👩‍🚒', '🚒'], ['👨‍🍳', '🍳'], ['👩‍⚕️', '💉'], ['👨‍🌾', '🌽'], ['👨‍🚀', '🚀'], ['👩‍🏫', '📚'], ['👷', '🔨'], ['👮', '🚓'], ['👩‍🎨', '🎨']];
mPair('herramientas', ['¿Qué usa cada uno?', 'Tools of the trade'], '🔨', 'ciudad', c => ({ say: L('Une a cada persona con lo que usa en su trabajo', 'Match each person with what they use at work'), pairs: sample(c.r, TOOLS, [3, 3, 4, 4, 5][c.d]).map(t => ({ a: mE(t[0]), b: mE(t[1]) })) }));
mPair('calcetines', ['Calcetines', 'Socks'], '🧦', 'madera', c => { const n = [3, 3, 4, 4, 5][c.d], cs = sample(c.r, COLORS, n), pats = mRange(0, n - 1).map(i => c.d >= 2 ? Math.floor(c.r() * 4) : i % 4);
  return { say: L('Encuentra el par de cada calcetín', 'Find the pair of each sock'), good: L('¡Todos los calcetines tienen su par!', 'All socks are paired!'), pairs: cs.map((x, i) => ({ a: sockSV(x, pats[i]), b: sockSV(x, pats[i], true) })) }; });
mPair('mamabebe', ['Mamá y bebé', 'Mom and baby'], '🍼', 'granja', c => ({ say: L('Lleva a cada bebé con su mamá', 'Take each baby to its mom'), good: L('¡Todos con su mamá!', 'Everyone is with mom!'), pairs: sample(c.r, Object.keys(AN), [3, 3, 4, 4, 5][c.d]).map(k => ({ a: mA(k, 'joy', 56), b: mA(k, 'happy', 92), say: AN[k] && (ANIMALS.find(a => a.k === k) || {}).s })) }));
mPair('llaves', ['Llaves y candados', 'Keys and locks'], '🔑', 'madera', c => ({ say: L('Lleva cada llave a su candado del mismo color', 'Take each key to the lock of the same color'), good: L('¡Todos abiertos!', 'All unlocked!'), pairs: sample(c.r, COLORS, [3, 3, 4, 4, 5][c.d]).map(x => ({ a: keySV(x), b: lockSV(x) })) }));
mPair('mitades', ['Mitades', 'Halves'], '🌓', 'cocina', c => ({ say: L('Junta cada mitad con su otra mitad', 'Join each half with its other half'), pairs: sample(c.r, ['🍎', '🍉', '🍊', '🍓', '🍋', '🍐', '🥝', '🍑', '🍩', '⚽'], [3, 3, 4, 4, 5][c.d]).map(e => ({ a: `<span class="emo" style="clip-path:inset(0 50% 0 0)">${e}</span>`, b: `<span class="emo" style="clip-path:inset(0 0 0 50%)">${e}</span>` })) }));
const FOODOF = [['conejo', '🥕'], ['mono', '🍌'], ['raton', '🧀'], ['perro', '🦴'], ['gato', '🐟'], ['panda', '🎋'], ['oso', '🍯'], ['vaca', '🌾'], ['pollito', '🌽']];
mPair('banquete', ['¿Qué come cada uno?', 'Who eats what?'], '🍯', 'granja', c => ({ say: L('Dale a cada animalito su comida favorita', 'Give each animal its favorite food'), good: L('¡Todos comieron! ¡Ñam!', 'Everyone ate! Yum!'), pairs: sample(c.r, FOODOF, [3, 3, 4, 4, 5][c.d]).map(f => ({ a: mE(f[1]), b: mA(f[0]) })) }));

/* =====================================================================
   JUEGOS DE ORDENAR (9)
===================================================================== */
mOrder('burbujas', ['Burbujas numéricas', 'Number bubbles'], '🔵', 'mar', c => { const n = [3, 5, 6, 8, 10][c.d];
  return { say: L('Revienta las burbujas en orden: uno, dos, tres...', 'Pop the bubbles in order: one, two, three...'), bubble: '#9fdcff', ghost: true, seq: mRange(1, n).map((x, i) => ({ key: x, html: mT(x, PAL[i % 8], 1), say: numw(x) })), no: s => L(`Busca el ${numw(s.key)}`, `Find number ${numw(s.key)}`) }; });
mOrder('abc', ['El abecedario', 'The alphabet'], '🔠', 'aula', c => { const n = [3, 4, 5, 6, 7][c.d], s0 = c.d < 2 ? 0 : Math.floor(c.r() * 18), ls = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice(s0, s0 + n).split('');
  return { say: L(`Toca las letras en orden: ${ls.slice(0, 3).join(', ')}...`, `Tap the letters in order: ${ls.slice(0, 3).join(', ')}...`), ghost: true, seq: ls.map((l, i) => ({ key: l, html: mT(l, PAL[i % 8], 1), say: l })), no: s => L(`Busca la ${s.key}`, `Find ${s.key}`) }; });
mOrder('cohete', ['Cuenta regresiva', 'Countdown'], '🚀', 'espacio', c => { const n = [3, 5, 5, 7, 10][c.d]; let rk;
  return { say: L(`¡Vamos a lanzar el cohete! Cuenta hacia atrás desde el ${numw(n)}`, `Let's launch the rocket! Count down from ${numw(n)}`), seq: mRange(1, n).reverse().map((x, i) => ({ key: x, html: mT(x, PAL[i % 8], 1), say: numw(x) })),
    top: (c2, nn) => { rk = mk('div', '', `${mE('🚀', c.H * .2)}`, c.stage, `position:absolute;left:50%;top:5%;transform:translateX(-50%) rotate(-45deg);transition:transform 1.6s cubic-bezier(.6,0,.9,.4);z-index:2`); const box = mk('div', 'card', '', c.stage, `position:absolute;right:4%;top:7%;padding:6px 18px;font-size:${c.H * .08}px;font-weight:800`); box.textContent = n; return { fill: (i, it) => { box.textContent = it.key - 1 || '🔥'; bump(box); } }; },
    no: s => L(`Ahora va el ${numw(s.key)}`, `Now ${numw(s.key)}`),
    end: done => { VO.say(L('¡Despegue!', 'Blast off!'), false); AU.sfx('whoosh'); AU.sfx('firework'); rk.style.transform = `translate(-50%,-${c.H * 1.4}px) rotate(-45deg)`; confetti(80); setTimeout(done, 1700); } }; });
const ROUT = [['🌅', 'despertar', 'wake up'], ['🥣', 'desayunar', 'have breakfast'], ['🎒', 'ir al cole', 'go to school'], ['⚽', 'jugar', 'play'], ['🛁', 'bañarse', 'take a bath'], ['🛏️', 'dormir', 'sleep']];
mOrder('rutina', ['Mi día', 'My day'], '🌅', 'cielo', c => { const ids = sample(c.r, mRange(0, 5), [3, 3, 4, 5, 6][c.d]).sort((a, b) => a - b);
  return { say: L('Ordena el día de Pipo: ¿qué hace primero?', "Put Pipo's day in order: what comes first?"), seq: ids.map(i => ({ key: i, html: mE(ROUT[i][0]), say: L(ROUT[i][1], ROUT[i][2]) })), no: () => L('¿Qué hacemos antes?', 'What do we do before?'), good: L('¡Así es un día completo!', 'That is a whole day!') }; });
const GROW = [['🥚', '🐣', '🐥', '🐔'], ['🌱', '🌿', '🌳'], ['🌑', '🌓', '🌕'], ['👶', '🧒', '🧑', '👴'], ['🌰', '🌱', '🌳'], ['☁️', '🌧️', '🌈'], ['🥚', '🐛', '🦋']];
mOrder('crecer', ['¿Cómo crece?', 'How does it grow?'], '🌱', 'jardin', c => { const g = pick(c.r, GROW.filter(x => c.d < 2 ? x.length === 3 : true));
  return { say: L('¿Cómo crece? Tócalos en orden, del primero al último', 'How does it grow? Tap them in order'), seq: g.map((e, i) => ({ key: i, html: mE(e) })), good: L('¡Así crece!', 'That is how it grows!') }; });
mOrder('chicogrande', ['De chico a grande', 'Small to big'], '📏', 'jardin', c => { const n = [3, 3, 4, 5, 5][c.d], e = pick(c.r, ['🐻', '🌳', '🎈', '🍎', '🐟', '⭐', '🏠']), rev = c.d >= 3 && c.r() < .5;
  const seq = mRange(0, n - 1).map(i => ({ key: i, html: `<span class="emo" style="font-size:${.32 + i * (.68 / (n - 1))}em">${e}</span>` }));
  return { say: rev ? L('Ordena del más grande al más pequeño', 'Order from biggest to smallest') : L('Ordena del más pequeño al más grande', 'Order from smallest to biggest'), seq: rev ? seq.reverse() : seq, ghost: true }; });
mOrder('minombre', ['Mi nombre', 'My name'], '📛', 'aula', c => { let nm0 = ((curProfile().name || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-zÑñ]/g, '').toUpperCase() || 'PIPO').slice(0, 8); if (nm0.length < 2) nm0 = 'PIPO';
  return { say: L(`¡Escribe ${nm0 === 'PIPO' ? 'el nombre de Pipo' : 'tu nombre'}! ${nm0.split('').join(', ')}`, `Spell ${nm0 === 'PIPO' ? "Pipo's name" : 'your name'}! ${nm0.split('').join(', ')}`), ghost: true, seq: nm0.split('').map((l, i) => ({ key: l, html: mT(l, PAL[i % 8], 1), say: l })), good: L(`¡${cap(nm0.toLowerCase())}! ¡Qué lindo nombre!`, `${cap(nm0.toLowerCase())}! What a nice name!`) }; });
mOrder('arcoiris', ['Pinta el arcoíris', 'Paint the rainbow'], '🌈', 'cielo', c => { const idx = [0, 4, 2, 3, 1, 5], n = [3, 4, 6, 6, 6][c.d], cs = idx.slice(0, n).map(i => COLORS[i]);
  return { say: L('Pinta el arcoíris en orden: rojo, naranja, amarillo...', 'Paint the rainbow in order: red, orange, yellow...'), seq: cs.map((x, i) => ({ key: i, html: blobSV(x), say: colorName(x) })), areaTop: .5,
    top: () => { const W = Math.min(c.W * .7, c.H * .9), el = mk('div', '', `<svg viewBox="0 0 200 105" width="${W}">${cs.map((x, i) => `<path data-a="${i}" d="M${20 + i * 12} 100A${80 - i * 12} ${80 - i * 12} 0 0 1 ${180 - i * 12} 100" fill="none" stroke="#e8e3f3" stroke-width="11" stroke-linecap="round"/>`).join('')}</svg>`, c.stage, 'position:absolute;left:50%;top:6%;transform:translateX(-50%)'); return { fill: i => { el.querySelector(`[data-a="${i}"]`).setAttribute('stroke', cs[i].h); } }; },
    no: s => L(`Ahora va el ${colorName(cs[s.key])}`, `Now ${colorName(cs[s.key])}`), good: L('¡Un arcoíris precioso!', 'A beautiful rainbow!') }; });
mOrder('tren', ['Tren de números', 'Number train'], '🚂', 'ciudad', c => { const n = [3, 4, 5, 6, 8][c.d], ks = shuf(c.r, Object.keys(AN)); let tr;
  return { say: L('Engancha los vagones en orden: uno, dos, tres...', 'Hook up the wagons in order: one, two, three...'), seq: mRange(1, n).map((x, i) => ({ key: x, html: mT(x, PAL[i % 8], 1), say: numw(x) })), areaTop: .36,
    top: () => { const w = Math.min(c.W * .92 / (n + 1.4), c.H * .2); tr = mk('div', '', '', c.stage, `position:absolute;left:3%;top:9%;display:flex;align-items:flex-end;gap:4px;transition:transform 2.2s ease-in`); mk('div', '', mE('🚂', w * .95), tr, 'transform:scaleX(-1)'); const wg = mRange(1, n).map(() => mk('div', 'qslot', '', tr, `width:${w}px;height:${w * .8}px;font-size:${w * .38}px;border-radius:10px;flex-direction:column`)); return { fill: (i, it) => { wg[i].innerHTML = `<span class="art" style="width:${w * .5}px;height:${w * .5}px">${animalSVG(ks[i % ks.length], 'joy')}</span><b style="line-height:1">${it.key}</b>`; wg[i].classList.add('ok'); wg[i].style.background = PAL[i % 8]; wg[i].style.color = '#fff'; bump(wg[i]); } }; },
    end: done => { AU.sfx('train'); VO.say(L('¡Chu chu! ¡Todos a bordo!', 'Choo choo! All aboard!'), false); tr.style.transform = `translateX(-${c.W * 1.3}px)`; setTimeout(done, 2000); } }; });
