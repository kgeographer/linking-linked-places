###Example 1: Simple things, periods or events in space and time
```
{ "type": "FeatureCollection",
  "features": [
	{
	  "type": "Feature",
	  "geometry": {
	    "type": "Point",
	    "coordinates": [102.1333, 19.8833]
	  },
	  "when": {
	  	"timespans": [
	  		{
	  			"start": { 
	  				"earliest": "1832-01-01", 
	  				"latest": "1832-03-31"
	  				"label": "Early 1832" },
		  		"end": { 
		  			"earliest": "1890", 
		  			"latest": "1910",
		  			"label": "around the turn of the century" }
	  		}
	  	]
	  },
	  "properties": {
	    "name": "Entity_01234",
	    "notes": "an Artifact, Period, or Event in Luang Prabang: 
	    	created/began early 1832, and
	    	destroyed/ended around turn of the 20 c."
	  }
	}, {
		n features. . . 
	}
  ]
}
```

###Example 2: Historical periods (e.g. from PeriodO)
```
FeatureCollection
  features: [
	{
	  "type": "Feature",
	  "geometry": {
	    "type": "MultiPolygon",
	    "coordinates": [[[ ],[ ],[ ],[ ],[ ]],
	    	[[ ],[ ],[ ],[ ],[ ]]]
	  },
	  "when": {
	  	"timespans": [
	  		{
		  		"start": { 
		  			"earliest": "-1199", 
		  			"latest": "-1100",
		  			"label": "twelfth century BC" },
		  		end": { 
	  				"earliest": "-0599", 
	  				"latest": "-0500"
	  				"label": "sixth century BC" },
		  		"properties": {
		  			"eng-ltn": "Iron Age", "prop2": ""}
	  		}
	  	]
	  },
	  "properties": {
	    "spatialCoverage": [
	    	{"iso3166": "SY"}, {"iso3166": "JO"}, {"iso3166": "IL"},
	    	{"iso3166": "LB"}
	    ],
	    "featureType": "Historical Period,
	    "spatialCoverageDescription": "Levant"    
	  }
	}, {
		. . .
	}
  ]
```
