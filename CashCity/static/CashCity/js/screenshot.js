/**
 * screenshot.js: generate a screenshot of any page
 * Author: NiJeL
 */

$(function() { 
    $("#btnSave").click(function() { 
var latitude =MY_MAP.map.getCenter().lat;
var longitude =MY_MAP.map.getCenter().lng;
var zoom =MY_MAP.map.getZoom();
var MapLayer =mainLayer._leaflet_id;
var PawnShops =MY_MAP.map.hasLayer(LOC1);
var CheckCashing =MY_MAP.map.hasLayer(LOC2);
var WireTransfer =MY_MAP.map.hasLayer(LOC3);
var Banks =MY_MAP.map.hasLayer(LOC4);
var McDonalds =MY_MAP.map.hasLayer(LOC5);
var SubwayLines =MY_MAP.map.hasLayer(LOC6);
loadMedia(latitude,longitude,zoom,MapLayer,PawnShops,CheckCashing,WireTransfer,Banks,McDonalds,SubwayLines);
// function to save the map settings
	function loadMedia(latitude,longitude,zoom,MapLayer,PawnShops,CheckCashing,WireTransfer,Banks,McDonalds,SubwayLines){
	    $.ajax({
	        type: 'GET',
	        url:  'savemap/?latitude=' + latitude + '&longitude=' + longitude + '&zoom=' + zoom + '&MapLayer=' + MapLayer + '&PawnShops=' + PawnShops + '&CheckCashing=' + CheckCashing + '&WireTransfer=' + WireTransfer + '&Banks=' + Banks + '&McDonalds=' + McDonalds + '&SubwayLines=' + SubwayLines, 
	        success: function(data){
console.log(mainLayer._leaflet_id)
							                  console.log(MY_MAP.map.getCenter().lat)   
							                  console.log(MY_MAP.map.getCenter().lng)   
							            console.log(MY_MAP.map.getZoom())   
							                  console.log(MY_MAP.map.hasLayer(LOC1))    
							                  console.log(MY_MAP.map.hasLayer(LOC2))
							                  console.log(MY_MAP.map.hasLayer(LOC3))
							                  console.log(MY_MAP.map.hasLayer(LOC4))
							                  console.log(MY_MAP.map.hasLayer(LOC5))
							                  console.log(MY_MAP.map.hasLayer(LOC6))    
							        console.log(MY_MAP.map.hasLayer(LOC6))
							onChangeListener();
	        }
	    });
	}


    });
});
