# elastic.py 
# manage Elasticsearch index for Linked Places

import os, sys, re, codecs, json
from datetime import datetime
from elasticsearch import Elasticsearch

es = Elasticsearch()

# it's all or nothing - delete index first
projects = ["incanto", "vicarello", "courier", "xuanzang", "roundabout"]
datasets = ["incanto-f", "incanto-j", "vicarello", "courier", "xuanzang", "roundabout"]


def indexPlaces():
    # PLACES
    for y in range(len(projects)):
        print(projects[y])
        # NOTE: place index for demo site uses manually edited jsonl files in (...)data/demo
        finp = codecs.open('../_site/data/index/'+projects[y]+'.jsonl', 'r', 'utf8')
        rawp = finp.readlines()
        finp.close()
        
        # index places
        for x in range(len(rawp)):
            doc = json.loads(rawp[x])
            try:
                res = es.index(index="linkedplaces", doc_type='place', id=doc['id'], body=doc)
                print(res['created'], 'place', doc['id'])
            except:
                print("error:", sys.exc_info()[0])
                


def indexSegments():
    # SEGMENTS
    for y in range(len(datasets)):
        print(datasets[y])
        fins = codecs.open('../_site/data/index/'+datasets[y]+'_seg.jsonl', 'r', 'utf8')
        raws = fins.readlines()
        fins.close()
        
        # index segments
        for x in range(len(raws)):
            doc = json.loads(raws[x])
            try:
                res = es.index(index="linkedplaces", doc_type='segment', id=doc['properties']['segment_id'], body=doc)
                print(res['created'], 'segment', doc['properties']['segment_id'])
            except:
                print("error:",  doc['properties']['segment_id'], sys.exc_info()[0])

indexPlaces()
indexSegments()
