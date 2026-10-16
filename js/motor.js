/* =====================================================================
   PIPO JUEGA · MOTOR (estado, perfiles, idioma, datos, sonido, voz,
   efectos y arrastrar). Hecho por Leandro Zamora.
===================================================================== */
const $ = s => document.querySelector(s);
const TOTAL = 500;
const CONFIG = {
  // (Opcional) Para guardar el avance en la nube con Supabase. Ver docs/supabase-pipo.sql
  SUPABASE_URL: 'https://qeiflqmnnimzxpkjcvyi.supabase.co',
  SUPABASE_KEY: 'sb_publishable_FnxS0I9ZoiWDwPypS6cPIA_NO8jfaSV'
};
/* ---------- aleatoriedad con semilla ---------- */
const rng = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const hashN = n => { let h = 2166136261 ^ n; h = Math.imul(h ^ h >>> 13, 16777619); h = Math.imul(h ^ h >>> 15, 2246822507); return (h ^ h >>> 16) >>> 0; };
const pick = (r, a) => a[Math.floor(r() * a.length)];
const shuf = (r, a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const sample = (r, a, n) => shuf(r, a).slice(0, n);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
const today = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };

/* =====================================================================
   ESTADO: ajustes globales + un perfil por niño
===================================================================== */
const GKEY = 'pipo-global-v2';
let GL = { profiles: [], cur: null, set: { sound: true, voice: true, music: true, night: false, lang: 'es', limit: 0, off: [], lite: null }, cloud: '' };
try { const g = JSON.parse(localStorage.getItem(GKEY) || 'null'); if (g) { GL = Object.assign(GL, g); GL.set = Object.assign({ sound: true, voice: true, music: true, night: false, lang: 'es', limit: 0, off: [], lite: null }, g.set || {}); } } catch (e) {}
const blankProfile = () => ({ best: 1, done: '', stars: 0, stickers: [], acc: ACC_BASE.slice(), outfit: {}, streak: 0, lastDay: '', todayMs: 0, todayDate: '', stats: {}, chests: [] });
let S = blankProfile();
const pkey = id => 'pipo-perfil-' + id;
function saveGL() { try { localStorage.setItem(GKEY, JSON.stringify(GL)); } catch (e) {} }
function save() { try { if (GL.cur) localStorage.setItem(pkey(GL.cur), JSON.stringify(S)); } catch (e) {} if (typeof cloudSoon === 'function') cloudSoon(); }
function loadProfile(id) { GL.cur = id; saveGL(); try { S = Object.assign(blankProfile(), JSON.parse(localStorage.getItem(pkey(id)) || '{}')); } catch (e) { S = blankProfile(); } }
const curProfile = () => GL.profiles.find(p => p.id === GL.cur) || { name: '', age: 4, color: '#ff6fa8', avatar: 'pollito' };
function createProfile(name, age, color, avatar) {
  const id = Math.random().toString(36).slice(2, 9);
  GL.profiles.push({ id, name: (name || '').trim().slice(0, 18), age: age || 4, color: color || '#ff6fa8', avatar: avatar || 'pollito' }); saveGL();
  loadProfile(id); S = blankProfile(); save(); return id;
}
// migración desde la versión 1
(function migrate() {
  if (GL.profiles.length) { loadProfile(GL.cur && GL.profiles.some(p => p.id === GL.cur) ? GL.cur : GL.profiles[0].id); return; }
  let old = null; try { old = JSON.parse(localStorage.getItem('pipo-juega-v1') || 'null'); } catch (e) {}
  createProfile('', 4, '#ff6fa8', 'pollito');
  if (old) { S.best = clamp(old.best || old.level || 1, 1, TOTAL); S.stars = old.stars || 0; S.stickers = old.stickers || []; S.done = '1'.repeat(S.best - 1); GL.set.sound = old.sound !== false; GL.set.voice = old.voice !== false; GL.set.music = old.music !== false; saveGL(); save(); }
})();
const isDone = n => S.done.charAt(n - 1) === '1';
function markDone(n) { const a = S.done.padEnd(TOTAL, '0').split(''); a[n - 1] = '1'; S.done = a.join('').replace(/0+$/, ''); }
const doneCount = () => (S.done.match(/1/g) || []).length;

/* =====================================================================
   IDIOMA (español / inglés)
===================================================================== */
const EN = () => GL.set.lang === 'en';
const L = (es, en) => EN() ? en : es;
const nm = it => EN() ? (it.en || it.n) : it.n;
const the = it => EN() ? 'the ' + (it.en || it.n) : `${it.a || 'el'} ${it.n}`;
const NUMW = { es: ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce'], en: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'] };
const numw = n => (EN() ? NUMW.en : NUMW.es)[n] || String(n);
const PRAISE = { es: ['¡Muy bien!', '¡Excelente!', '¡Genial!', '¡Bravo!', '¡Lo lograste!', '¡Súper!', '¡Increíble!', '¡Fantástico!', '¡Qué inteligente!', '¡Eres una estrella!'], en: ['Very good!', 'Excellent!', 'Great job!', 'Bravo!', 'You did it!', 'Super!', 'Amazing!', 'Fantastic!', 'So smart!', "You're a star!"] };

/* =====================================================================
   DATOS EDUCATIVOS
===================================================================== */
const FRUITS = [
  { e: '🍎', n: 'manzana', en: 'apple', a: 'la', c: 'rojo' }, { e: '🍌', n: 'plátano', en: 'banana', a: 'el', c: 'amarillo' }, { e: '🍓', n: 'fresa', en: 'strawberry', a: 'la', c: 'rojo' },
  { e: '🍍', n: 'piña', en: 'pineapple', a: 'la', c: 'amarillo' }, { e: '🍊', n: 'naranja', en: 'orange', a: 'la', c: 'naranja' }, { e: '🍇', n: 'uvas', en: 'grapes', a: 'las', c: 'morado' },
  { e: '🍐', n: 'pera', en: 'pear', a: 'la', c: 'verde' }, { e: '🍉', n: 'sandía', en: 'watermelon', a: 'la', c: 'verde' }, { e: '🍒', n: 'cerezas', en: 'cherries', a: 'las', c: 'rojo' },
  { e: '🥝', n: 'kiwi', en: 'kiwi', a: 'el', c: 'verde' }, { e: '🍋', n: 'limón', en: 'lemon', a: 'el', c: 'amarillo' }, { e: '🍑', n: 'durazno', en: 'peach', a: 'el', c: 'naranja' }
];
const ANIMALS = [
  { k: 'perro', n: 'perro', en: 'dog', a: 'el', s: '¡Guau guau!', se: 'Woof woof!' }, { k: 'gato', n: 'gato', en: 'cat', a: 'el', s: '¡Miau!', se: 'Meow!' },
  { k: 'vaca', n: 'vaca', en: 'cow', a: 'la', s: '¡Muuu!', se: 'Moo!' }, { k: 'cerdito', n: 'cerdito', en: 'pig', a: 'el', s: '¡Oink oink!', se: 'Oink oink!' },
  { k: 'rana', n: 'rana', en: 'frog', a: 'la', s: '¡Croac!', se: 'Ribbit!' }, { k: 'leon', n: 'león', en: 'lion', a: 'el', s: '¡Grrr!', se: 'Roar!' },
  { k: 'mono', n: 'mono', en: 'monkey', a: 'el', s: '¡U u a a!', se: 'Oo oo ah ah!' }, { k: 'conejo', n: 'conejo', en: 'rabbit', a: 'el', s: '', se: '' },
  { k: 'oso', n: 'oso', en: 'bear', a: 'el', s: '¡Grrr!', se: 'Grr!' }, { k: 'panda', n: 'panda', en: 'panda', a: 'el', s: '', se: '' },
  { k: 'pollito', n: 'pollito', en: 'chick', a: 'el', s: '¡Pío pío!', se: 'Tweet tweet!' }, { k: 'pato', n: 'pato', en: 'duck', a: 'el', s: '¡Cuac cuac!', se: 'Quack quack!' },
  { k: 'oveja', n: 'oveja', en: 'sheep', a: 'la', s: '¡Beee!', se: 'Baa!' }, { k: 'raton', n: 'ratón', en: 'mouse', a: 'el', s: '¡Iii iii!', se: 'Squeak!' },
  { k: 'zorro', n: 'zorro', en: 'fox', a: 'el', s: '', se: '' }, { k: 'koala', n: 'koala', en: 'koala', a: 'el', s: '', se: '' },
  { k: 'tigre', n: 'tigre', en: 'tiger', a: 'el', s: '¡Grrr!', se: 'Roar!' }, { k: 'elefante', n: 'elefante', en: 'elephant', a: 'el', s: '¡Pruuu!', se: 'Toot!' },
  { k: 'jirafa', n: 'jirafa', en: 'giraffe', a: 'la', s: '', se: '' }, { k: 'pinguino', n: 'pingüino', en: 'penguin', a: 'el', s: '', se: '' },
  { k: 'buho', n: 'búho', en: 'owl', a: 'el', s: '¡Uh uh!', se: 'Hoo hoo!' }
];
const COLORS = [
  { n: 'rojo', en: 'red', h: '#ff4d4d', d: '#c62828' }, { n: 'azul', en: 'blue', h: '#3d8bff', d: '#1d5bc2' }, { n: 'amarillo', en: 'yellow', h: '#ffd23f', d: '#d19b00' }, { n: 'verde', en: 'green', h: '#4cd964', d: '#21963a' },
  { n: 'naranja', en: 'orange', h: '#ff9a3c', d: '#d06512' }, { n: 'morado', en: 'purple', h: '#a66bff', d: '#6f35cc' }, { n: 'rosado', en: 'pink', h: '#ff7eb6', d: '#d4407f' }, { n: 'celeste', en: 'light blue', h: '#5fd3ff', d: '#1c9ccc' }
];
const colorName = c => EN() ? c.en : c.n;
const SHAPES = [
  { n: 'círculo', en: 'circle', a: 'el', p: 'M50 8 A42 42 0 1 1 49.9 8Z' }, { n: 'cuadrado', en: 'square', a: 'el', p: 'M12 12H88V88H12Z' }, { n: 'triángulo', en: 'triangle', a: 'el', p: 'M50 8L92 88H8Z' },
  { n: 'estrella', en: 'star', a: 'la', p: 'M50 5L61 37H95L68 57L78 90L50 70L22 90L32 57L5 37H39Z' }, { n: 'corazón', en: 'heart', a: 'el', p: 'M50 88C20 66 6 50 6 32 6 18 17 8 30 8 40 8 46 14 50 22 54 14 60 8 70 8 83 8 94 18 94 32 94 50 80 66 50 88Z' },
  { n: 'rombo', en: 'diamond', a: 'el', p: 'M50 5L92 50L50 95L8 50Z' }, { n: 'luna', en: 'moon', a: 'la', p: 'M64 8A42 42 0 1 0 64 92 34 34 0 1 1 64 8Z' }, { n: 'rectángulo', en: 'rectangle', a: 'el', p: 'M6 26H94V74H6Z' }
];
const THINGS = [
  { e: '🚗', n: 'carro', en: 'car', a: 'el' }, { e: '🚀', n: 'cohete', en: 'rocket', a: 'el' }, { e: '⚽', n: 'pelota', en: 'ball', a: 'la' }, { e: '🎈', n: 'globo', en: 'balloon', a: 'el' },
  { e: '🧸', n: 'osito', en: 'teddy bear', a: 'el' }, { e: '🌞', n: 'sol', en: 'sun', a: 'el' }, { e: '⭐', n: 'estrella', en: 'star', a: 'la' }, { e: '🌙', n: 'luna', en: 'moon', a: 'la' },
  { e: '🏠', n: 'casa', en: 'house', a: 'la' }, { e: '🌳', n: 'árbol', en: 'tree', a: 'el' }, { e: '🍦', n: 'helado', en: 'ice cream', a: 'el' }, { e: '🎂', n: 'pastel', en: 'cake', a: 'el' },
  { e: '🚂', n: 'tren', en: 'train', a: 'el' }, { e: '✈️', n: 'avión', en: 'airplane', a: 'el' }, { e: '🚲', n: 'bicicleta', en: 'bicycle', a: 'la' }, { e: '🎸', n: 'guitarra', en: 'guitar', a: 'la' },
  { e: '🌈', n: 'arcoíris', en: 'rainbow', a: 'el' }, { e: '☂️', n: 'paraguas', en: 'umbrella', a: 'el' }, { e: '👟', n: 'zapatilla', en: 'shoe', a: 'la' }, { e: '🎩', n: 'sombrero', en: 'hat', a: 'el' },
  { e: '🚌', n: 'bus', en: 'bus', a: 'el' }, { e: '⛵', n: 'barco', en: 'boat', a: 'el' }, { e: '🌸', n: 'flor', en: 'flower', a: 'la' }, { e: '🍄', n: 'hongo', en: 'mushroom', a: 'el' },
  { e: '🥕', n: 'zanahoria', en: 'carrot', a: 'la' }, { e: '🍪', n: 'galleta', en: 'cookie', a: 'la' }
];
const STICKERS = ['🦄', '🐬', '🦖', '🐲', '🦜', '🦩', '🐳', '🦔', '🦦', '🐿️', '🦥', '🐊', '🦓', '🦘', '🐆', '🦚', '🐉', '🦕', '🐠', '🐡', '🦀', '🐌', '🐛', '🦗', '🐞', '🌻', '🌵', '🍀', '🌺', '🍁', '🌍', '🪐', '☄️', '🌟', '🎠', '🎡', '🎢', '🚁', '🛸', '🚒', '🚜', '🏰', '🎪', '🎨', '🎺', '🥁', '🎹', '🏆', '👑', '💎'];
/* dibujo de un elemento: animal SVG propio o emoji */
function art(it, px, mood) {
  if (it && it.k && AN[it.k]) return `<span class="art" style="width:${px}px;height:${px}px">${animalSVG(it.k, mood)}</span>`;
  return `<span class="emo" style="font-size:${px * .86}px">${it ? it.e : ''}</span>`;
}

/* =====================================================================
   SONIDO (Web Audio): efectos, notas y voces de animales
===================================================================== */
const AU = {
  ctx: null, master: null,
  init() {
    if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); this.master = this.ctx.createGain(); this.master.gain.value = .8; this.master.connect(this.ctx.destination); } catch (e) { return; } }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  },
  tone(f, d = .15, type = 'sine', vol = .22, when = 0, f2 = 0) {
    if (!this.ctx) return; const t = this.ctx.currentTime + when, o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .012); g.gain.exponentialRampToValueAtTime(.0008, t + d);
    o.connect(g); g.connect(this.master); o.start(t); o.stop(t + d + .05);
  },
  noise(d = .2, vol = .25, freq = 1200, when = 0, q = 1, type = 'bandpass') {
    if (!this.ctx) return; const t = this.ctx.currentTime + when, len = Math.max(1, Math.floor(this.ctx.sampleRate * d)), buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate), data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.min(1, (len - i) / (len * .3)) * Math.min(1, i / (len * .05 + 1));
    const s = this.ctx.createBufferSource(), f = this.ctx.createBiquadFilter(), g = this.ctx.createGain(); s.buffer = buf; f.type = type; f.frequency.value = freq; f.Q.value = q; g.gain.value = vol;
    s.connect(f); f.connect(g); g.connect(this.master); s.start(t);
  },
  /* voz sintetizada con curva de tono, vibrato y filtro */
  voc({ type = 'sawtooth', f = [[0, 300]], dur = .5, vol = .2, when = 0, vib = null, filt = null, att = .03 }) {
    if (!this.ctx) return; const c = this.ctx, t = c.currentTime + when, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f[0][1], t); f.slice(1).forEach(([k, v]) => o.frequency.linearRampToValueAtTime(v, t + k * dur));
    let node = o;
    if (vib) { const l = c.createOscillator(), lg = c.createGain(); l.frequency.value = vib[0]; lg.gain.value = vib[1]; l.connect(lg); lg.connect(o.frequency); l.start(t); l.stop(t + dur + .05); }
    if (filt) { const fl = c.createBiquadFilter(); fl.type = filt[0]; fl.frequency.value = filt[1]; fl.Q.value = filt[2] || 1; o.connect(fl); node = fl; }
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + att); g.gain.setValueAtTime(vol, t + dur * .7); g.gain.exponentialRampToValueAtTime(.001, t + dur);
    node.connect(g); g.connect(this.master); o.start(t); o.stop(t + dur + .05);
  },
  animal(k) {
    if (!GL.set.sound) return; this.init(); if (!this.ctx) return;
    const V = o => this.voc(o), N = this.noise.bind(this);
    switch (k) {
      case 'perro': [0, .28].forEach(w => { N(.12, .3, 900, w, 1.5); V({ type: 'square', f: [[0, 420], [1, 230]], dur: .16, vol: .12, when: w, filt: ['lowpass', 1400] }); }); break;
      case 'gato': V({ type: 'sawtooth', f: [[0, 520], [.35, 820], [1, 480]], dur: .75, vol: .12, vib: [6, 14], filt: ['bandpass', 1500, 1.4] }); break;
      case 'vaca': V({ type: 'sawtooth', f: [[0, 150], [.3, 170], [1, 120]], dur: 1.3, vol: .2, vib: [4, 4], filt: ['lowpass', 700] }); break;
      case 'oveja': V({ type: 'square', f: [[0, 440], [1, 400]], dur: .8, vol: .1, vib: [13, 26], filt: ['bandpass', 1300, 1.2] }); break;
      case 'cerdito': [0, .3].forEach(w => { V({ type: 'square', f: [[0, 260], [1, 170]], dur: .2, vol: .12, when: w, filt: ['bandpass', 800, 2] }); N(.15, .15, 500, w, 2); }); break;
      case 'pato': [0, .25].forEach(w => V({ type: 'square', f: [[0, 560], [1, 470]], dur: .17, vol: .12, when: w, filt: ['bandpass', 1300, 3] })); break;
      case 'pollito': case 'buho_chick': [0, .16, .32].forEach(w => V({ type: 'sine', f: [[0, 2300], [1, 3000]], dur: .1, vol: .14, when: w })); break;
      case 'rana': [0, .32].forEach(w => V({ type: 'square', f: [[0, 130], [1, 110]], dur: .22, vol: .14, when: w, vib: [40, 30], filt: ['bandpass', 600, 2] })); break;
      case 'leon': case 'tigre': case 'oso': N(1, .35, k === 'oso' ? 220 : 320, 0, .7, 'lowpass'); V({ type: 'sawtooth', f: [[0, 90], [.4, 120], [1, 70]], dur: 1, vol: .14, vib: [18, 10], filt: ['lowpass', 500] }); break;
      case 'caballo': V({ type: 'sawtooth', f: [[0, 700], [.3, 1300], [1, 600]], dur: 1, vol: .1, vib: [16, 60], filt: ['bandpass', 1600, 1] }); break;
      case 'raton': [0, .14, .28].forEach(w => V({ type: 'sine', f: [[0, 2600], [1, 3200]], dur: .08, vol: .12, when: w })); break;
      case 'elefante': V({ type: 'sawtooth', f: [[0, 300], [.3, 820], [1, 640]], dur: 1.1, vol: .14, vib: [7, 30], filt: ['bandpass', 1100, 1.5] }); break;
      case 'buho': [0, .5].forEach(w => V({ type: 'sine', f: [[0, 420], [1, 380]], dur: .38, vol: .2, when: w, att: .12 })); break;
      case 'mono': [0, .2, .4].forEach((w, i) => V({ type: 'square', f: [[0, 500 + i * 120], [1, 900 + i * 100]], dur: .16, vol: .1, when: w, filt: ['bandpass', 1200, 2] })); break;
      case 'pinguino': [0, .22].forEach(w => V({ type: 'sawtooth', f: [[0, 620], [1, 520]], dur: .16, vol: .1, when: w, filt: ['bandpass', 1100, 3] })); break;
      default: V({ type: 'sine', f: [[0, 600], [.5, 900], [1, 700]], dur: .3, vol: .16 });
    }
  },
  sfx(n) {
    if (!GL.set.sound) return; this.init(); if (!this.ctx) return;
    const T = this.tone.bind(this);
    switch (n) {
      case 'pop': T(900, .09, 'sine', .3, 0, 260); this.noise(.06, .15, 2400); break;
      case 'tap': T(660, .07, 'triangle', .18); break;
      case 'ok': T(784, .12, 'triangle', .22); T(1175, .2, 'triangle', .22, .09); break;
      case 'no': T(220, .18, 'square', .08, 0, 180); T(196, .22, 'square', .07, .12, 150); if (typeof onMistake === 'function') onMistake(); break;
      case 'win': [523, 659, 784, 1047, 1319].forEach((f, i) => T(f, .25, 'triangle', .2, i * .09)); T(1568, .5, 'sine', .15, .48); break;
      case 'magic': [1319, 1568, 1760, 2093, 2637].forEach((f, i) => T(f, .18, 'sine', .12, i * .05)); break;
      case 'crack': this.noise(.12, .35, 900, 0, 2); T(140, .12, 'square', .08); break;
      case 'splash': this.noise(.45, .3, 700, 0, .6); break;
      case 'scrub': this.noise(.08, .12, 3200, 0, 3); break;
      case 'drop': T(500, .12, 'sine', .2, 0, 900); break;
      case 'coin': T(988, .08, 'square', .1); T(1319, .25, 'square', .1, .08); break;
      case 'whoosh': this.noise(.3, .2, 500, 0, .8); break;
      case 'boing': T(180, .3, 'sine', .25, 0, 520); break;
      case 'zap': T(1400, .15, 'sawtooth', .08, 0, 300); break;
      case 'chomp': T(260, .08, 'square', .12, 0, 120); T(240, .08, 'square', .12, .12, 110); break;
      case 'firework': this.noise(.5, .3, 400, 0, .5, 'lowpass'); T(1800, .4, 'sine', .05, .05, 600); break;
      case 'horn': this.voc({ type: 'square', f: [[0, 360]], dur: .35, vol: .1, filt: ['lowpass', 1200] }); this.voc({ type: 'square', f: [[0, 452]], dur: .35, vol: .08, filt: ['lowpass', 1200] }); break;
      case 'siren': [0, .4, .8].forEach(w => { T(960, .2, 'sine', .14, w); T(700, .2, 'sine', .14, w + .2); }); break;
      case 'train': [0, .25, .5, .75].forEach(w => this.noise(.15, .25, 1500, w, 1)); this.voc({ type: 'sine', f: [[0, 700]], dur: .6, vol: .1, when: 1, vib: [5, 8] }); break;
      case 'plane': this.noise(1.2, .25, 300, 0, .4, 'lowpass'); this.voc({ type: 'sawtooth', f: [[0, 120], [1, 200]], dur: 1.2, vol: .05, filt: ['lowpass', 500] }); break;
      case 'chest': [392, 523, 659, 784, 1047, 1319, 1568].forEach((f, i) => T(f, .3, 'triangle', .16, i * .07)); break;
    }
  },
  note(i, dur = .5, inst = 'piano') { if (!GL.set.sound) return; this.init(); const f = 261.63 * Math.pow(2, [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19][i] / 12); this.tone(f, dur, 'triangle', .3); this.tone(f * 2, dur * .6, 'sine', .08); }
};

/* =====================================================================
   MÚSICA: canciones infantiles tradicionales (dominio público)
===================================================================== */
// notas: semitonos desde Do4; -1 = silencio; [nota, duración en corcheas]
const SONGS = [
  { n: 'Martinillo', m: [[0, 2], [2, 2], [4, 2], [0, 2], [0, 2], [2, 2], [4, 2], [0, 2], [4, 2], [5, 2], [7, 4], [4, 2], [5, 2], [7, 4], [7, 1], [9, 1], [7, 1], [5, 1], [4, 2], [0, 2], [7, 1], [9, 1], [7, 1], [5, 1], [4, 2], [0, 2], [0, 2], [-5, 2], [0, 4], [0, 2], [-5, 2], [0, 4]] },
  { n: 'Estrellita', m: [[0, 2], [0, 2], [7, 2], [7, 2], [9, 2], [9, 2], [7, 4], [5, 2], [5, 2], [4, 2], [4, 2], [2, 2], [2, 2], [0, 4], [7, 2], [7, 2], [5, 2], [5, 2], [4, 2], [4, 2], [2, 4], [7, 2], [7, 2], [5, 2], [5, 2], [4, 2], [4, 2], [2, 4]] },
  { n: 'Los pollitos', m: [[0, 2], [2, 2], [4, 2], [5, 2], [7, 4], [7, 4], [9, 2], [9, 2], [9, 2], [9, 2], [7, 8], [5, 2], [5, 2], [5, 2], [5, 2], [4, 4], [4, 4], [2, 2], [2, 2], [2, 2], [2, 2], [0, 8]] },
  { n: 'Arroz con leche', m: [[-5, 2], [0, 2], [0, 2], [4, 2], [2, 2], [0, 2], [4, 2], [7, 4], [7, 2], [4, 2], [0, 2], [2, 2], [2, 2], [-1, 2], [0, 6], [-5, 2], [0, 2], [0, 2], [4, 2], [2, 2], [0, 2], [4, 2], [7, 4], [5, 2], [4, 2], [2, 2], [0, 2], [2, 2], [-1, 2], [0, 6]] },
  { n: 'Cucú cantaba la rana', m: [[7, 2], [4, 2], [7, 2], [4, 2], [7, 2], [7, 2], [9, 2], [7, 2], [5, 2], [4, 2], [2, 4], [5, 2], [2, 2], [5, 2], [2, 2], [5, 2], [5, 2], [7, 2], [5, 2], [4, 2], [2, 2], [0, 4]] }
];
const MUSIC = {
  timer: null, el: null, file: null, song: 0, i: 0, wait: 0,
  start(song) {
    if (!GL.set.music) return; AU.init(); if (song != null && song !== this.song) { this.song = song % SONGS.length; this.i = 0; }
    if (this.file === null) { const a = new Audio('audio/musica.mp3'); a.loop = true; a.volume = .22; a.addEventListener('canplaythrough', () => { if (this.file === null) { this.file = true; this.el = a; this.stopSynth(); if (GL.set.music) a.play().catch(() => {}); } }, { once: true }); a.addEventListener('error', () => { this.file = false; }); a.load(); }
    if (this.file && this.el) { this.el.play().catch(() => {}); return; }
    if (this.timer) return;
    this.timer = setInterval(() => {
      if (!GL.set.music || document.hidden || !AU.ctx) return;
      if (this.wait > 0) { this.wait--; return; }
      const s = SONGS[this.song].m; if (this.i >= s.length) { this.i = 0; this.wait = 6; return; }
      const [n, len] = s[this.i++]; this.wait = len - 1;
      if (n !== -1) { const f = 261.63 * Math.pow(2, n / 12); AU.tone(f, .2 * len * .9, 'triangle', .05); if (this.i % 2) AU.tone(f / 2, .18, 'sine', .035); }
    }, 210);
  },
  stopSynth() { clearInterval(this.timer); this.timer = null; },
  stop() { this.stopSynth(); if (this.el) this.el.pause(); }
};

/* =====================================================================
   VOZ: lectura en voz alta + frases grabadas por papá/mamá
===================================================================== */
const REC_PHRASES = [
  { id: 'muybien', es: '¡Muy bien!' }, { id: 'excelente', es: '¡Excelente!' }, { id: 'bravo', es: '¡Bravo, lo lograste!' },
  { id: 'hola', es: '¡Hola! ¡Vamos a jugar!' }, { id: 'sticker', es: '¡Ganaste un sticker!' }, { id: 'tequiero', es: '¡Te quiero mucho!' }, { id: 'descanso', es: '¡Hora de descansar!' }
];
const VDB = {
  db: null, cache: {},
  open() { if (this.db || !('indexedDB' in window)) return Promise.resolve(this.db); return new Promise(res => { try { const r = indexedDB.open('pipo-voces', 1); r.onupgradeneeded = () => r.result.createObjectStore('v'); r.onsuccess = () => { this.db = r.result; res(this.db); }; r.onerror = () => res(null); } catch (e) { res(null); } }); },
  async get(id) { if (id in this.cache) return this.cache[id]; const db = await this.open(); if (!db) return null; return new Promise(res => { const t = db.transaction('v').objectStore('v').get(id); t.onsuccess = () => { this.cache[id] = t.result || null; res(this.cache[id]); }; t.onerror = () => res(null); }); },
  async put(id, blob) { const db = await this.open(); if (!db) return; this.cache[id] = blob; return new Promise(res => { const t = db.transaction('v', 'readwrite'); t.objectStore('v').put(blob, id); t.oncomplete = res; t.onerror = res; }); },
  async del(id) { const db = await this.open(); if (!db) return; this.cache[id] = null; return new Promise(res => { const t = db.transaction('v', 'readwrite'); t.objectStore('v').delete(id); t.oncomplete = res; t.onerror = res; }); },
  async play(id) { const b = await this.get(id); if (!b) return false; try { if ('speechSynthesis' in window) speechSynthesis.cancel(); const a = new Audio(URL.createObjectURL(b)); a.volume = 1; await a.play(); return true; } catch (e) { return false; } }
};
const VO = {
  v: null, last: '',
  pickVoice() { if (!('speechSynthesis' in window)) return; const vs = speechSynthesis.getVoices(), en = EN(); const want = en ? /^en/i : /^es/i, pref = en ? /en[-_](US|GB)/i : /es[-_](MX|US|419|PE|CO|AR|CL)/i; this.v = vs.find(v => pref.test(v.lang) && /female|mujer|paulina|monica|sabina|helena|samantha|google/i.test(v.name)) || vs.find(v => pref.test(v.lang)) || vs.find(v => want.test(v.lang)) || null; },
  say(t, keep = true) {
    if (keep) this.last = t;
    if (!GL.set.voice || !('speechSynthesis' in window) || !t) return;
    try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t.replace(/[^\p{L}\p{N}\s¡!¿?,.:'-]/gu, ' ')); this.pickVoice(); if (this.v) { u.voice = this.v; u.lang = this.v.lang; } else u.lang = EN() ? 'en-US' : 'es-MX'; u.rate = EN() ? .88 : .92; u.pitch = 1.3; speechSynthesis.speak(u); } catch (e) {}
  }
};
if ('speechSynthesis' in window) { speechSynthesis.onvoiceschanged = () => VO.pickVoice(); VO.pickVoice(); }

/* =====================================================================
   EFECTOS VISUALES
===================================================================== */
const LITE = () => GL.set.lite === true || (GL.set.lite === null && ((navigator.deviceMemory && navigator.deviceMemory <= 2) || matchMedia('(prefers-reduced-motion: reduce)').matches));
const FX = { c: null, x: null, parts: [], raf: 0 };
function fxInit() { FX.c = $('#fx'); FX.x = FX.c.getContext('2d'); const rs = () => { const d = Math.min(2, devicePixelRatio || 1); FX.c.width = innerWidth * d; FX.c.height = innerHeight * d; FX.x.setTransform(d, 0, 0, d, 0, 0); }; rs(); addEventListener('resize', rs); }
const FXCOLS = ['#ff4d4d', '#ffd23f', '#4cd964', '#3d8bff', '#ff7eb6', '#a66bff', '#ff9a3c'];
function confetti(n = 140) {
  if (LITE()) n = Math.floor(n / 3);
  for (let i = 0; i < n; i++) FX.parts.push({ x: innerWidth / 2 + (Math.random() - .5) * innerWidth * .3, y: innerHeight * .45, vx: (Math.random() - .5) * 16, vy: -Math.random() * 16 - 6, r: 5 + Math.random() * 6, c: FXCOLS[i % 7], a: Math.random() * 6, va: (Math.random() - .5) * .4, life: 1, sh: i % 3, g: .45 });
  fxRun();
}
function firework(x, y) {
  const col = FXCOLS[Math.floor(Math.random() * 7)], n = LITE() ? 18 : 42;
  for (let i = 0; i < n; i++) { const a = i / n * 6.283, sp = 3 + Math.random() * 4; FX.parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: 3, c: col, a: 0, va: 0, life: 1, sh: 1, g: .06, trail: 1 }); }
  AU.sfx('firework'); fxRun();
}
function fxRun() { if (!FX.raf) FX.raf = requestAnimationFrame(fxLoop); }
function fxLoop() {
  const x = FX.x; x.clearRect(0, 0, innerWidth, innerHeight);
  FX.parts.forEach(p => {
    p.vy += p.g; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.a += p.va; p.life -= p.trail ? .016 : .007;
    x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.globalAlpha = Math.max(0, p.life); x.fillStyle = p.c;
    if (p.sh === 0) x.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); else if (p.sh === 1) { x.beginPath(); x.arc(0, 0, p.r * .7, 0, 7); x.fill(); } else { x.beginPath(); for (let k = 0; k < 5; k++) { const a = k * 1.2566 - 1.57; x.lineTo(Math.cos(a) * p.r, Math.sin(a) * p.r); x.lineTo(Math.cos(a + .63) * p.r * .45, Math.sin(a + .63) * p.r * .45); } x.fill(); }
    x.restore();
  });
  FX.parts = FX.parts.filter(p => p.life > 0 && p.y < innerHeight + 40);
  FX.raf = FX.parts.length ? requestAnimationFrame(fxLoop) : 0; if (!FX.raf) x.clearRect(0, 0, innerWidth, innerHeight);
}
function sparkle(x, y, n = 8, chars = ['✨', '⭐', '💫']) {
  if (LITE()) n = Math.min(n, 4);
  for (let i = 0; i < n; i++) { const s = document.createElement('div'); s.className = 'sparkle emo'; s.textContent = chars[i % chars.length]; const a = Math.random() * 6.28, d = 40 + Math.random() * 60; s.style.left = x - 11 + 'px'; s.style.top = y - 11 + 'px'; s.style.setProperty('--dx', Math.cos(a) * d + 'px'); s.style.setProperty('--dy', Math.sin(a) * d + 'px'); document.body.appendChild(s); setTimeout(() => s.remove(), 850); }
}
function ripple(x, y) { if (LITE()) return; const r = document.createElement('div'); r.className = 'ripple'; r.style.left = x + 'px'; r.style.top = y + 'px'; document.body.appendChild(r); setTimeout(() => r.remove(), 600); }
function flyStars(from, to, n = 5) {
  const [x0, y0] = from, rt = to.getBoundingClientRect(), x1 = rt.left + rt.width / 2, y1 = rt.top + rt.height / 2;
  for (let i = 0; i < n; i++) { const s = document.createElement('div'); s.className = 'emo flystar'; s.textContent = '⭐'; s.style.left = x0 + (Math.random() - .5) * 120 + 'px'; s.style.top = y0 + (Math.random() - .5) * 60 + 'px'; document.body.appendChild(s); setTimeout(() => { s.style.left = x1 - 14 + 'px'; s.style.top = y1 - 14 + 'px'; s.style.transform = 'scale(.6)'; }, 60 + i * 90); setTimeout(() => { s.remove(); AU.sfx('coin'); bump(to); }, 760 + i * 90); }
}
const centerOf = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
function sparkleEl(el, n) { const [x, y] = centerOf(el); sparkle(x, y, n); }
function bump(el, cls = 'boing') { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }

/* =====================================================================
   ARRASTRAR Y SOLTAR (táctil y mouse)
===================================================================== */
function draggable(el, { targets, onDrop, onStart, onMove }) {
  el.style.touchAction = 'none'; el._dd = { targets };
  el.addEventListener('pointerdown', e => {
    if (G.finished || el._locked) return; e.preventDefault(); AU.init();
    const sx = e.clientX, sy = e.clientY, base = el._base || ''; el.classList.remove('back'); el.classList.add('dragging'); try { el.setPointerCapture(e.pointerId); } catch (er) {}
    onStart && onStart(el); AU.sfx('tap'); markAct();
    const move = ev => { el.style.transform = `${base} translate(${ev.clientX - sx}px, ${ev.clientY - sy}px) scale(1.12)`; onMove && onMove(el, ev); };
    const up = ev => {
      el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up);
      el.classList.remove('dragging');
      const list = typeof targets === 'function' ? targets() : targets;
      const hit = list.find(t => { const r = t.getBoundingClientRect(), pad = 22; return ev.clientX > r.left - pad && ev.clientX < r.right + pad && ev.clientY > r.top - pad && ev.clientY < r.bottom + pad; });
      const ok = hit ? onDrop(hit, el, ev) : false;
      if (!ok) { el.classList.add('back'); el.style.transform = base; if (hit) { AU.sfx('no'); bump(el, 'shake'); } }
    };
    el.addEventListener('pointermove', move); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  });
}
/* ---------- manito de ayuda ---------- */
let lastAct = Date.now();
function markAct() { lastAct = Date.now(); const h = $('#hand'); if (h) h.classList.remove('on'); }
function showHand(el) { if (!el || !el.getBoundingClientRect) return; const r = el.getBoundingClientRect(); if (!r.width) return; const h = $('#hand'); h.style.left = r.left + r.width / 2 + 'px'; h.style.top = r.top + r.height / 2 + 'px'; h.classList.add('on'); }
