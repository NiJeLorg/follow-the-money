/* 
* Adding Layers to City Digits Thumbnail maps
*/

function CityDigitsMapThumb(id, num, lat, lon, zoom) {
	
    //set base Mapbox tiles
    var basemap = "sw2279.NYCLotto";

    //where brooklyn at?!40.7429 N, 73.9188
    this.map = L.mapbox.map('map'+id+num, basemap,{minZoom:10,maxZoom:17,zoomControl:false}).setView([lat,lon], zoom);
	
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

CityDigitsMapThumb.prototype.load_MAP1_POP_POVERTY = function (mapid){
    var self = this;

	// define layer styles and oneachfeature popup styling
	this.MAP1_POP_POVERTY_style = L.geoJson(null, {
	    style: CityDigitsMapThumb.getStyleColorFor_MAP1_POP_POVERTY
	});
			
	// load layers
	this.MAP1_POP_POVERTY = omnivore.topojson(neighborhoods, null, this.MAP1_POP_POVERTY_style);
	
	// add layer to map
	this.MAP1_POP_POVERTY.addTo(mapid.map).bringToBack();
	
}

CityDigitsMapThumb.prototype.load_MAP2_MED_HH_INCOME = function (mapid){
    var self = this;

	// define layer styles and oneachfeature popup styling
	this.MAP2_MED_HH_INCOME_style = L.geoJson(null, {
		style: CityDigitsMapThumb.getStyleColorFor_MAP2_MED_HH_INCOME
	});
			
	// load layers
	this.MAP2_MED_HH_INCOME = omnivore.topojson(neighborhoods, null, this.MAP2_MED_HH_INCOME_style);

	// add layer to map
	this.MAP2_MED_HH_INCOME.addTo(mapid.map).bringToBack();
	
}

CityDigitsMapThumb.prototype.load_MAP3_PCT_UNEMPLOYED = function (mapid){
    var self = this;
		
	// define layer styles and oneachfeature popup styling
	this.MAP3_PCT_UNEMPLOYED_style = L.geoJson(null, {
		style: CityDigitsMapThumb.getStyleColorFor_MAP3_PCT_UNEMPLOYED
	});
			
	// load layers
	this.MAP3_PCT_UNEMPLOYED = omnivore.topojson(neighborhoods, null, this.MAP3_PCT_UNEMPLOYED_style);

	// add layer to map
	this.MAP3_PCT_UNEMPLOYED.addTo(mapid.map).bringToBack();
	
}

CityDigitsMapThumb.prototype.load_MAP4_PCT_FOREIGN_BORN = function (mapid){
    var self = this;
		
	// define layer styles and oneachfeature popup styling
	this.MAP4_PCT_FOREIGN_BORN_style = L.geoJson(null, {
		style: CityDigitsMapThumb.getStyleColorFor_MAP4_PCT_FOREIGN_BORN
	});
			
	// load layers
	this.MAP4_PCT_FOREIGN_BORN = omnivore.topojson(neighborhoods, null, this.MAP4_PCT_FOREIGN_BORN_style);

	// add layer to map
	this.MAP4_PCT_FOREIGN_BORN.addTo(mapid.map).bringToBack();
	
}

CityDigitsMapThumb.prototype.load_CREATEMAP1_AFI_PER_SQMILE = function (mapid){
    var self = this;
			
	// define layer styles and oneachfeature popup styling
	this.CREATEMAP1_AFI_PER_SQMILE_style = L.geoJson(null, {
		style: CityDigitsMapThumb.getStyleColorFor_CREATEMAP1_AFI_PER_SQMILE
	});
			
	// load layers
	this.CREATEMAP1_AFI_PER_SQMILE = omnivore.topojson(neighborhoods, null, this.CREATEMAP1_AFI_PER_SQMILE_style);

	// add layer to map
	this.CREATEMAP1_AFI_PER_SQMILE.addTo(mapid.map).bringToBack();
		
}

CityDigitsMapThumb.prototype.load_CREATEMAP2_BANKS_PER_SQMILE = function (mapid){
    var self = this;
			
	this.CREATEMAP2_BANKS_PER_SQMILE_style = L.geoJson(null, {
		style: CityDigitsMapThumb.getStyleColorFor_CREATEMAP2_BANKS_PER_SQMILE
	});
			
	// load layers
	this.CREATEMAP2_BANKS_PER_SQMILE = omnivore.topojson(neighborhoods, null, this.CREATEMAP2_BANKS_PER_SQMILE_style);

	// add layer to map
	this.CREATEMAP2_BANKS_PER_SQMILE.addTo(mapid.map).bringToBack();
		
}

CityDigitsMapThumb.prototype.load_CREATEMAP3_PAWN_SHOPS_PER_SQMILE = function (mapid){
    var self = this;
			
	// define layer styles and oneachfeature popup styling
	this.CREATEMAP3_PAWN_SHOPS_PER_SQMILE_style = L.geoJson(null, {
		style: CityDigitsMapThumb.getStyleColorFor_CREATEMAP3_PAWN_SHOPS_PER_SQMILE
	});
			
	// load layers
	this.CREATEMAP3_PAWN_SHOPS_PER_SQMILE = omnivore.topojson(neighborhoods, null, this.CREATEMAP3_PAWN_SHOPS_PER_SQMILE_style);

	// add layer to map
	this.CREATEMAP3_PAWN_SHOPS_PER_SQMILE.addTo(mapid.map).bringToBack();
		
}

CityDigitsMapThumb.prototype.load_CREATEMAP4_MCDONALDS_PER_SQMILE = function (mapid){
    var self = this;

	// define layer styles and oneachfeature popup styling
	this.CREATEMAP4_MCDONALDS_PER_SQMILE_style = L.geoJson(null, {
		style: CityDigitsMapThumb.getStyleColorFor_CREATEMAP4_MCDONALDS_PER_SQMILE
	});
			
	// load layers
	this.CREATEMAP4_MCDONALDS_PER_SQMILE = omnivore.topojson(neighborhoods, null, this.CREATEMAP4_MCDONALDS_PER_SQMILE_style);

	// add layer to map
	this.CREATEMAP4_MCDONALDS_PER_SQMILE.addTo(mapid.map).bringToBack();
		
}

CityDigitsMapThumb.prototype.load_CREATEMAP5_HH_PER_AFI = function (mapid){
    var self = this;
			
	// define layer styles and oneachfeature popup styling
	this.CREATEMAP5_HH_PER_AFI_style = L.geoJson(null, {
		style: CityDigitsMapThumb.getStyleColorFor_CREATEMAP5_HH_PER_AFI
	});
			
	// load layers
	this.CREATEMAP5_HH_PER_AFI = omnivore.topojson(neighborhoods, null, this.CREATEMAP5_HH_PER_AFI_style);

	// add layer to map
	this.CREATEMAP5_HH_PER_AFI.addTo(mapid.map).bringToBack();
		
}

CityDigitsMapThumb.prototype.load_CREATEMAP6_HH_PER_BANK = function (mapid){
    var self = this;
			
	// define layer styles and oneachfeature popup styling
	this.CREATEMAP6_HH_PER_BANK_style = L.geoJson(null, {
		style: CityDigitsMapThumb.getStyleColorFor_CREATEMAP6_HH_PER_BANK
	});
			
	// load layers
	this.CREATEMAP6_HH_PER_BANK = omnivore.topojson(neighborhoods, null, this.CREATEMAP6_HH_PER_BANK_style);

	// add layer to map
	this.CREATEMAP6_HH_PER_BANK.addTo(mapid.map).bringToBack();
		
}

CityDigitsMapThumb.prototype.load_CREATEMAP7_HH_PER_MCDONALDS = function (mapid){
    var self = this;
			
	// define layer styles and oneachfeature popup styling
	this.CREATEMAP7_HH_PER_MCDONALDS_style = L.geoJson(null, {
		style: CityDigitsMapThumb.getStyleColorFor_CREATEMAP7_HH_PER_MCDONALDS
	});
			
	// load layers
	this.CREATEMAP7_HH_PER_MCDONALDS = omnivore.topojson(neighborhoods, null, this.CREATEMAP7_HH_PER_MCDONALDS_style);

	// add layer to map
	this.CREATEMAP7_HH_PER_MCDONALDS.addTo(mapid.map).bringToBack();
		
}

CityDigitsMapThumb.prototype.load_CREATEMAP8_HH_PER_PAWN_SHOP = function (mapid){
    var self = this;
			
	// define layer styles and oneachfeature popup styling
	this.CREATEMAP8_HH_PER_PAWN_SHOP_style = L.geoJson(null, {
		style: CityDigitsMapThumb.getStyleColorFor_CREATEMAP8_HH_PER_PAWN_SHOP
	});
			
	// load layers
	this.CREATEMAP8_HH_PER_PAWN_SHOP = omnivore.topojson(neighborhoods, null, this.CREATEMAP8_HH_PER_PAWN_SHOP_style);

	// add layer to map
	this.CREATEMAP8_HH_PER_PAWN_SHOP.addTo(mapid.map).bringToBack();
		
}

CityDigitsMapThumb.prototype.load_CREATEMAP9_AFIS_PER_BANK = function (mapid){
    var self = this;
			
	// define layer styles and oneachfeature popup styling
	this.CREATEMAP9_AFIS_PER_BANK_style = L.geoJson(null, {
		style: CityDigitsMapThumb.getStyleColorFor_CREATEMAP9_AFIS_PER_BANK
	});
			
	// load layers
	this.CREATEMAP9_AFIS_PER_BANK = omnivore.topojson(neighborhoods, null, this.CREATEMAP9_AFIS_PER_BANK_style);

	// add layer to map
	this.CREATEMAP9_AFIS_PER_BANK.addTo(mapid.map).bringToBack();
		
}

CityDigitsMapThumb.prototype.load_CREATEMAP10_BANKS_PER_AFI = function (mapid){
    var self = this;
			
	// define layer styles and oneachfeature popup styling
	this.CREATEMAP10_BANKS_PER_AFI_style = L.geoJson(null, {
		style: CityDigitsMapThumb.getStyleColorFor_CREATEMAP10_BANKS_PER_AFI
	});
			
	// load layers
	this.CREATEMAP10_BANKS_PER_AFI = omnivore.topojson(neighborhoods, null, this.CREATEMAP10_BANKS_PER_AFI_style);

	// add layer to map
	this.CREATEMAP10_BANKS_PER_AFI.addTo(mapid.map).bringToBack();
		
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
	        fillColor: fillColor,
			clickable: false
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
	        fillColor: fillColor,
			clickable: false
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
	        fillColor: fillColor,
			clickable: false
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
	        fillColor: fillColor,
			clickable: false
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
	        fillColor: fillColor,
			clickable: false
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
	        fillColor: fillColor,
			clickable: false
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
	        fillColor: fillColor,
			clickable: false
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
	        fillColor: fillColor,
			clickable: false
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
	        fillColor: fillColor,
			clickable: false
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
	        fillColor: fillColor,
			clickable: false
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
	        fillColor: fillColor,
			clickable: false
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
	        fillColor: fillColor,
			clickable: false
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
	        fillColor: fillColor,
			clickable: false
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
	        fillColor: fillColor,
			clickable: false
        }
    }
}


CityDigitsMapThumb.prototype.load_LOC1_PAWN_SHOPS = function(mapid){
    var self = this;

	// define layer styles and oneachfeature popup styling
	this.LOC1_PAWN_SHOPS_style = L.geoJson(null, {
		pointToLayer: CityDigitsMapThumb.getStyleFor_LOC1_PAWN_SHOPS
	});
	
	// load layers
	this.LOC1_PAWN_SHOPS = omnivore.csv(PawnShops, null, this.LOC1_PAWN_SHOPS_style);

	// add layer to map
	this.LOC1_PAWN_SHOPS.addTo(mapid.map).bringToFront();

}

CityDigitsMapThumb.prototype.load_LOC2_CHECK_CASHING = function(mapid){
    var self = this;

	// define layer styles and oneachfeature popup styling
	this.LOC2_CHECK_CASHING_style = L.geoJson(null, {
		pointToLayer: CityDigitsMapThumb.getStyleFor_LOC2_CHECK_CASHING
	});
	
	// load layers
	this.LOC2_CHECK_CASHING = omnivore.csv(CheckCashing, null, this.LOC2_CHECK_CASHING_style);

	// add layer to map
	this.LOC2_CHECK_CASHING.addTo(mapid.map).bringToFront();

}

CityDigitsMapThumb.prototype.load_LOC3_WIRE_TRANSFER = function(mapid){
    var self = this;

	// define layer styles and oneachfeature popup styling
	this.LOC3_WIRE_TRANSFER_style = L.geoJson(null, {
		pointToLayer: CityDigitsMapThumb.getStyleFor_LOC3_WIRE_TRANSFER
	});	
	
	// load layers
	this.LOC3_WIRE_TRANSFER = omnivore.csv(MoneyTransferServices, null, this.LOC3_WIRE_TRANSFER_style);

	// add layer to map
	this.LOC3_WIRE_TRANSFER.addTo(mapid.map).bringToFront();

}

CityDigitsMapThumb.prototype.load_LOC4_BANKS = function(mapid){
    var self = this;
	
	// define layer styles and oneachfeature popup styling
	this.LOC4_BANKS_style = L.geoJson(null, {
		pointToLayer: CityDigitsMapThumb.getStyleFor_LOC4_BANKS
	});		
	
	// load layers
	this.LOC4_BANKS = omnivore.csv(CommercialBanks, null, this.LOC4_BANKS_style);

	// add layer to map
	this.LOC4_BANKS.addTo(mapid.map).bringToFront();

}

CityDigitsMapThumb.prototype.load_LOC5_MCDONALDS = function(mapid){
    var self = this;
	
	//console.log(mapid.map);

	// define layer styles and oneachfeature popup styling
	this.LOC5_MCDONALDS_style = L.geoJson(null, {
		pointToLayer: CityDigitsMapThumb.getStyleFor_LOC5_MCDONALDS
	});	
	
	// load layers
	this.LOC5_MCDONALDS = omnivore.csv(Mcdonalds, null, this.LOC5_MCDONALDS_style);

	// add layer to map
	this.LOC5_MCDONALDS.addTo(mapid.map).bringToFront();

}

CityDigitsMapThumb.prototype.load_LOC6_SUBWAY_LINES = function(mapid){
    var self = this;
	
	// define layer styles and oneachfeature popup styling
	this.LOC6_SUBWAY_LINES_style = L.geoJson(null, {
		style: CityDigitsMapThumb.getStyleFor_LOC6_SUBWAY_LINES
	});	
	
	// load layers
	this.LOC6_SUBWAY_LINES = omnivore.geojson(SubwayLines, null, this.LOC6_SUBWAY_LINES_style);

	// add layer to map
	this.LOC6_SUBWAY_LINES.addTo(mapid.map).bringToFront();

}


CityDigitsMapThumb.getStyleFor_LOC1_PAWN_SHOPS = function (feature, latlng){
	var pawnShopMarker = L.circle(latlng, 80, {
		stroke: false,
		fillColor: '#eb4a42',
		fillOpacity: 0.75,
		clickable: false
	});
	
	return pawnShopMarker;
	
}

CityDigitsMapThumb.getStyleFor_LOC2_CHECK_CASHING = function (feature, latlng){
	var checkCashingMarker = L.circle(latlng, 80, {
		stroke: false,
		fillColor: '#ffa77f',
		fillOpacity: 0.75,
		clickable: false
	});
	
	return checkCashingMarker;
	
}

CityDigitsMapThumb.getStyleFor_LOC3_WIRE_TRANSFER = function (feature, latlng){
	var wireTransferMarker = L.circle(latlng, 80, {
		stroke: false,
		fillColor: '#fa8a12',
		fillOpacity: 0.75,
		clickable: false
	});
	
	return wireTransferMarker;
	
}

CityDigitsMapThumb.getStyleFor_LOC4_BANKS = function (feature, latlng){
	var banksMarker = L.circle(latlng, 80, {
		stroke: false,
		fillColor: '#fa8aa3',
		fillOpacity: 0.75,
		clickable: false
	});
	
	return banksMarker;
	
}

CityDigitsMapThumb.getStyleFor_LOC5_MCDONALDS = function (feature, latlng){
	var mcdonaldsMarker = L.circle(latlng, 80, {
		stroke: false,
		fillColor: '#ebcf42',
		fillOpacity: 0.75,
		clickable: false
	});
	
	return mcdonaldsMarker;
	
}

CityDigitsMapThumb.getStyleFor_LOC6_SUBWAY_LINES = function (feature, layer){
	var subwayLinesInitialStyle = {
	    color: "#9c9c9c",
	    weight: 3,
	    opacity: 0.75,
		clickable: false
		
	};
	
	return subwayLinesInitialStyle;
	
}

CityDigitsMapThumb.getStyleFor_LOC7_SUBWAY_STATIONS = function (feature, latlng){
	var subwayStationInitialStyle = L.circleMarker(latlng, {
	    radius: 0,
	    weight: 0,
	    fillOpacity: 0.75,
		clickable: false
		
	});
	
	return subwayStationInitialStyle;
	
}


CityDigitsMapThumb.prototype.loadMedia = function(mapid){
			
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
	
	// add layers to map
	this.MEDIA_IMAGES.addTo(mapid.map).bringToFront();
	this.MEDIA_AUDIO.addTo(mapid.map).bringToFront();
	this.MEDIA_NOTE.addTo(mapid.map).bringToFront();
	this.MEDIA_INTERVIEW.addTo(mapid.map).bringToFront();
	
		
}

CityDigitsMapThumb.getStyleFor_MEDIA = function(feature, latlng){
	var mediaImageIcon = L.icon({
	    iconUrl: feature.properties.iconUrl,
	    iconSize: [42, 50],
		iconAnchor: [17, 38], 
	});

	return L.marker(latlng, {icon: mediaImageIcon, clickable: false});
	
}
