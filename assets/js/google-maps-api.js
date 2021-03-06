// This example uses the autocomplete feature of the Google Places API.
// It allows the user to find all museums in a given place, within a given
// country. It then displays markers for all the museums returned,
// with on-click details for each museum.

var map;
var places;
var infoWindow;
var marker;
var markers = [];
var userMarker;
var autocomplete;
var countryRestrict = { country: 'us' };
var MARKER_PATH =
  'https://developers.google.com/maps/documentation/javascript/images/marker_green';
var hostnameRegexp = new RegExp('^https?://.+?/');

var countries = {
  au: {
    center: { lat: -25.3, lng: 133.8 },
    zoom: 4,
  },
  br: {
    center: { lat: -14.2, lng: -51.9 },
    zoom: 3,
  },
  ca: {
    center: { lat: 62, lng: -110.0 },
    zoom: 3,
  },
  fr: {
    center: { lat: 46.2, lng: 2.2 },
    zoom: 5,
  },
  de: {
    center: { lat: 51.2, lng: 10.4 },
    zoom: 5,
  },
  mx: {
    center: { lat: 23.6, lng: -102.5 },
    zoom: 4,
  },
  nz: {
    center: { lat: -40.9, lng: 174.9 },
    zoom: 5,
  },
  it: {
    center: { lat: 41.9, lng: 12.6 },
    zoom: 5,
  },
  za: {
    center: { lat: -30.6, lng: 22.9 },
    zoom: 5,
  },
  es: {
    center: { lat: 40.5, lng: -3.7 },
    zoom: 5,
  },
  pt: {
    center: { lat: 39.4, lng: -8.2 },
    zoom: 6,
  },
  us: {
    center: { lat: 37.1, lng: -95.7 },
    zoom: 3,
  },
  uk: {
    center: { lat: 54.8, lng: -4.6 },
    zoom: 5,
  },
};

var request = {
  placeId: 'ChIJsT8qSaJYwokR-m20OGJUKCA',
};
var ch;
var googleResults = [];
var bucketList = [];
var myModal = $('#myModal');
var isModalShowing = false;

function callback(place, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    ch = place;
    console.log(ch);
    document.getElementById('gallery-info').innerHTML =
      '*touch image for more info' +
      '<br>' +
      '<br>' +
      ch.name +
      '<br>' +
      ch.formatted_address +
      '<br>' +
      ch.formatted_phone_number +
      '<br>' +
      ch.website;
  }
}
var directionsService;
var directionsDisplay;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: countries['us'].zoom,
    center: countries['us'].center,
    mapTypeControl: false,
    panControl: false,
    zoom: 3,
    streetViewControl: false,
  });
  infoWindow = new google.maps.InfoWindow({
    content: document.getElementById('info-content'),
  });
  // Create the autocomplete object and associate it with the UI input control.
  // Restrict the search to the default country, and to place type "cities".
  autocomplete = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
    {
      types: ['(regions)'],
      componentRestrictions: countryRestrict,
    },
  );
  places = new google.maps.places.PlacesService(map);
  places.getDetails(request, callback);
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsService = new google.maps.DirectionsService();
  autocomplete.addListener('place_changed', onPlaceChanged);

  // Add a DOM event listener to react when the user selects a country.
  document
    .getElementById('country')
    .addEventListener('change', setAutocompleteCountry);
}

// When the user selects a city, get the place details for the city and
// zoom the map in on the city.
function onPlaceChanged() {
  var place = autocomplete.getPlace();
  if (place.geometry) {
    map.panTo(place.geometry.location);
    map.setZoom(14);
    search();
  } else {
    document.getElementById('autocomplete').placeholder = 'Enter a city';
  }
}

// Search for museums in the selected city, within the viewport of the map.
function search() {
  var search = {
    bounds: map.getBounds(),
    types: ['museum', 'art_gallery'],
  };

  places.nearbySearch(search, function (results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      clearResults();
      clearMarkers();
      googleResults = results;
      // googleResults.unshift(ch);
      // console.log(googleResults);
      $('#results-table').fadeIn();
      // Create a marker for each museum found, and
      // assign a letter of the alphabetic to each marker icon.
      for (var i = 0; i < results.length; i++) {
        var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
        var markerIcon = MARKER_PATH + markerLetter + '.png';
        // Use marker animation to drop the icons incrementally on the map.
        markers[i] = new google.maps.Marker({
          position: results[i].geometry.location,
          animation: google.maps.Animation.DROP,
          icon: markerIcon,
        });
        // If the user clicks a museum marker, show the details of that museum
        // in an info window.
        markers[i].placeResult = results[i];
        google.maps.event.addListener(markers[i], 'click', showInfoWindow);
        setTimeout(dropMarker(i), i * 100);
        addResult(results[i], i);
      }
    }
  });
}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i]) {
      markers[i].setMap(null);
    }
  }
  markers = [];
}

// Set the country restriction based on user input.
// Also center and zoom the map on the given country.
function setAutocompleteCountry() {
  var country = document.getElementById('country').value;
  if (country == 'all') {
    autocomplete.setComponentRestrictions({ country: [] });
    map.setCenter({ lat: 15, lng: 0 });
    map.setZoom(2);
  } else {
    autocomplete.setComponentRestrictions({ country: country });
    map.setCenter(countries[country].center);
    map.setZoom(countries[country].zoom);
  }
  clearResults();
  clearMarkers();
}

function dropMarker(i) {
  return function () {
    markers[i].setMap(map);
  };
}

function addResult(result, i) {
  var results = document.getElementById('results');
  var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
  var markerIcon = MARKER_PATH + markerLetter + '.png';

  var tr = document.createElement('tr');
  tr.setAttribute('id', 'museum-' + i);
  tr.style.backgroundColor = i % 2 === 0 ? '#F0F0F0' : '#FFFFFF';
  tr.onclick = function () {
    google.maps.event.trigger(markers[i], 'click');
  };

  var btn = document.createElement('button');
  btn.onclick = function () {
    google.maps.event.trigger(markers[i], 'click');
  };

  var iconTd = document.createElement('td');
  var nameTd = document.createElement('td');
  var icon = document.createElement('img');
  icon.src = markerIcon;
  btn.setAttribute('class', 'list-group-item dropdown-toggle');
  icon.setAttribute('class', 'placeIcon');
  icon.setAttribute('className', 'placeIcon');
  var name = document.createTextNode(result.name);
  iconTd.appendChild(icon);
  nameTd.appendChild(name);
  btn.appendChild(iconTd);
  btn.appendChild(nameTd);
  results.appendChild(btn);
}

function clearResults() {
  var results = document.getElementById('results');
  while (results.childNodes[0]) {
    results.removeChild(results.childNodes[0]);
  }
}

// Get the place details for a museum. Show the information in an info window,
// anchored on the marker for the museum that the user selected.
function showInfoWindow() {
  var marker = this;
  places.getDetails({ placeId: marker.placeResult.place_id }, function (
    place,
    status,
  ) {
    if (status !== google.maps.places.PlacesServiceStatus.OK) {
      return;
    }
    infoWindow.open(map, marker);
    buildIWContent(place);
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? 'Error: The Geolocation service failed.'
      : "Error: Your browser doesn't support geolocation.",
  );
  infoWindow.open(map);
}

// Load the place information into the HTML elements used by the info window.
function buildIWContent(place) {
  document.getElementById('iw-icon').innerHTML =
    '<img class="museumIcon" ' + 'src="' + place.icon + '"/>';
  document.getElementById('iw-url').innerHTML =
    '<b><a href="' + place.url + '">' + place.name + '</a></b>';
  document.getElementById('iw-address').textContent = place.vicinity;
  //store the index of the place ID
  var bucketListIndex = bucketList.indexOf(place.id);
  // if the place ID's idex is not in array it will be -1
  if (bucketListIndex < 0) {
    // if place.id is negative this code runs
    // document.getElementById('bucket-list').innerHTML = "<button type='button' name='button' class='btn btn-success' id='addToBucketList'>Add to list</button>";
  }
  //set on click event for add to list button
  document.getElementById('bucket-list').onclick = function () {
    // this.remove();
    if (isModalShowing) return;
    isModalShowing = true;
    myModal.attr('class', 'modal fade in');
    myModal.attr('style', 'display: block');
    $('.header-content').append('Bucket List');
    $('.modal-body').append('CONTENT HERE');
    document.getElementById('bucket-list').innerHTML = 'Added!';
    console.log(place);
    bucketList.push(place);
    console.log(bucketList);
    alreadyAdded = true;
    // <form class="form-inline">
    // <div class="form-group">
    //   <div class="form-group">
    //     <label for="pwd">Name:</label>
    //     <input type="text" class="form-control" id="name" placeholder="Name" name="name">
    //   </div>
    //   <label for="email">Email:</label>
    //   <input type="email" class="form-control" id="email" placeholder="Enter email" name="email">
    // </div>
    // <div class="checkbox">
    //   <label><input type="text" name="remember">Remember me</label>
    // </div>
  };
  // } else {
  //    document.getElementById('bucket-list').innerHTML = '<div class="alert alert-success" role="alert">Added!</div>';
  //    console.log('already added');
  // }

  // document.getElementById('bucket-submit').onclick = function() {
  // Console log each of the user inputs to confirm we are receiving them
  // var name = $("#name").val();
  // var email = $("#email").val();
  // console.log(name);
  // console.log(email);
  // dbBucket.push(name);
  // dbBucket.push(email);
  // }

  document.getElementById('photos-button').onclick = function () {
    $('#photos').empty();
    var search = place.name;
    console.log(search);
    var searchURL =
      'https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?';

    $.getJSON(searchURL, {
      tags: search,
      tagmode: 'any',
      format: 'json',
    })
      .done(function (data) {
        console.log(data);
        $.each(data.items, function (index, item) {
          // console.log(item)
          $('<img>')
            .attr('src', item.media.m)
            .attr('id', 'flickr-image')
            .appendTo('#photos');
        });
      })
      .fail(function () {
        console.log('error occured accessing the Flickr API.');
      });
  };

  if (place.formatted_phone_number) {
    document.getElementById('iw-phone-row').style.display = '';
    document.getElementById('iw-phone').textContent =
      place.formatted_phone_number;
  } else {
    document.getElementById('iw-phone-row').style.display = 'none';
  }

  // Assign a five-star rating to the museum, using a black star ('&#10029;')
  // to indicate the rating the museum has earned, and a white star ('&#10025;')
  // for the rating points not achieved.
  if (place.rating) {
    var ratingHtml = '';
    for (var i = 0; i < 5; i++) {
      if (place.rating < i + 0.5) {
        ratingHtml += '&#10025;';
      } else {
        ratingHtml += '&#10029;';
      }
      document.getElementById('iw-rating-row').style.display = '';
      document.getElementById('iw-rating').innerHTML = ratingHtml;
    }
  } else {
    document.getElementById('iw-rating-row').style.display = 'none';
  }

  // The regexp isolates the first part of the URL (domain plus subdomain)
  // to give a short URL for displaying in the info window.
  if (place.website) {
    var fullUrl = place.website;
    var website = hostnameRegexp.exec(place.website);
    if (website === null) {
      website = 'http://' + place.website + '/';
      fullUrl = website;
    }
    document.getElementById('iw-website-row').style.display = '';
    document.getElementById('iw-website').textContent = website;
  } else {
    document.getElementById('iw-website-row').style.display = 'none';
  }
}
