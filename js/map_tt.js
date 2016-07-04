
$(function() {
  startMap();
});

function startMap(){
  L.mapbox.accessToken = 'pk.eyJ1Ijoia2dlb2dyYXBoZXIiLCJhIjoiUmVralBPcyJ9.mJegAI1R6KR21x_CVVTlqw';
  // AWMC tiles in mapbox
  ttmap = L.mapbox.map('map', 'isawnyu.map-knmctlkh')
      // .setView([0, 0], 3);
      .setView([50.064191736659104, 15.556640624999998], 4);
  featureLayer = L.mapbox.featureLayer()
    .loadURL('data/polands.tt_feature-when.json')
    .on('ready', function(){
      ttfeats = featureLayer._geojson.features;
      featureLayer.eachLayer(function(layer){
        // build temporal object and pass to timeline

        layer.bindPopup(layer.feature.properties.label);
      })
    })
    .addTo(ttmap);

  var krakow = L.marker([50.0647, 19.9450])
    .bindPopup("<b>Kraków</b><br/>a part of many places")
    .addTo(ttmap).openPopup();

  initTimeline();
  // ttfeats = featureLayer._geojson;
}

// open popup
// featureLayer._layers[92].openPopup()
// style
// featureLayer._layers[92].setStyle({fillColor :'blue'})

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
