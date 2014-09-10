from django.contrib import admin
# for cropping images in the admin area
from image_cropping import ImageCroppingMixin

# Import created models into the django admin area
from CashCity.models import ExUserProfile
from CashCity.models import MediaImage
from CashCity.models import MediaAudio
from CashCity.models import MediaNote
from CashCity.models import MediaInterview

# for cropping images in the admin area
class MediaImageCrop(ImageCroppingMixin, admin.ModelAdmin):
    pass


admin.site.register(ExUserProfile)
admin.site.register(MediaImage, MediaImageCrop)
admin.site.register(MediaAudio)
admin.site.register(MediaNote)
admin.site.register(MediaInterview, MediaImageCrop)

