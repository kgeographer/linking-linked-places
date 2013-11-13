from shapely.geometry import Polygon
from pprint import pprint
from descartes import PolygonPatch
from matplotlib import pyplot
a = Polygon([(0, 123789), (0, 129789), (1, 128567), (1, 124123)])
b = Polygon([(0, 129000), (1, 129200), (1, 132000), (0, 134123)])
a.area
b.area

x = a.intersection(b)
pprint(list(x))

s,ls,ee,e
