(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

$(function () {
  startMap();
});
function initTimeline(foo) {
  console.log('in initTimeline()', foo);
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

  var tl = Timeline.create(document.getElementById("tl"), bandInfos, Timeline.HORIZONTAL);
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
  var ttmap = L.mapbox.map('map', 'isawnyu.map-knmctlkh')
  // .setView([0, 0], 3);
  .setView([50.064191736659104, 15.556640624999998], 4);
  var featureLayer = L.mapbox.featureLayer().loadURL('data/polands.tt_feature-when.json').on('ready', function () {
    var ttfeats = featureLayer._geojson.features;
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

},{}],2:[function(require,module,exports){
"use strict";

var tl;

function initTimeline(foo) {
    console.log(foo);
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

},{}]},{},[1,2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvamF2YXNjcmlwdHMvbWFwX3R0LmpzIiwic3JjL2phdmFzY3JpcHRzL3RpbWVsaW5lX3R0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNDQSxFQUFFLFlBQVc7QUFDWDtBQUNELENBRkQ7QUFHQSxTQUFTLFlBQVQsQ0FBc0IsR0FBdEIsRUFBMkI7QUFDekIsVUFBUSxHQUFSLENBQVksbUJBQVosRUFBaUMsR0FBakM7QUFDQSxNQUFJLGNBQWMsSUFBSSxTQUFTLGtCQUFiLENBQWdDLENBQWhDLENBQWxCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSSxRQUFRLFNBQVMsWUFBVCxDQUFzQixNQUF0QixFQUFaO0FBQ0EsUUFBTSxLQUFOLENBQVksTUFBWixDQUFtQixLQUFuQixHQUEyQixHQUEzQjtBQUNBLFFBQU0sS0FBTixDQUFZLE1BQVosQ0FBbUIsTUFBbkIsR0FBNEIsR0FBNUI7O0FBRUEsTUFBSSxJQUFJLFNBQVMsUUFBVCxDQUFrQixzQkFBbEIsQ0FBeUMsTUFBekMsQ0FBUjtBQUNBLE1BQUksWUFBWSxDQUNaLFNBQVMsY0FBVCxDQUF3QjtBQUNwQixXQUFnQixLQURJO0FBRXBCLGtCQUFnQixTQUFTLFFBQVQsQ0FBa0IsTUFGZDtBQUdwQixvQkFBZ0IsRUFISTtBQUlwQixpQkFBZ0IsV0FKSTtBQUtwQixVQUFnQixDQUxJO0FBTXBCLFdBQWdCLEtBTkk7QUFPcEIsWUFBZ0IsVUFQSSxDQU9RO0FBUFIsR0FBeEIsQ0FEWSxFQVVaLFNBQVMsY0FBVCxDQUF3QjtBQUNwQixXQUFnQixLQURJO0FBRXBCLGtCQUFnQixTQUFTLFFBQVQsQ0FBa0IsT0FGZDtBQUdwQixvQkFBZ0IsR0FISTtBQUlwQixpQkFBZ0IsV0FKSTtBQUtwQixVQUFnQixDQUxJO0FBTXBCLFdBQWdCLEtBTkk7QUFPcEIsWUFBZ0IsVUFQSSxDQU9RO0FBUFIsR0FBeEIsQ0FWWSxDQUFoQjtB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QUNoQixRQUFJLGlCQUFpQixJQUFyQixFQUEyQjtBQUN2Qix3QkFBZ0IsT0FBTyxVQUFQLENBQWtCLFlBQVc7QUFDekMsNEJBQWdCLElBQWhCO0FBQ0EsZUFBRyxNQUFIO0FBQ0gsU0FIZSxFQUdiLEdBSGEsQ0FBaEI7QUFJSDtBQUNKIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuJChmdW5jdGlvbigpIHtcbiAgc3RhcnRNYXAoKTtcbn0pO1xuZnVuY3Rpb24gaW5pdFRpbWVsaW5lKGZvbykge1xuICBjb25zb2xlLmxvZygnaW4gaW5pdFRpbWVsaW5lKCknLCBmb28pXG4gIHZhciBldmVudFNvdXJjZSA9IG5ldyBUaW1lbGluZS5EZWZhdWx0RXZlbnRTb3VyY2UoMCk7XG4gIC8vIEV4YW1wbGUgb2YgY2hhbmdpbmcgdGhlIHRoZW1lIGZyb20gdGhlIGRlZmF1bHRzXG4gIC8vIFRoZSBkZWZhdWx0IHRoZW1lIGlzIGRlZmluZWQgaW5cbiAgLy8gaHR0cDovL3NpbWlsZS13aWRnZXRzLmdvb2dsZWNvZGUuY29tL3N2bi90aW1lbGluZS90YWdzL2xhdGVzdC9zcmMvd2ViYXBwL2FwaS9zY3JpcHRzL3RoZW1lcy5qc1xuICB2YXIgdGhlbWUgPSBUaW1lbGluZS5DbGFzc2ljVGhlbWUuY3JlYXRlKCk7XG4gIHRoZW1lLmV2ZW50LmJ1YmJsZS53aWR0aCA9IDM1MDtcbiAgdGhlbWUuZXZlbnQuYnViYmxlLmhlaWdodCA9IDMwMDtcblxuICB2YXIgZCA9IFRpbWVsaW5lLkRhdGVUaW1lLnBhcnNlR3JlZ29yaWFuRGF0ZVRpbWUoXCIxOTAwXCIpXG4gIHZhciBiYW5kSW5mb3MgPSBbXG4gICAgICBUaW1lbGluZS5jcmVhdGVCYW5kSW5mbyh7XG4gICAgICAgICAgd2lkdGg6ICAgICAgICAgIFwiNzUlXCIsXG4gICAgICAgICAgaW50ZXJ2YWxVbml0OiAgIFRpbWVsaW5lLkRhdGVUaW1lLkRFQ0FERSxcbiAgICAgICAgICBpbnRlcnZhbFBpeGVsczogNTAsXG4gICAgICAgICAgZXZlbnRTb3VyY2U6ICAgIGV2ZW50U291cmNlLFxuICAgICAgICAgIGRhdGU6ICAgICAgICAgICBkLFxuICAgICAgICAgIHRoZW1lOiAgICAgICAgICB0aGVtZSxcbiAgICAgICAgICBsYXlvdXQ6ICAgICAgICAgJ29yaWdpbmFsJyAgLy8gb3JpZ2luYWwsIG92ZXJ2aWV3LCBkZXRhaWxlZFxuICAgICAgfSksXG4gICAgICBUaW1lbGluZS5jcmVhdGVCYW5kSW5mbyh7XG4gICAgICAgICAgd2lkdGg6ICAgICAgICAgIFwiMjUlXCIsXG4gICAgICAgICAgaW50ZXJ2YWxVbml0OiAgIFRpbWVsaW5lLkRhdGVUaW1lLkNFTlRVUlksXG4gICAgICAgICAgaW50ZXJ2YWxQaXhlbHM6IDEyMCxcbiAgICAgICAgICBldmVudFNvdXJjZTogICAgZXZlbnRTb3VyY2UsXG4gICAgICAgICAgZGF0ZTogICAgICAgICAgIGQsXG4gICAgICAgICAgdGhlbWU6ICAgICAgICAgIHRoZW1lLFxuICAgICAgICAgIGxheW91dDogICAgICAgICAnb3ZlcnZpZXcnICAvLyBvcmlnaW5hbCwgb3ZlcnZpZXcsIGRldGFpbGVkXG4gICAgICB9KVxuICBdO1xuICBiYW5kSW5mb3NbMV0uc3luY1dpdGggPSAwO1xuICBiYW5kSW5mb3NbMV0uaGlnaGxpZ2h0ID0gdHJ1ZTtcblxuICBsZXQgdGwgPSBUaW1lbGluZS5jcmVhdGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0bFwiKSwgYmFuZEluZm9zLCBUaW1lbGluZS5IT1JJWk9OVEFMKTtcbiAgLy8gQWRkaW5nIHRoZSBkYXRlIHRvIHRoZSB1cmwgc3RvcHMgYnJvd3NlciBjYWNoaW5nIG9mIGRhdGEgZHVyaW5nIHRlc3Rpbmcgb3IgaWZcbiAgLy8gdGhlIGRhdGEgc291cmNlIGlzIGEgZHluYW1pYyBxdWVyeS4uLlxuXG4gIC8vIHRsLmxvYWRKU09OKFwiZGF0YS90ZXN0LnR0Lmpzb24/XCIrIChuZXcgRGF0ZSgpLmdldFRpbWUoKSksIGZ1bmN0aW9uKGpzb24sIHVybCkge1xuICAvLyAgICAgZXZlbnRTb3VyY2UubG9hZEpTT04oanNvbiwgdXJsKTtcbiAgLy8gfSk7XG5cbiAgLy8gdGwubG9hZEpTT04oXCJkYXRhL2V1cm9fcG9sYW5kLnRsLmpzb24/XCIrIChuZXcgRGF0ZSgpLmdldFRpbWUoKSksIGZ1bmN0aW9uKGpzb24sIHVybCkge1xuICB0bC5sb2FkSlNPTihcImRhdGEvZXVyb19wb2xhbmQudGwuanNvblwiLCBmdW5jdGlvbihqc29uLCB1cmwpIHtcbiAgICAgIGV2ZW50U291cmNlLmxvYWRKU09OKGpzb24sIHVybCk7XG4gICAgfVxuICApO1xuXG4gIC8vIHRsLmxvYWRKU09OKHBsYWNlZGF0YSk7XG59XG5cbnZhciByZXNpemVUaW1lcklEID0gbnVsbDtcblxuZnVuY3Rpb24gb25SZXNpemUoKSB7XG4gICAgaWYgKHJlc2l6ZVRpbWVySUQgPT0gbnVsbCkge1xuICAgICAgICByZXNpemVUaW1lcklEID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXNpemVUaW1lcklEID0gbnVsbDtcbiAgICAgICAgICAgIHRsLmxheW91dCgpO1xuICAgICAgICB9LCA1MDApO1xuICAgIH1cbn1cblxud2luZG93LmlkVG9GZWF0dXJlID0ge3BsYWNlczp7fX1cbndpbmRvdy5ldmVudHNPYmogPSB7J2RhdGVUaW1lRm9ybWF0JzogJ2lzbzg2MDEnLCdldmVudHMnOlsgXX07XG5cbmZ1bmN0aW9uIHZhbGlkYXRlV2hlbihwbGFjZSl7XG4gIC8vIGRvZXMgVG9wb3RpbWUgcGxhY2UgcmVjb3JkIGhhdmUgdmFsaWQgd2hlbiBvYmplY3Q/XG59XG5cbmZ1bmN0aW9uIGJ1aWxkRXZlbnQocGxhY2Upe1xuICAvLyBuZWVkIHZhbGlkYXRlIGZ1bmN0aW9uIGhlcmVcbiAgLy8gaWYodmFsaWRhdGVXaGVuKHBsYWNlKT09dHJ1ZSB7fSlcbiAgdmFyIGV2ZW50ID0ge307XG4gIGV2ZW50WydpZCddID0gcGxhY2UucHJvcGVydGllcy5pZDtcbiAgZXZlbnRbJ3RpdGxlJ10gPSBwbGFjZS5wcm9wZXJ0aWVzLmxhYmVsO1xuICBldmVudFsnZGVzY3JpcHRpb24nXSA9ICFwbGFjZS5wcm9wZXJ0aWVzLmRlc2NyaXB0aW9uID8gXCJcIiA6IHBsYWNlLnByb3BlcnRpZXMuZGVzY3JpcHRpb247XG4gIC8vIGFzc3VtaW5nIHZhbGlkOyB3ZSBrbm93IGl0J3MgdGhlcmUgaW4gdG95IGV4YW1wbGVcbiAgZXZlbnRbJ3N0YXJ0J10gPSBwbGFjZS53aGVuLnRpbWVzcGFuc1swXS5zdGFydC5lYXJsaWVzdDtcbiAgZXZlbnRbJ2xhdGVzdFN0YXJ0J10gPSAhcGxhY2Uud2hlbi50aW1lc3BhbnNbMF0uc3RhcnQubGF0ZXN0ID8gXCJcIiA6cGxhY2Uud2hlbi50aW1lc3BhbnNbMF0uc3RhcnQubGF0ZXN0O1xuICBldmVudFsnZW5kJ10gPSBwbGFjZS53aGVuLnRpbWVzcGFuc1swXS5lbmQubGF0ZXN0O1xuICBldmVudFsnZWFybGllc3RFbmQnXSA9ICFwbGFjZS53aGVuLnRpbWVzcGFuc1swXS5lbmQubGF0ZXN0ID8gXCJcIiA6cGxhY2Uud2hlbi50aW1lc3BhbnNbMF0uZW5kLmxhdGVzdDtcbiAgZXZlbnRbJ2R1cmF0aW9uRXZlbnQnXSA9IFwiXCI7XG4gIGV2ZW50WydsaW5rJ10gPSBcIlwiO1xuICBldmVudFsnaW1hZ2UnXSA9IFwiXCI7XG4gIC8vIGV2ZW50WydkdXJhdGlvbkV2ZW50J10gPSBwbGFjZS53aGVuLnRpbWVzcGFuc1swXS5kdXJpbmc7XG4gIC8vICAgICB7J3N0YXJ0JzogJzE5MDAnLCAnbGF0ZXN0U3RhcnQnOiAnMTkwMScsICdlYXJsaWVzdEVuZCc6ICcxOTAzJywgJ2VuZCc6ICcxOTAyJyxcbiAgLy8gICAgICd0aXRsZSc6ICdUZXN0IDZnOiBCYWQgZGF0ZXM6IGVhcmxpZXN0RW5kID4gZW5kJyxcbiAgLy8gICAgICdkZXNjcmlwdGlvbic6ICdUZXN0IDZnOiBCYWQgZGF0ZXM6IGVhcmxpZXN0RW5kID4gZW5kJyxcbiAgLy8gICAgICdkdXJhdGlvbkV2ZW50JzogdHJ1ZSwgJ2ltYWdlJzonPHVybD4nLCAnbGluayc6Jzx1cmw+J1xuICAvLyAgICAgfSxcbiAgcmV0dXJuIGV2ZW50O1xuICAvLyBjb25zb2xlLmxvZygnZ290IHBsYWNlLCcrcGxhY2UrJywgYnVpbGRpbmcgZXZlbnQnKVxufVxudmFyIG1hcFN0eWxlcyA9IHtcbiAgYXJlYXM6IHtcbiAgICAgIFwiY29sb3JcIjogXCIjOTkzMzMzXCIsXG4gICAgICBcIndlaWdodFwiOiAxLFxuICAgICAgXCJvcGFjaXR5XCI6IC44LFxuICAgICAgXCJmaWxsQ29sb3JcIjogXCJvcmFuZ2VcIixcbiAgICAgIFwiZmlsbE9wYWNpdHlcIjogMC4zXG4gICAgfVxuICB9XG5mdW5jdGlvbiBzdGFydE1hcCgpe1xuICBMLm1hcGJveC5hY2Nlc3NUb2tlbiA9ICdway5leUoxSWpvaWEyZGxiMmR5WVhCb1pYSWlMQ0poSWpvaVVtVnJhbEJQY3lKOS5tSmVnQUkxUjZLUjIxeF9DVlZUbHF3JztcbiAgLy8gQVdNQyB0aWxlcyBpbiBtYXBib3hcbiAgbGV0IHR0bWFwID0gTC5tYXBib3gubWFwKCdtYXAnLCAnaXNhd255dS5tYXAta25tY3Rsa2gnKVxuICAgICAgLy8gLnNldFZpZXcoWzAsIDBdLCAzKTtcbiAgICAgIC5zZXRWaWV3KFs1MC4wNjQxOTE3MzY2NTkxMDQsIDE1LjU1NjY0MDYyNDk5OTk5OF0sIDQpO1xuICBsZXQgZmVhdHVyZUxheWVyID0gTC5tYXBib3guZmVhdHVyZUxheWVyKClcbiAgICAubG9hZFVSTCgnZGF0YS9wb2xhbmRzLnR0X2ZlYXR1cmUtd2hlbi5qc29uJylcbiAgICAub24oJ3JlYWR5JywgZnVuY3Rpb24oKXtcbiAgICAgIGxldCB0dGZlYXRzID0gZmVhdHVyZUxheWVyLl9nZW9qc29uLmZlYXR1cmVzO1xuICAgICAgZmVhdHVyZUxheWVyLmVhY2hMYXllcihmdW5jdGlvbihsYXllcil7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGxheWVyKVxuICAgICAgICAvLyBldmVudCA9IGJ1aWxkRXZlbnQobGF5ZXIuZmVhdHVyZSk7XG4gICAgICAgIC8vIGJ1aWxkIHRlbXBvcmFsIG9iamVjdCBhbmQgcGFzcyB0byB0aW1lbGluZVxuICAgICAgICBldmVudHNPYmouZXZlbnRzLnB1c2goYnVpbGRFdmVudChsYXllci5mZWF0dXJlKSk7XG4gICAgICAgIGlkVG9GZWF0dXJlWydwbGFjZXMnXVtsYXllci5mZWF0dXJlLnByb3BlcnRpZXMuaWRdID0gbGF5ZXIuX2xlYWZsZXRfaWQ7XG4gICAgICAgIGxheWVyLnNldFN0eWxlKG1hcFN0eWxlcy5hcmVhcylcbiAgICAgICAgbGF5ZXIuYmluZFBvcHVwKGxheWVyLmZlYXR1cmUucHJvcGVydGllcy5sYWJlbCk7XG4gICAgICB9KVxuICAgIH0pXG4gICAgLmFkZFRvKHR0bWFwKTtcbiAgY29uc29sZS5sb2coJ2V2ZW50c09iaicsZXZlbnRzT2JqKVxuXG4gIHZhciBrcmFrb3cgPSBMLm1hcmtlcihbNTAuMDY0NywgMTkuOTQ1MF0pXG4gICAgLmJpbmRQb3B1cChcIjxzcGFuIHN0eWxlPSd3aWR0aDo5NSU7Jz48Yj5LcmFrw7N3PC9iPjxici8+bGF5IHdpdGhpbiBzZXZlcmFsIHBsYWNlcyBvdmVyIHRpbWVcIilcbiAgICAvLyArXCI8cCBzdHlsZT0nZm9udC1zaXplOi45ZW07Jyc+PGI+TmFtZSB2YXJpYW50czwvYj46IDxlbT5DYXJjb3ZpYSxDcmFjYXUsQ3JhY2HDuyxDcmFjb3ZpYSxDcmFjb3ZpZSxDcmFjb3csXCIrXG4gICAgLy8gXCI8YnIvPkNyYWPDsnZpYSxDcmFjw7N2aWEsR29yYWQgS3Jha2F1LEtSSyxLcmFrYSxLcmFrYXU8L2VtPjwvcD48L3NwYW4+XCIpXG4gICAgLmFkZFRvKHR0bWFwKS5vcGVuUG9wdXAoKTtcblxuICBpbml0VGltZWxpbmUoZXZlbnRzT2JqKTtcbn1cblxuLy8gb3BlbiBwb3B1cFxuLy8gZmVhdHVyZUxheWVyLl9sYXllcnNbOTJdLm9wZW5Qb3B1cCgpXG4vLyBzdHlsZVxuLy8gZmVhdHVyZUxheWVyLl9sYXllcnNbaWRUb0ZlYXR1cmVbJ3BsYWNlcyddWydwb2wwMyddXS5zZXRTdHlsZSh7ZmlsbENvbG9yIDonYmx1ZSd9KVxuXG4vLyBldmVudCBmb3JtYXRcbi8vIHtcbi8vICdkYXRlVGltZUZvcm1hdCc6ICdpc284NjAxJyxcbi8vICdldmVudHMnIDpcbi8vICAgW1xuLy8gICAgIHsnc3RhcnQnOiAnMTkwMCcsICdsYXRlc3RTdGFydCc6ICcxOTAxJywgJ2VhcmxpZXN0RW5kJzogJzE5MDMnLCAnZW5kJzogJzE5MDInLFxuLy8gICAgICd0aXRsZSc6ICdUZXN0IDZnOiBCYWQgZGF0ZXM6IGVhcmxpZXN0RW5kID4gZW5kJyxcbi8vICAgICAnZGVzY3JpcHRpb24nOiAnVGVzdCA2ZzogQmFkIGRhdGVzOiBlYXJsaWVzdEVuZCA+IGVuZCcsXG4vLyAgICAgJ2R1cmF0aW9uRXZlbnQnOiB0cnVlLCAnaW1hZ2UnOic8dXJsPicsICdsaW5rJzonPHVybD4nXG4vLyAgICAgfSxcbi8vICAgICB7fVxuLy8gICBdXG4vLyB9XG4iLCJ2YXIgdGw7XG5cbmZ1bmN0aW9uIGluaXRUaW1lbGluZShmb28pIHtcbiAgY29uc29sZS5sb2coZm9vKVxuICB2YXIgZXZlbnRTb3VyY2UgPSBuZXcgVGltZWxpbmUuRGVmYXVsdEV2ZW50U291cmNlKDApO1xuICAvLyBFeGFtcGxlIG9mIGNoYW5naW5nIHRoZSB0aGVtZSBmcm9tIHRoZSBkZWZhdWx0c1xuICAvLyBUaGUgZGVmYXVsdCB0aGVtZSBpcyBkZWZpbmVkIGluXG4gIC8vIGh0dHA6Ly9zaW1pbGUtd2lkZ2V0cy5nb29nbGVjb2RlLmNvbS9zdm4vdGltZWxpbmUvdGFncy9sYXRlc3Qvc3JjL3dlYmFwcC9hcGkvc2NyaXB0cy90aGVtZXMuanNcbiAgdmFyIHRoZW1lID0gVGltZWxpbmUuQ2xhc3NpY1RoZW1lLmNyZWF0ZSgpO1xuICB0aGVtZS5ldmVudC5idWJibGUud2lkdGggPSAzNTA7XG4gIHRoZW1lLmV2ZW50LmJ1YmJsZS5oZWlnaHQgPSAzMDA7XG5cbiAgdmFyIGQgPSBUaW1lbGluZS5EYXRlVGltZS5wYXJzZUdyZWdvcmlhbkRhdGVUaW1lKFwiMTkwMFwiKVxuICB2YXIgYmFuZEluZm9zID0gW1xuICAgICAgVGltZWxpbmUuY3JlYXRlQmFuZEluZm8oe1xuICAgICAgICAgIHdpZHRoOiAgICAgICAgICBcIjc1JVwiLFxuICAgICAgICAgIGludGVydmFsVW5pdDogICBUaW1lbGluZS5EYXRlVGltZS5ERUNBREUsXG4gICAgICAgICAgaW50ZXJ2YWxQaXhlbHM6IDUwLFxuICAgICAgICAgIGV2ZW50U291cmNlOiAgICBldmVudFNvdXJjZSxcbiAgICAgICAgICBkYXRlOiAgICAgICAgICAgZCxcbiAgICAgICAgICB0aGVtZTogICAgICAgICAgdGhlbWUsXG4gICAgICAgICAgbGF5b3V0OiAgICAgICAgICdvcmlnaW5hbCcgIC8vIG9yaWdpbmFsLCBvdmVydmlldywgZGV0YWlsZWRcbiAgICAgIH0pLFxuICAgICAgVGltZWxpbmUuY3JlYXRlQmFuZEluZm8oe1xuICAgICAgICAgIHdpZHRoOiAgICAgICAgICBcIjI1JVwiLFxuICAgICAgICAgIGludGVydmFsVW5pdDogICBUaW1lbGluZS5EYXRlVGltZS5DRU5UVVJZLFxuICAgICAgICAgIGludGVydmFsUGl4ZWxzOiAxMjAsXG4gICAgICAgICAgZXZlbnRTb3VyY2U6ICAgIGV2ZW50U291cmNlLFxuICAgICAgICAgIGRhdGU6ICAgICAgICAgICBkLFxuICAgICAgICAgIHRoZW1lOiAgICAgICAgICB0aGVtZSxcbiAgICAgICAgICBsYXlvdXQ6ICAgICAgICAgJ292ZXJ2aWV3JyAgLy8gb3JpZ2luYWwsIG92ZXJ2aWV3LCBkZXRhaWxlZFxuICAgICAgfSlcbiAgXTtcbiAgYmFuZEluZm9zWzFdLnN5bmNXaXRoID0gMDtcbiAgYmFuZEluZm9zWzFdLmhpZ2hsaWdodCA9IHRydWU7XG5cbiAgdGwgPSBUaW1lbGluZS5jcmVhdGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0bFwiKSwgYmFuZEluZm9zLCBUaW1lbGluZS5IT1JJWk9OVEFMKTtcbiAgLy8gQWRkaW5nIHRoZSBkYXRlIHRvIHRoZSB1cmwgc3RvcHMgYnJvd3NlciBjYWNoaW5nIG9mIGRhdGEgZHVyaW5nIHRlc3Rpbmcgb3IgaWZcbiAgLy8gdGhlIGRhdGEgc291cmNlIGlzIGEgZHluYW1pYyBxdWVyeS4uLlxuXG4gIC8vIHRsLmxvYWRKU09OKFwiZGF0YS90ZXN0LnR0Lmpzb24/XCIrIChuZXcgRGF0ZSgpLmdldFRpbWUoKSksIGZ1bmN0aW9uKGpzb24sIHVybCkge1xuICAvLyAgICAgZXZlbnRTb3VyY2UubG9hZEpTT04oanNvbiwgdXJsKTtcbiAgLy8gfSk7XG5cbiAgLy8gdGwubG9hZEpTT04oXCJkYXRhL2V1cm9fcG9sYW5kLnRsLmpzb24/XCIrIChuZXcgRGF0ZSgpLmdldFRpbWUoKSksIGZ1bmN0aW9uKGpzb24sIHVybCkge1xuICB0bC5sb2FkSlNPTihcImRhdGEvZXVyb19wb2xhbmQudGwuanNvblwiLCBmdW5jdGlvbihqc29uLCB1cmwpIHtcbiAgICAgIGV2ZW50U291cmNlLmxvYWRKU09OKGpzb24sIHVybCk7XG4gICAgfVxuICApO1xuXG4gIC8vIHRsLmxvYWRKU09OKHBsYWNlZGF0YSk7XG59XG5cbnZhciByZXNpemVUaW1lcklEID0gbnVsbDtcblxuZnVuY3Rpb24gb25SZXNpemUoKSB7XG4gICAgaWYgKHJlc2l6ZVRpbWVySUQgPT0gbnVsbCkge1xuICAgICAgICByZXNpemVUaW1lcklEID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXNpemVUaW1lcklEID0gbnVsbDtcbiAgICAgICAgICAgIHRsLmxheW91dCgpO1xuICAgICAgICB9LCA1MDApO1xuICAgIH1cbn1cbiJdfQ==
