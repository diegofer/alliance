from tastypie import fields
from tastypie.resources import ModelResource, ALL, ALL_WITH_RELATIONS
from tastypie.authorization import DjangoAuthorization
from tastypie.authentication import SessionAuthentication

from django.conf import settings
from django.contrib.auth import get_user_model

from modulos.db.models import Iglesia, Region

Usuario = get_user_model()



class UsuarioResource(ModelResource):
    class Meta:
        allowed_methods = ['get', 'delete', 'post', 'put']
        detail_allowed_methods = ['get']
        queryset = Usuario.objects.all()
        
        resource_name = 'usuario'
        excludes = ['password', 'is_active', 'is_admin', 'is_superuser']
        # filtering = {
        #     'username': ALL,
        # }
      

class RegionResource(ModelResource):

    class Meta:
        always_return_data = True
        queryset = Region.objects.all()
        resource_name = 'region'
        authentication = SessionAuthentication()
            

class IglesiaResource(ModelResource):

    region = fields.ForeignKey(RegionResource, 'region')
    #user = fields.ForeignKey(UsuarioResource, 'user')

    class Meta:	
        always_return_data = True
        detail_allowed_methods = ['get']
        allowed_methods = ['get', 'delete', 'post', 'put']
        queryset = Iglesia.objects.all()
        resource_name = 'iglesia'
        # filtering = {
        #     'region': ALL_WITH_RELATIONS,
        # }
        authentication = SessionAuthentication()
        authorization =  DjangoAuthorization()
        limit = 0

        
		
		