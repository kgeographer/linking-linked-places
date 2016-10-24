#!/usr/bin/python

import sys, getopt, csv, json, codecs

def createPlaces(fin):
    places = [{'p':1}]
    
    return places;

def createSegments(fin):
    segments = [{'s':1}]
    
    return segments;

def main(argv):
    project = ''
        
    if len(sys.argv) == 1:
        print('syntax is: argish.py -p <project tag>')
        sys.exit(2)
    try:
        opts, args = getopt.getopt(argv,"hp:",["project="])
    except getopt.GetoptError:
        print('syntax is: argish.py -p <project tag>')
        sys.exit(2)
        
    for opt, arg in opts:
        if opt == '-h':
            print('argish.py -p <project tag>')
            sys.exit()
        elif opt in ("-p", "--project"):
            finp = 'data/source/'+arg+'/places_'+arg+'.csv'
            fins = 'data/source/'+arg+'/segments_'+arg+'.csv'
            fout = codecs.open('../data/out/'+arg+'.json', 'w', 'utf8')


    fout.write(json.dumps({
    #print(json.dumps({
        'type': 'FeatureCollection',
        'features': createPlaces(finp) + createSegments(fins)
    }))
    fout.close()


if __name__ == "__main__":
    main(sys.argv[1:])