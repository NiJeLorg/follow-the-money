/**
 * filter.js: setup and applicaiton of filters for media/opinions
 * Author: NiJeL
 */

$( document ).ready(function() {

	// set up select pickers for filters for style
	$('#type').selectpicker();
	$('#class').selectpicker();
	$('#team').selectpicker();
	$('#type').addClass('white').selectpicker('setStyle');
	$('#class').addClass('white').selectpicker('setStyle');
	$('#team').addClass('white').selectpicker('setStyle');
	onChangeListener();
	
	
	// add event listeners to run functions on change
	function onChangeListener() {
		$("#type").on("change", function(e){
		    //get search values
			var type = $("#type").val();
			var classes = $("#class").val();
			var team = $("#team").val();
		    //reload media
		    loadMedia(type, classes, team);
		});		

		$("#class").on("change", function(e){
		    //get search values
			var type = $("#type").val();
			var classes = $("#class").val();
			var team = $("#team").val();
		    //reload media
		    loadMedia(type, classes, team);
		});		

		$("#team").on("change", function(e){
		    //get search values
			var type = $("#type").val();
			var classes = $("#class").val();
			var team = $("#team").val();
		    //reload media
		    loadMedia(type, classes, team);
		});		

	}

	
	// functions that are run on change
	function loadMedia(type, classes, team){
	    $.ajax({
	        type: 'GET',
	        url:  'filter/?type=' + type + '&class=' + classes + '&team=' + team,
	        success: function(data){
	            $(".stubs-container").html(data);
				// refresh bootstrap dropdown menus
				//$('.dropdown-toggle').dropdown();
				// refresh select picker
				$('#type').selectpicker('refresh');
				$('#class').selectpicker('refresh');
				$('#team').selectpicker('refresh');
				$('#type').addClass('white').selectpicker('setStyle');
				$('#class').addClass('white').selectpicker('setStyle');
				$('#team').addClass('white').selectpicker('setStyle');
				onChangeListener();
	        }
	    });
	}
	


});

