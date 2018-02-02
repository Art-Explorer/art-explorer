  // This example requires the Places library. Include the libraries=places
      // parameter when you first load the API. For example:
      // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
      var map;
      var places;
      var infoWindow;
      var pos;
      var directionsService;
    
        function initMap() {
            var directionsDisplay = new google.maps.DirectionsRenderer;
            var directionsService = new google.maps.DirectionsService;
            var map = new google.maps.Map(document.getElementById('map'), {
                // mapTypeControl: false,
                center: {lat:40.7844, lng:-73.9582},
                zoom: 12
            });
    
            infoWindow = new google.maps.InfoWindow;
            
            // Try HTML5 geolocation.
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                };
                infoWindow.setPosition(pos);
                infoWindow.setContent('Current location.');
                infoWindow.open(map);
                map.setCenter(pos);        
                function calculateAndDisplayRoute(directionsService, directionsDisplay) {
                    var selectedMode = document.getElementById('mode').value;
                    console.log(pos);
                    directionsService.route({
                      origin: pos,
                      destination: {lat:40.7844, lng:-73.9582},  // Ocean Beach.
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