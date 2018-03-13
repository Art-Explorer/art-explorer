$("#add-user").on("click", function(event) {
  // prevent page from refreshing when form tries to submit itself
  event.preventDefault();

  // Capture user inputs and store them into variables
  var name = $("#name-input").val().trim();
  var email = $("#email-input").val().trim();
  var age = $("#age-input").val().trim();
  var comment = $("#comment-input").val().trim();

  // Console log each of the user inputs to confirm we are receiving them
  console.log(name);
  console.log(email);
  console.log(age);
  console.log(comment);

  // Replaces the content in the "recent-member" div with the new info
  $("#name-display").text(name);
  $("#email-display").text(email);
  $("#age-display").text(age);
  $("#comment-display").text(comment);

  // Clear sessionStorage
  sessionStorage.clear();

  // Store all content into sessionStorage
  sessionStorage.setItem("name", name);
  sessionStorage.setItem("email", email);
  sessionStorage.setItem("age", age);
  sessionStorage.setItem("comment", comment);
});

// By default display the content from sessionStorage
$("#name-display").text(sessionStorage.getItem("name"));
$("#email-display").text(sessionStorage.getItem("email"));
$("#age-display").text(sessionStorage.getItem("age"));
$("#comment-display").text(sessionStorage.getItem("comment"));
