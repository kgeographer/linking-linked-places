require('handlebars')

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
          id: place._source.id,
          data: place._source.is_conflation_of,
          value: place._source.representative_title,
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
  console.log('obj',obj)
  // $("#results h3").html(obj.value)
  var re = /\((.*)\)/;
  window.html = "<table class='gaz-entries'><tr>"+
    "<th>Toponym</th><th>Dataset</th></tr>";
  for(let i=0;i<obj.data.length;i++){
    let project = collections[obj.data[i].source_gazetteer]
    html +=
      "<tr><td class='result-title'><a href='#'id='"+obj.data[i].id+
        "' project='"+project+"'>"+obj.data[i].title+"</a></td>"+
      // <a href='#' id='"+obj.id+"'>"+obj.data[i].title+"</td>"+
      "<td class='result-project'>"+project+"</td><tr>"
    // html += "<li value="+project+" id="+obj.id+">"+obj.data[i].title
    //   +" ("+project+")</li>"
  }
  html += "</table>"
  $("#results_inset").html(html)
  $(".result-title a").click(function(e){
    window.proj = $(this).attr('project').substring(0,7) == 'incanto'?'incanto-f':$(this).attr('project')
    console.log('project',proj)
    // if project/dataset isn't loaded, load it (project !- dataset for incanto)
    window.pcheck = $("input:checkbox[value='"+proj+"']")
    console.log('toponym checked',pcheck,proj)
    if(pcheck.prop('checked') == false){
      location.href = location.origin+location.pathname+'?d='+proj+'&p='+this.id
      pcheck.prop('checked', true)
    } else {
      console.log(proj,'already loaded, zoom to',this.id)
    }
    console.log('got data, now place', this.id)
    ttmap.setView(idToFeature[proj].places[this.id].getLatLng(),8)
    idToFeature[proj].places[this.id].openPopup()
  })
  // $(".result-project a").click(function(e){
  //   e.preventDefault()
  //   console.log('clicked', this.text)
  //   // if project/dataset isn't loaded, load it
  //   if($("input:checkbox[value='"+this.text+"']").is('checked') == false){
  //     location.href = location.origin+location.pathname+'?d='+this.text
  //   }
  //   // is dataset loaded?
  //   // location.href = location.origin+location.pathname+'?d='+this.getAttribute('value')
  //   // idToFeature[this.getAttribute('id')].openPopup()
  // })
  // this.getAttribute('id')
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
