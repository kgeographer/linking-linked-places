require('handlebars')
window.segments = []

var elasticsearch = require('elasticsearch');
window.client = new elasticsearch.Client({
  host: 'localhost:9200',
  // log: 'trace'
});

var years = function(timespan){
  //return start and end from topotime when timespan
  var str = '';
  if(timespan.length > 1) {
    str = timespan[0].substring(0,4)+'-'+timespan[3].substring(0,4);
  } else {
    str = timespan[0]
  }
  return str;
}
window.segmentSearch = function(obj){
  // retrieve all segments associated with a place,
  // populate results_inset
  console.log('segmentSearch()', obj)
  let html = ''
  var plKeys = Object.keys(obj)
  for(let i = 0; i < plKeys.length; i++){

    // 29-43 works
    var searchParams = {
      index: 'linkedplaces',
      type: 'segment',
      body: {
        query: {
          nested : {
              path : "properties",
              query : {
                 match : {"properties.source" : plKeys[i] }
              },
              inner_hits : {}
          }
        }
      }
    }

    client.search(searchParams).then(function (resp) {
      return Promise.all(resp.hits.hits)
    }).then(function(hitsArray){
        html += '<div class="place-card"><h4>'+obj[plKeys[i]]+
          ' connections:</h4><ul class="ul-segments">';
        for(let j = 0; j < hitsArray.length; j++){
          html += '<li>'+hitsArray[j]._source.properties.label+'('+
          years(hitsArray[j]._source.when.timespan)+
          ')</li>';
          // html += '<li>'+hitsArray[j]._source.properties.target+
          // ' ('+hitsArray[j]._source.properties.label+') '+
          // // ' ('+hitsArray[j]._source.properties.segment_id+') '+
          // years(hitsArray[j]._source.when.timespan)+
          // '</li>';
          // console.log(hitsArray[i]._source.when)
        };
        html += '</ul></div>'
        $("#results_inset").html(html)
      }).catch(console.log.bind(console));;
  }
}

window.resolveId = function(id){
  return 'TODO: segments for id: '+id
}
client.ping({requestTimeout: 30000}, function (error) {
  if (error) {
    console.error('elasticsearch cluster is down!');
  } else {
    console.log('ES is up');
  }
});

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
  // console.log('obj',obj)
  // $("#results h3").html(obj.value)
  var re = /\((.*)\)/;
  window.html = "<table class='gaz-entries'><tr>"+
    "<th>Toponym</th><th>Dataset</th></tr>";
  var placeObj = {};
  for(let i=0;i<obj.data.length;i++){
    let project = collections[obj.data[i].source_gazetteer];
    // gather place_ids from 'conflation_of' records
    placeObj[obj.data[i].id] = obj.data[i].title;
  }
  // related segments to results_inset
  segmentSearch(placeObj);
  // console.log(placeArray)
  html += "</table>"
  // $("#results_inset").html(html)
  // $(".result-title a").click(function(e){
  //   window.proj = $(this).attr('project').substring(0,7) == 'incanto'?'incanto-f':$(this).attr('project')
  //   console.log('project',proj)
  //   // if project/dataset isn't loaded, load it (project !- dataset for incanto)
  //   window.pcheck = $("input:checkbox[value='"+proj+"']")
  //   console.log('toponym checked',pcheck,proj)
  //   if(pcheck.prop('checked') == false){
  //     location.href = location.origin+location.pathname+'?d='+proj+'&p='+this.id
  //     pcheck.prop('checked', true)
  //   } else {
  //     console.log(proj,'already loaded, zoom to',this.id)
  //   }
  //   console.log('got data, now place', this.id)
  //   ttmap.setView(idToFeature[proj].places[this.id].getLatLng(),8)
  //   idToFeature[proj].places[this.id].openPopup()
  // })

  $(".typeahead.tt-input")[0].value = '';
  //
})
