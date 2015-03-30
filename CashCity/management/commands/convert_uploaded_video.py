import os
from django.core.management import BaseCommand
from subprocess import call

__author__ = 'nijel'

"""
    This command converts mov files to mp3 audio files.
"""

class Command(BaseCommand):
    args = ''
    help = ''

    def convertMOVToMp3(self,(dirpath,filename)):
        pathToMOV = os.path.join(dirpath,filename)
        pathToMP3 = os.path.join(dirpath,"%s.mp3" % (filename))

        print "Creating file: " + pathToMP3
          
        # ffmpeg -i .MOV test.mp3
        call(["ffmpeg","-i",pathToMOV,pathToMP3])

    def findMOVFiles(self, dirpath,dirnames,filenames):
        fileToProcess = None
        alreadyEncodedFlag = False
        for filename in filenames:
            if ".mov" in filename:
                fileToProcess = (dirpath,filename)
            if ".mp3" in filename:
                alreadyEncodedFlag = True
        if (not alreadyEncodedFlag and fileToProcess is not None):
             self.convertMOVToMp3(fileToProcess)

    def getDirectoryListing(self):
        """
            Returns a listing of the application's audio directory
        """
        for dirpath, dirnames, filenames in os.walk(os.path.dirname(os.path.realpath(__file__)) + "/../../../CityDigits/media/audio/"):
            self.findMOVFiles(dirpath, dirnames, filenames)

    def handle(self, *args, **options):
        print "Starting conversion from MOV to MP3...."
        self.getDirectoryListing()
        print "Conversion complete..."
