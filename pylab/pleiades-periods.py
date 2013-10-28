import os, re
wd='c:/temp/'
#wd='c:/mydocs/GitHub/topotime/data/'
#fn=wd+'periods.txt'
fn=wd+'pleiades100.csv'
file = open(fn,"r")
raw= file.readlines()
file.close()
print len(raw)
fn = wd+'pleiades_periods.json'
w1=open(fn,'w')
w1.write('\t"periods": [\n')
# 17653;"below";"15819"
r1=re.compile(r'.*?,')
r2=re.compile(r'\[\[(.*?)\]\]')
for x in xrange(len(raw)):
    foo=r1.search(raw[x]).group()[:-1] ; print foo
    range=r2.search(raw[x]).group()[2:-2].split(',') ; print range
    s=range[0].strip();e=range[1].strip()
    w1.write('\t\t{"id": "'+str(x)+'", "label": "'+foo+'", "tSpans":[{"s": "'+ \
             (s.zfill(5) if s[0]=='-' else s) + '", "e": "'+ \
             (e.zfill(5) if e[0]=='-' else e) +'"}], "rels": [], "class": "HistPeriod"},\n')
w1.write(']')
w1.close()
