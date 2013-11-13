from matplotlib import pyplot
from shapely.geometry import MultiPolygon
from descartes.patch import PolygonPatch

COLOR = {    True:  '#6699cc',    False: '#ff3333'    }

def v_color(ob):
    return COLOR[ob.is_valid]
def plot_coords(ax, ob):
    x, y = ob.xy
    ax.plot(x, y, 'o', color='#999999', zorder=1,markersize=1)
    
fig = pyplot.figure(1, figsize=(12,4), dpi=90)
ax = fig.add_subplot(111)

allArray = []
for x in xrange(len(collGeomRaw)):
    allArray.append([collGeomRaw[x],[]])
multi1 = MultiPolygon(allArray)

for polygon in multi1:
    plot_coords(ax, polygon.exterior) #ff3333
    patch = PolygonPatch(polygon, facecolor='#ff3333', \
                         edgecolor='#7b817f', alpha=0.1, zorder=2)    
    ax.add_patch(patch)
    
ax.set_title('98 historical periods in Pleiades (perturbed)')
#ax.set_title('a few events in WW II')
rangex = [-5, 3]
#rangex = [2.427, 2.436]

rangey = [-0.5, 1.5]
ax.set_xlim(*rangex)
ax.set_ylim(*rangey)
#ax.set_aspect(.001)
pyplot.show()
#ax.set_xticks(range(*xrange) + [xrange[-1]])
#ax.set_yticks(range(*yrange) + [yrange[-1]])


# 1: valid multi-polygon
#a = [(0, 0), (0, 1), (1, 1), (1, 0), (0, 0)]
#b = [(1, 1), (1, 2), (2, 2), (2, 1), (1, 1)]