# rev 1 Nov 2013 kg
# 
data = 'ww2' # pleiades_fuzz98 Dance ttspec ww2
loc = 'laptop' # home laptop work

import os, re, math, codecs
from matplotlib import pyplot
from shapely.geometry import MultiPolygon
from descartes.patch import PolygonPatch
import helper6
from helper6 import parseDate, toJul;
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
fnw1='data/out/'+data+'_collection.json' # collection with julian dates, geometry
w1 = codecs.open(wd+fnw1,"w", "utf-8"); 

newCollection = json.loads(coll)	# load
periods = newCollection['periods']	# copy
atom = newCollection['projection']['atom']

#pds=periods; x=0; y=0; z=0

if (atom == 'date'):
   newCollection['periods']=makeNew(periods)
   json.dump(newCollection,file_w,indent=3, sort_keys=True)
   file_w.close()
else:
   print 'atom is not date; that\'s all we can parse now'

# for pyplot, d3
fnw2='data/out/'+data+'_geom_raw.json' # a raw geometries object for pyplot
w2 = codecs.open(wd+fnw2,"w", "utf-8");
fnw3='data/out/'+data+'_geom_d3.json' # a labeled geometries object for d3
w3 = codecs.open(wd+fnw3,"w", "utf-8");

# have newCollection, add geometry array
collGeomRaw = []; collGeomObj = []
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
   collGeomRaw.append(geomArrayRaw)
   collGeomObj.append(geomObj)
w2.write(json.dumps(collGeomRaw))
w2.close()
#w3.write('ttPolys = ')
w3.write(json.dumps(sorted(collGeomObj,key=lambda k: k['points'][0]['x'])))
w3.close()