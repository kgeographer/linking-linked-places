# elastic.py 
# manage Elasticsearch index for Linked Places

import os, sys, re, codecs, json
from datetime import datetime
from elasticsearch import Elasticsearch

es = Elasticsearch()

#projects = ["incanto", "vicarello", "courier", "xuanzang", "roundabout"]
#projects = ["incanto", "vicarello", "xuanzang", "roundabout"]
projects = ["courier"]

# put dataset in index
# assumes mapping template
for y in range(len(projects)):
    print(projects[y])
    fin = codecs.open('_site/data/'+projects[y]+'.jsonl', 'r', 'utf8')
    raw = fin.readlines()
    fin.close()    
    for x in range(len(raw)):
        doc = json.loads(raw[x])
        try:
            res = es.index(index="linkedplaces", doc_type='place', id=doc['id'], body=raw[0])
            #res = es.index(index="linkedplaces", doc_type='place', id=doc['id'], body=doc)
            print(res['created'])
        except:
            print("error:", sys.exc_info()[0])

es.indices.refresh(index="linkedplaces")

#res = es.search(index="linkedplaces", body={"query": {"match_all": {}}})
#print("Got %d Hits:" % res['hits']['total'])
#for hit in res['hits']['hits']:
    #print("%(timestamp)s %(author)s: %(text)s" % hit["_source"])
    
#doc = {
    #'author': 'kimchy',
    #'text': 'Elasticsearch: cool. bonsai cool.',
    #'timestamp': datetime.now(),
#}