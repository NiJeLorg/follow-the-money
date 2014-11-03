/**
 * navbar.js: toggles navigation to active for all menus
 * Author: NiJeL
 */

$( document ).ready(function() {
	// for navbars, set active if clicked
	$('.nav li').removeClass('active');
	// for trunk url select map, for all others select class
	if (location.pathname.split("/")[2] == '') {
		$('#navMapTab').addClass('active');
	} else {
		$('ul.nav a[href^="/cashcity/' + location.pathname.split("/")[2] + '"]').parent().addClass('active');		
	}
});

