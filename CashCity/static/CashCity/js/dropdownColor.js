/**
 * dropdownColor.js: sets the color in the main part of the dropdown based on the value selected
 * Author: NiJeL
 */

$( document ).ready(function() {

	$('#id_color').selectpicker();

	$('#id_color').change(function() {
	    var value = $(this).val();	
		$(this).removeClass();
		$(this).addClass( "form-control" );		
		$(this).addClass( value );
		$(".bootstrap-select").removeClass('green');
		$(".bootstrap-select").removeClass('orange');
		$(".bootstrap-select").removeClass('pink');
		$(".bootstrap-select").removeClass('purple');
		$(".bootstrap-select").removeClass('red');
		$(".bootstrap-select").removeClass('yellow');
		$("#id_color").selectpicker('refresh');	
	});
	
});

