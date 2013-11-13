import os, re, random, math
#wd='c:/temp/'
wd='z:/karlg on my mac/box documents/Repos/topotime/'
#wd='c:/mydocs/my box files/Repos/topotime/'
#fn=wd+'periods.txt'
fn=wd+'data/pleiades100.csv'
file = open(fn,"r")
raw= file.readlines()
file.close()
print len(raw)
fn = wd+'data/pleiades_periods_fuzz.json'
w1=open(fn,'w')
w1.write('\t"periods": [\n')
# 17653;"below";"15819"
r1=re.compile(r'.*?,')
r2=re.compile(r'\[\[(.*?)\]\]')
for x in xrange(len(raw)):
   foo=r1.search(raw[x]).group()[:-1] ; print foo
   range=r2.search(raw[x]).group()[2:-2].split(',') ; print range
   s=range[0].strip();e=range[1].strip()
   ls=str(int(int(s)+random.uniform(0.08,0.2)*math.fabs(int(e)-int(s)))); 
   ee=str(int(int(e)-random.uniform(0.08,0.2)*math.fabs(int(e)-int(s))));
   print s,ls,ee,e
   if x%2 == 0 :
      w1.write('\t\t{"id": "'+str(x)+'", "label": "'+foo+'", "tSpans":[{"s": "'+ \
               (s.zfill(5) if s[0]=='-' else s) + '", "e": "'+ \
               (e.zfill(5) if e[0]=='-' else e) +'"}], "rels": [], "class": "HistPeriod"},\n')        
   else:
      w1.write('\t\t{"id": "'+str(x)+'", "label": "'+foo+'", "tSpans":[{"s": "'+ \
               (s.zfill(5) if s[0]=='-' else s) + '", "e": "'+ \
               (e.zfill(5) if e[0]=='-' else e) + '", "ls": "' + \
               (ls.zfill(5) if ls[0]=='-' else ls) + '", "ee": "' + \
               (ee.zfill(5) if ee[0]=='-' else ee) + '"}], "rels": [], "class": "HistPeriod"},\n')
w1.write(']')
w1.close()