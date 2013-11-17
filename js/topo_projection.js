
d3_chrono_projection = function(incomingDate, incomingType) {
    
    //scale determines the return value units, with temporalReferencePoint used if it's x time units from that point
    //default if temporalReferencePoint is null is Gregorian calendar
    var temporalType = "date", temporalAtom = "date", scale = 1, temporalScale = 1, temporalOrigin = "1900-01-01", temporalTranslate = [0,0];

    //Type: date, year, day, month, hour
    //Operator: before, after, date

    unixToAtom = {
        second: 0.00001157407407,
        minute: 0.000694444,
        hour: 0.0416666,
        day: 1,
        week: 7,
        month: 30.41,
        year: 365.25,
        decade: 365.25 * 10,
        century: 365.25 * 100
    }
    
    this.project = function(incomingDate) {
        if (temporalAtom == "date") {
            return getJulian(new Date(incomingDate));
        }
        else {
            var theAtom = temporalAtom;
            if (unixToAtom[temporalAtom]) {
                theAtom = unixToAtom[temporalAtom];
            }
            var julOrigin = getJulian(new Date(temporalOrigin));
            return julOrigin + (incomingDate * theAtom);            
        }

        function getJulian(incDate) {
            return Math.floor((incDate / 86400000) - (incDate.getTimezoneOffset()/1440) + 2440587.5);
        }
        return false;
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
        
this.type = function(newType) {
            if(newType) {
                temporalType = newType;
                return this;
            }
            else {
                return temporalType;
            }
        }
        return this;
}
