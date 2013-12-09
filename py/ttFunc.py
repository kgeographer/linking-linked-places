# ttFunc.py 29 Nov 2013
# parses topotime_format, Dance, Pleiades
import os, re, math, codecs
import helper6
from helper6 import toJul, withinSpan
from jdcal import gcal2jd, jd2gcal
import simplejson as json
data = 'topotime_format' # pleiades_fuzz98 Dance topotime_format ttspec ww2
loc = 'home' # home laptop work
uncertaintyValue = 365;  
durationHash = {"d": 1, "h": 1/24, "w": 7, "m": 365.25/12, "y": 365.25};
tsOperatorHash = { "<": {"subspan": "s", "uncertaintyPoint": {"s": -1,"e": .001}}, 
                   ">": {"subspan": "e", "uncertaintyPoint": {"s": .001, "e": 1}}, 
                   "~": {"uncertaintyPoint": {"s": -0.5, "e": -0.5}}};
currentProcessedPeriods = []
periodHash = {}
newPeriods = []
def withinSpan(dval):
   durhash = {"d":1, "w":7, "m":30, "y":365.25}
   try: op=re.search(r'[~]',dval).group()
   except AttributeError: op = ''; 
   try: num=int(re.search(r'\d+',dval).group())
      # print 'num = '+num
   except AttributeError: 
      print 'need number!'
   dwmy=re.search(r'[dwmy]',dval).group()
   # print 'op: '+op+', num: '+str(unidecode(num))+', dmy: '+dmy
   jdays = int(num)*durhash[dwmy]*1.1 if op != '' else int(num)*durhash[dwmy];
   return jdays

def toJul(d,n,m):
   ctr=0;
   #var bef, aft, abt, year, month, date, neg, dur, ref
   bef=re.match(r'^<',d); aft=re.match(r'^>',d); abt=re.match(r'^\~',d)
   neg=re.match(r'^-',d); year=re.match(r'^-?\d{1,7}$',d)
   month=re.match(r'(\d{1,4})-(\d{1,2})$',d); 
   day=re.match(r'^(\d{1,4})-(\d{1,2})-(\d{1,2})',d)
   dur=re.match(r'\d{1,3}(d|m|y)$',d); 
   ref=re.match(r'([<,>,~])?(\d{1,3})\.?(\w{1,2})',d)

   jRange=[]; jDate = '';
   if n == 'span':
      if year:
         if m=='s': jval = gcal2jd(int(year.group()),1,1)[0]+gcal2jd(int(year.group()),1,1)[1]; 
         else: jval = gcal2jd(int(year.group()),12,31)[0]+gcal2jd(int(year.group()),12,31)[1];
      elif month:
         if m=='s': jval = gcal2jd(int(month.group(1)),int(month.group(2)),1)[0]+ \
            gcal2jd(int(month.group(1)),int(month.group(2)),1)[1]; 
         else: jval = gcal2jd(int(month.group(1)),int(month.group(2)),31)[0]+ \
            gcal2jd(int(month.group(1)),int(month.group(2)),31)[1];
      else:
         print 'not year or month - no way to make span';
      return jval; 
   else : # sDate or eDate (start or end)
      if year: 
         jval = gcal2jd(int(year.group()),1,1)[0]+ \
            gcal2jd(int(year.group()),1,1)[1] \
            if n == 'sDate' else \
            gcal2jd(int(year.group()),12,31)[0]+ \
            gcal2jd(int(year.group()),12,31)[1];
      elif month: # to heck with leap years, months end at 28
         jval = gcal2jd(int(month.group(1)),int(month.group(2)),1)[0]+ \
            gcal2jd(int(month.group(1)),int(month.group(2)),1)[1] \
            if n == 'sDate' else \
            gcal2jd(int(month.group(1)),int(month.group(2)),28)[0]+ \
            gcal2jd(int(month.group(1)),int(month.group(2)),28)[1]         
      elif day:
         jval = gcal2jd(int(day.group(1)),int(day.group(2)),\
                        int(day.group(3)))[0]+ \
            gcal2jd(int(day.group(1)),int(day.group(2)),\
                    int(day.group(3)))[1]; 
      else: 
         #print 'not a span, d='+d+', n='+n+', m='+m; 
         jval = None;
   if jval == None:
      print d, m, n+' resulted in None'
   #else:
      #jval=jval/1000000; for scaling graphic
   return jval;



def makeOne():		# estimate from nothing
   print 'you gave me no timespan'
   return None
def getIdx(i):		# return index of Period id
   for x in xrange(len(pds)):
      if pds[x]['id'] == i:
         return x

def getRef(g):		# return val of period.element (e.g. 23.s)
   print 'you gave me ' + g.group()
   if g.group(1) in ['<','~']:
      try:
         new = (g.group(1) or '')+pds[getIdx(g.group(2))] \
            ['tSpans'][0][g.group(3)] if g.group(3) else \
            (g.group(1) or '')+pds[getIdx(g.group(2))]['tSpans'][0]['s']; 
      except KeyError:
         new=g.group()
   elif g.group(1) == '>':
      try:
         new = (g.group(1) or '')+pds[getIdx(g.group(2))] \
            ['tSpans'][0][g.group(3)] if g.group(3) else \
            (g.group(1) or '')+pds[getIdx(g.group(2))]['tSpans'][0]['e'] ;   
      except KeyError:
         new = g.group()
   return new

def formatPeriodArray():  # build a period hash
   for x in xrange(len(pds)):
      if pds[x]:
         #pds[x].lane = -1
         #pds[x].level = 1
         #pds[x].lanerange = []
         #pds[x].partof
         pds[x]['x']= 0
         pds[x]['tSpansP']= []
         pds[x]['contingent'] = False
         pds[x]['estimated'] = False
         pds[x]['relations'] = []
         periodHash[pds[x]['id']] = pds[x]


#Project the period tspans
#for x in pds:
   #if(pds[x]):
      #projectTSpan(pds[x]);
def popPeriod(id):
   cpp=currentProcessedPeriods
   for index, obj in enumerate(cpp):
      if obj['id'] == id:
         cpp.pop(index) ; print '  popped id#' + str(obj['id'])
def estimatePeriodOnTheFly(incoming):
   global dummyS, dummyMean
   print '  in estimate ?? ' #, incomingTSpan
   dummyS = 2400000
   dummyMean = 1000
   if 's' not in incoming:
      incoming['s']=dummyS
   if 'e' not in incoming:
      incoming['e']=incoming['s']+dummyMean
def projectTSpan(incoming):
   global currentProcessedPeriods, string, dummyS, dummyMean # ,oldspan
   if len(incoming['tSpansP']) > 0: return True; # already projected
   if 'tSpans' in incoming and incoming not in currentProcessedPeriods: # test 
      # print 'starting anyway'
      isCyclical = False
      currentProcessedPeriods.append(incoming);
      print '*****'
      print 'period ', incoming['id'], 'tSpansP', incoming['tSpansP']
      for x in xrange(len(incoming['tSpans'])):
         # incoming['tSpans'][x]=incoming['tSpans'][x]; 
         print '>tSpan:'+str(x)+str(incoming['tSpans'][x])
         processedTSpan = {}
         if 's' in incoming['tSpans'][x]:
            ref=re.match(r'([<>~=d])',incoming['tSpans'][x]['s'])
            if not ref: 
               processedTSpan['s'] = int(toJul(incoming['tSpans'][x]['s'],'sDate','s'))
               # print 's: ', incoming['id'], incoming['tSpans'][x]['s']+ ' toJul() --> '+ str(processedTSpan['s'])
            else:
               contingentValue = str(incoming['tSpans'][x]['s']);
               operator=incoming['tSpans'][x]['s'][0]
               targetPeriod=incoming['tSpans'][x]['s'][1:].split('.')[0]
               string=operator + ', '+targetPeriod # just for debug output
               # 80-88 only gets a specificTSpan
               if len(incoming['tSpans'][x]['s'][1:].split('.')) > 1:
                  specificTSpan=incoming['tSpans'][x]['s'][1:].split('.')[1]
                  string += (', '+specificTSpan) # just for debug output
               else: # no specificTSpan, make one
                  if 'subspan' in tsOperatorHash[operator]:
                     specificTSpan = tsOperatorHash[operator]['subspan']
                  else:
                     specificTSpan = 's'
                  string += (', '+specificTSpan)# ; print incoming['id'], string
               # now have operator, targetPeriod, specificTSpan - prove it
               #print str(incoming['id'])+ ' will process s:'+incoming['tSpans'][x]['s']+ ' as '+ string 

               # line #35; run this on the targetPeriod
               projectTSpan(periodHash[int(targetPeriod)])
               if 'ls' in processedTSpan or not tsOperatorHash[operator]['uncertaintyPoint']:
                  processedTSpan['s'] = periodHash[int(targetPeriod)]['tSpansP'][0][specificTSpan]
               else:
                  processedTSpan['s'] = periodHash[int(targetPeriod)]["tSpansP"][0]\
                     [specificTSpan] + uncertaintyValue * tsOperatorHash[operator]\
                     ['uncertaintyPoint']["s"]
                  processedTSpan["ls"] = periodHash[int(targetPeriod)]["tSpansP"][0]\
                     [specificTSpan] + uncertaintyValue + (uncertaintyValue * \
                     tsOperatorHash[operator]['uncertaintyPoint']['s'])                  
            # line 47; should have 's' for all non-duration, non-cyclical periods
         else:
            incoming['estimated']=True
            print ' *** no start, what can I do?'
         if 'ls' in incoming['tSpans'][x]:
            ref=re.match(r'([<>~=d])',incoming['tSpans'][x]['ls'])
            if not ref: 
               processedTSpan['ls'] = int(toJul(incoming['tSpans'][x]['ls'],'sDate','s'))
               #print 'ls: ',incoming['id'], incoming['tSpans'][x]['ls']+ ' toJul() --> '+ str(processedTSpan['ls'])
            else:
               contingentValue = str(incoming['tSpans'][x]['ls']);
               operator=incoming['tSpans'][x]['ls'][0]
               targetPeriod=incoming['tSpans'][x]['ls'][1:].split('.')[0]
               string=operator + ', '+targetPeriod # just for debug output
               if len(incoming['tSpans'][x]['ls'][1:].split('.')) > 1:
                  specificTSpan=incoming['tSpans'][x]['ls'][1:].split('.')[1]
                  string += (', '+specificTSpan) # just for debug output
               else: # no specificTSpan, make one
                  if 'subspan' in tsOperatorHash[operator]:
                     specificTSpan = tsOperatorHash[operator]['subspan']
                  else:
                     specificTSpan = 'ls'
                  string += (', '+specificTSpan)# ; print incoming['id'], string
               # now have operator, targetPeriod, specificTSpan - prove it
               # print str(incoming['id'])+ ' will process ls:'+incoming['tSpans'][x]['ls']+ ' as '+ string 

               # line #; run this on the targetPeriod
               projectTSpan(periodHash[int(targetPeriod)])
               processedTSpan['ls'] = periodHash[int(targetPeriod)]["tSpansP"][0][specificTSpan]

         if 'e' in incoming['tSpans'][x]:
            ref=re.match(r'([<>~=d])',incoming['tSpans'][x]['e'])
            if not ref: 
               processedTSpan['e'] = int(toJul(incoming['tSpans'][x]['e'],'eDate','e'))
            else: # it's a ref, parse/build a destination
               contingentValue = str(incoming['tSpans'][x]['e']);
               operator=incoming['tSpans'][x]['e'][0]
               targetPeriod=incoming['tSpans'][x]['e'][1:].split('.')[0]
               string=operator + ', '+targetPeriod # just for debug output
               if len(incoming['tSpans'][x]['e'][1:].split('.')) > 1:
                  specificTSpan=incoming['tSpans'][x]['e'][1:].split('.')[1]
                  string += (', '+specificTSpan) # just for debug output
               else: # no specificTSpan, make one
                  if 'subspan' in tsOperatorHash[operator]:
                     specificTSpan = tsOperatorHash[operator]['subspan']
                  else:
                     specificTSpan = 'e'
                  string += (', '+specificTSpan)# ; print incoming['id'], string
               
               # now have operator, targetPeriod, specificTSpan -- e.g. >, 12, e

               projectTSpan(periodHash[int(targetPeriod)]) # use hash to get correct index for 'id'
               
               if 'ee' in processedTSpan or not tsOperatorHash[operator]['uncertaintyPoint']:
                  processedTSpan['e'] = periodHash[int(targetPeriod)]['tSpansP'][0][specificTSpan]
               else:
                  processedTSpan['e'] = periodHash[int(targetPeriod)]["tSpansP"][0][specificTSpan] +\
                     uncertaintyValue * tsOperatorHash[operator]['uncertaintyPoint']["e"]
                  processedTSpan["ee"] = periodHash[int(targetPeriod)]["tSpansP"][0][specificTSpan] -\
                     uncertaintyValue + (uncertaintyValue * tsOperatorHash[operator]['uncertaintyPoint']['e'])   
         if 'ee' in incoming['tSpans'][x]:
            ref=re.match(r'([<>~=d])',incoming['tSpans'][x]['ee'])
            if not ref: 
               processedTSpan['ee'] = int(toJul(incoming['tSpans'][x]['ee'],'eDate','e'))
               #print 'ee: ', incoming['id'], incoming['tSpans'][x]['ee']+ ' toJul() --> '+ str(processedTSpan['ee'])
            else:
               contingentValue = str(incoming['tSpans'][x]['ls']);
               operator=incoming['tSpans'][x]['ls'][0]
               targetPeriod=incoming['tSpans'][x]['ls'][1:].split('.')[0]
               string=operator + ', '+targetPeriod # just for debug output
               if len(incoming['tSpans'][x]['ls'][1:].split('.')) > 1:
                  specificTSpan=incoming['tSpans'][x]['ls'][1:].split('.')[1]
                  string += (', '+specificTSpan) # just for debug output
               else: # no specificTSpan, make one
                  if 'subspan' in tsOperatorHash[operator]:
                     specificTSpan = tsOperatorHash[operator]['subspan']
                  else:
                     specificTSpan = 'ee'
                  string += (', '+specificTSpan)# ; print incoming['id'], string
               # now have operator, targetPeriod, specificTSpan - prove it
               # print str(incoming['id'])+ ' will process ee:'+incoming['tSpans'][x]['ls']+ ' as '+ string 

               # line #; run this on the targetPeriod
               projectTSpan(periodHash[int(targetPeriod)])
               processedTSpan['ee'] = periodHash[int(targetPeriod)]["tSpansP"][0][specificTSpan]
         
         if 'duration' in incoming['tSpans'][x] and 'during' in incoming['tSpans'][x]:
            durVal = incoming['tSpans'][x]['duration'][:-1]
            durType = durVal[-1:]
            if durType in durationHash:
               durVal = int(durVal) * durationHash[durType]
            else:
               durVal = int(durVal)
            processedTSpan['d'] = durVal
         elif 'duration' in incoming['tSpans'][x]:
            if incoming['tSpans'][x]['duration'][0] != "=":
               durVal = incoming['tSpans'][x]['duration']
               durType = durVal[-1:]
               if durType in durationHash:
                  durVal = int(durVal[:-1]) * durationHash[durType]
               else:
                  durVal = int(durVal)
               if 's' in incoming['tSpans'][x]:
                  processedTSpan['e'] = processedTSpan['s'] + durVal
               elif 'e' in incoming['tSpans'][x]:
                  processedTSpan['s'] = processedTSpan['e'] - durVal
            
            else:
               print 'dangling if at line 219'
         if 'cstep' in incoming['tSpans'][x]:
            isCyclical = True;
            if incoming['tSpans'][x]['cstep'][0] != "=":
               cycleBounds = processedTSpan
               durVal = incoming['tSpans'][x]['cduration']; print durVal
               durType = durVal[-1:]; print durType
               if durType in durationHash:
                  durVal = int(durVal[:-1]) * durationHash[durType]
               else:
                  durVal = int(durVal)
               stepVal = incoming['tSpans'][x]['cstep']; print stepVal
               stepType = stepVal[-1:]; print stepType
               if stepType in durationHash:
                  stepVal = int(stepVal[:-1]) * durationHash[stepType]
               else:
                  stepVal = int(stepVal)
               x = cycleBounds['s']
               xe = cycleBounds['e']
               while x < xe:
                  processedCycleTSpan = {"s": x, "e": x + durVal};
                  incoming['tSpansP'].append(processedCycleTSpan)
                  x = x + stepVal               
         if isCyclical == False:
            incoming['tSpansP'].append(processedTSpan); 
            print 'processedTSpan', processedTSpan
            print 'pds', pds[x]['tSpansP']
            # print '  incoming has '+str(incoming['tSpansP'])
            estimatePeriodOnTheFly(incoming['tSpansP'][len(incoming['tSpansP'])-1])
      popPeriod(incoming['id']); 
      # print 'incoming[""tSpansP"]: ', incoming['tSpansP']
      newProj = incoming['tSpansP']
      newPeriods.append(incoming['tSpansP'])
   else: 
      if incoming in currentProcessedPeriods:
         popPeriod(incoming['id'])
      incoming['tSpansP'].append({})
      incoming['estimated'] = True
      estimatePeriodOnTheFly(incoming['tSpansP'][0]) 
   

# ******************
#
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
# read data 
   file = codecs.open(fn,"r", "utf-8"); 
   coll=file.read(); file.close();
# result writers
   fnw1='../ttout/'+data+'_collection.json' # collection with julian dates, geometry
   w1 = codecs.open(wd+fnw1,"w", "utf-8"); 
   # for rendering, calcs
   fnw2='../ttout/'+data+'_geom_raw.json' # a raw geometries object for pyplot
   w2 = codecs.open(wd+fnw2,"w", "utf-8");
   fnw3='../ttout/'+data+'_geom_d3.json' # a labeled geometries object for d3
   w3 = codecs.open(wd+fnw3,"w", "utf-8");
   fnpickle=path1+path2+'data/'+data+'.pickle'
   w4=codecs.open(fnpickle,"w")

   collection = json.loads(coll)	# load
   periods = collection['periods']	# isolate periods
   pds = periods # copy for debugging
   newCollection = collection # clone, replace periods[] later
   atom = newCollection['projection']['atom']
#
def doEm():
   global pds  
   newPeriods = []
   formatPeriodArray()
   for i in xrange(len(pds)):
   #for i in xrange(2):
      projectTSpan(pds[i])
      # newPeriods.append(projectTSpan(pds[p]))
   #for j in pds:
      #print j['id'],j['tSpansP']
   #return
init()
doEm()

for j in pds:
      print j['id'],j['tSpansP']
