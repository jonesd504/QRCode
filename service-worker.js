var cacheName = 'AccorGME2023-cache-v1';
var filesToCache = [
  '/',
  'https://git.djonesav.uk/manifest.json',
  "https://static.wixstatic.com/media/59e08e_6ce21ebd00da48178adad91122a028b2~mv2.png",
  
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

window.addEventListener("beforeinstallprompt", function (e) {
  e.userChoice.then(function (choiceResult) {
      console.log(choiceResult.outcome);
        if (choiceResult.outcome == "dismissed") {
         console.log("User cancelled home screen install");
        } else {
              console.log("User added to home screen");
            }
  });
});

self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
