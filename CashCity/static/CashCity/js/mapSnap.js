/**
 * mapSnap.js: store map state on button click 
 * Author: NiJeL
 */

$(function() { 

	// create listener on enter key to do button click
	$("#mapSnapsTitle").keydown(function(event){
		if(event.keyCode==13)event.preventDefault();
	    if(event.keyCode == 13){
	        $("#btnSave").click();
	    }
	});

	// stop clicking inside the modal from closing the map snap icon tray
	$('#mapSnapsTitle').click(function(event){
		event.stopPropagation();
	});

    $("#titleModal").click(function() {
    	$('#mapSnapsTitle').modal();
    });

    $("#btnSave").click(function() {
    	// get value of title being saved
    	var title = $("#mapTitle").val();
    	// close the modal
    	$('#mapSnapsTitle').modal('hide');

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

		// get popup and chart state
		if (MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			var popup2Content = MY_MAP.popup2.getContent();
			var popup2Lat = MY_MAP.popup2.getLatLng().lat;
			var popup2Lon = MY_MAP.popup2.getLatLng().lng;
			var popup2LatLon = popup2Lat + ',' + popup2Lon;
		} else {
			var popup2Content = '';
			var popup2LatLon = '';
		}

		if (MY_MAP.map.hasLayer(MY_MAP.popup3)) {
			var popup3Content = MY_MAP.popup3.getContent();
			var popup3Lat = MY_MAP.popup3.getLatLng().lat;
			var popup3Lon = MY_MAP.popup3.getLatLng().lng;
			var popup3LatLon = popup3Lat + ',' + popup3Lon;
		} else {
			var popup3Content = '';
			var popup3LatLon = '';
		}

		// is chart on?
		var chartOn;
		if (!mainChart) {
			chartOn = false;
		} else {
			chartOn = true;
		}

		// legend on the opinion maps will be on on page load
						
		loadMedia(latitude,longitude,zoom,MapLayer,PawnShops,CheckCashing,WireTransfer,Banks,McDonalds,SubwayLines,Media,popup2Content,popup2LatLon,popup3Content,popup3LatLon,chartOn);
		
		// function to save the map settings
		function loadMedia(latitude,longitude,zoom,MapLayer,PawnShops,CheckCashing,WireTransfer,Banks,McDonalds,SubwayLines,Media,popup2Content,popup2LatLon,popup3Content,popup3LatLon,chartOn){
			console.log(popup3Content);
		    $.ajax({
		        type: 'GET',
		        url:  'savemap/?latitude=' + latitude + '&longitude=' + longitude + '&zoom=' + zoom + '&MapLayer=' + MapLayer + '&PawnShops=' + PawnShops + '&CheckCashing=' + CheckCashing + '&WireTransfer=' + WireTransfer + '&Banks=' + Banks + '&McDonalds=' + McDonalds + '&SubwayLines=' + SubwayLines + '&Media=' + Media + '&title=' + title + '&popup2Content=' + popup2Content + '&popup2LatLon=' + popup2LatLon + '&popup3Content=' + popup3Content + '&popup3LatLon=' + popup3LatLon + '&chartOn=' + chartOn, 
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
