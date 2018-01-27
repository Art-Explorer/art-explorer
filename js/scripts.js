$( document ).ready(function() {

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

    dbRef.on("value", function(snapshot) {

      const newData = snapshot.val();

      function totalDisplay(i) {
        var outerRow = $("<div class=col-md-12>");
        var innerRow = $("<row>");
        var artDisplay = $("<div class=col-lg-2>");
        var artInfo = $("<div class=col-lg-9>");
        var artDiv = $("<div class='item'>");
        var galleryLink = $("<a href='newData.objects[i].images[0].b.url'>");
        var artImage = $("<img>");

        artDisplay.attr("id", "artDisplay");
        artInfo.attr("id", "artInfo");
        artImage.attr("src", newData.objects[i].images[0].b.url);
        artImage.attr("class", "art");
        galleryLink.append(artImage);
        artDiv.append(galleryLink);
        artDisplay.append(artDiv);

        var artTitle = newData.objects[i].title;
        var acquired = newData.objects[i].year_acquired;
        var medium = newData.objects[i].medium;
        var info = newData.objects[i].description;
        var infoCard =  "Name: " + artTitle + "<br>" +
            "Year Acquired: " + acquired + "<br>" +
            "Medium: " + medium + "<br>" +
            "Information: " + info + "</p>";

        artInfo.append(infoCard);
        innerRow.append(artDisplay);
        innerRow.append(artInfo);
        outerRow.append(innerRow);
        $("#showcase").append(outerRow);
        $("#artist-input").val('');
      }   

      for (var i = 0; i < 3; i++) {
        totalDisplay(i);
      }
    });
    // Sets a event listnener for a new artist
  $("#add-artist").on("click", function(event) {
    event.preventDefault();
    $("#showcase").empty();

    const token = "2e2316873bca66e99bd915dbcb769c56";
    var artist = $("#artist-input").val().trim();
    let queryURL = "https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.exhibitions.getObjects&access_token=" + token + "&query=" + artist;
      // Perfoming an AJAX GET request to our queryURL
    $.ajax({
      url: queryURL,
      method: "GET"
    })
    // After the data from the AJAX request comes back
    .then(function(response) {
      dbRef.set(response);
      console.log(response);

    });
  });
});