# -*- coding: utf-8 -*-
from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import AuthenticationForm #, UserCreationForm
from django.conf import settings

from modulos.usuarios.models import Usuario
from modulos.db.models import Iglesia

def home(request):
	ctx = {}
	msg = ''
	
	if request.user.is_authenticated():

		if request.user.ambito == Usuario.TOTAL:
			msg = "El usuario tiene un ambito total"
			ctx = {'msg':msg}

		elif request.user.ambito == Usuario.NACIONAL:
			msg = "El usuario tiene un ambito nacional"
			ctx = {'msg':msg}

		elif request.user.ambito == Usuario.REGIONAL:
			msg = "El usuario tiene un ambito regional"
			ctx = {'msg':msg}

		elif request.user.ambito == Usuario.LOCAL:
			try:
				iglesia = Iglesia.objects.get(user_id = request.user.id)
			except Iglesia.DoesNotExist:
				msg = "Error: El usuario no tiene una Iglesia Asociada. Comuníquese con el administrador %s" %(Usuario.REGIONAL)
				logout(request)
				ctx = {'form':AuthenticationForm(), 'msg':msg}
				return render_to_response('main/login.html', ctx, context_instance=RequestContext(request))
			else:
				ctx = {'iglesia': iglesia, 'debug':settings.DEBUG}


		return render_to_response('main/home.html', ctx, context_instance=RequestContext(request))

	elif request.method == "POST":
		username = request.POST['username']
		password = request.POST['password']	
		user = authenticate(username=username, password=password)

		if user is not None:
			if user.is_active:
				login(request, user)
				return HttpResponseRedirect('/')
			else:
				msg = "Lo sentimos, su cuenta esta desactivada, Comuníquese con el administrador"
		else:
			msg = "usuario y/o password incorrecto"

	ctx = {'form':AuthenticationForm(), 'msg':msg}
	return render_to_response('main/login.html', ctx, context_instance=RequestContext(request))

def hacer_logout(request):
    logout(request)
    return HttpResponseRedirect('/')