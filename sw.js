// sw.js - Service Worker para app.baltaanay.org
const CACHE_NAME = 'balta-mobile-v1';
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
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap'
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
