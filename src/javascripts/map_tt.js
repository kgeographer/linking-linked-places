var url = require('url'),
    $ = require('jquery'),
    querystring = require('querystring')
require('bootstrap')
require('mapbox.js')

// import add'l app JavaScript
import './bloodhound.js';

// require('@turf/centroid')
// require('@turf/buffer')

// expose for debugging
window.parsedUrl = url.parse(window.location.href, true, true)
window.searchParams = querystring.parse(parsedUrl.search.substring(1));
// window.q = querystring;
// window.cent = ctr
// window.buff = buf
// require('leaflet-ajax');
window.features = {}
window.idToFeature = {}
// window.idToFeature = {places:{}, segments:{}}
window.eventsObj = {'dateTimeFormat': 'iso8601','events':[ ]};
window.myLayer = {}
window.pointFeatures = []
window.lineFeatures = []
window.tl = {}
window.tlMidpoint = ''
window.dataRows = ''

$(function() {
  // startMapM() // TODO: bounding boxes for datasets
  Object.getOwnPropertyNames(searchParams).length == 0 ?
    startMapM() : startMapM(searchParams['d'],searchParams['p'])
  // startMapM(searchParams['d'])
  $("#menu").click(function(){
    $("#data").toggle("fast")
  })
  $(".data-header").html(searchParams['d'])
  $("input:checkbox").change(function(){
    if(this.checked == true) {
      if(searchParams['p'] == undefined) {
        loadLayer(this.value)
      } else {
        location.href = location.origin+location.pathname+'?d='+this.value;
        // startMapM(this.value)
      }
    } else {
      zapLayer(this.value)
    }
  })
  // TODO: failed attempt to load gaz record in modal
  // ttmap.on('popupopen', function (e) {
  //   console.log(e.popup._source.gazid);
  //   $("#gazframe").attr("src",e.popup._source.gazid)
  //   console.log('gazframe',gazframe)
  //   $(".modal-link").click(function(e){
  //     e.preventDefault()
  //     console.log('clicked a tgaz link',this)
  //   })
  // });
  // // $('#myModal').modal({ show: false})
  // $(".modal-link").click(function(e){
  //   // e.preventDefault()
  //   console.log('clicked a tgaz link',this)
  //   $('#myModal').modal()
  // })
});

window.midpoint = function(ts,type) {
  if(type == 'start') {
    var mid = new Date(ts[0])
  } else if(type == 'mid') {
    let start = new Date(ts[0])
    let end = ts[3] == ('' || undefined) ? new Date(Date.now()) : new Date(ts[3])
    var mid = new Date((start.getTime() + end.getTime()) / 2);
  }
  // console.log(mid)
  return mid
}

window.initTimeline = function(events,project) {
  // console.log('tlMidpoint',tlMidpoint)
  // let sourceFile = 'data/' + file
  // console.log('in initTimeline()', JSON.stringify(events.events[0]))
  window.eventSrc = new Timeline.DefaultEventSource(0);
  // Example of changing the theme from the defaults
  // The default theme is defined in
  // http://simile-widgets.googlecode.com/svn/timeline/tags/latest/src/webapp/api/scripts/themes.js
  var theme = Timeline.ClassicTheme.create();
  theme.event.bubble.width = 350;
  theme.event.bubble.height = 300;

  let cfg = tlConfig[project]
  // let cfg = tlConfig[searchParams['d']]
  // var d = Timeline.DateTime.parseGregorianDateTime("2016-10-01")
  var d = Timeline.DateTime.parseGregorianDateTime(tlMidpoint)
  // DAY, WEEK, MONTH, YEAR, DECADE, CENTURY
  var bandInfos = [
      Timeline.createBandInfo({
          width:          cfg.width1,
          // width:          "75%",
          intervalUnit:   eval('Timeline.DateTime.'+cfg.intUnit1),
          // intervalPixels: 50,
          intervalPixels: cfg.intPixels1,
          eventSource:    eventSrc,
          date:           d,
          theme:          theme,
          layout:         'original'  // original, overview, detailed
      }),
      Timeline.createBandInfo({
          width:          cfg.width2,
          // width:          "25%",
          intervalUnit:   eval('Timeline.DateTime.'+cfg.intUnit2),
          intervalPixels: cfg.intPixels2,
          // intervalPixels: 120,
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

function buildSegmentEvent(feat){
  // console.log(' in buildSegmentEvent()',feat.when.timespan)
  // need validate function here
  // if(validateWhen(place)==true {})
  var event = {};
  event['id'] = feat.properties.segment_id;
  event['title'] = feat.properties.label;
  event['description'] = !feat.properties.description ? "" : feat.properties.description;
  // assuming valid; we know it's there in toy example
  event['start'] = feat.when.timespan[0];
  event['latestStart'] = feat.when.timespan[1] == "" ? "" :feat.when.timespan[1];
  event['earliestEnd'] = feat.when.timespan[2] == "" ? "" :feat.when.timespan[2];
  event['end'] = feat.when.timespan[3] == "" ? "" :feat.when.timespan[3];
  event['durationEvent'] = "true";
  event['link'] = "";
  event['image'] = "";
  // console.log('built ', event)
  return event;
}

function buildCollectionPeriod(coll){
  window.ts = coll.when.timespan
  var event = {};
  event['id'] = 'LinkedPlaces001';
  event['title'] = 'valid period, '+coll.attributes.title;
  event['description'] = ts[4];
  event['start'] = ts[0];
  event['latestStart'] = ts[1] == "" ? "" :ts[1];
  event['earliestEnd'] = ts[2] == "" ? "" :ts[2];
  event['end'] = ts[3] == "" ? "" :ts[3];
  event['durationEvent'] = "true";
  event['link'] = "";
  // event['link'] = coll.attributes.uri;
  event['image'] = "";
  // console.log('event', JSON.stringify(event))
  tlMidpoint = midpoint(ts,'start')
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

function summarizeEvents(eventsObj){
  // get bounds, midpoint, granularity
  // multi-day, -week, -month, -year
  console.log(eventsObj)
}

function writeAbstract(attribs){
  let html = '<p><b>Date</b>: '+attribs.pub_date+'</p>'+
    '<p><b>Contributor(s)</b>: '+attribs.contributors+'<p>'+
    '<p>'+attribs.description+'</p>'
  return html
}

window.zapLayer = function(project) {
  let name_p = "places_"+project
  let name_s = "segments_"+project
  features[name_p].removeFrom(ttmap)
  features[name_s].removeFrom(ttmap)
  // features.places_roundabout.removeFrom(ttmap)
}

function startMapM(dataset=null){
  // mapbox.js (non-gl)
  L.mapbox.accessToken = 'pk.eyJ1Ijoia2dlb2dyYXBoZXIiLCJhIjoiUmVralBPcyJ9.mJegAI1R6KR21x_CVVTlqw';
  // AWMC tiles in mapbox
  window.ttmap = L.mapbox.map('map', 'isawnyu.map-knmctlkh', {attributionControl: false})
  var credits = L.control.attribution().addTo(ttmap);
  credits.addAttribution('Tiles and Data © 2013 AWMC CC-BY-NC 3.0 ')
  // window.ttmap = L.mapbox.map('map') // don't load basemap
  if(dataset != null) {loadLayer(dataset);}
}

window.loadLayer = function(project) {
    // window.location.search = '';
    // empty these arrays to reuse them
    pointFeatures = [];
    lineFeatures = [];
    if(searchParams['p'] != undefined){
      $("#results_inset").html('<p>Dataset: '+searchParams['d']+
        '</p><p>Place:'+searchParams['p']+'</p>')
    }
    $(":checkbox[value="+project+"]").prop("checked","true")
    /*  read a single FeatureCollection of
        Places (geometry.type == Point), and
        Routes (geometry.type == GeometryCollection or undefined)
          - route geometry.geometries[i] == LineString or MultiLineString
    */
    window.idToFeature[project] = {places:{}, segments:{}}
    // window.idToFeature = {places:{}, segments:{}}
    let featureLayer = L.mapbox.featureLayer()
      .loadURL('data/' + project + '.geojson')
      .on('ready', function(){
        // console.log(featureLayer)
        // get Collection attributes
        window.collection = featureLayer._geojson
        $("#data_abstract").html(writeAbstract(collection.attributes))
        $("#data_abstract").append("<a href='data/"+ project +
          ".geojson' target='_blank'>download GeoJSON-T</a>")
        tlMidpoint = midpoint(collection.when.timespan,'mid')

        // build separate L.featureGroup for points & lines
        featureLayer.eachLayer(function(layer){
          let geomF = layer.feature.geometry
          let whenF = layer.feature.when
          /*  feature cases:
              Place if(geomF.type == 'Point')
          */
          // put places features pointFeatures array
          if(geomF.type == 'Point') {
              let latlng = new L.LatLng(geomF.coordinates[1],geomF.coordinates[0])
              var placeFeature = new L.CircleMarker(latlng, {
                color: '#000',
                fillColor: '#ffff00',
                radius: 4,
                fillOpacity: 0.8,
                weight: 1
              })
              // console.log(placeFeature)
              let gazURI = layer.feature.properties.gazetteer_uri

              placeFeature.bindPopup(layer.feature.properties.toponym+
                '<br/><a href="'+gazURI+
                '" target="_blank">'+(project=='courier'?'TGAZ record':
                  project=='vicarello'?'Pleiades record':
                  ['roundabout','xuanzang'].indexOf(project)>-1?'Geonames record':'')+'</a>'
                )

              pointFeatures.push(placeFeature)
              var pid = layer.feature.id
              // console.log('place properties',layer.feature.properties)
              idToFeature[project].places[pid] = placeFeature
          }
          // the rest are routes with segments in a GeometryCollection
          else if(geomF.type == 'GeometryCollection') {
            // console.log('layer.feature', layer.feature)
            //* TODO: create feature for each geometry
            // dataRows = '<table><hr><td>id</td><td>label</td></hr>'
            for(let i in geomF.geometries) {
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
                // console.log('whenObj', whenObj)
                var segment = new L.GeoJSON(feat, {
                    style: mapStyles.segments
                  }).bindPopup('<b>'+feat.properties.label+'</b><br/>(segment '+
                    feat.properties.segment_id+')')

                lineFeatures.push(segment)
                var sid = feat.properties.segment_id
                idToFeature[project].segments[sid] = segment
                // console.log(feat.properties.segment_id,feat.properties.label)
                // dataRows += '<tr><td>'+sid+'</td></tr>'
                //   +'<td>'+feat.properties.label+'</td></tr>'

                //* build event object for timeline
                if (whenObj != ({} || '')) {
                  if (collection.attributes.segmentType == 'journey') {
                    eventsObj.events.push(buildSegmentEvent(feat));
                  }
                }
            }
            if(eventsObj.events.length == 0) {
              // needs a period
              eventsObj.events.push(buildCollectionPeriod(collection))
              // console.log('build',buildCollectionPeriod(collection))
              // console.log('period eventsObj', eventsObj.events[0])
            }
          } else {
            console.log(whenF == undefined ? 'whenF undef' : whenF)
          }
        })
        let name_p = "places_"+project
        let name_s = "segments_"+project
        features[name_s] = L.featureGroup(lineFeatures).addTo(ttmap)
        features[name_p] = L.featureGroup(pointFeatures).addTo(ttmap)
        // user clicked on a place and it's in the url
        console.log('searchParams p',searchParams['p'])
        if(searchParams['p'] != undefined) {
          ttmap.setView(idToFeature[project].places[searchParams['p']].getLatLng(),8)
          idToFeature[project].places[searchParams['p']].openPopup()
        } else {
          ttmap.fitBounds(features[name_p].getBounds())
        }
        initTimeline(eventsObj,project)
      })
}


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
