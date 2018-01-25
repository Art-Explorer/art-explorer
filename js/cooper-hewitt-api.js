$( document ).ready(function() {
  $("#add-artist").on("click", function(event) {
    event.preventDefault();
    const token = "2e2316873bca66e99bd915dbcb769c56";
    var artist = $("#artist-input").val().trim();;
    // const id = "9939f186d349cb48c3c091e3f0ae8e6c";
    let queryURL = "https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.exhibitions.getObjects&access_token=" + token + "&query=" + artist;

      // Perfoming an AJAX GET request to our queryURL
    $.ajax({
      url: queryURL,
      method: "GET"
    })

    // After the data from the AJAX request comes back
    .then(function(response) {
      console.log(response);
      // var results = response.data;
      console.log(response.objects[0].images[0].b.url);
      for (var i = 0; i < 3; i++) {
        var artDiv = $("<div class='item'>");
        // // Creating and storing an image tag
        var artImage = $("<img>");
        artImage.attr("src", response.objects[i].images[0].b.url);
        artImage.attr("class", "art");

        artDiv.prepend(artImage);
        // artDiv.prepent(info);
        $("#pieces").prepend(artDiv);
      }
    });
  });
});
