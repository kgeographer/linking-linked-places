require('handlebars')
window.segments = []

var segmentRecord = function(props){
  // console.log(props)
  return '<li>'+JSON.stringify(props)+'</li>'
  // return '<li>'+props.segment_id+'</li>'
  // for(let i = 0; i < props.length; i++) {
  //   html = "<li>"
  // }
}
var elasticsearch = require('elasticsearch');
window.client = new elasticsearch.Client({
  host: 'localhost:9200',
  // log: 'trace'
});

window.segmentSearch = function(id){
  var searchParams = {
    index: 'linkedplaces',
    type: 'segment',
    body: {
      query: {
        nested : {
            path : "properties",
            query : {
               match : {"properties.source" : id }
            },
            inner_hits : {}
        }
      }
    }
  }

  // let newArr = [];
  // client.search(searchParams).then(function (resp) {
  //   for(let i = 0; i < resp.hits.hits.length; i++){
  //     segments.push(resp.hits.hits[i]._source.properties);
  //   }
  //   // console.log('newArr: ',newArr)
  //   // return newArr;
  // }, function (err) {
  //   console.trace(err.message);
  // });

  // return client.search(searchParams).then(function (resp) {
  return client.search(searchParams).then(function (resp) {
    var hits = resp.hits.hits;
    // console.log('hits: ',hits)
    return hits;
  }, function (err) {
    console.trace(err.message);
  })
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
  console.log('obj',obj)
  // $("#results h3").html(obj.value)
  var re = /\((.*)\)/;
  window.html = "<table class='gaz-entries'><tr>"+
    "<th>Toponym</th><th>Dataset</th></tr>";
  window.placeArray = [];
  for(let i=0;i<obj.data.length;i++){
    let project = collections[obj.data[i].source_gazetteer];
    // gather place_ids from 'conflation_of' records
    placeArray.push(obj.data[i].id)
    html +=
      "<tr><td class='result-title'><a href='#'id='"+obj.data[i].id+
        "' project='"+project+"'>"+obj.data[i].title+"</a></td>"+
      // <a href='#' id='"+obj.id+"'>"+obj.data[i].title+"</td>"+
      "<td class='result-project'>"+project+"</td><tr>"
      +"<tr><td colspan=2>"+resolveId(obj.data[i].id)+"</td></tr>"
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

  $(".typeahead.tt-input")[0].value = '';
  //
})
