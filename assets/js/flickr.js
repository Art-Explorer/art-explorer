$(document).ready(function() {

$(document).on("click", ".list-group-item", function(){
  $("#photos").empty();
  var search = $(this).text();
  console.log(search);
  var searchURL=  "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";

  $.getJSON(searchURL, {
    tags: search,
    tagmode: "any",
    format: "json"
  }).done(function(data) {
    console.log(data);
    $.each(data.items, function(index, item) {
      console.log(item)
      $("<img>").attr("src", item.media.m).appendTo("#photos");
    });
  }).fail(function() {
    console.log("error occured accessing the Flickr API.")
  });
  }); //click results from google


});// ready
