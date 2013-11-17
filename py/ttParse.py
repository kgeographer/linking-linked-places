# rev 2 Nov 2013 kg
data = 'ttspec' # pleiades_fuzz98 Dance topotime_format  ttspec ww2
loc = 'home' # home laptop work

import os, re, math, codecs
from matplotlib import pyplot
from shapely.geometry import MultiPolygon
from descartes.patch import PolygonPatch
import helper6
from helper6 import parseDate, toJul, withinSpan
import simplejson as json

def init():
   global atom, collection, periods, pds, newCollection
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
   fnw1='../ttout/'+data+'_collection.json' # collection with julian dates, geometry
   w1 = codecs.open(wd+fnw1,"w", "utf-8"); 

   collection = json.loads(coll)	# load
   periods = collection['periods']	# isolate periods
   pds = periods # copy for debugging
   newCollection = collection # clone, replace periods[] later
   atom = newCollection['projection']['atom']

init()
p=0; t=0; z=0

foo=sorted(periodHash.items(), key=lambda x:int(x[1]['id']))
for k,v in foo: print v['id'],v['tSpansP']

if (atom == 'date'):
   # make projected periods and add to new collection
   newCollection['periods']=makeNew.parse(periods)
   json.dump(newCollection,file_w,indent=3, sort_keys=True)
   file_w.close()
else:
   print 'atom is not date; that\'s all we can parse now'

# for pyplot, d3
# make geometry files from newCollection['periods'] 
fnw2='../ttout/'+data+'_geom_raw.json' # a raw geometries object for pyplot
w2 = codecs.open(wd+fnw2,"w", "utf-8");
fnw3='../ttout/'+data+'_geom_d3.json' # a labeled geometries object for d3
w3 = codecs.open(wd+fnw3,"w", "utf-8");

periodsGeomRaw = []; periodsGeomObj = []
for per in newCollection['periods']:
   geomArrayRaw = []; geomObj = {}; pointsArray = []
   for i in range(len(per['geom'])):
      pointPair={}
      pointPair['x']=per['geom'][i][0]
      pointPair['y']=per['geom'][i][1]
      pointsArray.append(pointPair)
   geomObj['points'] = pointsArray
   geomObj['label'] = per['label']
   geomObj['id'] = per['id']
   periodsGeomRaw.append(geomArrayRaw)
   periodsGeomObj.append(geomObj)
w2.write(json.dumps(collGeomRaw))
w2.close()
w3.write(json.dumps(sorted(periodsGeomObj,key=lambda k: k['points'][0]['x'])))
w3.close()