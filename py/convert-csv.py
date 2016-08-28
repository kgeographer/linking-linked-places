# convert node and edge .csv files to GeoJSON-T

import json, os, re, codecs
#os.chdir(os.getcwd()+'/py')
os.chdir(os.getcwd())
# set wd in a local_settings.py file
from settings import *
import ttutil_csv
from ttutil_csv import nodeFeature, edgeFeature, FeatureCollection, GeometryCollection, Geometry, parseWhen #, \
#base_dir = os.getcwd()

project = 'incanto'
output_type = 'GeometryCollection' # BagOfFeatures or GeometryCollection
data_type = 'journeys' 

file_n = '../data/source/'+project+'/sites.csv' # nodes/places
file_e = '../data/source/'+project+'/segments.csv' # edges/paths
nodes = codecs.open(file_n,mode='r',encoding='utf8').readlines()[1:]
edges = codecs.open(file_e,mode='r',encoding='utf8').readlines()[1:]

#w1 = codecs.open('../data/'+output_type+'/'+project+'-journeys.json','w','utf-8')
w1 = codecs.open('../data/'+output_type+'/'+project+'-journeys50.json','w','utf-8')

# new empty collection: id, label, provenance, date
c = FeatureCollection('OI_001',"Incanto trade journeys", "M. Fournier", 2014 ) 
print(c.to_JSON())

# create node/place features
for x in range(0,50): 
#for x in range(len(nodes)):
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

# create edge/path features   
for x in range(0,50): 
#for x in range(len(edges)):
   trajid = -1
   edge = edges[x].split('|') # make array
   if(edge[0] != trajid):
      trajid = edge[0]
      # journey_id|year|source|target|ships|days|seq|geom
      
      # new empty typed trajectory feature   
      feat = edgeFeature(edge[0],'journey')
      feat.geometry = GeometryCollection()
   
   feat.properties['id'] = trajid
   geomarray = feat.geometry.geometries
   geomarray.append(json.loads(edge[7])) 
   
   for y in range(len(geomarray)):
      geomarray[y]['properties'] = {"source":edge[2], "target":edge[3], "ships":edge[4], "days":edge[5], "sequence":edge[6]}

   feat.when['timespans'].append(parseWhen(edge[1]))
   
   c.features.append(feat) 
print(c.to_JSON())

w1.write(c.to_JSON())
w1.close()
