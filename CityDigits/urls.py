from django.conf import settings
from django.conf.urls import patterns, include, url
from CashCity import views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
# override django-registration registration form
from CashCity.forms import ExRegistrationForm
from registration.backends.default.views import RegistrationView

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # tagging autocomplete
    url(r'^taggit_autocomplete/', include('taggit_autocomplete.urls')),
    # admin urls
    url(r'^admin/', include(admin.site.urls)),
    # redirect to index
    url(r'^$', views.redirectToIndex, name='index'),
    # override registration form to add new teachers
    url(r'accounts/register/$', 
        RegistrationView.as_view(form_class = ExRegistrationForm), 
        name = 'registration_register'),
    # add new team
    url(r'accounts/register/team/$', views.createTeam, name = 'createTeam'),
    # edit team
    url(r'accounts/edit/team/(?P<id>\d+)/$', views.createTeam, name = 'editTeam'),
    # remove team
    url(r'accounts/remove/team/(?P<id>\d+)/$', views.removeTeam, name = 'removeTeam'),
    # registration urls
    url(r'^accounts/', include('registration.backends.default.urls')),
    # teacher account profile url
    url(r'^accounts/profile/$', views.accountProfile, name='accountProfile'),
    # teams in teacher profile url
    url(r'^accounts/profile/teams/$', views.teams, name='teams'),
    # media in teacher profile filter
    url(r'^accounts/profile/media/filter/$', views.accountFilterMedia, name='accountFilterMedia'),    
    # media in teacher profile url
    url(r'^accounts/profile/media/', views.accountMedia, name='accountMedia'),
    # opinions in teacher profile filter
    url(r'^accounts/profile/opinion/filter/$', views.accountFilterOpinion, name='accountFilterOpinion'),    
    # opinions in teacher profile url
    url(r'^accounts/profile/opinion/$', views.accountOpinion, name='accountOpinion'),
    # media in student profile filter
    url(r'^accounts/profile/student/media/filter/$', views.studentFilterMedia, name='studentFilterMedia'),    
    # student account media profile urls
    url(r'^accounts/profile/student/media/$', views.studentProfileMedia, name='studentProfileMedia'),
    # student account opinion profile urls
    url(r'^accounts/profile/student/opinion/$', views.studentProfileOpinion, name='studentProfileOpinion'),
    # CashCity app urls,
    url(r'^cashcity/', include('CashCity.urls')),
    # Uncomment the next line to enable the admin:    
)

urlpatterns += staticfiles_urlpatterns()

if settings.DEBUG:
    urlpatterns += patterns(
        'django.views.static',
        (r'media/(?P<path>.*)',
        'serve',
        {'document_root': settings.MEDIA_ROOT}), )
