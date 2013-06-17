from fabric.api import * 
from fabric.colors import green, red 

import os
import re

RUTA_PROYECTO = os.path.join(os.path.dirname(os.path.abspath(__file__)))




def init():
	
	initSentry()
	initAlliance()
	#versionar_html()
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


def versionar_home():
	plantilla = os.path.join(RUTA_PROYECTO, 'main/templates/main/home.html')
	print plantilla
	lineas_actualizadas = []
	#abro el home actual
	with open(plantilla) as archivo:
		for linea in archivo:
			if 'urlArgs' not in linea:
				lineas_actualizadas.append(linea)
			else:
				version_atual = re.search(r"\d+", linea).group(0) # Extraer el numero con exprexion regular 
				version_nueva = int(version_atual) + 1     # sumarle 1 la version actual
				linea_actualizada = linea.replace(version_atual, str(version_nueva)) 
				lineas_actualizadas.append(linea_actualizada)

	archivo_actualizado = open(plantilla, 'w')
	archivo_actualizado.writelines(lineas_actualizadas)
	archivo_actualizado.close()




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