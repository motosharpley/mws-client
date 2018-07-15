// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').then(function (registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function (err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

let restaurant;
var newMap;

/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  initMap();
});

/**
 * Initialize leaflet map
 */
initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.newMap = L.map('map', {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 16,
        scrollWheelZoom: false
      });
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
        mapboxToken: 'pk.eyJ1IjoibW90b3NoYXJwbGV5IiwiYSI6ImNqaXYyMTd3NjE3cmczd2xvanpyMzl6ZzcifQ.CgsdM_Nr9OPZaOlMVeVCDg',
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
      }).addTo(newMap);
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
    }
  });
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;
  let imgUrl = restaurant.photograph + '.jpg';

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img'
  image.src = `/img/${imgUrl}`;
  image.srcset = `/img/${imgUrl} 300w, /img/med-${imgUrl} 600w, /img/large-${imgUrl} 800w`;
  image.alt = `A sample view of ${restaurant.name} that serves ${restaurant.cuisine_type} cuisine.`;

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  setFavButton(restaurant.is_favorite);
  
  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

 /**
  *  Add / Remove from Favorites
  */
 const favButton = document.getElementById('favButton');
 let favorite;

 setFavButton = (status) => {
  if (status === 'true'){
    favButton.style.color = 'red';
    favButton.innerText = ' Remove from favorites';
    favorite = true;
  } else {
    favButton.style.color = 'white';
    favButton.innerText = ' Add To Favorites';
    favorite = false;
  }
}

favButton.addEventListener('click', function(event) {
  event.preventDefault();
  const restaurant_id = getParameterByName('id');
   
  if (!favorite){
    fetch(`http://localhost:1337/restaurants/${restaurant_id}/?is_favorite=true`,{
      method: 'PUT'
    });
    console.log('fav set to true');
    setFavButton('true');
  } else {
    fetch(`http://localhost:1337/restaurants/${restaurant_id}/?is_favorite=false`,{
      method: 'PUT'
    });
    console.log('fav set to false');
    setFavButton('false');
  }
})

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (restaurant = self.restaurant) => {
  (fetchReviews = () => {
    fetch(`http://localhost:1337/reviews/?restaurant_id=${restaurant.id}`)
      .then(function (res) {
        return res.json();
      }).then(function (data) {
        const reviews = data;

        const container = document.getElementById('reviews-container');
        const title = document.createElement('h3');
        title.innerHTML = 'Reviews';
        container.appendChild(title);

        if (!reviews) {
          const noReviews = document.createElement('p');
          noReviews.innerHTML = 'No reviews yet!';
          container.appendChild(noReviews);
          return;
        }
        const ul = document.getElementById('reviews-list');
        reviews.forEach(review => {
          ul.appendChild(createReviewHTML(review));
        });
        container.appendChild(ul);
      })
  })();
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.innerHTML = review.name;
  li.appendChild(name);

  const date = document.createElement('p');
  date.innerHTML = review.createdAt;
  li.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
}

/**
 * add new review
 */
  const reviewForm = document.getElementById('addReview');
  let online = window.navigator.onLine;
  console.log(online);

  window.addEventListener("offline", function(){
    alert("Network is offline");
    online = false;
  }, false);

    reviewForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const id = getParameterByName('id');
    let review = document.addReview.review.value;
    let name = document.addReview.name.value;
    let rating = document.addReview.rating.value;

    let newReview = {
      restaurant_id : id,
      name : name,
      rating : rating,
      comments : review
    };

    // If online send to api DB
    if (online) {
      fetch('http://localhost:1337/reviews/', {
            method: 'POST',
            body: JSON.stringify(newReview),
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
      })
      location.reload();
    } else {
      idb.open('reviews', 1, function(upgradeDb) {
        upgradeDb.createObjectStore('outbox', { autoIncrement : true, keyPath: 'id' });
      }).then(function(db) {
        var transaction = db.transaction('outbox', 'readwrite');
        return transaction.objectStore('outbox').put(newReview);
      
      }).then(function() {
        alert('Your new review has been stored locally and will be sent to the server when network connection returns');
      });
    }
  })

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant = self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
 * IndexedDB utilities for handling offline review submissions
 */

var store = {
  db: null,
 
  init: function() {
    if (store.db) { return Promise.resolve(store.db); }
    return idb.open('reviews', 1, function(upgradeDb) {
      upgradeDb.createObjectStore('outbox', { autoIncrement : true, keyPath: 'id' });
    }).then(function(db) {
      return store.db = db;
    });
  },
 
  outbox: function(mode) {
    return store.init().then(function(db) {
      return db.transaction('outbox', mode).objectStore('outbox');
    })
  }
}

/**
 * Send offline reviews to the server upon re-established network connectivity
 */

window.addEventListener("online", function(){
  console.log("Network is online");
  // get reviews from idb and send to network
  store.outbox('readonly').then(function (outbox) {
    return outbox.getAll();
  }).then(function (reviews) {
    return Promise.all(reviews.map(function (review) {
      return fetch('http://localhost:1337/reviews/', {
        method: 'POST',
        body: JSON.stringify(review),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        if (data.result === 'success') {
          return store.outbox('readwrite').then(function (outbox) {
            return outbox.delete(review.id);
          });
        }
      })
    }).catch(function (err) { console.error(err); })
    )
  })
  location.reload();
}, false);