
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
        // console.log(layer.featureLayer)
        layer.bindPopup(layer.feature.properties.label);
      })
    })
    .addTo(ttmap);

  // ttfeats = featureLayer._geojson;
}
