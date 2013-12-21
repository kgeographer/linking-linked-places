Topotime
========

A pragmatic JSON data format, D3 layout, and functions for representing and computing over complex temporal phenomena. It is under active development by Elijah Meeks (emeeks) and Karl Grossner (kgeographer), who welcome forks, comments and suggestions.


Topotime currently permits the representation of:

* Singular, multipart, cyclical, and duration-defined _timespans_ in _periods_ (**tSpan** in **Period**). A Period can be any discrete temporal thing, e.g. an historical period, an event, or a lifespan (of a person, group, country).
* The tSpan elements _start_ (**s**), _latest start_ (**ls**), _earliest end_ (**ee**), _end_ (**e**) can be ISO-8601 (YYYY-MM-DD, YYYY-MM or YYYY), or pointers to other tSpans or their individual elements. For example, **>23.s** stands for '_after the start of Period 23 in this collection_.' 
  * Uncertain temporal extents; operators for tSpan elements include: **_before_** (**<**), **_after_** (**>**), **_about_** (**~**), and **_equals_** (**=**). 
* Estimated timespan when no tSpan is defined
* Relations between events; so far, _part-of_, and _participates-in_. Further relations including _has-location_ are in development.

To learn more, check out these and other pages in [the Wiki](https://github.com/ComputingPlace/topotime/wiki) and [the Topotime web page](dh.stanford.edu/topotime)

* [Topotime v 0.1 Specification (wiki)](https://github.com/ComputingPlace/topotime/wiki/Topotime-v-0.1-specification)
* [Live examples (web page)] (http://dh.stanford.edu/topotime/)

#####Files (JavaScript):

* timeline.js - A D3 timeline layout
* topo\_projection.js - Temporal projection function used for topotime data
* example.js - Example code for using the timeline layout and displaying the processed results
* index.html - Renders a D3 timeline to a web page
* us_states.html - Interactive timeline joined with a map
* stacked_timelines.html - 
* data_from_csv.html - Demonstrates parsing of topotime data written in CSV

#####Files (Python)
* py/periodic.py - Parses a topotime data file and generates temporal geometries in 3 formats (\_.pickle used by ajx2.py for calculating intersections; \_geom_d3.json for rendering in D3).
* py/ajx2.py - Functions for computing % intersect between Period timespans
* demo_py.html - Some interactive access to Python functions and basic visualizations of temporal geometry

#####Example Data

These files can be parsed by both timeline.js (for rendering timelines) and periodic.py (for other calculations)
* topotime_format.json - Supported period/timespan types
* pleiades98.json - 98 of 100 historic periods from the Pleiades project
* us_history.json - The "lifespans" of the 50 US states, plus some other events
* axial.json - Lifespans of (somewhat) contemporaneous historical figures in an "Axial Age"
* ww2.json - A TomHanks-ish scenario of 8 events during WW2
* dance.json - The lifespan of George Dance the Younger (1741-1825), an architect
* pleiades\_periods.json - pleiades\_periods.csv converted into a JSON object with the addition of an extra period("Holocene Climatic Optimum") with no defined timespan


#####Future developments
* Alternative JSON-LD representation of the data model
* Further examples tied to geospatial and network data
* Smoothed curves for 'sls' and 'eee' fuzzy bounds
* Further example queries to temporal geometries

#####Contributors
* Elijah Meeks (emeeks; t:@Elijah_Meeks)
* Karl Grossner (kgeographer; t:@kgeographer)
