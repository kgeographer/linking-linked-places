# generate events: lifespans and subevents
from jdcal import gcal2jd, jd2gcal
from collections import OrderedDict
import random, math, codecs
from datetime import datetime, date, time
import timefunc
from random import choice, sample
import simplejson as json
st = 1760
end = 1960
#wd='g:/mydocs/my box files/topotime/pylab/'
wd='c:/mydocs/GitHub/topotime/'
fn='verbs330.txt'
file = codecs.open(wd+fn,"r", "utf-8"); raw=file.read(); file.close(); verbs=raw.split(',')
fn='givn.txt'
file = codecs.open(wd+fn,"r", "utf-8"); raw=file.read(); file.close(); givn=raw.split(',')
fn='surn.txt'
file = codecs.open(wd+fn,"r", "utf-8"); raw=file.read(); file.close(); surn=raw.split(',')

articles=('and','then','for','after','before','only to')
startjd = gcal2jd(st,1,1)[0]+gcal2jd(st,1,1)[1]; print startjd
endjd = gcal2jd(end,1,1)[0]+gcal2jd(end,1,1)[1]; print endjd
#random.normalvariate(mu, sigma)
#css=constrained_sum_sample_pos(3,100)
dates = []; years = []; ranges = []; allev = [];
for x in xrange(1,16):
    per = {}; jdper = {}; per_list = []
    # lifespan in years
    sy=random.randrange(st, end, 1); print sy
    ey=int(sy+random.normalvariate(71,16.5)); print ey # not actually normal, but eh...
    per["id"]=x; per["class"]="life"; per["label"]=choice(givn)+' '+choice(surn) # all get these   
    if (ey-sy)%2 == 0: # even num span -> start and end dates
        s=[sy,random.randint(1,12),random.randint(1,28)]; print s
        e=[ey,random.randint(1,12),random.randint(1,28)]; print e
        #per["s"]=', '.join(map(str,s)); per["e"]=', '.join(map(str,e)) if (e[0] < 2014) else ''
        per["s"]=s; per["e"]=e if (e[0] < 2014) else None
        dates.append(per)
        #dates.append(timefunc.toSortedList(per))
    elif (ey-sy)%3 == 0: # div by 3 -> years as spans; with start and end confidence
        s=[sy,1,1]; print 's: '+str(s)
        ls=[s[0],12,31]; print 'ls: '+str(ls)
        e=[ey,12,31]; print 'e: '+str(e)
        ee=[e[0],1,1]; print 'ee: '+str(ee)
        per["s"]=s; per["ls"]=ls; per["ee"]=ee if (ee[0] < 2014) else None; 
        per["e"]=e if (e[0] < 2014) else None;
        per["s_conf"]=float("%.1f" % random.uniform(0.5,1.0)); #start confidence
        per["e_conf"]=float("%.1f" % random.uniform(0.5,1.0)); #end confidence        
        years.append(per)
        #years.append(timefunc.toSortedList(per))
    else: #(ey-sy)%5 == 0: # n%5 -> fuzzy start & end ranges
        s=[sy,1,1]; print 's: '+str(s)
        ls=[s[0]+random.randrange(1,3,1),12,31]; print 'ls: '+str(ls) # range of years     
        e=[ey, random.randint(1,12), random.randint(1,28)]; print # date
        ee=[ey-random.randrange(1,3,1), random.randint(1,12), random.randint(1,28)];
        per["s"]=s;per["ls"]=ls;per["ee"]=ee if (ee[0] < 2014) else None; per["e"]=e if (e[0] < 2014) else None;
        ranges.append(per)
        #ranges.append(timefunc.toSortedList(per))
    #else:
        #per["s"]='lastcase'; per["e"]='lastcase'
        #rest.append(per)

# put all events in one
allev.extend(dates); allev.extend(years); allev.extend(ranges);
# julian date function
def jd(t):
    jdate=gcal2jd(t[0],t[1],t[2])[0] + gcal2jd(t[0],t[1],t[2])[1];
    return jdate;
def strdate(d):
    foo = '{0.year}-{0.month:{1}}-{0.day:{1}}'.format(d, '02');
    return foo;
#sjd=gcal2jd(s[0],s[1],s[2])[0]+gcal2jd(s[0],s[1],s[2])[1]; print sjd
#ejd=gcal2jd(s[0],s[1],s[2])[0]+gcal2jd(s[0],s[1],s[2])[1]; print ejd
#2456537.5 - 2456172.5 *15
# make subevents and relations
counter=9000 # just a start number
subevents=[]; relations = []
for y in xrange(len(allev)):
    id=allev[y]['id'];
    s_j = jd(allev[y]['s']);
    e_j = jd(allev[y]['e'])-365 if allev[y]['e'] else jd((2013,9,2))-365; # today if alive minus 1 year
    #d='-'.join(map(str,(allev[y]['ls'])))
    s_g=datetime.strptime('-'.join(map(str,(allev[y]['s']))), "%Y-%m-%d").date(); 
    ls_g=datetime.strptime('-'.join(map(str,(allev[y]['ls']))), "%Y-%m-%d").date() \
        if allev[y].has_key("ls") else None;  print ls_g
    e_g=datetime.strptime('-'.join(map(str,(allev[y]['e']))), "%Y-%m-%d").date() \
        if allev[y]["e"] else date(2013, 9, 17); print e_g
    ee_g=datetime.strptime('-'.join(map(str,(allev[y]['ee']))), "%Y-%m-%d").date() \
        if allev[y].has_key("ee") else None;   
    e_g=e_g - e_g.resolution*365; print e_g
    print y, s_g, ls_g, ee_g, e_g, s_j, e_j
    allev[y]["s"]=strdate(s_g); allev[y]["ls"]=None if ls_g is None else strdate(ls_g+ls_g.resolution*3); 
    allev[y]["e"]=strdate(e_g); allev[y]["ee"]=None if ee_g is None else strdate(e_g-ls_g.resolution*3); 
    age = (e_g.year if (allev[y]['e']) <> None else 2013) - s_g.year; print age;
    active = [s_j+5475,e_j]; print active # [2385451.5, 2401906.5]
    count = int((active[1]-active[0])/1000); print count
    incr=0; dur=0;
    
    for z in xrange(0,count):
        per = {}
        counter +=1; incr+=dur
        s=active[0]+incr
        e=s+random.randint(1,30)
        dur=int(e-s); print s, e, dur
        # gregorian
        per["s"]=strdate(s_g+s_g.resolution*int(incr)); print s_g, per["s"]
        per["e"]=strdate(s_g+s_g.resolution*(int(incr)+dur)); print s_g, per["e"]
        per["ls"]=strdate(s_g+s_g.resolution*(int(incr)+int(dur*0.25))); print per["s"], per["ls"]
        per["ee"]=strdate(s_g+s_g.resolution*(int(incr)+int(dur*0.75))); print per["ee"], per["e"]
        print y, dur, per["s"], per["ls"], per["ee"], per["e"]
        # julian
        #per["s"]=s; per["e"]=e
        #per["ls"]=s+(0.1*dur); per["ee"]=e-(0.1*dur); print y, s, ls, ee, e, dur
        per["id"]=counter; per["label"]=choice(verbs)+' '+choice(articles)+' '+choice(verbs)
        per["class"]="event"
        #subevents.append(timefunc.toSortedList(per))
        subevents.append(per)
        # need to generate a relations record here
        rels = {}
        rels["subj"]=allev[y]['id']; rels["obj"]=counter; rels["rel"]="contains"; rels["auth"]="kg";
        relations.append(rels)
    print y, s_g, e_g

# add subevents to all others
allev.extend(subevents);

w1 = codecs.open('c:/temp/allevents.json', encoding='utf-8', mode='w+')
# make JSON
e = json.dumps(allev, sort_keys=False, indent=4 * ' ')
sub='\n'.join([l.rstrip() for l in  e.splitlines()])
r = json.dumps(relations, sort_keys=False, indent=4 * ' ')
relarr='\n'.join([l.rstrip() for l in  r.splitlines()])

w1.write('''{\n\t"type": "PeriodCollection",
    "id": " ",  "label": " ",
    "author": " ", "rev_date": " ",
    "Features":'''  
    + sub + ',\n' +
    '"Relations":' +
    relarr +
    '\n}' # + sub
    )
w1.close()

print 'events made: '+str(len(years))+' w/years, '+str(len(dates))+' w/dates, and ' + \
	str(len(ranges))+' w/ranges'

#f = codecs.open('c:/temp/fuckin-uni.txt', encoding='utf-8', mode='w+')
#fn='givn.txt'
#file = codecs.open(wd+fn,"r", "utf-8"); raw=file.read(); file.close(); givn=raw.split(',')
#givn[23]
#f.write(givn[23]+' some other text')
#f.close()