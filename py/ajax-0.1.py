#!/usr/bin/python

import cgi, cgitb, pickle, simplejson
from helper import toJul;
from shapely.geometry import Polygon, MultiPolygon

cgitb.enable()  # for troubleshooting

#the cgi library gets vars from html
form = cgi.FieldStorage()

start =  form.getvalue("start")
end = form.getvalue("end")
coll = form.getvalue("pCollect")

def parseQuery(s,e,c):
   global collection, query
   if c in ('ww2','pleiades98', 'Dance', 'topotime_format', 'axial', 'us_history'):
      query = dates2poly([s, e])
      # print type(query), query
      file = open('../data/pyout/' + c + '.pickle','U')
      collection = pickle.load(file)

   else:
      print "Content-type: text/html"
      print
      print """need a collection (ww2, pleiades) AND
      a date array, e.g. ['1946-03-21', '1946-06-20']"""

def dates2poly(q):
   global qpoly
   # *** does not handle negative dates grrr
   print 'the query: ', q
   if type(q) == list:
      qstart=toJul(q[0],'','')/1000000; 
      qend=toJul(q[1],'','')/1000000
      qparr=[(qstart,0),(qstart,1),\
             (qend,1),(qend,0),(qstart,0)]
      qpoly=Polygon(qparr)
      return qpoly
   else:
      print """needs 2 of [-]Y{1,7}-MM-DD in square brackets (years can be negative and big)"""

def ttIntersect(coll, q): # e.g. collShapes, qpoly
   counter=0; resultArray=[]
   for i in xrange(len(coll)):
      result = {};
      if coll[i]['shapes'].intersection(q).area > 0: 
         counter +=1
         result['id']=coll[i]['id']; 
         result['label']=coll[i]['label']
         result['area']=(coll[i]['shapes'].intersection(q).area/q.area)*100 
         resultArray.append(result)
   resultArray = sorted(resultArray, key=lambda k: k['area'], reverse=True)
   #out = simplejson.dumps(resultArray)
   #return out
   print "Content-type: text/html"
   print 
   print '<p class="help">'+str(counter) + ' <em>match(es)</em></p>'
   print '<p class="table-head">% Intersect , Label </p>'

   for r in resultArray:
      #print(str(r["id"]), "{0:.2f}".format(r["area"])+"%", str(r['label'])), '<br/>'
      print("{0:.1f}".format(r["area"])+"%", str(r['label'])), '<br/>'


# run when called by web page
parseQuery(start, end, coll)
ttIntersect(collection, query)

