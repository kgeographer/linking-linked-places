function timelineViz() {

    rowHeight = 30;
    zoomlevel = 1;
    isZooming = false;

    d3.json("data/topotime_format.json", function(data) {
    exposedData = data;

    tlLayout = new d3_layout_timeline();
    tlLayout.periodCollection(exposedData);

    xPoint = tlLayout.periodStatistics.earliestJulian;
    xScale = (tlLayout.periodStatistics.latestJulian - tlLayout.periodStatistics.earliestJulian) / 1000;
    
    timelineZoom = d3.behavior.zoom()
    .on("zoom", pan);
    
    svg = d3.select("#vizContainer").append("svg").style("height", "800px").style("width", "1000px").call(timelineZoom);
    
    var timelineG = svg.append("g").attr("id", "timelineG")
    
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
                        .insert("line", "rect")
                        .attr("class", "duringends")
                        .style("stroke", "purple")
                        .style("stroke-width", "2px")
                        .style("stroke-dasharray", "5 5");
                        
                        d3.select(this)
                        .insert("line", "rect")
                        .attr("class", "duringline")
                        .style("stroke", "purple")
                        .style("stroke-width", "2px")
                        .style("stroke-dasharray", "5 5");
                        
                        d3.select(this)
            .append("rect")
          .attr("class", "tspan period")
          .style("stroke", "black")
          .attr("class", "periodduring")
          .style("opacity", 1)
          .style("stroke-width", 0);

                        
                    }
                        else{
            d3.select(this)
            .append("rect")
          .attr("class", "tspan period")
          .style("stroke", "black")
          .style("opacity", d.level * 1)
          .style("stroke-width", 0);
                    }
          if (p.ls) {
          d3.select(this)
            .append("rect")
          .attr("class", "tspan periodls")
          .style("fill", "blue")
          .style("stroke", "lightgray")
          .style("stroke-width", 0);
          }
          if (p.ee) {
          d3.select(this)
            .append("rect")
          .attr("class", "tspan periodee")
          .style("fill", "blue")
          .style("stroke", "lightgray")
          .style("stroke-width", 0);
          }
        });
          
          })
    .append("text")
    .attr("class", "period")
    .text(function(d) {return d.id + " - " + d.label})
    .style("pointer-events", "none")
    .style("opacity", 0);

    adjustIn(tlLayout.periodStatistics.medianS);
    
    d3.selectAll("rect").each(function() {
        if (parseInt(d3.select(this).attr("width")) == 20) {
            d3.select(this).style("fill", "orange")
        }
    }
    )
    })
    
}

function pan() {
    d3.select("#timelineG").attr("transform", "translate("+timelineZoom.translate()[0]+","+timelineZoom.translate()[1]+")")
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
          .style("fill", d.estimated == true ? "lightgray" : "darkred")
          .style("stroke", "black")
          .style("fill-opacity", newStyle.fillOpac)
          .style("stroke-dasharray", newStyle.dasharray)
          .style("stroke-width", newStyle.strokeWidth).
          each("end", movingDuring);
                        
                      }
        else {
            d3.select(this).selectAll("rect.period")
            .transition()
            .duration(500)
          .attr("x", (p.s - xPoint) / xScale)
          .attr("width", ((p.e - xPoint) / xScale) - ((p.s - xPoint) / xScale) > 0 ? ((p.e - xPoint) / xScale) - ((p.s - xPoint) / xScale) : 20)
          .attr("height", periodHeight(d) * (d.lanerange[1] - d.lanerange[0] + 1))
          .style("fill", d.estimated == true ? "lightgray" : "darkred")
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
          .style("fill", "pink")
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
          .style("fill", "pink")
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
    var svgCenter = (parseInt(d3.select("svg").style("width")) / 2) - timelineZoom.translate()[0];
    var oldCenter = (svgCenter * xScale) + xPoint;
    definedCenter = definedCenter || oldCenter;
    xScale = xScale * 2;
    var offSet = svgCenter - ((definedCenter - xPoint) / xScale);
    
    timelineZoom.translate([timelineZoom.translate()[0] + (offSet),timelineZoom.translate()[1]]);
    d3.select("#timelineG").transition().duration(500).attr("transform", "translate("+timelineZoom.translate()[0]+","+timelineZoom.translate()[1]+")")    
    redraw();
}

function adjustOut(definedCenter) {
    var svgCenter = (parseInt(d3.select("svg").style("width")) / 2) - timelineZoom.translate()[0];
    var oldCenter = (svgCenter * xScale) + xPoint;
    definedCenter = definedCenter || oldCenter;
    xScale = xScale / 2;
    var offSet = svgCenter - ((definedCenter - xPoint) / xScale);

    timelineZoom.translate([timelineZoom.translate()[0] + (offSet),timelineZoom.translate()[1]]);
    d3.select("#timelineG").transition().duration(500).attr("transform", "translate("+timelineZoom.translate()[0]+","+timelineZoom.translate()[1]+")")
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
    rowHeight = Math.max(1,zoomlevel * 50);
    redraw();
}

function levelAdjust(incLevel) {
    var computedStyle = {fillOpac: 0, strokeWidth: 0, strokeOpac: 0, dasharray: "1"}
    var levelDifference = incLevel - zoomlevel;
    switch(levelDifference) {
        case -1:
            computedStyle.fillOpac = 0;
            computedStyle.strokeOpac = 0;
            computedStyle.strokeWidth = 2;
            computedStyle.dasharray = "10,10"
            break;
        case 0:
            computedStyle.fillOpac = 1;
            computedStyle.strokeOpac = 0;
            computedStyle.strokeWidth = 0;
            computedStyle.dasharray = "0"
            break;
        
        case 1:
            computedStyle.fillOpac = 1;
            computedStyle.strokeOpac = 1;
            computedStyle.strokeWidth = 1;
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

function movingDuring() {
    d3.select("rect.periodduring").each(startMoving)
}

function startMoving(d,i) {
d3.select("rect.periodduring").transition().duration(3000).attr("x", function(d) {return (d.s - xPoint) / xScale}).ease("linear").each("end", keepMoving);
}

function keepMoving(d,i) {
    d3.select("rect.periodduring").transition().duration(3000).attr("x", function(d) {return (d.e - xPoint - d.d) / xScale}).ease("linear").each("end", startMoving);    
}