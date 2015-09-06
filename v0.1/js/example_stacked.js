function timelineViz(dataset) {

d3.selectAll("canvas").remove();
d3.selectAll("svg").remove();

  canvas = d3.select("#controlBar").append("canvas")
  .style("background", "white").style("border", "red 1px solid").attr("height", 30).attr("width", 1000)
  .attr("id", "newCanvas");
  context = canvas.node().getContext("2d");

  context.fillStyle = "rgba(0, 0, 0, 0.01)";
  context.lineWidth = 0;
  context.strokeStyle = 'black';
    
    rowHeight = 30;
    zoomlevel = 1;
    isZooming = false;

    d3.json("data/" + dataset, function(data) {
    exposedData = data;

    tlLayout = new d3_layout_timeline();
    tlLayout.periodCollection(exposedData);
    
    xPoint = tlLayout.periodStatistics.earliestJulian;
    xScale = (tlLayout.periodStatistics.latestJulian - tlLayout.periodStatistics.earliestJulian) / 1000;
    
    timelineZoom = d3.behavior.zoom()
    .on("zoom", pan);
    
    svg = d3.select("#vizContainer").append("svg").style("cursor", "ns-resize").style("height", "800px").style("width", "1000px")
    .call(timelineZoom);
    
    var timelineG = svg.append("g").attr("id", "timelineG")
    
    stackedArray = [];
    
    timelineG.selectAll("g").data(tlLayout.timePeriods())
    .enter()
    .append("g")
    .attr("class", "overallPeriod")
    .on("mouseover", timeOver)
    .on("mouseout", timeOut)
    .attr("transform", function (d,i) {return "translate(0,0)"})
    .each(function(d,i) {
        d3.select(this).selectAll("g.period").data(d.projectedTSpans)
          .enter()
          .append("g")
          .attr("class", "period")
          .each(function(p,q) {
            var barHeight = 1;
            var polygonArray = [];
                    if (p.d) {
                        barHeight = p.d / (p.e - p.s);
                        console.log(barHeight)
                    }
                    if (p.ls) {
                        polygonArray.push([p.s,0], [p.ls, barHeight])
                    }
                    else {
                        polygonArray.push([p.s,0], [p.s, barHeight])                        
                    }
                    if (p.ee) {
                        polygonArray.push([p.ee,barHeight], [p.e, 0])
                    }
                    else {
                        polygonArray.push([p.e,barHeight], [p.e, 0])
                    }

            timelineArea = d3.svg.area()
            .x(function(d) {
            return (d[0] - xPoint) / xScale
            })
            .y(function(d) {
            return -(d[1] * (rowHeight - 15))
            })
            .y0(function(d) {
            return 0
            })
            .interpolate("linear")

            timelineAreaCanvas = d3.svg.line()
            .x(function(d) {
            return (d[0] - xPoint) / xScale
            })
            .y(function(d) {
            return -(d[1] * (rowHeight - 15))
            })
            .interpolate("linear")

            
            stackedArray.push(polygonArray);
            
          d3.select(this)
          .append("path")
          .attr("class", d.estimated == true ? "tspan period estimated" : "tspan period")
          .attr("d", timelineArea(polygonArray))
          .style("stroke", "black")
          .style("fill", "cornsilk")
          .style("opacity", 1)
          .style("stroke-width", 1);

        context.beginPath();
        context.moveTo((polygonArray[0][0] - xPoint) / xScale,polygonArray[0][1] * 30);
        context.lineTo((polygonArray[1][0] - xPoint) / xScale,polygonArray[1][1] * 30);
        context.lineTo((polygonArray[2][0] - xPoint) / xScale,polygonArray[2][1] * 30);
        context.lineTo((polygonArray[3][0] - xPoint) / xScale,polygonArray[3][1] * 30);
        context.lineTo((polygonArray[0][0] - xPoint) / xScale,polygonArray[0][1] * 30);
        context.fill();

        })
    .append("text")
    .attr("class", "period")
    .text(d.id + " - " + d.label)
    .style("opacity", 0);
    
          })
            var maxValue = 0;
            var y = 0;
            imgData = [];
            while (y < 30) {
                imgData[y] = context.getImageData(0, y, 1000, y+1);
                y++;
            }
            pixel = [{x:0, y:0}];
            var x = 4;
            var x2 = 1;
            var maxValue = d3.max(imgData, function(el) {return d3.max(el.data)})
            
            while (x < imgData[0].data.length) {
                if (x%4 == 3) {
                    var meanValue = d3.mean(imgData, function(el) {return el.data[x]});
                    if (pixel[pixel.length - 1].y != meanValue) {
//                        pixel.push({x: parseInt(x) - 1, y: imgData.data[x-4]})
                        pixel.push({x: parseInt(x) - 1, y: pixel[pixel.length - 1].y})
                        pixel.push({x: parseInt(x), y: meanValue})
                    }
                    var invertedMean = (255 - parseInt(255 * meanValue / maxValue));
                context.fillStyle="rgb( " + invertedMean + ", " + invertedMean + ", " + invertedMean + ")"
                context.fillRect(x2,0,1,30);
                context.fill();
                x2++;
                
                }
                x++;
            }            
            pixel.push({x: 4001, y: pixel[pixel.length - 1].y})
            pixel.push({x: 4002, y: 0})
            
            densityArea = d3.svg.line()
            .x(function(d) {
            return ((d.x / 4000) * 1000)
            })
            .y(function(d) {
            return (-(d.y / maxValue) * 100)
            })
            .interpolate("linear")
            d3.select("svg").append("path").attr("transform", "translate(0,400)").style("fill", "pink").style("fill-opacity", .5).style("stroke", "black").style("stroke-width", "2px").attr("d", densityArea(pixel))

            d3.selectAll("g.overallPeriod").transition().duration(2000).attr("transform", function (d,i) {return "translate(0," + canvasPosition(d) + ")"})
    })
    
}


function pan() {
    d3.select("#timelineG").attr("transform", "translate(0,"+timelineZoom.translate()[1]+")")
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
    var movingY = 50;
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