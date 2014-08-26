/* 
* Function to create a generic City Digits map 
*/

function CityDigitsMap() {
    //initial values
    this.neighborhoodLayer = null;
	this.markerLayer = null;
	var topojsonLayer = null;
	
    //set base Mapbox tiles
    var basemap = "sw2279.NYCLotto";

    //where brooklyn at?!40.7429 N, 73.9188
    this.map = L.mapbox.map('map', basemap,{minZoom:11,maxZoom:16,zoomControl:false}).setView([40.7429,-73.9188], 13);
    //load zoomer
    $("#citydigits-zoomer").attr({'class':'citydigits-zoomer'});
    $("#citydigits-zoomer").on("click","#zoom-in",CityDigitsMap.onZoomIn);
    $("#citydigits-zoomer").on("click","#zoom-out",CityDigitsMap.onZoomOut);

    //load chart-icon
    $("#citydigits-charts").attr({'class':'citydigits-charts'});

	//load legend
	$("#citydigits-legend").attr({'class':'citydigits-legend'});
	
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
	
	// popup containers to catch popups
	this.popup = new L.Popup({ 
		autoPan: false, 
		maxWidth: 350, 
		minWidth: 110, 
		minHeight: 50,
		closeButton: false 
	});
	
	this.popup2 = new L.Popup({ 
		maxWidth: 300,
		minWidth: 200, 
		minHeight: 30, 
		closeButton:true
	});
	
}

CityDigitsMap.onZoomIn = function(event){
    MY_MAP.map.zoomIn();
}

CityDigitsMap.onZoomOut = function(event){
    MY_MAP.map.zoomOut();
}

CityDigitsMap.prototype.addGeoSearch = function(){
	new L.Control.GeoSearch({
	    provider: new L.GeoSearch.Provider.Google()
	}).addTo(this.map);
	$(".leaflet-control-geosearch").prependTo("#geosearch-target");
}




CityDigitsMap.onEachFeature_MAP1_POP_POVERTY = function(feature,layer){	
	var highlight = {
	    weight: 3,
	    opacity: 1
	};
	var noHighlight = {
        weight: 1,
        opacity: .1
	};
	
    //add on hover -- same on hover and mousemove for each layer
    layer.on('mouseover', function(ev) {
		// only have on mouseover work if popup2 isn't open
		
		if (!MY_MAP.popup2._isOpen) {
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.NYC_NEIG + '</div>');
		
			//display popup
	        if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
	            MY_MAP.popup.openOn(MY_MAP.map);
	        }else{
	            MY_MAP.map.closePopup();
	        }			
		}
		
		//highlight polygon
		layer.setStyle(highlight);		
		
    });
		
    layer.on('mousemove', function(ev) {
		
		// only have on mousemove work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
	        //get lat/long
	        if(($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.NYC_NEIG + '</div>');
	    	}

	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}			
		}
    });
	
    layer.on('mouseout', function(ev) {
		//remove highlight for polygon
		layer.setStyle(noHighlight);		
    });	
	
	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();
		
		// bind popup with data to the feature
		MY_MAP.popup2.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
		var percent = feature.properties.PovertyPer * 100;
		percent = percent.toFixed(0);
		MY_MAP.popup2.setContent('<div class="map-popup"><h4 class="text-left">' + feature.properties.NYC_NEIG + '</h4><p>' + percent + '%<br />Population in Poverty</p></div>');
		MY_MAP.popup2.openOn(MY_MAP.map);
	});
	
}

CityDigitsMap.onEachFeature_MAP2_MED_HH_INCOME = function(feature,layer){
	var highlight = {
	    weight: 3,
	    opacity: 1
	};
	var noHighlight = {
        weight: 1,
        opacity: .1
	};
	
    //add on hover -- same on hover and mousemove for each layer
    layer.on('mouseover', function(ev) {
		// only have on mouseover work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.NYC_NEIG + '</div>');
		
			//display popup
	        if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
	            MY_MAP.popup.openOn(MY_MAP.map);
	        }else{
	            MY_MAP.map.closePopup();
	        }			
		}
		
		//highlight polygon
		layer.setStyle(highlight);		
		
    });
		
    layer.on('mousemove', function(ev) {
		
		// only have on mousemove work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
	        //get lat/long
	        if(($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.NYC_NEIG + '</div>');
	    	}
			
	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}			
		}
    });
	
    layer.on('mouseout', function(ev) {
		//remove highlight for polygon
		layer.setStyle(noHighlight);		
    });
	
	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();
		
		// bind popup with data to the feature
		MY_MAP.popup2.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
		var MedHHInc = accounting.formatMoney(feature.properties.MedHouInco, "$", 0, ",", "");
		MY_MAP.popup2.setContent('<div class="map-popup"><h4 class="text-left">' + feature.properties.NYC_NEIG + '</h4><p>' + MedHHInc + '<br />Median Household Income</p></div>');
		MY_MAP.popup2.openOn(MY_MAP.map);
	});
	
}

CityDigitsMap.onEachFeature_MAP3_PCT_UNEMPLOYED = function(feature,layer){
	var highlight = {
	    weight: 3,
	    opacity: 1
	};
	var noHighlight = {
        weight: 1,
        opacity: .1
	};
	
    //add on hover -- same on hover and mousemove for each layer
    layer.on('mouseover', function(ev) {
		// only have on mouseover work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.NYC_NEIG + '</div>');
		
			//display popup
	        if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
	            MY_MAP.popup.openOn(MY_MAP.map);
	        }else{
	            MY_MAP.map.closePopup();
	        }			
		}
		
		//highlight polygon
		layer.setStyle(highlight);		
		
    });
		
    layer.on('mousemove', function(ev) {
		
		// only have on mousemove work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
	        //get lat/long
	        if(($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.NYC_NEIG + '</div>');
	    	}
			
	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}			
		}
    });
	
    layer.on('mouseout', function(ev) {
		//remove highlight for polygon
		layer.setStyle(noHighlight);		
    });
	
	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();
		
		// bind popup with data to the feature
		MY_MAP.popup2.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
		var percent = feature.properties.UnempRate * 100;
		percent = percent.toFixed(1);
		MY_MAP.popup2.setContent('<div class="map-popup"><h4 class="text-left">' + feature.properties.NYC_NEIG + '</h4><p>' + percent + '%<br />Percent Unemployed</p></div>');
		MY_MAP.popup2.openOn(MY_MAP.map);
	});
	
}

CityDigitsMap.onEachFeature_MAP4_PCT_FOREIGN_BORN = function(feature,layer){
	var highlight = {
	    weight: 3,
	    opacity: 1
	};
	var noHighlight = {
        weight: 1,
        opacity: .1
	};
	
    //add on hover -- same on hover and mousemove for each layer
    layer.on('mouseover', function(ev) {
		// only have on mouseover work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.NYC_NEIG + '</div>');
		
			//display popup
	        if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
	            MY_MAP.popup.openOn(MY_MAP.map);
	        }else{
	            MY_MAP.map.closePopup();
	        }			
		}
		
		//highlight polygon
		layer.setStyle(highlight);		
		
    });
		
    layer.on('mousemove', function(ev) {
		
		// only have on mousemove work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
	        //get lat/long
	        if(($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.NYC_NEIG + '</div>');
	    	}
			
	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}			
		}
    });
	
    layer.on('mouseout', function(ev) {
		//remove highlight for polygon
		layer.setStyle(noHighlight);		
    });
	
	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();
		
		// bind popup with data to the feature
		MY_MAP.popup2.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
		var percent = feature.properties.ForBornPer * 100;
		percent = percent.toFixed(0);
		MY_MAP.popup2.setContent('<div class="map-popup"><h4 class="text-left">' + feature.properties.NYC_NEIG + '</h4><p>' + percent + '%<br />Population Foreign Born</p></div>');
		MY_MAP.popup2.openOn(MY_MAP.map);
	});
	
}

CityDigitsMap.onEachFeature_CREATEMAP1_AFI_PER_SQMILE = function(feature,layer){
	var highlight = {
	    weight: 3,
	    opacity: 1
	};
	var noHighlight = {
        weight: 1,
        opacity: .1
	};
	
    //add on hover -- same on hover and mousemove for each layer
    layer.on('mouseover', function(ev) {
		// only have on mouseover work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.NYC_NEIG + '</div>');
		
			//display popup
	        if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
	            MY_MAP.popup.openOn(MY_MAP.map);
	        }else{
	            MY_MAP.map.closePopup();
	        }			
		}
		
		//highlight polygon
		layer.setStyle(highlight);		
		
    });
		
    layer.on('mousemove', function(ev) {
		
		// only have on mousemove work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
	        //get lat/long
	        if(($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.NYC_NEIG + '</div>');
	    	}
			
	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}			
		}
    });
	
    layer.on('mouseout', function(ev) {
		//remove highlight for polygon
		layer.setStyle(noHighlight);		
    });
	
	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();
		
		// bind popup with data to the feature
		MY_MAP.popup2.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
		// numerator
		var Pawnshops = feature.properties.Pawnshops;
		Pawnshops = Pawnshops.toFixed(0);
		var CheckCash = feature.properties.CheckCash;
		CheckCash = CheckCash.toFixed(0);
		var MoneyTrans = feature.properties.MoneyTrans;
		MoneyTrans = MoneyTrans.toFixed(0);
		var AFS_Sum = feature.properties.AFS_Sum;
		AFS_Sum = AFS_Sum.toFixed(0);
		// denominator
		var sq_mile = feature.properties.sq_mile;
		sq_mile = sq_mile.toFixed(2);
		// computed
		var AFS_SQMI = feature.properties.AFS_SQMI;
		AFS_SQMI = AFS_SQMI.toFixed(2);
		
		var header = '<div class="map-popup"><h4 class="text-left">' + feature.properties.NYC_NEIG + '</h4>';
		var pawnShopsText = '<div class="pawnshop-icon"></div>' + Pawnshops + ' Pawn Shops + <br />';
		var checkCashText = '<div class="checkcashing-icon"></div>' + CheckCash + ' Check Cashing + <br />';
		var moneyTransText = '<div class="wiretransfer-icon"></div>' + MoneyTrans + ' Wire Transfer <br />';
		var hr = '<hr class="divide">';
		var sq_mileText = '<div class="squaremiles-icon"></div>' + sq_mile + ' Square Miles <br /><br />';
		var footer = '<p class="grey">' + AFS_SQMI + ' Alternative Financial Institutions per Square Mile</p>';
				
		var popupContent = header + pawnShopsText + checkCashText + moneyTransText + hr + sq_mileText + footer;
		
		MY_MAP.popup2.setContent(popupContent);
		MY_MAP.popup2.openOn(MY_MAP.map);
	});
	
}

CityDigitsMap.onEachFeature_CREATEMAP2_BANKS_PER_SQMILE = function(feature,layer){
	var highlight = {
	    weight: 3,
	    opacity: 1
	};
	var noHighlight = {
        weight: 1,
        opacity: .1
	};
	
    //add on hover -- same on hover and mousemove for each layer
    layer.on('mouseover', function(ev) {
		// only have on mouseover work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.NYC_NEIG + '</div>');
		
			//display popup
	        if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
	            MY_MAP.popup.openOn(MY_MAP.map);
	        }else{
	            MY_MAP.map.closePopup();
	        }			
		}
		
		//highlight polygon
		layer.setStyle(highlight);		
		
    });
		
    layer.on('mousemove', function(ev) {
		
		// only have on mousemove work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
	        //get lat/long
	        if(($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.NYC_NEIG + '</div>');
	    	}
			
	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}			
		}
    });
	
    layer.on('mouseout', function(ev) {
		//remove highlight for polygon
		layer.setStyle(noHighlight);		
    });
	
	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();
		
		// bind popup with data to the feature
		MY_MAP.popup2.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
		// numerator
		var Banks = feature.properties.Banks;
		Banks = Banks.toFixed(0);
		// denominator
		var sq_mile = feature.properties.sq_mile;
		sq_mile = sq_mile.toFixed(2);
		// computed
		var BANK_SQMI = feature.properties.BANK_SQMI;
		BANK_SQMI = BANK_SQMI.toFixed(2);
		
		var header = '<div class="map-popup"><h4 class="text-left">' + feature.properties.NYC_NEIG + '</h4>';
		var banksText = '<div class="banks-icon"></div>' + Banks + ' Banks<br />';
		var hr = '<hr class="divide">';
		var sq_mileText = '<div class="squaremiles-icon"></div>' + sq_mile + ' Square Miles <br /><br />';
		var footer = '<p class="grey">' + BANK_SQMI + ' Banks per Square Mile</p>';
				
		var popupContent = header + banksText + hr + sq_mileText + footer;
		
		MY_MAP.popup2.setContent(popupContent);
		MY_MAP.popup2.openOn(MY_MAP.map);
	});
	
}

CityDigitsMap.onEachFeature_CREATEMAP3_PAWN_SHOPS_PER_SQMILE = function(feature,layer){
	var highlight = {
	    weight: 3,
	    opacity: 1
	};
	var noHighlight = {
        weight: 1,
        opacity: .1
	};
	
    //add on hover -- same on hover and mousemove for each layer
    layer.on('mouseover', function(ev) {
		// only have on mouseover work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.NYC_NEIG + '</div>');
		
			//display popup
	        if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
	            MY_MAP.popup.openOn(MY_MAP.map);
	        }else{
	            MY_MAP.map.closePopup();
	        }			
		}
		
		//highlight polygon
		layer.setStyle(highlight);		
		
    });
		
    layer.on('mousemove', function(ev) {
		
		// only have on mousemove work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
	        //get lat/long
	        if(($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.NYC_NEIG + '</div>');
	    	}
			
	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}			
		}
    });
	
    layer.on('mouseout', function(ev) {
		//remove highlight for polygon
		layer.setStyle(noHighlight);		
    });
	
	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();
		
		// bind popup with data to the feature
		MY_MAP.popup2.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
		// numerator
		var Pawnshops = feature.properties.Pawnshops;
		Pawnshops = Pawnshops.toFixed(0);
		// denominator
		var sq_mile = feature.properties.sq_mile;
		sq_mile = sq_mile.toFixed(2);
		// computed
		var PAWN_SQMI = feature.properties.PAWN_SQMI;
		PAWN_SQMI = PAWN_SQMI.toFixed(2);
		
		var header = '<div class="map-popup"><h4 class="text-left">' + feature.properties.NYC_NEIG + '</h4>';
		var pawnShopsText = '<div class="pawnshop-icon"></div>' + Pawnshops + ' Pawn Shops<br />';
		var hr = '<hr class="divide">';
		var sq_mileText = '<div class="squaremiles-icon"></div>' + sq_mile + ' Square Miles <br /><br />';
		var footer = '<p class="grey">' + PAWN_SQMI + ' Pawn Shops per Square Mile</p>';
				
		var popupContent = header + pawnShopsText + hr + sq_mileText + footer;
		
		MY_MAP.popup2.setContent(popupContent);
		MY_MAP.popup2.openOn(MY_MAP.map);
	});
	
}

CityDigitsMap.onEachFeature_CREATEMAP4_MCDONALDS_PER_SQMILE = function(feature,layer){
	var highlight = {
	    weight: 3,
	    opacity: 1
	};
	var noHighlight = {
        weight: 1,
        opacity: .1
	};
	
    //add on hover -- same on hover and mousemove for each layer
    layer.on('mouseover', function(ev) {
		// only have on mouseover work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.NYC_NEIG + '</div>');
		
			//display popup
	        if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
	            MY_MAP.popup.openOn(MY_MAP.map);
	        }else{
	            MY_MAP.map.closePopup();
	        }			
		}
		
		//highlight polygon
		layer.setStyle(highlight);		
		
    });
		
    layer.on('mousemove', function(ev) {
		
		// only have on mousemove work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
	        //get lat/long
	        if(($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.NYC_NEIG + '</div>');
	    	}
			
	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}			
		}
    });
	
    layer.on('mouseout', function(ev) {
		//remove highlight for polygon
		layer.setStyle(noHighlight);		
    });
	
	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();
		
		// bind popup with data to the feature
		MY_MAP.popup2.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
		// numerator
		var McDonalds = feature.properties.McDonalds1;
		McDonalds = McDonalds.toFixed(0);
		// denominator
		var sq_mile = feature.properties.sq_mile;
		sq_mile = sq_mile.toFixed(2);
		// computed
		var McD_SQMI = feature.properties.McD_SQMI;
		McD_SQMI = McD_SQMI.toFixed(2);
		
		var header = '<div class="map-popup"><h4 class="text-left">' + feature.properties.NYC_NEIG + '</h4>';
		var mcDonaldsText = '<div class="mcdonalds-icon"></div>' + McDonalds + ' McDonald\'s<br />';
		var hr = '<hr class="divide">';
		var sq_mileText = '<div class="squaremiles-icon"></div>' + sq_mile + ' Square Miles <br /><br />';
		var footer = '<p class="grey">' + McD_SQMI + ' McDonald\'s per Square Mile</p>';
				
		var popupContent = header + mcDonaldsText + hr + sq_mileText + footer;
		
		MY_MAP.popup2.setContent(popupContent);
		MY_MAP.popup2.openOn(MY_MAP.map);
	});
	
}

CityDigitsMap.onEachFeature_CREATEMAP5_HH_PER_AFI = function(feature,layer){
	var highlight = {
	    weight: 3,
	    opacity: 1
	};
	var noHighlight = {
        weight: 1,
        opacity: .1
	};
	
    //add on hover -- same on hover and mousemove for each layer
    layer.on('mouseover', function(ev) {
		// only have on mouseover work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.NYC_NEIG + '</div>');
		
			//display popup
	        if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
	            MY_MAP.popup.openOn(MY_MAP.map);
	        }else{
	            MY_MAP.map.closePopup();
	        }			
		}
		
		//highlight polygon
		layer.setStyle(highlight);		
		
    });
		
    layer.on('mousemove', function(ev) {
		
		// only have on mousemove work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
	        //get lat/long
	        if(($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.NYC_NEIG + '</div>');
	    	}
			
	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}			
		}
    });
	
    layer.on('mouseout', function(ev) {
		//remove highlight for polygon
		layer.setStyle(noHighlight);		
    });
	
	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();
		
		// bind popup with data to the feature
		MY_MAP.popup2.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
		// numerator
		var Households = feature.properties.Households;
		Households = accounting.formatNumber(Households, 0, ",", "");
		// denominator
		var Pawnshops = feature.properties.Pawnshops;
		Pawnshops = Pawnshops.toFixed(0);
		var CheckCash = feature.properties.CheckCash;
		CheckCash = CheckCash.toFixed(0);
		var MoneyTrans = feature.properties.MoneyTrans;
		MoneyTrans = MoneyTrans.toFixed(0);
		var AFS_Sum = feature.properties.AFS_Sum;
		AFS_Sum = AFS_Sum.toFixed(0);
		// computed
		var HH_AFS = feature.properties.HH_AFS;
		HH_AFS = accounting.formatNumber(HH_AFS, 2, ",", ".");
		
		var header = '<div class="map-popup"><h4 class="text-left">' + feature.properties.NYC_NEIG + '</h4>';
		var householdsText = '<div class="households-icon"></div>' + Households + ' Households<br />';
		var hr = '<hr class="divide">';
		var pawnShopsText = '<div class="pawnshop-icon"></div>' + Pawnshops + ' Pawn Shops + <br />';
		var checkCashText = '<div class="checkcashing-icon"></div>' + CheckCash + ' Check Cashing + <br />';
		var moneyTransText = '<div class="wiretransfer-icon"></div>' + MoneyTrans + ' Wire Transfer <br /><br />';
		if (feature.properties.AFS_Sum == 0) {
			var footer = '<p class="grey">The Ratio is Undefined</p>';
		} else if (feature.properties.HH_AFS == -1){
			var footer = '<p class="grey">0.00 Households per Alternative Financial Institution</p>';			
		} else {
			var footer = '<p class="grey">' + HH_AFS + ' Households per Alternative Financial Institution</p>';			
		}
				
		var popupContent = header + householdsText + hr + pawnShopsText + checkCashText + moneyTransText + footer;
		
		MY_MAP.popup2.setContent(popupContent);
		MY_MAP.popup2.openOn(MY_MAP.map);
	});
	
}

CityDigitsMap.onEachFeature_CREATEMAP6_HH_PER_BANK = function(feature,layer){
	var highlight = {
	    weight: 3,
	    opacity: 1
	};
	var noHighlight = {
        weight: 1,
        opacity: .1
	};
	
    //add on hover -- same on hover and mousemove for each layer
    layer.on('mouseover', function(ev) {
		// only have on mouseover work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.NYC_NEIG + '</div>');
		
			//display popup
	        if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
	            MY_MAP.popup.openOn(MY_MAP.map);
	        }else{
	            MY_MAP.map.closePopup();
	        }			
		}
		
		//highlight polygon
		layer.setStyle(highlight);		
		
    });
		
    layer.on('mousemove', function(ev) {
		
		// only have on mousemove work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
	        //get lat/long
	        if(($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.NYC_NEIG + '</div>');
	    	}
			
	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}			
		}
    });
	
    layer.on('mouseout', function(ev) {
		//remove highlight for polygon
		layer.setStyle(noHighlight);		
    });
	
	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();
		
		// bind popup with data to the feature
		MY_MAP.popup2.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
		// numerator
		var Households = feature.properties.Households;
		Households = accounting.formatNumber(Households, 0, ",", "");
		// denominator
		var Banks = feature.properties.Banks;
		Banks = Banks.toFixed(0);
		// computed
		var HH_BANK = feature.properties.HH_BANK;
		HH_BANK = accounting.formatNumber(HH_BANK, 2, ",", ".");
		
		var header = '<div class="map-popup"><h4 class="text-left">' + feature.properties.NYC_NEIG + '</h4>';
		var householdsText = '<div class="households-icon"></div>' + Households + ' Households<br />';
		var hr = '<hr class="divide">';
		var banksText = '<div class="banks-icon"></div>' + Banks + ' Banks<br /><br />';
		if (feature.properties.Banks == 0) {
			var footer = '<p class="grey">The Ratio is Undefined</p>';
		} else if (feature.properties.HH_BANK == -1){
			var footer = '<p class="grey">0.00 Households per Alternative Financial Institution</p>';			
		} else {
			var footer = '<p class="grey">' + HH_BANK + ' Households per Bank</p>';			
		}
				
		var popupContent = header + householdsText + hr + banksText + footer;
		
		MY_MAP.popup2.setContent(popupContent);
		MY_MAP.popup2.openOn(MY_MAP.map);
	});
	
}

CityDigitsMap.onEachFeature_CREATEMAP7_HH_PER_MCDONALDS = function(feature,layer){
	var highlight = {
	    weight: 3,
	    opacity: 1
	};
	var noHighlight = {
        weight: 1,
        opacity: .1
	};
	
    //add on hover -- same on hover and mousemove for each layer
    layer.on('mouseover', function(ev) {
		// only have on mouseover work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.NYC_NEIG + '</div>');
		
			//display popup
	        if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
	            MY_MAP.popup.openOn(MY_MAP.map);
	        }else{
	            MY_MAP.map.closePopup();
	        }			
		}
		
		//highlight polygon
		layer.setStyle(highlight);		
		
    });
		
    layer.on('mousemove', function(ev) {
		
		// only have on mousemove work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
	        //get lat/long
	        if(($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.NYC_NEIG + '</div>');
	    	}
			
	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}			
		}
    });
	
    layer.on('mouseout', function(ev) {
		//remove highlight for polygon
		layer.setStyle(noHighlight);		
    });
	
	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();
		
		// bind popup with data to the feature
		MY_MAP.popup2.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
		// numerator
		var Households = feature.properties.Households;
		Households = accounting.formatNumber(Households, 0, ",", "");
		// denominator
		var McDonalds = feature.properties.McDonalds1;
		McDonalds = McDonalds.toFixed(0);
		// computed
		var HH_McD = feature.properties.HH_McD;
		HH_McD = accounting.formatNumber(HH_McD, 2, ",", ".");
		
		var header = '<div class="map-popup"><h4 class="text-left">' + feature.properties.NYC_NEIG + '</h4>';
		var householdsText = '<div class="households-icon"></div>' + Households + ' Households<br />';
		var hr = '<hr class="divide">';
		var mcDonaldsText = '<div class="mcdonalds-icon"></div>' + McDonalds + ' McDonald\'s<br /><br />';
		if (feature.properties.McDonalds1 == 0) {
			var footer = '<p class="grey">The Ratio is Undefined</p>';
		} else if (feature.properties.HH_McD == -1){
			var footer = '<p class="grey">0.00 Households per McDonald\'s</p>';			
		} else {
			var footer = '<p class="grey">' + HH_McD + ' Households per McDonald\'s</p>';			
		}
				
		var popupContent = header + householdsText + hr + mcDonaldsText + footer;
		
		MY_MAP.popup2.setContent(popupContent);
		MY_MAP.popup2.openOn(MY_MAP.map);
	});
	
}

CityDigitsMap.onEachFeature_CREATEMAP8_HH_PER_PAWN_SHOP = function(feature,layer){
	var highlight = {
	    weight: 3,
	    opacity: 1
	};
	var noHighlight = {
        weight: 1,
        opacity: .1
	};
	
    //add on hover -- same on hover and mousemove for each layer
    layer.on('mouseover', function(ev) {
		// only have on mouseover work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.NYC_NEIG + '</div>');
		
			//display popup
	        if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
	            MY_MAP.popup.openOn(MY_MAP.map);
	        }else{
	            MY_MAP.map.closePopup();
	        }			
		}
		
		//highlight polygon
		layer.setStyle(highlight);		
		
    });
		
    layer.on('mousemove', function(ev) {
		
		// only have on mousemove work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
	        //get lat/long
	        if(($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.NYC_NEIG + '</div>');
	    	}
			
	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}			
		}
    });
	
    layer.on('mouseout', function(ev) {
		//remove highlight for polygon
		layer.setStyle(noHighlight);		
    });
	
	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();
		
		// bind popup with data to the feature
		MY_MAP.popup2.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
		// numerator
		var Households = feature.properties.Households;
		Households = accounting.formatNumber(Households, 0, ",", "");
		// denominator
		var Pawnshops = feature.properties.Pawnshops;
		Pawnshops = Pawnshops.toFixed(0);
		// computed
		var HH_PAWN = feature.properties.HH_PAWN;
		HH_PAWN = accounting.formatNumber(HH_PAWN, 2, ",", ".");
		
		var header = '<div class="map-popup"><h4 class="text-left">' + feature.properties.NYC_NEIG + '</h4>';
		var householdsText = '<div class="households-icon"></div>' + Households + ' Households<br />';
		var hr = '<hr class="divide">';
		var pawnShopsText = '<div class="pawnshop-icon"></div>' + Pawnshops + ' Pawn Shops<br /><br />';
		if (feature.properties.Pawnshops == 0) {
			var footer = '<p class="grey">The Ratio is Undefined</p>';
		} else if (feature.properties.HH_PAWN == -1){
			var footer = '<p class="grey">0.00 Households per Pawn Shop</p>';			
		} else {
			var footer = '<p class="grey">' + HH_PAWN + ' Households per Pawn Shop</p>';			
		}
						
		var popupContent = header + householdsText + hr + pawnShopsText + footer;
		
		MY_MAP.popup2.setContent(popupContent);
		MY_MAP.popup2.openOn(MY_MAP.map);
	});
	
}

CityDigitsMap.onEachFeature_CREATEMAP9_AFIS_PER_BANK = function(feature,layer){
	var highlight = {
	    weight: 3,
	    opacity: 1
	};
	var noHighlight = {
        weight: 1,
        opacity: .1
	};
	
    //add on hover -- same on hover and mousemove for each layer
    layer.on('mouseover', function(ev) {
		// only have on mouseover work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.NYC_NEIG + '</div>');
		
			//display popup
	        if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
	            MY_MAP.popup.openOn(MY_MAP.map);
	        }else{
	            MY_MAP.map.closePopup();
	        }			
		}
		
		//highlight polygon
		layer.setStyle(highlight);		
		
    });
		
    layer.on('mousemove', function(ev) {
		
		// only have on mousemove work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
	        //get lat/long
	        if(($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.NYC_NEIG + '</div>');
	    	}
			
	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}			
		}
    });
	
    layer.on('mouseout', function(ev) {
		//remove highlight for polygon
		layer.setStyle(noHighlight);		
    });
	
	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();
		
		// bind popup with data to the feature
		MY_MAP.popup2.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
		// numerator
		var Pawnshops = feature.properties.Pawnshops;
		Pawnshops = Pawnshops.toFixed(0);
		var CheckCash = feature.properties.CheckCash;
		CheckCash = CheckCash.toFixed(0);
		var MoneyTrans = feature.properties.MoneyTrans;
		MoneyTrans = MoneyTrans.toFixed(0);
		var AFS_Sum = feature.properties.AFS_Sum;
		AFS_Sum = AFS_Sum.toFixed(0);
		// denominator
		var Banks = feature.properties.Banks;
		Banks = Banks.toFixed(0);
		// computed
		var AFS_BANK = feature.properties.AFS_BANK;
		AFS_BANK = AFS_BANK.toFixed(2);
		
		var header = '<div class="map-popup"><h4 class="text-left">' + feature.properties.NYC_NEIG + '</h4>';
		var pawnShopsText = '<div class="pawnshop-icon"></div>' + Pawnshops + ' Pawn Shops + <br />';
		var checkCashText = '<div class="checkcashing-icon"></div>' + CheckCash + ' Check Cashing + <br />';
		var moneyTransText = '<div class="wiretransfer-icon"></div>' + MoneyTrans + ' Wire Transfer <br />';
		var hr = '<hr class="divide">';
		var banksText = '<div class="banks-icon"></div>' + Banks + ' Banks<br /><br />';
		if (feature.properties.Banks == 0) {
			var footer = '<p class="grey">The Ratio is Undefined</p>';
		} else if (feature.properties.AFS_BANK == -1){
			var footer = '<p class="grey">0.00 Alternative Financial Institutions per Bank</p>';			
		} else {
			var footer = '<p class="grey">' + AFS_BANK + ' Alternative Financial Institutions per Bank</p>';			
		}
				
		var popupContent = header + pawnShopsText + checkCashText + moneyTransText + hr + banksText + footer;
		
		MY_MAP.popup2.setContent(popupContent);
		MY_MAP.popup2.openOn(MY_MAP.map);
	});
	
}

CityDigitsMap.onEachFeature_CREATEMAP10_BANKS_PER_AFI = function(feature,layer){
	var highlight = {
	    weight: 3,
	    opacity: 1
	};
	var noHighlight = {
        weight: 1,
        opacity: .1
	};
	
    //add on hover -- same on hover and mousemove for each layer
    layer.on('mouseover', function(ev) {
		// only have on mouseover work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.NYC_NEIG + '</div>');
		
			//display popup
	        if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
	            MY_MAP.popup.openOn(MY_MAP.map);
	        }else{
	            MY_MAP.map.closePopup();
	        }			
		}
		
		//highlight polygon
		layer.setStyle(highlight);		
		
    });
		
    layer.on('mousemove', function(ev) {
		
		// only have on mousemove work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
	        //get lat/long
	        if(($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.NYC_NEIG + '</div>');
	    	}
			
	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.NYC_NEIG,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}			
		}
    });
	
    layer.on('mouseout', function(ev) {
		//remove highlight for polygon
		layer.setStyle(noHighlight);		
    });
	
	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();
		
		// bind popup with data to the feature
		MY_MAP.popup2.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
		// numerator
		var Banks = feature.properties.Banks;
		Banks = Banks.toFixed(0);
		// denominator
		var Pawnshops = feature.properties.Pawnshops;
		Pawnshops = Pawnshops.toFixed(0);
		var CheckCash = feature.properties.CheckCash;
		CheckCash = CheckCash.toFixed(0);
		var MoneyTrans = feature.properties.MoneyTrans;
		MoneyTrans = MoneyTrans.toFixed(0);
		var AFS_Sum = feature.properties.AFS_Sum;
		AFS_Sum = AFS_Sum.toFixed(0);
		// computed
		var BANK_AFS = feature.properties.BANK_AFS;
		BANK_AFS = BANK_AFS.toFixed(2);
		//console.log(BANK_AFS);
		var header = '<div class="map-popup"><h4 class="text-left">' + feature.properties.NYC_NEIG + '</h4>';
		var banksText = '<div class="banks-icon"></div>' + Banks + ' Banks<br />';
		var hr = '<hr class="divide">';
		var pawnShopsText = '<div class="pawnshop-icon"></div>' + Pawnshops + ' Pawn Shops + <br />';
		var checkCashText = '<div class="checkcashing-icon"></div>' + CheckCash + ' Check Cashing + <br />';
		var moneyTransText = '<div class="wiretransfer-icon"></div>' + MoneyTrans + ' Wire Transfer <br /><br />';
		if (feature.properties.AFS_Sum == 0) {
			var footer = '<p class="grey">The Ratio is Undefined</p>';
		} else if (feature.properties.BANK_AFS == -1){
			var footer = '<p class="grey">0.00 Banks per Alternative Financial Institution</p>';			
		} else {
			var footer = '<p class="grey">' + BANK_AFS + ' Banks per Alternative Financial Institution</p>';			
		}
				
		var popupContent = header + banksText + hr + pawnShopsText + checkCashText + moneyTransText + footer;
		
		MY_MAP.popup2.setContent(popupContent);
		MY_MAP.popup2.openOn(MY_MAP.map);
	});
	
}


CityDigitsMap.prototype.loadLayers = function (){
    var self = this;
		
	// load topoJSON data for neighborhoods
	// path to neighborhoods defined in index.html django template

	// define layer styles and oneachfeature popup styling
	this.MAP1_POP_POVERTY_style = L.geoJson(null, {
	    style: CityDigitsMap.getStyleColorFor_MAP1_POP_POVERTY,
		onEachFeature: CityDigitsMap.onEachFeature_MAP1_POP_POVERTY
	});
	this.MAP2_MED_HH_INCOME_style = L.geoJson(null, {
		style: CityDigitsMap.getStyleColorFor_MAP2_MED_HH_INCOME,
		onEachFeature: CityDigitsMap.onEachFeature_MAP2_MED_HH_INCOME
	});
	this.MAP3_PCT_UNEMPLOYED_style = L.geoJson(null, {
		style: CityDigitsMap.getStyleColorFor_MAP3_PCT_UNEMPLOYED,
		onEachFeature: CityDigitsMap.onEachFeature_MAP3_PCT_UNEMPLOYED
	});
	this.MAP4_PCT_FOREIGN_BORN_style = L.geoJson(null, {
		style: CityDigitsMap.getStyleColorFor_MAP4_PCT_FOREIGN_BORN,
		onEachFeature: CityDigitsMap.onEachFeature_MAP4_PCT_FOREIGN_BORN
	});
	this.CREATEMAP1_AFI_PER_SQMILE_style = L.geoJson(null, {
		style: CityDigitsMap.getStyleColorFor_CREATEMAP1_AFI_PER_SQMILE,
		onEachFeature: CityDigitsMap.onEachFeature_CREATEMAP1_AFI_PER_SQMILE
	});
	this.CREATEMAP2_BANKS_PER_SQMILE_style = L.geoJson(null, {
		style: CityDigitsMap.getStyleColorFor_CREATEMAP2_BANKS_PER_SQMILE,
		onEachFeature: CityDigitsMap.onEachFeature_CREATEMAP2_BANKS_PER_SQMILE
	});
	this.CREATEMAP3_PAWN_SHOPS_PER_SQMILE_style = L.geoJson(null, {
		style: CityDigitsMap.getStyleColorFor_CREATEMAP3_PAWN_SHOPS_PER_SQMILE,
		onEachFeature: CityDigitsMap.onEachFeature_CREATEMAP3_PAWN_SHOPS_PER_SQMILE
	});
	this.CREATEMAP4_MCDONALDS_PER_SQMILE_style = L.geoJson(null, {
		style: CityDigitsMap.getStyleColorFor_CREATEMAP4_MCDONALDS_PER_SQMILE,
		onEachFeature: CityDigitsMap.onEachFeature_CREATEMAP4_MCDONALDS_PER_SQMILE
	});
	this.CREATEMAP5_HH_PER_AFI_style = L.geoJson(null, {
		style: CityDigitsMap.getStyleColorFor_CREATEMAP5_HH_PER_AFI,
		onEachFeature: CityDigitsMap.onEachFeature_CREATEMAP5_HH_PER_AFI
	});
	this.CREATEMAP6_HH_PER_BANK_style = L.geoJson(null, {
		style: CityDigitsMap.getStyleColorFor_CREATEMAP6_HH_PER_BANK,
		onEachFeature: CityDigitsMap.onEachFeature_CREATEMAP6_HH_PER_BANK
	});
	this.CREATEMAP7_HH_PER_MCDONALDS_style = L.geoJson(null, {
		style: CityDigitsMap.getStyleColorFor_CREATEMAP7_HH_PER_MCDONALDS,
		onEachFeature: CityDigitsMap.onEachFeature_CREATEMAP7_HH_PER_MCDONALDS
	});
	this.CREATEMAP8_HH_PER_PAWN_SHOP_style = L.geoJson(null, {
		style: CityDigitsMap.getStyleColorFor_CREATEMAP8_HH_PER_PAWN_SHOP,
		onEachFeature: CityDigitsMap.onEachFeature_CREATEMAP8_HH_PER_PAWN_SHOP
	});
	this.CREATEMAP9_AFIS_PER_BANK_style = L.geoJson(null, {
		style: CityDigitsMap.getStyleColorFor_CREATEMAP9_AFIS_PER_BANK,
		onEachFeature: CityDigitsMap.onEachFeature_CREATEMAP9_AFIS_PER_BANK
	});
	this.CREATEMAP10_BANKS_PER_AFI_style = L.geoJson(null, {
		style: CityDigitsMap.getStyleColorFor_CREATEMAP10_BANKS_PER_AFI,
		onEachFeature: CityDigitsMap.onEachFeature_CREATEMAP10_BANKS_PER_AFI
	});

			
	// load layers
	this.MAP1_POP_POVERTY = omnivore.topojson(neighborhoods, null, this.MAP1_POP_POVERTY_style);
	this.MAP2_MED_HH_INCOME = omnivore.topojson(neighborhoods, null, this.MAP2_MED_HH_INCOME_style);
	this.MAP3_PCT_UNEMPLOYED = omnivore.topojson(neighborhoods, null, this.MAP3_PCT_UNEMPLOYED_style);
	this.MAP4_PCT_FOREIGN_BORN = omnivore.topojson(neighborhoods, null, this.MAP4_PCT_FOREIGN_BORN_style);
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
	
	//start with value population in poverty for initial load
	this.neighborhoodLayer = this.MAP1_POP_POVERTY;
	this.neighborhoodLayer._leaflet_id = 'legendpoverty';
	this.neighborhoodLayer.addTo(this.map).bringToBack();
	
}


CityDigitsMap.getStyleColorFor_MAP1_POP_POVERTY = function (feature){
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

CityDigitsMap.getStyleColorFor_MAP2_MED_HH_INCOME = function (feature){
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

CityDigitsMap.getStyleColorFor_MAP3_PCT_UNEMPLOYED = function (feature){
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

CityDigitsMap.getStyleColorFor_MAP4_PCT_FOREIGN_BORN = function (feature){
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

CityDigitsMap.getStyleColorFor_CREATEMAP1_AFI_PER_SQMILE = function (feature){
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

CityDigitsMap.getStyleColorFor_CREATEMAP2_BANKS_PER_SQMILE = function (feature){
    try{
        var value = feature.properties.BANK_SQMI;
        var fillColor = null;
        if(value < 0){
			fillColor = "#ffffff";
        }
        if(value >= 0 && value <= 1){
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

CityDigitsMap.getStyleColorFor_CREATEMAP3_PAWN_SHOPS_PER_SQMILE = function (feature){
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

CityDigitsMap.getStyleColorFor_CREATEMAP4_MCDONALDS_PER_SQMILE = function (feature){
    try{
        var value = feature.properties.McD_SQMI;
        var fillColor = null;
        if(value < 0){
			fillColor = "#ffffff";
        }
        if(value >= 0 && value <= 1){
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

CityDigitsMap.getStyleColorFor_CREATEMAP5_HH_PER_AFI = function (feature){
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

CityDigitsMap.getStyleColorFor_CREATEMAP6_HH_PER_BANK = function (feature){
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

CityDigitsMap.getStyleColorFor_CREATEMAP7_HH_PER_MCDONALDS = function (feature){
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

CityDigitsMap.getStyleColorFor_CREATEMAP8_HH_PER_PAWN_SHOP = function (feature){
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

CityDigitsMap.getStyleColorFor_CREATEMAP9_AFIS_PER_BANK = function (feature){
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

CityDigitsMap.getStyleColorFor_CREATEMAP10_BANKS_PER_AFI = function (feature){
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


CityDigitsMap.onEachFeatureFor_LOC1_PAWN_SHOPS = function(feature,layer){
	var highlight = {
		stroke: true,
	    color: '#ffffff', 
	    weight: 3,
	    opacity: 1,
	};
	var noHighlight = {
		stroke: false
	};
	
    //add on hover -- same on hover and mousemove for each layer
    layer.on('mouseover', function(ev) {
		// only have on mouseover work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
			// close all popups first
			MY_MAP.map.closePopup();
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="pawnshop-icon"></div>Pawn Shop<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p></div>');
		
			//display popup
	        if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.name,open_tooltips)<0)){
	            MY_MAP.popup.openOn(MY_MAP.map);
	        }else{
	            MY_MAP.map.closePopup();
	        }
			
			//highlight point
			layer.setStyle(highlight).bringToFront();		
		}
    });
	
    layer.on('mousemove', function(ev) {
		
		// only have on mousemove work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
	        //get lat/long
	        if(($.inArray(feature.properties.name,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="pawnshop-icon"></div>Pawn Shop<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p></div>');
	    	}

	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.name,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}

			//highlight point
			layer.setStyle(highlight);		
						
		}
    });
	
    layer.on('mouseout', function(ev) {
		//highlight point
		layer.setStyle(noHighlight);		
    });
	
}

CityDigitsMap.onEachFeatureFor_LOC2_CHECK_CASHING = function(feature,layer){	
	var highlight = {
		stroke: true,
	    color: '#ffffff', 
	    weight: 3,
	    opacity: 1,
	};
	var noHighlight = {
		stroke: false
	};
	
    //add on hover -- same on hover and mousemove for each layer
    layer.on('mouseover', function(ev) {
		// only have on mouseover work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
			// close all popups first
			MY_MAP.map.closePopup();
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="checkcashing-icon"></div>Check Cashing<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p></div>');
		
			//display popup
	        if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.name,open_tooltips)<0)){
	            MY_MAP.popup.openOn(MY_MAP.map);
	        }else{
	            MY_MAP.map.closePopup();
	        }		
		}
		
		//highlight point
		layer.setStyle(highlight).bringToFront();		
		
    });
	
    layer.on('mousemove', function(ev) {
		
		// only have on mousemove work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
	        //get lat/long
	        if(($.inArray(feature.properties.name,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="checkcashing-icon"></div>Check Cashing<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p></div>');
	    	}

	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.name,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}			
		}
		
		//highlight point
		layer.setStyle(highlight);		
		
    });
	
    layer.on('mouseout', function(ev) {
		//highlight point
		layer.setStyle(noHighlight);		
    });
	
	
}

CityDigitsMap.onEachFeatureFor_LOC3_WIRE_TRANSFER = function(feature,layer){
	var highlight = {
		stroke: true,
	    color: '#ffffff', 
	    weight: 3,
	    opacity: 1,
	};
	var noHighlight = {
		stroke: false
	};

    //add on hover -- same on hover and mousemove for each layer
    layer.on('mouseover', function(ev) {
		// only have on mouseover work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
			// close all popups first
			MY_MAP.map.closePopup();
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="wiretransfer-icon"></div>Wire Transfer<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p></div>');
		
			//display popup
	        if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.name,open_tooltips)<0)){
	            MY_MAP.popup.openOn(MY_MAP.map);
	        }else{
	            MY_MAP.map.closePopup();
	        }		
		}
		
		//highlight point
		layer.setStyle(highlight).bringToFront();		
		
    });
	
    layer.on('mousemove', function(ev) {
		
		// only have on mousemove work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
	        //get lat/long
	        if(($.inArray(feature.properties.name,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="wiretransfer-icon"></div>Wire Transfer<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p></div>');
	    	}

	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.name,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}			
		}
		
		//highlight point
		layer.setStyle(highlight);		
		
    });
	
    layer.on('mouseout', function(ev) {
		//highlight point
		layer.setStyle(noHighlight);		
    });
	
	
}

CityDigitsMap.onEachFeatureFor_LOC4_BANKS = function(feature,layer){
	var highlight = {
		stroke: true,
	    color: '#ffffff', 
	    weight: 3,
	    opacity: 1,
	};
	var noHighlight = {
		stroke: false
	};

    //add on hover -- same on hover and mousemove for each layer
    layer.on('mouseover', function(ev) {
		// only have on mouseover work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
			// close all popups first
			MY_MAP.map.closePopup();
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="banks-icon"></div>Bank<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p></div>');
		
			//display popup
	        if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.name,open_tooltips)<0)){
	            MY_MAP.popup.openOn(MY_MAP.map);
	        }else{
	            MY_MAP.map.closePopup();
	        }		
		}
		
		//highlight point
		layer.setStyle(highlight).bringToFront();		
		
    });
	
    layer.on('mousemove', function(ev) {
		
		// only have on mousemove work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
	        //get lat/long
	        if(($.inArray(feature.properties.name,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="banks-icon"></div>Bank<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p></div>');
	    	}

	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.name,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}			
		}
		
		//highlight point
		layer.setStyle(highlight);		
		
    });
	
    layer.on('mouseout', function(ev) {
		//highlight point
		layer.setStyle(noHighlight);		
    });
	
	
}

CityDigitsMap.onEachFeatureFor_LOC5_MCDONALDS = function(feature,layer){
	var highlight = {
		stroke: true,
	    color: '#ffffff', 
	    weight: 3,
	    opacity: 1,
	};
	var noHighlight = {
		stroke: false
	};

    //add on hover -- same on hover and mousemove for each layer
    layer.on('mouseover', function(ev) {
		// only have on mouseover work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
			// close all popups first
			MY_MAP.map.closePopup();
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="mcdonalds-icon"></div>McDonald\'s<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p></div>');
		
			//display popup
	        if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.name,open_tooltips)<0)){
	            MY_MAP.popup.openOn(MY_MAP.map);
	        }else{
	            MY_MAP.map.closePopup();
	        }		
		}
		
		//highlight point
		layer.setStyle(highlight).bringToFront();		
		
    });
	
    layer.on('mousemove', function(ev) {
		
		// only have on mousemove work if popup2 isn't open
		if (!MY_MAP.popup2._isOpen) {
	        //get lat/long
	        if(($.inArray(feature.properties.name,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="mcdonalds-icon"></div>McDonald\'s<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p></div>');
	    	}

	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.name,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}			
		}
		
		//highlight point
		layer.setStyle(highlight);		
		
    });
	
    layer.on('mouseout', function(ev) {
		//highlight point
		layer.setStyle(noHighlight);		
    });
	
	
}

CityDigitsMap.onEachFeatureFor_LOC6_SUBWAY_LINES = function(feature,layer){

    //add on hover -- same on hover and mousemove for each layer
    layer.on('mouseover', function(ev) {	
		
    });
	
    layer.on('mousemove', function(ev) {
				
    });
	
    layer.on('mouseout', function(ev) {
		
    });
	
	
}

CityDigitsMap.prototype.loadMarkers = function(){
		
	this.LOC1_PAWN_SHOPS = null;
	this.LOC2_CHECK_CASHING = null;
	this.LOC3_WIRE_TRANSFER = null;
	this.LOC4_BANKS = null;
	this.LOC5_MCDONALDS = null;
	this.LOC6_SUBWAY_LINES = null;
	this.LOC7_SUBWAY_STATIONS = null;

	// define layer styles and oneachfeature popup styling
	this.LOC1_PAWN_SHOPS_style = L.geoJson(null, {
		pointToLayer: CityDigitsMap.getStyleFor_LOC1_PAWN_SHOPS,
		onEachFeature: CityDigitsMap.onEachFeatureFor_LOC1_PAWN_SHOPS
	});
	this.LOC2_CHECK_CASHING_style = L.geoJson(null, {
		pointToLayer: CityDigitsMap.getStyleFor_LOC2_CHECK_CASHING,
		onEachFeature: CityDigitsMap.onEachFeatureFor_LOC2_CHECK_CASHING
	});
	this.LOC3_WIRE_TRANSFER_style = L.geoJson(null, {
		pointToLayer: CityDigitsMap.getStyleFor_LOC3_WIRE_TRANSFER,
		onEachFeature: CityDigitsMap.onEachFeatureFor_LOC3_WIRE_TRANSFER
	});	
	this.LOC4_BANKS_style = L.geoJson(null, {
		pointToLayer: CityDigitsMap.getStyleFor_LOC4_BANKS,
		onEachFeature: CityDigitsMap.onEachFeatureFor_LOC4_BANKS
	});	
	this.LOC5_MCDONALDS_style = L.geoJson(null, {
		pointToLayer: CityDigitsMap.getStyleFor_LOC5_MCDONALDS,
		onEachFeature: CityDigitsMap.onEachFeatureFor_LOC5_MCDONALDS
	});	
	this.LOC6_SUBWAY_LINES_style = L.geoJson(null, {
		style: CityDigitsMap.getStyleFor_LOC6_SUBWAY_LINES,
		onEachFeature: CityDigitsMap.onEachFeatureFor_LOC6_SUBWAY_LINES
	});	
	this.LOC7_SUBWAY_STATIONS_style = L.geoJson(null, {
		pointToLayer: CityDigitsMap.getStyleFor_LOC7_SUBWAY_STATIONS,
		onEachFeature: CityDigitsMap.onEachFeatureFor_LOC7_SUBWAY_STATIONS
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


CityDigitsMap.getStyleFor_LOC1_PAWN_SHOPS = function (feature, latlng){
	var pawnShopMarker = L.circle(latlng, 80, {
		stroke: false,
		fillColor: '#eb4a42',
		fillOpacity: 0.75
	});
	
	return pawnShopMarker;
	
}

CityDigitsMap.getStyleFor_LOC2_CHECK_CASHING = function (feature, latlng){
	var checkCashingMarker = L.circle(latlng, 80, {
		stroke: false,
		fillColor: '#ffa77f',
		fillOpacity: 0.75
	});
	
	return checkCashingMarker;
	
}

CityDigitsMap.getStyleFor_LOC3_WIRE_TRANSFER = function (feature, latlng){
	var wireTransferMarker = L.circle(latlng, 80, {
		stroke: false,
		fillColor: '#fa8a12',
		fillOpacity: 0.75
	});
	
	return wireTransferMarker;
	
}

CityDigitsMap.getStyleFor_LOC4_BANKS = function (feature, latlng){
	var banksMarker = L.circle(latlng, 80, {
		stroke: false,
		fillColor: '#fa8aa3',
		fillOpacity: 0.75
	});
	
	return banksMarker;
	
}

CityDigitsMap.getStyleFor_LOC5_MCDONALDS = function (feature, latlng){
	var mcdonaldsMarker = L.circle(latlng, 80, {
		stroke: false,
		fillColor: '#ebcf42',
		fillOpacity: 0.75
	});
	
	return mcdonaldsMarker;
	
}

CityDigitsMap.getStyleFor_LOC6_SUBWAY_LINES = function (feature, layer){
	var subwayLinesInitialStyle = {
	    color: "#9c9c9c",
	    weight: 3,
	    opacity: 0.75
	};
	
	return subwayLinesInitialStyle;
	
}

CityDigitsMap.getStyleFor_LOC7_SUBWAY_STATIONS = function (feature, latlng){
	var subwayStationInitialStyle = L.circleMarker(latlng, {
	    radius: 0,
	    weight: 0,
	    fillOpacity: 0.75
	});
	
	return subwayStationInitialStyle;
	
}

CityDigitsMap.loadLayerFor = function(layerId){
	
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
		CityDigitsMap.drawChartOnSwap();
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
			CityDigitsMap.drawChartOnSwap();
			
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
			CityDigitsMap.drawChartOnSwap();	
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
			CityDigitsMap.drawChartOnSwap();
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
			CityDigitsMap.drawChartOnSwap();
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
			CityDigitsMap.drawChartOnSwap();
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
			CityDigitsMap.drawChartOnSwap();
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
				CityDigitsMap.drawChartOnSwap();
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
			CityDigitsMap.drawChartOnSwap();
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
			CityDigitsMap.drawChartOnSwap();
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
				CityDigitsMap.drawChartOnSwap();
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
				CityDigitsMap.drawChartOnSwap();
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
				CityDigitsMap.drawChartOnSwap();
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
				CityDigitsMap.drawChartOnSwap();
    }

}

CityDigitsMap.loadLocationsLayerFor = function(layerId){
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

CityDigitsMap.removeLayerFor = function(layerId){
	// remove all popups first
	MY_MAP.map.closePopup();
	// then remove layer
	MY_MAP.map.removeLayer( layerId ); 
}

CityDigitsMap.drawChart = function(layerId){
	// remove chart a tag, which we repace with the svg drawn below
	$("#chart").remove();
	
	// change class of chartId div to enlarge and set background white
	$('#chartid').attr('class', 'chartDiv');	
	
	//set up container for mouseover interaction
	var div = d3.select("body").append("div")
	    .attr("class", "barchartTooltip")
	    .style("opacity", 1e-6);
	
	
	//set properties depending on layerid selected	
	if (layerId == 'legendpoverty') {
		var propertyName = 'PovertyPer';
		var formatter = d3.format(".0%");
		var title = 'Percent Population in Poverty';
	} 
	if (layerId == 'legendmedhhinc') {
		var propertyName = 'MedHouInco';
		var formatNumber = d3.format(",.0f")
		var formatter = function(d) { return "$" + formatNumber(d); };
		var title = 'Median Household Income';
	}
	if (layerId == 'legendunemploy') {
		var propertyName = 'UnempRate';
		var formatter = d3.format(".1%");
		var title = 'Percent Unemployed';
	} 
	if (layerId == 'legendforeignborn') {
		var propertyName = 'ForBornPer';
		var formatter = d3.format(".0%");
		var title = 'Percent Population Foreign Born';
	} 
	if (layerId == 'legendAFIpersqmi') {
		var propertyName = 'AFS_SQMI';
		var formatter = d3.format(",.2f")
		var title = 'Alternative Financial Insitutions per Square Mile';
	} 
	if (layerId == 'legendbankspersqmi') {
		var propertyName = 'BANK_SQMI';
		var formatter = d3.format(",.2f")
		var title = 'Banks per Square Mile';
	} 
	if (layerId == 'legendpawnsqmi') {
		var propertyName = 'PAWN_SQMI';
		var formatter = d3.format(",.2f")
		var title = 'Pawn Shops per Square Mile';
	} 
	if (layerId == 'legendmcdonaldspersqi') {
		var propertyName = 'McD_SQMI';
		var formatter = d3.format(",.2f")
		var title = 'McDonald\'s per Square Mile';
	} 
	if (layerId == 'legendhouseholdsperAFI') {
		var propertyName = 'HH_AFS';
		var formatter = d3.format(",.2f")
		var title = 'Households per Alternative Financial Insitution';
	} 
	if (layerId == 'legendhouseholdsperbank') {
		var propertyName = 'HH_BANK';
		var formatter = d3.format(",.2f")
		var title = 'Households per Bank';
	} 
	if (layerId == 'legendhouseholdsperMcD') {
		var propertyName = 'HH_McD';
		var formatter = d3.format(",.2f")
		var title = 'Households per McDonald\'s';
	} 
	if (layerId == 'legendhouseholdsperpawn') {
		var propertyName = 'HH_PAWN';
		var formatter = d3.format(",.2f")
		var title = 'Households per Pawn Shop';
	} 
	if (layerId == 'legendAFIsperbank') {
		var propertyName = 'AFS_BANK';
		var formatter = d3.format(",.2f")
		var title = 'Alternative Financial Insitutions per Bank';
	} 
	if (layerId == 'legendbanksperAFIs') {
		var propertyName = 'BANK_AFS';
		var formatter = d3.format(",.2f")
		var title = 'Banks per Alternative Financial Insitution';
	} 
	
	
	var margin = {top: 50, right: 20, bottom: 30, left: 70},
	    width = 500 - margin.left - margin.right,
	    height = 400 - margin.top - margin.bottom;
	
	var x = d3.scale.ordinal()
	    .rangeBands([0, width], 0, 1);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
		.tickFormat(formatter);
		
	var svg = d3.select("#chartid").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
		.attr("id", 'svgChart')
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
	d3.json(neighborhoods, function(error, data) {
	  var openedTopoJson = topojson.feature(data, data.objects.all_map_data_boundariesfixed_july22).features;
	  openedTopoJson.sort(function (a, b) {
	      if (Number(a.properties[propertyName]) > Number(b.properties[propertyName])) {
			  return 1;	      	
	      } else if (Number(a.properties[propertyName]) < Number(b.properties[propertyName])) {
			  return -1;	      	
	      } else {
		      // a must be equal to b
		      return 0;	      	
	      }
	  });
	  x.domain(openedTopoJson.map(function(d) { return d.properties.NYC_NEIG; }));
	  y.domain([0, d3.max(openedTopoJson, function(d) { return d.properties[propertyName]; })]);

	  svg.append("g")
	      .attr("class", "chartTitle")
	    .append("text")
	      .attr("y", -20)
	      .attr("x", 190)
	      .style("text-anchor", "middle")
	      .text(title);
		  		  
	  svg.append("g")
	      .attr("class", "chartCloseContainer")
		 .append("a")
		  .attr("id", "chartCloseButton")
		  .attr("xlink:href", "#")
		 .append("image")
		  .attr("xlink:href", closeButtonGray)
		  .attr("y", -40)
		  .attr("x", 400)
		  .attr("width", 22)
		  .attr("height", 22);
	  
	  svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis);

	  svg.selectAll(".bar")
	      .data(openedTopoJson)
	    .enter().append("rect")
	      .attr("class", "bar")
	      .attr("x", function(d) { return x(d.properties.NYC_NEIG); })
	      .attr("width", x.rangeBand())
	      .attr("y", function(d) { return y(d.properties[propertyName]); })
	      .attr("height", function(d) { return height - y(d.properties[propertyName]); })
		  .attr("id", function(d) { return d.properties.NYC_NEIG })
		  .on("click", function(d) {
			  CityDigitsMap.zoomToNeighborhoodAndPopup(d.properties.NYC_NEIG);
		  })
		  // set up on mouseover events
		  .on("mouseover", function(d) {
				//console.log(d);

			    div.transition()
			        .duration(250)
			        .style("opacity", 1);
					
			      div.html(
					'<h4 class="text-left">' + d.properties.NYC_NEIG + '</h4>' +
					'<p class="text-center">' + formatter(d.properties[propertyName]) + '<br />' + title + '</p>'
				  )  
			      .style("left", (d3.event.pageX + 18) + "px")     
			      .style("top", (d3.event.pageY - 60) + "px");

		  })
		  .on("mouseout", function() {
			   div.transition()
			       .duration(250)
			       .style("opacity", 1e-6);
		  });
		  
		  
		  
	  	// close chart when close chart button is clicked
	  	$('#chartCloseButton').click(function() {
	  		// get id of layer selected
	  		var layerId = mainLayer._leaflet_id;
	  		// remove chart
	  		CityDigitsMap.removeChart(layerId);
	  	});

	});
	
	// set mainChart on
	mainChart = 1;
		
}

CityDigitsMap.removeChart = function(layerId){
	$( "#svgChart" ).remove();
	$( "#chartid" ).append( '<a id="chart" href="#"></a>' );
	// draw chart based on layer selected
	$('#chart').click(function() {
		// get id of layer selected
		var layerId = mainLayer._leaflet_id;
		if (!mainChart) {
			// draw chart
			CityDigitsMap.drawChart(layerId);
		}		
	});
	$( "#chartid" ).attr('class', 'chart-icon');	
	mainChart = null;	
}

CityDigitsMap.drawChartOnSwap = function() {
	// swap bar chart if open
	if (mainChart == 1) {
		// remove previous chart
		$( "#svgChart" ).remove();
		$( "#chartid" ).append( '<a id="chart" href="#"></a>' );			
		// draw chart based on new layer selected
		var layerId = mainLayer._leaflet_id;
		CityDigitsMap.drawChart(layerId);		
	}
}


CityDigitsMap.zoomToNeighborhoodAndPopup = function(neighborhoodName) {
	var layerArray = [];
	layerArray = mainLayer.getLayers();
	
	$.each(layerArray, function(index, layer){
		if (layer.feature.properties.NYC_NEIG == neighborhoodName) {
			// close all open popups
			MY_MAP.map.closePopup();
			
			var bounds = layer.getBounds();
			MY_MAP.map.fitBounds(layer.getBounds(), {maxZoom: 13, paddingTopLeft:[700,200]});

			// bind popup with data to the feature
			var center = bounds.getCenter();
			MY_MAP.popup2.setLatLng(center);					
			
			// get popup content
			var layerId = mainLayer._leaflet_id;
			var popupContent = CityDigitsMap.setPopUpContent(layer, layerId);	
			
			MY_MAP.popup2.setContent(popupContent);
			MY_MAP.popup2.openOn(MY_MAP.map);
			
		}
		 
	});
	
}

CityDigitsMap.setPopUpContent = function(layer,layerId) {
	// brute force setting popup content wehn clicking on D3 bar chart
	if (layerId == 'legendpoverty') {
		var percent = layer.feature.properties.PovertyPer * 100;
		percent = percent.toFixed(0);
		var popupContent = '<div class="map-popup"><h4 class="text-left">' + layer.feature.properties.NYC_NEIG + '</h4><p>' + percent + '%<br />Population in Poverty</p></div>';
	} 
	if (layerId == 'legendmedhhinc') {
		var MedHHInc = accounting.formatMoney(layer.feature.properties.MedHouInco, "$", 0, ",", "");
		var popupContent = '<div class="map-popup"><h4 class="text-left">' + layer.feature.properties.NYC_NEIG + '</h4><p>' + MedHHInc + '<br />Median Household Income</p></div>';
	}
	if (layerId == 'legendunemploy') {
		var percent = layer.feature.properties.UnempRate * 100;
		percent = percent.toFixed(1);
		var popupContent = '<div class="map-popup"><h4 class="text-left">' + layer.feature.properties.NYC_NEIG + '</h4><p>' + percent + '%<br />Percent Unemployed</p></div>';
	} 
	if (layerId == 'legendforeignborn') {
		var percent = layer.feature.properties.ForBornPer * 100;
		percent = percent.toFixed(0);
		var popupContent = '<div class="map-popup"><h4 class="text-left">' + layer.feature.properties.NYC_NEIG + '</h4><p>' + percent + '%<br />Population Foreign Born</p></div>';
	} 
	if (layerId == 'legendAFIpersqmi') {
		// numerator
		var Pawnshops = layer.feature.properties.Pawnshops;
		Pawnshops = Pawnshops.toFixed(0);
		var CheckCash = layer.feature.properties.CheckCash;
		CheckCash = CheckCash.toFixed(0);
		var MoneyTrans = layer.feature.properties.MoneyTrans;
		MoneyTrans = MoneyTrans.toFixed(0);
		var AFS_Sum = layer.feature.properties.AFS_Sum;
		AFS_Sum = AFS_Sum.toFixed(0);
		// denominator
		var sq_mile = layer.feature.properties.sq_mile;
		sq_mile = sq_mile.toFixed(2);
		// computed
		var AFS_SQMI = layer.feature.properties.AFS_SQMI;
		AFS_SQMI = AFS_SQMI.toFixed(2);
		
		var header = '<div class="map-popup"><h4 class="text-left">' + layer.feature.properties.NYC_NEIG + '</h4>';
		var pawnShopsText = '<div class="pawnshop-icon"></div>' + Pawnshops + ' Pawn Shops + <br />';
		var checkCashText = '<div class="checkcashing-icon"></div>' + CheckCash + ' Check Cashing + <br />';
		var moneyTransText = '<div class="wiretransfer-icon"></div>' + MoneyTrans + ' Wire Transfer <br />';
		var hr = '<hr class="divide">';
		var sq_mileText = '<div class="squaremiles-icon"></div>' + sq_mile + ' Square Miles <br /><br />';
		var footer = '<p class="grey">' + AFS_SQMI + ' Alternative Financial Institutions per Square Mile</p>';
				
		var popupContent = header + pawnShopsText + checkCashText + moneyTransText + hr + sq_mileText + footer;
	} 
	if (layerId == 'legendbankspersqmi') {
		// numerator
		var Banks = layer.feature.properties.Banks;
		Banks = Banks.toFixed(0);
		// denominator
		var sq_mile = layer.feature.properties.sq_mile;
		sq_mile = sq_mile.toFixed(2);
		// computed
		var BANK_SQMI = layer.feature.properties.BANK_SQMI;
		BANK_SQMI = BANK_SQMI.toFixed(2);
		
		var header = '<div class="map-popup"><h4 class="text-left">' + layer.feature.properties.NYC_NEIG + '</h4>';
		var banksText = '<div class="banks-icon"></div>' + Banks + ' Banks<br />';
		var hr = '<hr class="divide">';
		var sq_mileText = '<div class="squaremiles-icon"></div>' + sq_mile + ' Square Miles <br /><br />';
		var footer = '<p class="grey">' + BANK_SQMI + ' Banks per Square Mile</p>';
				
		var popupContent = header + banksText + hr + sq_mileText + footer;
	} 
	if (layerId == 'legendpawnsqmi') {
		// numerator
		var Pawnshops = layer.feature.properties.Pawnshops;
		Pawnshops = Pawnshops.toFixed(0);
		// denominator
		var sq_mile = layer.feature.properties.sq_mile;
		sq_mile = sq_mile.toFixed(2);
		// computed
		var PAWN_SQMI = layer.feature.properties.PAWN_SQMI;
		PAWN_SQMI = PAWN_SQMI.toFixed(2);
		
		var header = '<div class="map-popup"><h4 class="text-left">' + layer.feature.properties.NYC_NEIG + '</h4>';
		var pawnShopsText = '<div class="pawnshop-icon"></div>' + Pawnshops + ' Pawn Shops<br />';
		var hr = '<hr class="divide">';
		var sq_mileText = '<div class="squaremiles-icon"></div>' + sq_mile + ' Square Miles <br /><br />';
		var footer = '<p class="grey">' + PAWN_SQMI + ' Pawn Shops per Square Mile</p>';
				
		var popupContent = header + pawnShopsText + hr + sq_mileText + footer;
	} 
	if (layerId == 'legendmcdonaldspersqi') {
		// numerator
		var McDonalds = layer.feature.properties.McDonalds1;
		McDonalds = McDonalds.toFixed(0);
		// denominator
		var sq_mile = layer.feature.properties.sq_mile;
		sq_mile = sq_mile.toFixed(2);
		// computed
		var McD_SQMI = layer.feature.properties.McD_SQMI;
		McD_SQMI = McD_SQMI.toFixed(2);
		
		var header = '<div class="map-popup"><h4 class="text-left">' + layer.feature.properties.NYC_NEIG + '</h4>';
		var mcDonaldsText = '<div class="mcdonalds-icon"></div>' + McDonalds + ' McDonald\'s<br />';
		var hr = '<hr class="divide">';
		var sq_mileText = '<div class="squaremiles-icon"></div>' + sq_mile + ' Square Miles <br /><br />';
		var footer = '<p class="grey">' + McD_SQMI + ' McDonald\'s per Square Mile</p>';
				
		var popupContent = header + mcDonaldsText + hr + sq_mileText + footer;
	} 
	if (layerId == 'legendhouseholdsperAFI') {
		// numerator
		var Households = layer.feature.properties.Households;
		Households = accounting.formatNumber(Households, 0, ",", "");
		// denominator
		var Pawnshops = layer.feature.properties.Pawnshops;
		Pawnshops = Pawnshops.toFixed(0);
		var CheckCash = layer.feature.properties.CheckCash;
		CheckCash = CheckCash.toFixed(0);
		var MoneyTrans = layer.feature.properties.MoneyTrans;
		MoneyTrans = MoneyTrans.toFixed(0);
		var AFS_Sum = layer.feature.properties.AFS_Sum;
		AFS_Sum = AFS_Sum.toFixed(0);
		// computed
		var HH_AFS = layer.feature.properties.HH_AFS;
		HH_AFS = accounting.formatNumber(HH_AFS, 2, ",", ".");
		
		var header = '<div class="map-popup"><h4 class="text-left">' + layer.feature.properties.NYC_NEIG + '</h4>';
		var householdsText = '<div class="households-icon"></div>' + Households + ' Households<br />';
		var hr = '<hr class="divide">';
		var pawnShopsText = '<div class="pawnshop-icon"></div>' + Pawnshops + ' Pawn Shops + <br />';
		var checkCashText = '<div class="checkcashing-icon"></div>' + CheckCash + ' Check Cashing + <br />';
		var moneyTransText = '<div class="wiretransfer-icon"></div>' + MoneyTrans + ' Wire Transfer <br /><br />';
		if (layer.feature.properties.AFS_Sum == 0) {
			var footer = '<p class="grey">The Ratio is Undefined</p>';
		} else if (layer.feature.properties.HH_AFS == -1){
			var footer = '<p class="grey">0.00 Households per Alternative Financial Institution</p>';			
		} else {
			var footer = '<p class="grey">' + HH_AFS + ' Households per Alternative Financial Institution</p>';			
		}
				
		var popupContent = header + householdsText + hr + pawnShopsText + checkCashText + moneyTransText + footer;
	} 
	if (layerId == 'legendhouseholdsperbank') {
		// numerator
		var Households = layer.feature.properties.Households;
		Households = accounting.formatNumber(Households, 0, ",", "");
		// denominator
		var Banks = layer.feature.properties.Banks;
		Banks = Banks.toFixed(0);
		// computed
		var HH_BANK = layer.feature.properties.HH_BANK;
		HH_BANK = accounting.formatNumber(HH_BANK, 2, ",", ".");
		
		var header = '<div class="map-popup"><h4 class="text-left">' + layer.feature.properties.NYC_NEIG + '</h4>';
		var householdsText = '<div class="households-icon"></div>' + Households + ' Households<br />';
		var hr = '<hr class="divide">';
		var banksText = '<div class="banks-icon"></div>' + Banks + ' Banks<br /><br />';
		if (layer.feature.properties.Banks == 0) {
			var footer = '<p class="grey">The Ratio is Undefined</p>';
		} else if (layer.feature.properties.HH_BANK == -1){
			var footer = '<p class="grey">0.00 Households per Alternative Financial Institution</p>';			
		} else {
			var footer = '<p class="grey">' + HH_BANK + ' Households per Bank</p>';			
		}
				
		var popupContent = header + householdsText + hr + banksText + footer;
	} 
	if (layerId == 'legendhouseholdsperMcD') {
		// numerator
		var Households = layer.feature.properties.Households;
		Households = accounting.formatNumber(Households, 0, ",", "");
		// denominator
		var McDonalds = layer.feature.properties.McDonalds1;
		McDonalds = McDonalds.toFixed(0);
		// computed
		var HH_McD = layer.feature.properties.HH_McD;
		HH_McD = accounting.formatNumber(HH_McD, 2, ",", ".");
		
		var header = '<div class="map-popup"><h4 class="text-left">' + layer.feature.properties.NYC_NEIG + '</h4>';
		var householdsText = '<div class="households-icon"></div>' + Households + ' Households<br />';
		var hr = '<hr class="divide">';
		var mcDonaldsText = '<div class="mcdonalds-icon"></div>' + McDonalds + ' McDonald\'s<br /><br />';
		if (layer.feature.properties.McDonalds1 == 0) {
			var footer = '<p class="grey">The Ratio is Undefined</p>';
		} else if (layer.feature.properties.HH_McD == -1){
			var footer = '<p class="grey">0.00 Households per McDonald\'s</p>';			
		} else {
			var footer = '<p class="grey">' + HH_McD + ' Households per McDonald\'s</p>';			
		}
				
		var popupContent = header + householdsText + hr + mcDonaldsText + footer;
	} 
	if (layerId == 'legendhouseholdsperpawn') {
		// numerator
		var Households = layer.feature.properties.Households;
		Households = accounting.formatNumber(Households, 0, ",", "");
		// denominator
		var Pawnshops = layer.feature.properties.Pawnshops;
		Pawnshops = Pawnshops.toFixed(0);
		// computed
		var HH_PAWN = layer.feature.properties.HH_PAWN;
		HH_PAWN = accounting.formatNumber(HH_PAWN, 2, ",", ".");
		
		var header = '<div class="map-popup"><h4 class="text-left">' + layer.feature.properties.NYC_NEIG + '</h4>';
		var householdsText = '<div class="households-icon"></div>' + Households + ' Households<br />';
		var hr = '<hr class="divide">';
		var pawnShopsText = '<div class="pawnshop-icon"></div>' + Pawnshops + ' Pawn Shops<br /><br />';
		if (layer.feature.properties.Pawnshops == 0) {
			var footer = '<p class="grey">The Ratio is Undefined</p>';
		} else if (layer.feature.properties.HH_PAWN == -1){
			var footer = '<p class="grey">0.00 Households per Pawn Shop</p>';			
		} else {
			var footer = '<p class="grey">' + HH_PAWN + ' Households per Pawn Shop</p>';			
		}
						
		var popupContent = header + householdsText + hr + pawnShopsText + footer;
	} 
	if (layerId == 'legendAFIsperbank') {
		// numerator
		var Pawnshops = layer.feature.properties.Pawnshops;
		Pawnshops = Pawnshops.toFixed(0);
		var CheckCash = layer.feature.properties.CheckCash;
		CheckCash = CheckCash.toFixed(0);
		var MoneyTrans = layer.feature.properties.MoneyTrans;
		MoneyTrans = MoneyTrans.toFixed(0);
		var AFS_Sum = layer.feature.properties.AFS_Sum;
		AFS_Sum = AFS_Sum.toFixed(0);
		// denominator
		var Banks = layer.feature.properties.Banks;
		Banks = Banks.toFixed(0);
		// computed
		var AFS_BANK = layer.feature.properties.AFS_BANK;
		AFS_BANK = AFS_BANK.toFixed(2);
		
		var header = '<div class="map-popup"><h4 class="text-left">' + layer.feature.properties.NYC_NEIG + '</h4>';
		var pawnShopsText = '<div class="pawnshop-icon"></div>' + Pawnshops + ' Pawn Shops + <br />';
		var checkCashText = '<div class="checkcashing-icon"></div>' + CheckCash + ' Check Cashing + <br />';
		var moneyTransText = '<div class="wiretransfer-icon"></div>' + MoneyTrans + ' Wire Transfer <br />';
		var hr = '<hr class="divide">';
		var banksText = '<div class="banks-icon"></div>' + Banks + ' Banks<br /><br />';
		if (layer.feature.properties.Banks == 0) {
			var footer = '<p class="grey">The Ratio is Undefined</p>';
		} else if (layer.feature.properties.AFS_BANK == -1){
			var footer = '<p class="grey">0.00 Alternative Financial Institutions per Bank</p>';			
		} else {
			var footer = '<p class="grey">' + AFS_BANK + ' Alternative Financial Institutions per Bank</p>';			
		}
				
		var popupContent = header + pawnShopsText + checkCashText + moneyTransText + hr + banksText + footer;
	} 
	if (layerId == 'legendbanksperAFIs') {
		// numerator
		var Banks = layer.feature.properties.Banks;
		Banks = Banks.toFixed(0);
		// denominator
		var Pawnshops = layer.feature.properties.Pawnshops;
		Pawnshops = Pawnshops.toFixed(0);
		var CheckCash = layer.feature.properties.CheckCash;
		CheckCash = CheckCash.toFixed(0);
		var MoneyTrans = layer.feature.properties.MoneyTrans;
		MoneyTrans = MoneyTrans.toFixed(0);
		var AFS_Sum = layer.feature.properties.AFS_Sum;
		AFS_Sum = AFS_Sum.toFixed(0);
		// computed
		var BANK_AFS = layer.feature.properties.BANK_AFS;
		BANK_AFS = BANK_AFS.toFixed(2);
		//console.log(BANK_AFS);
		var header = '<div class="map-popup"><h4 class="text-left">' + layer.feature.properties.NYC_NEIG + '</h4>';
		var banksText = '<div class="banks-icon"></div>' + Banks + ' Banks<br />';
		var hr = '<hr class="divide">';
		var pawnShopsText = '<div class="pawnshop-icon"></div>' + Pawnshops + ' Pawn Shops + <br />';
		var checkCashText = '<div class="checkcashing-icon"></div>' + CheckCash + ' Check Cashing + <br />';
		var moneyTransText = '<div class="wiretransfer-icon"></div>' + MoneyTrans + ' Wire Transfer <br /><br />';
		if (layer.feature.properties.AFS_Sum == 0) {
			var footer = '<p class="grey">The Ratio is Undefined</p>';
		} else if (layer.feature.properties.BANK_AFS == -1){
			var footer = '<p class="grey">0.00 Banks per Alternative Financial Institution</p>';			
		} else {
			var footer = '<p class="grey">' + BANK_AFS + ' Banks per Alternative Financial Institution</p>';			
		}
				
		var popupContent = header + banksText + hr + pawnShopsText + checkCashText + moneyTransText + footer;
	} 
	
	
	return popupContent;
}
	
	
