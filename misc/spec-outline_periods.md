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