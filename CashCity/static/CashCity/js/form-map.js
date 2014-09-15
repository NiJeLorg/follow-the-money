/**
 * form-map.js: javascript that creates and controls the maps on the forms
 * Author: NiJeL
 */
function FormMap() {	
    //set base Mapbox tiles
    var basemap = "sw2279.NYCLotto";
	
	//set initial lat and lng if form is already populated
	if (initialLat != 'None' && initialLng != 'None') {
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
	
	if (initialLat != 'None' && initialLng != 'None') {
		marker = L.marker([lat, lng]).addTo(this.map);
	}
	
}

FormMap.prototype.addGeoSearch = function(){
	new L.Control.GeoSearch({
	    provider: new L.GeoSearch.Provider.Google(),
		searchLabel: "Address"
	}).addTo(this.map);
	$(".leaflet-control-geosearch").prependTo("#geosearch-target-form");
}


