# ttParse.py 2 Nov 2013
# def ttParse(pds):
import copy
uncertaintyValue = 365;  
durationHash = {"d": 1, "h": 1/24, "w": 7, "m": 365.25/12, "y": 365.25};
tsOperatorHash = { "<": {"subspan": "s", "uncertaintyPoint": {"s": -1,"e": .001}}, 
                   ">": {"subspan": "e", "uncertaintyPoint": {"s": .001, "e": 1}}, 
                   "~": {"uncertaintyPoint": {"s": -0.5, "e": -0.5}}};
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
   print 'popping id '+str(id)
   cpp=currentProcessedPeriods
   for index, obj in enumerate(cpp):
      if obj['id'] == id:
         cpp.pop(index) ; print 'popped id#' + str(obj['id'])
def estimatePeriodOnTheFly(incomingTSpan):
   print 'gonna estimate ', incomingTSpan
# build a hash for ?? later
currentProcessedPeriods = []
periodHash = {}
formatPeriodArray()

for p in xrange(len(pds)):
   projectTSpan(pds[p])
   # newPeriods.append(projectTSpan(pds[p]))
   
def projectTSpan(incoming):
   global processedTSpan, oldspan, currentProcessedPeriods
   if len(incoming['tSpansP']) > 0: return True; # already projected
   if 'tSpans' in incoming and incoming not in currentProcessedPeriods: # test 
      # print 'starting anyway'
      isCyclical = False
      currentProcessedPeriods.append(incoming);
      print 'incoming period: ', incoming['id'], 'tSpansP', incoming['tSpansP']
      for x in xrange(len(incoming['tSpans'])):
         oldspan=incoming['tSpans'][x]; print '[80]oldspan: ', oldspan
         processedTSpan = {}
         if 's' in oldspan:
            ref=re.match(r'([<>~=d])',oldspan['s'])
            if not ref: 
               processedTSpan['s'] = int(toJul(oldspan['s'],'sDate','s'))
               print 's: ', incoming['id'], oldspan['s']+ ' toJul() --> '+ str(processedTSpan['s'])
            else:
               contingentValue = str(oldspan['s']);
               operator=oldspan['s'][0]
               targetPeriod=oldspan['s'][1:].split('.')[0]
               string=operator + ', '+targetPeriod # just for debug output
               # 80-88 only gets a specificTSpan
               if len(oldspan['s'][1:].split('.')) > 1:
                  specificTSpan=oldspan['s'][1:].split('.')[1]
                  string += (', '+specificTSpan) # just for debug output
               else: # no specificTSpan, make one
                  if 'subspan' in tsOperatorHash[operator]:
                     specificTSpan = tsOperatorHash[operator]['subspan']
                  else:
                     specificTSpan = 's'
                  string += (', '+specificTSpan)# ; print incoming['id'], string
               # now have operator, targetPeriod, specificTSpan - prove it
               print str(incoming['id'])+ ' will process '+oldspan['s']+ ' as '+ string 

               # line #35; run this on the targetPeriod
               projectTSpan(periodHash[targetPeriod])
               if 'ls' in processedTSpan or not tsOperatorHash[operator]['uncertaintyPoint']:
                  processedTSpan['s'] = periodHash[targetPeriod]['tSpansP'][0][specificTSpan]
               else:
                  processedTSpan['s'] = periodHash[targetPeriod]["tSpansP"][0]\
                     [specificTSpan] + uncertaintyValue * tsOperatorHash[operator]\
                     ['uncertaintyPoint']["s"]
                  processedTSpan["ls"] = periodHash[targetPeriod]["tSpansP"][0]\
                     [specificTSpan] + uncertaintyValue + (uncertaintyValue * \
                     tsOperatorHash[operator]['uncertaintyPoint']['s'])                  
            # line 47; should have 's' for all non-duration, non-cyclical periods
         else:
            incoming['estimated']=True
            print 'no start, what can I do?'
         if 'ls' in oldspan:
            ref=re.match(r'([<>~=d])',oldspan['ls'])
            if not ref: 
               processedTSpan['ls'] = int(toJul(oldspan['ls'],'sDate','s'))
               print 'ls: ',incoming['id'], oldspan['ls']+ ' toJul() --> '+ str(processedTSpan['ls'])
            else:
               contingentValue = str(oldspan['ls']);
               operator=oldspan['ls'][0]
               targetPeriod=oldspan['ls'][1:].split('.')[0]
               string=operator + ', '+targetPeriod # just for debug output
               if len(oldspan['ls'][1:].split('.')) > 1:
                  specificTSpan=oldspan['ls'][1:].split('.')[1]
                  string += (', '+specificTSpan) # just for debug output
               else: # no specificTSpan, make one
                  if 'subspan' in tsOperatorHash[operator]:
                     specificTSpan = tsOperatorHash[operator]['subspan']
                  else:
                     specificTSpan = 'ls'
                  string += (', '+specificTSpan)# ; print incoming['id'], string
               # now have operator, targetPeriod, specificTSpan - prove it
               print str(incoming['id'])+ ' will process '+oldspan['ls']+ ' as '+ string 

               # line #; run this on the targetPeriod
               projectTSpan(periodHash[targetPeriod])
               processedTSpan['ls'] = periodHash[targetPeriod]["tSpansP"][0][specificTSpan]

         if 'e' in oldspan:
            ref=re.match(r'([<>~=d])',oldspan['e'])
            if not ref: 
               processedTSpan['e'] = int(toJul(oldspan['e'],'eDate','e'))
               print 'e: ',incoming['id'], oldspan['e']+ ' toJul() --> '+ str(processedTSpan['e'])
            else:
               contingentValue = str(oldspan['e']);
               operator=oldspan['e'][0]
               targetPeriod=oldspan['e'][1:].split('.')[0]
               string=operator + ', '+targetPeriod # just for debug output
               if len(oldspan['e'][1:].split('.')) > 1:
                  specificTSpan=oldspan['ls'][1:].split('.')[1]
                  string += (', '+specificTSpan) # just for debug output
               else: # no specificTSpan, make one
                  if 'subspan' in tsOperatorHash[operator]:
                     specificTSpan = tsOperatorHash[operator]['subspan']
                  else:
                     specificTSpan = 'e'
                  string += (', '+specificTSpan)# ; print incoming['id'], string
               # now have operator, targetPeriod, specificTSpan - prove it
               print str(incoming['id'])+ ' will process '+oldspan['e']+ ' as '+ string 

               # line #; run this on the targetPeriod
               projectTSpan(periodHash[targetPeriod])
               
               if 'ee' in processedTSpan or not tsOperatorHash[operator]['uncertaintyPoint']:
                  processedTSpan['e'] = periodHash[targetPeriod]['tSpansP'][0][specificTSpan]
               else:
                  processedTSpan['e'] = periodHash[targetPeriod]["tSpansP"][0]\
                     [specificTSpan] + uncertaintyValue * tsOperatorHash[operator]\
                     ['uncertaintyPoint']["e"]
                  processedTSpan["ee"] = periodHash[targetPeriod]["tSpansP"][0]\
                     [specificTSpan] + uncertaintyValue + \
                     (uncertaintyValue * tsOperatorHash[operator]['uncertaintyPoint']['e'])   
         if 'ee' in oldspan:
            ref=re.match(r'([<>~=d])',oldspan['ee'])
            if not ref: 
               processedTSpan['ee'] = int(toJul(oldspan['ee'],'eDate','e'))
               print 'ee: ', incoming['id'], oldspan['ee']+ ' toJul() --> '+ str(processedTSpan['ee'])
            else:
               contingentValue = str(oldspan['ls']);
               operator=oldspan['ls'][0]
               targetPeriod=oldspan['ls'][1:].split('.')[0]
               string=operator + ', '+targetPeriod # just for debug output
               if len(oldspan['ls'][1:].split('.')) > 1:
                  specificTSpan=oldspan['ls'][1:].split('.')[1]
                  string += (', '+specificTSpan) # just for debug output
               else: # no specificTSpan, make one
                  if 'subspan' in tsOperatorHash[operator]:
                     specificTSpan = tsOperatorHash[operator]['subspan']
                  else:
                     specificTSpan = 'ee'
                  string += (', '+specificTSpan)# ; print incoming['id'], string
               # now have operator, targetPeriod, specificTSpan - prove it
               print str(incoming['id'])+ ' will process '+oldspan['ls']+ ' as '+ string 

               # line #; run this on the targetPeriod
               projectTSpan(periodHash[targetPeriod])
               processedTSpan['ee'] = periodHash[targetPeriod]["tSpansP"][0][specificTSpan]
         
         if 'duration' in oldspan and 'during' in oldspan:
            durVal = oldspan['duration'][:-1]
            durType = durVal[-1:]
            if durType in durationHash:
               durVal = int(durVal) * durationHash[durType]
            else:
               durVal = int(durVal)
            processedTSpan['d'] = durVal
         elif 'duration' in oldspan:
            if oldspan['duration'][0] != "=":
               durVal = oldspan['duration']
               durType = durVal[-1:]
               if durType in durationHash:
                  durVal = int(durVal[:-1]) * durationHash[durType]
               else:
                  durVal = int(durVal)
               if 's' in oldspan:
                  processedTSpan['e'] = processedTSpan['s'] + durVal
               elif 'e' in oldspan:
                  processedTSpan['s'] = processedTSpan['e'] - durVal
            
            else:
               print 'dangling if at line 219'
         if 'cstep' in oldspan:
            isCyclical = True;
            if oldspan['cstep'][0] != "=":
               cycleBounds = processedTSpan
               durVal = oldspan['cduration']; print durVal
               durType = durVal[-1:]; print durType
               if durType in durationHash:
                  durVal = int(durVal[:-1]) * durationHash[durType]
               else:
                  durVal = int(durVal)
               stepVal = oldspan['cstep']; print stepVal
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
            incoming['tSpansP'].append(processedTSpan); print 'incoming has '+str(incoming['tSpansP'])
            # estimatePeriodOnTheFly(incoming['tSpansP'][len(incoming['tSpansP'])-1])
      popPeriod(incoming['id']);            
   else: 
      if incoming in currentProcessedPeriods:
         popPeriod(incoming['id'])
      incoming['tSpansP'].append({})
      incoming['estimated'] = True
      estimatePeriodOnTheFly(incoming['tSpansP'][0]) 

