Topotime
========

A pragmatic JSON data format, D3 layout, and functions for representing and computing over complex temporal phenomena.


Topotime currently permits the representation of:

* Standard, multipart, cyclical, and duration-defined _Timespans_ in _Periods_
* Uncertain temporal extents; operators for Timespan elements include: **_before_** (**<**), **_after_** (**>**), **_about_** (**~**), and **_equals_** (**=**). Timespan elements (_start_, _latest start_, _earliest end_, _end_) can be ISO-8601 ( [-]Y{1,7}[-MM][-DD] ) or _pointers to other Timespans or their individual elements_. So for example, **>23.e** stands for '_after the end of Period 23 in this collection_.' 
* Estimated periods when a period has no timespan defined
* Relations between events; so far, _part-of_, and _participates-in_. Further relations including _has-location_ are in development.

To learn more, check out the following pages and [others in the Wiki.](https://github.com/ComputingPlace/topotime/wiki)

####Files (javascript):

* timeline.js - A D3 timeline layout
* topo\_projection.js - Temporal projection function used for topotime data
* example.js - Example code for using the timeline layout and displaying the processed results

####Files (Python)
* py/ttParse.py - Parses a data file and generates temporal geometries permitting calculation of purely temporal topological relations including containment and overlap.
* py/ajx2.py - Functions for computing intersections between Period timespans
* ttDemo.html - Some early interactive access to Python functions

####Example Data

These files are parsed by either timeline.js or ttParse.py
* topotime_format.json - JSON file with various supported period types
* data/pleiades\_periods.json - pleiades\_periods.csv converted into a JSON object with the addition of an extra period ("Holocene Climatic Optimum") with no defined timespan


####Future developments
* Actors
* Example tied to geospatial and network data

#####Contributors
* Elijah Meeks (@Elijah_Meeks)
* Karl Grossner (@kgeographer)
