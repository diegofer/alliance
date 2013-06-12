from django.conf.urls import patterns, include, url

from tastypie.api import Api
from modulos.db.api import RegionResource, IglesiaResource

region_resource = RegionResource()
iglesia_resource = IglesiaResource()


v1_api = Api(api_name='v1')
v1_api.register(IglesiaResource())
v1_api.register(RegionResource())


urlpatterns = patterns('',
    url(r'^', include(v1_api.urls)),
)