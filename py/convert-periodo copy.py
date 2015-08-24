import json, os, re, codecs
from settings import *
os.chdir(wd)
import ttutil_periodo
from ttutil_periodo import Feature, FeatureCollection, Geometry #, \
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

def parseWhen(start,end,label):
   ts = {}
   ts['start'] = start
   ts['end'] = end
   ts['label'] = label
   #print(ts)
   return ts

def parseWhen(start,end,label):   
   ts = {}
   pstart = '0'+str(year-50) if len(str(year)) == 3 else str(year-50)
   pend = '0'+str(year+50) if len(str(year)) == 3 else str(year+50)
   s = {"earliest":pstart}
   e = {"latest":pend}   
   ts['start'] = s
   ts['end'] = e
   ts['label'] = label
   print(ts)
   return ts

def buildGeometry(coverages):
   multi = []
   for cov in coverages:
      multi.append(makeShape( cov['iso3166'] ))
   merged = unary_union(multi)
   return mapping(merged)['coordinates']

def findFeature(obj,attrib):
   for x in obj.features:
      if x.geometry['properties']['countries'] == attrib:
         print('got it')
         return x
   else:
      print('nope')
      x = None

   

for x in range(len(files)):
   pcoll = files[x]
   fn=basedir+'data/in/periodo/'+files[x]+'.jsonld'
   w1 = codecs.open(basedir+'data/out/periodo_'+pcoll+'.tt.json','w','utf-8')
   
   with open(fn) as f:
      data = json.load(f)['definitions']
   # new empty FeatureCollection
   fc = FeatureCollection(pcoll)
   allCoverages = []
   counter = 0
   # add Feature for each distinct geometry in data 
   for key,val in data.items():
      counter += 1
      # set of 1 or more countries
      sc = data[key]['spatialCoverage']
      # isolate & store labels to find distinct
      geo = []
      for y in range(len(sc)):
         geo.append(sc[y]['label'])
      if sorted(geo) in allCoverages:
         print('found '+str(sorted(geo)) +' from def. '+str(key)+ \
               ', find Feature and add when')
         f = findFeature(fc,sorted(geo))
         f.when['timespans'].append(parseWhen(pstart, pstop, \
               data[key]['originalLabel']))
      else:
         allCoverages.append(sorted(geo))
         try:
            sd = data[key]['spatialCoverageDescription']
         except:
            sd = "none"
         # print('new coverage for '+sd+', create Feature from ' + str(sc))
         f = Feature(data[key]['id'], data[key]['originalLabel'], "Feature")
         f.geometry['properties']['countries'] = sorted(geo)
         f.geometry['properties']['spatialCoverage'] = sc
         f.geometry['properties']['spatialCoverageDescription'] = sd
         f.geometry['coordinates'] = (buildGeometry(sc))
         # get full periodo temporal objects
         pstart = data[key]['start']
         pstop = data[key]['stop'] 
         f.when['timespans'].append(parseWhen(pstart,pstop,data[key]['originalLabel']))
         # add complete feature
         fc.features.append(f); print(str(len(fc.features))+' features added')
         
   w1.write(fc.to_JSON())
   w1.close()         
   print(str(counter) + ' definitions')
   print(str(len(allCoverages)) + ' features made')
