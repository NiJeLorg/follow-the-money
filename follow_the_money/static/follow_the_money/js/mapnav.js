/**
 * mapnav.js: handles all javascript associated with the map nav
 * Loaded when map nav is called after all other javascript is loaded
 * Author: NiJeL
 */


/*
 * Toggle map location layers
 */

$( document ).ready(function() {

	$("input[name='locations']").change( function() {
		var layerId = $(this).attr("id");
				
	    if($(this).is(":checked") && layerId != 'All_AFS') {
			CityDigitsMap.loadLocationsLayerFor(layerId);
	    } else {
			if(layerId == 'LOC1' && LOC1 != null) {
				CityDigitsMap.removeLayerFor(LOC1);
				LOC1 = null;
				$('#All_AFS').prop('checked', false);
			}
			if(layerId == 'LOC2' && LOC2 != null) {
				CityDigitsMap.removeLayerFor(LOC2);
				LOC2 = null;
				$('#All_AFS').prop('checked', false);
			}
			if(layerId == 'LOC3' && LOC3 != null) {
				CityDigitsMap.removeLayerFor(LOC3);
				LOC3 = null;
				$('#All_AFS').prop('checked', false);
			}
			if(layerId == 'LOC4' && LOC4 != null) {
				CityDigitsMap.removeLayerFor(LOC4);
				LOC4 = null;
			}
			if(layerId == 'LOC5' && LOC5 != null) {
				CityDigitsMap.removeLayerFor(LOC5);
				LOC5 = null;
			}
			if(layerId == 'LOC6' && LOC6 != null) {
				CityDigitsMap.removeLayerFor(LOC6);
				LOC6 = null;
			}
	    }
		
		// add all three layers (pawn shops, check cashing and wire transfer) when AFS is checked
		if (layerId == 'All_AFS') {
			if($(this).is(":checked")) {
				if(LOC1 == null) {
					 $('#LOC1').prop('checked', true);
					 CityDigitsMap.loadLocationsLayerFor('LOC1');
				}
				if(LOC2 == null) {
					 $('#LOC2').prop('checked', true);
					 CityDigitsMap.loadLocationsLayerFor('LOC2');
				}
				if(LOC3 == null) {
					 $('#LOC3').prop('checked', true);
					 CityDigitsMap.loadLocationsLayerFor('LOC3');
				}
			} else {
				if(LOC1 != null) {
					$('#LOC1').prop('checked', false);
					CityDigitsMap.removeLayerFor(LOC1);
					LOC1 = null;
				}
				if(LOC2 != null) {
					$('#LOC2').prop('checked', false);
					CityDigitsMap.removeLayerFor(LOC2);
					LOC2 = null;
				}
				if(LOC3 != null) {
					$('#LOC3').prop('checked', false);
					CityDigitsMap.removeLayerFor(LOC3);
					LOC3 = null;
				}				
			}
			
		}
		
		if (LOC1 != null && LOC2 != null && LOC3 != null) {
			$('#All_AFS').prop('checked', true);
		}
		
	});
	
	$( "input[name='maps']" ).change( function() {
		var layerId = $(this).attr("id");
		
	    if(mainLayer != null){
			CityDigitsMap.removeLayerFor(mainLayer);
			mainLayer = null;
	    }
		
	    if($(this).is(":checked")) {
			CityDigitsMap.loadLayerFor(layerId);	
	    } 
		
		// ensure only one checkbox is checked at a time
		if ($(this).attr("id") == 'MAP1' && $(this).is(":checked")) {
			$('#MAP2').prop('checked', false);
			$('#MAP3').prop('checked', false);
			$('#MAP4').prop('checked', false);			
		} else if ($(this).attr("id") == 'MAP2' && $(this).is(":checked")) {
			$('#MAP1').prop('checked', false);
			$('#MAP3').prop('checked', false);
			$('#MAP4').prop('checked', false);						
		} else if ($(this).attr("id") == 'MAP3' && $(this).is(":checked")) {
			$('#MAP1').prop('checked', false);
			$('#MAP2').prop('checked', false);
			$('#MAP4').prop('checked', false);						
		} else if ($(this).attr("id") == 'MAP4' && $(this).is(":checked")) {
			$('#MAP1').prop('checked', false);
			$('#MAP2').prop('checked', false);
			$('#MAP3').prop('checked', false);						
		}
		
				
	});
	
	// Enable Bootstrap-Select
	$('#var1Select').selectpicker();
	$('#var1Select').selectpicker('val', 'Variable 1');
	$('#var2Select').selectpicker();
	$('#var2Select').selectpicker('val', 'Variable 2');
	
	// populate the second dropdown menu based on the first selection and mape map selections
	$('#var1Select').change(function() {
	    var value = $(this).val();
		
		// remove layer already present if there is one
	    if(mainLayer != null){
			CityDigitsMap.removeLayerFor(mainLayer);
			mainLayer = null;
	    }
		
		// ensure that the maps are unchecked
		$('#MAP1').prop('checked', false);		
		$('#MAP2').prop('checked', false);
		$('#MAP3').prop('checked', false);
		$('#MAP4').prop('checked', false);			
		
		
	    switch (value) {
	    case 'Variable1':
			$("#var2Select").html("<option value='Variable 2' class='grey'>Variable 2</option>");
			$("#var2Select").selectpicker('refresh');
			$("#normalizationText").html('');
	        break;
	    case 'Pawn Shops':
			$("#var2Select").html("<option value='Square Miles'>Square Miles</option>");
			$("#var2Select").selectpicker('refresh');
			$("#normalizationText").html('Pawn Shops per Square Mile');	
			CityDigitsMap.loadLayerFor('CREATEMAP3');
	        break;
	    case 'Alternative Financial Insitutions':
			$("#var2Select").html("<option value='Banks'>Banks</option><option value='Square Miles'>Square Miles</option>");
			$("#var2Select").selectpicker('refresh');
			$("#normalizationText").html('Alternative Financial Insitutions per Bank');	
			CityDigitsMap.loadLayerFor('CREATEMAP9');		
	        break;
	    case 'Banks':
			$("#var2Select").html("<option value='Alternative Financial Insitutions'>Alternative Financial Insitutions</option><option value='Square Miles'>Square Miles</option>");
			$("#var2Select").selectpicker('refresh');
			$("#normalizationText").html('Banks per Alternative Financial Institution');
			CityDigitsMap.loadLayerFor('CREATEMAP10');			
	        break;
	    case 'McDonalds':
			$("#var2Select").html("<option value='Square Miles'>Square Miles</option>");
			$("#var2Select").selectpicker('refresh');
			$("#normalizationText").html('McDonald\'s per Square Mile');
			CityDigitsMap.loadLayerFor('CREATEMAP4');			
	        break;
	    case 'Households':
			$("#var2Select").html("<option value='Banks'>Banks</option><option value='Alternative Financial Insitutions'>Alternative Financial Insitutions</option><option value='Pawn Shops'>Pawn Shops</option><option value='McDonalds'>McDonald's</option>");
			$("#var2Select").selectpicker('refresh');
			$("#normalizationText").html('Households per Bank');			
			CityDigitsMap.loadLayerFor('CREATEMAP6');			
	        break;
	    }
	});

	// change map selections based on change and change normalizationText
	$('#var2Select').change(function() {
	    var value = $(this).val();
		
		// remove layer already present if there is one
	    if(mainLayer != null){
			CityDigitsMap.removeLayerFor(mainLayer);
			mainLayer = null;
	    }
		
		// ensure that the maps are unchecked
		$('#MAP1').prop('checked', false);		
		$('#MAP2').prop('checked', false);
		$('#MAP3').prop('checked', false);
		$('#MAP4').prop('checked', false);	
		
		var firstValue = $( "#var1Select" ).val(); // get value of first selection
		
	    switch (value) {
	    case 'Variable 2':
			$("#normalizationText").html('');
	        break;
	    case 'Square Miles':
			$("#normalizationText").html(firstValue + ' per Square Mile');
			if (firstValue == 'Pawn Shops') {
				CityDigitsMap.loadLayerFor('CREATEMAP6');
			} else if (firstValue == 'Alternative Financial Insitutions') {
				CityDigitsMap.loadLayerFor('CREATEMAP1');
			} else if (firstValue == 'Banks') {
				CityDigitsMap.loadLayerFor('CREATEMAP2');
			} else if (firstValue == 'McDonalds') {
				CityDigitsMap.loadLayerFor('CREATEMAP4');
			} else if (firstValue == 'Households') {
			}						
	        break;
	    case 'Alternative Financial Insitutions':
			$("#normalizationText").html(firstValue + ' per Alternative Financial Institution');
			if (firstValue == 'Pawn Shops') {
			} else if (firstValue == 'Alternative Financial Insitutions') {
			} else if (firstValue == 'Banks') {
				CityDigitsMap.loadLayerFor('CREATEMAP10');
			} else if (firstValue == 'McDonalds') {
			} else if (firstValue == 'Households') {
				CityDigitsMap.loadLayerFor('CREATEMAP5');
			}		
	        break;
	    case 'Banks':
			$("#normalizationText").html(firstValue + ' per Bank');
			if (firstValue == 'Pawn Shops') {
			} else if (firstValue == 'Alternative Financial Insitutions') {
				CityDigitsMap.loadLayerFor('CREATEMAP9');
			} else if (firstValue == 'Banks') {
			} else if (firstValue == 'McDonalds') {
			} else if (firstValue == 'Households') {
				CityDigitsMap.loadLayerFor('CREATEMAP6');
			}									
	        break;
	    case 'McDonalds':
			$("#normalizationText").html(firstValue + ' per McDonald\'s');
			if (firstValue == 'Pawn Shops') {
			} else if (firstValue == 'Alternative Financial Insitutions') {
			} else if (firstValue == 'Banks') {
			} else if (firstValue == 'McDonalds') {
			} else if (firstValue == 'Households') {
				CityDigitsMap.loadLayerFor('CREATEMAP7');
			}
	        break;
	    case 'Pawn Shops':
			$("#normalizationText").html(firstValue + ' per Pawn Shop');
			if (firstValue == 'Pawn Shops') {
			} else if (firstValue == 'Alternative Financial Insitutions') {
			} else if (firstValue == 'Banks') {
			} else if (firstValue == 'McDonalds') {
			} else if (firstValue == 'Households') {
				CityDigitsMap.loadLayerFor('CREATEMAP8');
			}			
	        break;
	    }
	});

	// draw chart based on layer selected
	$('#chart').click(function() {
		// get id of layer selected
		var layerId = mainLayer._leaflet_id;
		if (!mainChart) {
			// draw chart
			CityDigitsMap.drawChart(layerId);
		} else {
			// remove chart
			CityDigitsMap.removeChart(layerId);
		}		
	});

	//allow legend button to be clicked and show legend
	$('#legend').click(function() {
		var mapid = mainLayer._leaflet_id;
		if ($( "#legendid" ).hasClass( "legendClosed" )) {
			// change to legend AFI
			$('#legendid').attr('class', mapid);	
		} else {
			//Switch back to legend
			$('#legendid').attr('class', 'legendClosed');	
		}
	});


});

