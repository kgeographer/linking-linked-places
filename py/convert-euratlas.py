# convert time-indexed admin boundary MultiPolygon shapefiles
import json, os, re, codecs
# set wd in a local_settings.py file
wd = os.getcwd()
from settings import *
os.chdir(wd)
import ttutil_euratlas
from ttutil_euratlas import Feature, FeatureCollection, Geometry #, \
      #findCountry, makeShape, parseWhen
from shapely.geometry import  \
     mapping, shape, MultiPolygon, Polygon
from shapely.ops import unary_union
# MultiPolygon shapefiles
files = ['euro_poland']
src = 'Euratlas' # TODO copyright

def parseWhen(year):   
   ts = {}
   pstart = '0'+str(year-50) if len(str(year)) == 3 else str(year-50)
   pend = '0'+str(year+50) if len(str(year)) == 3 else str(year+50)
   s = {"earliest":pstart+'-01-01'}
   e = {"latest":pend+'-12-31'}   
   ts['start'] = s
   ts['end'] = e
   ts['label'] = 'in '+str(year)
   print(ts)
   return ts

for x in range(len(files)):
   pcoll = files[x]
   fn='../data/source/euratlas/'+files[x]+'.geojson'
   #fn=base_dir+'data/in/euratlas/'+files[x]+'.geojson'
   #w1 = codecs.open(base_dir+'data/out/'+ \
   w1 = codecs.open('../data/out/'+ \
                    pcoll+'.tt.json','w','utf-8')

   with codecs.open(fn,mode='r',encoding='utf8') as f:
      data = json.load(f)['features']
      
   # have features now
   c = FeatureCollection(pcoll)

   for y in range(len(data)): # len(data)
      eprops = data[y]['properties']
      egeom = data[y]['geometry']
      # when object
      timespan = parseWhen(eprops['year'])
      f = Feature(eprops['long_name']) # the Euratlas label
      f.geometry['geometries'][0] = egeom
      f.geometry['geometries'][0]['when'] = ({"timespans":[timespan]})
      # transfer all properties verbatim
      f.geometry['geometries'][0]['properties'] = eprops
      # print(multi) 
      # merged = unary_union(multi)
      #f.geometry['geometries'][0]['coordinates'] = \
         #egeom['coordinates']
      #f.geometry['geometries'][0]['type'] = \
         #egeom['type']
      c.features.append(f); print(str(len(c.features))+' features added')

   w1.write(c.to_JSON())
   w1.close()
