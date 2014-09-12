/**
 * form-map.js: javascript that creates and controls the maps on the forms
 * Author: NiJeL
 */

$(document).ready( function() {
	var mediaMap = new MediaMap();
});


function MediaMap() {	
    //set base Mapbox tiles
    var basemap = "sw2279.NYCLotto";

    this.map = L.mapbox.map('mediaMap', basemap,{minZoom:11,maxZoom:16,zoomControl:false}).setView([lat,lng], 15);
	
	var Icon = L.icon({
	    iconUrl: iconUrl,
	    iconSize: [42, 50],
		iconAnchor: [17, 38], 
	});
	
	L.marker([lat, lng], {icon: Icon}).addTo(this.map);
	
}


