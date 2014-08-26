/**
 * form-map.js: javascript that creates and controls the maps on the forms
 * Author: NiJeL
 */

function FormMap() {	
    //set base Mapbox tiles
    var basemap = "sw2279.NYCLotto";

    //where brooklyn at?!40.7429 N, 73.9188
    this.map = L.mapbox.map('formMap', basemap,{minZoom:11,maxZoom:16,zoomControl:false}).setView([40.7429,-73.9188], 11);
	
}

FormMap.prototype.addGeoSearch = function(){
	new L.Control.GeoSearch({
	    provider: new L.GeoSearch.Provider.Google(),
		searchLabel: "Address"
	}).addTo(this.map);
	$(".leaflet-control-geosearch").prependTo("#geosearch-target-form");
}


