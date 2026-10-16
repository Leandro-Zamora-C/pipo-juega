/* =====================================================================
   PIPO JUEGA · 13 MINIJUEGOS NUEVOS
===================================================================== */
const alive = c => G.ctx === c && !G.finished;

/* 21. ROMPECABEZAS ---------------------------------------------------- */
function puzzleImage(theme, animalK, size) {
  const an = animalSVG(animalK, 'joy').replace('<svg viewBox="-4 -4 108 108" width="100%" height="100%"', `<svg x="${size * .17}" y="${size * .17}" width="${size * .66}" height="${size * .66}" viewBox="-4 -4 108 108"`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><svg width="${size}" height="${size}" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">${BG[theme]}</svg>${an}</svg>`;
}
TYPES.rompecabezas = {
  name: ['Rompecabezas', 'Jigsaw puzzle'], icon: '🧩', theme: 'madera',
  make(c) {
    const g = [2, 2, 3, 3, 3][c.d], land = c.W > c.H, S = Math.floor(land ? Math.min(c.W * .48, c.H * .86) : Math.min(c.W * .86, c.H * .5)), pw = S / g;
    const an = pick(c.r, ANIMALS), th = pick(c.r, ['cielo', 'granja', 'mar', 'jardin', 'espacio', 'bosque', 'noche']);
    const url = `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(puzzleImage(th, an.k, S))}")`;
    const board = mk('div', 'pz-board', '', c.stage, `width:${S}px;height:${S}px;${land ? `left:4%;top:${(c.H - S) / 2}px` : `left:${(c.W - S) / 2}px;top:3%`};grid-template-columns:repeat(${g},1fr)`);
    mk('div', '', '', board, `position:absolute;inset:0;background:${url};background-size:${S}px ${S}px;opacity:.22;pointer-events:none`);
    const slots = Array.from({ length: g * g }, (_, i) => { const s = mk('div', 'pz-slot', '', board); s.i = i; return s; });
    const area = land ? { x: c.W * .04 + S + 20, y: 10, w: c.W - S - c.W * .04 - 30, h: c.H - 20 } : { x: 10, y: c.H * .03 + S + 14, w: c.W - 20, h: c.H - S - c.H * .03 - 24 };
    const order = shuf(c.r, slots.map(s => s.i));
    let ts = pw; while (ts > 30 && Math.max(1, Math.floor(area.w / (ts * 1.08))) * Math.max(1, Math.floor(area.h / (ts * 1.08))) < g * g) ts *= .92;
    const k2 = ts / pw;
    const pieces = order.map((i, k) => {
      const cols = Math.max(1, Math.floor(area.w / (ts * 1.08))), px = area.x + (k % cols) * ts * 1.08 + (c.r() - .5) * 8, py = area.y + Math.floor(k / cols) * ts * 1.08 + (c.r() - .5) * 8;
      const p = mk('div', 'pz-piece', '', c.stage, `width:${ts}px;height:${ts}px;left:${clamp(px, 4, c.W - ts - 4)}px;top:${clamp(py, 4, c.H - ts - 4)}px;background:${url};background-size:${S * k2}px ${S * k2}px;background-position:${-(i % g) * ts}px ${-Math.floor(i / g) * ts}px`);
      p.i = i; draggable(p, { targets: () => slots.filter(s => !s.ok), onDrop: (s, p) => drop(s, p) }); return p;
    });
    function drop(s, p) {
      if (s.i !== p.i) return false;
      s.ok = true; p._locked = true; p.style.cssText += `;position:static;transform:none;width:100%;height:100%;border-radius:0;box-shadow:none;background-size:${S}px ${S}px;background-position:${-(p.i % g) * pw}px ${-Math.floor(p.i / g) * pw}px`; s.appendChild(p); AU.sfx('ok'); sparkleEl(s, 6);
      if (slots.every(x => x.ok)) { board.classList.add('pz-done'); hearAnimal(an); VO.say(L(`¡Es ${the(an)}!`, `It's ${the(an)}!`), false); setTimeout(c.done, 900); }
      return true;
    }
    c.say(L('Arma el rompecabezas: lleva cada pieza a su lugar', 'Build the puzzle: put each piece in its place'));
    c.hint = () => pieces.find(p => !p._locked); c.solve = () => pieces.forEach(p => { if (!p._locked) drop(slots.find(s => s.i === p.i), p); });
  }
};
/* 22. TRAZAR LETRAS Y NÚMEROS ----------------------------------------- */
TYPES.trazar = {
  name: ['Trazar', 'Tracing'], icon: '✍️', theme: 'aula',
  make(c) {
    c.noRestart = true;
    const sets = ['12345AEIOU', '0123456789AEIOU', 'ABCDEFGHIJKLMNOPRSTUV', 'ABCDEFGHIJKLMNOPRSTUVZ0123456789', 'ABCDEFGHIJKLMNOPRSTUVWXYZ'];
    const ch = pick(c.r, sets[c.d].split('')), isNum = /\d/.test(ch);
    const W = c.W, H = c.H, fs = Math.min(H * .82, W * .62), font = `800 ${fs}px "Baloo 2", "Arial Rounded MT Bold", Arial, sans-serif`;
    const guide = mk('canvas', '', null, c.stage, `position:absolute;inset:0;width:${W}px;height:${H}px`), user = mk('canvas', '', null, c.stage, `position:absolute;inset:0;width:${W}px;height:${H}px;touch-action:none;z-index:2`);
    [guide, user].forEach(cv => { cv.width = W; cv.height = H; });
    const gx = guide.getContext('2d'), ux = user.getContext('2d', { willReadFrequently: true });
    const draw = (x, fill) => { x.font = font; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = fill; x.fillText(ch, W / 2, H * .53); };
    draw(gx, 'rgba(120,110,170,.18)'); gx.setLineDash([fs * .03, fs * .03]); gx.lineWidth = fs * .012; gx.strokeStyle = 'rgba(90,70,160,.6)'; gx.font = font; gx.strokeText(ch, W / 2, H * .53);
    const mc = document.createElement('canvas'); mc.width = W; mc.height = H; const mx = mc.getContext('2d'); draw(mx, '#000');
    const md = mx.getImageData(0, 0, W, H).data, step = Math.max(3, Math.floor(fs / 34)), pts = [];
    for (let y = 0; y < H; y += step) for (let x = 0; x < W; x += step) if (md[(y * W + x) * 4 + 3] > 128) pts.push([x, y]);
    const start = pts.reduce((a, b) => (b[1] < a[1] - step || (Math.abs(b[1] - a[1]) <= step && b[0] < a[0])) ? b : a, pts[0] || [W / 2, H / 2]);
    const dot = mk('div', 'tracedot', '', c.stage, `left:${start[0]}px;top:${start[1]}px`);
    ux.lineCap = ux.lineJoin = 'round'; ux.lineWidth = fs * .15; let on = false, lp = null, hue = 0, finished = false;
    const stroke = (x, y) => { hue = (hue + 4) % 360; ux.strokeStyle = `hsl(${hue},90%,60%)`; ux.beginPath(); ux.moveTo(...(lp || [x, y])); ux.lineTo(x, y); ux.stroke(); lp = [x, y]; };
    const pos = e => { const r = user.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    user.addEventListener('pointerdown', e => { on = true; lp = null; dot.style.display = 'none'; try { user.setPointerCapture(e.pointerId); } catch (er) {} stroke(...pos(e)); markAct(); });
    user.addEventListener('pointermove', e => { if (!on) return; stroke(...pos(e)); markAct(); if (Math.random() < .08) AU.sfx('tap'); });
    const up = () => { on = false; lp = null; check(); };
    user.addEventListener('pointerup', up); user.addEventListener('pointercancel', up);
    function check() {
      if (finished || !pts.length) return; const d = ux.getImageData(0, 0, W, H).data; let hit = 0;
      pts.forEach(([x, y]) => { if (d[(y * W + x) * 4 + 3] > 0) hit++; });
      if (hit / pts.length >= .62) { finished = true; AU.sfx('magic'); confetti(60); gx.clearRect(0, 0, W, H); draw(gx, '#ffd23f'); gx.lineWidth = fs * .02; gx.setLineDash([]); gx.strokeStyle = '#d19b00'; gx.strokeText(ch, W / 2, H * .53); VO.say(isNum ? L(`¡Muy bien! El ${numw(+ch)}`, `Great! Number ${numw(+ch)}`) : L(`¡Muy bien! La ${ch}`, `Great! Letter ${ch}`), false); setTimeout(c.done, 900); }
    }
    c.say(isNum ? L(`Traza el número ${numw(+ch)} con tu dedito`, `Trace the number ${numw(+ch)} with your finger`) : L(`Traza la letra ${ch} con tu dedito`, `Trace the letter ${ch} with your finger`));
    c.hint = () => finished ? null : dot; c.solve = () => { ux.lineWidth = step * 2; pts.forEach(([x, y]) => { ux.beginPath(); ux.arc(x, y, step, 0, 7); ux.fillStyle = '#ff7eb6'; ux.fill(); }); check(); };
  }
};
/* 23. VESTIR A PIPO --------------------------------------------------- */
const ACC_VIEW = { head: '30 -14 140 84', eyes: '48 64 104 54', neck: '34 128 132 76' };
TYPES.vestir = {
  name: ['Viste a Pipo', 'Dress up Pipo'], icon: '🎩', theme: 'dulce',
  make(c) {
    const col = curProfile().color, outfit = {};
    const owned = (S.acc && S.acc.length ? S.acc : ACC_BASE).filter(id => accSlot(id));
    const bySlot = s => shuf(c.r, owned.filter(id => accSlot(id) === s));
    const items = ['head', 'eyes', 'neck'].flatMap(s => bySlot(s).slice(0, s === 'head' ? 3 : 2));
    const U = unit(c), ps = clamp(U * .62, 180, 440);
    const pipo = mk('div', '', pipoSVG('happy', outfit, col), c.stage, `position:absolute;width:${ps}px;left:${(c.W - ps) / 2}px;top:${(c.H - ps * 1.1) / 2}px`);
    const side = (k) => k % 2 === 0;
    const isz = clamp(U * .2, 70, 130);
    const els = items.map((id, k) => {
      const s = accSlot(id), left = side(k), idx = Math.floor(k / 2), rows = Math.ceil(items.length / 2);
      const e = mk('div', 'card accitem', `<svg viewBox="${id === 'capa' ? '20 120 160 90' : id === 'astronauta' ? '20 -10 160 140' : ACC_VIEW[s]}" width="100%">${accSVG(id, col)}</svg>`, c.stage, `position:absolute;width:${isz}px;height:${isz * .72}px;${left ? 'left:3%' : 'right:3%'};top:${((idx + .5) / rows) * 100}%;transform:translateY(-50%)`);
      e._base = 'translateY(-50%)'; e.id = id; e.slot = s; draggable(e, { targets: () => [pipo], onDrop: (t, e) => wear(e) }); return e;
    });
    const placed = new Set();
    function wear(e) {
      outfit[e.slot] = e.id; placed.add(e.slot); pipo.innerHTML = pipoSVG('joy', outfit, col); bump(pipo); AU.sfx('magic'); sparkleEl(pipo, 8);
      VO.say(L(`¡Qué lindo ${ACC[e.slot][e.id].n}!`, 'So cute!'), false); e.style.transform = e._base;
      if (placed.size >= 3) { S.outfit = Object.assign({}, outfit); save(); setTimeout(() => { const f = mk('div', 'flash', '', document.body); setTimeout(() => f.remove(), 500); AU.sfx('coin'); VO.say(L('¡Qué guapo quedó Pipo! ¡Foto!', 'Pipo looks great! Photo!'), false); }, 500); setTimeout(c.done, 1300); }
      return true;
    }
    c.say(L('¡Viste a Pipo! Ponle algo en la cabeza, en los ojos y en el cuello', 'Dress up Pipo! Something for the head, the eyes and the neck'));
    c.hint = () => els.find(e => !placed.has(e.slot)); c.solve = () => ['head', 'eyes', 'neck'].forEach(s => { const e = els.find(x => x.slot === s); if (e) wear(e); else placed.add(s); }) || (placed.size >= 3 && c.done());
  }
};
/* 24. LAVAR ----------------------------------------------------------- */
const plateSVG = `<svg viewBox="0 0 100 100" width="100%"><circle cx="50" cy="52" r="46" fill="rgba(0,0,0,.1)"/><circle cx="50" cy="50" r="46" fill="#fff" stroke="#cfd8e3" stroke-width="3"/><circle cx="50" cy="50" r="32" fill="#f4f7fb" stroke="#e1e8f0" stroke-width="2"/></svg>`;
const carSVG = `<svg viewBox="0 0 220 130" width="100%"><path d="M30 70q4-34 40-38h70q30 2 48 38z" fill="#3d8bff" stroke="#1d5bc2" stroke-width="5"/><path d="M10 74q0-10 12-10h176q14 0 14 12v26H10z" fill="#3d8bff" stroke="#1d5bc2" stroke-width="5"/><path d="M62 64l14-24h34v24zM118 64V40h22l26 24z" fill="#bfeaff"/><circle cx="56" cy="106" r="18" fill="#2b2140"/><circle cx="56" cy="106" r="7" fill="#ccc"/><circle cx="166" cy="106" r="18" fill="#2b2140"/><circle cx="166" cy="106" r="7" fill="#ccc"/><circle cx="204" cy="82" r="6" fill="#ffd23f"/></svg>`;
TYPES.lavar = {
  name: ['Lavar', 'Washing'], icon: '🧽', theme: 'cocina',
  make(c) {
    const kind = pick(c.r, ['platos', 'carro']), U = unit(c), spots = [];
    let objs = [];
    if (kind === 'platos') {
      const n = c.d >= 2 ? 3 : 2, w = clamp(Math.min(c.W / (n + .6), c.H * .6), 120, 320);
      const row = mk('div', '', '', c.stage, 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:4%');
      objs = Array.from({ length: n }, () => mk('div', '', plateSVG, row, `width:${w}px`));
      objs.forEach(o => placeSpots(c, o, 2 + Math.floor(c.d / 2), pick(c.r, ['radial-gradient(#e0402a,#a32a18)', 'radial-gradient(#8d5a2b,#5e3a17)', 'radial-gradient(#7cc96a,#3f8f33)', 'radial-gradient(#ffd23f,#d19b00)']), .14, 3, spots));
    } else {
      const w = Math.min(c.W * .8, c.H * 1.3);
      const car = mk('div', '', carSVG, c.stage, `position:absolute;width:${w}px;left:${(c.W - w) / 2}px;top:${(c.H - w * .59) / 2}px`); objs = [car];
      placeSpots(c, car, 6 + c.d * 2, 'radial-gradient(circle at 40% 35%,#8d5a2b,#5e3a17)', .07, 3, spots);
    }
    setTimeout(() => {}, 0);
    rubTool(c, { spots, tool: '🧽', radius: U * .07, onClean: () => { if (spots.every(s => s.clean)) { AU.sfx('magic'); objs.forEach(o => sparkleEl(o, 12)); VO.say(L('¡Brilla de limpio!', 'Sparkling clean!'), false); setTimeout(c.done, 800); } } });
    c.say(kind === 'platos' ? L('¡Lava los platos! Frota la comida con la esponja', 'Wash the dishes! Scrub the food with the sponge') : L('¡Lava el carro! Frota el barro', 'Wash the car! Scrub off the mud'));
    c.hint = () => spots.find(s => !s.clean); c.solve = () => { spots.forEach(s => { s.clean = true; s.remove(); }); c.done(); };
  }
};
/* 25. GRANJA MUSICAL (repite la secuencia) ---------------------------- */
TYPES.granja = {
  name: ['Granja musical', 'Music farm'], icon: '🐮', theme: 'granja',
  make(c) {
    c.noRestart = true;
    const anims = sample(c.r, ANIMALS.filter(a => ['perro', 'gato', 'vaca', 'cerdito', 'pato', 'oveja', 'pollito', 'rana', 'leon', 'raton', 'buho', 'mono', 'elefante'].includes(a.k)), 4);
    const bgc = ['#ff7eb6', '#ffd23f', '#5fd3ff', '#4cd964'], notes = [0, 2, 4, 7], target = 3 + c.d, seq = Array.from({ length: target }, () => Math.floor(c.r() * 4));
    const U = unit(c), sz = clamp(Math.min(c.W / 4.6, c.H * .42), 80, 210);
    const row = mk('div', '', '', c.stage, 'position:absolute;inset:0;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:3%;padding:4%');
    let len = 1, pos = 0, busy = true;
    const cards = anims.map((a, i) => { const b = mk('div', 'card choice farmcard', animalSVG(a.k, 'happy'), row, `width:${sz}px;height:${sz}px;background:${bgc[i]};padding:${Math.round(sz * .1)}px`); b.i = i; b.addEventListener('pointerdown', () => tap(b)); return b; });
    const lightUp = i => { const b = cards[i]; b.classList.add('lit'); b.innerHTML = animalSVG(anims[i].k, 'joy'); AU.animal(anims[i].k); AU.note(notes[i], .4); setTimeout(() => { b.classList.remove('lit'); b.innerHTML = animalSVG(anims[i].k, 'happy'); }, 520); };
    function play() { busy = true; pos = 0; let k = 0; const step = () => { if (!alive(c)) return; if (k >= len) { busy = false; VO.say(L('¡Ahora tú!', 'Your turn!'), false); return; } lightUp(seq[k++]); setTimeout(step, 900); }; setTimeout(step, 900); }
    function tap(b) {
      if (busy || G.finished) return; markAct(); lightUp(b.i);
      if (b.i !== seq[pos]) { AU.sfx('no'); bump(b, 'shake'); VO.say(L('¡Ups! Escucha otra vez', 'Oops! Listen again'), false); busy = true; setTimeout(play, 1000); return; }
      pos++;
      if (pos >= len) { if (len >= target) { busy = true; sparkleEl(row, 16); setTimeout(c.done, 700); } else { len++; busy = true; AU.sfx('ok'); setTimeout(play, 900); } }
    }
    c.say(L('Escucha a los animalitos y repite el orden', 'Listen to the animals and repeat the order'));
    setTimeout(play, 1400);
    c.hint = () => busy ? null : cards[seq[pos]]; c.solve = () => { busy = true; c.done(); };
  }
};
/* 26. LABERINTO ------------------------------------------------------- */
TYPES.laberinto = {
  name: ['Laberinto', 'Maze'], icon: '🧀', theme: 'jardin',
  make(c) {
    const n = [3, 4, 5, 6, 7][c.d], land = c.W > c.H, cols = land ? n + 1 : n, rows = land ? n : n + 1;
    const walls = Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ n: 1, s: 1, e: 1, w: 1 }))), seen = new Set(), stack = [[0, 0]]; seen.add('0,0');
    const D = { n: [0, -1, 's'], s: [0, 1, 'n'], e: [1, 0, 'w'], w: [-1, 0, 'e'] };
    while (stack.length) { const [x, y] = stack[stack.length - 1]; const opts = shuf(c.r, Object.keys(D)).filter(k => { const [dx, dy] = D[k], nx = x + dx, ny = y + dy; return nx >= 0 && ny >= 0 && nx < cols && ny < rows && !seen.has(nx + ',' + ny); }); if (!opts.length) { stack.pop(); continue; } const k = opts[0], [dx, dy, o] = D[k], nx = x + dx, ny = y + dy; walls[y][x][k] = 0; walls[ny][nx][o] = 0; seen.add(nx + ',' + ny); stack.push([nx, ny]); }
    const cs = Math.floor(Math.min(c.W * .92 / cols, c.H * .9 / rows)), Wp = cs * cols, Hp = cs * rows;
    let svg = `<svg viewBox="0 0 ${cols} ${rows}" width="${Wp}" height="${Hp}" style="display:block"><rect width="${cols}" height="${rows}" fill="#c9f2a8" rx=".2"/>`;
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) { const w = walls[y][x]; if (w.n) svg += `<path d="M${x} ${y}h1"/>`; if (w.w) svg += `<path d="M${x} ${y}v1"/>`; if (y === rows - 1 && w.s) svg += `<path d="M${x} ${y + 1}h1"/>`; if (x === cols - 1 && w.e) svg += `<path d="M${x + 1} ${y}v1"/>`; }
    svg = svg.replace(/<path /g, '<path stroke="#2f8f3a" stroke-width=".16" stroke-linecap="round" ') + '</svg>';
    const box = mk('div', '', svg, c.stage, `position:absolute;left:${(c.W - Wp) / 2}px;top:${(c.H - Hp) / 2}px;width:${Wp}px;height:${Hp}px;touch-action:none;filter:drop-shadow(0 6px 0 rgba(0,0,0,.12))`);
    const cheese = emoEl('🧀', cs * .62, box, `position:absolute;left:${(cols - 1) * cs + cs * .19}px;top:${(rows - 1) * cs + cs * .12}px;pointer-events:none`);
    const mouse = mk('div', '', animalSVG('raton', 'happy'), box, `position:absolute;width:${cs * .82}px;height:${cs * .82}px;left:${cs * .09}px;top:${cs * .09}px;transition:left .14s,top .14s;pointer-events:none;z-index:2`);
    const hintDot = mk('div', '', '', box, `position:absolute;width:${cs}px;height:${cs}px;pointer-events:none`);
    let cx = 0, cy = 0, won = false;
    const canGo = (x, y, nx, ny) => { if (Math.abs(nx - x) + Math.abs(ny - y) !== 1 || nx < 0 || ny < 0 || nx >= cols || ny >= rows) return false; const k = nx > x ? 'e' : nx < x ? 'w' : ny > y ? 's' : 'n'; return !walls[y][x][k]; };
    const moveTo = (x, y) => { cx = x; cy = y; mouse.style.left = x * cs + cs * .09 + 'px'; mouse.style.top = y * cs + cs * .09 + 'px'; AU.sfx('tap'); if (x === cols - 1 && y === rows - 1 && !won) { won = true; cheese.remove(); mouse.innerHTML = animalSVG('raton', 'joy'); AU.animal('raton'); AU.sfx('chomp'); sparkleEl(mouse, 14); VO.say(L('¡Ñam! ¡Encontró el queso!', 'Yum! The mouse found the cheese!'), false); setTimeout(c.done, 900); } };
    const handle = e => { if (won) return; const r = box.getBoundingClientRect(), x = Math.floor((e.clientX - r.left) / cs), y = Math.floor((e.clientY - r.top) / cs); if (x === cx && y === cy) return; if (canGo(cx, cy, x, y)) { moveTo(x, y); markAct(); } else if (Math.abs(x - cx) + Math.abs(y - cy) > 1) { /* intenta avanzar en línea recta */ const dx = Math.sign(x - cx), dy = Math.sign(y - cy); if ((dx === 0 || dy === 0) && canGo(cx, cy, cx + dx, cy + dy)) moveTo(cx + dx, cy + dy); } };
    let down = false; box.addEventListener('pointerdown', e => { down = true; try { box.setPointerCapture(e.pointerId); } catch (er) {} handle(e); }); box.addEventListener('pointermove', e => { if (down) handle(e); }); box.addEventListener('pointerup', () => down = false);
    const nextStep = () => { const prev = new Map([[cx + ',' + cy, null]]), q = [[cx, cy]]; while (q.length) { const [x, y] = q.shift(); if (x === cols - 1 && y === rows - 1) { let k = x + ',' + y, last = k; while (prev.get(k) && prev.get(k) !== cx + ',' + cy) k = prev.get(k); return k.split(',').map(Number); } for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy, key = nx + ',' + ny; if (!prev.has(key) && canGo(x, y, nx, ny)) { prev.set(key, x + ',' + y); q.push([nx, ny]); } } } return null; };
    c.say(L('Lleva al ratón hasta el queso. ¡Desliza tu dedo por el camino!', 'Take the mouse to the cheese. Slide your finger along the path!'));
    c.hint = () => { const s = nextStep(); if (!s) return null; hintDot.style.left = s[0] * cs + 'px'; hintDot.style.top = s[1] * cs + 'px'; return hintDot; };
    c.solve = () => { let s, guard = 0; while (!won && (s = nextStep()) && guard++ < 200) moveTo(s[0], s[1]); };
  }
};
/* 27. PESCAR ---------------------------------------------------------- */
const fishSVG = (col, dk) => `<svg viewBox="0 0 120 70" width="100%"><path d="M88 35L118 12V58Z" fill="${dk}"/><ellipse cx="54" cy="35" rx="46" ry="28" fill="${col}" stroke="${dk}" stroke-width="3"/><path d="M40 10q14 10 0 24" fill="${dk}" opacity=".5"/><circle cx="28" cy="30" r="7" fill="#fff"/><circle cx="26" cy="30" r="3.5" fill="#2b2140"/><path d="M16 44q6 4 12 0" stroke="#2b2140" stroke-width="2.5" fill="none"/><path d="M58 20q6 15 0 30M70 22q6 13 0 26" stroke="#fff" stroke-width="3" opacity=".5" fill="none"/></svg>`;
TYPES.pescar = {
  name: ['Pescar', 'Fishing'], icon: '🎣', theme: 'cielo',
  make(c) {
    c.noRestart = true;
    const water = mk('div', 'pond', '', c.stage);
    const fcols = sample(c.r, COLORS.slice(0, 6), 3), target = c.d >= 1 ? pick(c.r, fcols) : null, nf = 5 + c.d, need = target ? Math.min(3, 2 + Math.floor(c.d / 2)) : 3;
    const wr = () => water.getBoundingClientRect(), sr0 = c.stage.getBoundingClientRect(), R = wr(), U = unit(c), fw = clamp(U * .17, 64, 130);
    const bucket = mk('div', 'card bucket', `<span class="emo">🧺</span><b>0/${need}</b>`, c.stage);
    const fish = Array.from({ length: nf }, (_, i) => { const col = target && i < need + 1 ? target : pick(c.r, fcols); const f = mk('div', 'fish', fishSVG(col.h, col.d), c.stage, `width:${fw}px`); f.col = col; f.x = R.left - sr0.left + c.r() * (R.width - fw); f.y = R.top - sr0.top + 20 + c.r() * (R.height - fw * .7 - 30); f.vx = (c.r() < .5 ? -1 : 1) * (.6 + c.r() * .8 + c.d * .15); f.ph = c.r() * 6; f.addEventListener('pointerdown', () => hook(f)); return f; });
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); line.setAttribute('style', 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:6'); c.stage.appendChild(line);
    let caught = 0, raf = 0, t = 0;
    const loop = () => { if (!alive(c) && G.ctx !== c) return; t += .03; const R2 = wr(), sr = c.stage.getBoundingClientRect(); fish.forEach(f => { if (f.caught) return; f.x += f.vx; const minX = R2.left - sr.left, maxX = R2.right - sr.left - fw; if (f.x < minX || f.x > maxX) { f.vx *= -1; f.x = clamp(f.x, minX, maxX); } f.style.transform = `translate(${f.x}px,${f.y + Math.sin(t + f.ph) * 8}px) scaleX(${f.vx > 0 ? -1 : 1})`; }); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop); c.cleanup = () => cancelAnimationFrame(raf);
    function hook(f) {
      if (f.caught || G.finished) return; markAct();
      if (target && f.col !== target) { AU.sfx('no'); VO.say(L(`Ese pez es ${f.col.n}`, `That fish is ${f.col.en}`), false); f.vx *= -1.4; return; }
      f.caught = true; caught++; AU.sfx('whoosh');
      const sr = c.stage.getBoundingClientRect(), fr = f.getBoundingClientRect(), br = bucket.getBoundingClientRect(), x = fr.left - sr.left + fr.width / 2, y = fr.top - sr.top;
      line.innerHTML = `<path d="M${c.W / 2} 0Q${c.W / 2} ${y / 2} ${x} ${y}" stroke="#555" stroke-width="2" fill="none"/>`;
      f.style.transition = 'transform .7s cubic-bezier(.5,-.3,.5,1)'; f.style.transform = `translate(${br.left - sr.left}px,${br.top - sr.top - 20}px) scale(.4)`;
      setTimeout(() => { line.innerHTML = ''; f.remove(); AU.sfx('splash'); bucket.querySelector('b').textContent = `${caught}/${need}`; bump(bucket); if (caught >= need) { VO.say(L('¡Qué buena pesca!', 'Great fishing!'), false); setTimeout(c.done, 500); } }, 720);
    }
    c.say(target ? L(`¡Pesca ${numw(need)} peces de color ${target.n}!`, `Catch ${numw(need)} ${target.en} fish!`) : L(`¡Pesca ${numw(need)} peces! Tócalos`, `Catch ${numw(need)} fish! Tap them`));
    c.hint = () => fish.find(f => !f.caught && (!target || f.col === target)); c.solve = () => { fish.filter(f => !target || f.col === target).slice(0, need).forEach(hook); };
  }
};
/* 28. JARDÍN ---------------------------------------------------------- */
TYPES.jardin = {
  name: ['Jardín', 'Garden'], icon: '🌻', theme: 'jardin',
  make(c) {
    const n = [3, 3, 4, 4, 5][c.d], U = unit(c), w = clamp(Math.min(c.W / (n + .8), c.H * .4), 80, 190), flowers = ['🌷', '🌻', '🌼', '🌸', '🌹', '💐'];
    const row = mk('div', '', '', c.stage, 'position:absolute;left:0;right:0;bottom:8%;display:flex;justify-content:center;align-items:flex-end;gap:3%');
    const pots = Array.from({ length: n }, (_, i) => { const p = mk('div', 'choice pot', `<div class="plant emo" style="font-size:${w * .2}px">🟤</div><svg viewBox="0 0 100 80" width="100%"><path d="M6 6h88l-12 70H18z" fill="#e07b4a" stroke="#a8481b" stroke-width="5" stroke-linejoin="round"/><rect x="2" y="2" width="96" height="16" rx="5" fill="#c9632f"/></svg>`, row, `width:${w}px`); p.st = 0; p.fl = flowers[(i + Math.floor(c.r() * 6)) % 6]; p.addEventListener('pointerdown', () => water(p)); return p; });
    const STG = [null, ['🌱', .38], ['🌿', .55], [null, .8]];
    function water(p) {
      if (p.st >= 3 || G.finished) return; markAct(); p.st++; AU.sfx('splash'); const [x, y] = centerOf(p); sparkle(x, y - w * .4, 6, ['💧']);
      const pl = p.querySelector('.plant'), [e, s] = STG[p.st]; pl.textContent = e || p.fl; pl.style.fontSize = w * s + 'px'; bump(pl);
      if (p.st === 3) { AU.sfx('magic'); sparkleEl(pl, 8); }
      if (pots.every(q => q.st >= 3)) { const sun = emoEl('🌞', U * .18, c.stage, 'position:absolute;right:6%;top:4%;animation:pop .6s'); VO.say(L('¡Qué jardín tan bonito!', 'What a beautiful garden!'), false); setTimeout(c.done, 1000); }
    }
    c.say(L('Riega las macetas para que crezcan las flores. ¡Toca cada maceta!', 'Water the pots so the flowers grow. Tap each pot!'));
    c.hint = () => pots.find(p => p.st < 3); c.solve = () => pots.forEach(p => { while (p.st < 3) water(p); });
  }
};
/* 29. PATRONES -------------------------------------------------------- */
TYPES.patrones = {
  name: ['Patrones', 'Patterns'], icon: '🔴', theme: 'aula',
  make(c) {
    const rounds = 3, pats = c.d >= 2 ? ['AB', 'AAB', 'ABB', 'ABC', 'AABB'] : ['AB', 'AB', 'AAB', 'ABB'], U = unit(c); let round = 0, opts = [], want = null;
    const dots = mk('div', 'rounddots', '', c.stage);
    const seqBox = mk('div', 'card', '', c.stage, 'position:absolute;left:3%;right:3%;top:12%;height:38%;gap:1.5%;padding:2%;flex-wrap:nowrap');
    const optBox = mk('div', '', '', c.stage, 'position:absolute;left:0;right:0;bottom:6%;height:32%;display:flex;justify-content:center;align-items:center;gap:5%');
    const kinds = [() => sample(c.r, COLORS, 3).map(col => ({ html: s => `<svg viewBox="0 0 100 100" width="${s}"><circle cx="50" cy="50" r="42" fill="${col.h}" stroke="${col.d}" stroke-width="6"/></svg>`, id: col.n })),
      () => sample(c.r, FRUITS, 3).map(f => ({ html: s => art(f, s), id: f.n })), () => sample(c.r, ANIMALS, 3).map(a => ({ html: s => art(a, s), id: a.k })),
      () => { const col = COLORS[Math.floor(c.r() * 8)]; return sample(c.r, SHAPES.slice(0, 6), 3).map(s => ({ html: z => shapeSV(s, col.h, z + 'px'), id: s.n })); }];
    function next() {
      dots.innerHTML = Array.from({ length: rounds }, (_, i) => `<span class="${i < round ? 'on' : ''}"></span>`).join('');
      if (round >= rounds) { c.done(); return; }
      const items = pick(c.r, kinds)(), pat = pick(c.r, pats), L0 = Math.max(6, pat.length * 2 + 1), seq = Array.from({ length: L0 }, (_, i) => items['ABC'.indexOf(pat[i % pat.length])]);
      want = seq[L0 - 1]; const s = clamp(Math.min(c.W * .9 / (L0 + .5), c.H * .3), 34, 110);
      seqBox.innerHTML = seq.map((it, i) => i < L0 - 1 ? `<div style="width:${s}px;height:${s}px;display:flex;align-items:center;justify-content:center">${it.html(s * .9)}</div>` : `<div class="qslot" style="width:${s}px;height:${s}px">?</div>`).join('');
      const uniq = [...new Set(seq)]; while (uniq.length < 3) uniq.push(items.find(x => !uniq.includes(x)) || items[0]);
      optBox.innerHTML = ''; const bs = clamp(U * .2, 70, 140);
      opts = shuf(c.r, uniq.slice(0, 3)).map(it => { const b = mk('div', 'card choice', it.html(bs * .7), optBox, `width:${bs}px;height:${bs}px`); b.it = it; b.addEventListener('pointerdown', () => choose(b)); return b; });
      c.say(L('¿Qué sigue? Completa el patrón', 'What comes next? Complete the pattern'));
    }
    function choose(b) { if (G.finished || b.busy) return; markAct(); if (b.it === want) { b.busy = true; const q = seqBox.querySelector('.qslot'); q.innerHTML = b.innerHTML; q.classList.add('ok'); AU.sfx('ok'); sparkleEl(q, 8); round++; setTimeout(next, 900); } else { AU.sfx('no'); bump(b, 'shake'); } }
    next();
    c.hint = () => opts.find(b => b.it === want); c.solve = () => { round = rounds; next(); };
  }
};
/* 30. DIFERENCIAS ----------------------------------------------------- */
TYPES.diferencias = {
  name: ['Diferencias', 'Spot the difference'], icon: '👀', theme: 'cielo',
  make(c) {
    const land = c.W > c.H, nd = c.d >= 3 ? 4 : 3, ni = 8;
    const pw = land ? Math.min(c.W * .46, c.H * .9 * 1.2) : Math.min(c.W * .92, c.H * .44 * 1.2), ph = pw / 1.2;
    const wrap = mk('div', '', '', c.stage, `position:absolute;inset:0;display:flex;flex-direction:${land ? 'row' : 'column'};align-items:center;justify-content:center;gap:2%`);
    const scene = pick(c.r, ['cielo', 'granja', 'mar', 'jardin', 'bosque']);
    const pool = [...ANIMALS.map(a => ({ t: 'a', it: a })), ...THINGS.map(t => ({ t: 'e', it: t })), ...SHAPES.slice(0, 6).map(s => ({ t: 's', it: s, col: COLORS[Math.floor(c.r() * 8)] }))];
    const items = sample(c.r, pool, ni).map((o, i) => Object.assign({}, o, { x: 10 + (i % 4) * 22 + c.r() * 8, y: 18 + Math.floor(i / 4) * 44 + c.r() * 14, s: .17 + c.r() * .05 }));
    const changed = sample(c.r, items.map((_, i) => i), nd).map(i => ({ i, kind: items[i].t === 's' ? pick(c.r, ['color', 'hide']) : pick(c.r, ['hide', 'swap']) }));
    const render = (right) => items.map((o, i) => {
      const ch = right && changed.find(x => x.i === i); if (ch && ch.kind === 'hide') return '';
      let it = o.it, col = o.col; if (ch && ch.kind === 'swap') it = o.t === 'a' ? ANIMALS[(ANIMALS.indexOf(o.it) + 3) % ANIMALS.length] : THINGS[(THINGS.indexOf(o.it) + 5) % THINGS.length]; if (ch && ch.kind === 'color') col = COLORS[(COLORS.indexOf(o.col) + 3) % 8];
      const sz = pw * o.s, html = o.t === 's' ? shapeSV(it, col.h, sz + 'px') : art(it, sz);
      return `<div style="position:absolute;left:${o.x}%;top:${o.y}%;width:${sz}px;height:${sz}px;display:flex;align-items:center;justify-content:center;pointer-events:none">${html}</div>`;
    }).join('');
    const panels = [0, 1].map(k => mk('div', 'diffpanel', `<div class="bgwrap">${bgSVG(scene)}</div>${render(k === 1)}`, wrap, `width:${pw}px;height:${ph}px`));
    let found = 0;
    function mark(ch) { if (ch.found) return; ch.found = true; found++; AU.sfx('ok'); const o = items[ch.i], sz = pw * o.s; panels.forEach(p => { const m = mk('div', 'diffmark', '', p, `left:calc(${o.x}% - 10px);top:calc(${o.y}% - 10px);width:${sz + 20}px;height:${sz + 20}px`); bump(m); }); sparkleEl(panels[1], 6); if (found >= nd) { VO.say(L('¡Encontraste todas las diferencias!', 'You found all the differences!'), false); setTimeout(c.done, 800); } else VO.say(L(`¡Bien! Faltan ${numw(nd - found)}`, `Good! ${numw(nd - found)} to go`), false); }
    panels.forEach(p => p.addEventListener('pointerdown', e => {
      if (G.finished) return; markAct(); const r = p.getBoundingClientRect(), px = (e.clientX - r.left) / r.width * 100, py = (e.clientY - r.top) / r.height * 100;
      const ch = changed.find(x => { const o = items[x.i], s = o.s * 100, sy = s * 1.2; return !x.found && px > o.x - 6 && px < o.x + s + 6 && py > o.y - 8 && py < o.y + sy + 8; });
      if (ch) mark(ch); else { AU.sfx('tap'); const m = mk('div', 'emo', '❌', p, `position:absolute;left:${px}%;top:${py}%;transform:translate(-50%,-50%);font-size:22px;opacity:.7;pointer-events:none`); setTimeout(() => m.remove(), 500); }
    }));
    c.say(L(`Encuentra ${numw(nd)} diferencias entre los dibujos`, `Find ${numw(nd)} differences between the pictures`));
    c.hint = () => { const ch = changed.find(x => !x.found); if (!ch) return null; const o = items[ch.i]; const h = mk('div', '', '', panels[1], `position:absolute;left:${o.x}%;top:${o.y}%;width:${pw * o.s}px;height:${pw * o.s}px;pointer-events:none`); setTimeout(() => h.remove(), 1500); return h; };
    c.solve = () => changed.forEach(mark);
  }
};
/* 31. VEHÍCULOS ------------------------------------------------------- */
const VEH = [
  { e: '🚗', n: 'carro', en: 'car', a: 'el', s: 'horn' }, { e: '🚌', n: 'bus', en: 'bus', a: 'el', s: 'horn' }, { e: '🚒', n: 'camión de bomberos', en: 'fire truck', a: 'el', s: 'siren' },
  { e: '🚑', n: 'ambulancia', en: 'ambulance', a: 'la', s: 'siren' }, { e: '🚓', n: 'patrullero', en: 'police car', a: 'el', s: 'siren' }, { e: '🚜', n: 'tractor', en: 'tractor', a: 'el', s: 'horn' },
  { e: '🚂', n: 'tren', en: 'train', a: 'el', s: 'train' }, { e: '✈️', n: 'avión', en: 'airplane', a: 'el', s: 'plane' }, { e: '🚁', n: 'helicóptero', en: 'helicopter', a: 'el', s: 'plane' },
  { e: '⛵', n: 'barco', en: 'boat', a: 'el', s: 'horn' }, { e: '🚲', n: 'bicicleta', en: 'bicycle', a: 'la', s: 'coin' }, { e: '🚀', n: 'cohete', en: 'rocket', a: 'el', s: 'plane' }
];
TYPES.vehiculos = {
  name: ['Vehículos', 'Vehicles'], icon: '🚌', theme: 'ciudad',
  make(c) {
    const rounds = 3, n = [3, 3, 4, 4, 5][c.d], U = unit(c); let round = 0, target = null, els = [];
    const dots = mk('div', 'rounddots', '', c.stage);
    const area = mk('div', '', '', c.stage, 'position:absolute;left:2%;right:2%;top:14%;bottom:12%;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:4%');
    const sz = clamp(U * (n > 3 ? .2 : .26), 70, 170);
    function next() {
      dots.innerHTML = Array.from({ length: rounds }, (_, i) => `<span class="${i < round ? 'on' : ''}"></span>`).join('');
      if (round >= rounds) { c.done(); return; }
      const opts = sample(c.r, VEH, n); target = pick(c.r, opts); area.innerHTML = '';
      els = opts.map(v => { const b = mk('div', 'card choice boing', `<span class="emo" style="font-size:${sz * .62}px">${v.e}</span>`, area, `width:${sz}px;height:${sz}px;transition:transform .9s ease-in`); b.v = v; b.addEventListener('pointerdown', () => choose(b)); return b; });
      c.say(L(`¿Dónde está ${the(target)}?`, `Where is ${the(target)}?`));
    }
    function choose(b) { if (G.finished || b.busy) return; markAct(); if (b.v === target) { b.busy = true; AU.sfx(b.v.s); sparkleEl(b, 10); b.style.transform = 'translateX(-130vw)'; VO.say(cap(nm(b.v)), false); round++; setTimeout(next, 1100); } else { AU.sfx('no'); bump(b, 'shake'); VO.say(L(`Ese es ${the(b.v)}`, `That is ${the(b.v)}`), false); } }
    next();
    c.hint = () => els.find(b => b.v === target); c.solve = () => { round = rounds; next(); };
  }
};
/* 32. ROPA SEGÚN EL CLIMA --------------------------------------------- */
const WEATHER = {
  sol: { n: ['hace sol', 'it is sunny'], q: ['¿Qué te pones cuando hace sol?', 'What do you wear when it is sunny?'], ok: [['🕶️', 'lentes de sol', 'sunglasses'], ['🧢', 'gorra', 'cap'], ['👒', 'sombrero', 'sun hat'], ['🩳', 'short', 'shorts']] },
  lluvia: { n: ['llueve', 'it is raining'], q: ['¿Qué te pones cuando llueve?', 'What do you wear when it rains?'], ok: [['☂️', 'paraguas', 'umbrella'], ['🥾', 'botas', 'boots'], ['🧥', 'casaca', 'raincoat']] },
  nieve: { n: ['hace frío', 'it is cold'], q: ['¿Qué te pones cuando hace frío?', 'What do you wear when it is cold?'], ok: [['🧣', 'bufanda', 'scarf'], ['🧤', 'guantes', 'gloves'], ['🥼', 'abrigo', 'coat']] }
};
TYPES.clima = {
  name: ['Ropa y clima', 'Weather clothes'], icon: '☂️', theme: 'cielo',
  make(c) {
    const wk = pick(c.r, Object.keys(WEATHER)), W0 = WEATHER[wk], U = unit(c);
    if (wk !== 'sol') { const fx = mk('div', 'wfx ' + wk, '', c.stage); for (let i = 0; i < (LITE() ? 20 : 60); i++) mk('i', '', '', fx, `left:${Math.random() * 100}%;animation-delay:${-Math.random() * 2}s;animation-duration:${wk === 'lluvia' ? .6 + Math.random() * .4 : 3 + Math.random() * 3}s`); if (wk === 'lluvia') mk('div', 'emo', '🌧️', c.stage, `position:absolute;left:10%;top:2%;font-size:${U * .2}px`); else mk('div', 'emo', '❄️', c.stage, `position:absolute;left:10%;top:2%;font-size:${U * .16}px`); }
    else mk('div', 'emo', '🌞', c.stage, `position:absolute;left:8%;top:2%;font-size:${U * .22}px;animation:spin 12s linear infinite`);
    const ps = clamp(U * .52, 160, 380), pipo = mk('div', '', pipoSVG(wk === 'sol' ? 'happy' : 'sad', {}, curProfile().color), c.stage, `position:absolute;width:${ps}px;left:${(c.W - ps) / 2}px;top:${(c.H - ps * 1.1) / 2 + 10}px;z-index:2`);
    const goods = sample(c.r, W0.ok, 2), bads = sample(c.r, Object.keys(WEATHER).filter(k => k !== wk).flatMap(k => WEATHER[k].ok), c.d >= 2 ? 3 : 2);
    const opts = shuf(c.r, [...goods.map(g => ({ g, ok: true })), ...bads.map(g => ({ g, ok: false }))]), isz = clamp(U * .16, 56, 110);
    const els = opts.map((o, k) => { const left = k % 2 === 0, idx = Math.floor(k / 2), rows = Math.ceil(opts.length / 2); const e = mk('div', 'card', `<span class="emo" style="font-size:${isz * .7}px">${o.g[0]}</span>`, c.stage, `position:absolute;width:${isz}px;height:${isz}px;${left ? 'left:4%' : 'right:4%'};top:${((idx + .5) / rows) * 90 + 5}%;transform:translateY(-50%);z-index:3`); e._base = 'translateY(-50%)'; e.o = o; draggable(e, { targets: () => [pipo], onDrop: (t, e) => wear(e) }); return e; });
    let got = 0;
    function wear(e) {
      if (!e.o.ok) { VO.say(L(`Cuando ${W0.n[0]} no necesitas ${e.o.g[1]}`, `When ${W0.n[1]} you do not need ${e.o.g[2]}`), false); return false; }
      e._locked = true; got++; AU.sfx('ok'); const [x, y] = centerOf(pipo), pr = pipo.getBoundingClientRect(), sr = c.stage.getBoundingClientRect();
      e.style.transition = 'all .4s'; e.style.left = (pr.left - sr.left + pr.width * (got === 1 ? .1 : .62)) + 'px'; e.style.right = 'auto'; e.style.top = (pr.top - sr.top + pr.height * .55) + 'px'; e.style.transform = 'translateY(-50%) scale(.9)'; e.style.boxShadow = 'none'; e.style.background = 'transparent';
      VO.say(cap(EN() ? e.o.g[2] : e.o.g[1]), false);
      if (got >= 2) { pipo.innerHTML = pipoSVG('joy', {}, curProfile().color); sparkleEl(pipo, 12); setTimeout(c.done, 800); }
      return true;
    }
    c.say(L(W0.q[0], W0.q[1]) + ' ' + L('Arrastra dos cosas a Pipo', 'Drag two things to Pipo'));
    c.hint = () => els.find(e => e.o.ok && !e._locked); c.solve = () => els.filter(e => e.o.ok && !e._locked).forEach(wear);
  }
};
/* 33. EMOCIONES ------------------------------------------------------- */
const MOODS = [
  { m: 'joy', n: ['feliz', 'happy'], e: ['¡Sí! Está feliz', 'Yes! Happy'] }, { m: 'sad', n: ['triste', 'sad'], e: ['¡Sí! Está triste. Démosle un abrazo', 'Yes! Sad. Let us give a hug'] },
  { m: 'angry', n: ['enojada', 'angry'], e: ['¡Sí! Está enojada. Respiremos juntos', 'Yes! Angry. Let us breathe together'] }, { m: 'wow', n: ['sorprendida', 'surprised'], e: ['¡Sí! ¡Está sorprendida!', 'Yes! Surprised!'] },
  { m: 'sleepy', n: ['con sueño', 'sleepy'], e: ['¡Sí! Tiene sueño', 'Yes! Sleepy'] }
];
TYPES.emociones = {
  name: ['Emociones', 'Feelings'], icon: '😊', theme: 'dulce',
  make(c) {
    const rounds = 3, n = [3, 4, 4, 5, 5][c.d], U = unit(c); let round = 0, target = null, els = [];
    const dots = mk('div', 'rounddots', '', c.stage);
    const area = mk('div', '', '', c.stage, 'position:absolute;left:2%;right:2%;top:12%;bottom:14%;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:3%');
    const sz = clamp(U * (n > 4 ? .24 : .28), 80, 190);
    function next() {
      dots.innerHTML = Array.from({ length: rounds }, (_, i) => `<span class="${i < round ? 'on' : ''}"></span>`).join('');
      if (round >= rounds) { c.done(); return; }
      const an = pick(c.r, ANIMALS), moods = sample(c.r, MOODS, n); target = pick(c.r, moods); area.innerHTML = '';
      els = moods.map(md => { const b = mk('div', 'card choice boing', animalSVG(an.k, md.m), area, `width:${sz}px;height:${sz}px;padding:${Math.round(sz * .07)}px`); b.md = md; b.addEventListener('pointerdown', () => choose(b)); return b; });
      c.say(L(`Toca la carita ${target.n[0]}`, `Touch the ${target.n[1]} face`));
    }
    function choose(b) { if (G.finished || b.busy) return; markAct(); if (b.md === target) { b.busy = true; AU.sfx('ok'); sparkleEl(b, 10); VO.say(L(target.e[0], target.e[1]), false); round++; setTimeout(next, 1300); } else { AU.sfx('no'); bump(b, 'shake'); VO.say(L(`Esa carita está ${b.md.n[0]}`, `That face is ${b.md.n[1]}`), false); } }
    next();
    c.hint = () => els.find(b => b.md === target); c.solve = () => { round = rounds; next(); };
  }
};
