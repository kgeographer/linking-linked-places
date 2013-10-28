d3_layout_timeline = function() {
    var topLayer = 0, bottomLayer = 0, eventRelations = [], temporalProjection, eventHash = {}, tlWidth = 100, tlHeight = 100, temporalRange =[0,1], temporalType = "date", timeScale = 1, featureCollection, temporalPeriods = [], temporalEvents = [], timeSegments, numLanes = 1, earliestDate = 1, latestDate = 10;
    
        sortTimes = 0;

    this.timeEvents = [];
    this.timeSegments = [];

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
    
    this.featureCollection = function(newCollection) {
            var periods = [];
            var events = [];

        if (newCollection) {
            switch(newCollection.type) {
            case "PeriodEvents":
            periods = newCollection.periodCollection;
            events = newCollection.eventCollection;
            break;
        case "PeriodCollection2":
            periods = newCollection.Features.filter(function(el) {return el.class=="life"});
            events = newCollection.Features.filter(function(el) {return el.class=="event"})
            relations = newCollection.Relations;
            evHash = {};
            for (ev in events) {
                if (events[ev]) {
                    events[ev].pred = "none";
                    events[ev].tSpans = [events[ev].s,events[ev].e]
                    events[ev].tObjs = createTObjs(events[ev]);
                    evHash[events[ev].id] = ev;
                }
            }
            for (re in relations) {
                if (relations[re]) {
                relations[re].pred = relations[re].rel;
                }
            }
            eventRelations = relations;

            for (pe in periods) {
                if (periods[pe]) {
                    periods[pe].events = [];
                    periods[pe].details = [];
                    periods[pe].rels = [];
                    periods[pe].tSpans = [periods[pe].s,periods[pe].e]
                    periods[pe].tObjs = createTObjs(periods[pe]);
                    for (re in relations) {
                        if (relations[re]) {
                    if (periods[pe].id == relations[re].subj) {
                        periods[pe].details.push(evHash[relations[re].obj]);
                        periods[pe].rels.push(evHash[relations[re].obj]);
                        periods[pe].events.push(evHash[relations[re].obj]);
                    }
                        }
                    }
                }
            }
            
            break;
            case "archaeo":
            sortTimes = 3;
            temporalType = "integer";
            periods = newCollection.features.filter(function(el) {return el.class=="catal:Unit"});
            eventRelations = [];
            periodRelations = newCollection.relations;
            
            for (pe in periods) {
                periods[pe].details = [];
                //timeSpans act as columns
                periods[pe].tSpans = [1,20];
                periods[pe].unkDuration = true;
                periods[pe].height = 1;
            }
            
            for (pr in periodRelations) {
                if (periodRelations[pr]) {
                        var oldSubj = periodRelations[pr].subj;
                        var oldObj = periodRelations[pr].obj;
                    if (periodRelations[pr].rel == 'above') {
                        periodRelations[pr].subj = oldSubj;
                        periodRelations[pr].obj = oldObj;
                        periodRelations[pr].rel = 'followed_by';
                    }
                    else if (periodRelations[pr].rel == 'below') {
                        periodRelations[pr].subj = oldObj;
                        periodRelations[pr].obj = oldSubj;
                        periodRelations[pr].rel = 'followed_by';
                    }
                    var newRelation = {id: "pr"+pr, pred: periodRelations[pr].rel, subj: "None", obj: "", src: "None listed"}
        for (pe in periods) {
                        if (periods[pe]) {
                            if (periods[pe].id == periodRelations[pr].subj) {
                                periods[pe].details.push(eventRelations.length);
                            }
                            else if (periods[pe].id == periodRelations[pr].obj) {
                                newRelation.obj = periods[pe].id;
                            }
                        }
                    }
                }
                eventRelations.push(newRelation);
            }
            break;
        case "PeriodCollection":
            periods = newCollection.Features.filter(function(el) {return el.class=="HistPeriod"});
            events = newCollection.Features.filter(function(el) {return el.class=="Event"})
            eventRelations = newCollection.Relations;

            evHash = {};
            for (ev in events) {
                if (events[ev]) {
                    evHash[events[ev].id] = ev;
                }
            }

            for (pe in periods) {
                if (periods[pe]) {
                    if (periods[pe].rels) {
                        periods[pe].events = [];
                        periods[pe].details = [];
                        for (re in periods[pe].rels){
                            periods[pe].events.push(periods[pe].rels[re])
                            for (revs in newCollection.Relations) {
                                if (newCollection.Relations[revs].id == periods[pe].rels[re]) {
                                    periods[pe].details.push(revs);
                                }
                            }
                        }
                    }
                    
                }
            }
        break;
            }
            if (!temporalProjection) {
                temporalProjection = new d3_chrono_projection();
                var minDate = d3.min(periods, function(p) {return p.tSpans[0]});
                temporalProjection.origin(minDate);
//Compute scale based on origin and most distant period end
                var maxDate = d3.max(periods, function(p) {return dateHandler(p.tSpans[1], temporalType)});
                var defaultScale = 1;
                var defaultAtom = 1;
                var defaultOrigin = 1;
                if (temporalType == "date") {
                    defaultScale = tlWidth / temporalProjection.project("" + maxDate.getFullYear() + "-" + (maxDate.getMonth() + 1) + "-" + maxDate.getDate());
                    defaultAtom = "year";
                }
                temporalProjection.scale(defaultScale);
                temporalProjection.atom(defaultAtom);
                if (newCollection.projection) {
                    if(newCollection.projection.atom) {temporalProjection.atom(newCollection.projection.atom)}
                    if(newCollection.projection.origin) {temporalProjection.origin(newCollection.projection.origin)}
                    if(newCollection.projection.scale) {temporalProjection.scale(newCollection.projection.scale)}
                }
            }
            this.timePeriods(periods);
            this.eventPeriods(events);
            this.update();
            return this;

        }
        else {
            return newCollection;
        }
        return this;
    
    function createTObjs(incObj) {
        var compiledArray = [];
        if (!incObj.timeType) {
            compiledArray.push([incObj.s,incObj.e]);
            compiledArray.push(incObj.ls ? [incObj.s,incObj.ls] : [incObj.s,incObj.s]);
            compiledArray.push(incObj.ee ? [incObj.ee, incObj.e] : [incObj.e,incObj.e]);
            return compiledArray;
        }
        else if (incObj.timeType == "array") {
            var op = incObj.periods;
            compiledArray.push([op[0].s,op[2].e]);
            for (o in op) {
                compiledArray.push(op[o].ls ? [op[o].s,op[o].ls] : [op[o].s,op[o].s]);
                compiledArray.push(op[o].ee ? [op[o].ee, op[o].e] : [op[o].e,op[o].e]);
                compiledArray.push([op[o].s, op[o].e]);
            }
            return compiledArray;
        }
        else if (incObj.timeType == "periodicity") {
            var per = incObj.periodicity;
            var startYear = per.first[0];
            var endYear = per.last[0];
            compiledArray.push(["" + per.first[0] + "-" + per.start[1] + "-" + per.start[2], "" + per.last[0] + "-" + per.end[1] + "-" + per.end[2]])
            while (startYear <= endYear) {
                compiledArray.push(["" + startYear + "-"+ per.start[1]+"-"+per.start[2], "" + startYear + "-"+ per.end[1]+"-"+per.end[2]]);
                startYear += per.step[0];
            }
            return compiledArray;
        }

        return false;
    }
    }
    
    this.eventPeriods = function(newPeriodsArray) {
            if(newPeriodsArray) {
                temporalEvents = newPeriodsArray;
                return this;
            }
            else {
            return temporalEvents;
            }
    }

    this.timePeriods = function(newPeriodsArray) {
            if(newPeriodsArray) {
                temporalPeriods = newPeriodsArray;
                return this;
            }
            else {
                return temporalPeriods;
            }
    }

    this.timeRelations = function(newRelationsArray) {
            if(newRelationsArray) {
                eventRelations = newRelationsArray;
                return this;
            }
            else {
                return eventRelations;
            }
    }
    
    this.update = function() {
        if (temporalPeriods) {
            formatPeriodsArray(temporalPeriods);
            earliestDate = d3.min(temporalPeriods, function(p) {return p.tSpans[0]});
            latestDate = d3.max(temporalPeriods, function(p) {return p.tSpans[1]});
            temporalRange = [earliestDate,latestDate];
        }
        if(temporalEvents) {
            formatEventsArray(temporalEvents);
        }
    }
    
    function formatPeriodsArray(inArray) {
        var timeRamp = d3.scale.linear().domain([dateHandler(temporalProjection.origin(),temporalType),dateHandler(temporalRange[1],temporalType)]).range([0,tlWidth])
        //Figure out the unixtime to generic step ratio by taking the earliest date and moving it forward one step
        //For now it's a unixday
        var atomicStep = temporalStep(timeRamp,temporalType,temporalProjection);
        for (x in inArray) {
            if (inArray[x]) {
                if (inArray[x]["events"]) {
                    for (y in inArray[x]["events"]) {
                        if (inArray[x]["events"][y]) {
                            if (!eventHash[inArray[x]["events"][y]]) {
                                eventHash[inArray[x]["events"][y]] = [];
                            }
                            eventHash[inArray[x]["events"][y]].push(inArray[x]);
                        }
                    }
                }
                inArray[x]["lane"] = setLane(inArray[x]);
                inArray[x]["x"] = timeRamp(dateHandler(inArray[x]["tSpans"][0],temporalType));
                inArray[x]["duration"] = (dateHandler(inArray[x]["tSpans"][1],temporalType) - dateHandler(inArray[x]["tSpans"][0],temporalType)) / temporalProjection.atom() * atomicStep;
//                inArray[x]["subArray"] = createSubArray(inArray[x]["tSpans"]);
            }
        }
        
        function createSubArray(inSpans) {
            
        }
        
    }

    function formatEventsArray(inArray) {
        var timeRamp = d3.scale.linear().domain([dateHandler(temporalProjection.origin(),temporalType),dateHandler(temporalRange[1],temporalType)]).range([0,tlWidth])
        //Figure out the unixtime to generic step ratio by taking the earliest date and moving it forward one step
        var atomicStep = 1
        if (temporalType == "date") {
           atomicStep = timeRamp(dateHandler(temporalProjection.origin(),temporalType).getTime() + temporalProjection.atom());
        }
        for (x in inArray) {
            if (inArray[x]) {
                if (eventHash[evHash[inArray[x]["id"]]]) {
                    highestLane = d3.min(eventHash[evHash[inArray[x]["id"]]], function(p) {return p.lane});
                    lowestLane = d3.max(eventHash[evHash[inArray[x]["id"]]], function(p) {return p.lane});
                    inArray[x]["laneArray"] = [highestLane,lowestLane];
                }
                else {
                    inArray[x]["laneArray"] = [0,0];
                }
                inArray[x]["x"] = timeRamp(dateHandler(inArray[x]["tSpans"],temporalType));
                inArray[x]["duration"] = 1;
            }
        }
    }
    
    lanes = {};
    
    function setLane(incomingFeature) {
        //first we need to sort the array so that anything that is not a "followed_by" is laid out first.
        //Typically this is accomplished by dates (earliest first) but in the case of sequential this needs to be explicit
        var x = temporalPeriods.length;
        while (x >= 0) {
            if (temporalPeriods[x]) {
            if (temporalPeriods[x].details) {
                for (r in temporalPeriods[x].details) {
                    if (eventRelations[temporalPeriods[x].details[r]]) {
                    if (eventRelations[temporalPeriods[x].details[r]].pred == "followed_by") {
                        temporalPeriods.push(temporalPeriods[x]);
                        temporalPeriods.splice(x,1);
                    }
                    }
                }
            }
            }
            x--;
        }
        for (ch in temporalPeriods) {
            if (temporalPeriods[ch].lane && temporalPeriods[ch].details) {
                for (r in temporalPeriods[ch].details) {
                    if (eventRelations[temporalPeriods[ch].details[r]].pred == "followed_by" && (eventRelations[temporalPeriods[ch].details[r]].obj == "HistPeriod_" + incomingFeature.id || eventRelations[temporalPeriods[ch].details[r]].obj == incomingFeature.id)) {
                        if (incomingFeature.unkDuration) {
                            incomingFeature.tSpans[0] = temporalPeriods[ch].tSpans[0] + 30;
                            incomingFeature.tSpans[1] = temporalPeriods[ch].tSpans[1] + 30;
                        }
                        console.log("followed")
                        return temporalPeriods[ch].lane;
                    }
                    if (eventRelations[temporalPeriods[ch].details[r]].pred == "equal to" && eventRelations[temporalPeriods[ch].details[r]].obj == incomingFeature.id) {
                        incomingFeature.tSpans[0] = temporalPeriods[ch].tSpans[0];
                        incomingFeature.tSpans[1] = temporalPeriods[ch].tSpans[1];
/*                       if (lanes[temporalPeriods[ch].lane + 1]) {
                            lanes[temporalPeriods[ch].lane + 1].push(incomingFeature)
                        }
                        else {
                            lanes[temporalPeriods[ch].lane + 1] = [incomingFeature];
                        }
                        return temporalPeriods[ch].lane + 1;
*/                    
                    }
                }
            }
        }
        /*
        if(s < sortTimes) {
            for (pr in temporalPeriods) {
                for (prr in temporalPeriods) {
                    if (temporalPeriods[pr].lane == temporalPeriods[prr].lane && temporalPeriods[pr].id != temporalPeriods[prr].id && temporalPeriods[pr].tSpans[0] >= temporalPeriods[prr].tSpans[0] && temporalPeriods[pr].tSpans[0] <= temporalPeriods[prr].tSpans[1]) {
                        temporalPeriods[pr].tSpans[0] = temporalPeriods[prr].tSpans[0] + 30;
                        temporalPeriods[pr].tSpans[1] = temporalPeriods[prr].tSpans[1] + 30;                       
                    }
                }
            }
        }
        */
        var maxLane = d3.max(temporalPeriods, function (d) {return d.lane});
        if (maxLane) {
            var currentLane = maxLane + 1;
            for (z in temporalPeriods) {
                if (temporalPeriods[z]) {
                    if(temporalPeriods[z].lane) {
                        var laneEnd = d3.max(lanes[temporalPeriods[z].lane], function(p) {return (dateHandler(p.tSpans[1],temporalType))});
                    if (temporalPeriods[z].lane < currentLane && (laneEnd < dateHandler(incomingFeature.tSpans[0],temporalType))) {
                        currentLane = parseInt(temporalPeriods[z].lane);
                    }
                }
                }
            }
            if (lanes[currentLane]) {
                lanes[currentLane].push(incomingFeature)
            }
                else {
                lanes[currentLane] = [incomingFeature];
            }
            return currentLane;
        }
        else {
            lanes["1"] = [incomingFeature];
            return 1;
        }
    }
    
    function findDateRange() {
    }

    //int is just a simple numerical representation of a year, a month, or a sequence
    //date is expecting a js string that can be recognized by date()
    //period array is an array of dates or periods and the accessor function will recursively find the date
    //topotime is a specific new format that understands adjacency, overlap
    //annotated requires that the specific type is specified in the data
    
    temporalTypeWrapper = {
        "int": "integer-wrapper-function",
        "date": "date-wrapper-function",
        "period-array": "period-array-wrapper-function",
        "topotime": "topotime-wrapper-function",
        "annotated": "annotated-wrapper-function"
    }

}

d3_chrono_projection = function(incomingDate, incomingType) {
    
    this.project = function(incomingDate,incomingType) {
        var projectionReturn = {}
        switch(incomingType) {
            case "date":
            if (typeof(incomingDate) == "object") {
                projectionReturn.width = Math.max(1,((dateHandler(incomingDate[1],"date") - dateHandler(incomingDate[0],"date")) / this.atom()) * this.scale());
                projectionReturn.x = ((dateHandler(incomingDate[0],"date") - dateHandler(temporalOrigin,"date")) / this.atom()) * this.scale();
            }
            else {
                projectionReturn.x = ((dateHandler(incomingDate,"date") - dateHandler(temporalOrigin,"date")) / this.atom()) * this.scale();
                projectionReturn.width = 1;
            }
            break;
            case "integer":
            if (typeof(incomingDate) == "object") {
                projectionReturn.width = ((incomingDate[1] - incomingDate[0]) / this.atom()) * this.scale();
                projectionReturn.x = ((incomingDate[0] - dateHandler(temporalOrigin,"integer")) / this.atom()) * this.scale();
            }
            else {
                projectionReturn.x = ((incomingDate - dateHandler(temporalOrigin,"integer")) / this.atom()) * this.scale();
                projectionReturn.width = 1;
            }
            break;

        }
        return projectionReturn;
    }
    
    //scale determines the return value units, with temporalReferencePoint used if it's x time units from that point
    //default if temporalReferencePoint is null is Gregorian calendar
    var temporalAtom = "day", scale = 1, temporalScale = 1, temporalOrigin = dateHandler("0001-01-01","date"),temporalReferencePoint = "gregorian", temporalTranslate = [0,0];

    unixToAtom = {
        second: 1000,
        minute: 1000 * 60,
        hour: 1000 * 60,
        day: 1000 * 60 * 60 * 24,
        week: 1000 * 60 * 60 * 24 * 7,
        month: 1000 * 60 * 60 * 24 * 30.41,
        year: 1000 * 60 * 60 * 24 * 365.25,
        decade: 1000 * 60 * 60 * 24 * 365.25 * 10,
        century: 1000 * 60 * 60 * 24 * 365.25 * 100
    }
    
    this.origin = function(newOrigin) {
            if(newOrigin) {
                temporalOrigin = newOrigin;
                return this;
            }
            else {
            return temporalOrigin;
            }
        }
        
            this.scale = function(newScale) {
            if(newScale) {
                temporalScale = newScale;
                return this;
            }
            else {
            return temporalScale;
            }
        }

    this.translate = function(newTranslate) {
            if(newTranslate) {
                temporalTranslate = newTranslate;
                return this;
            }
            else {
            return temporalTranslate;
            }
        }
    
    this.scale = function(newScale) {
            if(newScale) {
                temporalScale = newScale;
                return this;
            }
            else {
            return temporalScale;
            }
        }
    
    this.atom = function(newAtom) {
            if(newAtom) {
                temporalAtom = newAtom;
                return this;
            }
            else {
                if (unixToAtom[temporalAtom]) {
                    return unixToAtom[temporalAtom];
                }
                //assume if it's not in the list it's some kind of other definition
                else {
                    return temporalAtom;
                }
            }
        }
        return this;
}

function dateHandler(incomingDate,format) {
    switch(format) {
        case "date":
        return new Date(incomingDate);
        break;
        case "integer":
        return incomingDate;
        break;
    }
    return false;
}

function temporalStep(incRamp,incDateType,incProjection) {
    switch(incDateType) {
    case "date":
    return incRamp(dateHandler(incProjection.origin(),incDateType).getTime() + incProjection.atom());
    break;
    case "integer":
    return incRamp(incProjection.origin() + incProjection.atom());
    break;
    }
    return false;
}

function boundingBox(temporalFeatures) {
        
}
    