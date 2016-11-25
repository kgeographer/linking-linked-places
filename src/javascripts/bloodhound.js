require('handlebars')

function prepare(query, settings) {
  settings.type = 'POST';
  return settings;
}

// resolve collection names in data
var collections = {"ra":"roundabout","courier":"courier","incanto":"incanto",
  "vb":"vicarello","xuanzang":"xuanzang"}

var toponyms = new Bloodhound({
  datumTokenizer: function(datum) {
    return Bloodhound.tokenizers.whitespace(datum.value);
  },
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  remote: {
    wildcard: encodeURIComponent('%QUERY'),
    url: 'http://localhost:9200/linkedplaces/_suggest?source=' +
        encodeURIComponent('{"q":{"prefix":"%QUERY","completion":{"field":"suggest"}}}'),
    transform: function(response) {
      return $.map(response.q[0].options, function(place) {
        // console.log(place)
        return {
          data: place._source.is_conflation_of,
          value: place._source.representative_title,
            // +" ("+place._source.is_conflation_of.length+")",
            // + ' (' + place._source.is_conflation_of[0].source_gazetteer + ')',
          names: place._source.suggest
        };
      });
    }
  }
});

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
  source: toponyms,
  templates: {
    empty: [
      '<div class="empty-message">',
        'no matches',
      '</div>'
      ].join('\n'),
    suggestion: template
  }
});

$(".typeahead").on("typeahead:select", function(e,obj){
  window.obj = obj
  $("#results h3").html(obj.value)
  var re = /\((.*)\)/;
  let collection = collections[re.exec(obj.value)]
  var html = "<ul class='gaz-entries'>";
  for(let i=0;i<obj.data.length;i++){
    var project = collections[obj.data[i].source_gazetteer]
    html += "<li value="+project+">"+obj.data[i].title+" ("+project+")</li>"
  }
  html += "</ul>"
  $("#results_inset").html(html)
  $(".gaz-entries li").click(function(e){
    e.preventDefault()
    console.log('clicked', this.getAttribute('value'))
    location.href = location.origin+location.pathname+'?d='+this.getAttribute('value')
  })
  $(".typeahead.tt-input")[0].value = '';
  //
})


// Instantiate the Bloodhound suggestion engine
// var movies = new Bloodhound({
//   datumTokenizer: function(datum) {
//     return Bloodhound.tokenizers.whitespace(datum.value);
//   },
//   queryTokenizer: Bloodhound.tokenizers.whitespace,
//   remote: {
//     wildcard: '%QUERY',
//     url: 'http://api.themoviedb.org/3/search/movie?query=%QUERY&api_key=f22e6ce68f5e5002e71c20bcba477e7d',
//     transform: function(response) {
//       // Map the remote source JSON array to a JavaScript object array
//       return $.map(response.results, function(movie) {
//         console.log(response.results)
//         return {
//           value: movie.original_title
//         };
//       });
//     }
//   }
// });
