# includes
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.http import HttpResponseRedirect

# user and profile models
from django.contrib.auth.models import User

# teacher registration form
from registration.forms import RegistrationForm

# import all forms for city digits app
from CashCity.forms import *



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
    context_dict = {'profile':profile}

    return render_to_response('CashCity/index.html', context_dict, context)


def mapNavigation(request):
    """
      Loads the map navigation elements
    """
    context = RequestContext(request)
    context_dict = {}
   
    return render_to_response('CashCity/map_navigation.html', context_dict, context)


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
        return HttpResponseRedirect('/accounts/profile/student/media/')
    
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
def studentProfileMedia(request):
    """
      Loads the student profile page, which allows access to their media and opinions
    """
    context = RequestContext(request)
    
    #get user profile data and pass to view
    profile = ExUserProfile.objects.get(user=request.user)
    
    #build query
    kwargs = {}
    kwargs['user__exact'] = request.user

    #get mediaImages
    mediaImages = MediaImage.objects.filter(**kwargs).order_by("-last_modified")
    
    return render_to_response('registration/student_profile.html', {'mediaImages': mediaImages, 'profile':profile}, context)


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
            return HttpResponseRedirect('/accounts/profile/teams/')
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
                profile.name = u.username
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
            return HttpResponseRedirect('/accounts/profile/teams/')
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
def mediaFormImage(request):
    # Get the context from the request.
    context = RequestContext(request)

    #get user profile data and pass to view
    profile = ExUserProfile.objects.get(user=request.user)    

    # A HTTP POST?
    if request.method == 'POST':
        # if user hits cancel, send back to media page without saving
        if "cancel" in request.POST:
            return HttpResponseRedirect('/cashcity/media/')
        # if user hits save as draft, flag data in media image table as draft
        elif "saveDraft" in request.POST:
            form = MediaFormImage(request.POST, request.FILES)
        
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
            
                return HttpResponseRedirect('/cashcity/media/') # Redirect after POST
            else:
                # The supplied form contained errors - just print them to the terminal.
                print form.errors            

        else:
            form = MediaFormImage(request.POST, request.FILES)
        
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
            
                return HttpResponseRedirect('/cashcity/media/') # Redirect after POST
            else:
                # The supplied form contained errors - just print them to the terminal.
                print form.errors
                
    else:
        # If the request was not a POST, display the form to enter details.
        form = MediaFormImage()

    # Bad form (or form details), no form supplied...
    # Render the form with error messages (if any).
    return render_to_response('CashCity/mediaFormImage.html', {'form': form, 'profile':profile}, context)
    

# view for media audio form
@login_required
def mediaFormAudio(request):
    # Get the context from the request.
    context = RequestContext(request)

    #get user profile data and pass to view
    profile = ExUserProfile.objects.get(user=request.user)    

    # A HTTP POST?
    if request.method == 'POST':
        # if user hits cancel, send back to media page without saving
        if "cancel" in request.POST:
            return HttpResponseRedirect('/cashcity/media/')

        # if user hits save as draft, flag data in media Audio table as draft
        elif "saveDraft" in request.POST:
            form = MediaFormAudio(request.POST, request.FILES)
        
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
            
                return HttpResponseRedirect('/cashcity/media/') # Redirect after POST
            else:
                # The supplied form contained errors - just print them to the terminal.
                print form.errors            

        else:
            form = MediaFormAudio(request.POST, request.FILES)
        
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
            
                return HttpResponseRedirect('/cashcity/media/') # Redirect after POST
            else:
                # The supplied form contained errors - just print them to the terminal.
                print form.errors
                
    else:
        # If the request was not a POST, display the form to enter details.
        form = MediaFormAudio()

    # Bad form (or form details), no form supplied...
    # Render the form with error messages (if any).
    return render_to_response('CashCity/mediaFormAudio.html', {'form': form, 'profile':profile}, context)
    
    
# view for media notes form
@login_required
def mediaFormNote(request):
    # Get the context from the request.
    context = RequestContext(request)

    #get user profile data and pass to view
    profile = ExUserProfile.objects.get(user=request.user)    

    # A HTTP POST?
    if request.method == 'POST':
        # if user hits cancel, send back to media page without saving
        if "cancel" in request.POST:
            return HttpResponseRedirect('/cashcity/media/')

        # if user hits save as draft, flag data in media Audio table as draft
        elif "saveDraft" in request.POST:
            form = MediaFormNote(request.POST)
        
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
            
                return HttpResponseRedirect('/cashcity/media/') # Redirect after POST
            else:
                # The supplied form contained errors - just print them to the terminal.
                print form.errors            

        else:
            form = MediaFormNote(request.POST)
        
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
            
                return HttpResponseRedirect('/cashcity/media/') # Redirect after POST
            else:
                # The supplied form contained errors - just print them to the terminal.
                print form.errors
                
    else:
        # If the request was not a POST, display the form to enter details.
        form = MediaFormNote()

    # Bad form (or form details), no form supplied...
    # Render the form with error messages (if any).
    return render_to_response('CashCity/mediaFormNote.html', {'form': form, 'profile':profile}, context)
    
    
# view for media image form
@login_required
def mediaFormInterview(request):
    # Get the context from the request.
    context = RequestContext(request)

    #get user profile data and pass to view
    profile = ExUserProfile.objects.get(user=request.user)    

    # A HTTP POST?
    if request.method == 'POST':
        # if user hits cancel, send back to media page without saving
        if "cancel" in request.POST:
            return HttpResponseRedirect('/cashcity/media/')

        # if user hits save as draft, flag data in media image table as draft
        elif "saveDraft" in request.POST:
            form = MediaFormInterview(request.POST, request.FILES)
        
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
            
                return HttpResponseRedirect('/cashcity/media/') # Redirect after POST
            else:
                # The supplied form contained errors - just print them to the terminal.
                print form.errors            

        else:
            form = MediaFormInterview(request.POST, request.FILES)
        
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
            
                return HttpResponseRedirect('/cashcity/media/') # Redirect after POST
            else:
                # The supplied form contained errors - just print them to the terminal.
                print form.errors
                
    else:
        # If the request was not a POST, display the form to enter details.
        form = MediaFormInterview()

    # Bad form (or form details), no form supplied...
    # Render the form with error messages (if any).
    return render_to_response('CashCity/mediaFormInterview.html', {'form': form, 'profile':profile}, context)
    


def media(request):
    """
        This view returns the list of media based on search criteria
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
             'searchTags':'All'}
             
    #get search teams
    searchType = request.GET.get("type","All")

    #get search class
    searchClass = request.GET.get("class","All")

    #get search teams
    searchTeam = request.GET.get("team","All")

    #get search tags
    searchTags = request.GET.get("tags","All")
    
    #build query
    kwargs = {}
    if(searchClass != "All"):
        kwargs['student__team__teacher__className__exact'] = searchClass
        toolbar['searchClass'] = searchClass

    if(searchTeam != "All"):
        kwargs['student__team__name__exact'] = searchTeam
        toolbar['searchTeam'] = searchTeam


    #get mediaImages
    mediaImages = MediaImage.objects.filter(**kwargs).order_by("-last_modified")


    #render
    return render_to_response('CashCity/media.html', {'mediaImages':mediaImages, 'toolbar':toolbar, 'profile':profile}, context)

