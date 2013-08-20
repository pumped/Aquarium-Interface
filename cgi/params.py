#!/usr/bin/env python

import cgi
import cgitb; cgitb.enable()  # for troubleshooting
from settings import Settings

print "Content-type: text/html"
print

def cgiFieldStorageToDict( fieldStorage ):
   """Get a plain dictionary, rather than the '.value' system used by the cgi module."""
   params = {}
   for key in fieldStorage.keys():
      params[ key ] = fieldStorage[ key ].value
   return params

def test():
	print 'Running'

def listSchedules():
	print 'sched'
	form = cgi.FieldStorage()
	formDict = cgiFieldStorageToDict(form)	

	print formDict
	print "<br/>"

	if ('type' not in formDict):
		print 'Invalid form'
		return 0
	
	type = formDict['type']
	print formDict['type'] + "<br/>"
	
	if (type == 'notification'):
		setEmail(formDict['inputEmail'],True);
	elif (type == 'turningp'):
		pass
	elif (type == 'schedule'):
		addSchedule(formDict['name'],formDict['schedule'])
    elif (type == 'settings'):
        settingsFile()
	else:
		print 'unknown type'

def settingsFile():
    emails = ",".join(cfg.getEmails())
    print 'Email:' + email
    schedules = ",".join(cfg.getScheules())
    print 'Schedules:' + schedules
    schedule = getSchedule()
    print 'Schedule:' + schedule[0] + ',' + schedule[1]

def addSchedule(name, schedule):
	if (schedule == ''):
		#delete it
		pass
	else:
		schedule = open('schedules/'+name+'.csv', 'w')
		schedule.write(schedule)
        cfg.addSchedule(name,schedule)
		schedule.close()


def setEmail(email, add=True):
	if add:
		cfg.addEmail(email)
	else:
		cfg.deleteEmail(email)


cfg = Settings()
listSchedules()
cfg.save()
