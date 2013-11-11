topotime
========

A pragmatic JSON data format, D3 layout, and functions for representing and computing over complex temporal phenomena.

To learn more, [see the Wiki.](https://github.com/ComputingPlace/topotime/wiki)

Contents:
timeline.js - A D3 timeline layout
topo_projection.js - Temporal projection function used for topotime data
example.js - Example code for using the timeline layout and displaying the processed results
Currently Supported Data
pleiades_periods.js - pleiades_periods.csv converted into a JSON object with the addition of an extra period ("Holocene Climatic Optimum") with no defined timespan
topotime_format.json - JSON file with various supported period types

Unsupported Data
Building77.json - Chronological positioning determined solely by eels

Current Functionality
Support for standard, multipart, cyclical, and duration-defined periods
Estimated periods when a period has no timespan defined

Upcoming Functionality
* <>= in defining period s,ls,e,ee,duration(cspan,cduration?)
* Support for relations
* Actors
* Example tied to geospatial and network data
