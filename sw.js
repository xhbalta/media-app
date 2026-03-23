// sw.js - Service Worker mejorado para Balta Media Móvil
const CACHE_NAME = 'balta-mobile-v4';

const urlsToCache = [
  '/',
  '/index.html',
  '/main.js',
  '/show.js',
  '/episodios.js',
  '/player.js',
  '/buscar.js',
  '/biblioteca.js',
  '/explorar.js',
  '/404.js',
  '/styles.css',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap',
  'https://podcast.tenam.site/episodios.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});

// Soporte para botón de actualizar
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
