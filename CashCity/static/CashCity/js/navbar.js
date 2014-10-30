/**
 * navbar.js: toggles navigation to active for all menus
 * Author: NiJeL
 */

$( document ).ready(function() {
	// for navbars, set active if clicked
	$('.nav li').removeClass('active');
	// for trunk url select map, for all others select class
	if (location.pathname.split("/")[1] == '') {
		$('#navMapTab').addClass('active');
	} else {
		$('ul.nav a[href^="/' + location.pathname.split("/")[1] + '"]').parent().addClass('active');		
	}
});

