/**
 * mapSnap.js: store map state on button click 
 * Author: NiJeL
 */

$(function() { 
    $("#btnSave").click(function() {

		// first, get current map state
		var latitude =MY_MAP.map.getCenter().lat;
		var longitude =MY_MAP.map.getCenter().lng;
		var zoom =MY_MAP.map.getZoom();
		if (mainLayer != null) {
			var MapLayer =mainLayer._leaflet_id;
		} else {
			var MapLayer = '';
		}
		var PawnShops =MY_MAP.map.hasLayer(LOC1);
		var CheckCashing =MY_MAP.map.hasLayer(LOC2);
		var WireTransfer =MY_MAP.map.hasLayer(LOC3);
		var Banks =MY_MAP.map.hasLayer(LOC4);
		var McDonalds =MY_MAP.map.hasLayer(LOC5);
		var SubwayLines =MY_MAP.map.hasLayer(LOC6);
		var Media =MY_MAP.map.hasLayer(MEDIA_IMAGES);
						
		loadMedia(latitude,longitude,zoom,MapLayer,PawnShops,CheckCashing,WireTransfer,Banks,McDonalds,SubwayLines,Media);
		
		// function to save the map settings
		function loadMedia(latitude,longitude,zoom,MapLayer,PawnShops,CheckCashing,WireTransfer,Banks,McDonalds,SubwayLines,Media){
		    $.ajax({
		        type: 'GET',
		        url:  'savemap/?latitude=' + latitude + '&longitude=' + longitude + '&zoom=' + zoom + '&MapLayer=' + MapLayer + '&PawnShops=' + PawnShops + '&CheckCashing=' + CheckCashing + '&WireTransfer=' + WireTransfer + '&Banks=' + Banks + '&McDonalds=' + McDonalds + '&SubwayLines=' + SubwayLines + '&Media=' + Media, 
		        success: function(data){
		            $(".mapSnaps-content-container").html(data);
					// unbind event handler on the drop down so we can reinitiate it later
					$("#openMapSnaps").off( "click" );
					$('html').off( "click" );
					getMapSnaps();
		        }
				
		    });
		}

    });

	
		
});
