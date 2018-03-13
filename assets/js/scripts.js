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
    var random;

    // function randomArtGenerator(j) {
    //    random = newData.objects[Math.floor(Math.random()*newData.objects.length)];
    // }

    function totalDisplay(i) {
      var outDiv = $("<div class=col-md-12>");
      outDiv.attr("id", "total-display");
      var inDiv = $("<div class=media>");

      var artDisplay = $("<div class=media-left>");
      artDisplay.attr("id", "artDisplay");
      var artHeading = $("<h4 class=media-heading>");
      var artInfo = $("<div class=media-body>");
      artInfo.attr("id", "artInfo");

      var artDiv = $("<div class='item'>");

      imgSource = newData.objects[i].images[0].b.url
      artTitle = newData.objects[i].title;
      acquired = newData.objects[i].year_acquired;
      medium = newData.objects[i].medium;
      info = newData.objects[i].description;
      infoCard = "Year Acquired: " + acquired + "<br>" +
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
      artHeading.append(artTitle);
      artInfo.append(artHeading);
      artInfo.append(infoCard);
      inDiv.append(artDisplay);
      inDiv.append(artInfo);
      outDiv.append(inDiv);
      $("#showcase").append(outDiv);
      $("#artist-input").val('');
    }

    for (var i = 0; i < 3; i++) {
      // randomArtGenerator(i);
      // console.log(random);
      totalDisplay(i);
    }

    $(".art").on("click", function(event){
      if(isModalShowing) return;
      isModalShowing = true;
      thisArt = event.currentTarget.name;
      thisSource = event.currentTarget.src
      modalImage.attr("src", thisSource);
      $(".header-content").append(thisArt);
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
      $(".header-content").empty();
      $(".modal-body").empty();
  });

  // Sets a event listnener for a new artist
  $("#search-input").on("click", function(event) {
    event.preventDefault();
    $("#showcase").empty();
    $(".header-content").empty();
    $(".modal-body").empty();

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
    });
  });
});