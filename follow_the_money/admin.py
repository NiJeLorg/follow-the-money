from django.contrib import admin

# Import created models into the django admin area
from follow_the_money.models import MediaImage
from follow_the_money.models import MediaAudio
from follow_the_money.models import MediaNote
from follow_the_money.models import MediaInterview

admin.site.register(MediaImage)
admin.site.register(MediaAudio)
admin.site.register(MediaNote)
admin.site.register(MediaInterview)