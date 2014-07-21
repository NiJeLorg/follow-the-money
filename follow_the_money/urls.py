# add urls for the follow_the_money app here
from django.conf.urls import patterns, url

from follow_the_money import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^map/nav/$', views.mapNavigation, name='mav_nav'),
)
