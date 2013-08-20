#!/usr/bin/env python

import cgi, os
import cgitb; cgitb.enable()
from settings import Settings

def cgiFieldStorageToDict(fieldStorage):
   """Get a plain dictionary, rather than the '.value' system used by the cgi module."""
   params = {}
   for key in fieldStorage.keys():
      params[ key ] = fieldStorage[ key ].value
   return params


form = cgi.FieldStorage()
f = cgiFieldStorageToDict(form)
cfg = Settings()

# Get filename here.
fileitem = form['filename']
fname = f['title']

# Test if the file was uploaded
if fileitem.filename:
    # strip leading path from file name to avoid
    # directory traversal attacks
    fn = os.path.basename(fileitem.filename)
    path = '/var/www/schedule/' + fname + '.csv'
    open(path, 'wb').write(fileitem.file.read())

    cfg.addSchedule(fname, path)
    cfg.save()
    message = 'The file "' + fn + '" was uploaded successfully'

else:
    message = 'No file was uploaded'

print """\
Content-Type: text/html\n
<html>
<head>
<meta http-equiv='refresh' content='5; url=/settings.html'>
</head>
<body>
   <p>%s</p>
</body>
</html>
""" % (message,)
