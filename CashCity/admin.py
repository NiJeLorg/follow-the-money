from django.contrib import admin

# Import created models into the django admin area
from CashCity.models import ExUserProfile
from CashCity.models import MediaImage
from CashCity.models import MediaAudio
from CashCity.models import MediaNote
from CashCity.models import MediaInterview

admin.site.register(ExUserProfile)
admin.site.register(MediaImage)
admin.site.register(MediaAudio)
admin.site.register(MediaNote)
admin.site.register(MediaInterview)
