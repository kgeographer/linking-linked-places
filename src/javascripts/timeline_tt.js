var tl;

function initTimeline(foo) {
  console.log(foo)
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

  tl = Timeline.create(document.getElementById("tl"), bandInfos, Timeline.HORIZONTAL);
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
