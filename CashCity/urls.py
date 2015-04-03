# add urls for the CashCity app here
from django.conf.urls import patterns, include, url
from django.conf import settings
# override django-registration registration form
from CashCity.forms import ExRegistrationForm
from registration.backends.default.views import RegistrationView

from CashCity import views

urlpatterns = patterns('',
    #map urls
    url(r'^$', views.index, name='index'),
    #map bookmarks
    url(r'^mapsnaps/(?P<id>\d+)/$', views.mapSnaps, name='mapSnaps'),
    # map filters
    url(r'^filterIndexImage/$', views.filterIndexImage, name='filterIndexImage'),    
    url(r'^filterIndexAudio/$', views.filterIndexAudio, name='filterIndexAudio'),    
    url(r'^filterIndexNote/$', views.filterIndexNote, name='filterIndexNote'),    
    url(r'^filterIndexInterview/$', views.filterIndexInterview, name='filterIndexInterview'),   
    # media form urls
    url(r'^media/form/image/', views.mediaFormImage, name='mediaFormImage'),
    url(r'^media/form/audio/', views.mediaFormAudio, name='mediaFormAudio'),
    url(r'^media/form/note/', views.mediaFormNote, name='mediaFormNote'),
    url(r'^media/form/interview/', views.mediaFormInterview, name='mediaFormInterview'),
    # media edit forms
    url(r'^media/form/edit/image/(?P<id>\d+)/$', views.mediaFormImage, name = 'mediaFormImageEdit'),
    url(r'^media/form/edit/audio/(?P<id>\d+)/$', views.mediaFormAudio, name = 'mediaFormAudioEdit'),
    url(r'^media/form/edit/note/(?P<id>\d+)/$', views.mediaFormNote, name = 'mediaFormNoteEdit'),
    url(r'^media/form/edit/interview/(?P<id>\d+)/$', views.mediaFormInterview, name = 'mediaFormInterviewEdit'),
    #media remove forms
    url(r'^media/form/remove/image/(?P<id>\d+)/$', views.mediaFormImageRemove, name = 'mediaFormImageRemove'),
    url(r'^media/form/remove/audio/(?P<id>\d+)/$', views.mediaFormAudioRemove, name = 'mediaFormAudioRemove'),
    url(r'^media/form/remove/note/(?P<id>\d+)/$', views.mediaFormNoteRemove, name = 'mediaFormNoteRemove'),
    url(r'^media/form/remove/interview/(?P<id>\d+)/$', views.mediaFormInterviewRemove, name = 'mediaFormInterviewRemove'),
    #media saveDraft
    url(r'^media/saveDraft/image/(?P<id>\d+)/$', views.mediaImageSaveDraft, name = 'mediaImageSaveDraft'),
    url(r'^media/saveDraft/audio/(?P<id>\d+)/$', views.mediaAudioSaveDraft, name = 'mediaAudioSaveDraft'),
    url(r'^media/saveDraft/note/(?P<id>\d+)/$', views.mediaNoteSaveDraft, name = 'mediaNoteSaveDraft'),
    url(r'^media/saveDraft/interview/(?P<id>\d+)/$', views.mediaInterviewSaveDraft, name = 'mediaInterviewSaveDraft'),
    #media publish
    url(r'^media/publish/image/(?P<id>\d+)/$', views.mediaImagePublish, name = 'mediaImagePublish'),
    url(r'^media/publish/audio/(?P<id>\d+)/$', views.mediaAudioPublish, name = 'mediaAudioPublish'),
    url(r'^media/publish/note/(?P<id>\d+)/$', views.mediaNotePublish, name = 'mediaNotePublish'),
    url(r'^media/publish/interview/(?P<id>\d+)/$', views.mediaInterviewPublish, name = 'mediaInterviewPublish'),
    #media share
    url(r'^media/share/image/(?P<id>\d+)/$', views.mediaImageShare, name = 'mediaImageShare'),
    url(r'^media/share/audio/(?P<id>\d+)/$', views.mediaAudioShare, name = 'mediaAudioShare'),
    url(r'^media/share/note/(?P<id>\d+)/$', views.mediaNoteShare, name = 'mediaNoteShare'),
    url(r'^media/share/interview/(?P<id>\d+)/$', views.mediaInterviewShare, name = 'mediaInterviewShare'),
    #media un-share
    url(r'^media/unshare/image/(?P<id>\d+)/$', views.mediaImageUnshare, name = 'mediaImageUnshare'),
    url(r'^media/unshare/audio/(?P<id>\d+)/$', views.mediaAudioUnshare, name = 'mediaAudioUnshare'),
    url(r'^media/unshare/note/(?P<id>\d+)/$', views.mediaNoteUnshare, name = 'mediaNoteUnshare'),
    url(r'^media/unshare/interview/(?P<id>\d+)/$', views.mediaInterviewUnshare, name = 'mediaInterviewUnshare'),
    # media single pages
    url(r'^media/image/(?P<id>\d+)/$', views.mediaPageImage, name='mediaPageImage'), 
    url(r'^media/audio/(?P<id>\d+)/$', views.mediaPageAudio, name='mediaPageAudio'), 
    url(r'^media/note/(?P<id>\d+)/$', views.mediaPageNote, name='mediaPageNote'), 
    url(r'^media/interview/(?P<id>\d+)/$', views.mediaPageInterview, name='mediaPageInterview'), 
    #media remove comments
    url(r'^media/form/remove/comment/image/(?P<id>\d+)/$', views.mediaFormCommentImageRemove, name = 'mediaFormCommentImageRemove'),
    url(r'^media/form/remove/comment/audio/(?P<id>\d+)/$', views.mediaFormCommentAudioRemove, name = 'mediaFormCommentAudioRemove'),
    url(r'^media/form/remove/comment/note/(?P<id>\d+)/$', views.mediaFormCommentNoteRemove, name = 'mediaFormCommentNoteRemove'),
    url(r'^media/form/remove/comment/interview/(?P<id>\d+)/$', views.mediaFormCommentInterviewRemove, name = 'mediaFormCommentInterviewRemove'),
    
    # media filter
    url(r'^media/filter/$', views.filterMedia, name='filterMedia'),    
    url(r'^media/', views.media, name='media'),
    # opinion remove comment
    url(r'^opinion/form/remove/comment/(?P<id>\d+)/$', views.opinionFormCommentRemove, name = 'opinionFormCommentRemove'),
    # opinion edit form
    url(r'^opinion/form/edit/(?P<id>\d+)/$', views.opinionForm, name = 'opinionFormEdit'),
    # opinion remove form
    url(r'^opinion/form/remove/(?P<id>\d+)/$', views.opinionFormRemove, name = 'opinionFormRemove'),
    # opinion saveDraft
    url(r'^opinion/saveDraft/(?P<id>\d+)/$', views.opinionSaveDraft, name = 'opinionSaveDraft'),
    # opinion publish
    url(r'^opinion/publish/(?P<id>\d+)/$', views.opinionPublish, name = 'opinionPublish'),
    # opinion form url
    url(r'^opinion/form/', views.opinionForm, name='opinionForm'),
    # opinion single page
    url(r'^opinion/(?P<id>\d+)/$', views.opinionPage, name='opinionPage'), 
    # opinion filter
    url(r'^opinion/filter/$', views.filterOpinions, name='filterOpinions'),    
    url(r'^opinion/', views.opinion, name='opinion'),
    # save map snaps   
	url(r'^savemap/$',views.SaveMap, name='savemap'),
    # remove map snaps   
	url(r'^removemap/$',views.RemoveMap, name='removemap'),

    #accounts section - includes Django registration and adding teams, etc that are related
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
    #url(r'^accounts/profile/opinion/filter/$', views.accountFilterOpinion, name='accountFilterOpinion'),    
    # opinions in teacher profile url
    url(r'^accounts/profile/opinion/$', views.accountOpinion, name='accountOpinion'),
    # media in student profile filter
    url(r'^accounts/profile/student/media/filter/$', views.studentFilterMedia, name='studentFilterMedia'),    
    # student account media profile urls
    url(r'^accounts/profile/student/media/$', views.studentProfileMedia, name='studentProfileMedia'),
    # opinion in student profile filter
    #url(r'^accounts/profile/student/opinion/filter/$', views.studentFilterOpinion, name='studentFilterOpinion'),    
    # student account opinion profile urls
    url(r'^accounts/profile/student/opinion/$', views.studentProfileOpinion, name='studentProfileOpinion'),
    # about page
    url(r'^about/$', views.about, name='about') 
)

