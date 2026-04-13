/**
 * sw.js – Service Worker cơ bản: cache tĩnh để chạy offline
 */

const CACHE_NAME = 'rps-v1';

// Danh sách tài nguyên cần cache
const STATIC_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './game/engine.js',
  './game/ai.js',
  './game/storage.js',
  './ui/dom.js',
  './ui/animations.js',
  './ui/sounds.js',
  './assets/icons.svg',
  './manifest.webmanifest',
];

// Khi install: cache tất cả file tĩnh
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Khi activate: xóa cache cũ
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: trả về cache nếu có, không thì fetch mạng
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
