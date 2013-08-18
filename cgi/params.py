#!/usr/bin/env python

import cgi
import cgitb; cgitb.enable()  # for troubleshooting

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
	else:
		print 'unknown type'

def addSchedule(name, schedule):
	if (schedule == ''):
		#delete it
		pass
	else:
		schedule = open('schedules/'+name+'.csv', 'w')
		schedule.write(schedule)
		schedule.close()


def setEmail(email, add=True):
	if add:
		logfile = open('email.txt', 'r')
		loglist = logfile.readlines()
		logfile.close()
		found = False
		for line in loglist:
		    if str(email) in line:
        		found = True

		if not found:
		    logfile = open('email.txt', 'a')
		    logfile.write(email+"\n")
		    logfile.close()



test()
listSchedules()
