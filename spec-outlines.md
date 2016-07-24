18 Aug 2016

This set of examples is preliminary and incomplete, but indicates the direction Topotime is taking. There are multiple patterns for extending the basic GeoJSON model, accounting for different kinds of spatial-temporal phenomena. So far: __1) Simple__ (sets of geometry/when pairs; includes regions of any type changing shape over time, e.g. political entities, cultural diffusion) [example](https://github.com/kgeographer/topotime/blob/tt-geojson/data/out/euro_poland.tt.json) ; __2) Periods__ (a set of 'whens' for each distinct geometry) [example](https://github.com/kgeographer/topotime/blob/tt-geojson/data/out/periodo_p0tns5v.tt.json); __3) Trajectories__ (itineraries, i.e. things moving across the landscape over time generally) [example](https://github.com/kgeographer/topotime/blob/tt-geojson/data/out/itinerary.tt.json). All timespans have a "type" of "throughout" or "during" (accompanied by a "duration") to facilitate visualization and computing such things as probable overlap.

###Example 1: Simple things: regions, periods or events in space and time
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
		  			"label": "around the turn of the century" },
		  		"type": "throughout,
		  		"source": ""
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
		. . .
	}
  ]
}
```

###Example 2: Historical periods (e.g. from PeriodO)
```
{ "type": "FeatureCollection",
  "features": [
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
		  		"end": {
	  				"earliest": "-0599",
	  				"latest": "-0500"
	  				"label": "sixth century BC" },
	  			"type": "throughout",
		  		"properties": {
		  			"eng-ltn": "Iron Age", "prop2": ""}
	  		}, {
	  			1..* periods for region
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
###Example 3: Trajectories (itinerary, journey, lifepath)

Use of GeometryCollection

```
{
  "type": "FeatureCollection",
  "id": "fc123",
  "label": "The Pilgrimage of Xuanzang",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "featureType": "Itinerary",
        "src": "Whitney Thorpe, UC Merced",
        "label": "The Pilgrimage of Xuanzang (partial)"
      },
      "geometry": {
        "type": "GeometryCollection",
        "geometries": [
          {
            "type": "Point",
            "coordinates": [ 108.9, 34.2667 ],
            "properties": {
              "id": "fc123_001",
              "label": "Departed Chang'an"
            },
            "when": {"timespans":[
              {
                "label": "in 629 C.E.",
                "type": "during",
                "start": {
                  "earliest": "0629-01-01"
                },
                "end": {
                  "latest": "0629-12-31"
                },
                "duration": "1d"
              }
            ]}     
          },
          {
            "type": "MultiLineString",
            "coordinates": [
              [[ 108.9, 34.2667 ],[ 102.642,37.9283]]
            ],
            "properties": {
              "id": "fc123_002",
              "label": "Chang'an to Liangzhou"
            },
            "when": {"timespans":[
              {
                "label": "in 629 C.E.",
                "type": "during",
                "start": {
                  "earliest": "0629-01-01"
                },
                "end": {
                  "latest": "0629-12-31"
                },
                "duration": "?d"
              }
            ]}
          },
          {
            "type": "Point",
            "coordinates": [ 102.642, 37.9283 ],
            "properties": {
              "id": "fc123_003",
              "label": "Stayed 1 month in Liangzhou"
            },
            "when": {"timespans":[
              {
                "label": "in 629 C.E.",
                "type": "during",
                "start": {
                  "earliest": "0629-01-01"
                },
                "end": {
                  "latest": "0629-12-31"
                },
                "duration": "1m"
              }
            ]}
          },
          {
            "type": "MultiLineString",
            "coordinates": [[[102.642, 37.9283],[95.8,40.5]]],
            "properties": {
              "id": "fc123_004",
              "label": "Liangzhou to An-hsi (Yuanquan)"
            },
            "when": {"timespans":[
              {
                "label": "in 629 C.E.",
                "type": "during",
                "start": {
                  "earliest": "0629-01-01"
                },
                "end": {
                  "latest": "0629-12-31"
                },
                "duration": "?d"
              }
            ]}
          },
          {
            "type": "Point",
            "coordinates": [ 95.8,40.5 ],
            "properties": {
              "id": "fc123_005",
              "label": "Acquired supplies in An-hsi (Yuanquan)"
            },
            "when": {"timespans":[
              {
                "label": "in 629 C.E.",
                "type": "during",
                "start": {
                  "earliest": "0629-01-01"
                },
                "end": {
                  "latest": "0629-12-31"
                },
                "duration": "?d"
              }
            ]}
          }
        ]
      }
    }
  ]
}
```
