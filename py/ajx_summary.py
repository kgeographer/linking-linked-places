#!/usr/bin/python

import cgi, cgitb, pickle, simplejson
from helper5 import toJul;
from shapely.geometry import Polygon, MultiPolygon
from shapely.geometry import Point
from shapely.ops import cascaded_union
from geojson import dumps as gdumps
from json import dumps as jdumps
from itertools import combinations
from numpy import array

cgitb.enable()  # for troubleshooting

#the cgi library gets vars from html
form = cgi.FieldStorage()
# jquery_input = form.getvalue("start") + ', '+form.getvalue("end")

# pdsString =  form.getvalue("periods")
# IDs for 'Bronze'
pdsString = '52, 55, 30, 24, 56, 57, 60, 61, 63, 64, 67, 68, 72, 74'
pdsArray = pdsString.split(',')
pdsArrayInt = map(int, pdsArray)
arr_obj = []; 

# this is how data will be loaded
c = 'pleiades98test'
file = open(wd[:-9]+'ttout/'+ c + '.pickle','U')
collection = pickle.load(file)
file.close()

# get periods of interest together in arr[]
for obj in collection:
    pdo = {}
    if int(obj['id']) in pdsArrayInt:
        pdo['id'] = obj['id']
        pdo['points'] = obj['points']
        arr_obj.append(pdo)

# get shapes
arr_poly = [];
for obj in collection:
    if int(obj['id']) in pdsArrayInt:
        arr_poly.append(obj['shapes'][0])
mpoly=MultiPolygon(arr_poly)

####
# intersection
inter = cascaded_union([pair[0].intersection(pair[1]) for pair in combinations(arr_poly, 2)])
coords_inter = list(inter.exterior.coords)
coords_inter_out = [{"points":[], "label" : "intersection"}]
for c in coords_inter:
    xypair = {}
    xypair['x'] = c[0]
    xypair['y'] = c[1]
    coords_inter_out[0]['points'].append(xypair)

# union
union = cascaded_union(mpoly)
coords_union = list(union.exterior.coords)
coords_union_out = [{"points":[], "label" : "union"}]
for c in coords_union:
    xypair = {}
    xypair['x'] = c[0]
    xypair['y'] = c[1]
    coords_union_out[0]['points'].append(xypair)

j_inter = jdumps(coords_inter_out)
j_union = jdumps(coords_union_out)
def sendBack():
    print j_inter
    # return j_union
    #print "Content-type: text/html"
    #print
    #print("We'll summarize "+str(pdsArrayInt)+", very soon...")
    #print([str(coords_inter_out), str(coords_union_out)])

sendBack() # dummy test return

# below is from ajx2.py
def parseQuery(s,e,c):
    global collection, query
    if c in ('ww2', 'ww2func','pleiades98test', 'Dance_adj',
             'topotime_format', 'us_history', 'Plato_Buddha'):
        query = dates2poly([s, e])
        # print type(query), query
        file = open('../data/ttout/' + c + '.pickle','U')
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

sendBack() # dummy test return

## get bounds of s/ls, ee/e
#arr_s = []; arr_ls = []; arr_ee = []; arr_e = []
#for i in xrange(len(arr)):
    #arr_x = []; arr_y = []
    #for j in xrange(len(arr[i]['points'])):
        #arr_x.append(arr[i]['points'][j]['x'])
        #arr_y.append(arr[i]['points'][j]['y'])
    #print arr_x[:4], arr_y[:4]   
    #m = max(arr_y) # usually 1, not always
    #shelf_idx = [i for i, j in enumerate(arr_y) if j == m]
    #shelf_x = [j for i, j in enumerate(arr_x) if i in shelf_idx]
#parseQuery(start, end, coll)
#ttIntersect(collection, query)
