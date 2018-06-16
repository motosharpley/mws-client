import idb from 'idb';

let dbPromise = idb.open('restaurants', 1, function(upgradeDb) {
  let keyValStore = upgradeDb.createObjectStore('keyval') ;
  keyValStore.put('value', 'key');
});

dbPromise.then(function(db) {
  var tx = db.transaction('keyval');
  var keyValStore = tx.objectStore('keyval');
  return keyValStore.get('key');
}).then(function(val) {
  console.log('The value of "hello" is:', val);
});