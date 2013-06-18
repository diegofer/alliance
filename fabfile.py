#!/usr/bin/env python
from fabric.api import * 
from fabric.contrib.console import confirm
from fabric.colors import green, red 

import os
import re

RUTA_PROYECTO = os.path.join(os.path.dirname(os.path.abspath(__file__)))
#env.hosts = ['localhost', 'alianza@web348.webfaction.com']


def servidor_local():
	env.hosts = ['localhost']


def init():
	
	initSentry()
	initAlliance()


def alistar_actualiacion():
	versionar_home()



def actualizar_stage():
	with cd('/var/www/alliance'):
		run('git pull')
		with prefix('workon alliance'):
			run('./manage.py collectstatic')

	# Reiniciar apache
	sudo("/etc/init.d/apache2 restart")


# Git 
def commit():
	local("git add -p && git commit")

def status():
	with cd('/var/www/alliance'):
		run('git status')
def pull():
	with cd('/var/www/alliance'):
		run('git pull')

def revisar():
	with local('workon alliance'):
		local('./manage.py validate')



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


# VERSIONAR
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
