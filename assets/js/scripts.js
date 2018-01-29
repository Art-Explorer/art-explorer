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
    var artImage;
    var imageSource;
    var artTitle;
    var acquired;
    var medium;
    var info;
    var infoCard;
    var myModal = $("#myModal");
    var modalImage;
    var isModalShowing = false;

    dbRef.on("value", function(snapshot) {

      const newData = snapshot.val();

      function totalDisplay(i) {
        var outDiv = $("<div class=col-md-12>");
        var innerRow = $("<row>");

        var artDisplay = $("<div class=col-lg-2>");
        artDisplay.attr("id", "artDisplay");

        var artInfo = $("<div class=col-lg-9>");
        artInfo.attr("id", "artInfo");

        var artDiv = $("<div class='item'>");

        imgSource = newData.objects[i].images[0].b.url
        artTitle = newData.objects[i].title;
        acquired = newData.objects[i].year_acquired;
        medium = newData.objects[i].medium;
        info = newData.objects[i].description;
        infoCard =  "Name: " + artTitle + "<br>" +
            "Year Acquired: " + acquired + "<br>" +
            "Medium: " + medium + "<br>" +
            "Information: " + info + "</p>";

        artImage = $("<img>");
        artImage.attr("class", "art");
        artImage.attr("name", artTitle);
        artImage.attr("data-toggle", "modal");
        artImage.attr("data-target", "#myModal>");
        artImage.attr("src", imgSource);
        artImage.attr("id", "image-" + [i]);
        modalImage = $("<img>");
        modalImage.attr("id", "modal-image");

        artDiv.append(artImage);
        artDisplay.append(artDiv);
        artInfo.append(infoCard);
        innerRow.append(artDisplay);
        innerRow.append(artInfo);
        outDiv.append(innerRow);
        $("#showcase").append(outDiv);
        $("#artist-input").val('');
      }   

      for (var i = 0; i < 3; i++) {
        totalDisplay(i);
      }

      $(".art").on("click", function(event){
        if(isModalShowing) return;
        isModalShowing = true;
        thisArt = event.currentTarget.name;
        thisSource = event.currentTarget.src
        modalImage.attr("src", thisSource);
        $(".modal-header").append(thisArt);
        $(".modal-body").append(modalImage);
        myModal.attr("class", "modal fade in");
        myModal.attr("style", "display: block");
      });
    });

    // Sets a listener for closing the modal and resetting parameters
    $(".close").on("click", function(event){
        myModal.attr("class", "modal fade out");
        myModal.attr("style", "display: none");
        isModalShowing = false;
    });

    // Sets a event listnener for a new artist
    $("#search-input").on("click", function(event) {
      event.preventDefault();
      $("#showcase").empty();
      $(".modal-header").empty();
      $(".modal-body").empty();

      const token = "2e2316873bca66e99bd915dbcb769c56";
      var artist = $("#artist-input").val().trim();
      let queryURL = "https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.exhibitions.getObjects&access_token=" + token + "&query=" + artist + "&size=10";
      // Perfoming an AJAX GET request to our queryURL
      $.ajax({
        url: queryURL,
        method: "GET"
      })
      // After the data from the AJAX request comes back
      .then(function(response) {
        dbRef.set(response);
        totalDisplay();
      });
    });

});

