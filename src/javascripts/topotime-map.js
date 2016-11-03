// $(function() {
  // startMap();
// });

var tl;
function onLoad() {
  var eventSource = new Timeline.DefaultEventSource();
  var bandInfos = [
    Timeline.createBandInfo({
        width:          "70%",
        intervalUnit:   Timeline.DateTime.MONTH,
        intervalPixels: 100
    }),
    Timeline.createBandInfo({
        width:          "30%",
        intervalUnit:   Timeline.DateTime.YEAR,
        intervalPixels: 200
    })
  ];
  bandInfos[1].syncWith = 0;
  bandInfos[1].highlight = true;

  tl = Timeline.create(document.getElementById("timeline"), bandInfos);
  Timeline.loadXML("data/monet.xml", function(xml, url) { eventSource.loadXML(xml, url); });
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

function startMap(){
  console.log('starting a damned map')
  L.mapbox.accessToken = 'pk.eyJ1Ijoia2dlb2dyYXBoZXIiLCJhIjoiUmVralBPcyJ9.mJegAI1R6KR21x_CVVTlqw';
  // AWMC tiles in mapbox
  var map = L.mapbox.map('map', 'isawnyu.map-knmctlkh')
      // .setView([0, 0], 3);
      .setView([22.105998799750576, 25.576171875], 3); //

}
