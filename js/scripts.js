$( document ).ready(function() {

    const clientID = "5aa142c7eb09e38c8cf6";
    var clientSecret = "76c90b3205f648f568c04b61d7d2241c";
    // const id = "9939f186d349cb48c3c091e3f0ae8e6c";
    let queryURL = "https://api.artsy.net/api/tokens/xapp_token?client_id=" + clientID + "&client_secret=" + clientSecret;

      // Perfoming an AJAX GET request to our queryURL
    $.ajax({
      url: queryURL,
      method: "POST"
    })

    // After the data from the AJAX request comes back
    .then(function(response) {
      console.log(response);
    });
});