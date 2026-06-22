const CACHE_NAME = 'dafus-shlosh-v4';
const urlsToCache = [
  '/dafus-shlosh/',
  '/dafus-shlosh/index.html',
  '/dafus-shlosh/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // דלג על בקשות שאינן http/https
  if (!event.request.url.startsWith('http')) return;
  // דלג על בקשות ל-Supabase ולשירותים חיצוניים
  if (event.request.url.includes('supabase.co') || 
      event.request.url.includes('googleapis') ||
      event.request.url.includes('accounts.google')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      const network = fetch(event.request).then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
      return cached || network;
    })
  );
});
