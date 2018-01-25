$( document ).ready(function() {
var traverson = require('traverson'),
    JsonHalAdapter = require('traverson-hal'),
    xappToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IiIsImV4cCI6MTUxNzQ0MDcwMiwiaWF0IjoxNTE2ODM1OTAyLCJhdWQiOiI1YTY4ZWQxN2IyMDJhMzRmZGQ4NWE0NGUiLCJpc3MiOiJHcmF2aXR5IiwianRpIjoiNWE2OTE0M2VjOWRjMjQ0YTIyOGJiNGY0In0.R4htGaBOXbQF9pwefOhzzQxNFCtfnr36ntQVg3HoPJw';

traverson.registerMediaType(JsonHalAdapter.mediaType, JsonHalAdapter);
api = traverson.from('https://api.artsy.net/api').jsonHal();

api.newRequest()
  .follow('artist')
  .withRequestOptions({
    headers: {
      'X-Xapp-Token': xappToken,
      'Accept': 'application/vnd.artsy-v2+json'
    }
  })
  .withTemplateParameters({ id: 'andy-warhol' })
  .getResource(function(error, andyWarhol) {
    console.log(andyWarhol.name + 'was born in ' + andyWarhol.birthday + ' in ' + andyWarhol.hometown);
  });
});
