/* 
* Functions to create a generic City Digits map 
*/

function CityDigitsMapOpinion(id, lat, lon, zoom) {
    //initial values
    this.neighborhoodLayer = null;
	this.markerLayer = null;
	var topojsonLayer = null;
	
    //set base Mapbox tiles
    var basemap = "sw2279.NYCLotto";

    //where brooklyn at?!40.7429 N, 73.9188
    this.map = L.mapbox.map('map_'+id, basemap,{minZoom:10,maxZoom:17}).setView([lat,lon], zoom);

    //load chart-icon
    $("#citydigits-charts"+id).attr({'class':'citydigits-charts'});

	//load legend
	$("#citydigits-legend"+id).attr({'class':'citydigits-legend'});

	//load mapbox scale bars
	this.map.addControl(L.control.scale());

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


CityDigitsMapOpinion.prototype.loadLayers = function (){
    var self = this;
	
	var activeMap = this;
	
	// load topoJSON data for neighborhoods
	// path to neighborhoods defined in index.html django template

	// define layer styles and oneachfeature popup styling
	this.MAP1_POP_POVERTY_style = L.geoJson(null, {
	    style: CityDigitsMapOpinion.getStyleColorFor_MAP1_POP_POVERTY,
		onEachFeature: function(feature,layer){
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
		
				if (!activeMap.popup2._isOpen) {
			    	activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
					activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
		
					//display popup
			        if (!activeMap.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
			            activeMap.popup.openOn(activeMap.map);
			        }else{
			            activeMap.map.closePopup();
			        }			
				}
		
				//highlight polygon
				layer.setStyle(highlight);		
		
		    });
		
		    layer.on('mousemove', function(ev) {
		
				// only have on mousemove work if popup2 isn't open
				if (!activeMap.popup2._isOpen) {
			        //get lat/long
			        if(($.inArray(feature.properties.Name,open_tooltips)<0)){
						activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
						activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
			    	}

			        //display popup
					if (!activeMap.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
						activeMap.popup.openOn(activeMap.map);
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
				activeMap.map.closePopup();
		
				// bind popup with data to the feature
				activeMap.popup2.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
				var percent = feature.properties.PovertyPer * 100;
				percent = percent.toFixed(0);
				activeMap.popup2.setContent('<div class="map-popup"><h4 class="text-left">' + feature.properties.Name + '</h4><p>' + percent + '%<br />Population in Poverty</p></div>');
				activeMap.popup2.openOn(activeMap.map);
			});
	
		}
	});
	this.MAP2_MED_HH_INCOME_style = L.geoJson(null, {
		style: CityDigitsMapOpinion.getStyleColorFor_MAP2_MED_HH_INCOME,
		onEachFeature: function(feature,layer){
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
				if (!activeMap.popup2._isOpen) {
			    	activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
					activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
		
					//display popup
			     if (!activeMap.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
			            activeMap.popup.openOn(activeMap.map);
			        }else{
			            activeMap.map.closePopup();
			        }			
				}
		
				//highlight polygon
				layer.setStyle(highlight);		
		
		    });
		
		    layer.on('mousemove', function(ev) {
		
				// only have on mousemove work if popup2 isn't open
				if (!activeMap.popup2._isOpen) {
			        //get lat/long
			        if(($.inArray(feature.properties.Name,open_tooltips)<0)){
						activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
						activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
			    	}
			
			        //display popup
					if (!activeMap.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
						activeMap.popup.openOn(activeMap.map);
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
				activeMap.map.closePopup();
		
				// bind popup with data to the feature
				activeMap.popup2.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
				var MedHHInc = accounting.formatMoney(feature.properties.MedHouInco, "$", 0, ",", "");
				activeMap.popup2.setContent('<div class="map-popup"><h4 class="text-left">' + feature.properties.Name + '</h4><p>' + MedHHInc + '<br />Median Household Income</p></div>');
				activeMap.popup2.openOn(activeMap.map);
			});
	
		}
	});
	this.MAP3_PCT_UNEMPLOYED_style = L.geoJson(null, {
		style: CityDigitsMapOpinion.getStyleColorFor_MAP3_PCT_UNEMPLOYED,
		onEachFeature: function(feature,layer){
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
				if (!activeMap.popup2._isOpen) {
			    	activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
					activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
		
					//display popup
			        if (!activeMap.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
			            activeMap.popup.openOn(activeMap.map);
			        }else{
			            activeMap.map.closePopup();
			        }			
				}
		
				//highlight polygon
				layer.setStyle(highlight);		
		
		    });
		
		    layer.on('mousemove', function(ev) {
		
				// only have on mousemove work if popup2 isn't open
				if (!activeMap.popup2._isOpen) {
			        //get lat/long
			        if(($.inArray(feature.properties.Name,open_tooltips)<0)){
						activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
						activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
			    	}
			
			        //display popup
					if (!activeMap.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
						activeMap.popup.openOn(activeMap.map);
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
				activeMap.map.closePopup();
		
				// bind popup with data to the feature
				activeMap.popup2.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
				var percent = feature.properties.UnempRate * 100;
				percent = percent.toFixed(1);
				activeMap.popup2.setContent('<div class="map-popup"><h4 class="text-left">' + feature.properties.Name + '</h4><p>' + percent + '%<br />Percent Unemployed</p></div>');
				activeMap.popup2.openOn(activeMap.map);
			});
	
		}
	});
	this.MAP4_PCT_FOREIGN_BORN_style = L.geoJson(null, {
		style: CityDigitsMapOpinion.getStyleColorFor_MAP4_PCT_FOREIGN_BORN,
		onEachFeature: function(feature,layer){
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
				if (!activeMap.popup2._isOpen) {
			    	activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
					activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
		
					//display popup
			        if (!activeMap.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
			            activeMap.popup.openOn(activeMap.map);
			        }else{
			            activeMap.map.closePopup();
			        }			
				}
		
				//highlight polygon
				layer.setStyle(highlight);		
		
		    });
		
		    layer.on('mousemove', function(ev) {
		
				// only have on mousemove work if popup2 isn't open
				if (!activeMap.popup2._isOpen) {
			        //get lat/long
			        if(($.inArray(feature.properties.Name,open_tooltips)<0)){
						activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
						activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
			    	}
			
			        //display popup
					if (!activeMap.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
						activeMap.popup.openOn(activeMap.map);
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
				activeMap.map.closePopup();
		
				// bind popup with data to the feature
				activeMap.popup2.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
				var percent = feature.properties.ForBornPer * 100;
				percent = percent.toFixed(0);
				activeMap.popup2.setContent('<div class="map-popup"><h4 class="text-left">' + feature.properties.Name + '</h4><p>' + percent + '%<br />Population Foreign Born</p></div>');
				activeMap.popup2.openOn(activeMap.map);
			});
	
		}
	});
			
	// load layers
	this.MAP1_POP_POVERTY = omnivore.topojson(neighborhoods, null, this.MAP1_POP_POVERTY_style);
	this.MAP2_MED_HH_INCOME = omnivore.topojson(neighborhoods, null, this.MAP2_MED_HH_INCOME_style);
	this.MAP3_PCT_UNEMPLOYED = omnivore.topojson(neighborhoods, null, this.MAP3_PCT_UNEMPLOYED_style);
	this.MAP4_PCT_FOREIGN_BORN = omnivore.topojson(neighborhoods, null, this.MAP4_PCT_FOREIGN_BORN_style);
		
}

CityDigitsMapOpinion.prototype.loadCreateMapLayers = function (){
    var self = this;

	var activeMap = this;
			
	// load topoJSON data for neighborhoods
	// path to neighborhoods defined in index.html django template

	// define layer styles and oneachfeature popup styling
	this.CREATEMAP1_AFI_PER_SQMILE_style = L.geoJson(null, {
		style: CityDigitsMapOpinion.getStyleColorFor_CREATEMAP1_AFI_PER_SQMILE,
		onEachFeature: function(feature,layer){
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
				if (!activeMap.popup2._isOpen) {
			    	activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
					activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
		
					//display popup
			        if (!activeMap.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
			            activeMap.popup.openOn(activeMap.map);
			        }else{
			            activeMap.map.closePopup();
			        }			
				}
		
				//highlight polygon
				layer.setStyle(highlight);		
		
		    });
		
		    layer.on('mousemove', function(ev) {
		
				// only have on mousemove work if popup2 isn't open
				if (!activeMap.popup2._isOpen) {
			        //get lat/long
			        if(($.inArray(feature.properties.Name,open_tooltips)<0)){
						activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
						activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
			    	}
			
			        //display popup
					if (!activeMap.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
						activeMap.popup.openOn(activeMap.map);
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
				activeMap.map.closePopup();
		
				// bind popup with data to the feature
				activeMap.popup2.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
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
		
				activeMap.popup2.setContent(popupContent);
				activeMap.popup2.openOn(activeMap.map);
			});
	
		}
	});
	this.CREATEMAP2_BANKS_PER_SQMILE_style = L.geoJson(null, {
		style: CityDigitsMapOpinion.getStyleColorFor_CREATEMAP2_BANKS_PER_SQMILE,
		onEachFeature: function(feature,layer){
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
				if (!activeMap.popup2._isOpen) {
			    	activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
					activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
		
					//display popup
			        if (!activeMap.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
			            activeMap.popup.openOn(activeMap.map);
			        }else{
			            activeMap.map.closePopup();
			        }			
				}
		
				//highlight polygon
				layer.setStyle(highlight);		
		
		    });
		
		    layer.on('mousemove', function(ev) {
		
				// only have on mousemove work if popup2 isn't open
				if (!activeMap.popup2._isOpen) {
			        //get lat/long
			        if(($.inArray(feature.properties.Name,open_tooltips)<0)){
						activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
						activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
			    	}
			
			        //display popup
					if (!activeMap.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
						activeMap.popup.openOn(activeMap.map);
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
				activeMap.map.closePopup();
		
				// bind popup with data to the feature
				activeMap.popup2.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
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
		
				activeMap.popup2.setContent(popupContent);
				activeMap.popup2.openOn(activeMap.map);
			});
	
		}
	});
	this.CREATEMAP3_PAWN_SHOPS_PER_SQMILE_style = L.geoJson(null, {
		style: CityDigitsMapOpinion.getStyleColorFor_CREATEMAP3_PAWN_SHOPS_PER_SQMILE,
		onEachFeature: function(feature,layer){
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
				if (!activeMap.popup2._isOpen) {
			    	activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
					activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
		
					//display popup
			        if (!activeMap.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
			            activeMap.popup.openOn(activeMap.map);
			        }else{
			            activeMap.map.closePopup();
			        }			
				}
		
				//highlight polygon
				layer.setStyle(highlight);		
		
		    });
		
		    layer.on('mousemove', function(ev) {
		
				// only have on mousemove work if popup2 isn't open
				if (!activeMap.popup2._isOpen) {
			        //get lat/long
			        if(($.inArray(feature.properties.Name,open_tooltips)<0)){
						activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
						activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
			    	}
			
			        //display popup
					if (!activeMap.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
						activeMap.popup.openOn(activeMap.map);
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
				activeMap.map.closePopup();
		
				// bind popup with data to the feature
				activeMap.popup2.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
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
		
				activeMap.popup2.setContent(popupContent);
				activeMap.popup2.openOn(activeMap.map);
			});
	
		}
	});
	this.CREATEMAP4_MCDONALDS_PER_SQMILE_style = L.geoJson(null, {
		style: CityDigitsMapOpinion.getStyleColorFor_CREATEMAP4_MCDONALDS_PER_SQMILE,
		onEachFeature: function(feature,layer){
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
				if (!activeMap.popup2._isOpen) {
			    	activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
					activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
		
					//display popup
			        if (!activeMap.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
			            activeMap.popup.openOn(activeMap.map);
			        }else{
			            activeMap.map.closePopup();
			        }			
				}
		
				//highlight polygon
				layer.setStyle(highlight);		
		
		    });
		
		    layer.on('mousemove', function(ev) {
		
				// only have on mousemove work if popup2 isn't open
				if (!activeMap.popup2._isOpen) {
			        //get lat/long
			        if(($.inArray(feature.properties.Name,open_tooltips)<0)){
						activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
						activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
			    	}
			
			        //display popup
					if (!activeMap.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
						activeMap.popup.openOn(activeMap.map);
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
				activeMap.map.closePopup();
		
				// bind popup with data to the feature
				activeMap.popup2.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
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
		
				activeMap.popup2.setContent(popupContent);
				activeMap.popup2.openOn(activeMap.map);
			});
	
		}
	});
	this.CREATEMAP5_HH_PER_AFI_style = L.geoJson(null, {
		style: CityDigitsMapOpinion.getStyleColorFor_CREATEMAP5_HH_PER_AFI,
		onEachFeature: function(feature,layer){
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
				if (!activeMap.popup2._isOpen) {
			    	activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
					activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
		
					//display popup
			        if (!activeMap.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
			            activeMap.popup.openOn(activeMap.map);
			        }else{
			            activeMap.map.closePopup();
			        }			
				}
		
				//highlight polygon
				layer.setStyle(highlight);		
		
		    });
		
		    layer.on('mousemove', function(ev) {
		
				// only have on mousemove work if popup2 isn't open
				if (!activeMap.popup2._isOpen) {
			        //get lat/long
			        if(($.inArray(feature.properties.Name,open_tooltips)<0)){
						activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
						activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
			    	}
			
			        //display popup
					if (!activeMap.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
						activeMap.popup.openOn(activeMap.map);
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
				activeMap.map.closePopup();
		
				// bind popup with data to the feature
				activeMap.popup2.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
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
		
				activeMap.popup2.setContent(popupContent);
				activeMap.popup2.openOn(activeMap.map);
			});
	
		}
	});
	this.CREATEMAP6_HH_PER_BANK_style = L.geoJson(null, {
		style: CityDigitsMapOpinion.getStyleColorFor_CREATEMAP6_HH_PER_BANK,
		onEachFeature: function(feature,layer){
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
				if (!activeMap.popup2._isOpen) {
			    	activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
					activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
		
					//display popup
			        if (!activeMap.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
			            activeMap.popup.openOn(activeMap.map);
			        }else{
			            activeMap.map.closePopup();
			        }			
				}
		
				//highlight polygon
				layer.setStyle(highlight);		
		
		    });
		
		    layer.on('mousemove', function(ev) {
		
				// only have on mousemove work if popup2 isn't open
				if (!activeMap.popup2._isOpen) {
			        //get lat/long
			        if(($.inArray(feature.properties.Name,open_tooltips)<0)){
						activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
						activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
			    	}
			
			        //display popup
					if (!activeMap.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
						activeMap.popup.openOn(activeMap.map);
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
				activeMap.map.closePopup();
		
				// bind popup with data to the feature
				activeMap.popup2.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
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
		
				activeMap.popup2.setContent(popupContent);
				activeMap.popup2.openOn(activeMap.map);
			});
	
		}
	});
	this.CREATEMAP7_HH_PER_MCDONALDS_style = L.geoJson(null, {
		style: CityDigitsMapOpinion.getStyleColorFor_CREATEMAP7_HH_PER_MCDONALDS,
		onEachFeature: function(feature,layer){
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
				if (!activeMap.popup2._isOpen) {
			    	activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
					activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
		
					//display popup
			        if (!activeMap.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
			            activeMap.popup.openOn(activeMap.map);
			        }else{
			            activeMap.map.closePopup();
			        }			
				}
		
				//highlight polygon
				layer.setStyle(highlight);		
		
		    });
		
		    layer.on('mousemove', function(ev) {
		
				// only have on mousemove work if popup2 isn't open
				if (!activeMap.popup2._isOpen) {
			        //get lat/long
			        if(($.inArray(feature.properties.Name,open_tooltips)<0)){
						activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
						activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
			    	}
			
			        //display popup
					if (!activeMap.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
						activeMap.popup.openOn(activeMap.map);
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
				activeMap.map.closePopup();
		
				// bind popup with data to the feature
				activeMap.popup2.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
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
		
				activeMap.popup2.setContent(popupContent);
				activeMap.popup2.openOn(activeMap.map);
			});
	
		}
	});
	this.CREATEMAP8_HH_PER_PAWN_SHOP_style = L.geoJson(null, {
		style: CityDigitsMapOpinion.getStyleColorFor_CREATEMAP8_HH_PER_PAWN_SHOP,
		onEachFeature: function(feature,layer){
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
				if (!activeMap.popup2._isOpen) {
			    	activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
					activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
		
					//display popup
			        if (!activeMap.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
			            activeMap.popup.openOn(activeMap.map);
			        }else{
			            activeMap.map.closePopup();
			        }			
				}
		
				//highlight polygon
				layer.setStyle(highlight);		
		
		    });
		
		    layer.on('mousemove', function(ev) {
		
				// only have on mousemove work if popup2 isn't open
				if (!activeMap.popup2._isOpen) {
			        //get lat/long
			        if(($.inArray(feature.properties.Name,open_tooltips)<0)){
						activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
						activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
			    	}
			
			        //display popup
					if (!activeMap.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
						activeMap.popup.openOn(activeMap.map);
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
				activeMap.map.closePopup();
		
				// bind popup with data to the feature
				activeMap.popup2.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
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
		
				activeMap.popup2.setContent(popupContent);
				activeMap.popup2.openOn(activeMap.map);
			});
	
		}
	});
	this.CREATEMAP9_AFIS_PER_BANK_style = L.geoJson(null, {
		style: CityDigitsMapOpinion.getStyleColorFor_CREATEMAP9_AFIS_PER_BANK,
		onEachFeature: function(feature,layer){
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
				if (!activeMap.popup2._isOpen) {
			    	activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
					activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
		
					//display popup
			        if (!activeMap.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
			            activeMap.popup.openOn(activeMap.map);
			        }else{
			            activeMap.map.closePopup();
			        }			
				}
		
				//highlight polygon
				layer.setStyle(highlight);		
		
		    });
		
		    layer.on('mousemove', function(ev) {
		
				// only have on mousemove work if popup2 isn't open
				if (!activeMap.popup2._isOpen) {
			        //get lat/long
			        if(($.inArray(feature.properties.Name,open_tooltips)<0)){
						activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
						activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
			    	}
			
			        //display popup
					if (!activeMap.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
						activeMap.popup.openOn(activeMap.map);
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
				activeMap.map.closePopup();
		
				// bind popup with data to the feature
				activeMap.popup2.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
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
		
				activeMap.popup2.setContent(popupContent);
				activeMap.popup2.openOn(activeMap.map);
			});
	
		}
	});
	this.CREATEMAP10_BANKS_PER_AFI_style = L.geoJson(null, {
		style: CityDigitsMapOpinion.getStyleColorFor_CREATEMAP10_BANKS_PER_AFI,
		onEachFeature: function(feature,layer){
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
				if (!activeMap.popup2._isOpen) {
			    	activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
					activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');

					//display popup
			        if (!activeMap.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
			            activeMap.popup.openOn(activeMap.map);
			        }else{
			            activeMap.map.closePopup();
			        }			
				}

				//highlight polygon
				layer.setStyle(highlight);		

		    });

		    layer.on('mousemove', function(ev) {

				// only have on mousemove work if popup2 isn't open
				if (!activeMap.popup2._isOpen) {
			        //get lat/long
			        if(($.inArray(feature.properties.Name,open_tooltips)<0)){
						activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
						activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize">'+feature.properties.Name + '</div>');
			    	}
	
			        //display popup
					if (!activeMap.popup._isOpen && ($.inArray(feature.properties.Name,open_tooltips)<0)){
						activeMap.popup.openOn(activeMap.map);
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
				activeMap.map.closePopup();

				// bind popup with data to the feature
				activeMap.popup2.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
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

				activeMap.popup2.setContent(popupContent);
				activeMap.popup2.openOn(activeMap.map);
			});

		}
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


CityDigitsMapOpinion.getStyleColorFor_MAP1_POP_POVERTY = function (feature){
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

CityDigitsMapOpinion.getStyleColorFor_MAP2_MED_HH_INCOME = function (feature){
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

CityDigitsMapOpinion.getStyleColorFor_MAP3_PCT_UNEMPLOYED = function (feature){
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

CityDigitsMapOpinion.getStyleColorFor_MAP4_PCT_FOREIGN_BORN = function (feature){
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

CityDigitsMapOpinion.getStyleColorFor_CREATEMAP1_AFI_PER_SQMILE = function (feature){
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

CityDigitsMapOpinion.getStyleColorFor_CREATEMAP2_BANKS_PER_SQMILE = function (feature){
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

CityDigitsMapOpinion.getStyleColorFor_CREATEMAP3_PAWN_SHOPS_PER_SQMILE = function (feature){
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

CityDigitsMapOpinion.getStyleColorFor_CREATEMAP4_MCDONALDS_PER_SQMILE = function (feature){
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

CityDigitsMapOpinion.getStyleColorFor_CREATEMAP5_HH_PER_AFI = function (feature){
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

CityDigitsMapOpinion.getStyleColorFor_CREATEMAP6_HH_PER_BANK = function (feature){
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

CityDigitsMapOpinion.getStyleColorFor_CREATEMAP7_HH_PER_MCDONALDS = function (feature){
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

CityDigitsMapOpinion.getStyleColorFor_CREATEMAP8_HH_PER_PAWN_SHOP = function (feature){
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

CityDigitsMapOpinion.getStyleColorFor_CREATEMAP9_AFIS_PER_BANK = function (feature){
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

CityDigitsMapOpinion.getStyleColorFor_CREATEMAP10_BANKS_PER_AFI = function (feature){
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



CityDigitsMapOpinion.prototype.loadMarkers = function(){
	
	var activeMap = this;
		
	this.LOC1_PAWN_SHOPS = null;
	this.LOC2_CHECK_CASHING = null;
	this.LOC3_WIRE_TRANSFER = null;
	this.LOC4_BANKS = null;
	this.LOC5_MCDONALDS = null;
	this.LOC6_SUBWAY_LINES = null;
	this.LOC7_SUBWAY_STATIONS = null;

	// define layer styles and oneachfeature popup styling
	this.LOC1_PAWN_SHOPS_style = L.geoJson(null, {
		pointToLayer: CityDigitsMapOpinion.getStyleFor_LOC1_PAWN_SHOPS,
		onEachFeature: function(feature,layer){
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
				if (!activeMap.popup2._isOpen) {
					// close all popups first
					activeMap.map.closePopup();
			    	activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
					activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="pawnshop-icon"></div>Pawn Shop<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p></div>');
		
					//display popup
			        if (!activeMap.popup._isOpen && ($.inArray(feature.properties.name,open_tooltips)<0)){
			            activeMap.popup.openOn(activeMap.map);
			        }else{
			            activeMap.map.closePopup();
			        }
			
					//highlight point
					layer.setStyle(highlight).bringToFront();		
				}
		    });
	
		    layer.on('mousemove', function(ev) {
		
				// only have on mousemove work if popup2 isn't open
				if (!activeMap.popup2._isOpen) {
			        //get lat/long
			        if(($.inArray(feature.properties.name,open_tooltips)<0)){
						activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
						activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="pawnshop-icon"></div>Pawn Shop<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p></div>');
			    	}

			        //display popup
					if (!activeMap.popup._isOpen && ($.inArray(feature.properties.name,open_tooltips)<0)){
						activeMap.popup.openOn(activeMap.map);
					}

					//highlight point
					layer.setStyle(highlight);		
						
				}
		    });
				
		    layer.on('mouseout', function(ev) {
				//highlight point
				layer.setStyle(noHighlight);
		
				// close popup
				if (!activeMap.popup2._isOpen) {
					activeMap.map.closePopup();
				}
				
		    });

	
			// add on click popups for each layer -- these will be different
			layer.on("click",function(ev){
				// close all open popups
				activeMap.map.closePopup();
		
				// bind popup with data to the feature
				activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
				activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="pawnshop-icon"></div>Pawn Shop<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p></div>');

				// open popup
				activeMap.popup.openOn(activeMap.map);

			});
			
	
		}
	});
	this.LOC2_CHECK_CASHING_style = L.geoJson(null, {
		pointToLayer: CityDigitsMapOpinion.getStyleFor_LOC2_CHECK_CASHING,
		onEachFeature: function(feature,layer){
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
				if (!activeMap.popup2._isOpen) {
					// close all popups first
					activeMap.map.closePopup();
			    	activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
					activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="checkcashing-icon"></div>Check Cashing<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p></div>');
		
					//display popup
			        if (!activeMap.popup._isOpen && ($.inArray(feature.properties.name,open_tooltips)<0)){
			            activeMap.popup.openOn(activeMap.map);
			        }else{
			            activeMap.map.closePopup();
			        }		
				}
		
				//highlight point
				layer.setStyle(highlight).bringToFront();		
		
		    });
	
		    layer.on('mousemove', function(ev) {
		
				// only have on mousemove work if popup2 isn't open
				if (!activeMap.popup2._isOpen) {
			        //get lat/long
			        if(($.inArray(feature.properties.name,open_tooltips)<0)){
						activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
						activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="checkcashing-icon"></div>Check Cashing<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p></div>');
			    	}

			        //display popup
					if (!activeMap.popup._isOpen && ($.inArray(feature.properties.name,open_tooltips)<0)){
						activeMap.popup.openOn(activeMap.map);
					}			
				}
		
				//highlight point
				layer.setStyle(highlight);		
		
		    });
	
		    layer.on('mouseout', function(ev) {
				//highlight point
				layer.setStyle(noHighlight);
		
				// close popup
				if (!activeMap.popup2._isOpen) {
					activeMap.map.closePopup();
				}
				
		    });

	
			// add on click popups for each layer -- these will be different
			layer.on("click",function(ev){
				// close all open popups
				activeMap.map.closePopup();
		
				// bind popup with data to the feature
				activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
				activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="checkcashing-icon"></div>Check Cashing<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p></div>');

				// open popup
				activeMap.popup.openOn(activeMap.map);

			});
	
	
		}
	});
	this.LOC3_WIRE_TRANSFER_style = L.geoJson(null, {
		pointToLayer: CityDigitsMapOpinion.getStyleFor_LOC3_WIRE_TRANSFER,
		onEachFeature: function(feature,layer){
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
				if (!activeMap.popup2._isOpen) {
					// close all popups first
					activeMap.map.closePopup();
			    	activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
					activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="wiretransfer-icon"></div>Wire Transfer<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p></div>');
		
					//display popup
			        if (!activeMap.popup._isOpen && ($.inArray(feature.properties.name,open_tooltips)<0)){
			            activeMap.popup.openOn(activeMap.map);
			        }else{
			            activeMap.map.closePopup();
			        }		
				}
		
				//highlight point
				layer.setStyle(highlight).bringToFront();		
		
		    });
	
		    layer.on('mousemove', function(ev) {
		
				// only have on mousemove work if popup2 isn't open
				if (!activeMap.popup2._isOpen) {
			        //get lat/long
			        if(($.inArray(feature.properties.name,open_tooltips)<0)){
						activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
						activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="wiretransfer-icon"></div>Wire Transfer<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p></div>');
			    	}

			        //display popup
					if (!activeMap.popup._isOpen && ($.inArray(feature.properties.name,open_tooltips)<0)){
						activeMap.popup.openOn(activeMap.map);
					}			
				}
		
				//highlight point
				layer.setStyle(highlight);		
		
		    });
	
		    layer.on('mouseout', function(ev) {
				//highlight point
				layer.setStyle(noHighlight);
		
				// close popup
				if (!activeMap.popup2._isOpen) {
					activeMap.map.closePopup();
				}
				
		    });

	
			// add on click popups for each layer -- these will be different
			layer.on("click",function(ev){
				// close all open popups
				activeMap.map.closePopup();
		
				// bind popup with data to the feature
				activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
				activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="wiretransfer-icon"></div>Wire Transfer<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p></div>');

				// open popup
				activeMap.popup.openOn(activeMap.map);

			});	
	
		}
	});	
	this.LOC4_BANKS_style = L.geoJson(null, {
		pointToLayer: CityDigitsMapOpinion.getStyleFor_LOC4_BANKS,
		onEachFeature: function(feature,layer){
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
				if (!activeMap.popup2._isOpen) {
					// close all popups first
					activeMap.map.closePopup();
			    	activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
					activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="banks-icon"></div>Bank<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p></div>');
		
					//display popup
			        if (!activeMap.popup._isOpen && ($.inArray(feature.properties.name,open_tooltips)<0)){
			            activeMap.popup.openOn(activeMap.map);
			        }else{
			            activeMap.map.closePopup();
			        }		
				}
		
				//highlight point
				layer.setStyle(highlight).bringToFront();		
		
		    });
	
		    layer.on('mousemove', function(ev) {
		
				// only have on mousemove work if popup2 isn't open
				if (!activeMap.popup2._isOpen) {
			        //get lat/long
			        if(($.inArray(feature.properties.name,open_tooltips)<0)){
						activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
						activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="banks-icon"></div>Bank<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p></div>');
			    	}

			        //display popup
					if (!activeMap.popup._isOpen && ($.inArray(feature.properties.name,open_tooltips)<0)){
						activeMap.popup.openOn(activeMap.map);
					}			
				}
		
				//highlight point
				layer.setStyle(highlight);		
		
		    });
	
		    layer.on('mouseout', function(ev) {
				//highlight point
				layer.setStyle(noHighlight);
		
				// close popup
				if (!activeMap.popup2._isOpen) {
					activeMap.map.closePopup();
				}
				
		    });

	
			// add on click popups for each layer -- these will be different
			layer.on("click",function(ev){
				// close all open popups
				activeMap.map.closePopup();
		
				// bind popup with data to the feature
				activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
				activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="banks-icon"></div>Bank<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p></div>');

				// open popup
				activeMap.popup.openOn(activeMap.map);

			});		
	
		}
	});	
	this.LOC5_MCDONALDS_style = L.geoJson(null, {
		pointToLayer: CityDigitsMapOpinion.getStyleFor_LOC5_MCDONALDS,
		onEachFeature: function(feature,layer){
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
				if (!activeMap.popup2._isOpen) {
					// close all popups first
					activeMap.map.closePopup();
			    	activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
					activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="mcdonalds-icon"></div>McDonald\'s<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p></div>');
		
					//display popup
			        if (!activeMap.popup._isOpen && ($.inArray(feature.properties.name,open_tooltips)<0)){
			            activeMap.popup.openOn(activeMap.map);
			        }else{
			            activeMap.map.closePopup();
			        }		
				}
		
				//highlight point
				layer.setStyle(highlight).bringToFront();		
		
		    });
	
		    layer.on('mousemove', function(ev) {
		
				// only have on mousemove work if popup2 isn't open
				if (!activeMap.popup2._isOpen) {
			        //get lat/long
			        if(($.inArray(feature.properties.name,open_tooltips)<0)){
						activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
						activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="mcdonalds-icon"></div>McDonald\'s<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p></div>');
			    	}

			        //display popup
					if (!activeMap.popup._isOpen && ($.inArray(feature.properties.name,open_tooltips)<0)){
						activeMap.popup.openOn(activeMap.map);
					}			
				}
		
				//highlight point
				layer.setStyle(highlight);		
		
		    });
	
		    layer.on('mouseout', function(ev) {
				//highlight point
				layer.setStyle(noHighlight);
		
				// close popup
				if (!activeMap.popup2._isOpen) {
					activeMap.map.closePopup();
				}
				
		    });

	
			// add on click popups for each layer -- these will be different
			layer.on("click",function(ev){
				// close all open popups
				activeMap.map.closePopup();
		
				// bind popup with data to the feature
				activeMap.popup.setLatLng(activeMap.map.layerPointToLatLng(ev.layerPoint));
				activeMap.popup.setContent('<div class="rollover-tooltip text-capitalize"><div class="mcdonalds-icon"></div>McDonald\'s<h4>' + feature.properties.name + '</h4><p>'+ feature.properties.address + '</p></div>');

				// open popup
				activeMap.popup.openOn(activeMap.map);

			});		
	
	
		}
	});	
	this.LOC6_SUBWAY_LINES_style = L.geoJson(null, {
		style: CityDigitsMapOpinion.getStyleFor_LOC6_SUBWAY_LINES,
		onEachFeature: function(feature,layer){

		    //add on hover -- same on hover and mousemove for each layer
		    layer.on('mouseover', function(ev) {	
		
		    });
	
		    layer.on('mousemove', function(ev) {
				
		    });
	
		    layer.on('mouseout', function(ev) {
		
		    });
	
	
		}
	});	
	this.LOC7_SUBWAY_STATIONS_style = L.geoJson(null, {
		pointToLayer: CityDigitsMapOpinion.getStyleFor_LOC7_SUBWAY_STATIONS,
		onEachFeature: function(feature,layer){

		    //add on hover -- same on hover and mousemove for each layer
		    layer.on('mouseover', function(ev) {	
		
		    });
	
		    layer.on('mousemove', function(ev) {
				
		    });
	
		    layer.on('mouseout', function(ev) {
		
		    });
	
	
		}
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


CityDigitsMapOpinion.getStyleFor_LOC1_PAWN_SHOPS = function (feature, latlng){
	var pawnShopMarker = L.circle(latlng, 80, {
		stroke: false,
		fillColor: '#eb4a42',
		fillOpacity: 0.75
	});
	
	return pawnShopMarker;
	
}

CityDigitsMapOpinion.getStyleFor_LOC2_CHECK_CASHING = function (feature, latlng){
	var checkCashingMarker = L.circle(latlng, 80, {
		stroke: false,
		fillColor: '#ffa77f',
		fillOpacity: 0.75
	});
	
	return checkCashingMarker;
	
}

CityDigitsMapOpinion.getStyleFor_LOC3_WIRE_TRANSFER = function (feature, latlng){
	var wireTransferMarker = L.circle(latlng, 80, {
		stroke: false,
		fillColor: '#fa8a12',
		fillOpacity: 0.75
	});
	
	return wireTransferMarker;
	
}

CityDigitsMapOpinion.getStyleFor_LOC4_BANKS = function (feature, latlng){
	var banksMarker = L.circle(latlng, 80, {
		stroke: false,
		fillColor: '#fa8aa3',
		fillOpacity: 0.75
	});
	
	return banksMarker;
	
}

CityDigitsMapOpinion.getStyleFor_LOC5_MCDONALDS = function (feature, latlng){
	var mcdonaldsMarker = L.circle(latlng, 80, {
		stroke: false,
		fillColor: '#ebcf42',
		fillOpacity: 0.75
	});
	
	return mcdonaldsMarker;
	
}

CityDigitsMapOpinion.getStyleFor_LOC6_SUBWAY_LINES = function (feature, layer){
	var subwayLinesInitialStyle = {
	    color: "#9c9c9c",
	    weight: 3,
	    opacity: 0.75
	};
	
	return subwayLinesInitialStyle;
	
}

CityDigitsMapOpinion.getStyleFor_LOC7_SUBWAY_STATIONS = function (feature, latlng){
	var subwayStationInitialStyle = L.circleMarker(latlng, {
	    radius: 0,
	    weight: 0,
	    fillOpacity: 0.75
	});
	
	return subwayStationInitialStyle;
	
}


CityDigitsMapOpinion.prototype.loadMedia = function(){
	
	var activeMap = this;
			
	this.MEDIA_IMAGES = null;
	this.MEDIA_AUDIO = null;
	this.MEDIA_NOTE = null;
	this.MEDIA_INTERVIEW = null;

	// define layer styles and oneachfeature popup styling
	this.MEDIA_IMAGES = L.geoJson(mediaImageGeojson, {
		pointToLayer: CityDigitsMap.getStyleFor_MEDIA,
		onEachFeature: function(feature, layer){

		    //add on hover -- same on hover and mousemove for each layer
		    layer.on('mouseover', function(ev) {
				// only have on mouseover work if popup2 isn't open
				if (!activeMap.popup2._isOpen) {
					// close all popups first
					activeMap.map.closePopup();
				}
		    });
		
			// add on click popups for each layer -- these will be different
			layer.on("click",function(ev){
				// close all open popups
				activeMap.map.closePopup();
		
				var lat = feature.geometry.coordinates[1];
				var lng = feature.geometry.coordinates[0];
		
				// set latlng variable
				var latlng = L.latLng(lat, lng);
				// bind popup with data to the feature
				activeMap.popup2.setLatLng(latlng);

				var header = '<div class="map-popup"><a href="/cashcity/media/image/' + feature.properties.id + '/" style="text-decoration:none; color:inherit"><h4 class="text-left">' + feature.properties.section + '</h4>';
				var mediaBox = '<div style="height: 280px; width: 280px; margin: auto; overflow: hidden;"><img src="' + feature.properties.image + '"></div>';
				var title = '<div style="margin-top: 5px"><p class="text-left">' + feature.properties.name + '</p></div></a>';
				var footer = '</div>';
				
				var popupContent = header + mediaBox + title + footer;
		
				activeMap.popup2.setContent(popupContent);
				activeMap.popup2.openOn(activeMap.map);
			});
	
		}
	});
	// define layer styles and oneachfeature popup styling
	this.MEDIA_AUDIO = L.geoJson(mediaAudioGeojson, {
		pointToLayer: CityDigitsMap.getStyleFor_MEDIA,
		onEachFeature: function(feature, layer){

		    //add on hover -- same on hover and mousemove for each layer
		    layer.on('mouseover', function(ev) {
				// only have on mouseover work if popup2 isn't open
				if (!activeMap.popup2._isOpen) {
					// close all popups first
					activeMap.map.closePopup();
				}
		    });
		
			// add on click popups for each layer -- these will be different
			layer.on("click",function(ev){
				// close all open popups
				activeMap.map.closePopup();
		
				var lat = feature.geometry.coordinates[1];
				var lng = feature.geometry.coordinates[0];
		
				// set latlng variable
				var latlng = L.latLng(lat, lng);
				// bind popup with data to the feature
				activeMap.popup2.setLatLng(latlng);
		
				var header = '<div class="map-popup"><a href="/cashcity/media/audio/' + feature.properties.id + '/" style="text-decoration:none; color:inherit"><h4 class="text-left">' + feature.properties.section + '</h4></a>';
				var mediaBox = '<div style="margin-right: auto; margin-left: auto; margin-top: 10px;"><audio src="' + feature.properties.audio + '" preload="auto" controls></audio></div>';
				var title = '<a href="/cashcity/media/audio/' + feature.properties.id + '/" style="text-decoration:none; color:inherit"><div style="margin-top: 5px"><p class="text-left">' + feature.properties.name + '</p></div></a>';
				var footer = '</div>';
				
				var popupContent = header + mediaBox + title + footer;
		
				activeMap.popup2.setContent(popupContent);
				activeMap.popup2.openOn(activeMap.map);
			});
	
		}
	});
	// define layer styles and oneachfeature popup styling
	this.MEDIA_NOTE = L.geoJson(mediaNoteGeojson, {
		pointToLayer: CityDigitsMap.getStyleFor_MEDIA,
		onEachFeature: function(feature, layer){

		    //add on hover -- same on hover and mousemove for each layer
		    layer.on('mouseover', function(ev) {
				// only have on mouseover work if popup2 isn't open
				if (!activeMap.popup2._isOpen) {
					// close all popups first
					activeMap.map.closePopup();
				}
		    });
		
			// add on click popups for each layer -- these will be different
			layer.on("click",function(ev){
				// close all open popups
				activeMap.map.closePopup();
		
				var lat = feature.geometry.coordinates[1];
				var lng = feature.geometry.coordinates[0];
		
				// set latlng variable
				var latlng = L.latLng(lat, lng);
				// bind popup with data to the feature
				activeMap.popup2.setLatLng(latlng);

				var header = '<div class="map-popup"><a href="/cashcity/media/note/' + feature.properties.id + '/" style="text-decoration:none; color:inherit"><h4 class="text-left">' + feature.properties.section + '</h4>';
				var title = '<div style="margin-top: 5px"><p class="text-left">' + feature.properties.name + '</p></div>';
				var mediaBox = '<p class="text-left">' + feature.properties.notes + '</p></a>';
				var footer = '</div>';
				
				var popupContent = header + title + mediaBox + footer;
		
				activeMap.popup2.setContent(popupContent);
				activeMap.popup2.openOn(activeMap.map);
			});
	
		}
	});
	// define layer styles and oneachfeature popup styling
	this.MEDIA_INTERVIEW = L.geoJson(mediaInterviewGeojson, {
		pointToLayer: CityDigitsMap.getStyleFor_MEDIA,
		onEachFeature: function(feature, layer){

		    //add on hover -- same on hover and mousemove for each layer
		    layer.on('mouseover', function(ev) {
				// only have on mouseover work if popup2 isn't open
				if (!activeMap.popup2._isOpen) {
					// close all popups first
					activeMap.map.closePopup();
				}
		    });
		
			// add on click popups for each layer -- these will be different
			layer.on("click",function(ev){
				// close all open popups
				activeMap.map.closePopup();
		
				var lat = feature.geometry.coordinates[1];
				var lng = feature.geometry.coordinates[0];
		
				// set latlng variable
				var latlng = L.latLng(lat, lng);
				// bind popup with data to the feature
				activeMap.popup2.setLatLng(latlng);

				var header = '<div class="map-popup"><a href="/cashcity/media/interview/' + feature.properties.id + '/" style="text-decoration:none; color:inherit"><h4 class="text-left">' + feature.properties.section + '</h4>';
				var mediaBox = '<div style="height: 280px; width: 280px; margin: auto; overflow: hidden;"><img src="' + feature.properties.image + '"></div></a><div style="margin-right: auto; margin-left: auto; margin-top: 10px;"><audio src="' + feature.properties.audio + '" preload="auto" controls></audio></div>';
				var title = '<a href="/cashcity/media/interview/' + feature.properties.id + '/" style="text-decoration:none; color:inherit"><div style="margin-top: 5px"><p class="text-left">' + feature.properties.name + '</p></div></a>';
				var footer = '</div>';
				
				var popupContent = header + mediaBox + title + footer;
		
				activeMap.popup2.setContent(popupContent);
				activeMap.popup2.openOn(activeMap.map);
			});
	
		}
	});	

}

CityDigitsMapOpinion.getStyleFor_MEDIA = function(feature, latlng){
	var mediaImageIcon = L.icon({
	    iconUrl: feature.properties.iconUrl,
	    iconSize: [42, 50],
		iconAnchor: [17, 38], 
	});

	return L.marker(latlng, {icon: mediaImageIcon});
	
}


CityDigitsMapOpinion.loadLayerFor = function(layerId, activeMap, sectionNumber){
	
    if(layerId == "MAP1"){
        mainLayer = activeMap.MAP1_POP_POVERTY;
		mainLayer._leaflet_id = 'legendpoverty';
		mainLayer.addTo(activeMap.map).bringToBack();
	 }	
    if(layerId == "MAP2"){
        mainLayer = activeMap.MAP2_MED_HH_INCOME;
			  mainLayer._leaflet_id = 'legendmedhhinc';
			  mainLayer.addTo(activeMap.map).bringToBack();			
    }	
    if(layerId == "MAP3"){
        mainLayer = activeMap.MAP3_PCT_UNEMPLOYED;
			  mainLayer._leaflet_id = 'legendunemploy';
			  mainLayer.addTo(activeMap.map).bringToBack();
		}	
    if(layerId == "MAP4"){
        mainLayer = activeMap.MAP4_PCT_FOREIGN_BORN;
			  mainLayer._leaflet_id = 'legendforeignborn';
			  mainLayer.addTo(activeMap.map).bringToBack();
		}
    if(layerId == "CREATEMAP1"){
        mainLayer = activeMap.CREATEMAP1_AFI_PER_SQMILE;
			  mainLayer._leaflet_id = 'legendAFIpersqmi';
			  mainLayer.addTo(activeMap.map).bringToBack();
    }
    if(layerId == "CREATEMAP2"){
        mainLayer = activeMap.CREATEMAP2_BANKS_PER_SQMILE;
			 mainLayer._leaflet_id = 'legendbankspersqmi';
			 mainLayer.addTo(activeMap.map).bringToBack();
    }
    if(layerId == "CREATEMAP3"){
        mainLayer = activeMap.CREATEMAP3_PAWN_SHOPS_PER_SQMILE;
		    mainLayer._leaflet_id = 'legendpawnsqmi';
		    mainLayer.addTo(activeMap.map).bringToBack();
    }
    if(layerId == "CREATEMAP4"){
        mainLayer = activeMap.CREATEMAP4_MCDONALDS_PER_SQMILE;
			  mainLayer._leaflet_id = 'legendmcdonaldspersqi';
				mainLayer.addTo(activeMap.map).bringToBack();
    }
    if(layerId == "CREATEMAP5"){
        mainLayer = activeMap.CREATEMAP5_HH_PER_AFI;
			  mainLayer._leaflet_id = 'legendhouseholdsperAFI';
			  mainLayer.addTo(activeMap.map).bringToBack();
    }
    if(layerId == "CREATEMAP6"){
        mainLayer = activeMap.CREATEMAP6_HH_PER_BANK;
		  	mainLayer._leaflet_id = 'legendhouseholdsperbank';
			  mainLayer.addTo(activeMap.map).bringToBack();
    }
    if(layerId == "CREATEMAP7"){
        mainLayer = activeMap.CREATEMAP7_HH_PER_MCDONALDS;
				mainLayer._leaflet_id = 'legendhouseholdsperMcD';
				mainLayer.addTo(activeMap.map).bringToBack();
    }
    if(layerId == "CREATEMAP8"){
        mainLayer = activeMap.CREATEMAP8_HH_PER_PAWN_SHOP;
				mainLayer._leaflet_id = 'legendhouseholdsperpawn';
				mainLayer.addTo(activeMap.map).bringToBack();
    }
    if(layerId == "CREATEMAP9"){
        mainLayer = activeMap.CREATEMAP9_AFIS_PER_BANK;
				mainLayer._leaflet_id = 'legendAFIsperbank';
				mainLayer.addTo(activeMap.map).bringToBack();
    }
    if(layerId == "CREATEMAP10"){
        mainLayer = activeMap.CREATEMAP10_BANKS_PER_AFI;
				mainLayer._leaflet_id = 'legendbanksperAFIs';
				mainLayer.addTo(activeMap.map).bringToBack();
    }

   	//allow legend button to be clicked and show/hide legend
	$('#legend'+sectionNumber).click(function() {
		if (mainLayer != null) {
			var mapid = mainLayer._leaflet_id;
			if ($( "#legendid"+sectionNumber ).hasClass( "legendClosed" )) {
				// change to legend AFI
				$('#legendid'+sectionNumber).attr('class', mapid);	
			} else {
				//Switch back to legend
				$('#legendid'+sectionNumber).attr('class', 'legendClosed');	
			}			
		}
	});


}

CityDigitsMapOpinion.loadLocationsLayerFor = function(layerId, activeMap){
	// add layer requested based on ID
	if (layerId == "LOC1") {
		LOC1 = activeMap.LOC1_PAWN_SHOPS.addTo(activeMap.map).bringToFront();
	}
	if (layerId == "LOC2") {
		LOC2 = activeMap.LOC2_CHECK_CASHING.addTo(activeMap.map).bringToFront();
	}
	if (layerId == "LOC3") {
		LOC3 = activeMap.LOC3_WIRE_TRANSFER.addTo(activeMap.map).bringToFront();
	}
	if (layerId == "LOC4") {
		LOC4 = activeMap.LOC4_BANKS.addTo(activeMap.map).bringToFront();
	}
	if (layerId == "LOC5") {
		LOC5 = activeMap.LOC5_MCDONALDS.addTo(activeMap.map).bringToFront();
	}
	if (layerId == "LOC6") {
		// load subway lines and stops together
		LOC7 = activeMap.LOC7_SUBWAY_STATIONS.addTo(activeMap.map).bringToFront();
		LOC6 = activeMap.LOC6_SUBWAY_LINES.addTo(activeMap.map).bringToFront();
	}
	
}

CityDigitsMapOpinion.loadMediaLayers = function(activeMap){
	
	MEDIA_IMAGES = activeMap.MEDIA_IMAGES.addTo(activeMap.map).bringToFront();
	MEDIA_AUDIO = activeMap.MEDIA_AUDIO.addTo(activeMap.map).bringToFront();
	MEDIA_NOTE = activeMap.MEDIA_NOTE.addTo(activeMap.map).bringToFront();
	MEDIA_INTERVIEW = activeMap.MEDIA_INTERVIEW.addTo(activeMap.map).bringToFront();		

}


CityDigitsMapOpinion.drawChart = function(layerId, sectionNumber){
	// remove chart a tag, which we repace with the svg drawn below
	$("#chart"+sectionNumber).remove();
	
	// change class of chartId div to enlarge and set background white
	$('#chartid'+sectionNumber).attr('class', 'chartDiv opinion');	
	
	//set up container for mouseover interaction
	var div = d3.select("body").append("div")
	    .attr("class", "barchartTooltip")
	    .style("opacity", 1e-6);
		
	//set properties depending on layerid selected	
	if (layerId == 'legendpoverty') {
		var propertyName = 'PovertyPer';
		var formatter = d3.format(".0%");
		var title = 'Percent Population in Poverty';
		var yMin = 0;
	} 
	if (layerId == 'legendmedhhinc') {
		var propertyName = 'MedHouInco';
		var formatNumber = d3.format(",.0f")
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
		var propertyName = 'HH_AFS';
		var formatter = d3.format(",.2f")
		var title = 'Households per Alternative Financial Insitution';
		var yMin = -500;
	} 
	if (layerId == 'legendhouseholdsperbank') {
		var propertyName = 'HH_BANK';
		var formatter = d3.format(",.2f")
		var title = 'Households per Bank';
		var yMin = -500;
	} 
	if (layerId == 'legendhouseholdsperMcD') {
		var propertyName = 'HH_McD';
		var formatter = d3.format(",.2f")
		var title = 'Households per McDonald\'s';
		var yMin = -500;
	} 
	if (layerId == 'legendhouseholdsperpawn') {
		var propertyName = 'HH_PAWN';
		var formatter = d3.format(",.2f")
		var title = 'Households per Pawn Shop';
		var yMin = -999;
	} 
	if (layerId == 'legendAFIsperbank') {
		var propertyName = 'AFS_BANK';
		var formatter = d3.format(",.2f")
		var title = 'Alternative Financial Insitutions per Bank';
		var yMin = -1;
	} 
	if (layerId == 'legendbanksperAFIs') {
		var propertyName = 'BANK_AFS';
		var formatter = d3.format(",.2f")
		var title = 'Banks per Alternative Financial Insitution';
		var yMin = -1;
	} 
	
	
	var margin = {top: 50, right: 20, bottom: 30, left: 70},
			width = 300 - margin.left - margin.right,
	    height = 200 - margin.top - margin.bottom;
	
	var x = d3.scale.ordinal()
	    .rangeBands([0, width], 0, 1);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
		.tickFormat(formatter);
		
	var svg = d3.select("#chartid"+sectionNumber).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
		.attr("id", 'svgChart'+sectionNumber)
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
	      .attr("x", 80)
	      .style("text-anchor", "middle")
	      .text(title);
		  		  
	  svg.append("g")
	      .attr("class", "chartCloseContainer")
		 .append("image")
		  .attr("id", "chartCloseButton"+sectionNumber)
		  .attr("class", "pointer")
		  .attr("xlink:href", closeButtonGray)
		  .attr("y", -40)
		  .attr("x", 200)
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
		  
		  
		  
	  	// close chart when close chart button is clicked
	  	$('#chartCloseButton'+sectionNumber).click(function() {
	  		// remove chart
	  		CityDigitsMapOpinion.removeChart(layerId, sectionNumber);
	  	});

	});
			
}

CityDigitsMapOpinion.removeChart = function(layerId, sectionNumber){
	$( "#svgChart"+sectionNumber ).remove();
	$( "#chartid"+sectionNumber ).append( '<div id="chart'+sectionNumber+'" class="pointer"></div>' );
	// draw chart based on layer selected
	$('#chart'+sectionNumber).click(function() {
		CityDigitsMapOpinion.drawChart(layerId, sectionNumber);
	});
	$( "#chartid"+sectionNumber ).attr('class', 'chart-icon');	
}

	
	
