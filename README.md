[![Stories in Ready](https://badge.waffle.io/kgeographer/topotime.png?label=ready&title=Ready)](https://waffle.io/kgeographer/topotime)
[![Stories in Progress](https://badge.waffle.io/kgeographer/topotime.png?label=In%20Progress&title=In%20Progress)](https://waffle.io/kgeographer/topotime)
Topotime
==========================

**topo** (_from Greek τοπο-, a combining form of **τόπος** place_)

**Topotime** is a digital humanities project aiming to join Place and Period (space and time) in conceptual models, data formats, and software for geo-historical research. We are developing an experimental extension to the [GeoJSON data format standard](http://geojson.org/geojson-spec.html), and open-source software to utilize it.

The project's planned work products include:

* [**GeoJSON-T**](https://github.com/kgeographer/topotime/wiki/GeoJSON%E2%80%90T), adding temporal ("when") elements to GeoJSON, making it suitable for representing
	* attestations of historical geographic movement, such as journeys, routes, and flows (e.g. of commodities, people, or information)  
	* historical gazetteer records
	* historical periods
* **Linked Places**, a web application with a web map linked to a traditional timeline and/or _temporal geometry_ visualizations
* **topotime.js**, a JavaScript library for rendering GeoJSON&#8209;T data in web apps such as Linked Places. Its dependencies at the moment include the Leaflet, Simile Timeline, and D3 libraries, as well as [...TBD]
* **topotime.py**, a Python package that reads GeoJSON&#8209;T data and can (a) generate and analyze _temporal geometries_; (b) perform basic network measures

All of these are under active development or in a design phase, so the contents of this repo are dynamic "works-in-progress." Comments, suggestions, and reasonably polite brickbats are welcome.

Documentation will be maintained on the Topotime [project wiki](https://github.com/kgeographer/topotime/wiki)

**Contributors**   
Karl Grossner (*kgeographer*; twitter:@kgeographer); Merrick Lex Berman (*vajlex*); Rainer Simon (*rsimon*); Elijah Meeks (v0.1; *emeeks*)
