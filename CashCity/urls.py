# add urls for the CashCity app here
from django.conf.urls import patterns, url

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
    url(r'^media/', views.media, name='media'),
)

