# verify, read and interpret a topotime data file
import json, os, re, codecs
from collections import Counter
from settings import *
os.chdir(wd)
#import ttutil_periodo
#from ttutil_periodo import Feature, FeatureCollection, Geometry #, \
     #findCountry, makeShape, parseWhen
from shapely.geometry import  \
     mapping, shape, MultiPolygon, Polygon
#from shapely.ops import unary_union
# PeriodO collections
files = ['itinerary', 'multi-type','periodo_p0zmdxz','periodo_p0tns5v','periodo_p0vhct4', \
         'periodo_p0dntkb','euro_poland']

def all_same(items):
   return all(x == items[1] for x in items)

#/ TODO: validate w/topotimelint (fork geojsonlint)

#/ open a results file
#/ w1 = codecs.open(basedir+'data/out/tt-periodo_'+pcoll+'.json','w','utf-8')

#/ load a file
fn = base_dir+'data/out/'+files[6]+'.tt.json'

with open(fn) as fc:
   geomArray = []
   features = json.load(fc)['features']
   for f in features:
      geomType = f['geometry']['type']
      geomArray.append(f['geometry']['type'])
      if geomType != 'GeometryCollection':
         # it's a single geom w >=1 when
         timespans = f['when']['timespans']
         print(f['properties']['id'], timespans)
      else: # it's a GeometryCollection
         for g in f['geometry']['geometries']:
            geomArray.append(g['type'])
            timespans = g['when']['timespans']
            print(g['properties']['id'], \
                  timespans)
   elements = Counter(geomArray)
   print('\n***\nCollection summary: ')
   for e in elements.keys(): 
      print('%s : %d' % (e, elements[e]))

   
## what kinds of geometries?
#for y in range(len(data)):
   #print(files[x] + ': ' + data[y]['geometry']['type'])
   
## new empty FeatureCollection
#fc = FeatureCollection(pcoll)
#allCoverages = []
#counter = 0
## add Feature for each distinct geometry in data 
#for key,val in data.items():
   #counter += 1
   ## set of 1 or more countries
   #sc = data[key]['spatialCoverage']
   ## isolate & store labels to find distinct
   #geo = []
   #for y in range(len(sc)):
      #geo.append(sc[y]['label'])
   #if sorted(geo) in allCoverages:
      #print('found '+str(sorted(geo)) +' from def. '+str(key)+ \
            #', find Feature and add when')
      #f = findFeature(fc,sorted(geo))
      #f.when['timespans'].append(parseWhen(pstart, pstop, \
            #data[key]['originalLabel']))
   #else:
      #allCoverages.append(sorted(geo))
      #try:
         #sd = data[key]['spatialCoverageDescription']
      #except:
         #sd = "none"
      ## print('new coverage for '+sd+', create Feature from ' + str(sc))
      #f = Feature(data[key]['id'], data[key]['originalLabel'], "Feature")
      #f.geometry['properties']['countries'] = sorted(geo)
      #f.geometry['properties']['spatialCoverage'] = sc
      #f.geometry['properties']['spatialCoverageDescription'] = sd
      #f.geometry['coordinates'] = (buildGeometry(sc))
      ## get full periodo temporal objects
      #pstart = data[key]['start']
      #pstop = data[key]['stop'] 
      #f.when['timespans'].append(parseWhen(pstart,pstop,data[key]['originalLabel']))
      ## add complete feature
      #fc.features.append(f); print(str(len(fc.features))+' features added')
         
   #w1.write(fc.to_JSON())
   #w1.close()         
   #print(str(counter) + ' definitions')
   #print(str(len(allCoverages)) + ' features made')


   
   #def makeShape(code): #takes a 2-letter code
      #geom = findCountry(code)
      #if geom['type'] == 'Polygon':
         #p=Polygon(shape(geom))
      #elif geom['type'] == 'MultiPolygon':
         #p=MultiPolygon(shape(geom))
      #return p
   
   #def parseWhen(start,stop,label):
      #ts = {}
      #ts['start'] = start
      #ts['end'] = stop
      #ts['label'] = label
      ##print(ts)
      #return ts
   
   #def buildGeometry(coverages):
      #multi = []
      #for cov in coverages:
         #multi.append(makeShape( cov['iso3166'] ))
      #merged = unary_union(multi)
      #return mapping(merged)['coordinates']
   
   #def findFeature(obj,attrib):
      #for x in obj.features:
         #if x.geometry['properties']['countries'] == attrib:
            #print('got it')
            #return x
      #else:
         #print('nope')
         #x = None
