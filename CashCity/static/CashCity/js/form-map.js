/**
 * form-map.js: javascript that creates and controls the maps on the forms
 * Author: NiJeL
 */
function FormMap() {	
    //set base Mapbox tiles
    var basemap = "sw2279.NYCLotto";	
	
	//set initial lat and lng if form is already populated
	if ( (initialLat != 'None' && initialLat != '') && (initialLng != 'None' && initialLng != '') ) {
		lat = initialLat;
		lng = initialLng;
		zoom = 16;
	} else {
		lat = '40.7429';
		lng = '-73.9188';
		zoom = '11';		
	}

    //where brooklyn at?!40.7429 N, 73.9188
    this.map = L.mapbox.map('formMap', basemap,{minZoom:11,maxZoom:16,zoomControl:false}).setView([lat,lng], zoom);
	var mapObject = this.map; 
	
	if ( (initialLat != 'None' && initialLat != '') && (initialLng != 'None' && initialLng != '') ) {
		// add marker if lat/lon is already set
		marker = L.marker([lat, lng]).addTo(this.map);
	} else {
		// attempt to locate user with set view only if lat/lng is not already set
		this.map.locate({setView: true, maxZoom: 16});
	}
	
	
	function onLocationFound(e) {
		marker = L.marker(e.latlng).addTo(mapObject);
		//set latitude and longitude for hidden form
		var latitude = e.latlng.lat;
		var longitude = e.latlng.lng;
		latitude = latitude.toFixed(6);
		longitude = longitude.toFixed(6);
		$('#id_latitude').val(latitude);
		$('#id_longitude').val(longitude);
		$('#id_address').val('Location Found')
		$('#leaflet-control-geosearch-qry').attr("value", 'Location Found')			

	}		
	
	this.map.on('locationfound', onLocationFound);
	
	
	function onLocationError(e) {
	    alert(e.message);
	}

	this.map.on('locationerror', onLocationError);
	
}

FormMap.prototype.addGeoSearch = function(){
	new L.Control.GeoSearch({
	    provider: new L.GeoSearch.Provider.Google(),
		searchLabel: "Address"
	}).addTo(this.map);
	$(".leaflet-control-geosearch").prependTo("#geosearch-target-form");
}


