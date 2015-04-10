# includes
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.forms.models import modelformset_factory

# paginator
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

# use Q for OR queries 
import operator
from django.db.models import Q

# for chaining together querysets
from itertools import chain

# for list sorting
from operator import attrgetter

# user and profile models
from django.contrib.auth.models import User

# teacher registration form
from registration.forms import RegistrationForm

# import all forms and models for city digits app
from CashCity.forms import *
from CashCity.models import *


def about(request):

	context = RequestContext(request)
	context_dict = {}
	return render_to_response('CashCity/about.html', context_dict, context)

def index(request):
	"""
	  Loads the index page
	"""
	context = RequestContext(request)
	
	#get user profile data and pass to view
	if request.user.id:
		profile = ExUserProfile.objects.get(user=request.user.id)
	else:
		profile = False 

	# get all media and pass to template to create geojson file
	#build query
	kwargs = {}
	# show only published media
	kwargs['published__exact'] = True

	#get mediaImages
	mediaImages = MediaImage.objects.filter(**kwargs)

	#get mediaAudio
	mediaAudio = MediaAudio.objects.filter(**kwargs)
		
	#get mediaNote
	mediaNote = MediaNote.objects.filter(**kwargs)
	
	#find and replace line breaks in notes for geojson
	for note in mediaNote:
		note.notes = note.notes.replace('\n', ' ').replace('\r', '')    

	#get mediaInterview
	mediaInterview = MediaInterview.objects.filter(**kwargs)
	
	#new query for mapSnaps
	kwargs = {}

	#get user profile data and pass to view
	if request.user.id:
		# show only map snaps tied to this student group's account
		kwargs['user__exact'] = request.user.id
		#get mapSnaps
		mapSnaps = MapSettings.objects.filter(**kwargs)
		
		# loop throuhg mapSnaps and increase zoom to way out
		for mapSnap in mapSnaps:
			mapSnap.zoom = mapSnap.zoom - 3
			   
	else:
		mapSnaps = {} 
		
	#pass in a form for tag autocomplete
	form = MediaFormImage()
	  
	context_dict = {'mediaImages': mediaImages, 'mediaAudios': mediaAudio, 'mediaNotes': mediaNote, 'mediaInterviews': mediaInterview, 'mapSnaps':mapSnaps, 'form':form, 'profile':profile}

	return render_to_response('CashCity/index.html', context_dict, context)
	

def filterIndexImage(request):
	"""
	  Loads the filtered images on teh map
	"""
	context = RequestContext(request)
			
	# get all media and pass to template to create geojson file
	#build query
	kwargs = {}
	# show only published media
	kwargs['published__exact'] = True
	
	#get search tags
	searchTags = request.GET.get("tags","All")
	
	#query for tags
	if(searchTags != ""):
		tagsArray = searchTags.split(',')
		kwargs['tags__name__in'] = tagsArray
	

	#get mediaImages
	mediaImages = MediaImage.objects.filter(**kwargs)
		
	#pass in a form for tag autocomplete
	form = MediaFormImage() 
	  
	context_dict = {'mediaImages': mediaImages, 'searchTags': searchTags, 'form':form}

	return render_to_response('CashCity/mapFilterMediaImage.html', context_dict, context)


def filterIndexAudio(request):
	"""
	  Loads the filtered audio
	"""
	context = RequestContext(request)    
		
	# get all media and pass to template to create geojson file
	#build query
	kwargs = {}
	# show only published media
	kwargs['published__exact'] = True
	
	#get search tags
	searchTags = request.GET.get("tags","All")
	
	#query for tags
	if(searchTags != ""):
		tagsArray = searchTags.split(',')
		kwargs['tags__name__in'] = tagsArray
	
	#get mediaAudio
	mediaAudio = MediaAudio.objects.filter(**kwargs)
	  
	context_dict = {'mediaAudios': mediaAudio}

	return render_to_response('CashCity/mapFilterMediaAudio.html', context_dict, context)
	
	
		
def filterIndexNote(request):
	"""
	  Loads the filtered notes on the map
	"""
	context = RequestContext(request)
			
	# get all media and pass to template to create geojson file
	#build query
	kwargs = {}
	# show only published media
	kwargs['published__exact'] = True
	
	#get search tags
	searchTags = request.GET.get("tags","All")
	
	#query for tags
	if(searchTags != ""):
		tagsArray = searchTags.split(',')
		kwargs['tags__name__in'] = tagsArray
	
	#get mediaNote
	mediaNote = MediaNote.objects.filter(**kwargs)
	
	#find and replace line breaks in notes for geojson
	for note in mediaNote:
		note.notes = note.notes.replace('\n', ' ').replace('\r', '')    
	
	  
	context_dict = {'mediaNotes': mediaNote}

	return render_to_response('CashCity/mapFilterMediaNote.html', context_dict, context)
 
	
def filterIndexInterview(request):
	"""
	  Loads the filtered interviews on the map
	"""
	context = RequestContext(request)
	
	# get all media and pass to template to create geojson file
	#build query
	kwargs = {}
	# show only published media
	kwargs['published__exact'] = True
	
	#get search tags
	searchTags = request.GET.get("tags","All")
	
	#query for tags
	if(searchTags != ""):
		tagsArray = searchTags.split(',')
		kwargs['tags__name__in'] = tagsArray
		
	#get mediaInterview
	mediaInterview = MediaInterview.objects.filter(**kwargs)
			  
	context_dict = {'mediaInterviews': mediaInterview}

	return render_to_response('CashCity/mapFilterMediaInterview.html', context_dict, context)
	   

def mapSnaps(request, id=None):
	"""
	  Loads the map snap bookmarks on the main map index page
	"""
	context = RequestContext(request)
	
	#get user profile data and pass to view
	if request.user.id:
		profile = ExUserProfile.objects.get(user=request.user.id)
	else:
		profile = False 

	# get all media and pass to template to create geojson file
	#build query
	kwargs = {}
	# show only published media
	kwargs['published__exact'] = True

	#get mediaImages
	mediaImages = MediaImage.objects.filter(**kwargs)

	#get mediaAudio
	mediaAudio = MediaAudio.objects.filter(**kwargs)

	#get mediaNote
	mediaNote = MediaNote.objects.filter(**kwargs)
	
	#find and replace line breaks in notes for geojson
	for note in mediaNote:
		note.notes = note.notes.replace('\n', ' ').replace('\r', '')    
	

	#get mediaInterview
	mediaInterview = MediaInterview.objects.filter(**kwargs)
	
	#new query for mapSnaps
	kwargs = {}

	#get user profile data and pass to view
	if request.user.id:
		# show only map snaps tied to this student group's account
		kwargs['user__exact'] = request.user.id
		#get mapSnaps
		mapSnaps = MapSettings.objects.filter(**kwargs)
		
		# loop throuhg mapSnaps and increase zoom to way out
		for mapSnap in mapSnaps:
			mapSnap.zoom = mapSnap.zoom - 3
			   
	else:
		mapSnaps = {}
		
	# get map snap bookmark
	if id:
		mapSnapBookmark = MapSettings.objects.get(pk=id)
	else: 
		mapSnapBookmark = {}
		
	#pass in a form for tag autocomplete
	form = MediaFormImage() 
	  
	context_dict = {'mediaImages': mediaImages, 'mediaAudios': mediaAudio, 'mediaNotes': mediaNote, 'mediaInterviews': mediaInterview, 'mapSnaps':mapSnaps, 'form':form, 'profile':profile, 'mapSnapBookmark':mapSnapBookmark}

	return render_to_response('CashCity/index.html', context_dict, context)


@login_required
def accountProfile(request):
	"""
	  Loads the user profile page for editing
	"""
	context = RequestContext(request)
	
	#get user profile data and pass to view
	profile = ExUserProfile.objects.get(user=request.user)
	
	# send students to student profile area
	if profile.teacherOrStudent:
		doNothingVar = ''
	else:
		return HttpResponseRedirect('/cashcity/accounts/profile/student/media/')
	
	if request.method == 'POST':
		user_form = UserInfoForm(data=request.POST, instance=request.user)
		profile_form = UserProfileForm(data=request.POST, instance=ExUserProfile.objects.get(user=request.user))
		if user_form.is_valid() and profile_form.is_valid():
			user_form.save()       
			profile_form.save()


			user_form = UserInfoForm(instance=request.user)
			profile_form = UserProfileForm(instance=ExUserProfile.objects.get(user=request.user))
			success = True
			
			return render_to_response('registration/profile.html', {'user_form': user_form, 'profile_form': profile_form, 'success': success, 'profile':profile}, context)
			
		else:
			print user_form.errors, profile_form.errors
			
	else:
		user_form = UserInfoForm(instance=request.user)
		profile_form = UserProfileForm(instance=ExUserProfile.objects.get(user=request.user))
	return render_to_response('registration/profile.html', {'user_form': user_form, 'profile_form': profile_form, 'profile':profile}, context)

	
@login_required
def accountMedia(request):
	"""
	  Loads the list of media in the teacher account
	"""
	# Get the context from the request.
	context = RequestContext(request)

	profile = ExUserProfile.objects.get(user=request.user.id)
	
	# offset = int(offset)
	#store toolbar form info
	toolbar={'searchType':'All',
			 'searchTeacher':'All',
			 'searchTeam':'All',
			 'searchTags':''}
					 
	#build query
	kwargs = {}
	# show only media tied to this teacher's student groups
	classRequest = list(ExUserProfile.objects.filter(teacherId=request.user.id).values_list('user', flat=True))
	#add in the teacher's own account
	classRequest.append(request.user.id)
	kwargs['user__in'] = classRequest

	#get mediaImages
	mediaImages = MediaImage.objects.filter(**kwargs)

	#get mediaAudio
	mediaAudio = MediaAudio.objects.filter(**kwargs)

	#get mediaNote
	mediaNote = MediaNote.objects.filter(**kwargs)

	#get mediaInterview
	mediaInterview = MediaInterview.objects.filter(**kwargs)
	
	# chain results together
	mediaResults = sorted(chain(mediaImages, mediaAudio, mediaNote, mediaInterview), key=attrgetter('last_modified'), reverse=True)
	
	# get list of tachers and sections
	classes = ExUserProfile.objects.filter(teacherOrStudent=False, teacherId=request.user.id).values('teacherId', 'teacherName', 'section').order_by('teacherName', 'section').distinct()
		
	# get list of teams across all classes
	teams = ExUserProfile.objects.filter(teacherOrStudent=False, teacherId=request.user.id).values_list('color', flat=True).order_by('color').distinct()   
	
	#pass in a form for tag autocomplete
	form = MediaFormImage() 

	return render_to_response('registration/teacherMedia.html', {'mediaResults':mediaResults, 'classes':classes, 'teams':teams, 'toolbar':toolbar, 'profile':profile, 'form': form}, context)


@login_required
def accountFilterMedia(request):
	"""
		This view returns the filtered list of media on the teacher account media page
	"""
	# Get the context from the request.
	context = RequestContext(request)

	profile = ExUserProfile.objects.get(user=request.user.id)
	
	# offset = int(offset)
	#store toolbar form info
	toolbar={'searchType':'All',
			 'searchClass':'All',
			 'searchTeam':'All',
			 'searchTags':''}
			 
	#get search teams
	searchType = request.GET.get("type","All")
	toolbar['searchType'] = searchType

	#get search class
	searchClass = request.GET.get("class","All")

	#get search teams
	searchTeam = request.GET.get("team","All")

	#get search tags
	searchTags = request.GET.get("tags","All")
		
	#build query
	kwargs = {}
	# show only media tied to this teacher's student groups
	classRequest = list(ExUserProfile.objects.filter(teacherId=request.user.id).values_list('user', flat=True))
	#add in the teacher's own account
	classRequest.append(request.user.id)
	kwargs['user__in'] = classRequest

	
	# interim query steps
	kwargsClassTeam = {}
	kwargsClass = {}
	kwargsTeam = {}
	if(searchClass != "All" and searchTeam != "All"):
		# break searchClass apart
		classArray = searchClass.split('_')
		kwargsClassTeam['teacherId__exact'] = classArray[0]
		kwargsClassTeam['section__exact'] = classArray[1]
		kwargsClassTeam['color__exact'] = searchTeam
		classRequest = ExUserProfile.objects.filter(**kwargsClassTeam).values_list('user', flat=True)
		kwargs['user__in'] = classRequest
		toolbar['searchClass'] = searchClass
		toolbar['searchTeam'] = searchTeam
	
	else:     
		if(searchClass != "All"):
			# break searchClass apart
			classArray = searchClass.split('_')
			kwargsClass['teacherId__exact'] = classArray[0]
			kwargsClass['section__exact'] = classArray[1]
			classRequest = ExUserProfile.objects.filter(**kwargsClass).values_list('user', flat=True)
			kwargs['user__in'] = classRequest
			toolbar['searchClass'] = searchClass

		if(searchTeam != "All"):
			#ensure we only get search results for this teacher
			kwargsTeam['teacherId__exact'] = request.user.id
			kwargsTeam['color__exact'] = searchTeam
			classRequest = ExUserProfile.objects.filter(**kwargsTeam).values_list('user', flat=True)
			kwargs['user__in'] = classRequest
			toolbar['searchTeam'] = searchTeam

	#query for tags
	if(searchTags != ""):
		tagsArray = searchTags.split(',')
		kwargs['tags__name__in'] = tagsArray
		toolbar['searchTags'] = searchTags


	#get mediaImages
	if (searchType == "All" or searchType == "Images"):
		mediaImages = MediaImage.objects.filter(**kwargs).distinct()
	else:
		mediaImages = ''

	#get mediaAudio
	if (searchType == "All" or searchType == "Audio"):
		mediaAudio = MediaAudio.objects.filter(**kwargs).distinct()
	else:
		mediaAudio = ''

	#get mediaNote
	if (searchType == "All" or searchType == "Notes"):
		mediaNote = MediaNote.objects.filter(**kwargs).distinct()
	else:
		mediaNote = ''

	#get mediaInterview
	if (searchType == "All" or searchType == "Interviews"):
		mediaInterview = MediaInterview.objects.filter(**kwargs).distinct()
	else:
		mediaInterview = ''
	
	# chain results together
	mediaResults = sorted(chain(mediaImages, mediaAudio, mediaNote, mediaInterview), key=attrgetter('last_modified'), reverse=True)

	# get list of tachers and sections
	classes = ExUserProfile.objects.filter(teacherOrStudent=False, teacherId=request.user.id).values('teacherId', 'teacherName', 'section').order_by('teacherName', 'section').distinct()
		
	# get list of teams across all classes
	teams = ExUserProfile.objects.filter(teacherOrStudent=False, teacherId=request.user.id).values_list('color', flat=True).order_by('color').distinct()   
	
	#pass in a form for tag autocomplete
	form = MediaFormImage(initial={'tags': searchTags})    

	#render
	return render_to_response('registration/filterMedia.html', {'mediaResults':mediaResults, 'classes':classes, 'teams':teams, 'toolbar':toolbar, 'profile':profile, 'form': form}, context)


@login_required
def accountOpinion(request):
	"""
	  Loads the list of opinions in the teacher account
	"""
	# Get the context from the request.
	context = RequestContext(request)

	profile = ExUserProfile.objects.get(user=request.user.id)
	
	# offset = int(offset)
	#store toolbar form info
	toolbar={'searchTeacher':'All',
			 'searchTeam':'All'}
					 
	#build query
	kwargs = {}
	# show only media tied to this teacher's student groups
	classRequest = list(ExUserProfile.objects.filter(teacherId=request.user.id).values_list('user', flat=True))
	#add in the teacher's own account
	classRequest.append(request.user.id)
	kwargs['user__in'] = classRequest

	#get opinions
	opinions = Opinions.objects.filter(**kwargs).order_by('-last_modified')
	
	# get cover photos
	coverKwargs = {}
	coverIds = list()

	for opinion in opinions:
		if opinion.coverPhoto:
			coverIds.append(opinion.coverPhoto.id)
			
	coverKwargs['pk__in'] = coverIds
	
	coverPhotoImages = MediaImage.objects.filter(**coverKwargs)    
		
	# get list of tachers and sections
	classes = ExUserProfile.objects.filter(teacherOrStudent=False, teacherId=request.user.id).values('teacherId', 'teacherName', 'section').order_by('teacherName', 'section').distinct()
		
	# get list of teams across all classes
	teams = ExUserProfile.objects.filter(teacherOrStudent=False, teacherId=request.user.id).values_list('color', flat=True).order_by('color').distinct()   
	
	return render_to_response('registration/teacherOpinions.html', {'opinions':opinions, 'coverPhotoImages': coverPhotoImages, 'classes':classes, 'teams':teams, 'toolbar':toolbar, 'profile':profile}, context)


@login_required
def accountFilterOpinion(request):
	"""
		This view returns the filtered list of opinions on the teacher account opinions page
	"""
	# Get the context from the request.
	context = RequestContext(request)

	profile = ExUserProfile.objects.get(user=request.user.id)
	
	# offset = int(offset)
	#store toolbar form info
	toolbar={'searchClass':'All',
			 'searchTeam':'All'}
			 
	#get search class
	searchClass = request.GET.get("class","All")

	#get search teams
	searchTeam = request.GET.get("team","All")
		
	#build query
	kwargs = {}
	# show only media tied to this teacher's student groups
	classRequest = list(ExUserProfile.objects.filter(teacherId=request.user.id).values_list('user', flat=True))
	#add in the teacher's own account
	classRequest.append(request.user.id)
	kwargs['user__in'] = classRequest

	
	# interim query steps
	kwargsClassTeam = {}
	kwargsClass = {}
	kwargsTeam = {}
	if(searchClass != "All" and searchTeam != "All"):
		# break searchClass apart
		classArray = searchClass.split('_')
		kwargsClassTeam['teacherId__exact'] = classArray[0]
		kwargsClassTeam['section__exact'] = classArray[1]
		kwargsClassTeam['color__exact'] = searchTeam
		classRequest = ExUserProfile.objects.filter(**kwargsClassTeam).values_list('user', flat=True)
		kwargs['user__in'] = classRequest
		toolbar['searchClass'] = searchClass
		toolbar['searchTeam'] = searchTeam
	
	else:     
		if(searchClass != "All"):
			# break searchClass apart
			classArray = searchClass.split('_')
			kwargsClass['teacherId__exact'] = classArray[0]
			kwargsClass['section__exact'] = classArray[1]
			classRequest = ExUserProfile.objects.filter(**kwargsClass).values_list('user', flat=True)
			kwargs['user__in'] = classRequest
			toolbar['searchClass'] = searchClass

		if(searchTeam != "All"):
			#ensure we only get search results for this teacher
			kwargsTeam['teacherId__exact'] = request.user.id
			kwargsTeam['color__exact'] = searchTeam
			classRequest = ExUserProfile.objects.filter(**kwargsTeam).values_list('user', flat=True)
			kwargs['user__in'] = classRequest
			toolbar['searchTeam'] = searchTeam


	#get opinions
	opinions = Opinions.objects.filter(**kwargs).distinct().order_by('-last_modified')
	
	# get cover photos
	coverKwargs = {}
	coverIds = list()

	for opinion in opinions:
		if opinion.coverPhoto:
			coverIds.append(opinion.coverPhoto.id)
			
	coverKwargs['pk__in'] = coverIds
	
	coverPhotoImages = MediaImage.objects.filter(**coverKwargs)    

	# get list of tachers and sections
	classes = ExUserProfile.objects.filter(teacherOrStudent=False, teacherId=request.user.id).values('teacherId', 'teacherName', 'section').order_by('teacherName', 'section').distinct()
		
	# get list of teams across all classes
	teams = ExUserProfile.objects.filter(teacherOrStudent=False, teacherId=request.user.id).values_list('color', flat=True).order_by('color').distinct()   
	
	#render
	return render_to_response('registration/filterOpinion.html', {'opinions':opinions, 'coverPhotoImages':coverPhotoImages, 'classes':classes, 'teams':teams, 'toolbar':toolbar, 'profile':profile}, context)


@login_required
def studentProfileMedia(request):
	"""
	  Loads the list of media in the student account
	"""
	# Get the context from the request.
	context = RequestContext(request)

	profile = ExUserProfile.objects.get(user=request.user.id)
	
	# offset = int(offset)
	#store toolbar form info
	toolbar={'searchType':'All',
			 'searchTags':''}

	# or show media that the teacher has shared with other groups
	teacherId = ExUserProfile.objects.filter(user=request.user.id).values('teacherId')
	userIds = ExUserProfile.objects.filter(Q(teacherId=teacherId) | Q(user=teacherId)).values('user')

	#query
	query = Q(user__exact=request.user.id) | (Q(user__in=userIds) & Q(shared__exact=True))

	#get mediaImages
	mediaImages = MediaImage.objects.filter(query)

	#get mediaAudio
	mediaAudio = MediaAudio.objects.filter(query)

	#get mediaNote
	mediaNote = MediaNote.objects.filter(query)

	#get mediaInterview
	mediaInterview = MediaInterview.objects.filter(query)
	
	# chain results together
	mediaResults = sorted(chain(mediaImages, mediaAudio, mediaNote, mediaInterview), key=attrgetter('last_modified'), reverse=True)
		
	#pass in a form for tag autocomplete
	form = MediaFormImage() 

	return render_to_response('registration/studentMedia.html', {'mediaResults':mediaResults, 'toolbar':toolbar, 'profile':profile, 'form': form, 'userIds': userIds}, context)


@login_required
def studentFilterMedia(request):
	"""
		This view returns the filtered list of media on the student account media page
	"""
	# Get the context from the request.
	context = RequestContext(request)

	profile = ExUserProfile.objects.get(user=request.user.id)
	
	# offset = int(offset)
	#store toolbar form info
	toolbar={'searchType':'All',
			 'searchTags':''}
			 
	#get search teams
	searchType = request.GET.get("type","All")
	toolbar['searchType'] = searchType

	#get search tags
	searchTags = request.GET.get("tags","All")
	
	# or show media that the teacher has shared with other groups
	teacherId = ExUserProfile.objects.filter(user=request.user.id).values('teacherId')
	userIds = ExUserProfile.objects.filter(Q(teacherId=teacherId) | Q(user=teacherId)).values('user')

	#query
	query = Q(user__exact=request.user.id) | (Q(user__in=userIds) & Q(shared__exact=True))

	#query for tags
	if(searchTags != ""):
		tagsArray = searchTags.split(',')
		#query
		query = Q(tags__name__in=tagsArray) & (Q(user__exact=request.user.id) | (Q(user__in=userIds) & Q(shared__exact=True)))
		toolbar['searchTags'] = searchTags

	#get mediaImages
	if (searchType == "All" or searchType == "Images"):
		mediaImages = MediaImage.objects.filter(query).distinct()
	else:
		mediaImages = ''

	#get mediaAudio
	if (searchType == "All" or searchType == "Audio"):
		mediaAudio = MediaAudio.objects.filter(query).distinct()
	else:
		mediaAudio = ''

	#get mediaNote
	if (searchType == "All" or searchType == "Notes"):
		mediaNote = MediaNote.objects.filter(query).distinct()
	else:
		mediaNote = ''

	#get mediaInterview
	if (searchType == "All" or searchType == "Interviews"):
		mediaInterview = MediaInterview.objects.filter(query).distinct()
	else:
		mediaInterview = ''
	
	# chain results together
	mediaResults = sorted(chain(mediaImages, mediaAudio, mediaNote, mediaInterview), key=attrgetter('last_modified'), reverse=True)
	
	#pass in a form for tag autocomplete
	form = MediaFormImage(initial={'tags': searchTags})    

	#render
	return render_to_response('registration/filterStudentMedia.html', {'mediaResults':mediaResults, 'toolbar':toolbar, 'profile':profile, 'form': form}, context)


@login_required
def studentProfileOpinion(request):
	"""
	  Loads the list of opinions in the student account
	"""
	# Get the context from the request.
	context = RequestContext(request)

	profile = ExUserProfile.objects.get(user=request.user.id)
						 
	#build query
	kwargs = {}
	# show only media tied to this student group's account
	kwargs['user__exact'] = request.user.id

	#get opinions
	opinions = Opinions.objects.filter(**kwargs).order_by('-last_modified')
	
	# get cover photos
	coverKwargs = {}
	coverIds = list()

	for opinion in opinions:
		if opinion.coverPhoto:
			coverIds.append(opinion.coverPhoto.id)
			
	coverKwargs['pk__in'] = coverIds
	
	coverPhotoImages = MediaImage.objects.filter(**coverKwargs)
			
	return render_to_response('registration/studentOpinions.html', {'opinions':opinions, 'coverPhotoImages':coverPhotoImages, 'profile':profile}, context)


@login_required
def teams(request):
	"""
	  Loads the list of teams for this teacher
	"""
	context = RequestContext(request)

	#get user profile data and pass to view
	profile = ExUserProfile.objects.get(user=request.user)    
	
	#build query
	kwargs = {}
	kwargs['teacherOrStudent'] = False
	kwargs['teacherId__exact'] = request.user
	
	#get teams
	teams = ExUserProfile.objects.filter(**kwargs).order_by('section', 'color')
	
	return render_to_response('registration/teams.html', {'teams': teams, 'profile':profile}, context)
	
	
@login_required
def createTeam(request, id=None):
	"""
	  Loads a form for adding/editing teams
	"""
	context = RequestContext(request)

	#get user profile data and pass to view
	profile = ExUserProfile.objects.get(user=request.user)    
	
	if id:
		student_profile = ExUserProfile.objects.get(pk=id)
		student_user = User.objects.get(username=student_profile.user)
		user_form = TeamForm(instance=student_user)
		profile_form = TeamProfileForm(instance=student_profile)
	else:
		student_profile = ExUserProfile()
		student_user = User()        
	
	# A HTTP POST?
	if request.method == 'POST':
		# if user hits cancel, send back to media page without saving
		if "cancel" in request.POST:
			return HttpResponseRedirect('/cashcity/accounts/profile/teams/')
		# user has clicked save
		else:
			user_form = TeamForm(data=request.POST, instance=student_user)
			profile_form = TeamProfileForm(data=request.POST, instance=student_profile)
			if user_form.is_valid() and profile_form.is_valid():
				u = user_form.save()
				u.set_password(u.password)
				u.save()
				
				student_user = User.objects.get(username=request.POST['username'])
				teacher_profile = ExUserProfile.objects.get(user=request.user);
			
				profile = profile_form.save(commit=False)
				profile.user = student_user
				profile.teacherName = teacher_profile.teacherName
				profile.teacherOrStudent = False
				profile.teacherId = request.user
				profile.city = teacher_profile.city
				profile.school = teacher_profile.school
				profile.save()
			
				success = True
			
				#build query to return to teams page
				kwargs = {}
				kwargs['teacherOrStudent'] = False
				kwargs['teacherId__exact'] = request.user
	
				#get teams
				teams = ExUserProfile.objects.filter(**kwargs).order_by('section', 'color')
			

				return render_to_response('registration/teams.html', {'teams': teams, 'success': success, 'profile':profile}, context)
			
			else:
				print user_form.errors, profile_form.errors
			
	else:
		user_form = TeamForm(instance=student_user)
		profile_form = TeamProfileForm(instance=student_profile)        


	return render_to_response('registration/create_team.html', {'user_form': user_form, 'profile_form': profile_form, 'profile':profile}, context)
	
	
@login_required
def removeTeam(request, id=None):
	"""
	  Allows for removing of teams
	"""
	context = RequestContext(request)

	#get user profile data and pass to view
	profile = ExUserProfile.objects.get(user=request.user)    
	
	if id:
		student_profile = ExUserProfile.objects.get(pk=id)
		student_user = User.objects.get(username=student_profile.user)
			   
	# A HTTP POST?
	if request.method == 'POST':
		# if user hits cancel, send back to media page without saving
		if "cancel" in request.POST:
			return HttpResponseRedirect('/cashcity/accounts/profile/teams/')
		# user has clicked save
		else:
			student_profile.delete()
			student_user.delete()
		
			remove = True
		
			#build query to return to teams page
			kwargs = {}
			kwargs['teacherOrStudent'] = False
			kwargs['teacherId__exact'] = request.user

			#get teams
			teams = ExUserProfile.objects.filter(**kwargs).order_by('section', 'color')
		

			return render_to_response('registration/teams.html', {'teams': teams, 'remove': remove, 'profile':profile}, context)
			
			

	return render_to_response('registration/remove_team.html', {'student_profile': student_profile, 'student_user': student_user, 'profile':profile}, context)
	

# view for media image form
@login_required
def mediaFormImage(request, id=None):
	"""
	  Adding and editing media images
	"""
	# Get the context from the request.
	context = RequestContext(request)

	#get user profile data and pass to view
	profile = ExUserProfile.objects.get(user=request.user)  
	
	if id:
		mediaImage = MediaImage.objects.get(pk=id)
		form = MediaFormImage(instance=mediaImage)
	else:
		mediaImage = MediaImage()    
	  

	# A HTTP POST?
	if request.method == 'POST':
		# if user hits cancel, send back to media page without saving
		if "cancel" in request.POST:
			if profile.teacherOrStudent:
				return HttpResponseRedirect('/cashcity/accounts/profile/media/')
			else:   
				return HttpResponseRedirect('/cashcity/accounts/profile/student/media/')
				
		# if user hits save as draft, flag data in media image table as draft
		elif "saveDraft" in request.POST:
			form = MediaFormImage(request.POST, request.FILES, instance=mediaImage) 
			
			# Have we been provided with a valid form?
			if form.is_valid():
					
				# Save the new data to the database.
				f = form.save(commit=False)
				
				# add user 
				f.user = request.user

				# mark as draft
				f.published = False
				f.save()
				# save tags
				form.save_m2m()
			
				if profile.teacherOrStudent:
					return HttpResponseRedirect('/cashcity/accounts/profile/media/')
				else:   
					return HttpResponseRedirect('/cashcity/accounts/profile/student/media/')

			else:
				# The supplied form contained errors - just print them to the terminal.
				print form            

		else:
			form = MediaFormImage(request.POST, request.FILES, instance=mediaImage)
		
			# Have we been provided with a valid form?
			if form.is_valid():
				# Save the new data to the database.
				f = form.save(commit=False)

				# add user 
				f.user = request.user

				# mark as published
				f.published = True
				f.save()
				# save tags
				form.save_m2m()
			
				if profile.teacherOrStudent:
					return HttpResponseRedirect('/cashcity/accounts/profile/media/')
				else:   
					return HttpResponseRedirect('/cashcity/accounts/profile/student/media/')

			else:
				# The supplied form contained errors - just print them to the terminal.
				print form.errors
				
	else:
		# If the request was not a POST, display the form to enter details.
		form = MediaFormImage(instance=mediaImage)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render_to_response('CashCity/mediaFormImage.html', {'form': form, 'profile':profile}, context)
	
	
@login_required
def mediaFormImageRemove(request, id=None):
	"""
	  Allows for removing of images
	"""
	context = RequestContext(request)

	#get user profile data and pass to view
	profile = ExUserProfile.objects.get(user=request.user)    
	
	if id:
		mediaImage = MediaImage.objects.get(pk=id)
			   
	# A HTTP POST?
	if request.method == 'POST':
		# if user hits cancel, send back to media page without saving
		if "cancel" in request.POST:
			if profile.teacherOrStudent:
				return HttpResponseRedirect('/cashcity/accounts/profile/media/')
			else:   
				return HttpResponseRedirect('/cashcity/accounts/profile/student/media/')
		# user has clicked save
		else:
			mediaImage.delete()
		
			if profile.teacherOrStudent:
				return HttpResponseRedirect('/cashcity/accounts/profile/media/')
			else:   
				return HttpResponseRedirect('/cashcity/accounts/profile/student/media/')            
			
	if profile.teacherOrStudent:
		template = 'CashCity/mediaFormImageRemove.html'
	else:
		template = 'CashCity/mediaFormImageRemoveStudent.html'
		

	return render_to_response(template, {'mediaImage': mediaImage, 'profile':profile}, context)
	

@login_required
def mediaImageSaveDraft(request, id=None):
	"""
	  Allows for moving images to draft
	"""
	context = RequestContext(request)

	#get user profile data and pass to view
	profile = ExUserProfile.objects.get(user=request.user)    
	
	if id:
		mediaImage = MediaImage.objects.get(pk=id)
		mediaImage.published = False
		mediaImage.save()
		if profile.teacherOrStudent:
			return HttpResponseRedirect('/cashcity/accounts/profile/media/')
		else:   
			return HttpResponseRedirect('/cashcity/accounts/profile/student/media/')
	
	else:  
		if profile.teacherOrStudent:
			return HttpResponseRedirect('/cashcity/accounts/profile/media/')
		else:   
			return HttpResponseRedirect('/cashcity/accounts/profile/student/media/')            
			

@login_required
def mediaImagePublish(request, id=None):
	"""
	  Allows for publishing images
	"""
	context = RequestContext(request)

	#get user profile data and pass to view
	profile = ExUserProfile.objects.get(user=request.user)    
	
	if id:
		mediaImage = MediaImage.objects.get(pk=id)
		mediaImage.published = True
		mediaImage.save()
		if profile.teacherOrStudent:
			return HttpResponseRedirect('/cashcity/accounts/profile/media/')
		else:   
			return HttpResponseRedirect('/cashcity/accounts/profile/student/media/')
	
	else:  
		if profile.teacherOrStudent:
			return HttpResponseRedirect('/cashcity/accounts/profile/media/')
		else:   
			return HttpResponseRedirect('/cashcity/accounts/profile/student/media/') 
			
@login_required           
def mediaImageShare(request, id=None):
	"""
	  Allows for sharing images with other teams
	"""
	if id:
		mediaImage = MediaImage.objects.get(pk=id)
		mediaImage.shared = True
		mediaImage.save()

	return HttpResponse({})

@login_required
def mediaImageUnshare(request, id=None):
	"""
	  Allows for removing sharing
	"""
	if id:
		mediaImage = MediaImage.objects.get(pk=id)
		mediaImage.shared = False
		mediaImage.save()

	return HttpResponse({})


# view for media audio form
@login_required
def mediaFormAudio(request, id=None):
	# Get the context from the request.
	context = RequestContext(request)

	# if desktop browser, don't add audio or video params to input tag
	if not request.user_agent.is_mobile and not request.user_agent.is_tablet:
		desktop_tag = True
	else:
		desktop_tag = False

	# if browser is Andriod 4.0 or lower, specify in variable 
	if request.user_agent.os.family == 'Android' and ((request.user_agent.os.version[0] == 4 and request.user_agent.os.version[1] == 0) or request.user_agent.os.version[0] <= 3):
		audio_tag = True
	else:
		audio_tag = False

	#get user profile data and pass to view
	profile = ExUserProfile.objects.get(user=request.user) 
	
	if id:
		mediaAudio = MediaAudio.objects.get(pk=id)
		form = MediaFormAudio(instance=mediaAudio)
	else:
		mediaAudio = MediaAudio()    
	   

	# A HTTP POST?
	if request.method == 'POST':
		# if user hits cancel, send back to media page without saving
		if "cancel" in request.POST:
			if profile.teacherOrStudent:
				return HttpResponseRedirect('/cashcity/accounts/profile/media/')
			else:   
				return HttpResponseRedirect('/cashcity/accounts/profile/student/media/')

		# if user hits save as draft, flag data in media Audio table as draft
		elif "saveDraft" in request.POST:
			form = MediaFormAudio(request.POST, request.FILES, instance=mediaAudio)
		
			# Have we been provided with a valid form?
			if form.is_valid():
				# Save the new data to the database.
				f = form.save(commit=False)
				# add current user
				f.user = request.user
				# mark as draft
				f.published = False
				f.save()
				# save tags
				form.save_m2m()
			
				if profile.teacherOrStudent:
					return HttpResponseRedirect('/cashcity/accounts/profile/media/')
				else:   
					return HttpResponseRedirect('/cashcity/accounts/profile/student/media/')

			else:
				# The supplied form contained errors - just print them to the terminal.
				print form.errors            

		else:
			form = MediaFormAudio(request.POST, request.FILES, instance=mediaAudio)
		
			# Have we been provided with a valid form?
			if form.is_valid():
				# Save the new data to the database.
				f = form.save(commit=False)
				# add current user
				f.user = request.user
				# mark as published
				f.published = True
				f.save()
				# save tags
				form.save_m2m()
			
				if profile.teacherOrStudent:
					return HttpResponseRedirect('/cashcity/accounts/profile/media/')
				else:   
					return HttpResponseRedirect('/cashcity/accounts/profile/student/media/')

			else:
				# The supplied form contained errors - just print them to the terminal.
				print form.errors
				
	else:
		# If the request was not a POST, display the form to enter details.
		form = MediaFormAudio(instance=mediaAudio)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render_to_response('CashCity/mediaFormAudio.html', {'form': form, 'profile':profile, 'audio_tag':audio_tag, 'desktop_tag':desktop_tag}, context)
	

@login_required
def mediaFormAudioRemove(request, id=None):
	"""
	  Allows for removing of Audio files
	"""
	context = RequestContext(request)

	#get user profile data and pass to view
	profile = ExUserProfile.objects.get(user=request.user)    
	
	if id:
		mediaAudio = MediaAudio.objects.get(pk=id)
			   
	# A HTTP POST?
	if request.method == 'POST':
		# if user hits cancel, send back to media page without saving
		if "cancel" in request.POST:
			if profile.teacherOrStudent:
				return HttpResponseRedirect('/cashcity/accounts/profile/media/')
			else:   
				return HttpResponseRedirect('/cashcity/accounts/profile/student/media/')
		# user has clicked save
		else:
			mediaAudio.delete()
		
			if profile.teacherOrStudent:
				return HttpResponseRedirect('/cashcity/accounts/profile/media/')
			else:   
				return HttpResponseRedirect('/cashcity/accounts/profile/student/media/')            
			
	if profile.teacherOrStudent:
		template = 'CashCity/mediaFormAudioRemove.html'
	else:
		template = 'CashCity/mediaFormAudioRemoveStudent.html'
		

	return render_to_response(template, {'mediaAudio': mediaAudio, 'profile':profile}, context)


@login_required
def mediaAudioSaveDraft(request, id=None):
	"""
	  Allows for moving audio to draft
	"""
	context = RequestContext(request)

	#get user profile data and pass to view
	profile = ExUserProfile.objects.get(user=request.user)    
	
	if id:
		mediaAudio = MediaAudio.objects.get(pk=id)
		mediaAudio.published = False
		mediaAudio.save()
		if profile.teacherOrStudent:
			return HttpResponseRedirect('/cashcity/accounts/profile/media/')
		else:   
			return HttpResponseRedirect('/cashcity/accounts/profile/student/media/')
	
	else:  
		if profile.teacherOrStudent:
			return HttpResponseRedirect('/cashcity/accounts/profile/media/')
		else:   
			return HttpResponseRedirect('/cashcity/accounts/profile/student/media/')            
			

@login_required
def mediaAudioPublish(request, id=None):
	"""
	  Allows for moving images to draft
	"""
	context = RequestContext(request)

	#get user profile data and pass to view
	profile = ExUserProfile.objects.get(user=request.user)    
	
	if id:
		mediaAudio = MediaAudio.objects.get(pk=id)
		mediaAudio.published = True
		mediaAudio.save()
		if profile.teacherOrStudent:
			return HttpResponseRedirect('/cashcity/accounts/profile/media/')
		else:   
			return HttpResponseRedirect('/cashcity/accounts/profile/student/media/')
	
	else:  
		if profile.teacherOrStudent:
			return HttpResponseRedirect('/cashcity/accounts/profile/media/')
		else:   
			return HttpResponseRedirect('/cashcity/accounts/profile/student/media/') 
			
@login_required           
def mediaAudioShare(request, id=None):
	"""
	  Allows for sharing audio with other teams
	"""
	if id:
		mediaAudio = MediaAudio.objects.get(pk=id)
		mediaAudio.shared = True
		mediaAudio.save()

	return HttpResponse({})

@login_required
def mediaAudioUnshare(request, id=None):
	"""
	  Allows for removing sharing
	"""
	if id:
		mediaAudio = MediaAudio.objects.get(pk=id)
		mediaAudio.shared = False
		mediaAudio.save()

	return HttpResponse({})
				   
	
# view for media notes form
@login_required
def mediaFormNote(request, id=None):
	# Get the context from the request.
	context = RequestContext(request)

	#get user profile data and pass to view
	profile = ExUserProfile.objects.get(user=request.user) 
	
	if id:
		mediaNote = MediaNote.objects.get(pk=id)
		form = MediaFormNote(instance=mediaNote)
	else:
		mediaNote = MediaNote()   

	# A HTTP POST?
	if request.method == 'POST':
		# if user hits cancel, send back to media page without saving
		if "cancel" in request.POST:
			if profile.teacherOrStudent:
				return HttpResponseRedirect('/cashcity/accounts/profile/media/')
			else:   
				return HttpResponseRedirect('/cashcity/accounts/profile/student/media/')

		# if user hits save as draft, flag data in media Audio table as draft
		elif "saveDraft" in request.POST:
			form = MediaFormNote(request.POST, instance=mediaNote)
		
			# Have we been provided with a valid form?
			if form.is_valid():
				# Save the new data to the database.
				f = form.save(commit=False)
				# add current user
				f.user = request.user
				# mark as draft
				f.published = False
				f.save()
				# save tags
				form.save_m2m()
			
				if profile.teacherOrStudent:
					return HttpResponseRedirect('/cashcity/accounts/profile/media/')
				else:   
					return HttpResponseRedirect('/cashcity/accounts/profile/student/media/')

			else:
				# The supplied form contained errors - just print them to the terminal.
				print form.errors            

		else:
			form = MediaFormNote(request.POST, instance=mediaNote)
		
			# Have we been provided with a valid form?
			if form.is_valid():
				# Save the new data to the database.
				f = form.save(commit=False)
				# add current user
				f.user = request.user
				# mark as published
				f.published = True
				f.save()
				# save tags
				form.save_m2m()
			
				if profile.teacherOrStudent:
					return HttpResponseRedirect('/cashcity/accounts/profile/media/')
				else:   
					return HttpResponseRedirect('/cashcity/accounts/profile/student/media/')

			else:
				# The supplied form contained errors - just print them to the terminal.
				print form.errors
				
	else:
		# If the request was not a POST, display the form to enter details.
		form = MediaFormNote(instance=mediaNote)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render_to_response('CashCity/mediaFormNote.html', {'form': form, 'profile':profile}, context)
	

@login_required
def mediaFormNoteRemove(request, id=None):
	"""
	  Allows for removing of notes
	"""
	context = RequestContext(request)

	#get user profile data and pass to view
	profile = ExUserProfile.objects.get(user=request.user)    
	
	if id:
		mediaNote = MediaNote.objects.get(pk=id)
			   
	# A HTTP POST?
	if request.method == 'POST':
		# if user hits cancel, send back to media page without saving
		if "cancel" in request.POST:
			if profile.teacherOrStudent:
				return HttpResponseRedirect('/cashcity/accounts/profile/media/')
			else:   
				return HttpResponseRedirect('/cashcity/accounts/profile/student/media/')
		# user has clicked save
		else:
			mediaNote.delete()
		
			if profile.teacherOrStudent:
				return HttpResponseRedirect('/cashcity/accounts/profile/media/')
			else:   
				return HttpResponseRedirect('/cashcity/accounts/profile/student/media/')            
			
	if profile.teacherOrStudent:
		template = 'CashCity/mediaFormNoteRemove.html'
	else:
		template = 'CashCity/mediaFormNoteRemoveStudent.html'
		
	return render_to_response(template, {'mediaNote': mediaNote, 'profile':profile}, context)


@login_required
def mediaNoteSaveDraft(request, id=None):
	"""
	  Allows for moving images to draft
	"""
	context = RequestContext(request)

	#get user profile data and pass to view
	profile = ExUserProfile.objects.get(user=request.user)    
	
	if id:
		mediaNote = MediaNote.objects.get(pk=id)
		mediaNote.published = False
		mediaNote.save()
		if profile.teacherOrStudent:
			return HttpResponseRedirect('/cashcity/accounts/profile/media/')
		else:   
			return HttpResponseRedirect('/cashcity/accounts/profile/student/media/')
	
	else:  
		if profile.teacherOrStudent:
			return HttpResponseRedirect('/cashcity/accounts/profile/media/')
		else:   
			return HttpResponseRedirect('/cashcity/accounts/profile/student/media/')            
			

@login_required
def mediaNotePublish(request, id=None):
	"""
	  Allows for moving images to draft
	"""
	context = RequestContext(request)

	#get user profile data and pass to view
	profile = ExUserProfile.objects.get(user=request.user)    
	
	if id:
		mediaNote = MediaNote.objects.get(pk=id)
		mediaNote.published = True
		mediaNote.save()
		if profile.teacherOrStudent:
			return HttpResponseRedirect('/cashcity/accounts/profile/media/')
		else:   
			return HttpResponseRedirect('/cashcity/accounts/profile/student/media/')
	
	else:  
		if profile.teacherOrStudent:
			return HttpResponseRedirect('/cashcity/accounts/profile/media/')
		else:   
			return HttpResponseRedirect('/cashcity/accounts/profile/student/media/') 

@login_required           
def mediaNoteShare(request, id=None):
	"""
	  Allows for sharing notes with other teams
	"""
	if id:
		mediaNote = MediaNote.objects.get(pk=id)
		mediaNote.shared = True
		mediaNote.save()

	return HttpResponse({})

@login_required
def mediaNoteUnshare(request, id=None):
	"""
	  Allows for removing sharing
	"""
	if id:
		mediaNote = MediaNote.objects.get(pk=id)
		mediaNote.shared = False
		mediaNote.save()

	return HttpResponse({})
			
	
# view for media image form
@login_required
def mediaFormInterview(request, id=None):
	# Get the context from the request.
	context = RequestContext(request)

	# if desktop browser, don't add audio or video params to input tag
	if not request.user_agent.is_mobile and not request.user_agent.is_tablet:
		desktop_tag = True
	else:
		desktop_tag = False

	# if browser is Andriod 4.0 or lower, specify in variable 
	if request.user_agent.os.family == 'Android' and ((request.user_agent.os.version[0] == 4 and request.user_agent.os.version[1] == 0) or request.user_agent.os.version[0] <= 3):
		audio_tag = True
	else:
		audio_tag = False


	#get user profile data and pass to view
	profile = ExUserProfile.objects.get(user=request.user)    

	if id:
		mediaInterview = MediaInterview.objects.get(pk=id)
		form = MediaFormInterview(instance=mediaInterview)
	else:
		mediaInterview = MediaInterview()   

	# A HTTP POST?
	if request.method == 'POST':
		# if user hits cancel, send back to media page without saving
		if "cancel" in request.POST:
			if profile.teacherOrStudent:
				return HttpResponseRedirect('/cashcity/accounts/profile/media/')
			else:   
				return HttpResponseRedirect('/cashcity/accounts/profile/student/media/')

		# if user hits save as draft, flag data in media image table as draft
		elif "saveDraft" in request.POST:
			form = MediaFormInterview(request.POST, request.FILES, instance=mediaInterview)
		
			# Have we been provided with a valid form?
			if form.is_valid():
				# Save the new data to the database.
				f = form.save(commit=False)
				# add current user
				f.user = request.user
				# mark as draft
				f.published = False
				f.save()
				# save tags
				form.save_m2m()
			
				if profile.teacherOrStudent:
					return HttpResponseRedirect('/cashcity/accounts/profile/media/')
				else:   
					return HttpResponseRedirect('/cashcity/accounts/profile/student/media/')

			else:
				# The supplied form contained errors - just print them to the terminal.
				print form.errors            

		else:
			form = MediaFormInterview(request.POST, request.FILES, instance=mediaInterview)
		
			# Have we been provided with a valid form?
			if form.is_valid():
				# Save the new data to the database.
				f = form.save(commit=False)
				# add current user
				f.user = request.user
				# mark as published
				f.published = True
				f.save()
				# save tags
				form.save_m2m()
			
				if profile.teacherOrStudent:
					return HttpResponseRedirect('/cashcity/accounts/profile/media/')
				else:   
					return HttpResponseRedirect('/cashcity/accounts/profile/student/media/')

			else:
				# The supplied form contained errors - just print them to the terminal.
				print form.errors
				
	else:
		# If the request was not a POST, display the form to enter details.
		form = MediaFormInterview(instance=mediaInterview)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render_to_response('CashCity/mediaFormInterview.html', {'form': form, 'profile':profile, 'audio_tag':audio_tag, 'desktop_tag':desktop_tag}, context)


@login_required
def mediaFormInterviewRemove(request, id=None):
	"""
	  Allows for removing of interviews
	"""
	context = RequestContext(request)

	#get user profile data and pass to view
	profile = ExUserProfile.objects.get(user=request.user)    
	
	if id:
		mediaInterview = MediaInterview.objects.get(pk=id)
			   
	# A HTTP POST?
	if request.method == 'POST':
		# if user hits cancel, send back to media page without saving
		if "cancel" in request.POST:
			if profile.teacherOrStudent:
				return HttpResponseRedirect('/cashcity/accounts/profile/media/')
			else:   
				return HttpResponseRedirect('/cashcity/accounts/profile/student/media/')
		# user has clicked save
		else:
			mediaInterview.delete()
		
			if profile.teacherOrStudent:
				return HttpResponseRedirect('/cashcity/accounts/profile/media/')
			else:   
				return HttpResponseRedirect('/cashcity/accounts/profile/student/media/')            
			
	if profile.teacherOrStudent:
		template = 'CashCity/mediaFormInterviewRemove.html'
	else:
		template = 'CashCity/mediaFormInterviewRemoveStudent.html'
		

	return render_to_response(template, {'mediaInterview': mediaInterview, 'profile':profile}, context)    


@login_required
def mediaInterviewSaveDraft(request, id=None):
	"""
	  Allows for moving images to draft
	"""
	context = RequestContext(request)

	#get user profile data and pass to view
	profile = ExUserProfile.objects.get(user=request.user)    
	
	if id:
		mediaInterview = MediaInterview.objects.get(pk=id)
		mediaInterview.published = False
		mediaInterview.save()
		if profile.teacherOrStudent:
			return HttpResponseRedirect('/cashcity/accounts/profile/media/')
		else:   
			return HttpResponseRedirect('/cashcity/accounts/profile/student/media/')
	
	else:  
		if profile.teacherOrStudent:
			return HttpResponseRedirect('/cashcity/accounts/profile/media/')
		else:   
			return HttpResponseRedirect('/cashcity/accounts/profile/student/media/')            
			

@login_required
def mediaInterviewPublish(request, id=None):
	"""
	  Allows for moving images to draft
	"""
	context = RequestContext(request)

	#get user profile data and pass to view
	profile = ExUserProfile.objects.get(user=request.user)    
	
	if id:
		mediaInterview = MediaInterview.objects.get(pk=id)
		mediaInterview.published = True
		mediaInterview.save()
		if profile.teacherOrStudent:
			return HttpResponseRedirect('/cashcity/accounts/profile/media/')
		else:   
			return HttpResponseRedirect('/cashcity/accounts/profile/student/media/')
	
	else:  
		if profile.teacherOrStudent:
			return HttpResponseRedirect('/cashcity/accounts/profile/media/')
		else:   
			return HttpResponseRedirect('/cashcity/accounts/profile/student/media/') 

@login_required           
def mediaInterviewShare(request, id=None):
	"""
	  Allows for sharing interview with other teams
	"""
	if id:
		mediaInterview = MediaInterview.objects.get(pk=id)
		mediaInterview.shared = True
		mediaInterview.save()

	return HttpResponse({})

@login_required
def mediaInterviewUnshare(request, id=None):
	"""
	  Allows for removing sharing
	"""
	if id:
		mediaInterview = MediaInterview.objects.get(pk=id)
		mediaInterview.shared = False
		mediaInterview.save()

	return HttpResponse({})


@login_required
def mediaFormCommentImageRemove(request, id=None):
	"""
	  Allows for removing of image comments
	"""
	context = RequestContext(request)

	#get user profile data and pass to view -- don't print comment form is user is not logged in
	if request.user.id:
		profile = ExUserProfile.objects.get(user=request.user.id)
		comment_form = MediaFormImageComment()
	else:
		profile = False
		comment_form = False
	
	if id:
		comment = MediaImageComments.objects.get(pk=id)  
		mediaImageObject = MediaImage.objects.get(pk=comment.mediaImage.id)
		comment.delete()

	# get MediaImageComments
	comments = MediaImageComments.objects.filter(mediaImage=id) 
	
	# removed
	removed = True                           

	return render_to_response('CashCity/mediaPageImage.html', {'mediaImageObject': mediaImageObject, 'comments':comments, 'comment_form':comment_form, 'profile':profile, 'removed':removed}, context)

	
@login_required
def mediaFormCommentAudioRemove(request, id=None):
	"""
	  Allows for removing of audio comments
	"""
	context = RequestContext(request)

	#get user profile data and pass to view -- don't print comment form is user is not logged in
	if request.user.id:
		profile = ExUserProfile.objects.get(user=request.user.id)
		comment_form = MediaFormAudioComment()
	else:
		profile = False
		comment_form = False

	if id:
		comment = MediaAudioComments.objects.get(pk=id)  
		mediaAudioObject = MediaAudio.objects.get(pk=comment.mediaAudio.id)
		comment.delete()

	# get MediaAudioComments
	comments = MediaAudioComments.objects.filter(mediaAudio=id) 

	# removed
	removed = True                           

	return render_to_response('CashCity/mediaPageAudio.html', {'mediaAudioObject': mediaAudioObject, 'comments':comments, 'comment_form':comment_form, 'profile':profile, 'removed':removed}, context)
	
	
@login_required
def mediaFormCommentNoteRemove(request, id=None):
	"""
	  Allows for removing of note comments
	"""
	context = RequestContext(request)

	#get user profile data and pass to view -- don't print comment form is user is not logged in
	if request.user.id:
		profile = ExUserProfile.objects.get(user=request.user.id)
		comment_form = MediaFormNoteComment()
	else:
		profile = False
		comment_form = False

	if id:
		comment = MediaNoteComments.objects.get(pk=id)  
		mediaNoteObject = MediaNote.objects.get(pk=comment.mediaNote.id)
		comment.delete()

	# get MediaNoteComments
	comments = MediaNoteComments.objects.filter(mediaNote=id) 

	# removed
	removed = True                           

	return render_to_response('CashCity/mediaPageNote.html', {'mediaNoteObject': mediaNoteObject, 'comments':comments, 'comment_form':comment_form, 'profile':profile, 'removed':removed}, context)
			

@login_required
def mediaFormCommentInterviewRemove(request, id=None):
	"""
	  Allows for removing of interview comments
	"""
	context = RequestContext(request)

	#get user profile data and pass to view -- don't print comment form is user is not logged in
	if request.user.id:
		profile = ExUserProfile.objects.get(user=request.user.id)
		comment_form = MediaFormInterviewComment()
	else:
		profile = False
		comment_form = False
	
	if id:
		comment = MediaInterviewComments.objects.get(pk=id)  
		mediaInterviewObject = MediaInterview.objects.get(pk=comment.mediaInterview.id)
		comment.delete()

	# get MediaInterviewComments
	comments = MediaInterviewComments.objects.filter(mediaInterview=id) 
	
	# removed
	removed = True                           

	return render_to_response('CashCity/mediaPageInterview.html', {'mediaInterviewObject': mediaInterviewObject, 'comments':comments, 'comment_form':comment_form, 'profile':profile, 'removed':removed}, context)
	
	



def media(request):
	"""
		This view returns the initial list of media on the media page
	"""
	# Get the context from the request.
	context = RequestContext(request)

	if request.user.id:
		profile = ExUserProfile.objects.get(user=request.user.id)
	else:
		profile = False
	
	# offset = int(offset)
	#store toolbar form info
	toolbar={'searchType':'All',
			 'searchTeacher':'All',
			 'searchTeam':'All',
			 'searchTags':''}
					 
	#build query
	kwargs = {}
	# show only published media
	kwargs['published__exact'] = True

	#get mediaImages
	mediaImages = MediaImage.objects.filter(**kwargs)

	#get mediaAudio
	mediaAudio = MediaAudio.objects.filter(**kwargs)

	#get mediaNote
	mediaNote = MediaNote.objects.filter(**kwargs)

	#get mediaInterview
	mediaInterview = MediaInterview.objects.filter(**kwargs)
	
	# chain results together
	mediaResults_list = sorted(chain(mediaImages, mediaAudio, mediaNote, mediaInterview), key=attrgetter('last_modified'), reverse=True)

	paginator = Paginator(mediaResults_list, 20) # show 20 per page
	number_of_pages = paginator.num_pages

	page = request.GET.get('page')
	try:
		mediaResults = paginator.page(page)
	except PageNotAnInteger:
		# If page is not an integer, deliver first page.
		mediaResults = paginator.page(1)
	except EmptyPage:
		# If page is out of range (e.g. 9999), deliver last page of results.
		mediaResults = paginator.page(paginator.num_pages)

	# get list of tachers and sections
	classes = ExUserProfile.objects.filter(teacherOrStudent=False).values('teacherId', 'teacherName', 'section').order_by('teacherName', 'section').distinct();
		
	# get list of teams across all classes
	teams = ExUserProfile.objects.filter(teacherOrStudent=False).values_list('color', flat=True).order_by('color').distinct()   
	
	#pass in a form for tag autocomplete
	form = MediaFormImage() 

	#render
	return render_to_response('CashCity/media.html', {'mediaResults':mediaResults, 'classes':classes, 'teams':teams, 'toolbar':toolbar, 'profile':profile, 'form': form, 'number_of_pages':number_of_pages}, context)



def filterMedia(request):
	"""
		This view returns the filtered list of media on the media page
	"""
	# Get the context from the request.
	context = RequestContext(request)

	if request.user.id:
		profile = ExUserProfile.objects.get(user=request.user.id)
	else:
		profile = False
	
	# offset = int(offset)
	#store toolbar form info
	toolbar={'searchType':'All',
			 'searchClass':'All',
			 'searchTeam':'All',
			 'searchTags':''}
			 
	#get search teams
	searchType = request.GET.get("type","All")
	toolbar['searchType'] = searchType

	#get search class
	searchClass = request.GET.get("class","All")

	#get search teams
	searchTeam = request.GET.get("team","All")

	#get search tags
	searchTags = request.GET.get("tags","All")
		
	#build query
	kwargs = {}
	# show only published media
	kwargs['published__exact'] = True
	
	# interim query steps
	kwargsClassTeam = {}
	kwargsClass = {}
	kwargsTeam = {}
	if(searchClass != "All" and searchTeam != "All"):
		# break searchClass apart
		classArray = searchClass.split('_')
		kwargsClassTeam['teacherId__exact'] = classArray[0]
		kwargsClassTeam['section__exact'] = classArray[1]
		kwargsClassTeam['color__exact'] = searchTeam
		classRequest = ExUserProfile.objects.filter(**kwargsClassTeam).values_list('user', flat=True)
		kwargs['user__in'] = classRequest
		toolbar['searchClass'] = searchClass
		toolbar['searchTeam'] = searchTeam
	
	else:     
		if(searchClass != "All"):
			# break searchClass apart
			classArray = searchClass.split('_')
			kwargsClass['teacherId__exact'] = classArray[0]
			kwargsClass['section__exact'] = classArray[1]
			classRequest = ExUserProfile.objects.filter(**kwargsClass).values_list('user', flat=True)
			kwargs['user__in'] = classRequest
			toolbar['searchClass'] = searchClass

		if(searchTeam != "All"):
			kwargsTeam['color__exact'] = searchTeam
			classRequest = ExUserProfile.objects.filter(**kwargsTeam).values_list('user', flat=True)
			kwargs['user__in'] = classRequest
			toolbar['searchTeam'] = searchTeam

	#query for tags
	if(searchTags != ""):
		tagsArray = searchTags.split(',')
		kwargs['tags__name__in'] = tagsArray
		toolbar['searchTags'] = searchTags


	#get mediaImages
	if (searchType == "All" or searchType == "Images"):
		mediaImages = MediaImage.objects.filter(**kwargs).distinct()
	else:
		mediaImages = ''

	#get mediaAudio
	if (searchType == "All" or searchType == "Audio"):
		mediaAudio = MediaAudio.objects.filter(**kwargs).distinct()
	else:
		mediaAudio = ''

	#get mediaNote
	if (searchType == "All" or searchType == "Notes"):
		mediaNote = MediaNote.objects.filter(**kwargs).distinct()
	else:
		mediaNote = ''

	#get mediaInterview
	if (searchType == "All" or searchType == "Interviews"):
		mediaInterview = MediaInterview.objects.filter(**kwargs).distinct()
	else:
		mediaInterview = ''
	
	# chain results together
	mediaResults_list = sorted(chain(mediaImages, mediaAudio, mediaNote, mediaInterview), key=attrgetter('last_modified'), reverse=True)

	paginator = Paginator(mediaResults_list, 20) # show 20 per page
	number_of_pages = paginator.num_pages

	page = request.GET.get('page')
	try:
		mediaResults = paginator.page(page)
	except PageNotAnInteger:
		# If page is not an integer, deliver first page.
		mediaResults = paginator.page(1)
	except EmptyPage:
		# If page is out of range (e.g. 9999), deliver last page of results.
		mediaResults = paginator.page(paginator.num_pages)


	# get list of tachers and sections
	classes = ExUserProfile.objects.filter(teacherOrStudent=False).values('teacherId', 'teacherName', 'section').order_by('teacherName', 'section').distinct()
		
	# get list of teams across all classes
	teams = ExUserProfile.objects.filter(teacherOrStudent=False).values_list('color', flat=True).order_by('color').distinct() 
	
	#pass in a form for tag autocomplete
	form = MediaFormImage(initial={'tags': searchTags})    

	#render
	return render_to_response('CashCity/filterMedia.html', {'mediaResults':mediaResults, 'classes':classes, 'teams':teams, 'toolbar':toolbar, 'profile':profile, 'form': form, 'number_of_pages':number_of_pages}, context)
	
	
def opinion(request):
	"""
		This view returns the initial list of opinions on the opinion page
	"""
	# Get the context from the request.
	context = RequestContext(request)

	if request.user.id:
		profile = ExUserProfile.objects.get(user=request.user.id)
	else:
		profile = False
	
	# offset = int(offset)
	#store toolbar form info
	toolbar={'searchTeacher':'All',
			 'searchTeam':'All'}
					 
	#build query
	kwargs = {}
	# show only published media
	kwargs['published__exact'] = True

	#get opinions
	opinions = Opinions.objects.filter(**kwargs).order_by('-last_modified')
	
	# get cover photos
	coverKwargs = {}
	coverIds = list()

	for opinion in opinions:
		if opinion.coverPhoto:
			coverIds.append(opinion.coverPhoto.id)
			
	coverKwargs['pk__in'] = coverIds
	
	coverPhotoImages = MediaImage.objects.filter(**coverKwargs)

	paginator = Paginator(opinions, 20) # show 20 per page
	number_of_pages = paginator.num_pages

	page = request.GET.get('page')
	try:
		opinions_list = paginator.page(page)
	except PageNotAnInteger:
		# If page is not an integer, deliver first page.
		opinions_list = paginator.page(1)
	except EmptyPage:
		# If page is out of range (e.g. 9999), deliver last page of results.
		opinions_list = paginator.page(paginator.num_pages)	    

	# get list of tachers and sections
	classes = ExUserProfile.objects.filter(teacherOrStudent=False).values('teacherId', 'teacherName', 'section').order_by('teacherName', 'section').distinct();
		
	# get list of teams across all classes
	teams = ExUserProfile.objects.filter(teacherOrStudent=False).values_list('color', flat=True).order_by('color').distinct()   
	
	#render
	return render_to_response('CashCity/opinion.html', {'opinions':opinions_list, 'coverPhotoImages': coverPhotoImages, 'classes':classes, 'teams':teams, 'toolbar':toolbar, 'profile':profile, 'number_of_pages':number_of_pages}, context)


def filterOpinions(request):
	"""
		This view returns the filtered list of opinions on the opinions page
	"""
	# Get the context from the request.
	context = RequestContext(request)

	if request.user.id:
		profile = ExUserProfile.objects.get(user=request.user.id)
	else:
		profile = False
	
	# offset = int(offset)
	#store toolbar form info
	toolbar={'searchClass':'All',
			 'searchTeam':'All'}
			 
	#get search class
	searchClass = request.GET.get("class","All")

	#get search teams
	searchTeam = request.GET.get("team","All")
		
	#build query
	kwargs = {}
	# show only published media
	kwargs['published__exact'] = True
	
	# interim query steps
	kwargsClassTeam = {}
	kwargsClass = {}
	kwargsTeam = {}
	if(searchClass != "All" and searchTeam != "All"):
		# break searchClass apart
		classArray = searchClass.split('_')
		kwargsClassTeam['teacherId__exact'] = classArray[0]
		kwargsClassTeam['section__exact'] = classArray[1]
		kwargsClassTeam['color__exact'] = searchTeam
		classRequest = ExUserProfile.objects.filter(**kwargsClassTeam).values_list('user', flat=True)
		kwargs['user__in'] = classRequest
		toolbar['searchClass'] = searchClass
		toolbar['searchTeam'] = searchTeam
	
	else:     
		if(searchClass != "All"):
			# break searchClass apart
			classArray = searchClass.split('_')
			kwargsClass['teacherId__exact'] = classArray[0]
			kwargsClass['section__exact'] = classArray[1]
			classRequest = ExUserProfile.objects.filter(**kwargsClass).values_list('user', flat=True)
			kwargs['user__in'] = classRequest
			toolbar['searchClass'] = searchClass

		if(searchTeam != "All"):
			kwargsTeam['color__exact'] = searchTeam
			classRequest = ExUserProfile.objects.filter(**kwargsTeam).values_list('user', flat=True)
			kwargs['user__in'] = classRequest
			toolbar['searchTeam'] = searchTeam


	#get opinions
	opinions = Opinions.objects.filter(**kwargs).distinct().order_by('-last_modified')
	
	# get cover photos
	coverKwargs = {}
	coverIds = list()

	for opinion in opinions:
		if opinion.coverPhoto:
			coverIds.append(opinion.coverPhoto.id)
			
	coverKwargs['pk__in'] = coverIds
	
	coverPhotoImages = MediaImage.objects.filter(**coverKwargs)    
	
	paginator = Paginator(opinions, 20) # show 20 per page
	number_of_pages = paginator.num_pages

	page = request.GET.get('page')
	try:
		opinions_list = paginator.page(page)
	except PageNotAnInteger:
		# If page is not an integer, deliver first page.
		opinions_list = paginator.page(1)
	except EmptyPage:
		# If page is out of range (e.g. 9999), deliver last page of results.
		opinions_list = paginator.page(paginator.num_pages)	 

	# get list of tachers and sections
	classes = ExUserProfile.objects.filter(teacherOrStudent=False).values('teacherId', 'teacherName', 'section').order_by('teacherName', 'section').distinct()
		
	# get list of teams across all classes
	teams = ExUserProfile.objects.filter(teacherOrStudent=False).values_list('color', flat=True).order_by('color').distinct() 
	
	#render
	return render_to_response('CashCity/filterOpinions.html', {'opinions':opinions_list, 'coverPhotoImages': coverPhotoImages, 'classes':classes, 'teams':teams, 'toolbar':toolbar, 'profile':profile, 'number_of_pages':number_of_pages}, context)


def mediaPageImage(request, id=None):
	"""
	  Loads a page for an image
	"""
	context = RequestContext(request)

	#get user profile data and pass to view -- don't print comment form is user is not logged in
	if request.user.id:
		profile = ExUserProfile.objects.get(user=request.user.id)
		comment_form = MediaFormImageComment()
	else:
		profile = False
		comment_form = False
	
	if id:
		mediaImageObject = MediaImage.objects.get(pk=id)
	else:
		return HttpResponseRedirect('/cashcity/media/')
		
	if request.method == 'POST':
		comment_form = MediaFormImageComment(data=request.POST)
		if comment_form.is_valid():
			c = comment_form.save(commit=False)       
			# add current user
			c.user = request.user
			# add media id
			c.mediaImage = mediaImageObject
			c.save()

			success = True
			# get MediaImageComments
			comments = MediaImageComments.objects.filter(mediaImage=id)
			
			# send along blank comment form
			comment_form = MediaFormImageComment()
			
			return render_to_response('CashCity/mediaPageImage.html', {'mediaImageObject': mediaImageObject, 'comments':comments, 'comment_form':comment_form, 'success': success, 'profile':profile}, context)
			
		else:
			print comment_form.errors
			
	else:
		# get MediaImageComments
		comments = MediaImageComments.objects.filter(mediaImage=id)

	return render_to_response('CashCity/mediaPageImage.html', {'mediaImageObject': mediaImageObject, 'comments':comments, 'comment_form':comment_form, 'profile':profile}, context)


def mediaPageAudio(request, id=None):
	"""
	  Loads a page for an audio file
	"""
	context = RequestContext(request)

	#get user profile data and pass to view -- don't print comment form is user is not logged in
	if request.user.id:
		profile = ExUserProfile.objects.get(user=request.user.id)
		comment_form = MediaFormAudioComment()
	else:
		profile = False
		comment_form = False
	
	if id:
		mediaAudioObject = MediaAudio.objects.get(pk=id)
	else:
		return HttpResponseRedirect('/cashcity/media/')
		
	if request.method == 'POST':
		comment_form = MediaFormAudioComment(data=request.POST)
		if comment_form.is_valid():
			c = comment_form.save(commit=False)       
			# add current user
			c.user = request.user
			# add media id
			c.mediaAudio = mediaAudioObject
			c.save()

			success = True
			# get MediaAudioComments
			comments = MediaAudioComments.objects.filter(mediaAudio=id)
			
			# send along blank comment form
			comment_form = MediaFormAudioComment()
			
			return render_to_response('CashCity/mediaPageAudio.html', {'mediaAudioObject': mediaAudioObject, 'comments':comments, 'comment_form':comment_form, 'success': success, 'profile':profile}, context)
			
		else:
			print comment_form.errors
			
	else:
		# get MediaAudioComments
		comments = MediaAudioComments.objects.filter(mediaAudio=id)

	return render_to_response('CashCity/mediaPageAudio.html', {'mediaAudioObject': mediaAudioObject, 'comments':comments, 'comment_form':comment_form, 'profile':profile}, context)
	
	
def mediaPageNote(request, id=None):
	"""
	  Loads a page for a note
	"""
	context = RequestContext(request)

	#get user profile data and pass to view -- don't print comment form is user is not logged in
	if request.user.id:
		profile = ExUserProfile.objects.get(user=request.user.id)
		comment_form = MediaFormNoteComment()
	else:
		profile = False
		comment_form = False
	
	if id:
		mediaNoteObject = MediaNote.objects.get(pk=id)
	else:
		return HttpResponseRedirect('/cashcity/media/')
		
	if request.method == 'POST':
		comment_form = MediaFormNoteComment(data=request.POST)
		if comment_form.is_valid():
			c = comment_form.save(commit=False)       
			# add current user
			c.user = request.user
			# add media id
			c.mediaNote = mediaNoteObject
			c.save()

			success = True
			# get MediaNoteComments
			comments = MediaNoteComments.objects.filter(mediaNote=id)
			
			# send along blank comment form
			comment_form = MediaFormNoteComment()
			
			return render_to_response('CashCity/mediaPageNote.html', {'mediaNoteObject': mediaNoteObject, 'comments':comments, 'comment_form':comment_form, 'success': success, 'profile':profile}, context)
			
		else:
			print comment_form.errors
			
	else:
		# get MediaNoteComments
		comments = MediaNoteComments.objects.filter(mediaNote=id)

	return render_to_response('CashCity/mediaPageNote.html', {'mediaNoteObject': mediaNoteObject, 'comments':comments, 'comment_form':comment_form, 'profile':profile}, context)


def mediaPageInterview(request, id=None):
	"""
	  Loads a page for an interview
	"""
	context = RequestContext(request)

	#get user profile data and pass to view -- don't print comment form is user is not logged in
	if request.user.id:
		profile = ExUserProfile.objects.get(user=request.user.id)
		comment_form = MediaFormInterviewComment()
	else:
		profile = False
		comment_form = False
	
	if id:
		mediaInterviewObject = MediaInterview.objects.get(pk=id)
	else:
		return HttpResponseRedirect('/cashcity/media/')
		
	if request.method == 'POST':
		comment_form = MediaFormInterviewComment(data=request.POST)
		if comment_form.is_valid():
			c = comment_form.save(commit=False)       
			# add current user
			c.user = request.user
			# add media id
			c.mediaInterview = mediaInterviewObject
			c.save()

			success = True
			# get MediaInterviewComments
			comments = MediaInterviewComments.objects.filter(mediaInterview=id)
			
			# send along blank comment form
			comment_form = MediaFormInterviewComment()
			
			return render_to_response('CashCity/mediaPageInterview.html', {'mediaInterviewObject': mediaInterviewObject, 'comments':comments, 'comment_form':comment_form, 'success': success, 'profile':profile}, context)
			
		else:
			print comment_form.errors
			
	else:
		# get MediaInterviewComments
		comments = MediaInterviewComments.objects.filter(mediaInterview=id)

	return render_to_response('CashCity/mediaPageInterview.html', {'mediaInterviewObject': mediaInterviewObject, 'comments':comments, 'comment_form':comment_form, 'profile':profile}, context)



@login_required
def SaveMap(request):
	context = RequestContext(request)
	
	#get user profile data and pass to view
	if request.user.id:
		profile = ExUserProfile.objects.get(user=request.user.id)
	else:
		profile = False 
	
	latitude = request.GET.get("latitude","")
	longitude= request.GET.get("longitude","")
	zoom= request.GET.get("zoom","")
	MapLayer= request.GET.get("MapLayer","")
	PawnShops= request.GET.get("PawnShops","") == 'true'
	CheckCashing= request.GET.get("CheckCashing","") == 'true'
	WireTransfer= request.GET.get("WireTransfer","") == 'true'
	Banks= request.GET.get("Banks","") == 'true'
	McDonalds= request.GET.get("McDonalds","") == 'true'
	SubwayLines= request.GET.get("SubwayLines","") == 'true'
	Media= request.GET.get("Media","") == 'true'
	title = request.GET.get("title","")
	popup2Content= request.GET.get("popup2Content","")
	popup2LatLon= request.GET.get("popup2LatLon","")
	popup3Content= request.GET.get("popup3Content","")
	popup3LatLon= request.GET.get("popup3LatLon","")
	chartOn= request.GET.get("chartOn","") == 'true'
	
	MapDetails = MapSettings(latitude=latitude, longitude=longitude, zoom=zoom, MapLayer=MapLayer, PawnShops=PawnShops, CheckCashing=CheckCashing, WireTransfer=WireTransfer, Banks=Banks, McDonalds=McDonalds, SubwayLines=SubwayLines, Media=Media, title=title, popup2Content=popup2Content, popup2LatLon=popup2LatLon, popup3Content=popup3Content, popup3LatLon=popup3LatLon, chartOn=chartOn, user=request.user)
	
	MapDetails.save()
	
	#new query for mapSnaps
	kwargs = {}

	#get user profile data and pass to view
	if request.user.id:
		# show only media tied to this student group's account
		kwargs['user__exact'] = request.user.id
		#get mapSnaps
		mapSnaps = MapSettings.objects.filter(**kwargs)
		
		# loop throuhg mapSnaps and increase zoom to way out
		for mapSnap in mapSnaps:
			mapSnap.zoom = mapSnap.zoom - 3
			   
	else:
		mapSnaps = {}     
		  
	context_dict = {'mapSnaps':mapSnaps, 'profile':profile}

	return render_to_response('CashCity/mapSnapThumbnails.html', context_dict, context)
	
	
@login_required
def RemoveMap(request):
	context = RequestContext(request)
	
	#get user profile data and pass to view
	if request.user.id:
		profile = ExUserProfile.objects.get(user=request.user.id)
	else:
		profile = False 
	  
	mapId = request.GET.get("mapId","")
	
	if mapId:
		mapSettings = MapSettings.objects.get(pk=mapId)
		mapSettings.delete()
	
	#new query for mapSnaps
	kwargs = {}

	#get user profile data and pass to view
	if request.user.id:
		# show only media tied to this student group's account
		kwargs['user__exact'] = request.user.id
		#get mapSnaps
		mapSnaps = MapSettings.objects.filter(**kwargs)
		
		# loop throuhg mapSnaps and increase zoom to way out
		for mapSnap in mapSnaps:
			mapSnap.zoom = mapSnap.zoom - 3
			   
	else:
		mapSnaps = {}     
		  
	context_dict = {'mapSnaps':mapSnaps, 'profile':profile, 'id':id}

	return render_to_response('CashCity/mapSnapThumbnails.html', context_dict, context)


# view for opinion form
@login_required
def opinionForm(request, id=None):
	"""
	  Adding and editing opinions
	"""
	# Get the context from the request.
	context = RequestContext(request)

	#get user profile data and pass to view
	profile = ExUserProfile.objects.get(user=request.user) 
	
	#set Opinions Sections up as a formset -- 5 total repetitons of form
	OpinionSectionsFormset = modelformset_factory(OpinionSections, extra=5, max_num=5, form=OpinionSectionsForm)
	
	# get ALL media and map snaps for opinions
	#build query
	kwargs = {}
	# show only published media
	kwargs['published__exact'] = True
	
	# show only media tied to this teacher's student groups
	classRequest = list(ExUserProfile.objects.filter(user=request.user.id).values_list('teacherId', flat=True))
	#add in the teacher's own account
	classRequest.append(request.user.id)
	kwargs['user__in'] = classRequest
	

	#get mediaImages
	mediaImages = MediaImage.objects.filter(**kwargs).order_by('-last_modified')

	#get mediaAudio
	mediaAudio = MediaAudio.objects.filter(**kwargs).order_by('-last_modified')

	#get mediaNote
	mediaNote = MediaNote.objects.filter(**kwargs).order_by('-last_modified')

	#get mediaInterview
	mediaInterview = MediaInterview.objects.filter(**kwargs).order_by('-last_modified')

	#build query
	kwargs = {}

	if profile.teacherOrStudent:
		# show only media tied to this teacher's student groups
		classRequest = list(ExUserProfile.objects.filter(teacherId=request.user.id).values_list('user', flat=True))
		#add in the teacher's own account
		classRequest.append(request.user.id)
		kwargs['user__in'] = classRequest
	else:   
		kwargs['user__exact'] = request.user.id


	#get mapSnaps
	mapSnaps = MapSettings.objects.filter(**kwargs).order_by('-last_modified')
	
	# loop throuhg mapSnaps and increase zoom to way out
	for mapSnap in mapSnaps:
		mapSnap.zoom = mapSnap.zoom - 3
	 
	
	if id:
		opinion = Opinions.objects.get(pk=id)
		# select cover photo image, if it exists
		if opinion.coverPhoto:
			coverPhotoImage = MediaImage.objects.get(pk=opinion.coverPhoto.id)
		else:
			coverPhotoImage = False    
				
		opinionSections = OpinionSections.objects.filter(opinion=opinion).order_by('sectionNumber')
		formsetQueryset = opinionSections
	else:
		opinion = Opinions()
		coverPhotoImage = False
		opinionSections = OpinionSections.objects.none();
		formsetQueryset = opinionSections
		

	# A HTTP POST?
	if request.method == 'POST':
		# if user hits cancel, send back to media page without saving
		if "cancel" in request.POST:
			if profile.teacherOrStudent:
				return HttpResponseRedirect('/cashcity/accounts/profile/opinion/')
			else:   
				return HttpResponseRedirect('/cashcity/accounts/profile/student/opinion/')
				
		# if user hits save as draft, flag data in media image table as draft
		elif "saveDraft" in request.POST: 
			# store forms         
			opinionsForm = OpinionsForm(request.POST, request.FILES, instance=opinion)                
			opinionSectionsFormset = OpinionSectionsFormset(request.POST, request.FILES, queryset=formsetQueryset)
			
			#save opinion for first            
			# Have we been provided with a valid form?
			if opinionsForm.is_valid():
					
				# Save the new data to the database.
				f = opinionsForm.save(commit=False)
				
				# add user 
				f.user = request.user

				# mark as draft
				f.published = False
				f.save()
				
				# store opinionId for later
				opinionId = f.id                                               
				
				# now save opinion sections attaching it to the correct Opinion PK          
				# Have we been provided with a valid form?
				if opinionSectionsFormset.is_valid():

					# get opnions instace
					opinionObject = Opinions.objects.get(pk=opinionId)
																  
					# save the opinion sections
					fs = opinionSectionsFormset.save(commit=False)
				
					for form in fs:
						form.opinion = opinionObject
				
						form.save()
					
					if profile.teacherOrStudent:
						return HttpResponseRedirect('/cashcity/accounts/profile/opinion/')
					else:   
						return HttpResponseRedirect('/cashcity/accounts/profile/student/opinion/')
		   
				else:
					# The supplied form contained errors - just print them to the terminal.
					print opinionSectionsFormset.errors


			else:
				# The supplied form contained errors - just print them to the terminal.
				print opinionsForm.errors
					  
 
		else:
			
			# store forms         
			opinionsForm = OpinionsForm(request.POST, request.FILES, instance=opinion)                
			opinionSectionsFormset = OpinionSectionsFormset(request.POST, request.FILES, queryset=formsetQueryset)
			
			#save opinion for first            
			# Have we been provided with a valid form?
			if opinionsForm.is_valid():
					
				# Save the new data to the database.
				f = opinionsForm.save(commit=False)
				
				# add user 
				f.user = request.user

				# mark as draft
				f.published = True
				f.save()
				
				# store opinionId for later
				opinionId = f.id                                               
				
				# now save opinion sections attaching it to the correct Opinion PK          
				# Have we been provided with a valid form?
				if opinionSectionsFormset.is_valid():

					# get opnions instace
					opinionObject = Opinions.objects.get(pk=opinionId)
																  
					# save the opinion sections
					fs = opinionSectionsFormset.save(commit=False)
				
					for form in fs:
						form.opinion = opinionObject
				
						form.save()
					
					if profile.teacherOrStudent:
						return HttpResponseRedirect('/cashcity/accounts/profile/opinion/')
					else:   
						return HttpResponseRedirect('/cashcity/accounts/profile/student/opinion/')
		   
				else:
					# The supplied form contained errors - just print them to the terminal.
					print opinionSectionsFormset.errors


			else:
				# The supplied form contained errors - just print them to the terminal.
				print opinionsForm.errors

				
	else:
		
		# not a POST request
		opinionsForm = OpinionsForm(instance=opinion)
		opinionSectionsFormset = OpinionSectionsFormset(queryset=formsetQueryset)
		

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render_to_response('CashCity/opinionForm.html', {'opinionsForm': opinionsForm, 'opinionSectionsFormset': opinionSectionsFormset, 'coverPhotoImage':coverPhotoImage, 'profile':profile, 'mediaImages': mediaImages, 'mediaAudio':mediaAudio, 'mediaNote':mediaNote, 'mediaInterview':mediaInterview, 'mapSnaps':mapSnaps, 'opinion':opinion}, context)



@login_required
def opinionFormRemove(request, id=None):
	"""
	  Allows for removing of opinions
	"""
	context = RequestContext(request)

	#get user profile data and pass to view
	profile = ExUserProfile.objects.get(user=request.user)    
	
	if id:
		opinion = Opinions.objects.get(pk=id)
			   
	# A HTTP POST?
	if request.method == 'POST':
		# if user hits cancel, send back to media page without saving
		if "cancel" in request.POST:
			if profile.teacherOrStudent:
				return HttpResponseRedirect('/cashcity/accounts/profile/opinion/')
			else:   
				return HttpResponseRedirect('/cashcity/accounts/profile/student/opinion/')
		# user has clicked save
		else:
			opinion.delete()
		
			if profile.teacherOrStudent:
				return HttpResponseRedirect('/cashcity/accounts/profile/opinion/')
			else:   
				return HttpResponseRedirect('/cashcity/accounts/profile/student/opinion/')            
			
	if profile.teacherOrStudent:
		template = 'CashCity/opinionRemove.html'
	else:
		template = 'CashCity/opinionRemoveStudent.html'
		

	return render_to_response(template, {'opinion': opinion, 'profile':profile}, context)    


@login_required
def opinionSaveDraft(request, id=None):
	"""
	  Allows for moving opinions to draft
	"""
	context = RequestContext(request)

	#get user profile data and pass to view
	profile = ExUserProfile.objects.get(user=request.user)    
	
	if id:
		opinion = Opinions.objects.get(pk=id)
		opinion.published = False
		opinion.save()
		if profile.teacherOrStudent:
			return HttpResponseRedirect('/cashcity/accounts/profile/opinion/')
		else:   
			return HttpResponseRedirect('/cashcity/accounts/profile/student/opinion/')
	
	else:  
		if profile.teacherOrStudent:
			return HttpResponseRedirect('/cashcity/accounts/profile/opinion/')
		else:   
			return HttpResponseRedirect('/cashcity/accounts/profile/student/opinion/')            
			

@login_required
def opinionPublish(request, id=None):
	"""
	  Allows for moving opinions to published
	"""
	context = RequestContext(request)

	#get user profile data and pass to view
	profile = ExUserProfile.objects.get(user=request.user)    
	
	if id:
		opinion = Opinions.objects.get(pk=id)
		opinion.published = True
		opinion.save()
		if profile.teacherOrStudent:
			return HttpResponseRedirect('/cashcity/accounts/profile/opinion/')
		else:   
			return HttpResponseRedirect('/cashcity/accounts/profile/student/opinion/')
	
	else:  
		if profile.teacherOrStudent:
			return HttpResponseRedirect('/cashcity/accounts/profile/opinion/')
		else:   
			return HttpResponseRedirect('/cashcity/accounts/profile/student/opinion/') 

		   
def opinionPage(request, id=None):
	"""
	  Loads a page for an opinion
	"""
	context = RequestContext(request)

	#get user profile data and pass to view -- don't print comment form if user is not logged in
	if request.user.id:
		profile = ExUserProfile.objects.get(user=request.user.id)
		comment_form = OpinionsFormComment()
	else:
		profile = False
		comment_form = False
	
	if id:
		opinionObject = Opinions.objects.get(pk=id)
		# select cover photo image, if it exists
		if opinionObject.coverPhoto:
			coverPhotoImage = MediaImage.objects.get(pk=opinionObject.coverPhoto.id)
		else:
			coverPhotoImage = False    
		
		opinionSections = OpinionSections.objects.filter(opinion=opinionObject).order_by('sectionNumber');
		imageKwargs = {}
		imageIds = list()
		audioKwargs = {}
		audioIds = list()
		noteKwargs = {}
		noteIds = list()
		interviewKwargs = {}
		interviewIds = list()
		mapSnapKwargs = {}
		mapSnapIds = list()

		for section in opinionSections:
			if section.image:
				imageIds.append(section.image.id)
			if section.audio:
				audioIds.append(section.audio.id)
			if section.note:
				noteIds.append(section.note.id)
			if section.interview:
				interviewIds.append(section.interview.id)
			if section.mapSnap:
				mapSnapIds.append(section.mapSnap.id)
				
		imageKwargs['pk__in'] = imageIds
		audioKwargs['pk__in'] = audioIds
		noteKwargs['pk__in'] = noteIds
		interviewKwargs['pk__in'] = interviewIds
		mapSnapKwargs['pk__in'] = mapSnapIds
		
		mediaImages = MediaImage.objects.filter(**imageKwargs)
		mediaAudio = MediaAudio.objects.filter(**audioKwargs)
		mediaNotes = MediaNote.objects.filter(**noteKwargs)
		mediaInterviews = MediaInterview.objects.filter(**interviewKwargs)
		mapSnaps = MapSettings.objects.filter(**mapSnapKwargs)
		
		# loop throuhg mapSnaps and increase zoom by 1
		for mapSnap in mapSnaps:
			mapSnap.zoom = mapSnap.zoom - 1
		
				
		
	else:
		return HttpResponseRedirect('/cashcity/opinion/')
		
	if request.method == 'POST':
		comment_form = OpinionsFormComment(data=request.POST)
		if comment_form.is_valid():
			c = comment_form.save(commit=False)       
			# add current user
			c.user = request.user
			# add opinion id
			c.opinion = opinionObject
			c.save()

			success = True
			# get opinionComments
			comments = OpinionComments.objects.filter(opinion=id)
			
			# send along blank comment form
			comment_form = OpinionsFormComment()
			
			return render_to_response('CashCity/opinionPage.html', {'opinionObject': opinionObject, 'coverPhotoImage': coverPhotoImage, 'opinionSections': opinionSections, 'mediaImages':mediaImages, 'mediaAudio':mediaAudio, 'mediaNotes':mediaNotes, 'mediaInterviews':mediaInterviews, 'mapSnaps':mapSnaps, 'comments':comments, 'comment_form':comment_form, 'success': success, 'profile':profile}, context)
			
		else:
			print comment_form.errors
			
	else:
		# get MediaInterviewComments
		comments = OpinionComments.objects.filter(opinion=id)

	return render_to_response('CashCity/opinionPage.html', {'opinionObject': opinionObject, 'coverPhotoImage': coverPhotoImage, 'opinionSections': opinionSections, 'mediaImages':mediaImages, 'mediaAudio':mediaAudio, 'mediaNotes':mediaNotes, 'mediaInterviews':mediaInterviews, 'mapSnaps':mapSnaps,'comments':comments, 'comment_form':comment_form, 'profile':profile}, context)
	
	
	
@login_required
def opinionFormCommentRemove(request, id=None):
	"""
	  Allows for removing of opinion comments
	"""
	context = RequestContext(request)

	#get user profile data and pass to view -- don't print comment form is user is not logged in
	if request.user.id:
		profile = ExUserProfile.objects.get(user=request.user.id)
		comment_form = OpinionsFormComment()
	else:
		profile = False
		comment_form = False

	if id:
		comment = OpinionComments.objects.get(pk=id)  
		opinionObject = Opinions.objects.get(pk=comment.opinion.id)
		comment.delete()
		
		opinionSections = OpinionSections.objects.filter(opinion=opinionObject).order_by('sectionNumber');
		imageKwargs = {}
		imageIds = list()
		audioKwargs = {}
		audioIds = list()
		noteKwargs = {}
		noteIds = list()
		interviewKwargs = {}
		interviewIds = list()
		mapSnapKwargs = {}
		mapSnapIds = list()

		for section in opinionSections:
			if section.image:
				imageIds.append(section.image.id)
			if section.audio:
				audioIds.append(section.audio.id)
			if section.note:
				noteIds.append(section.note.id)
			if section.interview:
				interviewIds.append(section.interview.id)
			if section.mapSnap:
				mapSnapIds.append(section.mapSnap.id)
			
		imageKwargs['pk__in'] = imageIds
		audioKwargs['pk__in'] = audioIds
		noteKwargs['pk__in'] = noteIds
		interviewKwargs['pk__in'] = interviewIds
		mapSnapKwargs['pk__in'] = mapSnapIds
	
		mediaImages = MediaImage.objects.filter(**imageKwargs)
		mediaAudio = MediaAudio.objects.filter(**audioKwargs)
		mediaNotes = MediaNote.objects.filter(**noteKwargs)
		mediaInterviews = MediaInterview.objects.filter(**interviewKwargs)
		mapSnaps = MapSettings.objects.filter(**mapSnapKwargs)
	
		# loop throuhg mapSnaps and increase zoom by 1
		for mapSnap in mapSnaps:
			mapSnap.zoom = mapSnap.zoom - 1
		

	# get MediaNoteComments
	comments = MediaNoteComments.objects.filter(mediaNote=id) 

	# removed
	removed = True                           

	return render_to_response('CashCity/opinionPage.html', {'opinionObject': opinionObject, 'opinionSections': opinionSections, 'mediaImages':mediaImages, 'mediaAudio':mediaAudio, 'mediaNotes':mediaNotes, 'mediaInterviews':mediaInterviews, 'mapSnaps':mapSnaps,'comments':comments, 'comment_form':comment_form, 'profile':profile, 'removed':removed}, context)
