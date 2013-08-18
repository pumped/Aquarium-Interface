#!/usr/bin/env python

from datetime import datetime, timedelta
import time
import cgi
import cgitb; cgitb.enable()  # for troubleshooting

#10s every 1hr
#10min every day
#1hr every week

print "Content-type: text/html"
print

def cgiFieldStorageToDict(fieldStorage):
   """Get a plain dictionary, rather than the '.value' system used by the cgi module."""
   params = {}
   for key in fieldStorage.keys():
	  params[ key ] = fieldStorage[ key ].value
   return params


def dataRange(start, end):
	s = datetime.fromtimestamp(int(start))
	e = datetime.fromtimestamp(int(end))
		
	#get Total range
	diff = e - s
	range = diff.total_seconds() / 60 / 60
	
	if range <= 5: #use 10s data
		dataSet = getHourData(s, e)
	elif range <= 48: #use 10m data
		dataSet = getDayData(s, e)
	else:   #use 1hr data
		dataSet = getWeekData(s, e)
	
	#assemble data  
	first = True
	for ts in dataSet:
		name = getFileName(ts[1])
		#print "required: " + name + ".csv"
		
		try:
			with open('/var/www/data/' + ts[0] + '/' + name + '.csv', 'r') as f:
				if not first:
					next(f)
				else:
					first = False
				for line in f:
					print line.replace("\n", "")
		except:
			pass
		
def getFileName(item):
	return str(int(time.mktime(item.timetuple()))) + '000'

def getAll():
	#scan week folder and stream output
	pass

def getDayData(start, end):
	data = []
	
	#get midnight before start
	sTime = start.replace(hour=0, minute=0, second=0)
		
	#get midnight of last day
	eTime = end.replace(hour=0, minute=0, second=0)
	
	iTime = sTime
	
	while iTime <= eTime:
		iTime = iTime + timedelta(days=1)
    	temp = []
    	temp.append('10_min')
    	temp.append(iTime)
    	data.append(temp)
		
	return data

def getWeekData(start, end):
	pass

def getHourData(start, end):
	data = []
	
	#get midnight before start
	sTime = start.replace(minute=0, second=0)
		
	#get midnight of last day
	eTime = end.replace(minute=0, second=0)
	
	iTime = sTime
	
	while iTime <= eTime:
		iTime = iTime + timedelta(hours=1)
	    temp = []
        temp.append('10_sec')
	    temp.append(iTime)
		data.append(temp)
		
	return data
	
f = cgiFieldStorageToDict(cgi.FieldStorage())

dataRange(f['start'], f['end'])
#dataRange(1376611853,1376784653)
