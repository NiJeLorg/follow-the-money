# Create your views here.
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse

def index(request):
    # Request the context of the request.
    # The context contains information such as the client's machine details, for example.
    context = RequestContext(request)

    # Construct a dictionary to pass to the template engine as its context.
    # Note the key boldmessage is the same as {{ boldmessage }} in the template!
    context_dict = {}

    # Return a rendered response to send to the client.
    # We make use of the shortcut function to make our lives easier.
    # Note that the first parameter is the template we wish to use.
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