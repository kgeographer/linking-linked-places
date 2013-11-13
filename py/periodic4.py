import os, re, math, codecs
# os.chdir('z:/Documents/Repos/topotime/pylab') # macbook
os.chdir('g:/mydocs/My Box Files/Repos/topotime/pylab')
from helper3 import parseDate, toJul;
import simplejson as json
# x=1; y=0; i=0; 
atom="date";
#wd='z:/Documents/Repos/topotime/'
#fn="../data/example_collection.json"
fn="../topotime_format.json"
file = codecs.open(fn,"r", "utf-8"); 
coll=file.read(); file.close();
global newSpans, newCollection;
newCollection = json.loads(coll)

periods = newCollection['periods']; print periods;
atom = newCollection['projection']['atom']

if (atom == 'date'):
   newCollection['periods']=parseDate(periods)
else:
   print 'you gave me a year atom and I can\'t parse it yet'