/* Service worker de Pipo Juega: permite instalarlo como app y jugar sin internet.
   Si cambias algún archivo y no ves los cambios, sube el número de VERSION. */
const VERSION = 'pipo-v3';
const CORE = ['./', './index.html', './manifest.json', './css/estilos.css',
  './js/arte.js', './js/motor.js', './js/juegos-clasicos.js', './js/juegos-nuevos.js', './js/juegos-mas.js', './js/juegos-accion.js', './js/pantallas.js',
  './img/icon-192.png', './img/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.host.includes('supabase')) return;
  if (req.mode === 'navigate') { e.respondWith(fetch(req).then(r => { const cp = r.clone(); caches.open(VERSION).then(c => c.put('./index.html', cp)); return r; }).catch(() => caches.match('./index.html'))); return; }
  if (url.origin === location.origin || url.host.includes('fonts.')) e.respondWith(
    fetch(req).then(r => { if (r.ok && !url.pathname.endsWith('.mp3')) { const cp = r.clone(); caches.open(VERSION).then(c => c.put(req, cp)); } return r; })
      .catch(() => caches.match(req)));
});
