from datetime import datetime, timedelta
import time
#10s every 1hr
#10min every day
#1hr every week

def dataRange(start, end):
    s = datetime.fromtimestamp(int(start))
    e = datetime.fromtimestamp(int(end))
        
    #get Total range
    diff = e-s
    range = diff.total_seconds() /60/60
    
    if range <= 5: #use 10s data
        dataSet = getHourData(s, e)
    elif range <= 48: #use 10m data
        dataSet = getDayData(s, e)
    else:   #use 1hr data
        dataSet = getWeekData(s, e)
    
    #assemble data  
    for ts in dataSet:
        name = getFileName(ts)
        print "required: " + name + ".csv"
        #f = open(name+'.csv')
        
        
def getFileName(item):
    return str(int(time.mktime(item.timetuple())))+'000'

def getAll():
    #scan week folder and stream output
    pass

def getDayData(start, end):
    data = []
    
    #get midnight before start
    sTime = start.replace(hour=0,minute=0,second=0)
        
    #get midnight of last day
    eTime = end.replace(hour=0,minute=0,second=0)
    
    iTime = sTime
    
    while iTime <= eTime:
        iTime = iTime + timedelta(days = 1)
        data.append(iTime)
        
    return data

def getWeekData(start, end):
    pass

def getHourData(start, end):
    data = []
    
    #get midnight before start
    sTime = start.replace(minute=0,second=0)
        
    #get midnight of last day
    eTime = end.replace(minute=0,second=0)
    
    iTime = sTime
    
    while iTime <= eTime:
        iTime = iTime + timedelta(hours = 1)
        data.append(iTime)
        
    return data
    
    
dataRange(1376611853,1376784653)