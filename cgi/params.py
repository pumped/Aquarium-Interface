#!/usr/bin/env python

import cgi
import cgitb; cgitb.enable()  # for troubleshooting
from settings import Settings

print "Content-type: text/html"
print

def cgiFieldStorageToDict(fieldStorage):
   """Get a plain dictionary, rather than the '.value' system used by the cgi module."""
   params = {}
   for key in fieldStorage.keys():
      params[ key ] = fieldStorage[ key ].value
   return params

def test():
    print 'Running'

def listSchedules():
    form = cgi.FieldStorage()
    formDict = cgiFieldStorageToDict(form)    

    if ('type' not in formDict):
        print 'Invalid form'
        return 0
    
    type = formDict['type']
    
    if (type == 'notification'):
        delete = False
        if ('delete' in formDict):
            delete = True
        setEmail(formDict['inputEmail'], delete);
    elif (type == 'turningp'):
        pass
    elif (type == 'schedule'):
        addSchedule(formDict['name'], formDict['schedule'])
    elif (type == 'settings'):
        settingsFile()
    elif (type == 'setSched'):
        setSchedule(formDict['name'])
    else:
        print 'unknown type'

def settingsFile():
    temp = []
    for key,val in cfg.getEmails():
        temp.append(val)
    email = ",".join(temp)
    print 'Email:' + email
    
    temp = []
    for key,val in cfg.getSchedules():
        temp.append(val+'|'+key)
    schedules = ",".join(temp)
    print 'Schedules:' + schedules
    
    schedule = cfg.getSchedule()
    print 'Schedule:' + schedule[0] + ',' + schedule[1]

def addSchedule(name, schedule):
    if (schedule == ''):
        #delete it
        pass
    else:
        schedule = open('schedules/' + name + '.csv', 'w')
        schedule.write(schedule)
        cfg.addSchedule(name, schedule)
        schedule.close()

def setSchedule(name):
    cfg.setScheduleByName(name)

def setEmail(email, add=True):
    if add:
        cfg.addEmail(email)
    else:
        cfg.deleteEmail(email)


cfg = Settings()
listSchedules()
cfg.save()
