/**
 * Application.js: handles and initiates all City Digits Javascript
 * Author: NiJeL
 * Extends vikashdat's work on City Digits Local Lotto
 */

/*
  On DOM load handlers
 */

var mainLayer = null;
var LOC1 = null;
var LOC2 = null;
var LOC3 = null;
var LOC4 = null;
var LOC5 = null;
var LOC6 = null;
var LOC7 = null;
var MY_MAP = null;
var SCREEN_HEIGHT = null;
var CURRENT_LAYER = null;
RELATIVE_URL = '/follow-the-money/follow-the-money';  //for development leave this blank. For production it should be '/follow_the_money'

/*
  This function is called when the page DOM has loaded. It enables 'back' button, sets up the map and map popups.
 */
$().ready(new function(){

    //get screen measurements
    SCREEN_HEIGHT =  $(window).height();
    var myMap = new CityDigitsMap();
    //myMap.resizeMap();
    myMap.loadLayers();
    //console.log("STARTING LOAD OF MARKERS: " + Date.now());
    myMap.loadMarkers();
    //console.log("ENDING LOAD OF MARKERS: " + Date.now());
    mainLayer = myMap.neighborhoodLayer;
    MY_MAP = myMap;

});

