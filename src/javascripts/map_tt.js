require('mapbox.js')
// require('leaflet-ajax');

$(function() {
  startMapM('polands'); // Leaflet
});

window.initTimeline = function(events) {
  // let sourceFile = 'data/' + file
  // console.log('in initTimeline()', events)
  window.eventSrc = new Timeline.DefaultEventSource(0);
  // Example of changing the theme from the defaults
  // The default theme is defined in
  // http://simile-widgets.googlecode.com/svn/timeline/tags/latest/src/webapp/api/scripts/themes.js
  var theme = Timeline.ClassicTheme.create();
  theme.event.bubble.width = 350;
  theme.event.bubble.height = 300;

  var d = Timeline.DateTime.parseGregorianDateTime("1900")
  var bandInfos = [
      Timeline.createBandInfo({
          width:          "75%",
          intervalUnit:   Timeline.DateTime.DECADE,
          intervalPixels: 50,
          eventSource:    eventSrc,
          date:           d,
          theme:          theme,
          layout:         'original'  // original, overview, detailed
      }),
      Timeline.createBandInfo({
          width:          "25%",
          intervalUnit:   Timeline.DateTime.CENTURY,
          intervalPixels: 120,
          eventSource:    eventSrc,
          date:           d,
          theme:          theme,
          layout:         'overview'  // original, overview, detailed
      })
  ];
  bandInfos[1].syncWith = 0;
  bandInfos[1].highlight = true;

  tl = Timeline.create(document.getElementById("tl"), bandInfos, Timeline.HORIZONTAL);
  // from a file
  // tl.loadJSON("data/euro_poland.tl.json", function(json, url) {
  //   eventSrc.loadJSON(json, url);
  // });
  // from the dynamic object; no idea why it needs a dummy url
  eventSrc.loadJSON(events, 'dummyUrl');
}

var resizeTimerID = null;

function onResize() {
    if (resizeTimerID == null) {
        resizeTimerID = window.setTimeout(function() {
            resizeTimerID = null;
            tl.layout();
        }, 500);
    }
}


window.idToFeature = {places:{}}
window.eventsObj = {'dateTimeFormat': 'iso8601','events':[ ]};
window.myLayer = {}
window.ttfeatures = []
window.tl = {}

function validateWhen(place){
  // does Topotime place record have valid when object?
}

function buildEvent(place){
  // console.log(place)
  // need validate function here
  // if(validateWhen(place)==true {})
  var event = {};
  event['id'] = place.properties.id;
  event['title'] = place.properties.label;
  event['description'] = !place.properties.description ? "" : place.properties.description;
  // assuming valid; we know it's there in toy example
  event['start'] = place.when.timespans[0].start.earliest;
  event['latestStart'] = !place.when.timespans[0].start.latest ? "" :place.when.timespans[0].start.latest;
  event['end'] = place.when.timespans[0].end.latest;
  event['earliestEnd'] = !place.when.timespans[0].end.latest ? "" :place.when.timespans[0].end.latest;
  event['durationEvent'] = "true";
  event['link'] = "";
  event['image'] = "";
  // event['durationEvent'] = place.when.timespans[0].during;
  //     {'start': '1900', 'latestStart': '1901', 'earliestEnd': '1903', 'end': '1902',
  //     'title': 'Test 6g: Bad dates: earliestEnd > end',
  //     'description': 'Test 6g: Bad dates: earliestEnd > end',
  //     'durationEvent': true, 'image':'<url>', 'link':'<url>'
  //     },
  return event;
  // console.log('got place,'+place+', building event')
}

var mapStyles = {
  areas: {
      "color": "#993333",
      "weight": 1,
      "opacity": .8,
      "fillColor": "orange",
      "fillOpacity": 0.3,
    }
  }

function startMapL(){
  // Leaflet style
  let ttmap = L.map('map')
    .setView([50.064191736659104, 15.556640624999998], 4);
  window.featureLayer = L.geoJson.ajax('data/polands.tt_feature-when.json',{
    onEachFeature: function(feature, layer){
      layer.bindPopup('foo, dammit')
    }
  })
  .addTo(ttmap);

  initTimeline(eventsObj);
}

function startMapM(dataset){
  // mapbox.js (non-gl)
  L.mapbox.accessToken = 'pk.eyJ1Ijoia2dlb2dyYXBoZXIiLCJhIjoiUmVralBPcyJ9.mJegAI1R6KR21x_CVVTlqw';
  // AWMC tiles in mapbox
  let ttmap = L.mapbox.map('map', 'isawnyu.map-knmctlkh')
      // .setView([0, 0], 3);
      .setView([50.064191736659104, 15.556640624999998], 4);
  let featureLayer = L.mapbox.featureLayer()
    //polands.tt_feature-when.json
    .loadURL('data/' + dataset + '.geojson')
    .on('ready', function(){
      ttfeatures = featureLayer._geojson.features;
      featureLayer.eachLayer(function(layer){
        // console.log(layer.feature.properties)
        layer.setStyle(mapStyles.areas)
        layer.bindPopup(layer.feature.properties.label);
        // build temporal object and pass to timeline
        eventsObj.events.push(buildEvent(layer.feature));
        idToFeature['places'][layer.feature.properties.id] = layer._leaflet_id;
      })
      initTimeline(eventsObj);
      // initTimeline('');
    })
    .addTo(ttmap);

  // initTimeline(eventsObj);
}
// console.log('eventsObj',eventsObj)

// var krakow = L.marker(new L.LatLng(50.0647, 19.9450), {
//   icon: L.mapbox.marker.icon({
//       'marker-color': '009900',
//       'zIndexOffset': -1000
//     })
//   })
//   .bindPopup("<span style='width:95%;'><b>Kraków</b><br/>lay within several places over time")
//   // +"<p style='font-size:.9em;''><b>Name variants</b>: <em>Carcovia,Cracau,Cracaû,Cracovia,Cracovie,Cracow,"+
//   // "<br/>Cracòvia,Cracóvia,Gorad Krakau,KRK,Kraka,Krakau</em></p></span>")
//   .addTo(ttmap);
  // .addTo(ttmap).openPopup();



// open popup
// featureLayer._layers[92].openPopup()
// style
// featureLayer._layers[idToFeature['places']['pol03']].setStyle({fillColor :'blue'})

// event format
// {
// 'dateTimeFormat': 'iso8601',
// 'events' :
//   [
//     {'start': '1900', 'latestStart': '1901', 'earliestEnd': '1903', 'end': '1902',
//     'title': 'Test 6g: Bad dates: earliestEnd > end',
//     'description': 'Test 6g: Bad dates: earliestEnd > end',
//     'durationEvent': true, 'image':'<url>', 'link':'<url>'
//     },
//     {}
//   ]
// }
