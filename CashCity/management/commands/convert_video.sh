#! /bin/bash    
cd /var/www/CityDigits
source env2/bin/activate

# virtualenv is now active, which means your PATH has been modified.
# Don't try to run python from /usr/bin/python, just run "python" and
# let the PATH figure out which version to run (based on what your
# virtualenv has configured).

python manage.py convert_uploaded_video
