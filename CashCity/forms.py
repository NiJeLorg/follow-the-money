from registration.forms import RegistrationForm
from django import forms
# user and profile models
from django.contrib.auth.models import User
from CashCity.models import *



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
    teacherName = forms.CharField(
        label = "Name",
        max_length = 255,
        required = False,
    )
 
    from registration.signals import user_registered
 
    def user_registered_callback(sender, user, request, **kwargs):
        profile = ExUserProfile(user = user)
        profile.city = request.POST["city"]
        profile.school = request.POST["school"]
        profile.teacherName = request.POST["teacherName"]
        profile.teacherOrStudent = True
        profile.save()
 
    user_registered.connect(user_registered_callback)

# form for creating and editing team usernames and passwords
class TeamForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput())
    class Meta:
        model = User
        fields = ('username', 'password',)
        
    def clean_username(self):
        data = self.cleaned_data['username']
        if " " in data:
            raise forms.ValidationError("Please do not include spaces in team usernames. Please try again.")
        return data

# team profile form
class TeamProfileForm(forms.ModelForm):
    class Meta:
        model = ExUserProfile
        fields = ('section', 'color',)
            
# allow users to edit their email address in the profile form
class UserInfoForm(forms.ModelForm):
    email = forms.EmailField(required=True)
    class Meta:
        model = User
        fields = ('email',)
        
# user profile edit form
class UserProfileForm(forms.ModelForm):
    class Meta:
        model = ExUserProfile
        fields = ('teacherName', 'city', 'school')

# Form for Images
class MediaFormImage(forms.ModelForm):
            
    # An inline class to provide additional information on the form.
    class Meta:
        # Provide an association between the ModelForm and a model
        model = MediaImage
        exclude = ["user"]
        widgets = {
            'caption': forms.widgets.Textarea(attrs={'rows': 2}),
            'image': forms.widgets.FileInput,
        }
        
# Form for Image Comments
class MediaFormImageComment(forms.ModelForm):
    
    # An inline class to provide additional information on the form.
    class Meta:
        # Provide an association between the ModelForm and a model
        model = MediaImageComments
        fields = ('comment',)
        widgets = {
            'comment': forms.widgets.Textarea(attrs={'rows': 2}),
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
            'audio': forms.widgets.FileInput,
        }
    
# Form for Audio Comments
class MediaFormAudioComment(forms.ModelForm):
    
    # An inline class to provide additional information on the form.
    class Meta:
        # Provide an association between the ModelForm and a model
        model = MediaAudioComments
        fields = ('comment',)
        widgets = {
            'comment': forms.widgets.Textarea(attrs={'rows': 2}),
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

# Form for Note Comments
class MediaFormNoteComment(forms.ModelForm):
    
    # An inline class to provide additional information on the form.
    class Meta:
        # Provide an association between the ModelForm and a model
        model = MediaNoteComments
        fields = ('comment',)
        widgets = {
            'comment': forms.widgets.Textarea(attrs={'rows': 2}),
        }        
        
# Form for Interviews
class MediaFormInterview(forms.ModelForm):
            
    # An inline class to provide additional information on the form.
    class Meta:
        # Provide an association between the ModelForm and a model
        model = MediaInterview
        exclude = ["user"] 
        widgets = {
            'caption': forms.widgets.Textarea(attrs={'rows': 2}),
            'image': forms.widgets.FileInput,
            'audio': forms.widgets.FileInput,
        }
               
# Form for Interview Comments
class MediaFormInterviewComment(forms.ModelForm):
    
    # An inline class to provide additional information on the form.
    class Meta:
        # Provide an association between the ModelForm and a model
        model = MediaInterviewComments
        fields = ('comment',)
        widgets = {
            'comment': forms.widgets.Textarea(attrs={'rows': 2}),
        }     

# Form for Opinions
class OpinionsForm(forms.ModelForm):
            
    # An inline class to provide additional information on the form.
    class Meta:
        # Provide an association between the ModelForm and a model
        model = Opinions
        exclude = ["user"] 
        widgets = {
            'text': forms.widgets.Textarea(attrs={'rows': 3}),
            'teamImage': forms.widgets.FileInput,
        }     

# Form for OpinionSections
class OpinionSectionsForm(forms.ModelForm):
            
    # An inline class to provide additional information on the form.
    class Meta:
        # Provide an association between the ModelForm and a model
        model = OpinionSections
        exclude = ["opinion"] 
        widgets = {
            'text': forms.widgets.Textarea(attrs={'rows': 3}),
            'uploadImage': forms.widgets.FileInput,
        }     
         

# Form for Opinion Comments
class OpinionsFormComment(forms.ModelForm):
    
    # An inline class to provide additional information on the form.
    class Meta:
        # Provide an association between the ModelForm and a model
        model = OpinionComments
        fields = ('comment',)
        widgets = {
            'comment': forms.widgets.Textarea(attrs={'rows': 2}),
        }     
