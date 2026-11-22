const CACHE_NAME = 'ora-pwa-v2';
const urlsToCache = [
  '/',
  '/index.html'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // تفعيل التحديث فوراً
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  // 1. تجاهل الطلبات غير الـ GET أو التي تحتوي على بيانات تيليغرام
  if (event.request.method !== 'GET' || event.request.url.includes('tgWebApp')) {
    return;
  }

  // 2. استراتيجية Network First (الأولوية للإنترنت ثم الكاش) لتجنب أخطاء الرجوع في تيليغرام
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // تحديث الكاش بالنسخة الأحدث إذا كان الاتصال ممتازاً
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // إذا انقطع الإنترنت، اسحب من الكاش
        return caches.match(event.request);
      })
  );
});
