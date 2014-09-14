from django.db import models
# import User model
from django.contrib.auth.models import User
# importing django-taggit
from taggit.managers import TaggableManager
# importing django image cropping 
from image_cropping import ImageRatioField

#taggit autocomplete
from taggit_autocomplete.managers import TaggableManager

# Model that stores a users map settings 
class MapSettings(models.Model):
    # Links Map Settings to a User model instance.
    user = models.ForeignKey(User)
		#lat and lon for the center point of the map.
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=False, blank=False)
    longitude = models.DecimalField(max_digits=10, decimal_places=6, null=False, blank=False)
    zoom = models.IntegerField()
    MapLayer= models.CharField(max_length=100)
    PawnShops= models.BooleanField()
    CheckCashing= models.BooleanField()
    WireTransfer= models.BooleanField()
    Banks= models.BooleanField()
    McDonalds= models.BooleanField()
    SubwayLines= models.BooleanField()
    Thumbnail = models.ImageField(upload_to="img/map/%Y_%m_%d_%h_%M_%s")
    # size is "width x height"
    cropped_image = ImageRatioField('Thumbnail', '280x280')
    created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    
    def getUserProfile(self):
        """
            get user profile info for the teacher/team that uploaded the media
        """
        return ExUserProfile.objects.get(user=self.user)
       
    def __unicode__(self):
        return self.zoom

# Model that stores user profile info beyond username, password, email -- includes teacher and student group data
class ExUserProfile(models.Model):
    GREEN = 'green'
    ORANGE = 'orange'
    PINK = 'pink'
    PURPLE = 'purple'
    RED = 'red'
    YELLOW = 'yellow'
    COLOR_CHOICES = (
        (GREEN, 'Green'),
        (ORANGE, 'Orange'),
        (PINK, 'Pink'),
        (PURPLE, 'Purple'),
        (RED, 'Red'),
        (YELLOW, 'Yellow'),
    )
    user = models.OneToOneField(User)
    teacherName = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=255, null=True, blank=True)
    school = models.CharField(max_length=255, null=True, blank=True)
    teacherOrStudent = models.BooleanField()
    teacherId = models.ForeignKey(User, null=True, blank=True, related_name='teacher')
    section = models.CharField(max_length=255, null=True, blank=True)
    color = models.CharField(max_length=10, null=True, blank=True, choices=COLOR_CHOICES)
 
    def __unicode__(self):
        return self.teacherName
        

# Model that stores Media Images
class MediaImage(models.Model):
    # Links MediaImage to a User model instance.
    user = models.ForeignKey(User)
    title = models.CharField(max_length=255, null=False, blank=False)
    image = models.ImageField(upload_to="img/%Y_%m_%d_%h_%M_%s", null=False, blank=False)
    # size is "width x height"
    # thumb for media 'stubs'
    cropped_image = ImageRatioField('image', '280x280')
    # samller version for media page
    cropped_image_w640_h480 = ImageRatioField('image', '640x480')
    caption = models.CharField(max_length=1000, null=True, blank=True)
    address = models.CharField(max_length=255, null=False, blank=False)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=False, blank=False)
    longitude = models.DecimalField(max_digits=10, decimal_places=6, null=False, blank=False)
    tags = TaggableManager()
    published = models.BooleanField()
    created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)

    #defined a save method to overwrite a file if being replace
    #from: http://stackoverflow.com/a/8342249
    def save(self, *args, **kwargs):
        # delete old file when replacing by updating the file
        try:
            this = MediaImage.objects.get(id=self.id)
            if this.image != self.image:
                this.image.delete(save=False)
        except: pass # when new photo then we do nothing, normal case          
        super(MediaImage, self).save(*args, **kwargs)
            
    def getUserProfile(self):
        """
            get user profile info for the teacher/team that uploaded the media
        """
        return ExUserProfile.objects.get(user=self.user)
       
    def __unicode__(self):
        return self.title


# Comments on Media Images
class MediaImageComments(models.Model): 
    # Link Media Image Comments to a User
    user = models.ForeignKey(User)    
    # Link Media Image Comments to Media Image
    mediaImage = models.ForeignKey(MediaImage)
    comment = models.CharField(max_length=2000, null=False, blank=False)    
    created = models.DateTimeField(auto_now_add=True)
    
    def getUserProfile(self):
        """
            get user profile info for the teacher/team that made the comment
        """
        return ExUserProfile.objects.get(user=self.user)
       
    def __unicode__(self):
        return self.comment
    
       
# Model that stores Media Audio
class MediaAudio(models.Model):
    # Links MediaAudio to a User model instance.
    user = models.ForeignKey(User)
    title = models.CharField(max_length=255, null=False, blank=False)
    audio = models.FileField(upload_to="audio/%Y_%m_%d_%h_%M_%s", null=False, blank=False)
    caption = models.CharField(max_length=1000, null=True, blank=True)
    address = models.CharField(max_length=255, null=False, blank=False)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=False, blank=False)
    longitude = models.DecimalField(max_digits=10, decimal_places=6, null=False, blank=False)
    tags = TaggableManager()
    published = models.BooleanField()
    created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)

    #defined a save method to overwrite a file if being replace
    #from: http://stackoverflow.com/a/8342249
    def save(self, *args, **kwargs):
        # delete old file when replacing by updating the file
        try:
            this = MediaAudio.objects.get(id=self.id)
            if this.audio != self.audio:
                this.audio.delete(save=False)
        except: pass # when new photo then we do nothing, normal case          
        super(MediaAudio, self).save(*args, **kwargs)
    
    def getUserProfile(self):
        """
            get user profile info for the teacher/team that uploaded the media
        """
        return ExUserProfile.objects.get(user=self.user)
    
    def __unicode__(self):
        return self.title
        

# Comments on Media Audio
class MediaAudioComments(models.Model): 
    # Link Media Audio Comments to a User
    user = models.ForeignKey(User)    
    # Link Media Audio Comments to Media Audio
    mediaAudio = models.ForeignKey(MediaAudio)
    comment = models.CharField(max_length=2000, null=False, blank=False)    
    created = models.DateTimeField(auto_now_add=True)
    
    def getUserProfile(self):
        """
            get user profile info for the teacher/team that made the comment
        """
        return ExUserProfile.objects.get(user=self.user)
       
    def __unicode__(self):
        return self.comment
        
        
        
# Model that stores Media Notes
class MediaNote(models.Model):
    # Links MediaAudio to a User model instance.
    user = models.ForeignKey(User)
    title = models.CharField(max_length=255, null=False, blank=False)
    notes = models.CharField(max_length=2000, null=False, blank=False)
    address = models.CharField(max_length=255, null=False, blank=False)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=False, blank=False)
    longitude = models.DecimalField(max_digits=10, decimal_places=6, null=False, blank=False)
    tags = TaggableManager()
    published = models.BooleanField()
    created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    
    def getUserProfile(self):
        """
            get user profile info for the teacher/team that uploaded the media
        """
        return ExUserProfile.objects.get(user=self.user)

    def __unicode__(self):
        return self.title
        

# Comments on Media Note
class MediaNoteComments(models.Model): 
    # Link Media Note Comments to a User
    user = models.ForeignKey(User)    
    # Link Media Note Comments to Media Note
    mediaNote = models.ForeignKey(MediaNote)
    comment = models.CharField(max_length=2000, null=False, blank=False)    
    created = models.DateTimeField(auto_now_add=True)
    
    def getUserProfile(self):
        """
            get user profile info for the teacher/team that made the comment
        """
        return ExUserProfile.objects.get(user=self.user)
       
    def __unicode__(self):
        return self.comment
        
        
        
# Model that stores Media Images
class MediaInterview(models.Model):
    # Links MediaInterview to a User model instance.
    user = models.ForeignKey(User)
    title = models.CharField(max_length=255, null=False, blank=False)
    image = models.ImageField(upload_to="img/%Y_%m_%d_%h_%M_%s", null=False, blank=False)
    # thumb for media 'stubs'
    cropped_image = ImageRatioField('image', '280x280')
    # samller version for media page
    cropped_image_w640_h480 = ImageRatioField('image', '640x480')
    audio = models.FileField(upload_to="audio/%Y_%m_%d_%h_%M_%s", null=False, blank=False)
    caption = models.CharField(max_length=1000, null=True, blank=True)
    address = models.CharField(max_length=255, null=False, blank=False)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=False, blank=False)
    longitude = models.DecimalField(max_digits=10, decimal_places=6, null=False, blank=False)
    tags = TaggableManager()
    published = models.BooleanField()
    created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)

    #defined a save method to overwrite a file if being replace
    #from: http://stackoverflow.com/a/8342249
    def save(self, *args, **kwargs):
        # delete old file when replacing by updating the file
        try:
            this = MediaInterview.objects.get(id=self.id)
            if this.audio != self.audio:
                this.audio.delete(save=False)
            if this.image != self.audio:
                this.image.delete(save=False)                
        except: pass # when new photo then we do nothing, normal case          
        super(MediaInterview, self).save(*args, **kwargs)
            
    def getUserProfile(self):
        """
            get user profile info for the teacher/team that uploaded the media
        """
        return ExUserProfile.objects.get(user=self.user)
    
    def __unicode__(self):
        return self.title 


# Comments on Media Interview
class MediaInterviewComments(models.Model): 
    # Link Media Interview Comments to a User
    user = models.ForeignKey(User)    
    # Link Media Interview Comments to Media Interview
    mediaInterview = models.ForeignKey(MediaInterview)
    comment = models.CharField(max_length=2000, null=False, blank=False)    
    created = models.DateTimeField(auto_now_add=True)
    
    def getUserProfile(self):
        """
            get user profile info for the teacher/team that made the comment
        """
        return ExUserProfile.objects.get(user=self.user)
       
    def __unicode__(self):
        return self.comment