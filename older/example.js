currentScale = 1;
scaleStep = .1;
redrawComplete = true;

function createTimelineViz() {
//    d3.json("collection01.json", function(data) {
//    sampleData = someCountriesKarl;
//    sampleDateType = "date";

    d3.json("../building77.json", function(data) {
    sampleDateType = "integer";
    
    sampleData = data;
    timelineZoom = d3.behavior.zoom()
    .on("zoom", redraw);

    svg = d3.select("#vizcontainer")
    .append("svg")
    .attr("width", 1000)
    .attr("height", 1000)
    .call(timelineZoom);
    
    tcLayout = new d3_layout_timeline()
    
    tcLayout.height(500).width(1000).featureCollection(sampleData);
    
    tProjection = tcLayout.projection();
    
    timeRamp = d3.scale.linear().domain([new Date(tProjection.project(tProjection.origin())),tProjection.project(tcLayout.range()[1])]).range([0,tcLayout.width()])

    timelineG = svg.append("g").attr("id", "timelineG");
    
    var timeRamp = d3.scale.linear().domain([0,5,10]).range(["blue","purple","yellow"])

    currentScale = tProjection.scale();
    scaleStep = currentScale / 10;
    
    timelineG.selectAll("rect.periods")
    .data(tcLayout.timePeriods())
    .enter()
    .append("rect")
    .style("fill", function(d,i) {return timeRamp(i)})
    .attr("class","periods")
    .attr("width", function(d) {return tProjection.project(d.tSpans, sampleDateType).width})
    .attr("height", 20)
    .attr("x", function(d) {return tProjection.project(d.tSpans[0], sampleDateType).x})
    .attr("y", function(d,i) {return (d.lane * 30) + 30})
    .on("click", labelThis)

    timelineG.selectAll("text.periods")
    .data(tcLayout.timePeriods())
    .enter()
    .append("text")
    .attr("class","periods")
    .attr("x", function(d) {return tProjection.project(d.tSpans[0], sampleDateType).x})
    .attr("y", function(d,i) {return (d.lane * 30) + 30})
    .style("font-size", "8px")
    .text(function(d) {return d.id})

    timelineG.selectAll("rect.events")
    .data(tcLayout.eventPeriods())
    .enter()
    .append("rect")
    .attr("class", "events")
//    .attr("width", function(d,i){return Math.max(2, (400 / ((d.laneArray[1] - d.laneArray[0]) * 30 + 20)))})
    .attr("width", function(d) {return tProjection.project(d.tSpans, sampleDateType).width})
    .attr("height", function(d,i){return (d.laneArray[1] - d.laneArray[0]) * 30 + 20})
    .style("fill", "gray")
    .style("stroke", "lightgray")
    .style("stroke-width", 2)
    .style("opacity", .5)
//    .attr("rx", 10)
//    .attr("ry", 10)
    .attr("x", function(d) {return tProjection.project(d.tSpans, sampleDateType).x})
    .attr("y", function(d,i) {return (d.laneArray[0] * 30) + 30})
    .on("click", labelThis)
    
    })

}

/// For tObjs
function createTimelineViz2() {
    d3.json("collection01.json", function(data) {

    sampleData = data;
    timelineZoom = d3.behavior.zoom()
    .on("zoom", redraw);

    svg = d3.select("#vizcontainer")
    .append("svg")
    .attr("width", 1000)
    .attr("height", 500)
    .call(timelineZoom);
    
    tcLayout = new d3_layout_timeline()
    
    tcLayout.height(500).width(1000).featureCollection(sampleData);
    
    tProjection = tcLayout.projection();
    
    timeRamp = d3.scale.linear().domain([new Date(tProjection.project(tProjection.origin())),tProjection.project(tcLayout.range()[1])]).range([0,tcLayout.width()])

    timelineG = svg.append("g").attr("id", "timelineG");
    
    var timeRamp = d3.scale.linear().domain([0,5,10]).range(["orange","lavender","blue"])

    currentScale = tProjection.scale();
    scaleStep = currentScale / 10;
    
    timelineG.selectAll("g.periods")
    .data(tcLayout.timePeriods())
    .enter()
    .append("g")
        .attr("class","periods")
            .on("click", labelThis)
//    .attr("translate", "transform(" + "," + ")")
    .each(function(d,i) {d3.select(this).selectAll("rect.periods").data(d.tObjs).enter()
        .append("rect")
        .style("fill", timeRamp(i))
        .style("opacity", function(p,q) { return q == 0 ? .5 : 1})
        .attr("class","periods")
        .attr("width", function(p) {return tProjection.project(p, "date").width})
        .attr("height", 20)
        .attr("x", function(p) {return tProjection.project(p, "date").x})
        .attr("y", (d.lane * 30) + 30)
          })

    timelineG.selectAll("g.events")
    .data(tcLayout.eventPeriods())
    .enter()
    .append("g")
    .attr("class", "events")    
    .on("click", labelThis)
    .each(function(d,i) {d3.select(this).selectAll("rect.events").data(d.tObjs).enter()
    .append("rect")
    .attr("class", "events")
//    .attr("width", function(d,i){return Math.max(2, (400 / ((d.laneArray[1] - d.laneArray[0]) * 30 + 20)))})
    .attr("width", function(p) {return tProjection.project(p, "date").width})
    .attr("height", (d.laneArray[1] - d.laneArray[0]) * 30 + 20)
    .style("fill", "none")
    .style("stroke", "lightgray")
    .style("stroke-width", 2)
    .style("opacity", .5)
//    .attr("rx", 10)
//    .attr("ry", 10)
    .attr("x", function(p) {return tProjection.project(p, "date").x})
    .attr("y", (d.laneArray[0] * 30) + 30)
    })
    
    })

}

function redraw() {
//    timelineG.attr("transform", "translate("+timelineZoom.translate()[0]+",0)");
    timelineG.attr("transform", "translate("+timelineZoom.translate()[0]+","+timelineZoom.translate()[1]+")");
}

function redraw2() {
    
    if (timelineZoom.scale() != tProjection.scale()) {
        if (redrawComplete == true) {
        if (timelineZoom.scale() < tProjection.scale()) {
            currentScale += scaleStep;
        }
        else {
            currentScale -= scaleStep;
        }
        timelineZoom.scale(currentScale);
        tProjection.scale(currentScale);
        redrawComplete = false;
        setTimeout(function(){redrawComplete = true},1000);
        }
        else {
            timelineZoom.scale(currentScale);
        }
    }

    timelineG.attr("transform", "translate("+timelineZoom.translate()[0]+",0)");
    
    timeRamp = d3.scale.linear().domain([new Date(tProjection.project(tProjection.origin())),tProjection.project(tcLayout.range()[1])]).range([0,tcLayout.width()])

    timelineG.selectAll("rect.periods")
    .transition()
    .duration(500)
    .attr("width", function(d) {return tProjection.project(d.tSpans, "date").width})
    .attr("x", function(d) {return tProjection.project(d.tSpans[0], "date").x})
    .attr("y", function(d,i) {return (d.lane * 30) + 30})

    timelineG.selectAll("rect.events")
    .transition()
    .duration(500)
//    .attr("width", function(d,i){return Math.max(2, (400 / ((d.laneArray[1] - d.laneArray[0]) * 30 + 20)))})
    .attr("width", function(d) {return tProjection.project(d.tSpans, "date").width})
    .attr("height", function(d,i){return (d.laneArray[1] - d.laneArray[0]) * 30 + 20})
    .attr("x", function(d) {return tProjection.project(d.tSpans, "date").x})
    .attr("y", function(d,i) {return (d.laneArray[0] * 30) + 30})

    
}

function labelThis(d,i) {
    var newLabel = "You clicked " + d.label;
    if (d.tSpans) {
        newLabel += " - " + d.tSpans.toString();
    }
    d3.select("#labels").html(newLabel);
}