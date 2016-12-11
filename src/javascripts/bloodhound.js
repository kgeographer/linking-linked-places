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
  ga('send', 'event', ['Search'], ['Select'], ['Search panel']);
  // retrieve all segments associated with a place,
  // populate results_inset
  console.log('segmentSearch obj',obj)
  let html = ''
  var plKeys = Object.keys(obj)
  var relevantProjects = []
  // console.log('segmentSearch obj', obj)
  for(let i = 0; i < plKeys.length; i++){
    // console.log('plKeys', plKeys[i])
    relevantProjects.push(obj[plKeys[i]][0])
    // multi_match
    var searchParams = {
      index: 'linkedplaces',
      type: 'segment',
      body: {
        query: {
          multi_match : {
              query : plKeys[i],
              fields: ["properties.source","properties.target"]
          }
        }
      }
    }

    client.search(searchParams).then(function (resp) {
      return Promise.all(resp.hits.hits)
    }).then(function(hitsArray){
        // console.log('plKeys[i] for .place-card', obj[plKeys[i]])
        html += '<div class="place-card">'+
          '<p class="search-result-project">from: <em>'+obj[plKeys[i]][0]+'</em></p>'+
          '<h4><a href="#" project="'+obj[plKeys[i]][0]+
          '" id="'+plKeys[i]+'">'+obj[plKeys[i]][1]+
          '</a> connections:</h4><ul class="ul-segments">';
        for(let j = 0; j < hitsArray.length; j++){
          let l = hitsArray[j]._source.properties.label
          html += '<li>'+(l==''?'<em>no label</em>':l)+' ('+
          years(hitsArray[j]._source.when.timespan)+
          ')</li>';
        };
        html += '</ul></div>'
        $("#results_inset").html(html)
        $(".place-card a").click(function(e){
          ga('send', 'event', ['Search'], ['Choose dataset'], ['Search panel']);
          window.proj = $(this).attr('project').substring(0,7) == 'incanto'?'incanto-f':$(this).attr('project')
          console.log('project',proj)
          // if project/dataset isn't loaded, load it (project !- dataset for incanto)
          window.pcheck = $("input:checkbox[value='"+proj+"']")
          // console.log('toponym checked',pcheck,proj)
          if(pcheck.prop('checked') == false){
            location.href = location.origin+location.pathname+'?d='+proj+'&p='+this.id
            pcheck.prop('checked', true)
          } else {
            // console.log(proj,'already loaded, zoom to',this.id)
          }
          // console.log('got data, now place', this.id)
          ttmap.setView(idToFeature[proj].places[this.id].getLatLng(),6)
          idToFeature[proj].places[this.id].openPopup()
        })
      }).catch(console.log.bind(console));
  }
  // clear map layers if present, load relevant datasets
  loadLayers(relevantProjects);
}

// resolve collection names as the exist in data
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
  // console.log('typeahead obj',obj)
  var placeObj = {};
  for(let i=0;i<obj.data.length;i++){
    let project = collections[obj.data[i].source_gazetteer];
    // gather place_ids from 'conflation_of' records
    placeObj[obj.data[i].id] = [project, obj.data[i].title];
  }
  // get segments and display in #results_inset
  segmentSearch(placeObj);
  // console.log('typeahead placeObj', placeObj)

  $(".typeahead.tt-input")[0].value = '';
  //
})
