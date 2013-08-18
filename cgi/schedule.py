def schedule():
	#load schedule
	f = open('schedule.txt', 'r')
	schedule = f.readlines()	

	#determine value
	
	#while 1:
	closest = 0
	closestTime = 0
	time = 750
	
	for i,element in enumerate(schedule):
		stime = int(element.split(',')[0])
		#print element
		if (time > stime and stime > closestTime):
			#print i
			closestTime = stime
			closest = i
		#foreach schedule as element:
			#closest = now 
	
	return schedule[closest]



entry = schedule()

pH = entry.split(',')[2]
print "Set pH to:" + pH
