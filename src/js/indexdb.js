import idb from 'idb';

let dbPromise = idb.open('rr-db', 1, function(upgradeDb) {
  switch(upgradeDb.oldVersion) {
    case 0:
      let keyValStore = upgradeDb.createObjectStore('keyval') ;
      keyValStore.put('value', 'key');
    case 1:
      upgradeDb.createObjectStore('restaurantInfo', {keyPath: 'name'});
  }  
});

dbPromise.then(function(db) {
  let tx = db.transaction('keyval');
  let keyValStore = tx.objectStore('keyval');
  return keyValStore.get('key');
}).then(function(val) {
  console.log('The value of "key" is:', val);
});

dbPromise.then(function(db) {
  let tx = db.transaction('keyval', 'readwrite');
  let keyValStore = tx.objectStore('keyval');
  keyValStore.put('myval', 'mykey');
  return tx.complete;
}).then(function() {
  console.log('successfully added your key and value to keyval');
});

dbPromise.then(function(db) {
  let tx = db.transaction('restaurantInfo', 'readwrite');
  let restaurantStore = tx.objectStore('restaurantInfo');

  restaurantStore.put({
    name: 'Rest Name',
    neighborhood: 'Neighborhood',
    photograph: '1',
    address: 'address string',
    cuisine_type: "Cuisine",
    operating_hours: 'some time',
    reviews: 'hmmm this place'
  });
  return tx.complete;
}).then(function() {
  console.log('rest info added');
});

dbPromise.then(function(db){
  let tx = db.transaction('restaurantInfo');
  let restaurantStore = tx.objectStore('restaurantInfo');

  return restaurantStore.getAll();
}).then(function(restaurant) {
  console.log('Restaurant-info:', restaurant );
});