from django.db import models
# importing django-taggit
from taggit.managers import TaggableManager


# Create your models here.
class MediaImage(models.Model):
    title = models.CharField(max_length=255, null=False)
    image = models.ImageField(upload_to="img/%Y_%m_%d_%h_%M_%s", null=False)
    caption = models.CharField(max_length=1000)
    address = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=10, decimal_places=6)
    tags = TaggableManager()

    def __unicode__(self):
        return self.title