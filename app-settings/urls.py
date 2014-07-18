from django.conf.urls import patterns, include, url


from django.contrib.staticfiles.urls import staticfiles_urlpatterns

#uncomment testing - contact
import contacts.views

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # follow_the_money app urls,
    url(r'^follow-the-money/', include('follow_the_money.urls')),
    # uncomment these - for contacts testing
    url(r'^$', contacts.views.ListContactView.as_view(),
        name='contacts-list',),
    url(r'^new$', contacts.views.CreateContactView.as_view(),
        name='contacts-new',),
    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)

urlpatterns += staticfiles_urlpatterns()

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

#urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'follow_money.views.home', name='home'),
    # url(r'^follow_money/', include('follow_money.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
#)
