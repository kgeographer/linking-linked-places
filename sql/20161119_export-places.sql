-- incanto json
select row_to_json(t) 
	from ( select 1 as set, id+60000 as id,label as toponym,names as altnames from incanto.i_sites) t

-- courier csv
collection;place_id;toponym;gazetteer_uri;gazetteer_label;lng;lat;status;source;comment
select 'courier' as collection, yz_id as place_id, 
'http://maps.cga.harvard.edu/tgaz/placename/hvd_'||chgis_id as gazetteer_uri,
yz_label as gazetteer_label,
yz_long as lng, yz_lat as lat,
status,src as source, note as comment from courier_places

