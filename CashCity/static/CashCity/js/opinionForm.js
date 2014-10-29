/**
 * form.js: javascript that controls actions on forms
 * Author: NiJeL
 */

$(document).ready( function() {
	
	// select image tab on page load
	$('.shouldbeActive').addClass('active');
	
	// ensure that sections are hidden if no data are in the section
	if ( ( $('#id_form-1-image').val() == '' ) && ( $('#id_form-1-audio').val() == '' ) && ( $('#id_form-1-note').val() == '' ) &&  ( $('#id_form-1-interview').val() == '' ) && ( $('#id_form-1-mapSnap').val() == '' ) && ( $('#readonlyField_2').attr('placeholder') == 'Nothing Selected' )  ){
		$('#section_1').hide();		
	}
	if ( ( $('#id_form-2-image').val() == '' ) && ( $('#id_form-2-audio').val() == '' ) && ( $('#id_form-2-note').val() == '' ) &&  ( $('#id_form-2-interview').val() == '' ) && ( $('#id_form-2-mapSnap').val() == '' ) && ( $('#readonlyField_3').attr('placeholder') == 'Nothing Selected' )  ){
		$('#section_2').hide();		
	}

	if ( ( $('#id_form-3-image').val() == '' ) && ( $('#id_form-3-audio').val() == '' ) && ( $('#id_form-3-note').val() == '' ) &&  ( $('#id_form-3-interview').val() == '' ) && ( $('#id_form-3-mapSnap').val() == '' ) && ( $('#readonlyField_4').attr('placeholder') == 'Nothing Selected' )  ){
		$('#section_3').hide();		
	}

	if ( ( $('#id_form-4-image').val() == '' ) && ( $('#id_form-4-audio').val() == '' ) && ( $('#id_form-4-note').val() == '' ) &&  ( $('#id_form-4-interview').val() == '' ) && ( $('#id_form-4-mapSnap').val() == '' ) && ( $('#readonlyField_5').attr('placeholder') == 'Nothing Selected' )  ){
		$('#section_4').hide();		
	}
		
	// hide form fields that django needs for storing opinions
	$('#id_form-0-sectionNumber').hide();
	$('#id_form-0-image').hide();
	$('#id_form-0-audio').hide();
	$('#id_form-0-note').hide();
	$('#id_form-0-interview').hide();
	$('#id_form-0-mapSnap').hide();
	
	$('#id_form-1-sectionNumber').hide();
	$('#id_form-1-image').hide();
	$('#id_form-1-audio').hide();
	$('#id_form-1-note').hide();
	$('#id_form-1-interview').hide();
	$('#id_form-1-mapSnap').hide();
	
	$('#id_form-2-sectionNumber').hide();
	$('#id_form-2-image').hide();
	$('#id_form-2-audio').hide();
	$('#id_form-2-note').hide();
	$('#id_form-2-interview').hide();
	$('#id_form-2-mapSnap').hide();
	
	$('#id_form-3-sectionNumber').hide();
	$('#id_form-3-image').hide();
	$('#id_form-3-audio').hide();
	$('#id_form-3-note').hide();
	$('#id_form-3-interview').hide();
	$('#id_form-3-mapSnap').hide();
	
	$('#id_form-4-sectionNumber').hide();
	$('#id_form-4-image').hide();
	$('#id_form-4-audio').hide();
	$('#id_form-4-note').hide();
	$('#id_form-4-interview').hide();
	$('#id_form-4-mapSnap').hide();
	
	// add section numbers to form field
	$('#id_form-0-sectionNumber').val(1);
	$('#id_form-1-sectionNumber').val(2);
	$('#id_form-2-sectionNumber').val(3);
	$('#id_form-3-sectionNumber').val(4);
	$('#id_form-4-sectionNumber').val(5);
	
	
	// add sections
	$('#addSection_1').click(function() {
		$('#section_1').show();
		$('#addSection_1').attr("disabled","disabled");
	});	

	$('#addSection_2').click(function() {
		$('#section_2').show();
		$('#addSection_2').attr("disabled","disabled");
	});	

	$('#addSection_3').click(function() {
		$('#section_3').show();
		$('#addSection_3').attr("disabled","disabled");
	});	

	$('#addSection_4').click(function() {
		$('#section_4').show();
		$('#addSection_4').attr("disabled","disabled");
	});
	
	// remove sections
	$('#removeSection_0').click(function() {
		// set form data to null
		$('#id_form-0-image').val(null);
		$('#id_form-0-audio').val(null);
		$('#id_form-0-note').val(null);
		$('#id_form-0-interview').val(null);
		$('#id_form-0-mapSnap').val(null);
		$('#id_form-0-text').val(null);
		// ensure all media is deselected
        $(".imageSelect_1").removeClass('active');
        $(".audioSelect_1").removeClass('active');
        $(".noteSelect_1").removeClass('active');
        $(".interviewSelect_1").removeClass('active');
		// ensure map snap is not selected
        $(".mapSnapSelect_1").removeClass('active');
		// remove any uploaded images
		resetFormElement( $('#id_form-0-uploadImage') );			
		resetFormElement( $('#readonlyField_1') );			
		// reset the name of selected in the form field to "Nothing selected"
		$('#readonlyField_1').attr('placeholder', 'Nothing Selected');
		selected_1 = false;				
	});	
	
	$('#removeSection_1').click(function() {
		// set form data to null
		$('#id_form-1-image').val(null);
		$('#id_form-1-audio').val(null);
		$('#id_form-1-note').val(null);
		$('#id_form-1-interview').val(null);
		$('#id_form-1-mapSnap').val(null);
		$('#id_form-1-text').val(null);
		// ensure all media is deselected
        $(".imageSelect_2").removeClass('active');
        $(".audioSelect_2").removeClass('active');
        $(".noteSelect_2").removeClass('active');
        $(".interviewSelect_2").removeClass('active');
		// ensure map snap is not selected
        $(".mapSnapSelect_2").removeClass('active');
		// remove any uploaded images
		resetFormElement( $('#id_form-1-uploadImage') );			
		resetFormElement( $('#readonlyField_2') );			
		// reset the name of selected in the form field to "Nothing selected"
		$('#readonlyField_2').attr('placeholder', 'Nothing Selected');
		selected_2 = false;
		// close section 2 and re-enable
		$('#section_1').hide();
		$('#addSection_1').removeAttr("disabled");	 				
	});	
	
	$('#removeSection_2').click(function() {
		// set form data to null
		$('#id_form-2-image').val(null);
		$('#id_form-2-audio').val(null);
		$('#id_form-2-note').val(null);
		$('#id_form-2-interview').val(null);
		$('#id_form-2-mapSnap').val(null);
		$('#id_form-2-text').val(null);
		// ensure all media is deselected
        $(".imageSelect_3").removeClass('active');
        $(".audioSelect_3").removeClass('active');
        $(".noteSelect_3").removeClass('active');
        $(".interviewSelect_3").removeClass('active');
		// ensure map snap is not selected
        $(".mapSnapSelect_3").removeClass('active');
		// remove any uploaded images
		resetFormElement( $('#id_form-2-uploadImage') );			
		resetFormElement( $('#readonlyField_3') );			
		// reset the name of selected in the form field to "Nothing selected"
		$('#readonlyField_3').attr('placeholder', 'Nothing Selected');
		selected_3 = false;
		// close section 2 and re-enable
		$('#section_2').hide();
		$('#addSection_2').removeAttr("disabled");	 				
	});	
	
	$('#removeSection_3').click(function() {
		// set form data to null
		$('#id_form-3-image').val(null);
		$('#id_form-3-audio').val(null);
		$('#id_form-3-note').val(null);
		$('#id_form-3-interview').val(null);
		$('#id_form-3-mapSnap').val(null);
		$('#id_form-3-text').val(null);
		// ensure all media is deselected
        $(".imageSelect_4").removeClass('active');
        $(".audioSelect_4").removeClass('active');
        $(".noteSelect_4").removeClass('active');
        $(".interviewSelect_4").removeClass('active');
		// ensure map snap is not selected
        $(".mapSnapSelect_4").removeClass('active');
		// remove any uploaded images
		resetFormElement( $('#id_form-3-uploadImage') );			
		resetFormElement( $('#readonlyField_4') );			
		// reset the name of selected in the form field to "Nothing selected"
		$('#readonlyField_4').attr('placeholder', 'Nothing Selected');
		selected_4 = false;
		// close section 2 and re-enable
		$('#section_3').hide();
		$('#addSection_3').removeAttr("disabled");	 				
	});	
	
	$('#removeSection_4').click(function() {
		// set form data to null
		$('#id_form-4-image').val(null);
		$('#id_form-4-audio').val(null);
		$('#id_form-4-note').val(null);
		$('#id_form-4-interview').val(null);
		$('#id_form-4-mapSnap').val(null);
		$('#id_form-4-text').val(null);
		// ensure all media is deselected
        $(".imageSelect_5").removeClass('active');
        $(".audioSelect_5").removeClass('active');
        $(".noteSelect_5").removeClass('active');
        $(".interviewSelect_5").removeClass('active');
		// ensure map snap is not selected
        $(".mapSnapSelect_5").removeClass('active');
		// remove any uploaded images
		resetFormElement( $('#id_form-4-uploadImage') );			
		resetFormElement( $('#readonlyField_5') );			
		// reset the name of selected in the form field to "Nothing selected"
		$('#readonlyField_5').attr('placeholder', 'Nothing Selected');
		selected_5 = false;
		// close section 2 and re-enable
		$('#section_4').hide();
		$('#addSection_4').removeAttr("disabled");	 				
	});			
	
	//submit buttons
	var selected_1 = false;
	$('#submit_1').click(function() {
		// alert if nothing selected 
		if (selected_1) {
			// close modal
			$('#sectionmedia_1').modal('hide')
		} else {
			// alert
			alert('Nothing has been selected. Please select media, map snaps or upload a new image.');
		}
	});

	$('#submitmap_1').click(function() {
		// alert if nothing selected 
		if (selected_1) {
			// close modal
			$('#sectionmapsnaps_1').modal('hide')
		} else {
			// alert
			alert('Nothing has been selected. Please select media, map snaps or upload a new image.');
		}
	});
	
	
	var selected_2 = false;
	$('#submit_2').click(function() {
		// alert if nothing selected 
		if (selected_2) {
			// close modal
			$('#sectionmedia_2').modal('hide')
		} else {
			// alert
			alert('Nothing has been selected. Please select media, map snaps or upload a new image.');
		}
	});

	$('#submitmap_2').click(function() {
		// alert if nothing selected 
		if (selected_2) {
			// close modal
			$('#sectionmapsnaps_2').modal('hide')
		} else {
			// alert
			alert('Nothing has been selected. Please select media, map snaps or upload a new image.');
		}
	});
	
	
	var selected_3 = false;
	$('#submit_3').click(function() {
		// alert if nothing selected 
		if (selected_3) {
			// close modal
			$('#sectionmedia_3').modal('hide')
		} else {
			// alert
			alert('Nothing has been selected. Please select media, map snaps or upload a new image.');
		}
	});
	
	$('#submitmap_3').click(function() {
		// alert if nothing selected 
		if (selected_3) {
			// close modal
			$('#sectionmapsnaps_3').modal('hide')
		} else {
			// alert
			alert('Nothing has been selected. Please select media, map snaps or upload a new image.');
		}
	});
	
	
	var selected_4 = false;
	$('#submit_4').click(function() {
		// alert if nothing selected 
		if (selected_4) {
			// close modal
			$('#sectionmedia_4').modal('hide')
		} else {
			// alert
			alert('Nothing has been selected. Please select media, map snaps or upload a new image.');
		}
	});

	$('#submitmap_4').click(function() {
		// alert if nothing selected 
		if (selected_4) {
			// close modal
			$('#sectionmapsnaps_4').modal('hide')
		} else {
			// alert
			alert('Nothing has been selected. Please select media, map snaps or upload a new image.');
		}
	});


	var selected_5 = false;
	$('#submit_5').click(function() {
		// alert if nothing selected 
		if (selected_5) {
			// close modal
			$('#sectionmedia_5').modal('hide')
		} else {
			// alert
			alert('Nothing has been selected. Please select media, map snaps or upload a new image.');
		}
	});
	
	$('#submitmap_5').click(function() {
		// alert if nothing selected 
		if (selected_5) {
			// close modal
			$('#sectionmapsnaps_5').modal('hide')
		} else {
			// alert
			alert('Nothing has been selected. Please select media, map snaps or upload a new image.');
		}
	});

		
	// highlighting for section 1
	$(".imageSelect_1").click(function() {
		if ($(this).hasClass("active")) {
			$(this).removeClass('active');
			$('#id_form-0-image').val(null);
			$('#readonlyField_1').attr('placeholder', 'Nothing Selected');
			selected_1 = false;
		} else {			
			// remove all other active classes and set clicked to active
	        $(".imageSelect_1").removeClass('active');
	        $(".audioSelect_1").removeClass('active');
	        $(".noteSelect_1").removeClass('active');
	        $(".interviewSelect_1").removeClass('active');
	        $(".mapSnapSelect_1").removeClass('active');
			$(this).addClass('active');
			// set other values to null
			$('#id_form-0-image').val(this.id);
			$('#id_form-0-audio').val(null);
			$('#id_form-0-note').val(null);
			$('#id_form-0-interview').val(null);
			$('#id_form-0-mapSnap').val(null);
			// remove any uploaded images
			resetFormElement( $('#id_form-0-uploadImage') );			
			resetFormElement( $('#readonlyField_1') );			
			// set name of selected in the form field
			$('#readonlyField_1').attr('placeholder', this.title);
			selected_1 = true;			
		}
	});

	$(".audioSelect_1").click(function() {
		if ($(this).hasClass("active")) {
			$(this).removeClass('active');
			$('#id_form-0-audio').val(null);
			$('#readonlyField_1').attr('placeholder', 'Nothing Selected');
			selected_1 = false;
		} else {
			// remove all other active classes and set clicked to active
	        $(".imageSelect_1").removeClass('active');
	        $(".audioSelect_1").removeClass('active');
	        $(".noteSelect_1").removeClass('active');
	        $(".interviewSelect_1").removeClass('active');
	        $(".mapSnapSelect_1").removeClass('active');
			$(this).addClass('active');
			// set other values to null
			$('#id_form-0-image').val(null);
			$('#id_form-0-audio').val(this.id);
			$('#id_form-0-note').val(null);
			$('#id_form-0-interview').val(null);
			$('#id_form-0-mapSnap').val(null);
			// remove any uploaded images
			resetFormElement( $('#id_form-0-uploadImage') );			
			resetFormElement( $('#readonlyField_1') );			
			// set name of selected in the form field
			$('#readonlyField_1').attr('placeholder', this.title);
			selected_1 = true;
		}
	});

	$(".noteSelect_1").click(function() {
		if ($(this).hasClass("active")) {
			$(this).removeClass('active');
			$('#id_form-0-note').val(null);
			$('#readonlyField_1').attr('placeholder', 'Nothing Selected');
			selected_1 = false;
		} else {
			// remove all other active classes and set clicked to active
	        $(".imageSelect_1").removeClass('active');
	        $(".audioSelect_1").removeClass('active');
	        $(".noteSelect_1").removeClass('active');
	        $(".interviewSelect_1").removeClass('active');
	        $(".mapSnapSelect_1").removeClass('active');
			$(this).addClass('active');
			// set other values to null
			$('#id_form-0-image').val(null);
			$('#id_form-0-audio').val(null);
			$('#id_form-0-note').val(this.id);
			$('#id_form-0-interview').val(null);
			$('#id_form-0-mapSnap').val(null);
			// remove any uploaded images
			resetFormElement( $('#id_form-0-uploadImage') );			
			resetFormElement( $('#readonlyField_1') );			
			// set name of selected in the form field
			$('#readonlyField_1').attr('placeholder', this.title);
			selected_1 = true;
		}
	});
	
	$(".interviewSelect_1").click(function() {
		if ($(this).hasClass("active")) {
			$(this).removeClass('active');
			$('#id_form-0-interview').val(null);
			$('#readonlyField_1').attr('placeholder', 'Nothing Selected');
			selected_1 = false;
		} else {			
			console.log(this);
			// remove all other active classes and set clicked to active
	        $(".imageSelect_1").removeClass('active');
	        $(".audioSelect_1").removeClass('active');
	        $(".noteSelect_1").removeClass('active');
	        $(".interviewSelect_1").removeClass('active');
	        $(".mapSnapSelect_1").removeClass('active');
			$(this).addClass('active');
			// set other values to null
			$('#id_form-0-image').val(null);
			$('#id_form-0-audio').val(null);
			$('#id_form-0-note').val(null);
			$('#id_form-0-interview').val(this.id);
			$('#id_form-0-mapSnap').val(null);
			// remove any uploaded images
			resetFormElement( $('#id_form-0-uploadImage') );			
			resetFormElement( $('#readonlyField_1') );			
			// set name of selected in the form field
			$('#readonlyField_1').attr('placeholder', this.title);
			selected_1 = true;
		}
	});
	
	$(".mapSnapSelect_1").click(function() {
		if ($(this).hasClass("active")) {
			$(this).removeClass('active');
			$('#id_form-0-mapSnap').val(null);
			$('#readonlyField_1').attr('placeholder', 'Nothing Selected');
			selected_1 = false;
		} else {
			// remove all other active classes and set clicked to active
	        $(".imageSelect_1").removeClass('active');
	        $(".audioSelect_1").removeClass('active');
	        $(".noteSelect_1").removeClass('active');
	        $(".interviewSelect_1").removeClass('active');
	        $(".mapSnapSelect_1").removeClass('active');
			$(this).addClass('active');
			// get id num
			var id = this.id.replace("map", "")
							.replace("_1", "")
							.replace("_2", "")
							.replace("_3", "")
							.replace("_4", "")
							.replace("_5", "");
							
			// set other values to null
			$('#id_form-0-image').val(null);
			$('#id_form-0-audio').val(null);
			$('#id_form-0-note').val(null);
			$('#id_form-0-interview').val(null);
			$('#id_form-0-mapSnap').val(id);
			// remove any uploaded images
			resetFormElement( $('#id_form-0-uploadImage') );			
			resetFormElement( $('#readonlyField_1') );			
			// set name of selected in the form field
			$('#readonlyField_1').attr('placeholder', "Map Number " + id);
			selected_1 = true;
		}
	});
	
	
	// highlighting for section 2
	$(".imageSelect_2").click(function() {
		if ($(this).hasClass("active")) {
			$(this).removeClass('active');
			$('#id_form-1-image').val(null);
			$('#readonlyField_2').attr('placeholder', 'Nothing Selected');
			selected_2 = false;
		} else {			
			// remove all other active classes and set clicked to active
	        $(".imageSelect_2").removeClass('active');
	        $(".audioSelect_2").removeClass('active');
	        $(".noteSelect_2").removeClass('active');
	        $(".interviewSelect_2").removeClass('active');
	        $(".mapSnapSelect_2").removeClass('active');
			$(this).addClass('active');
			// set other values to null
			$('#id_form-1-image').val(this.id);
			$('#id_form-1-audio').val(null);
			$('#id_form-1-note').val(null);
			$('#id_form-1-interview').val(null);
			$('#id_form-1-mapSnap').val(null);
			// remove any uploaded images
			resetFormElement( $('#id_form-1-uploadImage') );			
			resetFormElement( $('#readonlyField_2') );			
			// set name of selected in the form field
			$('#readonlyField_2').attr('placeholder', this.title);
			selected_2 = true;			
		}
	});

	$(".audioSelect_2").click(function() {
		if ($(this).hasClass("active")) {
			$(this).removeClass('active');
			$('#id_form-1-audio').val(null);
			$('#readonlyField_2').attr('placeholder', 'Nothing Selected');
			selected_2 = false;
		} else {
			// remove all other active classes and set clicked to active
	        $(".imageSelect_2").removeClass('active');
	        $(".audioSelect_2").removeClass('active');
	        $(".noteSelect_2").removeClass('active');
	        $(".interviewSelect_2").removeClass('active');
	        $(".mapSnapSelect_2").removeClass('active');
			$(this).addClass('active');
			// set other values to null
			$('#id_form-1-image').val(null);
			$('#id_form-1-audio').val(this.id);
			$('#id_form-1-note').val(null);
			$('#id_form-1-interview').val(null);
			$('#id_form-1-mapSnap').val(null);
			// remove any uploaded images
			resetFormElement( $('#id_form-1-uploadImage') );			
			resetFormElement( $('#readonlyField_2') );			
			// set name of selected in the form field
			$('#readonlyField_2').attr('placeholder', this.title);
			selected_2 = true;
		}
	});

	$(".noteSelect_2").click(function() {
		if ($(this).hasClass("active")) {
			$(this).removeClass('active');
			$('#id_form-1-note').val(null);
			$('#readonlyField_2').attr('placeholder', 'Nothing Selected');
			selected_2 = false;
		} else {
			// remove all other active classes and set clicked to active
	        $(".imageSelect_2").removeClass('active');
	        $(".audioSelect_2").removeClass('active');
	        $(".noteSelect_2").removeClass('active');
	        $(".interviewSelect_2").removeClass('active');
	        $(".mapSnapSelect_2").removeClass('active');
			$(this).addClass('active');
			// set other values to null
			$('#id_form-1-image').val(null);
			$('#id_form-1-audio').val(null);
			$('#id_form-1-note').val(this.id);
			$('#id_form-1-interview').val(null);
			$('#id_form-1-mapSnap').val(null);
			// remove any uploaded images
			resetFormElement( $('#id_form-1-uploadImage') );			
			resetFormElement( $('#readonlyField_2') );			
			// set name of selected in the form field
			$('#readonlyField_2').attr('placeholder', this.title);
			selected_2 = true;
		}
	});
	
	$(".interviewSelect_2").click(function() {
		if ($(this).hasClass("active")) {
			$(this).removeClass('active');
			$('#id_form-1-interview').val(null);
			$('#readonlyField_2').attr('placeholder', 'Nothing Selected');
			selected_2 = false;
		} else {
			// remove all other active classes and set clicked to active
	        $(".imageSelect_2").removeClass('active');
	        $(".audioSelect_2").removeClass('active');
	        $(".noteSelect_2").removeClass('active');
	        $(".interviewSelect_2").removeClass('active');
	        $(".mapSnapSelect_2").removeClass('active');
			$(this).addClass('active');
			// set other values to null
			$('#id_form-1-image').val(null);
			$('#id_form-1-audio').val(null);
			$('#id_form-1-note').val(null);
			$('#id_form-1-interview').val(this.id);
			$('#id_form-1-mapSnap').val(null);
			// remove any uploaded images
			resetFormElement( $('#id_form-1-uploadImage') );			
			resetFormElement( $('#readonlyField_2') );			
			// set name of selected in the form field
			$('#readonlyField_2').attr('placeholder', this.title);
			selected_2 = true;
		}
	});
	
	$(".mapSnapSelect_2").click(function() {
		if ($(this).hasClass("active")) {
			$(this).removeClass('active');
			$('#id_form-1-mapSnap').val(null);
			$('#readonlyField_2').attr('placeholder', 'Nothing Selected');
			selected_2 = false;
		} else {
			// remove all other active classes and set clicked to active
	        $(".imageSelect_2").removeClass('active');
	        $(".audioSelect_2").removeClass('active');
	        $(".noteSelect_2").removeClass('active');
	        $(".interviewSelect_2").removeClass('active');
	        $(".mapSnapSelect_2").removeClass('active');
			$(this).addClass('active');
			// get id num
			var id = this.id.replace("map", "")
							.replace("_1", "")
							.replace("_2", "")
							.replace("_3", "")
							.replace("_4", "")
							.replace("_5", "");
							
			// set other values to null
			$('#id_form-1-image').val(null);
			$('#id_form-1-audio').val(null);
			$('#id_form-1-note').val(null);
			$('#id_form-1-interview').val(null);
			$('#id_form-1-mapSnap').val(id);
			// remove any uploaded images
			resetFormElement( $('#id_form-1-uploadImage') );			
			resetFormElement( $('#readonlyField_2') );			
			// set name of selected in the form field
			$('#readonlyField_2').attr('placeholder', "Map Number " + id);
			selected_2 = true;
		}
	});
	
	
	
	// highlighting for section 3
	$(".imageSelect_3").click(function() {
		if ($(this).hasClass("active")) {
			$(this).removeClass('active');
			$('#id_form-2-image').val(null);
			$('#readonlyField_3').attr('placeholder', 'Nothing Selected');
			selected_3 = false;
		} else {			
			// remove all other active classes and set clicked to active
	        $(".imageSelect_3").removeClass('active');
	        $(".audioSelect_3").removeClass('active');
	        $(".noteSelect_3").removeClass('active');
	        $(".interviewSelect_3").removeClass('active');
	        $(".mapSnapSelect_3").removeClass('active');
			$(this).addClass('active');
			// set other values to null
			$('#id_form-2-image').val(this.id);
			$('#id_form-2-audio').val(null);
			$('#id_form-2-note').val(null);
			$('#id_form-2-interview').val(null);
			$('#id_form-2-mapSnap').val(null);
			// remove any uploaded images
			resetFormElement( $('#id_form-2-uploadImage') );			
			resetFormElement( $('#readonlyField_3') );			
			// set name of selected in the form field
			$('#readonlyField_3').attr('placeholder', this.title);
			selected_3 = true;			
		}
	});

	$(".audioSelect_3").click(function() {
		if ($(this).hasClass("active")) {
			$(this).removeClass('active');
			$('#id_form-2-audio').val(null);
			$('#readonlyField_3').attr('placeholder', 'Nothing Selected');
			selected_3 = false;
		} else {
			// remove all other active classes and set clicked to active
	        $(".imageSelect_3").removeClass('active');
	        $(".audioSelect_3").removeClass('active');
	        $(".noteSelect_3").removeClass('active');
	        $(".interviewSelect_3").removeClass('active');
	        $(".mapSnapSelect_3").removeClass('active');
			$(this).addClass('active');
			// set other values to null
			$('#id_form-2-image').val(null);
			$('#id_form-2-audio').val(this.id);
			$('#id_form-2-note').val(null);
			$('#id_form-2-interview').val(null);
			$('#id_form-2-mapSnap').val(null);
			// remove any uploaded images
			resetFormElement( $('#id_form-2-uploadImage') );			
			resetFormElement( $('#readonlyField_3') );			
			// set name of selected in the form field
			$('#readonlyField_3').attr('placeholder', this.title);
			selected_3 = true;
		}
	});

	$(".noteSelect_3").click(function() {
		if ($(this).hasClass("active")) {
			$(this).removeClass('active');
			$('#id_form-2-note').val(null);
			$('#readonlyField_3').attr('placeholder', 'Nothing Selected');
			selected_3 = false;
		} else {
			// remove all other active classes and set clicked to active
	        $(".imageSelect_3").removeClass('active');
	        $(".audioSelect_3").removeClass('active');
	        $(".noteSelect_3").removeClass('active');
	        $(".interviewSelect_3").removeClass('active');
	        $(".mapSnapSelect_3").removeClass('active');
			$(this).addClass('active');
			// set other values to null
			$('#id_form-2-image').val(null);
			$('#id_form-2-audio').val(null);
			$('#id_form-2-note').val(this.id);
			$('#id_form-2-interview').val(null);
			$('#id_form-2-mapSnap').val(null);
			// remove any uploaded images
			resetFormElement( $('#id_form-2-uploadImage') );			
			resetFormElement( $('#readonlyField_3') );			
			// set name of selected in the form field
			$('#readonlyField_3').attr('placeholder', this.title);
			selected_3 = true;
		}
	});
	
	$(".interviewSelect_3").click(function() {
		if ($(this).hasClass("active")) {
			$(this).removeClass('active');
			$('#id_form-2-interview').val(null);
			$('#readonlyField_3').attr('placeholder', 'Nothing Selected');
			selected_3 = false;
		} else {
			// remove all other active classes and set clicked to active
	        $(".imageSelect_3").removeClass('active');
	        $(".audioSelect_3").removeClass('active');
	        $(".noteSelect_3").removeClass('active');
	        $(".interviewSelect_3").removeClass('active');
	        $(".mapSnapSelect_3").removeClass('active');
			$(this).addClass('active');
			// set other values to null
			$('#id_form-2-image').val(null);
			$('#id_form-2-audio').val(null);
			$('#id_form-2-note').val(null);
			$('#id_form-2-interview').val(this.id);
			$('#id_form-2-mapSnap').val(null);
			// remove any uploaded images
			resetFormElement( $('#id_form-2-uploadImage') );			
			resetFormElement( $('#readonlyField_3') );			
			// set name of selected in the form field
			$('#readonlyField_3').attr('placeholder', this.title);
			selected_3 = true;
		}
	});
	
	$(".mapSnapSelect_3").click(function() {
		if ($(this).hasClass("active")) {
			$(this).removeClass('active');
			$('#id_form-2-mapSnap').val(null);
			$('#readonlyField_3').attr('placeholder', 'Nothing Selected');
			selected_3 = false;
		} else {
			// remove all other active classes and set clicked to active
	        $(".imageSelect_3").removeClass('active');
	        $(".audioSelect_3").removeClass('active');
	        $(".noteSelect_3").removeClass('active');
	        $(".interviewSelect_3").removeClass('active');
	        $(".mapSnapSelect_3").removeClass('active');
			$(this).addClass('active');
			// get id num
			var id = this.id.replace("map", "")
							.replace("_1", "")
							.replace("_2", "")
							.replace("_3", "")
							.replace("_4", "")
							.replace("_5", "");
							
			// set other values to null
			$('#id_form-2-image').val(null);
			$('#id_form-2-audio').val(null);
			$('#id_form-2-note').val(null);
			$('#id_form-2-interview').val(null);
			$('#id_form-2-mapSnap').val(id);
			// remove any uploaded images
			resetFormElement( $('#id_form-2-uploadImage') );			
			resetFormElement( $('#readonlyField_3') );			
			// set name of selected in the form field
			$('#readonlyField_3').attr('placeholder', "Map Number " + id);
			selected_3 = true;
		}
	});
	
	
	// highlighting for section 4
	$(".imageSelect_4").click(function() {
		if ($(this).hasClass("active")) {
			$(this).removeClass('active');
			$('#id_form-3-image').val(null);
			$('#readonlyField_4').attr('placeholder', 'Nothing Selected');
			selected_4 = false;
		} else {			
			// remove all other active classes and set clicked to active
	        $(".imageSelect_4").removeClass('active');
	        $(".audioSelect_4").removeClass('active');
	        $(".noteSelect_4").removeClass('active');
	        $(".interviewSelect_4").removeClass('active');
	        $(".mapSnapSelect_4").removeClass('active');
			$(this).addClass('active');
			// set other values to null
			$('#id_form-3-image').val(this.id);
			$('#id_form-3-audio').val(null);
			$('#id_form-3-note').val(null);
			$('#id_form-3-interview').val(null);
			$('#id_form-3-mapSnap').val(null);
			// remove any uploaded images
			resetFormElement( $('#id_form-3-uploadImage') );			
			resetFormElement( $('#readonlyField_4') );			
			// set name of selected in the form field
			$('#readonlyField_4').attr('placeholder', this.title);
			selected_4 = true;			
		}
	});

	$(".audioSelect_4").click(function() {
		if ($(this).hasClass("active")) {
			$(this).removeClass('active');
			$('#id_form-3-audio').val(null);
			$('#readonlyField_4').attr('placeholder', 'Nothing Selected');
			selected_4 = false;
		} else {
			// remove all other active classes and set clicked to active
	        $(".imageSelect_4").removeClass('active');
	        $(".audioSelect_4").removeClass('active');
	        $(".noteSelect_4").removeClass('active');
	        $(".interviewSelect_4").removeClass('active');
	        $(".mapSnapSelect_4").removeClass('active');
			$(this).addClass('active');
			// set other values to null
			$('#id_form-3-image').val(null);
			$('#id_form-3-audio').val(this.id);
			$('#id_form-3-note').val(null);
			$('#id_form-3-interview').val(null);
			$('#id_form-3-mapSnap').val(null);
			// remove any uploaded images
			resetFormElement( $('#id_form-3-uploadImage') );			
			resetFormElement( $('#readonlyField_4') );			
			// set name of selected in the form field
			$('#readonlyField_4').attr('placeholder', this.title);
			selected_4 = true;
		}
	});

	$(".noteSelect_4").click(function() {
		if ($(this).hasClass("active")) {
			$(this).removeClass('active');
			$('#id_form-3-note').val(null);
			$('#readonlyField_4').attr('placeholder', 'Nothing Selected');
			selected_4 = false;
		} else {
			// remove all other active classes and set clicked to active
	        $(".imageSelect_4").removeClass('active');
	        $(".audioSelect_4").removeClass('active');
	        $(".noteSelect_4").removeClass('active');
	        $(".interviewSelect_4").removeClass('active');
	        $(".mapSnapSelect_4").removeClass('active');
			$(this).addClass('active');
			// set other values to null
			$('#id_form-3-image').val(null);
			$('#id_form-3-audio').val(null);
			$('#id_form-3-note').val(this.id);
			$('#id_form-3-interview').val(null);
			$('#id_form-3-mapSnap').val(null);
			// remove any uploaded images
			resetFormElement( $('#id_form-3-uploadImage') );			
			resetFormElement( $('#readonlyField_4') );			
			// set name of selected in the form field
			$('#readonlyField_4').attr('placeholder', this.title);
			selected_4 = true;
		}
	});
	
	$(".interviewSelect_4").click(function() {
		if ($(this).hasClass("active")) {
			$(this).removeClass('active');
			$('#id_form-3-interview').val(null);
			$('#readonlyField_4').attr('placeholder', 'Nothing Selected');
			selected_4 = false;
		} else {
			// remove all other active classes and set clicked to active
	        $(".imageSelect_4").removeClass('active');
	        $(".audioSelect_4").removeClass('active');
	        $(".noteSelect_4").removeClass('active');
	        $(".interviewSelect_4").removeClass('active');
	        $(".mapSnapSelect_4").removeClass('active');
			$(this).addClass('active');
			// set other values to null
			$('#id_form-3-image').val(null);
			$('#id_form-3-audio').val(null);
			$('#id_form-3-note').val(null);
			$('#id_form-3-interview').val(this.id);
			$('#id_form-3-mapSnap').val(null);
			// remove any uploaded images
			resetFormElement( $('#id_form-3-uploadImage') );			
			resetFormElement( $('#readonlyField_4') );			
			// set name of selected in the form field
			$('#readonlyField_4').attr('placeholder', this.title);
			selected_4 = true;
		}
	});
	
	$(".mapSnapSelect_4").click(function() {
		if ($(this).hasClass("active")) {
			$(this).removeClass('active');
			$('#id_form-3-mapSnap').val(null);
			$('#readonlyField_4').attr('placeholder', 'Nothing Selected');
			selected_4 = false;
		} else {
			// remove all other active classes and set clicked to active
	        $(".imageSelect_4").removeClass('active');
	        $(".audioSelect_4").removeClass('active');
	        $(".noteSelect_4").removeClass('active');
	        $(".interviewSelect_4").removeClass('active');
	        $(".mapSnapSelect_4").removeClass('active');
			$(this).addClass('active');
			// get id num
			var id = this.id.replace("map", "")
							.replace("_1", "")
							.replace("_2", "")
							.replace("_3", "")
							.replace("_4", "")
							.replace("_5", "");
							
			// set other values to null
			$('#id_form-3-image').val(null);
			$('#id_form-3-audio').val(null);
			$('#id_form-3-note').val(null);
			$('#id_form-3-interview').val(null);
			$('#id_form-3-mapSnap').val(id);
			// remove any uploaded images
			resetFormElement( $('#id_form-3-uploadImage') );			
			resetFormElement( $('#readonlyField_4') );			
			// set name of selected in the form field
			$('#readonlyField_4').attr('placeholder', "Map Number " + id);
			selected_4 = true;
		}
	});
	
	
	
	// highlighting for section 5
	$(".imageSelect_5").click(function() {
		if ($(this).hasClass("active")) {
			$(this).removeClass('active');
			$('#id_form-4-image').val(null);
			$('#readonlyField_5').attr('placeholder', 'Nothing Selected');
			selected_5 = false;
		} else {			
			// remove all other active classes and set clicked to active
	        $(".imageSelect_5").removeClass('active');
	        $(".audioSelect_5").removeClass('active');
	        $(".noteSelect_5").removeClass('active');
	        $(".interviewSelect_5").removeClass('active');
	        $(".mapSnapSelect_5").removeClass('active');
			$(this).addClass('active');
			// set other values to null
			$('#id_form-4-image').val(this.id);
			$('#id_form-4-audio').val(null);
			$('#id_form-4-note').val(null);
			$('#id_form-4-interview').val(null);
			$('#id_form-4-mapSnap').val(null);
			// remove any uploaded images
			resetFormElement( $('#id_form-4-uploadImage') );			
			resetFormElement( $('#readonlyField_5') );			
			// set name of selected in the form field
			$('#readonlyField_5').attr('placeholder', this.title);
			selected_5 = true;			
		}
	});

	$(".audioSelect_5").click(function() {
		if ($(this).hasClass("active")) {
			$(this).removeClass('active');
			$('#id_form-4-audio').val(null);
			$('#readonlyField_5').attr('placeholder', 'Nothing Selected');
			selected_5 = false;
		} else {
			// remove all other active classes and set clicked to active
	        $(".imageSelect_5").removeClass('active');
	        $(".audioSelect_5").removeClass('active');
	        $(".noteSelect_5").removeClass('active');
	        $(".interviewSelect_5").removeClass('active');
	        $(".mapSnapSelect_5").removeClass('active');
			$(this).addClass('active');
			// set other values to null
			$('#id_form-4-image').val(null);
			$('#id_form-4-audio').val(this.id);
			$('#id_form-4-note').val(null);
			$('#id_form-4-interview').val(null);
			$('#id_form-4-mapSnap').val(null);
			// remove any uploaded images
			resetFormElement( $('#id_form-4-uploadImage') );			
			resetFormElement( $('#readonlyField_5') );			
			// set name of selected in the form field
			$('#readonlyField_5').attr('placeholder', this.title);
			selected_5 = true;
		}
	});

	$(".noteSelect_5").click(function() {
		if ($(this).hasClass("active")) {
			$(this).removeClass('active');
			$('#id_form-4-note').val(null);
			$('#readonlyField_5').attr('placeholder', 'Nothing Selected');
			selected_5 = false;
		} else {
			// remove all other active classes and set clicked to active
	        $(".imageSelect_5").removeClass('active');
	        $(".audioSelect_5").removeClass('active');
	        $(".noteSelect_5").removeClass('active');
	        $(".interviewSelect_5").removeClass('active');
	        $(".mapSnapSelect_5").removeClass('active');
			$(this).addClass('active');
			// set other values to null
			$('#id_form-4-image').val(null);
			$('#id_form-4-audio').val(null);
			$('#id_form-4-note').val(this.id);
			$('#id_form-4-interview').val(null);
			$('#id_form-4-mapSnap').val(null);
			// remove any uploaded images
			resetFormElement( $('#id_form-4-uploadImage') );			
			resetFormElement( $('#readonlyField_5') );			
			// set name of selected in the form field
			$('#readonlyField_5').attr('placeholder', this.title);
			selected_5 = true;
		}
	});
	
	$(".interviewSelect_5").click(function() {
		if ($(this).hasClass("active")) {
			$(this).removeClass('active');
			$('#id_form-4-interview').val(null);
			$('#readonlyField_5').attr('placeholder', 'Nothing Selected');
			selected_5 = false;
		} else {
			// remove all other active classes and set clicked to active
	        $(".imageSelect_5").removeClass('active');
	        $(".audioSelect_5").removeClass('active');
	        $(".noteSelect_5").removeClass('active');
	        $(".interviewSelect_5").removeClass('active');
	        $(".mapSnapSelect_5").removeClass('active');
			$(this).addClass('active');
			// set other values to null
			$('#id_form-4-image').val(null);
			$('#id_form-4-audio').val(null);
			$('#id_form-4-note').val(null);
			$('#id_form-4-interview').val(this.id);
			$('#id_form-4-mapSnap').val(null);
			// remove any uploaded images
			resetFormElement( $('#id_form-4-uploadImage') );			
			resetFormElement( $('#readonlyField_5') );			
			// set name of selected in the form field
			$('#readonlyField_5').attr('placeholder', this.title);
			selected_5 = true;
		}
	});
	
	$(".mapSnapSelect_5").click(function() {
		if ($(this).hasClass("active")) {
			$(this).removeClass('active');
			$('#id_form-4-mapSnap').val(null);
			$('#readonlyField_5').attr('placeholder', 'Nothing Selected');
			selected_5 = false;
		} else {
			// remove all other active classes and set clicked to active
	        $(".imageSelect_5").removeClass('active');
	        $(".audioSelect_5").removeClass('active');
	        $(".noteSelect_5").removeClass('active');
	        $(".interviewSelect_5").removeClass('active');
	        $(".mapSnapSelect_5").removeClass('active');
			$(this).addClass('active');
			// get id num
			var id = this.id.replace("map", "")
							.replace("_1", "")
							.replace("_2", "")
							.replace("_3", "")
							.replace("_4", "")
							.replace("_5", "");
							
			// set other values to null
			$('#id_form-4-image').val(null);
			$('#id_form-4-audio').val(null);
			$('#id_form-4-note').val(null);
			$('#id_form-4-interview').val(null);
			$('#id_form-4-mapSnap').val(id);
			// remove any uploaded images
			resetFormElement( $('#id_form-4-uploadImage') );			
			resetFormElement( $('#readonlyField_5') );			
			// set name of selected in the form field
			$('#readonlyField_5').attr('placeholder', "Map Number " + id);
			selected_5 = true;
		}
	});
	
	



	// set up but-file type listener on fileselect
    $('.btn-file :file').on('fileselect', function(event, numFiles, label) {       
        var input = $(this).parents('.fileGroup').find(':text'),
            log = numFiles > 1 ? numFiles + ' files selected' : label;        
        if( input.length ) {
            input.val(log);
        } else {
            if( log ) alert(log);
        }
		// deselect all other areas
		if (this.id == 'id_form-0-uploadImage') {
			// remove all other active classes and set clicked to active
	        $(".imageSelect_1").removeClass('active');
	        $(".audioSelect_1").removeClass('active');
	        $(".noteSelect_1").removeClass('active');
	        $(".interviewSelect_1").removeClass('active');
	        $(".mapSnapSelect_1").removeClass('active');
			// set other values to null
			$('#id_form-0-image').val(null);
			$('#id_form-0-audio').val(null);
			$('#id_form-0-note').val(null);
			$('#id_form-0-interview').val(null);
			$('#id_form-0-mapSnap').val(null);			
		}       
		if (this.id == 'id_form-1-uploadImage') {
			// remove all other active classes and set clicked to active
	        $(".imageSelect_2").removeClass('active');
	        $(".audioSelect_2").removeClass('active');
	        $(".noteSelect_2").removeClass('active');
	        $(".interviewSelect_2").removeClass('active');
	        $(".mapSnapSelect_2").removeClass('active');
			// set other values to null
			$('#id_form-1-image').val(null);
			$('#id_form-1-audio').val(null);
			$('#id_form-1-note').val(null);
			$('#id_form-1-interview').val(null);
			$('#id_form-1-mapSnap').val(null);			
		}  
		if (this.id == 'id_form-2-uploadImage') {
			// remove all other active classes and set clicked to active
	        $(".imageSelect_3").removeClass('active');
	        $(".audioSelect_3").removeClass('active');
	        $(".noteSelect_3").removeClass('active');
	        $(".interviewSelect_3").removeClass('active');
	        $(".mapSnapSelect_3").removeClass('active');
			// set other values to null
			$('#id_form-2-image').val(null);
			$('#id_form-2-audio').val(null);
			$('#id_form-2-note').val(null);
			$('#id_form-2-interview').val(null);
			$('#id_form-2-mapSnap').val(null);			
		}  
		if (this.id == 'id_form-3-uploadImage') {
			// remove all other active classes and set clicked to active
	        $(".imageSelect_4").removeClass('active');
	        $(".audioSelect_4").removeClass('active');
	        $(".noteSelect_4").removeClass('active');
	        $(".interviewSelect_4").removeClass('active');
	        $(".mapSnapSelect_4").removeClass('active');
			// set other values to null
			$('#id_form-3-image').val(null);
			$('#id_form-3-audio').val(null);
			$('#id_form-3-note').val(null);
			$('#id_form-3-interview').val(null);
			$('#id_form-3-mapSnap').val(null);			
		} 
		if (this.id == 'id_form-4-uploadImage') {
			// remove all other active classes and set clicked to active
	        $(".imageSelect_5").removeClass('active');
	        $(".audioSelect_5").removeClass('active');
	        $(".noteSelect_5").removeClass('active');
	        $(".interviewSelect_5").removeClass('active');
	        $(".mapSnapSelect_5").removeClass('active');
			// set other values to null
			$('#id_form-4-image').val(null);
			$('#id_form-4-audio').val(null);
			$('#id_form-4-note').val(null);
			$('#id_form-4-interview').val(null);
			$('#id_form-4-mapSnap').val(null);			
		}       

    });
		
	// when file select buttons are clicked add in the file name
	$(document).on('change', '.btn-file :file', function() {
		var input = $(this),
		numFiles = input.get(0).files ? input.get(0).files.length : 1,
		label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
		input.trigger('fileselect', [numFiles, label]);
	});


	// set class to active on edit form if media or map snap was selected previously
	if ( $('#id_form-0-image').val() != '' ) {
		$( "#imageSelect_1 > #" + $('#id_form-0-image').val() ).addClass('active');	
		$('#readonlyField_1').attr('placeholder', $( "#imageSelect_1 > #" + $('#id_form-0-image').val() )[0].title);
	}
	if ( $('#id_form-0-audio').val() != '' ) {
		$( "#audioSelect_1 > #" + $('#id_form-0-audio').val() ).addClass('active');
		$('#readonlyField_1').attr('placeholder', $( "#audioSelect_1 > #" + $('#id_form-0-audio').val() )[0].title);
	}
	if ( $('#id_form-0-note').val() != '' ) {
		$( "#noteSelect_1 > #" + $('#id_form-0-note').val() ).addClass('active');
		$('#readonlyField_1').attr('placeholder', $( "#noteSelect_1 > #" + $('#id_form-0-note').val() )[0].title);
	}
	if ( $('#id_form-0-interview').val() != '' ) {
		$( "#interviewSelect_1 > #" + $('#id_form-0-interview').val() ).addClass('active');
		$('#readonlyField_1').attr('placeholder', $( "#interviewSelect_1 > #" + $('#id_form-0-interview').val() )[0].title);
	}
	if ( $('#id_form-0-mapSnap').val() != '' ) {
		$( "#map" + $('#id_form-0-mapSnap').val() + "_1" ).addClass('active');
		// get id num
		var id = $("#map" + $('#id_form-0-mapSnap').val() + "_1" )[0].id.replace("map", "")
						.replace("_1", "")
						.replace("_2", "")
						.replace("_3", "")
						.replace("_4", "")
						.replace("_5", "");
		
		$('#readonlyField_1').attr('placeholder', "Map Number " + id);
	}
	
	// set class to active on edit form if media or map snap was selected previously
	if ( $('#id_form-1-image').val() != '' ) {
		$( "#imageSelect_2 > #" + $('#id_form-1-image').val() ).addClass('active');	
		$('#readonlyField_2').attr('placeholder', $( "#imageSelect_2 > #" + $('#id_form-1-image').val() )[0].title);
	}
	if ( $('#id_form-1-audio').val() != '' ) {
		$( "#audioSelect_2 > #" + $('#id_form-1-audio').val() ).addClass('active');
		$('#readonlyField_2').attr('placeholder', $( "#audioSelect_2 > #" + $('#id_form-1-audio').val() )[0].title);
	}
	if ( $('#id_form-1-note').val() != '' ) {
		$( "#noteSelect_2 > #" + $('#id_form-1-note').val() ).addClass('active');
		$('#readonlyField_2').attr('placeholder', $( "#noteSelect_2 > #" + $('#id_form-1-note').val() )[0].title);
	}
	if ( $('#id_form-1-interview').val() != '' ) {
		$( "#interviewSelect_2 > #" + $('#id_form-1-interview').val() ).addClass('active');
		$('#readonlyField_2').attr('placeholder', $( "#interviewSelect_2 > #" + $('#id_form-1-interview').val() )[0].title);
	}
	if ( $('#id_form-1-mapSnap').val() != '' ) {
		$( "#map" + $('#id_form-1-mapSnap').val() + "_2" ).addClass('active');
		// get id num
		var id = $("#map" + $('#id_form-1-mapSnap').val() + "_2" )[0].id.replace("map", "")
						.replace("_1", "")
						.replace("_2", "")
						.replace("_3", "")
						.replace("_4", "")
						.replace("_5", "");
		
		$('#readonlyField_2').attr('placeholder', "Map Number " + id);
	}
	
	// set class to active on edit form if media or map snap was selected previously
	if ( $('#id_form-2-image').val() != '' ) {
		$( "#imageSelect_3 > #" + $('#id_form-2-image').val() ).addClass('active');	
		$('#readonlyField_3').attr('placeholder', $( "#imageSelect_3 > #" + $('#id_form-2-image').val() )[0].title);
	}
	if ( $('#id_form-2-audio').val() != '' ) {
		$( "#audioSelect_3 > #" + $('#id_form-2-audio').val() ).addClass('active');
		$('#readonlyField_3').attr('placeholder', $( "#audioSelect_3 > #" + $('#id_form-2-audio').val() )[0].title);
	}
	if ( $('#id_form-2-note').val() != '' ) {
		$( "#noteSelect_3 > #" + $('#id_form-2-note').val() ).addClass('active');
		$('#readonlyField_3').attr('placeholder', $( "#noteSelect_3 > #" + $('#id_form-2-note').val() )[0].title);
	}
	if ( $('#id_form-2-interview').val() != '' ) {
		$( "#interviewSelect_3 > #" + $('#id_form-2-interview').val() ).addClass('active');
		$('#readonlyField_3').attr('placeholder', $( "#interviewSelect_3 > #" + $('#id_form-2-interview').val() )[0].title);
	}
	if ( $('#id_form-2-mapSnap').val() != '' ) {
		$( "#map" + $('#id_form-2-mapSnap').val() + "_3" ).addClass('active');
		// get id num
		var id = $("#map" + $('#id_form-2-mapSnap').val() + "_3" )[0].id.replace("map", "")
						.replace("_1", "")
						.replace("_2", "")
						.replace("_3", "")
						.replace("_4", "")
						.replace("_5", "");
		
		$('#readonlyField_3').attr('placeholder', "Map Number " + id);
	}
	
	// set class to active on edit form if media or map snap was selected previously
	if ( $('#id_form-3-image').val() != '' ) {
		$( "#imageSelect_4 > #" + $('#id_form-3-image').val() ).addClass('active');	
		$('#readonlyField_4').attr('placeholder', $( "#imageSelect_4 > #" + $('#id_form-3-image').val() )[0].title);
	}
	if ( $('#id_form-3-audio').val() != '' ) {
		$( "#audioSelect_4 > #" + $('#id_form-3-audio').val() ).addClass('active');
		$('#readonlyField_4').attr('placeholder', $( "#audioSelect_4 > #" + $('#id_form-3-audio').val() )[0].title);
	}
	if ( $('#id_form-3-note').val() != '' ) {
		$( "#noteSelect_4 > #" + $('#id_form-3-note').val() ).addClass('active');
		$('#readonlyField_4').attr('placeholder', $( "#noteSelect_4 > #" + $('#id_form-3-note').val() )[0].title);
	}
	if ( $('#id_form-3-interview').val() != '' ) {
		$( "#interviewSelect_4 > #" + $('#id_form-3-interview').val() ).addClass('active');
		$('#readonlyField_4').attr('placeholder', $( "#interviewSelect_4 > #" + $('#id_form-3-interview').val() )[0].title);
	}
	if ( $('#id_form-3-mapSnap').val() != '' ) {
		$( "#map" + $('#id_form-3-mapSnap').val() + "_4" ).addClass('active');
		// get id num
		var id = $("#map" + $('#id_form-3-mapSnap').val() + "_4" )[0].id.replace("map", "")
						.replace("_1", "")
						.replace("_2", "")
						.replace("_3", "")
						.replace("_4", "")
						.replace("_5", "");
		
		$('#readonlyField_4').attr('placeholder', "Map Number " + id);
	}
	
	// set class to active on edit form if media or map snap was selected previously
	if ( $('#id_form-4-image').val() != '' ) {
		$( "#imageSelect_5 > #" + $('#id_form-4-image').val() ).addClass('active');	
		$('#readonlyField_5').attr('placeholder', $( "#imageSelect_5 > #" + $('#id_form-4-image').val() )[0].title);
	}
	if ( $('#id_form-4-audio').val() != '' ) {
		$( "#audioSelect_5 > #" + $('#id_form-4-audio').val() ).addClass('active');
		$('#readonlyField_5').attr('placeholder', $( "#audioSelect_5 > #" + $('#id_form-4-audio').val() )[0].title);
	}
	if ( $('#id_form-4-note').val() != '' ) {
		$( "#noteSelect_5 > #" + $('#id_form-4-note').val() ).addClass('active');
		$('#readonlyField_5').attr('placeholder', $( "#noteSelect_5 > #" + $('#id_form-4-note').val() )[0].title);
	}
	if ( $('#id_form-4-interview').val() != '' ) {
		$( "#interviewSelect_5 > #" + $('#id_form-4-interview').val() ).addClass('active');
		$('#readonlyField_5').attr('placeholder', $( "#interviewSelect_5 > #" + $('#id_form-4-interview').val() )[0].title);
	}
	if ( $('#id_form-4-mapSnap').val() != '' ) {
		$( "#map" + $('#id_form-4-mapSnap').val() + "_5" ).addClass('active');
		// get id num
		var id = $("#map" + $('#id_form-4-mapSnap').val() + "_5" )[0].id.replace("map", "")
						.replace("_1", "")
						.replace("_2", "")
						.replace("_3", "")
						.replace("_4", "")
						.replace("_5", "");
		
		$('#readonlyField_5').attr('placeholder', "Map Number " + id);
	}
	


});

// for clearing upload input elements	
function resetFormElement(e) {
    e.wrap('<form>').closest('form').get(0).reset();
    e.unwrap();	
}

