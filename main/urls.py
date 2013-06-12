from django.conf.urls import patterns, include, url


urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'main.views.home', name='home'),
    url(r'^logout/$', 'main.views.hacer_logout', name='hacer_logout'),
    
)