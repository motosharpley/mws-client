// set up the cahche
var staticCache = 'mws-cache-v3';
var urlsToCache = [
  '/',
  'img/1.jpg',
  'img/2.jpg',
  'img/3.jpg',
  'img/4.jpg',
  'img/5.jpg',
  'img/6.jpg',
  'img/7.jpg',
  'img/8.jpg',
  'img/9.jpg',
  'img/10.jpg',
  'img/large-1.jpg',
  'img/large-2.jpg',
  'img/large-3.jpg',
  'img/large-4.jpg',
  'img/large-5.jpg',
  'img/large-6.jpg',
  'img/large-7.jpg',
  'img/large-8.jpg',
  'img/large-9.jpg',
  'img/large-10.jpg',
  'img/med-1.jpg',
  'img/med-2.jpg',
  'img/med-3.jpg',
  'img/med-4.jpg',
  'img/med-5.jpg',
  'img/med-6.jpg',
  'img/med-7.jpg',
  'img/med-8.jpg',
  'img/med-9.jpg',
  'img/med-10.jpg'
];

// install service worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCache).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

// activate service worker fill and clean/delete old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('mws-') &&
                 cacheName != staticCache;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// intercept requests and serve from cache 
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(resp) {
      return resp || fetch(event.request).then(function(response) {
        return caches.open(staticCache).then(function(cache) {
          cache.put(event.request, response.clone());
          return response;
        });  
      });
    })
  );
});

// listen for the sync event
self.addEventListener('sync', function(event) {
 console.log(event);
});