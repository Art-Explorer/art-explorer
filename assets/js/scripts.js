$( document ).ready(function() {
  // $(".learn-more").hide();
  // $(".faq").hide();
  $("#results-table").hide();

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
  const dbBucket = firebase.database().ref("Bucket-List");

  var artImage;
  var participants;
  var artTitle;
  var personName;
  var roleCode;
  var imageSource;
  var acquired;
  var medium;
  var info;
  var infoCard;
  var newData;

  var bucketList = [];
  var bucketModal = $("#bucket-list-modal");
  var isBucketModalShowing = false;

  var myModal = $("#myModal");
  var modalImage;
  var isModalShowing = false;

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
      // var random;
      // function randomArtGenerator(j) {
      //   random = response.objects[Math.floor(Math.random()*response.objects.length)];
      // }
      console.log(response);
      dbRef.set(response);
  });

    dbRef.on("value", function(snapshot) {

      newData = snapshot.val();

      function totalDisplay(i) {
        var artHeading = $("<h2 class=media-heading>");
        var artInfo = $("<div class=media-body>");
        artInfo.attr("id", "artInfo");
        var artDiv = $("<div class='body'>");
  
        participants = newData.objects[i].participants;
        imgSource = newData.objects[i].images[0].b.url
        artTitle = newData.objects[i].title;
  
        for (var j = 0; j < participants.length; j++) {
          personName = participants[j].person_name;
          roleCode = participants[j].role_id;
          roleDisplay = participants[j].role_display_name;
          roleName = participants[j].role_name;
          if (roleCode === "35236655") {
            // console.log(roleName); //Designer
            designer = roleDisplay + " " + personName;
          }
          else if (roleCode === "35236565") {
            // console.log(roleName);  //Artist
            artist = roleName + ": " + personName;
          }
          else if (roleCode === "35236685") {
            // console.log(roleName); //Maker
            maker = roleName + ": " + personName;
          }
        }
  
        acquired = "Year acquired: " + newData.objects[i].year_acquired;
        medium = "Medium: " +newData.objects[i].medium;
        info = "Information: " + newData.objects[i].description;
        infoCard = artist + "<br>" + 
                  acquired + "<br>" + 
                  medium + "<br>" +
                  info + "</p>";
  
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
        $('#slide-' + i).append(artDiv[0]);
        artHeading.append(artTitle);
        artInfo.append(infoCard);
        $("#keyword-entry").val('');
        
        // $("#artist-input").val('');
        $(".art").on("click", function(event){
          if(isModalShowing) return;
          isModalShowing = true;
          thisArt = event.currentTarget.name;
          thisSource = event.currentTarget.src
          modalImage.attr("src", thisSource);
          $(".header-content").append(artHeading);
          $(".modal-body").append(modalImage);
          $(".footer-content").append(artInfo);
          myModal.attr("class", "modal fade in");
          myModal.attr("style", "display: block");
        });
      }
  
      for (var i = 0; i < 3; i++) {
        // randomArtGenerator(i);
        // console.log(random);
        totalDisplay(i);
      }

    });

    // $("#bucket-list").on("click", function(event) {
    //   console.log("hello!");
    //   // Capture user inputs and store them into variables
    //   if(isBucketModalShowing) return;
    //   isBucketModalShowing = true;
    //   bucketModal.attr("class", "modal fade in");
    //   bucketModal.attr("style", "display: block");
    //   console.log(this.phone);
    //   console.log(this.website);
    // });

    // $("#bucket-submit").on("click", function(event) {
    //   // Console log each of the user inputs to confirm we are receiving them
    //   var name = $("#name").val();
    //   var email = $("#email").val();
    //   console.log(name);
    //   console.log(email);
    //   dbBucket.push(name);
    //   dbBucket.push(email);
    //   });

     // Sets a listener for closing the modal and resetting parameters
    $(".close").on("click", function(){
      $(".header-content").empty();
      $(".modal-body").empty();
      $(".footer-content").empty();
      myModal.attr("class", "modal fade out");
      myModal.attr("style", "display: none");
      bucketModal.attr("class", "modal fade out");
      bucketModal.attr("style", "display: none");
      isModalShowing = false;
      isBucketModalShowing = false;
    });

  // Sets a event listnener for a new artist
  $("#artist-submit").on("click", function(event) {
    event.preventDefault();
    $(".item").empty();
    
    const token = "2e2316873bca66e99bd915dbcb769c56";
    artist = $("#keyword-entry").val().trim();
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