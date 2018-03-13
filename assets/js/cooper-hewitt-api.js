$( document ).ready(function() {
  $(".results-table").hide();
  $("#resultsTable").hide();
  
  
    var config = {
    apiKey: "AIzaSyDyB-QLzbbYtDMixJ9eqppkC83aOjlNag0",
    authDomain: "artgalleryproject-92ef9.firebaseapp.com",
    databaseURL: "https://artgalleryproject-92ef9.firebaseio.com",
    projectId: "artgalleryproject-92ef9",
    storageBucket: "",
    messagingSenderId: "308927903962"
    };
    firebase.initializeApp(config);

    const dbRef = firebase.database().ref("Artist");

  $("#resultsTable").on("click", function(event) {
    $("#art-display").fadeIn();
    event.preventDefault();
    const token = "2e2316873bca66e99bd915dbcb769c56";
    var artist = "Picasso";
    let queryURL = "https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.people.getObjects&access_token=" + token + "&person=" + artist;

      // Perfoming an AJAX GET request to our queryURL
    $.ajax({
      url: queryURL,
      method: "GET"
    })

    // After the data from the AJAX request comes back
    .then(function(response) {
      dbRef.set(response)
      for (var i = 0; i < 3; i++) {
        var artDiv = $("<div class='item'>");
        artDiv.attr("id", "image" + i)
        // // Creating and storing an image tag
        var artImage = $("<img>");
        artImage.attr("src", response.objects[i].images[0].b.url);
        artImage.attr("class", "artsy");
        
        var galleryLink = $("<a href= 'artGallerySearchResult.html'>");
        galleryLink.append(artImage);
        artDiv.append(galleryLink);
        $('#slide-' + i).append(artDiv[0]);
        console.log(artDiv[0]);
      }
      
    });
  });
});


