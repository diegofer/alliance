# -*- coding: utf-8 -*-

from django.contrib import admin
from django.contrib.auth import get_user_model

from modulos.django_google_maps import widgets as map_widgets
from modulos.django_google_maps import fields as map_fields

from modulos.db.models import Region, Iglesia
from modulos.usuarios.models import Usuario

from django.core.exceptions import ValidationError

from django.core import urlresolvers


class RegionAdmin(admin.ModelAdmin):

	formfield_overrides = {
	  map_fields.PathField: {'widget': map_widgets.GoogleMapsAddressPathWidget},    
	}

	def formfield_for_foreignkey(self, db_field, request, **kwargs):
		if db_field.name == "user":
			Usuarios = get_user_model()
			kwargs["queryset"] = Usuarios.objects.filter(user_padre=request.user.id)
		return super(RegionAdmin, self).formfield_for_foreignkey(db_field, request, **kwargs)

	def save_model(self, request, obj, form, change):
		if change:
			obj.save()

		elif request.user.ambito == Usuario.NACIONAL: # valido que el superusuario no pueda crear regiones
			obj.save()
			Usuarios = get_user_model()
			Usuarios.objects.filter(id=obj.user_id).update(is_active=True) # activo el usuario solo cuando tiene una region asociada
		else:
			msg = "El usuario %s no puede crear Regiones, solo puede editarlas" %(request.user)
			self.message_user(request, msg)


class IglesiaAdmin(admin.ModelAdmin):

	formfield_overrides = {
	  map_fields.AddressField: {'widget': map_widgets.GoogleMapsAddressWidget},     
	}

	list_display = ('codigo', 'ciudad', 'sede', 'user', 'address')	
	search_fields = ('codigo', 'sede', 'address')
	list_filter = ('depto',)

	fieldsets = (
		( None, {'fields': ('codigo', ('sede', 'user'), 'region')} ),
		( 'Ubicación Geográfica', {'fields': ( 'address', ('geolocation', 'zoom'), ('ciudad', 'depto') ) } ),
		( 'Información Adicional', {'fields': ( 'proposito', ('tel', 'web') ) } ),
	)

	readonly_fields = ('region',)



	def formfield_for_foreignkey(self, db_field, request, **kwargs):
		if db_field.name == "user":
			Usuarios = get_user_model()
			if request.user.is_superuser:
				kwargs["queryset"] = Usuarios.objects.filter()
			else:	
				kwargs["queryset"] = Usuarios.objects.filter(user_padre=request.user.id)
		return super(IglesiaAdmin, self).formfield_for_foreignkey(db_field, request, **kwargs)



	def save_model(self, request, obj, form, change):
		if change:
			obj.save()

			

		elif request.user.ambito == Usuario.REGIONAL:
			region = Region.objects.get(user_id=request.user.id) # la region existe porque el usuario Regional no puede entrar si no tiene una region asociada
			obj.region = region
			obj.save()

			Usuarios = get_user_model()
			Usuarios.objects.filter(id=obj.user_id).update(is_active=True) # activo el usuario solo cuando tiene una IGLESIA asociada

			# Despues de crear la iglesia le digo a la region el numero de iglesias (activas) que tiene			
			numIglesias = Iglesia.objects.filter(region_id=region).count() # Obtengo la cantidad exacta de iglesias que 
			region.iglesias = numIglesias   # += 1  con esto me evito la consulta anterior pero es menos seguro y no permite evaluar iglesas desactivadas
			region.save(update_fields=['iglesias'])
			#print 'Region: %s tiene %s iglesias' %(region.nombre, numIglesias)

	# Limitar iglesias que puede ver el usuario
	def queryset(self, request): 
		qs = super(IglesiaAdmin, self).queryset(request) #pido todas las iglesias
		if request.user.is_superuser:     # si el usuario es el superadmin
			return qs # le doy todo
		try:
			region = Region.objects.get(user_id=request.user.id)  # obtengo la region asociada al usuario
		except Region.DoesNotExist:
			return qs.filter(region_id=0)#super(IglesiaAdmin, self)
		else:
			return qs.filter(region_id=region) # le doy al usuario solo las iglesias hijas de su region asociada

admin.site.register(Region, RegionAdmin)
admin.site.register(Iglesia, IglesiaAdmin)