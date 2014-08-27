from django.conf.urls import patterns, include, url
from follow_the_money import views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
# override django-registration registration form
from follow_the_money.forms import ExRegistrationForm
from registration.backends.default.views import RegistrationView

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # admin urls
    url(r'^admin/', include(admin.site.urls)),
    # override registration form
    url(r'accounts/register/$', 
        RegistrationView.as_view(form_class = ExRegistrationForm), 
        name = 'registration_register'),
    # registration urls
    url(r'^accounts/', include('registration.backends.default.urls')),
    # account profile urls
    url(r'^accounts/profile/', views.accountProfile, name='accountProfile'),
    # follow_the_money app urls,
    url(r'^follow-the-money/', include('follow_the_money.urls')),
    # Uncomment the next line to enable the admin:
)

urlpatterns += staticfiles_urlpatterns()
