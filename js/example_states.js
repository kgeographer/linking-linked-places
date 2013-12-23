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
    
    svg = d3.select("#vizContainer").append("svg").style("width", "1200px").style("height", "800px")
    
    var timelineG = svg.append("g").attr("id", "timelineG").attr("transform", "translate(0, 40)")

    var mapG = svg.append("g").attr("id", "mapG").attr("transform", "translate(0, 90)")

    var legendG = svg.append("g").attr("id", "legendG").attr("transform", "translate(90, 210)").style("pointer-events", "none")

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
      .style("stroke", "#990000")
      .style("stroke-width", "1px")
      .attr("d", path)
      .on("mouseover", stateOver)
      .on("mouseout", stateOut)


       resetBrush();
}); 

    tlX = d3.scale.linear()
    .domain([tlLayout.periodStatistics.earliestJulian, tlLayout.periodStatistics.latestJulian]).range([30, 800])

    timelineG.selectAll("g").data(tlLayout.timePeriods())
    .enter()
    .append("g")
    .attr("class", "overallPeriod")
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
    d3.select(this).append("text")
    .attr("class", "period")
    .text(i + " - " + d.label)
    .style("pointer-events", "none")
    .style("opacity", 0)
    .style("stroke", "white")
    .style("stroke-width", "4px")
    .style("stroke-opacity", .75);
    d3.select(this).append("text")
    .attr("class", "period")
    .text(i + " - " + d.label)
    .style("pointer-events", "none")
    .style("opacity", 0);

          })

    redraw();
    
    constraintBrush = d3.svg.brush().x(tlX).on("brush", brushed).on("brushend", brushEnd);;
    d3.select("svg").append("g").attr("id", "brushG").attr("transform", "translate(0,0)").call(constraintBrush)
    .selectAll("rect").attr("height", 265).style("fill-opacity", .05)
    .style("stroke-width", "2px").style("stroke", "black").style("stroke-dasharray", "5,5");    

    var arc = d3.svg.arc()
    .outerRadius(20)
    .startAngle(0)
    .endAngle(function(d, i) { return i ? -Math.PI : Math.PI; });
        
    d3.select("#brushG").selectAll(".resize").append("path")
    .attr("transform", "translate(0,132)")
    .attr("d", arc)
    .style("fill", "black")
    .style("stroke", "black")
    .style("stroke-width", "2px")
    .style("fill-opacity", .5)
    
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
    .attr("x", 0)
    .attr("y", -50)
    .attr("id", "boundingTitle")
    .style("font-weight", "bold")
    .text("Click and drag on the timeline")

    d3.select("#legendG")
    .append("text")
    .attr("x", 0)
    .attr("y", -30)
    .attr("id", "boundingRegion")
    .style("font-weight", "bold")
    .text("to set a temporal bounding box")
    
    })
    
    

    
}

function resetBrush() {
    
    var randomStart = tlLayout.periodStatistics.earliestJulian + (Math.random() * (tlLayout.periodStatistics.latestJulian - tlLayout.periodStatistics.earliestJulian))
    var randomEnd = Math.min(tlLayout.periodStatistics.latestJulian,randomStart + (365 * 10))
    
	constraintBrush.extent([randomStart,randomEnd]);
	d3.select("#brushG").call(constraintBrush.extent([randomStart,randomEnd]));
        brushed();

}


function brushed() {
    var earlyDate = constraintBrush.extent()[0];    
    var lateDate = constraintBrush.extent()[1];
    
    d3.select("#boundingTitle")
    .text("Period:")

    d3.select("#boundingRegion")
    .text(Math.floor((earlyDate / 365.25) - 4712) + " to " + Math.floor((lateDate / 365.25) - 4712))
    
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
                var thisStroke = "black";
            if (earlyDate > earliestPer && lateDate < latestPer) {
                thisStroke = "#990000";
            }
            d3.select(this).selectAll("rect").style("opacity", thisOverlap / maxOverlap).style("stroke", thisStroke);
            d3.selectAll("path.land").filter(function (el) {return (el.properties.STATE_NAME == d.label && (el.properties.STATE_NAME != "West Virginia" || constraintBrush.extent()[0] >= 2401570  || constraintBrush.extent()[1] >= 2401570) && (el.properties.STATE_NAME != "Maine" || constraintBrush.extent()[0] >= 2385911  || constraintBrush.extent()[1] >= 2385911)) || (el.properties.STATE_NAME == "Maine" && d.label == "Massachusetts" && constraintBrush.extent()[0] < 2385911) || (el.properties.STATE_NAME == "West Virginia" && d.label == "Virginia" && constraintBrush.extent()[0] < 2401570)})
            .style("fill-opacity", thisOverlap / maxOverlap).style("stroke-opacity", (thisOverlap / maxOverlap) * 2).style("stroke", thisStroke);
            
        }
    )
}

function brushEnd () {
        if (constraintBrush.empty()) {
        constraintBrush.extent([constraintBrush.extent()[0], constraintBrush.extent()[0] + (365 * 20)])
        d3.select("#brushG").call(constraintBrush.extent([constraintBrush.extent()[0], constraintBrush.extent()[0] + (365 * 20)]));
        brushed();
    }

}

function redraw() {

        d3.selectAll("text.period")
            .transition()
            .duration(500)
    .attr("x", function(d) {return (d3.min(d.projectedTSpans, function(p) {return tlX(p.s)}))})
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
          .attr("x1", function (g) {return tlX(g)})
          .attr("x2", function (g) {return tlX(g)})
          .attr("y1", 0)
          .attr("y2", periodHeight(d) * (d.lanerange[1] - d.lanerange[0] + 1));

        d3.select(this).selectAll("line.duringline")
            .transition()
            .duration(500)
          .attr("x1", tlX(p.s))
          .attr("x2", tlX(p.e))
          .attr("y1", periodHeight(d) * (d.lanerange[1] - d.lanerange[0] + 1) / 2)
          .attr("y2", periodHeight(d) * (d.lanerange[1] - d.lanerange[0] + 1) / 2);

            d3.select(this).selectAll("rect.periodduring")
            .transition()
            .duration(500)
          .attr("x", tlX(((p.e + p.s) / 2) - (p.d / 2)))
          .attr("width", tlX(p.d))
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
          .attr("x", tlX(p.s))
          .attr("width", tlX(p.e) - tlX(p.s))
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
          .attr("x", tlX(p.s))
          .attr("width", tlX(p.ls) - tlX(p.s))
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
          .attr("x", tlX(p.ee))
          .attr("width", tlX(p.ee) - tlX(p.e))
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
            computedStyle.strokeWidth = 1;
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

function stateOver(d,i) {
    d3.select(this).style("fill", "black");
    d3.selectAll("g.overallPeriod").filter(function (el) {return (d.properties.STATE_NAME == el.label && (d.properties.STATE_NAME != "West Virginia" || constraintBrush.extent()[0] >= 2401570  || constraintBrush.extent()[1] >= 2401570) && (d.properties.STATE_NAME != "Maine" || constraintBrush.extent()[0] >= 2385911  || constraintBrush.extent()[1] >= 2385911)) || (d.properties.STATE_NAME == "Maine" && el.label == "Massachusetts" && constraintBrush.extent()[0] < 2385911) || (d.properties.STATE_NAME == "West Virginia" && el.label == "Virginia" && constraintBrush.extent()[0] < 2401570)}).selectAll("rect").style("fill", "black");
    d3.selectAll("g.overallPeriod").filter(function (el) {return (d.properties.STATE_NAME == el.label && (d.properties.STATE_NAME != "West Virginia" || constraintBrush.extent()[0] >= 2401570  || constraintBrush.extent()[1] >= 2401570) && (d.properties.STATE_NAME != "Maine" || constraintBrush.extent()[0] >= 2385911  || constraintBrush.extent()[1] >= 2385911)) || (d.properties.STATE_NAME == "Maine" && el.label == "Massachusetts" && constraintBrush.extent()[0] < 2385911) || (d.properties.STATE_NAME == "West Virginia" && el.label == "Virginia" && constraintBrush.extent()[0] < 2401570)}).selectAll("text").style("opacity", 1);
}

function stateOut(d,i) {
    d3.select(this).style("fill", "#990000");
    d3.selectAll("rect.period").style("fill", "#990000");
    d3.selectAll("text.period").style("opacity", 0);
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