# ttParse.py 2 Nov 2013
# def ttParse(pds):
uncertaintyValue = 365;  
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
            #pds[x].x = 0
            pds[x]['tSpansP']= []
            #pds[x].contingent = false
            pds[x]['estimated'] = False
            pds[x]['relations'] = []
            periodHash[pds[x]['id']] = pds[x]


#Project the period tspans
#for x in pds:
   #if(pds[x]):
      #projectTSpan(pds[x]);
# build a hash for ?? later
processedPeriods = []
periodHash = {}
formatPeriodArray()
for p in xrange(len(pds)):
   projectTSpan(pds[p])
   # newPeriods.append(projectTSpan(pds[p]))
def projectTSpan(incoming):
   global newspan, oldspan
   if len(incoming['tSpansP']) > 0: return True; # already projected
   if 'tSpans' in incoming: # and newPeriods.index(incoming) == -1: # test 
      isCyclical = False
      processedPeriods.append(incoming);
      # print 'incoming: ', incoming['id'], incoming['tSpansP']
      for x in xrange(len(incoming['tSpans'])):
         oldspan=incoming['tSpans'][x]; #print oldspan
         newspan = {}
         if 's' in oldspan:
            ref=re.match(r'([<>~=d])',oldspan['s'])
            if not ref: 
               newspan['s'] = int(toJul(oldspan['s'],'sDate','s'))
               print incoming['id'], oldspan['s']+ ' toJul() --> '+ str(newspan['s'])
            else:
               operator=oldspan['s'][0]
               targetPeriod=oldspan['s'][1:].split('.')[0]
               string=operator + ', '+targetPeriod
               # 83-91 only gets a specificTSpan
               if len(oldspan['s'][1:].split('.')) > 1:
                  specificTSpan=oldspan['s'][1:].split('.')[1]
                  string += (', '+specificTSpan) 
               else: # no specificTSpan, make one
                  if 'subspan' in tsOperatorHash[operator]:
                     specificTSpan = tsOperatorHash[operator]['subspan']
                  else:
                     specificTSpan = 's'
                  string += (', '+specificTSpan)# ; print incoming['id'], string
               
               print str(incoming['id'])+ ' will process '+oldspan['s']+ ' as '+ string 
               projectTSpan(periodHash[int(targetPeriod)])
               if 'ls' in newspan or not tsOperatorHash[operator]['uncertaintyPoint']:
                  newspan['s'] = periodHash[int(targetPeriod)]['tSpans'][0][specificTSpan]
               #else:
                  #print span
                  #newspan['s'] = toJul(periodHash[int(targetPeriod)]["tSpans"][0][specificTSpan],'','') + \
                     #uncertaintyValue * tsOperatorHash[operator]['uncertaintyPoint']["s"]
                  #newspan["ls"] = toJul(periodHash[int(targetPeriod)]["tSpans"][0][specificTSpan],'','') + \
                     #uncertaintyValue + (uncertaintyValue * tsOperatorHash[operator]['uncertaintyPoint']['s'])
                 
         else:
            incoming['estimated']=True
            print 'no start, what can I do?'
   else: 
      makeOne() # no tSpans array, need one

newspan['s'] = periodHash[1]["tSpans"][0]['e'] + \
                           uncertaintyValue * tsOperatorHash['>']['uncertaintyPoint']["s"]
      
newspan["ls"] = periodHash[int(targetPeriod)]["tSpans"][0][specificTSpan] + \
                     uncertaintyValue + (uncertaintyValue * tsOperatorHash[operator]['uncertaintyPoint']["s"])

      pid = pds[p]['id']; plabel = pds[p]['label']; 
      newperiod={}; newspans=[]
      newperiod['id']=pid; newperiod['label']=plabel
      #print str(len(pds[p]['tSpans'])) + ' tSpans'
      for t in xrange(len(pds[p]['tSpans'])): # resolve duration
         newspan = {}; oldspan = pds[p]['tSpans'][t]; #print oldspan
         if 'duration' in oldspan.keys():
            #print 'pid: '+str(pid), str(oldspan)
            refs=re.match(r'([<>~])(\d{1,3})\D?\.?([sle]{0,2})',oldspan['s']) \
               if 's' in oldspan.keys() else None
            refe=re.match(r'([<>~])(\d{1,3})\D?\.?([sle]{0,2})',oldspan['e']) \
               if 'e' in oldspan.keys() else None
            newspan['duration'] = withinSpan(oldspan['duration'])
            newspan['s'] = toJul(getRef(refs),'sDate','s') if refs \
               else toJul(oldspan['s'],'sDate','s')
            if 'e' in oldspan.keys():
               newspan['e'] = toJul(getRef(refe),'eDate','e') if refe else \
               toJul(oldspan['e'],'eDate','e')
            else: newspan['e'] = newspan['s']+newspan['duration'] if newspan['s'] \
               else 'none'
         #print pid, newspan
         pds[p]['tSpansP']=newspans; print pds[p]['tSpansP']
      #newperiod['tSpans']=newspans
      #newPeriods.append(newperiod)   

   for t in xrange(len(pds[p]['tSpans'])): # resolve references
      newspan = {}; oldspan = pds[p]['tSpans'][t];
      print 'pid: '+str(pid), str(oldspan)
      for e in xrange(len(oldspan)):
         if oldspan.keys()[e] == 'during': pass
         else: 
            ref=re.match(r'([<>~])(\d{1,3})\D?\.?([sle]{0,2})',\
                            oldspan.values()[e])
         if ref:
            print 'pid: ' + str(pid) + ' - ' + ref.group()
            newspan[oldspan.keys()[e]] = \
               getRef(ref)
            print 'ref newspan: ' + (str(newspan))
         else:
            newspan[oldspan.keys()[e]] = oldspan.values()[e]
            print 'newspan: ' + (str(newspan))
      newspans.append(newspan)
   newperiod['tSpans']=newspans
   newPeriods.append(newperiod)


for n in pds: 
   for t in n['tSpans']: 
      print n['id'], t

for n in newPeriods: 
   for t in n['tSpans']: 
      print n['id'], t
#parseRefs(pds)
#parseRefs(newPeriods)