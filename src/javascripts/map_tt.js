
$(function() {
  startMap();
});
function initTimeline(foo) {
  console.log('in initTimeline()', foo)
  var eventSource = new Timeline.DefaultEventSource(0);
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
          eventSource:    eventSource,
          date:           d,
          theme:          theme,
          layout:         'original'  // original, overview, detailed
      }),
      Timeline.createBandInfo({
          width:          "25%",
          intervalUnit:   Timeline.DateTime.CENTURY,
          intervalPixels: 120,
          eventSource:    eventSource,
          date:           d,
          theme:          theme,
          layout:         'overview'  // original, overview, detailed
      })
  ];
  bandInfos[1].syncWith = 0;
  bandInfos[1].highlight = true;

  let tl = Timeline.create(document.getElementById("tl"), bandInfos, Timeline.HORIZONTAL);
  // Adding the date to the url stops browser caching of data during testing or if
  // the data source is a dynamic query...

  // tl.loadJSON("data/test.tt.json?"+ (new Date().getTime()), function(json, url) {
  //     eventSource.loadJSON(json, url);
  // });

  // tl.loadJSON("data/euro_poland.tl.json?"+ (new Date().getTime()), function(json, url) {
  tl.loadJSON("data/euro_poland.tl.json", function(json, url) {
      eventSource.loadJSON(json, url);
    }
  );

  // tl.loadJSON(placedata);
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

function validateWhen(place){
  // does Topotime place record have valid when object?
}

function buildEvent(place){
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
  event['durationEvent'] = "";
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
      "fillOpacity": 0.3
    }
  }
function startMap(){
  L.mapbox.accessToken = 'pk.eyJ1Ijoia2dlb2dyYXBoZXIiLCJhIjoiUmVralBPcyJ9.mJegAI1R6KR21x_CVVTlqw';
  // AWMC tiles in mapbox
  let ttmap = L.mapbox.map('map', 'isawnyu.map-knmctlkh')
      // .setView([0, 0], 3);
      .setView([50.064191736659104, 15.556640624999998], 4);
  let featureLayer = L.mapbox.featureLayer()
    .loadURL('data/polands.tt_feature-when.json')
    .on('ready', function(){
      let ttfeats = featureLayer._geojson.features;
      featureLayer.eachLayer(function(layer){
        // console.log(layer)
        // event = buildEvent(layer.feature);
        // build temporal object and pass to timeline
        eventsObj.events.push(buildEvent(layer.feature));
        idToFeature['places'][layer.feature.properties.id] = layer._leaflet_id;
        layer.setStyle(mapStyles.areas)
        layer.bindPopup(layer.feature.properties.label);
      })
    })
    .addTo(ttmap);
  console.log('eventsObj',eventsObj)

  var krakow = L.marker([50.0647, 19.9450])
    .bindPopup("<span style='width:95%;'><b>Kraków</b><br/>lay within several places over time")
    // +"<p style='font-size:.9em;''><b>Name variants</b>: <em>Carcovia,Cracau,Cracaû,Cracovia,Cracovie,Cracow,"+
    // "<br/>Cracòvia,Cracóvia,Gorad Krakau,KRK,Kraka,Krakau</em></p></span>")
    .addTo(ttmap).openPopup();

  initTimeline(eventsObj);
}

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
