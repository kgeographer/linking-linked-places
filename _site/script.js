(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

// concatenated map_tt.js, timeline_tt.js
// 3 Nov 2016

$(function () {
  startMap();
});
window.idToFeature = { places: {} };
window.eventsObj = { 'dateTimeFormat': 'iso8601', 'events': [] };

function validateWhen(place) {
  // does Topotime place record have valid when object?

}
function buildEvent(place) {
  // need validate function here
  // if(validateWhen(place)==true {})
  var event = {};
  event['id'] = place.properties.id;
  event['title'] = place.properties.label;
  event['description'] = !place.properties.description ? "" : place.properties.description;
  // assuming valid; we know it's there in toy example
  event['start'] = place.when.timespans[0].start.earliest;
  event['latestStart'] = !place.when.timespans[0].start.latest ? "" : place.when.timespans[0].start.latest;
  event['end'] = place.when.timespans[0].end.latest;
  event['earliestEnd'] = !place.when.timespans[0].end.latest ? "" : place.when.timespans[0].end.latest;
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
};
function startMap() {
  // whassup
  L.mapbox.accessToken = 'pk.eyJ1Ijoia2dlb2dyYXBoZXIiLCJhIjoiUmVralBPcyJ9.mJegAI1R6KR21x_CVVTlqw';
  // AWMC tiles in mapbox
  var ttmap = L.mapbox.map('map', 'isawnyu.map-knmctlkh')
  // .setView([0, 0], 3);
  .setView([50.064191736659104, 15.556640624999998], 4);
  featureLayer = L.mapbox.featureLayer().loadURL('data/polands.tt_feature-when.json').on('ready', function () {
    ttfeats = featureLayer._geojson.features;
    featureLayer.eachLayer(function (layer) {
      // console.log(layer)
      // event = buildEvent(layer.feature);
      // build temporal object and pass to timeline
      eventsObj.events.push(buildEvent(layer.feature));
      idToFeature['places'][layer.feature.properties.id] = layer._leaflet_id;
      layer.setStyle(mapStyles.areas);
      layer.bindPopup(layer.feature.properties.label);
    });
  }).addTo(ttmap);
  console.log('eventsObj', eventsObj);

  var krakow = L.marker([50.0647, 19.9450]).bindPopup("<span style='width:95%;'><b>Kraków</b><br/>lay within several places over time")
  // +"<p style='font-size:.9em;''><b>Name variants</b>: <em>Carcovia,Cracau,Cracaû,Cracovia,Cracovie,Cracow,"+
  // "<br/>Cracòvia,Cracóvia,Gorad Krakau,KRK,Kraka,Krakau</em></p></span>")
  .addTo(ttmap).openPopup();

  initTimeline(eventsObj);
}

var tl;
function initTimeline() {
  // function initTimeline(placedata) {
  var eventSource = new Timeline.DefaultEventSource(0);
  // Example of changing the theme from the defaults
  // The default theme is defined in
  // http://simile-widgets.googlecode.com/svn/timeline/tags/latest/src/webapp/api/scripts/themes.js
  var theme = Timeline.ClassicTheme.create();
  theme.event.bubble.width = 350;
  theme.event.bubble.height = 300;

  var d = Timeline.DateTime.parseGregorianDateTime("1900");
  var bandInfos = [Timeline.createBandInfo({
    width: "75%",
    intervalUnit: Timeline.DateTime.DECADE,
    intervalPixels: 50,
    eventSource: eventSource,
    date: d,
    theme: theme,
    layout: 'original' // original, overview, detailed
  }), Timeline.createBandInfo({
    width: "25%",
    intervalUnit: Timeline.DateTime.CENTURY,
    intervalPixels: 120,
    eventSource: eventSource,
    date: d,
    theme: theme,
    layout: 'overview' // original, overview, detailed
  })];
  bandInfos[1].syncWith = 0;
  bandInfos[1].highlight = true;

  tl = Timeline.create(document.getElementById("tl"), bandInfos, Timeline.HORIZONTAL);
  // Adding the date to the url stops browser caching of data during testing or if
  // the data source is a dynamic query...

  // tl.loadJSON("data/test.tt.json?"+ (new Date().getTime()), function(json, url) {
  //     eventSource.loadJSON(json, url);
  // });

  // tl.loadJSON("data/euro_poland.tl.json?"+ (new Date().getTime()), function(json, url) {
  tl.loadJSON("data/euro_poland.tl.json", function (json, url) {
    eventSource.loadJSON(json, url);
  });

  // tl.loadJSON(placedata);
}

var resizeTimerID = null;

function onResize() {
  if (resizeTimerID == null) {
    resizeTimerID = window.setTimeout(function () {
      resizeTimerID = null;
      tl.layout();
    }, 500);
  }
}

},{}],2:[function(require,module,exports){
'use strict';

$(function () {
  startMap();
});

function startMap() {
  L.mapbox.accessToken = 'pk.eyJ1Ijoia2dlb2dyYXBoZXIiLCJhIjoiUmVralBPcyJ9.mJegAI1R6KR21x_CVVTlqw';
  // AWMC tiles in mapbox
  var map = L.mapbox.map('map', 'isawnyu.map-knmctlkh')
  // .setView([0, 0], 3);
  .setView([22.105998799750576, 25.576171875], 3); //
}

},{}],3:[function(require,module,exports){
'use strict';

$(function () {
  startMap();
});
window.idToFeature = { places: {} };
window.eventsObj = { 'dateTimeFormat': 'iso8601', 'events': [] };

function validateWhen(place) {
  // does Topotime place record have valid when object?

}
function buildEvent(place) {
  // need validate function here
  // if(validateWhen(place)==true {})
  var event = {};
  event['id'] = place.properties.id;
  event['title'] = place.properties.label;
  event['description'] = !place.properties.description ? "" : place.properties.description;
  // assuming valid; we know it's there in toy example
  event['start'] = place.when.timespans[0].start.earliest;
  event['latestStart'] = !place.when.timespans[0].start.latest ? "" : place.when.timespans[0].start.latest;
  event['end'] = place.when.timespans[0].end.latest;
  event['earliestEnd'] = !place.when.timespans[0].end.latest ? "" : place.when.timespans[0].end.latest;
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
};
function startMap() {
  L.mapbox.accessToken = 'pk.eyJ1Ijoia2dlb2dyYXBoZXIiLCJhIjoiUmVralBPcyJ9.mJegAI1R6KR21x_CVVTlqw';
  // AWMC tiles in mapbox
  ttmap = L.mapbox.map('map', 'isawnyu.map-knmctlkh')
  // .setView([0, 0], 3);
  .setView([50.064191736659104, 15.556640624999998], 4);
  featureLayer = L.mapbox.featureLayer().loadURL('data/polands.tt_feature-when.json').on('ready', function () {
    ttfeats = featureLayer._geojson.features;
    featureLayer.eachLayer(function (layer) {
      // console.log(layer)
      // event = buildEvent(layer.feature);
      // build temporal object and pass to timeline
      eventsObj.events.push(buildEvent(layer.feature));
      idToFeature['places'][layer.feature.properties.id] = layer._leaflet_id;
      layer.setStyle(mapStyles.areas);
      layer.bindPopup(layer.feature.properties.label);
    });
  }).addTo(ttmap);
  console.log('eventsObj', eventsObj);

  var krakow = L.marker([50.0647, 19.9450]).bindPopup("<span style='width:95%;'><b>Kraków</b><br/>lay within several places over time")
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

},{}],4:[function(require,module,exports){
"use strict";

var tl;
function initTimeline() {
    // function initTimeline(placedata) {
    var eventSource = new Timeline.DefaultEventSource(0);
    // Example of changing the theme from the defaults
    // The default theme is defined in
    // http://simile-widgets.googlecode.com/svn/timeline/tags/latest/src/webapp/api/scripts/themes.js
    var theme = Timeline.ClassicTheme.create();
    theme.event.bubble.width = 350;
    theme.event.bubble.height = 300;

    var d = Timeline.DateTime.parseGregorianDateTime("1900");
    var bandInfos = [Timeline.createBandInfo({
        width: "75%",
        intervalUnit: Timeline.DateTime.DECADE,
        intervalPixels: 50,
        eventSource: eventSource,
        date: d,
        theme: theme,
        layout: 'original' // original, overview, detailed
    }), Timeline.createBandInfo({
        width: "25%",
        intervalUnit: Timeline.DateTime.CENTURY,
        intervalPixels: 120,
        eventSource: eventSource,
        date: d,
        theme: theme,
        layout: 'overview' // original, overview, detailed
    })];
    bandInfos[1].syncWith = 0;
    bandInfos[1].highlight = true;

    tl = Timeline.create(document.getElementById("tl"), bandInfos, Timeline.HORIZONTAL);
    // Adding the date to the url stops browser caching of data during testing or if
    // the data source is a dynamic query...

    // tl.loadJSON("data/test.tt.json?"+ (new Date().getTime()), function(json, url) {
    //     eventSource.loadJSON(json, url);
    // });

    // tl.loadJSON("data/euro_poland.tl.json?"+ (new Date().getTime()), function(json, url) {
    tl.loadJSON("data/euro_poland.tl.json", function (json, url) {
        eventSource.loadJSON(json, url);
    });

    // tl.loadJSON(placedata);
}

var resizeTimerID = null;

function onResize() {
    if (resizeTimerID == null) {
        resizeTimerID = window.setTimeout(function () {
            resizeTimerID = null;
            tl.layout();
        }, 500);
    }
}

},{}],5:[function(require,module,exports){
"use strict";

// $(function() {
// startMap();
// });

var tl;
function onLoad() {
    var eventSource = new Timeline.DefaultEventSource();
    var bandInfos = [Timeline.createBandInfo({
        width: "70%",
        intervalUnit: Timeline.DateTime.MONTH,
        intervalPixels: 100
    }), Timeline.createBandInfo({
        width: "30%",
        intervalUnit: Timeline.DateTime.YEAR,
        intervalPixels: 200
    })];
    bandInfos[1].syncWith = 0;
    bandInfos[1].highlight = true;

    tl = Timeline.create(document.getElementById("timeline"), bandInfos);
    Timeline.loadXML("data/monet.xml", function (xml, url) {
        eventSource.loadXML(xml, url);
    });
}
var resizeTimerID = null;
function onResize() {
    if (resizeTimerID == null) {
        resizeTimerID = window.setTimeout(function () {
            resizeTimerID = null;
            tl.layout();
        }, 500);
    }
}

function startMap() {
    console.log('starting a damned map');
    L.mapbox.accessToken = 'pk.eyJ1Ijoia2dlb2dyYXBoZXIiLCJhIjoiUmVralBPcyJ9.mJegAI1R6KR21x_CVVTlqw';
    // AWMC tiles in mapbox
    var map = L.mapbox.map('map', 'isawnyu.map-knmctlkh')
    // .setView([0, 0], 3);
    .setView([22.105998799750576, 25.576171875], 3); //
}

},{}]},{},[1,3,2,4,5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvamF2YXNjcmlwdHMvaW5kZXguanMiLCJzcmMvamF2YXNjcmlwdHMvbWFwLmpzIiwic3JjL2phdmFzY3JpcHRzL21hcF90dC5qcyIsInNyYy9qYXZhc2NyaXB0cy90aW1lbGluZV90dC5qcyIsInNyYy9qYXZhc2NyaXB0cy90b3BvdGltZS1tYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBO0FBQ0E7O0FBRUEsRUFBRSxZQUFXO0FBQ1g7QUFDRCxDQUZEO0FBR0EsT0FBTyxXQUFQLEdBQXFCLEVBQUMsUUFBTyxFQUFSLEVBQXJCO0FBQ0EsT0FBTyxTQUFQLEdBQW1CLEVBQUMsa0JBQWtCLFNBQW5CLEVBQTZCLFVBQVMsRUFBdEMsRUFBbkI7O0FBRUEsU0FBUyxZQUFULENBQXNCLEtBQXRCLEVBQTRCO0FBQzFCOztBQUVEO0FBQ0QsU0FBUyxVQUFULENBQW9CLEtBQXBCLEVBQTBCO0FBQ3hCO0FBQ0E7QUFDQSxNQUFJLFFBQVEsRUFBWjtBQUNBLFFBQU0sSUFBTixJQUFjLE1BQU0sVUFBTixDQUFpQixFQUEvQjtBQUNBLFFBQU0sT0FBTixJQUFpQixNQUFNLFVBQU4sQ0FBaUIsS0FBbEM7QUFDQSxRQUFNLGFBQU4sSUFBdUIsQ0FBQyxNQUFNLFVBQU4sQ0FBaUIsV0FBbEIsR0FBZ0MsRUFBaEMsR0FBcUMsTUFBTSxVQUFOLENBQWlCLFdBQTdFO0FBQ0E7QUFDQSxRQUFNLE9BQU4sSUFBaUIsTUFBTSxJQUFOLENBQVcsU0FBWCxDQUFxQixDQUFyQixFQUF3QixLQUF4QixDQUE4QixRQUEvQztBQUNBLFFBQU0sYUFBTixJQUF1QixDQUFDLE1BQU0sSUFBTixDQUFXLFNBQVgsQ0FBcUIsQ0FBckIsRUFBd0IsS0FBeEIsQ0FBOEIsTUFBL0IsR0FBd0MsRUFBeEMsR0FBNEMsTUFBTSxJQUFOLENBQVcsU0FBWCxDQUFxQixDQUFyQixFQUF3QixLQUF4QixDQUE4QixNQUFqRztBQUNBLFFBQU0sS0FBTixJQUFlLE1BQU0sSUFBTixDQUFXLFNBQVgsQ0FBcUIsQ0FBckIsRUFBd0IsR0FBeEIsQ0FBNEIsTUFBM0M7QUFDQSxRQUFNLGFBQU4sSUFBdUIsQ0FBQyxNQUFNLElBQU4sQ0FBVyxTQUFYLENBQXFCLENBQXJCLEVBQXdCLEdBQXhCLENBQTRCLE1BQTdCLEdBQXNDLEVBQXRDLEdBQTBDLE1BQU0sSUFBTixDQUFXLFNBQVgsQ0FBcUIsQ0FBckIsRUFBd0IsR0FBeEIsQ0FBNEIsTUFBN0Y7QUFDQSxRQUFNLGVBQU4sSUFBeUIsRUFBekI7QUFDQSxRQUFNLE1BQU4sSUFBZ0IsRUFBaEI7QUFDQSxRQUFNLE9BQU4sSUFBaUIsRUFBakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFPLEtBQVA7QUFDQTtBQUNEO0FBQ0QsSUFBSSxZQUFZO0FBQ2QsU0FBTztBQUNILGFBQVMsU0FETjtBQUVILGNBQVUsQ0FGUDtBQUdILGVBQVcsRUFIUjtBQUlILGlCQUFhLFFBSlY7QUFLSCxtQkFBZTtBQUxaO0FBRE8sQ0FBaEI7QUFTQSxTQUFTLFFBQVQsR0FBbUI7QUFDakI7QUFDQSxJQUFFLE1BQUYsQ0FBUyxXQUFULEdBQXVCLHdFQUF2QjtBQUNBO0FBQ0EsTUFBSSxRQUFRLEVBQUUsTUFBRixDQUFTLEdBQVQsQ0FBYSxLQUFiLEVBQW9CLHNCQUFwQjtBQUNSO0FBRFEsR0FFUCxPQUZPLENBRUMsQ0FBQyxrQkFBRCxFQUFxQixrQkFBckIsQ0FGRCxFQUUyQyxDQUYzQyxDQUFaO0FBR0EsaUJBQWUsRUFBRSxNQUFGLENBQVMsWUFBVCxHQUNaLE9BRFksQ0FDSixtQ0FESSxFQUVaLEVBRlksQ0FFVCxPQUZTLEVBRUEsWUFBVTtBQUNyQixjQUFVLGFBQWEsUUFBYixDQUFzQixRQUFoQztBQUNBLGlCQUFhLFNBQWIsQ0FBdUIsVUFBUyxLQUFULEVBQWU7QUFDcEM7QUFDQTtBQUNBO0FBQ0EsZ0JBQVUsTUFBVixDQUFpQixJQUFqQixDQUFzQixXQUFXLE1BQU0sT0FBakIsQ0FBdEI7QUFDQSxrQkFBWSxRQUFaLEVBQXNCLE1BQU0sT0FBTixDQUFjLFVBQWQsQ0FBeUIsRUFBL0MsSUFBcUQsTUFBTSxXQUEzRDtBQUNBLFlBQU0sUUFBTixDQUFlLFVBQVUsS0FBekI7QUFDQSxZQUFNLFNBQU4sQ0FBZ0IsTUFBTSxPQUFOLENBQWMsVUFBZCxDQUF5QixLQUF6QztBQUNELEtBUkQ7QUFTRCxHQWJZLEVBY1osS0FkWSxDQWNOLEtBZE0sQ0FBZjtBQWVBLFVBQVEsR0FBUixDQUFZLFdBQVosRUFBd0IsU0FBeEI7O0FBRUEsTUFBSSxTQUFTLEVBQUUsTUFBRixDQUFTLENBQUMsT0FBRCxFQUFVLE9BQVYsQ0FBVCxFQUNWLFNBRFUsQ0FDQSxnRkFEQTtBQUVYO0FBQ0E7QUFIVyxHQUlWLEtBSlUsQ0FJSixLQUpJLEVBSUcsU0FKSCxFQUFiOztBQU1BLGVBQWEsU0FBYjtBQUNEOztBQUVELElBQUksRUFBSjtBQUNBLFNBQVMsWUFBVCxHQUF3QjtBQUN4QjtBQUNFLE1BQUksY0FBYyxJQUFJLFNBQVMsa0JBQWIsQ0FBZ0MsQ0FBaEMsQ0FBbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFJLFFBQVEsU0FBUyxZQUFULENBQXNCLE1BQXRCLEVBQVo7QUFDQSxRQUFNLEtBQU4sQ0FBWSxNQUFaLENBQW1CLEtBQW5CLEdBQTJCLEdBQTNCO0FBQ0EsUUFBTSxLQUFOLENBQVksTUFBWixDQUFtQixNQUFuQixHQUE0QixHQUE1Qjs7QUFFQSxNQUFJLElBQUksU0FBUyxRQUFULENBQWtCLHNCQUFsQixDQUF5QyxNQUF6QyxDQUFSO0FBQ0EsTUFBSSxZQUFZLENBQ1osU0FBUyxjQUFULENBQXdCO0FBQ3BCLFdBQWdCLEtBREk7QUFFcEIsa0JBQWdCLFNBQVMsUUFBVCxDQUFrQixNQUZkO0FBR3BCLG9CQUFnQixFQUhJO0FBSXBCLGlCQUFnQixXQUpJO0FBS3BCLFVBQWdCLENBTEk7QUFNcEIsV0FBZ0IsS0FOSTtBQU9wQixZQUFnQixVQVBJLENBT1E7QUFQUixHQUF4QixDQURZLEVBVVosU0FBUyxjQUFULENBQXdCO0FBQ3BCLFdBQWdCLEtBREk7QUFFcEIsa0JBQWdCLFNBQVMsUUFBVCxDQUFrQixPQUZkO0FBR3BCLG9CQUFnQixHQUhJO0FBSXBCLGlCQUFnQixXQUpJO0FBS3BCLFVBQWdCLENBTEk7QUFNcEIsV0FBZ0IsS0FOSTtBQU9wQixZQUFnQixVQVBJLENBT1E7QUFQUixHQUF4QixDQVZZLENBQWhCO0FBb0JBLFlBQVUsQ0FBVixFQUFhLFFBQWIsR0FBd0IsQ0FBeEI7QUFDQSxZQUFVLENBQVYsRUFBYSxTQUFiLEdBQXlCLElBQXpCOztBQUVBLE9BQUssU0FBUyxNQUFULENBQWdCLFNBQVMsY0FBVCxDQUF3QixJQUF4QixDQUFoQixFQUErQyxTQUEvQyxFQUEwRCxTQUFTLFVBQW5FLENBQUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUcsUUFBSCxDQUFZLDBCQUFaLEVBQXdDLFVBQVMsSUFBVCxFQUFlLEdBQWYsRUFBb0I7QUFDeEQsZ0JBQVksUUFBWixDQUFxQixJQUFyQixFQUEyQixHQUEzQjtBQUNILEdBRkQ7O0FBSUE7QUFFRDs7QUFFRCxJQUFJLGdCQUFnQixJQUFwQjs7QUFFQSxTQUFTLFFBQVQsR0FBb0I7QUFDaEIsTUFBSSxpQkFBaUIsSUFBckIsRUFBMkI7QUFDdkIsb0JBQWdCLE9BQU8sVUFBUCxDQUFrQixZQUFXO0FBQ3pDLHNCQUFnQixJQUFoQjtBQUNBLFNBQUcsTUFBSDtBQUNILEtBSGUsRUFHYixHQUhhLENBQWhCO0FBSUg7QUFDSjs7Ozs7QUM1SUQsRUFBRSxZQUFXO0FBQ1g7QUFDRCxDQUZEOztBQUlBLFNBQVMsUUFBVCxHQUFtQjtBQUNqQixJQUFFLE1BQUYsQ0FBUyxXQUFULEdBQXVCLHdFQUF2QjtBQUNBO0FBQ0EsTUFBSSxNQUFNLEVBQUUsTUFBRixDQUFTLEdBQVQsQ0FBYSxLQUFiLEVBQW9CLHNCQUFwQjtBQUNOO0FBRE0sR0FFTCxPQUZLLENBRUcsQ0FBQyxrQkFBRCxFQUFxQixZQUFyQixDQUZILEVBRXVDLENBRnZDLENBQVYsQ0FIaUIsQ0FLb0M7QUFFdEQ7Ozs7O0FDVkQsRUFBRSxZQUFXO0FBQ1g7QUFDRCxDQUZEO0FBR0EsT0FBTyxXQUFQLEdBQXFCLEVBQUMsUUFBTyxFQUFSLEVBQXJCO0FBQ0EsT0FBTyxTQUFQLEdBQW1CLEVBQUMsa0JBQWtCLFNBQW5CLEVBQTZCLFVBQVMsRUFBdEMsRUFBbkI7O0FBRUEsU0FBUyxZQUFULENBQXNCLEtBQXRCLEVBQTRCO0FBQzFCOztBQUVEO0FBQ0QsU0FBUyxVQUFULENBQW9CLEtBQXBCLEVBQTBCO0FBQ3hCO0FBQ0E7QUFDQSxNQUFJLFFBQVEsRUFBWjtBQUNBLFFBQU0sSUFBTixJQUFjLE1BQU0sVUFBTixDQUFpQixFQUEvQjtBQUNBLFFBQU0sT0FBTixJQUFpQixNQUFNLFVBQU4sQ0FBaUIsS0FBbEM7QUFDQSxRQUFNLGFBQU4sSUFBdUIsQ0FBQyxNQUFNLFVBQU4sQ0FBaUIsV0FBbEIsR0FBZ0MsRUFBaEMsR0FBcUMsTUFBTSxVQUFOLENBQWlCLFdBQTdFO0FBQ0E7QUFDQSxRQUFNLE9BQU4sSUFBaUIsTUFBTSxJQUFOLENBQVcsU0FBWCxDQUFxQixDQUFyQixFQUF3QixLQUF4QixDQUE4QixRQUEvQztBQUNBLFFBQU0sYUFBTixJQUF1QixDQUFDLE1BQU0sSUFBTixDQUFXLFNBQVgsQ0FBcUIsQ0FBckIsRUFBd0IsS0FBeEIsQ0FBOEIsTUFBL0IsR0FBd0MsRUFBeEMsR0FBNEMsTUFBTSxJQUFOLENBQVcsU0FBWCxDQUFxQixDQUFyQixFQUF3QixLQUF4QixDQUE4QixNQUFqRztBQUNBLFFBQU0sS0FBTixJQUFlLE1BQU0sSUFBTixDQUFXLFNBQVgsQ0FBcUIsQ0FBckIsRUFBd0IsR0FBeEIsQ0FBNEIsTUFBM0M7QUFDQSxRQUFNLGFBQU4sSUFBdUIsQ0FBQyxNQUFNLElBQU4sQ0FBVyxTQUFYLENBQXFCLENBQXJCLEVBQXdCLEdBQXhCLENBQTRCLE1BQTdCLEdBQXNDLEVBQXRDLEdBQTBDLE1BQU0sSUFBTixDQUFXLFNBQVgsQ0FBcUIsQ0FBckIsRUFBd0IsR0FBeEIsQ0FBNEIsTUFBN0Y7QUFDQSxRQUFNLGVBQU4sSUFBeUIsRUFBekI7QUFDQSxRQUFNLE1BQU4sSUFBZ0IsRUFBaEI7QUFDQSxRQUFNLE9BQU4sSUFBaUIsRUFBakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFPLEtBQVA7QUFDQTtBQUNEO0FBQ0QsSUFBSSxZQUFZO0FBQ2QsU0FBTztBQUNILGFBQVMsU0FETjtBQUVILGNBQVUsQ0FGUDtBQUdILGVBQVcsRUFIUjtBQUlILGlCQUFhLFFBSlY7QUFLSCxtQkFBZTtBQUxaO0FBRE8sQ0FBaEI7QUFTQSxTQUFTLFFBQVQsR0FBbUI7QUFDakIsSUFBRSxNQUFGLENBQVMsV0FBVCxHQUF1Qix3RUFBdkI7QUFDQTtBQUNBLFVBQVEsRUFBRSxNQUFGLENBQVMsR0FBVCxDQUFhLEtBQWIsRUFBb0Isc0JBQXBCO0FBQ0o7QUFESSxHQUVILE9BRkcsQ0FFSyxDQUFDLGtCQUFELEVBQXFCLGtCQUFyQixDQUZMLEVBRStDLENBRi9DLENBQVI7QUFHQSxpQkFBZSxFQUFFLE1BQUYsQ0FBUyxZQUFULEdBQ1osT0FEWSxDQUNKLG1DQURJLEVBRVosRUFGWSxDQUVULE9BRlMsRUFFQSxZQUFVO0FBQ3JCLGNBQVUsYUFBYSxRQUFiLENBQXNCLFFBQWhDO0FBQ0EsaUJBQWEsU0FBYixDQUF1QixVQUFTLEtBQVQsRUFBZTtBQUNwQztBQUNBO0FBQ0E7QUFDQSxnQkFBVSxNQUFWLENBQWlCLElBQWpCLENBQXNCLFdBQVcsTUFBTSxPQUFqQixDQUF0QjtBQUNBLGtCQUFZLFFBQVosRUFBc0IsTUFBTSxPQUFOLENBQWMsVUFBZCxDQUF5QixFQUEvQyxJQUFxRCxNQUFNLFdBQTNEO0FBQ0EsWUFBTSxRQUFOLENBQWUsVUFBVSxLQUF6QjtBQUNBLFlBQU0sU0FBTixDQUFnQixNQUFNLE9BQU4sQ0FBYyxVQUFkLENBQXlCLEtBQXpDO0FBQ0QsS0FSRDtBQVNELEdBYlksRUFjWixLQWRZLENBY04sS0FkTSxDQUFmO0FBZUEsVUFBUSxHQUFSLENBQVksV0FBWixFQUF3QixTQUF4Qjs7QUFFQSxNQUFJLFNBQVMsRUFBRSxNQUFGLENBQVMsQ0FBQyxPQUFELEVBQVUsT0FBVixDQUFULEVBQ1YsU0FEVSxDQUNBLGdGQURBO0FBRVg7QUFDQTtBQUhXLEdBSVYsS0FKVSxDQUlKLEtBSkksRUFJRyxTQUpILEVBQWI7O0FBTUEsZUFBYSxTQUFiO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDN0ZBLElBQUksRUFBSjtBQUNBLFNBQVMsWUFBVCxHQUF3QjtBQUN4QjtBQUNFLFFBQUksY0FBYyxJQUFJLFNBQVMsa0JBQWIsQ0FBZ0MsQ0FBaEMsQ0FBbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFJLFFBQVEsU0FBUyxZQUFULENBQXNCLE1BQXRCLEVBQVo7QUFDQSxVQUFNLEtBQU4sQ0FBWSxNQUFaLENBQW1CLEtBQW5CLEdBQTJCLEdBQTNCO0FBQ0EsVUFBTSxLQUFOLENBQVksTUFBWixDQUFtQixNQUFuQixHQUE0QixHQUE1Qjs7QUFFQSxRQUFJLElBQUksU0FBUyxRQUFULENBQWtCLHNCQUFsQixDQUF5QyxNQUF6QyxDQUFSO0FBQ0EsUUFBSSxZQUFZLENBQ1osU0FBUyxjQUFULENBQXdCO0FBQ3BCLGVBQWdCLEtBREk7QUFFcEIsc0JBQWdCLFNBQVMsUUFBVCxDQUFrQixNQUZkO0FBR3BCLHdCQUFnQixFQUhJO0FBSXBCLHFCQUFnQixXQUpJO0FBS3BCLGNBQWdCLENBTEk7QUFNcEIsZUFBZ0IsS0FOSTtBQU9wQixnQkFBZ0IsVUFQSSxDQU9RO0FBUFIsS0FBeEIsQ0FEWSxFQVVaLFNBQVMsY0FBVCxDQUF3QjtBQUNwQixlQUFnQixLQURJO0FBRXBCLHNCQUFnQixTQUFTLFFBQVQsQ0FBa0IsT0FGZDtBQUdwQix3QkFBZ0IsR0FISTtBQUlwQixxQkFBZ0IsV0FKSTtBQUtwQixjQUFnQixDQUxJO0FBTXBCLGVBQWdCLEtBTkk7QUFPcEIsZ0JBQWdCLFVBUEksQ0FPUTtBQVBSLEtBQXhCLENBVlksQ0FBaEI7QUFvQkEsY0FBVSxDQUFWLEVBQWEsUUFBYixHQUF3QixDQUF4QjtBQUNBLGNBQVUsQ0FBVixFQUFhLFNBQWIsR0FBeUIsSUFBekI7O0FBRUEsU0FBSyxTQUFTLE1BQVQsQ0FBZ0IsU0FBUyxjQUFULENBQXdCLElBQXhCLENBQWhCLEVBQStDLFNBQS9DLEVBQTBELFNBQVMsVUFBbkUsQ0FBTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsT0FBRyxRQUFILENBQVksMEJBQVosRUFBd0MsVUFBUyxJQUFULEVBQWUsR0FBZixFQUFvQjtBQUN4RCxvQkFBWSxRQUFaLENBQXFCLElBQXJCLEVBQTJCLEdBQTNCO0FBQ0gsS0FGRDs7QUFJQTtBQUVEOztBQUVELElBQUksZ0JBQWdCLElBQXBCOztBQUVBLFNBQVMsUUFBVCxHQUFvQjtBQUNoQixRQUFJLGlCQUFpQixJQUFyQixFQUEyQjtBQUN2Qix3QkFBZ0IsT0FBTyxVQUFQLENBQWtCLFlBQVc7QUFDekMsNEJBQWdCLElBQWhCO0FBQ0EsZUFBRyxNQUFIO0FBQ0gsU0FIZSxFQUdiLEdBSGEsQ0FBaEI7QUFJSDtBQUNKOzs7OztBQzdERDtBQUNFO0FBQ0Y7O0FBRUEsSUFBSSxFQUFKO0FBQ0EsU0FBUyxNQUFULEdBQWtCO0FBQ2hCLFFBQUksY0FBYyxJQUFJLFNBQVMsa0JBQWIsRUFBbEI7QUFDQSxRQUFJLFlBQVksQ0FDZCxTQUFTLGNBQVQsQ0FBd0I7QUFDcEIsZUFBZ0IsS0FESTtBQUVwQixzQkFBZ0IsU0FBUyxRQUFULENBQWtCLEtBRmQ7QUFHcEIsd0JBQWdCO0FBSEksS0FBeEIsQ0FEYyxFQU1kLFNBQVMsY0FBVCxDQUF3QjtBQUNwQixlQUFnQixLQURJO0FBRXBCLHNCQUFnQixTQUFTLFFBQVQsQ0FBa0IsSUFGZDtBQUdwQix3QkFBZ0I7QUFISSxLQUF4QixDQU5jLENBQWhCO0FBWUEsY0FBVSxDQUFWLEVBQWEsUUFBYixHQUF3QixDQUF4QjtBQUNBLGNBQVUsQ0FBVixFQUFhLFNBQWIsR0FBeUIsSUFBekI7O0FBRUEsU0FBSyxTQUFTLE1BQVQsQ0FBZ0IsU0FBUyxjQUFULENBQXdCLFVBQXhCLENBQWhCLEVBQXFELFNBQXJELENBQUw7QUFDQSxhQUFTLE9BQVQsQ0FBaUIsZ0JBQWpCLEVBQW1DLFVBQVMsR0FBVCxFQUFjLEdBQWQsRUFBbUI7QUFBRSxvQkFBWSxPQUFaLENBQW9CLEdBQXBCLEVBQXlCLEdBQXpCO0FBQWdDLEtBQXhGO0FBQ0Q7QUFDRCxJQUFJLGdCQUFnQixJQUFwQjtBQUNBLFNBQVMsUUFBVCxHQUFvQjtBQUNoQixRQUFJLGlCQUFpQixJQUFyQixFQUEyQjtBQUN2Qix3QkFBZ0IsT0FBTyxVQUFQLENBQWtCLFlBQVc7QUFDekMsNEJBQWdCLElBQWhCO0FBQ0EsZUFBRyxNQUFIO0FBQ0gsU0FIZSxFQUdiLEdBSGEsQ0FBaEI7QUFJSDtBQUNKOztBQUVELFNBQVMsUUFBVCxHQUFtQjtBQUNqQixZQUFRLEdBQVIsQ0FBWSx1QkFBWjtBQUNBLE1BQUUsTUFBRixDQUFTLFdBQVQsR0FBdUIsd0VBQXZCO0FBQ0E7QUFDQSxRQUFJLE1BQU0sRUFBRSxNQUFGLENBQVMsR0FBVCxDQUFhLEtBQWIsRUFBb0Isc0JBQXBCO0FBQ047QUFETSxLQUVMLE9BRkssQ0FFRyxDQUFDLGtCQUFELEVBQXFCLFlBQXJCLENBRkgsRUFFdUMsQ0FGdkMsQ0FBVixDQUppQixDQU1vQztBQUV0RCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBjb25jYXRlbmF0ZWQgbWFwX3R0LmpzLCB0aW1lbGluZV90dC5qc1xuLy8gMyBOb3YgMjAxNlxuXG4kKGZ1bmN0aW9uKCkge1xuICBzdGFydE1hcCgpO1xufSk7XG53aW5kb3cuaWRUb0ZlYXR1cmUgPSB7cGxhY2VzOnt9fVxud2luZG93LmV2ZW50c09iaiA9IHsnZGF0ZVRpbWVGb3JtYXQnOiAnaXNvODYwMScsJ2V2ZW50cyc6WyBdfTtcblxuZnVuY3Rpb24gdmFsaWRhdGVXaGVuKHBsYWNlKXtcbiAgLy8gZG9lcyBUb3BvdGltZSBwbGFjZSByZWNvcmQgaGF2ZSB2YWxpZCB3aGVuIG9iamVjdD9cblxufVxuZnVuY3Rpb24gYnVpbGRFdmVudChwbGFjZSl7XG4gIC8vIG5lZWQgdmFsaWRhdGUgZnVuY3Rpb24gaGVyZVxuICAvLyBpZih2YWxpZGF0ZVdoZW4ocGxhY2UpPT10cnVlIHt9KVxuICB2YXIgZXZlbnQgPSB7fTtcbiAgZXZlbnRbJ2lkJ10gPSBwbGFjZS5wcm9wZXJ0aWVzLmlkO1xuICBldmVudFsndGl0bGUnXSA9IHBsYWNlLnByb3BlcnRpZXMubGFiZWw7XG4gIGV2ZW50WydkZXNjcmlwdGlvbiddID0gIXBsYWNlLnByb3BlcnRpZXMuZGVzY3JpcHRpb24gPyBcIlwiIDogcGxhY2UucHJvcGVydGllcy5kZXNjcmlwdGlvbjtcbiAgLy8gYXNzdW1pbmcgdmFsaWQ7IHdlIGtub3cgaXQncyB0aGVyZSBpbiB0b3kgZXhhbXBsZVxuICBldmVudFsnc3RhcnQnXSA9IHBsYWNlLndoZW4udGltZXNwYW5zWzBdLnN0YXJ0LmVhcmxpZXN0O1xuICBldmVudFsnbGF0ZXN0U3RhcnQnXSA9ICFwbGFjZS53aGVuLnRpbWVzcGFuc1swXS5zdGFydC5sYXRlc3QgPyBcIlwiIDpwbGFjZS53aGVuLnRpbWVzcGFuc1swXS5zdGFydC5sYXRlc3Q7XG4gIGV2ZW50WydlbmQnXSA9IHBsYWNlLndoZW4udGltZXNwYW5zWzBdLmVuZC5sYXRlc3Q7XG4gIGV2ZW50WydlYXJsaWVzdEVuZCddID0gIXBsYWNlLndoZW4udGltZXNwYW5zWzBdLmVuZC5sYXRlc3QgPyBcIlwiIDpwbGFjZS53aGVuLnRpbWVzcGFuc1swXS5lbmQubGF0ZXN0O1xuICBldmVudFsnZHVyYXRpb25FdmVudCddID0gXCJcIjtcbiAgZXZlbnRbJ2xpbmsnXSA9IFwiXCI7XG4gIGV2ZW50WydpbWFnZSddID0gXCJcIjtcbiAgLy8gZXZlbnRbJ2R1cmF0aW9uRXZlbnQnXSA9IHBsYWNlLndoZW4udGltZXNwYW5zWzBdLmR1cmluZztcbiAgLy8gICAgIHsnc3RhcnQnOiAnMTkwMCcsICdsYXRlc3RTdGFydCc6ICcxOTAxJywgJ2VhcmxpZXN0RW5kJzogJzE5MDMnLCAnZW5kJzogJzE5MDInLFxuICAvLyAgICAgJ3RpdGxlJzogJ1Rlc3QgNmc6IEJhZCBkYXRlczogZWFybGllc3RFbmQgPiBlbmQnLFxuICAvLyAgICAgJ2Rlc2NyaXB0aW9uJzogJ1Rlc3QgNmc6IEJhZCBkYXRlczogZWFybGllc3RFbmQgPiBlbmQnLFxuICAvLyAgICAgJ2R1cmF0aW9uRXZlbnQnOiB0cnVlLCAnaW1hZ2UnOic8dXJsPicsICdsaW5rJzonPHVybD4nXG4gIC8vICAgICB9LFxuICByZXR1cm4gZXZlbnQ7XG4gIC8vIGNvbnNvbGUubG9nKCdnb3QgcGxhY2UsJytwbGFjZSsnLCBidWlsZGluZyBldmVudCcpXG59XG52YXIgbWFwU3R5bGVzID0ge1xuICBhcmVhczoge1xuICAgICAgXCJjb2xvclwiOiBcIiM5OTMzMzNcIixcbiAgICAgIFwid2VpZ2h0XCI6IDEsXG4gICAgICBcIm9wYWNpdHlcIjogLjgsXG4gICAgICBcImZpbGxDb2xvclwiOiBcIm9yYW5nZVwiLFxuICAgICAgXCJmaWxsT3BhY2l0eVwiOiAwLjNcbiAgICB9XG4gIH1cbmZ1bmN0aW9uIHN0YXJ0TWFwKCl7XG4gIC8vIHdoYXNzdXBcbiAgTC5tYXBib3guYWNjZXNzVG9rZW4gPSAncGsuZXlKMUlqb2lhMmRsYjJkeVlYQm9aWElpTENKaElqb2lVbVZyYWxCUGN5SjkubUplZ0FJMVI2S1IyMXhfQ1ZWVGxxdyc7XG4gIC8vIEFXTUMgdGlsZXMgaW4gbWFwYm94XG4gIGxldCB0dG1hcCA9IEwubWFwYm94Lm1hcCgnbWFwJywgJ2lzYXdueXUubWFwLWtubWN0bGtoJylcbiAgICAgIC8vIC5zZXRWaWV3KFswLCAwXSwgMyk7XG4gICAgICAuc2V0VmlldyhbNTAuMDY0MTkxNzM2NjU5MTA0LCAxNS41NTY2NDA2MjQ5OTk5OThdLCA0KTtcbiAgZmVhdHVyZUxheWVyID0gTC5tYXBib3guZmVhdHVyZUxheWVyKClcbiAgICAubG9hZFVSTCgnZGF0YS9wb2xhbmRzLnR0X2ZlYXR1cmUtd2hlbi5qc29uJylcbiAgICAub24oJ3JlYWR5JywgZnVuY3Rpb24oKXtcbiAgICAgIHR0ZmVhdHMgPSBmZWF0dXJlTGF5ZXIuX2dlb2pzb24uZmVhdHVyZXM7XG4gICAgICBmZWF0dXJlTGF5ZXIuZWFjaExheWVyKGZ1bmN0aW9uKGxheWVyKXtcbiAgICAgICAgLy8gY29uc29sZS5sb2cobGF5ZXIpXG4gICAgICAgIC8vIGV2ZW50ID0gYnVpbGRFdmVudChsYXllci5mZWF0dXJlKTtcbiAgICAgICAgLy8gYnVpbGQgdGVtcG9yYWwgb2JqZWN0IGFuZCBwYXNzIHRvIHRpbWVsaW5lXG4gICAgICAgIGV2ZW50c09iai5ldmVudHMucHVzaChidWlsZEV2ZW50KGxheWVyLmZlYXR1cmUpKTtcbiAgICAgICAgaWRUb0ZlYXR1cmVbJ3BsYWNlcyddW2xheWVyLmZlYXR1cmUucHJvcGVydGllcy5pZF0gPSBsYXllci5fbGVhZmxldF9pZDtcbiAgICAgICAgbGF5ZXIuc2V0U3R5bGUobWFwU3R5bGVzLmFyZWFzKVxuICAgICAgICBsYXllci5iaW5kUG9wdXAobGF5ZXIuZmVhdHVyZS5wcm9wZXJ0aWVzLmxhYmVsKTtcbiAgICAgIH0pXG4gICAgfSlcbiAgICAuYWRkVG8odHRtYXApO1xuICBjb25zb2xlLmxvZygnZXZlbnRzT2JqJyxldmVudHNPYmopXG5cbiAgdmFyIGtyYWtvdyA9IEwubWFya2VyKFs1MC4wNjQ3LCAxOS45NDUwXSlcbiAgICAuYmluZFBvcHVwKFwiPHNwYW4gc3R5bGU9J3dpZHRoOjk1JTsnPjxiPktyYWvDs3c8L2I+PGJyLz5sYXkgd2l0aGluIHNldmVyYWwgcGxhY2VzIG92ZXIgdGltZVwiKVxuICAgIC8vICtcIjxwIHN0eWxlPSdmb250LXNpemU6LjllbTsnJz48Yj5OYW1lIHZhcmlhbnRzPC9iPjogPGVtPkNhcmNvdmlhLENyYWNhdSxDcmFjYcO7LENyYWNvdmlhLENyYWNvdmllLENyYWNvdyxcIitcbiAgICAvLyBcIjxici8+Q3JhY8OydmlhLENyYWPDs3ZpYSxHb3JhZCBLcmFrYXUsS1JLLEtyYWthLEtyYWthdTwvZW0+PC9wPjwvc3Bhbj5cIilcbiAgICAuYWRkVG8odHRtYXApLm9wZW5Qb3B1cCgpO1xuXG4gIGluaXRUaW1lbGluZShldmVudHNPYmopO1xufVxuXG52YXIgdGw7XG5mdW5jdGlvbiBpbml0VGltZWxpbmUoKSB7XG4vLyBmdW5jdGlvbiBpbml0VGltZWxpbmUocGxhY2VkYXRhKSB7XG4gIHZhciBldmVudFNvdXJjZSA9IG5ldyBUaW1lbGluZS5EZWZhdWx0RXZlbnRTb3VyY2UoMCk7XG4gIC8vIEV4YW1wbGUgb2YgY2hhbmdpbmcgdGhlIHRoZW1lIGZyb20gdGhlIGRlZmF1bHRzXG4gIC8vIFRoZSBkZWZhdWx0IHRoZW1lIGlzIGRlZmluZWQgaW5cbiAgLy8gaHR0cDovL3NpbWlsZS13aWRnZXRzLmdvb2dsZWNvZGUuY29tL3N2bi90aW1lbGluZS90YWdzL2xhdGVzdC9zcmMvd2ViYXBwL2FwaS9zY3JpcHRzL3RoZW1lcy5qc1xuICB2YXIgdGhlbWUgPSBUaW1lbGluZS5DbGFzc2ljVGhlbWUuY3JlYXRlKCk7XG4gIHRoZW1lLmV2ZW50LmJ1YmJsZS53aWR0aCA9IDM1MDtcbiAgdGhlbWUuZXZlbnQuYnViYmxlLmhlaWdodCA9IDMwMDtcblxuICB2YXIgZCA9IFRpbWVsaW5lLkRhdGVUaW1lLnBhcnNlR3JlZ29yaWFuRGF0ZVRpbWUoXCIxOTAwXCIpXG4gIHZhciBiYW5kSW5mb3MgPSBbXG4gICAgICBUaW1lbGluZS5jcmVhdGVCYW5kSW5mbyh7XG4gICAgICAgICAgd2lkdGg6ICAgICAgICAgIFwiNzUlXCIsXG4gICAgICAgICAgaW50ZXJ2YWxVbml0OiAgIFRpbWVsaW5lLkRhdGVUaW1lLkRFQ0FERSxcbiAgICAgICAgICBpbnRlcnZhbFBpeGVsczogNTAsXG4gICAgICAgICAgZXZlbnRTb3VyY2U6ICAgIGV2ZW50U291cmNlLFxuICAgICAgICAgIGRhdGU6ICAgICAgICAgICBkLFxuICAgICAgICAgIHRoZW1lOiAgICAgICAgICB0aGVtZSxcbiAgICAgICAgICBsYXlvdXQ6ICAgICAgICAgJ29yaWdpbmFsJyAgLy8gb3JpZ2luYWwsIG92ZXJ2aWV3LCBkZXRhaWxlZFxuICAgICAgfSksXG4gICAgICBUaW1lbGluZS5jcmVhdGVCYW5kSW5mbyh7XG4gICAgICAgICAgd2lkdGg6ICAgICAgICAgIFwiMjUlXCIsXG4gICAgICAgICAgaW50ZXJ2YWxVbml0OiAgIFRpbWVsaW5lLkRhdGVUaW1lLkNFTlRVUlksXG4gICAgICAgICAgaW50ZXJ2YWxQaXhlbHM6IDEyMCxcbiAgICAgICAgICBldmVudFNvdXJjZTogICAgZXZlbnRTb3VyY2UsXG4gICAgICAgICAgZGF0ZTogICAgICAgICAgIGQsXG4gICAgICAgICAgdGhlbWU6ICAgICAgICAgIHRoZW1lLFxuICAgICAgICAgIGxheW91dDogICAgICAgICAnb3ZlcnZpZXcnICAvLyBvcmlnaW5hbCwgb3ZlcnZpZXcsIGRldGFpbGVkXG4gICAgICB9KVxuICBdO1xuICBiYW5kSW5mb3NbMV0uc3luY1dpdGggPSAwO1xuICBiYW5kSW5mb3NbMV0uaGlnaGxpZ2h0ID0gdHJ1ZTtcblxuICB0bCA9IFRpbWVsaW5lLmNyZWF0ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRsXCIpLCBiYW5kSW5mb3MsIFRpbWVsaW5lLkhPUklaT05UQUwpO1xuICAvLyBBZGRpbmcgdGhlIGRhdGUgdG8gdGhlIHVybCBzdG9wcyBicm93c2VyIGNhY2hpbmcgb2YgZGF0YSBkdXJpbmcgdGVzdGluZyBvciBpZlxuICAvLyB0aGUgZGF0YSBzb3VyY2UgaXMgYSBkeW5hbWljIHF1ZXJ5Li4uXG5cbiAgLy8gdGwubG9hZEpTT04oXCJkYXRhL3Rlc3QudHQuanNvbj9cIisgKG5ldyBEYXRlKCkuZ2V0VGltZSgpKSwgZnVuY3Rpb24oanNvbiwgdXJsKSB7XG4gIC8vICAgICBldmVudFNvdXJjZS5sb2FkSlNPTihqc29uLCB1cmwpO1xuICAvLyB9KTtcblxuICAvLyB0bC5sb2FkSlNPTihcImRhdGEvZXVyb19wb2xhbmQudGwuanNvbj9cIisgKG5ldyBEYXRlKCkuZ2V0VGltZSgpKSwgZnVuY3Rpb24oanNvbiwgdXJsKSB7XG4gIHRsLmxvYWRKU09OKFwiZGF0YS9ldXJvX3BvbGFuZC50bC5qc29uXCIsIGZ1bmN0aW9uKGpzb24sIHVybCkge1xuICAgICAgZXZlbnRTb3VyY2UubG9hZEpTT04oanNvbiwgdXJsKTtcbiAgfSk7XG5cbiAgLy8gdGwubG9hZEpTT04ocGxhY2VkYXRhKTtcblxufVxuXG52YXIgcmVzaXplVGltZXJJRCA9IG51bGw7XG5cbmZ1bmN0aW9uIG9uUmVzaXplKCkge1xuICAgIGlmIChyZXNpemVUaW1lcklEID09IG51bGwpIHtcbiAgICAgICAgcmVzaXplVGltZXJJRCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmVzaXplVGltZXJJRCA9IG51bGw7XG4gICAgICAgICAgICB0bC5sYXlvdXQoKTtcbiAgICAgICAgfSwgNTAwKTtcbiAgICB9XG59XG4iLCIkKGZ1bmN0aW9uKCkge1xuICBzdGFydE1hcCgpO1xufSk7XG5cbmZ1bmN0aW9uIHN0YXJ0TWFwKCl7XG4gIEwubWFwYm94LmFjY2Vzc1Rva2VuID0gJ3BrLmV5SjFJam9pYTJkbGIyZHlZWEJvWlhJaUxDSmhJam9pVW1WcmFsQlBjeUo5Lm1KZWdBSTFSNktSMjF4X0NWVlRscXcnO1xuICAvLyBBV01DIHRpbGVzIGluIG1hcGJveFxuICB2YXIgbWFwID0gTC5tYXBib3gubWFwKCdtYXAnLCAnaXNhd255dS5tYXAta25tY3Rsa2gnKVxuICAgICAgLy8gLnNldFZpZXcoWzAsIDBdLCAzKTtcbiAgICAgIC5zZXRWaWV3KFsyMi4xMDU5OTg3OTk3NTA1NzYsIDI1LjU3NjE3MTg3NV0sIDMpOyAvL1xuXG59XG4iLCJcbiQoZnVuY3Rpb24oKSB7XG4gIHN0YXJ0TWFwKCk7XG59KTtcbndpbmRvdy5pZFRvRmVhdHVyZSA9IHtwbGFjZXM6e319XG53aW5kb3cuZXZlbnRzT2JqID0geydkYXRlVGltZUZvcm1hdCc6ICdpc284NjAxJywnZXZlbnRzJzpbIF19O1xuXG5mdW5jdGlvbiB2YWxpZGF0ZVdoZW4ocGxhY2Upe1xuICAvLyBkb2VzIFRvcG90aW1lIHBsYWNlIHJlY29yZCBoYXZlIHZhbGlkIHdoZW4gb2JqZWN0P1xuXG59XG5mdW5jdGlvbiBidWlsZEV2ZW50KHBsYWNlKXtcbiAgLy8gbmVlZCB2YWxpZGF0ZSBmdW5jdGlvbiBoZXJlXG4gIC8vIGlmKHZhbGlkYXRlV2hlbihwbGFjZSk9PXRydWUge30pXG4gIHZhciBldmVudCA9IHt9O1xuICBldmVudFsnaWQnXSA9IHBsYWNlLnByb3BlcnRpZXMuaWQ7XG4gIGV2ZW50Wyd0aXRsZSddID0gcGxhY2UucHJvcGVydGllcy5sYWJlbDtcbiAgZXZlbnRbJ2Rlc2NyaXB0aW9uJ10gPSAhcGxhY2UucHJvcGVydGllcy5kZXNjcmlwdGlvbiA/IFwiXCIgOiBwbGFjZS5wcm9wZXJ0aWVzLmRlc2NyaXB0aW9uO1xuICAvLyBhc3N1bWluZyB2YWxpZDsgd2Uga25vdyBpdCdzIHRoZXJlIGluIHRveSBleGFtcGxlXG4gIGV2ZW50WydzdGFydCddID0gcGxhY2Uud2hlbi50aW1lc3BhbnNbMF0uc3RhcnQuZWFybGllc3Q7XG4gIGV2ZW50WydsYXRlc3RTdGFydCddID0gIXBsYWNlLndoZW4udGltZXNwYW5zWzBdLnN0YXJ0LmxhdGVzdCA/IFwiXCIgOnBsYWNlLndoZW4udGltZXNwYW5zWzBdLnN0YXJ0LmxhdGVzdDtcbiAgZXZlbnRbJ2VuZCddID0gcGxhY2Uud2hlbi50aW1lc3BhbnNbMF0uZW5kLmxhdGVzdDtcbiAgZXZlbnRbJ2VhcmxpZXN0RW5kJ10gPSAhcGxhY2Uud2hlbi50aW1lc3BhbnNbMF0uZW5kLmxhdGVzdCA/IFwiXCIgOnBsYWNlLndoZW4udGltZXNwYW5zWzBdLmVuZC5sYXRlc3Q7XG4gIGV2ZW50WydkdXJhdGlvbkV2ZW50J10gPSBcIlwiO1xuICBldmVudFsnbGluayddID0gXCJcIjtcbiAgZXZlbnRbJ2ltYWdlJ10gPSBcIlwiO1xuICAvLyBldmVudFsnZHVyYXRpb25FdmVudCddID0gcGxhY2Uud2hlbi50aW1lc3BhbnNbMF0uZHVyaW5nO1xuICAvLyAgICAgeydzdGFydCc6ICcxOTAwJywgJ2xhdGVzdFN0YXJ0JzogJzE5MDEnLCAnZWFybGllc3RFbmQnOiAnMTkwMycsICdlbmQnOiAnMTkwMicsXG4gIC8vICAgICAndGl0bGUnOiAnVGVzdCA2ZzogQmFkIGRhdGVzOiBlYXJsaWVzdEVuZCA+IGVuZCcsXG4gIC8vICAgICAnZGVzY3JpcHRpb24nOiAnVGVzdCA2ZzogQmFkIGRhdGVzOiBlYXJsaWVzdEVuZCA+IGVuZCcsXG4gIC8vICAgICAnZHVyYXRpb25FdmVudCc6IHRydWUsICdpbWFnZSc6Jzx1cmw+JywgJ2xpbmsnOic8dXJsPidcbiAgLy8gICAgIH0sXG4gIHJldHVybiBldmVudDtcbiAgLy8gY29uc29sZS5sb2coJ2dvdCBwbGFjZSwnK3BsYWNlKycsIGJ1aWxkaW5nIGV2ZW50Jylcbn1cbnZhciBtYXBTdHlsZXMgPSB7XG4gIGFyZWFzOiB7XG4gICAgICBcImNvbG9yXCI6IFwiIzk5MzMzM1wiLFxuICAgICAgXCJ3ZWlnaHRcIjogMSxcbiAgICAgIFwib3BhY2l0eVwiOiAuOCxcbiAgICAgIFwiZmlsbENvbG9yXCI6IFwib3JhbmdlXCIsXG4gICAgICBcImZpbGxPcGFjaXR5XCI6IDAuM1xuICAgIH1cbiAgfVxuZnVuY3Rpb24gc3RhcnRNYXAoKXtcbiAgTC5tYXBib3guYWNjZXNzVG9rZW4gPSAncGsuZXlKMUlqb2lhMmRsYjJkeVlYQm9aWElpTENKaElqb2lVbVZyYWxCUGN5SjkubUplZ0FJMVI2S1IyMXhfQ1ZWVGxxdyc7XG4gIC8vIEFXTUMgdGlsZXMgaW4gbWFwYm94XG4gIHR0bWFwID0gTC5tYXBib3gubWFwKCdtYXAnLCAnaXNhd255dS5tYXAta25tY3Rsa2gnKVxuICAgICAgLy8gLnNldFZpZXcoWzAsIDBdLCAzKTtcbiAgICAgIC5zZXRWaWV3KFs1MC4wNjQxOTE3MzY2NTkxMDQsIDE1LjU1NjY0MDYyNDk5OTk5OF0sIDQpO1xuICBmZWF0dXJlTGF5ZXIgPSBMLm1hcGJveC5mZWF0dXJlTGF5ZXIoKVxuICAgIC5sb2FkVVJMKCdkYXRhL3BvbGFuZHMudHRfZmVhdHVyZS13aGVuLmpzb24nKVxuICAgIC5vbigncmVhZHknLCBmdW5jdGlvbigpe1xuICAgICAgdHRmZWF0cyA9IGZlYXR1cmVMYXllci5fZ2VvanNvbi5mZWF0dXJlcztcbiAgICAgIGZlYXR1cmVMYXllci5lYWNoTGF5ZXIoZnVuY3Rpb24obGF5ZXIpe1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhsYXllcilcbiAgICAgICAgLy8gZXZlbnQgPSBidWlsZEV2ZW50KGxheWVyLmZlYXR1cmUpO1xuICAgICAgICAvLyBidWlsZCB0ZW1wb3JhbCBvYmplY3QgYW5kIHBhc3MgdG8gdGltZWxpbmVcbiAgICAgICAgZXZlbnRzT2JqLmV2ZW50cy5wdXNoKGJ1aWxkRXZlbnQobGF5ZXIuZmVhdHVyZSkpO1xuICAgICAgICBpZFRvRmVhdHVyZVsncGxhY2VzJ11bbGF5ZXIuZmVhdHVyZS5wcm9wZXJ0aWVzLmlkXSA9IGxheWVyLl9sZWFmbGV0X2lkO1xuICAgICAgICBsYXllci5zZXRTdHlsZShtYXBTdHlsZXMuYXJlYXMpXG4gICAgICAgIGxheWVyLmJpbmRQb3B1cChsYXllci5mZWF0dXJlLnByb3BlcnRpZXMubGFiZWwpO1xuICAgICAgfSlcbiAgICB9KVxuICAgIC5hZGRUbyh0dG1hcCk7XG4gIGNvbnNvbGUubG9nKCdldmVudHNPYmonLGV2ZW50c09iailcblxuICB2YXIga3Jha293ID0gTC5tYXJrZXIoWzUwLjA2NDcsIDE5Ljk0NTBdKVxuICAgIC5iaW5kUG9wdXAoXCI8c3BhbiBzdHlsZT0nd2lkdGg6OTUlOyc+PGI+S3Jha8OzdzwvYj48YnIvPmxheSB3aXRoaW4gc2V2ZXJhbCBwbGFjZXMgb3ZlciB0aW1lXCIpXG4gICAgLy8gK1wiPHAgc3R5bGU9J2ZvbnQtc2l6ZTouOWVtOycnPjxiPk5hbWUgdmFyaWFudHM8L2I+OiA8ZW0+Q2FyY292aWEsQ3JhY2F1LENyYWNhw7ssQ3JhY292aWEsQ3JhY292aWUsQ3JhY293LFwiK1xuICAgIC8vIFwiPGJyLz5DcmFjw7J2aWEsQ3JhY8OzdmlhLEdvcmFkIEtyYWthdSxLUkssS3Jha2EsS3Jha2F1PC9lbT48L3A+PC9zcGFuPlwiKVxuICAgIC5hZGRUbyh0dG1hcCkub3BlblBvcHVwKCk7XG5cbiAgaW5pdFRpbWVsaW5lKGV2ZW50c09iaik7XG59XG5cbi8vIG9wZW4gcG9wdXBcbi8vIGZlYXR1cmVMYXllci5fbGF5ZXJzWzkyXS5vcGVuUG9wdXAoKVxuLy8gc3R5bGVcbi8vIGZlYXR1cmVMYXllci5fbGF5ZXJzW2lkVG9GZWF0dXJlWydwbGFjZXMnXVsncG9sMDMnXV0uc2V0U3R5bGUoe2ZpbGxDb2xvciA6J2JsdWUnfSlcblxuLy8gZXZlbnQgZm9ybWF0XG4vLyB7XG4vLyAnZGF0ZVRpbWVGb3JtYXQnOiAnaXNvODYwMScsXG4vLyAnZXZlbnRzJyA6XG4vLyAgIFtcbi8vICAgICB7J3N0YXJ0JzogJzE5MDAnLCAnbGF0ZXN0U3RhcnQnOiAnMTkwMScsICdlYXJsaWVzdEVuZCc6ICcxOTAzJywgJ2VuZCc6ICcxOTAyJyxcbi8vICAgICAndGl0bGUnOiAnVGVzdCA2ZzogQmFkIGRhdGVzOiBlYXJsaWVzdEVuZCA+IGVuZCcsXG4vLyAgICAgJ2Rlc2NyaXB0aW9uJzogJ1Rlc3QgNmc6IEJhZCBkYXRlczogZWFybGllc3RFbmQgPiBlbmQnLFxuLy8gICAgICdkdXJhdGlvbkV2ZW50JzogdHJ1ZSwgJ2ltYWdlJzonPHVybD4nLCAnbGluayc6Jzx1cmw+J1xuLy8gICAgIH0sXG4vLyAgICAge31cbi8vICAgXVxuLy8gfVxuIiwidmFyIHRsO1xuZnVuY3Rpb24gaW5pdFRpbWVsaW5lKCkge1xuLy8gZnVuY3Rpb24gaW5pdFRpbWVsaW5lKHBsYWNlZGF0YSkge1xuICB2YXIgZXZlbnRTb3VyY2UgPSBuZXcgVGltZWxpbmUuRGVmYXVsdEV2ZW50U291cmNlKDApO1xuICAvLyBFeGFtcGxlIG9mIGNoYW5naW5nIHRoZSB0aGVtZSBmcm9tIHRoZSBkZWZhdWx0c1xuICAvLyBUaGUgZGVmYXVsdCB0aGVtZSBpcyBkZWZpbmVkIGluXG4gIC8vIGh0dHA6Ly9zaW1pbGUtd2lkZ2V0cy5nb29nbGVjb2RlLmNvbS9zdm4vdGltZWxpbmUvdGFncy9sYXRlc3Qvc3JjL3dlYmFwcC9hcGkvc2NyaXB0cy90aGVtZXMuanNcbiAgdmFyIHRoZW1lID0gVGltZWxpbmUuQ2xhc3NpY1RoZW1lLmNyZWF0ZSgpO1xuICB0aGVtZS5ldmVudC5idWJibGUud2lkdGggPSAzNTA7XG4gIHRoZW1lLmV2ZW50LmJ1YmJsZS5oZWlnaHQgPSAzMDA7XG5cbiAgdmFyIGQgPSBUaW1lbGluZS5EYXRlVGltZS5wYXJzZUdyZWdvcmlhbkRhdGVUaW1lKFwiMTkwMFwiKVxuICB2YXIgYmFuZEluZm9zID0gW1xuICAgICAgVGltZWxpbmUuY3JlYXRlQmFuZEluZm8oe1xuICAgICAgICAgIHdpZHRoOiAgICAgICAgICBcIjc1JVwiLFxuICAgICAgICAgIGludGVydmFsVW5pdDogICBUaW1lbGluZS5EYXRlVGltZS5ERUNBREUsXG4gICAgICAgICAgaW50ZXJ2YWxQaXhlbHM6IDUwLFxuICAgICAgICAgIGV2ZW50U291cmNlOiAgICBldmVudFNvdXJjZSxcbiAgICAgICAgICBkYXRlOiAgICAgICAgICAgZCxcbiAgICAgICAgICB0aGVtZTogICAgICAgICAgdGhlbWUsXG4gICAgICAgICAgbGF5b3V0OiAgICAgICAgICdvcmlnaW5hbCcgIC8vIG9yaWdpbmFsLCBvdmVydmlldywgZGV0YWlsZWRcbiAgICAgIH0pLFxuICAgICAgVGltZWxpbmUuY3JlYXRlQmFuZEluZm8oe1xuICAgICAgICAgIHdpZHRoOiAgICAgICAgICBcIjI1JVwiLFxuICAgICAgICAgIGludGVydmFsVW5pdDogICBUaW1lbGluZS5EYXRlVGltZS5DRU5UVVJZLFxuICAgICAgICAgIGludGVydmFsUGl4ZWxzOiAxMjAsXG4gICAgICAgICAgZXZlbnRTb3VyY2U6ICAgIGV2ZW50U291cmNlLFxuICAgICAgICAgIGRhdGU6ICAgICAgICAgICBkLFxuICAgICAgICAgIHRoZW1lOiAgICAgICAgICB0aGVtZSxcbiAgICAgICAgICBsYXlvdXQ6ICAgICAgICAgJ292ZXJ2aWV3JyAgLy8gb3JpZ2luYWwsIG92ZXJ2aWV3LCBkZXRhaWxlZFxuICAgICAgfSlcbiAgXTtcbiAgYmFuZEluZm9zWzFdLnN5bmNXaXRoID0gMDtcbiAgYmFuZEluZm9zWzFdLmhpZ2hsaWdodCA9IHRydWU7XG5cbiAgdGwgPSBUaW1lbGluZS5jcmVhdGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0bFwiKSwgYmFuZEluZm9zLCBUaW1lbGluZS5IT1JJWk9OVEFMKTtcbiAgLy8gQWRkaW5nIHRoZSBkYXRlIHRvIHRoZSB1cmwgc3RvcHMgYnJvd3NlciBjYWNoaW5nIG9mIGRhdGEgZHVyaW5nIHRlc3Rpbmcgb3IgaWZcbiAgLy8gdGhlIGRhdGEgc291cmNlIGlzIGEgZHluYW1pYyBxdWVyeS4uLlxuXG4gIC8vIHRsLmxvYWRKU09OKFwiZGF0YS90ZXN0LnR0Lmpzb24/XCIrIChuZXcgRGF0ZSgpLmdldFRpbWUoKSksIGZ1bmN0aW9uKGpzb24sIHVybCkge1xuICAvLyAgICAgZXZlbnRTb3VyY2UubG9hZEpTT04oanNvbiwgdXJsKTtcbiAgLy8gfSk7XG5cbiAgLy8gdGwubG9hZEpTT04oXCJkYXRhL2V1cm9fcG9sYW5kLnRsLmpzb24/XCIrIChuZXcgRGF0ZSgpLmdldFRpbWUoKSksIGZ1bmN0aW9uKGpzb24sIHVybCkge1xuICB0bC5sb2FkSlNPTihcImRhdGEvZXVyb19wb2xhbmQudGwuanNvblwiLCBmdW5jdGlvbihqc29uLCB1cmwpIHtcbiAgICAgIGV2ZW50U291cmNlLmxvYWRKU09OKGpzb24sIHVybCk7XG4gIH0pO1xuXG4gIC8vIHRsLmxvYWRKU09OKHBsYWNlZGF0YSk7XG5cbn1cblxudmFyIHJlc2l6ZVRpbWVySUQgPSBudWxsO1xuXG5mdW5jdGlvbiBvblJlc2l6ZSgpIHtcbiAgICBpZiAocmVzaXplVGltZXJJRCA9PSBudWxsKSB7XG4gICAgICAgIHJlc2l6ZVRpbWVySUQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJlc2l6ZVRpbWVySUQgPSBudWxsO1xuICAgICAgICAgICAgdGwubGF5b3V0KCk7XG4gICAgICAgIH0sIDUwMCk7XG4gICAgfVxufVxuIiwiLy8gJChmdW5jdGlvbigpIHtcbiAgLy8gc3RhcnRNYXAoKTtcbi8vIH0pO1xuXG52YXIgdGw7XG5mdW5jdGlvbiBvbkxvYWQoKSB7XG4gIHZhciBldmVudFNvdXJjZSA9IG5ldyBUaW1lbGluZS5EZWZhdWx0RXZlbnRTb3VyY2UoKTtcbiAgdmFyIGJhbmRJbmZvcyA9IFtcbiAgICBUaW1lbGluZS5jcmVhdGVCYW5kSW5mbyh7XG4gICAgICAgIHdpZHRoOiAgICAgICAgICBcIjcwJVwiLFxuICAgICAgICBpbnRlcnZhbFVuaXQ6ICAgVGltZWxpbmUuRGF0ZVRpbWUuTU9OVEgsXG4gICAgICAgIGludGVydmFsUGl4ZWxzOiAxMDBcbiAgICB9KSxcbiAgICBUaW1lbGluZS5jcmVhdGVCYW5kSW5mbyh7XG4gICAgICAgIHdpZHRoOiAgICAgICAgICBcIjMwJVwiLFxuICAgICAgICBpbnRlcnZhbFVuaXQ6ICAgVGltZWxpbmUuRGF0ZVRpbWUuWUVBUixcbiAgICAgICAgaW50ZXJ2YWxQaXhlbHM6IDIwMFxuICAgIH0pXG4gIF07XG4gIGJhbmRJbmZvc1sxXS5zeW5jV2l0aCA9IDA7XG4gIGJhbmRJbmZvc1sxXS5oaWdobGlnaHQgPSB0cnVlO1xuXG4gIHRsID0gVGltZWxpbmUuY3JlYXRlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGltZWxpbmVcIiksIGJhbmRJbmZvcyk7XG4gIFRpbWVsaW5lLmxvYWRYTUwoXCJkYXRhL21vbmV0LnhtbFwiLCBmdW5jdGlvbih4bWwsIHVybCkgeyBldmVudFNvdXJjZS5sb2FkWE1MKHhtbCwgdXJsKTsgfSk7XG59XG52YXIgcmVzaXplVGltZXJJRCA9IG51bGw7XG5mdW5jdGlvbiBvblJlc2l6ZSgpIHtcbiAgICBpZiAocmVzaXplVGltZXJJRCA9PSBudWxsKSB7XG4gICAgICAgIHJlc2l6ZVRpbWVySUQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJlc2l6ZVRpbWVySUQgPSBudWxsO1xuICAgICAgICAgICAgdGwubGF5b3V0KCk7XG4gICAgICAgIH0sIDUwMCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzdGFydE1hcCgpe1xuICBjb25zb2xlLmxvZygnc3RhcnRpbmcgYSBkYW1uZWQgbWFwJylcbiAgTC5tYXBib3guYWNjZXNzVG9rZW4gPSAncGsuZXlKMUlqb2lhMmRsYjJkeVlYQm9aWElpTENKaElqb2lVbVZyYWxCUGN5SjkubUplZ0FJMVI2S1IyMXhfQ1ZWVGxxdyc7XG4gIC8vIEFXTUMgdGlsZXMgaW4gbWFwYm94XG4gIHZhciBtYXAgPSBMLm1hcGJveC5tYXAoJ21hcCcsICdpc2F3bnl1Lm1hcC1rbm1jdGxraCcpXG4gICAgICAvLyAuc2V0VmlldyhbMCwgMF0sIDMpO1xuICAgICAgLnNldFZpZXcoWzIyLjEwNTk5ODc5OTc1MDU3NiwgMjUuNTc2MTcxODc1XSwgMyk7IC8vXG5cbn1cbiJdfQ==
