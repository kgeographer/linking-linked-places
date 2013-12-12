d3_layout_timeline = function() {
    var topLayer = 0, bottomLayer = 0, eventRelations = [], temporalProjection, eventHash = {}, tlWidth = 100, tlHeight = 100, temporalRange =[0,1], temporalType = "date", timeScale = 1, featureCollection, temporalPeriods = [], timeSegments, numLanes = 1, earliestDate = 1, latestDate = 10;
    
    var periodHash = {}, lanes = {}, stats = {};
    var relationsList = [];
    var durationHash = {d: 1, h: 1/24, w: 7, m: 365.25/12, y: 365.25};
    var temporalRelations;
    
    //Slightly greater than zero values to get around the undefined test later
    //This is a hack and needs to get addressed at some point
    var tsOperatorHash = { "<": {subspan: "s", uncertaintyPoint: {"s": -1,"e": .001}}, ">": {subspan: "e", uncertaintyPoint: {"s": .001, "e": 1}}, "~": {uncertaintyPoint: {"s": -0.5, "e": -0.5}}};
    var tSpanOperators = "[<|>|=|d|~]";
    var currentProcessedPeriods = [];
    

    uncertaintyValue = 365;    
    sortTimes = 0;
    this.timeSegments = [];
    
    

    this.periodStatistics = stats;

    this.timePeriods = function(newTimePeriods) {
        if(newTimePeriods) {
            temporalPeriods = newTimePeriods;
            return this;
        }
        else {
            return temporalPeriods;
        }
    }
    
    this.periodRelations = function(newPeriodRelations) {
        if(newPeriodRelations) {
            temporalRelations = newPeriodRelations;
            return this;
        }
        else {
            return temporalRelations;
        }
    }

    this.laneArray = function() {
        return lanes;
    }

    this.width = function(newWidth) {
        if(newWidth) {
            tlWidth = newWidth;
            if(featureCollection) {
                this.featureCollection(featureCollection);
            }
            return this;
        }
        else {
            return tlWidth;
        }
    }

    this.height = function(newHeight) {
        if(newHeight) {
            tlHeight = newHeight;
            if(featureCollection) {
                this.featureCollection(featureCollection);
            }
            return this;
        }
        else {
            return newHeight;
        }
    }

    this.lanes = function() {
        return lanes;
    }
    
    this.layers = function (newLayers) {
        if (newLaylayers) {
            topLayer = newLayers[0];
            bottomLayer = newLayers[1];
            return this;
        }        
        else {
            return [topLayer,bottomLayer];
        }
    }

    this.projection = function(newProjection) {
        if(newProjection) {
            temporalProjection = newProjection;
            this.update();
            return this;
        }
        else {
            return temporalProjection;
        }
    }
    
    this.range = function(newRange) {
        if(newRange) {
            temporalRange = newRange;
            return this;
        }
        else {
            return temporalRange;
        }
    }

    this.dateType = function(newDateType) {
            if(newDateType) {
                temporalType = newDateType;
                return this;
            }
            else {
            return temporalType;
            }
    }
    
    this.periodCollection = function(newCollection) {
            var periods = [];
            var events = [];
            if (!temporalProjection) {
                temporalProjection = new d3_chrono_projection();
                if(newCollection.projection) {
                    if(newCollection.projection.origin) {
                        temporalProjection.origin(newCollection.projection.origin);
                    }
                    if(newCollection.projection.atom) {
                        temporalProjection.atom(newCollection.projection.atom);
                    }
                    if(newCollection.projection.datetype) {
                        temporalProjection.type(newCollection.projection.datetype);
                    }
                }
            }
            if (newCollection.periods) {
                temporalPeriods = newCollection.periods;
            }
            else {
                temporalPeriods = newCollection;
            }
            formatPeriodArray();

            if (newCollection.relations) {
                temporalRelations = newCollection.relations
                processRelations();
            }

            sortLanes()

    }
    
    function sortLanes() {
        //Sort for lanes
        for (x in temporalPeriods) {
            if(temporalPeriods[x]) {
                laneBinning(temporalPeriods[x]);
            }
        }

        //Find lane range if there are relations
        if (temporalRelations) {
        for (x in temporalPeriods) {
            if(temporalPeriods[x]) {
                temporalPeriods[x].lanerange = determineLaneRange(temporalPeriods[x], relationsList);    
            }
        }
        }
        else {
        for (x in temporalPeriods) {
            if(temporalPeriods[x]) {
                temporalPeriods[x].lanerange = [temporalPeriods[x].lane,temporalPeriods[x].lane];    
            }
        }            
        }
    }
    
    function determineLaneRange(incPeriod, incRelList) {
        var laneRange = [parseInt(incPeriod.lane),parseInt(incPeriod.lane)];
        for (x in incRelList) {
            if (incRelList[x]) {
                if(incRelList[x].target === incPeriod && incRelList[x].type == "participates_in") {
                    laneRange[0] = Math.min(laneRange[0],incRelList[x].source.lane);
                    laneRange[1] = Math.max(laneRange[1],incRelList[x].source.lane);
                }
            }
        }
            return laneRange;
    }

    
    function processRelations() {
        relationsList = [];
        for (x in temporalRelations) {
            if (temporalRelations[x]) {
                if (periodHash[temporalRelations[x].rel[0]] && periodHash[temporalRelations[x].rel[2]]) {
                    var newRelation = {
                                source: periodHash[temporalRelations[x].rel[0]],
                                target: periodHash[temporalRelations[x].rel[2]],
                                type: temporalRelations[x].rel[1]
                    }
                    relationsList.push(newRelation);
                }
            }
        }

        for (x in temporalPeriods) {
            if (temporalPeriods[x]) {
                temporalPeriods[x].level = determineLevel(temporalPeriods[x], relationsList);
            }
        }
    }
    
    function determineLevel(incPeriod, incRelList) {
        for (x in incRelList) {
            if (incRelList[x]) {
                if(incRelList[x].target === incPeriod && incRelList[x].type == "has_part") {
                    incRelList[x].target.partof =  incRelList[x].source;
                    return (determineLevel(incRelList[x].source, incRelList) + 1);
                }
            }
        }
            return 1;
    }

    
    function formatPeriodArray() {
        //build a period hash
        for (x in temporalPeriods) {
            if(temporalPeriods[x]) {
                //a CSV input is going to need to make tSpans
                if(temporalPeriods[x].s || temporalPeriods[x].e) {
                    temporalPeriods[x].tSpans = [{}];
                    if(temporalPeriods[x].s.length > 0) {
                        temporalPeriods[x].tSpans[0].s = temporalPeriods[x].s;
                    }
                    if(temporalPeriods[x].ls.length > 0) {
                        temporalPeriods[x].tSpans[0].ls = temporalPeriods[x].ls;
                    }
                    if(temporalPeriods[x].e.length > 0) {
                        temporalPeriods[x].tSpans[0].e = temporalPeriods[x].e;
                    }
                    if(temporalPeriods[x].ee.length > 0) {
                        temporalPeriods[x].tSpans[0].ee = temporalPeriods[x].ee;
                    }
                    if(temporalPeriods[x].duration.length > 0) {
                        temporalPeriods[x].tSpans[0].duration = temporalPeriods[x].duration;
                    }
                    if(temporalPeriods[x].cstep.length > 0) {
                        temporalPeriods[x].tSpans[0].cstep = temporalPeriods[x].cstep;
                    }
                    if(temporalPeriods[x].cduration.length > 0) {
                        temporalPeriods[x].tSpans[0].cduration = temporalPeriods[x].cduration;
                    }
/*                    if(temporalPeriods[x].minduration.length > 0) {
                        temporalPeriods[x].tSpans[0].minduration = temporalPeriods[x].minduration;
                    }
                    */
                    if(temporalPeriods[x].during.length > 0) {
                        temporalPeriods[x].tSpans[0].during = temporalPeriods[x].during;
                    }

                }
                temporalPeriods[x].lane = -1;
                temporalPeriods[x].level = 1;
                temporalPeriods[x].lanerange = [];
                temporalPeriods[x].partof;
                temporalPeriods[x].x = 0;
                temporalPeriods[x].projectedTSpans = [];
                temporalPeriods[x].contingent = false;
                temporalPeriods[x].estimated = false;
                temporalPeriods[x].relations = [];
                periodHash[temporalPeriods[x].id] = temporalPeriods[x];
            }
        }
        
        //Project the period tspans
        for (x in temporalPeriods) {
            if(temporalPeriods[x]) {
                projectTSpan(temporalPeriods[x]);
            }
        }
        
        temporalPeriods.sort(function(a,b) {
            var aS = d3.min(a.projectedTSpans, function(p) {return p.s});
            var bS = d3.min(b.projectedTSpans, function(p) {return p.s});
            if(aS < bS) {
                return -1;
            }
            else if(aS > bS) {
                return 1;
            }
            else {
                return 1;
            }
        })

        newStatistics();
    }
    
    function laneBinning(incomingPeriod) {
        var incBounds = temporalBoundingBox(incomingPeriod.projectedTSpans);
        var placed = false;
        if(incomingPeriod.partof) {
            laneGuide = incomingPeriod.partof.id;
        }
        else {
            laneGuide = "base";
        }

        if(!lanes[laneGuide]) {
            lanes[laneGuide] = [];
        }
        for (x in lanes[laneGuide]) {
            if (lanes[laneGuide][x]) {
                var overlap = false;
                for (y in lanes[laneGuide][x]) {
                    var thisBounds = temporalBoundingBox(lanes[laneGuide][x][y].projectedTSpans);
                    if ((incBounds.s <= thisBounds.e && incBounds.e >= thisBounds.s)) {
                        overlap = true;
                        break;
                    }
                }
                if (overlap == false) {
                    lanes[laneGuide][x].push(incomingPeriod);
                    incomingPeriod.lane = x;
                    placed = true;
                    break;
                }
            }
        }
        if (placed == false) {
            incomingPeriod.lane = lanes[laneGuide].length;
            lanes[laneGuide].push([incomingPeriod]);
        }
    }
    
    function temporalBoundingBox(incomingTSpanArray) {
        var bounds = {s: 0, e: 0};
        bounds.s = d3.min(incomingTSpanArray, function(d) {return d.s});
        bounds.e = d3.max(incomingTSpanArray, function(d) {return d.e});
        return bounds;
    }
    
    function estimatePeriodOnTheFly(incomingTSpan) {
        //TO DO update estimates later once all the periods have been projected?
        //You need updated mean values for estimated periods
        stats.medianS = d3.max(temporalPeriods, function(d,i) {return i < (temporalPeriods.length * .5) ? d3.mean(d.projectedTSpans, function(p) {return p.s}) : null})
        stats.mean = d3.mean(temporalPeriods, function(d) {return d3.mean(d.projectedTSpans, function(p) {return p.e - p.s})})
            if (!incomingTSpan.s) {
                incomingTSpan.s = stats.medianS;
            }
            if (!incomingTSpan.e) {
                incomingTSpan.e = incomingTSpan.s + stats.mean;
            }
    }
    
    function projectTSpan(incomingPeriod) {
        //if this has already been projected, return true
        if (incomingPeriod.projectedTSpans[0]) {
            return true;
        }
        
        //A tSpan is always an array, even if it only has (typically) one object in that array
        if(incomingPeriod.tSpans && currentProcessedPeriods.indexOf(incomingPeriod) == -1) {
            var isCyclical = false;
            currentProcessedPeriods.push(incomingPeriod);
            for (x in incomingPeriod.tSpans) {
                var processedTSpan = {};
                if (incomingPeriod.tSpans[x].s) {
                    if (!String(incomingPeriod.tSpans[x].s).match(tSpanOperators)) {
                        processedTSpan["s"] = temporalProjection.project(incomingPeriod.tSpans[x].s);
                    }
                    else {
                        var contingentValue = String(incomingPeriod.tSpans[x].s);
                        var foundOperator = contingentValue.match(tSpanOperators)[0];
                        var targetPeriod = contingentValue.substring(1).split(".")[0];
                        var specificTSpan = contingentValue.substring(1).split(".")[1];
                        if(!specificTSpan) {
                            //In the case where a specific tspan subspan is not referenced, then resolve it based on the operator
                            //If the operator does not reference a subspan, then reference this type by default
                            specificTSpan = tsOperatorHash[foundOperator].subspan ? tsOperatorHash[foundOperator].subspan : "s";
                        }
                            projectTSpan(periodHash[targetPeriod]);
                            if (processedTSpan["ls"] || !tsOperatorHash[foundOperator].uncertaintyPoint) {
                                processedTSpan["s"] = periodHash[targetPeriod]["projectedTSpans"][0][specificTSpan];
                            }
                            else {
                                processedTSpan["s"] = periodHash[targetPeriod]["projectedTSpans"][0][specificTSpan] + (uncertaintyValue * tsOperatorHash[foundOperator].uncertaintyPoint["s"]);
                                processedTSpan["ls"] = periodHash[targetPeriod]["projectedTSpans"][0][specificTSpan] + uncertaintyValue + (uncertaintyValue * tsOperatorHash[foundOperator].uncertaintyPoint["s"]);
                            }
                    }
                }
                //if you don't have a start date then you need to be flagged for estimation
                else {
                    incomingPeriod.estimated = true;
                }
                if (incomingPeriod.tSpans[x].ls) {
                    if (!String(incomingPeriod.tSpans[x].ls).match(tSpanOperators)) {
                        processedTSpan["ls"] = temporalProjection.project(incomingPeriod.tSpans[x].ls)
                    }
                    else {
                        var contingentValue = String(incomingPeriod.tSpans[x].ls);
                        var foundOperator = contingentValue.match(tSpanOperators)[0];
                        var targetPeriod = contingentValue.substring(1).split(".")[0];
                        var specificTSpan = contingentValue.substring(1).split(".")[1];
                        if(!specificTSpan) {
                            specificTSpan = tsOperatorHash[foundOperator].subspan ? tsOperatorHash[foundOperator].subspan : "ls";
                        }
                            projectTSpan(periodHash[targetPeriod]);
                            processedTSpan["ls"] = periodHash[targetPeriod]["projectedTSpans"][0][specificTSpan];
                    }
                }
                if (incomingPeriod.tSpans[x].e) {
                    if (!String(incomingPeriod.tSpans[x].e).match(tSpanOperators)) {
                        processedTSpan["e"] = temporalProjection.project(incomingPeriod.tSpans[x].e)
                    }
                    else {
                        var contingentValue = String(incomingPeriod.tSpans[x].e);
                        var foundOperator = contingentValue.match(tSpanOperators)[0];
                        var targetPeriod = contingentValue.substring(1).split(".")[0];
                        var specificTSpan = contingentValue.substring(1).split(".")[1];
                        if(!specificTSpan) {
                            specificTSpan = tsOperatorHash[foundOperator].subspan ? tsOperatorHash[foundOperator].subspan : "e";
                        }
                        projectTSpan(periodHash[targetPeriod]);
                            if (processedTSpan["ee"] || !tsOperatorHash[foundOperator].uncertaintyPoint) {
                                processedTSpan["e"] = periodHash[targetPeriod]["projectedTSpans"][0][specificTSpan];
                            }
                            else {
                                processedTSpan["e"] = periodHash[targetPeriod]["projectedTSpans"][0][specificTSpan] + (uncertaintyValue * tsOperatorHash[foundOperator].uncertaintyPoint["e"]);
                                processedTSpan["ee"] = periodHash[targetPeriod]["projectedTSpans"][0][specificTSpan] - uncertaintyValue + (uncertaintyValue * tsOperatorHash[foundOperator].uncertaintyPoint["e"]);
                            }

                    }
                }
                if (incomingPeriod.tSpans[x].ee) {
                    if (!String(incomingPeriod.tSpans[x].ee).match(tSpanOperators)) {
                        processedTSpan["ee"] = temporalProjection.project(incomingPeriod.tSpans[x].ee)
                    }
                    else {
                        var contingentValue = String(incomingPeriod.tSpans[x].ee);
                        var foundOperator = contingentValue.match(tSpanOperators)[0];
                        var targetPeriod = contingentValue.substring(1).split(".")[0];
                        var specificTSpan = contingentValue.substring(1).split(".")[1];
                        if(!specificTSpan) {
                            specificTSpan = tsOperatorHash[foundOperator].subspan ? tsOperatorHash[foundOperator].subspan : "ee";
                        }
                        projectTSpan(periodHash[targetPeriod]);
                        processedTSpan["ee"] = periodHash[targetPeriod]["projectedTSpans"][0][specificTSpan];                        
                    }
                }
                if (incomingPeriod.tSpans[x].duration && incomingPeriod.tSpans[x].during == true) {
                    var durVal = incomingPeriod.tSpans[x].duration;
                    var durType = durVal.substring(durVal.length - 1, durVal.length);
                        if (durationHash[durType]) {
                            durVal = parseInt(durVal) * durationHash[durType];
                        }
                        else {
                            durVal = parseInt(durVal);
                        }
                        processedTSpan["d"] = durVal;
                }
                else if (incomingPeriod.tSpans[x].duration) {
                    if (incomingPeriod.tSpans[x].duration.substring(0,1) != "=") {
                        //rightmost character should be a letter that indicates the length or its in days
                        var durVal = incomingPeriod.tSpans[x].duration;
                        var durType = durVal.substring(durVal.length - 1, durVal.length)
                        if (durationHash[durType]) {
                            durVal = parseInt(durVal) * durationHash[durType];
                        }
                        else {
                            durVal = parseInt(durVal);
                        }
                        if(incomingPeriod.tSpans[x].s) {
                            processedTSpan["e"] = processedTSpan["s"] + durVal;
                        }
                        else if(incomingPeriod.tSpans[x].e) {
                            processedTSpan["s"] = processedTSpan["e"] - durVal;
                        }
                    }
                    else {
                        
                    }
                }
                if (incomingPeriod.tSpans[x].cstep) {
                    isCyclical = true;
                    if (incomingPeriod.tSpans[x].cstep.substring(0,1) != "=") {
                        var cycleBounds = processedTSpan;
                        var durVal = incomingPeriod.tSpans[x].cduration;
                        var durType = durVal.substring(durVal.length - 1, durVal.length)
                        if (durationHash[durType]) {
                            durVal = parseInt(durVal) * durationHash[durType];
                        }
                        else {
                            durVal = parseInt(durVal);
                        }
                        var stepVal = incomingPeriod.tSpans[x].cstep;
                        var stepType = stepVal.substring(stepVal.length - 1, stepVal.length)
                        if (durationHash[stepType]) {
                            stepVal = parseInt(stepVal) * durationHash[stepType];
                        }
                        else {
                            stepVal = parseInt(stepVal);
                        }
                        var x = cycleBounds.s;
                        var xe = cycleBounds.e;
                        while (x < xe) {
                            var processedCycleTSpan = {
                                s: x,
                                e: x + durVal
                                };
                                incomingPeriod.projectedTSpans.push(processedCycleTSpan);
                                x = x + stepVal;
                        }
                    }
                }

                if (isCyclical == false) {
                    incomingPeriod.projectedTSpans.push(processedTSpan);
                //estimate an end or start if none is discovered
                    estimatePeriodOnTheFly(incomingPeriod.projectedTSpans[incomingPeriod.projectedTSpans.length - 1]);
                }
            }
            currentProcessedPeriods.splice(currentProcessedPeriods.indexOf(incomingPeriod),1);
        }
        //if you don't have a tSpan, then you need to be flagged for estimation
        else {
            if (currentProcessedPeriods.indexOf(incomingPeriod) > -1) {
                currentProcessedPeriods.splice(currentProcessedPeriods.indexOf(incomingPeriod),1);
            }
            incomingPeriod.projectedTSpans.push({});
            incomingPeriod.estimated = true;
            estimatePeriodOnTheFly(incomingPeriod.projectedTSpans[0]);
        }
    }
    
    function newStatistics() {
        //don't sort the initial array, sort a duplicate, so that you don't screw up the order whenever you want to determine statistics

        var sortingArray = duplicateArray(temporalPeriods);
        
        sortingArray.sort(function(a,b) {
            var adur = d3.mean(a.projectedTSpans, function(p) {return p.s});
            var bdur = d3.mean(b.projectedTSpans, function(p) {return p.s});
            if(adur < bdur) {
                return -1;
            }
            else if(adur > bdur) {
                return 1;
            }
            else {
                return 1;
            }
        });

        stats.medianS = d3.max(sortingArray, function(d,i) {return i < (sortingArray.length * .5) ? d3.mean(d.projectedTSpans, function(p) {return p.s}) : null});
        stats.earliestJulian = d3.min(sortingArray, function(d,i) {return d3.min(d.projectedTSpans, function(p) {return p.s})});
        stats.latestJulian = d3.max(sortingArray, function(d,i) {return d3.max(d.projectedTSpans, function(p) {return p.e})});
        sortingArray.sort(function(a,b) {
            var adur = d3.mean(a.projectedTSpans, function(p) {return p.e - p.s});
            var bdur = d3.mean(b.projectedTSpans, function(p) {return p.e - p.s});
            if(adur < bdur) {
                return -1;
            }
            else if(adur > bdur) {
                return 1;
            }
            else {
                return 1;
            }
        })

         //TO DO stats by class (stats object will have class attributes that each hold a version, as well as "global")
            stats.min = d3.min(sortingArray, function(d) {return d3.min(d.projectedTSpans, function(p) {return p.e - p.s})});
            stats.mean = d3.mean(sortingArray, function(d) {return d3.mean(d.projectedTSpans, function(p) {return p.e - p.s})});
            stats.max = d3.max(sortingArray, function(d) {return d3.max(d.projectedTSpans, function(p) {return p.e - p.s})});
            stats.quartile1 = d3.max(sortingArray, function(d,i) {return i < (sortingArray.length * .25) ? d3.mean(d.projectedTSpans, function(p) {return p.e - p.s}) : null});
            stats.median = d3.max(sortingArray, function(d,i) {return i < (sortingArray.length * .5) ? d3.mean(d.projectedTSpans, function(p) {return p.e - p.s}) : null});
            stats.quartile3 = d3.max(sortingArray, function(d,i) {return i < (sortingArray.length * .75) ? d3.mean(d.projectedTSpans, function(p) {return p.e - p.s}) : null});

            
        //original estimation (uses median values which is better)
        /*
        var estPeriods = temporalPeriods.filter(function(el) {return el.estimated});
        for (x in estPeriods) {
            if (!estPeriods[x].projectedTSpans[0].s) {
                estPeriods[x].projectedTSpans[0].s = stats.medianS;
            }
            if (!estPeriods[x].projectedTSpans[0].e) {
                estPeriods[x].projectedTSpans[0].e = estPeriods[x].projectedTSpans[0].s + stats.median;
            }
        }
        */

    }
    
    this.generateStatistics = function() {
        newStatistics();
        return true;
    }
    
    function duplicateArray(incArray) {
        var newArray = []
        for(x in incArray) {
            newArray.push(incArray[x]);
        }
        return newArray;
    }
}
