[![Stories in Ready](https://badge.waffle.io/kgeographer/topotime.png?label=ready&title=Ready)](https://waffle.io/kgeographer/topotime)
Topotime
==========================

**topo** (_from Greek τοπο-, a combining form of **τόπος** place_)

**Topotime** is a digital humanities project aiming to join Place and Period (space and time) in conceptual models, data formats, and software for geo-historical research. We are developing an experimental extension to the [GeoJSON data format standard](http://geojson.org/geojson-spec.html), and open-source software to utilize it.

The project's planned work products include:

* **GeoJSON-T**, adding temporal ("when") elements to GeoJSON, making it suitable for representing
	* historical gazetteer records
	* attestations of historical geographic movement, such as journeys, routes, and flows (e.g. of commodities, people, or information)  
	* historical periods
* **Topotime.js**, a JavaScript library for rendering GeoJSON-T data to a web map linked to a traditional timeline and/or _temporal geometry_ visualizations. Its dependencies will include the Leaflet, Simile Timeline, and D3 libraries, as well as...
* **Topotime.py**, a Python program for generating _temporal geometries_ from GeoJSON&#8209;T data

All of these are under active development, so the contents of this repo are dynamic "works-in-progress." Comments, suggestions, and reasonably polite brickbats are welcome.

Documentation will be maintained on the Topotime [project wiki](https://github.com/kgeographer/topotime/wiki)

**Contributors**   
Karl Grossner (*kgeographer*; twitter:@kgeographer); Merrick Lex Berman (*vajlex*); Rainer Simon (*rsimon*); Elijah Meeks (v0.1; *emeeks*)
