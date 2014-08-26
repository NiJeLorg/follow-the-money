# Create your views here.
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.http import HttpResponseRedirect

# forms for city digits app
from follow_the_money.forms import MediaFormImage


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
    

def mediaFormImage(request):
    # Get the context from the request.
    context = RequestContext(request)

    # A HTTP POST?
    if request.method == 'POST':
        form = MediaFormImage(request.POST, request.FILES)

        # Have we been provided with a valid form?
        if form.is_valid():
            # Save the new data to the database.
            form.save()

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
    
