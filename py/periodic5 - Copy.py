import os, re, math, codecs
from matplotlib import pyplot
from shapely.geometry import MultiPolygon
from descartes.patch import PolygonPatch

#os.chdir('z:/karlg on my mac/box documents/Repos/topotime/pylab') # macbook
os.chdir('g:/mydocs/my box files/Repos/topotime/pylab')
import helper5
from helper5 import parseDate, toJul;
import simplejson as json
# x=1; y=0; i=0; 
atom="date";
wd='g:/mydocs/my box files/Repos/topotime/'
#wd='z:/karlg on my mac/box documents/Repos/topotime/'
fn="data/example_collection5.json"
#fn="../topotime_format.json"
#fn="data/pleiades_periods98.json"
#fn="data/pleiades_periods_fuzz98.json"
file = codecs.open(wd+fn,"r", "utf-8"); 
coll=file.read(); file.close();
#fnw="data/pleiades_periods_geom_fuzz.json"
#fnw="data/pleiades_periods_geom.json"
fnw="data/example_out.json"
file_w = codecs.open(wd+fnw,"w", "utf-8"); 

global newSpans, newCollection;
newCollection = json.loads(coll)

periods = newCollection['periods']; print periods;
atom = newCollection['projection']['atom']

pds=periods; x=0; y=0; z=0

if (atom == 'date'):
   newCollection['periods']=parseDate(periods)
   json.dump(newCollection,file_w,indent=3, sort_keys=True)
   file_w.close()
else:
   print 'atom is not date; that\'s all we can parse now'

#for x in xrange(len(newCollection['periods'])):
collectionGeometry = []
for per in newCollection['periods']:
   geomArray = []
   # geomArray.append('"id": '+per['id'])
   for i in range(len(per['geom'])):
      geomArray.append(per['geom'][i])
   collectionGeometry.append(geomArray)
#print collectionGeometry
