require('handlebars')

// Instantiate the Bloodhound suggestion engine
var movies = new Bloodhound({
  datumTokenizer: function(datum) {
    return Bloodhound.tokenizers.whitespace(datum.value);
  },
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  remote: {
    wildcard: '%QUERY',
    url: 'http://api.themoviedb.org/3/search/movie?query=%QUERY&api_key=f22e6ce68f5e5002e71c20bcba477e7d',
    transform: function(response) {
      // Map the remote source JSON array to a JavaScript object array
      return $.map(response.results, function(movie) {
        console.log(response.results)
        return {
          value: movie.original_title
        };
      });
    }
  }
});
function prepare(query, settings) {
  settings.type = 'POST';
  return settings;
}

var toponyms = new Bloodhound({
  datumTokenizer: function(datum) {
    return Bloodhound.tokenizers.whitespace(datum.value);
  },
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  remote: {
    wildcard: encodeURIComponent('%QUERY'),
    url: 'http://localhost:9200/linkedplaces/_suggest?source=' +
        encodeURIComponent('{"foo":{"prefix":"%QUERY","completion":{"field":"suggest"}}}'),
    transform: function(response) {
      console.log(response.foo[0].options)
      return $.map(response.foo[0].options, function(place) {
        return {
          value: place.text
        };
      });
    }
  }
});

// var toponyms = new Bloodhound({
//   datumTokenizer: function(datum) {
//     return Bloodhound.tokenizers.whitespace(datum.value);
//   },
//   queryTokenizer: Bloodhound.tokenizers.whitespace,
//   remote: {
//     wildcard: '%QUERY',
//     url: 'http://localhost:9200/linkedplaces/_suggest?source=',
//     prepare: function (query, settings) {
//        settings.type = "POST";
//        settings.contentType = "application/json; charset=UTF-8";
//       //  {"foo":{"prefix":%QUERY,"completion":{"field":"suggest"}}}
//        settings.data = JSON.stringify(query);
//        return settings;
//     },
//     transform: function(response) {
//       console.log(response)
//       // return $.map(response.results, function(place) {
//       //   return {
//       //     value: place
//       //   };
//       // });
//     }
//   }
// });

// var source   = $("#place-template").html();
var template = Handlebars.compile($("#place-template").html());


$('#bloodhound .typeahead').typeahead({
  hint: true,
  highlight: true,
  minLength: 1
},
{
  name: 'places',
  limit: 10,
  display: 'value',
  // source: movies
  source: toponyms
  // templates: {
  //   empty: [
  //     '<div class="empty-message">',
  //       'no matches',
  //     '</div>'
  //     ].join('\n'),
  //   suggestion: template
  // }
});

$(".typeahead").on("typeahead:select", function(e,obj){
  console.log(obj)
  $("#results h3").html(obj.toponym)
  $("#results_inset").html("<p><b>Alt name(s)</b>: " + obj.altnames + "</p>")
  // $('.typeahead').typeahead('val')
  // value = $('input.search-input').val();
  // console.log(data)
})
