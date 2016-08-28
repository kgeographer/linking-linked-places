# convert node and edge Incanto .csv files to GeoJSON-T

import json, os, re, codecs
#os.chdir(os.getcwd()+'/py')
# set wd in a local_settings.py file
from settings import *
import ttutil_incanto
from ttutil_incanto import nodeFeature, edgeFeature, FeatureCollection, Geometry, parseWhen #, \
 
file_n = base_dir+'data/source/incanto/'+'i_sites.csv' # nodes/places
file_e = base_dir+'data/source/incanto/'+'segments_r.csv' # edges/paths
nodes = codecs.open(file_n,mode='r',encoding='utf8').readlines()[1:]
edges = codecs.open(file_e,mode='r',encoding='utf8').readlines()[1:]

w1 = codecs.open(base_dir+'data/BagOfFeatures/incanto-journeys.tt.json','w','utf-8')

# new empty collection: id, label, provenance, date
c = FeatureCollection('OI_001',"Incanto trade journeys", "M. Fournier", 2014 ) 
#print(c.to_JSON())

# create node/place features
for x in range(len(nodes)): #len(nodes)):
   # new empty labeled feature
   node = nodes[x].split('|') # make array
   feat = nodeFeature(node[2])
   # id|placename|label|plid|gnid|geom|notes
   feat.properties['placename'] = node[1]
   feat.properties['orbis_id'] = node[0]
   if(node[3] != ''):
      feat.properties['pleiades_id'] = node[3]
   if(node[4] != ''):
      feat.properties['geonames_id'] = node[4]
   feat.geometry = json.loads(node[5])
   c.features.append(feat) 
   #print(c.to_JSON())
   
for x in range(len(edges)): #len(nodes)):
   # new empty labeled feature
   edge = edges[x].split('|') # make array
   # journey_id|year|source|target|ships|days|seq|geom
   
   feat = edgeFeature('segment_'+edge[0]+'-'+edge[6])
   feat.geometry = json.loads(edge[7])
   
   feat.properties['source'] = edge[2]
   feat.properties['target'] = edge[3]
   feat.properties['ships'] = edge[4]
   feat.properties['days'] = edge[5]
   feat.properties['sequence'] = edge[6]

   feat.when['timespans'].append(parseWhen(edge[1]))
   
   c.features.append(feat) 
   #print(c.to_JSON())


w1.write(c.to_JSON())
w1.close()
