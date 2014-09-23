# add urls for the CashCity app here
from django.conf.urls import patterns, url
from django.conf import settings

from CashCity import views

urlpatterns = patterns('',
    #map urls
    url(r'^$', views.index, name='index'),
    # media form urls
    url(r'^media/form/image/', views.mediaFormImage, name='mediaFormImage'),
    url(r'^media/form/audio/', views.mediaFormAudio, name='mediaFormAudio'),
    url(r'^media/form/note/', views.mediaFormNote, name='mediaFormNote'),
    url(r'^media/form/interview/', views.mediaFormInterview, name='mediaFormInterview'),
    # media edit forms
    url(r'media/form/edit/image/(?P<id>\d+)/$', views.mediaFormImage, name = 'mediaFormImageEdit'),
    url(r'media/form/edit/audio/(?P<id>\d+)/$', views.mediaFormAudio, name = 'mediaFormAudioEdit'),
    url(r'media/form/edit/note/(?P<id>\d+)/$', views.mediaFormNote, name = 'mediaFormNoteEdit'),
    url(r'media/form/edit/interview/(?P<id>\d+)/$', views.mediaFormInterview, name = 'mediaFormInterviewEdit'),
    #media remove forms
    url(r'media/form/remove/image/(?P<id>\d+)/$', views.mediaFormImageRemove, name = 'mediaFormImageRemove'),
    url(r'media/form/remove/audio/(?P<id>\d+)/$', views.mediaFormAudioRemove, name = 'mediaFormAudioRemove'),
    url(r'media/form/remove/note/(?P<id>\d+)/$', views.mediaFormNoteRemove, name = 'mediaFormNoteRemove'),
    url(r'media/form/remove/interview/(?P<id>\d+)/$', views.mediaFormInterviewRemove, name = 'mediaFormInterviewRemove'),
    #media saveDraft
    url(r'media/saveDraft/image/(?P<id>\d+)/$', views.mediaImageSaveDraft, name = 'mediaImageSaveDraft'),
    url(r'media/saveDraft/audio/(?P<id>\d+)/$', views.mediaAudioSaveDraft, name = 'mediaAudioSaveDraft'),
    url(r'media/saveDraft/note/(?P<id>\d+)/$', views.mediaNoteSaveDraft, name = 'mediaNoteSaveDraft'),
    url(r'media/saveDraft/interview/(?P<id>\d+)/$', views.mediaInterviewSaveDraft, name = 'mediaInterviewSaveDraft'),
    #media publish
    url(r'media/publish/image/(?P<id>\d+)/$', views.mediaImagePublish, name = 'mediaImagePublish'),
    url(r'media/publish/audio/(?P<id>\d+)/$', views.mediaAudioPublish, name = 'mediaAudioPublish'),
    url(r'media/publish/note/(?P<id>\d+)/$', views.mediaNotePublish, name = 'mediaNotePublish'),
    url(r'media/publish/interview/(?P<id>\d+)/$', views.mediaInterviewPublish, name = 'mediaInterviewPublish'),
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

