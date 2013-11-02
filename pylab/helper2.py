import os, re, math, codecs, time
from datetime import date, datetime
from jdcal import gcal2jd, jd2gcal

def cyclical(cTspan):
    return 'skipping this cyclical period for now'
    
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
