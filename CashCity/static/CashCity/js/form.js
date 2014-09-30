/**
 * form.js: javascript that controls actions on forms
 * Author: NiJeL
 */

$(document).ready( function() {
	
	// set up but-file type listener on fileselect
    $('.btn-file :file').on('fileselect', function(event, numFiles, label) {       
        var input = $(this).parents('.input-group').find(':text'),
            log = numFiles > 1 ? numFiles + ' files selected' : label;        
        if( input.length ) {
            input.val(log);
        } else {
            if( log ) alert(log);
        }       
    });
	
	// call and render map in form when page is ready
    var formMap = new FormMap();
	formMap.addGeoSearch();
	
	// if address exists, add it to the #leaflet-control-geosearch-qry field
	if (initialAddress != '') {
		$('#leaflet-control-geosearch-qry').attr("value", initialAddress)
	}
		
	// show loading modal when publish or save draft buttons are clicked
	$('#publish').click( function() {
		$("body").addClass("loading");
	});

	$('#saveDraft').click( function() {
		$("body").addClass("loading");
	});
	
		
});

// when file select buttons are clicked add in the file name
$(document).on('change', '.btn-file :file', function() {
	var input = $(this),
	numFiles = input.get(0).files ? input.get(0).files.length : 1,
	label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
	input.trigger('fileselect', [numFiles, label]);
});

