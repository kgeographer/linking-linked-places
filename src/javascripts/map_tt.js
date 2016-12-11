var url = require('url'),
    // $ = require('jquery'),
    querystring = require('querystring')
    // , d3 = require('d3')
// require('bootstrap')
var d3 = Object.assign({}, require("d3"), require("d3-scale"));
require('mapbox.js')
window.moment = require('moment');
moment().format();

// import add'l app JavaScript
import './bloodhound.js';
// require('@turf/centroid')
// require('@turf/buffer')

// exposed for debugging
window.parsedUrl = url.parse(window.location.href, true, true);
window.searchParams = querystring.parse(parsedUrl.search.substring(1));
// window.cent = ctr
// window.buff = buf
window.features = {};
window.d3graph = {"nodes":[], "links":[]}
window.idToFeature = {};
// TODO; simile doesn't seem able to handle BCE well
// window.eventsObj = {'dateTimeFormat': 'Gregorian','events':[ ]};
window.eventsObj = {'dateTimeFormat': 'iso8601','events':[ ]};
window.myLayer = {};
window.pointFeatures = [];
window.lineFeatures = [];
window.bboxFeatures = [];
window.tl = {};
window.tlMidpoint = '';
window.dataRows = '';
window.timelineCounter = 0;

$(function() {
  // TODO: restore state in href approach (?)
  Object.getOwnPropertyNames(searchParams).length == 0 ?
    startMapM() : startMapM(searchParams['d'],searchParams['p'])
  $("#menu").click(function(){
    $("#data").toggle("fast")
  })
  $(".data-header").html(searchParams['d'])
  $("input:checkbox").change(function(){
    if(this.checked == true) {
      if(searchParams['p'] == undefined) {
        ga('send', 'event', ['Layers'], ['Check'], ['Data panel']);
        $(".loader").show()
        loadLayer(this.value)
      } else {
        location.href = location.origin+location.pathname+'?d='+this.value;
      }
    } else {
      // one set of events at a time right now
      eventSrc.clear()
      zapLayer(this.value)
    }
  })
  $('[data-toggle="popover"]').popover();
  $('.panel-title i').click(function(){
    window.open('http://kgeographer.com/?p=140&preview=true', '', 'width=700');
  })
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

window.initTimeline = function(events,dataset) {
  // console.log(events)
  // custom timeline click event
  Timeline.OriginalEventPainter.prototype._showBubble = function(x, y, evt) {
    ga('send', 'event', ['Timeline'], ['Click event'], ['Timeline']);
    // popup segment event/period
    window.evt = evt
    console.log('timeline evt obj', evt)
    let name_s = 'segments_'+dataset
    features[name_s].setStyle({'color':'gray'})

    // journey segment popup on map
    if(tlConfig[dataset].type == 'journey'){
      // case dataset is journey(s)
      idToFeature[dataset].segments[evt._id].openPopup()
        .setStyle({'color':'red'})
      idToFeature[dataset].segments[evt._id].on("popupclose", function(e){
        this.setStyle({'color':'gray'})
      })
      ttmap.fitBounds(idToFeature[dataset].segments[evt._id].getBounds())
    } else {
      $('#period_modal .modal-header h4').html(evt._text)
      $('#period_modal .modal-body p').html(evt._description+"<br/>"
        +evt._start.getFullYear()
        +";"+evt._latestStart.getFullYear()
        +";"+evt._earliestEnd.getFullYear()
        +";"+evt._end.getFullYear()
        )
      $('#period_modal').modal('show');
    }
  }

  window.eventSrc = new Timeline.DefaultEventSource(0);
  // Example of changing the theme from the defaults
  // The default theme is defined in
  // http://simile-widgets.googlecode.com/svn/timeline/tags/latest/src/webapp/api/scripts/themes.js
  var theme = Timeline.ClassicTheme.create();
  theme.event.bubble.width = 320;
  // theme.event.bubble.height = 300;
  theme.ether.backgroundColors[1] = theme.ether.backgroundColors[0];

  let cfg = tlConfig[dataset]
  var d = Timeline.DateTime.parseGregorianDateTime(tlMidpoint)
  // var d = Timeline.DateTime.parseGregorianDateTime(tlMidpoint)
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

  window.tl = Timeline.create(document.getElementById("tl"), bandInfos, Timeline.HORIZONTAL);
  // from the dynamic object; no idea why it needs a dummy url
  eventSrc.loadJSON(events, 'dummyUrl');

  timelineCounter += 1;
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

window.fixDate = function(d){
  let foo = moment(d).toISOString()
  return foo;
}

function buildSegmentEvent(feat){
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
  // console.log(' in buildCollectionPeriod()',coll.when.timespan)
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
  segments: {
    color: "gray",
    weight: 3,
    opacity: 0.6,
    highlight: {
      color: "red"
    }
  },
  places: {
    color: '#000',
    fillColor: '#ffff00',
    radius: 4,
    fillOpacity: 0.8,
    weight: 1
  },
  bbox: {
    color: 'orange',
    fillColor: '#eeeee0',
    fillOpacity: 0.6,
    weight: 1
  }
}

function summarizeEvents(eventsObj){
  // get bounds, midpoint, granularity
  // multi-day, -week, -month, -year
  console.log(eventsObj)
}

function style(feature) {
  window.feat = feature
  var colorMap = {"ra":"#ffff80","courier":"#ff9999","incanto":"#ffb366",
    "vb":"#b380ff","xuanzang":"#99e699"}
  let fill=colorMap[feature.toGeoJSON().properties.collection]
  // console.log(coll)
	return {
      color: '#000',
      fillColor: fill,
      radius: 4,
      fillOpacity: 0.6,
      weight: 1
    };
}

function parseWhen(when) {
  console.log(when.timespan[0])
  let html = "<div class='segment-when'>";
  html+="start: "+when.timespan[0]+"-"+when.timespan[1]+"<br/>"+
        "end: "+when.timespan[2]+"-"+when.timespan[3]+"<br/>"+
        "duration: "+when.duration==""?"throughout":when.duration+"</div>"
  return html;
}

function listFeatureProperties(props,when){
  let html = "<ul class='ul-segments'>"
  // console.log(JSON.stringify(when.timespan))
  // only non-standard properties
  for(let key of Object.keys(props)) {
    if(["source","target","route_id","segment_id","label","collection"].indexOf(key) < 0) {
      html += "<li><b>"+key+"</b>: "+props[key]+"</li>"
    }
  }
  html += "</ul><div class='segment-when'><p><b>when</b>:</p>"
  // html += parseWhen(when)
  html += "";
  html+="<em>start</em>: "+when.timespan[0]+(when.timespan[1]==""?"":"-"+when.timespan[1])+"<br/>"+
        "<em>end</em>: "+when.timespan[2]+(when.timespan[3]==""?"":"-"+when.timespan[1])+"<br/>"+
        "<em>duration</em>: "+(when.duration==""?"throughout":when.duration)+
        "</div>"
  return html;
}

window.loadPeriods = function(uri){
  // console.log('loadPeriods()',uri)
  $.when(
    // vanilla
    $.ajax({
      url: uri,
      dataType: 'json',
      type: 'get',
      crossDomain: true,
      success: function(data) {
        // window.pdata = data
        // console.log('period data',data)
        $("#period_pre").html(JSON.stringify(data,undefined,2))
        // $.each(data, function(i, field){
        //     $("#period_modal .modal-body").append(field + " <br/>");
        //     // $("#period_modal .modal-body").append(field + " ");
        // })
      }
    })
  ).done(function(){
    $(".loader").hide()
    $("#period_modal .modal-title").html(uri)
    $("#period_modal").modal(); })
}

function writeCard(dataset,attribs){
  // write card and replace intro or append to div#data_abstract
  let html = writeAbstract(attribs)
  html += "download:" +
    " <a href='#' data='"+dataset+"' type='geojson-t'>GeoJSON-T</a>";
  if(["incanto-f","courier"].indexOf(dataset) > -1){
    html += "; <a href='#' data='"+dataset+"' type='d3'>D3 graph</a></div>";
  } else {
    html += "</div>";
  }
  if($("#data_abstract_intro").html() == undefined) {
    $("#data_abstract").append(html);
  } else {
    $("#data_abstract_intro").replaceWith(html);
  }
  $("#data_abstract a").click(function(e){
    download(e.currentTarget.attributes.type.value,
      e.currentTarget.attributes.data.value)
  })
}

function writeAbstract(attribs){``
  // console.log('writeAbstract() attribs',attribs)
  if(attribs.periods){
    var foo = '<span class="span-link" onclick="loadPeriods(\''+attribs.periods[0]+'\')">'
  }
  let html = "<div id='"+attribs.lp_id+
    "' class='project-card'><span class='project-card-title'>"+
    attribs.short_title+"</span>"
  html += '<p><b>Date</b>: '+attribs.pub_date+'</p>'+
    '<p><b>Contributor(s)</b>: '+attribs.contributors+'<p>'
  html += attribs.periods?
    '<p><b>Period(s)</b>: '+ foo +
    attribs.periods[0]+'</span><p>':''
  html += '<p>'+attribs.description+'</p>'
  return html
}

window.buildGraph = function(){
  var edgeScale = d3.scaleLinear()
    .domain([1,100])
    .range([1,5])

  // console.log('current d3graph',d3graph)
  var svg = d3.select(".modal-body svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  var color = d3.scaleOrdinal(d3.schemeCategory20);

  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

  // var graph = JSON.parse(d3graph)
  // for now, use data in d3graph{}, built on each loadLayer()
  // d3.json(d3graph, function(error, graph) {
  // d3.json(JSON.parse(d3graph), function(error, graph) {
    // if (error) throw error

    var link = svg.append("g")
        .attr("class", "links")
      .selectAll("line")
      .data(d3graph.links)
      .enter().append("line")
        .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

    var node = svg.append("g")
        .attr("class", "nodes")
      .selectAll("circle")
      .data(d3graph.nodes)
      .enter().append("circle")
        .attr("r", 5)
        .attr("fill", function(d) { return color(d.group); })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    node.append("title")
        .text(function(d) { return d.id; });

    simulation
        .nodes(d3graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(d3graph.links);

    function ticked() {
      link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    }

    // });

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

}

function download(type, data){
  // console.log('download', type,data)
  switch(type) {
    case "d3":
      ga('send', 'event', ['Graph'], ['Click'], ['Linked Data']);
      // console.log('make d3 dataset for '+data+' and load it in force layout somewhere');
      $(".modal-body svg").html('')
      $(".modal-title").html(data)
      // for now, use data in d3graph{}, built on each loadLayer()
      // if(["incanto-f","courier"])
      $(".modal-body").html(buildGraph())
      $('#graph_modal').modal('show');

      break;
    case "geojson-t":
      ga('send', 'event', ['Download'], ['Click'], ['Linked Data']);
      window.open('data/'+data+'.geojson')
      console.log('deliver GeoJSON-T for '+data+' to browser');
      break;
  }
}

window.zapLayer = function(dataset) {
  // uncheck it
  $("input:checkbox[value='"+dataset+"']").prop('checked',false);
  //remove its card from data panel
  $("#lp_"+dataset).remove();
  // remove all div.place-card
  $(".place-card").remove();
  // remove
  // remove its data from the map
  let name_p = "places_"+dataset;
  let name_s = "segments_"+dataset;
  features[name_p].removeFrom(ttmap);
  features[name_s].removeFrom(ttmap);
}

window.loadLayers = function(arr) {
  // what is already loaded?
  var loadedIDs = $("#data_layers input:checkbox:checked").map(function(){
    return $(this).val();
  }).get();
  // console.log('conflate:',arr,loadedIDs)
  for(let i in loadedIDs){
    if(arr.indexOf(loadedIDs[i]) < 0){
      zapLayer(loadedIDs[i])
    }
  }
  for(let i in arr){
    if(loadedIDs.indexOf(arr[i]) <0){
      // console.log('loading',arr[i])
      // TODO: multiple datasets per project is an issue
      loadLayer(arr[i]=='incanto'?'incanto-f':arr[i])
    }
  }
}

function startMapM(dataset=null){
  bboxFeatures = []
  // var bboxGroup = L.featureGroup()
  // mapbox.js (non-gl)
  L.mapbox.accessToken = 'pk.eyJ1Ijoia2dlb2dyYXBoZXIiLCJhIjoiUmVralBPcyJ9.mJegAI1R6KR21x_CVVTlqw';
  // AWMC tiles in mapbox
  window.ttmap = L.mapbox.map('map', 'isawnyu.map-knmctlkh', {attributionControl: false})
    .setView(L.latLng(40.4165,-3.70256),3)
  var credits = L.control.attribution().addTo(ttmap);
  credits.addAttribution('Tiles and Data © 2013 AWMC CC-BY-NC 3.0 ')
  // window.ttmap = L.mapbox.map('map') // don't load basemap
  if(dataset != null) {loadLayer(dataset);} else {
    // load bboxes
    var bboxLayer = L.mapbox.featureLayer()
      .loadURL('data/bb_all.geojson')
      .on('ready', function(){
        bboxLayer.eachLayer(function(layer){
          bboxFeatures.push(layer)
          layer.bindPopup(blurbs[layer.feature.properties.project],{ closeButton: false})
            .setStyle(mapStyles.bbox)
            .on("mouseover", function(e){
              layer.setStyle({"weight":3});
              layer.openPopup();
            })
            .on("mouseout", function(e){
              layer.setStyle(mapStyles.bbox);
              layer.closePopup();
            })
            // layer.addTo(ttmap)
            layer.on("click", function(e){
              layer.closePopup();
              $('.leaflet-overlay-pane svg g .leaflet-interactive').remove()
              loadLayer(layer.feature.properties.project)
            })
        })
        features['bboxes'] = L.featureGroup(bboxFeatures).addTo(ttmap)
      })
    // global to start
    ttmap.setView(L.latLng(32.6948,47.4609),2)
    // Madrid: (L.latLng(32.6948,-3.70256),2)
  }
}

window.loadLayer = function(dataset) {
    features.bboxes.removeFrom(ttmap)
    // clear feature arrays
    pointFeatures = [];
    lineFeatures = [];
    d3graph.nodes = [];
    d3graph.links = [];
    eventsObj.events = [];
    // map id to leaflet layer object
    window.idToFeature[dataset] = {places:{}, segments:{}}

    // TODO: resume managing state in window.href
    // if(searchParams['p'] != undefined){
    //   $("#results_inset").html('<p>Dataset: '+searchParams['d']+
    //     '</p><p>Place:'+searchParams['p']+'</p>')
    // }

    // check in case layer was loaded programatically
    $(":checkbox[value="+dataset+"]").prop("checked","true")

    /*  read a single FeatureCollection of
        Places (geometry.type == Point), and
        Routes (geometry.type == GeometryCollection or undefined)
          - route geometry.geometries[i] == LineString or MultiLineString
    */
    let featureLayer = L.mapbox.featureLayer()
      .loadURL('data/' + dataset + '.geojson')
      .on('ready', function(){
        // get Collection attributes into right panel
        var collection = featureLayer._geojson

        // write dataset card for data panel
        writeCard(dataset,collection.attributes)

        // set period midpoint for timeline
        tlMidpoint = midpoint(collection.when.timespan,'mid')

        // build separate L.featureGroup for points & lines
        featureLayer.eachLayer(function(layer){
          let geomF = layer.feature.geometry
          let whenF = layer.feature.when

          // put places features in pointFeatures array
          if(geomF.type == 'Point') {
              let latlng = new L.LatLng(geomF.coordinates[1],geomF.coordinates[0])

              var placeFeature = new L.CircleMarker(latlng,style(layer))
              // var placeFeature = new L.CircleMarker(latlng, mapStyles.places)
              // console.log(placeFeature)
              let gazURI = layer.feature.properties.gazetteer_uri

              var popContent = $('<a href="#" gaz="'+gazURI+'">'+
                // layer.feature.properties.toponym+'<br/>'+
                (dataset=='courier'?'TGAZ record':dataset=='vicarello'?'Pleiades record':
                  ['roundabout','xuanzang'].indexOf(dataset)>-1?'Geonames record':'')+'</a>')
                .click(function(e){
                  ga('send', 'event', ['Map'], ['Gaz lookup'], ['Linked Data']);
                  // console.log('gonna get and parse gaz json here',gazURI)
                  $(".loader").show()
                  $.when(
                    $.getJSON(gazURI, function(result){
                      // console.log(result)
                      $("#gaz_pre").html(JSON.stringify(result,undefined,2))
                      // $.each(result, function(i, field){
                      //     $("#gaz_modal .modal-body").append(field + " ");
                      // })
                    })
                  ).done(function(){
                    $(".loader").hide()
                    $("#gaz_modal .modal-title").html(gazURI)
                    $("#gaz_modal").modal(); })
                })
              var searchLink = $('<p class="popup-find-links"><a href="#">Find connections</a></p>')
                .click(function(e){
                  let placeObj = {};
                  placeObj[layer.feature.id]= [dataset,layer.feature.properties.toponym];
                  segmentSearch(placeObj)
                  // alert('one day soon, this will run a search against the index, '+
                  //   'with the same results as using the search feature')
                })

                // for(let i=0;i<obj.data.length;i++){
                //   let project = collections[obj.data[i].source_gazetteer];
                //   // gather place_ids from 'conflation_of' records
                //   placeObj[obj.data[i].id] = [project, obj.data[i].title];
                // }
                // get segments and display in #results_inset
                // segmentSearch(placeObj);

              var toponym = $('<div />').html('<p>'+layer.feature.properties.toponym+'</p>')
                // .append(popContent)[0]
                .append(popContent, searchLink)[0];

              placeFeature.bindPopup(toponym)
              placeFeature.on("click",function(){
                ga('send', 'event', ['Map'], ['Click place'], ['Map']);
              })
              // placeFeature.on("click", function(e){
              //   alert('this will query the ElasticSearch index...')
              // })
              pointFeatures.push(placeFeature)
              var pid = layer.feature.id
              idToFeature[dataset].places[pid] = placeFeature
              // add to links for graph viz for some
              if(["incanto-f","courier"].indexOf(dataset) > -1) {
                    d3graph.nodes.push({"id":pid, "group":"1"})
                  }
          }

          // the rest are line features for routes/segments in GeometryCollection
          else if(geomF.type == 'GeometryCollection') {
            // console.log('layer.feature', layer.feature)
            //* TODO: create feature for each geometry
            // dataRows = '<table><hr><td>id</td><td>label</td></hr>'
            for(let i in geomF.geometries) {
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
                var segment = new L.GeoJSON(feat, {
                  style: mapStyles.segments
                }).bindPopup('<b>'+feat.properties.label+'</b><br/>'+
                  listFeatureProperties(feat.properties,feat.when))
                segment.on("click", function(e){
                  ga('send', 'event', ['Map'], ['Click segment'], ['Map']);
                  var leafletId = e.layer._leaflet_id
                  // console.log('clicked this',this)
                  this.setStyle(mapStyles.segments.highlight)
                  // reset color on timeline
                  $(".timeline-event-label").removeClass('timeline-segment-highlight')
                  let date = e.layer.feature.when.timespan[0]
                  // label-tl-1-0-5001-6
                  var labelId = '#label-tl-'+(timelineCounter - 1)+'-0-'+
                    feat.properties.segment_id
                  // console.log(dataset, feat.properties.segment_id)
                  // console.log(idToFeature[dataset].segments)
                  ttmap.fitBounds(idToFeature[dataset].segments[feat.properties.segment_id].getBounds())
                  // console.log(labelId)
                  $(labelId)[0].className += ' timeline-segment-highlight'
                  tl.getBand(0).setCenterVisibleDate(Timeline.DateTime.parseGregorianDateTime(date))
                }).on("popupclose",function(e){
                  this.setStyle(mapStyles.segments);
                  $(".timeline-event-label").removeClass('timeline-segment-highlight')
                })
                // map id to map feature
                lineFeatures.push(segment)

                // var sid = feat.properties.route_id
                var sid = feat.properties.hasOwnProperty('segment_id') ?
                  feat.properties.segment_id : feat.properties.route_id
                idToFeature[dataset].segments[sid] = segment

                // add to links for graph viz; skip any with blank target
                if(feat.properties.source != '' && feat.properties.target != ''
                    && ["incanto-f","courier"].indexOf(dataset) > -1) {
                  d3graph.links.push({"id":sid, "source": feat.properties.source,
                    "target": feat.properties.target, "value": dataset=='incanto-f'?
                      feat.properties.num_journeys:"1"})
                }

                //* build event object for timeline
                if (whenObj != ({} || '')) {
                  if (collection.attributes.segmentType == 'journey') {
                    eventsObj.events.push(buildSegmentEvent(feat));
                    // console.log(buildSegmentEvent(feat))
                  }
                }
            }
            if(eventsObj.events.length == 0) {
              // needs a period, not bunch of events
              eventsObj.events.push(buildCollectionPeriod(collection))
              // console.log('build',buildCollectionPeriod(collection))
              // console.log('period eventsObj', eventsObj.events[0])
            }
          } else {
            console.log(whenF == undefined ? 'whenF undef' : whenF)
          }
        })
        // featureGroup pairs as layers
        let name_p = "places_"+dataset
        let name_s = "segments_"+dataset
        features[name_s] = L.featureGroup(lineFeatures).addTo(ttmap)
        features[name_p] = L.featureGroup(pointFeatures).addTo(ttmap)

        // TODO: reconfigure managing state in window.href
        if(searchParams['p'] != undefined) {
          ttmap.setView(idToFeature[dataset].places[searchParams['p']].getLatLng(),8)
          idToFeature[dataset].places[searchParams['p']].openPopup()
        } else {
          ttmap.fitBounds(features[name_p].getBounds())
        }

        // load timeline
        initTimeline(eventsObj,dataset)
      })
      $(".loader").hide()
}
$(".leaflet-popup-content a").click(function(e){
  e.preventDefault();
  console.log(e)
})

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
