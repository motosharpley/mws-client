importScripts('/js/idb.js');
// set up the cahche
var staticCache = 'mws-cache-v3';
var urlsToCache = [
  '/',
  'index.html',
  'restaurant.html',
  'css/styles.css',
  'css/rest-styles.css',
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
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(staticCache).then(function (cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

// activate service worker fill and clean/delete old caches
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.filter(function (cacheName) {
          return cacheName.startsWith('mws-') &&
            cacheName != staticCache;
        }).map(function (cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});


// // intercept requests and serve from cache 
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (resp) {
      return resp || fetch(event.request).then(function (response) {
        return caches.open(staticCache).then(function (cache) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});




// var store = {
//   db: null,
 
//   init: function() {
//     if (store.db) { return Promise.resolve(store.db); }
//     return idb.open('reviews', 1, function(upgradeDb) {
//       upgradeDb.createObjectStore('outbox', { autoIncrement : true, keyPath: 'id' });
//     }).then(function(db) {
//       return store.db = db;
//     });
//   },
 
//   outbox: function(mode) {
//     return store.init().then(function(db) {
//       return db.transaction('outbox', mode).objectStore('outbox');
//     })
//   }
// }

// listen for the sync event
// self.addEventListener('sync', function (event) {
//   console.log('sync event fired');
//   event.waitUntil(
//     store.outbox('readonly').then(function (outbox) {
//       return outbox.getAll();
//     }).then(function (reviews) {
//       return Promise.all(reviews.map(function (review) {
//         return fetch('http://localhost:1337/reviews/', {
//           method: 'POST',
//           body: JSON.stringify(review),
//           headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//           }
//         }).then(function (response) {
//           return response.json();
//         }).then(function (data) {
//           if (data.result === 'success') {
//             return store.outbox('readwrite').then(function (outbox) {
//               return outbox.delete(review.id);
//             });
//           }
//         })
//       }).catch(function (err) { console.error(err); })
//       )
//     })
//   )
// })

// self.addEventListener('sync', function(event) {
//   console.log('sync event fired');
//   if (event.tag == 'reviewSync') {
//     event.waitUntil(store.outbox('readonly').then(function (outbox) {
//       return outbox.getAll();
//     }).then(function (reviews) {
//       return Promise.all(reviews.map(function (review) {
//         return fetch('http://localhost:1337/reviews/', {
//           method: 'POST',
//           body: JSON.stringify(review),
//           headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//           }
//         }).then(function (response) {
//           return response.json();
//         }).then(function (data) {
//           if (data.result === 'success') {
//             return store.outbox('readwrite').then(function (outbox) {
//               return outbox.delete(review.id);
//             });
//           }
//         })
//       }).catch(function (err) { console.error(err); })
//       )
//     }));
//   }
// });