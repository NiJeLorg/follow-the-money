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
    Media= models.BooleanField()
    created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    
    def getUserProfile(self):
        """
            get user profile info for the teacher/team that uploaded the media
        """
        return ExUserProfile.objects.get(user=self.user)
       
    def __unicode__(self):
        return self.MapLayer

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
    image = models.ImageField(upload_to="img/%Y_%m_%d_%h_%M_%s", null=True, blank=True)
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

    def save(self, *args, **kwargs):
        # ensure we save the existing image if no new image was uploaded
        try:
            this = MediaImage.objects.get(id=self.id)
            # check to see if the user editing is the user that created the object
            if self.user != this.user:
                self.user = this.user
            # if no new object was added, ensure that the previous object is saved
            if bool(self.image) == False:
                self.image = this.image
        except: pass          
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

    def save(self, *args, **kwargs):
        # ensure we save the existing image if no new image was uploaded
        try:
            this = MediaAudio.objects.get(id=self.id)
            # check to see if the user editing is the user that created the object
            if self.user != this.user:
                self.user = this.user
            # if no new object was added, ensure that the previous object is saved
            if bool(self.audio) == False:
                self.audio = this.audio
        except: pass          
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
    
    def save(self, *args, **kwargs):
        # ensure we save the existing image if no new image was uploaded
        try:
            this = MediaNote.objects.get(id=self.id)
            # check to see if the user editing is the user that created the object
            if self.user != this.user:
                self.user = this.user
        except: pass          
        super(MediaNote, self).save(*args, **kwargs)

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
        
        
                
# Model that stores Media Interviews
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

    def save(self, *args, **kwargs):
        # ensure we save the existing image if no new image was uploaded
        try:
            this = MediaInterview.objects.get(id=self.id)
            # check to see if the user editing is the user that created the object
            if self.user != this.user:
                self.user = this.user
            # if no new object was added, ensure that the previous object is saved
            if bool(self.image) == False:
                self.image = this.image
            # if no new object was added, ensure that the previous object is saved
            if bool(self.audio) == False:
                self.audio = this.audio
        except: pass          
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
        
        
# Model that stores Opinions
class Opinions(models.Model):
    # Links Opinions to a User model instance.
    user = models.ForeignKey(User)
    authors = models.CharField(max_length=255, null=False, blank=False)
    teamImage = models.ImageField(upload_to="img/%Y_%m_%d_%h_%M_%s", null=False, blank=False)
    # thumb for opinion 'stubs'
    cropped_teamImage = ImageRatioField('image', '280x280')
    # smaller version for opinion page
    cropped_teamImage_w640_h480 = ImageRatioField('image', '640x480')
    title = models.CharField(max_length=255, null=False, blank=False)

    # metadata
    published = models.BooleanField()
    created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # ensure we save the existing image if no new image was uploaded
        try:
            this = Opinions.objects.get(id=self.id)
            # check to see if the user editing is the user that created the object
            if self.user != this.user:
                self.user = this.user
            # if no new object was added, ensure that the previous object is saved
            if bool(self.teamImage) == False:
                self.teamImage = this.teamImage
        except: pass          
        super(Opinions, self).save(*args, **kwargs)
            
    def getUserProfile(self):
        """
            get user profile info for the teacher/team that uploaded the media
        """
        return ExUserProfile.objects.get(user=self.user)
    
    def __unicode__(self):
        return self.title 


# Opinion Sections
class OpinionSections(models.Model):
    opinion = models.ForeignKey(Opinions)
    sectionNumber = models.IntegerField()
    image = models.ForeignKey(MediaImage, null=True, blank=True)
    audio = models.ForeignKey(MediaAudio, null=True, blank=True)
    note = models.ForeignKey(MediaNote, null=True, blank=True)
    interview = models.ForeignKey(MediaInterview, null=True, blank=True)
    mapSnap = models.ForeignKey(MapSettings, null=True, blank=True)
    upload = models.FileField(upload_to="file/%Y_%m_%d_%h_%M_%s", null=True, blank=True)
    text = models.CharField(max_length=10000, null=True, blank=True)
    
    def save(self, *args, **kwargs):
        # ensure we save the existing image if no new image was uploaded
        try:
            this = OpinionSections.objects.get(id=self.id)
            # if no new object was added, ensure that the previous object is saved
            if bool(self.upload) == False:
                self.upload = this.upload
        except: pass          
        super(OpinionSections, self).save(*args, **kwargs)
        
    def __unicode__(self):
        return self.sectionNumber             

# Comments on Opinions
class OpinionComments(models.Model): 
    # Link Opinion Comments to a User
    user = models.ForeignKey(User)    
    # Link Opinion Comments to Opinion
    opinion = models.ForeignKey(Opinions)
    comment = models.CharField(max_length=2000, null=False, blank=False)    
    created = models.DateTimeField(auto_now_add=True)
    
    def getUserProfile(self):
        """
            get user profile info for the teacher/team that made the comment
        """
        return ExUserProfile.objects.get(user=self.user)
       
    def __unicode__(self):
        return self.comment