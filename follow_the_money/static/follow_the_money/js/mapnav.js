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
			}
			if(layerId == 'LOC2' && LOC2 != null) {
				CityDigitsMap.removeLayerFor(LOC2);
				LOC2 = null;
			}
			if(layerId == 'LOC3' && LOC3 != null) {
				CityDigitsMap.removeLayerFor(LOC3);
				LOC3 = null;
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
	        break;
	    case 'Alternative Financial Services':
			$("#var2Select").html("<option value='Banks'>Banks</option><option value='Square Miles'>Square Miles</option>");
			$("#var2Select").selectpicker('refresh');
			$("#normalizationText").html('Alternative Financial Services per Bank');			
	        break;
	    case 'Banks':
			$("#var2Select").html("<option value='Alternative Financial Services'>Alternative Financial Services</option><option value='Square Miles'>Square Miles</option>");
			$("#var2Select").selectpicker('refresh');
			$("#normalizationText").html('Banks per Alternative Financial Service');			
	        break;
	    case 'McDonalds':
			$("#var2Select").html("<option value='Square Miles'>Square Miles</option>");
			$("#var2Select").selectpicker('refresh');
			$("#normalizationText").html('McDonald\'s per Square Mile');			
	        break;
	    case 'Households':
			$("#var2Select").html("<option value='Banks'>Banks</option><option value='Alternative Financial Services'>Alternative Financial Services</option><option value='Pawn Shops'>Pawn Shops</option><option value='McDonalds'>McDonald's</option>");
			$("#var2Select").selectpicker('refresh');
			$("#normalizationText").html('Households per Bank');			
	        break;
	    }
	});

	// change map selections based on change and change normalizationText
	$('#var2Select').change(function() {
	    var value = $(this).val();
		var firstValue = $( "#var1Select" ).val(); // get value of first selection
		
	    switch (value) {
	    case 'Variable 2':
			$("#normalizationText").html('');
	        break;
	    case 'Square Miles':
			$("#normalizationText").html(firstValue + ' per Square Mile');			
	        break;
	    case 'Alternative Financial Services':
			$("#normalizationText").html(firstValue + ' per Alternative Financial Service');			
	        break;
	    case 'Banks':
			$("#normalizationText").html(firstValue + ' per Bank');			
	        break;
	    case 'McDonalds':
			$("#normalizationText").html(firstValue + ' per McDonald\'s');			
	        break;
	    case 'Pawn Shops':
			$("#normalizationText").html(firstValue + ' per Pawn Shop');			
	        break;
	    }
	});



});

