
import json
#import urllib2
import urllib.request
url = 'http://maps.cga.harvard.edu/tgaz/placename/json/hvd_9755'
url='http://n2t.net/ark:/99152/p0fp7wv2s8c.json'
#json.load(urllib2.urlopen(url))

req = urllib.request.Request(url)
with urllib.request.urlopen(req) as response:
    result = json.loads(response.readall().decode('utf-8'))
    
