# -*- coding: utf-8 -*-
from django.conf import settings
from django.db import models

from modulos.django_google_maps import fields as map_fields



class Region(models.Model):
    nombre    = models.CharField(max_length=40, unique=True)
    user      = models.OneToOneField(settings.AUTH_USER_MODEL, verbose_name='usuario')#
    path      = map_fields.PathField(verbose_name='Mapa')
    center    = map_fields.GeoLocationField(max_length=100, verbose_name='centro') 
    zoom      = models.CharField(max_length=3) 
    iglesias  = models.IntegerField(default=0)  
    
    def __unicode__(self):
        return self.nombre


class Iglesia(models.Model):
	sede        = models.CharField(max_length=100, help_text='Slogan o Alias de la Iglesia')
	user        = models.OneToOneField(settings.AUTH_USER_MODEL, verbose_name='usuario')
	region      = models.ForeignKey(Region)
	codigo      = models.CharField(max_length=4, unique=True)	
	proposito   = models.TextField(blank=True, help_text='Declaración de propósito')
	tel         = models.CharField(max_length=100, blank=True)
	web         = models.CharField(max_length=200, blank=True, help_text='Página web propia o de facebook u otra similar')
	address     = map_fields.AddressField(max_length=200, verbose_name='dirección', help_text='ej. Calle 7 # 11-46, Zarzal - Valle del Cauca, Colombia')
	geolocation = map_fields.GeoLocationField(max_length=100, verbose_name='geolocación') 
	zoom        = models.CharField(max_length=3)
	ciudad      = models.CharField(max_length=30)
	depto       = models.CharField(max_length=30) 


	
	def __unicode__(self):
		return  'Sede %s - %s' %(self.codigo, self.ciudad )	

	# def ciudad(self):
	# 	array = self.address.split(',')
	# 	for s in array:
	# 		if '#' not in s:
	# 			return s
	