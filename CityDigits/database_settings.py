import os

PROJECT_ROOT = os.path.dirname(__file__)
DATABASE_PATH = os.path.join(PROJECT_ROOT, 'ftm.db')

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3', 
        'NAME': DATABASE_PATH,              
    }
}