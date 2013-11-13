# rev 29 Oct 2013 kg
# 
data = 'pleiades_fuzz98' # pleiades_fuzz98 Dance ttspec ww2
loc = 'laptop' # home laptop work

import os, re, math, codecs
from matplotlib import pyplot
from shapely.geometry import Polygon, MultiPolygon
from descartes.patch import PolygonPatch
import helper5
from helper5 import parseDate, toJul;
import simplejson as json

path2='Repos/topotime/'
if loc == 'laptop': 
   path1 = 'z:/karlg on my mac/box documents/'
elif loc == 'work':
   path1 = 'c:/mydocs/my box files/'
elif loc == 'home':
   path1 = 'g:/mydocs/my box files/'
wd = path1+path2
os.chdir(path1+path2)

atom="date";
fn=wd + 'data/' + data + '.json'

file = codecs.open(fn,"r", "utf-8"); 
coll=file.read(); file.close();
#fnw="data/pleiades_periods_geom_fuzz.json"
#fnw="data/pleiades_periods_geom.json"
fnw1='../ttout/'+data+'_collection.json' # collection with julian dates, geometry
w1 = codecs.open(wd+fnw1,"w", "utf-8"); 

global newSpans, newCollection;
newCollection = json.loads(coll)

periods = newCollection['periods']; print periods;
atom = newCollection['projection']['atom']

pds=periods; x=0; y=0; z=0 # testing values

if (atom == 'date'):
   newCollection['periods']=parseDate(periods)
   json.dump(newCollection,w1,indent=2, sort_keys=True)
   w1.close()
else:
   print 'atom is not date; that\'s all we can parse now'

# for pyplot, d3
fnw2='../ttout/'+data+'_geom_raw.json' # a raw geometries object for pyplot
w2 = codecs.open(wd+fnw2,"w", "utf-8");
fnw3='../ttout/'+data+'_geom_d3.json' # a labeled geometries object for d3
w3 = codecs.open(wd+fnw3,"w", "utf-8");

collGeomRaw = []; collGeomObj = []
for per in newCollection['periods']:
   geomArrayRaw = []; geomObj = {}; pointsArray = []
   for i in range(len(per['geom'])):
      pointPair={}
      pointPair['x']=per['geom'][i][0]
      pointPair['y']=per['geom'][i][1]
      pointsArray.append(pointPair)
      geomArrayRaw.append(per['geom'][i])
   geomObj['points'] = pointsArray
   geomObj['label'] = per['label']
   geomObj['id'] = per['id']
   collGeomRaw.append(geomArrayRaw)
   collGeomObj.append(geomObj)
w2.write(json.dumps(collGeomRaw))
w2.close()
#w3.write('ttPolys = ')
w3.write(json.dumps(sorted(collGeomObj,key=lambda k: k['points'][0]['x'])))
w3.close()

# make shapely multipolygon
allArray = []
for x in xrange(len(collGeomRaw)):
   allArray.append([collGeomRaw[x],[]])
multi1 = MultiPolygon(allArray)

qpoly=Polygon(collGeomRaw[45])

def qtt(coll,q):
   areaColl = coll.area
   areaQ = q.area
   print 'that period is: ~'+str("%.2f" % (areaQ/areaColl*100))+'% of the collection'
   
for span in multi1:
   if span.intersection(qpoly):
      print span.intersection(qpoly)
      
for span in multi1:
   #print span.distance(qpoly)
   print qpoly.distance(span.centroid)