importScripts('./songs.js');

const CACHE_NAME = 'misericordia-v2';

const mappedSongs = RAW_SONGS.map(
  ([id, title, massPart = [], seasons = [], language = [], hasSheet = true]) => ({
    id,
    title,
    massPart,
    seasons,
    language,
    lyricsFile: `assets/lyrics/${id}.html`,
    sheetMusicFile: hasSheet ? `assets/sheets/${id}.html` : null
  })
);

if (typeof window !== 'undefined') {
  window.songs = mappedSongs;
}

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './songs.js',
  './manifest.json',
  './assets/choir-logo-2024.png',
  './assets/Newsreader-VariableFont_opsz,wght.ttf',
  './assets/Newsreader-Italic-VariableFont_opsz,wght.ttf',
  './assets/icons/icon192x192.png',
  './assets/icons/icon512x512.png',
  ...SONG_ASSETS
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
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
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
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