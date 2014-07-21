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
			CityDigitsMap.removeLayerFor(layerId);
	    }
	});
	
	$( "input[name='maps']" ).change( function() {
		//alert( "Handler for .change() called." );
	    if(mainLayer != null){
			MY_MAP.map.removeLayer(mainLayer);
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

