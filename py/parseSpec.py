import os, re, math, codecs, helper6
from helper6 import parseDate, toJul, getIdx;
import simplejson as json
def init(data):
   # data = 'ttspec' # pleiades_fuzz98 Dance ttspec ww2
   loc = 'home' # home laptop work
   print 'called init()'
   global coll, collection, inPeriods, atom, pds
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
   collection = json.loads(coll)	# load
   inPeriods = collection['periods']; pds=inPeriods

init('ttspec');
tsOperatorHash = { "<": {"subspan": "s", "uncertaintyPoint": {"s": -1,"e": .001}}, ">": {"subspan": "e", "uncertaintyPoint": {"s": .001, "e": 1}}, "~": {"uncertaintyPoint": {"s": -0.5, "e": -0.5}}};

newPeriods = []; 
for p in xrange(len(inPeriods)):
   newPeriod = {}; geom = []; newTspans = []; 
   newPeriods.append(newPeriod)
   pid = pds[p]['id']; plabel = pds[p]['label']; 
   newPeriods[p]['id']=pid; newPeriods[p]['label']=plabel
   newPeriods[p]['geom']=geom; newPeriods[p]['tSpans']=newTspans;
   #for t in xrange(len(pds[p]['tSpans'])):
   for t in xrange(len(pds[p]['tSpans'])):
      oldspan = pds[p]['tSpans'][t]
      print pid, oldspan
      #transformTspan(t) #['tSpans']

#def transformTspan(oldspan):   
      newspan = {};  
      if 's' in oldspan.keys():
         # print 'pid: '+str(pid), str(oldspan)
         if not re.match(r'([<>~])',oldspan['s']):
            newspan['s']=toJul(oldspan['s'],'sDate','s')
            print 'pid: '+ str(pid), oldspan['s'] + ' --> ' +str(newspan['s'])
         else:
            print 'pid: '+ str(pid), oldspan['s']
            ref=re.match(r'([<>~])(\d{1,3})\.?([sle]{0,2})',oldspan['s'])
            operator=ref.group(1); target=ref.group(2); spanpart=ref.group(3)
            if not spanpart:
               specificTspan = tsOperatorHash[operator]['subspan'] if tsOperatorHash[operator]['subspan'] else "s";
               #print specificTSpan
               newspan['s'] = pds[getIdx(target)]['tSpans'][0][spanpart] \
                  if spanpart else \
                  pds[getIdx(target)]['tSpans'][0][specificTspan]
         transformTspan(int(target))
      else: # no s
         print 'span without a start? estimate?'
         