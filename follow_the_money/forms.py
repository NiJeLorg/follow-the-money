from registration.forms import RegistrationForm
from django import forms
# user and profile models
from django.contrib.auth.models import User
from follow_the_money.models import *



# From to for user profile model
class ExRegistrationForm(RegistrationForm):
    city = forms.CharField(
        label = "City",
        max_length = 255,
        required = False,
    )
    school = forms.CharField(
        label = "School",
        max_length = 255,
        required = False,
    )
    name = forms.CharField(
        label = "Name",
        max_length = 255,
        required = False,
    )
 
    from registration.signals import user_registered
 
    def user_registered_callback(sender, user, request, **kwargs):
        profile = ExUserProfile(user = user)
        profile.city = request.POST["city"]
        profile.school = request.POST["school"]
        profile.name = request.POST["name"]
        profile.save()
 
    user_registered.connect(user_registered_callback)
    
# allow users to edit their email addres in the profile form
class UserInfoForm(forms.ModelForm):
    email = forms.EmailField(required=True)
    class Meta:
        model = User
        fields = ('email',)
        
# user profile edit form
class UserProfileForm(forms.ModelForm):
    class Meta:
        model = ExUserProfile
        fields = ('name', 'city', 'school',)

# Form for Images Audio
class MediaFormImage(forms.ModelForm):
            
    # An inline class to provide additional information on the form.
    class Meta:
        # Provide an association between the ModelForm and a model
        model = MediaImage
        exclude = ["user"]
        widgets = {
            'caption': forms.widgets.Textarea(attrs={'rows': 2}),
        }
        
# Form for Audio Media
class MediaFormAudio(forms.ModelForm):
            
    # An inline class to provide additional information on the form.
    class Meta:
        # Provide an association between the ModelForm and a model
        model = MediaAudio
        exclude = ["user"]
        widgets = {
            'caption': forms.widgets.Textarea(attrs={'rows': 2}),
        }
    
# Form for Note Media
class MediaFormNote(forms.ModelForm):
            
    # An inline class to provide additional information on the form.
    class Meta:
        # Provide an association between the ModelForm and a model
        model = MediaNote
        exclude = ["user"]
        widgets = {
            'notes': forms.widgets.Textarea(attrs={'rows': 2}),
        }
        
        
# Form for Images Audio
class MediaFormInterview(forms.ModelForm):
            
    # An inline class to provide additional information on the form.
    class Meta:
        # Provide an association between the ModelForm and a model
        model = MediaInterview
        exclude = ["user"] 
        widgets = {
            'caption': forms.widgets.Textarea(attrs={'rows': 2}),
        }
               
    
