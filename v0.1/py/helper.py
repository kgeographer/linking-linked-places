from __future__ import division
import os, re, math, codecs, time
from unidecode import unidecode
from datetime import date, datetime
from jdcal import gcal2jd, jd2gcal
from shapely.geometry import Polygon

def parseDate(pds):
   global p; p = pds
   newPeriods = []; 
   for x in xrange(len(pds)):
      newPeriod = {}; geom = []; newTspans = []; 
      newPeriods.append(newPeriod)
      newPeriods[x]['id']=pds[x]['id']; newPeriods[x]['label']=pds[x]['label']
      newPeriods[x]['geom']=geom; newPeriods[x]['tSpans']=newTspans;
      for y in xrange(len(pds[x]['tSpans'])):
         newSpan = {}; oldSpan = pds[x]['tSpans'][y];
         if 'during' in pds[x]['tSpans'][y]:		# span within a span   
            if 'd' not in oldSpan:
               print 'ERROR, format issue: during=true, need a duration "d"'; 
               #break;
            # newSpan['id']=pds[x]['id']
            if 'e' not in oldSpan:  # no end, build span from m or y
               newSpan['s'] = toJul(oldSpan['s'],'span','s');  #
               newSpan['e'] = toJul(oldSpan['s'],'span','e');  #
            else:         				# have s and e, convert to julian range
               newSpan['s'] = toJul(oldSpan['s'],'sDate','s')
               newSpan['e'] = toJul(oldSpan['e'],'eDate','e')
            # have s, e, and d now           
            #print oldSpan['d']
            julSpan = withinSpan(oldSpan['d']); #print julSpan # go make a range
            mid=newSpan['e']-(newSpan['e']-newSpan['s'])/2; print mid
            pct=round(julSpan/(newSpan['e']-newSpan['s']),2); print pct
            # put span dead-center for rendering
            newSpan['ls'] = mid-(julSpan/2);
            newSpan['ee'] = newSpan['ls'] + julSpan;
            if len(newSpan) > 0:
               newPeriods[x]['tSpans'].append(newSpan)
            # make geometry for calculations
            # ?? during is probable from s to e; ls and ee used for rendering
            coordPairs=[(newSpan['s']/1000000,0),(newSpan['s']/1000000,pct), \
                        (newSpan['e']/1000000,pct),(newSpan['e']/1000000,0), \
                        (newSpan['s']/1000000,0)]
            #coordPairs=[(newSpan['s']/1000000,0),(newSpan['ls']/1000000,pct), \
                        #(newSpan['ee']/1000000,pct),(newSpan['e']/1000000,0), \
                        #(newSpan['s']/1000000,0)]
            newPeriods[x]['geom']=coordPairs
         else: # handle all non-during
            newerPeriods=[]; newerTspans= []
            for z in xrange(len(oldSpan)): # find references 
               ref=re.match(r'([<>~])?(\d{1,3})\D\.?([sle]{0,2})',oldSpan.values()[z])
               if ref:                  
                  # print ref.group(1), ref.group(2), ref.group(3)
                  if not refOkay(ref):
                     print 'no good'; pass
                  else:
                     newSpan[oldSpan.keys()[z]] = \
                        (ref.group(1) or '')+pds[getIdx(ref.group(2))] \
                        ['tSpans'][0][ref.group(3)];
               else:
                  newSpan[oldSpan.keys()[z]] = \
                     oldSpan.values()[z]
            #print newSpan
            #newPeriods[x]['tSpans'].append(newSpan)            
            newerSpan={}; 
            for w in xrange(len(newSpan)): # find operators
               try:
                  op=re.match(r'([<>~])?(-?\d{1,8}-?\d{1,2}-?\d{1,2})', \
                              newSpan.values()[w])
                  if op.group(2) == None:
                     val = ref.group(1)
                     #newSpan[k] = toJul(val,'sDate','');
                  else:
                     val=op.group(2)
                           #newSpan[k] = toJul(val,'sDate','');
                  newerSpan[newSpan.keys()[w]] = toJul(val,'eDate','e')
               except:
                  print 'stalled on '+str(x)+', '+str(y);
                  break
            fudge = 0.1*(newerSpan['e'] - newerSpan['s']); print fudge
            # make fudge; ensure 4 terms
            if 'ls' not in newSpan: 
               if newSpan['s'][0]=='<':
                  newerSpan['ls'] = newerSpan['s']
                  newerSpan['s'] = newerSpan['ls']-fudge
               elif newSpan['s'][0]=='>':
                  newerSpan['ls']=newerSpan['s']+fudge
            if 'ee' not in newSpan: 
               if newSpan['e'][0]=='<':
                  newerSpan['ee'] = newerSpan['e']-fudge
               elif newSpan['e'][0]=='>':
                  newerSpan['ee']=newerSpan['e']
                  newerSpan['e']=newerSpan+fudge                  
            # newPeriods[x]['tSpans'].append(newSpan)
            # newerTspans.append(newerSpan)
            #if len(newPeriods[x]['tSpans']) == 0:
            newPeriods[x]['tSpans'].append(newerSpan)
            coordPairs=[(newerSpan['s']/1000000,0), \
                        (newerSpan['ls']/1000000,1) if 'ls' in newerSpan else (newerSpan['s']/1000000,1),\
                        (newerSpan['ee']/1000000,1) if 'ee' in newerSpan else (newerSpan['e']/1000000,1),\
                        (newerSpan['e']/1000000,0),(newerSpan['s']/1000000,0)]
            newPeriods[x]['geom']=coordPairs
            for p in newPeriods: print p['tSpans'];
   return newPeriods

def toRange(str,pos):
   global refObj,durs
   print 'in toRange(), str='+str+', pos='+pos
   bef=re.match(r'^<',str); aft=re.match(r'^>',str); abt=re.match(r'^\~',str)
   neg=re.match(r'^-',str); year=re.match(r'^\d{1,4}$',str)
   month=re.match(r'(\d{1,4})-(\d{1,2})$',str); \
      date=re.match(r'^(\d{1,4})-(\d{1,2})-(\d{1,2})',str)
   dur=re.match(r'\d{1,3}(d|m|y)$',str); \
      ref=re.match(r'([<,>,~])?(e\d{1,3})\.?(\w{1,2})',str)

   if (ref):
      refObj={"o":'"'+ref.group(1)+'"', "ref":ref.group(2), "pos": ref.group(3)}
      screwthis=refObj
      return refObj
   if (bef or aft or abt):
      print 'an operator, must parse ' + str
      # periods[12]['tSpans'][0]['e']
      # >e8.e
   elif (dur):
      #durs +=1
      print dur.group();
      # get s:, which could be date, month or year
   elif (year):
      if pos == 's':
         s=gcal2jd(year.group()+',01,01')[0]+gcal2jd(year.group()+',01,01')[1]
         ls=gcal2jd(year.group()+',01,31')[0]+gcal2jd(year.group()+',01,31')[1]
         rangeObj={"s":s,"ls":ls}
      elif pos == 'e':
         ee=gcal2jd(year.group()+',01,01')[0]+gcal2jd(year.group()+',01,01')[1]
         e=gcal2jd(year.group()+',1,31')[0]+gcal2jd(year.group()+',1,31')[1]
         rangeObj={"ee":ee,"e":e}
   elif (month):
      if pos == 's':
         s=gcal2jd(month.group()+',01')[0]+gcal2jd(month.group()+',01')[1]
         ls=gcal2jd(month.group()+',31')[0]+gcal2jd(month.group()+',31')[1]
         rangeObj={"s":s,"ls":ls}
      elif pos == 'e':
         ee=gcal2jd(month.group()+',01')[0]+gcal2jd(month.group()+',01')[1]
         e=gcal2jd(month.group()+',31')[0]+gcal2jd(month.group()+',31')[1]
         rangeObj={"ee":ee,"e":e}
   elif (date):
      print 'it\'s a date'
      foo=gcal2jd(date.group(1),date.group(2),date.group(3))[0] + \
         gcal2jd(date.group(1),date.group(2),date.group(3))[1]
      if pos == 's':
         rangeObj={"s":foo}
      elif pos == 'ls':
         rangeObj={"ls":foo}
      elif pos == 'e':
         rangeObj={"e":foo}
      elif pos == 'ee':
         rangeObj={"ee":foo}            
   return rangeObj
def getIdx(i):
   for x in xrange(len(p)):
      if p[x]['id'] == i:
         return x

def refOkay(r):
   if r.group(2)=='' or r.group(3)=='':
      print 'reference pointer in data missing a term'
      return False
   else:
      return True

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