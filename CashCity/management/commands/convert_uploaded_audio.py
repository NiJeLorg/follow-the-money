import os
from django.core.management import BaseCommand
from subprocess import call

__author__ = 'vikashdat'

"""
    This command converts amr files to mp3 audio files.
"""

class Command(BaseCommand):
    args = ''
    help = ''

    def convertAMRToMp3(self,(dirpath,filename)):
        pathToAMR = os.path.join(dirpath,filename)
        pathToMP3 = os.path.join(dirpath,"%s.mp3" % (filename))

        print "Creating file: " + pathToMP3
          
        # ffmpeg -i .amr -acodec libmp3lame -ab 64k test.mp3
        call(["ffmpeg", "-i",pathToAMR,"-acodec","libmp3lame","-ab","64k",pathToMP3])

    def findAMRFiles(self, dirpath,dirnames,filenames):
        fileToProcess = None
        alreadyEncodedFlag = False
        for filename in filenames:
            if ".amr" in filename:
                fileToProcess = (dirpath,filename)
            if ".mp3" in filename:
                alreadyEncodedFlag = True
        if (not alreadyEncodedFlag and fileToProcess is not None):
             self.convertAMRToMp3(fileToProcess)

    def getDirectoryListing(self):
        """
            Returns a listing of the application's audio directory
        """
        for dirpath, dirnames, filenames in os.walk(os.path.dirname(os.path.realpath(__file__)) + "/../../media/audio/"):
            self.findAMRFiles(dirpath, dirnames, filenames)

    def handle(self, *args, **options):
        print "Starting audio conversions...."
        self.getDirectoryListing()
        print "Conversion complete..."

