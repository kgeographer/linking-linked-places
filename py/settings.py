# settings.py
# create a local_settings.py file for private paths
# basedir and wd (working dir)

try:
   from local_settings import *
except ImportError as e:
   pass

