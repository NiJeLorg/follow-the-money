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
    url(r'^$', views.index, name='index'),
    # admin urls
    url(r'^admin/', include(admin.site.urls)),
    # override registration form to add new teachers
    url(r'accounts/register/$', 
        RegistrationView.as_view(form_class = ExRegistrationForm), 
        name = 'registration_register'),
    # add new team
    url(r'accounts/register/team/$', views.createTeam, name = 'createTeam'),
    # registration urls
    url(r'^accounts/', include('registration.backends.default.urls')),
    # account profile url
    url(r'^accounts/profile/$', views.accountProfile, name='accountProfile'),
    # team profile url
    url(r'^accounts/profile/teams/$', views.teams, name='teams'),
    # account profile urls
    url(r'^accounts/profile/', views.accountProfile, name='accountProfile'),
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
