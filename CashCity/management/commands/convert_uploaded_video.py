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

    def convertVIDEOToMp3(self,(dirpath,filename)):
        pathToVIDEO = os.path.join(dirpath,filename)
        pathToMP3 = os.path.join(dirpath,"%s.mp3" % (filename))

        print "Creating file: " + pathToMP3
          
        # ffmpeg -y -i .MOV -acodec libmp3lame -ab 64k .mp3
        call(["ffmpeg","-y","-i",pathToVIDEO,"-acodec","libmp3lame","-ab","64k",pathToMP3])

    def findVIDEOFiles(self, dirpath,dirnames,filenames):
        fileToProcess = None
        alreadyEncodedFlag = False
        for filename in filenames:
            if ".mov" in filename or ".MOV" in filename or ".gp3" in filename or ".mp4" in filename:
                fileToProcess = (dirpath,filename)
            if ".mp3" in filename:
                alreadyEncodedFlag = True
        if (not alreadyEncodedFlag and fileToProcess is not None):
             self.convertVIDEOToMp3(fileToProcess)


    def getDirectoryListing(self):
        """
            Returns a listing of the application's audio directory
        """
        for dirpath, dirnames, filenames in os.walk(os.path.dirname(os.path.realpath(__file__)) + "/../../../CityDigits/media/audio/"):
            self.findVIDEOFiles(dirpath, dirnames, filenames)

    def handle(self, *args, **options):
        print "Starting conversion from VIDEO to MP3...."
        self.getDirectoryListing()
        print "Conversion complete..."

