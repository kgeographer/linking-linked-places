# csvToGeoJSON-T.py
# read places and segments csv, output GeoJSON-T for routes
# 2016-10-23 k. grossner; modeled on code by r. simon

import os, sys, csv, json, codecs
# TODO should we de-duplicate?

def init():
    global proj, reader_p, reader_s, fout, features
    # courier, incanto-j, incanto-f, vicarello, xuanzang, roundabout
    proj = 'roundabout'
    data = 'roundabout'
    
    finp = codecs.open('data/source/'+proj+'/places_'+proj+'.csv', 'r', 'utf8')
    fins = codecs.open('data/source/'+proj+'/segments_'+data+'.csv', 'r', 'utf8')
    fout = codecs.open('data/out/'+data+'.geojson', 'w', 'utf8')
    fout.write('{"type":"FeatureCollection", "features":')
    
    reader_p = csv.DictReader(finp, delimiter=';')
    #reader_p = csv.DictReader(filter(lambda row: row[0]!='#', finp), delimiter=';')
    reader_s = csv.DictReader(filter(lambda row: row[0]!='#', fins), delimiter=';')
    
    features = []

    if not reader_p.fieldnames[:7] == ['collection', 'place_id', 'toponym', 'gazetteer_uri', 'gazetteer_label', 'lng', 'lat']:
        sys.exit('core field names incorrect: ' + str(reader_p.fieldnames))
    
    print('Project: ' + proj)
    #print(str(len(list(reader_p)) - 1) + ' places; ' + str(len(list(reader_s)) - 1) + ' segments')
    

def createPlaces():
    
    places = []

    def toPoint(row):
        return {
            'type': 'Point',
            'coordinates': [ float(row['lng']), float(row['lat']) ]
        }

    for idx, row in enumerate(reader_p):
    #for idx, row in reader_p:
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
        # add remaining non-core properties
        props = reader_p.fieldnames[7:]
        
        for x in range(len(props)):
            feat['properties'][props[x]] = row[props[x]]
            
        places.append(feat)
    
    fout.write(json.dumps(places,indent=2))
    fout.write('}')
    fout.close()

init()
createPlaces()


    #print(json.dumps(places))
        #if row['lat'] and row['lng']:    
            #print(row['toponym'] + '|' + \
                #row['gazetteer_label'] + '|' + \
                #row['gazetteer_uri'] )    

    #for row in rows_p[1:]:
        #feat = {"type":"Feature","geometry":{"type":"GeometryCollection"}}
        #feat["label"] = row[2]

    #for idx, row in enumerate(reader):
        #if row['lat'] and row['lng']:
            #fout.write(str(idx) + '|' + \
                       #row['toponym'] + '|' + \
                       #row['gazetteer_label'] + '|' + \
                       #row['gazetteer_uri'] + '|' +
                       #toPoint(row) + '|\n')
        #fin.close()
        #fout.close()
        
    #return places;


def createSegments():

    segments = []
    
    # use if generating segments from places only
    #def toLine(fromRow, toRow):
        #return {
            #'type': 'MultiLineString',
            #'coordinates': [[ [ float(fromRow[4]), float(fromRow[3]) ], [ float(toRow[4]), float(toRow[3]) ] ]]
        #}

    for i in range(2, len(rows)):
        fromRow = rows[i - 1]
        toRow = rows[i]
        line = toLine(fromRow, toRow)

        segments.append({
            'type': 'Feature',
            'geometry': line,
        })
        fout.write(str(i) + '|' + fromRow[1] + '|' + toRow[1] + '|' + json.dumps(line) + '|\n')

        fin.close()
        fout.close()

    return segments;

init()

print(json.dumps({
    'type': 'FeatureCollection',
    'id': proj,
    'label': collection_label,
    'provenance': provenance,
    'pub_date': pub_date,
    'when': collection_when,
    'features': createPlaces() + createSegments()
}))
