# Create your views here.
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.http import HttpResponseRedirect

# forms for city digits app
from follow_the_money.forms import MediaFormImage
from follow_the_money.forms import MediaFormAudio
from follow_the_money.forms import MediaFormNote
from follow_the_money.forms import MediaFormInterview


def index(request):
    """
      Loads the index page
    """
    context = RequestContext(request)
    context_dict = {}

    return render_to_response('follow_the_money/index.html', context_dict, context)


def mapNavigation(request):
    """
      Loads the map navigation elements
    """
    context = RequestContext(request)
    context_dict = {}
   
    return render_to_response('follow_the_money/map_navigation.html', context_dict, context)


@login_required
def restricted(request):
    return HttpResponse("Since you're logged in, you can see this text!")
    

def media(request):
    """
      Loads the media page
    """
    context = RequestContext(request)
    context_dict = {}
   
    return render_to_response('follow_the_money/media.html', context_dict, context)    


# view for media image form
@login_required
def mediaFormImage(request):
    # Get the context from the request.
    context = RequestContext(request)

    # A HTTP POST?
    if request.method == 'POST':
        # if user hits cancel, send back to media page without saving
        if "cancel" in request.POST:
            return HttpResponseRedirect('/follow-the-money/media/')
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
            
                return HttpResponseRedirect('/follow-the-money/media/') # Redirect after POST
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
            
                return HttpResponseRedirect('/follow-the-money/media/') # Redirect after POST
            else:
                # The supplied form contained errors - just print them to the terminal.
                print form.errors
                
    else:
        # If the request was not a POST, display the form to enter details.
        form = MediaFormImage()

    # Bad form (or form details), no form supplied...
    # Render the form with error messages (if any).
    return render_to_response('follow_the_money/mediaFormImage.html', {'form': form}, context)
    

# view for media audio form
@login_required
def mediaFormAudio(request):
    # Get the context from the request.
    context = RequestContext(request)

    # A HTTP POST?
    if request.method == 'POST':
        # if user hits cancel, send back to media page without saving
        if "cancel" in request.POST:
            return HttpResponseRedirect('/follow-the-money/media/')
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
            
                return HttpResponseRedirect('/follow-the-money/media/') # Redirect after POST
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
            
                return HttpResponseRedirect('/follow-the-money/media/') # Redirect after POST
            else:
                # The supplied form contained errors - just print them to the terminal.
                print form.errors
                
    else:
        # If the request was not a POST, display the form to enter details.
        form = MediaFormAudio()

    # Bad form (or form details), no form supplied...
    # Render the form with error messages (if any).
    return render_to_response('follow_the_money/mediaFormAudio.html', {'form': form}, context)
    
    
# view for media notes form
@login_required
def mediaFormNote(request):
    # Get the context from the request.
    context = RequestContext(request)

    # A HTTP POST?
    if request.method == 'POST':
        # if user hits cancel, send back to media page without saving
        if "cancel" in request.POST:
            return HttpResponseRedirect('/follow-the-money/media/')
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
            
                return HttpResponseRedirect('/follow-the-money/media/') # Redirect after POST
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
            
                return HttpResponseRedirect('/follow-the-money/media/') # Redirect after POST
            else:
                # The supplied form contained errors - just print them to the terminal.
                print form.errors
                
    else:
        # If the request was not a POST, display the form to enter details.
        form = MediaFormNote()

    # Bad form (or form details), no form supplied...
    # Render the form with error messages (if any).
    return render_to_response('follow_the_money/mediaFormNote.html', {'form': form}, context)
    
    
# view for media image form
@login_required
def mediaFormInterview(request):
    # Get the context from the request.
    context = RequestContext(request)

    # A HTTP POST?
    if request.method == 'POST':
        # if user hits cancel, send back to media page without saving
        if "cancel" in request.POST:
            return HttpResponseRedirect('/follow-the-money/media/')
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
            
                return HttpResponseRedirect('/follow-the-money/media/') # Redirect after POST
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
            
                return HttpResponseRedirect('/follow-the-money/media/') # Redirect after POST
            else:
                # The supplied form contained errors - just print them to the terminal.
                print form.errors
                
    else:
        # If the request was not a POST, display the form to enter details.
        form = MediaFormInterview()

    # Bad form (or form details), no form supplied...
    # Render the form with error messages (if any).
    return render_to_response('follow_the_money/mediaFormInterview.html', {'form': form}, context)
    
