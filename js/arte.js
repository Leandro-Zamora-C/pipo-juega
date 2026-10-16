/* =====================================================================
   PIPO JUEGA · ARTE ORIGINAL (todo dibujado en SVG por código)
   - Pipo, el pollito guía, con emociones y ropa
   - 21 animalitos con 6 emociones
   - Fondos ilustrados por tema
===================================================================== */
const shade = (hex, f) => { const n = parseInt(hex.slice(1), 16); const ch = s => Math.max(0, Math.min(255, Math.round(((n >> s) & 255) * f))); return '#' + [16, 8, 0].map(s => ch(s).toString(16).padStart(2, '0')).join(''); };
const INK = '#2b2140';

/* ---------- ojos y bocas según la emoción ---------- */
function eyesFor(mood, lx, rx, y, s = 1) {
  const e = (x) => {
    if (mood === 'joy') return `<path d="M${x - 6 * s} ${y + 2} q${6 * s} ${-8 * s} ${12 * s} 0" stroke="${INK}" stroke-width="${3.2 * s}" fill="none" stroke-linecap="round"/>`;
    if (mood === 'sleepy') return `<path d="M${x - 6 * s} ${y} q${6 * s} ${5 * s} ${12 * s} 0" stroke="${INK}" stroke-width="${3 * s}" fill="none" stroke-linecap="round"/>`;
    if (mood === 'wow') return `<circle cx="${x}" cy="${y}" r="${6.5 * s}" fill="#fff" stroke="${INK}" stroke-width="${1.6 * s}"/><circle cx="${x}" cy="${y}" r="${3.6 * s}" fill="${INK}"/><circle cx="${x + 1.4 * s}" cy="${y - 1.6 * s}" r="${1.3 * s}" fill="#fff"/>`;
    const ry = mood === 'angry' ? 4.6 : 6.4;
    return `<g class="blink"><ellipse cx="${x}" cy="${y}" rx="${4.8 * s}" ry="${ry * s}" fill="${INK}"/><circle cx="${x + 1.6 * s}" cy="${y - 2.4 * s}" r="${1.8 * s}" fill="#fff"/></g>`;
  };
  let extra = '';
  if (mood === 'sad') extra = `<path d="M${lx - 7 * s} ${y - 9 * s}l${12 * s} ${-4 * s}M${rx + 7 * s} ${y - 9 * s}l${-12 * s} ${-4 * s}" stroke="${INK}" stroke-width="${2.6 * s}" stroke-linecap="round"/><path d="M${lx - 3 * s} ${y + 8 * s}q${-3 * s} ${6 * s} 0 ${8 * s}q${3 * s} ${-2 * s} 0 ${-8 * s}z" fill="#7fd0ff"/>`;
  if (mood === 'angry') extra = `<path d="M${lx - 7 * s} ${y - 12 * s}l${12 * s} ${5 * s}M${rx + 7 * s} ${y - 12 * s}l${-12 * s} ${5 * s}" stroke="${INK}" stroke-width="${3 * s}" stroke-linecap="round"/>`;
  if (mood === 'sleepy') extra = `<text x="${rx + 10 * s}" y="${y - 10 * s}" font-size="${12 * s}" font-weight="800" fill="#7b6bd6" font-family="Baloo 2,sans-serif">z</text><text x="${rx + 18 * s}" y="${y - 20 * s}" font-size="${9 * s}" font-weight="800" fill="#7b6bd6" font-family="Baloo 2,sans-serif">z</text>`;
  return e(lx) + e(rx) + extra;
}
function mouthFor(mood, x, y, s = 1) {
  if (mood === 'joy') return `<path d="M${x - 7 * s} ${y - 1} q${7 * s} ${11 * s} ${14 * s} 0z" fill="#ff5d7a" stroke="${INK}" stroke-width="${1.8 * s}" stroke-linejoin="round"/>`;
  if (mood === 'sad') return `<path d="M${x - 6 * s} ${y + 3 * s} q${6 * s} ${-6 * s} ${12 * s} 0" stroke="${INK}" stroke-width="${2.4 * s}" fill="none" stroke-linecap="round"/>`;
  if (mood === 'angry') return `<path d="M${x - 6 * s} ${y + 2 * s} q${6 * s} ${-3 * s} ${12 * s} 0" stroke="${INK}" stroke-width="${2.6 * s}" fill="none" stroke-linecap="round"/>`;
  if (mood === 'wow') return `<ellipse cx="${x}" cy="${y + 2 * s}" rx="${3.6 * s}" ry="${4.6 * s}" fill="${INK}"/>`;
  if (mood === 'sleepy') return `<circle cx="${x}" cy="${y + 2 * s}" r="${2.2 * s}" fill="${INK}"/>`;
  return `<path d="M${x - 6 * s} ${y} q${3 * s} ${4 * s} ${6 * s} 0 q${3 * s} ${4 * s} ${6 * s} 0" stroke="${INK}" stroke-width="${2.2 * s}" fill="none" stroke-linecap="round"/>`;
}

/* ---------- 21 animalitos originales ---------- */
const AN = {
  perro: { c: '#e9b46e', m: '#fff4e2', ear: 'floppy', ec: '#9a5b2c', nose: '#3b2a20', patch: '#c98a4a' },
  gato: { c: '#ffb35c', m: '#fff1df', ear: 'pointy', ec: '#ffb35c', inner: '#ff9db0', nose: '#ff6b8a', whisk: 1, stripes: '#e8892c' },
  conejo: { c: '#f4f3fa', m: '#ffffff', ear: 'long', ec: '#f4f3fa', inner: '#ffb3c7', nose: '#ff7a9a', teeth: 1, whisk: 1 },
  oso: { c: '#a8703f', m: '#e8c49a', ear: 'round', ec: '#a8703f', inner: '#e8c49a', nose: '#3b2416' },
  panda: { c: '#ffffff', m: '#ffffff', ear: 'round', ec: '#2e2e38', inner: '#2e2e38', nose: '#2e2e38', patches: '#2e2e38' },
  mono: { c: '#8b5a3c', m: '#f3d2b0', ear: 'side', ec: '#8b5a3c', inner: '#f3d2b0', nose: '#5a3622', monkey: 1 },
  cerdito: { c: '#ffb9cb', m: '#ffb9cb', ear: 'pointy', ec: '#ff9ab4', inner: '#ff86a6', snout: '#ff8fae' },
  vaca: { c: '#ffffff', m: '#ffc2cf', ear: 'side', ec: '#f2f2f2', inner: '#ffb3c1', horns: '#f3dca0', cowspots: '#3b3b44', bigmuzzle: 1 },
  leon: { c: '#ffc04d', m: '#fff0c8', ear: 'round', ec: '#ffc04d', inner: '#e89a2c', nose: '#8a4b1c', mane: '#d9781f' },
  rana: { c: '#7bd66a', m: '#c9f3b6', ear: 'frog', frog: 1 },
  pollito: { c: '#ffd93d', m: '#ffd93d', beak: '#ff9f1c', tuft: 1 },
  pato: { c: '#ffffff', m: '#ffffff', bill: '#ff9f1c', tuft: 1 },
  oveja: { c: '#f7efe3', m: '#f7efe3', wool: '#ffffff', ear: 'side', ec: '#d9c6b4', inner: '#f2a7b8', nose: '#8a6a5a' },
  raton: { c: '#b9bac8', m: '#d9dae5', ear: 'big', ec: '#b9bac8', inner: '#ffb3c7', nose: '#ff7a9a', whisk: 1 },
  zorro: { c: '#ff8a3d', m: '#ffffff', ear: 'pointy', ec: '#ff8a3d', inner: '#3b2a20', nose: '#2b2020', foxcheeks: 1 },
  koala: { c: '#a9adbb', m: '#c9ccd6', ear: 'fluffy', ec: '#a9adbb', inner: '#eceef4', bignose: '#3b3b44' },
  tigre: { c: '#ff9f40', m: '#ffffff', ear: 'round', ec: '#ff9f40', inner: '#fff', nose: '#ff7a8a', tstripes: '#2e2e38' },
  elefante: { c: '#a3b9db', m: '#a3b9db', ear: 'elephant', ec: '#a3b9db', inner: '#ffc2d4', trunk: 1 },
  jirafa: { c: '#ffd166', m: '#f6e2b0', ear: 'side', ec: '#ffd166', inner: '#f6b26b', ossicones: '#c8812e', gspots: '#c8812e', nose: '#7a4a1c' },
  pinguino: { c: '#2f3648', m: '#ffffff', beak: '#ff9f1c', mask: 1 },
  buho: { c: '#9b7653', m: '#e9d6b9', owl: 1, beak: '#ffb02e' }
};
function animalSVG(k, mood = 'happy') {
  const a = AN[k]; if (!a) return '';
  const d = shade(a.c, .74), st = `stroke="${d}" stroke-width="2.4"`;
  let back = '', over = '', face = '';
  const ex = 37, ey = 52, er = 63;
  // orejas y elementos detrás de la cabeza
  if (a.mane) for (let i = 0; i < 14; i++) { const t = i / 14 * 6.283; back += `<circle cx="${50 + Math.cos(t) * 38}" cy="${56 + Math.sin(t) * 35}" r="13" fill="${a.mane}" stroke="${shade(a.mane, .8)}" stroke-width="2"/>`; }
  if (a.wool) for (let i = 0; i < 12; i++) { const t = i / 12 * 6.283; back += `<circle cx="${50 + Math.cos(t) * 33}" cy="${52 + Math.sin(t) * 30}" r="13" fill="#fff" stroke="#e3dccf" stroke-width="2"/>`; }
  if (a.ear === 'pointy') back += `<path d="M18 44L24 8L46 28Z" fill="${a.ec}" ${st}/><path d="M82 44L76 8L54 28Z" fill="${a.ec}" ${st}/><path d="M24 36L27 18L38 28Z" fill="${a.inner}"/><path d="M76 36L73 18L62 28Z" fill="${a.inner}"/>`;
  if (a.ear === 'long') back += `<ellipse cx="36" cy="18" rx="9" ry="24" fill="${a.ec}" ${st} transform="rotate(-10 36 18)"/><ellipse cx="64" cy="18" rx="9" ry="24" fill="${a.ec}" ${st} transform="rotate(10 64 18)"/><ellipse cx="36" cy="20" rx="4.5" ry="17" fill="${a.inner}" transform="rotate(-10 36 20)"/><ellipse cx="64" cy="20" rx="4.5" ry="17" fill="${a.inner}" transform="rotate(10 64 20)"/>`;
  if (a.ear === 'round') back += `<circle cx="22" cy="28" r="12" fill="${a.ec}" ${a.ec === '#2e2e38' ? '' : st}/><circle cx="78" cy="28" r="12" fill="${a.ec}" ${a.ec === '#2e2e38' ? '' : st}/><circle cx="22" cy="28" r="6.5" fill="${a.inner}"/><circle cx="78" cy="28" r="6.5" fill="${a.inner}"/>`;
  if (a.ear === 'big') back += `<circle cx="20" cy="28" r="17" fill="${a.ec}" ${st}/><circle cx="80" cy="28" r="17" fill="${a.ec}" ${st}/><circle cx="20" cy="28" r="10" fill="${a.inner}"/><circle cx="80" cy="28" r="10" fill="${a.inner}"/>`;
  if (a.ear === 'fluffy') back += `<circle cx="16" cy="36" r="17" fill="${a.ec}" ${st}/><circle cx="84" cy="36" r="17" fill="${a.ec}" ${st}/><circle cx="16" cy="36" r="10" fill="${a.inner}"/><circle cx="84" cy="36" r="10" fill="${a.inner}"/>`;
  if (a.ear === 'side') back += `<ellipse cx="13" cy="46" rx="12" ry="7" fill="${a.ec}" ${st} transform="rotate(-20 13 46)"/><ellipse cx="87" cy="46" rx="12" ry="7" fill="${a.ec}" ${st} transform="rotate(20 87 46)"/><ellipse cx="14" cy="46" rx="7" ry="3.6" fill="${a.inner}" transform="rotate(-20 14 46)"/><ellipse cx="86" cy="46" rx="7" ry="3.6" fill="${a.inner}" transform="rotate(20 86 46)"/>`;
  if (a.ear === 'elephant') back += `<ellipse cx="13" cy="54" rx="17" ry="25" fill="${a.ec}" ${st}/><ellipse cx="87" cy="54" rx="17" ry="25" fill="${a.ec}" ${st}/><ellipse cx="15" cy="54" rx="10" ry="16" fill="${a.inner}"/><ellipse cx="85" cy="54" rx="10" ry="16" fill="${a.inner}"/>`;
  if (a.horns) back += `<path d="M30 30q-8-14 2-20q-2 10 6 16z" fill="${a.horns}" stroke="#c9a85a" stroke-width="2"/><path d="M70 30q8-14-2-20q2 10-6 16z" fill="${a.horns}" stroke="#c9a85a" stroke-width="2"/>`;
  if (a.ossicones) back += `<path d="M38 30V12M62 30V12" stroke="${a.ossicones}" stroke-width="5" stroke-linecap="round"/><circle cx="38" cy="11" r="5" fill="${a.ossicones}"/><circle cx="62" cy="11" r="5" fill="${a.ossicones}"/>`;
  if (a.owl) back += `<path d="M20 34L22 14L38 26Z" fill="${a.c}" ${st}/><path d="M80 34L78 14L62 26Z" fill="${a.c}" ${st}/>`;
  if (a.tuft) back += `<path d="M46 26q-6-16 4-22q-1 10 4 16q6-10 14-8q-9 5-9 16z" fill="${a.c === '#ffffff' ? '#f4f4f4' : '#ffc21f'}" stroke="${a.c === '#ffffff' ? '#ddd' : '#e39d00'}" stroke-width="2"/>`;
  if (a.ear === 'frog') back += `<circle cx="32" cy="32" r="14" fill="${a.c}" ${st}/><circle cx="68" cy="32" r="14" fill="${a.c}" ${st}/>`;
  // cabeza
  const head = `<ellipse cx="50" cy="56" rx="37" ry="33" fill="${a.c}" ${st}/>`;
  // manchas y marcas sobre la cabeza
  if (a.patch) over += `<ellipse cx="66" cy="46" rx="11" ry="9" fill="${a.patch}" opacity=".9"/>`;
  if (a.stripes) over += `<path d="M44 26l2 10M50 24v11M56 26l-2 10" stroke="${a.stripes}" stroke-width="3" stroke-linecap="round"/>`;
  if (a.tstripes) over += `<path d="M44 25l2 9M50 23v10M56 25l-2 9M15 52l10 2M15 60l9 0M85 52l-10 2M85 60l-9 0" stroke="${a.tstripes}" stroke-width="3" stroke-linecap="round"/>`;
  if (a.cowspots) over += `<path d="M22 40q8-10 16-2q-2 10-12 10q-6-2-4-8z" fill="${a.cowspots}"/><ellipse cx="72" cy="36" rx="8" ry="6" fill="${a.cowspots}"/>`;
  if (a.gspots) over += `<circle cx="28" cy="44" r="5" fill="${a.gspots}" opacity=".8"/><circle cx="74" cy="40" r="6" fill="${a.gspots}" opacity=".8"/><circle cx="64" cy="30" r="3.5" fill="${a.gspots}" opacity=".8"/>`;
  if (a.patches) over += `<ellipse cx="${ex}" cy="${ey + 1}" rx="10" ry="12" fill="${a.patches}" transform="rotate(25 ${ex} ${ey})"/><ellipse cx="${er}" cy="${ey + 1}" rx="10" ry="12" fill="${a.patches}" transform="rotate(-25 ${er} ${ey})"/>`;
  if (a.mask) over += `<path d="M50 34C34 26 20 40 22 58c2 18 14 26 28 26s26-8 28-26C80 40 66 26 50 34z" fill="#fff"/>`;
  if (a.monkey) over += `<ellipse cx="40" cy="52" rx="13" ry="14" fill="${a.m}"/><ellipse cx="60" cy="52" rx="13" ry="14" fill="${a.m}"/><ellipse cx="50" cy="68" rx="20" ry="14" fill="${a.m}"/>`;
  if (a.foxcheeks) over += `<path d="M14 58Q30 56 50 76Q30 84 18 72Z" fill="#fff"/><path d="M86 58Q70 56 50 76Q70 84 82 72Z" fill="#fff"/>`;
  if (a.owl) over += `<ellipse cx="50" cy="70" rx="20" ry="16" fill="${a.m}"/><circle cx="${ex}" cy="${ey}" r="13" fill="#fff6dc" stroke="${shade(a.c, .8)}" stroke-width="2"/><circle cx="${er}" cy="${ey}" r="13" fill="#fff6dc" stroke="${shade(a.c, .8)}" stroke-width="2"/>`;
  // hocico
  if (!a.monkey && !a.mask && !a.owl && !a.beak && !a.bill && !a.frog && !a.trunk && !a.snout) face += `<ellipse cx="50" cy="${a.bigmuzzle ? 70 : 67}" rx="${a.bigmuzzle ? 22 : 15}" ry="${a.bigmuzzle ? 13 : 10.5}" fill="${a.m}"/>`;
  // ojos
  const eyY = a.frog ? 32 : ey;
  face += eyesFor(mood, ex - (a.frog ? 5 : 0), er + (a.frog ? 5 : 0), eyY, a.owl ? 1.15 : 1);
  // nariz / pico / trompa
  if (a.nose && !a.bigmuzzle) face += `<path d="M45 61q5-4 10 0q-5 6-10 0z" fill="${a.nose}"/>`;
  if (a.bigmuzzle) face += `<ellipse cx="43" cy="69" rx="2.6" ry="3.4" fill="#d47a8f"/><ellipse cx="57" cy="69" rx="2.6" ry="3.4" fill="#d47a8f"/>`;
  if (a.bignose) face += `<ellipse cx="50" cy="62" rx="8" ry="10" fill="${a.bignose}"/><ellipse cx="47" cy="58" rx="2" ry="3" fill="#fff" opacity=".5"/>`;
  if (a.snout) face += `<ellipse cx="50" cy="65" rx="13" ry="9.5" fill="${a.snout}" stroke="${shade(a.snout, .8)}" stroke-width="2"/><ellipse cx="45.5" cy="65" rx="2.6" ry="3.4" fill="#c2577a"/><ellipse cx="54.5" cy="65" rx="2.6" ry="3.4" fill="#c2577a"/>`;
  if (a.trunk) face += `<path d="M50 60q-2 18 4 26q6 6 10 0" stroke="${a.c}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M50 60q-2 18 4 26q6 6 10 0" stroke="${d}" stroke-width="2" fill="none" stroke-linecap="round" opacity=".5"/>`;
  const beakOpen = mood === 'joy' || mood === 'wow';
  if (a.beak) face += beakOpen ? `<path d="M42 60h16l-8 7z" fill="${a.beak}" stroke="${shade(a.beak, .8)}" stroke-width="1.6"/><path d="M43 64h14l-7 7z" fill="${shade(a.beak, .85)}"/>` : `<path d="M42 60q8-6 16 0q-8 9-16 0z" fill="${a.beak}" stroke="${shade(a.beak, .8)}" stroke-width="1.6"/>`;
  if (a.bill) face += `<ellipse cx="50" cy="66" rx="14" ry="${beakOpen ? 9 : 6.5}" fill="${a.bill}" stroke="${shade(a.bill, .8)}" stroke-width="2"/><path d="M38 66h24" stroke="${shade(a.bill, .7)}" stroke-width="1.6"/>`;
  // boca
  if (!a.beak && !a.bill && !a.trunk) face += mouthFor(mood, 50, a.frog ? 64 : a.bigmuzzle ? 76 : a.snout ? 76 : 70);
  if (a.teeth && mood !== 'sad' && mood !== 'angry') face += `<rect x="47" y="71" width="6" height="5" rx="1" fill="#fff" stroke="#ddd"/>`;
  // detalles
  if (a.whisk) face += `<path d="M30 66h-14M30 70l-13 4M70 66h14M70 70l13 4" stroke="${INK}" stroke-width="1.4" opacity=".55" stroke-linecap="round"/>`;
  if (mood !== 'angry' && !a.owl) face += `<circle cx="26" cy="66" r="5.5" fill="#ff8fab" opacity=".55"/><circle cx="74" cy="66" r="5.5" fill="#ff8fab" opacity=".55"/>`;
  return `<svg viewBox="-4 -4 108 108" width="100%" height="100%" class="animal-svg" aria-hidden="true">${back}${head}${over}${face}</svg>`;
}

/* ---------- Pipo: el guía, con emociones y ropa ---------- */
const ACC = {
  head: {
    fiesta: { n: 'gorro de fiesta', svg: c => `<path d="M100 2L76 50h48z" fill="${c}" stroke="${shade(c, .7)}" stroke-width="3"/><circle cx="100" cy="4" r="7" fill="#ffd23f"/><path d="M84 36h32M90 22h20" stroke="#fff" stroke-width="4" opacity=".8"/>` },
    gorra: { n: 'gorra', svg: c => `<path d="M48 54q4-34 52-36q48 2 52 36z" fill="${c}" stroke="${shade(c, .7)}" stroke-width="3"/><path d="M140 52q30 0 42 10q-20 6-46-2z" fill="${shade(c, .85)}" stroke="${shade(c, .7)}" stroke-width="3"/><circle cx="100" cy="20" r="5" fill="#fff"/>` },
    corona: { n: 'corona', svg: () => `<path d="M60 52L56 14L80 32L100 6L120 32L144 14L140 52z" fill="#ffd23f" stroke="#d19b00" stroke-width="3"/><circle cx="80" cy="44" r="5" fill="#ff4d4d"/><circle cx="100" cy="42" r="6" fill="#3d8bff"/><circle cx="120" cy="44" r="5" fill="#4cd964"/>` },
    sombrero: { n: 'sombrero de mago', svg: () => `<path d="M100 -6L66 52h68z" fill="#5b3fc4" stroke="#3a2690" stroke-width="3"/><ellipse cx="100" cy="52" rx="50" ry="9" fill="#5b3fc4" stroke="#3a2690" stroke-width="3"/><text x="88" y="38" font-size="18" fill="#ffd23f">★</text>` },
    flor: { n: 'flor', svg: () => `${[0, 1, 2, 3, 4].map(i => `<circle cx="${130 + Math.cos(i * 1.257) * 11}" cy="${40 + Math.sin(i * 1.257) * 11}" r="9" fill="#ff7eb6" stroke="#d4407f" stroke-width="2"/>`).join('')}<circle cx="130" cy="40" r="7" fill="#ffd23f"/>` },
    lazo: { n: 'lazo', svg: c => `<path d="M100 40l-30-16v32zM100 40l30-16v32z" fill="${c}" stroke="${shade(c, .7)}" stroke-width="3" stroke-linejoin="round"/><circle cx="100" cy="40" r="8" fill="${shade(c, .85)}"/>` },
    chef: { n: 'gorro de chef', svg: () => `<rect x="70" y="30" width="60" height="22" fill="#fff" stroke="#ccc" stroke-width="3"/><circle cx="78" cy="22" r="16" fill="#fff" stroke="#ccc" stroke-width="3"/><circle cx="100" cy="14" r="18" fill="#fff" stroke="#ccc" stroke-width="3"/><circle cx="122" cy="22" r="16" fill="#fff" stroke="#ccc" stroke-width="3"/>` },
    vaquero: { n: 'sombrero vaquero', svg: () => `<ellipse cx="100" cy="50" rx="62" ry="12" fill="#b7793f" stroke="#7a4a1c" stroke-width="3"/><path d="M72 50q0-34 28-34t28 34z" fill="#c98a4b" stroke="#7a4a1c" stroke-width="3"/><path d="M72 42h56" stroke="#7a4a1c" stroke-width="5"/>` },
    lana: { n: 'gorro de lana', svg: c => `<path d="M52 56q0-44 48-44t48 44z" fill="${c}" stroke="${shade(c, .7)}" stroke-width="3"/><rect x="50" y="48" width="100" height="12" rx="6" fill="#fff"/><circle cx="100" cy="10" r="11" fill="#fff" stroke="#ddd" stroke-width="2"/>` },
    astronauta: { n: 'casco espacial', svg: () => `<path d="M30 110a70 70 0 1 1 140 0" fill="rgba(180,230,255,.35)" stroke="#9aa5b1" stroke-width="6"/><circle cx="62" cy="40" r="6" fill="#fff" opacity=".8"/>` }
  },
  eyes: {
    lentes: { n: 'lentes', svg: c => `<circle cx="76" cy="92" r="18" fill="rgba(255,255,255,.25)" stroke="${shade(c, .7)}" stroke-width="5"/><circle cx="124" cy="92" r="18" fill="rgba(255,255,255,.25)" stroke="${shade(c, .7)}" stroke-width="5"/><path d="M94 90h12" stroke="${shade(c, .7)}" stroke-width="5"/>` },
    sol: { n: 'lentes de sol', svg: () => `<path d="M56 82h40q0 26-20 26t-20-26zM104 82h40q0 26-20 26t-20-26z" fill="#2b2140"/><path d="M96 86h8" stroke="#2b2140" stroke-width="5"/><path d="M62 88l10 0" stroke="#fff" stroke-width="3" opacity=".6"/>` },
    estrella: { n: 'lentes de estrella', svg: () => ['76', '124'].map(x => `<path d="M${x} 72l6 13h14l-11 9 4 14-13-8-13 8 4-14-11-9h14z" fill="#ffd23f" stroke="#d19b00" stroke-width="3" opacity=".95"/>`).join('') + `<path d="M93 90h14" stroke="#d19b00" stroke-width="4"/>` },
    corazon: { n: 'lentes de corazón', svg: () => ['76', '124'].map(x => `<path d="M${x} 108c-14-10-20-16-20-24 0-6 4-10 10-10 5 0 8 3 10 6 2-3 5-6 10-6 6 0 10 4 10 10 0 8-6 14-20 24z" fill="#ff7eb6" stroke="#d4407f" stroke-width="3" opacity=".9"/>`).join('') + `<path d="M93 90h14" stroke="#d4407f" stroke-width="4"/>` }
  },
  neck: {
    corbatin: { n: 'corbatín', svg: c => `<path d="M100 160l-26-14v28zM100 160l26-14v28z" fill="${c}" stroke="${shade(c, .7)}" stroke-width="3" stroke-linejoin="round"/><circle cx="100" cy="160" r="7" fill="${shade(c, .8)}"/>` },
    bufanda: { n: 'bufanda', svg: c => `<path d="M46 146q54 22 108 0v16q-54 22-108 0z" fill="${c}" stroke="${shade(c, .7)}" stroke-width="3"/><path d="M128 158l8 36h-18l-4-34z" fill="${c}" stroke="${shade(c, .7)}" stroke-width="3"/><path d="M60 152v12M80 157v13M100 159v13M120 157v13" stroke="#fff" stroke-width="4" opacity=".6"/>` },
    collar: { n: 'collar', svg: () => Array.from({ length: 9 }, (_, i) => `<circle cx="${60 + i * 10}" cy="${150 + Math.sin(i / 8 * 3.14) * 12}" r="6" fill="${['#ff4d4d', '#ffd23f', '#4cd964', '#3d8bff', '#a66bff'][i % 5]}" stroke="#fff" stroke-width="2"/>`).join('') },
    medalla: { n: 'medalla', svg: () => `<path d="M84 140l16 24 16-24" stroke="#3d8bff" stroke-width="8" fill="none"/><circle cx="100" cy="172" r="14" fill="#ffd23f" stroke="#d19b00" stroke-width="3"/><text x="94" y="178" font-size="16" font-weight="800" fill="#d19b00">1</text>` },
    capa: { n: 'capa de héroe', svg: c => `<path d="M58 140q42 14 84 0l30 60q-72 18-144 0z" fill="${c}" stroke="${shade(c, .7)}" stroke-width="3" opacity=".95"/>` }
  }
};
const ACC_BASE = ['fiesta', 'gorra', 'lentes', 'corbatin', 'bufanda'];
const ACC_ALL = Object.values(ACC).flatMap(g => Object.keys(g));
const accSlot = id => Object.keys(ACC).find(s => ACC[s][id]);
function accSVG(id, color) { const s = accSlot(id); return s ? ACC[s][id].svg(color || '#ff6fa8') : ''; }
function pipoSVG(mood = 'happy', outfit, color) {
  outfit = outfit || {}; color = color || '#ff6fa8';
  const back = outfit.neck === 'capa' ? accSVG('capa', color) : '';
  return `<svg viewBox="0 -10 200 220" width="100%" class="pipo-svg" aria-hidden="true">
    ${back}
    <ellipse cx="100" cy="200" rx="56" ry="8" fill="rgba(0,0,0,.12)"/>
    <path d="M78 186l-8 14h20zM122 186l-8 14h20z" fill="#ff9f1c"/>
    <g class="wing-l"><path d="M32 120q-22-6-26 14q16 6 34-2z" fill="#ffc21f" stroke="#e39d00" stroke-width="3"/></g>
    <g class="wing-r"><path d="M168 120q22-6 26 14q-16 6-34-2z" fill="#ffc21f" stroke="#e39d00" stroke-width="3"/></g>
    <ellipse cx="100" cy="112" rx="72" ry="78" fill="#ffd93d" stroke="#e8a800" stroke-width="4"/>
    <ellipse cx="100" cy="140" rx="44" ry="40" fill="#fff1a8"/>
    <path d="M92 36q-6-22 8-30q-2 14 6 22q8-14 20-12q-12 8-12 22z" fill="#ffc21f" stroke="#e39d00" stroke-width="3"/>
    ${eyesFor(mood === 'happy' ? 'happy' : mood, 76, 124, 92, 2)}
    <circle cx="56" cy="116" r="11" fill="#ff9eb5" opacity=".8"/><circle cx="144" cy="116" r="11" fill="#ff9eb5" opacity=".8"/>
    ${mood === 'joy' || mood === 'wow' ? '<path d="M84 106h32l-16 22z" fill="#ff8a1f" stroke="#d96a00" stroke-width="3" stroke-linejoin="round"/><path d="M90 112h20l-10 10z" fill="#ff5d7a"/>' : '<path d="M86 106q14-8 28 0q-14 16-28 0z" fill="#ff8a1f" stroke="#d96a00" stroke-width="3"/>'}
    ${mood === 'sad' ? '' : ''}
    ${outfit.neck && outfit.neck !== 'capa' ? accSVG(outfit.neck, color) : ''}
    ${outfit.eyes ? accSVG(outfit.eyes, color) : ''}
    ${outfit.head ? accSVG(outfit.head, color) : ''}
  </svg>`;
}

/* ---------- fondos ilustrados ---------- */
const BG = {
  cielo: `<defs><linearGradient id="gS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fdcff"/><stop offset="1" stop-color="#e3f8ff"/></linearGradient></defs><rect width="1600" height="900" fill="url(#gS)"/><circle cx="1380" cy="140" r="80" fill="#fff3a8"/><circle cx="1380" cy="140" r="110" fill="#fff3a8" opacity=".35"/>
    <g fill="#fff" opacity=".95"><ellipse cx="260" cy="160" rx="110" ry="40"/><ellipse cx="320" cy="130" rx="70" ry="50"/><ellipse cx="900" cy="110" rx="90" ry="32"/><ellipse cx="950" cy="88" rx="56" ry="40"/></g>
    <path d="M0 720q200-120 420-30t420 0t420-40t340 20V900H0z" fill="#9fe08a"/><path d="M0 790q260-80 520 0t540-10t540 0V900H0z" fill="#7fd06a"/>
    <g>${[120, 330, 640, 1010, 1240, 1500].map((x, i) => `<g transform="translate(${x} ${800 + (i % 2) * 30})"><path d="M0 0v-30" stroke="#3f9a3a" stroke-width="5"/>${[0, 1, 2, 3, 4].map(k => `<circle cx="${Math.cos(k * 1.257) * 10}" cy="${-36 + Math.sin(k * 1.257) * 10}" r="8" fill="${['#ff7eb6', '#ffd23f', '#a66bff', '#ff9a3c', '#fff'][i % 5]}"/>`).join('')}<circle cy="-36" r="6" fill="#ffd23f"/></g>`).join('')}</g>`,
  granja: `<rect width="1600" height="900" fill="#bfeeff"/><circle cx="200" cy="140" r="70" fill="#fff3a8"/><path d="M0 640q400-80 800 0t800 0V900H0z" fill="#9be07f"/>
    <g transform="translate(1180 380)"><rect x="0" y="80" width="300" height="230" fill="#e05a47" stroke="#a83a2b" stroke-width="8"/><path d="M-20 90L150 -10L320 90z" fill="#b23c2c" stroke="#7d261b" stroke-width="8"/><rect x="100" y="170" width="100" height="140" fill="#fff6e8" stroke="#a83a2b" stroke-width="8"/><path d="M100 170l100 140M200 170l-100 140" stroke="#a83a2b" stroke-width="8"/><rect x="120" y="100" width="60" height="50" fill="#fff6e8" stroke="#a83a2b" stroke-width="6"/></g>
    <g stroke="#c98a4b" stroke-width="12">${Array.from({ length: 12 }, (_, i) => `<path d="M${40 + i * 90} 720v-90"/>`).join('')}<path d="M20 650h1040M20 690h1040"/></g>`,
  cocina: `<rect width="1600" height="900" fill="#fff4e6"/><g fill="#ffe2c6">${Array.from({ length: 64 }, (_, i) => (i % 2 === Math.floor(i / 16) % 2) ? `<rect x="${(i % 16) * 100}" y="${Math.floor(i / 16) * 100}" width="100" height="100"/>` : '').join('')}</g>
    <rect x="0" y="400" width="1600" height="30" fill="#c98a4b"/><g>${[120, 300, 1220, 1400].map((x, i) => `<rect x="${x}" y="300" width="80" height="100" rx="14" fill="${['#ffd23f', '#ff9a3c', '#5fd3ff', '#ff7eb6'][i]}" opacity=".85"/><rect x="${x + 10}" y="285" width="60" height="22" rx="6" fill="#c98a4b"/>`).join('')}</g>
    <rect x="0" y="700" width="1600" height="200" fill="#d9a066"/><rect x="0" y="690" width="1600" height="24" fill="#b97a3d"/>`,
  bano: `<rect width="1600" height="900" fill="#e6f7ff"/><g fill="none" stroke="#c4e7f7" stroke-width="4">${Array.from({ length: 17 }, (_, i) => `<path d="M${i * 100} 0v900"/>`).join('')}${Array.from({ length: 10 }, (_, i) => `<path d="M0 ${i * 100}h1600"/>`).join('')}</g>
    <path d="M60 0h20v640M60 40q60 0 60 60v540M80 40q120 0 120 60v520" fill="#ffc2dc" stroke="#ff9ec8" stroke-width="6" opacity=".9"/><rect x="40" y="20" width="420" height="20" rx="10" fill="#9aa5b1"/>
    <g fill="#fff" stroke="#bfe6ff" stroke-width="3" opacity=".8">${[[1300, 200, 30], [1380, 300, 18], [1460, 160, 24], [1240, 360, 14]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g><rect y="760" width="1600" height="140" fill="#bde9dd"/>`,
  mar: `<defs><linearGradient id="gM" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fd6ff"/><stop offset="1" stop-color="#1d7fc4"/></linearGradient></defs><rect width="1600" height="900" fill="url(#gM)"/>
    <g fill="#fff" opacity=".35">${Array.from({ length: 14 }, (_, i) => `<circle cx="${(i * 197) % 1600}" cy="${120 + (i * 131) % 600}" r="${6 + (i % 4) * 5}"/>`).join('')}</g>
    <path d="M0 800q200-40 400 0t400 0t400 0t400 0V900H0z" fill="#f3d79a"/>${[150, 420, 1100, 1380].map((x, i) => `<path d="M${x} 820q-30-80 0-160q30-80 0-160" stroke="${['#3fbf6a', '#2fa35a', '#4cd964', '#2fa35a'][i]}" stroke-width="22" fill="none" stroke-linecap="round"/>`).join('')}`,
  noche: `<rect width="1600" height="900" fill="#2e2a6b"/><circle cx="1320" cy="160" r="70" fill="#fff6c9"/><circle cx="1350" cy="140" r="64" fill="#2e2a6b"/>
    <g fill="#fff">${Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 389) % 1600}" cy="${(i * 211) % 600}" r="${1.5 + (i % 3)}" opacity="${.4 + (i % 5) / 8}"/>`).join('')}</g><path d="M0 760q400-60 800 0t800 0V900H0z" fill="#3d3a86"/>`,
  aula: `<rect width="1600" height="900" fill="#ffefc4"/><rect x="300" y="80" width="1000" height="420" rx="20" fill="#2f6b4f" stroke="#b97a3d" stroke-width="24"/><text x="380" y="200" font-size="80" fill="#fff" opacity=".7" font-family="Baloo 2,sans-serif">A B C   1 2 3</text>
    <rect x="1380" y="120" width="160" height="200" fill="#bfeaff" stroke="#fff" stroke-width="14"/><path d="M1460 120v200M1380 220h160" stroke="#fff" stroke-width="10"/><rect y="760" width="1600" height="140" fill="#d9a066"/>`,
  jardin: `<rect width="1600" height="900" fill="#d8f6ff"/><path d="M0 600h1600v300H0z" fill="#8fd96b"/><g stroke="#fff" stroke-width="14">${Array.from({ length: 18 }, (_, i) => `<path d="M${i * 92 + 20} 640v-120"/>`).join('')}<path d="M0 560h1600"/></g>
    ${[200, 500, 900, 1300].map((x, i) => `<circle cx="${x}" cy="${680 + (i % 2) * 40}" r="16" fill="${['#ff7eb6', '#ffd23f', '#a66bff', '#ff4d4d'][i]}"/>`).join('')}`,
  ciudad: `<rect width="1600" height="900" fill="#c9ecff"/>${[[0, 300, 220], [240, 220, 180], [440, 340, 200], [680, 260, 160], [860, 180, 220], [1100, 320, 180], [1300, 240, 300]].map(([x, y, w], i) => `<rect x="${x}" y="${y}" width="${w}" height="${700 - y}" fill="${['#a3b9db', '#ffc2a8', '#b8e0c8', '#d9c2ff', '#ffe08a', '#a8d8ff', '#ffb3c7'][i]}"/>${Array.from({ length: 6 }, (_, k) => `<rect x="${x + 24 + (k % 2) * (w / 2)}" y="${y + 30 + Math.floor(k / 2) * 70}" width="${w / 4}" height="40" fill="#fff" opacity=".7"/>`).join('')}`).join('')}
    <rect y="700" width="1600" height="200" fill="#5a5a6e"/><path d="M0 800h1600" stroke="#fff" stroke-width="10" stroke-dasharray="60 40"/>`,
  dulce: `<rect width="1600" height="900" fill="#ffe0ef"/>${Array.from({ length: 22 }, (_, i) => `<path transform="translate(${(i * 271) % 1600} ${(i * 173) % 900}) scale(${.6 + (i % 3) * .3})" d="M0 12C-12 4-18-2-18-8c0-5 4-9 9-9 4 0 7 3 9 6 2-3 5-6 9-6 5 0 9 4 9 9 0 6-6 12-18 20z" fill="#ffb3d6" opacity=".7"/>`).join('')}`,
  espacio: `<defs><radialGradient id="gE"><stop offset="0" stop-color="#5b3fc4"/><stop offset="1" stop-color="#1b1446"/></radialGradient></defs><rect width="1600" height="900" fill="url(#gE)"/>
    <g fill="#fff">${Array.from({ length: 60 }, (_, i) => `<circle cx="${(i * 389) % 1600}" cy="${(i * 263) % 900}" r="${1 + (i % 3)}" opacity="${.4 + (i % 5) / 8}"/>`).join('')}</g><circle cx="1350" cy="700" r="120" fill="#ff9a3c"/><ellipse cx="1350" cy="700" rx="190" ry="30" fill="none" stroke="#ffd23f" stroke-width="12"/><circle cx="220" cy="180" r="60" fill="#5fd3ff"/>`,
  bosque: `<rect width="1600" height="900" fill="#d6f5d0"/>${Array.from({ length: 9 }, (_, i) => `<g transform="translate(${i * 190 + 40} ${520 + (i % 2) * 60})"><rect x="-14" y="80" width="28" height="140" fill="#8b5a2b"/><circle cy="40" r="90" fill="${['#4cb35a', '#3fa04f', '#5cc46a'][i % 3]}"/></g>`).join('')}<rect y="780" width="1600" height="120" fill="#7fc95f"/>`,
  madera: `<rect width="1600" height="900" fill="#e8b27f"/>${Array.from({ length: 12 }, (_, i) => `<path d="M0 ${i * 80 + 20}q400 ${(i % 2 ? 20 : -20)} 800 0t800 0" stroke="#d49a62" stroke-width="6" fill="none"/>`).join('')}`
};
function bgSVG(theme) { return `<svg class="bg-art" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${BG[theme] || BG.cielo}</svg>`; }
