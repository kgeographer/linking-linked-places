import json, os, re, codecs
from settings import *
os.chdir(wd)
import ttutil
from ttutil import Feature, FeatureCollection, Geometry #, \
     #findCountry, makeShape, parseWhen
from shapely.geometry import  \
     mapping, shape, MultiPolygon, Polygon
from shapely.ops import unary_union
# PeriodO collections
files = ['p0tns5v','p0dntkb','p0vhct4','p0zmdxz']
# files = ['p0tns5v']
src = 'http://n2t.net/ark:/99152/' # periodo URI prefix

# load countries to grab country geom by 2-letter code
countries = json.loads(codecs.open(basedir+'geo/world_slimmed.json','r','utf8').read())['features']

def findCountry(code):
   for c in countries:
      if c['properties']['ISO_A2'] == code:
         return c['geometry']
      else:
         pass      

def makeShape(code): #takes a 2-letter code
   geom = findCountry(code)
   if geom['type'] == 'Polygon':
      p=Polygon(shape(geom))
   elif geom['type'] == 'MultiPolygon':
      p=MultiPolygon(shape(geom))
   return p

def parseWhen(start,stop):
   ts = {}
   ts['start'] = start
   ts['end'] = stop
   #print(ts)
   return ts

for x in range(len(files)):
   pcoll = files[x]
   fn=basedir+'data/periodo/'+files[x]+'.jsonld'
   w1 = codecs.open(basedir+'data/pyout/tt-periodo_'+pcoll+'.json','w','utf-8')
   
   with open(fn) as f:
      data = json.load(f)['definitions']

   c = FeatureCollection(pcoll)
      
   for key,val in data.items():
      pstart = data[key]['start']
      pstop = data[key]['stop']
      sc = data[key]['spatialCoverage']
      try:
         sd = data[key]['spatialCoverageDescription']
      except:
         sd = "none"
      f = Feature(data[key]['id'], data[key]['originalLabel'], "Feature")
      f.geometry['geometries'][0]['when']['timespans'] \
         .append(parseWhen(pstart,pstop))
      props = f.geometry['geometries'][0]['properties']
      props['spatialCoverageDescription'] = sd
      multi = []
      for s in sc:
         multi.append(makeShape( s['iso3166'] )) 
         props['spatialCoverage'].append(s)
      # print(multi) 
      merged = unary_union(multi)
      f.geometry['geometries'][0]['coordinates'] = \
         mapping(merged)['coordinates']
      c.features.append(f); print(str(len(c.features))+' features added')
      
   w1.write(c.to_JSON())
   w1.close()
