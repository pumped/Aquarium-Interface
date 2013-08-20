from settings import Settings
import httplib,urllib
from datetime import datetime

def schedule():

        #get schedule
        name,path = cfg.getSchedule()

        #load schedule
        f = open(path, 'r')
        schedule = f.readlines()

        #determine value
        closest = 0
        closestTime = 0
        d = datetime.now()
        time = d.strftime('%H%M')
        print time

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


cfg = Settings()
entry = schedule()

pH = entry.split(',')[2]
if pH:
        params = str(pH)
        headers = {"Content-type": "application/x-www-form-urlencoded","Accept": "text/plain"}
        conn = httplib.HTTPConnection("localhost",80)
        conn.request("POST", "/aquarium/ph/set/Point", params, headers)
        res = conn.getresponse()
        print res.status, res.reason

        print "Set pH to:" + pH
