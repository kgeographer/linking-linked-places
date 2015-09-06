import json
#countries = json.loads(codecs.open(root+'geo/slimmed.json','r','utf8').read())['features']
global countries
countries = []

class FeatureCollection(object):
   def __init__(self, id):
      self.type = "FeatureCollection" 
      self.properties = {"id": id, \
         "label":"PeriodO collection: "+id+""}
      self.features = []
      
   def to_JSON(self):
      return json.dumps(self, default=lambda o: o.__dict__, 
                        sort_keys=True, indent=2)

class Feature(object):
   def __init__(self, id, label, ftype):
      self.type = "Feature"
      self.properties = {"id": id, "label": label, \
         "featureType": ftype}
      self.when = {"timespans": []}
      self.geometry = \
         {"type":"MultiPolygon", \
          "coordinates": [],
          "properties": {"spatialCoverageDescription": "", \
                         "spatialCoverage": [] }          
          }   
   
   def addProperty(self,key):
      self.properties[key] = properties[key]

class Geometry(object):
   def __init__(self):
      self.type = ""
      self.properties = {"id":"", "label":""}
      self.when = {"timespans": []}
      self.coordinates = []
      
