importScripts('./songs.js');

const CACHE_NAME = 'misericordia-v0.1g';

const SONG_ASSETS = (typeof RAW_SONGS !== 'undefined' ? RAW_SONGS : []).flatMap(
  ([id, , , , , hasSheet = true]) => {
    const files = [`assets/lyrics/${id}.html`];
    if (hasSheet) {
      files.push(`assets/sheets/${id}.html`);
    }
    return files;
  }
);

const RELATIVE_ASSETS = [
  './',
  'index.html',
  'style.css',
  'app.js',
  'songs.js',
  'manifest.json',
  'assets/choir-logo-2024.png',
  'assets/Newsreader-VariableFont_opsz,wght.ttf',
  'assets/Newsreader-Italic-VariableFont_opsz,wght.ttf',
  'assets/icons/icon192x192.png',
  'assets/icons/icon512x512.png',
  ...SONG_ASSETS
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const path of RELATIVE_ASSETS) {
        const fullUrl = new URL(path, self.registration.scope).href;
        try {
          const response = await fetch(fullUrl, { cache: 'reload' });
          if (response.ok) {
            await cache.put(fullUrl, response);
          } else {
            console.warn('Skipped precaching (HTTP ' + response.status + '):', fullUrl);
          }
        } catch (err) {
          console.warn('Skipped precaching (network error):', fullUrl, err);
        }
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          if (
            response &&
            response.status === 200 &&
            response.type === 'basic'
          ) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => new Response('Offline — this content is not cached yet.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        }));
    })
  );
});