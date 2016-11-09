require('mapbox.js')
querystring = require('querystring')
var url = require('url'),
  querystring = require('querystring'),
  ctr = require('@turf/centroid'),
  buf = require('@turf/buffer')
window.parsedUrl = url.parse(window.location.href, true, true)
window.searchParams = querystring.parse(parsedUrl.search.substring(1));
window.q = querystring;
window.cent = ctr
window.buff = buf
// require('leaflet-ajax');
// expose for debugging
window.idToFeature = {places:{}}
window.eventsObj = {'dateTimeFormat': 'iso8601','events':[ ]};
window.myLayer = {}
window.pointFeatures = []
window.lineFeatures = []
window.tl = {}

$(function() {
  startMapM(searchParams['d'])
  $("#menu").click(function(){
    $("#data").toggle("fast")
  })
  $(".data-header").html(searchParams['d'])
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

  var d = Timeline.DateTime.parseGregorianDateTime("0639")
  // var d = Timeline.DateTime.parseGregorianDateTime("1900")
  var bandInfos = [
      Timeline.createBandInfo({
          width:          "75%",
          intervalUnit:   Timeline.DateTime.YEAR,
          // intervalUnit:   Timeline.DateTime.DECADE,
          intervalPixels: 50,
          eventSource:    eventSrc,
          date:           d,
          theme:          theme,
          layout:         'original'  // original, overview, detailed
      }),
      Timeline.createBandInfo({
          width:          "25%",
          intervalUnit:   Timeline.DateTime.DECADE,
          // intervalUnit:   Timeline.DateTime.CENTURY,
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

  return event;
}

function buildSegmentEvent(place){
  // console.log(' in buildSegmentEvent()',place)
  // need validate function here
  // if(validateWhen(place)==true {})
  var event = {};
  event['id'] = place.properties.segment_id;
  event['title'] = place.properties.label;
  event['description'] = !place.properties.description ? "" : place.properties.description;
  // assuming valid; we know it's there in toy example
  event['start'] = place.when.timespan[0];
  event['latestStart'] = place.when.timespan[1] == "" ? "" :place.when.timespan[1];
  event['earliestEnd'] = place.when.timespan[2] == "" ? "" :place.when.timespan[2];
  event['end'] = place.when.timespan[3] == "" ? "" :place.when.timespan[3];
  event['durationEvent'] = "false";
  event['link'] = "";
  event['image'] = "";
  console.log(event)
  return event;
}

var mapStyles = {
  areas: {
      "color": "#993333",
      "weight": 1,
      "opacity": .8,
      "fillColor": "orange",
      "fillOpacity": 0.3,
    },
  points: {
    "color": "#000",
    "fillColor": "#990000",
    "marker-size": "small",
    "marker-color": "#006600"
  },
  lines: {
      "color": "#FB2E35",
      "weight": 2,
      "opacity": 0.6
  },
  segments: {
      "color": "green",
      "weight": 3,
      "opacity": 0.6
  }
}

var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

function writePopup(layer) {
  console.log(layer)
}
function startMapM(dataset){
  // mapbox.js (non-gl)
  L.mapbox.accessToken = 'pk.eyJ1Ijoia2dlb2dyYXBoZXIiLCJhIjoiUmVralBPcyJ9.mJegAI1R6KR21x_CVVTlqw';

  // AWMC tiles in mapbox
  window.ttmap = L.mapbox.map('map', 'isawnyu.map-knmctlkh')

  /*  read a single FeatureCollection of
      Places (geometry.type == Point), and
      Routes (geometry.type == GeometryCollection or undefined)
        - route geometry.geometries[i] == LineString or MultiLineString
  */
  let featureLayer = L.mapbox.featureLayer()
    .loadURL('data/' + dataset + '.geojson')
    .on('ready', function(){
      // build separate L.featureGroup for points & lines
      featureLayer.eachLayer(function(layer){
        let geomF = layer.feature.geometry
        let whenF = layer.feature.when
        // put places features pointFeatures array
        if(geomF.type == 'Point') {
            let latlng = new L.LatLng(geomF.coordinates[1],geomF.coordinates[0])
            let placeFeature = new L.CircleMarker(latlng, {
              color: '#000',
              fillColor: '#ffff00',
              radius: 4,
              fillOpacity: 0.8,
              weight: 1
            })
            placeFeature.bindPopup(layer.feature.properties.gazetteer_label)
            pointFeatures.push(placeFeature)
        }
        // the rest are routes with segments in a GeometryCollection
        else if(geomF.type == 'GeometryCollection') {
          // console.log('layer.feature', layer.feature)
          //* TODO: create feature for each geometry
          for(i in geomF.geometries) {
            // console.log(geomF.geometries[i])
              let whenObj = geomF.geometries[i].when
              let feat = {
                "type":"Feature",
                "geometry": {
                  "type":geomF.geometries[i].type,
                  "coordinates":geomF.geometries[i].coordinates
                  },
                "when": whenObj,
                "properties": geomF.geometries[i].properties
              }
              // console.log('feat', feat)
              segment = new L.GeoJSON(feat, {
                  style: mapStyles.segments
                }).bindPopup('<b>'+feat.properties.label+'</b><br/>(segment '+
                  feat.properties.segment_id+')')

              lineFeatures.push(segment)
              //* build event object for timeline
              if (whenObj != {}) {
                eventsObj.events.push(buildSegmentEvent(feat)); }
              else {
                // timeline event for each segments
                for (seg in geomF.geometries) {
                  console.log(seg.when)
                  console.log('buildEvent() for each segment')
                }
              }
          }
        } else {
          console.log(whenF == undefined ? 'whenF undef' : whenF)
        }
      })

      window.places = L.featureGroup(pointFeatures).addTo(ttmap)
      ttmap.fitBounds(places.getBounds())
      window.segments = L.featureGroup(lineFeatures).addTo(ttmap)
      initTimeline(eventsObj)
    })


/* xuanzang
        "when": {
          "follows": "20604",
          "duration": "?",
          "timespan": [
            "[0645-01-01",
            "",
            "",
            "0645-12-31",
            "]"
          ]
        }
*/

/* polands
        "when": {
          "timespans": [
            {
              "label": "in 800",
              "start": {
                "earliest": "0750-01-01"
              },
              "end": {
                "latest": "0850-12-31"
              }
            }
          ]
        }
*/
        // if (geomF.type ='GeometryCollection') {
        //   console.log('collection w/', geomF.geometries.length, ' segments; when = ', whenF)
        // }
        // console.log(layer.feature.when)
        // console.log()


        // build temporal object and pass to timeline
        // eventsObj.events.push(buildEvent(layer.feature));
    //     idToFeature['places'][layer.feature.properties.id] = layer._leaflet_id;
    //   })
    //   initTimeline(eventsObj);
    //   // initTimeline('');
    // })
    // .addTo(ttmap);

// }


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
}
// function startMapL(){
//   // Leaflet style
//   let ttmap = L.map('map')
//     .setView([50.064191736659104, 15.556640624999998], 4);
//   window.featureLayer = L.geoJson.ajax('data/polands.tt_feature-when.json',{
//     onEachFeature: function(feature, layer){
//       layer.bindPopup('foo, dammit')
//     }
//   })
//   .addTo(ttmap);
//
//   initTimeline(eventsObj);
// }
