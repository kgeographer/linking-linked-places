function timelineViz() {

    rowHeight = 200;
    zoomlevel = 2;
    isZooming = false;

    centerDate = new Date(1770,1,1);    
    
    xPoint = getJulian(centerDate);

    xScale = 36.5;
    d3.json("data/us_history.json", function(data) {
    exposedData = data;

    tlLayout = new d3_layout_timeline();
    tlLayout.periodCollection(exposedData);
    
    svg = d3.select("#vizContainer").append("svg")
    
    var timelineG = svg.append("g").attr("id", "timelineG").attr("transform", "translate(0, 40)")

    var mapG = svg.append("g").attr("id", "mapG").attr("transform", "translate(0, 90)")

    var legendG = svg.append("g").attr("id", "legendG").attr("transform", "translate(1070, 350)")

var projection = d3.geo.albersUsa()
    .scale(1000)
    .translate([400, 400]);

var path = d3.geo.path()
    .projection(projection);

d3.json("data/states.topojson", function(error, us) {
    
    exposedData = us;
  mapG.selectAll("path")
      .data(topojson.object(us, us.objects.states).geometries)
      .enter()
      .append("path")
      .attr("class", "land")
      .style("fill", "#990000")
      .attr("d", path);

});    

    timelineG.selectAll("g").data(tlLayout.timePeriods())
    .enter()
    .append("g")
    .attr("class", "overallPeriod")
//    .on("mouseover", timeOver)
//    .on("mouseout", timeOut)
    .attr("transform", function (d,i) {return "translate(0," + canvasPosition(d) + ")"})
    .each(function(d,i) {
        d3.select(this).selectAll("g.period").data(d.projectedTSpans)
          .enter()
          .append("g")
          .attr("class", "period")
          .each(function(p,q) {
            
                    if (p.d) {
                        d3.select(this)
                        .selectAll("line")
                        .data([p.s,p.e])
                        .enter()
                        .append("line")
                        .attr("class", "duringends")
                        .style("stroke", "purple")
                        .style("stroke-width", "2px")
                        .style("stroke-dasharray", "5 5");
                        
                        d3.select(this)
                        .append("line")
                        .attr("class", "duringline")
                        .style("stroke", "purple")
                        .style("stroke-width", "2px")
                        .style("stroke-dasharray", "5 5");
                        
                        d3.select(this)
            .append("rect")
          .attr("class", "tspan period")
          .attr("class", "periodduring")
          .style("opacity", d.level * .2)
          .style("stroke-width", 0);

                        
                    }
                        else{
            d3.select(this)
            .append("rect")
          .attr("class", "tspan period")
          .style("opacity", d.level * .2)
          .style("stroke-width", 0);
                    }
          if (p.ls) {
          d3.select(this)
            .append("rect")
          .attr("class", "tspan periodls")
          .style("fill", "blue")
          .style("stroke-width", 0);
          }
          if (p.ee) {
          d3.select(this)
            .append("rect")
          .attr("class", "tspan periodee")
          .style("fill", "blue")
          .style("stroke", "lightgray")
          .attr("rx", 5)
          .style("stroke-width", 0);
          }
        });
          
          })
    .append("text")
    .attr("class", "period")
    .text(function(d,i) {return i + " - " + d.label})
    .style("pointer-events", "none")
    .style("opacity", 0);

    adjustIn(tlLayout.periodStatistics.medianS);
    
    var tlX = d3.scale.linear()
    .domain([tlLayout.periodStatistics.earliestJulian, tlLayout.periodStatistics.latestJulian]).range([30, 1250])
    
    constraintBrush = d3.svg.brush().x(tlX).on("brush", brushed);
    d3.select("svg").append("g").attr("transform", "translate(0,0)").call(constraintBrush)
    .selectAll("rect").attr("height", 265).style("fill-opacity", .05)
    .style("stroke-width", "2px").style("stroke", "black").style("stroke-dasharray", "5,5");    

    d3.select("#legendG").selectAll("rect.legend")
    .data([0.1,.25,.5,.75,1])
    .enter()
    .append("rect").attr("width", 30).attr("height", 15)
    .attr("x", function(d,i) {return i * 30})
    .style("opacity", function (d) {return d})
    .style("fill", "#990000")

    d3.select("#legendG")
    .append("text")
    .attr("x", 0)
    .attr("y", -5)
    .attr("id", "legendTitle")
    .text("Years as a state")

    d3.select("#legendG")
    .append("text")
    .attr("x", 0)
    .attr("y", 30)
    .attr("id", "legendLeast")
    .text("left")
    
    d3.select("#legendG")
    .append("text")
    .attr("x", 150)
    .attr("y", 30)
    .attr("id", "legendMost")
    .attr("text-anchor", "end")
    .text("right")

    d3.select("#legendG")
    .append("text")
    .attr("x", -50)
    .attr("y", -60)
    .attr("id", "boundingTitle")
    .text("Click and drag on the timeline")

    d3.select("#legendG")
    .append("text")
    .attr("x", -50)
    .attr("y", -40)
    .attr("id", "boundingRegion")
    .text("to set a temporal bounding box")
    
    })
    
    

    
}

function brushed() {
    
    var earlyDate = constraintBrush.extent()[0];    
    var lateDate = constraintBrush.extent()[1];
    
    d3.select("#boundingTitle")
    .text("Current bounding box:")

    d3.select("#boundingRegion")
    .text(Math.floor((earlyDate / 365.25) - 4713) + " to " + Math.floor((lateDate / 365.25) - 4713))
    
    var prettyNumbers = d3.format("3.1f");
    var maxOverlap = lateDate - earlyDate;
    d3.select("#legendLeast").text(prettyNumbers((maxOverlap / 365) * .1))
    d3.select("#legendMost").text(prettyNumbers((maxOverlap / 365)))

    d3.selectAll("g.overallPeriod").each(
        function(d) {
        var thisOverlap = 0;
            for (x in d.projectedTSpans) {
            var overlap = Math.max(0,Math.min(d.projectedTSpans[x].e,lateDate) -  Math.max(d.projectedTSpans[x].s, earlyDate));
            
            thisOverlap = thisOverlap + overlap;
            }
            var earliestPer = d3.min(d.projectedTSpans, function(p) {return p.s});
            var latestPer = d3.max(d.projectedTSpans, function(p) {return p.e});
            if (earlyDate > earliestPer && lateDate < latestPer) {
                d3.select(this).selectAll("rect").style("stroke-width", "0");
            }
            else {
                d3.select(this).selectAll("rect").style("stroke-width", "1px");
            }
            d3.select(this).selectAll("rect").style("opacity", thisOverlap / maxOverlap);
            d3.selectAll("path.land").filter(function (el) {return el.properties.STATE_NAME == d.label}).style("opacity", thisOverlap / maxOverlap);
            
        }
    )

}

function redraw() {

        d3.selectAll("text.period")
            .transition()
            .duration(500)
    .attr("x", function(d) {return (d3.min(d.projectedTSpans, function(p) {return p.s}) - xPoint) / xScale})
    .attr("y", -5)
    .style("opacity", 0);


    d3.selectAll("g.overallPeriod")
    .transition()
    .duration(500)
    .attr("transform", function (d,i) {return "translate(0," + canvasPosition(d) + ")"});

    d3.selectAll("g.overallPeriod")
    .each(function(d,i) {
        var newStyle = levelAdjust(d.level);
        d3.select(this).selectAll("g.period")
          .each(function(p,q) {
        
        if (p.d) {
            
        d3.select(this).selectAll("line.duringends")
            .transition()
            .duration(500)
          .attr("x1", function (g) {return (g - xPoint) / xScale})
          .attr("x2", function (g) {return (g - xPoint) / xScale})
          .attr("y1", 0)
          .attr("y2", periodHeight(d) * (d.lanerange[1] - d.lanerange[0] + 1));

        d3.select(this).selectAll("line.duringline")
            .transition()
            .duration(500)
          .attr("x1", (p.s - xPoint) / xScale)
          .attr("x2", (p.e - xPoint) / xScale)
          .attr("y1", periodHeight(d) * (d.lanerange[1] - d.lanerange[0] + 1) / 2)
          .attr("y2", periodHeight(d) * (d.lanerange[1] - d.lanerange[0] + 1) / 2);

            d3.select(this).selectAll("rect.periodduring")
            .transition()
            .duration(500)
          .attr("x", (((p.e + p.s) / 2) - (p.d / 2) - xPoint) / xScale)
          .attr("width", ((p.d) / xScale))
          .attr("height", periodHeight(d) * (d.lanerange[1] - d.lanerange[0] + 1))
          .style("fill", d.estimated == true ? "lightgray" : "#990000")
          .style("stroke", "black")
          .style("fill-opacity", newStyle.fillOpac)
          .style("stroke-dasharray", newStyle.dasharray)
          .style("stroke-width", newStyle.strokeWidth);
                        
                      }
        else {
            d3.select(this).selectAll("rect.period")
            .transition()
            .duration(500)
          .attr("x", (p.s - xPoint) / xScale)
          .attr("width", ((p.e - xPoint) / xScale) - ((p.s - xPoint) / xScale) > 0 ? ((p.e - xPoint) / xScale) - ((p.s - xPoint) / xScale) : 20)
          .attr("height", periodHeight(d) * (d.lanerange[1] - d.lanerange[0] + 1))
          .style("fill", d.estimated == true ? "lightgray" : "#990000")
          .style("stroke", "black")
          .style("fill-opacity", newStyle.fillOpac)
          .style("stroke-dasharray", newStyle.dasharray)
          .style("stroke-width", newStyle.strokeWidth);
        }
          if (p.ls) {
          d3.select(this)
          .selectAll("rect.periodls")
            .transition()
            .duration(500)
          .attr("x", (p.s - xPoint) / xScale)
          .attr("width", ((p.ls - xPoint) / xScale) - ((p.s - xPoint) / xScale) > 0 ? ((p.ls - xPoint) / xScale) - ((p.s - xPoint) / xScale) : 20 )
          .attr("height", periodHeight(d) * (d.lanerange[1] - d.lanerange[0] + 1))
          .style("fill", "blue")
          .style("stroke", "lightgray")
          .style("fill-opacity", newStyle.fillOpac)
          .style("stroke-dasharray", newStyle.dasharray)
          .style("stroke-width", newStyle.strokeWidth);
          }
          if (p.ee) {
          d3.select(this)
          .selectAll("rect.periodee")
            .transition()
            .duration(500)
          .attr("x", (p.ee - xPoint) / xScale)
          .attr("width", ((p.e - xPoint) / xScale) - ((p.ee - xPoint) / xScale) > 0 ? ((p.e - xPoint) / xScale) - ((p.ee - xPoint) / xScale) : 20)
          .attr("height", periodHeight(d) * (d.lanerange[1] - d.lanerange[0] + 1))
          .style("fill", "blue")
          .style("stroke", "lightgray")
          .style("stroke-dasharray", newStyle.dasharray)
          .style("fill-opacity", newStyle.fillOpac)
           .style("stroke-width", newStyle.strokeWidth);
         }
        });
          
          })
}

function getJulian(incDate) {
    return Math.floor((incDate / 86400000) - (incDate.getTimezoneOffset()/1440) + 2440587.5);
}

function adjustIn(definedCenter) {
    var svgCenter = (parseInt(d3.select("svg").style("width")) / 2);
    var oldCenter = (svgCenter * xScale) + xPoint;
    definedCenter = definedCenter || oldCenter;
    xScale = xScale * 2;
    var offSet = svgCenter - ((definedCenter - xPoint) / xScale);
    
    redraw();
}

function adjustOut(definedCenter) {
    var svgCenter = (parseInt(d3.select("svg").style("width")) / 2);
    var oldCenter = (svgCenter * xScale) + xPoint;
    definedCenter = definedCenter || oldCenter;
    xScale = xScale / 2;
    var offSet = svgCenter - ((definedCenter - xPoint) / xScale);

    redraw();
}

function zoomOut() {
    if (isZooming == true) {
        return;
    }
    isZooming = true;
    var zoomTimer = setTimeout('zoomBusy()', 500);

    zoomlevel++;
    rowHeight = zoomlevel * 50;
    redraw();
}

function zoomIn() {
    if (isZooming == true) {
        return;
    }
    isZooming = true;
    var zoomTimer = setTimeout('zoomBusy()', 500);

    zoomlevel--;
    rowHeight = zoomlevel * 50;
    redraw();
}

function levelAdjust(incLevel) {
    var computedStyle = {fillOpac: 0, strokeWidth: 0, strokeOpac: 0, dasharray: "1"}
    var levelDifference = incLevel - zoomlevel;
    switch(levelDifference) {
        case -1:
            computedStyle.fillOpac = 0;
            computedStyle.strokeOpac = 0;
            computedStyle.strokeWidth = 0;
            computedStyle.dasharray = "10,10"
            break;
        case 0:
            computedStyle.fillOpac = 1;
            computedStyle.strokeOpac = 0;
            computedStyle.strokeWidth = 0;
            computedStyle.dasharray = "0"
            break;
        
        case 1:
            computedStyle.fillOpac = .5;
            computedStyle.strokeOpac = 0;
            computedStyle.strokeWidth = 0;
            computedStyle.dasharray = "0"            
            break;
    }
    return computedStyle;
}

function timeOut(d,i) {
 d3.selectAll("g.overallPeriod").each(function(d) {var newStyle = levelAdjust(d.level);d3.select(this).selectAll("rect.tspan").style("stroke-width",newStyle.strokeWidth + "px")});
    d3.select(this).selectAll("line").style("stroke-width","2px");
 d3.select(this).select("text").style("opacity", 0);
}

function timeOver(d,i) {
    d3.select(this).selectAll("rect").style("stroke-width","2px");
    d3.select(this).selectAll("line").style("stroke-width","1px");
    d3.select(this).select("text").style("opacity", 1);
    d3.selectAll("g.overallPeriod").filter(function(p) {return p.partof == d ? this : null})
    .selectAll("rect").style("stroke-width", "1px")
}

function zoomBusy() {
    isZooming = false;
}

function periodHeight(incPeriod) {
    var lanes = tlLayout.laneArray();
    
    for (x in lanes) {
        if (lanes[x]) {
            for (y in lanes[x]) {
                for (z in lanes[x][y]) {
                if (lanes[x][y][z] == incPeriod) {
                    if (x == "base") {
                        return rowHeight;
                    }
                    else {
                        var lanLen = lanes[x].length;
                        var perH = periodHeight(incPeriod.partof);
                        return perH / lanLen;
                    }
                }
                }
            }
        }
    }
    return 10;
}

function canvasPosition(d) {
    var finished = false;
    var movingY = 0;
    var nextParent = d;
    while(finished == false) {
        if (nextParent.partof) {
            movingY += (nextParent.lanerange[0] * periodHeight(nextParent))  * 1.1;
            nextParent = nextParent.partof;
        }
        else {
            movingY += (nextParent.lanerange[0] * periodHeight(nextParent))  * 1.1;
            finished = true;
        }
    }
    return movingY;
}