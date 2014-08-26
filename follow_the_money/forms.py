from django import forms
from follow_the_money.models import MediaImage
from follow_the_money.models import MediaAudio
from follow_the_money.models import MediaNote
from follow_the_money.models import MediaInterview


class SignupForm(forms.Form):
    first_name = forms.CharField(max_length=30, label='Voornaam')
    last_name = forms.CharField(max_length=30, label='Achternaam')

    def signup(self, request, user):
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        user.save()

# Form for Images Audio
class MediaFormImage(forms.ModelForm):
    
    title = forms.CharField(
        label = "Title",
        max_length = 255,
        required = True,
    )
    image = forms.ImageField(
        label = "Add Image",
        required = True,
    )
    caption = forms.CharField(
        widget=forms.widgets.Textarea(attrs={'rows':2}),
        max_length = 1000,
        required = False,
    )
    address = forms.CharField(
        label = "Location",
        help_text = "Address",
        max_length = 255,
        required = True,
    )
    latitude = forms.DecimalField(
        label = "Latitude",
        required = True, 
        max_digits=9, 
        decimal_places=6,       
    )
    longitude = forms.DecimalField(
        label = "Latitude",
        required = True, 
        max_digits=9, 
        decimal_places=6,       
    )
            
    # An inline class to provide additional information on the form.
    class Meta:
        # Provide an association between the ModelForm and a model
        model = MediaImage
        exclude = ["user"]
    

# Form for Audio Media
class MediaFormAudio(forms.ModelForm):
    
    title = forms.CharField(
        label = "Title",
        max_length = 255,
        required = True,
    )
    audio = forms.FileField(
        label = "Add Audio",
        required = True,
    )
    caption = forms.CharField(
        widget=forms.widgets.Textarea(attrs={'rows':2}),
        max_length = 1000,
        required = False,
    )
    address = forms.CharField(
        label = "Location",
        help_text = "Address",
        max_length = 255,
        required = True,
    )
    latitude = forms.DecimalField(
        label = "Latitude",
        required = True, 
        max_digits=9, 
        decimal_places=6,       
    )
    longitude = forms.DecimalField(
        label = "Latitude",
        required = True, 
        max_digits=9, 
        decimal_places=6,       
    )
            
    # An inline class to provide additional information on the form.
    class Meta:
        # Provide an association between the ModelForm and a model
        model = MediaAudio
        exclude = ["user"]
    

# Form for Note Media
class MediaFormNote(forms.ModelForm):
    
    title = forms.CharField(
        label = "Title",
        max_length = 255,
        required = True,
    )
    notes = forms.CharField(
        widget=forms.widgets.Textarea(attrs={'rows':2}),
        max_length = 2000,
        required = True,
    )
    address = forms.CharField(
        label = "Location",
        help_text = "Address",
        max_length = 255,
        required = True,
    )
    latitude = forms.DecimalField(
        label = "Latitude",
        required = True, 
        max_digits=9, 
        decimal_places=6,       
    )
    longitude = forms.DecimalField(
        label = "Latitude",
        required = True, 
        max_digits=9, 
        decimal_places=6,       
    )
            
    # An inline class to provide additional information on the form.
    class Meta:
        # Provide an association between the ModelForm and a model
        model = MediaNote
        exclude = ["user"]
        
        
# Form for Images Audio
class MediaFormInterview(forms.ModelForm):
    
    title = forms.CharField(
        label = "Title",
        max_length = 255,
        required = True,
    )
    image = forms.ImageField(
        label = "Add Image",
        required = False,
    )
    audio = forms.FileField(
        label = "Add Audio",
        required = False,
    )
    caption = forms.CharField(
        widget=forms.widgets.Textarea(attrs={'rows':2}),
        max_length = 1000,
        required = False,
    )
    address = forms.CharField(
        label = "Location",
        help_text = "Address",
        max_length = 255,
        required = True,
    )
    latitude = forms.DecimalField(
        label = "Latitude",
        required = True, 
        max_digits=9, 
        decimal_places=6,       
    )
    longitude = forms.DecimalField(
        label = "Latitude",
        required = True, 
        max_digits=9, 
        decimal_places=6,       
    )
            
    # An inline class to provide additional information on the form.
    class Meta:
        # Provide an association between the ModelForm and a model
        model = MediaInterview
        exclude = ["user"]        
    
