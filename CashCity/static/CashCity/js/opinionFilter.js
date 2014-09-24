/**
 * filter.js: setup and applicaiton of filters for media/opinions
 * Author: NiJeL
 */

$( document ).ready(function() {

	// set up select pickers for filters for style
	$('#class').selectpicker();
	$('#team').selectpicker();
	$('#class').addClass('white').selectpicker('setStyle');
	$('#team').addClass('white').selectpicker('setStyle');
	onChangeListener();	
	
	
	// add event listeners to run functions on change
	function onChangeListener() {
		$("#class").on("change", function(e){
		    //get search values
			var classes = $("#class").val();
			var team = $("#team").val();
		    //reload media
		    loadOpinions(classes, team);
		});		

		$("#team").on("change", function(e){
		    //get search values
			var classes = $("#class").val();
			var team = $("#team").val();
		    //reload media
		    loadOpinions(classes, team);
		});	
				
	}

	
	// functions that are run on change
	function loadOpinions(classes, team){
	    $.ajax({
	        type: 'GET',
	        url:  'filter/?class=' + classes + '&team=' + team,
	        success: function(data){
	            $(".opinion-content-container").html(data);
				// refresh bootstrap dropdown menus
				//$('.dropdown-toggle').dropdown();
				// refresh select picker
				$('#class').selectpicker('refresh');
				$('#team').selectpicker('refresh');
				$('#class').addClass('white').selectpicker('setStyle');
				$('#team').addClass('white').selectpicker('setStyle');
				onChangeListener();
	        }
	    });
	}
	
});



