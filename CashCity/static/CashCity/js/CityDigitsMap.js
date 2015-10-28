/* 
* Functions to create a generic City Digits map 
*/

function CityDigitsMap() {
    //initial values
    this.neighborhoodLayer = null;
	this.markerLayer = null;
	var topojsonLayer = null;
	
    //set base Mapbox tiles
    var basemap = "sw2279.NYCLotto";

    //where brooklyn at?!40.7429 N, 73.9188
    this.map = L.mapbox.map('map', basemap,{minZoom:11,maxZoom:17,zoomControl:false}).setView([40.7429,-73.9188], 12);
	
    //load zoomer
    $("#citydigits-zoomer").attr({'class':'citydigits-zoomer'});
    $("#citydigits-zoomer").on("click","#zoom-in",CityDigitsMap.onZoomIn);
    $("#citydigits-zoomer").on("click","#zoom-out",CityDigitsMap.onZoomOut);

    //load chart-icon
    $("#citydigits-charts").attr({'class':'citydigits-charts'});

	//load legend
	$("#citydigits-legend").attr({'class':'citydigits-legend'});
	
	//load geocoder control
	this.map.addControl(L.Control.geocoder());
	
    //set params
    this.height = $(window).height()-$(".navbar").height();
    this.width = $(window).width();

    //disable unwanted events
    this.map.doubleClickZoom.enable();
    this.map.scrollWheelZoom.enable();
    this.map.gridControl.options.follow = true;
	
	//points and lines
	this.LOC1_PAWN_SHOPS = null;
	this.LOC2_CHECK_CASHING = null;
	this.LOC3_WIRE_TRANSFER = null;
	this.LOC4_BANKS = null;
	this.LOC5_MCDONALDS = null;
	this.LOC6_SUBWAY_LINES = null;
	this.LOC7_SUBWAY_STATIONS = null;
	this.NYC_BORO_LAYER = null;
	
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
	
	clusterMedia = L.markerClusterGroup();
	
	// popup containers to catch popups
	this.popup = new L.Popup({ 
		autoPan: false, 
		maxWidth: 200, 
		minWidth: 110, 
		minHeight: 50,
		closeButton: false 
	});
	
	this.popup2 = new L.Popup({ 
		maxWidth: 200,
		minWidth: 100, 
		minHeight: 30, 
		closeButton:true
	});

	this.popup3 = new L.Popup({ 
		maxWidth: 200,
		minWidth: 100, 
		minHeight: 30, 
		closeButton:true
	});

	// locate and continue to watch location
	var map = this.map;
	var locateCircle = L.circle([0, 0], 1).addTo(this.map);
	this.map.on('locationfound', onLocationFound);
	function onLocationFound(e) {
		map.removeLayer(locateCircle);
		var radius = e.accuracy / 2;
	    locateCircle = L.circle(e.latlng, radius).addTo(map);
	}

	this.map.locate({watch: true});

	// make a square mile size box and place it in the lower left corner
	var SCorner = this.map.getBounds().pad(-0.06).getSouth();
	var WCorner = this.map.getBounds().pad(-0.08).getWest();
	var sqmiCircle = L.circle([SCorner,WCorner], 805);
	var rectBounds = sqmiCircle.getBounds();
	var SQMIRECT = L.rectangle(rectBounds, {color: "#000", weight: 2, fillColor: '#fff', fillOpacity: 0.1, draggable: true})
		.bindLabel('1 square mile')
		.addTo(this.map);

	var thismap = this.map;

	/* Don't move the square mile box around the screen
	this.map.on('zoomend', moveSQMIRECT);
	this.map.on('resize', moveSQMIRECT);
	this.map.on('moveend', moveSQMIRECT);
	this.map.on('viewreset', moveSQMIRECT);
	*/


	function moveSQMIRECT() {
		// get zoom
		var zoom = thismap.getZoom();
		if (zoom == 11) {
			sPad = -0.05;
			wPad = -0.07;
		} else if (zoom == 12) {
			sPad = -0.06;
			wPad = -0.08;			
		} else if (zoom == 13) {
			sPad = -0.10;
			wPad = -0.095;						
		} else if (zoom == 14) {
			sPad = -0.17;
			wPad = -0.14;						
		} else if (zoom == 15) {
			sPad = -0.31;
			wPad = -0.23;						
		} else if (zoom == 16) {
			sPad = -0.50;
			wPad = -0.41;						
		} else if (zoom == 17) {
			sPad = 0.4;
			wPad = 0.2;						
		}

		SCorner = thismap.getBounds().pad(sPad).getSouth();
		WCorner = thismap.getBounds().pad(wPad).getWest();
		sqmiCircle = L.circle([SCorner,WCorner], 805);
		rectBounds = sqmiCircle.getBounds();
		SQMIRECT.setBounds(rectBounds);
	}

	
}

CityDigitsMap.onZoomIn = function(event){
    MY_MAP.map.zoomIn();
}

CityDigitsMap.onZoomOut = function(event){
    MY_MAP.map.zoomOut();
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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
		
			//display popup
	        if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	        //get lat/long
	        if(($.inArray(feature.properties.Name,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
	    	}

	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}			
		}
    });
	
    layer.on('mouseout', function(ev) {
		//remove highlight for polygon
		layer.setStyle(noHighlight);

		// close popup
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			MY_MAP.map.closePopup();
		}		
    });	
	
	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();

		// add popups as layers
		var thisPopup;
		if (MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			thisPopup = MY_MAP.popup3;
		} else {
			thisPopup = MY_MAP.popup2;
		}

		// bind popup with data to the feature
		thisPopup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
		var percent = feature.properties.PovertyPer * 100;
		percent = percent.toFixed(0);
		thisPopup.setContent('<div class="map-popup"><h4 class="text-left">' + feature.properties.Name + '</h4><p>' + percent + '%<br />Population in Poverty</p></div>');
		MY_MAP.map.addLayer(thisPopup);

		if (mainChart) {
			// reset all bars
			d3.select('#chartid svg g').selectAll('rect').classed({'bar': true, 'pinkbar': false, 'brightpinkbar': false});
			// select this bar clicked
			var boroSelector = feature.properties.Name.split(',');
			d3.selectAll('#chartid svg g rect[id*="'+boroSelector[1]+'"]').classed({'pinkbar': true, 'bar': false});
			d3.select('#chartid svg g rect[id="'+feature.properties.Name+'"]').classed({'brightpinkbar': true, 'bar': false});

			// show the legend
			var legendText;
			if (boroSelector[1] == ' MN') {
				legendText = "Manhattan Neighborhoods";
			} else if (boroSelector[1] == ' BX') {
				legendText = "Bronx Neighborhoods";
			} else if (boroSelector[1] == ' QNS') {
				legendText = "Queens Neighborhoods";
			} else if (boroSelector[1] == ' SI') {
				legendText = "Staten Island Neighborhoods";
			} else if (boroSelector[1] == ' BK') {
				legendText = "Brooklyn Neighborhoods";
			} else {}
			d3.select('.chartLegend text').text(legendText);
			d3.select('.chartLegend').classed({'show': true, 'hidden': false});
		}

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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
		
			//display popup
	     if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	        //get lat/long
	        if(($.inArray(feature.properties.Name,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
	    	}
			
	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}			
		}
    });
	
    layer.on('mouseout', function(ev) {
		//remove highlight for polygon
		layer.setStyle(noHighlight);		
		// close popup
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			MY_MAP.map.closePopup();
		}
    });
	
	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();

		// add popups as layers
		var thisPopup;
		if (MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			thisPopup = MY_MAP.popup3;
		} else {
			thisPopup = MY_MAP.popup2;
		}
		
		// bind popup with data to the feature
		thisPopup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
		var MedHHInc = accounting.formatMoney(feature.properties.MedHouInco, "$", 0, ",", "");
		thisPopup.setContent('<div class="map-popup"><h4 class="text-left">' + feature.properties.Name + '</h4><p>' + MedHHInc + '<br />Median Household Income</p></div>');
		MY_MAP.map.addLayer(thisPopup);

		if (mainChart) {
			// reset all bars
			d3.select('#chartid svg g').selectAll('rect').classed({'bar': true, 'pinkbar': false, 'brightpinkbar': false});
			// select this bar clicked
			var boroSelector = feature.properties.Name.split(',');
			d3.selectAll('#chartid svg g rect[id*="'+boroSelector[1]+'"]').classed({'pinkbar': true, 'bar': false});
			d3.select('#chartid svg g rect[id="'+feature.properties.Name+'"]').classed({'brightpinkbar': true, 'bar': false});

			// show the legend
			var legendText;
			if (boroSelector[1] == ' MN') {
				legendText = "Manhattan Neighborhoods";
			} else if (boroSelector[1] == ' BX') {
				legendText = "Bronx Neighborhoods";
			} else if (boroSelector[1] == ' QNS') {
				legendText = "Queens Neighborhoods";
			} else if (boroSelector[1] == ' SI') {
				legendText = "Staten Island Neighborhoods";
			} else if (boroSelector[1] == ' BK') {
				legendText = "Brooklyn Neighborhoods";
			} else {}
			d3.select('.chartLegend text').text(legendText);
			d3.select('.chartLegend').classed({'show': true, 'hidden': false});
		}
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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
		
			//display popup
	        if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	        //get lat/long
	        if(($.inArray(feature.properties.Name,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
	    	}
			
	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}			
		}
    });
	
    layer.on('mouseout', function(ev) {
		//remove highlight for polygon
		layer.setStyle(noHighlight);		
		// close popup
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			MY_MAP.map.closePopup();
		}
    });
	
	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();

		// add popups as layers
		var thisPopup;
		if (MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			thisPopup = MY_MAP.popup3;
		} else {
			thisPopup = MY_MAP.popup2;
		}

		// bind popup with data to the feature
		thisPopup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
		var percent = feature.properties.UnempRate * 100;
		percent = percent.toFixed(1);
		thisPopup.setContent('<div class="map-popup"><h4 class="text-left">' + feature.properties.Name + '</h4><p>' + percent + '%<br />Percent Unemployed</p></div>');
		MY_MAP.map.addLayer(thisPopup);

		if (mainChart) {
			// reset all bars
			d3.select('#chartid svg g').selectAll('rect').classed({'bar': true, 'pinkbar': false, 'brightpinkbar': false});
			// select this bar clicked
			var boroSelector = feature.properties.Name.split(',');
			d3.selectAll('#chartid svg g rect[id*="'+boroSelector[1]+'"]').classed({'pinkbar': true, 'bar': false});
			d3.select('#chartid svg g rect[id="'+feature.properties.Name+'"]').classed({'brightpinkbar': true, 'bar': false});

			// show the legend
			var legendText;
			if (boroSelector[1] == ' MN') {
				legendText = "Manhattan Neighborhoods";
			} else if (boroSelector[1] == ' BX') {
				legendText = "Bronx Neighborhoods";
			} else if (boroSelector[1] == ' QNS') {
				legendText = "Queens Neighborhoods";
			} else if (boroSelector[1] == ' SI') {
				legendText = "Staten Island Neighborhoods";
			} else if (boroSelector[1] == ' BK') {
				legendText = "Brooklyn Neighborhoods";
			} else {}
			d3.select('.chartLegend text').text(legendText);
			d3.select('.chartLegend').classed({'show': true, 'hidden': false});
		}

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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
		
			//display popup
	        if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	        //get lat/long
	        if(($.inArray(feature.properties.Name,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
	    	}
			
	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}			
		}
    });
	
    layer.on('mouseout', function(ev) {
		//remove highlight for polygon
		layer.setStyle(noHighlight);		
		// close popup
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			MY_MAP.map.closePopup();
		}
    });
	
	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();

		// add popups as layers
		var thisPopup;
		if (MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			thisPopup = MY_MAP.popup3;
		} else {
			thisPopup = MY_MAP.popup2;
		}

		// bind popup with data to the feature
		thisPopup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
		var percent = feature.properties.ForBornPer * 100;
		percent = percent.toFixed(0);
		thisPopup.setContent('<div class="map-popup"><h4 class="text-left">' + feature.properties.Name + '</h4><p>' + percent + '%<br />Population Foreign Born</p></div>');
		MY_MAP.map.addLayer(thisPopup);

		if (mainChart) {
			// reset all bars
			d3.select('#chartid svg g').selectAll('rect').classed({'bar': true, 'pinkbar': false, 'brightpinkbar': false});
			// select this bar clicked
			var boroSelector = feature.properties.Name.split(',');
			d3.selectAll('#chartid svg g rect[id*="'+boroSelector[1]+'"]').classed({'pinkbar': true, 'bar': false});
			d3.select('#chartid svg g rect[id="'+feature.properties.Name+'"]').classed({'brightpinkbar': true, 'bar': false});

			// show the legend
			var legendText;
			if (boroSelector[1] == ' MN') {
				legendText = "Manhattan Neighborhoods";
			} else if (boroSelector[1] == ' BX') {
				legendText = "Bronx Neighborhoods";
			} else if (boroSelector[1] == ' QNS') {
				legendText = "Queens Neighborhoods";
			} else if (boroSelector[1] == ' SI') {
				legendText = "Staten Island Neighborhoods";
			} else if (boroSelector[1] == ' BK') {
				legendText = "Brooklyn Neighborhoods";
			} else {}
			d3.select('.chartLegend text').text(legendText);
			d3.select('.chartLegend').classed({'show': true, 'hidden': false});
		}

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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
		
			//display popup
	        if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	        //get lat/long
	        if(($.inArray(feature.properties.Name,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
	    	}
			
	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}			
		}
    });
	
    layer.on('mouseout', function(ev) {
		//remove highlight for polygon
		layer.setStyle(noHighlight);		
		// close popup
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			MY_MAP.map.closePopup();
		}
    });
	
	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();

		// add popups as layers
		var thisPopup;
		if (MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			thisPopup = MY_MAP.popup3;
		} else {
			thisPopup = MY_MAP.popup2;
		}
		
		// bind popup with data to the feature
		thisPopup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
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
		// set to "No" if computed value is 0
		if (AFS_SQMI == 0) {
			AFS_SQMI = 'No';
		}
		
		var header = '<div class="map-popup"><h4 class="text-left">' + feature.properties.Name + '</h4>';
		var pawnShopsText = '<div class="pawnshop-icon"></div>' + Pawnshops + ' Pawn Shops + <br />';
		var checkCashText = '<div class="checkcashing-icon"></div>' + CheckCash + ' Check Cashing + <br />';
		var moneyTransText = '<div class="wiretransfer-icon"></div>' + MoneyTrans + ' Wire Transfer <br />';
		var hr = '<hr class="divide">';
		var sq_mileText = '<div class="squaremiles-icon"></div>' + sq_mile + ' Square Miles <br /><br />';
		var footer = '<p class="grey">' + AFS_SQMI + ' Alternative Financial Institutions per Square Mile</p>';
				
		var popupContent = header + pawnShopsText + checkCashText + moneyTransText + hr + sq_mileText + footer;
		
		thisPopup.setContent(popupContent);
		MY_MAP.map.addLayer(thisPopup);

		if (mainChart) {
			// reset all bars
			d3.select('#chartid svg g').selectAll('rect').classed({'bar': true, 'pinkbar': false, 'brightpinkbar': false});
			// select this bar clicked
			var boroSelector = feature.properties.Name.split(',');
			d3.selectAll('#chartid svg g rect[id*="'+boroSelector[1]+'"]').classed({'pinkbar': true, 'bar': false});
			d3.select('#chartid svg g rect[id="'+feature.properties.Name+'"]').classed({'brightpinkbar': true, 'bar': false});

			// show the legend
			var legendText;
			if (boroSelector[1] == ' MN') {
				legendText = "Manhattan Neighborhoods";
			} else if (boroSelector[1] == ' BX') {
				legendText = "Bronx Neighborhoods";
			} else if (boroSelector[1] == ' QNS') {
				legendText = "Queens Neighborhoods";
			} else if (boroSelector[1] == ' SI') {
				legendText = "Staten Island Neighborhoods";
			} else if (boroSelector[1] == ' BK') {
				legendText = "Brooklyn Neighborhoods";
			} else {}
			d3.select('.chartLegend text').text(legendText);
			d3.select('.chartLegend').classed({'show': true, 'hidden': false});
		}

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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
		
			//display popup
	        if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	        //get lat/long
	        if(($.inArray(feature.properties.Name,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
	    	}
			
	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}			
		}
    });
	
    layer.on('mouseout', function(ev) {
		//remove highlight for polygon
		layer.setStyle(noHighlight);		
		// close popup
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			MY_MAP.map.closePopup();
		}
    });
	
	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();

		// add popups as layers
		var thisPopup;
		if (MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			thisPopup = MY_MAP.popup3;
		} else {
			thisPopup = MY_MAP.popup2;
		}
		
		// bind popup with data to the feature
		thisPopup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
		// numerator
		var Banks = feature.properties.Banks;
		Banks = Banks.toFixed(0);
		// denominator
		var sq_mile = feature.properties.sq_mile;
		sq_mile = sq_mile.toFixed(2);
		// computed
		var BANK_SQMI = feature.properties.BANK_SQMI;
		BANK_SQMI = BANK_SQMI.toFixed(2);		
		// set to "No" if computed value is 0
		if (BANK_SQMI == 0) {
			BANK_SQMI = 'No';
		}
		
		
		var header = '<div class="map-popup"><h4 class="text-left">' + feature.properties.Name + '</h4>';
		var banksText = '<div class="banks-icon"></div>' + Banks + ' Banks<br />';
		var hr = '<hr class="divide">';
		var sq_mileText = '<div class="squaremiles-icon"></div>' + sq_mile + ' Square Miles <br /><br />';
		var footer = '<p class="grey">' + BANK_SQMI + ' Banks per Square Mile</p>';
				
		var popupContent = header + banksText + hr + sq_mileText + footer;
		
		thisPopup.setContent(popupContent);
		MY_MAP.map.addLayer(thisPopup);

		if (mainChart) {
			// reset all bars
			d3.select('#chartid svg g').selectAll('rect').classed({'bar': true, 'pinkbar': false, 'brightpinkbar': false});
			// select this bar clicked
			var boroSelector = feature.properties.Name.split(',');
			d3.selectAll('#chartid svg g rect[id*="'+boroSelector[1]+'"]').classed({'pinkbar': true, 'bar': false});
			d3.select('#chartid svg g rect[id="'+feature.properties.Name+'"]').classed({'brightpinkbar': true, 'bar': false});

			// show the legend
			var legendText;
			if (boroSelector[1] == ' MN') {
				legendText = "Manhattan Neighborhoods";
			} else if (boroSelector[1] == ' BX') {
				legendText = "Bronx Neighborhoods";
			} else if (boroSelector[1] == ' QNS') {
				legendText = "Queens Neighborhoods";
			} else if (boroSelector[1] == ' SI') {
				legendText = "Staten Island Neighborhoods";
			} else if (boroSelector[1] == ' BK') {
				legendText = "Brooklyn Neighborhoods";
			} else {}
			d3.select('.chartLegend text').text(legendText);
			d3.select('.chartLegend').classed({'show': true, 'hidden': false});
		}

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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
		
			//display popup
	        if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	        //get lat/long
	        if(($.inArray(feature.properties.Name,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
	    	}
			
	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}			
		}
    });
	
    layer.on('mouseout', function(ev) {
		//remove highlight for polygon
		layer.setStyle(noHighlight);		
		// close popup
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			MY_MAP.map.closePopup();
		}
    });
	
	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();

		// add popups as layers
		var thisPopup;
		if (MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			thisPopup = MY_MAP.popup3;
		} else {
			thisPopup = MY_MAP.popup2;
		}
		
		// bind popup with data to the feature
		thisPopup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
		// numerator
		var Pawnshops = feature.properties.Pawnshops;
		Pawnshops = Pawnshops.toFixed(0);
		// denominator
		var sq_mile = feature.properties.sq_mile;
		sq_mile = sq_mile.toFixed(2);
		// computed
		var PAWN_SQMI = feature.properties.PAWN_SQMI;
		PAWN_SQMI = PAWN_SQMI.toFixed(2);	
		// set to "No" if computed value is 0
		if (PAWN_SQMI == 0) {
			PAWN_SQMI = 'No';
		}
		
		
		var header = '<div class="map-popup"><h4 class="text-left">' + feature.properties.Name + '</h4>';
		var pawnShopsText = '<div class="pawnshop-icon"></div>' + Pawnshops + ' Pawn Shops<br />';
		var hr = '<hr class="divide">';
		var sq_mileText = '<div class="squaremiles-icon"></div>' + sq_mile + ' Square Miles <br /><br />';
		var footer = '<p class="grey">' + PAWN_SQMI + ' Pawn Shops per Square Mile</p>';
				
		var popupContent = header + pawnShopsText + hr + sq_mileText + footer;
		
		thisPopup.setContent(popupContent);
		MY_MAP.map.addLayer(thisPopup);

		if (mainChart) {
			// reset all bars
			d3.select('#chartid svg g').selectAll('rect').classed({'bar': true, 'pinkbar': false, 'brightpinkbar': false});
			// select this bar clicked
			var boroSelector = feature.properties.Name.split(',');
			d3.selectAll('#chartid svg g rect[id*="'+boroSelector[1]+'"]').classed({'pinkbar': true, 'bar': false});
			d3.select('#chartid svg g rect[id="'+feature.properties.Name+'"]').classed({'brightpinkbar': true, 'bar': false});

			// show the legend
			var legendText;
			if (boroSelector[1] == ' MN') {
				legendText = "Manhattan Neighborhoods";
			} else if (boroSelector[1] == ' BX') {
				legendText = "Bronx Neighborhoods";
			} else if (boroSelector[1] == ' QNS') {
				legendText = "Queens Neighborhoods";
			} else if (boroSelector[1] == ' SI') {
				legendText = "Staten Island Neighborhoods";
			} else if (boroSelector[1] == ' BK') {
				legendText = "Brooklyn Neighborhoods";
			} else {}
			d3.select('.chartLegend text').text(legendText);
			d3.select('.chartLegend').classed({'show': true, 'hidden': false});
		}

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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
		
			//display popup
	        if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	        //get lat/long
	        if(($.inArray(feature.properties.Name,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
	    	}
			
	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}			
		}
    });
	
    layer.on('mouseout', function(ev) {
		//remove highlight for polygon
		layer.setStyle(noHighlight);		
		// close popup
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			MY_MAP.map.closePopup();
		}
    });
	
	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();

		// add popups as layers
		var thisPopup;
		if (MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			thisPopup = MY_MAP.popup3;
		} else {
			thisPopup = MY_MAP.popup2;
		}
		
		// bind popup with data to the feature
		thisPopup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
		// numerator
		var McDonalds = feature.properties.McDonalds1;
		McDonalds = McDonalds.toFixed(0);
		// denominator
		var sq_mile = feature.properties.sq_mile;
		sq_mile = sq_mile.toFixed(2);
		// computed
		var McD_SQMI = feature.properties.McD_SQMI;
		McD_SQMI = McD_SQMI.toFixed(2);
		// set to "No" if computed value is 0
		if (McD_SQMI == 0) {
			McD_SQMI = 'No';
		}		
		
		var header = '<div class="map-popup"><h4 class="text-left">' + feature.properties.Name + '</h4>';
		var mcDonaldsText = '<div class="mcdonalds-icon"></div>' + McDonalds + ' McDonald\'s<br />';
		var hr = '<hr class="divide">';
		var sq_mileText = '<div class="squaremiles-icon"></div>' + sq_mile + ' Square Miles <br /><br />';
		var footer = '<p class="grey">' + McD_SQMI + ' McDonald\'s per Square Mile</p>';
				
		var popupContent = header + mcDonaldsText + hr + sq_mileText + footer;
		
		thisPopup.setContent(popupContent);
		MY_MAP.map.addLayer(thisPopup);

		if (mainChart) {
			// reset all bars
			d3.select('#chartid svg g').selectAll('rect').classed({'bar': true, 'pinkbar': false, 'brightpinkbar': false});
			// select this bar clicked
			var boroSelector = feature.properties.Name.split(',');
			d3.selectAll('#chartid svg g rect[id*="'+boroSelector[1]+'"]').classed({'pinkbar': true, 'bar': false});
			d3.select('#chartid svg g rect[id="'+feature.properties.Name+'"]').classed({'brightpinkbar': true, 'bar': false});

			// show the legend
			var legendText;
			if (boroSelector[1] == ' MN') {
				legendText = "Manhattan Neighborhoods";
			} else if (boroSelector[1] == ' BX') {
				legendText = "Bronx Neighborhoods";
			} else if (boroSelector[1] == ' QNS') {
				legendText = "Queens Neighborhoods";
			} else if (boroSelector[1] == ' SI') {
				legendText = "Staten Island Neighborhoods";
			} else if (boroSelector[1] == ' BK') {
				legendText = "Brooklyn Neighborhoods";
			} else {}
			d3.select('.chartLegend text').text(legendText);
			d3.select('.chartLegend').classed({'show': true, 'hidden': false});
		}

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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
		
			//display popup
	        if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	        //get lat/long
	        if(($.inArray(feature.properties.Name,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
	    	}
			
	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}			
		}
    });
	
    layer.on('mouseout', function(ev) {
		//remove highlight for polygon
		layer.setStyle(noHighlight);		
		// close popup
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			MY_MAP.map.closePopup();
		}
    });
	
	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();

		// add popups as layers
		var thisPopup;
		if (MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			thisPopup = MY_MAP.popup3;
		} else {
			thisPopup = MY_MAP.popup2;
		}
		
		// bind popup with data to the feature
		thisPopup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
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
		
		var header = '<div class="map-popup"><h4 class="text-left">' + feature.properties.Name + '</h4>';
		var householdsText = '<div class="households-icon"></div>' + Households + ' Households<br />';
		var hr = '<hr class="divide">';
		var pawnShopsText = '<div class="pawnshop-icon"></div>' + Pawnshops + ' Pawn Shops + <br />';
		var checkCashText = '<div class="checkcashing-icon"></div>' + CheckCash + ' Check Cashing + <br />';
		var moneyTransText = '<div class="wiretransfer-icon"></div>' + MoneyTrans + ' Wire Transfer <br /><br />';
		if (feature.properties.AFS_Sum == 0) {
			var footer = '<p class="grey">The Ratio is Undefined</p>';
		} else if (feature.properties.HH_AFS == -1){
			var footer = '<p class="grey">No Households per Alternative Financial Institution</p>';			
		} else {
			var footer = '<p class="grey">' + HH_AFS + ' Households per Alternative Financial Institution</p>';			
		}
				
		var popupContent = header + householdsText + hr + pawnShopsText + checkCashText + moneyTransText + footer;
		
		thisPopup.setContent(popupContent);
		MY_MAP.map.addLayer(thisPopup);
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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
		
			//display popup
	        if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	        //get lat/long
	        if(($.inArray(feature.properties.Name,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
	    	}
			
	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}			
		}
    });
	
    layer.on('mouseout', function(ev) {
		//remove highlight for polygon
		layer.setStyle(noHighlight);		
		// close popup
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			MY_MAP.map.closePopup();
		}
    });
	
	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();

		// add popups as layers
		var thisPopup;
		if (MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			thisPopup = MY_MAP.popup3;
		} else {
			thisPopup = MY_MAP.popup2;
		}
		
		// bind popup with data to the feature
		thisPopup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
		// numerator
		var Households = feature.properties.Households;
		Households = accounting.formatNumber(Households, 0, ",", "");
		// denominator
		var Banks = feature.properties.Banks;
		Banks = Banks.toFixed(0);
		// computed
		var HH_BANK = feature.properties.HH_BANK;
		HH_BANK = accounting.formatNumber(HH_BANK, 2, ",", ".");
		
		var header = '<div class="map-popup"><h4 class="text-left">' + feature.properties.Name + '</h4>';
		var householdsText = '<div class="households-icon"></div>' + Households + ' Households<br />';
		var hr = '<hr class="divide">';
		var banksText = '<div class="banks-icon"></div>' + Banks + ' Banks<br /><br />';
		if (feature.properties.Banks == 0) {
			var footer = '<p class="grey">The Ratio is Undefined</p>';
		} else if (feature.properties.HH_BANK == -1){
			var footer = '<p class="grey">No Households per Alternative Financial Institution</p>';			
		} else {
			var footer = '<p class="grey">' + HH_BANK + ' Households per Bank</p>';			
		}
				
		var popupContent = header + householdsText + hr + banksText + footer;
		
		thisPopup.setContent(popupContent);
		MY_MAP.map.addLayer(thisPopup);
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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
		
			//display popup
	        if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	        //get lat/long
	        if(($.inArray(feature.properties.Name,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
	    	}
			
	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}			
		}
    });
	
    layer.on('mouseout', function(ev) {
		//remove highlight for polygon
		layer.setStyle(noHighlight);		
		// close popup
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			MY_MAP.map.closePopup();
		}
    });
	
	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();
		
		// add popups as layers
		var thisPopup;
		if (MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			thisPopup = MY_MAP.popup3;
		} else {
			thisPopup = MY_MAP.popup2;
		}

		// bind popup with data to the feature
		thisPopup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
		// numerator
		var Households = feature.properties.Households;
		Households = accounting.formatNumber(Households, 0, ",", "");
		// denominator
		var McDonalds = feature.properties.McDonalds1;
		McDonalds = McDonalds.toFixed(0);
		// computed
		var HH_McD = feature.properties.HH_McD;
		HH_McD = accounting.formatNumber(HH_McD, 2, ",", ".");
				
		var header = '<div class="map-popup"><h4 class="text-left">' + feature.properties.Name + '</h4>';
		var householdsText = '<div class="households-icon"></div>' + Households + ' Households<br />';
		var hr = '<hr class="divide">';
		var mcDonaldsText = '<div class="mcdonalds-icon"></div>' + McDonalds + ' McDonald\'s<br /><br />';
		if (feature.properties.McDonalds1 == 0) {
			var footer = '<p class="grey">The Ratio is Undefined</p>';
		} else if (feature.properties.HH_McD == -1){
			var footer = '<p class="grey">No Households per McDonald\'s</p>';			
		} else {
			var footer = '<p class="grey">' + HH_McD + ' Households per McDonald\'s</p>';			
		}
				
		var popupContent = header + householdsText + hr + mcDonaldsText + footer;
		
		thisPopup.setContent(popupContent);
		MY_MAP.map.addLayer(thisPopup);
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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
		
			//display popup
	        if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	        //get lat/long
	        if(($.inArray(feature.properties.Name,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
	    	}
			
	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}			
		}
    });
	
    layer.on('mouseout', function(ev) {
		//remove highlight for polygon
		layer.setStyle(noHighlight);		
		// close popup
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			MY_MAP.map.closePopup();
		}
    });
	
	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();

		// add popups as layers
		var thisPopup;
		if (MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			thisPopup = MY_MAP.popup3;
		} else {
			thisPopup = MY_MAP.popup2;
		}
		
		// bind popup with data to the feature
		thisPopup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
		// numerator
		var Households = feature.properties.Households;
		Households = accounting.formatNumber(Households, 0, ",", "");
		// denominator
		var Pawnshops = feature.properties.Pawnshops;
		Pawnshops = Pawnshops.toFixed(0);
		// computed
		var HH_PAWN = feature.properties.HH_PAWN;
		HH_PAWN = accounting.formatNumber(HH_PAWN, 2, ",", ".");
		
		var header = '<div class="map-popup"><h4 class="text-left">' + feature.properties.Name + '</h4>';
		var householdsText = '<div class="households-icon"></div>' + Households + ' Households<br />';
		var hr = '<hr class="divide">';
		var pawnShopsText = '<div class="pawnshop-icon"></div>' + Pawnshops + ' Pawn Shops<br /><br />';
		if (feature.properties.Pawnshops == 0) {
			var footer = '<p class="grey">The Ratio is Undefined</p>';
		} else if (feature.properties.HH_PAWN == -1){
			var footer = '<p class="grey">No Households per Pawn Shop</p>';			
		} else {
			var footer = '<p class="grey">' + HH_PAWN + ' Households per Pawn Shop</p>';			
		}
						
		var popupContent = header + householdsText + hr + pawnShopsText + footer;
		
		thisPopup.setContent(popupContent);
		MY_MAP.map.addLayer(thisPopup);
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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
		
			//display popup
	        if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	        //get lat/long
	        if(($.inArray(feature.properties.Name,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
	    	}
			
	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}			
		}
    });
	
    layer.on('mouseout', function(ev) {
		//remove highlight for polygon
		layer.setStyle(noHighlight);		
		// close popup
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			MY_MAP.map.closePopup();
		}
    });
	
	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();

		// add popups as layers
		var thisPopup;
		if (MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			thisPopup = MY_MAP.popup3;
		} else {
			thisPopup = MY_MAP.popup2;
		}
		
		// bind popup with data to the feature
		thisPopup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
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
		
		var header = '<div class="map-popup"><h4 class="text-left">' + feature.properties.Name + '</h4>';
		var pawnShopsText = '<div class="pawnshop-icon"></div>' + Pawnshops + ' Pawn Shops + <br />';
		var checkCashText = '<div class="checkcashing-icon"></div>' + CheckCash + ' Check Cashing + <br />';
		var moneyTransText = '<div class="wiretransfer-icon"></div>' + MoneyTrans + ' Wire Transfer <br />';
		var hr = '<hr class="divide">';
		var banksText = '<div class="banks-icon"></div>' + Banks + ' Banks<br /><br />';
		if (feature.properties.Banks == 0) {
			var footer = '<p class="grey">The Ratio is Undefined</p>';
		} else if (feature.properties.AFS_BANK == -1){
			var footer = '<p class="grey">No Alternative Financial Institutions per Bank</p>';			
		} else {
			var footer = '<p class="grey">' + AFS_BANK + ' Alternative Financial Institutions per Bank</p>';			
		}
				
		var popupContent = header + pawnShopsText + checkCashText + moneyTransText + hr + banksText + footer;
		
		thisPopup.setContent(popupContent);
		MY_MAP.map.addLayer(thisPopup);
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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
		
			//display popup
	        if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	        //get lat/long
	        if(($.inArray(feature.properties.Name,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
	    	}
			
	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}			
		}
    });
	
    layer.on('mouseout', function(ev) {
		//remove highlight for polygon
		layer.setStyle(noHighlight);		
		// close popup
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			MY_MAP.map.closePopup();
		}
    });
	
	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();

		// add popups as layers
		var thisPopup;
		if (MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			thisPopup = MY_MAP.popup3;
		} else {
			thisPopup = MY_MAP.popup2;
		}
		
		// bind popup with data to the feature
		thisPopup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
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

		var header = '<div class="map-popup"><h4 class="text-left">' + feature.properties.Name + '</h4>';
		var banksText = '<div class="banks-icon"></div>' + Banks + ' Banks<br />';
		var hr = '<hr class="divide">';
		var pawnShopsText = '<div class="pawnshop-icon"></div>' + Pawnshops + ' Pawn Shops + <br />';
		var checkCashText = '<div class="checkcashing-icon"></div>' + CheckCash + ' Check Cashing + <br />';
		var moneyTransText = '<div class="wiretransfer-icon"></div>' + MoneyTrans + ' Wire Transfer <br /><br />';
		if (feature.properties.AFS_Sum == 0) {
			var footer = '<p class="grey">The Ratio is Undefined</p>';
		} else if (feature.properties.BANK_AFS == -1){
			var footer = '<p class="grey">No Banks per Alternative Financial Institution</p>';			
		} else {
			var footer = '<p class="grey">' + BANK_AFS + ' Banks per Alternative Financial Institution</p>';			
		}
				
		var popupContent = header + banksText + hr + pawnShopsText + checkCashText + moneyTransText + footer;
		
		thisPopup.setContent(popupContent);
		MY_MAP.map.addLayer(thisPopup);
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
			
	// load layers
	this.MAP1_POP_POVERTY = omnivore.topojson(neighborhoods, null, this.MAP1_POP_POVERTY_style);
	this.MAP2_MED_HH_INCOME = omnivore.topojson(neighborhoods, null, this.MAP2_MED_HH_INCOME_style);
	this.MAP3_PCT_UNEMPLOYED = omnivore.topojson(neighborhoods, null, this.MAP3_PCT_UNEMPLOYED_style);
	this.MAP4_PCT_FOREIGN_BORN = omnivore.topojson(neighborhoods, null, this.MAP4_PCT_FOREIGN_BORN_style).on('ready', function() {
		$("body").removeClass("loading");
    });
	
	//flag to indicate that other map layers have been loaded
	layersLoaded = true;
		
}

CityDigitsMap.prototype.loadCreateMapLayers = function (callBack){
    var self = this;
			
	// load topoJSON data for neighborhoods
	// path to neighborhoods defined in index.html django template

	// define layer styles and oneachfeature popup styling
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
	this.CREATEMAP1_AFI_PER_SQMILE = omnivore.topojson(neighborhoods, null, this.CREATEMAP1_AFI_PER_SQMILE_style);
	this.CREATEMAP2_BANKS_PER_SQMILE = omnivore.topojson(neighborhoods, null, this.CREATEMAP2_BANKS_PER_SQMILE_style);
	this.CREATEMAP3_PAWN_SHOPS_PER_SQMILE = omnivore.topojson(neighborhoods, null, this.CREATEMAP3_PAWN_SHOPS_PER_SQMILE_style);
	this.CREATEMAP4_MCDONALDS_PER_SQMILE = omnivore.topojson(neighborhoods, null, this.CREATEMAP4_MCDONALDS_PER_SQMILE_style);
	this.CREATEMAP5_HH_PER_AFI = omnivore.topojson(neighborhoods, null, this.CREATEMAP5_HH_PER_AFI_style);
	this.CREATEMAP6_HH_PER_BANK = omnivore.topojson(neighborhoods, null, this.CREATEMAP6_HH_PER_BANK_style);
	this.CREATEMAP7_HH_PER_MCDONALDS = omnivore.topojson(neighborhoods, null, this.CREATEMAP7_HH_PER_MCDONALDS_style);
	this.CREATEMAP8_HH_PER_PAWN_SHOP = omnivore.topojson(neighborhoods, null, this.CREATEMAP8_HH_PER_PAWN_SHOP_style);
	this.CREATEMAP9_AFIS_PER_BANK = omnivore.topojson(neighborhoods, null, this.CREATEMAP9_AFIS_PER_BANK_style);
	// remove modal after loading the last layer
	this.CREATEMAP10_BANKS_PER_AFI = omnivore.topojson(neighborhoods, null, this.CREATEMAP10_BANKS_PER_AFI_style).on('ready', function() {
		$("body").removeClass("loading");
    });
	
	createMapLoaded = true;
	
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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			// close all popups first
			MY_MAP.map.closePopup();
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="pawnshop-icon"></div>Pawn Shop<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p><p>'+ feature.properties.city + '</p></div>');
		
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
		//highlight point
		layer.setStyle(highlight);		
		
		// only have on mousemove work if popup2 isn't open
		console.log($.inArray(feature.properties.name,open_tooltips));
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	        //get lat/long
	        if(($.inArray(feature.properties.name,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="pawnshop-icon"></div>Pawn Shop<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p><p>'+ feature.properties.city + '</p></div>');
	    	}

	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.name,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}
						
		}
    });
	
    layer.on('mouseout', function(ev) {
		//highlight point
		layer.setStyle(noHighlight);
		
		// close popup
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			MY_MAP.map.closePopup();
		}
				
    });

	
	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();
		
		// bind popup with data to the feature
		MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
		MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="pawnshop-icon"></div>Pawn Shop<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p><p>'+ feature.properties.city + '</p></div>');

		// open popup
		MY_MAP.popup.openOn(MY_MAP.map);

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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			// close all popups first
			MY_MAP.map.closePopup();
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="checkcashing-icon"></div>Check Cashing<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p><p>'+ feature.properties.city + '</p></div>');
		
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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	        //get lat/long
	        if(($.inArray(feature.properties.name,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="checkcashing-icon"></div>Check Cashing<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p><p>'+ feature.properties.city + '</p></div>');
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
		
		// close popup
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			MY_MAP.map.closePopup();
		}
				
    });
	
	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();
		
		// bind popup with data to the feature
		MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
		MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="checkcashing-icon"></div>Check Cashing<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p><p>'+ feature.properties.city + '</p></div>');

		// open popup
		MY_MAP.popup.openOn(MY_MAP.map);

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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			// close all popups first
			MY_MAP.map.closePopup();
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="wiretransfer-icon"></div>Wire Transfer<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p><p>'+ feature.properties.city + '</p></div>');
		
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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	        //get lat/long
	        if(($.inArray(feature.properties.name,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="wiretransfer-icon"></div>Wire Transfer<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p><p>'+ feature.properties.city + '</p></div>');
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
		
		// close popup
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			MY_MAP.map.closePopup();
		}
				
    });

	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();
		
		// bind popup with data to the feature
		MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
		MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="wiretransfer-icon"></div>Wire Transfer<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p><p>'+ feature.properties.city + '</p></div>');

		// open popup
		MY_MAP.popup.openOn(MY_MAP.map);

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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			// close all popups first
			MY_MAP.map.closePopup();
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="banks-icon"></div>Bank<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p><p>'+ feature.properties.city + '</p></div>');
		
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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	        //get lat/long
	        if(($.inArray(feature.properties.name,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="banks-icon"></div>Bank<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p><p>'+ feature.properties.city + '</p></div>');
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
		
		// close popup
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			MY_MAP.map.closePopup();
		}
				
    });

	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();
		
		// bind popup with data to the feature
		MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
		MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="banks-icon"></div>Bank<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p><p>'+ feature.properties.city + '</p></div>');

		// open popup
		MY_MAP.popup.openOn(MY_MAP.map);

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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			// close all popups first
			MY_MAP.map.closePopup();
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="mcdonalds-icon"></div>McDonald\'s<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p><p>'+ feature.properties.city + '</p></div>');
		
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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	        //get lat/long
	        if(($.inArray(feature.properties.name,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="mcdonalds-icon"></div>McDonald\'s<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p><p>'+ feature.properties.city + '</p></div>');
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
		
		// close popup
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			MY_MAP.map.closePopup();
		}
				
    });

	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();
		
		// bind popup with data to the feature
		MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
		MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="mcdonalds-icon"></div>McDonald\'s<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p><p>'+ feature.properties.city + '</p></div>');

		// open popup
		MY_MAP.popup.openOn(MY_MAP.map);

	});
	
}

CityDigitsMap.onEachFeatureFor_LOC6_SUBWAY_LINES = function(feature,layer){
	// for colors, break Line up into an array
	var lineArray = feature.properties.Line.split('-');
	// take the first value of that array and set the color
	var color;
	if (lineArray[0] == 'A' || lineArray[0] == 'C' || lineArray[0] == 'E') {
		color = '#2850AD';
	}
	if (lineArray[0] == 'B' || lineArray[0] == 'D' || lineArray[0] == 'F' || lineArray[0] == 'M') {
		color = '#FF6319';
	}
	if (lineArray[0] == 'G') {
		color = '#6CBE45';
	}
	if (lineArray[0] == 'J' || lineArray[0] == 'Z') {
		color = '#996633';
	}
	if (lineArray[0] == 'L') {
		color = '#A7A9AC';
	}
	if (lineArray[0] == 'N' || lineArray[0] == 'Q' || lineArray[0] == 'R') {
		color = '#FCCC0A';
	}
	if (lineArray[0] == '1' || lineArray[0] == '2' || lineArray[0] == '3') {
		color = '#EE352E';
	}
	if (lineArray[0] == '4' || lineArray[0] == '5' || lineArray[0] == '6') {
		color = '#00933C';
	}
	if (lineArray[0] == '7') {
		color = '#B933AD';
	}

	var highlight = {
		color: color
	}
	var noHighlight = {
		color: "#9c9c9c"
	};


    //add on hover -- same on hover and mousemove for each layer
    layer.on('mouseover', function(ev) {

    	// only have on mouseover work if popup2 isn't open
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			// close all popups first
			MY_MAP.map.closePopup();
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">Subway Lines<h4>' + feature.properties.Line + '</h4><p>'+ feature.properties.Street + '</p></div>');
		
			//display popup
	        if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.Line,open_tooltips)<0)){
	            MY_MAP.popup.openOn(MY_MAP.map);
	        }else{
	            MY_MAP.map.closePopup();
	        }		
		}

 		//highlight 
		layer.setStyle(highlight);		
   				
    });
	
    layer.on('mousemove', function(ev) {

		// only have on mousemove work if popup2 isn't open
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	        //get lat/long
	        if(($.inArray(feature.properties.Line,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">Subway Lines<h4>' + feature.properties.Line + '</h4><p>'+ feature.properties.Street + '</p></div>');
	    	}

	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.Line,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}			
		}

 		//highlight 
		layer.setStyle(highlight);		

    });
	
    layer.on('mouseout', function(ev) {
		//highlight point
		layer.setStyle(noHighlight);

		// close popup
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			MY_MAP.map.closePopup();
		}
		
    });
	
	
}

CityDigitsMap.onEachFeatureFor_NYC_BORO_LAYER = function(feature,layer){

	var highlight = {
	    weight: 5,
	};
	var noHighlight = {
        weight: 3,
	};
	
    //add on hover -- same on hover and mousemove for each layer
    layer.on('mouseover', function(ev) {
		// only have on mouseover work if popup2 isn't open
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	    	MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
			MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.BORONAME + '</div>');
		
			//display popup
	        if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.BORONAME,open_tooltips)<0)){
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
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
	        //get lat/long
	        if(($.inArray(feature.properties.BORONAME,open_tooltips)<0)){
				MY_MAP.popup.setLatLng(MY_MAP.map.layerPointToLatLng(ev.layerPoint));
				MY_MAP.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.BORONAME + '</div>');
	    	}

	        //display popup
			if (!MY_MAP.popup._isOpen && ($.inArray(feature.properties.BORONAME,open_tooltips)<0)){
				MY_MAP.popup.openOn(MY_MAP.map);
			}			
		}
    });
	
    layer.on('mouseout', function(ev) {
		//remove highlight for polygon
		layer.setStyle(noHighlight);
		// close popup
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			MY_MAP.map.closePopup();
		}
		
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
	this.NYC_BORO_LAYER = null;

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
	this.NYC_BORO_LAYER_style = L.geoJson(null, {
		style: CityDigitsMap.getStyleFor_NYC_BORO_LAYER_style,
		onEachFeature: CityDigitsMap.onEachFeatureFor_NYC_BORO_LAYER
	});	
	
	// load layers
	this.LOC1_PAWN_SHOPS = omnivore.csv(PawnShops, null, this.LOC1_PAWN_SHOPS_style);
	this.LOC2_CHECK_CASHING = omnivore.csv(CheckCashing, null, this.LOC2_CHECK_CASHING_style);
	this.LOC3_WIRE_TRANSFER = omnivore.csv(MoneyTransferServices, null, this.LOC3_WIRE_TRANSFER_style);
	this.LOC4_BANKS = omnivore.csv(CommercialBanks, null, this.LOC4_BANKS_style);
	this.LOC5_MCDONALDS = omnivore.csv(Mcdonalds, null, this.LOC5_MCDONALDS_style);
	this.LOC6_SUBWAY_LINES = omnivore.geojson(SubwayLines, null, this.LOC6_SUBWAY_LINES_style);
	this.LOC7_SUBWAY_STATIONS = omnivore.geojson(SubwayStations, null, this.LOC7_SUBWAY_STATIONS_style);
	this.NYC_BORO_LAYER = omnivore.topojson(nyc_boro, null, this.NYC_BORO_LAYER_style);
}

CityDigitsMap.getStyleFor_LOC1_PAWN_SHOPS = function (feature, latlng){
	var pawnShopMarker = L.circleMarker(latlng, {
		radius: 4,
		stroke: false,
		fillColor: '#eb4a42',
		fillOpacity: 1
	});
	
	return pawnShopMarker;
	
}

CityDigitsMap.getStyleFor_LOC2_CHECK_CASHING = function (feature, latlng){
	var checkCashingMarker = L.circleMarker(latlng, {
		radius: 4,
		stroke: false,
		fillColor: '#ffa77f',
		fillOpacity: 1
	});
	
	return checkCashingMarker;
	
}

CityDigitsMap.getStyleFor_LOC3_WIRE_TRANSFER = function (feature, latlng){
	var wireTransferMarker = L.circleMarker(latlng, {
		radius: 4,
		stroke: false,
		fillColor: '#fa8a12',
		fillOpacity: 1
	});
	
	return wireTransferMarker;
	
}

CityDigitsMap.getStyleFor_LOC4_BANKS = function (feature, latlng){
	var banksMarker = L.circleMarker(latlng, {
		radius: 4,
		stroke: false,
		fillColor: '#fa8aa3',
		fillOpacity: 1
	});
	
	return banksMarker;
	
}

CityDigitsMap.getStyleFor_LOC5_MCDONALDS = function (feature, latlng){
	var mcdonaldsMarker = L.circleMarker(latlng, {
		radius: 4,
		stroke: false,
		fillColor: '#ebcf42',
		fillOpacity: 1
	});
	
	return mcdonaldsMarker;
	
}

CityDigitsMap.getStyleFor_LOC6_SUBWAY_LINES = function (feature, layer){
	var subwayLinesInitialStyle = {
	    color: "#9c9c9c",
	    weight: 3,
	    opacity: 1
	};
	
	return subwayLinesInitialStyle;
	
}

CityDigitsMap.getStyleFor_LOC7_SUBWAY_STATIONS = function (feature, latlng){
	var subwayStationInitialStyle = L.circleMarker(latlng, {
	    radius: 0,
	    weight: 0,
	    fillOpacity: 1
	});
	
	return subwayStationInitialStyle;
	
}

CityDigitsMap.getStyleFor_NYC_BORO_LAYER_style = function (feature){
	var nycboroInitialStyle = {
		weight: 3,
		color: '#939393', 
		fillColor: '#fff',
		fillOpacity: 0.4
	};
	
	return nycboroInitialStyle;
	
}


CityDigitsMap.onEachFeatureFor_MEDIA_IMAGES = function(feature, layer){

    //add on hover -- same on hover and mousemove for each layer
    layer.on('mouseover', function(ev) {
		// only have on mouseover work if popup2 isn't open
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			// close all popups first
			MY_MAP.map.closePopup();
		}
    });
		
	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();

		// add popups as layers
		var thisPopup;
		if (MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			thisPopup = MY_MAP.popup3;
		} else {
			thisPopup = MY_MAP.popup2;
		}
		
		var lat = feature.geometry.coordinates[1];
		var lng = feature.geometry.coordinates[0];
		
		// set latlng variable
		var latlng = L.latLng(lat, lng);
		// bind popup with data to the feature
		thisPopup.setLatLng(latlng);

		var header = '<div class="map-popup"><a href="/cashcity/media/image/' + feature.properties.id + '/" style="text-decoration:none; color:inherit"><h4 class="text-left">' + feature.properties.section + '</h4>';
		var mediaBox = '<div style="width: 100%; margin: auto; overflow: hidden;"><img src="' + feature.properties.image + '"></div>';
		var title = '<div style="margin-top: 5px"><p class="text-left">' + feature.properties.name + '</p></div></a>';
		var footer = '</div>';
				
		var popupContent = header + mediaBox + title + footer;
		
		thisPopup.setContent(popupContent);
		MY_MAP.map.addLayer(thisPopup);
	});
	
}

CityDigitsMap.onEachFeatureFor_MEDIA_AUDIO = function(feature, layer){

    //add on hover -- same on hover and mousemove for each layer
    layer.on('mouseover', function(ev) {
		// only have on mouseover work if popup2 isn't open
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			// close all popups first
			MY_MAP.map.closePopup();
		}
    });
		
	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();

		// add popups as layers
		var thisPopup;
		if (MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			thisPopup = MY_MAP.popup3;
		} else {
			thisPopup = MY_MAP.popup2;
		}

		var lat = feature.geometry.coordinates[1];
		var lng = feature.geometry.coordinates[0];
		
		// set latlng variable
		var latlng = L.latLng(lat, lng);
		// bind popup with data to the feature
		thisPopup.setLatLng(latlng);
		
		var header = '<div class="map-popup"><a href="/cashcity/media/audio/' + feature.properties.id + '/" style="text-decoration:none; color:inherit"><h4 class="text-left">' + feature.properties.section + '</h4></a>';
		var mediaBox = '<div style="margin-right: auto; margin-left: auto; margin-top: 10px;"><audio style="width: 100%;" src="' + feature.properties.audio + '" preload="auto" controls></audio></div>';
		var title = '<a href="/cashcity/media/audio/' + feature.properties.id + '/" style="text-decoration:none; color:inherit"><div style="margin-top: 5px"><p class="text-left">' + feature.properties.name + '</p></div></a>';
		var footer = '</div>';
				
		var popupContent = header + mediaBox + title + footer;
		
		thisPopup.setContent(popupContent);
		MY_MAP.map.addLayer(thisPopup);

	});
	
}

CityDigitsMap.onEachFeatureFor_MEDIA_NOTE = function(feature, layer){

    //add on hover -- same on hover and mousemove for each layer
    layer.on('mouseover', function(ev) {
		// only have on mouseover work if popup2 isn't open
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			// close all popups first
			MY_MAP.map.closePopup();
		}
    });
		
	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();

		// add popups as layers
		var thisPopup;
		if (MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			thisPopup = MY_MAP.popup3;
		} else {
			thisPopup = MY_MAP.popup2;
		}
		
		var lat = feature.geometry.coordinates[1];
		var lng = feature.geometry.coordinates[0];
		
		// set latlng variable
		var latlng = L.latLng(lat, lng);
		// bind popup with data to the feature
		thisPopup.setLatLng(latlng);

		var header = '<div class="map-popup"><a href="/cashcity/media/note/' + feature.properties.id + '/" style="text-decoration:none; color:inherit"><h4 class="text-left">' + feature.properties.section + '</h4>';
		var title = '<div style="margin-top: 5px"><p class="text-left">' + feature.properties.name + '</p></div>';
		var mediaBox = '<p class="text-left">' + feature.properties.notes + '</p></a>';
		var footer = '</div>';
				
		var popupContent = header + title + mediaBox + footer;
		
		thisPopup.setContent(popupContent);
		MY_MAP.map.addLayer(thisPopup);
	});
	
}

CityDigitsMap.onEachFeatureFor_MEDIA_INTERVIEW = function(feature, layer){

    //add on hover -- same on hover and mousemove for each layer
    layer.on('mouseover', function(ev) {
		// only have on mouseover work if popup2 isn't open
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			// close all popups first
			MY_MAP.map.closePopup();
		}
    });
		
	// add on click popups for each layer -- these will be different
	layer.on("click",function(ev){
		// close all open popups
		MY_MAP.map.closePopup();

		// add popups as layers
		var thisPopup;
		if (MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			thisPopup = MY_MAP.popup3;
		} else {
			thisPopup = MY_MAP.popup2;
		}
	
		var lat = feature.geometry.coordinates[1];
		var lng = feature.geometry.coordinates[0];
		
		// set latlng variable
		var latlng = L.latLng(lat, lng);
		// bind popup with data to the feature
		thisPopup.setLatLng(latlng);

		var header = '<div class="map-popup"><a href="/cashcity/media/interview/' + feature.properties.id + '/" style="text-decoration:none; color:inherit"><h4 class="text-left">' + feature.properties.section + '</h4>';
		var mediaBox = '<div style="width: 100%; margin: auto; overflow: hidden;"><img src="' + feature.properties.image + '"></div></a><div style="margin-right: auto; margin-left: auto; margin-top: 10px;"><audio style="width: 100%;" src="' + feature.properties.audio + '" preload="auto" controls></audio></div>';
		var title = '<a href="/cashcity/media/interview/' + feature.properties.id + '/" style="text-decoration:none; color:inherit"><div style="margin-top: 5px"><p class="text-left">' + feature.properties.name + '</p></div></a>';
		var footer = '</div>';
				
		var popupContent = header + mediaBox + title + footer;
		
		thisPopup.setContent(popupContent);
		MY_MAP.map.addLayer(thisPopup);
	});
	
}

CityDigitsMap.prototype.loadMedia = function(){
				
	this.MEDIA_IMAGES = null;
	this.MEDIA_AUDIO = null;
	this.MEDIA_NOTE = null;
	this.MEDIA_INTERVIEW = null;

	// define layer styles and oneachfeature popup styling
	this.MEDIA_IMAGES = L.geoJson(mediaImageGeojson, {
		pointToLayer: CityDigitsMap.getStyleFor_MEDIA,
		onEachFeature: CityDigitsMap.onEachFeatureFor_MEDIA_IMAGES
	});
	// define layer styles and oneachfeature popup styling
	this.MEDIA_AUDIO = L.geoJson(mediaAudioGeojson, {
		pointToLayer: CityDigitsMap.getStyleFor_MEDIA,
		onEachFeature: CityDigitsMap.onEachFeatureFor_MEDIA_AUDIO
	});
	// define layer styles and oneachfeature popup styling
	this.MEDIA_NOTE = L.geoJson(mediaNoteGeojson, {
		pointToLayer: CityDigitsMap.getStyleFor_MEDIA,
		onEachFeature: CityDigitsMap.onEachFeatureFor_MEDIA_NOTE
	});
	// define layer styles and oneachfeature popup styling
	this.MEDIA_INTERVIEW = L.geoJson(mediaInterviewGeojson, {
		pointToLayer: CityDigitsMap.getStyleFor_MEDIA,
		onEachFeature: CityDigitsMap.onEachFeatureFor_MEDIA_INTERVIEW
	});	
	
	// add media to cluster library
	clusterMedia.addLayer(this.MEDIA_IMAGES);
	clusterMedia.addLayer(this.MEDIA_AUDIO);
	clusterMedia.addLayer(this.MEDIA_NOTE);
	clusterMedia.addLayer(this.MEDIA_INTERVIEW);
	
}

CityDigitsMap.loadFilteredMediaImage = function(data){
	
	MY_MAP.MEDIA_IMAGES.addData(data);
	// add media to cluster library
	clusterMedia.addLayer(MY_MAP.MEDIA_IMAGES);

}

CityDigitsMap.loadFilteredMediaAudio = function(data){
	
	MY_MAP.MEDIA_AUDIO.addData(data);
	// add media to cluster library
	clusterMedia.addLayer(MY_MAP.MEDIA_AUDIO);

}

CityDigitsMap.loadFilteredMediaNote = function(data){
	
	MY_MAP.MEDIA_NOTE.addData(data);	
	// add media to cluster library
	clusterMedia.addLayer(MY_MAP.MEDIA_NOTE);

}

CityDigitsMap.loadFilteredMediaInterview = function(data){
	
	MY_MAP.MEDIA_INTERVIEW.addData(data);
	// add media to cluster library
	clusterMedia.addLayer(MY_MAP.MEDIA_INTERVIEW);

}


CityDigitsMap.getStyleFor_MEDIA = function(feature, latlng){
	var mediaImageIcon = L.icon({
	    iconUrl: feature.properties.iconUrl,
	    iconSize: [42, 50],
		iconAnchor: [17, 38], 
	});

	return L.marker(latlng, {icon: mediaImageIcon});
	
}


CityDigitsMap.loadLayerFor = function(layerId){
	// close all open popups in layers
	if (MY_MAP.map.hasLayer(MY_MAP.popup2)) {
		MY_MAP.map.removeLayer(MY_MAP.popup2);
	}

	if (MY_MAP.map.hasLayer(MY_MAP.popup3)) {
		MY_MAP.map.removeLayer(MY_MAP.popup3);
	}

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
			//CityDigitsMap.drawChartOnSwap();

			// remove chart
			if (mainChart) {
				CityDigitsMap.removeChart(layerId);
			}
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
			//CityDigitsMap.drawChartOnSwap();

			// remove chart
			if (mainChart) {
				CityDigitsMap.removeChart(layerId);
			}
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
				//CityDigitsMap.drawChartOnSwap();

				// remove chart
				if (mainChart) {
					CityDigitsMap.removeChart(layerId);
				}
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
				//CityDigitsMap.drawChartOnSwap();

				// remove chart
				if (mainChart) {
					CityDigitsMap.removeChart(layerId);
				}
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
				//CityDigitsMap.drawChartOnSwap();

				// remove chart
				if (mainChart) {
					CityDigitsMap.removeChart(layerId);
				}
    }
    if(layerId == "CREATEMAP10"){
        mainLayer = MY_MAP.CREATEMAP10_BANKS_PER_AFI;
		console.log(MY_MAP);
				mainLayer._leaflet_id = 'legendbanksperAFIs';
				mainLayer.addTo(MY_MAP.map).bringToBack();
				if ($( "#legendid" ).hasClass( "legendClosed" )) {
					// do nothing
				} else {
					// change to
					$('#legendid').attr('class', mainLayer._leaflet_id);	
				}
				// re-draw chart if open
				//CityDigitsMap.drawChartOnSwap();

				// remove chart
				if (mainChart) {
					CityDigitsMap.removeChart(layerId);
				}
    }

    // ensure NYC boro layer is at the back
    if (MY_MAP.map.hasLayer(MY_MAP.NYC_BORO_LAYER)) {
    	MY_MAP.NYC_BORO_LAYER.bringToBack();
    }

}

CityDigitsMap.prototype.showLocationsOnPageLoad = function(){
	
	// add AFIs to map			
	LOC1 = this.LOC1_PAWN_SHOPS.addTo(this.map);
	LOC2 = this.LOC2_CHECK_CASHING.addTo(this.map);
	LOC3 = this.LOC3_WIRE_TRANSFER.addTo(this.map);
	
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
		LOC6 = MY_MAP.LOC6_SUBWAY_LINES.addTo(MY_MAP.map).bringToBack();

		// ensure subway lines are above mainLayer layer 
	    if (MY_MAP.map.hasLayer(mainLayer)) {
	    	mainLayer.bringToBack();
	    }

		// ensure subway lines are above boro layer 
	    if (MY_MAP.map.hasLayer(MY_MAP.NYC_BORO_LAYER)) {
	    	MY_MAP.NYC_BORO_LAYER.bringToBack();
	    }
	
	}
	if (layerId == "NYC_BORO") {
		NYC_BORO = MY_MAP.NYC_BORO_LAYER.addTo(MY_MAP.map).bringToBack();
	}
	
}

CityDigitsMap.loadMediaLayers = function(){
		
	// set on mouseover interaction for cluster group
	clusterMedia.on('clustermouseover', function (ev) {
		// only have on mouseover work if popup2 isn't open
		if (!MY_MAP.map.hasLayer(MY_MAP.popup2)) {
			// close all popups first
			MY_MAP.map.closePopup();
		}
	});

	MY_MAP.map.addLayer(clusterMedia);
	
}

CityDigitsMap.removeLayerFor = function(layerId){
	// remove all popups first
	MY_MAP.map.closePopup();
	// close all open popups in layers
	if (MY_MAP.map.hasLayer(MY_MAP.popup2)) {
		MY_MAP.map.removeLayer(MY_MAP.popup2);
	}

	if (MY_MAP.map.hasLayer(MY_MAP.popup3)) {
		MY_MAP.map.removeLayer(MY_MAP.popup3);
	}
	// then remove layer
	MY_MAP.map.removeLayer( layerId ); 
}

CityDigitsMap.removeMediaLayers = function(){
	// remove all popups first
	MY_MAP.map.closePopup();
	// close all open popups in layers
	if (MY_MAP.map.hasLayer(MY_MAP.popup2)) {
		MY_MAP.map.removeLayer(MY_MAP.popup2);
	}

	if (MY_MAP.map.hasLayer(MY_MAP.popup3)) {
		MY_MAP.map.removeLayer(MY_MAP.popup3);
	}
	// then remove media layers
	MY_MAP.map.removeLayer(clusterMedia); 

}

CityDigitsMap.clearMediaLayers = function(){
	// clear data out of cluserMedia when users search by tag
	MY_MAP.MEDIA_IMAGES.clearLayers();	
	MY_MAP.MEDIA_AUDIO.clearLayers();	
	MY_MAP.MEDIA_NOTE.clearLayers();	
	MY_MAP.MEDIA_INTERVIEW.clearLayers();
	clusterMedia.clearLayers();	
	
}

CityDigitsMap.drawChart = function(layerId){		
	//set properties depending on layerid selected	
	if (layerId == 'legendpoverty') {
		var propertyName = 'PovertyPer';
		var formatter = d3.format(".0%");
		var title = 'Percent Population in Poverty';
		var yMin = 0;
	} 
	if (layerId == 'legendmedhhinc') {
		var propertyName = 'MedHouInco';
		var formatNumber = d3.format(",.0f");
		var formatter = function(d) { return "$" + formatNumber(d); };
		var title = 'Median Household Income';
		var yMin = 0;
	}
	if (layerId == 'legendunemploy') {
		var propertyName = 'UnempRate';
		var formatter = d3.format(".1%");
		var title = 'Percent Unemployed';
		var yMin = 0;
	} 
	if (layerId == 'legendforeignborn') {
		var propertyName = 'ForBornPer';
		var formatter = d3.format(".0%");
		var title = 'Percent Population Foreign Born';
		var yMin = 0;
	} 
	if (layerId == 'legendAFIpersqmi') {
		var propertyName = 'AFS_SQMI';
		var formatter = d3.format(",.2f")
		var title = 'Alternative Financial Insitutions per Square Mile';
		var yMin = -1;
	} 
	if (layerId == 'legendbankspersqmi') {
		var propertyName = 'BANK_SQMI';
		var formatter = d3.format(",.2f")
		var title = 'Banks per Square Mile';
		var yMin = -1;
	} 
	if (layerId == 'legendpawnsqmi') {
		var propertyName = 'PAWN_SQMI';
		var formatter = d3.format(",.2f")
		var title = 'Pawn Shops per Square Mile';
		var yMin = -1;
	} 
	if (layerId == 'legendmcdonaldspersqi') {
		var propertyName = 'McD_SQMI';
		var formatter = d3.format(",.2f")
		var title = 'McDonald\'s per Square Mile';
		var yMin = -1;
	} 
	if (layerId == 'legendhouseholdsperAFI') {
		if (mainChart) {
			CityDigitsMap.removeChart(layerId);
		}
		return false;
		/*
		var propertyName = 'HH_AFS';
		var formatter = d3.format(",.2f")
		var title = 'Households per Alternative Financial Insitution';
		var yMin = -500;
		*/
	} 
	if (layerId == 'legendhouseholdsperbank') {
		if (mainChart) {
			CityDigitsMap.removeChart(layerId);
		}
		return false;
		/*
		var propertyName = 'HH_BANK';
		var formatter = d3.format(",.2f")
		var title = 'Households per Bank';
		var yMin = -500;
		*/
	} 
	if (layerId == 'legendhouseholdsperMcD') {
		if (mainChart) {
			CityDigitsMap.removeChart(layerId);
		}
		return false;
		/*
		var propertyName = 'HH_McD';
		var formatter = d3.format(",.2f")
		var title = 'Households per McDonald\'s';
		var yMin = -500;
		*/
	} 
	if (layerId == 'legendhouseholdsperpawn') {
		if (mainChart) {
			CityDigitsMap.removeChart(layerId);
		}
		return false;
		/*
		var propertyName = 'HH_PAWN';
		var formatter = d3.format(",.2f")
		var title = 'Households per Pawn Shop';
		var yMin = -999;
		*/
	} 
	if (layerId == 'legendAFIsperbank') {
		if (mainChart) {
			CityDigitsMap.removeChart(layerId);
		}
		return false;
		/*
		var propertyName = 'AFS_BANK';
		var formatter = d3.format(",.2f")
		var title = 'Alternative Financial Insitutions per Bank';
		var yMin = -1;
		*/
	} 
	if (layerId == 'legendbanksperAFIs') {
		if (mainChart) {
			CityDigitsMap.removeChart(layerId);
		}
		return false;
		/*
		var propertyName = 'BANK_AFS';
		var formatter = d3.format(",.2f")
		var title = 'Banks per Alternative Financial Insitution';
		var yMin = -1;
		*/
	} 

	// remove chart a tag, which we repace with the svg drawn below
	$("#chart").remove();
	
	// change class of chartId div to enlarge and set background white
	$('#chartid').attr('class', 'chartDiv');	
	
	//set up container for mouseover interaction
	var div = d3.select("body").append("div")
	    .attr("class", "barchartTooltip")
	    .style("opacity", 1e-6);

	var margin = {top: 50, right: 20, bottom: 30, left: 70},
		width = 500 - margin.left - margin.right,
	    height = 300 - margin.top - margin.bottom;
	
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
	  var openedTopoJson = topojson.feature(data, data.objects.all_map_data_boundariesfixed_Nov13).features;
	  
	  // filter out over 1000 values for BANK_AFS and AFS_BANK to remove undefined values set in the data
	  if (propertyName == 'BANK_AFS' || propertyName == 'AFS_BANK') {
		  openedTopoJson = $.grep(openedTopoJson, function(d) {
		      return d.properties[propertyName] > -1 && d.properties[propertyName] <= 999;
		  });
	  }  

	  // filter out < -1s for household-level data
	  if (propertyName == 'HH_AFS' || propertyName == 'HH_BANK' || propertyName == 'HH_McD' || propertyName == 'HH_PAWN') {
		  openedTopoJson = $.grep(openedTopoJson, function(d) {
		      return d.properties[propertyName] > -1;
		  });
	  }  

	  	  
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
	  x.domain(openedTopoJson.map(function(d) { return d.properties.Name; }));
	  y.domain([yMin, d3.max(openedTopoJson, function(d) { return d.properties[propertyName]; })]);
	  
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
	      .attr("x", function(d) { return x(d.properties.Name); })
	      .attr("width", x.rangeBand())
	      .attr("y", function(d) { return y(d.properties[propertyName]); })
	      .attr("height", function(d) { return height - y(d.properties[propertyName]); })
		  .attr("id", function(d) { return d.properties.Name })
		  .on("click", function(d) {
			  CityDigitsMap.zoomToNeighborhoodAndPopup(d.properties.Name);
			  CityDigitsMap.highlightBars(d.properties.Name);
		  })
		  // set up on mouseover events
		  .on("mouseover", function(d) {
				//console.log(d);

			    div.transition()
			        .duration(250)
			        .style("opacity", 1);
					
			      div.html(
					'<h4 class="text-left">' + d.properties.Name + '</h4>' +
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
		  
	  var legend = svg.append("g")
	      .attr("class", "chartLegend hidden");

	  legend.append("text")
	      .attr("y", 240)
	      .attr("x", 150)
	      .style("text-anchor", "left");

	  legend.append("rect")
	  	  .attr("class", "pinkbarlegend")
	      .attr("y", 230)
	      .attr("x", 115)
	      .attr("width", 30)
	      .attr("height", 10)
	      .style("text-anchor", "left");
		  
		  
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
		// close the accordion menu
		$('.panel-collapse').removeClass('in');
		
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
		if (layer.feature.properties.Name == neighborhoodName) {
			// close all open popups
			MY_MAP.map.closePopup();
			// close all open popups in layers
			if (MY_MAP.map.hasLayer(MY_MAP.popup2)) {
				MY_MAP.map.removeLayer(MY_MAP.popup2);
			}

			if (MY_MAP.map.hasLayer(MY_MAP.popup3)) {
				MY_MAP.map.removeLayer(MY_MAP.popup3);
			}
			
			var bounds = layer.getBounds();
			MY_MAP.map.fitBounds(layer.getBounds(), {maxZoom: 13, paddingTopLeft:[700,200]});

			// bind popup with data to the feature
			var center = bounds.getCenter();
			MY_MAP.popup2.setLatLng(center);					
			
			// get popup content
			var layerId = mainLayer._leaflet_id;
			var popupContent = CityDigitsMap.setPopUpContent(layer, layerId);	
			
			MY_MAP.popup2.setContent(popupContent);
			MY_MAP.map.addLayer(MY_MAP.popup2);
			
		}
		 
	});
	
}

CityDigitsMap.highlightBars = function(neighborhoodName) {
	// reset all bars
	d3.select('#chartid svg g').selectAll('rect').classed({'bar': true, 'pinkbar': false, 'brightpinkbar': false});
	// select this bar clicked
	var boroSelector = neighborhoodName.split(',');
	d3.selectAll('#chartid svg g rect[id*="'+boroSelector[1]+'"]').classed({'pinkbar': true, 'bar': false});
	d3.select('#chartid svg g rect[id="'+neighborhoodName+'"]').classed({'brightpinkbar': true, 'bar': false});

	// show the legend
	var legendText;
	if (boroSelector[1] == ' MN') {
		legendText = "Manhattan Neighborhoods";
	} else if (boroSelector[1] == ' BX') {
		legendText = "Bronx Neighborhoods";
	} else if (boroSelector[1] == ' QNS') {
		legendText = "Queens Neighborhoods";
	} else if (boroSelector[1] == ' SI') {
		legendText = "Staten Island Neighborhoods";
	} else if (boroSelector[1] == ' BK') {
		legendText = "Brooklyn Neighborhoods";
	} else {}
	d3.select('.chartLegend text').text(legendText);
	d3.select('.chartLegend').classed({'show': true, 'hidden': false});
}

CityDigitsMap.setPopUpContent = function(layer,layerId) {
	// brute force setting popup content wehn clicking on D3 bar chart
	if (layerId == 'legendpoverty') {
		var percent = layer.feature.properties.PovertyPer * 100;
		percent = percent.toFixed(0);
		var popupContent = '<div class="map-popup"><h4 class="text-left">' + layer.feature.properties.Name + '</h4><p>' + percent + '%<br />Population in Poverty</p></div>';
	} 
	if (layerId == 'legendmedhhinc') {
		var MedHHInc = accounting.formatMoney(layer.feature.properties.MedHouInco, "$", 0, ",", "");
		var popupContent = '<div class="map-popup"><h4 class="text-left">' + layer.feature.properties.Name + '</h4><p>' + MedHHInc + '<br />Median Household Income</p></div>';
	}
	if (layerId == 'legendunemploy') {
		var percent = layer.feature.properties.UnempRate * 100;
		percent = percent.toFixed(1);
		var popupContent = '<div class="map-popup"><h4 class="text-left">' + layer.feature.properties.Name + '</h4><p>' + percent + '%<br />Percent Unemployed</p></div>';
	} 
	if (layerId == 'legendforeignborn') {
		var percent = layer.feature.properties.ForBornPer * 100;
		percent = percent.toFixed(0);
		var popupContent = '<div class="map-popup"><h4 class="text-left">' + layer.feature.properties.Name + '</h4><p>' + percent + '%<br />Population Foreign Born</p></div>';
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
		
		var header = '<div class="map-popup"><h4 class="text-left">' + layer.feature.properties.Name + '</h4>';
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
		
		var header = '<div class="map-popup"><h4 class="text-left">' + layer.feature.properties.Name + '</h4>';
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
		
		var header = '<div class="map-popup"><h4 class="text-left">' + layer.feature.properties.Name + '</h4>';
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
		
		var header = '<div class="map-popup"><h4 class="text-left">' + layer.feature.properties.Name + '</h4>';
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
		
		var header = '<div class="map-popup"><h4 class="text-left">' + layer.feature.properties.Name + '</h4>';
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
		
		var header = '<div class="map-popup"><h4 class="text-left">' + layer.feature.properties.Name + '</h4>';
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
		
		var header = '<div class="map-popup"><h4 class="text-left">' + layer.feature.properties.Name + '</h4>';
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
		
		var header = '<div class="map-popup"><h4 class="text-left">' + layer.feature.properties.Name + '</h4>';
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
		
		var header = '<div class="map-popup"><h4 class="text-left">' + layer.feature.properties.Name + '</h4>';
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
		var header = '<div class="map-popup"><h4 class="text-left">' + layer.feature.properties.Name + '</h4>';
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
	
	
