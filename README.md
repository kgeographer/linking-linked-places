Topotime (v0.2 tt-geojson)
==========================

[__DRAFT__]

Topotime is a data model, pragmatic JSON data format, D3 timeline layout, and functions for representing and computing over complex spatial-temporal phenomena, particularly for historical applications. Whereas Topotime v0.1 was focused on time, Topotime v0.2 models the spatial and temporal attributes of geographic features co-equally, and adopts the basic form of GeoJSON and GeoJSON-LD. It is under active development, and forks, comments, suggestions, and reasonably polite brickbats are welcome.

##Compatibility
The interpretation of data in Topotime format in order to render maps and timelines, and to compute over temporal expressions, will require software written specifically for that purpose. Topotime v0.1 has some D3 Javascript code and Python functions to work with the earlier format. Updating those to fit the new model is the work before us. It seems likely a 'lite' form of Topotime that can be read by any GeoJSON parser (ignoring time expressions) will be desirable middle ground.

##Basics
Like GeoJSON and GeoJSON-LD, Topotime represents collections of geographic features in a FeatureCollection. It differs from those formats in a few important respects:

* Features can be either essentially spatial things (Place) or temporal things (Period). We are trying to accommodate the fact that many geographic features are "event-like" (e.g. crimes, tweets, journeys/trajectories) or otherwise inherently temporal (country boundaries, flows of anything over an interval, etc.). In fact **__all__** geographic features have temporal attributes, whether have the data or use them for a particular application or not. Likewise, many temporal things are inherently spatial (historical periods, e.g. Bronze Age Britain); all events occur somewhere. 
* All Features have a set of one or more spatial-temporal Contexts, each consisting of a Geometry, a Timespan, or both.
* Any number of Properties can be associated with a Feature (like GeoJSON) as well as with a Context.

The **Geometry** object in a Topotime **Context** takes the same form as GeoJSON, having a type such as Point, Polyline, or Multipolygon, and a set of sets of coordinate pairs, of any complexity and resolution.

The **When** object in a Topotime **Context** is a set of **Timespan**s, each of which can be singular, multipart, cyclical, or duration-defined. **Timespan**s can be defined in terms of:

* a _start_ (**s**) and a _duration_ (**d**), or 
* a _start_ (**s**), _end_ (**e**), and optional _latest start_ (**ls**) and _earliest end_ (**ee**) expressions
* further articulation start and end ranges by means of any number of intermediary **sls** and **eee** expressions, respectively.

Values for the _start_, _latest-start_, earliest-end, and _end_ expressions can be:

* ISO-8601 (YYYY-MM-DD, YYYY-MM or YYYY), or pointers to other **Feature**s in the **FeatureCollection**
* prefixed by one of 4 operators, **_before_** (**<**), **_after_** (**>**), **_about_** (**~**), and **_equals_** (**=**)

For example:

* **~1635-01** stands for 'around January, 1653 CE'
* **>23.s** stands for 'after the start of Feature 23 in this collection.'

##Relations

Relations between features can be expressed as properties, referencing ontologies such as CIDOC-CRM, or any other  vocabulary. De-referencing and interpretation of such properties will rely on external libraries and software beyond the scope of this work.

#####Contributors
* Karl Grossner (kgeographer; twitter:@kgeographer)
* Elijah Meeks (emeeks; twitter:@Elijah_Meeks)
