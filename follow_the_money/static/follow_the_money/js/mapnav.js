/**
 * mapnav.js: handles all javascript associated with the map nav
 * Loaded when map nav is called after all other javascript is loaded
 * Author: NiJeL
 */


/*
 * Toggle map location layers
 */

$( document ).ready(function() {

	$("input[name='locations']").change( function() {
		var layerId = $(this).attr("value");
				
	    if($(this).is(":checked")) {
			CityDigitsMap.loadLocationsLayerFor(layerId);
	    } else {
			if(layerId == 'LOC1' && LOC1 != null) {
				CityDigitsMap.removeLayerFor(LOC1);
				LOC1 = null;
			}
			if(layerId == 'LOC2' && LOC2 != null) {
				CityDigitsMap.removeLayerFor(LOC2);
				LOC2 = null;
			}
			if(layerId == 'LOC3' && LOC3 != null) {
				CityDigitsMap.removeLayerFor(LOC3);
				LOC3 = null;
			}
			if(layerId == 'LOC4' && LOC4 != null) {
				CityDigitsMap.removeLayerFor(LOC4);
				LOC4 = null;
			}
			if(layerId == 'LOC5' && LOC5 != null) {
				CityDigitsMap.removeLayerFor(LOC5);
				LOC5 = null;
			}
			if(layerId == 'LOC6' && LOC6 != null) {
				CityDigitsMap.removeLayerFor(LOC6);
				LOC6 = null;
			}
			if(layerId == 'LOC7' && LOC7 != null) {
				CityDigitsMap.removeLayerFor(LOC7);
				LOC7 = null;
			}		
	    }
	});
	
	$( "input[name='maps']" ).change( function() {
	    if(mainLayer != null){
			CityDigitsMap.removeLayerFor(mainLayer);
			mainLayer = null;
	    }
				
		if ($(this).attr("value") != null) {
			// % population in poverty
		    var layerId = $(this).attr("value");
		    CityDigitsMap.loadLayerFor(layerId);
		    return false;
		} 

	});

});

