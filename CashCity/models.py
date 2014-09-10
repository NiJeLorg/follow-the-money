from django.db import models
# import User model
from django.contrib.auth.models import User
# importing django-taggit
from taggit.managers import TaggableManager
# importing django image cropping 
from image_cropping import ImageRatioField

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
    cropped_image = ImageRatioField('image', '280x280')
    caption = models.CharField(max_length=1000, null=True, blank=True)
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
    
    def getUserProfile(self):
        """
            get user profile info for the teacher/team that uploaded the media
        """
        return ExUserProfile.objects.get(user=self.user)
    
    def __unicode__(self):
        return self.title
        
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
        
# Model that stores Media Images
class MediaInterview(models.Model):
    # Links MediaInterview to a User model instance.
    user = models.ForeignKey(User)
    title = models.CharField(max_length=255, null=False, blank=False)
    image = models.ImageField(upload_to="img/%Y_%m_%d_%h_%M_%s", null=False, blank=False)
    # size is "width x height"
    cropped_image = ImageRatioField('image', '280x280')
    audio = models.FileField(upload_to="audio/%Y_%m_%d_%h_%M_%s", null=False, blank=False)
    caption = models.CharField(max_length=1000, null=True, blank=True)
    address = models.CharField(max_length=255, null=False, blank=False)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=False, blank=False)
    longitude = models.DecimalField(max_digits=10, decimal_places=6, null=False, blank=False)
    created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    
    def getUserProfile(self):
        """
            get user profile info for the teacher/team that uploaded the media
        """
        return ExUserProfile.objects.get(user=self.user)
    
    def __unicode__(self):
        return self.title 
