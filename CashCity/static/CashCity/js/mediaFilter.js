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
	refreshOnCloseTag();
	
	
	// add event listeners to run functions on change
	function onChangeListener() {
		$("#type").on("change", function(e){
		    //get search values
			var type = $("#type").val();
			var classes = $("#class").val();
			var team = $("#team").val();
			var tags = $("#tags").val();
		    //reload media
		    loadMedia(type, classes, team, tags);
		});		

		$("#class").on("change", function(e){
		    //get search values
			var type = $("#type").val();
			var classes = $("#class").val();
			var team = $("#team").val();
			var tags = $("#tags").val();
		    //reload media
		    loadMedia(type, classes, team, tags);
		});		

		$("#team").on("change", function(e){
		    //get search values
			var type = $("#type").val();
			var classes = $("#class").val();
			var team = $("#team").val();
			var tags = $("#tags").val();
		    //reload media
		    loadMedia(type, classes, team, tags);
		});	
		
		
		$( ".ui-autocomplete-input" ).keydown(function(e) {
			console.log(e.which);
		    var code = e.which;
		    if(code==13)e.preventDefault();
		    if(code==13){
			    //get search values
				var type = $("#type").val();
				var classes = $("#class").val();
				var team = $("#team").val();
				var tags = $("#tags").val();
			    loadMedia(type, classes, team, tags);
		    } // missing closing if brace

		});

		// share media with all teams
		$(".imageShare").on("change", function(e){
			$(this).is(':checked')
		    //get search values
			var mediaID = $(".imageShare").val();
			// send ajax
			if ($(this).is(':checked')) {
				$.ajax({
			        type: 'GET',
			        url:  '/cashcity/media/share/image/' + mediaID + '/',
			        success: function(data){}
			    });				
			} else {
				$.ajax({
			        type: 'GET',
			        url:  '/cashcity/media/unshare/image/' + mediaID + '/',
			        success: function(data){}
			    });								
			}
		});

		$(".interviewShare").on("change", function(e){
			$(this).is(':checked')
		    //get search values
			var mediaID = $(".interviewShare").val();
			// send ajax
			if ($(this).is(':checked')) {
				$.ajax({
			        type: 'GET',
			        url:  '/cashcity/media/share/interview/' + mediaID + '/',
			        success: function(data){}
			    });				
			} else {
				$.ajax({
			        type: 'GET',
			        url:  '/cashcity/media/unshare/interview/' + mediaID + '/',
			        success: function(data){}
			    });								
			}
		});	

		$(".audioShare").on("change", function(e){
			$(this).is(':checked')
		    //get search values
			var mediaID = $(".audioShare").val();
			// send ajax
			if ($(this).is(':checked')) {
				$.ajax({
			        type: 'GET',
			        url:  '/cashcity/media/share/audio/' + mediaID + '/',
			        success: function(data){}
			    });				
			} else {
				$.ajax({
			        type: 'GET',
			        url:  '/cashcity/media/unshare/audio/' + mediaID + '/',
			        success: function(data){}
			    });								
			}
		});	

		$(".noteShare").on("change", function(e){
			$(this).is(':checked')
		    //get search values
			var mediaID = $(".noteShare").val();
			// send ajax
			if ($(this).is(':checked')) {
				$.ajax({
			        type: 'GET',
			        url:  '/cashcity/media/share/note/' + mediaID + '/',
			        success: function(data){}
			    });				
			} else {
				$.ajax({
			        type: 'GET',
			        url:  '/cashcity/media/unshare/note/' + mediaID + '/',
			        success: function(data){}
			    });								
			}
		});	

		
	}
	
	// refresh media when tagit items are x-ed out
	function refreshOnCloseTag() {
		$( ".tagit-close" ).on("remove", function () {
		    //get search values
		    //get search values
			var type = $("#type").val();
			var classes = $("#class").val();
			var team = $("#team").val();
			var tags = $("#tags").val();
		    loadMedia(type, classes, team, tags);
						
		});
		
	}

	
	// functions that are run on change
	function loadMedia(type, classes, team, tags){
	    $.ajax({
	        type: 'GET',
	        url:  'filter/?type=' + type + '&class=' + classes + '&team=' + team + '&tags=' + tags,
	        success: function(data){
	            $(".media-content-container").html(data);
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
				refreshOnCloseTag();
	        }
	    });
	}
	
});



