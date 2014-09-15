/**
 * filter.js: setup and applicaiton of filters for media/opinions
 * Author: NiJeL
 */

$( document ).ready(function() {

	// set up select pickers for filters for style
	$('#type').selectpicker();
	$('#type').addClass('white').selectpicker('setStyle');
	onChangeListener();	
	
	
	// add event listeners to run functions on change
	function onChangeListener() {
		$("#type").on("change", function(e){
		    //get search values
			var type = $("#type").val();
			var tags = $("#tags").val();
		    //reload media
		    loadMedia(type, tags);
		});				
		
		$( ".ui-autocomplete-input" ).keydown(function(e) {
		    var code = e.which;
		    if(code==13)e.preventDefault();
		    if(code==13){
			    //get search values
				var type = $("#type").val();
				var tags = $("#tags").val();
			    loadMedia(type, tags);
		    } // missing closing if brace

		});
		
	}

	
	// functions that are run on change
	function loadMedia(type, tags){
	    $.ajax({
	        type: 'GET',
	        url:  'filter/?type=' + type + '&tags=' + tags,
	        success: function(data){
	            $(".media-content-container").html(data);
				// refresh bootstrap dropdown menus
				//$('.dropdown-toggle').dropdown();
				// refresh select picker
				$('#type').selectpicker('refresh');
				$('#type').addClass('white').selectpicker('setStyle');
				onChangeListener();
	        }
	    });
	}
	
});



