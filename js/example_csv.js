function timelineViz() {

    rowHeight = 30;
    zoomlevel = 1;
    isZooming = false;

// Very early dates require a bit more manual effort
    centerDate = new Date(0,1,1);    
//    centerDate.setFullYear("-8000");
    
    xPoint = getJulian(centerDate);

//  CE dates after 99CE can be entered the old-fashioned way
//    xPoint = getJulian(new Date("100-01-01"));

    //Unless you want it in days, you have to adjust this to be the days represented in pixels
    //so xScale = 365 means 1 pixel = 1 year
    xScale = 36.5;
    d3.csv("data/topotime_sample.csv", function(data) {
//    exposedData = pleiades_periods;
    exposedData = data;

    tlLayout = new d3_layout_timeline();
    tlLayout.periodCollection(exposedData);
    
    timelineZoom = d3.behavior.zoom()
    .on("zoom", pan);
    
    svg = d3.select("#vizContainer").append("svg").style("height", "300px").style("width", "1000px")
    .call(timelineZoom);
    
    var timelineG = svg.append("g").attr("id", "timelineG").attr("transform", "translate(0,50)")
    
    timelineG.selectAll("g").data(tlLayout.timePeriods())
    .enter()
    .append("g")
    .attr("class", "overallPeriod")
    .on("mouseover", timeOver)
    .on("mouseout", timeOut)
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
                        .classed("duringends", true);
                        
                        d3.select(this)
                        .append("line")
                        .classed("duringline", true);
                        
                        d3.select(this)
            .append("rect")
          .style("stroke", "black")
          .attr("class", d.estimated == true ? "tspan periodduring estimated" : "tspan periodduring")
          .attr("rx", 100)
          .style("opacity", d.level * .2)
          .style("stroke-width", 0);

                        
                    }
                        else{
            d3.select(this)
            .append("rect")
          .attr("class", d.estimated == true ? "tspan period estimated" : "tspan period")
          .style("stroke", "black")
          .style("opacity", d.level * .2)
          .style("stroke-width", 0);
                    }
          if (p.ls) {
          d3.select(this)
            .append("rect")
          .attr("class", "tspan periodls")
          .style("stroke-width", 0);
          }
          if (p.ee) {
          d3.select(this)
            .append("rect")
          .attr("class", "tspan periodee")
          .style("stroke-width", 0);
          }
        });
          
          })
    .append("text")
    .attr("class", "period")
    .text(function(d) {return d.id + " - " + d.label})
    .style("opacity", 0);

    adjustIn(tlLayout.periodStatistics.medianS);
    
    d3.selectAll("rect").each(function() {
        if (parseInt(d3.select(this).attr("width")) == 20) {
            d3.select(this).classed("shortPeriod")
        }
    }
    )
    
    svg.selectAll("line.axes").data([0,.5,1]).enter().append("line")
    .attr("class", "axes")
    .attr("x1", function(d) {return d * 800})
    .attr("x2", function(d) {return d * 800})
    .attr("y1", 0)
    .attr("y2", 400)
    .style("stroke", "black")
    .style("stroke-width", "3px")
    
    updateAxis()
    })
    
}

function pan() {
    d3.select("#timelineG").attr("transform", "translate("+timelineZoom.translate()[0]+",50)")
    updateAxis();
}

function updateAxis() {
    
    var svgSize = parseInt(d3.select("svg").style("width"))
    var leftSide = ((0 - timelineZoom.translate()[0]) * xScale) + xPoint ;
    var middlePoint = (((svgSize / 2) - timelineZoom.translate()[0]) * xScale) + xPoint ;
    var rightSide = ((svgSize - timelineZoom.translate()[0]) * xScale) + xPoint ;
    d3.select("#leftAxisLabel").html(julianToDate(leftSide).toLocaleDateString())
    d3.select("#middleAxisLabel").html(julianToDate(middlePoint).toLocaleDateString())
    d3.select("#rightAxisLabel").html(julianToDate(rightSide).toLocaleDateString())
    
    d3.selectAll("line.axes").attr("x1", function(d) {return d * svgSize}).attr("x2", function(d) {return d * svgSize});


}

function redraw() {
    updateAxis();
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
          .attr("y2", periodHeight(d) * Math.max(1,(d.lanerange[1] - d.lanerange[0])));

        d3.select(this).selectAll("line.duringline")
            .transition()
            .duration(500)
          .attr("x1", (p.s - xPoint) / xScale)
          .attr("x2", (p.e - xPoint) / xScale)
          .attr("y1", periodHeight(d) * Math.max(1,(d.lanerange[1] - d.lanerange[0])) / 2)
          .attr("y2", periodHeight(d) * Math.max(1,(d.lanerange[1] - d.lanerange[0])) / 2);

            d3.select(this).selectAll("rect.periodduring")
            .transition()
            .duration(500)
          .attr("x", (((p.e + p.s) / 2) - (p.d / 2) - xPoint) / xScale)
          .attr("width", ((p.d) / xScale))
          .attr("height", periodHeight(d) * Math.max(1,(d.lanerange[1] - d.lanerange[0])))
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
          .attr("height", periodHeight(d) * Math.max(1,(d.lanerange[1] - d.lanerange[0])))
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
          .attr("height", periodHeight(d) * Math.max(1,(d.lanerange[1] - d.lanerange[0])))
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
          .attr("height", periodHeight(d) * Math.max(1,(d.lanerange[1] - d.lanerange[0])))
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
    var svgCenter = (parseInt(d3.select("svg").style("width")) / 2) - timelineZoom.translate()[0];
    var oldCenter = (svgCenter * xScale) + xPoint;
    definedCenter = definedCenter || oldCenter;
    xScale = xScale * 2;
    var offSet = svgCenter - ((definedCenter - xPoint) / xScale);
    
    timelineZoom.translate([timelineZoom.translate()[0] + (offSet),timelineZoom.translate()[1]]);
    d3.select("#timelineG").transition().duration(500).attr("transform", "translate("+timelineZoom.translate()[0]+",50)")
    
    redraw();
}

function adjustOut(definedCenter) {
    var svgCenter = (parseInt(d3.select("svg").style("width")) / 2) - timelineZoom.translate()[0];
    var oldCenter = (svgCenter * xScale) + xPoint;
    definedCenter = definedCenter || oldCenter;
    xScale = xScale / 2;
    var offSet = svgCenter - ((definedCenter - xPoint) / xScale);

    timelineZoom.translate([timelineZoom.translate()[0] + (offSet),timelineZoom.translate()[1]]);
    d3.select("#timelineG").transition().duration(500).attr("transform", "translate("+timelineZoom.translate()[0]+",50)")
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
            computedStyle.strokeOpac = 1;
            computedStyle.strokeWidth = 2;
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

function timeOut(d,i) {
 d3.selectAll("g.overallPeriod").each(function(d) {var newStyle = levelAdjust(d.level);d3.select(this).selectAll("rect.tspan").style("stroke-width",newStyle.strokeWidth + "px")});
    d3.select(this).selectAll("line").style("stroke-width","2px");
 d3.select(this).select("text").style("opacity", 0);
}

function timeOver(d,i) {
    d3.select(this).selectAll("rect").style("stroke-width","3px");
    d3.select(this).selectAll("line").style("stroke-width","4px");
    d3.select(this).select("text").style("opacity", 1);
    d3.selectAll("g.overallPeriod").filter(function(p) {return p.partof == d ? this : null})
    .selectAll("rect").style("stroke-width", "5px")
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

function julianToDate(jDay) {
    
    var convertedDate = new Date;
    
    convertedDate.setTime((jDay - 2440587.5) * 86400000);
    
    return convertedDate
}