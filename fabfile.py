from fabric.api import * 
from fabric.colors import green, red 



def django_manage(command='help', virtualenv='alliance'):
	return "/bin/bash -l -c 'source /usr/local/bin/virtualenvwrapper.sh && workon " + virtualenv + " && " + command + "'"



def initSentry():
	with lcd("/host/dev/django/sentry"):
		local(django_manage("sentry --config=conf.py start", "sentry")+" &")
		#local('xdg-open http://0.0.0.0:9000/')

def initAlliance():
	with lcd("/host/dev/django/alliance"):
		local(django_manage("./manage.py runserver"))
		#local('xdg-open http://127.0.0.1:8000/')



def init():
	
	initSentry()
	initAlliance()
	# initAlliance()

	#local(django_manage("./manage.py runserver", "alliance"))
	# with prefix('WORKON_HOME=$HOME/.virtualenvs'):
	# 	with prefix('source /usr/local/bin/virtualenvwrapper.sh'):
	# 		with prefix('workon myenv'): # Assuming there is a env called `myenv`
	# 			run('pip freeze')

	#local('sudo ~/virtualenvs/alliance/bin/activate')
	# with lcd('/host/dev/django/alliance'), prefix('workon alliance'):
	# 	local('./manage.py runserver')
		#local('./manage.py loaddata myfixture')
	# env.hosts = ['localhost']
	# run("workon")
	#with cd('/host/dev/django/alliance'):
	#local('/usr/local/bin/virtualenvwrapper.sh && workon alliance')
	#local("./manage.py runserver")


