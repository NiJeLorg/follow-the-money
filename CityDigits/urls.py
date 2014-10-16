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
    # CashCity app urls,
    url(r'^cashcity/', include('CashCity.urls')),
)

urlpatterns += staticfiles_urlpatterns()

if settings.DEBUG:
    urlpatterns += patterns(
        'django.views.static',
        (r'media/(?P<path>.*)',
        'serve',
        {'document_root': settings.MEDIA_ROOT}), )

