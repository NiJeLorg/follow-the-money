/* 
* Function to create a generic City Digits map 
*/

function CityDigitsMap() {
    //initial values
    this.neighborhoodLayer = null;
	var topojsonLayer = null;
	
    //set base Mapbox tiles
    var basemap = "sw2279.NYCLotto";

    //where brooklyn at?!40.7429 N, 73.9188
    this.map = L.mapbox.map('map', basemap,{minZoom:11,maxZoom:16,zoomControl:false}).setView([40.7429,-73.9188], 13);
	
    //set params
    this.height = $(window).height()-$(".navbar").height();
    this.width = $(window).width();

    //disable unwanted events
    this.map.doubleClickZoom.enable();
    this.map.scrollWheelZoom.disable();
    this.map.gridControl.options.follow = true;
	
	//points and lines
	this.LOC1_PAWN_SHOPS = null;
	this.LOC2_CHECK_CASHING = null;
	this.LOC3_WIRE_TRANSFER = null;
	this.LOC4_AFIS = null;
	this.LOC5_BANKS = null;
	this.LOC6_MCDONALDS = null;
	this.LOC7_SUBWAY_LINES = null;
	
	//predefined map layers
	this.MAP1_POP_POVERTY = null;
	this.MAP2_MED_HH_INCOME = null;
	this.MAP3_PCT_UNEMPLOYED = null;
	this.MAP4_PCT_FOREIGN_BORN = null;
	
	//calculated map layers
	this.CREATEMAP1_AFI_PER_SQMILE = null;
	this.CREATEMAP2_BANKS_PER_SQMILE = null;
	this.CREATEMAP3_PAWN_SHOPS_PER_SQMILE = null;
	this.CREATEMAP4_MCDONALDS_PER_SQMILE = null;
	this.CREATEMAP5_HH_PER_AFI = null;
	this.CREATEMAP6_HH_PER_BANK = null;
	this.CREATEMAP7_HH_PER_MCDONALDS = null;
	this.CREATEMAP8_HH_PER_PAWN_SHOP = null;
	this.CREATEMAP9_AFIS_PER_BANK = null;
	this.CREATEMAP10_BANKS_PER_AFI = null;
	
}

CityDigitsMap.onEachFeature = function(feature,layer){
}


CityDigitsMap.prototype.loadLayers = function (){
    var self = this;
    //show map ui nav
    //$("#map-nav").load( RELATIVE_URL + "/map/nav/");
	
	// load topoJSON data for neighborhoods
	// path to neighborhoods defined in index.html django template

	// define layer styles and oneachfeature popup styling
	this.MAP1_POP_POVERTY_style = L.geoJson(null, {
	    style: CityDigitsMap.getStyleColorFor_MAP1_POP_POVERTY,
		onEachFeature: CityDigitsMap.onEachFeature
	});
	this.MAP2_MED_HH_INCOME_style = L.geoJson(null, {
		style: CityDigitsMap.getStyleColorFor_MAP2_MED_HH_INCOME,
		onEachFeature: CityDigitsMap.onEachFeature
	});
	this.MAP3_PCT_UNEMPLOYED_style = L.geoJson(null, {
		style: CityDigitsMap.getStyleColorFor_MAP3_PCT_UNEMPLOYED,
		onEachFeature: CityDigitsMap.onEachFeature
	});
	this.MAP4_PCT_FOREIGN_BORN_style = L.geoJson(null, {
		style: CityDigitsMap.getStyleColorFor_MAP4_PCT_FOREIGN_BORN,
		onEachFeature: CityDigitsMap.onEachFeature
	});
		
	// load layers
	this.MAP1_POP_POVERTY = omnivore.topojson(neighborhoods, null, this.MAP1_POP_POVERTY_style);
	this.MAP2_MED_HH_INCOME = omnivore.topojson(neighborhoods, null, this.MAP2_MED_HH_INCOME_style);
	this.MAP3_PCT_UNEMPLOYED = omnivore.topojson(neighborhoods, null, this.MAP3_PCT_UNEMPLOYED_style);
	this.MAP4_PCT_FOREIGN_BORN = omnivore.topojson(neighborhoods, null, this.MAP4_PCT_FOREIGN_BORN_style);
	
	//start with value population in poverty for initial load
    this.neighborhoodLayer = this.MAP1_POP_POVERTY.addTo(this.map);
		

}


CityDigitsMap.getStyleColorFor_MAP1_POP_POVERTY = function (feature){
    try{
        var value = feature.properties.PovertyPer;
        var fillColor = null;
        if(value >= 0 && value <=0.1){
			fillColor = "#c7ebff";
        }
        if(value >0.1 && value <=0.15){
            fillColor = "#8fd9f7";
        }
        if(value >0.15 && value<=0.2){
        	fillColor = "#00bff2";
        }
        if(value > 0.2 && value <=0.3){
        	fillColor = "#008ce3";
        }
        if(value > 0.3 && value <=0.4) { 
			fillColor = "#0342b5";
        }
        if(value > 0.4) { 
			fillColor = "#173061";
        }
    }catch (e){

    }finally{
        return {
	        weight: 1,
	        opacity: .1,
	        color: 'white',
	        fillOpacity: 0.75,
	        fillColor: fillColor
        }
    }
}

CityDigitsMap.getStyleColorFor_MAP2_MED_HH_INCOME = function (feature){
    try{
        var value = feature.properties.MedHouInco;
        var fillColor = null;
        if(value >= 0 && value <=40000){
			fillColor = "#c7ebff";
        }
        if(value > 40000 && value <= 55000){
            fillColor = "#8fd9f7";
        }
        if(value > 55000 && value <= 70000){
        	fillColor = "#00bff2";
        }
        if(value > 70000 && value <= 85000){
        	fillColor = "#008ce3";
        }
        if(value > 85000 && value <= 100000) { 
			fillColor = "#0342b5";
        }
        if(value > 100000) { 
			fillColor = "#173061";
        }
    }catch (e){

    }finally{
        return {
	        weight: 1,
	        opacity: .1,
	        color: 'white',
	        fillOpacity: 0.75,
	        fillColor: fillColor
        }
    }
}

CityDigitsMap.getStyleColorFor_MAP3_PCT_UNEMPLOYED = function (feature){
    try{
        var value = feature.properties.UnempRate;
        var fillColor = null;
        if(value >= 0 && value <= 0.03){
			fillColor = "#c7ebff";
        }
        if(value > 0.03 && value <= 0.06){
            fillColor = "#8fd9f7";
        }
        if(value > 0.06 && value <= 0.09){
        	fillColor = "#00bff2";
        }
        if(value > 0.09 && value <= 0.12){
        	fillColor = "#008ce3";
        }
        if(value > 0.12 && value <= 0.15) { 
			fillColor = "#0342b5";
        }
        if(value > 0.20) { 
			fillColor = "#173061";
        }
    }catch (e){

    }finally{
        return {
	        weight: 1,
	        opacity: .1,
	        color: 'white',
	        fillOpacity: 0.75,
	        fillColor: fillColor
        }
    }
}

CityDigitsMap.getStyleColorFor_MAP4_PCT_FOREIGN_BORN = function (feature){
    try{
        var value = feature.properties.ForBornPer;
        var fillColor = null;
        if(value >= 0 && value <= 0.15){
			fillColor = "#c7ebff";
        }
        if(value > 0.15 && value <= 0.25){
            fillColor = "#8fd9f7";
        }
        if(value > 0.25 && value<= 0.35){
        	fillColor = "#00bff2";
        }
        if(value > 0.35 && value <= 0.45){
        	fillColor = "#008ce3";
        }
        if(value > 0.45 && value <= 0.55) { 
			fillColor = "#0342b5";
        }
        if(value > 0.55) { 
			fillColor = "#173061";
        }
    }catch (e){

    }finally{
        return {
	        weight: 1,
	        opacity: .1,
	        color: 'white',
	        fillOpacity: 0.75,
	        fillColor: fillColor
        }
    }
}

