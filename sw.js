const CACHE_NAME = 'ora-pwa-v1';
const urlsToCache = [
  '/',
  '/index.html'
];

// تثبيت الـ Service Worker وتخزين الملفات الأساسية مؤقتاً
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// جلب الملفات حتى لو كان الاتصال ضعيفاً
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
