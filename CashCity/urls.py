# add urls for the CashCity app here
from django.conf.urls import patterns, url
from django.conf import settings

from CashCity import views

urlpatterns = patterns('',
    #map urls
    url(r'^$', views.index, name='index'),
    url(r'^map/nav/$', views.mapNavigation, name='map_nav'),
    # media form urls
    url(r'^media/form/image/', views.mediaFormImage, name='mediaFormImage'),
    url(r'^media/form/audio/', views.mediaFormAudio, name='mediaFormAudio'),
    url(r'^media/form/note/', views.mediaFormNote, name='mediaFormNote'),
    url(r'^media/form/interview/', views.mediaFormInterview, name='mediaFormInterview'),
    # media single pages
    url(r'^media/image/(?P<id>\d+)/$', views.mediaPageImage, name='mediaPageImage'), 
    url(r'^media/audio/(?P<id>\d+)/$', views.mediaPageAudio, name='mediaPageAudio'), 
    url(r'^media/note/(?P<id>\d+)/$', views.mediaPageNote, name='mediaPageNote'), 
    url(r'^media/interview/(?P<id>\d+)/$', views.mediaPageInterview, name='mediaPageInterview'), 
    # media filter
    url(r'^media/filter/$', views.filterMedia, name='filterMedia'),    
    url(r'^media/', views.media, name='media'),   
	url(r'^savemap/$',views.SaveMap, name='savemap'),
)

