Topotime v0.2 (tt-geojson)
==========================

__topo__ (_from Greek τοπο-, a combining form of **τόπος** place_)

Topotime is a data model, JSON data format, D3 timeline layout, and software for representing and computing over complex spatial-temporal phenomena (places, periods, and events), particularly for historical applications where extents are uncertain. Whereas Topotime v0.1 focused on time, Topotime v0.2 will model the spatial and temporal attributes of geographic features co-equally, as an extension to _GeoJSON_. It is under active development, and forks, comments, suggestions, and reasonably polite brickbats are welcome.

###Example data files/maps (in progress)
#### *_Bag of Features approach_*
**Itineraries (from Orbis Initiative repo)**     
[The Pilgrimage of Xuanzang, 629-646 CE](https://github.com/kgeographer/oi/blob/master/data/xuanzang_way-collection.geojson)  
[Incanto Trade: 1 voyage, w/places (Venice-Armenia), 1301 CE  ](https://github.com/kgeographer/oi/blob/master/data/incanto_1voyage-w-places.geojson)  
[Incanto Trade: 1 voyage, no places (Venice-Armenia), 1301 CE  ](https://github.com/kgeographer/oi/blob/master/data/incanto_1yoyage-no-places.geojson)  
[Incanto Trade: 840 voyages in 3523 segments, 1283-1453 CE  ](https://github.com/kgeographer/oi/blob/master/data/incanto_840voyages.geojson)  
[Incanto Trade: Places, 1283-1453 CE](https://github.com/kgeographer/oi/blob/master/data/incanto_places.geojson)  

Flows:  
[Incanto Trade: Total ships per segment, 1282-1453](https://github.com/kgeographer/oi/blob/master/data/incanto_total-ships.geojson)  
[Incanto Trade: Total ships per segment (w/places), 1282-1453](https://github.com/kgeographer/oi/blob/master/data/incanto_flow-features-w-places.geojson)

____________
#### *_GeometryCollection approach_*
**Euratlas time-indexed admin units** [1]  
[Poland and related sovereign states, 800-2000 CE](https://github.com/kgeographer/topotime/blob/tt-geojson/data/out/euro_poland.tt.json)

**PeriodO collections**  
Hodos (2006). [_Local Responses to Colonization in the Iron Age Mediterranean_] (https://github.com/kgeographer/topotime/blob/tt-geojson/data/out/periodo_p0tns5v.tt.json); PeriodO data source: http://n2t.net/ark:/99152/p0tns5v


**Itineraries**  
[The Pilgrimage of Xuanzang (partial)] (https://github.com/kgeographer/topotime/blob/tt-geojson/data/out/itinerary.tt.json)  
[A short faux itinerary and 2 areas](https://github.com/kgeographer/topotime/blob/tt-geojson/data/out/multi-type.tt.json)  
____________
____________
###Documentation
**v0.2**  

- GitHub docs in progress [wiki](https://github.com/kgeographer/topotime/wiki)

- Data format [pattern examples](https://github.com/kgeographer/topotime/blob/tt-geojson/spec-outlines_18Aug2015.md)

**v0.1**  
Example [software and data](http://dh.stanford.edu/topotime)

**related blog posts**  
[kgeographer.org](http://kgeographer.com/wp/category/time/topotime/)

____________
[1] Data licensed from [Euratlas](http://www.euratlas.net/history/europe/)

**Contributors**   
Karl Grossner (*kgeographer*; twitter:@kgeographer); Elijah Meeks (v0.1; *emeeks*)
