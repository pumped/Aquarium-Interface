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



    def setSchedule(self,schedule):
        self.config.set('Schedule','current',schedule)

    def getSchedule(self):
        return self.config.get('Schedule','current')



    def addSchedule(self,name,schedule):
        self.config.set('Schedules',name,schedule)

    def deleteSchedule(self,name):
        self.config.remove_option('Schedule',name)


cfg = Settings()
cfg.addEmail('dylanmathiesen@gmail.com')
cfg.setSchedule(None)

cfg.save()
