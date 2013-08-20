#!/usr/bin/env python

from datetime import datetime, timedelta
import time
import cgi
import cgitb; cgitb.enable()  # for troubleshooting
from os import listdir
from os.path import isfile, join


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
		dataSet = getAll()
	
	#assemble data
	output = []  
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
					output.append(line.replace("\n", ""))
		except:
			pass

	output = merge(output)
	for l in output:
		print l
	
def merge(base):
	lowest,highest = getLimit()
	if (lowest != base[1]):
		base.insert(1,lowest)
	if (highest != base[-1]):
		base.append(highest)
	return base

def getLimit():
	files = getAll()
	filee = getAll('10_sec')
	
	#get first reading
	f = open('/var/www/data/hour/' + getFileName(files[0][1]) + '.csv','r')
	f.readline()
	first = f.readline()
	f.close()
	
	#get last
	with open('/var/www/data/10_sec/' + getFileName(filee[-1][1]) + '.csv','r') as f:
		f.seek (0, 2)		   # Seek @ EOF
		fsize = f.tell()		# Get Size
		f.seek (max (fsize-1024, 0), 0) # Set pos @ last n chars
		lines = f.readlines()	   # Read to end
	last = lines[-1]
	return [first.replace("\n",''),last.replace("\n",'')]
		
def getFileName(item):
	return str(int(time.mktime(item.timetuple()))) + '000'

def getAll(folder="hour"):
	#scan week folder and stream output
	mypath = '/var/www/data/'+folder+'/'
	onlyfiles = [ f for f in listdir(mypath) if isfile(join(mypath,f)) ]
	onlyfiles = sorted(onlyfiles)
	
	data = []
	for f in onlyfiles:
		temp = []
		temp.append(folder)
		name = datetime.fromtimestamp(int(f.split('.csv')[0])/1000)
		temp.append(name)
		data.append(temp)
		
	return data

def getDayData(start, end):
	data = []
	
	#get midnight before start
	sTime = start.replace(hour=0, minute=0, second=0)
		
	#get midnight of last day
	eTime = end.replace(hour=0, minute=0, second=0)
	
	iTime = sTime
	
	while iTime <= eTime:
		temp = []
		temp.append('10_min')
		temp.append(iTime)
		data.append(temp)
		iTime = iTime + timedelta(days=1)
		
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
		temp = []
		temp.append('10_sec')
		temp.append(iTime)
		data.append(temp)
		iTime = iTime + timedelta(hours=1)
		
	return data
	
f = cgiFieldStorageToDict(cgi.FieldStorage())

dataRange(f['start'], f['end'])
#dataRange(1376611853,1376784653)
