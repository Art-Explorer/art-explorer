  // This example requires the Places library. Include the libraries=places
      // parameter when you first load the API. For example:
      // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
      var map;
      var places;
      var infoWindow;
      var pos;
      var directionsService;
      var request = {
        placeId: 'ChIJsT8qSaJYwokR-m20OGJUKCA'
      };
      var cooperHewitt;
      var MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
      
      function callback(place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          cooperHewitt = place;
        }
      }
    
        function initMap() {
            var directionsDisplay = new google.maps.DirectionsRenderer;
            var directionsService = new google.maps.DirectionsService;
            var map = new google.maps.Map(document.getElementById('map'), {
                // mapTypeControl: false,
                center: {lat:40.7844, lng:-73.9582},
                zoom: 12
            });
            infoWindow = new google.maps.InfoWindow({
              content: document.getElementById('info-content')
            });
            places = new google.maps.places.PlacesService(map);
            places.getDetails(request, callback);
            // infoWindow = new google.maps.InfoWindow;
            var markerIcon = MARKER_PATH + '.png';
            marker = new google.maps.Marker({
              animation: google.maps.Animation.DROP,
              icon: markerIcon
            });
            // Try HTML5 geolocation.
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                };
                marker.setPosition(pos);
                // infoWindow.setContent('Current location.');
                infoWindow.open(map);
                map.setCenter(pos);        
                function calculateAndDisplayRoute(directionsService, directionsDisplay) {
                    var selectedMode = document.getElementById('mode').value;
                    places = new google.maps.places.PlacesService(map);
                    places.getDetails(request, callback);
                    console.log(pos);
                    console.log(cooperHewitt);
                    directionsService.route({
                      origin: pos,
                      destination: {lat:40.7844, lng:-73.9582},  // Cooper Hewitt
                      // Note that Javascript allows us to access the constant
                      // using square brackets and a string value as its
                      // "property."
                      travelMode: google.maps.TravelMode[selectedMode]
                    }, function(response, status) {
                      if (status == 'OK') {
                        directionsDisplay.setDirections(response);
                      } else {
                        window.alert('Directions request failed due to ' + status);
                      }
                    });
                }
                calculateAndDisplayRoute(directionsService, directionsDisplay);
                document.getElementById('mode').addEventListener('change', function() {
                calculateAndDisplayRoute(directionsService, directionsDisplay);
            });
              }, function() {
                handleLocationError(true, infoWindow, map.getCenter());
              });
            } else {
            //   // Browser doesn't support Geolocation
              handleLocationError(false, infoWindow, map.getCenter());
            }
            directionsDisplay.setMap(map);
        }
    
        function handleLocationError(browserHasGeolocation, infoWindow, pos) {
            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
            infoWindow.open(map);
        }
        
  // Get the place details for a museum. Show the information in an info window,
  // anchored on the marker for the museum that the user selected.
  function showInfoWindow() {
    var marker = this;
    places.getDetails({placeId: marker.placeResult.place_id},
    function(place, status) {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        return;
      }
      infoWindow.open(map, marker);
      buildIWContent(place);
    });
  }
     
  // Load the place information into the HTML elements used by the info window.
  function buildIWContent(place) {
    document.getElementById('iw-icon').innerHTML = '<img class="museumIcon" ' +
        'src="' + place.icon + '"/>';
    document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url +
        '">' + place.name + '</a></b>';
    document.getElementById('iw-address').textContent = place.vicinity;
      
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
        if (place.rating < (i + 0.5)) {
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