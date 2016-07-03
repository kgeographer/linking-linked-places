$(function() {
  startMap();
});

function startMap(){
  console.log('starting a damned map')
  L.mapbox.accessToken = 'pk.eyJ1Ijoia2dlb2dyYXBoZXIiLCJhIjoiUmVralBPcyJ9.mJegAI1R6KR21x_CVVTlqw';
  // AWMC tiles in mapbox
  var map = L.mapbox.map('map', 'isawnyu.map-knmctlkh')
      // .setView([0, 0], 3);
      .setView([22.105998799750576, 25.576171875], 3); //

}
