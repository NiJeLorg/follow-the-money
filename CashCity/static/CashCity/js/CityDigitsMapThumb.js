/* 
* Adding Layers to City Digits Thumbnail maps
*/

function CityDigitsMapThumb(id, lat, lon, zoom) {
	
    //set base Mapbox tiles
    var basemap = "sw2279.NYCLotto";

    //where brooklyn at?!40.7429 N, 73.9188
    this.map = L.mapbox.map('map'+id, basemap,{minZoom:11,maxZoom:16,zoomControl:false}).setView([lat,lon], zoom);
	
    //disable unwanted events
    this.map.dragging.disable();
    this.map.touchZoom.disable();
    this.map.doubleClickZoom.disable();
    this.map.scrollWheelZoom.disable();
    this.map.boxZoom.disable();
	
	//points and lines
	this.LOC1_PAWN_SHOPS = null;
	this.LOC2_CHECK_CASHING = null;
	this.LOC3_WIRE_TRANSFER = null;
	this.LOC4_BANKS = null;
	this.LOC5_MCDONALDS = null;
	this.LOC6_SUBWAY_LINES = null;
	this.LOC7_SUBWAY_STATIONS = null;
	
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

CityDigitsMapThumb.prototype.loadLayers = function (){
    var self = this;
		
	// load topoJSON data for neighborhoods
	// path to neighborhoods defined in index.html django template

	// define layer styles and oneachfeature popup styling
	this.MAP1_POP_POVERTY_style = L.geoJson(null, {
	    style: CityDigitsMapThumb.getStyleColorFor_MAP1_POP_POVERTY
	});
	this.MAP2_MED_HH_INCOME_style = L.geoJson(null, {
		style: CityDigitsMapThumb.getStyleColorFor_MAP2_MED_HH_INCOME
	});
	this.MAP3_PCT_UNEMPLOYED_style = L.geoJson(null, {
		style: CityDigitsMapThumb.getStyleColorFor_MAP3_PCT_UNEMPLOYED
	});
	this.MAP4_PCT_FOREIGN_BORN_style = L.geoJson(null, {
		style: CityDigitsMapThumb.getStyleColorFor_MAP4_PCT_FOREIGN_BORN
	});
			
	// load layers
	this.MAP1_POP_POVERTY = omnivore.topojson(neighborhoods, null, this.MAP1_POP_POVERTY_style);
	this.MAP2_MED_HH_INCOME = omnivore.topojson(neighborhoods, null, this.MAP2_MED_HH_INCOME_style);
	this.MAP3_PCT_UNEMPLOYED = omnivore.topojson(neighborhoods, null, this.MAP3_PCT_UNEMPLOYED_style);
	this.MAP4_PCT_FOREIGN_BORN = omnivore.topojson(neighborhoods, null, this.MAP4_PCT_FOREIGN_BORN_style);
	
}

CityDigitsMapThumb.prototype.loadCreateMapLayers = function (callBack){
    var self = this;
			
	// load topoJSON data for neighborhoods
	// path to neighborhoods defined in index.html django template

	// define layer styles and oneachfeature popup styling
	this.CREATEMAP1_AFI_PER_SQMILE_style = L.geoJson(null, {
		style: CityDigitsMapThumb.getStyleColorFor_CREATEMAP1_AFI_PER_SQMILE
	});
	this.CREATEMAP2_BANKS_PER_SQMILE_style = L.geoJson(null, {
		style: CityDigitsMapThumb.getStyleColorFor_CREATEMAP2_BANKS_PER_SQMILE
	});
	this.CREATEMAP3_PAWN_SHOPS_PER_SQMILE_style = L.geoJson(null, {
		style: CityDigitsMapThumb.getStyleColorFor_CREATEMAP3_PAWN_SHOPS_PER_SQMILE
	});
	this.CREATEMAP4_MCDONALDS_PER_SQMILE_style = L.geoJson(null, {
		style: CityDigitsMapThumb.getStyleColorFor_CREATEMAP4_MCDONALDS_PER_SQMILE
	});
	this.CREATEMAP5_HH_PER_AFI_style = L.geoJson(null, {
		style: CityDigitsMapThumb.getStyleColorFor_CREATEMAP5_HH_PER_AFI
	});
	this.CREATEMAP6_HH_PER_BANK_style = L.geoJson(null, {
		style: CityDigitsMapThumb.getStyleColorFor_CREATEMAP6_HH_PER_BANK
	});
	this.CREATEMAP7_HH_PER_MCDONALDS_style = L.geoJson(null, {
		style: CityDigitsMapThumb.getStyleColorFor_CREATEMAP7_HH_PER_MCDONALDS
	});
	this.CREATEMAP8_HH_PER_PAWN_SHOP_style = L.geoJson(null, {
		style: CityDigitsMapThumb.getStyleColorFor_CREATEMAP8_HH_PER_PAWN_SHOP
	});
	this.CREATEMAP9_AFIS_PER_BANK_style = L.geoJson(null, {
		style: CityDigitsMapThumb.getStyleColorFor_CREATEMAP9_AFIS_PER_BANK
	});
	this.CREATEMAP10_BANKS_PER_AFI_style = L.geoJson(null, {
		style: CityDigitsMapThumb.getStyleColorFor_CREATEMAP10_BANKS_PER_AFI
	});

			
	// load layers
	this.CREATEMAP1_AFI_PER_SQMILE = omnivore.topojson(neighborhoods, null, this.CREATEMAP1_AFI_PER_SQMILE_style);
	this.CREATEMAP2_BANKS_PER_SQMILE = omnivore.topojson(neighborhoods, null, this.CREATEMAP2_BANKS_PER_SQMILE_style);
	this.CREATEMAP3_PAWN_SHOPS_PER_SQMILE = omnivore.topojson(neighborhoods, null, this.CREATEMAP3_PAWN_SHOPS_PER_SQMILE_style);
	this.CREATEMAP4_MCDONALDS_PER_SQMILE = omnivore.topojson(neighborhoods, null, this.CREATEMAP4_MCDONALDS_PER_SQMILE_style);
	this.CREATEMAP5_HH_PER_AFI = omnivore.topojson(neighborhoods, null, this.CREATEMAP5_HH_PER_AFI_style);
	this.CREATEMAP6_HH_PER_BANK = omnivore.topojson(neighborhoods, null, this.CREATEMAP6_HH_PER_BANK_style);
	this.CREATEMAP7_HH_PER_MCDONALDS = omnivore.topojson(neighborhoods, null, this.CREATEMAP7_HH_PER_MCDONALDS_style);
	this.CREATEMAP8_HH_PER_PAWN_SHOP = omnivore.topojson(neighborhoods, null, this.CREATEMAP8_HH_PER_PAWN_SHOP_style);
	this.CREATEMAP9_AFIS_PER_BANK = omnivore.topojson(neighborhoods, null, this.CREATEMAP9_AFIS_PER_BANK_style);
	this.CREATEMAP10_BANKS_PER_AFI = omnivore.topojson(neighborhoods, null, this.CREATEMAP10_BANKS_PER_AFI_style);
		
}


CityDigitsMapThumb.getStyleColorFor_MAP1_POP_POVERTY = function (feature){
    try{
        var value = feature.properties.PovertyPer;
        var fillColor = null;
        if(value >= 0 && value <=0.1){
			fillColor = "#a5f3fa";
        }
        if(value >0.1 && value <=0.15){
            fillColor = "#83E8F9";
        }
        if(value >0.15 && value<=0.2){
        	fillColor = "#62def8";
        }
        if(value > 0.2 && value <=0.3){
        	fillColor = "#0bb6ec";
        }
        if(value > 0.3 && value <=0.4) { 
			fillColor = "#178def";
        }
        if(value > 0.4) { 
			fillColor = "#254aeb";
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

CityDigitsMapThumb.getStyleColorFor_MAP2_MED_HH_INCOME = function (feature){
    try{
        var value = feature.properties.MedHouInco;
        var fillColor = null;
        if(value >= 0 && value <=40000){
			fillColor = "#a5f3fa";
        }
        if(value > 40000 && value <= 55000){
            fillColor = "#83E8F9";
        }
        if(value > 55000 && value <= 70000){
        	fillColor = "#62def8";
        }
        if(value > 70000 && value <= 85000){
        	fillColor = "#0bb6ec";
        }
        if(value > 85000 && value <= 100000) { 
			fillColor = "#178def";
        }
        if(value > 100000) { 
			fillColor = "#254aeb";
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

CityDigitsMapThumb.getStyleColorFor_MAP3_PCT_UNEMPLOYED = function (feature){
    try{
        var value = feature.properties.UnempRate;
        var fillColor = null;
        if(value >= 0 && value <= 0.03){
			fillColor = "#a5f3fa";
        }
        if(value > 0.03 && value <= 0.06){
            fillColor = "#83E8F9";
        }
        if(value > 0.06 && value <= 0.09){
        	fillColor = "#62def8";
        }
        if(value > 0.09 && value <= 0.12){
        	fillColor = "#0bb6ec";
        }
        if(value > 0.12 && value <= 0.15) { 
			fillColor = "#178def";
        }
        if(value > 0.15) { 
			fillColor = "#254aeb";
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

CityDigitsMapThumb.getStyleColorFor_MAP4_PCT_FOREIGN_BORN = function (feature){
    try{
        var value = feature.properties.ForBornPer;
        var fillColor = null;
        if(value >= 0 && value <= 0.15){
			fillColor = "#a5f3fa";
        }
        if(value > 0.15 && value <= 0.25){
            fillColor = "#83E8F9";
        }
        if(value > 0.25 && value<= 0.35){
        	fillColor = "#62def8";
        }
        if(value > 0.35 && value <= 0.45){
        	fillColor = "#0bb6ec";
        }
        if(value > 0.45 && value <= 0.55) { 
			fillColor = "#178def";
        }
        if(value > 0.55) { 
			fillColor = "#254aeb";
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

CityDigitsMapThumb.getStyleColorFor_CREATEMAP1_AFI_PER_SQMILE = function (feature){
    try{
        var value = feature.properties.AFS_SQMI;
        var fillColor = null;
        if(value <= 0){
			fillColor = "#ffffff";
        }
        if(value > 0 && value <= 1){
			fillColor = "#a5f3fa";
        }
        if(value > 1 && value<= 5){
        	fillColor = "#62def8";
        }
        if(value > 5 && value <= 10){
        	fillColor = "#0bb6ec";
        }
        if(value > 10 && value <= 20) { 
			fillColor = "#178def";
        }
        if(value > 20) { 
			fillColor = "#254aeb";
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

CityDigitsMapThumb.getStyleColorFor_CREATEMAP2_BANKS_PER_SQMILE = function (feature){
    try{
        var value = feature.properties.BANK_SQMI;
        var fillColor = null;
        if(value <= 0){
			fillColor = "#ffffff";
        }
        if(value > 0 && value <= 1){
			fillColor = "#a5f3fa";
        }
        if(value > 1 && value<= 5){
        	fillColor = "#62def8";
        }
        if(value > 5 && value <= 10){
        	fillColor = "#0bb6ec";
        }
        if(value > 10 && value <= 20) { 
			fillColor = "#178def";
        }
        if(value > 20) { 
			fillColor = "#254aeb";
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

CityDigitsMapThumb.getStyleColorFor_CREATEMAP3_PAWN_SHOPS_PER_SQMILE = function (feature){
    try{
        var value = feature.properties.PAWN_SQMI;
        var fillColor = null;
        if(value <= 0){
			fillColor = "#ffffff";
        }
        if(value > 0 && value <= 1){
			fillColor = "#a5f3fa";
        }
        if(value > 1 && value<= 5){
        	fillColor = "#62def8";
        }
        if(value > 5 && value <= 10){
        	fillColor = "#0bb6ec";
        }
        if(value > 10 && value <= 20) { 
			fillColor = "#178def";
        }
        if(value > 20) { 
			fillColor = "#254aeb";
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

CityDigitsMapThumb.getStyleColorFor_CREATEMAP4_MCDONALDS_PER_SQMILE = function (feature){
    try{
        var value = feature.properties.McD_SQMI;
        var fillColor = null;
        if(value <= 0){
			fillColor = "#ffffff";
        }
        if(value > 0 && value <= 1){
			fillColor = "#a5f3fa";
        }
        if(value > 1 && value<= 5){
        	fillColor = "#62def8";
        }
        if(value > 5 && value <= 10){
        	fillColor = "#0bb6ec";
        }
        if(value > 10 && value <= 20) { 
			fillColor = "#178def";
        }
        if(value > 20) { 
			fillColor = "#254aeb";
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

CityDigitsMapThumb.getStyleColorFor_CREATEMAP5_HH_PER_AFI = function (feature){
    try{
        var value = feature.properties.HH_AFS;
        var fillColor = null;
        if(value == -1){
			fillColor = "#ffffff";
        }
        if(value == -1000){
			fillColor = "#9c9c9c";
        }
        if(value == -2000){
			fillColor = "#254aeb";
        }
        if(value >= 0 && value <= 1000){
			fillColor = "#a5f3fa";
        }
        if(value > 1000 && value <= 2000){
            fillColor = "#83E8F9";
        }
        if(value > 2000 && value<= 3000){
        	fillColor = "#62def8";
        }
        if(value > 3000 && value <= 4000){
        	fillColor = "#0bb6ec";
        }
        if(value > 4000) { 
			fillColor = "#178def";
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

CityDigitsMapThumb.getStyleColorFor_CREATEMAP6_HH_PER_BANK = function (feature){
    try{
        var value = feature.properties.HH_BANK;
        var fillColor = null;
        if(value == -1){
			fillColor = "#ffffff";
        }
        if(value == -1000){
			fillColor = "#9c9c9c";
        }
        if(value == -2000){
			fillColor = "#254aeb";
        }
        if(value >= 0 && value <= 1000){
			fillColor = "#a5f3fa";
        }
        if(value > 1000 && value <= 2000){
            fillColor = "#83E8F9";
        }
        if(value > 2000 && value<= 3000){
        	fillColor = "#62def8";
        }
        if(value > 3000 && value <= 4000){
        	fillColor = "#0bb6ec";
        }
        if(value > 4000) { 
			fillColor = "#178def";
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

CityDigitsMapThumb.getStyleColorFor_CREATEMAP7_HH_PER_MCDONALDS = function (feature){
    try{
        var value = feature.properties.HH_McD;
        var fillColor = null;
        if(value == -1){
			fillColor = "#ffffff";
        }
        if(value == -1000){
			fillColor = "#9c9c9c";
        }
        if(value == -2000){
			fillColor = "#254aeb";
        }
        if(value >= 0 && value <= 5000){
			fillColor = "#a5f3fa";
        }
        if(value > 5000 && value <= 10000){
            fillColor = "#83E8F9";
        }
        if(value > 10000 && value<= 20000){
        	fillColor = "#62def8";
        }
        if(value > 20000 && value <= 40000){
        	fillColor = "#0bb6ec";
        }
        if(value > 40000) { 
			fillColor = "#178def";
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

CityDigitsMapThumb.getStyleColorFor_CREATEMAP8_HH_PER_PAWN_SHOP = function (feature){
    try{
        var value = feature.properties.HH_PAWN;
        var fillColor = null;
        if(value == -1){
			fillColor = "#ffffff";
        }
        if(value == -1000){
			fillColor = "#9c9c9c";
        }
        if(value == -2000){
			fillColor = "#254aeb";
        }
        if(value >= 0 && value <= 5000){
			fillColor = "#a5f3fa";
        }
        if(value > 5000 && value <= 10000){
            fillColor = "#83E8F9";
        }
        if(value > 10000 && value<= 20000){
        	fillColor = "#62def8";
        }
        if(value > 20000 && value <= 40000){
        	fillColor = "#0bb6ec";
        }
        if(value > 40000) { 
			fillColor = "#178def";
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

CityDigitsMapThumb.getStyleColorFor_CREATEMAP9_AFIS_PER_BANK = function (feature){
    try{
        var value = feature.properties.AFS_BANK;
        var fillColor = null;
        if(value == -1 || value == 0){
			fillColor = "#ffffff";
        }
        if(value == -1000){
			fillColor = "#9c9c9c";
        }
        if(value > 0 && value <= 0.5){
			fillColor = "#a5f3fa";
        }
        if(value > 0.5 && value < 1.0){
            fillColor = "#83E8F9";
        }
        if(value == 1){
        	fillColor = "#62def8";
        }
        if(value > 1 && value < 2){
        	fillColor = "#0bb6ec";
        }
        if(value >= 2) { 
			fillColor = "#178def";
        }
        if(value >= 1000){
			fillColor = "#254aeb";
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

CityDigitsMapThumb.getStyleColorFor_CREATEMAP10_BANKS_PER_AFI = function (feature){
    try{
        var value = feature.properties.BANK_AFS;
        var fillColor = null;
        if(value == -1 || value == 0){
			fillColor = "#ffffff";
        }
        if(value == -1000){
			fillColor = "#9c9c9c";
        }
        if(value >= 0 && value <= 0.5){
			fillColor = "#a5f3fa";
        }
        if(value > 0.5 && value < 1.0){
            fillColor = "#83E8F9";
        }
        if(value == 1){
        	fillColor = "#62def8";
        }
        if(value > 1 && value < 2){
        	fillColor = "#0bb6ec";
        }
        if(value >= 2) { 
			fillColor = "#178def";
        }
        if(value >= 1000){
			fillColor = "#254aeb";
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


CityDigitsMapThumb.prototype.loadMarkers = function(){
		
	this.LOC1_PAWN_SHOPS = null;
	this.LOC2_CHECK_CASHING = null;
	this.LOC3_WIRE_TRANSFER = null;
	this.LOC4_BANKS = null;
	this.LOC5_MCDONALDS = null;
	this.LOC6_SUBWAY_LINES = null;
	this.LOC7_SUBWAY_STATIONS = null;

	// define layer styles and oneachfeature popup styling
	this.LOC1_PAWN_SHOPS_style = L.geoJson(null, {
		pointToLayer: CityDigitsMapThumb.getStyleFor_LOC1_PAWN_SHOPS
	});
	this.LOC2_CHECK_CASHING_style = L.geoJson(null, {
		pointToLayer: CityDigitsMapThumb.getStyleFor_LOC2_CHECK_CASHING
	});
	this.LOC3_WIRE_TRANSFER_style = L.geoJson(null, {
		pointToLayer: CityDigitsMapThumb.getStyleFor_LOC3_WIRE_TRANSFER
	});	
	this.LOC4_BANKS_style = L.geoJson(null, {
		pointToLayer: CityDigitsMapThumb.getStyleFor_LOC4_BANKS
	});	
	this.LOC5_MCDONALDS_style = L.geoJson(null, {
		pointToLayer: CityDigitsMapThumb.getStyleFor_LOC5_MCDONALDS
	});	
	this.LOC6_SUBWAY_LINES_style = L.geoJson(null, {
		style: CityDigitsMapThumb.getStyleFor_LOC6_SUBWAY_LINES
	});	
	this.LOC7_SUBWAY_STATIONS_style = L.geoJson(null, {
		pointToLayer: CityDigitsMapThumb.getStyleFor_LOC7_SUBWAY_STATIONS
	});	
	
	// load layers
	this.LOC1_PAWN_SHOPS = omnivore.csv(PawnShops, null, this.LOC1_PAWN_SHOPS_style);
	this.LOC2_CHECK_CASHING = omnivore.csv(CheckCashing, null, this.LOC2_CHECK_CASHING_style);
	this.LOC3_WIRE_TRANSFER = omnivore.csv(MoneyTransferServices, null, this.LOC3_WIRE_TRANSFER_style);
	this.LOC4_BANKS = omnivore.csv(CommercialBanks, null, this.LOC4_BANKS_style);
	this.LOC5_MCDONALDS = omnivore.csv(Mcdonalds, null, this.LOC5_MCDONALDS_style);
	this.LOC6_SUBWAY_LINES = omnivore.geojson(SubwayLines, null, this.LOC6_SUBWAY_LINES_style);
	this.LOC7_SUBWAY_STATIONS = omnivore.geojson(SubwayStations, null, this.LOC7_SUBWAY_STATIONS_style);

}


CityDigitsMapThumb.getStyleFor_LOC1_PAWN_SHOPS = function (feature, latlng){
	var pawnShopMarker = L.circle(latlng, 80, {
		stroke: false,
		fillColor: '#eb4a42',
		fillOpacity: 0.75
	});
	
	return pawnShopMarker;
	
}

CityDigitsMapThumb.getStyleFor_LOC2_CHECK_CASHING = function (feature, latlng){
	var checkCashingMarker = L.circle(latlng, 80, {
		stroke: false,
		fillColor: '#ffa77f',
		fillOpacity: 0.75
	});
	
	return checkCashingMarker;
	
}

CityDigitsMapThumb.getStyleFor_LOC3_WIRE_TRANSFER = function (feature, latlng){
	var wireTransferMarker = L.circle(latlng, 80, {
		stroke: false,
		fillColor: '#fa8a12',
		fillOpacity: 0.75
	});
	
	return wireTransferMarker;
	
}

CityDigitsMapThumb.getStyleFor_LOC4_BANKS = function (feature, latlng){
	var banksMarker = L.circle(latlng, 80, {
		stroke: false,
		fillColor: '#fa8aa3',
		fillOpacity: 0.75
	});
	
	return banksMarker;
	
}

CityDigitsMapThumb.getStyleFor_LOC5_MCDONALDS = function (feature, latlng){
	var mcdonaldsMarker = L.circle(latlng, 80, {
		stroke: false,
		fillColor: '#ebcf42',
		fillOpacity: 0.75
	});
	
	return mcdonaldsMarker;
	
}

CityDigitsMapThumb.getStyleFor_LOC6_SUBWAY_LINES = function (feature, layer){
	var subwayLinesInitialStyle = {
	    color: "#9c9c9c",
	    weight: 3,
	    opacity: 0.75
	};
	
	return subwayLinesInitialStyle;
	
}

CityDigitsMapThumb.getStyleFor_LOC7_SUBWAY_STATIONS = function (feature, latlng){
	var subwayStationInitialStyle = L.circleMarker(latlng, {
	    radius: 0,
	    weight: 0,
	    fillOpacity: 0.75
	});
	
	return subwayStationInitialStyle;
	
}


CityDigitsMapThumb.prototype.loadMedia = function(){
			
	this.MEDIA_IMAGES = null;
	this.MEDIA_AUDIO = null;
	this.MEDIA_NOTE = null;
	this.MEDIA_INTERVIEW = null;

	// define layer styles and oneachfeature popup styling
	this.MEDIA_IMAGES = L.geoJson(mediaImageGeojson, {
		pointToLayer: CityDigitsMapThumb.getStyleFor_MEDIA
	});
	// define layer styles and oneachfeature popup styling
	this.MEDIA_AUDIO = L.geoJson(mediaAudioGeojson, {
		pointToLayer: CityDigitsMapThumb.getStyleFor_MEDIA
	});
	// define layer styles and oneachfeature popup styling
	this.MEDIA_NOTE = L.geoJson(mediaNoteGeojson, {
		pointToLayer: CityDigitsMapThumb.getStyleFor_MEDIA
	});
	// define layer styles and oneachfeature popup styling
	this.MEDIA_INTERVIEW = L.geoJson(mediaInterviewGeojson, {
		pointToLayer: CityDigitsMapThumb.getStyleFor_MEDIA
	});
		
}

CityDigitsMapThumb.getStyleFor_MEDIA = function(feature, latlng){
	var mediaImageIcon = L.icon({
	    iconUrl: feature.properties.iconUrl,
	    iconSize: [42, 50],
		iconAnchor: [17, 38], 
	});

	return L.marker(latlng, {icon: mediaImageIcon});
	
}


CityDigitsMapThumb.loadLayerFor = function(layerId){
	
    if(layerId == "MAP1"){
        mainLayer = MY_MAP.MAP1_POP_POVERTY;
		mainLayer._leaflet_id = 'legendpoverty';
		mainLayer.addTo(MY_MAP.map).bringToBack();
		// swap legend if open
		if ($( "#legendid" ).hasClass( "legendClosed" )) {
			// do nothing
		} else {
			// change to
			$('#legendid').attr('class', mainLayer._leaflet_id);	
		}		
		// re-draw chart if open
		CityDigitsMapThumb.drawChartOnSwap();
	 }	
    if(layerId == "MAP2"){
        mainLayer = MY_MAP.MAP2_MED_HH_INCOME;
			  mainLayer._leaflet_id = 'legendmedhhinc';
			  mainLayer.addTo(MY_MAP.map).bringToBack();
	  		if ($( "#legendid" ).hasClass( "legendClosed" )) {
	  			// do nothing
	  		} else {
	  			// change to
	  			$('#legendid').attr('class', mainLayer._leaflet_id);	
	  		}
			// re-draw chart if open
			CityDigitsMapThumb.drawChartOnSwap();
			
    }	
    if(layerId == "MAP3"){
        mainLayer = MY_MAP.MAP3_PCT_UNEMPLOYED;
			  mainLayer._leaflet_id = 'legendunemploy';
			  mainLayer.addTo(MY_MAP.map).bringToBack();
	  		if ($( "#legendid" ).hasClass( "legendClosed" )) {
	  			// do nothing
	  		} else {
	  			// change to
	  			$('#legendid').attr('class', mainLayer._leaflet_id);	
	  		}
			// re-draw chart if open
			CityDigitsMapThumb.drawChartOnSwap();	
		}	
    if(layerId == "MAP4"){
        mainLayer = MY_MAP.MAP4_PCT_FOREIGN_BORN;
			  mainLayer._leaflet_id = 'legendforeignborn';
			  mainLayer.addTo(MY_MAP.map).bringToBack();
    
	  		if ($( "#legendid" ).hasClass( "legendClosed" )) {
	  			// do nothing
	  		} else {
	  			// change to
	  			$('#legendid').attr('class', mainLayer._leaflet_id);	
	  		}
			// re-draw chart if open
			CityDigitsMapThumb.drawChartOnSwap();
		}
    if(layerId == "CREATEMAP1"){
        mainLayer = MY_MAP.CREATEMAP1_AFI_PER_SQMILE;
			  mainLayer._leaflet_id = 'legendAFIpersqmi';
			  mainLayer.addTo(MY_MAP.map).bringToBack();
	  		if ($( "#legendid" ).hasClass( "legendClosed" )) {
	  			// do nothing
	  		} else {
	  			// change to
	  			$('#legendid').attr('class', mainLayer._leaflet_id);	
	  		}
			// re-draw chart if open
			CityDigitsMapThumb.drawChartOnSwap();
    }
    if(layerId == "CREATEMAP2"){
        mainLayer = MY_MAP.CREATEMAP2_BANKS_PER_SQMILE;
			 mainLayer._leaflet_id = 'legendbankspersqmi';
			 mainLayer.addTo(MY_MAP.map).bringToBack();
	 		if ($( "#legendid" ).hasClass( "legendClosed" )) {
	 			// do nothing
	 		} else {
	 			// change to
	 			$('#legendid').attr('class', mainLayer._leaflet_id);	
	 		}
			// re-draw chart if open
			CityDigitsMapThumb.drawChartOnSwap();
    }
    if(layerId == "CREATEMAP3"){
        mainLayer = MY_MAP.CREATEMAP3_PAWN_SHOPS_PER_SQMILE;
		    mainLayer._leaflet_id = 'legendpawnsqmi';
		    mainLayer.addTo(MY_MAP.map).bringToBack();
			if ($( "#legendid" ).hasClass( "legendClosed" )) {
				// do nothing
			} else {
				// change to
				$('#legendid').attr('class', mainLayer._leaflet_id);	
			}
			// re-draw chart if open
			CityDigitsMapThumb.drawChartOnSwap();
    }
    if(layerId == "CREATEMAP4"){
        mainLayer = MY_MAP.CREATEMAP4_MCDONALDS_PER_SQMILE;
			  mainLayer._leaflet_id = 'legendmcdonaldspersqi';
				mainLayer.addTo(MY_MAP.map).bringToBack();
				if ($( "#legendid" ).hasClass( "legendClosed" )) {
					// do nothing
				} else {
					// change to
					$('#legendid').attr('class', mainLayer._leaflet_id);	
				}
				// re-draw chart if open
				CityDigitsMapThumb.drawChartOnSwap();
    }
    if(layerId == "CREATEMAP5"){
        mainLayer = MY_MAP.CREATEMAP5_HH_PER_AFI;
			  mainLayer._leaflet_id = 'legendhouseholdsperAFI';
			  mainLayer.addTo(MY_MAP.map).bringToBack();
	  		if ($( "#legendid" ).hasClass( "legendClosed" )) {
	  			// do nothing
	  		} else {
	  			// change to
	  			$('#legendid').attr('class', mainLayer._leaflet_id);	
	  		}
			// re-draw chart if open
			CityDigitsMapThumb.drawChartOnSwap();
    }
    if(layerId == "CREATEMAP6"){
        mainLayer = MY_MAP.CREATEMAP6_HH_PER_BANK;
		  	mainLayer._leaflet_id = 'legendhouseholdsperbank';
			  mainLayer.addTo(MY_MAP.map).bringToBack();
	  		if ($( "#legendid" ).hasClass( "legendClosed" )) {
	  			// do nothing
	  		} else {
	  			// change to
	  			$('#legendid').attr('class', mainLayer._leaflet_id);	
	  		}
			// re-draw chart if open
			CityDigitsMapThumb.drawChartOnSwap();
    }
    if(layerId == "CREATEMAP7"){
        mainLayer = MY_MAP.CREATEMAP7_HH_PER_MCDONALDS;
				mainLayer._leaflet_id = 'legendhouseholdsperMcD';
				mainLayer.addTo(MY_MAP.map).bringToBack();
				if ($( "#legendid" ).hasClass( "legendClosed" )) {
					// do nothing
				} else {
					// change to
					$('#legendid').attr('class', mainLayer._leaflet_id);	
				}
				// re-draw chart if open
				CityDigitsMapThumb.drawChartOnSwap();
    }
    if(layerId == "CREATEMAP8"){
        mainLayer = MY_MAP.CREATEMAP8_HH_PER_PAWN_SHOP;
				mainLayer._leaflet_id = 'legendhouseholdsperpawn';
				mainLayer.addTo(MY_MAP.map).bringToBack();
				if ($( "#legendid" ).hasClass( "legendClosed" )) {
					// do nothing
				} else {
					// change to
					$('#legendid').attr('class', mainLayer._leaflet_id);	
				}
				// re-draw chart if open
				CityDigitsMapThumb.drawChartOnSwap();
    }
    if(layerId == "CREATEMAP9"){
        mainLayer = MY_MAP.CREATEMAP9_AFIS_PER_BANK;
				mainLayer._leaflet_id = 'legendAFIsperbank';
				mainLayer.addTo(MY_MAP.map).bringToBack();
				if ($( "#legendid" ).hasClass( "legendClosed" )) {
					// do nothing
				} else {
					// change to
					$('#legendid').attr('class', mainLayer._leaflet_id);	
				}
				// re-draw chart if open
				CityDigitsMapThumb.drawChartOnSwap();
    }
    if(layerId == "CREATEMAP10"){
        mainLayer = MY_MAP.CREATEMAP10_BANKS_PER_AFI;
				mainLayer._leaflet_id = 'legendbanksperAFIs';
				mainLayer.addTo(MY_MAP.map).bringToBack();
				if ($( "#legendid" ).hasClass( "legendClosed" )) {
					// do nothing
				} else {
					// change to
					$('#legendid').attr('class', mainLayer._leaflet_id);	
				}
				// re-draw chart if open
				CityDigitsMapThumb.drawChartOnSwap();
    }

}

CityDigitsMapThumb.loadLocationsLayerFor = function(layerId){
	// add layer requested based on ID
	if (layerId == "LOC1") {
		LOC1 = MY_MAP.LOC1_PAWN_SHOPS.addTo(MY_MAP.map).bringToFront();
	}
	if (layerId == "LOC2") {
		LOC2 = MY_MAP.LOC2_CHECK_CASHING.addTo(MY_MAP.map).bringToFront();
	}
	if (layerId == "LOC3") {
		LOC3 = MY_MAP.LOC3_WIRE_TRANSFER.addTo(MY_MAP.map).bringToFront();
	}
	if (layerId == "LOC4") {
		LOC4 = MY_MAP.LOC4_BANKS.addTo(MY_MAP.map).bringToFront();
	}
	if (layerId == "LOC5") {
		LOC5 = MY_MAP.LOC5_MCDONALDS.addTo(MY_MAP.map).bringToFront();
	}
	if (layerId == "LOC6") {
		// load subway lines and stops together
		LOC7 = MY_MAP.LOC7_SUBWAY_STATIONS.addTo(MY_MAP.map).bringToFront();
		LOC6 = MY_MAP.LOC6_SUBWAY_LINES.addTo(MY_MAP.map).bringToFront();
	}
	
}

CityDigitsMapThumb.loadMediaLayerFor = function(layerId){
	// add layer requested based on ID
	if (layerId == "MEDIA") {
		MEDIA_IMAGES = MY_MAP.MEDIA_IMAGES.addTo(MY_MAP.map).bringToFront();
		MEDIA_AUDIO = MY_MAP.MEDIA_AUDIO.addTo(MY_MAP.map).bringToFront();
		MEDIA_NOTE = MY_MAP.MEDIA_NOTE.addTo(MY_MAP.map).bringToFront();
		MEDIA_INTERVIEW = MY_MAP.MEDIA_INTERVIEW.addTo(MY_MAP.map).bringToFront();
	}
	
}
