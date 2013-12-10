#!/usr/bin/python

import cgi, cgitb, pickle
from helper5 import toJul;
from shapely.geometry import Polygon, MultiPolygon

cgitb.enable()  # for troubleshooting

#the cgi library gets vars from html
form = cgi.FieldStorage()
# jquery_input = form.getvalue("start") + ', '+form.getvalue("end")

start = '-200' 
end = '50'
coll = 'pleiades98test'
#start = '1945-03-21' 
#end = '1945-09-20'
#coll = 'ww2'
# 1945-03-21, 1945-09-20, ww2
#start =  form.getvalue("start")
#end = form.getvalue("end")
#coll = form.getvalue("pCollect")

def parseQuery(s,e,c):
   global collection, query
   if c in ('ww2', 'ww2a', 'pleiades1', 'pleiades2', 'pleiades98test'):
      query = dates2poly([s, e])
      # print type(query), query
      # file = open('../data/ttout/' + c + '.pickle','U')
      file = open('../data/' + c + '.pickle','U')
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

   print "Content-type: text/html"
   print

   print '<p>'+str(counter) + ' <em>match(es)</em></p>'
   print '<p class="table-head">ID , % Intersect , Label </p>'
   #print '<table><tr><th>ID</th><th>% intersect</th><th>Label</th></tr>'
   #for r in resultArray:
   # print('<tr class="r-table"><td>'+r["id"]+'</td><td>'+"{0:.2f}".format(r["area"])+"%"
   #       +'</td><td>'+r["label"]+'</td></tr>')
   # print ('</table>')
   for r in resultArray:
      print(str(r["id"]), "{0:.2f}".format(r["area"])+"%", str(r['label'])), '<br/>'

parseQuery(start, end, coll)
ttIntersect(collection, query)
      #the next 2 'print' statements are important for web
#print "Content-type: text/html"
#print
#
##this is the actual output
#print 'you want start = '+start+' and end = '+end+'? <br/>'
#print query
