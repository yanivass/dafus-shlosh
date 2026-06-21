const CACHE_NAME = 'dafus-shlosh-v1';
const urlsToCache = [
  '/dafus-shlosh/',
  '/dafus-shlosh/index.html',
  '/dafus-shlosh/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // אם יש ברשת – קח מהרשת ועדכן cache
      return fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        }
        return networkResponse;
      }).catch(() => response); // אם אין רשת – קח מה-cache
    })
  );
});
