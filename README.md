Topotime (0.2)
==========================

**topo** (_from Greek τοπο-, a combining form of **τόπος** place_)

**Topotime** is a digital humanities project that will operationalize a four dimensional conceptual model of geographic phenomena for geo-historical information systems (_Settings_), by extending the existing GeoJSON data format standard and developing open-source software to utilize it.

The project's planned work products include:

* **GeoJSON-T**, adding temporal ("when") objects to GeoJSON, making it suitable for representing:
	* historical gazetteer records
	* attestations of historical geographic movement, such as journeys, routes, and flows of commodities, people, and information
* **Topotime.js**, a JavaScript library for rendering GeoJSON-T data to a web map linked to a traditional timeline and/or _temporal geometry_ visualizations. Its dependencies will include the Leaflet, Simile Timeline, and D3 libraries, as well as...
* **Topotime.py**, a Python program for generating _temporal geometries_ from GeoJSON&#8209;T data

All of these are under active development, so the contents of this repo are dynamic "works-in-progress." Comments, suggestions, and reasonably polite brickbats are welcome.

###Example data files/maps (in progress)

We are experimenting with two approaches for adding **"when"** information to FeatureCollections in GeoJSON&#8209;T. So far, each appears to suit one or more use cases; examples in development are listed below.

* the "_Bag of Features_" approach: **when** as a sibling element of **type**, **geometry**, and **properties** for each Feature,  and
* the "_GeometryCollection_" approach: geometry type for each Feature is GeometryCollection, and for each **geometry** in the GeometryCollection, **when** is a sibling element of **type**, **coordinates**, and an optional **properties**.

#### *_Bag of Features approach_*
Gazetteer records:  
[Incanto Trade: Places, 1283-1453 CE](https://github.com/kgeographer/topotime/blob/master/data/BagOfFeatures/incanto_places.geojson)  

Itineraries:  
[The Pilgrimage of Xuanzang, 629-646 CE](https://github.com/kgeographer/topotime/blob/master/data/BagOfFeatures/xuanzang_way-collection.geojson)  
[Incanto Trade: 1 voyage, w/places (Venice-Armenia), 1301 CE  ](https://github.com/kgeographer/topotime/blob/master/data/BagOfFeatures/incanto_1voyage-w-places.geojson)  
[Incanto Trade: 1 voyage, no places (Venice-Armenia), 1301 CE  ](https://github.com/kgeographer/topotime/blob/master/data/BagOfFeatures/incanto_1yoyage-no-places.geojson)  
[Incanto Trade: 840 voyages in 3523 segments, 1283-1453 CE  ](https://github.com/kgeographer/topotime/blob/master/data/BagOfFeatures/incanto_840voyages.geojson)   

Flows:  
[Incanto Trade: Total ships per segment, 1282-1453](https://github.com/kgeographer/topotime/blob/master/data/BagOfFeatures/incanto_total-ships.geojson)  
[Incanto Trade: Total ships per segment (w/places), 1282-1453](https://github.com/kgeographer/topotime/blob/master/data/BagOfFeatures/incanto_flow-features-w-places.geojson)

Historical periods:  
Hodos (2006). [_Local Responses to Colonization in the Iron Age Mediterranean_] (https://github.com/kgeographer/topotime/blob/master/data/BagOfFeatures/periodo_p0tns5v.tt.json); Source retrieved from **PeriodO** [2] http://n2t.net/ark:/99152/p0tns5v
____________
#### *_GeometryCollection approach_*
Euratlas time-indexed admin units [1]:  
[Poland and related sovereign states, 800-2000 CE](https://github.com/kgeographer/topotime/blob/master/data/GeometryCollection/euro_poland.tt.json)

Itineraries:  
[The Pilgrimage of Xuanzang (partial)] (https://github.com/kgeographer/topotime/blob/master/data/GeometryCollection/itinerary.tt.json)  
[A short faux itinerary and 2 areas](https://github.com/kgeographer/topotime/blob/master/data/GeometryCollection/multi-type.tt.json)  
____________
____________
###Documentation
**v0.2**  

- GitHub docs in progress [wiki](https://github.com/kgeographer/topotime/wiki)

- Data format [pattern examples](https://github.com/kgeographer/topotime/blob/tt-geojson/spec-outlines_18Aug2015.md)

**v0.1**  
Example [software and data](http://dh.stanford.edu/topotime)


____________
[1] Data licensed from [Euratlas](http://www.euratlas.net/history/europe/)  
[2] The [**PeriodO project**](http://perio.do/) is building a gazetteer of scholarly definitions of historical, art-historical, and archaeological periodsproject

**Contributors**   
Karl Grossner (*kgeographer*; twitter:@kgeographer); Elijah Meeks (v0.1; *emeeks*)
