# add urls for the follow_the_money app here
from django.conf.urls import patterns, url

from follow_the_money import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^map/nav/$', views.mapNavigation, name='map_nav'),
    url(r'^media/form/image/$', views.mediaFormImage, name='mediaFormImage'),
    url(r'^media/$', views.media, name='media'),
)

