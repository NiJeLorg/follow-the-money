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
		
		console.log(this.files[0].type);
		if (this.files[0].size > 20000000) {
			alert("Your file may be too big to upload on cellular network. Please consider uploading your file later over wifi.");
		}

		if (this.files[0].type != "video/quicktime" && this.files[0].type != "video/mp4" && this.files[0].type != "video/gp3" && this.files[0].type != "audio/mpeg" && this.files[0].type != "audio/amr" && this.files[0].type != "audio/mp3" && this.files[0].type != "image/gif" && this.files[0].type != "image/jpeg" && this.files[0].type != "image/png" && this.files[0].type != "image/tiff" && this.files[0].type != "image/bmp") {
			alert("The type of file you're trying to upload is not supported. Please try another type of file.");
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

	$('#audioForm').submit(function(ev) {
		var btn = $(document.activeElement);
		console.log(btn[0].value);
		if (btn[0].value != "cancel") {
			// check extension and alert if unsupported extension
			var ext = $('#id_audio').val().split('.').pop().toLowerCase();
			if($.inArray(ext, ['mov','gp3','mp4','amr', 'mp3']) == -1) {
				$("body").removeClass("loading");
			    alert('The type of file you\'re trying to upload is not supported. You can upload .mov, .gp3, .mp4, .amr, or .mp3 files when adding audio. Please try again.');
			    ev.preventDefault();
			}
		}
	});

	$('#imageForm').submit(function(ev) {
		var btn = $(document.activeElement);
		console.log(btn[0].value);
		if (btn[0].value != "cancel") {
			// check extension and alert if unsupported extension
			var ext = $('#id_image').val().split('.').pop().toLowerCase();
			if($.inArray(ext, ['gif','jpg','jpeg','png','tiff','tif','bmp']) == -1) {
				$("body").removeClass("loading");
			    alert('The type of file you\'re trying to upload is not supported. You can upload .gif, .jpg/.jpeg, .png, .tif/.tiff, or .bmp files when adding images. Please try again.');
			    ev.preventDefault();
			}
		}
	});

	$('#interviewForm').submit(function(ev) {
		var btn = $(document.activeElement);
		console.log(btn[0].value);
		if (btn[0].value != "cancel") {
			// check extension and alert if unsupported extension
			var extImg = $('#id_image').val().split('.').pop().toLowerCase();
			if($.inArray(extImg, ['gif','jpg','jpeg','png','tiff','tif','bmp']) == -1) {
				$("body").removeClass("loading");
			    alert('The type of file you\'re trying to upload is not supported. You can upload .gif, .jpg/.jpeg, .png, .tif/.tiff, or .bmp files when adding images. Please try again.');
			    ev.preventDefault();
			}

			var extAud = $('#id_audio').val().split('.').pop().toLowerCase();
			if($.inArray(extAud, ['mov','gp3','mp4','amr', 'mp3']) == -1) {
				$("body").removeClass("loading");
			    alert('The type of file you\'re trying to upload is not supported. You can upload .mov, .gp3, .mp4, .amr, or .mp3 files when adding audio. Please try again.');
			    ev.preventDefault();
			}
		}
	});
	
		
});

// when file select buttons are clicked add in the file name
$(document).on('change', '.btn-file :file', function() {
	var input = $(this),
	numFiles = input.get(0).files ? input.get(0).files.length : 1,
	label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
	input.trigger('fileselect', [numFiles, label]);
});

