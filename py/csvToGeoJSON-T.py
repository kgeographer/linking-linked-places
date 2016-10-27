# csvToGeoJSON-T.py
# read places and segments csv, output GeoJSON-T for routes
# 2016-10-26 k. grossner

import os, sys, csv, json, codecs, re
# TODO should we de-duplicate?
# TODO options: separate files for QGIS work; generate edges (here or in js?)

def init():
    dir = os.getcwd() + '/data/'
    global proj, reader_p, reader_s, finp, fins, fout, collection, routeidx
    # courier, incanto-j, incanto-f, vicarello, xuanzang, roundabout
    proj = 'incanto'
    data = 'incanto-j'
    
    finp = codecs.open('../data/source/'+proj+'/places_'+proj+'.csv', 'r', 'utf8')
    fins = codecs.open('../data/source/'+proj+'/segments_'+data+'.csv', 'r', 'utf8')
    fout = codecs.open('../data/out/'+data+'.geojson', 'w', 'utf8')
    #finp = codecs.open(dir+'source/'+proj+'/places_'+proj+'.csv', 'r', 'utf8')
    #fins = codecs.open(dir+'source/'+proj+'/segments_'+data+'.csv', 'r', 'utf8')
    #fout = codecs.open(dir+'out/'+data+'.geojson', 'w', 'utf8')
    
    #fouta = codecs.open(dir+'out/'+data+'.geojson', 'a', 'utf8')
    
    # TODO: option for separate places and segments files (xuanzang is example)
    #foutp = codecs.open('../data/out/'+data+'_places.geojson', 'w', 'utf8')
    #fouts = codecs.open('../data/out/'+data+'_segments.geojson', 'w', 'utf8')
    
    #reader_p = csv.DictReader(finp, delimiter=';')
    reader_p = csv.DictReader(filter(lambda row: row[0]!='#', finp), delimiter=';')
    #reader_s = csv.DictReader(fins, delimiter=';')
    reader_s = csv.DictReader(filter(lambda row: row[0]!='#', fins), delimiter=';')
    
    # get FeatureCollection properties from segments file header
    # NOTE: GeoJSON specs disallow 'properties' members outside of Features
    # but allow 'foreign members' anywhere, so call them 'attributes'
    reader_prop = csv.reader(filter(lambda row: row[0]=='#', fins), delimiter=';')
    collection = {
        "type":"FeatureCollection",
        "attributes": {},
        "features": []
        }
    #fins.seek(0)
    for row in reader_prop:
        field = re.match(r'#(.*?):(.*)', row[0]).group(1).lstrip()
        value = re.match(r'#(.*?):(.*)', row[0]).group(2).lstrip()
        collection['attributes'][field] = value
        # TODO: parse timespan into a when object
    
    #features = []

    if not reader_p.fieldnames[:7] == ['collection', 'place_id', 'toponym', 'gazetteer_uri', 'gazetteer_label', 'lng', 'lat']:
        sys.exit('core field names incorrect: ' + str(reader_p.fieldnames))
    
    #fins.seek(0)
    print('Project: ' + proj)
    #print(str(len(list(reader_p)) - 1) + ' places; ' + str(len(list(reader_s)) - 1) + ' segments')
    

def createPlaces():
    
    places = []

    def toPoint(row):
        return {
            'type': 'Point',
            'coordinates': [ float(row['lng']), float(row['lat']) ]
            #'coordinates': [ row['lng'], row['lat'] ]
        }

    for idx, row in enumerate(reader_p):
        feat = {"type":"Feature", \
                "id": row['place_id'], \
                "label": row['toponym'], \
                "geometry":toPoint(row), \
                "properties": { \
                    "collection": row['collection'], \
                    "gazetteer_uri": row['gazetteer_uri'], \
                    "gazetteer_label": row['gazetteer_label']
                }
                }
        
        # remaining segment properties (columns after 8th)
        props = reader_p.fieldnames[7:]
        
        for x in range(len(props)):
            feat['properties'][props[x]] = row[props[x]]
            
        #places.append(feat)
        collection['features'].append(feat)
    
    #fout.write(json.dumps(places,indent=2))
    #fout.write('}')
    #fout.close()

def createSegments():  
    
    def toGeometry(row):
        # 
        if row['geometry'][0] == '{':
            g = json.loads(row['geometry'])
        else:
            g = { 
            "type":"LineString",
            "coordinates": json.loads(row['geometry'])
            }
        g['when'] = row['timespan']
        g['properties'] = {
            "segment_id": (row['segment_id'] if 'segment_id' in reader_s.fieldnames else '') ,
            "label": row['label'],
            "source": row['source'],
            "target": row['target']   
        }
        
        # remaining segment properties (columns after 8th)
        props = reader_s.fieldnames[9:]
        
        for x in range(len(props)):
            g['properties'][props[x]] = row[props[x]]        
        
        return g


    segments = []
    fins.seek(0) # resets segments reader
    counter = 0
    routeidx = 0 
    
    for idx, row in enumerate(reader_s):
        print('route_id is ' + row['route_id'])
        if row['route_id'] != routeidx: 
            # first row for a route
            feat = {"type":"Feature",            
                    "geometry": {"type":"GeometryCollection",
                                 "geometries": [toGeometry(row)]
                                 },
                    "when": {},
                    "properties": {
                        "collection": row['collection'],
                        "route_id": row['route_id']
                    }
                    }            
            routeidx = row['route_id']
            collection['features'].append(feat)
            counter += 1
            print('new feature: ',counter)
        else:
            # add geometry + properties for each segment within a route
            feat['geometry']['geometries'].append(toGeometry(row))
            counter += 1
            print('new geometry ', counter)

        print(counter)
    
    fout.write(json.dumps(collection,indent=2))
    fout.close()
        
init()
createPlaces()
createSegments()

        

        # add remaining non-core properties
        #props = reader_p.fieldnames[7:]
        
        #for x in range(len(props)):
            #feat['properties'][props[x]] = row[props[x]]
            
        #places.append(feat)


# use if generating segments from places only
#def toLine(fromRow, toRow):
    #return {
        #'type': 'MultiLineString',
        #'coordinates': [[ [ float(fromRow[4]), float(fromRow[3]) ], [ float(toRow[4]), float(toRow[3]) ] ]]
    #}

#print(json.dumps({
    #'type': 'FeatureCollection',
    #'id': proj,
    #'label': collection_label,
    #'provenance': provenance,
    #'pub_date': pub_date,
    #'when': collection_when,
    #'features': createPlaces() + createSegments()
#}))
