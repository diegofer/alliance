from fabric.api import * 
from fabric.contrib.console import confirm
from fabric.colors import green, red 

import os
import re

RUTA_PROYECTO = os.path.join(os.path.dirname(os.path.abspath(__file__)))
#env.hosts = ['localhost', 'alianza@web348.webfaction.com']


####################################################
##              SERVIDOR DE DESAROLLO             ##
####################################################

# inicia el servidor de django y sentry y abre el navegador
def init_local():
	initSentry()
	initAlliance()

def consolidar_local():
	test()
	compilar_app_backbone()


### UTILES ###
def compilar_app_backbone():
	with lcd('main/static/main/app/build'):
		local('node r.js -o app.build.js')
	
	versionar_home()

# Git 
def commit():
	local("git add -p && git commit")

# Django
def test():
	local(django_manage('./manage.py test'))

def initSentry():
	with lcd("/host/dev/django/sentry"):
		local(django_manage("sentry --config=conf.py start", "sentry")+" &")
		#local('xdg-open http://0.0.0.0:9000/')

def initAlliance():
	with lcd("/host/dev/django/alliance"):
		local(django_manage("./manage.py runserver & xdg-open http://127.0.0.1:8000/"))
	
def django_manage(command='help', virtualenv='alliance'):
	return "/bin/bash -l -c 'source /usr/local/bin/virtualenvwrapper.sh && workon " + virtualenv + " && " + command + "'"





####################################################
##              SERVIDOR DE PRUEBA                ##
####################################################

@hosts('localhost')
def actualizar_stage():
	with cd('/var/www/alliance'):
		pull()
		with prefix('workon alliance'):
			run('./manage.py collectstatic')
	# Reiniciar apache
	restart_apache()




def status():
	with cd('/var/www/alliance'):
		run('git status')

def pull():
	run('git pull')

def git_log(loc=True):
	cmd = 'git log --oneline --graph --decorate'
	if loc: 
		local(cmd) 
	else: 
		run(cmd)	
		


####################################################
##              SERVIDOR DE PRODUCCION            ##
####################################################




####################################################
##              UTILES                            ##
####################################################

# Versiona la llamada al archivo main-buil de la aplicacion backbone
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

# Reiniciar apache
def restart_apache():
	sudo("/etc/init.d/apache2 restart")