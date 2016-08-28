import json

class FeatureCollection(object):
   def __init__(self, id, label, provenance, date):
      self.type = "FeatureCollection" 
      self.properties = {"id": id, \
         "label": label, \
         "provenance": provenance, \
         "pub_date": date }
      self.features = []      
      
   def to_JSON(self):
      return json.dumps(self, default=lambda o: o.__dict__, 
                        sort_keys=False, indent=2)

class nodeFeature(object):
   def __init__(self, label):
      self.type = "Feature"
      self.properties = { "featureType": 'place', \
                          "label": label }
      self.when = {"timespans": []}
      self.geometry = {}  
      
   def addProperty(self,key):
      self.properties[key] = properties[key]

class edgeFeature(object):
   def __init__(self, id, feat_type):
      self.type = "Feature"
      self.properties = { "featureType": feat_type, \
                          "id": id }
      self.when = {"timespans": []}
      self.geometry = \
         {"type":"LineString", \
          "properties": {}, \
          "coordinates": []
         } 
   def addProperty(self,key):
      self.properties[key] = properties[key]

class Geometry(object):
   def __init__(self):
      #self.type = geomtype
      self.properties = {"id":"", "label":""}
      self.when = {"timespans": []}
      self.coordinates = []

class GeometryCollection(object):
   def __init__(self):
      self.type = "GeometryCollection"
      self.geometries = []   

def parseWhen(year):   
   ts = {}
   pstart = '0'+str(year) if len(str(year)) == 3 else str(year)
   pend = '0'+str(year) if len(str(year)) == 3 else str(year)
   #pstart = '0'+str(year-50) if len(str(year)) == 3 else str(year-50)
   #pend = '0'+str(year+50) if len(str(year)) == 3 else str(year+50)
   s = {"earliest":pstart+'-01-01'}
   e = {"latest":pend+'-12-31'}   
   ts['start'] = s
   ts['end'] = e
   ts['label'] = 'in '+str(year)
   print(ts)
   return ts
