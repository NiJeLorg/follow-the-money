/**
 * Application.js: handles and initiates all City Digits Javascript
 * Author: NiJeL
 * Extends vikashdat's work on City Digits Local Lotto
 */

/*
  On DOM load handlers
 */

var mainLayer = null;
var MY_MAP = null;
var SCREEN_HEIGHT = null;
var CURRENT_LAYER = null;
RELATIVE_URL = '';  //for development leave this blank. For production it should be '/follow_the_money'

/*
  This function is called when the page DOM has loaded. It enables 'back' button, sets up the map
  and map popups.
 */
$().ready(new function(){

    //get screen measurements
    SCREEN_HEIGHT =  $(window).height();
    var myMap = new CityDigitsMap();
    //myMap.resizeMap();
    myMap.loadLayers();
    //console.log("STARTING LOAD OF MARKERS: " + Date.now());
    //myMap.loadMarkers();
    //console.log("ENDING LOAD OF MARKERS: " + Date.now());
    mainLayer = myMap.neighborhoodLayer;
    MY_MAP = myMap;

    //$(".tab-content").height=$(window).height();
});




