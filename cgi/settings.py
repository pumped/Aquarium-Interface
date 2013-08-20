import ConfigParser


class Settings:

    def __init__(self):
        self.config = ConfigParser.RawConfigParser()
        self.config.read('settings.cfg')

    def create(self):
        self.config.add_section('Email')
        self.config.add_section('Schedules')
        self.config.add_section('Schedule')

    def save(self):
        # Writing our configuration file to 'example.cfg'
        with open('settings.cfg', 'wb') as configfile:
            self.config.write(configfile)

    def addEmail(self,address):
        self.config.set('Email',address,address)

    def deleteEmail(self,address):
        self.config.remove_option('Email',address)

    def getEmails(self):
        return self.config.items('Email')



    def setSchedule(self,name,schedule):
        self.config.set('Schedule','current',schedule)
        self.config.set('Schedule','name',name)

    def getSchedule(self):
        current = self.config.get('Schedule','current')
        name = self.config.get('Schedule','name')
        return [name,current]



    def addSchedule(self,name,schedule):
        self.config.set('Schedules',name,schedule)

    def deleteSchedule(self,name):
        self.config.remove_option('Schedules',name)
        
    def getSchedules(self):
        return self.config.items('Schedules')