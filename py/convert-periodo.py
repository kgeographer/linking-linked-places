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
# files = ['p0vhct4']
src = 'http://n2t.net/ark:/99152/' # periodo URI prefix

# load countries to grab country geom by 2-letter code
countries = json.loads(codecs.open(base_dir+'geo/world_slimmed.json','r','utf8').read())['features']

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

# is temporal expression single year?
def existsYear(y):
   if y['in'].get('year') is not None:
      return True
   else:
      return False

# does temporal expression have label?
def existsLabel(l):
   if l.get('label') is not None:
      return True
   else:
      return False
   
def parseWhen(start,end,label):   
   ts = {}
   
   # build start expression
   s = {"earliest":start['in']['earliestYear'], \
           "latest": start['in']['latestYear']} \
      if not existsYear(pstart) \
         else {"earliest":start['in']['year']}
   if existsLabel(start): s['label'] = start['label']
   
   # build end expression
   e = {"earliest":end['in']['earliestYear'],
           "latest":end['in']['latestYear']}  if not existsYear(pstop) \
         else {"latest":end['in']['year']}
   if existsLabel(end): e['label'] = end['label']
   
   ts['start'] = s
   ts['end'] = e
   ts['label'] = label
   ts['type'] = 'throughout'
   # print(ts)
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

   
# write Topotime for each file
for x in range(len(files)):
   pcoll = files[x]
   fn=base_dir+'data/in/periodo/'+files[x]+'.jsonld'
   w1 = codecs.open(base_dir+'data/out/periodo_'+pcoll+'.tt.json','w','utf-8')
   
   with open(fn) as f:
      data = json.load(f)['definitions']
   # new empty FeatureCollection
   fc = FeatureCollection(pcoll)
   allCoverages = []
   counter = 0
   # add Feature for each distinct geometry in data 
   for key,val in data.items():
      # keys: p0vhct4j2w4 (early/late); p0vhct49h3g (year)
      counter += 1
      # set of 1 or more countries
      sc = data[key]['spatialCoverage']
      # isolate & store labels to find distinct
      geo = []
      for y in range(len(sc)):
         geo.append(sc[y]['iso3166'])
      # only write distinct geometry once
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
