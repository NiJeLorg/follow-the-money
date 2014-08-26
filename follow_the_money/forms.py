from django import forms
from follow_the_money.models import MediaImage


class SignupForm(forms.Form):
    first_name = forms.CharField(max_length=30, label='Voornaam')
    last_name = forms.CharField(max_length=30, label='Achternaam')

    def signup(self, request, user):
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        user.save()


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
        widget=forms.widgets.Textarea(attrs={'rows':3}),
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